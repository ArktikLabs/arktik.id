/* JSON-LD builders.
 *
 * Rule inherited from design.md's honest-copy clause: schema may only assert
 * facts the page actually shows or the repo actually holds. No invented ratings,
 * counts, addresses or founding dates — a fabricated property is worse in
 * structured data than in copy, because a machine repeats it verbatim.
 *
 * Locale routing: `id` is the default and sits at the root, `en` is prefixed.
 * `trailingSlash: true` in next.config, so every URL here ends with a slash to
 * match the canonicals already emitted in layout.tsx. */

export const SITE = "https://www.arktik.id";

export function localeUrl(locale: string, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  const prefix = locale === "en" ? "/en" : "";
  const joined = [prefix, clean].filter(Boolean).join("/");
  return `${SITE}${joined.startsWith("/") ? joined : `/${joined}`}`.replace(
    /\/?$/,
    "/",
  );
}

/* Per-page canonical + hreflang.
 *
 * The root layout set `alternates.canonical` once per locale, and because
 * metadata inherits, EVERY route claimed the locale root as its canonical —
 * so every post, guide, category and case study was telling Google to index
 * the homepage instead of itself. A canonical must always be self-referencing.
 * Call this in each route's generateMetadata with that route's own path. */
export function alternatesFor(locale: string, path = "") {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      id: localeUrl("id", path),
      en: localeUrl("en", path),
      "x-default": localeUrl("id", path),
    },
  };
}

/** The publisher identity. Only fields we can actually stand behind. */
export function organization(locale: string, description: string) {
  return {
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: "Arktik",
    url: localeUrl(locale),
    logo: {
      "@type": "ImageObject",
      url: `${SITE}/assets/logo.png`,
    },
    description,
    email: "hello@arktik.id",
    telephone: "+62-851-1769-7889",
    /* areaServed, not address: the studio publishes no street address and
     * inventing one would break both the honest-copy rule and Google's
     * requirement that markup match reality. */
    areaServed: { "@type": "Country", name: "Indonesia" },
    sameAs: ["https://x.com/arktiklabs"],
  };
}

export function website(locale: string, name: string, description: string) {
  return {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: localeUrl(locale),
    name,
    description,
    inLanguage: locale === "en" ? "en-US" : "id-ID",
    publisher: { "@id": `${SITE}/#organization` },
  };
}

export type Crumb = { name: string; path?: string };

/** Mirrors the visible <Breadcrumb>. Only emit where those crumbs render. */
export function breadcrumbs(locale: string, crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: localeUrl(locale, c.path) } : {}),
    })),
  };
}

export function article({
  locale,
  path,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
}: {
  locale: string;
  path: string;
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}) {
  const url = localeUrl(locale, path);
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline,
    ...(description ? { description } : {}),
    /* Article rich results need an image. Falling back to the locale OG card is
     * honest — it is a real image that represents this article — and beats
     * omitting the property. */
    image: [image || `${SITE}/assets/og-${locale === "en" ? "en" : "id"}.webp`],
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: authorName
      ? { "@type": "Person", name: authorName }
      : { "@id": `${SITE}/#organization` },
    publisher: { "@id": `${SITE}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: locale === "en" ? "en-US" : "id-ID",
  };
}

/** Wraps nodes in a single @graph so one script tag carries the page. */
export function graph(...nodes: unknown[]) {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}
