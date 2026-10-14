import Link from "next/link";
import { Breadcrumb } from "antd";
import { SITE_NAME } from "@/lib/config";

/** مسیرِ صفحه — «وینو › …». آخرین آیتم href ندارد و متنِ ساده است. */
export default function PageCrumbs({ trail }: { trail: { title: string; href?: string }[] }) {
  return (
    <Breadcrumb
      className="breadcrumb"
      aria-label="مسیر صفحه"
      items={[
        { title: <Link href="/">{SITE_NAME}</Link> },
        ...trail.map((t) => ({ title: t.href ? <Link href={t.href}>{t.title}</Link> : t.title })),
      ]}
    />
  );
}
