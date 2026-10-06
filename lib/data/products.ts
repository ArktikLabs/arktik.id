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
    slug: "jelita",
    key: "jelita",
    name: "Jelita",
    link: "https://jelita.arktik.id",
    domain: "jelita.arktik.id",
    category: "BusinessApplication",
    coverage: ["booking", "free", "install", "roles"],
    features: ["booking", "schedule", "pos", "commissions", "customers", "stock", "payroll", "branding"],
    cover: {
      src: "/assets/products/jelita/landing.webp",
      width: 976,
      height: 625,
      key: "landing",
    },
    shots: [
      {
        src: "/assets/products/jelita/today.webp",
        width: 976,
        height: 686,
        key: "today",
      },
      {
        src: "/assets/products/jelita/calendar.webp",
        width: 1600,
        height: 1125,
        key: "calendar",
      },
      {
        src: "/assets/products/jelita/pos.webp",
        width: 1600,
        height: 1125,
        key: "pos",
      },
      {
        src: "/assets/products/jelita/salon.webp",
        width: 1600,
        height: 1125,
        key: "salon",
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
