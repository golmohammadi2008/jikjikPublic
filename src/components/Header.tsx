import Link from "next/link";
import { SITE_NAME, panelAskUrl } from "@/lib/config";
import HeaderAuth from "@/components/HeaderAuth";

// استاتیک نگه‌داشته می‌شود (کش/ISR صفحات عمومی حفظ شود) — چک لاگین در HeaderAuth
// سمت کلاینت انجام می‌شود، نه اینجا با cookies() که کل صفحه را دینامیک می‌کند.
export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="logo" href="/">
          {SITE_NAME}<span className="dot">.</span>
        </Link>
        <nav className="main-nav" aria-label="ناوبری اصلی">
          <Link href="/questions">سوال‌ها</Link>
          <Link href="/specialists">متخصص‌ها</Link>
          <Link href="/category/doctor">پزشکی</Link>
          <Link href="/category/lawyer">حقوقی</Link>
        </nav>
        <div className="header-actions">
          <HeaderAuth />
          <a className="btn btn-saffron btn-sm" href={panelAskUrl()}>
            سوال بپرس
          </a>
        </div>
      </div>
    </header>
  );
}
