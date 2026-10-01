/* Open Graph card registry: which card every indexable page gets.
 *
 * Strategy (see design.md, "Open Graph cards"):
 *   home          "home" template: the hero headline from messages/*.json
 *   content       posts, guides            -> "article" template
 *   section       blog index, categories,
 *                 services hub + pages,
 *                 privacy                  -> "section" template
 *   work          products, showcases      -> "work" template (title + screenshot)
 * All templates share the site tokens: carbon ground, Archivo 700 display at
 * 0.95 leading / -0.03em, Instrument Sans body, Geist Mono uppercase labels,
 * one lime accent rule, the wordmark. Cards are rendered at build time by
 * app/og/[locale]/[...path]; a page missing here would 404 its og:image, so
 * the sitemap-wide check in the skill must stay green. */
import id from "@/messages/id.json";
import en from "@/messages/en.json";
import { getBlogPosts, getCategories, getPillarPages } from "@/lib/content";
import { getAllServices } from "@/lib/data/services";
import { getAllProducts } from "@/lib/data/products";
import { getAllShowcases, isConcept } from "@/lib/data/showcases";
import { calculateCombinedReadingTime } from "@/lib/utils/reading-time";

export type OgCard =
  | { kind: "home"; label: string; lead: string; connector: string; accent: string; subtitle: string }
  | { kind: "article"; label: string; title: string; meta: string }
  | { kind: "section"; label: string; title: string; subtitle?: string }
  | { kind: "work"; label: string; title: string; subtitle?: string; shot: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messages = (locale: string): Record<string, any> => (locale === "en" ? en : id);
const L = (locale: string, i: string, e: string) => (locale === "en" ? e : i);

export { ogCardPath } from "@/lib/seo/og-paths";

function minutes(locale: string, n: number) {
  return L(locale, `${n} menit baca`, `${n} min read`);
}

export function ogCards(locale: string): Map<string, OgCard> {
  const m = messages(locale);
  const out = new Map<string, OgCard>();
  const writing = L(locale, "Tulisan", "Writing");

  /* home --------------------------------------------------------------- */
  out.set("home", {
    kind: "home",
    label: L(locale, "Software house · Indonesia", "Software house · Indonesia"),
    lead: m.hero.headlineLead,
    connector: m.hero.headlineConnector,
    accent: m.hero.flipWords["0"],
    subtitle: L(
      locale,
      "Harga disepakati per tahap · demo setiap minggu · kode atas nama Anda",
      "Price agreed per stage · a demo every week · code in your name",
    ),
  });

  /* section ------------------------------------------------------------ */
  out.set("blog", {
    kind: "section",
    label: writing,
    title: m.blogPage.hero.title,
    subtitle: m.blogPage.description,
  });
  out.set("privacy", {
    kind: "section",
    label: "Legal",
    title: L(locale, "Kebijakan privasi", "Privacy policy"),
    subtitle: L(
      locale,
      "Data apa yang kami kumpulkan, untuk apa, dan hak Anda atasnya.",
      "What we collect, why, and your rights over it.",
    ),
  });
  out.set("blog/case-studies", {
    kind: "section",
    label: writing,
    title: L(locale, "Studi kasus", "Case studies"),
  });
  for (const c of getCategories(locale)) {
    if (c.slug === "case-studies") continue;
    out.set(`blog/${c.slug}`, { kind: "section", label: writing, title: c.title, subtitle: c.description });
  }
  const sp = m.servicePage;
  out.set("services", { kind: "section", label: sp.breadcrumb, title: sp.hub.title, subtitle: sp.hub.intro });
  for (const s of getAllServices()) {
    const it = sp.items[s.key];
    out.set(`services/${s.slug}`, { kind: "section", label: `${sp.breadcrumb} · ${it.name}`, title: it.title, subtitle: it.summary });
  }

  /* article ------------------------------------------------------------ */
  for (const p of getBlogPosts({ locale, limit: 1000 }).posts) {
    if (!p.category.slug) continue;
    out.set(`blog/${p.category.slug}/${p.slug}`, {
      kind: "article",
      label: `${writing} · ${p.category.title}`,
      title: p.title,
      meta: minutes(locale, calculateCombinedReadingTime([p.excerpt || "", p.body])),
    });
  }
  for (const p of getPillarPages(undefined, locale)) {
    if (!p.category.slug) continue;
    out.set(`blog/${p.category.slug}/guides/${p.slug}`, {
      kind: "article",
      label: `${L(locale, "Panduan", "Guide")} · ${p.category.title}`,
      title: p.title,
      meta: minutes(locale, calculateCombinedReadingTime([p.introduction, p.body])),
    });
  }

  /* work --------------------------------------------------------------- */
  for (const p of getAllProducts()) {
    out.set(`products/${p.slug}`, {
      kind: "work",
      label: m.products.label,
      title: p.name,
      subtitle: m.products.items[p.key].tagline,
      shot: p.slug,
    });
  }
  for (const s of getAllShowcases()) {
    const item = m.showcase.items[s.slug];
    out.set(`showcase/${s.slug}`, {
      kind: "work",
      label: isConcept(s) ? L(locale, "Karya · Konsep desain", "Work · Design concept") : L(locale, "Karya klien", "Client work"),
      title: s.title,
      subtitle: item?.description,
      shot: s.slug,
    });
  }
  return out;
}
