import { test } from 'node:test'
import assert from 'node:assert/strict'
import type Anthropic from '@anthropic-ai/sdk'
import { parseArticle, clampFrontmatter, linkHrefs, passes, meanScore, critiqueNotes, citationsAllowed, normUrl, stripUncitedLinks, createWriter, type Brief, type WriterContext, type Verdict } from './writer.ts'

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
  row: { date: '2026-09-21', type: 'regular', title: 'T', category: 'web', goal: 'g', status: 'todo', slug: '', facts: '', notes: '', research: '' },
  productContext: '',
  honestCopyRule: '',
  copyNotes: '',
  notes: '',
  judgePrompt: '',
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
  notesUsed: [],
  notesUnused: [],
})

const minimalBrief = brief([])

test('citationsAllowed drops claims citing URLs the research did not return', () => {
  const b = { ...minimalBrief, claims: [
    { claim: 'a', backing: 'product context > Proof Points' },
    { claim: 'b', backing: 'https://bps.go.id/x' },
    { claim: 'c', backing: 'https://invented.example/y' },
  ] }
  const logs: string[] = []
  const out = citationsAllowed(b as any, ['https://bps.go.id/x'], (s) => logs.push(s))
  assert.deepEqual(out.claims.map((c) => c.claim), ['a', 'b'])
  assert.match(logs[0], /invented\.example/)
})

test('citationsAllowed drops an http backing when the URL list is empty (non-research row)', () => {
  const b = { ...minimalBrief, claims: [
    { claim: 'a', backing: 'product context > Proof Points' },
    { claim: 'b', backing: 'https://invented.example/y' },
  ] }
  const logs: string[] = []
  const out = citationsAllowed(b as any, [], (s) => logs.push(s))
  assert.deepEqual(out.claims.map((c) => c.claim), ['a'])
  assert.match(logs[0], /invented\.example/)
})

test('citationsAllowed scans the whole backing, not just its prefix', () => {
  const backing = 'BPS 2025 survey (https://bps.go.id/invented)'
  const logs: string[] = []
  const dropped = citationsAllowed({ ...minimalBrief, claims: [{ claim: 'a', backing }] }, [], (s) => logs.push(s))
  assert.deepEqual(dropped.claims, [])
  assert.match(logs[0], /bps\.go\.id\/invented/)
  const kept = citationsAllowed({ ...minimalBrief, claims: [{ claim: 'a', backing }] }, ['https://bps.go.id/invented'], () => {})
  assert.deepEqual(kept.claims.map((c) => c.claim), ['a'])
})

test('normUrl ignores a leading www, the query string, and a trailing slash', () => {
  assert.equal(normUrl('https://www.bps.go.id/a/?utm_source=x'), 'https://bps.go.id/a')
  assert.equal(normUrl('https://bps.go.id/a'), 'https://bps.go.id/a')
  assert.equal(normUrl('http://www.example.com/'), 'http://example.com')
})

test('stripUncitedLinks keeps cited and internal links and flattens the rest', () => {
  const body = [
    'Cited: [BPS](https://bps.go.id/a).',
    'Invented: [a 2025 survey](https://invented.example/y).',
    'Internal: [our guide](/blog/web/guides/panduan/).',
  ].join('\n\n')
  const out = stripUncitedLinks(body, ['https://bps.go.id/a'])
  assert.deepEqual(out.stripped, ['https://invented.example/y'])
  assert.match(out.body, /\[BPS\]\(https:\/\/bps\.go\.id\/a\)/)
  assert.match(out.body, /Invented: a 2025 survey\./)
  assert.match(out.body, /\[our guide\]\(\/blog\/web\/guides\/panduan\/\)/)
})

/* Only the fields research() reads. The cast is the stub boundary: everything
 * the writer touches on the client is these two nested functions. */
type StubMessage = { stop_reason: string; content: Record<string, unknown>[] }

function stubClient(scripted: StubMessage[]): { client: Anthropic; calls: unknown[][] } {
  const calls: unknown[][] = []
  const client = {
    messages: {
      stream: (params: { messages: unknown[] }) => {
        calls.push([...params.messages])
        return { finalMessage: async () => scripted.shift() }
      },
    },
  }
  return { client: client as unknown as Anthropic, calls }
}

test('research joins paused turns, resumes with the assistant turn, and collects urls', async () => {
  const { client, calls } = stubClient([
    {
      stop_reason: 'pause_turn',
      content: [
        { type: 'text', text: 'part one' },
        { type: 'web_search_tool_result', content: [{ type: 'web_search_result', url: 'https://bps.go.id/a' }] },
      ],
    },
    {
      stop_reason: 'end_turn',
      content: [
        { type: 'text', text: 'part two' },
        { type: 'web_fetch_tool_result', content: { type: 'web_fetch_result', url: 'https://ojk.go.id/b' } },
      ],
    },
  ])
  const r = await createWriter(client).research(ctx)
  assert.equal(r.text, 'part one\n\npart two')
  assert.deepEqual(r.urls, ['https://bps.go.id/a', 'https://ojk.go.id/b'])
  assert.equal(calls.length, 2)
  assert.equal(calls[1].length, 2)
  assert.equal((calls[1][1] as { role: string }).role, 'assistant')
})

test('research survives a web_search_tool_result error instead of a result list', async () => {
  const { client } = stubClient([
    {
      stop_reason: 'end_turn',
      content: [
        { type: 'web_search_tool_result', content: { type: 'web_search_tool_result_error', error_code: 'max_uses_exceeded' } },
        { type: 'text', text: 'No credible sources found' },
      ],
    },
  ])
  const r = await createWriter(client).research(ctx)
  assert.deepEqual(r.urls, [])
  assert.equal(r.text, 'No credible sources found')
})

test('research reports a refusal rather than throwing', async () => {
  const { client } = stubClient([{ stop_reason: 'refusal', content: [] }])
  assert.deepEqual(await createWriter(client).research(ctx), { text: 'Research refused', urls: [] })
})

test('linkHrefs builds locale-correct hrefs', () => {
  const id = linkHrefs(ctx, brief([{ slug: 'toko-online', type: 'regular', why: 'w' }]), 'id')
  assert.equal(id[0].href, '/blog/web/toko-online/')
  const en = linkHrefs(ctx, brief([{ slug: 'panduan', type: 'pillar', why: 'w' }]), 'en')
  assert.equal(en[0].href, '/en/blog/web/guides/panduan/')
})

test('voiceTells counts dashes and flags reversals and one-line verdicts', async () => {
  const { voiceTells } = await import('./writer.ts')
  const body = 'An MVP is not a cheaper build of the whole thing that you wanted. It is a way to find out. ' +
    'Scoping the whole thing up front asks you to describe every requirement before anyone has used anything at all. That is the whole definition. ' +
    'Plain sentence — with a dash — and another.'
  const t = voiceTells(body)
  assert.equal(t.dashes, 2)
  assert.equal(t.reversals.length, 1)
  assert.ok(t.verdicts.includes('That is the whole definition.'))
  assert.equal(voiceTells('Nothing to see here. Just prose.').reversals.length, 0)
})

test('passes and meanScore follow the panel thresholds', () => {
  const v = (a: number, b: number, c: number, d: number): Verdict => ({ scores: { owner: a, ops: b, developer: c, voice: d }, critiques: [] })
  assert.equal(passes(v(8, 8, 8, 8)), true)
  assert.equal(passes(v(9, 9, 9, 6)), false)   // one seat below 7
  assert.equal(passes(v(7, 7, 7, 8)), false)   // mean 7.25 < 8
  assert.equal(meanScore(v(7, 8, 9, 8)), 8)
})
test('critiqueNotes formats one line per critique', () => {
  const n = critiqueNotes({ scores: { owner: 6, ops: 8, developer: 8, voice: 8 }, critiques: [{ persona: 'owner', sentence: 'Costs vary.', problem: 'vague', fix: 'name the stage price rule' }] })
  assert.equal(n, '- [owner] "Costs vary.": vague. Fix: name the stage price rule')
})
