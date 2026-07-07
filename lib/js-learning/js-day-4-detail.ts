import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_4_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Closures are one of the most powerful — and most misunderstood — features in JavaScript. A closure is a function that remembers the variables from the scope it was created in, even after that scope has finished running. Higher-order functions and currying are both built on this same idea: functions that treat other functions as ordinary values.",
      np: "Closure JavaScript को सबभन्दा शक्तिशाली feature हो। Closure एउटा function हो जसले आफू create भएको scope का variables याद राख्छ — scope बन्द भएपछि पनि।",
      jp: "クロージャはJavaScriptで最も強力かつ誤解されやすい機能。クロージャはスコープが閉じた後も、作成時のスコープの変数を覚えている関数のこと。",
    },
    {
      en: "In Day 4 we cover:\n• <b>Closures</b> — how an inner function keeps outer variables alive\n• <b>Higher-order functions</b> — functions that take or return other functions\n• <b>Currying &amp; partial application</b> — turning a multi-argument function into a chain of single-argument ones\n• <b>Function composition</b> — chaining small functions into a pipeline",
      np: "Day 4 मा: closures, higher-order functions, currying/partial application, र function composition।",
      jp: "Day 4では: クロージャ、高階関数、カリー化・部分適用、関数合成を学びます。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "vKJpN5FAeF4", title: "JavaScript Closures Explained" },
      ],
    },
    {
      title: { en: "Closures — the foundation", np: "Closures — आधार", jp: "クロージャの基礎" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Picture a function as a person leaving home for a trip. Normally, once they leave, everything back at the house is gone from their perspective. A <b>closure</b> is that person packing a backpack before leaving — a backpack containing direct access to specific things from home, not photocopies. Even far away, they can reach into the backpack and read or change what's inside, and it stays in sync with the original.\n\nThat backpack is exactly what an inner function carries: a live link to the variables of the outer function it was created in, available anytime the inner function is later called — no matter how much later, or from how far away in the code.",
            np: "Closure लाई यात्रामा जाने व्यक्तिले घरबाटै केही सामान backpack मा राखेको जस्तो सोच्नुहोस् — टाढा पुगे पनि उसले backpack भित्रको सामान access गर्न सक्छ, र त्यो सधैं original सँग sync मा रहन्छ।",
            jp: "クロージャは、旅に出る人が家から特定のものへの直接アクセスをバックパックに入れて持って行くようなもの。遠くにいてもバックパックの中身を読んだり変更したりでき、常に元と同期している。",
          },
        },
        {
          type: "code",
          title: { en: "A closure keeps the outer variable alive", np: "Closure ले outer variable जिउँदो राख्छ", jp: "クロージャは外部変数を保持する" },
          code: `// ── Basic closure ───────────────────────────────────────────────
function outer() {
  let count = 0;        // this variable lives in outer's scope

  return function inner() {
    count++;            // inner "closes over" count
    return count;
  };
}

const increment = outer(); // outer() runs and returns inner
// outer's execution context is gone, but 'count' is still alive
// because 'inner' holds a reference to it

console.log(increment()); // 1
console.log(increment()); // 2
console.log(increment()); // 3

// Each call to outer() creates a separate closure with its own 'count'
const incrementA = outer();
const incrementB = outer();
incrementA(); // 1
incrementA(); // 2
incrementB(); // 1  — completely separate count

// ── Practical use case: factory functions ────────────────────────
function createMultiplier(factor) {
  return (number) => number * factor;   // 'factor' is closed over
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

double(5);  // 10
triple(5);  // 15

// ── Closures in module pattern (private state) ────────────────────
function createBankAccount(initialBalance) {
  let balance = initialBalance;  // private — not accessible from outside

  return {
    deposit:    (amount) => { balance += amount; },
    withdraw:   (amount) => { balance = Math.max(0, balance - amount); },
    getBalance: ()       => balance,
  };
}

const account = createBankAccount(100);
account.deposit(50);
account.withdraw(30);
console.log(account.getBalance()); // 120
// balance is not directly readable or writable from outside`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "<b>A closure is created every time a function is created inside another function.</b> The inner function keeps a live reference to the outer scope's variables — not a snapshot copy of their value at creation time.",
              np: "Closure हरेक पटक inner function create हुँदा बन्छ। Inner function ले outer scope का variables को live reference राख्छ — creation time को copy होइन।",
              jp: "クロージャは関数の中で関数が作られるたびに生成される。コピーではなく変数への生きた参照を保持する。",
            },
            {
              en: "<b>Memory implication:</b> closures keep outer variables alive for as long as the closure itself exists. Be careful with closures inside event listeners or timers — they can quietly prevent garbage collection if not cleaned up.",
              np: "Memory: closure जबसम्म रहन्छ, outer variables पनि memory मा रहन्छ। Event listener वा timer मा closure हुँदा cleanup गर्न नभुलनुहोस्।",
              jp: "メモリ: クロージャが存在する限り外部変数はGCされない。イベントリスナーやタイマーのクロージャは注意してクリーンアップする。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Higher-order functions", np: "Higher-order functions", jp: "高階関数" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>higher-order function</b> is a function that either takes a function as an argument, returns a function, or both. This is possible only because functions in JavaScript are <b>first-class values</b> — exactly like a number or a string, they can be stored in a variable, passed as an argument, and returned from another function.\n\n• Passing a function in lets the caller plug in custom behaviour without the higher-order function needing to know the details\n  ↳ `array.map(fn)` doesn't know what `fn` does — it just calls it for every item\n• Returning a function out lets you generate specialised, ready-to-use functions on demand\n  ↳ `createMultiplier(3)` from the closures section above is already a higher-order function — it returns a function",
            np: "Higher-order function एउटा function हो जसले argument को रूपमा function लिन्छ वा function return गर्छ। JS मा functions first-class values हुन्।",
            jp: "高階関数とは引数として関数を受け取るか、関数を返す関数のこと。JavaScriptの関数はファーストクラス値。",
          },
        },
        {
          type: "code",
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
  return function (...args) {      // spread to accept any number of arguments
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
numbers.reduce((acc, n) => acc + n, 0); // 15
numbers.find(n => n > 3);              // 4
numbers.every(n => n > 0);             // true
numbers.some(n => n > 4);              // true
numbers.sort((a, b) => b - a);         // [5, 4, 3, 2, 1] — descending`,
        },
      ],
    },
    {
      title: { en: "Currying & partial application", np: "Currying र partial application", jp: "カリー化と部分適用" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Currying</b> turns a function that expects several arguments at once into a chain of functions that each take exactly one argument, one at a time — `f(a, b, c)` becomes `f(a)(b)(c)`. <b>Partial application</b> is the more general idea: pre-filling some of a function's arguments now, and getting back a new function that only needs the rest later.\n\nThink of a vending machine: a normal function is like paying with the exact amount at once. A curried function is like inserting one coin at a time — the machine remembers what you've already fed it, and only dispenses the result once the final coin arrives.",
            np: "Currying ले multi-argument function लाई एक-एक argument लिने functions को chain मा बदल्छ — f(a,b,c) → f(a)(b)(c)। Partial application ले केही arguments अगावै भरेर बाँकीका लागि नयाँ function दिन्छ।",
            jp: "カリー化は複数の引数を一度に取る関数を、1つずつ引数を取る関数の連鎖に変換する。部分適用はより一般的な考え方で、一部の引数を先に埋めて残りを受け取る新しい関数を得る。",
          },
        },
        {
          type: "code",
          title: { en: "Currying — converting a multi-argument function into nested single-argument functions", np: "Currying — multi-argument function लाई single-argument functions मा", jp: "カリー化 — 多引数関数を単引数関数の連鎖に変換" },
          code: `// ── Regular (uncurried) function ─────────────────────────────────
const add = (a, b) => a + b;
add(2, 3);  // 5

// ── Curried version ───────────────────────────────────────────────
const curriedAdd = (a) => (b) => a + b;
// Calling it one argument at a time:
curriedAdd(2)(3);  // 5
// Or partially applying:
const add2 = curriedAdd(2);   // returns (b) => 2 + b
add2(3);  // 5
add2(10); // 12

// ── Why currying is useful — creating specialised functions ───────
const multiply = (a) => (b) => a * b;
const double  = multiply(2);
const triple  = multiply(3);
const tenX    = multiply(10);

[1, 2, 3].map(double);  // [2, 4, 6]
[1, 2, 3].map(triple);  // [3, 6, 9]

// ── Partial application — pre-filling some arguments ──────────────
function log(level, message) {
  console.log(\`[\${level.toUpperCase()}] \${message}\`);
}

// bind() creates a partially applied function
const logError = log.bind(null, "error");
const logInfo  = log.bind(null, "info");

logError("Database connection failed");   // [ERROR] Database connection failed
logInfo("Server started on port 3000");   // [INFO] Server started on port 3000

// ── Function composition — combining functions ───────────────────
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);
const pipe    = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const add1   = x => x + 1;
const double2 = x => x * 2;
const square = x => x * x;

const transform = pipe(add1, double2, square);
transform(3);  // step1: 3+1=4, step2: 4*2=8, step3: 8*8=64`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "<b>Function composition</b> chains small, single-purpose functions into a pipeline — `pipe(add1, double2, square)` reads left to right as \"do this, then this, then this,\" which is often easier to follow than one large function doing everything at once.",
              np: "Function composition ले साना function हरूलाई pipeline मा जोड्छ — पढ्न बायाँबाट दायाँ, \"यो गर, त्यसपछि यो गर\" जस्तो।",
              jp: "関数合成は小さな単機能の関数をパイプラインとして連結する。左から右に「これをして、次にこれをして」と読める。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "Why are closures useful?", np: "Closures किन उपयोगी छन्?", jp: "クロージャが有用な理由は？" },
      answer: {
        en: "Closures are useful for three main reasons: (1) data privacy — variables inside a closure are not accessible from outside, so you can create private state without classes; (2) factory functions — you can create multiple independent copies of a function, each with its own private state; (3) callbacks and event handlers — closures let a callback access variables from the scope where it was defined, not just the scope where it runs.",
        np: "Closures तीन कारणले उपयोगी: (1) data privacy — closure भित्रका variables बाहिरबाट access हुँदैन; (2) factory functions — आफ्नै private state सहित independent copies; (3) callbacks — callback ले आफू define भएको scope का variables access गर्न सक्छ।",
        jp: "クロージャが有用な理由: (1)データプライバシー — 外部からアクセス不可の状態; (2)ファクトリ関数 — 独立した状態を持つ複数の関数; (3)コールバック — 定義されたスコープの変数にアクセスできる。",
      },
    },
    {
      question: { en: "What is the difference between currying and partial application?", np: "Currying र partial application मा के फरक?", jp: "カリー化と部分適用の違いは？" },
      answer: {
        en: "Currying transforms a function that takes multiple arguments into a sequence of functions that each take one argument: f(a, b, c) becomes f(a)(b)(c). Partial application fixes some arguments of a function and returns a new function for the remaining ones. Currying is a special form of partial application. In practice, both are used to create specialised functions from general ones.",
        np: "Currying ले multi-argument function लाई single-argument functions को sequence मा transform गर्छ: f(a,b,c) → f(a)(b)(c)। Partial application केही arguments fix गरेर बाँकीका लागि नयाँ function return गर्छ। Currying partial application को special form हो।",
        jp: "カリー化は多引数関数を一引数関数の連鎖に変換: f(a,b,c) → f(a)(b)(c)。部分適用は引数の一部を固定して残りの関数を返す。カリー化は部分適用の特殊形。",
      },
    },
    {
      question: { en: "Do closures cause memory leaks?", np: "Closures ले memory leak गराउँछ?", jp: "クロージャはメモリリークを引き起こす？" },
      answer: {
        en: "Closures themselves don't leak memory — they behave exactly as designed by keeping referenced variables alive. The risk appears when a closure is attached to something long-lived (a global event listener, a timer that never gets cleared, a cache that never evicts) and nobody ever releases that reference. The fix isn't avoiding closures — it's removing event listeners when a component unmounts, clearing intervals you no longer need, and being deliberate about what a long-lived closure captures.",
        np: "Closure आफैंले memory leak गराउँदैन — design अनुसार नै variables जिउँदो राख्छ। जोखिम त्यतिखेर आउँछ जब closure लामो समयसम्म रहने चिज (global listener, नरोकिने timer) सँग जोडिन्छ र कहिल्यै release हुँदैन।",
        jp: "クロージャ自体はメモリリークを引き起こさない。リスクは、クロージャが長寿命のもの（グローバルリスナー、クリアされないタイマー）に結び付き、参照が解放されない場合に生じる。",
      },
    },
  ],
};
