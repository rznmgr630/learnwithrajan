import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapTag } from "@/lib/challenge-data";

const NODEJS_TAG: Record<string, LocalizedString> = {
  prereq: { en: "prerequisites", np: "पूर्वतयारी", jp: "前提知識" },
  js: { en: "JavaScript", np: "JavaScript", jp: "JavaScript" },
  typescript: { en: "TypeScript", np: "TypeScript", jp: "TypeScript" },
  tooling: { en: "tooling", np: "उपकरण", jp: "ツール" },
  files: { en: "filesystem", np: "फाइल प्रणाली", jp: "ファイルシステム" },
  binary: { en: "binary", np: "बाइनरी", jp: "バイナリ" },
  streams: { en: "streams", np: "स्ट्रिम", jp: "ストリーム" },
  process: { en: "processes", np: "प्रोसेस", jp: "プロセス" },
  events: { en: "events", np: "इभेन्ट", jp: "イベント" },
  fundamentals: { en: "fundamentals", np: "आधार", jp: "基礎" },
  runtime: { en: "runtime", np: "रनटाइम", jp: "ランタイム" },
  modules: { en: "modules", np: "मोड्युल", jp: "モジュール" },
  core: { en: "core APIs", np: "कोर API", jp: "コアAPI" },
  npm: { en: "npm", np: "npm", jp: "npm" },
  fastify: { en: "Fastify", np: "Fastify", jp: "Fastify" },
  database: { en: "databases", np: "डाटाबेस", jp: "データベース" },
  sql: { en: "SQL", np: "SQL", jp: "SQL" },
  config: { en: "configuration", np: "विन्यास", jp: "設定" },
  observability: { en: "observability", np: "अवलोकनीयता", jp: "オブザーバビリティ" },
  caching: { en: "caching", np: "क्यासिङ", jp: "キャッシュ" },
  redis: { en: "Redis", np: "Redis", jp: "Redis" },
  jobs: { en: "background jobs", np: "पृष्ठभूमि काम", jp: "バックグラウンドジョブ" },
  realtime: { en: "real time", np: "रियल टाइम", jp: "リアルタイム" },
  performance: { en: "performance", np: "प्रदर्शन", jp: "パフォーマンス" },
  docker: { en: "Docker", np: "Docker", jp: "Docker" },
  semver: { en: "semver", np: "semver", jp: "セマバ" },
  express: { en: "Express", np: "Express", jp: "Express" },
  http: { en: "HTTP API", np: "HTTP API", jp: "HTTP API" },
  async: { en: "async JS", np: "async JS", jp: "非同期JS" },
  mongo: { en: "MongoDB", np: "MongoDB", jp: "MongoDB" },
  mongoose: { en: "Mongoose", np: "Mongoose", jp: "Mongoose" },
  validation: { en: "validation", np: "प्रमाणीकरण", jp: "バリデーション" },
  relations: { en: "relations", np: "सम्बन्ध", jp: "リレーション" },
  auth: { en: "auth", np: "प्रमाणीकरण", jp: "認証" },
  jwt: { en: "JWT", np: "JWT", jp: "JWT" },
  errors: { en: "errors", np: "त्रुटि", jp: "エラー" },
  testing: { en: "testing", np: "परीक्षण", jp: "テスト" },
  integration: { en: "integration tests", np: "इन्टिग्रेशन", jp: "結合テスト" },
  deploy: { en: "deploy", np: "डिप्लोइ", jp: "デプロイ" },
  ci: { en: "CI/CD", np: "CI/CD", jp: "CI/CD" },
  architecture: { en: "architecture", np: "आर्किटेक्चर", jp: "アーキテクチャ" },
  upgrade: { en: "upgrades", np: "अपग्रेड", jp: "アップグレード" },
  atlas: { en: "Atlas / hosting", np: "Atlas / होस्टिङ", jp: "Atlas・ホスティング" },
};

export function nodejsTags(slugs: [string, string]): RoadmapTag[] {
  return [
    { slug: slugs[0], label: NODEJS_TAG[slugs[0]] ?? { en: slugs[0], np: slugs[0], jp: slugs[0] } },
    { slug: slugs[1], label: NODEJS_TAG[slugs[1]] ?? { en: slugs[1], np: slugs[1], jp: slugs[1] } },
  ];
}

const NODEJS_DAY_TITLE: Record<number, LocalizedString> = {
  0: {
    en: "Phase 0 — Before you start (JavaScript, web & tooling prerequisites)",
    np: "Phase 0 — सुरु गर्नुअघि (JavaScript, वेब र उपकरण पूर्वतयारी)",
    jp: "Phase 0 — はじめる前に（JavaScript・Web・ツールの前提知識）",
  },
  1: {
    en: "Install, run & understand the shape of a Node.js project",
    np: "स्थापना, सञ्चालन र Node.js परियोजनाको बनोट",
    jp: "インストール・実行・Node.js プロジェクトの形",
  },
  2: {
    en: "Modules — ESM vs CommonJS, resolution & package entry points",
    np: "मोड्युल — ESM बनाम CommonJS, रिजोल्युसन र entry point",
    jp: "モジュール — ESM と CommonJS・解決・エントリポイント",
  },
  3: {
    en: "The event loop & async — phases, microtasks & concurrency",
    np: "इभेन्ट लूप र async — फेज, microtask र concurrency",
    jp: "イベントループと非同期 — フェーズ・マイクロタスク・並行処理",
  },
  4: {
    en: "Errors, process & lifecycle — crashing well and shutting down cleanly",
    np: "त्रुटि, प्रोसेस र जीवनचक्र — सुरक्षित क्र्यास र सफा बन्द",
    jp: "エラー・プロセス・ライフサイクル — 安全なクラッシュと停止",
  },
  5: {
    en: "TypeScript in Node — type stripping, tsconfig & build choices",
    np: "Node मा TypeScript — type stripping, tsconfig र बिल्ड छनोट",
    jp: "Node の TypeScript — 型除去・tsconfig・ビルド方針",
  },
  6: {
    en: "Files & paths — fs/promises, node:path & traversal safety",
    np: "फाइल र पथ — fs/promises, node:path र traversal सुरक्षा",
    jp: "ファイルとパス — fs/promises・node:path・traversal 対策",
  },
  7: {
    en: "Buffers, binary data & encodings",
    np: "Buffer, बाइनरी डाटा र encoding",
    jp: "Buffer・バイナリ・エンコーディング",
  },
  8: {
    en: "Streams — backpressure, pipeline & transforms",
    np: "Stream — backpressure, pipeline र transform",
    jp: "ストリーム — バックプレッシャー・pipeline・変換",
  },
  9: {
    en: "Events & the EventEmitter — on, once, off & async iteration",
    np: "इभेन्ट र EventEmitter — on, once, off र async iteration",
    jp: "イベントと EventEmitter — on・once・off・非同期反復",
  },
  10: {
    en: "HTTP without a framework — node:http, routing & fetch",
    np: "फ्रेमवर्क बिना HTTP — node:http, रुटिङ र fetch",
    jp: "フレームワークなしの HTTP — node:http・ルーティング・fetch",
  },
  11: {
    en: "Child processes, workers & the shell",
    np: "चाइल्ड प्रोसेस, worker र shell",
    jp: "子プロセス・ワーカー・シェル",
  },
  12: {
    en: "npm, packages & dependency hygiene",
    np: "npm, प्याकेज र निर्भरता स्वच्छता",
    jp: "npm・パッケージ・依存関係の衛生",
  },
  13: {
    en: "Testing — node:test, mocking & the test pyramid",
    np: "परीक्षण — node:test, mocking र test pyramid",
    jp: "テスト — node:test・モック・テストピラミッド",
  },
  14: {
    en: "Debugging, linting & code quality",
    np: "डिबगिङ, लिन्टिङ र कोड गुणस्तर",
    jp: "デバッグ・リント・コード品質",
  },
  15: {
    en: "Picking a framework & Fastify basics",
    np: "फ्रेमवर्क छनोट र Fastify आधार",
    jp: "フレームワーク選定と Fastify の基礎",
  },
  16: {
    en: "Validation & serialization — one schema, three jobs",
    np: "प्रमाणीकरण र serialization — एक schema, तीन काम",
    jp: "バリデーションとシリアライズ — 1つのスキーマ、3つの役割",
  },
  17: {
    en: "Databases & the query layer — pools, Drizzle, transactions & N+1",
    np: "डाटाबेस र query layer — pool, Drizzle, लेनदेन र N+1",
    jp: "データベースとクエリ層 — プール・Drizzle・トランザクション・N+1",
  },
  18: {
    en: "Authentication — passwords, sessions, JWT & refresh rotation",
    np: "प्रमाणीकरण — पासवर्ड, session, JWT र refresh rotation",
    jp: "認証 — パスワード・セッション・JWT・リフレッシュ回転",
  },
  19: {
    en: "Authorization & API security — RBAC, IDOR, injection & limits",
    np: "अधिकार र API सुरक्षा — RBAC, IDOR, injection र सीमा",
    jp: "認可と API セキュリティ — RBAC・IDOR・インジェクション・上限",
  },
  20: {
    en: "Configuration & environment — env files, validation & flags",
    np: "विन्यास र वातावरण — env फाइल, प्रमाणीकरण र flag",
    jp: "設定と環境 — env ファイル・検証・フィーチャーフラグ",
  },
  21: {
    en: "Logging & observability — Pino, traces, metrics & health",
    np: "लगिङ र अवलोकनीयता — Pino, trace, metric र health",
    jp: "ログとオブザーバビリティ — Pino・トレース・メトリクス・ヘルス",
  },
  22: {
    en: "Error handling in a real application — contracts, retries & idempotency",
    np: "वास्तविक अनुप्रयोगमा त्रुटि प्रबन्ध — contract, retry र idempotency",
    jp: "実アプリのエラー処理 — 契約・リトライ・冪等性",
  },
  23: {
    en: "Caching & Redis — cache-aside, stampedes, invalidation & HTTP caching",
    np: "क्यासिङ र Redis — cache-aside, stampede, invalidation र HTTP cache",
    jp: "キャッシュと Redis — cache-aside・スタンピード・無効化・HTTP キャッシュ",
  },
  24: {
    en: "Background jobs & scheduling — queues, retries, DLQ & workers",
    np: "पृष्ठभूमि काम र तालिका — queue, retry, DLQ र worker",
    jp: "バックグラウンドジョブとスケジューリング — キュー・リトライ・DLQ・ワーカー",
  },
  25: {
    en: "Real time — SSE, WebSockets, heartbeats & scaling with pub/sub",
    np: "रियल टाइम — SSE, WebSocket, heartbeat र pub/sub स्केलिङ",
    jp: "リアルタイム — SSE・WebSocket・ハートビート・pub/sub でのスケール",
  },
  26: {
    en: "Performance — measuring, profiling, percentiles & bottlenecks",
    np: "प्रदर्शन — मापन, profiling, percentile र bottleneck",
    jp: "パフォーマンス — 計測・プロファイリング・パーセンタイル・ボトルネック",
  },
  27: {
    en: "Docker & containers — images, layers, non-root & signals",
    np: "Docker र container — image, layer, non-root र signal",
    jp: "Docker とコンテナ — イメージ・レイヤー・非 root・シグナル",
  },
  28: { en: "Deployment & CI/CD — pipelines, zero downtime & migrations", np: "Deployment & CI/CD — pipelines, zero downtime & migrations", jp: "Deployment & CI/CD — pipelines, zero downtime & migrations" },
  29: { en: "Architecture — layers, boundaries & testable business logic", np: "Architecture — layers, boundaries & testable business logic", jp: "Architecture — layers, boundaries & testable business logic" },
  30: { en: "Node upgrades — Temporal, deprecations & pinning your version", np: "Node upgrades — Temporal, deprecations & pinning your version", jp: "Node upgrades — Temporal, deprecations & pinning your version" },
  31: {
    en: "Data validation — schemas, validators & persistence projects",
    np: "डाटा प्रमाणीकरण — schema, validators र persistence",
    jp: "データ検証 — スキーマ・バリデータ・永続化プロジェクト",
  },
  32: {
    en: "Modelling relationships — refs, embed, population & transactions",
    np: "सम्बन्ध मोडेलिङ — ref, embed, population र लेनदेन",
    jp: "関連モデリング — 参照・埋め込み・populate・トランザクション",
  },
  33: {
    en: "Authentication & authorization — users, JWT & roles",
    np: "प्रमाणीकरण र अधिकार — प्रयोगकर्ता, JWT र भूमिका",
    jp: "認証・認可 — ユーザー・JWT・ロール",
  },
  34: {
    en: "Errors, logging & extracting routes / services",
    np: "त्रुटि, लगिङ र रूट/सेवा अलग गर्नु",
    jp: "エラー・ログ・ルートとサービスの分割",
  },
  35: {
    en: "Unit tests, integration tests & test-driven habits",
    np: "युनिट, इन्टिग्रेशन परीक्षण र TDD",
    jp: "単体・結合テストと TDD の習慣",
  },
  36: {
    en: "Deployment, MongoDB Atlas & what to learn next",
    np: "डिप्लोइ, Atlas र अगाडि के सिक्ने",
    jp: "デプロイ・Atlas・次に学ぶこと",
  },
};

const NODEJS_WEEK_TITLE: Record<string, LocalizedString> = {
  "nodejs-w0": { en: "Before you start", np: "सुरु गर्नुअघि", jp: "はじめる前に" },
  "nodejs-w1": { en: "Phase 1 · The runtime", np: "Phase 1 · रनटाइम", jp: "Phase 1 · ランタイム" },
  "nodejs-p2": { en: "Phase 2 · The standard library", np: "Phase 2 · स्टान्डर्ड लाइब्रेरी", jp: "Phase 2 · 標準ライブラリ" },
  "nodejs-p3": { en: "Phase 3 · Tooling", np: "Phase 3 · उपकरण", jp: "Phase 3 · ツール" },
  "nodejs-p4": { en: "Phase 4 · Building an API", np: "Phase 4 · API निर्माण", jp: "Phase 4 · API の構築" },
  "nodejs-p5": { en: "Phase 5 · Production concerns", np: "Phase 5 · उत्पादन सरोकार", jp: "Phase 5 · 本番運用の関心事" },
  "nodejs-p6": { en: "Phase 6 · Performance and deployment", np: "Phase 6 · प्रदर्शन र डिप्लोइ", jp: "Phase 6 · パフォーマンスとデプロイ" },
  "nodejs-w5": { en: "Validation & relationships", np: "प्रमाणीकरण र सम्बन्ध", jp: "検証とリレーション" },
  "nodejs-w6": { en: "Authentication & error handling", np: "प्रमाणीकरण र त्रुटि प्रबन्ध", jp: "認証とエラー処理" },
  "nodejs-w7": { en: "Ship to production", np: "उत्पादनमा पठाउनु", jp: "本番リリース" },
};

export function nodejsDayTitle(day: number): LocalizedString {
  return NODEJS_DAY_TITLE[day] ?? { en: `Day ${day}`, np: `दिन ${day}`, jp: `Day ${day}` };
}

export function nodejsWeekTitle(weekId: string): LocalizedString {
  return NODEJS_WEEK_TITLE[weekId] ?? { en: weekId, np: weekId, jp: weekId };
}
