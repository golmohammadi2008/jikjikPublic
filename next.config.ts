import type { NextConfig } from "next";

// آدرس واقعی بک‌اند Express — همیشه سمت سرور Next.js صدا زده می‌شود (نه مرورگر)،
// پس نیازی به CORS نیست. برای پروداکشن روی همون سرور، ۱۲۷.۰.۰.۱ سریع‌تر از دامنه‌ی عمومی است.
const BACKEND_URL = process.env.BACKEND_URL || "https://jikjik.minicook.ir";

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
  async rewrites() {
    return [{ source: "/api/public/:path*", destination: `${BACKEND_URL}/api/public/:path*` }];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
