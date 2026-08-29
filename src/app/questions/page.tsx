import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuestionsArchive } from "@/lib/api";
import { buildSlug } from "@/lib/slug";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import { pageMeta } from "@/lib/pageMeta";
import { formatCount } from "@/lib/format";

type Props = { searchParams: Promise<{ page?: string; category?: string; sort?: string }> };

function buildUrl(params: { page?: number; category?: string; sort?: string }) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.sort && params.sort !== "newest") qs.set("sort", params.sort);
  if (params.page && params.page > 1) qs.set("page", String(params.page));
  const s = qs.toString();
  return `/questions${s ? `?${s}` : ""}`;
}

/**
 * پارامترهای این صفحه فضای خزشِ بی‌پایان می‌ساختند.
 *
 * `?page=99` و `?category=notacategory` هر دو ۲۰۰ و `index, follow`
 * برمی‌گشتند و خودشان را کانونیکال اعلام می‌کردند. بدتر: بک‌اند دسته‌ی
 * ناشناخته را نادیده می‌گیرد و **همه‌ی** سوال‌ها را می‌دهد، پس هر رشته‌ی
 * دلخواهی یک کپیِ کاملِ `/questions` زیر نشانیِ تازه بود — همان چیزی که در
 * سرچ‌کنسول «Duplicate without user-selected canonical» می‌شود. و
 * `?page=<هرچه>` صفحه‌ی خالیِ ایندکس‌پذیر می‌ساخت.
 *
 * حالا پارامترِ نامعتبر ۴۰۴ می‌گیرد و صفحه‌ی معتبر ولی خالی noindex می‌شود.
 */
async function resolveParams(sp: { page?: string; category?: string; sort?: string }) {
  const page = Math.max(1, parseInt(sp.page || "1") || 1);
  const sort = sp.sort === "top" ? "top" : "newest";
  const category = sp.category;

  const data = await getQuestionsArchive({ page, category, sort });

  // دسته‌ای که وجود ندارد یعنی نشانی وجود ندارد
  if (category && !(data?.categories ?? []).some((c) => c.key === category)) notFound();
  // شماره‌ی صفحه‌ی بیرون از بازه هم همین‌طور
  if (page > 1 && page > (data?.totalPages ?? 1)) notFound();

  return { page, category, sort, data };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const { page, category, sort, data } = await resolveParams(sp);
  const categoryLabel = (data?.categories ?? []).find((c) => c.key === category)?.label ?? category;
  // ترتیب در کانونیکال نمی‌آید. `?sort=top` همان مجموعه‌ی سوال‌هاست با چیدمانِ
  // دیگر، نه صفحه‌ی تازه‌ای؛ وقتی هر ترکیب خودش را کانونیکال اعلام می‌کرد،
  // گوگل آن‌ها را تکراری می‌دید و خودش کانونیکالِ دیگری انتخاب می‌کرد
  // («Duplicate, Google chose different canonical»). دسته و شماره‌ی صفحه
  // می‌مانند چون واقعاً محتوای متفاوتی نشان می‌دهند.
  const canonical = buildUrl({ page, category, sort: "newest" });

  // برچسبِ فارسی، نه کلیدِ لاتین: عنوان تا امروز «سوال‌های حوزه doctor» بود
  const title = category
    ? `سوال‌های حوزه ${categoryLabel}${page > 1 ? ` — صفحه ${page}` : ""}`
    : `همه سوال‌ها${page > 1 ? ` — صفحه ${page}` : ""}`;

  // og:url هم از همان `canonical` می‌آید. تا پیش از این تعریف نمی‌شد و
  // نسخه‌ی layout ریشه (که SITE_URL ثابت بود) به ارث می‌رسید — یعنی این
  // صفحه هم‌زمان می‌گفت کانونیکالش «/questions?page=۲» است و og:urlش
  // صفحه‌ی اصلی، که دقیقاً همان تناقضی است که چند خط بالاتر رفعش کردیم.
  return {
    ...pageMeta({
      title,
      description: `مرور سوال‌های کاربران ${SITE_NAME} با پاسخ فوری هوش مصنوعی و پاسخ متخصص تاییدشده.`,
      path: canonical,
    }),
    // دسته‌ی معتبر ولی بی‌سوال، صفحه‌ی خالی است و صفحه‌ی خالی ایندکس نمی‌شود.
    // follow می‌ماند تا لینک‌های داخلی‌اش دنبال شوند.
    ...((data?.questions ?? []).length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function QuestionsArchivePage({ searchParams }: Props) {
  const sp = await searchParams;
  const { page, category, sort, data } = await resolveParams(sp);
  const questions = data?.questions ?? [];
  const categories = data?.categories ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category ? `سوال‌های حوزه ${category}` : "همه سوال‌ها",
    url: `${SITE_URL}${buildUrl({ page, category, sort })}`,
  };

  return (
    <main className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link href="/">{SITE_NAME}</Link> › سوال‌ها
      </nav>

      <div className="section-head">
        <h1>همه سوال‌ها</h1>
      </div>

      <div className="filter-bar">
        <div className="filter-chips">
          <Link href={buildUrl({ category: undefined, sort })} className={`filter-chip${!category ? " active" : ""}`}>
            همه
          </Link>
          {categories.map((c) => (
            <Link
              key={c.key}
              href={buildUrl({ category: c.key, sort })}
              className={`filter-chip${category === c.key ? " active" : ""}`}
            >
              {c.label} ({formatCount(c.count)})
            </Link>
          ))}
        </div>

        <div className="filter-tools">
          <Link href={buildUrl({ category, sort: "newest" })} className={`filter-chip${sort === "newest" ? " active" : ""}`}>
            جدیدترین
          </Link>
          <Link href={buildUrl({ category, sort: "top" })} className={`filter-chip${sort === "top" ? " active" : ""}`}>
            پرپاسخ‌ترین
          </Link>
        </div>
      </div>

      <p className="filter-count">{formatCount(total)} سوال</p>

      {questions.length === 0 ? (
        <p style={{ color: "var(--ink-2)", padding: "20px 0" }}>در حال حاضر سوالی برای نمایش وجود ندارد.</p>
      ) : (
        <div className="qa-list" style={{ paddingBottom: 24 }}>
          {questions.map((q) => (
            <Link key={q.id} href={`/questions/${buildSlug(q.text, q.id)}`} className="qa-row">
              <div className="qa-row-main">
                <span className="chip">{q.categoryLabel}</span>
                <p className="qa-row-text">{q.text}</p>
              </div>
              <div className="qa-row-meta">
                {q.specialistAnswerCount > 0 && (
                  <span className="qa-row-expert">{formatCount(q.specialistAnswerCount)} پاسخ متخصص</span>
                )}
                <span>{formatCount(q.answerCount)} پاسخ</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="pagination" aria-label="صفحه‌بندی">
          {page > 1 && (
            <Link href={buildUrl({ category, sort, page: page - 1 })} className="btn btn-ghost btn-sm">
              ← قبلی
            </Link>
          )}
          <span className="pagination-info">
            صفحه {page.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
          </span>
          {page < totalPages && (
            <Link href={buildUrl({ category, sort, page: page + 1 })} className="btn btn-ghost btn-sm">
              بعدی →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
