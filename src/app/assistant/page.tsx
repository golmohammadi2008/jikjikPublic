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
    `بدون ثبت‌نام از دستیار هوشمند ${SITE_NAME} بپرس و همان لحظه پاسخ بگیر. ` +
    "برای هر حوزه یک مدل تخصصی: حقوقی، پزشکی و سلامت، روان‌شناسی و برنامه‌نویسی.",
  path: "/assistant",
});

export const revalidate = 300;

const DOMAINS = [
  { icon: "⚖️", title: "حقوقی", body: "قرارداد، شکایت، مهلت‌های قانونی و اینکه اصلاً سراغ چه نوع وکیلی بروی." },
  { icon: "🩺", title: "پزشکی و سلامت", body: "علائم، آزمایش‌ها، و مهم‌تر از همه اینکه کِی باید جدی بگیری." },
  { icon: "🧠", title: "روان‌شناسی", body: "گفتگوی آرام و بدون قضاوت، هر وقت شب یا روز که لازم شد." },
  { icon: "💻", title: "برنامه‌نویسی", body: "کد، خطا، و توضیحِ فنی به زبانی که بفهمی." },
];

export default async function AssistantPage() {
  const assistant = await getAssistantModels().catch(() => null);

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
          <h1>سوالت را همین‌جا بپرس</h1>
          <p className="hero-sub">
            بدون ثبت‌نام، بدون هزینه. پاسخ را همان لحظه می‌گیری — و اگر لازم شد،
            متخصص واقعی همین‌جاست.
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
          <div className="section-head">
            <h2>برای هر حوزه، یک مدل جدا</h2>
          </div>
          <p className="section-lead">
            یک مدل برای همه‌چیز خوب نیست. هر حوزه مدلِ خودش را دارد که برای همان
            کار سنجیده شده — و مدلی که جوابِ درست نمی‌داد، کنار گذاشته شد.
          </p>
          <div className="card-grid">
            {DOMAINS.map((d) => (
              <div className="card" key={d.title}>
                <span className="card-icon" aria-hidden="true">{d.icon}</span>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <h2>وقتی جوابِ ماشین کافی نیست</h2>
          </div>
          <p className="section-lead">
            دستیار برای شروع عالی است، ولی جای متخصص را نمی‌گیرد. در وینو
            روان‌شناس، وکیل، پزشک و معلمِ دارای پروانه هستند: مستقیم پیام بده یا
            جلسه‌ی تصویری رزرو کن — داخل خود اپ، بدون رد و بدل شماره.
          </p>
          <div className="cta-row">
            <Link className="btn btn-saffron" href="/specialists">دیدن متخصص‌ها</Link>
            <Link className="btn btn-ghost" href="/how-it-works">وینو چطور کار می‌کند</Link>
          </div>
        </div>
      </section>
    </>
  );
}
