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

export interface ImageCredit {
  name: string
  profileUrl: string
  photoUrl: string
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
  imageCredit?: ImageCredit
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
  imageCredit?: ImageCredit
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
