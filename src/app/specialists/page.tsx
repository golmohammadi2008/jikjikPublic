import type { Metadata } from "next";
import Link from "next/link";
import { getSpecialists } from "@/lib/api";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import { pageMeta } from "@/lib/pageMeta";
import SpecialistsFilter from "@/components/SpecialistsFilter";
import { buildSlug } from "@/lib/slug";

export const metadata: Metadata = pageMeta({
  title: "متخصص‌ها",
  description: `فهرست متخصص‌های تاییدشده ${SITE_NAME} — پزشکی، حقوقی، ورزشی و بیشتر.`,
  path: "/specialists",
});

export default async function SpecialistsPage() {
  const data = await getSpecialists();
  const specialists = data?.specialists ?? [];

  // این صفحه هیچ داده‌ی ساختاریافته‌ای نداشت. ItemList به گوگل می‌گوید فهرست
  // است و اعضایش کدام‌اند، و مسیرِ خزش به پروفایل‌ها را صریح می‌کند.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/specialists`,
    name: "متخصص‌های تاییدشده",
    description: `فهرست متخصص‌های تاییدشده ${SITE_NAME}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "متخصص‌ها", item: `${SITE_URL}/specialists` },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: specialists.length,
      itemListElement: specialists.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/specialists/${buildSlug(s.name, s.id)}`,
        name: s.name,
      })),
    },
  };

  return (
    <main className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link href="/">{SITE_NAME}</Link> › متخصص‌ها
      </nav>

      <div className="section-head">
        <h1>متخصص‌های تاییدشده</h1>
      </div>

      {specialists.length === 0 ? (
        <p style={{ color: "var(--ink-2)", padding: "20px 0" }}>در حال حاضر متخصصی برای نمایش وجود ندارد.</p>
      ) : (
        <SpecialistsFilter specialists={specialists} />
      )}
    </main>
  );
}
