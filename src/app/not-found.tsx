import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "صفحه پیدا نشد",
  robots: { index: false, follow: false },
};

/* پرنده‌ی کنجکاو وینو با چراغ‌قوه، توی جعبه‌ی خالی دنبال صفحه می‌گردد */
function NotFoundArt() {
  return (
    <svg className="err-art" viewBox="0 0 360 240" fill="none" aria-hidden="true">
      {/* زمین */}
      <ellipse cx="180" cy="212" rx="128" ry="12" fill="#E8EFFE" />

      {/* جعبه‌ی خالی */}
      <g>
        <path d="M96 148 L164 132 L232 148 L164 166 Z" fill="#DBE7FD" />
        <path d="M96 148 L96 190 L164 208 L164 166 Z" fill="#C3D6FB" />
        <path d="M232 148 L232 190 L164 208 L164 166 Z" fill="#AFC9F9" />
        {/* درِ باز جعبه */}
        <path d="M96 148 L64 136 L130 121 L164 132 Z" fill="#E8EFFE" />
        <path d="M232 148 L266 137 L200 122 L164 132 Z" fill="#DBE7FD" />
      </g>

      {/* علامت سوال شناور از داخل جعبه */}
      <g className="float-late">
        <text x="164" y="128" textAnchor="middle" fontFamily="Shabnam, sans-serif" fontWeight="800" fontSize="34" fill="#7C5CFF">؟</text>
      </g>

      {/* پرنده‌ی وینو با چراغ‌قوه */}
      <g className="float">
        {/* بدن */}
        <circle cx="272" cy="130" r="34" fill="#2563EB" />
        <circle cx="272" cy="130" r="34" fill="url(#birdShine)" />
        {/* شکم */}
        <ellipse cx="266" cy="141" rx="17" ry="14" fill="#DBE7FD" />
        {/* چشم‌ها — نگاه به سمت جعبه */}
        <circle cx="256" cy="122" r="6.5" fill="#fff" />
        <circle cx="253.5" cy="123" r="3" fill="#17212B" />
        <circle cx="276" cy="122" r="6.5" fill="#fff" />
        <circle cx="273.5" cy="123" r="3" fill="#17212B" />
        {/* منقار */}
        <path d="M242 131 L232 135 L242 139 Z" fill="#F59E0B" />
        {/* بال — چراغ‌قوه به دست */}
        <ellipse cx="296" cy="142" rx="10" ry="7" fill="#1D4ED8" transform="rotate(24 296 142)" />
        {/* چراغ‌قوه */}
        <g transform="rotate(38 244 160)">
          <rect x="238" y="156" width="20" height="9" rx="3.5" fill="#17212B" />
          <rect x="233" y="154.5" width="6" height="12" rx="2" fill="#5A6B7A" />
          {/* نور مخروطی به سمت جعبه */}
          <path d="M233 154 L176 128 L176 186 L233 167 Z" fill="#FDE68A" opacity=".45" />
        </g>
      </g>

      {/* ستاره‌های تعجب دور جعبه */}
      <g className="spark">
        <path d="M112 108 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 Z" fill="#7C5CFF" />
      </g>
      <path className="spark" d="M236 96 l2 4.6 4.6 2 -4.6 2 -2 4.6 -2 -4.6 -4.6 -2 4.6 -2 Z" fill="#2563EB" opacity=".7" />

      <defs>
        <radialGradient id="birdShine" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#fff" stopOpacity=".28" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function NotFound() {
  return (
    <main className="wrap err-page">
      <NotFoundArt />
      <span className="err-code">۴۰۴</span>
      <h1>این صفحه رو همه‌جا گشتیم، نبود!</h1>
      <p>
        یا آدرس اشتباه تایپ شده، یا این صفحه جمع کرده رفته یه جای بهتر.
        نگران نباش — جواب سوالت هنوز همین‌جاست.
      </p>
      <div className="err-actions">
        <Link href="/" className="btn btn-saffron">بریم صفحه‌ی اصلی</Link>
        <Link href="/specialists" className="btn btn-ghost">مرور متخصص‌ها</Link>
      </div>
    </main>
  );
}
