import type { Metadata } from "next";
import { webPageLd, jsonLdProps } from "@/lib/jsonLd";
import { Card, Col, Descriptions, Row } from "antd";
import { SITE_NAME } from "@/lib/config";
import { MailOutlined, PhoneOutlined } from "@/components/icons";
import PageCrumbs from "@/components/PageCrumbs";
import ContactForm from "@/components/ContactForm";
import { pageMeta } from "@/lib/pageMeta";
import { Paragraph, Title, TypoLink } from "@/components/ui";

export const metadata: Metadata = pageMeta({
  title: "ارتباط با ما",
  description: `راه‌های ارتباط با تیم ${SITE_NAME} — پشتیبانی تلفنی و فرم تماس.`,
  path: "/contact",
});

export default function ContactPage() {
  const jsonLd = webPageLd({
    path: "/contact",
    name: "ارتباط با ما",
    description: "راه‌های تماس با پشتیبانی وینو.",
    crumbs: [{ name: "ارتباط با ما" }],
  });

  return (
    <main className="wrap contact-page">
      <script {...jsonLdProps(jsonLd)} />
      <PageCrumbs trail={[{ title: "ارتباط با ما" }]} />

      <Title level={1}>ارتباط با ما</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        سوال، پیشنهاد یا مشکلی دارید؟ از راه‌های زیر با ما در تماس باشید — تیم پشتیبانی در سریع‌ترین زمان پاسخ می‌دهد.
      </Paragraph>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card variant="borderless">
            <Descriptions
              column={1}
              items={[
                { key: "tel", label: <><PhoneOutlined /> پشتیبانی تلفنی</>, children: <TypoLink href="tel:+982191550953" style={{ direction: "ltr" }}>۰۲۱۹۱۵۵۰۹۵۳</TypoLink> },
                { key: "mail", label: <><MailOutlined /> ایمیل</>, children: <TypoLink href="mailto:info@weeno.ir" style={{ direction: "ltr" }}>info@weeno.ir</TypoLink> },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <ContactForm />
        </Col>
      </Row>
    </main>
  );
}
