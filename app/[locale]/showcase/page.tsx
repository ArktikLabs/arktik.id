import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

interface ShowcasePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ShowcasePage({ params }: ShowcasePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Redirect to homepage with portfolio anchor
  redirect(`/${locale === 'id' ? '' : locale}#portfolio`);
}