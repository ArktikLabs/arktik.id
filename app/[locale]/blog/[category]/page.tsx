import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getCategoryBySlug, getBlogPosts, getPillarPages } from '@/lib/services/contentful'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { PillarCard } from '@/components/blog/PillarCard'
import { RichTextRenderer } from '@/components/blog/RichTextRenderer'
import { Header } from '@/components/sections/Header'
import { FooterSection } from '@/components/sections/FooterSection'
import { getPlainTextFromRichText, getAssetUrl } from '@/lib/utils/contentful'
import { FileX, ArrowLeft } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import Link from 'next/link'

interface CategoryPageProps {
  params: {
    locale: string
    category: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, category: categorySlug } = await params
  const category = await getCategoryBySlug(categorySlug, locale)

  if (!category) {
    return {
      title: 'Category Not Found | Arktik',
    }
  }

  return {
    title: `${category.fields.title} | Arktik Blog`,
    description: getPlainTextFromRichText(category.fields.description) || `Explore articles about ${category.fields.title}`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category: categorySlug } = await params

  try {
    const [category, { posts }, pillars, t] = await Promise.all([
      getCategoryBySlug(categorySlug, locale),
      getBlogPosts({ categorySlug, locale }),
      getPillarPages(categorySlug, locale),
      getTranslations('categoryPage'),
    ])

    if (!category) {
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
                <div className="flex items-center mb-6">
                  {category.fields.icon && (
                    <img
                      src={category.fields.icon.fields.file?.url}
                      alt=""
                      className="w-12 h-12 mr-4 rounded-lg"
                    />
                  )}
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-balance font-heading">
                    {category.fields.title}
                  </h1>
                </div>

                {category.fields.description && (
                  <div className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-3xl">
                    {typeof category.fields.description === 'string'
                      ? category.fields.description
                      : <RichTextRenderer content={category.fields.description} />
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <main className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Blog", href: `/${locale}/blog` },
              { label: category.fields.title, isActive: true }
            ]}
            className="mb-8"
          />

          {/* Pillar Pages Section */}
          {pillars.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8">{t('completeGuides')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pillars.map((pillar) => (
                  <PillarCard
                    key={pillar.sys.id}
                    pillar={pillar}
                    categorySlug={categorySlug}
                    locale={locale}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Blog Posts Section */}
          {posts.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8">{t('articles')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogPostCard key={post.sys.id} post={post} locale={locale} />
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {posts.length === 0 && pillars.length === 0 && (
            <section className="text-center py-24">
              <div className="max-w-lg mx-auto">
                {/* Category Icon */}
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                  {getAssetUrl(category.fields.icon) ? (
                    <img
                      src={getAssetUrl(category.fields.icon)}
                      alt={`${category.fields.title} icon`}
                      className="w-12 h-12 rounded object-contain"
                    />
                  ) : (
                    <FileX className="w-12 h-12 text-gray-400" />
                  )}
                </div>

                {/* Empty State Title */}
                <h2 className="text-3xl font-bold mb-4">{t('emptyState.title')}</h2>

                {/* Empty State Message */}
                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                  {t('emptyState.description')}
                </p>

                {/* Back to Blog Button */}
                <Link
                  href={`/${locale}/blog`}
                  className="inline-flex items-center space-x-2 bg-lime-green hover:bg-lime-green/90 text-dark-blue font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('emptyState.backToBlog')}</span>
                </Link>
              </div>
            </section>
          )}
        </main>

        <FooterSection />
      </div>
    )
  } catch (error) {
    console.error('Error loading category page:', error)
    notFound()
  }
}