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
        en: "A <b>callback</b> is a function passed into another function to be called once some work — often asynchronous — finishes. Before Promises existed, callbacks were the only way to react to something that takes time: a `setTimeout`, a file read, a network request. The function doing the work decides when (and how many times) to call your callback, which means you're handing over control instead of getting a value back directly.\n\nNode.js core modules settled on the <b>error-first callback</b> convention: `fn(err, data)` — the first argument is always an error (`null` if nothing went wrong), the second is the result. It's just a convention, not a language rule, but it's followed almost universally in older APIs. The real pain shows up when several async steps depend on each other: each nested callback needs its own `if (err)` check, and the code marches to the right with every new step — this is <b>callback hell</b> (the \"pyramid of doom\"), and it's the exact problem Promises were designed to solve.",
        np: "Callback भनेको अर्को function लाई pass गरिने function हो जुन कुनै काम (प्रायः asynchronous) सकिएपछि call हुन्छ। Promises आउनुअघि, callbacks नै async काम पर्खने एकमात्र तरिका थियो — `setTimeout`, file read, वा network request। काम गर्ने function ले नै तपाईंको callback कहिले (र कति पटक) call गर्ने भन्ने decide गर्छ, त्यसैले value सिधै फिर्ता पाउनुको सट्टा control अर्कोलाई सुम्पिनुपर्छ।\n\nNode.js core modules ले <b>error-first callback</b> convention अपनाए: `fn(err, data)` — पहिलो argument सधैं error हो (केही गडबड नभए `null`), दोस्रो result हो। यो केवल convention हो, language rule होइन, तर पुराना APIs मा लगभग universal रूपमा follow गरिन्छ। धेरै async steps एकअर्कामा depend गर्दा दुख्न थाल्छ: हरेक nested callback लाई आफ्नै `if (err)` check चाहिन्छ, र हरेक नयाँ step सँगै code दायाँतिर सर्दै जान्छ — यसैलाई <b>callback hell</b> (pyramid of doom) भनिन्छ, र यही समस्या समाधान गर्न Promises बनाइएको हो।",
        jp: "<b>コールバック</b>とは、何らかの処理（多くは非同期処理）が終わったときに呼び出してもらうために、別の関数に渡す関数のこと。Promiseが登場する前は、`setTimeout`やファイル読み込み、ネットワークリクエストのような時間のかかる処理に反応する唯一の方法だった。処理を行う関数がいつ（何回）コールバックを呼ぶかを決めるため、値を直接受け取るのではなく制御を相手に委ねることになる。\n\nNode.jsのコアモジュールは<b>エラーファーストコールバック</b>という慣習に落ち着いた。`fn(err, data)` — 第一引数は常にエラー（問題がなければ`null`）、第二引数が結果。これは言語仕様ではなく単なる慣習だが、古いAPIではほぼ普遍的に使われている。本当に厄介なのは複数の非同期ステップが互いに依存する場合で、ネストするコールバックのたびに`if (err)`チェックが必要になり、新しいステップが増えるごとにコードが右へ右へとずれていく — これが<b>コールバック地獄</b>（ピラミッド・オブ・ドゥーム）であり、Promiseが解決しようとした問題そのもの。",
      },
      diagram: `Callback style:                        Error-first convention:
─────────────────                      ────────────────────────
fetchUser(id, callback)                fn(err, data)
      │                                       │      │
      ▼                                       │      └─ result (undefined if err)
  [async work]                                └─ Error instance | null
      │
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
        code: `// ── Simple callback ──────────────────────────────────────────────
function fetchUser(id, callback) {
  setTimeout(() => {
    const user = { id, name: "Alice" };  // simulate async work
    callback(null, user);                // null = no error, user = result
  }, 1000);
}

fetchUser(1, (err, user) => {
  if (err) return console.error("Error:", err);
  console.log("Got user:", user.name);
});

// ── Error-first callback convention (Node.js style) ────────────────
// First argument is always the error (null if success), second is data
const fs = require("fs");
fs.readFile("./config.json", "utf8", (err, data) => {
  if (err) {
    console.error("Could not read file:", err.message);
    return;
  }
  console.log("File contents:", data);
});

// ── Callback hell — why Promises were invented ─────────────────────
// Each step depends on the previous one → deeply nested, hard to read
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      // actual logic buried 3 levels deep, every step repeats err-checking
      console.log(details);
    });
  });
});`,
      },
      keyTakeaways: [
        { en: "A callback is a function you hand to another function to be called later, once async work finishes — the callee decides when and how it's invoked, not you.", np: "Callback भनेको तपाईंले अर्को function लाई दिने function हो जुन async काम सकिएपछि पछि call हुन्छ — कहिले र कसरी invoke हुने भन्ने callee ले decide गर्छ, तपाईंले होइन।", jp: "コールバックとは、非同期処理が終わったときに後で呼び出してもらうために別の関数に渡す関数。いつどう呼ばれるかは呼び出される側が決める。" },
        { en: "The error-first convention `fn(err, data)` means the first argument is always the error (`null` on success) — always check it before touching `data`.", np: "Error-first convention `fn(err, data)` मा पहिलो argument सधैं error हो (सफल भए `null`) — `data` छुनुअघि सधैं यो check गर्नुहोस्।", jp: "エラーファースト規約`fn(err, data)`では第一引数は常にエラー（成功時null）。`data`を使う前に必ずこれを確認する。" },
        { en: "Nesting callbacks inside callbacks for dependent async steps produces callback hell (the pyramid of doom) — the exact problem Promises solve.", np: "Dependent async steps का लागि callbacks भित्र callbacks nest गर्दा callback hell (pyramid of doom) बन्छ — यही समस्या Promises ले solve गर्छ।", jp: "依存する非同期ステップのためにコールバックの中にコールバックをネストするとコールバック地獄（ピラミッド・オブ・ドゥーム）になる。これこそPromiseが解決する問題。" },
      ],
      commonMistakes: [
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
        en: "You create a Promise with `new Promise((resolve, reject) => { ... })`. The function you pass in — the <b>executor</b> — runs immediately and receives two functions: call `resolve(value)` when the work succeeds, call `reject(reason)` when it fails. A Promise is always in exactly one of three states: <b>pending</b> (still working), <b>fulfilled</b> (resolved with a value), or <b>rejected</b> (failed with a reason) — and once it moves to fulfilled or rejected it is <b>settled</b> and can never change state again, no matter how many more times `resolve` or `reject` are called.\n\nYou consume a Promise with `.then(onFulfilled, onRejected)`, though it's far more common to split success and failure handling with `.then(onFulfilled).catch(onRejected)`. `.catch(fn)` is just shorthand for `.then(undefined, fn)`, and `.finally(fn)` runs regardless of outcome — with no arguments passed in — making it the right spot for cleanup like hiding a loading spinner.",
        np: "`new Promise((resolve, reject) => { ... })` ले Promise create गरिन्छ। Pass गरिएको function — <b>executor</b> — तुरुन्तै चल्छ र दुई functions पाउँछ: काम सफल भए `resolve(value)` call गर्नुहोस्, असफल भए `reject(reason)`। Promise सधैं तीन states मध्ये एउटामा हुन्छ: <b>pending</b> (अझै काम भइरहेको), <b>fulfilled</b> (value सहित resolve भएको), वा <b>rejected</b> (reason सहित fail भएको) — एक पटक fulfilled वा rejected भएपछि यो <b>settled</b> हुन्छ र फेरि कहिल्यै state बदलिँदैन, `resolve` वा `reject` जति पटक call गरे पनि।\n\n`.then(onFulfilled, onRejected)` ले Promise consume गरिन्छ, तर success र failure handling लाई `.then(onFulfilled).catch(onRejected)` गरी छुट्याउनु बढी सामान्य छ। `.catch(fn)` `.then(undefined, fn)` को shorthand मात्र हो, र `.finally(fn)` result जे भए पनि चल्छ — कुनै argument बिना — यसले loading spinner hide गर्ने जस्ता cleanup का लागि सहि ठाउँ बनाउँछ।",
        jp: "`new Promise((resolve, reject) => { ... })`でPromiseを作成する。渡す関数（<b>エグゼキュータ</b>）は即座に実行され、2つの関数を受け取る。処理が成功したら`resolve(value)`を、失敗したら`reject(reason)`を呼ぶ。Promiseは常に3つの状態のうちいずれか1つ — <b>pending</b>（処理中）、<b>fulfilled</b>（値と共に成功）、<b>rejected</b>（理由と共に失敗） — であり、fulfilledかrejectedになった時点で<b>確定（settled）</b>し、それ以降`resolve`や`reject`が何回呼ばれても状態は二度と変わらない。\n\nPromiseは`.then(onFulfilled, onRejected)`で利用するが、成功と失敗の処理を`.then(onFulfilled).catch(onRejected)`のように分けるほうが一般的。`.catch(fn)`は`.then(undefined, fn)`の糖衣構文にすぎず、`.finally(fn)`は結果に関わらず（引数なしで）実行されるため、ローディングスピナーを隠すようなクリーンアップに最適。",
      },
      diagram: `new Promise((resolve, reject) => { ... })
                 │
                 ▼
          ┌─────────────┐
          │   PENDING   │  ← executor is running
          └──────┬──────┘
        resolve()│        │reject()
                 ▼        ▼
        ┌─────────────┐ ┌─────────────┐
        │  FULFILLED  │ │  REJECTED   │
        └─────────────┘ └─────────────┘
             SETTLED — state locked in forever, happens only ONCE

.then(onFulfilled) ──── runs when FULFILLED
.catch(onRejected) ──── runs when REJECTED  (shorthand for .then(undefined, fn))
.finally(fn)       ──── runs EITHER way, receives no arguments`,
      codeExample: {
        title: { en: "new Promise(), then(), catch(), finally()", np: "new Promise(), then(), catch(), finally()", jp: "Promiseの作成と then・catch・finally" },
        code: `// ── Creating a Promise ───────────────────────────────────────────
const fetchUser = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) {
        reject(new Error("ID must be positive"));  // reject = failure
      } else {
        resolve({ id, name: "Alice" });             // resolve = success
      }
    }, 1000);
  });

// ── Consuming a Promise ──────────────────────────────────────────
fetchUser(1)
  .then(user => console.log("Got user:", user.name))    // runs on resolve
  .catch(err  => console.error("Failed:", err.message))  // runs on reject
  .finally(() => console.log("Always runs"));             // always runs

// ── Promise states ───────────────────────────────────────────────
// 1. Pending   — the async work is still running
// 2. Fulfilled — resolve() was called; .then() handlers fire
// 3. Rejected  — reject() was called; .catch() handlers fire
// Once fulfilled or rejected, a Promise is "settled" — it can never change again

// ── A Promise can only settle ONCE ───────────────────────────────
new Promise((resolve, reject) => {
  resolve("first");
  reject(new Error("ignored"));   // too late — already settled, this is a no-op
  resolve("also ignored");        // also a no-op
}).then(value => console.log(value)); // "first"

// ── Wrapping a callback API in a Promise ─────────────────────────
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
        { en: "The executor passed to `new Promise((resolve, reject) => {...})` runs immediately; calling `resolve(value)` or `reject(reason)` settles the Promise.", np: "`new Promise((resolve, reject) => {...})` मा pass गरिएको executor तुरुन्तै चल्छ; `resolve(value)` वा `reject(reason)` call गर्दा Promise settle हुन्छ।", jp: "`new Promise((resolve, reject) => {...})`に渡すエグゼキュータは即座に実行され、`resolve(value)`か`reject(reason)`を呼ぶとPromiseが確定する。" },
        { en: "A Promise is always pending, fulfilled, or rejected — once settled (fulfilled/rejected) it never changes state again, even if resolve/reject is called more.", np: "Promise सधैं pending, fulfilled, वा rejected मध्ये एउटा हुन्छ — एक पटक settled भएपछि (fulfilled/rejected) फेरि resolve/reject call गरे पनि state बदलिँदैन।", jp: "Promiseは常にpending・fulfilled・rejectedのいずれか。一度確定（fulfilled/rejected）すると、resolve/rejectを再度呼んでも状態は二度と変わらない。" },
        { en: "`.catch(fn)` is shorthand for `.then(undefined, fn)`, and `.finally(fn)` runs no matter the outcome with no arguments — ideal for guaranteed cleanup.", np: "`.catch(fn)` `.then(undefined, fn)` को shorthand हो, र `.finally(fn)` result जे भए पनि argument बिना चल्छ — guaranteed cleanup का लागि उपयुक्त।", jp: "`.catch(fn)`は`.then(undefined, fn)`の糖衣構文で、`.finally(fn)`は結果に関わらず引数なしで実行される。確実なクリーンアップに最適。" },
      ],
      commonMistakes: [
        { en: "Assuming a later `resolve()` or `reject()` call overrides an earlier one — only the first call to either wins; every call after that is a silent no-op.", np: "पछिको `resolve()` वा `reject()` call ले पहिलेकोलाई override गर्छ भन्ने ठान्नु — पहिलो call मात्र मान्य हुन्छ; त्यसपछिका सबै calls silently no-op हुन्छन्।", jp: "後の`resolve()`や`reject()`が先の呼び出しを上書きすると思い込むこと。実際は最初の呼び出しだけが有効で、それ以降はすべて黙って無視される。" },
        { en: "Forgetting to call `resolve` or `reject` on some code path inside the executor, leaving the Promise pending forever and any awaiting code stuck.", np: "Executor भित्रको कुनै code path मा `resolve` वा `reject` call गर्न बिर्सनु, Promise सधैंको लागि pending रहन्छ र पर्खिरहेको code अड्किन्छ।", jp: "エグゼキュータ内のあるコードパスで`resolve`や`reject`を呼び忘れ、Promiseが永遠にpendingのままになり、待っているコードが止まってしまうこと。" },
        { en: "Thinking `.finally()` receives the resolved value or the rejection reason as an argument — it receives nothing, since it must run identically either way.", np: "`.finally()` ले resolved value वा rejection reason argument को रूपमा पाउँछ भन्ने ठान्नु — यसले केही पाउँदैन, किनकि यो दुवै अवस्थामा उस्तै चल्नुपर्छ।", jp: "`.finally()`が解決値や拒否理由を引数として受け取ると考えること。実際は何も受け取らない。どちらの場合も同じように実行される必要があるため。" },
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
        en: "Each call to `.then()` returns a <b>brand-new Promise</b>, which is what makes chaining possible: `.then().then().then()` runs steps one after another, top to bottom, instead of nesting new callbacks inside each other. If the callback passed to `.then()` returns a plain value, that value is automatically wrapped in an already-resolved Promise; if it returns <b>another Promise</b>, the chain pauses and waits for that Promise to settle before continuing — this is exactly how you sequence dependent async calls like `getUser().then(user => getOrders(user.id))`.\n\nErrors propagate automatically down a chain: if any `.then()` callback throws, or if the Promise it returns rejects, control jumps straight to the nearest `.catch()` further down the chain, skipping every `.then()` in between. That's why you rarely need more than one `.catch()` at the end of a chain — it acts as a single safety net for every step above it. The most common bug is forgetting to `return` a nested async call inside `.then()`: without `return`, the next `.then()` receives `undefined` instead of waiting for the real result.",
        np: "`.then()` को हरेक call ले <b>नयाँ Promise</b> फर्काउँछ, यसैले chaining सम्भव हुन्छ: `.then().then().then()` ले steps लाई एकपछि अर्को, माथिबाट तल क्रमशः चलाउँछ, nested callbacks भित्र callbacks राख्नुको सट्टा। `.then()` मा pass गरिएको callback ले plain value फर्काए, त्यो value automatically already-resolved Promise भित्र wrap हुन्छ; <b>अर्को Promise</b> फर्काए, chain त्यो Promise settle नभएसम्म पर्खन्छ — यही तरिकाले `getUser().then(user => getOrders(user.id))` जस्ता dependent async calls लाई sequence मा राखिन्छ।\n\nChain मा errors automatically propagate हुन्छन्: कुनै `.then()` callback ले throw गर्यो भने, वा फर्काएको Promise reject भयो भने, control सिधै chain मा तलको नजिकको `.catch()` मा jump गर्छ, बीचका सबै `.then()` skip गर्दै। त्यसैले chain को अन्तमा एउटा मात्र `.catch()` प्रायः पुग्छ — यसले माथिका सबै steps का लागि एउटै safety net को काम गर्छ। सबैभन्दा common bug हो `.then()` भित्र nested async call लाई `return` गर्न बिर्सनु: `return` नगरे अर्को `.then()` ले वास्तविक result पर्खनुको सट्टा `undefined` पाउँछ।",
        jp: "`.then()`の呼び出しはそれぞれ<b>新しいPromise</b>を返す。これがチェーンを可能にする仕組みで、`.then().then().then()`は各コールバックの中にさらにコールバックをネストする代わりに、ステップを上から下へ順番に実行する。`.then()`に渡したコールバックが通常の値を返せば、その値は自動的にすでに解決済みのPromiseにラップされる。<b>別のPromise</b>を返せば、チェーンはそのPromiseが確定するまで待ってから続行する — これがまさに`getUser().then(user => getOrders(user.id))`のような依存する非同期呼び出しを順序付ける方法。\n\nエラーはチェーンを自動的に伝播する。`.then()`のコールバックが例外を投げるか、返したPromiseがrejectされると、制御はチェーンの下にある最も近い`.catch()`に直接ジャンプし、間のすべての`.then()`をスキップする。だからこそチェーンの最後に1つの`.catch()`があれば十分なことが多い — それが上のすべてのステップに対する1つの安全網として機能する。最もよくあるバグは`.then()`内でネストした非同期呼び出しの`return`を忘れること。`return`がないと、次の`.then()`は本当の結果を待つ代わりに`undefined`を受け取る。",
      },
      diagram: `getUser(id)
   .then(user    => getOrders(user.id))     ← returns a Promise, chain WAITS for it
   .then(orders  => orders[0].id)           ← returns a plain value, auto-wrapped
   .then(orderId => getOrderDetails(orderId))
   .then(details => render(details))
   .catch(err    => showError(err));        ← ONE catch, handles errors from ANY step above

   thrown error / rejected promise anywhere in the chain
                        │
                        ▼
   skips every remaining .then() ──► lands directly in nearest .catch()`,
      codeExample: {
        title: { en: "Chaining async steps without nesting", np: "Nesting बिना async steps chain गर्नु", jp: "ネストなしで非同期ステップをチェーン" },
        code: `// ── Promise chain vs callback hell — same logic, cleaner structure ──
// Callback hell version (hard to read):
getUser(userId, (err, user) => {
  getOrders(user.id, (err, orders) => {
    getOrderDetails(orders[0].id, (err, details) => {
      render(details);
    });
  });
});

// Promise chain (flat structure, easy to read):
getUser(userId)
  .then(user    => getOrders(user.id))
  .then(orders  => getOrderDetails(orders[0].id))
  .then(details => render(details))
  .catch(err    => showError(err));  // ONE catch handles errors from every step above

// ── Returning a value vs returning a Promise from .then() ───────────
// A plain value is wrapped in an already-resolved Promise automatically.
// A returned Promise makes the chain PAUSE and wait for it to settle.
Promise.resolve(1)
  .then(n => n + 1)                    // returns 2 — wrapped in a resolved Promise
  .then(n => Promise.resolve(n * 2))   // returns a Promise — chain waits for it
  .then(n => console.log(n));          // 4

// ── Errors skip straight to the nearest .catch() ─────────────────────
Promise.resolve()
  .then(() => { throw new Error("step 2 failed"); })
  .then(() => console.log("this never runs"))   // skipped entirely
  .then(() => console.log("neither does this")) // skipped entirely
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
        { en: "`.then()` always returns a brand-new Promise, which is what allows flat chaining (`.then().then().then()`) instead of nested callbacks.", np: "`.then()` ले सधैं नयाँ Promise फर्काउँछ, यसैले nested callbacks को सट्टा flat chaining (`.then().then().then()`) सम्भव हुन्छ।", jp: "`.then()`は常に新しいPromiseを返す。これがネストしたコールバックの代わりにフラットなチェーン（`.then().then().then()`）を可能にする。" },
        { en: "Returning a plain value from `.then()` wraps it in a resolved Promise immediately; returning another Promise makes the chain wait for it to settle first.", np: "`.then()` बाट plain value फर्काउँदा तुरुन्तै resolved Promise भित्र wrap हुन्छ; अर्को Promise फर्काउँदा chain त्यो settle नभएसम्म पर्खन्छ।", jp: "`.then()`から通常の値を返すと即座に解決済みPromiseにラップされる。別のPromiseを返すと、チェーンはそれが確定するまで先に待つ。" },
        { en: "A thrown error or rejected Promise anywhere in a chain skips every remaining `.then()` and jumps straight to the nearest `.catch()`.", np: "Chain मा जहाँसुकै throw भएको error वा rejected Promise ले बाँकी सबै `.then()` skip गरी सिधै नजिकको `.catch()` मा jump गर्छ।", jp: "チェーンのどこかで投げられたエラーやrejectされたPromiseは、残りの`.then()`をすべてスキップして最も近い`.catch()`に直接ジャンプする。" },
      ],
      commonMistakes: [
        { en: "Forgetting to `return` a nested async call inside `.then()` — the next `.then()` then receives `undefined` instead of waiting for the real result.", np: "`.then()` भित्र nested async call `return` गर्न बिर्सनु — त्यसपछिको `.then()` ले वास्तविक result पर्खनुको सट्टा `undefined` पाउँछ।", jp: "`.then()`内でネストした非同期呼び出しの`return`を忘れること。次の`.then()`は本当の結果を待つ代わりに`undefined`を受け取る。" },
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
