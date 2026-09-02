import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapTag } from "@/lib/challenge-data";

const NODEJS_TAG: Record<string, LocalizedString> = {
  prereq: { en: "prerequisites", np: "पूर्वतयारी", jp: "前提知識" },
  js: { en: "JavaScript", np: "JavaScript", jp: "JavaScript" },
  typescript: { en: "TypeScript", np: "TypeScript", jp: "TypeScript" },
  tooling: { en: "tooling", np: "उपकरण", jp: "ツール" },
  fundamentals: { en: "fundamentals", np: "आधार", jp: "基礎" },
  runtime: { en: "runtime", np: "रनटाइम", jp: "ランタイム" },
  modules: { en: "modules", np: "मोड्युल", jp: "モジュール" },
  core: { en: "core APIs", np: "कोर API", jp: "コアAPI" },
  npm: { en: "npm", np: "npm", jp: "npm" },
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
    en: "Global object, CommonJS modules, Path & OS",
    np: "ग्लोबल वस्तु, मोड्युल, Path र OS",
    jp: "グローバル・CommonJS・path・os",
  },
  7: {
    en: "File system, Events, EventEmitter & HTTP module",
    np: "फाइल प्रणाली, इभेन्ट, EventEmitter र HTTP",
    jp: "fs・イベント・EventEmitter・http",
  },
  8: {
    en: "npm — package.json, semver, publishing & globals",
    np: "npm — package.json, semver, प्रकाशन र ग्लोबल",
    jp: "npm・package.json・semver・公開・グローバル",
  },
  9: {
    en: "RESTful APIs with Express — routes, verbs & validation",
    np: "Express सँग REST — रूट, verb र प्रमाणीकरण",
    jp: "Express で REST — ルート・HTTP メソッド・検証",
  },
  10: {
    en: "Express advanced — middleware, config & app structure",
    np: "Express उन्नत — मिडलवेयर, विन्यास र संरचना",
    jp: "Express 応用 — ミドルウェア・設定・アプリ構成",
  },
  11: {
    en: "Asynchronous JavaScript — callbacks, promises & async/await",
    np: "असिंक JS — callback, promise र async/await",
    jp: "非同期 JS — コールバック・Promise・async/await",
  },
  12: {
    en: "MongoDB & Mongoose — connect, schemas, queries & CRUD",
    np: "MongoDB र Mongoose — जडान, schema, प्रश्न र CRUD",
    jp: "MongoDB・Mongoose — 接続・スキーマ・クエリ・CRUD",
  },
  13: {
    en: "Data validation — schemas, validators & persistence projects",
    np: "डाटा प्रमाणीकरण — schema, validators र persistence",
    jp: "データ検証 — スキーマ・バリデータ・永続化プロジェクト",
  },
  14: {
    en: "Modelling relationships — refs, embed, population & transactions",
    np: "सम्बन्ध मोडेलिङ — ref, embed, population र लेनदेन",
    jp: "関連モデリング — 参照・埋め込み・populate・トランザクション",
  },
  15: {
    en: "Authentication & authorization — users, JWT & roles",
    np: "प्रमाणीकरण र अधिकार — प्रयोगकर्ता, JWT र भूमिका",
    jp: "認証・認可 — ユーザー・JWT・ロール",
  },
  16: {
    en: "Errors, logging & extracting routes / services",
    np: "त्रुटि, लगिङ र रूट/सेवा अलग गर्नु",
    jp: "エラー・ログ・ルートとサービスの分割",
  },
  17: {
    en: "Unit tests, integration tests & test-driven habits",
    np: "युनिट, इन्टिग्रेशन परीक्षण र TDD",
    jp: "単体・結合テストと TDD の習慣",
  },
  18: {
    en: "Deployment, MongoDB Atlas & what to learn next",
    np: "डिप्लोइ, Atlas र अगाडि के सिक्ने",
    jp: "デプロイ・Atlas・次に学ぶこと",
  },
};

const NODEJS_WEEK_TITLE: Record<string, LocalizedString> = {
  "nodejs-w0": { en: "Before you start", np: "सुरु गर्नुअघि", jp: "はじめる前に" },
  "nodejs-w1": { en: "Phase 1 · The runtime", np: "Phase 1 · रनटाइम", jp: "Phase 1 · ランタイム" },
  "nodejs-w2": { en: "Core modules & npm", np: "कोर मोड्युल र npm", jp: "コアモジュールと npm" },
  "nodejs-w3": { en: "Express REST & advanced topics", np: "Express REST र उन्नत विषय", jp: "Express REST と応用トピック" },
  "nodejs-w4": { en: "Async JavaScript & Mongoose CRUD", np: "async JS र Mongoose CRUD", jp: "非同期JSとMongoose CRUD" },
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
