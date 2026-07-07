import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_4_LESSONS: JsLessonDay = {
  day: 4,
  title: { en: "Closures, Higher-Order Functions & Currying", np: "Closures, Higher-Order Functions र Currying", jp: "クロージャ・高階関数・カリー化" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "closures",
      title: { en: "Closures — the Foundation", np: "Closures — आधार", jp: "クロージャの基礎" },
      durationMinutes: 9,
      explanation: {
        en: "Picture a function as a person leaving home for a trip. Normally, once they leave, everything back at the house is gone from their perspective. A <b>closure</b> is that person packing a backpack before leaving — a backpack containing direct access to specific things from home, not photocopies. Even far away, they can reach into the backpack and read or change what's inside, and it stays in sync with the original.\n\nThat backpack is exactly what an inner function carries: a live link to the variables of the outer function it was created in, available anytime the inner function is later called — no matter how much later, or from how far away in the code.\n\n• <b>A closure is created every time a function is created inside another function.</b> The inner function keeps a live reference, not a snapshot copy.\n• <b>Memory implication:</b> closures keep outer variables alive as long as the closure exists — be careful with closures inside event listeners or timers.",
        np: "Closure लाई यात्रामा जाने व्यक्तिले घरबाटै केही सामान backpack मा राखेको जस्तो सोच्नुहोस् — टाढा पुगे पनि backpack भित्रको सामान access गर्न सक्छ।",
        jp: "クロージャは、旅に出る人が家から特定のものへの直接アクセスをバックパックに入れて持って行くようなもの。遠くにいてもバックパックの中身にアクセスできる。",
      },
      diagram: `function outer() {
  let count = 0;              ← lives in outer's scope
  return function inner() {
    count++;                  ← inner "closes over" count (backpack)
    return count;
  };
}
const increment = outer();    ← outer() has finished running...
increment();  // 1             ...but 'count' is still alive via the backpack
increment();  // 2
increment();  // 3`,
      codeExample: {
        title: { en: "A closure keeps the outer variable alive", np: "Closure ले outer variable जिउँदो राख्छ", jp: "クロージャは外部変数を保持する" },
        code: `function outer() {
  let count = 0;        // this variable lives in outer's scope
  return function inner() {
    count++;            // inner "closes over" count
    return count;
  };
}

const increment = outer(); // outer() runs and returns inner
console.log(increment()); // 1
console.log(increment()); // 2

// Each call to outer() creates a separate closure with its own 'count'
const incrementA = outer();
const incrementB = outer();
incrementA(); // 1
incrementB(); // 1  — completely separate count

// ── Practical use case: private state via a factory function ──────
function createBankAccount(initialBalance) {
  let balance = initialBalance;  // private — not accessible from outside
  return {
    deposit:    (amount) => { balance += amount; },
    getBalance: ()       => balance,
  };
}
const account = createBankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150`,
      },
      keyTakeaways: [
        { en: "A closure is created every time a function is created inside another function — the inner function keeps a live reference, not a snapshot.", np: "Closure हरेक पटक inner function create हुँदा बन्छ — यसले live reference राख्छ, snapshot होइन।", jp: "クロージャは関数の中で関数が作られるたびに生成される。コピーではなく生きた参照を保持する。" },
        { en: "Each call to the outer function creates a fresh, independent closure — separate calls never share the same captured variable.", np: "Outer function को हरेक call ले नयाँ, independent closure बनाउँछ — captured variable share हुँदैन।", jp: "外側の関数を呼ぶたびに独立した新しいクロージャが生成され、キャプチャした変数を共有しない。" },
        { en: "Closures are the standard way to create private state in JavaScript, without needing a class.", np: "Class बिना private state बनाउने standard तरिका closure हो।", jp: "クラスなしでプライベートな状態を作る標準的な方法がクロージャ。" },
      ],
      commonMistakes: [
        { en: "Assuming multiple calls to the same factory function share the captured variable — each call gets its own independent copy.", np: "एउटै factory function को धेरै call ले captured variable share गर्छ भन्ने ठान्नु — हरेक call को आफ्नै independent copy हुन्छ।", jp: "同じファクトリ関数の複数呼び出しがキャプチャした変数を共有すると思うこと。実際は各呼び出しが独立したコピーを持つ。" },
        { en: "Forgetting that closures keep referenced variables alive in memory, causing quiet memory growth in long-lived event listeners or timers.", np: "Closure ले reference गरिएको variable memory मा जिउँदो राख्छ भन्ने बिर्सनु, event listener/timer मा memory growth हुनु।", jp: "クロージャが参照する変数をメモリに保持し続けることを忘れ、長寿命のイベントリスナーやタイマーで静かにメモリが増えること。" },
        { en: "Trying to read a closure's captured variable from outside the returned function — it's only reachable through that function's own logic.", np: "Return भएको function बाहिरबाट closure को captured variable पढ्ने प्रयास गर्नु — त्यो function को logic बाट मात्र पुग्न सकिन्छ।", jp: "返された関数の外からクロージャのキャプチャした変数を読もうとすること。その関数のロジックを通してのみ到達できる。" },
      ],
      quiz: [
        {
          question: { en: "After `const increment = outer();` runs and `outer`'s call finishes, is the local variable `count` inside `outer` gone?", np: "`outer()` call सकिएपछि `outer` भित्रको `count` हराउँछ?", jp: "`outer`の呼び出しが終わった後、内部の`count`は消える？" },
          options: [{ en: "Yes, it's garbage collected immediately", np: "हो, तुरुन्तै garbage collect हुन्छ", jp: "はい、すぐにガベージコレクトされる" }, { en: "No — the returned inner function keeps it alive via a closure", np: "होइन — return भएको inner function ले closure मार्फत जिउँदो राख्छ", jp: "いいえ — 返された内側の関数がクロージャで保持し続ける" }],
          correctIndex: 1,
          explanation: { en: "As long as something still references count (the inner function), it stays alive in memory.", np: "count लाई कोहीले (inner function) reference गरेसम्म यो memory मा जिउँदो रहन्छ।", jp: "何か（内側の関数）がcountを参照し続ける限り、メモリ内で生き続ける。" },
        },
        {
          question: { en: "Do two separate calls to `outer()` share the same closed-over variable?", np: "`outer()` का दुई फरक call ले same closed-over variable share गर्छन्?", jp: "`outer()`の2つの別の呼び出しは同じクロージャ変数を共有する？" },
          options: [{ en: "Yes, they share one variable", np: "हो, एउटै variable share गर्छन्", jp: "はい、1つの変数を共有する" }, { en: "No, each call gets its own independent copy", np: "होइन, हरेक call को आफ्नै independent copy हुन्छ", jp: "いいえ、各呼び出しは独立したコピーを持つ" }],
          correctIndex: 1,
          explanation: { en: "Each invocation of outer() creates a brand new scope and a brand new closure.", np: "`outer()` को हरेक invocation ले नयाँ scope र नयाँ closure बनाउँछ।", jp: "outer()を呼び出すたびに新しいスコープと新しいクロージャが作られる。" },
        },
        {
          question: { en: "What is one common risk of closures?", np: "Closure को एक सामान्य जोखिम के हो?", jp: "クロージャの一般的なリスクの1つは？" },
          options: [{ en: "They run slower than regular functions", np: "Regular function भन्दा ढिलो चल्छ", jp: "通常の関数より実行が遅い" }, { en: "They can keep variables alive in memory longer than expected if not cleaned up", np: "Cleanup नगरेमा variable अनुमान भन्दा बढी समय memory मा जिउँदो रहन सक्छ", jp: "クリーンアップしないと変数が予想より長くメモリに残ることがある" }],
          correctIndex: 1,
          explanation: { en: "Closures attached to long-lived listeners or timers can quietly prevent garbage collection.", np: "लामो समयसम्म रहने listener/timer मा जोडिएको closure ले garbage collection रोक्न सक्छ।", jp: "長寿命のリスナーやタイマーに結び付いたクロージャはガベージコレクションを静かに妨げることがある。" },
        },
      ],
    },
    {
      id: "higher-order-functions",
      title: { en: "Higher-Order Functions", np: "Higher-Order Functions", jp: "高階関数" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>higher-order function</b> is a function that either takes a function as an argument, returns a function, or both. This is possible only because functions in JavaScript are <b>first-class values</b> — exactly like a number or a string, they can be stored in a variable, passed as an argument, and returned from another function.\n\n• Passing a function in lets the caller plug in custom behaviour without the higher-order function needing to know the details\n  ↳ `array.map(fn)` doesn't know what `fn` does — it just calls it for every item\n• Returning a function out lets you generate specialised, ready-to-use functions on demand\n  ↳ A closure factory (like `createMultiplier` from Day 3/4's closures section) is already a higher-order function",
        np: "Higher-order function एउटा function हो जसले argument को रूपमा function लिन्छ वा function return गर्छ। JS मा functions first-class values हुन्।",
        jp: "高階関数とは引数として関数を受け取るか、関数を返す関数のこと。JavaScriptの関数はファーストクラス値。",
      },
      diagram: `Function IN                          Function OUT
──────────────────                   ──────────────────
numbers.map(fn)      ← fn passed in   function withLogging(fn) {
numbers.filter(fn)                       return function(...args) { ... }
numbers.reduce(fn)                    }  ← a NEW function returned
                                       "higher-order" = either direction (or both)`,
      codeExample: {
        title: { en: "Functions as arguments and return values", np: "Argument र return value को रूपमा function", jp: "引数と戻り値としての関数" },
        code: `// ── Functions as arguments ───────────────────────────────────────
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);           // call the passed function
  }
}
repeat(3, (i) => console.log(\`Step \${i}\`));
// Step 0 / Step 1 / Step 2

// ── Functions returning functions ────────────────────────────────
function withLogging(fn) {
  return function (...args) {
    console.log("Calling with", args);
    const result = fn(...args);
    console.log("Result:", result);
    return result;
  };
}
const addLogged = withLogging((a, b) => a + b);
addLogged(2, 3);  // logs "Calling with [2, 3]" and "Result: 5"

// ── Common built-in higher-order functions you use every day ──────
const numbers = [1, 2, 3, 4, 5];
numbers.filter(n => n % 2 === 0);      // [2, 4]
numbers.map(n => n * 2);               // [2, 4, 6, 8, 10]
numbers.reduce((acc, n) => acc + n, 0); // 15`,
      },
      keyTakeaways: [
        { en: "A higher-order function takes a function as an argument, returns one, or both — this is only possible because functions are first-class values in JavaScript.", np: "Higher-order function ले function लिन्छ, return गर्छ, वा दुवै गर्छ — JS मा functions first-class values भएकाले सम्भव हुन्छ।", jp: "高階関数は関数を引数に取るか返すか、または両方を行う。JavaScriptの関数がファーストクラス値だからこそ可能。" },
        { en: "Built-in array methods like `.map()`, `.filter()`, and `.reduce()` are higher-order functions you already use daily.", np: "`.map()`, `.filter()`, `.reduce()` जस्ता built-in array methods दिनहुँ प्रयोग गरिने higher-order functions हुन्।", jp: "`.map()`・`.filter()`・`.reduce()`のような組み込み配列メソッドは日常的に使う高階関数。" },
        { en: "Passing a function in decouples the \"what to loop over\" from the \"what to do with each item\" — the caller supplies the behaviour.", np: "Function pass गर्नाले 'के loop गर्ने' र 'हरेक item मा के गर्ने' छुट्टिन्छ — caller ले behaviour दिन्छ।", jp: "関数を渡すことで「何をループするか」と「各項目に何をするか」が分離される。呼び出し側が動作を提供する。" },
      ],
      commonMistakes: [
        { en: "Passing a function call (`fn()`) instead of a function reference (`fn`) to a higher-order function — this calls it immediately instead of passing it along.", np: "Higher-order function मा function reference (`fn`) को सट्टा function call (`fn()`) pass गर्नु — यसले तुरुन्तै call गर्छ।", jp: "高階関数に関数参照（`fn`）ではなく関数呼び出し（`fn()`）を渡すこと。即座に呼び出されてしまう。" },
        { en: "Forgetting that `.map()`/`.filter()` return NEW arrays and don't mutate the original.", np: "`.map()`/`.filter()` ले नयाँ array फर्काउँछ र original मुटेट गर्दैन भन्ने बिर्सनु।", jp: "`.map()`/`.filter()`が新しい配列を返し、元を変更しないことを忘れること。" },
        { en: "Using `.forEach()` when you actually need a returned value — forEach always returns undefined, unlike map/filter/reduce.", np: "Return value चाहिँदा `.forEach()` प्रयोग गर्नु — forEach ले सधैं undefined फर्काउँछ।", jp: "戻り値が必要なのに`.forEach()`を使うこと。forEachは常にundefinedを返す。" },
      ],
      quiz: [
        {
          question: { en: "What makes a function a \"higher-order function\"?", np: "कुन कुराले function लाई 'higher-order function' बनाउँछ?", jp: "何が関数を「高階関数」にする？" },
          options: [{ en: "It runs faster than normal functions", np: "Normal function भन्दा छिटो चल्छ", jp: "通常の関数より速く実行される" }, { en: "It takes a function as an argument, returns one, or both", np: "यसले function argument को रूपमा लिन्छ, return गर्छ, वा दुवै गर्छ", jp: "関数を引数に取るか返すか、または両方を行う" }],
          correctIndex: 1,
          explanation: { en: "The defining trait is treating functions as values passed in or returned.", np: "Function लाई value को रूपमा pass वा return गर्नु नै defining trait हो।", jp: "関数を値として渡すか返すことが定義的な特徴。" },
        },
        {
          question: { en: "Which of these is a built-in higher-order function you use daily?", np: "यीमध्ये कुन दिनहुँ प्रयोग गरिने built-in higher-order function हो?", jp: "次のうち日常的に使う組み込み高階関数はどれ？" },
          options: [{ en: "Array.prototype.map", np: "Array.prototype.map", jp: "Array.prototype.map" }, { en: "Number.parseInt", np: "Number.parseInt", jp: "Number.parseInt" }],
          correctIndex: 0,
          explanation: { en: "map() takes a function as an argument and calls it for each array item — a classic higher-order function.", np: "map() ले function argument लिन्छ र हरेक array item मा call गर्छ — classic higher-order function.", jp: "map()は関数を引数に取り各配列要素に対して呼び出す — 典型的な高階関数。" },
        },
        {
          question: { en: "What's wrong with passing `doThing()` instead of `doThing` to a higher-order function like `repeat(3, doThing())`?", np: "`repeat(3, doThing())` मा `doThing` को सट्टा `doThing()` pass गर्दा के गल्ती हुन्छ?", jp: "`repeat(3, doThing())`のように`doThing`ではなく`doThing()`を渡すと何が問題？" },
          options: [{ en: "Nothing, they're identical", np: "केही छैन, उस्तै हो", jp: "問題ない、同じ" }, { en: "doThing() calls the function immediately, passing its RESULT instead of the function itself", np: "doThing() ले तुरुन्तै function call गर्छ, function आफैं होइन इसको result pass गर्छ", jp: "doThing()は即座に関数を呼び出し、関数自体ではなく結果を渡す" }],
          correctIndex: 1,
          explanation: { en: "You must pass a function reference, not the result of calling it, so the higher-order function can call it later.", np: "Function reference pass गर्नुपर्छ, call गरेको result होइन, ताकि higher-order function ले पछि call गर्न सकोस्।", jp: "後で高階関数が呼び出せるように、呼び出し結果ではなく関数参照を渡す必要がある。" },
        },
      ],
    },
    {
      id: "currying-composition",
      title: { en: "Currying & Composition", np: "Currying र Composition", jp: "カリー化と合成" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Currying</b> turns a function that expects several arguments at once into a chain of functions that each take exactly one argument, one at a time — `f(a, b, c)` becomes `f(a)(b)(c)`. <b>Partial application</b> is the more general idea: pre-filling some of a function's arguments now, and getting back a new function that only needs the rest later.\n\nThink of a vending machine: a normal function is like paying with the exact amount at once. A curried function is like inserting one coin at a time — the machine remembers what you've already fed it, and only dispenses the result once the final coin arrives.\n\n<b>Function composition</b> chains small, single-purpose functions into a pipeline — `pipe(add1, double, square)` reads left to right as \"do this, then this, then this,\" which is often easier to follow than one large function doing everything at once.",
        np: "Currying ले multi-argument function लाई एक-एक argument लिने functions को chain मा बदल्छ — f(a,b,c) → f(a)(b)(c)।",
        jp: "カリー化は複数の引数を一度に取る関数を、1つずつ引数を取る関数の連鎖に変換する。",
      },
      diagram: `add(2, 3)                       curriedAdd(2)(3)
──────────────                  ──────────────────────
one call, all args at once      curriedAdd(2) ──▶ returns (b) => 2 + b
                                 (b) => 2+b (3) ──▶ 5

pipe(add1, double, square)(3)
  3 → add1 → 4 → double → 8 → square → 64`,
      codeExample: {
        title: { en: "Currying, partial application, and composition", np: "Currying, partial application, composition", jp: "カリー化・部分適用・合成" },
        code: `// ── Curried version ───────────────────────────────────────────────
const curriedAdd = (a) => (b) => a + b;
curriedAdd(2)(3);  // 5
const add2 = curriedAdd(2);   // returns (b) => 2 + b
add2(3);  // 5

// ── Why currying is useful — creating specialised functions ───────
const multiply = (a) => (b) => a * b;
const double  = multiply(2);
const triple  = multiply(3);
[1, 2, 3].map(double);  // [2, 4, 6]

// ── Partial application with bind() ───────────────────────────────
function log(level, message) {
  console.log(\`[\${level.toUpperCase()}] \${message}\`);
}
const logError = log.bind(null, "error");
logError("Database connection failed");   // [ERROR] Database connection failed

// ── Function composition — combining functions ───────────────────
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const add1   = x => x + 1;
const double2 = x => x * 2;
const square = x => x * x;
const transform = pipe(add1, double2, square);
transform(3);  // step1: 3+1=4, step2: 4*2=8, step3: 8*8=64`,
      },
      keyTakeaways: [
        { en: "Currying converts `f(a, b, c)` into `f(a)(b)(c)` — a chain of single-argument functions instead of one multi-argument call.", np: "Currying ले `f(a,b,c)` लाई `f(a)(b)(c)` मा बदल्छ — single-argument functions को chain।", jp: "カリー化は`f(a,b,c)`を`f(a)(b)(c)`に変換する — 単一引数関数の連鎖。" },
        { en: "Partial application (e.g. via `.bind()`) pre-fills some arguments now and returns a new function needing only the rest.", np: "Partial application (जस्तै `.bind()` मार्फत) ले केही arguments अगावै भर्छ र बाँकीका लागि नयाँ function दिन्छ।", jp: "部分適用（例: `.bind()`）は一部の引数を先に埋め、残りだけを必要とする新しい関数を返す。" },
        { en: "Function composition (`pipe`/`compose`) chains small single-purpose functions left-to-right (or right-to-left) into a readable pipeline.", np: "Function composition (`pipe`/`compose`) ले साना function हरूलाई बायाँबाट दायाँ (वा उल्टो) pipeline मा जोड्छ।", jp: "関数合成（`pipe`/`compose`）は小さな単機能関数を左から右（または逆）にパイプラインとして連結する。" },
      ],
      commonMistakes: [
        { en: "Confusing currying with partial application — currying always produces single-argument steps; partial application can fill any number of arguments at once.", np: "Currying र partial application मिलाउनु — currying ले सधैं single-argument steps दिन्छ; partial application ले जुनसुकै संख्याको argument भर्न सक्छ।", jp: "カリー化と部分適用を混同すること。カリー化は常に単一引数のステップを生む。部分適用は任意数の引数を一度に埋められる。" },
        { en: "Mixing up the order in `pipe` (left-to-right) vs `compose` (right-to-left) and getting the wrong transformation order.", np: "`pipe` (बायाँबाट दायाँ) र `compose` (दायाँबाट बायाँ) को order मिलाउनु।", jp: "`pipe`（左から右）と`compose`（右から左）の順序を混同すること。" },
        { en: "Over-currying every function in a codebase \"just in case\" — it adds indirection that isn't worth it unless you actually reuse partially-applied versions.", np: "पूरै codebase मा हरेक function लाई 'just in case' curry गर्नु — यसले अनावश्यक indirection थप्छ।", jp: "「念のため」コードベースのすべての関数をカリー化すること。実際に部分適用版を再利用しない限り価値のない間接化を加える。" },
      ],
      quiz: [
        {
          question: { en: "What does currying turn `f(a, b, c)` into?", np: "Currying ले `f(a, b, c)` लाई केमा बदल्छ?", jp: "カリー化は`f(a, b, c)`を何に変換する？" },
          options: [{ en: "f(a)(b)(c)", np: "f(a)(b)(c)", jp: "f(a)(b)(c)" }, { en: "f(a, b, c, d)", np: "f(a, b, c, d)", jp: "f(a, b, c, d)" }],
          correctIndex: 0,
          explanation: { en: "Currying converts a multi-argument call into a chain of single-argument function calls.", np: "Currying ले multi-argument call लाई single-argument function calls को chain मा बदल्छ।", jp: "カリー化は多引数呼び出しを単一引数関数呼び出しの連鎖に変換する。" },
        },
        {
          question: { en: "In `pipe(add1, double, square)(3)`, in what order do the functions run?", np: "`pipe(add1, double, square)(3)` मा function हरू कुन order मा चल्छन्?", jp: "`pipe(add1, double, square)(3)`で関数はどの順序で実行される？" },
          options: [{ en: "Left to right: add1, then double, then square", np: "बायाँबाट दायाँ: add1, double, square", jp: "左から右: add1、double、square" }, { en: "Right to left: square, then double, then add1", np: "दायाँबाट बायाँ: square, double, add1", jp: "右から左: square、double、add1" }],
          correctIndex: 0,
          explanation: { en: "pipe runs functions left-to-right, in the order listed; compose runs right-to-left.", np: "pipe ले listed order मा बायाँबाट दायाँ चलाउँछ; compose ले दायाँबाट बायाँ चलाउँछ।", jp: "pipeは記載順に左から右へ実行。composeは右から左へ実行。" },
        },
        {
          question: { en: "What does `.bind(null, \"error\")` do to a two-argument function `log(level, message)`?", np: "`.bind(null, \"error\")` ले `log(level, message)` मा के गर्छ?", jp: "`.bind(null, \"error\")`は2引数関数`log(level, message)`に何をする？" },
          options: [{ en: "Calls log immediately with level=\"error\"", np: "level='error' सँग log तुरुन्तै call गर्छ", jp: "level=\"error\"で即座にlogを呼び出す" }, { en: "Returns a new function that only needs the remaining `message` argument", np: "बाँकी `message` argument मात्र चाहिने नयाँ function फर्काउँछ", jp: "残りの`message`引数だけを必要とする新しい関数を返す" }],
          correctIndex: 1,
          explanation: { en: "This is partial application — level is pre-filled, and the returned function only needs message.", np: "यो partial application हो — level pre-filled हुन्छ, return भएको function लाई message मात्र चाहिन्छ।", jp: "これは部分適用 — levelは先に埋められ、返された関数はmessageだけを必要とする。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "After `outer()` finishes running, does its local variable captured by a returned inner function disappear?", np: "`outer()` सकिएपछि return भएको inner function ले captured गरेको local variable हराउँछ?", jp: "`outer()`の実行後、返された内側の関数がキャプチャしたローカル変数は消える？" },
      options: [{ en: "Yes, immediately", np: "हो, तुरुन्तै", jp: "はい、すぐに" }, { en: "No — the closure keeps it alive", np: "होइन — closure ले जिउँदो राख्छ", jp: "いいえ — クロージャが保持し続ける" }],
      correctIndex: 1,
      explanation: { en: "As long as the inner function still references it, the variable stays alive.", np: "Inner function ले reference गरेसम्म variable जिउँदो रहन्छ।", jp: "内側の関数が参照し続ける限り変数は生き続ける。" },
    },
    {
      question: { en: "Do two separate calls to the same closure factory share the captured variable?", np: "एउटै closure factory का दुई फरक call ले captured variable share गर्छन्?", jp: "同じクロージャファクトリの2つの呼び出しはキャプチャした変数を共有する？" },
      options: [{ en: "Yes", np: "हो", jp: "はい" }, { en: "No — each call gets an independent copy", np: "होइन — हरेक call को independent copy हुन्छ", jp: "いいえ — 各呼び出しは独立したコピーを持つ" }],
      correctIndex: 1,
      explanation: { en: "Each call creates a fresh scope and a fresh closure.", np: "हरेक call ले नयाँ scope र नयाँ closure बनाउँछ।", jp: "各呼び出しは新しいスコープと新しいクロージャを作る。" },
    },
    {
      question: { en: "What is a common risk of closures if not cleaned up?", np: "Cleanup नगरेमा closure को सामान्य जोखिम के हो?", jp: "クリーンアップしない場合のクロージャの一般的なリスクは？" },
      options: [{ en: "Slower execution", np: "ढिलो execution", jp: "実行が遅くなる" }, { en: "Variables staying alive in memory longer than needed", np: "Variable अनुमान भन्दा बढी समय memory मा रहनु", jp: "変数が必要以上に長くメモリに残る" }],
      correctIndex: 1,
      explanation: { en: "Closures attached to long-lived listeners/timers can quietly block garbage collection.", np: "लामो समय रहने listener/timer मा जोडिएको closure ले garbage collection रोक्न सक्छ।", jp: "長寿命のリスナー・タイマーに結び付いたクロージャはガベージコレクションを妨げることがある。" },
    },
    {
      question: { en: "What makes a function \"higher-order\"?", np: "कुन कुराले function लाई 'higher-order' बनाउँछ?", jp: "何が関数を「高階」にする？" },
      options: [{ en: "It takes or returns a function", np: "यसले function लिन्छ वा return गर्छ", jp: "関数を受け取るか返す" }, { en: "It runs asynchronously", np: "Asynchronously चल्छ", jp: "非同期で実行される" }],
      correctIndex: 0,
      explanation: { en: "Taking a function as an argument or returning one is the defining trait.", np: "Function argument को रूपमा लिनु वा return गर्नु नै defining trait हो।", jp: "関数を引数に取るか返すことが定義的な特徴。" },
    },
    {
      question: { en: "Which of these is a built-in higher-order function?", np: "यीमध्ये कुन built-in higher-order function हो?", jp: "次のうち組み込み高階関数はどれ？" },
      options: [{ en: "Array.prototype.map", np: "Array.prototype.map", jp: "Array.prototype.map" }, { en: "String.prototype.trim", np: "String.prototype.trim", jp: "String.prototype.trim" }],
      correctIndex: 0,
      explanation: { en: "map() takes a function argument and calls it per item.", np: "map() ले function argument लिन्छ र हरेक item मा call गर्छ।", jp: "map()は関数引数を受け取り各要素に対して呼び出す。" },
    },
    {
      question: { en: "What's wrong with passing `doThing()` instead of `doThing` as a callback?", np: "Callback को रूपमा `doThing` को सट्टा `doThing()` pass गर्दा के गल्ती?", jp: "コールバックとして`doThing`ではなく`doThing()`を渡すと何が問題？" },
      options: [{ en: "Nothing", np: "केही छैन", jp: "問題ない" }, { en: "It calls the function immediately, passing its result instead of the function", np: "यसले function तुरुन्तै call गर्छ, function को सट्टा result pass गर्छ", jp: "即座に関数を呼び出し、関数の代わりに結果を渡す" }],
      correctIndex: 1,
      explanation: { en: "You must pass a function reference so it can be called later, not the result of calling it now.", np: "पछि call गर्न function reference pass गर्नुपर्छ, अहिले call गरेको result होइन।", jp: "後で呼び出せるように関数参照を渡す必要がある。今呼び出した結果ではない。" },
    },
    {
      question: { en: "What does currying turn `f(a, b, c)` into?", np: "Currying ले `f(a, b, c)` लाई केमा बदल्छ?", jp: "カリー化は`f(a, b, c)`を何に変換する？" },
      options: [{ en: "f(a)(b)(c)", np: "f(a)(b)(c)", jp: "f(a)(b)(c)" }, { en: "f(c, b, a)", np: "f(c, b, a)", jp: "f(c, b, a)" }],
      correctIndex: 0,
      explanation: { en: "Currying chains single-argument function calls.", np: "Currying ले single-argument function calls को chain बनाउँछ।", jp: "カリー化は単一引数関数呼び出しの連鎖を作る。" },
    },
    {
      question: { en: "In `pipe(add1, double, square)(3)`, what order do the functions run in?", np: "`pipe(add1, double, square)(3)` मा function हरू कुन order मा चल्छन्?", jp: "`pipe(add1, double, square)(3)`の実行順序は？" },
      options: [{ en: "Left to right", np: "बायाँबाट दायाँ", jp: "左から右" }, { en: "Right to left", np: "दायाँबाट बायाँ", jp: "右から左" }],
      correctIndex: 0,
      explanation: { en: "pipe runs functions in the order listed, left to right; compose is the right-to-left version.", np: "pipe ले listed order मा बायाँबाट दायाँ चलाउँछ; compose उल्टो हो।", jp: "pipeは記載順に左から右へ実行。composeは逆。" },
    },
    {
      question: { en: "What does `.bind(null, \"error\")` do to `log(level, message)`?", np: "`.bind(null, \"error\")` ले `log(level, message)` मा के गर्छ?", jp: "`.bind(null, \"error\")`は`log(level, message)`に何をする？" },
      options: [{ en: "Returns a new function needing only `message`", np: "बाँकी `message` मात्र चाहिने नयाँ function फर्काउँछ", jp: "残りの`message`だけを必要とする新しい関数を返す" }, { en: "Calls log immediately", np: "log तुरुन्तै call गर्छ", jp: "即座にlogを呼び出す" }],
      correctIndex: 0,
      explanation: { en: "bind() with a leading argument performs partial application, pre-filling level.", np: "bind() ले leading argument सहित partial application गर्छ, level pre-fill हुन्छ।", jp: "先頭引数付きのbind()は部分適用を行い、levelを先に埋める。" },
    },
    {
      question: { en: "Is currying the same thing as partial application?", np: "Currying र partial application उस्तै हो?", jp: "カリー化と部分適用は同じ？" },
      options: [{ en: "Yes, identical", np: "हो, उस्तै", jp: "はい、同一" }, { en: "No — currying is a special, always-single-argument form of the more general partial application", np: "होइन — currying partial application को special, सधैं single-argument form हो", jp: "いいえ — カリー化はより一般的な部分適用の特殊で常に単一引数の形" }],
      correctIndex: 1,
      explanation: { en: "Currying always produces single-argument steps; partial application can fill any number of arguments at once.", np: "Currying ले सधैं single-argument steps दिन्छ; partial application ले जुनसुकै संख्याको argument भर्न सक्छ।", jp: "カリー化は常に単一引数のステップを生む。部分適用は任意数の引数を一度に埋められる。" },
    },
  ],
};
