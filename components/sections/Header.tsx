"use client";

import { CTAButton } from "@/components/ui/cta-button";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

/* Hallmark · nav: N12 banner + retracting bar · design-system: design.md v2
 *
 * Previous build was N5 floating pill; rotated per the diversification rule.
 * N12 earns its place rather than being decoration: the banner carries a live
 * availability line, which is genuine trust content for a firm with no client
 * logos — it says someone is home and answering. One line, one dismiss, and the
 * top tier is never a second row of nav links.
 *
 * Scroll down past the fold and the header translates up by --banner-h so the
 * bar docks clean; scroll up and it returns. Dismiss zeroes --banner-h on the
 * root so scroll-padding reflows with no leftover gap. */

const SECTIONS = [
  "portfolio",
  "process",
  "services",
  "about-us",
  "blog",
] as const;

export function Header() {
  const t = useTranslations("header");
  const pathname = usePathname();

  const [activeSection, setActiveSection] = useState<string>("");
  const [compact, setCompact] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => setMenuOpen(false), [pathname]);

  const isBlogPage = pathname?.includes("/blog");
  const localePrefix = pathname?.startsWith("/en") ? "/en" : "/id";

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 48) setCompact(false);
      else if (y > lastY.current) setCompact(true);
      else setCompact(false);
      lastY.current = y;

      if (isBlogPage) return;
      const probe = y + 140;
      let current = "";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (
          el &&
          probe >= el.offsetTop &&
          probe < el.offsetTop + el.offsetHeight
        ) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isBlogPage]);

  const dismiss = () => {
    document.documentElement.style.setProperty("--banner-h", "0px");
    setDismissed(true);
  };

  const hrefFor = (id: string) =>
    isBlogPage ? `${localePrefix}#${id}` : `#${id}`;

  const links = [
    { id: "portfolio", label: t("portfolio") },
    { id: "process", label: t("process") },
    { id: "services", label: t("services") },
    { id: "about-us", label: t("aboutUs") },
  ];

  const goToContact = () => {
    if (isBlogPage) window.location.href = `${localePrefix}#contact`;
    else
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out"
      style={{
        transform:
          compact && !dismissed
            ? "translateY(calc(var(--banner-h) * -1))"
            : "none",
      }}
    >
      {!dismissed && (
        <div
          className="flex items-center justify-center gap-3 bg-lime-green px-4"
          style={{ height: "var(--banner-h)" }}
        >
          {/* A fact, not a slogan. An availability claim ("taking projects for
           * Q1") would be inventing something about the business; the contact
           * channel is verifiable and does the same trust job. Swap the
           * `header.banner` string for a real availability line when you have
           * one. */}
          <p
            className="truncate font-mono text-xs uppercase tracking-[0.1em]"
            style={{ color: "var(--color-accent-ink)" }}
          >
            {t("banner")}{" "}
            <a
              href="mailto:hello@arktik.id"
              className="underline underline-offset-2"
            >
              {t("bannerLink")}
            </a>
          </p>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="shrink-0 rounded-full px-1 text-lg leading-none opacity-60 transition-opacity hover:opacity-100"
            style={{ color: "var(--color-accent-ink)" }}
          >
            &times;
          </button>
        </div>
      )}

      <div
        className="border-b border-rule bg-carbon/80 backdrop-blur-xl backdrop-saturate-150"
        style={{ height: "var(--bar-h)" }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-6 lg:px-12">
          <Link href="/" aria-label="Go to homepage" className="shrink-0">
            <Image
              src="/assets/logo.svg"
              alt="arktik"
              width={0}
              height={32}
              className="h-7 w-auto"
            />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {links.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={hrefFor(id)}
                    aria-current={activeSection === id ? "true" : undefined}
                    className={`whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors duration-200 ${
                      activeSection === id
                        ? "text-lime-green"
                        : "text-ink-2 hover:text-ink"
                    }`}
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href={isBlogPage ? `${localePrefix}/blog` : "#blog"}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors duration-200 ${
                    activeSection === "blog" || isBlogPage
                      ? "text-lime-green"
                      : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {t("blog")}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher />
            <CTAButton variant="small" onClick={goToContact}>
              {t("contact")}
            </CTAButton>

            {/* Below lg the Primary nav is hidden, which left five of seven
             * destinations unreachable on every phone and portrait tablet.
             * A disclosure button, not a hover affordance — touch never hovers. */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={t("menu")}
              className="-mr-1 rounded-pill p-2 text-ink-2 transition-colors duration-200 hover:text-ink lg:hidden"
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label={t("menu")}
          className="border-b border-rule bg-carbon/95 backdrop-blur-xl lg:hidden"
        >
          <ul className="mx-auto max-w-7xl px-6 py-2">
            {links.map(({ id, label }) => (
              <li key={id} className="border-b border-rule last:border-b-0">
                <a
                  href={hrefFor(id)}
                  onClick={() => setMenuOpen(false)}
                  aria-current={activeSection === id ? "true" : undefined}
                  className={`block py-4 text-base transition-colors duration-200 ${
                    activeSection === id ? "text-lime-green" : "text-ink-2"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href={isBlogPage ? `${localePrefix}/blog` : "#blog"}
                onClick={() => setMenuOpen(false)}
                className={`block py-4 text-base transition-colors duration-200 ${
                  activeSection === "blog" || isBlogPage
                    ? "text-lime-green"
                    : "text-ink-2"
                }`}
              >
                {t("blog")}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
