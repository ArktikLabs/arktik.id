import { contentfulClient } from '@/lib/contentful'
import {
  CategoryEntry,
  BlogPostEntry,
  PillarPageEntry,
  CaseStudyEntry,
  AuthorEntry,
} from '@/lib/types/contentful'

// Helper function to handle locale properly
function getValidLocale(locale?: string): string | undefined {
  // Your Contentful space seems to only support Indonesian ('id')
  // If 'en' is requested, return undefined to get default content
  if (locale === 'en') {
    return undefined
  }
  return locale
}

// Categories
export async function getCategories(locale?: string): Promise<CategoryEntry[]> {
  try {
    const query: any = {
      content_type: 'category',
      order: ['fields.title'],
    }

    const validLocale = getValidLocale(locale)
    if (validLocale) {
      query.locale = validLocale
    }

    const response = await contentfulClient.getEntries<any>(query)
    return response.items
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getCategoryBySlug(slug: string, locale?: string): Promise<CategoryEntry | null> {
  try {
    const query: any = {
      content_type: 'category',
      'fields.slug': slug,
      limit: 1,
    }

    const validLocale = getValidLocale(locale)
    if (validLocale) {
      query.locale = validLocale
    }

    const response = await contentfulClient.getEntries<any>(query)
    return response.items[0] || null
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

// Blog Posts
export async function getBlogPosts(
  options: {
    categorySlug?: string
    pillarId?: string
    limit?: number
    skip?: number
    locale?: string
  } = {}
): Promise<{ posts: BlogPostEntry[]; total: number }> {
  try {
    const query: any = {
      content_type: 'blogPost',
      include: 2,
      order: ['-sys.createdAt'],
      limit: options.limit || 10,
      skip: options.skip || 0,
    }

    const validLocale = getValidLocale(options.locale)
    if (validLocale) {
      query.locale = validLocale
    }

    // Get all blog posts first, then filter client-side
    const response = await contentfulClient.getEntries<any>(query)

    let filteredPosts = response.items

    // Filter by category slug if specified
    if (options.categorySlug) {
      filteredPosts = filteredPosts.filter((post: any) =>
        post.fields?.category?.fields?.slug === options.categorySlug
      )
    }

    // Filter by pillar ID if specified
    if (options.pillarId) {
      filteredPosts = filteredPosts.filter((post: any) =>
        post.fields?.pillar?.sys?.id === options.pillarId
      )
    }

    return {
      posts: filteredPosts,
      total: filteredPosts.length,
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return { posts: [], total: 0 }
  }
}

export async function getBlogPostBySlug(
  categorySlug: string,
  slug: string,
  locale?: string
): Promise<BlogPostEntry | null> {
  try {
    const query: any = {
      content_type: 'blogPost',
      'fields.slug': slug,
      include: 2,
    }

    const validLocale = getValidLocale(locale)
    if (validLocale) {
      query.locale = validLocale
    }

    const response = await contentfulClient.getEntries<any>(query)

    // Filter by category slug client-side
    const post = response.items.find((item: any) =>
      item.fields?.category?.fields?.slug === categorySlug
    )

    return post || null
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Pillar Pages
export async function getPillarPages(categorySlug?: string, locale?: string): Promise<PillarPageEntry[]> {
  try {
    const query: any = {
      content_type: 'pillarPage',
      include: 2,
      order: ['fields.title'],
    }

    const validLocale = getValidLocale(locale)
    if (validLocale) {
      query.locale = validLocale
    }

    const response = await contentfulClient.getEntries<any>(query)

    let filteredPillars = response.items

    // Filter by category slug if specified
    if (categorySlug) {
      filteredPillars = filteredPillars.filter((pillar: any) =>
        pillar.fields?.category?.fields?.slug === categorySlug
      )
    }

    return filteredPillars
  } catch (error) {
    console.error('Error fetching pillar pages:', error)
    return []
  }
}

export async function getPillarPageBySlug(
  categorySlug: string,
  slug: string,
  locale?: string
): Promise<PillarPageEntry | null> {
  try {
    const query: any = {
      content_type: 'pillarPage',
      'fields.slug': slug,
      include: 2,
    }

    const validLocale = getValidLocale(locale)
    if (validLocale) {
      query.locale = validLocale
    }

    const response = await contentfulClient.getEntries<any>(query)

    // Filter by category slug client-side
    const pillar = response.items.find((item: any) =>
      item.fields?.category?.fields?.slug === categorySlug
    )

    return pillar || null
  } catch (error) {
    console.error('Error fetching pillar page:', error)
    return null
  }
}

// Case Studies
export async function getCaseStudies(
  options: {
    limit?: number
    skip?: number
    locale?: string
  } = {}
): Promise<{ caseStudies: CaseStudyEntry[]; total: number }> {
  try {
    const query: any = {
      content_type: 'caseStudy',
      order: ['-sys.createdAt'],
      limit: options.limit || 10,
      skip: options.skip || 0,
    }

    const validLocale = getValidLocale(options.locale)
    if (validLocale) {
      query.locale = validLocale
    }

    const response = await contentfulClient.getEntries<any>(query)
    return {
      caseStudies: response.items,
      total: response.total,
    }
  } catch (error) {
    console.error('Error fetching case studies:', error)
    return { caseStudies: [], total: 0 }
  }
}

export async function getCaseStudyBySlug(slug: string, locale?: string): Promise<CaseStudyEntry | null> {
  try {
    const query: any = {
      content_type: 'caseStudy',
      'fields.slug': slug,
      limit: 1,
    }

    const validLocale = getValidLocale(locale)
    if (validLocale) {
      query.locale = validLocale
    }

    const response = await contentfulClient.getEntries<any>(query)
    return response.items[0] || null
  } catch (error) {
    console.error('Error fetching case study:', error)
    return null
  }
}

// Authors
export async function getAuthors(locale?: string): Promise<AuthorEntry[]> {
  try {
    const query: any = {
      content_type: 'author',
      order: ['fields.name'],
    }

    const validLocale = getValidLocale(locale)
    if (validLocale) {
      query.locale = validLocale
    }

    const response = await contentfulClient.getEntries<any>(query)
    return response.items
  } catch (error) {
    console.error('Error fetching authors:', error)
    return []
  }
}