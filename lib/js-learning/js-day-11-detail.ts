import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_11_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Callbacks were the original way to handle asynchronous work in JavaScript — pass a function in, have it called when the job finishes. Promises replaced callbacks for most use cases because they are easier to chain, easier to error-handle, and don't lead to deeply nested 'callback hell'. Understanding both is important because older code and many Node.js APIs still use callbacks.",
      np: "Callbacks JavaScript मा asynchronous work handle गर्ने original तरिका थियो। Promises ले callbacks लाई replace गर्‍यो किनभने chain गर्न, error handle गर्न सजिलो छ र 'callback hell' हुँदैन।",
      jp: "コールバックは非同期処理の元祖。チェーン・エラー処理が容易なPromiseに置き換えられたが、古いコードやNode.js APIでは今も現役。両方の理解が重要。",
    },
    {
      en: "A Promise is an object that represents the eventual result of an async operation. It is always in one of three states: pending (still working), fulfilled (succeeded with a value), or rejected (failed with a reason). Once settled, it never changes state.",
      np: "Promise एउटा object हो जसले async operation को eventual result represent गर्छ। हमेशा तीन states मध्ये एउटामा हुन्छ: pending, fulfilled, वा rejected। एक पटक settled भएपछि state बदलिँदैन।",
      jp: "PromiseはAsync操作の最終結果を表すオブジェクト。pending・fulfilled・rejectedの3状態があり、一度settling(確定)すると状態は変わらない。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "DHvZLI7Db8E", title: "JavaScript Promises In 10 Minutes" },
      ],
    },
    {
      title: { en: "Callbacks — the original pattern", np: "Callbacks — original pattern", jp: "コールバック — 元祖パターン" },
      blocks: [
        {
          type: "code",
          title: { en: "Callback pattern and the 'error-first' convention", np: "Callback pattern र error-first convention", jp: "コールバックパターンとエラーファーストの慣習" },
          code: `// ── Simple callback ───────────────────────────────────────────────
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

// ── Error-first callback convention (Node.js style) ───────────────
// First argument is always the error (null if success)
// Second argument is the result
const fs = require("fs");
fs.readFile("./config.json", "utf8", (err, data) => {
  if (err) {
    console.error("Could not read file:", err.message);
    return;
  }
  console.log("File contents:", data);
});

// ── Callback hell — why Promises were invented ────────────────────
// Each step depends on the previous one → deeply nested
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      // actual logic buried 3 levels deep
      console.log(details);
    });
  });
});`,
        },
        {
          type: "paragraph",
          text: {
            en: "The **error-first callback** convention (also called Node.js style) means the first argument to every callback is an error object — `null` if everything worked, an `Error` instance if it failed. This is a convention, not a language rule, but almost every Node.js core module and older npm package follows it.",
            np: "**Error-first callback** convention ले हरेक callback को पहिलो argument error हो — सफल भए `null`, असफल भए `Error` instance। यो convention हो, language rule होइन, तर लगभग सबै Node.js core modules र पुराना npm packages ले follow गर्छन्।",
            jp: "**エラーファーストコールバック**慣習では、最初の引数は常にerror（成功時null、失敗時Errorインスタンス）。言語仕様ではなく慣習だが、Node.jsコアモジュールと古いnpmパッケージはほぼすべてこれに従う。",
          },
        },
      ],
    },
    {
      title: { en: "Creating and consuming Promises", np: "Promises create र consume गर्नु", jp: "Promiseの作成と利用" },
      blocks: [
        {
          type: "code",
          title: { en: "new Promise(), then(), catch(), finally()", np: "new Promise(), then(), catch(), finally()", jp: "Promise作成と利用" },
          code: `// ── Creating a Promise ────────────────────────────────────────────
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

// ── Consuming a Promise ───────────────────────────────────────────
fetchUser(1)
  .then(user => console.log("Got user:", user.name))  // runs on resolve
  .catch(err  => console.error("Failed:", err.message)) // runs on reject
  .finally(()  => console.log("Always runs"));          // always runs

// ── Promise states ────────────────────────────────────────────────
// 1. Pending   — the async work is still running
// 2. Fulfilled — resolve() was called; .then() handlers fire
// 3. Rejected  — reject() was called; .catch() handlers fire
// Once fulfilled or rejected, a Promise is "settled" — state never changes

// ── then() returns a NEW Promise ─────────────────────────────────
// This is what makes chaining possible
fetchUser(1)
  .then(user => user.name)            // transforms the value
  .then(name => name.toUpperCase())   // transforms again
  .then(upper => console.log(upper))  // "ALICE"
  .catch(err => console.error(err));  // catches any error from any .then()

// ── Wrapping a callback API in a Promise ──────────────────────────
const readFilePromise = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

// Or use Node.js's built-in util.promisify:
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const data = await readFile("./config.json", "utf8");`,
        },
      ],
    },
    {
      title: { en: "Promise chaining", np: "Promise chaining", jp: "Promiseのチェーン" },
      blocks: [
        {
          type: "code",
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
  .catch(err    => showError(err));  // ONE catch handles all errors

// ── Returning values vs Promises in .then() ────────────────────────
// If you return a plain value, it's wrapped in a resolved Promise
// If you return a Promise, the chain waits for it to settle

Promise.resolve(1)
  .then(n => n + 1)           // returns 2 — wrapped in resolved Promise
  .then(n => Promise.resolve(n * 2))  // returns a Promise — chain waits
  .then(n => console.log(n)); // 4

// ── Common mistake: forgetting to return inside .then() ────────────
// ❌ Bug — returns undefined, chain gets undefined not the fetch result
.then(user => {
  fetch(\`/api/orders/\${user.id}\`);  // forgot return!
})
.then(orders => console.log(orders));  // undefined

// ✅ Fixed
.then(user => fetch(\`/api/orders/\${user.id}\`))  // return the Promise
.then(orders => console.log(orders));`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Always return** inside `.then()` if you are calling another async function. Without `return`, the next `.then()` receives `undefined`.",
              np: "`.then()` भित्र async function call गर्दा **हमेशा return** गर्नुहोस्। Return नगरे अर्को `.then()` ले `undefined` पाउँछ।",
              jp: "`.then()`の中で非同期関数を呼ぶなら**必ずreturn**する。returnがないと次の`.then()`はundefinedを受け取る。",
            },
            {
              en: "**One `.catch()` at the end** catches errors from any step in the chain. You rarely need `.catch()` after every `.then()`.",
              np: "**अन्तमा एउटा `.catch()`** ले chain को जुनसुकै step को error catch गर्छ। हरेक `.then()` पछि `.catch()` चाहिँदैन।",
              jp: "**最後に一つの`.catch()`**でチェーン内の全エラーをキャッチできる。各`.then()`の後に`.catch()`は不要。",
            },
            {
              en: "**`.finally()`** always runs whether the Promise resolved or rejected — useful for cleanup like hiding a loading spinner.",
              np: "**`.finally()`** Promise resolve वा reject जुनसुकै भए पनि चल्छ — loading spinner hide गर्न जस्ता cleanup का लागि उपयोगी।",
              jp: "**`.finally()`**はresolve・rejectに関わらず常に実行される。ローディングスピナーの非表示などのクリーンアップに便利。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What is the difference between a callback and a Promise?", np: "Callback र Promise मा के फरक?", jp: "コールバックとPromiseの違いは？" },
      answer: {
        en: "A callback is a function you pass to another function, to be called when the async work is done. The calling function decides when and how your callback is invoked. A Promise is an object that represents a future value. You call `.then()` and `.catch()` on it to register handlers — the Promise invokes your handlers when it settles. Promises solve several callback problems: chaining is flat instead of nested, errors propagate automatically to `.catch()`, and Promises can only be resolved or rejected once (preventing double-calls).",
        np: "Callback तपाईंले pass गर्ने function हो जुन async काम सकिएपछि call हुन्छ। Promise एउटा object हो जसले future value represent गर्छ। Promises ले callbacks का problems solve गर्छ: chaining flat हुन्छ, errors automatically `.catch()` मा propagate हुन्छ, र Promise एक पटक मात्र resolve/reject हुन सक्छ।",
        jp: "コールバックは非同期処理完了時に呼ばれる関数。Promiseは将来の値を表すオブジェクト。Promiseはチェーンがフラット・エラーが自動伝播・一度だけ確定という利点がある。",
      },
    },
    {
      question: { en: "What happens if a Promise never resolves or rejects?", np: "Promise कहिल्यै resolve वा reject नभए के हुन्छ?", jp: "Promiseが永遠にresolve/rejectしない場合はどうなる？" },
      answer: {
        en: "It stays in the `pending` state forever. The `.then()` and `.catch()` handlers never run, and any code waiting for the result will wait forever. This is a Promise leak — a common source of memory issues in complex async code. To prevent it, always add a timeout using `Promise.race()` with a timer Promise, or ensure all code paths in `new Promise()` call either `resolve` or `reject`.",
        np: "हमेशाको लागि `pending` state मा रहन्छ। `.then()` र `.catch()` handlers कहिल्यै run हुँदैनन्। यो Promise leak हो — complex async code मा memory issues को common कारण। रोक्न `Promise.race()` मा timeout थप्नुहोस् वा `new Promise()` भित्र सबै code paths ले `resolve` वा `reject` call गर्छन् भन्ने ensure गर्नुहोस्।",
        jp: "永遠に`pending`のまま。`.then()`や`.catch()`ハンドラは一切実行されない。Promiseリークはメモリ問題の元。防ぐには`Promise.race()`でタイムアウトを追加するか、`new Promise()`内の全コードパスで必ずresolve/rejectを呼ぶ。",
      },
    },
    {
      question: { en: "Can I reject with a non-Error value?", np: "Non-Error value सँग reject गर्न सकिन्छ?", jp: "Error以外の値でrejectできるか？" },
      answer: {
        en: "Yes — you can reject with any value: `reject('something went wrong')` or `reject(404)`. But you should always reject with an `Error` instance. Rejecting with a string or number loses the stack trace, making debugging much harder. In a `.catch()` handler you also cannot safely use `err.message` or `err.stack` if the rejection value is not an Error. Rule: always `reject(new Error('reason'))` or `reject(new CustomError(...))`.",
        np: "हो — जुनसुकै value सँग reject गर्न सकिन्छ। तर हमेशा `Error` instance सँग reject गर्नुहोस्। String वा number सँग reject गर्दा stack trace हराउँछ र debugging गाह्रो हुन्छ। Rule: हमेशा `reject(new Error('reason'))`।",
        jp: "はい — 任意の値でrejectできる。しかし常に`Error`インスタンスでrejectすべき。文字列や数値でrejectするとスタックトレースが失われデバッグが困難になる。`reject(new Error('理由'))`が原則。",
      },
    },
  ],
};
