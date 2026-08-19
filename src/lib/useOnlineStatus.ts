"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "./config";

/**
 * وضعیت آنلاینِ زنده.
 *
 * چرا هوک جدا و نه داده‌ی داخلِ صفحه: وضعیت آنلاین تنها چیزی روی این صفحه
 * است که ثانیه‌ای عوض می‌شود، ولی داخلِ HTMLی پخته می‌شد که دقیقه‌ها کش
 * می‌ماند. نتیجه‌اش نقطه‌ی سبزی بود که به کسی که مدت‌ها پیش رفته هنوز
 * «آنلاین» می‌گفت — و بازدیدکننده بر اساس همان تصمیم می‌گیرد سوال بپرسد.
 *
 * حالا صفحه کش می‌ماند (سریع، خوب برای سئو) و فقط همین یک عدد زنده گرفته
 * می‌شود.
 *
 * چرا polling و نه سوکت: سایت عمومی لاگین ندارد و بازکردنِ یک سوکت به‌ازای
 * هر بازدیدکننده‌ی ناشناس، برای یک نقطه‌ی سبز گران است. بیست ثانیه برای این
 * کاربرد عملاً لحظه‌ای است.
 */
const POLL_MS = 20_000;

export function useOnlineStatus(ids: string[]): Set<string> {
  const [online, setOnline] = useState<Set<string>>(() => new Set());

  // کلیدِ پایدار از آرایه: بدونش هر رندر یک آرایه‌ی تازه می‌سازد و افکت
  // بی‌پایان دوباره اجرا می‌شود
  const key = ids.join(",");

  useEffect(() => {
    if (!key) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tick = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/online?ids=${encodeURIComponent(key)}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (alive) setOnline(new Set(data.online ?? []));
      } catch {
        // شکستِ یک دور مهم نیست؛ دورِ بعدی دوباره تلاش می‌کند و تا آن موقع
        // آخرین وضعیتِ شناخته‌شده می‌ماند
      } finally {
        if (alive) timer = setTimeout(tick, POLL_MS);
      }
    };

    tick();

    // تبِ پنهان نباید هر بیست ثانیه درخواست بزند؛ برگشتن به تب هم باید
    // فوراً تازه شود نه اینکه تا دورِ بعد صبر کند
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timer);
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      alive = false;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [key]);

  return online;
}
