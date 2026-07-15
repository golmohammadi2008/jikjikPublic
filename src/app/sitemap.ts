import type { MetadataRoute } from "next";
import { getHome, getSpecialists } from "@/lib/api";
import { buildSlug } from "@/lib/slug";
import { SITE_URL } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [home, specialistsData] = await Promise.all([getHome(), getSpecialists()]);

  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/questions`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/specialists`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  for (const c of home?.categories ?? []) {
    entries.push({ url: `${SITE_URL}/category/${c.key}`, changeFrequency: "daily", priority: 0.7 });
  }
  for (const q of home?.hotQuestions ?? []) {
    entries.push({
      url: `${SITE_URL}/questions/${buildSlug(q.text, q.id)}`,
      lastModified: q.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }
  for (const p of home?.posts ?? []) {
    entries.push({
      url: `${SITE_URL}/post/${buildSlug(p.caption, p.id)}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }
  for (const s of specialistsData?.specialists ?? []) {
    entries.push({
      url: `${SITE_URL}/specialists/${buildSlug(s.name, s.id)}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}
