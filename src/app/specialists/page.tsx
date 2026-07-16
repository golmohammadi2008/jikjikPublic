import type { Metadata } from "next";
import Link from "next/link";
import { getSpecialists } from "@/lib/api";
import { buildSlug } from "@/lib/slug";
import { SITE_NAME, panelUserUrl } from "@/lib/config";
import Avatar from "@/components/Avatar";
import VerifiedTick from "@/components/VerifiedTick";

export const metadata: Metadata = {
  title: "متخصص‌ها",
  description: `فهرست متخصص‌های تاییدشده ${SITE_NAME} — پزشکی، حقوقی، ورزشی و بیشتر.`,
  alternates: { canonical: "/specialists" },
};

export default async function SpecialistsPage() {
  const data = await getSpecialists();
  const specialists = data?.specialists ?? [];

  return (
    <main className="wrap">
      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link href="/">{SITE_NAME}</Link> › متخصص‌ها
      </nav>

      <div className="section-head">
        <h2>متخصص‌های تاییدشده</h2>
      </div>

      {specialists.length === 0 ? (
        <p style={{ color: "var(--ink-2)", padding: "20px 0" }}>در حال حاضر متخصصی برای نمایش وجود ندارد.</p>
      ) : (
        <div className="post-grid" style={{ paddingBottom: 40 }}>
          {specialists.map((s) => {
            const slug = buildSlug(s.name, s.id);
            return (
              <article className="post-card" key={s.id}>
                <Link className="p-head" href={`/specialists/${slug}`}>
                  <Avatar name={s.name} src={s.avatar} />
                  <div>
                    <b>{s.name}<VerifiedTick /></b>
                    <small>
                      {s.specialty || s.categoryLabel || ""}
                      {s.ratingAvg ? ` · ⭐ ${s.ratingAvg.toFixed(1)} (${s.ratingCount})` : ""}
                    </small>
                  </div>
                </Link>
                <div className="p-foot" style={{ paddingTop: 0 }}>
                  <a className="btn btn-thyme btn-sm" href={panelUserUrl(s.username)}>
                    رزرو جلسه
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
