import Link from "next/link";
import { Button, Card } from "antd";
import { CalendarOutlined } from "@/components/icons";
import Avatar from "@/components/Avatar";
import PostThumb from "@/components/PostThumb";
import VerifiedTick from "@/components/VerifiedTick";
import { panelUserUrl } from "@/lib/config";
import { captionPlainText } from "@/lib/caption";
import { excerpt, formatCount, formatRating } from "@/lib/format";
import { buildPostSlug, buildSlug } from "@/lib/slug";
import type { PublicPost, PublicPostAuthor } from "@/lib/types";
import { Paragraph } from "@/components/ui";

/** هر پستی که کارت لازم دارد؛ بدون `author` یعنی داخل صفحه‌ی خودِ نویسنده است. */
type CardPost = Pick<PublicPost, "id" | "title" | "caption" | "imageUrl" | "isVideo" | "likesCount" | "commentsCount" | "viewsCount"> & {
  author?: PublicPostAuthor;
};

/**
 * کارتِ پست در گرید.
 *
 * همیشه متنِ ساده نشان می‌دهد: کلمپِ دو خطی با بلوکِ کد می‌شکند و ستاره‌های
 * بولد در پیش‌نمایش زشت‌اند. نشانه‌گذاری، جای خودش را در صفحه‌ی پست دارد.
 */
export default function PostCard({ post: p }: { post: CardPost }) {
  const author = p.author;
  const plain = captionPlainText(p.caption);
  const postSlug = buildPostSlug(p);

  return (
    <Card
      className="post-card"
      hoverable
      styles={{ body: { padding: 0 } }}
      cover={
        <Link className="p-media" href={`/post/${postSlug}`} aria-label="مشاهده پست">
          <PostThumb
            imageUrl={p.imageUrl}
            isVideo={p.isVideo}
            alt={excerpt(plain, 100) || "پست منتشرشده"}
            fallbackText={plain.slice(0, 24)}
          />
        </Link>
      }
    >
      {/* بدون author: داخل صفحه‌ی خودِ متخصص — نام و دکمه‌ی رزرو تکراری‌اند */}
      {author && (
        <Link className="p-head" href={`/specialists/${buildSlug(author.name, author.id)}`}>
          <Avatar name={author.name} src={author.avatar} />
          <div>
            <b>{author.name}<VerifiedTick /></b>
            <small>
              {author.specialty || author.categoryLabel || ""}
              {author.ratingAvg ? ` · ⭐ ${formatRating(author.ratingAvg)}` : ""}
            </small>
          </div>
        </Link>
      )}
      <Paragraph className="p-body" type="secondary" ellipsis={{ rows: 2 }}>
        {plain}
      </Paragraph>
      <div className="p-foot">
        <span className="stats">
          {formatCount(p.likesCount)} پسند · {formatCount(p.commentsCount)} دیدگاه
          {(p.viewsCount || 0) > 0 ? ` · ${formatCount(p.viewsCount!)} بازدید` : ""}
        </span>
        {author && (
          <Button type="primary" size="small" icon={<CalendarOutlined />} href={panelUserUrl(author.username)}>
            رزرو جلسه
          </Button>
        )}
      </div>
    </Card>
  );
}
