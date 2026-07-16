export const SITE_NAME = "بلدیم";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jikjik.minicook.ir";
export const APP_DOWNLOAD_URL = "https://jikjik.minicook.ir/jikjik.apk";

// پنل وب (لاگین، پرسش، پروفایل متخصص)
export const PANEL_URL = "https://panel.jikjik.minicook.ir";

/** رزرو جلسه — مستقیم به پروفایل متخصص در پنل وب */
export function panelUserUrl(username: string): string {
  return `${PANEL_URL}/user/${username}`;
}

/** بپرس / سوال جدید — صفحه ثبت سوال در پنل وب */
export function panelAskUrl(): string {
  return `${PANEL_URL}/questions/new`;
}

/** پروفایل خودم — تب پروفایل در پنل وب (وقتی لاگین هستم) */
export function panelProfileUrl(): string {
  return `${PANEL_URL}/profile`;
}

/** کوکی سشن پنل وب — با domain=.jikjik.minicook.ir بین پنل و این سایت مشترک است */
export const SESSION_TOKEN_COOKIE = "jikjik_web_token";

// فاز دمو: تا لانچ عمومی، همه‌جا noindex + robots.txt بسته. روز لانچ فقط این
// env var را true کن (README همراه mockupها هم همین را می‌گفت) — کد جای دیگری
// نیازی به تغییر ندارد.
export const PUBLIC_INDEXING = process.env.NEXT_PUBLIC_INDEXING === "true";
