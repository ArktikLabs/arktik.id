import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/* Hallmark · design-system: design.md
 * Was a glowing accent tile: shadow-lg + a lime gradient wash + a radial bloom
 * whose colour was a raw rgba(190,242,100) — Tailwind lime-300, not the locked
 * #DDFE55. design.md retires coloured glow on dark surfaces, so this is now a
 * flat paper-2 tile with a hairline rule, and every colour comes from a token.
 * The uppercase eyebrow chip is gone; the heading leads. The secondary CTA is
 * repointed to the C1 voice (rule border, ink label) — it was wearing accent
 * border + accent label, which competed with the primary. */

interface PostCtaSectionProps {
  locale: string
  className?: string
  title: string
  description: string
  primaryCta: string
  secondaryCta: string
}

export function PostCtaSection({
  locale,
  className,
  title,
  description,
  primaryCta,
  secondaryCta,
}: PostCtaSectionProps) {
  const contactHref = locale === 'en' ? '/en#contact' : '/id#contact'
  const servicesHref = locale === 'en' ? '/en#services' : '/id#services'

  return (
    <section
      className={cn(
        'rounded-card border border-rule bg-paper-2 p-10',
        className
      )}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-bold text-ink md:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-base text-ink-2 md:text-lg">{description}</p>
        </div>
        <div className="flex flex-shrink-0 gap-3 md:flex-row md:items-center">
          <Link
            href={contactHref}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-lime-green px-6 py-3 text-sm font-semibold text-carbon transition-colors duration-200 hover:bg-lime-green/90"
          >
            {primaryCta}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={servicesHref}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill border border-rule px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:border-rule-strong"
          >
            {secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  )
}
