import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PUBLIC_INDEXING, SITE_NAME, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — سوالت را بپرس، همین حالا جواب بگیر`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "در جیک‌جیک سوالت را می‌پرسی، همان لحظه پاسخ هوش مصنوعی می‌گیری و متخصص‌های تاییدشده پاسخ می‌دهند. اگر لازم شد، جلسه آنلاین رزرو می‌کنی.",
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
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
