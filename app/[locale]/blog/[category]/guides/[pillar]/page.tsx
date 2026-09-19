/* Hallmark · macrostructure: 02 Long Document · design-system: design.md */
import { Metadata } from "next";
import { alternatesFor } from "@/lib/seo/schema";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPillarPageBySlug, getBlogPosts, getPillarPages } from "@/lib/content";
import { RichTextRenderer } from "@/components/blog/RichTextRenderer";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Header } from "@/components/sections/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { calculateCombinedReadingTime } from "@/lib/utils/reading-time";
import { BlogHeroSection } from "@/components/sections/BlogHeroSection";
import { PostCtaSection } from "@/components/blog/PostCtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, article, breadcrumbs } from "@/lib/seo/schema";

interface PillarPageProps {
  params: {
    locale: string;
    category: string;
    pillar: string;
  };
}

export async function generateMetadata({
  params,
}: PillarPageProps): Promise<Metadata> {
  const { locale, category: categorySlug, pillar: pillarSlug } = await params;
  const pillar = await getPillarPageBySlug(categorySlug, pillarSlug, locale);
  const t = await getTranslations("pillarPage");

  if (!pillar) {
    return {
      title: t("notFound"),
    };
  }

  return {
    alternates: alternatesFor(
      locale,
      `blog/${categorySlug}/guides/${pillarSlug}`,
    ),
    title: pillar.seoTitle || `${pillar.title} | Arktik`,
    description:
      pillar.seoDescription || `Complete guide: ${pillar.title}`,
  };
}

export function generateStaticParams() {
  return getPillarPages().map((p) => ({
    category: p.category.slug,
    pillar: p.slug,
  }));
}

export default async function PillarPage({ params }: PillarPageProps) {
  const { locale, category: categorySlug, pillar: pillarSlug } = await params;

  try {
    const [pillar, t, postCtaT] = await Promise.all([
      getPillarPageBySlug(categorySlug, pillarSlug, locale),
      getTranslations("pillarPage"),
      getTranslations("postCta"),
    ]);

    if (!pillar) {
      notFound();
    }

    const { posts: relatedPosts } = await getBlogPosts({
      pillarSlug: pillar.slug,
      locale,
      limit: 6,
    });

    const category = pillar.category;
    const heroImage = pillar.image;

    // Calculate reading time
    const readingTime = calculateCombinedReadingTime([
      pillar.introduction,
      pillar.body,
    ]);

    const postCtaContent = {
      title: pillar.ctaTitle ?? postCtaT("title"),
      description: pillar.ctaDescription ?? postCtaT("description"),
      primaryCta: postCtaT("primaryCta"),
      secondaryCta: postCtaT("secondaryCta"),
    };

    return (
      <div className="min-h-screen bg-paper text-ink">
        <JsonLd
          data={graph(
            article({
              locale,
              path: `blog/${categorySlug}/guides/${pillarSlug}`,
              headline: pillar.title,
              description: pillar.seoDescription,
              image: heroImage,
              datePublished: pillar.date,
              dateModified: pillar.updated,
              authorName: pillar.author?.name,
            }),
            breadcrumbs(locale, [
              { name: t("blog"), path: "blog" },
              { name: category.title, path: `blog/${categorySlug}` },
              { name: t("guides"), path: `blog/${categorySlug}` },
              { name: pillar.title },
            ]),
          )}
        />
        <Header />

        <BlogHeroSection
          imageUrl={heroImage}
          className={heroImage ? "min-h-[320px] md:min-h-[380px]" : undefined}
          containerClassName="pt-28 pb-16"
        />

        {pillar.image && pillar.imageCredit && (
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <p className="label-mono mt-2 text-ink-3">
              Photo by{" "}
              <a href={pillar.imageCredit.profileUrl} rel="noopener noreferrer" target="_blank" className="underline underline-offset-4">{pillar.imageCredit.name}</a>
              {" "}on{" "}
              <a href={pillar.imageCredit.photoUrl} rel="noopener noreferrer" target="_blank" className="underline underline-offset-4">Unsplash</a>
            </p>
          </div>
        )}

        <main
          id="main"
          className="relative mx-auto max-w-7xl px-6 py-16 lg:px-12"
        >
          {/* Breadcrumb is page chrome, not document content — it stays at
           * container width. Inside the 64ch column its four levels truncated
           * to "Bl… › AI, Automation & Innovati… › Guid… › …". */}
          <Breadcrumb
            items={[
              { label: t("blog"), href: `/${locale}/blog` },
              {
                label: category.title,
                href: `/${locale}/blog/${categorySlug}`,
              },
              { label: t("guides"), href: `/${locale}/blog/${categorySlug}` },
              { label: pillar.title, isActive: true },
            ]}
            className="mb-12"
          />

          <div className="mx-auto max-w-measure">
            {/* Article */}
            <article className="mb-16">
              {/* Article Header */}
              <header className="mb-12">
                {/* The one permitted section tag: Long Document + genuinely
                 * ordinal content. Stacked above the heading, never tag-left. */}
                <p className="label-mono mb-3 text-lime-green">
                  {t("completeGuide")}
                </p>
                <p className="label-mono mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-ink-3">
                  <span>
                    {new Date(pillar.date).toLocaleDateString(
                      locale === "id" ? "id-ID" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{t("readingTime", { minutes: readingTime })}</span>
                  {pillar.author?.name && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{pillar.author.name}</span>
                    </>
                  )}
                </p>
                <h1 className="mb-6 text-balance font-heading text-4xl font-bold leading-display md:text-5xl md:leading-display lg:text-6xl lg:leading-display">
                  {pillar.title}
                </h1>
                {/* Lede — a standfirst register, then the rule as the divider. */}
                {pillar.introduction && (
                  <div className="border-b border-rule pb-8 text-lg leading-prose text-ink-2 md:text-xl">
                    <RichTextRenderer content={pillar.introduction} />
                  </div>
                )}
              </header>

              {/* Main Content */}
              <div className="leading-prose">
                <RichTextRenderer content={pillar.body} />
              </div>
            </article>
          </div>

          <div className="mb-16">
            <PostCtaSection
              locale={locale}
              title={postCtaContent.title}
              description={postCtaContent.description}
              primaryCta={postCtaContent.primaryCta}
              secondaryCta={postCtaContent.secondaryCta}
            />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="mb-8 font-heading text-3xl font-bold leading-display">
                {t("relatedArticles")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} locale={locale} />
                ))}
              </div>
            </section>
          )}
        </main>

        <FooterSection />
      </div>
    );
  } catch (error) {
    console.error("Error loading pillar page:", error);
    notFound();
  }
}
