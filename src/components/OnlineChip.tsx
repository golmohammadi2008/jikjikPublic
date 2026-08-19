"use client";

import { useOnlineStatus } from "@/lib/useOnlineStatus";

/**
 * نشانِ «هم‌اکنون آنلاین» روی سربرگِ پروفایل.
 *
 * جدا و کلاینتی است چون خودِ صفحه کش می‌شود؛ اگر این وضعیت داخلِ HTML پخته
 * می‌شد، به بازدیدکننده می‌گفت متخصص آنلاین است در حالی که ساعت‌ها پیش رفته.
 * تا وقتی پاسخ نرسیده چیزی رندر نمی‌شود — نشانِ خاموش بهتر از نشانِ دروغ است.
 */
export default function OnlineChip({ specialistId }: { specialistId: string }) {
  const online = useOnlineStatus([specialistId]);
  if (!online.has(specialistId)) return null;

  return (
    <span className="sp-chip sp-chip--live">
      <span className="sp-live-dot" aria-hidden="true" />
      هم‌اکنون آنلاین
    </span>
  );
}
