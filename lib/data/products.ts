/* Products Arktik builds and runs itself — as opposed to `showcases.ts`, which
 * is client work. Copy lives in messages/*.json under `products.items.<key>`
 * and `productPage.<key>` so it translates; this file holds only the
 * locale-free facts (slug, link, images).
 *
 * Honest-copy rule (design.md): no prices, no user counts, no testimonials.
 * The product's own numbers (stock/holder/group counts, game counts) are scope,
 * not traction — keep it that way. Never show play counts or sign-ups.
 *
 * Each product lists its own coverage + feature keys; the product page renders
 * productPage.<key>.coverage.<c> and productPage.<key>.features.<f> for them. */

export interface ProductShot {
  src: string;
  width: number;
  height: number;
  /** key under productPage.<key>.shots.<shotKey> for alt + caption */
  key: string;
}

/** One brand of a product family (several brands on one engine). Copy lives
 * under products.items.<key>.brands.<brand.key> and productPage.<key>.brands. */
export interface ProductBrand {
  key: string;
  name: string;
  link: string;
  domain: string;
  cover: ProductShot;
}

export interface Product {
  slug: string;
  /** messages key under products.items / productPage */
  key: string;
  name: string;
  link: string;
  /** host shown next to the visit button */
  domain: string;
  /** schema.org SoftwareApplication.applicationCategory */
  category: string;
  /** keys under productPage.<key>.coverage — exactly 4 (grid is 2×2 / 4×1) */
  coverage: readonly string[];
  /** keys under productPage.<key>.features */
  features: readonly string[];
  cover: ProductShot;
  shots: ProductShot[];
  /** Product family: the brands that run on this one engine. When set, the
   * home tile and the product page link to each brand instead of one site. */
  brands?: ProductBrand[];
}

export const products: Product[] = [
  {
    slug: "jejak-saham",
    key: "jejakSaham",
    name: "Jejak Saham",
    link: "https://jejaksaham.id",
    domain: "jejaksaham.id",
    category: "FinanceApplication",
    coverage: ["stocks", "holders", "groups", "cadence"],
    features: ["moves", "stock", "investor", "groups", "screener", "financials", "backtest", "watchlist"],
    cover: {
      src: "/assets/products/jejak-saham/moves.webp",
      width: 976,
      height: 748,
      key: "moves",
    },
    shots: [
      {
        src: "/assets/products/jejak-saham/screener.webp",
        width: 1600,
        height: 1178,
        key: "screener",
      },
      {
        src: "/assets/products/jejak-saham/financials.webp",
        width: 1984,
        height: 880,
        key: "financials",
      },
    ],
  },
  {
    slug: "ayo-main",
    key: "ayoMain",
    name: "Ayo Main",
    link: "https://ayomain.arktik.id",
    domain: "ayomain.arktik.id",
    category: "GameApplication",
    coverage: ["ages", "ads", "accounts", "review"],
    features: ["catalog", "parents", "noSignup", "offline", "creators", "review", "sandbox", "popular"],
    cover: {
      src: "/assets/products/ayo-main/cover.webp",
      width: 976,
      height: 718,
      key: "cover",
    },
    shots: [
      {
        src: "/assets/products/ayo-main/catalog.webp",
        width: 1600,
        height: 895,
        key: "catalog",
      },
      {
        src: "/assets/products/ayo-main/detail.webp",
        width: 1600,
        height: 975,
        key: "detail",
      },
      {
        src: "/assets/products/ayo-main/maker.webp",
        width: 1600,
        height: 675,
        key: "maker",
      },
    ],
  },
  {
    /* Gerai = the engine behind Jelita (salon), Pangkas (barbershop), Relaksi
     * (spa) and Kilap (car wash): one codebase, a brand per kind of business.
     * Shown as ONE product with its brands, so the band doesn't grow by a tile
     * per vertical. /products/jelita/ 308s here (next.config.mjs). */
    slug: "gerai",
    key: "gerai",
    name: "Gerai",
    link: "https://jelita.arktik.id",
    domain: "jelita.arktik.id",
    category: "BusinessApplication",
    coverage: ["verticals", "free", "install", "roles"],
    features: ["page", "pos", "commissions", "customers", "stock", "loyalty", "attendance", "payroll"],
    cover: {
      src: "/assets/products/gerai/family.webp",
      width: 976,
      height: 552,
      key: "family",
    },
    shots: [],
    brands: [
      {
        key: "jelita",
        name: "Jelita",
        link: "https://jelita.arktik.id",
        domain: "jelita.arktik.id",
        cover: { src: "/assets/products/gerai/jelita.webp", width: 976, height: 549, key: "jelita" },
      },
      {
        key: "pangkas",
        name: "Pangkas",
        link: "https://pangkas.arktik.id",
        domain: "pangkas.arktik.id",
        cover: { src: "/assets/products/gerai/pangkas.webp", width: 976, height: 549, key: "pangkas" },
      },
      {
        key: "relaksi",
        name: "Relaksi",
        link: "https://relaksi.arktik.id",
        domain: "relaksi.arktik.id",
        cover: { src: "/assets/products/gerai/relaksi.webp", width: 976, height: 549, key: "relaksi" },
      },
      {
        key: "kilap",
        name: "Kilap",
        link: "https://kilap.arktik.id",
        domain: "kilap.arktik.id",
        cover: { src: "/assets/products/gerai/kilap.webp", width: 976, height: 549, key: "kilap" },
      },
    ],
  },
  {
    slug: "giliran",
    key: "giliran",
    name: "Giliran",
    link: "https://giliran.arktik.id",
    domain: "giliran.arktik.id",
    category: "BusinessApplication",
    coverage: ["install", "free", "roles", "languages"],
    features: ["join", "status", "console", "tables", "tv", "booking", "crm", "analytics"],
    cover: {
      src: "/assets/products/giliran/landing.webp",
      width: 976,
      height: 534,
      key: "landing",
    },
    shots: [
      {
        src: "/assets/products/giliran/console.webp",
        width: 1600,
        height: 1000,
        key: "console",
      },
      {
        src: "/assets/products/giliran/guest.webp",
        width: 1600,
        height: 1530,
        key: "guest",
      },
      {
        src: "/assets/products/giliran/analytics.webp",
        width: 1600,
        height: 1434,
        key: "analytics",
      },
      {
        src: "/assets/products/giliran/contacts.webp",
        width: 1600,
        height: 1000,
        key: "contacts",
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProducts(): Product[] {
  return products;
}
