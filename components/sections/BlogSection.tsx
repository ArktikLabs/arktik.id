import Link from 'next/link'
import { ChevronRight, Calendar, ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getBlogPosts, getPillarPages } from '@/lib/services/contentful'
import { BlogPostEntry, PillarPageEntry } from '@/lib/types/contentful'
import { Underline } from '@/components/ui/underline'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { PillarCard } from '@/components/blog/PillarCard'

interface BlogSectionProps {
  locale?: string
}

export async function BlogSection({ locale }: BlogSectionProps) {
  try {
    const [{ posts }, pillars, t] = await Promise.all([
      getBlogPosts({ limit: 3, locale }),
      getPillarPages(undefined, locale),
      getTranslations('blog')
    ])

    // If no content, don't render the section
    if (posts.length === 0 && pillars.length === 0) {
      return null
    }

    return (
      <div className="max-w-7xl mx-auto">
        <section id="blog" className="px-6 pt-20 pb-0 lg:px-12">
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-3xl font-bold font-heading mb-2">{t('title')}</h2>
              <Underline />
            </div>
            <p className="text-gray-400 text-lg mb-8">
              {t('description')}
            </p>
          </div>

          {/* Featured Guides */}
          {pillars.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">{t('completeGuides')}</h3>
                <Link
                  href={`/${locale}/blog`}
                  className="text-lime-green hover:text-lime-green/80 text-sm font-medium transition-colors"
                >
                  {t('viewAll')}
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pillars.slice(0, 3).map((pillar) => {
                  const categorySlug = pillar.fields.category?.fields?.slug || ''
                  return (
                    <PillarCard key={pillar.sys.id} pillar={pillar} categorySlug={categorySlug} locale={locale} />
                  )
                })}
              </div>
            </div>
          )}

          {/* Latest Posts */}
          {posts.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">{t('latestArticles')}</h3>
                <Link
                  href={`/${locale}/blog`}
                  className="text-lime-green hover:text-lime-green/80 text-sm font-medium transition-colors"
                >
                  {t('viewAll')}
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(0, 3).map((post) => (
                  <BlogPostCard key={post.sys.id} post={post} locale={locale} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error loading blog content for homepage:', error)
    return null
  }
}