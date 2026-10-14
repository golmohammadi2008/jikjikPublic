"use client";

import { Layout } from "antd";

/**
 * قالبِ استانداردِ antd: Header / Content / Footer.
 *
 * `Layout.Header` و دوستانش dot-access هستند و در Server Component
 * (`app/layout.tsx`) نمی‌شود نوشتشان؛ پس این پوششِ کلاینتی است و
 * هدر/فوتر را از بیرون به‌صورت المان می‌گیرد.
 */
export default function AppShell({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {header}
      <Layout.Content>{children}</Layout.Content>
      <Layout.Footer className="site-footer">{footer}</Layout.Footer>
    </Layout>
  );
}
