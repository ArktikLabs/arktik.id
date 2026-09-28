"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

/* Cookie consent for Google Analytics / ads measurement (GTM-WDNKG95C), Google Consent Mode v2.
 *
 * The default (everything denied) is set by an inline script in the layout BEFORE GTM loads, so no analytics or ad
 * cookie is written until the visitor presses Accept. The choice is kept in localStorage (not a cookie) for 6 months;
 * "Cookie settings" in the footer reopens the banner via the `arktik:consent` window event. */

const KEY = "arktik_consent";
const MAX_AGE = 1000 * 60 * 60 * 24 * 182;
type Choice = "granted" | "denied";

function update(choice: Choice) {
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  const g =
    w.gtag ??
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      (w.dataLayer = w.dataLayer || []).push(arguments);
    };
  g("consent", "update", {
    analytics_storage: choice,
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  });
  (w.dataLayer = w.dataLayer || []).push({ event: `consent_${choice}` });
}

export function stored(): Choice | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const { v, at } = JSON.parse(raw) as { v: Choice; at: number };
    return Date.now() - at < MAX_AGE && (v === "granted" || v === "denied") ? v : null;
  } catch {
    return null;
  }
}

export function ConsentBanner() {
  const t = useTranslations("consent");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!stored()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener("arktik:consent", reopen);
    return () => window.removeEventListener("arktik:consent", reopen);
  }, []);

  const choose = (v: Choice) => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ v, at: Date.now() }));
    } catch {
      // storage blocked: the choice still applies to this page view
    }
    update(v);
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("manage")}
      className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-3xl rounded-2xl border border-rule-strong bg-carbon/95 p-4 shadow-2xl backdrop-blur sm:inset-x-6 sm:bottom-6 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <p className="flex-1 text-sm leading-relaxed text-ink-2">
          {t("text")}{" "}
          <Link href="/privacy" className="whitespace-nowrap text-ink underline underline-offset-4 hover:text-lime-green">
            {t("more")}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          {/* Equal weight for both buttons: declining must be as easy as accepting. */}
          <button
            type="button"
            onClick={() => choose("denied")}
            className="flex-1 whitespace-nowrap rounded-full border border-rule-strong px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-lime-green hover:text-lime-green sm:flex-none"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="flex-1 whitespace-nowrap rounded-full bg-lime-green px-5 py-2 text-sm font-medium text-ink-invert transition-colors hover:bg-lime-green/90 sm:flex-none"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConsentSettingsLink({ className }: { className?: string }) {
  const t = useTranslations("consent");
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("arktik:consent"))}
      className={className}
    >
      {t("manage")}
    </button>
  );
}
