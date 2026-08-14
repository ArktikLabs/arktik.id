import { LucideIcon } from "lucide-react"

/* Hallmark · design-system: design.md
 * The `isLarge` variant is the page's one light surface — bone
 * (--color-paper-invert), never #fff. The compact variant is a hairline row,
 * not a card.
 * Removed from both: the gradient fill, the rounded icon tile, hover:scale,
 * the slate glow shadow, and the three simultaneous text-colour transitions. */

interface WhyArktikCardProps {
  icon: LucideIcon
  title: string
  description: string
  isLarge?: boolean
}

export function WhyArktikCard({
  icon: Icon,
  title,
  description,
  isLarge = false,
}: WhyArktikCardProps) {
  if (isLarge) {
    return (
      <div className="rounded-card bg-bone p-8 lg:p-10">
        <Icon
          className="h-7 w-7 text-ink-invert"
          aria-hidden="true"
          strokeWidth={1.5}
        />
        <h3 className="mt-6 font-heading text-2xl font-bold text-ink-invert lg:text-3xl">
          {title}
        </h3>
        <p className="mt-4 leading-relaxed text-ink-invert-2">{description}</p>
      </div>
    )
  }

  return (
    <div className="group border-t border-rule py-6 transition-colors duration-200 hover:border-rule-strong">
      <h3 className="flex items-center gap-3 font-heading text-lg font-semibold text-ink">
        <Icon className="h-4 w-4 shrink-0 text-lime-green" aria-hidden="true" />
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">{description}</p>
    </div>
  )
}
