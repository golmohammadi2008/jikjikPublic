import Link from "next/link";
import { Avatar, Col, Divider, Row } from "antd";
import { PhoneOutlined } from "@/components/icons";
import { SITE_NAME } from "@/lib/config";
import { Paragraph, TypoLink } from "@/components/ui";

export default function Footer() {
  return (
    <>
      <div className="wrap">
        <Row gutter={[32, 28]}>
          <Col xs={24} md={9}>
            <Link className="logo" href="/">
              <Avatar shape="square" className="logo-mark" aria-hidden="true">و</Avatar>
              {SITE_NAME}
            </Link>
            <Paragraph type="secondary" style={{ marginTop: 10, maxWidth: 320 }}>
              متخصص‌های تاییدشده، جلسه‌ی آنلاین، دوره‌ها و فروشگاه امن — یک‌جا.
            </Paragraph>
            <TypoLink href="tel:+982191550953" className="footer-phone">
              <PhoneOutlined /> پشتیبانی: ۰۲۱۹۱۵۵۰۹۵۳
            </TypoLink>
          </Col>
          <Col xs={24} md={11}>
            <nav className="footer-links" aria-label="لینک‌های فوتر">
              <Link href="/how-it-works">چطور کار می‌کند</Link>
              <Link href="/specialists">متخصص‌ها</Link>
              <Link href="/shop">فروشگاه</Link>
              <Link href="/faq">سوالات متداول</Link>
              <Link href="/contact">ارتباط با ما</Link>
              <Link href="/terms">شرایط و قوانین</Link>
              <Link href="/privacy">حریم خصوصی</Link>
              <Link href="/specialist-guide">آیین‌نامه متخصص</Link>
              <Link href="/specialist-signup">متخصص شو</Link>
            </nav>
          </Col>
          <Col xs={24} md={4}>
          {/* نماد اعتماد الکترونیکی — کد و referrerPolicy برای اعتبارسنجی
              اینماد لازم‌اند و نباید حذف شوند. next/image استفاده نمی‌کنیم
              چون تصویر باید مستقیم از دامنه‌ی خود اینماد سرو شود. */}
          <div className="footer-badges">
            <a
              referrerPolicy="origin"
              target="_blank"
              href="https://trustseal.enamad.ir/?id=6938582&Code=zeQF7WdEpF02ru2Y69qECAX925MxJb6l"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                referrerPolicy="origin"
                src="https://trustseal.enamad.ir/logo.aspx?id=6938582&Code=zeQF7WdEpF02ru2Y69qECAX925MxJb6l"
                alt="نماد اعتماد الکترونیکی"
                {...{ code: "zeQF7WdEpF02ru2Y69qECAX925MxJb6l" }}
              />
            </a>
          </div>
          </Col>
        </Row>
        <Divider />
        <p className="legal-note">
          پاسخ‌های هوش مصنوعی صرفاً جنبه اطلاع‌رسانی اولیه دارند و جایگزین تشخیص و نظر متخصص نیستند. در شرایط
          اضطراری با اورژانس (۱۱۵) یا اورژانس اجتماعی (۱۲۳) تماس بگیرید.
        </p>
      </div>
    </>
  );
}
