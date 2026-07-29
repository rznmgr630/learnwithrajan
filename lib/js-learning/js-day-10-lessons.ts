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
        en: "An <b>error</b> happens when something goes wrong while your code runs — e.g. `null.name` throws because `null` means there's no object to read from. Errors aren't rare edge cases: they come from bad user input, failed database calls, unavailable APIs, and other external services breaking, so the goal isn't to prevent every error, it's to <b>handle them gracefully</b> instead of letting the whole program crash.\n\n`try { ... } catch (err) { ... } finally { ... }` is JavaScript's structured way to do that. Code that might fail goes in `try`; if it throws, execution jumps straight to `catch`, which receives an `Error` object with `.name` (the error type), `.message` (what went wrong), and `.stack` (where it happened — invaluable for debugging). `finally` always runs — after success, after a caught error, and even after an early `return` inside try/catch — which makes it the right place for cleanup that must happen no matter what, like closing a database connection.\n\nBuilt-in error types like `TypeError`, `ReferenceError`, `SyntaxError`, and `RangeError` describe generic problems, but real applications also raise their own errors on purpose with `throw` when a business rule is broken, and define <b>custom error classes</b> by extending `Error` (`class ValidationError extends Error`) to attach extra context like a field name or an HTTP status code. Catching with `instanceof` lets you branch on the specific error type — and any error you don't recognise should be re-thrown, never silently swallowed.",
        np: "Error तब हुन्छ जब code चल्दा केही गलत हुन्छ — जस्तै `null.name` ले throw गर्छ किनकि `null` को अर्थ त्यहाँ object नै छैन। Errors bad user input, failed database calls, वा external services fail हुँदा आउँछन् — लक्ष्य सबै errors रोक्नु होइन, gracefully handle गर्नु हो। `try/catch/finally` ले यही structured तरिका दिन्छ। `finally` सधैं चल्छ, try/catch भित्रको early `return` पछि पनि। Custom error classes ले Error extend गरी extra context राख्छन्। `instanceof` ले specific error type अनुसार branch गर्न दिन्छ — नचिनेको error लाई rethrow गर्नुपर्छ, silently swallow गर्नु हुँदैन।",
        jp: "エラーとは、コード実行中に何か問題が起きること — 例えば`null.name`はnullが読み取るオブジェクトがないことを意味するためスローする。エラーは不正な入力、失敗したデータベース呼び出し、利用できない外部サービスなどから発生する。目標はすべてのエラーを防ぐことではなく、優雅に処理すること。try/catch/finallyはそのための構造化された方法。finallyは常に実行される、try/catch内の早期returnの後でも。カスタムエラークラスはErrorを拡張して追加コンテキストを持つ。instanceofで特定のエラータイプに分岐できる。認識しないエラーは再スローすべきで、黙って握りつぶしてはいけない。",
      },
      diagram: `             Start
               |
               v
          Run try block
               |
        +------+------+
        |             |
        v             v
     Success        Error thrown
        |             |
        |             v
        |        catch(err) { ... }   ← err.name / err.message / err.stack
        |             |
        +------+------+
               |
               v
          finally { ... }   ← ALWAYS runs, even after try's own 'return'
               |
               v
              End`,
      codeExample: {
        title: { en: "Robust error handling with custom error classes", np: "Robust error handling, custom error classes", jp: "カスタムエラークラスによる堅牢なエラー処理" },
        code: `// ── Basic try/catch — recovering instead of crashing ─────────────────
function parseConfig(jsonString) {
  try {
    return JSON.parse(jsonString);       // might throw SyntaxError
  } catch (err) {
    console.error("Invalid JSON:", err.message);
    return null;
  }
}
parseConfig("invalid json");   // logs "Invalid JSON: ..." instead of crashing

// ── The Error object ─────────────────────────────────────────────────
try {
  null.name;   // TypeError: Cannot read properties of null
} catch (err) {
  err.name;     // "TypeError"
  err.message;  // "Cannot read properties of null (reading 'name')"
  err.stack;    // full stack trace — where it happened
}

// ── finally always runs — even after a 'return' inside try ───────────
function test() {
  try {
    return "Success";
  } finally {
    console.log("Finally runs");   // logs BEFORE the function actually returns
  }
}
test();   // logs "Finally runs", then returns "Success"

// ── Throwing your own errors on purpose ───────────────────────────────
function withdraw(amount) {
  if (amount > 1000) throw new Error("Withdrawal limit exceeded");
  return amount;
}

// ── Custom error classes — extend Error for extra context ─────────────
class ValidationError extends Error {
  constructor(message, field) {
    super(message);            // sets this.message and this.stack correctly
    this.name = "ValidationError";
    this.field = field;        // extra context
  }
}
class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = 401;
  }
}

function login(password) {
  if (password !== "123456") throw new AuthenticationError("Invalid password");
}

// ── Catching specific error types with instanceof ─────────────────────
try {
  login("wrong-password");
} catch (err) {
  if (err instanceof AuthenticationError) {
    console.log({ statusCode: err.statusCode, message: err.message });
    // { statusCode: 401, message: "Invalid password" }
  } else {
    throw err;   // unrecognised error — never swallow it silently
  }
}`,
      },
      keyTakeaways: [
        { en: "Errors are a normal part of real applications (bad input, failed network calls, unavailable services) — the goal is to handle them gracefully, not to prevent them entirely.", np: "Errors real applications को normal भाग हो (bad input, failed network calls, unavailable services) — लक्ष्य gracefully handle गर्नु हो, पूर्ण रूपमा रोक्नु होइन।", jp: "エラーは実際のアプリケーションの通常の一部（不正な入力、失敗したネットワーク呼び出し、利用できないサービス）。目標は完全に防ぐことではなく優雅に処理すること。" },
        { en: "`try` holds risky code, `catch(err)` handles the failure with an Error object (`.name`, `.message`, `.stack`), and `finally` always runs — even after a `return` inside try/catch — making it the right place for guaranteed cleanup.", np: "`try` मा risky code राखिन्छ, `catch(err)` ले Error object (`.name`, `.message`, `.stack`) सँग failure handle गर्छ, र `finally` सधैं चल्छ — try/catch भित्रको `return` पछि पनि — यो guaranteed cleanup का लागि सहि ठाउँ हो।", jp: "tryにリスクのあるコードを置き、catch(err)がErrorオブジェクト（.name, .message, .stack）で失敗を処理し、finallyは常に実行される — try/catch内のreturnの後でも — 確実なクリーンアップの適切な場所。" },
        { en: "`throw` lets you raise your own errors when a business rule is violated, even if the code is technically valid — e.g. rejecting a withdrawal over the allowed limit.", np: "`throw` ले business rule violate भएमा आफ्नै errors raise गर्न दिन्छ, code technically valid भए पनि — जस्तै allowed limit भन्दा माथिको withdrawal reject गर्नु।", jp: "throwを使うと、コードが技術的には有効でもビジネスルールに違反した場合に独自のエラーを発生させられる — 許可された上限を超える引き出しを拒否する例。" },
        { en: "Custom error classes (`class ValidationError extends Error`) attach extra context — a field name, a status code — and let you branch on the specific type later with `instanceof`; unrecognised errors should be re-thrown, never silently swallowed.", np: "Custom error classes (`class ValidationError extends Error`) ले extra context (field name, status code) राख्न दिन्छ र पछि `instanceof` ले specific type अनुसार branch गर्न दिन्छ; नचिनेको error re-throw गर्नुपर्छ, silently swallow गर्नु हुँदैन।", jp: "カスタムエラークラス（`class ValidationError extends Error`）は追加コンテキスト（フィールド名、ステータスコード）を付加でき、後で`instanceof`で特定の型に分岐できる。認識しないエラーは再スローすべきで、黙って握りつぶしてはいけない。" },
      ],
      commonMistakes: [
        { en: "Leaving a `catch` block empty, which swallows the error entirely — you never learn what failed, where it failed, or why.", np: "`catch` block खाली छोड्नु, जसले error लाई पूर्ण रूपमा swallow गर्छ — के, कहाँ, र किन fail भयो भन्ने कहिल्यै थाहा हुँदैन।", jp: "catchブロックを空のままにすること。エラーを完全に握りつぶし、何が・どこで・なぜ失敗したか分からなくなる。" },
        { en: "Catching every error broadly and just returning `null` or ignoring it, instead of re-throwing errors you don't specifically handle — this hides real problems from the caller.", np: "हरेक error लाई broadly catch गरेर केवल `null` फर्काउनु वा ignore गर्नु, specifically handle नगरेका errors re-throw गर्नुको सट्टा — यसले real problems caller बाट लुकाउँछ।", jp: "特定して処理していないエラーを再スローする代わりに、すべてのエラーを広くキャッチして単にnullを返すか無視すること。これは呼び出し元から本当の問題を隠す。" },
        { en: "Using `error.message` string comparisons for logic (`if (error.message === \"User missing\")`) instead of `instanceof` — messages can change wording and silently break the check.", np: "Logic का लागि `error.message` string comparison प्रयोग गर्नु (`if (error.message === \"User missing\")`) `instanceof` को सट्टा — messages को wording बदलिन सक्छ र check silently बिग्रन्छ।", jp: "instanceofの代わりにerror.messageの文字列比較をロジックに使うこと（`if (error.message === \"User missing\")`）。メッセージの文言が変わるとチェックが黙って壊れる。" },
        { en: "Forgetting `finally` cleanup (e.g. closing a database connection) and only putting that logic in `try`, so it never runs when an error happens partway through.", np: "`finally` cleanup बिर्सनु (जस्तै database connection close गर्नु) र त्यो logic `try` मा मात्र राख्नु, जसले error हुँदा त्यो कहिल्यै चल्दैन।", jp: "finallyでのクリーンアップ（データベース接続のクローズなど）を忘れ、そのロジックをtryにのみ置くこと。途中でエラーが起きると実行されない。" },
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
        en: "A <b>module</b> is a separate file containing related functionality — instead of cramming an entire application (users, payments, database, email) into one giant file, you split it into smaller files, each with one clear responsibility, and share code between them. <b>CommonJS</b> is Node.js's original module system for doing this: a file shares code by attaching it to `module.exports` (either individually, `module.exports.add = ...`, or by replacing the whole object at once), and another file pulls it in with `require(\"./path\")`.\n\nThree behaviours define how it works: (1) `require` is <b>synchronous</b> — it blocks execution until the file is fully loaded and parsed; (2) a module is <b>cached</b> after its first `require` — every subsequent `require` of the same path returns the exact same object, not a fresh copy, so its top-level code only ever runs once; (3) `require()` is just a normal function call, so unlike ES Modules' `import`, it can be called <b>conditionally</b> or inside a function body.",
        np: "Module भनेको related functionality भएको छुट्टै file हो — पूरै application एउटै file मा नराखी, धेरै साना files मा भाग लगाइन्छ, हरेकको एउटा clear responsibility हुन्छ। CommonJS Node.js को original module system हो — `module.exports` मा value attach गरी export गरिन्छ, `require(\"./path\")` ले import गरिन्छ। require synchronous छ, module cache हुन्छ (top-level code एकपल्ट मात्र चल्छ), र require() लाई conditionally call गर्न सकिन्छ।",
        jp: "モジュールとは関連する機能を持つ別ファイルのこと — アプリケーション全体を1つの巨大ファイルに詰め込む代わりに、それぞれ明確な責任を持つ小さなファイルに分割し、コードを共有する。CommonJSはNode.jsのオリジナルのモジュールシステムで、module.exportsに値を付けてエクスポートし、require(\"./path\")でインポートする。requireは同期的、モジュールはキャッシュされ（トップレベルコードは一度だけ実行される）、require()は条件付きで呼べる。",
      },
      diagram: `math.js                              app.js
────────────────────                 ────────────────────
module.exports.add = (a,b)=>a+b      const math = require("./math");
module.exports.PI = 3.14159          math.add(2, 3);   // 5

Mental model: module.exports = "what's in the toolbox I hand out"
              require()      = "go get that toolbox"

require() behaviour:
  1. SYNCHRONOUS   — blocks until the file is fully loaded
  2. CACHED         — 2nd require("./math") returns the SAME object
  3. CONDITIONAL OK — if (x) { require("./y") } is valid CJS`,
      codeExample: {
        title: { en: "Exporting and importing with CommonJS", np: "CommonJS सँग export/import", jp: "CommonJSでのエクスポート・インポート" },
        code: `// ── Exporting a single function — math.js ────────────────────────────
function add(a, b) { return a + b; }
module.exports = add;

// ── Importing it — app.js ─────────────────────────────────────────────
const add = require("./math");
add(5, 3);   // 8

// ── Exporting multiple functions as an object ──────────────────────────
function subtract(a, b) { return a - b; }
module.exports = { add, subtract };

const math = require("./math");
math.add(10, 5);        // 15
math.subtract(10, 5);   // 5

// ── Destructured import — cleaner call sites ────────────────────────────
const { add, subtract } = require("./math");
add(5, 2);        // 7
subtract(5, 2);   // 3

// ── Real backend example ────────────────────────────────────────────────
// database.js
function connectDatabase() { console.log("Database connected"); }
function closeDatabase() { console.log("Database closed"); }
module.exports = { connectDatabase, closeDatabase };

// server.js
const database = require("./database");
database.connectDatabase();   // "Database connected"
console.log("Server running");

// ── Built-in and third-party modules ────────────────────────────────────
const path = require("path");        // core Node module, no ./ needed
// const express = require("express");  // third-party package (node_modules)

// ── require() is just a function call — can be conditional ─────────────
if (process.env.DEBUG) {
  const debugTools = require("./debug");   // valid in CJS, not in ES Modules
}`,
      },
      keyTakeaways: [
        { en: "A module is a separate file with one clear responsibility; splitting a large app into modules makes code organized, reusable, and easier for multiple people to work on.", np: "Module भनेको एउटा clear responsibility भएको छुट्टै file हो; ठूलो app लाई modules मा बाँड्दा code organized, reusable, र धेरैले काम गर्न सजिलो हुन्छ।", jp: "モジュールとは1つの明確な責任を持つ別ファイル。大きなアプリをモジュールに分割すると、コードが整理され、再利用可能になり、複数人での作業がしやすくなる。" },
        { en: "You export from a CommonJS module by attaching properties to `module.exports` (or replacing it entirely), and import with `require(\"./path\")`.", np: "CommonJS module मा `module.exports` मा properties attach गरेर (वा पूर्ण replace गरेर) export गरिन्छ, र `require(\"./path\")` ले import गरिन्छ।", jp: "CommonJSモジュールでは`module.exports`にプロパティを付ける（または完全に置き換える）ことでエクスポートし、`require(\"./path\")`でインポートする。" },
        { en: "`require()` is synchronous — it blocks execution until the target file has fully loaded, unlike ES Modules' asynchronous dynamic import.", np: "`require()` synchronous छ — target file पूर्ण load नभएसम्म execution block गर्छ, ES Modules को asynchronous dynamic import भन्दा फरक।", jp: "`require()`は同期的で、対象ファイルが完全にロードされるまで実行をブロックする。ESモジュールの非同期な動的importとは異なる。" },
        { en: "A module is only executed once and cached after its first `require` — every later `require(\"./same-path\")` returns the exact same object, not a fresh copy.", np: "Module पहिलो `require` पछि एकपल्ट मात्र execute हुन्छ र cache हुन्छ — पछिका सबै `require(\"./same-path\")` ले उही object फिर्ता दिन्छ।", jp: "モジュールは最初のrequire後に一度だけ実行されキャッシュされる。以降のrequire（同じパス）はすべて同じオブジェクトを返す。" },
      ],
      commonMistakes: [
        { en: "Writing a function in a file but forgetting to attach it to `module.exports` — it stays private to that file, and `require()` in another file returns nothing useful.", np: "File मा function लेखेर `module.exports` मा attach गर्न बिर्सनु — त्यो त्यही file मा मात्र private रहन्छ, अर्को file को `require()` ले केही useful फिर्ता दिँदैन।", jp: "ファイルに関数を書いたが`module.exports`に付けるのを忘れること。その関数はそのファイル内だけのプライベートなままで、他ファイルのrequire()は何も有用なものを返さない。" },
        { en: "Requiring a local file without the `./` prefix (`require(\"math\")` instead of `require(\"./math\")`) — Node then looks for an installed package named `math` instead of your file.", np: "Local file require गर्दा `./` prefix बिर्सनु (`require(\"./math\")` को सट्टा `require(\"math\")`) — Node ले तिम्रो file को सट्टा `math` नामको installed package खोज्छ।", jp: "ローカルファイルをrequireする際に`./`接頭辞を忘れること（`require(\"./math\")`ではなく`require(\"math\")`）。Nodeは自分のファイルの代わりに`math`という名前のインストール済みパッケージを探してしまう。" },
        { en: "Mixing `module.exports.x = ...` (adding to the exports object) with `module.exports = { ... }` (replacing it entirely) in the same file — the replacement wipes out the earlier additions.", np: "Same file मा `module.exports.x = ...` (exports मा थप्नु) र `module.exports = { ... }` (पूर्ण replace) मिलाउनु — replacement ले पहिलेका additions हराउँछ।", jp: "同じファイルで`module.exports.x = ...`（追加）と`module.exports = { ... }`（完全置換）を混ぜること。置換により以前の追加が消える。" },
        { en: "Mixing CommonJS (`require`/`module.exports`) and ES Modules (`import`/`export`) syntax in the same file — they are different module systems, so pick one style per project.", np: "Same file मा CommonJS (`require`/`module.exports`) र ES Modules (`import`/`export`) syntax मिलाउनु — यी फरक module systems हुन्, project प्रति एउटा style मात्र छान्ने।", jp: "同じファイルでCommonJS（require/module.exports）とESモジュール（import/export）の構文を混ぜること。異なるモジュールシステムなので、プロジェクトごとに1つの方式を選ぶ。" },
        { en: "Writing `module.exports.add()` (which calls the function immediately) instead of `module.exports.add = add` (which exports the function reference).", np: "`module.exports.add = add` (function reference export) को सट्टा `module.exports.add()` (जसले function तुरुन्तै call गर्छ) लेख्नु।", jp: "`module.exports.add = add`（関数の参照をエクスポート）の代わりに`module.exports.add()`（関数を即座に呼び出してしまう）と書くこと。" },
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
        en: "ES Modules (ESM) are JavaScript's official, standard module system — supported natively in browsers and in Node.js (12+, with `\"type\": \"module\"` in `package.json`), and used throughout modern frameworks like React and Next.js. `export` shares code from a file; `import` brings code from another file in. A file can have any number of <b>named exports</b> (`export const PI = ...`, `export function add() {}`) plus up to one <b>default export</b> (`export default class Calculator {}`) at the same time — named imports must match the exported name exactly (`import { add }`, unless renamed with `as`), while a default import can be given any local name (`import Calculator from \"./math.js\"`).\n\nUnlike CommonJS's `require()`, `import` statements are <b>statically analysed</b> at build/parse time — they must sit at the top level of a file, never inside an `if` — and this is exactly what lets bundlers perform <b>tree-shaking</b>: safely removing exports that are never imported anywhere, since the whole dependency graph is knowable without running any code. For loading a module conditionally or lazily, ES Modules offer <b>dynamic import</b> — `await import(\"./path.js\")` — which returns a Promise instead of blocking.",
        np: "ES Modules JavaScript को official standard module system हो — browser र Node.js दुवैमा native support, र React/Next.js जस्ता modern frameworks मा प्रयोग हुन्छ। `export` ले code share गर्छ, `import` ले अर्को file बाट ल्याउँछ। एउटा file मा धेरै named exports र एउटा default export हुन सक्छ — named import ले exported name सँग exactly मिल्नुपर्छ, default import जुनसुकै नामले import गर्न सकिन्छ। `import` statically analyse हुन्छ (top-level मात्र), जसले tree-shaking सम्भव बनाउँछ। Dynamic import (`await import(...)`) ले lazy loading दिन्छ।",
        jp: "ESモジュールはJavaScriptの公式標準モジュールシステムで、ブラウザとNode.jsの両方でネイティブサポートされ、ReactやNext.jsなどのモダンなフレームワークで使われる。exportはコードを共有し、importは別ファイルから取り込む。1つのファイルに複数の名前付きエクスポートと1つのデフォルトエクスポートを持てる。名前付きインポートはエクスポート名と正確に一致する必要があるが、デフォルトインポートはどんなローカル名でも良い。importは静的に解析される（トップレベルのみ）。これによりツリーシェイキングが可能になる。動的import（await import(...)）で遅延読み込みができる。",
      },
      diagram: `math.js                                    app.js
──────────────────────                     ──────────────────────
export const PI = 3.14159;                 import { PI, add } from "./math.js";
export function add(a,b) {...}             import * as math from "./math.js";
export default class Calculator {}         import Calculator from "./math.js";

Mental model: export = "place this item in the library"
              import = "borrow this item from the library"

STATIC import   → top-level only    → enables tree-shaking (bundler removes unused)
DYNAMIC import  → await import(...) → returns a Promise, usable anywhere (lazy loading)`,
      codeExample: {
        title: { en: "Named exports, default export, and dynamic import", np: "Named exports, default export, dynamic import", jp: "名前付きエクスポート・デフォルトエクスポート・動的import" },
        code: `// ── Named exports — math.js ─────────────────────────────────────────
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

// ── Default export — one per file, alongside named exports ────────────
export default class Calculator {
  add(a, b) { return a + b; }
}

// ── Named imports — app.js ───────────────────────────────────────────
import { add, multiply } from "./math.js";   // names must match exactly
add(2, 3);        // 5
multiply(2, 3);   // 6

// ── Default import — any local name works ─────────────────────────────
import Calculator from "./math.js";     // no curly braces
import MyCalc from "./math.js";         // this name works too — default exports aren't named

// ── Real backend example ────────────────────────────────────────────────
// user.service.js
export function findUser(userId) { return { id: userId, name: "Alex" }; }
export function deleteUser(userId) { console.log("Deleting user", userId); }

// user.controller.js
import { findUser, deleteUser } from "./user.service.js";
const user = findUser(10);   // { id: 10, name: "Alex" }
deleteUser(10);               // "Deleting user 10"

// ── Dynamic import — load a module on demand (async) ────────────────────
button.addEventListener("click", async () => {
  const { renderChart } = await import("./chart-library.js");  // lazy-loaded, returns a Promise
  renderChart(data);
});

// ── Enabling ESM in Node.js — package.json ──────────────────────────────
// { "type": "module" }`,
      },
      keyTakeaways: [
        { en: "`export` shares code from a file, `import` brings it into another — a file can have multiple named exports plus exactly one default export at the same time.", np: "`export` ले file बाट code share गर्छ, `import` ले अर्को file मा ल्याउँछ — एउटा file मा multiple named exports र exactly एउटा default export एकैसाथ हुन सक्छ।", jp: "exportはファイルからコードを共有し、importはそれを別のファイルに取り込む。1つのファイルは複数の名前付きエクスポートとちょうど1つのデフォルトエクスポートを同時に持てる。" },
        { en: "Named imports must match the exported name exactly (`import { add }`, unless renamed with `as`); a default import can be given any local name (`import Calculator from \"./math.js\"`).", np: "Named imports ले exported name सँग exactly मिल्नुपर्छ (`import { add }`, `as` ले renamed नगरेसम्म); default import जुनसुकै local नामले import गर्न सकिन्छ।", jp: "名前付きインポートはエクスポート名と正確に一致する必要がある（`import { add }`、asで改名しない限り）。デフォルトインポートはどんなローカル名でも良い。" },
        { en: "Static `import` statements must sit at the top level of a file (never inside a conditional), which is exactly what lets bundlers tree-shake unused exports away.", np: "Static `import` statements file को top level मा नै हुनुपर्छ (conditional भित्र होइन), यही ले bundlers लाई unused exports tree-shake गर्न दिन्छ।", jp: "静的なimport文はファイルのトップレベルに置く必要がある（条件文の中は不可）。これがバンドラーが未使用のエクスポートをツリーシェイクできる理由。" },
        { en: "`await import(\"./path.js\")` is a dynamic import — it returns a Promise, can be called conditionally or lazily anywhere in code, unlike static import.", np: "`await import(\"./path.js\")` dynamic import हो — यसले Promise फर्काउँछ, static import भन्दा फरक जहाँसुकै conditionally call गर्न सकिन्छ।", jp: "`await import(\"./path.js\")`は動的importで、Promiseを返す。静的importとは異なり、コードのどこでも条件付きで呼べる。" },
      ],
      commonMistakes: [
        { en: "Forgetting curly braces on a named import (`import add from \"./math.js\"` instead of `import { add } from \"./math.js\"`).", np: "Named import मा curly braces बिर्सनु (`import { add } from \"./math.js\"` को सट्टा `import add from \"./math.js\"`)।", jp: "名前付きインポートで波括弧を忘れること（`import { add } from \"./math.js\"`ではなく`import add from \"./math.js\"`）。" },
        { en: "Using curly braces on a default import (`import { User } from \"./User.js\"` instead of `import User from \"./User.js\"`) — default exports don't have a name to match.", np: "Default import मा curly braces प्रयोग गर्नु (`import User from \"./User.js\"` को सट्टा `import { User } from \"./User.js\"`) — default exports सँग match गर्ने name नै हुँदैन।", jp: "デフォルトインポートで波括弧を使うこと（`import User from \"./User.js\"`ではなく`import { User } from \"./User.js\"`）。デフォルトエクスポートには一致させる名前がない。" },
        { en: "Trying to write more than one default export in the same file — a file can only have one; use named exports for anything beyond that.", np: "Same file मा एक भन्दा बढी default export लेख्ने प्रयास गर्नु — एउटा file मा एउटा मात्र हुन सक्छ; बाँकीका लागि named exports प्रयोग गर्ने।", jp: "同じファイルに2つ以上のデフォルトエクスポートを書こうとすること。1ファイルに1つしか持てない。それ以外は名前付きエクスポートを使う。" },
        { en: "Forgetting the file extension in an import path (`\"./math\"` instead of `\"./math.js\"`) — native ESM in the browser requires it, unlike bundler-based setups.", np: "Import path मा file extension बिर्सनु (`\"./math.js\"` को सट्टा `\"./math\"`) — browser को native ESM मा यो required हुन्छ।", jp: "importパスでファイル拡張子を忘れること（`\"./math.js\"`ではなく`\"./math\"`）。ブラウザのネイティブESMではこれが必要。" },
        { en: "Mixing CommonJS (`module.exports`) and ES Modules (`import`/`export`) syntax in the same file — they are different module systems, so pick one style per project.", np: "Same file मा CommonJS (`module.exports`) र ES Modules (`import`/`export`) syntax मिलाउनु — यी फरक module systems हुन्, project प्रति एउटा style मात्र छान्ने।", jp: "同じファイルでCommonJS（module.exports）とESモジュール（import/export）の構文を混ぜること。異なるモジュールシステムなので、プロジェクトごとに1つの方式を選ぶ。" },
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
