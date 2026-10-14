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
import { Card, Input, Typography } from "antd";
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
        <Card className="asst-box" variant="borderless">
          <Typography.Paragraph type="secondary" className="asst-empty">
            سوالت را بنویس — وارد که شدی، جوابِ همین سوال منتظرت است.
          </Typography.Paragraph>
          <Input.Search
            size="large"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSearch={go}
            enterButton="بپرس"
            loading={going}
            disabled={going}
            maxLength={1000}
            placeholder="مثلاً: قرارداد کارم بند عجیبی دارد، مشکل‌دار است؟"
          />
        </Card>
      </div>
    </section>
  );
}
