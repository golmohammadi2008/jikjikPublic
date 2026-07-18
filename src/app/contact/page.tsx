import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { SITE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "ارتباط با ما",
  description: `راه‌های ارتباط با تیم ${SITE_NAME} — پشتیبانی تلفنی و فرم تماس.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="wrap contact-page">
      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link href="/">{SITE_NAME}</Link> › ارتباط با ما
      </nav>

      <div className="section-head">
        <h2>ارتباط با ما</h2>
      </div>
      <p style={{ color: "var(--ink-2)", marginBottom: 24 }}>
        سوال، پیشنهاد یا مشکلی دارید؟ از راه‌های زیر با ما در تماس باشید — تیم پشتیبانی در سریع‌ترین زمان پاسخ می‌دهد.
      </p>

      <div className="contact-grid">
        <aside className="contact-info">
          <div className="contact-info-item">
            <span className="ci-icon" aria-hidden="true">☎</span>
            <div>
              <b>پشتیبانی تلفنی</b>
              <a href="tel:+988736235218" dir="ltr" style={{ display: "inline-block", color: "var(--thyme)", fontWeight: 600 }}>۰۸۷۳۶۲۳۵۲۱۸</a>
            </div>
          </div>
          <div className="contact-info-item">
            <span className="ci-icon" aria-hidden="true">✉</span>
            <div>
              <b>ایمیل</b>
              <a href="mailto:info@weeno.ir" dir="ltr" style={{ display: "inline-block", color: "var(--thyme)", fontWeight: 600 }}>info@weeno.ir</a>
            </div>
          </div>
        </aside>

        <ContactForm />
      </div>
    </main>
  );
}
