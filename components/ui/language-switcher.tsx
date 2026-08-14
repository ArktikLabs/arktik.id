"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/routing"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

/* Was a hover-opened dropdown. With two locales the menu only ever held one
 * option, and the 4px `mt-1` gap between trigger and panel closed it before
 * the pointer could arrive — the trigger's onMouseLeave hid the panel, and a
 * hidden panel cannot receive the onMouseEnter that would reopen it. A toggle
 * has no gap and no hover state, so it also works on touch and keyboard,
 * which the dropdown never did (design.md: hover-only affordances are banned). */
export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const target = locale === "id" ? "en" : "id"
  const targetLabel = target === "en" ? "English" : "Bahasa Indonesia"

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.push(pathname, { locale: target })}
      className="flex items-center gap-2 text-ink hover:text-lime-green hover:bg-paper-3 transition-colors duration-200"
      aria-label={`Switch language to ${targetLabel}`}
      lang={target}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">{target.toUpperCase()}</span>
    </Button>
  )
}
