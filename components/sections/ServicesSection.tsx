import { ServiceCard } from "@/components/cards/ServiceCard"
import { Code, Compass, Sparkles, DraftingCompass } from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      icon: Code,
      title: "Digital Product Development",
      description: "We design and build digital products from websites and mobile apps to custom software crafted to be scalable, user-friendly, and tailored to your business needs.",
      features: ["Website development", "Mobile app development", "Customer software development"]
    },
    {
      icon: Compass,
      title: "Technology Consulting and Development",
      description: "From strategic consulting, development, and support, we help you solve business problems with the right technologies, streamline your operations, and keep your software running smoothly so your business is always ready for what's next."
    },
    {
      icon: Sparkles,
      title: "AI & Automation Solutions",
      description: "From chatbots to predictive analytics, we implement AI-driven solutions that automate tasks, unlock insights, and give your business a competitive edge."
    },
    {
      icon: DraftingCompass,
      title: "Brand Design and UI/UX",
      description: "We craft intuitive interfaces that improve usability, reduce churn, and increase customer satisfaction to drive your business results."
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <section id="services" className="px-6 py-20 lg:px-12">
        <h2 className="text-3xl font-bold mb-12 font-heading">Our service</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
            />
          ))}
        </div>
      </section>
    </div>
  )
}