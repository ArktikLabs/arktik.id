import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { getShowcaseBySlug, getAllShowcases } from '@/lib/data/showcases';
import { ShowcaseContainer } from "@/components/ShowcaseContainer";

interface ShowcaseDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const showcases = getAllShowcases();
  return showcases.map((showcase) => ({
    slug: showcase.slug,
  }));
}

export default async function ShowcaseDetailPage({ params }: ShowcaseDetailPageProps) {
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
    />
  );
}