export interface Showcase {
  slug: string;
  title: string;
  description: string;
  link: string;
  category?: string;
  tags?: string[];
  thumbnail?: string;
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
];

export function getShowcaseBySlug(slug: string): Showcase | undefined {
  return showcases.find((showcase) => showcase.slug === slug);
}

export function getAllShowcases(): Showcase[] {
  return showcases;
}

export function getShowcasesByCategory(category: string): Showcase[] {
  return showcases.filter((showcase) => showcase.category === category);
}
