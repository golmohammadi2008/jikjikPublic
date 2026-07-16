import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuestion } from "@/lib/api";
import { buildSlug, extractObjectId } from "@/lib/slug";
import { SITE_NAME, SITE_URL, panelAskUrl, panelUserUrl } from "@/lib/config";
import { deriveTitle, excerpt, formatCount, formatJalali } from "@/lib/format";
import Avatar from "@/components/Avatar";
import VoiceAnswer from "@/components/VoiceAnswer";

type Props = { params: Promise<{ slug: string }> };

async function loadQuestion(slug: string) {
  const id = extractObjectId(slug);
  if (!id) return null;
  const data = await getQuestion(id);
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadQuestion(slug);
  if (!data) return {};

  const { question, answers } = data;
  const title = deriveTitle(question.text, 90);
  const topAnswer = answers.find((a) => !a.isAi) ?? answers[0];
  const description = topAnswer ? excerpt(topAnswer.body, 155) : excerpt(question.text, 155);
  const canonicalSlug = buildSlug(question.text, question.id);

  return {
    title: `${title} | پاسخ متخصص و هوش مصنوعی`,
    description,
    alternates: { canonical: `/questions/${canonicalSlug}` },
    openGraph: {
      type: "article",
      title: `${title} — پاسخ متخصص در ${SITE_NAME}`,
      description: "پاسخ فوری هوش مصنوعی + پاسخ متخصص تاییدشده.",
      url: `/questions/${canonicalSlug}`,
    },
  };
}

export default async function QuestionPage({ params }: Props) {
  const { slug } = await params;
  const data = await loadQuestion(slug);
  if (!data) notFound();

  const { question, answers, related } = data;
  const aiAnswers = answers.filter((a) => a.isAi);
  const expertAnswers = answers
    .filter((a) => !a.isAi)
    .sort((a, b) => b.likeCount - a.likeCount);
  const topExpert = expertAnswers[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: deriveTitle(question.text, 110),
      text: question.text,
      dateCreated: question.createdAt,
      answerCount: question.answerCount,
      author: { "@type": "Person", name: "کاربر وینو" },
      ...(topExpert
        ? {
            acceptedAnswer: {
              "@type": "Answer",
              text: topExpert.body,
              dateCreated: topExpert.createdAt,
              upvoteCount: topExpert.likeCount,
              url: `${SITE_URL}/questions/${buildSlug(question.text, question.id)}#answer-${topExpert.id}`,
              author: { "@type": "Person", name: topExpert.responder?.name ?? "متخصص وینو" },
            },
          }
        : {}),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "سوال‌ها", item: `${SITE_URL}/questions` },
        {
          "@type": "ListItem",
          position: 3,
          name: question.categoryLabel,
          item: `${SITE_URL}/category/${question.category}`,
        },
        { "@type": "ListItem", position: 4, name: deriveTitle(question.text, 110) },
      ],
    },
  };

  return (
    <main className="wrap q-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link href="/">{SITE_NAME}</Link> › <Link href="/questions">سوال‌ها</Link> ›{" "}
        <Link href={`/category/${question.category}`}>{question.categoryLabel}</Link>
      </nav>

      <article>
        <h1>{question.text}</h1>
        <div className="q-meta">
          <span className="chip">{question.categoryLabel}</span>
          <span>پرسیده‌شده توسط کاربر وینو (بی‌نام)</span>
          <span>·</span>
          <time dateTime={question.createdAt}>{formatJalali(question.createdAt)}</time>
        </div>

        <div className="thread" style={{ marginTop: 26 }}>
          {aiAnswers.map((a) => (
            <div className="thread-item ai" key={a.id}>
              <div className="answer-card ai-card">
                <div className="a-head">
                  <span className="chip chip-ai">✦ پاسخ هوش مصنوعی وینو</span>
                  <small style={{ color: "var(--ink-3)" }}>همان لحظه ثبت سوال</small>
                </div>
                <div className="a-body">
                  <p>{a.body}</p>
                  {a.audioUrl && (
                    <VoiceAnswer answerId={a.id} audioUrl={a.audioUrl} initialTranscript={a.transcript} />
                  )}
                </div>
                <p className="ai-disclaimer">این پاسخ توسط هوش مصنوعی تولید شده و جایگزین ارزیابی و نظر متخصص نیست.</p>
              </div>
            </div>
          ))}

          {expertAnswers.map((a, idx) => {
            const authorSlug = a.responder ? buildSlug(a.responder.name, a.responder.id) : null;
            return (
              <div className="thread-item expert" id={`answer-${a.id}`} key={a.id}>
                <div className="answer-card">
                  {idx === 0 && (
                    <div className="a-head">
                      <span className="chip" style={{ background: "var(--saffron-tint)", color: "var(--saffron-deep)" }}>
                        ★ پاسخ برتر
                      </span>
                      {a.likeCount > 0 && (
                        <small style={{ color: "var(--ink-3)" }}>{formatCount(a.likeCount)} نفر مفید دانستند</small>
                      )}
                    </div>
                  )}
                  <div className="a-body">
                    <p>{a.body}</p>
                    {a.audioUrl && (
                      <VoiceAnswer answerId={a.id} audioUrl={a.audioUrl} initialTranscript={a.transcript} />
                    )}
                  </div>
                  {a.responder && (
                    <div className="expert-strip">
                      <Link className="who" href={`/specialists/${authorSlug}`}>
                        <Avatar name={a.responder.name} src={a.responder.avatar} />
                        <span>
                          <b>{a.responder.name}</b>
                          <br />
                          <small style={{ color: "var(--ink-2)" }}>
                            {a.page?.specialty || question.categoryLabel}
                            {a.page?.ratingAvg ? ` · ⭐ ${a.page.ratingAvg.toFixed(1)} (${formatCount(a.page.ratingCount)} نظر)` : ""}
                          </small>
                        </span>
                      </Link>
                      <a
                        className={idx === 0 ? "btn btn-saffron btn-sm" : "btn btn-ghost btn-sm"}
                        href={panelUserUrl(a.responder.username)}
                      >
                        {idx === 0 ? `رزرو جلسه با ${a.responder.name}` : "رزرو جلسه"}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <aside className="ask-cta">
          <h2>سوال مشابهی داری؟</h2>
          <p>بپرس؛ همان لحظه پاسخ هوش مصنوعی می‌گیری و متخصص‌ها هم جواب می‌دهند. رایگان و بی‌نام.</p>
          <a className="btn btn-saffron" href={panelAskUrl()}>
            سوالم را می‌پرسم
          </a>
        </aside>

        {related.length > 0 && (
          <section className="related" aria-label="سوال‌های مرتبط">
            <h2>سوال‌های مرتبط</h2>
            <ul>
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/questions/${buildSlug(r.text, r.id)}`}>
                    <span>{r.text}</span>
                    <small>{formatCount(r.answerCount)} پاسخ</small>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  );
}
