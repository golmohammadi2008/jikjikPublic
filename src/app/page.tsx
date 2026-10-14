import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, Col, Row, Tag } from "antd";
import {
  CalendarOutlined,
  LockOutlined,
  MessageOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  ArrowLeftOutlined,
} from "@/components/icons";
import { getHome } from "@/lib/api";
import { OG_IMAGE, SITE_NAME, SITE_URL, panelAskUrl } from "@/lib/config";
import AppDownload from "@/components/AppDownload";
import { formatCount } from "@/lib/format";
import PostCard from "@/components/PostCard";
import HeroStage from "@/components/three/HeroStage";
import { Paragraph, Title } from "@/components/ui";

export const metadata: Metadata = {
  title: `${SITE_NAME} — هر سوال، متخصص خودش را دارد`,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — هر سوال، متخصص خودش را دارد`,
    description: "پاسخ فوری هوش مصنوعی + پاسخ متخصص تاییدشده + رزرو جلسه آنلاین.",
    url: "/",
    images: [OG_IMAGE],
  },
};

export default async function HomePage() {
  const data = await getHome();
  const posts = data?.posts ?? [];
  const categories = data?.categories ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/assets/logo-512.png`,
      },
      {
        "@type": "WebSite",
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#org` },
        // SearchAction عمداً حذف شد: هیچ صفحه‌ی جستجویی با پارامتر `query` نداریم
        // (فقط page/category/sort). گوگل خودِ الگو را به‌عنوان یک نشانی خزید و
        // و آدرسِ ساختگی در سرچ‌کنسول ثبت می‌شد. تا وقتی
        // جست‌وجوی واقعی روی سایت نداریم، اعلامش فقط خطا می‌سازد.
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1>
              هر سوال،
              <br />
              <em>متخصص</em> خودش را دارد
            </h1>
            <p className="lead">
              سوالت رو از متخصص بپرس و در یک جلسه آنلاین، بهترین پاسخ را دریافت کن.
            </p>

            <div className="hero-cta">
              <Button type="primary" size="large" icon={<MessageOutlined />} href={panelAskUrl()}>
                سوال خود را بپرس
              </Button>
              <Button size="large" icon={<CalendarOutlined />} href="/specialists">
                رزرو جلسه آنلاین
              </Button>
            </div>

            <ul className="trust-strip">
              <li><SafetyCertificateOutlined /> متخصص‌های تاییدشده با احراز هویت</li>
              <li><ThunderboltOutlined /> پاسخ هوش مصنوعی، همان لحظه</li>
              <li><LockOutlined /> جلسه آنلاین امن و خصوصی</li>
            </ul>
          </div>

          {/* صحنه‌ی سه‌بعدی: هسته‌ی «سوال» و متخصص‌هایی که دورش می‌چرخند.
              تزئینی است؛ تا لودِ three.js یک اسکلت همین قاب را پر می‌کند. */}
          <div className="hero-art" aria-hidden="true">
            <HeroStage />
            <Card className="ha-float ha-specialist" size="small" variant="borderless">
              <b>دکتر محمدی</b>
              <small>متخصص روانشناسی · ⭐ ۴٫۹</small>
            </Card>
            <Tag className="ha-float ha-ai" color="purple" icon={<RobotOutlined />}>
              پاسخ هوش مصنوعی · همان لحظه
            </Tag>
          </div>
        </div>
      </section>

      {/* دستیار صفحه‌ی خودش را دارد (`/assistant`).
          وسطِ صفحه‌ی خانه گم می‌شد — کاربر بین هیرو و فهرستِ پست‌ها از کنارش
          رد می‌شد — و نشانیِ مستقل هم می‌دهد که بشود مستقیم به آن لینک داد. */}
      <section className="section">
        <div className="wrap">
          <Card className="assistant-teaser" variant="borderless">
            <Title level={2}>سوالی داری؟ همین حالا بپرس</Title>
            <Paragraph>
              برای هر حوزه یک مدل تخصصی — حقوقی، پزشکی، روان‌شناسی و برنامه‌نویسی.
            </Paragraph>
            <Button type="primary" size="large" href="/assistant">
              پرسیدن از دستیار هوشمند
            </Button>
          </Card>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="section" id="posts">
          <div className="wrap">
            <div className="section-head">
              <Title level={2}>از متخصص‌های وینو</Title>
              <Link className="more" href="/specialists">
                همه متخصص‌ها <ArrowLeftOutlined />
              </Link>
            </div>
            <Row gutter={[20, 20]}>
              {posts.map((p) => (
                <Col key={p.id} xs={24} sm={12} lg={8}>
                  <PostCard post={p} />
                </Col>
              ))}
            </Row>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="section" id="categories">
          <div className="wrap">
            <div className="section-head">
              <Title level={2}>حوزه‌ها</Title>
            </div>
            <Row gutter={[14, 14]}>
              {categories.map((c) => (
                <Col key={c.key} xs={12} md={8} lg={6}>
                  <Link href={`/category/${c.key}`}>
                    <Card className="cat" hoverable size="small">
                      <b>{c.label}</b>
                      <small>{formatCount(c.count)} سوال</small>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <AppDownload />
        </div>
      </section>
    </main>
  );
}
