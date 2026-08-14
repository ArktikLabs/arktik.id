import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, KeyRound, MessageSquare } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { getAllShowcases } from "@/lib/data/showcases";

/* Hallmark · macrostructure: 01 Bento Grid · design-system: design.md v2
 *
 * Was a 3/2 span grid of work alone. The problem it had wasn't the grid — it
 * was that a new firm with three showcases cannot fill a section with work and
 * have it read as substantial. So the bento mixes registers: the work tiles sit
 * alongside the commitments, which is the trust content that doesn't depend on
 * having a long client list. Density comes from size variation, not from
 * padding out a uniform card row. */

const COMMITMENTS = [
  { key: "scope", Icon: ShieldCheck },
  { key: "ownership", Icon: KeyRound },
  { key: "access", Icon: MessageSquare },
] as const;

export function WorksSection() {
  const t = useTranslations("works");
  const tc = useTranslations("commitments");
  const locale = useLocale();
  const showcases = getAllShowcases();

  const href = (slug: string) =>
    locale === "id" ? `/showcase/${slug}` : `/${locale}/showcase/${slug}`;

  // First showcase gets the wide tile; the rest sit narrow beside it.
  const [lead, ...rest] = showcases;

  return (
    <section
      id="portfolio"
      className="mx-auto max-w-7xl px-6 pb-16 pt-24 lg:px-12 lg:pb-20 lg:pt-28"
    >
      <div className="section-head mb-4">
        <h2 className="font-heading text-3xl font-bold lg:text-4xl">
          {t("title")}
        </h2>
        <span className="section-head__rule" aria-hidden="true" />
      </div>

      {/* Three finished projects cannot prove retention. They can prove the
        * commitments — scoped, delivered, handed over, no lock-in — which turns
        * a thin portfolio into evidence FOR the pitch instead of against it. */}
      <p className="mb-10 max-w-2xl text-lg leading-relaxed text-ink-2">
        {t("subtitle")}
      </p>

      <div className="bento">
        {lead && (
          <Link
            href={href(lead.slug)}
            className="tile group cell-4 cell-tall isolate min-h-[22rem] overflow-hidden !p-0"
          >
            <Image
              src={lead.thumbnail || "/assets/portofolio/default.webp"}
              alt={lead.title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="-z-10 object-cover object-center"
            />
            <div aria-hidden="true" className="img-scrim absolute inset-0 -z-10" />

            <div className="flex items-start justify-between gap-3 p-6">
              <span className="label-mono flex items-center gap-2 text-ink">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-lime-green"
                  aria-hidden="true"
                />
                {t("title")}
              </span>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-lime-green opacity-70 transition-opacity duration-200 group-hover:opacity-100"
                aria-hidden="true"
              />
            </div>

            <h3 className="p-6 font-heading text-2xl font-bold text-ink md:text-3xl">
              {lead.title}
            </h3>
          </Link>
        )}

        {/* Commitments — the trust block that doesn't need a client list. */}
        <div className="tile cell-2 cell-tall">
          <h3 className="font-heading text-xl font-semibold text-ink">
            {tc("title")}
          </h3>
          <dl className="flex flex-col gap-5">
            {COMMITMENTS.map(({ key, Icon }) => (
              <div key={key} className="flex items-start gap-3">
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-lime-green"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-sm font-semibold text-ink">
                    {tc(`items.${key}.title`)}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-2">
                    {tc(`items.${key}.description`)}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {rest.map((showcase) => (
          <Link
            key={showcase.slug}
            href={href(showcase.slug)}
            className="tile group cell-3 isolate min-h-[16rem] overflow-hidden !p-0"
          >
            <Image
              src={showcase.thumbnail || "/assets/portofolio/default.webp"}
              alt={showcase.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="-z-10 object-cover object-center"
            />
            <div aria-hidden="true" className="img-scrim absolute inset-0 -z-10" />
            <span className="label-mono p-5 text-ink">{t("title")}</span>
            <h3 className="p-5 font-heading text-xl font-bold text-ink">
              {showcase.title}
            </h3>
          </Link>
        ))}

        {/* Accent tile closes the grid with the page's primary action. */}
        <Link
          href="#contact"
          className="tile tile--accent cell-3 group min-h-[16rem]"
        >
          <h3 className="font-heading text-2xl font-bold md:text-3xl">
            {t("cta.title")}
          </h3>
          <p className="text-sm leading-relaxed opacity-80">
            {t("cta.description")}
          </p>
          <span className="inline-flex items-center gap-2 font-medium">
            {t("cta.buttonText")}
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </Link>
      </div>
    </section>
  );
}
