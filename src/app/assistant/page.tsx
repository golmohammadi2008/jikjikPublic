import type { Metadata } from "next";
import { Card, Col, Row } from "antd";
import {
  CodeOutlined,
  HeartOutlined,
  BulbOutlined,
  SafetyOutlined,
} from "@/components/icons";
import AssistantWidget from "@/components/AssistantWidget";
import { webPageLd, jsonLdProps } from "@/lib/jsonLd";
import { pageMeta } from "@/lib/pageMeta";
import { SITE_NAME } from "@/lib/config";
import { Paragraph, Title } from "@/components/ui";

/**
 * صفحه‌ی مستقلِ دستیار هوشمند.
 *
 * چرا جدا از صفحه‌ی اصلی: ویجت وسطِ صفحه‌ی خانه گم بود — کاربر بین هیرو و
 * فهرستِ پست‌ها از کنارش رد می‌شد. یک صفحه‌ی اختصاصی هم نشانیِ قابل‌اشتراکِ
 * خودش را دارد (`/assistant`)، هم در گوگل روی عبارت‌های «پرسیدن از هوش
 * مصنوعی» دیده می‌شود، هم جایی است که می‌شود در تبلیغات مستقیم به آن لینک داد.
 *
 * قیف: اینجا فقط سوال را می‌نویسد → با همان سوال وارد پنل می‌شود
 * (`/assistant?q=…`) → جوابِ همان را آنجا می‌گیرد، نه صفحه‌ی خالی.
 *
 * اینجا عمداً پاسخی داده نمی‌شود: کسی که جوابش را بدونِ حساب گرفت، می‌رود.
 */
export const metadata: Metadata = pageMeta({
  title: "دستیار هوشمند — پاسخ فوری به سوال‌های حقوقی، پزشکی و روان‌شناسی",
  description:
    `سوالت را از دستیار هوشمند ${SITE_NAME} بپرس و جوابش را همان‌جا بگیر. ` +
    "برای هر حوزه یک مدل تخصصی: حقوقی، پزشکی و سلامت، روان‌شناسی و برنامه‌نویسی.",
  path: "/assistant",
});

export const revalidate = 300;

const DOMAINS = [
  { icon: <SafetyOutlined />, title: "حقوقی", body: "قرارداد، شکایت، مهلت قانونی" },
  { icon: <HeartOutlined />, title: "پزشکی", body: "علائم، آزمایش، کِی جدی است" },
  { icon: <BulbOutlined />, title: "روان‌شناسی", body: "بدون قضاوت، هر ساعت شب" },
  { icon: <CodeOutlined />, title: "برنامه‌نویسی", body: "کد، خطا، معماری" },
];

export default function AssistantPage() {
  const jsonLd = webPageLd({
    path: "/assistant",
    name: "دستیار هوشمند وینو",
    description: "پرسش رایگان از دستیار هوشمند با مدل تخصصی برای هر حوزه.",
    crumbs: [{ name: "دستیار هوشمند" }],
  });

  return (
    <>
      <script {...jsonLdProps(jsonLd)} />

      <section className="hero hero-compact">
        <div className="wrap">
          <Title level={1}>سوالت را بپرس، جوابش را بگیر</Title>
          <Paragraph className="hero-sub">
            برای هر حوزه یک مدل تخصصی. و هر جا لازم شد، متخصص واقعی همین‌جاست.
          </Paragraph>
        </div>
      </section>

      <AssistantWidget />

      <section className="section">
        <div className="wrap">
          <Row gutter={[16, 16]}>
            {DOMAINS.map((d) => (
              <Col key={d.title} xs={12} md={6}>
                <Card className="domain-chip" variant="borderless" size="small">
                  <span className="domain-icon" aria-hidden="true">{d.icon}</span>
                  <b>{d.title}</b>
                  <small>{d.body}</small>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </>
  );
}
