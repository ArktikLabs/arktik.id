import { WhyArktikCard } from "@/components/cards/WhyArktikCard"
import { Globe, Infinity, Puzzle, TrendingUp, Rocket } from "lucide-react"
import { Underline } from "@/components/ui/underline";
import { useTranslations } from "next-intl";

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
    <div className="max-w-7xl mx-auto">
      <section id="why-arktik" className="px-6 pt-20 pb-0 lg:px-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold font-heading mb-2">{t('title')}</h2>
          <Underline />
        </div>

        <WhyArktikCard
          icon={Rocket}
          title={t('mainCard.title')}
          description={t('mainCard.description')}
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