import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/api";
import { buildSlug, extractObjectId } from "@/lib/slug";
import { PANEL_URL, SITE_NAME, SITE_URL } from "@/lib/config";
import { deriveTitle, excerpt, formatCount, formatJalali } from "@/lib/format";
import Avatar from "@/components/Avatar";

type Props = { params: Promise<{ slug: string }> };

async function loadPost(slug: string) {
  const id = extractObjectId(slug);
  if (!id) return null;
  return getPost(id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadPost(slug);
  if (!data) return {};

  const { post } = data;
  const title = deriveTitle(post.caption, 80);
  const canonicalSlug = buildSlug(post.caption, post.id);

  return {
    title: `${title} | ${post.author.name}`,
    description: excerpt(post.caption, 155),
    alternates: { canonical: `/post/${canonicalSlug}` },
    openGraph: {
      type: "article",
      title,
      description: `از زبان ${post.author.specialty || post.author.categoryLabel || "متخصص"} — با امکان رزرو جلسه آنلاین.`,
      url: `/post/${canonicalSlug}`,
      images: post.imageUrl && !post.isVideo ? [post.imageUrl] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const data = await loadPost(slug);
  if (!data) notFound();

  const { post, related } = data;
  const title = deriveTitle(post.caption, 80);
  const authorSlug = buildSlug(post.author.name, post.author.id);
  const canonicalSlug = buildSlug(post.caption, post.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    datePublished: post.createdAt,
    image: post.imageUrl && !post.isVideo ? post.imageUrl : undefined,
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
    mainEntityOfPage: `${SITE_URL}/post/${canonicalSlug}`,
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

        {post.imageUrl && (
          <div className="p-media">
            {post.isVideo ? (
              <video src={post.imageUrl} controls playsInline preload="metadata" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.imageUrl} alt={title} loading="lazy" />
            )}
          </div>
        )}

        <div className="p-text">
          <p>{post.caption}</p>
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
              <a className="btn btn-ghost btn-sm" href={`${PANEL_URL}`}>
                سوال بپرس
              </a>
              <a className="btn btn-saffron btn-sm" href={`${PANEL_URL}`}>
                رزرو جلسه
              </a>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="related" aria-label="سوال‌های مرتبط">
            <h2>کاربران جیک‌جیک درباره همین موضوع پرسیده‌اند</h2>
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
