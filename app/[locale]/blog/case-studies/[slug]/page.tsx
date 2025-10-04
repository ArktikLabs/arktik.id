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
    const [caseStudy, related, postCtaT] = await Promise.all([
      getCaseStudyBySlug(slug, locale),
      getCaseStudies({ locale, limit: 3 }),
      getTranslations('postCta'),
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
      <div className="min-h-screen text-white bg-dark-blue">
        <Header />

        <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/blog/case-studies"
              className="hover:text-white transition-colors"
            >
              Case Studies
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{caseStudy.fields.title}</span>
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
                <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Case Study
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {caseStudy.fields.title}
                </h1>
                {caseStudy.fields.challenge && (
                  <div className="text-xl text-gray-300 mb-6">
                    <RichTextRenderer content={caseStudy.fields.challenge} />
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {caseStudy.fields.clientName && (
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Building className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-400">Client</span>
                    </div>
                    <p className="font-medium">{caseStudy.fields.clientName}</p>
                  </div>
                )}

                {caseStudy.fields.category && (
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-400">Category</span>
                    </div>
                    <p className="font-medium">{caseStudy.fields.category.fields?.title}</p>
                  </div>
                )}
              </div>
            </header>

            {/* Solution */}
            {caseStudy.fields.solution && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Solution</h2>
                <div className="prose prose-lg prose-invert max-w-none">
                  <RichTextRenderer content={caseStudy.fields.solution} />
                </div>
              </section>
            )}

            {/* Results */}
            {caseStudy.fields.results && (
              <section className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Results</h2>
                <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-700/50 rounded-lg p-6">
                  <div className="prose prose-lg prose-invert max-w-none">
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
                    className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors"
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
                      <p className="text-gray-300 mb-4">{cs.fields.excerpt}</p>
                      <Link
                        href={`/blog/case-studies/${cs.fields.slug}`}
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
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
