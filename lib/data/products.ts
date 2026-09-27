/* Products Arktik builds and runs itself — as opposed to `showcases.ts`, which
 * is client work. Copy lives in messages/*.json under `products.items.<key>`
 * and `productPage.<key>` so it translates; this file holds only the
 * locale-free facts (slug, link, images).
 *
 * Honest-copy rule (design.md): no prices, no user counts, no testimonials.
 * The product's own numbers (stock/holder/group counts) are coverage of public
 * data, not traction — keep it that way. */

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
  cover: ProductShot;
  shots: ProductShot[];
}

export const products: Product[] = [
  {
    slug: "jejak-saham",
    key: "jejakSaham",
    name: "Jejak Saham",
    link: "https://jejaksaham.arktik.id",
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
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProducts(): Product[] {
  return products;
}
