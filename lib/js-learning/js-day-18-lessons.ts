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
            { en: "Its frame is deleted", np: "यसको frame मेटिन्छ", jp: "フレームが削除される" },
            { en: "Its frame is pushed onto the call stack", np: "यसको frame call stack मा push हुन्छ", jp: "そのフレームがコールスタックにpushされる" },
            { en: "It is moved to the heap", np: "यो heap मा सारिन्छ", jp: "ヒープに移動される" },
            { en: "The global context disappears", np: "Global context हराउँछ", jp: "グローバルコンテキストが消える" },
          ],
          correctIndex: 1,
          explanation: { en: "That frame carries the function's execution context and return point.", np: "त्यो frame ले function को execution context र return बिन्दु बोक्छ।", jp: "そのフレームが関数の実行コンテキストと戻り先を持つ。" },
        },
        {
          question: { en: "What happens when a function returns?", np: "Function return हुँदा के हुन्छ?", jp: "関数が戻ると何が起こるか?" },
          options: [
            { en: "A new frame is pushed", np: "नयाँ frame push हुन्छ", jp: "新しいフレームがpushされる" },
            { en: "The entire JavaScript program stops", np: "पूरै JavaScript program रोकिन्छ", jp: "JavaScriptプログラム全体が止まる" },
            { en: "Its frame is popped from the call stack", np: "यसको frame call stack बाट pop हुन्छ", jp: "そのフレームがコールスタックからpopされる" },
            { en: "The function moves to the heap", np: "Function heap मा सर्छ", jp: "関数がヒープに移動する" },
          ],
          correctIndex: 2,
          explanation: { en: "Execution resumes in whatever frame is now on top.", np: "अब टुप्पोमा जुन frame छ, execution त्यहीँ फर्किन्छ।", jp: "実行は、次に一番上になったフレームで再開する。" },
        },
        {
          question: { en: "With `a()` calling `b()` calling `c()` which logs \"Hello\", which function is on top of the stack while \"Hello\" prints?", np: "`a()` ले `b()` लाई, `b()` ले `c()` लाई call गर्दा र `c()` ले \"Hello\" देखाउँदा, stack को टुप्पोमा कुन function हुन्छ?", jp: "`a()` が `b()` を、`b()` が `c()` を呼び、`c()` が \"Hello\" を出力するとき、スタックの一番上はどれか?" },
          options: [
            { en: "`a()`", np: "`a()`", jp: "`a()`" },
            { en: "`b()`", np: "`b()`", jp: "`b()`" },
            { en: "Global", np: "Global", jp: "グローバル" },
            { en: "`c()`", np: "`c()`", jp: "`c()`" },
          ],
          correctIndex: 3,
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
      youtubeIds: ["8zKuNo4ay8E", "2WJL19wDH68"],
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
            { en: "The callback must be manually invoked", np: "Callback हातले invoke गर्नुपर्छ", jp: "コールバックを手動で呼ぶ必要がある" },
            { en: "The browser must close", np: "Browser बन्द हुनुपर्छ", jp: "ブラウザを閉じる必要がある" },
            { en: "The call stack must be available", np: "Call stack उपलब्ध हुनुपर्छ", jp: "コールスタックが空いている必要がある" },
          ],
          correctIndex: 3,
          explanation: { en: "The event loop only moves a callback onto an empty stack.", np: "Event loop ले खाली stack मा मात्र callback सार्छ।", jp: "イベントループは空いたスタックにしかコールバックを移さない。" },
        },
        {
          question: { en: "What is the output of `console.log(\"A\"); setTimeout(() => console.log(\"B\"), 0); console.log(\"C\");`?", np: "`console.log(\"A\"); setTimeout(() => console.log(\"B\"), 0); console.log(\"C\");` को output के हो?", jp: "`console.log(\"A\"); setTimeout(() => console.log(\"B\"), 0); console.log(\"C\");` の出力は?" },
          options: [
            { en: "A, C, B", np: "A, C, B", jp: "A, C, B" },
            { en: "A, B, C", np: "A, B, C", jp: "A, B, C" },
            { en: "B, A, C", np: "B, A, C", jp: "B, A, C" },
          ],
          correctIndex: 0,
          explanation: { en: "Both synchronous logs run first, then the queued callback.", np: "दुबै synchronous log पहिले चल्छन्, त्यसपछि queue को callback।", jp: "同期のログが両方先に実行され、その後にキューのコールバックが走る。" },
        },
        {
          question: { en: "Why can a `0ms` timer still execute much later?", np: "`0ms` को timer किन धेरै पछि चल्न सक्छ?", jp: "なぜ `0ms` のタイマーがずっと後に実行されうるのか?" },
          options: [
            { en: "Because timers are inaccurate by design", np: "किनकि timer डिजाइनले नै अशुद्ध हुन्छन्", jp: "タイマーは設計上不正確だから" },
            { en: "Because the callback waits for the current work to finish and the event loop to schedule it", np: "किनकि callback ले वर्तमान काम सकिने र event loop ले schedule गर्ने कुर्छ", jp: "コールバックが現在の処理の完了とイベントループのスケジューリングを待つから" },
            { en: "Because the browser throttles all timers to one second", np: "किनकि browser ले सबै timer एक सेकेन्डमा सीमित गर्छ", jp: "ブラウザがすべてのタイマーを1秒に制限するから" },
          ],
          correctIndex: 1,
          explanation: { en: "A long synchronous loop can hold the stack for as long as it runs.", np: "लामो synchronous loop ले चलेसम्म stack ओगट्न सक्छ।", jp: "長い同期ループは、動いている間ずっとスタックを占有しうる。" },
        },
      ],
    },
    {
      id: "microtask-vs-macrotask",
      title: { en: "Microtask vs Macrotask Queue", np: "Microtask vs Macrotask Queue", jp: "マイクロタスクとマクロタスクの違い" },
      durationMinutes: 9,
      explanation: {
        en: "Not all asynchronous JavaScript callbacks are scheduled in the same queue. JavaScript uses two important categories:\n\n• <b>Microtask queue</b> — higher priority\n• <b>Macrotask queue</b> — the regular task queue\n\n> <b>After the current synchronous code finishes, JavaScript completely drains the microtask queue before taking the next macrotask.</b>\n\nThis is why a Promise callback can run <b>before</b> a `setTimeout(..., 0)` callback, even when the timer was registered first.\n\n<b>Microtask sources:</b> `Promise.then()`, `Promise.catch()`, `Promise.finally()`, `queueMicrotask()`.\n\n<b>Macrotask sources:</b> `setTimeout()`, `setInterval()`, DOM events.\n\n---\n\n### 1. Basic — Promise vs setTimeout\n\n```javascript\nconsole.log(\"1\");\n\nsetTimeout(() => {\n  console.log(\"2\");\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log(\"3\");\n});\n\nconsole.log(\"4\");\n```\n\nOutput:\n\n```text\n1\n4\n3\n2\n```\n\nSynchronous code runs first (`1`, `4`). Then the stack empties and the queues hold:\n\n```text\nMicrotask Queue:  Promise → \"3\"\nMacrotask Queue:  setTimeout → \"2\"\n```\n\nMicrotasks have priority, so `3` runs, and only then `2`.\n\n---\n\n### 2. Intermediate — microtasks created by microtasks\n\n```javascript\nconsole.log(\"start\");\n\nPromise.resolve().then(() => {\n  console.log(\"A\");\n\n  Promise.resolve().then(() => {\n    console.log(\"B\");\n  });\n});\n\nsetTimeout(() => {\n  console.log(\"C\");\n}, 0);\n\nconsole.log(\"end\");\n```\n\nOutput:\n\n```text\nstart\nend\nA\nB\nC\n```\n\nWhy does `B` run before `C`? While `A` is running it creates another microtask. The event loop <b>does not jump to the timer</b> — it keeps draining microtasks until the queue is empty.\n\n> <b>Microtasks created during microtask processing are also processed before the next macrotask.</b>\n\n---\n\n### 3. Advanced — microtask starvation\n\nBecause the microtask queue must be completely drained, continuously creating microtasks can prevent timers from ever running.\n\n```javascript\nfunction keepRunning() {\n  queueMicrotask(() => {\n    console.log(\"microtask\");\n\n    keepRunning();\n  });\n}\n\nsetTimeout(() => {\n  console.log(\"timer\");\n}, 0);\n\nkeepRunning();\n```\n\nThe timer keeps waiting because the microtask queue never becomes empty. This is called <b>microtask starvation</b>, and in real applications excessive microtask work delays timers, user interactions and rendering.\n\n---\n\n### Promise callbacks are microtasks\n\n```javascript\nPromise.resolve(\"Hello\")\n  .then(value => {\n    console.log(value);\n  });\n\nconsole.log(\"World\");\n```\n\nOutput: `World` then `Hello`. Even though the Promise is already resolved, `.then()` does not run immediately — it schedules a microtask.\n\n---\n\n### A more realistic ordering\n\n```javascript\nconsole.log(\"Start\");\n\nsetTimeout(() => console.log(\"Timer 1\"), 0);\nPromise.resolve().then(() => console.log(\"Promise 1\"));\nsetTimeout(() => console.log(\"Timer 2\"), 0);\nPromise.resolve().then(() => console.log(\"Promise 2\"));\n\nconsole.log(\"End\");\n```\n\nOutput:\n\n```text\nStart\nEnd\nPromise 1\nPromise 2\nTimer 1\nTimer 2\n```\n\nThe loop is: run synchronous code, drain <b>all</b> microtasks, run one macrotask, drain microtasks again, and so on.\n\n---\n\n### The one rule to remember\n\n> <b>After the current JavaScript task finishes, the event loop drains the entire microtask queue before moving to the next macrotask.</b>\n\nThat single rule explains most Promise versus `setTimeout` interview questions.",
        np: "सबै asynchronous JavaScript callback एउटै queue मा schedule हुँदैनन्। JavaScript ले दुई महत्वपूर्ण वर्ग प्रयोग गर्छ:\n\n• <b>Microtask queue</b> — उच्च प्राथमिकता\n• <b>Macrotask queue</b> — सामान्य task queue\n\n> <b>वर्तमान synchronous code सकिएपछि, JavaScript ले अर्को macrotask लिनुअघि microtask queue पूरै खाली गर्छ।</b>\n\nत्यसैले timer पहिले दर्ता भए पनि Promise को callback `setTimeout(..., 0)` भन्दा <b>पहिले</b> चल्न सक्छ।\n\n<b>Microtask स्रोत:</b> `Promise.then()`, `Promise.catch()`, `Promise.finally()`, `queueMicrotask()`।\n\n<b>Macrotask स्रोत:</b> `setTimeout()`, `setInterval()`, DOM event।\n\n---\n\n### 1. आधारभूत — Promise vs setTimeout\n\n```javascript\nconsole.log(\"1\");\n\nsetTimeout(() => {\n  console.log(\"2\");\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log(\"3\");\n});\n\nconsole.log(\"4\");\n```\n\nOutput:\n\n```text\n1\n4\n3\n2\n```\n\nSynchronous code पहिले चल्छ (`1`, `4`)। त्यसपछि stack खाली हुन्छ र queue मा हुन्छ:\n\n```text\nMicrotask Queue:  Promise → \"3\"\nMacrotask Queue:  setTimeout → \"2\"\n```\n\nMicrotask लाई प्राथमिकता छ, त्यसैले `3` चल्छ, अनि मात्र `2`।\n\n---\n\n### 2. मध्यम — microtask ले बनाएका microtask\n\n```javascript\nconsole.log(\"start\");\n\nPromise.resolve().then(() => {\n  console.log(\"A\");\n\n  Promise.resolve().then(() => {\n    console.log(\"B\");\n  });\n});\n\nsetTimeout(() => {\n  console.log(\"C\");\n}, 0);\n\nconsole.log(\"end\");\n```\n\nOutput:\n\n```text\nstart\nend\nA\nB\nC\n```\n\n`B` किन `C` भन्दा पहिले चल्छ? `A` चल्दै गर्दा यसले अर्को microtask बनाउँछ। Event loop <b>timer तिर हाम फाल्दैन</b> — queue खाली नहुन्जेल microtask नै खाली गरिरहन्छ।\n\n> <b>Microtask process गर्दै गर्दा बनेका microtask पनि अर्को macrotask अघि process हुन्छन्।</b>\n\n---\n\n### 3. उन्नत — microtask starvation\n\nMicrotask queue पूरै खाली गर्नुपर्ने भएकाले, लगातार microtask बनाइरहँदा timer कहिल्यै चल्न नपाउने हुन सक्छ।\n\n```javascript\nfunction keepRunning() {\n  queueMicrotask(() => {\n    console.log(\"microtask\");\n\n    keepRunning();\n  });\n}\n\nsetTimeout(() => {\n  console.log(\"timer\");\n}, 0);\n\nkeepRunning();\n```\n\nMicrotask queue कहिल्यै खाली नहुने भएकाले timer कुरिरहन्छ। यसलाई <b>microtask starvation</b> भनिन्छ, र वास्तविक application मा अत्यधिक microtask काले timer, user अन्तरक्रिया र rendering ढिलो पार्छ।\n\n---\n\n### Promise का callback microtask हुन्\n\n```javascript\nPromise.resolve(\"Hello\")\n  .then(value => {\n    console.log(value);\n  });\n\nconsole.log(\"World\");\n```\n\nOutput: `World` अनि `Hello`। Promise पहिले नै resolve भइसके पनि, `.then()` तुरुन्तै चल्दैन — यसले microtask schedule गर्छ।\n\n---\n\n### अझ वास्तविक क्रम\n\n```javascript\nconsole.log(\"Start\");\n\nsetTimeout(() => console.log(\"Timer 1\"), 0);\nPromise.resolve().then(() => console.log(\"Promise 1\"));\nsetTimeout(() => console.log(\"Timer 2\"), 0);\nPromise.resolve().then(() => console.log(\"Promise 2\"));\n\nconsole.log(\"End\");\n```\n\nOutput:\n\n```text\nStart\nEnd\nPromise 1\nPromise 2\nTimer 1\nTimer 2\n```\n\nLoop यस्तो हो: synchronous code चलाऊ, <b>सबै</b> microtask खाली गर, एउटा macrotask चलाऊ, फेरि microtask खाली गर, र यसै गरी।\n\n---\n\n### सम्झनुपर्ने एउटै नियम\n\n> <b>वर्तमान JavaScript task सकिएपछि, event loop ले अर्को macrotask मा जानुअघि पूरै microtask queue खाली गर्छ।</b>\n\nयही एउटा नियमले धेरैजसो Promise vs `setTimeout` interview प्रश्न व्याख्या गर्छ।",
        jp: "すべての非同期コールバックが同じキューに入るわけではありません。JavaScriptは重要な2種類のキューを使います:\n\n• <b>マイクロタスクキュー</b> — 優先度が高い\n• <b>マクロタスクキュー</b> — 通常のタスクキュー\n\n> <b>現在の同期コードが終わると、JavaScriptは次のマクロタスクに移る前にマイクロタスクキューを完全に空にする。</b>\n\nだからタイマーを先に登録していても、Promiseのコールバックが `setTimeout(..., 0)` より<b>先に</b>走ることがあります。\n\n<b>マイクロタスクの発生源:</b> `Promise.then()`・`Promise.catch()`・`Promise.finally()`・`queueMicrotask()`。\n\n<b>マクロタスクの発生源:</b> `setTimeout()`・`setInterval()`・DOMイベント。\n\n---\n\n### 1. 基本 — PromiseとsetTimeout\n\n```javascript\nconsole.log(\"1\");\n\nsetTimeout(() => {\n  console.log(\"2\");\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log(\"3\");\n});\n\nconsole.log(\"4\");\n```\n\n出力:\n\n```text\n1\n4\n3\n2\n```\n\nまず同期コード（`1`・`4`）が走ります。スタックが空になると、キューはこうなっています:\n\n```text\nMicrotask Queue:  Promise → \"3\"\nMacrotask Queue:  setTimeout → \"2\"\n```\n\nマイクロタスクが優先されるので `3`、その後に `2` です。\n\n---\n\n### 2. 中級 — マイクロタスクが生むマイクロタスク\n\n```javascript\nconsole.log(\"start\");\n\nPromise.resolve().then(() => {\n  console.log(\"A\");\n\n  Promise.resolve().then(() => {\n    console.log(\"B\");\n  });\n});\n\nsetTimeout(() => {\n  console.log(\"C\");\n}, 0);\n\nconsole.log(\"end\");\n```\n\n出力:\n\n```text\nstart\nend\nA\nB\nC\n```\n\nなぜ `B` が `C` より先か? `A` の実行中に新しいマイクロタスクが作られるからです。イベントループは<b>タイマーへ飛ばず</b>、キューが空になるまでマイクロタスクを処理し続けます。\n\n> <b>マイクロタスクの処理中に生まれたマイクロタスクも、次のマクロタスクより先に処理される。</b>\n\n---\n\n### 3. 上級 — マイクロタスクの飢餓\n\nマイクロタスクキューは完全に空にされる必要があるため、作り続けるとタイマーが永遠に走れなくなります。\n\n```javascript\nfunction keepRunning() {\n  queueMicrotask(() => {\n    console.log(\"microtask\");\n\n    keepRunning();\n  });\n}\n\nsetTimeout(() => {\n  console.log(\"timer\");\n}, 0);\n\nkeepRunning();\n```\n\nキューが空にならないのでタイマーは待ち続けます。これを<b>マイクロタスクの飢餓</b>と呼び、実際のアプリでは過剰なマイクロタスクがタイマー・操作・描画を遅らせます。\n\n---\n\n### Promiseのコールバックはマイクロタスク\n\n```javascript\nPromise.resolve(\"Hello\")\n  .then(value => {\n    console.log(value);\n  });\n\nconsole.log(\"World\");\n```\n\n出力は `World` の次に `Hello`。すでに解決済みでも `.then()` は即座に走らず、マイクロタスクとして予約されます。\n\n---\n\n### より現実的な順序\n\n```javascript\nconsole.log(\"Start\");\n\nsetTimeout(() => console.log(\"Timer 1\"), 0);\nPromise.resolve().then(() => console.log(\"Promise 1\"));\nsetTimeout(() => console.log(\"Timer 2\"), 0);\nPromise.resolve().then(() => console.log(\"Promise 2\"));\n\nconsole.log(\"End\");\n```\n\n出力:\n\n```text\nStart\nEnd\nPromise 1\nPromise 2\nTimer 1\nTimer 2\n```\n\n流れは、同期コードを走らせ、<b>すべて</b>のマイクロタスクを空にし、マクロタスクを1つ実行し、また空にする、の繰り返しです。\n\n---\n\n### 覚えるべき唯一の規則\n\n> <b>現在のJavaScriptタスクが終わると、イベントループは次のマクロタスクに移る前にマイクロタスクキュー全体を空にする。</b>\n\nこの規則ひとつで、Promise対 `setTimeout` の面接問題のほとんどが説明できます。",
      },
      diagram: `                JavaScript Runtime
                       │
                       ▼
                ┌─────────────┐
                │  Call Stack │
                └──────┬──────┘
                       │ stack becomes empty
                       ▼
             ┌──────────────────┐
             │ Microtask Queue  │
             │ Promise.then()   │
             │ Promise.catch()  │
             │ queueMicrotask() │
             └────────┬─────────┘
                      │ DRAIN EVERYTHING
                      ▼
             ┌──────────────────┐
             │ Macrotask Queue  │
             │ setTimeout       │
             │ setInterval      │
             │ DOM events       │
             └────────┬─────────┘
                      ▼
                Back to Stack


The cycle

Call Stack → Microtasks → Macrotask → Microtasks → Macrotask → ...


Feature              Microtask          Macrotask
──────────────────────────────────────────────────────────
Priority             Higher             Lower
Examples             Promise.then()     setTimeout()
                     queueMicrotask()   setInterval()
Queue fully drained  Yes                No, one task at a time`,
      codeExample: {
        title: { en: "Microtasks first, every time", np: "पहिले microtask, हरेक पटक", jp: "毎回、まずマイクロタスク" },
        code: `// ── 1. Basic — the microtask beats the timer ──────────────────────
console.log("1");

setTimeout(() => console.log("2"), 0);      // macrotask
Promise.resolve().then(() => console.log("3")); // microtask

console.log("4");
// 1, 4, 3, 2

// ── 2. Intermediate — a microtask that queues another ─────────────
console.log("start");

Promise.resolve().then(() => {
  console.log("A");
  Promise.resolve().then(() => console.log("B")); // still drained first
});

setTimeout(() => console.log("C"), 0);

console.log("end");
// start, end, A, B, C — B beats C

// ── 3. Advanced — microtask starvation ────────────────────────────
function keepRunning() {
  queueMicrotask(() => {
    console.log("microtask");
    keepRunning(); // the queue never empties
  });
}

// setTimeout(() => console.log("timer"), 0);
// keepRunning(); // the timer never gets a turn

// ── A realistic ordering question ─────────────────────────────────
console.log("Start");

setTimeout(() => console.log("Timer 1"), 0);
Promise.resolve().then(() => console.log("Promise 1"));
setTimeout(() => console.log("Timer 2"), 0);
Promise.resolve().then(() => console.log("Promise 2"));

console.log("End");
// Start, End, Promise 1, Promise 2, Timer 1, Timer 2`,
      },
      keyTakeaways: [
        { en: "JavaScript has two queue categories: the <b>microtask queue</b> (higher priority) and the <b>macrotask queue</b>.", np: "JavaScript मा दुई queue वर्ग छन्: <b>microtask queue</b> (उच्च प्राथमिकता) र <b>macrotask queue</b>।", jp: "JavaScriptにはキューが2種類ある: <b>マイクロタスクキュー</b>（高優先）と<b>マクロタスクキュー</b>。" },
        { en: "`Promise.then()`, `catch()`, `finally()` and `queueMicrotask()` schedule <b>microtasks</b>.", np: "`Promise.then()`, `catch()`, `finally()` र `queueMicrotask()` ले <b>microtask</b> schedule गर्छन्।", jp: "`Promise.then()`・`catch()`・`finally()`・`queueMicrotask()` は<b>マイクロタスク</b>を予約する。" },
        { en: "`setTimeout()`, `setInterval()` and DOM events schedule <b>macrotasks</b>.", np: "`setTimeout()`, `setInterval()` र DOM event ले <b>macrotask</b> schedule गर्छन्।", jp: "`setTimeout()`・`setInterval()`・DOMイベントは<b>マクロタスク</b>を予約する。" },
        { en: "The microtask queue is <b>fully drained</b> before the next macrotask runs.", np: "अर्को macrotask चल्नुअघि microtask queue <b>पूरै खाली</b> हुन्छ।", jp: "次のマクロタスクの前に、マイクロタスクキューは<b>完全に空</b>にされる。" },
        { en: "Microtasks created <b>during</b> microtask processing are drained too, before any macrotask.", np: "Microtask process गर्दै <b>बनेका</b> microtask पनि कुनै macrotask अघि खाली हुन्छन्।", jp: "マイクロタスク処理<b>中</b>に生まれたものも、マクロタスクより先に処理される。" },
        { en: "Endlessly queueing microtasks causes <b>microtask starvation</b>, delaying timers and rendering.", np: "अनन्त रूपमा microtask थप्दा <b>microtask starvation</b> हुन्छ, timer र rendering ढिलो हुन्छ।", jp: "際限なくマイクロタスクを積むと<b>マイクロタスクの飢餓</b>が起き、タイマーや描画が遅れる。" },
        { en: "A resolved Promise's `.then()` still runs asynchronously — it schedules, it does not execute now.", np: "Resolve भइसकेको Promise को `.then()` पनि asynchronously चल्छ — यसले schedule गर्छ, अहिले चलाउँदैन।", jp: "解決済みPromiseの `.then()` も非同期に走る。今すぐ実行ではなく予約される。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking `setTimeout(fn, 0)` runs immediately</b> — with a `console.log(\"done\")` after it, `done` prints first. Zero is a minimum delay, not an instruction to run now.", np: "<b>`setTimeout(fn, 0)` तुरुन्तै चल्छ भन्ने ठान्नु</b> — पछि `console.log(\"done\")` भए, `done` पहिले देखिन्छ। शून्य न्यूनतम delay हो, अहिले चलाउने आदेश होइन।", jp: "<b>`setTimeout(fn, 0)` がすぐ走ると思う</b> — 後ろに `console.log(\"done\")` があれば `done` が先。0は最小の遅延であって即時実行の指示ではない。" },
        { en: "<b>Thinking Promise callbacks run synchronously</b> — `console.log(\"A\"); Promise.resolve().then(() => console.log(\"B\")); console.log(\"C\");` prints `A C B`.", np: "<b>Promise का callback synchronously चल्छन् भन्ने ठान्नु</b> — `console.log(\"A\"); Promise.resolve().then(() => console.log(\"B\")); console.log(\"C\");` ले `A C B` देखाउँछ।", jp: "<b>Promiseのコールバックが同期的に走ると思う</b> — `console.log(\"A\"); Promise.resolve().then(() => console.log(\"B\")); console.log(\"C\");` は `A C B` を出す。" },
        { en: "<b>Thinking the queues alternate one-for-one</b> — it is not microtask, macrotask, microtask, macrotask. <b>All</b> queued microtasks drain before the next macrotask.", np: "<b>Queue एक-एक गरी पालो लिन्छन् भन्ने ठान्नु</b> — यो microtask, macrotask, microtask, macrotask होइन। अर्को macrotask अघि <b>सबै</b> microtask खाली हुन्छन्।", jp: "<b>キューが1つずつ交互だと思う</b> — マイクロ・マクロ・マイクロ・マクロではない。次のマクロタスクの前に<b>すべて</b>のマイクロタスクが処理される。" },
      ],
      quiz: [
        {
          question: { en: "What is the output of `console.log(\"A\"); setTimeout(() => console.log(\"B\"), 0); Promise.resolve().then(() => console.log(\"C\")); console.log(\"D\");`?", np: "`console.log(\"A\"); setTimeout(() => console.log(\"B\"), 0); Promise.resolve().then(() => console.log(\"C\")); console.log(\"D\");` को output के हो?", jp: "`console.log(\"A\"); setTimeout(() => console.log(\"B\"), 0); Promise.resolve().then(() => console.log(\"C\")); console.log(\"D\");` の出力は?" },
          options: [
            { en: "`A B C D`", np: "`A B C D`", jp: "`A B C D`" },
            { en: "`A D B C`", np: "`A D B C`", jp: "`A D B C`" },
            { en: "`A D C B`", np: "`A D C B`", jp: "`A D C B`" },
            { en: "`C A D B`", np: "`C A D B`", jp: "`C A D B`" },
          ],
          correctIndex: 2,
          explanation: { en: "Synchronous logs first, then the microtask, then the timer.", np: "पहिले synchronous log, त्यसपछि microtask, अनि timer।", jp: "まず同期のログ、次にマイクロタスク、最後にタイマー。" },
        },
        {
          question: { en: "Which has higher priority after the current task?", np: "वर्तमान task पछि कसको प्राथमिकता उच्च छ?", jp: "現在のタスクの後、優先度が高いのはどれか?" },
          options: [
            { en: "`setTimeout()`", np: "`setTimeout()`", jp: "`setTimeout()`" },
            { en: "A DOM event", np: "DOM event", jp: "DOMイベント" },
            { en: "`setInterval()`", np: "`setInterval()`", jp: "`setInterval()`" },
            { en: "Promise `.then()`", np: "Promise `.then()`", jp: "Promise の `.then()`" },
          ],
          correctIndex: 3,
          explanation: { en: "Promise callbacks are microtasks; the other three are macrotasks.", np: "Promise का callback microtask हुन्; बाँकी तीन macrotask हुन्।", jp: "Promiseのコールバックはマイクロタスク。他の3つはマクロタスク。" },
        },
        {
          question: { en: "For `Promise.resolve().then(() => { console.log(\"A\"); Promise.resolve().then(() => console.log(\"B\")); }); setTimeout(() => console.log(\"C\"), 0);` what is the order?", np: "`Promise.resolve().then(() => { console.log(\"A\"); Promise.resolve().then(() => console.log(\"B\")); }); setTimeout(() => console.log(\"C\"), 0);` को क्रम के हो?", jp: "`Promise.resolve().then(() => { console.log(\"A\"); Promise.resolve().then(() => console.log(\"B\")); }); setTimeout(() => console.log(\"C\"), 0);` の順序は?" },
          options: [
            { en: "`A B C`", np: "`A B C`", jp: "`A B C`" },
            { en: "`A C B`", np: "`A C B`", jp: "`A C B`" },
            { en: "`C A B`", np: "`C A B`", jp: "`C A B`" },
            { en: "`B A C`", np: "`B A C`", jp: "`B A C`" },
          ],
          correctIndex: 0,
          explanation: { en: "The microtask created inside a microtask is drained before the timer gets a turn.", np: "Microtask भित्र बनेको microtask timer ले पालो पाउनुअघि खाली हुन्छ।", jp: "マイクロタスク内で作られたマイクロタスクも、タイマーの順番より先に処理される。" },
        },
        {
          question: { en: "What is microtask starvation?", np: "Microtask starvation के हो?", jp: "マイクロタスクの飢餓とは何か?" },
          options: [
            { en: "Microtasks that never get scheduled", np: "कहिल्यै schedule नहुने microtask", jp: "決してスケジュールされないマイクロタスク" },
            { en: "Endlessly queued microtasks preventing macrotasks from running", np: "अनन्त रूपमा queue भएका microtask ले macrotask चल्न नदिनु", jp: "際限なく積まれたマイクロタスクがマクロタスクの実行を妨げること" },
            { en: "A browser memory limit", np: "Browser को memory सीमा", jp: "ブラウザのメモリ上限" },
          ],
          correctIndex: 1,
          explanation: { en: "Because the queue must fully drain, a self-requeuing microtask blocks timers forever.", np: "Queue पूरै खाली हुनुपर्ने भएकाले, आफैं फेरि queue हुने microtask ले timer सधैंका लागि रोक्छ।", jp: "キューは完全に空にされる必要があるため、自分を再登録し続けるマイクロタスクはタイマーを永久に阻む。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What does the call stack keep track of?", np: "Call stack ले केको हिसाब राख्छ?", jp: "コールスタックは何を追跡するか?" },
      options: [
        { en: "Which function is currently executing", np: "अहिले कुन function चलिरहेको छ", jp: "今どの関数が実行中か" },
        { en: "Every variable in the program", np: "Program का हरेक variable", jp: "プログラムのすべての変数" },
        { en: "All pending network requests", np: "सबै बाँकी network request", jp: "保留中のすべてのネットワーク要求" },
      ],
      correctIndex: 0,
      explanation: { en: "It holds execution frames in LIFO order; the top frame is running.", np: "यसले execution frame लाई LIFO क्रममा राख्छ; टुप्पोको frame चलिरहेको हुन्छ।", jp: "実行フレームをLIFOで保持する。一番上のフレームが実行中。" },
    },
    {
      question: { en: "What happens when a function returns?", np: "Function return हुँदा के हुन्छ?", jp: "関数が戻ると何が起こるか?" },
      options: [
        { en: "A new frame is pushed", np: "नयाँ frame push हुन्छ", jp: "新しいフレームがpushされる" },
        { en: "Its frame is popped from the stack", np: "यसको frame stack बाट pop हुन्छ", jp: "そのフレームがスタックからpopされる" },
        { en: "It moves to the heap", np: "यो heap मा सर्छ", jp: "ヒープに移動する" },
      ],
      correctIndex: 1,
      explanation: { en: "Execution resumes in whichever frame is now on top.", np: "अब टुप्पोमा भएको frame मा execution फर्किन्छ।", jp: "実行は、次に一番上になったフレームで再開する。" },
    },
    {
      question: { en: "Why does infinite recursion throw `RangeError: Maximum call stack size exceeded`?", np: "अनन्त recursion ले `RangeError: Maximum call stack size exceeded` किन दिन्छ?", jp: "無限再帰が `RangeError: Maximum call stack size exceeded` を投げるのはなぜか?" },
      options: [
        { en: "The heap runs out of memory", np: "Heap को memory सकिन्छ", jp: "ヒープのメモリが尽きるから" },
        { en: "Recursion is disallowed in strict mode", np: "Strict mode मा recursion निषेध छ", jp: "strictモードでは再帰が禁止されているから" },
        { en: "Frames accumulate because none of the calls ever return", np: "कुनै call return नहुने भएकाले frame थुप्रिन्छन्", jp: "どの呼び出しも戻らないためフレームが積み上がるから" },
      ],
      correctIndex: 2,
      explanation: { en: "A base case lets each frame return so the stack can unwind.", np: "Base case ले हरेक frame return गर्न दिन्छ ताकि stack खाली होस्।", jp: "基底条件があれば各フレームが戻れ、スタックがほどける。" },
    },
    {
      question: { en: "Where does a `setTimeout` timer wait while it counts down?", np: "`setTimeout` को timer गन्ती गर्दै गर्दा कहाँ कुर्छ?", jp: "`setTimeout` のタイマーはカウント中どこで待つか?" },
      options: [
        { en: "In the Web API / runtime, outside the call stack", np: "Call stack बाहिर, Web API / runtime मा", jp: "コールスタックの外、Web APIやランタイムの中" },
        { en: "On the call stack", np: "Call stack मा", jp: "コールスタック上" },
        { en: "In the heap", np: "Heap मा", jp: "ヒープの中" },
      ],
      correctIndex: 0,
      explanation: { en: "Only when it fires does the callback move into a queue.", np: "यो बजेपछि मात्र callback queue मा जान्छ।", jp: "発火して初めてコールバックがキューへ移る。" },
    },
    {
      question: { en: "What does `setTimeout(fn, 0)` actually mean?", np: "`setTimeout(fn, 0)` को वास्तविक अर्थ के हो?", jp: "`setTimeout(fn, 0)` の実際の意味は?" },
      options: [
        { en: "Run `fn` before the next statement", np: "अर्को statement अघि `fn` चलाऊ", jp: "次の文より前に `fn` を実行する" },
        { en: "Run `fn` as soon as scheduling allows, not immediately", np: "Scheduling ले दिने बित्तिकै `fn` चलाऊ, तुरुन्तै होइन", jp: "即時ではなく、スケジューリングが許し次第 `fn` を実行する" },
        { en: "Run `fn` on another thread", np: "अर्को thread मा `fn` चलाऊ", jp: "別スレッドで `fn` を実行する" },
      ],
      correctIndex: 1,
      explanation: { en: "It still waits for the current synchronous work and the event loop.", np: "यसले अझै वर्तमान synchronous काम र event loop कुर्छ।", jp: "それでも現在の同期処理とイベントループを待つ。" },
    },
    {
      question: { en: "Why can a long `for` loop delay a `0ms` timer callback?", np: "लामो `for` loop ले `0ms` timer callback किन ढिलो पार्छ?", jp: "長い `for` ループが `0ms` のタイマーコールバックを遅らせるのはなぜか?" },
      options: [
        { en: "Loops cancel pending timers", np: "Loop ले बाँकी timer रद्द गर्छ", jp: "ループが保留中のタイマーを取り消すから" },
        { en: "The timer restarts each iteration", np: "हरेक iteration मा timer पुनः सुरु हुन्छ", jp: "反復ごとにタイマーが再開するから" },
        { en: "The callback cannot run while the call stack is busy", np: "Call stack व्यस्त हुँदा callback चल्न सक्दैन", jp: "コールスタックが塞がっている間、コールバックは実行できないから" },
      ],
      correctIndex: 2,
      explanation: { en: "The event loop only moves a callback onto an empty stack.", np: "Event loop ले खाली stack मा मात्र callback सार्छ।", jp: "イベントループは空いたスタックにしかコールバックを移さない。" },
    },
    {
      question: { en: "Which queue do `Promise.then()` callbacks use?", np: "`Promise.then()` का callback कुन queue प्रयोग गर्छन्?", jp: "`Promise.then()` のコールバックはどのキューを使うか?" },
      options: [
        { en: "The microtask queue", np: "Microtask queue", jp: "マイクロタスクキュー" },
        { en: "The macrotask queue", np: "Macrotask queue", jp: "マクロタスクキュー" },
        { en: "The call stack", np: "Call stack", jp: "コールスタック" },
      ],
      correctIndex: 0,
      explanation: { en: "That is why a promise callback can beat a timer registered before it.", np: "त्यसैले अघि दर्ता भएको timer भन्दा promise को callback पहिले चल्न सक्छ।", jp: "だから先に登録されたタイマーより、Promiseのコールバックが先に走りうる。" },
    },
    {
      question: { en: "How many microtasks run before the next macrotask?", np: "अर्को macrotask अघि कति microtask चल्छन्?", jp: "次のマクロタスクの前にいくつのマイクロタスクが走るか?" },
      options: [
        { en: "Exactly one", np: "ठ्याक्कै एउटा", jp: "ちょうど1つ" },
        { en: "All of them, including any queued during processing", np: "सबै, process गर्दै queue भएका समेत", jp: "処理中に積まれたものも含めてすべて" },
        { en: "None — they alternate", np: "कुनै पनि होइन — तिनी पालैपालो आउँछन्", jp: "0個。交互に処理される" },
      ],
      correctIndex: 1,
      explanation: { en: "The queue is fully drained, which is what makes starvation possible.", np: "Queue पूरै खाली हुन्छ, त्यसैले starvation सम्भव हुन्छ।", jp: "キューは完全に空にされる。だからこそ飢餓が起こりうる。" },
    },
    {
      question: { en: "What is the output of `console.log(\"1\"); setTimeout(() => console.log(\"2\"), 0); Promise.resolve().then(() => console.log(\"3\")); console.log(\"4\");`?", np: "`console.log(\"1\"); setTimeout(() => console.log(\"2\"), 0); Promise.resolve().then(() => console.log(\"3\")); console.log(\"4\");` को output के हो?", jp: "`console.log(\"1\"); setTimeout(() => console.log(\"2\"), 0); Promise.resolve().then(() => console.log(\"3\")); console.log(\"4\");` の出力は?" },
      options: [
        { en: "`1 4 2 3`", np: "`1 4 2 3`", jp: "`1 4 2 3`" },
        { en: "`1 2 3 4`", np: "`1 2 3 4`", jp: "`1 2 3 4`" },
        { en: "`1 4 3 2`", np: "`1 4 3 2`", jp: "`1 4 3 2`" },
      ],
      correctIndex: 2,
      explanation: { en: "Synchronous first, then the microtask, then the macrotask.", np: "पहिले synchronous, त्यसपछि microtask, अनि macrotask।", jp: "まず同期、次にマイクロタスク、最後にマクロタスク。" },
    },
  ],
};
