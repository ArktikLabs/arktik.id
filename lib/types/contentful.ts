import { Asset, Entry } from 'contentful'
import { Document } from '@contentful/rich-text-types'

// Base content type
export interface ContentfulBase {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
}

// Author content type
export interface Author extends ContentfulBase {
  name: string
  bio?: Document
  photo?: Asset
  role?: string
  socialLinks?: string[]
}

// Category content type
export interface Category extends ContentfulBase {
  title: string
  slug: string
  icon?: Asset
  description?: Document
}

// Blog Post content type
export interface BlogPost extends ContentfulBase {
  title: string
  slug: string
  excerpt: string
  body: Document
  category: Entry<Category>
  pillar?: Entry<PillarPage>
  author?: Entry<Author>
  featuredImage?: Asset
  tags?: string[]
  seoTitle?: string
  seoDescription?: string
  ctaTitle?: string
  ctaDescription?: string
}

// Pillar Page content type
export interface PillarPage extends ContentfulBase {
  title: string
  slug: string
  introduction: Document
  body: Document
  category: Entry<Category>
  relatedPosts?: Entry<BlogPost>[]
  featuredImage?: Asset
  seoTitle?: string
  seoDescription?: string
  ctaTitle?: string
  ctaDescription?: string
}

// Case Study content type
export interface CaseStudy extends ContentfulBase {
  title: string
  slug: string
  clientName?: string
  challenge?: Document
  solution?: Document
  results?: Document
  category?: Entry<Category>
  relatedPosts?: Entry<BlogPost>[]
  featuredImage?: Asset
  seoTitle?: string
  seoDescription?: string
  ctaTitle?: string
  ctaDescription?: string
}

// Contentful API response types
export type CategoryEntry = Entry<Category>
export type BlogPostEntry = Entry<BlogPost>
export type PillarPageEntry = Entry<PillarPage>
export type CaseStudyEntry = Entry<CaseStudy>
export type AuthorEntry = Entry<Author>
