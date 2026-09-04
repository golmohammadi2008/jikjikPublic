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
  {
    icon: "⚖️",
    title: "حقوقی",
    body:
      "مهلت تجدیدنظر چند روز است؟ این بند قرارداد یعنی چه؟ شکایتم را باید کجا ثبت کنم؟ " +
      "پاسخ با ارجاع به ماده‌ی قانونی، نه حدس.",
  },
  {
    icon: "🩺",
    title: "پزشکی و سلامت",
    body:
      "این علامت را جدی بگیرم یا نه؟ جواب آزمایشم چه می‌گوید؟ " +
      "دستیار تشخیص نمی‌دهد و نسخه نمی‌نویسد — می‌گوید کِی باید بروی و پیش چه کسی.",
  },
  {
    icon: "🧠",
    title: "روان‌شناسی",
    body:
      "ساعت سه بامداد که هیچ مطبی باز نیست هم جواب می‌دهد. " +
      "بدون قضاوت، بدون اینکه لازم باشد اسمت را بگویی.",
  },
  {
    icon: "💻",
    title: "برنامه‌نویسی",
    body:
      "خطا را بچسبان، توضیح بگیر. معماری، دیباگ، و بازنویسی کد — " +
      "به فارسی، نه ترجمه‌ی ماشینی از استک‌اورفلو.",
  },
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
          <h1>جواب را همین‌جا بگیر، نه بعد از ده تا جستجو</h1>
          <p className="hero-sub">
            یک سوال بپرس، همان لحظه جواب بگیر. بدون ثبت‌نام، بدون هزینه، بدون
            اینکه اسمت را جایی بنویسی. و هر جا که پای تصمیم جدی وسط بود،
            متخصص دارای پروانه یک قدم آن‌طرف‌تر است.
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
            <h2>برای هر حوزه، یک مدل جدا — نه یک مدل برای همه‌چیز</h2>
          </div>
          <p className="section-lead">
            یک مدل برای همه‌چیز خوب نیست. هر حوزه مدل خودش را دارد و هر مدل با
            سوال‌های واقعی همان حوزه سنجیده شده — نه با ادعای سازنده‌اش.
            مدلی که ماده‌ی قانون را از خودش ساخت، حذف شد و جایش مدلی نشست که
            درست جواب داد. این کار یک‌بار انجام نشده؛ هر بار که مدل تازه‌ای
            می‌آید تکرار می‌شود.
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
            <h2>و آن‌جا که ماشین کافی نیست</h2>
          </div>
          <p className="section-lead">
            هوش مصنوعی پرونده‌ی تو را نمی‌بیند، مسئولیت هم نمی‌پذیرد. برای
            تصمیمی که پای سلامت، پول یا آبرویت وسط است، آدمِ دارای پروانه لازم
            است. در وینو روان‌شناس، وکیل، پزشک و معلم با مدرک تاییدشده هستند:
            مستقیم پیام بده یا جلسه‌ی تصویری بگیر — داخل خود اپ، بدون رد و بدل
            شماره و بدون اینکه شماره‌ات دست کسی بیفتد.
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
