"use client";

import { useState } from "react";
import { Button, Input, Select } from "antd";
import { SearchOutlined } from "@/components/icons";
import { PANEL_URL } from "@/lib/config";

/**
 * جعبه‌ی سوالِ هیرو — کارِ اصلیِ سایت.
 * همان قیفِ دستیار: سوال با کاربر به پنل می‌رود تا جوابِ *همان* را آن‌جا بگیرد.
 */
export default function HeroAsk({ categories }: { categories: { key: string; label: string }[] }) {
  const [text, setText] = useState("");
  const [cat, setCat] = useState<string | undefined>();
  const [going, setGoing] = useState(false);

  const go = () => {
    const q = text.trim();
    if (!q || going) return;
    setGoing(true);
    const prefix = cat ? `[${categories.find((c) => c.key === cat)?.label}] ` : "";
    window.location.href = `${PANEL_URL}/assistant?q=${encodeURIComponent(prefix + q)}`;
  };

  return (
    <div className="hero-ask" role="search">
      <Select
        size="large"
        variant="borderless"
        placeholder="همه‌ی حوزه‌ها"
        allowClear
        value={cat}
        onChange={setCat}
        options={categories.map((c) => ({ value: c.key, label: c.label }))}
        className="hero-ask-cat"
        aria-label="حوزه"
      />
      <Input
        size="large"
        variant="borderless"
        prefix={<SearchOutlined />}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPressEnter={go}
        maxLength={1000}
        placeholder="سوالت را بنویس؛ مثلاً: قرارداد کارم بند عجیبی دارد…"
        aria-label="سوال خود را بنویسید"
      />
      <Button type="primary" size="large" loading={going} onClick={go} disabled={!text.trim()}>
        بپرس
      </Button>
    </div>
  );
}
