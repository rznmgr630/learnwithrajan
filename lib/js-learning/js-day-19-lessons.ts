import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_19_LESSONS: JsLessonDay = {
  day: 19,
  title: { en: "Node.js event loop phases — nextTick & setImmediate", np: "Node.js event loop phases — nextTick र setImmediate", jp: "Node.jsのイベントループフェーズ — nextTickとsetImmediate" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "nodejs-event-loop-phases",
      title: { en: "The Node.js Event Loop Phases", np: "Node.js Event Loop Phases", jp: "Node.jsイベントループのフェーズ" },
      durationMinutes: 9,
      explanation: {
        en: "The <b>Node.js event loop</b> is the mechanism that lets Node handle asynchronous operations while JavaScript itself executes on a single main thread.\n\nNode uses <b>libuv</b>, a C library that provides the underlying event loop and asynchronous I/O machinery.\n\nUnlike the simplified browser model, Node has a specific sequence of <b>event loop phases</b>:\n\n```text\nTimers\n   ↓\nPending Callbacks\n   ↓\nIdle / Prepare\n   ↓\nPoll\n   ↓\nCheck\n   ↓\nClose Callbacks\n   ↺\n```\n\nThe two phases you will work with most often are:\n\n• <b>Poll</b> — handles most I/O callbacks\n• <b>Check</b> — handles `setImmediate()`\n\nA crucial detail: Node processes its microtasks <b>between</b> phases, and `process.nextTick()` has priority over Promise microtasks.\n\n---\n\n### 1. Timers\n\nThe timers phase handles callbacks scheduled by `setTimeout()` and `setInterval()`.\n\n```javascript\nsetTimeout(() => {\n  console.log(\"Timer\");\n}, 0);\n```\n\nA common mistake is thinking `0` means \"execute immediately\". It does not:\n\n```text\nsetTimeout(fn, 0)\n       ↓\nTimer becomes eligible\n       ↓\nTimer phase eventually runs\n       ↓\nfn()\n```\n\nThe callback still has to wait for the event loop.\n\n---\n\n### 2. Pending callbacks\n\nThis phase handles certain callbacks deferred from a previous event loop iteration. You generally do not interact with it directly — think of it as Node internally handling system-level callbacks that could not be processed immediately.\n\n---\n\n### 3. Idle / Prepare\n\nThis phase is primarily <b>internal to Node</b>. The event loop uses it to prepare for the next stage. As an application developer you rarely touch it.\n\n```text\nTimers\n  ↓\nPending callbacks\n  ↓\nIdle / Prepare  ← mostly internal\n  ↓\nPoll\n```\n\n---\n\n### 4. Poll — the important one\n\nThe <b>poll phase</b> is where Node spends much of its time. It processes many asynchronous I/O callbacks.\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"data.txt\", \"utf8\", (err, data) => {\n  console.log(data);\n});\n```\n\nThe filesystem operation happens outside the JavaScript call stack. When it completes, its callback eventually becomes eligible to run.\n\nThe poll phase also decides whether Node should:\n\n```text\nProcess available I/O\n       ↓\nWait for more I/O\n       ↓\nMove toward the next phase\n```\n\nThis is one reason Node handles many concurrent connections without one JavaScript thread per connection.\n\n---\n\n### 5. Check\n\nThe <b>check phase</b> is where `setImmediate()` callbacks execute.\n\n```javascript\nsetImmediate(() => {\n  console.log(\"Immediate\");\n});\n```\n\nSo remember:\n\n```text\nsetTimeout()   → Timers phase\n\nsetImmediate() → Check phase\n```\n\n---\n\n### 6. Close callbacks\n\nThe final phase handles close-related callbacks.\n\n```javascript\nsocket.on(\"close\", () => {\n  console.log(\"Socket closed\");\n});\n```\n\n---\n\n### Microtasks are not event loop phases\n\nThis distinction matters. Do <b>not</b> picture the loop as timers, microtasks, poll, microtasks, check, microtasks. Microtasks are not one of the six phases. Node processes them between JavaScript callbacks and phase transitions, and gives `process.nextTick()` special priority:\n\n```text\nCurrent callback\n      ↓\nprocess.nextTick()\n      ↓\nPromise microtasks\n      ↓\nContinue event loop processing\n```\n\n---\n\n### 1. Basic — `setTimeout` vs `setImmediate`\n\n```javascript\nsetTimeout(() => {\n  console.log(\"timeout\");\n}, 0);\n\nsetImmediate(() => {\n  console.log(\"immediate\");\n});\n```\n\nYou should <b>not</b> assume one always wins. At the top level, either callback can run first depending on how quickly Node reaches the event loop. This is a classic Node interview trap.\n\n---\n\n### 2. Intermediate — inside an I/O callback\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"data.txt\", () => {\n  setTimeout(() => {\n    console.log(\"timeout\");\n  }, 0);\n\n  setImmediate(() => {\n    console.log(\"immediate\");\n  });\n});\n```\n\nTypical output:\n\n```text\nimmediate\ntimeout\n```\n\nThe code runs during a <b>poll</b> phase callback, and the very next phase is <b>check</b>:\n\n```text\nPoll phase\n   │\n   ├── fs.readFile callback\n   │\n   └── schedules:\n          │\n          ├── setImmediate → Check\n          │\n          └── setTimeout   → Timers\n                           ↓\n                      next iteration\n```\n\n---\n\n### 3. Advanced — `process.nextTick()` vs Promise\n\n```javascript\nconsole.log(\"start\");\n\nprocess.nextTick(() => {\n  console.log(\"nextTick\");\n});\n\nPromise.resolve().then(() => {\n  console.log(\"promise\");\n});\n\nsetTimeout(() => {\n  console.log(\"timer\");\n}, 0);\n\nconsole.log(\"end\");\n```\n\nOutput:\n\n```text\nstart\nend\nnextTick\npromise\ntimer\n```\n\nSo in Node's scheduling model: <b>nextTick > Promise microtask > timer</b>.\n\n---\n\n### Poll vs Check, at a glance\n\n```text\nsetTimeout, setInterval  →  Timers\nfs / network I/O         →  Poll\nsetImmediate             →  Check\nsocket close             →  Close\nprocess.nextTick()       →  microtask, before promises\nPromise .then()          →  microtask\n```\n\n---\n\n### Interview mental model\n\nWhen given Node code mixing `setTimeout`, `setImmediate`, `process.nextTick`, `Promise` and `fs.readFile`, do not guess. Ask in order:\n\n```text\n1. What runs synchronously?\n2. What is an I/O callback?\n3. Which phase handles it?\n4. Where does setTimeout go?\n5. Where does setImmediate go?\n6. Are there nextTick callbacks?\n7. Are there Promise microtasks?\n8. When are the microtasks drained?\n```",
        np: "<b>Node.js event loop</b> त्यो संयन्त्र हो जसले JavaScript एउटै मुख्य thread मा चल्दा पनि Node लाई asynchronous operation सम्हाल्न दिन्छ।\n\nNode ले <b>libuv</b> प्रयोग गर्छ — एउटा C library जसले भित्री event loop र asynchronous I/O संयन्त्र दिन्छ।\n\nसरलीकृत browser model भन्दा फरक, Node मा <b>event loop phase</b> को निश्चित क्रम छ:\n\n```text\nTimers\n   ↓\nPending Callbacks\n   ↓\nIdle / Prepare\n   ↓\nPoll\n   ↓\nCheck\n   ↓\nClose Callbacks\n   ↺\n```\n\nसबैभन्दा धेरै काम पर्ने दुई phase:\n\n• <b>Poll</b> — धेरैजसो I/O callback सम्हाल्छ\n• <b>Check</b> — `setImmediate()` सम्हाल्छ\n\nमहत्वपूर्ण कुरा: Node ले microtask phase <b>बीचमा</b> process गर्छ, र `process.nextTick()` लाई Promise microtask भन्दा प्राथमिकता दिन्छ।\n\n---\n\n### 1. Timers\n\nTimers phase ले `setTimeout()` र `setInterval()` ले schedule गरेका callback सम्हाल्छ।\n\n```javascript\nsetTimeout(() => {\n  console.log(\"Timer\");\n}, 0);\n```\n\n`0` को अर्थ \"तुरुन्तै चलाऊ\" हो भन्ने सामान्य भ्रम हो। होइन:\n\n```text\nsetTimeout(fn, 0)\n       ↓\nTimer becomes eligible\n       ↓\nTimer phase eventually runs\n       ↓\nfn()\n```\n\nCallback ले अझै event loop कुर्नुपर्छ।\n\n---\n\n### 2. Pending callbacks\n\nयो phase ले अघिल्लो iteration बाट सारिएका केही callback सम्हाल्छ। तपाईं सामान्यतया यससँग सिधै काम गर्नुहुन्न — Node ले तुरुन्तै process गर्न नसकिएका system-स्तरका callback भित्री रूपमा सम्हालेको ठान्नुहोस्।\n\n---\n\n### 3. Idle / Prepare\n\nयो phase मुख्यतः <b>Node को भित्री</b> हो। Event loop ले अर्को चरणको तयारीमा प्रयोग गर्छ। Application developer ले प्रायः छुँदैन।\n\n```text\nTimers\n  ↓\nPending callbacks\n  ↓\nIdle / Prepare  ← mostly internal\n  ↓\nPoll\n```\n\n---\n\n### 4. Poll — महत्वपूर्ण phase\n\n<b>Poll phase</b> मा Node ले धेरै समय बिताउँछ। यसले धेरै asynchronous I/O callback process गर्छ।\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"data.txt\", \"utf8\", (err, data) => {\n  console.log(data);\n});\n```\n\nFilesystem operation JavaScript call stack बाहिर हुन्छ। सकिएपछि यसको callback चल्न योग्य बन्छ।\n\nPoll phase ले यो पनि तय गर्छ:\n\n```text\nProcess available I/O\n       ↓\nWait for more I/O\n       ↓\nMove toward the next phase\n```\n\nत्यसैले Node ले प्रति connection एउटा JavaScript thread नबनाई धेरै समानान्तर connection सम्हाल्न सक्छ।\n\n---\n\n### 5. Check\n\n<b>Check phase</b> मा `setImmediate()` का callback चल्छन्।\n\n```javascript\nsetImmediate(() => {\n  console.log(\"Immediate\");\n});\n```\n\nसम्झनुहोस्:\n\n```text\nsetTimeout()   → Timers phase\n\nsetImmediate() → Check phase\n```\n\n---\n\n### 6. Close callbacks\n\nअन्तिम phase ले close सम्बन्धी callback सम्हाल्छ।\n\n```javascript\nsocket.on(\"close\", () => {\n  console.log(\"Socket closed\");\n});\n```\n\n---\n\n### Microtask event loop phase होइनन्\n\nयो भिन्नता महत्वपूर्ण छ। Loop लाई timers, microtask, poll, microtask, check, microtask भनी <b>नचिताउनुहोस्</b>। Microtask छ phase मध्ये पर्दैनन्। Node ले तिनलाई JavaScript callback र phase संक्रमणका बीचमा process गर्छ, र `process.nextTick()` लाई विशेष प्राथमिकता दिन्छ:\n\n```text\nCurrent callback\n      ↓\nprocess.nextTick()\n      ↓\nPromise microtasks\n      ↓\nContinue event loop processing\n```\n\n---\n\n### 1. आधारभूत — `setTimeout` vs `setImmediate`\n\n```javascript\nsetTimeout(() => {\n  console.log(\"timeout\");\n}, 0);\n\nsetImmediate(() => {\n  console.log(\"immediate\");\n});\n```\n\nएउटै सधैं जित्छ भन्ने <b>नठान्नुहोस्</b>। Top level मा, Node कति छिटो event loop मा पुग्छ त्यसमा भर पर्दै जुनसुकै पहिले चल्न सक्छ। यो classic Node interview trap हो।\n\n---\n\n### 2. मध्यम — I/O callback भित्र\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"data.txt\", () => {\n  setTimeout(() => {\n    console.log(\"timeout\");\n  }, 0);\n\n  setImmediate(() => {\n    console.log(\"immediate\");\n  });\n});\n```\n\nसामान्य output:\n\n```text\nimmediate\ntimeout\n```\n\nCode <b>poll</b> phase को callback मा चल्छ, र ठ्याक्कै अर्को phase <b>check</b> हो:\n\n```text\nPoll phase\n   │\n   ├── fs.readFile callback\n   │\n   └── schedules:\n          │\n          ├── setImmediate → Check\n          │\n          └── setTimeout   → Timers\n                           ↓\n                      next iteration\n```\n\n---\n\n### 3. उन्नत — `process.nextTick()` vs Promise\n\n```javascript\nconsole.log(\"start\");\n\nprocess.nextTick(() => {\n  console.log(\"nextTick\");\n});\n\nPromise.resolve().then(() => {\n  console.log(\"promise\");\n});\n\nsetTimeout(() => {\n  console.log(\"timer\");\n}, 0);\n\nconsole.log(\"end\");\n```\n\nOutput:\n\n```text\nstart\nend\nnextTick\npromise\ntimer\n```\n\nअर्थात् Node को scheduling मा: <b>nextTick > Promise microtask > timer</b>।\n\n---\n\n### Poll vs Check, एक नजरमा\n\n```text\nsetTimeout, setInterval  →  Timers\nfs / network I/O         →  Poll\nsetImmediate             →  Check\nsocket close             →  Close\nprocess.nextTick()       →  microtask, promise अघि\nPromise .then()          →  microtask\n```\n\n---\n\n### Interview mental model\n\n`setTimeout`, `setImmediate`, `process.nextTick`, `Promise` र `fs.readFile` मिसिएको Node code आउँदा अनुमान नगर्नुहोस्। क्रमैसँग सोध्नुहोस्:\n\n```text\n1. के synchronously चल्छ?\n2. कुन चाहिँ I/O callback हो?\n3. कुन phase ले सम्हाल्छ?\n4. setTimeout कहाँ जान्छ?\n5. setImmediate कहाँ जान्छ?\n6. nextTick callback छन्?\n7. Promise microtask छन्?\n8. Microtask कहिले खाली हुन्छन्?\n```",
        jp: "<b>Node.jsのイベントループ</b>は、JavaScript自体が1本のメインスレッドで実行されながら、Nodeが非同期処理を扱えるようにする仕組みです。\n\nNodeは<b>libuv</b>というCライブラリを使い、その上でイベントループと非同期I/Oを実現しています。\n\n簡略化されたブラウザのモデルと違い、Nodeには決まった<b>イベントループのフェーズ</b>の並びがあります:\n\n```text\nTimers\n   ↓\nPending Callbacks\n   ↓\nIdle / Prepare\n   ↓\nPoll\n   ↓\nCheck\n   ↓\nClose Callbacks\n   ↺\n```\n\n実務でよく関わるのは次の2つです:\n\n• <b>Poll</b> — ほとんどのI/Oコールバックを扱う\n• <b>Check</b> — `setImmediate()` を扱う\n\n重要な点として、Nodeはマイクロタスクをフェーズの<b>あいだ</b>で処理し、`process.nextTick()` はPromiseのマイクロタスクより優先されます。\n\n---\n\n### 1. Timers\n\nタイマーフェーズは `setTimeout()` と `setInterval()` が予約したコールバックを扱います。\n\n```javascript\nsetTimeout(() => {\n  console.log(\"Timer\");\n}, 0);\n```\n\n`0` が「即座に実行」を意味すると思うのはよくある誤解です:\n\n```text\nsetTimeout(fn, 0)\n       ↓\nTimer becomes eligible\n       ↓\nTimer phase eventually runs\n       ↓\nfn()\n```\n\nコールバックはやはりイベントループを待ちます。\n\n---\n\n### 2. Pending callbacks\n\n前回の反復から持ち越された一部のコールバックを扱うフェーズです。通常は直接触れません。すぐに処理できなかったシステムレベルのコールバックをNodeが内部的に扱っている、と考えてください。\n\n---\n\n### 3. Idle / Prepare\n\nここは主に<b>Node内部</b>のフェーズで、次の段階への準備に使われます。アプリ開発者が触ることはほぼありません。\n\n```text\nTimers\n  ↓\nPending callbacks\n  ↓\nIdle / Prepare  ← mostly internal\n  ↓\nPoll\n```\n\n---\n\n### 4. Poll — 最も重要\n\n<b>pollフェーズ</b>はNodeが多くの時間を過ごす場所で、非同期I/Oのコールバックを処理します。\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"data.txt\", \"utf8\", (err, data) => {\n  console.log(data);\n});\n```\n\nファイル操作はJavaScriptのコールスタックの外で行われ、完了するとコールバックが実行可能になります。\n\npollフェーズは次の判断も行います:\n\n```text\nProcess available I/O\n       ↓\nWait for more I/O\n       ↓\nMove toward the next phase\n```\n\nだからNodeは接続ごとにJavaScriptスレッドを作らずに、多数の同時接続を扱えます。\n\n---\n\n### 5. Check\n\n<b>checkフェーズ</b>では `setImmediate()` のコールバックが実行されます。\n\n```javascript\nsetImmediate(() => {\n  console.log(\"Immediate\");\n});\n```\n\n覚え方:\n\n```text\nsetTimeout()   → Timers phase\n\nsetImmediate() → Check phase\n```\n\n---\n\n### 6. Close callbacks\n\n最後のフェーズはクローズ関連のコールバックを扱います。\n\n```javascript\nsocket.on(\"close\", () => {\n  console.log(\"Socket closed\");\n});\n```\n\n---\n\n### マイクロタスクはフェーズではない\n\nこの区別は大切です。ループを「timers → microtasks → poll → microtasks → check → microtasks」と<b>思わないで</b>ください。マイクロタスクは6つのフェーズのどれでもありません。Nodeはそれらをコールバックの実行やフェーズ遷移の合間に処理し、`process.nextTick()` を特別扱いします:\n\n```text\nCurrent callback\n      ↓\nprocess.nextTick()\n      ↓\nPromise microtasks\n      ↓\nContinue event loop processing\n```\n\n---\n\n### 1. 基本 — `setTimeout` と `setImmediate`\n\n```javascript\nsetTimeout(() => {\n  console.log(\"timeout\");\n}, 0);\n\nsetImmediate(() => {\n  console.log(\"immediate\");\n});\n```\n\nどちらかが必ず勝つと<b>思ってはいけません</b>。トップレベルでは、Nodeがどれだけ早くイベントループに到達するかで順序が変わります。定番の面接の罠です。\n\n---\n\n### 2. 中級 — I/Oコールバックの中で\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"data.txt\", () => {\n  setTimeout(() => {\n    console.log(\"timeout\");\n  }, 0);\n\n  setImmediate(() => {\n    console.log(\"immediate\");\n  });\n});\n```\n\n典型的な出力:\n\n```text\nimmediate\ntimeout\n```\n\nこのコードは<b>poll</b>フェーズのコールバック内で動き、次のフェーズがまさに<b>check</b>だからです:\n\n```text\nPoll phase\n   │\n   ├── fs.readFile callback\n   │\n   └── schedules:\n          │\n          ├── setImmediate → Check\n          │\n          └── setTimeout   → Timers\n                           ↓\n                      next iteration\n```\n\n---\n\n### 3. 上級 — `process.nextTick()` とPromise\n\n```javascript\nconsole.log(\"start\");\n\nprocess.nextTick(() => {\n  console.log(\"nextTick\");\n});\n\nPromise.resolve().then(() => {\n  console.log(\"promise\");\n});\n\nsetTimeout(() => {\n  console.log(\"timer\");\n}, 0);\n\nconsole.log(\"end\");\n```\n\n出力:\n\n```text\nstart\nend\nnextTick\npromise\ntimer\n```\n\nつまりNodeのスケジューリングでは <b>nextTick > Promiseマイクロタスク > タイマー</b>。\n\n---\n\n### PollとCheckの早見\n\n```text\nsetTimeout, setInterval  →  Timers\nfs / network I/O         →  Poll\nsetImmediate             →  Check\nsocket close             →  Close\nprocess.nextTick()       →  マイクロタスク、Promiseより先\nPromise .then()          →  マイクロタスク\n```\n\n---\n\n### 面接用の考え方\n\n`setTimeout`・`setImmediate`・`process.nextTick`・`Promise`・`fs.readFile` が混ざったコードを見たら、当てずっぽうにせず順に問います:\n\n```text\n1. 同期で走るのはどれか\n2. どれがI/Oコールバックか\n3. どのフェーズが扱うか\n4. setTimeoutはどこへ行くか\n5. setImmediateはどこへ行くか\n6. nextTickはあるか\n7. Promiseのマイクロタスクはあるか\n8. マイクロタスクはいつ空にされるか\n```",
      },
      diagram: `                    ┌─────────────┐
                    │   TIMERS    │
                    │ setTimeout  │
                    │ setInterval │
                    └──────┬──────┘
                           ↓
                ┌────────────────────┐
                │ PENDING CALLBACKS  │
                └──────────┬─────────┘
                           ↓
                ┌────────────────────┐
                │   IDLE / PREPARE   │
                │      internal      │
                └──────────┬─────────┘
                           ↓
                    ┌─────────────┐
                    │    POLL     │
                    │             │
                    │ I/O events  │
                    │ fs / network│
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │    CHECK    │
                    │setImmediate │
                    └──────┬──────┘
                           ↓
                ┌────────────────────┐
                │  CLOSE CALLBACKS   │
                │ socket.close() etc │
                └──────────┬─────────┘
                           │
                           └──────→ next iteration


Microtasks run between phases, not as a phase

        Event Loop Phase
              ↓
      process.nextTick()
              ↓
       Promise callbacks
              ↓
       Next Event Loop Phase`,
      codeExample: {
        title: { en: "Reading the phase from the API", np: "API बाट phase पहिचान गर्ने", jp: "APIからフェーズを読み取る" },
        code: `// ── 1. Basic — do not assume a winner at the top level ────────────
setTimeout(() => console.log("timeout"), 0); // timers phase
setImmediate(() => console.log("immediate")); // check phase
// order can vary depending on how fast Node reaches the loop

// ── 2. Intermediate — inside an I/O callback the order is reliable ─
const fs = require("fs");

fs.readFile("data.txt", () => {
  setTimeout(() => console.log("timeout"), 0);
  setImmediate(() => console.log("immediate"));
});
// immediate, then timeout — poll is followed by check

// ── 3. Advanced — nextTick beats promises, promises beat timers ────
console.log("start");

process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
setTimeout(() => console.log("timer"), 0);

console.log("end");
// start, end, nextTick, promise, timer

// ── Which phase owns which API ────────────────────────────────────
// setTimeout / setInterval  -> timers
// fs and network callbacks  -> poll
// setImmediate              -> check
// socket "close"            -> close callbacks`,
      },
      keyTakeaways: [
        { en: "Node's event loop runs six phases in order: <b>timers, pending callbacks, idle/prepare, poll, check, close callbacks</b>.", np: "Node को event loop छ phase क्रमैसँग चलाउँछ: <b>timers, pending callbacks, idle/prepare, poll, check, close callbacks</b>।", jp: "Nodeのイベントループは6つのフェーズを順に回す: <b>timers・pending callbacks・idle/prepare・poll・check・close callbacks</b>。" },
        { en: "<b>libuv</b> provides the underlying event loop and asynchronous I/O.", np: "<b>libuv</b> ले भित्री event loop र asynchronous I/O दिन्छ।", jp: "<b>libuv</b> が基盤のイベントループと非同期I/Oを提供する。" },
        { en: "The <b>poll</b> phase handles most I/O callbacks; the <b>check</b> phase runs `setImmediate()`.", np: "<b>Poll</b> phase ले धेरैजसो I/O callback सम्हाल्छ; <b>check</b> phase ले `setImmediate()` चलाउँछ।", jp: "<b>poll</b> フェーズが大半のI/Oコールバックを扱い、<b>check</b> フェーズが `setImmediate()` を走らせる。" },
        { en: "`setTimeout()` and `setInterval()` belong to the <b>timers</b> phase.", np: "`setTimeout()` र `setInterval()` <b>timers</b> phase का हुन्।", jp: "`setTimeout()` と `setInterval()` は<b>timers</b>フェーズに属する。" },
        { en: "<b>Microtasks are not one of the phases</b>; they are processed between callbacks and phase transitions.", np: "<b>Microtask phase मध्ये पर्दैनन्</b>; तिनी callback र phase संक्रमणका बीचमा process हुन्छन्।", jp: "<b>マイクロタスクはフェーズではない</b>。コールバックやフェーズ遷移の合間に処理される。" },
        { en: "`process.nextTick()` is drained <b>before</b> Promise microtasks.", np: "`process.nextTick()` Promise microtask <b>अघि</b> खाली हुन्छ।", jp: "`process.nextTick()` はPromiseのマイクロタスクより<b>先に</b>処理される。" },
        { en: "Inside an I/O callback, `setImmediate()` reliably runs before `setTimeout(fn, 0)`.", np: "I/O callback भित्र, `setImmediate()` भरपर्दो रूपमा `setTimeout(fn, 0)` अघि चल्छ।", jp: "I/Oコールバックの中では `setImmediate()` が `setTimeout(fn, 0)` より確実に先に走る。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking Node has only one queue</b> — it has several phase queues plus separate microtask processing for `nextTick` and promises.", np: "<b>Node मा एउटै queue छ भन्ने ठान्नु</b> — यसमा धेरै phase queue र `nextTick` तथा promise का लागि छुट्टै microtask processing छ।", jp: "<b>Nodeのキューは1つだと思う</b> — 複数のフェーズごとのキューに加え、`nextTick` とPromiseのマイクロタスク処理が別にある。" },
        { en: "<b>Assuming `setTimeout(fn, 0)` always beats `setImmediate()`</b> — at the top level the order can vary. Inside an I/O callback, `setImmediate()` wins.", np: "<b>`setTimeout(fn, 0)` सधैं `setImmediate()` लाई जित्छ भन्ने ठान्नु</b> — top level मा क्रम फरक हुन सक्छ। I/O callback भित्र `setImmediate()` जित्छ।", jp: "<b>`setTimeout(fn, 0)` が必ず `setImmediate()` に勝つと思う</b> — トップレベルでは順序が変わりうる。I/Oコールバック内では `setImmediate()` が勝つ。" },
        { en: "<b>Saying Node is completely single-threaded</b> — JavaScript execution is, but libuv and the OS handle async work, and libuv uses a thread pool for some operations.", np: "<b>Node पूरै single-threaded हो भन्नु</b> — JavaScript execution हो, तर libuv र OS ले async काम सम्हाल्छन्, र libuv ले केही operation का लागि thread pool प्रयोग गर्छ।", jp: "<b>Nodeは完全にシングルスレッドだと言う</b> — JavaScriptの実行はそうだが、非同期処理はlibuvとOSが担い、libuvは一部でスレッドプールを使う。" },
        { en: "<b>Treating microtasks as a seventh phase</b> — they run around callback execution, not as a step in the six-phase cycle.", np: "<b>Microtask लाई सातौं phase ठान्नु</b> — तिनी छ phase को चक्रको चरण नभई callback execution वरिपरि चल्छन्।", jp: "<b>マイクロタスクを7番目のフェーズ扱いする</b> — 6フェーズ周期の一段ではなく、コールバック実行の周辺で走る。" },
      ],
      quiz: [
        {
          question: { en: "Which phase executes `setImmediate()` callbacks?", np: "`setImmediate()` का callback कुन phase ले चलाउँछ?", jp: "`setImmediate()` のコールバックを実行するのはどのフェーズか?" },
          options: [
            { en: "Check", np: "Check", jp: "Check" },
            { en: "Poll", np: "Poll", jp: "Poll" },
            { en: "Timers", np: "Timers", jp: "Timers" },
            { en: "Close", np: "Close", jp: "Close" },
          ],
          correctIndex: 0,
          explanation: { en: "Check comes right after poll, which is why it wins inside I/O callbacks.", np: "Check poll पछि तुरुन्तै आउँछ, त्यसैले I/O callback भित्र यो जित्छ।", jp: "checkはpollの直後に来るので、I/Oコールバック内では先に走る。" },
        },
        {
          question: { en: "Where are most filesystem and network I/O callbacks processed?", np: "धेरैजसो filesystem र network I/O callback कहाँ process हुन्छन्?", jp: "ファイルシステムやネットワークのI/Oコールバックは主にどこで処理されるか?" },
          options: [
            { en: "Timers", np: "Timers", jp: "Timers" },
            { en: "Poll", np: "Poll", jp: "Poll" },
            { en: "Check", np: "Check", jp: "Check" },
            { en: "Idle / Prepare", np: "Idle / Prepare", jp: "Idle / Prepare" },
          ],
          correctIndex: 1,
          explanation: { en: "The poll phase is where Node spends most of its time.", np: "Poll phase मा Node ले सबैभन्दा धेरै समय बिताउँछ।", jp: "pollフェーズがNodeの主戦場。" },
        },
        {
          question: { en: "Which has priority in Node's microtask processing?", np: "Node को microtask processing मा कसको प्राथमिकता छ?", jp: "Nodeのマイクロタスク処理で優先されるのはどれか?" },
          options: [
            { en: "Promise callbacks", np: "Promise का callback", jp: "Promiseのコールバック" },
            { en: "`setTimeout()`", np: "`setTimeout()`", jp: "`setTimeout()`" },
            { en: "`process.nextTick()`", np: "`process.nextTick()`", jp: "`process.nextTick()`" },
            { en: "`setImmediate()`", np: "`setImmediate()`", jp: "`setImmediate()`" },
          ],
          correctIndex: 2,
          explanation: { en: "The nextTick queue is drained before promise reactions.", np: "nextTick queue promise भन्दा अघि खाली हुन्छ।", jp: "nextTickのキューはPromiseの反応より先に空にされる。" },
        },
        {
          question: { en: "What is the output of `console.log(\"A\"); process.nextTick(() => console.log(\"B\")); Promise.resolve().then(() => console.log(\"C\")); setTimeout(() => console.log(\"D\"), 0); console.log(\"E\");`?", np: "`console.log(\"A\"); process.nextTick(() => console.log(\"B\")); Promise.resolve().then(() => console.log(\"C\")); setTimeout(() => console.log(\"D\"), 0); console.log(\"E\");` को output के हो?", jp: "`console.log(\"A\"); process.nextTick(() => console.log(\"B\")); Promise.resolve().then(() => console.log(\"C\")); setTimeout(() => console.log(\"D\"), 0); console.log(\"E\");` の出力は?" },
          options: [
            { en: "`A B C D E`", np: "`A B C D E`", jp: "`A B C D E`" },
            { en: "`A E D B C`", np: "`A E D B C`", jp: "`A E D B C`" },
            { en: "`A E C B D`", np: "`A E C B D`", jp: "`A E C B D`" },
            { en: "`A E B C D`", np: "`A E B C D`", jp: "`A E B C D`" },
          ],
          correctIndex: 3,
          explanation: { en: "Sync first, then nextTick, then promises, then the timers phase.", np: "पहिले sync, त्यसपछि nextTick, अनि promise, अनि timers phase।", jp: "まず同期、次にnextTick、次にPromise、最後にtimersフェーズ。" },
        },
        {
          question: { en: "Which phase does `setTimeout()` belong to?", np: "`setTimeout()` कुन phase को हो?", jp: "`setTimeout()` はどのフェーズに属するか?" },
          options: [
            { en: "Timers", np: "Timers", jp: "Timers" },
            { en: "Check", np: "Check", jp: "Check" },
            { en: "Poll", np: "Poll", jp: "Poll" },
            { en: "Close", np: "Close", jp: "Close" },
          ],
          correctIndex: 0,
          explanation: { en: "Its callback becomes eligible during the timers phase.", np: "यसको callback timers phase मा चल्न योग्य बन्छ।", jp: "そのコールバックはtimersフェーズで実行可能になる。" },
        },
      ],
      youtubeIds: ["HlebgIgOfHM"],
    },
    {
      id: "nexttick-vs-setimmediate-vs-settimeout",
      title: { en: "nextTick vs setImmediate vs setTimeout(fn, 0)", np: "nextTick vs setImmediate vs setTimeout(fn, 0)", jp: "nextTick vs setImmediate vs setTimeout(fn, 0)" },
      durationMinutes: 9,
      explanation: {
        en: "Node gives you several ways to schedule work for later, but <b>`process.nextTick()`</b>, <b>`setImmediate()`</b> and <b>`setTimeout(fn, 0)`</b> do not mean the same thing.\n\nThe easiest way to remember them:\n\n```text\nCurrent synchronous code\n        ↓\nprocess.nextTick()\n        ↓\nPromise microtasks\n        ↓\nEvent loop phases\n   ├── setTimeout()\n   └── setImmediate()\n```\n\nThe distinction that matters is <b>when each callback becomes eligible to run</b>.\n\n---\n\n### `process.nextTick()`\n\nIt schedules a callback to run <b>after the current synchronous operation finishes, but before Node continues into the event loop</b>.\n\n```javascript\nconsole.log(\"start\");\n\nprocess.nextTick(() => {\n  console.log(\"nextTick\");\n});\n\nconsole.log(\"end\");\n```\n\nOutput:\n\n```text\nstart\nend\nnextTick\n```\n\nThink of it as: \"finish what you are doing right now, then run me before moving on.\" It has extremely high priority.\n\n---\n\n### `setImmediate()`\n\nIt schedules a callback for the <b>check phase</b>.\n\n```javascript\nconsole.log(\"start\");\n\nsetImmediate(() => {\n  console.log(\"immediate\");\n});\n\nconsole.log(\"end\");\n```\n\nOutput:\n\n```text\nstart\nend\nimmediate\n```\n\nIts most important use case is scheduling something <b>after I/O callbacks</b>:\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"file.txt\", () => {\n  setImmediate(() => {\n    console.log(\"immediate\");\n  });\n});\n```\n\nInside an I/O callback, `setImmediate()` is guaranteed to run before a `setTimeout(fn, 0)` scheduled there.\n\n---\n\n### `setTimeout(fn, 0)`\n\nDespite the `0`, this does <b>not</b> mean \"run immediately\". It schedules the callback for the <b>timers phase</b>. The `0` roughly means \"run this as soon as the timer is eligible\", and it still waits for the current synchronous work and event loop scheduling.\n\n```javascript\nconsole.log(\"start\");\n\nsetTimeout(() => {\n  console.log(\"timeout\");\n}, 0);\n\nconsole.log(\"end\");\n```\n\nOutput:\n\n```text\nstart\nend\ntimeout\n```\n\n---\n\n### 1. Basic — `nextTick` vs `setTimeout`\n\n```javascript\nconsole.log(\"1\");\n\nprocess.nextTick(() => {\n  console.log(\"2\");\n});\n\nsetTimeout(() => {\n  console.log(\"3\");\n}, 0);\n\nconsole.log(\"4\");\n```\n\nOutput:\n\n```text\n1\n4\n2\n3\n```\n\n```text\n1 → synchronous\n4 → synchronous\n2 → nextTick\n3 → timer\n```\n\nThe synchronous code finishes first, then Node processes `nextTick()` before continuing into the event loop.\n\n---\n\n### 2. Intermediate — `nextTick` vs Promise vs timer\n\n```javascript\nconsole.log(\"start\");\n\nprocess.nextTick(() => {\n  console.log(\"nextTick\");\n});\n\nPromise.resolve().then(() => {\n  console.log(\"promise\");\n});\n\nsetTimeout(() => {\n  console.log(\"timeout\");\n}, 0);\n\nsetImmediate(() => {\n  console.log(\"immediate\");\n});\n\nconsole.log(\"end\");\n```\n\nThe guaranteed part of the ordering is:\n\n```text\nstart\nend\nnextTick\npromise\n```\n\nAfter that, `timeout` versus `immediate` depends on where the code runs. At the <b>top level</b>, their relative order is not something to rely on.\n\n---\n\n### 3. Advanced — `setImmediate()` vs `setTimeout()` inside I/O\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"file.txt\", () => {\n  setTimeout(() => {\n    console.log(\"timeout\");\n  }, 0);\n\n  setImmediate(() => {\n    console.log(\"immediate\");\n  });\n});\n```\n\nOutput:\n\n```text\nimmediate\ntimeout\n```\n\n```text\nfs.readFile()\n     │\n     ▼\n  Poll phase\n     │\n     ▼\nI/O callback executes\n     │\n     ├── setTimeout()   → Timers phase\n     │\n     └── setImmediate() → Check phase\n                              ↑\n                         next phase\n```\n\nThe I/O callback runs during the <b>poll</b> phase, and Node moves straight into the <b>check</b> phase. So inside an I/O callback, `setImmediate()` is reached first.\n\n---\n\n### The important trap\n\nDo not memorise \"`setTimeout(0)` always runs before `setImmediate()`\". Do not memorise the reverse either. At the top level:\n\n```javascript\nsetTimeout(() => console.log(\"timeout\"), 0);\nsetImmediate(() => console.log(\"immediate\"));\n```\n\nthe order can vary depending on how Node reaches the event loop. Inside an I/O callback you can rely on `immediate` then `timeout`.\n\n---\n\n### `process.nextTick()` can starve the event loop\n\nBecause `nextTick()` has such high priority, recursively scheduling it prevents the loop from reaching timers and I/O.\n\n```javascript\nfunction runForever() {\n  process.nextTick(runForever);\n}\n\nrunForever();\n\nsetTimeout(() => {\n  console.log(\"This may never run\");\n}, 0);\n```\n\n```text\nnextTick\n   ↓\nnextTick\n   ↓\nnextTick\n   ↓\n...\n```\n\nThis is <b>event loop starvation</b>. So although `process.nextTick()` is powerful, it is not a general-purpose \"run this later\" mechanism.\n\n---\n\n### Comparison\n\n```text\n                      nextTick()        setImmediate()   setTimeout(fn, 0)\nRuns                  after current op  check phase      timers phase\nPriority              very high         event loop       event loop\nI/O relationship      before continuing after poll/I/O   timers phase\nRuns immediately?     no                no               no\nTypical use           defer to end      run after I/O    delay work\nCan starve the loop?  yes               much less likely no\nAvailable in browser? no, Node only     no, Node only    yes\n```\n\n---\n\n### Interview mental model\n\nGiven:\n\n```javascript\nconsole.log(\"A\");\nprocess.nextTick(() => console.log(\"B\"));\nPromise.resolve().then(() => console.log(\"C\"));\nsetTimeout(() => console.log(\"D\"), 0);\nsetImmediate(() => console.log(\"E\"));\nconsole.log(\"F\");\n```\n\nthink:\n\n```text\n        Synchronous\n             ↓\n          A → F\n             ↓\n       process.nextTick\n             ↓\n             B\n             ↓\n       Promise microtask\n             ↓\n             C\n             ↓\n       Event loop phases\n          ↙       ↘\n      timers      check\n        D           E\n```\n\nThe key rule: <b>sync → nextTick → Promise microtasks → event loop phases</b>. But `setTimeout(0)` versus `setImmediate()` is not universally ordered; inside an I/O callback, `setImmediate()` wins.",
        np: "Node ले पछि काम schedule गर्ने धेरै तरिका दिन्छ, तर <b>`process.nextTick()`</b>, <b>`setImmediate()`</b> र <b>`setTimeout(fn, 0)`</b> को अर्थ एउटै होइन।\n\nसजिलो सम्झने तरिका:\n\n```text\nCurrent synchronous code\n        ↓\nprocess.nextTick()\n        ↓\nPromise microtasks\n        ↓\nEvent loop phases\n   ├── setTimeout()\n   └── setImmediate()\n```\n\nमहत्वपूर्ण भिन्नता हो: <b>हरेक callback कहिले चल्न योग्य बन्छ</b>।\n\n---\n\n### `process.nextTick()`\n\nयसले callback लाई <b>वर्तमान synchronous operation सकिएपछि, तर Node event loop मा अघि बढ्नुअघि</b> चलाउने schedule गर्छ।\n\n```javascript\nconsole.log(\"start\");\n\nprocess.nextTick(() => {\n  console.log(\"nextTick\");\n});\n\nconsole.log(\"end\");\n```\n\nOutput:\n\n```text\nstart\nend\nnextTick\n```\n\nयसलाई यसरी सोच्नुहोस्: \"अहिले गरिरहेको काम सक्नुहोस्, अनि अघि बढ्नुअघि मलाई चलाउनुहोस्।\" यसको प्राथमिकता अत्यन्त उच्च छ।\n\n---\n\n### `setImmediate()`\n\nयसले callback लाई <b>check phase</b> का लागि schedule गर्छ।\n\n```javascript\nconsole.log(\"start\");\n\nsetImmediate(() => {\n  console.log(\"immediate\");\n});\n\nconsole.log(\"end\");\n```\n\nOutput:\n\n```text\nstart\nend\nimmediate\n```\n\nसबैभन्दा महत्वपूर्ण प्रयोग <b>I/O callback पछि</b> केही schedule गर्नु हो:\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"file.txt\", () => {\n  setImmediate(() => {\n    console.log(\"immediate\");\n  });\n});\n```\n\nI/O callback भित्र, त्यहीँ schedule गरिएको `setTimeout(fn, 0)` भन्दा `setImmediate()` पहिले चल्ने ग्यारेन्टी हुन्छ।\n\n---\n\n### `setTimeout(fn, 0)`\n\n`0` भए पनि यसको अर्थ \"तुरुन्तै चलाऊ\" <b>होइन</b>। यसले callback लाई <b>timers phase</b> का लागि schedule गर्छ। `0` को अर्थ मोटामोटी \"timer योग्य हुनासाथ चलाऊ\" हो, र यसले अझै वर्तमान synchronous काम र event loop scheduling कुर्छ।\n\n```javascript\nconsole.log(\"start\");\n\nsetTimeout(() => {\n  console.log(\"timeout\");\n}, 0);\n\nconsole.log(\"end\");\n```\n\nOutput:\n\n```text\nstart\nend\ntimeout\n```\n\n---\n\n### 1. आधारभूत — `nextTick` vs `setTimeout`\n\n```javascript\nconsole.log(\"1\");\n\nprocess.nextTick(() => {\n  console.log(\"2\");\n});\n\nsetTimeout(() => {\n  console.log(\"3\");\n}, 0);\n\nconsole.log(\"4\");\n```\n\nOutput:\n\n```text\n1\n4\n2\n3\n```\n\n```text\n1 → synchronous\n4 → synchronous\n2 → nextTick\n3 → timer\n```\n\nSynchronous code पहिले सकिन्छ, अनि Node ले event loop मा जानुअघि `nextTick()` process गर्छ।\n\n---\n\n### 2. मध्यम — `nextTick` vs Promise vs timer\n\n```javascript\nconsole.log(\"start\");\n\nprocess.nextTick(() => {\n  console.log(\"nextTick\");\n});\n\nPromise.resolve().then(() => {\n  console.log(\"promise\");\n});\n\nsetTimeout(() => {\n  console.log(\"timeout\");\n}, 0);\n\nsetImmediate(() => {\n  console.log(\"immediate\");\n});\n\nconsole.log(\"end\");\n```\n\nग्यारेन्टी भएको भाग:\n\n```text\nstart\nend\nnextTick\npromise\n```\n\nत्यसपछि `timeout` र `immediate` को क्रम code कहाँ चल्छ त्यसमा भर पर्छ। <b>Top level</b> मा तिनको क्रममा भरोसा गर्नु हुँदैन।\n\n---\n\n### 3. उन्नत — I/O भित्र `setImmediate()` vs `setTimeout()`\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"file.txt\", () => {\n  setTimeout(() => {\n    console.log(\"timeout\");\n  }, 0);\n\n  setImmediate(() => {\n    console.log(\"immediate\");\n  });\n});\n```\n\nOutput:\n\n```text\nimmediate\ntimeout\n```\n\n```text\nfs.readFile()\n     │\n     ▼\n  Poll phase\n     │\n     ▼\nI/O callback executes\n     │\n     ├── setTimeout()   → Timers phase\n     │\n     └── setImmediate() → Check phase\n                              ↑\n                         next phase\n```\n\nI/O callback <b>poll</b> phase मा चल्छ, र Node सिधै <b>check</b> phase मा जान्छ। त्यसैले I/O callback भित्र `setImmediate()` पहिले पुगिन्छ।\n\n---\n\n### महत्वपूर्ण जाल\n\n\"`setTimeout(0)` सधैं `setImmediate()` अघि चल्छ\" भनी नरट्नुहोस्। उल्टो पनि नरट्नुहोस्। Top level मा:\n\n```javascript\nsetTimeout(() => console.log(\"timeout\"), 0);\nsetImmediate(() => console.log(\"immediate\"));\n```\n\nNode event loop मा कसरी पुग्छ त्यसअनुसार क्रम फरक हुन सक्छ। I/O callback भित्र भने `immediate` अनि `timeout` मा भरोसा गर्न सकिन्छ।\n\n---\n\n### `process.nextTick()` ले event loop भोकाउन सक्छ\n\n`nextTick()` को प्राथमिकता यति उच्च भएकाले, यसलाई recursive रूपमा schedule गर्दा loop timer र I/O सम्म पुग्नै पाउँदैन।\n\n```javascript\nfunction runForever() {\n  process.nextTick(runForever);\n}\n\nrunForever();\n\nsetTimeout(() => {\n  console.log(\"This may never run\");\n}, 0);\n```\n\n```text\nnextTick\n   ↓\nnextTick\n   ↓\nnextTick\n   ↓\n...\n```\n\nयसलाई <b>event loop starvation</b> भनिन्छ। त्यसैले `process.nextTick()` शक्तिशाली भए पनि सामान्य \"पछि चलाऊ\" संयन्त्र होइन।\n\n---\n\n### तुलना\n\n```text\n                      nextTick()        setImmediate()   setTimeout(fn, 0)\nकहिले चल्छ            वर्तमान op पछि    check phase      timers phase\nप्राथमिकता            धेरै उच्च          event loop       event loop\nI/O सम्बन्ध           अघि बढ्नुअघि      poll/I/O पछि     timers phase\nतुरुन्तै चल्छ?         चल्दैन            चल्दैन           चल्दैन\nसामान्य प्रयोग        अन्त्यमा सार्न     I/O पछि चलाउन    काम ढिलो गर्न\nLoop भोकाउँछ?         सक्छ              सम्भावना कम      गर्दैन\nBrowser मा छ?         छैन, Node मात्र   छैन, Node मात्र  छ\n```\n\n---\n\n### Interview mental model\n\nदिइएको:\n\n```javascript\nconsole.log(\"A\");\nprocess.nextTick(() => console.log(\"B\"));\nPromise.resolve().then(() => console.log(\"C\"));\nsetTimeout(() => console.log(\"D\"), 0);\nsetImmediate(() => console.log(\"E\"));\nconsole.log(\"F\");\n```\n\nयसरी सोच्नुहोस्:\n\n```text\n        Synchronous\n             ↓\n          A → F\n             ↓\n       process.nextTick\n             ↓\n             B\n             ↓\n       Promise microtask\n             ↓\n             C\n             ↓\n       Event loop phases\n          ↙       ↘\n      timers      check\n        D           E\n```\n\nमुख्य नियम: <b>sync → nextTick → Promise microtask → event loop phase</b>। तर `setTimeout(0)` र `setImmediate()` को क्रम सर्वत्र निश्चित छैन; I/O callback भित्र `setImmediate()` जित्छ।",
        jp: "Nodeには後で処理を走らせる手段がいくつもありますが、<b>`process.nextTick()`</b>・<b>`setImmediate()`</b>・<b>`setTimeout(fn, 0)`</b> は同じ意味ではありません。\n\n覚えやすい並びはこうです:\n\n```text\nCurrent synchronous code\n        ↓\nprocess.nextTick()\n        ↓\nPromise microtasks\n        ↓\nEvent loop phases\n   ├── setTimeout()\n   └── setImmediate()\n```\n\n肝心なのは<b>それぞれのコールバックがいつ実行可能になるか</b>です。\n\n---\n\n### `process.nextTick()`\n\n<b>現在の同期処理が終わった直後、Nodeがイベントループへ進む前</b>にコールバックを走らせます。\n\n```javascript\nconsole.log(\"start\");\n\nprocess.nextTick(() => {\n  console.log(\"nextTick\");\n});\n\nconsole.log(\"end\");\n```\n\n出力:\n\n```text\nstart\nend\nnextTick\n```\n\n「今やっていることを終えたら、次へ進む前に私を実行して」というイメージで、優先度は極めて高いです。\n\n---\n\n### `setImmediate()`\n\nコールバックを<b>checkフェーズ</b>に予約します。\n\n```javascript\nconsole.log(\"start\");\n\nsetImmediate(() => {\n  console.log(\"immediate\");\n});\n\nconsole.log(\"end\");\n```\n\n出力:\n\n```text\nstart\nend\nimmediate\n```\n\n最も重要な用途は<b>I/Oコールバックの後</b>に何かを走らせることです:\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"file.txt\", () => {\n  setImmediate(() => {\n    console.log(\"immediate\");\n  });\n});\n```\n\nI/Oコールバックの中では、そこで予約した `setTimeout(fn, 0)` より `setImmediate()` が先に走ることが保証されます。\n\n---\n\n### `setTimeout(fn, 0)`\n\n`0` でも「即座に実行」では<b>ありません</b>。コールバックを<b>timersフェーズ</b>に予約します。`0` はおおよそ「タイマーが有効になり次第実行する」であり、現在の同期処理とイベントループのスケジューリングを待ちます。\n\n```javascript\nconsole.log(\"start\");\n\nsetTimeout(() => {\n  console.log(\"timeout\");\n}, 0);\n\nconsole.log(\"end\");\n```\n\n出力:\n\n```text\nstart\nend\ntimeout\n```\n\n---\n\n### 1. 基本 — `nextTick` と `setTimeout`\n\n```javascript\nconsole.log(\"1\");\n\nprocess.nextTick(() => {\n  console.log(\"2\");\n});\n\nsetTimeout(() => {\n  console.log(\"3\");\n}, 0);\n\nconsole.log(\"4\");\n```\n\n出力:\n\n```text\n1\n4\n2\n3\n```\n\n```text\n1 → synchronous\n4 → synchronous\n2 → nextTick\n3 → timer\n```\n\n同期コードが先に終わり、Nodeはイベントループへ進む前に `nextTick()` を処理します。\n\n---\n\n### 2. 中級 — `nextTick`・Promise・タイマー\n\n```javascript\nconsole.log(\"start\");\n\nprocess.nextTick(() => {\n  console.log(\"nextTick\");\n});\n\nPromise.resolve().then(() => {\n  console.log(\"promise\");\n});\n\nsetTimeout(() => {\n  console.log(\"timeout\");\n}, 0);\n\nsetImmediate(() => {\n  console.log(\"immediate\");\n});\n\nconsole.log(\"end\");\n```\n\n保証される順序はここまでです:\n\n```text\nstart\nend\nnextTick\npromise\n```\n\nその先の `timeout` と `immediate` は、コードがどこで実行されるかによります。<b>トップレベル</b>では相対順序を当てにしないでください。\n\n---\n\n### 3. 上級 — I/O内での `setImmediate()` と `setTimeout()`\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"file.txt\", () => {\n  setTimeout(() => {\n    console.log(\"timeout\");\n  }, 0);\n\n  setImmediate(() => {\n    console.log(\"immediate\");\n  });\n});\n```\n\n出力:\n\n```text\nimmediate\ntimeout\n```\n\n```text\nfs.readFile()\n     │\n     ▼\n  Poll phase\n     │\n     ▼\nI/O callback executes\n     │\n     ├── setTimeout()   → Timers phase\n     │\n     └── setImmediate() → Check phase\n                              ↑\n                         next phase\n```\n\nI/Oコールバックは<b>poll</b>フェーズで走り、Nodeはそのまま<b>check</b>フェーズへ進むからです。\n\n---\n\n### 重要な罠\n\n「`setTimeout(0)` は必ず `setImmediate()` より先」と暗記しないでください。逆も同じです。トップレベルでは:\n\n```javascript\nsetTimeout(() => console.log(\"timeout\"), 0);\nsetImmediate(() => console.log(\"immediate\"));\n```\n\nNodeがイベントループに到達する速さで順序が変わります。I/Oコールバックの中でだけ `immediate` → `timeout` を当てにできます。\n\n---\n\n### `process.nextTick()` はイベントループを飢えさせる\n\n優先度が非常に高いため、再帰的に予約するとループがタイマーやI/Oに到達できません。\n\n```javascript\nfunction runForever() {\n  process.nextTick(runForever);\n}\n\nrunForever();\n\nsetTimeout(() => {\n  console.log(\"This may never run\");\n}, 0);\n```\n\n```text\nnextTick\n   ↓\nnextTick\n   ↓\nnextTick\n   ↓\n...\n```\n\nこれが<b>イベントループの飢餓</b>です。強力な機能ですが、汎用の「あとで実行」には使わないでください。\n\n---\n\n### 比較\n\n```text\n                      nextTick()        setImmediate()   setTimeout(fn, 0)\n実行タイミング        現在の処理の後    checkフェーズ    timersフェーズ\n優先度                非常に高い        イベントループ   イベントループ\nI/Oとの関係           進む前            poll/I/Oの後     timersフェーズ\n即座に実行?           しない            しない           しない\n主な用途              末尾へ先送り      I/Oの後に実行    処理を遅らせる\nループを飢えさせる?   ありうる          可能性は低い     ない\nブラウザにある?       Node専用          Node専用         ある\n```\n\n---\n\n### 面接用の考え方\n\n次のコードなら:\n\n```javascript\nconsole.log(\"A\");\nprocess.nextTick(() => console.log(\"B\"));\nPromise.resolve().then(() => console.log(\"C\"));\nsetTimeout(() => console.log(\"D\"), 0);\nsetImmediate(() => console.log(\"E\"));\nconsole.log(\"F\");\n```\n\nこう考えます:\n\n```text\n        Synchronous\n             ↓\n          A → F\n             ↓\n       process.nextTick\n             ↓\n             B\n             ↓\n       Promise microtask\n             ↓\n             C\n             ↓\n       Event loop phases\n          ↙       ↘\n      timers      check\n        D           E\n```\n\n鍵となる規則は <b>同期 → nextTick → Promiseマイクロタスク → イベントループのフェーズ</b>。ただし `setTimeout(0)` と `setImmediate()` の順序は普遍ではなく、I/Oコールバック内では `setImmediate()` が勝ちます。",
      },
      diagram: `                 Node.js
                    │
                    ▼
          Current synchronous code
                    │
                    ▼
          process.nextTick queue
                    │
                    ▼
           Promise microtasks
                    │
                    ▼
             Event Loop
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
   Timers phase             Check phase
        │                       │
        ▼                       ▼
 setTimeout(...)          setImmediate(...)


Top level                      Inside an I/O callback

setTimeout(fn, 0)              Poll
setImmediate(fn)                │ fs.readFile callback
      │                         ▼
      ▼                       Check
 order can vary                 │ setImmediate runs
                                ▼
                              Timers
                                │ setTimeout runs`,
      codeExample: {
        title: { en: "Three ways to say later", np: "\"पछि\" भन्ने तीन तरिका", jp: "「あとで」の三通りの言い方" },
        code: `// ── 1. Basic — nextTick jumps ahead of the timer ──────────────────
console.log("1");

process.nextTick(() => console.log("2"));
setTimeout(() => console.log("3"), 0);

console.log("4");
// 1, 4, 2, 3

// ── 2. Intermediate — the guaranteed prefix of the ordering ───────
console.log("start");

process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));

console.log("end");
// start, end, nextTick, promise, then timeout/immediate in either order

// ── 3. Advanced — inside I/O, setImmediate is reliable ────────────
const fs = require("fs");

fs.readFile("file.txt", () => {
  setTimeout(() => console.log("timeout"), 0); // timers, next iteration
  setImmediate(() => console.log("immediate")); // check, right after poll
});
// immediate, then timeout

// ── Starving the loop with recursive nextTick ─────────────────────
function runForever() {
  process.nextTick(runForever); // the loop never reaches timers or I/O
}

// runForever();
// setTimeout(() => console.log("this may never run"), 0);`,
      },
      keyTakeaways: [
        { en: "`process.nextTick()` runs <b>after the current operation, before the event loop continues</b>.", np: "`process.nextTick()` <b>वर्तमान operation पछि, event loop अघि बढ्नुअघि</b> चल्छ।", jp: "`process.nextTick()` は<b>現在の処理の後、イベントループが進む前</b>に走る。" },
        { en: "`setImmediate()` runs in the <b>check</b> phase, right after poll.", np: "`setImmediate()` <b>check</b> phase मा, poll पछि तुरुन्तै चल्छ।", jp: "`setImmediate()` はpollの直後の<b>check</b>フェーズで走る。" },
        { en: "`setTimeout(fn, 0)` runs in the <b>timers</b> phase and never means \"immediately\".", np: "`setTimeout(fn, 0)` <b>timers</b> phase मा चल्छ र यसको अर्थ कहिल्यै \"तुरुन्तै\" होइन।", jp: "`setTimeout(fn, 0)` は<b>timers</b>フェーズで走り、「即座」を意味することはない。" },
        { en: "Node drains the `nextTick` queue <b>before</b> Promise microtasks.", np: "Node ले `nextTick` queue Promise microtask <b>अघि</b> खाली गर्छ।", jp: "Nodeは `nextTick` のキューをPromiseのマイクロタスクより<b>先に</b>空にする。" },
        { en: "At the top level, `setTimeout(0)` versus `setImmediate()` ordering is <b>not guaranteed</b>.", np: "Top level मा, `setTimeout(0)` र `setImmediate()` को क्रम <b>ग्यारेन्टी छैन</b>।", jp: "トップレベルでは `setTimeout(0)` と `setImmediate()` の順序は<b>保証されない</b>。" },
        { en: "Inside an I/O callback, `setImmediate()` reliably runs first.", np: "I/O callback भित्र, `setImmediate()` भरपर्दो रूपमा पहिले चल्छ।", jp: "I/Oコールバックの中では `setImmediate()` が確実に先に走る。" },
        { en: "Recursive `process.nextTick()` causes <b>event loop starvation</b>; use `setImmediate()` to yield.", np: "Recursive `process.nextTick()` ले <b>event loop starvation</b> गराउँछ; yield गर्न `setImmediate()` प्रयोग गर्नुहोस्।", jp: "再帰的な `process.nextTick()` は<b>イベントループの飢餓</b>を招く。譲るには `setImmediate()` を使う。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking `setTimeout(fn, 0)` means immediately</b> — it only means the callback becomes eligible during the timers phase.", np: "<b>`setTimeout(fn, 0)` को अर्थ तुरुन्तै हो भन्ने ठान्नु</b> — यसको अर्थ callback timers phase मा चल्न योग्य बन्छ भन्ने मात्र हो।", jp: "<b>`setTimeout(fn, 0)` が即座だと思う</b> — timersフェーズで実行可能になる、という意味しかない。" },
        { en: "<b>Treating `nextTick()` as a Promise microtask</b> — both are high priority, but Node drains the `nextTick` queue first.", np: "<b>`nextTick()` लाई Promise microtask ठान्नु</b> — दुबैको प्राथमिकता उच्च छ, तर Node ले `nextTick` queue पहिले खाली गर्छ।", jp: "<b>`nextTick()` をPromiseのマイクロタスクと同一視する</b> — どちらも高優先だが、Nodeは `nextTick` のキューを先に処理する。" },
        { en: "<b>Assuming `setImmediate()` always beats `setTimeout(0)`</b> — that holds inside an I/O callback, not at the top level.", np: "<b>`setImmediate()` सधैं `setTimeout(0)` लाई जित्छ भन्ने ठान्नु</b> — यो I/O callback भित्र लागू हुन्छ, top level मा होइन।", jp: "<b>`setImmediate()` が必ず `setTimeout(0)` に勝つと思う</b> — それはI/Oコールバック内での話で、トップレベルでは違う。" },
        { en: "<b>Using recursive `nextTick()` carelessly</b> — `function loop() { process.nextTick(loop); }` starves timers, I/O and promise work.", np: "<b>लापरबाहीसँग recursive `nextTick()` प्रयोग गर्नु</b> — `function loop() { process.nextTick(loop); }` ले timer, I/O र promise काम भोकाउँछ।", jp: "<b>再帰的な `nextTick()` を不用意に使う</b> — `function loop() { process.nextTick(loop); }` はタイマー・I/O・Promiseの処理を飢えさせる。" },
      ],
      quiz: [
        {
          question: { en: "Which runs first after the current synchronous operation, given `setTimeout(() => console.log(\"A\"), 0);` and `process.nextTick(() => console.log(\"B\"));`?", np: "`setTimeout(() => console.log(\"A\"), 0);` र `process.nextTick(() => console.log(\"B\"));` भएमा वर्तमान synchronous operation पछि कुन पहिले चल्छ?", jp: "`setTimeout(() => console.log(\"A\"), 0);` と `process.nextTick(() => console.log(\"B\"));` があるとき、現在の同期処理の後に先に走るのは?" },
          options: [
            { en: "`A`", np: "`A`", jp: "`A`" },
            { en: "`B`", np: "`B`", jp: "`B`" },
            { en: "Random", np: "अनिश्चित", jp: "ランダム" },
            { en: "Both at once", np: "दुबै सँगै", jp: "同時に両方" },
          ],
          correctIndex: 1,
          explanation: { en: "The nextTick queue is drained before the loop reaches the timers phase.", np: "Loop timers phase मा पुग्नुअघि nextTick queue खाली हुन्छ।", jp: "ループがtimersフェーズに達する前にnextTickのキューが空にされる。" },
        },
        {
          question: { en: "Which event loop phase executes `setImmediate()`?", np: "कुन event loop phase ले `setImmediate()` चलाउँछ?", jp: "`setImmediate()` を実行するのはどのフェーズか?" },
          options: [
            { en: "Timers", np: "Timers", jp: "Timers" },
            { en: "Poll", np: "Poll", jp: "Poll" },
            { en: "Check", np: "Check", jp: "Check" },
            { en: "Close", np: "Close", jp: "Close" },
          ],
          correctIndex: 2,
          explanation: { en: "Check follows poll, which is why it wins inside I/O callbacks.", np: "Check poll पछि आउँछ, त्यसैले I/O callback भित्र यो जित्छ।", jp: "checkはpollの次なので、I/Oコールバック内では先に走る。" },
        },
        {
          question: { en: "Inside an I/O callback, which of `setTimeout(fn, 0)` and `setImmediate(fn)` normally runs first?", np: "I/O callback भित्र, `setTimeout(fn, 0)` र `setImmediate(fn)` मध्ये कुन सामान्यतया पहिले चल्छ?", jp: "I/Oコールバックの中では `setTimeout(fn, 0)` と `setImmediate(fn)` のどちらが通常先に走るか?" },
          options: [
            { en: "`setTimeout`", np: "`setTimeout`", jp: "`setTimeout`" },
            { en: "Both at once", np: "दुबै सँगै", jp: "同時に両方" },
            { en: "Random", np: "अनिश्चित", jp: "ランダム" },
            { en: "`setImmediate`", np: "`setImmediate`", jp: "`setImmediate`" },
          ],
          correctIndex: 3,
          explanation: { en: "The poll phase is immediately followed by the check phase.", np: "Poll phase पछि तुरुन्तै check phase आउँछ।", jp: "pollフェーズの直後がcheckフェーズだから。" },
        },
        {
          question: { en: "What is the major danger of recursively calling `process.nextTick()`?", np: "`process.nextTick()` लाई recursive रूपमा बोलाउँदाको मुख्य खतरा के हो?", jp: "`process.nextTick()` を再帰的に呼ぶ主な危険は?" },
          options: [
            { en: "Event loop starvation", np: "Event loop starvation", jp: "イベントループの飢餓" },
            { en: "Memory leaks only", np: "मेमोरी leak मात्र", jp: "メモリリークだけ" },
            { en: "A syntax error", np: "Syntax error", jp: "構文エラー" },
            { en: "It converts callbacks into Promises", np: "यसले callback लाई Promise बनाउँछ", jp: "コールバックがPromiseに変換される" },
          ],
          correctIndex: 0,
          explanation: { en: "The queue must fully drain, so timers and I/O never get a turn.", np: "Queue पूरै खाली हुनुपर्ने भएकाले timer र I/O ले पालो पाउँदैनन्।", jp: "キューを完全に空にする必要があるため、タイマーやI/Oの番が来ない。" },
        },
        {
          question: { en: "At the top level, what is the order of `setTimeout(fn, 0)` and `setImmediate(fn)`?", np: "Top level मा, `setTimeout(fn, 0)` र `setImmediate(fn)` को क्रम के हो?", jp: "トップレベルでの `setTimeout(fn, 0)` と `setImmediate(fn)` の順序は?" },
          options: [
            { en: "`setTimeout` always first", np: "`setTimeout` सधैं पहिले", jp: "常に `setTimeout` が先" },
            { en: "Not guaranteed, it can vary", np: "ग्यारेन्टी छैन, फरक हुन सक्छ", jp: "保証されず、変わりうる" },
            { en: "`setImmediate` always first", np: "`setImmediate` सधैं पहिले", jp: "常に `setImmediate` が先" },
          ],
          correctIndex: 1,
          explanation: { en: "It depends on how quickly Node reaches the first loop iteration.", np: "Node पहिलो loop iteration मा कति छिटो पुग्छ त्यसमा भर पर्छ।", jp: "Nodeが最初の反復にどれだけ早く到達するかによる。" },
        },
      ],
      youtubeIds: ["T1NQWLVCA5c", "jDTw11pApkY", "nqsPmuicJJc"],
    },
    {
      id: "async-ordering-pitfalls",
      title: { en: "Common Async Ordering Pitfalls", np: "Common Async Ordering Pitfalls", jp: "よくある非同期順序の落とし穴" },
      durationMinutes: 9,
      explanation: {
        en: "Asynchronous JavaScript gets hard when several scheduling mechanisms interact. The biggest Node pitfalls involve <b>`process.nextTick()`</b>, <b>`setImmediate()`</b>, <b>`setTimeout()`</b> and <b>synchronous errors</b>.\n\nThe most dangerous mistake is an endless `process.nextTick()` loop. Node must drain the `nextTick` queue before continuing with the event loop, so repeatedly adding another `nextTick()` can prevent timers, I/O and Promise callbacks from ever getting a turn.\n\n```text\nEvent Loop\n   │\n   ├── process.nextTick()\n   │       ↓\n   │   nextTick()\n   │       ↓\n   │   nextTick()\n   │       ↓\n   │      ...\n   │\n   └── Event loop never gets here\n```\n\nUnlike normal recursion, this does not grow the JavaScript call stack. The danger is <b>event loop starvation</b>, not a stack overflow.\n\n---\n\n### 1. Basic — `nextTick()` starvation\n\n```javascript\nfunction keepRunning() {\n  process.nextTick(keepRunning);\n}\n\nkeepRunning();\n\nsetTimeout(() => {\n  console.log(\"Timer fired\");\n}, 0);\n```\n\nYou might expect `Timer fired`, but that callback never gets a chance:\n\n```text\nnextTick()\n   ↓\nnextTick()\n   ↓\nnextTick()\n   ↓\n...\n```\n\nNode keeps draining the `nextTick` queue and never advances to the timers phase. In production, timers, I/O callbacks and Promise microtasks can be delayed indefinitely.\n\n---\n\n### 2. Intermediate — use `setImmediate()` when repeatedly yielding\n\nSuppose you need to perform work repeatedly without blocking I/O.\n\nDangerous:\n\n```javascript\nfunction processWork() {\n  doSomeWork();\n\n  process.nextTick(processWork);\n}\n\nprocessWork();\n```\n\nSafer:\n\n```javascript\nfunction processWork() {\n  doSomeWork();\n\n  setImmediate(processWork);\n}\n\nprocessWork();\n```\n\nNow the loop gets opportunities to process other work between iterations:\n\n```text\ndoSomeWork()\n     ↓\nsetImmediate()\n     ↓\nEvent loop\n     ↓\nI/O / timers / other work\n     ↓\nsetImmediate()\n     ↓\ndoSomeWork()\n```\n\nThe key idea: <b>`setImmediate()` gives the event loop a chance to progress.</b>\n\n---\n\n### 3. Advanced — `setImmediate()` vs `setTimeout(0)`\n\nDo not assume this always prints one order:\n\n```javascript\nsetTimeout(() => {\n  console.log(\"timeout\");\n}, 0);\n\nsetImmediate(() => {\n  console.log(\"immediate\");\n});\n```\n\nAt the <b>top level</b>, the ordering can be nondeterministic. But inside an I/O callback:\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"file.txt\", () => {\n  setTimeout(() => {\n    console.log(\"timeout\");\n  }, 0);\n\n  setImmediate(() => {\n    console.log(\"immediate\");\n  });\n});\n```\n\nthe ordering is `immediate` then `timeout`, because the I/O callback runs during the <b>poll</b> phase, followed by the <b>check</b> phase:\n\n```text\nPoll\n │\n │ fs.readFile callback\n │\n ▼\nCheck\n │\n └── setImmediate()\n │\n ▼\nTimers\n │\n └── setTimeout()\n```\n\n---\n\n### Synchronous throws are different\n\nOne of the easiest async mistakes is assuming a Promise's `.catch()` will catch <b>every</b> error. A synchronous exception happens immediately.\n\n```javascript\nfunction validateUser(user) {\n  if (!user.name) {\n    throw new Error(\"Name is required\");\n  }\n}\n\nsetTimeout(() => {\n  console.log(\"Timer\");\n}, 0);\n\nvalidateUser({});\n```\n\n```text\nvalidateUser()\n      │\n      ▼\n    throw\n      │\n      X\nProgram flow stops\n```\n\nThe timer does not somehow catch that error.\n\n---\n\n### Promise error vs synchronous error\n\n```javascript\nasync function example() {\n  throw new Error(\"Something went wrong\");\n}\n\nexample().catch(error => {\n  console.log(\"Caught:\", error.message);\n});\n```\n\nBecause the error occurs inside an `async` function, the returned Promise becomes rejected. But this does <b>not</b> work:\n\n```javascript\nfunction example() {\n  throw new Error(\"Something went wrong\");\n}\n\nexample().catch(() => {\n  console.log(\"Caught\");\n});\n```\n\nThe function throws <b>before</b> it returns a Promise, so there is nothing to call `.catch()` on. If synchronous code can throw, handle it synchronously:\n\n```javascript\ntry {\n  example();\n} catch (error) {\n  console.log(\"Caught:\", error.message);\n}\n```\n\n---\n\n### Trap 5 — call stack recursion vs `nextTick()` recursion\n\nNormal recursion overflows the stack because every call adds a frame:\n\n```text\nrecurse()\n   ↓\nrecurse()\n   ↓\nrecurse()\n   ↓\nSTACK OVERFLOW\n```\n\n`nextTick()` recursion is different. Each callback is scheduled for later rather than nesting on the current stack, so the failure mode is starvation, not overflow.\n\n---\n\n### Production mental model\n\nWhen debugging Node async ordering, ask in order:\n\n```text\n1. Is this synchronous code?\n        ↓\n2. Is there a synchronous throw?\n        ↓\n3. Is it process.nextTick()?\n        ↓\n4. Is it a Promise microtask?\n        ↓\n5. Which event loop phase handles it?\n        ↓\n6. Is it timers, poll, check, or close?\n```\n\nAnd remember the spine:\n\n```text\nSynchronous code\n       ↓\nprocess.nextTick()\n       ↓\nPromise microtasks\n       ↓\nEvent loop phases\n       ↓\ntimers / poll / check / ...\n```",
        np: "धेरै scheduling संयन्त्र सँगै आउँदा asynchronous JavaScript कठिन बन्छ। Node का सबैभन्दा ठूला pitfall <b>`process.nextTick()`</b>, <b>`setImmediate()`</b>, <b>`setTimeout()`</b> र <b>synchronous error</b> सँग जोडिन्छन्।\n\nसबैभन्दा खतरनाक गल्ती अनन्त `process.nextTick()` loop हो। Node ले event loop अघि बढाउनुअघि `nextTick` queue खाली गर्नैपर्छ, त्यसैले बारम्बार अर्को `nextTick()` थप्दा timer, I/O र Promise callback ले कहिल्यै पालो नपाउन सक्छन्।\n\n```text\nEvent Loop\n   │\n   ├── process.nextTick()\n   │       ↓\n   │   nextTick()\n   │       ↓\n   │   nextTick()\n   │       ↓\n   │      ...\n   │\n   └── Event loop never gets here\n```\n\nसामान्य recursion भन्दा फरक, यसले JavaScript call stack बढाउँदैन। खतरा <b>event loop starvation</b> हो, stack overflow होइन।\n\n---\n\n### 1. आधारभूत — `nextTick()` starvation\n\n```javascript\nfunction keepRunning() {\n  process.nextTick(keepRunning);\n}\n\nkeepRunning();\n\nsetTimeout(() => {\n  console.log(\"Timer fired\");\n}, 0);\n```\n\nतपाईं `Timer fired` अपेक्षा गर्नुहोला, तर त्यो callback ले कहिल्यै मौका पाउँदैन:\n\n```text\nnextTick()\n   ↓\nnextTick()\n   ↓\nnextTick()\n   ↓\n...\n```\n\nNode ले `nextTick` queue खाली गरिरहन्छ र timers phase सम्म पुग्दैन। Production मा timer, I/O callback र Promise microtask अनिश्चितकालसम्म ढिलो हुन सक्छन्।\n\n---\n\n### 2. मध्यम — बारम्बार yield गर्न `setImmediate()` प्रयोग गर्नुहोस्\n\nI/O नरोकी बारम्बार काम गर्नुपर्ने अवस्थामा।\n\nखतरनाक:\n\n```javascript\nfunction processWork() {\n  doSomeWork();\n\n  process.nextTick(processWork);\n}\n\nprocessWork();\n```\n\nसुरक्षित:\n\n```javascript\nfunction processWork() {\n  doSomeWork();\n\n  setImmediate(processWork);\n}\n\nprocessWork();\n```\n\nअब loop ले iteration बीचमा अरू काम process गर्ने मौका पाउँछ:\n\n```text\ndoSomeWork()\n     ↓\nsetImmediate()\n     ↓\nEvent loop\n     ↓\nI/O / timers / other work\n     ↓\nsetImmediate()\n     ↓\ndoSomeWork()\n```\n\nमुख्य विचार: <b>`setImmediate()` ले event loop लाई अघि बढ्ने मौका दिन्छ।</b>\n\n---\n\n### 3. उन्नत — `setImmediate()` vs `setTimeout(0)`\n\nयसले सधैं एउटै क्रम दिन्छ भन्ने नठान्नुहोस्:\n\n```javascript\nsetTimeout(() => {\n  console.log(\"timeout\");\n}, 0);\n\nsetImmediate(() => {\n  console.log(\"immediate\");\n});\n```\n\n<b>Top level</b> मा क्रम अनिश्चित हुन सक्छ। तर I/O callback भित्र:\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"file.txt\", () => {\n  setTimeout(() => {\n    console.log(\"timeout\");\n  }, 0);\n\n  setImmediate(() => {\n    console.log(\"immediate\");\n  });\n});\n```\n\nक्रम `immediate` अनि `timeout` हुन्छ, किनकि I/O callback <b>poll</b> phase मा चल्छ र त्यसपछि <b>check</b> phase आउँछ:\n\n```text\nPoll\n │\n │ fs.readFile callback\n │\n ▼\nCheck\n │\n └── setImmediate()\n │\n ▼\nTimers\n │\n └── setTimeout()\n```\n\n---\n\n### Synchronous throw फरक हुन्छ\n\nसजिलो async गल्ती हो — Promise को `.catch()` ले <b>हरेक</b> error समात्छ भन्ने ठान्नु। Synchronous exception तुरुन्तै हुन्छ।\n\n```javascript\nfunction validateUser(user) {\n  if (!user.name) {\n    throw new Error(\"Name is required\");\n  }\n}\n\nsetTimeout(() => {\n  console.log(\"Timer\");\n}, 0);\n\nvalidateUser({});\n```\n\n```text\nvalidateUser()\n      │\n      ▼\n    throw\n      │\n      X\nProgram flow stops\n```\n\nTimer ले त्यो error समात्दैन।\n\n---\n\n### Promise error vs synchronous error\n\n```javascript\nasync function example() {\n  throw new Error(\"Something went wrong\");\n}\n\nexample().catch(error => {\n  console.log(\"Caught:\", error.message);\n});\n```\n\nError `async` function भित्र भएकाले, फर्केको Promise reject हुन्छ। तर यो <b>काम गर्दैन</b>:\n\n```javascript\nfunction example() {\n  throw new Error(\"Something went wrong\");\n}\n\nexample().catch(() => {\n  console.log(\"Caught\");\n});\n```\n\nFunction ले Promise फर्काउनु <b>अघि</b> throw गर्छ, त्यसैले `.catch()` बोलाउने केही हुँदैन। Synchronous code ले throw गर्न सक्छ भने, synchronously सम्हाल्नुहोस्:\n\n```javascript\ntry {\n  example();\n} catch (error) {\n  console.log(\"Caught:\", error.message);\n}\n```\n\n---\n\n### Trap 5 — call stack recursion vs `nextTick()` recursion\n\nसामान्य recursion ले stack overflow गराउँछ किनकि हरेक call ले frame थप्छ:\n\n```text\nrecurse()\n   ↓\nrecurse()\n   ↓\nrecurse()\n   ↓\nSTACK OVERFLOW\n```\n\n`nextTick()` recursion फरक छ। हरेक callback वर्तमान stack मा नथपिई पछिका लागि schedule हुन्छ, त्यसैले असफलताको रूप starvation हो, overflow होइन।\n\n---\n\n### Production mental model\n\nNode को async ordering debug गर्दा क्रमैसँग सोध्नुहोस्:\n\n```text\n1. के यो synchronous code हो?\n        ↓\n2. Synchronous throw छ?\n        ↓\n3. यो process.nextTick() हो?\n        ↓\n4. यो Promise microtask हो?\n        ↓\n5. कुन event loop phase ले सम्हाल्छ?\n        ↓\n6. Timers, poll, check, कि close?\n```\n\nर मेरुदण्ड सम्झनुहोस्:\n\n```text\nSynchronous code\n       ↓\nprocess.nextTick()\n       ↓\nPromise microtasks\n       ↓\nEvent loop phases\n       ↓\ntimers / poll / check / ...\n```",
        jp: "複数のスケジューリング機構が絡むと非同期JavaScriptは難しくなります。Nodeの大きな落とし穴は<b>`process.nextTick()`</b>・<b>`setImmediate()`</b>・<b>`setTimeout()`</b>・<b>同期例外</b>に関わります。\n\n最も危険なのは終わらない `process.nextTick()` ループです。Nodeはイベントループを進める前に `nextTick` のキューを空にしなければならないため、`nextTick()` を積み続けるとタイマー・I/O・Promiseのコールバックに永遠に順番が来ません。\n\n```text\nEvent Loop\n   │\n   ├── process.nextTick()\n   │       ↓\n   │   nextTick()\n   │       ↓\n   │   nextTick()\n   │       ↓\n   │      ...\n   │\n   └── Event loop never gets here\n```\n\n通常の再帰と違い、これはコールスタックを伸ばしません。危険なのはスタックオーバーフローではなく<b>イベントループの飢餓</b>です。\n\n---\n\n### 1. 基本 — `nextTick()` による飢餓\n\n```javascript\nfunction keepRunning() {\n  process.nextTick(keepRunning);\n}\n\nkeepRunning();\n\nsetTimeout(() => {\n  console.log(\"Timer fired\");\n}, 0);\n```\n\n`Timer fired` を期待しても、そのコールバックに機会は訪れません:\n\n```text\nnextTick()\n   ↓\nnextTick()\n   ↓\nnextTick()\n   ↓\n...\n```\n\nNodeは `nextTick` のキューを空にし続け、timersフェーズに進めません。本番ではタイマー・I/Oコールバック・Promiseマイクロタスクが無期限に遅れます。\n\n---\n\n### 2. 中級 — 繰り返し譲るなら `setImmediate()`\n\nI/Oを塞がずに処理を繰り返したい場合。\n\n危険:\n\n```javascript\nfunction processWork() {\n  doSomeWork();\n\n  process.nextTick(processWork);\n}\n\nprocessWork();\n```\n\n安全:\n\n```javascript\nfunction processWork() {\n  doSomeWork();\n\n  setImmediate(processWork);\n}\n\nprocessWork();\n```\n\n反復のあいだにループが他の仕事を処理できます:\n\n```text\ndoSomeWork()\n     ↓\nsetImmediate()\n     ↓\nEvent loop\n     ↓\nI/O / timers / other work\n     ↓\nsetImmediate()\n     ↓\ndoSomeWork()\n```\n\n要点は<b>`setImmediate()` はイベントループに進む機会を与える</b>ことです。\n\n---\n\n### 3. 上級 — `setImmediate()` と `setTimeout(0)`\n\n常に同じ順序になると思わないでください:\n\n```javascript\nsetTimeout(() => {\n  console.log(\"timeout\");\n}, 0);\n\nsetImmediate(() => {\n  console.log(\"immediate\");\n});\n```\n\n<b>トップレベル</b>では順序は非決定的になりえます。しかしI/Oコールバックの中では:\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"file.txt\", () => {\n  setTimeout(() => {\n    console.log(\"timeout\");\n  }, 0);\n\n  setImmediate(() => {\n    console.log(\"immediate\");\n  });\n});\n```\n\n`immediate` の次に `timeout` になります。I/Oコールバックは<b>poll</b>フェーズで走り、次が<b>check</b>フェーズだからです:\n\n```text\nPoll\n │\n │ fs.readFile callback\n │\n ▼\nCheck\n │\n └── setImmediate()\n │\n ▼\nTimers\n │\n └── setTimeout()\n```\n\n---\n\n### 同期のthrowは別物\n\nPromiseの `.catch()` が<b>あらゆる</b>エラーを捕まえると思うのは、よくある誤りです。同期例外は即座に起こります。\n\n```javascript\nfunction validateUser(user) {\n  if (!user.name) {\n    throw new Error(\"Name is required\");\n  }\n}\n\nsetTimeout(() => {\n  console.log(\"Timer\");\n}, 0);\n\nvalidateUser({});\n```\n\n```text\nvalidateUser()\n      │\n      ▼\n    throw\n      │\n      X\nProgram flow stops\n```\n\nタイマーがそのエラーを捕まえることはありません。\n\n---\n\n### Promiseのエラーと同期のエラー\n\n```javascript\nasync function example() {\n  throw new Error(\"Something went wrong\");\n}\n\nexample().catch(error => {\n  console.log(\"Caught:\", error.message);\n});\n```\n\n`async` 関数の中で起きたエラーなので、返されたPromiseは拒否されます。しかしこれは<b>動きません</b>:\n\n```javascript\nfunction example() {\n  throw new Error(\"Something went wrong\");\n}\n\nexample().catch(() => {\n  console.log(\"Caught\");\n});\n```\n\n関数はPromiseを返す<b>前に</b>throwするため、`.catch()` を呼ぶ相手が存在しません。同期コードがthrowしうるなら、同期的に処理します:\n\n```javascript\ntry {\n  example();\n} catch (error) {\n  console.log(\"Caught:\", error.message);\n}\n```\n\n---\n\n### 罠5 — コールスタックの再帰と `nextTick()` の再帰\n\n通常の再帰は呼び出しごとにフレームが積まれ、やがてオーバーフローします:\n\n```text\nrecurse()\n   ↓\nrecurse()\n   ↓\nrecurse()\n   ↓\nSTACK OVERFLOW\n```\n\n`nextTick()` の再帰は違います。各コールバックは現在のスタックに積まれるのではなく後回しに予約されるため、壊れ方はオーバーフローではなく飢餓です。\n\n---\n\n### 本番向けの考え方\n\nNodeの非同期順序をデバッグするときは順に問います:\n\n```text\n1. これは同期コードか\n        ↓\n2. 同期のthrowはあるか\n        ↓\n3. process.nextTick()か\n        ↓\n4. Promiseのマイクロタスクか\n        ↓\n5. どのフェーズが扱うか\n        ↓\n6. timers・poll・check・closeのどれか\n```\n\nそして背骨を覚えます:\n\n```text\nSynchronous code\n       ↓\nprocess.nextTick()\n       ↓\nPromise microtasks\n       ↓\nEvent loop phases\n       ↓\ntimers / poll / check / ...\n```",
      },
      diagram: `                 Current operation
                        │
                        ▼
              ┌───────────────────┐
              │  nextTick queue   │
              └─────────┬─────────┘
                        │
                 MUST drain fully
                        │
          ┌─────────────┴─────────────┐
          │                           │
     nextTick again              queue empty
          │                           │
          ▼                           ▼
     nextTick...                Event Loop
          │                           │
          │                  ┌────────┴────────┐
          │                  ▼                 ▼
          │                Poll              Check
          │                  │                 │
          │                  ▼                 ▼
          │                 I/O          setImmediate()
          │
          └─────── starvation ────────────────┘


Synchronous throw never reaches a later .catch()

validateUser()
      │
      ▼
    throw
      │
      X
Program flow stops`,
      codeExample: {
        title: { en: "Starvation, ordering and throws", np: "Starvation, ordering र throw", jp: "飢餓・順序・throw" },
        code: `// ── 1. Basic — the timer never gets a turn ────────────────────────
function keepRunning() {
  process.nextTick(keepRunning); // queue never empties
}

// keepRunning();
// setTimeout(() => console.log("Timer fired"), 0); // starved

// ── 2. Intermediate — yield with setImmediate instead ─────────────
function processWork() {
  doSomeWork();
  setImmediate(processWork); // the loop can serve I/O between rounds
}

// ── 3. Advanced — ordering is only reliable inside I/O ────────────
const fs = require("fs");

fs.readFile("file.txt", () => {
  setTimeout(() => console.log("timeout"), 0);
  setImmediate(() => console.log("immediate"));
});
// immediate, then timeout

// ── A synchronous throw is not a rejected promise ─────────────────
function getData() {
  throw new Error("Boom"); // throws before returning anything
}

// getData().catch(handleError); // never reached

try {
  getData();
} catch (error) {
  console.log("Caught:", error.message);
}

// Make it a promise instead, and .catch() works
async function getDataAsync() {
  throw new Error("Boom"); // becomes a rejected promise
}

getDataAsync().catch(error => console.log("Caught:", error.message));`,
      },
      keyTakeaways: [
        { en: "<b>`process.nextTick()` can starve the event loop</b> if scheduled recursively.", np: "Recursive रूपमा schedule गर्दा <b>`process.nextTick()` ले event loop भोकाउन सक्छ</b>।", jp: "再帰的に予約すると<b>`process.nextTick()` はイベントループを飢えさせる</b>。" },
        { en: "<b>`setImmediate()` yields back to the event loop</b>, so it suits repeated work that must not monopolise execution.", np: "<b>`setImmediate()` ले event loop लाई फर्काउँछ</b>, त्यसैले execution ओगट्न नहुने बारम्बारको कामका लागि उपयुक्त छ।", jp: "<b>`setImmediate()` はイベントループに制御を返す</b>ので、実行を独占してはいけない反復処理に向く。" },
        { en: "`setTimeout(fn, 0)` does <b>not</b> mean immediately.", np: "`setTimeout(fn, 0)` को अर्थ तुरुन्तै <b>होइन</b>।", jp: "`setTimeout(fn, 0)` は即座という意味では<b>ない</b>。" },
        { en: "`setTimeout(0)` versus `setImmediate()` is <b>not deterministic at the top level</b>.", np: "`setTimeout(0)` र `setImmediate()` <b>top level मा निश्चित छैन</b>।", jp: "`setTimeout(0)` と `setImmediate()` は<b>トップレベルでは非決定的</b>。" },
        { en: "Inside an I/O callback, `setImmediate()` runs before `setTimeout(0)`.", np: "I/O callback भित्र, `setImmediate()` `setTimeout(0)` अघि चल्छ।", jp: "I/Oコールバック内では `setImmediate()` が `setTimeout(0)` より先に走る。" },
        { en: "A synchronous `throw` happens immediately and is <b>not</b> caught by a later async `.catch()`.", np: "Synchronous `throw` तुरुन्तै हुन्छ र पछिको async `.catch()` ले <b>समात्दैन</b>।", jp: "同期の `throw` は即座に起き、後続の非同期 `.catch()` では<b>捕まらない</b>。" },
        { en: "Decide whether an error is <b>synchronous</b> or <b>Promise-based</b> before choosing how to handle it.", np: "Error <b>synchronous</b> हो कि <b>Promise-आधारित</b>, तय गरेपछि मात्र सम्हाल्ने तरिका छान्नुहोस्।", jp: "エラーが<b>同期</b>か<b>Promiseベース</b>かを決めてから、扱い方を選ぶ。" },
      ],
      commonMistakes: [
        { en: "<b>Recursive `process.nextTick()`</b> — `function loop() { process.nextTick(loop); }` can starve the entire event loop. Use `setImmediate(loop)` when repeated work must coexist with other activity.", np: "<b>Recursive `process.nextTick()`</b> — `function loop() { process.nextTick(loop); }` ले पूरै event loop भोकाउन सक्छ। बारम्बारको काम अरूसँग सँगै चल्नुपर्दा `setImmediate(loop)` प्रयोग गर्नुहोस्।", jp: "<b>再帰的な `process.nextTick()`</b> — `function loop() { process.nextTick(loop); }` はイベントループ全体を飢えさせる。他の処理と共存させたいなら `setImmediate(loop)` を使う。" },
        { en: "<b>Assuming `setImmediate()` always wins</b> — at the top level their ordering is not guaranteed. Only inside an I/O callback can you rely on it.", np: "<b>`setImmediate()` सधैं जित्छ भन्ने ठान्नु</b> — top level मा क्रमको ग्यारेन्टी छैन। I/O callback भित्र मात्र भरोसा गर्न सकिन्छ।", jp: "<b>`setImmediate()` が必ず勝つと思う</b> — トップレベルでは順序は保証されない。I/Oコールバック内でのみ当てにできる。" },
        { en: "<b>Thinking `setTimeout(0)` is immediate</b> — `setTimeout(() => console.log(\"later\"), 0); console.log(\"now\");` prints `now` then `later`.", np: "<b>`setTimeout(0)` तुरुन्तै हो भन्ने ठान्नु</b> — `setTimeout(() => console.log(\"later\"), 0); console.log(\"now\");` ले `now` अनि `later` देखाउँछ।", jp: "<b>`setTimeout(0)` が即時だと思う</b> — `setTimeout(() => console.log(\"later\"), 0); console.log(\"now\");` は `now` の次に `later`。" },
        { en: "<b>Assuming `.catch()` catches synchronous throws</b> — `getData().catch(handleError)` fails when `getData()` throws before returning. Use `try/catch`, or make the function `async`.", np: "<b>`.catch()` ले synchronous throw समात्छ भन्ने ठान्नु</b> — `getData()` ले फर्काउनुअघि throw गर्दा `getData().catch(handleError)` असफल हुन्छ। `try/catch` प्रयोग गर्नुहोस्, वा function लाई `async` बनाउनुहोस्।", jp: "<b>`.catch()` が同期のthrowを捕まえると思う</b> — `getData()` が返す前にthrowすると `getData().catch(handleError)` は失敗する。`try/catch` を使うか関数を `async` にする。" },
        { en: "<b>Confusing stack recursion with `nextTick()` recursion</b> — normal recursion overflows the stack; `nextTick()` recursion starves the loop instead.", np: "<b>Stack recursion र `nextTick()` recursion अल्मल्याउनु</b> — सामान्य recursion ले stack overflow गर्छ; `nextTick()` recursion ले बरु loop भोकाउँछ।", jp: "<b>スタックの再帰と `nextTick()` の再帰を混同する</b> — 通常の再帰はスタックを溢れさせ、`nextTick()` の再帰はループを飢えさせる。" },
      ],
      quiz: [
        {
          question: { en: "What can recursive `process.nextTick()` cause?", np: "Recursive `process.nextTick()` ले के गराउन सक्छ?", jp: "再帰的な `process.nextTick()` は何を引き起こしうるか?" },
          options: [
            { en: "An immediate stack overflow", np: "तुरुन्तै stack overflow", jp: "即座のスタックオーバーフロー" },
            { en: "Automatic Promise rejection", np: "स्वतः Promise rejection", jp: "自動的なPromiseの拒否" },
            { en: "Event loop starvation", np: "Event loop starvation", jp: "イベントループの飢餓" },
            { en: "Faster I/O", np: "छिटो I/O", jp: "より速いI/O" },
          ],
          correctIndex: 2,
          explanation: { en: "Each callback is scheduled for later rather than nested on the stack.", np: "हरेक callback stack मा नथपिई पछिका लागि schedule हुन्छ।", jp: "各コールバックはスタックに積まれず、後回しに予約される。" },
        },
        {
          question: { en: "Which is safer for repeatedly scheduling work while letting the event loop continue?", np: "Event loop चलिरहन दिँदै बारम्बार काम schedule गर्न कुन सुरक्षित छ?", jp: "イベントループを進ませつつ処理を繰り返し予約するのに安全なのは?" },
          options: [
            { en: "Recursive `process.nextTick()`", np: "Recursive `process.nextTick()`", jp: "再帰的な `process.nextTick()`" },
            { en: "Infinite `Promise.then()` recursion", np: "अनन्त `Promise.then()` recursion", jp: "無限の `Promise.then()` 再帰" },
            { en: "Recursive synchronous calls", np: "Recursive synchronous call", jp: "同期の再帰呼び出し" },
            { en: "Recursive `setImmediate()`", np: "Recursive `setImmediate()`", jp: "再帰的な `setImmediate()`" },
          ],
          correctIndex: 3,
          explanation: { en: "It queues into the check phase, so other phases still get their turn.", np: "यो check phase मा जान्छ, त्यसैले अरू phase ले पनि पालो पाउँछन्।", jp: "checkフェーズに入るので、他のフェーズにも順番が回る。" },
        },
        {
          question: { en: "Inside an I/O callback, which of `setTimeout(() => console.log(\"A\"), 0)` and `setImmediate(() => console.log(\"B\"))` runs first?", np: "I/O callback भित्र, `setTimeout(() => console.log(\"A\"), 0)` र `setImmediate(() => console.log(\"B\"))` मध्ये कुन पहिले चल्छ?", jp: "I/Oコールバック内で `setTimeout(() => console.log(\"A\"), 0)` と `setImmediate(() => console.log(\"B\"))` のどちらが先に走るか?" },
          options: [
            { en: "`B`", np: "`B`", jp: "`B`" },
            { en: "`A`", np: "`A`", jp: "`A`" },
            { en: "Always random", np: "सधैं अनिश्चित", jp: "常にランダム" },
            { en: "Both at once", np: "दुबै सँगै", jp: "同時に両方" },
          ],
          correctIndex: 0,
          explanation: { en: "Poll is followed directly by check, where setImmediate runs.", np: "Poll पछि सिधै check आउँछ, जहाँ setImmediate चल्छ।", jp: "pollの直後がcheckで、そこでsetImmediateが走る。" },
        },
        {
          question: { en: "What happens with `function test() { throw new Error(\"Boom\"); } test().catch(console.error);`?", np: "`function test() { throw new Error(\"Boom\"); } test().catch(console.error);` मा के हुन्छ?", jp: "`function test() { throw new Error(\"Boom\"); } test().catch(console.error);` はどうなるか?" },
          options: [
            { en: "`.catch()` handles it", np: "`.catch()` ले सम्हाल्छ", jp: "`.catch()` が処理する" },
            { en: "The error is thrown synchronously before `.catch()` can be called", np: "`.catch()` बोलाउन पाउनुअघि नै error synchronously throw हुन्छ", jp: "`.catch()` を呼ぶ前に同期的にthrowされる" },
            { en: "The error becomes a Promise rejection", np: "Error Promise rejection बन्छ", jp: "エラーがPromiseの拒否になる" },
            { en: "`setImmediate()` catches it", np: "`setImmediate()` ले समात्छ", jp: "`setImmediate()` が捕まえる" },
          ],
          correctIndex: 1,
          explanation: { en: "Marking the function `async` would turn the throw into a rejection.", np: "Function लाई `async` बनाए throw rejection बन्थ्यो।", jp: "関数を `async` にすれば、そのthrowは拒否に変わる。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "How many phases does the Node.js event loop cycle through?", np: "Node.js event loop कति phase बाट घुम्छ?", jp: "Node.jsのイベントループはいくつのフェーズを回るか?" },
      options: [
        { en: "Six", np: "Six", jp: "Six" },
        { en: "Three", np: "Three", jp: "Three" },
        { en: "Two", np: "Two", jp: "Two" },
      ],
      correctIndex: 0,
      explanation: { en: "Timers, pending callbacks, idle/prepare, poll, check, close callbacks.", np: "Timers, pending callbacks, idle/prepare, poll, check, close callbacks।", jp: "timers・pending callbacks・idle/prepare・poll・check・close callbacks。" },
    },
    {
      question: { en: "Which C library provides Node's event loop and async I/O?", np: "कुन C library ले Node को event loop र async I/O दिन्छ?", jp: "Nodeのイベントループと非同期I/Oを提供するCライブラリは?" },
      options: [
        { en: "V8", np: "V8", jp: "V8" },
        { en: "libuv", np: "libuv", jp: "libuv" },
        { en: "OpenSSL", np: "OpenSSL", jp: "OpenSSL" },
      ],
      correctIndex: 1,
      explanation: { en: "V8 runs the JavaScript; libuv runs the loop.", np: "V8 ले JavaScript चलाउँछ; libuv ले loop चलाउँछ।", jp: "V8はJavaScriptを実行し、libuvがループを回す。" },
    },
    {
      question: { en: "Which phase handles most filesystem and network callbacks?", np: "धेरैजसो filesystem र network callback कुन phase ले सम्हाल्छ?", jp: "ファイルシステムやネットワークのコールバックを主に扱うフェーズは?" },
      options: [
        { en: "Check", np: "Check", jp: "Check" },
        { en: "Timers", np: "Timers", jp: "Timers" },
        { en: "Poll", np: "Poll", jp: "Poll" },
      ],
      correctIndex: 2,
      explanation: { en: "Node spends most of its time waiting for and processing I/O there.", np: "Node ले त्यहीँ I/O कुर्दै र process गर्दै धेरै समय बिताउँछ।", jp: "NodeはそこでI/Oを待ち、処理するのに多くの時間を使う。" },
    },
    {
      question: { en: "Which phase runs `setImmediate()` callbacks?", np: "कुन phase ले `setImmediate()` का callback चलाउँछ?", jp: "`setImmediate()` のコールバックを走らせるフェーズは?" },
      options: [
        { en: "Check", np: "Check", jp: "Check" },
        { en: "Poll", np: "Poll", jp: "Poll" },
        { en: "Timers", np: "Timers", jp: "Timers" },
      ],
      correctIndex: 0,
      explanation: { en: "Check comes directly after poll in every iteration.", np: "हरेक iteration मा check poll पछि सिधै आउँछ।", jp: "毎回の反復でcheckはpollの直後に来る。" },
    },
    {
      question: { en: "Between `process.nextTick()` and a Promise `.then()`, which is drained first?", np: "`process.nextTick()` र Promise `.then()` मध्ये कुन पहिले खाली हुन्छ?", jp: "`process.nextTick()` とPromiseの `.then()` はどちらが先に処理されるか?" },
      options: [
        { en: "Promise `.then()`", np: "Promise `.then()`", jp: "Promiseの `.then()`" },
        { en: "`process.nextTick()`", np: "`process.nextTick()`", jp: "`process.nextTick()`" },
        { en: "They interleave", np: "तिनी मिसिन्छन्", jp: "交互に処理される" },
      ],
      correctIndex: 1,
      explanation: { en: "Node gives the nextTick queue priority over promise reactions.", np: "Node ले promise भन्दा nextTick queue लाई प्राथमिकता दिन्छ।", jp: "NodeはnextTickのキューをPromiseより優先する。" },
    },
    {
      question: { en: "At the top level, what is the order of `setTimeout(fn, 0)` and `setImmediate(fn)`?", np: "Top level मा, `setTimeout(fn, 0)` र `setImmediate(fn)` को क्रम के हो?", jp: "トップレベルでの `setTimeout(fn, 0)` と `setImmediate(fn)` の順序は?" },
      options: [
        { en: "`setImmediate` always first", np: "`setImmediate` सधैं पहिले", jp: "常に `setImmediate` が先" },
        { en: "`setTimeout` always first", np: "`setTimeout` सधैं पहिले", jp: "常に `setTimeout` が先" },
        { en: "Not guaranteed", np: "ग्यारेन्टी छैन", jp: "保証されない" },
      ],
      correctIndex: 2,
      explanation: { en: "It depends on how fast Node reaches the first loop iteration.", np: "Node पहिलो loop iteration मा कति छिटो पुग्छ त्यसमा भर पर्छ।", jp: "Nodeが最初の反復にどれだけ早く到達するかによる。" },
    },
    {
      question: { en: "Inside an `fs.readFile` callback, which runs first?", np: "`fs.readFile` को callback भित्र, कुन पहिले चल्छ?", jp: "`fs.readFile` のコールバック内では、どちらが先に走るか?" },
      options: [
        { en: "`setImmediate()`", np: "`setImmediate()`", jp: "`setImmediate()`" },
        { en: "`setTimeout(fn, 0)`", np: "`setTimeout(fn, 0)`", jp: "`setTimeout(fn, 0)`" },
        { en: "It varies", np: "फरक पर्छ", jp: "変動する" },
      ],
      correctIndex: 0,
      explanation: { en: "The callback runs in poll, and check is the very next phase.", np: "Callback poll मा चल्छ, र check नै ठ्याक्कै अर्को phase हो।", jp: "コールバックはpollで走り、次のフェーズがまさにcheck。" },
    },
    {
      question: { en: "What is the danger of `function loop() { process.nextTick(loop); }`?", np: "`function loop() { process.nextTick(loop); }` को खतरा के हो?", jp: "`function loop() { process.nextTick(loop); }` の危険は?" },
      options: [
        { en: "An immediate stack overflow", np: "तुरुन्तै stack overflow", jp: "即座のスタックオーバーフロー" },
        { en: "Event loop starvation", np: "Event loop starvation", jp: "イベントループの飢餓" },
        { en: "Nothing, it is safe", np: "केही होइन, यो सुरक्षित छ", jp: "何もない。安全" },
      ],
      correctIndex: 1,
      explanation: { en: "The queue must fully drain, so timers and I/O never get a turn.", np: "Queue पूरै खाली हुनुपर्ने भएकाले timer र I/O ले पालो पाउँदैनन्।", jp: "キューを完全に空にする必要があり、タイマーやI/Oの番が来ない。" },
    },
    {
      question: { en: "Why does `function test() { throw new Error(\"Boom\"); } test().catch(handle);` fail?", np: "`function test() { throw new Error(\"Boom\"); } test().catch(handle);` किन असफल हुन्छ?", jp: "`function test() { throw new Error(\"Boom\"); } test().catch(handle);` はなぜ失敗するか?" },
      options: [
        { en: "`throw` is not allowed in functions", np: "Function मा `throw` अनुमति छैन", jp: "関数内で `throw` は許されないから" },
        { en: "`.catch()` only handles network errors", np: "`.catch()` ले network error मात्र सम्हाल्छ", jp: "`.catch()` はネットワークエラーしか扱わないから" },
        { en: "The throw happens before any promise is returned", np: "कुनै promise फर्किनुअघि नै throw हुन्छ", jp: "Promiseが返される前にthrowが起きるから" },
      ],
      correctIndex: 2,
      explanation: { en: "Use try/catch, or mark the function `async` so the throw becomes a rejection.", np: "try/catch प्रयोग गर्नुहोस्, वा function लाई `async` बनाउनुहोस् ताकि throw rejection बनोस्।", jp: "try/catchを使うか、関数を `async` にしてthrowを拒否に変える。" },
    },
  ],
};
