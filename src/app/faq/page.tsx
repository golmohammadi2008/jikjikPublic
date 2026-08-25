import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/config";
import { pageMeta } from "@/lib/pageMeta";
import { jsonLdProps, webPageLd } from "@/lib/jsonLd";
import FaqBrowser from "@/components/FaqBrowser";
import { FAQS } from "@/lib/faqs";

export const metadata: Metadata = pageMeta({
  title: "سوالات متداول",
  description: `پاسخ سوال‌های پرتکرار درباره‌ی ${SITE_NAME}: پرسیدن سوال، رزرو جلسه، کیف پول، عضویت متخصص و پشتیبانی.`,
  path: "/faq",
});

export default function FaqPage() {
  // FAQPage باید *همه‌ی* پرسش‌ها را داشته باشد، مستقل از اینکه کاربر کدام
  // دسته را فیلتر کرده — فیلتر کارِ مرورگر است و گوگل باید کل مجموعه را ببیند.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const pageLd = webPageLd({
    path: "/faq",
    name: "سوالات متداول",
    description: `پاسخ سوال‌های پرتکرار درباره‌ی ${SITE_NAME}.`,
    crumbs: [{ name: "سوالات متداول" }],
  });

  return (
    <main>
      <script {...jsonLdProps(faqLd)} />
      <script {...jsonLdProps(pageLd)} />
      <FaqBrowser />
    </main>
  );
}
