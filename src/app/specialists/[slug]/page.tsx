import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSpecialist } from "@/lib/api";
import { buildPostSlug, buildSlug, extractObjectId } from "@/lib/slug";
import { OG_IMAGE, SITE_NAME, SITE_URL, panelAskUrl, panelUserUrl } from "@/lib/config";
import { excerpt, formatCount, formatJalali, formatRating, isRecentlyActive } from "@/lib/format";
import { captionPlainText } from "@/lib/caption";
import Avatar from "@/components/Avatar";
import VerifiedTick from "@/components/VerifiedTick";
import PostThumb from "@/components/PostThumb";
import Stars from "@/components/Stars";
import BookingCard from "@/components/BookingCard";

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
   * امتیاز روی Product سوار می‌شود — نه Person، نه ProfessionalService.
   *
   * دو بار جای اشتباهی بود و هر بار به دلیلِ متفاوتی ستاره نمی‌گرفت:
   *
   *   • Person اصلاً در فهرستِ تایپ‌های واجدِ شرایطِ گوگل نیست، پس
   *     aggregateRating معتبر پارس می‌شد ولی هیچ‌وقت ستاره نمی‌شد.
   *
   *   • ProfessionalService زیرشاخه‌ی LocalBusiness است و سیاستِ صریحِ گوگل
   *     این است: «اگر موجودیتی که نقد می‌شود خودش نقدها را کنترل کند، صفحه‌های
   *     LocalBusiness یا هر Organization دیگری واجدِ شرایطِ ستاره نیستند» —
   *     یعنی نقدِ درون‌سایتی self-serving حساب می‌شود و ستاره نمی‌گیرد.
   *     دقیقاً همین‌جا بودیم: مارک‌آپ درست بود ولی سیاست اجازه نمی‌داد.
   *
   * Product در فهرستِ واجدِ شرایط هست و مشمولِ آن محدودیت نیست. ادعای
   * نادرستی هم نمی‌سازد: چیزی که این‌جا فروخته می‌شود یک جلسه‌ی مشاوره‌ی
   * قیمت‌دار است، با مدت و نرخِ مشخص — یک آیتمِ خریدنیِ واقعی. نقدها هم
   * شخصِ ثالث‌اند (مراجع درباره‌ی متخصص)، نه سایت درباره‌ی خودش.
   *
   * offers بدونِ قیمت فرستاده نمی‌شود: نرخِ صفر یعنی متخصص هنوز تعیین نکرده و
   * ساختنِ عددِ الکی، هم داده‌ی جعلی است هم گوگل رد می‌کند.
   */
  const personId = `${url}#person`;
  const productId = `${url}#session`;

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
        "@type": "Product",
        "@id": productId,
        name: `جلسه‌ی آنلاین ${jobTitle} با ${specialist.name}`,
        url,
        ...(specialist.avatar ? { image: specialist.avatar } : {}),
        description: excerpt(
          specialist.bio
            || `جلسه‌ی آنلاین ${specialist.sessionDurationMinutes} دقیقه‌ای با ${specialist.name}، ${jobTitle}.`,
          300,
        ),
        category: specialist.categoryLabel || jobTitle,
        brand: { "@type": "Brand", name: SITE_NAME },
        ...(specialist.hourlyRate > 0
          ? {
              offers: {
                "@type": "Offer",
                price: specialist.hourlyRate,
                priceCurrency: "IRR",
                url,
                // وقتی وقتِ خالی داریم واقعاً در دسترس است؛ وگرنه ادعایش
                // نمی‌کنیم. تاریخِ نزدیک‌ترین وقت هم همراهش می‌رود.
                availability: specialist.nextSlotAt
                  ? "https://schema.org/InStock"
                  : "https://schema.org/PreOrder",
                ...(specialist.nextSlotAt ? { availabilityStarts: specialist.nextSlotAt } : {}),
                seller: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
              },
            }
          : {}),
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
        {/* سربرگ: کیست، چقدر خوب است، و چرا می‌شود به او اعتماد کرد.
            قبلاً آواتار ۵۶ پیکسلی گوشه‌ی بالا بود و اسم هم‌وزنِ متنِ بدنه —
            صفحه‌ی پروفایل باید با خودِ آدم شروع شود. */}
        <header className="sp-hero">
          <div className="sp-hero__avatar">
            <Avatar name={specialist.name} src={specialist.avatar} size={96} />
          </div>
          <div className="sp-hero__main">
            <h1>
              {specialist.name}
              <VerifiedTick />
            </h1>
            <div className="sp-hero__role">{jobTitle}</div>

            {hasRating ? (
              <div className="sp-hero__rating">
                <Stars value={specialist.ratingAvg} size={15} />
                <b>{formatRating(specialist.ratingAvg)}</b>
                <span>از {formatCount(specialist.ratingCount)} نظر</span>
              </div>
            ) : (
              <div className="sp-hero__rating">
                <span>هنوز نظری ثبت نشده</span>
              </div>
            )}

            <div className="sp-trust">
              <span className="sp-chip">هویت تاییدشده</span>
              {isRecentlyActive(specialist.lastActivityAt) && (
                <span className="sp-chip">این هفته فعال بوده</span>
              )}
              {specialist.categoryLabel && (
                <span className="sp-chip sp-chip--muted">{specialist.categoryLabel}</span>
              )}
            </div>
          </div>

          {/* نیمه‌ی خالیِ سربرگ با عددهای واقعی پر می‌شود، نه تزیین: اینها
              همان چیزهایی‌اند که بازدیدکننده پیش از رزرو می‌سنجد. */}
          <dl className="sp-stats">
            <div>
              <dt>نظر</dt>
              <dd>{formatCount(specialist.ratingCount)}</dd>
            </div>
            <div>
              <dt>پست</dt>
              <dd>{formatCount(posts.length)}</dd>
            </div>
            <div>
              <dt>امتیاز</dt>
              <dd>{hasRating ? formatRating(specialist.ratingAvg) : "—"}</dd>
            </div>
          </dl>
        </header>

        <div className="sp-layout">
          <div>
            {specialist.bio && (
              <section className="sp-section" aria-labelledby="about-title">
                <h2 id="about-title">درباره‌ی {specialist.name}</h2>
                <div className="sp-about">{specialist.bio}</div>
              </section>
            )}

        {/* نظرها بالای پست‌ها می‌آیند: کسی که پروفایل متخصص را باز می‌کند اول
            می‌خواهد بداند تجربه‌ی بقیه چه بوده، بعد محتوایش را ببیند */}
        {reviews.length > 0 && (
          <section className="reviews sp-section" aria-labelledby="reviews-title">
            <h2 id="reviews-title">نظر کاربران</h2>

            {hasRating && (
              <div className="sp-rating-bar">
                <b>{formatRating(specialist.ratingAvg)}</b>
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
          <section className="sp-section">
            <h2>پست‌های {specialist.name}</h2>
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
          <section className="related sp-section" aria-label="سوال‌های مرتبط">
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

            {!specialist.bio && posts.length === 0 && reviews.length === 0 && (
              <div className="sp-empty sp-section">
                {specialist.name} هنوز محتوایی منتشر نکرده. می‌توانی مستقیم سوالت را بپرسی یا وقت بگیری.
              </div>
            )}
          </div>

          {/* ستونِ چسبان در دسکتاپ */}
          <BookingCard specialist={specialist} variant="column" />
        </div>
      </article>

      {/* موبایل: همان کارت به‌صورتِ نوارِ چسبانِ پایین */}
      <BookingCard specialist={specialist} variant="bar" />
    </main>
  );
}
