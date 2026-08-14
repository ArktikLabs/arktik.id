import Link from 'next/link'
import Image from 'next/image'
import { Building, ArrowUpRight } from 'lucide-react'
import { CaseStudyEntry } from '@/lib/types/contentful'
import { getPlainTextFromRichText, getImageUrl } from '@/lib/utils/contentful'
import { useTranslations, useLocale } from 'next-intl'

/* Hallmark · design-system: design.md
 * Two fixes beyond the visual layer:
 *   1. It shipped a SECOND accent hue (green-400/600/900) alongside the brand
 *      chartreuse. One accent per system — repointed to the token.
 *   2. Every label was hardcoded English inside an id/en app. Now translated.
 * Also: the whole card is one link target instead of three competing ones. */

interface CaseStudyCardProps {
  caseStudy: CaseStudyEntry
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const t = useTranslations('cards')
  const locale = useLocale()

  const { slug, title, featuredImage, clientName, challenge, results } =
    caseStudy.fields
  const imageUrl = getImageUrl(featuredImage)
  const summary = getPlainTextFromRichText(challenge)
  const outcome = getPlainTextFromRichText(results)

  return (
    <article className="group overflow-hidden rounded-xl border border-rule bg-paper-2 transition-colors duration-200 hover:border-rule-strong">
      <Link href={`/${locale}/blog/case-studies/${slug}`} className="block">
        {imageUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={imageUrl}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-paper-2 to-transparent"
            />
            <span className="label-mono absolute left-4 top-4 rounded-full bg-lime-green px-2.5 py-1 text-ink-invert">
              {t('caseStudy')}
            </span>
          </div>
        )}

        <div className="p-6">
          <h3 className="line-clamp-2 font-heading text-xl font-bold text-ink transition-colors duration-200 group-hover:text-lime-green">
            {title}
          </h3>

          {summary && (
            <p className="mt-3 line-clamp-3 leading-relaxed text-ink-2">
              {summary}
            </p>
          )}

          <dl className="mt-5 space-y-2">
            {clientName && (
              <div className="flex items-center gap-2">
                <dt className="sr-only">{t('client')}</dt>
                <Building className="h-4 w-4 shrink-0 text-lime-green" aria-hidden="true" />
                <dd className="label-mono">{clientName}</dd>
              </div>
            )}

            {outcome && (
              <div>
                <dt className="label-mono text-lime-green">{t('results')}</dt>
                <dd className="mt-1 line-clamp-2 text-sm text-ink-2">{outcome}</dd>
              </div>
            )}
          </dl>

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-lime-green">
            {t('readCaseStudy')}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  )
}
