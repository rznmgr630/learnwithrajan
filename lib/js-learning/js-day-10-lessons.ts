import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_10_LESSONS: JsLessonDay = {
  day: 10,
  title: { en: "Error Handling, CommonJS & ES Modules", np: "Error Handling, CommonJS र ES Modules", jp: "エラー処理・CommonJS・ESモジュール" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "try-catch-custom-errors",
      title: { en: "try, catch, finally & Custom Errors", np: "try, catch, finally, Custom Errors", jp: "try・catch・finallyとカスタムエラー" },
      durationMinutes: 9,
      explanation: {
        en: "`try { ... } catch (err) { ... } finally { ... }` is JavaScript's structured way to run risky code and recover from failure instead of crashing. The `catch` block receives an `Error` object with `.name`, `.message`, and `.stack`; `finally` always runs — whether the try block succeeded, failed, or even returned early — making it the right place for cleanup that must happen no matter what.\n\nBuilt-in error types (`TypeError`, `ReferenceError`, `SyntaxError`, `RangeError`) tell you roughly what went wrong, but for your own application logic, you can <b>extend Error</b> to create custom error classes carrying extra context (a field name, a status code). Catching with `instanceof` lets you branch on the specific error type — and any error you don't recognise should be <b>re-thrown</b>, not silently swallowed, so it doesn't disappear unnoticed.",
        np: "`try/catch/finally` ले risky code चलाउने र crash नहुने structured तरिका दिन्छ। `finally` सधैं चल्छ। Custom error classes ले Error extend गरी extra context राख्छन्। `instanceof` ले specific error type अनुसार branch गर्न दिन्छ — नचिनेको error लाई rethrow गर्नुपर्छ, silently swallow गर्नु हुँदैन।",
        jp: "try/catch/finallyはリスクのあるコードを実行しクラッシュせずに回復する構造化された方法。finallyは常に実行される。カスタムエラークラスはErrorを拡張して追加コンテキストを持つ。instanceofで特定のエラータイプに分岐できる。認識しないエラーは再スローすべきで、黙って握りつぶしてはいけない。" ,
      },
      diagram: `try {
  riskyOperation();
} catch (err) {
  if (err instanceof ValidationError)  { ... }   ← specific, known error
  else if (err instanceof NotFoundError) { ... } ← another known error
  else { throw err; }                             ← unknown — RETHROW, don't swallow
} finally {
  cleanup();   ← ALWAYS runs — success, failure, or early return`,
      codeExample: {
        title: { en: "Robust error handling with custom error classes", np: "Robust error handling, custom error classes", jp: "カスタムエラークラスによる堅牢なエラー処理" },
        code: `// ── Basic try/catch/finally ────────────────────────────────────────
function parseConfig(jsonString) {
  try {
    return JSON.parse(jsonString);       // might throw SyntaxError
  } catch (err) {
    console.error("Failed to parse config:", err.message);
    return null;
  } finally {
    console.log("parseConfig attempted"); // always runs, even if catch returns
  }
}

// ── The Error object ─────────────────────────────────────────────────
try {
  null.property;   // TypeError: Cannot read properties of null
} catch (err) {
  err.name;     // "TypeError"
  err.message;  // "Cannot read properties of null (reading 'property')"
  err.stack;    // full stack trace string
}

// ── Custom error classes ─────────────────────────────────────────────
class ValidationError extends Error {
  constructor(field, message) {
    super(message);            // sets this.message
    this.name = "ValidationError";
    this.field = field;        // extra context
  }
}
class NotFoundError extends Error {
  constructor(resource, id) {
    super(\`\${resource} with id \${id} not found\`);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

function createUser(data) {
  if (!data.email) throw new ValidationError("email", "Email is required");
  // ... create user
}

// ── Catching specific error types ─────────────────────────────────────
try {
  createUser({ name: "Alice" });  // missing email
} catch (err) {
  if (err instanceof ValidationError) {
    console.error(\`Validation failed on '\${err.field}': \${err.message}\`);
  } else {
    throw err;  // rethrow unknown errors — never swallow them silently
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
      keyTakeaways: [
        { en: "`finally` always runs — after a successful try, after a caught error, or even after an early `return` inside try/catch — making it the right place for guaranteed cleanup.", np: "`finally` सधैं चल्छ — try success भए पनि, error catch भए पनि, वा try/catch भित्रको early `return` पछि पनि — यो cleanup का लागि सहि ठाउँ हो।", jp: "finallyは常に実行される — try成功後、エラーキャッチ後、try/catch内の早期returnの後でも — 確実なクリーンアップの適切な場所。" },
        { en: "Custom error classes (`class ValidationError extends Error`) let you attach extra context — a field name, a status code — and branch on the specific type later with `instanceof`.", np: "Custom error classes (`class ValidationError extends Error`) ले extra context (field name, status code) राख्न दिन्छ र पछि `instanceof` ले specific type अनुसार branch गर्न दिन्छ।", jp: "カスタムエラークラス（`class ValidationError extends Error`）は追加コンテキスト（フィールド名、ステータスコード）を付加でき、後で`instanceof`で特定の型に分岐できる。" },
        { en: "Errors you don't recognise inside a `catch` block should be re-thrown (`throw err`), never silently swallowed — an unhandled bug should be visible, not hidden.", np: "`catch` भित्र नचिनेको error re-throw गर्नुपर्छ (`throw err`), silently swallow गर्नु हुँदैन — unhandled bug दृश्य हुनुपर्छ, लुकाइनु हुँदैन।", jp: "catchブロック内で認識しないエラーは再スロー（`throw err`）すべきで、黙って握りつぶしてはいけない。未処理のバグは見えるべきで隠すべきではない。" },
      ],
      commonMistakes: [
        { en: "Catching every error broadly and swallowing it (an empty `catch` block or just `console.log`) instead of re-throwing errors you don't specifically handle.", np: "हरेक error लाई broadly catch गरेर swallow गर्नु (empty `catch` block वा केवल `console.log`) specifically handle नगरेका errors re-throw गर्नुको सट्टा।", jp: "特定して処理していないエラーを再スローする代わりに、すべてのエラーを広くキャッチして握りつぶすこと（空のcatchブロックや単なるconsole.log）。" },
        { en: "Forgetting to call `super(message)` in a custom error class constructor — without it, `err.message` is never set correctly.", np: "Custom error class को constructor मा `super(message)` call गर्न बिर्सनु — यसबिना `err.message` सहि सेट हुँदैन।", jp: "カスタムエラークラスのコンストラクタで`super(message)`を呼び忘れること。これがないと`err.message`が正しく設定されない。" },
        { en: "Assuming `finally` only runs on success, and putting cleanup logic only in the `try` block instead — cleanup that must always happen belongs in `finally`.", np: "`finally` केवल success मा चल्छ भन्ने ठान्नु, र cleanup logic `try` block मा मात्र राख्नु — सधैं हुनुपर्ने cleanup `finally` मा हुनुपर्छ।", jp: "finallyは成功時のみ実行されると思い込み、クリーンアップロジックをtryブロックにのみ置くこと。常に発生すべきクリーンアップはfinallyに属する。" },
      ],
      quiz: [
        {
          question: { en: "In `try { return riskyCall(); } finally { console.log(\"done\"); }`, if `riskyCall()` succeeds and returns, does the finally block still run?", np: "`try { return riskyCall(); } finally { console.log(\"done\"); }` मा `riskyCall()` success भई return गरे पनि finally block चल्छ?", jp: "`try { return riskyCall(); } finally { console.log(\"done\"); }`でriskyCall()が成功してreturnしてもfinallyブロックは実行される？" },
          options: [
            { en: "No — finally is skipped once a return happens", np: "होइन — return भएपछि finally skip हुन्छ", jp: "いいえ — returnが発生するとfinallyはスキップされる" },
            { en: "Yes — finally always runs, even after a return inside try", np: "हो — finally सधैं चल्छ, try भित्र return भए पनि", jp: "はい — finallyは常に実行される、try内のreturnの後でも" },
          ],
          correctIndex: 1,
          explanation: { en: "finally is guaranteed to execute regardless of how the try/catch block exits — normal completion, an error, or a return statement.", np: "Try/catch block कसरी बाहिर निस्किए पनि finally execute हुने guaranteed छ — normal completion, error, वा return।", jp: "finallyはtry/catchブロックがどのように終了しても実行が保証される — 正常終了、エラー、return文のいずれでも。" },
        },
        {
          question: { en: "Why should you call `super(message)` in a custom error class's constructor?", np: "Custom error class को constructor मा `super(message)` किन call गर्नुपर्छ?", jp: "カスタムエラークラスのコンストラクタで`super(message)`を呼ぶべき理由は？" },
          options: [
            { en: "It sets `this.message` correctly, using Error's own constructor logic", np: "यसले Error को आफ्नै constructor logic प्रयोग गरी `this.message` सहि सेट गर्छ", jp: "Error自身のコンストラクタロジックを使ってthis.messageを正しく設定する" },
            { en: "It's optional boilerplate with no real effect", np: "यो optional boilerplate हो, real effect छैन", jp: "実際の効果のないオプションのボイラープレート" },
          ],
          correctIndex: 0,
          explanation: { en: "Error's constructor is what wires up .message and .stack; skipping super() leaves those unset or broken.", np: "Error को constructor ले नै .message र .stack सेटअप गर्छ; super() skip गर्दा ती सेट नहुन सक्छ।", jp: "Errorのコンストラクタが.messageと.stackを設定する。super()をスキップするとこれらが未設定になる。" },
        },
        {
          question: { en: "What should you do with an error type you don't specifically recognise inside a `catch` block?", np: "`catch` block भित्र नचिनेको error type सँग के गर्नुपर्छ?", jp: "catchブロック内で特定して認識していないエラータイプはどうするべき？" },
          options: [
            { en: "Re-throw it (`throw err`) so it isn't silently swallowed", np: "यसलाई re-throw गर्नुहोस् (`throw err`) ताकि silently swallow नहोस्", jp: "黙って握りつぶされないように再スロー（`throw err`）する" },
            { en: "Log it and continue as if nothing happened", np: "Log गर्नुहोस् र केही नभएको जस्तो जारी राख्नुहोस्", jp: "ログに記録して何もなかったように続行する" },
          ],
          correctIndex: 0,
          explanation: { en: "Swallowing unrecognised errors hides real bugs; rethrowing keeps them visible to whoever calls this code.", np: "नचिनेको error swallow गर्दा real bugs लुक्छन्; rethrow गर्दा यो code call गर्ने लाई देखिन्छ।", jp: "認識しないエラーを握りつぶすと本当のバグが隠れる。再スローすればこのコードを呼ぶ側に見える。" },
        },
      ],
    },
    {
      id: "commonjs-modules",
      title: { en: "CommonJS Modules (require / module.exports)", np: "CommonJS Modules (require / module.exports)", jp: "CommonJSモジュール（require/module.exports）" },
      durationMinutes: 9,
      explanation: {
        en: "CommonJS is Node.js's original module system. You export values by attaching them to `module.exports` (either individually, `module.exports.add = ...`, or by replacing the whole object at once), and import them with `require(\"./path\")`.\n\nThree behaviours define how it works: (1) `require` is <b>synchronous</b> — it blocks execution until the file is fully loaded and parsed; (2) a module is <b>cached</b> after its first `require` — every subsequent `require` of the same path returns the exact same object, not a fresh copy; (3) `require()` is just a normal function call, so unlike ES Modules' `import`, it can be called <b>conditionally</b> or inside a function body.",
        np: "CommonJS Node.js को original module system हो। `module.exports` मा value attach गरी export गरिन्छ, `require(\"./path\")` ले import गरिन्छ। require synchronous छ, module cache हुन्छ (पहिलो require पछि उही object फिर्ता), र require() लाई conditionally call गर्न सकिन्छ।",
        jp: "CommonJSはNode.jsのオリジナルのモジュールシステム。module.exportsに値を付けてエクスポートし、require(\"./path\")でインポートする。requireは同期的、モジュールはキャッシュされ、require()は条件付きで呼べる。",
      },
      diagram: `math.js                              app.js
────────────────────                 ────────────────────
module.exports.add = (a,b)=>a+b      const math = require("./math");
module.exports.PI = 3.14159          math.add(2, 3);   // 5

require() behaviour:
  1. SYNCHRONOUS   — blocks until the file is fully loaded
  2. CACHED         — 2nd require("./math") returns the SAME object
  3. CONDITIONAL OK — if (x) { require("./y") } is valid CJS`,
      codeExample: {
        title: { en: "Exporting and importing with CommonJS", np: "CommonJS सँग export/import", jp: "CommonJSでのエクスポート・インポート" },
        code: `// ── Exporting — math.js ─────────────────────────────────────────────
module.exports.add = (a, b) => a + b;
module.exports.sub = (a, b) => a - b;

// Or assign the whole exports object at once:
module.exports = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  PI: 3.14159,
};

// Default export (exporting a single thing):
// module.exports = function createServer(port) { /* ... */ };

// ── Importing — app.js ───────────────────────────────────────────────
const math = require("./math");    // relative path (same directory)
math.add(2, 3);                    // 5

const { add, sub } = require("./math");   // destructured import

const path = require("path");   // core Node module, no path needed
const fs   = require("fs");

// const express = require("express");  // third-party package (node_modules)

// ── Key behaviours ────────────────────────────────────────────────────
// 1. require() is SYNCHRONOUS — it blocks until the module fully loads
// 2. Modules are CACHED after the first require — same object every time
// 3. require() is a normal function call — can be conditional
if (process.env.DEBUG) {
  const debugTools = require("./debug");  // valid — conditional import in CJS
}`,
      },
      keyTakeaways: [
        { en: "You export from a CommonJS module by attaching properties to `module.exports` (or replacing it entirely), and import with `require(\"./path\")`.", np: "CommonJS module मा `module.exports` मा properties attach गरेर (वा पूर्ण replace गरेर) export गरिन्छ, र `require(\"./path\")` ले import गरिन्छ।", jp: "CommonJSモジュールでは`module.exports`にプロパティを付ける（または完全に置き換える）ことでエクスポートし、`require(\"./path\")`でインポートする。" },
        { en: "`require()` is synchronous — it blocks execution until the target file has fully loaded, unlike ES Modules' asynchronous `import`.", np: "`require()` synchronous छ — target file पूर्ण load नभएसम्म execution block गर्छ, ES Modules को asynchronous `import` भन्दा फरक।", jp: "`require()`は同期的で、対象ファイルが完全にロードされるまで実行をブロックする。ESモジュールの非同期importとは異なる。" },
        { en: "A module is only executed once and cached after its first `require` — every later `require(\"./same-path\")` returns the exact same object, not a fresh copy.", np: "Module पहिलो `require` पछि एकपल्ट मात्र execute हुन्छ र cache हुन्छ — पछिका सबै `require(\"./same-path\")` ले उही object फिर्ता दिन्छ।", jp: "モジュールは最初のrequire後に一度だけ実行されキャッシュされる。以降のrequire（同じパス）はすべて同じオブジェクトを返す。" },
      ],
      commonMistakes: [
        { en: "Expecting `require(\"./same-module\")` called twice to run the module's top-level code twice — it only runs once; the cached result is reused.", np: "`require(\"./same-module\")` दुई पटक call गर्दा module को top-level code दुई पटक चल्छ भन्ने आशा गर्नु — यो एकपल्ट मात्र चल्छ, cached result reuse हुन्छ।", jp: "`require(\"./same-module\")`を2回呼ぶとモジュールのトップレベルコードが2回実行されると期待すること。実際は一度だけ実行され、キャッシュされた結果が再利用される。" },
        { en: "Mixing `module.exports.x = ...` (adding to the exports object) with `module.exports = { ... }` (replacing it entirely) in the same file and losing earlier exports.", np: "Same file मा `module.exports.x = ...` (exports मा थप्नु) र `module.exports = { ... }` (पूर्ण replace) मिलाउनु, पहिलेका exports हराउनु।", jp: "同じファイルで`module.exports.x = ...`（追加）と`module.exports = { ... }`（完全置換）を混ぜて、以前のエクスポートを失うこと。" },
        { en: "Forgetting the relative path prefix (`./` or `../`) when requiring a local file, causing Node to look for it as a package in `node_modules` instead.", np: "Local file require गर्दा relative path prefix (`./` वा `../`) बिर्सनु, Node ले `node_modules` मा package को रूपमा खोज्ने कारण बन्नु।", jp: "ローカルファイルをrequireする際に相対パスの接頭辞（`./`や`../`）を忘れ、Nodeがnode_modulesのパッケージとして探すことになること。" },
      ],
      quiz: [
        {
          question: { en: "Is `require()` synchronous or asynchronous?", np: "`require()` synchronous वा asynchronous हो?", jp: "`require()`は同期か非同期か？" },
          options: [
            { en: "Synchronous — it blocks until the module fully loads", np: "Synchronous — module पूर्ण load नभएसम्म block गर्छ", jp: "同期 — モジュールが完全にロードされるまでブロックする" },
            { en: "Asynchronous — it returns a Promise", np: "Asynchronous — यो Promise फर्काउँछ", jp: "非同期 — Promiseを返す" },
          ],
          correctIndex: 0,
          explanation: { en: "CommonJS require() is a blocking, synchronous operation — this is one of its key differences from ES Modules' import.", np: "CommonJS require() blocking, synchronous operation हो — ES Modules को import सँगको एक key फरक।", jp: "CommonJSのrequire()はブロッキングで同期的な操作。これはESモジュールのimportとの主な違いの1つ。" },
        },
        {
          question: { en: "If you `require(\"./math\")` twice from two different files, do you get two separate objects?", np: "दुई फरक files बाट `require(\"./math\")` दुई पटक गर्दा दुई फरक objects पाउँछौं?", jp: "2つの異なるファイルから`require(\"./math\")`を2回すると、2つの別々のオブジェクトを得る？" },
          options: [
            { en: "No — the module is cached; both get the exact same object", np: "होइन — module cache हुन्छ; दुवैले उही object पाउँछन्", jp: "いいえ — モジュールはキャッシュされ、両方が同じオブジェクトを得る" },
            { en: "Yes — each require re-runs the module fresh", np: "हो — हरेक require ले module नयाँ रूपमा फेरि चलाउँछ", jp: "はい — 各requireがモジュールを新しく再実行する" },
          ],
          correctIndex: 0,
          explanation: { en: "Node caches modules by resolved file path after the first require, so later requires reuse that same cached object.", np: "Node ले पहिलो require पछि resolved file path अनुसार module cache गर्छ, पछिका requires ले उही cached object reuse गर्छन्।", jp: "Nodeは最初のrequire後に解決されたファイルパスでモジュールをキャッシュし、以降のrequireは同じキャッシュされたオブジェクトを再利用する。" },
        },
        {
          question: { en: "Can `require()` be called conditionally inside an `if` block?", np: "`require()` लाई `if` block भित्र conditionally call गर्न सकिन्छ?", jp: "`require()`はifブロック内で条件付きで呼べる？" },
          options: [
            { en: "Yes — it's a normal function call, valid anywhere", np: "हो — यो normal function call हो, जहाँसुकै valid", jp: "はい — 通常の関数呼び出しで、どこでも有効" },
            { en: "No — require must always be at the top level of the file", np: "होइन — require सधैं file को top level मा हुनुपर्छ", jp: "いいえ — requireは常にファイルのトップレベルにある必要がある" },
          ],
          correctIndex: 0,
          explanation: { en: "Unlike ES Modules' static import statement, require() is just a function, so it can appear anywhere ordinary code can, including inside conditionals.", np: "ES Modules को static import statement भन्दा फरक, require() केवल function हो, त्यसैले यो conditional भित्र पनि प्रयोग हुन सक्छ।", jp: "ESモジュールの静的なimport文とは異なり、require()は単なる関数なので、条件文の中など通常のコードが書ける場所ならどこでも使える。" },
        },
      ],
    },
    {
      id: "es-modules",
      title: { en: "ES Modules (import / export)", np: "ES Modules (import / export)", jp: "ESモジュール（import/export）" },
      durationMinutes: 9,
      explanation: {
        en: "ES Modules are the modern, standard module syntax — supported natively in browsers and Node.js (12+, with `\"type\": \"module\"` in `package.json`). A file can export multiple <b>named exports</b> (`export const PI = ...`) and up to one <b>default export</b> (`export default class Calculator {}`) at the same time.\n\nUnlike `require()`, `import` statements are <b>statically analysed</b> at build/parse time (must sit at the top level, never inside an `if`), which is exactly what allows bundlers to perform <b>tree-shaking</b> — safely removing exports that are never imported anywhere. For loading a module conditionally or lazily, ES Modules offer <b>dynamic import</b> — `await import(\"./path.js\")` — which returns a Promise instead of blocking.",
        np: "ES Modules आधुनिक standard module syntax हो — browser र Node.js दुवैमा native support। एक file मा multiple named exports र एक default export हुन सक्छ। `import` statically analyse हुन्छ (top-level मात्र), जसले tree-shaking सम्भव बनाउँछ। Dynamic import (`await import(...)`) ले lazy loading दिन्छ।",
        jp: "ESモジュールはモダンな標準モジュール構文で、ブラウザとNode.jsの両方でネイティブサポートされる。1つのファイルに複数の名前付きエクスポートと1つのデフォルトエクスポートを持てる。importは静的に解析される（トップレベルのみ）。動的import（await import(...)）で遅延読み込みができる。",
      },
      diagram: `math.js                                    app.js
──────────────────────                     ──────────────────────
export const PI = 3.14159;                 import { PI, add } from "./math.js";
export function add(a,b) {...}             import * as math from "./math.js";
export default class Calculator {}         import Calculator from "./math.js";

STATIC import   → top-level only    → enables tree-shaking (bundler removes unused)
DYNAMIC import  → await import(...) → returns a Promise, usable anywhere (lazy loading)`,
      codeExample: {
        title: { en: "Named exports, default export, and dynamic import", np: "Named exports, default export, dynamic import", jp: "名前付きエクスポート・デフォルトエクスポート・動的import" },
        code: `// ── Named exports — math.js ─────────────────────────────────────────
export const PI = 3.14159;
export function add(a, b) { return a + b; }

const multiply = (a, b) => a * b;
export { multiply };                       // export at the bottom
export { multiply as times };              // export with rename

// ── Default export — one per file ────────────────────────────────────
export default class Calculator {
  add(a, b) { return a + b; }
}
// A file can have both a default export and named exports

// ── Named imports — app.js ───────────────────────────────────────────
import { add, PI } from "./math.js";        // file extension required in native ESM
import { multiply as times } from "./math.js"; // renamed import

import * as math from "./math.js";          // import all named exports as a namespace
math.add(2, 3);  // 5

import Calculator from "./math.js";          // import default export, any local name
import Calculator2, { PI as PiValue } from "./math.js"; // default + named together

// ── Dynamic import — load a module on demand (async) ─────────────────
const heavy = await import("./heavy-module.js");  // returns a Promise
heavy.doSomething();

button.addEventListener("click", async () => {
  const { renderChart } = await import("./chart-library.js");  // lazy-load on click
  renderChart(data);
});`,
      },
      keyTakeaways: [
        { en: "A file can have multiple named exports (`export const x`) plus exactly one default export (`export default ...`) at the same time.", np: "एउटा file मा multiple named exports (`export const x`) र exactly एउटा default export (`export default ...`) एकैसाथ हुन सक्छ।", jp: "1つのファイルは複数の名前付きエクスポート（`export const x`）とちょうど1つのデフォルトエクスポート（`export default ...`）を同時に持てる。" },
        { en: "Static `import` statements must sit at the top level of a file (never inside a conditional), which is exactly what lets bundlers tree-shake unused exports away.", np: "Static `import` statements file को top level मा नै हुनुपर्छ (conditional भित्र होइन), यही ले bundlers लाई unused exports tree-shake गर्न दिन्छ।", jp: "静的なimport文はファイルのトップレベルに置く必要がある（条件文の中は不可）。これがバンドラーが未使用のエクスポートをツリーシェイクできる理由。" },
        { en: "`await import(\"./path.js\")` is a dynamic import — it returns a Promise, can be called conditionally or lazily anywhere in code, unlike static import.", np: "`await import(\"./path.js\")` dynamic import हो — यसले Promise फर्काउँछ, static import भन्दा फरक जहाँसुकै conditionally call गर्न सकिन्छ।", jp: "`await import(\"./path.js\")`は動的importで、Promiseを返す。静的importとは異なり、コードのどこでも条件付きで呼べる。" },
      ],
      commonMistakes: [
        { en: "Forgetting the file extension in an import path (`import x from \"./math\"` instead of `\"./math.js\"`) — native ESM in the browser requires it, unlike bundler-based setups.", np: "Import path मा file extension बिर्सनु (`\"./math\"` को सट्टा `\"./math.js\"`) — browser को native ESM मा यो required हुन्छ।", jp: "importパスでファイル拡張子を忘れること（`\"./math\"`ではなく`\"./math.js\"`）。ブラウザのネイティブESMではこれが必要。" },
        { en: "Trying to write `import` inside an `if` block or function body, expecting it to behave like `require()` — static import is only valid at the top level of a module.", np: "`import` लाई `if` block वा function body भित्र लेख्ने प्रयास गर्नु, `require()` जस्तै behave गर्छ भन्ने आशा गर्नु — static import module को top level मा मात्र valid हुन्छ।", jp: "`if`ブロックや関数本体内で`import`を書き、`require()`のように動作すると期待すること。静的importはモジュールのトップレベルでのみ有効。" },
        { en: "Mixing up a default import's naming freedom with named imports — `import Foo from \"./x.js\"` can be named anything, but `import { add }` must match the exported name exactly (unless renamed with `as`).", np: "Default import को naming freedom र named imports मिलाउनु — `import Foo from \"./x.js\"` जुनसुकै नाम राख्न सकिन्छ, तर `import { add }` ले exported name सँग exactly मिलाउनुपर्छ।", jp: "デフォルトインポートの命名の自由と名前付きインポートを混同すること。`import Foo from \"./x.js\"`はどんな名前でもよいが、`import { add }`はエクスポートされた名前と正確に一致する必要がある（asで改名しない限り）。" },
      ],
      quiz: [
        {
          question: { en: "Can a single file have both a default export and named exports?", np: "एउटा file मा default export र named exports दुवै हुन सक्छ?", jp: "1つのファイルにデフォルトエクスポートと名前付きエクスポートの両方を持てる？" },
          options: [
            { en: "Yes — a file can have both at the same time", np: "हो — एउटा file मा दुवै एकैसाथ हुन सक्छ", jp: "はい — 1つのファイルに両方同時に持てる" },
            { en: "No — a file must choose exactly one export style", np: "होइन — file ले exactly एउटा export style छान्नुपर्छ", jp: "いいえ — ファイルは1つのエクスポート方式を選ばなければならない" },
          ],
          correctIndex: 0,
          explanation: { en: "ES Modules allow up to one default export alongside any number of named exports in the same file.", np: "ES Modules ले same file मा एउटा default export सँगै जुनसुकै संख्याको named exports लाई अनुमति दिन्छ।", jp: "ESモジュールは同じファイルで1つのデフォルトエクスポートと任意の数の名前付きエクスポートを許可する。" },
        },
        {
          question: { en: "Why must static `import` statements sit only at the top level of a module?", np: "Static `import` statements किन module को top level मा मात्र हुनुपर्छ?", jp: "静的importステートメントがモジュールのトップレベルにのみ置ける理由は？" },
          options: [
            { en: "Because it's a purely stylistic rule with no functional purpose", np: "किनकि यो कुनै functional purpose नभएको केवल stylistic rule हो", jp: "機能的な目的のない単なるスタイル上の規則だから" },
            { en: "So bundlers/engines can statically analyse the whole module graph and tree-shake unused exports", np: "ताकि bundlers/engines ले पूरै module graph statically analyse गरी unused exports tree-shake गर्न सकोस्", jp: "バンドラー/エンジンがモジュールグラフ全体を静的に解析し未使用エクスポートをツリーシェイクできるように" },
          ],
          correctIndex: 1,
          explanation: { en: "Static, top-level-only imports are what makes the entire module dependency graph knowable ahead of time, without running any code.", np: "Static, top-level-only imports ले नै कोड नचलाई पूरै module dependency graph अगावै जान्न सक्ने बनाउँछ।", jp: "静的でトップレベルのみのimportこそが、コードを実行せずにモジュール依存グラフ全体を事前に把握可能にする。" },
        },
        {
          question: { en: "What does `await import(\"./chart-library.js\")` return?", np: "`await import(\"./chart-library.js\")` ले के फर्काउँछ?", jp: "`await import(\"./chart-library.js\")`は何を返す？" },
          options: [
            { en: "A Promise that resolves to the module's exports", np: "Module का exports मा resolve हुने Promise", jp: "モジュールのエクスポートに解決されるPromise" },
            { en: "The module's exports synchronously, immediately", np: "Module का exports synchronously, तुरुन्तै", jp: "モジュールのエクスポートを同期的に、即座に" },
          ],
          correctIndex: 0,
          explanation: { en: "Dynamic import() is inherently asynchronous, which is exactly what makes lazy/conditional loading possible in ESM.", np: "Dynamic import() स्वाभाविक रूपमा asynchronous हो, यही ले ESM मा lazy/conditional loading सम्भव बनाउँछ।", jp: "動的import()は本質的に非同期であり、これがESMで遅延/条件付き読み込みを可能にする。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Does a `finally` block run even after a `return` inside `try`?", np: "`try` भित्रको `return` पछि पनि `finally` block चल्छ?", jp: "try内のreturnの後でもfinallyブロックは実行される？" },
      options: [{ en: "Yes — finally always runs", np: "हो — finally सधैं चल्छ", jp: "はい — finallyは常に実行される" }, { en: "No — return skips finally", np: "होइन — return ले finally skip गर्छ", jp: "いいえ — returnはfinallyをスキップする" }],
      correctIndex: 0,
      explanation: { en: "finally is guaranteed regardless of how try/catch exits.", np: "Try/catch कसरी बाहिर निस्किए पनि finally guaranteed छ।", jp: "try/catchがどのように終了してもfinallyは保証される。" },
    },
    {
      question: { en: "What must a custom error class's constructor call to correctly set `.message`?", np: "Custom error class को constructor ले `.message` सहि सेट गर्न के call गर्नुपर्छ?", jp: "カスタムエラークラスのコンストラクタが.messageを正しく設定するために何を呼ぶ必要がある？" },
      options: [{ en: "`super(message)`", np: "`super(message)`", jp: "`super(message)`" }, { en: "Nothing, message is automatic", np: "केही होइन, message automatic हो", jp: "何も、messageは自動" }],
      correctIndex: 0,
      explanation: { en: "Error's own constructor logic sets up .message and .stack.", np: "Error को आफ्नै constructor logic ले .message र .stack सेटअप गर्छ।", jp: "Error自身のコンストラクタロジックが.messageと.stackを設定する。" },
    },
    {
      question: { en: "What should you do with an error type inside `catch` that you don't specifically handle?", np: "`catch` भित्र specifically handle नगरेको error type सँग के गर्नुपर्छ?", jp: "catch内で特に処理していないエラータイプはどうするべき？" },
      options: [{ en: "Re-throw it", np: "Re-throw गर्नुहोस्", jp: "再スローする" }, { en: "Log and ignore it", np: "Log गरी ignore गर्नुहोस्", jp: "ログに記録して無視する" }],
      correctIndex: 0,
      explanation: { en: "Rethrowing keeps unrecognised bugs visible instead of hiding them.", np: "Rethrow गर्दा नचिनेका bugs लुकाइनुको सट्टा दृश्य रहन्छन्।", jp: "再スローすれば認識していないバグが隠れずに見えるようになる。" },
    },
    {
      question: { en: "Is `require()` in CommonJS synchronous or asynchronous?", np: "CommonJS को `require()` synchronous वा asynchronous हो?", jp: "CommonJSのrequire()は同期か非同期か？" },
      options: [{ en: "Synchronous", np: "Synchronous", jp: "同期" }, { en: "Asynchronous", np: "Asynchronous", jp: "非同期" }],
      correctIndex: 0,
      explanation: { en: "require() blocks until the module is fully loaded.", np: "require() ले module पूर्ण load नभएसम्म block गर्छ।", jp: "require()はモジュールが完全にロードされるまでブロックする。" },
    },
    {
      question: { en: "If two files `require(\"./math\")`, do they get the same cached object or two fresh copies?", np: "दुई files ले `require(\"./math\")` गर्दा उही cached object वा दुई फरक copies पाउँछन्?", jp: "2つのファイルがrequire(\"./math\")すると、同じキャッシュされたオブジェクトか2つの新しいコピーか？" },
      options: [{ en: "The same cached object", np: "उही cached object", jp: "同じキャッシュされたオブジェクト" }, { en: "Two independent fresh copies", np: "दुई independent फरक copies", jp: "2つの独立した新しいコピー" }],
      correctIndex: 0,
      explanation: { en: "Modules run once and are cached by resolved path.", np: "Modules एकपल्ट चल्छन् र resolved path अनुसार cache हुन्छन्।", jp: "モジュールは一度実行され、解決されたパスでキャッシュされる。" },
    },
    {
      question: { en: "Can `require()` be called conditionally inside an `if` block?", np: "`require()` लाई `if` block भित्र conditionally call गर्न सकिन्छ?", jp: "`require()`はifブロック内で条件付きで呼べる？" },
      options: [{ en: "Yes — it's a normal function call", np: "हो — यो normal function call हो", jp: "はい — 通常の関数呼び出し" }, { en: "No — must be top-level like import", np: "होइन — import जस्तै top-level हुनुपर्छ", jp: "いいえ — importのようにトップレベルである必要がある" }],
      correctIndex: 0,
      explanation: { en: "require() is just a function, unlike static ESM import.", np: "require() केवल function हो, static ESM import जस्तो होइन।", jp: "require()は単なる関数であり、静的なESM importとは異なる。" },
    },
    {
      question: { en: "Can a single ES Module file have both a default export and named exports?", np: "एउटा ES Module file मा default export र named exports दुवै हुन सक्छ?", jp: "1つのESモジュールファイルにデフォルトエクスポートと名前付きエクスポートの両方を持てる？" },
      options: [{ en: "Yes", np: "हो", jp: "はい" }, { en: "No, only one style per file", np: "होइन, file प्रति एउटा style मात्र", jp: "いいえ、ファイルごとに1つの方式のみ" }],
      correctIndex: 0,
      explanation: { en: "ESM allows one default export alongside any number of named exports.", np: "ESM ले जुनसुकै संख्याका named exports सँगै एउटा default export अनुमति दिन्छ।", jp: "ESMは任意の数の名前付きエクスポートと共に1つのデフォルトエクスポートを許可する。" },
    },
    {
      question: { en: "Why must ESM `import` statements sit at the top level of a module?", np: "ESM `import` statements किन module को top level मा हुनुपर्छ?", jp: "ESMのimport文がモジュールのトップレベルに置かれる必要があるのはなぜ？" },
      options: [{ en: "So the module graph can be statically analysed for tree-shaking", np: "ताकि module graph tree-shaking का लागि statically analyse होस्", jp: "モジュールグラフをツリーシェイキングのために静的に解析できるように" }, { en: "It's just a stylistic preference", np: "यो केवल stylistic preference हो", jp: "単なるスタイル上の好み" }],
      correctIndex: 0,
      explanation: { en: "Static imports enable ahead-of-time analysis, unlike CommonJS's dynamic require().", np: "Static imports ले ahead-of-time analysis सम्भव बनाउँछ, CommonJS को dynamic require() जस्तो होइन।", jp: "静的importは事前解析を可能にする。CommonJSの動的なrequire()とは異なる。" },
    },
    {
      question: { en: "What does `await import(\"./x.js\")` return?", np: "`await import(\"./x.js\")` ले के फर्काउँछ?", jp: "`await import(\"./x.js\")`は何を返す？" },
      options: [{ en: "A Promise resolving to the module's exports", np: "Module का exports मा resolve हुने Promise", jp: "モジュールのエクスポートに解決されるPromise" }, { en: "The exports synchronously", np: "Exports synchronously", jp: "エクスポートを同期的に" }],
      correctIndex: 0,
      explanation: { en: "Dynamic import is asynchronous by design, enabling lazy loading.", np: "Dynamic import design द्वारा asynchronous छ, lazy loading सम्भव बनाउँछ।", jp: "動的importは設計上非同期であり、遅延読み込みを可能にする。" },
    },
  ],
};
