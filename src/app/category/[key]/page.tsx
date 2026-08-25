import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getSpecialists } from "@/lib/api";
import { buildSlug } from "@/lib/slug";
import { OG_IMAGE, SITE_NAME } from "@/lib/config";
import { formatCount } from "@/lib/format";
import { collectionLd, jsonLdProps } from "@/lib/jsonLd";

type Props = { params: Promise<{ key: string }> };

/**
 * محتوای صفحه‌ی یک حوزه: سوال‌هایش و متخصص‌هایش.
 *
 * متخصص‌ها تا امروز اصلاً در این صفحه نمی‌آمدند و «خالی بودن» فقط از روی
 * تعداد سوال سنجیده می‌شد. نتیجه‌اش این بود که `/category/education` با
 * چهار متخصصِ فعال، به‌عنوان صفحه‌ی خالی noindex می‌شد — محتوا وجود داشت و
 * صفحه نشانش نمی‌داد.
 *
 * فهرست متخصص‌ها کوچک است (کلِ سایت) و روی کشِ خودش می‌نشیند، پس فیلترکردن
 * همین‌جا از افزودن یک اندپوینت تازه ساده‌تر و ارزان‌تر است.
 */
async function loadCategory(key: string) {
  const [data, specialistsData] = await Promise.all([
    getCategory(key),
    getSpecialists().catch(() => null),
  ]);
  if (!data) return null;

  const specialists = (specialistsData?.specialists ?? []).filter((s) => s.category === key);
  return { ...data, specialists };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const data = await loadCategory(key);
  if (!data) return {};

  const title = `سوال‌های ${data.category.label}`;
  const description = `سوال‌های حوزه ${data.category.label} با پاسخ هوش مصنوعی و متخصص در ${SITE_NAME}.`;

  return {
    title,
    description,
    alternates: { canonical: `/category/${key}` },
    /**
     * حوزه‌ی بی‌محتوا = صفحه‌ی خالی، و صفحه‌ی خالی نباید ایندکس شود: بودجه‌ی
     * خزش صرفش می‌شود و در سرچ‌کنسول زیر «Excluded by noindex» می‌نشیند.
     * follow می‌ماند تا لینک‌های داخلی‌اش دنبال شوند.
     *
     * «خالی» قبلاً فقط یعنی «بدون سوال» بود، و همین `/category/education` را
     * با چهار متخصصِ واقعی از ایندکس بیرون می‌گذاشت. حالا نبودِ *هر دو*
     * ملاک است — همان چیزی که صفحه در عمل نشان می‌دهد.
     */
    ...(data.questions.length === 0 && data.specialists.length === 0
      ? { robots: { index: false, follow: true } }
      : {}),
    // بدون این، og:url از لایه‌ی ریشه ارث می‌رسید و همه‌ی صفحه‌های دسته
    // خودشان را «https://weeno.ir» معرفی می‌کردند.
    openGraph: { title, description, url: `/category/${key}`, images: [OG_IMAGE] },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { key } = await params;
  const data = await loadCategory(key);
  if (!data) notFound();

  const { category, questions, specialists } = data;

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

      {/* متخصص‌های همین حوزه. برای حوزه‌ای که هنوز سوالی ندارد، این تنها
          محتوای واقعی صفحه است — و همان چیزی که از noindex بیرونش می‌آورد.
          برای کاربر هم مسیرِ بعدی را می‌سازد: سوالی نیست، ولی کسی هست که
          بشود از او پرسید. */}
      {specialists.length > 0 && (
        <section className="related" style={{ marginTop: 0, paddingBottom: 40 }}>
          <div className="section-head">
            <h2>متخصص‌های {category.label}</h2>
          </div>
          <ul>
            {specialists.map((s) => (
              <li key={s.id}>
                <Link href={`/specialists/${buildSlug(s.name, s.id)}`}>
                  <span>{s.name}</span>
                  {s.specialty ? <small>{s.specialty}</small> : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
