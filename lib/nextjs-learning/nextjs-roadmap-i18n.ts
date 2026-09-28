import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapTag } from "@/lib/challenge-data";

const NEXTJS_TAG: Record<string, LocalizedString> = {
  prerequisites: { en: "prerequisites", np: "पूर्वआवश्यकता", jp: "前提知識" },
  "web-fundamentals": { en: "web fundamentals", np: "वेब आधार", jp: "Web 基礎" },
  intro: { en: "intro", np: "परिचय", jp: "イントロ" },
  setup: { en: "setup", np: "सेटअप", jp: "セットアップ" },
  rendering: { en: "rendering", np: "रेन्डरिङ", jp: "レンダリング" },
  "rendering-strategies": { en: "Rendering Strategies", np: "रेन्डरिङ रणनीतिहरू", jp: "レンダリング戦略" },
  "suspense-streaming": { en: "Suspense & Streaming", np: "Suspense र Streaming", jp: "Suspense とストリーミング" },
  "server-components": { en: "Server Components", np: "सर्भर कम्पोनेन्ट", jp: "サーバーコンポーネント" },
  "client-components": { en: "Client Components", np: "क्लाइन्ट कम्पोनेन्ट", jp: "クライアントコンポーネント" },
  "data-fetching": { en: "data fetching", np: "डेटा फेच", jp: "データ取得" },
  "data-patterns": { en: "data patterns", np: "डेटा ढाँचाहरू", jp: "データパターン" },
  "loading-ui": { en: "loading UI", np: "लोडिङ UI", jp: "ローディングUI" },
  caching: { en: "caching", np: "क्यासिङ", jp: "キャッシュ" },
  revalidation: { en: "revalidation", np: "पुनः प्रमाणीकरण", jp: "再検証" },
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
  orm: { en: "ORM", np: "ORM", jp: "ORM" },
  upload: { en: "file upload", np: "फाइल अपलोड", jp: "ファイルアップロード" },
  cloudinary: { en: "Cloudinary", np: "Cloudinary", jp: "Cloudinary" },
  auth: { en: "authentication", np: "प्रमाणीकरण", jp: "認証" },
  "next-auth": { en: "NextAuth", np: "NextAuth", jp: "NextAuth" },
  email: { en: "email", np: "इमेल", jp: "メール" },
  optimization: { en: "optimization", np: "अनुकूलन", jp: "最適化" },
  seo: { en: "SEO", np: "SEO", jp: "SEO" },
  deployment: { en: "deployment", np: "डिप्लोयमेन्ट", jp: "デプロイ" },
  vercel: { en: "Vercel", np: "Vercel", jp: "Vercel" },
  security: { en: "security", np: "सुरक्षा", jp: "セキュリティ" },
  "browser-security": { en: "browser security", np: "ब्राउजर सुरक्षा", jp: "ブラウザセキュリティ" },
  "server-security": { en: "server security", np: "सर्भर सुरक्षा", jp: "サーバーセキュリティ" },
  production: { en: "production", np: "प्रोडक्सन", jp: "本番" },
  "production-data": { en: "production data", np: "प्रोडक्सन डेटा", jp: "本番データ" },
  "server-actions": { en: "Server Actions", np: "सर्भर कार्यहरू", jp: "サーバーアクション" },
  forms: { en: "forms", np: "फारमहरू", jp: "フォーム" },
  "optimistic-ui": { en: "optimistic UI", np: "आशावादी UI", jp: "楽観的UI" },
  "route-handlers": { en: "Route Handlers", np: "रुट ह्यान्डलरहरू", jp: "ルートハンドラー" },
  "production-apis": { en: "production APIs", np: "प्रोडक्सन APIs", jp: "本番API" },
};

export function nextjsTags(slugs: [string, string]): RoadmapTag[] {
  return [
    { slug: slugs[0], label: NEXTJS_TAG[slugs[0]] ?? { en: slugs[0], np: slugs[0], jp: slugs[0] } },
    { slug: slugs[1], label: NEXTJS_TAG[slugs[1]] ?? { en: slugs[1], np: slugs[1], jp: slugs[1] } },
  ];
}

const NEXTJS_DAY_TITLE: Record<number, LocalizedString> = {
  0: {
    en: "Phase 0 — Before You Start",
    np: "Phase 0 — सुरु गर्नुअघि",
    jp: "Phase 0 — はじめる前に",
  },
  1: {
    en: "What Next.js Actually Is",
    np: "Next.js वास्तवमा के हो",
    jp: "Next.js とは何か",
  },
  2: {
    en: "App Router fundamentals",
    np: "App Router आधार",
    jp: "App Router 基礎",
  },
  3: {
    en: "Navigation & linking",
    np: "Navigation र linking",
    jp: "ナビゲーションとリンク",
  },
  4: {
    en: "Dynamic routes, route parameters & navigation patterns",
    np: "Dynamic routes, route parameters र navigation",
    jp: "動的ルート・ルートパラメータ・ナビゲーション",
  },
  5: {
    en: "Layouts, templates, loading & error UI",
    np: "Layouts, templates, loading र error UI",
    jp: "レイアウト・テンプレート・ローディング・エラーUI",
  },
  6: {
    en: "Server Components",
    np: "सर्भर कम्पोनेन्ट",
    jp: "サーバーコンポーネント",
  },
  7: {
    en: "Client Components",
    np: "क्लाइन्ट कम्पोनेन्ट",
    jp: "クライアントコンポーネント",
  },
  8: {
    en: "Server vs Client Architecture",
    np: "सर्भर बनाम क्लाइन्ट आर्किटेक्चर",
    jp: "サーバー対クライアントアーキテクチャ",
  },
  9: {
    en: "Rendering Strategies",
    np: "रेन्डरिङ रणनीतिहरू",
    jp: "レンダリング戦略",
  },
  10: {
    en: "Suspense and Streaming",
    np: "Suspense र Streaming",
    jp: "Suspense とストリーミング",
  },
  11: {
    en: "Fetching Data",
    np: "डेटा फेचिङ",
    jp: "データ取得",
  },
  12: {
    en: "Caching and Revalidation",
    np: "क्यासिङ र पुनः प्रमाणीकरण",
    jp: "キャッシュと再検証",
  },
  13: {
    en: "Data Fetching Patterns",
    np: "डेटा फेचिङ ढाँचाहरू",
    jp: "データ取得パターン",
  },
  14: {
    en: "Database Integration",
    np: "डेटाबेस एकीकरण",
    jp: "データベース統合",
  },
  15: {
    en: "Production Data Layer",
    np: "प्रोडक्सन डेटा तह",
    jp: "本番データレイヤー",
  },
  16: {
    en: "Server Actions",
    np: "सर्भर कार्यहरू",
    jp: "サーバーアクション",
  },
  17: { en: "Forms", np: "फारमहरू", jp: "フォーム" },
  18: { en: "Optimistic UI", np: "आशावादी UI", jp: "楽観的UI" },
  19: { en: "Route Handlers", np: "रुट ह्यान्डलरहरू", jp: "ルートハンドラー" },
  20: { en: "Building Production-Style APIs", np: "प्रोडक्सन-स्तरका APIs निर्माण", jp: "本番向けAPIの構築" },
  21: { en: "Authentication", np: "प्रमाणीकरण", jp: "認証" },
  23: { en: "Browser security — XSS, CSRF, cookies & redirects", np: "ब्राउजर सुरक्षा — XSS, CSRF, cookies र redirects", jp: "ブラウザセキュリティ — XSS・CSRF・Cookie・リダイレクト" },
  24: { en: "Server security — SQL injection, SSRF & data exposure", np: "सर्भर सुरक्षा — SQL injection, SSRF र data exposure", jp: "サーバーセキュリティ — SQLインジェクション・SSRF・データ漏えい" },
  25: { en: "Identity, permissions, secrets & dependencies", np: "पहिचान, अनुमति, secrets र dependencies", jp: "認証・権限・シークレット・依存関係" },
  26: { en: "Production security architecture build", np: "प्रोडक्सन सुरक्षा architecture build", jp: "本番セキュリティアーキテクチャ構築" },
};

const NEXTJS_EXISTING_COURSE_DAY_TITLE: Record<number, LocalizedString> = {
  7: { en: "What is Next.js, setup & your first app", np: "Next.js के हो, सेटअप र पहिलो एप", jp: "Next.js とは・セットアップ・最初のアプリ" },
  8: { en: "Server & Client Components, data fetching & rendering strategies", np: "Server/Client कम्पोनेन्ट, डेटा फेच र रेन्डरिङ", jp: "Server/Client コンポーネント・データ取得・レンダリング戦略" },
  9: { en: "Styling — Global CSS, CSS Modules, Tailwind & DaisyUI", np: "Styling — Global CSS, CSS Modules, Tailwind र DaisyUI", jp: "スタイル — Global CSS・CSS Modules・Tailwind・DaisyUI" },
  10: { en: "Routing deep dive — dynamic, catch-all, query params & layouts", np: "Routing — dynamic, catch-all, query params र layouts", jp: "ルーティング詳解 — 動的・キャッチオール・クエリ・レイアウト" },
  11: { en: "Navigation, loading UI, Not Found & error boundaries", np: "Navigation, loading UI, Not Found र error boundaries", jp: "ナビゲーション・ローディング・Not Found・エラー境界" },
  12: { en: "Building REST APIs with Route Handlers & Zod validation", np: "Route Handlers र Zod सहित REST API निर्माण", jp: "Route Handler と Zod で REST API を構築する" },
  13: { en: "Database integration with Prisma — models, migrations & CRUD", np: "Prisma सहित डेटाबेस — models, migrations र CRUD", jp: "Prisma でデータベース連携 —モデル・マイグレーション・CRUD" },
  14: { en: "Uploading files with Cloudinary", np: "Cloudinary सहित फाइल अपलोड", jp: "Cloudinary を使ったファイルアップロード" },
  15: { en: "Authentication with NextAuth — Google, credentials & session protection", np: "NextAuth — Google, credentials र session सुरक्षा", jp: "NextAuth 認証 — Google・認証情報・セッション保護" },
  16: { en: "Sending emails, image/font optimizations, SEO & lazy loading", np: "इमेल, image/font अनुकूलन, SEO र lazy loading", jp: "メール送信・画像/フォント最適化・SEO・遅延読み込み" },
  17: { en: "Deployment to Vercel — production prep, CI & troubleshooting", np: "Vercel मा Deployment — production, CI र troubleshooting", jp: "Vercel へのデプロイ — 本番準備・CI・トラブルシューティング" },
};

const NEXTJS_WEEK_TITLE: Record<string, LocalizedString> = {
  "nextjs-phase-1": {
    en: "PHASE 1 · NEXT.JS FOUNDATIONS (Days 1–5)",
    np: "PHASE 1 · NEXT.JS आधार (दिन १–५)",
    jp: "PHASE 1 · NEXT.JS 基礎（1〜5日目）",
  },
  "nextjs-phase-2": {
    en: "PHASE 2 · RENDERING & REACT SERVER COMPONENTS (Days 6–10)",
    np: "PHASE 2 · रेंडरिङ र React Server Components (दिन ६–१०)",
    jp: "PHASE 2 · レンダリングとReact Server Components（6〜10日目）",
  },
  "nextjs-phase-3": {
    en: "PHASE 3 · DATA FETCHING (Days 11–15)",
    np: "PHASE 3 · डेटा फेचिङ (दिन ११–१५)",
    jp: "PHASE 3 · データ取得（11〜15日目）",
  },
  "nextjs-phase-4": {
    en: "PHASE 4 · MUTATIONS AND FULL-STACK NEXT.JS (Days 16–20)",
    np: "PHASE 4 · परिवर्तन र Full-Stack Next.js (दिन १६–२०)",
    jp: "PHASE 4 · ミューテーションとフルスタックNext.js（16〜20日目）",
  },
  "nextjs-phase-5": {
    en: "PHASE 5 · AUTHENTICATION AND SECURITY (Days 21–25)",
    np: "PHASE 5 · प्रमाणीकरण र सुरक्षा (दिन २१–२५)",
    jp: "PHASE 5 · 認証とセキュリティ（21〜25日目）",
  },
  "nextjs-phase-0": {
    en: "Phase 0 · Preparation",
    np: "Phase 0 · तयारी",
    jp: "Phase 0 · 準備",
  },
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
  return NEXTJS_DAY_TITLE[day] ?? (day >= 12 ? NEXTJS_EXISTING_COURSE_DAY_TITLE[day - 5] : undefined) ?? { en: `Day ${day}`, np: `दिन ${day}`, jp: `Day ${day}` };
}

export function nextjsWeekTitle(weekId: string): LocalizedString {
  return NEXTJS_WEEK_TITLE[weekId] ?? { en: weekId, np: weekId, jp: weekId };
}
