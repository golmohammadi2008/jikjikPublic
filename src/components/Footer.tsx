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
          </div>
          <nav aria-label="لینک‌های فوتر">
            <Link href="/questions">سوال‌ها</Link>
            <Link href="/specialists">متخصص‌ها</Link>
            <Link href="/terms">شرایط استفاده</Link>
            <Link href="/privacy">حریم خصوصی</Link>
            <Link href="/specialist-signup">متخصص شو</Link>
          </nav>
        </div>
        <p className="legal-note">
          پاسخ‌های هوش مصنوعی صرفاً جنبه اطلاع‌رسانی اولیه دارند و جایگزین تشخیص و نظر متخصص نیستند. در شرایط
          اضطراری با اورژانس (۱۱۵) یا اورژانس اجتماعی (۱۲۳) تماس بگیرید.
        </p>
      </div>
    </footer>
  );
}
