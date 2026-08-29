import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getPost } from "@/lib/api";
import { buildPostSlug, buildSlug, extractObjectId } from "@/lib/slug";
import { OG_IMAGE, SITE_NAME, SITE_URL, panelAskUrl, panelUserUrl } from "@/lib/config";
import { deriveTitle, excerpt, formatCount, formatJalali } from "@/lib/format";
import { captionPlainText } from "@/lib/caption";
import type { PublicPostMedia } from "@/lib/types";
import Avatar from "@/components/Avatar";
import Caption from "@/components/Caption";

type Props = { params: Promise<{ slug: string }> };

/**
 * عنوانِ پست از کپشن می‌آید، ولی پستِ عکس/ویدیوی بی‌کپشن رشته‌ی خالی می‌داد و
 * تگ عنوان به شکل «‌ | نام متخصص» سرو می‌شد. جایگزینِ آبرومند بهتر از خالی است.
 *
 * ورودی باید *متنِ ساده* باشد نه کپشنِ خام: وگرنه ستاره‌ها و بک‌تیک‌ها مستقیم
 * در تگ <title> و توضیحاتِ نتیجه‌ی گوگل ظاهر می‌شوند.
 */
function postTitle(post: { title?: string; caption: string }, plain: string, authorName: string): string {
  // عنوانِ صریح، بعد سطر اولِ کپشن، بعد جایگزینِ آبرومند
  return post.title?.trim() || deriveTitle(plain, 80) || `پستی از ${authorName}`;
}

/** یک اسلایدِ پست — عکس یا ویدیو. تک‌رسانه‌ای و کاروسل هر دو از همین می‌آیند. */
function PostSlide({ item, alt, index }: { item: PublicPostMedia; alt: string; index: number }) {
  if (item.isVideo) {
    return (
      <video
        src={item.videoUrl ?? item.url}
        poster={item.videoUrl ? item.url : undefined}
        controls
        playsInline
        preload="metadata"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.url}
      alt={index === 0 ? alt : `${alt} — تصویر ${formatCount(index + 1)}`}
      // اسلایدِ اول همان تصویرِ شاخصِ صفحه است و نباید تنبل باشد
      loading={index === 0 ? 'eager' : 'lazy'}
    />
  );
}

/** ثانیه ← ISO 8601، شکلی که schema.org برای duration می‌خواهد */
function isoDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `PT${Math.floor(s / 60)}M${s % 60}S`;
}

async function loadPost(slug: string) {
  const id = extractObjectId(slug);
  if (!id) return null;
  return getPost(id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadPost(slug);
  // ⚠️ `notFound()` هم مثل ریدایرکت باید *این‌جا* باشد. این مسیر
  // `loading.tsx` دارد، پس رندرش استریم می‌شود و `notFound()`ِ داخلِ کامپوننت
  // دیگر نمی‌تواند کدِ وضعیت بدهد: صفحه‌ی «پیدا نشد» را با **۲۰۰** سرو
  // می‌کرد. برای گوگل این یک soft 404 است — آدرسی که وجود ندارد ولی می‌گوید
  // سالم است. بدتر: `/post/garbage` متادیتای پیش‌فرض می‌گرفت و
  // `index, follow` می‌شد، یعنی بی‌نهایت آدرسِ الکیِ ایندکس‌پذیر.
  if (!data) notFound();

  const { post } = data;
  const canonicalSlug = buildPostSlug(post);
  // ⚠️ ریدایرکت باید *این‌جا* باشد نه در کامپوننت صفحه. صفحه `loading.tsx`
  // دارد، یعنی رندرش استریم می‌شود؛ و `redirect()` در بستر استریم — طبق
  // مستندات خودِ Next — دیگر نمی‌تواند کدِ وضعیت بدهد و به‌جایش یک متاتگِ
  // سمتِ کلاینت می‌گذارد. نتیجه‌اش ۲۰۰ بود روی نشانیِ غیرکانونیکال، با
  // محتوای کاملِ صفحه: دقیقاً یک صفحه‌ی تکراری برای گوگل.
  // generateMetadata پیش از شروعِ استریم تمام می‌شود، پس این‌جا واقعاً ۳۰۸
  // سرو می‌شود. (`fetch` بینِ متادیتا و صفحه dedupe می‌شود، پس درخواستِ
  // دومی به بک‌اند نمی‌رود.)
  if (slug !== canonicalSlug) permanentRedirect(`/post/${canonicalSlug}`);

  const plain = captionPlainText(post.caption);
  const title = postTitle(post, plain, post.author.name);

  return {
    // پستِ بی‌کپشن عنوانش خودش نامِ متخصص را دارد؛ دوباره چسباندنش می‌شد
    // «پستی از مریم | مریم — وینو».
    title: (post.title?.trim() || plain) ? `${title} | ${post.author.name}` : title,
    description: excerpt(plain, 155)
      || post.title?.trim()
      || `پستِ ${post.author.name}${post.author.specialty ? `، ${post.author.specialty}` : ""} در ${SITE_NAME} — با امکان رزرو جلسه آنلاین.`,
    /**
     * پستِ بی‌کپشن هیچ متنی برای ایندکس ندارد: عنوانش خالی بود («‌ | نام»)،
     * description نداشت و اسلاگش می‌شد همان ObjectId خام. سه پست از پنج پست
     * همین‌طور بودند و هر سه در «Crawled - currently not indexed» نشستند.
     * از سایت‌مپ هم بیرون‌اند (sitemap.ts). با نوشتنِ کپشن، خودبه‌خود
     * برمی‌گردند.
     */
    // عنوانِ صریح هم مثل کپشن، «متنِ قابلِ ایندکس» حساب می‌شود
    ...(plain || post.title?.trim() ? {} : { robots: { index: false, follow: true } }),
    alternates: { canonical: `/post/${canonicalSlug}` },
    // بدون این، twitter.images از لایه‌ی ریشه ارث می‌رسید و در توییتر/ایکس
    // کاورِ عمومی نشان داده می‌شد نه خودِ پست. آرایه‌ی خالی یعنی «از
    // opengraph-image استفاده کن».
    twitter: { card: "summary_large_image", images: [] },
    openGraph: {
      type: "article",
      title,
      description: `از زبان ${post.author.specialty || post.author.categoryLabel || "متخصص"} — با امکان رزرو جلسه آنلاین.`,
      url: `/post/${canonicalSlug}`,
      // images اینجا ست نمی‌شود تا کارتِ برنددارِ opengraph-image.tsx به‌کار
      // برود. قبلاً عکسِ خامِ پست می‌رفت و هر بازنشری بدون نام و نشانِ وینو
      // منتشر می‌شد.
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const data = await loadPost(slug);
  if (!data) notFound();

  const { post, related } = data;
  const plain = captionPlainText(post.caption);
  const title = postTitle(post, plain, post.author.name);
  const authorSlug = buildSlug(post.author.name, post.author.id);
  const canonicalSlug = buildPostSlug(post);

  /**
   * اسلایدهای پست. بک‌اند برای پستِ تک‌رسانه‌ای هم آرایه می‌سازد، ولی این
   * جایگزین برای وقتی است که سایت جلوتر از بک‌اندِ مستقر دیپلوی شود — بدونش
   * صفحه‌ی پست تا لحظه‌ی دیپلویِ بک‌اند بدونِ تصویر سرو می‌شد.
   */
  const slides = post.media?.length
    ? post.media
    : post.imageUrl
      ? [{ url: post.imageUrl, isVideo: post.isVideo, videoUrl: post.videoUrl }]
      : [];

  // تورِ ایمنی: ریدایرکتِ واقعی در generateMetadata انجام می‌شود (آن‌جا هنوز
  // استریم شروع نشده و ۳۰۸ِ واقعی ممکن است). این‌جا فقط برای آن است که اگر
  // مسیری روزی متادیتا نداشت، صفحه‌ی تکراری رندر نشود.
  if (slug !== canonicalSlug) permanentRedirect(`/post/${canonicalSlug}`);

  const pageUrl = `${SITE_URL}/post/${canonicalSlug}`;

  /**
   * پستِ ویدیویی: VideoObject باید **موجودیتِ اصلیِ صفحه** باشد، نه یک شاخه
   * زیر Article.
   *
   * سرچ‌کنسول روی این صفحه‌ها می‌گفت «Video isn't on a watch page». نشانه‌ها
   * همه سالم بودند — پلیر در HTMLِ سروری هست، گوگل‌بات هم فایل ویدیو و هم
   * کاور را می‌گیرد (۲۰۶ با Range)، و پلیر روی موبایل ۳۷۲×۴۹۲ و بالای خط
   * تاست. چیزی که می‌ماند خودِ ساختار بود: صفحه اعلام می‌کرد موجودیتش یک
   * Article است که اتفاقاً ویدیویی هم دارد. «صفحه‌ی تماشا» یعنی صفحه‌ای که
   * موجودیتِ اصلی‌اش همان ویدیوست، و این را باید صریح گفت.
   *
   * پس برای پستِ ویدیویی، VideoObject یک گرهِ مستقل در @graph می‌شود و
   * WebPage با `mainEntity` به آن اشاره می‌کند. Article هم می‌ماند (متن و
   * نویسنده هنوز معنا دارند) ولی دیگر مالکِ ویدیو نیست.
   */
  const videoNode = post.isVideo && post.videoUrl
    ? {
        "@type": "VideoObject",
        "@id": `${pageUrl}#video`,
        name: title,
        description: excerpt(plain, 200) || title,
        uploadDate: post.createdAt,
        contentUrl: post.videoUrl,
        // خودِ صفحه‌ی تماشا. embedUrl عمداً نیست: این نشانی پلیرِ قابلِ
        // جاسازی نیست و embedUrlِ نادرست گوگل را دنبالِ پلیری می‌فرستد که
        // وجود ندارد.
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        ...(post.durationSec ? { duration: isoDuration(post.durationSec) } : {}),
        // thumbnailUrl الزامی است. بک‌اند برای پستِ ویدیویی کاور را در
        // imageUrl می‌گذارد و خودِ فایل را در videoUrl.
        ...(post.imageUrl ? { thumbnailUrl: [post.imageUrl] } : {}),
      }
    : null;

  const articleNode = {
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: title,
    datePublished: post.createdAt,
    image: post.imageUrl || undefined,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.specialty || post.author.categoryLabel || undefined,
      url: `${SITE_URL}/specialists/${authorSlug}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/logo-512.png` },
    },
    mainEntityOfPage: pageUrl,
    ...(videoNode ? { video: { "@id": videoNode["@id"] } } : {}),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ...(videoNode
        ? [
            videoNode,
            {
              "@type": "WebPage",
              "@id": pageUrl,
              url: pageUrl,
              name: title,
              // این یک جمله همان چیزی است که «صفحه‌ی تماشا» را می‌سازد
              mainEntity: { "@id": videoNode["@id"] },
            },
          ]
        : []),
      articleNode,
    ],
  };

  return (
    <main className="wrap post-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link href="/">{SITE_NAME}</Link> ›{" "}
        {post.author.category ? (
          <>
            <Link href={`/category/${post.author.category}`}>{post.author.categoryLabel}</Link> ›{" "}
          </>
        ) : null}
        پست متخصص
      </nav>

      <article>
        <div className="p-head" style={{ padding: "0 0 6px" }}>
          <Avatar name={post.author.name} src={post.author.avatar} />
          <div>
            <b>
              <Link href={`/specialists/${authorSlug}`}>{post.author.name}</Link>
            </b>
            <small>
              {post.author.specialty || post.author.categoryLabel || ""}
              {post.author.ratingAvg ? ` · ⭐ ${post.author.ratingAvg.toFixed(1)}` : ""} ·{" "}
              <time dateTime={post.createdAt}>{formatJalali(post.createdAt)}</time>
            </small>
          </div>
        </div>

        <h1>{title}</h1>

        {/* کاروسل کاملاً با CSS کار می‌کند (scroll-snap) — این صفحه سرورساید و
            بدونِ جاوااسکریپتِ کلاینت رندر می‌شود و باید همان‌طور بماند.
            پست‌های تک‌رسانه‌ای از همین مسیر می‌روند: بک‌اند برایشان هم آرایه‌ی
            یک‌عضوی می‌سازد، پس یک مسیرِ رندر بیشتر نداریم. */}
        {slides.length > 0 && (
          <div className="p-media">
            {/* پستِ تک‌رسانه‌ای دقیقاً همان DOMِ قبلی را می‌گیرد — بدون نوار و
                بدون قابِ اضافه. تصویرِ صفحه‌ی سئو تا امروز ارتفاعِ طبیعیِ خودش
                را داشت و پیچیدنش در قابِ کاروسل، همان عکس را به نسبتِ ۴:۳
                می‌بُرید. */}
            {slides.length === 1 ? (
              <PostSlide item={slides[0]} alt={title} index={0} />
            ) : (
              <>
                <span className="p-media-count">{`${formatCount(slides.length)} رسانه`}</span>
                {/* کاروسل کاملاً با CSS کار می‌کند (scroll-snap): این صفحه
                    سرورساید و بدونِ جاوااسکریپتِ کلاینت رندر می‌شود و باید
                    همان‌طور بماند. */}
                <div className="p-media-track">
                  {slides.map((m, i) => (
                    <div className="p-media-slide" key={`${i}-${m.url}`}>
                      <PostSlide item={m} alt={title} index={i} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="p-text">
          <Caption text={post.caption} />
        </div>

        <div className="answer-card" style={{ marginTop: 24 }}>
          <div className="expert-strip" style={{ border: 0, margin: 0, padding: 0 }}>
            <div className="who">
              <Avatar name={post.author.name} src={post.author.avatar} />
              <span>
                <b>سوالی درباره این موضوع داری؟</b>
                <br />
                <small style={{ color: "var(--ink-2)" }}>
                  از {post.author.name} بپرس یا جلسه آنلاین رزرو کن
                </small>
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a className="btn btn-ghost btn-sm" href={panelAskUrl()}>
                سوال بپرس
              </a>
              <a className="btn btn-saffron btn-sm" href={panelUserUrl(post.author.username)}>
                رزرو جلسه
              </a>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="related" aria-label="سوال‌های مرتبط">
            <h2>کاربران وینو درباره همین موضوع پرسیده‌اند</h2>
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
