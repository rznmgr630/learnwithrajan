import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_4_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Closures are one of the most powerful — and most misunderstood — features in JavaScript. A closure is a function that remembers the variables from the scope it was created in, even after that scope has closed. Higher-order functions and currying are built on this same idea.",
      np: "Closure JavaScript को सबभन्दा शक्तिशाली feature हो। Closure एउटा function हो जसले आफू create भएको scope का variables याद राख्छ — scope बन्द भएपछि पनि।",
      jp: "クロージャはJavaScriptで最も強力かつ誤解されやすい機能。クロージャはスコープが閉じた後も、作成時のスコープの変数を覚えている関数のこと。",
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
            { en: "A closure is created every time a function is created inside another function. The inner function keeps a live reference to the outer scope's variables — not a copy of their value at creation time.", np: "Closure हरेक पटक inner function create हुँदा बन्छ। Inner function ले outer scope का variables को live reference राख्छ — creation time को copy होइन।", jp: "クロージャは関数の中で関数が作られるたびに生成される。コピーではなく変数への生きた参照を保持する。" },
            { en: "Memory implication: closures keep outer variables alive as long as the closure exists. Be careful with closures in event listeners or timers — they can prevent garbage collection if not cleaned up.", np: "Memory: closure जबसम्म रहन्छ, outer variables पनि memory मा रहन्छ। Event listener वा timer मा closure हुँदा cleanup गर्न नभुलनुहोस्।", jp: "メモリ: クロージャが存在する限り外部変数はGCされない。イベントリスナーやタイマーのクロージャは注意してクリーンアップする。" },
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
            en: "A higher-order function is a function that either takes a function as an argument or returns a function (or both). This is possible because functions in JavaScript are first-class values — they can be stored in variables, passed as arguments, and returned from other functions just like any other value.",
            np: "Higher-order function एउटा function हो जसले argument को रूपमा function लिन्छ वा function return गर्छ। JS मा functions first-class values हुन् — variable मा store, argument को रूपमा pass, र return गर्न सकिन्छ।",
            jp: "高階関数とは引数として関数を受け取るか、関数を返す関数のこと。JavaScriptの関数はファーストクラス値なので、変数に格納・引数として渡す・返り値にすることができる。",
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
  ],
};
