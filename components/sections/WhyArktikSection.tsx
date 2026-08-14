import { WhyArktikCard } from "@/components/cards/WhyArktikCard"
import { Globe, Infinity, Puzzle, TrendingUp, Rocket } from "lucide-react"
import { useTranslations } from "next-intl";

/* Hallmark · Split Studio diptych · design-system: design.md
 * Was a full-width card above a 2-up grid of four identical cards.
 * Now one diptych: the claim (light surface, left) against its four supports
 * (hairline rows, right). Flipped direction versus the row above it. */

export function WhyArktikSection() {
  const t = useTranslations('whyArktik')

  const features = [
    {
      icon: Globe,
      title: t('features.globalExperience.title'),
      description: t('features.globalExperience.description'),
    },
    {
      icon: Infinity,
      title: t('features.endToEnd.title'),
      description: t('features.endToEnd.description'),
    },
    {
      icon: Puzzle,
      title: t('features.tailored.title'),
      description: t('features.tailored.description'),
    },
    {
      icon: TrendingUp,
      title: t('features.proven.title'),
      description: t('features.proven.description'),
    },
  ];

  return (
    <section
      id="why-arktik"
      className="mx-auto max-w-7xl px-6 pb-24 pt-8 lg:px-12 lg:pb-28"
    >
      <div className="section-head mb-10">
        <h2 className="font-heading text-3xl font-bold lg:text-4xl">{t('title')}</h2>
        <span className="section-head__rule" aria-hidden="true" />
      </div>

      <div className="diptych is-flipped items-start">
        <div className="border-b border-rule">
          {features.map((feature) => (
            <WhyArktikCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <WhyArktikCard
          icon={Rocket}
          title={t('mainCard.title')}
          description={t('mainCard.description')}
          isLarge
        />
      </div>
    </section>
  );
}
