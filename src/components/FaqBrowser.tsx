"use client";

import { useMemo, useState } from "react";
import { Button, Collapse, Empty, Input, Segmented, Typography } from "antd";
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
  const [cat, setCat] = useState<CatKey | "all">("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string[]>(["0"]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return FAQS.map((f, i) => ({ ...f, i })).filter((f) => {
      if (cat !== "all" && f.cat !== cat) return false;
      if (!q) return true;
      return normalize(f.q).includes(q) || normalize(f.a).includes(q);
    });
  }, [cat, query]);

  return (
    <>
      <header className="faq-hero">
        <div className="wrap">
          <Typography.Title level={1}>چطور می‌توانیم کمک کنیم؟</Typography.Title>
          <Typography.Paragraph type="secondary">
            پاسخ سوال‌های پرتکرار درباره‌ی {SITE_NAME} — رزرو، پرداخت، متخصص‌شدن و امنیت.
          </Typography.Paragraph>

          <Input.Search
            className="faq-search"
            size="large"
            allowClear
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen([]); }}
            placeholder="جست‌وجو در سوال‌ها…"
            aria-label="جست‌وجو در سوالات متداول"
          />

          <Segmented
            className="faq-cats"
            value={cat}
            onChange={(v) => { setCat(v as CatKey | "all"); setOpen([]); }}
            options={[{ value: "all", label: "همه" }, ...CATS.map((c) => ({ value: c.key, label: c.label }))]}
          />
        </div>
      </header>

      <div className="wrap faq-body">
        {results.length === 0 ? (
          <Empty
            description={
              <>
                <b>چیزی پیدا نشد</b>
                <br />
                سوالت این‌جا نبود؟ مستقیم از پشتیبانی بپرس — معمولاً همان روز جواب می‌دهیم.
              </>
            }
          >
            <Button type="primary" href="/contact">پرسیدن از پشتیبانی</Button>
          </Empty>
        ) : (
          // forceRender: پاسخ‌ها باید از همان HTML اولیه در صفحه باشند؛ Collapse
          // پیش‌فرض پنلِ بسته را تا اولین بازشدن رندر نمی‌کند و گوگل نمی‌دیدشان.
          <Collapse
            className="faq-list"
            size="large"
            activeKey={open}
            onChange={(k) => setOpen(Array.isArray(k) ? k : [k])}
            items={results.map((f) => ({
              key: String(f.i),
              label: f.q,
              forceRender: true,
              children: <p>{f.a}</p>,
            }))}
          />
        )}

        <aside className="faq-cta">
          <div>
            <b>پاسخت را پیدا نکردی؟</b>
            <p>تیم پشتیبانی در سریع‌ترین زمان جواب می‌دهد.</p>
          </div>
          <div className="faq-cta__actions">
            <Button type="primary" href="/contact">ارتباط با ما</Button>
            <Button href={`${PANEL_URL}/questions/new`}>پرسیدن از متخصص</Button>
          </div>
        </aside>
      </div>
    </>
  );
}
