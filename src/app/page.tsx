import type { Metadata } from "next";
import Link from "next/link";
import { getHome } from "@/lib/api";
import { buildSlug } from "@/lib/slug";
import { APP_DOWNLOAD_URL, SITE_NAME, SITE_URL, panelAskUrl, panelUserUrl } from "@/lib/config";
import { formatCount } from "@/lib/format";
import Avatar from "@/components/Avatar";
import VideoBadge from "@/components/VideoBadge";

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
        <div className="wrap">
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
              💬 سوال خود را بپرس
            </a>
            <a className="btn btn-ghost" href="/specialists">
              🗓 رزرو جلسه آنلاین
            </a>
          </div>

          <div className="hero-proof">
            <span className="avatar-stack" aria-hidden="true">
              <span style={{ background: "#0E7266" }}>م</span>
              <span style={{ background: "#6553C6" }}>س</span>
              <span style={{ background: "#C46A05" }}>ر</span>
              <span style={{ background: "#3C6E9F" }}>ن</span>
            </span>
            <span>متخصص‌های تاییدشده آماده پاسخ‌اند · پاسخ هوش مصنوعی همان لحظه</span>
          </div>
        </div>
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
                        <b>{p.author.name}</b>
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
