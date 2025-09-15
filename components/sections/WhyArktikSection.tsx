import { WhyArktikCard } from "@/components/cards/WhyArktikCard"
import { Globe, Infinity, Puzzle, TrendingUp, Rocket } from "lucide-react"

export function WhyArktikSection() {
  const features = [
    {
      icon: Globe,
      title: "Global Experience",
      description: "With over 7 years leading product, engineering, and design in world-class tech companies, we partner with you to bring this expertise to your business and elevate it to the next level."
    },
    {
      icon: Infinity,
      title: "End-to-End Expertise",
      description: "We manage the full product lifecycle from launch to optimization and scaling because your growth doesn't stop at release."
    },
    {
      icon: Puzzle,
      title: "Tailored Solutions",
      description: "Every business is unique. We build custom solutions that fit your goals, whether you're a fast-moving startup or a large enterprise."
    },
    {
      icon: TrendingUp,
      title: "Proven Impact",
      description: "From empowering small businesses to scaling platforms across countries, we deliver results with the same customer-first focus every time."
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <section id="why-arktik" className="px-6 pt-20 pb-0 lg:px-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold font-heading mb-2">Why Arktik</h2>
          <div className="w-4/5 h-[2px] bg-lime-green"></div>
        </div>

        <WhyArktikCard
          icon={Rocket}
          title="We Turn Technology Into Business Growth"
          description="While others build features, we build success aligning every solution with your goals to deliver measurable results that matter."
          isLarge={true}
        />

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <WhyArktikCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}