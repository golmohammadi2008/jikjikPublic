import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "شرایط استفاده",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="wrap post-page">
      <article>
        <h1>شرایط استفاده از {SITE_NAME}</h1>
        <div className="p-text">
          <p>
            با استفاده از {SITE_NAME} (وب‌سایت و اپلیکیشن) شرایط زیر را می‌پذیرید. لطفاً پیش از استفاده این
            صفحه را با دقت مطالعه کنید.
          </p>

          <h2 style={{ marginTop: 24, fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800 }}>
            ماهیت خدمات
          </h2>
          <p>
            {SITE_NAME} بستری برای پرسش از متخصص‌های تاییدشده و دریافت پاسخ اولیه از هوش مصنوعی است. پاسخ‌های
            هوش مصنوعی صرفاً جنبه اطلاع‌رسانی اولیه دارند و جایگزین تشخیص، ویزیت یا نظر تخصصی متخصص انسانی
            نیستند.
          </p>

          <h2 style={{ marginTop: 24, fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800 }}>
            مسئولیت کاربر
          </h2>
          <p>
            کاربران موظف‌اند اطلاعات درست ارائه دهند و از انتشار محتوای غیرقانونی، توهین‌آمیز یا ناقض حریم
            خصوصی دیگران خودداری کنند. متخصص‌های عضو پلتفرم مسئول صحت اطلاعات حرفه‌ای و مجوزهای خود هستند.
          </p>

          <h2 style={{ marginTop: 24, fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800 }}>
            رزرو و پرداخت
          </h2>
          <p>
            جزئیات رزرو جلسه، هزینه و شرایط انصراف در زمان رزرو، داخل اپلیکیشن یا پنل وب به کاربر نمایش داده
            می‌شود.
          </p>

          <h2 style={{ marginTop: 24, fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800 }}>
            تغییرات
          </h2>
          <p>
            این شرایط ممکن است به‌روزرسانی شود؛ نسخه فعلی همیشه در همین صفحه در دسترس است.
          </p>
        </div>
      </article>
    </main>
  );
}
