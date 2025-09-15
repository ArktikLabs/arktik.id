import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  features?: string[]
}

export function ServiceCard({ icon: Icon, title, description, features }: ServiceCardProps) {
  return (
    <Card className="bg-gradient-to-br from-service-blue via-service-blue/95 to-slate-800/50 border-slate-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-lime-400/20 group cursor-pointer hover:border-lime-400/30 hover:scale-[1.02] transform-gpu relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-lime-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardContent className="p-6 relative z-10">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
          <Icon className="w-5 h-5 text-lime-green" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-white font-heading group-hover:text-lime-green/90 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
        {features && (
          <ul className="text-gray-400 text-sm space-y-2 group-hover:text-gray-300 transition-colors duration-300">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-lime-green mr-2 font-bold">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}