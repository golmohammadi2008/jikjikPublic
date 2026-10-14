"use client";

import Link from "next/link";
import { Button, Flex, List, Typography } from "antd";
import Avatar from "@/components/Avatar";
import Stars from "@/components/Stars";
import VerifiedTick from "@/components/VerifiedTick";
import { formatCount } from "@/lib/format";

export type TopSpecialist = {
  id: string;
  href: string;
  name: string;
  avatar: string | null;
  subtitle: string;
  ratingAvg: number;
  ratingCount: number;
};

export default function TopSpecialists({ items }: { items: TopSpecialist[] }) {
  return (
    <List
      bordered
      className="surface"
      dataSource={items}
      renderItem={(s) => (
        <List.Item
          key={s.id}
          actions={[
            <Button key="b" type="primary" size="small" href={s.href}>
              مشاهده و رزرو
            </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar name={s.name} src={s.avatar} size={44} />}
            title={<Link href={s.href}>{s.name}<VerifiedTick /></Link>}
            description={s.subtitle}
          />
          {s.ratingAvg > 0 && (
            <Flex gap={6} align="center">
              <Stars value={s.ratingAvg} size={13} />
              <Typography.Text type="secondary">({formatCount(s.ratingCount)})</Typography.Text>
            </Flex>
          )}
        </List.Item>
      )}
    />
  );
}
