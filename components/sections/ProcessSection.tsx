import { useTranslations } from "next-intl";

/* Hallmark · F4 step sequence · design-system: design.md v2
 *
 * This section exists because of a specific constraint: a new firm with a thin
 * portfolio and founders who stay anonymous cannot use the three normal trust
 * levers (client logos, named people, scale numbers). Process is the one that's
 * left, and it's the strongest of them for a buyer who has never heard of you —
 * it converts "who are you?" into "here is exactly what happens".
 *
 * Numbering is legitimate here and nowhere else on the page: the stages are
 * genuinely ordinal, so the eyebrow ban doesn't apply (see globals.css .step__n).
 *
 * Durations live in the message files, not in a prop — they are user-facing copy
 * and must translate. Passing them from the page rendered "FROM 6 WEEKS" on the
 * Indonesian route. Leave a stage's `duration` empty to fall back to the honest
 * "to confirm" placeholder rather than inventing a timeline. */

const STAGES = ["discovery", "design", "build", "handover"] as const;

export function ProcessSection() {
  const t = useTranslations("process");

  return (
    <section
      id="process"
      className="mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-12 lg:pb-24 lg:pt-28"
    >
      <div className="section-head mb-4">
        <h2 className="font-heading text-3xl font-bold lg:text-4xl">
          {t("title")}
        </h2>
        <span className="section-head__rule" aria-hidden="true" />
      </div>

      <p className="mb-12 max-w-2xl text-lg leading-relaxed text-ink-2">
        {t("description")}
      </p>

      <ol className="steps">
        {STAGES.map((stage, i) => {
          const duration = t(`stages.${stage}.duration`).trim();
          return (
            <li key={stage} className="step">
              <span className="step__n">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-heading text-xl font-semibold text-ink">
                {t(`stages.${stage}.title`)}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                {t(`stages.${stage}.description`)}
              </p>
              <p className="label-mono mt-4">
                {t("durationLabel")} ·{" "}
                {duration || <span className="text-ink-3/70">— {t("tbd")}</span>}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
