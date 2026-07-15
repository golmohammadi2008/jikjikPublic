import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "@/lib/api";
import { buildSlug } from "@/lib/slug";
import { SITE_NAME } from "@/lib/config";
import { formatCount } from "@/lib/format";

type Props = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const data = await getCategory(key);
  if (!data) return {};
  return {
    title: `سوال‌های ${data.category.label}`,
    description: `سوال‌های حوزه ${data.category.label} با پاسخ هوش مصنوعی و متخصص در ${SITE_NAME}.`,
    alternates: { canonical: `/category/${key}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { key } = await params;
  const data = await getCategory(key);
  if (!data) notFound();

  const { category, questions } = data;

  return (
    <main className="wrap">
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
