"use client";

import dynamic from "next/dynamic";

/**
 * بارگیریِ تنبلِ صحنه‌ی سه‌بعدی.
 *
 * three.js حدود ۱۵۰ کیلوبایت gzip است و فقط تزئین است؛ نباید جلوی رندرِ
 * متنِ هیرو (LCP) را بگیرد. `ssr: false` فقط در Client Component مجاز است،
 * برای همین این پوشش جداست. تا لود شدنش پس‌زمینه‌ی آبیِ هیرو (CSS) دیده می‌شود.
 */
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function HeroStage() {
  return <HeroScene />;
}
