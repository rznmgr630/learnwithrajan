import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_13_LESSONS: JsLessonDay = {
  day: 13,
  title: { en: "The browser event loop — call stack, queues & microtasks", np: "Browser event loop — call stack, queues र microtasks", jp: "ブラウザのイベントループ — コールスタック・キュー・マイクロタスク" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "the-call-stack",
      title: { en: "The Call Stack", np: "The Call Stack", jp: "コールスタック" },
      durationMinutes: 9,
      explanation: {
        en: "The <b>call stack</b> is the data structure JavaScript uses to track which function is currently running. It works <b>LIFO</b> — Last In, First Out — like a stack of plates: whichever function was called most recently is the one on top, and it must finish (return) before the function below it can continue. Every function call <b>pushes</b> a new frame onto the stack; every `return` <b>pops</b> that frame off.\n\nBecause JavaScript has exactly one call stack, it can only ever do <b>one thing at a time</b> — this is what \"single-threaded\" means in practice. If the stack is busy running synchronous code (a big loop, a slow calculation), nothing else can run: no click handlers, no timers, no rendering. And since each nested call adds another frame, calling a function that keeps calling itself without ever returning (unbounded recursion) keeps growing the stack until it runs out of space — a `RangeError: Maximum call stack size exceeded`, better known as a <b>stack overflow</b>.",
        np: "<b>Call stack</b> भनेको JavaScript ले हाल कुन function चलिरहेको छ भनेर track गर्ने data structure हो। यो <b>LIFO</b> (Last In, First Out) तरिकाले काम गर्छ — plates को stack जस्तै: सबैभन्दा पछि call भएको function माथि हुन्छ, र तल भएको function जारी हुनु अघि यसले finish (return) गर्नुपर्छ। हरेक function call ले stack मा नयाँ frame <b>push</b> गर्छ; हरेक `return` ले त्यो frame <b>pop</b> गर्छ।\n\nJavaScript मा exactly एउटा मात्र call stack भएकोले, यसले एक पटकमा <b>एउटा मात्र काम</b> गर्न सक्छ — यही नै \"single-threaded\" को व्यावहारिक अर्थ हो। Stack synchronous code (ठूलो loop, slow calculation) चलाउन busy भएको बेला अरू केही चल्दैन — न click handlers, न timers, न rendering। अनि हरेक nested call ले थप frame add गर्ने भएकोले, कहिल्यै return नगरी आफैंलाई बारम्बार call गर्ने function (unbounded recursion) ले stack लाई space सकिन्जेल बढाउँदै लान्छ — `RangeError: Maximum call stack size exceeded`, जसलाई <b>stack overflow</b> भनिन्छ।",
        jp: "<b>コールスタック</b>は、JavaScriptが現在実行中の関数を追跡するために使うデータ構造。<b>LIFO</b>（Last In, First Out、後入れ先出し）方式で動作する — 皿を積み重ねたスタックのように、最後に呼ばれた関数が一番上にあり、その下の関数が続行できるのはそれが終了（return）してからだ。関数を呼び出すたびに新しいフレームがスタックに<b>push</b>され、`return`のたびにそのフレームが<b>pop</b>される。\n\nJavaScriptにはコールスタックが1つしかないため、常に<b>一度に一つのこと</b>しかできない — これが「シングルスレッド」の実際の意味だ。スタックが同期コード（大きなループ、重い計算）の実行でふさがっている間は、クリックハンドラもタイマーも描画も何も動かない。さらに、ネストした呼び出しはフレームを増やし続けるため、決してreturnせずに自分自身を呼び続ける関数（無限再帰）はスタックの空きがなくなるまで積み上がり続け、`RangeError: Maximum call stack size exceeded`、いわゆる<b>スタックオーバーフロー</b>になる。",
      },
      diagram: `Call stack while running a();  (bottom → top)

┌─────────────┐
│   c()       │  ← top of stack — currently running, logs "c", then returns
├─────────────┤
│   b()       │  ← called c(), waiting for it to return
├─────────────┤
│   a()       │  ← called b(), waiting for it to return
├─────────────┤
│ (global)    │  ← bottom of stack — where execution started
└─────────────┘

push order: a() → b() → c()      pop order: c() → b() → a()   (LIFO)

Unbounded recursion:
┌─────────────┐
│ recurse()   │
│ recurse()   │  ← stack keeps growing, never pops
│ recurse()   │
│    ...      │
└─────────────┘
→ RangeError: Maximum call stack size exceeded`,
      codeExample: {
        title: { en: "Watching frames push and pop, and triggering a stack overflow", np: "Frames push/pop हेर्ने, र stack overflow ल्याउने", jp: "フレームのpush/popの観察とスタックオーバーフローの発生" },
        code: `// ── Call stack in action ─────────────────────────────────────────
function c() { console.log("c"); }
function b() { c(); }
function a() { b(); }

a();
// Stack frames (bottom to top) as a() runs:
//   a()  → calls b()
//   b()  → calls c()
//   c()  → logs "c", returns → popped
//   b()  → returns → popped
//   a()  → returns → popped
// Stack is empty again once a() finishes

// ── Each call adds a frame, each return removes one ────────────────
function square(n) {
  return n * n;          // this frame is popped as soon as it returns
}
function sumOfSquares(a, b) {
  return square(a) + square(b);   // square() is pushed, runs, pops — twice
}
sumOfSquares(3, 4); // 25

// ── Stack overflow — unbounded recursion ────────────────────────────
function recurse() {
  return recurse();  // calls itself forever, never returns, never pops
}
// recurse();  // Uncaught RangeError: Maximum call stack size exceeded

// ── A correct base case keeps the stack bounded ─────────────────────
function countdown(n) {
  if (n <= 0) return;   // base case — stops pushing new frames
  console.log(n);
  countdown(n - 1);     // each call pops before the stack gets too deep
}
countdown(5); // 5, 4, 3, 2, 1

// ── Synchronous code blocks the stack ────────────────────────────
// While this runs, NOTHING else can happen — no clicks, no timers
function blockFor3Seconds() {
  const end = Date.now() + 3000;
  while (Date.now() < end) {}  // busy loop — stack never empties
  console.log("Done blocking");
}
// blockFor3Seconds();  // UI freezes for 3 seconds — CPU work on the main thread is bad`,
      },
      keyTakeaways: [
        { en: "The call stack is <b>LIFO</b> — the most recently called function is the one currently running, and it must return before the function that called it can continue.", np: "Call stack <b>LIFO</b> हो — सबैभन्दा पछि call भएको function नै हाल चलिरहेको हुन्छ, र यसलाई call गर्ने function जारी रहनु अघि यो return हुनुपर्छ।", jp: "コールスタックは<b>LIFO</b>（後入れ先出し）— 最後に呼ばれた関数が現在実行中で、それを呼んだ関数が続くにはそれがreturnする必要がある。" },
        { en: "JavaScript has exactly one call stack, so it can only run one thing at a time — this single-threaded nature is why long-running synchronous code freezes everything else.", np: "JavaScript मा exactly एउटा मात्र call stack छ, त्यसैले एक पटकमा एउटा मात्र काम गर्न सक्छ — यही single-threaded nature ले गर्दा लामो synchronous code ले बाँकी सबै freeze गराउँछ।", jp: "JavaScriptにはコールスタックが1つしかないため、一度に1つのことしか実行できない — このシングルスレッドの性質が、長時間の同期コードが他のすべてを凍結させる理由。" },
        { en: "Unbounded recursion (a function that calls itself without a base case that stops it) keeps pushing frames until the stack runs out of space, throwing a `RangeError: Maximum call stack size exceeded`.", np: "Unbounded recursion (आफैंलाई रोक्ने base case नभएको function) ले stack को space सकिन्जेल frames push गर्दै जान्छ, र `RangeError: Maximum call stack size exceeded` throw गर्छ।", jp: "無限再帰（それを止める基底ケースなしに自分自身を呼び続ける関数）はスタックの空きがなくなるまでフレームを積み続け、`RangeError: Maximum call stack size exceeded`をスローする。" },
      ],
      commonMistakes: [
        { en: "Writing a recursive function without a base case, so it never stops calling itself and eventually causes a stack overflow.", np: "Base case नराखी recursive function लेख्नु, जसले गर्दा यसले आफैंलाई कहिल्यै रोक्दैन र stack overflow निम्त्याउँछ।", jp: "基底ケースなしに再帰関数を書き、自分自身の呼び出しを止められず最終的にスタックオーバーフローを引き起こすこと。" },
        { en: "Assuming that running a slow synchronous loop won't affect anything else — in reality it fully blocks the call stack, freezing clicks, timers, and rendering until it finishes.", np: "Slow synchronous loop चलाउँदा अरू केहीमा असर पर्दैन भन्ने ठान्नु — वास्तवमा यसले call stack लाई पूर्ण रूपमा block गर्छ, नसकिन्जेल clicks, timers, र rendering सबै freeze हुन्छ।", jp: "遅い同期ループを実行しても他に影響しないと思い込むこと — 実際にはコールスタックを完全にブロックし、終わるまでクリック・タイマー・描画がすべて凍結する。" },
        { en: "Confusing the call stack (which tracks synchronous function execution) with the task/microtask queues — the stack has nothing to do with async scheduling by itself.", np: "Call stack (जसले synchronous function execution track गर्छ) र task/microtask queues बीच confuse हुनु — stack आफैंले async scheduling सँग कुनै सम्बन्ध राख्दैन।", jp: "コールスタック（同期的な関数実行を追跡する）とタスク/マイクロタスクキューを混同すること — スタック自体は非同期スケジューリングとは無関係。" },
      ],
      quiz: [
        {
          question: { en: "In which order does the call stack process function calls?", np: "Call stack ले function calls लाई कुन order मा process गर्छ?", jp: "コールスタックはどの順序で関数呼び出しを処理する？" },
          options: [
            { en: "LIFO — the most recently called function returns first", np: "LIFO — सबैभन्दा पछि call भएको function पहिले return हुन्छ", jp: "LIFO — 最後に呼ばれた関数が最初にreturnする" },
            { en: "FIFO — the first called function returns first", np: "FIFO — सबैभन्दा पहिले call भएको function पहिले return हुन्छ", jp: "FIFO — 最初に呼ばれた関数が最初にreturnする" },
          ],
          correctIndex: 0,
          explanation: { en: "The call stack is Last In, First Out — like a stack of plates, the top (most recent) frame is popped first.", np: "Call stack Last In, First Out हो — plates को stack जस्तै, माथिको (सबैभन्दा पछिको) frame पहिले pop हुन्छ।", jp: "コールスタックはLast In, First Out — 皿の山のように、一番上（最新）のフレームが最初にpopされる。" },
        },
        {
          question: { en: "Why can JavaScript only run one thing at a time?", np: "JavaScript ले किन एक पटकमा एउटा मात्र काम गर्न सक्छ?", jp: "JavaScriptが一度に一つのことしか実行できないのはなぜ？" },
          options: [
            { en: "It has exactly one call stack, so only one function frame can execute at a time", np: "यसमा exactly एउटा मात्र call stack छ, त्यसैले एक पटकमा एउटा मात्र function frame execute हुन्छ", jp: "コールスタックが1つしかないため、一度に1つの関数フレームしか実行できない" },
            { en: "It has multiple stacks but they are locked one at a time", np: "यसमा multiple stacks छन् तर एक पटकमा एउटा lock हुन्छ", jp: "複数のスタックがあるが一度に1つずつロックされる" },
          ],
          correctIndex: 0,
          explanation: { en: "JavaScript's single call stack is exactly what makes it single-threaded — only one function frame can be the 'currently running' one.", np: "JavaScript को एउटै call stack ले नै यसलाई single-threaded बनाउँछ — एक पटकमा एउटा मात्र function frame 'currently running' हुन सक्छ।", jp: "JavaScriptの1つのコールスタックこそがシングルスレッドたらしめる理由 — 一度に1つの関数フレームしか「実行中」になれない。" },
        },
        {
          question: { en: "What causes a `RangeError: Maximum call stack size exceeded`?", np: "`RangeError: Maximum call stack size exceeded` को कारण के हो?", jp: "`RangeError: Maximum call stack size exceeded`の原因は？" },
          options: [
            { en: "A recursive function with no base case, pushing frames forever without popping", np: "Base case नभएको recursive function, जसले pop नगरी frames बारम्बार push गर्छ", jp: "基底ケースのない再帰関数が、popせずにフレームを永遠にpushし続ける" },
            { en: "Calling too many unrelated functions one after another in sequence", np: "क्रमशः धेरै असम्बन्धित functions call गर्नु", jp: "無関係な関数を次々と順番に呼び出しすぎること" },
          ],
          correctIndex: 0,
          explanation: { en: "Unbounded recursion keeps pushing new frames without ever popping them off, until the stack exhausts its allotted space.", np: "Unbounded recursion ले pop नगरी नयाँ frames push गर्दै जान्छ, जबसम्म stack को space सकिँदैन।", jp: "無限再帰はフレームをpopせずに新しく積み続け、スタックに割り当てられた空間を使い果たす。" },
        },
      ],
    },
    {
      id: "web-apis-callback-queue",
      title: { en: "Web APIs & the Callback Queue", np: "Web APIs र Callback Queue", jp: "Web APIとコールバックキュー" },
      durationMinutes: 9,
      explanation: {
        en: "When you call `setTimeout`, register a DOM event listener, or start a `fetch`, JavaScript itself does not sit around waiting. Instead, it hands that work off to the browser's <b>Web APIs</b> — timers, network stack, DOM — which live outside the JS engine and run independently. Once the timer fires, the event happens, or the network response arrives, the Web API places the associated callback into the <b>callback queue</b> (also called the task queue or macrotask queue), ready to run.\n\nThe <b>event loop</b> has one simple, constantly repeating job: check whether the call stack is empty, and if it is, take the next callback from the queue and push it onto the stack to run. This is exactly why `setTimeout(fn, 0)` does <b>not</b> run immediately — \"0ms\" only tells the Web API when to move the callback into the queue; the callback still has to wait its turn until the call stack is completely empty and the event loop picks it up. If synchronous code is still running, the callback waits, no matter how short its delay was.",
        np: "`setTimeout` call गर्दा, DOM event listener register गर्दा, वा `fetch` सुरु गर्दा, JavaScript आफैं बसेर पर्खिँदैन। बरु त्यो काम browser को <b>Web APIs</b> — timers, network stack, DOM — लाई दिन्छ, जुन JS engine बाहिर independently चल्छन्। Timer fire भएपछि, event भएपछि, वा network response आएपछि, Web API ले सम्बन्धित callback लाई <b>callback queue</b> (task queue वा macrotask queue) मा राख्छ, चल्न तयार।\n\n<b>Event loop</b> को एउटै simple, बारम्बार दोहोरिने काम छ: call stack empty छ कि छैन check गर्नु, र भए queue बाट अर्को callback लिएर stack मा push गर्नु। यही कारणले `setTimeout(fn, 0)` तुरुन्तै run <b>हुँदैन</b> — \"0ms\" ले Web API लाई callback कहिले queue मा सार्ने भन्छ मात्र; call stack पूर्ण रूपमा खाली नभएसम्म र event loop ले pick नगरेसम्म callback ले आफ्नो पालो पर्खनुपर्छ। Synchronous code अझै चलिरहेको छ भने, delay जति सानो भए पनि callback पर्खिरहन्छ।",
        jp: "`setTimeout`を呼ぶ、DOMイベントリスナーを登録する、`fetch`を開始するとき、JavaScript自身は待ち続けたりしない。その代わり、その作業をブラウザの<b>Web API</b>（タイマー、ネットワークスタック、DOM）に渡す。これらはJSエンジンの外に存在し、独立して動作する。タイマーが発火する、イベントが起きる、ネットワーク応答が届くと、Web APIは対応するコールバックを<b>コールバックキュー</b>（タスクキューまたはマクロタスクキューとも呼ばれる）に入れ、実行準備を整える。\n\n<b>イベントループ</b>の仕事はシンプルで、絶えず繰り返される — コールスタックが空かどうかを確認し、空ならキューから次のコールバックを取り出してスタックにpushして実行する。これこそが`setTimeout(fn, 0)`が即座に<b>実行されない</b>理由だ。「0ms」はWeb APIにコールバックをいつキューに移すかを伝えるだけで、コールバックはコールスタックが完全に空になりイベントループに拾われるまで自分の順番を待たなければならない。同期コードがまだ実行中なら、遅延がどれだけ短くてもコールバックは待たされる。",
      },
      diagram: `┌─────────────┐   setTimeout/fetch/addEventListener   ┌───────────────┐
│ Call Stack  │ ─────────────────────────────────────▶ │   Web APIs    │
│  (JS engine)│                                         │ (timer, net,  │
└─────────────┘                                         │  DOM — outside│
       ▲                                                │  the JS engine)│
       │  event loop pushes callback                    └───────┬───────┘
       │  ONLY when stack is empty                               │ timer fires /
       │                                                          │ response arrives
┌──────┴──────┐                                          ┌───────▼───────┐
│ Event Loop  │ ◀──────── picks next callback ────────── │ Callback Queue│
│ "Is stack   │            when stack is empty            │ (macrotask/   │
│  empty?"    │                                            │  task queue)  │
└─────────────┘                                            └───────────────┘

console.log("1")           →  runs immediately (sync, on the stack)
setTimeout(fn, 0)          →  handed to Web APIs, fn queued once timer fires
console.log("3")           →  runs immediately (sync, on the stack)
[stack now empty]          →  event loop moves fn from queue → stack → runs
Output: 1, 3, 2   (NOT 1, 2, 3)`,
      codeExample: {
        title: { en: "setTimeout(fn, 0) still waits for the call stack to empty", np: "setTimeout(fn, 0) पनि call stack खाली हुने पर्खन्छ", jp: "setTimeout(fn, 0)もコールスタックが空になるのを待つ" },
        code: `// ── Classic event loop output puzzle ──────────────────────────────
console.log("1");          // sync — runs immediately, straight on the stack

setTimeout(() => {
  console.log("2");        // async — handed to Web APIs, then queued
}, 0);

console.log("3");          // sync — runs immediately, straight on the stack

// Output: 1, 3, 2
// Why? "2"'s callback sits in the callback queue. The event loop only
// moves it onto the stack after the stack is empty — i.e. after "3" runs.

// ── "0ms" means "as soon as possible", not "right now" ────────────
// setTimeout(fn, 0) tells the Web API: start a 0ms timer, then queue fn.
// fn still has to wait for:
//   1. all remaining synchronous code to finish
//   2. its turn in the callback queue

// ── Multiple timers — order depends on delay and queue position ───
setTimeout(() => console.log("A"), 0);
setTimeout(() => console.log("B"), 0);
setTimeout(() => console.log("C"), 100);
// Output order: A, B, (~100ms pause), C
// A and B enter the queue almost immediately (0ms delay, but still async)
// C's timer takes longer to fire, so it enters the queue much later

// ── fetch works the same way — network I/O happens in the Web APIs ──
console.log("start");
fetch("/api/data").then((res) => console.log("got response"));
console.log("end");
// Output: "start", "end", then "got response" whenever the network responds
// The fetch itself runs entirely outside the JS call stack`,
      },
      keyTakeaways: [
        { en: "`setTimeout`, DOM events, and `fetch` are handled by the browser's <b>Web APIs</b>, not the JS engine itself — JavaScript hands off the waiting and moves on.", np: "`setTimeout`, DOM events, र `fetch` लाई browser को <b>Web APIs</b> ले handle गर्छ, JS engine आफैंले होइन — JavaScript ले पर्खने काम अरूलाई दिएर अगाडि बढ्छ।", jp: "`setTimeout`・DOMイベント・`fetch`はJSエンジン自体ではなくブラウザの<b>Web API</b>が処理する — JavaScriptは待つ作業を渡して先に進む。" },
        { en: "Once a Web API's work is done, its callback is placed in the <b>callback queue</b>, and the event loop only moves it onto the call stack when the stack is completely empty.", np: "Web API को काम सकिएपछि, यसको callback <b>callback queue</b> मा राखिन्छ, र event loop ले stack पूर्ण खाली भएमा मात्र यसलाई call stack मा सार्छ।", jp: "Web APIの作業が終わると、そのコールバックは<b>コールバックキュー</b>に置かれ、スタックが完全に空になったときにのみイベントループがコールスタックへ移す。" },
        { en: "`setTimeout(fn, 0)` does not run immediately — the delay only controls when the callback enters the queue; it still waits for the current call stack to empty.", np: "`setTimeout(fn, 0)` तुरुन्तै run हुँदैन — delay ले callback कहिले queue मा पस्ने मात्र control गर्छ; यसले अझै हालको call stack खाली हुने पर्खनुपर्छ।", jp: "`setTimeout(fn, 0)`は即座に実行されない — 遅延はコールバックがいつキューに入るかを制御するだけで、現在のコールスタックが空になるのを待つ。" },
      ],
      commonMistakes: [
        { en: "Believing `setTimeout(fn, 0)` runs synchronously or 'right now' — it always waits for the current call stack to fully empty first, no matter how small the delay.", np: "`setTimeout(fn, 0)` synchronously वा 'अहिले नै' चल्छ भन्ने ठान्नु — यसले सधैं हालको call stack पूर्ण खाली हुने पहिले पर्खन्छ, delay जति सानो भए पनि।", jp: "`setTimeout(fn, 0)`が同期的または「今すぐ」実行されると思い込むこと — 遅延がどれだけ小さくても必ず現在のコールスタックが完全に空になるのを待つ。" },
        { en: "Thinking JavaScript itself performs the waiting for timers or network requests — the waiting actually happens in the browser's Web APIs, outside the JS engine.", np: "Timers वा network requests को पर्खाइ JavaScript आफैंले गर्छ भन्ने सोच्नु — त्यो पर्खाइ वास्तवमा JS engine बाहिर browser को Web APIs मा हुन्छ।", jp: "タイマーやネットワークリクエストの待機自体をJavaScriptが行っていると考えること — 実際の待機はJSエンジンの外、ブラウザのWeb APIで行われる。" },
        { en: "Assuming callbacks in the callback queue run the instant they're queued — they still have to wait for the call stack to be empty and for the event loop to pick them up.", np: "Callback queue मा भएका callbacks queue मा पर्नासाथ तुरुन्तै चल्छन् भन्ने ठान्नु — तिनले अझै call stack खाली हुने र event loop ले pick गर्ने पर्खनुपर्छ।", jp: "コールバックキュー内のコールバックがキューに入った瞬間に実行されると思い込むこと — コールスタックが空になりイベントループに拾われるのを待つ必要がある。" },
      ],
      quiz: [
        {
          question: { en: "Where does the actual waiting for a `setTimeout` timer happen?", np: "`setTimeout` timer को actual पर्खाइ कहाँ हुन्छ?", jp: "`setTimeout`タイマーの実際の待機はどこで行われる？" },
          options: [
            { en: "In the browser's Web APIs, outside the JS engine's call stack", np: "Browser को Web APIs मा, JS engine को call stack बाहिर", jp: "JSエンジンのコールスタックの外、ブラウザのWeb API内" },
            { en: "On the call stack itself, blocking other code", np: "Call stack मै, अरू code block गर्दै", jp: "コールスタック自体、他のコードをブロックしながら" },
          ],
          correctIndex: 0,
          explanation: { en: "The Web APIs handle timers independently of the JS engine, freeing the call stack to keep running other synchronous code.", np: "Web APIs ले JS engine बाट independently timers handle गर्छ, call stack लाई अरू synchronous code चलाउन खाली राख्छ।", jp: "Web APIはJSエンジンとは独立してタイマーを処理し、コールスタックを他の同期コードの実行のために解放する。" },
        },
        {
          question: { en: "Does `setTimeout(fn, 0)` run `fn` immediately, before any remaining synchronous code?", np: "`setTimeout(fn, 0)` ले `fn` लाई बाँकी synchronous code भन्दा पहिले तुरुन्तै run गर्छ?", jp: "`setTimeout(fn, 0)`は残りの同期コードより前に`fn`をすぐに実行する？" },
          options: [
            { en: "No — it waits for the call stack to empty first, then waits its turn in the queue", np: "होइन — यसले पहिले call stack खाली हुने पर्खन्छ, अनि queue मा आफ्नो पालो", jp: "いいえ — まずコールスタックが空になるのを待ち、その後キューで順番を待つ" },
            { en: "Yes — a 0ms delay means it always runs before any other code", np: "हो — 0ms delay ले सधैं अरू code भन्दा पहिले चल्छ भन्ने अर्थ दिन्छ", jp: "はい — 0msの遅延は常に他のコードより先に実行されることを意味する" },
          ],
          correctIndex: 0,
          explanation: { en: "A 0ms delay only controls when the callback is queued; it always runs after the currently executing synchronous code finishes.", np: "0ms delay ले callback कहिले queue हुने मात्र control गर्छ; यो सधैं हाल चलिरहेको synchronous code सकिएपछि मात्र चल्छ।", jp: "0msの遅延はコールバックがいつキューに入るかを制御するだけで、現在実行中の同期コードが終わった後に必ず実行される。" },
        },
        {
          question: { en: "What is the event loop's core job?", np: "Event loop को core काम के हो?", jp: "イベントループの中心的な仕事は何？" },
          options: [
            { en: "Check if the call stack is empty, and if so, move the next queued callback onto it", np: "Call stack खाली छ कि छैन check गर्नु, र भए queue बाट अर्को callback त्यसमा सार्नु", jp: "コールスタックが空かを確認し、空なら次のキューにあるコールバックをそこに移すこと" },
            { en: "Execute all Web API requests directly on the call stack", np: "सबै Web API requests लाई call stack मै direct execute गर्नु", jp: "すべてのWeb APIリクエストをコールスタック上で直接実行すること" },
          ],
          correctIndex: 0,
          explanation: { en: "The event loop constantly checks stack emptiness and, when empty, pulls the next callback from the queue onto the stack to run.", np: "Event loop ले लगातार stack खाली छ कि छैन check गर्छ, र खाली भएमा queue बाट अर्को callback stack मा ल्याई चलाउँछ।", jp: "イベントループはスタックが空かを常に確認し、空であればキューから次のコールバックをスタックに移して実行する。" },
        },
      ],
    },
    {
      id: "microtask-vs-macrotask",
      title: { en: "Microtask vs Macrotask Queue", np: "Microtask vs Macrotask Queue", jp: "マイクロタスクとマクロタスクの違い" },
      durationMinutes: 9,
      explanation: {
        en: "Not everything async goes into the same queue. Promises (`.then`, `.catch`, `.finally`) and `queueMicrotask` schedule their callbacks in a separate, higher-priority <b>microtask queue</b>, while `setTimeout`, `setInterval`, and UI rendering go into the (lower-priority) <b>macrotask queue</b> — the callback queue from the previous lesson. The rule that decides the order: after the currently running script finishes, and after each macrotask completes, the event loop <b>fully drains the entire microtask queue</b> — running every microtask, including any new ones scheduled while draining — before it is allowed to pick up the next macrotask.\n\nThis is the classic interview question. Given `console.log(\"1\")`, then `setTimeout(() => console.log(\"2\"), 0)`, then `Promise.resolve().then(() => console.log(\"3\"))`, then `console.log(\"4\")` — the output is `1, 4, 3, 2`. `\"1\"` and `\"4\"` run synchronously first. Once the stack is empty, the event loop checks the microtask queue before the macrotask queue, so the Promise's `.then` (`\"3\"`) runs before the `setTimeout` callback (`\"2\"`), even though the timer was scheduled first and had a 0ms delay.",
        np: "हरेक async काम एउटै queue मा जाँदैन। Promises (`.then`, `.catch`, `.finally`) र `queueMicrotask` ले आफ्ना callbacks छुट्टै, higher-priority <b>microtask queue</b> मा schedule गर्छन्, जबकि `setTimeout`, `setInterval`, र UI rendering (lower-priority) <b>macrotask queue</b> मा जान्छन् — अघिल्लो lesson को callback queue। Order तय गर्ने नियम यही हो: हाल चलिरहेको script सकिएपछि, र हरेक macrotask सकिएपछि, event loop ले <b>पूरै microtask queue drain गर्छ</b> — draining गर्दा schedule भएका नयाँ microtasks समेत — अनि मात्र अर्को macrotask लिन पाउँछ।\n\nयो classic interview question हो। `console.log(\"1\")`, त्यसपछि `setTimeout(() => console.log(\"2\"), 0)`, त्यसपछि `Promise.resolve().then(() => console.log(\"3\"))`, त्यसपछि `console.log(\"4\")` दिइएमा — output `1, 4, 3, 2` हुन्छ। `\"1\"` र `\"4\"` synchronously पहिले चल्छन्। Stack खाली भएपछि, event loop ले macrotask queue भन्दा पहिले microtask queue check गर्छ, त्यसैले Promise को `.then` (`\"3\"`) `setTimeout` callback (`\"2\"`) भन्दा पहिले चल्छ, timer पहिले schedule भई 0ms delay भए पनि।",
        jp: "すべての非同期処理が同じキューに入るわけではない。Promise（`.then`・`.catch`・`.finally`）と`queueMicrotask`は、優先度の高い別の<b>マイクロタスクキュー</b>にコールバックをスケジュールする。一方`setTimeout`・`setInterval`・UIレンダリングは（優先度の低い）<b>マクロタスクキュー</b>、つまり前のレッスンのコールバックキューに入る。順序を決めるルールはこうだ — 現在実行中のスクリプトが終わった後、そして各マクロタスクが完了するたびに、イベントループは次のマクロタスクを取り出す前に<b>マイクロタスクキュー全体を完全に処理する</b>（処理中に新しくスケジュールされたものも含めて）。\n\nこれは定番の面接問題だ。`console.log(\"1\")`、次に`setTimeout(() => console.log(\"2\"), 0)`、次に`Promise.resolve().then(() => console.log(\"3\"))`、次に`console.log(\"4\")`とすると、出力は`1, 4, 3, 2`になる。「1」と「4」はまず同期的に実行される。スタックが空になると、イベントループはマクロタスクキューより先にマイクロタスクキューを確認するため、Promiseの`.then`（「3」）は`setTimeout`のコールバック（「2」）より先に実行される。タイマーが先にスケジュールされ、遅延が0msであってもだ。",
      },
      diagram: `Priority order the event loop always follows:

  1. SYNCHRONOUS CODE   (call stack)          — runs first, top to bottom
  2. MICROTASK QUEUE     (Promise.then/catch/finally, queueMicrotask)
       → drained COMPLETELY, including new microtasks added while draining
  3. MACROTASK QUEUE     (setTimeout, setInterval, UI rendering, I/O)
       → only ONE macrotask runs per event loop turn
       → then the loop goes back to step 2 and drains microtasks again

console.log("1")                                   → sync, runs now
setTimeout(() => console.log("2"), 0)              → queued as MACROTASK
Promise.resolve().then(() => console.log("3"))     → queued as MICROTASK
console.log("4")                                   → sync, runs now

Timeline:
sync:        1, 4
stack empty  → drain microtasks:  3
              → next macrotask:   2

Output: 1, 4, 3, 2`,
      codeExample: {
        title: { en: "Predict the output — the classic microtask vs macrotask puzzle", np: "Output predict गर्नुहोस् — classic microtask vs macrotask puzzle", jp: "出力を予測する — 定番のマイクロタスク対マクロタスク問題" },
        code: `// ── The classic interview puzzle ───────────────────────────────────
console.log("1");                                       // sync

setTimeout(() => console.log("2"), 0);                   // macrotask

Promise.resolve().then(() => console.log("3"));           // microtask

console.log("4");                                        // sync

// Output: 1, 4, 3, 2
//
// Why?
// 1. Call stack runs console.log("1")               → logs "1"
// 2. setTimeout callback → goes to the MACROTASK queue (waits)
// 3. Promise.resolve().then() → callback goes to the MICROTASK queue
// 4. Call stack runs console.log("4")               → logs "4"
// 5. Call stack is now empty
// 6. Event loop drains the microtask queue FIRST    → logs "3"
// 7. Only now does it check the macrotask queue      → logs "2"

// ── Chained .then() — all microtasks drain before the next macrotask ──
console.log("1 — sync");

setTimeout(() => console.log("5 — macrotask (setTimeout)"), 0);

Promise.resolve()
  .then(() => console.log("3 — microtask (Promise.then)"))
  .then(() => console.log("4 — microtask (chained .then)"));

console.log("2 — sync");

// Output:
// 1 — sync
// 2 — sync
// 3 — microtask (Promise.then)
// 4 — microtask (chained .then)
// 5 — macrotask (setTimeout)
//
// Even the SECOND .then() (a NEW microtask scheduled while draining)
// still runs before the setTimeout callback — the microtask queue is
// drained completely, however many microtasks get added along the way.

// ── queueMicrotask — schedule a microtask directly ───────────────────
console.log("start");
queueMicrotask(() => console.log("microtask"));
setTimeout(() => console.log("macrotask"), 0);
console.log("end");
// Output: start, end, microtask, macrotask

// ── Priority summary (highest to lowest) ──────────────────────────────
// 1. Synchronous code (call stack)
// 2. Microtasks   — Promise.then/catch/finally, queueMicrotask, MutationObserver
// 3. Macrotasks   — setTimeout, setInterval, UI rendering, I/O callbacks`,
      },
      keyTakeaways: [
        { en: "Promises (`.then`/`.catch`/`.finally`) and `queueMicrotask` schedule callbacks in the <b>microtask queue</b>, which has higher priority than the macrotask (`setTimeout`/`setInterval`) queue.", np: "Promises (`.then`/`.catch`/`.finally`) र `queueMicrotask` ले callbacks लाई <b>microtask queue</b> मा schedule गर्छन्, जसको priority macrotask (`setTimeout`/`setInterval`) queue भन्दा उच्च हुन्छ।", jp: "Promise（`.then`/`.catch`/`.finally`）と`queueMicrotask`はコールバックを<b>マイクロタスクキュー</b>にスケジュールし、これはマクロタスク（`setTimeout`/`setInterval`）キューより優先度が高い。" },
        { en: "The event loop always <b>fully drains the microtask queue</b> — including any new microtasks scheduled while draining — before it picks up the next macrotask.", np: "Event loop ले सधैं <b>microtask queue पूर्ण drain</b> गर्छ — draining गर्दा schedule भएका नयाँ microtasks सहित — अर्को macrotask लिनु अघि।", jp: "イベントループは次のマクロタスクを取り出す前に、必ず<b>マイクロタスクキューを完全に処理する</b>（処理中に新しくスケジュールされたものも含めて）。" },
        { en: "This is why `.then` callbacks always run before a `setTimeout(fn, 0)` callback scheduled earlier — microtasks win over macrotasks regardless of timer delay.", np: "यही कारणले `.then` callbacks सधैं पहिले schedule भएको `setTimeout(fn, 0)` callback भन्दा पहिले चल्छन् — timer delay जे भए पनि microtasks ले macrotasks लाई जित्छन्।", jp: "これが`.then`コールバックが先にスケジュールされた`setTimeout(fn, 0)`コールバックより常に先に実行される理由 — タイマーの遅延に関わらずマイクロタスクがマクロタスクに勝つ。" },
      ],
      commonMistakes: [
        { en: "Assuming code order alone determines output order — `setTimeout` scheduled before a Promise's `.then` can still run *after* it, because microtasks always drain before the next macrotask.", np: "Code को order ले मात्र output order तय गर्छ भन्ने ठान्नु — Promise को `.then` भन्दा पहिले schedule भएको `setTimeout` पनि *पछि* चल्न सक्छ, किनभने microtasks सधैं अर्को macrotask भन्दा पहिले drain हुन्छन्।", jp: "コードの順序だけが出力順序を決めると思い込むこと — Promiseの`.then`より先にスケジュールされた`setTimeout`でも、マイクロタスクは常に次のマクロタスクより前に処理されるため*後に*実行されることがある。" },
        { en: "Forgetting that a microtask which schedules another microtask (a chained `.then`) still runs before the next macrotask — the queue keeps draining until it's truly empty.", np: "अर्को microtask schedule गर्ने microtask (chained `.then`) पनि अर्को macrotask भन्दा पहिले चल्छ भन्ने बिर्सनु — queue साँच्चै खाली नभएसम्म drain भइरहन्छ।", jp: "別のマイクロタスクをスケジュールするマイクロタスク（連鎖した`.then`）も次のマクロタスクより前に実行されることを忘れること — キューは本当に空になるまで処理され続ける。" },
        { en: "Treating `setInterval`/`setTimeout` and Promise callbacks as if they share one queue with equal priority — they are two distinct queues with different priority levels.", np: "`setInterval`/`setTimeout` र Promise callbacks लाई एउटै equal-priority queue साझा गरेको जस्तो ठान्नु — तिनी फरक priority भएका दुई छुट्टाछुट्टै queues हुन्।", jp: "`setInterval`/`setTimeout`とPromiseコールバックが同等の優先度で1つのキューを共有していると扱うこと — 実際は優先度の異なる2つの別々のキュー。" },
      ],
      quiz: [
        {
          question: { en: "Which queue does a Promise's `.then()` callback go into?", np: "Promise को `.then()` callback कुन queue मा जान्छ?", jp: "Promiseの`.then()`コールバックはどのキューに入る？" },
          options: [
            { en: "The microtask queue — higher priority than macrotasks", np: "Microtask queue — macrotasks भन्दा उच्च priority", jp: "マイクロタスクキュー — マクロタスクより優先度が高い" },
            { en: "The same macrotask queue as setTimeout", np: "setTimeout जस्तै macrotask queue", jp: "setTimeoutと同じマクロタスクキュー" },
          ],
          correctIndex: 0,
          explanation: { en: "Promise callbacks (.then/.catch/.finally) and queueMicrotask are scheduled in the microtask queue, a separate, higher-priority queue.", np: "Promise callbacks (.then/.catch/.finally) र queueMicrotask microtask queue मा schedule हुन्छन्, जुन छुट्टै र उच्च-priority queue हो।", jp: "Promiseコールバック（.then/.catch/.finally）とqueueMicrotaskはマイクロタスクキューという別の優先度の高いキューにスケジュールされる。" },
        },
        {
          question: { en: "Given `setTimeout(() => console.log(\"a\"), 0)` followed by `Promise.resolve().then(() => console.log(\"b\"))`, which logs first?", np: "`setTimeout(() => console.log(\"a\"), 0)` पछि `Promise.resolve().then(() => console.log(\"b\"))` दिइएमा, कुन पहिले log हुन्छ?", jp: "`setTimeout(() => console.log(\"a\"), 0)`の後に`Promise.resolve().then(() => console.log(\"b\"))`があるとき、どちらが先にログされる？" },
          options: [
            { en: "\"b\" — the microtask queue always drains before the next macrotask", np: "\"b\" — microtask queue ले सधैं अर्को macrotask भन्दा पहिले drain हुन्छ", jp: "「b」— マイクロタスクキューは常に次のマクロタスクより先に処理される" },
            { en: "\"a\" — setTimeout was scheduled first, so it wins", np: "\"a\" — setTimeout पहिले schedule भएको हुनाले यसले जित्छ", jp: "「a」— setTimeoutが先にスケジュールされたので勝つ" },
          ],
          correctIndex: 0,
          explanation: { en: "Regardless of scheduling order, the event loop always fully drains the microtask queue before touching the next macrotask.", np: "Scheduling order जे भए पनि, event loop ले सधैं अर्को macrotask छुनु अघि microtask queue पूर्ण drain गर्छ।", jp: "スケジュール順序に関わらず、イベントループは次のマクロタスクに触れる前に必ずマイクロタスクキューを完全に処理する。" },
        },
        {
          question: { en: "If a microtask schedules another microtask (e.g. a chained `.then`) while the queue is draining, does the new one still run before the next macrotask?", np: "Queue drain भइरहँदा एउटा microtask ले अर्को microtask (जस्तै chained `.then`) schedule गऱ्यो भने, नयाँ वाला अर्को macrotask भन्दा पहिले नै चल्छ?", jp: "キューの処理中にマイクロタスクが別のマイクロタスク（連鎖した`.then`など）をスケジュールした場合、新しいものは次のマクロタスクより前に実行される？" },
          options: [
            { en: "Yes — the microtask queue keeps draining until it is completely empty", np: "हो — microtask queue पूर्ण खाली नभएसम्म drain भइरहन्छ", jp: "はい — マイクロタスクキューは完全に空になるまで処理され続ける" },
            { en: "No — only microtasks that existed before draining started will run first", np: "होइन — drain सुरु हुनु अघिका microtasks मात्र पहिले चल्छन्", jp: "いいえ — 処理開始前に存在していたマイクロタスクのみが先に実行される" },
          ],
          correctIndex: 0,
          explanation: { en: "The microtask queue is drained completely each time, including microtasks scheduled by other microtasks during the drain — none of them are deferred to the next macrotask cycle.", np: "हरेक पटक microtask queue पूर्ण रूपमा drain हुन्छ, draining बेला अरू microtasks ले schedule गरेका समेत — कुनैलाई पनि अर्को macrotask cycle मा टार्दैन।", jp: "マイクロタスクキューは毎回完全に処理される。処理中に他のマイクロタスクによってスケジュールされたものも含めて — どれも次のマクロタスクサイクルに先送りされない。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What data structure does JavaScript use to track the currently running function?", np: "JavaScript ले हाल चलिरहेको function track गर्न कुन data structure प्रयोग गर्छ?", jp: "JavaScriptは現在実行中の関数を追跡するのに何のデータ構造を使う？" },
      options: [{ en: "The call stack (LIFO)", np: "Call stack (LIFO)", jp: "コールスタック（LIFO）" }, { en: "A FIFO queue", np: "FIFO queue", jp: "FIFOキュー" }],
      correctIndex: 0,
      explanation: { en: "The call stack is LIFO — the most recently called function runs and returns first.", np: "Call stack LIFO हो — सबैभन्दा पछि call भएको function पहिले चल्छ र return हुन्छ।", jp: "コールスタックはLIFOで、最後に呼ばれた関数が最初に実行・returnする。" },
    },
    {
      question: { en: "Why does unbounded recursion eventually throw a RangeError?", np: "Unbounded recursion ले किन अन्तत: RangeError throw गर्छ?", jp: "無限再帰が最終的にRangeErrorをスローするのはなぜ？" },
      options: [{ en: "It keeps pushing frames onto the call stack without popping any off", np: "यसले pop नगरी call stack मा frames थप्दै जान्छ", jp: "popすることなくコールスタックにフレームを積み続けるから" }, { en: "It runs too many separate, unrelated function calls", np: "यसले धेरै असम्बन्धित function calls चलाउँछ", jp: "無関係な関数呼び出しを多く実行しすぎるから" }],
      correctIndex: 0,
      explanation: { en: "Each recursive call adds a frame; without a base case to stop it, the stack overflows its allotted space.", np: "हरेक recursive call ले frame थप्छ; रोक्ने base case नभए, stack ले आफ्नो space overflow गर्छ।", jp: "各再帰呼び出しはフレームを追加する。止める基底ケースがなければ、スタックは割り当てられた空間を超える。" },
    },
    {
      question: { en: "Why does synchronous code freeze the UI while it runs?", np: "Synchronous code चलिरहँदा UI किन freeze हुन्छ?", jp: "同期コードの実行中にUIがフリーズするのはなぜ？" },
      options: [{ en: "It occupies the single call stack, so nothing else — clicks, timers, rendering — can run", np: "यसले एउटै call stack ओगट्छ, त्यसैले clicks, timers, rendering केही पनि चल्न सक्दैन", jp: "唯一のコールスタックを占有し、クリック・タイマー・描画など他の何も実行できなくなるから" }, { en: "It pauses the Web APIs from accepting new work", np: "यसले Web APIs लाई नयाँ काम स्वीकार गर्नबाट रोक्छ", jp: "Web APIが新しい作業を受け付けるのを止めるから" }],
      correctIndex: 0,
      explanation: { en: "JavaScript has one call stack; while it's busy with synchronous code, the event loop cannot push any queued callback onto it.", np: "JavaScript मा एउटै call stack छ; synchronous code मा busy भएको बेला event loop ले कुनै queued callback त्यसमा push गर्न सक्दैन।", jp: "JavaScriptにはコールスタックが1つしかない。同期コードで忙しい間、イベントループはキューにあるコールバックをそこにpushできない。" },
    },
    {
      question: { en: "Where does the actual waiting for a `setTimeout` or `fetch` happen?", np: "`setTimeout` वा `fetch` को actual पर्खाइ कहाँ हुन्छ?", jp: "`setTimeout`や`fetch`の実際の待機はどこで行われる？" },
      options: [{ en: "In the browser's Web APIs, outside the JS engine", np: "Browser को Web APIs मा, JS engine बाहिर", jp: "JSエンジンの外、ブラウザのWeb API内" }, { en: "On the JS call stack itself", np: "JS call stack मै", jp: "JSコールスタック自体" }],
      correctIndex: 0,
      explanation: { en: "Web APIs handle timers and network requests independently, freeing the call stack to keep running other code.", np: "Web APIs ले timers र network requests लाई independently handle गर्छ, call stack लाई अरू code चलाउन खाली राख्छ।", jp: "Web APIはタイマーとネットワークリクエストを独立して処理し、コールスタックを他のコードの実行のために解放する。" },
    },
    {
      question: { en: "Does `setTimeout(fn, 0)` run `fn` immediately?", np: "`setTimeout(fn, 0)` ले `fn` तुरुन्तै चलाउँछ?", jp: "`setTimeout(fn, 0)`は`fn`をすぐに実行する？" },
      options: [{ en: "No — it still waits for the call stack to empty and its turn in the queue", np: "होइन — यसले अझै call stack खाली हुने र queue मा आफ्नो पालो पर्खन्छ", jp: "いいえ — コールスタックが空になりキューでの順番を待つ" }, { en: "Yes — 0ms means it always runs before other code", np: "हो — 0ms ले सधैं अरू code भन्दा पहिले चल्छ भन्ने अर्थ दिन्छ", jp: "はい — 0msは常に他のコードより先に実行されることを意味する" }],
      correctIndex: 0,
      explanation: { en: "A 0ms delay only decides when the callback enters the callback queue — it still waits for the stack to be empty.", np: "0ms delay ले callback कहिले callback queue मा पस्ने मात्र तय गर्छ — यसले अझै stack खाली हुने पर्खनुपर्छ।", jp: "0msの遅延はコールバックがいつコールバックキューに入るかを決めるだけで、スタックが空になるのを待つ。" },
    },
    {
      question: { en: "What is the event loop's core job?", np: "Event loop को core काम के हो?", jp: "イベントループの中心的な仕事は何？" },
      options: [{ en: "Check if the call stack is empty, then move the next queued callback onto it", np: "Call stack खाली छ कि छैन check गर्नु, अनि queue बाट अर्को callback त्यसमा सार्नु", jp: "コールスタックが空かを確認し、次のキューのコールバックをそこに移すこと" }, { en: "Execute Web API requests directly on the call stack", np: "Web API requests लाई call stack मै direct execute गर्नु", jp: "Web APIリクエストをコールスタック上で直接実行すること" }],
      correctIndex: 0,
      explanation: { en: "The event loop repeatedly checks whether the stack is empty and, if so, pulls the next callback from the queue.", np: "Event loop ले लगातार stack खाली छ कि छैन check गर्छ, र भए queue बाट अर्को callback ल्याउँछ।", jp: "イベントループはスタックが空かを繰り返し確認し、空なら次のコールバックをキューから取り出す。" },
    },
    {
      question: { en: "Which queue does a Promise's `.then()` callback go into?", np: "Promise को `.then()` callback कुन queue मा जान्छ?", jp: "Promiseの`.then()`コールバックはどのキューに入る？" },
      options: [{ en: "The microtask queue", np: "Microtask queue", jp: "マイクロタスクキュー" }, { en: "The same macrotask queue as setTimeout", np: "setTimeout जस्तै macrotask queue", jp: "setTimeoutと同じマクロタスクキュー" }],
      correctIndex: 0,
      explanation: { en: "Promise callbacks and queueMicrotask are scheduled in the separate, higher-priority microtask queue.", np: "Promise callbacks र queueMicrotask छुट्टै, उच्च-priority microtask queue मा schedule हुन्छन्।", jp: "Promiseコールバックとqueue Microtaskは別の優先度の高いマイクロタスクキューにスケジュールされる。" },
    },
    {
      question: { en: "Given `setTimeout(() => console.log(\"a\"), 0)` then `Promise.resolve().then(() => console.log(\"b\"))`, which logs first?", np: "`setTimeout(() => console.log(\"a\"), 0)` पछि `Promise.resolve().then(() => console.log(\"b\"))` दिइएमा कुन पहिले log हुन्छ?", jp: "`setTimeout(() => console.log(\"a\"), 0)`の後に`Promise.resolve().then(() => console.log(\"b\"))`、どちらが先にログされる？" },
      options: [{ en: "\"b\" — microtasks always drain before the next macrotask", np: "\"b\" — microtasks सधैं अर्को macrotask भन्दा पहिले drain हुन्छ", jp: "「b」— マイクロタスクは常に次のマクロタスクより先に処理される" }, { en: "\"a\" — it was scheduled first", np: "\"a\" — यो पहिले schedule भएको थियो", jp: "「a」— 先にスケジュールされたから" }],
      correctIndex: 0,
      explanation: { en: "No matter the scheduling order, the event loop fully drains the microtask queue before touching the next macrotask.", np: "Scheduling order जे भए पनि, event loop ले अर्को macrotask छुनु अघि microtask queue पूर्ण drain गर्छ।", jp: "スケジュール順序に関わらず、イベントループは次のマクロタスクに触れる前にマイクロタスクキューを完全に処理する。" },
    },
    {
      question: { en: "If a microtask schedules another microtask while the queue is draining, does the new one still run before the next macrotask?", np: "Queue drain हुँदा एउटा microtask ले अर्को microtask schedule गऱ्यो भने, नयाँ वाला अर्को macrotask भन्दा पहिले चल्छ?", jp: "処理中にマイクロタスクが別のマイクロタスクをスケジュールしたら、新しいものは次のマクロタスクより先に実行される？" },
      options: [{ en: "Yes — the microtask queue keeps draining until completely empty", np: "हो — microtask queue पूर्ण खाली नभएसम्म drain भइरहन्छ", jp: "はい — マイクロタスクキューは完全に空になるまで処理され続ける" }, { en: "No — it's deferred until after the next macrotask", np: "होइन — यो अर्को macrotask पछिसम्म पर्खिन्छ", jp: "いいえ — 次のマクロタスクの後まで先送りされる" }],
      correctIndex: 0,
      explanation: { en: "The microtask queue drains completely each turn, including newly scheduled microtasks — none are pushed to the next macrotask cycle.", np: "हरेक turn मा microtask queue पूर्ण drain हुन्छ, नयाँ schedule भएका समेत — कुनैलाई अर्को macrotask cycle मा धकेलिँदैन।", jp: "マイクロタスクキューは毎回完全に処理される。新しくスケジュールされたものも含めて — 次のマクロタスクサイクルに先送りされるものはない。" },
    },
  ],
};
