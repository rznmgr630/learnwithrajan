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
  mail: { en: "mail", np: "मेल", jp: "メール" },
  advanced: { en: "extras", np: "अतिरिक्त", jp: "発展" },
  auth: { en: "authentication", np: "प्रमाणीकरण", jp: "認証" },
  authorization: { en: "authorization", np: "अधिकरण", jp: "認可" },
  api: { en: "API", np: "API", jp: "API" },
  resources: { en: "resources", np: "रिसोर्स", jp: "リソース" },
  queues: { en: "queues", np: "कतार", jp: "キュー" },
  events: { en: "events", np: "घटना", jp: "イベント" },
  caching: { en: "caching", np: "क्यासिङ", jp: "キャッシュ" },
  testing: { en: "testing", np: "परीक्षण", jp: "テスト" },
  pest: { en: "Pest", np: "Pest", jp: "Pest" },
};

export function laravelTags(slugs: [string, string]): RoadmapTag[] {
  return [
    { slug: slugs[0], label: LARAVEL_TAG[slugs[0]] ?? { en: slugs[0], np: slugs[0], jp: slugs[0] } },
    { slug: slugs[1], label: LARAVEL_TAG[slugs[1]] ?? { en: slugs[1], np: slugs[1], jp: slugs[1] } },
  ];
}

const LARAVEL_DAY_TITLE: Record<number, LocalizedString> = {
  1: {
    en: "MVC, Composer, install, project layout & Service Container",
    np: "MVC, Composer, स्थापना, परियोजना र Service Container",
    jp: "MVC・Composer・インストール・構成・サービスコンテナ",
  },
  2: {
    en: "Routes — verbs, parameters, names, groups & resource routes",
    np: "रूट — verbs, params, नाम, समूह र resource routes",
    jp: "ルート（HTTP・パラメータ・名前・グループ・リソース）",
  },
  3: {
    en: "Controllers, Form Requests, resource controllers & HTTP responses",
    np: "Controllers, Form Request, resource controller र responses",
    jp: "コントローラ・Form Request・リソースコントローラ・レスポンス",
  },
  4: {
    en: "Blade — inheritance, components, directives & includes",
    np: "Blade — inheritance, components, directive र include",
    jp: "Blade（継承・コンポーネント・ディレクティブ・インクルード）",
  },
  5: {
    en: "Validation — built-in rules, custom rules & Form Request classes",
    np: "Validation — नियम, custom rule र Form Request",
    jp: "バリデーション（組み込みルール・カスタム・Form Request）",
  },
  6: {
    en: "Middleware, Request object, responses & URL generation",
    np: "Middleware, Request, responses र URL generation",
    jp: "ミドルウェア・Request・レスポンス・URL 生成",
  },
  7: {
    en: "Migrations, Query Builder, Eloquent models & CRUD patterns",
    np: "Migrations, Query Builder, Eloquent र CRUD",
    jp: "マイグレーション・クエリビルダ・Eloquent・CRUD",
  },
  8: {
    en: "Session, flash data, caching & localization",
    np: "Session, flash, caching र localization",
    jp: "セッション・フラッシュ・キャッシュ・多言語",
  },
  9: {
    en: "Eloquent relationships, eager loading & soft deletes",
    np: "Eloquent relationships, eager loading र soft deletes",
    jp: "Eloquent リレーション・Eager load・ソフトデリート",
  },
  10: {
    en: "File storage, HTTP client, mail & Notifications",
    np: "File storage, HTTP client, mail र Notifications",
    jp: "ファイルストレージ・HTTP クライアント・メール・通知",
  },
  11: {
    en: "Authentication — Breeze, Sanctum & user registration",
    np: "Authentication — Breeze, Sanctum र user registration",
    jp: "認証 — Breeze・Sanctum・ユーザー登録",
  },
  12: {
    en: "Authorization — Gates, Policies & API Resources",
    np: "Authorization — Gates, Policies र API Resources",
    jp: "認可 — Gates・Policies・API リソース",
  },
  13: {
    en: "Queues, Jobs, Events, Listeners & Task Scheduling",
    np: "Queues, Jobs, Events, Listeners र Task Scheduling",
    jp: "キュー・ジョブ・イベント・リスナー・スケジューリング",
  },
  14: {
    en: "Testing with Pest — unit, feature, HTTP & database tests",
    np: "Pest सहित Testing — unit, feature, HTTP र database",
    jp: "Pest でテスト — ユニット・フィーチャー・HTTP・DB",
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
    jp: "バリデーションとミドルウェア",
  },
  "laravel-w4": {
    en: "Database layer",
    np: "डाटाबेस परत",
    jp: "データベース層",
  },
  "laravel-w5": {
    en: "Storage, mail & auth",
    np: "Storage, mail र auth",
    jp: "ストレージ・メール・認証",
  },
  "laravel-w6": {
    en: "Production — queues, APIs & testing",
    np: "उत्पादन — queues, APIs र testing",
    jp: "本番 — キュー・API・テスト",
  },
};

export function laravelDayTitle(day: number): LocalizedString {
  return LARAVEL_DAY_TITLE[day] ?? { en: `Day ${day}`, np: `दिन ${day}`, jp: `Day ${day}` };
}

export function laravelWeekTitle(weekId: string): LocalizedString {
  return LARAVEL_WEEK_TITLE[weekId] ?? { en: weekId, np: weekId, jp: weekId };
}
