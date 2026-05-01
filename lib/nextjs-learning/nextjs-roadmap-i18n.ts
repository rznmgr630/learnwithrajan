import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapTag } from "@/lib/challenge-data";

const NEXTJS_TAG: Record<string, LocalizedString> = {
  intro: { en: "intro", np: "परिचय", jp: "イントロ" },
  setup: { en: "setup", np: "सेटअप", jp: "セットアップ" },
  rendering: { en: "rendering", np: "रेन्डरिङ", jp: "レンダリング" },
  "server-components": { en: "Server Components", np: "सर्भर कम्पोनेन्ट", jp: "サーバーコンポーネント" },
  "data-fetching": { en: "data fetching", np: "डेटा फेच", jp: "データ取得" },
  caching: { en: "caching", np: "क्यासिङ", jp: "キャッシュ" },
  styling: { en: "styling", np: "शैली", jp: "スタイル" },
  tailwind: { en: "Tailwind", np: "Tailwind", jp: "Tailwind" },
  routing: { en: "routing", np: "रूटिङ", jp: "ルーティング" },
  layouts: { en: "layouts", np: "लेआउट", jp: "レイアウト" },
  navigation: { en: "navigation", np: "नेभिगेशन", jp: "ナビゲーション" },
  "error-handling": { en: "error handling", np: "त्रुटि ह्यान्डलिङ", jp: "エラー処理" },
  "api-routes": { en: "API routes", np: "API रूट", jp: "APIルート" },
  zod: { en: "Zod", np: "Zod", jp: "Zod" },
  prisma: { en: "Prisma", np: "Prisma", jp: "Prisma" },
  database: { en: "database", np: "डेटाबेस", jp: "データベース" },
  upload: { en: "file upload", np: "फाइल अपलोड", jp: "ファイルアップロード" },
  cloudinary: { en: "Cloudinary", np: "Cloudinary", jp: "Cloudinary" },
  auth: { en: "authentication", np: "प्रमाणीकरण", jp: "認証" },
  "next-auth": { en: "NextAuth", np: "NextAuth", jp: "NextAuth" },
  email: { en: "email", np: "इमेल", jp: "メール" },
  optimization: { en: "optimization", np: "अनुकूलन", jp: "最適化" },
  seo: { en: "SEO", np: "SEO", jp: "SEO" },
  deployment: { en: "deployment", np: "डिप्लोयमेन्ट", jp: "デプロイ" },
  vercel: { en: "Vercel", np: "Vercel", jp: "Vercel" },
};

export function nextjsTags(slugs: [string, string]): RoadmapTag[] {
  return [
    { slug: slugs[0], label: NEXTJS_TAG[slugs[0]] ?? { en: slugs[0], np: slugs[0], jp: slugs[0] } },
    { slug: slugs[1], label: NEXTJS_TAG[slugs[1]] ?? { en: slugs[1], np: slugs[1], jp: slugs[1] } },
  ];
}

const NEXTJS_DAY_TITLE: Record<number, LocalizedString> = {
  1: {
    en: "What is Next.js, setup & your first app",
    np: "Next.js के हो, सेटअप र पहिलो एप",
    jp: "Next.js とは・セットアップ・最初のアプリ",
  },
  2: {
    en: "Server & Client Components, data fetching & rendering strategies",
    np: "Server/Client कम्पोनेन्ट, डेटा फेच र रेन्डरिङ",
    jp: "Server/Client コンポーネント・データ取得・レンダリング戦略",
  },
  3: {
    en: "Styling — Global CSS, CSS Modules, Tailwind & DaisyUI",
    np: "Styling — Global CSS, CSS Modules, Tailwind र DaisyUI",
    jp: "スタイル — Global CSS・CSS Modules・Tailwind・DaisyUI",
  },
  4: {
    en: "Routing deep dive — dynamic, catch-all, query params & layouts",
    np: "Routing — dynamic, catch-all, query params र layouts",
    jp: "ルーティング詳解 — 動的・キャッチオール・クエリ・レイアウト",
  },
  5: {
    en: "Navigation, loading UI, Not Found & error boundaries",
    np: "Navigation, loading UI, Not Found र error boundaries",
    jp: "ナビゲーション・ローディング・Not Found・エラー境界",
  },
  6: {
    en: "Building REST APIs with Route Handlers & Zod validation",
    np: "Route Handlers र Zod सहित REST API निर्माण",
    jp: "Route Handler と Zod で REST API を構築する",
  },
  7: {
    en: "Database integration with Prisma — models, migrations & CRUD",
    np: "Prisma सहित डेटाबेस — models, migrations र CRUD",
    jp: "Prisma でデータベース連携 — モデル・マイグレーション・CRUD",
  },
  8: {
    en: "Uploading files with Cloudinary",
    np: "Cloudinary सहित फाइल अपलोड",
    jp: "Cloudinary を使ったファイルアップロード",
  },
  9: {
    en: "Authentication with NextAuth — Google, credentials & session protection",
    np: "NextAuth — Google, credentials र session सुरक्षा",
    jp: "NextAuth 認証 — Google・認証情報・セッション保護",
  },
  10: {
    en: "Sending emails, image/font optimizations, SEO & lazy loading",
    np: "इमेल, image/font अनुकूलन, SEO र lazy loading",
    jp: "メール送信・画像/フォント最適化・SEO・遅延読み込み",
  },
  11: {
    en: "Deployment to Vercel — production prep, CI & troubleshooting",
    np: "Vercel मा Deployment — production, CI र troubleshooting",
    jp: "Vercel へのデプロイ — 本番準備・CI・トラブルシューティング",
  },
};

const NEXTJS_WEEK_TITLE: Record<string, LocalizedString> = {
  "nextjs-foundations": {
    en: "Foundations (~41m)",
    np: "आधार (~४१m)",
    jp: "基礎（約41分）",
  },
  "nextjs-ui-routing": {
    en: "UI, Styling & Routing (~71m)",
    np: "UI, Styling र Routing (~७१m)",
    jp: "UI・スタイル・ルーティング（約71分）",
  },
  "nextjs-apis-data": {
    en: "APIs & Database (~63m)",
    np: "APIs र Database (~६३m)",
    jp: "API とデータベース（約63分）",
  },
  "nextjs-features": {
    en: "Features — Auth & Uploads (~70m)",
    np: "Auth र Upload (~७०m)",
    jp: "機能 — 認証・アップロード（約70分）",
  },
  "nextjs-ship": {
    en: "Optimize & Ship (~32m)",
    np: "Optimize र Ship (~३२m)",
    jp: "最適化と公開（約32分）",
  },
};

export function nextjsDayTitle(day: number): LocalizedString {
  return NEXTJS_DAY_TITLE[day] ?? { en: `Day ${day}`, np: `दिन ${day}`, jp: `Day ${day}` };
}

export function nextjsWeekTitle(weekId: string): LocalizedString {
  return NEXTJS_WEEK_TITLE[weekId] ?? { en: weekId, np: weekId, jp: weekId };
}
