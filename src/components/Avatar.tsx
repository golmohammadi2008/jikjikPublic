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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" />
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
