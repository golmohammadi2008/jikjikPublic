"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PANEL_URL, SITE_NAME } from "@/lib/config";
import { CATS, FAQS, type CatKey } from "@/lib/faqs";

/**
 * سوالات متداول — با جست‌وجو، دسته‌بندی و آکاردئون.
 *
 * نسخه‌ی قبلی یک دیوارِ تختِ پرسش و پاسخ بود: ده سوال پشت سر هم، همه هم‌وزن،
 * و پیداکردنِ یکی یعنی خواندنِ همه. حالا سه لایه دارد که هر کدام یک کارِ
 * مشخص می‌کنند: جست‌وجو برای وقتی می‌دانی دنبال چه می‌گردی، دسته برای وقتی
 * نمی‌دانی، و آکاردئون تا صفحه یک‌جا در چشم جا شود.
 *
 * جست‌وجو و فیلتر سمتِ مرورگرند: ده سوال ارزشِ رفت‌وبرگشت به سرور ندارند و
 * این‌طور نتیجه بدون تاخیر می‌آید. کلِ داده در HTML اولیه هست، پس هم گوگل
 * همه را می‌بیند هم بدون جاوااسکریپت صفحه خالی نیست.
 */

/** حروف عربی/فارسیِ هم‌شکل را یکی می‌کند تا «می‌کنم» و «مي‌كنم» هر دو پیدا شوند. */
function normalize(s: string): string {
  return s.replace(/[ي]/g, "ی").replace(/[ك]/g, "ک").replace(/‌/g, " ").toLowerCase();
}

export default function FaqBrowser() {
  const [cat, setCat] = useState<CatKey | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(0);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return FAQS.map((f, i) => ({ ...f, i })).filter((f) => {
      if (cat && f.cat !== cat) return false;
      if (!q) return true;
      return normalize(f.q).includes(q) || normalize(f.a).includes(q);
    });
  }, [cat, query]);

  return (
    <>
      <header className="faq-hero">
        <div className="faq-hero__bg" aria-hidden="true">
          <span className="faq-blob faq-blob-1" />
          <span className="faq-blob faq-blob-2" />
        </div>
        <div className="wrap">
          <h1>چطور می‌توانیم کمک کنیم؟</h1>
          <p>پاسخ سوال‌های پرتکرار درباره‌ی {SITE_NAME} — رزرو، پرداخت، متخصص‌شدن و امنیت.</p>

          <div className="faq-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(null); }}
              placeholder="جست‌وجو در سوال‌ها…"
              aria-label="جست‌وجو در سوالات متداول"
            />
            {!!query && (
              <button type="button" onClick={() => setQuery("")} aria-label="پاک‌کردن جست‌وجو">×</button>
            )}
          </div>

          <div className="faq-cats" role="tablist" aria-label="دسته‌بندی سوال‌ها">
            <button
              type="button" role="tab" aria-selected={cat === null}
              className={`faq-cat${cat === null ? " is-active" : ""}`}
              onClick={() => { setCat(null); setOpen(null); }}
            >
              همه
            </button>
            {CATS.map((c) => (
              <button
                key={c.key} type="button" role="tab" aria-selected={cat === c.key}
                className={`faq-cat${cat === c.key ? " is-active" : ""}`}
                onClick={() => { setCat(c.key); setOpen(null); }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="wrap faq-body">
        {results.length === 0 ? (
          <div className="faq-empty">
            <b>چیزی پیدا نشد</b>
            <p>سوالت این‌جا نبود؟ مستقیم از پشتیبانی بپرس — معمولاً همان روز جواب می‌دهیم.</p>
            <Link className="btn btn-saffron" href="/contact">پرسیدن از پشتیبانی</Link>
          </div>
        ) : (
          <div className="faq-list">
            {results.map((f) => {
              const isOpen = open === f.i;
              return (
                <div className={`faq-item${isOpen ? " is-open" : ""}`} key={f.q}>
                  {/* دکمه‌ی واقعی، نه div کلیک‌پذیر: با کیبورد و صفحه‌خوان کار
                      می‌کند و aria-expanded وضعیتش را اعلام می‌کند */}
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${f.i}`}
                    onClick={() => setOpen(isOpen ? null : f.i)}
                  >
                    <span>{f.q}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           strokeWidth="2.5" strokeLinecap="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                  {/* grid-template-rows از 0fr به 1fr می‌رود: تنها راهی که
                      ارتفاعِ نامعلوم را بدون جاوااسکریپت و بدون max-height
                      حدسی، نرم باز می‌کند */}
                  <div className="faq-a" id={`faq-a-${f.i}`} role="region" hidden={!isOpen}>
                    <div><p>{f.a}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <aside className="faq-cta">
          <div>
            <b>پاسخت را پیدا نکردی؟</b>
            <p>تیم پشتیبانی در سریع‌ترین زمان جواب می‌دهد.</p>
          </div>
          <div className="faq-cta__actions">
            <Link className="btn btn-saffron" href="/contact">ارتباط با ما</Link>
            <a className="btn btn-ghost" href={`${PANEL_URL}/questions/new`}>پرسیدن از متخصص</a>
          </div>
        </aside>
      </div>
    </>
  );
}
