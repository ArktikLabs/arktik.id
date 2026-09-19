import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'

process.env.CONTENT_DIR = path.join(import.meta.dirname, 'content.fixtures')
const content = await import('./content.ts')

test('categories list sorted by title, en overrides id', () => {
  const id = content.getCategories('id')
  assert.deepEqual(id.map((c) => c.title), ['SEO', 'Web'])
  const en = content.getCategories('en')
  assert.deepEqual(en.map((c) => c.title), ['SEO', 'Web (EN)'])
  assert.equal(id[1].icon, '/assets/blog/web.svg')
})

test('posts sorted newest first, en falls back to id per document', () => {
  const { posts, total } = content.getBlogPosts({ locale: 'en' })
  assert.equal(total, 2)
  assert.deepEqual(posts.map((p) => p.title), ['Artikel Kedua', 'First Article'])
})

test('orphan en file without id file is ignored', () => {
  const { posts } = content.getBlogPosts({ locale: 'en' })
  assert.ok(!posts.some((p) => p.slug === 'orphan'))
})

test('post relations resolve to full objects and defaults apply', () => {
  const post = content.getBlogPostBySlug('web', 'pertama', 'id')
  assert.ok(post)
  assert.equal(post.category.title, 'Web')
  assert.equal(post.author?.name, 'Ani Rahayu')
  assert.equal(post.author?.bio.trim(), 'Bio Ani dalam **Markdown**.')
  assert.equal(post.updated, '2025-02-01')
  assert.deepEqual(post.tags, ['a', 'b'])
  assert.equal(post.body.trim(), 'Isi pertama.')
})

test('post lookup requires matching category', () => {
  assert.equal(content.getBlogPostBySlug('seo', 'pertama', 'id'), null)
})

test('filters, limit and skip', () => {
  assert.equal(content.getBlogPosts({ categorySlug: 'web' }).total, 1)
  assert.equal(content.getBlogPosts({ pillarSlug: 'panduan-web' }).posts[0].slug, 'pertama')
  const page = content.getBlogPosts({ limit: 1, skip: 1 })
  assert.equal(page.total, 2)
  assert.deepEqual(page.posts.map((p) => p.slug), ['pertama'])
})

test('pillar carries category, author and related posts', () => {
  const pillar = content.getPillarPageBySlug('web', 'panduan-web', 'id')
  assert.ok(pillar)
  assert.equal(pillar.introduction, 'Pengantar panduan.')
  assert.equal(pillar.author?.slug, 'ani')
  assert.deepEqual(pillar.relatedPosts.map((p) => p.slug), ['pertama'])
  assert.equal(content.getPillarPages('seo').length, 0)
  assert.equal(content.getPillarPages().length, 1)
})

test('case study body splits into three sections', () => {
  const cs = content.getCaseStudyBySlug('toko', 'id')
  assert.ok(cs)
  assert.equal(cs.challenge.trim(), 'Tantangan toko.')
  assert.equal(cs.solution.trim(), 'Solusi toko.')
  assert.equal(cs.results.trim(), 'Hasil toko.')
  assert.equal(cs.category?.slug, 'web')
  assert.equal(content.getCaseStudies().total, 1)
})

test('dangling category throws with the file path', () => {
  process.env.CONTENT_DIR = path.join(import.meta.dirname, 'content.fixtures-bad')
  assert.throws(() => content.getBlogPosts(), /content.fixtures-bad\/posts\/bad\.id\.md/)
  process.env.CONTENT_DIR = path.join(import.meta.dirname, 'content.fixtures')
})

test('authors list', () => {
  assert.deepEqual(content.getAuthors().map((a) => a.slug), ['ani'])
})

test('slug with path characters is rejected', () => {
  assert.equal(content.getBlogPostBySlug('web', '../content.fixtures/posts/pertama', 'id'), null)
  assert.equal(content.getCategoryBySlug('..', 'id'), null)
})