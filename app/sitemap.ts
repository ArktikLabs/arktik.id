import { MetadataRoute } from "next";
import {
  getCategories,
  getBlogPosts,
  getPillarPages,
  getCaseStudies,
} from "@/lib/services/contentful";
import { getAllShowcases } from "@/lib/data/showcases";
import { localeUrl } from "@/lib/seo/schema";

/* The previous sitemap was five hardcoded entries: the homepage plus four
 * FRAGMENT urls (/#services, /#why-arktik, /#works, /#contact). Fragments are
 * not separate URLs — Google discards everything after "#" — so it listed the
 * homepage five times and nothing else. Every blog post, guide, category, case
 * study and showcase was absent, as was the entire /en locale.
 *
 * This enumerates the real routes in both locales. Each entry carries hreflang
 * alternates INCLUDING a self-reference: Next's `alternates.languages` does not
 * add one automatically, and a hreflang set without a self-referencing entry is
 * ignored wholesale. */

const LOCALES = ["id", "en"] as const;

/** Same shape for every entry: both locales + x-default, self-reference included. */
function languagesFor(path: string) {
  return {
    id: localeUrl("id", path),
    en: localeUrl("en", path),
    "x-default": localeUrl("id", path),
  };
}

function entries(
  path: string,
  lastModified: Date,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: localeUrl(locale, path),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: languagesFor(path) },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes. Section anchors are deliberately absent — they are not URLs.
  const out: MetadataRoute.Sitemap = [
    ...entries("", now, 1, "monthly"),
    ...entries("blog", now, 0.8, "weekly"),
    ...entries("blog/case-studies", now, 0.6, "monthly"),
  ];

  for (const s of getAllShowcases()) {
    out.push(...entries(`showcase/${s.slug}`, now, 0.6, "monthly"));
  }

  /* Contentful is fetched per locale because slugs and availability can differ.
   * A failure here must not take the sitemap down — a partial sitemap still
   * gets the static routes indexed, an exception gets nothing indexed. */
  for (const locale of LOCALES) {
    try {
      const [categories, { posts }, pillars, { caseStudies }] =
        await Promise.all([
          getCategories(locale),
          getBlogPosts({ locale, limit: 1000 }),
          getPillarPages(undefined, locale),
          getCaseStudies({ locale, limit: 1000 }),
        ]);

      const push = (path: string, updated?: string, priority = 0.7) =>
        out.push({
          url: localeUrl(locale, path),
          lastModified: updated ? new Date(updated) : now,
          changeFrequency: "monthly",
          priority,
          alternates: { languages: languagesFor(path) },
        });

      for (const c of categories) {
        push(`blog/${c.fields.slug}`, c.sys.updatedAt, 0.7);
      }
      for (const p of posts) {
        const cat = p.fields.category?.fields?.slug;
        if (cat) push(`blog/${cat}/${p.fields.slug}`, p.sys.updatedAt, 0.7);
      }
      for (const p of pillars) {
        const cat = p.fields.category?.fields?.slug;
        if (cat)
          push(
            `blog/${cat}/guides/${p.fields.slug}`,
            p.sys.updatedAt,
            0.9, // pillars are the cluster's entry points
          );
      }
      for (const c of caseStudies) {
        push(`blog/case-studies/${c.fields.slug}`, c.sys.updatedAt, 0.6);
      }
    } catch (err) {
      console.error(`sitemap: Contentful fetch failed for ${locale}`, err);
    }
  }

  // Guard against a slug colliding across content types.
  const seen = new Set<string>();
  return out.filter((e) => !seen.has(e.url) && seen.add(e.url));
}
