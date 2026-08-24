import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_3_LESSONS: JsLessonDay = {
  day: 3,
  title: { en: "Scope, Hoisting & the Temporal Dead Zone", np: "Scope, Hoisting र Temporal Dead Zone", jp: "スコープ・ホイスティング・TDZ" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "scope-types",
      title: { en: "The Three Scope Types", np: "तीन Scope Types", jp: "3種類のスコープ" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Scope</b> (where a variable can be accessed) controls which parts of your code can see a variable.\n\nJavaScript has three main types of scope:\n\n```text\nGlobal scope\nFunction scope\nBlock scope\n```\n\nThink of scope like boxes inside other boxes:\n\n```text\nGlobal\n└── Function\n    └── Block\n```\n\nA variable in an outer scope can usually be accessed by code inside it, but an inner variable cannot be accessed from outside.\n\n---\n\n### 1. Global Scope\n\n<b>Global scope</b> (the outermost scope, available throughout the program) is created outside functions and blocks.\n\n```javascript\nconst name = \"Rajan\";\n\nfunction greet() {\n  console.log(name);\n}\n\ngreet(); // Rajan\n```\n\nThe function can access `name` because `name` is in the outer scope.\n\n---\n\n### 2. Function Scope\n\n<b>Function scope</b> (variables that are available only inside a function) is created when a function is defined.\n\n```javascript\nfunction greet() {\n  const message = \"Hello\";\n\n  console.log(message);\n}\n\ngreet(); // Hello\n\nconsole.log(message); // Error\n```\n\n`message` exists only inside `greet()`.\n\n---\n\n### 3. Block Scope\n\n<b>Block scope</b> (variables available only inside `{ }`) is created by blocks such as:\n\n```javascript\nif\nfor\nwhile\n```\n\nExample:\n\n```javascript\nif (true) {\n  let age = 30;\n\n  console.log(age); // 30\n}\n\nconsole.log(age); // Error\n```\n\n`let` and `const` are block-scoped.\n\n---\n\n### `var` and Block Scope\n\n<b>`var`</b> (the older variable declaration) does not respect block scope.\n\n```javascript\nif (true) {\n  var age = 30;\n}\n\nconsole.log(age); // 30\n```\n\n`var` escapes the block and belongs to the nearest function scope.\n\nThis is one reason modern JavaScript prefers `let` and `const`.\n\n---\n\n### 4. Lexical Scoping\n\n<b>Lexical scoping</b> (scope determined by where code is written) means JavaScript decides what variables a function can access based on where the function was created.\n\n```javascript\nfunction outer() {\n  const name = \"Rajan\";\n\n  function inner() {\n    console.log(name);\n  }\n\n  inner();\n}\n\nouter(); // Rajan\n```\n\n`inner()` can access `name` because it was written inside `outer()`.\n\nThis is true even if the function is called somewhere else.\n\nThis behavior is the foundation of <b>closures</b> (functions that remember variables from where they were created).\n\n---\n\n### Visibility Rule\n\n```text\nOuter scope\n     ↓\nInner scope can see it\n\nInner scope\n     ↓\nOuter scope cannot see it\n```\n\nExample:\n\n```javascript\nconst global = \"Global\";\n\nfunction outer() {\n  const local = \"Local\";\n\n  if (true) {\n    const block = \"Block\";\n\n    console.log(global); // Works\n    console.log(local);  // Works\n    console.log(block);  // Works\n  }\n\n  console.log(block); // Error\n}\n```",
        np: "<b>Scope</b> (variable कहाँ पहुँच गर्न सकिन्छ) ले तपाईंको code का कुन भागले variable देख्न सक्छ भन्ने नियन्त्रण गर्छ।\n\nJavaScript मा तीन मुख्य प्रकारका scope छन्:\n\n```text\nGlobal scope\nFunction scope\nBlock scope\n```\n\nScope लाई बाकसभित्र बाकस जस्तै सोच्नुहोस्:\n\n```text\nGlobal\n└── Function\n    └── Block\n```\n\nबाहिरी scope को variable भित्रको code ले सामान्यतया पहुँच गर्न सक्छ, तर भित्री variable लाई बाहिरबाट पहुँच गर्न सकिँदैन।\n\n---\n\n### 1. Global Scope\n\n<b>Global scope</b> (सबैभन्दा बाहिरी scope, पूरै program भर उपलब्ध) function र block बाहिर बन्छ।\n\n```javascript\nconst name = \"Rajan\";\n\nfunction greet() {\n  console.log(name);\n}\n\ngreet(); // Rajan\n```\n\nFunction ले `name` पहुँच गर्न सक्छ किनकि `name` बाहिरी scope मा छ।\n\n---\n\n### 2. Function Scope\n\n<b>Function scope</b> (function भित्र मात्र उपलब्ध हुने variable) function परिभाषित हुँदा बन्छ।\n\n```javascript\nfunction greet() {\n  const message = \"Hello\";\n\n  console.log(message);\n}\n\ngreet(); // Hello\n\nconsole.log(message); // Error\n```\n\n`message` `greet()` भित्र मात्र अस्तित्वमा हुन्छ।\n\n---\n\n### 3. Block Scope\n\n<b>Block scope</b> (`{ }` भित्र मात्र उपलब्ध हुने variable) यस्ता block ले बनाउँछन्:\n\n```javascript\nif\nfor\nwhile\n```\n\nउदाहरण:\n\n```javascript\nif (true) {\n  let age = 30;\n\n  console.log(age); // 30\n}\n\nconsole.log(age); // Error\n```\n\n`let` र `const` block-scoped हुन्।\n\n---\n\n### `var` र Block Scope\n\n<b>`var`</b> (पुरानो variable declaration) ले block scope मान्दैन।\n\n```javascript\nif (true) {\n  var age = 30;\n}\n\nconsole.log(age); // 30\n```\n\n`var` block बाट उम्किन्छ र नजिकको function scope मा पर्छ।\n\nआधुनिक JavaScript ले `let` र `const` मन पराउनुको यो एक कारण हो।\n\n---\n\n### 4. Lexical Scoping\n\n<b>Lexical scoping</b> (code कहाँ लेखिएको छ त्यसले तय गर्ने scope) को अर्थ JavaScript ले function कहाँ बनाइएको थियो त्यसका आधारमा त्यसले कुन variable पहुँच गर्न सक्छ भन्ने निर्णय गर्छ।\n\n```javascript\nfunction outer() {\n  const name = \"Rajan\";\n\n  function inner() {\n    console.log(name);\n  }\n\n  inner();\n}\n\nouter(); // Rajan\n```\n\n`inner()` ले `name` पहुँच गर्न सक्छ किनकि यो `outer()` भित्र लेखिएको थियो।\n\nFunction अन्त कतै call गरिए पनि यो सत्य हुन्छ।\n\nयो व्यवहार <b>closures</b> (आफू बनेको ठाउँका variable सम्झने function) को जग हो।\n\n---\n\n### दृश्यता नियम\n\n```text\nOuter scope\n     ↓\nInner scope can see it\n\nInner scope\n     ↓\nOuter scope cannot see it\n```\n\nउदाहरण:\n\n```javascript\nconst global = \"Global\";\n\nfunction outer() {\n  const local = \"Local\";\n\n  if (true) {\n    const block = \"Block\";\n\n    console.log(global); // Works\n    console.log(local);  // Works\n    console.log(block);  // Works\n  }\n\n  console.log(block); // Error\n}\n```",
        jp: "<b>スコープ</b>（変数にアクセスできる範囲）は、コードのどの部分がその変数を見られるかを決めます。\n\nJavaScriptには主に3種類のスコープがあります:\n\n```text\nGlobal scope\nFunction scope\nBlock scope\n```\n\nスコープは箱の中の箱のようなものだと考えてください:\n\n```text\nGlobal\n└── Function\n    └── Block\n```\n\n外側のスコープの変数は内側のコードから使えますが、内側の変数を外側から使うことはできません。\n\n---\n\n### 1. グローバルスコープ\n\n<b>グローバルスコープ</b>（最も外側のスコープ。プログラム全体で使える）は、関数やブロックの外に作られます。\n\n```javascript\nconst name = \"Rajan\";\n\nfunction greet() {\n  console.log(name);\n}\n\ngreet(); // Rajan\n```\n\n`name` が外側のスコープにあるので、関数から使えます。\n\n---\n\n### 2. 関数スコープ\n\n<b>関数スコープ</b>（関数の中でだけ使える変数）は、関数を定義したときに作られます。\n\n```javascript\nfunction greet() {\n  const message = \"Hello\";\n\n  console.log(message);\n}\n\ngreet(); // Hello\n\nconsole.log(message); // Error\n```\n\n`message` は `greet()` の中にだけ存在します。\n\n---\n\n### 3. ブロックスコープ\n\n<b>ブロックスコープ</b>（`{ }` の中でだけ使える変数）は、次のようなブロックが作ります:\n\n```javascript\nif\nfor\nwhile\n```\n\n例:\n\n```javascript\nif (true) {\n  let age = 30;\n\n  console.log(age); // 30\n}\n\nconsole.log(age); // Error\n```\n\n`let` と `const` はブロックスコープです。\n\n---\n\n### `var` とブロックスコープ\n\n<b>`var`</b>（古い変数宣言）はブロックスコープを尊重しません。\n\n```javascript\nif (true) {\n  var age = 30;\n}\n\nconsole.log(age); // 30\n```\n\n`var` はブロックから抜け出し、最も近い関数スコープに属します。\n\n現代のJavaScriptが `let` と `const` を好む理由の1つがこれです。\n\n---\n\n### 4. レキシカルスコープ\n\n<b>レキシカルスコープ</b>（コードが書かれた場所で決まるスコープ）とは、関数がどこで作られたかに基づいて、その関数が使える変数をJavaScriptが決めるという意味です。\n\n```javascript\nfunction outer() {\n  const name = \"Rajan\";\n\n  function inner() {\n    console.log(name);\n  }\n\n  inner();\n}\n\nouter(); // Rajan\n```\n\n`inner()` は `outer()` の中に書かれているので `name` を使えます。\n\nこれは関数が別の場所で呼ばれても変わりません。\n\nこの性質が<b>クロージャ</b>（作られた場所の変数を覚えている関数）の土台になります。\n\n---\n\n### 見え方のルール\n\n```text\nOuter scope\n     ↓\nInner scope can see it\n\nInner scope\n     ↓\nOuter scope cannot see it\n```\n\n例:\n\n```javascript\nconst global = \"Global\";\n\nfunction outer() {\n  const local = \"Local\";\n\n  if (true) {\n    const block = \"Block\";\n\n    console.log(global); // Works\n    console.log(local);  // Works\n    console.log(block);  // Works\n  }\n\n  console.log(block); // Error\n}\n```",
      },
      diagram: `                    Global Scope
                  const global = ...
                         |
             +-----------+-----------+
             |                       |
       Function Scope           Other code
       const user = ...             |
             |                      |
       +-----+-----+                |
       |           |                |
   Block Scope  Block Scope         |
   let x = ...  const y = ...       |


Visibility Rule

Outer scope
     ↓
Inner scope can see it

Inner scope
     ↓
Outer scope cannot see it`,
      codeExample: {
        title: { en: "Global, function and block scope together", np: "Global, function र block scope सँगै", jp: "グローバル・関数・ブロックスコープを一度に" },
        code: `const globalName = "Rajan";

function greet() {
  const message = "Hello";

  if (true) {
    const age = 30;

    console.log(globalName); // Works
    console.log(message);    // Works
    console.log(age);        // Works
  }

  console.log(globalName); // Works
  console.log(message);    // Works
  console.log(age);        // Error
}

greet();`,
      },
      keyTakeaways: [
        { en: "<b>Scope</b> → determines where a variable can be accessed.", np: "<b>Scope</b> → variable कहाँ पहुँच गर्न सकिन्छ भन्ने तय गर्छ।", jp: "<b>スコープ</b> → 変数にアクセスできる範囲を決める。" },
        { en: "<b>Global scope</b> → available throughout the program.", np: "<b>Global scope</b> → पूरै program भर उपलब्ध।", jp: "<b>グローバルスコープ</b> → プログラム全体で使える。" },
        { en: "<b>Function scope</b> → available only inside a function.", np: "<b>Function scope</b> → function भित्र मात्र उपलब्ध।", jp: "<b>関数スコープ</b> → 関数の中でだけ使える。" },
        { en: "<b>Block scope</b> → available only inside `{ }`.", np: "<b>Block scope</b> → `{ }` भित्र मात्र उपलब्ध।", jp: "<b>ブロックスコープ</b> → `{ }` の中でだけ使える。" },
        { en: "`let` and `const` are block-scoped.", np: "`let` र `const` block-scoped हुन्।", jp: "`let` と `const` はブロックスコープ。" },
        { en: "`var` ignores block scope and uses function scope.", np: "`var` ले block scope बेवास्ता गरी function scope प्रयोग गर्छ।", jp: "`var` はブロックスコープを無視して関数スコープを使う。" },
        { en: "<b>Lexical scoping</b> → scope is decided by where the code is written.", np: "<b>Lexical scoping</b> → code कहाँ लेखिएको छ त्यसले scope तय गर्छ।", jp: "<b>レキシカルスコープ</b> → スコープはコードが書かれた場所で決まる。" },
        { en: "Inner scopes can access outer variables.", np: "भित्री scope ले बाहिरी variable पहुँच गर्न सक्छ।", jp: "内側のスコープは外側の変数にアクセスできる。" },
        { en: "Outer scopes cannot access variables inside inner scopes.", np: "बाहिरी scope ले भित्री scope का variable पहुँच गर्न सक्दैन।", jp: "外側のスコープは内側のスコープの変数にアクセスできない。" },
        { en: "Lexical scoping is the foundation of <b>closures</b>.", np: "Lexical scoping <b>closures</b> को जग हो।", jp: "レキシカルスコープは<b>クロージャ</b>の土台。" },
      ],
      commonMistakes: [
        { en: "<b>Trying to access a block variable outside the block</b> — `if (true) { let name = \"Rajan\"; }` then `console.log(name)` throws, because `name` only exists inside the block.", np: "<b>Block बाहिर block variable पहुँच गर्न खोज्नु</b> — `if (true) { let name = \"Rajan\"; }` पछि `console.log(name)` ले error दिन्छ, किनकि `name` block भित्र मात्र अस्तित्वमा हुन्छ।", jp: "<b>ブロックの外からブロック変数にアクセスしようとする</b> — `if (true) { let name = \"Rajan\"; }` の後の `console.log(name)` はエラーになる。`name` はブロックの中にしか存在しない。" },
        { en: "<b>Thinking `var` is block-scoped</b> — `if (true) { var age = 30; }` then `console.log(age)` prints `30`, because `var` escapes the block.", np: "<b>`var` block-scoped हो भन्ने ठान्नु</b> — `if (true) { var age = 30; }` पछि `console.log(age)` ले `30` देखाउँछ, किनकि `var` block बाट उम्किन्छ।", jp: "<b>`var` がブロックスコープだと思う</b> — `if (true) { var age = 30; }` の後の `console.log(age)` は `30` を出す。`var` はブロックから抜け出すから。" },
        { en: "<b>Thinking an inner variable is available outside</b> — a `const message` declared inside `greet()` belongs to that function scope and cannot be read after the call.", np: "<b>भित्री variable बाहिर उपलब्ध छ भन्ने ठान्नु</b> — `greet()` भित्र declare गरिएको `const message` त्यही function scope को हो र call पछि पढ्न सकिँदैन।", jp: "<b>内側の変数が外でも使えると思う</b> — `greet()` の中で宣言した `const message` はその関数スコープのものなので、呼び出し後に読むことはできない。" },
        { en: "<b>Confusing where a function is called with where it gets its scope</b> — a function uses the scope where it was <b>created</b>, not where it is called. That is lexical scoping.", np: "<b>Function कहाँ call भयो र यसले scope कहाँबाट पायो भन्ने भ्रममा पर्नु</b> — function ले आफू <b>बनेको</b> ठाउँको scope प्रयोग गर्छ, call भएको ठाउँको होइन। यही lexical scoping हो।", jp: "<b>関数が呼ばれた場所とスコープを得た場所を混同する</b> — 関数は<b>作られた</b>場所のスコープを使い、呼ばれた場所のものは使わない。それがレキシカルスコープ。" },
      ],
      quiz: [
        {
          question: { en: "What does scope determine?", np: "Scope ले के तय गर्छ?", jp: "スコープは何を決めるか?" },
          options: [
            { en: "How fast code runs", np: "Code कति छिटो चल्छ", jp: "コードの実行速度" },
            { en: "Where a variable can be accessed", np: "Variable कहाँ पहुँच गर्न सकिन्छ", jp: "変数にアクセスできる範囲" },
            { en: "The variable's data type", np: "Variable को data type", jp: "変数のデータ型" },
          ],
          correctIndex: 1,
          explanation: { en: "Scope is about visibility: which parts of the code can see a given variable.", np: "Scope दृश्यताको कुरा हो: code का कुन भागले दिइएको variable देख्न सक्छ।", jp: "スコープは可視性の話。コードのどの部分がその変数を見られるか。" },
        },
        {
          question: { en: "Which variables are block-scoped?", np: "कुन variable block-scoped हुन्?", jp: "ブロックスコープなのはどれか?" },
          options: [
            { en: "`var` only", np: "`var` मात्र", jp: "`var` だけ" },
            { en: "`let` and `const`", np: "`let` र `const`", jp: "`let` と `const`" },
            { en: "All variables", np: "सबै variable", jp: "すべての変数" },
          ],
          correctIndex: 1,
          explanation: { en: "`let` and `const` stay inside their `{ }`; `var` does not.", np: "`let` र `const` आफ्नो `{ }` भित्रै रहन्छन्; `var` रहँदैन।", jp: "`let` と `const` は `{ }` の中に留まるが、`var` は留まらない。" },
        },
        {
          question: { en: "Which scope does `var` use?", np: "`var` ले कुन scope प्रयोग गर्छ?", jp: "`var` はどのスコープを使うか?" },
          options: [
            { en: "Block scope", np: "Block scope", jp: "ブロックスコープ" },
            { en: "Function scope", np: "Function scope", jp: "関数スコープ" },
            { en: "Only global scope", np: "Global scope मात्र", jp: "グローバルスコープだけ" },
          ],
          correctIndex: 1,
          explanation: { en: "A `var` declared inside an `if` block belongs to the nearest enclosing function.", np: "`if` block भित्र declare गरिएको `var` नजिकको enclosing function को हो।", jp: "`if` ブロックの中で宣言した `var` は、最も近い外側の関数に属する。" },
        },
        {
          question: { en: "What does lexical scoping mean?", np: "Lexical scoping को अर्थ के हो?", jp: "レキシカルスコープとはどういう意味か?" },
          options: [
            { en: "Scope is decided by where code is written", np: "Code कहाँ लेखिएको छ त्यसले scope तय गर्छ", jp: "スコープはコードが書かれた場所で決まる" },
            { en: "Scope changes every time a function is called", np: "Function call हुँदा हरेक पटक scope बदलिन्छ", jp: "関数が呼ばれるたびにスコープが変わる" },
            { en: "All variables are global", np: "सबै variable global हुन्छन्", jp: "すべての変数がグローバルになる" },
          ],
          correctIndex: 0,
          explanation: { en: "The function keeps the scope of the place it was written, no matter where it is later called.", np: "Function पछि जहाँ call भए पनि आफू लेखिएको ठाउँको scope राख्छ।", jp: "関数は後でどこで呼ばれても、書かれた場所のスコープを保つ。" },
        },
      ],
    },
    {
      id: "hoisting-detail",
      title: { en: "Hoisting in Detail", np: "Hoisting विस्तारमा", jp: "ホイスティング詳解" },
      durationMinutes: 9,
      explanation: {
        en: "Every declaration type hoists differently — some get a placeholder value immediately, others get registered but locked. Knowing which is which turns a confusing `ReferenceError` or unexpected `undefined` into something you can predict before you even run the code.\n\n• `var` — hoisted, pre-filled with `undefined`\n• `let`/`const` — hoisted, but locked in the Temporal Dead Zone until their declaration line\n• Function declarations — hoisted completely, body included\n• Function expressions / arrow functions — not specially hoisted; they follow the rules of whatever keyword (`var`/`let`/`const`) holds them",
        np: "हरेक declaration type फरक तरिकाले hoist हुन्छ — कोहीलाई placeholder value तुरुन्तै मिल्छ, कोही registered तर locked रहन्छ।",
        jp: "宣言の種類ごとにホイストの仕方が異なる。どれがどうなるか知っていれば、ReferenceErrorや予期しないundefinedを事前に予測できる。",
      },
      diagram: `Declaration                Hoisted?    Initial value        TDZ?
──────────────────────────────────────────────────────────────
var                         Yes         undefined             No
let / const                 Yes         uninitialized         Yes
function declaration        Yes (full)  function body         No
function expr / arrow       as variable undefined or TDZ      depends on keyword`,
      codeExample: {
        title: { en: "What gets hoisted — and to what value", np: "के hoist हुन्छ र कुन value मा", jp: "何がどの値でホイストされるか" },
        code: `// ── var is hoisted and initialised to undefined ───────────────────
console.log(x);  // undefined — NOT a ReferenceError
var x = 5;
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
greet("Alice");     // ✅ works after assignment`,
      },
      keyTakeaways: [
        { en: "`var` is hoisted and pre-filled with `undefined` — reading it early gives `undefined`, not an error.", np: "var hoist हुन्छ र undefined ले pre-fill हुन्छ — early access मा error आउँदैन।", jp: "varはホイストされundefinedで初期化されるため、早期アクセスはエラーではなくundefinedになる。" },
        { en: "Function declarations are the only construct hoisted with their full body — you can call them before the line they're written on.", np: "Function declaration एक मात्र construct हो जो पूरै body सहित hoist हुन्छ।", jp: "関数宣言は本体ごとホイストされる唯一の構文で、宣言前に呼び出せる。" },
        { en: "Function expressions and arrow functions are not specially hoisted — they're just variable assignments, so they follow whatever keyword holds them.", np: "Function expression/arrow function विशेष रूपमा hoist हुँदैन — यो त variable assignment मात्र हो।", jp: "関数式・アロー関数は特別にホイストされない。単なる変数代入であり、保持するキーワードに従う。" },
      ],
      commonMistakes: [
        { en: "Assuming `let`/`const` are not hoisted at all — they are hoisted, they're just unusable (TDZ) until declared.", np: "let/const hoist नै हुँदैन भन्ने ठान्नु — वास्तवमा hoist हुन्छन्, TDZ मा locked मात्र हुन्छन्।", jp: "let/constが全くホイストされないと思うこと。実際はホイストされるがTDZでロックされる。" },
        { en: "Relying on hoisting for `const fn = () => {}` — arrow functions and function expressions are NOT hoisted the way declarations are.", np: "`const fn = () => {}` जस्ता function expression लाई function declaration जस्तै hoist हुन्छ भन्ने ठान्नु।", jp: "`const fn = () => {}`のような関数式が関数宣言と同様にホイストされると思うこと。" },
        { en: "Writing code order that depends on hoisting working out \"by luck\" instead of declaring variables/functions before first use.", np: "Variable/function लाई पहिलो प्रयोग अघि declare नगरी hoisting मा भर पर्नु।", jp: "変数・関数を最初の使用前に宣言せず、ホイスティングが「たまたま」うまくいくことに依存すること。" },
      ],
      quiz: [
        {
          question: { en: "What does `console.log(x); var x = 5;` print?", np: "`console.log(x); var x = 5;` ले के print गर्छ?", jp: "`console.log(x); var x = 5;` は何を出力する？" },
          options: [{ en: "ReferenceError", np: "ReferenceError", jp: "ReferenceError" }, { en: "undefined", np: "undefined", jp: "undefined" }, { en: "5", np: "5", jp: "5" }],
          correctIndex: 1,
          explanation: { en: "var is hoisted and pre-filled with undefined before the code runs.", np: "var hoist भई code चल्नु अघि undefined ले pre-fill हुन्छ।", jp: "varはコード実行前にホイストされundefinedで初期化される。" },
        },
        {
          question: { en: "Which construct is hoisted with its full body, allowing you to call it before its declaration line?", np: "कुन construct पूरै body सहित hoist हुन्छ?", jp: "本体ごとホイストされ、宣言前に呼び出せる構文は？" },
          options: [{ en: "Function declaration", np: "Function declaration", jp: "関数宣言" }, { en: "Arrow function assigned to const", np: "const मा assign गरिएको arrow function", jp: "constに代入されたアロー関数" }],
          correctIndex: 0,
          explanation: { en: "Only function declarations get full hoisting with their body.", np: "Function declaration मात्र पूरै body सहित hoist हुन्छ।", jp: "関数宣言のみが本体ごと完全にホイストされる。" },
        },
        {
          question: { en: "Are arrow functions assigned to a `const` hoisted like function declarations?", np: "`const` मा assign गरिएको arrow function function declaration जस्तै hoist हुन्छ?", jp: "constに代入されたアロー関数は関数宣言のようにホイストされる？" },
          options: [{ en: "Yes, fully hoisted with their body", np: "हो, body सहित पूरै hoist हुन्छ", jp: "はい、本体ごと完全にホイストされる" }, { en: "No — they follow const's TDZ rules", np: "होइन — const को TDZ rule पालना गर्छ", jp: "いいえ — constのTDZルールに従う" }],
          correctIndex: 1,
          explanation: { en: "An arrow function stored in a const is just a variable assignment — it follows const's TDZ behaviour, not function-declaration hoisting.", np: "const मा arrow function assignment मात्र हो — TDZ rule पालना गर्छ, function declaration hoisting होइन।", jp: "constに格納されたアロー関数は単なる変数代入で、constのTDZルールに従う。" },
        },
      ],
    },
    {
      id: "temporal-dead-zone",
      title: { en: "The Temporal Dead Zone (TDZ)", np: "Temporal Dead Zone (TDZ)", jp: "一時的デッドゾーン (TDZ)" },
      durationMinutes: 9,
      explanation: {
        en: "The <b>Temporal Dead Zone</b> is the gap between when a `let` or `const` variable is hoisted (the start of its enclosing block) and when it is actually initialised (the line where it is declared). Touching it during that gap throws a `ReferenceError`.\n\nThink of it like a parcel that has arrived at the depot but hasn't been signed for yet — the system knows the parcel exists (it's registered), but it refuses to hand it over until the paperwork (the declaration line) is complete. `var`'s silent `undefined` is the opposite: it hands you an empty box and lets you assume it's fine, which is exactly the kind of bug the TDZ was designed to surface loudly instead.\n\n<b>The TDZ is a safety net, not a punishment.</b> It exists specifically to catch the moment you reference a variable before you meant to assign it.",
        np: "Temporal Dead Zone एउटा `let` वा `const` variable hoist हुनेदेखि initialized हुनेसम्मको period हो। यस बीचमा access गर्दा ReferenceError आउँछ — यो सुरक्षा जाल हो, सजाय होइन।",
        jp: "TDZとはlet/constがホイストされた時点から実際に初期化されるまでの期間。この間にアクセスするとReferenceError。これは罰ではなく安全網。",
      },
      diagram: `let x = "global";

function test() {
  console.log(x);   // ❌ ReferenceError — NOT "global"
  ▲
  │ x is in the TDZ here — hoisted but not yet initialised
  let x = "local";  // ← TDZ ends here, x becomes "local"
}

The inner "let x" shadows the outer x for the WHOLE function,
even before its own declaration line runs.`,
      codeExample: {
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

// ── The fix: always declare before use ────────────────────────────
function testFixed() {
  let x = "local";  // declare first
  console.log(x);   // ✅ "local"
}`,
      },
      keyTakeaways: [
        { en: "The TDZ runs from the start of a `let`/`const` variable's block until its declaration line — accessing it in that window throws a ReferenceError.", np: "TDZ block को सुरुदेखि declaration line सम्म रहन्छ — यस बीचमा access गर्दा ReferenceError आउँछ।", jp: "TDZはブロックの開始から宣言行までの間で、この間にアクセスするとReferenceErrorになる。" },
        { en: "A variable shadows an outer variable of the same name for the entire enclosing block, even before its own declaration line runs.", np: "Same नाम भएको variable ले outer variable लाई पूरै block भर shadow गर्छ, आफ्नो declaration अघि नै।", jp: "同名の変数は、自身の宣言行が実行される前でも、囲むブロック全体で外側の変数をシャドーイングする。" },
        { en: "The TDZ exists to catch accidental early use of a variable — a bug that `var`'s silent `undefined` would otherwise hide.", np: "TDZ ले variable को accidental early use पत्ता लगाउन बनाइएको हो — var को silent undefined ले लुकाउने bug।", jp: "TDZは変数の意図しない早期使用を検出するために存在する。varの静かなundefinedが隠すバグ。" },
      ],
      commonMistakes: [
        { en: "Expecting `console.log(x)` inside a function to read an outer `x` when the function also declares its own `x` later — the inner one shadows immediately.", np: "Function भित्र पछि आफ्नै `x` declare गरिए पनि `console.log(x)` ले outer x पढ्छ भन्ने ठान्नु — inner ले तुरुन्तै shadow गर्छ।", jp: "関数が後で自身の`x`を宣言していても、`console.log(x)`が外側のxを読むと期待すること（実際は即座にシャドーされる）。" },
        { en: "Treating a TDZ ReferenceError the same as an \"undeclared variable\" error — they're different: the TDZ variable already exists, just locked.", np: "TDZ ReferenceError लाई 'undeclared variable' error जस्तै ठान्नु — फरक हो: TDZ variable अस्तित्वमा छ, locked मात्र।", jp: "TDZのReferenceErrorを「未宣言変数」エラーと同じと考えること。実際は異なり、TDZの変数は既に存在し、ロックされているだけ。" },
        { en: "Not realizing `typeof` also throws inside the TDZ for that variable, unlike a truly undeclared variable where `typeof` safely returns \"undefined\".", np: "TDZ भित्र `typeof` ले पनि error दिन्छ भन्ने कुरा नबुझ्नु — truly undeclared variable मा `typeof` सुरक्षित रूपमा 'undefined' दिन्छ।", jp: "TDZ内では`typeof`もエラーになることに気づかないこと。本当に未宣言の変数では`typeof`は安全に'undefined'を返す。" },
      ],
      quiz: [
        {
          question: { en: "What happens if you access a `let` variable before its declaration line, in the same block?", np: "Same block मा declaration अघि `let` variable access गर्दा के हुन्छ?", jp: "同じブロック内で宣言前に`let`変数にアクセスすると？" },
          options: [{ en: "Returns undefined", np: "undefined फर्काउँछ", jp: "undefinedを返す" }, { en: "Throws a ReferenceError (TDZ)", np: "ReferenceError (TDZ) आउँछ", jp: "ReferenceError（TDZ）が発生する" }],
          correctIndex: 1,
          explanation: { en: "let is hoisted but stays in the Temporal Dead Zone until its declaration line runs.", np: "let hoist हुन्छ तर declaration नआउँदासम्म TDZ मा रहन्छ।", jp: "letはホイストされるが宣言行までTDZに留まる。" },
        },
        {
          question: { en: "Is a TDZ ReferenceError the same thing as an \"undeclared variable\" error?", np: "TDZ ReferenceError र 'undeclared variable' error उस्तै हो?", jp: "TDZのReferenceErrorは「未宣言変数」エラーと同じ？" },
          options: [{ en: "Yes, identical", np: "हो, उस्तै", jp: "はい、同一" }, { en: "No — the TDZ variable already exists, just locked until its declaration", np: "होइन — TDZ variable अस्तित्वमा छ, declaration सम्म locked मात्र", jp: "いいえ — TDZの変数は既に存在し、宣言まで単にロックされている" }],
          correctIndex: 1,
          explanation: { en: "The TDZ variable has already been registered by the engine — it exists, but the engine refuses access until the declaration line runs.", np: "TDZ variable engine ले registered भइसकेको हुन्छ — अस्तित्वमा छ, तर declaration नआउँदासम्म access दिइँदैन।", jp: "TDZの変数はエンジンによって既に登録されているが、宣言行が実行されるまでアクセスが拒否される。" },
        },
        {
          question: { en: "In the TDZ example, why does `console.log(x)` throw instead of printing \"global\"?", np: "TDZ example मा `console.log(x)` ले किन 'global' print नगरी error दिन्छ?", jp: "TDZの例で`console.log(x)`が'global'を出力せずエラーになる理由は？" },
          options: [{ en: "Because the inner `let x` shadows the outer x for the whole function, even before its declaration line", np: "किनकि inner `let x` ले outer x लाई पूरै function भर shadow गर्छ, declaration अघि नै", jp: "内側の`let x`が宣言行前でも関数全体で外側のxをシャドーイングするため" }, { en: "Because the outer x was deleted", np: "किनकि outer x delete भयो", jp: "外側のxが削除されたため" }],
          correctIndex: 0,
          explanation: { en: "Shadowing happens for the entire block/function scope, not just after the shadowing declaration's line.", np: "Shadowing पूरै block/function scope भर हुन्छ, declaration line पछि मात्र होइन।", jp: "シャドーイングはブロック/関数スコープ全体で発生し、宣言行の後だけではない。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "A `var` declared inside an `if` block — where is it accessible from?", np: "`if` block भित्र declare गरिएको `var` कहाँबाट access गर्न मिल्छ?", jp: "`if`ブロック内で宣言された`var`はどこからアクセスできる？" },
      options: [{ en: "Only inside the if block", np: "if block भित्र मात्र", jp: "ifブロック内のみ" }, { en: "The entire enclosing function", np: "सम्पूर्ण enclosing function", jp: "囲む関数全体" }],
      correctIndex: 1,
      explanation: { en: "var is function-scoped and ignores block boundaries.", np: "var function-scoped हो र block boundary ignore गर्छ।", jp: "varは関数スコープでブロック境界を無視する。" },
    },
    {
      question: { en: "What determines a variable's scope under lexical scoping?", np: "Lexical scoping मा variable को scope केले तय गर्छ?", jp: "レキシカルスコープで変数のスコープを決めるものは？" },
      options: [{ en: "Where it's called from", np: "कहाँबाट call भयो", jp: "呼び出し元" }, { en: "Where it's written in the source", np: "Source मा कहाँ लेखियो", jp: "ソースの記述位置" }],
      correctIndex: 1,
      explanation: { en: "Lexical scope is fixed by source location, not call location.", np: "Lexical scope source location ले तय हुन्छ, call location होइन।", jp: "レキシカルスコープはソースの位置で決まり、呼び出し位置では決まらない。" },
    },
    {
      question: { en: "Can a closure still access an outer function's variables after that function has returned?", np: "Outer function return भएपछि पनि closure ले variables access गर्न सक्छ?", jp: "外側の関数がreturnした後もクロージャは変数にアクセスできる？" },
      options: [{ en: "No", np: "होइन", jp: "いいえ" }, { en: "Yes", np: "हो", jp: "はい" }],
      correctIndex: 1,
      explanation: { en: "This is exactly what a closure is — a live link to outer variables that outlives the outer function call.", np: "यही closure हो — outer function call भन्दा बढी टिक्ने live link।", jp: "これがクロージャの本質 — 外側の関数呼び出しより長生きするライブなリンク。" },
    },
    {
      question: { en: "What does `console.log(x); var x = 5;` print?", np: "`console.log(x); var x = 5;` ले के print गर्छ?", jp: "`console.log(x); var x = 5;` は何を出力する？" },
      options: [{ en: "undefined", np: "undefined", jp: "undefined" }, { en: "ReferenceError", np: "ReferenceError", jp: "ReferenceError" }],
      correctIndex: 0,
      explanation: { en: "var is hoisted and pre-filled with undefined.", np: "var hoist भई undefined ले pre-fill हुन्छ।", jp: "varはホイストされundefinedで初期化される。" },
    },
    {
      question: { en: "Which construct is hoisted with its full body?", np: "कुन construct पूरै body सहित hoist हुन्छ?", jp: "本体ごとホイストされる構文は？" },
      options: [{ en: "Function declaration", np: "Function declaration", jp: "関数宣言" }, { en: "Arrow function", np: "Arrow function", jp: "アロー関数" }],
      correctIndex: 0,
      explanation: { en: "Only function declarations get full hoisting with their body.", np: "Function declaration मात्र पूरै body सहित hoist हुन्छ।", jp: "関数宣言のみが本体ごと完全にホイストされる。" },
    },
    {
      question: { en: "Are arrow functions assigned to const hoisted like function declarations?", np: "Const मा arrow function function declaration जस्तै hoist हुन्छ?", jp: "constのアロー関数は関数宣言のようにホイストされる？" },
      options: [{ en: "Yes", np: "हो", jp: "はい" }, { en: "No — they follow const's TDZ rules", np: "होइन — const को TDZ rule पालना गर्छ", jp: "いいえ — constのTDZルールに従う" }],
      correctIndex: 1,
      explanation: { en: "An arrow function in a const is just a variable assignment following TDZ rules.", np: "Const मा arrow function variable assignment मात्र हो, TDZ rule पालना गर्छ।", jp: "constのアロー関数は単なる変数代入でTDZルールに従う。" },
    },
    {
      question: { en: "What happens when you access a `let` variable before its declaration line in the same block?", np: "Same block मा declaration अघि `let` access गर्दा के हुन्छ?", jp: "同じブロックで宣言前に`let`にアクセスすると？" },
      options: [{ en: "undefined", np: "undefined", jp: "undefined" }, { en: "ReferenceError (TDZ)", np: "ReferenceError (TDZ)", jp: "ReferenceError（TDZ）" }],
      correctIndex: 1,
      explanation: { en: "let is hoisted but locked in the TDZ until its declaration runs.", np: "let hoist हुन्छ तर declaration नआउँदासम्म TDZ मा locked रहन्छ।", jp: "letはホイストされるが宣言までTDZにロックされる。" },
    },
    {
      question: { en: "Is a TDZ ReferenceError the same as an \"undeclared variable\" error?", np: "TDZ ReferenceError 'undeclared variable' error उस्तै हो?", jp: "TDZのReferenceErrorは「未宣言変数」エラーと同じ？" },
      options: [{ en: "Yes", np: "हो", jp: "はい" }, { en: "No — the TDZ variable already exists, just locked", np: "होइन — TDZ variable अस्तित्वमा छ, locked मात्र", jp: "いいえ — TDZの変数は既に存在し、ロックされているだけ" }],
      correctIndex: 1,
      explanation: { en: "The engine already registered the TDZ variable; it just refuses access until the declaration line.", np: "Engine ले TDZ variable registered गरिसकेको हुन्छ; declaration नआउँदासम्म access दिँदैन मात्र।", jp: "エンジンはTDZの変数を既に登録しているが、宣言行までアクセスを拒否するだけ。" },
    },
    {
      question: { en: "Why does `var` leak out of `if`/`for` blocks?", np: "`var` किन `if`/`for` blocks बाट leak हुन्छ?", jp: "`var`が`if`/`for`ブロックから漏れる理由は？" },
      options: [{ en: "Because var is function-scoped, not block-scoped", np: "किनकि var function-scoped हो, block-scoped होइन", jp: "varはブロックスコープでなく関数スコープだから" }, { en: "Because of a browser bug", np: "Browser bug को कारणले", jp: "ブラウザのバグのため" }],
      correctIndex: 0,
      explanation: { en: "var predates block scope (added later with let/const in ES6) and remains function-scoped by design.", np: "Block scope (let/const) पछि ES6 मा थपियो — var डिजाइन अनुसार function-scoped नै रहन्छ।", jp: "ブロックスコープ（let/const）は後でES6で追加された。varは設計上関数スコープのまま。" },
    },
    {
      question: { en: "In the TDZ example, does the inner `let x` shadow the outer `x` even before its own declaration line runs?", np: "TDZ example मा inner `let x` ले आफ्नो declaration अघि नै outer x लाई shadow गर्छ?", jp: "TDZの例で内側の`let x`は自身の宣言行前でも外側のxをシャドーイングする？" },
      options: [{ en: "Yes — shadowing applies to the whole enclosing block", np: "हो — shadowing पूरै enclosing block मा लागू हुन्छ", jp: "はい — シャドーイングは囲むブロック全体に適用される" }, { en: "No — shadowing only starts after the declaration line", np: "होइन — shadowing declaration line पछि मात्र सुरु हुन्छ", jp: "いいえ — シャドーイングは宣言行の後にのみ始まる" }],
      correctIndex: 0,
      explanation: { en: "Shadowing is determined at the block level for the whole scope, which is exactly why the TDZ error happens.", np: "Shadowing पूरै scope को block level मा तय हुन्छ — यही TDZ error को कारण हो।", jp: "シャドーイングはスコープ全体のブロックレベルで決まる。これがTDZエラーが起きる理由。" },
    },
  ],
};
