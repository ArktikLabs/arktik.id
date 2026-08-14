import Link from 'next/link'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { PillarPageEntry } from '@/lib/types/contentful'
import { getImageUrl } from '@/lib/utils/contentful'
import { useTranslations } from "next-intl"

/* Hallmark · design-system: design.md
 * Was an inline background-image div with an Unsplash URL as the no-image
 * fallback — shipping someone else's stock photo as the final design.
 * Now: real next/image when Contentful has one, a token-built surface when it
 * doesn't. Same card voice as WorkCard. */

interface PillarCardProps {
  pillar: PillarPageEntry
  categorySlug: string
  locale?: string
}

export function PillarCard({ pillar, categorySlug, locale }: PillarCardProps) {
  const t = useTranslations('cards')
  const imageUrl = getImageUrl(pillar.fields.featuredImage)

  return (
    <Link
      href={`/${locale}/blog/${categorySlug}/guides/${pillar.fields.slug}`}
      className="group relative isolate flex h-80 flex-col justify-between overflow-hidden rounded-card border border-rule bg-paper-2 p-5"
    >
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="-z-10 object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="img-scrim absolute inset-0 -z-10"
          />
        </>
      )}

      <span className="label-mono flex items-center gap-2 text-ink-2">
        <BookOpen className="h-3.5 w-3.5 text-lime-green" aria-hidden="true" />
        {t('completeGuide')}
      </span>

      <div>
        <h3 className="line-clamp-3 font-heading text-xl font-bold text-ink transition-colors duration-200 group-hover:text-lime-green md:text-2xl">
          {pillar.fields.title}
        </h3>
        <time
          dateTime={pillar.sys.createdAt}
          className="label-mono mt-3 block"
        >
          {new Date(pillar.sys.createdAt).toLocaleDateString(
            locale === 'id' ? 'id-ID' : 'en-US',
            { year: 'numeric', month: 'short' }
          )}
        </time>
      </div>
    </Link>
  )
}
