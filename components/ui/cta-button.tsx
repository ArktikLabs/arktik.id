import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* Hallmark · CTA voice · design-system: design.md
 * Primary = accent fill, pill radius, verb-first label, never wraps to two lines
 * (a two-line clickable label reads as a styling error at narrow widths). */

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "small" | "outline"
}

export function CTAButton({
  children,
  className,
  variant = "default",
  ...props
}: CTAButtonProps) {
  const base =
    "whitespace-nowrap rounded-full font-medium transition-colors duration-200"

  const voice =
    variant === "outline"
      ? "border border-rule-strong bg-transparent text-ink hover:border-lime-green hover:text-lime-green"
      : "bg-lime-green text-ink-invert hover:bg-lime-green/90"

  const size =
    variant === "default" ? "px-8 py-3 text-lg" : "px-5 py-2 text-sm sm:text-base"

  return (
    <Button className={cn(base, voice, size, className)} {...props}>
      {children}
    </Button>
  )
}
