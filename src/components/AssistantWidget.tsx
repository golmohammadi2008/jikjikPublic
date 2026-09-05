"use client";

/**
 * ویجت دستیار روی سایت عمومی — فقط سوال را می‌گیرد، جواب نمی‌دهد.
 *
 * قبلاً همین‌جا پاسخ می‌داد و بعد از دو سوال قفل می‌شد. دو ایراد داشت:
 * هزینه‌ی توکنِ کسی که هنوز حساب نساخته پای ما بود، و مسیرِ AI بدونِ لاگین
 * روی اینترنت باز می‌ماند. مهم‌تر از آن، کاربر جوابش را می‌گرفت و می‌رفت —
 * یعنی قلاب، دقیقاً کاری را می‌کرد که نباید.
 *
 * حالا سوال با کاربر به پنل می‌رود (`/assistant?q=…`): لاگین می‌کند و جوابِ
 * *همان* سوال را آنجا می‌گیرد، نه صفحه‌ی خالی که باید دوباره تایپش کند.
 */

import { useState } from "react";
import { PANEL_URL } from "@/lib/config";

export default function AssistantWidget() {
  const [input, setInput] = useState("");
  const [going, setGoing] = useState(false);

  const go = () => {
    const text = input.trim();
    if (!text || going) return;
    setGoing(true);
    window.location.href = `${PANEL_URL}/assistant?q=${encodeURIComponent(text)}`;
  };

  return (
    <section className="section" id="assistant">
      <div className="wrap">
        <div className="asst-box">
          <p className="asst-empty">
            سوالت را بنویس — وارد که شدی، جوابِ همین سوال منتظرت است.
          </p>

          <div className="asst-form">
            <input
              className="asst-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") go(); }}
              placeholder="مثلاً: قرارداد کارم بند عجیبی دارد، مشکل‌دار است؟"
              maxLength={1000}
              disabled={going}
            />
            <button
              type="button"
              className="btn btn-saffron"
              onClick={go}
              disabled={going || !input.trim()}
            >
              {going ? "…" : "بپرس"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
