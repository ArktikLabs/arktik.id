import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getAllProducts } from "@/lib/data/products";

/* Hallmark · products band · design-system: design.md v2
 *
 * Client work (WorksSection) proves we ship for others; this band proves we
 * also build and RUN something ourselves, which is a different trust signal:
 * the studio lives with its own code in production. One wide tile per product,
 * text left and a real screenshot right, so it reads as the same bento
 * language as the work above without repeating its image-under-scrim tiles.
 * Coverage numbers are the product's data scope, not traction — no user
 * counts, no prices (design.md honest-copy clause). */

export function ProductsSection() {
  const t = useTranslations("products");
  const products = getAllProducts();

  return (
    <section
      id="products"
      className="mx-auto max-w-7xl px-6 pb-12 pt-16 lg:px-12 lg:pb-16 lg:pt-20"
    >
      <div className="section-head mb-4">
        <h2 className="font-heading text-3xl font-bold lg:text-4xl">
          {t("title")}
        </h2>
        <span className="section-head__rule" aria-hidden="true" />
      </div>

      <p className="mb-10 max-w-2xl text-lg leading-relaxed text-ink-2">
        {t("subtitle")}
      </p>

      <div className="bento">
        {products.map((p) => (
          <article
            key={p.slug}
            className="tile cell-6 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center"
          >
            <div className="flex min-w-0 flex-col gap-5">
              <span className="label-mono flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-lime-green"
                  aria-hidden="true"
                />
                {t("label")}
              </span>
              <h3 className="font-heading text-3xl font-bold leading-display text-ink md:text-4xl">
                {p.name}
              </h3>
              <p className="text-lg leading-relaxed text-ink">
                {t(`items.${p.key}.tagline`)}
              </p>
              <p className="text-sm leading-relaxed text-ink-2">
                {t(`items.${p.key}.description`)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/products/${p.slug}`}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill border border-rule-strong px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-200 hover:border-lime-green hover:text-lime-green"
                >
                  {t(`items.${p.key}.more`)}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap px-2 py-2.5 text-sm font-medium text-ink-2 underline decoration-rule-strong underline-offset-4 transition-colors duration-200 hover:text-lime-green hover:decoration-lime-green"
                >
                  {t(`items.${p.key}.visit`)}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <Link
              href={`/products/${p.slug}`}
              className="block min-w-0 overflow-hidden rounded-card border border-rule"
              aria-label={t(`items.${p.key}.more`)}
              tabIndex={-1}
            >
              <Image
                src={p.cover.src}
                alt=""
                width={p.cover.width}
                height={p.cover.height}
                sizes="(max-width: 1024px) 100vw, 640px"
                className="h-auto w-full"
              />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
