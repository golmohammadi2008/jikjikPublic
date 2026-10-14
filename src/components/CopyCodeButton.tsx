"use client";

import { useState } from "react";
import { Button } from "antd";
import { CheckOutlined, CopyOutlined } from "@/components/icons";

/** تنها بخشِ کلاینتیِ کپشن — بقیه‌اش روی سرور رندر می‌شود و در HTML اولیه هست */
export default function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      className="code-copy"
      size="small"
      type="text"
      aria-label="کپی کد"
      icon={copied ? <CheckOutlined /> : <CopyOutlined />}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // کلیپ‌بورد بدون HTTPS یا بدون اجازه‌ی کاربر کار نمی‌کند؛ سکوت بهتر
          // از پرت‌کردنِ خطا در کنسولِ کاربر است
        }
      }}
    >
      {copied ? "کپی شد" : "کپی"}
    </Button>
  );
}
