import type { ThemeConfig } from "antd";

/** توکن‌های برند وینو — آبی سلطنتی، فونت Shabnam. منبع واحدِ رنگ‌ها برای antd. */
export const BRAND = {
  primary: "#2563EB",
  primaryDeep: "#1D4ED8",
  ai: "#7C5CFF",
  bg: "#F4F7FA",
  ink: "#1E2B29",
} as const;

export const theme: ThemeConfig = {
  cssVar: { key: "weeno" },
  // آتریبیوت‌های سلکتور را خالی نگه می‌دارد تا hash در کلاس‌ها نیاید و HTML سبک‌تر شود
  hashed: false,
  token: {
    colorPrimary: BRAND.primary,
    colorInfo: BRAND.primary,
    colorLink: BRAND.primary,
    colorTextBase: BRAND.ink,
    colorBgLayout: "#F5F5F5",
    colorBorder: "#E5E7EB",
    // پیش‌فرضِ خودِ antd (۶ پیکسل، ۱۴ پیکسل، ۳۲ پیکسل) — ظاهرِ استانداردِ
    // طراحیِ antd، فقط با رنگِ برند و فونتِ Shabnam
    fontFamily: '"Shabnam", system-ui, sans-serif',
    lineHeight: 1.8,
    borderRadius: 10,
    controlHeight: 38,
  },
  components: {
    Button: { fontWeight: 500 },
    Skeleton: { gradientFromColor: "rgba(37,99,235,.06)", gradientToColor: "rgba(37,99,235,.14)" },
  },
};
