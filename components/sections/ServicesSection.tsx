import { ServiceCard } from "@/components/cards/ServiceCard"
import { Code, Compass, Sparkles, DraftingCompass } from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      icon: Code,
      title: "Digital Product Development",
      description: "We design and build digital products from websites and mobile apps to custom software that users love and businesses rely on — scalable, user-friendly, and tailored to your needs.",
      features: ["Websites that convert and grow with your business", "Mobile apps that users love and return to", "Custom software that scales with your success"]
    },
    {
      icon: Compass,
      title: "Technology Consulting and Development",
      description: "From strategic consulting to development and support, we help you solve business problems with the right technologies, ensuring your technology investments deliver real ROI and keep your business ready for what's next."
    },
    {
      icon: Sparkles,
      title: "AI & Automation Solutions",
      description: "From chatbots to predictive analytics, we implement AI-driven solutions that automate tasks, unlock insights, and give your business a competitive edge — freeing your team to focus on what matters most."
    },
    {
      icon: DraftingCompass,
      title: "Brand Design and UI/UX",
      description: "We craft intuitive interfaces that convert visitors into customers — improving usability, reducing churn, and increasing satisfaction to drive your business results."
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <section id="services" className="px-6 pt-20 pb-0 lg:px-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold font-heading mb-2">Services</h2>
          <div className="w-3/4 h-[2px] bg-lime-green"></div>
        </div>
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
  );
}