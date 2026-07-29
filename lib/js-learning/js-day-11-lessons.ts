import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_11_LESSONS: JsLessonDay = {
  day: 11,
  title: { en: "Callbacks & Promises — creation, states & chaining", np: "Callbacks र Promises — creation, states र chaining", jp: "コールバック・Promise — 作成・状態・チェーン" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "callbacks-error-first",
      title: { en: "Callbacks & the Error-First Convention", np: "Callbacks र Error-First Convention", jp: "コールバックとエラーファースト規約" },
      durationMinutes: 9,
      explanation: {
        en: "JavaScript runs <b>synchronously</b> by default — one line finishes before the next starts. But some operations take time (reading a file, calling an API, querying a database), and JavaScript can't just stop and wait without freezing the whole application. A <b>callback</b> is a function passed into another function so it can \"call you back\" once that time-consuming work finishes — e.g. `downloadFile(file => console.log(file))` means \"when the download finishes, run this.\" The function receiving the callback decides when — and how many times — to invoke it; you're handing over control instead of getting a return value directly.\n\nNode.js core modules settled on the <b>error-first callback</b> convention: `fn(err, data)` — the first argument is always an error (`null` if nothing went wrong), the second is the result — so you can always `if (err) return;` before touching `data`. It's just a convention, not a language rule, but it's followed almost universally in older APIs.\n\nThe real pain shows up when several async steps depend on each other: get a user, then their orders, then order details, then send an email. Nesting a callback inside a callback for every step produces <b>callback hell</b> (the \"pyramid of doom\") — code drifts rightward, error handling repeats at every level, and changing one step risks breaking the ones nested inside it. This exact problem is what Promises were built to solve.",
        np: "JavaScript default रूपमा synchronously चल्छ — एक line सकिएपछि मात्र अर्को सुरु हुन्छ। तर कतिपय operations (file पढ्नु, API call, database query) समय लिन्छन्, र JavaScript ले पूरै application freeze नगरी पर्खन सक्दैन। Callback भनेको अर्को function लाई pass गरिने function हो ताकि त्यो समय लिने काम सकिएपछि 'call back' गर्न सकोस् — जस्तै `downloadFile(file => console.log(file))` को मतलब हो 'download सकिएपछि यो चलाऊ'। Callback पाउने function ले नै कहिले (र कति पटक) invoke गर्ने भन्ने decide गर्छ, तपाईंले होइन।\n\nNode.js core modules ले <b>error-first callback</b> convention अपनाए: `fn(err, data)` — पहिलो argument सधैं error हो (`null` भए ठीक छ), दोस्रो result हो। यो केवल convention हो, language rule होइन, तर पुराना APIs मा लगभग universal रूपमा follow गरिन्छ।\n\nधेरै async steps एकअर्कामा depend गर्दा दुख्न थाल्छ — user, त्यसपछि orders, त्यसपछि order details, त्यसपछि email। हरेक step का लागि callback भित्र callback nest गर्दा callback hell (pyramid of doom) बन्छ — code दायाँतिर सर्छ, error handling दोहोरिन्छ, र एउटा step बदल्दा भित्रका अरू bिग्रन सक्छ। यही समस्या समाधान गर्न Promises बनाइयो।",
        jp: "JavaScriptはデフォルトで<b>同期的</b>に実行される — 1行が終わってから次が始まる。しかしファイル読み込みやAPI呼び出し、データベースクエリなど時間のかかる処理もあり、JavaScriptはアプリ全体を止めて待つわけにはいかない。<b>コールバック</b>とは、その時間のかかる処理が終わったときに「呼び戻して」もらうために別の関数に渡す関数のこと — 例えば`downloadFile(file => console.log(file))`は「ダウンロードが終わったらこれを実行して」という意味。コールバックを受け取る関数がいつ（何回）呼ぶかを決める。値を直接受け取るのではなく制御を委ねることになる。\n\nNode.jsのコアモジュールは<b>エラーファーストコールバック</b>という慣習に落ち着いた。`fn(err, data)` — 第一引数は常にエラー（問題がなければ`null`）、第二引数が結果。言語規則ではなく単なる慣習だが、古いAPIではほぼ普遍的に使われている。\n\n本当に厄介なのは複数の非同期ステップが互いに依存する場合 — ユーザー取得、注文取得、注文詳細取得、メール送信。ステップごとにコールバックの中にコールバックをネストすると<b>コールバック地獄</b>（ピラミッド・オブ・ドゥーム）になる — コードが右へずれ、エラー処理が各階層で繰り返され、あるステップを変更すると中にネストされた部分が壊れるリスクがある。まさにこの問題を解決するためにPromiseが作られた。",
      },
      diagram: `Synchronous:  Task A ──► Task B ──► Task C     (each waits for the previous)
Asynchronous: Task A starts ⇢ JS moves on to B/C ⇢ ... ⇢ A finishes ⇢ callback runs

fetchUser(id, callback)                Error-first convention:
      │                                fn(err, data)
      ▼                                      │      │
  [async work]                               │      └─ result (undefined if err)
      │                                      └─ Error instance | null
      ▼
  callback(err, data)   ← control handed back to whoever called fetchUser

Callback hell (pyramid of doom) — each step nested inside the last:
getUser(id, (err, user) => {
  getOrders(user.id, (err, orders) => {
    getOrderDetails(orders[0].id, (err, details) => {
      render(details);          ← real logic buried 3 levels deep
    });
  });
});`,
      codeExample: {
        title: { en: "Callback pattern, error-first convention & callback hell", np: "Callback pattern, error-first convention, callback hell", jp: "コールバックパターン・エラーファースト規約・コールバック地獄" },
        code: `// ── Synchronous vs asynchronous ─────────────────────────────────────
console.log("Start");
setTimeout(() => console.log("Finished"), 2000);   // does NOT block
console.log("End");
// Logs: Start, End, Finished — setTimeout schedules the callback for later

// ── A simple callback ────────────────────────────────────────────────
function greet(name, callback) {
  console.log("Hello " + name);
  callback();                       // "call back" once our work is done
}
greet("Rajan", () => console.log("Callback executed"));

// ── Error-first callback convention ──────────────────────────────────
function divide(a, b, callback) {
  if (b === 0) {
    callback("Cannot divide by zero", null);   // error first, null result
    return;
  }
  callback(null, a / b);                       // null error, real result
}
divide(10, 2, (err, result) => {
  if (err) { console.log(err); return; }
  console.log(result);   // 5
});
divide(10, 0, (err, result) => {
  if (err) { console.log(err); return; }   // "Cannot divide by zero"
});

// ── Real async example — error-first + a delay ───────────────────────
function getUser(id, callback) {
  setTimeout(() => {
    if (!id) { callback("User ID missing", null); return; }
    callback(null, { id, name: "Rajan" });
  }, 1000);
}
getUser(10, (err, user) => {
  if (err) { console.log(err); return; }
  console.log(user);   // { id: 10, name: "Rajan" }
});

// ── Callback hell — why Promises were invented ───────────────────────
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      console.log(details);   // real logic buried 3 levels deep
    });
  });
});`,
      },
      keyTakeaways: [
        { en: "JavaScript runs synchronously by default — a callback lets code react once a time-consuming operation (a timer, file read, network call) finishes, instead of freezing everything while it waits.", np: "JavaScript default रूपमा synchronously चल्छ — callback ले समय लिने operation (timer, file read, network call) सकिएपछि code लाई react गर्न दिन्छ, पर्खिरहेको बेला सबै freeze नगरी।", jp: "JavaScriptはデフォルトで同期的に実行される。コールバックは時間のかかる処理（タイマー、ファイル読み込み、ネットワーク呼び出し）が終わったときにコードが反応できるようにし、待っている間すべてを凍結しない。" },
        { en: "A callback is a function you hand to another function to be called later, once async work finishes — the callee decides when and how it's invoked, not you.", np: "Callback भनेको तपाईंले अर्को function लाई दिने function हो जुन async काम सकिएपछि पछि call हुन्छ — कहिले र कसरी invoke हुने भन्ने callee ले decide गर्छ, तपाईंले होइन।", jp: "コールバックとは、非同期処理が終わったときに後で呼び出してもらうために別の関数に渡す関数。いつどう呼ばれるかは呼び出される側が決める。" },
        { en: "The error-first convention `fn(err, data)` means the first argument is always the error (`null` on success) — always check it before touching `data`.", np: "Error-first convention `fn(err, data)` मा पहिलो argument सधैं error हो (सफल भए `null`) — `data` छुनुअघि सधैं यो check गर्नुहोस्।", jp: "エラーファースト規約`fn(err, data)`では第一引数は常にエラー（成功時null）。`data`を使う前に必ずこれを確認する。" },
        { en: "Nesting callbacks inside callbacks for dependent async steps produces callback hell (the pyramid of doom) — the exact problem Promises solve.", np: "Dependent async steps का लागि callbacks भित्र callbacks nest गर्दा callback hell (pyramid of doom) बन्छ — यही समस्या Promises ले solve गर्छ।", jp: "依存する非同期ステップのためにコールバックの中にコールバックをネストするとコールバック地獄（ピラミッド・オブ・ドゥーム）になる。これこそPromiseが解決する問題。" },
      ],
      commonMistakes: [
        { en: "Calling the callback immediately/synchronously (`function fetchData(callback) { callback(); }`) instead of only after the real async work finishes — this defeats the whole point of a callback.", np: "Callback लाई तुरुन्तै/synchronously call गर्नु (`function fetchData(callback) { callback(); }`) real async काम सकिएपछि मात्र गर्नुको सट्टा — यसले callback को पूरै उद्देश्य नै हराउँछ।", jp: "実際の非同期処理が終わった後だけでなく、コールバックをすぐに／同期的に呼ぶこと（`function fetchData(callback) { callback(); }`）。これはコールバックの意味そのものを失わせる。" },
        { en: "Forgetting to check `err` first inside a callback and using `data` directly, which crashes when the operation actually failed.", np: "Callback भित्र `err` पहिले check गर्न बिर्सेर सिधै `data` प्रयोग गर्नु, operation असफल भएको बेला crash हुन्छ।", jp: "コールバック内で`err`を先にチェックせず`data`を直接使い、実際に失敗したときにクラッシュすること。" },
        { en: "Nesting one callback inside another for every new dependent async step instead of restructuring the code — this is exactly how callback hell grows.", np: "हरेक नयाँ dependent async step का लागि code restructure गर्नुको सट्टा callback भित्र callback nest गर्दै जानु — callback hell यसरी नै बढ्छ।", jp: "コードを再構成せず、依存する非同期ステップが増えるたびにコールバックの中にコールバックをネストしていくこと。これがコールバック地獄が育つ仕組みそのもの。" },
        { en: "Assuming error-first is a JavaScript language rule enforced by the engine — it's only a convention, so a poorly written function can ignore it entirely.", np: "Error-first लाई engine ले enforce गर्ने JavaScript language rule हो भन्ने ठान्नु — यो केवल convention हो, त्यसैले नराम्रो लेखिएको function ले यसलाई पूर्ण रूपमा बेवास्ता गर्न सक्छ।", jp: "エラーファーストをエンジンが強制するJavaScriptの言語規則だと思い込むこと。これは単なる慣習なので、書き方の悪い関数は完全に無視できる。" },
      ],
      quiz: [
        {
          question: { en: "In the error-first callback convention `fn(err, data)`, what does a `null` first argument mean?", np: "Error-first callback convention `fn(err, data)` मा पहिलो argument `null` भएको मतलब के हो?", jp: "エラーファースト規約`fn(err, data)`で第一引数が`null`とはどういう意味？" },
          options: [
            { en: "The operation succeeded — no error occurred", np: "Operation सफल भयो — कुनै error भएन", jp: "処理が成功した — エラーは発生していない" },
            { en: "The operation is still pending", np: "Operation अझै pending छ", jp: "処理はまだ保留中" },
          ],
          correctIndex: 0,
          explanation: { en: "By convention, `null` in the error slot signals success; any other value there signals failure and should be handled first.", np: "Convention अनुसार, error slot मा `null` ले सफलता जनाउँछ; अर्को कुनै value ले असफलता जनाउँछ र पहिले handle गर्नुपर्छ।", jp: "慣習として、エラー位置の`null`は成功を示す。それ以外の値は失敗を示し、最初に処理すべき。" },
        },
        {
          question: { en: "What problem does deeply nesting callbacks for sequential, dependent async steps create?", np: "Sequential, dependent async steps का लागि callbacks गहिरो गरी nest गर्दा के समस्या हुन्छ?", jp: "連続した依存関係のある非同期ステップのためにコールバックを深くネストすると何が問題になる？" },
          options: [
            { en: "Callback hell — code drifts rightward and becomes hard to read and maintain", np: "Callback hell — code दायाँतिर सर्छ र पढ्न/maintain गर्न गाह्रो हुन्छ", jp: "コールバック地獄 — コードが右へずれ、読みにくく保守しにくくなる" },
            { en: "JavaScript throws a compile-time error for nesting too deeply", np: "JavaScript ले धेरै गहिरो nesting भएमा compile-time error throw गर्छ", jp: "JavaScriptがネストが深すぎるとしてコンパイル時エラーを投げる" },
          ],
          correctIndex: 0,
          explanation: { en: "There's no language-level limit on nesting — the real cost is readability and maintainability, which is why Promises were introduced.", np: "Nesting मा language-level limit हुँदैन — real cost readability र maintainability हो, त्यसैले Promises ल्याइयो।", jp: "言語レベルでのネスト制限はない。本当のコストは可読性と保守性であり、それがPromise導入の理由。" },
        },
        {
          question: { en: "Is the error-first callback convention (`fn(err, data)`) enforced by the JavaScript language itself?", np: "Error-first callback convention (`fn(err, data)`) JavaScript language ले नै enforce गर्छ?", jp: "エラーファーストコールバック規約（`fn(err, data)`）はJavaScript言語自体によって強制される？" },
          options: [
            { en: "No — it's just a widely followed convention, not a language rule", np: "होइन — यो व्यापक रूपमा followed convention मात्र हो, language rule होइन", jp: "いいえ — 広く従われている慣習にすぎず、言語規則ではない" },
            { en: "Yes — JavaScript requires all callbacks to follow this exact shape", np: "हो — JavaScript ले सबै callbacks लाई यही exact shape follow गर्न required गर्छ", jp: "はい — JavaScriptはすべてのコールバックがこの形に従うことを要求する" },
          ],
          correctIndex: 0,
          explanation: { en: "Nothing in JavaScript enforces this shape — it's a community/Node.js convention that most APIs happen to follow.", np: "JavaScript मा यो shape enforce गर्ने केही छैन — यो community/Node.js convention हो जुन धेरै APIs ले follow गर्छन्।", jp: "JavaScriptにはこの形を強制するものはない。ほとんどのAPIがたまたま従っているコミュニティ／Node.jsの慣習に過ぎない。" },
        },
      ],
    },
    {
      id: "creating-consuming-promises",
      title: { en: "Creating & Consuming Promises", np: "Promises Create र Consume गर्नु", jp: "Promiseの作成と利用" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>Promise</b> is a placeholder object for a value that may arrive now, later, or never — like an order number at a restaurant: it isn't the food itself, but a stand-in for a result that's still on the way. You create one with `new Promise((resolve, reject) => {...})`; the function you pass in — the <b>executor</b> — runs immediately and receives two functions: call `resolve(value)` when the work succeeds, call `reject(reason)` when it fails.\n\nA Promise is always in exactly one of three states: <b>pending</b> (still working), <b>fulfilled</b> (resolved with a value), or <b>rejected</b> (failed with a reason) — internally it's just an object like `{ state: \"pending\", result: undefined }` that updates once settled. It can only move forward, never backward, and once it's fulfilled or rejected it is <b>settled</b> and can never change state again, no matter how many more times `resolve` or `reject` are called.\n\nYou consume a Promise with `.then(onFulfilled)` for success and `.catch(onRejected)` for errors — `.catch(fn)` is just shorthand for `.then(undefined, fn)`. `.finally(fn)` runs regardless of outcome, with no arguments passed in, making it the right spot for cleanup like hiding a loading spinner. A function that creates a Promise must actually `return` it — otherwise the caller has nothing to `.then()` onto.",
        np: "Promise भनेको value को placeholder object हो जुन अहिले, पछि, वा कहिल्यै नआउन सक्छ — restaurant को order number जस्तै: यो खाना आफैं होइन, आइरहेको result को stand-in मात्र हो। `new Promise((resolve, reject) => {...})` ले create गरिन्छ; pass गरिएको function — executor — तुरुन्तै चल्छ र दुई functions पाउँछ: सफल भए `resolve(value)`, असफल भए `reject(reason)`।\n\nPromise सधैं तीन states मध्ये एउटामा हुन्छ: pending (अझै काम भइरहेको), fulfilled (value सहित resolve भएको), वा rejected (reason सहित fail भएको) — भित्री रूपमा यो `{ state: \"pending\", result: undefined }` जस्तो object हो जुन settle भएपछि update हुन्छ। यो अगाडि मात्र बढ्छ, पछाडि कहिल्यै फर्किंदैन, र एक पटक settled भएपछि फेरि कहिल्यै state बदलिँदैन।\n\n`.then(onFulfilled)` ले success handle गरिन्छ, `.catch(onRejected)` ले errors — `.catch(fn)` `.then(undefined, fn)` को shorthand मात्र हो। `.finally(fn)` result जे भए पनि argument बिना चल्छ, loading spinner hide गर्ने जस्ता cleanup का लागि सहि ठाउँ। Promise बनाउने function ले त्यसलाई `return` गर्नैपर्छ — नत्र caller सँग `.then()` गर्ने केही हुँदैन।",
        jp: "Promiseは今、後、あるいは決して届かないかもしれない値のためのプレースホルダーオブジェクト — レストランの注文番号のように、それ自体は料理ではなく、まだ届いていない結果のスタンドイン。`new Promise((resolve, reject) => {...})`で作成する。渡す関数（エグゼキュータ）は即座に実行され、2つの関数を受け取る。成功したら`resolve(value)`、失敗したら`reject(reason)`を呼ぶ。\n\nPromiseは常に3つの状態のうちいずれか1つ — pending（処理中）、fulfilled（値と共に成功）、rejected（理由と共に失敗） — であり、内部的には確定すると更新される`{ state: \"pending\", result: undefined }`のようなオブジェクトに過ぎない。前にしか進まず、一度確定すると二度と状態は変わらない。\n\n成功は`.then(onFulfilled)`、エラーは`.catch(onRejected)`で処理する — `.catch(fn)`は`.then(undefined, fn)`の糖衣構文にすぎない。`.finally(fn)`は結果に関わらず引数なしで実行され、ローディングスピナーを隠すようなクリーンアップに最適。Promiseを作る関数はそれを`return`しなければならない — そうしないと呼び出し側は`.then()`する対象を持たない。",
      },
      diagram: `Mental model: a Promise is like an order number at a restaurant —
not the food itself, just a stand-in for a result that's coming.

new Promise((resolve, reject) => { ... })
                 │
                 ▼
          ┌─────────────┐
          │   PENDING   │  { state: "pending", result: undefined }
          └──────┬──────┘
        resolve()│        │reject()
                 ▼        ▼
        ┌─────────────┐ ┌─────────────┐
        │  FULFILLED  │ │  REJECTED   │
        │ {result:val}│ │ {result:err}│
        └─────────────┘ └─────────────┘
             SETTLED — locked in forever, can only move forward, only ONCE

.then(onFulfilled) ──── runs when FULFILLED
.catch(onRejected) ──── runs when REJECTED  (shorthand for .then(undefined, fn))
.finally(fn)       ──── runs EITHER way, receives no arguments`,
      codeExample: {
        title: { en: "new Promise(), then(), catch(), finally()", np: "new Promise(), then(), catch(), finally()", jp: "Promiseの作成と then・catch・finally" },
        code: `// ── Simple Promise — resolve immediately ────────────────────────────
const greeting = new Promise(resolve => resolve("Hello JavaScript"));
greeting.then(message => console.log(message));   // "Hello JavaScript"

// ── Creating a Promise with async work ───────────────────────────────
const fetchUser = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) reject(new Error("ID must be positive"));
      else resolve({ id, name: "Alice" });
    }, 1000);
  });

// ── Consuming: then / catch / finally ────────────────────────────────
fetchUser(1)
  .then(user => console.log("Got user:", user.name))
  .catch(err  => console.error("Failed:", err.message))
  .finally(() => console.log("Always runs"));

// ── A Promise can only settle ONCE ───────────────────────────────────
new Promise((resolve, reject) => {
  resolve("first");
  reject(new Error("ignored"));   // too late — already settled, no-op
  resolve("also ignored");        // also a no-op
}).then(value => console.log(value)); // "first"

// ── Real backend example — reject with a real Error ──────────────────
function findUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id) resolve({ id, name: "Rajan" });
      else reject(new Error("User not found"));
    }, 1000);
  });
}
findUser(10)
  .then(user => console.log(user))     // { id: 10, name: "Rajan" }
  .catch(err  => console.log(err.message));

// ── Wrapping a callback API in a Promise ──────────────────────────────
const fs = require("fs");
const readFilePromise = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

readFilePromise("./config.json")
  .then(data => console.log("File contents:", data))
  .catch(err  => console.error("Could not read file:", err.message));`,
      },
      keyTakeaways: [
        { en: "A Promise is a placeholder for a future value — like a restaurant order number, it stands in for a result that's still on the way, not the result itself.", np: "Promise भविष्यको value को placeholder हो — restaurant order number जस्तै, यो आइरहेको result को stand-in हो, result आफैं होइन।", jp: "Promiseは将来の値のためのプレースホルダー — レストランの注文番号のように、それ自体は結果ではなく、まだ届いていない結果のスタンドイン。" },
        { en: "The executor passed to `new Promise((resolve, reject) => {...})` runs immediately; calling `resolve(value)` or `reject(reason)` settles the Promise.", np: "`new Promise((resolve, reject) => {...})` मा pass गरिएको executor तुरुन्तै चल्छ; `resolve(value)` वा `reject(reason)` call गर्दा Promise settle हुन्छ।", jp: "`new Promise((resolve, reject) => {...})`に渡すエグゼキュータは即座に実行され、`resolve(value)`か`reject(reason)`を呼ぶとPromiseが確定する。" },
        { en: "A Promise is always pending, fulfilled, or rejected — it can only move forward, and once settled it never changes state again, even if resolve/reject is called more.", np: "Promise सधैं pending, fulfilled, वा rejected मध्ये एउटा हुन्छ — यो अगाडि मात्र बढ्छ, र एक पटक settled भएपछि फेरि resolve/reject call गरे पनि state बदलिँदैन।", jp: "Promiseは常にpending・fulfilled・rejectedのいずれか。前にしか進まず、一度確定するとresolve/rejectを再度呼んでも状態は二度と変わらない。" },
        { en: "`.catch(fn)` is shorthand for `.then(undefined, fn)`, and `.finally(fn)` runs no matter the outcome with no arguments — ideal for guaranteed cleanup.", np: "`.catch(fn)` `.then(undefined, fn)` को shorthand हो, र `.finally(fn)` result जे भए पनि argument बिना चल्छ — guaranteed cleanup का लागि उपयुक्त।", jp: "`.catch(fn)`は`.then(undefined, fn)`の糖衣構文で、`.finally(fn)`は結果に関わらず引数なしで実行される。確実なクリーンアップに最適。" },
        { en: "A function that creates a Promise must `return` it — otherwise whoever calls the function has nothing to `.then()` or `.catch()` onto.", np: "Promise बनाउने function ले त्यसलाई `return` गर्नैपर्छ — नत्र त्यो function call गर्नेसँग `.then()` वा `.catch()` गर्ने केही हुँदैन।", jp: "Promiseを作る関数はそれを`return`しなければならない。そうしないと呼び出し側は`.then()`や`.catch()`する対象を持たない。" },
      ],
      commonMistakes: [
        { en: "Writing `new Promise(...)` inside a function but forgetting to `return` it — the caller gets `undefined` instead of a usable Promise.", np: "Function भित्र `new Promise(...)` लेखेर तर `return` गर्न बिर्सनु — caller ले usable Promise को सट्टा `undefined` पाउँछ।", jp: "関数内で`new Promise(...)`を書いたが`return`し忘れること。呼び出し側は使えるPromiseの代わりに`undefined`を受け取る。" },
        { en: "Assuming a later `resolve()` or `reject()` call overrides an earlier one — only the first call to either wins; every call after that is a silent no-op.", np: "पछिको `resolve()` वा `reject()` call ले पहिलेकोलाई override गर्छ भन्ने ठान्नु — पहिलो call मात्र मान्य हुन्छ; त्यसपछिका सबै calls silently no-op हुन्छन्।", jp: "後の`resolve()`や`reject()`が先の呼び出しを上書きすると思い込むこと。実際は最初の呼び出しだけが有効で、それ以降はすべて黙って無視される。" },
        { en: "Rejecting with something other than an `Error` (e.g. `reject(console.log(\"Error\"))`, which rejects with `undefined`) instead of `reject(new Error(\"...\"))`.", np: "`reject(new Error(\"...\"))` को सट्टा `Error` बाहेक अरू केही सँग reject गर्नु (जस्तै `reject(console.log(\"Error\"))`, जसले `undefined` सँग reject गर्छ)।", jp: "`reject(new Error(\"...\"))`の代わりに`Error`以外のものでrejectすること（例：`undefined`でrejectする`reject(console.log(\"Error\"))`）。" },
        { en: "Forgetting `.catch()` entirely, so a failed Promise's error disappears silently instead of being handled.", np: "`.catch()` नै बिर्सनु, जसले गर्दा failed Promise को error handle नभई silently हराउँछ।", jp: "`.catch()`を完全に忘れること。失敗したPromiseのエラーが処理されずに黙って消えてしまう。" },
        { en: "Confusing the Promise object with its eventual value — `const user = fetchUser(); user.name` fails because `fetchUser()` returns a Promise, not the user; you need `.then(user => user.name)`.", np: "Promise object लाई त्यसको eventual value सँग confuse गर्नु — `const user = fetchUser(); user.name` fail हुन्छ किनकि `fetchUser()` ले user होइन Promise फर्काउँछ; `.then(user => user.name)` चाहिन्छ।", jp: "Promiseオブジェクトを最終的な値と混同すること。`const user = fetchUser(); user.name`は失敗する。`fetchUser()`はユーザーではなくPromiseを返すため。`.then(user => user.name)`が必要。" },
      ],
      quiz: [
        {
          question: { en: "If a Promise's executor calls `resolve(\"a\")` and then later calls `reject(new Error(\"b\"))`, what happens?", np: "Promise को executor ले `resolve(\"a\")` call गरेपछि `reject(new Error(\"b\"))` call गर्यो भने के हुन्छ?", jp: "Promiseのエグゼキュータが`resolve(\"a\")`を呼んだ後に`reject(new Error(\"b\"))`を呼んだらどうなる？" },
          options: [
            { en: "Nothing — the Promise is already fulfilled with \"a\"; the reject call is ignored", np: "केही हुँदैन — Promise पहिले नै \"a\" सहित fulfilled भइसक्यो; reject call ignore हुन्छ", jp: "何も起きない — Promiseはすでに\"a\"でfulfilledされており、reject呼び出しは無視される" },
            { en: "The Promise switches to rejected with \"b\"", np: "Promise \"b\" सहित rejected मा switch हुन्छ", jp: "Promiseは\"b\"でrejectedに切り替わる" },
          ],
          correctIndex: 0,
          explanation: { en: "A Promise settles only once — the first resolve/reject call wins, and every call after that has no effect.", np: "Promise एकपल्ट मात्र settle हुन्छ — पहिलो resolve/reject call मान्य हुन्छ, त्यसपछिका calls को कुनै असर हुँदैन।", jp: "Promiseは一度だけ確定する。最初のresolve/reject呼び出しが有効になり、それ以降の呼び出しは効果を持たない。" },
        },
        {
          question: { en: "What is `.catch(fn)` shorthand for?", np: "`.catch(fn)` कसको shorthand हो?", jp: "`.catch(fn)`は何の糖衣構文？" },
          options: [
            { en: "`.then(undefined, fn)`", np: "`.then(undefined, fn)`", jp: "`.then(undefined, fn)`" },
            { en: "`.then(fn, undefined)`", np: "`.then(fn, undefined)`", jp: "`.then(fn, undefined)`" },
          ],
          correctIndex: 0,
          explanation: { en: "`.catch()` registers only a rejection handler, which is exactly what passing `undefined` as `.then()`'s first argument and `fn` as the second does.", np: "`.catch()` ले rejection handler मात्र register गर्छ, जुन `.then()` को पहिलो argument मा `undefined` र दोस्रोमा `fn` पास गरेसरह हो।", jp: "`.catch()`はrejectionハンドラだけを登録する。これは`.then()`の第一引数に`undefined`、第二引数に`fn`を渡すのと同じこと。" },
        },
        {
          question: { en: "Does `.finally(fn)` receive the resolved value or rejection reason as an argument?", np: "`.finally(fn)` ले resolved value वा rejection reason argument को रूपमा पाउँछ?", jp: "`.finally(fn)`は解決値や拒否理由を引数として受け取る？" },
          options: [
            { en: "No — `fn` runs with no arguments, since it must behave the same either way", np: "होइन — `fn` कुनै argument बिना चल्छ, किनकि यसले दुवै अवस्थामा उस्तै behave गर्नुपर्छ", jp: "いいえ — `fn`は引数なしで実行される。どちらの場合も同じ動作をする必要があるため" },
            { en: "Yes — it always receives the resolved value", np: "हो — यसले सधैं resolved value पाउँछ", jp: "はい — 常に解決値を受け取る" },
          ],
          correctIndex: 0,
          explanation: { en: "`.finally()` is meant purely for side effects that must happen regardless of outcome, so it intentionally gets no arguments.", np: "`.finally()` result जे भए पनि हुनुपर्ने side effects का लागि हो, त्यसैले यसले जानाजानी कुनै argument पाउँदैन।", jp: "`.finally()`は結果に関わらず発生すべき副作用のためのものなので、意図的に引数を受け取らない。" },
        },
      ],
    },
    {
      id: "promise-chaining",
      title: { en: "Promise Chaining", np: "Promise Chaining", jp: "Promiseのチェーン" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Promise chaining</b> connects multiple asynchronous steps together instead of nesting them, like an assembly line where each worker finishes one step and passes the result to the next: `firstTask().then(secondTask).then(thirdTask).catch(handleError)`. Each call to `.then()` returns a <b>brand-new Promise</b>, which is what makes this possible — whatever you `return` inside a `.then()` callback becomes the value the next `.then()` receives.\n\nIf the callback passed to `.then()` returns a plain value (a string, number, object), that value is automatically wrapped in an already-resolved Promise; if it returns <b>another Promise</b> — e.g. `getUser().then(user => getOrders(user.id))` — the chain pauses and waits for that Promise to settle before continuing. This is exactly how you sequence dependent async calls, like validating a user, then creating a payment, then saving the transaction, each step feeding the next. It's also how the browser's `fetch()` API works: `fetch(url).then(response => response.json()).then(data => ...)` — `response.json()` itself returns a Promise, so you return it to let the chain wait.\n\nErrors propagate automatically down a chain: if any `.then()` callback throws, or if the Promise it returns rejects, control jumps straight to the nearest `.catch()` further down the chain, skipping every `.then()` in between — which is why a chain usually only needs one `.catch()` at the end, acting as a single safety net for every step above it. The most common bug is forgetting to `return` a nested async call inside `.then()`: without `return`, the next `.then()` receives `undefined` instead of waiting for the real result.",
        np: "Promise chaining ले धेरै async steps लाई nest नगरी जोड्छ, assembly line जस्तै — हरेक worker ले एक step सकाएर अर्कोलाई result दिन्छ: `firstTask().then(secondTask).then(thirdTask).catch(handleError)`। `.then()` को हरेक call ले नयाँ Promise फर्काउँछ, यसैले यो सम्भव हुन्छ — `.then()` callback भित्र जे `return` गरिन्छ त्यही अर्को `.then()` ले पाउँछ।\n\n`.then()` ले plain value (string, number, object) फर्काए त्यो automatically resolved Promise मा wrap हुन्छ; अर्को Promise फर्काए (जस्तै `getUser().then(user => getOrders(user.id))`), chain त्यो settle नभएसम्म पर्खन्छ। यसैले user validate गर्ने, payment बनाउने, त्यसपछि transaction save गर्ने जस्ता dependent steps sequence मा राखिन्छन्। Browser को `fetch()` API पनि यसरी नै काम गर्छ: `response.json()` ले पनि Promise फर्काउँछ, त्यसैले त्यसलाई return गरी chain लाई पर्खाइन्छ।\n\nChain मा errors automatically propagate हुन्छन्: कुनै `.then()` throw भयो वा उसले फर्काएको Promise reject भयो भने, control सिधै तलको नजिकको `.catch()` मा jump गर्छ, बीचका सबै `.then()` skip गर्दै — त्यसैले chain को अन्तमा एउटा मात्र `.catch()` प्रायः पुग्छ। सबैभन्दा common bug हो `.then()` भित्र nested async call लाई `return` गर्न बिर्सनु।",
        jp: "<b>Promiseチェーン</b>は複数の非同期ステップをネストする代わりに連結する。組立ライン（アセンブリライン）のように、各作業員が1つのステップを終えて結果を次に渡す: `firstTask().then(secondTask).then(thirdTask).catch(handleError)`。`.then()`の呼び出しはそれぞれ<b>新しいPromise</b>を返す。これがこれを可能にする仕組みで、`.then()`のコールバック内で`return`したものが次の`.then()`が受け取る値になる。\n\n`.then()`に渡したコールバックが通常の値（文字列、数値、オブジェクト）を返せば、その値は自動的にすでに解決済みのPromiseにラップされる。<b>別のPromise</b>を返せば（例：`getUser().then(user => getOrders(user.id))`）、チェーンはそのPromiseが確定するまで待ってから続行する。これがまさにユーザーの検証、支払いの作成、取引の保存のように、各ステップが次に結果を渡す依存する非同期呼び出しを順序付ける方法。ブラウザの`fetch()` APIも同様に動作する：`response.json()`自体もPromiseを返すので、それをreturnしてチェーンに待たせる。\n\nエラーはチェーンを自動的に伝播する。`.then()`のコールバックが例外を投げるか、返したPromiseがrejectされると、制御はチェーンの下にある最も近い`.catch()`に直接ジャンプし、間のすべての`.then()`をスキップする — だからこそチェーンの最後に1つの`.catch()`があれば十分なことが多い。最もよくあるバグは`.then()`内でネストした非同期呼び出しの`return`を忘れること。",
      },
      diagram: `Assembly line: each worker finishes one step and hands the result to the next.

getUser(id)
   .then(user    => getOrders(user.id))     ← returns a Promise, chain WAITS for it
   .then(orders  => orders[0].id)           ← returns a plain value, auto-wrapped
   .then(orderId => getOrderDetails(orderId))
   .then(details => render(details))
   .catch(err    => showError(err));        ← ONE catch, handles errors from ANY step above

fetch(url)
   .then(response => response.json())       ← response.json() ALSO returns a Promise
   .then(data     => console.log(data));

   thrown error / rejected promise anywhere in the chain
                        │
                        ▼
   skips every remaining .then() ──► lands directly in nearest .catch()`,
      codeExample: {
        title: { en: "Chaining async steps without nesting", np: "Nesting बिना async steps chain गर्नु", jp: "ネストなしで非同期ステップをチェーン" },
        code: `// ── Promise chain vs callback hell — same logic, cleaner structure ──
getUser(userId)
  .then(user    => getOrders(user.id))
  .then(orders  => getOrderDetails(orders[0].id))
  .then(details => render(details))
  .catch(err    => showError(err));  // ONE catch handles errors from every step above

// ── Returning a value vs returning a Promise from .then() ───────────
Promise.resolve(1)
  .then(n => n + 1)                    // returns 2 — wrapped in a resolved Promise
  .then(n => Promise.resolve(n * 2))   // returns a Promise — chain waits for it
  .then(n => console.log(n));          // 4

// ── Real backend example — each step feeds the next ──────────────────
function validateUser() { return Promise.resolve({ id: 10, name: "Rajan" }); }
function createPayment(user) { return Promise.resolve({ paymentId: 500, userId: user.id }); }
function saveTransaction(payment) { return Promise.resolve("Transaction saved"); }

validateUser()
  .then(user    => createPayment(user))
  .then(payment => saveTransaction(payment))
  .then(message => console.log(message))   // "Transaction saved"
  .catch(err    => console.log(err));

// ── The fetch() API — a real-world Promise chain ──────────────────────
fetch("https://api.example.com/users")
  .then(response => response.json())   // response.json() ALSO returns a Promise
  .then(users    => console.log(users))
  .catch(err     => console.log(err));

// ── Errors skip straight to the nearest .catch() ─────────────────────
Promise.resolve()
  .then(() => { throw new Error("step 2 failed"); })
  .then(() => console.log("this never runs"))   // skipped entirely
  .catch(err => console.error("Caught:", err.message)); // "Caught: step 2 failed"

// ── Common mistake: forgetting to return inside .then() ─────────────
// ❌ Bug — nothing is returned, so the next .then() gets undefined
getUser(userId)
  .then(user => {
    fetchOrders(user.id);   // forgot return!
  })
  .then(orders => console.log(orders)); // undefined

// ✅ Fixed — returning the Promise lets the chain wait for the real result
getUser(userId)
  .then(user => fetchOrders(user.id))   // return the Promise
  .then(orders => console.log(orders)); // the actual orders array`,
      },
      keyTakeaways: [
        { en: "Promise chaining connects dependent async steps like an assembly line — each `.then()` returns a brand-new Promise, which is what allows flat chaining (`.then().then().then()`) instead of nested callbacks.", np: "Promise chaining ले dependent async steps लाई assembly line जस्तै जोड्छ — हरेक `.then()` ले नयाँ Promise फर्काउँछ, यसैले nested callbacks को सट्टा flat chaining सम्भव हुन्छ।", jp: "Promiseチェーンは依存する非同期ステップを組立ラインのように連結する。各`.then()`は新しいPromiseを返し、これがネストしたコールバックの代わりにフラットなチェーンを可能にする。" },
        { en: "Returning a plain value from `.then()` wraps it in a resolved Promise immediately; returning another Promise makes the chain wait for it to settle first — this is how `fetch(url).then(res => res.json())` works.", np: "`.then()` बाट plain value फर्काउँदा तुरुन्तै resolved Promise भित्र wrap हुन्छ; अर्को Promise फर्काउँदा chain त्यो settle नभएसम्म पर्खन्छ — यसरी नै `fetch(url).then(res => res.json())` काम गर्छ।", jp: "`.then()`から通常の値を返すと即座に解決済みPromiseにラップされる。別のPromiseを返すと、チェーンはそれが確定するまで先に待つ。これが`fetch(url).then(res => res.json())`の仕組み。" },
        { en: "A thrown error or rejected Promise anywhere in a chain skips every remaining `.then()` and jumps straight to the nearest `.catch()`, so one `.catch()` at the end usually covers the whole chain.", np: "Chain मा जहाँसुकै throw भएको error वा rejected Promise ले बाँकी सबै `.then()` skip गरी सिधै नजिकको `.catch()` मा jump गर्छ, त्यसैले अन्तको एउटा `.catch()` ले प्रायः पूरै chain cover गर्छ।", jp: "チェーンのどこかで投げられたエラーやrejectされたPromiseは、残りの`.then()`をすべてスキップして最も近い`.catch()`に直接ジャンプする。だから最後の1つの`.catch()`で通常チェーン全体をカバーできる。" },
        { en: "Forgetting to `return` a nested async call inside `.then()` is the most common chaining bug — the next `.then()` then receives `undefined` instead of the real result.", np: "`.then()` भित्र nested async call `return` गर्न बिर्सनु सबैभन्दा common chaining bug हो — त्यसपछिको `.then()` ले वास्तविक result को सट्टा `undefined` पाउँछ।", jp: "`.then()`内でネストした非同期呼び出しの`return`を忘れることが最もよくあるチェーンのバグ。次の`.then()`は本当の結果の代わりに`undefined`を受け取る。" },
      ],
      commonMistakes: [
        { en: "Forgetting to `return` a nested async call inside `.then()` — the next `.then()` then receives `undefined` instead of waiting for the real result.", np: "`.then()` भित्र nested async call `return` गर्न बिर्सनु — त्यसपछिको `.then()` ले वास्तविक result पर्खनुको सट्टा `undefined` पाउँछ।", jp: "`.then()`内でネストした非同期呼び出しの`return`を忘れること。次の`.then()`は本当の結果を待つ代わりに`undefined`を受け取る。" },
        { en: "Wrapping an already-available value in a new Promise unnecessarily (`return new Promise(resolve => resolve(user))`) instead of just `return user` — `.then()` already handles plain values fine.", np: "पहिले नै उपलब्ध value लाई अनावश्यक रूपमा नयाँ Promise भित्र wrap गर्नु (`return new Promise(resolve => resolve(user))`) `return user` को सट्टा — `.then()` ले plain values पहिले नै राम्रोसँग handle गर्छ।", jp: "すでに利用可能な値を単に`return user`とする代わりに不必要に新しいPromiseでラップすること（`return new Promise(resolve => resolve(user))`）。`.then()`は通常の値をすでにうまく処理する。" },
        { en: "Chaining steps in the wrong logical order (e.g. `savePayment().then(createPayment).then(validateUser)`) — each step needs the previous step's result, so the order must match the real dependency.", np: "Steps लाई गलत logical order मा chain गर्नु (जस्तै `savePayment().then(createPayment).then(validateUser)`) — हरेक step ले अघिल्लो step को result चाहिन्छ, त्यसैले order real dependency सँग मिल्नुपर्छ।", jp: "誤った論理順序でステップをチェーンすること（例：`savePayment().then(createPayment).then(validateUser)`）。各ステップは前のステップの結果を必要とするため、順序は実際の依存関係と一致する必要がある。" },
        { en: "Adding a `.catch()` after every single `.then()` instead of one at the end of the chain — this duplicates handling and can accidentally swallow errors from later steps.", np: "Chain को अन्तमा एउटा `.catch()` राख्नुको सट्टा हरेक `.then()` पछि छुट्टै `.catch()` थप्नु — यसले handling duplicate गर्छ र पछिका steps का errors गलतीले swallow गर्न सक्छ।", jp: "チェーンの最後に1つの`.catch()`を置く代わりに、各`.then()`の後に個別の`.catch()`を追加すること。処理が重複し、後のステップのエラーを誤って握りつぶす可能性がある。" },
        { en: "Assuming a rejected Promise only stops the very next `.then()` — it actually skips all remaining `.then()` calls until it finds a `.catch()`.", np: "Rejected Promise ले केवल त्यसपछिको `.then()` लाई मात्र रोक्छ भन्ने ठान्नु — वास्तवमा यसले `.catch()` नभेट्दासम्म बाँकी सबै `.then()` calls skip गर्छ।", jp: "rejectされたPromiseが次の`.then()`だけを止めると思い込むこと。実際には`.catch()`が見つかるまで残りのすべての`.then()`をスキップする。" },
      ],
      quiz: [
        {
          question: { en: "What does calling `.then()` on a Promise return?", np: "Promise मा `.then()` call गर्दा के फर्काउँछ?", jp: "Promiseに対して`.then()`を呼ぶと何が返る？" },
          options: [
            { en: "A brand-new Promise", np: "एउटा नयाँ Promise", jp: "新しいPromise" },
            { en: "The same Promise it was called on", np: "जुन Promise मा call गरिएको थियो त्यही", jp: "呼び出された同じPromise" },
          ],
          correctIndex: 0,
          explanation: { en: "Every `.then()` call produces a new Promise, which is exactly what allows further `.then()`/`.catch()` calls to be chained onto it.", np: "हरेक `.then()` call ले नयाँ Promise बनाउँछ, यसैले थप `.then()`/`.catch()` calls chain गर्न सकिन्छ।", jp: "各`.then()`呼び出しは新しいPromiseを生成する。これがさらに`.then()`/`.catch()`をチェーンできる理由。" },
        },
        {
          question: { en: "In `Promise.resolve(1).then(n => Promise.resolve(n * 2)).then(n => console.log(n))`, what gets logged?", np: "`Promise.resolve(1).then(n => Promise.resolve(n * 2)).then(n => console.log(n))` मा के log हुन्छ?", jp: "`Promise.resolve(1).then(n => Promise.resolve(n * 2)).then(n => console.log(n))`で何がログに出る？" },
          options: [
            { en: "2 — the chain waits for the returned Promise to settle before continuing", np: "2 — chain ले फर्काएको Promise settle नभएसम्म पर्खन्छ", jp: "2 — チェーンは返されたPromiseが確定するのを待ってから続行する" },
            { en: "A pending Promise object, not a number", np: "एउटा pending Promise object, number होइन", jp: "数値ではなくpending状態のPromiseオブジェクト" },
          ],
          correctIndex: 0,
          explanation: { en: "When a `.then()` callback returns a Promise, the chain automatically waits for it to settle and passes along its resolved value.", np: "`.then()` callback ले Promise फर्काउँदा, chain ले त्यो settle नभएसम्म automatically पर्खन्छ र resolved value पास गर्छ।", jp: "`.then()`のコールバックがPromiseを返すと、チェーンは自動的にそれが確定するのを待ち、解決した値を渡す。" },
        },
        {
          question: { en: "In `.then(a).then(b).then(c).catch(err)`, if `b` throws an error, does `c`'s `.then()` callback still run?", np: "`.then(a).then(b).then(c).catch(err)` मा `b` ले error throw गर्यो भने `c` को `.then()` callback चल्छ?", jp: "`.then(a).then(b).then(c).catch(err)`で`b`がエラーを投げたら、`c`の`.then()`コールバックは実行される？" },
          options: [
            { en: "No — the error skips straight to `.catch(err)`, bypassing `c`", np: "होइन — error सिधै `.catch(err)` मा जान्छ, `c` bypass गरेर", jp: "いいえ — エラーは`c`を飛ばして直接`.catch(err)`にジャンプする" },
            { en: "Yes — `c` still runs with the error as its argument", np: "हो — `c` अझै error लाई argument को रूपमा लिएर चल्छ", jp: "はい — `c`はエラーを引数として実行される" },
          ],
          correctIndex: 0,
          explanation: { en: "A thrown error inside a `.then()` callback propagates past every remaining `.then()` in the chain until it reaches a `.catch()`.", np: "`.then()` callback भित्र throw भएको error ले `.catch()` नभेट्दासम्म बाँकी सबै `.then()` लाई bypass गर्छ।", jp: "`.then()`コールバック内で投げられたエラーは、`.catch()`に到達するまでチェーン内の残りのすべての`.then()`を飛び越えて伝播する。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "In the error-first callback convention, what does the first argument represent?", np: "Error-first callback convention मा पहिलो argument ले के represent गर्छ?", jp: "エラーファーストコールバック規約で第一引数は何を表す？" },
      options: [{ en: "The error (null on success)", np: "Error (सफल भए null)", jp: "エラー（成功時はnull）" }, { en: "The result data", np: "Result data", jp: "結果データ" }],
      correctIndex: 0,
      explanation: { en: "By convention the first argument is always the error, `null` if nothing went wrong.", np: "Convention अनुसार पहिलो argument सधैं error हो, केही गडबड नभए `null`।", jp: "慣習として第一引数は常にエラーで、問題がなければ`null`。" },
    },
    {
      question: { en: "What is 'callback hell'?", np: "'Callback hell' के हो?", jp: "「コールバック地獄」とは何か？" },
      options: [{ en: "Deeply nested callbacks for dependent async steps, hard to read and maintain", np: "Dependent async steps का लागि गहिरो nested callbacks, पढ्न/maintain गर्न गाह्रो", jp: "依存する非同期ステップのために深くネストされたコールバックで、読みにくく保守しにくい" }, { en: "A JavaScript runtime error thrown after too many callbacks", np: "धेरै callbacks पछि JavaScript runtime ले throw गर्ने error", jp: "コールバックが多すぎる後にJavaScriptランタイムが投げるエラー" }],
      correctIndex: 0,
      explanation: { en: "It's a readability/maintainability problem, not a runtime error — and it's exactly what Promises were designed to fix.", np: "यो readability/maintainability समस्या हो, runtime error होइन — र यही समस्या समाधान गर्न Promises बनाइयो।", jp: "これは可読性・保守性の問題であり、ランタイムエラーではない。まさにPromiseが解決するために設計されたもの。" },
    },
    {
      question: { en: "Is the error-first callback convention enforced by the JavaScript language?", np: "Error-first callback convention JavaScript language ले enforce गर्छ?", jp: "エラーファーストコールバック規約はJavaScript言語によって強制される？" },
      options: [{ en: "No — it's just a widely followed convention", np: "होइन — यो व्यापक रूपमा followed convention मात्र हो", jp: "いいえ — 広く従われている慣習にすぎない" }, { en: "Yes — it's part of the language spec", np: "हो — यो language spec को भाग हो", jp: "はい — 言語仕様の一部" }],
      correctIndex: 0,
      explanation: { en: "It's a Node.js/community convention, not something the JavaScript engine enforces.", np: "यो Node.js/community convention हो, JavaScript engine ले enforce गर्ने कुरा होइन।", jp: "これはNode.js／コミュニティの慣習であり、JavaScriptエンジンが強制するものではない。" },
    },
    {
      question: { en: "What runs the executor function passed to `new Promise((resolve, reject) => {...})`, and when?", np: "`new Promise((resolve, reject) => {...})` मा pass गरिएको executor function कहिले चल्छ?", jp: "`new Promise((resolve, reject) => {...})`に渡されたエグゼキュータ関数はいつ実行される？" },
      options: [{ en: "Immediately, as soon as the Promise is constructed", np: "Promise construct हुनेबित्तिकै तुरुन्तै", jp: "Promiseが構築されるとすぐに" }, { en: "Only when `.then()` is called on the Promise", np: "Promise मा `.then()` call गरेपछि मात्र", jp: "Promiseに`.then()`が呼ばれたときのみ" }],
      correctIndex: 0,
      explanation: { en: "The executor runs synchronously and immediately when the Promise constructor is invoked, not later.", np: "Executor Promise constructor invoke हुनेबित्तिकै synchronously र immediately चल्छ, पछि होइन।", jp: "エグゼキュータはPromiseコンストラクタが呼ばれたときに同期的かつ即座に実行される。後からではない。" },
    },
    {
      question: { en: "If a Promise's executor calls `resolve()` and then later calls `reject()`, what happens?", np: "Promise को executor ले `resolve()` पछि `reject()` call गर्यो भने के हुन्छ?", jp: "Promiseのエグゼキュータが`resolve()`の後に`reject()`を呼んだらどうなる？" },
      options: [{ en: "The reject call is ignored — the Promise already settled as fulfilled", np: "Reject call ignore हुन्छ — Promise पहिले नै fulfilled भइसक्यो", jp: "reject呼び出しは無視される — Promiseはすでにfulfilledとして確定している" }, { en: "The Promise becomes rejected instead", np: "Promise बरु rejected हुन्छ", jp: "代わりにPromiseはrejectedになる" }],
      correctIndex: 0,
      explanation: { en: "A Promise can only settle once; the first resolve/reject call wins and every subsequent call is a no-op.", np: "Promise एकपल्ट मात्र settle हुन्छ; पहिलो resolve/reject call मान्य हुन्छ, त्यसपछिका calls को असर हुँदैन।", jp: "Promiseは一度だけ確定できる。最初のresolve/reject呼び出しが有効になり、それ以降の呼び出しは何もしない。" },
    },
    {
      question: { en: "What does `.catch(fn)` do internally?", np: "`.catch(fn)` ले internally के गर्छ?", jp: "`.catch(fn)`は内部で何をする？" },
      options: [{ en: "It's shorthand for `.then(undefined, fn)`", np: "यो `.then(undefined, fn)` को shorthand हो", jp: "`.then(undefined, fn)`の糖衣構文" }, { en: "It creates a completely separate error-handling mechanism from `.then()`", np: "यसले `.then()` भन्दा पूर्ण फरक error-handling mechanism बनाउँछ", jp: "`.then()`とは完全に別のエラー処理メカニズムを作る" }],
      correctIndex: 0,
      explanation: { en: "`.catch()` just registers a rejection handler, equivalent to passing `undefined` then `fn` into `.then()`.", np: "`.catch()` ले केवल rejection handler register गर्छ, `.then()` मा `undefined` अनि `fn` पास गरेसरह।", jp: "`.catch()`は単にrejectionハンドラを登録するだけで、`.then()`に`undefined`と`fn`を渡すのと同じ。" },
    },
    {
      question: { en: "What does `.then()` always return?", np: "`.then()` ले सधैं के फर्काउँछ?", jp: "`.then()`は常に何を返す？" },
      options: [{ en: "A brand-new Promise", np: "एउटा नयाँ Promise", jp: "新しいPromise" }, { en: "The exact same Promise it was called on", np: "जुन Promise मा call गरिएको थियो त्यही", jp: "呼び出された同じPromise" }],
      correctIndex: 0,
      explanation: { en: "Each `.then()` call returns a new Promise, which is what makes chaining `.then().then()` possible.", np: "हरेक `.then()` call ले नयाँ Promise फर्काउँछ, यसैले `.then().then()` chain गर्न सकिन्छ।", jp: "各`.then()`呼び出しは新しいPromiseを返す。これが`.then().then()`のチェーンを可能にする。" },
    },
    {
      question: { en: "If a `.then()` callback returns a plain value like `5` instead of a Promise, what happens to the chain?", np: "`.then()` callback ले Promise को सट्टा `5` जस्तो plain value फर्काए chain मा के हुन्छ?", jp: "`.then()`コールバックがPromiseの代わりに`5`のような通常の値を返すとチェーンはどうなる？" },
      options: [{ en: "The value is automatically wrapped in a resolved Promise and the chain continues", np: "Value automatically resolved Promise मा wrap हुन्छ र chain जारी रहन्छ", jp: "その値は自動的に解決済みPromiseにラップされ、チェーンは続行する" }, { en: "The chain throws a TypeError because a non-Promise was returned", np: "Non-Promise फर्काएकोले chain ले TypeError throw गर्छ", jp: "Promise以外が返されたためチェーンはTypeErrorを投げる" }],
      correctIndex: 0,
      explanation: { en: "Plain return values from `.then()` are automatically wrapped in an already-resolved Promise so chaining keeps working.", np: "`.then()` बाट फर्काएका plain values automatically resolved Promise मा wrap हुन्छन् ताकि chaining चलिरहोस्।", jp: "`.then()`から返された通常の値は自動的に解決済みPromiseにラップされ、チェーンが機能し続ける。" },
    },
    {
      question: { en: "If any step in a `.then()` chain throws or returns a rejected Promise, where does control go?", np: "`.then()` chain को कुनै step ले throw गर्यो वा rejected Promise फर्काए control कहाँ जान्छ?", jp: "`.then()`チェーンのどこかのステップが例外を投げるかrejectされたPromiseを返すと、制御はどこへ行く？" },
      options: [{ en: "It skips all remaining `.then()` calls and jumps to the nearest `.catch()`", np: "यसले बाँकी सबै `.then()` calls skip गरी नजिकको `.catch()` मा जान्छ", jp: "残りのすべての`.then()`をスキップし、最も近い`.catch()`にジャンプする" }, { en: "It stops the entire script immediately with an unhandled error", np: "यसले unhandled error सहित पूरै script तुरुन्तै रोक्छ", jp: "未処理エラーでスクリプト全体を即座に停止する" }],
      correctIndex: 0,
      explanation: { en: "Errors propagate down a Promise chain past every remaining `.then()` until they're caught by a `.catch()`.", np: "Errors Promise chain मा बाँकी सबै `.then()` bypass गरी `.catch()` ले catch नगरेसम्म propagate हुन्छन्।", jp: "エラーはPromiseチェーンを伝わり、`.catch()`にキャッチされるまで残りのすべての`.then()`を通過する。" },
    },
  ],
};
