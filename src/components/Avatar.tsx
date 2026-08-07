import { avatarColor, initials } from "@/lib/format";

export default function Avatar({
  name,
  src,
  size = 42,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  if (src) {
    return (
      <span className="p-avatar" style={{ width: size, height: size }}>
        {/* alt خالی نبود که تزئینی باشد — این عکسِ خودِ شخص است و نامش تنها
            چیزی است که خواننده‌ی صفحه یا گوگل از آن برداشت می‌کند.
            width/height صریح جلوی جابه‌جاییِ چیدمان (CLS) را می‌گیرد. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} width={size} height={size} loading="lazy" decoding="async" />
      </span>
    );
  }
  return (
    <span
      className="p-avatar"
      style={{ width: size, height: size, background: avatarColor(name) }}
    >
      {initials(name)}
    </span>
  );
}
