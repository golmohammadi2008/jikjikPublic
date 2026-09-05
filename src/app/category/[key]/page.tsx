import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getSpecialists } from "@/lib/api";
import { buildSlug } from "@/lib/slug";
import { postTitle } from "@/lib/caption";
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
  // `posts` را صریح نرمال می‌کنیم: پاسخِ کش‌شده‌ی نسخه‌ی قبلیِ API این کلید را
  // نداشت و صفحه با «cannot read properties of undefined» ۵۰۰ می‌داد. شکلِ
  // ورودی از سرویسِ بیرونی می‌آید و نباید رندر را بشکند.
  return { ...data, posts: data.posts ?? [], specialists };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const data = await loadCategory(key);
  // ⚠️ `notFound()` باید *این‌جا* باشد نه در کامپوننت صفحه: رندرِ کامپوننت
  // استریم می‌شود و آن‌جا دیگر کدِ وضعیت ممکن نیست، پس صفحه‌ی «پیدا نشد» با
  // **۲۰۰** سرو می‌شد — برای گوگل یعنی soft 404: آدرسی که وجود ندارد ولی
  // می‌گوید سالم است. generateMetadata پیش از باز شدنِ استریم تمام می‌شود.
  if (!data) notFound();

  const title = `${data.category.label} — مطالب و متخصص‌ها`;
  const description = `مطالب و متخصص‌های حوزه ${data.category.label} در ${SITE_NAME}.`;

  return {
    title,
    description,
    alternates: { canonical: `/category/${key}` },
    /**
     * حوزه‌ی بی‌محتوا = صفحه‌ی خالی، و صفحه‌ی خالی نباید ایندکس شود: بودجه‌ی
     * خزش صرفش می‌شود و در سرچ‌کنسول زیر «Excluded by noindex» می‌نشیند.
     * follow می‌ماند تا لینک‌های داخلی‌اش دنبال شوند.
     *
     * «خالی» قبلاً فقط یعنی «بدون محتوا» بود، و همین `/category/education` را
     * با چهار متخصصِ واقعی از ایندکس بیرون می‌گذاشت. حالا نبودِ *هر دو*
     * ملاک است — همان چیزی که صفحه در عمل نشان می‌دهد.
     */
    ...(data.posts.length === 0 && data.specialists.length === 0
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

  const { category, posts, specialists } = data;

  // مسیر راهنما (که گوگل در خودِ نتیجه نشان می‌دهد) و ItemList که مسیرِ خزش
  // به پست‌های حوزه را صریح می‌کند.
  const jsonLd = collectionLd({
    path: `/category/${key}`,
    name: `مطالب ${category.label}`,
    description: `مطالب و متخصص‌های حوزه ${category.label} در ${SITE_NAME}.`,
    crumbs: [{ name: "متخصص‌ها", path: "/specialists" }, { name: category.label }],
    items: posts.map((p) => ({ name: postTitle(p.title, p.caption), path: `/post/${buildSlug(p.title || p.caption, p.id)}` })),
  });

  return (
    <main className="wrap">
      <script {...jsonLdProps(jsonLd)} />
      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link href="/">{SITE_NAME}</Link> › <Link href="/specialists">متخصص‌ها</Link> › {category.label}
      </nav>

      <div className="section-head">
        <h2>مطالب {category.label}</h2>
      </div>

      {posts.length === 0 ? (
        <p style={{ color: "var(--ink-2)", padding: "20px 0" }}>در حال حاضر مطلبی در این حوزه منتشر نشده.</p>
      ) : (
        <section className="related" style={{ marginTop: 0, paddingBottom: 40 }}>
          <ul>
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={`/post/${buildSlug(p.title || p.caption, p.id)}`}>
                  <span>{postTitle(p.title, p.caption)}</span>
                  <small>{formatCount(p.likesCount)} پسند</small>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* متخصص‌های همین حوزه. برای حوزه‌ای که هنوز مطلبی ندارد، این تنها
          محتوای واقعی صفحه است — و همان چیزی که از noindex بیرونش می‌آورد.
          برای کاربر هم مسیرِ بعدی را می‌سازد: مطلبی نیست، ولی کسی هست که
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
