"use client";

import { useState } from "react";
import { APP_DOWNLOAD_URL, PANEL_URL, SITE_NAME, STORE_URLS } from "@/lib/config";

/**
 * راه‌های داشتنِ وینو روی دستگاه.
 *
 * چه چیزی عوض شد و چرا:
 *   • ایموجی به‌عنوان آیکون رفت. ایموجی در هر سیستم‌عامل شکلِ دیگری دارد،
 *     اندازه‌اش با متن هماهنگ نمی‌شود و برای صفحه‌خوان نویز است. جایش SVG
 *     درون‌خطی نشست که رنگش را از خودِ متن می‌گیرد.
 *   • فروشگاه‌ها آمدند بالا. کاربر ایرانی اپ را از مایکت و بازار می‌گیرد؛
 *     فایلِ نصبیِ مستقیم راهِ دوم است نه اول. نشانیِ خالی در config یعنی
 *     هنوز منتشر نشده و دکمه‌اش اصلاً ساخته نمی‌شود — لینکِ مرده بدتر از
 *     نبودنِ دکمه است.
 *   • تب‌ها ماندند ولی متنشان کوتاه شد: هر تب یک کارِ روشن دارد، نه یک
 *     پاراگراف توضیح.
 *
 * نسخه‌ی نیتیوِ iOS نداریم و وعده‌اش را هم نمی‌دهیم؛ روی آیفون همان وب‌اپ
 * از سافاری نصب می‌شود و آیکونش کنار بقیه می‌نشیند.
 */

type Tab = "android" | "ios" | "pwa";

function IconAndroid() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.6 9.48l1.84-3.18a.4.4 0 00-.7-.4l-1.87 3.22a11.4 11.4 0 00-9.74 0L5.26 5.9a.4.4 0 10-.7.4L6.4 9.48A10.8 10.8 0 001 18h22a10.8 10.8 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
    </svg>
  );
}
function IconApple() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8c-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.6 2.3 2.8 2.2 1.1 0 1.6-.7 2.9-.7s1.7.7 2.9.7c1.2 0 2-1.1 2.7-2.2.9-1.2 1.2-2.4 1.2-2.5 0 0-2.4-.9-2.4-3.5zM14.2 5.6c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.7-.9 2.8 1 .1 2-.5 2.6-1.3z" />
    </svg>
  );
}
function IconDesktop() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}
function IconDownload() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

const TABS: { key: Tab; label: string; Icon: () => React.ReactElement }[] = [
  { key: "android", label: "اندروید", Icon: IconAndroid },
  { key: "ios", label: "آیفون", Icon: IconApple },
  { key: "pwa", label: "مرورگر و دسکتاپ", Icon: IconDesktop },
];

/** دکمه‌ی فروشگاه — نامِ فروشگاه بزرگ، «دریافت از» کوچک بالایش. */
/**
 * فروشگاهی که نشانِ رسمی دارد با همان نشان نشان داده می‌شود، نه با دکمه‌ی
 * دست‌سازِ ما.
 *
 * راهنمای بازار (cafebazaar.ir/badge) صریح است: پس‌زمینه‌ی سیاه، متن سفید،
 * آرم با رنگ اصلی، و «در رنگ، متن، آرم و گرافیک آن هیچ تغییری ندهید».
 * حداقل ارتفاعِ مجاز برای وب ۴۰ پیکسل است و نشان نباید کشیده یا فشرده شود،
 * پس `width: auto` می‌ماند تا نسبتِ ۴۲۱×۱۲۵ دست‌نخورده بماند.
 *
 * فایل را خودمان میزبانی می‌کنیم نه از s.cafebazaar.ir: تصویرِ بیرونی یعنی
 * دکمه‌ی دانلود به دسترس‌بودنِ CDN شخصِ دیگری وابسته شود. کپیِ بدون تغییر
 * است، پس با قواعد نمی‌خواند.
 */
const STORE_BADGES: Record<string, { src: string; alt: string }> = {
  bazaar: { src: "/assets/bazaar-badge.png", alt: "دریافت از بازار" },
};

function StoreButton({ href, name, storeKey }: { href: string; name: string; storeKey: string }) {
  const badge = STORE_BADGES[storeKey];

  if (badge) {
    return (
      <a className="dl-badge" href={href} target="_blank" rel="noopener">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={badge.src} alt={badge.alt} width={421} height={125} />
      </a>
    );
  }

  return (
    <a className="dl-store" href={href} target="_blank" rel="noopener">
      <span className="dl-store__sub">دریافت از</span>
      <span className="dl-store__name">{name}</span>
    </a>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="dl-steps">
      {items.map((s, i) => (
        <li key={i}>
          <span className="dl-step-num">{(i + 1).toLocaleString("fa-IR")}</span>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}

export default function AppDownload() {
  const [tab, setTab] = useState<Tab>("android");
  const stores = [
    { key: "myket", name: "مایکت", href: STORE_URLS.myket },
    { key: "bazaar", name: "کافه‌بازار", href: STORE_URLS.bazaar },
  ].filter((s) => s.href);

  return (
    <div className="dl-card">
      {/* ── نوارِ بالا: عنوان و کارِ اصلی در یک سو، QR در سوی دیگر ──
          QR روی موبایل عمداً رندر نمی‌شود (`dl-hero__scan` زیر ۷۲۰px
          حذف است): کسی که با گوشی این صفحه را باز کرده، خودش همان‌جاست
          که QR می‌خواهد ببردش. آن‌جا دکمه‌ها تمام‌عرض می‌شوند. */}
      <div className="dl-hero">
        <div className="dl-hero__copy">
          <h2>وینو را روی گوشی‌ات داشته باش</h2>
          <p>پاسخ متخصص و یادآوری جلسه‌ها با اعلان به دستت می‌رسد.</p>

          <div className="dl-hero__cta">
            {STORE_URLS.bazaar && (
              <StoreButton href={STORE_URLS.bazaar} name="کافه‌بازار" storeKey="bazaar" />
            )}
            <a className="dl-hero__apk" href={APP_DOWNLOAD_URL}>
              <IconDownload />
              دانلود مستقیم فایل نصبی
            </a>
          </div>
        </div>

        <div className="dl-hero__scan" aria-hidden="false">
          <div className="dl-qr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/qr-weeno.svg" alt="کد QR برای باز کردن وینو روی گوشی" width={200} height={200} />
          </div>
          <p className="dl-qr__cap">با دوربین گوشی اسکن کن</p>
        </div>
      </div>

      <div className="dl-tabs" role="tablist" aria-label="روش نصب">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            className={`dl-tab${tab === t.key ? " is-active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            <t.Icon />
            {t.label}
          </button>
        ))}
      </div>

      <div className="dl-panel" role="tabpanel">
        {tab === "android" && (
          <>
            {/* دکمه‌ها بالا در نوارِ hero هستند و این‌جا تکرار نمی‌شوند.
                فروشگاهی که badge ندارد (مثلاً مایکت وقتی منتشر شود) این‌جا
                می‌آید، چون در hero فقط راهِ اول جا می‌شود. */}
            {stores.filter((s) => s.key !== "bazaar").length > 0 && (
              <div className="dl-stores">
                {stores
                  .filter((s) => s.key !== "bazaar")
                  .map((s) => (
                    <StoreButton key={s.key} href={s.href} name={s.name} storeKey={s.key} />
                  ))}
              </div>
            )}

            <p className="dl-lead">
              از <b>کافه‌بازار</b> نصب کن تا به‌روزرسانی‌ها خودکار بیاید. اگر بازار نداری،
              فایل نصبی را مستقیم بگیر — حدود ۸۹ مگابایت.
            </p>

            <Steps
              items={[
                "فایل را دانلود کن.",
                "اگر اندروید پرسید، «نصب از منابع ناشناس» را برای مرورگرت اجازه بده.",
                "روی فایل دانلودشده بزن و نصب را تمام کن.",
              ]}
            />
          </>
        )}

        {tab === "ios" && (
          <>
            <p className="dl-lead">
              روی آیفون، {SITE_NAME} به‌صورت <b>وب‌اپ</b> نصب می‌شود — آیکونش کنار بقیه‌ی
              اپ‌ها می‌نشیند و تمام‌صفحه باز می‌شود.
            </p>
            <a className="btn btn-thyme" href={PANEL_URL}>
              باز کردن در سافاری
            </a>
            <Steps
              items={[
                "این صفحه را در «سافاری» باز کن — کروم روی آیفون این قابلیت را ندارد.",
                "دکمه‌ی اشتراک‌گذاری (مربع با فلشِ رو به بالا) را بزن.",
                "«Add to Home Screen» را انتخاب و تایید کن.",
              ]}
            />
            <p className="dl-note">
              اعلان‌ها روی iOS فقط بعد از همین نصب کار می‌کنند و به iOS ۱۶٫۴ به بالا نیاز دارند.
            </p>
          </>
        )}

        {tab === "pwa" && (
          <>
            <p className="dl-lead">
              روی ویندوز، مک، لینوکس و اندروید می‌توانی وینو را مثل یک برنامه‌ی مستقل نصب کنی —
              بدون نوار آدرس، با آیکون خودش.
            </p>
            <a className="btn btn-thyme" href={PANEL_URL}>
              باز کردن پنل وینو
            </a>
            <Steps
              items={[
                "پنل را در کروم یا اِج باز کن.",
                "در نوار آدرس، آیکون نصب را بزن — یا از منوی سه‌نقطه «Install» را انتخاب کن.",
                "روی «نصب» بزن؛ وینو به‌عنوان برنامه‌ی جدا باز می‌شود.",
              ]}
            />
          </>
        )}
      </div>
    </div>
  );
}
