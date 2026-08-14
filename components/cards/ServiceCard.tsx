import { LucideIcon } from "lucide-react"

/* Hallmark · F3 tabular spec sheet · design-system: design.md
 * Was: gradient card + rounded icon tile + hover scale + lime glow shadow +
 * three simultaneous text-colour shifts. That is the universal AI feature card.
 * Now: a spec row. Icon sits inline with the heading, the row is separated by a
 * hairline rather than boxed, and hover moves ONE thing — the rule to accent. */

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  features?: string[]
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  features,
}: ServiceCardProps) {
  return (
    <div className="group grid gap-4 border-t border-rule py-8 transition-colors duration-200 hover:border-rule-strong md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
      <h3 className="flex items-center gap-3 font-heading text-xl font-semibold text-ink md:text-2xl">
        <Icon className="h-5 w-5 shrink-0 text-lime-green" aria-hidden="true" />
        {title}
      </h3>

      <div>
        <p className="text-ink-2 leading-relaxed">{description}</p>

        {features && features.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {features.map((feature) => (
              <li key={feature} className="label-mono text-ink-3">
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
