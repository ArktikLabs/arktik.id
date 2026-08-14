import Link from 'next/link'
import Image from 'next/image'
import { BlogPostEntry } from '@/lib/types/contentful'
import { getImageUrl } from '@/lib/utils/contentful'

/* Hallmark · design-system: design.md
 * Was an inline background-image div falling back to an Unsplash stock photo.
 * Now: real next/image when Contentful has one, a token-built surface when it
 * doesn't. No borrowed photography ships as final design. */

interface BlogPostCardProps {
  post: BlogPostEntry
  locale?: string
}

export function BlogPostCard({ post, locale }: BlogPostCardProps) {
  const category = post?.fields?.category?.fields
  const categorySlug = category?.slug
  const postSlug = post?.fields?.slug

  if (!category?.title || !categorySlug || !postSlug || !post?.fields?.title) {
    return null
  }

  const imageUrl = getImageUrl(post.fields.featuredImage)

  return (
    <Link
      href={`/${locale}/blog/${categorySlug}/${postSlug}`}
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

      <span className="label-mono self-start rounded-full border border-rule-strong px-2.5 py-1 text-ink-2">
        {category.title}
      </span>

      <div>
        <h3 className="line-clamp-3 font-heading text-xl font-bold text-ink transition-colors duration-200 group-hover:text-lime-green md:text-2xl">
          {post.fields.title}
        </h3>
        <time dateTime={post.sys.createdAt} className="label-mono mt-3 block">
          {new Date(post.sys.createdAt).toLocaleDateString(
            locale === 'id' ? 'id-ID' : 'en-US',
            { year: 'numeric', month: 'short', day: 'numeric' }
          )}
        </time>
      </div>
    </Link>
  );
}
