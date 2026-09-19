import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/lib/types/content'

/* Hallmark · design-system: design.md
 * Was an inline background-image div falling back to an Unsplash stock photo.
 * Now: real next/image when the post has a featured image, a token-built
 * surface when it doesn't. No borrowed photography ships as final design. */

interface BlogPostCardProps {
  post: Post
  locale?: string
}

export function BlogPostCard({ post, locale }: BlogPostCardProps) {
  const categorySlug = post.category.slug
  const postSlug = post.slug
  const imageUrl = post.image

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
        {post.category.title}
      </span>

      <div>
        <h3 className="line-clamp-3 font-heading text-xl font-bold text-ink transition-colors duration-200 group-hover:text-lime-green md:text-2xl">
          {post.title}
        </h3>
        <time dateTime={post.date} className="label-mono mt-3 block">
          {new Date(post.date).toLocaleDateString(
            locale === 'id' ? 'id-ID' : 'en-US',
            { year: 'numeric', month: 'short', day: 'numeric' }
          )}
        </time>
      </div>
    </Link>
  );
}
