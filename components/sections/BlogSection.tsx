import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getBlogPosts, getPillarPages } from '@/lib/services/contentful'
import { PillarCard } from '@/components/blog/PillarCard'

/* Hallmark · 20 Ecosystem Index (homepage slice) · design-system: design.md
 * Was two identical 3-up card grids stacked — the third and fourth equal grids
 * on this page. Now the two surfaces read differently: guides stay as cards
 * (they are destinations), latest posts become an index list (they are a feed). */

interface BlogSectionProps {
  locale?: string
}

export async function BlogSection({ locale }: BlogSectionProps) {
  try {
    const [{ posts }, pillars, t] = await Promise.all([
      getBlogPosts({ limit: 4, locale }),
      getPillarPages(undefined, locale),
      getTranslations('blog')
    ])

    if (posts.length === 0 && pillars.length === 0) {
      return null
    }

    return (
      <section id="blog" className="mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-12 lg:pt-28">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="section-head">
            <h2 className="font-heading text-3xl font-bold lg:text-4xl">{t('title')}</h2>
            <span className="section-head__rule" aria-hidden="true" />
          </div>
          <Link
            href={`/${locale}/blog`}
            className="label-mono whitespace-nowrap transition-colors duration-200 hover:text-lime-green"
          >
            {t('viewAll')}
          </Link>
        </div>

        <p className="mb-12 max-w-2xl text-lg text-ink-2">{t('description')}</p>

        {pillars.length > 0 && (
          <div className="mb-16">
            <h3 className="label-mono mb-5">{t('completeGuides')}</h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {pillars.slice(0, 3).map((pillar) => (
                <PillarCard
                  key={pillar.sys.id}
                  pillar={pillar}
                  categorySlug={pillar.fields.category?.fields?.slug || ''}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}

        {posts.length > 0 && (
          <div>
            <h3 className="label-mono mb-2">{t('latestArticles')}</h3>
            <ul className="border-b border-rule">
              {posts.slice(0, 4).map((post) => {
                const categorySlug = post.fields?.category?.fields?.slug
                const postSlug = post.fields?.slug
                if (!categorySlug || !postSlug || !post.fields?.title) return null

                return (
                  <li key={post.sys.id}>
                    <Link
                      href={`/${locale}/blog/${categorySlug}/${postSlug}`}
                      className="group flex items-baseline justify-between gap-6 border-t border-rule py-5 transition-colors duration-200 hover:border-rule-strong"
                    >
                      <span className="font-heading text-lg font-semibold text-ink transition-colors duration-200 group-hover:text-lime-green md:text-xl">
                        {post.fields.title}
                      </span>
                      <span className="label-mono flex shrink-0 items-center gap-2">
                        {new Date(post.sys.createdAt).toLocaleDateString(
                          locale === 'id' ? 'id-ID' : 'en-US',
                          { year: 'numeric', month: 'short' }
                        )}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </section>
    )
  } catch (error) {
    console.error('Error loading blog content for homepage:', error)
    return null
  }
}
