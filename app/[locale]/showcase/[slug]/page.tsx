import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { alternatesFor } from "@/lib/seo/schema";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getShowcaseBySlug, getAllShowcases, isConcept } from "@/lib/data/showcases";
import { ShowcaseContainer } from "@/components/ShowcaseContainer";

interface ShowcaseDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

/* This route had no generateMetadata at all, so it inherited the layout's
 * title, description and canonical — three showcase pages all claiming to be
 * the homepage, with identical titles. */
export async function generateMetadata({
  params,
}: ShowcaseDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const showcase = getShowcaseBySlug(slug);
  if (!showcase) return {};
  const t = await getTranslations({ locale, namespace: "showcase.concept" });
  return {
    title: isConcept(showcase)
      ? `${showcase.title} (${t("metaPrefix")}) | Arktik`
      : `${showcase.title} | Arktik`,
    description: showcase.description,
    alternates: alternatesFor(locale, `showcase/${slug}`),
  };
}

export async function generateStaticParams() {
  const showcases = getAllShowcases();
  return showcases.map((showcase) => ({
    slug: showcase.slug,
  }));
}

export default async function ShowcaseDetailPage({
  params,
}: ShowcaseDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const showcase = getShowcaseBySlug(slug);

  if (!showcase) {
    notFound();
  }

  return (
    <ShowcaseContainer
      title={showcase.title}
      link={showcase.link}
      concept={isConcept(showcase)}
    />
  );
}
