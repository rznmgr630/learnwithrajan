import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_20_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Performance optimization in JavaScript comes down to doing less work, doing it less often, or doing it on a different thread. Debounce and throttle reduce how often a function runs. Memoization avoids repeating expensive calculations. Web Workers move heavy CPU work off the main thread so the UI stays responsive.",
      np: "JavaScript performance optimization: कम काम गर्नु, कम पटक गर्नु, वा अर्को thread मा गर्नु। Debounce र throttle function run हुने frequency reduce गर्छ। Memoization expensive calculations repeat गर्न रोक्छ। Web Workers ले heavy CPU work main thread बाट सारेर UI responsive राख्छ।",
      jp: "JavaScriptのパフォーマンス最適化: より少なく・より少ない頻度で・別スレッドで実行する。デバウンスとスロットルは実行頻度を下げる。メモ化は高コストな計算の繰り返しを避ける。Web Workersは重いCPU処理をメインスレッドから分離してUIを応答可能に保つ。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "cjIswDCKgu0", title: "Debounce vs Throttle — JavaScript Interview Questions" },
      ],
    },
    {
      title: { en: "Debounce", np: "Debounce", jp: "デバウンス" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Debounce delays execution until there has been a quiet period — a gap with no new calls. If a new call arrives before the timer fires, the timer resets. The function only runs after the user **stops** triggering it. Use debounce for events where only the final value matters: search-as-you-type, window resize, saving draft text.",
            np: "Debounce ले execution delay गर्छ जबसम्म quiet period हुँदैन — नयाँ calls नआएसम्म। Timer fire हुनु अगाडि नयाँ call आयो भने timer reset हुन्छ। User **रोकेपछि** मात्र function run हुन्छ। Search-as-you-type, window resize, draft save का लागि।",
            jp: "デバウンスは一定の静止期間が経過するまで実行を遅らせる。新しい呼び出しが来るとタイマーリセット。ユーザーが**止めた後**に一度だけ実行。検索入力・リサイズ・下書き保存に使う。",
          },
        },
        {
          type: "code",
          title: { en: "Debounce implementation and usage", np: "Debounce implementation र usage", jp: "デバウンスの実装と使用例" },
          code: `// ── debounce implementation ────────────────────────────────────────
function debounce(fn, delayMs) {
  let timerId;

  return function (...args) {
    clearTimeout(timerId);   // cancel any pending call
    timerId = setTimeout(() => {
      fn.apply(this, args);  // call the original function after the quiet period
    }, delayMs);
  };
}

// ── Usage: search input that only fires when typing stops ──────────
const searchInput = document.querySelector("#search");

const debouncedSearch = debounce(async (query) => {
  if (!query.trim()) return;
  const results = await fetchSearchResults(query);
  renderResults(results);
}, 300);  // wait 300ms after the last keystroke

searchInput.addEventListener("input", (e) => debouncedSearch(e.target.value));
// User types "java" quickly → only ONE request, after they stop typing

// ── With leading edge — run immediately, then ignore for delay ─────
function debounceLeading(fn, delayMs) {
  let timerId;
  let lastArgs;

  return function (...args) {
    lastArgs = args;
    if (!timerId) {
      fn.apply(this, args);  // execute immediately on first call
    }
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
    }, delayMs);
  };
}

// ── Built-in alternatives ─────────────────────────────────────────
// lodash debounce (battle-tested, more options):
// import { debounce } from "lodash";
// const debouncedFn = debounce(fn, 300, { leading: true, trailing: false });`,
        },
      ],
    },
    {
      title: { en: "Throttle", np: "Throttle", jp: "スロットル" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Throttle guarantees a function runs at most once per time window — no matter how many times it is called. Unlike debounce (which waits for quiet), throttle fires immediately on the first call and then ignores calls until the window resets. Use throttle for continuous events where you need periodic updates: scroll position tracking, mouse move, real-time analytics.",
            np: "Throttle ले guarantee गर्छ कि function time window मा maximum एक पटक run हुन्छ। Debounce (quiet को लागि wait) भन्दा फरक — throttle पहिलो call मा तुरन्त fire हुन्छ र window reset नभइकन calls ignore गर्छ। Scroll, mouse move, real-time analytics का लागि।",
            jp: "スロットルは時間ウィンドウ内に関数が最大一度しか実行されないことを保証する。デバウンス（静止を待つ）と異なり、最初の呼び出しで即座に実行し、ウィンドウがリセットするまで無視する。スクロール・マウス移動・リアルタイム分析に使う。",
          },
        },
        {
          type: "code",
          title: { en: "Throttle implementation and the key difference from debounce", np: "Throttle vs debounce — key difference", jp: "スロットルの実装とデバウンスとの違い" },
          code: `// ── throttle implementation ────────────────────────────────────────
function throttle(fn, intervalMs) {
  let lastCallTime = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastCallTime >= intervalMs) {
      lastCallTime = now;
      return fn.apply(this, args);
    }
    // Otherwise ignore this call — too soon
  };
}

// ── Usage: throttled scroll handler ───────────────────────────────
const throttledOnScroll = throttle(() => {
  const scrolled = window.scrollY;
  updateProgressBar(scrolled);
  loadMoreIfNearBottom(scrolled);
}, 100);  // run at most every 100ms

window.addEventListener("scroll", throttledOnScroll);
// Even if scroll fires 60× per second, updateProgressBar runs max 10× per second

// ── Debounce vs throttle — the mental model ────────────────────────
// Imagine a user scrolling for 5 seconds:

// Debounce (300ms): runs ONCE — 300ms after they STOP scrolling
// Throttle (300ms): runs ~17× — once every 300ms WHILE they scroll

// ── When to use which ─────────────────────────────────────────────
//
// DEBOUNCE — wait for the user to finish:
//   ✓ Search input (only fetch when they stop typing)
//   ✓ Form auto-save (save after they pause editing)
//   ✓ Window resize (recalculate layout after resize ends)
//   ✓ Button that should not be double-clicked
//
// THROTTLE — allow periodic updates during continuous action:
//   ✓ Scroll event (update sticky header, progress bar, infinite scroll)
//   ✓ Mouse move (drag and drop, cursor tracking)
//   ✓ Real-time analytics (sample events, not every mousemove)
//   ✓ Rate-limiting API calls (max N per second)`,
        },
      ],
    },
    {
      title: { en: "Memoization", np: "Memoization", jp: "メモ化" },
      blocks: [
        {
          type: "code",
          title: { en: "Cache function results for the same inputs", np: "Same inputs का लागि function results cache गर्नु", jp: "同じ入力に対する関数結果をキャッシュ" },
          code: `// ── Simple memoization for pure functions ─────────────────────────
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);  // serialize args as cache key

    if (cache.has(key)) {
      return cache.get(key);           // return cached result
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// ── Classic example: Fibonacci ─────────────────────────────────────
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

fibonacci(40);  // ~1 billion operations — SLOW

const memoFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return memoFib(n - 1) + memoFib(n - 2);
});

memoFib(40);  // each value computed once, then cached — FAST

// ── Real-world use: expensive calculations ─────────────────────────
const parseMarkdown = memoize((text) => {
  // Parsing markdown is expensive — cache the result
  return heavyMarkdownParser(text);
});

// React's useMemo and useCallback are memoization:
// useMemo(() => expensiveCalc(a, b), [a, b])  — recalculates only when a or b changes
// useCallback(fn, [deps])  — returns the same function reference until deps change

// ── Memoization with WeakMap (for object arguments, GC-friendly) ───
function memoizeByObject(fn) {
  const cache = new WeakMap();
  return function (obj) {
    if (cache.has(obj)) return cache.get(obj);
    const result = fn(obj);
    cache.set(obj, result);
    return result;
  };
}`,
        },
      ],
    },
    {
      title: { en: "Web Workers — off the main thread", np: "Web Workers — main thread बाट बाहिर", jp: "Web Workers — メインスレッドから外へ" },
      blocks: [
        {
          type: "code",
          title: { en: "Moving heavy CPU work to a background thread", np: "Heavy CPU work background thread मा सार्नु", jp: "重いCPU処理をバックグラウンドスレッドへ" },
          code: `// ── The problem: blocking the main thread ─────────────────────────
// Heavy computation freezes the UI — clicks are not responded to
function sortMillion() {
  const arr = Array.from({ length: 1_000_000 }, () => Math.random());
  arr.sort((a, b) => a - b);  // takes ~500ms — UI is unresponsive!
  return arr;
}

// ── Solution: Web Worker runs on a separate thread ─────────────────

// worker.js — runs in a background thread
self.addEventListener("message", (event) => {
  const { data, type } = event.data;

  if (type === "sort") {
    const sorted = data.sort((a, b) => a - b);  // does NOT block the UI thread
    self.postMessage({ type: "sortResult", result: sorted });
  }
});

// main.js — UI thread
const worker = new Worker("/worker.js");

// Send data to the worker
worker.postMessage({
  type: "sort",
  data: Array.from({ length: 1_000_000 }, () => Math.random()),
});

// Receive result asynchronously — UI stays responsive while worker runs
worker.onmessage = (event) => {
  if (event.data.type === "sortResult") {
    console.log("Sorted!", event.data.result.length);
  }
};

worker.onerror = (err) => console.error("Worker error:", err);

// Terminate the worker when done:
worker.terminate();

// ── Transferable objects — zero-copy large data ────────────────────
// Transferring a large ArrayBuffer copies it by default (expensive for huge data).
// Use transfer to move ownership (zero-copy):
const buffer = new ArrayBuffer(1024 * 1024 * 100);  // 100MB
worker.postMessage({ buffer }, [buffer]);  // transfer, not copy — buffer is now "neutered"

// ── Inline worker using a Blob URL ────────────────────────────────
const workerCode = \`
  self.onmessage = ({ data }) => {
    const result = data.reduce((a, b) => a + b, 0);
    self.postMessage(result);
  };
\`;
const blob   = new Blob([workerCode], { type: "application/javascript" });
const url    = URL.createObjectURL(blob);
const worker = new Worker(url);`,
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What is the difference between debounce and throttle?", np: "Debounce र throttle मा के फरक?", jp: "デバウンスとスロットルの違いは？" },
      answer: {
        en: "Debounce fires ONCE after a quiet period — the function runs only when the user stops triggering it. If new calls keep coming, the timer keeps resetting. Throttle fires at a REGULAR INTERVAL regardless of how many calls come in — it executes immediately on the first call, then once per interval window. Rule of thumb: use debounce when you only care about the final value (search input, auto-save). Use throttle when you need periodic updates during continuous activity (scroll handler, drag position).",
        np: "Debounce quiet period पछि एक पटक fire हुन्छ — user stop गरेपछि। New calls आउँदै रह्यो भने timer reset हुँदै रहन्छ। Throttle REGULAR INTERVAL मा fire हुन्छ — पहिलो call मा तुरन्त, त्यसपछि हर interval मा एक पटक। Search/save = debounce। Scroll/drag = throttle।",
        jp: "デバウンスは静止後に一度だけ実行。新しい呼び出しが来るとタイマーリセット。スロットルは一定間隔で実行 — 最初の呼び出しで即座に、以降は一定間隔で一度ずつ。検索/自動保存=デバウンス。スクロール/ドラッグ=スロットル。",
      },
    },
    {
      question: { en: "Can Web Workers access the DOM?", np: "Web Workers ले DOM access गर्न सक्छन्?", jp: "Web WorkersはDOMにアクセスできるか？" },
      answer: {
        en: "No. Web Workers run in a completely separate context — they have no access to `document`, `window`, `localStorage`, or any DOM API. They can only communicate with the main thread via `postMessage()` and `onmessage`. This is intentional: if workers could modify the DOM concurrently, you would need to synchronize DOM access across threads, which would be extremely complex. Workers are for pure computation — number crunching, sorting, parsing, image processing.",
        np: "होइन। Web Workers पूरै separate context मा run हुन्छन् — `document`, `window`, `localStorage`, वा कुनै DOM API access छैन। `postMessage()` र `onmessage` मार्फत मात्र communicate गर्न सक्छन्। Workers pure computation का लागि — number crunching, sorting, parsing, image processing।",
        jp: "いいえ。Web Workersは完全に独立したコンテキストで実行 — `document`・`window`・DOM APIへのアクセスなし。`postMessage()`と`onmessage`でのみメインスレッドと通信できる。Workersは純粋な計算用 — 数値計算・ソート・パース・画像処理。",
      },
    },
    {
      question: { en: "When should I use memoization?", np: "Memoization कहिले use गर्ने?", jp: "メモ化はいつ使うべきか？" },
      answer: {
        en: "Memoize when: (1) the function is pure — same inputs always produce the same output, with no side effects; (2) the function is called repeatedly with the same arguments; (3) the function is genuinely expensive — heavy computation, parsing, transformation. Do NOT memoize: functions that read from external state (current time, random numbers), functions that have side effects, or cheap functions — the cache lookup overhead is not worth it for trivial operations.",
        np: "Memoize गर्नुहोस् जब: (1) function pure छ — same inputs = same output, side effects छैन; (2) function repeatedly same arguments सँग call हुन्छ; (3) function genuinely expensive छ। Memoize नगर्नुहोस्: external state read गर्ने functions, side effects भएका, वा cheap functions।",
        jp: "メモ化する場合: (1)関数が純粋 — 同入力=同出力、副作用なし; (2)同じ引数で繰り返し呼ばれる; (3)本当にコストが高い。メモ化しない: 外部状態を読む関数（現在時刻・乱数）・副作用のある関数・軽い処理（キャッシュの手数料が割に合わない）。",
      },
    },
  ],
};
