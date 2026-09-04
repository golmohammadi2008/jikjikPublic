import type { MetadataRoute } from "next";
import { getHome, getPostsArchive, getSpecialists } from "@/lib/api";
import { buildPostSlug, buildSlug } from "@/lib/slug";
import { SITE_URL } from "@/lib/config";

// آرشیو سوال‌ها بخش اصلی سئوی سایت است، ولی قبلاً فقط «سوال‌های داغِ» صفحه‌ی
// اصلی در sitemap می‌آمد (۸ آدرس در کل). حالا تا این تعداد صفحه‌ی آرشیو را
// می‌پیماییم تا همه‌ی سوال‌ها به گوگل معرفی شوند. سقف دارد چون sitemap در
// زمان build/ISR ساخته می‌شود و نباید به یک کراول طولانی تبدیل شود.

// همان سقف برای آرشیو پست‌ها؛ ۳۰ پست در هر صفحه
const MAX_POST_PAGES = 40;

/**
 * تاریخِ آخرین تغییرِ **محتوای صفحه‌های ثابت**.
 *
 * چرا ثابت و نه `new Date()`: این سایت‌مپ هر ساعت بازساخته می‌شود. با
 * `now`، هر ساعت به گوگل می‌گفتیم «قوانین و سوالات متداول همین الان عوض
 * شدند» — و وقتی همه‌چیز همیشه تازه باشد، lastmod بی‌معنا می‌شود و گوگل
 * یاد می‌گیرد نادیده‌اش بگیرد. آن‌وقت تغییرِ **واقعیِ** یک سوال هم دیگر
 * سیگنالی ندارد.
 *
 * وقتی متنِ یکی از این صفحه‌ها را عوض کردی، همین تاریخ را جلو ببر.
 */
const STATIC_LAST_MODIFIED = new Date("2026-08-03");

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [home, specialistsData, firstPosts] = await Promise.all([
    getHome().catch(() => null),
    getSpecialists().catch(() => null),
    getPostsArchive().catch(() => null),
  ]);

  // ⚠️ اگر منبعِ اصلیِ آدرس‌ها در دسترس نبود، **هیچ سایت‌مپی منتشر نمی‌کنیم**.
  //
  // قبلاً هر خطای API بی‌صدا به null تبدیل می‌شد و نتیجه یک سایت‌مپِ ده‌آدرسیِ
  // فقط-صفحه‌های-ثابت بود که یک ساعت کش می‌شد. یک بار واقعاً همین شد: درست
  // در لحظه‌ی ری‌استارتِ سرویس بازتولید شد و از ۲۳ آدرس به ۱۰ افتاد — یعنی
  // به گوگل گفتیم همه‌ی صفحه‌های محتوایی از سایت‌مپ حذف شده‌اند.
  //
  // با throw، Next نسخه‌ی سالمِ قبلی را نگه می‌دارد و در بازتولیدِ بعدی
  // دوباره تلاش می‌کند. نبودِ به‌روزرسانی خیلی بهتر از انتشارِ یک سایت‌مپِ
  // آب‌رفته است.
  // در بیلد throw نمی‌کنیم: sitemap در همان مرحله پیش‌رندر می‌شود و throw کلِ
  // بیلد را می‌شکند (یک بار همین اتفاق افتاد و سایت با ۵۰۲ خوابید، چون
  // prerender-manifest.json اصلاً ساخته نشد). فقط در بازتولیدِ زمانِ اجرا
  // throw می‌کنیم؛ آن‌جاست که Next نسخه‌ی سالمِ قبلی را نگه می‌دارد.
  const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
  if (!isBuild && !firstPosts && !home) {
    throw new Error('sitemap: منبع داده در دسترس نیست — نسخه‌ی قبلی حفظ می‌شود');
  }

  // صفحه‌های ثابت — /faq و /how-it-works و بقیه اصلاً در sitemap نبودند
  const entries: MetadataRoute.Sitemap = [
    // بدون اسلشِ آخر — دقیقاً همان رشته‌ای که تگ canonical صفحه‌ی اصلی می‌دهد.
    // (Next برای `canonical: "/"` آدرس را بدون اسلش می‌سازد.)
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/specialists`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/how-it-works`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/specialist-signup`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/specialist-guide`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/terms`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.2 },
  ];

  const seen = new Set(entries.map((e) => e.url));
  const push = (e: MetadataRoute.Sitemap[number]) => {
    if (seen.has(e.url)) return;
    seen.add(e.url);
    entries.push(e);
  };

  // فقط حوزه‌هایی که واقعاً سوال دارند. حوزه‌ی خالی صفحه‌ی خالی است و صفحه‌ی
  // خالی در سایت‌مپ یعنی به گوگل آدرسی داده‌ایم که خودمان noindexش کرده‌ایم —
  // دقیقاً همان تناقضی که «Crawled - currently not indexed» می‌سازد.
  // «حوزه‌ای که واقعاً چیزی دارد» یعنی سوال **یا** متخصص — همان تعریفی که
  // خودِ صفحه برای noindex استفاده می‌کند. اگر این دو با هم نخوانند، یا
  // آدرسی به سایت‌مپ می‌دهیم که خودمان noindexش کرده‌ایم، یا صفحه‌ی
  // ایندکس‌پذیری را از سایت‌مپ جا می‌گذاریم.
  const specialistCategories = new Set(
    (specialistsData?.specialists ?? []).map((s) => s.category).filter(Boolean),
  );
  for (const c of home?.categories ?? []) {
    if (!c.count && !specialistCategories.has(c.key)) continue;
    push({ url: `${SITE_URL}/category/${c.key}`, lastModified: now, changeFrequency: "daily", priority: 0.7 });
  }

  // آرشیو کامل سوال‌ها: هم صفحه‌های صفحه‌بندی، هم تک‌تک سوال‌ها

  // ⚠️ پست‌ها از **آرشیو** می‌آیند، نه از `home.posts`.
  //
  // `home.posts` عمداً ۶ تاست. وقتی تنها منبعِ سایت‌مپ بود، انتشارِ هر پستِ
  // تازه قدیمی‌ترین را از سایت‌مپ بیرون می‌انداخت — بی‌آنکه صفحه‌اش حذف یا
  // noindex شده باشد. از دید گوگل یعنی آن آدرس دیگر معرفی نمی‌شود، و تعداد
  // صفحه‌های ایندکس‌شده به‌مرور آب می‌رفت. (۱۷ پست روی سرور، ۶ تا در سایت‌مپ.)
  const postPages = Math.min(firstPosts?.totalPages ?? 1, MAX_POST_PAGES);
  const restPosts = postPages > 1
    ? await Promise.all(
        Array.from({ length: postPages - 1 }, (_, i) => getPostsArchive(i + 2).catch(() => null)),
      )
    : [];

  for (const archive of [firstPosts, ...restPosts]) {
    for (const p of archive?.posts ?? []) {
      // پستِ بی‌متن در صفحه‌ی خودش noindex است (post/[slug]/page.tsx) — پس
      // این‌جا هم نباید بیاید، وگرنه آدرسی به گوگل داده‌ایم که خودمان
      // noindexش کرده‌ایم.
      if (!p.caption?.trim() && !p.title?.trim()) continue;
      push({
        url: `${SITE_URL}/post/${buildPostSlug({ ...p, id: p.id })}`,
        lastModified: p.createdAt,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  // ⚠️ عمداً بدونِ lastModified: API تاریخِ به‌روزرسانیِ متخصص را نمی‌دهد و
  // گذاشتنِ `now` یعنی هر ساعت ادعا کنیم همه‌ی پروفایل‌ها عوض شده‌اند.
  // نبودنِ فیلد از دروغ‌گفتنش بهتر است — گوگل خودش تشخیص می‌دهد.
  for (const s of specialistsData?.specialists ?? []) {
    push({
      url: `${SITE_URL}/specialists/${buildSlug(s.name, s.id)}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}
