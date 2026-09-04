import Link from "next/link";
import { PANEL_URL, SITE_NAME } from "@/lib/config";
import HeaderAuth from "@/components/HeaderAuth";

// استاتیک نگه‌داشته می‌شود (کش/ISR صفحات عمومی حفظ شود) — چک لاگین در HeaderAuth
// سمت کلاینت انجام می‌شود، نه اینجا با cookies() که کل صفحه را دینامیک می‌کند.
export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="logo" href="/">
          <span className="logo-mark" aria-hidden="true">و</span>
          {SITE_NAME}
        </Link>
        <nav className="main-nav" aria-label="ناوبری اصلی">
          <Link href="/">صفحه اصلی</Link>
          <Link href="/specialists">متخصصان</Link>
          <a href={`${PANEL_URL}/sessions`}>جلسات من</a>
        </nav>
        <div className="header-actions">
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
