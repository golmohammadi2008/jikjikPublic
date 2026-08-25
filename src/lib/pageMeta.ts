import type { Metadata } from "next";
import { OG_IMAGE } from "./config";

/**
 * متادیتای یک صفحه‌ی ثابت، از روی یک مسیر.
 *
 * چرا لازم شد: هر صفحه `alternates.canonical` خودش را می‌داد ولی `og:url` را
 * نه، و `openGraph.url` در layout ریشه روی SITE_URL ثابت بود. Next آبجکتِ
 * openGraph والد را merge نمی‌کند بلکه فقط وقتی صفحه خودش تعریفش کند
 * جایگزین می‌شود — پس هر ۹ صفحه‌ی ثابت (faq، questions، terms، …) به گوگل
 * می‌گفتند «آدرس من صفحه‌ی اصلی است» در حالی که canonicalشان چیز دیگری بود.
 *
 * دو سیگنالِ متناقض روی یک صفحه دقیقاً همان چیزی است که در Search Console
 * «Duplicate without user-selected canonical» و «Google chose different
 * canonical than user» می‌سازد.
 *
 * حالا هر دو از یک `path` ساخته می‌شوند و نمی‌توانند از هم واگرا شوند؛
 * صفحه‌ی بعدی هم که این را صدا بزند، خودبه‌خود درست است.
 */
export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title,
      description,
      // بدون این، صفحه بی‌تصویر در تلگرام/واتساپ باز می‌شود — چون تعریفِ
      // openGraph در صفحه، نسخه‌ی layout را کامل جایگزین می‌کند.
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
  };
}
