import type { Metadata } from "next";
import Link from "next/link";
import { getHome } from "@/lib/api";
import { buildSlug } from "@/lib/slug";
import { APP_DOWNLOAD_URL, SITE_NAME, SITE_URL, panelAskUrl, panelUserUrl } from "@/lib/config";
import { formatCount } from "@/lib/format";
import Avatar from "@/components/Avatar";
import VideoBadge from "@/components/VideoBadge";
import VerifiedTick from "@/components/VerifiedTick";

export const metadata: Metadata = {
  title: `${SITE_NAME} — هر سوال، متخصص خودش را دارد`,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — هر سوال، متخصص خودش را دارد`,
    description: "پاسخ فوری هوش مصنوعی + پاسخ متخصص تاییدشده + رزرو جلسه آنلاین.",
    url: "/",
  },
};

export default async function HomePage() {
  const data = await getHome();
  const hotQuestions = data?.hotQuestions ?? [];
  const posts = data?.posts ?? [];
  const categories = data?.categories ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/assets/logo-512.png`,
      },
      {
        "@type": "WebSite",
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#org` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/questions?query={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <span className="hb-blob hb-blob-1" />
          <span className="hb-blob hb-blob-2" />
          <span className="hb-blob hb-blob-3" />
          <span className="hb-grid" />
        </div>
        <div className="wrap hero-grid">
          <div className="hero-copy">
          <h1>
            هر سوال،
            <br />
            <em>متخصص</em> خودش را دارد
          </h1>
          <p className="lead">
            سوالت رو از متخصص بپرس و در یک جلسه آنلاین، بهترین پاسخ را دریافت کن.
          </p>

          <div className="hero-cta">
            <a className="btn btn-saffron" href={panelAskUrl()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              سوال خود را بپرس
            </a>
            <a className="btn btn-ghost" href="/specialists">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              رزرو جلسه آنلاین
            </a>
          </div>

          <div className="trust-strip">
            <span className="t-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2 4 5.5V11c0 5 3.4 9.4 8 10.5 4.6-1.1 8-5.5 8-10.5V5.5L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              متخصص‌های تاییدشده با احراز هویت
            </span>
            <span className="t-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M13 2 3 14h7l-1 8L21 9h-7l-1-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
              پاسخ هوش مصنوعی، همان لحظه
            </span>
            <span className="t-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              جلسه آنلاین امن و خصوصی
            </span>
          </div>
          </div>

          {/* صحنه‌ی شناور — کارت متخصص، حباب ویدیوکال و چیپ جلسه دور نشان برند */}
          <div className="hero-art" aria-hidden="true">
            <span className="ha-ring" />
            <span className="ha-mark">ب</span>

            <div className="ha-card ha-specialist">
              <span className="ha-avatar" style={{ background: "linear-gradient(135deg,#6553C6,#8B5CF6)" }}>م</span>
              <span>
                <b>دکتر محمدی</b>
                <small>متخصص روانشناسی</small>
              </span>
              <span className="ha-rating">۴.۹ ★</span>
            </div>

            <div className="ha-card ha-session">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>
                <b>جلسه آنلاین</b>
                <small>۳۰ دقیقه</small>
              </span>
            </div>

            <span className="ha-bubble ha-video">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="m22 8-6 4 6 4V8z" fill="#fff"/>
                <rect x="2" y="6" width="14" height="12" rx="2" fill="#fff"/>
              </svg>
            </span>

            <span className="ha-avatar ha-solo" style={{ background: "linear-gradient(135deg,#0E7266,#10B981)" }}>س</span>

            <div className="ha-card ha-ai">
              <span className="chip chip-ai">✦ پاسخ هوش مصنوعی</span>
              <small>همان لحظه، رایگان</small>
            </div>
          </div>
        </div>

        <svg className="hero-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,32 C240,80 480,0 720,24 C960,48 1200,88 1440,40 L1440,80 L0,80 Z" fill="var(--bg)" />
        </svg>
      </section>

      {hotQuestions.length > 0 && (
        <section className="section" id="hot-questions">
          <div className="wrap">
            <div className="section-head">
              <h2>داغ‌ترین سوال‌های این هفته</h2>
              <Link className="more" href="/questions">
                همه سوال‌ها ←
              </Link>
            </div>

            <div className="q-grid">
              {hotQuestions.map((q) => {
                const aiAnswer = q.preview.find((a) => a.isAi);
                const expertAnswer = q.preview.find((a) => !a.isAi);
                const slug = buildSlug(q.text, q.id);
                return (
                  <article className="q-card" key={q.id}>
                    <span className="chip">{q.categoryLabel}</span>
                    <h3 className="q-title">
                      <Link href={`/questions/${slug}`}>{q.text}</Link>
                    </h3>
                    <div className="thread">
                      {aiAnswer && (
                        <div className="thread-item ai">
                          <span className="chip chip-ai">✦ پاسخ هوش مصنوعی</span>
                          <p className="answer-peek">{aiAnswer.body}</p>
                        </div>
                      )}
                      {expertAnswer && (
                        <div className="thread-item expert">
                          <p className="answer-peek">
                            <b>{expertAnswer.responder?.name}:</b> {expertAnswer.body}
                          </p>
                        </div>
                      )}
                    </div>
                    <footer>
                      <span>{formatCount(q.specialistAnswerCount)} پاسخ متخصص</span>
                      <span>{formatCount(q.answerCount)} پاسخ در مجموع</span>
                    </footer>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="section" id="posts">
          <div className="wrap">
            <div className="section-head">
              <h2>از متخصص‌های بلدیم</h2>
              <Link className="more" href="/specialists">
                همه متخصص‌ها ←
              </Link>
            </div>

            <div className="post-grid">
              {posts.map((p) => {
                const postSlug = buildSlug(p.caption, p.id);
                const authorSlug = buildSlug(p.author.name, p.author.id);
                return (
                  <article className="post-card" key={p.id}>
                    <Link className="p-head" href={`/specialists/${authorSlug}`}>
                      <Avatar name={p.author.name} src={p.author.avatar} />
                      <div>
                        <b>{p.author.name}<VerifiedTick /></b>
                        <small>
                          {p.author.specialty || p.author.categoryLabel || ""}
                          {p.author.ratingAvg ? ` · ⭐ ${p.author.ratingAvg.toFixed(1)}` : ""}
                        </small>
                      </div>
                    </Link>
                    <Link className="p-media" href={`/post/${postSlug}`} aria-label="مشاهده پست">
                      {p.imageUrl ? (
                        p.isVideo ? (
                          <>
                            <video src={p.imageUrl} muted playsInline preload="metadata" />
                            <VideoBadge />
                          </>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imageUrl} alt="" loading="lazy" />
                        )
                      ) : (
                        <span>{p.caption.slice(0, 24)}</span>
                      )}
                    </Link>
                    <div className="p-body">
                      <p>{p.caption}</p>
                    </div>
                    <div className="p-foot">
                      <span className="stats">
                        {formatCount(p.likesCount)} پسند · {formatCount(p.commentsCount)} دیدگاه
                      </span>
                      <a className="btn btn-thyme btn-sm" href={panelUserUrl(p.author.username)}>
                        رزرو جلسه
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="section" id="categories">
          <div className="wrap">
            <div className="section-head">
              <h2>حوزه‌ها</h2>
            </div>
            <div className="cat-grid">
              {categories.map((c) => (
                <Link className="cat" href={`/category/${c.key}`} key={c.key}>
                  {c.label}
                  <small>{formatCount(c.count)} سوال</small>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <div className="app-banner">
            <div>
              <h2>جواب متخصص که آمد، باخبر شو</h2>
              <p>اپ بلدیم را نصب کن تا پاسخ‌ها و یادآوری جلسه‌ها با اعلان به دستت برسد.</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="btn btn-thyme" href={APP_DOWNLOAD_URL}>
                دریافت برای اندروید
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
