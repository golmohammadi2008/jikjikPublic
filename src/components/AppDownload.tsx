"use client";

import { useState } from "react";
import { APP_DOWNLOAD_URL, PANEL_URL, SITE_NAME } from "@/lib/config";

/* سه راهِ داشتنِ وینو روی گوشی/دسکتاپ.
   نکته‌ی مهم: نسخه‌ی نیتیوِ iOS نداریم — روی آیفون همان وب‌اپ (PWA) از سافاری
   نصب می‌شود و آیکونش کنار بقیه‌ی اپ‌ها می‌نشیند. به‌جای وعده‌ی «به‌زودی در
   اپ‌استور»، همین راهِ واقعی را با مراحلش نشان می‌دهیم. */

type Tab = "android" | "ios" | "pwa";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "android", label: "اندروید", icon: "🤖" },
  { key: "ios", label: "آیفون (iOS)", icon: "🍎" },
  { key: "pwa", label: "مرورگر / دسکتاپ", icon: "💻" },
];

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

  return (
    <div className="dl-card">
      <div className="dl-head">
        <h2>وینو را روی دستگاهت داشته باش</h2>
        <p>پاسخ متخصص و یادآوری جلسه‌ها با اعلان به دستت می‌رسد.</p>
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
            <span aria-hidden>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="dl-panel" role="tabpanel">
        {tab === "android" && (
          <>
            <p className="dl-lead">
              فایل نصبی مستقیم — بدون نیاز به فروشگاه. حجم حدود ۸۹ مگابایت.
            </p>
            <a className="btn btn-thyme" href={APP_DOWNLOAD_URL}>
              دانلود فایل نصبی اندروید
            </a>
            <Steps
              items={[
                "فایل را دانلود کن.",
                "اگر اندروید پرسید، اجازه‌ی «نصب از منابع ناشناس» را برای مرورگرت فعال کن.",
                "روی فایل دانلودشده بزن و نصب را تمام کن.",
              ]}
            />
          </>
        )}

        {tab === "ios" && (
          <>
            <p className="dl-lead">
              روی آیفون، {SITE_NAME} به‌صورت <b>وب‌اپ</b> نصب می‌شود: آیکونش کنار بقیه‌ی اپ‌ها
              می‌نشیند و تمام‌صفحه باز می‌شود.
            </p>
            <a className="btn btn-thyme" href={PANEL_URL}>
              باز کردن وینو در سافاری
            </a>
            <Steps
              items={[
                "این صفحه را در مرورگر «سافاری» باز کن (کروم روی آیفون این قابلیت را ندارد).",
                "دکمه‌ی اشتراک‌گذاری (مربع با فلش رو به بالا) را بزن.",
                "گزینه‌ی «Add to Home Screen / افزودن به صفحه اصلی» را انتخاب کن.",
                "روی «Add» بزن — آیکون وینو به صفحه‌ی اصلی اضافه می‌شود.",
              ]}
            />
            <p className="dl-note">
              اعلان‌های وب روی iOS فقط بعد از همین نصب کار می‌کنند و به iOS ۱۶٫۴ به بالا نیاز دارند.
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
                "در نوار آدرس، آیکون نصب (یک صفحه‌نمایش با فلش) را بزن — یا از منوی سه‌نقطه گزینه‌ی «Install» را انتخاب کن.",
                "روی «نصب» بزن؛ وینو به‌عنوان یک برنامه‌ی جدا باز می‌شود.",
              ]}
            />
          </>
        )}
      </div>
    </div>
  );
}
