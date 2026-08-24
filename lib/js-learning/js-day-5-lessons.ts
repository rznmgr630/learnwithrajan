import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_5_LESSONS: JsLessonDay = {
  day: 5,
  title: { en: "Closures, Higher-Order Functions & Currying", np: "Closures, Higher-Order Functions र Currying", jp: "クロージャ・高階関数・カリー化" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "closures",
      title: { en: "Closures — the Foundation", np: "Closures — आधार", jp: "クロージャの基礎" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>closure</b> (a function that remembers variables from where it was created) happens when a function is created inside another function.\n\nThe inner function can still access the outer function's variables even after the outer function has finished.\n\nThink of it like a <b>backpack</b> 🎒:\n\n```text\nOuter Function\n     │\n     ├── name = \"Rajan\"\n     │\n     ↓\nInner Function\n     │\n     └── remembers → name\n```\n\nExample:\n\n```javascript\nfunction greet() {\n  const name = \"Rajan\";\n\n  function sayHello() {\n    console.log(name);\n  }\n\n  return sayHello;\n}\n\nconst hello = greet();\n\nhello(); // Rajan\n```\n\nNormally, you might expect `name` to disappear when `greet()` finishes.\n\nBut `sayHello()` still has access to it.\n\nThat's a <b>closure</b>.\n\n---\n\n### A closure keeps a live reference\n\nClosures keep a <b>live reference</b> (a connection to the original variable), not a copy.\n\n```javascript\nfunction counter() {\n  let count = 0;\n\n  return function () {\n    count++;\n    return count;\n  };\n}\n\nconst next = counter();\n\nconsole.log(next()); // 1\nconsole.log(next()); // 2\nconsole.log(next()); // 3\n```\n\nThe inner function keeps access to `count`.\n\n```text\ncount → 0\n   ↓\nnext() → 1\n   ↓\ncount → 1\n   ↓\nnext() → 2\n   ↓\ncount → 2\n```",
        np: "<b>Closure</b> (आफू बनेको ठाउँका variable सम्झने function) तब बन्छ जब एउटा function अर्को function भित्र बनाइन्छ।\n\nOuter function सकिएपछि पनि inner function ले outer function का variable पहुँच गर्न सक्छ।\n\nयसलाई <b>ब्यागप्याक</b> 🎒 जस्तै सोच्नुहोस्:\n\n```text\nOuter Function\n     │\n     ├── name = \"Rajan\"\n     │\n     ↓\nInner Function\n     │\n     └── remembers → name\n```\n\nउदाहरण:\n\n```javascript\nfunction greet() {\n  const name = \"Rajan\";\n\n  function sayHello() {\n    console.log(name);\n  }\n\n  return sayHello;\n}\n\nconst hello = greet();\n\nhello(); // Rajan\n```\n\nसामान्यतया, `greet()` सकिँदा `name` हराउँछ भन्ने तपाईंलाई लाग्न सक्छ।\n\nतर `sayHello()` सँग अझै यसको पहुँच हुन्छ।\n\nयही <b>closure</b> हो।\n\n---\n\n### Closure ले live reference राख्छ\n\nClosure ले copy होइन, <b>live reference</b> (मूल variable सँगको जोडाइ) राख्छ।\n\n```javascript\nfunction counter() {\n  let count = 0;\n\n  return function () {\n    count++;\n    return count;\n  };\n}\n\nconst next = counter();\n\nconsole.log(next()); // 1\nconsole.log(next()); // 2\nconsole.log(next()); // 3\n```\n\nInner function ले `count` को पहुँच राख्छ।\n\n```text\ncount → 0\n   ↓\nnext() → 1\n   ↓\ncount → 1\n   ↓\nnext() → 2\n   ↓\ncount → 2\n```",
        jp: "<b>クロージャ</b>（作られた場所の変数を覚えている関数）は、関数が別の関数の中で作られたときに生まれます。\n\n外側の関数が終わったあとでも、内側の関数は外側の変数にアクセスできます。\n\n<b>バックパック</b> 🎒 のようなものだと考えてください:\n\n```text\nOuter Function\n     │\n     ├── name = \"Rajan\"\n     │\n     ↓\nInner Function\n     │\n     └── remembers → name\n```\n\n例:\n\n```javascript\nfunction greet() {\n  const name = \"Rajan\";\n\n  function sayHello() {\n    console.log(name);\n  }\n\n  return sayHello;\n}\n\nconst hello = greet();\n\nhello(); // Rajan\n```\n\n普通なら `greet()` が終わった時点で `name` は消えると思うかもしれません。\n\nしかし `sayHello()` はまだそれにアクセスできます。\n\nこれが<b>クロージャ</b>です。\n\n---\n\n### クロージャは生きた参照を保つ\n\nクロージャはコピーではなく<b>生きた参照</b>（元の変数へのつながり）を保ちます。\n\n```javascript\nfunction counter() {\n  let count = 0;\n\n  return function () {\n    count++;\n    return count;\n  };\n}\n\nconst next = counter();\n\nconsole.log(next()); // 1\nconsole.log(next()); // 2\nconsole.log(next()); // 3\n```\n\n内側の関数は `count` へのアクセスを保ち続けます。\n\n```text\ncount → 0\n   ↓\nnext() → 1\n   ↓\ncount → 1\n   ↓\nnext() → 2\n   ↓\ncount → 2\n```",
      },
      diagram: `greet()
│
├── name → "Rajan"
│
└── sayHello()
       │
       └── remembers → name
              │
              ↓
           "Rajan"

greet() finishes
       ↓
sayHello() still remembers name`,
      codeExample: {
        title: { en: "A counter that remembers its own count", np: "आफ्नै count सम्झने counter", jp: "自分のカウントを覚えるカウンター" },
        code: `function counter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const next = counter();

console.log(next()); // 1
console.log(next()); // 2
console.log(next()); // 3`,
      },
      keyTakeaways: [
        { en: "<b>Closure</b> → a function remembers variables from its outer scope.", np: "<b>Closure</b> → function ले आफ्नो outer scope का variable सम्झन्छ।", jp: "<b>クロージャ</b> → 関数が外側のスコープの変数を覚えている。" },
        { en: "It is created when a function is created inside another function.", np: "यो एउटा function अर्को function भित्र बनाउँदा बन्छ।", jp: "関数が別の関数の中で作られたときに生まれる。" },
        { en: "The inner function keeps a <b>live reference</b> (connection) to those variables.", np: "Inner function ले ती variable सँग <b>live reference</b> (जोडाइ) राख्छ।", jp: "内側の関数はそれらの変数への<b>生きた参照</b>（つながり）を保つ。" },
        { en: "The outer function can finish, but the variables can stay alive while the closure exists.", np: "Outer function सकिन सक्छ, तर closure रहेसम्म variable जीवित रहन सक्छन्।", jp: "外側の関数は終わってもよいが、クロージャがある間は変数が生き続けられる。" },
        { en: "Closures are commonly used for counters, private data, callbacks, and event handlers.", np: "Closure सामान्यतया counter, private data, callback, र event handler का लागि प्रयोग हुन्छन्।", jp: "クロージャはカウンター・プライベートなデータ・コールバック・イベントハンドラによく使われる。" },
        { en: "Closures use memory because they keep outer variables alive.", np: "Closure ले outer variable जीवित राख्ने हुनाले memory प्रयोग गर्छन्।", jp: "クロージャは外側の変数を生かし続けるためメモリを使う。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking a closure stores a copy</b> — it keeps a connection to the original variable, so the closure always sees the updated value.", np: "<b>Closure ले copy राख्छ भन्ने ठान्नु</b> — यो मूल variable सँग जोडाइ राख्छ, त्यसैले closure ले सधैं अद्यावधिक value देख्छ।", jp: "<b>クロージャはコピーを持つと思う</b> — 元の変数へのつながりを保つので、常に更新後の値が見える。" },
        { en: "<b>Thinking the outer function must stay running</b> — it doesn't. The outer function returns and finishes, and the inner function still has access.", np: "<b>Outer function चलिरहनु पर्छ भन्ने ठान्नु</b> — पर्दैन। Outer function return गरी सकिन्छ, र inner function सँग अझै पहुँच हुन्छ।", jp: "<b>外側の関数が動き続けている必要があると思う</b> — 必要ない。外側の関数はreturnして終わり、それでも内側の関数はアクセスできる。" },
        { en: "<b>Forgetting about memory</b> — a closure keeps its remembered variables alive. Be careful with many closures inside <b>event listeners</b> or <b>timers</b>, since they can hold data in memory longer than expected.", np: "<b>Memory बिर्सनु</b> — closure ले सम्झेका variable जीवित राख्छ। <b>Event listener</b> वा <b>timer</b> भित्र धेरै closure बनाउँदा होसियार हुनुहोस्, तिनले data अपेक्षा भन्दा लामो समय memory मा राख्न सक्छन्।", jp: "<b>メモリを忘れる</b> — クロージャは覚えている変数を生かし続ける。<b>イベントリスナー</b>や<b>タイマー</b>の中で多数作ると、想定より長くデータがメモリに残ることがある。" },
      ],
      quiz: [
        {
          question: { en: "What is a closure?", np: "Closure के हो?", jp: "クロージャとは何か?" },
          options: [
            { en: "A loop", np: "एउटा loop", jp: "ループ" },
            { en: "A function that remembers variables from its outer scope", np: "आफ्नो outer scope का variable सम्झने function", jp: "外側のスコープの変数を覚えている関数" },
            { en: "A special type of object", np: "object को एक विशेष प्रकार", jp: "特殊な種類のオブジェクト" },
          ],
          correctIndex: 1,
          explanation: { en: "It is formed when a function is created inside another and keeps access to that outer scope.", np: "यो एउटा function अर्को भित्र बन्दा बन्छ र त्यो outer scope को पहुँच राख्छ।", jp: "関数が別の関数の中で作られ、その外側のスコープへのアクセスを保つときに生まれる。" },
        },
        {
          question: { en: "Does a closure keep a copy of the variable?", np: "Closure ले variable को copy राख्छ?", jp: "クロージャは変数のコピーを持つか?" },
          options: [
            { en: "Yes", np: "हो", jp: "はい" },
            { en: "No, it keeps a live reference", np: "होइन, यो live reference राख्छ", jp: "いいえ、生きた参照を保つ" },
          ],
          correctIndex: 1,
          explanation: { en: "Because it is a live reference, later changes to the variable are visible inside the closure.", np: "Live reference भएकाले, variable मा पछि हुने परिवर्तन closure भित्र देखिन्छ।", jp: "生きた参照なので、後の変更もクロージャの中から見える。" },
        },
        {
          question: { en: "Can the outer function finish while the closure still works?", np: "Closure काम गरिरहँदा outer function सकिन सक्छ?", jp: "クロージャが動いている間に外側の関数は終われるか?" },
          options: [
            { en: "Yes", np: "सक्छ", jp: "はい" },
            { en: "No", np: "सक्दैन", jp: "いいえ" },
          ],
          correctIndex: 0,
          explanation: { en: "The outer call returns and leaves the stack, but the variables it holds stay alive for the closure.", np: "Outer call return गरी stack छोड्छ, तर यसले राखेका variable closure का लागि जीवित रहन्छन्।", jp: "外側の呼び出しはreturnしてスタックから外れるが、保持していた変数はクロージャのために生き続ける。" },
        },
        {
          question: { en: "What does a closure keep alive?", np: "Closure ले के जीवित राख्छ?", jp: "クロージャは何を生かし続けるか?" },
          options: [
            { en: "Outer variables it needs", np: "यसलाई चाहिने outer variable", jp: "必要な外側の変数" },
            { en: "The entire application", np: "पूरै application", jp: "アプリ全体" },
            { en: "The browser", np: "Browser", jp: "ブラウザ" },
          ],
          correctIndex: 0,
          explanation: { en: "Only the variables it actually references, which is why leaks come from holding more than you need.", np: "यसले वास्तवमा reference गरेका variable मात्र, त्यसैले चाहिने भन्दा धेरै राख्दा leak हुन्छ।", jp: "実際に参照している変数だけ。だから必要以上に保持するとリークになる。" },
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
