import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * ابطالِ درخواستیِ کش — بک‌اند وقتی چیزی عوض می‌شود این را صدا می‌زند.
 *
 * چرا لازم شد: صفحه‌ها با TTL تازه می‌شدند و این همیشه یک انتخابِ بد بود.
 * `/specialists` شصت ثانیه کش می‌شد، یعنی متخصصِ تازه تا یک چرخه دیده
 * نمی‌شد و اولین بازدیدکننده‌ی بعد از انقضا هم نسخه‌ی کهنه می‌گرفت (رفتارِ
 * stale-while-revalidate). کوتاه‌ترکردنِ TTL هم فقط بار را روی بک‌اند
 * می‌برد بی‌آنکه مسئله را حل کند.
 *
 * حالا کش می‌تواند بلند بماند و در لحظه‌ی تغییر باطل شود.
 *
 * امنیت: بدونِ راز، هر کسی می‌توانست با صدازدنِ مکررِ این مسیر کشِ کلِ سایت
 * را بی‌اثر کند و هر درخواست را به بک‌اند بفرستد — یک DoS ارزان. راز از
 * env می‌آید و اگر تنظیم نشده باشد مسیر کاملاً بسته است، نه باز.
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "revalidation disabled" }, { status: 503 });
  }

  const given = req.headers.get("x-revalidate-secret");
  // مقایسه‌ی ساده کافی است: راز از سمتِ ما تولید می‌شود و طولِ ثابت دارد،
  // ولی برابریِ زودهنگام هم چیزی لو نمی‌دهد چون تلاش‌ها rate-limit دارند
  if (given !== secret) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let tags: string[] = [];
  try {
    const body = await req.json();
    tags = Array.isArray(body?.tags) ? body.tags.filter((t: unknown) => typeof t === "string") : [];
  } catch {
    /* بدنه‌ی خراب = هیچ برچسبی */
  }

  if (!tags.length) {
    return NextResponse.json({ error: "no tags" }, { status: 400 });
  }

  // سقف تا یک درخواست نتواند کلِ کش را پاک کند.
  // آرگومان دوم از Next 16 اجباری است و عمرِ تازه‌ی برچسب را می‌گوید؛
  // `expire: 0` یعنی «همین حالا منقضی»، که دقیقاً معنیِ ابطالِ درخواستی است.
  for (const tag of tags.slice(0, 20)) revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ revalidated: tags.slice(0, 20), at: Date.now() });
}
