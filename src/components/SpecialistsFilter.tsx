"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, Col, Divider, Empty, Flex, Input, Row, Segmented, Select, Tag, Typography } from "antd";
import { CalendarOutlined, SearchOutlined, StarFilled } from "@/components/icons";
import { panelUserUrl } from "@/lib/config";
import { buildSlug } from "@/lib/slug";
import { formatRating } from "@/lib/format";
import type { SpecialistListItem } from "@/lib/types";
import Avatar from "@/components/Avatar";
import VerifiedTick from "@/components/VerifiedTick";
import { useOnlineStatus } from "@/lib/useOnlineStatus";

type Sort = "top" | "rating";

export default function SpecialistsFilter({ specialists }: { specialists: SpecialistListItem[] }) {
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of specialists) {
      if (s.category && s.categoryLabel) map.set(s.category, s.categoryLabel);
    }
    return Array.from(map, ([key, label]) => ({ key, label }));
  }, [specialists]);

  // وضعیت آنلاین از خودِ صفحه نمی‌آید: صفحه کش می‌شود و نقطه‌ی سبز تا
  // انقضای کش دروغ می‌گفت. این هوک آن را زنده می‌گیرد (lib/useOnlineStatus).
  const onlineIds = useOnlineStatus(useMemo(() => specialists.map((s) => s.id), [specialists]));

  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("top");

  const filtered = useMemo(() => {
    const q = query.trim();
    let list = specialists.filter((s) => {
      if (category !== "all" && s.category !== category) return false;
      if (q && !`${s.name} ${s.specialty ?? ""}`.includes(q)) return false;
      return true;
    });
    if (sort === "rating") {
      list = [...list].sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
    }
    return list;
  }, [specialists, category, query, sort]);

  return (
    <>
      <div className="filter-bar">
        <Segmented
          className="filter-chips"
          value={category}
          onChange={(v) => setCategory(v as string)}
          options={[{ value: "all", label: "همه" }, ...categories.map((c) => ({ value: c.key, label: c.label }))]}
        />

        <div className="filter-tools">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جست‌وجوی نام یا تخصص..."
            aria-label="جست‌وجوی متخصص"
          />
          <Select<Sort>
            value={sort}
            onChange={setSort}
            aria-label="مرتب‌سازی"
            options={[
              { value: "top", label: "پیشنهادی" },
              { value: "rating", label: "بیشترین امتیاز" },
            ]}
          />
        </div>
      </div>

      <Typography.Text type="secondary" className="filter-count">
        {filtered.length.toLocaleString("fa-IR")} متخصص
      </Typography.Text>

      {filtered.length === 0 ? (
        <Empty description="موردی با این فیلتر پیدا نشد." />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((s) => {
            const slug = buildSlug(s.name, s.id);
            const online = onlineIds.has(s.id);
            return (
              <Col key={s.id} xs={24} md={12} lg={8}>
                <Card
                  className="spec-card"
                  hoverable
                >
                  <Link href={`/specialists/${slug}`}>
                    <Card.Meta
                      avatar={
                        <Badge dot={online} color="green" offset={[-4, 36]}>
                          <Avatar name={s.name} src={s.avatar} />
                        </Badge>
                      }
                      title={
                        <Flex justify="space-between" align="center" gap={8}>
                          <span>
                            {s.name}
                            <VerifiedTick />
                            {online && <Tag color="success" className="online-badge">آنلاین</Tag>}
                          </span>
                          {s.ratingAvg > 0 && (
                            <Typography.Text type="warning" title={`${s.ratingCount} نظر`}>
                              <StarFilled /> {formatRating(s.ratingAvg)}
                            </Typography.Text>
                          )}
                        </Flex>
                      }
                      description={s.specialty || s.categoryLabel || ""}
                    />
                    {s.bio && (
                      <Typography.Paragraph type="secondary" className="spec-bio" ellipsis={{ rows: 2 }}>
                        {s.bio}
                      </Typography.Paragraph>
                    )}
                  </Link>
                  <Divider style={{ margin: "12px 0" }} />
                  <Flex justify="space-between" align="center">
                    {s.categoryLabel ? <Tag color="blue">{s.categoryLabel}</Tag> : <span />}
                    <Button type="primary" size="small" icon={<CalendarOutlined />} href={panelUserUrl(s.username)}>
                      رزرو جلسه
                    </Button>
                  </Flex>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </>
  );
}
