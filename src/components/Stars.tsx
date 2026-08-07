import { formatRating } from "@/lib/format";

/**
 * ستاره‌های امتیاز.
 *
 * با SVG و نه با «★»: گلیفِ ستاره در فونت‌های مختلف اندازه و وزنِ متفاوت دارد و
 * روی اندروید اغلب به‌صورت ایموجیِ رنگی رندر می‌شد. نیم‌ستاره هم با گلیف
 * ممکن نبود، پس ۴٫۵ باید گرد می‌شد و تصویر نادرست می‌داد.
 */
export default function Stars({ value, size = 15 }: { value: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const id = `stars-${Math.round(value * 10)}-${size}`;

  return (
    <span className="stars" role="img" aria-label={`${formatRating(value)} از ۵`}>
      <svg width={size * 5 + 8} height={size} viewBox="0 0 88 16" aria-hidden="true" focusable="false">
        <defs>
          {/* userSpaceOnUse لازم است: با حالت پیش‌فرض، گرادیان روی *هر ستاره*
              جدا اعمال می‌شد و ۴٫۵ به‌جای «چهار پر و یک نیمه»، پنج ستاره‌ی
              نیمه‌پر می‌داد. این‌طور برش روی کلِ نوار می‌افتد. */}
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" x2="88" y1="0" y2="0">
            <stop offset={`${pct}%`} stopColor="var(--star, #e8a90a)" />
            <stop offset={`${pct}%`} stopColor="transparent" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            transform={`translate(${i * 18}, 0)`}
            d="M8 1.2l2.06 4.18 4.61.67-3.34 3.25.79 4.59L8 11.72l-4.12 2.17.79-4.59L1.33 6.05l4.61-.67z"
            fill={`url(#${id})`}
            stroke="var(--star, #e8a90a)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </span>
  );
}
