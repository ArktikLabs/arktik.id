import Link from 'next/link'
import { Folder } from 'lucide-react'
import { CategoryEntry } from '@/lib/types/contentful'
import { getPlainTextFromRichText, getAssetUrl } from '@/lib/utils/contentful'

/* Hallmark · design-system: design.md
 * Was bg-gray-900 / border-gray-700 — an off-palette neutral that belongs to no
 * theme. Now paper-2 on a hairline, with a single hover signal. */

interface CategoryCardProps {
  category: CategoryEntry
  locale?: string
}

export function CategoryCard({ category, locale }: CategoryCardProps) {
  const { title, slug, icon, description } = category?.fields || {}
  const iconUrl = getAssetUrl(icon)

  if (!title || !slug) {
    return null
  }

  return (
    <Link
      href={`/${locale}/blog/${slug}`}
      className="group flex items-start gap-4 border-t border-rule py-6 transition-colors duration-200 hover:border-rule-strong"
    >
      {iconUrl ? (
        <img
          src={iconUrl}
          alt=""
          aria-hidden="true"
          className="mt-1 h-5 w-5 shrink-0 rounded object-contain"
        />
      ) : (
        <Folder className="mt-1 h-4 w-4 shrink-0 text-lime-green" aria-hidden="true" />
      )}

      <div className="min-w-0">
        <h3 className="font-heading text-lg font-semibold text-ink transition-colors duration-200 group-hover:text-lime-green">
          {title}
        </h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-2">
            {getPlainTextFromRichText(description)}
          </p>
        )}
      </div>
    </Link>
  )
}
