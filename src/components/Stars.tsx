import { Rate } from "antd";
import { formatRating } from "@/lib/format";

/** ستاره‌های امتیاز — نیم‌ستاره را خودِ Rate درست رندر می‌کند. */
export default function Stars({ value, size = 15 }: { value: number; size?: number }) {
  return (
    <span role="img" aria-label={`${formatRating(value)} از ۵`}>
      <Rate disabled allowHalf value={value} style={{ fontSize: size }} />
    </span>
  );
}
