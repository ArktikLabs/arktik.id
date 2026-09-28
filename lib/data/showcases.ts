export interface Showcase {
  slug: string;
  title: string;
  description: string;
  link: string;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  /** "live" (default): a delivered client site. "concept": a design prototype
   * built from a client brief with mock data. It is NOT a live site, so every
   * surface must label it and link to the demo, never "visit the site". */
  kind?: "live" | "concept";
}

export const showcases: Showcase[] = [
  {
    slug: "lenggah",
    title: "Lenggah",
    description:
      "Modern e-commerce platform for premium Indonesian fashion and lifestyle products",
    link: "https://lenggah.com",
    category: "E-commerce",
    tags: ["E-commerce", "Fashion", "React", "Next.js"],
    thumbnail: "/assets/portofolio/lenggah.webp",
  },
  {
    slug: "mata-screen-print",
    title: "Mata Screen Print",
    description:
      "Professional screen printing services website with portfolio showcase and order management",
    link: "https://matascreenprint.com",
    category: "Business Website",
    tags: ["Business", "Portfolio", "Services", "WordPress"],
    thumbnail: "/assets/portofolio/matascreenprint.webp",
  },
  {
    slug: "serenity-cove",
    title: "Serenity Cove Resort",
    description:
      "Sophisticated luxury hotel landing page featuring modern asymmetrical design, scroll animations, and premium user experience",
    link: "https://hotel-landing-page-rouge.vercel.app/",
    category: "Web Development",
    tags: ["Hotel", "Luxury", "Landing Page", "Animations"],
    thumbnail: "/assets/portofolio/serenity-cove.webp",
  },
  {
    slug: "mulia-consulting",
    title: "Mulia Consulting",
    description:
      "Bilingual website for an Indonesian HR consulting and talent solutions firm, built around booking a free HR strategy audit",
    link: "https://www.muliaconsulting.com",
    category: "Business Website",
    tags: ["Business", "HR Consulting", "Bilingual", "Next.js"],
    thumbnail: "/assets/portofolio/mulia-consulting.webp",
  },
  {
    slug: "aion-tulungagung",
    title: "AION Tulungagung",
    description:
      "Design concept for an electric-car dealer: model catalogue, on-page credit simulator and WhatsApp booking, built from the client's brief with sample data",
    link: "https://preview.arktik.id/aion-tulungagung/",
    category: "Design Concept",
    tags: ["Automotive", "Dealer", "Credit Simulator", "Static"],
    thumbnail: "/assets/portofolio/aion-tulungagung.webp",
    kind: "concept",
  },
];

export const isConcept = (s: Showcase) => s.kind === "concept";

export function getShowcaseBySlug(slug: string): Showcase | undefined {
  return showcases.find((showcase) => showcase.slug === slug);
}

export function getAllShowcases(): Showcase[] {
  return showcases;
}

export function getShowcasesByCategory(category: string): Showcase[] {
  return showcases.filter((showcase) => showcase.category === category);
}
