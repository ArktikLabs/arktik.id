/* Hallmark · macrostructure: 20 Ecosystem Index · design-system: design.md */
import Image from "next/image";
import { Metadata } from "next";
import { alternatesFor } from "@/lib/seo/schema";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, breadcrumbs } from "@/lib/seo/schema";
import {
  getCategoryBySlug,
  getBlogPosts,
  getPillarPages,
} from "@/lib/services/contentful";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { PillarCard } from "@/components/blog/PillarCard";
import { RichTextRenderer } from "@/components/blog/RichTextRenderer";
import { Header } from "@/components/sections/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import {
  getPlainTextFromRichText,
  getAssetUrl,
  toAbsoluteUrl,
} from "@/lib/utils/contentful";
import { FileX, ArrowLeft } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import Link from "next/link";
import { BlogHeroSection } from "@/components/sections/BlogHeroSection";

interface CategoryPageProps {
  params: {
    locale: string;
    category: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug, locale);

  if (!category) {
    return {
      title: "Category Not Found | Arktik",
    };
  }

  return {
    alternates: alternatesFor(locale, `blog/${categorySlug}`),
    title: `${category.fields.title} | Arktik Blog`,
    description:
      getPlainTextFromRichText(category.fields.description) ||
      `Explore articles about ${category.fields.title}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category: categorySlug } = await params;

  try {
    const [category, { posts }, pillars, t, blogT] = await Promise.all([
      getCategoryBySlug(categorySlug, locale),
      getBlogPosts({ categorySlug, locale }),
      getPillarPages(categorySlug, locale),
      getTranslations("categoryPage"),
      getTranslations("blog"),
    ]);

    if (!category) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-paper text-ink">
        <JsonLd
          data={graph(
            breadcrumbs(locale, [
              { name: blogT("title"), path: "blog" },
              { name: category.fields.title },
            ]),
          )}
        />
        <Header />

        <BlogHeroSection>
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center">
              {category.fields.icon && (
                <Image
                  src={toAbsoluteUrl(category.fields.icon.fields.file?.url)}
                  alt=""
                  aria-hidden="true"
                  width={48}
                  height={48}
                  className="mr-4 h-12 w-12 rounded-card"
                />
              )}
              <h1 className="text-4xl font-bold leading-tight text-balance font-heading lg:text-6xl">
                {category.fields.title}
              </h1>
            </div>

            {category.fields.description && (
              <div className="max-w-3xl text-lg leading-relaxed text-ink-2 lg:text-xl">
                {typeof category.fields.description === "string" ? (
                  category.fields.description
                ) : (
                  <RichTextRenderer content={category.fields.description} />
                )}
              </div>
            )}
          </div>
        </BlogHeroSection>

        <main
          id="main"
          className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16"
        >
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: blogT("title"), href: `/${locale}/blog` },
              { label: category.fields.title, isActive: true },
            ]}
            className="mb-8"
          />

          {/* Guides — destinations, so they stay as cards. */}
          {pillars.length > 0 && (
            <section className="mb-16">
              <div className="section-head mb-8">
                <h2 className="font-heading text-3xl font-bold">
                  {t("completeGuides")}
                </h2>
                <span className="section-head__rule" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {pillars.map((pillar) => (
                  <PillarCard
                    key={pillar.sys.id}
                    pillar={pillar}
                    categorySlug={categorySlug}
                    locale={locale}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Articles — a feed, so a denser 2-up. Different surface, different
           * treatment; three identical 3-up grids is what made this page read
           * as one undifferentiated wall. */}
          {posts.length > 0 && (
            <section className="border-t border-rule pt-14">
              <div className="section-head mb-8">
                <h2 className="font-heading text-3xl font-bold">
                  {t("articles")}
                </h2>
                <span className="section-head__rule" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {posts.map((post) => (
                  <BlogPostCard key={post.sys.id} post={post} locale={locale} />
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {posts.length === 0 && pillars.length === 0 && (
            <section className="text-center py-24">
              <div className="max-w-lg mx-auto">
                {/* Category Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-rule bg-paper-2">
                  {getAssetUrl(category.fields.icon) ? (
                    <Image
                      src={toAbsoluteUrl(getAssetUrl(category.fields.icon)!)}
                      alt=""
                      aria-hidden="true"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded object-contain"
                    />
                  ) : (
                    <FileX className="h-9 w-9 text-ink-3" aria-hidden="true" />
                  )}
                </div>

                <h2 className="font-heading text-3xl font-bold">
                  {t("emptyState.title")}
                </h2>

                <p className="mb-8 mt-4 text-lg leading-relaxed text-ink-2">
                  {t("emptyState.description")}
                </p>

                <Link
                  href={`/${locale}/blog`}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-lime-green px-6 py-3 font-medium text-ink-invert transition-colors duration-200 hover:bg-lime-green/90"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t("emptyState.backToBlog")}</span>
                </Link>
              </div>
            </section>
          )}
        </main>

        <FooterSection />
      </div>
    );
  } catch (error) {
    console.error("Error loading category page:", error);
    notFound();
  }
}
