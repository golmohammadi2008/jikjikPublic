const AVATAR_COLORS = ["#0E7266", "#6553C6", "#C46A05", "#3C6E9F", "#8A4FB0", "#B0473F"];

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 1);
  return `${parts[0].slice(0, 1)}.${parts[1].slice(0, 1)}`;
}

export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function excerpt(text: string, max = 140): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= max) return clean;
  return clean.slice(0, max).trim() + "…";
}

// چون عنوان مجزا در دیتای بک‌اند نداریم، اولین جمله یا بخش کوتاه متن را عنوان می‌گیریم
export function deriveTitle(text: string, max = 70): string {
  const clean = text.trim().replace(/\s+/g, " ");
  const firstSentence = clean.split(/(?<=[.!؟?])\s/)[0];
  if (firstSentence && firstSentence.length <= max) return firstSentence;
  return excerpt(clean, max);
}

export function formatJalali(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", { calendar: "persian", dateStyle: "long" }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function formatCount(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(n);
}

/** امتیاز با ارقام فارسی و ممیز فارسی «٫» — مثل «۴٫۸» */
export function formatRating(n: number): string {
  return new Intl.NumberFormat("fa-IR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);
}

/**
 * قیمتِ تومان با جداکننده‌ی فارسی: `۴۵۰٬۰۰۰ تومان`.
 * صفر یعنی متخصص هنوز نرخی نگذاشته — عدد نشان نمی‌دهیم، چون «۰ تومان»
 * به بازدیدکننده می‌گوید رایگان است.
 */
export function formatToman(n: number): string | null {
  if (!n || n <= 0) return null;
  return `${n.toLocaleString("fa-IR")} تومان`;
}

/** «۳۰ دقیقه» / «۱ ساعت» / «۱ ساعت و ۳۰ دقیقه» */
export function formatDuration(minutes: number): string {
  const m = Math.max(0, Math.round(minutes || 0));
  if (m < 60) return `${m.toLocaleString("fa-IR")} دقیقه`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  const hp = `${h.toLocaleString("fa-IR")} ساعت`;
  return rest ? `${hp} و ${rest.toLocaleString("fa-IR")} دقیقه` : hp;
}

/**
 * فاصله تا یک لحظه‌ی آینده، به زبان آدمیزاد: «امروز»، «فردا»، «۳ روز دیگر».
 * برای «نزدیک‌ترین وقتِ خالی» — تاریخِ دقیق به بازدیدکننده چیزی نمی‌گوید،
 * ولی «فردا» تصمیم را راحت می‌کند.
 *
 * مقایسه روی مرزِ *روز* انجام می‌شود نه اختلافِ ساعت: وقتی ساعتِ ۲۳ است،
 * جلسه‌ی ساعتِ ۹ صبحِ فردا ۱۰ ساعت فاصله دارد ولی «فردا»ست، نه «امروز».
 */
export function formatWhenFuture(iso: string): string | null {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;

  const startOfDay = (ms: number) => {
    const d = new Date(ms);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
  const days = Math.round((startOfDay(t) - startOfDay(Date.now())) / 86_400_000);

  if (days <= 0) return "امروز";
  if (days === 1) return "فردا";
  if (days < 7) return `${days.toLocaleString("fa-IR")} روز دیگر`;
  return formatJalali(iso);
}

/** آیا در هفت روز گذشته فعال بوده؟ — نشانِ «فعال» کنارِ دکمه‌ی رزرو */
export function isRecentlyActive(iso: string | null): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) && Date.now() - t < 7 * 86_400_000;
}
