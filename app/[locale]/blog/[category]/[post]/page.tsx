import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/services/contentful'
import { RichTextRenderer } from '@/components/blog/RichTextRenderer'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { Header } from '@/components/sections/Header'
import { FooterSection } from '@/components/sections/FooterSection'
import { BlogHeroSection } from "@/components/sections/BlogHeroSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Calendar, Clock, User, Tag } from "lucide-react";
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
      (relatedPost) => relatedPost.sys.id !== post.sys.id
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
      badge: postCtaT("badge"),
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

        <main className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16">
          {/* Breadcrumb */}
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

          {/* Article */}
          <article className="mb-16">
            <header className="mb-12">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm font-medium text-lime-green">
                <div className="inline-flex items-center gap-2">
                  <Link
                    href={`/blog/${categorySlug}`}
                    className="label-mono inline-block rounded-full border border-rule-strong px-3 py-1 text-ink-2 transition-colors duration-200 hover:border-lime-green hover:text-lime-green"
                  >
                    {category.title}
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-ink-3">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(post.sys.createdAt).toLocaleDateString(
                      locale === "id" ? "id-ID" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-ink-3">
                  <Clock className="h-4 w-4" />
                  <span>{t("readingTime", { minutes: readingTime })}</span>
                </div>
                {author?.name && (
                  <div className="flex items-center gap-2 text-ink-3">
                    <User className="w-4 h-4" />
                    <span>{author.name}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="mb-6 max-w-[18ch] text-balance font-heading text-4xl font-bold leading-[1.05] md:text-5xl lg:text-6xl">
                {post.fields.title}
              </h1>

              {/* Excerpt/Introduction */}
              {post.fields.excerpt && (
                <div className="prose prose-xl prose-invert max-w-[62ch] mb-12">
                  {post.fields.excerpt}
                </div>
              )}

              {/* Pillar Link */}
              {pillar && (
                <div className="mb-8 rounded-xl border border-rule bg-paper-2 p-5">
                  <p className="label-mono mb-2">
                    {postT("partOfGuide")}
                  </p>
                  <Link
                    href={`/blog/${categorySlug}/guides/${pillar.slug}`}
                    className="text-lime-green hover:text-lime-green/80 font-medium transition-colors"
                  >
                    {pillar.title} →
                  </Link>
                </div>
              )}
            </header>

            {/* Content */}
            <div className="prose prose-lg prose-invert max-w-[68ch]">
              <RichTextRenderer content={post.fields.body} />
            </div>

            {/* Tags */}
            {post.fields.tags && post.fields.tags.length > 0 && (
              <div className="flex items-center space-x-2 mb-8">
                <Tag className="w-4 h-4 text-ink-3" />
                <div className="flex flex-wrap gap-2">
                  {post.fields.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-paper-2 text-ink-2 px-2 py-1 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            {author && (
              <div className="bg-paper rounded-lg p-6 mb-16">
                <div className="flex items-start space-x-4">
                  {author.avatar && (
                    <img
                      src={author.avatar.fields.file?.url}
                      alt={author.name}
                      className="w-16 h-16 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold mb-2">{author.name}</h3>
                    {author.bio && <RichTextRenderer content={author.bio} />}
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Call-to-Action Section */}
          <div className="mb-16">
            <PostCtaSection
              locale={locale}
              badge={postCtaContent.badge}
              title={postCtaContent.title}
              description={postCtaContent.description}
              primaryCta={postCtaContent.primaryCta}
              secondaryCta={postCtaContent.secondaryCta}
            />
          </div>

          {/* Related Posts */}
          {filteredRelatedPosts.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8">
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
