import type { MetadataRoute } from "next";
import { PUBLIC_INDEXING, SITE_URL } from "@/lib/config";

// فاز دمو: تا لانچ عمومی، همه‌جا بسته — env flag را روز لانچ true کن (README مربوطه)
export default function robots(): MetadataRoute.Robots {
  if (!PUBLIC_INDEXING) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /**
       * فقط فایل نصبی: ۸۹ مگابایت است و خزیدنش هیچ فایده‌ای ندارد.
       *
       * عمداً فونت‌ها، CSS/JS و favicon بسته نشدند — گوگل صفحه را رندر می‌کند
       * و بستنِ این‌ها ارزیابی رندر را خراب می‌کند (و favicon همان آیکونی است
       * که کنار نتیجه نشان می‌دهد). این‌که در گزارش زیر
       * «Crawled - currently not indexed» می‌آیند ایراد نیست: فایل‌اند، نه
       * صفحه، و اصلاً قرار نیست ایندکس شوند.
       */
      disallow: ["/weeno.apk", "/weeno-*.apk"],
    },
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/video-sitemap.xml`],
    host: SITE_URL,
  };
}
