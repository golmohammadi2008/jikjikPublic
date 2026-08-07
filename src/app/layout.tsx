import type { Metadata } from "next";
import { preload } from "react-dom";
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
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * پری‌لودِ فونت با API خودِ ری‌اکت، نه تگِ دستی داخل <head>.
   *
   * ری‌اکت ۱۹ خودش `<link rel=preload>` را به <head> hoist می‌کند؛ وقتی تگ را
   * دستی هم آن‌جا گذاشته بودیم، هر فونت **دو بار** پری‌لود می‌شد و کروم هشدار
   * «preloaded but not used» می‌داد — نسخه‌ی دوم واقعاً مصرف نمی‌شد و فقط
   * پهنای باند و اولویتِ صف را می‌گرفت. این API تکراری‌ها را حذف می‌کند.
   *
   * فقط دو وزنِ واقعاً رندرـبحرانی: بدنه (Vazirmatn 400) و تیترِ صفحه
   * (Estedad 800) که روی صفحه‌های محتوایی همان المانِ LCP است. وزن‌های دیگر
   * از روی @font-face می‌آیند و پری‌لودشان صف را شلوغ می‌کرد.
   */
  preload("/fonts/Vazirmatn-Regular.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/Estedad-ExtraBold.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html lang="fa" dir="rtl">
      <body>
        <Header />
        {children}
        <Footer />
        <InstallAppBar />
      </body>
    </html>
  );
}
