import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_7_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Almost everything in Node I/O is **asynchronous**: instead of waiting idle, you schedule **continuations**—first as **callbacks**, then **Promises**, then **`async`/`await`** syntax that reads top-to-bottom like sync code but still yields the thread while waiting.",
      np: "असिंक — callback, Promise, async/await सम्म।",
      jp: "Node の I/O は**非同期が基本**。callback → Promise → async/await。",
    },
    {
      en: "Your goal is **predictable error handling**: every Promise rejection must reach a **`catch`** or **`try/catch`**, or Node may crash on **unhandled rejection** depending on version and flags.",
      np: "हरेक अस्वीकृति समात्नुहोस् — अनह्यान्डले क्र्यास ल्याउन सक्छ।",
      jp: "**未処理の reject** はプロセスを落とすことがある。必ず捕捉する。",
    },
  ],
  sections: [
    {
      title: {
        en: "Sync vs async — why Node feels different",
        np: "सिंक र असिंक",
        jp: "同期と非同期",
      },
      blocks: [
        {
          type: "code",
          title: { en: "Blocking vs yielding the thread", np: "ब्लक बनाम असिंक", jp: "ブロックと譲る" },
          code: `const fs = require('fs');

// BAD in a busy HTTP handler — blocks everyone until disk returns:
// const data = fs.readFileSync('./big.json', 'utf8');

// GOOD — other requests run while this waits:
fs.readFile('./big.json', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('bytes', data.length);
});`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Synchronous** code runs start-to-finish on the main thread—fine for tiny work, dangerous for disk/network in servers because **everyone waits**. **Asynchronous** APIs return immediately and call you back later (or resolve a Promise). That keeps throughput high but forces you to think in **completion order**, not line order.",
            np: "सिंकले लूप रोक्छ; असिंकले पछि बोलाउँछ — क्रम फरक हुन सक्छ।",
            jp: "**同期**はメインスレッドを占有。**非同期**は完了順がソース順と違う。",
          },
        },
      ],
    },
    {
      title: { en: "Callbacks, promises & async/await", np: "कलब्याक र Promise", jp: "コールバック・Promise・async/await" },
      blocks: [
        {
          type: "code",
          title: { en: "async/await shape", np: "async उदाहरण", jp: "async の形" },
          code: `async function loadUser(id) {
  try {
    const user = await User.findById(id);
    if (!user) throw new Error('Not found');
    return user;
  } catch (err) {
    // log, map to HTTP status, rethrow as needed
    throw err;
  }
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Callbacks** follow Node’s **`(err, result)`** convention—check **`err` first**. Nested callbacks (“callback hell”) become unreadable; extract **named functions** or convert to Promises. **`util.promisify`** wraps old callback APIs into Promise-returning functions.",
            np: "`(err, result)` — पहिले त्रुटि; नामित फङ्क्शन वा promisify।",
            jp: "**コールバック** — error-first。**ネスト**は関数分割や Promise 化で浅く。",
          },
        },
        {
          type: "diagram",
          id: "node-execution-priority",
        },
        {
          type: "paragraph",
          text: {
            en: "**Promises** chain with **`.then`** / **`.catch`**—always end chains with **`catch`** or use **`async`/`await`** with **`try/catch`**. **`Promise.all`** runs independent tasks concurrently; **`Promise.allSettled`** keeps going when some fail—pick based on whether partial results help.",
            np: "`Promise.all` स्वतन्त्र कार्यका लागि; निर्भर छ भने क्रम await।",
            jp: "**Promise.all** は独立タスクの並列。**依存**があるときは順番 await。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Promise.all or sequential await?",
        np: "Promise.all वा क्रम?",
        jp: "all と順番 await？",
      },
      answer: {
        en: "Use **`Promise.all`** when tasks do not depend on each other’s outputs—wall-clock time drops to the slowest task. Use **sequential `await`** when step B needs step A’s result or ordering must be preserved.",
        np: "स्वतन्त्रमा `all`; परिणाम चाहिएमा क्रम।",
        jp: "独立なら **`Promise.all`**。前の結果が要るなら順番に **`await`**。",
      },
    },
  ],
};
