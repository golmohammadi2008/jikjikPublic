This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## بیلد: `BACKEND_URL` را حتماً ست کن

```bash
BACKEND_URL=https://api.weeno.ir npm run build
```

**چرا مهم است:** بیلد روی لپ‌تاپ انجام می‌شود و `.next` آماده به سرور می‌رود.
مقدار پیش‌فرضِ `BACKEND_URL` برابر `http://127.0.0.1:3000` است — یعنی روی
لپ‌تاپ هیچ بک‌اندی آن‌جا نیست. صفحه‌ی اصلی و فهرست‌ها در همان بیلد
prerender می‌شوند، پس بدون این متغیر، صفحه‌ها **خالی** بیلد می‌شدند: خروجی
۲۰۰ بود ولی نه سوالی داشت نه متخصصی، و همان HTMLِ خالی به پروداکشن می‌رفت.

قبلاً `lib/api.ts` هر خطا را به `null` تبدیل می‌کرد و این اتفاق بی‌صدا رخ
می‌داد. حالا هر خطای غیرِ ۴۰۴ throw می‌شود، پس **بیلد می‌شکند** به‌جای این‌که
سایتِ خالی تحویل بدهد. اگر بیلد با `ECONNREFUSED 127.0.0.1:3000` شکست، همین
متغیر یادت رفته.
