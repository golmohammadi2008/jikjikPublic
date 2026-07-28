import type { MetadataRoute } from "next";
import { getHome, getQuestionsArchive, getSpecialists } from "@/lib/api";
import { buildSlug } from "@/lib/slug";
import { SITE_URL } from "@/lib/config";

// آرشیو سوال‌ها بخش اصلی سئوی سایت است، ولی قبلاً فقط «سوال‌های داغِ» صفحه‌ی
// اصلی در sitemap می‌آمد (۸ آدرس در کل). حالا تا این تعداد صفحه‌ی آرشیو را
// می‌پیماییم تا همه‌ی سوال‌ها به گوگل معرفی شوند. سقف دارد چون sitemap در
// زمان build/ISR ساخته می‌شود و نباید به یک کراول طولانی تبدیل شود.
const MAX_ARCHIVE_PAGES = 40;

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [home, specialistsData, firstArchive] = await Promise.all([
    getHome().catch(() => null),
    getSpecialists().catch(() => null),
    getQuestionsArchive().catch(() => null),
  ]);

  // صفحه‌های ثابت — /faq و /how-it-works و بقیه اصلاً در sitemap نبودند
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/questions`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/specialists`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/specialist-signup`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/specialist-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const seen = new Set(entries.map((e) => e.url));
  const push = (e: MetadataRoute.Sitemap[number]) => {
    if (seen.has(e.url)) return;
    seen.add(e.url);
    entries.push(e);
  };

  for (const c of home?.categories ?? []) {
    push({ url: `${SITE_URL}/category/${c.key}`, lastModified: now, changeFrequency: "daily", priority: 0.7 });
  }

  // آرشیو کامل سوال‌ها: هم صفحه‌های صفحه‌بندی، هم تک‌تک سوال‌ها
  const totalPages = Math.min(firstArchive?.totalPages ?? 1, MAX_ARCHIVE_PAGES);
  const rest = totalPages > 1
    ? await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          getQuestionsArchive({ page: i + 2 }).catch(() => null)),
      )
    : [];

  for (const [i, archive] of [firstArchive, ...rest].entries()) {
    if (!archive) continue;
    if (i > 0) {
      push({ url: `${SITE_URL}/questions?page=${i + 1}`, lastModified: now, changeFrequency: "daily", priority: 0.5 });
    }
    for (const q of archive.questions ?? []) {
      push({
        url: `${SITE_URL}/questions/${buildSlug(q.text, q.id)}`,
        lastModified: q.createdAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  for (const q of home?.hotQuestions ?? []) {
    push({
      url: `${SITE_URL}/questions/${buildSlug(q.text, q.id)}`,
      lastModified: q.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const p of home?.posts ?? []) {
    push({
      url: `${SITE_URL}/post/${buildSlug(p.caption, p.id)}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const s of specialistsData?.specialists ?? []) {
    push({
      url: `${SITE_URL}/specialists/${buildSlug(s.name, s.id)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}
