import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getPillarPageBySlug, getBlogPosts } from '@/lib/services/contentful'
import { RichTextRenderer } from '@/components/blog/RichTextRenderer'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { Header } from '@/components/sections/Header'
import { FooterSection } from '@/components/sections/FooterSection'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Calendar, Clock, BookOpen } from 'lucide-react'
import { calculateCombinedReadingTime } from '@/lib/utils/reading-time'
import Link from 'next/link'

interface PillarPageProps {
  params: {
    locale: string
    category: string
    pillar: string
  }
}

export async function generateMetadata({ params }: PillarPageProps): Promise<Metadata> {
  const { locale, category: categorySlug, pillar: pillarSlug } = await params
  const pillar = await getPillarPageBySlug(categorySlug, pillarSlug, locale)

  if (!pillar) {
    return {
      title: 'Guide Not Found | Arktik',
    }
  }

  return {
    title: pillar.fields.seoTitle || `${pillar.fields.title} | Arktik`,
    description: pillar.fields.seoDescription || `Complete guide: ${pillar.fields.title}`,
  }
}

export default async function PillarPage({ params }: PillarPageProps) {
  const { locale, category: categorySlug, pillar: pillarSlug } = await params

  try {
    const [pillar, t] = await Promise.all([
      getPillarPageBySlug(categorySlug, pillarSlug, locale),
      getTranslations('pillarPage'),
    ])

    if (!pillar) {
      notFound()
    }

    const { posts: relatedPosts } = await getBlogPosts({
      pillarId: pillar.sys.id,
      locale,
      limit: 6,
    })

    const category = pillar.fields.category.fields
    const heroImage = pillar.fields.featuredImage?.fields.file?.url

    // Calculate reading time
    const readingTime = calculateCombinedReadingTime([
      pillar.fields.introduction,
      pillar.fields.body
    ])

    return (
      <div className="min-h-screen text-white bg-dark-blue">
        <Header />

        {/* Hero Background */}
        <section className="relative h-64 md:h-80">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{
              backgroundImage: heroImage
                ? `url(${heroImage})`
                : "url('/aurora-bg.webp')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-dark-blue z-[1]" />
        </section>

        <main className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Blog", href: `/${locale}/blog` },
              { label: category.title, href: `/${locale}/blog/${categorySlug}` },
              { label: t('guides'), href: `/${locale}/blog/${categorySlug}` },
              { label: pillar.fields.title, isActive: true }
            ]}
            className="mb-12"
          />

          {/* Article */}
          <article className="mb-16">
            {/* Article Header */}
            <header className="mb-12">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-5 h-5 text-lime-green" />
                <span className="text-lime-green font-medium">{t('completeGuide')}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance font-heading mb-6">
                {pillar.fields.title}
              </h1>

              <div className="flex items-center space-x-6 text-gray-400 text-sm mb-8">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(pillar.sys.createdAt).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{t('readingTime', { minutes: readingTime })}</span>
                </div>
                {pillar.fields.author?.fields?.name && (
                  <div className="flex items-center space-x-2">
                    <span>by</span>
                    <span className="text-lime-green">{pillar.fields.author.fields.name}</span>
                  </div>
                )}
              </div>

              {/* Introduction */}
              {pillar.fields.introduction && (
                <div className="prose prose-xl prose-invert mb-12 border-b border-gray-700 pb-8">
                  <RichTextRenderer content={pillar.fields.introduction} />
                </div>
              )}
            </header>

            {/* Main Content */}
            <div className="prose prose-lg prose-invert max-w-none">
              <RichTextRenderer content={pillar.fields.body} />
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8">{t('relatedArticles')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <BlogPostCard key={post.sys.id} post={post} locale={locale} />
                ))}
              </div>
            </section>
          )}
        </main>

        <FooterSection />
      </div>
    )
  } catch (error) {
    console.error('Error loading pillar page:', error)
    notFound()
  }
}