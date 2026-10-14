import { Typography } from "antd";
import { Alert, Button, Card } from "antd";
import { ArrowLeftOutlined } from "@/components/icons";
import { Paragraph, Title } from "@/components/ui";

/** بدنه‌ی متنیِ صفحه‌های حقوقی/راهنما — Typography خودش تیتر/پاراگراف/فهرست را استایل می‌دهد. */
export function LegalBody({ children }: { children: React.ReactNode }) {
  return <Typography className="legal">{children}</Typography>;
}

/** کادرِ تذکر داخل متن (مثلاً شماره‌های اورژانس). */
export function LegalCallout({ children }: { children: React.ReactNode }) {
  return <Alert className="legal-callout" type="info" showIcon={false} description={children} />;
}

/** بنرِ بالای صفحه: توضیحِ کوتاه + دکمه‌ی رفتن به پنل. */
export function LegalBanner({
  title,
  children,
  href,
  cta,
}: {
  title: string;
  children: React.ReactNode;
  href: string;
  cta: string;
}) {
  return (
    <Alert
      className="legal-banner"
      type="warning"
      showIcon
      title={<b>{title}</b>}
      description={children}
      action={
        <Button type="primary" size="small" href={href}>
          {cta}
        </Button>
      }
    />
  );
}

/** بنرِ دعوت به اقدام در پایان صفحه. */
export function CtaBanner({
  title,
  children,
  href,
  cta,
}: {
  title: string;
  children: React.ReactNode;
  href: string;
  cta: string;
}) {
  return (
    <Card className="cta-banner" variant="borderless">
      <div>
        <Title level={3} style={{ marginTop: 0 }}>{title}</Title>
        <Paragraph style={{ marginBottom: 0 }}>{children}</Paragraph>
      </div>
      <Button type="primary" size="large" href={href} icon={<ArrowLeftOutlined />} iconPlacement="end">
        {cta}
      </Button>
    </Card>
  );
}
