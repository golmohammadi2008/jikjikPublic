import type { Metadata } from "next";
import Link from "next/link";
import { getHome } from "@/lib/api";
import { buildSlug } from "@/lib/slug";
import { SITE_NAME } from "@/lib/config";
import { formatCount } from "@/lib/format";

export const metadata: Metadata = {
  title: "سوال‌ها",
  description: `تازه‌ترین سوال‌های کاربران ${SITE_NAME} با پاسخ هوش مصنوعی و متخصص.`,
  alternates: { canonical: "/questions" },
};

// آرشیو کامل با جستجو/صفحه‌بندی در فاز بعد ساخته می‌شود؛ فعلاً همان
// سوال‌های داغ صفحه اصلی را نشان می‌دهد تا این مسیر ۴۰۴ ندهد.
export default async function QuestionsArchivePage() {
  const data = await getHome();
  const questions = data?.hotQuestions ?? [];

  return (
    <main className="wrap">
      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link href="/">{SITE_NAME}</Link> › سوال‌ها
      </nav>

      <div className="section-head">
        <h2>سوال‌ها</h2>
      </div>

      {questions.length === 0 ? (
        <p style={{ color: "var(--ink-2)", padding: "20px 0" }}>در حال حاضر سوالی برای نمایش وجود ندارد.</p>
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
