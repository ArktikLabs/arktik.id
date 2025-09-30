"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/routing"
import { Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const switchLanguage = (newLocale: string) => {
    router.push(pathname, { locale: newLocale })
    setIsOpen(false)
  }

  const currentLanguage = locale === 'id' ? 'ID' : 'EN'
  const otherLanguage = locale === 'id' ? 'EN' : 'ID'
  const otherLanguageFull = locale === 'id' ? 'English' : 'Bahasa Indonesia'

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="flex items-center gap-2 text-white hover:text-lime-green hover:bg-black/30 transition-colors duration-200"
        aria-label="Language selector"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage}</span>
        <ChevronDown className="w-3 h-3 transition-transform duration-200 hidden sm:inline" style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }} />
      </Button>

      {/* Dropdown */}
      <div
        className={`absolute top-full right-0 mt-1 bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-lg shadow-xl transition-all duration-200 z-50 ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        style={{
          minWidth: '120px'
        }}
      >
        <button
          onClick={() => switchLanguage(locale === 'id' ? 'en' : 'id')}
          className="w-full px-4 py-2 text-left text-sm text-white hover:text-lime-green hover:bg-black/30 transition-colors duration-200 rounded-lg flex items-center gap-2 whitespace-nowrap"
        >
          <Globe className="w-3 h-3" />
          <span>{otherLanguage}</span>
          <span className="text-xs text-gray-400 hidden sm:inline">({otherLanguageFull})</span>
        </button>
      </div>
    </div>
  )
}