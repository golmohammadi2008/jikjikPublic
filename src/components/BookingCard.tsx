import { Button, Card, Descriptions } from "antd";
import { CalendarOutlined, MessageOutlined, SafetyOutlined } from "@/components/icons";
import { panelUserUrl } from "@/lib/config";
import { formatDuration, formatToman, formatWhenFuture } from "@/lib/format";
import type { SpecialistProfile } from "@/lib/types";
import { Paragraph, Title } from "@/components/ui";

/**
 * کارتِ رزرو — مهم‌ترین چیز روی صفحه‌ی متخصص.
 *
 * قبلاً رزرو یک دکمه‌ی کوچک داخلِ نواری کم‌کنتراست وسطِ صفحه بود و قیمت
 * اصلاً نوشته نمی‌شد؛ بازدیدکننده باید کلیک می‌کرد تا بفهمد جلسه چقدر خرج
 * دارد. حالا قیمت، مدت و نزدیک‌ترین وقتِ خالی پیش از هر کلیکی دیده می‌شوند.
 *
 * دو ظاهر از یک کامپوننت: ستونِ چسبان در دسکتاپ و نوارِ چسبانِ پایین در
 * موبایل. جدا نوشتنشان یعنی دو نسخه که دیر یا زود از هم دور می‌افتند.
 */
export default function BookingCard({
  specialist,
  variant,
}: {
  specialist: SpecialistProfile;
  variant: "column" | "bar";
}) {
  const price = formatToman(specialist.hourlyRate);
  const nextFree = specialist.nextSlotAt ? formatWhenFuture(specialist.nextSlotAt) : null;
  const bookUrl = panelUserUrl(specialist.username);

  // بک‌اندِ قدیمی‌تر این فیلد را نمی‌فرستد و صفحه «۰ دقیقه» نشان می‌داد —
  // بدتر از نگفتن. صفر/نبودن یعنی نمی‌دانیم، نه اینکه جلسه صفر دقیقه است.
  const duration = specialist.sessionDurationMinutes > 0
    ? formatDuration(specialist.sessionDurationMinutes)
    : null;

  if (variant === "bar") {
    return (
      <div className="sp-book sp-book--bar">
        <div style={{ minWidth: 0 }}>
          <b className="sp-book__bar-price">{price ?? "رزرو جلسه"}</b>
          <div className="sp-book__meta">
            {nextFree ? `نزدیک‌ترین وقت: ${nextFree}` : (duration ?? "جلسه‌ی آنلاین")}
          </div>
        </div>
        <Button type="primary" size="large" icon={<CalendarOutlined />} href={bookUrl}>
          رزرو جلسه
        </Button>
      </div>
    );
  }

  return (
    <Card className="sp-book sp-book--col" aria-label="رزرو جلسه" variant="borderless">
      <Title level={3} className="sp-book__price">
        {price ?? "رزرو جلسه"}
        {price && <small> / جلسه</small>}
      </Title>
      <Paragraph type="secondary">
        {duration ? `جلسه‌ی آنلاین ${duration}` : "جلسه‌ی آنلاین و خصوصی"}
      </Paragraph>

      <Descriptions
        size="small"
        column={1}
        items={[
          { key: "next", label: "نزدیک‌ترین وقت", children: <b>{nextFree ?? "با هماهنگی"}</b> },
          ...(duration ? [{ key: "dur", label: "مدت جلسه", children: <b>{duration}</b> }] : []),
        ]}
      />

      <Button type="primary" size="large" block icon={<CalendarOutlined />} href={bookUrl}>
        رزرو جلسه
      </Button>
      {/* پیام پیش از رزرو به خودِ متخصص — قبلاً به دستیارِ هوش مصنوعی می‌رفت */}
      <Button size="large" block icon={<MessageOutlined />} href={bookUrl} style={{ marginTop: 8 }}>
        اول پیام بده
      </Button>

      <Paragraph type="secondary" className="sp-book__note">
        <SafetyOutlined /> پرداخت داخل وینو انجام می‌شود و تا پایان جلسه نزد ما می‌ماند.
      </Paragraph>
    </Card>
  );
}
