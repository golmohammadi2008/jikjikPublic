import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "حریم خصوصی",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="wrap post-page">
      <article>
        <h1>حریم خصوصی {SITE_NAME}</h1>
        <div className="p-text">
          <p>
            حفظ حریم خصوصی کاربران برای {SITE_NAME} اهمیت بالایی دارد. این صفحه توضیح می‌دهد چه اطلاعاتی
            جمع‌آوری می‌شود و چطور استفاده می‌شود.
          </p>

          <h2 style={{ marginTop: 24, fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800 }}>
            اطلاعاتی که جمع‌آوری می‌شود
          </h2>
          <p>
            شماره تماس برای ورود، متن سوال‌ها و پاسخ‌ها، و در صورت رزرو جلسه، اطلاعات لازم برای برگزاری
            جلسه آنلاین.
          </p>

          <h2 style={{ marginTop: 24, fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800 }}>
            سوال‌های بی‌نام
          </h2>
          <p>
            سوال‌هایی که در بخش عمومی نمایش داده می‌شوند بدون نام یا مشخصات هویتی پرسش‌کننده منتشر می‌شوند.
          </p>

          <h2 style={{ marginTop: 24, fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800 }}>
            اشتراک‌گذاری اطلاعات
          </h2>
          <p>
            اطلاعات کاربران به شخص یا سازمان ثالثی برای مقاصد تبلیغاتی فروخته یا اجاره داده نمی‌شود.
          </p>

          <h2 style={{ marginTop: 24, fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800 }}>
            تماس با ما
          </h2>
          <p>برای سوالات مربوط به حریم خصوصی، از طریق اپلیکیشن با پشتیبانی در تماس باشید.</p>
        </div>
      </article>
    </main>
  );
}
