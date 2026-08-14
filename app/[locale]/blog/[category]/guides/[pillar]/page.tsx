/* Hallmark · macrostructure: 02 Long Document · design-system: design.md */
import { Metadata } from "next";
import { alternatesFor } from "@/lib/seo/schema";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPillarPageBySlug, getBlogPosts } from "@/lib/services/contentful";
import { RichTextRenderer } from "@/components/blog/RichTextRenderer";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Header } from "@/components/sections/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { calculateCombinedReadingTime } from "@/lib/utils/reading-time";
import { BlogHeroSection } from "@/components/sections/BlogHeroSection";
import { PostCtaSection } from "@/components/blog/PostCtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { toAbsoluteUrl } from "@/lib/utils/contentful";
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
    title: pillar.fields.seoTitle || `${pillar.fields.title} | Arktik`,
    description:
      pillar.fields.seoDescription || `Complete guide: ${pillar.fields.title}`,
  };
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
      pillarId: pillar.sys.id,
      locale,
      limit: 6,
    });

    const category = pillar.fields.category.fields;
    const heroImage = pillar.fields.featuredImage?.fields.file?.url;

    // Calculate reading time
    const readingTime = calculateCombinedReadingTime([
      pillar.fields.introduction,
      pillar.fields.body,
    ]);

    const postCtaContent = {
      title: pillar.fields.ctaTitle ?? postCtaT("title"),
      description: pillar.fields.ctaDescription ?? postCtaT("description"),
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
              headline: pillar.fields.title,
              description: pillar.fields.seoDescription,
              image: heroImage ? toAbsoluteUrl(heroImage) : undefined,
              datePublished: pillar.sys.createdAt,
              dateModified: pillar.sys.updatedAt,
              authorName: pillar.fields.author?.fields?.name,
            }),
            breadcrumbs(locale, [
              { name: t("blog"), path: "blog" },
              { name: category.title, path: `blog/${categorySlug}` },
              { name: t("guides"), path: `blog/${categorySlug}` },
              { name: pillar.fields.title },
            ]),
          )}
        />
        <Header />

        <BlogHeroSection
          imageUrl={heroImage}
          className={heroImage ? "min-h-[320px] md:min-h-[380px]" : undefined}
          containerClassName="pt-28 pb-16"
        />

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
              { label: pillar.fields.title, isActive: true },
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
                    {new Date(pillar.sys.createdAt).toLocaleDateString(
                      locale === "id" ? "id-ID" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{t("readingTime", { minutes: readingTime })}</span>
                  {pillar.fields.author?.fields?.name && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{pillar.fields.author.fields.name}</span>
                    </>
                  )}
                </p>
                <h1 className="mb-6 text-balance font-heading text-4xl font-bold leading-display md:text-5xl md:leading-display lg:text-6xl lg:leading-display">
                  {pillar.fields.title}
                </h1>
                {/* Lede — a standfirst register, then the rule as the divider. */}
                {pillar.fields.introduction && (
                  <div className="border-b border-rule pb-8 text-lg leading-prose text-ink-2 md:text-xl">
                    <RichTextRenderer content={pillar.fields.introduction} />
                  </div>
                )}
              </header>

              {/* Main Content */}
              <div className="leading-prose">
                <RichTextRenderer content={pillar.fields.body} />
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
                  <BlogPostCard key={post.sys.id} post={post} locale={locale} />
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
