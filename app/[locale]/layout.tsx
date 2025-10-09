import type React from "react";
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Funnel_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { CursorPreloader } from "@/components/CursorPreloader";
import { GoogleTagManager } from "@next/third-parties/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '../../i18n/routing';
import { redirect } from 'next/navigation';
import "../globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage-grotesque",
});

const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-funnel-sans",
});

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const messages = await getMessages();
  const t = (key: string) => {
    const keys = key.split('.');
    let current: any = messages;
    for (const k of keys) {
      current = current?.[k];
    }
    return current || key;
  };

  return {
    metadataBase: new URL("https://www.arktik.id"),
    title: t("common.title"),
    description: t("common.description"),
    keywords: [
      "custom software development",
      "software development company",
      "AI automation",
      "mobile app development",
      "web development",
      "UI/UX design",
      "technology consulting",
      "business automation",
      "software house",
    ],
    authors: [{ name: "Arktik Labs" }],
    creator: "Arktik",
    publisher: "Arktik",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "id" ? "id_ID" : "en_US",
      url:
        locale === "id" ? "https://www.arktik.id" : "https://www.arktik.id/en",
      siteName: "Arktik",
      title: t("common.title"),
      description: t("common.description"),
      images: [
        {
          url: locale === "id" ? "/assets/og-id.webp" : "/assets/og-en.webp",
          width: 1200,
          height: 630,
          alt: t("common.title"),
        },
      ],
      emails: ["hello@arktik.id"],
      phoneNumbers: ["+62 851-1769-7889"],
    },
    twitter: {
      site: "@arktiklabs",
      card: "summary_large_image",
      title: t("common.title"),
      description: t("common.description"),
      images: [locale === "id" ? "/assets/og-id.webp" : "/assets/og-en.webp"],
      creator: "@arktiklabs",
    },
    abstract: t("common.description"),
    category: "technology",
    classification: "software development",
    alternates: {
      canonical:
        locale === "id"
          ? "https://www.arktik.id"
          : `https://www.arktik.id/${locale}`,
      languages: {
        id: "https://www.arktik.id",
        en: "https://www.arktik.id/en",
        "x-default": "https://www.arktik.id",
      },
    },
    icons: {
      icon: [
        { url: "/favicon.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#012233",
};

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // Enable static rendering for server components
  setRequestLocale(locale);

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    redirect('/');
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        <GoogleTagManager gtmId="GTM-WDNKG95C" />
      </head>
      <body
        className={`${funnelSans.className} ${bricolageGrotesque.variable} ${funnelSans.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          <CursorPreloader />
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}