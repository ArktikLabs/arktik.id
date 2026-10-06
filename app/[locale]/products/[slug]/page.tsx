/* Hallmark · macrostructure: 05 Workbench (product) · design-system: design.md v2
 *
 * Sits in the showcase family: the product's own screenshots are the only
 * enrichment. Copy is factual scope — coverage and the feature list — with no
 * prices, user counts or testimonials (honest-copy clause), and each product's
 * disclaimer line (not-investment-advice, children's data, …) is part of the
 * page body, not buried in a footer. Coverage/feature keys come from
 * lib/data/products.ts so every product shares this one layout. */
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/sections/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PostCtaSection } from "@/components/blog/PostCtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { alternatesFor, breadcrumbs, graph, localeUrl, socialMeta } from "@/lib/seo/schema";
import { getAllProducts, getProductBySlug } from "@/lib/data/products";

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Only the slugs in lib/data/products.ts exist; nothing renders on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const t = await getTranslations({ locale, namespace: "productPage" });
  return {
    title: t(`${product.key}.metaTitle`),
    description: t(`${product.key}.metaDescription`),
    alternates: alternatesFor(locale, `products/${slug}`),
    ...socialMeta({
      locale,
      path: `products/${slug}`,
      title: t(`${product.key}.metaTitle`),
      description: t(`${product.key}.metaDescription`),
      /* Generated work card (title + screenshot), lib/seo/og-cards.ts. */
    }),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations("productPage");
  const k = product.key;
  const home = locale === "en" ? "/en" : "/";

  return (
    <div className="min-h-screen bg-paper text-ink">
      <JsonLd
        data={graph(
          {
            "@type": "SoftwareApplication",
            "@id": `${localeUrl(locale, `products/${slug}`)}#product`,
            name: product.name,
            url: product.link,
            image: `https://www.arktik.id${product.icon}`,
            applicationCategory: product.category,
            operatingSystem: "Web",
            description: t(`${k}.metaDescription`),
            inLanguage: "id-ID",
            creator: { "@id": "https://www.arktik.id/#organization" },
            ...(product.brands && {
              hasPart: product.brands.map((b) => ({
                "@type": "SoftwareApplication",
                name: b.name,
                url: b.link,
                applicationCategory: product.category,
                operatingSystem: "Web",
              })),
            }),
          },
          breadcrumbs(locale, [
            { name: "Arktik", path: "" },
            { name: t("breadcrumb") },
            { name: product.name },
          ]),
        )}
      />
      <Header />

      <main
        id="main"
        className="mx-auto max-w-7xl px-6 pb-16 pt-[calc(var(--banner-h)+var(--bar-h)+2.5rem)] lg:px-12"
      >
        <Breadcrumb
          items={[
            { label: "Arktik", href: home },
            { label: t("breadcrumb"), href: `${home === "/" ? "" : home}/#products` },
            { label: product.name, isActive: true },
          ]}
          className="mb-10"
        />

        {/* Hero: name + tagline left, the live product's feed right. */}
        <section className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center">
          <div className="flex min-w-0 flex-col gap-6">
            <h1 className="flex items-center gap-5 font-heading text-5xl font-bold leading-display md:text-6xl">
              <Image
                src={product.icon}
                alt=""
                width={64}
                height={64}
                unoptimized
                priority
                className="h-14 w-14 shrink-0 rounded-[22%] ring-1 ring-rule-strong md:h-16 md:w-16"
              />
              {product.name}
            </h1>
            <p className="text-balance text-xl leading-relaxed text-ink md:text-2xl">
              {t(`${k}.tagline`)}
            </p>
            <p className="max-w-xl text-base leading-relaxed text-ink-2 md:text-lg">
              {t(`${k}.intro`)}
            </p>
            {product.brands ? (
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#brands"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill bg-lime-green px-6 py-3 text-sm font-semibold text-carbon transition-colors duration-200 hover:bg-lime-green/90"
              >
                {t(`${k}.brandsNav`)}
              </a>
              {product.brands.map((b) => (
                <a
                  key={b.key}
                  href={b.link}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 whitespace-nowrap px-1 py-2 text-sm font-medium text-ink-2 underline decoration-rule-strong underline-offset-4 hover:text-lime-green hover:decoration-lime-green"
                >
                  <Image src={b.icon} alt="" width={18} height={18} unoptimized className="h-[18px] w-[18px] rounded-[22%] ring-1 ring-rule-strong" />
                  {b.name}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ))}
            </div>
            ) : (
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={product.link}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill bg-lime-green px-6 py-3 text-sm font-semibold text-carbon transition-colors duration-200 hover:bg-lime-green/90"
              >
                {t(`${k}.visit`)}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="label-mono">{product.domain}</span>
            </div>
            )}
          </div>

          <figure className="min-w-0">
            <Image
              src={product.cover.src}
              alt={t(`${k}.shots.${product.cover.key}.alt`)}
              width={product.cover.width}
              height={product.cover.height}
              priority
              sizes="(max-width: 1024px) 100vw, 640px"
              className="h-auto w-full rounded-card border border-rule"
            />
            <figcaption className="label-mono mt-3 normal-case tracking-normal">
              {t(`${k}.shots.${product.cover.key}.caption`)}
            </figcaption>
          </figure>
        </section>

        {/* Coverage — scope of public data, not traction. */}
        <section className="mt-20" aria-labelledby="coverage">
          <h2 id="coverage" className="label-mono mb-4">
            {t(`${k}.coverageTitle`)}
          </h2>
          <dl className="grid grid-cols-2 border-t border-rule lg:grid-cols-4">
            {product.coverage.map((c) => (
              <div
                key={c}
                className="flex min-w-0 flex-col gap-1 border-b border-rule py-5 pr-4 lg:border-b-0"
              >
                <dt className="order-2 text-sm text-ink-2">
                  {t(`${k}.coverage.${c}.label`)}
                </dt>
                <dd className="order-1 font-heading text-2xl font-bold text-ink md:text-3xl">
                  {t(`${k}.coverage.${c}.value`)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Product family: one card per brand on this engine. */}
        {product.brands && (
          <section className="mt-20" id="brands" aria-labelledby="brands-title">
            <div className="section-head mb-4">
              <h2 id="brands-title" className="font-heading text-3xl font-bold lg:text-4xl">
                {t(`${k}.brandsTitle`)}
              </h2>
              <span className="section-head__rule" aria-hidden="true" />
            </div>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-ink-2">
              {t(`${k}.brandsIntro`)}
            </p>
            <ul className="grid gap-6 md:grid-cols-2">
              {product.brands.map((b) => (
                <li key={b.key} className="tile flex min-w-0 flex-col gap-5">
                  <a
                    href={b.link}
                    target="_blank"
                    rel="noopener"
                    tabIndex={-1}
                    className="block overflow-hidden rounded-card border border-rule"
                  >
                    <Image
                      src={b.cover.src}
                      alt={t(`${k}.brands.${b.key}.alt`)}
                      width={b.cover.width}
                      height={b.cover.height}
                      sizes="(max-width: 768px) 100vw, 560px"
                      className="h-auto w-full"
                    />
                  </a>
                  <div className="flex min-w-0 flex-col gap-2">
                    <span className="label-mono">{t(`${k}.brands.${b.key}.vertical`)}</span>
                    <h3 className="flex items-center gap-3 font-heading text-2xl font-bold text-ink">
                      <Image
                        src={b.icon}
                        alt=""
                        width={36}
                        height={36}
                        unoptimized
                        className="h-9 w-9 shrink-0 rounded-[22%] ring-1 ring-rule-strong"
                      />
                      {t(`${k}.brands.${b.key}.title`)}
                    </h3>
                    <ul className="mt-1 flex flex-col gap-1.5 text-sm leading-relaxed text-ink-2">
                      {(t.raw(`${k}.brands.${b.key}.ticks`) as string[]).map((x) => (
                        <li key={x} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-green" aria-hidden="true" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
                    <a
                      href={b.link}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill border border-rule-strong px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-200 hover:border-lime-green hover:text-lime-green"
                    >
                      {t(`${k}.brands.${b.key}.visit`)}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <span className="label-mono">{b.domain}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Features */}
        <section className="mt-20">
          <div className="section-head mb-10">
            <h2 className="font-heading text-3xl font-bold lg:text-4xl">
              {t(`${k}.featuresTitle`)}
            </h2>
            <span className="section-head__rule" aria-hidden="true" />
          </div>
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {product.features.map((f) => (
              <li key={f} className="step">
                <h3 className="font-heading text-lg font-semibold text-ink">
                  {t(`${k}.features.${f}.title`)}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">
                  {t(`${k}.features.${f}.description`)}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-base text-ink-2">{t(`${k}.tiers`)}</p>
        </section>

        {/* Screens */}
        {product.shots.length > 0 && (
        <section className="mt-20 grid gap-10">
          {product.shots.map((s) => (
            <figure key={s.key} className="min-w-0">
              <Image
                src={s.src}
                alt={t(`${k}.shots.${s.key}.alt`)}
                width={s.width}
                height={s.height}
                sizes="(max-width: 1280px) 100vw, 1184px"
                className="h-auto w-full rounded-card border border-rule"
              />
              <figcaption className="label-mono mt-3 normal-case tracking-normal">
                {t(`${k}.shots.${s.key}.caption`)}
              </figcaption>
            </figure>
          ))}
        </section>
        )}

        {/* How it's built + disclaimer */}
        <section className="mt-20 grid gap-8 border-t border-rule pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <h2 className="font-heading text-2xl font-bold">
            {t(`${k}.builtTitle`)}
          </h2>
          <div className="flex min-w-0 flex-col gap-6">
            <p className="max-w-measure text-base leading-relaxed text-ink-2 md:text-lg">
              {t(`${k}.built`)}
            </p>
            <p className="max-w-measure border-l-2 border-rule-strong pl-4 text-sm leading-relaxed text-ink-3">
              {t(`${k}.disclaimer`)}
            </p>
          </div>
        </section>

        <div className="mt-20">
          <PostCtaSection
            locale={locale}
            title={t(`${k}.ctaTitle`)}
            description={t(`${k}.ctaDescription`)}
            primaryCta={t(`${k}.ctaPrimary`)}
            secondaryCta={t(`${k}.ctaSecondary`)}
          />
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
