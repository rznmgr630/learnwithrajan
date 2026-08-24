import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_1_LESSONS: JsLessonDay = {
  day: 1,
  title: { en: "Variables, Types & Hoisting", np: "Variables, Types र Hoisting", jp: "変数・型・ホイスティング" },
  totalMinutes: 35,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "variables",
      title: { en: "Variables", np: "Variables", jp: "変数" },
      durationMinutes: 8,
      explanation: {
        en: "A <b>variable</b> (a named place to store a value) lets us save and use data.\n\nJavaScript has three ways to create variables:\n\n```javascript\nvar\nlet\nconst\n```\n\nThe main differences are <b>scope</b> (where the variable can be used), <b>re-declaration</b> (creating the same variable again), and <b>reassignment</b> (giving a variable a new value).\n\n---\n\n## `var`\n\n<b>`var`</b> (an older way to create variables) is <b>function-scoped</b> (available throughout the function).\n\n```javascript\nif (true) {\n  var name = \"Rajan\";\n}\n\nconsole.log(name); // Rajan\n```\n\nIt can also be re-declared:\n\n```javascript\nvar age = 20;\nvar age = 30;\n```\n\nGenerally, avoid `var` in modern JavaScript.\n\n---\n\n## `let`\n\n<b>`let`</b> (a variable whose value can change) is <b>block-scoped</b> (available only inside its `{ }` block).\n\n```javascript\nlet age = 20;\n\nage = 30;\n```\n\nYou cannot re-declare it in the same scope:\n\n```javascript\nlet age = 20;\nlet age = 30; // Error\n```\n\n---\n\n## `const`\n\n<b>`const`</b> (a variable that cannot be reassigned) is also block-scoped.\n\n```javascript\nconst name = \"Rajan\";\n\nname = \"John\"; // Error\n```\n\nIt must have a value when created:\n\n```javascript\nconst age = 30;\n```",
        np: "<b>Variable</b> (value राख्ने नाम दिइएको ठाउँ) ले हामीलाई data सेभ गर्न र प्रयोग गर्न दिन्छ।\n\nJavaScript मा variable बनाउने तीन तरिका छन्:\n\n```javascript\nvar\nlet\nconst\n```\n\nमुख्य फरक हुन् <b>scope</b> (variable कहाँ प्रयोग गर्न सकिन्छ), <b>re-declaration</b> (उही variable फेरि बनाउनु), र <b>reassignment</b> (variable लाई नयाँ value दिनु)।\n\n---\n\n## `var`\n\n<b>`var`</b> (variable बनाउने पुरानो तरिका) <b>function-scoped</b> (पूरै function भर उपलब्ध) हुन्छ।\n\n```javascript\nif (true) {\n  var name = \"Rajan\";\n}\n\nconsole.log(name); // Rajan\n```\n\nयसलाई फेरि declare पनि गर्न सकिन्छ:\n\n```javascript\nvar age = 20;\nvar age = 30;\n```\n\nसामान्यतया, आधुनिक JavaScript मा `var` बच्नुहोस्।\n\n---\n\n## `let`\n\n<b>`let`</b> (value बदल्न सकिने variable) <b>block-scoped</b> (आफ्नो `{ }` block भित्र मात्र उपलब्ध) हुन्छ।\n\n```javascript\nlet age = 20;\n\nage = 30;\n```\n\nउही scope मा यसलाई फेरि declare गर्न सक्नुहुन्न:\n\n```javascript\nlet age = 20;\nlet age = 30; // Error\n```\n\n---\n\n## `const`\n\n<b>`const`</b> (reassign गर्न नमिल्ने variable) पनि block-scoped हुन्छ।\n\n```javascript\nconst name = \"Rajan\";\n\nname = \"John\"; // Error\n```\n\nबनाउँदै गर्दा यसको value हुनै पर्छ:\n\n```javascript\nconst age = 30;\n```",
        jp: "<b>変数</b>（値を保存する名前付きの場所）を使うと、データを保存して利用できます。\n\nJavaScriptには変数を作る方法が3つあります:\n\n```javascript\nvar\nlet\nconst\n```\n\n主な違いは<b>スコープ</b>（変数を使える範囲）、<b>再宣言</b>（同じ変数をもう一度作ること）、<b>再代入</b>（変数に新しい値を入れること）です。\n\n---\n\n## `var`\n\n<b>`var`</b>（変数を作る古い方法）は<b>関数スコープ</b>（関数全体で使える）です。\n\n```javascript\nif (true) {\n  var name = \"Rajan\";\n}\n\nconsole.log(name); // Rajan\n```\n\n再宣言もできます:\n\n```javascript\nvar age = 20;\nvar age = 30;\n```\n\n現代のJavaScriptでは、基本的に `var` は避けましょう。\n\n---\n\n## `let`\n\n<b>`let`</b>（値を変えられる変数）は<b>ブロックスコープ</b>（その `{ }` ブロックの中でだけ使える）です。\n\n```javascript\nlet age = 20;\n\nage = 30;\n```\n\n同じスコープで再宣言はできません:\n\n```javascript\nlet age = 20;\nlet age = 30; // Error\n```\n\n---\n\n## `const`\n\n<b>`const`</b>（再代入できない変数）もブロックスコープです。\n\n```javascript\nconst name = \"Rajan\";\n\nname = \"John\"; // Error\n```\n\n作るときに値を持たせなければなりません:\n\n```javascript\nconst age = 30;\n```",
      },
      diagram: `              Variables
                  |
       +----------+----------+
       |          |          |
      var        let       const
       |          |          |
 Function       Block      Block
  scoped        scoped     scoped
       |          |          |
 Reassign ✓   Reassign ✓  Reassign ✗
 Re-declare ✓ Re-declare ✗ Re-declare ✗`,
      codeExample: {
        title: { en: "Declaring with const and let", np: "const र let ले declare गर्नु", jp: "constとletで宣言する" },
        code: `const name = "Rajan";
let age = 29;

age = 30;

console.log(name); // Rajan
console.log(age);  // 30`,
      },
      keyTakeaways: [
        { en: "<b>`var`</b> → old, function-scoped, can be reassigned and re-declared.", np: "<b>`var`</b> → पुरानो, function-scoped, reassign र re-declare गर्न मिल्छ।", jp: "<b>`var`</b> → 古い、関数スコープ、再代入も再宣言もできる。" },
        { en: "<b>`let`</b> → block-scoped, can be reassigned.", np: "<b>`let`</b> → block-scoped, reassign गर्न मिल्छ।", jp: "<b>`let`</b> → ブロックスコープ、再代入できる。" },
        { en: "<b>`const`</b> → block-scoped, cannot be reassigned.", np: "<b>`const`</b> → block-scoped, reassign गर्न मिल्दैन।", jp: "<b>`const`</b> → ブロックスコープ、再代入できない。" },
        { en: "Use <b>`const`</b> by default.", np: "Default मा <b>`const`</b> प्रयोग गर्नुहोस्।", jp: "既定では<b>`const`</b>を使う。" },
        { en: "Use <b>`let`</b> when the value needs to change.", np: "Value बदल्नुपर्ने बेला <b>`let`</b> प्रयोग गर्नुहोस्।", jp: "値を変える必要があるときは<b>`let`</b>を使う。" },
        { en: "Avoid <b>`var`</b> in modern JavaScript.", np: "आधुनिक JavaScript मा <b>`var`</b> बच्नुहोस्।", jp: "現代のJavaScriptでは<b>`var`</b>を避ける。" },
      ],
      commonMistakes: [
        { en: "<b>Reassigning a `const`</b> — `const age = 20; age = 30;` throws an error. Use `let` if the value needs to change.", np: "<b>`const` लाई reassign गर्नु</b> — `const age = 20; age = 30;` ले error दिन्छ। Value बदल्नुपर्ने भए `let` प्रयोग गर्नुहोस्।", jp: "<b>`const` に再代入する</b> — `const age = 20; age = 30;` はエラーになる。値を変える必要があるなら `let` を使う。" },
        { en: "<b>Re-declaring a `let`</b> — `let name = \"Rajan\"; let name = \"John\";` is an error in the same scope.", np: "<b>`let` लाई फेरि declare गर्नु</b> — उही scope मा `let name = \"Rajan\"; let name = \"John\";` error हो।", jp: "<b>`let` を再宣言する</b> — 同じスコープでの `let name = \"Rajan\"; let name = \"John\";` はエラー。" },
        { en: "<b>Assuming `const` makes objects completely unchangeable</b> — with `const user = { name: \"Rajan\" }`, `user.name = \"John\"` works but `user = {}` fails. `const` prevents reassignment of the variable, not changes inside the object.", np: "<b>`const` ले object पूरै अपरिवर्तनीय बनाउँछ भन्ने ठान्नु</b> — `const user = { name: \"Rajan\" }` सँग, `user.name = \"John\"` काम गर्छ तर `user = {}` fail हुन्छ। `const` ले variable को reassignment रोक्छ, object भित्रको परिवर्तन होइन।", jp: "<b>`const` はオブジェクトを完全に変更不可にすると思い込む</b> — `const user = { name: \"Rajan\" }` で `user.name = \"John\"` は動くが `user = {}` は失敗する。`const` が防ぐのは変数の再代入であり、オブジェクト内部の変更ではない。" },
      ],
      quiz: [
        {
          question: { en: "Which should you normally use when a value doesn't need to change?", np: "Value बदल्नु पर्दैन भन्ने बेला सामान्यतया कुन प्रयोग गर्नुपर्छ?", jp: "値を変える必要がないとき、通常はどれを使うべきか?" },
          options: [
            { en: "`var`", np: "`var`", jp: "`var`" },
            { en: "`let`", np: "`let`", jp: "`let`" },
            { en: "`const`", np: "`const`", jp: "`const`" },
          ],
          correctIndex: 2,
          explanation: { en: "`const` is the default choice — it says the binding will never be reassigned.", np: "`const` default छनोट हो — यसले binding कहिल्यै reassign हुँदैन भन्ने जनाउँछ।", jp: "`const` が既定の選択 — この束縛は再代入されないことを示す。" },
        },
        {
          question: { en: "Which one can be reassigned?", np: "कुनलाई reassign गर्न मिल्छ?", jp: "再代入できるのはどれか?" },
          options: [
            { en: "`const`", np: "`const`", jp: "`const`" },
            { en: "`let`", np: "`let`", jp: "`let`" },
            { en: "Both", np: "दुबै", jp: "両方" },
          ],
          correctIndex: 1,
          explanation: { en: "`let` can be reassigned; `const` cannot.", np: "`let` लाई reassign गर्न मिल्छ; `const` लाई मिल्दैन।", jp: "`let` は再代入できるが、`const` はできない。" },
        },
        {
          question: { en: "Which one is function-scoped?", np: "कुन function-scoped हो?", jp: "関数スコープなのはどれか?" },
          options: [
            { en: "`var`", np: "`var`", jp: "`var`" },
            { en: "`let`", np: "`let`", jp: "`let`" },
            { en: "`const`", np: "`const`", jp: "`const`" },
          ],
          correctIndex: 0,
          explanation: { en: "`var` is function-scoped, so it ignores `{ }` block boundaries. `let` and `const` are block-scoped.", np: "`var` function-scoped हो, त्यसैले यो `{ }` block boundary बेवास्ता गर्छ। `let` र `const` block-scoped हुन्।", jp: "`var` は関数スコープなので `{ }` のブロック境界を無視する。`let` と `const` はブロックスコープ。" },
        },
      ],
    },
    {
      id: "primitive-types",
      title: { en: "Primitive Types", np: "Primitive Types", jp: "プリミティブ型" },
      durationMinutes: 9,
      explanation: {
        en: "Every value in JavaScript is either a <b>primitive</b> (a simple, single value stored directly) or an <b>object</b> (a more complex structure stored by reference). There are exactly eight primitive types — memorising the list removes a lot of guesswork when debugging `typeof` output.\n\n• `string`, `number`, `boolean` — the everyday three\n• `null` — a developer explicitly says \"no value\"\n• `undefined` — JavaScript's default for \"nobody set this yet\"\n• `symbol` — a guaranteed-unique identifier\n• `bigint` — integers larger than `Number.MAX_SAFE_INTEGER`\n• everything else is an <b>object</b> (arrays, functions, dates — even though `typeof null === \"object\"`, which is a famous historic bug)",
        np: "हरेक value primitive (सिधा value) वा object (reference द्वारा) हो। ठ्याक्कै आठ primitive types छन्।",
        jp: "すべての値はプリミティブ（単純な値）かオブジェクト（参照）です。プリミティブはちょうど8種類あります。",
      },
      diagram: `Value
 ├─ Primitive (copied by value)
 │   ├─ string     "hello"
 │   ├─ number     42, 9.99, NaN
 │   ├─ boolean    true / false
 │   ├─ null        intentional "no value"
 │   ├─ undefined   "not set yet"
 │   ├─ symbol      Symbol("id")
 │   └─ bigint      9007199254740993n
 └─ Object (copied by reference)
     ├─ {}  plain object
     ├─ []  array
     └─ function(){}`,
      codeExample: {
        title: { en: "All primitive types with examples", np: "सबै primitive types उदाहरण सहित", jp: "全プリミティブ型の例" },
        code: `const greeting = "Hello";              // string
const age = 30;                         // number
const isActive = true;                  // boolean
const empty = null;                     // null — intentional absence
let notSet;                             // undefined — not yet assigned
const id = Symbol("id");                // symbol — always unique
const huge = 9007199254740993n;         // bigint — note the 'n' suffix

// typeof operator
console.log(typeof "hello");     // "string"
console.log(typeof 42);          // "number"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" ← famous bug, kept for compatibility
console.log(typeof Symbol());    // "symbol"
console.log(typeof 1n);          // "bigint"
console.log(typeof {});          // "object"
console.log(typeof []);          // "object" (not "array"!)`,
      },
      keyTakeaways: [
        { en: "`undefined` means \"nobody has set this yet\" (JavaScript's default). `null` means a developer explicitly said \"this has no value.\"", np: "undefined = कोहीले set नगरेको। null = developer ले आफैं value छैन भनेको।", jp: "undefinedは「未設定」のデフォルト。nullは開発者が明示的に設定した「値なし」。" },
        { en: "Primitives are copied by value — assigning one to a new variable copies the value, so changing the copy never affects the original.", np: "Primitives value द्वारा copy हुन्छन् — copy बदल्दा original मा असर पर्दैन।", jp: "プリミティブは値でコピーされる。コピーを変更しても元の値には影響しない。" },
        { en: "`typeof null` returning `\"object\"` is a bug frozen in place since 1995 — always use `value === null` to check for null specifically.", np: "`typeof null` ले 'object' दिने कुरा 1995 देखिको bug हो — null check गर्न `value === null` प्रयोग गर्नुहोस्।", jp: "`typeof null`が'object'を返すのは1995年からのバグ。nullチェックには`value === null`を使う。" },
      ],
      commonMistakes: [
        { en: "Confusing `null` and `undefined` — using them interchangeably instead of `null` for \"intentionally empty\" and `undefined` for \"not yet set.\"", np: "null र undefined लाई मिलाउनु — 'intentionally empty' का लागि null र 'not set' का लागि undefined छुट्याउनु पर्छ।", jp: "nullとundefinedを混同すること。「意図的に空」にはnull、「未設定」にはundefinedを使い分ける。" },
        { en: "Checking `typeof value === \"object\"` to detect an object, forgetting that `null` also passes this check.", np: "Object check गर्न `typeof value === 'object'` प्रयोग गर्दा null पनि pass हुने कुरा बिर्सनु।", jp: "オブジェクトの判定に`typeof value === 'object'`を使い、nullも通ることを忘れること。" },
        { en: "Assuming `typeof []` returns `\"array\"` — it returns `\"object\"`; use `Array.isArray()` instead.", np: "`typeof []` ले 'array' दिन्छ भन्ने ठान्नु — यसले 'object' दिन्छ; `Array.isArray()` प्रयोग गर्नुहोस्।", jp: "`typeof []`が'array'を返すと思うこと。実際は'object'。`Array.isArray()`を使う。" },
      ],
      quiz: [
        {
          question: { en: "Which of these is a primitive type, not an object?", np: "यीमध्ये कुन primitive type हो, object होइन?", jp: "次のうちオブジェクトではなくプリミティブ型はどれ？" },
          options: [
            { en: "Array", np: "Array", jp: "Array" },
            { en: "Symbol", np: "Symbol", jp: "Symbol" },
            { en: "Function", np: "Function", jp: "Function" },
          ],
          correctIndex: 1,
          explanation: { en: "Symbol is one of JavaScript's primitive types. Arrays and functions are both objects — typeof [] and typeof function(){} both return \"object\"/\"function\", never a primitive tag.", np: "Symbol primitive type हो। Array र function दुवै object हुन्।", jp: "Symbolはプリミティブ型。配列と関数はどちらもオブジェクト。" },
        },
        {
          question: { en: "What does `typeof null` return?", np: "`typeof null` ले के फर्काउँछ?", jp: "`typeof null`は何を返す？" },
          options: [
            { en: "\"null\"", np: "\"null\"", jp: "\"null\"" },
            { en: "\"undefined\"", np: "\"undefined\"", jp: "\"undefined\"" },
            { en: "\"object\"", np: "\"object\"", jp: "\"object\"" },
          ],
          correctIndex: 2,
          explanation: { en: "It's a historic bug from 1995 that was never fixed for backwards-compatibility reasons.", np: "यो 1995 देखिको bug हो जो compatibility कारणले fix गरिएन।", jp: "1995年からの互換性維持のため修正されなかったバグ。" },
        },
        {
          question: { en: "Which is the correct way to check if a value is an array?", np: "Value array हो कि होइन check गर्ने सही तरिका कुन हो?", jp: "値が配列かどうかを確認する正しい方法は？" },
          options: [
            { en: "typeof value === \"array\"", np: "typeof value === \"array\"", jp: "typeof value === \"array\"" },
            { en: "Array.isArray(value)", np: "Array.isArray(value)", jp: "Array.isArray(value)" },
            { en: "value instanceof array", np: "value instanceof array", jp: "value instanceof array" },
          ],
          correctIndex: 1,
          explanation: { en: "typeof an array returns \"object\", not \"array\" — Array.isArray() is the reliable check.", np: "Array को typeof ले 'object' दिन्छ, 'array' होइन — Array.isArray() भरपर्दो तरिका हो।", jp: "配列のtypeofは'array'ではなく'object'を返す。Array.isArray()が確実な方法。" },
        },
      ],
    },
    {
      id: "hoisting",
      title: { en: "Hoisting", np: "Hoisting", jp: "ホイスティング" },
      durationMinutes: 9,
      explanation: {
        en: "Before JavaScript runs a single line of your code, it scans the whole file in a <b>creation phase</b> and registers every variable and function name in memory. Only after that does the <b>execution phase</b> run your code top to bottom. This scan-then-run behaviour is called <b>hoisting</b>.\n\nThink of it like a restaurant reading the entire order ticket before cooking anything — the kitchen already knows every dish that's coming, even the ones at the bottom of the ticket, before the first pan touches the stove.\n\n• <b>Function declarations</b> are hoisted completely — name AND body\n• <b>var</b> is hoisted and pre-filled with `undefined`\n• <b>let</b> and <b>const</b> are hoisted too, but stay in the <b>Temporal Dead Zone (TDZ)</b> — touching them early throws a `ReferenceError`",
        np: "JS ले पहिले सम्पूर्ण file scan गरेर हरेक variable/function नाम memory मा दर्ता गर्छ (creation phase), त्यसपछि मात्र code चलाउँछ (execution phase)। यसैलाई hoisting भनिन्छ।",
        jp: "JSはコードを実行する前にファイル全体をスキャンし、変数・関数名をメモリに登録します（作成フェーズ）。その後にコードを実行します（実行フェーズ）。これがホイスティングです。",
      },
      diagram: `CREATION PHASE (scan everything first)      EXECUTION PHASE (run top to bottom)
──────────────────────────────────────      ──────────────────────────────────────
var a           -> undefined                console.log(a)        -> undefined
let b            -> [TDZ]                    console.log(typeof b) -> "undefined"
const c          -> [TDZ]                    sayHi()                -> "Hi!" (hoisted body runs)
function sayHi{} -> full body ready          var a = 1              -> a becomes 1
                                              let b = 2               -> b leaves TDZ, becomes 2`,
      codeExample: {
        title: { en: "Creation phase vs execution phase, side by side", np: "Creation phase vs execution phase", jp: "作成フェーズと実行フェーズ" },
        code: `console.log(a);        // undefined — not an error!
// console.log(c);      // ❌ ReferenceError — TDZ
sayHi();                 // "Hi!" — works even though called before its declaration

var a = 1;
let b = 2;
const c = 3;

function sayHi() {
  console.log("Hi!");
}

// What actually happens:
// CREATION PHASE:  var a -> undefined | let b, const c -> TDZ | sayHi -> full body ready
// EXECUTION PHASE: runs top to bottom, filling in real values as each line executes`,
      },
      keyTakeaways: [
        { en: "Function declarations are hoisted completely, so you can call them before the line where they're written.", np: "Function declaration पूरै hoist हुन्छ — declaration अघि call गर्न मिल्छ।", jp: "関数宣言は完全にホイストされ、宣言前に呼び出せる。" },
        { en: "`var` is hoisted and pre-filled with `undefined` — reading it early gives `undefined`, not an error.", np: "var hoist हुन्छ र undefined ले pre-fill हुन्छ — early access मा error आउँदैन।", jp: "varはホイストされundefinedで初期化されるため、早期アクセスはエラーではなくundefinedになる。" },
        { en: "`let`/`const` are hoisted but locked in the Temporal Dead Zone until their declaration line runs — accessing them early throws.", np: "let/const hoist हुन्छन् तर declaration नआउँदासम्म TDZ मा locked रहन्छन् — early access मा error आउँछ।", jp: "let/constはホイストされるが宣言行までTDZにロックされ、早期アクセスはエラーになる。" },
      ],
      commonMistakes: [
        { en: "Assuming `let`/`const` are not hoisted at all — they are hoisted, they're just unusable (TDZ) until declared.", np: "let/const hoist नै हुँदैन भन्ने ठान्नु — वास्तवमा hoist हुन्छन्, TDZ मा locked मात्र हुन्छन्।", jp: "let/constが全くホイストされないと思うこと。実際はホイストされるがTDZでロックされる。" },
        { en: "Relying on function-declaration hoisting for functions defined as `const fn = () => {}` — arrow functions and function expressions are NOT hoisted this way.", np: "`const fn = () => {}` जस्ता function expression लाई function declaration जस्तै hoist हुन्छ भन्ने ठान्नु।", jp: "`const fn = () => {}`のような関数式が関数宣言と同様にホイストされると思うこと。" },
        { en: "Writing code that depends on execution order working out \"by luck\" instead of declaring variables before first use.", np: "Variable लाई पहिलो प्रयोग अघि declare नगरी execution order मा भर पर्नु।", jp: "変数を最初の使用前に宣言せず、実行順序が「たまたま」うまくいくことに依存すること。" },
      ],
      quiz: [
        {
          question: { en: "What does `console.log(x); var x = 5;` print?", np: "`console.log(x); var x = 5;` ले के print गर्छ?", jp: "`console.log(x); var x = 5;` は何を出力する？" },
          options: [
            { en: "ReferenceError", np: "ReferenceError", jp: "ReferenceError" },
            { en: "undefined", np: "undefined", jp: "undefined" },
            { en: "5", np: "5", jp: "5" },
          ],
          correctIndex: 1,
          explanation: { en: "var is hoisted and pre-filled with undefined, so reading it before the assignment line gives undefined, not an error.", np: "var hoist भई undefined ले pre-fill हुन्छ — assignment अघि पढ्दा undefined आउँछ।", jp: "varはホイストされundefinedで初期化されるため、代入前に読むとundefinedになる。" },
        },
        {
          question: { en: "What happens if you access a `let` variable before its declaration line, in the same block?", np: "Same block मा declaration अघि `let` variable access गर्दा के हुन्छ?", jp: "同じブロック内で宣言前に`let`変数にアクセスすると？" },
          options: [
            { en: "Returns undefined", np: "undefined फर्काउँछ", jp: "undefinedを返す" },
            { en: "Throws a ReferenceError (TDZ)", np: "ReferenceError (TDZ) आउँछ", jp: "ReferenceError（TDZ）が発生する" },
            { en: "Returns null", np: "null फर्काउँछ", jp: "nullを返す" },
          ],
          correctIndex: 1,
          explanation: { en: "let is hoisted but stays in the Temporal Dead Zone until its declaration line runs — accessing it early throws.", np: "let hoist हुन्छ तर declaration नआउँदासम्म TDZ मा रहन्छ — early access मा error आउँछ।", jp: "letはホイストされるが宣言行までTDZに留まり、早期アクセスはエラーになる。" },
        },
        {
          question: { en: "Are arrow functions assigned to a `const` hoisted like function declarations?", np: "`const` मा assign गरिएको arrow function function declaration जस्तै hoist हुन्छ?", jp: "`const`に代入されたアロー関数は関数宣言のようにホイストされる？" },
          options: [
            { en: "Yes, fully hoisted with their body", np: "हो, body सहित पूरै hoist हुन्छ", jp: "はい、本体ごと完全にホイストされる" },
            { en: "No — they follow const's TDZ rules, unusable before the line runs", np: "होइन — const को TDZ rule पालना गर्छ, line नचल्दासम्म प्रयोग गर्न मिल्दैन", jp: "いいえ — constのTDZルールに従い、その行が実行されるまで使えない" },
          ],
          correctIndex: 1,
          explanation: { en: "Only function declarations get full hoisting. An arrow function stored in a const is just a variable assignment — it follows const's TDZ behaviour.", np: "पूरै hoisting function declaration लाई मात्र मिल्छ। const मा arrow function assignment मात्र हो — TDZ rule पालना गर्छ।", jp: "完全なホイストは関数宣言のみ。constに格納されたアロー関数は単なる変数代入で、constのTDZルールに従う。" },
        },
      ],
    },
    {
      id: "type-coercion",
      title: { en: "Type Coercion", np: "Type Coercion", jp: "型変換" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Explicit coercion</b> is when you intentionally convert a value yourself using `Number()`, `String()`, `Boolean()`, or `parseInt()`. <b>Implicit coercion</b> is when JavaScript converts values automatically — usually when an operator sees mismatched types and has to pick a side.\n\nImplicit coercion is exactly why `'5' + 3 === '53'` (the `+` operator leans towards text) but `'5' - 3 === 2` (the `-` operator has no text version, so it forces both sides to numbers). Once you know the rule per operator, the \"surprising\" behaviour becomes predictable.\n\n• <b>Falsy values</b> (exactly six): `false`, `0`, `''`, `null`, `undefined`, `NaN`\n• Everything else is truthy — including `'0'`, `[]`, and `{}`\n• <b>Use `===` by default.</b> Only reach for `==` to check both `null` and `undefined` at once",
        np: "Explicit coercion तपाईंले आफैं गर्नुहुन्छ। Implicit coercion JavaScript ले operator प्रयोग गर्दा आफैं गर्छ।",
        jp: "明示的変換は自分で行う。暗黙の変換は演算子使用時にJSが自動で行う。",
      },
      diagram: `"5" + 3   ──▶  "+" prefers text  ──▶  "53"   (string concatenation)
"5" - 3   ──▶  "-" has no text form ──▶  2    (both sides forced to number)
"5" == 5  ──▶  coerces before comparing ──▶ true   (avoid ==)
"5" === 5 ──▶  no coercion, types differ ──▶ false  (use ===)`,
      codeExample: {
        title: { en: "Coercion rules with + and ==", np: "Coercion rules: + र ==", jp: "型変換ルール: + と ==" },
        code: `// ── Explicit coercion ────────────────────────────────────────────
Number("42")     // 42
Boolean(0)       // false  ← falsy
Boolean("")      // false  ← falsy
// Everything else is truthy: "0", [], {}, -1, Infinity

// ── Implicit coercion with + and - ────────────────────────────────
"5" + 3          // "53"  — + prefers string concatenation
"5" - 3          // 2     — - forces both sides to numbers

// ── Loose equality == vs strict equality === ──────────────────────
"5" == 5         // true  — coerces before comparing (avoid!)
"5" === 5        // false — no coercion; different types → not equal
null == undefined // true  — only null == null and null == undefined
NaN == NaN       // false — NaN is not equal to itself (use Number.isNaN())

// ── Practical rule: always use === ───────────────────────────────
// The only safe use of == is:  value == null  (checks null and undefined at once)`,
      },
      keyTakeaways: [
        { en: "There are exactly six falsy values: `false`, `0`, `''`, `null`, `undefined`, `NaN`. Everything else is truthy.", np: "Falsy values ठ्याक्कै छ छन्: false, 0, '', null, undefined, NaN।", jp: "Falsy値はちょうど6つ: false・0・''・null・undefined・NaN。" },
        { en: "`+` leans toward string concatenation when either side is a string; `-`, `*`, `/` always force both sides to numbers.", np: "`+` मा कुनै एक side string भए concatenation हुन्छ; `-`, `*`, `/` ले सधैं number मा coerce गर्छ।", jp: "`+`はどちらかが文字列なら連結に傾く。`-`・`*`・`/`は常に両辺を数値に変換する。" },
        { en: "Use `===`/`!==` by default. The only justified use of `==` is `value == null`, which matches both `null` and `undefined` in one check.", np: "Default मा `===`/`!==` प्रयोग गर्नुहोस्। `==` को एक मात्र उचित प्रयोग `value == null` हो।", jp: "デフォルトは`===`/`!==`。`==`の唯一正当な使用は`value == null`。" },
      ],
      commonMistakes: [
        { en: "Expecting `\"5\" - 3` to concatenate like `+` does — `-` has no string version, so it always coerces to numbers.", np: "`\"5\" - 3` ले पनि `+` जस्तै concatenate गर्छ भन्ने ठान्नु — `-` ले सधैं number मा coerce गर्छ।", jp: "`\"5\" - 3`が`+`のように連結すると期待すること。実際は常に数値に変換される。" },
        { en: "Using `==` for a quick comparison and getting a surprising `true` from mismatched types, like `\"5\" == 5` or `[] == false`.", np: "छिटो comparison का लागि `==` प्रयोग गर्दा `\"5\" == 5` जस्तो अनपेक्षित `true` पाउनु।", jp: "手早い比較に`==`を使い、`\"5\" == 5`のような予期しない`true`を得ること。" },
        { en: "Treating `'0'` (a non-empty string) as falsy — it's truthy, only the number `0` and the empty string `''` are falsy.", np: "`'0'` (non-empty string) लाई falsy ठान्नु — यो truthy हो, number `0` मात्र falsy हो।", jp: "`'0'`（空でない文字列）をfalsyと考えること。実際はtruthyで、数値の`0`のみfalsy。" },
      ],
      quiz: [
        {
          question: { en: "What is the result of `\"5\" + 3`?", np: "`\"5\" + 3` को नतिजा के हो?", jp: "`\"5\" + 3` の結果は？" },
          options: [
            { en: "8", np: "8", jp: "8" },
            { en: "\"53\"", np: "\"53\"", jp: "\"53\"" },
            { en: "NaN", np: "NaN", jp: "NaN" },
          ],
          correctIndex: 1,
          explanation: { en: "+ prefers string concatenation whenever one side is already a string, so 3 is coerced to \"3\" and joined.", np: "एक side string भएमा `+` ले concatenation गर्छ — 3 लाई \"3\" मा coerce गरेर जोड्छ।", jp: "一方が文字列なら`+`は連結を優先し、3は\"3\"に変換されて結合される。" },
        },
        {
          question: { en: "How many falsy values are there in JavaScript?", np: "JavaScript मा कति falsy values छन्?", jp: "JavaScriptのfalsy値はいくつ？" },
          options: [
            { en: "4", np: "4", jp: "4" },
            { en: "6", np: "6", jp: "6" },
            { en: "8", np: "8", jp: "8" },
          ],
          correctIndex: 1,
          explanation: { en: "Exactly six: false, 0, '', null, undefined, NaN. Everything else — including '0', [], {} — is truthy.", np: "ठ्याक्कै छ: false, 0, '', null, undefined, NaN। बाँकी सबै truthy।", jp: "ちょうど6つ: false・0・''・null・undefined・NaN。それ以外はすべてtruthy。" },
        },
        {
          question: { en: "What does `\"5\" === 5` evaluate to?", np: "`\"5\" === 5` को नतिजा के हो?", jp: "`\"5\" === 5` の結果は？" },
          options: [
            { en: "true", np: "true", jp: "true" },
            { en: "false", np: "false", jp: "false" },
          ],
          correctIndex: 1,
          explanation: { en: "=== never coerces types. A string and a number are different types, so they are never strictly equal regardless of value.", np: "=== ले कहिल्यै coerce गर्दैन। String र number फरक type हुन्, त्यसैले strictly equal हुँदैन।", jp: "===は型を変換しない。文字列と数値は異なる型なので、値が同じでも厳密には等しくない。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Which keyword should you use by default for a variable you never plan to reassign?", np: "Reassign नगर्ने variable का लागि default मा कुन keyword?", jp: "再代入しない変数にデフォルトで使うキーワードは？" },
      options: [{ en: "var", np: "var", jp: "var" }, { en: "let", np: "let", jp: "let" }, { en: "const", np: "const", jp: "const" }],
      correctIndex: 2,
      explanation: { en: "const should be your default — it signals intent and prevents accidental reassignment.", np: "const default हुनुपर्छ — यसले intent देखाउँछ र गल्तिले reassignment हुनबाट जोगाउँछ।", jp: "constをデフォルトにすべき — 意図を示し誤った再代入を防ぐ。" },
    },
    {
      question: { en: "Does `const` prevent an object's properties from being changed?", np: "`const` ले object को property change हुनबाट रोक्छ?", jp: "`const`はオブジェクトのプロパティ変更を防ぐ？" },
      options: [{ en: "Yes, fully immutable", np: "हो, पूरै immutable", jp: "はい、完全に不変" }, { en: "No, only the binding is fixed", np: "होइन, binding मात्र fixed हुन्छ", jp: "いいえ、束縛のみ固定される" }],
      correctIndex: 1,
      explanation: { en: "const fixes the variable binding, not the value — object properties can still be mutated.", np: "const ले variable binding fix गर्छ, value होइन — property मुटेट गर्न मिल्छ।", jp: "constは変数の束縛を固定するだけで値は固定しない。プロパティは変更可能。" },
    },
    {
      question: { en: "Which of these is NOT one of JavaScript's primitive types?", np: "यीमध्ये कुन JavaScript को primitive type होइन?", jp: "次のうちJavaScriptのプリミティブ型でないものは？" },
      options: [{ en: "symbol", np: "symbol", jp: "symbol" }, { en: "array", np: "array", jp: "array" }, { en: "bigint", np: "bigint", jp: "bigint" }],
      correctIndex: 1,
      explanation: { en: "Arrays are objects, not primitives. typeof [] returns \"object\".", np: "Array object हो, primitive होइन। typeof [] ले 'object' दिन्छ।", jp: "配列はオブジェクトであり、プリミティブではない。typeof []は'object'を返す。" },
    },
    {
      question: { en: "What does `typeof null` return?", np: "`typeof null` ले के फर्काउँछ?", jp: "`typeof null`は何を返す？" },
      options: [{ en: "\"null\"", np: "\"null\"", jp: "\"null\"" }, { en: "\"object\"", np: "\"object\"", jp: "\"object\"" }, { en: "\"undefined\"", np: "\"undefined\"", jp: "\"undefined\"" }],
      correctIndex: 1,
      explanation: { en: "A historic bug from JavaScript's 1995 implementation, never fixed for backwards compatibility.", np: "1995 देखिको bug, compatibility कारणले fix गरिएन।", jp: "1995年からのバグ。互換性のため修正されなかった。" },
    },
    {
      question: { en: "What is the practical difference between `null` and `undefined`?", np: "`null` र `undefined` को व्यावहारिक फरक के हो?", jp: "`null`と`undefined`の実用的な違いは？" },
      options: [{ en: "No difference, they're interchangeable", np: "कुनै फरक छैन, interchangeable छन्", jp: "違いはなく、互換可能" }, { en: "null is explicit \"no value\"; undefined is JS's default for unset", np: "null explicit 'no value' हो; undefined JS को default हो", jp: "nullは明示的な「値なし」、undefinedはJSのデフォルト" }],
      correctIndex: 1,
      explanation: { en: "You choose null deliberately; JavaScript assigns undefined automatically when nothing has been set.", np: "null तपाईंले आफैं छान्नुहुन्छ; JS ले केही set नभएमा आफैं undefined दिन्छ।", jp: "nullは意図的に選ぶ。undefinedは何も設定されていない場合にJSが自動で割り当てる。" },
    },
    {
      question: { en: "What gets printed by `console.log(a); var a = 5;`?", np: "`console.log(a); var a = 5;` ले के print गर्छ?", jp: "`console.log(a); var a = 5;` は何を出力する？" },
      options: [{ en: "ReferenceError", np: "ReferenceError", jp: "ReferenceError" }, { en: "undefined", np: "undefined", jp: "undefined" }, { en: "5", np: "5", jp: "5" }],
      correctIndex: 1,
      explanation: { en: "var is hoisted and pre-filled with undefined before the code runs.", np: "var hoist भई code चल्नु अघि undefined ले pre-fill हुन्छ।", jp: "varはコード実行前にホイストされundefinedで初期化される。" },
    },
    {
      question: { en: "What happens when you access a `let` variable before its declaration line in the same block?", np: "Same block मा declaration अघि `let` access गर्दा के हुन्छ?", jp: "同じブロックで宣言前に`let`にアクセスすると？" },
      options: [{ en: "undefined", np: "undefined", jp: "undefined" }, { en: "ReferenceError (Temporal Dead Zone)", np: "ReferenceError (TDZ)", jp: "ReferenceError（TDZ）" }],
      correctIndex: 1,
      explanation: { en: "let is hoisted but sits in the Temporal Dead Zone until its declaration runs — early access throws.", np: "let hoist हुन्छ तर declaration नआउँदासम्म TDZ मा रहन्छ — early access मा error आउँछ।", jp: "letはホイストされるが宣言までTDZに留まり、早期アクセスはエラーになる。" },
    },
    {
      question: { en: "Are function declarations hoisted with their full body, or just the name?", np: "Function declaration पूरै body सहित hoist हुन्छ कि नाम मात्र?", jp: "関数宣言は本体ごとホイストされる、それとも名前だけ？" },
      options: [{ en: "Just the name", np: "नाम मात्र", jp: "名前だけ" }, { en: "Name and full body", np: "नाम र पूरै body", jp: "名前と本体全体" }],
      correctIndex: 1,
      explanation: { en: "Function declarations are the only construct hoisted completely — you can call them before the line they're written on.", np: "Function declaration एक मात्र construct हो जो पूरै hoist हुन्छ।", jp: "関数宣言は完全にホイストされる唯一の構文で、宣言前に呼び出せる。" },
    },
    {
      question: { en: "What is the result of `\"5\" + 3`?", np: "`\"5\" + 3` को नतिजा के हो?", jp: "`\"5\" + 3` の結果は？" },
      options: [{ en: "\"53\"", np: "\"53\"", jp: "\"53\"" }, { en: "8", np: "8", jp: "8" }, { en: "NaN", np: "NaN", jp: "NaN" }],
      correctIndex: 0,
      explanation: { en: "+ prefers string concatenation when either operand is a string.", np: "एक side string भएमा `+` ले concatenation गर्छ।", jp: "一方が文字列なら`+`は連結を優先する。" },
    },
    {
      question: { en: "Which comparison operator should you use by default in JavaScript?", np: "JavaScript मा default मा कुन comparison operator प्रयोग गर्ने?", jp: "JavaScriptでデフォルトに使うべき比較演算子は？" },
      options: [{ en: "==", np: "==", jp: "==" }, { en: "===", np: "===", jp: "===" }],
      correctIndex: 1,
      explanation: { en: "=== avoids implicit coercion surprises. == should only be used deliberately, e.g. `value == null`.", np: "=== ले implicit coercion का अनपेक्षित नतिजाबाट बचाउँछ। == लाई जानाजानी मात्र प्रयोग गर्नुहोस्।", jp: "===は暗黙の変換による驚きを避ける。==は`value == null`など意図的な場合のみ使う。" },
    },
  ],
};
