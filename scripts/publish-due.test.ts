import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import matter from 'gray-matter'
import { run, type Deps } from './publish-due.ts'
import type { Writer, Article, Brief } from './writer.ts'

function scaffold(planner: string) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pub-'))
  for (const d of ['content/posts', 'content/pillars', 'content/categories', 'content/authors', 'public/assets/blog', '.agents']) fs.mkdirSync(path.join(root, d), { recursive: true })
  fs.writeFileSync(path.join(root, 'content/categories/web.id.md'), '---\ntitle: Web\n---\n')
  fs.writeFileSync(path.join(root, 'content/categories/case-studies.id.md'), '---\ntitle: Case Studies\n---\n')
  fs.writeFileSync(path.join(root, 'content/authors/tika-aurora.md'), '---\nname: Tika\n---\nbio\n')
  fs.writeFileSync(path.join(root, 'content/pillars/guide.id.md'), '---\ntitle: Guide\nintroduction: x\ndate: 2026-01-01\ncategory: web\n---\nbody\n')
  fs.writeFileSync(path.join(root, 'content/pillars/guide.en.md'), '---\ntitle: Guide\nintroduction: x\ndate: 2026-01-01\ncategory: web\n---\nbody\n')
  fs.writeFileSync(path.join(root, 'content/posts/old.id.md'), '---\ntitle: Old\nexcerpt: e\ndate: 2026-01-02\ncategory: web\n---\nbody\n')
  fs.writeFileSync(path.join(root, 'content/posts/old.en.md'), '---\ntitle: Old\nexcerpt: e\ndate: 2026-01-02\ncategory: web\n---\nbody\n')
  fs.writeFileSync(path.join(root, '.agents/product-marketing.md'), '# ctx\n')
  fs.writeFileSync(path.join(root, 'design.md'), '- **Honest copy.** No invented metrics.\n')
  fs.writeFileSync(path.join(root, 'content/planner.csv'), planner)
  return root
}

const brief: Brief = { title: 'New Post', slug: 'new-post', thesis: 't', searchIntent: 's', outline: [{ h2: 'A', point: 'a' }], claims: [{ claim: 'c', backing: 'b' }], cta: { framing: 'talk', missingAsset: false }, internalLinks: [{ slug: 'guide', type: 'pillar', why: 'pillar' }], unsplashQuery: 'desk laptop' }
const article = (locale: string): Article => ({ frontmatter: { title: `New Post ${locale}`, excerpt: 'x', seoTitle: 's', seoDescription: 'd', ctaTitle: 'c', ctaDescription: 'cd', tags: ['a'] }, body: `## A\n\n${locale} body\n` })
const okWriter: Writer = { brief: async () => brief, write: async (_c, _b, l) => article(l), edit: async (_c, _b, _l, d) => d }
const PHOTO_URL = 'https://images.unsplash.com/photo-x?w=1920'
const images = { find: async () => ({ url: PHOTO_URL, alt: 'alt', credit: { name: 'N', profileUrl: 'p', photoUrl: 'u' } }) }

function deps(root: string, writer: Writer = okWriter): Deps & { calls: string[][] } {
  const calls: string[][] = []
  return { writer, images, today: '2026-09-21', root, git: (a) => calls.push(a), log: () => {}, calls }
}

const HEADER = 'date,type,title,category,goal,status,slug,facts\n'

test('publishes a due row: files, image, pillar link, planner, one commit', async () => {
  const root = scaffold(HEADER + '2026-09-21,regular,New Post,web,Awareness,todo,,\n')
  const d = deps(root)
  const r = await run({ dryRun: false }, d)
  assert.deepEqual(r, { published: ['new-post'], needsInput: [], failed: [], gitFailed: [], noMatch: false })
  const en = fs.readFileSync(path.join(root, 'content/posts/new-post.en.md'), 'utf8')
  assert.match(en, /title: New Post en/)
  assert.match(en, /pillar: guide/)
  // gray-matter quotes the URL; tolerate either quoting.
  assert.match(en, /image: ['"]?https:\/\/images\.unsplash\.com\/photo-x\?w=1920['"]?/)
  assert.match(en, /author: tika-aurora/)
  assert.match(en, /date: '2026-09-21'/)
  const data = matter(en).data
  assert.deepEqual(data.imageCredit, { name: 'N', profileUrl: 'p', photoUrl: 'u' })
  assert.equal(String(data.updated).slice(0, 10), '2026-09-21')
  assert.equal(data.imageAlt, 'alt')
  assert.ok(fs.existsSync(path.join(root, 'content/posts/new-post.id.md')))
  // Photos are hotlinked: nothing lands in the repo.
  assert.deepEqual(fs.readdirSync(path.join(root, 'public/assets/blog')), [])
  assert.match(fs.readFileSync(path.join(root, 'content/planner.csv'), 'utf8'), /,published,new-post,/)
  assert.equal(d.calls.filter((c) => c[0] === 'commit').length, 1)
  assert.ok(d.calls.some((c) => c[0] === 'push'))
})

test('dry run writes files but never touches git or the planner file', async () => {
  const root = scaffold(HEADER + '2026-09-21,regular,New Post,web,Awareness,todo,,\n')
  const d = deps(root)
  await run({ dryRun: true }, d)
  assert.ok(fs.existsSync(path.join(root, 'content/posts/new-post.en.md')))
  assert.equal(d.calls.length, 0)
  assert.match(fs.readFileSync(path.join(root, 'content/planner.csv'), 'utf8'), /,todo,,/)
})

test('case study without facts becomes needs-input and is committed', async () => {
  const root = scaffold(HEADER + '2026-09-21,regular,Case Study: X,web,Proof,todo,,\n')
  const d = deps(root)
  const r = await run({ dryRun: false }, d)
  assert.deepEqual(r.needsInput, ['Case Study: X'])
  assert.match(fs.readFileSync(path.join(root, 'content/planner.csv'), 'utf8'), /,needs-input,,/)
  assert.equal(d.calls.filter((c) => c[0] === 'commit').length, 1)
})

test('a case-studies row without facts becomes needs-input whatever its title', async () => {
  const root = scaffold(HEADER + '2026-09-21,regular,Bagaimana Kami Membantu Toko Ani,case-studies,Proof,todo,,\n')
  const d = deps(root)
  const r = await run({ dryRun: false }, d)
  assert.deepEqual(r.needsInput, ['Bagaimana Kami Membantu Toko Ani'])
  assert.deepEqual(r.published, [])
  assert.match(fs.readFileSync(path.join(root, 'content/planner.csv'), 'utf8'), /,needs-input,,/)
})

test('a title filter that matches no todo row is a failed run', async () => {
  const root = scaffold(HEADER + '2026-09-21,regular,New Post,web,Awareness,todo,,\n')
  const d = deps(root)
  const r = await run({ dryRun: false, titleFilter: 'nothing like this' }, d)
  assert.equal(r.noMatch, true)
  assert.deepEqual(r.published, [])
  assert.equal(d.calls.length, 0)
})

test('writer failure marks the row failed, removes partial files, still commits planner', async () => {
  const root = scaffold(HEADER + '2026-09-21,regular,New Post,web,Awareness,todo,,\n')
  const bad: Writer = { ...okWriter, write: async (_c, _b, l) => { if (l === 'id') throw new Error('boom'); return article(l) } }
  const d = deps(root, bad)
  const r = await run({ dryRun: false }, d)
  assert.deepEqual(r.failed, ['New Post'])
  assert.equal(fs.existsSync(path.join(root, 'content/posts/new-post.en.md')), false)
  assert.match(fs.readFileSync(path.join(root, 'content/planner.csv'), 'utf8'), /,failed,,/)
  assert.equal(d.calls.filter((c) => c[0] === 'commit').length, 1)
})

test('loader check failure removes written files and commits only the planner', async () => {
  // Real mechanism: the en/id markdown files are written successfully
  // (nothing in the writer/images stubs objects to them), but
  // between the pillar lookup and the post-write loader re-check, the
  // category fixture the row depends on disappears (simulating a real
  // filesystem race). The second `loadContent()` call in the orchestrator
  // then finds the category missing, `requireCategory` throws inside the
  // loader check, and that is what the cleanup path must handle.
  const root = scaffold(HEADER + '2026-09-21,regular,New Post,web,Awareness,todo,,\n')
  const images2 = {
    find: async () => {
      fs.rmSync(path.join(root, 'content/categories/web.id.md'))
      return { url: PHOTO_URL, alt: 'alt', credit: { name: 'N', profileUrl: 'p', photoUrl: 'u' } }
    },
  }
  const d = { ...deps(root), images: images2 }
  const r = await run({ dryRun: false }, d)
  assert.deepEqual(r.failed, ['New Post'])
  assert.equal(fs.existsSync(path.join(root, 'content/posts/new-post.en.md')), false)
  assert.equal(fs.existsSync(path.join(root, 'content/posts/new-post.id.md')), false)
  // The jpg is never written now that photos are hotlinked.
  assert.equal(fs.existsSync(path.join(root, 'public/assets/blog/new-post.jpg')), false)
  assert.match(fs.readFileSync(path.join(root, 'content/planner.csv'), 'utf8'), /,failed,,/)
  assert.equal(d.calls.filter((c) => c[0] === 'commit').length, 1)
  const addCall = d.calls.find((c) => c[0] === 'add')
  assert.deepEqual(addCall, ['add', 'content/planner.csv'])
})

test('missing image is not a failure', async () => {
  const root = scaffold(HEADER + '2026-09-21,regular,New Post,web,Awareness,todo,,\n')
  const d = { ...deps(root), images: { find: async () => null } }
  const r = await run({ dryRun: false }, d)
  assert.deepEqual(r.published, ['new-post'])
  assert.doesNotMatch(fs.readFileSync(path.join(root, 'content/posts/new-post.en.md'), 'utf8'), /image:/)
})

test('pillar rows write to content/pillars with introduction', async () => {
  const root = scaffold(HEADER + '2026-09-21,pillar,New Guide,web,Book a Consultation,todo,,\n')
  const pillarArticle = (l: string): Article => ({ frontmatter: { title: `G ${l}`, introduction: 'intro', seoTitle: 's', seoDescription: 'd', ctaTitle: 'c', ctaDescription: 'cd' }, body: '## A\n\nbody\n' })
  const w: Writer = { ...okWriter, brief: async () => ({ ...brief, slug: 'new-guide' }), write: async (_c, _b, l) => pillarArticle(l) }
  const r = await run({ dryRun: false }, deps(root, w))
  assert.deepEqual(r.published, ['new-guide'])
  const en = fs.readFileSync(path.join(root, 'content/pillars/new-guide.en.md'), 'utf8')
  assert.match(en, /introduction: intro/)
  assert.doesNotMatch(en, /pillar:/)
})
