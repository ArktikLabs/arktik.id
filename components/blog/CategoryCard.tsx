import Link from 'next/link'
import { Folder } from 'lucide-react'
import { CategoryEntry } from '@/lib/types/contentful'
import { getPlainTextFromRichText, getAssetUrl } from '@/lib/utils/contentful'

interface CategoryCardProps {
  category: CategoryEntry
  locale?: string
}

export function CategoryCard({ category, locale }: CategoryCardProps) {
  // Safely extract fields with fallbacks
  const { title, slug, icon, description } = category?.fields || {}
  const iconUrl = getAssetUrl(icon)

  if (!title || !slug) {
    return null // Don't render if essential fields are missing
  }

  return (
    <Link
      href={`/${locale}/blog/${slug}`}
      className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-all duration-300 group border border-gray-700 hover:border-lime-green/50"
    >
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition-colors mr-3">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={`${title} icon`}
              className="w-6 h-6 rounded object-contain"
            />
          ) : (
            <Folder className="w-4 h-4 text-lime-green" />
          )}
        </div>
        <h3 className="text-xl font-bold group-hover:text-lime-green transition-colors">
          {title}
        </h3>
      </div>

      {description && (
        <p className="text-gray-400 line-clamp-3 group-hover:text-gray-300 transition-colors">
          {getPlainTextFromRichText(description)}
        </p>
      )}
    </Link>
  )
}