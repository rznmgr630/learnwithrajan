import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_12_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "`async`/`await` is syntactic sugar over Promises. It lets you write asynchronous code that reads like synchronous code — top to bottom, no `.then()` chains. Under the hood it is exactly the same as Promises, so understanding Promises first (Day 11) makes `async`/`await` immediately clear.",
      np: "`async`/`await` Promises माथि syntactic sugar हो। यसले async code लाई sync जस्तो top-to-bottom लेख्न दिन्छ — `.then()` chain बिना। भित्री रूपमा Promises जस्तै हो।",
      jp: "`async`/`await`はPromiseの糖衣構文。非同期コードを同期的に見えるよう上から下へ書ける。内部はPromiseと全く同じなので、Day 11の理解があれば即座に理解できる。",
    },
    {
      en: "The Promise utility methods — `Promise.all`, `Promise.allSettled`, `Promise.race`, `Promise.any` — give you fine-grained control over running multiple async operations at once. Choosing the right one prevents both unnecessary waiting and unexpected failures.",
      np: "Promise utility methods — `Promise.all`, `allSettled`, `race`, `any` — ले multiple async operations एकैसाथ run गर्दा fine-grained control दिन्छ।",
      jp: "Promise.all・allSettled・race・anyは複数の非同期操作を同時に実行する際の詳細な制御手段。適切なものを選ぶことで不要な待機と予期しない失敗を防げる。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "V_Kr9OSfDeU", title: "Async Await in JavaScript" },
      ],
    },
    {
      title: { en: "async / await basics", np: "async / await basics", jp: "async/awaitの基本" },
      blocks: [
        {
          type: "code",
          title: { en: "Rewriting Promises with async/await", np: "Promises async/await सँग rewrite गर्नु", jp: "PromiseをAsync/Awaitで書き直す" },
          code: `// ── Same operation: Promise chain vs async/await ─────────────────
// Promise chain:
function getUserData(id) {
  return fetchUser(id)
    .then(user => fetchOrders(user.id))
    .then(orders => ({ user, orders }))
    .catch(err => console.error(err));
}

// async/await — same logic, reads top to bottom:
async function getUserData(id) {
  try {
    const user   = await fetchUser(id);      // pause until fetchUser resolves
    const orders = await fetchOrders(user.id); // pause until fetchOrders resolves
    return { user, orders };                 // return value is auto-wrapped in a Promise
  } catch (err) {
    console.error(err);
  }
}

// ── async functions ALWAYS return a Promise ───────────────────────
async function greet() {
  return "Hello";  // implicitly returns Promise.resolve("Hello")
}

greet().then(msg => console.log(msg));  // "Hello"
// or
const msg = await greet();  // "Hello"

// ── await pauses the CURRENT function, not the whole thread ───────
async function run() {
  console.log("start");
  const result = await someAsyncTask();  // pauses run() while task runs
  console.log("after await:", result);   // resumes when task settles
  console.log("end");
}
// Code outside run() continues to execute while it is paused

// ── Error handling with try/catch ─────────────────────────────────
async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    // Network errors and HTTP errors both end up here
    console.error("Fetch failed:", err.message);
    throw err;  // rethrow so the caller can also handle it
  }
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`async` makes a function return a Promise** — even if it returns a plain value. You cannot use `await` outside an `async` function (except at the top level of an ES module).",
              np: "**`async` ले function लाई Promise return गराउँछ** — plain value return गरे पनि। `async` function बाहिर `await` use गर्न मिल्दैन (ES module top-level बाहेक)।",
              jp: "**`async`は関数をPromiseを返すようにする** — 普通の値を返しても。`async`関数の外では`await`は使えない（ESモジュールのトップレベルを除く）。",
            },
            {
              en: "**`await` only pauses the current `async` function** — other code can run while it waits. It is not blocking the JavaScript engine.",
              np: "**`await` ले current `async` function मात्र pause गर्छ** — अर्को code चलिरहन्छ। JavaScript engine block हुँदैन।",
              jp: "**`await`は現在の`async`関数のみを一時停止** — 他のコードは実行し続ける。JavaScriptエンジンをブロックしない。",
            },
            {
              en: "**Forgetting `await`** gives you a Promise object instead of the resolved value — `console.log(fetchUser(1))` prints `Promise { <pending> }`, not the user.",
              np: "**`await` भुल्नु** ले resolved value को सट्टा Promise object दिन्छ — `console.log(fetchUser(1))` ले `Promise { <pending> }` print गर्छ, user होइन।",
              jp: "**`await`を忘れる**と解決値の代わりにPromiseオブジェクトが得られる。`console.log(fetchUser(1))`は`Promise { <pending> }`を表示する。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Promise utility methods", np: "Promise utility methods", jp: "Promiseユーティリティメソッド" },
      blocks: [
        {
          type: "code",
          title: { en: "Promise.all, allSettled, race, any — when to use each", np: "Promise utilities — कहिले कुन?", jp: "Promiseユーティリティの使い分け" },
          code: `// ── Promise.all — run tasks in parallel, fail fast ────────────────
// All Promises run at the same time.
// Resolves when ALL settle with success.
// Rejects immediately if ANY one rejects.
const [user, posts, comments] = await Promise.all([
  fetchUser(1),
  fetchPosts(1),
  fetchComments(1),
]);
// wall-clock time ≈ max(fetchUser, fetchPosts, fetchComments)
// If fetchPosts rejects, the whole Promise.all rejects (fetchUser result is lost)

// ── Promise.allSettled — always wait for all, capture failures ─────
// Never rejects — waits for every Promise to settle.
// Returns an array of result objects: { status, value } or { status, reason }
const results = await Promise.allSettled([
  sendEmailTo("alice@example.com"),
  sendEmailTo("bob@invalid"),  // will fail
  sendEmailTo("carol@example.com"),
]);

for (const result of results) {
  if (result.status === "fulfilled") {
    console.log("Sent:", result.value);
  } else {
    console.error("Failed:", result.reason.message);
  }
}
// Use when partial success is acceptable (sending notifications, bulk operations)

// ── Promise.race — first settled wins ─────────────────────────────
// Resolves OR rejects as soon as ANY one Promise settles.
// Classic use: add a timeout to an operation
const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(\`Timed out after \${ms}ms\`)), ms)
    ),
  ]);

const user = await withTimeout(fetchUser(1), 5000);

// ── Promise.any — first SUCCESS wins ──────────────────────────────
// Resolves as soon as ANY one Promise fulfills.
// Only rejects if ALL Promises reject (AggregateError).
// Use for: trying multiple sources, first response wins
const data = await Promise.any([
  fetchFromCDN1(url),
  fetchFromCDN2(url),
  fetchFromOrigin(url),
]);
// Whichever CDN responds first, that is the result. Others are ignored.`,
        },
        {
          type: "table",
          caption: { en: "Choosing the right Promise utility", np: "सही Promise utility छान्नु", jp: "適切なPromiseユーティリティの選択" },
          headers: [
            { en: "Method", np: "Method", jp: "メソッド" },
            { en: "Resolves when", np: "कहिले resolve?", jp: "いつresolveするか" },
            { en: "Rejects when", np: "कहिले reject?", jp: "いつrejectするか" },
            { en: "Use for", np: "कसका लागि", jp: "用途" },
          ],
          rows: [
            [
              { en: "Promise.all", np: "Promise.all", jp: "Promise.all" },
              { en: "ALL fulfill", np: "सबै fulfill", jp: "全て成功" },
              { en: "ANY rejects", np: "कोई reject", jp: "どれか失敗" },
              { en: "Independent tasks where all results are needed", np: "सबै results चाहिए", jp: "全結果が必要な独立タスク" },
            ],
            [
              { en: "Promise.allSettled", np: "Promise.allSettled", jp: "Promise.allSettled" },
              { en: "ALL settle (either way)", np: "सबै settle", jp: "全て確定（成否問わず）" },
              { en: "Never rejects", np: "कहिल्यै reject गर्दैन", jp: "rejectしない" },
              { en: "Bulk ops where partial success is OK", np: "Partial success OK", jp: "部分的成功が許容されるバルク操作" },
            ],
            [
              { en: "Promise.race", np: "Promise.race", jp: "Promise.race" },
              { en: "First one fulfills", np: "पहिलो fulfill", jp: "最初のfulfill" },
              { en: "First one rejects", np: "पहिलो reject", jp: "最初のreject" },
              { en: "Timeouts, first-response-wins", np: "Timeout, पहिलो response", jp: "タイムアウト・最速レスポンス" },
            ],
            [
              { en: "Promise.any", np: "Promise.any", jp: "Promise.any" },
              { en: "First one fulfills", np: "पहिलो fulfill", jp: "最初のfulfill" },
              { en: "ALL reject", np: "सबै reject", jp: "全て失敗" },
              { en: "Multiple fallbacks, fastest success wins", np: "Fallbacks, fastest success", jp: "複数フォールバック・最速成功" },
            ],
          ],
        },
      ],
    },
    {
      title: { en: "Parallel vs sequential execution", np: "Parallel vs sequential execution", jp: "並列実行と逐次実行" },
      blocks: [
        {
          type: "code",
          title: { en: "await in a loop — a very common performance mistake", np: "Loop मा await — common performance mistake", jp: "ループ内のawait — よくあるパフォーマンスミス" },
          code: `const userIds = [1, 2, 3, 4, 5];

// ❌ Sequential — each fetch waits for the previous one to finish
// Total time ≈ 5 × fetchUser time
async function getSequential() {
  const users = [];
  for (const id of userIds) {
    const user = await fetchUser(id);  // waits here each iteration
    users.push(user);
  }
  return users;
}

// ✅ Parallel — all fetches start at once
// Total time ≈ slowest single fetchUser
async function getParallel() {
  const promises = userIds.map(id => fetchUser(id));  // kick off all at once
  return Promise.all(promises);                        // wait for all to finish
}

// ✅ Alternative parallel pattern:
async function getParallelAlt() {
  return Promise.all(userIds.map(fetchUser));
}

// ── When sequential IS correct ────────────────────────────────────
// When step N depends on the result of step N-1
async function processInOrder() {
  const user    = await fetchUser(1);           // need user first
  const orders  = await fetchOrders(user.id);   // need user.id
  const invoice = await createInvoice(orders);  // need orders
  return invoice;
}

// ── for await...of — consuming async iterables ────────────────────
async function* paginate(url) {
  let nextUrl = url;
  while (nextUrl) {
    const response = await fetch(nextUrl);
    const data = await response.json();
    yield data.items;
    nextUrl = data.nextPageUrl;
  }
}

for await (const items of paginate("/api/products")) {
  console.log("Got page:", items.length, "items");
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What is the difference between Promise.all and Promise.allSettled?", np: "Promise.all र Promise.allSettled मा के फरक?", jp: "Promise.allとPromise.allSettledの違いは？" },
      answer: {
        en: "Promise.all resolves when ALL promises fulfill, but rejects immediately if ANY one rejects — and you lose the results from the already-fulfilled promises. Promise.allSettled always waits for every promise to finish (whether fulfilled or rejected) and gives you an array of result objects with a `status` field. Use Promise.all when you need all results and a single failure should abort the operation. Use Promise.allSettled when partial success is acceptable — like sending notifications to multiple recipients.",
        np: "Promise.all सबै fulfill हुँदा resolve हुन्छ, तर कुनै एक reject गर्दा तुरन्त reject हुन्छ। Promise.allSettled हरेक promise settle नभइकन रुकिन्छ र `status` field सहित result objects array दिन्छ। Partial success OK भए allSettled।",
        jp: "Promise.allは全て成功で解決するが、一つ失敗すると即座に拒否（成功分の結果も失う）。allSettledは全て確定するまで待ち、statusフィールド付きの結果配列を返す。部分的成功が許容されるならallSettled。",
      },
    },
    {
      question: { en: "How do I run async operations in parallel inside a loop?", np: "Loop भित्र async operations parallel मा कसरी run गर्ने?", jp: "ループ内で非同期処理を並列実行するには？" },
      answer: {
        en: "Do not use `await` inside a `for` loop — that runs each operation sequentially. Instead, create all the Promises first using `.map()`, then await them all with `Promise.all()`. The pattern is: `const results = await Promise.all(items.map(item => asyncOperation(item)))`. This starts all operations simultaneously and waits for all of them, bringing total time down from N × operation time to approximately the time of the slowest single operation.",
        np: "`for` loop भित्र `await` use नगर्नुहोस् — त्यसले sequential run गर्छ। बरु `.map()` सँग सबै Promises create गर्नुहोस् र `Promise.all()` सँग await गर्नुहोस्: `const results = await Promise.all(items.map(item => asyncOperation(item)))`।",
        jp: "`for`ループ内で`await`しない（逐次実行になる）。代わりに`.map()`で全Promiseを生成して`Promise.all()`でawaitする。パターン: `const results = await Promise.all(items.map(item => asyncOperation(item)))`。",
      },
    },
  ],
};
