import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_1_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "JavaScript has three ways to declare a variable and eight primitive types. Knowing which one to use — and understanding how JavaScript secretly converts values between types — prevents a whole class of bugs that are notoriously hard to debug.",
      np: "JavaScript मा variable declare गर्ने तीन तरिका र आठ primitive types छन् — सही छान्न जान्नु जरुरी छ।",
      jp: "変数宣言の3つの方法と8つのプリミティブ型。使い分けと型変換のルールを理解することでバグを防ぐ。",
    },
    {
      en: "Type coercion is what happens when JavaScript automatically converts a value from one type to another. It is the source of classic interview puzzles like `'5' + 3 === '53'` and `'5' - 3 === 2`. Once you understand the rules, it stops being surprising.",
      np: "Type coercion JavaScript ले value को type आफैं परिवर्तन गर्दा हुन्छ — यही `'5' + 3 === '53'` जस्ता puzzles को कारण हो।",
      jp: "型強制は `'5' + 3 === '53'` のような面白い挙動の正体。ルールを理解すれば驚かなくなる。",
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
      ],
    },
    {
      title: { en: "Type coercion — explicit vs implicit", np: "Type coercion — explicit र implicit", jp: "型変換 — 明示と暗黙" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Explicit coercion is when you intentionally convert a value yourself using Number(), String(), Boolean(), or parseInt(). Implicit coercion is when JavaScript converts values automatically — often when you use an operator with mixed types. Implicit coercion follows specific rules that are worth memorising.",
            np: "Explicit coercion तपाईंले आफैं गर्नुहुन्छ (Number(), String(), Boolean())। Implicit coercion JavaScript ले operator प्रयोग गर्दा आफैं गर्छ।",
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
              en: "**Falsy values** (exactly six): `false`, `0`, `''` (empty string), `null`, `undefined`, `NaN`. Everything else is truthy — including `'0'`, `[]`, and `{}`.",
              np: "**Falsy values** ठ्याक्कै छ छन्: false, 0, '', null, undefined, NaN। बाँकी सबै truthy।",
              jp: "**Falsy値**はちょうど6つ: false・0・''・null・undefined・NaN。それ以外はすべてtruthy（'0'・[]・{}も）。",
            },
            {
              en: "**Use `===` by default.** Only use `==` when you intentionally want to check for both `null` and `undefined` at once: `if (value == null)`.",
              np: "**Default मा `===` प्रयोग गर्नुहोस्।** null र undefined दुवै एकैपटक check गर्न मात्र `==` ठीक छ।",
              jp: "**デフォルトでは`===`を使う。** `==`はnullとundefinedを同時チェックする場合のみ許容。",
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
  ],
};
