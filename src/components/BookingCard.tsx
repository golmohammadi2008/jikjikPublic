import { panelAskUrl, panelUserUrl } from "@/lib/config";
import { formatDuration, formatToman, formatWhenFuture } from "@/lib/format";
import type { SpecialistProfile } from "@/lib/types";

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
          {price ? (
            <div className="sp-book__price">
              <b>{price}</b>
            </div>
          ) : (
            <b style={{ fontSize: 15 }}>رزرو جلسه</b>
          )}
          <div className="sp-book__meta">
            {nextFree ? `نزدیک‌ترین وقت: ${nextFree}` : (duration ?? "جلسه‌ی آنلاین")}
          </div>
        </div>
        <a className="btn btn-saffron" href={bookUrl}>
          رزرو جلسه
        </a>
      </div>
    );
  }

  return (
    <aside className="sp-book sp-book--col" aria-label="رزرو جلسه">
      {price ? (
        <div className="sp-book__price">
          <b>{price}</b>
          <span>/ جلسه</span>
        </div>
      ) : (
        <div className="sp-book__price">
          <b style={{ fontSize: 20 }}>رزرو جلسه</b>
        </div>
      )}
      <div className="sp-book__meta">
        {duration ? `جلسه‌ی آنلاین ${duration}` : "جلسه‌ی آنلاین و خصوصی"}
      </div>

      <div className="sp-book__rows">
        <div className="sp-book__row">
          <span>نزدیک‌ترین وقت</span>
          <b>{nextFree ?? "با هماهنگی"}</b>
        </div>
        {duration && (
          <div className="sp-book__row">
            <span>مدت جلسه</span>
            <b>{duration}</b>
          </div>
        )}
      </div>

      <a className="btn btn-saffron" href={bookUrl}>
        رزرو جلسه
      </a>
      <a className="btn btn-ghost" href={panelAskUrl()} style={{ marginTop: 8 }}>
        اول یک سوال بپرس
      </a>

      <p className="sp-book__note">
        پرداخت داخل وینو انجام می‌شود و تا پایان جلسه نزد ما می‌ماند.
      </p>
    </aside>
  );
}
