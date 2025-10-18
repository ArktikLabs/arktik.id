import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getPillarPageBySlug, getBlogPosts } from '@/lib/services/contentful'
import { RichTextRenderer } from '@/components/blog/RichTextRenderer'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { Header } from '@/components/sections/Header'
import { FooterSection } from '@/components/sections/FooterSection'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Calendar, Clock, BookOpen, User } from "lucide-react";
import { calculateCombinedReadingTime } from "@/lib/utils/reading-time";
import { BlogHeroSection } from '@/components/sections/BlogHeroSection'
import { PostCtaSection } from '@/components/blog/PostCtaSection'

interface PillarPageProps {
  params: {
    locale: string
    category: string
    pillar: string
  }
}

export async function generateMetadata({ params }: PillarPageProps): Promise<Metadata> {
  const { locale, category: categorySlug, pillar: pillarSlug } = await params
  const pillar = await getPillarPageBySlug(categorySlug, pillarSlug, locale)
  const t = await getTranslations("pillarPage");

  if (!pillar) {
    return {
      title: t("notFound"),
    }
  }

  return {
    title: pillar.fields.seoTitle || `${pillar.fields.title} | Arktik`,
    description: pillar.fields.seoDescription || `Complete guide: ${pillar.fields.title}`,
  }
}

export default async function PillarPage({ params }: PillarPageProps) {
  const { locale, category: categorySlug, pillar: pillarSlug } = await params

  try {
    const [pillar, t, postCtaT] = await Promise.all([
      getPillarPageBySlug(categorySlug, pillarSlug, locale),
      getTranslations('pillarPage'),
      getTranslations('postCta'),
    ])

    if (!pillar) {
      notFound()
    }

    const { posts: relatedPosts } = await getBlogPosts({
      pillarId: pillar.sys.id,
      locale,
      limit: 6,
    })

    const category = pillar.fields.category.fields
    const heroImage = pillar.fields.featuredImage?.fields.file?.url

    // Calculate reading time
    const readingTime = calculateCombinedReadingTime([
      pillar.fields.introduction,
      pillar.fields.body
    ])

    const postCtaContent = {
      badge: postCtaT('badge'),
      title: pillar.fields.ctaTitle ?? postCtaT('title'),
      description: pillar.fields.ctaDescription ?? postCtaT('description'),
      primaryCta: postCtaT('primaryCta'),
      secondaryCta: postCtaT('secondaryCta'),
    }

    return (
      <div className="min-h-screen text-white bg-dark-blue">
        <Header />

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

          {/* Article */}
          <article className="mb-16">
            {/* Article Header */}
            <header className="mb-12">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm font-medium text-lime-green">
                <div className="inline-flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{t("completeGuide")}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(pillar.sys.createdAt).toLocaleDateString(
                      locale === "id" ? "id-ID" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{t("readingTime", { minutes: readingTime })}</span>
                </div>
                {pillar.fields.author?.fields?.name && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <User className="w-4 h-4" />
                    <span className="text-lime-green">
                      {pillar.fields.author.fields.name}
                    </span>
                  </div>
                )}
              </div>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-balance font-heading md:text-5xl lg:text-6xl">
                {pillar.fields.title}
              </h1>
              {pillar.fields.introduction && (
                <div className="prose prose-xl prose-invert mb-12 border-b border-gray-700 pb-8">
                  <RichTextRenderer content={pillar.fields.introduction} />
                </div>
              )}
            </header>

            {/* Main Content */}
            <div className="prose prose-lg prose-invert max-w-none">
              <RichTextRenderer content={pillar.fields.body} />
            </div>
          </article>

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
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8">
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
    console.error('Error loading pillar page:', error)
    notFound()
  }
}
