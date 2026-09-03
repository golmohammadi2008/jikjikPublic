import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getQuestion } from "@/lib/api";
import { buildSlug, extractObjectId } from "@/lib/slug";
import { OG_IMAGE, SITE_NAME, SITE_URL, panelAskUrl, panelUserUrl } from "@/lib/config";
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
  // ⚠️ `notFound()` باید *این‌جا* باشد نه در کامپوننت صفحه: رندرِ کامپوننت
  // استریم می‌شود و آن‌جا دیگر کدِ وضعیت ممکن نیست، پس صفحه‌ی «پیدا نشد» با
  // **۲۰۰** سرو می‌شد — برای گوگل یعنی soft 404: آدرسی که وجود ندارد ولی
  // می‌گوید سالم است. generateMetadata پیش از باز شدنِ استریم تمام می‌شود.
  if (!data) notFound();

  const { question, answers } = data;
  const title = deriveTitle(question.text, 90);
  // پاسخِ متخصص را ترجیح می‌دهیم، ولی فقط اگر *متن* داشته باشد: پاسخِ صوتی
  // body خالی دارد و انتخابش، توضیحِ متا را خالی می‌کرد (گوگل صفحه‌ی بی‌توضیح
  // را «Crawled - currently not indexed» می‌گذارد). ترتیب: متخصصِ متن‌دار →
  // هر پاسخِ متن‌دار → خودِ متنِ سوال.
  const withText = answers.filter((a) => (a.body || '').trim());
  const topAnswer = withText.find((a) => !a.isAi) ?? withText[0];
  const description = excerpt(topAnswer?.body || question.text, 155);
  const canonicalSlug = buildSlug(question.text, question.id);
  // ریدایرکت باید *در متادیتا* باشد نه در کامپوننت صفحه: این مسیر
  // `loading.tsx` دارد، یعنی رندرش استریم می‌شود، و `redirect()` در بستر
  // استریم — طبق مستندات Next — کدِ وضعیت نمی‌دهد و صفحه را کامل رندر
  // می‌کند. نتیجه‌اش ۲۰۰ روی نشانیِ غیرکانونیکال با محتوای کامل بود: دقیقاً
  // همان صفحه‌ی تکراری که می‌خواستیم حذفش کنیم. این‌جا رندر اصلاً شروع
  // نمی‌شود و فقط ریدایرکت می‌رود.
  if (slug !== canonicalSlug) permanentRedirect(`/questions/${canonicalSlug}`);

  return {
    title: `${title} | پاسخ متخصص و هوش مصنوعی`,
    description,
    alternates: { canonical: `/questions/${canonicalSlug}` },
    openGraph: {
      type: "article",
      title: `${title} — پاسخ متخصص در ${SITE_NAME}`,
      description: "پاسخ فوری هوش مصنوعی + پاسخ متخصص تاییدشده.",
      url: `/questions/${canonicalSlug}`,
      images: [OG_IMAGE],
    },
  };
}

export default async function QuestionPage({ params }: Props) {
  const { slug } = await params;
  const data = await loadQuestion(slug);
  if (!data) notFound();

  const { question, answers, related } = data;
  // اسلاگِ غیرکانونیکال را ۳۰۸ می‌کنیم به‌جای سرو با تگ canonical.
  // چرا: هر اسلاگی که به همان ObjectId ختم شود ۲۰۰ می‌گرفت، پس با هر ویرایشِ
  // متن، نشانیِ قدیمی هم زنده می‌ماند و گوگل آن را «Alternate page with proper
  // canonical tag» ثبت می‌کرد — بودجه‌ی خزش صرفِ تکراری‌ها می‌شد. ریدایرکت،
  // سیگنال‌ها را روی یک نشانی جمع می‌کند.
  const canonicalSlug = buildSlug(question.text, question.id);
  // تورِ ایمنی — ریدایرکتِ واقعی در generateMetadata بالا انجام شده
  if (slug !== canonicalSlug) permanentRedirect(`/questions/${canonicalSlug}`);

  const aiAnswers = answers.filter((a) => a.isAi);
  const expertAnswers = answers
    .filter((a) => !a.isAi)
    .sort((a, b) => b.likeCount - a.likeCount);
  /**
   * متنِ پاسخ برای داده‌ی ساختاریافته.
   *
   * پاسخِ صوتی `body` خالی دارد و متنش در transcript است. بدونِ این، گوگل
   * روی acceptedAnswer خطای بحرانیِ «Missing field text» می‌داد و صفحه از
   * نتایج غنی بیرون می‌افتاد.
   */
  const answerText = (a: (typeof answers)[number]) =>
    (a.body || "").trim() || (a.transcript || "").trim();

  /**
   * پاسخِ پذیرفته‌شده باید **متن داشته باشد**، وگرنه اصلاً اعلامش نمی‌کنیم.
   * پرلایک‌ترین پاسخ ممکن است صوتیِ بدونِ رونویسی باشد؛ در آن حالت سراغ
   * پاسخِ بعدی می‌رویم به‌جای فرستادنِ یک acceptedAnswerِ بی‌متن.
   */
  const accepted = expertAnswers.find((a) => answerText(a).length > 0);
  /**
   * پاسخ‌های هوش مصنوعی هم وارد داده‌ی ساختاریافته می‌شوند (به‌عنوانِ
   * suggestedAnswer، نه acceptedAnswer).
   *
   * چرا: آرشیو هر سوالِ تأییدشده را برمی‌گرداند، حتی سوالی که هنوز هیچ
   * متخصصی جوابش نداده. تا پیش از این فقط expertAnswers به JSON-LD می‌رفت،
   * پس آن صفحه‌ها یک QAPage می‌شدند که Question‌اش نه acceptedAnswer داشت
   * نه suggestedAnswer — همان خطای بحرانیِ سرچ‌کنسول
   * («Either "acceptedAnswer" or "suggestedAnswer" should be specified»)
   * که کلِ صفحه را از نتایج غنی بیرون می‌انداخت.
   */
  const anchorFor = (id: string) =>
    `${SITE_URL}/questions/${canonicalSlug}#answer-${id}`;

  const answerNode = (a: (typeof answers)[number]) => ({
    "@type": "Answer",
    text: answerText(a),
    dateCreated: a.createdAt,
    upvoteCount: a.likeCount,
    url: anchorFor(a.id),
    author: a.isAi
      ? { "@type": "Organization", name: `هوش مصنوعی ${SITE_NAME}`, url: `${SITE_URL}/` }
      : {
          "@type": "Person",
          name: a.responder?.name ?? `متخصص ${SITE_NAME}`,
          url: a.responder
            ? `${SITE_URL}/specialists/${buildSlug(a.responder.name, a.responder.id)}`
            : `${SITE_URL}/specialists`,
        },
  });

  const suggested = [...expertAnswers, ...aiAnswers].filter(
    (a) => a !== accepted && answerText(a).length > 0
  );

  /**
   * سوالِ بی‌پاسخ اصلاً QAPage نیست.
   *
   * اگر هیچ پاسخِ متن‌داری نمانده باشد، به‌جای فرستادنِ یک QAPageِ ناقص،
   * صفحه را WebPage اعلام می‌کنیم. بردکرامب سرِ جایش می‌ماند تا صفحه بدونِ
   * داده‌ی ساختاریافته نماند.
   */
  const hasAnswerData = Boolean(accepted) || suggested.length > 0;

  const breadcrumb = {
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
  };

  const jsonLd = hasAnswerData
    ? {
        "@context": "https://schema.org",
        "@type": "QAPage",
        mainEntity: {
          "@type": "Question",
          name: deriveTitle(question.text, 110),
          text: question.text,
          dateCreated: question.createdAt,
          // answerCount باید با تعدادِ پاسخ‌هایی که واقعاً اعلام می‌کنیم بخواند،
          // نه با شمارنده‌ی سرور که پاسخِ بی‌متن را هم می‌شمارد.
          answerCount: (accepted ? 1 : 0) + suggested.length,
          // پرسش‌ها ناشناس‌اند و صفحه‌ی پروفایلِ عمومی ندارند؛ url به خودِ سایت
          // اشاره می‌کند تا فیلدِ پیشنهادیِ گوگل خالی نماند
          author: { "@type": "Person", name: `کاربر ${SITE_NAME}`, url: `${SITE_URL}/` },
          ...(accepted ? { acceptedAnswer: answerNode(accepted) } : {}),
          ...(suggested.length ? { suggestedAnswer: suggested.map(answerNode) } : {}),
        },
        breadcrumb,
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: deriveTitle(question.text, 110),
        url: `${SITE_URL}/questions/${canonicalSlug}`,
        datePublished: question.createdAt,
        breadcrumb,
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
            <div className="thread-item ai" id={`answer-${a.id}`} key={a.id}>
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
