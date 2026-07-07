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
        en: "Scope is about visibility — which variables a piece of code is allowed to see. JavaScript nests three kinds of scope inside each other like Russian dolls: whatever is visible at an outer layer stays visible at every layer inside it, but never the other way round.\n\n• <b>Global scope</b> — the outermost doll; visible from anywhere in the file\n• <b>Function scope</b> — a doll inside the global one; visible only inside that function\n• <b>Block scope</b> — the smallest doll, created by any `{ }` (an `if`, `for`, or bare block); visible only inside that block\n  ↳ `var` ignores this smallest doll entirely — it always escapes to the nearest function (or global) layer\n\nJavaScript also uses <b>lexical scoping</b>: a variable's scope is decided by where it is written in the source, not by how or where the function is later called. An inner function keeps access to its outer function's variables even after the outer function has already finished running — this \"remembers where it was born\" rule is the entire foundation of closures (Day 4).",
        np: "Scope भनेको visibility हो। JS मा तीन scope Russian doll जस्तै nested हुन्छन्। JS ले lexical scoping प्रयोग गर्छ — यही Closure को आधार हो।",
        jp: "スコープは可視性のこと。JSには入れ子の3種類のスコープがある。JSはレキシカルスコープを使い、これがクロージャの基礎となる。",
      },
      diagram: `┌─ Global scope ─────────────────────────────────────┐
│  const appName = "MyApp";                           │
│  ┌─ Function scope (outer()) ─────────────────────┐ │
│  │  const secret = "only mine";                    │ │
│  │  ┌─ Block scope ( if (true) { ... } ) ────────┐  │ │
│  │  │  let blockOnly = "block";                  │  │ │
│  │  │  var notBlock  = "leaks out!";  ← escapes ─┼──┼─┘
│  │  └─────────────────────────────────────────────┘ │
│  └───────────────────────────────────────────────────┘
└───────────────────────────────────────────────────────┘
Inner layers can always read outer variables — never the other way round.`,
      codeExample: {
        title: { en: "Global, function, and block scope", np: "Global, function, block scope", jp: "グローバル・関数・ブロックスコープ" },
        code: `const appName = "MyApp";  // global — accessible everywhere

function outer() {
  const secret = "only mine";   // function-scoped
  console.log(secret);           // ✅ works
}
// console.log(secret);   // ❌ ReferenceError — not accessible outside

if (true) {
  let blockOnly = "block";       // block-scoped
  var notBlock = "leaks out!";   // var ignores blocks
}
// console.log(blockOnly);   // ❌ ReferenceError
console.log(notBlock);         // ✅ "leaks out!" — var is function-scoped

// ── Lexical scope — inner functions access outer variables ──────────
function makeCounter() {
  let count = 0;
  return function () {
    count++;               // inner function reads AND writes outer's 'count'
    return count;
  };
}
const counter = makeCounter();
counter();  // 1
counter();  // 2`,
      },
      keyTakeaways: [
        { en: "Scope nests like Russian dolls: global → function → block. Inner scopes can always read outer variables, never the reverse.", np: "Scope Russian doll जस्तै nest हुन्छ: global → function → block। Inner ले outer पढ्न सक्छ, उल्टो हुँदैन।", jp: "スコープはロシアの入れ子人形のように入れ子になる: グローバル→関数→ブロック。内側は外側を読めるが逆はできない。" },
        { en: "`var` ignores block boundaries entirely and is scoped to the nearest function (or global) layer instead.", np: "`var` ले block boundary लाई पूरै ignore गरी nearest function (वा global) मा scope हुन्छ।", jp: "`var`はブロック境界を完全に無視し、最も近い関数（またはグローバル）にスコープされる。" },
        { en: "Lexical scoping means a variable's scope is fixed by where it's written in the code, not by where the function is called from.", np: "Lexical scoping भनेको variable को scope code मा कहाँ लेखिएको छ त्यसले तय गर्छ, call कहाँबाट भयो त्यसले होइन।", jp: "レキシカルスコープとは、変数のスコープがコードの記述位置で決まり、呼び出し元では決まらないこと。" },
      ],
      commonMistakes: [
        { en: "Declaring a variable with `var` inside an `if` block and expecting it to be inaccessible outside — it leaks to the enclosing function.", np: "`if` block भित्र `var` declare गरेर बाहिर access नहुने ठान्नु — यो leak हुन्छ।", jp: "`if`ブロック内で`var`を宣言し、外からアクセスできないと期待すること（実際は漏れる）。" },
        { en: "Assuming an inner function loses access to outer variables once the outer function has returned — closures keep them alive.", np: "Outer function return भएपछि inner function ले variables गुमाउँछ भन्ने ठान्नु — closure ले जिउँदो राख्छ।", jp: "外側の関数がreturnした後、内側の関数が変数へのアクセスを失うと思うこと（実際はクロージャで保持される）。" },
        { en: "Confusing lexical scope (where the code is written) with the call stack (where the function was invoked from) — JavaScript only cares about the former.", np: "Lexical scope (code कहाँ लेखियो) र call stack (कहाँबाट call भयो) मिलाउनु — JS ले पहिलो मात्र हेर्छ।", jp: "レキシカルスコープ（コードの記述位置）とコールスタック（呼び出し元）を混同すること。JSは前者のみを見る。" },
      ],
      quiz: [
        {
          question: { en: "A `var` declared inside an `if` block — where is it accessible from?", np: "`if` block भित्र declare गरिएको `var` कहाँबाट access गर्न मिल्छ?", jp: "`if`ブロック内で宣言された`var`はどこからアクセスできる？" },
          options: [{ en: "Only inside the if block", np: "if block भित्र मात्र", jp: "ifブロック内のみ" }, { en: "The entire enclosing function (or global scope)", np: "सम्पूर्ण enclosing function (वा global scope)", jp: "囲む関数全体（またはグローバルスコープ）" }],
          correctIndex: 1,
          explanation: { en: "var is function-scoped, so it ignores the if block's boundaries entirely.", np: "var function-scoped हो, त्यसैले if block को boundary ignore गर्छ।", jp: "varは関数スコープなので、ifブロックの境界を無視する。" },
        },
        {
          question: { en: "What determines a variable's scope under lexical scoping?", np: "Lexical scoping मा variable को scope केले तय गर्छ?", jp: "レキシカルスコープで変数のスコープを決めるものは？" },
          options: [{ en: "Where the function is called from", np: "Function कहाँबाट call भयो", jp: "関数がどこから呼ばれたか" }, { en: "Where the variable is written in the source code", np: "Variable code मा कहाँ लेखिएको छ", jp: "変数がソースコードのどこに書かれているか" }],
          correctIndex: 1,
          explanation: { en: "Lexical scope is fixed at write-time based on source location, not at call-time.", np: "Lexical scope write-time मा source location अनुसार तय हुन्छ, call-time मा होइन।", jp: "レキシカルスコープは記述時にソースの位置で決まり、呼び出し時には決まらない。" },
        },
        {
          question: { en: "Can an inner function still access its outer function's variables after the outer function has returned?", np: "Outer function return भएपछि पनि inner function ले outer को variable access गर्न सक्छ?", jp: "外側の関数がreturnした後も内側の関数は外側の変数にアクセスできる？" },
          options: [{ en: "No — those variables are gone", np: "होइन — variables हराइसक्छ", jp: "いいえ — その変数は消える" }, { en: "Yes — this is the basis of closures", np: "हो — यही closure को आधार हो", jp: "はい — これがクロージャの基礎" }],
          correctIndex: 1,
          explanation: { en: "Lexical scoping keeps the outer variables alive as long as an inner function still references them — this is exactly what a closure is.", np: "Inner function ले reference राखेसम्म outer variables जिउँदो रहन्छ — यही closure हो।", jp: "内側の関数が参照し続ける限り外側の変数は生き続ける。これがクロージャそのもの。" },
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
