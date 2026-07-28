"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** لینکِ مستقیمِ APK — روی اندروید به‌جای PWA همین پیشنهاد می‌شود. */
const APK_URL = "/weeno.apk";
/** بستنِ پیشنهاد ۳۰ روز به یاد می‌ماند تا «رو مخ» نباشد. */
const DISMISS_KEY = "weeno_install_dismissed_until";
const DISMISS_DAYS = 30;

function dismissedRecently() {
  try {
    const until = Number(localStorage.getItem(DISMISS_KEY) || 0);
    return Number.isFinite(until) && Date.now() < until;
  } catch {
    return false;
  }
}

/** داخلِ خودِ اپ (WebViewِ اپ یا PWAی نصب‌شده) هرگز پیشنهادِ نصب نمی‌دهیم. */
function insideApp() {
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  if ((window.navigator as unknown as { standalone?: boolean }).standalone) return true;
  if (typeof (window as unknown as { ReactNativeWebView?: unknown }).ReactNativeWebView !== "undefined") return true;
  return /\bwv\b|WebView|weeno-app/i.test(navigator.userAgent);
}

export default function InstallAppBar() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAndroid, setIsAndroid] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (insideApp() || dismissedRecently() || !window.isSecureContext) return;

    const android = /Android/i.test(navigator.userAgent);
    setIsAndroid(android);
    // اندروید: APK همیشه قابلِ پیشنهاد است و به beforeinstallprompt نیاز ندارد
    if (android) setHidden(false);

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setHidden(false);
    };
    const onInstalled = () => {
      setDeferred(null);
      setHidden(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 864e5));
    } catch {
      /* حالتِ خصوصیِ مرورگر — بستن فقط برای همین نشست می‌ماند */
    }
  };

  if (hidden || (!isAndroid && !deferred)) return null;

  return (
    <div className="install-bar" role="region" aria-label="نصب اپ وینو">
      <span className="install-bar-texts">
        <span className="install-bar-title">وینو را روی گوشی‌تان داشته باشید</span>
        <span className="install-bar-sub">
          {isAndroid ? "دریافت نسخه‌ی اندروید" : "نصب سریع، بدون فروشگاه"}
        </span>
      </span>

      {isAndroid ? (
        <a className="install-bar-cta" href={APK_URL} download>
          دانلود اپ
        </a>
      ) : (
        <button
          type="button"
          className="install-bar-cta"
          onClick={() => void deferred?.prompt().then(() => { setDeferred(null); setHidden(true); })}
        >
          نصب
        </button>
      )}

      <button type="button" className="install-bar-close" onClick={dismiss} aria-label="بستن">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
