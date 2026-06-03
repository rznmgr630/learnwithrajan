import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_7_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "In Node.js, almost every file, network, or database operation is **asynchronous** — meaning your code doesn't sit and wait. Instead, it schedules work to happen later. Over time, the pattern evolved from **callbacks** to **Promises** to **`async`/`await`**, which lets you write async code that reads like normal top-to-bottom code.",
      np: "असिंक — callback, Promise, async/await सम्म — थ्रेड खाली राख्छ।",
      jp: "Node の I/O は**非同期が基本**。callback → Promise → async/await とパターンが進化した。",
    },
    {
      en: "The most important habit with async code is handling errors every single time. Every Promise that can fail needs a **`catch`** or a **`try/catch`** block. If you miss one, Node can crash with an **unhandled rejection** error.",
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
          type: "youtube",
          videoId: "DHvZLI7Db8E",
          title: "JavaScript Promises in 10 Minutes",
        },
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
            en: "All three patterns do the same thing under the hood — they all use the event loop. **`await`** is just a shortcut for writing `.then()`. The big win with async/await is that your error handling sits right next to the code that caused it, and you read everything top to bottom like normal code.",
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
            en: "**Synchronous** code runs line by line and blocks everything else — fine for a quick script, but terrible in a server where many requests might be waiting. **Asynchronous** APIs return right away and notify you when the work is done. This keeps your server fast, but the code no longer completes in the order you wrote it.",
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
          type: "youtube",
          videoId: "DHvZLI7Db8E",
          title: "Promise.all, allSettled, race Explained",
        },
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
            en: "Use **`Promise.all`** when you're running multiple independent tasks and need all of them to succeed — if any one fails, the whole thing stops. Use **`Promise.allSettled`** when you want to know what happened to every task even if some failed, like sending notifications to multiple channels. Use **`Promise.race`** when you want the result of whichever task finishes first — great for timeouts.",
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
              en: "**Forgetting `await`** — if you write `const user = getUser(id)` without `await`, you get a Promise back, not the actual user. So `user.name` will be `undefined`. TypeScript's strict mode will catch this for you.",
              np: "`await` बिर्सनु — Promise object मिल्छ, नतिजा होइन।",
              jp: "**`await` を忘れる** — Promise オブジェクトが返る。TypeScript の strict で検出可能。",
            },
            {
              en: "**Don't re-wrap errors** — if you catch an error and throw `new Error(err.message)`, you lose the original stack trace, which makes debugging much harder. Just use `throw err` to pass the error along as-is.",
              np: "`new Error` मा re-throw — stack trace गुम्छ। `throw err` नै गर्नुहोस्।",
              jp: "**`new Error` で再スロー** — スタックトレースが消える。`throw err` で元のトレースを保つ。",
            },
            {
              en: "**Don't mix callbacks and Promises** — combining the two styles in the same function leads to tricky bugs where errors get reported twice or not at all. Use `util.promisify` to convert callback-based APIs into Promises so everything stays consistent.",
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
        en: "Use **`Promise.all`** when your tasks are independent — they run at the same time, so you only wait as long as the slowest one. Use sequential **`await`** when the second step needs the result of the first, or when order matters — like inserting records that reference each other.",
        np: "स्वतन्त्रमा `all` — परिणाम चाहिएमा क्रम।",
        jp: "独立なら **`Promise.all`**。前の結果が要るなら順番に **`await`**。",
      },
    },
  ],
};
