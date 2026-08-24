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
        en: "A <b>primitive</b> (a simple value that is not an object) is one of JavaScript's basic value types.\n\nJavaScript has <b>8 primitive types</b>:\n\n```text\nstring\nnumber\nboolean\nnull\nundefined\nsymbol\nbigint\n```\n\nEverything else is an <b>object</b> (a value that can contain more data or behavior).\n\n---\n\n### 1. `string`\n\n<b>String</b> (text) is used for words and characters.\n\n```javascript\nconst name = \"Rajan\";\nconst message = \"Hello\";\n```\n\n---\n\n### 2. `number`\n\n<b>Number</b> (numeric value) is used for integers and decimals.\n\n```javascript\nconst age = 30;\nconst price = 99.99;\n```\n\nJavaScript uses the same `number` type for both.\n\n---\n\n### 3. `boolean`\n\n<b>Boolean</b> (true or false value) has only two possible values:\n\n```javascript\ntrue\nfalse\n```\n\nExample:\n\n```javascript\nconst isLoggedIn = true;\nconst isAdmin = false;\n```\n\n---\n\n### 4. `null`\n\n<b>`null`</b> (intentionally no value) means the developer deliberately says:\n\n> \"There is currently no value.\"\n\n```javascript\nconst user = null;\n```\n\n---\n\n### 5. `undefined`\n\n<b>`undefined`</b> (no value has been assigned yet) usually means a value hasn't been set.\n\n```javascript\nlet name;\n\nconsole.log(name); // undefined\n```\n\n---\n\n### 6. `symbol`\n\n<b>Symbol</b> (a guaranteed unique value) is mainly used when we need a unique identifier.\n\n```javascript\nconst id = Symbol(\"id\");\n```\n\nTwo Symbols are always different:\n\n```javascript\nSymbol(\"id\") === Symbol(\"id\"); // false\n```\n\n---\n\n### 7. `bigint`\n\n<b>BigInt</b> (a number type for very large integers) is used when numbers are larger than JavaScript's safe `number` limit.\n\n```javascript\nconst bigNumber = 123456789012345678901234567890n;\n```\n\nThe `n` at the end makes it a BigInt.\n\n---\n\n### 8. The `typeof` Operator\n\n<b>`typeof`</b> (an operator that tells you the type of a value) can be used to check a value's type.\n\n```javascript\ntypeof \"Hello\";     // \"string\"\ntypeof 42;          // \"number\"\ntypeof true;        // \"boolean\"\ntypeof undefined;   // \"undefined\"\ntypeof 123n;        // \"bigint\"\ntypeof Symbol();    // \"symbol\"\n```\n\nThere is one famous JavaScript mistake:\n\n```javascript\ntypeof null; // \"object\"\n```\n\n`null` is actually a primitive, but `typeof null` returns `\"object\"` because of an old JavaScript bug that cannot be changed without breaking existing code.",
        np: "<b>Primitive</b> (object नभएको साधारण value) JavaScript का आधारभूत value type मध्ये एक हो।\n\nJavaScript मा <b>8 primitive type</b> छन्:\n\n```text\nstring\nnumber\nboolean\nnull\nundefined\nsymbol\nbigint\n```\n\nबाँकी सबै <b>object</b> (थप data वा behavior राख्न सक्ने value) हो।\n\n---\n\n### 1. `string`\n\n<b>String</b> (text) शब्द र अक्षरका लागि प्रयोग हुन्छ।\n\n```javascript\nconst name = \"Rajan\";\nconst message = \"Hello\";\n```\n\n---\n\n### 2. `number`\n\n<b>Number</b> (संख्यात्मक value) integer र decimal का लागि प्रयोग हुन्छ।\n\n```javascript\nconst age = 30;\nconst price = 99.99;\n```\n\nJavaScript ले दुबैका लागि उही `number` type प्रयोग गर्छ।\n\n---\n\n### 3. `boolean`\n\n<b>Boolean</b> (true वा false value) का दुई मात्र सम्भावित value हुन्छन्:\n\n```javascript\ntrue\nfalse\n```\n\nउदाहरण:\n\n```javascript\nconst isLoggedIn = true;\nconst isAdmin = false;\n```\n\n---\n\n### 4. `null`\n\n<b>`null`</b> (जानाजानी कुनै value नराख्नु) को अर्थ developer ले जानाजानी यो भन्नु हो:\n\n> \"अहिले कुनै value छैन।\"\n\n```javascript\nconst user = null;\n```\n\n---\n\n### 5. `undefined`\n\n<b>`undefined`</b> (अझै कुनै value assign गरिएको छैन) को अर्थ सामान्यतया value सेट नै गरिएको छैन भन्ने हो।\n\n```javascript\nlet name;\n\nconsole.log(name); // undefined\n```\n\n---\n\n### 6. `symbol`\n\n<b>Symbol</b> (सधैं अद्वितीय हुने value) मुख्यतया unique identifier चाहिने बेला प्रयोग हुन्छ।\n\n```javascript\nconst id = Symbol(\"id\");\n```\n\nदुई Symbol सधैं फरक हुन्छन्:\n\n```javascript\nSymbol(\"id\") === Symbol(\"id\"); // false\n```\n\n---\n\n### 7. `bigint`\n\n<b>BigInt</b> (धेरै ठूला integer का लागि number type) JavaScript को safe `number` सीमा भन्दा ठूला संख्याका लागि प्रयोग हुन्छ।\n\n```javascript\nconst bigNumber = 123456789012345678901234567890n;\n```\n\nअन्तको `n` ले यसलाई BigInt बनाउँछ।\n\n---\n\n### 8. `typeof` Operator\n\n<b>`typeof`</b> (value को type बताउने operator) ले value को type जाँच्न प्रयोग गर्न सकिन्छ।\n\n```javascript\ntypeof \"Hello\";     // \"string\"\ntypeof 42;          // \"number\"\ntypeof true;        // \"boolean\"\ntypeof undefined;   // \"undefined\"\ntypeof 123n;        // \"bigint\"\ntypeof Symbol();    // \"symbol\"\n```\n\nJavaScript को एउटा प्रसिद्ध गल्ती छ:\n\n```javascript\ntypeof null; // \"object\"\n```\n\n`null` वास्तवमा primitive हो, तर पुरानो JavaScript bug ले `typeof null` ले `\"object\"` फर्काउँछ, जो अवस्थित code नभाँचिकन बदल्न सकिँदैन।",
        jp: "<b>プリミティブ</b>（オブジェクトではない単純な値）は、JavaScriptの基本的な値の型の1つです。\n\nJavaScriptには<b>8つのプリミティブ型</b>があります:\n\n```text\nstring\nnumber\nboolean\nnull\nundefined\nsymbol\nbigint\n```\n\nそれ以外はすべて<b>オブジェクト</b>（より多くのデータや振る舞いを持てる値）です。\n\n---\n\n### 1. `string`\n\n<b>文字列（String）</b>（テキスト）は単語や文字に使います。\n\n```javascript\nconst name = \"Rajan\";\nconst message = \"Hello\";\n```\n\n---\n\n### 2. `number`\n\n<b>数値（Number）</b>は整数と小数に使います。\n\n```javascript\nconst age = 30;\nconst price = 99.99;\n```\n\nJavaScriptはどちらにも同じ `number` 型を使います。\n\n---\n\n### 3. `boolean`\n\n<b>真偽値（Boolean）</b>（trueかfalse）が取りうる値は2つだけです:\n\n```javascript\ntrue\nfalse\n```\n\n例:\n\n```javascript\nconst isLoggedIn = true;\nconst isAdmin = false;\n```\n\n---\n\n### 4. `null`\n\n<b>`null`</b>（意図的に値がない）は、開発者が意図してこう言っている状態です:\n\n> 「現在、値はありません。」\n\n```javascript\nconst user = null;\n```\n\n---\n\n### 5. `undefined`\n\n<b>`undefined`</b>（まだ値が代入されていない）は、通常まだ値が設定されていないことを意味します。\n\n```javascript\nlet name;\n\nconsole.log(name); // undefined\n```\n\n---\n\n### 6. `symbol`\n\n<b>シンボル（Symbol）</b>（必ず一意になる値）は、主に一意の識別子が必要なときに使います。\n\n```javascript\nconst id = Symbol(\"id\");\n```\n\n2つのSymbolは常に別物です:\n\n```javascript\nSymbol(\"id\") === Symbol(\"id\"); // false\n```\n\n---\n\n### 7. `bigint`\n\n<b>BigInt</b>（非常に大きな整数のための数値型）は、JavaScriptの安全な `number` の限界を超える数に使います。\n\n```javascript\nconst bigNumber = 123456789012345678901234567890n;\n```\n\n末尾の `n` がBigIntにします。\n\n---\n\n### 8. `typeof` 演算子\n\n<b>`typeof`</b>（値の型を教えてくれる演算子）で値の型を調べられます。\n\n```javascript\ntypeof \"Hello\";     // \"string\"\ntypeof 42;          // \"number\"\ntypeof true;        // \"boolean\"\ntypeof undefined;   // \"undefined\"\ntypeof 123n;        // \"bigint\"\ntypeof Symbol();    // \"symbol\"\n```\n\nJavaScriptには有名な間違いが1つあります:\n\n```javascript\ntypeof null; // \"object\"\n```\n\n`null` は実際にはプリミティブですが、既存のコードを壊さずには変えられない古いJavaScriptのバグのため、`typeof null` は `\"object\"` を返します。",
      },
      diagram: `                    JavaScript Values
                           |
              +------------+------------+
              |                         |
          Primitives                 Objects
              |                         |
    +---------+---------+               |
    |         |         |               |
  string   number   boolean          Array
    |         |         |             Function
   null   undefined   symbol          Date
             |         |              ...
           bigint`,
      codeExample: {
        title: { en: "All eight primitives with typeof", np: "आठै primitive typeof सहित", jp: "8つのプリミティブとtypeof" },
        code: `const name = "Rajan";       // string
const age = 30;             // number
const isActive = true;      // boolean
const user = null;          // null
let address;                // undefined
const id = Symbol("id");    // symbol
const big = 1234567890123n; // bigint

console.log(typeof name);      // "string"
console.log(typeof age);       // "number"
console.log(typeof isActive);  // "boolean"
console.log(typeof user);      // "object"
console.log(typeof address);   // "undefined"
console.log(typeof id);        // "symbol"
console.log(typeof big);       // "bigint"`,
      },
      keyTakeaways: [
        { en: "JavaScript has <b>8 primitive types</b>.", np: "JavaScript मा <b>8 primitive type</b> छन्।", jp: "JavaScriptには<b>8つのプリミティブ型</b>がある。" },
        { en: "`string` → text.", np: "`string` → text।", jp: "`string` → テキスト。" },
        { en: "`number` → numbers and decimals.", np: "`number` → संख्या र decimal।", jp: "`number` → 数値と小数。" },
        { en: "`boolean` → `true` or `false`.", np: "`boolean` → `true` वा `false`।", jp: "`boolean` → `true` か `false`。" },
        { en: "`null` → intentionally no value.", np: "`null` → जानाजानी कुनै value छैन।", jp: "`null` → 意図的に値がない。" },
        { en: "`undefined` → value hasn't been assigned.", np: "`undefined` → value assign गरिएको छैन।", jp: "`undefined` → 値が代入されていない。" },
        { en: "`symbol` → unique identifier.", np: "`symbol` → unique identifier।", jp: "`symbol` → 一意の識別子。" },
        { en: "`bigint` → very large integers.", np: "`bigint` → धेरै ठूला integer।", jp: "`bigint` → 非常に大きな整数。" },
        { en: "Everything else is an <b>object</b>.", np: "बाँकी सबै <b>object</b> हो।", jp: "それ以外はすべて<b>オブジェクト</b>。" },
        { en: "`typeof null` returns `\"object\"` because of a historical JavaScript bug.", np: "पुरानो JavaScript bug का कारण `typeof null` ले `\"object\"` फर्काउँछ।", jp: "歴史的なJavaScriptのバグにより `typeof null` は `\"object\"` を返す。" },
      ],
      commonMistakes: [
        { en: "<b>Confusing `null` and `undefined`</b> — `let a;` is `undefined` (\"no value was assigned\"), while `let b = null;` is intentionally no value.", np: "<b>`null` र `undefined` भ्रममा पार्नु</b> — `let a;` `undefined` हो (\"कुनै value assign भएको छैन\"), जब कि `let b = null;` जानाजानी कुनै value नराखेको हो।", jp: "<b>`null` と `undefined` を混同する</b> — `let a;` は `undefined`（「値が代入されていない」）、`let b = null;` は意図的に値がない状態。" },
        { en: "<b>Thinking arrays are primitives</b> — `typeof [1, 2, 3]` is `\"object\"`. Arrays are objects.", np: "<b>Array primitive हो भन्ने ठान्नु</b> — `typeof [1, 2, 3]` `\"object\"` हो। Array object हुन्।", jp: "<b>配列をプリミティブだと思う</b> — `typeof [1, 2, 3]` は `\"object\"`。配列はオブジェクト。" },
        { en: "<b>Being surprised by `typeof null`</b> — it returns `\"object\"`, but `null` is still a primitive; `typeof` reports it incorrectly.", np: "<b>`typeof null` देखेर अचम्म पर्नु</b> — यो `\"object\"` फर्काउँछ, तर `null` अझै primitive हो; `typeof` ले गलत रिपोर्ट गर्छ।", jp: "<b>`typeof null` に驚く</b> — `\"object\"` を返すが `null` はプリミティブのまま。`typeof` の報告が誤っている。" },
      ],
      quiz: [
        {
          question: { en: "How many primitive types does JavaScript have?", np: "JavaScript मा कति primitive type छन्?", jp: "JavaScriptのプリミティブ型はいくつあるか?" },
          options: [
            { en: "5", np: "5", jp: "5" },
            { en: "7", np: "7", jp: "7" },
            { en: "8", np: "8", jp: "8" },
          ],
          correctIndex: 2,
          explanation: { en: "There are 8: string, number, boolean, null, undefined, symbol and bigint.", np: "8 छन्: string, number, boolean, null, undefined, symbol र bigint।", jp: "8つ: string、number、boolean、null、undefined、symbol、bigint。" },
        },
        {
          question: { en: "What does `null` mean?", np: "`null` को अर्थ के हो?", jp: "`null` は何を意味するか?" },
          options: [
            { en: "A value was never created", np: "Value कहिल्यै बनेको थिएन", jp: "値が作られたことがない" },
            { en: "Intentionally no value", np: "जानाजानी कुनै value छैन", jp: "意図的に値がない" },
            { en: "An error", np: "एउटा error", jp: "エラー" },
          ],
          correctIndex: 1,
          explanation: { en: "`null` is the developer saying \"there is currently no value\", unlike `undefined`, which means nothing was assigned yet.", np: "`null` भनेको developer ले \"अहिले कुनै value छैन\" भन्नु हो, `undefined` भन्दा फरक, जसको अर्थ अझै केही assign गरिएको छैन।", jp: "`null` は開発者が「現在値がない」と示すもの。まだ何も代入されていない `undefined` とは異なる。" },
        },
        {
          question: { en: "What is the type of `42`?", np: "`42` को type के हो?", jp: "`42` の型は?" },
          options: [
            { en: "`string`", np: "`string`", jp: "`string`" },
            { en: "`number`", np: "`number`", jp: "`number`" },
            { en: "`bigint`", np: "`bigint`", jp: "`bigint`" },
          ],
          correctIndex: 1,
          explanation: { en: "JavaScript uses `number` for both integers and decimals; `bigint` is only for values beyond the safe number limit.", np: "JavaScript ले integer र decimal दुबैका लागि `number` प्रयोग गर्छ; `bigint` safe number सीमा नाघेका value का लागि मात्र हो।", jp: "JavaScriptは整数も小数も `number` を使う。`bigint` は安全な数値の限界を超える値のためだけ。" },
        },
        {
          question: { en: "What does `typeof null` return?", np: "`typeof null` ले के फर्काउँछ?", jp: "`typeof null` は何を返すか?" },
          options: [
            { en: "`\"null\"`", np: "`\"null\"`", jp: "`\"null\"`" },
            { en: "`\"undefined\"`", np: "`\"undefined\"`", jp: "`\"undefined\"`" },
            { en: "`\"object\"`", np: "`\"object\"`", jp: "`\"object\"`" },
          ],
          correctIndex: 2,
          explanation: { en: "It returns `\"object\"` because of an old JavaScript bug that cannot be fixed without breaking existing code.", np: "पुरानो JavaScript bug का कारण यो `\"object\"` फर्काउँछ, जो अवस्थित code नभाँचिकन ठीक गर्न सकिँदैन।", jp: "既存のコードを壊さずには直せない古いJavaScriptのバグのため `\"object\"` を返す。" },
        },
      ],
    },
    {
      id: "hoisting",
      title: { en: "Hoisting", np: "Hoisting", jp: "ホイスティング" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Hoisting</b> (JavaScript registering variables and functions before running the code) happens before your code starts executing.\n\nJavaScript roughly has two phases:\n\n1. <b>Creation phase</b> (JavaScript prepares variables and functions)\n2. <b>Execution phase</b> (JavaScript runs the code from top to bottom)\n\nThink of it like a restaurant reading the entire order before starting to cook. The kitchen already knows what is coming.\n\n---\n\n### 1. Function Declarations\n\n<b>Function declarations</b> (functions created with the `function` keyword) are completely hoisted.\n\nYou can call the function before it appears in the code:\n\n```javascript\nsayHello();\n\nfunction sayHello() {\n  console.log(\"Hello\");\n}\n```\n\nThis works because JavaScript already knows about the function during the creation phase.\n\n---\n\n### 2. `var`\n\n<b>`var`</b> (an older way to create variables) is hoisted and automatically given `undefined` (a value meaning nothing has been assigned yet).\n\n```javascript\nconsole.log(age); // undefined\n\nvar age = 30;\n```\n\nJavaScript roughly treats it like:\n\n```javascript\nvar age;\n\nconsole.log(age); // undefined\n\nage = 30;\n```\n\nThe declaration is hoisted, but the value is not.\n\n---\n\n### 3. `let` and `const`\n\n<b>`let`</b> and <b>`const`</b> are also hoisted, but they cannot be accessed before their declaration.\n\nThe time between entering the scope and reaching the declaration is called the <b>Temporal Dead Zone (TDZ)</b> (the period where `let` or `const` exists but cannot be used yet).\n\n```javascript\nconsole.log(age); // ReferenceError\n\nlet age = 30;\n```\n\nThe same happens with `const`:\n\n```javascript\nconsole.log(name); // ReferenceError\n\nconst name = \"Rajan\";\n```",
        np: "<b>Hoisting</b> (JavaScript ले code चलाउनुअघि variable र function दर्ता गर्नु) तपाईंको code चल्न सुरु हुनुअघि हुन्छ।\n\nJavaScript मा मोटामोटी दुई phase हुन्छन्:\n\n1. <b>Creation phase</b> (JavaScript ले variable र function तयार गर्छ)\n2. <b>Execution phase</b> (JavaScript ले code माथिबाट तल चलाउँछ)\n\nयसलाई restaurant ले पकाउन सुरु गर्नुअघि पूरै order पढेको जस्तै सोच्नुहोस्। Kitchen लाई के आउँदै छ पहिले नै थाहा हुन्छ।\n\n---\n\n### 1. Function Declarations\n\n<b>Function declaration</b> (`function` keyword ले बनाइएका function) पूर्ण रूपमा hoist हुन्छन्।\n\nतपाईं function code मा देखिनुअघि नै यसलाई call गर्न सक्नुहुन्छ:\n\n```javascript\nsayHello();\n\nfunction sayHello() {\n  console.log(\"Hello\");\n}\n```\n\nयो काम गर्छ किनकि creation phase मा JavaScript लाई function बारे पहिले नै थाहा हुन्छ।\n\n---\n\n### 2. `var`\n\n<b>`var`</b> (variable बनाउने पुरानो तरिका) hoist हुन्छ र स्वतः `undefined` (केही assign गरिएको छैन भन्ने अर्थ दिने value) पाउँछ।\n\n```javascript\nconsole.log(age); // undefined\n\nvar age = 30;\n```\n\nJavaScript ले यसलाई मोटामोटी यसो व्यवहार गर्छ:\n\n```javascript\nvar age;\n\nconsole.log(age); // undefined\n\nage = 30;\n```\n\nDeclaration hoist हुन्छ, तर value हुँदैन।\n\n---\n\n### 3. `let` र `const`\n\n<b>`let`</b> र <b>`const`</b> पनि hoist हुन्छन्, तर declaration अघि तिनलाई पहुँच गर्न सकिँदैन।\n\nScope भित्र प्रवेश गरेदेखि declaration पुग्नेसम्मको समयलाई <b>Temporal Dead Zone (TDZ)</b> (`let` वा `const` अस्तित्वमा छ तर अझै प्रयोग गर्न नमिल्ने अवधि) भनिन्छ।\n\n```javascript\nconsole.log(age); // ReferenceError\n\nlet age = 30;\n```\n\n`const` सँग पनि उही हुन्छ:\n\n```javascript\nconsole.log(name); // ReferenceError\n\nconst name = \"Rajan\";\n```",
        jp: "<b>ホイスティング</b>（JavaScriptがコードを実行する前に変数と関数を登録すること）は、コードが動き出す前に起こります。\n\nJavaScriptにはおおまかに2つのフェーズがあります:\n\n1. <b>作成フェーズ</b>（JavaScriptが変数と関数を準備する）\n2. <b>実行フェーズ</b>（JavaScriptがコードを上から下へ実行する）\n\nレストランが料理を始める前に注文全体を読むのに似ています。厨房は何が来るかをすでに知っています。\n\n---\n\n### 1. 関数宣言\n\n<b>関数宣言</b>（`function` キーワードで作る関数）は完全にホイスティングされます。\n\nコード上に現れる前に関数を呼び出せます:\n\n```javascript\nsayHello();\n\nfunction sayHello() {\n  console.log(\"Hello\");\n}\n```\n\n作成フェーズの時点でJavaScriptがその関数を知っているので、これは動きます。\n\n---\n\n### 2. `var`\n\n<b>`var`</b>（変数を作る古い方法）はホイスティングされ、自動的に `undefined`（まだ何も代入されていないことを意味する値）が入ります。\n\n```javascript\nconsole.log(age); // undefined\n\nvar age = 30;\n```\n\nJavaScriptはおおよそこう扱います:\n\n```javascript\nvar age;\n\nconsole.log(age); // undefined\n\nage = 30;\n```\n\n宣言はホイスティングされますが、値はされません。\n\n---\n\n### 3. `let` と `const`\n\n<b>`let`</b> と <b>`const`</b> もホイスティングされますが、宣言より前にアクセスすることはできません。\n\nスコープに入ってから宣言に到達するまでの期間を<b>一時的デッドゾーン（TDZ）</b>（`let` や `const` は存在するがまだ使えない期間）と呼びます。\n\n```javascript\nconsole.log(age); // ReferenceError\n\nlet age = 30;\n```\n\n`const` でも同じです:\n\n```javascript\nconsole.log(name); // ReferenceError\n\nconst name = \"Rajan\";\n```",
      },
      diagram: `              JavaScript starts
                     |
                     ↓
              Creation Phase
         (prepare variables/functions)
                     |
          +----------+----------+
          |          |          |
       function     var      let/const
          |          |          |
      Full body   undefined     TDZ
          |          |          |
          +----------+----------+
                     |
                     ↓
              Execution Phase
           (run code top to bottom)`,
      codeExample: {
        title: { en: "Hoisting behaviour of each declaration", np: "हरेक declaration को hoisting व्यवहार", jp: "宣言ごとのホイスティングの挙動" },
        code: `// Function declaration
sayHello();

function sayHello() {
  console.log("Hello");
}

// var
console.log(age); // undefined

var age = 30;

// let
console.log(name); // ReferenceError

let name = "Rajan";`,
      },
      keyTakeaways: [
        { en: "<b>Hoisting</b> → JavaScript prepares declarations before execution.", np: "<b>Hoisting</b> → JavaScript ले execution अघि declaration तयार गर्छ।", jp: "<b>ホイスティング</b> → JavaScriptは実行前に宣言を準備する。" },
        { en: "<b>Creation phase</b> → variables and functions are prepared.", np: "<b>Creation phase</b> → variable र function तयार गरिन्छन्।", jp: "<b>作成フェーズ</b> → 変数と関数が準備される。" },
        { en: "<b>Execution phase</b> → code runs from top to bottom.", np: "<b>Execution phase</b> → code माथिबाट तल चल्छ।", jp: "<b>実行フェーズ</b> → コードが上から下へ実行される。" },
        { en: "<b>Function declarations</b> → fully hoisted.", np: "<b>Function declaration</b> → पूर्ण रूपमा hoist हुन्छन्।", jp: "<b>関数宣言</b> → 完全にホイスティングされる。" },
        { en: "<b>`var`</b> → hoisted with `undefined`.", np: "<b>`var`</b> → `undefined` सँग hoist हुन्छ।", jp: "<b>`var`</b> → `undefined` の状態でホイスティングされる。" },
        { en: "<b>`let` / `const`</b> → hoisted but stay in the <b>TDZ</b>.", np: "<b>`let` / `const`</b> → hoist हुन्छन् तर <b>TDZ</b> मा रहन्छन्।", jp: "<b>`let` / `const`</b> → ホイスティングされるが<b>TDZ</b>に留まる。" },
        { en: "Accessing `let` or `const` before declaration causes a `ReferenceError`.", np: "Declaration अघि `let` वा `const` पहुँच गर्दा `ReferenceError` आउँछ।", jp: "宣言前に `let` や `const` にアクセスすると `ReferenceError` になる。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking `var` gets its value during hoisting</b> — `console.log(age)` before `var age = 30;` logs `undefined`. Only the declaration is hoisted, not the value.", np: "<b>Hoisting मा `var` ले value पाउँछ भन्ने ठान्नु</b> — `var age = 30;` अघि `console.log(age)` ले `undefined` देखाउँछ। Declaration मात्र hoist हुन्छ, value होइन।", jp: "<b>ホイスティングで `var` に値が入ると思う</b> — `var age = 30;` の前の `console.log(age)` は `undefined` を出す。ホイスティングされるのは宣言だけで値ではない。" },
        { en: "<b>Thinking `let` and `const` are not hoisted</b> — they are, but they remain in the <b>TDZ</b> until their declaration is reached, so `console.log(age)` before `let age = 30;` throws a `ReferenceError`.", np: "<b>`let` र `const` hoist हुँदैनन् भन्ने ठान्नु</b> — हुन्छन्, तर declaration पुग्नेसम्म <b>TDZ</b> मा रहन्छन्, त्यसैले `let age = 30;` अघि `console.log(age)` ले `ReferenceError` दिन्छ।", jp: "<b>`let` と `const` はホイスティングされないと思う</b> — されるが宣言に到達するまで<b>TDZ</b>に留まるので、`let age = 30;` の前の `console.log(age)` は `ReferenceError` を投げる。" },
        { en: "<b>Confusing function declarations with function expressions</b> — calling `sayHello()` above `function sayHello() {}` works, but above `var sayHello = function () {}` throws a `TypeError`: the `var` is hoisted as `undefined` and the function value is assigned only when execution reaches that line.", np: "<b>Function declaration र function expression भ्रममा पार्नु</b> — `function sayHello() {}` माथि `sayHello()` call गर्दा काम गर्छ, तर `var sayHello = function () {}` माथि `TypeError` दिन्छ: `var` `undefined` भई hoist हुन्छ र function value execution त्यो line मा पुगेपछि मात्र assign हुन्छ।", jp: "<b>関数宣言と関数式を混同する</b> — `function sayHello() {}` より前の `sayHello()` は動くが、`var sayHello = function () {}` より前では `TypeError` になる。`var` は `undefined` としてホイスティングされ、関数の値は実行がその行に達したときに初めて代入される。" },
      ],
      quiz: [
        {
          question: { en: "What is hoisting?", np: "Hoisting के हो?", jp: "ホイスティングとは何か?" },
          options: [
            { en: "Moving code to the top of the file", np: "Code लाई file को सबैभन्दा माथि सार्नु", jp: "コードをファイルの先頭に移動すること" },
            { en: "Preparing declarations before execution", np: "Execution अघि declaration तयार गर्नु", jp: "実行前に宣言を準備すること" },
            { en: "Running code twice", np: "Code दुई पटक चलाउनु", jp: "コードを2回実行すること" },
          ],
          correctIndex: 1,
          explanation: { en: "Nothing physically moves — JavaScript registers declarations during the creation phase, before executing the code.", np: "कुनै चीज भौतिक रूपमा सर्दैन — JavaScript ले code चलाउनुअघि creation phase मा declaration दर्ता गर्छ।", jp: "実際に移動するものはない — JavaScriptはコード実行前の作成フェーズで宣言を登録する。" },
        },
        {
          question: { en: "What happens to `var` during hoisting?", np: "Hoisting मा `var` लाई के हुन्छ?", jp: "ホイスティングのとき `var` はどうなるか?" },
          options: [
            { en: "It gets its final value", np: "यसले आफ्नो अन्तिम value पाउँछ", jp: "最終的な値が入る" },
            { en: "It becomes `undefined`", np: "यो `undefined` बन्छ", jp: "`undefined` になる" },
            { en: "It is ignored", np: "यसलाई बेवास्ता गरिन्छ", jp: "無視される" },
          ],
          correctIndex: 1,
          explanation: { en: "The declaration is hoisted and initialised to `undefined`; the assignment happens only when execution reaches that line.", np: "Declaration hoist भई `undefined` मा initialise हुन्छ; assignment execution त्यो line मा पुगेपछि मात्र हुन्छ।", jp: "宣言がホイスティングされ `undefined` で初期化される。代入は実行がその行に達したときだけ起こる。" },
        },
        {
          question: { en: "What happens when you access `let` before its declaration?", np: "Declaration अघि `let` पहुँच गर्दा के हुन्छ?", jp: "宣言より前に `let` にアクセスするとどうなるか?" },
          options: [
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
            { en: "`null`", np: "`null`", jp: "`null`" },
            { en: "`ReferenceError`", np: "`ReferenceError`", jp: "`ReferenceError`" },
          ],
          correctIndex: 2,
          explanation: { en: "`let` is hoisted but sits in the Temporal Dead Zone until its declaration is reached, so reading it early throws a `ReferenceError`.", np: "`let` hoist हुन्छ तर declaration पुग्नेसम्म Temporal Dead Zone मा रहन्छ, त्यसैले चाँडै पढ्दा `ReferenceError` आउँछ।", jp: "`let` はホイスティングされるが宣言に到達するまで一時的デッドゾーンにあるため、早く読むと `ReferenceError` を投げる。" },
        },
        {
          question: { en: "Which is fully hoisted?", np: "कुन पूर्ण रूपमा hoist हुन्छ?", jp: "完全にホイスティングされるのはどれか?" },
          options: [
            { en: "`var`", np: "`var`", jp: "`var`" },
            { en: "Function declaration", np: "Function declaration", jp: "関数宣言" },
            { en: "`const`", np: "`const`", jp: "`const`" },
          ],
          correctIndex: 1,
          explanation: { en: "A function declaration is hoisted with its whole body, which is why it can be called before it appears in the code.", np: "Function declaration आफ्नो पूरै body सँग hoist हुन्छ, त्यसैले यसलाई code मा देखिनुअघि call गर्न सकिन्छ।", jp: "関数宣言は本体ごとホイスティングされるので、コード上に現れる前に呼び出せる。" },
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
