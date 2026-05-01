import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapTag } from "@/lib/challenge-data";

const NODEJS_TAG: Record<string, LocalizedString> = {
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
  1: {
    en: "Getting started — what Node is, architecture & first program",
    np: "सुरुवात — Node के हो, आर्किटेक्चर र पहिलो कार्यक्रम",
    jp: "はじめに — Node の概要・アーキテクチャ・最初のプログラム",
  },
  2: {
    en: "Global object, CommonJS modules, Path & OS",
    np: "ग्लोबल वस्तु, मोड्युल, Path र OS",
    jp: "グローバル・CommonJS・path・os",
  },
  3: {
    en: "File system, Events, EventEmitter & HTTP module",
    np: "फाइल प्रणाली, इभेन्ट, EventEmitter र HTTP",
    jp: "fs・イベント・EventEmitter・http",
  },
  4: {
    en: "npm — package.json, semver, publishing & globals",
    np: "npm — package.json, semver, प्रकाशन र ग्लोबल",
    jp: "npm・package.json・semver・公開・グローバル",
  },
  5: {
    en: "RESTful APIs with Express — routes, verbs & validation",
    np: "Express सँग REST — रूट, verb र प्रमाणीकरण",
    jp: "Express で REST — ルート・HTTP メソッド・検証",
  },
  6: {
    en: "Express advanced — middleware, config & app structure",
    np: "Express उन्नत — मिडलवेयर, विन्यास र संरचना",
    jp: "Express 応用 — ミドルウェア・設定・アプリ構成",
  },
  7: {
    en: "Asynchronous JavaScript — callbacks, promises & async/await",
    np: "असिंक JS — callback, promise र async/await",
    jp: "非同期 JS — コールバック・Promise・async/await",
  },
  8: {
    en: "MongoDB & Mongoose — connect, schemas, queries & CRUD",
    np: "MongoDB र Mongoose — जडान, schema, प्रश्न र CRUD",
    jp: "MongoDB・Mongoose — 接続・スキーマ・クエリ・CRUD",
  },
  9: {
    en: "Data validation — schemas, validators & persistence projects",
    np: "डाटा प्रमाणीकरण — schema, validators र persistence",
    jp: "データ検証 — スキーマ・バリデータ・永続化プロジェクト",
  },
  10: {
    en: "Modelling relationships — refs, embed, population & transactions",
    np: "सम्बन्ध मोडेलिङ — ref, embed, population र लेनदेन",
    jp: "関連モデリング — 参照・埋め込み・populate・トランザクション",
  },
  11: {
    en: "Authentication & authorization — users, JWT & roles",
    np: "प्रमाणीकरण र अधिकार — प्रयोगकर्ता, JWT र भूमिका",
    jp: "認証・認可 — ユーザー・JWT・ロール",
  },
  12: {
    en: "Errors, logging & extracting routes / services",
    np: "त्रुटि, लगिङ र रूट/सेवा अलग गर्नु",
    jp: "エラー・ログ・ルートとサービスの分割",
  },
  13: {
    en: "Unit tests, integration tests & test-driven habits",
    np: "युनिट, इन्टिग्रेशन परीक्षण र TDD",
    jp: "単体・結合テストと TDD の習慣",
  },
  14: {
    en: "Deployment, MongoDB Atlas & what to learn next",
    np: "डिप्लोइ, Atlas र अगाडि के सिक्ने",
    jp: "デプロイ・Atlas・次に学ぶこと",
  },
};

const NODEJS_WEEK_TITLE: Record<string, LocalizedString> = {
  "nodejs-w1": { en: "Foundations & module system", np: "आधार र मोड्युल", jp: "基礎とモジュール" },
  "nodejs-w2": { en: "npm & Express REST", np: "npm र Express REST", jp: "npm と Express REST" },
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
