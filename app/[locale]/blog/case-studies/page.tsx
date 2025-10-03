import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCaseStudies } from '@/lib/services/contentful'
import { CaseStudyCard } from '@/components/blog/CaseStudyCard'
import { Header } from '@/components/sections/Header'
import { FooterSection } from '@/components/sections/FooterSection'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface CaseStudiesPageProps {
  params: { locale: string }
}

export const metadata: Metadata = {
  title: 'Case Studies | Arktik',
  description: 'Real-world success stories and client projects showcasing our expertise.',
}

export default async function CaseStudiesPage({ params }: CaseStudiesPageProps) {
  const { locale } = await params

  try {
    const { caseStudies } = await getCaseStudies({ locale })

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
            <span className="text-white">Case Studies</span>
          </nav>

          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Case Studies
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real-world success stories showcasing how we've helped businesses transform
              through technology and strategic digital solutions.
            </p>
          </section>

          {/* Case Studies Grid */}
          {caseStudies.length > 0 ? (
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {caseStudies.map((caseStudy) => (
                  <CaseStudyCard key={caseStudy.sys.id} caseStudy={caseStudy} />
                ))}
              </div>
            </section>
          ) : (
            <section className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
              <p className="text-gray-400">
                We're preparing detailed case studies to share with you. Check back soon!
              </p>
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