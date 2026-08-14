"use client";

import { useState } from "react";

/** تنها بخشِ کلاینتیِ کپشن — بقیه‌اش روی سرور رندر می‌شود و در HTML اولیه هست */
export default function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="code-copy"
      aria-label="کپی کد"
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
    </button>
  );
}
