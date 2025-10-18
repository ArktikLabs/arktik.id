import Link from 'next/link'
import { Calendar, User } from 'lucide-react'
import { BlogPostEntry } from '@/lib/types/contentful'
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface BlogPostCardProps {
  post: BlogPostEntry
  locale?: string
}

export function BlogPostCard({ post, locale }: BlogPostCardProps) {
  const t = useTranslations('cards')

  // Safely extract fields with fallbacks
  const category = post?.fields?.category?.fields
  const author = post?.fields?.author?.fields
  const categorySlug = category?.slug
  const postSlug = post?.fields?.slug

  // Don't render if essential fields are missing
  if (!category?.title || !categorySlug || !postSlug || !post?.fields?.title) {
    return null
  }

  return (
    <Link
      href={`/${locale}/blog/${categorySlug}/${postSlug}`}
      className="w-full group/card"
    >
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl w-full flex flex-col justify-between p-4",
          "bg-cover bg-center"
        )}
        style={{
          backgroundImage: post.fields.featuredImage
            ? `url(${post.fields.featuredImage.fields.file?.url})`
            : "url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80)",
        }}
      >
        <div className="absolute w-full h-full top-0 left-0 bg-black/70 transition duration-300 group-hover/card:bg-black/85"></div>

        {/* Category and Meta Info */}
        <div className="flex flex-row items-center justify-between w-full z-10">
          <div className="inline-block bg-lime-green/20 border border-lime-green/30 text-lime-green px-2 py-1 rounded text-xs font-medium relative z-10">
            {category.title}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(post.sys.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="text content">
          <h3 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10 line-clamp-2">
            {post.fields.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}