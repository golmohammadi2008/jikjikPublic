import type { Metadata } from "next";
import Link from "next/link";
import { getAssistantModels, getHome } from "@/lib/api";
import { buildPostSlug, buildSlug } from "@/lib/slug";
import AssistantWidget from "@/components/AssistantWidget";
import { OG_IMAGE, SITE_NAME, SITE_URL, panelAskUrl, panelUserUrl } from "@/lib/config";
import AppDownload from "@/components/AppDownload";
import { excerpt, formatCount, formatRating } from "@/lib/format";
import { captionPlainText } from "@/lib/caption";
import Avatar from "@/components/Avatar";
import PostThumb from "@/components/PostThumb";
import VerifiedTick from "@/components/VerifiedTick";

export const metadata: Metadata = {
  title: `${SITE_NAME} — هر سوال، متخصص خودش را دارد`,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — هر سوال، متخصص خودش را دارد`,
    description: "پاسخ فوری هوش مصنوعی + پاسخ متخصص تاییدشده + رزرو جلسه آنلاین.",
    url: "/",
    images: [OG_IMAGE],
  },
};

export default async function HomePage() {
  // دستیار و خانه با هم گرفته می‌شوند؛ نبودِ دستیار نباید صفحه‌ی اصلی را
  // بخواباند، پس خطایش به null می‌افتد
  const [data, assistant] = await Promise.all([
    getHome(),
    getAssistantModels().catch(() => null),
  ]);
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
        // SearchAction عمداً حذف شد: هیچ صفحه‌ی جستجویی با پارامتر `query` نداریم
        // (فقط page/category/sort). گوگل خودِ الگو را به‌عنوان یک نشانی خزید و
        // و آدرسِ ساختگی در سرچ‌کنسول ثبت می‌شد. تا وقتی
        // جست‌وجوی واقعی روی سایت نداریم، اعلامش فقط خطا می‌سازد.
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
            <span className="ha-mark">و</span>

            <div className="ha-card ha-specialist">
              <span className="ha-avatar" style={{ background: "linear-gradient(135deg,#6553C6,#8B5CF6)" }}>م</span>
              <span>
                <b>دکتر محمدی</b>
                <small>متخصص روانشناسی</small>
              </span>
              <span className="ha-rating">⭐ ۴٫۹</span>
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

      {/* دستیار — بلافاصله بعد از هیرو. کسی که تازه رسیده باید بتواند بدون
          هیچ مرحله‌ای یک سوال بپرسد؛ هر چیزی که بین او و اولین پاسخ بایستد
          همان‌جا از دستش می‌دهیم. */}
      {assistant && assistant.models.length > 0 && (
        <AssistantWidget models={assistant.models} freeAsks={assistant.freeAsks} />
      )}


      {posts.length > 0 && (
        <section className="section" id="posts">
          <div className="wrap">
            <div className="section-head">
              <h2>از متخصص‌های وینو</h2>
              <Link className="more" href="/specialists">
                همه متخصص‌ها ←
              </Link>
            </div>

            <div className="post-grid">
              {posts.map((p) => {
                // کارتِ فهرست همیشه متنِ ساده نشان می‌دهد: کلمپِ دو خطی با
                // بلوکِ کد می‌شکند و ستاره‌های بولد در پیش‌نمایش زشت‌اند.
                // نشانه‌گذاری، جای خودش را در صفحه‌ی پست دارد.
                const plain = captionPlainText(p.caption);
                const postSlug = buildPostSlug(p);
                const authorSlug = buildSlug(p.author.name, p.author.id);
                return (
                  <article className="post-card" key={p.id}>
                    <Link className="p-head" href={`/specialists/${authorSlug}`}>
                      <Avatar name={p.author.name} src={p.author.avatar} />
                      <div>
                        <b>{p.author.name}<VerifiedTick /></b>
                        <small>
                          {p.author.specialty || p.author.categoryLabel || ""}
                          {p.author.ratingAvg ? ` · ⭐ ${formatRating(p.author.ratingAvg)}` : ""}
                        </small>
                      </div>
                    </Link>
                    <Link className="p-media" href={`/post/${postSlug}`} aria-label="مشاهده پست">
                      <PostThumb
                        imageUrl={p.imageUrl}
                        isVideo={p.isVideo}
                        alt={excerpt(plain, 100) || "پست منتشرشده"}
                        fallbackText={plain.slice(0, 24)}
                      />
                    </Link>
                    <div className="p-body">
                      <p>{plain}</p>
                    </div>
                    <div className="p-foot">
                      <span className="stats">
                        {formatCount(p.likesCount)} پسند · {formatCount(p.commentsCount)} دیدگاه
                        {(p.viewsCount || 0) > 0 ? ` · ${formatCount(p.viewsCount!)} بازدید` : ''}
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
          <AppDownload />
        </div>
      </section>
    </main>
  );
}
