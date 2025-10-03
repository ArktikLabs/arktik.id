import Link from 'next/link'
import { Calendar, BookOpen } from 'lucide-react'
import { PillarPageEntry } from '@/lib/types/contentful'
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface PillarCardProps {
  pillar: PillarPageEntry
  categorySlug: string
  locale?: string
}

export function PillarCard({ pillar, categorySlug, locale }: PillarCardProps) {
  const t = useTranslations('cards')

  return (
    <Link href={`/${locale}/blog/${categorySlug}/guides/${pillar.fields.slug}`} className="w-full group/card">
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl w-full flex flex-col justify-between p-4",
          "bg-cover bg-center"
        )}
        style={{
          backgroundImage: pillar.fields.featuredImage
            ? `url(${pillar.fields.featuredImage.fields.file?.url})`
            : 'url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80)'
        }}
      >
        <div className="absolute w-full h-full top-0 left-0 bg-black/70 transition duration-300 group-hover/card:bg-black/85"></div>

        {/* Guide Type and Meta Info */}
        <div className="flex flex-row items-center justify-between w-full z-10">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-lime-green" />
            <span className="font-normal text-base text-gray-50 relative z-10">
              {t('completeGuide')}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(pillar.sys.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="text content">
          <h3 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10 line-clamp-2">
            {pillar.fields.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}