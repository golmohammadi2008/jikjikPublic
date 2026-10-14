"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import faIR from "antd/locale/fa_IR";
import { theme } from "@/lib/theme";

/**
 * ریشه‌ی Ant Design.
 *
 * `AntdRegistry` استایل‌های CSS-in-JS را حین SSR جمع می‌کند و داخل HTML
 * می‌نشاند؛ بدونش هر صفحه یک لحظه بی‌استایل می‌آید و بعد می‌پرد.
 * جهت RTL و زبان فارسی هم یک‌جا این‌جا تنظیم می‌شود تا هیچ کامپوننتی
 * جداگانه به آن‌ها دست نزند.
 */
export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider direction="rtl" locale={faIR} theme={theme}>
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
