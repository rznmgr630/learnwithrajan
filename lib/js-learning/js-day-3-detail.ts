import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_3_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Scope is the set of rules that determines where a variable can be accessed. Hoisting is what JavaScript does before it runs your code — it moves declarations to the top of their scope. Together, these two concepts explain most of the 'why did that variable come back undefined?' moments you will encounter.",
      np: "Scope ले variable कहाँ access गर्न पाइन्छ भनी निर्धारण गर्छ। Hoisting ले code चलाउनु अगाडि declarations माथि move गर्छ — यी दुई मिलेर 'किन undefined आयो?' भन्ने प्रश्नको उत्तर दिन्छन्।",
      jp: "スコープは変数のアクセス範囲を決めるルール。ホイスティングはコード実行前に宣言を巻き上げるJS固有の動作。この2つで「なぜundefinedが返るのか」という疑問の多くが解決する。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "uH-tVapollo8", title: "JavaScript Scope Explained" },
      ],
    },
    {
      title: { en: "The three scope types", np: "तीन scope types", jp: "3種類のスコープ" },
      blocks: [
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
            en: "JavaScript uses **lexical scoping** (also called static scoping): the scope of a variable is determined by where it is written in the source code, not by how the function is called. An inner function always has access to the variables of the outer function that contains it — even after the outer function has returned. This is the foundation of closures (Day 4).",
            np: "JavaScript **lexical scoping** प्रयोग गर्छ: variable को scope कहाँ लेखिएको छ त्यसले निर्धारण गर्छ — function कसरी call हुन्छ त्यसले होइन। Inner function ले outer function को variables access गर्न सक्छ — outer return भएपछि पनि। यही Closure को आधार हो।",
            jp: "JavaScriptは**レキシカルスコープ**を使う。変数のスコープはコードの書かれた場所で決まる（呼び出し方ではない）。内側の関数は外側の変数にアクセスできる。これがクロージャの基礎。",
          },
        },
      ],
    },
    {
      title: { en: "Hoisting in detail", np: "Hoisting विस्तारमा", jp: "ホイスティング詳解" },
      blocks: [
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
            en: "The Temporal Dead Zone is the period between when a `let` or `const` variable is hoisted (the start of its enclosing block) and when it is actually initialised (the line where it is declared). Accessing it during this period throws a ReferenceError. The TDZ exists to help you catch bugs where you accidentally use a variable before you meant to assign it — a class of bug that `var`'s silent `undefined` would hide.",
            np: "Temporal Dead Zone एउटा `let` वा `const` variable hoist हुनेदेखि (block को सुरु) initialized हुनेसम्म (declaration line) को period हो। यस बीचमा access गर्दा ReferenceError आउँछ। TDZ ले variable लाई assign गर्नु अघि accidentally use गर्ने bugs detect गर्न मद्दत गर्छ।",
            jp: "TDZとはlet/constがホイストされた時点（ブロック開始）から実際に初期化される（宣言行）までの期間。この間にアクセスするとReferenceError。varのundefined隠蔽によるバグを防ぐために存在する。",
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
  ],
};
