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
    colorBgLayout: BRAND.bg,
    colorBorder: "#E5E7EB",
    borderRadius: 12,
    borderRadiusLG: 18,
    fontFamily: '"Shabnam", system-ui, sans-serif',
    fontSize: 15,
    lineHeight: 1.9,
    controlHeight: 40,
    wireframe: false,
  },
  components: {
    Button: { fontWeight: 700, primaryShadow: "0 6px 18px -8px rgba(37,99,235,.55)" },
    Card: { bodyPadding: 18 },
    Skeleton: { gradientFromColor: "rgba(37,99,235,.06)", gradientToColor: "rgba(37,99,235,.14)" },
    Menu: { itemBg: "transparent", horizontalItemSelectedColor: BRAND.primary },
  },
};
