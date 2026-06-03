import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_14_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Node.js has its own event loop implementation built on libuv, which is different from the browser's in one important way: it has explicit **phases**. Each phase has its own queue and runs all callbacks in that queue before moving to the next phase. `process.nextTick()` and `setImmediate()` are Node-specific additions that give you fine-grained control over when a callback runs.",
      np: "Node.js को आफ्नै event loop implementation libuv मा build भएको छ, browser भन्दा एक महत्त्वपूर्ण फरकसहित: explicit **phases** छन्। हरेक phase को आफ्नै queue छ। `process.nextTick()` र `setImmediate()` Node-specific additions हुन्।",
      jp: "Node.jsのイベントループはlibuvで構築され、ブラウザと異なる重要な点がある：明示的な**フェーズ**がある。各フェーズは独自のキューを持ち、全コールバックを処理してから次へ進む。`process.nextTick()`と`setImmediate()`はNode固有の追加。",
    },
    {
      en: "This topic comes up constantly in Node.js interviews. You don't need to memorize every phase — you need to understand the difference between `process.nextTick()`, microtasks (Promises), `setImmediate()`, and `setTimeout(fn, 0)` and be able to predict the order they run in.",
      np: "यो topic Node.js interviews मा बारम्बार आउँछ। हरेक phase memorize गर्नु पर्दैन — `process.nextTick()`, microtasks, `setImmediate()`, र `setTimeout(fn, 0)` को फरक र तिनीहरूको run order predict गर्न सक्नु जरुरी छ।",
      jp: "Node.jsの面接でよく出るトピック。全フェーズを暗記する必要はないが、`process.nextTick()`・マイクロタスク・`setImmediate()`・`setTimeout(fn,0)`の違いと実行順序を予測できる必要がある。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "8aGhZQkoFbQ", title: "What the heck is the event loop anyway? — Philip Roberts, JSConf" },
      ],
    },
    {
      title: { en: "The Node.js event loop phases", np: "Node.js event loop phases", jp: "Node.jsイベントループのフェーズ" },
      blocks: [
        {
          type: "table",
          caption: { en: "The loop cycles through these phases in order, over and over", np: "Loop ले यी phases मा order मा cycle गर्छ", jp: "ループはこのフェーズを順番に繰り返す" },
          headers: [
            { en: "Phase", np: "Phase", jp: "フェーズ" },
            { en: "What runs here", np: "के run हुन्छ", jp: "何が実行されるか" },
            { en: "Example APIs", np: "Example APIs", jp: "対応するAPI" },
          ],
          rows: [
            [
              { en: "1. Timers", np: "1. Timers", jp: "1. タイマー" },
              { en: "Callbacks scheduled by setTimeout() and setInterval() whose delay has expired", np: "Delay expire भएका setTimeout/setInterval callbacks", jp: "遅延が過ぎたsetTimeout/setIntervalのコールバック" },
              { en: "setTimeout, setInterval", np: "setTimeout, setInterval", jp: "setTimeout・setInterval" },
            ],
            [
              { en: "2. Pending callbacks", np: "2. Pending callbacks", jp: "2. ペンディングコールバック" },
              { en: "I/O callbacks deferred to the next loop iteration (e.g. some TCP errors)", np: "次のloop iteration मा defer भएका I/O callbacks", jp: "次のループ反復に延期されたI/Oコールバック" },
              { en: "Some TCP error callbacks", np: "केही TCP error callbacks", jp: "一部のTCPエラーコールバック" },
            ],
            [
              { en: "3. Idle / Prepare", np: "3. Idle / Prepare", jp: "3. アイドル/準備" },
              { en: "Internal Node.js use only — you will never need to worry about this", np: "Internal Node.js use — worried गर्नु पर्दैन", jp: "Node.js内部使用のみ — 気にする必要なし" },
              { en: "Internal only", np: "Internal only", jp: "内部のみ" },
            ],
            [
              { en: "4. Poll", np: "4. Poll", jp: "4. ポーリング" },
              { en: "Retrieve new I/O events and run their callbacks. If the queue is empty, wait here for new events (unless setImmediate is scheduled)", np: "新 I/O events र callbacks। Queue empty भए wait।", jp: "新しいI/Oイベントの取得と実行。キューが空ならイベントを待つ" },
              { en: "fs.readFile callback, network responses", np: "fs.readFile callback, network", jp: "fs.readFileコールバック・ネットワーク応答" },
            ],
            [
              { en: "5. Check", np: "5. Check", jp: "5. チェック" },
              { en: "setImmediate() callbacks run here — always after the poll phase", np: "setImmediate() callbacks — poll phase पछि", jp: "setImmediate()コールバック — ポーリングフェーズの後" },
              { en: "setImmediate", np: "setImmediate", jp: "setImmediate" },
            ],
            [
              { en: "6. Close callbacks", np: "6. Close callbacks", jp: "6. クローズコールバック" },
              { en: "Callbacks for abruptly closed resources, e.g. socket.on('close', cb)", np: "Abruptly closed resources callbacks", jp: "突然閉じられたリソースのコールバック" },
              { en: "socket.on('close', cb)", np: "socket.on('close', cb)", jp: "socket.on('close', cb)" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "Between every phase transition, Node.js checks the **microtask queues** — first `process.nextTick()` callbacks, then Promise callbacks. This means microtasks run between phases, not just at the start of the loop.",
            np: "हर phase transition बीच Node.js **microtask queues** check गर्छ — पहिले `process.nextTick()` callbacks, त्यसपछि Promise callbacks। यसको मतलब microtasks phases बीचमा run हुन्छन्।",
            jp: "各フェーズ遷移の間に、Node.jsは**マイクロタスクキュー**をチェックする — まず`process.nextTick()`、次にPromiseコールバック。マイクロタスクはループの開始時だけでなく、フェーズ間でも実行される。",
          },
        },
      ],
    },
    {
      title: { en: "process.nextTick() vs setImmediate() vs setTimeout(fn, 0)", np: "process.nextTick() vs setImmediate() vs setTimeout(fn, 0)", jp: "process.nextTick() vs setImmediate() vs setTimeout(fn, 0)" },
      blocks: [
        {
          type: "code",
          title: { en: "Order of execution — the interview question", np: "Execution order — interview question", jp: "実行順序 — 面接でよく聞かれる問題" },
          code: `const { setImmediate } = require("timers");

setImmediate(() => console.log("setImmediate"));

setTimeout(() => console.log("setTimeout 0"), 0);

Promise.resolve().then(() => console.log("Promise.then"));

process.nextTick(() => console.log("process.nextTick"));

console.log("sync");

// Output:
// sync
// process.nextTick    ← nextTick queue (before Promises)
// Promise.then        ← microtask queue (Promises)
// setTimeout 0        ← timers phase (macrotask)
// setImmediate        ← check phase (macrotask)

// Priority order (highest to lowest):
// 1. Synchronous code
// 2. process.nextTick() — drained completely before Promises
// 3. Promise.then / async-await — microtask queue
// 4. setTimeout(fn, 0) — timers phase
// 5. setImmediate — check phase (always after poll, so often after setTimeout)

// ── process.nextTick() — run at the END of the current operation ──
// Use case: ensure a callback runs after the current function finishes
// but before any I/O or timer callbacks

function EventEmitter_like(callback) {
  // ❌ Without nextTick — callback fires during constructor, before setup
  // callback();

  // ✅ With nextTick — callback fires after constructor returns
  process.nextTick(callback);
}

// ── setImmediate — run in the check phase (after I/O) ────────────
// Prefer setImmediate over setTimeout(fn, 0) inside I/O callbacks
// because setImmediate always runs in the check phase (predictable)
// while setTimeout timing can vary slightly

fs.readFile("./file.txt", () => {
  setTimeout(  () => console.log("setTimeout"), 0);
  setImmediate(() => console.log("setImmediate"));
  // Inside an I/O callback: setImmediate ALWAYS runs before setTimeout
  // Output: setImmediate, then setTimeout
});`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`process.nextTick()`** runs before Promises and before the next event loop phase. Overusing it can starve the event loop — if nextTick callbacks keep adding more nextTick callbacks, I/O never gets a chance to run.",
              np: "**`process.nextTick()`** Promises र अर्को event loop phase भन्दा पहिले run हुन्छ। Overuse गर्दा event loop starve हुन सक्छ — nextTick callbacks ले अर्को nextTick add गरिरहे I/O कहिल्यै run हुँदैन।",
              jp: "**`process.nextTick()`**はPromiseと次のフェーズより先に実行される。使いすぎるとイベントループが枯渇する — nextTickコールバックが更にnextTickを追加し続けるとI/Oが実行されなくなる。",
            },
            {
              en: "**`setImmediate()`** runs in the check phase, after the poll phase finishes. It is more predictable than `setTimeout(fn, 0)` when called from inside an I/O callback.",
              np: "**`setImmediate()`** check phase मा run हुन्छ — poll phase सकिएपछि। I/O callback भित्रबाट call गर्दा `setTimeout(fn, 0)` भन्दा बढी predictable छ।",
              jp: "**`setImmediate()`**はポーリングフェーズ後のチェックフェーズで実行される。I/Oコールバック内から呼ばれる場合、`setTimeout(fn, 0)`より予測しやすい。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Common async ordering pitfalls", np: "Common async ordering pitfalls", jp: "よくある非同期順序の落とし穴" },
      blocks: [
        {
          type: "code",
          title: { en: "Predicting async output — practice exercises", np: "Async output predict गर्ने — practice", jp: "非同期出力の予測 — 練習問題" },
          code: `// Exercise 1: What is the output order?
async function main() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
  setTimeout(() => console.log("C"), 0);
  await Promise.resolve();
  console.log("D");
}
main();
console.log("E");

// Answer: A, E, B, D, C
// A — sync inside main()
// await pauses main() and allows "E" to run
// E — sync after main() call
// B — first await resolves (microtask)
// D — second await resolves (microtask)
// C — setTimeout (macrotask, runs last)

// Exercise 2: nextTick vs Promise
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("Promise"));
// Output: nextTick, Promise
// nextTick queue is drained before the Promise microtask queue`,
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "When should I use process.nextTick vs setImmediate?", np: "process.nextTick vs setImmediate — कहिले कुन?", jp: "process.nextTickとsetImmediateの使い分けは？" },
      answer: {
        en: "Use `process.nextTick()` when you need a callback to run after the current operation completes but before any I/O or timers — for example, to emit an event after a constructor returns, or to handle an error asynchronously in a synchronous-looking API. Use `setImmediate()` when you want to yield to I/O before running your callback. Inside an I/O callback, prefer `setImmediate()` because its timing is guaranteed (check phase), while `setTimeout(fn, 0)` timing can vary slightly.",
        np: "`process.nextTick()`: current operation सकिएपछि I/O/timers अगाडि — constructor return भएपछि event emit गर्न। `setImmediate()`: callback run अगाडि I/O मा yield गर्न। I/O callback भित्र `setImmediate()` prefer — timing guaranteed।",
        jp: "`process.nextTick()`: 現在の操作完了後、I/O前に実行 — コンストラクタ返却後のイベント発火など。`setImmediate()`: コールバック前にI/Oに譲歩したい場合。I/Oコールバック内ではタイミングが保証されるsetImmediateを優先。",
      },
    },
    {
      question: { en: "What happens if I call process.nextTick() recursively?", np: "process.nextTick() recursively call गर्दा के हुन्छ?", jp: "process.nextTick()を再帰的に呼ぶとどうなる？" },
      answer: {
        en: "The event loop starves — I/O callbacks, timers, and even Promises never get a chance to run. `process.nextTick()` drains its queue completely before moving to the next phase, and if every tick callback schedules another tick, the loop is stuck in the nextTick queue forever. This is known as I/O starvation. Node.js does not have a built-in limit for nextTick recursion (unlike the call stack). Use `setImmediate()` when you need a recursive async callback — it yields to I/O between calls.",
        np: "Event loop starve हुन्छ — I/O callbacks, timers, Promises कहिल्यै run हुँदैनन्। nextTick ले queue completely drain गर्छ र हर tick callback ले अर्को tick add गर्दा loop stuck हुन्छ। यो I/O starvation हो। Recursive async callback चाहिए भने `setImmediate()` प्रयोग गर्नुहोस्।",
        jp: "イベントループが枯渇する — I/O・タイマー・Promiseが実行される機会を失う。nextTickキューは完全に消化されるため、再帰的に追加し続けるとI/O枯渇が起きる。再帰的な非同期コールバックには`setImmediate()`を使う。",
      },
    },
  ],
};
