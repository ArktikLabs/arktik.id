import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "small"
}

export function CTAButton({ children, className, variant = "default", ...props }: CTAButtonProps) {
  const baseClasses = "bg-lime-green text-slate-900 hover:bg-lime-green/90 font-medium rounded-full"
  const sizeClasses = variant === "small" ? "px-6 py-2 text-base" : "px-8 py-3 text-lg"
  
  return (
    <Button 
      className={cn(baseClasses, sizeClasses, className)}
      {...props}
    >
      {children}
    </Button>
  )
}