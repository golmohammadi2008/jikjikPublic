import type { Metadata } from "next";
import { PANEL_URL, SITE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "متخصص شو",
  description: `به شبکه متخصص‌های تاییدشده ${SITE_NAME} بپیوند و از طریق پاسخ به سوال‌ها و رزرو جلسه آنلاین درآمد کسب کن.`,
  alternates: { canonical: "/specialist-signup" },
};

export default function SpecialistSignupPage() {
  return (
    <main className="wrap post-page">
      <article>
        <h1>متخصص {SITE_NAME} شو</h1>
        <div className="p-text">
          <p>
            اگر پزشک، وکیل، مربی یا هر متخصص دیگری هستی، می‌توانی به سوال‌های کاربران پاسخ بدهی، پست منتشر
            کنی و جلسه آنلاین رزرو بگیری.
          </p>
        </div>

        <div className="answer-card" style={{ marginTop: 24 }}>
          <div className="expert-strip" style={{ border: 0, margin: 0, padding: 0 }}>
            <div className="who">
              <span>
                <b>ثبت‌نام متخصص</b>
                <br />
                <small style={{ color: "var(--ink-2)" }}>بررسی مدارک و تایید هویت قبل از فعال‌سازی پروفایل</small>
              </span>
            </div>
            <a className="btn btn-saffron btn-sm" href={`${PANEL_URL}/specialist-signup`}>
              شروع ثبت‌نام
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}
