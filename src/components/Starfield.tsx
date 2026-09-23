/**
 * میدانِ ستاره‌ی پس‌زمینه.
 *
 * دو لایه، هرکدام یک عنصرِ ۱×۱ که کلِ میدانش در یک box-shadow جا می‌شود —
 * نه تصویری لود می‌شود، نه بومی رسم می‌شود، نه جاوااسکریپتی در مرورگر اجرا
 * می‌شود. صفحه‌های این سایت سرورساید و بیشترشان بدون JS هستند، پس پس‌زمینه
 * هم باید در خودِ HTML بیاید وگرنه اولین فریم بی‌ستاره است.
 *
 * ⚠️ مختصات با یک مولدِ ثابت (نه Math.random) ساخته می‌شوند: خروجیِ سرور و
 * مرورگر باید بایت‌به‌بایت یکی باشد، وگرنه React در hydration اختلاف می‌بیند
 * و کلِ درخت را دوباره می‌سازد.
 */

const LAYERS = [
  { n: 150, blur: 0, lo: 0.05, hi: 0.3, seed: 1 },
  { n: 18, blur: 1.2, lo: 0.35, hi: 0.7, seed: 2 },
];

/** مولدِ شبه‌تصادفیِ قطعی — همان ورودی، همان خروجی، روی هر دو سمت. */
function rand(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function field(n: number, blur: number, lo: number, hi: number, seed: number) {
  const next = rand(seed);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const x = (next() * 100).toFixed(3);
    const y = (next() * 100).toFixed(3);
    const a = (lo + next() * (hi - lo)).toFixed(3);
    out.push(`${x}vw ${y}vh ${blur}px 0 rgba(255,255,255,${a})`);
  }
  return out.join(",");
}

export default function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      {LAYERS.map((l, i) => (
        <i key={i} style={{ boxShadow: field(l.n, l.blur, l.lo, l.hi, l.seed) }} />
      ))}
    </div>
  );
}
