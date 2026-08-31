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
  sanctum: { en: "Sanctum", np: "Sanctum", jp: "Sanctum" },
  "rest-api": { en: "REST API", np: "REST API", jp: "REST API" },
  "advanced-eloquent": { en: "advanced Eloquent", np: "Advanced Eloquent", jp: "高度なEloquent" },
  security: { en: "security", np: "सुरक्षा", jp: "セキュリティ" },
  artisan: { en: "Artisan", np: "Artisan", jp: "Artisan" },
  broadcasting: { en: "broadcasting", np: "Broadcasting", jp: "ブロードキャスト" },
  livewire: { en: "Livewire", np: "Livewire", jp: "Livewire" },
  inertia: { en: "Inertia.js", np: "Inertia.js", jp: "Inertia.js" },
  performance: { en: "performance", np: "प्रदर्शन", jp: "パフォーマンス" },
  redis: { en: "Redis", np: "Redis", jp: "Redis" },
  deployment: { en: "deployment", np: "Deployment", jp: "デプロイ" },
  devops: { en: "DevOps", np: "DevOps", jp: "DevOps" },
};

export function laravelTags(slugs: [string, string]): RoadmapTag[] {
  return [
    { slug: slugs[0], label: LARAVEL_TAG[slugs[0]] ?? { en: slugs[0], np: slugs[0], jp: slugs[0] } },
    { slug: slugs[1], label: LARAVEL_TAG[slugs[1]] ?? { en: slugs[1], np: slugs[1], jp: slugs[1] } },
  ];
}

const LARAVEL_DAY_TITLE: Record<number, LocalizedString> = {
  0: { en: "Phase 0 — Before You Start", np: "Phase 0 — सुरु गर्नुअघि", jp: "Phase 0 — はじめる前に" },
  1: { en: "Install and set up Laravel", np: "Laravel install र setup", jp: "Laravelの導入とセットアップ" },
  2: {
    en: "Directory structure, configuration & the Service Container",
    np: "Directory structure, configuration र Service Container",
    jp: "ディレクトリ構造・設定・サービスコンテナ",
  },
  3: {
    en: "Request lifecycle & the Service Container in depth",
    np: "Request lifecycle र Service Container गहिराइमा",
    jp: "リクエストライフサイクルとサービスコンテナ（詳細）",
  },
  4: {
    en: "Routing — verbs, parameters, names, groups & model binding",
    np: "Routing — verbs, params, नाम, समूह र model binding",
    jp: "ルーティング（HTTP・パラメータ・名前・グループ・モデル束縛）",
  },
  5: {
    en: "Middleware — the checkpoint between a request and your code",
    np: "Middleware — request र तपाईंको code बीचको checkpoint",
    jp: "ミドルウェア — リクエストとコードの間のチェックポイント",
  },
  6: {
    en: "Controllers, the Request object & responses",
    np: "Controllers, Request object र responses",
    jp: "コントローラ・リクエスト・レスポンス",
  },
  7: {
    en: "Views & Blade — layouts, components, slots & stacks",
    np: "Views र Blade — layouts, components, slots र stacks",
    jp: "ビューとBlade（レイアウト・コンポーネント・スロット・スタック）",
  },
  8: {
    en: "Validation — rules, Form Requests, custom rules & error display",
    np: "Validation — rules, Form Requests, custom rules र error display",
    jp: "バリデーション（ルール・Form Request・カスタムルール・エラー表示）",
  },
  9: {
    en: "Migrations, Query Builder, Eloquent models & CRUD patterns",
    np: "Migrations, Query Builder, Eloquent र CRUD",
    jp: "マイグレーション・クエリビルダ・Eloquent・CRUD",
  },
  10: {
    en: "Session, flash data, caching & localization",
    np: "Session, flash, caching र localization",
    jp: "セッション・フラッシュ・キャッシュ・多言語",
  },
  11: {
    en: "Eloquent relationships, eager loading & soft deletes",
    np: "Eloquent relationships, eager loading र soft deletes",
    jp: "Eloquent リレーション・Eager load・ソフトデリート",
  },
  12: {
    en: "File storage, HTTP client, mail & Notifications",
    np: "File storage, HTTP client, mail र Notifications",
    jp: "ファイルストレージ・HTTP クライアント・メール・通知",
  },
  13: {
    en: "Authentication — Breeze, Sanctum & user registration",
    np: "Authentication — Breeze, Sanctum र user registration",
    jp: "認証 — Breeze・Sanctum・ユーザー登録",
  },
  14: {
    en: "Authorization — Gates, Policies & API Resources",
    np: "Authorization — Gates, Policies र API Resources",
    jp: "認可 — Gates・Policies・API リソース",
  },
  15: {
    en: "Queues, Jobs, Events, Listeners & Task Scheduling",
    np: "Queues, Jobs, Events, Listeners र Task Scheduling",
    jp: "キュー・ジョブ・イベント・リスナー・スケジューリング",
  },
  16: {
    en: "Testing with Pest — unit, feature, HTTP & database tests",
    np: "Pest सहित Testing — unit, feature, HTTP र database",
    jp: "Pest でテスト — ユニット・フィーチャー・HTTP・DB",
  },
  17: {
    en: "Sanctum REST API — auth endpoints & full CRUD",
    np: "Sanctum REST API — auth endpoints र full CRUD",
    jp: "Sanctum REST API — 認証エンドポイントと全CRUD",
  },
  18: {
    en: "Advanced Eloquent — accessors, mutators, casts, scopes & polymorphic relations",
    np: "Advanced Eloquent — accessors, mutators, casts, scopes र polymorphic",
    jp: "高度なEloquent — アクセサ・キャスト・スコープ・ポリモーフィック",
  },
  19: {
    en: "Security — rate limiting, CSRF, XSS, SQL injection & headers",
    np: "Security — rate limiting, CSRF, XSS, SQL injection र headers",
    jp: "セキュリティ — レート制限・CSRF・XSS・SQLインジェクション",
  },
  20: {
    en: "Custom Artisan commands — arguments, options & console I/O",
    np: "Custom Artisan commands — arguments, options र console I/O",
    jp: "カスタム Artisan コマンド — 引数・オプション・I/O",
  },
  21: {
    en: "Real-time features — Broadcasting, WebSockets, Echo & Reverb",
    np: "Real-time — Broadcasting, WebSockets, Echo र Reverb",
    jp: "リアルタイム — ブロードキャスト・WebSocket・Echo・Reverb",
  },
  22: {
    en: "Frontend integration — Livewire, Inertia.js & Vite",
    np: "Frontend — Livewire, Inertia.js र Vite",
    jp: "フロントエンド統合 — Livewire・Inertia.js・Vite",
  },
  23: {
    en: "Performance — query optimization, N+1, Redis & queue scaling",
    np: "Performance — query optimization, N+1, Redis र queue scaling",
    jp: "パフォーマンス — クエリ最適化・N+1・Redis・キュースケーリング",
  },
  24: {
    en: "Deployment — Docker, Forge, Vapor, CI/CD & environment config",
    np: "Deployment — Docker, Forge, Vapor, CI/CD र env config",
    jp: "デプロイ — Docker・Forge・Vapor・CI/CD・環境設定",
  },
};

const LARAVEL_WEEK_TITLE: Record<string, LocalizedString> = {
  "laravel-w0": { en: "Phase 0 · Preparation", np: "Phase 0 · तयारी", jp: "Phase 0 · 準備" },
  "laravel-w1": {
    en: "Foundations",
    np: "आधार",
    jp: "基礎",
  },
  "laravel-w1b": {
    en: "Phase 2 · The Basics",
    np: "Phase 2 · आधारभूत",
    jp: "Phase 2 · 基本",
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
  "laravel-w7": {
    en: "Advanced features",
    np: "Advanced features",
    jp: "高度な機能",
  },
  "laravel-w8": {
    en: "Frontend & deployment",
    np: "Frontend र Deployment",
    jp: "フロントエンドとデプロイ",
  },
};

export function laravelDayTitle(day: number): LocalizedString {
  return LARAVEL_DAY_TITLE[day] ?? { en: `Day ${day}`, np: `दिन ${day}`, jp: `Day ${day}` };
}

export function laravelWeekTitle(weekId: string): LocalizedString {
  return LARAVEL_WEEK_TITLE[weekId] ?? { en: weekId, np: weekId, jp: weekId };
}
