import type React from "react";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Funnel_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { CursorPreloader } from "@/components/CursorPreloader";
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
  metadataBase: new URL("https://arktik.id"),
  title:
    "Arktik - Building Clear Digital Experiences | Digital Product Development",
  description:
    "Transform your business with Arktik's expert digital product development, AI automation, and custom software solutions. 7+ years of global experience delivering scalable, user-friendly applications.",
  keywords: [
    "digital product development",
    "custom software development",
    "AI automation",
    "mobile app development",
    "web development",
    "UI/UX design",
    "technology consulting",
    "business automation",
    "digital creative agency",
  ],
  authors: [{ name: "Arktik Team" }],
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
    url: "https://arktik.id",
    siteName: "Arktik",
    title: "Arktik - Building Clear Digital Experiences",
    description:
      "A digital creative agency crafting clear, fast, accessible products. Expert digital product development, AI automation, and custom software solutions.",
    images: [
      {
        url: "/og-en.webp",
        width: 1200,
        height: 630,
        alt: "Arktik - Digital Creative Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arktik - Building Clear Digital Experiences",
    description:
      "A digital creative agency crafting clear, fast, accessible products. Expert digital product development, AI automation, and custom software solutions.",
    images: ["/og-en.webp"],
    creator: "@arktik",
  },
  alternates: {
    canonical: "https://arktik.id",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/_next/static/css/app/layout.css"
          as="style"
        />
        <link
          rel="preload"
          href="/aurora-bg.webp"
          as="image"
          type="image/webp"
        />
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
