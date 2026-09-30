import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

// آدرس واقعی بک‌اند Express — همیشه سمت سرور Next.js صدا زده می‌شود (نه مرورگر)،
// پس نیازی به CORS نیست. برای پروداکشن روی همون سرور، ۱۲۷.۰.۰.۱ سریع‌تر از دامنه‌ی عمومی است.
const BACKEND_URL = process.env.BACKEND_URL || "https://jikjik.minicook.ir";

/**
 * نگهبانِ بیلد — جلوی دیپلویِ یک سایتِ خاموش را می‌گیرد.
 *
 * دو متغیر این‌جا در **زمان بیلد** پخته می‌شوند و اگر نباشند هیچ خطایی
 * نمی‌دهند، فقط سایت را بی‌صدا خراب می‌کنند:
 *
 * - `NEXT_PUBLIC_INDEXING`: بدونش `robots.txt` می‌شود `Disallow: /` و همه‌ی
 *   صفحه‌ها `noindex` می‌گیرند. بیلدی که با این متغیر ساخته نشده باشد،
 *   بعد از دیپلوی به‌مرور کلِ سایت را از گوگل بیرون می‌کشد — و چون خروجی
 *   بیلد هیچ نشانه‌ای ندارد، تنها جایی که معلوم می‌شود Search Console است،
 *   هفته‌ها بعد.
 * - `BACKEND_URL`: بدونش fallbackِ بالا (دامنه‌ی قدیمی) استفاده می‌شود و
 *   صفحه‌های از پیش رندرشده خالی بیلد و دیپلوی می‌شوند.
 *
 * فقط در بیلدِ پروداکشن سخت‌گیری می‌کنیم: در `next dev` و `next start`
 * جلوی کار را نمی‌گیرد. `NEXT_PHASE` این‌جا هنوز ست نشده (Next بعد از
 * خواندنِ همین فایل ستش می‌کند)، پس فاز را از آرگومانِ خودِ Next می‌گیریم.
 */
function assertBuildEnv(phase: string) {
  if (phase !== PHASE_PRODUCTION_BUILD) return;
  const missing = [
    !process.env.BACKEND_URL && "BACKEND_URL",
    // «false» ِ صریح یعنی عمداً بیلدِ noindex می‌خواهیم؛ فقط نبودنِ متغیر خطاست
    !process.env.NEXT_PUBLIC_INDEXING && "NEXT_PUBLIC_INDEXING",
  ].filter(Boolean);
  if (missing.length) {
    throw new Error(
      `بیلد متوقف شد — این متغیرها تنظیم نشده‌اند: ${missing.join(", ")}\n` +
        "بدون آن‌ها سایت یا خالی دیپلوی می‌شود یا با robots بسته (noindex).\n" +
        "بیلدِ درستِ پروداکشن: BACKEND_URL=http://127.0.0.1:3000 NEXT_PUBLIC_INDEXING=true npm run build",
    );
  }
}

const nextConfig: NextConfig = {
  // فشرده‌سازی پاسخ‌ها (gzip) — کاهش حجم HTML/JS برای سرعت و سئو
  compress: true,
  // هدر افشاگر نسخه‌ی Next حذف شود
  poweredByHeader: false,
  // مینی‌فای JS/CSS در build پروداکشن به‌صورت پیش‌فرض توسط SWC انجام می‌شود؛
  // این‌جا اضافه‌تر console.*ها را از باندل پروداکشن حذف می‌کنیم تا حجم کمتر شود
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  experimental: {
    /**
     * کشِ سمت کلاینتِ روترِ Next (Client Router Cache).
     *
     * لایه‌ی دومِ همان مشکل و مستقل از HTTP: پیش‌فرضِ `static` پنج دقیقه است
     * (`x-nextjs-stale-time: 300` در پاسخ دیده می‌شد). یعنی وقتی کاربر داخلِ
     * سایت با <Link> جابه‌جا می‌شد، Next اصلاً از سرور نمی‌پرسید و همان
     * payloadِ پنج‌دقیقه‌ایِ داخلِ حافظه را دوباره رندر می‌کرد.
     *
     * این سایت محتوامحور است و صفحه‌هایش سبک‌اند؛ تازگی از صرفه‌جوییِ یک
     * درخواست مهم‌تر است. سی ثانیه کمینه‌ی مجازِ Next برای `static` است
     * (کمتر از آن config رد می‌شود) و `dynamic` صفر می‌ماند. سرور خودش از
     * کشِ ISR جواب می‌دهد، پس این تازگی بارِ بک‌اند را زیاد نمی‌کند.
     */
    staleTimes: { static: 30, dynamic: 0 },
  },

  /**
   * هدرِ کشِ صفحه‌های HTML.
   *
   * `max-age=0, must-revalidate` یعنی مرورگر اجازه ندارد نسخه‌ی کهنه را
   * نشان بدهد و باید هر بار با ETag اعتبارسنجی کند — که در حالتِ عادی یک
   * پاسخِ ۳۰۴ِ چندبایتی است، نه رندرِ دوباره.
   *
   * عمداً `s-maxage` نمی‌گذاریم: ابطالِ درخواستی (`/api/revalidate`) فقط کشِ
   * خودِ Next را پاک می‌کند و هیچ راهی برای purge کردنِ CDN نداریم؛ پس اگر
   * آروان HTML را کش کند، همان مشکل یک لایه بالاتر تکرار می‌شود. خودِ Next
   * صفحه‌ی از پیش رندرشده را از کشِ داخلی‌اش می‌دهد، پس این نه بک‌اند را
   * درگیر می‌کند نه سرعت را کم.
   *
   * الگو عمداً چند چیز را کنار می‌گذارد: `_next/static` و `_next/image` و
   * `assets/` که هش/نسخه دارند و باید یک سال کش شوند، و تصویرهای
   * `opengraph-image` و `icon.png` که خودشان هدرِ کشِ بلندِ عمدی دارند
   * (رندرشان با satori گران است و محتوایشان با هر دیپلوی عوض نمی‌شود).
   */
  /**
   * پرسش‌وپاسخ از محصول حذف شد، ولی نشانی‌هایش در گوگل ایندکس شده‌اند.
   *
   * ۳۰۱ می‌دهیم نه ۴۰۴: صفحه‌ی حذف‌شده‌ای که ۴۰۴ می‌دهد اعتبارِ لینکش را دور
   * می‌ریزد و کاربری که از نتایج جستجو می‌آید به بن‌بست می‌خورد.
   *
   * مقصد `/specialists` است، نه صفحه‌ی اصلی: کسی که با یک سوالِ تخصصی از
   * گوگل می‌آمد، نزدیک‌ترین چیزی که هنوز به دردش می‌خورد فهرستِ متخصص‌هاست.
   * (`/post` ایندکسِ آرشیو ندارد و فقط `/post/[slug]` است، پس مقصدِ ۴۰۴ می‌شد.)
   *
   * دائمی است چون این صفحه‌ها برنمی‌گردند.
   */
  async redirects() {
    return [
      { source: "/questions", destination: "/specialists", permanent: true },
      { source: "/questions/:slug", destination: "/specialists", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path((?!_next/static|_next/image|assets/)(?!.*(?:opengraph-image|icon\\.png)).*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },

  async rewrites() {
    return [{ source: "/api/public/:path*", destination: `${BACKEND_URL}/api/public/:path*` }];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default (phase: string) => {
  assertBuildEnv(phase);
  return nextConfig;
};
