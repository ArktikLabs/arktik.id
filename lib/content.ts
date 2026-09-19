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
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) return null
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