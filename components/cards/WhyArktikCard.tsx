import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface WhyArktikCardProps {
  icon: LucideIcon
  title: string
  description: string
  isLarge?: boolean
}

export function WhyArktikCard({ icon: Icon, title, description, isLarge = false }: WhyArktikCardProps) {
  if (isLarge) {
    return (
      <Card className="bg-why-blue border-slate-200 mb-6 md:mb-8 transition-all duration-300 hover:shadow-xl hover:shadow-slate-400/20 group cursor-pointer hover:bg-opacity-80">
        <CardContent className="p-6 md:p-8 text-left md:text-center">
          <Icon className="w-8 h-8 md:w-12 md:h-12 text-slate-900 mb-4 md:mb-6 md:mx-auto group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xl md:text-2xl font-semibold md:font-bold mb-3 md:mb-4 text-slate-900 font-heading">
            {title}
          </h3>
          <p className="text-slate-700 text-sm md:text-base leading-relaxed md:max-w-3xl md:mx-auto">
            {description}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-why-blue border-slate-200 transition-all duration-300 hover:shadow-xl hover:shadow-slate-400/20 group cursor-pointer hover:bg-opacity-80">
      <CardContent className="p-6">
        <Icon className="w-8 h-8 text-slate-900 mb-4 group-hover:scale-110 transition-transform duration-300" />
        <h3 className="text-xl font-semibold mb-3 text-slate-900 font-heading">
          {title}
        </h3>
        <p className="text-slate-700 text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}