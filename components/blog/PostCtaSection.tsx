import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostCtaSectionProps {
  locale: string
  className?: string
  badge: string
  title: string
  description: string
  primaryCta: string
  secondaryCta: string
}

export function PostCtaSection({
  locale,
  className,
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
}: PostCtaSectionProps) {
  const contactHref = locale === 'en' ? '/en#contact' : '/id#contact'
  const servicesHref = locale === 'en' ? '/en#services' : '/id#services'

  return (
    <section className={cn('relative overflow-hidden rounded-2xl border border-lime-green/20 bg-gradient-to-br from-lime-green/10 via-lime-green/5 to-transparent p-10 shadow-lg', className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(190,242,100,0.15),_transparent_55%)]" />
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-lime-green/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-lime-green">
            {badge}
          </span>
          <h2 className="mt-4 text-2xl font-bold text-white md:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-base text-gray-300 md:text-lg">
            {description}
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-3 md:flex-row md:items-center">
          <Link
            href={contactHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-green px-6 py-3 text-sm font-semibold text-dark-blue transition-colors hover:bg-lime-green/90"
          >
            {primaryCta}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={servicesHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-lime-green/40 px-6 py-3 text-sm font-semibold text-lime-green transition-colors hover:border-lime-green hover:text-white"
          >
            {secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  )
}
