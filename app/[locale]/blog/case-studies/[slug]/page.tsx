/* Hallmark · macrostructure: 02 Long Document · design-system: design.md */
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudyBySlug, getCaseStudies } from "@/lib/services/contentful";
import { RichTextRenderer } from "@/components/blog/RichTextRenderer";
import { Header } from "@/components/sections/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PostCtaSection } from "@/components/blog/PostCtaSection";
import { CaseStudyCard } from "@/components/blog/CaseStudyCard";
import { getTranslations } from "next-intl/server";

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
    title:
      caseStudy.fields.seoTitle ||
      `${caseStudy.fields.title} | Arktik Case Studies`,
    description: caseStudy.fields.seoDescription || caseStudy.fields.excerpt,
  };
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
      (cs) => cs.sys.id !== caseStudy.sys.id,
    );

    const postCtaContent = {
      title: caseStudy.fields.ctaTitle ?? postCtaT("title"),
      description: caseStudy.fields.ctaDescription ?? postCtaT("description"),
      primaryCta: postCtaT("primaryCta"),
      secondaryCta: postCtaT("secondaryCta"),
    };

    return (
      <div className="min-h-screen bg-paper text-ink">
        <Header />

        <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
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
              { label: caseStudy.fields.title, isActive: true },
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
                  {caseStudy.fields.title}
                </h1>
                {caseStudy.fields.challenge && (
                  <div className="mb-10 text-lg leading-prose text-ink-2 md:text-xl">
                    <RichTextRenderer content={caseStudy.fields.challenge} />
                  </div>
                )}

                {caseStudy.fields.featuredImage && (
                  <img
                    src={caseStudy.fields.featuredImage.fields.file?.url}
                    alt={
                      caseStudy.fields.featuredImage.fields.title ||
                      caseStudy.fields.title
                    }
                    className="mb-8 h-64 w-full rounded-card object-cover md:h-80"
                  />
                )}

                {/* Spec row, not tiles. Two boxed cards here plus the boxed
                 * results block plus the related grid gave one Long Document
                 * three competing card registers — the hairline row is the
                 * pattern the marketing spec sheet already uses. */}
                <dl className="mb-8 border-t border-rule">
                  {caseStudy.fields.clientName && (
                    <div className="flex items-baseline gap-4 border-b border-rule py-3">
                      <dt className="label-mono w-32 shrink-0 text-ink-3">
                        {csT("client")}
                      </dt>
                      <dd className="font-medium">
                        {caseStudy.fields.clientName}
                      </dd>
                    </div>
                  )}

                  {caseStudy.fields.category && (
                    <div className="flex items-baseline gap-4 border-b border-rule py-3">
                      <dt className="label-mono w-32 shrink-0 text-ink-3">
                        {csT("category")}
                      </dt>
                      <dd className="font-medium">
                        {caseStudy.fields.category.fields?.title}
                      </dd>
                    </div>
                  )}
                </dl>
              </header>

              {/* Solution */}
              {caseStudy.fields.solution && (
                <section className="mb-12">
                  <h2 className="mb-6 font-heading text-3xl font-bold leading-display">
                    {csT("solution")}
                  </h2>
                  <div className="leading-prose">
                    <RichTextRenderer content={caseStudy.fields.solution} />
                  </div>
                </section>
              )}

              {/* Results — was the last boxed block on the page. Long Document's
               * divider is negative space and a rule, so the payoff section is
               * marked by the rule above it, not by a filled card. */}
              {caseStudy.fields.results && (
                <section className="border-t border-rule pt-10">
                  <h2 className="mb-6 font-heading text-3xl font-bold leading-display">
                    {csT("results")}
                  </h2>
                  <div className="leading-prose">
                    <RichTextRenderer content={caseStudy.fields.results} />
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
                  <CaseStudyCard key={cs.sys.id} caseStudy={cs} />
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
