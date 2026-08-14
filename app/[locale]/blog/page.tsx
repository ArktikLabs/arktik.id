import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getCategories, getBlogPosts, getPillarPages } from '@/lib/services/contentful'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { CategoryCard } from '@/components/blog/CategoryCard'
import { PillarCard } from '@/components/blog/PillarCard'
import { Header } from '@/components/sections/Header'
import { FooterSection } from '@/components/sections/FooterSection'
import { BlogHeroSection } from '@/components/sections/BlogHeroSection'

/* Hallmark · macrostructure: 20 Ecosystem Index · design-system: design.md
 * designed-as-app
 * Was three identical lg:grid-cols-3 card grids stacked, which made the three
 * surfaces (guides / articles / categories) read as one undifferentiated wall.
 * Ecosystem Index needs the surfaces to LOOK like different surfaces:
 *   guides     → cards, they are destinations
 *   articles   → cards, but a denser 2-up feed
 *   categories → an index list, it is navigation
 * The stat row uses real counts derived from the fetched data — no invented
 * metrics anywhere on this page. */

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

    const stats = [
      { count: recentPosts.length, label: t('stats.articles') },
      { count: pillars.length, label: t('stats.guides') },
      { count: categories.length, label: t('stats.categories') },
    ].filter((stat) => stat.count > 0)

    return (
      <div className="min-h-screen bg-paper text-ink">
        <Header />

        <BlogHeroSection>
          <div className="max-w-4xl">
            <h1 className="text-balance font-heading text-4xl font-bold leading-display lg:text-6xl lg:leading-display">
              {t('hero.title')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2 lg:text-xl">
              {t('hero.description')}
            </p>

            {stats.length > 0 && (
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
                {stats.map(({ count, label }) => (
                  <div key={label}>
                    <dt className="label-mono">{label}</dt>
                    <dd className="mt-1 font-heading text-2xl font-bold tabular-nums text-ink">
                      {count}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </BlogHeroSection>

        <main className="mx-auto max-w-7xl px-6 lg:px-12">
          {pillars.length > 0 && (
            <section className="pb-20 pt-4">
              <div className="section-head mb-2">
                <h2 className="font-heading text-3xl font-bold md:text-4xl">
                  {t('guides.title')}
                </h2>
                <span className="section-head__rule" aria-hidden="true" />
              </div>
              <p className="mb-10 max-w-2xl text-ink-2">{t('guides.subtitle')}</p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {pillars.slice(0, 6).map((pillar) => (
                  <PillarCard
                    key={pillar.sys.id}
                    pillar={pillar}
                    categorySlug={pillar.fields.category?.fields?.slug || ''}
                    locale={locale}
                  />
                ))}
              </div>
            </section>
          )}

          {recentPosts.length > 0 && (
            <section className="border-t border-rule pb-20 pt-16">
              <div className="section-head mb-2">
                <h2 className="font-heading text-3xl font-bold md:text-4xl">
                  {t('articles.title')}
                </h2>
                <span className="section-head__rule" aria-hidden="true" />
              </div>
              <p className="mb-10 max-w-2xl text-ink-2">{t('articles.subtitle')}</p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {recentPosts.map((post) => (
                  <BlogPostCard key={post.sys.id} post={post} locale={locale} />
                ))}
              </div>
            </section>
          )}

          {categories.length > 0 && (
            <section className="border-t border-rule pb-24 pt-16">
              <div className="section-head mb-2">
                <h2 className="font-heading text-3xl font-bold md:text-4xl">
                  {t('categories.title')}
                </h2>
                <span className="section-head__rule" aria-hidden="true" />
              </div>
              <p className="mb-6 max-w-2xl text-ink-2">{t('categories.subtitle')}</p>

              <div className="grid grid-cols-1 gap-x-12 border-b border-rule md:grid-cols-2">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.sys.id}
                    category={category}
                    locale={locale}
                  />
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
