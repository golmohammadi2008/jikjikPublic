import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSpecialist } from "@/lib/api";
import { buildSlug, extractObjectId } from "@/lib/slug";
import { PANEL_URL, SITE_NAME } from "@/lib/config";
import { excerpt, formatCount } from "@/lib/format";
import Avatar from "@/components/Avatar";
import VideoBadge from "@/components/VideoBadge";

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
  };
}

export default async function SpecialistPage({ params }: Props) {
  const { slug } = await params;
  const data = await loadSpecialist(slug);
  if (!data) notFound();

  const { specialist, posts, related } = data;

  return (
    <main className="wrap" id="booking">
      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link href="/">{SITE_NAME}</Link> › <Link href="/specialists">متخصص‌ها</Link>
      </nav>

      <article>
        <div className="p-head" style={{ padding: "0 0 6px" }}>
          <Avatar name={specialist.name} src={specialist.avatar} size={56} />
          <div>
            <b style={{ fontSize: 18 }}>{specialist.name}</b>
            <small>
              {specialist.specialty || specialist.categoryLabel || ""}
              {specialist.ratingAvg ? ` · ⭐ ${specialist.ratingAvg.toFixed(1)} (${formatCount(specialist.ratingCount)} نظر)` : ""}
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
              <a className="btn btn-ghost btn-sm" href={`${PANEL_URL}`}>
                سوال بپرس
              </a>
              <a className="btn btn-saffron btn-sm" href={`${PANEL_URL}`}>
                رزرو جلسه
              </a>
            </div>
          </div>
        </div>

        {posts.length > 0 && (
          <section style={{ marginTop: 36 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800, marginBottom: 14 }}>
              پست‌های {specialist.name}
            </h2>
            <div className="post-grid">
              {posts.map((p) => {
                const postSlug = buildSlug(p.caption, p.id);
                return (
                  <article className="post-card" key={p.id}>
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
                      <p>{excerpt(p.caption, 90)}</p>
                    </div>
                    <div className="p-foot">
                      <span className="stats">
                        {formatCount(p.likesCount)} پسند · {formatCount(p.commentsCount)} دیدگاه
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
