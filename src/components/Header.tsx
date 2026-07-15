import Link from "next/link";
import { PANEL_URL, SITE_NAME } from "@/lib/config";

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
          <a className="btn btn-ghost btn-sm" href={PANEL_URL}>
            ورود
          </a>
          <a className="btn btn-saffron btn-sm" href={`${PANEL_URL}`}>
            سوال بپرس
          </a>
        </div>
      </div>
    </header>
  );
}
