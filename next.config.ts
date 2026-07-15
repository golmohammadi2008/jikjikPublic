import type { NextConfig } from "next";

// آدرس واقعی بک‌اند Express — همیشه سمت سرور Next.js صدا زده می‌شود (نه مرورگر)،
// پس نیازی به CORS نیست. برای پروداکشن روی همون سرور، ۱۲۷.۰.۰.۱ سریع‌تر از دامنه‌ی عمومی است.
const BACKEND_URL = process.env.BACKEND_URL || "https://jikjik.minicook.ir";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/public/:path*", destination: `${BACKEND_URL}/api/public/:path*` }];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
