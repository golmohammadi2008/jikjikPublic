import Link from "next/link";
import { SITE_NAME } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="cols">
          <div>
            <Link className="logo" href="/">
              <span className="logo-mark" aria-hidden="true">و</span>
              {SITE_NAME}
            </Link>
            <p style={{ marginTop: 8, maxWidth: 320 }}>
              پلتفرم پرسش از متخصص و رزرو جلسه آنلاین.
            </p>
            <p style={{ marginTop: 12, fontSize: 13.5 }}>
              پشتیبانی:{" "}
              <a href="tel:+982191550953" style={{ color: "var(--thyme)", fontWeight: 600, direction: "ltr", display: "inline-block" }}>
                ۰۲۱۹۱۵۵۰۹۵۳
              </a>
            </p>
          </div>
          <nav aria-label="لینک‌های فوتر">
            <Link href="/questions">سوال‌ها</Link>
            <Link href="/specialists">متخصص‌ها</Link>
            <Link href="/contact">ارتباط با ما</Link>
            <Link href="/terms">شرایط استفاده</Link>
            <Link href="/privacy">حریم خصوصی</Link>
            <Link href="/specialist-signup">متخصص شو</Link>
          </nav>

          {/* نماد اعتماد الکترونیکی — کد و referrerPolicy برای اعتبارسنجی
              اینماد لازم‌اند و نباید حذف شوند. next/image استفاده نمی‌کنیم
              چون تصویر باید مستقیم از دامنه‌ی خود اینماد سرو شود. */}
          <div className="footer-badges">
            <a
              referrerPolicy="origin"
              target="_blank"
              href="https://trustseal.enamad.ir/?id=6938582&Code=zeQF7WdEpF02ru2Y69qECAX925MxJb6l"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                referrerPolicy="origin"
                src="https://trustseal.enamad.ir/logo.aspx?id=6938582&Code=zeQF7WdEpF02ru2Y69qECAX925MxJb6l"
                alt="نماد اعتماد الکترونیکی"
                {...{ code: "zeQF7WdEpF02ru2Y69qECAX925MxJb6l" }}
              />
            </a>
          </div>
        </div>
        <p className="legal-note">
          پاسخ‌های هوش مصنوعی صرفاً جنبه اطلاع‌رسانی اولیه دارند و جایگزین تشخیص و نظر متخصص نیستند. در شرایط
          اضطراری با اورژانس (۱۱۵) یا اورژانس اجتماعی (۱۲۳) تماس بگیرید.
        </p>
      </div>
    </footer>
  );
}
