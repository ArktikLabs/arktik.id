import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getCategories, getBlogPosts, getPillarPages } from '@/lib/services/contentful'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { CategoryCard } from '@/components/blog/CategoryCard'
import { PillarCard } from '@/components/blog/PillarCard'
import { Header } from '@/components/sections/Header'
import { FooterSection } from '@/components/sections/FooterSection'
import { ArrowRight, BookOpen, Users, Calendar } from 'lucide-react'

interface BlogPageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('blogPage')

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params

  try {
    const [categories, { posts: recentPosts }, pillars, t] = await Promise.all([
      getCategories(locale),
      getBlogPosts({ limit: 8, locale }),
      getPillarPages(undefined, locale),
      getTranslations('blogPage'),
    ])

    if (!categories.length && !recentPosts.length && !pillars.length) {
      notFound()
    }

    return (
      <div className="min-h-screen text-white bg-dark-blue">
        <Header />

        {/* Hero Section */}
        <section className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{ backgroundImage: "url('/aurora-bg.webp')" }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-dark-blue z-[1]" />

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="px-6 lg:px-12 pt-32 pb-24 relative">
              <div className="max-w-4xl">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-balance font-heading">
                  {t('hero.title')}
                </h1>
                <p className="text-lg lg:text-xl text-gray-300 mt-6 leading-relaxed">
                  {t('hero.description')}
                </p>
                <div className="flex items-center space-x-8 mt-8 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{recentPosts.length} {t('stats.articles')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{pillars.length} {t('stats.guides')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{categories.length} {t('stats.categories')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16">

            {/* Complete Guides Section - Featured First */}
            {pillars.length > 0 && (
              <section className="mb-20">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">{t('guides.title')}</h2>
                    <p className="text-gray-400">{t('guides.subtitle')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pillars.slice(0, 6).map((pillar) => (
                    <PillarCard key={pillar.sys.id} pillar={pillar} categorySlug={pillar.fields.category?.fields?.slug || ''} locale={locale} />
                  ))}
                </div>
              </section>
            )}

            {/* Recent Posts Section */}
            {recentPosts.length > 0 && (
              <section className="mb-20">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">{t('articles.title')}</h2>
                    <p className="text-gray-400">{t('articles.subtitle')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentPosts.map((post) => (
                    <BlogPostCard key={post.sys.id} post={post} locale={locale} />
                  ))}
                </div>
              </section>
            )}

            {/* Categories Section - Browse & Discovery */}
            {categories.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">{t('categories.title')}</h2>
                    <p className="text-gray-400">{t('categories.subtitle')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <CategoryCard key={category.sys.id} category={category} locale={locale} />
                  ))}
                </div>
              </section>
            )}
          </main>

        <FooterSection />
      </div>
    )
  } catch (error) {
    console.error('Error loading blog page:', error)
    notFound()
  }
}