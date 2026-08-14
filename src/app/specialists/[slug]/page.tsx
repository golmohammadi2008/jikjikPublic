import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSpecialist } from "@/lib/api";
import { buildPostSlug, buildSlug, extractObjectId } from "@/lib/slug";
import { OG_IMAGE, SITE_NAME, SITE_URL, panelAskUrl, panelUserUrl } from "@/lib/config";
import { excerpt, formatCount, formatJalali, formatRating } from "@/lib/format";
import { captionPlainText } from "@/lib/caption";
import Avatar from "@/components/Avatar";
import VerifiedTick from "@/components/VerifiedTick";
import PostThumb from "@/components/PostThumb";
import Stars from "@/components/Stars";

type Props = { params: Promise<{ slug: string }> };

async function loadSpecialist(slug: string) {
  const id = extractObjectId(slug);
  if (!id) return null;
  return getSpecialist(id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadSpecialist(slug);
  if (!data) return {};
  const { specialist } = data;
  const canonicalSlug = buildSlug(specialist.name, specialist.id);
  return {
    title: `${specialist.name} | ${specialist.specialty || specialist.categoryLabel || "متخصص"}`,
    description: `پروفایل ${specialist.name}${specialist.specialty ? ` — ${specialist.specialty}` : ""} در ${SITE_NAME}. سوال بپرس یا جلسه آنلاین رزرو کن.`,
    alternates: { canonical: `/specialists/${canonicalSlug}` },
    openGraph: {
      type: "profile",
      title: `${specialist.name} — ${specialist.specialty || specialist.categoryLabel || "متخصص"}`,
      description: excerpt(specialist.bio || `سوال بپرس یا جلسه آنلاین رزرو کن.`, 155),
      url: `/specialists/${canonicalSlug}`,
      images: specialist.avatar ? [{ url: specialist.avatar }] : [OG_IMAGE],
    },
  };
}

export default async function SpecialistPage({ params }: Props) {
  const { slug } = await params;
  const data = await loadSpecialist(slug);
  if (!data) notFound();

  const { specialist, posts, related, reviews = [] } = data;
  const canonicalSlug = buildSlug(specialist.name, specialist.id);

  // اسلاگِ غیرکانونیکال را ۳۰۸ می‌کنیم به‌جای سرو با تگ canonical.
  // چرا: هر اسلاگی که به همان ObjectId ختم شود ۲۰۰ می‌گرفت، پس با هر ویرایشِ
  // متن، نشانیِ قدیمی هم زنده می‌ماند و گوگل آن را «Alternate page with proper
  // canonical tag» ثبت می‌کرد — بودجه‌ی خزش صرفِ تکراری‌ها می‌شد. ریدایرکت،
  // سیگنال‌ها را روی یک نشانی جمع می‌کند.
  if (slug !== canonicalSlug) redirect(`/specialists/${canonicalSlug}`);

  const url = `${SITE_URL}/specialists/${canonicalSlug}`;

  const jobTitle = specialist.specialty || specialist.categoryLabel || "متخصص";
  const hasRating = !!(specialist.ratingAvg && specialist.ratingCount);

  const aggregateRating = hasRating
    ? {
        "@type": "AggregateRating",
        ratingValue: specialist.ratingAvg.toFixed(1),
        ratingCount: specialist.ratingCount,
        bestRating: 5,
        worstRating: 1,
      }
    : null;

  // فقط نظرهای متن‌دار به مارک‌آپ می‌روند — گوگل چیزی برای نقل‌قول می‌خواهد
  const reviewNodes = reviews.slice(0, 5).map((r) => ({
    "@type": "Review",
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
    author: { "@type": "Person", name: r.client.name },
    datePublished: r.createdAt,
    reviewBody: excerpt(r.text, 300),
  }));

  /**
   * امتیاز روی ProfessionalService سوار می‌شود، نه روی Person.
   *
   * گوگل ستاره‌ی نتیجه (review snippet) را فقط برای مجموعه‌ی مشخصی از تایپ‌ها
   * نشان می‌دهد — LocalBusiness و زیرشاخه‌هایش، Organization، Product و چند
   * تای دیگر. Person در آن فهرست نیست، پس aggregateRating روی Person معتبر
   * پارس می‌شد ولی هیچ‌وقت به ستاره‌ی نتایج تبدیل نمی‌شد.
   *
   * ProfessionalService ادعای نادرستی هم نمی‌سازد: متخصص واقعاً خدمتِ حرفه‌ای
   * ارائه می‌دهد و provider همان شخص است. هویت شخص در همان Person می‌ماند و
   * دو گره با @id به هم وصل‌اند.
   */
  const personId = `${url}#person`;
  const serviceId = `${url}#service`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": url,
        mainEntity: { "@id": personId },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "متخصص‌ها", item: `${SITE_URL}/specialists` },
            { "@type": "ListItem", position: 3, name: specialist.name },
          ],
        },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: specialist.name,
        url,
        jobTitle,
        ...(specialist.avatar ? { image: specialist.avatar } : {}),
        ...(specialist.bio ? { description: excerpt(specialist.bio, 300) } : {}),
        worksFor: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
      },
      {
        "@type": "ProfessionalService",
        "@id": serviceId,
        name: `${specialist.name} — ${jobTitle}`,
        url,
        ...(specialist.avatar ? { image: specialist.avatar } : {}),
        ...(specialist.bio ? { description: excerpt(specialist.bio, 300) } : {}),
        provider: { "@id": personId },
        areaServed: { "@type": "Country", name: "ایران" },
        // جلسه‌ها آنلاین‌اند؛ نشانی فیزیکی نداریم و ساختنش داده‌ی جعلی می‌شد
        serviceType: jobTitle,
        parentOrganization: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
        // بدون ratingCount، گوگل aggregateRating را نادیده می‌گیرد
        ...(aggregateRating ? { aggregateRating } : {}),
        ...(reviewNodes.length ? { review: reviewNodes } : {}),
      },
    ],
  };

  return (
    <main className="wrap" id="booking">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link href="/">{SITE_NAME}</Link> › <Link href="/specialists">متخصص‌ها</Link>
      </nav>

      <article>
        <div className="p-head" style={{ padding: "0 0 6px" }}>
          <Avatar name={specialist.name} src={specialist.avatar} size={56} />
          <div>
            {/* نامِ متخصص باید h1 باشد: صفحه‌ی پروفایل هیچ h1 نداشت و گوگل
                موضوعِ صفحه را فقط از تایتل حدس می‌زد. block می‌ماند تا مثل
                قبل، خطِ تخصص زیرش بیفتد نه کنارش. */}
            <h1 style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, lineHeight: 1.5, color: "var(--ink)" }}>
              {specialist.name}
              <VerifiedTick />
            </h1>
            <small style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {specialist.specialty || specialist.categoryLabel || ""}
              {hasRating && (
                <>
                  <span aria-hidden="true">·</span>
                  <Stars value={specialist.ratingAvg} size={13} />
                  {formatRating(specialist.ratingAvg)} ({formatCount(specialist.ratingCount)} نظر)
                </>
              )}
            </small>
          </div>
        </div>

        <div className="answer-card" style={{ marginTop: 20 }}>
          <div className="expert-strip" style={{ border: 0, margin: 0, padding: 0 }}>
            <div className="who">
              <span>
                <b>سوالی داری یا می‌خواهی جلسه رزرو کنی؟</b>
                <br />
                <small style={{ color: "var(--ink-2)" }}>از {specialist.name} بپرس یا وقت آنلاین بگیر</small>
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a className="btn btn-ghost btn-sm" href={panelAskUrl()}>
                سوال بپرس
              </a>
              <a className="btn btn-saffron btn-sm" href={panelUserUrl(specialist.username)}>
                رزرو جلسه
              </a>
            </div>
          </div>
        </div>

        {/* نظرها بالای پست‌ها می‌آیند: کسی که پروفایل متخصص را باز می‌کند اول
            می‌خواهد بداند تجربه‌ی بقیه چه بوده، بعد محتوایش را ببیند */}
        {reviews.length > 0 && (
          <section className="reviews" aria-labelledby="reviews-title">
            <h2 id="reviews-title">نظر کاربران</h2>

            {hasRating && (
              <div className="review-summary">
                <strong>{formatRating(specialist.ratingAvg)}</strong>
                <div>
                  <Stars value={specialist.ratingAvg} />
                  <small>بر پایه‌ی {formatCount(specialist.ratingCount)} نظرِ ثبت‌شده پس از جلسه</small>
                </div>
              </div>
            )}

            <ul className="review-list">
              {reviews.map((r) => (
                <li className="review-card" key={r.id}>
                  <div className="r-head">
                    <Avatar name={r.client.name} src={r.client.avatar} size={40} />
                    <div className="r-who">
                      <b>{r.client.name}</b>
                      <Stars value={r.rating} />
                    </div>
                    <time dateTime={r.createdAt}>{formatJalali(r.createdAt)}</time>
                  </div>
                  <p>{r.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {posts.length > 0 && (
          <section style={{ marginTop: 36 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800, marginBottom: 14 }}>
              پست‌های {specialist.name}
            </h2>
            <div className="post-grid">
              {posts.map((p) => {
                // مثل صفحه‌ی اصلی: کارت متنِ ساده، صفحه‌ی پست نشانه‌گذاری
                const plain = captionPlainText(p.caption);
                const postSlug = buildPostSlug(p);
                return (
                  <article className="post-card" key={p.id}>
                    <Link className="p-media" href={`/post/${postSlug}`} aria-label="مشاهده پست">
                      <PostThumb
                        imageUrl={p.imageUrl}
                        isVideo={p.isVideo}
                        alt={excerpt(plain, 100) || "پست منتشرشده"}
                        fallbackText={plain.slice(0, 24)}
                      />
                    </Link>
                    <div className="p-body">
                      <p>{excerpt(plain, 90)}</p>
                    </div>
                    <div className="p-foot">
                      <span className="stats">
                        {formatCount(p.likesCount)} پسند · {formatCount(p.commentsCount)} دیدگاه
                        {(p.viewsCount || 0) > 0 ? ` · ${formatCount(p.viewsCount!)} بازدید` : ''}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="related" aria-label="سوال‌های مرتبط">
            <h2>سوال‌های حوزه {specialist.categoryLabel}</h2>
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
