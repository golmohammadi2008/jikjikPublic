import type { Metadata } from "next";
import Link from "next/link";
import AssistantWidget from "@/components/AssistantWidget";
import { getAssistantModels } from "@/lib/api";
import { webPageLd, jsonLdProps } from "@/lib/jsonLd";
import { pageMeta } from "@/lib/pageMeta";
import { PANEL_URL, SITE_NAME } from "@/lib/config";

/**
 * صفحه‌ی مستقلِ دستیار هوشمند.
 *
 * چرا جدا از صفحه‌ی اصلی: ویجت وسطِ صفحه‌ی خانه گم بود — کاربر بین هیرو و
 * فهرستِ پست‌ها از کنارش رد می‌شد. یک صفحه‌ی اختصاصی هم نشانیِ قابل‌اشتراکِ
 * خودش را دارد (`/assistant`)، هم در گوگل روی عبارت‌های «پرسیدن از هوش
 * مصنوعی» دیده می‌شود، هم جایی است که می‌شود در تبلیغات مستقیم به آن لینک داد.
 *
 * قیف: اینجا رایگان می‌پرسد → سهمیه تمام می‌شود → با همان سوال وارد پنل
 * می‌شود (`/assistant?q=…`) و جوابِ همان را می‌گیرد، نه صفحه‌ی خالی.
 */
export const metadata: Metadata = pageMeta({
  title: "دستیار هوشمند — پاسخ فوری به سوال‌های حقوقی، پزشکی و روان‌شناسی",
  description:
    `از دستیار هوشمند ${SITE_NAME} بپرس و همان لحظه پاسخ بگیر — اولین سوال‌ها رایگان. ` +
    "برای هر حوزه یک مدل تخصصی: حقوقی، پزشکی و سلامت، روان‌شناسی و برنامه‌نویسی.",
  path: "/assistant",
});

export const revalidate = 300;

const DOMAINS = [
  { icon: "⚖️", title: "حقوقی", body: "قرارداد، شکایت، مهلت قانونی" },
  { icon: "🩺", title: "پزشکی", body: "علائم، آزمایش، کِی جدی است" },
  { icon: "🧠", title: "روان‌شناسی", body: "بدون قضاوت، هر ساعت شب" },
  { icon: "💻", title: "برنامه‌نویسی", body: "کد، خطا، معماری" },
];

export default async function AssistantPage() {
  const assistant = await getAssistantModels().catch(() => null);
  const freeAsks = assistant?.freeAsks ?? 0;

  const jsonLd = webPageLd({
    path: "/assistant",
    name: "دستیار هوشمند وینو",
    description: "پرسش رایگان از دستیار هوشمند با مدل تخصصی برای هر حوزه.",
    crumbs: [{ name: "دستیار هوشمند" }],
  });

  return (
    <>
      <script {...jsonLdProps(jsonLd)} />

      <section className="hero hero-compact">
        <div className="wrap">
          <h1>بپرس، همین حالا جواب بگیر</h1>
          <p className="hero-sub">
            {freeAsks > 0
              ? `${freeAsks.toLocaleString("fa-IR")} سوال رایگان، همین‌جا و همین حالا.`
              : "همین حالا بپرس."}{" "}
            و هر جا لازم شد، متخصص واقعی همین‌جاست.
          </p>
        </div>
      </section>

      {assistant && assistant.models.length > 0 ? (
        <AssistantWidget models={assistant.models} freeAsks={assistant.freeAsks} />
      ) : (
        /* بن‌بست نمی‌دهیم: اگر سرویس در دسترس نبود، راهِ ورود همچنان هست */
        <section className="section">
          <div className="wrap" style={{ textAlign: "center" }}>
            <p>دستیار موقتاً در دسترس نیست.</p>
            <a className="btn btn-saffron" href={`${PANEL_URL}/assistant`}>ورود به پنل</a>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <div className="domain-row">
            {DOMAINS.map((d) => (
              <div className="domain-chip" key={d.title}>
                <span aria-hidden="true">{d.icon}</span>
                <b>{d.title}</b>
                <small>{d.body}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
