export const SITE_NAME = "جیک‌جیک";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jikjik.minicook.ir";
export const APP_DOWNLOAD_URL = "https://jikjik.minicook.ir/jikjik.apk";

// پنل وب (لاگین، پرسش، پروفایل متخصص) — فعلاً آماده/دیپلوی‌نشده، فقط لینک‌دهی رو به جلو
export const PANEL_URL = "https://panel.jikjik.minicook.ir";

// فاز دمو: تا لانچ عمومی، همه‌جا noindex + robots.txt بسته. روز لانچ فقط این
// env var را true کن (README همراه mockupها هم همین را می‌گفت) — کد جای دیگری
// نیازی به تغییر ندارد.
export const PUBLIC_INDEXING = process.env.NEXT_PUBLIC_INDEXING === "true";
