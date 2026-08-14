import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex min-w-0 items-center space-x-2 text-sm", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2 min-w-0">
          {index > 0 && <ChevronRight className="w-4 h-4 text-ink-3" />}

          {item.href && !item.isActive ? (
            <Link
              href={item.href}
              className="block min-w-0 truncate text-ink-3 transition-colors hover:text-lime-green"
              title={item.label}
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              "block min-w-0 truncate",
              item.isActive
                ? "text-lime-green"
                : "text-ink-3"
            )}
              title={item.label}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
