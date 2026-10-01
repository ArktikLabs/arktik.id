/* Service page. Same Workbench family as the product pages: carbon/lime
 * tokens, section-head rules, no new visual language. Copy is in
 * messages servicePage.items.<key>; process and promises reuse the copy that
 * already runs on the home page, so every claim here exists on the site. */
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Header } from "@/components/sections/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { alternatesFor, breadcrumbs, graph, localeUrl, socialMeta } from "@/lib/seo/schema";
import { getAllServices, getServiceBySlug } from "@/lib/data/services";
import { getProductBySlug } from "@/lib/data/products";
import { getShowcaseBySlug, isConcept } from "@/lib/data/showcases";

interface ServicePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllServices().map((s) => ({ slug: s.slug }));
}

const STAGES = ["discovery", "design", "build", "handover"] as const;
const PROMISES = ["scope", "ownership", "access"] as const;

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  const t = await getTranslations({ locale, namespace: "servicePage" });
  const title = t(`items.${service.key}.metaTitle`);
  const description = t(`items.${service.key}.metaDescription`);
  return {
    title,
    description,
    alternates: alternatesFor(locale, `services/${slug}`),
    ...socialMeta({ locale, path: `services/${slug}`, title, description }),
  };
}

type Built = { title: string; description: string };
type Faq = { q: string; a: string };

export default async function ServicePage({ params }: ServicePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const t = await getTranslations({ locale, namespace: "servicePage" });
  const tp = await getTranslations({ locale, namespace: "process" });
  const tc = await getTranslations({ locale, namespace: "commitments" });
  const tprod = await getTranslations({ locale, namespace: "products" });
  const ts = await getTranslations({ locale, namespace: "showcase" });
  const k = `items.${service.key}`;
  const intro = t.raw(`${k}.intro`) as string[];
  const built = t.raw(`${k}.built`) as Built[];
  const faq = t.raw(`${k}.faq`) as Faq[];
  const home = locale === "en" ? "/en" : "/";

  const examples = service.examples.flatMap((e) => {
    if (e.type === "product") {
      const p = getProductBySlug(e.slug);
      if (!p) return [];
      return [{
        key: `p-${p.slug}`,
        href: `/products/${p.slug}`,
        title: p.name,
        text: tprod(`items.${p.key}.tagline`),
        img: p.cover.src,
        badge: t("labels.productBadge"),
      }];
    }
    const s = getShowcaseBySlug(e.slug);
    if (!s) return [];
    return [{
      key: `s-${s.slug}`,
      href: `/showcase/${s.slug}`,
      title: s.title,
      text: ts.has(`items.${s.slug}.description`) ? ts(`items.${s.slug}.description`) : s.description,
      img: s.thumbnail ?? "",
      badge: isConcept(s) ? t("labels.conceptBadge") : null,
    }];
  });

  const others = getAllServices().filter((s) => s.slug !== slug);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <JsonLd
        data={graph(
          {
            "@type": "Service",
            "@id": `${localeUrl(locale, `services/${slug}`)}#service`,
            name: t(`${k}.name`),
            description: t(`${k}.metaDescription`),
            serviceType: t(`${k}.name`),
            provider: { "@id": "https://www.arktik.id/#organization" },
            areaServed: { "@type": "Country", name: "Indonesia" },
            url: localeUrl(locale, `services/${slug}`),
          },
          {
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
          breadcrumbs(locale, [
            { name: "Arktik", path: "" },
            { name: t("breadcrumb"), path: "services" },
            { name: t(`${k}.name`) },
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
            { label: t("breadcrumb"), href: `${home === "/" ? "" : home}/services` },
            { label: t(`${k}.name`), isActive: true },
          ]}
          className="mb-10"
        />

        {/* Hero */}
        <section className="max-w-4xl">
          <p className="label-mono mb-4">{t(`${k}.name`)}</p>
          <h1 className="text-balance font-heading text-4xl font-bold leading-display md:text-6xl">
            {t(`${k}.title`)}
          </h1>
          {intro.map((p, i) => (
            <p
              key={i}
              className={`mt-6 max-w-3xl leading-relaxed ${i === 0 ? "text-xl text-ink md:text-2xl" : "text-base text-ink-2 md:text-lg"}`}
            >
              {p}
            </p>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill bg-lime-green px-6 py-3 text-sm font-semibold text-carbon transition-colors duration-200 hover:bg-lime-green/90"
            >
              {t("labels.ctaPrimary")}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* What we build */}
        <section className="mt-24">
          <div className="section-head mb-10">
            <h2 className="font-heading text-3xl font-bold lg:text-4xl">{t("labels.builtTitle")}</h2>
            <span className="section-head__rule" aria-hidden="true" />
          </div>
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {built.map((b) => (
              <li key={b.title} className="step">
                <h3 className="font-heading text-lg font-semibold text-ink">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">{b.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Examples */}
        {examples.length > 0 && (
          <section className="mt-24">
            <div className="section-head mb-4">
              <h2 className="font-heading text-3xl font-bold lg:text-4xl">{t("labels.examplesTitle")}</h2>
              <span className="section-head__rule" aria-hidden="true" />
            </div>
            {t(`${k}.examplesNote`) && (
              <p className="mb-8 max-w-3xl text-ink-2">{t(`${k}.examplesNote`)}</p>
            )}
            <ul
              className={`grid gap-6 sm:grid-cols-2 ${examples.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
            >
              {examples.map((e) => (
                <li key={e.key}>
                  <Link href={e.href} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-rule bg-paper-2">
                      {e.img && (
                        <Image
                          src={e.img}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, 400px"
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      )}
                      {e.badge && (
                        <span className="label-mono absolute left-3 top-3 rounded-pill bg-paper/80 px-2.5 py-1 text-ink backdrop-blur">
                          {e.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 flex items-center gap-2 font-heading text-lg font-semibold text-ink group-hover:text-lime-green">
                      {e.title}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{e.text}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Process */}
        <section className="mt-24">
          <div className="section-head mb-4">
            <h2 className="font-heading text-3xl font-bold lg:text-4xl">{t("labels.processTitle")}</h2>
            <span className="section-head__rule" aria-hidden="true" />
          </div>
          <p className="mb-10 max-w-3xl text-ink-2">{t("labels.processIntro")}</p>
          <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((s, i) => (
              <li key={s} className="step">
                <p className="label-mono">0{i + 1} · {tp(`stages.${s}.duration`)}</p>
                <h3 className="mt-2 font-heading text-lg font-semibold text-ink">{tp(`stages.${s}.title`)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">{tp(`stages.${s}.description`)}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Promises */}
        <section className="mt-24 grid gap-8 border-t border-rule pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <h2 className="font-heading text-2xl font-bold">{t("labels.promisesTitle")}</h2>
          <dl className="grid gap-6">
            {PROMISES.map((p) => (
              <div key={p}>
                <dt className="font-heading text-lg font-semibold text-ink">{tc(`items.${p}.title`)}</dt>
                <dd className="mt-1 max-w-measure leading-relaxed text-ink-2">{tc(`items.${p}.description`)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* FAQ */}
        <section className="mt-24 grid gap-8 border-t border-rule pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <h2 className="font-heading text-2xl font-bold">{t("labels.faqTitle")}</h2>
          <div className="divide-y divide-rule border-y border-rule">
            {faq.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-heading text-lg font-semibold text-ink">
                  {f.q}
                  <span aria-hidden="true" className="mt-1 text-lime-green transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-measure leading-relaxed text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 rounded-card border border-rule bg-paper-2 p-6 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-heading text-2xl font-bold text-ink md:text-3xl">{t(`${k}.ctaTitle`)}</h2>
              <p className="mt-3 text-base text-ink-2 md:text-lg">{t(`${k}.ctaDescription`)}</p>
            </div>
            <Link
              href="/#contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-lime-green px-6 py-3 text-sm font-semibold text-carbon transition-colors duration-200 hover:bg-lime-green/90"
            >
              {t("labels.ctaPrimary")}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Other services */}
        <nav aria-labelledby="other-services" className="mt-16">
          <h2 id="other-services" className="label-mono mb-4">{t("labels.ctaSecondary")}</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/services/${o.slug}`}
                  className="flex items-center justify-between gap-3 border-t border-rule py-4 font-heading font-semibold text-ink transition-colors hover:text-lime-green"
                >
                  {t(`items.${o.key}.name`)}
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>

      <FooterSection />
    </div>
  );
}
