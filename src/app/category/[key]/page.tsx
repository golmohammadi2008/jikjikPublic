import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "@/lib/api";
import { buildSlug } from "@/lib/slug";
import { OG_IMAGE, SITE_NAME } from "@/lib/config";
import { formatCount } from "@/lib/format";
import { collectionLd, jsonLdProps } from "@/lib/jsonLd";

type Props = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const data = await getCategory(key);
  if (!data) return {};

  const title = `سوال‌های ${data.category.label}`;
  const description = `سوال‌های حوزه ${data.category.label} با پاسخ هوش مصنوعی و متخصص در ${SITE_NAME}.`;

  return {
    title,
    description,
    alternates: { canonical: `/category/${key}` },
    /**
     * حوزه‌ی بی‌سوال = صفحه‌ی خالی. شش حوزه از هفت حوزه هیچ سوالی نداشتند و
     * هر شش‌تا با متنِ یکسانِ «سوالی ثبت نشده» سرو می‌شدند؛ سرچ‌کنسول همه را
     * در «Crawled - currently not indexed» می‌گذاشت و بودجه‌ی خزش صرفشان
     * می‌شد. تا وقتی محتوا ندارند noindex‌اند، ولی follow می‌مانند تا لینک‌های
     * داخلی‌شان دنبال شود. با اولین سوال، خودبه‌خود دوباره ایندکس‌پذیر می‌شوند.
     */
    ...(data.questions.length === 0 ? { robots: { index: false, follow: true } } : {}),
    // بدون این، og:url از لایه‌ی ریشه ارث می‌رسید و همه‌ی صفحه‌های دسته
    // خودشان را «https://weeno.ir» معرفی می‌کردند.
    openGraph: { title, description, url: `/category/${key}`, images: [OG_IMAGE] },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { key } = await params;
  const data = await getCategory(key);
  if (!data) notFound();

  const { category, questions } = data;

  // صفحه‌ی فهرست بود ولی هیچ داده‌ی ساختاریافته‌ای نداشت: نه مسیر راهنما
  // (که گوگل در خودِ نتیجه نشان می‌دهد) و نه ItemList که مسیرِ خزش به
  // سوال‌ها را صریح کند.
  const jsonLd = collectionLd({
    path: `/category/${key}`,
    name: `سوال‌های ${category.label}`,
    description: `سوال‌های حوزه ${category.label} با پاسخ هوش مصنوعی و متخصص در ${SITE_NAME}.`,
    crumbs: [{ name: "سوال‌ها", path: "/questions" }, { name: category.label }],
    items: questions.map((q) => ({ name: q.text, path: `/questions/${buildSlug(q.text, q.id)}` })),
  });

  return (
    <main className="wrap">
      <script {...jsonLdProps(jsonLd)} />
      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link href="/">{SITE_NAME}</Link> › <Link href="/questions">سوال‌ها</Link> › {category.label}
      </nav>

      <div className="section-head">
        <h2>سوال‌های {category.label}</h2>
      </div>

      {questions.length === 0 ? (
        <p style={{ color: "var(--ink-2)", padding: "20px 0" }}>در حال حاضر سوالی در این حوزه ثبت نشده.</p>
      ) : (
        <section className="related" style={{ marginTop: 0, paddingBottom: 40 }}>
          <ul>
            {questions.map((q) => (
              <li key={q.id}>
                <Link href={`/questions/${buildSlug(q.text, q.id)}`}>
                  <span>{q.text}</span>
                  <small>{formatCount(q.answerCount)} پاسخ</small>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
