import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { readPlanner, writePlanner, dueRows, isCaseStudy, latestPillarSlug, type Row } from './planner.ts'
import { createWriter, voiceTells, type Writer, type Article, type Brief, type WriterContext } from './writer.ts'
import { createUnsplash, type ImageSource } from './unsplash.ts'

export interface Deps {
  writer: Writer
  images: ImageSource
  today: string
  root: string
  git: (args: string[]) => void
  log: (s: string) => void
}

const COPY_NOTES = ['voice.md', 'copy-frameworks.md', 'natural-transitions.md']

function readIf(file: string) { return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '' }

async function loadContent(root: string) {
  process.env.CONTENT_DIR = path.join(root, 'content')
  return import('../lib/content.ts')
}

function contextFor(root: string, row: Row, content: Awaited<ReturnType<typeof loadContent>>, log: (s: string) => void): WriterContext {
  const dir = row.type === 'pillar' ? 'pillars' : 'posts'
  const pick = (locale: 'en' | 'id') => {
    const items = row.type === 'pillar'
      ? [...content.getPillarPages(undefined, locale)].sort((a, b) => b.date.localeCompare(a.date))
      : content.getBlogPosts({ locale, limit: 1000 }).posts
    // Prefer the cleanest-voiced published pieces as exemplars, not the newest.
    return items
      .map((p) => readIf(path.join(root, 'content', dir, `${p.slug}.${locale}.md`)))
      .filter(Boolean)
      .map((t) => ({ t, score: voiceTells(t).dashPer1k + voiceTells(t).reversals.length * 5 }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 2)
      .map((x) => x.t)
  }
  const published = [
    ...content.getPillarPages(row.category).map((p) => ({ slug: p.slug, title: p.title, type: 'pillar' as const })),
    ...content.getBlogPosts({ categorySlug: row.category, limit: 1000 }).posts.map((p) => ({ slug: p.slug, title: p.title, type: 'regular' as const })),
  ]
  const used = [...content.getBlogPosts({ limit: 1000 }).posts, ...content.getPillarPages()].map((p) => p.slug)
  const design = readIf(path.join(root, 'design.md'))
  const honest = design.split('\n').find((l) => l.includes('Honest copy')) ?? 'Honest copy: no invented metrics, client names, or testimonials.'
  const prompts = path.join(root, 'scripts/prompts')
  const copyNotes = COPY_NOTES.map((f) => {
    const text = readIf(path.join(prompts, f))
    if (!text) log(`copy notes missing: ${f}`)
    return text
  }).join('\n\n')
  return {
    row,
    productContext: readIf(path.join(root, '.agents/product-marketing.md')),
    honestCopyRule: honest.trim(),
    copyNotes,
    exemplars: { en: pick('en'), id: pick('id') },
    published,
    usedSlugs: used,
  }
}

function toFile(article: Article, extra: Record<string, unknown>) {
  const fm = { ...article.frontmatter, ...extra }
  for (const k of Object.keys(fm)) if (fm[k] === undefined) delete fm[k]
  return matter.stringify(article.body, fm)
}


/* One extra edit call at most when the measured tells exceed the live posts'
 * ceiling (about 3 dashes per 1000 words, zero reversals). */
const DASH_CEILING = 2
async function voiceGuard(deps: Deps, ctx: WriterContext, brief: Brief, locale: 'en' | 'id', article: Article, english?: Article): Promise<Article> {
  const t = voiceTells(article.body)
  if (t.dashPer1k <= DASH_CEILING && t.reversals.length === 0 && t.verdicts.length === 0) return article
  const notes = [
    t.dashPer1k > DASH_CEILING ? `- ${t.dashes} dashes in ${t.words} words; remove all of them.` : '',
    ...t.reversals.map((r) => `- reversal: "${r.slice(0, 160)}"`),
    ...t.verdicts.map((v) => `- one-line verdict: "${v}"`),
  ].filter(Boolean).join('\n')
  deps.log(`voice guard (${locale}): ${t.dashes} dashes, ${t.reversals.length} reversals, ${t.verdicts.length} verdicts; re-editing`)
  const fixed = await deps.writer.edit(ctx, brief, locale, article, english, notes)
  const after = voiceTells(fixed.body)
  deps.log(`voice guard (${locale}) after: ${after.dashes} dashes, ${after.reversals.length} reversals, ${after.verdicts.length} verdicts`)
  return fixed
}

export async function run(opts: { dryRun: boolean; titleFilter?: string }, deps: Deps) {
  const plannerFile = path.join(deps.root, 'content/planner.csv')
  const rows = readPlanner(plannerFile)
  let due = dueRows(rows, deps.today, opts.titleFilter)
  if (opts.titleFilter && due.length > 1) {
    const sorted = [...due].sort((a, b) => a.date.localeCompare(b.date))
    deps.log(`title filter matched ${due.length} rows; using "${sorted[0].title}"`)
    due = [sorted[0]]
  }
  const result = { published: [] as string[], needsInput: [] as string[], failed: [] as string[], gitFailed: [] as string[], noMatch: false }
  if (opts.titleFilter && due.length === 0) {
    deps.log('title filter matched no todo row')
    result.noMatch = true
  }
  deps.log(`${due.length} due row(s)`)

  // Persisting the planner and committing/pushing is isolated from content
  // work: a git failure here must never trigger the content-cleanup path
  // (which would delete files that are already committed) and must never
  // re-run save() for the same row.
  const saveRow = (row: Row, patch: Partial<Row>, files: string[], message: string) => {
    Object.assign(row, patch)
    if (opts.dryRun) return
    try {
      writePlanner(plannerFile, rows)
      deps.git(['add', 'content/planner.csv', ...files])
      deps.git(['commit', '-m', message])
      deps.git(['push'])
    } catch (e) {
      deps.log(`git failed for "${row.title}": ${(e as Error).message}`)
      result.gitFailed.push(row.title)
    }
  }

  for (const row of due) {
    // Anything in the case-studies category is a client story, whatever its
    // title, so it is gated exactly like a "Case Study: ..." row: no facts,
    // no article. Client stories must never be invented.
    if ((isCaseStudy(row) || row.category === 'case-studies') && !row.facts.trim()) {
      deps.log(`needs-input: ${row.title}`)
      result.needsInput.push(row.title)
      saveRow(row, { status: 'needs-input' }, [], `content: "${row.title}" needs client facts`)
      continue
    }

    const written: string[] = []
    let brief: Brief | undefined
    let contentError: Error | undefined
    try {
      const content = await loadContent(deps.root)
      if (!content.getCategoryBySlug(row.category)) throw new Error(`unknown category ${row.category}`)
      const ctx = contextFor(deps.root, row, content, deps.log)
      brief = await deps.writer.brief(ctx)
      deps.log(`brief ${brief.slug}: ${JSON.stringify(brief)}`)

      const enDraft = await deps.writer.write(ctx, brief, 'en')
      const en = await voiceGuard(deps, ctx, brief, 'en', await deps.writer.edit(ctx, brief, 'en', enDraft))
      const idDraft = await deps.writer.write(ctx, brief, 'id', en)
      const id = await voiceGuard(deps, ctx, brief, 'id', await deps.writer.edit(ctx, brief, 'id', idDraft, en), en)

      const dir = row.type === 'pillar' ? 'pillars' : 'posts'
      const extra: Record<string, unknown> = { date: deps.today, updated: deps.today, category: row.category, author: 'tika-aurora' }
      if (row.type === 'regular') extra.pillar = latestPillarSlug(content.getPillarPages(), row.category)

      let photo = null
      try { photo = opts.dryRun ? null : await deps.images.find(brief.unsplashQuery) } catch (e) { deps.log(`image skipped: ${(e as Error).message}`) }
      // Photos are hotlinked from the Unsplash CDN, never stored in the repo.
      if (photo) Object.assign(extra, { image: photo.url, imageAlt: photo.alt, imageCredit: photo.credit })

      for (const [locale, article] of [['en', en], ['id', id]] as const) {
        const rel = path.join('content', dir, `${brief.slug}.${locale}.md`)
        fs.writeFileSync(path.join(deps.root, rel), toFile(article, extra))
        written.push(rel)
      }

      const fresh = await loadContent(deps.root)
      for (const locale of ['en', 'id'] as const) {
        const ok = row.type === 'pillar' ? fresh.getPillarPageBySlug(row.category, brief.slug, locale) : fresh.getBlogPostBySlug(row.category, brief.slug, locale)
        if (!ok) throw new Error(`loader cannot read ${brief.slug}.${locale}`)
      }
    } catch (e) {
      contentError = e as Error
    }

    if (contentError) {
      deps.log(`failed: ${row.title}: ${contentError.message}`)
      for (const f of written) fs.rmSync(path.join(deps.root, f), { force: true })
      result.failed.push(row.title)
      saveRow(row, { status: 'failed' }, [], `content: "${row.title}" failed`)
      continue
    }

    result.published.push(brief!.slug)
    saveRow(row, { status: 'published', slug: brief!.slug }, written, `content: publish "${brief!.title}"`)
    deps.log(`published ${brief!.slug}`)
  }
  return result
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dryRun = process.argv.includes('--dry-run')
  const t = process.argv.indexOf('--title')
  const root = process.cwd()
  const key = process.env.UNSPLASH_ACCESS_KEY
  const deps: Deps = {
    writer: createWriter(),
    images: key ? createUnsplash(key) : { find: async () => null },
    today: new Date().toISOString().slice(0, 10),
    root,
    git: (args) => execFileSync('git', args, { cwd: root, stdio: 'inherit' }),
    log: console.log,
  }
  const r = await run({ dryRun, titleFilter: t >= 0 ? process.argv[t + 1] : undefined }, deps)
  console.log(JSON.stringify(r))
  if (r.failed.length || r.gitFailed.length || r.noMatch) process.exitCode = 1
}
