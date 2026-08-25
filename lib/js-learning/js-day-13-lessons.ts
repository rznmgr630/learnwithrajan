import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_13_LESSONS: JsLessonDay = {
  day: 13,
  title: { en: "Promise APIs & async/await patterns", np: "Promise APIs र async/await patterns", jp: "Promise API・async/awaitパターン" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "async-await-basics",
      title: { en: "async/await — Syntactic Sugar over Promises", np: "async/await — Promises माथिको Syntactic Sugar", jp: "async/await — Promiseの糖衣構文" },
      durationMinutes: 9,
      explanation: {
        en: "<b>`async/await`</b> is <b>syntactic sugar</b> (cleaner syntax) built on top of <b>Promises</b>. It doesn't create a new asynchronous model; it makes Promise-based code easier to read by allowing it to look more like synchronous code.\n\nTwo rules matter most:\n\n<b>`async` function</b> → always returns a Promise.\n\n```javascript\nasync function greet() {\n  return \"Hello\";\n}\n\ngreet().then(console.log);\n// Hello\n```\n\nThe returned `\"Hello\"` is automatically wrapped in a resolved Promise.\n\n<b>`await`</b> → waits for a Promise's result <b>inside the current async function</b>. It does <b>not block the JavaScript engine</b> or stop other code from running.\n\n```javascript\nasync function getUser() {\n  const user = await fetchUser();\n  console.log(user);\n}\n```\n\nWhile `getUser()` is waiting, JavaScript can continue handling other work.\n\n---\n\n### 1. `async` always returns a Promise\n\n```javascript\nasync function getMessage() {\n  return \"Hello\";\n}\n\nconst result = getMessage();\n\nconsole.log(result instanceof Promise);\n// true\n\nresult.then(message => {\n  console.log(message);\n});\n// Hello\n```\n\nEven though the function returns a normal string, the `async` keyword turns it into a Promise.\n\n---\n\n### 2. `await` unwraps a Promise\n\n```javascript\nfunction getUser() {\n  return Promise.resolve({ name: \"Rajan\" });\n}\n\nasync function showUser() {\n  const user = await getUser();\n\n  console.log(user.name);\n  // Rajan\n}\n\nshowUser();\n```\n\nWithout `await`, you'd receive the Promise itself:\n\n```javascript\nconst user = getUser();\n\nconsole.log(user);\n// Promise { ... }\n```\n\nWith `await`:\n\n```javascript\nconst user = await getUser();\n\nconsole.log(user);\n// { name: \"Rajan\" }\n```\n\n---\n\n### 3. Promise chain to `async/await`\n\nPromise version:\n\n```javascript\ngetUser()\n  .then(user => getOrders(user.id))\n  .then(orders => processOrders(orders))\n  .catch(err => console.error(err));\n```\n\n`async/await` version:\n\n```javascript\nasync function process() {\n  try {\n    const user = await getUser();\n    const orders = await getOrders(user.id);\n\n    processOrders(orders);\n  } catch (err) {\n    console.error(err);\n  }\n}\n```\n\nThe asynchronous behavior hasn't changed. Only the syntax has.",
        np: "<b>`async/await`</b> <b>Promise</b> माथि बनेको <b>syntactic sugar</b> (सफा syntax) हो। यसले नयाँ asynchronous model बनाउँदैन; यसले Promise-आधारित code लाई synchronous जस्तै देखिन दिएर पढ्न सजिलो बनाउँछ।\n\nदुई नियम सबैभन्दा महत्वपूर्ण छन्:\n\n<b>`async` function</b> → सधैं Promise फर्काउँछ।\n\n```javascript\nasync function greet() {\n  return \"Hello\";\n}\n\ngreet().then(console.log);\n// Hello\n```\n\nफर्काइएको `\"Hello\"` स्वतः resolve भएको Promise मा लपेटिन्छ।\n\n<b>`await`</b> → <b>वर्तमान async function भित्र</b> Promise को नतिजा कुर्छ। यसले <b>JavaScript engine block गर्दैन</b> वा अरू code चल्नबाट रोक्दैन।\n\n```javascript\nasync function getUser() {\n  const user = await fetchUser();\n  console.log(user);\n}\n```\n\n`getUser()` कुर्दै गर्दा, JavaScript ले अरू काम सम्हालिरहन सक्छ।\n\n---\n\n### 1. `async` सधैं Promise फर्काउँछ\n\n```javascript\nasync function getMessage() {\n  return \"Hello\";\n}\n\nconst result = getMessage();\n\nconsole.log(result instanceof Promise);\n// true\n\nresult.then(message => {\n  console.log(message);\n});\n// Hello\n```\n\nFunction ले सामान्य string फर्काए पनि, `async` keyword ले यसलाई Promise बनाउँछ।\n\n---\n\n### 2. `await` ले Promise खोल्छ\n\n```javascript\nfunction getUser() {\n  return Promise.resolve({ name: \"Rajan\" });\n}\n\nasync function showUser() {\n  const user = await getUser();\n\n  console.log(user.name);\n  // Rajan\n}\n\nshowUser();\n```\n\n`await` बिना, तपाईंले Promise आफैं पाउनुहुन्छ:\n\n```javascript\nconst user = getUser();\n\nconsole.log(user);\n// Promise { ... }\n```\n\n`await` सँग:\n\n```javascript\nconst user = await getUser();\n\nconsole.log(user);\n// { name: \"Rajan\" }\n```\n\n---\n\n### 3. Promise chain बाट `async/await`\n\nPromise संस्करण:\n\n```javascript\ngetUser()\n  .then(user => getOrders(user.id))\n  .then(orders => processOrders(orders))\n  .catch(err => console.error(err));\n```\n\n`async/await` संस्करण:\n\n```javascript\nasync function process() {\n  try {\n    const user = await getUser();\n    const orders = await getOrders(user.id);\n\n    processOrders(orders);\n  } catch (err) {\n    console.error(err);\n  }\n}\n```\n\nAsynchronous व्यवहार बदलिएको छैन। Syntax मात्र बदलिएको हो।",
        jp: "<b>`async/await`</b> は<b>Promise</b>の上に作られた<b>糖衣構文</b>（読みやすい書き方）です。新しい非同期のモデルを作るわけではなく、Promiseベースのコードを同期的なコードのように書けるようにして読みやすくします。\n\n重要な規則は2つです:\n\n<b>`async` 関数</b> → 常にPromiseを返す。\n\n```javascript\nasync function greet() {\n  return \"Hello\";\n}\n\ngreet().then(console.log);\n// Hello\n```\n\n返された `\"Hello\"` は自動的に解決済みのPromiseに包まれます。\n\n<b>`await`</b> → <b>今いるasync関数の中で</b>Promiseの結果を待ちます。<b>JavaScriptエンジンをブロックする</b>ことも、他のコードの実行を止めることもありません。\n\n```javascript\nasync function getUser() {\n  const user = await fetchUser();\n  console.log(user);\n}\n```\n\n`getUser()` が待っている間も、JavaScriptは他の処理を進められます。\n\n---\n\n### 1. `async` は常にPromiseを返す\n\n```javascript\nasync function getMessage() {\n  return \"Hello\";\n}\n\nconst result = getMessage();\n\nconsole.log(result instanceof Promise);\n// true\n\nresult.then(message => {\n  console.log(message);\n});\n// Hello\n```\n\n関数が普通の文字列を返しても、`async` キーワードがそれをPromiseにします。\n\n---\n\n### 2. `await` はPromiseを開く\n\n```javascript\nfunction getUser() {\n  return Promise.resolve({ name: \"Rajan\" });\n}\n\nasync function showUser() {\n  const user = await getUser();\n\n  console.log(user.name);\n  // Rajan\n}\n\nshowUser();\n```\n\n`await` がないとPromise自体を受け取ります:\n\n```javascript\nconst user = getUser();\n\nconsole.log(user);\n// Promise { ... }\n```\n\n`await` があれば:\n\n```javascript\nconst user = await getUser();\n\nconsole.log(user);\n// { name: \"Rajan\" }\n```\n\n---\n\n### 3. Promiseチェーンから `async/await` へ\n\nPromise版:\n\n```javascript\ngetUser()\n  .then(user => getOrders(user.id))\n  .then(orders => processOrders(orders))\n  .catch(err => console.error(err));\n```\n\n`async/await` 版:\n\n```javascript\nasync function process() {\n  try {\n    const user = await getUser();\n    const orders = await getOrders(user.id);\n\n    processOrders(orders);\n  } catch (err) {\n    console.error(err);\n  }\n}\n```\n\n非同期の振る舞いは変わっていません。変わったのは書き方だけです。",
      },
      diagram: `Promise-based code

fetchUser()
   ↓
.then(user => fetchOrders(user))
   ↓
.then(orders => processOrders(orders))
   ↓
.catch(handleError)


async/await

async function process() {
  try {
    const user = await fetchUser();
    const orders = await fetchOrders(user);
    processOrders(orders);
  } catch (err) {
    handleError(err);
  }
}

The underlying Promise behaviour is still there —
async/await simply gives you a cleaner way to write it.`,
      codeExample: {
        title: { en: "From a promise chain to await, step by step", np: "Promise chain बाट await सम्म, चरणबद्ध", jp: "Promiseチェーンからawaitへ、一歩ずつ" },
        code: `// ── 1. async always returns a Promise ─────────────────────────────
async function getMessage() {
  return "Hello";
}

const result = getMessage();

console.log(result instanceof Promise); // true
result.then(message => console.log(message)); // Hello

// ── 2. await unwraps the promise ──────────────────────────────────
function getUser() {
  return Promise.resolve({ name: "Rajan" });
}

async function showUser() {
  console.log(getUser());       // Promise { ... }
  console.log(await getUser()); // { name: "Rajan" }
}

showUser();

// ── 3. The same work, written as a chain then with await ──────────
getUser()
  .then(user => getOrders(user.id))
  .then(orders => processOrders(orders))
  .catch(err => console.error(err));

async function process() {
  try {
    const user = await getUser();
    const orders = await getOrders(user.id);

    processOrders(orders);
  } catch (err) {
    console.error(err);
  }
}

// ── await pauses this function, not the engine ────────────────────
async function test() {
  await slowOperation();
  console.log("Done");
}

test();
console.log("Other work"); // runs while slowOperation is still pending`,
      },
      keyTakeaways: [
        { en: "<b>`async/await`</b> → syntactic sugar over Promises.", np: "<b>`async/await`</b> → Promise माथिको syntactic sugar।", jp: "<b>`async/await`</b> → Promiseの上の糖衣構文。" },
        { en: "<b>`async`</b> → always returns a Promise.", np: "<b>`async`</b> → सधैं Promise फर्काउँछ।", jp: "<b>`async`</b> → 常にPromiseを返す。" },
        { en: "<b>`await`</b> → unwraps a Promise's result.", np: "<b>`await`</b> → Promise को नतिजा खोल्छ।", jp: "<b>`await`</b> → Promiseの結果を取り出す。" },
        { en: "<b>`await`</b> pauses only the current async function.", np: "<b>`await`</b> ले वर्तमान async function मात्र रोक्छ।", jp: "<b>`await`</b> は今いるasync関数だけを止める。" },
        { en: "`await` does <b>not block the JavaScript engine</b>.", np: "`await` ले <b>JavaScript engine block गर्दैन</b>।", jp: "`await` は<b>JavaScriptエンジンをブロックしない</b>。" },
        { en: "<b>`try/catch`</b> handles rejected Promises when using `await`.", np: "`await` प्रयोग गर्दा <b>`try/catch`</b> ले reject भएका Promise सम्हाल्छ।", jp: "`await` を使うときは<b>`try/catch`</b>が拒否されたPromiseを扱う。" },
        { en: "`.then()` / `.catch()` and `async/await` use the same underlying Promise mechanism.", np: "`.then()` / `.catch()` र `async/await` ले उही आधारभूत Promise यन्त्र प्रयोग गर्छन्।", jp: "`.then()` / `.catch()` と `async/await` は同じPromiseの仕組みを使う。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking `async` returns the raw value</b> — `getNumber()` gives a Promise, not `42`. You need `await getNumber()` inside an async context.", np: "<b>`async` ले कच्चा value फर्काउँछ भन्ने ठान्नु</b> — `getNumber()` ले `42` होइन, Promise दिन्छ। Async context भित्र `await getNumber()` चाहिन्छ।", jp: "<b>`async` が生の値を返すと思う</b> — `getNumber()` は `42` ではなくPromiseを返す。async文脈で `await getNumber()` が必要。" },
        { en: "<b>Thinking `await` blocks JavaScript</b> — it pauses only the enclosing function. Code after the call, such as a following `console.log`, still runs while the awaited work is pending.", np: "<b>`await` ले JavaScript block गर्छ भन्ने ठान्नु</b> — यसले घेर्ने function मात्र रोक्छ। Call पछिको code, जस्तै अर्को `console.log`, await गरिएको काम बाँकी हुँदै चल्छ।", jp: "<b>`await` がJavaScriptをブロックすると思う</b> — 止まるのは囲っている関数だけ。呼び出しの後のコード（例えば続く `console.log`）は、待っている間も実行される。" },
        { en: "<b>Forgetting error handling</b> — if the awaited promise rejects, the whole `async` function rejects too. Wrap the risky part in `try/catch` when you can act on the failure.", np: "<b>Error handling बिर्सनु</b> — await गरिएको promise reject भए, पूरै `async` function पनि reject हुन्छ। Failure मा केही गर्न सक्ने भए जोखिमपूर्ण भाग `try/catch` मा राख्नुहोस्।", jp: "<b>エラー処理を忘れる</b> — awaitしたPromiseが拒否されると、その `async` 関数全体も拒否される。対処できるなら危険な部分を `try/catch` で囲む。" },
      ],
      quiz: [
        {
          question: { en: "What does an `async` function always return?", np: "`async` function ले सधैं के फर्काउँछ?", jp: "`async` 関数は常に何を返すか?" },
          options: [
            { en: "The raw value", np: "कच्चा value", jp: "生の値" },
            { en: "A Promise", np: "एउटा Promise", jp: "Promise" },
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
          ],
          correctIndex: 1,
          explanation: { en: "Even `return \"Hello\"` comes back wrapped in a resolved Promise.", np: "`return \"Hello\"` पनि resolve भएको Promise मा लपेटिएर आउँछ।", jp: "`return \"Hello\"` でも解決済みのPromiseに包まれて返る。" },
        },
        {
          question: { en: "What does `await` do?", np: "`await` ले के गर्छ?", jp: "`await` は何をするか?" },
          options: [
            { en: "Blocks the entire JavaScript engine", np: "पूरै JavaScript engine block गर्छ", jp: "JavaScriptエンジン全体をブロックする" },
            { en: "Pauses only the current async function until the Promise settles", np: "Promise settle नहुँदासम्म वर्तमान async function मात्र रोक्छ", jp: "Promiseが確定するまで、今いるasync関数だけを止める" },
            { en: "Converts a Promise into a callback", np: "Promise लाई callback मा बदल्छ", jp: "Promiseをコールバックに変換する" },
          ],
          correctIndex: 1,
          explanation: { en: "Other queued work keeps running while that one function waits.", np: "त्यो एउटा function कुर्दै गर्दा queue मा भएका अरू काम चलिरहन्छन्।", jp: "その関数が待っている間も、キューにある他の処理は動き続ける。" },
        },
        {
          question: { en: "What is `async/await` built on?", np: "`async/await` केमाथि बनेको छ?", jp: "`async/await` は何の上に作られているか?" },
          options: [
            { en: "Callbacks", np: "Callback", jp: "コールバック" },
            { en: "Promises", np: "Promise", jp: "Promise" },
            { en: "Threads", np: "Thread", jp: "スレッド" },
          ],
          correctIndex: 1,
          explanation: { en: "It is the same mechanism as `.then()`, written differently.", np: "यो `.then()` कै यन्त्र हो, फरक तरिकाले लेखिएको।", jp: "`.then()` と同じ仕組みを別の書き方にしたもの。" },
        },
        {
          question: { en: "What handles a rejected Promise when using `await`?", np: "`await` प्रयोग गर्दा reject भएको Promise के ले सम्हाल्छ?", jp: "`await` を使うとき、拒否されたPromiseは何が扱うか?" },
          options: [
            { en: "`try/catch`", np: "`try/catch`", jp: "`try/catch`" },
            { en: "`if/else`", np: "`if/else`", jp: "`if/else`" },
            { en: "`switch`", np: "`switch`", jp: "`switch`" },
          ],
          correctIndex: 0,
          explanation: { en: "A rejection becomes a thrown error at the `await`, so `catch` receives it.", np: "Rejection `await` मा throw भएको error बन्छ, त्यसैले `catch` ले पाउँछ।", jp: "拒否は `await` の位置で例外になるので、`catch` が受け取る。" },
        },
      ],
    },
    {
      id: "promise-utility-methods",
      title: { en: "Promise.all, allSettled, race & any", np: "Promise.all, allSettled, race, any", jp: "Promise.all・allSettled・race・any" },
      durationMinutes: 9,
      explanation: {
        en: "When you need to run several Promises together, four static methods each give you a different waiting strategy. `Promise.all()` runs everything in parallel and resolves with an array of results only when <b>all</b> succeed — but it <b>fails fast</b>: the moment any single Promise rejects, `Promise.all` rejects immediately too, discarding the results of the ones that already succeeded. `Promise.allSettled()` never rejects — it always waits for <b>every</b> Promise to settle (fulfilled or rejected) and gives you back an array of `{ status, value }` or `{ status, reason }` objects, so partial failure is visible instead of losing everything.\n\n`Promise.race()` settles as soon as the <b>first</b> Promise settles, whether that's a success or a failure — a classic use is racing a real request against a `setTimeout` rejection to implement a timeout. `Promise.any()` is the optimistic cousin: it resolves as soon as the <b>first</b> Promise fulfills and simply ignores rejections, only rejecting itself (with an `AggregateError`) if <b>every</b> Promise rejects — useful for querying several redundant sources and taking whichever answers first.",
        np: "धेरै Promises एकैसाथ run गर्नुपर्दा, चार static methods ले फरक-फरक waiting strategy दिन्छन्। `Promise.all()` ले सबै parallel मा चलाउँछ र <b>सबै</b> succeed भएमा मात्र results को array सँग resolve हुन्छ — तर यो <b>fail fast</b> हुन्छ: कुनै एक Promise reject भएको क्षण `Promise.all` पनि तुरुन्तै reject हुन्छ, अघि succeed भएका results हराउँछन्। `Promise.allSettled()` कहिल्यै reject हुँदैन — यसले <b>हरेक</b> Promise settle (fulfilled वा rejected) नभएसम्म पर्खिन्छ र `{ status, value }` वा `{ status, reason }` objects को array फर्काउँछ, त्यसैले partial failure देखिन्छ, सबै नहराई।\n\n`Promise.race()` <b>पहिलो</b> Promise settle हुनासाथ settle हुन्छ, success होस् वा failure — timeout implement गर्न वास्तविक request लाई `setTimeout` rejection सँग race गराउनु classic use हो। `Promise.any()` optimistic cousin हो: <b>पहिलो</b> Promise fulfill हुनासाथ resolve हुन्छ र rejections लाई simply ignore गर्छ, <b>सबै</b> Promise reject भएमा मात्र आफैं reject हुन्छ (`AggregateError` सँग) — धेरै redundant sources query गरी जुनसुकैले पहिले जवाफ दिन्छ त्यो लिन उपयोगी।",
        jp: "複数のPromiseを一緒に実行する必要があるとき、4つの静的メソッドがそれぞれ異なる待ち方の戦略を提供する。`Promise.all()`はすべてを並列実行し、<b>全て</b>成功したときのみ結果の配列で解決する — ただし<b>フェイルファスト</b>：どれか1つでも拒否された瞬間に`Promise.all`も即座に拒否され、すでに成功していた結果は破棄される。`Promise.allSettled()`は決して拒否せず、常に<b>すべての</b>Promiseが確定する（成功でも失敗でも）まで待ち、`{ status, value }`または`{ status, reason }`オブジェクトの配列を返すので、全てを失うことなく部分的な失敗が見える。\n\n`Promise.race()`は<b>最初の</b>Promiseが確定した時点で確定する。成功でも失敗でも構わない — 典型的な使い方は実際のリクエストを`setTimeout`のrejectと競わせてタイムアウトを実装すること。`Promise.any()`は楽観的ないとこで、<b>最初の</b>Promiseが成功した時点で解決し、rejectは単純に無視する。<b>すべての</b>Promiseが拒否された場合のみ自身も拒否される（`AggregateError`で）— 複数の冗長なソースに問い合わせ、最初に答えたものを採用するのに便利。",
      },
      diagram: `Promise.all([A, B, C])         Promise.allSettled([A, B, C])
  A ✓  B ✗  C ✓                   A ✓  B ✗  C ✓
  → REJECTS immediately            → always resolves with:
    (B's rejection wins,              [{fulfilled,A}, {rejected,B}, {fulfilled,C}]
     A and C results are lost)

Promise.race([A, B, C])         Promise.any([A, B, C])
  first to SETTLE wins            first to FULFILL wins
  (success OR failure)            (rejections ignored unless ALL reject)
  A settles first → race is A     B rejects, A fulfills → any is A`,
      codeExample: {
        title: { en: "Choosing the right Promise utility method", np: "सही Promise utility method छान्नु", jp: "適切なPromiseユーティリティメソッドの選択" },
        code: `// ── Promise.all — run in parallel, fail fast ───────────────────────
// Resolves only when ALL succeed. Rejects immediately if ANY one rejects.
const [user, posts, comments] = await Promise.all([
  fetchUser(1),
  fetchPosts(1),
  fetchComments(1),
]);
// wall-clock time ≈ max(fetchUser, fetchPosts, fetchComments)
// If fetchPosts rejects, the whole Promise.all rejects — fetchUser's result is lost too

// ── Promise.allSettled — always wait for all, capture failures ─────
// Never rejects — waits for every Promise to settle, success or failure.
const results = await Promise.allSettled([
  sendEmailTo("alice@example.com"),
  sendEmailTo("bob@invalid"),   // will fail
  sendEmailTo("carol@example.com"),
]);

for (const result of results) {
  if (result.status === "fulfilled") {
    console.log("Sent:", result.value);
  } else {
    console.error("Failed:", result.reason.message);
  }
}
// Use when partial success is fine — bulk notifications, batch jobs

// ── Promise.race — first to SETTLE wins (success or failure) ───────
// Classic use: adding a timeout to any Promise
const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(\`Timed out after \${ms}ms\`)), ms)
    ),
  ]);

const fastUser = await withTimeout(fetchUser(1), 5000);

// ── Promise.any — first FULFILLMENT wins, rejections ignored ───────
// Only rejects (AggregateError) if EVERY Promise rejects.
const data = await Promise.any([
  fetchFromCDN1(url),
  fetchFromCDN2(url),
  fetchFromOrigin(url),
]);
// Whichever source answers first wins — the others are simply ignored`,
      },
      keyTakeaways: [
        { en: "`Promise.all()` fails fast — one rejection anywhere rejects the whole thing immediately, discarding results that already succeeded.", np: "`Promise.all()` fail fast हुन्छ — जहाँ पनि एक rejection भयो भने तुरुन्तै पूरै reject हुन्छ, succeed भइसकेका results हराउँछन्।", jp: "`Promise.all()`はフェイルファスト — どこかで1つでも拒否されると即座に全体が拒否され、すでに成功していた結果も破棄される。" },
        { en: "`Promise.allSettled()` never rejects — it waits for every Promise and returns per-item `{ status, value|reason }` objects, so you can act on both successes and failures.", np: "`Promise.allSettled()` कहिल्यै reject हुँदैन — हरेक Promise पर्खी per-item `{ status, value|reason }` objects फर्काउँछ, successes र failures दुवैमा action लिन सकिन्छ।", jp: "`Promise.allSettled()`は決して拒否せず、すべてのPromiseを待って項目ごとの`{ status, value|reason }`オブジェクトを返すので、成功と失敗の両方に対応できる。" },
        { en: "`Promise.race()` settles on the first Promise to settle either way (success or failure); `Promise.any()` settles on the first success and only rejects if all reject.", np: "`Promise.race()` पहिलो settle हुने Promise मा settle हुन्छ (success वा failure जुनसुकै); `Promise.any()` पहिलो success मा settle हुन्छ र सबै reject भएमा मात्र reject हुन्छ।", jp: "`Promise.race()`は最初に確定したPromiseで確定する（成功でも失敗でも）。`Promise.any()`は最初の成功で確定し、全て拒否された場合のみ拒否する。" },
      ],
      commonMistakes: [
        { en: "Reaching for `Promise.all()` when partial success is actually acceptable, and losing every already-succeeded result to a single rejection.", np: "Partial success ठिकै हुँदा पनि `Promise.all()` use गर्नु, एउटा मात्र rejection ले सबै succeed भएका results हराउनु।", jp: "部分的な成功が実際には許容されるのに`Promise.all()`を使い、1つの拒否によってすでに成功していたすべての結果を失うこと。" },
        { en: "Confusing `race` with `any` — `race` settles on the first Promise to settle at all (even a failure can \"win\"), while `any` only cares about the first success.", np: "`race` र `any` लाई घुलाउनु — `race` पहिलो settle हुने मा settle हुन्छ (failure ले पनि \"जित्न\" सक्छ), जबकि `any` ले पहिलो success मात्र हेर्छ।", jp: "`race`と`any`を混同すること — `race`は最初に確定したもの（失敗でも「勝てる」）で確定するが、`any`は最初の成功だけを気にする。" },
        { en: "Reading `.value` directly off a `Promise.allSettled()` result without first checking `.status`, which breaks for the rejected entries that only have `.reason`.", np: "`.status` नजाँची `Promise.allSettled()` को result बाट सिधै `.value` पढ्नु, rejected entries मा `.reason` मात्र हुने भएकाले यो टुट्छ।", jp: "`.status`を確認せずに`Promise.allSettled()`の結果から直接`.value`を読むこと。拒否されたエントリには`.reason`しかないため壊れる。" },
      ],
      quiz: [
        {
          question: { en: "If one Promise out of three passed to `Promise.all()` rejects, what happens to the results of the other two that already succeeded?", np: "`Promise.all()` मा दिइएका तीनमध्ये एउटा Promise reject भयो भने, succeed भइसकेका बाँकी दुईको results को के हुन्छ?", jp: "`Promise.all()`に渡した3つのうち1つが拒否された場合、すでに成功していた残り2つの結果はどうなる？" },
          options: [
            { en: "They are discarded — Promise.all rejects immediately, losing them", np: "ती हराउँछन् — Promise.all तुरुन्तै reject हुन्छ, ती हराउँदै", jp: "破棄される — Promise.allは即座に拒否され、それらを失う" },
            { en: "They are still returned alongside the rejection reason", np: "ती rejection reason सँगै फेरि पनि फर्किन्छन्", jp: "拒否理由と一緒にそれらも返される" },
          ],
          correctIndex: 0,
          explanation: { en: "Promise.all is fail-fast — the first rejection immediately rejects the combined Promise, and any already-fulfilled results are discarded.", np: "Promise.all fail-fast हो — पहिलो rejection ले तुरुन्तै combined Promise reject गर्छ, अघि succeed भएका results हराउँछन्।", jp: "Promise.allはフェイルファストであり、最初の拒否が即座に結合されたPromiseを拒否し、すでに成功していた結果は破棄される。" },
        },
        {
          question: { en: "Which method should you reach for when you want to send emails to 100 recipients and still know which ones failed, without losing the successful sends?", np: "100 recipients लाई email पठाउँदा succeed भएका नहराई कुन fail भयो भन्ने पनि जान्न कुन method use गर्नुपर्छ?", jp: "100人の受信者にメールを送り、成功した送信を失わずにどれが失敗したかも知りたい場合、どのメソッドを使うべき？" },
          options: [
            { en: "Promise.allSettled — waits for all and reports each outcome", np: "Promise.allSettled — सबै पर्खी हरेकको outcome report गर्छ", jp: "Promise.allSettled — 全てを待って各結果を報告する" },
            { en: "Promise.all — fails fast on the first failure", np: "Promise.all — पहिलो failure मा fail fast हुन्छ", jp: "Promise.all — 最初の失敗でフェイルファストする" },
          ],
          correctIndex: 0,
          explanation: { en: "Promise.allSettled never rejects and gives per-item status, exactly matching a bulk-send scenario where partial failure is acceptable.", np: "Promise.allSettled कहिल्यै reject हुँदैन र per-item status दिन्छ, partial failure ठिकै हुने bulk-send scenario मा एकदम मिल्छ।", jp: "Promise.allSettledは決して拒否せず項目ごとのステータスを返すので、部分的な失敗が許容されるバルク送信のシナリオにぴったり合う。" },
        },
        {
          question: { en: "When does `Promise.any()` reject, as opposed to `Promise.race()`?", np: "`Promise.race()` को तुलनामा `Promise.any()` कहिले reject हुन्छ?", jp: "`Promise.race()`と比べて`Promise.any()`はいつ拒否される？" },
          options: [
            { en: "Only when every Promise passed to it rejects (throws AggregateError)", np: "यसमा दिइएका सबै Promises reject भएमा मात्र (AggregateError throw गर्छ)", jp: "渡されたすべてのPromiseが拒否されたときのみ（AggregateErrorを投げる）" },
            { en: "As soon as any single Promise passed to it rejects", np: "यसमा दिइएको कुनै एक Promise reject हुनासाथ", jp: "渡された1つのPromiseでも拒否された時点ですぐに" },
          ],
          correctIndex: 0,
          explanation: { en: "Promise.any ignores individual rejections and only fails when there are no successes left — i.e. all of them rejected.", np: "Promise.any ले individual rejections लाई ignore गर्छ र कुनै success नबाँकी रहेमा मात्र fail हुन्छ — अर्थात् सबै reject भएमा।", jp: "Promise.anyは個々の拒否を無視し、成功が1つも残っていない場合、つまり全て拒否された場合のみ失敗する。" },
        },
      ],
    },
    {
      id: "parallel-vs-sequential",
      title: { en: "Parallel vs Sequential await", np: "Parallel vs Sequential await", jp: "並列awaitと逐次await" },
      durationMinutes: 9,
      explanation: {
        en: "One of the most common `async`/`await` performance bugs is putting `await` directly inside a `for` loop when the iterations are independent of each other. Each `await fetchUser(id)` pauses the whole loop until that one request finishes before even <b>starting</b> the next one — five independent requests end up running one after another, so total time becomes roughly <b>5 × single-request time</b> instead of running concurrently.\n\nThe fix is to separate <b>starting</b> a Promise from <b>waiting</b> on it: use `.map()` to call the async function for every item first (this kicks off all the requests immediately, since calling an async function starts running it right away), collect the resulting array of Promises, and only then `await Promise.all(promises)` to wait for all of them together. Total time drops to roughly the <b>slowest single request</b>. Sequential `await` in a loop is still the <b>correct</b> choice, though, whenever step N genuinely needs the result of step N-1 before it can even begin.",
        np: "सबैभन्दा common `async`/`await` performance bug भनेको independent iterations हुँदा पनि `for` loop भित्र सिधै `await` राख्नु हो। हरेक `await fetchUser(id)` ले अर्को request सुरु नै नहुँदै त्यो एउटा नसकिएसम्म पूरै loop pause गर्छ — पाँच independent requests एक-एक गरी क्रमैसँग चल्छन्, त्यसैले total time concurrently चल्नुको सट्टा लगभग <b>5 × single-request time</b> हुन्छ।\n\nसमाधान भनेको Promise <b>सुरु गर्नु</b> र त्यसमा <b>पर्खनु</b> लाई छुट्याउनु हो: पहिले हरेक item का लागि async function call गर्न `.map()` use गर्नुहोस् (async function call गर्नासाथ यो तुरुन्तै चल्न सुरु हुन्छ, त्यसैले सबै requests तुरुन्तै सुरु हुन्छन्), Promises को resulting array collect गर्नुहोस्, र त्यसपछि मात्र सबैलाई सँगै पर्खन `await Promise.all(promises)` गर्नुहोस्। Total time लगभग <b>सबैभन्दा ढिलो single request</b> बराबर घट्छ। Step N लाई साँच्चै step N-1 को result चाहिने भएमा भने loop भित्रको sequential `await` अझै <b>सहि</b> choice हो।",
        jp: "最も一般的な`async`/`await`のパフォーマンスバグの1つは、反復が互いに独立しているのに`for`ループ内に直接`await`を置くこと。各`await fetchUser(id)`はその1件のリクエストが終わるまでループ全体を一時停止させ、次のリクエストを<b>開始する</b>ことすらできない。5件の独立したリクエストが結局1つずつ順番に実行されるため、合計時間は並行実行の場合ではなく、およそ<b>単一リクエスト時間の5倍</b>になってしまう。\n\n解決策はPromiseの<b>開始</b>と<b>待機</b>を分けること：まず`.map()`を使ってすべての項目に対してasync関数を呼び出す（async関数は呼び出した瞬間に実行が始まるため、これによってすべてのリクエストが即座に開始される）、結果として得られるPromiseの配列を集め、その後で初めて`await Promise.all(promises)`ですべてをまとめて待つ。合計時間はおよそ<b>最も遅い単一リクエスト</b>の時間まで下がる。ただし、ステップNが本当にステップN-1の結果を必要としてからでないと開始できない場合は、ループ内の逐次的な`await`が依然として<b>正しい</b>選択である。",
      },
      diagram: `SEQUENTIAL (await inside the loop) — independent requests, wasted time
  fetchUser(1) ████
                   fetchUser(2) ████
                                    fetchUser(3) ████
  |----|----|----|----|----|----|----|----|----|----|----|----   time
  total ≈ 3 × single request time

PARALLEL (start all first, then Promise.all) — same independent requests
  fetchUser(1) ████
  fetchUser(2) ████
  fetchUser(3) ████
  |----|----|----|----                                            time
  total ≈ slowest single request time`,
      codeExample: {
        title: { en: "await in a loop vs Promise.all — a common performance mistake", np: "Loop मा await vs Promise.all", jp: "ループ内のawait対Promise.all" },
        code: `const userIds = [1, 2, 3, 4, 5];

// ❌ Sequential — each fetch waits for the previous one to fully finish
// Total time ≈ 5 × fetchUser time, even though the requests don't depend on each other
async function getSequential() {
  const users = [];
  for (const id of userIds) {
    const user = await fetchUser(id);  // pauses the whole loop here, every time
    users.push(user);
  }
  return users;
}

// ✅ Parallel — all requests start at once, then wait together
// Total time ≈ slowest single fetchUser call
async function getParallel() {
  const promises = userIds.map(id => fetchUser(id));  // starts ALL requests immediately
  return Promise.all(promises);                         // now wait for all of them
}

// ✅ Same idea, more compact
async function getParallelAlt() {
  return Promise.all(userIds.map(fetchUser));
}

// ── When sequential IS the correct choice ─────────────────────────
// Use it when step N genuinely depends on the result of step N-1
async function processInOrder() {
  const user    = await fetchUser(1);           // need the user first
  const orders  = await fetchOrders(user.id);   // needs user.id
  const invoice = await createInvoice(orders);  // needs orders
  return invoice;
}`,
      },
      keyTakeaways: [
        { en: "`await` inside a `for` loop runs independent async calls one at a time — total time grows to roughly N × single-call time instead of running them together.", np: "`for` loop भित्रको `await` ले independent async calls लाई एक-एक गरी चलाउँछ — total time सँगै चलाउनुको सट्टा लगभग N × single-call time हुन्छ।", jp: "`for`ループ内の`await`は独立した非同期呼び出しを1つずつ実行する — 合計時間はまとめて実行する代わりにおよそN×単一呼び出し時間まで増える。" },
        { en: "Starting all Promises first with `.map()` and then `await Promise.all(promises)` runs them concurrently — total time drops to roughly the slowest single call.", np: "पहिले `.map()` सँग सबै Promises सुरु गरी त्यसपछि `await Promise.all(promises)` गर्दा ती concurrently चल्छन् — total time लगभग सबैभन्दा ढिलो single call बराबर हुन्छ।", jp: "まず`.map()`ですべてのPromiseを開始し、その後`await Promise.all(promises)`することで並行実行される — 合計時間はおよそ最も遅い単一呼び出しまで下がる。" },
        { en: "Sequential `await` inside a loop is still correct when step N truly needs the output of step N-1 before it can start.", np: "Step N ले साँच्चै step N-1 को output चाहिने भएमा loop भित्रको sequential `await` अझै सहि हुन्छ।", jp: "ステップNが開始前に本当にステップN-1の出力を必要とする場合、ループ内の逐次的な`await`は依然として正しい。" },
      ],
      commonMistakes: [
        { en: "Writing `for (const id of ids) { await fetchUser(id); }` for independent requests, accidentally serialising work that could run in parallel.", np: "Independent requests का लागि `for (const id of ids) { await fetchUser(id); }` लेख्नु, parallel चल्न सक्ने काम गल्तिले serialise गर्नु।", jp: "独立したリクエストに対して`for (const id of ids) { await fetchUser(id); }`と書き、並列実行できる作業を誤って直列化してしまうこと。" },
        { en: "Reaching for `Promise.all(items.map(...))` even when each step actually depends on the previous step's result, producing wrong or undefined inputs.", np: "हरेक step अघिल्लो step को result मा साँच्चै depend गर्दा पनि `Promise.all(items.map(...))` use गर्नु, गलत वा undefined inputs निस्कने।", jp: "各ステップが実際には前のステップの結果に依存しているのに`Promise.all(items.map(...))`を使い、誤った、あるいはundefinedな入力を生み出すこと。" },
        { en: "Assuming `userIds.map(id => fetchUser(id))` doesn't start any requests until it's awaited — calling an async function begins running it immediately, `.map()` alone already kicks everything off.", np: "`userIds.map(id => fetchUser(id))` ले await नहुँदासम्म कुनै request सुरु गर्दैन भन्ने ठान्नु — async function call गर्नासाथ यो तुरुन्तै चल्न सुरु हुन्छ, `.map()` ले नै सबै सुरु गरिसक्छ।", jp: "`userIds.map(id => fetchUser(id))`はawaitされるまでリクエストを開始しないと思い込むこと — async関数の呼び出しは即座に実行を開始し、`.map()`だけですでにすべてが始まっている。" },
      ],
      quiz: [
        {
          question: { en: "If five independent `fetchUser(id)` calls are each `await`-ed one at a time inside a `for` loop, roughly how long does the total operation take compared to a single call?", np: "पाँच independent `fetchUser(id)` calls लाई `for` loop भित्र एक-एक गरी `await` गरियो भने, total operation एउटा single call को तुलनामा लगभग कति समय लिन्छ?", jp: "5つの独立した`fetchUser(id)`呼び出しを`for`ループ内で1つずつawaitすると、合計操作は単一呼び出しに比べておよそどれくらい時間がかかる？" },
          options: [
            { en: "Roughly 5× a single call's time — they run one after another", np: "लगभग एउटा single call को 5× समय — ती एक पछि अर्को चल्छन्", jp: "単一呼び出しのおよそ5倍 — 1つずつ順番に実行される" },
            { en: "Roughly the same as a single call — they run together", np: "लगभग एउटा single call जत्तिकै — ती सँगै चल्छन्", jp: "単一呼び出しとほぼ同じ — まとめて実行される" },
          ],
          correctIndex: 0,
          explanation: { en: "Awaiting inside the loop makes each request wait for the previous one to fully finish before starting, serialising independent work.", np: "Loop भित्र await गर्दा हरेक request अघिल्लो पूर्ण नसकिएसम्म सुरु हुँदैन, independent काम serialise हुन्छ।", jp: "ループ内でawaitすると各リクエストは前のものが完全に終わるまで開始せず、独立した作業が直列化される。" },
        },
        {
          question: { en: "What is the fix for the loop-await performance bug when the requests are independent?", np: "Requests independent हुँदा loop-await performance bug को समाधान के हो?", jp: "リクエストが独立している場合、ループawaitのパフォーマンスバグの修正方法は？" },
          options: [
            { en: "Start all Promises first (e.g. with .map()), then await them together with Promise.all", np: "पहिले सबै Promises सुरु गर्नुहोस् (जस्तै .map() सँग), त्यसपछि Promise.all सँग सँगै await गर्नुहोस्", jp: "まず（例えば.map()で）すべてのPromiseを開始し、その後Promise.allでまとめてawaitする" },
            { en: "There is no fix — sequential is always the only option in a loop", np: "कुनै समाधान छैन — loop मा sequential नै एक मात्र option हो", jp: "修正方法はない — ループでは逐次実行だけが唯一の選択肢" },
          ],
          correctIndex: 0,
          explanation: { en: "Starting every Promise immediately with .map() and awaiting the whole batch with Promise.all lets independent requests run concurrently.", np: ".map() सँग हरेक Promise तुरुन्तै सुरु गरी Promise.all सँग सम्पूर्ण batch await गर्दा independent requests concurrently चल्छन्।", jp: ".map()ですべてのPromiseを即座に開始し、Promise.allでバッチ全体をawaitすることで、独立したリクエストを並行実行できる。" },
        },
        {
          question: { en: "Is sequential `await` inside a loop ever the correct choice?", np: "Loop भित्र sequential `await` कहिल्यै सहि choice हुन्छ?", jp: "ループ内の逐次的なawaitが正しい選択になることはある？" },
          options: [
            { en: "Yes — when each step genuinely needs the previous step's result before it can start", np: "हो — हरेक step ले साँच्चै अघिल्लो step को result सुरु हुनु अघि नै चाहिँदा", jp: "はい — 各ステップが開始前に本当に前のステップの結果を必要とする場合" },
            { en: "No — parallel with Promise.all is always strictly better", np: "होइन — Promise.all सँग parallel सधैं strictly राम्रो हुन्छ", jp: "いいえ — Promise.allでの並列実行が常に厳密に優れている" },
          ],
          correctIndex: 0,
          explanation: { en: "When operations are truly dependent on each other's output, they cannot be parallelised safely — sequential await is the correct pattern there.", np: "Operations साँच्चै एक-अर्काको output मा dependent हुँदा safely parallelise गर्न सकिँदैन — त्यहाँ sequential await नै सहि pattern हो।", jp: "操作が本当に互いの出力に依存している場合、安全に並列化することはできない — そこでは逐次的なawaitが正しいパターンとなる。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Does an `async function` always return a Promise, even when it returns a plain value?", np: "`async function` ले plain value return गरे पनि सधैं Promise return गर्छ?", jp: "`async function`はプレーンな値を返しても常にPromiseを返す？" },
      options: [{ en: "Yes — the value is auto-wrapped in a Promise", np: "हो — value auto Promise मा wrap हुन्छ", jp: "はい — 値は自動的にPromiseでラップされる" }, { en: "No — only if you explicitly return a Promise", np: "होइन — explicitly Promise return गरेमा मात्र", jp: "いいえ — 明示的にPromiseを返した場合のみ" }],
      correctIndex: 0,
      explanation: { en: "Every async function's return value, plain or not, is wrapped in Promise.resolve(...) automatically.", np: "हरेक async function को return value, plain होस् वा नहोस्, auto Promise.resolve(...) मा wrap हुन्छ।", jp: "async関数の戻り値はプレーンであってもなくても自動的にPromise.resolve(...)でラップされる。" },
    },
    {
      question: { en: "Does `await` block the entire JavaScript engine, or only the current async function?", np: "`await` ले पूरै JavaScript engine block गर्छ कि केवल current async function मात्र?", jp: "`await`はJavaScriptエンジン全体をブロックする？それとも現在のasync関数のみ？" },
      options: [{ en: "Only the current async function pauses", np: "केवल current async function मात्र pause हुन्छ", jp: "現在のasync関数のみが一時停止する" }, { en: "It blocks the whole engine and all other code", np: "यसले पूरै engine र अन्य सबै code block गर्छ", jp: "エンジン全体と他のすべてのコードをブロックする" }],
      correctIndex: 0,
      explanation: { en: "await only suspends the function it's written inside; other code keeps running normally.", np: "await ले त्यो लेखिएको function मात्र suspend गर्छ; अन्य code सामान्य रूपमा चलिरहन्छ।", jp: "awaitはそれが書かれた関数のみを一時停止させる。他のコードは正常に実行を続ける。" },
    },
    {
      question: { en: "What construct replaces `.catch()` for handling errors with `await`?", np: "`await` सँग errors handle गर्न `.catch()` को सट्टा कुन construct प्रयोग हुन्छ?", jp: "`await`でエラーを処理するために`.catch()`の代わりに使う構文は？" },
      options: [{ en: "A try/catch block wrapped around the await call", np: "await call वरिपरि wrap गरिएको try/catch block", jp: "await呼び出しを囲むtry/catchブロック" }, { en: "There is no replacement, errors are unhandled", np: "कुनै replacement छैन, errors unhandled रहन्छन्", jp: "代替はなく、エラーは未処理のままになる" }],
      correctIndex: 0,
      explanation: { en: "A rejection during await inside try jumps to the matching catch, just like a thrown exception.", np: "try भित्र await बेला rejection भयो भने thrown exception जस्तै matching catch मा जान्छ।", jp: "try内でのawait中のrejectは投げられた例外と同様に対応するcatchへ飛ぶ。" },
    },
    {
      question: { en: "If one of three Promises passed to Promise.all() rejects, what happens?", np: "Promise.all() मा दिइएका तीनमध्ये एउटा reject भयो भने के हुन्छ?", jp: "Promise.all()に渡された3つのうち1つが拒否されるとどうなる？" },
      options: [{ en: "Promise.all rejects immediately, discarding successful results", np: "Promise.all तुरुन्तै reject हुन्छ, succeed भएका results हराउँछन्", jp: "Promise.allは即座に拒否され、成功した結果は破棄される" }, { en: "Promise.all resolves with the two successful results", np: "Promise.all succeed भएका दुई results सँग resolve हुन्छ", jp: "Promise.allは成功した2つの結果で解決する" }],
      correctIndex: 0,
      explanation: { en: "Promise.all is fail-fast — a single rejection rejects the whole combined Promise immediately.", np: "Promise.all fail-fast हो — एउटा rejection ले तुरुन्तै पूरै combined Promise reject गर्छ।", jp: "Promise.allはフェイルファストであり、1つの拒否が即座に結合されたPromise全体を拒否する。" },
    },
    {
      question: { en: "Which method should you use when you want the outcome of every operation, including which ones failed, without losing successes?", np: "Succeed भएका नहराई हरेक operation को outcome (कुन fail भयो सहित) चाहिँदा कुन method use गर्नुपर्छ?", jp: "成功を失うことなく、どれが失敗したかを含めすべての操作の結果を知りたい場合、どのメソッドを使うべき？" },
      options: [{ en: "Promise.allSettled", np: "Promise.allSettled", jp: "Promise.allSettled" }, { en: "Promise.race", np: "Promise.race", jp: "Promise.race" }],
      correctIndex: 0,
      explanation: { en: "Promise.allSettled never rejects and reports a status per item, keeping every outcome visible.", np: "Promise.allSettled कहिल्यै reject हुँदैन र per-item status report गर्छ, हरेक outcome देखिन्छ।", jp: "Promise.allSettledは決して拒否せず項目ごとのステータスを報告し、すべての結果を可視化する。" },
    },
    {
      question: { en: "What is the key difference between Promise.race() and Promise.any()?", np: "Promise.race() र Promise.any() बीचको key फरक के हो?", jp: "Promise.race()とPromise.any()の主な違いは何？" },
      options: [{ en: "race settles on the first settle (success or failure); any settles on the first success only", np: "race पहिलो settle (success वा failure) मा settle हुन्छ; any पहिलो success मा मात्र", jp: "raceは最初の確定（成功か失敗）で確定し、anyは最初の成功でのみ確定する" }, { en: "They behave identically in every case", np: "ती हरेक अवस्थामा उस्तै behave गर्छन्", jp: "両者はすべてのケースで同じように振る舞う" }],
      correctIndex: 0,
      explanation: { en: "race cares about whichever settles first regardless of outcome, while any ignores rejections until every Promise has rejected.", np: "race ले outcome जे भए पनि पहिलो settle हुनेलाई हेर्छ, जबकि any ले सबै Promise reject नभएसम्म rejections लाई ignore गर्छ।", jp: "raceは結果に関わらず最初に確定したものを気にするが、anyはすべてのPromiseが拒否されるまでrejectを無視する。" },
    },
    {
      question: { en: "Why does await-ing inside a for loop hurt performance for independent async calls?", np: "Independent async calls का लागि for loop भित्र await गर्दा किन performance बिग्रन्छ?", jp: "独立した非同期呼び出しに対してforループ内でawaitするとなぜパフォーマンスが悪化する？" },
      options: [{ en: "Each call waits for the previous one to finish before starting, serialising them", np: "हरेक call ले अघिल्लो नसकिएसम्म सुरु हुँदैन, serialise हुन्छ", jp: "各呼び出しは前のものが終わるまで開始せず、直列化される" }, { en: "It doesn't — loops always run concurrently by default", np: "यसले बिग्रँदैन — loops default मा सधैं concurrently चल्छन्", jp: "悪化しない — ループはデフォルトで常に並行実行される" }],
      correctIndex: 0,
      explanation: { en: "Awaiting inside the loop body forces each iteration's request to fully complete before the next one even begins.", np: "Loop body भित्र await गर्दा हरेक iteration को request अघिल्लो पूर्ण नभई अर्को सुरु हुँदैन।", jp: "ループ本体内でawaitすると、各反復のリクエストは次が開始する前に完全に完了しなければならない。" },
    },
    {
      question: { en: "How do you fix the sequential-await-in-a-loop bug for independent operations?", np: "Independent operations का लागि loop भित्रको sequential-await bug कसरी fix गर्ने?", jp: "独立した操作に対してループ内の逐次的なawaitのバグをどう修正する？" },
      options: [{ en: "Start every Promise first with .map(), then await them all with Promise.all", np: ".map() सँग पहिले सबै Promise सुरु गरी Promise.all सँग सबैलाई await गर्नुहोस्", jp: "まず.map()ですべてのPromiseを開始し、Promise.allでまとめてawaitする" }, { en: "Add more await keywords inside the loop", np: "Loop भित्र थप await keywords थप्नुहोस्", jp: "ループ内にawaitキーワードをさらに追加する" }],
      correctIndex: 0,
      explanation: { en: "Kicking off all Promises immediately via .map(), then awaiting the batch together, lets independent work run concurrently.", np: ".map() मार्फत सबै Promise तुरुन्तै सुरु गरी batch लाई सँगै await गर्दा independent काम concurrently चल्छ।", jp: ".map()ですべてのPromiseを即座に開始し、バッチをまとめてawaitすることで、独立した作業を並行実行できる。" },
    },
    {
      question: { en: "Is Promise.all() ever the wrong tool, even for a loop of async calls?", np: "Async calls को loop का लागि पनि Promise.all() कहिल्यै गलत tool हुन्छ?", jp: "非同期呼び出しのループに対しても、Promise.all()が間違ったツールになることはある？" },
      options: [{ en: "Yes — when each step genuinely depends on the previous step's result", np: "हो — हरेक step ले साँच्चै अघिल्लो step को result मा depend गर्दा", jp: "はい — 各ステップが本当に前のステップの結果に依存している場合" }, { en: "No — Promise.all is always the correct choice for any loop", np: "होइन — जुनसुकै loop का लागि Promise.all सधैं सहि choice हो", jp: "いいえ — Promise.allはどんなループに対しても常に正しい選択" }],
      correctIndex: 0,
      explanation: { en: "When operations have a real dependency chain, they must run sequentially with await, not blindly parallelised with Promise.all.", np: "Operations मा real dependency chain हुँदा, Promise.all सँग blindly parallelise नगरी await सँग sequentially चलाउनुपर्छ।", jp: "操作に本当の依存関係の連鎖がある場合、Promise.allで無闇に並列化するのではなく、awaitで逐次実行しなければならない。" },
    },
  ],
};
