import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_1_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "JavaScript has three ways to declare a variable and eight primitive types.\n\nThink of a variable declaration as a labelled storage box — `var`, `let`, and `const` are three different kinds of boxes with different rules about who can open them, when, and whether the label can be swapped later. Picking the right box up front prevents a whole class of bugs that are notoriously hard to debug.",
      np: "JavaScript मा variable declare गर्ने तीन तरिका (var, let, const) र आठ primitive types छन् — सही बक्स छान्नु जरुरी छ।",
      jp: "変数宣言の3つの方法（var・let・const）と8つのプリミティブ型。正しい「箱」を選ぶことでバグを防ぎます。",
    },
    {
      en: "In Day 1 we cover:\n• <b>var, let, const</b> — scope, hoisting, and re-assignment rules\n• The <b>eight primitive types</b> JavaScript actually has\n• <b>Hoisting</b> — what JavaScript quietly does before your code runs\n• <b>Type coercion</b> — why `'5' + 3 === '53'` but `'5' - 3 === 2`",
      np: "Day 1 मा: var/let/const, आठ primitive types, hoisting, र type coercion।",
      jp: "Day 1では: var・let・const、8つのプリミティブ型、ホイスティング、型変換を学びます。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "hdI2bqOjy3c", title: "JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour" },
      ],
    },
    {
      title: { en: "var, let, and const — what is the difference?", np: "var, let, const फरक के छ?", jp: "var・let・const の違い" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "All three keywords create a variable, but they disagree on three things: <b>where</b> the variable is visible (scope), <b>whether</b> you can declare it again, and <b>whether</b> you can point it at a new value later.\n\n• <b>var</b> — function-scoped, leaks out of `if`/`for` blocks, can be re-declared\n  ↳ Like writing a name on a whiteboard for the whole classroom to see, even if you only meant it for one desk\n• <b>let</b> — block-scoped, cannot be re-declared, can be reassigned\n  ↳ Like a sticky note on one desk — only visible inside that `{ }` block\n• <b>const</b> — block-scoped, must be given a value immediately, the binding can never change\n  ↳ Like a nameplate glued to the desk — the label is permanent, but if the desk is a box of items, you can still swap what's inside",
            np: "var function-scoped र leaks हुन्छ, let/const block-scoped। const को binding change हुँदैन तर भित्रको object content change हुन सक्छ।",
            jp: "varは関数スコープでブロックの外にも漏れる。let/constはブロックスコープ。constは再代入不可だがオブジェクトの中身は変更可能。",
          },
        },
        {
          type: "code",
          title: { en: "Scope and re-assignment behaviour", np: "Scope र re-assignment", jp: "スコープと再代入" },
          code: `// var — function-scoped, hoisted, can be re-declared (avoid in modern code)
var name = "Alice";
var name = "Bob";  // no error — re-declaration is allowed with var

// let — block-scoped, not re-declarable, can be reassigned
let count = 0;
count = 1;          // ✅ reassign is fine
// let count = 2;   // ❌ SyntaxError: already declared

// const — block-scoped, must be initialised, cannot be reassigned
const PI = 3.14;
// PI = 3;          // ❌ TypeError: Assignment to constant variable

// const does NOT make objects immutable — the binding is fixed, not the value
const user = { name: "Alice" };
user.name = "Bob";  // ✅ this works — the object itself is mutable
// user = {};       // ❌ this fails — cannot reassign the binding

// Block scope in action
{
  let blockVar = "inside";
  var funcVar  = "also inside";
}
// console.log(blockVar); // ❌ ReferenceError — not accessible
console.log(funcVar);     // ✅ "also inside" — var leaks out of the block`,
        },
        {
          type: "table",
          caption: { en: "Quick comparison — use const by default, let when you need to reassign, never var.", np: "default मा const, reassign चाहिए let, var कहिल्यै नगर्नु।", jp: "デフォルトはconst、再代入が必要ならlet、varは使わない。" },
          headers: [
            { en: "Feature", np: "विशेषता", jp: "特徴" },
            { en: "var", np: "var", jp: "var" },
            { en: "let", np: "let", jp: "let" },
            { en: "const", np: "const", jp: "const" },
          ],
          rows: [
            [
              { en: "Scope", np: "Scope", jp: "スコープ" },
              { en: "Function", np: "Function", jp: "関数" },
              { en: "Block", np: "Block", jp: "ブロック" },
              { en: "Block", np: "Block", jp: "ブロック" },
            ],
            [
              { en: "Hoisted?", np: "Hoisted?", jp: "巻き上げ?" },
              { en: "Yes (undefined)", np: "हो (undefined)", jp: "はい (undefined)" },
              { en: "Yes (TDZ)", np: "हो (TDZ)", jp: "はい (TDZ)" },
              { en: "Yes (TDZ)", np: "हो (TDZ)", jp: "はい (TDZ)" },
            ],
            [
              { en: "Re-declarable?", np: "Re-declare?", jp: "再宣言?" },
              { en: "Yes", np: "हो", jp: "可" },
              { en: "No", np: "होइन", jp: "不可" },
              { en: "No", np: "होइन", jp: "不可" },
            ],
            [
              { en: "Re-assignable?", np: "Re-assign?", jp: "再代入?" },
              { en: "Yes", np: "हो", jp: "可" },
              { en: "Yes", np: "हो", jp: "可" },
              { en: "No", np: "होइन", jp: "不可" },
            ],
          ],
        },
      ],
    },
    {
      title: { en: "The eight primitive types", np: "आठ primitive types", jp: "8つのプリミティブ型" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every value in JavaScript is either a <b>primitive</b> (a simple, single value stored directly) or an <b>object</b> (a more complex structure stored by reference). There are exactly eight primitive types — memorising the list removes a lot of guesswork when debugging `typeof` output.",
            np: "हरेक value primitive (सिधा value) वा object (reference द्वारा) हो। ठ्याक्कै आठ primitive types छन्।",
            jp: "すべての値はプリミティブ（単純な値）かオブジェクト（参照）です。プリミティブはちょうど8種類あります。",
          },
        },
        {
          type: "code",
          title: { en: "All primitive types with examples", np: "सबै primitive types उदाहरण सहित", jp: "全プリミティブ型の例" },
          code: `// 1. String — text in single, double, or backtick quotes
const greeting = "Hello";
const template = \`Name: \${greeting}\`;   // template literal

// 2. Number — all numbers (integers and floats) are the same type
const age   = 30;
const price = 9.99;
const inf   = Infinity;
const nan   = NaN;       // "Not a Number" — but typeof NaN === "number" (quirk!)

// 3. Boolean
const isActive = true;

// 4. null — intentional absence of a value; assigned explicitly
const empty = null;

// 5. undefined — variable declared but not yet assigned a value
let notSet;
console.log(notSet);   // undefined

// 6. Symbol — unique, immutable identifier (rarely needed day-to-day)
const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2);  // false — every Symbol is unique

// 7. BigInt — integers larger than Number.MAX_SAFE_INTEGER (2^53 - 1)
const huge = 9007199254740993n;  // note the 'n' suffix

// 8. Object — everything else: arrays, functions, dates, regexes, null
// (null is a primitive but typeof null === "object" — a historic bug in JS)

// typeof operator
console.log(typeof "hello");   // "string"
console.log(typeof 42);        // "number"
console.log(typeof true);      // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object" ← famous bug, not fixed for compat reasons
console.log(typeof Symbol());  // "symbol"
console.log(typeof 1n);        // "bigint"
console.log(typeof {});        // "object"
console.log(typeof []);        // "object" (not "array"!)
console.log(typeof function(){}); // "function"`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "<b>null vs undefined</b> — `undefined` means \"nobody has set this yet\" (JavaScript's default). `null` means \"a developer explicitly said this has no value.\" You choose `null`; JavaScript chooses `undefined`.",
              np: "undefined = कोहीले set नगरेको (JS को default)। null = developer ले आफैं \"value छैन\" भनेको।",
              jp: "undefinedは「誰も設定していない」というJSのデフォルト。nullは開発者が明示的に「値がない」と設定したもの。",
            },
            {
              en: "<b>Primitives are copied by value.</b> Assigning `const b = a` where `a` is a string or number copies the value — changing `b` never affects `a`. Objects (including arrays) are copied by reference, which is a separate topic worth remembering for later days.",
              np: "Primitives value द्वारा copy हुन्छन् — `b` बदल्दा `a` मा असर पर्दैन। Objects reference द्वारा copy हुन्छन्।",
              jp: "プリミティブは値でコピーされる。オブジェクトは参照でコピーされる（後日詳しく扱います）。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Hoisting — what JavaScript does before your code runs", np: "Hoisting — code चल्नु अघि के हुन्छ", jp: "ホイスティング — 実行前に起こること" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Before JavaScript runs a single line of your code, it scans the whole file in a <b>creation phase</b> and registers every variable and function name in memory. Only after that does the <b>execution phase</b> run your code top to bottom. This scan-then-run behaviour is called <b>hoisting</b>.\n\nThink of it like a restaurant reading the entire order ticket before cooking anything — the kitchen already knows every dish that's coming, even the ones at the bottom of the ticket, before the first pan touches the stove.",
            np: "JS ले पहिले सम्पूर्ण file scan गरेर हरेक variable/function नाम memory मा दर्ता गर्छ (creation phase), त्यसपछि मात्र code चलाउँछ (execution phase)। यसैलाई hoisting भनिन्छ।",
            jp: "JSはコードを実行する前にファイル全体をスキャンし、変数・関数名をメモリに登録します（作成フェーズ）。その後にコードを実行します（実行フェーズ）。これがホイスティングです。",
          },
        },
        {
          type: "code",
          title: { en: "Creation phase vs execution phase, side by side", np: "Creation phase vs execution phase", jp: "作成フェーズと実行フェーズ" },
          code: `// ── What you write ──────────────────────────────────────────────
console.log(a);        // undefined — not an error!
console.log(typeof b); // "undefined"
// console.log(c);      // ❌ ReferenceError — TDZ (see below)
sayHi();                // "Hi!" — works even though it's called before its declaration

var a = 1;
let b = 2;
const c = 3;

function sayHi() {
  console.log("Hi!");
}

// ── What actually happens, in order ─────────────────────────────
// CREATION PHASE (before any line runs):
//   var a       -> registered, initialised to undefined
//   let b       -> registered, but in the Temporal Dead Zone (TDZ)
//   const c     -> registered, but in the TDZ
//   function sayHi -> registered WITH its full body, ready to call
//
// EXECUTION PHASE (your code runs top to bottom):
//   console.log(a)        -> "undefined" (var was pre-filled)
//   console.log(typeof b) -> "undefined" (typeof is safe even inside TDZ... for a var,
//                              but for let/const inside their own TDZ it still throws)
//   sayHi()                -> runs fine, the whole function was hoisted
//   var a = 1              -> NOW a actually becomes 1
//   let b = 2               -> b leaves the TDZ and becomes 2`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "<b>Function declarations</b> (`function sayHi() {}`) are hoisted completely — name AND body — so you can call them before the line where they appear.",
              np: "Function declaration पूरै (नाम + body) hoist हुन्छ — declaration अघि call गर्न मिल्छ।",
              jp: "関数宣言は名前と本体まるごとホイストされるため、宣言前に呼び出せます。",
            },
            {
              en: "<b>var</b> is hoisted and pre-filled with `undefined`, so reading it early gives `undefined` instead of an error.",
              np: "var hoist हुन्छ र undefined ले pre-fill हुन्छ — early access मा error आउँदैन।",
              jp: "varはホイストされundefinedで初期化されるため、早期アクセスはエラーではなくundefinedになります。",
            },
            {
              en: "<b>let</b> and <b>const</b> are hoisted too, but stay in the <b>Temporal Dead Zone (TDZ)</b> — a period where the name exists but touching it throws a `ReferenceError`, right up until the declaration line runs.",
              np: "let/const पनि hoist हुन्छन् तर Temporal Dead Zone (TDZ) मा रहन्छन् — declaration अघि access गर्दा ReferenceError आउँछ।",
              jp: "let/constもホイストされますが、Temporal Dead Zone（TDZ）内にあり、宣言行に到達するまでアクセスするとReferenceErrorになります。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Type coercion — explicit vs implicit", np: "Type coercion — explicit र implicit", jp: "型変換 — 明示と暗黙" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Explicit coercion</b> is when you intentionally convert a value yourself using `Number()`, `String()`, `Boolean()`, or `parseInt()`. <b>Implicit coercion</b> is when JavaScript converts values automatically — usually when an operator sees mismatched types and has to pick a side.\n\nImplicit coercion is exactly why `'5' + 3 === '53'` (the `+` operator leans towards text) but `'5' - 3 === 2` (the `-` operator has no text version, so it forces both sides to numbers). Once you know the rule per operator, the \"surprising\" behaviour becomes predictable.",
            np: "Explicit coercion तपाईंले आफैं गर्नुहुन्छ (Number(), String(), Boolean())। Implicit coercion JavaScript ले operator प्रयोग गर्दा आफैं गर्छ — नियम बुझेपछि अनुमान गर्न सकिन्छ।",
            jp: "明示的変換はNumber()などで自分で行う。暗黙の変換は演算子使用時にJSが自動で行う。ルールを覚えると挙動が予測できる。",
          },
        },
        {
          type: "code",
          title: { en: "Coercion rules with + and ==", np: "Coercion rules: + र ==", jp: "型変換ルール: + と ==" },
          code: `// ── Explicit coercion ────────────────────────────────────────────
Number("42")     // 42
Number("")       // 0
Number("hello")  // NaN
Number(true)     // 1
Number(false)    // 0
Number(null)     // 0
Number(undefined) // NaN

String(42)       // "42"
String(null)     // "null"
String(undefined) // "undefined"

Boolean(0)       // false  ← falsy
Boolean("")      // false  ← falsy
Boolean(null)    // false  ← falsy
Boolean(undefined) // false ← falsy
Boolean(NaN)     // false  ← falsy
Boolean(false)   // false  ← falsy
// Everything else is truthy: "0", [], {}, -1, Infinity

// ── Implicit coercion with + ──────────────────────────────────────
"5" + 3          // "53"  — + prefers string concatenation when one operand is a string
"5" - 3          // 2     — - has no string version, so "5" is coerced to number
"5" * "3"        // 15
"5" - "x"        // NaN

// ── Loose equality == vs strict equality === ──────────────────────
"5" == 5         // true  — coerces before comparing (avoid!)
"5" === 5        // false — no coercion; different types → not equal
null == undefined // true  — only null == null and null == undefined
null === undefined // false
NaN == NaN       // false — NaN is not equal to itself (use Number.isNaN())

// ── Practical rule: always use === ───────────────────────────────
// The only safe uses of == are:
//   value == null   (checks both null and undefined at once)`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "<b>Falsy values</b> (exactly six): `false`, `0`, `''` (empty string), `null`, `undefined`, `NaN`. Everything else is truthy — including `'0'`, `[]`, and `{}`.",
              np: "Falsy values ठ्याक्कै छ छन्: false, 0, '', null, undefined, NaN। बाँकी सबै truthy।",
              jp: "Falsy値はちょうど6つ: false・0・''・null・undefined・NaN。それ以外はすべてtruthy（'0'・[]・{}も）。",
            },
            {
              en: "<b>Use `===` by default.</b> Only reach for `==` when you intentionally want to check for both `null` and `undefined` at once: `if (value == null)`.",
              np: "Default मा `===` प्रयोग गर्नुहोस्। null र undefined दुवै एकैपटक check गर्न मात्र `==` ठीक छ।",
              jp: "デフォルトでは`===`を使う。`==`はnullとundefinedを同時チェックする場合のみ許容。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What is the difference between var, let, and const?", np: "var, let, const मा के फरक छ?", jp: "var・let・constの違いは？" },
      answer: {
        en: "var is function-scoped and hoisted — it is initialised to undefined before the code runs, and it can be re-declared in the same scope. This makes bugs hard to spot. let and const are block-scoped and in the Temporal Dead Zone (TDZ) until their declaration is reached — accessing them before the declaration throws a ReferenceError. const adds one more restriction: once assigned, the binding cannot point to a different value. The practical rule: use const for everything, switch to let only when you need to reassign, and never use var in new code.",
        np: "var function-scope र hoisted — code चल्नु अघि undefined मा initialize। let र const block-scope र TDZ — declaration अगाडि access गर्दा ReferenceError। const reassign गर्न पाइँदैन। Rule: default const, reassign चाहिए let, var never।",
        jp: "varは関数スコープでundefinedに初期化。letとconstはブロックスコープでTDZあり。constは再代入不可。原則：const優先、再代入が必要ならlet、varは使わない。",
      },
    },
    {
      question: { en: "What gets hoisted and what does not?", np: "के hoist हुन्छ र के हुँदैन?", jp: "何がホイストされて何がされないか？" },
      answer: {
        en: "var declarations are hoisted and initialised to undefined — so you can reference a var variable before its declaration without an error, but the value will be undefined. Function declarations are fully hoisted — both the declaration and the body — so you can call a function before the line it is declared on. let and const declarations are hoisted but NOT initialised — they live in the Temporal Dead Zone (TDZ) until their declaration, and accessing them in the TDZ throws a ReferenceError. Function expressions (const fn = function() {}) and arrow functions are not hoisted because they are just variable assignments.",
        np: "var declaration hoist हुन्छ, undefined मा initialize। Function declaration पूरै hoist — body समेत। let/const hoist हुन्छ तर TDZ मा — access गर्दा ReferenceError। Function expression/arrow function hoist हुँदैन।",
        jp: "varは宣言のみホイスト(undefinedで初期化)。関数宣言は本体ごと完全にホイスト。let/constはホイストされるがTDZにあり、アクセスするとReferenceError。関数式・アロー関数はホイストされない。",
      },
    },
    {
      question: { en: "Why does typeof null return 'object'?", np: "typeof null ले 'object' किन फर्काउँछ?", jp: "typeof nullが'object'を返す理由は？" },
      answer: {
        en: "It is a bug from JavaScript's original implementation in 1995. Values were stored as a type tag plus a value. Objects had a type tag of 0, and null was represented as a null pointer (0x00 in memory), so its type tag was also 0 — making it look like an object. The fix was proposed but never merged because it would break too much existing code. To properly check for null, use `value === null`.",
        np: "1995 को original JS को bug। Objects को type tag 0 थियो र null को memory representation पनि 0 थियो — त्यसैले object जस्तो देखियो। Fix गर्न compatibility तोड्नु पर्ने भएर छोडियो। null check गर्न `value === null` प्रयोग गर्नुहोस्।",
        jp: "1995年の実装バグ。値は型タグ+実値で格納され、オブジェクトの型タグは0、nullのメモリ表現も0(nullポインタ)だったため。互換性のため修正されず。nullの確認は`value === null`を使う。",
      },
    },
    {
      question: { en: "Is the Temporal Dead Zone the same as \"undeclared\"?", np: "TDZ र \"undeclared\" उस्तै हो?", jp: "TDZは「未宣言」と同じ？" },
      answer: {
        en: "No. A truly undeclared variable throws a ReferenceError with the message \"x is not defined.\" A variable in the TDZ has already been hoisted and registered by the engine — it exists — but the engine refuses to let you read or write it until its declaration line executes, throwing \"Cannot access 'x' before initialization.\" The distinction matters mainly for debugging: the TDZ error tells you the variable is declared later in the same scope, which an \"undefined\" error does not.",
        np: "होइन। Undeclared variable ले \"not defined\" error दिन्छ। TDZ मा variable registered भइसकेको हुन्छ तर declaration नहुँदासम्म access दिइँदैन — \"Cannot access before initialization\" error।",
        jp: "違います。未宣言の変数は「not defined」エラー。TDZ内の変数は既に登録済みだが宣言行まで読み書きできず「Cannot access before initialization」エラーになります。",
      },
    },
  ],
};
