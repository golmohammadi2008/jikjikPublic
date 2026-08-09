import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPost } from "@/lib/api";
import { extractObjectId } from "@/lib/slug";
import { excerpt } from "@/lib/format";
import { SITE_NAME } from "@/lib/config";

/**
 * کارتِ اشتراک‌گذاریِ برنددار برای هر پست.
 *
 * چرا لازم شد: تا حالا `og:image` خودِ عکسِ خامِ پست بود. هر بار که کسی پست
 * متخصص را در تلگرام/واتس‌اپ/اینستاگرام می‌فرستاد، هیچ نشانی از وینو رویش
 * نبود — نه لوگو، نه نام متخصص، نه آدرس سایت. یعنی محتوای ما جای دیگری
 * پخش می‌شد بدون اینکه برند را با خودش ببرد.
 *
 * این تصویر سمت سرور ساخته و کش می‌شود، پس همه‌ی مسیرهای اشتراک‌گذاری —
 * لینکِ ساده در هر شبکه‌ای — خودبه‌خود نسخه‌ی برنددار را نشان می‌دهند و
 * لازم نیست هر کلاینت جداگانه کاری بکند.
 */
export const alt = "پست متخصص در وینو";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#2563EB";

/**
 * چیدنِ دستیِ کلماتِ فارسی برای satori.
 *
 * satori الگوریتم دوطرفه‌ی یونیکد (bidi) را پیاده نکرده: حروفِ داخل هر کلمه
 * درست به هم می‌چسبند ولی ترتیبِ خودِ کلمات چپ‌به‌راست می‌ماند، یعنی
 * «با وینو به درامد برس» وارونه رندر می‌شد. `direction: rtl` هم کمکی نمی‌کند
 * چون در مرحله‌ی چیدمان اعمال می‌شود نه شکل‌دهیِ متن. تنها راهِ قابل‌اتکا،
 * وارونه‌کردنِ ترتیبِ کلمات پیش از دادنِ متن به satori است.
 */
function rtlWords(text: string): string {
  return text.trim().split(/\s+/).reverse().join(" ");
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = extractObjectId(slug);
  const data = id ? await getPost(id).catch(() => null) : null;
  const post = data?.post;

  // فونت فارسی باید به‌صورت بافر داده شود؛ satori از woff2 پشتیبانی نمی‌کند،
  // برای همین نسخه‌ی ttf کنار بقیه‌ی فونت‌ها نگه داشته شده است
  const font = await readFile(path.join(process.cwd(), "public/fonts/Estedad-Bold.ttf"));

  const caption = excerpt(post?.caption || "", 90);
  const author = post?.author?.name || SITE_NAME;
  const role = post?.author?.specialty || post?.author?.categoryLabel || "متخصص";
  /**
   * کاور باید به PNG تبدیل شود.
   *
   * خروجیِ آپلودِ ما webp است و satori فقط PNG/JPEG را رمزگشایی می‌کند؛ با
   * webp تصویر بی‌صدا حذف می‌شد و کارت فقط پس‌زمینه‌ی تیره داشت. تبدیل با
   * sharp انجام و به‌صورت data URI تزریق می‌شود. اگر دانلود یا تبدیل شکست
   * بخورد، کارت بدون عکس ساخته می‌شود نه اینکه کل تصویر خطا بدهد.
   */
  let cover: string | null = null;
  if (post?.imageUrl) {
    try {
      const res = await fetch(post.imageUrl);
      if (res.ok) {
        const sharp = (await import('sharp')).default;
        const png = await sharp(Buffer.from(await res.arrayBuffer()))
          .resize(1200, 630, { fit: 'cover' })
          .png()
          .toBuffer();
        cover = `data:image/png;base64,${png.toString('base64')}`;
      }
    } catch {
      // بدون کاور ادامه بده
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          background: "#0F172A",
          fontFamily: "Estedad",
          direction: "rtl",
        }}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            width={1200}
            height={630}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}

        {/* پرده‌ی تیره تا متن روی هر عکسی خوانا بماند */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "linear-gradient(180deg, rgba(15,23,42,0.10) 25%, rgba(15,23,42,0.94) 100%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: 56, position: "relative" }}>
          {caption ? (
            <div style={{ color: "#fff", fontSize: 46, lineHeight: 1.45, display: "flex", direction: "rtl" }}>{rtlWords(caption)}</div>
          ) : null}

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ color: "#fff", fontSize: 30, direction: "rtl" }}>{rtlWords(author)}</div>
              <div style={{ color: "#CBD5E1", fontSize: 22, marginTop: 4, direction: "rtl" }}>{rtlWords(role)}</div>
            </div>

            <div style={{ flex: 1 }} />

            {/* امضای برند — همان چیزی که در هر بازنشری همراه محتوا می‌رود */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ color: "#fff", fontSize: 30 }}>{SITE_NAME}</div>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 18,
                  background: BRAND,
                  color: "#fff",
                  fontSize: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                و
              </div>
            </div>
          </div>

          <div style={{ display: "flex", color: "#94A3B8", fontSize: 20 }}>weeno.ir</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Estedad", data: font, style: "normal", weight: 700 }],
    },
  );
}
