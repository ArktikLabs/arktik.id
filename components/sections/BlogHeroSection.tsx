import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BlogHeroSectionProps {
  children?: ReactNode
  className?: string
  containerClassName?: string
  imageUrl?: string
  imageClassName?: string
}

export function BlogHeroSection({
  children,
  className,
  containerClassName,
  imageUrl = '/aurora-bg.webp',
  imageClassName,
}: BlogHeroSectionProps) {
  return (
    <section className={cn('relative min-h-[420px] md:min-h-[520px]', className)}>
      <div
        className={cn('absolute inset-0 bg-cover bg-center opacity-80', imageClassName)}
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent from-70% to-dark-blue" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className={cn('relative px-6 pt-32 pb-24 lg:px-12', containerClassName)}>
          {children}
        </div>
      </div>
    </section>
  )
}
