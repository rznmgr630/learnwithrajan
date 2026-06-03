import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_13_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "JavaScript is single-threaded — only one thing runs at a time. The event loop is what makes async code possible on a single thread. Understanding how the call stack, the task queue, and the microtask queue work together explains every surprising output ordering you will ever see in JavaScript.",
      np: "JavaScript single-threaded छ — एक पटकमा एउटा मात्र काम हुन्छ। Event loop ले single thread मा async code सम्भव बनाउँछ। Call stack, task queue, र microtask queue कसरी सँगै काम गर्छन् बुझ्नाले सबै surprising output orderings को explanation आउँछ।",
      jp: "JavaScriptはシングルスレッド — 一度に一つしか実行できない。イベントループがシングルスレッドで非同期を可能にする。コールスタック・タスクキュー・マイクロタスクキューの仕組みを理解すれば、不思議な実行順序の謎が解ける。",
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
      title: { en: "The call stack", np: "Call stack", jp: "コールスタック" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The call stack is a data structure that tracks which function is currently running. When you call a function, it is pushed onto the stack. When it returns, it is popped off. JavaScript can only do one thing at a time because there is only one call stack. If the stack is busy running synchronous code, nothing else can run.",
            np: "Call stack एउटा data structure हो जसले कुन function हाल run भइरहेको छ track गर्छ। Function call हुँदा stack मा push हुन्छ, return हुँदा pop हुन्छ। JavaScript एक पटकमा एउटा मात्र काम गर्छ किनभने एउटा मात्र call stack छ।",
            jp: "コールスタックは現在実行中の関数を追跡するデータ構造。関数を呼ぶとpush、returnするとpop。コールスタックは一つしかないため、同期コードが実行中は他は何も実行できない。",
          },
        },
        {
          type: "code",
          title: { en: "Stack overflow and understanding the stack", np: "Stack overflow र stack को बुझाइ", jp: "スタックオーバーフローとスタックの理解" },
          code: `// ── Call stack in action ─────────────────────────────────────────
function c() { console.log("c"); }
function b() { c(); }
function a() { b(); }

a();
// Stack frames (bottom to top):
//   a() → calls b()
//   b() → calls c()
//   c() → logs "c", returns
//   b() → returns
//   a() → returns

// ── Stack overflow — infinite recursion ───────────────────────────
function recurse() {
  return recurse();  // calls itself forever
}
// recurse();  // Uncaught RangeError: Maximum call stack size exceeded

// ── Synchronous code blocks the stack ────────────────────────────
// While this runs, NOTHING else can happen — no clicks, no timers
function blockFor3Seconds() {
  const end = Date.now() + 3000;
  while (Date.now() < end) {}  // busy loop
  console.log("Done blocking");
}
blockFor3Seconds();
// The UI freezes for 3 seconds — this is why CPU work on the main thread is bad`,
        },
      ],
    },
    {
      title: { en: "Web APIs, the callback queue, and the event loop", np: "Web APIs, callback queue, र event loop", jp: "Web API・コールバックキュー・イベントループ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When you call `setTimeout`, `fetch`, or add an event listener, the browser's Web APIs handle the waiting — not JavaScript. When the timer fires or the network responds, the callback is placed in the **callback queue** (also called the task queue or macrotask queue). The **event loop** checks: is the call stack empty? If yes, it picks the next callback from the queue and pushes it onto the stack. This is how async callbacks run without blocking.",
            np: "`setTimeout`, `fetch`, वा event listener add गर्दा, browser को Web APIs ले waiting handle गर्छ — JavaScript ले होइन। Timer fire हुँदा वा network respond गर्दा, callback **callback queue** (task queue) मा जान्छ। **Event loop** check गर्छ: call stack empty छ? छ भने queue बाट अर्को callback stack मा push गर्छ।",
            jp: "`setTimeout`・`fetch`・イベントリスナーはブラウザのWeb APIが処理する。タイマー発火やネットワーク応答時、コールバックは**コールバックキュー**（マクロタスクキュー）に入る。**イベントループ**はコールスタックが空なら次のコールバックをキューからスタックに移す。",
          },
        },
        {
          type: "code",
          title: { en: "setTimeout(fn, 0) does not run immediately — the event loop explained", np: "setTimeout(fn, 0) तुरन्त run हुँदैन — event loop", jp: "setTimeout(fn, 0)は即座に実行されない — イベントループ" },
          code: `// ── Classic event loop output puzzle ──────────────────────────────
console.log("1");          // sync — runs immediately

setTimeout(() => {
  console.log("2");        // async (macrotask) — goes to callback queue
}, 0);

console.log("3");          // sync — runs immediately

// Output: 1, 3, 2
// Why? "2" is in the callback queue — the event loop only runs it
// after the call stack is clear (after "3" runs).

// ── Even setTimeout(fn, 0) is async ───────────────────────────────
// "0ms" doesn't mean "run right now" — it means "run as soon as the
// call stack is empty and it's your turn in the queue"

// ── Multiple timers — order depends on timing ─────────────────────
setTimeout(() => console.log("A"), 0);
setTimeout(() => console.log("B"), 0);
setTimeout(() => console.log("C"), 100);
// Output order: A, B, (100ms pause), C
// A and B are in the queue immediately (0ms delay, but still async)
// C waits 100ms before entering the queue`,
        },
      ],
    },
    {
      title: { en: "Microtask queue — Promises run first", np: "Microtask queue — Promises पहिले run हुन्छ", jp: "マイクロタスクキュー — Promiseは先に実行される" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Promises do not use the callback queue. They use the **microtask queue**, which has higher priority. After every task (and between tasks), the event loop drains the entire microtask queue before picking the next macrotask. This means `.then()` callbacks, `catch()`, `finally()`, and `await` continuations all run before any `setTimeout` or `setInterval` callback, even if the timer delay was 0.",
            np: "Promises callback queue प्रयोग गर्दैनन् — **microtask queue** प्रयोग गर्छन् जसको higher priority छ। हर task पछि event loop microtask queue पूरै drain गर्छ। यसको मतलब `.then()`, `catch()`, `await` continuations सबै `setTimeout` callback भन्दा पहिले run हुन्छन् — timer delay 0 भए पनि।",
            jp: "Promiseはコールバックキューではなく**マイクロタスクキュー**を使用（優先度が高い）。各タスク後、イベントループはマイクロタスクキューを全て処理してから次のマクロタスクを取り出す。つまり`.then()`・`await`の継続は`setTimeout`より先に実行される。",
          },
        },
        {
          type: "code",
          title: { en: "Macrotasks vs microtasks — the output order that trips everyone up", np: "Macrotask vs microtask — सबैलाई confuse गर्ने output order", jp: "マクロタスクとマイクロタスク — 誰もが混乱する実行順序" },
          code: `console.log("1 — sync");

setTimeout(() => console.log("5 — macrotask (setTimeout)"), 0);

Promise.resolve()
  .then(() => console.log("3 — microtask (Promise.then)"))
  .then(() => console.log("4 — microtask (chained .then)"));

console.log("2 — sync");

// Output:
// 1 — sync
// 2 — sync
// 3 — microtask (Promise.then)
// 4 — microtask (chained .then)
// 5 — macrotask (setTimeout)

// Why?
// 1. Call stack runs: console.log("1")
// 2. setTimeout callback → goes to macrotask queue (waits)
// 3. Promise.resolve().then() → callback goes to microtask queue
// 4. Call stack runs: console.log("2")
// 5. Call stack is now empty
// 6. Event loop: drain microtasks first → "3" then "4"
// 7. Now check macrotask queue → "5"

// ── queueMicrotask — run something in the microtask queue ─────────
queueMicrotask(() => console.log("also a microtask"));

// ── Summary of priorities (highest to lowest) ─────────────────────
// 1. Synchronous code (call stack)
// 2. Microtasks (Promise.then, queueMicrotask, MutationObserver)
// 3. Macrotasks (setTimeout, setInterval, setImmediate in Node, I/O callbacks)`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            { en: "**Macrotasks** (also called tasks): `setTimeout`, `setInterval`, `setImmediate` (Node), I/O callbacks, UI rendering. One macrotask runs per event loop turn.", np: "**Macrotasks**: setTimeout, setInterval, setImmediate, I/O callbacks, UI rendering। एक event loop turn मा एउटा macrotask।", jp: "**マクロタスク**: setTimeout・setInterval・setImmediate・I/Oコールバック・UIレンダリング。1回のイベントループで一つ実行。" },
            { en: "**Microtasks**: `Promise.then/catch/finally`, `await` continuations, `queueMicrotask`, `MutationObserver`. ALL microtasks in the queue run before the next macrotask.", np: "**Microtasks**: Promise.then/catch/finally, await continuations, queueMicrotask। queue मा भएका सबै microtasks अर्को macrotask अगाडि run हुन्छन्।", jp: "**マイクロタスク**: Promise.then/catch/finally・awaitの継続・queueMicrotask。キュー内の全マイクロタスクが次のマクロタスクの前に実行される。" },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "Why does setTimeout(fn, 0) not run immediately?", np: "setTimeout(fn, 0) तुरन्त किन run हुँदैन?", jp: "setTimeout(fn, 0)が即座に実行されない理由は？" },
      answer: {
        en: "Because `setTimeout` is a Web API — it runs outside JavaScript's main thread. When the timer fires (even at 0ms), the callback is placed in the macrotask queue. The event loop only picks it up after the current call stack has completely emptied AND all microtasks have run. So `setTimeout(fn, 0)` means 'run this as soon as possible, but after all synchronous code and all pending microtasks have finished'.",
        np: "`setTimeout` Web API हो — JavaScript को main thread बाहिर run हुन्छ। Timer fire हुँदा (0ms भए पनि) callback macrotask queue मा जान्छ। Event loop ले तब मात्र pick up गर्छ जब current call stack completely empty हुन्छ र सबै microtasks run भइसक्छन्।",
        jp: "`setTimeout`はWeb APIで、JSのメインスレッド外で実行される。タイマーが発火すると（0msでも）コールバックはマクロタスクキューに入る。イベントループは現在のコールスタックが完全に空になり、全マイクロタスクが完了した後にのみ取り出す。",
      },
    },
    {
      question: { en: "What is a 'task' vs a 'microtask'?", np: "Task र microtask मा के फरक?", jp: "タスクとマイクロタスクの違いは？" },
      answer: {
        en: "A task (or macrotask) is a unit of work scheduled by setTimeout, setInterval, I/O callbacks, or UI events — one runs per event loop iteration. A microtask is a unit of work scheduled by Promises, queueMicrotask, or MutationObserver. All microtasks in the queue are drained after each task, before the next task runs. This means microtasks run more urgently than macrotasks. If a microtask schedules another microtask, that new one also runs before any macrotask.",
        np: "Task (macrotask) setTimeout, setInterval, I/O callbacks, UI events ले schedule गर्छ — एक event loop iteration मा एउटा run हुन्छ। Microtask Promises, queueMicrotask ले schedule गर्छ। हर task पछि queue मा भएका सबै microtasks drain हुन्छन्। Microtask ले अर्को microtask schedule गरे त्यो पनि अर्को macrotask अगाडि run हुन्छ।",
        jp: "タスク（マクロタスク）はsetTimeout・I/O・UIイベントがスケジュール — イベントループ1回あたり1つ実行。マイクロタスクはPromise・queueMicrotaskがスケジュール。各タスク後、キュー内の全マイクロタスクが消化される。マイクロタスクが新たなマイクロタスクをスケジュールすると、それも次のマクロタスク前に実行される。",
      },
    },
    {
      question: { en: "What does 'blocking the event loop' mean and why is it bad?", np: "Event loop block गर्नु भनेको के हो र किन खराब?", jp: "「イベントループのブロック」とは何か、なぜ悪いのか？" },
      answer: {
        en: "Blocking the event loop means running synchronous code that takes a long time — a heavy computation, a huge loop, or synchronous file I/O. While that code runs, the call stack is never empty, so the event loop cannot process any callbacks: timers don't fire, fetch responses are not handled, user clicks are ignored. The page or server freezes until the synchronous code finishes. For heavy CPU work, use Web Workers (browser) or worker_threads (Node.js) to run on a separate thread.",
        np: "Event loop block गर्नु भनेको time-consuming synchronous code run गर्नु हो — heavy computation, huge loop, वा synchronous file I/O। Call stack कहिल्यै empty नहुनाले event loop कुनै callback process गर्न सक्दैन। Page वा server freeze हुन्छ। Heavy CPU work का लागि Web Workers (browser) वा worker_threads (Node.js) प्रयोग गर्नुहोस्।",
        jp: "イベントループのブロックとは長時間の同期コード実行（重い計算・巨大ループ・同期I/O）。コールスタックが空にならないため、タイマーも応答も処理できない。ページやサーバーがフリーズ。重いCPU処理はWeb Workers(ブラウザ)やworker_threads(Node.js)を使う。",
      },
    },
  ],
};
