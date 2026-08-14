import VideoBadge from "@/components/VideoBadge";

type Props = {
  imageUrl: string;
  isVideo: boolean;
  alt: string;
  /** وقتی هیچ تصویری نیست، متنِ جایگزینِ کارت */
  fallbackText: string;
};

/** پستِ ویدیویی که کاور ندارد؛ imageUrl خودش فایلِ ویدیوست (پست‌های قدیمی) */
function isRawVideo(url: string): boolean {
  return /\.(mp4|mov|webm)(\?|#|$)/i.test(url);
}

/**
 * کاورِ پست در گرید — همیشه <img>، هیچ‌وقت <video>.
 *
 * سرچ‌کنسول برای صفحه‌ی اصلی و صفحه‌ی متخصص خطای «Video isn't on a watch
 * page» می‌داد: این صفحه‌ها ده‌ها <video> در گرید داشتند، ولی صفحه‌ی تماشای
 * هیچ‌کدام نبودند (نه ویدیو محتوای اصلی‌شان بود نه VideoObject داشتند). گوگل
 * ویدیو را پیدا می‌کرد و بعد کنارش می‌گذاشت. صفحه‌ی تماشا فقط /post/[slug]
 * است و مارک‌آپِ VideoObject هم همان‌جاست.
 *
 * سود جانبی: هر کارت دیگر preload=metadata روی یک mp4 نمی‌فرستد.
 */
export default function PostThumb({ imageUrl, isVideo, alt, fallbackText }: Props) {
  // کاورِ واقعی وقتی وجود دارد که imageUrl خودش ویدیو نباشد
  const cover = imageUrl && !isRawVideo(imageUrl) ? imageUrl : null;

  if (!cover) {
    return (
      <>
        <span>{fallbackText}</span>
        {isVideo ? <VideoBadge /> : null}
      </>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cover} alt={alt} loading="lazy" decoding="async" />
      {isVideo ? <VideoBadge /> : null}
    </>
  );
}
