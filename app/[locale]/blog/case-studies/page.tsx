import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { FileX, ArrowLeft } from 'lucide-react'
import { getCaseStudies } from '@/lib/services/contentful'
import { CaseStudyCard } from '@/components/blog/CaseStudyCard'
import { Header } from '@/components/sections/Header'
import { FooterSection } from '@/components/sections/FooterSection'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { BlogHeroSection } from '@/components/sections/BlogHeroSection'

interface CaseStudiesPageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: CaseStudiesPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'caseStudiesPage' })

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  }
}

export default async function CaseStudiesPage({ params }: CaseStudiesPageProps) {
  const { locale } = await params

  try {
    const t = await getTranslations({ locale, namespace: 'caseStudiesPage' })
    const { caseStudies } = await getCaseStudies({ locale })

    return (
      <div className="min-h-screen bg-dark-blue text-white">
        <Header />

        <BlogHeroSection>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold leading-tight text-balance font-heading lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-300 lg:text-xl">
              {t('hero.description')}
            </p>
          </div>
        </BlogHeroSection>

        <main className="relative mx-auto max-w-7xl px-6 py-16 lg:px-12">
          <Breadcrumb
            items={[
              { label: 'Blog', href: `/${locale}/blog` },
              { label: t('hero.title'), isActive: true },
            ]}
            className="mb-8"
          />

          {/* Case Studies Grid */}
          {caseStudies.length > 0 ? (
            <section>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {caseStudies.map((caseStudy) => (
                  <CaseStudyCard key={caseStudy.sys.id} caseStudy={caseStudy} />
                ))}
              </div>
            </section>
          ) : (
            <section className="py-24 text-center">
              <div className="mx-auto max-w-lg">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-800">
                  <FileX className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="mb-4 text-3xl font-bold">{t('emptyState.title')}</h2>
                <p className="mb-8 text-lg leading-relaxed text-gray-400">
                  {t('emptyState.description')}
                </p>
                <Link
                  href={`/${locale}/blog`}
                  className="inline-flex items-center space-x-2 rounded-lg bg-lime-green px-6 py-3 font-medium text-dark-blue transition-colors hover:bg-lime-green/90"
                >
                  <ArrowLeft className="h-4 w-4" />
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
    console.error('Error loading case studies:', error)
    notFound()
  }
}
