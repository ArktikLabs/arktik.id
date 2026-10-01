/* Services hub: one row per service page, same spec-sheet rows as the home
 * Services section. */
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Header } from "@/components/sections/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { alternatesFor, breadcrumbs, graph, socialMeta } from "@/lib/seo/schema";
import { getAllServices } from "@/lib/data/services";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicePage" });
  const title = t("hub.metaTitle");
  const description = t("hub.metaDescription");
  return {
    title,
    description,
    alternates: alternatesFor(locale, "services"),
    ...socialMeta({ locale, path: "services", title, description }),
  };
}

export default async function ServicesHub({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "servicePage" });
  const home = locale === "en" ? "/en" : "/";

  return (
    <div className="min-h-screen bg-paper text-ink">
      <JsonLd
        data={graph(
          breadcrumbs(locale, [{ name: "Arktik", path: "" }, { name: t("breadcrumb") }]),
        )}
      />
      <Header />
      <main
        id="main"
        className="mx-auto max-w-7xl px-6 pb-16 pt-[calc(var(--banner-h)+var(--bar-h)+2.5rem)] lg:px-12"
      >
        <Breadcrumb
          items={[{ label: "Arktik", href: home }, { label: t("breadcrumb"), isActive: true }]}
          className="mb-10"
        />
        <section className="max-w-4xl">
          <h1 className="text-balance font-heading text-4xl font-bold leading-display md:text-6xl">
            {t("hub.title")}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-2 md:text-xl">{t("hub.intro")}</p>
        </section>

        <ul className="mt-16 border-b border-rule">
          {getAllServices().map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group grid gap-4 border-t border-rule py-8 transition-colors duration-200 hover:border-rule-strong md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10"
              >
                <h2 className="font-heading text-xl font-semibold text-ink group-hover:text-lime-green md:text-2xl">
                  {t(`items.${s.key}.name`)}
                </h2>
                <div>
                  <p className="leading-relaxed text-ink-2">{t(`items.${s.key}.summary`)}</p>
                  <span className="label-mono mt-4 inline-flex items-center gap-1 text-ink">
                    {t("hub.more")} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-16 grid gap-4 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
          <h2 className="font-heading text-xl font-semibold text-ink md:text-2xl">{t("hub.operationsTitle")}</h2>
          <p className="max-w-measure leading-relaxed text-ink-2">{t("hub.operations")}</p>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
