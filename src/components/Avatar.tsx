import { Avatar as AntAvatar } from "antd";
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
  // alt خالی نبود که تزئینی باشد — این عکسِ خودِ شخص است و نامش تنها
  // چیزی است که خواننده‌ی صفحه یا گوگل از آن برداشت می‌کند.
  // size صریح جلوی جابه‌جاییِ چیدمان (CLS) را می‌گیرد.
  if (src) return <AntAvatar src={src} alt={name} size={size} />;
  return (
    <AntAvatar size={size} style={{ background: avatarColor(name), fontWeight: 700 }}>
      {initials(name)}
    </AntAvatar>
  );
}
