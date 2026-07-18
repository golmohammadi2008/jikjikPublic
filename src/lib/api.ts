import { CategoryDetail, HomeData, PostDetail, QuestionDetail, QuestionsArchive, SpecialistDetail, SpecialistsList } from "./types";

// این‌جا Server Component است — مستقیم سمت سرور به بک‌اند وصل می‌شود (نه از
// طریق rewrite که برای فراخوانی‌های کلاینتی/مرورگر است). روی خودِ سرور،
// ۱۲۷.۰.۰.۱ سریع‌تر از دامنه‌ی عمومی است.
// SSR روی همان سرور بک‌اند اجرا می‌شود — loopback هم سریع‌تر است و هم به
// DNS/SSL دامنه‌ی عمومی وابسته نیست (مهم حین مهاجرت دامنه)
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3000";

async function get<T>(path: string, revalidateSec: number): Promise<T | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/public${path}`, {
      next: { revalidate: revalidateSec },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// صفحه‌ی اصلی: محتوای نسبتاً پرتغییر، کش کوتاه
export const getHome = () => get<HomeData>("/home", 120);

// سوال/پست تکی: کمتر تغییر می‌کند، کش بلندتر — ولی هیچ‌وقت دیتای مالی/رزرو
// اینجا رد نمی‌شود (اصلاً از این API برنمی‌گردد)
export const getQuestion = (id: string) => get<QuestionDetail>(`/questions/${id}`, 300);
export const getPost = (id: string) => get<PostDetail>(`/posts/${id}`, 300);
export const getSpecialists = () => get<SpecialistsList>("/specialists", 300);
export const getSpecialist = (id: string) => get<SpecialistDetail>(`/specialists/${id}`, 300);
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
