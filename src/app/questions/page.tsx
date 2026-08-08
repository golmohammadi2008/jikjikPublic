import type { Metadata } from "next";
import Link from "next/link";
import { getQuestionsArchive } from "@/lib/api";
import { buildSlug } from "@/lib/slug";
import { SITE_NAME, SITE_URL } from "@/lib/config";
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

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1") || 1);
  const category = sp.category;
  const sort = sp.sort === "top" ? "top" : "newest";
  // ترتیب در کانونیکال نمی‌آید. `?sort=top` همان مجموعه‌ی سوال‌هاست با چیدمانِ
  // دیگر، نه صفحه‌ی تازه‌ای؛ وقتی هر ترکیب خودش را کانونیکال اعلام می‌کرد،
  // گوگل آن‌ها را تکراری می‌دید و خودش کانونیکالِ دیگری انتخاب می‌کرد
  // («Duplicate, Google chose different canonical»). دسته و شماره‌ی صفحه
  // می‌مانند چون واقعاً محتوای متفاوتی نشان می‌دهند.
  const canonical = buildUrl({ page, category, sort: "newest" });

  const title = category
    ? `سوال‌های حوزه ${category}${page > 1 ? ` — صفحه ${page}` : ""}`
    : `همه سوال‌ها${page > 1 ? ` — صفحه ${page}` : ""}`;

  return {
    title,
    description: `مرور سوال‌های کاربران ${SITE_NAME} با پاسخ فوری هوش مصنوعی و پاسخ متخصص تاییدشده.`,
    alternates: { canonical },
  };
}

export default async function QuestionsArchivePage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1") || 1);
  const category = sp.category;
  const sort = sp.sort === "top" ? "top" : "newest";

  const data = await getQuestionsArchive({ page, category, sort });
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
