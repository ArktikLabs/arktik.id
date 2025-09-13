import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  features?: string[]
}

export function ServiceCard({ icon: Icon, title, description, features }: ServiceCardProps) {
  return (
    <Card className="bg-service-blue border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-lime-400/10 group cursor-pointer hover:bg-opacity-80">
      <CardContent className="p-6">
        <Icon className="w-8 h-8 text-lime-green mb-4 group-hover:scale-110 transition-transform duration-300" />
        <h3 className="text-xl font-semibold mb-3 text-white font-heading">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          {description}
        </p>
        {features && (
          <ul className="text-gray-400 text-sm space-y-1">
            {features.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}