"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "antd";

/**
 * بارگیریِ تنبلِ صحنه‌ی سه‌بعدی.
 *
 * three.js حدود ۱۵۰ کیلوبایت gzip است و فقط تزئین است؛ نباید جلوی رندرِ
 * متنِ هیرو (LCP) را بگیرد. `ssr: false` فقط در Client Component مجاز است،
 * برای همین این پوشش جداست. تا لود شدنش یک اسکلت همان قاب را پر می‌کند.
 */
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <Skeleton.Node active className="hero-canvas-skeleton" style={{ width: "100%", height: "100%", borderRadius: 28 }}>{null}</Skeleton.Node>,
});

export default function HeroStage() {
  return <HeroScene />;
}
