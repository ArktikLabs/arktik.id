import { ServiceCard } from "@/components/cards/ServiceCard"
import { Code, Compass, Sparkles, DraftingCompass } from "lucide-react"
import { Underline } from "@/components/ui/underline";
import { useTranslations } from "next-intl";

export function ServicesSection() {
  const t = useTranslations('services')

  // Convert object to array for features
  const featuresObj = t.raw('customDevelopment.features') as Record<string, string>;
  const features = Object.values(featuresObj);

  const services = [
    {
      icon: Code,
      title: t('customDevelopment.title'),
      description: t('customDevelopment.description'),
      features: features,
    },
    {
      icon: Compass,
      title: t('consulting.title'),
      description: t('consulting.description'),
    },
    {
      icon: Sparkles,
      title: t('aiAutomation.title'),
      description: t('aiAutomation.description'),
    },
    {
      icon: DraftingCompass,
      title: t('design.title'),
      description: t('design.description'),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <section id="services" className="px-6 pt-20 pb-0 lg:px-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold font-heading mb-2">{t('title')}</h2>
          <Underline />
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