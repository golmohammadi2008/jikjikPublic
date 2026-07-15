import type { MetadataRoute } from "next";
import { PUBLIC_INDEXING, SITE_URL } from "@/lib/config";

// فاز دمو: تا لانچ عمومی، همه‌جا بسته — env flag را روز لانچ true کن (README مربوطه)
export default function robots(): MetadataRoute.Robots {
  if (!PUBLIC_INDEXING) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
