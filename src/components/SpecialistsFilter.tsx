"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { panelUserUrl } from "@/lib/config";
import { buildSlug } from "@/lib/slug";
import type { SpecialistListItem } from "@/lib/types";
import Avatar from "@/components/Avatar";
import VerifiedTick from "@/components/VerifiedTick";

type Sort = "top" | "rating";

export default function SpecialistsFilter({ specialists }: { specialists: SpecialistListItem[] }) {
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of specialists) {
      if (s.category && s.categoryLabel) map.set(s.category, s.categoryLabel);
    }
    return Array.from(map, ([key, label]) => ({ key, label }));
  }, [specialists]);

  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("top");

  const filtered = useMemo(() => {
    const q = query.trim();
    let list = specialists.filter((s) => {
      if (category && s.category !== category) return false;
      if (q && !`${s.name} ${s.specialty ?? ""}`.includes(q)) return false;
      return true;
    });
    if (sort === "rating") {
      list = [...list].sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
    }
    return list;
  }, [specialists, category, query, sort]);

  return (
    <>
      <div className="filter-bar">
        <div className="filter-chips">
          <button
            type="button"
            className={`filter-chip${category === null ? " active" : ""}`}
            onClick={() => setCategory(null)}
          >
            همه
          </button>
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`filter-chip${category === c.key ? " active" : ""}`}
              onClick={() => setCategory(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="filter-tools">
          <div className="filter-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جست‌وجوی نام یا تخصص..."
            />
          </div>
          <select className="filter-select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="top">پیشنهادی</option>
            <option value="rating">بیشترین امتیاز</option>
          </select>
        </div>
      </div>

      <p className="filter-count">{filtered.length.toLocaleString("fa-IR")} متخصص</p>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--ink-2)", padding: "20px 0" }}>موردی با این فیلتر پیدا نشد.</p>
      ) : (
        <div className="post-grid" style={{ paddingBottom: 40 }}>
          {filtered.map((s) => {
            const slug = buildSlug(s.name, s.id);
            return (
              <article className="post-card" key={s.id}>
                <Link className="p-head" href={`/specialists/${slug}`}>
                  <span className={`avatar-wrap${s.online ? " is-online" : ""}`}>
                    <Avatar name={s.name} src={s.avatar} />
                  </span>
                  <div>
                    <b>
                      {s.name}
                      <VerifiedTick />
                      {s.online && <span className="online-badge">آنلاین</span>}
                    </b>
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
    </>
  );
}
