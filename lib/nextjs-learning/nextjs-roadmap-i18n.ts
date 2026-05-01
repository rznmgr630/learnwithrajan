import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapTag } from "@/lib/challenge-data";

const NEXTJS_TAG: Record<string, LocalizedString> = {
  intro: { en: "intro", np: "परिचय", jp: "イントロ" },
  appRouter: { en: "App Router", np: "App Router", jp: "App Router" },
  routing: { en: "routing", np: "रूटिङ", jp: "ルーティング" },
  conventions: { en: "conventions", np: "रूपरेखा", jp: "規約" },
  layouts: { en: "layouts", np: "लेआउट", jp: "レイアウト" },
  metadata: { en: "metadata & SEO", np: "मेटाडेटा", jp: "メタデータ" },
  navigation: { en: "navigation", np: "नेभिगेशन", jp: "ナビ" },
  ux: { en: "loading & UX", np: "लोडिङ", jp: "ローディング" },
  errors: { en: "errors", np: "त्रुटि", jp: "エラー" },
  advanced: { en: "parallel routes", np: "समानान्तर", jp: "並列ルート" },
  api: { en: "Route Handlers", np: "Route Handler", jp: "ルートハンドラ" },
  data: { en: "data & cache", np: "डाटा", jp: "データ" },
  edge: { en: "middleware & RSC", np: "middleware", jp: "ミドルウェア" },
};

export function nextjsTags(slugs: [string, string]): RoadmapTag[] {
  return [
    { slug: slugs[0], label: NEXTJS_TAG[slugs[0]] ?? { en: slugs[0], np: slugs[0], jp: slugs[0] } },
    { slug: slugs[1], label: NEXTJS_TAG[slugs[1]] ?? { en: slugs[1], np: slugs[1], jp: slugs[1] } },
  ];
}

const NEXTJS_DAY_TITLE: Record<number, LocalizedString> = {
  1: {
    en: "What is Next.js 15 & why use it",
    np: "Next.js 15 के हो र किन",
    jp: "Next.js 15 とは・なぜ使うか",
  },
  2: {
    en: "App Router: segments, dynamic & catch-all routes",
    np: "App Router: गतिशील र catch-all रूट",
    jp: "App Router・動的／キャッチオール",
  },
  3: {
    en: "Private folders, route groups & project shape",
    np: "निजी फोल्डर र रूट समूह",
    jp: "プライベートフォルダとルートグループ",
  },
  4: {
    en: "Layouts & the Metadata API",
    np: "लेआउट र Metadata API",
    jp: "レイアウトと Metadata API",
  },
  5: {
    en: "Link, router navigation & templates",
    np: "Link, नेभिगेशन र टेम्प्लेट",
    jp: "Link・ナビ・template",
  },
  6: {
    en: "loading.tsx, Suspense & streaming",
    np: "loading, Suspense र streaming",
    jp: "loading・Suspense・ストリーミング",
  },
  7: {
    en: "error.tsx & error boundaries",
    np: "error.tsx र boundary",
    jp: "error.tsx とエラー境界",
  },
  8: {
    en: "Parallel routes & named slots",
    np: "समानान्तर रूट र slot",
    jp: "並列ルートとスロット",
  },
  9: {
    en: "Route Handlers, cookies & caching",
    np: "Route Handler, cookie र cache",
    jp: "Route Handler・Cookie・キャッシュ",
  },
  10: {
    en: "Middleware, RSC vs Client & fetch caching",
    np: "Middleware, RSC/Client र fetch",
    jp: "ミドルウェア・RSC/Client・fetch",
  },
};

const NEXTJS_WEEK_TITLE: Record<string, LocalizedString> = {
  "nextjs-w1": {
    en: "Foundation & routing",
    np: "आधार र रूटिङ",
    jp: "基礎とルーティング",
  },
  "nextjs-w2": {
    en: "Structure & SEO shell",
    np: "संरचना र SEO",
    jp: "構成とSEOシェル",
  },
  "nextjs-w3": {
    en: "Navigation & UX surfaces",
    np: "नेभिगेशन र UX",
    jp: "ナビとUX",
  },
  "nextjs-w4": {
    en: "Advanced routing & APIs",
    np: "उन्नत रूट र API",
    jp: "応用ルートとAPI",
  },
  "nextjs-w5": {
    en: "Edge, data layer & rendering model",
    np: "Edge र डाटा परत",
    jp: "エッジ・データ層",
  },
};

export function nextjsDayTitle(day: number): LocalizedString {
  return NEXTJS_DAY_TITLE[day] ?? { en: `Day ${day}`, np: `दिन ${day}`, jp: `Day ${day}` };
}

export function nextjsWeekTitle(weekId: string): LocalizedString {
  return NEXTJS_WEEK_TITLE[weekId] ?? { en: weekId, np: weekId, jp: weekId };
}
