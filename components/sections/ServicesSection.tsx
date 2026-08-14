import { ServiceCard } from "@/components/cards/ServiceCard"
import { Code, Compass, Sparkles, DraftingCompass, LifeBuoy } from "lucide-react"
import { useTranslations } from "next-intl";

/* Hallmark · F3 tabular spec sheet · macrostructure: Split Studio
 * design-system: design.md
 * Was a 4-up equal card grid — one of four consecutive equal grids on this page.
 * Now a spec sheet: rows, hairline-separated, no boxes. Technical tone. */

export function ServicesSection() {
  const t = useTranslations('services')

  const features = Object.values(
    t.raw('customDevelopment.features') as Record<string, string>
  );

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
    {
      icon: LifeBuoy,
      title: t('operations.title'),
      description: t('operations.description'),
    },
  ];

  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-24">
      <div className="section-head mb-10">
        <h2 className="font-heading text-3xl font-bold lg:text-4xl">{t('title')}</h2>
        <span className="section-head__rule" aria-hidden="true" />
      </div>

      <div className="border-b border-rule">
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            icon={service.icon}
            title={service.title}
            description={service.description}
            features={service.features}
          />
        ))}
      </div>
    </section>
  );
}
