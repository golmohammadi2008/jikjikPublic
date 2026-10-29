import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, Col, Row } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  RobotOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from "@/components/icons";
import { getHome, getSpecialists } from "@/lib/api";
import { OG_IMAGE, SITE_NAME, SITE_URL, panelAskUrl } from "@/lib/config";
import AppDownload from "@/components/AppDownload";
import { formatCount } from "@/lib/format";
import PostCard from "@/components/PostCard";
import HeroStage from "@/components/three/HeroStage";
import { Paragraph, Title } from "@/components/ui";
import HeroAsk from "@/components/HeroAsk";
import Avatar from "@/components/Avatar";
import Stars from "@/components/Stars";
import VerifiedTick from "@/components/VerifiedTick";
import { buildSlug } from "@/lib/slug";

export const metadata: Metadata = {
  title: `${SITE_NAME} — متخصص‌های تاییدشده، جلسه‌ی آنلاین و فروشگاه امن`,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — متخصص‌های تاییدشده، جلسه‌ی آنلاین و فروشگاه امن`,
    description: "با متخصص‌های تاییدشده گفتگو کن، جلسه و تماس تصویری بگیر، در دوره‌هایشان شرکت کن و محصولاتشان را با پرداخت امانی بخر.",
    url: "/",
    images: [OG_IMAGE],
  },
};

export default async function HomePage() {
  const [data, spec] = await Promise.all([getHome(), getSpecialists()]);
  const specialists = spec?.specialists ?? [];
  const topSpecialists = [...specialists].sort((x, y) => (y.ratingAvg || 0) - (x.ratingAvg || 0)).slice(0, 5);
  const posts = data?.posts ?? [];
  const products = data?.products ?? [];
  const commission = Math.round((data?.shopCommissionRate ?? 0.1) * 100);
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

  const services = [
    { icon: <CalendarOutlined />, title: "جلسه با متخصص", desc: "پیام، تماس تصویری و رزرو", href: "/specialists" },
    { icon: <ShoppingOutlined />, title: "فروشگاه متخصص‌ها", desc: "خرید امن با پرداخت امانی", href: "/shop" },
    { icon: <RobotOutlined />, title: "دستیار هوشمند", desc: "پاسخ اولیه، همان لحظه", href: "/assistant" },
    { icon: <TeamOutlined />, title: "متخصص شو", desc: "جلسه، دوره و محصولت را بفروش", href: "/specialist-signup" },
  ];

  // چرا با خیال راحت: همان سازوکارهایی که واقعاً در سامانه اجرا می‌شوند، نه شعار
  const trust = [
    { title: "متخصص تاییدشده", body: "هویت، مدرک شغلی و ویدیوی احراز هر متخصص پیش از فعال شدن بررسی می‌شود." },
    { title: "پرداخت امانی", body: "پولِ خرید تا تحویل نزد وینو می‌ماند؛ اگر فروشنده نفرستد، خودکار برمی‌گردد." },
    { title: "پول جلسه محفوظ", body: "مبلغ رزرو تا تایید متخصص فقط فریز می‌شود و با لغو او کامل برمی‌گردد." },
    { title: "همه‌چیز داخل وینو", body: "گفتگو، تماس و پرداخت در خود سامانه است؛ برای هر اختلاف پشتیبانی داوری می‌کند." },
  ];

  // یک اپ برای کلِ رابطه با متخصص — از اولین سوال تا خرید و جامعه‌ی دور او
  const features = [
    { title: "پیام پیش از رزرو", body: "قبل از پرداخت با متخصص حرف بزن و مطمئن شو همان کسی است که لازم داری." },
    { title: "تماس تصویری", body: "جلسه را داخل خود اپ برگزار کن؛ برای آشنایی هم سهمیه‌ی روزانه‌ی تماس رایگان هست." },
    { title: "دوره‌ها و کلاس‌ها", body: "دوره‌های چندجلسه‌ای و کلاس‌های گروهیِ آنلاین با یک بار ثبت‌نام." },
    { title: "گروه‌ها و گفتگو", body: "گروه بساز، با لینک دعوت عضو بگیر، پیام سنجاق کن و پست‌ها را با هم به اشتراک بگذارید." },
    { title: "پست، استوری و اکسپلور", body: "محتوای آموزشی متخصص‌ها را دنبال کن و از ویدیوهای کوتاه چیز یاد بگیر." },
    { title: "کیف پول", body: "یک بار شارژ کن و برای جلسه، دوره، خرید و دستیار هوشمند از همان پرداخت کن." },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* هیرو (الهام از دکترتو/پذیرش۲۴): زمینه‌ی آبیِ تمام‌عرض، عنوانِ وسط، یک
          جعبه‌ی جست‌وجوی بزرگ و عددهای واقعی. صحنه‌ی سه‌بعدی فقط پس‌زمینه است. */}
      <section className="hero">
        <HeroStage />
        <div className="wrap hero-inner">
          <h1>متخصصِ درست، جلسه‌ی آنلاین و خرید امن — یک‌جا</h1>
          <p>با متخصص‌های تاییدشده پیام بده و تماس تصویری بگیر، جلسه رزرو کن، در دوره‌هایشان شرکت کن و محصولاتشان را با پرداخت امانی بخر. برای پاسخ فوری هم دستیار هوشمند همیشه در دسترس است.</p>
          <HeroAsk categories={categories.map((c) => ({ key: c.key, label: c.label }))} />
          <div className="hero-stats">
            <div><b>{formatCount(specialists.length)}+</b><span>متخصص تاییدشده</span></div>
            <div><b>{formatCount(categories.length)}</b><span>حوزه‌ی تخصصی</span></div>
            <div><b>۲۴/۷</b><span>پاسخ هوش مصنوعی</span></div>
          </div>
        </div>
      </section>

      {/* کارت‌های سرویس روی لبه‌ی هیرو می‌نشینند */}
      <div className="wrap services">
        <Row gutter={[16, 16]}>
          {services.map((x) => (
            <Col key={x.title} xs={12} md={6}>
              <Link href={x.href}>
                <Card className="service-card" hoverable>
                  <span className="service-icon">{x.icon}</span>
                  <b>{x.title}</b>
                  <small>{x.desc}</small>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <Title level={2}>چرا با خیال راحت؟</Title>
          </div>
          <div className="info-grid">
            {trust.map((t) => (
              <div key={t.title}><b>{t.title}</b>{t.body}</div>
            ))}
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="section" id="categories">
          <div className="wrap">
            <div className="section-head">
              <Title level={2}>پرطرفدارترین حوزه‌ها</Title>
            </div>
            <Row gutter={[12, 12]}>
              {categories.map((c) => (
                <Col key={c.key} xs={12} md={8} lg={4}>
                  <Link href={`/category/${c.key}`}>
                    <Card className="tile" hoverable size="small">
                      <b>{c.label}</b>
                      <small>{formatCount(c.count)} پست</small>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      )}

      {topSpecialists.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <Title level={2}>برترین متخصص‌ها</Title>
              <Link className="more" href="/specialists">مشاهده‌ی همه <ArrowLeftOutlined /></Link>
            </div>
            <Row gutter={[16, 16]}>
              {topSpecialists.map((s) => {
                const href = `/specialists/${buildSlug(s.name, s.id)}`;
                return (
                  <Col key={s.id} xs={12} md={8} lg={{ flex: "20%" }}>
                    <Card className="doctor-card">
                      <Link href={href} className="doctor-main">
                        <Avatar name={s.name} src={s.avatar} size={84} />
                        <b>{s.name}<VerifiedTick /></b>
                        <small>{s.specialty || s.categoryLabel || ""}</small>
                        {s.ratingAvg > 0 ? <Stars value={s.ratingAvg} size={13} /> : <span className="doctor-norate">بدون نظر</span>}
                      </Link>
                      <Button block href={href}>رزرو جلسه</Button>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="section" id="shop">
          <div className="wrap">
            <div className="section-head">
              <Title level={2}>تازه‌های فروشگاه</Title>
              <Link className="more" href="/shop">همه‌ی محصولات <ArrowLeftOutlined /></Link>
            </div>
            <Row gutter={[16, 16]}>
              {products.map((p) => (
                <Col key={p.id} xs={24} sm={12} lg={6}>
                  <PostCard post={p} />
                </Col>
              ))}
            </Row>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <div className="promo">
            <div>
              <Title level={3}>متخصص هستی؟ با وینو درآمد کسب کن</Title>
              <Paragraph>مدارکت را ثبت کن و پس از تایید، جلسه‌ی آنلاین رزرو بگیر، دوره برگزار کن و محصولاتت را بفروش. عضویت رایگان است و برای فروش فقط {formatCount(commission)}٪ کارمزد پرداخت می‌کنی.</Paragraph>
            </div>
            <Button size="large" href="/specialist-signup">شروع ثبت‌نام متخصص</Button>
          </div>
        </div>
      </section>

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

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <Title level={2}>یک اپ، همه‌ی کارهای تو با متخصص‌ها</Title>
            <Link className="more" href="/how-it-works">راهنمای کامل <ArrowLeftOutlined /></Link>
          </div>
          <div className="info-grid">
            {features.map((f) => (
              <div key={f.title}><b>{f.title}</b>{f.body}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <AppDownload />
        </div>
      </section>
    </main>
  );
}
