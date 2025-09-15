import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface WhyArktikCardProps {
  icon: LucideIcon
  title: string
  description: string
  isLarge?: boolean
}

export function WhyArktikCard({ icon: Icon, title, description, isLarge = false }: WhyArktikCardProps) {
  if (isLarge) {
    return (
      <Card className="bg-gradient-to-br from-why-blue via-why-blue/95 to-slate-100/50 border-slate-300/50 mb-6 md:mb-8 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-400/30 group cursor-pointer hover:border-slate-400/50 hover:scale-[1.02] transform-gpu relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="p-6 md:p-8 text-left md:text-center relative z-10">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-slate-800 to-slate-600 rounded-xl mb-4 md:mb-6 md:mx-auto flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
            <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="text-xl md:text-2xl font-semibold md:font-bold mb-3 md:mb-4 text-slate-900 font-heading group-hover:text-slate-800 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-slate-700 text-sm md:text-base leading-relaxed md:max-w-3xl md:mx-auto group-hover:text-slate-600 transition-colors duration-300">
            {description}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-why-blue via-why-blue/95 to-slate-100/50 border-slate-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-400/30 group cursor-pointer hover:border-slate-400/50 hover:scale-[1.02] transform-gpu relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardContent className="p-6 relative z-10">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-600 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-slate-900 font-heading group-hover:text-slate-800 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-700 text-sm leading-relaxed group-hover:text-slate-600 transition-colors duration-300">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}