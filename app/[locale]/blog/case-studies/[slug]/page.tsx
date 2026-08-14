import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCaseStudyBySlug, getCaseStudies } from '@/lib/services/contentful'
import { RichTextRenderer } from '@/components/blog/RichTextRenderer'
import { Header } from '@/components/sections/Header'
import { FooterSection } from '@/components/sections/FooterSection'
import { ChevronRight, Calendar, Building } from 'lucide-react'
import Link from 'next/link'
import { PostCtaSection } from '@/components/blog/PostCtaSection'
import { getTranslations } from 'next-intl/server'

interface CaseStudyPageProps {
  params: {
    locale: string
    slug: string
  }
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const caseStudy = await getCaseStudyBySlug(slug, locale)

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found | Arktik',
    }
  }

  return {
    title: caseStudy.fields.seoTitle || `${caseStudy.fields.title} | Arktik Case Studies`,
    description: caseStudy.fields.seoDescription || caseStudy.fields.excerpt,
  }
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { locale, slug } = await params

  try {
    const [caseStudy, related, postCtaT, csT] = await Promise.all([
      getCaseStudyBySlug(slug, locale),
      getCaseStudies({ locale, limit: 3 }),
      getTranslations("postCta"),
      getTranslations("caseStudyPage"),
    ])

    if (!caseStudy) {
      notFound()
    }

    const { caseStudies: relatedCaseStudies } = related

    // Filter out current case study
    const filteredRelated = relatedCaseStudies.filter(
      (cs) => cs.sys.id !== caseStudy.sys.id
    )

    const postCtaContent = {
      badge: postCtaT('badge'),
      title: caseStudy.fields.ctaTitle ?? postCtaT('title'),
      description: caseStudy.fields.ctaDescription ?? postCtaT('description'),
      primaryCta: postCtaT('primaryCta'),
      secondaryCta: postCtaT('secondaryCta'),
    }

    return (
      <div className="min-h-screen bg-paper text-ink">
        <Header />

        <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-ink-3 mb-8">
            <Link href="/blog" className="hover:text-ink transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/blog/case-studies"
              className="hover:text-ink transition-colors"
            >
              Case Studies
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-ink">{caseStudy.fields.title}</span>
          </nav>

          {/* Case Study */}
          <article className="max-w-4xl mx-auto">
            <header className="mb-12">
              {caseStudy.fields.featuredImage && (
                <img
                  src={caseStudy.fields.featuredImage.fields.file?.url}
                  alt={caseStudy.fields.featuredImage.fields.title || caseStudy.fields.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
                />
              )}

              <div className="mb-6">
                <span className="label-mono mb-4 inline-block rounded-full bg-lime-green px-3 py-1 text-ink-invert">
                  Case Study
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {caseStudy.fields.title}
                </h1>
                {caseStudy.fields.challenge && (
                  <div className="text-xl text-ink-2 mb-6">
                    <RichTextRenderer content={caseStudy.fields.challenge} />
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {caseStudy.fields.clientName && (
                  <div className="bg-paper rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Building className="w-4 h-4 text-lime-green" />
                      <span className="label-mono">{csT("client")}</span>
                    </div>
                    <p className="font-medium">{caseStudy.fields.clientName}</p>
                  </div>
                )}

                {caseStudy.fields.category && (
                  <div className="bg-paper rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-lime-green" />
                      <span className="label-mono">{csT("category")}</span>
                    </div>
                    <p className="font-medium">{caseStudy.fields.category.fields?.title}</p>
                  </div>
                )}
              </div>
            </header>

            {/* Solution */}
            {caseStudy.fields.solution && (
              <section className="mb-12">
                <h2 className="mb-6 font-heading text-3xl font-bold">{csT("solution")}</h2>
                <div className="prose prose-lg prose-invert max-w-[68ch]">
                  <RichTextRenderer content={caseStudy.fields.solution} />
                </div>
              </section>
            )}

            {/* Results */}
            {caseStudy.fields.results && (
              <section className="mb-16">
                <h2 className="mb-6 font-heading text-3xl font-bold">{csT("results")}</h2>
                <div className="rounded-xl border border-rule bg-paper-2 p-6">
                  <div className="prose prose-lg prose-invert max-w-[68ch]">
                    <RichTextRenderer content={caseStudy.fields.results} />
                  </div>
                </div>
              </section>
            )}
          </article>

          <div className="max-w-4xl mx-auto mt-16">
            <PostCtaSection
              locale={locale}
              badge={postCtaContent.badge}
              title={postCtaContent.title}
              description={postCtaContent.description}
              primaryCta={postCtaContent.primaryCta}
              secondaryCta={postCtaContent.secondaryCta}
            />
          </div>

          {/* Related Case Studies */}
          {filteredRelated.length > 0 && (
            <section className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">More Case Studies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRelated.map((cs) => (
                  <div
                    key={cs.sys.id}
                    className="bg-paper rounded-lg overflow-hidden hover:bg-paper-2 transition-colors"
                  >
                    {cs.fields.featuredImage && (
                      <img
                        src={cs.fields.featuredImage.fields.file?.url}
                        alt={cs.fields.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{cs.fields.title}</h3>
                      <p className="text-ink-2 mb-4">{cs.fields.excerpt}</p>
                      <Link
                        href={`/blog/case-studies/${cs.fields.slug}`}
                        className="text-lime-green hover:text-lime-green/80 font-medium transition-colors"
                      >
                        Read Case Study →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <FooterSection />
      </div>
    )
  } catch (error) {
    console.error('Error loading case study:', error)
    notFound()
  }
}
