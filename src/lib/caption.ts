// ⚠️ فایلِ تولیدشده — دست نزن.
//
// منبع: chat/shared/caption.ts
// بازتولید: node scripts/sync-types.js  (در مخزن بک‌اند)
//
// هر ویرایشِ دستی این‌جا با اجرای بعدیِ اسکریپت پاک می‌شود و تا آن لحظه یک
// دریفتِ خاموش است — دقیقاً همان چیزی که این اسکریپت برای بستنش نوشته شد.

export type CaptionSpan =
  | { type: "text"; text: string }
  | { type: "bold"; text: string }
  | { type: "italic"; text: string }
  | { type: "code"; text: string }
  /** text شاملِ خودِ # است تا متنِ ساده بدون بازسازی به‌دست بیاید */
  | { type: "tag"; text: string };

export type CaptionBlock =
  | { type: "code"; lang: string; code: string }
  | { type: "para"; spans: CaptionSpan[] };

/**
 * فنس باید سرِ خط باشد. بدون این، هر ``` وسطِ جمله بلوک کد می‌ساخت و کپشنِ
 * بی‌ربط دو تکه می‌شد. فنسِ بازِ بسته‌نشده اصلاً مچ نمی‌شود و متنِ ساده می‌ماند.
 */
const FENCE = /(?:^|\n)[ \t]*```[ \t]*([A-Za-z0-9+#._-]*)[ \t]*\r?\n([\s\S]*?)\r?\n?[ \t]*```[ \t]*(?=\n|$)/g;

/**
 * ترتیبِ شاخه‌ها معنا دارد: کدِ درون‌خطی اول می‌آید تا `**x**` داخلِ بک‌تیک
 * بولد نشود، و ** قبل از * می‌آید وگرنه «**متن**» دو تا ایتالیکِ خالی می‌شد.
 */
const INLINE = /(`+)([^`\n]+?)\1|\*\*(?!\s)([\s\S]+?)\*\*|\*(?!\s)([^*\n]+?)\*|#([\p{L}\p{N}_]+)/gu;

/** #C در «C#» هشتگ نیست — هشتگ فقط سرِ خط یا بعد از فاصله معنا دارد */
function isTagBoundary(prev: string | undefined): boolean {
  return prev === undefined || /[\s(\[{،؛,]/.test(prev);
}

function parseInline(text: string): CaptionSpan[] {
  const spans: CaptionSpan[] = [];
  let last = 0;

  INLINE.lastIndex = 0;
  for (let m = INLINE.exec(text); m; m = INLINE.exec(text)) {
    if (m[5] !== undefined && !isTagBoundary(text[m.index - 1])) continue;

    if (m.index > last) spans.push({ type: "text", text: text.slice(last, m.index) });

    if (m[2] !== undefined) spans.push({ type: "code", text: m[2] });
    else if (m[3] !== undefined) spans.push({ type: "bold", text: m[3] });
    else if (m[4] !== undefined) spans.push({ type: "italic", text: m[4] });
    else spans.push({ type: "tag", text: `#${m[5]}` });

    last = m.index + m[0].length;
  }

  if (last < text.length) spans.push({ type: "text", text: text.slice(last) });
  return spans;
}

function pushParagraph(blocks: CaptionBlock[], text: string): void {
  const trimmed = text.replace(/^\n+|\n+$/g, "");
  if (trimmed) blocks.push({ type: "para", spans: parseInline(trimmed) });
}

export function parseCaption(caption: string): CaptionBlock[] {
  const text = (caption || "").replace(/\r\n/g, "\n");
  const blocks: CaptionBlock[] = [];
  let last = 0;

  FENCE.lastIndex = 0;
  for (let m = FENCE.exec(text); m; m = FENCE.exec(text)) {
    // فنس می‌تواند با \n شروع شده باشد؛ آن \n مالِ پاراگرافِ قبلی است
    const start = m.index + (m[0].startsWith("\n") ? 1 : 0);
    pushParagraph(blocks, text.slice(last, start));
    blocks.push({ type: "code", lang: m[1] || "", code: m[2] });
    last = m.index + m[0].length;
  }

  pushParagraph(blocks, text.slice(last));
  return blocks;
}

/**
 * حالت‌های دستیار هوش مصنوعی — کلیدها باید با CAPTION_MODES در
 * chat/routes/userPosts.js یکی بمانند وگرنه سرور ۴۰۰ می‌دهد.
 */
export const CAPTION_ASSIST_MODES = [
  { key: "improve", label: "روان‌تر کن", hint: "بازنویسیِ خواناتر با حفظِ لحن" },
  { key: "seo", label: "بهینه برای گوگل", hint: "جمله‌ی اول کوتاه و کلیدواژه‌دار" },
  { key: "fix", label: "غلط‌گیری", hint: "فقط املا و نگارش" },
  { key: "shorten", label: "کوتاه کن", hint: "همان معنا، کمتر کلمه" },
  { key: "expand", label: "کامل‌تر کن", hint: "کمی توضیحِ بیشتر" },
  { key: "hashtags", label: "هشتگ بساز", hint: "۳ تا ۵ هشتگِ مرتبط در آخر" },
] as const;

export type CaptionAssistMode = (typeof CAPTION_ASSIST_MODES)[number]["key"];

export const CAPTION_MAX = 2200;

/**
 * متنِ ساده — همان چیزی که تایتل، description، اسلاگ و alt باید ببینند.
 * از خودِ پارسر ساخته می‌شود تا با آنچه کاربر می‌بیند یکی بماند.
 */
export function captionPlainText(caption: string): string {
  return parseCaption(caption)
    .map((b) => (b.type === "code" ? b.code : b.spans.map((s) => s.text).join("")))
    .join("\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}
