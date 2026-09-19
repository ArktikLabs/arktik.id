# Local Markdown content for blog and case studies

Date: 2026-09-19
Status: approved

## Goal

Remove the runtime and build-time dependency on the Contentful API. Blog posts,
pillar guides, categories, case studies, and authors live in the repo as
Markdown files with YAML frontmatter. Content is bilingual with Indonesian as
the source of truth and English as an optional override per document.

## Current state

- All blog data comes from `lib/services/contentful.ts` through a client in
  `lib/contentful.ts`. Sixteen files under `app/`, `components/`, and `lib/`
  import Contentful types or helpers.
- Live content: 5 categories, 7 blog posts, 3 pillar pages, 0 case studies,
  1 author, 26 assets.
- Bodies are Contentful rich-text documents rendered by
  `components/blog/RichTextRenderer.tsx`. The renderer handles headings 1-4,
  paragraphs, unordered and ordered lists, quotes, horizontal rules,
  hyperlinks, and embedded images. Nothing else appears in the content.
- Featured images are served from `images.ctfassets.net` and allowlisted in
  `next.config.mjs`.
- The service ignores `en` and serves Indonesian content for both locales.
- Routes that must keep their exact paths:
  - `/{locale}/blog/`
  - `/{locale}/blog/case-studies/`
  - `/{locale}/blog/case-studies/{slug}/`
  - `/{locale}/blog/{category}/`
  - `/{locale}/blog/{category}/{post}/`
  - `/{locale}/blog/{category}/guides/{pillar}/`
  - the same entries in `app/sitemap.ts`

## Content layout

```
content/
  authors/<slug>.md
  categories/<slug>.id.md      optional <slug>.en.md
  pillars/<slug>.id.md         optional <slug>.en.md
  posts/<slug>.id.md           optional <slug>.en.md
  case-studies/<slug>.id.md    optional <slug>.en.md
public/blog/<filename>         the downloaded Contentful assets
```

Authors are not localised. Every other document is `<slug>.<locale>.md`. The
slug in the filename is the URL slug. A document exists only if its `.id.md`
file exists. An `.en.md` without a matching `.id.md` is ignored.

### Frontmatter

Post:

```yaml
title: string            required
excerpt: string          required
date: YYYY-MM-DD         required, replaces sys.createdAt (ordering, sitemap)
updated: YYYY-MM-DD      optional, defaults to date, replaces sys.updatedAt
category: string         required, category slug
pillar: string           optional, pillar slug
author: string           optional, author slug
image: string            optional, path under /public, e.g. /blog/hero.jpg
imageAlt: string         optional
tags: string[]           optional
seoTitle: string         optional
seoDescription: string   optional
ctaTitle: string         optional
ctaDescription: string   optional
```

Pillar: same as post minus `pillar` and `tags`, plus `introduction: string`
(Markdown, may be multi-line).

Case study: `title`, `date`, `updated`, `clientName`, `category`, `image`,
`imageAlt`, and the same `seo*` and `cta*` fields. The body holds three
top-level `## Challenge`, `## Solution`, `## Results` sections. The loader
splits the body on those three headings so the page keeps its three-block
layout. Missing sections yield an empty string.

Category: `title`, `description`, `icon` (path under `/public`). Body unused.

Author: `name`, `role`, `photo` (path under `/public`). Body is the bio in
Markdown.

## Loader

`lib/content.ts` replaces `lib/contentful.ts` and `lib/services/contentful.ts`.
It uses `fs` and `path` to read `content/` and `gray-matter` to parse
frontmatter. It only runs on the server (server components,
`generateStaticParams`, sitemap).

Exported functions keep today's names and roughly today's signatures so the
page changes stay mechanical:

```ts
getCategories(locale): Category[]
getCategoryBySlug(slug, locale): Category | null
getBlogPosts({ categorySlug?, pillarSlug?, limit?, skip?, locale }): { posts: Post[]; total: number }
getBlogPostBySlug(categorySlug, slug, locale): Post | null
getPillarPages(categorySlug?, locale): Pillar[]
getPillarPageBySlug(categorySlug, slug, locale): Pillar | null
getCaseStudies({ limit?, skip?, locale }): { caseStudies: CaseStudy[]; total: number }
getCaseStudyBySlug(slug, locale): CaseStudy | null
getAuthors(): Author[]
```

They are synchronous. Callers that `await` them keep working, so `await` may
be left in place or removed as each file is touched.

Locale fallback lives in one helper: given a directory, slug, and locale, read
`<slug>.<locale>.md` if it exists, otherwise `<slug>.id.md`. Listing functions
enumerate distinct slugs from `.id.md` files, then resolve each through that
helper. Sorting is by `date` descending for posts and case studies and by
`title` for categories and pillars.

Relations resolve at load time. A post carries the full `category` object and
the full `author` object (or `undefined`). A pillar carries its `category` and
a `relatedPosts` array computed by filtering posts whose `pillar` equals the
pillar's slug. A dangling `category` slug is a build error, thrown with the
file path in the message.

Reading time in `lib/utils/reading-time.ts` takes the Markdown body string,
strips Markdown syntax, and counts words at 200 per minute.
`lib/utils/contentful.ts` is deleted. Its plain-text helper is unnecessary
because excerpts and introductions are strings. Its image helpers are
unnecessary because image paths are local.

## Types

`lib/types/content.ts` replaces `lib/types/contentful.ts`:

```ts
interface Author { slug; name; role?; photo?; bio: string }
interface Category { slug; title; description?; icon? }
interface Post {
  slug; title; excerpt; body: string; date; updated;
  category: Category; pillar?: string; author?: Author;
  image?; imageAlt?; tags: string[];
  seoTitle?; seoDescription?; ctaTitle?; ctaDescription?
}
interface Pillar {
  slug; title; introduction: string; body: string; date; updated;
  category: Category; relatedPosts: Post[];
  image?; imageAlt?; seoTitle?; seoDescription?; ctaTitle?; ctaDescription?
}
interface CaseStudy {
  slug; title; clientName?; challenge: string; solution: string; results: string;
  date; updated; category?: Category;
  image?; imageAlt?; seoTitle?; seoDescription?; ctaTitle?; ctaDescription?
}
```

All string fields unless noted. `date` and `updated` are ISO date strings.

## Rendering

`components/blog/RichTextRenderer.tsx` keeps its name and its `content` prop,
which now takes a Markdown string. Internally it renders with `react-markdown`
and a `components` map that reproduces today's class names for h1-h4, p, ul,
ol, li, blockquote, hr, a, and img. Images render through `next/image` with
`width` and `height` read from the file on disk at build time, or fall back to
a plain `img` when the path is not local. Links to external hosts open in a
new tab with `rel="noopener noreferrer"`, matching today's behaviour.

`remark-gfm` is not added. No current content uses tables or task lists.

## Consumer changes

The 16 files that import from the Contentful modules change imports to
`@/lib/content` and `@/lib/types/content`, and replace `entry.fields.x` with
`x`, `entry.sys.id` with `slug`, `entry.sys.createdAt` with `date`, and
`entry.sys.updatedAt` with `updated`. Image helpers are replaced by the plain
`image` and `imageAlt` fields. No layout or copy changes.

## Deletions

- Packages: `contentful`, `@contentful/rich-text-react-renderer`,
  `@contentful/rich-text-plain-text-renderer`, `@contentful/rich-text-types`.
- Files: `lib/contentful.ts`, `lib/services/contentful.ts`,
  `lib/utils/contentful.ts`, `lib/types/contentful.ts`,
  `contentful_content_type.json`.
- Config: the `images.remotePatterns` block in `next.config.mjs`; the
  `CONTENTFUL_*` and `CMS_PROVIDER` variables in `.env*` files and any
  deployment environment.

## Additions

- Packages: `gray-matter`, `react-markdown`.
- `content/` tree as generated by the migration.
- `public/blog/` with the 26 assets.

## Migration

A throwaway script, kept in the session scratchpad and never committed, runs
once against the live Contentful space:

1. Fetch all entries of each content type with `include: 2` and all assets.
2. Download every asset to `public/blog/<original filename>`. On a filename
   collision, prefix with the asset id.
3. Convert each rich-text document to Markdown: headings to `#` levels,
   paragraphs to blank-line separated text, lists to `-` and `1.`, quotes to
   `>`, rules to `---`, hyperlinks to `[text](url)`, embedded assets to
   `![alt](/blog/<filename>)`, bold and italic marks to `**` and `_`.
4. Write one `.id.md` per entry with the frontmatter above. Dates come from
   `sys.createdAt` and `sys.updatedAt`, truncated to the day.
5. Write `authors/<slug>.md` for the one author.

No `.en.md` files are generated, because the space has no English content.

## Verification

- `next build` succeeds with every `CONTENTFUL_*` variable unset.
- The set of `/blog/` URLs in the generated sitemap equals the set in the
  current production sitemap.
- Each of the seven posts and three pillars renders with a heading, body, and
  featured image where one existed in Contentful.
- `/en/` blog pages render the Indonesian content, proving the fallback.
- `grep -ri contentful` across the repo, excluding `node_modules` and this
  spec, returns nothing.

## Out of scope

- Editing UI or CMS replacement. Content is edited in the repo.
- MDX or React components inside content.
- English translations of existing posts.
- Any change to page layouts, copy, or SEO metadata beyond the data source.
