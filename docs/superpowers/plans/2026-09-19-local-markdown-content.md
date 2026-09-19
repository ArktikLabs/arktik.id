# Local Markdown Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve blog posts, pillar guides, categories, case studies, and authors from Markdown files in the repo instead of the Contentful API.

**Architecture:** A synchronous loader in `lib/content.ts` reads `content/**/*.md` with `gray-matter`, resolves relations by slug, and applies an Indonesian fallback per document. Flat types replace Contentful's nested entry shape. The existing `RichTextRenderer` keeps its name and prop but renders Markdown with `react-markdown`. A throwaway script migrates the live space once.

**Tech Stack:** Next.js 15 app router, TypeScript, `gray-matter`, `react-markdown`, Node 24 built-in test runner with native type stripping.

**Spec:** `docs/superpowers/specs/2026-09-19-local-markdown-content-design.md`

## Global Constraints

- Only two packages may be added: `gray-matter` and `react-markdown`. No `remark-gfm`, no `image-size`, no content framework.
- Every public URL under `/blog/` must stay identical: `/{locale}/blog/`, `/{locale}/blog/case-studies/`, `/{locale}/blog/case-studies/{slug}/`, `/{locale}/blog/{category}/`, `/{locale}/blog/{category}/{post}/`, `/{locale}/blog/{category}/guides/{pillar}/`.
- Indonesian (`id`) is the source of truth. A document exists only if `<slug>.id.md` exists. `<slug>.en.md` is an optional override.
- No layout, copy, or class-name changes in pages or components. Only the data access changes.
- A dangling `category` slug in frontmatter throws at load time with the file path in the message.
- Loader functions are synchronous but callers may keep `await` on them.
- Tests run with `pnpm test`, which is `node --test 'lib/**/*.test.ts'`. Test files import siblings with explicit `.ts` extensions because Node resolves them, not webpack. Runtime code under `lib/` that tests import must not use the `@/` alias.
- Commits end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

---

## File Structure

Created:
- `lib/types/content.ts` — flat `Author`, `Category`, `Post`, `Pillar`, `CaseStudy` interfaces.
- `lib/content.ts` — the loader. Reads `content/`, parses frontmatter, resolves relations, exports the eight query functions.
- `lib/content.test.ts` — loader tests against a fixture tree.
- `lib/content.fixtures/` — a tiny content tree used only by tests.
- `lib/utils/reading-time.test.ts` — reading-time tests.
- `content/` — the migrated documents.
- `public/blog/` — the migrated assets.
- `scripts/migrate-contentful.mjs` — throwaway, deleted before the final commit.

Modified:
- `lib/utils/reading-time.ts` — takes Markdown strings; exports `markdownToText`.
- `components/blog/RichTextRenderer.tsx` — `react-markdown` with the same class map.
- `components/blog/BlogPostCard.tsx`, `PillarCard.tsx`, `CategoryCard.tsx`, `CaseStudyCard.tsx`
- `components/sections/BlogSection.tsx`, `BlogHeroSection.tsx`
- `app/[locale]/blog/page.tsx`, `[category]/page.tsx`, `[category]/[post]/page.tsx`, `[category]/guides/[pillar]/page.tsx`, `case-studies/page.tsx`, `case-studies/[slug]/page.tsx`
- `app/sitemap.ts`
- `next.config.mjs`, `package.json`, `.env.example` if present, `README.md` if it mentions Contentful.

Deleted:
- `lib/contentful.ts`, `lib/services/contentful.ts`, `lib/utils/contentful.ts`, `lib/types/contentful.ts`, `contentful_content_type.json`.

---

### Task 1: Dependencies, types, and test runner

**Files:**
- Modify: `package.json`
- Create: `lib/types/content.ts`

**Interfaces:**
- Produces: the five interfaces below. Every later task imports them from `@/lib/types/content` (pages, components) or `./types/content.ts` (loader).

- [ ] **Step 1: Install the two packages**

```bash
pnpm add gray-matter react-markdown
```

- [ ] **Step 2: Add the test script to `package.json`**

In the `scripts` block add:

```json
"test": "node --test 'lib/**/*.test.ts'"
```

- [ ] **Step 3: Verify the runner works with no tests**

Run: `pnpm test`
Expected: exits 0 with `# tests 0` (Node prints a summary even when no files match).

- [ ] **Step 4: Create the types file**

`lib/types/content.ts`:

```ts
export interface Author {
  slug: string
  name: string
  role?: string
  photo?: string
  bio: string
}

export interface Category {
  slug: string
  title: string
  description?: string
  icon?: string
}

interface SeoCta {
  seoTitle?: string
  seoDescription?: string
  ctaTitle?: string
  ctaDescription?: string
}

export interface Post extends SeoCta {
  slug: string
  title: string
  excerpt: string
  body: string
  date: string
  updated: string
  category: Category
  pillar?: string
  author?: Author
  image?: string
  imageAlt?: string
  tags: string[]
}

export interface Pillar extends SeoCta {
  slug: string
  title: string
  introduction: string
  body: string
  date: string
  updated: string
  category: Category
  author?: Author
  relatedPosts: Post[]
  image?: string
  imageAlt?: string
}

export interface CaseStudy extends SeoCta {
  slug: string
  title: string
  clientName?: string
  challenge: string
  solution: string
  results: string
  date: string
  updated: string
  category?: Category
  image?: string
  imageAlt?: string
}
```

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml lib/types/content.ts
git commit -m "feat(content): add flat content types, gray-matter, react-markdown, test script"
```

---

### Task 2: Loader with locale fallback and relations

**Files:**
- Create: `lib/content.ts`
- Create: `lib/content.test.ts`
- Create: `lib/content.fixtures/` (see Step 1 for the exact files)

**Interfaces:**
- Consumes: `lib/types/content.ts`.
- Produces, all synchronous, all exported from `lib/content.ts`:
  - `getCategories(locale?: string): Category[]`
  - `getCategoryBySlug(slug: string, locale?: string): Category | null`
  - `getBlogPosts(options?: { categorySlug?: string; pillarSlug?: string; limit?: number; skip?: number; locale?: string }): { posts: Post[]; total: number }`
  - `getBlogPostBySlug(categorySlug: string, slug: string, locale?: string): Post | null`
  - `getPillarPages(categorySlug?: string, locale?: string): Pillar[]`
  - `getPillarPageBySlug(categorySlug: string, slug: string, locale?: string): Pillar | null`
  - `getCaseStudies(options?: { limit?: number; skip?: number; locale?: string }): { caseStudies: CaseStudy[]; total: number }`
  - `getCaseStudyBySlug(slug: string, locale?: string): CaseStudy | null`
  - `getAuthors(): Author[]`
- The content root is `process.env.CONTENT_DIR` when set, otherwise `<cwd>/content`. Tests set the env var to the fixture dir before importing.

- [ ] **Step 1: Write the fixture tree**

`lib/content.fixtures/authors/ani.md`:

```md
---
name: Ani Rahayu
role: Editor
---
Bio Ani dalam **Markdown**.
```

`lib/content.fixtures/categories/web.id.md`:

```md
---
title: Web
description: Artikel tentang web.
icon: /blog/web.svg
---
```

`lib/content.fixtures/categories/web.en.md`:

```md
---
title: Web (EN)
description: Articles about the web.
---
```

`lib/content.fixtures/categories/seo.id.md`:

```md
---
title: SEO
---
```

`lib/content.fixtures/pillars/panduan-web.id.md`:

```md
---
title: Panduan Web
introduction: Pengantar panduan.
date: 2025-01-01
category: web
author: ani
---
Isi panduan.
```

`lib/content.fixtures/posts/pertama.id.md`:

```md
---
title: Artikel Pertama
excerpt: Ringkasan pertama.
date: 2025-02-01
category: web
pillar: panduan-web
author: ani
tags: [a, b]
---
Isi pertama.
```

`lib/content.fixtures/posts/pertama.en.md`:

```md
---
title: First Article
excerpt: First summary.
date: 2025-02-01
category: web
pillar: panduan-web
author: ani
---
First body.
```

`lib/content.fixtures/posts/kedua.id.md`:

```md
---
title: Artikel Kedua
excerpt: Ringkasan kedua.
date: 2025-03-01
updated: 2025-03-05
category: seo
---
Isi kedua.
```

`lib/content.fixtures/posts/orphan.en.md`:

```md
---
title: Orphan
excerpt: No Indonesian file, must be ignored.
date: 2025-04-01
category: web
---
```

`lib/content.fixtures/case-studies/toko.id.md`:

```md
---
title: Toko Online
clientName: Toko Maju
date: 2025-05-01
category: web
---
## Challenge

Tantangan toko.

## Solution

Solusi toko.

## Results

Hasil toko.
```

- [ ] **Step 2: Write the failing tests**

`lib/content.test.ts`:

```ts
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
  assert.equal(id[1].icon, '/blog/web.svg')
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
```

Also create `lib/content.fixtures-bad/posts/bad.id.md`:

```md
---
title: Bad
excerpt: Bad
date: 2025-01-01
category: nope
---
```

and an empty `lib/content.fixtures-bad/categories/.gitkeep`.

- [ ] **Step 3: Run tests to verify they fail**

Run: `pnpm test`
Expected: FAIL, `Cannot find module './content.ts'`.

- [ ] **Step 4: Write the loader**

`lib/content.ts`:

```ts
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { Author, Category, Post, Pillar, CaseStudy } from './types/content.ts'

/* Content root is read per call, not cached at import, so tests can point
 * different suites at different fixture trees. Reading a dozen files per
 * request is fine for this volume.
 * ponytail: no cache; add a module-level Map keyed by root if builds get slow. */
const root = () => process.env.CONTENT_DIR ?? path.join(process.cwd(), 'content')

const DEFAULT_LOCALE = 'id'

type Doc = { slug: string; file: string; data: Record<string, any>; body: string }

function readDoc(dir: string, slug: string, locale = DEFAULT_LOCALE): Doc | null {
  const base = path.join(root(), dir)
  const candidates = [`${slug}.${locale}.md`, `${slug}.${DEFAULT_LOCALE}.md`]
  for (const name of candidates) {
    const file = path.join(base, name)
    if (fs.existsSync(file)) {
      const { data, content } = matter(fs.readFileSync(file, 'utf8'))
      return { slug, file, data, body: content }
    }
  }
  return null
}

function listSlugs(dir: string): string[] {
  const base = path.join(root(), dir)
  if (!fs.existsSync(base)) return []
  return fs
    .readdirSync(base)
    .filter((f) => f.endsWith(`.${DEFAULT_LOCALE}.md`))
    .map((f) => f.slice(0, -`.${DEFAULT_LOCALE}.md`.length))
}

const isoDay = (v: unknown) =>
  v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? '')

// Authors

export function getAuthors(): Author[] {
  const base = path.join(root(), 'authors')
  if (!fs.existsSync(base)) return []
  return fs
    .readdirSync(base)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(base, f), 'utf8'))
      return { slug: f.slice(0, -3), name: data.name, role: data.role, photo: data.photo, bio: content }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

function authorBySlug(slug?: string): Author | undefined {
  return slug ? getAuthors().find((a) => a.slug === slug) : undefined
}

// Categories

function toCategory(doc: Doc): Category {
  return { slug: doc.slug, title: doc.data.title, description: doc.data.description, icon: doc.data.icon }
}

export function getCategories(locale?: string): Category[] {
  return listSlugs('categories')
    .map((slug) => toCategory(readDoc('categories', slug, locale)!))
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function getCategoryBySlug(slug: string, locale?: string): Category | null {
  const doc = readDoc('categories', slug, locale)
  return doc ? toCategory(doc) : null
}

function requireCategory(doc: Doc, locale?: string): Category {
  const cat = getCategoryBySlug(doc.data.category, locale)
  if (!cat) throw new Error(`Unknown category "${doc.data.category}" in ${doc.file}`)
  return cat
}

// Posts

function toPost(doc: Doc, locale?: string): Post {
  const d = doc.data
  return {
    slug: doc.slug,
    title: d.title,
    excerpt: d.excerpt ?? '',
    body: doc.body,
    date: isoDay(d.date),
    updated: isoDay(d.updated ?? d.date),
    category: requireCategory(doc, locale),
    pillar: d.pillar,
    author: authorBySlug(d.author),
    image: d.image,
    imageAlt: d.imageAlt,
    tags: d.tags ?? [],
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
    ctaTitle: d.ctaTitle,
    ctaDescription: d.ctaDescription,
  }
}

const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date)

export function getBlogPosts(
  options: { categorySlug?: string; pillarSlug?: string; limit?: number; skip?: number; locale?: string } = {},
): { posts: Post[]; total: number } {
  let posts = listSlugs('posts')
    .map((slug) => toPost(readDoc('posts', slug, options.locale)!, options.locale))
    .sort(byDateDesc)
  if (options.categorySlug) posts = posts.filter((p) => p.category.slug === options.categorySlug)
  if (options.pillarSlug) posts = posts.filter((p) => p.pillar === options.pillarSlug)
  const total = posts.length
  const skip = options.skip ?? 0
  return { posts: posts.slice(skip, skip + (options.limit ?? 10)), total }
}

export function getBlogPostBySlug(categorySlug: string, slug: string, locale?: string): Post | null {
  const doc = readDoc('posts', slug, locale)
  if (!doc) return null
  const post = toPost(doc, locale)
  return post.category.slug === categorySlug ? post : null
}

// Pillars

function toPillar(doc: Doc, locale?: string): Pillar {
  const d = doc.data
  return {
    slug: doc.slug,
    title: d.title,
    introduction: d.introduction ?? '',
    body: doc.body,
    date: isoDay(d.date),
    updated: isoDay(d.updated ?? d.date),
    category: requireCategory(doc, locale),
    author: authorBySlug(d.author),
    relatedPosts: getBlogPosts({ pillarSlug: doc.slug, locale, limit: 1000 }).posts,
    image: d.image,
    imageAlt: d.imageAlt,
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
    ctaTitle: d.ctaTitle,
    ctaDescription: d.ctaDescription,
  }
}

export function getPillarPages(categorySlug?: string, locale?: string): Pillar[] {
  let pillars = listSlugs('pillars')
    .map((slug) => toPillar(readDoc('pillars', slug, locale)!, locale))
    .sort((a, b) => a.title.localeCompare(b.title))
  if (categorySlug) pillars = pillars.filter((p) => p.category.slug === categorySlug)
  return pillars
}

export function getPillarPageBySlug(categorySlug: string, slug: string, locale?: string): Pillar | null {
  const doc = readDoc('pillars', slug, locale)
  if (!doc) return null
  const pillar = toPillar(doc, locale)
  return pillar.category.slug === categorySlug ? pillar : null
}

// Case studies

function section(body: string, heading: string): string {
  const re = new RegExp(`^## ${heading}\\s*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm')
  return body.match(re)?.[1] ?? ''
}

function toCaseStudy(doc: Doc, locale?: string): CaseStudy {
  const d = doc.data
  return {
    slug: doc.slug,
    title: d.title,
    clientName: d.clientName,
    challenge: section(doc.body, 'Challenge'),
    solution: section(doc.body, 'Solution'),
    results: section(doc.body, 'Results'),
    date: isoDay(d.date),
    updated: isoDay(d.updated ?? d.date),
    category: d.category ? requireCategory(doc, locale) : undefined,
    image: d.image,
    imageAlt: d.imageAlt,
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
    ctaTitle: d.ctaTitle,
    ctaDescription: d.ctaDescription,
  }
}

export function getCaseStudies(
  options: { limit?: number; skip?: number; locale?: string } = {},
): { caseStudies: CaseStudy[]; total: number } {
  const all = listSlugs('case-studies')
    .map((slug) => toCaseStudy(readDoc('case-studies', slug, options.locale)!, options.locale))
    .sort(byDateDesc)
  const skip = options.skip ?? 0
  return { caseStudies: all.slice(skip, skip + (options.limit ?? 10)), total: all.length }
}

export function getCaseStudyBySlug(slug: string, locale?: string): CaseStudy | null {
  const doc = readDoc('case-studies', slug, locale)
  return doc ? toCaseStudy(doc, locale) : null
}
```

Note on `gray-matter` dates: YAML parses `date: 2025-02-01` into a `Date` object. `isoDay` normalises both `Date` and string values to `YYYY-MM-DD`.

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm test`
Expected: PASS, 10 tests.

If `import.meta.dirname` is undefined, the Node version is older than 20.11; use `path.dirname(new URL(import.meta.url).pathname)` instead.

- [ ] **Step 6: Commit**

```bash
git add lib/content.ts lib/content.test.ts lib/content.fixtures lib/content.fixtures-bad
git commit -m "feat(content): markdown loader with id fallback and slug relations"
```

---

### Task 3: Reading time and Markdown-to-text helper

**Files:**
- Modify: `lib/utils/reading-time.ts` (rewrite whole file)
- Create: `lib/utils/reading-time.test.ts`

**Interfaces:**
- Produces:
  - `markdownToText(md: string | null | undefined): string` — strips Markdown syntax to plain text. Used by `CaseStudyCard` and the case-study page description.
  - `calculateReadingTime(content: string | null | undefined, wordsPerMinute = 200): number`
  - `calculateCombinedReadingTime(contents: (string | null | undefined)[], wordsPerMinute = 200): number`

- [ ] **Step 1: Write the failing test**

`lib/utils/reading-time.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { markdownToText, calculateReadingTime, calculateCombinedReadingTime } from './reading-time.ts'

test('markdownToText strips syntax', () => {
  const md = '# Judul\n\nTeks **tebal** dan _miring_ dengan [tautan](https://x.id) dan ![gambar](/a.png).\n\n- satu\n1. dua\n\n> kutip\n\n---\n'
  assert.equal(markdownToText(md), 'Judul Teks tebal dan miring dengan tautan dan . satu dua kutip')
  assert.equal(markdownToText(undefined), '')
})

test('reading time rounds up with a minimum of one minute', () => {
  assert.equal(calculateReadingTime('satu dua tiga'), 1)
  assert.equal(calculateReadingTime(Array(401).fill('kata').join(' ')), 3)
  assert.equal(calculateReadingTime(''), 0)
})

test('combined reading time sums parts', () => {
  const twoHundred = Array(200).fill('kata').join(' ')
  assert.equal(calculateCombinedReadingTime([twoHundred, twoHundred, null]), 2)
  assert.equal(calculateCombinedReadingTime([null]), 1)
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test`
Expected: FAIL in `reading-time.test.ts` with an import error for `markdownToText` or a type error from the Contentful import.

- [ ] **Step 3: Rewrite `lib/utils/reading-time.ts`**

```ts
/* Plain-text view of a Markdown string. Good enough for word counts and
 * meta descriptions; not a parser. */
export function markdownToText(md: string | null | undefined): string {
  if (!md) return ''
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '') // headings, quotes, bullets
    .replace(/^\s*-{3,}\s*$/gm, '') // rules
    .replace(/(\*\*|__|\*|_|`)/g, '') // emphasis and code marks
    .replace(/\s+/g, ' ')
    .trim()
}

export function calculateReadingTime(content: string | null | undefined, wordsPerMinute = 200): number {
  const words = markdownToText(content).split(' ').filter(Boolean).length
  if (words === 0) return 0
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export function calculateCombinedReadingTime(
  contents: (string | null | undefined)[],
  wordsPerMinute = 200,
): number {
  const total = contents.reduce((sum, c) => sum + calculateReadingTime(c, wordsPerMinute), 0)
  return Math.max(1, total)
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test`
Expected: PASS, 13 tests total.

- [ ] **Step 5: Commit**

```bash
git add lib/utils/reading-time.ts lib/utils/reading-time.test.ts
git commit -m "refactor(reading-time): count words from markdown strings"
```

---

### Task 4: RichTextRenderer on react-markdown

**Files:**
- Modify: `components/blog/RichTextRenderer.tsx` (rewrite whole file)

**Interfaces:**
- Produces: `RichTextRenderer({ content }: { content: string })`. Same export name and prop name as today, so no call site changes its JSX.

- [ ] **Step 1: Rewrite the file**

```tsx
/* Hallmark · design-system: design.md */
import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";

interface RichTextRendererProps {
  content: string;
}

/* Class map mirrors the previous Contentful renderer one-for-one so the
 * typography does not move when the data source changes. */
const components: Components = {
  h1: ({ children }) => (
    <h1 className="font-heading text-3xl font-bold mb-6 mt-10 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-heading text-2xl font-bold mb-4 mt-10">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-heading text-xl font-bold mb-3 mt-8">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="font-heading text-lg font-bold mb-3 mt-6">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="mb-5 leading-relaxed text-ink-2">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-5 ml-6 list-outside list-disc space-y-2 text-ink-2 marker:text-lime-green">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 ml-6 list-outside list-decimal space-y-2 text-ink-2 marker:text-lime-green">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-2">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-2 border-lime-green pl-5 italic text-ink">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-rule" />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-lime-green underline underline-offset-4 transition-colors duration-200 hover:text-lime-green/80"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) =>
    src ? (
      /* ponytail: fixed 1200x675 intrinsic size, same fallback the Contentful
       * renderer used; h-auto keeps the real ratio once loaded. Read dims from
       * disk if CLS is ever measured to matter. */
      <Image
        src={String(src)}
        alt={alt ?? ""}
        width={1200}
        height={675}
        sizes="(max-width: 768px) 100vw, 64ch"
        className="my-6 h-auto w-full rounded-card"
      />
    ) : null,
};

export function RichTextRenderer({ content }: RichTextRendererProps) {
  return (
    <div>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 2: Type-check just this file**

Run: `pnpm exec tsc --noEmit -p tsconfig.json 2>&1 | grep RichTextRenderer`
Expected: no output. Other files will still error until later tasks; that is expected.

Note: `react-markdown` wraps an `img` inside a `p`. `next/image` renders an `img`, so the markup stays valid.

- [ ] **Step 3: Commit**

```bash
git add components/blog/RichTextRenderer.tsx
git commit -m "refactor(blog): render markdown with react-markdown, same class map"
```

---

### Task 5: Migrate the live Contentful space into content/ and public/blog/

**Files:**
- Create then delete: `scripts/migrate-contentful.mjs`
- Create: `content/**`, `public/blog/**`

**Interfaces:**
- Consumes: the frontmatter shapes from the spec and the `content/` layout from the loader in Task 2.
- Produces: 5 categories, 7 posts, 3 pillars, 0 case studies, 1 author, 26 assets.

- [ ] **Step 1: Write the migration script**

`scripts/migrate-contentful.mjs` (uses only `fetch`, `fs`, and `gray-matter`; the `contentful` SDK is not needed):

```js
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const SPACE = process.env.CONTENTFUL_SPACE_ID
const ENV = process.env.CONTENTFUL_ENVIRONMENT || 'master'
const TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
if (!SPACE || !TOKEN) throw new Error('set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN')

const API = `https://cdn.contentful.com/spaces/${SPACE}/environments/${ENV}`
const get = async (p) => (await fetch(`${API}/${p}&access_token=${TOKEN}&limit=1000`)).json()

const OUT = path.join(process.cwd(), 'content')
const IMG = path.join(process.cwd(), 'public', 'blog')
fs.mkdirSync(IMG, { recursive: true })
for (const d of ['authors', 'categories', 'pillars', 'posts', 'case-studies']) fs.mkdirSync(path.join(OUT, d), { recursive: true })

// Assets: download and map id -> { path, title }
const assets = (await get('assets?')).items
const used = new Set()
const assetMap = {}
for (const a of assets) {
  const file = a.fields.file
  if (!file) continue
  let name = file.fileName.replace(/[^\w.-]+/g, '-')
  if (used.has(name)) name = `${a.sys.id}-${name}`
  used.add(name)
  const buf = Buffer.from(await (await fetch(`https:${file.url}`)).arrayBuffer())
  fs.writeFileSync(path.join(IMG, name), buf)
  assetMap[a.sys.id] = { path: `/blog/${name}`, title: a.fields.title || '' }
}

// Rich text -> Markdown
const marks = (t) => {
  let s = t.value
  const m = new Set(t.marks?.map((x) => x.type))
  if (m.has('code')) s = `\`${s}\``
  if (m.has('bold')) s = `**${s}**`
  if (m.has('italic')) s = `_${s}_`
  return s
}
function inline(nodes) {
  return nodes
    .map((n) => {
      if (n.nodeType === 'text') return marks(n)
      if (n.nodeType === 'hyperlink') return `[${inline(n.content)}](${n.data.uri})`
      return inline(n.content ?? [])
    })
    .join('')
}
function block(n, depth = 0) {
  const c = n.content ?? []
  switch (n.nodeType) {
    case 'document': return c.map((x) => block(x)).join('\n\n')
    case 'paragraph': return inline(c)
    case 'heading-1': return `# ${inline(c)}`
    case 'heading-2': return `## ${inline(c)}`
    case 'heading-3': return `### ${inline(c)}`
    case 'heading-4': return `#### ${inline(c)}`
    case 'heading-5': return `##### ${inline(c)}`
    case 'heading-6': return `###### ${inline(c)}`
    case 'blockquote': return c.map((x) => `> ${block(x)}`).join('\n>\n')
    case 'hr': return '---'
    case 'unordered-list': return c.map((li) => `${'  '.repeat(depth)}- ${item(li, depth)}`).join('\n')
    case 'ordered-list': return c.map((li, i) => `${'  '.repeat(depth)}${i + 1}. ${item(li, depth)}`).join('\n')
    case 'embedded-asset-block': {
      const a = assetMap[n.data.target.sys.id]
      return a ? `![${a.title}](${a.path})` : ''
    }
    default: return inline(c)
  }
}
const item = (li, depth) => (li.content ?? []).map((x) => block(x, depth + 1)).join('\n' + '  '.repeat(depth + 1))
const md = (doc) => (doc ? block(doc).trim() + '\n' : '')
const plain = (doc) => md(doc).replace(/\s+/g, ' ').trim()

const day = (s) => s.slice(0, 10)
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)))
const write = (dir, name, data, body = '') =>
  fs.writeFileSync(path.join(OUT, dir, name), matter.stringify(body, clean(data)))

// Fetch entries; raw REST leaves links unresolved, so build id maps first.
const entries = async (type) => (await get(`entries?content_type=${type}&include=0`)).items
const [authors, categories, pillars, posts, caseStudies] = await Promise.all(
  ['author', 'category', 'pillarPage', 'blogPost', 'caseStudy'].map(entries),
)
const authorSlug = Object.fromEntries(authors.map((a) => [a.sys.id, slugify(a.fields.name)]))
const categorySlug = Object.fromEntries(categories.map((c) => [c.sys.id, c.fields.slug]))
const pillarSlug = Object.fromEntries(pillars.map((p) => [p.sys.id, p.fields.slug]))
const link = (map, ref) => (ref ? map[ref.sys.id] : undefined)
const img = (ref) => (ref ? assetMap[ref.sys.id] : undefined)

for (const a of authors) {
  write('authors', `${authorSlug[a.sys.id]}.md`, { name: a.fields.name, role: a.fields.role, photo: img(a.fields.photo)?.path }, md(a.fields.bio))
}
for (const c of categories) {
  write('categories', `${c.fields.slug}.id.md`, { title: c.fields.title, description: plain(c.fields.description), icon: img(c.fields.icon)?.path })
}
const seoCta = (f) => ({ seoTitle: f.seoTitle, seoDescription: f.seoDescription, ctaTitle: f.ctaTitle, ctaDescription: f.ctaDescription })
for (const p of pillars) {
  const f = p.fields
  write('pillars', `${f.slug}.id.md`, {
    title: f.title, introduction: plain(f.introduction), date: day(p.sys.createdAt), updated: day(p.sys.updatedAt),
    category: link(categorySlug, f.category), author: link(authorSlug, f.author),
    image: img(f.featuredImage)?.path, imageAlt: img(f.featuredImage)?.title, ...seoCta(f),
  }, md(f.body))
}
for (const p of posts) {
  const f = p.fields
  write('posts', `${f.slug}.id.md`, {
    title: f.title, excerpt: f.excerpt, date: day(p.sys.createdAt), updated: day(p.sys.updatedAt),
    category: link(categorySlug, f.category), pillar: link(pillarSlug, f.pillar), author: link(authorSlug, f.author),
    image: img(f.featuredImage)?.path, imageAlt: img(f.featuredImage)?.title, tags: f.tags, ...seoCta(f),
  }, md(f.body))
}
for (const c of caseStudies) {
  const f = c.fields
  const body = `## Challenge\n\n${md(f.challenge)}\n## Solution\n\n${md(f.solution)}\n## Results\n\n${md(f.results)}`
  write('case-studies', `${f.slug}.id.md`, {
    title: f.title, clientName: f.clientName, date: day(c.sys.createdAt), updated: day(c.sys.updatedAt),
    category: link(categorySlug, f.category), image: img(f.featuredImage)?.path, imageAlt: img(f.featuredImage)?.title, ...seoCta(f),
  }, body)
}
console.log({ authors: authors.length, categories: categories.length, pillars: pillars.length, posts: posts.length, caseStudies: caseStudies.length, assets: Object.keys(assetMap).length })
```

- [ ] **Step 2: Run it with the env vars from `.env.local`**

```bash
set -a; . ./.env.local; set +a; node scripts/migrate-contentful.mjs
```

Expected output: `{ authors: 1, categories: 5, pillars: 3, posts: 7, caseStudies: 0, assets: 26 }` (asset count may be lower if some assets have no file).

- [ ] **Step 3: Inspect the output**

```bash
ls content/* public/blog | head -60
head -30 content/posts/$(ls content/posts | head -1)
```

Check: every post has `title`, `excerpt`, `date`, `category`; body has real Markdown headings and paragraphs; image paths point at files that exist in `public/blog/`. Open two posts fully and compare against the live site for missing bold, links, or images. Fix the converter and re-run if anything is dropped.

- [ ] **Step 4: Run the loader against the real content**

```bash
node --input-type=module -e "
process.env.CONTENT_DIR = process.cwd() + '/content'
const c = await import('./lib/content.ts')
console.log(c.getBlogPosts({ limit: 100 }).total, c.getPillarPages().length, c.getCategories().length, c.getAuthors().length)
"
```

Expected: `7 3 5 1`, no thrown error about unknown categories.

- [ ] **Step 5: Delete the script and commit the content**

```bash
rm scripts/migrate-contentful.mjs && rmdir scripts 2>/dev/null
git add content public/blog
git commit -m "content: migrate blog posts, guides, categories, and assets from Contentful"
```

---

### Task 6: Cards and sections

**Files:**
- Modify: `components/blog/BlogPostCard.tsx`
- Modify: `components/blog/PillarCard.tsx`
- Modify: `components/blog/CategoryCard.tsx`
- Modify: `components/blog/CaseStudyCard.tsx`
- Modify: `components/sections/BlogSection.tsx`
- Modify: `components/sections/BlogHeroSection.tsx`

**Interfaces:**
- Consumes: `Post`, `Pillar`, `Category`, `CaseStudy` from `@/lib/types/content`; `getBlogPosts`, `getPillarPages` from `@/lib/content`; `markdownToText` from `@/lib/utils/reading-time`.
- Produces: same component names and prop names. `BlogPostCard` takes `post: Post`, `PillarCard` takes `pillar: Pillar`, `CategoryCard` takes `category: Category`, `CaseStudyCard` takes `caseStudy: CaseStudy`.

- [ ] **Step 1: `BlogPostCard.tsx`**

Replace the two imports at the top with:

```ts
import { Post } from '@/lib/types/content'
```

Replace the prop type and the body up to the `return`:

```ts
interface BlogPostCardProps {
  post: Post
  locale?: string
}

export function BlogPostCard({ post, locale }: BlogPostCardProps) {
  const categorySlug = post.category.slug
  const postSlug = post.slug
  const imageUrl = post.image
```

Remove the `if (!category?.title ...) return null` guard (the loader guarantees these). In the JSX replace `category.title` with `post.category.title`, `post.fields.title` with `post.title`, and both `post.sys.createdAt` with `post.date`.

- [ ] **Step 2: `PillarCard.tsx`**

Replace the two `@/lib/types/contentful` and `@/lib/utils/contentful` imports with `import { Pillar } from '@/lib/types/content'`. Change `pillar: PillarPageEntry` to `pillar: Pillar`. Replace `getImageUrl(pillar.fields.featuredImage)` with `pillar.image`, `pillar.fields.slug` with `pillar.slug`, `pillar.fields.title` with `pillar.title`, and both `pillar.sys.createdAt` with `pillar.date`.

- [ ] **Step 3: `CategoryCard.tsx`**

Replace the type and utils imports with `import { Category } from "@/lib/types/content";`. Change `category: CategoryEntry` to `category: Category`. Replace the destructuring lines with:

```ts
  const { title, slug, icon, description } = category;
  const iconUrl = icon;
```

Replace `src={toAbsoluteUrl(iconUrl)}` with `src={iconUrl}` and `{getPlainTextFromRichText(description)}` with `{description}`.

- [ ] **Step 4: `CaseStudyCard.tsx`**

Replace the two imports with:

```ts
import { CaseStudy } from '@/lib/types/content'
import { markdownToText } from '@/lib/utils/reading-time'
```

Change `caseStudy: CaseStudyEntry` to `caseStudy: CaseStudy`. Replace the four lines from `const { slug, ...` through `const outcome = ...` with:

```ts
  const { slug, title, image: imageUrl, clientName, challenge, results } = caseStudy
  const summary = markdownToText(challenge)
  const outcome = markdownToText(results)
```

- [ ] **Step 5: `BlogSection.tsx`**

Change the import to `import { getBlogPosts, getPillarPages } from '@/lib/content'`. Replace `pillar.sys.id` with `pillar.slug`, `pillar.fields.category?.fields?.slug || ''` with `pillar.category.slug`. In the posts map replace the three lines computing `categorySlug`, `postSlug`, and the `return null` guard with:

```ts
                const categorySlug = post.category.slug
                const postSlug = post.slug
```

Replace `post.sys.id` with `post.slug`, `post.fields.title` with `post.title`, `post.sys.createdAt` with `post.date`.

- [ ] **Step 6: `BlogHeroSection.tsx`**

Delete the `toAbsoluteUrl` import and the comment above `src=`. Change `src={toAbsoluteUrl(imageUrl)}` to `src={imageUrl}`.

- [ ] **Step 7: Type-check these six files**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "components/(blog|sections)/"`
Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add components
git commit -m "refactor(blog): cards and sections read flat content types"
```

---

### Task 7: Pages and sitemap

**Files:**
- Modify: `app/[locale]/blog/page.tsx`
- Modify: `app/[locale]/blog/[category]/page.tsx`
- Modify: `app/[locale]/blog/[category]/[post]/page.tsx`
- Modify: `app/[locale]/blog/[category]/guides/[pillar]/page.tsx`
- Modify: `app/[locale]/blog/case-studies/page.tsx`
- Modify: `app/[locale]/blog/case-studies/[slug]/page.tsx`
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes: everything from `@/lib/content`, `@/lib/types/content`, `markdownToText` and `calculateCombinedReadingTime` from `@/lib/utils/reading-time`.

In every file below, first change `from "@/lib/services/contentful"` to `from "@/lib/content"` and delete any `from "@/lib/utils/contentful"` import line. `await` on loader calls may stay.

- [ ] **Step 1: `app/[locale]/blog/page.tsx`**

Replace `pillar.sys.id` with `pillar.slug`, `pillar.fields.category?.fields?.slug || ""` with `pillar.category.slug`, `post.sys.id` with `post.slug`, `category.sys.id` with `category.slug`.

- [ ] **Step 2: `app/[locale]/blog/[category]/page.tsx`**

Delete the `RichTextRenderer` import if nothing else uses it after this step. Replace:
- `getPlainTextFromRichText(category.fields.description)` with `category.description`
- every `category.fields.title` with `category.title`
- `category.fields.icon && (` with `category.icon && (` and `src={toAbsoluteUrl(category.fields.icon.fields.file?.url)}` with `src={category.icon}`
- the description block (the `typeof ... === "string" ? ... : <RichTextRenderer ...>` ternary) with just `{category.description}` inside the same `div`, guarded by `category.description && (`
- `pillar.sys.id` with `pillar.slug`, `post.sys.id` with `post.slug`
- `getAssetUrl(category.fields.icon) ? (` with `category.icon ? (` and `src={toAbsoluteUrl(getAssetUrl(category.fields.icon)!)}` with `src={category.icon}`

- [ ] **Step 3: `app/[locale]/blog/[category]/[post]/page.tsx`**

Replace:
- `post.fields.X` with `post.X` for `seoTitle`, `title`, `seoDescription`, `excerpt`, `body`, `ctaTitle`, `ctaDescription`, `tags`
- `relatedPost.sys.id !== post.sys.id` with `relatedPost.slug !== post.slug`; `key={relatedPost.sys.id}` with `key={relatedPost.slug}`
- `const category = post.fields.category.fields;` with `const category = post.category;`
- `const author = post.fields.author?.fields;` with `const author = post.author;`
- `const pillar = post.fields.pillar?.fields;` with `const pillar = post.pillar ? await getPillarPageBySlug(category.slug, post.pillar, locale) : null;` and add `getPillarPageBySlug` to the `@/lib/content` import. Check how `pillar` is used further down; it was `{ title, slug }` from the pillar entry and `Pillar` has both, so the JSX stays.
- `const heroImage = post.fields.featuredImage?.fields.file?.url;` with `const heroImage = post.image;`
- `image: heroImage ? toAbsoluteUrl(heroImage) : undefined,` with `image: heroImage,`
- `post.sys.createdAt` with `post.date` (three places), `post.sys.updatedAt` with `post.updated`
- `<RichTextRenderer content={author.bio} />` stays; `author.bio` is now a string and the renderer takes strings.

- [ ] **Step 4: `app/[locale]/blog/[category]/guides/[pillar]/page.tsx`**

Replace:
- `pillar.fields.X` with `pillar.X` for `seoTitle`, `title`, `seoDescription`, `introduction`, `body`, `ctaTitle`, `ctaDescription`
- the `getBlogPosts({ pillarId: pillar.sys.id, locale, limit: 6 })` call with `getBlogPosts({ pillarSlug: pillar.slug, locale, limit: 6 })`
- `const category = pillar.fields.category.fields;` with `const category = pillar.category;`
- `const heroImage = pillar.fields.featuredImage?.fields.file?.url;` with `const heroImage = pillar.image;`
- `image: heroImage ? toAbsoluteUrl(heroImage) : undefined,` with `image: heroImage,`
- `pillar.sys.createdAt` with `pillar.date` (two places), `pillar.sys.updatedAt` with `pillar.updated`
- `pillar.fields.author?.fields?.name` with `pillar.author?.name` (two places) and `pillar.fields.author.fields.name` with `pillar.author.name`
- `post.sys.id` with `post.slug`

- [ ] **Step 5: `app/[locale]/blog/case-studies/page.tsx`**

Replace `caseStudy.sys.id` with `caseStudy.slug`.

- [ ] **Step 6: `app/[locale]/blog/case-studies/[slug]/page.tsx`**

Add `import { markdownToText } from "@/lib/utils/reading-time";`. Replace:
- `caseStudy.fields.X` with `caseStudy.X` for `seoTitle`, `title`, `seoDescription`, `ctaTitle`, `ctaDescription`, `challenge`, `clientName`, `solution`, `results`
- both `caseStudy.fields.excerpt` (there is no excerpt on a case study) with `markdownToText(caseStudy.challenge).slice(0, 160)`
- `cs.sys.id !== caseStudy.sys.id` with `cs.slug !== caseStudy.slug`; `key={cs.sys.id}` with `key={cs.slug}`
- the `image:` schema line pair with `image: caseStudy.image,`
- `caseStudy.sys.createdAt` with `caseStudy.date`, `caseStudy.sys.updatedAt` with `caseStudy.updated`
- `caseStudy.fields.featuredImage && (` with `caseStudy.image && (`; `src={toAbsoluteUrl(caseStudy.fields.featuredImage.fields.file?.url)}` with `src={caseStudy.image}`; the `alt` expression `caseStudy.fields.featuredImage.fields.title || caseStudy.fields.title` with `caseStudy.imageAlt || caseStudy.title`
- `caseStudy.fields.category.fields?.title` with `caseStudy.category.title` (inside the existing `caseStudy.category && (` guard)

- [ ] **Step 7: `app/sitemap.ts`**

Change the import source to `@/lib/content`. In the loops replace `c.fields.slug` with `c.slug`, `c.sys.updatedAt` with `c.updated`, `p.fields.category?.fields?.slug` with `p.category.slug`, `p.fields.slug` with `p.slug`, `p.sys.updatedAt` with `p.updated`. Update the `catch` log text from `Contentful fetch failed` to `content load failed`.

- [ ] **Step 8: Full type-check and build**

Run: `pnpm exec tsc --noEmit`
Expected: no errors mentioning `fields`, `sys`, or `contentful`. Errors that pre-date this work (the repo has `ignoreBuildErrors: true`) may remain; compare against `git stash; pnpm exec tsc --noEmit; git stash pop` if unsure.

Run: `pnpm build`
Expected: build succeeds; the route list shows the six blog routes.

- [ ] **Step 9: Commit**

```bash
git add app
git commit -m "refactor(blog): pages and sitemap read local markdown content"
```

---

### Task 8: Remove Contentful and verify

**Files:**
- Delete: `lib/contentful.ts`, `lib/services/contentful.ts`, `lib/utils/contentful.ts`, `lib/types/contentful.ts`, `contentful_content_type.json`
- Modify: `package.json`, `next.config.mjs`, `.env.local`, `README.md` and `AGENTS.md` if they mention Contentful

- [ ] **Step 1: Delete files and packages**

```bash
git rm lib/contentful.ts lib/services/contentful.ts lib/utils/contentful.ts lib/types/contentful.ts contentful_content_type.json
rmdir lib/services
pnpm remove contentful @contentful/rich-text-react-renderer @contentful/rich-text-plain-text-renderer @contentful/rich-text-types
```

- [ ] **Step 2: Remove the image allowlist**

In `next.config.mjs` delete the whole `images: { ... }` block including its comment. The config then has `trailingSlash`, `eslint`, `typescript`, and `compress` only.

- [ ] **Step 3: Remove env vars**

In `.env.local` (not committed) delete `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENVIRONMENT`, `CONTENTFUL_ACCESS_TOKEN`, `CMS_PROVIDER`. Do the same in the Vercel project settings after merge; note it in the final report.

- [ ] **Step 4: Grep for leftovers**

Run: `grep -rli contentful --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=out --exclude-dir=docs .`
Expected: only `pnpm-lock.yaml` if pnpm kept a stale entry (run `pnpm install` to prune) and nothing else. Fix any hit in `README.md` or `AGENTS.md` by replacing the Contentful description with two sentences: content lives in `content/` as Markdown with frontmatter, one file per document per locale, Indonesian is the fallback.

- [ ] **Step 5: Build with no Contentful env at all**

```bash
env -u CONTENTFUL_SPACE_ID -u CONTENTFUL_ACCESS_TOKEN -u CONTENTFUL_ENVIRONMENT pnpm build
```

Expected: success.

- [ ] **Step 6: Diff the sitemap against production**

```bash
pnpm start -p 3111 &
sleep 5
curl -s http://localhost:3111/sitemap.xml | grep -o 'https://www.arktik.id/[^<]*blog/[^<]*' | sort > /tmp/local-sitemap.txt
curl -s https://www.arktik.id/sitemap.xml | grep -o 'https://www.arktik.id/[^<]*blog/[^<]*' | sort > /tmp/prod-sitemap.txt
diff /tmp/prod-sitemap.txt /tmp/local-sitemap.txt && echo SAME
kill %1
```

Expected: `SAME`. Any difference means a slug or category link was migrated wrong; fix the content file, not the code.

- [ ] **Step 7: Spot-check rendering**

With `pnpm start` running, open one post, one guide, one category, `/blog/`, and the same post under `/en/`. Confirm heading, body, featured image, author block, and related posts render, and that `/en/` shows the Indonesian text.

- [ ] **Step 8: Run tests and commit**

```bash
pnpm test
git add -A
git commit -m "chore: remove Contentful client, types, packages, and image allowlist"
```

---

## Self-review

**Spec coverage:** layout and frontmatter (Task 5 writes them, Task 2 reads them); loader and fallback (Task 2); relations and dangling-category error (Task 2); reading time on strings (Task 3); renderer (Task 4); consumer changes (Tasks 6 and 7); deletions and config (Task 8); migration (Task 5); verification list (Task 8 Steps 5 to 7). No gaps.

**Placeholders:** none. Every code step shows the code or the exact replacements.

**Type consistency:** `pillarSlug` is the option name in Task 2, Task 7 Step 4, and the pillar's `relatedPosts`. `markdownToText` is defined in Task 3 and consumed in Tasks 6 and 7. `Pillar.author` is in Task 1 and used in Task 7 Step 4. `CaseStudy` has no `excerpt`, and Task 7 Step 6 replaces both uses.
