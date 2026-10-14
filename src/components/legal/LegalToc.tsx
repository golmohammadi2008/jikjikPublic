"use client";

import { Anchor } from "antd";

/** فهرستِ پرشی بالای متن‌های بلند؛ بخشِ در حالِ خواندن را روشن نگه می‌دارد. */
export default function LegalToc({ items }: { items: { href: string; title: string }[] }) {
  return (
    <nav className="legal-toc" aria-label="فهرست">
      <Anchor
        direction="horizontal"
        affix={false}
        items={items.map((i) => ({ key: i.href, href: i.href, title: i.title }))}
      />
    </nav>
  );
}
