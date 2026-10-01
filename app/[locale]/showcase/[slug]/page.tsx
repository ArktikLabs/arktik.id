import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { alternatesFor, socialMeta } from "@/lib/seo/schema";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getShowcaseBySlug, getAllShowcases, isConcept } from "@/lib/data/showcases";
import { ShowcaseContainer } from "@/components/ShowcaseContainer";

interface ShowcaseDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

/* This route had no generateMetadata at all, so it inherited the layout's
 * title, description and canonical — three showcase pages all claiming to be
 * the homepage, with identical titles. */
export async function generateMetadata({
  params,
}: ShowcaseDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const showcase = getShowcaseBySlug(slug);
  if (!showcase) return {};
  const t = await getTranslations({ locale, namespace: "showcase" });
  const title = isConcept(showcase)
    ? `${showcase.title} (${t("concept.metaPrefix")}) | Arktik`
    : `${showcase.title} | Arktik`;
  /* showcases.ts holds one English description; the Indonesian page used to
   * serve it as its meta description. Per-locale copy lives in messages. */
  const description = t.has(`items.${slug}.description`)
    ? t(`items.${slug}.description`)
    : showcase.description;
  return {
    title,
    description,
    alternates: alternatesFor(locale, `showcase/${slug}`),
    ...socialMeta({
      locale,
      path: `showcase/${slug}`,
      title,
      description,
      /* Generated work card (title + screenshot), lib/seo/og-cards.ts. */
    }),
  };
}

export async function generateStaticParams() {
  const showcases = getAllShowcases();
  return showcases.map((showcase) => ({
    slug: showcase.slug,
  }));
}

export default async function ShowcaseDetailPage({
  params,
}: ShowcaseDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const showcase = getShowcaseBySlug(slug);

  if (!showcase) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "showcase" });
  const has = t.has(`items.${slug}.summary`);
  const built = has ? (t.raw(`items.${slug}.built`) as string[]) : [];
  const stack = has ? (t.raw(`items.${slug}.stack`) as string[]) : [];
  const others = getAllShowcases().filter((s) => s.slug !== slug);

  /* The viewer is an iframe of the client's site, which Google credits to the
   * client, not to this page. Without this write-up the page had ~15 words of
   * its own text. Server-rendered so it is in the HTML. */
  return (
    <ShowcaseContainer
      title={showcase.title}
      link={showcase.link}
      concept={isConcept(showcase)}
    >
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {has && (
              <>
                <h2 className="font-heading text-3xl font-bold">
                  {t("details.aboutTitle")}
                </h2>
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-2">
                  {t(`items.${slug}.summary`)}
                </p>
                <h3 className="mt-10 font-heading text-xl font-bold">
                  {t("details.builtTitle")}
                </h3>
                <ul className="mt-4 max-w-3xl list-outside list-disc space-y-2 pl-6 text-ink-2 marker:text-lime-green">
                  {built.map((b) => (
                    <li key={b} className="leading-relaxed">
                      {b}
                    </li>
                  ))}
                </ul>
                <h3 className="mt-10 font-heading text-xl font-bold">
                  {t("details.stackTitle")}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {stack.map((s) => (
                    <li
                      key={s}
                      className="label-mono rounded-pill border border-rule px-3 py-1 text-ink"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="space-y-10">
            <div className="rounded-card border border-rule bg-paper-2 p-6">
              <h2 className="font-heading text-xl font-bold">
                {t("details.ctaTitle")}
              </h2>
              <p className="mt-3 leading-relaxed text-ink-2">
                {t("details.ctaText")}
              </p>
              <Link
                href="/#contact"
                className="mt-5 inline-flex items-center rounded-pill bg-lime-green px-5 py-2.5 text-sm font-semibold text-carbon transition-colors duration-200 hover:bg-lime-green/90"
              >
                {t("details.ctaButton")}
              </Link>
            </div>

            <nav aria-labelledby="more-work">
              <h2 id="more-work" className="font-heading text-xl font-bold">
                {t("details.moreTitle")}
              </h2>
              <ul className="mt-4 divide-y divide-rule border-y border-rule">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/showcase/${o.slug}`}
                      className="flex items-center justify-between gap-3 py-3 text-ink transition-colors hover:text-lime-green"
                    >
                      <span className="font-medium">{o.title}</span>
                      {isConcept(o) && (
                        <span className="label-mono shrink-0 text-ink-3">
                          {t("concept.badge")}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>
    </ShowcaseContainer>
  );
}
