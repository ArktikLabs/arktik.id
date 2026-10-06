/* Service pages (/services/<slug>/). Copy lives in messages under
 * servicePage.items.<key>; this file only holds routing and which existing
 * showcases/products each page links to as examples. */

export type ServiceExample = { type: "product" | "showcase"; slug: string };

export interface Service {
  slug: string;
  key: string;
  examples: ServiceExample[];
}

export const services: Service[] = [
  {
    slug: "web-mobile-apps",
    key: "webMobile",
    examples: [{ type: "product", slug: "gerai" }, { type: "product", slug: "jejak-saham" }, { type: "product", slug: "ayo-main" }],
  },
  {
    slug: "business-websites",
    key: "websites",
    examples: [{ type: "showcase", slug: "lenggah" }, { type: "showcase", slug: "mata-screen-print" }, { type: "showcase", slug: "mulia-consulting" }, { type: "showcase", slug: "aion-tulungagung" }],
  },
  {
    slug: "automation-ai",
    key: "automation",
    examples: [{ type: "product", slug: "jejak-saham" }],
  },
  {
    slug: "technical-consulting",
    key: "consulting",
    examples: [],
  },
];

export function getAllServices(): Service[] {
  return services;
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
