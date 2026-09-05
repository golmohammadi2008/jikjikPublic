export type PublicAnswer = {
  id: string;
  isAi: boolean;
  body: string;
  audioUrl: string | null;
  transcript: string | null;
  likeCount: number;
  createdAt: string;
  responder: { id: string; name: string; username: string; avatar: string | null } | null;
  page?: { name: string; specialty: string | null; category: string | null; ratingAvg: number; ratingCount: number } | null;
};


export type PublicPostAuthor = {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  specialty: string | null;
  category: string | null;
  categoryLabel?: string | null;
  ratingAvg: number;
  ratingCount?: number;
};

/** یک اسلایدِ کاروسل؛ برای اسلایدِ ویدیویی `url` کاورِ آن است نه خودِ فایل */
export type PublicPostMedia = {
  url: string;
  isVideo: boolean;
  videoUrl?: string | null;
  durationSec?: number;
  aspectRatio?: number;
};

export type PublicPost = {
  id: string;
  /** عنوانِ صریحِ پست؛ خالی یعنی از کپشن حدس بزن */
  title?: string;
  caption: string;
  /**
   * اسلایدهای پست (تا ۶ تا). بک‌اند برای پست‌های تک‌رسانه‌ایِ قدیمی هم همیشه
   * یک آرایه‌ی یک‌عضوی می‌سازد، پس این‌جا لازم نیست دو شکل را جدا مدیریت کنیم.
   * فقط تک‌پست این را دارد؛ گریدها فقط `imageUrl` را می‌گیرند.
   */
  media?: PublicPostMedia[];
  /** تصویرِ شاخص = اسلایدِ اول. متای سئو و کارتِ opengraph از همین می‌آیند */
  imageUrl: string;
  isVideo: boolean;
  /** آدرسِ خودِ ویدیو؛ imageUrl کاورِ آن است */
  videoUrl?: string | null;
  /** طول ویدیو به ثانیه — فقط در تک‌پست، برای VideoObject */
  durationSec?: number | null;
  likesCount: number;
  commentsCount: number;
  /** بازدید — بک‌اندهای قدیمی‌تر نمی‌فرستادند، پس اختیاری */
  viewsCount?: number;
  createdAt: string;
  author: PublicPostAuthor;
};

export type HomeData = {
  posts: PublicPost[];
  categories: { key: string; label: string; count: number }[];
};


export type PostDetail = {
  post: PublicPost;
  related: { id: string; text: string; answerCount: number }[];
};

export type SpecialistListItem = {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  specialty: string | null;
  category: string | null;
  categoryLabel: string | null;
  bio: string | null;
  ratingAvg: number;
  ratingCount: number;
  /**
   * ⚠️ سرور دیگر این را نمی‌فرستد و نباید به آن تکیه کرد.
   * وضعیت آنلاین ثانیه‌ای عوض می‌شود و این پاسخ کش می‌شود، پس مقدارش
   * تا انقضای کش دروغ می‌گفت. زنده‌اش از lib/useOnlineStatus می‌آید.
   * @deprecated
   */
  online?: never;
};

export type SpecialistsList = { specialists: SpecialistListItem[] };

export type SpecialistPost = {
  id: string;
  title?: string;
  caption: string;
  imageUrl: string;
  isVideo: boolean;
  /** آدرسِ خودِ ویدیو؛ imageUrl کاورِ آن است */
  videoUrl?: string | null;
  likesCount: number;
  commentsCount: number;
  /** بازدید — بک‌اندهای قدیمی‌تر نمی‌فرستادند، پس اختیاری */
  viewsCount?: number;
  createdAt: string;
};

/** نظر یک مراجع پس از جلسه — فقط نام و آواتارِ نظردهنده عمومی است */
export type SpecialistReview = {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
  client: { name: string; avatar: string | null };
};

/** متخصص در صفحه‌ی پروفایل — چند فیلد بیشتر از کارتِ فهرست دارد */
export type SpecialistProfile = SpecialistListItem & {
  /** نرخِ هر جلسه (تومان). صفر = هنوز نرخی تعیین نشده */
  hourlyRate: number;
  sessionDurationMinutes: number;
  currency: string;
  /** آخرین تولید محتوا — برای نشانِ «فعال» */
  lastActivityAt: string | null;
  /** نزدیک‌ترین وقتِ خالی، ISO؛ null یعنی فعلاً وقتی باز نیست */
  nextSlotAt: string | null;
};

export type SpecialistDetail = {
  specialist: SpecialistProfile;
  posts: SpecialistPost[];
  /** فقط نظرهای متن‌دار؛ سرور نظرهای بی‌متن را فیلتر می‌کند */
  reviews: SpecialistReview[];
  related: { id: string; text: string; answerCount: number }[];
};


/** صفحه‌ی حوزه: پست‌های همان حوزه (پیش‌تر سوال‌ها بود؛ پرسش‌وپاسخ حذف شد) */
export type CategoryPost = {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  isVideo: boolean;
  videoUrl: string | null;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: string;
  author: { id: string; name: string; username: string; avatar: string };
};

export type CategoryDetail = {
  category: { key: string; label: string };
  posts: CategoryPost[];
};


/**
 * آرشیو پست‌ها — فقط برای سایت‌مپ.
 *
 * سایت‌مپ پست‌ها را از `home.posts` می‌گرفت که روی ۶ تا محدود است، پس با هر
 * پستِ تازه قدیمی‌ترین از سایت‌مپ بیرون می‌افتاد. این آرشیو همه را می‌دهد.
 */
export type PostsArchiveItem = {
  id: string;
  title: string;
  caption: string;
  createdAt: string;
  /** فقط پستِ ویدیویی این‌ها را دارد — برای /video-sitemap.xml */
  isVideo?: boolean;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  durationSec?: number;
};

export type PostsArchive = {
  posts: PostsArchiveItem[];
  page: number;
  totalPages: number;
  total: number;
};
