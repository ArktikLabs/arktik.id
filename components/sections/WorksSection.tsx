import { WorkCard } from "@/components/cards/WorkCard";
import { Underline } from "@/components/ui/underline";
import { useTranslations, useLocale } from "next-intl";
import { getAllShowcases } from "@/lib/data/showcases";

export function WorksSection() {
  const t = useTranslations('works');
  const locale = useLocale();
  const showcases = getAllShowcases();

  const works = [
    ...showcases.map(showcase => ({
      title: showcase.title,
      href: locale === 'id' ? `/showcase/${showcase.slug}` : `/${locale}/showcase/${showcase.slug}`,
      imageSrc: showcase.thumbnail || "/portofolio/default.webp",
      isImageCard: true,
    })),
    {
      title: t('cta.title'),
      href: "#contact",
      description: t('cta.description'),
      buttonText: t('cta.buttonText'),
      isImageCard: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <section id="portfolio" className="px-6 pt-20 pb-0 lg:px-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold font-heading mb-2">{t('title')}</h2>
          <Underline />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {works.map((work, index) => (
            <WorkCard
              key={index}
              title={work.title}
              href={work.href}
              imageSrc={work.imageSrc}
              description={work.description}
              buttonText={work.buttonText}
              isImageCard={work.isImageCard}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
