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
  cookies: { en: "cookies", np: "कुकीज", jp: "クッキー" },
  errors: { en: "errors", np: "त्रुटि", jp: "エラー" },
  logging: { en: "logging", np: "लगिङ", jp: "ロギング" },
  transactions: { en: "transactions", np: "ट्रान्जेक्शन", jp: "トランザクション" },
  pagination: { en: "pagination", np: "पेजिनेसन", jp: "ページネーション" },
  factories: { en: "factories", np: "Factories", jp: "ファクトリ" },
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
    en: "Service Providers & Facades",
    np: "Service Providers र Facades",
    jp: "サービスプロバイダとファサード",
  },
  5: {
    en: "Routing & URL generation — verbs, parameters, names, groups & model binding",
    np: "Routing र URL generation — verbs, params, नाम, समूह र model binding",
    jp: "ルーティングとURL生成（HTTP・パラメータ・名前・グループ・モデル束縛）",
  },
  6: {
    en: "Middleware — the checkpoint between a request and your code",
    np: "Middleware — request र तपाईंको code बीचको checkpoint",
    jp: "ミドルウェア — リクエストとコードの間のチェックポイント",
  },
  7: {
    en: "Controllers, the Request object & responses",
    np: "Controllers, Request object र responses",
    jp: "コントローラ・リクエスト・レスポンス",
  },
  8: {
    en: "Views & Blade — layouts, components, slots & stacks",
    np: "Views र Blade — layouts, components, slots र stacks",
    jp: "ビューとBlade（レイアウト・コンポーネント・スロット・スタック）",
  },
  9: {
    en: "Validation — rules, Form Requests, custom rules & error display",
    np: "Validation — rules, Form Requests, custom rules र error display",
    jp: "バリデーション（ルール・Form Request・カスタムルール・エラー表示）",
  },
  10: {
    en: "Session, flash data & cookies",
    np: "Session, flash data र cookies",
    jp: "セッション・フラッシュデータ・クッキー",
  },
  11: {
    en: "Error handling & logging",
    np: "Error handling र logging",
    jp: "エラー処理とロギング",
  },
  12: {
    en: "Database connections, raw queries & transactions",
    np: "Database connections, raw queries र transactions",
    jp: "データベース接続・生クエリ・トランザクション",
  },
  13: {
    en: "Query Builder & pagination",
    np: "Query Builder र pagination",
    jp: "クエリビルダとページネーション",
  },
  14: {
    en: "Eloquent basics — models, CRUD, soft deletes & events",
    np: "Eloquent basics — models, CRUD, soft deletes र events",
    jp: "Eloquent 基礎 — モデル・CRUD・ソフトデリート・イベント",
  },
  15: {
    en: "Eloquent relationships, eager loading & the N+1 problem",
    np: "Eloquent relationships, eager loading र N+1 problem",
    jp: "Eloquent リレーション・Eager load・N+1 問題",
  },
  16: {
    en: "Advanced Eloquent — casts, scopes, API Resources & JSON:API",
    np: "Advanced Eloquent — casts, scopes, API Resources र JSON:API",
    jp: "高度なEloquent — キャスト・スコープ・API リソース・JSON:API",
  },
  17: {
    en: "Model factories & database seeding",
    np: "Model factories र database seeding",
    jp: "モデルファクトリとデータベースシーディング",
  },
  18: {
    en: "Caching & localization",
    np: "Caching र localization",
    jp: "キャッシュと多言語",
  },
  19: {
    en: "Authentication — guards, sessions, hashing & password resets",
    np: "Authentication — guards, sessions, hashing र password resets",
    jp: "認証 — ガード・セッション・ハッシュ・パスワードリセット",
  },
  20: {
    en: "Authorization — Gates, Policies & the #[Authorize] attribute",
    np: "Authorization — Gates, Policies र #[Authorize] attribute",
    jp: "認可 — Gate・Policy・#[Authorize] 属性",
  },
  21: {
    en: "File storage, HTTP client, mail & Notifications",
    np: "File storage, HTTP client, mail र Notifications",
    jp: "ファイルストレージ・HTTP クライアント・メール・通知",
  },
  22: {
    en: "Authentication — Breeze, Sanctum & user registration",
    np: "Authentication — Breeze, Sanctum र user registration",
    jp: "認証 — Breeze・Sanctum・ユーザー登録",
  },
  23: {
    en: "Authorization — Gates, Policies & API Resources",
    np: "Authorization — Gates, Policies र API Resources",
    jp: "認可 — Gates・Policies・API リソース",
  },
  24: {
    en: "Queues, Jobs, Events, Listeners & Task Scheduling",
    np: "Queues, Jobs, Events, Listeners र Task Scheduling",
    jp: "キュー・ジョブ・イベント・リスナー・スケジューリング",
  },
  25: {
    en: "Testing with Pest — unit, feature, HTTP & database tests",
    np: "Pest सहित Testing — unit, feature, HTTP र database",
    jp: "Pest でテスト — ユニット・フィーチャー・HTTP・DB",
  },
  26: {
    en: "Sanctum REST API — auth endpoints & full CRUD",
    np: "Sanctum REST API — auth endpoints र full CRUD",
    jp: "Sanctum REST API — 認証エンドポイントと全CRUD",
  },
  27: {
    en: "Advanced Eloquent — accessors, mutators, casts, scopes & polymorphic relations",
    np: "Advanced Eloquent — accessors, mutators, casts, scopes र polymorphic",
    jp: "高度なEloquent — アクセサ・キャスト・スコープ・ポリモーフィック",
  },
  28: {
    en: "Security — rate limiting, CSRF, XSS, SQL injection & headers",
    np: "Security — rate limiting, CSRF, XSS, SQL injection र headers",
    jp: "セキュリティ — レート制限・CSRF・XSS・SQLインジェクション",
  },
  29: {
    en: "Custom Artisan commands — arguments, options & console I/O",
    np: "Custom Artisan commands — arguments, options र console I/O",
    jp: "カスタム Artisan コマンド — 引数・オプション・I/O",
  },
  30: {
    en: "Real-time features — Broadcasting, WebSockets, Echo & Reverb",
    np: "Real-time — Broadcasting, WebSockets, Echo र Reverb",
    jp: "リアルタイム — ブロードキャスト・WebSocket・Echo・Reverb",
  },
  31: {
    en: "Frontend integration — Livewire, Inertia.js & Vite",
    np: "Frontend — Livewire, Inertia.js र Vite",
    jp: "フロントエンド統合 — Livewire・Inertia.js・Vite",
  },
  32: {
    en: "Performance — query optimization, N+1, Redis & queue scaling",
    np: "Performance — query optimization, N+1, Redis र queue scaling",
    jp: "パフォーマンス — クエリ最適化・N+1・Redis・キュースケーリング",
  },
  33: {
    en: "Deployment — Docker, Forge, Vapor, CI/CD & environment config",
    np: "Deployment — Docker, Forge, Vapor, CI/CD र env config",
    jp: "デプロイ — Docker・Forge・Vapor・CI/CD・環境設定",
  },
};

const LARAVEL_WEEK_TITLE: Record<string, LocalizedString> = {
  "laravel-w0": { en: "Phase 0 · Preparation", np: "Phase 0 · तयारी", jp: "Phase 0 · 準備" },
  "laravel-w1": {
    en: "Foundations (Days 1–4)",
    np: "आधार (दिन 1–4)",
    jp: "基礎（Day 1–4）",
  },
  "laravel-w1b": {
    en: "Phase 2 · The Basics (Days 5–11)",
    np: "Phase 2 · आधारभूत (दिन 5–11)",
    jp: "Phase 2 · 基本（Day 5–11）",
  },
  "laravel-w4": {
    en: "Phase 3 · Database and Eloquent (Days 12–17)",
    np: "Phase 3 · Database र Eloquent (दिन 12–17)",
    jp: "Phase 3 · データベースとEloquent（Day 12–17）",
  },
  "laravel-w5": {
    en: "Phase 4 · Security (Days 19–22)",
    np: "Phase 4 · Security (दिन 19–22)",
    jp: "Phase 4 · セキュリティ（Day 19–22）",
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
