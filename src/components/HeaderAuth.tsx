"use client";

import { useEffect, useState } from "react";
import { PANEL_URL, SESSION_TOKEN_COOKIE, panelProfileUrl } from "@/lib/config";
import Avatar from "@/components/Avatar";

type Me = { name: string; username: string; avatar: string | null };

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function decodeUserId(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(json);
    return typeof data.userId === "string" ? data.userId : null;
  } catch {
    return null;
  }
}

export default function HeaderAuth() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    let cancelled = false;

    const check = () => {
      const token = readCookie(SESSION_TOKEN_COOKIE);
      if (!token) { setMe(null); return; }
      const userId = decodeUserId(token);
      if (!userId) { setMe(null); return; }
      fetch(`/api/users/profile/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => (r.ok ? r.json() : null))
        .then((body) => {
          if (cancelled || !body?.data?.name) return;
          setMe({ name: body.data.name, username: body.data.username, avatar: body.data.avatar ?? null });
        })
        .catch(() => {});
    };

    check();
    // صفحه از bfcache برگردد (مثلاً کاربر بعد از لاگین در پنل با دکمه‌ی back
    // برگردد اینجا) — effect دوباره اجرا نمی‌شود مگر با این event، پس بدون
    // این، هدر همچنان «ورود» قدیمی را نشان می‌داد با اینکه لاگین انجام شده بود
    const onPageShow = (e: PageTransitionEvent) => { if (e.persisted) check(); };
    window.addEventListener('pageshow', onPageShow);
    return () => {
      cancelled = true;
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  if (me) {
    return (
      <a className="btn btn-ghost btn-sm" href={panelProfileUrl()} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={me.name} src={me.avatar} size={24} />
        پروفایل من
      </a>
    );
  }
  return (
    <a className="btn btn-ghost btn-sm" href={PANEL_URL}>
      ورود
    </a>
  );
}
