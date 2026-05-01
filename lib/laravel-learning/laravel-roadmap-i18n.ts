import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapTag } from "@/lib/challenge-data";

const LARAVEL_TAG: Record<string, LocalizedString> = {
  foundation: { en: "foundation", np: "आधार", jp: "基礎" },
  tooling: { en: "tooling", np: "उपकरण", jp: "ツール" },
  routing: { en: "routing", np: "रूटिङ", jp: "ルーティング" },
  http: { en: "HTTP", np: "HTTP", jp: "HTTP" },
  controllers: { en: "controllers", np: "नियन्त्रक", jp: "コントローラ" },
  responses: { en: "responses", np: "प्रतिक्रिया", jp: "レスポンス" },
  blade: { en: "Blade", np: "Blade", jp: "Blade" },
  views: { en: "views", np: "दृश्य", jp: "ビュー" },
  validation: { en: "validation", np: "प्रमाणीकरण", jp: "バリデーション" },
  forms: { en: "forms", np: "फर्म", jp: "フォーム" },
  middleware: { en: "middleware", np: "मिडलवेयर", jp: "ミドルウェア" },
  requests: { en: "requests", np: "अनुरोध", jp: "リクエスト" },
  eloquent: { en: "Eloquent", np: "Eloquent", jp: "Eloquent" },
  database: { en: "database", np: "डाटाबेस", jp: "データベース" },
  session: { en: "session", np: "सत्र", jp: "セッション" },
  i18n: { en: "localization", np: "स्थानीयकरण", jp: "多言語" },
  relations: { en: "relationships", np: "सम्बन्ध", jp: "リレーション" },
  mail: { en: "mail & HTTP", np: "मेल र HTTP", jp: "メールとHTTP" },
  advanced: { en: "extras", np: "अतिरिक्त", jp: "発展" },
};

export function laravelTags(slugs: [string, string]): RoadmapTag[] {
  return [
    { slug: slugs[0], label: LARAVEL_TAG[slugs[0]] ?? { en: slugs[0], np: slugs[0], jp: slugs[0] } },
    { slug: slugs[1], label: LARAVEL_TAG[slugs[1]] ?? { en: slugs[1], np: slugs[1], jp: slugs[1] } },
  ];
}

const LARAVEL_DAY_TITLE: Record<number, LocalizedString> = {
  1: {
    en: "MVC, Composer, install & project layout",
    np: "MVC, Composer, स्थापना र परियोजना",
    jp: "MVC・Composer・インストールと構成",
  },
  2: {
    en: "Routes: verbs, parameters, names & groups",
    np: "रूट: verbs, प्यारामिटर, नाम र समूह",
    jp: "ルート（HTTP・パラメータ・名前・グループ）",
  },
  3: {
    en: "Controllers & HTTP responses",
    np: "नियन्त्रक र HTTP प्रतिक्रिया",
    jp: "コントローラとHTTPレスポンス",
  },
  4: {
    en: "Views, Blade, components & includes",
    np: "दृश्य, Blade, कम्पोनेन्ट र include",
    jp: "ビュー・Blade・コンポーネント",
  },
  5: {
    en: "Form validation, rules & custom rules",
    np: "फर्म प्रमाणीकरण र नियम",
    jp: "フォーム検証・ルール・カスタムルール",
  },
  6: {
    en: "Middleware, URLs & the Request object",
    np: "मिडलवेयर, URL र Request",
    jp: "ミドルウェア・URL・Request",
  },
  7: {
    en: "Query Builder, models & CRUD patterns",
    np: "Query Builder, मोडेल र CRUD",
    jp: "クエリビルダ・モデル・CRUD",
  },
  8: {
    en: "Session, flash data & localization",
    np: "सत्र, फ्ल्यास र स्थानीयकरण",
    jp: "セッション・フラッシュ・多言語",
  },
  9: {
    en: "Eloquent relationships & eager loading",
    np: "Eloquent सम्बन्ध र eager load",
    jp: "Eloquentリレーション・Eager load",
  },
  10: {
    en: "HTTP client, mail, stubs & next steps",
    np: "HTTP client, मेल, stub र अगाडि",
    jp: "HTTPクライアント・メール・stub・次の一歩",
  },
};

const LARAVEL_WEEK_TITLE: Record<string, LocalizedString> = {
  "laravel-w1": {
    en: "Foundation & routing",
    np: "आधार र रूटिङ",
    jp: "基礎とルーティング",
  },
  "laravel-w2": {
    en: "Controllers & Blade",
    np: "नियन्त्रक र Blade",
    jp: "コントローラとBlade",
  },
  "laravel-w3": {
    en: "Validation & middleware",
    np: "प्रमाणीकरण र मिडलवेयर",
    jp: "検証とミドルウェア",
  },
  "laravel-w4": {
    en: "Database & session",
    np: "डाटाबेस र सत्र",
    jp: "DBとセッション",
  },
  "laravel-w5": {
    en: "Relations, integrations & polish",
    np: "सम्बन्ध र एकीकरण",
    jp: "リレーションと連携",
  },
};

export function laravelDayTitle(day: number): LocalizedString {
  return LARAVEL_DAY_TITLE[day] ?? { en: `Day ${day}`, np: `दिन ${day}`, jp: `Day ${day}` };
}

export function laravelWeekTitle(weekId: string): LocalizedString {
  return LARAVEL_WEEK_TITLE[weekId] ?? { en: weekId, np: weekId, jp: weekId };
}
