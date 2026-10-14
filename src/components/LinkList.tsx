"use client";

import Link from "next/link";
import { List, Typography } from "antd";

/** فهرستِ لینک‌دار. `renderItem` تابع است و از Server Component نمی‌شود پاسش داد؛ پس داده‌ی ساده می‌گیرد. */
export default function LinkList({ items }: { items: { key: string; href: string; title: string; extra?: string }[] }) {
  return (
    <List
      className="surface"
      bordered
      dataSource={items}
      renderItem={(i) => (
        <List.Item key={i.key} extra={i.extra ? <Typography.Text type="secondary">{i.extra}</Typography.Text> : null}>
          <Link href={i.href}>{i.title}</Link>
        </List.Item>
      )}
    />
  );
}
