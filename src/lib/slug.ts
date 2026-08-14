import { captionPlainText } from "@/lib/caption";

// نقشه‌ی حروف فارسی/عربی به لاتین برای اسلاگ خواناتر در URL — دقت زبان‌شناسی
// لازم نیست، فقط برای خوانایی است؛ تطبیقِ واقعی همیشه از روی ObjectId انتهای
// اسلاگ انجام می‌شود.
const FA_TO_LATIN: Record<string, string> = {
  ا: "a", آ: "a", ب: "b", پ: "p", ت: "t", ث: "s", ج: "j", چ: "ch", ح: "h",
  خ: "kh", د: "d", ذ: "z", ر: "r", ز: "z", ژ: "zh", س: "s", ش: "sh", ص: "s",
  ض: "z", ط: "t", ظ: "z", ع: "a", غ: "gh", ف: "f", ق: "gh", ک: "k", گ: "g",
  ل: "l", م: "m", ن: "n", و: "v", ه: "h", ی: "y", ئ: "y", ء: "",
};

export function slugify(text: string): string {
  const transliterated = text
    .split("")
    .map((ch) => FA_TO_LATIN[ch] ?? ch)
    .join("");

  return transliterated
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)
    .replace(/-$/g, "");
}

const OBJECT_ID_RE = /[0-9a-f]{24}$/i;

export function buildSlug(text: string, id: string): string {
  const prefix = slugify(text);
  return prefix ? `${prefix}-${id}` : id;
}

/**
 * اسلاگِ پست همیشه از *متنِ ساده‌ی* کپشن ساخته می‌شود.
 *
 * کپشن حالا نشانه‌گذاری دارد؛ اگر با متنِ خام ساخته شود، کپشنی که با بلوک کد
 * شروع می‌شود اسلاگش «php-echo-hi» می‌گیرد و بدتر اینکه هر صفحه‌ای که لینکِ
 * پست را می‌سازد باید دقیقاً همین حساب را بکند وگرنه لینک‌های داخلی همه ۳۰۸
 * می‌خورند. یک تابع، یک جواب.
 */
export function buildPostSlug(post: { title?: string; caption: string; id: string }): string {
  // عنوانِ صریح مقدم است: اسلاگِ کوتاه و خوانا بهتر از شصت کاراکترِ اولِ کپشن
  const source = post.title?.trim() || captionPlainText(post.caption);
  return buildSlug(source, post.id);
}

// از انتهای اسلاگ، ۲۴ کاراکتر هگز (ObjectId واقعی) را استخراج می‌کند — بدون
// توجه به بخش فارسی/خوانا؛ اگر تطبیق نکرد null برمی‌گرداند.
export function extractObjectId(slug: string): string | null {
  const match = slug.match(OBJECT_ID_RE);
  return match ? match[0] : null;
}
