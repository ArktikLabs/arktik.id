import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { readPlanner, writePlanner, dueRows, isCaseStudy, latestPillarSlug, notesFor, notesPath, type Row } from './planner.ts'
import { createWriter, voiceTells, passes, meanScore, critiqueNotes, stripUncitedLinks, type Writer, type Article, type Brief, type WriterContext } from './writer.ts'
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
  const notes = notesFor(root, row)
  if (!notes) log(`no founder notes for "${row.title}"`)
  const judgePrompt = readIf(path.join(prompts, 'judge.md'))
  if (!judgePrompt) log('judge prompt missing: judge.md')
  return {
    row,
    productContext: readIf(path.join(root, '.agents/product-marketing.md')),
    honestCopyRule: honest.trim(),
    copyNotes,
    notes,
    judgePrompt: judgePrompt || 'Score 1-10 per seat: owner, ops, developer, voice.',
    exemplars: { en: pick('en'), id: pick('id') },
    published,
    usedSlugs: used,
    log,
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
  const notes = 'VOICE VIOLATIONS\n' + [
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

const MAX_ROUNDS = 2
/* The judge is a quality signal, never a publish gate: any failure here
 * (timeout, refusal, hitting max_tokens on a long article) must fall back
 * to the best article seen so far rather than fail the row. */
async function qualityLoop(deps: Deps, ctx: WriterContext, brief: Brief, locale: 'en' | 'id', article: Article, english?: Article): Promise<{ article: Article; quality?: Record<string, number> }> {
  let bestV
  try {
    bestV = await deps.writer.judge(ctx, brief, locale, article)
  } catch (e) {
    deps.log(`judge failed (${locale}): ${(e as Error).message}; publishing unjudged`)
    // No scores rather than zeroes: a zero reads as a judged failure.
    return { article, quality: undefined }
  }
  deps.log(`judge (${locale}) round 0: ${JSON.stringify(bestV.scores)}`)
  let best = article, current = article, currentV = bestV, rounds = 0, bestRound = 0
  while (!passes(currentV) && rounds < MAX_ROUNDS) {
    const notes = critiqueNotes(currentV)
    if (!notes) {
      deps.log(`judge (${locale}): no critiques; stopping`)
      break
    }
    rounds++
    try {
      current = await deps.writer.edit(ctx, brief, locale, current, english, `READER CRITIQUES\n${notes}`)
      currentV = await deps.writer.judge(ctx, brief, locale, current)
    } catch (e) {
      deps.log(`judge/revision failed (${locale}) round ${rounds}: ${(e as Error).message}; keeping best so far`)
      break
    }
    deps.log(`judge (${locale}) round ${rounds}: ${JSON.stringify(currentV.scores)}`)
    if (meanScore(currentV) > meanScore(bestV)) { best = current; bestV = currentV; bestRound = rounds }
  }
  if (rounds > 0) best = await voiceGuard(deps, ctx, brief, locale, best, english)
  // `rounds` is the round the kept scores came from, not how many were run.
  return { article: best, quality: { ...bestV.scores, rounds: bestRound } }
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
      if (row.research === 'yes') {
        try {
          ctx.research = await deps.writer.research(ctx)
          deps.log(`research: ${ctx.research.urls.length} urls`)
          deps.log(`research urls: ${ctx.research.urls.join(' ')}`)
        } catch (e) { deps.log(`research failed: ${(e as Error).message}; writing without sources`) }
      }
      brief = await deps.writer.brief(ctx)
      deps.log(`brief ${brief.slug}: ${JSON.stringify(brief)}`)

      const enDraft = await deps.writer.write(ctx, brief, 'en')
      const enVoiced = await voiceGuard(deps, ctx, brief, 'en', await deps.writer.edit(ctx, brief, 'en', enDraft))
      const enQ = await qualityLoop(deps, ctx, brief, 'en', enVoiced)
      const en = enQ.article
      const idDraft = await deps.writer.write(ctx, brief, 'id', en)
      const idVoiced = await voiceGuard(deps, ctx, brief, 'id', await deps.writer.edit(ctx, brief, 'id', idDraft, en), en)
      const idQ = await qualityLoop(deps, ctx, brief, 'id', idVoiced, en)
      const id = idQ.article

      const dir = row.type === 'pillar' ? 'pillars' : 'posts'
      const extra: Record<string, unknown> = { date: deps.today, updated: deps.today, category: row.category, author: 'tika-aurora' }
      if (row.type === 'regular') extra.pillar = latestPillarSlug(content.getPillarPages(), row.category)

      let photo = null
      try { photo = opts.dryRun ? null : await deps.images.find(brief.unsplashQuery) } catch (e) { deps.log(`image skipped: ${(e as Error).message}`) }
      // Photos are hotlinked from the Unsplash CDN, never stored in the repo.
      if (photo) Object.assign(extra, { image: photo.url, imageAlt: photo.alt, imageCredit: photo.credit })

      // The claims list is filtered before writing, but the body can still
      // carry a URL no claim declared. Internal links are relative, so the
      // scan never touches them.
      for (const article of [en, id]) {
        const { body, stripped } = stripUncitedLinks(article.body, ctx.research?.urls ?? [])
        for (const u of stripped) deps.log(`stripped uncited link: ${u}`)
        article.body = body
      }

      for (const [locale, article, quality] of [['en', en, enQ.quality], ['id', id, idQ.quality]] as const) {
        const rel = path.join('content', dir, `${brief.slug}.${locale}.md`)
        fs.writeFileSync(path.join(deps.root, rel), toFile(article, { ...extra, quality }))
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
  const root = process.cwd()
  const np = process.argv.indexOf('--notes-path')
  if (np >= 0) {
    if (!process.argv[np + 1]) {
      console.error('usage: --notes-path "<title substring>"')
      process.exit(1)
    }
    const rows = readPlanner(path.join(root, 'content/planner.csv'))
    const f = process.argv[np + 1].toLowerCase()
    const row = rows.find((r) => r.title.toLowerCase().includes(f))
    console.log(row ? notesPath(root, row) : 'no matching row')
    process.exit(row ? 0 : 1)
  }
  const dryRun = process.argv.includes('--dry-run')
  const t = process.argv.indexOf('--title')
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
