"use client";

import { useEffect, useState } from "react";
import { Alert, Button } from "antd";

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
    <Alert
      className="install-bar"
      role="region"
      aria-label="نصب اپ وینو"
      showIcon
      closable={{ onClose: dismiss, "aria-label": "بستن" }}
      title="وینو را روی گوشی‌تان داشته باشید"
      description={isAndroid ? "دریافت نسخه‌ی اندروید" : "نصب سریع، بدون فروشگاه"}
      action={
        isAndroid ? (
          <Button type="primary" href={APK_URL} download>
            دانلود اپ
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={() => void deferred?.prompt().then(() => { setDeferred(null); setHidden(true); })}
          >
            نصب
          </Button>
        )
      }
    />
  );
}
