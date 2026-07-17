"use client";

/* پرنده‌ی وینو پاش رفته روی سیم و برق قطع شده — صحنه‌ی خطای سرور */
function ErrorArt() {
  return (
    <svg className="err-art" viewBox="0 0 360 240" fill="none" aria-hidden="true">
      {/* زمین */}
      <ellipse cx="180" cy="212" rx="130" ry="12" fill="#E8EFFE" />

      {/* پریز دیواری سمت راست */}
      <rect x="296" y="128" width="34" height="44" rx="8" fill="#DBE7FD" />
      <rect x="304" y="140" width="5" height="12" rx="2.5" fill="#5A6B7A" />
      <rect x="317" y="140" width="5" height="12" rx="2.5" fill="#5A6B7A" />

      {/* سیم از پریز تا وسط صحنه — قطع‌شده */}
      <path d="M296 166 C 260 186, 238 196, 214 196" stroke="#17212B" strokeWidth="5" strokeLinecap="round" />
      {/* دوشاخه‌ی جدا افتاده */}
      <g transform="rotate(-18 150 196)">
        <rect x="138" y="189" width="26" height="14" rx="6" fill="#17212B" />
        <rect x="164" y="191.5" width="8" height="3.5" rx="1.75" fill="#5A6B7A" />
        <rect x="164" y="197" width="8" height="3.5" rx="1.75" fill="#5A6B7A" />
      </g>
      <path d="M60 206 C 92 206, 112 202, 136 198" stroke="#17212B" strokeWidth="5" strokeLinecap="round" />

      {/* جرقه‌ها بین دو سر سیم */}
      <g className="spark">
        <path d="M186 176 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z" fill="#F59E0B" />
      </g>
      <path className="spark" d="M204 164 l2 4.6 4.6 2 -4.6 2 -2 4.6 -2 -4.6 -4.6 -2 4.6 -2 Z" fill="#7C5CFF" opacity=".8" />

      {/* پرنده‌ی وینو — خجالت‌زده، پاش روی سیم */}
      <g className="float">
        <circle cx="120" cy="142" r="36" fill="#2563EB" />
        <circle cx="120" cy="142" r="36" fill="url(#errShine)" />
        <ellipse cx="126" cy="154" rx="18" ry="14" fill="#DBE7FD" />
        {/* چشم‌ها — «اوه‌اوه» */}
        <circle cx="112" cy="132" r="7" fill="#fff" />
        <circle cx="114" cy="134" r="3.2" fill="#17212B" />
        <circle cx="134" cy="132" r="7" fill="#fff" />
        <circle cx="136" cy="134" r="3.2" fill="#17212B" />
        {/* ابروهای نگران */}
        <path d="M105 122 q6 -5 13 -2" stroke="#17212B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M128 120 q7 -3 13 2" stroke="#17212B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* منقار باز از تعجب */}
        <path d="M148 143 L158 147 L148 152 Z" fill="#F59E0B" />
        {/* گونه‌ی خجالت */}
        <circle cx="103" cy="146" r="5" fill="#FCA5A5" opacity=".7" />
        {/* پاها — یکی روی سیم! */}
        <path d="M110 176 L108 196" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        <path d="M132 176 L138 193" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        <path d="M104 197 L114 197" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        <path d="M134 194 L144 194" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* قطره‌ی عرق شرمندگی */}
      <path className="float-late" d="M158 116 q4 6 0 10 q-4 -4 0 -10 Z" fill="#60A5FA" />

      <defs>
        <radialGradient id="errShine" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#fff" stopOpacity=".28" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="wrap err-page">
      <ErrorArt />
      <span className="err-code">خطای سرور</span>
      <h1>اوه اوه… یکی پاش رفت رو سیم!</h1>
      <p>
        یه اتصالی کوچیک پیش اومده و تیم فنی همین الان داره دوشاخه رو می‌زنه سر جاش.
        چند لحظه دیگه دوباره امتحان کن.
      </p>
      <div className="err-actions">
        <button onClick={reset} className="btn btn-saffron">دوباره امتحان کن</button>
        <a href="/" className="btn btn-ghost">صفحه‌ی اصلی</a>
      </div>
    </main>
  );
}
