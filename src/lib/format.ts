const AVATAR_COLORS = ["#0E7266", "#6553C6", "#C46A05", "#3C6E9F", "#8A4FB0", "#B0473F"];

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 1);
  return `${parts[0].slice(0, 1)}.${parts[1].slice(0, 1)}`;
}

export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function excerpt(text: string, max = 140): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= max) return clean;
  return clean.slice(0, max).trim() + "…";
}

// چون عنوان مجزا در دیتای بک‌اند نداریم، اولین جمله یا بخش کوتاه متن را عنوان می‌گیریم
export function deriveTitle(text: string, max = 70): string {
  const clean = text.trim().replace(/\s+/g, " ");
  const firstSentence = clean.split(/(?<=[.!؟?])\s/)[0];
  if (firstSentence && firstSentence.length <= max) return firstSentence;
  return excerpt(clean, max);
}

export function formatJalali(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", { calendar: "persian", dateStyle: "long" }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function formatCount(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(n);
}
