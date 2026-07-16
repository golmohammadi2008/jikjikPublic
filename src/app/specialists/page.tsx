import type { Metadata } from "next";
import Link from "next/link";
import { getSpecialists } from "@/lib/api";
import { SITE_NAME } from "@/lib/config";
import SpecialistsFilter from "@/components/SpecialistsFilter";

export const metadata: Metadata = {
  title: "متخصص‌ها",
  description: `فهرست متخصص‌های تاییدشده ${SITE_NAME} — پزشکی، حقوقی، ورزشی و بیشتر.`,
  alternates: { canonical: "/specialists" },
};

export default async function SpecialistsPage() {
  const data = await getSpecialists();
  const specialists = data?.specialists ?? [];

  return (
    <main className="wrap">
      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link href="/">{SITE_NAME}</Link> › متخصص‌ها
      </nav>

      <div className="section-head">
        <h2>متخصص‌های تاییدشده</h2>
      </div>

      {specialists.length === 0 ? (
        <p style={{ color: "var(--ink-2)", padding: "20px 0" }}>در حال حاضر متخصصی برای نمایش وجود ندارد.</p>
      ) : (
        <SpecialistsFilter specialists={specialists} />
      )}
    </main>
  );
}
