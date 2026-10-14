"use client";

import { useState } from "react";
import { Input } from "antd";
import { PANEL_URL } from "@/lib/config";

/** همان قیفِ دستیار (AssistantWidget): سوال را با کاربر به پنل می‌برد. */
export default function HeroAsk() {
  const [text, setText] = useState("");
  const [going, setGoing] = useState(false);

  const go = () => {
    const q = text.trim();
    if (!q || going) return;
    setGoing(true);
    window.location.href = `${PANEL_URL}/assistant?q=${encodeURIComponent(q)}`;
  };

  return (
    <Input.Search
      size="large"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onSearch={go}
      enterButton="بپرس"
      loading={going}
      maxLength={1000}
      placeholder="سوالت را بنویس؛ مثلاً: قرارداد کارم بند عجیبی دارد…"
      aria-label="سوال خود را بنویسید"
    />
  );
}
