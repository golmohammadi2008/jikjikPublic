import type { Metadata } from "next";
import Link from "next/link";
import { Button, Col, Row } from "antd";
import { getHome, getProducts } from "@/lib/api";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/config";
import { buildPostSlug } from "@/lib/slug";
import PostCard from "@/components/PostCard";
import PageCrumbs from "@/components/PageCrumbs";
import { Title } from "@/components/ui";

type Props = { searchParams: Promise<{ category?: string; before?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category, before } = await searchParams;
  const title = `فروشگاه ${SITE_NAME} — محصولات متخصص‌ها با پرداخت امن`;
  return {
    title,
    description: "محصولات و فایل‌هایی که متخصص‌های تاییدشده‌ی وینو می‌فروشند؛ پرداخت امانی، مبلغ تا تحویل نزد وینو می‌ماند.",
    // صفحه‌های بعدیِ فهرست تکراری‌اند؛ گوگل فقط صفحه‌ی اول را نمایه کند
    ...(before ? { robots: { index: false, follow: true } } : {}),
    alternates: { canonical: category ? `/shop?category=${encodeURIComponent(category)}` : "/shop" },
    openGraph: { title, url: "/shop", images: [OG_IMAGE] },
  };
}

/**
 * فروشگاهِ سایت عمومی — فقط نمایش و سئو. «خرید» به تسویه‌ی پنل می‌رود، چون
 * پرداختِ امانی حسابِ کاربری و کیف پول می‌خواهد.
 */
export default async function ShopPage({ searchParams }: Props) {
  const { category, before } = await searchParams;
  const [page, home] = await Promise.all([getProducts({ category, before }), getHome()]);
  const products = page?.products ?? [];
  const categories = home?.categories ?? [];
  const current = categories.find((c) => c.key === category);

  const nextHref = page?.nextCursor
    ? `/shop?${new URLSearchParams({ ...(category ? { category } : {}), before: page.nextCursor }).toString()}`
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `فروشگاه ${SITE_NAME}`,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/post/${buildPostSlug(p)}`,
    })),
  };

  return (
    <main className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageCrumbs trail={[{ title: "فروشگاه" }]} />

      <section className="shop-hero">
        <Title level={1}>{current ? `فروشگاه — ${current.label}` : "فروشگاه متخصص‌ها"}</Title>
        <p>
          محصولات، کتاب‌ها، فایل‌ها و ابزارهایی که متخصص‌های تاییدشده‌ی وینو عرضه می‌کنند — همان کسانی که
          می‌توانی از آن‌ها سوال بپرسی یا با آن‌ها جلسه بگذاری.
        </p>
      </section>

      <div className="info-grid">
        <div><b>پرداخت امانی</b>مبلغ تا وقتی کالا را تحویل بگیری نزد وینو می‌ماند و به فروشنده نمی‌رسد.</div>
        <div><b>فروشنده‌ی تاییدشده</b>فقط متخصص‌هایی که هویت و مدارکشان بررسی شده می‌توانند بفروشند.</div>
        <div><b>مرجوعی و پشتیبانی</b>اگر مشکلی بود، مرجوعی را با فروشنده هماهنگ کن یا پشتیبانی داوری می‌کند.</div>
      </div>

      {categories.length > 0 && (
        <nav className="shop-cats" aria-label="حوزه‌ها">
          <Link href="/shop" className={!category ? "on" : ""}>همه</Link>
          {categories.map((c) => (
            <Link key={c.key} href={`/shop?category=${c.key}`} className={category === c.key ? "on" : ""}>{c.label}</Link>
          ))}
        </nav>
      )}

      {products.length === 0 ? (
        <p className="empty" style={{ textAlign: "center", padding: "48px 0", color: "#6b7280" }}>
          {before ? "محصول دیگری نیست." : "هنوز محصولی در این بخش نیست."}
        </p>
      ) : (
        <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
          {products.map((p) => (
            <Col key={p.id} xs={24} sm={12} lg={8}>
              <PostCard post={p} />
            </Col>
          ))}
        </Row>
      )}

      {nextHref && (
        <div className="shop-more">
          <Button href={nextHref}>محصولات بیشتر</Button>
        </div>
      )}
    </main>
  );
}
