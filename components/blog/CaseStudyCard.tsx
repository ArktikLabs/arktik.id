import Link from 'next/link'
import { Calendar, Building, CheckCircle, ArrowRight } from 'lucide-react'
import { CaseStudyEntry } from '@/lib/types/contentful'
import { getPlainTextFromRichText } from '@/lib/utils/contentful'

interface CaseStudyCardProps {
  caseStudy: CaseStudyEntry
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <article className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-700/50 rounded-lg overflow-hidden hover:border-green-500/70 transition-all duration-300 group">
      {caseStudy.fields.featuredImage && (
        <div className="relative overflow-hidden">
          <img
            src={caseStudy.fields.featuredImage.fields.file?.url}
            alt={caseStudy.fields.featuredImage.fields.title || caseStudy.fields.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Case Study
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-green-400 transition-colors">
          <Link href={`/blog/case-studies/${caseStudy.fields.slug}`}>
            {caseStudy.fields.title}
          </Link>
        </h3>

        {/* Challenge/Solution Preview */}
        <p className="text-gray-300 mb-4 line-clamp-3">
          {getPlainTextFromRichText(caseStudy.fields.challenge) || 'Case study details coming soon...'}
        </p>

        {/* Project Details */}
        <div className="space-y-2 mb-4">
          {caseStudy.fields.clientName && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Building className="w-4 h-4 text-green-400" />
              <span>{caseStudy.fields.clientName}</span>
            </div>
          )}

          {caseStudy.fields.category && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4 text-green-400" />
              <span>{caseStudy.fields.category.fields?.title}</span>
            </div>
          )}
        </div>

        {/* Results Preview */}
        {caseStudy.fields.results && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 text-sm text-green-400 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span>Results:</span>
            </div>
            <p className="text-sm text-gray-300 line-clamp-2">
              {getPlainTextFromRichText(caseStudy.fields.results) || 'Results available in full case study'}
            </p>
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/blog/case-studies/${caseStudy.fields.slug}`}
          className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 font-medium transition-colors group/link"
        >
          <span>Read Case Study</span>
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  )
}