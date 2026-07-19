import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PUBLIC_INDEXING, SITE_NAME, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — هر سوال، متخصص خودش را دارد`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "در وینو سوالت را می‌پرسی، همان لحظه پاسخ هوش مصنوعی می‌گیری و متخصص‌های تاییدشده پاسخ می‌دهند. اگر لازم شد، جلسه آنلاین رزرو می‌کنی.",
  robots: PUBLIC_INDEXING
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "fa_IR",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* preload وزن‌های حیاتی: بدنه ۴۰۰ و بولد ۷۰۰ (Vazirmatn) */}
        <link rel="preload" href="/fonts/Vazirmatn-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Vazirmatn-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
