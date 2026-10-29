import type { Metadata } from "next";
import "./globals.css";
import AntdProvider from "@/components/AntdProvider";
import AppShell from "@/components/AppShell";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InstallAppBar from "@/components/InstallAppBar";
import { PUBLIC_INDEXING, SITE_NAME, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — متخصص‌های تاییدشده، جلسه‌ی آنلاین و فروشگاه امن`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "در وینو متخصص‌های تاییدشده را پیدا می‌کنی، پیش از رزرو با آن‌ها پیام می‌دهی، جلسه‌ی آنلاین و تماس تصویری می‌گیری، در دوره‌هایشان ثبت‌نام می‌کنی و محصولاتشان را با پرداخت امانی می‌خری. دستیار هوشمند هم همیشه در دسترس است.",
  keywords: [
    "مشاوره آنلاین", "مشاوره با متخصص", "رزرو جلسه آنلاین", "تماس تصویری با متخصص",
    "مشاوره روانشناسی آنلاین", "مشاوره حقوقی آنلاین", "مشاوره پزشکی آنلاین",
    "دوره آنلاین", "کلاس آنلاین", "خرید امن", "پرداخت امانی", "فروشگاه متخصص",
    "دستیار هوشمند", "وینو", "weeno",
  ],
  robots: PUBLIC_INDEXING
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "fa_IR",
    // ⚠️ عمداً بدون `url`. این‌جا مقدارِ ثابتِ SITE_URL بود و هر صفحه‌ای که
    // openGraph خودش را تعریف نمی‌کرد آن را به ارث می‌برد — نتیجه اینکه ۹
    // صفحه‌ی ثابت به گوگل می‌گفتند «آدرس من صفحه‌ی اصلی است» در حالی که تگ
    // canonicalشان درست بود. سیگنالِ متناقض، و همان چیزی که در Search
    // Console «Duplicate without user-selected canonical» می‌شود.
    //
    // آدرسِ هر صفحه از lib/pageMeta.ts می‌آید که canonical و og:url را با هم
    // از یک مسیر می‌سازد. صفحه‌ی اصلی هم مالِ خودش را همان‌جا می‌دهد.
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
   * فونت‌ها عمداً preload نمی‌شوند.
   *
   * دو بار امتحان شد و هر بار کروم هشدار «preloaded but not used» داد — حتی
   * وقتی تکراری‌ها حذف شدند و crossOrigin درست بود. دلیلش این است که
   * `font-display: swap` اول با فونتِ سیستمی رنگ می‌زند و مرورگر فونتِ اصلی
   * را چند ثانیه بعد به کار می‌گیرد، دیرتر از پنجره‌ای که preload انتظارش را
   * دارد. عملاً هم سودی نداشت: خودِ globals.css رندر-بلاک است و @font-face
   * همان لحظه‌ی پارس شدنش کشف می‌شود، پس preload چیزی جلو نمی‌انداخت و فقط
   * اولویتِ صفِ شبکه را از تصویرِ LCP می‌گرفت.
   */

  return (
    <html lang="fa" dir="rtl">
      <body>
        <AntdProvider>
          <AppShell header={<Header />} footer={<Footer />}>
            {children}
          </AppShell>
          <InstallAppBar />
        </AntdProvider>
      </body>
    </html>
  );
}
