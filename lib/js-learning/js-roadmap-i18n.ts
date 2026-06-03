import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapTag } from "@/lib/challenge-data";

const JS_TAG: Record<string, LocalizedString> = {
  fundamentals:  { en: "fundamentals",   np: "आधार",           jp: "基礎" },
  types:         { en: "types",          np: "प्रकार",          jp: "型" },
  coercion:      { en: "type coercion",  np: "प्रकार रूपान्तरण", jp: "型変換" },
  scope:         { en: "scope",          np: "scope",           jp: "スコープ" },
  hoisting:      { en: "hoisting",       np: "hoisting",        jp: "ホイスティング" },
  functions:     { en: "functions",      np: "फङ्क्शन",         jp: "関数" },
  closures:      { en: "closures",       np: "closure",         jp: "クロージャ" },
  hof:           { en: "higher-order",   np: "उच्च-क्रम",       jp: "高階関数" },
  objects:       { en: "objects",        np: "वस्तुहरू",        jp: "オブジェクト" },
  arrays:        { en: "arrays",         np: "array",           jp: "配列" },
  destructuring: { en: "destructuring",  np: "destructuring",   jp: "分割代入" },
  this:          { en: "this keyword",   np: "this",            jp: "this" },
  binding:       { en: "binding",        np: "binding",         jp: "バインディング" },
  prototypes:    { en: "prototypes",     np: "prototype",       jp: "プロトタイプ" },
  inheritance:   { en: "inheritance",    np: "उत्तराधिकार",     jp: "継承" },
  classes:       { en: "classes",        np: "class",           jp: "クラス" },
  errors:        { en: "errors",         np: "त्रुटि",          jp: "エラー" },
  modules:       { en: "modules",        np: "मोड्युल",         jp: "モジュール" },
  async:         { en: "async JS",       np: "async JS",        jp: "非同期JS" },
  promises:      { en: "promises",       np: "Promise",         jp: "Promise" },
  "event-loop":  { en: "event loop",     np: "event loop",      jp: "イベントループ" },
  browser:       { en: "browser APIs",   np: "ब्राउजर API",     jp: "ブラウザAPI" },
  dom:           { en: "DOM",            np: "DOM",             jp: "DOM" },
  typescript:    { en: "TypeScript",     np: "TypeScript",      jp: "TypeScript" },
  advanced:      { en: "advanced",       np: "उन्नत",           jp: "応用" },
  patterns:      { en: "patterns",       np: "ढाँचा",           jp: "パターン" },
  generators:    { en: "generators",     np: "generator",       jp: "ジェネレータ" },
  memory:        { en: "memory",         np: "मेमोरी",          jp: "メモリ" },
  performance:   { en: "performance",    np: "प्रदर्शन",        jp: "パフォーマンス" },
  nodejs:        { en: "Node.js",        np: "Node.js",         jp: "Node.js" },
  internals:     { en: "internals",      np: "आन्तरिक",         jp: "内部構造" },
};

export function jsTags(slugs: [string, string]): RoadmapTag[] {
  return [
    { slug: slugs[0], label: JS_TAG[slugs[0]] ?? { en: slugs[0], np: slugs[0], jp: slugs[0] } },
    { slug: slugs[1], label: JS_TAG[slugs[1]] ?? { en: slugs[1], np: slugs[1], jp: slugs[1] } },
  ];
}

const JS_DAY_TITLE: Record<number, LocalizedString> = {
  // Week 1 — Core Syntax
  1:  { en: "Variables, data types & type coercion", np: "Variables, data types र type coercion", jp: "変数・型・型変換" },
  2:  { en: "Operators, conditionals, loops & function types", np: "Operators, conditionals, loops र function", jp: "演算子・条件・ループ・関数" },
  // Week 2 — Functions
  3:  { en: "Scope, hoisting & the temporal dead zone", np: "Scope, hoisting र temporal dead zone", jp: "スコープ・ホイスティング" },
  4:  { en: "Closures, higher-order functions & currying", np: "Closure, higher-order functions र currying", jp: "クロージャ・高階関数・カリー化" },
  // Week 3 — Objects & Arrays
  5:  { en: "Objects — creation, methods, destructuring & spread", np: "Objects — creation, methods, destructuring", jp: "オブジェクト・メソッド・分割代入" },
  6:  { en: "Arrays — map, filter, reduce & all key methods", np: "Arrays — map, filter, reduce र key methods", jp: "配列 — map・filter・reduce・主要メソッド" },
  // Week 4 — this & OOP
  7:  { en: "The this keyword — contexts, call, apply & bind", np: "this keyword — contexts, call, apply, bind", jp: "this・call・apply・bind" },
  8:  { en: "Prototype system & prototype chain", np: "Prototype system र prototype chain", jp: "プロトタイプシステムと継承チェーン" },
  9:  { en: "ES6 classes — inheritance, static & private fields", np: "ES6 classes — inheritance, static, private", jp: "ES6クラス・継承・static・プライベート" },
  // Week 5 — Error Handling & Modules
  10: { en: "Error handling, CommonJS & ES Modules", np: "Error handling, CommonJS र ES Modules", jp: "エラー処理・CommonJS・ESモジュール" },
  // Week 6 — Async
  11: { en: "Callbacks & Promises — creation, states & chaining", np: "Callbacks र Promises", jp: "コールバック・Promise・チェーン" },
  12: { en: "Promise APIs & async/await patterns", np: "Promise APIs र async/await", jp: "Promise API・async/await" },
  // Week 7 — Event Loop
  13: { en: "The browser event loop — call stack, queues & microtasks", np: "Browser event loop", jp: "ブラウザのイベントループ" },
  14: { en: "Node.js event loop phases — nextTick & setImmediate", np: "Node.js event loop phases", jp: "Node.jsのイベントループフェーズ" },
  // Week 8 — Browser
  15: { en: "DOM, events, event bubbling & delegation", np: "DOM, events, bubbling र delegation", jp: "DOM・イベント・バブリング・委譲" },
  16: { en: "Modern web APIs — Fetch, Storage & AbortController", np: "Modern Web APIs — Fetch, Storage", jp: "Fetch・Storage・AbortController" },
  // Week 9 — Advanced Patterns
  17: { en: "Advanced promise patterns — retry, timeout & concurrency", np: "Advanced Promise patterns", jp: "Promise応用パターン" },
  18: { en: "Generators, iterators & async generators", np: "Generators, iterators र async generators", jp: "ジェネレータ・イテレータ" },
  // Week 10 — Memory & Performance
  19: { en: "Memory management — stack, heap, GC & leak detection", np: "Memory management", jp: "メモリ管理・GC・リーク検出" },
  20: { en: "Performance — debounce, throttle, memoization & workers", np: "Performance — debounce, throttle, memoization", jp: "パフォーマンス最適化" },
  // Week 11 — TypeScript
  21: { en: "TypeScript — types, interfaces, generics & utility types", np: "TypeScript essentials", jp: "TypeScript基礎" },
  // Week 12 — Advanced JS
  22: { en: "Advanced JS — Proxy, Reflect, Symbols & WeakMap", np: "Advanced JS APIs", jp: "Proxy・Reflect・Symbol・WeakMap" },
  23: { en: "Design patterns — Singleton, Observer, Factory & more", np: "Design patterns", jp: "デザインパターン" },
  // Week 13 — Node.js & Senior
  24: { en: "Node.js advanced — streams, Buffer & worker threads", np: "Node.js advanced", jp: "Node.js応用 — ストリーム・Buffer" },
  25: { en: "Senior internals — V8, hidden classes & profiling", np: "Senior internals — V8, hidden classes", jp: "上級内部構造・V8・プロファイリング" },
};

const JS_WEEK_TITLE: Record<string, LocalizedString> = {
  "js-w1":  { en: "Core syntax & fundamentals",      np: "मुख्य syntax र आधार",    jp: "コア構文と基礎" },
  "js-w2":  { en: "Functions, scope & closures",     np: "Functions, scope र closure", jp: "関数・スコープ・クロージャ" },
  "js-w3":  { en: "Objects & Arrays",                np: "Objects र Arrays",        jp: "オブジェクトと配列" },
  "js-w4":  { en: "this, Prototypes & Classes",      np: "this, Prototype र Classes", jp: "this・プロトタイプ・クラス" },
  "js-w5":  { en: "Error handling & Modules",        np: "Error handling र Modules",  jp: "エラー処理とモジュール" },
  "js-w6":  { en: "Asynchronous JavaScript",         np: "Async JavaScript",          jp: "非同期JavaScript" },
  "js-w7":  { en: "Event loop deep dive",            np: "Event loop",                jp: "イベントループ詳解" },
  "js-w8":  { en: "Browser & Web APIs",              np: "Browser र Web APIs",        jp: "ブラウザとWeb API" },
  "js-w9":  { en: "Advanced patterns & generators",  np: "Advanced patterns",         jp: "応用パターン・ジェネレータ" },
  "js-w10": { en: "Memory & performance",            np: "Memory र Performance",      jp: "メモリとパフォーマンス" },
  "js-w11": { en: "TypeScript essentials",           np: "TypeScript",                jp: "TypeScript基礎" },
  "js-w12": { en: "Advanced JavaScript",            np: "Advanced JS",               jp: "高度なJavaScript" },
  "js-w13": { en: "Node.js advanced & internals",   np: "Node.js advanced",          jp: "Node.js応用と内部構造" },
};

export function jsDayTitle(day: number): LocalizedString {
  return JS_DAY_TITLE[day] ?? { en: `Day ${day}`, np: `दिन ${day}`, jp: `Day ${day}` };
}

export function jsWeekTitle(weekId: string): LocalizedString {
  return JS_WEEK_TITLE[weekId] ?? { en: weekId, np: weekId, jp: weekId };
}
