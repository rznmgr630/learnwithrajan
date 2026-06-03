import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_17_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Once you know the basics of Promises and async/await, real production code demands more: retrying a failed request, timing out a slow one, limiting how many run at once, and deduplicating identical in-flight requests. These patterns come up constantly in any serious frontend or Node.js codebase.",
      np: "Promises र async/await basics सिकेपछि, production code मा अरू चाहिन्छ: failed request retry गर्नु, slow request timeout गर्नु, एकैसाथ कति run हुन्छ limit गर्नु, र identical in-flight requests deduplicate गर्नु। यी patterns serious frontend वा Node.js codebase मा बारम्बार आउँछन्।",
      jp: "PromiseとAsync/Awaitの基礎の後、本番コードではさらに必要: 失敗したリクエストのリトライ・遅いリクエストのタイムアウト・同時実行数の制限・重複リクエストの排除。これらのパターンは本格的なコードで常に登場する。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "QO4NXhWo_NM", title: "Advanced Promise Patterns" },
      ],
    },
    {
      title: { en: "Retry with exponential backoff", np: "Retry with exponential backoff", jp: "指数バックオフによるリトライ" },
      blocks: [
        {
          type: "code",
          title: { en: "Automatically retry a failing async operation", np: "Failing async operation automatically retry गर्नु", jp: "失敗した非同期操作の自動リトライ" },
          code: `// ── Simple retry ──────────────────────────────────────────────────
async function retry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;  // rethrow on last attempt
      console.log(\`Attempt \${attempt} failed. Retrying...\`);
    }
  }
}

const data = await retry(() => fetch("/api/flaky").then(r => r.json()));

// ── Retry with exponential backoff and jitter ──────────────────────
// Backoff: wait longer between each retry (1s, 2s, 4s, 8s...)
// Jitter: add randomness to avoid all clients retrying at the same time
async function retryWithBackoff(fn, {
  maxAttempts = 3,
  baseDelayMs  = 1000,
  maxDelayMs   = 30_000,
  shouldRetry  = (err) => true,  // retry all errors by default
} = {}) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts || !shouldRetry(err)) throw err;

      // Exponential backoff: 1s, 2s, 4s, 8s... capped at maxDelayMs
      const exponential = baseDelayMs * (2 ** (attempt - 1));
      const jitter      = Math.random() * 1000;  // 0-1000ms random
      const delay       = Math.min(exponential + jitter, maxDelayMs);

      console.log(\`Attempt \${attempt} failed. Retrying in \${Math.round(delay)}ms\`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage — only retry transient errors, not 4xx client errors
await retryWithBackoff(
  () => fetch("/api/data").then(res => {
    if (!res.ok && res.status < 500) throw Object.assign(new Error(), { status: res.status });
    if (!res.ok) throw new Error("Server error");
    return res.json();
  }),
  {
    maxAttempts: 4,
    shouldRetry: (err) => !err.status || err.status >= 500,  // don't retry 4xx
  }
);`,
        },
      ],
    },
    {
      title: { en: "Timeout and race patterns", np: "Timeout र race patterns", jp: "タイムアウトとraceパターン" },
      blocks: [
        {
          type: "code",
          title: { en: "Giving async operations a deadline", np: "Async operations लाई deadline दिनु", jp: "非同期操作に期限を設ける" },
          code: `// ── Promise-based timeout ─────────────────────────────────────────
function timeout(ms, message = \`Timed out after \${ms}ms\`) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(message)), ms)
  );
}

// Race the operation against a timer — first one wins
async function withTimeout(promise, ms) {
  return Promise.race([promise, timeout(ms)]);
}

const user = await withTimeout(fetchUser(id), 5000);

// ── Timeout with AbortController (preferred for fetch) ─────────────
async function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.json();
  } finally {
    clearTimeout(timer);  // always clean up the timer
  }
}

// ── Circuit breaker — stop hammering a failing service ─────────────
class CircuitBreaker {
  #failureCount = 0;
  #state = "closed";  // closed=normal, open=blocking, half-open=testing
  #nextAttempt = 0;

  constructor(private fn, private threshold = 3, private cooldownMs = 30_000) {}

  async call(...args) {
    if (this.#state === "open") {
      if (Date.now() < this.#nextAttempt) {
        throw new Error("Circuit is open — service unavailable");
      }
      this.#state = "half-open";
    }

    try {
      const result = await this.fn(...args);
      this.#failureCount = 0;
      this.#state = "closed";
      return result;
    } catch (err) {
      this.#failureCount++;
      if (this.#failureCount >= this.threshold) {
        this.#state = "open";
        this.#nextAttempt = Date.now() + this.cooldownMs;
        console.warn("Circuit opened — too many failures");
      }
      throw err;
    }
  }
}

const breaker = new CircuitBreaker(fetchUser, 3, 10_000);
// After 3 failures, all calls immediately throw for 10s`,
        },
      ],
    },
    {
      title: { en: "Concurrency limiting", np: "Concurrency limiting", jp: "同時実行数の制限" },
      blocks: [
        {
          type: "code",
          title: { en: "Run at most N async tasks at once", np: "एकैसाथ maximum N async tasks run गर्नु", jp: "最大N個の非同期タスクを同時実行" },
          code: `// ── Problem: running too many promises at once ────────────────────
const urls = Array.from({ length: 1000 }, (_, i) => \`/api/item/\${i}\`);

// ❌ Fires 1000 requests simultaneously — may overwhelm the server or hit rate limits
const results = await Promise.all(urls.map(fetch));

// ── Simple concurrency limiter ─────────────────────────────────────
async function runWithConcurrency(items, fn, limit) {
  const results = [];
  const executing = new Set();

  for (const [index, item] of items.entries()) {
    const promise = fn(item, index).then(result => {
      results[index] = result;
      executing.delete(promise);
    });

    executing.add(promise);

    // When we hit the limit, wait for one to finish before starting the next
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  // Wait for all remaining tasks to finish
  await Promise.all(executing);
  return results;
}

// Usage — process 1000 URLs but only 5 at a time
const data = await runWithConcurrency(urls, url => fetch(url).then(r => r.json()), 5);

// ── Request deduplication — don't make the same request twice ──────
const inFlight = new Map();

async function deduplicatedFetch(url) {
  if (inFlight.has(url)) {
    return inFlight.get(url);  // return the same Promise to all callers
  }

  const promise = fetch(url)
    .then(res => res.json())
    .finally(() => inFlight.delete(url));  // remove from map when done

  inFlight.set(url, promise);
  return promise;
}

// If five components all call deduplicatedFetch("/api/user/1") at the same time,
// only ONE network request is made — all five share the same Promise`,
        },
      ],
    },
    {
      title: { en: "Memoizing async functions", np: "Async functions memoize गर्नु", jp: "非同期関数のメモ化" },
      blocks: [
        {
          type: "code",
          title: { en: "Cache the result of expensive async calls", np: "Expensive async calls को result cache गर्नु", jp: "コストの高い非同期呼び出しの結果をキャッシュ" },
          code: `// ── Simple async memoization ─────────────────────────────────────
function memoizeAsync(fn, ttlMs = Infinity) {
  const cache = new Map();

  return async function (...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached) {
      if (Date.now() < cached.expiresAt) return cached.value;
      cache.delete(key);
    }

    const value = await fn(...args);
    cache.set(key, {
      value,
      expiresAt: ttlMs === Infinity ? Infinity : Date.now() + ttlMs,
    });
    return value;
  };
}

// Cache user fetches for 5 minutes
const cachedFetchUser = memoizeAsync(
  (id) => fetch(\`/api/users/\${id}\`).then(r => r.json()),
  5 * 60_000
);

await cachedFetchUser(1);  // network request
await cachedFetchUser(1);  // served from cache
await cachedFetchUser(2);  // network request (different arg)`,
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "When should I retry a request and when should I not?", np: "Request retry कहिले गर्ने र कहिले नगर्ने?", jp: "リクエストをリトライすべき場合とそうでない場合は？" },
      answer: {
        en: "Retry on transient failures: network timeouts, 503 Service Unavailable, 429 Too Many Requests (after the Retry-After delay), 500-range server errors that might be temporary. Do NOT retry on client errors: 400 Bad Request (your input is wrong), 401 Unauthorized (re-authenticate instead), 403 Forbidden (access denied — retrying won't help), 404 Not Found (the resource doesn't exist). Never retry non-idempotent operations (like POST to create a resource) without an idempotency key — you could create duplicates.",
        np: "Retry गर्नुहोस्: network timeouts, 503, 429 (Retry-After पछि), 500-range temporary errors। Retry नगर्नुहोस्: 400 (input गलत), 401 (re-authenticate), 403 (access denied), 404 (resource छैन)। Idempotency key बिना non-idempotent operations (POST create) retry नगर्नुहोस् — duplicates बन्न सक्छ।",
        jp: "リトライすべき: ネットワークタイムアウト・503・429（Retry-After後）・一時的な500系エラー。リトライしない: 400（入力ミス）・401（再認証）・403（アクセス拒否）・404（リソースなし）。冪等性キーなしのPOSTはリトライ禁止 — 重複作成の危険がある。",
      },
    },
    {
      question: { en: "What is the difference between debouncing and concurrency limiting?", np: "Debouncing र concurrency limiting मा के फरक?", jp: "デバウンスと同時実行制限の違いは？" },
      answer: {
        en: "Debouncing reduces how often a function is called by waiting for a quiet period — multiple rapid calls collapse into one. Concurrency limiting controls how many async operations run simultaneously — all calls eventually happen, but no more than N at a time. Use debouncing for user input (search-as-you-type). Use concurrency limiting for batch processing (fetch 1000 items but only 5 at a time).",
        np: "Debouncing ले function call हुने frequency reduce गर्छ — multiple rapid calls एउटामा collapse हुन्छ। Concurrency limiting ले एकैसाथ कति async operations run हुन्छन् control गर्छ। User input (search) को लागि debouncing। Batch processing (1000 items, 5 at a time) को लागि concurrency limiting।",
        jp: "デバウンスは呼び出し頻度を削減する — 高速な複数呼び出しを一つに集約。同時実行制限は並列実行数を制御する — 全て最終的に実行されるがN個ずつ。デバウンスはユーザー入力（検索）に。同時実行制限はバッチ処理（1000アイテムを5個ずつ）に。",
      },
    },
  ],
};
