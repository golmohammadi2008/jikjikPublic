import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InstallAppBar from "@/components/InstallAppBar";
import { PUBLIC_INDEXING, SITE_NAME, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — هر سوال، متخصص خودش را دارد`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "در وینو سوالت را می‌پرسی، همان لحظه پاسخ هوش مصنوعی می‌گیری و متخصص‌های تاییدشده پاسخ می‌دهند. اگر لازم شد، جلسه آنلاین رزرو می‌کنی.",
  // گوگل meta keywords را نادیده می‌گیرد؛ این‌جا برای موتورهای داخلی و ابزارهای
  // شبکه‌های اجتماعی می‌ماند. کار اصلیِ سئو در عنوان/توضیح/تیترها و JSON-LD است.
  keywords: [
    "مشاوره آنلاین", "پرسش و پاسخ تخصصی", "مشاوره با متخصص", "رزرو جلسه آنلاین",
    "مشاوره روانشناسی آنلاین", "مشاوره حقوقی آنلاین", "مشاوره پزشکی آنلاین",
    "سوال از متخصص", "پاسخ هوش مصنوعی", "وینو", "weeno",
  ],
  robots: PUBLIC_INDEXING
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "fa_IR",
    url: SITE_URL,
    images: [{ url: "/assets/og-cover.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: { card: "summary_large_image", images: ["/assets/og-cover.png"] },
  icons: { icon: "/favicon.ico", apple: "/assets/logo-512.png" },
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
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
        <InstallAppBar />
      </body>
    </html>
  );
}
