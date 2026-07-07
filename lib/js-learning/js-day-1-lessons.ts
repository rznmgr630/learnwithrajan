import type { LocalizedString } from "@/lib/i18n/types";

export interface JsLessonQuizQuestion {
  question: LocalizedString;
  options: LocalizedString[];
  correctIndex: number;
  explanation: LocalizedString;
}

export interface JsLesson {
  id: string;
  title: LocalizedString;
  durationMinutes: number;
  explanation: LocalizedString;
  diagram: string;
  codeExample: { title: LocalizedString; code: string };
  keyTakeaways: LocalizedString[];
  commonMistakes: LocalizedString[];
  quiz: JsLessonQuizQuestion[];
}

export interface JsLessonDay {
  day: number;
  title: LocalizedString;
  totalMinutes: number;
  difficulty: LocalizedString;
  lessons: JsLesson[];
  finalQuiz: JsLessonQuizQuestion[];
}

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
        en: "A variable is a labelled storage box. JavaScript gives you three kinds of boxes — `var`, `let`, and `const` — and they disagree on three things: <b>where</b> the variable is visible (scope), <b>whether</b> you can declare it again, and <b>whether</b> you can point it at a new value later.\n\n• <b>var</b> — function-scoped, leaks out of `if`/`for` blocks, can be re-declared\n  ↳ Like writing a name on a whiteboard for the whole classroom to see, even if you only meant it for one desk\n• <b>let</b> — block-scoped, cannot be re-declared, can be reassigned\n  ↳ Like a sticky note on one desk — only visible inside that `{ }` block\n• <b>const</b> — block-scoped, must be given a value immediately, the binding can never change\n  ↳ Like a nameplate glued to the desk — permanent label, but if the desk holds a box of items, you can still swap what's inside",
        np: "Variable भनेको labelled storage box हो। var function-scoped, let/const block-scoped। const को binding change हुँदैन तर भित्रको content change हुन सक्छ।",
        jp: "変数はラベル付きの保存箱。varは関数スコープ、let/constはブロックスコープ。constは再代入不可だが中身は変更可能。",
      },
      diagram: `┌─ var ──────────────┐   ┌─ let ──────────────┐   ┌─ const ────────────┐
│ function-scoped    │   │ block-scoped        │   │ block-scoped        │
│ re-declarable       │   │ not re-declarable    │   │ not re-declarable    │
│ reassignable         │   │ reassignable         │   │ NOT reassignable     │
│ leaks out of { }    │   │ stays inside { }     │   │ stays inside { }     │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
        avoid                  reassign later?             default choice`,
      codeExample: {
        title: { en: "Scope and re-assignment behaviour", np: "Scope र re-assignment", jp: "スコープと再代入" },
        code: `// var — function-scoped, hoisted, can be re-declared (avoid in modern code)
var name = "Alice";
var name = "Bob";  // no error — re-declaration is allowed with var

// let — block-scoped, not re-declarable, can be reassigned
let count = 0;
count = 1;          // ✅ reassign is fine

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
      keyTakeaways: [
        { en: "Default to `const`. Switch to `let` only when you need to reassign. Avoid `var` in new code.", np: "Default मा `const` प्रयोग गर्नुहोस्। Reassign चाहिएमा `let`। `var` नयाँ code मा नचलाउनुहोस्।", jp: "デフォルトは`const`。再代入が必要なら`let`。新しいコードで`var`は避ける。" },
        { en: "`const` freezes the binding, not the value — objects and arrays declared with `const` can still be mutated.", np: "`const` ले binding लाई freeze गर्छ, value लाई होइन — object/array भित्रको content बदलिन सक्छ।", jp: "`const`は束縛を固定するだけで値は固定しない。オブジェクトや配列の中身は変更できる。" },
        { en: "`var` ignores block boundaries (`if`, `for`) and is scoped to the nearest function — this is the single biggest source of `var`-related bugs.", np: "`var` ले block boundary (if, for) लाई ignore गर्छ र nearest function मा scoped हुन्छ।", jp: "`var`はブロック境界（if・for）を無視し、最も近い関数にスコープされる。" },
      ],
      commonMistakes: [
        { en: "Using `var` inside a loop and expecting each iteration to get its own copy — it doesn't; all iterations share the same `var`.", np: "Loop भित्र `var` प्रयोग गरेर हरेक iteration ले आफ्नै copy पाउने आशा गर्नु — त्यसो हुँदैन।", jp: "ループ内で`var`を使い、各繰り返しが独自のコピーを持つと期待すること（実際は共有される）。" },
        { en: "Assuming `const` makes an object fully immutable, then being surprised when `obj.prop = x` works fine.", np: "`const` ले object पूरै immutable बनाउँछ भन्ने ठान्नु, त्यसपछि `obj.prop = x` काम गर्दा अचम्मित हुनु।", jp: "`const`がオブジェクトを完全に不変にすると思い込み、`obj.prop = x`が動くことに驚くこと。" },
        { en: "Re-declaring a `var` by accident (e.g. copy-pasted code) and not noticing, because JavaScript allows it silently.", np: "गल्तिले `var` फेरि declare गर्नु (जस्तै copy-paste code बाट) र JS ले silently allow गर्ने भएकाले नोटिस नगर्नु।", jp: "誤って`var`を再宣言し（コピペなどで）、JSが黙って許可するため気づかないこと。" },
      ],
      quiz: [
        {
          question: { en: "Which declaration keyword allows you to re-declare the same variable name in the same scope without an error?", np: "कुन keyword ले same scope मा same नाम फेरि declare गर्दा error नदिने?", jp: "同じスコープで同じ変数名を再宣言してもエラーにならないキーワードは？" },
          options: [
            { en: "let", np: "let", jp: "let" },
            { en: "const", np: "const", jp: "const" },
            { en: "var", np: "var", jp: "var" },
          ],
          correctIndex: 2,
          explanation: { en: "`var` allows re-declaration in the same scope with no error — one of the reasons it's easy to introduce accidental bugs with it.", np: "`var` ले same scope मा फेरि declare गर्दा error दिँदैन।", jp: "`var`は同じスコープでの再宣言をエラーなしで許可する。" },
        },
        {
          question: { en: "What happens when you run `const user = { name: \"A\" }; user.name = \"B\";`?", np: "`const user = { name: \"A\" }; user.name = \"B\";` चलाउँदा के हुन्छ?", jp: "`const user = { name: \"A\" }; user.name = \"B\";` を実行すると？" },
          options: [
            { en: "TypeError — const cannot be modified", np: "TypeError — const modify हुँदैन", jp: "TypeError — constは変更不可" },
            { en: "Works fine — the object's property is updated", np: "ठीकसँग चल्छ — object को property update हुन्छ", jp: "正常に動作 — オブジェクトのプロパティが更新される" },
            { en: "SyntaxError at declaration", np: "Declaration मा SyntaxError", jp: "宣言時にSyntaxError" },
          ],
          correctIndex: 1,
          explanation: { en: "const only locks the binding (the variable name cannot point to a new object). Mutating a property on the existing object is allowed.", np: "const ले binding मात्र lock गर्छ। Existing object को property मुटेट गर्न मिल्छ।", jp: "constは束縛のみを固定する。既存オブジェクトのプロパティ変更は許可される。" },
        },
        {
          question: { en: "A `var` declared inside an `if` block — where is it accessible from?", np: "`if` block भित्र declare गरिएको `var` कहाँबाट access गर्न मिल्छ?", jp: "`if`ブロック内で宣言された`var`はどこからアクセスできる？" },
          options: [
            { en: "Only inside the if block", np: "if block भित्र मात्र", jp: "ifブロック内のみ" },
            { en: "The entire enclosing function (or global scope)", np: "सम्पूर्ण enclosing function (वा global scope)", jp: "囲む関数全体（またはグローバルスコープ）" },
            { en: "Nowhere — it throws an error", np: "कहीं पनि — error आउँछ", jp: "どこからも — エラーになる" },
          ],
          correctIndex: 1,
          explanation: { en: "var is function-scoped, so it ignores the if block's boundaries and leaks out to the whole enclosing function.", np: "var function-scoped हो, त्यसैले if block को boundary ignore गरेर पूरै function मा leak हुन्छ।", jp: "varは関数スコープなので、ifブロックの境界を無視して関数全体に漏れる。" },
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
