# Social Distribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** After each article publishes, generate six platform-specific posts (Instagram carousel, Facebook, LinkedIn page, X, company Threads, personal Threads), render the images in code, and schedule everything through a self-hosted Postiz instance over three days, without failing the article on any social error.

**Architecture:** `scripts/social.ts` makes one structured-output call that returns all six posts and clamps them in code; `scripts/render.ts` screenshots two HTML templates with Playwright; `scripts/postiz.ts` wraps the Postiz public API behind a `Poster` interface; `scripts/publish-due.ts` calls `distribute()` after a row is pushed and records a `social` status on the planner. Generation and rendering are testable without Postiz; Postiz is stubbed in tests and probed by a CLI against the live instance.

**Tech Stack:** Node 24 native type stripping, `@anthropic-ai/sdk` (structured outputs), `playwright` (dev dependency, Chromium in the Action), `gray-matter`, GitHub Actions, Postiz public API v1.

**Spec:** `docs/superpowers/specs/2026-09-20-social-distribution-design.md`

## Global Constraints

- Dev dependency additions: `playwright` only. No `sharp`, no `satori`, no image libraries; PNG dimensions in tests are read from the PNG header.
- Planner columns become `date,type,title,category,goal,status,slug,facts,notes,research,social`; `social` ∈ `''`, `scheduled`, `partial`, `failed`, `skipped`.
- Six posts exactly, in the languages and formats of the spec table. Length caps enforced in code: LinkedIn 2,000 characters, Facebook 250 words, Instagram caption 150 words and 6 to 8 slides, X 240 characters per post and at most 3 posts, each Threads post 400 characters. Hashtags at most 5 (Instagram) and 3 (LinkedIn).
- The social generation call uses `claude-opus-5`, `output_config.format` json_schema with no `minItems`/`maxItems`/`pattern`/`minimum`/`maximum`, effort medium, and the same cached product-context system block as the writer.
- Every post text passes through `voiceTells`; if any post trips the dash ceiling or has a reversal or verdict, one re-edit call for the offending posts only, then publish regardless.
- Honesty: the prompt carries the brief's claims list and the persona files' closing three lines; no post may contain a URL other than the article URL (checked in code, others stripped).
- `distribute()` never throws into the row loop. Any failure logs `social failed: <platform>: <message>` and sets the planner `social` column; the article's commit and push are already done by then.
- Dry run writes `social/<slug>.json` and the PNGs into `social/` at the repo root (gitignored) and never calls Postiz. Real runs upload PNGs to Postiz and never commit them.
- Images: 1080 by 1350, rendered from `scripts/social/carousel.html` and `scripts/social/card.html`, fonts from Google Fonts (Archivo, Instrument Sans) via a `<link>` in the template, brand colours from `tokens.css` values: paper `#090E0A`, ink `#F2F6F3`, accent `#DDFE55`. Logo `public/assets/logo.svg` inlined.
- Postiz client: base URL `${POSTIZ_URL}/public/v1`, header `Authorization: <key>`; `GET /integrations`, `POST /upload` (multipart, field `file`), `POST /posts`. Unknown `settings` keys per provider are read from `scripts/social/config.json` so they can be corrected after the probe without a code change.
- `pnpm test` and `pnpm typecheck` green after every task. Commits end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01DhGKPh2SrmHeVvHX2xTPQz`.

---

## File Structure

Created:
- `scripts/prompts/social/{linkedin,instagram,facebook,x,threads-company,threads-personal}.md` — personas.
- `scripts/social/config.json` — integration ids, times, provider settings.
- `scripts/social/carousel.html`, `scripts/social/card.html` — templates.
- `scripts/social.ts` — generation, clamping, URL check, voice pass. Pure except the model call, which goes through `Writer`-style injection.
- `scripts/social.test.ts`
- `scripts/render.ts` — Playwright rendering. `scripts/render.test.ts`.
- `scripts/postiz.ts` — `Poster` interface, real client, probe CLI. `scripts/postiz.test.ts`.
- `scripts/distribute.ts` — schedule computation and orchestration of the six posts. `scripts/distribute.test.ts`.

Modified:
- `scripts/planner.ts` (+ test) — `social` column.
- `scripts/writer.ts` — export `text()` and `system()` or a small `callJson()` so `social.ts` reuses the client and cache block.
- `scripts/publish-due.ts` (+ test) — call `distribute()`, `--social-only`, dry-run output.
- `.github/workflows/publish-content.yml` — Playwright install, secrets, artifact paths.
- `package.json`, `.gitignore` (`social/`), `AGENTS.md`, `content/planner.csv`.

---

### Task 1: Personas, config, planner column

**Files:**
- Create: the six persona files, `scripts/social/config.json`
- Modify: `scripts/planner.ts`, `scripts/planner.test.ts`, `scripts/publish-due.test.ts` (header), `content/planner.csv`, `.gitignore`

**Interfaces:**
- `Row` gains `social: string`; `COLUMNS` gains `'social'`; `parseCsv` accepts only `''|scheduled|partial|failed|skipped`.
- `scripts/social/config.json` shape (exported type `SocialConfig` from `scripts/distribute.ts` in Task 5, but the file lands now):
  ```json
  {
    "timezone": "Asia/Jakarta",
    "siteUrl": "https://www.arktik.id",
    "accounts": {
      "instagram": { "integrationId": "", "provider": "instagram" },
      "facebook": { "integrationId": "", "provider": "facebook" },
      "linkedin": { "integrationId": "", "provider": "linkedin-page" },
      "x": { "integrationId": "", "provider": "x" },
      "threadsCompany": { "integrationId": "", "provider": "threads" },
      "threadsPersonal": { "integrationId": "", "provider": "threads" }
    },
    "schedule": {
      "instagram": { "day": 0, "time": "09:00" },
      "facebook": { "day": 0, "time": "09:00" },
      "linkedin": { "day": 0, "time": "09:00" },
      "x": { "day": 1, "time": "09:00" },
      "threadsCompany": { "day": 1, "time": "09:00" },
      "threadsPersonal": { "day": 2, "time": "19:00" }
    },
    "settings": {
      "instagram": { "__type": "instagram", "post_type": "post", "post_as_images_carousel": true },
      "facebook": { "__type": "facebook" },
      "linkedin-page": { "__type": "linkedin-page" },
      "x": { "__type": "x" },
      "threads": { "__type": "threads" }
    }
  }
  ```
  Empty `integrationId`s mean "not configured"; `distribute()` skips those platforms with a log line and records `partial`.

- [ ] **Step 1: Persona files**

Each file is the persona paragraph from the spec expanded to concrete rules, and each ends with exactly:
```
Rules that always apply:
- Make only claims that appear in the brief's claims list. No numbers, clients, or outcomes from anywhere else.
- The voice rules in the system context apply in full.
- No URL except the article URL, and only where this persona allows a link.
```
`scripts/prompts/social/linkedin.md`:
```
# LinkedIn (company page): the firm speaking plainly

We, not I. English. A lesson from the article told as something Arktik has
seen in its work, 1,300 to 2,000 characters. The first 140 characters must
stand alone as the hook: a claim or a question, no run-up. Short paragraphs,
blank lines between them. One line near the end saying what Arktik will not
do. No link in the body; the article link goes in the first comment, which
the pipeline adds. No hashtags in the body; up to three go in `hashtags`.
Provide `imageHeadline`: the article's thesis in at most twelve words, for
the image card.
```
`scripts/prompts/social/instagram.md`:
```
# Instagram (company): the teacher

Indonesian, formal register, everyday vocabulary. A carousel of 6 to 8
slides. Slide 1 is the cover: a question the reader needs answered, at most
ten words in `headline`, `body` empty. Slides 2 to N-1: one idea each,
`headline` at most eight words, `body` at most 35 words. Last slide: the
CTA, `headline` "Baca selengkapnya", `body` "Tautan di bio." plus one line
of what the reader gets. Caption under 150 words, opens with the cover
question, ends with "Tautan di bio." No link in the caption. Up to five
hashtags in `hashtags.instagram`.
```
`scripts/prompts/social/facebook.md`:
```
# Facebook (company): the neighbour who runs a business

Indonesian, warmer than LinkedIn, story first: start with a situation a
business owner would recognise, then what the article says about it, 120
to 250 words. The article link belongs at the end of the text as a plain
URL. No hashtags.
```
`scripts/prompts/social/x.md`:
```
# X (company): the engineer at the whiteboard

English. One sharp claim per post, 240 characters or fewer, no hedging, no
hashtags, no emoji. One post when the article has one point; a thread of
two or three when it has a sequence. Posts stand alone; do not number them.
The article URL goes at the end of the last post only.
```
`scripts/prompts/social/threads-company.md`:
```
# Threads (company): the conversation starter

Indonesian, plain speech. One post under 400 characters: a question or a
contrarian take drawn from the article, written to be replied to. No link,
no hashtags.
```
`scripts/prompts/social/threads-personal.md`:
```
# Threads (founder's personal account): thinking out loud

Indonesian, first person singular, the founder speaking. Under 400
characters. Something the article made them notice about their own work
or a client conversation, told plainly. Never a pitch, never "we". No link,
no hashtags.
```

- [ ] **Step 2: Failing tests**

`scripts/planner.test.ts`: widen every header literal to `...,notes,research,social` and every row literal with one more `,`; add:
```ts
test('social column parses and rejects unknown values', () => {
  const h = 'date,type,title,category,goal,status,slug,facts,notes,research,social\n'
  assert.equal(parseCsv(h + '2026-01-01,regular,T,c,g,todo,,,,,scheduled\n')[0].social, 'scheduled')
  assert.equal(parseCsv(h + '2026-01-01,regular,T,c,g,todo,,,,,\n')[0].social, '')
  assert.throws(() => parseCsv(h + '2026-01-01,regular,T,c,g,todo,,,,,done\n'), /social/)
})
```
`scripts/publish-due.test.ts`: `HEADER` gains `,social`; every row literal gains one `,`. Existing regexes stay.

Run: `pnpm test` → FAIL.

- [ ] **Step 3: Implement**

`scripts/planner.ts`: `Row.social: string`; `COLUMNS` gains `'social'`; in `parseCsv` after the research check: `if (!['', 'scheduled', 'partial', 'failed', 'skipped'].includes(r.social)) throw new Error(\`row ${n + 2}: social must be empty, scheduled, partial, failed, or skipped\`)`.

Migrate the CSV with the same append pattern as before (`lines[0] += ',social'`, every non-empty data line `+ ','`), then verify `71` rows parse and all `social === ''`.

`.gitignore`: add `/social/`.

- [ ] **Step 4: Tests and commit**

`pnpm test` PASS (61). `pnpm typecheck` clean.
```bash
git add scripts/prompts/social scripts/social/config.json scripts/planner.ts scripts/planner.test.ts scripts/publish-due.test.ts content/planner.csv .gitignore
git commit -m "feat(social): personas, config, and planner social column"
```

---

### Task 2: Social generation

**Files:**
- Create: `scripts/social.ts`, `scripts/social.test.ts`
- Modify: `scripts/writer.ts` (export a JSON call helper)

**Interfaces:**
```ts
// scripts/social.ts
export interface SocialPosts {
  linkedin: { text: string; imageHeadline: string }
  facebook: { text: string }
  instagram: { caption: string; slides: { headline: string; body: string }[] }
  x: { posts: string[] }
  threadsCompany: { text: string }
  threadsPersonal: { text: string }
  hashtags: { instagram: string[]; linkedin: string[] }
}
export interface SocialInput { articleEn: Article; articleId: Article; brief: Brief; articleUrlEn: string; articleUrlId: string; personas: Record<keyof Omit<SocialPosts, 'hashtags'>, string> }
export interface SocialWriter { generate(ctx: WriterContext, input: SocialInput): Promise<SocialPosts>; fix(ctx: WriterContext, input: SocialInput, posts: SocialPosts, notes: string): Promise<SocialPosts> }
export function clampPosts(p: SocialPosts, log: (s: string) => void): SocialPosts
export function stripForeignUrls(p: SocialPosts, allowed: string[], log: (s: string) => void): SocialPosts
export function socialTells(p: SocialPosts): { key: string; text: string; tells: ReturnType<typeof voiceTells> }[]   // one entry per text that trips
export function createSocialWriter(client?: Anthropic): SocialWriter
```
- `scripts/writer.ts` exports `callJson(client, ctx, roleText, prompt, schema, label, effort)` built on the existing `text()` and `system()`, and exports `system` if not already.

- [ ] **Step 1: Failing tests** (`scripts/social.test.ts`)

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { clampPosts, stripForeignUrls, socialTells, type SocialPosts } from './social.ts'

const base = (): SocialPosts => ({
  linkedin: { text: 'a'.repeat(50), imageHeadline: 'H' },
  facebook: { text: 'kata '.repeat(40).trim() },
  instagram: { caption: 'kata '.repeat(20).trim(), slides: Array.from({ length: 9 }, (_, i) => ({ headline: `h${i}`, body: 'b' })) },
  x: { posts: ['one', 'two', 'three', 'four'] },
  threadsCompany: { text: 'x' },
  threadsPersonal: { text: 'y' },
  hashtags: { instagram: ['a', 'b', 'c', 'd', 'e', 'f'], linkedin: ['a', 'b', 'c', 'd'] },
})

test('clampPosts enforces counts and lengths at word boundaries', () => {
  const logs: string[] = []
  const p = base()
  p.linkedin.text = ('word '.repeat(600)).trim()   // 3000 chars
  p.x.posts[0] = 'w'.repeat(300)
  const out = clampPosts(p, (s) => logs.push(s))
  assert.equal(out.instagram.slides.length, 8)
  assert.equal(out.x.posts.length, 3)
  assert.ok(out.x.posts[0].length <= 240)
  assert.ok(out.linkedin.text.length <= 2000)
  assert.equal(out.hashtags.instagram.length, 5)
  assert.equal(out.hashtags.linkedin.length, 3)
  assert.ok(logs.some((l) => /linkedin/.test(l)))
})

test('stripForeignUrls keeps the article URL and removes others', () => {
  const p = base()
  p.facebook.text = 'Baca https://www.arktik.id/blog/x/y/ dan https://evil.example/z'
  p.x.posts = ['claim https://www.arktik.id/en/blog/x/y/']
  const out = stripForeignUrls(p, ['https://www.arktik.id/blog/x/y/', 'https://www.arktik.id/en/blog/x/y/'], () => {})
  assert.equal(out.facebook.text, 'Baca https://www.arktik.id/blog/x/y/ dan')
  assert.equal(out.x.posts[0], 'claim https://www.arktik.id/en/blog/x/y/')
})

test('socialTells flags only the texts that trip', () => {
  const p = base()
  p.threadsCompany.text = 'Ini bukan soal harga — ini soal kendali. Itu intinya.'
  const hits = socialTells(p)
  assert.deepEqual(hits.map((h) => h.key), ['threadsCompany'])
})
```

Run: `pnpm test` → FAIL.

- [ ] **Step 2: Implement `scripts/social.ts`**

```ts
import Anthropic from '@anthropic-ai/sdk'
import { callJson, voiceTells, type Article, type Brief, type WriterContext } from './writer.ts'

export interface SocialPosts { /* as in Interfaces */ }
export interface SocialInput { /* as in Interfaces */ }
export interface SocialWriter { /* as in Interfaces */ }

const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['linkedin', 'facebook', 'instagram', 'x', 'threadsCompany', 'threadsPersonal', 'hashtags'],
  properties: {
    linkedin: { type: 'object', additionalProperties: false, required: ['text', 'imageHeadline'], properties: { text: { type: 'string' }, imageHeadline: { type: 'string' } } },
    facebook: { type: 'object', additionalProperties: false, required: ['text'], properties: { text: { type: 'string' } } },
    instagram: { type: 'object', additionalProperties: false, required: ['caption', 'slides'], properties: { caption: { type: 'string' }, slides: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['headline', 'body'], properties: { headline: { type: 'string' }, body: { type: 'string' } } } } } },
    x: { type: 'object', additionalProperties: false, required: ['posts'], properties: { posts: { type: 'array', items: { type: 'string' } } } },
    threadsCompany: { type: 'object', additionalProperties: false, required: ['text'], properties: { text: { type: 'string' } } },
    threadsPersonal: { type: 'object', additionalProperties: false, required: ['text'], properties: { text: { type: 'string' } } },
    hashtags: { type: 'object', additionalProperties: false, required: ['instagram', 'linkedin'], properties: { instagram: { type: 'array', items: { type: 'string' } }, linkedin: { type: 'array', items: { type: 'string' } } } },
  },
} as const

const LIMITS = { linkedinChars: 2000, facebookWords: 250, captionWords: 150, slidesMin: 6, slidesMax: 8, xChars: 240, xPosts: 3, threadsChars: 400, igTags: 5, liTags: 3 }

function cutChars(s: string, n: number): string { if (s.length <= n) return s; const c = s.slice(0, n); const i = c.lastIndexOf(' '); return (i > 0 ? c.slice(0, i) : c).trimEnd() }
function cutWords(s: string, n: number): string { const w = s.split(/\s+/); return w.length <= n ? s : w.slice(0, n).join(' ') }

export function clampPosts(p: SocialPosts, log: (s: string) => void): SocialPosts {
  const out: SocialPosts = JSON.parse(JSON.stringify(p))
  const note = (k: string) => log(`social clamp: ${k}`)
  if (out.linkedin.text.length > LIMITS.linkedinChars) { out.linkedin.text = cutChars(out.linkedin.text, LIMITS.linkedinChars); note('linkedin text') }
  if (out.facebook.text.split(/\s+/).length > LIMITS.facebookWords) { out.facebook.text = cutWords(out.facebook.text, LIMITS.facebookWords); note('facebook text') }
  if (out.instagram.caption.split(/\s+/).length > LIMITS.captionWords) { out.instagram.caption = cutWords(out.instagram.caption, LIMITS.captionWords); note('instagram caption') }
  if (out.instagram.slides.length > LIMITS.slidesMax) { out.instagram.slides = out.instagram.slides.slice(0, LIMITS.slidesMax); note('instagram slides') }
  if (out.instagram.slides.length < LIMITS.slidesMin) note(`instagram slides: only ${out.instagram.slides.length}`)
  out.x.posts = out.x.posts.slice(0, LIMITS.xPosts).map((t, i) => { if (t.length > LIMITS.xChars) { note(`x post ${i}`); return cutChars(t, LIMITS.xChars) } return t })
  for (const k of ['threadsCompany', 'threadsPersonal'] as const) if (out[k].text.length > LIMITS.threadsChars) { out[k].text = cutChars(out[k].text, LIMITS.threadsChars); note(k) }
  out.hashtags.instagram = out.hashtags.instagram.slice(0, LIMITS.igTags)
  out.hashtags.linkedin = out.hashtags.linkedin.slice(0, LIMITS.liTags)
  return out
}

const URL_RE = /https?:\/\/[^\s)\]}"']+/g
const norm = (u: string) => u.replace(/\/+$/, '')
export function stripForeignUrls(p: SocialPosts, allowed: string[], log: (s: string) => void): SocialPosts {
  const ok = new Set(allowed.map(norm))
  const clean = (t: string, k: string) => t.replace(URL_RE, (u) => { if (ok.has(norm(u))) return u; log(`social stripped url in ${k}: ${u}`); return '' }).replace(/[ \t]+$/gm, '').replace(/ {2,}/g, ' ').trim()
  const out: SocialPosts = JSON.parse(JSON.stringify(p))
  out.linkedin.text = clean(out.linkedin.text, 'linkedin'); out.facebook.text = clean(out.facebook.text, 'facebook')
  out.instagram.caption = clean(out.instagram.caption, 'instagram')
  out.instagram.slides = out.instagram.slides.map((s) => ({ headline: clean(s.headline, 'slide'), body: clean(s.body, 'slide') }))
  out.x.posts = out.x.posts.map((t, i) => clean(t, `x ${i}`))
  out.threadsCompany.text = clean(out.threadsCompany.text, 'threadsCompany'); out.threadsPersonal.text = clean(out.threadsPersonal.text, 'threadsPersonal')
  return out
}

const DASH_CEILING = 2
export function socialTells(p: SocialPosts) {
  const texts: [string, string][] = [['linkedin', p.linkedin.text], ['facebook', p.facebook.text], ['instagram', p.instagram.caption], ...p.x.posts.map((t, i): [string, string] => [`x.${i}`, t]), ['threadsCompany', p.threadsCompany.text], ['threadsPersonal', p.threadsPersonal.text]]
  return texts.map(([key, text]) => ({ key, text, tells: voiceTells(text) })).filter((h) => h.tells.dashes > 0 && h.tells.dashPer1k > DASH_CEILING || h.tells.reversals.length > 0 || h.tells.verdicts.length > 0)
}

function prompt(input: SocialInput): string {
  const personas = Object.entries(input.personas).map(([k, v]) => `<persona for="${k}">\n${v}\n</persona>`).join('\n\n')
  return `Write six social posts for the article below. Return JSON only, matching the schema.

Article URLs: English ${input.articleUrlEn}; Indonesian ${input.articleUrlId}. Use the Indonesian URL in Indonesian posts and the English URL in English posts, only where the persona allows a link.

Brief (the claims list is the only allowed source of facts):
${JSON.stringify({ title: input.brief.title, thesis: input.brief.thesis, claims: input.brief.claims, cta: input.brief.cta }, null, 2)}

${personas}

English article:
<article lang="en">
${input.articleEn.body}
</article>

Indonesian article:
<article lang="id">
${input.articleId.body}
</article>`
}

export function createSocialWriter(client: Anthropic = new Anthropic()): SocialWriter {
  return {
    async generate(ctx, input) {
      const raw = await callJson(client, ctx, 'You write social posts for Arktik in six personas.', prompt(input), SCHEMA, 'social', 'medium')
      return JSON.parse(raw) as SocialPosts
    },
    async fix(ctx, input, posts, notes) {
      const raw = await callJson(client, ctx, 'You are a copy editor for social posts.', `Rewrite only the posts named below so they follow the Voice rules; return the full JSON with the other posts unchanged.\n\nViolations:\n${notes}\n\nCurrent posts:\n${JSON.stringify(posts, null, 2)}\n\nPersonas:\n${Object.entries(input.personas).map(([k, v]) => `<persona for="${k}">\n${v}\n</persona>`).join('\n')}`, SCHEMA, 'social:fix', 'medium')
      return JSON.parse(raw) as SocialPosts
    },
  }
}
```

`scripts/writer.ts`: add
```ts
export async function callJson(client: Anthropic, ctx: WriterContext, role: string, userPrompt: string, schema: object, label: string, effort: 'low' | 'medium' | 'high'): Promise<string> {
  return text(client, { model: MODEL, max_tokens: 16000, thinking: { type: 'adaptive' }, system: system(ctx, role), messages: [{ role: 'user', content: userPrompt }], output_config: { effort, format: { type: 'json_schema', schema } } }, label)
}
```
(`text` and `system` already exist; export `system` too.)

- [ ] **Step 3: Tests and commit**

`pnpm test` PASS (64). `pnpm typecheck` clean.
```bash
git add scripts/social.ts scripts/social.test.ts scripts/writer.ts
git commit -m "feat(social): six-persona post generation with clamping, URL check, and voice tells"
```

---

### Task 3: Rendering

**Files:**
- Create: `scripts/social/carousel.html`, `scripts/social/card.html`, `scripts/render.ts`, `scripts/render.test.ts`
- Modify: `package.json` (dev dep), `.github/workflows/publish-content.yml` (Chromium install step)

**Interfaces:**
```ts
export interface Renderer { carousel(slides: { headline: string; body: string; index: number; total: number }[], outDir: string, slug: string): Promise<string[]>; card(headline: string, outDir: string, slug: string): Promise<string> }
export function createRenderer(): Renderer     // Playwright chromium, headless
export function pngSize(buf: Buffer): { width: number; height: number }   // reads the IHDR chunk
```

- [ ] **Step 1: Install**

```bash
pnpm add -D playwright
pnpm exec playwright install chromium
```

- [ ] **Step 2: Templates**

`scripts/social/carousel.html`: a full HTML document with `<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700&family=Instrument+Sans:wght@400;500&display=swap" rel="stylesheet">`, a 1080 by 1350 body, CSS variables `--paper:#090E0A; --ink:#F2F6F3; --accent:#DDFE55`, placeholders `{{headline}}`, `{{body}}`, `{{index}}`, `{{total}}`, `{{logo}}`, and a `data-variant` attribute on `body` with values `cover` (accent background, paper text, headline at 88px Archivo 700), `body` (paper background, ink text, headline 64px, body 40px Instrument Sans, 40 words fit), and `cta` (paper background, accent headline). Padding 96px, a footer row with the logo at 36px height on the left and `{{index}} / {{total}}` in mono on the right. No external assets besides the fonts.

`scripts/social/card.html`: same system, single `{{headline}}` at 84px on paper with an accent rule above it, logo bottom-left, `arktik.id` bottom-right.

- [ ] **Step 3: Failing test** (`scripts/render.test.ts`)

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRenderer, pngSize } from './render.ts'

test('pngSize reads IHDR', () => {
  const b = Buffer.alloc(24); b.write('\x89PNG\r\n\x1a\n', 0, 'binary'); b.writeUInt32BE(13, 8); b.write('IHDR', 12); b.writeUInt32BE(1080, 16); b.writeUInt32BE(1350, 20)
  assert.deepEqual(pngSize(b), { width: 1080, height: 1350 })
})

test('renders a carousel and a card at 1080x1350', { timeout: 60000 }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'render-'))
  const r = createRenderer()
  const slides = [{ headline: 'Apa yang sebenarnya dibayar?', body: '', index: 1, total: 3 }, { headline: 'Satu ide', body: 'Isi singkat.', index: 2, total: 3 }, { headline: 'Baca selengkapnya', body: 'Tautan di bio.', index: 3, total: 3 }]
  const files = await r.carousel(slides, dir, 'demo')
  assert.equal(files.length, 3)
  for (const f of files) assert.deepEqual(pngSize(fs.readFileSync(f)), { width: 1080, height: 1350 })
  const card = await r.card('Software yang layak dibangun kedua kalinya', dir, 'demo')
  assert.deepEqual(pngSize(fs.readFileSync(card)), { width: 1080, height: 1350 })
})
```

- [ ] **Step 4: Implement `scripts/render.ts`**

```ts
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const here = path.dirname(fileURLToPath(import.meta.url))
const tpl = (name: string) => fs.readFileSync(path.join(here, 'social', name), 'utf8')
const logo = () => fs.readFileSync(path.join(here, '..', 'public', 'assets', 'logo.svg'), 'utf8')
const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!))
const fill = (html: string, vars: Record<string, string>) => html.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '')

export function pngSize(buf: Buffer) { return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) } }

export interface Renderer { /* as in Interfaces */ }

export function createRenderer(): Renderer {
  async function shoot(html: string, file: string) {
    const browser = await chromium.launch()
    try {
      const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 })
      await page.setContent(html, { waitUntil: 'networkidle' })
      await page.evaluate(() => (document as any).fonts?.ready)
      await page.screenshot({ path: file, type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1350 } })
    } finally { await browser.close() }
  }
  return {
    async carousel(slides, outDir, slug) {
      const files: string[] = []
      for (const s of slides) {
        const variant = s.index === 1 ? 'cover' : s.index === s.total ? 'cta' : 'body'
        const html = fill(tpl('carousel.html'), { headline: esc(s.headline), body: esc(s.body), index: String(s.index), total: String(s.total), logo: logo(), variant })
        const file = path.join(outDir, `${slug}-${String(s.index).padStart(2, '0')}.png`)
        await shoot(html, file); files.push(file)
      }
      return files
    },
    async card(headline, outDir, slug) {
      const file = path.join(outDir, `${slug}-card.png`)
      await shoot(fill(tpl('card.html'), { headline: esc(headline), logo: logo() }), file)
      return file
    },
  }
}
```
Launch one browser per `carousel()`/`card()` call if per-slide launches prove slow: keep it simple first, measure in the test's duration.

- [ ] **Step 5: Workflow**

After `pnpm install --frozen-lockfile`: `- run: pnpm exec playwright install --with-deps chromium`.

- [ ] **Step 6: Tests and commit**

`pnpm test` PASS (66). If the render test fails only because fonts did not load (network), the PNG size assertion still holds; note it. Commit:
```bash
git add package.json pnpm-lock.yaml scripts/social/*.html scripts/render.ts scripts/render.test.ts .github/workflows/publish-content.yml
git commit -m "feat(social): carousel and card rendering with Playwright"
```

---

### Task 4: Postiz client and probe

**Files:**
- Create: `scripts/postiz.ts`, `scripts/postiz.test.ts`
- Modify: `package.json` (`postiz:probe` script)

**Interfaces:**
```ts
export interface Poster {
  integrations(): Promise<{ id: string; name: string; provider: string }[]>
  upload(png: Buffer, name: string): Promise<{ id: string; path: string }>
  schedule(post: { integrationId: string; settings: Record<string, unknown>; texts: string[]; media?: { id: string; path: string }[]; at: string }): Promise<{ id: string }>
}
export function createPostiz(baseUrl: string, apiKey: string, fetchImpl: typeof fetch = fetch): Poster
```

- [ ] **Step 1: Failing tests** with a fake `fetch` that records requests:

```ts
test('schedule sends a Postiz posts payload with one value per text', async () => {
  const calls: { url: string; init: RequestInit }[] = []
  const fake: typeof fetch = async (url, init) => { calls.push({ url: String(url), init: init! }); return new Response(JSON.stringify([{ postId: 'p1' }]), { status: 200, headers: { 'content-type': 'application/json' } }) }
  const p = createPostiz('https://postiz.example', 'KEY', fake)
  const r = await p.schedule({ integrationId: 'int1', settings: { __type: 'x' }, texts: ['one', 'two'], at: '2026-09-22T02:00:00.000Z' })
  assert.equal(r.id, 'p1')
  assert.equal(calls[0].url, 'https://postiz.example/public/v1/posts')
  assert.equal((calls[0].init.headers as Record<string, string>).Authorization, 'KEY')
  const body = JSON.parse(calls[0].init.body as string)
  assert.equal(body.type, 'schedule'); assert.equal(body.date, '2026-09-22T02:00:00.000Z')
  assert.equal(body.posts[0].integration.id, 'int1'); assert.equal(body.posts[0].value.length, 2)
  assert.equal(body.posts[0].value[1].content, 'two'); assert.deepEqual(body.posts[0].settings, { __type: 'x' })
})
test('integrations maps the response and upload posts multipart', async () => { /* fake fetch returning [{id,name,identifier}] and {id,path}; assert mapping and that upload's body is FormData with a "file" part */ })
test('non-2xx responses throw with status and body excerpt', async () => { /* 500 → rejects /postiz 500/ */ })
```

- [ ] **Step 2: Implement**

```ts
export function createPostiz(baseUrl: string, apiKey: string, fetchImpl: typeof fetch = fetch): Poster {
  const base = `${baseUrl.replace(/\/+$/, '')}/public/v1`
  async function call<T>(path: string, init: RequestInit): Promise<T> {
    const res = await fetchImpl(`${base}${path}`, { ...init, headers: { Authorization: apiKey, ...(init.headers as Record<string, string> | undefined) } })
    if (!res.ok) throw new Error(`postiz ${res.status} ${path}: ${(await res.text()).slice(0, 200)}`)
    return res.json() as Promise<T>
  }
  return {
    async integrations() {
      const list = await call<{ id: string; name: string; identifier: string }[]>('/integrations', { method: 'GET' })
      return list.map((i) => ({ id: i.id, name: i.name, provider: i.identifier }))
    },
    async upload(png, name) {
      const fd = new FormData(); fd.append('file', new Blob([png], { type: 'image/png' }), name)
      return call<{ id: string; path: string }>('/upload', { method: 'POST', body: fd })
    },
    async schedule(post) {
      const body = { type: 'schedule', date: post.at, shortLink: false, posts: [{ integration: { id: post.integrationId }, settings: post.settings, value: post.texts.map((content, i) => ({ content, image: i === 0 ? (post.media ?? []) : [] })) }] }
      const res = await call<{ postId: string }[] | { postId: string }>('/posts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      const first = Array.isArray(res) ? res[0] : res
      return { id: first.postId }
    },
  }
}
```
Field names (`identifier`, `value`, `image`, `postId`) follow the public API docs as read; the probe in Step 3 confirms them against the live instance and the config's `settings` cover provider-specific keys.

Probe CLI at the bottom of the file, guarded by `fileURLToPath`: reads `POSTIZ_URL`/`POSTIZ_API_KEY`, prints integrations as `id | provider | name`, uploads a 1x1 PNG and prints the returned path, exits 0. `package.json`: `"postiz:probe": "node scripts/postiz.ts"`.

- [ ] **Step 3: Tests and commit**

`pnpm test` PASS (69). Commit `feat(social): Postiz client behind a Poster interface, with probe CLI`.

---

### Task 5: Distribution orchestration

**Files:**
- Create: `scripts/distribute.ts`, `scripts/distribute.test.ts`
- Modify: `scripts/publish-due.ts`, `scripts/publish-due.test.ts`, `.github/workflows/publish-content.yml`

**Interfaces:**
```ts
export interface SocialConfig { /* shape of config.json */ }
export interface DistributeDeps { social: SocialWriter; renderer: Renderer; poster: Poster | null; config: SocialConfig; root: string; today: string; dryRun: boolean; log: (s: string) => void }
export function scheduleAt(day: number, time: string, publishDate: string, timezone: string): string   // ISO UTC
export function articleUrls(siteUrl: string, category: string, type: 'pillar' | 'regular', slug: string): { en: string; id: string }
export async function distribute(input: { row: Row; brief: Brief; articleEn: Article; articleId: Article; ctx: WriterContext }, deps: DistributeDeps): Promise<'scheduled' | 'partial' | 'failed' | 'skipped'>
```

- [ ] **Step 1: Failing tests**

`scripts/distribute.test.ts`: `scheduleAt(0, '09:00', '2026-09-21', 'Asia/Jakarta')` → `2026-09-21T02:00:00.000Z`; `scheduleAt(2, '19:00', ...)` → `2026-09-23T12:00:00.000Z`. `articleUrls` builds `/blog/<cat>/<slug>/` and `/en/blog/...`, with `guides/` for pillars. `distribute` with stub `social` (returns a fixed `SocialPosts`), stub renderer (writes empty files), and a recording poster: schedules six posts with the right integration ids, media counts (carousel N slides, card once for linkedin and facebook, none for x/threads), and `at` values; returns `scheduled`. With `threadsPersonal.integrationId = ''` returns `partial` and logs `social skipped: threadsPersonal`. With poster throwing on one platform returns `partial`. With `dryRun` writes `social/<slug>.json` and PNGs and never calls the poster, returns `skipped`. With `social.generate` throwing returns `failed`.

`scripts/publish-due.test.ts`: after a published row, the planner shows `,scheduled` when `deps.distribute` is provided; the existing tests pass a `distribute: async () => 'skipped'` stub via `deps`. Add `distribute?: (...) => Promise<...>` to `Deps` so existing tests need no change beyond the stub (make it optional; when absent, `social` stays '').

- [ ] **Step 2: Implement `scripts/distribute.ts`**

Steps inside `distribute()`: load personas from `scripts/prompts/social/*.md`; compute URLs; `generate` → `clampPosts` → `stripForeignUrls` (allowed: the two article URLs) → `socialTells`; if any hit, `fix` once with the offending keys and snippets, then clamp and strip again; render carousel (slides from `instagram.slides`) and card (`linkedin.imageHeadline`) into `path.join(root, 'social', slug)`; if `dryRun`, write `social/<slug>.json` with the posts and the file list, log, return `skipped`; else for each platform with an `integrationId`: upload media, build `texts` (`linkedin`: `[text + '\n\n' + hashtags]` then a second value with the URL as the first comment if the provider supports it, else URL appended to the text and logged; `facebook`: `[text]`; `instagram`: `[caption + '\n\n' + hashtags]` with all slide media; `x`: `posts` with the URL already in the last; `threadsCompany` and `threadsPersonal`: `[text]`), `settings` from `config.settings[provider]`, `at` from `scheduleAt`; catch per platform, log `social failed: <platform>: <message>`. Return `scheduled` if all configured platforms succeeded and none skipped, `partial` if some, `failed` if none.

`scripts/publish-due.ts`: after `deps.log(\`published ...\`)`, `if (deps.distribute) { const s = await deps.distribute({...}); saveRow(row, { social: s }, [], \`content: social ${s} for "${brief!.title}"\`) }` — a second small commit updating only the planner. In the CLI: build `distribute` from `createSocialWriter()`, `createRenderer()`, `createPostiz(POSTIZ_URL, POSTIZ_API_KEY)` when both env vars exist else `null` (then `distribute` returns `skipped` with a log), config from `scripts/social/config.json`. `--social-only "<title>"`: find the published row, load its articles from `content/`, rebuild `brief`-like input from frontmatter (`title`, `excerpt` as thesis, no claims → pass `claims: []` and log that claims are unavailable so the persona rule "claims only from the brief" degrades to "no numbers or names beyond the article"), run `distribute`, update `social`.

Workflow: env `POSTIZ_URL: ${{ secrets.POSTIZ_URL }}`, `POSTIZ_API_KEY: ${{ secrets.POSTIZ_API_KEY }}`; dry-run artifact path adds `social/**`.

- [ ] **Step 3: Tests and commit**

`pnpm test` PASS (~76). `pnpm typecheck` clean. Commit `feat(social): distribute six posts through Postiz after publish; dry-run artifact`.

---

### Task 6: Docs and rollout

- [ ] AGENTS.md: a "Social" paragraph: six posts per article, personas in `scripts/prompts/social/`, config and integration ids in `scripts/social/config.json`, `pnpm postiz:probe` to list ids, `--social-only "<title>"` to redo one article, the `social` planner column meanings, and that dry run writes `social/` locally.
- [ ] Spec: record the probe's findings (settings keys, first-comment support) once the founders' Postiz instance is up.
- [ ] Commit `docs: social distribution`.
- [ ] Rollout (controller with the user): set the two secrets; `pnpm postiz:probe` locally with the same env to fill `config.json` integration ids; dry run on the MVP article with `--social-only`, read `social/<slug>.json` and view the PNGs; first live run scheduled a week out; check the Postiz calendar; set normal times.

---

## Self-review

**Spec coverage:** accounts and formats (Tasks 1, 5), personas (1), generation JSON and clamping and voice pass (2), images (3), Postiz integration and `Poster` (4), orchestration never failing the row, `social` column, dry run, `--social-only` (5), cost needs no task, rollout (6). Unverified Postiz assumptions are isolated in `config.json` settings and the probe.

**Placeholders:** the Postiz `integrations`/`upload` test bodies are described in prose in Task 4 Step 1; the implementer writes them from the described assertions. Everything else is code.

**Type consistency:** `SocialPosts`, `SocialWriter`, `Renderer`, `Poster`, `DistributeDeps` are defined once and used with the same names; `callJson` is added in Task 2 and used only there; `Deps.distribute` is optional so earlier tests compile.
