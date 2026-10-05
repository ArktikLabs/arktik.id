/* 404 inside the site: same Header + FooterSection as every page, so a wrong link still lands somewhere with the
 * menu (Aan 2026-10-03). Reached by notFound() in any [locale] route and by unknown paths via [...rest]/page.tsx.
 * Next renders not-found without params, so the locale comes from next-intl's request config (middleware sets it). */
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/sections/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { Link } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: t("metaTitle"), robots: { index: false, follow: true } };
}

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const locale = await getLocale();
  const home = locale === "en" ? "/en/" : "/";

  const links = [
    { href: `${home}#products`, label: t("products") },
    { href: `${home}#services`, label: t("services") },
    { href: `${home}#portfolio`, label: t("portfolio") },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <main id="main" className="mx-auto max-w-7xl px-6 pb-24 pt-40 lg:px-12 lg:pt-48">
        <div className="max-w-2xl">
          <p className="label-mono">{t("label")}</p>
          <div className="section-head__rule mt-4" aria-hidden="true" />
          <h1 className="mt-6 font-heading text-4xl font-bold text-ink lg:text-6xl">{t("title")}</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-2">{t("body")}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={home}
              className="whitespace-nowrap rounded-full bg-lime-green px-6 py-3 font-medium text-ink-invert transition-colors duration-200 hover:bg-lime-green/90"
            >
              {t("home")}
            </a>
            <a
              href={`${home}#contact`}
              className="whitespace-nowrap rounded-full border border-rule-strong px-6 py-3 font-medium text-ink transition-colors duration-200 hover:border-lime-green hover:text-lime-green"
            >
              {t("contact")}
            </a>
          </div>

          <p className="label-mono mt-14">{t("linksLabel")}</p>
          <ul className="mt-3 border-t border-rule">
            {links.map((l) => (
              <li key={l.href} className="border-b border-rule">
                <a
                  href={l.href}
                  className="flex items-center justify-between py-4 text-ink-2 transition-colors duration-200 hover:text-lime-green"
                >
                  {l.label}
                  <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
            <li className="border-b border-rule">
              <Link
                href="/blog"
                className="flex items-center justify-between py-4 text-ink-2 transition-colors duration-200 hover:text-lime-green"
              >
                {t("blog")}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          </ul>
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
