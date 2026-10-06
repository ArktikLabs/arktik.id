# arktik.id

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/arktik-labs/v0-landing-page-design)

The company site of Arktik: custom software for clients, plus the products Arktik builds and runs itself.
Live at <https://www.arktik.id> (Indonesian at the root, English under `/en/`). Vercel deploys every push to `main`.

## What's on the site

| Route | What it is | Data |
| --- | --- | --- |
| `/` | Home: hero, products, client work, services, process, blog, contact | `messages/{id,en}.json` |
| `/products/<slug>/` | One page per Arktik product (shared layout) | `lib/data/products.ts` |
| `/showcase/<slug>/` | Client work, live sites and design concepts | `lib/data/showcases.ts` |
| `/services/<slug>/` | Service pages with linked examples | `lib/data/services.ts` |
| `/blog/...` | Articles, guides (pillars), categories | `content/` (Markdown) |
| `/privacy/` | Privacy policy (cookie consent, analytics, contact form) | `messages/*.json` |
| `/og/<locale>/<path>/` | Generated Open Graph cards | `lib/seo/og-cards.ts` |

Every page exists in both locales under the same English slug. Copy never lives in components: it sits in
`messages/id.json` and `messages/en.json`, and both files carry the same keys.

## Products

Arktik's own products are listed in `lib/data/products.ts`. The home band and every `/products/<slug>/` page are
rendered from that list, so nothing product-specific is hardcoded in a page.

| Product | Slug | Icon | What it is |
| --- | --- | --- | --- |
| Jejak Saham | `jejak-saham` | <img src="public/assets/products/jejak-saham/icon.svg" width="24" alt=""> | IDX stock ownership tracker (jejaksaham.id) |
| Ayo Main | `ayo-main` | <img src="public/assets/products/ayo-main/icon.svg" width="24" alt=""> | Indonesian-language games for kids aged 2-10 |
| Gerai | `gerai` | <img src="public/assets/products/gerai/icon.svg" width="24" alt=""> | Software for service businesses, run as four brands (below) |
| Giliran | `giliran` | <img src="public/assets/products/giliran/icon.svg" width="24" alt=""> | Walk-in waitlist with no app |

### Product families

Apps that run on **one engine** are shown as one product with `brands[]`, never as a tile each. Gerai is the engine
behind:

| Brand | Business | Icon | Host |
| --- | --- | --- | --- |
| Jelita | salons & beauty | <img src="public/assets/products/gerai/icon-jelita.svg" width="24" alt=""> | jelita.arktik.id |
| Pangkas | barbershops | <img src="public/assets/products/gerai/icon-pangkas.svg" width="24" alt=""> | pangkas.arktik.id |
| Relaksi | spas & reflexology | <img src="public/assets/products/gerai/icon-relaksi.svg" width="24" alt=""> | relaksi.arktik.id |
| Kilap | car & motorbike washes | <img src="public/assets/products/gerai/icon-kilap.svg" width="24" alt=""> | kilap.arktik.id |

On the home tile the brands are link cards; on `/products/gerai/` the hero lists them under the CTA, each brand
gets a card (landing screenshot + three trade-specific points), and the shared features are listed once. The old
`/products/jelita/` URL 308-redirects to `/products/gerai/` (`next.config.mjs`). Only apps on the same engine are
grouped; separate apps stay separate products.

### Adding a product (or a brand)

1. Screenshots: the product's own landing hero is the cover; 3-4 app screens go in `shots` (demo data with made-up
   names only, no traction numbers). WebP in `public/assets/products/<slug>/` (cover <= 976 px wide, shots
   <= 1600 px). A family brand adds `public/assets/products/<family>/<brand>.webp` instead.
2. Icon: `public/assets/products/<slug>/icon.svg`, 64x64 viewBox on a rounded square. Use the product's own
   favicon so arktik.id and the browser tab match. A family brand uses `public/assets/products/<family>/icon-<brand>.svg`.
3. Data: an entry in `lib/data/products.ts` (slug, key, name, icon, link, domain, schema.org category, exactly 4
   `coverage` keys, `features` keys, cover, shots). A new brand of an existing family is one more `brands[]`
   entry, not a new product.
4. Copy in BOTH `messages/id.json` and `messages/en.json`: `products.items.<key>` (tagline, description, more,
   visit; families add `brandsLabel` and `brands.<brand>`) and `productPage.<key>` (meta, tagline, intro, coverage,
   features, tiers, shots, built, disclaimer, CTA; families add `brandsNav`, `brandsTitle`, `brandsIntro`,
   `brands.<brand>`). Check every claim against the product's code or database; features not built yet go in
   `disclaimer`. No prices, user counts or testimonials.
5. Open Graph: add `assets/og-shots/<slug>.jpg` (1000 px wide). Without it the build logs `[og] ... missing` and
   falls back to a text card.
6. Run the checks below, then look at the home band and the product page at 1280 and 390 px.

## Stack

Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS 3, next-intl 4. Design rules live in `design.md`,
tokens in `tokens.css`.

## Getting started

```bash
pnpm install
pnpm dev                  # http://localhost:3000
pnpm build && pnpm start  # production build
```

When testing a production build locally, browse `http://localhost:<port>` and start it without `-H 127.0.0.1`:
the next-intl middleware proxies to `localhost`.

## Checks

```bash
pnpm test        # node --test on lib/ and scripts/
pnpm build       # the real gate (it skips type errors)
pnpm typecheck   # may carry baseline errors from a stale .next/types; the count must not rise
```

`pnpm lint` is not configured (`next lint` opens an interactive setup prompt). After routing changes, check status
codes, not page text: unknown paths must return 404, and every `<loc>` in `/sitemap.xml` must return 200.

## Content pipeline

Blog articles are written from `content/planner.csv` by a scheduled GitHub Action. How it works, and the rules for
notes, research and case studies, are in `AGENTS.md`.

## Conventions

- Conventional Commits (`feat:`, `fix:`, `content:`, ...).
- Every route's `generateMetadata` spreads both `alternatesFor(...)` and `socialMeta(...)` from
  `lib/seo/schema.ts`; otherwise the page silently inherits the home page's Open Graph tags.
- Any tracking tag respects the cookie-consent default and is listed on `/privacy` in the same change.
- Design concepts (`kind: "concept"` showcases) never read as delivered client work.

## Contact

- Email: `hello@arktik.id`
- WhatsApp: `+62 851-1769-7889` (the site's contact form opens a prefilled WhatsApp message)
