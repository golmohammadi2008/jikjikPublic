import {
  Card,
  Col,
  Row,
  Skeleton,
  SkeletonImage,
  SkeletonInput,
} from "@/components/ui";

/**
 * اسکلت‌های بارگذاری — شکلِ هر صفحه، نه یک اسپینر.
 *
 * هر اسکلت هندسه‌ی صفحه‌ی واقعی را دارد (همان گرید، همان نسبتِ تصویر) تا وقتی
 * محتوا آمد چیزی نپرد. فقط وقتی دیده می‌شوند که صفحه از کشِ ISR نیامده باشد،
 * مثلاً در جابه‌جاییِ کلاینتیِ اول یا بعد از ابطالِ کش.
 */

export function PostCardSkeleton() {
  return (
    <Card className="post-card" styles={{ body: { padding: 16 } }} cover={<SkeletonImage active style={{ width: "100%", height: 200 }} />}>
      <Skeleton active avatar={{ size: 42 }} title={{ width: "50%" }} paragraph={{ rows: 2 }} />
    </Card>
  );
}

export function PostGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Row gutter={[20, 20]}>
      {Array.from({ length: count }, (_, i) => (
        <Col key={i} xs={24} sm={12} lg={8}>
          <PostCardSkeleton />
        </Col>
      ))}
    </Row>
  );
}

export function SpecialistsSkeleton() {
  return (
    <main className="wrap" aria-busy="true" aria-label="در حال بارگذاری">
      <SkeletonInput active style={{ width: 260, marginBottom: 20 }} />
      <Row gutter={[16, 16]}>
        {Array.from({ length: 9 }, (_, i) => (
          <Col key={i} xs={24} md={12} lg={8}>
            <Card>
              <Skeleton active avatar={{ size: 48 }} paragraph={{ rows: 2 }} />
            </Card>
          </Col>
        ))}
      </Row>
    </main>
  );
}

export function ProfileSkeleton() {
  return (
    <main className="wrap" aria-busy="true" aria-label="در حال بارگذاری">
      <Card className="sp-hero" variant="borderless">
        <Skeleton active avatar={{ size: 96 }} title={{ width: "40%" }} paragraph={{ rows: 2, width: ["30%", "55%"] }} />
      </Card>
      <Row gutter={[24, 24]} className="sp-layout">
        <Col xs={24} lg={16}>
          <Card><Skeleton active paragraph={{ rows: 4 }} /></Card>
          <br />
          <Row gutter={[16, 16]}>
            {[0, 1].map((i) => (
              <Col key={i} xs={24} sm={12}><PostCardSkeleton /></Col>
            ))}
          </Row>
        </Col>
        <Col xs={0} lg={8}>
          <Card><Skeleton active paragraph={{ rows: 5 }} /></Card>
        </Col>
      </Row>
    </main>
  );
}

export function ArticleSkeleton() {
  return (
    <main className="wrap post-page" aria-busy="true" aria-label="در حال بارگذاری">
      <Skeleton active avatar title={{ width: "35%" }} paragraph={{ rows: 0 }} />
      <Skeleton active title={{ width: "75%" }} paragraph={{ rows: 0 }} />
      <SkeletonImage active style={{ width: "100%", height: 320, marginBottom: 20 }} />
      <Skeleton active paragraph={{ rows: 6 }} title={false} />
    </main>
  );
}

export function ListPageSkeleton() {
  return (
    <main className="wrap" aria-busy="true" aria-label="در حال بارگذاری">
      <Skeleton active title={{ width: "30%" }} paragraph={{ rows: 6 }} />
    </main>
  );
}

