import { getPostsArchive } from "@/lib/api";
import { buildPostSlug } from "@/lib/slug";
import { captionPlainText } from "@/lib/caption";
import { deriveTitle, excerpt } from "@/lib/format";
import { SITE_URL } from "@/lib/config";
import type { PostsArchiveItem } from "@/lib/types";

/**
 * سایت‌مپِ ویدیو — جدا از sitemap.xml.
 *
 * چرا لازم شد: سرچ‌کنسول پست‌های ویدیویی را «Video isn't on a watch page»
 * علامت می‌زد. نشانه‌های صفحه درست بودند و پلیر هم در HTMLِ سروری و بالای خط
 * تا بود؛ چیزی که نداشتیم، صریح‌ترین شکلِ همان حرف بود. سایت‌مپِ ویدیو دقیقاً
 * همین را می‌گوید: «این نشانی صفحه‌ی تماشای این فایل است»، با کاور و مدت و
 * تاریخ. گوگل خودش این را روشِ توصیه‌شده برای معرفیِ صفحه‌های تماشا می‌داند.
 *
 * چرا فایلِ جدا و نه افزودن به sitemap.xml: خروجیِ `MetadataRoute.Sitemap`
 * در Next نام‌فضای video: را نمی‌سازد. دست‌بردن در آن یعنی بازنویسیِ دستیِ
 * سایت‌مپِ اصلی — که کار می‌کند و منبعِ همه‌ی آدرس‌هاست. این فایل فقط اضافه
 * می‌شود و اگر خالی بماند چیزی از دست نمی‌رود.
 */

const MAX_POST_PAGES = 40;

// سقف‌های خودِ گوگل برای این نام‌فضا
const MAX_TITLE = 100;
const MAX_DESCRIPTION = 2048;
const MAX_DURATION_SEC = 28800;

export const revalidate = 3600;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

function entry(p: PostsArchiveItem): string | null {
  if (!p.isVideo || !p.videoUrl || !p.thumbnailUrl) return null;

  const plain = captionPlainText(p.caption || "");
  const title = (p.title?.trim() || deriveTitle(plain, 80) || "").slice(0, MAX_TITLE);
  // بدونِ عنوان و توضیح، ورودی از نظر گوگل ناقص است و کلِ فایل را مشکوک
  // می‌کند — رد کردنش بهتر از فرستادنِ نصفه است.
  if (!title) return null;
  const description = (excerpt(plain, 300) || title).slice(0, MAX_DESCRIPTION);

  const loc = `${SITE_URL}/post/${buildPostSlug({ ...p, id: p.id })}`;
  const duration = Math.round(p.durationSec || 0);

  return [
    "  <url>",
    `    <loc>${esc(loc)}</loc>`,
    "    <video:video>",
    `      <video:thumbnail_loc>${esc(p.thumbnailUrl)}</video:thumbnail_loc>`,
    `      <video:title>${esc(title)}</video:title>`,
    `      <video:description>${esc(description)}</video:description>`,
    `      <video:content_loc>${esc(p.videoUrl)}</video:content_loc>`,
    // مدتِ صفر یعنی هنوز بک‌فیل نشده؛ تگِ صفر خطای اعتبارسنجی می‌دهد
    duration > 0 && duration <= MAX_DURATION_SEC
      ? `      <video:duration>${duration}</video:duration>` : null,
    `      <video:publication_date>${esc(new Date(p.createdAt).toISOString())}</video:publication_date>`,
    "      <video:family_friendly>yes</video:family_friendly>",
    "    </video:video>",
    "  </url>",
  ].filter(Boolean).join("\n");
}

export async function GET() {
  const entries: string[] = [];
  let totalPages = 1;

  for (let page = 1; page <= Math.min(totalPages, MAX_POST_PAGES); page++) {
    const archive = await getPostsArchive(page).catch(() => null);
    if (!archive) break;
    totalPages = archive.totalPages;
    for (const p of archive.posts) {
      const e = entry(p);
      if (e) entries.push(e);
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">',
    ...entries,
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
