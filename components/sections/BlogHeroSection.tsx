import { ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { toAbsoluteUrl } from '@/lib/utils/contentful'

/* Hallmark · design-system: design.md
 * Shared masthead for every content route. The image is now OPTIONAL and has no
 * default: the aurora photograph is retired everywhere, not just the homepage
 * hero. It composited through four veils (opacity-80, a carbon/30 tint, a 160px
 * bottom fade, and the text scrim) down to a near-black band, while costing
 * 186KB on the LCP path — and design.md's own reason for retiring it (generic,
 * pulls the palette back toward the blue carbon exists to replace) never stopped
 * applying one route over.
 *
 * A masthead now renders only when the content supplies a real featuredImage.
 * With no image the section collapses to type on carbon, which is what
 * "content pages: typography only" asked for in the first place. */

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
  imageUrl,
  imageClassName,
  priority = true,
}: BlogHeroSectionProps) {
  return (
    <section className={cn("relative isolate overflow-hidden", className)}>
      {imageUrl && (
        <>
          <Image
            /* Normalised here, not at the call site: this component is the one
             * that requires an absolute URL (next/image rejects Contentful's
             * `//…`), so it owns the constraint rather than trusting callers. */
            src={toAbsoluteUrl(imageUrl)}
            alt=""
            aria-hidden="true"
            fill
            priority={priority}
            sizes="100vw"
            className={cn("-z-10 object-cover object-center", imageClassName)}
          />
          {/* Fixed-height bottom blend, not a percentage ramp — a percentage is
            * height-dependent and turns the 320px masthead solid black. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-carbon"
          />
          {/* Text scrim only when this masthead actually carries copy. */}
          {children && (
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-r from-carbon/85 via-carbon/30 via-50% to-transparent"
            />
          )}
        </>
      )}

      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            "px-6 lg:px-12",
            /* Without a photograph there is nothing to give room to, so the
             * band tightens instead of leaving a tall empty carbon slab. */
            imageUrl
              ? "pb-44 pt-32 lg:pb-48 lg:pt-36"
              : "pb-16 pt-32 lg:pb-20 lg:pt-36",
            containerClassName
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
