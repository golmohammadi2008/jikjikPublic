import { SITE_NAME, SITE_URL } from "./config";

/**
 * ساختِ داده‌ی ساختاریافته.
 *
 * چرا مشترک: گرافِ breadcrumb در هر صفحه دستی و کمی متفاوت نوشته شده بود و
 * نیمی از صفحه‌ها اصلاً نداشتندش. گوگل مسیر راهنما را در خودِ نتیجه نشان
 * می‌دهد، پس نداشتنش یعنی نتیجه‌ی لخت‌تر — و نسخه‌های دستیِ متفاوت یعنی هر
 * اصلاحی باید چند جا تکرار شود.
 */

type Crumb = { name: string; path?: string };

/**
 * مسیر راهنما. آخرین حلقه عمداً `item` ندارد: صفحه‌ی جاری است و لینک‌دادنش
 * به خودش چیزی به گوگل نمی‌گوید.
 */
export function breadcrumb(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
      ...crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.name,
        ...(c.path ? { item: `${SITE_URL}${c.path}` } : {}),
      })),
    ],
  };
}

/** صفحه‌ی ساده‌ی محتوایی (قوانین، حریم خصوصی، تماس، …) */
export function webPageLd({
  path,
  name,
  description,
  crumbs,
}: {
  path: string;
  name: string;
  description: string;
  crumbs: Crumb[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}${path}`,
    url: `${SITE_URL}${path}`,
    name,
    description,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` },
    breadcrumb: breadcrumb(crumbs),
  };
}

/** صفحه‌ی فهرست (دسته، آرشیو) — ItemList مسیرِ خزش را صریح می‌کند */
export function collectionLd({
  path,
  name,
  description,
  crumbs,
  items,
}: {
  path: string;
  name: string;
  description: string;
  crumbs: Crumb[];
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}${path}`,
    url: `${SITE_URL}${path}`,
    name,
    description,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` },
    breadcrumb: breadcrumb(crumbs),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: `${SITE_URL}${it.path}`,
      })),
    },
  };
}

/** تگِ اسکریپت — تا هر صفحه dangerouslySetInnerHTML را دوباره ننویسد */
export function jsonLdProps(data: unknown) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  } as const;
}
