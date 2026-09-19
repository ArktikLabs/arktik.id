/* Hallmark · macrostructure: 02 Long Document · design-system: design.md */
import Image from "next/image";
import { Metadata } from "next";
import { alternatesFor } from "@/lib/seo/schema";
import { notFound } from "next/navigation";
import { getCaseStudyBySlug, getCaseStudies } from "@/lib/content";
import { RichTextRenderer } from "@/components/blog/RichTextRenderer";
import { Header } from "@/components/sections/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PostCtaSection } from "@/components/blog/PostCtaSection";
import { CaseStudyCard } from "@/components/blog/CaseStudyCard";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, article, breadcrumbs } from "@/lib/seo/schema";
import { markdownToText } from "@/lib/utils/reading-time";

interface CaseStudyPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug, locale);

  if (!caseStudy) {
    return {
      title: "Case Study Not Found | Arktik",
    };
  }

  return {
    alternates: alternatesFor(locale, `blog/case-studies/${slug}`),
    title:
      caseStudy.seoTitle ||
      `${caseStudy.title} | Arktik Case Studies`,
    description:
      caseStudy.seoDescription ||
      markdownToText(caseStudy.challenge).slice(0, 160) ||
      undefined,
  };
}

export function generateStaticParams() {
  return getCaseStudies({ limit: 1000 }).caseStudies.map((c) => ({ slug: c.slug }));
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { locale, slug } = await params;

  try {
    const [caseStudy, related, postCtaT, csT, csPageT, blogT] =
      await Promise.all([
        getCaseStudyBySlug(slug, locale),
        getCaseStudies({ locale, limit: 3 }),
        getTranslations("postCta"),
        getTranslations("caseStudyPage"),
        getTranslations("caseStudiesPage"),
        getTranslations("blog"),
      ]);

    if (!caseStudy) {
      notFound();
    }

    const { caseStudies: relatedCaseStudies } = related;

    // Filter out current case study
    const filteredRelated = relatedCaseStudies.filter(
      (cs) => cs.slug !== caseStudy.slug,
    );

    const postCtaContent = {
      title: caseStudy.ctaTitle ?? postCtaT("title"),
      description: caseStudy.ctaDescription ?? postCtaT("description"),
      primaryCta: postCtaT("primaryCta"),
      secondaryCta: postCtaT("secondaryCta"),
    };

    return (
      <div className="min-h-screen bg-paper text-ink">
        <JsonLd
          data={graph(
            article({
              locale,
              path: `blog/case-studies/${slug}`,
              headline: caseStudy.title,
              description: markdownToText(caseStudy.challenge).slice(0, 160),
              image: caseStudy.image,
              datePublished: caseStudy.date,
              dateModified: caseStudy.updated,
            }),
            breadcrumbs(locale, [
              { name: blogT("title"), path: "blog" },
              { name: csPageT("hero.title"), path: "blog/case-studies" },
              { name: caseStudy.title },
            ]),
          )}
        />
        <Header />

        <main id="main" className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          {/* Breadcrumb — was a hand-rolled nav with unprefixed hrefs while the
           * two sibling article routes used <Breadcrumb>. Container width, so
           * its labels don't truncate inside the document column. */}
          <Breadcrumb
            items={[
              { label: blogT("title"), href: `/${locale}/blog` },
              {
                label: csPageT("hero.title"),
                href: `/${locale}/blog/case-studies`,
              },
              { label: caseStudy.title, isActive: true },
            ]}
            className="mb-12"
          />

          <div className="mx-auto max-w-measure">
            {/* Case Study */}
            <article className="mb-16">
              <header className="mb-12">
                {/* The accent pill said "Case Study" directly under a breadcrumb
                 * ending in Case Studies. Not ordinal content, so no section tag. */}
                <h1 className="mb-6 text-balance font-heading text-4xl font-bold leading-display md:text-5xl md:leading-display lg:text-6xl lg:leading-display">
                  {caseStudy.title}
                </h1>
                {caseStudy.challenge && (
                  <div className="mb-10 text-lg leading-prose text-ink-2 md:text-xl">
                    <RichTextRenderer content={caseStudy.challenge} />
                  </div>
                )}

                {caseStudy.image && (
                  <Image
                    src={caseStudy.image}
                    alt={caseStudy.imageAlt || caseStudy.title}
                    width={1200}
                    height={640}
                    sizes="(max-width: 768px) 100vw, 64ch"
                    className="mb-8 h-64 w-full rounded-card object-cover md:h-80"
                  />
                )}

                {/* Spec row, not tiles. Two boxed cards here plus the boxed
                 * results block plus the related grid gave one Long Document
                 * three competing card registers — the hairline row is the
                 * pattern the marketing spec sheet already uses. */}
                <dl className="mb-8 border-t border-rule">
                  {caseStudy.clientName && (
                    <div className="flex items-baseline gap-4 border-b border-rule py-3">
                      <dt className="label-mono w-32 shrink-0 text-ink-3">
                        {csT("client")}
                      </dt>
                      <dd className="font-medium">
                        {caseStudy.clientName}
                      </dd>
                    </div>
                  )}

                  {caseStudy.category && (
                    <div className="flex items-baseline gap-4 border-b border-rule py-3">
                      <dt className="label-mono w-32 shrink-0 text-ink-3">
                        {csT("category")}
                      </dt>
                      <dd className="font-medium">
                        {caseStudy.category.title}
                      </dd>
                    </div>
                  )}
                </dl>
              </header>

              {/* Solution */}
              {caseStudy.solution && (
                <section className="mb-12">
                  <h2 className="mb-6 font-heading text-3xl font-bold leading-display">
                    {csT("solution")}
                  </h2>
                  <div className="leading-prose">
                    <RichTextRenderer content={caseStudy.solution} />
                  </div>
                </section>
              )}

              {/* Results — was the last boxed block on the page. Long Document's
               * divider is negative space and a rule, so the payoff section is
               * marked by the rule above it, not by a filled card. */}
              {caseStudy.results && (
                <section className="border-t border-rule pt-10">
                  <h2 className="mb-6 font-heading text-3xl font-bold leading-display">
                    {csT("results")}
                  </h2>
                  <div className="leading-prose">
                    <RichTextRenderer content={caseStudy.results} />
                  </div>
                </section>
              )}
            </article>
          </div>

          <div className="mt-16">
            <PostCtaSection
              locale={locale}
              title={postCtaContent.title}
              description={postCtaContent.description}
              primaryCta={postCtaContent.primaryCta}
              secondaryCta={postCtaContent.secondaryCta}
            />
          </div>

          {/* Related Case Studies */}
          {filteredRelated.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-8 font-heading text-3xl font-bold leading-display">
                {csT("moreCaseStudies")}
              </h2>
              {/* Was hand-rolled card markup duplicating CaseStudyCard, with
               * three hardcoded English strings inside a bilingual route. */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredRelated.map((cs) => (
                  <CaseStudyCard key={cs.slug} caseStudy={cs} />
                ))}
              </div>
            </section>
          )}
        </main>

        <FooterSection />
      </div>
    );
  } catch (error) {
    console.error("Error loading case study:", error);
    notFound();
  }
}
