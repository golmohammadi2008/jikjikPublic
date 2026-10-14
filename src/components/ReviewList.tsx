"use client";

import { Card, List, Typography } from "antd";
import Avatar from "@/components/Avatar";
import Stars from "@/components/Stars";

export type ReviewItem = { id: string; name: string; avatar: string | null; rating: number; text: string; dateISO: string; dateLabel: string };

/** نظرها — `renderItem` تابع است، پس داده‌ی ساده می‌گیرد و این‌جا کلاینتی است. */
export default function ReviewList({ items }: { items: ReviewItem[] }) {
  return (
    <List
      itemLayout="vertical"
      dataSource={items}
      renderItem={(r) => (
        <Card key={r.id} size="small" style={{ marginBottom: 12 }}>
          <List.Item.Meta
            avatar={<Avatar name={r.name} src={r.avatar} size={40} />}
            title={r.name}
            description={<Stars value={r.rating} />}
          />
          <Typography.Paragraph style={{ margin: "8px 0" }}>{r.text}</Typography.Paragraph>
          <Typography.Text type="secondary">
            <time dateTime={r.dateISO}>{r.dateLabel}</time>
          </Typography.Text>
        </Card>
      )}
    />
  );
}
