/* Hallmark · macrostructure: 02 Long Document · design-system: design.md */
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/services/contentful";
import { RichTextRenderer } from "@/components/blog/RichTextRenderer";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Header } from "@/components/sections/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { BlogHeroSection } from "@/components/sections/BlogHeroSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import Link from "next/link";
import { PostCtaSection } from "@/components/blog/PostCtaSection";
import { getTranslations } from "next-intl/server";
import { calculateCombinedReadingTime } from "@/lib/utils/reading-time";

interface BlogPostPageProps {
  params: {
    locale: string;
    category: string;
    post: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, category: categorySlug, post: postSlug } = await params;
  const post = await getBlogPostBySlug(categorySlug, postSlug, locale);
  const postT = await getTranslations("postPage");

  if (!post) {
    return {
      title: postT("notFound"),
    };
  }

  return {
    title: post.fields.seoTitle || `${post.fields.title} | Arktik`,
    description: post.fields.seoDescription || post.fields.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, category: categorySlug, post: postSlug } = await params;

  try {
    const [post, relatedData, t, postCtaT, postT] = await Promise.all([
      getBlogPostBySlug(categorySlug, postSlug, locale),
      getBlogPosts({ categorySlug, locale, limit: 3 }),
      getTranslations("pillarPage"),
      getTranslations("postCta"),
      getTranslations("postPage"),
    ]);

    if (!post) {
      notFound();
    }

    const filteredRelatedPosts = relatedData.posts.filter(
      (relatedPost) => relatedPost.sys.id !== post.sys.id,
    );

    const category = post.fields.category.fields;
    const author = post.fields.author?.fields;
    const pillar = post.fields.pillar?.fields;

    // Get hero image URL
    const heroImage = post.fields.featuredImage?.fields.file?.url;

    // Calculate reading time
    const readingTime = calculateCombinedReadingTime([
      post.fields.excerpt || "",
      post.fields.body,
    ]);

    const postCtaContent = {
      title: post.fields.ctaTitle ?? postCtaT("title"),
      description: post.fields.ctaDescription ?? postCtaT("description"),
      primaryCta: postCtaT("primaryCta"),
      secondaryCta: postCtaT("secondaryCta"),
    };

    return (
      <div className="min-h-screen bg-paper text-ink">
        <Header />

        {/* Hero Section */}
        <BlogHeroSection
          imageUrl={heroImage ?? "/assets/aurora-bg.webp"}
          className="min-h-[320px] md:min-h-[380px]"
          containerClassName="pt-28 pb-16"
          imageClassName={heroImage ? "opacity-90" : undefined}
        />

        <main className="relative mx-auto max-w-7xl px-6 py-16 lg:px-12">
          {/* Breadcrumb is page chrome, not document content — container width,
            * or its labels truncate inside the 64ch column. */}
          <Breadcrumb
            items={[
              { label: postT("blog"), href: `/${locale}/blog` },
              {
                label: category.title,
                href: `/${locale}/blog/${categorySlug}`,
              },
              { label: post.fields.title, isActive: true },
            ]}
            className="mb-12"
          />

          <div className="mx-auto max-w-measure">
            {/* Article */}
            <article className="mb-16">
              <header className="mb-12">
                {/* Long Document meta is one typographic line, not four
                 * icon-decorated chips. The icons were generic-blog voice and
                 * carried no information the words don't. */}
                <p className="label-mono mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-ink-3">
                  <Link
                    href={`/blog/${categorySlug}`}
                    className="text-ink-2 underline-offset-4 transition-colors duration-200 hover:text-lime-green hover:underline"
                  >
                    {category.title}
                  </Link>
                  <span aria-hidden="true">·</span>
                  <span>
                    {new Date(post.sys.createdAt).toLocaleDateString(
                      locale === "id" ? "id-ID" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{t("readingTime", { minutes: readingTime })}</span>
                  {author?.name && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{author.name}</span>
                    </>
                  )}
                </p>

                {/* Title */}
                <h1 className="mb-6 text-balance font-heading text-4xl font-bold leading-display md:text-5xl md:leading-display lg:text-6xl lg:leading-display">
                  {post.fields.title}
                </h1>

                {/* Lede — sized as a standfirst, not body copy. */}
                {post.fields.excerpt && (
                  <p className="mb-10 text-lg leading-prose text-ink-2 md:text-xl">
                    {post.fields.excerpt}
                  </p>
                )}

                {/* Was a bordered paper-2 card. Long Document's button voice is a
                 * typographic link inside the prose — the box was the loudest
                 * thing above the fold and it only carried one link. */}
                {pillar && (
                  <p className="border-t border-rule pt-6 text-ink-3">
                    {postT("partOfGuide")}{" "}
                    <Link
                      href={`/blog/${categorySlug}/guides/${pillar.slug}`}
                      className="text-lime-green underline underline-offset-4 transition-colors duration-200 hover:text-ink"
                    >
                      {pillar.title}
                    </Link>
                  </p>
                )}
              </header>

              {/* Content */}
              <div className="leading-prose">
                <RichTextRenderer content={post.fields.body} />
              </div>

              {/* Tags — chips became a typographic run. The gap is the divider. */}
              {post.fields.tags && post.fields.tags.length > 0 && (
                <p className="label-mono mt-12 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-rule pt-6 text-ink-3">
                  {post.fields.tags.map((tag: string, i: number) => (
                    <span key={tag}>
                      {i > 0 && (
                        <span aria-hidden="true" className="pr-3">
                          ·
                        </span>
                      )}
                      {tag}
                    </span>
                  ))}
                </p>
              )}

              {/* Author — de-boxed. A rule and a name, sized as a colophon. */}
              {author && (
                <footer className="mt-12 border-t border-rule pt-6">
                  <p className="label-mono mb-2 text-ink-3">{author.name}</p>
                  {author.bio && (
                    <div className="leading-prose text-ink-2">
                      <RichTextRenderer content={author.bio} />
                    </div>
                  )}
                </footer>
              )}
            </article>
          </div>

          {/* Call-to-Action Section */}
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
          {filteredRelatedPosts.length > 0 && (
            <section>
              <h2 className="mb-8 font-heading text-3xl font-bold leading-display">
                {postT("moreFromCategory", { category: category.title })}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRelatedPosts.map((relatedPost) => (
                  <BlogPostCard key={relatedPost.sys.id} post={relatedPost} />
                ))}
              </div>
            </section>
          )}
        </main>

        <FooterSection />
      </div>
    );
  } catch (error) {
    console.error("Error loading blog post:", error);
    notFound();
  }
}
