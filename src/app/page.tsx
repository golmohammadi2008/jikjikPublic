import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, Col, Flex, Row, Statistic, Steps } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  RobotOutlined,
  SearchOutlined,
  VideoCameraOutlined,
} from "@/components/icons";
import { getHome, getSpecialists } from "@/lib/api";
import { OG_IMAGE, SITE_NAME, SITE_URL, panelAskUrl } from "@/lib/config";
import AppDownload from "@/components/AppDownload";
import { formatCount } from "@/lib/format";
import PostCard from "@/components/PostCard";
import HeroStage from "@/components/three/HeroStage";
import { Paragraph, Title } from "@/components/ui";
import HeroAsk from "@/components/HeroAsk";
import TopSpecialists from "@/components/TopSpecialists";
import { buildSlug } from "@/lib/slug";

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
  const [data, spec] = await Promise.all([getHome(), getSpecialists()]);
  const specialists = spec?.specialists ?? [];
  const topSpecialists = [...specialists].sort((x, y) => (y.ratingAvg || 0) - (x.ratingAvg || 0)).slice(0, 5);
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

      {/* هیرو: عنوان، جعبه‌ی سوال (کارِ اصلیِ سایت) و عددهای واقعی؛ صحنه‌ی
          سه‌بعدی فقط تزئین است و در کارتی کنارش می‌نشیند. */}
      <section className="hero">
        <div className="wrap">
          <Row gutter={[32, 24]} align="middle">
            <Col xs={24} md={14}>
              <Title level={1} className="hero-title">
                هر سوال، <em>متخصص</em> خودش را دارد
              </Title>
              <Paragraph type="secondary" className="lead">
                سوالت را بپرس، همان لحظه پاسخ اولیه‌ی هوش مصنوعی بگیر و اگر لازم شد، با متخصص تاییدشده جلسه‌ی آنلاین رزرو کن.
              </Paragraph>
              <HeroAsk />
              <Flex gap={8} wrap className="hero-cta">
                <Button icon={<CalendarOutlined />} href="/specialists">رزرو جلسه آنلاین</Button>
                <Button type="link" href={panelAskUrl()}>یا مستقیم وارد پنل شو</Button>
              </Flex>
              <Row gutter={24} className="hero-stats">
                <Col span={8}><Statistic title="متخصص تاییدشده" value={formatCount(specialists.length)} /></Col>
                <Col span={8}><Statistic title="حوزه‌ی تخصصی" value={formatCount(categories.length)} /></Col>
                <Col span={8}><Statistic title="پاسخ هوش مصنوعی" value="فوری" /></Col>
              </Row>
            </Col>
            <Col xs={24} md={10}>
              <Card className="hero-art" aria-hidden="true" styles={{ body: { padding: 0 } }}>
                <HeroStage />
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Title level={2}>چطور کار می‌کند؟</Title>
          <Steps
            className="home-steps"
            current={0}
            items={[
              { title: "سوالت را بپرس", content: "در دسته‌ی مناسب بنویس.", icon: <SearchOutlined /> },
              { title: "پاسخ فوری بگیر", content: "دستیار هوشمند همان لحظه جواب اولیه می‌دهد.", icon: <RobotOutlined /> },
              { title: "با متخصص جلسه بگذار", content: "زمان خالی را انتخاب و پرداخت امن انجام بده.", icon: <VideoCameraOutlined /> },
            ]}
          />
        </div>
      </section>

      {topSpecialists.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <Title level={2}>متخصص‌های برتر</Title>
              <Link className="more" href="/specialists">همه‌ی متخصص‌ها <ArrowLeftOutlined /></Link>
            </div>
            <TopSpecialists
              items={topSpecialists.map((s) => ({
                id: s.id,
                href: `/specialists/${buildSlug(s.name, s.id)}`,
                name: s.name,
                avatar: s.avatar,
                subtitle: s.specialty || s.categoryLabel || "",
                ratingAvg: s.ratingAvg,
                ratingCount: s.ratingCount,
              }))}
            />
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="section" id="posts">
          <div className="wrap">
            <div className="section-head">
              <Title level={2}>تازه‌ترین پست‌ها</Title>
            </div>
            <Row gutter={[16, 16]}>
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
            <Title level={2}>حوزه‌ها</Title>
            <Row gutter={[12, 12]}>
              {categories.map((c) => (
                <Col key={c.key} xs={12} md={8} lg={6}>
                  <Link href={`/category/${c.key}`}>
                    <Card className="cat" hoverable size="small">
                      <Statistic title={c.label} value={formatCount(c.count)} suffix="سوال" />
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
