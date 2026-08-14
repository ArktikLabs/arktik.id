"use client";

import { FlipWords } from "@/components/ui/flip-words";
import { CTAButton } from "@/components/ui/cta-button";
import { useTranslations } from "next-intl";

/* Hallmark · typographic hero · macrostructure: Bento Grid · design.md v2
 *
 * The InteractiveDemo is gone from this hero. It was hand-built and genuinely
 * distinctive, but it sold the wrong thing: its tagline promised "from chat to
 * app in seconds" on the same page as a Process section that says discovery
 * takes weeks and scope is fixed at each gate. The fast claim undercut the
 * credible one, and for a firm with no portfolio "seconds" reads cheap. It was
 * also hidden below 1024px — so the hero's proof slot was empty for most
 * mobile traffic — and blank until JS mounted even on desktop.
 *
 * The component still exists at components/ui/interactive-demo.tsx, unreferenced.
 * It is worth parking on its own route rather than deleting.
 *
 * What replaces it is nothing, deliberately: the display is set large enough
 * (up to 5.5rem at 0.95 leading) to hold the fold alone, and the capability rule
 * at the bottom adds substance that works identically at every width. Proof now
 * starts one scroll down, in the bento, where it is visible to everyone.
 *
 * FlipWords is back, with its clipping bug fixed at the source (see
 * ui/flip-words.tsx — it was reserving width in `ch`, which under-measures a
 * display face badly). It now cycles the failure modes the rest of the page
 * argues against, so the motion carries the argument rather than decorating it. */

const CAPABILITIES = [
  "customDevelopment",
  "consulting",
  "aiAutomation",
  "design",
] as const;

export function HeroSection() {
  const t = useTranslations("hero");
  const tWorks = useTranslations("works");
  const tHeader = useTranslations("header");
  const tServices = useTranslations("services");

  const words = Object.values(t.raw("flipWords") as Record<string, string>);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative isolate overflow-hidden border-b border-rule">
      {/* One quiet accent wash. Clipped by the section, so it never scrolls. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "var(--color-accent)" }}
      />

      <div className="mx-auto max-w-7xl px-6 pb-44 pt-32 lg:px-12 lg:pb-48 lg:pt-36">
        <div className="reveal">
          {/* Measure capped in ch, not px — a display line running the full
            * 1280px would be unreadable however large the type is. */}
          <h1
            className="max-w-[26ch] font-heading font-bold text-ink"
            style={{ fontSize: "var(--text-display)", lineHeight: 0.95 }}
          >
            {/* Two explicit lines: the claim, then the flip landing mid-line so
              * it can never orphan onto a third line the way it did before. */}
            <span className="block">{t("headlineLead")}</span>
            <span className="block">
              {t("headlineConnector")}{" "}
              <FlipWords words={words} className="text-lime-green" />
            </span>
          </h1>

          <div className="mt-10 flex flex-col gap-10 lg:mt-14 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-xl text-lg leading-relaxed text-ink-2 lg:text-xl">
              {t("description")}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <CTAButton variant="small" onClick={() => scrollTo("contact")}>
                {tWorks("cta.buttonText")}
              </CTAButton>
              <CTAButton
                variant="outline"
                className="px-5 py-2 text-sm sm:text-base"
                onClick={() => scrollTo("portfolio")}
              >
                {tHeader("portfolio")}
              </CTAButton>
            </div>
          </div>
        </div>

        {/* Capability rule — substance in the fold that costs no JS and reads
          * the same on a 320px phone as on a 1440px display. */}
        <ul className="reveal reveal-late mt-16 grid gap-x-8 gap-y-3 border-t border-rule pt-6 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {CAPABILITIES.map((key) => (
            <li key={key} className="label-mono">
              {tServices(`${key}.title`)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
