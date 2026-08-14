"use client";
import { Globe, Users, Heart, Scale } from "lucide-react";
import { LinkPreview } from "@/components/ui/link-preview";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

/* Hallmark · T3 single huge quote → three-column story · design-system: design.md
 * The MIT pull-quote is the strongest borrowed credibility on the page, so it
 * keeps the centred treatment. Everything below it is left-aligned — the old
 * `text-center lg:text-left` flip-flop made the column heads jump on resize.
 * Straight quotes replaced with typographic ones. */

const MIT_URL =
  "https://professionalprograms.mit.edu/blog/design/why-95-of-new-products-miss-the-mark-and-how-yours-can-avoid-the-same-fate/";

export function AboutUsSection() {
  const t = useTranslations('aboutUs')

  // Warm the microlink screenshot so the hover preview isn't a blank card.
  useEffect(() => {
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(MIT_URL)}&screenshot=true&meta=false&embed=screenshot.url&colorScheme=dark&viewport.isMobile=true&viewport.deviceScaleFactor=1&viewport.width=900&viewport.height=540`;
    const img = new Image();
    img.src = screenshotUrl;
  }, []);

  const values = [
    {
      icon: Users,
      title: t('whatWeBelieve.values.collaboration.title'),
      description: t('whatWeBelieve.values.collaboration.description'),
    },
    {
      icon: Heart,
      title: t('whatWeBelieve.values.expertise.title'),
      description: t('whatWeBelieve.values.expertise.description'),
    },
    {
      icon: Scale,
      title: t('whatWeBelieve.values.impact.title'),
      description: t('whatWeBelieve.values.impact.description'),
    },
    {
      icon: Globe,
      title: t('whatWeBelieve.values.innovation.title'),
      description: t('whatWeBelieve.values.innovation.description'),
    },
  ];

  const columns = [
    {
      title: t('whoWeAre.title'),
      paragraphs: [t('whoWeAre.description1'), t('whoWeAre.description2')],
    },
    {
      title: t('howWeWork.title'),
      paragraphs: [
        t('howWeWork.description1'),
        t('howWeWork.description2'),
        t('howWeWork.description3'),
      ],
    },
  ];

  return (
    <section
      id="about-us"
      className="mx-auto max-w-7xl px-6 pb-20 pt-28 lg:px-12 lg:pb-24 lg:pt-32"
    >
      {/* Borrowed credibility, front and centre. */}
      <figure className="mx-auto mb-20 max-w-4xl text-center">
        <blockquote className="font-heading text-3xl font-bold leading-tight lg:text-5xl">
          <span className="text-lime-green">&ldquo;</span>
          <LinkPreview
            url={MIT_URL}
            className="text-ink transition-colors duration-200 hover:text-lime-green"
            width={300}
            height={180}
          >
            {t('quoteText')}
          </LinkPreview>
          <span className="text-lime-green">&rdquo;</span>
        </blockquote>
        <figcaption className="mt-5">
          <LinkPreview
            url={MIT_URL}
            className="label-mono transition-colors duration-200 hover:text-lime-green"
            width={300}
            height={180}
          >
            {t('quoteSource')}
          </LinkPreview>
        </figcaption>
      </figure>

      <p className="mx-auto mb-20 max-w-3xl text-center text-lg leading-relaxed text-ink-2 lg:text-xl">
        {t('mainDescription')}
      </p>

      <div className="grid gap-12 lg:grid-cols-3 lg:gap-14">
        {columns.map((column) => (
          <div key={column.title} className="border-t border-rule pt-6">
            <h3 className="font-heading text-2xl font-bold text-ink lg:text-3xl">
              {column.title}
            </h3>
            <div className="mt-5 space-y-4">
              {column.paragraphs.map((paragraph, index) => (
                <p key={index} className="leading-relaxed text-ink-2">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}

        <div className="border-t border-rule pt-6">
          <h3 className="font-heading text-2xl font-bold text-ink lg:text-3xl">
            {t('whatWeBelieve.title')}
          </h3>
          <dl className="mt-5 space-y-5">
            {values.map((value) => (
              <div key={value.title} className="flex items-start gap-3">
                <value.icon
                  className="mt-1 h-4 w-4 shrink-0 text-lime-green"
                  aria-hidden="true"
                />
                <div>
                  <dt className="font-semibold text-ink">{value.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-3">
                    {value.description}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
