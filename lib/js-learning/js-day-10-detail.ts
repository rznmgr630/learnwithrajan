import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_10_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Error handling is the difference between an app that crashes silently and one that fails gracefully with useful information. Modules are how you split a large codebase into small, focused files. Today covers both — two things that every production JavaScript application depends on.",
      np: "Error handling ले app silently crash हुने र gracefully fail हुने बीच फरक गर्छ। Modules ले ठूलो codebase लाई सानो, focused files मा split गर्छ। आज दुवै — हरेक production JS application का लागि अनिवार्य।",
      jp: "エラー処理はアプリがサイレントクラッシュするかグレースフルに失敗するかを分ける。モジュールは大きなコードベースを小さなファイルに分割する仕組み。どちらもすべての本番JSアプリに不可欠。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "cFTFtuEQ-10", title: "JavaScript Error Handling — try, catch, throw, finally" },
      ],
    },
    {
      title: { en: "try, catch, finally & custom errors", np: "try, catch, finally र custom errors", jp: "try・catch・finallyとカスタムエラー" },
      blocks: [
        {
          type: "code",
          title: { en: "Robust error handling patterns", np: "Robust error handling patterns", jp: "堅牢なエラー処理パターン" },
          code: `// ── Basic try/catch ────────────────────────────────────────────────
function parseConfig(jsonString) {
  try {
    const config = JSON.parse(jsonString);  // might throw SyntaxError
    return config;
  } catch (err) {
    console.error("Failed to parse config:", err.message);
    return null;
  } finally {
    console.log("parseConfig attempted");  // always runs, even if catch returns
  }
}

// ── The Error object ─────────────────────────────────────────────────
try {
  null.property;   // TypeError: Cannot read properties of null
} catch (err) {
  err.name;        // "TypeError"
  err.message;     // "Cannot read properties of null (reading 'property')"
  err.stack;       // full stack trace string
}

// ── Built-in Error types ─────────────────────────────────────────────
// TypeError     — wrong type: null.foo, undefined()
// ReferenceError — undeclared variable: console.log(notDeclared)
// SyntaxError   — invalid syntax: JSON.parse("{bad}")
// RangeError    — out of range: new Array(-1)
// URIError      — bad URI: decodeURIComponent('%')

// ── Custom error classes ─────────────────────────────────────────────
class ValidationError extends Error {
  constructor(field, message) {
    super(message);           // sets this.message
    this.name = "ValidationError";
    this.field = field;       // extra context
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(\`\${resource} with id \${id} not found\`);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

// ── Using custom errors ───────────────────────────────────────────────
function createUser(data) {
  if (!data.email) throw new ValidationError("email", "Email is required");
  if (!data.name)  throw new ValidationError("name",  "Name is required");
  // ... create user
}

// ── Catching specific error types ─────────────────────────────────────
try {
  createUser({ name: "Alice" });  // missing email
} catch (err) {
  if (err instanceof ValidationError) {
    console.error(\`Validation failed on field '\${err.field}': \${err.message}\`);
  } else if (err instanceof NotFoundError) {
    console.error("Not found:", err.message);
  } else {
    throw err;  // rethrow unknown errors — don't swallow them silently
  }
}

// ── Error chaining (cause) — ES2022 ─────────────────────────────────
function fetchUser(id) {
  try {
    // ... database query
  } catch (dbError) {
    throw new Error("Failed to fetch user", { cause: dbError });  // preserves original
  }
}`,
        },
      ],
    },
    {
      title: { en: "CommonJS modules (require / module.exports)", np: "CommonJS modules (require / module.exports)", jp: "CommonJSモジュール（require/module.exports）" },
      blocks: [
        {
          type: "code",
          title: { en: "The original Node.js module system", np: "Original Node.js module system", jp: "Node.jsオリジナルのモジュールシステム" },
          code: `// ── Exporting — math.js ─────────────────────────────────────────────
// Named exports via module.exports object
module.exports.add = (a, b) => a + b;
module.exports.sub = (a, b) => a - b;

// Or assign the whole exports object at once:
module.exports = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  PI: 3.14159,
};

// Default export (exporting a single thing):
module.exports = function createServer(port) { /* ... */ };

// ── Importing — app.js ───────────────────────────────────────────────
const math = require("./math");    // relative path (same directory)
math.add(2, 3);                    // 5

// Destructured import:
const { add, sub } = require("./math");

// Core Node module (no path needed):
const path = require("path");
const fs   = require("fs");

// Third-party package (must be in node_modules):
const express = require("express");

// ── Key behaviours ────────────────────────────────────────────────────
// 1. Require is synchronous (blocking)
// 2. Module is cached after first require — same object returned every time
// 3. require() can be called conditionally or inside a function
if (process.env.DEBUG) {
  const debugTools = require("./debug");  // conditional import — valid in CJS
}`,
        },
      ],
    },
    {
      title: { en: "ES Modules (import / export)", np: "ES Modules (import / export)", jp: "ESモジュール（import/export）" },
      blocks: [
        {
          type: "code",
          title: { en: "The modern module syntax (works in browsers and Node.js 12+)", np: "Modern module syntax — browser र Node.js दुवैमा", jp: "モダンモジュール構文（ブラウザとNode.js 12+）" },
          code: `// ── Named exports — math.js ─────────────────────────────────────────
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function sub(a, b) { return a - b; }

// Or export at the bottom (keeps logic and exports separate):
const multiply = (a, b) => a * b;
const divide   = (a, b) => a / b;
export { multiply, divide };

// Export with rename:
export { multiply as times, divide as dividedBy };

// ── Default export — one per file ────────────────────────────────────
export default class Calculator {
  add(a, b) { return a + b; }
}
// A file can have both default and named exports

// ── Named imports — app.js ───────────────────────────────────────────
import { add, sub, PI } from "./math.js";    // file extension required in native ESM
import { multiply as times } from "./math.js"; // renamed import

// Import all named exports as a namespace:
import * as math from "./math.js";
math.add(2, 3);  // 5
math.PI;         // 3.14159

// Import default export:
import Calculator from "./math.js";   // can be named anything
new Calculator().add(2, 3);

// Import default AND named together:
import Calculator, { PI } from "./math.js";

// ── Dynamic import — load a module on demand (async) ─────────────────
const module = await import("./heavy-module.js");  // returns a Promise
module.doSomething();

// Conditional/lazy loading:
button.addEventListener("click", async () => {
  const { renderChart } = await import("./chart-library.js");
  renderChart(data);
});`,
        },
        {
          type: "table",
          caption: { en: "CommonJS vs ES Modules — key differences", np: "CommonJS vs ES Modules — मुख्य फरक", jp: "CommonJSとESモジュールの主な違い" },
          headers: [
            { en: "Feature", np: "Feature", jp: "特徴" },
            { en: "CommonJS (require)", np: "CommonJS", jp: "CommonJS" },
            { en: "ES Modules (import)", np: "ES Modules", jp: "ESモジュール" },
          ],
          rows: [
            [
              { en: "Loading", np: "Loading", jp: "ロード" },
              { en: "Synchronous (blocks)", np: "Synchronous", jp: "同期（ブロック）" },
              { en: "Asynchronous (static analysis)", np: "Asynchronous", jp: "非同期（静的解析）" },
            ],
            [
              { en: "Conditional imports", np: "Conditional imports", jp: "条件付きインポート" },
              { en: "Yes (require anywhere)", np: "हो", jp: "可（どこでも）" },
              { en: "No (top-level only)", np: "होइन (top-level मात्र)", jp: "不可（トップレベルのみ）" },
            ],
            [
              { en: "Tree-shaking", np: "Tree-shaking", jp: "ツリーシェイキング" },
              { en: "No — whole module imported", np: "होइन", jp: "不可" },
              { en: "Yes — bundlers remove unused exports", np: "हो", jp: "可" },
            ],
            [
              { en: "Where it works", np: "कहाँ काम गर्छ", jp: "動作環境" },
              { en: "Node.js (default)", np: "Node.js default", jp: "Node.js（デフォルト）" },
              { en: "Browser + Node.js (type: module)", np: "Browser + Node.js", jp: "ブラウザ + Node.js" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "Should I use CommonJS or ES Modules in a new project?", np: "नयाँ project मा CommonJS वा ES Modules?", jp: "新しいプロジェクトではCommonJSとESモジュールどちらを使うべきか？" },
      answer: {
        en: "Use **ES Modules** for new projects. Add `\"type\": \"module\"` to `package.json` and use `.js` extensions in import paths. ES Modules are the standard for both browsers and Node.js, support tree-shaking, and allow top-level `await`. Use CommonJS only if you are maintaining an older project or using a tool that does not yet support ESM (increasingly rare).",
        np: "नयाँ projects का लागि **ES Modules** प्रयोग गर्नुहोस्। `package.json` मा `\"type\": \"module\"` add गर्नुहोस्। ESM browser र Node.js दुवैको standard हो, tree-shaking support गर्छ, र top-level `await` पनि। पुरानो project maintain गर्दा मात्र CommonJS।",
        jp: "新しいプロジェクトには**ESモジュール**を使う。`package.json`に`\"type\": \"module\"`を追加。ESMはブラウザとNode.jsの両方の標準で、ツリーシェイキングとトップレベルawaitをサポート。古いプロジェクト維持やESM未対応ツールの場合のみCommonJS。",
      },
    },
    {
      question: { en: "When should I use custom error classes?", np: "Custom error classes कहिले प्रयोग गर्ने?", jp: "カスタムエラークラスはいつ使うべきか？" },
      answer: {
        en: "Use custom error classes when you need to: (1) distinguish between different error types in a catch block using `instanceof`; (2) attach extra context to an error (field name, status code, resource ID); (3) create a domain-specific error hierarchy (ValidationError, NotFoundError, AuthError all extend a base AppError). For simple scripts, built-in Error types are usually enough.",
        np: "Custom error classes कहिले: (1) catch block मा `instanceof` सँग error types छुट्याउन; (2) error मा extra context (field, status code) add गर्न; (3) domain-specific error hierarchy बनाउन। Simple scripts का लागि built-in Error types पर्याप्त।",
        jp: "カスタムエラーが必要な場面: (1)`instanceof`でエラータイプを区別; (2)エラーに追加コンテキスト（フィールド名・ステータスコード）を付ける; (3)ドメイン固有のエラー階層を作る。シンプルなスクリプトなら組み込みErrorで十分。",
      },
    },
  ],
};
