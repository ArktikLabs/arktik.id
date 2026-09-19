import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseArticle, clampFrontmatter, linkHrefs, type Brief, type WriterContext } from './writer.ts'

const DOC = `---
title: T
excerpt: e
seoTitle: s
seoDescription: d
ctaTitle: c
ctaDescription: cd
tags:
  - a
---

## A

body
`

/* console.warn is part of clampFrontmatter's contract; capture it so the
 * truncation tests assert it and the test output stays quiet. */
function captureWarn<T>(fn: () => T): { value: T; warnings: string[] } {
  const warnings: string[] = []
  const original = console.warn
  console.warn = (...args: unknown[]) => { warnings.push(args.join(' ')) }
  try {
    return { value: fn(), warnings }
  } finally {
    console.warn = original
  }
}

test('parseArticle strips a ```markdown fence', () => {
  const article = parseArticle('```markdown\n' + DOC + '```\n')
  assert.equal(article.frontmatter.title, 'T')
  assert.equal(article.body, '## A\n\nbody\n')
})

test('parseArticle strips a ```yaml fence after a leading blank line', () => {
  const article = parseArticle('\n```yaml\n' + DOC + '```')
  assert.equal(article.frontmatter.seoTitle, 's')
  assert.equal(article.body, '## A\n\nbody\n')
})

test('parseArticle rejects a missing required key', () => {
  const missing = DOC.replace('seoTitle: s\n', '')
  assert.throws(() => parseArticle(missing), /article missing frontmatter "seoTitle"/)
})

test('clampFrontmatter truncates tags to five', () => {
  const { value } = captureWarn(() => clampFrontmatter({ tags: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] }, 'regular'))
  assert.deepEqual(value.tags, ['a', 'b', 'c', 'd', 'e'])
})

test('clampFrontmatter cuts a long excerpt at a word boundary under the limit', () => {
  const excerpt = 'word '.repeat(40).trim()
  assert.equal(excerpt.length, 199)
  const { value, warnings } = captureWarn(() => clampFrontmatter({ excerpt }, 'regular'))
  const cut = value.excerpt as string
  assert.ok(cut.length <= 160, `expected <= 160, got ${cut.length}`)
  assert.ok(cut.length > 140, `expected a near-limit cut, got ${cut.length}`)
  assert.ok(excerpt.startsWith(cut))
  assert.doesNotMatch(cut, /\s$/)
  assert.equal(excerpt[cut.length], ' ')
  assert.deepEqual(warnings, ['truncated excerpt to 160'])
})

const ctx: WriterContext = {
  row: { date: '2026-09-21', type: 'regular', title: 'T', category: 'web', goal: 'g', status: 'todo', slug: '', facts: '' },
  productContext: '',
  honestCopyRule: '',
  copyNotes: '',
  exemplars: { en: [], id: [] },
  published: [],
  usedSlugs: [],
}

const brief = (links: Brief['internalLinks']): Brief => ({
  title: 'T', slug: 'a-slug', thesis: 't', searchIntent: 's',
  outline: [{ h2: 'A', point: 'a' }],
  claims: [{ claim: 'c', backing: 'b' }],
  cta: { framing: 'talk', missingAsset: false },
  internalLinks: links,
  unsplashQuery: 'desk laptop',
})

test('linkHrefs builds locale-correct hrefs', () => {
  const id = linkHrefs(ctx, brief([{ slug: 'toko-online', type: 'regular', why: 'w' }]), 'id')
  assert.equal(id[0].href, '/blog/web/toko-online/')
  const en = linkHrefs(ctx, brief([{ slug: 'panduan', type: 'pillar', why: 'w' }]), 'en')
  assert.equal(en[0].href, '/en/blog/web/guides/panduan/')
})
