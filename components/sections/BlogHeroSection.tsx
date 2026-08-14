import { ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { toAbsoluteUrl } from '@/lib/utils/contentful'

/* Hallmark · design-system: design.md
 * Shared masthead for every content route. The aurora was an inline
 * background-image (undiscoverable by the preloader); it is now a real
 * next/image so the content family gets the same LCP treatment as the homepage.
 * Top padding clears the floating nav pill. */

interface BlogHeroSectionProps {
  children?: ReactNode
  className?: string
  containerClassName?: string
  imageUrl?: string
  imageClassName?: string
  priority?: boolean
}

export function BlogHeroSection({
  children,
  className,
  containerClassName,
  imageUrl = "/assets/aurora-bg.webp",
  imageClassName,
  priority = true,
}: BlogHeroSectionProps) {
  return (
    <section className={cn("relative isolate overflow-hidden", className)}>
      <Image
        /* Normalised here, not at the call site: this component is the one that
         * requires an absolute URL (next/image rejects Contentful's `//…`), so
         * it owns the constraint rather than trusting every caller to know. */
        src={toAbsoluteUrl(imageUrl)}
        alt=""
        aria-hidden="true"
        fill
        priority={priority}
        sizes="100vw"
        className={cn("-z-10 object-cover object-center opacity-80", imageClassName)}
      />
      {/* Flat tint + a FIXED-HEIGHT bottom blend, not a full-height gradient.
        * A percentage ramp is height-dependent: tuned for the 800px homepage
        * hero it turns the 320px post masthead solid black. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-carbon/30" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-carbon"
      />
      {/* Text scrim gives copy a dark ground. Stacked with the tint it would
        * erase the photograph, so it renders only when this masthead actually
        * carries text — the post and pillar routes pass none. */}
      {children && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-carbon/85 via-carbon/30 via-50% to-transparent"
        />
      )}

      <div className="mx-auto max-w-7xl">
        <div className={cn("px-6 pb-44 pt-32 lg:px-12 lg:pb-48 lg:pt-36", containerClassName)}>
          {children}
        </div>
      </div>
    </section>
  );
}
