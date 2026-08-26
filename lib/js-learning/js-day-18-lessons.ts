import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_18_LESSONS: JsLessonDay = {
  day: 18,
  title: { en: "The browser event loop — call stack, queues & microtasks", np: "Browser event loop — call stack, queues र microtasks", jp: "ブラウザのイベントループ — コールスタック・キュー・マイクロタスク" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "the-call-stack",
      title: { en: "The Call Stack", np: "The Call Stack", jp: "コールスタック" },
      durationMinutes: 9,
      explanation: {
        en: "The <b>call stack</b> is the data structure JavaScript uses to keep track of <b>which function is currently executing</b>.\n\nIt follows <b>LIFO — Last In, First Out</b>. Think of it like a stack of plates: when a function is called, JavaScript <b>pushes</b> a new execution frame onto the stack, and when that function returns, JavaScript <b>pops</b> its frame off.\n\n> <b>The function on top of the stack is the function currently executing.</b>\n\n---\n\n### 1. Basic — push and pop\n\n```javascript\nfunction greet() {\n  console.log(\"Hello\");\n}\n\nconsole.log(\"Start\");\n\ngreet();\n\nconsole.log(\"End\");\n```\n\nWhen `greet()` is called:\n\n```text\n┌──────────────┐\n│ greet()      │\n├──────────────┤\n│ Global       │\n└──────────────┘\n```\n\nAfter `greet()` finishes:\n\n```text\n┌──────────────┐\n│ Global       │\n└──────────────┘\n```\n\n---\n\n### 2. Intermediate — nested function calls\n\n```javascript\nfunction login() {\n  validateUser();\n}\n\nfunction validateUser() {\n  checkDatabase();\n}\n\nfunction checkDatabase() {\n  console.log(\"Checking database...\");\n}\n\nlogin();\n```\n\nStack at the deepest point:\n\n```text\n┌──────────────────┐\n│ checkDatabase()  │\n├──────────────────┤\n│ validateUser()   │\n├──────────────────┤\n│ login()          │\n├──────────────────┤\n│ Global           │\n└──────────────────┘\n```\n\n`checkDatabase()` finishes first because it is at the top, then:\n\n```text\ncheckDatabase() → POP\nvalidateUser()  → POP\nlogin()         → POP\n```\n\nThis is <b>LIFO</b> in action.\n\n---\n\n### 3. Advanced — recursion and stack overflow\n\nA function can call itself:\n\n```javascript\nfunction count() {\n  count();\n}\n\ncount();\n```\n\nEvery call creates another stack frame, the function never returns, and eventually JavaScript runs out of call-stack space:\n\n```text\nRangeError: Maximum call stack size exceeded\n```\n\nThis is called a <b>stack overflow</b>. A recursive function needs a condition that eventually stops it:\n\n```javascript\nfunction countDown(n) {\n  if (n === 0) {\n    return;\n  }\n\n  console.log(n);\n  countDown(n - 1);\n}\n\ncountDown(3);\n```\n\nNow every call can return and the stack unwinds safely.\n\n---\n\n### Call stack and execution context\n\nWhen JavaScript starts a program, the <b>Global Execution Context</b> is placed on the stack. When a function is called, its execution context is pushed on top.\n\n```text\nFunction call\n     ↓\nNew execution context\n     ↓\nPush onto call stack\n     ↓\nFunction executes\n     ↓\nFunction returns\n     ↓\nExecution context removed\n```\n\nSo the call stack is the structure that manages the <b>order of execution contexts</b>.\n\n---\n\n### Why single-threaded matters\n\nJavaScript has one main call stack, so it can execute only <b>one piece of synchronous JavaScript at a time</b> on that thread.\n\n```javascript\nconsole.log(\"A\");\n\nfor (let i = 0; i < 1_000_000_000; i++) {\n  // expensive work\n}\n\nconsole.log(\"B\");\n```\n\nWhile the loop runs, the call stack is busy, which is why long-running synchronous JavaScript can make an application feel <b>frozen</b>.\n\n> <b>Single-threaded does not mean JavaScript cannot handle asynchronous operations.</b> The runtime uses mechanisms outside the call stack, such as the browser or Node.js environment and the event loop, to coordinate that work. Those concepts come next.\n\n---\n\n### Stack trace\n\n```javascript\nfunction first() {\n  second();\n}\n\nfunction second() {\n  third();\n}\n\nfunction third() {\n  throw new Error(\"Something went wrong\");\n}\n\nfirst();\n```\n\nJavaScript produces a <b>stack trace</b> showing how execution reached the error:\n\n```text\nError: Something went wrong\n    at third (...)\n    at second (...)\n    at first (...)\n```\n\nRead it from the top: `third()` was called by `second()`, which was called by `first()`.\n\n---\n\n### Call stack vs heap\n\nThe <b>call stack</b> manages function calls, execution order, local frames and return points. The <b>heap</b> holds dynamically allocated data such as objects, arrays and functions. They work together, but they are <b>not the same thing</b>.",
        np: "<b>Call stack</b> JavaScript ले <b>अहिले कुन function चलिरहेको छ</b> भन्ने हिसाब राख्न प्रयोग गर्ने data structure हो।\n\nयसले <b>LIFO — Last In, First Out</b> पछ्याउँछ। यसलाई थालको चाङ जस्तै सोच्नुहोस्: function call हुँदा JavaScript ले नयाँ execution frame stack मा <b>push</b> गर्छ, र त्यो function return हुँदा यसको frame <b>pop</b> गर्छ।\n\n> <b>Stack को टुप्पोमा भएको function नै अहिले चलिरहेको function हो।</b>\n\n---\n\n### 1. आधारभूत — push र pop\n\n```javascript\nfunction greet() {\n  console.log(\"Hello\");\n}\n\nconsole.log(\"Start\");\n\ngreet();\n\nconsole.log(\"End\");\n```\n\n`greet()` call हुँदा:\n\n```text\n┌──────────────┐\n│ greet()      │\n├──────────────┤\n│ Global       │\n└──────────────┘\n```\n\n`greet()` सकिएपछि:\n\n```text\n┌──────────────┐\n│ Global       │\n└──────────────┘\n```\n\n---\n\n### 2. मध्यम — nested function call\n\n```javascript\nfunction login() {\n  validateUser();\n}\n\nfunction validateUser() {\n  checkDatabase();\n}\n\nfunction checkDatabase() {\n  console.log(\"Checking database...\");\n}\n\nlogin();\n```\n\nसबैभन्दा गहिरो बिन्दुमा stack:\n\n```text\n┌──────────────────┐\n│ checkDatabase()  │\n├──────────────────┤\n│ validateUser()   │\n├──────────────────┤\n│ login()          │\n├──────────────────┤\n│ Global           │\n└──────────────────┘\n```\n\n`checkDatabase()` टुप्पोमा भएकाले पहिले सकिन्छ, त्यसपछि:\n\n```text\ncheckDatabase() → POP\nvalidateUser()  → POP\nlogin()         → POP\n```\n\nयही <b>LIFO</b> व्यवहारमा हो।\n\n---\n\n### 3. उन्नत — recursion र stack overflow\n\nFunction ले आफैंलाई call गर्न सक्छ:\n\n```javascript\nfunction count() {\n  count();\n}\n\ncount();\n```\n\nहरेक call ले अर्को stack frame बनाउँछ, function कहिल्यै return हुँदैन, र अन्ततः JavaScript सँग call-stack ठाउँ सकिन्छ:\n\n```text\nRangeError: Maximum call stack size exceeded\n```\n\nयसलाई <b>stack overflow</b> भनिन्छ। Recursive function लाई अन्ततः रोक्ने condition चाहिन्छ:\n\n```javascript\nfunction countDown(n) {\n  if (n === 0) {\n    return;\n  }\n\n  console.log(n);\n  countDown(n - 1);\n}\n\ncountDown(3);\n```\n\nअब हरेक call return हुन सक्छ र stack सुरक्षित रूपमा खाली हुन्छ।\n\n---\n\n### Call stack र execution context\n\nJavaScript ले program सुरु गर्दा <b>Global Execution Context</b> stack मा राखिन्छ। Function call हुँदा यसको execution context माथि push हुन्छ।\n\n```text\nFunction call\n     ↓\nNew execution context\n     ↓\nPush onto call stack\n     ↓\nFunction executes\n     ↓\nFunction returns\n     ↓\nExecution context removed\n```\n\nत्यसैले call stack <b>execution context को क्रम</b> व्यवस्थापन गर्ने संरचना हो।\n\n---\n\n### Single-threaded हुनु किन महत्वपूर्ण छ\n\nJavaScript सँग एउटा मुख्य call stack हुन्छ, त्यसैले त्यो thread मा एक पटकमा <b>एउटा मात्र synchronous JavaScript</b> चल्न सक्छ।\n\n```javascript\nconsole.log(\"A\");\n\nfor (let i = 0; i < 1_000_000_000; i++) {\n  // expensive work\n}\n\nconsole.log(\"B\");\n```\n\nLoop चल्दै गर्दा call stack व्यस्त हुन्छ, त्यसैले लामो चल्ने synchronous JavaScript ले application <b>जमेको</b> जस्तो बनाउँछ।\n\n> <b>Single-threaded हुनुको अर्थ JavaScript ले asynchronous operation सम्हाल्न सक्दैन भन्ने होइन।</b> Runtime ले call stack बाहिरका संयन्त्र, जस्तै browser वा Node.js वातावरण र event loop, प्रयोग गरी त्यो काम मिलाउँछ। ती अवधारणा अब आउँछन्।\n\n---\n\n### Stack trace\n\n```javascript\nfunction first() {\n  second();\n}\n\nfunction second() {\n  third();\n}\n\nfunction third() {\n  throw new Error(\"Something went wrong\");\n}\n\nfirst();\n```\n\nJavaScript ले error सम्म कसरी पुग्यो देखाउने <b>stack trace</b> दिन्छ:\n\n```text\nError: Something went wrong\n    at third (...)\n    at second (...)\n    at first (...)\n```\n\nमाथिबाट पढ्नुहोस्: `third()` लाई `second()` ले call गर्‍यो, जसलाई `first()` ले call गर्‍यो।\n\n---\n\n### Call stack vs heap\n\n<b>Call stack</b> ले function call, execution क्रम, स्थानीय frame र return बिन्दु व्यवस्थापन गर्छ। <b>Heap</b> ले object, array र function जस्ता गतिशील रूपमा आवंटित data राख्छ। यी सँगै काम गर्छन्, तर <b>उही होइनन्</b>।",
        jp: "<b>コールスタック</b>は、JavaScriptが<b>今どの関数を実行しているか</b>を追跡するためのデータ構造です。\n\n<b>LIFO（後入れ先出し）</b>に従います。皿の重なりだと考えてください。関数が呼ばれるとJavaScriptは新しい実行フレームをスタックに<b>push</b>し、その関数が戻るとフレームを<b>pop</b>します。\n\n> <b>スタックの一番上にある関数が、今実行されている関数。</b>\n\n---\n\n### 1. 基本 — pushとpop\n\n```javascript\nfunction greet() {\n  console.log(\"Hello\");\n}\n\nconsole.log(\"Start\");\n\ngreet();\n\nconsole.log(\"End\");\n```\n\n`greet()` が呼ばれたとき:\n\n```text\n┌──────────────┐\n│ greet()      │\n├──────────────┤\n│ Global       │\n└──────────────┘\n```\n\n`greet()` が終わったあと:\n\n```text\n┌──────────────┐\n│ Global       │\n└──────────────┘\n```\n\n---\n\n### 2. 中級 — 入れ子の関数呼び出し\n\n```javascript\nfunction login() {\n  validateUser();\n}\n\nfunction validateUser() {\n  checkDatabase();\n}\n\nfunction checkDatabase() {\n  console.log(\"Checking database...\");\n}\n\nlogin();\n```\n\n最も深い時点のスタック:\n\n```text\n┌──────────────────┐\n│ checkDatabase()  │\n├──────────────────┤\n│ validateUser()   │\n├──────────────────┤\n│ login()          │\n├──────────────────┤\n│ Global           │\n└──────────────────┘\n```\n\n`checkDatabase()` は一番上にあるので最初に終わり、その後:\n\n```text\ncheckDatabase() → POP\nvalidateUser()  → POP\nlogin()         → POP\n```\n\nこれが<b>LIFO</b>の動きです。\n\n---\n\n### 3. 上級 — 再帰とスタックオーバーフロー\n\n関数は自分自身を呼べます:\n\n```javascript\nfunction count() {\n  count();\n}\n\ncount();\n```\n\n呼び出しごとにフレームが増え、関数は決して戻らず、やがてコールスタックの領域が尽きます:\n\n```text\nRangeError: Maximum call stack size exceeded\n```\n\nこれが<b>スタックオーバーフロー</b>です。再帰関数には、いつか止まる条件が必要です:\n\n```javascript\nfunction countDown(n) {\n  if (n === 0) {\n    return;\n  }\n\n  console.log(n);\n  countDown(n - 1);\n}\n\ncountDown(3);\n```\n\nこれで各呼び出しが戻れるようになり、スタックは安全にほどけます。\n\n---\n\n### コールスタックと実行コンテキスト\n\nJavaScriptがプログラムを開始すると<b>グローバル実行コンテキスト</b>がスタックに置かれます。関数が呼ばれると、その実行コンテキストが上に積まれます。\n\n```text\nFunction call\n     ↓\nNew execution context\n     ↓\nPush onto call stack\n     ↓\nFunction executes\n     ↓\nFunction returns\n     ↓\nExecution context removed\n```\n\nつまりコールスタックは<b>実行コンテキストの順序</b>を管理する構造です。\n\n---\n\n### シングルスレッドであることの意味\n\nJavaScriptのメインのコールスタックは1つなので、そのスレッドでは一度に<b>1つの同期的なJavaScript</b>しか実行できません。\n\n```javascript\nconsole.log(\"A\");\n\nfor (let i = 0; i < 1_000_000_000; i++) {\n  // expensive work\n}\n\nconsole.log(\"B\");\n```\n\nループの間コールスタックは塞がっています。だから長く動く同期的なJavaScriptはアプリを<b>固まった</b>ように見せます。\n\n> <b>シングルスレッドは、非同期処理を扱えないという意味ではありません。</b> ランタイムは、ブラウザやNode.jsの環境とイベントループという、コールスタックの外の仕組みでその調整を行います。次はその話です。\n\n---\n\n### スタックトレース\n\n```javascript\nfunction first() {\n  second();\n}\n\nfunction second() {\n  third();\n}\n\nfunction third() {\n  throw new Error(\"Something went wrong\");\n}\n\nfirst();\n```\n\nJavaScriptは、どうやってエラーに至ったかを示す<b>スタックトレース</b>を出します:\n\n```text\nError: Something went wrong\n    at third (...)\n    at second (...)\n    at first (...)\n```\n\n上から読みます。`third()` は `second()` に呼ばれ、それは `first()` に呼ばれました。\n\n---\n\n### コールスタックとヒープ\n\n<b>コールスタック</b>は関数呼び出し・実行順序・ローカルのフレーム・戻り先を管理します。<b>ヒープ</b>はオブジェクト・配列・関数など動的に確保されるデータを保持します。協力して働きますが、<b>同じものではありません</b>。",
      },
      diagram: `function first() { second(); }
function second() { third(); }
function third() { console.log("Hello"); }
first();


1. Program starts        2. first()              3. second()

┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│ Global       │        │ first()      │        │ second()     │
└──────────────┘        ├──────────────┤        ├──────────────┤
                        │ Global       │        │ first()      │
                        └──────────────┘        ├──────────────┤
                                                │ Global       │
                                                └──────────────┘

4. third() runs          5-7. each returns → POP

┌──────────────┐        ┌──────────────┐
│ third()      │ ← now  │ Global       │
├──────────────┤        └──────────────┘
│ second()     │
├──────────────┤
│ first()      │
├──────────────┤
│ Global       │
└──────────────┘


Call Stack   function frames, execution order, return points
Heap         objects, arrays, functions — dynamically allocated data`,
      codeExample: {
        title: { en: "Pushing, popping, and running out of room", np: "Push गर्नु, pop गर्नु, र ठाउँ सकिनु", jp: "積む・降ろす・そして溢れる" },
        code: `// ── 1. Basic — one frame pushed, then popped ──────────────────────
function greet() {
  console.log("Hello");
}

console.log("Start"); // Global frame
greet();              // greet() pushed, logs, then popped
console.log("End");

// ── 2. Intermediate — nested calls unwind in LIFO order ───────────
function login() {
  validateUser();
}

function validateUser() {
  checkDatabase();
}

function checkDatabase() {
  console.log("Checking database...");
}

login();
// Stack at the deepest point:
// checkDatabase() → validateUser() → login() → Global
// checkDatabase() finishes first, because it is on top

// ── 3. Advanced — recursion needs a base case ─────────────────────
function forever() {
  forever(); // no base case
}

// forever(); // RangeError: Maximum call stack size exceeded

function countDown(n) {
  if (n === 0) return; // base case lets every frame return
  console.log(n);
  countDown(n - 1);
}

countDown(3); // 3, 2, 1 — then the stack unwinds safely

// ── A stack trace reads top-down: innermost call first ────────────
function first() { second(); }
function second() { third(); }
function third() { throw new Error("Something went wrong"); }

// first();
// Error: Something went wrong
//     at third (...)
//     at second (...)
//     at first (...)`,
      },
      keyTakeaways: [
        { en: "The <b>call stack</b> tracks currently executing functions.", np: "<b>Call stack</b> ले अहिले चलिरहेका function को हिसाब राख्छ।", jp: "<b>コールスタック</b>は実行中の関数を追跡する。" },
        { en: "It follows <b>LIFO — Last In, First Out</b>.", np: "यसले <b>LIFO — Last In, First Out</b> पछ्याउँछ।", jp: "<b>LIFO（後入れ先出し）</b>に従う。" },
        { en: "Calling a function <b>pushes</b> a frame; returning <b>pops</b> it.", np: "Function call गर्दा frame <b>push</b> हुन्छ; return गर्दा <b>pop</b>।", jp: "関数を呼ぶとフレームが<b>push</b>され、戻ると<b>pop</b>される。" },
        { en: "The function at the <b>top</b> is the one currently executing.", np: "<b>टुप्पो</b>को function नै अहिले चलिरहेको हो।", jp: "<b>一番上</b>の関数が今実行されている。" },
        { en: "One main call stack means synchronous JavaScript executes <b>one thing at a time</b>.", np: "एउटा मुख्य call stack को अर्थ synchronous JavaScript ले <b>एक पटकमा एउटा</b> काम गर्छ।", jp: "メインのコールスタックが1つなので、同期的なJavaScriptは<b>一度に1つ</b>しか実行できない。" },
        { en: "Deep or infinite recursion causes a <b>stack overflow</b> (`RangeError`).", np: "गहिरो वा अनन्त recursion ले <b>stack overflow</b> (`RangeError`) निम्त्याउँछ।", jp: "深い、あるいは無限の再帰は<b>スタックオーバーフロー</b>（`RangeError`）を起こす。" },
        { en: "A <b>stack trace</b> shows the chain of calls that led to an error, innermost first.", np: "<b>Stack trace</b> ले error सम्म पुर्‍याउने call को शृंखला देखाउँछ, भित्रीबाट सुरु।", jp: "<b>スタックトレース</b>はエラーに至った呼び出しの連なりを、内側から順に示す。" },
        { en: "The call stack manages <b>execution</b>; the <b>heap</b> holds dynamically allocated data.", np: "Call stack ले <b>execution</b> व्यवस्थापन गर्छ; <b>heap</b> ले गतिशील रूपमा आवंटित data राख्छ।", jp: "コールスタックは<b>実行</b>を管理し、<b>ヒープ</b>は動的に確保されたデータを保持する。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking the stack stores every variable permanently</b> — it holds execution frames. When `greet()` finishes, its frame and local state are gone.", np: "<b>Stack ले हरेक variable सधैंका लागि राख्छ भन्ने ठान्नु</b> — यसले execution frame राख्छ। `greet()` सकिएपछि, यसको frame र स्थानीय state हराउँछ।", jp: "<b>スタックがすべての変数を永続的に保持すると思う</b> — 保持するのは実行フレーム。`greet()` が終わればフレームもローカルの状態も消える。" },
        { en: "<b>Thinking asynchronous operations stay on the stack</b> — a `setTimeout` callback does not sit on the call stack for a second. The synchronous code finishes first, and the callback is scheduled later.", np: "<b>Asynchronous operation stack मै रहन्छ भन्ने ठान्नु</b> — `setTimeout` को callback एक सेकेन्ड call stack मा बस्दैन। Synchronous code पहिले सकिन्छ, र callback पछि schedule हुन्छ।", jp: "<b>非同期処理がスタックに居座ると思う</b> — `setTimeout` のコールバックは1秒間スタックにいない。同期コードが先に終わり、コールバックは後でスケジュールされる。" },
        { en: "<b>Forgetting that recursion consumes stack space</b> — `function infinite() { infinite(); }` has no base case, so frames pile up until the stack overflows.", np: "<b>Recursion ले stack ठाउँ खान्छ भनी बिर्सनु</b> — `function infinite() { infinite(); }` मा base case छैन, त्यसैले stack overflow नहुन्जेल frame थुप्रिन्छन्।", jp: "<b>再帰がスタック領域を消費することを忘れる</b> — `function infinite() { infinite(); }` には基底条件がなく、溢れるまでフレームが積み上がる。" },
      ],
      quiz: [
        {
          question: { en: "What does LIFO mean?", np: "LIFO को अर्थ के हो?", jp: "LIFOとは何の略か?" },
          options: [
            { en: "Last In, First Out", np: "Last In, First Out", jp: "Last In, First Out" },
            { en: "Last In, First Open", np: "Last In, First Open", jp: "Last In, First Open" },
            { en: "Linear Input, Fast Output", np: "Linear Input, Fast Output", jp: "Linear Input, Fast Output" },
            { en: "Local Input, Function Output", np: "Local Input, Function Output", jp: "Local Input, Function Output" },
          ],
          correctIndex: 0,
          explanation: { en: "The most recently pushed frame is the first one to be popped.", np: "सबैभन्दा पछि push भएको frame नै पहिले pop हुन्छ।", jp: "最後にpushされたフレームが最初にpopされる。" },
        },
        {
          question: { en: "What happens when a function is called?", np: "Function call हुँदा के हुन्छ?", jp: "関数が呼ばれると何が起こるか?" },
          options: [
            { en: "Its frame is pushed onto the call stack", np: "यसको frame call stack मा push हुन्छ", jp: "そのフレームがコールスタックにpushされる" },
            { en: "Its frame is deleted", np: "यसको frame मेटिन्छ", jp: "フレームが削除される" },
            { en: "It is moved to the heap", np: "यो heap मा सारिन्छ", jp: "ヒープに移動される" },
            { en: "The global context disappears", np: "Global context हराउँछ", jp: "グローバルコンテキストが消える" },
          ],
          correctIndex: 0,
          explanation: { en: "That frame carries the function's execution context and return point.", np: "त्यो frame ले function को execution context र return बिन्दु बोक्छ।", jp: "そのフレームが関数の実行コンテキストと戻り先を持つ。" },
        },
        {
          question: { en: "What happens when a function returns?", np: "Function return हुँदा के हुन्छ?", jp: "関数が戻ると何が起こるか?" },
          options: [
            { en: "A new frame is pushed", np: "नयाँ frame push हुन्छ", jp: "新しいフレームがpushされる" },
            { en: "Its frame is popped from the call stack", np: "यसको frame call stack बाट pop हुन्छ", jp: "そのフレームがコールスタックからpopされる" },
            { en: "The entire JavaScript program stops", np: "पूरै JavaScript program रोकिन्छ", jp: "JavaScriptプログラム全体が止まる" },
            { en: "The function moves to the heap", np: "Function heap मा सर्छ", jp: "関数がヒープに移動する" },
          ],
          correctIndex: 1,
          explanation: { en: "Execution resumes in whatever frame is now on top.", np: "अब टुप्पोमा जुन frame छ, execution त्यहीँ फर्किन्छ।", jp: "実行は、次に一番上になったフレームで再開する。" },
        },
        {
          question: { en: "With `a()` calling `b()` calling `c()` which logs \"Hello\", which function is on top of the stack while \"Hello\" prints?", np: "`a()` ले `b()` लाई, `b()` ले `c()` लाई call गर्दा र `c()` ले \"Hello\" देखाउँदा, stack को टुप्पोमा कुन function हुन्छ?", jp: "`a()` が `b()` を、`b()` が `c()` を呼び、`c()` が \"Hello\" を出力するとき、スタックの一番上はどれか?" },
          options: [
            { en: "`a()`", np: "`a()`", jp: "`a()`" },
            { en: "`b()`", np: "`b()`", jp: "`b()`" },
            { en: "`c()`", np: "`c()`", jp: "`c()`" },
            { en: "Global", np: "Global", jp: "グローバル" },
          ],
          correctIndex: 2,
          explanation: { en: "`c()` was pushed last, so it sits on top and runs first to completion.", np: "`c()` सबैभन्दा पछि push भयो, त्यसैले यो टुप्पोमा छ र पहिले सकिन्छ।", jp: "`c()` が最後にpushされたので一番上にあり、最初に完了する。" },
        },
        {
          question: { en: "Why does `function forever() { forever(); } forever();` eventually fail?", np: "`function forever() { forever(); } forever();` अन्ततः किन असफल हुन्छ?", jp: "`function forever() { forever(); } forever();` はなぜ最終的に失敗するか?" },
          options: [
            { en: "Every call adds a frame and none return, so the stack runs out of space", np: "हरेक call ले frame थप्छ र कुनै return हुँदैन, त्यसैले stack को ठाउँ सकिन्छ", jp: "呼び出しごとにフレームが増え、どれも戻らないのでスタックの領域が尽きる" },
            { en: "Recursion is not allowed in JavaScript", np: "JavaScript मा recursion अनुमति छैन", jp: "JavaScriptでは再帰が許されていないから" },
            { en: "The function is moved to the heap", np: "Function heap मा सारिन्छ", jp: "関数がヒープに移動するから" },
          ],
          correctIndex: 0,
          explanation: { en: "The result is a stack overflow: `RangeError: Maximum call stack size exceeded`.", np: "नतिजा stack overflow हो: `RangeError: Maximum call stack size exceeded`।", jp: "結果はスタックオーバーフロー: `RangeError: Maximum call stack size exceeded`。" },
        },
      ],
    },
    {
      id: "web-apis-callback-queue",
      title: { en: "Web APIs & the Callback Queue", np: "Web APIs र Callback Queue", jp: "Web APIとコールバックキュー" },
      durationMinutes: 9,
      explanation: {
        en: "When JavaScript encounters an asynchronous operation such as `setTimeout()`, a DOM event listener, or `fetch()`, the <b>JavaScript engine does not wait for it to finish</b>.\n\nInstead, the surrounding runtime — usually the <b>browser</b> — provides APIs that handle these operations outside the JavaScript call stack.\n\n```text\nJavaScript\n   │\n   │ \"Start this timer\"\n   ▼\nWeb API\n   │\n   │ waits independently\n   ▼\nTimer finishes\n   │\n   ▼\nCallback Queue\n   │\n   ▼\nEvent Loop\n   │\n   │ when Call Stack is empty\n   ▼\nCall Stack\n   │\n   ▼\nCallback executes\n```\n\n> <b>Web APIs perform or coordinate asynchronous work; the callback queue waits to have the callback executed by JavaScript.</b>\n\n---\n\n### 1. Basic — `setTimeout`\n\n```javascript\nconsole.log(\"Start\");\n\nsetTimeout(() => {\n  console.log(\"Timer\");\n}, 1000);\n\nconsole.log(\"End\");\n```\n\nOutput:\n\n```text\nStart\nEnd\nTimer\n```\n\n`setTimeout()` does not pause JavaScript for one second. It schedules work to happen later, and the synchronous code keeps running.\n\n---\n\n### 2. Intermediate — `setTimeout(..., 0)`\n\n```javascript\nconsole.log(\"A\");\n\nsetTimeout(() => {\n  console.log(\"B\");\n}, 0);\n\nconsole.log(\"C\");\n```\n\nOutput:\n\n```text\nA\nC\nB\n```\n\nMany beginners expect `A B C`. But `0` does <b>not</b> mean \"execute immediately.\" The callback still has to travel:\n\n```text\nWeb API\n   ↓\nCallback Queue\n   ↓\nEvent Loop\n   ↓\nEmpty Call Stack\n   ↓\nCallback executes\n```\n\nSo `setTimeout(fn, 0)` really means \"schedule `fn` to run as soon as possible after the timer is ready and JavaScript gets a chance to execute it.\"\n\n---\n\n### 3. Advanced — a busy call stack delays the callback\n\n```javascript\nconsole.log(\"Start\");\n\nsetTimeout(() => {\n  console.log(\"Timer\");\n}, 0);\n\nfor (let i = 0; i < 1_000_000_000; i++) {\n  // expensive synchronous work\n}\n\nconsole.log(\"End\");\n```\n\nThe timer has a delay of `0ms`, but `\"Timer\"` cannot execute while the loop occupies the call stack:\n\n```text\nCall Stack               Callback Queue\n┌────────────────┐      ┌────────────────┐\n│ huge for loop  │      │ timer callback │\n│ still running  │      │ waiting        │\n└────────────────┘      └────────────────┘\n```\n\nThis is why a `0ms` timer can execute much later.\n\n---\n\n### DOM events and network requests\n\nThe same idea covers more than timers:\n\n```javascript\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Button clicked\");\n});\n```\n\nJavaScript registers the listener, the browser handles the interaction, and the callback only reaches the call stack after the click happens. It does not sit on the stack waiting for the user.\n\n```javascript\nfetch(\"/api/users\")\n  .then(response => response.json())\n  .then(users => {\n    console.log(users);\n  });\n```\n\nJavaScript starts the request and continues; the runtime handles the network work.\n\n> <b>Important:</b> Promise callbacks use the <b>microtask queue</b>, not the regular callback queue. That distinction is the next section.\n\n---\n\n### Callback queue vs call stack\n\n```text\nCALL STACK                 CALLBACK QUEUE\n\n┌───────────────┐          ┌───────────────┐\n│ currently     │          │ waiting       │\n│ executing     │          │ callbacks     │\n└───────────────┘          └───────────────┘\n```\n\nThe event loop is the coordinator between them. As a simplified mental model:\n\n```javascript\nwhile (true) {\n  if (callStackIsEmpty()) {\n    moveNextCallbackToStack();\n  }\n}\n```\n\nThis is why <b>JavaScript is single-threaded but can perform asynchronous operations</b>: the engine is not the thing doing the waiting.",
        np: "JavaScript ले `setTimeout()`, DOM event listener, वा `fetch()` जस्तो asynchronous operation भेट्दा, <b>JavaScript engine ले यो सकिन कुर्दैन</b>।\n\nबरु, वरिपरिको runtime — प्रायः <b>browser</b> — ले यी operation JavaScript call stack बाहिर सम्हाल्ने API दिन्छ।\n\n```text\nJavaScript\n   │\n   │ \"Start this timer\"\n   ▼\nWeb API\n   │\n   │ waits independently\n   ▼\nTimer finishes\n   │\n   ▼\nCallback Queue\n   │\n   ▼\nEvent Loop\n   │\n   │ when Call Stack is empty\n   ▼\nCall Stack\n   │\n   ▼\nCallback executes\n```\n\n> <b>Web API ले asynchronous काम गर्छ वा मिलाउँछ; callback queue ले JavaScript ले callback चलाइदिने पर्खन्छ।</b>\n\n---\n\n### 1. आधारभूत — `setTimeout`\n\n```javascript\nconsole.log(\"Start\");\n\nsetTimeout(() => {\n  console.log(\"Timer\");\n}, 1000);\n\nconsole.log(\"End\");\n```\n\nOutput:\n\n```text\nStart\nEnd\nTimer\n```\n\n`setTimeout()` ले JavaScript लाई एक सेकेन्ड रोक्दैन। यसले पछि हुने काम schedule गर्छ, र synchronous code चलिरहन्छ।\n\n---\n\n### 2. मध्यम — `setTimeout(..., 0)`\n\n```javascript\nconsole.log(\"A\");\n\nsetTimeout(() => {\n  console.log(\"B\");\n}, 0);\n\nconsole.log(\"C\");\n```\n\nOutput:\n\n```text\nA\nC\nB\n```\n\nधेरै नयाँ सिक्नेले `A B C` अपेक्षा गर्छन्। तर `0` को अर्थ \"तुरुन्तै चलाऊ\" <b>होइन</b>। Callback ले अझै यात्रा गर्नुपर्छ:\n\n```text\nWeb API\n   ↓\nCallback Queue\n   ↓\nEvent Loop\n   ↓\nEmpty Call Stack\n   ↓\nCallback executes\n```\n\nत्यसैले `setTimeout(fn, 0)` को वास्तविक अर्थ \"timer तयार भएपछि र JavaScript ले मौका पाएपछि सकेसम्म चाँडो `fn` चलाउने schedule गर\" हो।\n\n---\n\n### 3. उन्नत — व्यस्त call stack ले callback ढिलो पार्छ\n\n```javascript\nconsole.log(\"Start\");\n\nsetTimeout(() => {\n  console.log(\"Timer\");\n}, 0);\n\nfor (let i = 0; i < 1_000_000_000; i++) {\n  // expensive synchronous work\n}\n\nconsole.log(\"End\");\n```\n\nTimer को delay `0ms` छ, तर loop ले call stack ओगटेसम्म `\"Timer\"` चल्न सक्दैन:\n\n```text\nCall Stack               Callback Queue\n┌────────────────┐      ┌────────────────┐\n│ huge for loop  │      │ timer callback │\n│ still running  │      │ waiting        │\n└────────────────┘      └────────────────┘\n```\n\nत्यसैले `0ms` को timer पनि धेरै पछि चल्न सक्छ।\n\n---\n\n### DOM event र network request\n\nयही विचार timer भन्दा धेरैमा लागू हुन्छ:\n\n```javascript\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Button clicked\");\n});\n```\n\nJavaScript ले listener दर्ता गर्छ, browser ले अन्तरक्रिया सम्हाल्छ, र click भएपछि मात्र callback call stack मा पुग्छ। यो user कुर्दै stack मा बस्दैन।\n\n```javascript\nfetch(\"/api/users\")\n  .then(response => response.json())\n  .then(users => {\n    console.log(users);\n  });\n```\n\nJavaScript ले request सुरु गरी अगाडि बढ्छ; runtime ले network काम सम्हाल्छ।\n\n> <b>महत्वपूर्ण:</b> Promise का callback ले सामान्य callback queue होइन, <b>microtask queue</b> प्रयोग गर्छन्। त्यो भिन्नता अर्को section हो।\n\n---\n\n### Callback queue vs call stack\n\n```text\nCALL STACK                 CALLBACK QUEUE\n\n┌───────────────┐          ┌───────────────┐\n│ currently     │          │ waiting       │\n│ executing     │          │ callbacks     │\n└───────────────┘          └───────────────┘\n```\n\nEvent loop यी दुईबीचको समन्वयकर्ता हो। सरल मानसिक model:\n\n```javascript\nwhile (true) {\n  if (callStackIsEmpty()) {\n    moveNextCallbackToStack();\n  }\n}\n```\n\nत्यसैले <b>JavaScript single-threaded भए पनि asynchronous operation गर्न सक्छ</b>: कुर्ने काम engine ले गर्दैन।",
        jp: "JavaScriptが `setTimeout()`・DOMのイベントリスナー・`fetch()` のような非同期処理に出会っても、<b>JavaScriptエンジンはその完了を待ちません</b>。\n\n代わりに、周囲のランタイム — たいていは<b>ブラウザ</b> — が、これらの処理をJavaScriptのコールスタックの外で扱うAPIを提供します。\n\n```text\nJavaScript\n   │\n   │ \"Start this timer\"\n   ▼\nWeb API\n   │\n   │ waits independently\n   ▼\nTimer finishes\n   │\n   ▼\nCallback Queue\n   │\n   ▼\nEvent Loop\n   │\n   │ when Call Stack is empty\n   ▼\nCall Stack\n   │\n   ▼\nCallback executes\n```\n\n> <b>Web APIが非同期の作業を行い、コールバックキューはJavaScriptに実行してもらうのを待つ。</b>\n\n---\n\n### 1. 基本 — `setTimeout`\n\n```javascript\nconsole.log(\"Start\");\n\nsetTimeout(() => {\n  console.log(\"Timer\");\n}, 1000);\n\nconsole.log(\"End\");\n```\n\n出力:\n\n```text\nStart\nEnd\nTimer\n```\n\n`setTimeout()` はJavaScriptを1秒止めません。後で実行する作業を予約し、同期コードは進み続けます。\n\n---\n\n### 2. 中級 — `setTimeout(..., 0)`\n\n```javascript\nconsole.log(\"A\");\n\nsetTimeout(() => {\n  console.log(\"B\");\n}, 0);\n\nconsole.log(\"C\");\n```\n\n出力:\n\n```text\nA\nC\nB\n```\n\n初学者の多くは `A B C` を期待します。しかし `0` は「すぐ実行する」という意味では<b>ありません</b>。コールバックはこの道のりを通ります:\n\n```text\nWeb API\n   ↓\nCallback Queue\n   ↓\nEvent Loop\n   ↓\nEmpty Call Stack\n   ↓\nCallback executes\n```\n\nつまり `setTimeout(fn, 0)` は「タイマーが整い、JavaScriptに機会が来たらできるだけ早く `fn` を実行するよう予約する」という意味です。\n\n---\n\n### 3. 上級 — 忙しいコールスタックがコールバックを遅らせる\n\n```javascript\nconsole.log(\"Start\");\n\nsetTimeout(() => {\n  console.log(\"Timer\");\n}, 0);\n\nfor (let i = 0; i < 1_000_000_000; i++) {\n  // expensive synchronous work\n}\n\nconsole.log(\"End\");\n```\n\nタイマーの遅延は `0ms` ですが、ループがコールスタックを占めている間 `\"Timer\"` は実行できません:\n\n```text\nCall Stack               Callback Queue\n┌────────────────┐      ┌────────────────┐\n│ huge for loop  │      │ timer callback │\n│ still running  │      │ waiting        │\n└────────────────┘      └────────────────┘\n```\n\nだから `0ms` のタイマーでもずっと後に実行されることがあります。\n\n---\n\n### DOMイベントとネットワーク\n\n同じ考え方はタイマー以外にも当てはまります:\n\n```javascript\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Button clicked\");\n});\n```\n\nJavaScriptはリスナーを登録し、ブラウザが操作を扱い、クリックが起きて初めてコールバックがコールスタックに届きます。ユーザーを待ってスタックに居座るわけではありません。\n\n```javascript\nfetch(\"/api/users\")\n  .then(response => response.json())\n  .then(users => {\n    console.log(users);\n  });\n```\n\nJavaScriptはリクエストを開始して先へ進み、ネットワークの処理はランタイムが担います。\n\n> <b>重要:</b> Promiseのコールバックは通常のコールバックキューではなく<b>マイクロタスクキュー</b>を使います。その違いが次のセクションです。\n\n---\n\n### コールバックキューとコールスタック\n\n```text\nCALL STACK                 CALLBACK QUEUE\n\n┌───────────────┐          ┌───────────────┐\n│ currently     │          │ waiting       │\n│ executing     │          │ callbacks     │\n└───────────────┘          └───────────────┘\n```\n\nイベントループが両者の調整役です。簡略化したモデル:\n\n```javascript\nwhile (true) {\n  if (callStackIsEmpty()) {\n    moveNextCallbackToStack();\n  }\n}\n```\n\nだから<b>JavaScriptはシングルスレッドでも非同期処理ができる</b>のです。待っているのはエンジンではありません。",
      },
      diagram: `                 JavaScript Runtime
┌─────────────────────────────────────────────┐
│   ┌──────────────┐                          │
│   │ Call Stack   │                          │
│   └──────┬───────┘                          │
│          │ start async operation            │
│          ▼                                  │
│   ┌──────────────┐                          │
│   │   Web APIs   │                          │
│   │ Timer        │                          │
│   │ DOM Events   │                          │
│   │ Network      │                          │
│   └──────┬───────┘                          │
│          │ callback ready                   │
│          ▼                                  │
│   ┌──────────────────┐                      │
│   │ Callback Queue   │                      │
│   └────────┬─────────┘                      │
│            │ Event Loop                     │
│            ▼                                │
│      ┌──────────────┐                       │
│      │ Call Stack   │                       │
│      └──────────────┘                       │
└─────────────────────────────────────────────┘


Is the Call Stack empty?
        │
     ┌──┴──┐
    NO     YES
    │       │
    │       ▼
    │   Take callback from queue
    │       │
    │       ▼
    │   Push onto Call Stack
    │
    └──→ Keep checking`,
      codeExample: {
        title: { en: "Started here, finished somewhere else", np: "यहाँ सुरु, अन्तै समाप्त", jp: "ここで始まり、別の場所で終わる" },
        code: `// ── 1. Basic — the timer does not pause JavaScript ────────────────
console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 1000);

console.log("End");
// Start, End, then Timer a second later

// ── 2. Intermediate — a zero delay still waits its turn ───────────
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
// A, C, B — never A, B, C

// ── 3. Advanced — a busy stack delays a ready callback ────────────
setTimeout(() => {
  console.log("Timer");
}, 0);

for (let i = 0; i < 1_000_000_000; i++) {
  // the callback is ready, but the stack is not free
}

console.log("End"); // End prints first, then Timer

// ── The same model covers events and network work ─────────────────
button.addEventListener("click", () => {
  console.log("Button clicked"); // browser holds this until a click
});

fetch("/api/users")
  .then(response => response.json())
  .then(users => console.log(users)); // promise work uses microtasks`,
      },
      keyTakeaways: [
        { en: "<b>Web APIs</b> handle browser-provided asynchronous capabilities such as timers, DOM events and networking.", np: "<b>Web API</b> ले timer, DOM event र networking जस्ता browser-प्रदत्त asynchronous क्षमता सम्हाल्छन्।", jp: "<b>Web API</b> はタイマー・DOMイベント・ネットワークなど、ブラウザが提供する非同期の機能を扱う。" },
        { en: "They operate <b>outside the JavaScript call stack</b>.", np: "तिनी <b>JavaScript call stack बाहिर</b> काम गर्छन्।", jp: "それらは<b>JavaScriptのコールスタックの外</b>で動く。" },
        { en: "When asynchronous work is ready, its callback is scheduled into a queue.", np: "Asynchronous काम तयार भएपछि, यसको callback queue मा schedule हुन्छ।", jp: "非同期の作業が整うと、そのコールバックはキューに入れられる。" },
        { en: "The <b>event loop</b> decides when a queued callback can enter the call stack.", np: "<b>Event loop</b> ले queue मा भएको callback कहिले call stack मा पस्न पाउँछ तय गर्छ।", jp: "<b>イベントループ</b>が、キュー内のコールバックをいつコールスタックに入れるか決める。" },
        { en: "`setTimeout(fn, 0)` does <b>not</b> mean \"run immediately\".", np: "`setTimeout(fn, 0)` को अर्थ \"तुरुन्तै चलाऊ\" <b>होइन</b>।", jp: "`setTimeout(fn, 0)` は「すぐ実行」という意味では<b>ない</b>。" },
        { en: "A callback cannot execute while the call stack is busy, so long synchronous work delays timers, events and rendering.", np: "Call stack व्यस्त हुँदा callback चल्न सक्दैन, त्यसैले लामो synchronous काले timer, event र rendering ढिलो पार्छ।", jp: "コールスタックが塞がっている間コールバックは実行できず、長い同期処理はタイマー・イベント・描画を遅らせる。" },
        { en: "The <b>callback queue</b> is different from the <b>microtask queue</b> used by Promise reactions.", np: "<b>Callback queue</b> Promise ले प्रयोग गर्ने <b>microtask queue</b> भन्दा फरक हो।", jp: "<b>コールバックキュー</b>は、Promiseが使う<b>マイクロタスクキュー</b>とは別物。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking `setTimeout(fn, 0)` runs immediately</b> — with `console.log(\"World\")` after it, the output is `World` then `Hello`. The callback waits for the current synchronous work.", np: "<b>`setTimeout(fn, 0)` तुरुन्तै चल्छ भन्ने ठान्नु</b> — पछि `console.log(\"World\")` भए, output `World` अनि `Hello` हुन्छ। Callback ले वर्तमान synchronous काम कुर्छ।", jp: "<b>`setTimeout(fn, 0)` がすぐ実行されると思う</b> — 後ろに `console.log(\"World\")` があれば出力は `World` の次に `Hello`。コールバックは現在の同期処理を待つ。" },
        { en: "<b>Thinking the timer callback sits on the call stack</b> — it does not wait there for a second. The Web API holds the timer, and the callback only arrives once the stack is free.", np: "<b>Timer को callback call stack मा बस्छ भन्ने ठान्नु</b> — यो त्यहाँ एक सेकेन्ड कुर्दैन। Web API ले timer राख्छ, र stack खाली भएपछि मात्र callback आउँछ।", jp: "<b>タイマーのコールバックがコールスタックに居ると思う</b> — そこで1秒待つわけではない。タイマーはWeb APIが保持し、スタックが空いてからコールバックが届く。" },
        { en: "<b>Thinking asynchronous means another JavaScript call stack</b> — the runtime may use other threads internally, but your JavaScript still runs on one main stack.", np: "<b>Asynchronous को अर्थ अर्को JavaScript call stack हो भन्ने ठान्नु</b> — runtime ले भित्री रूपमा अरू thread प्रयोग गर्न सक्छ, तर तपाईंको JavaScript एउटै मुख्य stack मा चल्छ।", jp: "<b>非同期＝別のJavaScriptコールスタック、と思う</b> — ランタイムは内部で他スレッドを使いうるが、あなたのJavaScriptは1つのメインスタックで動く。" },
        { en: "<b>Forgetting the call stack can block callbacks entirely</b> — with `while (true) {}` running, a ready timer callback never gets its turn.", np: "<b>Call stack ले callback पूरै रोक्न सक्छ भनी बिर्सनु</b> — `while (true) {}` चलिरहेको बेला, तयार timer callback ले कहिल्यै पालो पाउँदैन।", jp: "<b>コールスタックがコールバックを完全に塞ぐことを忘れる</b> — `while (true) {}` が動いている間、準備できたタイマーのコールバックは永遠に順番が来ない。" },
      ],
      quiz: [
        {
          question: { en: "Where does `setTimeout` wait while its timer is running?", np: "`setTimeout` को timer चल्दा यो कहाँ कुर्छ?", jp: "`setTimeout` のタイマーが動いている間、それはどこで待つか?" },
          options: [
            { en: "Call Stack", np: "Call Stack", jp: "コールスタック" },
            { en: "Web API / runtime timer", np: "Web API / runtime timer", jp: "Web API・ランタイムのタイマー" },
            { en: "Callback Queue", np: "Callback Queue", jp: "コールバックキュー" },
            { en: "Heap", np: "Heap", jp: "ヒープ" },
          ],
          correctIndex: 1,
          explanation: { en: "Only once the timer fires does its callback move to the queue.", np: "Timer बजेपछि मात्र यसको callback queue मा जान्छ।", jp: "タイマーが発火して初めて、コールバックはキューへ移る。" },
        },
        {
          question: { en: "What does `setTimeout(fn, 0)` mean?", np: "`setTimeout(fn, 0)` को अर्थ के हो?", jp: "`setTimeout(fn, 0)` はどういう意味か?" },
          options: [
            { en: "Run `fn` immediately", np: "`fn` तुरुन्तै चलाऊ", jp: "`fn` を即座に実行する" },
            { en: "Run `fn` before the next line", np: "अर्को line अघि `fn` चलाऊ", jp: "次の行より前に `fn` を実行する" },
            { en: "Make `fn` eligible to run as soon as scheduling allows", np: "Scheduling ले दिने बित्तिकै `fn` चल्न योग्य बनाऊ", jp: "スケジューリングが許し次第 `fn` を実行可能にする" },
            { en: "Run `fn` synchronously", np: "`fn` लाई synchronously चलाऊ", jp: "`fn` を同期的に実行する" },
          ],
          correctIndex: 2,
          explanation: { en: "The zero is a minimum delay, not a promise of immediate execution.", np: "शून्य न्यूनतम delay हो, तुरुन्तै चल्ने वाचा होइन।", jp: "0は最小の遅延であって、即時実行の保証ではない。" },
        },
        {
          question: { en: "What must generally happen before a queued callback can execute?", np: "Queue मा भएको callback चल्नुअघि सामान्यतया के हुनुपर्छ?", jp: "キュー内のコールバックが実行される前に、通常何が必要か?" },
          options: [
            { en: "The timer must be exactly 0ms", np: "Timer ठ्याक्कै 0ms हुनुपर्छ", jp: "タイマーがちょうど0msである必要がある" },
            { en: "The call stack must be available", np: "Call stack उपलब्ध हुनुपर्छ", jp: "コールスタックが空いている必要がある" },
            { en: "The browser must close", np: "Browser बन्द हुनुपर्छ", jp: "ブラウザを閉じる必要がある" },
            { en: "The callback must be manually invoked", np: "Callback हातले invoke गर्नुपर्छ", jp: "コールバックを手動で呼ぶ必要がある" },
          ],
          correctIndex: 1,
          explanation: { en: "The event loop only moves a callback onto an empty stack.", np: "Event loop ले खाली stack मा मात्र callback सार्छ।", jp: "イベントループは空いたスタックにしかコールバックを移さない。" },
        },
        {
          question: { en: "What is the output of `console.log(\"A\"); setTimeout(() => console.log(\"B\"), 0); console.log(\"C\");`?", np: "`console.log(\"A\"); setTimeout(() => console.log(\"B\"), 0); console.log(\"C\");` को output के हो?", jp: "`console.log(\"A\"); setTimeout(() => console.log(\"B\"), 0); console.log(\"C\");` の出力は?" },
          options: [
            { en: "A, B, C", np: "A, B, C", jp: "A, B, C" },
            { en: "A, C, B", np: "A, C, B", jp: "A, C, B" },
            { en: "B, A, C", np: "B, A, C", jp: "B, A, C" },
          ],
          correctIndex: 1,
          explanation: { en: "Both synchronous logs run first, then the queued callback.", np: "दुबै synchronous log पहिले चल्छन्, त्यसपछि queue को callback।", jp: "同期のログが両方先に実行され、その後にキューのコールバックが走る。" },
        },
        {
          question: { en: "Why can a `0ms` timer still execute much later?", np: "`0ms` को timer किन धेरै पछि चल्न सक्छ?", jp: "なぜ `0ms` のタイマーがずっと後に実行されうるのか?" },
          options: [
            { en: "Because the callback waits for the current work to finish and the event loop to schedule it", np: "किनकि callback ले वर्तमान काम सकिने र event loop ले schedule गर्ने कुर्छ", jp: "コールバックが現在の処理の完了とイベントループのスケジューリングを待つから" },
            { en: "Because timers are inaccurate by design", np: "किनकि timer डिजाइनले नै अशुद्ध हुन्छन्", jp: "タイマーは設計上不正確だから" },
            { en: "Because the browser throttles all timers to one second", np: "किनकि browser ले सबै timer एक सेकेन्डमा सीमित गर्छ", jp: "ブラウザがすべてのタイマーを1秒に制限するから" },
          ],
          correctIndex: 0,
          explanation: { en: "A long synchronous loop can hold the stack for as long as it runs.", np: "लामो synchronous loop ले चलेसम्म stack ओगट्न सक्छ।", jp: "長い同期ループは、動いている間ずっとスタックを占有しうる。" },
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
