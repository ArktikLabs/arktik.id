import type React from "react";
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Funnel_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { CursorPreloader } from "@/components/CursorPreloader";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.arktik.id"),
  title: "Arktik - Custom Software Development Company",
  description:
    "Professional software development company with 7+ years turning technology into business growth through web, mobile & backend solutions delivered globally.",
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
    locale: "en_US",
    url: "https://www.arktik.id",
    siteName: "Arktik",
    title: "Arktik - Custom Software Development Company",
    description:
      "Leading software development company crafting scalable, reliable solutions globally. Expert custom software development, AI automation, and end-to-end technology services.",
    images: [
      {
        url: "/og-en.webp",
        width: 1200,
        height: 630,
        alt: "Arktik - Software Development Company",
      },
    ],
    emails: ["hello@arktik.id"],
    phoneNumbers: ["+62 851-1769-7889"],
  },
  twitter: {
    site: "@arktiklabs",
    card: "summary_large_image",
    title: "Arktik - Custom Software Development Company",
    description:
      "Leading software development company crafting scalable, reliable solutions globally. Expert custom software development, AI automation, and end-to-end technology services.",
    images: ["/og-en.webp"],
    creator: "@arktiklabs",
  },
  abstract:
    "Leading software development company crafting scalable, reliable solutions globally. Expert custom software development, AI automation, and end-to-end technology services.",
  category: "technology",
  classification: "software development",
  alternates: {
    canonical: "https://www.arktik.id",
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

export const viewport: Viewport = {
  themeColor: "#012233",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManager gtmId="GTM-WDNKG95C" />
      </head>
      <body
        className={`${funnelSans.className} ${bricolageGrotesque.variable} ${funnelSans.variable}`}
      >
        <CursorPreloader />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
