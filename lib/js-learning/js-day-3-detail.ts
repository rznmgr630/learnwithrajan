import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_3_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Scope is the set of rules that determines where a variable can be accessed. Hoisting is what JavaScript does before it runs your code — it scans ahead and registers every declaration before the first line executes. Together, these two concepts explain most of the \"why did that variable come back undefined?\" moments you will encounter.",
      np: "Scope ले variable कहाँ access गर्न पाइन्छ भनी निर्धारण गर्छ। Hoisting ले code चलाउनु अगाडि declarations माथि move गर्छ — यी दुई मिलेर 'किन undefined आयो?' भन्ने प्रश्नको उत्तर दिन्छन्।",
      jp: "スコープは変数のアクセス範囲を決めるルール。ホイスティングはコード実行前に宣言を巻き上げるJS固有の動作。この2つで「なぜundefinedが返るのか」という疑問の多くが解決する。",
    },
    {
      en: "In Day 3 we cover:\n• <b>Global, function, and block scope</b> — three nested boundaries a variable can live inside\n• <b>Lexical scoping</b> — why inner functions can always see outer variables\n• <b>Hoisting</b> — what gets moved up, and to what initial value\n• The <b>Temporal Dead Zone (TDZ)</b> — why let/const throw instead of quietly returning undefined",
      np: "Day 3 मा: global/function/block scope, lexical scoping, hoisting, र Temporal Dead Zone।",
      jp: "Day 3では: グローバル・関数・ブロックスコープ、レキシカルスコープ、ホイスティング、TDZを学びます。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "EvfRXyKa_GI", title: "Learn JavaScript Hoisting In 5 Minutes" },
      ],
    },
    {
      title: { en: "The three scope types", np: "तीन scope types", jp: "3種類のスコープ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Scope is about visibility — which variables a piece of code is allowed to see. JavaScript nests three kinds of scope inside each other like Russian dolls: whatever is visible at an outer layer stays visible at every layer inside it, but never the other way round.\n\n• <b>Global scope</b> — the outermost doll; visible from anywhere in the file\n• <b>Function scope</b> — a doll inside the global one; visible only inside that function\n• <b>Block scope</b> — the smallest doll, created by any `{ }` (an `if`, `for`, or bare block); visible only inside that block\n  ↳ `var` ignores this smallest doll entirely — it always escapes to the nearest function (or global) layer",
            np: "Scope भनेको visibility हो — कुन variable कहाँ देखिन्छ। JavaScript मा तीन scope Russian doll जस्तै nested हुन्छन्: बाहिरको भित्र देखिन्छ, भित्रको बाहिर देखिँदैन।",
            jp: "スコープは可視性のこと。JavaScriptには入れ子になった3種類のスコープがあり、外側は内側から見えるが、内側は外側から見えない。",
          },
        },
        {
          type: "code",
          title: { en: "Scope nesting — global → function → block (visual)", np: "Scope nesting (visual)", jp: "スコープの入れ子（図）" },
          code: `┌─ Global scope ─────────────────────────────────────┐
│  const appName = "MyApp";                           │
│                                                       │
│  ┌─ Function scope (outer()) ─────────────────────┐  │
│  │  const secret = "only mine";                    │  │
│  │                                                   │  │
│  │  ┌─ Block scope ( if (true) { ... } ) ────────┐  │  │
│  │  │  let blockOnly = "block";                  │  │  │
│  │  │  var notBlock  = "leaks out!";  ← escapes ─┼──┼──┘
│  │  └─────────────────────────────────────────────┘  │
│  └───────────────────────────────────────────────────┘
└───────────────────────────────────────────────────────┘

// Inner layers can read outer variables (arrows point outward, always allowed):
//   block scope    -> can read appName, secret, blockOnly
//   function scope -> can read appName, secret (not blockOnly — it's a layer down)
//   global scope   -> can read appName only`,
        },
        {
          type: "code",
          title: { en: "Global, function, and block scope", np: "Global, function, block scope", jp: "グローバル・関数・ブロックスコープ" },
          code: `// ── Global scope — accessible everywhere in the file ──────────────
const appName = "MyApp";  // global

function doSomething() {
  console.log(appName);  // ✅ accessible — inner scopes can read outer variables
}

// ── Function scope — only inside that function ──────────────────────
function outer() {
  const secret = "only mine";
  console.log(secret);    // ✅ works
}
// console.log(secret);   // ❌ ReferenceError — not accessible outside

// ── Block scope — only inside the { } block ─────────────────────────
if (true) {
  let blockOnly = "block";
  const alsoBlock = "also block";
  var notBlock = "leaks out!";  // var ignores blocks
}
// console.log(blockOnly);   // ❌ ReferenceError
// console.log(alsoBlock);   // ❌ ReferenceError
console.log(notBlock);         // ✅ "leaks out!" — because var is function-scoped

// ── Lexical scope — inner functions access outer variables ──────────
function makeCounter() {
  let count = 0;           // outer variable

  return function () {
    count++;               // inner function can read AND write outer's 'count'
    return count;
  };
}

const counter = makeCounter();
counter();  // 1
counter();  // 2
counter();  // 3
// count is not accessible here — it lives inside makeCounter's scope`,
        },
        {
          type: "paragraph",
          text: {
            en: "JavaScript uses <b>lexical scoping</b> (also called static scoping): the scope of a variable is determined by <b>where it is written</b> in the source code, not by how or where the function is later called. An inner function always has access to the variables of the outer function that contains it — even after the outer function has already finished running.\n\nThis \"remembers where it was born, not where it's called from\" rule is the entire foundation of closures, which Day 4 builds on directly.",
            np: "JavaScript ले lexical scoping प्रयोग गर्छ: variable को scope कहाँ लेखिएको छ त्यसले निर्धारण गर्छ — function कसरी call हुन्छ त्यसले होइन। यही Closure को आधार हो।",
            jp: "JavaScriptはレキシカルスコープを使う。変数のスコープはコードの書かれた場所で決まる（呼び出し方ではない）。これがクロージャの基礎。",
          },
        },
      ],
    },
    {
      title: { en: "Hoisting in detail", np: "Hoisting विस्तारमा", jp: "ホイスティング詳解" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every declaration type hoists differently — some get a placeholder value immediately, others get registered but locked. Knowing which is which turns a confusing `ReferenceError` or unexpected `undefined` into something you can predict before you even run the code.",
            np: "हरेक declaration type फरक तरिकाले hoist हुन्छ — कोहीलाई placeholder value तुरुन्तै मिल्छ, कोही registered तर locked रहन्छ।",
            jp: "宣言の種類ごとにホイストの仕方が異なる。どれがどうなるか知っていれば、ReferenceErrorや予期しないundefinedを事前に予測できる。",
          },
        },
        {
          type: "code",
          title: { en: "What gets hoisted — and to what value", np: "के hoist हुन्छ र कुन value मा", jp: "何がどの値でホイストされるか" },
          code: `// ── var is hoisted and initialised to undefined ───────────────────
console.log(x);  // undefined — NOT a ReferenceError
var x = 5;
console.log(x);  // 5

// JavaScript sees this as:
var x;           // declaration hoisted to top of function scope
console.log(x);  // undefined
x = 5;           // assignment stays in place
console.log(x);  // 5

// ── function declarations are FULLY hoisted (declaration + body) ───
sayHello();      // ✅ "Hello!" — works before the declaration
function sayHello() {
  console.log("Hello!");
}

// ── let and const are hoisted but sit in the Temporal Dead Zone ────
// console.log(y);   // ❌ ReferenceError: Cannot access 'y' before initialization
let y = 10;
console.log(y);     // 10

// ── Function expressions and arrow functions — NOT hoisted ─────────
// greet("Alice");   // ❌ TypeError: greet is not a function
const greet = (name) => \`Hello \${name}\`;
greet("Alice");     // ✅ works after assignment

// ── Class declarations follow let/const rules (TDZ) ───────────────
// new Animal();  // ❌ ReferenceError: Cannot access 'Animal' before initialization
class Animal {}
new Animal();      // ✅`,
        },
        {
          type: "table",
          caption: { en: "Hoisting summary — what each declaration type hoists to", np: "Hoisting summary", jp: "各宣言のホイスト動作まとめ" },
          headers: [
            { en: "Declaration", np: "Declaration", jp: "宣言" },
            { en: "Hoisted?", np: "Hoist?", jp: "ホイスト?" },
            { en: "Initial value", np: "Initial value", jp: "初期値" },
            { en: "TDZ?", np: "TDZ?", jp: "TDZ?" },
          ],
          rows: [
            [
              { en: "var", np: "var", jp: "var" },
              { en: "Yes", np: "हो", jp: "はい" },
              { en: "undefined", np: "undefined", jp: "undefined" },
              { en: "No", np: "होइन", jp: "なし" },
            ],
            [
              { en: "let", np: "let", jp: "let" },
              { en: "Yes", np: "हो", jp: "はい" },
              { en: "uninitialized (TDZ)", np: "TDZ", jp: "未初期化(TDZ)" },
              { en: "Yes", np: "हो", jp: "あり" },
            ],
            [
              { en: "const", np: "const", jp: "const" },
              { en: "Yes", np: "हो", jp: "はい" },
              { en: "uninitialized (TDZ)", np: "TDZ", jp: "未初期化(TDZ)" },
              { en: "Yes", np: "हो", jp: "あり" },
            ],
            [
              { en: "function declaration", np: "function declaration", jp: "関数宣言" },
              { en: "Yes (fully)", np: "हो (पूरै)", jp: "はい(完全)" },
              { en: "function body", np: "function body", jp: "関数本体" },
              { en: "No", np: "होइन", jp: "なし" },
            ],
            [
              { en: "function expression / arrow", np: "function expression/arrow", jp: "関数式/アロー" },
              { en: "As variable (var/let/const)", np: "variable जस्तै", jp: "変数と同様" },
              { en: "undefined or TDZ", np: "undefined या TDZ", jp: "undefinedまたはTDZ" },
              { en: "Depends on keyword", np: "keyword अनुसार", jp: "キーワード依存" },
            ],
          ],
        },
      ],
    },
    {
      title: { en: "The Temporal Dead Zone (TDZ)", np: "Temporal Dead Zone (TDZ)", jp: "一時的デッドゾーン(TDZ)" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The <b>Temporal Dead Zone</b> is the gap between when a `let` or `const` variable is hoisted (the start of its enclosing block) and when it is actually initialised (the line where it is declared). Touching it during that gap throws a `ReferenceError`.\n\nThink of it like a parcel that has arrived at the depot but hasn't been signed for yet — the system knows the parcel exists (it's registered), but it refuses to hand it over until the paperwork (the declaration line) is complete. `var`'s silent `undefined` is the opposite: it hands you an empty box and lets you assume it's fine, which is exactly the kind of bug the TDZ was designed to surface loudly instead.",
            np: "Temporal Dead Zone एउटा `let` वा `const` variable hoist हुनेदेखि (block को सुरु) initialized हुनेसम्म (declaration line) को period हो। यस बीचमा access गर्दा ReferenceError आउँछ।",
            jp: "TDZとはlet/constがホイストされた時点（ブロック開始）から実際に初期化される（宣言行）までの期間。この間にアクセスするとReferenceError。",
          },
        },
        {
          type: "code",
          title: { en: "TDZ example — surprising but predictable once you know the rule", np: "TDZ उदाहरण", jp: "TDZの例" },
          code: `// This looks like it should work but doesn't
let x = "global";

function test() {
  console.log(x);  // ❌ ReferenceError — NOT "global"
  let x = "local"; // x is in TDZ from the top of this block until here
}

test();

// Why? Because let x inside test() is hoisted to the top of test's block.
// The x inside test() shadows the outer x immediately —
// but it's in the TDZ until the let x = "local" line is reached.
// So the console.log sees the inner (TDZ) x, not the outer "global" x.

// ── The fix: always declare before use ────────────────────────────
function testFixed() {
  let x = "local";  // declare first
  console.log(x);   // ✅ "local"
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "<b>The TDZ is a safety net, not a punishment.</b> It exists specifically to catch the moment you reference a variable before you meant to assign it — a mistake `var` would hide behind a quiet `undefined`.",
              np: "TDZ सजाय होइन, सुरक्षा जाल हो — variable assign गर्नु अघि accidentally access गर्ने bug पत्ता लगाउन बनाइएको हो।",
              jp: "TDZは罰ではなく安全網。意図せず変数を先に参照してしまうミスを検出するために存在する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What is lexical scope?", np: "Lexical scope के हो?", jp: "レキシカルスコープとは？" },
      answer: {
        en: "Lexical scope means a function's variable access is determined by where the function is defined in the source code, not where it is called from. A function defined inside another function always has access to the outer function's variables, no matter where it is later called. This is different from dynamic scope (where scope depends on the call stack) — JavaScript always uses lexical scope.",
        np: "Lexical scope भनेको function को variable access कहाँ define गरिएको छ त्यसले निर्धारण गर्छ — कहाँबाट call हुन्छ त्यसले होइन। Inner function ले outer function को variables हमेशा access गर्न सक्छ। JS हमेशा lexical scope प्रयोग गर्छ।",
        jp: "レキシカルスコープとは、関数の変数アクセスが呼び出し元ではなく、定義された場所で決まること。内側の関数は常に外側の変数にアクセスできる。JSは常にレキシカルスコープを使う。",
      },
    },
    {
      question: { en: "Why does var leak out of blocks?", np: "var किन block बाहिर leak हुन्छ?", jp: "varがブロックからリークする理由は？" },
      answer: {
        en: "var is function-scoped, not block-scoped. JavaScript had only function scope when it was first designed — the concept of block scope (using let and const) was added in ES6 (2015). Before that, the only way to create a new scope was with a function. This is why var ignores if/for/while blocks and is scoped to the nearest enclosing function. It is also why old code used IIFEs (Immediately Invoked Function Expressions) to create private scope.",
        np: "var function-scoped हो, block-scoped होइन। JavaScript सुरुमा केवल function scope थियो — block scope (let/const) ES6 (2015) मा थपियो। त्यसैले var if/for/while blocks ignore गर्छ।",
        jp: "varは関数スコープでありブロックスコープではない。ブロックスコープ(let/const)はES6(2015)で追加。それ以前はIIFEでスコープを作っていた。",
      },
    },
    {
      question: { en: "How does JavaScript decide which variable to use when names are duplicated across scopes?", np: "same नाम बहु scope मा भएमा JS ले कुन variable छान्छ?", jp: "同名の変数が複数のスコープにある場合、JSはどれを選ぶ？" },
      answer: {
        en: "JavaScript looks up the scope chain starting from the innermost scope and stops at the first match — this is called shadowing. If a block declares its own `x`, any code inside that block sees the block's `x`, not the outer one, even though the outer `x` still exists and is untouched. Once you leave that inner block, the outer `x` becomes visible again. This is exactly what happens in the TDZ example above: the inner `let x` shadows the outer `x` for the entire function, even before the inner one is assigned.",
        np: "JS सबैभन्दा भित्री scope बाट खोज्दै बाहिर जान्छ र पहिलो मिल्ने variable प्रयोग गर्छ — यसलाई shadowing भनिन्छ।",
        jp: "JSは最も内側のスコープから外側へスコープチェーンを探索し、最初に一致した変数を使う。これをシャドーイングと呼ぶ。",
      },
    },
  ],
};
