import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_14_LESSONS: JsLessonDay = {
  day: 14,
  title: { en: "Node.js event loop phases — nextTick & setImmediate", np: "Node.js event loop phases — nextTick र setImmediate", jp: "Node.jsのイベントループフェーズ — nextTickとsetImmediate" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "nodejs-event-loop-phases",
      title: { en: "The Node.js Event Loop Phases", np: "Node.js Event Loop Phases", jp: "Node.jsイベントループのフェーズ" },
      durationMinutes: 9,
      explanation: {
        en: "Node.js runs its own event loop on top of a C library called <b>libuv</b>, and unlike the simplified browser model from Day 13, Node's loop has explicit, ordered <b>phases</b>: timers → pending callbacks → idle/prepare (internal) → poll → check → close callbacks. Each phase owns its own callback queue, and the loop drains that entire queue before moving to the next phase — it doesn't jump around freely.\n\nThe two phases you'll actually touch as a developer are <b>poll</b> (where I/O callbacks like `fs.readFile` and network responses run, and where the loop parks and waits if there's nothing else to do) and <b>check</b> (where `setImmediate()` callbacks run, always right after poll). Between every single phase transition, Node also drains its <b>microtask queues</b> — `process.nextTick()` first, then Promise callbacks — so microtasks can run many times per loop, not just once at the very start like the simplified browser picture suggests.",
        np: "Node.js ले libuv माथि आफ्नै event loop चलाउँछ, र Day 13 को simple browser model भन्दा फरक, Node को loop मा explicit, ordered <b>phases</b> छन्: timers → pending callbacks → idle/prepare (internal) → poll → check → close callbacks। हरेक phase को आफ्नै callback queue हुन्छ, र loop ले अर्को phase मा जानु अघि त्यो पूरा queue drain गर्छ।\n\nDeveloper को रूपमा सबैभन्दा बढी touch गर्ने phases हुन् <b>poll</b> (जहाँ `fs.readFile` जस्ता I/O callbacks र network responses run हुन्छन्, र केही नभए loop यहीं wait गर्छ) र <b>check</b> (जहाँ `setImmediate()` callbacks — poll पछि सधैं — run हुन्छन्)। हरेक phase transition बीचमा Node ले <b>microtask queues</b> पनि drain गर्छ — पहिले `process.nextTick()`, त्यसपछि Promise callbacks — यसैले microtasks loop मा धेरैपटक run हुन सक्छ, browser को simple picture जस्तो केवल सुरुमा मात्र होइन।",
        jp: "Node.jsは<b>libuv</b>というCライブラリの上で独自のイベントループを実行しており、Day 13で学んだ単純化されたブラウザモデルとは異なり、明示的で順序立った<b>フェーズ</b>を持つ：タイマー → ペンディングコールバック → アイドル/準備（内部用） → ポーリング → チェック → クローズコールバック。各フェーズは独自のコールバックキューを持ち、ループは次のフェーズに進む前にそのキューを完全に消化してから進む。\n\n開発者として実際に触れる主なフェーズは<b>ポーリング</b>（`fs.readFile`やネットワーク応答などのI/Oコールバックが実行され、他にやることがなければループがここで待機する）と<b>チェック</b>（`setImmediate()`のコールバックが実行され、常にポーリングの直後）の2つ。すべてのフェーズ遷移の間で、Nodeは<b>マイクロタスクキュー</b>も消化する — まず`process.nextTick()`、次にPromiseコールバック。そのためマイクロタスクはループの開始時だけでなく、1周の中で何度も実行され得る。",
      },
      diagram: `      ┌──────────────┐
 ┌───►│    TIMERS    │  setTimeout / setInterval callbacks whose delay expired
 │    └──────┬───────┘
 │            ▼
 │    ┌──────────────┐
 │    │   PENDING    │  I/O callbacks deferred to next tick (e.g. some TCP errors)
 │    │  CALLBACKS   │
 │    └──────┬───────┘
 │            ▼
 │    ┌──────────────┐
 │    │ IDLE/PREPARE │  internal Node.js use only
 │    └──────┬───────┘
 │            ▼
 │    ┌──────────────┐
 │    │     POLL     │  fetch new I/O events, run their callbacks — waits here
 │    │              │  if queue is empty (unless setImmediate is scheduled)
 │    └──────┬───────┘
 │            ▼
 │    ┌──────────────┐
 │    │    CHECK     │  setImmediate() callbacks run here — always after poll
 │    └──────┬───────┘
 │            ▼
 │    ┌──────────────┐
 └────┤    CLOSE     │  socket.on("close", cb) — abruptly closed resources
      └──────────────┘

  ── BETWEEN every phase: drain process.nextTick() queue, then Promise queue ──`,
      codeExample: {
        title: { en: "Watching each phase run in order", np: "हरेक phase order मा run हुँदै", jp: "各フェーズが順番に実行される様子" },
        code: `const fs = require("fs");

// ── Timers phase ──────────────────────────────────────────────────────
setTimeout(() => console.log("timers phase"), 0);

// ── Poll phase — real I/O ────────────────────────────────────────────
fs.readFile(__filename, () => {
  console.log("poll phase (I/O callback)");

  // These are scheduled from INSIDE an I/O callback, already past poll:
  setTimeout(() => console.log("  -> timers phase (next loop iteration)"), 0);
  setImmediate(() => console.log("  -> check phase (setImmediate)"));
});

// ── Check phase ───────────────────────────────────────────────────────
setImmediate(() => console.log("check phase (setImmediate)"));

console.log("synchronous code runs first, always");

// Typical output:
// synchronous code runs first, always
// timers phase
// check phase (setImmediate)
// poll phase (I/O callback)
//   -> check phase (setImmediate)
//   -> timers phase (next loop iteration)

// ── Microtasks drain BETWEEN phases, not just once ───────────────────
setTimeout(() => {
  console.log("A: timers phase");
  process.nextTick(() => console.log("B: nextTick scheduled inside timers"));
  Promise.resolve().then(() => console.log("C: promise scheduled inside timers"));
}, 0);
// Output: A, then B, then C — nextTick + promise queues drain
// immediately after this timers callback finishes, before the
// loop is allowed to move on to the pending-callbacks phase.`,
      },
      keyTakeaways: [
        { en: "Node's event loop (built on <b>libuv</b>) has explicit phases — timers, pending callbacks, poll, check, close callbacks — each with its own queue, fully drained before the loop moves on.", np: "Node को event loop (<b>libuv</b> मा built) मा explicit phases छन् — timers, pending callbacks, poll, check, close callbacks — हरेकको आफ्नै queue, अर्को मा जानु अघि पूरा drain हुने।", jp: "Nodeのイベントループ（<b>libuv</b>ベース）には明示的なフェーズがある — タイマー・ペンディングコールバック・ポーリング・チェック・クローズコールバック。各フェーズは独自のキューを持ち、次に進む前に完全に消化される。" },
        { en: "`fs.readFile` and network callbacks run in the <b>poll</b> phase; `setImmediate()` callbacks always run right after, in the <b>check</b> phase.", np: "`fs.readFile` र network callbacks <b>poll</b> phase मा run हुन्छन्; `setImmediate()` callbacks सधैं त्यसपछि <b>check</b> phase मा run हुन्छन्।", jp: "`fs.readFile`やネットワークコールバックは<b>ポーリング</b>フェーズで実行され、`setImmediate()`のコールバックは常にその直後の<b>チェック</b>フェーズで実行される。" },
        { en: "Between <b>every</b> phase transition, Node drains `process.nextTick()` then the Promise microtask queue — microtasks run many times per loop cycle, not just once at the start.", np: "<b>हरेक</b> phase transition बीचमा Node ले `process.nextTick()` त्यसपछि Promise microtask queue drain गर्छ — microtasks एक loop cycle मा धेरैपटक run हुन्छन्, सुरुमा मात्र होइन।", jp: "<b>すべての</b>フェーズ遷移の間で、Nodeは`process.nextTick()`、続いてPromiseマイクロタスクキューを消化する。マイクロタスクは1回のループサイクルで何度も実行され、開始時だけではない。" },
      ],
      commonMistakes: [
        { en: "Assuming Node's event loop works exactly like the browser's single microtask-checkpoint model from Day 13 — Node has multiple named phases that the browser model doesn't have.", np: "Node को event loop Day 13 को browser को single microtask-checkpoint model जस्तै काम गर्छ भन्ने ठान्नु — Node मा browser मा नभएका multiple named phases छन्।", jp: "Nodeのイベントループが、Day 13で学んだブラウザの単一マイクロタスクチェックポイントモデルと全く同じだと思い込むこと。Nodeにはブラウザモデルにない複数の名前付きフェーズがある。" },
        { en: "Forgetting that a phase fully drains its own queue before moving on — a slow poll-phase callback delays everything scheduled for the check phase after it.", np: "अर्को मा जानु अघि phase ले आफ्नो queue पूर्ण drain गर्छ भन्ने बिर्सनु — ढिलो poll-phase callback ले check phase मा schedule भएका सबैलाई ढिलाइ गराउँछ।", jp: "次に進む前にフェーズが自身のキューを完全に消化することを忘れること。遅いポーリングフェーズのコールバックは、その後チェックフェーズに予定されているすべてを遅らせる。" },
        { en: "Thinking the idle/prepare phase is something you can hook into — it's internal-only; you will never schedule a callback into it.", np: "Idle/prepare phase मा hook गर्न सकिन्छ भन्ने ठान्नु — यो internal-only हो; तपाईंले यसमा कहिल्यै callback schedule गर्नुहुन्न।", jp: "アイドル/準備フェーズにフックできると考えること。これは内部専用であり、コールバックをスケジュールすることは決してない。" },
      ],
      quiz: [
        {
          question: { en: "What C library is Node.js's event loop built on top of?", np: "Node.js को event loop कुन C library माथि built छ?", jp: "Node.jsのイベントループはどのCライブラリの上に構築されている？" },
          options: [
            { en: "libuv", np: "libuv", jp: "libuv" },
            { en: "V8", np: "V8", jp: "V8" },
          ],
          correctIndex: 0,
          explanation: { en: "libuv provides Node's event loop, thread pool, and async I/O; V8 is the JavaScript engine that executes the code, a separate piece.", np: "libuv ले Node को event loop, thread pool, र async I/O दिन्छ; V8 code execute गर्ने JavaScript engine हो, फरक भाग।", jp: "libuvがNodeのイベントループ、スレッドプール、非同期I/Oを提供する。V8はコードを実行するJavaScriptエンジンで、別の部分。" },
        },
        {
          question: { en: "In which phase do `fs.readFile` callbacks and network response callbacks run?", np: "`fs.readFile` callbacks र network response callbacks कुन phase मा run हुन्छन्?", jp: "`fs.readFile`コールバックとネットワーク応答コールバックはどのフェーズで実行される？" },
          options: [
            { en: "The poll phase", np: "Poll phase", jp: "ポーリングフェーズ" },
            { en: "The timers phase", np: "Timers phase", jp: "タイマーフェーズ" },
          ],
          correctIndex: 0,
          explanation: { en: "The poll phase retrieves new I/O events and runs their callbacks; it's also where the loop waits if there's nothing else scheduled.", np: "Poll phase ले नयाँ I/O events retrieve गरी callbacks run गर्छ; केही schedule नभए loop यहीं wait गर्छ।", jp: "ポーリングフェーズは新しいI/Oイベントを取得してコールバックを実行する。他に何もスケジュールされていなければループはここで待機する。" },
        },
        {
          question: { en: "Does Node drain `process.nextTick()` and Promise queues only once, at the very start of the loop?", np: "Node ले `process.nextTick()` र Promise queues लाई loop को सुरुमा मात्र एकपल्ट drain गर्छ?", jp: "Nodeは`process.nextTick()`とPromiseキューをループの最初に一度だけ消化する？" },
          options: [
            { en: "No — it drains them between every single phase transition", np: "होइन — यो हरेक phase transition बीचमा drain गर्छ", jp: "いいえ — すべてのフェーズ遷移の間で消化する" },
            { en: "Yes — exactly like a simplified diagram would suggest", np: "हो — simplified diagram ले देखाए जस्तै exactly", jp: "はい — 単純化された図が示す通り" },
          ],
          correctIndex: 0,
          explanation: { en: "Microtask queues are checked and fully drained between every phase transition, so they can effectively run many times within a single loop cycle.", np: "Microtask queues हरेक phase transition बीचमा check र पूर्ण drain हुन्छन्, त्यसैले तिनीहरू एक loop cycle भित्र धेरैपटक run हुन सक्छन्।", jp: "マイクロタスクキューはすべてのフェーズ遷移の間でチェックされ完全に消化されるため、1回のループサイクル内で実質的に何度も実行され得る。" },
        },
      ],
    },
    {
      id: "nexttick-vs-setimmediate-vs-settimeout",
      title: { en: "nextTick vs setImmediate vs setTimeout(fn, 0)", np: "nextTick vs setImmediate vs setTimeout(fn, 0)", jp: "nextTick vs setImmediate vs setTimeout(fn, 0)" },
      durationMinutes: 9,
      explanation: {
        en: "These three scheduling tools sit at very different priority levels. `process.nextTick()` is the <b>highest priority</b> — its queue runs before any event loop phase and even before Promise microtasks; it fires at the end of the current operation, no matter what. `setImmediate()` runs in the <b>check</b> phase, right after poll finishes — it's the Node-specific way to say \"run this after I/O, but as soon as possible.\" `setTimeout(fn, 0)` runs in the <b>timers</b> phase — technically the delay is clamped to at least 1ms, and it competes with whatever else is queued there.\n\nThe classic interview question mixes all four together: synchronous code, `process.nextTick()`, a Promise `.then()`, and `setTimeout`/`setImmediate`. The rule of thumb is <b>sync → nextTick → promises → macrotasks (timers/check)</b>. But `setTimeout(fn, 0)` vs `setImmediate()` at the top level of a script is technically <b>non-deterministic</b> — which one wins depends on how fast the process starts up. The one place their order is guaranteed is <b>inside an I/O callback</b>, where `setImmediate()` always wins because the loop is already sitting right before the check phase.",
        np: "यी तीन scheduling tools फरक फरक priority level मा छन्। `process.nextTick()` <b>सबैभन्दा high priority</b> हो — यसको queue कुनै पनि event loop phase र Promise microtasks भन्दा पहिले नै run हुन्छ; यो current operation सकिनासाथ fire हुन्छ। `setImmediate()` <b>check</b> phase मा, poll सकिएपछि तुरुन्तै run हुन्छ — यो Node-specific तरिका हो \"I/O पछि, तर सकेसम्म चाँडो run गर्नुहोस्\" भन्ने। `setTimeout(fn, 0)` <b>timers</b> phase मा run हुन्छ — technically delay कम्तिमा 1ms मा clamp हुन्छ, र त्यहाँ queue भएका अरूसँग compete गर्छ।\n\nClassic interview question ले चारैलाई मिलाउँछ: synchronous code, `process.nextTick()`, Promise `.then()`, र `setTimeout`/`setImmediate`। सामान्य नियम हो <b>sync → nextTick → promises → macrotasks (timers/check)</b>। तर top level मा `setTimeout(fn, 0)` vs `setImmediate()` technically <b>non-deterministic</b> हो — प्रोसेस कति चाँडो start भयो मा depend गर्छ। जहाँ order guaranteed हुन्छ त्यो हो <b>I/O callback भित्र</b>, जहाँ `setImmediate()` सधैं जित्छ किनकि loop पहिले नै check phase भन्दा ठीक अगाडि हुन्छ।",
        jp: "これら3つのスケジューリング手段は優先度が大きく異なる。`process.nextTick()`は<b>最優先</b>で、そのキューはどのイベントループフェーズよりも、Promiseマイクロタスクよりも先に実行される。現在の処理が終わった時点で必ず発火する。`setImmediate()`は<b>チェック</b>フェーズ、つまりポーリング直後に実行される — 「I/Oの後、できるだけ早く」を表すNode固有の手段。`setTimeout(fn, 0)`は<b>タイマー</b>フェーズで実行される — 技術的には遅延は最低1msにクランプされ、そのフェーズにキューされた他のものと競合する。\n\n定番の面接問題はこの4つを混ぜる：同期コード、`process.nextTick()`、Promiseの`.then()`、`setTimeout`/`setImmediate`。基本ルールは<b>同期 → nextTick → Promise → マクロタスク（タイマー/チェック）</b>。しかしスクリプトのトップレベルでの`setTimeout(fn, 0)`と`setImmediate()`の順序は技術的には<b>非決定的</b> — プロセスの起動速度に依存する。順序が保証される唯一の場所は<b>I/Oコールバックの内部</b>で、そこではループがすでにチェックフェーズの直前にいるため`setImmediate()`が常に勝つ。",
      },
      diagram: `PRIORITY (highest → lowest)
  1. synchronous code                    ← runs first, always
  2. process.nextTick() queue            ← fully drained, before any microtask
  3. Promise microtask queue (.then)     ← fully drained, before any macrotask
  4. setTimeout(fn, 0)   → TIMERS phase  ← macrotask
  5. setImmediate()      → CHECK  phase  ← macrotask, always after POLL

At the TOP LEVEL of a script:
  setTimeout(fn, 0)  vs  setImmediate()  →  ORDER IS NOT GUARANTEED

INSIDE an I/O callback (already sitting just before POLL finishes):
  setImmediate() ──► CHECK phase runs immediately next   ← ALWAYS wins
  setTimeout(fn,0) ──► must wait for the NEXT loop's TIMERS phase`,
      codeExample: {
        title: { en: "The classic ordering interview question", np: "Classic ordering interview question", jp: "定番の実行順序面接問題" },
        code: `// ── Predict the output ───────────────────────────────────────────────
setImmediate(() => console.log("setImmediate"));

setTimeout(() => console.log("setTimeout 0"), 0);

Promise.resolve().then(() => console.log("Promise.then"));

process.nextTick(() => console.log("process.nextTick"));

console.log("sync");

// Correct output order:
// sync
// process.nextTick     <- nextTick queue, drained before Promises
// Promise.then         <- microtask queue
// setTimeout 0         <- timers phase (at top level, may swap with setImmediate)
// setImmediate         <- check phase

// ── The one place order IS guaranteed: inside an I/O callback ───────
const fs = require("fs");
fs.readFile(__filename, () => {
  setTimeout(() => console.log("timeout"), 0);
  setImmediate(() => console.log("immediate"));
  // Already past POLL here, so CHECK phase runs before the NEXT
  // loop's TIMERS phase:
  // Output: immediate, then timeout   <- deterministic in this context
});

// ── process.nextTick() use case — run after the constructor returns ──
class Emitter {
  constructor(cb) {
    // Without nextTick, cb would fire mid-constructor, before setup
    // finishes and before the caller even has a reference to "this".
    process.nextTick(() => cb(this));
  }
}
new Emitter((instance) => console.log("ready:", instance));
console.log("constructor call returned");
// Output: "constructor call returned" then "ready: Emitter {}"`,
      },
      keyTakeaways: [
        { en: "`process.nextTick()` is the highest priority queue — it runs before any Promise microtask and before any event loop phase, right after the current operation finishes.", np: "`process.nextTick()` सबैभन्दा high priority queue हो — यो कुनै Promise microtask र कुनै event loop phase भन्दा पहिले, current operation सकिनासाथ run हुन्छ।", jp: "`process.nextTick()`は最優先のキューで、Promiseマイクロタスクよりも、どのイベントループフェーズよりも先に、現在の処理が終わった直後に実行される。" },
        { en: "The priority order is sync code → nextTick → Promise microtasks → macrotasks (`setTimeout` in timers, `setImmediate` in check).", np: "Priority order हो sync code → nextTick → Promise microtasks → macrotasks (`setTimeout` timers मा, `setImmediate` check मा)।", jp: "優先順位は同期コード → nextTick → Promiseマイクロタスク → マクロタスク（タイマーのsetTimeout、チェックのsetImmediate）。" },
        { en: "`setTimeout(fn, 0)` vs `setImmediate()` order is non-deterministic at the top level, but `setImmediate()` is guaranteed to win when both are scheduled inside an I/O callback.", np: "Top level मा `setTimeout(fn, 0)` vs `setImmediate()` को order non-deterministic हुन्छ, तर I/O callback भित्र दुवै schedule भए `setImmediate()` सधैं जित्छ।", jp: "トップレベルでの`setTimeout(fn, 0)`と`setImmediate()`の順序は非決定的だが、両方がI/Oコールバック内でスケジュールされた場合は`setImmediate()`が必ず勝つ。" },
      ],
      commonMistakes: [
        { en: "Assuming `setImmediate()` always runs before `setTimeout(fn, 0)` everywhere — that guarantee only holds when both are scheduled from inside an I/O callback.", np: "`setImmediate()` जहाँसुकै `setTimeout(fn, 0)` भन्दा पहिले run हुन्छ भन्ने ठान्नु — यो guarantee दुवै I/O callback भित्र schedule भएमा मात्र हुन्छ।", jp: "`setImmediate()`がどこでも常に`setTimeout(fn, 0)`より先に実行されると思い込むこと。その保証は両方がI/Oコールバック内でスケジュールされた場合のみ成立する。" },
        { en: "Forgetting that `process.nextTick()` runs before Promise `.then()` callbacks — the two are separate queues, and nextTick's queue is always fully drained first.", np: "`process.nextTick()` Promise `.then()` callbacks भन्दा पहिले run हुन्छ भन्ने बिर्सनु — यी दुई फरक queues हुन्, र nextTick को queue सधैं पहिले पूर्ण drain हुन्छ।", jp: "`process.nextTick()`がPromiseの`.then()`コールバックより先に実行されることを忘れること。この2つは別のキューで、nextTickのキューが常に先に完全消化される。" },
        { en: "Treating `setTimeout(fn, 0)` as \"runs immediately\" — the callback still waits for the timers phase and for the minimum ~1ms clamp, so sync code and microtasks always run first.", np: "`setTimeout(fn, 0)` लाई \"तुरुन्तै run हुन्छ\" भनी treat गर्नु — callback ले अझै timers phase र न्यूनतम ~1ms clamp पर्खनुपर्छ, त्यसैले sync code र microtasks सधैं पहिले run हुन्छन्।", jp: "`setTimeout(fn, 0)`を「即座に実行される」と扱うこと。コールバックはタイマーフェーズと最低約1msのクランプを待つため、同期コードとマイクロタスクは常に先に実行される。" },
      ],
      quiz: [
        {
          question: { en: "Which runs first: `process.nextTick()` or `Promise.resolve().then()`, scheduled in the same synchronous block?", np: "एउटै synchronous block मा schedule गरिएको `process.nextTick()` र `Promise.resolve().then()` मध्ये कुन पहिले run हुन्छ?", jp: "同じ同期ブロックでスケジュールされた`process.nextTick()`と`Promise.resolve().then()`のどちらが先に実行される？" },
          options: [
            { en: "process.nextTick() — its queue drains before Promise microtasks", np: "process.nextTick() — यसको queue Promise microtasks भन्दा पहिले drain हुन्छ", jp: "process.nextTick() — そのキューはPromiseマイクロタスクより先に消化される" },
            { en: "Promise.resolve().then() — Promises always have higher priority", np: "Promise.resolve().then() — Promises को सधैं high priority हुन्छ", jp: "Promise.resolve().then() — Promiseは常に優先度が高い" },
          ],
          correctIndex: 0,
          explanation: { en: "Node checks and fully drains the nextTick queue before it even looks at the Promise microtask queue.", np: "Node ले Promise microtask queue हेर्नु अघि नै nextTick queue check र पूर्ण drain गर्छ।", jp: "NodeはPromiseマイクロタスクキューを見る前に、nextTickキューをチェックして完全に消化する。" },
        },
        {
          question: { en: "Inside an `fs.readFile` callback, is `setImmediate()` or `setTimeout(fn, 0)` guaranteed to run first?", np: "`fs.readFile` callback भित्र, `setImmediate()` वा `setTimeout(fn, 0)` मध्ये कुन पहिले run हुने guaranteed छ?", jp: "`fs.readFile`コールバック内で、`setImmediate()`と`setTimeout(fn, 0)`のどちらが先に実行されると保証されている？" },
          options: [
            { en: "setImmediate() — the loop is already right before the check phase", np: "setImmediate() — loop पहिले नै check phase भन्दा ठीक अगाडि हुन्छ", jp: "setImmediate() — ループはすでにチェックフェーズの直前にいる" },
            { en: "setTimeout(fn, 0) — timers always run before check", np: "setTimeout(fn, 0) — timers सधैं check भन्दा पहिले run हुन्छ", jp: "setTimeout(fn, 0) — タイマーは常にチェックより先に実行される" },
          ],
          correctIndex: 0,
          explanation: { en: "Since an I/O callback runs in the poll phase, the loop is about to enter the check phase next, so setImmediate wins deterministically here.", np: "I/O callback poll phase मा run हुने भएकाले, loop अर्को check phase मा जाँदैछ, त्यसैले यहाँ setImmediate deterministically जित्छ।", jp: "I/Oコールバックはポーリングフェーズで実行されるため、ループは次にチェックフェーズに入ろうとしている。そのためここではsetImmediateが決定的に勝つ。" },
        },
        {
          question: { en: "Is the order between `setTimeout(fn, 0)` and `setImmediate()` guaranteed at the top level of a script (not inside I/O)?", np: "Script को top level मा (I/O भित्र होइन) `setTimeout(fn, 0)` र `setImmediate()` को order guaranteed हुन्छ?", jp: "スクリプトのトップレベル（I/O内ではない）で`setTimeout(fn, 0)`と`setImmediate()`の順序は保証されている？" },
          options: [
            { en: "No — it's non-deterministic and depends on process startup timing", np: "होइन — यो non-deterministic हो र process startup timing मा depend गर्छ", jp: "いいえ — 非決定的でプロセスの起動タイミングに依存する" },
            { en: "Yes — setImmediate always wins everywhere", np: "हो — setImmediate जहाँसुकै सधैं जित्छ", jp: "はい — setImmediateは常にどこでも勝つ" },
          ],
          correctIndex: 0,
          explanation: { en: "At the top level, which of the two macrotasks fires first can vary run to run depending on how quickly the event loop reaches the timers phase.", np: "Top level मा, दुई macrotasks मध्ये कुन पहिले fire हुन्छ event loop कति चाँडो timers phase मा पुग्छ भन्नेमा depend गरी फरक फरक हुन सक्छ।", jp: "トップレベルでは、イベントループがタイマーフェーズにどれだけ早く到達するかによって、2つのマクロタスクのどちらが先に発火するかは実行ごとに変わり得る。" },
        },
      ],
    },
    {
      id: "async-ordering-pitfalls",
      title: { en: "Common Async Ordering Pitfalls", np: "Common Async Ordering Pitfalls", jp: "よくある非同期順序の落とし穴" },
      durationMinutes: 9,
      explanation: {
        en: "The most dangerous pitfall is <b>recursive `process.nextTick()` starving the event loop</b>: because the nextTick queue must be fully drained before the loop can advance to any phase, a callback that keeps scheduling another `process.nextTick()` traps the loop forever — timers never fire, I/O callbacks never run, not even Promises get a turn. Node has no built-in recursion limit for this (unlike the call stack), so it's a real production bug, not just a theoretical one. If you need a callback to run repeatedly without blocking I/O, use `setImmediate()` instead — it always yields to the poll phase between calls.\n\nTwo more subtle pitfalls: assuming `setImmediate()` always beats `setTimeout(fn, 0)` — true only inside I/O callbacks, non-deterministic elsewhere — and forgetting that a <b>synchronous throw</b> happens immediately, before any callback you scheduled ever gets a chance to run. If validation code throws before you call `setTimeout` or `fs.readFile`, the scheduled callback simply never exists — there's nothing async to catch it, so wrap the risky synchronous part in its own `try/catch` rather than assuming your `.catch()` further down the chain will see it.",
        np: "सबैभन्दा खतरनाक pitfall हो <b>recursive `process.nextTick()` ले event loop starve गर्नु</b>: nextTick queue कुनै पनि phase मा जानु अघि पूर्ण drain हुनुपर्ने भएकाले, अर्को `process.nextTick()` schedule गरिरहने callback ले loop लाई सधैंको लागि trap गर्छ — timers कहिल्यै fire हुँदैनन्, I/O callbacks कहिल्यै run हुँदैनन्, Promises सम्म पनि पालो पाउँदैनन्। Node मा यसको लागि कुनै built-in recursion limit छैन (call stack जस्तो होइन), त्यसैले यो theoretical मात्र होइन real production bug हो। Repeatedly callback चलाउनु छ तर I/O block गर्नु छैन भने `setImmediate()` प्रयोग गर्नुहोस् — यसले call बीचमा सधैं poll phase लाई yield गर्छ।\n\nअरू दुई subtle pitfalls: `setImmediate()` सधैं `setTimeout(fn, 0)` भन्दा जित्छ भन्ने ठान्नु — यो सही केवल I/O callbacks भित्र, अन्यत्र non-deterministic। र <b>synchronous throw</b> तुरुन्तै हुन्छ भन्ने बिर्सनु, तपाईंले schedule गरेको कुनै callback ले पालो पाउनु अघि नै। `setTimeout` वा `fs.readFile` call गर्नु अघि validation code throw भयो भने, schedule भएको callback कहिल्यै exist नै हुँदैन — यसलाई पछि catch गर्ने कुनै async चीज हुँदैन, त्यसैले risky synchronous भाग लाई आफ्नै `try/catch` मा wrap गर्नुहोस्, chain तलको `.catch()` ले देख्छ भन्ने नठान्नुहोस्।",
        jp: "最も危険な落とし穴は<b>再帰的な`process.nextTick()`によるイベントループの枯渇</b>：nextTickキューはどのフェーズに進む前にも完全に消化されなければならないため、次々と`process.nextTick()`をスケジュールし続けるコールバックはループを永遠に閉じ込める — タイマーは発火せず、I/Oコールバックも実行されず、Promiseすら順番が回ってこない。Nodeにはこれに対する組み込みの再帰制限がなく（コールスタックとは異なり）、理論上だけでなく実際の本番バグになり得る。I/Oをブロックせずにコールバックを繰り返し実行したい場合は代わりに`setImmediate()`を使う — 呼び出しの間に必ずポーリングフェーズに譲歩する。\n\nさらに2つの微妙な落とし穴：`setImmediate()`が常に`setTimeout(fn, 0)`に勝つと思い込むこと — これはI/Oコールバック内でのみ真で、それ以外では非決定的。そして<b>同期的なthrow</b>が即座に起こり、スケジュールしたコールバックが実行される機会を得る前に発生することを忘れること。`setTimeout`や`fs.readFile`を呼ぶ前にバリデーションコードがthrowすれば、スケジュールされるはずだったコールバックはそもそも存在しない — それを捕まえる非同期の仕組みは何もないため、リスクのある同期部分は独自の`try/catch`で包むべきで、チェーンの先の`.catch()`が捕まえてくれると仮定してはいけない。",
      },
      diagram: `PITFALL 1 — recursive nextTick starves the loop
  process.nextTick(function loop() {
    process.nextTick(loop);     ← keeps refilling the SAME queue
  });
  TIMERS  ──X   never reached
  POLL    ──X   I/O callbacks never run  (event loop "starved")
  CHECK   ──X
  → nextTick queue must be FULLY drained before advancing — an
    infinitely refilling queue blocks the loop forever

PITFALL 2 — setImmediate vs setTimeout ordering is CONTEXT dependent
  top level        → non-deterministic (either could win)
  inside I/O cb     → setImmediate always wins (loop already past poll)

PITFALL 3 — sync throw happens before anything is ever scheduled
  function risky() {
    if (!isValid) throw new Error("bad input");  ← throws HERE, synchronously
    setTimeout(doWork, 0);                        ← never reached, never scheduled
  }
  risky();  → must be wrapped in try/catch — no async .catch() will ever see this`,
      codeExample: {
        title: { en: "Starvation, context-dependent ordering & sync throws", np: "Starvation, context-dependent ordering, sync throws", jp: "枯渇・文脈依存の順序・同期throw" },
        code: `// ── Pitfall 1: recursive nextTick starves the event loop ─────────────
let count = 0;
function starve() {
  count++;
  process.nextTick(starve);   // keeps re-adding itself to the SAME queue
}
// starve();  // DON'T actually run this — timers/I/O will NEVER fire again

setTimeout(() => console.log("this timeout would never run if starve() above is active"), 0);

// ✅ Fix: use setImmediate for repeated work that must still allow I/O
function politeLoop(n) {
  if (n <= 0) return;
  console.log("tick", n);
  setImmediate(() => politeLoop(n - 1)); // yields to poll phase each time
}
politeLoop(3);

// ── Pitfall 2: setImmediate vs setTimeout is context-dependent ───────
// Non-deterministic here (top level, no I/O context):
setTimeout(() => console.log("timeout (top level)"), 0);
setImmediate(() => console.log("immediate (top level)"));

// Deterministic here (inside an I/O callback):
const fs = require("fs");
fs.readFile(__filename, () => {
  setTimeout(() => console.log("timeout (inside I/O)"), 0);
  setImmediate(() => console.log("immediate (inside I/O)"));
  // Guaranteed output: "immediate (inside I/O)" then "timeout (inside I/O)"
});

// ── Pitfall 3: a synchronous throw beats every async safety net ──────
function fetchConfig(path) {
  if (!path) {
    throw new Error("path is required"); // thrown SYNCHRONOUSLY, right here
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve({ path }), 0);
  });
}

try {
  fetchConfig();          // throws before any Promise is even created
} catch (err) {
  console.error("caught synchronously:", err.message); // this is where it's caught
}

// fetchConfig().catch(...) would NEVER see this error — the function
// throws before it gets anywhere near returning a Promise to chain onto.`,
      },
      keyTakeaways: [
        { en: "Recursive `process.nextTick()` calls starve the event loop — because the queue must fully drain before advancing, timers and I/O callbacks never get a turn.", np: "Recursive `process.nextTick()` calls ले event loop starve गर्छन् — queue अर्को मा जानु अघि पूर्ण drain हुनुपर्ने भएकाले, timers र I/O callbacks ले कहिल्यै पालो पाउँदैनन्।", jp: "再帰的な`process.nextTick()`呼び出しはイベントループを枯渇させる。キューは進む前に完全に消化される必要があるため、タイマーとI/Oコールバックは順番が回ってこない。" },
        { en: "`setImmediate()` beating `setTimeout(fn, 0)` is only guaranteed inside an I/O callback — at the top level of a script, the order is non-deterministic.", np: "`setImmediate()` ले `setTimeout(fn, 0)` लाई जित्ने कुरा I/O callback भित्र मात्र guaranteed हुन्छ — script को top level मा order non-deterministic हुन्छ।", jp: "`setImmediate()`が`setTimeout(fn, 0)`に勝つのはI/Oコールバック内でのみ保証される。スクリプトのトップレベルでは順序は非決定的。" },
        { en: "A synchronous `throw` happens immediately and prevents any scheduled callback from ever being created — wrap risky synchronous code in its own `try/catch`, don't rely on a downstream `.catch()`.", np: "Synchronous `throw` तुरुन्तै हुन्छ र कुनै schedule हुने callback कहिल्यै create नहुने बनाउँछ — risky synchronous code लाई आफ्नै `try/catch` मा wrap गर्नुहोस्, downstream `.catch()` मा भर पर्नु हुँदैन।", jp: "同期的な`throw`は即座に起こり、スケジュールされるはずだったコールバックがそもそも作られなくなる。リスクのある同期コードは独自の`try/catch`で包むべきで、後続の`.catch()`に頼ってはいけない。" },
      ],
      commonMistakes: [
        { en: "Using `process.nextTick()` for repeated/recursive async work instead of `setImmediate()` — nextTick recursion can starve I/O entirely, while setImmediate always yields to the poll phase.", np: "Repeated/recursive async work का लागि `setImmediate()` को सट्टा `process.nextTick()` प्रयोग गर्नु — nextTick recursion ले I/O लाई पूर्ण starve गर्न सक्छ, setImmediate ले सधैं poll phase लाई yield गर्छ।", jp: "繰り返し/再帰的な非同期処理に`setImmediate()`ではなく`process.nextTick()`を使うこと。nextTickの再帰はI/Oを完全に枯渇させ得るが、setImmediateは常にポーリングフェーズに譲歩する。" },
        { en: "Writing code that relies on `setImmediate()` always running before `setTimeout(fn, 0)` regardless of context, then being surprised when the order flips outside an I/O callback.", np: "`setImmediate()` जहाँसुकै `setTimeout(fn, 0)` भन्दा पहिले run हुन्छ भन्ने भर पर्ने code लेख्नु, त्यसपछि I/O callback बाहिर order flip हुँदा अचम्मित हुनु।", jp: "文脈に関係なく`setImmediate()`が常に`setTimeout(fn, 0)`より先に実行されると仮定したコードを書き、I/Oコールバックの外で順序が逆転して驚くこと。" },
        { en: "Assuming a function that returns a Promise is always safe to call without `try/catch`, when it can actually throw synchronously before ever creating the Promise.", np: "Promise फर्काउने function लाई `try/catch` बिना call गर्न सधैं safe छ भन्ने ठान्नु, जबकि यसले Promise create गर्नु अघि नै synchronously throw गर्न सक्छ।", jp: "Promiseを返す関数は`try/catch`なしで呼んでも常に安全だと仮定すること。実際にはPromiseを作成する前に同期的にthrowすることがある。" },
      ],
      quiz: [
        {
          question: { en: "What happens if a `process.nextTick()` callback keeps scheduling another `process.nextTick()`, forever?", np: "`process.nextTick()` callback ले अर्को `process.nextTick()` सधैंको लागि schedule गरिरह्यो भने के हुन्छ?", jp: "`process.nextTick()`のコールバックが次々と別の`process.nextTick()`を永遠にスケジュールし続けるとどうなる？" },
          options: [
            { en: "The event loop starves — timers and I/O callbacks never get a chance to run", np: "Event loop starve हुन्छ — timers र I/O callbacks ले कहिल्यै run हुने मौका पाउँदैनन्", jp: "イベントループが枯渇する — タイマーとI/Oコールバックが実行される機会を得られない" },
            { en: "Node automatically limits it after 1000 calls and moves on", np: "Node ले 1000 calls पछि automatically limit गरी अगाडि बढ्छ", jp: "Nodeは1000回の呼び出し後に自動的に制限して先に進む" },
          ],
          correctIndex: 0,
          explanation: { en: "Node has no built-in limit on nextTick recursion; the queue must fully drain before the loop can advance, so an ever-refilling queue blocks everything else forever.", np: "Node मा nextTick recursion को कुनै built-in limit छैन; loop अगाडि बढ्नु अघि queue पूर्ण drain हुनुपर्छ, त्यसैले सधैं refill हुने queue ले बाँकी सबै सधैंको लागि block गर्छ।", jp: "NodeにはnextTickの再帰に組み込みの制限がない。ループが進む前にキューは完全に消化される必要があるため、常に補充され続けるキューは他のすべてを永遠にブロックする。" },
        },
        {
          question: { en: "Outside of an I/O callback, is the order between `setTimeout(fn, 0)` and `setImmediate()` guaranteed?", np: "I/O callback बाहिर, `setTimeout(fn, 0)` र `setImmediate()` को order guaranteed हुन्छ?", jp: "I/Oコールバックの外では、`setTimeout(fn, 0)`と`setImmediate()`の順序は保証されている？" },
          options: [
            { en: "No — it's non-deterministic outside an I/O context", np: "होइन — I/O context बाहिर यो non-deterministic हुन्छ", jp: "いいえ — I/Oコンテキストの外では非決定的" },
            { en: "Yes — setImmediate always runs first everywhere", np: "हो — setImmediate जहाँसुकै सधैं पहिले run हुन्छ", jp: "はい — setImmediateは常にどこでも先に実行される" },
          ],
          correctIndex: 0,
          explanation: { en: "The guaranteed ordering only applies inside an I/O callback, where the loop is already positioned right before the check phase; at the top level, timing can vary.", np: "Guaranteed ordering केवल I/O callback भित्र लागू हुन्छ, जहाँ loop पहिले नै check phase भन्दा ठीक अगाडि positioned हुन्छ; top level मा timing फरक फरक हुन सक्छ।", jp: "保証された順序はI/Oコールバック内でのみ適用され、そこではループがすでにチェックフェーズの直前に位置している。トップレベルではタイミングが変動し得る。" },
        },
        {
          question: { en: "If a function throws synchronously before it ever calls `setTimeout` to schedule work, will a `.catch()` chained onto its return value catch that error?", np: "एउटा function ले `setTimeout` call गरी काम schedule गर्नु अघि नै synchronously throw गर्यो भने, यसको return value मा chain गरिएको `.catch()` ले त्यो error catch गर्छ?", jp: "関数が`setTimeout`を呼んで処理をスケジュールする前に同期的にthrowした場合、その戻り値に連結された`.catch()`はそのエラーをキャッチする？" },
          options: [
            { en: "No — nothing async was ever created; you must wrap the call in try/catch", np: "होइन — कुनै async कहिल्यै create भएन; call लाई try/catch मा wrap गर्नुपर्छ", jp: "いいえ — 非同期のものは何も作られていない。呼び出しをtry/catchで包む必要がある" },
            { en: "Yes — all errors from a function eventually reach its .catch()", np: "हो — function बाट भएका सबै errors अन्ततः यसको .catch() मा पुग्छन्", jp: "はい — 関数からのすべてのエラーは最終的にその.catch()に到達する" },
          ],
          correctIndex: 0,
          explanation: { en: "A synchronous throw before any Promise is created or returned bypasses async error handling entirely — only a surrounding try/catch around the call site can catch it.", np: "Promise create वा return हुनु अघि भएको synchronous throw ले async error handling लाई पूर्ण bypass गर्छ — call site वरिपरिको try/catch ले मात्र यसलाई catch गर्न सक्छ।", jp: "Promiseが作成・返却される前の同期的なthrowは非同期エラーハンドリングを完全に迂回する。呼び出し元を囲むtry/catchのみがそれをキャッチできる。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "In which phase do setTimeout/setInterval callbacks with expired delays run?", np: "Expire भएको delay भएका setTimeout/setInterval callbacks कुन phase मा run हुन्छन्?", jp: "遅延が過ぎたsetTimeout/setIntervalのコールバックはどのフェーズで実行される？" },
      options: [{ en: "Timers phase", np: "Timers phase", jp: "タイマーフェーズ" }, { en: "Check phase", np: "Check phase", jp: "チェックフェーズ" }],
      correctIndex: 0,
      explanation: { en: "The timers phase runs callbacks whose scheduled delay has already elapsed.", np: "Timers phase ले scheduled delay elapse भइसकेका callbacks run गर्छ।", jp: "タイマーフェーズはスケジュールされた遅延がすでに経過したコールバックを実行する。" },
    },
    {
      question: { en: "Which phase always runs `setImmediate()` callbacks, right after poll finishes?", np: "Poll सकिएपछि तुरुन्तै `setImmediate()` callbacks कुन phase मा सधैं run हुन्छन्?", jp: "ポーリングが終わった直後に`setImmediate()`のコールバックが常に実行されるのはどのフェーズ？" },
      options: [{ en: "The check phase", np: "Check phase", jp: "チェックフェーズ" }, { en: "The pending callbacks phase", np: "Pending callbacks phase", jp: "ペンディングコールバックフェーズ" }],
      correctIndex: 0,
      explanation: { en: "setImmediate() callbacks are specifically run in the check phase, which always follows poll.", np: "setImmediate() callbacks specifically check phase मा run हुन्छन्, जुन सधैं poll पछि आउँछ।", jp: "setImmediate()のコールバックはチェックフェーズで実行され、それは常にポーリングの後に来る。" },
    },
    {
      question: { en: "Does Node drain microtask queues (nextTick, then Promise) only once at loop startup?", np: "Node ले microtask queues (nextTick, त्यसपछि Promise) लाई loop startup मा मात्र एकपल्ट drain गर्छ?", jp: "Nodeはマイクロタスクキュー（nextTick、次にPromise）をループ起動時に一度だけ消化する？" },
      options: [{ en: "No — between every phase transition", np: "होइन — हरेक phase transition बीचमा", jp: "いいえ — すべてのフェーズ遷移の間で" }, { en: "Yes — only once at the very start", np: "हो — केवल सुरुमा एकपल्ट", jp: "はい — 最初に一度だけ" }],
      correctIndex: 0,
      explanation: { en: "Microtask queues are checked and fully drained between every single phase transition, not just once.", np: "Microtask queues हरेक phase transition बीचमा check र पूर्ण drain हुन्छन्, एकपल्ट मात्र होइन।", jp: "マイクロタスクキューはすべてのフェーズ遷移の間でチェックされ完全に消化される。一度だけではない。" },
    },
    {
      question: { en: "Which runs first: `process.nextTick()` or a Promise `.then()` scheduled in the same synchronous block?", np: "एउटै synchronous block मा schedule भएको `process.nextTick()` र Promise `.then()` मध्ये कुन पहिले?", jp: "同じ同期ブロックでスケジュールされた`process.nextTick()`とPromiseの`.then()`のどちらが先？" },
      options: [{ en: "process.nextTick()", np: "process.nextTick()", jp: "process.nextTick()" }, { en: "Promise.then()", np: "Promise.then()", jp: "Promiseの.then()" }],
      correctIndex: 0,
      explanation: { en: "The nextTick queue is fully drained before Node even looks at the Promise microtask queue.", np: "Node ले Promise microtask queue हेर्नु अघि nextTick queue पूर्ण drain गर्छ।", jp: "Promiseマイクロタスクキューを見る前にnextTickキューが完全に消化される。" },
    },
    {
      question: { en: "Inside an I/O callback, which is guaranteed to run first: setImmediate() or setTimeout(fn, 0)?", np: "I/O callback भित्र, setImmediate() वा setTimeout(fn, 0) मध्ये कुन पहिले run हुने guaranteed छ?", jp: "I/Oコールバック内で、setImmediate()とsetTimeout(fn, 0)のどちらが先に実行されると保証されている？" },
      options: [{ en: "setImmediate()", np: "setImmediate()", jp: "setImmediate()" }, { en: "setTimeout(fn, 0)", np: "setTimeout(fn, 0)", jp: "setTimeout(fn, 0)" }],
      correctIndex: 0,
      explanation: { en: "The loop is already sitting right before the check phase after an I/O callback, so setImmediate always wins there.", np: "I/O callback पछि loop पहिले नै check phase भन्दा ठीक अगाडि हुन्छ, त्यसैले त्यहाँ setImmediate सधैं जित्छ।", jp: "I/Oコールバックの後、ループはすでにチェックフェーズの直前にいるため、そこではsetImmediateが常に勝つ。" },
    },
    {
      question: { en: "At the top level of a script (not inside I/O), is setImmediate() vs setTimeout(fn, 0) order guaranteed?", np: "Script को top level मा (I/O भित्र होइन), setImmediate() vs setTimeout(fn, 0) order guaranteed हुन्छ?", jp: "スクリプトのトップレベル（I/O内ではない）で、setImmediate()とsetTimeout(fn, 0)の順序は保証されている？" },
      options: [{ en: "No — it's non-deterministic", np: "होइन — यो non-deterministic हो", jp: "いいえ — 非決定的" }, { en: "Yes — setImmediate always wins", np: "हो — setImmediate सधैं जित्छ", jp: "はい — setImmediateが常に勝つ" }],
      correctIndex: 0,
      explanation: { en: "Without an I/O context anchoring the loop's position, which macrotask fires first can vary based on process startup timing.", np: "Loop को position anchor गर्ने I/O context नभएमा, कुन macrotask पहिले fire हुन्छ process startup timing मा depend गरी फरक हुन सक्छ।", jp: "ループの位置を固定するI/Oコンテキストがない場合、どのマクロタスクが先に発火するかはプロセスの起動タイミングによって変わり得る。" },
    },
    {
      question: { en: "What happens if a process.nextTick() callback recursively schedules another nextTick forever?", np: "process.nextTick() callback ले अर्को nextTick लाई सधैंको लागि recursively schedule गर्यो भने के हुन्छ?", jp: "process.nextTick()のコールバックが再帰的に別のnextTickを永遠にスケジュールし続けるとどうなる？" },
      options: [{ en: "The event loop starves — I/O and timers never run", np: "Event loop starve हुन्छ — I/O र timers कहिल्यै run हुँदैनन्", jp: "イベントループが枯渇する — I/Oとタイマーが実行されない" }, { en: "Node throws a RangeError after a fixed limit", np: "Node ले निश्चित limit पछि RangeError throw गर्छ", jp: "Nodeは一定の制限後にRangeErrorをスローする" }],
      correctIndex: 0,
      explanation: { en: "There's no built-in recursion limit for nextTick; an ever-refilling queue blocks the loop from ever advancing to another phase.", np: "nextTick को लागि कुनै built-in recursion limit छैन; सधैं refill हुने queue ले loop लाई अर्को phase मा जानबाट block गर्छ।", jp: "nextTickには組み込みの再帰制限がない。常に補充され続けるキューはループが別のフェーズに進むことを妨げる。" },
    },
    {
      question: { en: "What should you use instead of process.nextTick() for repeated recursive async work that must still allow I/O to run?", np: "I/O लाई अझै run हुन दिनुपर्ने repeated recursive async work का लागि process.nextTick() को सट्टा के प्रयोग गर्नुपर्छ?", jp: "I/Oを実行させ続ける必要がある繰り返しの再帰的非同期処理には、process.nextTick()の代わりに何を使うべき？" },
      options: [{ en: "setImmediate()", np: "setImmediate()", jp: "setImmediate()" }, { en: "A tighter recursive nextTick loop", np: "अझ tight recursive nextTick loop", jp: "より密な再帰的nextTickループ" }],
      correctIndex: 0,
      explanation: { en: "setImmediate() always yields to the poll phase between calls, so I/O still gets a chance to run.", np: "setImmediate() ले call बीचमा सधैं poll phase लाई yield गर्छ, त्यसैले I/O लाई अझै run हुने मौका मिल्छ।", jp: "setImmediate()は呼び出しの間に常にポーリングフェーズに譲歩するため、I/Oは実行される機会を得られる。" },
    },
    {
      question: { en: "If a function throws synchronously before ever creating a Promise, will a .catch() chained onto its call catch that error?", np: "एउटा function ले Promise create गर्नु अघि नै synchronously throw गर्यो भने, यसको call मा chain गरिएको .catch() ले त्यो error catch गर्छ?", jp: "関数がPromiseを作成する前に同期的にthrowした場合、その呼び出しに連結された.catch()はそのエラーをキャッチする？" },
      options: [{ en: "No — you need a try/catch around the call itself", np: "होइन — call वरिपरि try/catch चाहिन्छ", jp: "いいえ — 呼び出し自体をtry/catchで囲む必要がある" }, { en: "Yes — .catch() always sees every error from the function", np: "हो — .catch() ले function बाट भएका सबै errors सधैं देख्छ", jp: "はい — .catch()は常に関数からのすべてのエラーを見る" }],
      correctIndex: 0,
      explanation: { en: "A synchronous throw before any Promise exists bypasses the async error-handling chain entirely; only a surrounding try/catch catches it.", np: "कुनै Promise exist हुनु अघिको synchronous throw ले async error-handling chain लाई पूर्ण bypass गर्छ; वरिपरिको try/catch ले मात्र यसलाई catch गर्छ।", jp: "Promiseが存在する前の同期的なthrowは非同期エラーハンドリングチェーンを完全に迂回する。それを囲むtry/catchのみがキャッチする。" },
    },
  ],
};
