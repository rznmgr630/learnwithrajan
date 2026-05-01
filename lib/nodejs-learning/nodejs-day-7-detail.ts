import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_7_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Almost everything in Node I/O is **asynchronous**: instead of waiting idle, you schedule **continuations** — first as **callbacks**, then **Promises**, then **`async`/`await`** syntax that reads top-to-bottom like sync code but still yields the thread while waiting.",
      np: "असिंक — callback, Promise, async/await सम्म — थ्रेड खाली राख्छ।",
      jp: "Node の I/O は**非同期が基本**。callback → Promise → async/await とパターンが進化した。",
    },
    {
      en: "Your goal is **predictable error handling**: every Promise rejection must reach a **`catch`** or a **`try/catch`** block, or Node may crash on **unhandled rejection** depending on version and flags.",
      np: "हरेक rejection समात्नुहोस् — unhandled rejection ले crash ल्याउन सक्छ।",
      jp: "**未処理の reject** はプロセスを落とすことがある。すべての Promise は必ず捕捉する。",
    },
  ],
  sections: [
    {
      title: {
        en: "The evolution of async patterns",
        np: "async ढाँचाको विकास",
        jp: "非同期パターンの進化",
      },
      blocks: [
        {
          type: "diagram",
          id: "nodejs-async-evolution",
        },
        {
          type: "code",
          title: {
            en: "Same operation — callback → Promise → async/await",
            np: "एउटै काम — तीन तरिका",
            jp: "同じ操作を 3 通りで書く",
          },
          code: `// ── Callback style ──────────────────────────────────
function getUserCb(id, cb) {
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
    if (err) return cb(err);
    cb(null, rows[0]);
  });
}
getUserCb(42, (err, user) => {
  if (err) console.error(err);
  else console.log(user);
});

// ── Promise style ─────────────────────────────────────
function getUserP(id) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
}
getUserP(42).then(console.log).catch(console.error);

// ── async/await style ─────────────────────────────────
async function getUser(id) {
  const rows = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}
try {
  const user = await getUser(42);
  console.log(user);
} catch (err) {
  console.error(err);
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "All three styles compile to the same event-loop scheduling. **`await`** is syntactic sugar: `const x = await p` desugars to `p.then(x => …)` and `try/catch` becomes `.catch(…)`. The practical advantage of async/await is that error handling is colocated with the call site, and the code reads top-to-bottom.",
            np: "तीनै style event-loop मा उही छन् — await Promise को syntactic sugar हो।",
            jp: "3 つのスタイルは同じイベントループスケジューリング。`await` は Promise の糖衣構文。",
          },
        },
      ],
    },
    {
      title: {
        en: "Sync vs async — why Node feels different",
        np: "सिंक र असिंक",
        jp: "同期と非同期の違い",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Blocking vs yielding the thread",
            np: "ब्लक बनाम असिंक",
            jp: "ブロックと譲る",
          },
          code: `const fs = require('fs');

// BAD in a busy HTTP handler — blocks every waiting request:
// const data = fs.readFileSync('./big.json', 'utf8');

// GOOD — yields the thread; other requests run while this waits:
fs.readFile('./big.json', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('bytes:', data.length);
});`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Synchronous** code runs start-to-finish on the main thread — fine for tiny work, dangerous for disk/network in servers because **everyone waits**. **Asynchronous** APIs return immediately and call you back later (or resolve a Promise). That keeps throughput high but forces you to think in **completion order**, not line order.",
            np: "सिंकले लूप रोक्छ; असिंकले पछि बोलाउँछ — क्रम फरक हुन सक्छ।",
            jp: "**同期**はメインスレッドを占有。**非同期**は完了順がソース順と違う。",
          },
        },
        {
          type: "diagram",
          id: "node-execution-priority",
        },
      ],
    },
    {
      title: {
        en: "Promise utilities — all, allSettled, race",
        np: "Promise utilities — all, allSettled, race",
        jp: "Promise ユーティリティ",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Running independent async tasks concurrently",
            np: "स्वतन्त्र कार्य एकैसाथ",
            jp: "独立タスクを並行実行",
          },
          code: `// Promise.all — fails fast if ANY promise rejects
const [user, orders] = await Promise.all([
  fetchUser(userId),
  fetchOrders(userId),
]);
// wall-clock time ≈ max(fetchUser, fetchOrders) — not their sum

// Promise.allSettled — always waits for all, captures failures too
const results = await Promise.allSettled([
  sendEmail(user),
  sendSMS(user),
  pushNotify(user),
]);
for (const r of results) {
  if (r.status === 'rejected') console.error('Notification failed', r.reason);
}

// Promise.race — first settled wins (useful for timeouts)
const withTimeout = Promise.race([
  fetchExpensiveData(),
  new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
]);`,
        },
        {
          type: "paragraph",
          text: {
            en: "Use **`Promise.all`** when tasks are independent and you need **all results** — it rejects immediately if any promise rejects. Use **`Promise.allSettled`** when you want **all results regardless** of failures (e.g., sending three notifications where partial success is acceptable). Use **`Promise.race`** for timeout patterns or first-response-wins scenarios.",
            np: "`Promise.all` — सबै चाहिन्छ; `allSettled` — केही fail भए पनि जारी; `race` — timeout का लागि।",
            jp: "**all** は全成功が必要なとき。**allSettled** は失敗があっても全結果が欲しいとき。**race** はタイムアウト実装に。",
          },
        },
      ],
    },
    {
      title: {
        en: "Error handling patterns",
        np: "त्रुटि व्यवस्थापन ढाँचा",
        jp: "エラーハンドリングパターン",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Reliable async error handling",
            np: "विश्वसनीय async त्रुटि",
            jp: "信頼できる非同期エラー処理",
          },
          code: `// ── try/catch in async functions ─────────────────────
async function createUser(data) {
  try {
    const user = await User.create(data);
    return user;
  } catch (err) {
    if (err.code === 11000) throw new Error('Email already in use');
    throw err; // rethrow — don't swallow unknown errors
  }
}

// ── .catch() on promise chains ────────────────────────
fetchUser(id)
  .then(user => processUser(user))
  .catch(err => {
    logger.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

// ── Global safety net (log, never swallow) ────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  // In production: alert on-call, then graceful shutdown
  process.exit(1);
});`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Forgetting `await`** — `const user = getUser(id)` gives you a Promise object, not a user. `user.name` will be `undefined`. TypeScript with `strict` mode catches this.",
              np: "`await` बिर्सनु — Promise object मिल्छ, नतिजा होइन।",
              jp: "**`await` を忘れる** — Promise オブジェクトが返る。TypeScript の strict で検出可能。",
            },
            {
              en: "**Catching then re-throwing as `new Error`** — `throw new Error(err.message)` loses the original stack trace. Prefer `throw err` to preserve the full trace for debugging.",
              np: "`new Error` मा re-throw — stack trace गुम्छ। `throw err` नै गर्नुहोस्।",
              jp: "**`new Error` で再スロー** — スタックトレースが消える。`throw err` で元のトレースを保つ。",
            },
            {
              en: "**Mixing callbacks and promises** — wrapping a promise inside a callback API (or vice versa) causes double-error scenarios. Use `util.promisify` to bridge callback APIs cleanly.",
              np: "callback र promise मिसाउनु — `util.promisify` प्रयोग गर्नुहोस्।",
              jp: "**コールバックと Promise を混ぜる** — `util.promisify` で変換してから統一する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Promise.all or sequential await?",
        np: "Promise.all वा क्रम await?",
        jp: "all と順番 await？",
      },
      answer: {
        en: "Use **`Promise.all`** when tasks do not depend on each other's outputs — wall-clock time drops to the slowest task instead of their sum. Use **sequential `await`** when step B needs step A's result, or when ordering must be preserved (e.g., writing records in a specific order to preserve foreign key relationships).",
        np: "स्वतन्त्रमा `all` — परिणाम चाहिएमा क्रम।",
        jp: "独立なら **`Promise.all`**。前の結果が要るなら順番に **`await`**。",
      },
    },
  ],
};
