import { CategoryDetail, HomeData, PostDetail, PostsArchive, QuestionDetail, QuestionsArchive, SpecialistDetail, SpecialistsList } from "./types";

// این‌جا Server Component است — مستقیم سمت سرور به بک‌اند وصل می‌شود (نه از
// طریق rewrite که برای فراخوانی‌های کلاینتی/مرورگر است). روی خودِ سرور،
// ۱۲۷.۰.۰.۱ سریع‌تر از دامنه‌ی عمومی است.
// SSR روی همان سرور بک‌اند اجرا می‌شود — loopback هم سریع‌تر است و هم به
// DNS/SSL دامنه‌ی عمومی وابسته نیست (مهم حین مهاجرت دامنه)
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3000";

/**
 * فراخوانی بک‌اند برای رندر سمت سرور.
 *
 * تفاوتِ مهم بین «نبود» و «نشد»:
 *
 * قبلاً هر خطایی — قطعیِ لحظه‌ایِ بک‌اند، ۵۰۳ حین ری‌استارت، تایم‌اوت — به
 * `null` تبدیل می‌شد و صفحه با دست خالی رندر می‌شد: خروجی ۲۰۰ بود ولی بدون
 * سوال و بدون متخصص. Next همان رندرِ خالی را در کش ISR می‌نشاند و تا پایان
 * پنجره‌ی revalidate به همه تحویل می‌داد. یعنی یک ری‌استارتِ چندثانیه‌ایِ
 * بک‌اند، صفحه‌ی اصلی را برای دقایق طولانی خالی نگه می‌داشت.
 *
 * حالا فقط ۴۰۴ یعنی «واقعاً وجود ندارد» و null برمی‌گردد (تا صفحه notFound
 * بدهد). هر خطای دیگر throw می‌شود: Next رندر را کش نمی‌کند، آخرین نسخه‌ی
 * سالم را نگه می‌دارد و دفعه‌ی بعد دوباره تلاش می‌کند.
 */
/**
 * برچسبِ کش برای ابطالِ درخواستی.
 *
 * TTL تنها ابزارِ تازه‌نگه‌داشتن بود و همیشه یک بده‌بستانِ بد می‌ساخت: کوتاهش
 * کنی هر بازدید به بک‌اند می‌خورد، بلندش کنی متخصصِ تازه دیر دیده می‌شود.
 * با برچسب، بک‌اند در همان لحظه‌ی تغییر خبر می‌دهد و کش باطل می‌شود — پس
 * می‌شود هم کشِ بلند داشت هم داده‌ی تازه.
 */
export const CACHE_TAGS = {
  specialists: "specialists",
  home: "home",
} as const;

async function get<T>(path: string, revalidateSec: number, tags: string[] = []): Promise<T | null> {
  const url = `${BACKEND_URL}/api/public${path}`;

  // یک تلاش دوباره: بیشترِ خطاها همان قطعیِ کوتاهِ ری‌استارت‌اند و بلافاصله رفع می‌شوند
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { next: { revalidate: revalidateSec, tags } });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return (await res.json()) as T;
    } catch (err) {
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }
      console.error(`[public-site] fetch failed: ${path}`, err);
      throw err;
    }
  }
  return null;
}

// صفحه‌ی اصلی: محتوای نسبتاً پرتغییر، کش کوتاه
export const getHome = () => get<HomeData>("/home", 120, [CACHE_TAGS.home]);

// سوال/پست تکی: کمتر تغییر می‌کند، کش بلندتر — ولی هیچ‌وقت دیتای مالی/رزرو
// اینجا رد نمی‌شود (اصلاً از این API برنمی‌گردد)
export const getQuestion = (id: string) => get<QuestionDetail>(`/questions/${id}`, 300);
// برچسبِ پست تا ویرایشِ کپشن/عنوان همان لحظه در صفحه دیده شود؛ بک‌اند
// در هوکِ UserPost همین برچسب را باطل می‌کند
export const getPost = (id: string) => get<PostDetail>(`/posts/${id}`, 300, [`post:${id}`]);
// کش کوتاه‌تر چون شامل وضعیت آنلاین است (نباید خیلی کهنه باشد)
export const getSpecialists = () => get<SpecialistsList>("/specialists", 60, [CACHE_TAGS.specialists]);
export const getSpecialist = (id: string) => get<SpecialistDetail>(`/specialists/${id}`, 300, [CACHE_TAGS.specialists, `specialist:${id}`]);
export const getCategory = (key: string) => get<CategoryDetail>(`/category/${key}`, 300);

// آرشیو کامل سوال‌ها — بخش اصلی سئو؛ صفحه‌بندی‌شده + فیلتر دسته + مرتب‌سازی
export const getQuestionsArchive = (params: { page?: number; category?: string; sort?: "newest" | "top" } = {}) => {
  const qs = new URLSearchParams();
  if (params.page && params.page > 1) qs.set("page", String(params.page));
  if (params.category) qs.set("category", params.category);
  if (params.sort) qs.set("sort", params.sort);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return get<QuestionsArchive>(`/questions${suffix}`, 120);
};

// آرشیو کامل پست‌ها — فقط سایت‌مپ از آن استفاده می‌کند
export const getPostsArchive = (page = 1) =>
  get<PostsArchive>(`/posts${page > 1 ? `?page=${page}` : ""}`, 300, [CACHE_TAGS.home]);
