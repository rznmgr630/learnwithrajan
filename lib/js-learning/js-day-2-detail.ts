import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_2_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Operators, conditionals, and loops are the building blocks of every program — the vocabulary you combine to make decisions and repeat work.\n\nToday also covers the three ways to write a function in JavaScript. They all do the same basic job (take input, return output) but disagree on when they're available, and how they handle the word `this` — differences that matter the moment you start passing functions around as callbacks.",
      np: "Operators, conditionals, loops हरेक program को building blocks हुन्। आज function को तीन तरिका पनि — hoisting र this मा फरक व्यवहार सहित।",
      jp: "演算子・条件分岐・ループはプログラムの基本構成要素。関数の3種類（宣言・式・アロー）の違いも学ぶ。",
    },
    {
      en: "In Day 2 we cover:\n• <b>Operators</b> — arithmetic, comparison, logical, nullish coalescing, optional chaining\n• <b>Conditionals</b> — if/else, switch, and the guard-clause pattern\n• <b>Loops</b> — for, while, for...of, for...in, and when to reach for each\n• <b>Function types</b> — declaration, expression, and arrow, and how `this` behaves in each",
      np: "Day 2 मा: operators, conditionals, loops, र function types — this को व्यवहार सहित।",
      jp: "Day 2では: 演算子、条件分岐、ループ、関数の種類とthisの挙動を学びます。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "W6NZfCO5SIk", title: "JavaScript for Beginners — Full Course" },
      ],
    },
    {
      title: { en: "Operators", np: "Operators", jp: "演算子" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Operators are the small symbols (`+`, `===`, `&&`, `??`) that combine values into new values. Most are familiar from math class, but three are worth slowing down on because they trip up beginners: <b>short-circuit evaluation</b>, <b>nullish coalescing (`??`)</b>, and <b>optional chaining (`?.`)</b> — all three exist to write safer code with less nesting.\n\n• <b>`||` (OR)</b> falls back whenever the left side is any falsy value (`0`, `''`, `null`, `undefined`, `NaN`, `false`)\n  ↳ Dangerous for numbers: `count || 10` replaces a real `0` with `10`\n• <b>`??` (nullish coalescing)</b> falls back only when the left side is exactly `null` or `undefined`\n  ↳ Safe for numbers: `count ?? 10` keeps a real `0` as `0`\n• <b>`?.` (optional chaining)</b> stops and returns `undefined` the moment it hits a `null`/`undefined` link in a chain, instead of throwing",
            np: "|| ले कुनै पनि falsy value (0, '', null, undefined, false) मा fallback गर्छ। ?? ले केवल null/undefined मा मात्र fallback गर्छ — number को लागि सुरक्षित। ?. ले chain बीचमा null भेटिए error नफाली undefined फर्काउँछ।",
            jp: "||はfalsy値すべてでフォールバック（0が消える危険あり）。??はnull/undefinedのみでフォールバック（数値に安全）。?.はチェーン中でnull/undefinedに当たった時点でエラーなくundefinedを返す。",
          },
        },
        {
          type: "code",
          title: { en: "Arithmetic, comparison, logical & nullish operators", np: "मुख्य operators", jp: "主要演算子" },
          code: `// ── Arithmetic ──────────────────────────────────────────────────────
5 + 3    // 8
5 - 3    // 2
5 * 3    // 15
5 / 3    // 1.6666...
5 % 3    // 2  (remainder / modulo)
5 ** 3   // 125 (exponentiation)
++x      // pre-increment: increment then return
x++      // post-increment: return then increment

// ── Comparison (always returns boolean) ────────────────────────────
5 > 3    // true
5 >= 5   // true
5 == "5" // true  ← coercion (avoid)
5 === "5"// false ← strict (use this)
5 !== 3  // true

// ── Logical ────────────────────────────────────────────────────────
true && false  // false — both must be truthy
true || false  // true  — at least one must be truthy
!true          // false

// Short-circuit evaluation — crucial pattern in React and Node.js
const user = null;
const name = user && user.name;   // null  — stops at user (falsy)
const role = user || "guest";     // "guest" — uses right side when left is falsy

// ── Nullish coalescing ?? ───────────────────────────────────────────
// Like || but only falls back when left side is null or undefined
// (not 0, '', or false which || would also skip)
const count = 0;
const a = count || 10;   // 10  — oops, 0 is falsy
const b = count ?? 10;   // 0   — 0 is not null/undefined

// ── Optional chaining ?. ────────────────────────────────────────────
const city = user?.address?.city;  // undefined — no error if user is null
const len  = user?.name?.length;   // undefined

// ── Ternary ─────────────────────────────────────────────────────────
const label = age >= 18 ? "adult" : "minor";`,
        },
      ],
    },
    {
      title: { en: "Conditionals", np: "Conditionals", jp: "条件分岐" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Conditionals let your program take different paths depending on data. `if/else` reads like plain English for a handful of branches; `switch` reads cleaner once you have many exact-match cases; and the <b>guard clause</b> pattern — returning early on invalid input — flattens code that would otherwise nest three or four `if` blocks deep.\n\nThink of guard clauses as a bouncer at the door: reject anyone who doesn't meet the requirements immediately, so the code inside the venue never has to double-check who's allowed to be there.",
            np: "if/else थोरै branches मा राम्रो। switch धेरै exact-match cases मा सफा। Guard clause ले invalid input लाई सुरुमै return गरी nesting हटाउँछ।",
            jp: "if/elseは少数の分岐に向く。switchは多数の完全一致に向く。ガード節は無効な入力を早期returnし、ネストを減らす。",
          },
        },
        {
          type: "code",
          title: { en: "if/else, switch and guard clauses", np: "if/else, switch र guard clauses", jp: "if/else・switch・ガード節" },
          code: `// ── if / else if / else ──────────────────────────────────────────
const score = 75;

if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else if (score >= 70) {
  console.log("C");
} else {
  console.log("F");
}

// ── switch — cleaner for many discrete values ─────────────────────
const day = "Monday";

switch (day) {
  case "Monday":
  case "Tuesday":
    console.log("Early week");
    break;        // without break, execution falls through to the next case
  case "Friday":
    console.log("Almost weekend");
    break;
  default:
    console.log("Mid week");
}

// ── Guard clauses — return early instead of deep nesting ──────────
// ❌ Deeply nested (hard to read)
function processOrder(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.isPaid) {
        // actual logic buried three levels deep
        ship(order);
      }
    }
  }
}

// ✅ Guard clauses (easier to read and maintain)
function processOrder(order) {
  if (!order) return;                      // bail early
  if (order.items.length === 0) return;    // bail early
  if (!order.isPaid) return;              // bail early
  ship(order);                             // actual logic at top level
}`,
        },
      ],
    },
    {
      title: { en: "Loops", np: "Loops", jp: "ループ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "All loops repeat a block of code — they differ in <b>what</b> drives the repetition and <b>what</b> they can iterate over.\n\n• <b>for</b> — use when you need a counter or an index\n• <b>while</b> — use when the stopping condition isn't a simple count\n• <b>for...of</b> — use to walk through values in arrays, strings, Sets, and Maps\n  ↳ Gives you the value directly, no index bookkeeping\n• <b>for...in</b> — use to walk through an object's own keys\n  ↳ Not for arrays — it also visits inherited properties, which arrays rarely want",
            np: "for = counter चाहिँदा। while = simple count नभएको exit condition। for...of = array/string/Set/Map को value। for...in = object को key — array को लागि होइन।",
            jp: "for＝カウンタが必要な時。while＝単純なカウントでない終了条件。for...of＝配列・文字列・Set・Mapの値。for...in＝オブジェクトのキー（配列には不向き）。",
          },
        },
        {
          type: "code",
          title: { en: "for, while, for...of, for...in — when to use each", np: "Loops — कहिले कुन?", jp: "各ループの使い分け" },
          code: `// ── for — when you need the index or a counted loop ───────────────
for (let i = 0; i < 5; i++) {
  console.log(i);  // 0 1 2 3 4
}

// ── while — when the exit condition is not a simple counter ────────
let attempts = 0;
while (attempts < 3) {
  attempts++;
}

// do...while — body always runs at least once
do {
  attempts++;
} while (attempts < 0);  // runs once even though condition is false

// ── for...of — iterate over iterable values (arrays, strings, Sets, Maps)
const fruits = ["apple", "banana", "cherry"];
for (const fruit of fruits) {
  console.log(fruit);     // apple / banana / cherry
}

// With index (use entries()):
for (const [i, fruit] of fruits.entries()) {
  console.log(i, fruit);  // 0 apple / 1 banana / ...
}

// ── for...in — iterate over object keys (not for arrays!)
const person = { name: "Alice", age: 30 };
for (const key in person) {
  console.log(key, person[key]);  // name Alice / age 30
}
// ⚠️ for...in also iterates inherited prototype properties — use hasOwnProperty check
// or Object.keys() / Object.entries() instead

// ── break and continue ───────────────────────────────────────────
for (let i = 0; i < 10; i++) {
  if (i === 3) continue;  // skip 3
  if (i === 7) break;     // stop at 7
  console.log(i);         // 0 1 2 4 5 6
}`,
        },
      ],
    },
    {
      title: { en: "Function types — declaration, expression & arrow", np: "Function types — declaration, expression, arrow", jp: "関数の3種類" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A function is just a named block of reusable code, but JavaScript gives you three syntaxes to create one — and the choice affects two things: whether the function is <b>hoisted</b>, and what `this` means inside it.\n\n• <b>Function declaration</b> — `function greet() {}` — fully hoisted, has its own `this`\n  ↳ Best for top-level, named, reusable utilities\n• <b>Function expression</b> — `const greet = function() {}` — not hoisted, has its own `this`\n  ↳ Useful when you need to pass a function around or create it conditionally\n• <b>Arrow function</b> — `const greet = () => {}` — not hoisted, borrows `this` from where it's written\n  ↳ The safe default for callbacks — no surprise `this`, no `arguments`, can't be used as a constructor",
            np: "Function declaration पूरै hoisted, आफ्नै this। Function expression hoisted हुँदैन। Arrow function ले this लाई surrounding context बाट borrow गर्छ — callback को लागि default।",
            jp: "関数宣言は完全にホイストされ独自のthisを持つ。関数式はホイストされない。アロー関数は周囲のthisを継承し、コールバックの安全なデフォルト。",
          },
        },
        {
          type: "code",
          title: { en: "Three ways to write a function and their differences", np: "Function को तीन तरिका र फरक", jp: "3種類の関数とその違い" },
          code: `// ── Function Declaration — hoisted, named, has its own 'this' ─────
function greet(name) {
  return \`Hello, \${name}!\`;
}
// You can call greet() BEFORE this line because function declarations are fully hoisted

// ── Function Expression — NOT hoisted, stored in a variable ────────
const greet2 = function(name) {
  return \`Hello, \${name}!\`;
};
// greet2 is undefined before this line (the variable is hoisted, but not initialised)

// Named function expression — the name 'sayHi' is only available inside the function
const greet3 = function sayHi(name) {
  return \`Hello, \${name}!\`;
};

// ── Arrow Function — concise syntax, no own 'this', not constructable ─
const greet4 = (name) => \`Hello, \${name}!\`;  // implicit return for single expression

const add = (a, b) => a + b;

const square = n => n * n;  // parens optional for single param

const makeUser = (name) => ({           // wrap in () to return an object literal
  name,
  createdAt: new Date(),
});

// Multi-line arrow function needs explicit return
const greet5 = (name) => {
  const message = \`Hello, \${name}!\`;
  return message;
};

// ── Key difference: 'this' binding ─────────────────────────────────
const timer = {
  seconds: 0,

  startRegular: function() {
    // function() has its own 'this' — but inside setInterval, 'this' is lost
    setInterval(function() {
      this.seconds++;          // ❌ 'this' is undefined (strict) or window (non-strict)
    }, 1000);
  },

  startArrow: function() {
    // Arrow function captures 'this' from the surrounding context (startArrow's this)
    setInterval(() => {
      this.seconds++;          // ✅ 'this' is the timer object
    }, 1000);
  },
};`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            { en: "<b>Function declarations</b> are hoisted — you can call them before they appear in the file. Use them for named, reusable utility functions at the top level of a module.", np: "Function declaration hoist हुन्छ। Module को top-level utility function का लागि प्रयोग गर्नुहोस्।", jp: "関数宣言はホイストされる。モジュールのトップレベルのユーティリティ関数に使う。" },
            { en: "<b>Function expressions</b> are useful when you need to pass a function as an argument or conditionally create one.", np: "Function expression argument पठाउन वा conditionally create गर्न उपयोगी।", jp: "関数式は引数として渡すときや条件付きで生成するときに便利。" },
            { en: "<b>Arrow functions</b> should be your default for callbacks and inline functions. They do not have their own `this`, `arguments`, or `prototype`, which avoids common pitfalls in callbacks.", np: "Arrow function callback को लागि default — आफ्नै this, arguments, prototype छैन।", jp: "アロー関数はコールバックのデフォルト。this・arguments・prototypeを持たないためコールバックで安全。" },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "When should I use an arrow function vs a regular function?", np: "Arrow function र regular function कहिले?", jp: "アロー関数と通常関数の使い分けは？" },
      answer: {
        en: "Use arrow functions for callbacks, array methods, and any place where you want to inherit `this` from the surrounding context. Use regular functions (declaration or expression) when you need the function to have its own `this` — for example, object methods where `this` refers to the object, or constructor functions. Never use arrow functions as constructors (they throw a TypeError) or as object methods when you need `this` to refer to the object.",
        np: "Callback, array methods, surrounding this inherit गर्न arrow function। Object methods जहाँ this ले object नै बुझाउनु पर्छ त्यहाँ regular function। Arrow function constructor भएर हुँदैन।",
        jp: "コールバック・配列メソッド・周囲のthisを継承したい場合はアロー関数。オブジェクトメソッドやコンストラクタなどthisが自分のものを指す必要がある場合は通常関数。",
      },
    },
    {
      question: { en: "What is the difference between break and continue?", np: "break र continue मा के फरक?", jp: "breakとcontinueの違いは？" },
      answer: {
        en: "`break` exits the loop entirely — no more iterations run. `continue` skips the rest of the current iteration and moves to the next one. Both work in `for`, `while`, and `for...of` loops. In a `switch` statement, `break` exits the switch block — without it, execution falls through to the next case.",
        np: "`break` loop पूरै छोड्छ। `continue` current iteration मात्र skip गरेर अर्को iteration मा जान्छ।",
        jp: "`break`はループを完全に終了。`continue`は現在のイテレーションをスキップして次へ。switchでは`break`がないとfall-throughが起きる。",
      },
    },
    {
      question: { en: "Why does `count || 10` behave differently from `count ?? 10` when count is 0?", np: "count 0 हुँदा `||` र `??` किन फरक व्यवहार गर्छ?", jp: "countが0のとき`||`と`??`はなぜ異なる動作をする？" },
      answer: {
        en: "`||` falls back to the right side whenever the left side is any falsy value — and `0` is falsy in JavaScript, so `0 || 10` evaluates to `10`, silently discarding a legitimate value. `??` only falls back when the left side is exactly `null` or `undefined`, so `0 ?? 10` correctly evaluates to `0`. Whenever `0`, `''`, or `false` are valid values you want to keep, prefer `??` over `||`.",
        np: "`||` ले कुनै पनि falsy value मा fallback गर्छ — 0 पनि falsy भएकाले `0 || 10` ले 10 दिन्छ। `??` ले केवल null/undefined मा मात्र fallback गर्छ — `0 ?? 10` ले 0 नै दिन्छ।",
        jp: "`||`はfalsy値すべてでフォールバックする（0もfalsyなので`0 || 10`は10になる）。`??`はnull/undefinedの時のみフォールバックするため`0 ?? 10`は0のまま。",
      },
    },
  ],
};
