export const SITE_NAME = "وینو";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://weeno.ir";
export const APP_DOWNLOAD_URL = "https://weeno.ir/weeno.apk";

/**
 * فروشگاه‌های اپ.
 *
 * رشته‌ی خالی یعنی «هنوز منتشر نشده» و دکمه‌اش اصلاً رندر نمی‌شود — به‌جای
 * لینکِ مرده یا وعده‌ی «به‌زودی» که کاربر رویش کلیک کند و به هیچ‌جا نرسد.
 * برای انتشار، فقط همین نشانی پر می‌شود.
 */
export const STORE_URLS = {
  // مایکت هنوز منتشر نشده؛ خالی می‌ماند تا دکمه‌اش رندر نشود.
  myket: "",
  bazaar: "https://cafebazaar.ir/app/ir.minicook.jikjik.mobile",
} as const;

// تصویر پیش‌فرضِ اشتراک‌گذاری. هر صفحه‌ای که openGraph خودش را تعریف می‌کند
// باید این را هم بگذارد: Next آبجکتِ openGraph والد را merge نمی‌کند و کاملاً
// جایگزینش می‌کند، پس بدون این، آن صفحه بی‌تصویر در تلگرام/واتساپ باز می‌شود.
export const OG_IMAGE = "/assets/og-cover.png";

// پنل وب (لاگین، پرسش، پروفایل متخصص)
export const PANEL_URL = "https://panel.weeno.ir";

// API عمومی برای فراخوانی‌های کلاینتی (تشخیص لاگین در هدر) — weeno.ir خودش
// /api را پروکسی نمی‌کند، پس مستقیم به ساب‌دامین api می‌رود (CORS: *)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "https://api.weeno.ir";

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

/** کوکی سشن پنل وب — با domain=.weeno.ir بین پنل و این سایت مشترک است */
export const SESSION_TOKEN_COOKIE = "jikjik_web_token";

// فاز دمو: تا لانچ عمومی، همه‌جا noindex + robots.txt بسته. روز لانچ فقط این
// env var را true کن (README همراه mockupها هم همین را می‌گفت) — کد جای دیگری
// نیازی به تغییر ندارد.
export const PUBLIC_INDEXING = process.env.NEXT_PUBLIC_INDEXING === "true";
