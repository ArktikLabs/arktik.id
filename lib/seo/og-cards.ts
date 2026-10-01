/* Per-page Open Graph cards.
 *
 * Every page used to share the home card (or nothing), so a shared article,
 * guide or service page previewed as "Software kustom, tanpa black box".
 * These cards are rendered at build time by app/og/[locale]/[...path] in the
 * same typographic system as the home cards (carbon ground, Archivo 700, bone
 * ink, one lime accent). Products and showcases keep their screenshots. */
import {
  getBlogPosts,
  getCategories,
  getPillarPages,
} from "@/lib/content";
import { getAllServices } from "@/lib/data/services";

export type OgCard = { label: string; title: string; subtitle?: string };

const L = (locale: string, id: string, en: string) => (locale === "en" ? en : id);

/** URL of the generated card for a page path ("" = home is not generated). */
export function ogCardUrl(locale: string, path: string) {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return `/og/${locale}/${clean}/`;
}

import id from "@/messages/id.json";
import en from "@/messages/en.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messages = (locale: string): Record<string, any> => (locale === "en" ? en : id);

/** Every page that gets a generated card, keyed by path, per locale. */
export async function ogCards(locale: string): Promise<Map<string, OgCard>> {
  const m = messages(locale);
  const out = new Map<string, OgCard>();
  const blog = L(locale, "Tulisan", "Writing");

  out.set("blog", { label: "Arktik", title: m.blogPage?.hero?.title ?? blog, subtitle: m.blogPage?.description });
  out.set("privacy", {
    label: "Arktik",
    title: L(locale, "Kebijakan privasi", "Privacy policy"),
    subtitle: L(locale, "Data apa yang dikumpulkan, untuk apa, dan hak Anda.", "What we collect, why, and your rights."),
  });
  out.set("blog/case-studies", { label: blog, title: L(locale, "Studi kasus", "Case studies") });

  for (const c of getCategories(locale)) {
    if (c.slug === "case-studies") continue;
    out.set(`blog/${c.slug}`, { label: blog, title: c.title, subtitle: c.description });
  }
  for (const p of getBlogPosts({ locale, limit: 1000 }).posts) {
    if (!p.category.slug) continue;
    out.set(`blog/${p.category.slug}/${p.slug}`, { label: p.category.title, title: p.title });
  }
  for (const p of getPillarPages(undefined, locale)) {
    if (!p.category.slug) continue;
    out.set(`blog/${p.category.slug}/guides/${p.slug}`, {
      label: `${L(locale, "Panduan", "Guide")} · ${p.category.title}`,
      title: p.title,
    });
  }

  const sp = m.servicePage;
  if (sp) {
    out.set("services", { label: sp.breadcrumb, title: sp.hub.title, subtitle: sp.hub.intro });
    for (const s of getAllServices()) {
      const it = sp.items[s.key];
      out.set(`services/${s.slug}`, { label: it.name, title: it.title, subtitle: it.summary });
    }
  }
  return out;
}
