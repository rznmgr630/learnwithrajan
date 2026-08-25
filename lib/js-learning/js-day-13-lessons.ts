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
      youtubeIds: ["6nv3qy3oNkc"],
    },
    {
      id: "promise-utility-methods",
      title: { en: "Promise.all, allSettled, race & any", np: "Promise.all, allSettled, race, any", jp: "Promise.all・allSettled・race・any" },
      durationMinutes: 9,
      explanation: {
        en: "When you need to handle multiple <b>Promises</b> (asynchronous operations) together, JavaScript provides four main <b>Promise combinators</b> (methods for coordinating multiple Promises). The key difference is <b>when they finish and what happens when one fails</b>.\n\n• <b>`Promise.all()`</b> → waits for <b>all to fulfill</b>; rejects immediately if one rejects.\n• <b>`Promise.allSettled()`</b> → waits for <b>all to settle</b>, regardless of success or failure.\n• <b>`Promise.race()`</b> → finishes when the <b>first Promise settles</b>.\n• <b>`Promise.any()`</b> → finishes when the <b>first Promise fulfills</b>; rejects only when all reject.\n\n```text\n                 Success condition       Failure condition\n────────────────────────────────────────────────────────────\nPromise.all()    ALL fulfill             ANY rejects\nallSettled()     ALL settle              NEVER rejects\nrace()           FIRST settles           First rejection can win\nany()            FIRST fulfills          ALL reject\n```\n\n---\n\n### 1. `Promise.all()` — all must succeed\n\nUse it when you <b>need every result</b>.\n\n```javascript\nconst user = fetchUser();\nconst posts = fetchPosts();\nconst settings = fetchSettings();\n\nconst [userData, postsData, settingsData] =\n  await Promise.all([user, posts, settings]);\n```\n\nThe requests can run <b>concurrently</b> (at the same time) rather than waiting for one to finish before starting the next.\n\nIf one rejects:\n\n```javascript\nawait Promise.all([\n  fetchUser(),\n  fetchPosts(), // rejects\n  fetchSettings()\n]);\n```\n\n`Promise.all()` immediately rejects.\n\n---\n\n### 2. `Promise.allSettled()` — wait for everything\n\nUse it when <b>partial failure is acceptable</b> and you need to know what happened to every Promise.\n\n```javascript\nconst results = await Promise.allSettled([\n  fetchUser(),\n  fetchPosts(),\n  fetchSettings()\n]);\n\nconsole.log(results);\n```\n\nYou might get:\n\n```javascript\n[\n  { status: \"fulfilled\", value: { id: 1 } },\n  { status: \"rejected\", reason: Error(\"Network error\") },\n  { status: \"fulfilled\", value: { theme: \"dark\" } }\n]\n```\n\nOne failure doesn't stop the others from being reported.\n\n---\n\n### 3. `Promise.race()` — first to settle wins\n\nUse it when <b>the fastest result matters</b>, whether that result is success or failure.\n\n```javascript\nfunction timeout(ms) {\n  return new Promise((_, reject) => {\n    setTimeout(() => {\n      reject(new Error(\"Request timed out\"));\n    }, ms);\n  });\n}\n\nconst response = await Promise.race([\n  fetch(\"/api/data\"),\n  timeout(5000)\n]);\n```\n\nIf the request finishes first, you get success. If the timeout finishes first, you get a rejection.\n\n---\n\n### 4. `Promise.any()` — first success wins\n\nUse it when you have <b>multiple possible sources</b> and only need one successful result.\n\n```javascript\nconst result = await Promise.any([\n  fetch(\"https://server-a.com/data\"),\n  fetch(\"https://server-b.com/data\"),\n  fetch(\"https://server-c.com/data\")\n]);\n```\n\nIf Server A and B fail but Server C succeeds, `Promise.any()` resolves with Server C's result.\n\nIf <b>every Promise rejects</b>, it rejects with an <b>`AggregateError`</b> (an error containing multiple rejection reasons).",
        np: "धेरै <b>Promise</b> (asynchronous operation) सँगै सम्हाल्नुपर्दा, JavaScript ले चार मुख्य <b>Promise combinator</b> (धेरै Promise समन्वय गर्ने method) दिन्छ। मुख्य फरक <b>तिनी कहिले सकिन्छन् र एउटा fail हुँदा के हुन्छ</b> भन्नेमा हो।\n\n• <b>`Promise.all()`</b> → <b>सबै fulfill</b> हुन कुर्छ; एउटा reject भए तुरुन्तै reject हुन्छ।\n• <b>`Promise.allSettled()`</b> → सफल होस् वा असफल, <b>सबै settle</b> हुन कुर्छ।\n• <b>`Promise.race()`</b> → <b>पहिलो Promise settle</b> हुँदा सकिन्छ।\n• <b>`Promise.any()`</b> → <b>पहिलो Promise fulfill</b> हुँदा सकिन्छ; सबै reject भएमा मात्र reject हुन्छ।\n\n```text\n                 Success condition       Failure condition\n────────────────────────────────────────────────────────────\nPromise.all()    ALL fulfill             ANY rejects\nallSettled()     ALL settle              NEVER rejects\nrace()           FIRST settles           First rejection can win\nany()            FIRST fulfills          ALL reject\n```\n\n---\n\n### 1. `Promise.all()` — सबै सफल हुनैपर्छ\n\n<b>हरेक नतिजा चाहिँदा</b> प्रयोग गर्नुहोस्।\n\n```javascript\nconst user = fetchUser();\nconst posts = fetchPosts();\nconst settings = fetchSettings();\n\nconst [userData, postsData, settingsData] =\n  await Promise.all([user, posts, settings]);\n```\n\nRequest एउटा सकिने कुरेर अर्को सुरु गर्नुको साटो <b>सँगसँगै</b> चल्न सक्छन्।\n\nएउटा reject भए:\n\n```javascript\nawait Promise.all([\n  fetchUser(),\n  fetchPosts(), // rejects\n  fetchSettings()\n]);\n```\n\n`Promise.all()` तुरुन्तै reject हुन्छ।\n\n---\n\n### 2. `Promise.allSettled()` — सबै कुर्नु\n\n<b>आंशिक असफलता स्वीकार्य</b> भएमा र हरेक Promise लाई के भयो थाहा चाहिँदा प्रयोग गर्नुहोस्।\n\n```javascript\nconst results = await Promise.allSettled([\n  fetchUser(),\n  fetchPosts(),\n  fetchSettings()\n]);\n\nconsole.log(results);\n```\n\nतपाईंले यस्तो पाउन सक्नुहुन्छ:\n\n```javascript\n[\n  { status: \"fulfilled\", value: { id: 1 } },\n  { status: \"rejected\", reason: Error(\"Network error\") },\n  { status: \"fulfilled\", value: { theme: \"dark\" } }\n]\n```\n\nएउटा असफलताले अरूको रिपोर्ट रोक्दैन।\n\n---\n\n### 3. `Promise.race()` — पहिलो settle हुने जित्छ\n\n<b>सबैभन्दा छिटो नतिजा महत्वपूर्ण</b> हुँदा प्रयोग गर्नुहोस्, त्यो नतिजा सफलता होस् वा असफलता।\n\n```javascript\nfunction timeout(ms) {\n  return new Promise((_, reject) => {\n    setTimeout(() => {\n      reject(new Error(\"Request timed out\"));\n    }, ms);\n  });\n}\n\nconst response = await Promise.race([\n  fetch(\"/api/data\"),\n  timeout(5000)\n]);\n```\n\nRequest पहिले सकिए सफलता पाइन्छ। Timeout पहिले सकिए rejection पाइन्छ।\n\n---\n\n### 4. `Promise.any()` — पहिलो सफलता जित्छ\n\n<b>धेरै सम्भावित स्रोत</b> हुँदा र एउटै सफल नतिजा चाहिँदा प्रयोग गर्नुहोस्।\n\n```javascript\nconst result = await Promise.any([\n  fetch(\"https://server-a.com/data\"),\n  fetch(\"https://server-b.com/data\"),\n  fetch(\"https://server-c.com/data\")\n]);\n```\n\nServer A र B fail भई C सफल भए, `Promise.any()` Server C को नतिजा सँग resolve हुन्छ।\n\n<b>हरेक Promise reject</b> भएमा, यो <b>`AggregateError`</b> (धेरै rejection कारण समेटेको error) सँग reject हुन्छ।",
        jp: "複数の<b>Promise</b>（非同期処理）をまとめて扱うとき、JavaScriptには4つの主要な<b>Promiseコンビネータ</b>（複数のPromiseを調整するメソッド）があります。違いは<b>いつ完了するか、1つ失敗したときどうなるか</b>です。\n\n• <b>`Promise.all()`</b> → <b>すべて成功</b>するのを待つ。1つでも拒否されると即座に拒否。\n• <b>`Promise.allSettled()`</b> → 成功でも失敗でも<b>すべて確定</b>するのを待つ。\n• <b>`Promise.race()`</b> → <b>最初に確定したPromise</b>で終わる。\n• <b>`Promise.any()`</b> → <b>最初に成功したPromise</b>で終わる。すべて拒否されたときだけ拒否。\n\n```text\n                 Success condition       Failure condition\n────────────────────────────────────────────────────────────\nPromise.all()    ALL fulfill             ANY rejects\nallSettled()     ALL settle              NEVER rejects\nrace()           FIRST settles           First rejection can win\nany()            FIRST fulfills          ALL reject\n```\n\n---\n\n### 1. `Promise.all()` — すべて成功する必要がある\n\n<b>すべての結果が必要</b>なときに使います。\n\n```javascript\nconst user = fetchUser();\nconst posts = fetchPosts();\nconst settings = fetchSettings();\n\nconst [userData, postsData, settingsData] =\n  await Promise.all([user, posts, settings]);\n```\n\nリクエストは、1つ終わるのを待ってから次を始めるのではなく<b>同時に</b>走れます。\n\n1つでも拒否されると:\n\n```javascript\nawait Promise.all([\n  fetchUser(),\n  fetchPosts(), // rejects\n  fetchSettings()\n]);\n```\n\n`Promise.all()` は即座に拒否されます。\n\n---\n\n### 2. `Promise.allSettled()` — すべてを待つ\n\n<b>一部の失敗が許容できて</b>、各Promiseの結果をすべて知りたいときに使います。\n\n```javascript\nconst results = await Promise.allSettled([\n  fetchUser(),\n  fetchPosts(),\n  fetchSettings()\n]);\n\nconsole.log(results);\n```\n\nこんな結果が得られます:\n\n```javascript\n[\n  { status: \"fulfilled\", value: { id: 1 } },\n  { status: \"rejected\", reason: Error(\"Network error\") },\n  { status: \"fulfilled\", value: { theme: \"dark\" } }\n]\n```\n\n1つの失敗が、他の報告を止めることはありません。\n\n---\n\n### 3. `Promise.race()` — 最初に確定したものが勝つ\n\n結果が成功でも失敗でも、<b>いちばん速い結果が重要</b>なときに使います。\n\n```javascript\nfunction timeout(ms) {\n  return new Promise((_, reject) => {\n    setTimeout(() => {\n      reject(new Error(\"Request timed out\"));\n    }, ms);\n  });\n}\n\nconst response = await Promise.race([\n  fetch(\"/api/data\"),\n  timeout(5000)\n]);\n```\n\nリクエストが先に終われば成功、タイムアウトが先なら拒否になります。\n\n---\n\n### 4. `Promise.any()` — 最初の成功が勝つ\n\n<b>取得元の候補が複数</b>あり、成功した結果が1つあればよいときに使います。\n\n```javascript\nconst result = await Promise.any([\n  fetch(\"https://server-a.com/data\"),\n  fetch(\"https://server-b.com/data\"),\n  fetch(\"https://server-c.com/data\")\n]);\n```\n\nサーバーAとBが失敗してCが成功すれば、`Promise.any()` はCの結果で解決します。\n\n<b>すべてのPromiseが拒否</b>された場合は、<b>`AggregateError`</b>（複数の拒否理由を含むエラー）で拒否されます。",
      },
      diagram: `Promises
 ├── A ── ok
 ├── B ── ok
 └── C ── ok

Promise.all()
       ↓
   [A, B, C]
       ↓
    Resolve


Promises
 ├── A ── ok
 ├── B ── fail
 └── C ── ok

Promise.all()
       ↓
     Reject
   immediately


                 Success condition       Failure condition
────────────────────────────────────────────────────────────
Promise.all()    ALL fulfill             ANY rejects
allSettled()     ALL settle              NEVER rejects
race()           FIRST settles           First rejection can win
any()            FIRST fulfills          ALL reject`,
      codeExample: {
        title: { en: "All four combinators, side by side", np: "चारै combinator सँगसँगै", jp: "4つのコンビネータを並べて" },
        code: `// ── 1. all() — every result, or an immediate rejection ────────────
const [userData, postsData, settingsData] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchSettings()
]);

// ── 2. allSettled() — a full report, successes and failures ───────
const results = await Promise.allSettled([
  fetchUser(),
  fetchPosts(),
  fetchSettings()
]);

// [
//   { status: "fulfilled", value: { id: 1 } },
//   { status: "rejected", reason: Error("Network error") },
//   { status: "fulfilled", value: { theme: "dark" } }
// ]

// ── 3. race() — the classic timeout pattern ───────────────────────
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Request timed out")), ms);
  });
}

const response = await Promise.race([
  fetch("/api/data"),
  timeout(5000)
]);

// ── 4. any() — first success from several sources ─────────────────
const fastest = await Promise.any([
  fetch("https://server-a.com/data"),
  fetch("https://server-b.com/data"),
  fetch("https://server-c.com/data")
]);
// Rejects with an AggregateError only if every source fails`,
      },
      keyTakeaways: [
        { en: "<b>`Promise.all()`</b> → <b>all must succeed</b>; one rejection fails the whole operation.", np: "<b>`Promise.all()`</b> → <b>सबै सफल हुनुपर्छ</b>; एउटा rejection ले पूरै operation असफल बनाउँछ।", jp: "<b>`Promise.all()`</b> → <b>すべて成功が必要</b>。1つの拒否で全体が失敗する。" },
        { en: "<b>`Promise.allSettled()`</b> → <b>wait for everything</b>; gives you every success and failure.", np: "<b>`Promise.allSettled()`</b> → <b>सबै कुर्छ</b>; हरेक सफलता र असफलता दिन्छ।", jp: "<b>`Promise.allSettled()`</b> → <b>すべてを待つ</b>。成功も失敗もすべて返す。" },
        { en: "<b>`Promise.race()`</b> → <b>first to settle wins</b>, success or failure.", np: "<b>`Promise.race()`</b> → <b>पहिलो settle हुने जित्छ</b>, सफलता होस् वा असफलता।", jp: "<b>`Promise.race()`</b> → <b>最初に確定したものが勝つ</b>。成功でも失敗でも。" },
        { en: "<b>`Promise.any()`</b> → <b>first success wins</b>; ignores failures until everything fails.", np: "<b>`Promise.any()`</b> → <b>पहिलो सफलता जित्छ</b>; सबै असफल नहुँदासम्म असफलता बेवास्ता गर्छ।", jp: "<b>`Promise.any()`</b> → <b>最初の成功が勝つ</b>。すべて失敗するまで失敗は無視する。" },
        { en: "`all()` and `any()` can <b>fail fast</b> under their respective conditions.", np: "`all()` र `any()` आ-आफ्नो अवस्थामा <b>चाँडै fail</b> हुन सक्छन्।", jp: "`all()` と `any()` はそれぞれの条件で<b>早く失敗</b>しうる。" },
        { en: "`allSettled()` is useful when you need a complete report of partial successes and failures.", np: "आंशिक सफलता र असफलताको पूर्ण रिपोर्ट चाहिँदा `allSettled()` उपयोगी हुन्छ।", jp: "部分的な成功と失敗の完全な報告が必要なときは `allSettled()` が便利。" },
        { en: "`race()` is useful for <b>timeouts</b> and competing operations.", np: "`race()` <b>timeout</b> र प्रतिस्पर्धी operation का लागि उपयोगी छ।", jp: "`race()` は<b>タイムアウト</b>や競合する処理に便利。" },
      ],
      commonMistakes: [
        { en: "<b>Using `Promise.all()` when one failure shouldn't cancel the result</b> — for `sendEmail()`, `sendSMS()` and `sendPushNotification()`, `allSettled()` tells you what happened to all three instead of failing outright.", np: "<b>एउटा असफलताले नतिजा रद्द गर्नु नहुने बेला `Promise.all()` प्रयोग गर्नु</b> — `sendEmail()`, `sendSMS()` र `sendPushNotification()` का लागि, `allSettled()` ले सिधै fail हुनुको साटो तीनैलाई के भयो बताउँछ।", jp: "<b>1つの失敗で全体を諦めるべきでない場面で `Promise.all()` を使う</b> — `sendEmail()`・`sendSMS()`・`sendPushNotification()` なら、`allSettled()` の方が3つすべての結果を知らせてくれる。" },
        { en: "<b>Confusing `race()` with `any()`</b> — `race()` settles on the first result of any kind, while `any()` waits for the first <b>fulfilled</b> one.", np: "<b>`race()` र `any()` भ्रममा पार्नु</b> — `race()` जुनसुकै प्रकारको पहिलो नतिजामा settle हुन्छ, जब कि `any()` ले पहिलो <b>fulfilled</b> कुर्छ।", jp: "<b>`race()` と `any()` を混同する</b> — `race()` は種類を問わず最初の結果で確定し、`any()` は最初の<b>成功</b>を待つ。" },
        { en: "<b>Thinking `Promise.all()` runs promises one after another</b> — they were already started before the call. Writing `await fetchUser(); await fetchPosts();` is the sequential version, and is slower for independent work.", np: "<b>`Promise.all()` ले promise एकपछि अर्को चलाउँछ भन्ने ठान्नु</b> — तिनी call अघि नै सुरु भइसकेका हुन्छन्। `await fetchUser(); await fetchPosts();` लेख्नु क्रमिक संस्करण हो, र स्वतन्त्र काका लागि ढिलो हुन्छ।", jp: "<b>`Promise.all()` が順番に実行すると思う</b> — 呼び出す前にすでに開始されている。`await fetchUser(); await fetchPosts();` が逐次版で、独立した処理では遅くなる。" },
      ],
      quiz: [
        {
          question: { en: "Which method waits for every Promise, including failures?", np: "कुन method ले असफलता सहित हरेक Promise कुर्छ?", jp: "失敗も含めてすべてのPromiseを待つのはどれか?" },
          options: [
            { en: "`Promise.all()`", np: "`Promise.all()`", jp: "`Promise.all()`" },
            { en: "`Promise.allSettled()`", np: "`Promise.allSettled()`", jp: "`Promise.allSettled()`" },
            { en: "`Promise.race()`", np: "`Promise.race()`", jp: "`Promise.race()`" },
          ],
          correctIndex: 1,
          explanation: { en: "It never rejects; each entry reports `fulfilled` or `rejected`.", np: "यो कहिल्यै reject हुँदैन; हरेक entry ले `fulfilled` वा `rejected` बताउँछ।", jp: "決して拒否されない。各項目が `fulfilled` か `rejected` を報告する。" },
        },
        {
          question: { en: "Which method resolves when the first Promise fulfills?", np: "पहिलो Promise fulfill हुँदा कुन method resolve हुन्छ?", jp: "最初のPromiseが成功したときに解決するのはどれか?" },
          options: [
            { en: "`Promise.race()`", np: "`Promise.race()`", jp: "`Promise.race()`" },
            { en: "`Promise.any()`", np: "`Promise.any()`", jp: "`Promise.any()`" },
            { en: "`Promise.all()`", np: "`Promise.all()`", jp: "`Promise.all()`" },
          ],
          correctIndex: 1,
          explanation: { en: "`race()` would also settle on the first rejection; `any()` waits for a success.", np: "`race()` पहिलो rejection मा पनि settle हुन्थ्यो; `any()` ले सफलता कुर्छ।", jp: "`race()` は最初の拒否でも確定するが、`any()` は成功を待つ。" },
        },
        {
          question: { en: "What happens if one Promise rejects in `Promise.all()`?", np: "`Promise.all()` मा एउटा Promise reject भए के हुन्छ?", jp: "`Promise.all()` で1つのPromiseが拒否されるとどうなるか?" },
          options: [
            { en: "It waits for everything", np: "सबै कुर्छ", jp: "すべてを待つ" },
            { en: "It ignores the rejection", np: "Rejection बेवास्ता गर्छ", jp: "拒否を無視する" },
            { en: "It rejects immediately", np: "तुरुन्तै reject हुन्छ", jp: "即座に拒否される" },
          ],
          correctIndex: 2,
          explanation: { en: "The other promises keep running, but you never get their combined result.", np: "अरू promise चलिरहन्छन्, तर तपाईंले तिनको संयुक्त नतिजा कहिल्यै पाउनुहुन्न।", jp: "他のPromiseは動き続けるが、まとめた結果は得られない。" },
        },
        {
          question: { en: "What does `Promise.race()` care about?", np: "`Promise.race()` ले केमा ध्यान दिन्छ?", jp: "`Promise.race()` は何を見ているか?" },
          options: [
            { en: "The first Promise to fulfill", np: "पहिलो fulfill हुने Promise", jp: "最初に成功したPromise" },
            { en: "The first Promise to settle", np: "पहिलो settle हुने Promise", jp: "最初に確定したPromise" },
            { en: "Whether all Promises fulfill", np: "सबै Promise fulfill हुन्छन् कि", jp: "すべてのPromiseが成功するか" },
          ],
          correctIndex: 1,
          explanation: { en: "Settling covers both outcomes, which is exactly what makes it work for timeouts.", np: "Settle हुनुमा दुबै नतिजा पर्छन्, त्यही कारण यो timeout का लागि काम गर्छ।", jp: "確定には両方の結果が含まれる。だからタイムアウトに使える。" },
        },
      ],
      youtubeIds: ["DlTVt1rZjIo"],
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
