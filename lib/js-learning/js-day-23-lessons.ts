import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_23_LESSONS: JsLessonDay = {
  day: 23,
  title: { en: "Generators, iterators & async generators", np: "Generators, iterators र async generators", jp: "ジェネレータ・イテレータ" },
  totalMinutes: 27,
  difficulty: { en: "Advanced", np: "Advanced", jp: "上級" },
  lessons: [
    {
      id: "generator-functions",
      title: { en: "Generator Functions", np: "Generator Functions", jp: "ジェネレータ関数" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>generator function</b> is a special function that can <b>pause its execution and resume later</b>. It is declared with `function*`:\n\n```javascript\nfunction* numbers() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\n```\n\nCalling a generator function <b>does not execute its body</b>. It returns a <b>generator object</b>:\n\n```javascript\nconst gen = numbers();\n\nconsole.log(gen); // Generator {}\n```\n\nThe body starts running only when `.next()` is called:\n\n```javascript\nconsole.log(gen.next()); // { value: 1, done: false }\nconsole.log(gen.next()); // { value: 2, done: false }\nconsole.log(gen.next()); // { value: 3, done: false }\nconsole.log(gen.next()); // { value: undefined, done: true }\n```\n\nThink of a generator as a pause button for a function:\n\n```text\nfunction*\n   │\n   ▼\ngenerator object\n   │\n   ├── next() → run → yield 1 → PAUSE\n   │\n   ├── next() → resume → yield 2 → PAUSE\n   │\n   ├── next() → resume → yield 3 → PAUSE\n   │\n   └── next() → finish → done: true\n```\n\nThe important idea is that the generator <b>remembers where it stopped</b>, including its local variables.\n\n---\n\n### 1. Basic — pause and resume\n\n```javascript\nfunction* greet() {\n  console.log(\"Hello\");\n\n  yield;\n\n  console.log(\"World\");\n}\n\nconst gen = greet();\n\nconsole.log(\"Start\");\n\ngen.next();\n\nconsole.log(\"Middle\");\n\ngen.next();\n\nconsole.log(\"End\");\n```\n\nOutput:\n\n```text\nStart\nHello\nMiddle\nWorld\nEnd\n```\n\nThe first `.next()` runs until `yield`. The second resumes <b>exactly where the generator stopped</b>.\n\n---\n\n### 2. Intermediate — generating values lazily\n\nGenerators shine when you do not want every value in memory at once.\n\n```javascript\nfunction* numbers() {\n  let number = 1;\n\n  while (true) {\n    yield number;\n    number++;\n  }\n}\n\nconst gen = numbers();\n\nconsole.log(gen.next().value); // 1\nconsole.log(gen.next().value); // 2\nconsole.log(gen.next().value); // 3\n```\n\nThe generator is technically infinite, but it never builds an infinite array. It calculates the <b>next value only when asked</b>:\n\n```text\nRequest value\n      ↓\n   next()\n      ↓\ncalculate one value\n      ↓\n    yield\n      ↓\n    pause\n```\n\nThis is <b>lazy evaluation</b>.\n\n---\n\n### 3. Advanced — `for...of` calls `next()` for you\n\nGenerators are iterable, so `for...of` works directly:\n\n```javascript\nfunction* colors() {\n  yield \"red\";\n  yield \"green\";\n  yield \"blue\";\n}\n\nfor (const color of colors()) {\n  console.log(color);\n}\n```\n\nOutput:\n\n```text\nred\ngreen\nblue\n```\n\n`for...of` keeps calling `next()` until `done === true`. Spread does the same:\n\n```javascript\nfunction* numbers() {\n  yield 10;\n  yield 20;\n  yield 30;\n}\n\nconst values = [...numbers()];\n\nconsole.log(values); // [10, 20, 30]\n```\n\n---\n\n### 4. Advanced — sending values back in\n\nGenerators communicate <b>in both directions</b>. A value passed to `.next(value)` becomes the result of the paused `yield` expression.\n\n```javascript\nfunction* calculator() {\n  const a = yield \"Enter first number\";\n  const b = yield \"Enter second number\";\n\n  return a + b;\n}\n\nconst calc = calculator();\n\nconsole.log(calc.next().value);   // \"Enter first number\"\nconsole.log(calc.next(10).value); // \"Enter second number\"\nconsole.log(calc.next(20));       // { value: 30, done: true }\n```\n\n```text\ngenerator\n   │\n   │ yield\n   ▼\ncaller\n   │\n   │ next(10)\n   ▼\ngenerator receives 10\n   │\n   │ yield\n   ▼\ncaller\n   │\n   │ next(20)\n   ▼\ngenerator receives 20\n   │\n   ▼\nreturn 30\n```\n\nThe caller can feed data back into a paused function. That is one of the more powerful things generators do.\n\n---\n\n### `yield` vs `return`\n\nThey are not the same:\n\n```javascript\nfunction* example() {\n  yield 1;\n  yield 2;\n  return 3;\n}\n```\n\n```javascript\nconst gen = example();\n\nconsole.log(gen.next()); // { value: 1, done: false }\nconsole.log(gen.next()); // { value: 2, done: false }\nconsole.log(gen.next()); // { value: 3, done: true }\n```\n\n```text\nyield  → value + done: false → pause\nreturn → value + done: true  → finish\n```\n\nAn important consequence:\n\n```javascript\nfunction* example() {\n  yield 1;\n  return 2;\n  yield 3;\n}\n\nconsole.log([...example()]); // [1]\n```\n\n`for...of` and spread consume <b>yielded</b> values, not the final `return` value, and both stop as soon as `done` becomes `true`.\n\n---\n\n### Generator vs normal function\n\n```text\n                            Normal function     Generator\nDeclaration                 function            function*\nCalling it                  executes now        returns a generator\nPause execution             no                  yes, with yield\nResume execution            no                  yes, with .next()\nProduces multiple values    no                  yes\nLazy values                 no                  yes\nIterable                    no                  yes\nKeeps execution state       no                  yes\n```",
        np: "<b>Generator function</b> त्यस्तो विशेष function हो जसले <b>आफ्नो execution रोक्न र पछि पुनः सुरु गर्न</b> सक्छ। यो `function*` ले घोषणा गरिन्छ:\n\n```javascript\nfunction* numbers() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\n```\n\nGenerator function बोलाउँदा <b>यसको body चल्दैन</b>। यसले <b>generator object</b> फर्काउँछ:\n\n```javascript\nconst gen = numbers();\n\nconsole.log(gen); // Generator {}\n```\n\n`.next()` बोलाएपछि मात्र body चल्न सुरु हुन्छ:\n\n```javascript\nconsole.log(gen.next()); // { value: 1, done: false }\nconsole.log(gen.next()); // { value: 2, done: false }\nconsole.log(gen.next()); // { value: 3, done: false }\nconsole.log(gen.next()); // { value: undefined, done: true }\n```\n\nGenerator लाई function को pause बटन ठान्नुहोस्:\n\n```text\nfunction*\n   │\n   ▼\ngenerator object\n   │\n   ├── next() → run → yield 1 → PAUSE\n   │\n   ├── next() → resume → yield 2 → PAUSE\n   │\n   ├── next() → resume → yield 3 → PAUSE\n   │\n   └── next() → finish → done: true\n```\n\nमुख्य कुरा — generator ले <b>कहाँ रोकिएको थियो सम्झन्छ</b>, आफ्ना local variable सहित।\n\n---\n\n### 1. आधारभूत — रोक्नु र पुनः सुरु गर्नु\n\n```javascript\nfunction* greet() {\n  console.log(\"Hello\");\n\n  yield;\n\n  console.log(\"World\");\n}\n\nconst gen = greet();\n\nconsole.log(\"Start\");\n\ngen.next();\n\nconsole.log(\"Middle\");\n\ngen.next();\n\nconsole.log(\"End\");\n```\n\nOutput:\n\n```text\nStart\nHello\nMiddle\nWorld\nEnd\n```\n\nपहिलो `.next()` `yield` सम्म चल्छ। दोस्रोले <b>ठ्याक्कै रोकिएकै ठाउँबाट</b> जारी राख्छ।\n\n---\n\n### 2. मध्यम — मान अल्छी तरिकाले बनाउनु\n\nहरेक मान एकैचोटि memory मा नचाहिँदा generator उपयोगी हुन्छ।\n\n```javascript\nfunction* numbers() {\n  let number = 1;\n\n  while (true) {\n    yield number;\n    number++;\n  }\n}\n\nconst gen = numbers();\n\nconsole.log(gen.next().value); // 1\nconsole.log(gen.next().value); // 2\nconsole.log(gen.next().value); // 3\n```\n\nGenerator प्राविधिक रूपमा अनन्त छ, तर यसले अनन्त array कहिल्यै बनाउँदैन। यसले <b>मागेको बेला मात्र अर्को मान</b> गणना गर्छ:\n\n```text\nRequest value\n      ↓\n   next()\n      ↓\ncalculate one value\n      ↓\n    yield\n      ↓\n    pause\n```\n\nयसलाई <b>lazy evaluation</b> भनिन्छ।\n\n---\n\n### 3. उन्नत — `for...of` ले `next()` आफैं बोलाउँछ\n\nGenerator iterable हुन्, त्यसैले `for...of` सिधै काम गर्छ:\n\n```javascript\nfunction* colors() {\n  yield \"red\";\n  yield \"green\";\n  yield \"blue\";\n}\n\nfor (const color of colors()) {\n  console.log(color);\n}\n```\n\nOutput:\n\n```text\nred\ngreen\nblue\n```\n\n`for...of` ले `done === true` नहुन्जेल `next()` बोलाइरहन्छ। Spread ले पनि उही गर्छ:\n\n```javascript\nfunction* numbers() {\n  yield 10;\n  yield 20;\n  yield 30;\n}\n\nconst values = [...numbers()];\n\nconsole.log(values); // [10, 20, 30]\n```\n\n---\n\n### 4. उन्नत — भित्र मान पठाउनु\n\nGenerator ले <b>दुबै दिशामा</b> कुरा गर्छ। `.next(value)` मा दिइएको मान रोकिएको `yield` expression को नतिजा बन्छ।\n\n```javascript\nfunction* calculator() {\n  const a = yield \"Enter first number\";\n  const b = yield \"Enter second number\";\n\n  return a + b;\n}\n\nconst calc = calculator();\n\nconsole.log(calc.next().value);   // \"Enter first number\"\nconsole.log(calc.next(10).value); // \"Enter second number\"\nconsole.log(calc.next(20));       // { value: 30, done: true }\n```\n\n```text\ngenerator\n   │\n   │ yield\n   ▼\ncaller\n   │\n   │ next(10)\n   ▼\ngenerator receives 10\n   │\n   │ yield\n   ▼\ncaller\n   │\n   │ next(20)\n   ▼\ngenerator receives 20\n   │\n   ▼\nreturn 30\n```\n\nCaller ले रोकिएको function भित्र data खुवाउन सक्छ। यो generator को शक्तिशाली विशेषता हो।\n\n---\n\n### `yield` vs `return`\n\nयी उस्तै होइनन्:\n\n```javascript\nfunction* example() {\n  yield 1;\n  yield 2;\n  return 3;\n}\n```\n\n```javascript\nconst gen = example();\n\nconsole.log(gen.next()); // { value: 1, done: false }\nconsole.log(gen.next()); // { value: 2, done: false }\nconsole.log(gen.next()); // { value: 3, done: true }\n```\n\n```text\nyield  → value + done: false → pause\nreturn → value + done: true  → finish\n```\n\nमहत्वपूर्ण परिणाम:\n\n```javascript\nfunction* example() {\n  yield 1;\n  return 2;\n  yield 3;\n}\n\nconsole.log([...example()]); // [1]\n```\n\n`for...of` र spread ले <b>yield भएका</b> मान खपत गर्छन्, अन्तिम `return` मान होइन, र `done` `true` हुनासाथ रोकिन्छन्।\n\n---\n\n### Generator vs सामान्य function\n\n```text\n                            सामान्य function    Generator\nघोषणा                       function            function*\nबोलाउँदा                    अहिल्यै चल्छ         generator फर्काउँछ\nExecution रोक्ने            सक्दैन              सक्छ, yield ले\nExecution पुनः सुरु          सक्दैन              सक्छ, .next() ले\nधेरै मान दिने               दिँदैन              दिन्छ\nअल्छी मान                   छैन                 छ\nIterable                    होइन                हो\nExecution अवस्था राख्ने     राख्दैन             राख्छ\n```",
        jp: "<b>ジェネレータ関数</b>は、<b>実行を一時停止して後で再開できる</b>特別な関数です。`function*` で宣言します:\n\n```javascript\nfunction* numbers() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\n```\n\nジェネレータ関数を呼んでも<b>本体は実行されません</b>。返るのは<b>ジェネレータオブジェクト</b>です:\n\n```javascript\nconst gen = numbers();\n\nconsole.log(gen); // Generator {}\n```\n\n本体が動き出すのは `.next()` を呼んだときです:\n\n```javascript\nconsole.log(gen.next()); // { value: 1, done: false }\nconsole.log(gen.next()); // { value: 2, done: false }\nconsole.log(gen.next()); // { value: 3, done: false }\nconsole.log(gen.next()); // { value: undefined, done: true }\n```\n\n関数の一時停止ボタンだと考えてください:\n\n```text\nfunction*\n   │\n   ▼\ngenerator object\n   │\n   ├── next() → run → yield 1 → PAUSE\n   │\n   ├── next() → resume → yield 2 → PAUSE\n   │\n   ├── next() → resume → yield 3 → PAUSE\n   │\n   └── next() → finish → done: true\n```\n\n肝心なのは、ジェネレータが<b>どこで止まったか</b>をローカル変数ごと覚えていることです。\n\n---\n\n### 1. 基本 — 止めて再開する\n\n```javascript\nfunction* greet() {\n  console.log(\"Hello\");\n\n  yield;\n\n  console.log(\"World\");\n}\n\nconst gen = greet();\n\nconsole.log(\"Start\");\n\ngen.next();\n\nconsole.log(\"Middle\");\n\ngen.next();\n\nconsole.log(\"End\");\n```\n\n出力:\n\n```text\nStart\nHello\nMiddle\nWorld\nEnd\n```\n\n最初の `.next()` は `yield` まで走り、2回目は<b>止まったその場所から</b>再開します。\n\n---\n\n### 2. 中級 — 値を遅延生成する\n\nすべての値を一度にメモリへ載せたくないとき、ジェネレータが活きます。\n\n```javascript\nfunction* numbers() {\n  let number = 1;\n\n  while (true) {\n    yield number;\n    number++;\n  }\n}\n\nconst gen = numbers();\n\nconsole.log(gen.next().value); // 1\nconsole.log(gen.next().value); // 2\nconsole.log(gen.next().value); // 3\n```\n\n理屈の上では無限ですが、無限の配列は作りません。<b>求められたときだけ次の値</b>を計算します:\n\n```text\nRequest value\n      ↓\n   next()\n      ↓\ncalculate one value\n      ↓\n    yield\n      ↓\n    pause\n```\n\nこれが<b>遅延評価</b>です。\n\n---\n\n### 3. 上級 — `for...of` が `next()` を呼ぶ\n\nジェネレータはイテラブルなので `for...of` がそのまま使えます:\n\n```javascript\nfunction* colors() {\n  yield \"red\";\n  yield \"green\";\n  yield \"blue\";\n}\n\nfor (const color of colors()) {\n  console.log(color);\n}\n```\n\n出力:\n\n```text\nred\ngreen\nblue\n```\n\n`for...of` は `done === true` になるまで `next()` を呼び続けます。スプレッドも同じです:\n\n```javascript\nfunction* numbers() {\n  yield 10;\n  yield 20;\n  yield 30;\n}\n\nconst values = [...numbers()];\n\nconsole.log(values); // [10, 20, 30]\n```\n\n---\n\n### 4. 上級 — 値を送り返す\n\nジェネレータは<b>双方向</b>にやり取りできます。`.next(value)` に渡した値が、停止中の `yield` 式の結果になります。\n\n```javascript\nfunction* calculator() {\n  const a = yield \"Enter first number\";\n  const b = yield \"Enter second number\";\n\n  return a + b;\n}\n\nconst calc = calculator();\n\nconsole.log(calc.next().value);   // \"Enter first number\"\nconsole.log(calc.next(10).value); // \"Enter second number\"\nconsole.log(calc.next(20));       // { value: 30, done: true }\n```\n\n```text\ngenerator\n   │\n   │ yield\n   ▼\ncaller\n   │\n   │ next(10)\n   ▼\ngenerator receives 10\n   │\n   │ yield\n   ▼\ncaller\n   │\n   │ next(20)\n   ▼\ngenerator receives 20\n   │\n   ▼\nreturn 30\n```\n\n呼び出し側が停止中の関数へデータを流し込めます。ジェネレータの強力な点のひとつです。\n\n---\n\n### `yield` と `return`\n\n同じではありません:\n\n```javascript\nfunction* example() {\n  yield 1;\n  yield 2;\n  return 3;\n}\n```\n\n```javascript\nconst gen = example();\n\nconsole.log(gen.next()); // { value: 1, done: false }\nconsole.log(gen.next()); // { value: 2, done: false }\nconsole.log(gen.next()); // { value: 3, done: true }\n```\n\n```text\nyield  → value + done: false → pause\nreturn → value + done: true  → finish\n```\n\n重要な帰結:\n\n```javascript\nfunction* example() {\n  yield 1;\n  return 2;\n  yield 3;\n}\n\nconsole.log([...example()]); // [1]\n```\n\n`for...of` とスプレッドが取り込むのは<b>yieldされた</b>値であって最後の `return` 値ではなく、`done` が `true` になった時点で止まります。\n\n---\n\n### ジェネレータと通常の関数\n\n```text\n                            通常の関数          ジェネレータ\n宣言                        function            function*\n呼び出し                    すぐ実行            ジェネレータを返す\n一時停止                    できない            できる（yield）\n再開                        できない            できる（.next()）\n複数の値を返す              できない            できる\n遅延した値                  ない                ある\nイテラブル                  いいえ              はい\n実行状態の保持              しない              する\n```",
      },
      diagram: `Generator Function

function* count() {
    yield 1;
    yield 2;
    yield 3;
}

        │
        │ count()
        ▼

┌──────────────────────┐
│   Generator Object   │
└──────────────────────┘
        │
        │ .next()
        ▼
┌──────────────────────┐
│ value: 1             │
│ done: false          │
└──────────────────────┘
        │
        │ .next()
        ▼
┌──────────────────────┐
│ value: 2             │
│ done: false          │
└──────────────────────┘
        │
        │ .next()
        ▼
┌──────────────────────┐
│ value: 3             │
│ done: false          │
└──────────────────────┘
        │
        │ .next()
        ▼
┌──────────────────────┐
│ value: undefined     │
│ done: true           │
└──────────────────────┘


Values flow both ways

generator                caller
   │                        │
   │ yield ────────────────►│
   │                        │
   │◄──────────── next(10)  │
   │                        │
   │ yield ────────────────►│
   │                        │
   │◄──────────── next(20)  │
   │                        │
   ▼
return 30`,
      codeExample: {
        title: { en: "A function with a pause button", np: "Pause बटन भएको function", jp: "一時停止ボタンのある関数" },
        code: `// ── 1. Basic — calling it does not run it ─────────────────────────
function* greet() {
  console.log("Hello");
  yield;              // pauses here, keeping its place
  console.log("World");
}

const gen = greet();
gen.next(); // Hello
gen.next(); // World

// ── 2. Intermediate — an infinite sequence that costs nothing ─────
function* numbers() {
  let number = 1;
  while (true) {
    yield number; // one value per next(), never an infinite array
    number++;
  }
}

const counter = numbers();
counter.next().value; // 1
counter.next().value; // 2

// ── 3. Advanced — for...of and spread call next() for you ─────────
function* colors() {
  yield "red";
  yield "green";
  yield "blue";
}

for (const color of colors()) console.log(color);

const list = [...colors()]; // ["red", "green", "blue"]

// ── 4. Advanced — the caller can send values back in ──────────────
function* calculator() {
  const a = yield "Enter first number"; // next(10) makes this 10
  const b = yield "Enter second number";
  return a + b;
}

const calc = calculator();
calc.next();     // { value: "Enter first number", done: false }
calc.next(10);   // { value: "Enter second number", done: false }
calc.next(20);   // { value: 30, done: true }

// ── yield pauses, return finishes ─────────────────────────────────
function* mixed() {
  yield 1;
  return 2; // done: true, so consumers stop here
  yield 3;  // never reached
}

console.log([...mixed()]); // [1] — the return value is not yielded

// ── Bound an infinite generator yourself ──────────────────────────
const ids = numbers();
const firstFive = [];
for (let i = 0; i < 5; i++) firstFive.push(ids.next().value);
// [...numbers()] would never finish`,
      },
      keyTakeaways: [
        { en: "`function*` creates a <b>generator function</b>; calling it returns a generator object without running the body.", np: "`function*` ले <b>generator function</b> बनाउँछ; बोलाउँदा body नचलाई generator object फर्काउँछ।", jp: "`function*` は<b>ジェネレータ関数</b>を作る。呼んでも本体は動かず、ジェネレータオブジェクトが返る。" },
        { en: "<b>`.next()`</b> starts or resumes execution and returns `{ value, done }`.", np: "<b>`.next()`</b> ले execution सुरु वा पुनः सुरु गर्छ र `{ value, done }` फर्काउँछ।", jp: "<b>`.next()`</b> が実行を開始・再開し、`{ value, done }` を返す。" },
        { en: "<b>`yield`</b> produces a value and <b>pauses</b>; the generator keeps its local variables and position.", np: "<b>`yield`</b> ले मान दिन्छ र <b>रोक्छ</b>; generator ले आफ्ना local variable र स्थान राख्छ।", jp: "<b>`yield`</b> は値を出して<b>一時停止</b>する。ローカル変数と位置は保持される。" },
        { en: "`.next(value)` sends data <b>back into</b> the generator as the result of the paused `yield`.", np: "`.next(value)` ले रोकिएको `yield` को नतिजाका रूपमा generator <b>भित्र</b> data पठाउँछ।", jp: "`.next(value)` は停止中の `yield` の結果として、データを<b>ジェネレータ側へ</b>送る。" },
        { en: "`return` finishes the generator with `done: true`; `for...of` and spread ignore that final value.", np: "`return` ले `done: true` सहित generator टुंग्याउँछ; `for...of` र spread ले त्यो अन्तिम मान बेवास्ता गर्छन्।", jp: "`return` は `done: true` で終了させる。`for...of` とスプレッドはその最終値を取り込まない。" },
        { en: "Generators are both <b>iterators and iterables</b>, so `for...of` and `[...gen]` consume them directly.", np: "Generator <b>iterator र iterable दुबै</b> हुन्, त्यसैले `for...of` र `[...gen]` ले सिधै खपत गर्छन्।", jp: "ジェネレータは<b>イテレータでもイテラブルでもある</b>ので、`for...of` や `[...gen]` がそのまま消費する。" },
        { en: "Lazy evaluation makes generators fit <b>large datasets and infinite sequences</b> — but only when consumption is bounded too.", np: "Lazy evaluation ले generator लाई <b>ठूलो dataset र अनन्त क्रम</b> का लागि उपयुक्त बनाउँछ — तर खपत पनि सीमित हुँदा मात्र।", jp: "遅延評価により<b>大きなデータや無限列</b>に向く。ただし消費側も有界である場合に限る。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking calling the generator runs it</b> — `test();` on a generator that logs prints nothing. The body starts only at the first `.next()`.", np: "<b>Generator बोलाउँदा चल्छ भन्ने ठान्नु</b> — log गर्ने generator मा `test();` ले केही देखाउँदैन। Body पहिलो `.next()` मा मात्र सुरु हुन्छ।", jp: "<b>呼べば実行されると思う</b> — ログを出すジェネレータでも `test();` は何も表示しない。本体は最初の `.next()` で動き出す。" },
        { en: "<b>Treating `yield` like `return`</b> — after `yield 1` the generator is <b>paused</b>, not finished; `gen.next()` gives `{ value: 1, done: false }`.", np: "<b>`yield` लाई `return` जस्तो ठान्नु</b> — `yield 1` पछि generator <b>रोकिएको</b> हुन्छ, सकिएको होइन; `gen.next()` ले `{ value: 1, done: false }` दिन्छ।", jp: "<b>`yield` を `return` と同じに扱う</b> — `yield 1` の後は<b>一時停止</b>であって終了ではない。`gen.next()` は `{ value: 1, done: false }`。" },
        { en: "<b>Spreading an infinite generator</b> — `[...numbers()]` on a `while (true)` generator never finishes. Pull a fixed number of values with `.next()` instead.", np: "<b>अनन्त generator मा spread गर्नु</b> — `while (true)` भएको generator मा `[...numbers()]` कहिल्यै सकिँदैन। बरु `.next()` ले तोकिएको संख्यामा मान झिक्नुहोस्।", jp: "<b>無限ジェネレータをスプレッドする</b> — `while (true)` のジェネレータに `[...numbers()]` は終わらない。`.next()` で必要な個数だけ取り出す。" },
        { en: "<b>Expecting the `return` value from a spread</b> — for `yield 1; return 2;`, `[...example()]` is `[1]`, not `[1, 2]`.", np: "<b>Spread बाट `return` को मान अपेक्षा गर्नु</b> — `yield 1; return 2;` का लागि `[...example()]` `[1]` हो, `[1, 2]` होइन।", jp: "<b>スプレッドで `return` 値が得られると思う</b> — `yield 1; return 2;` なら `[...example()]` は `[1]` で `[1, 2]` ではない。" },
      ],
      quiz: [
        {
          question: { en: "What happens when you call a generator function?", np: "Generator function बोलाउँदा के हुन्छ?", jp: "ジェネレータ関数を呼ぶと何が起きるか?" },
          options: [
            { en: "It immediately executes the whole function", np: "यसले तुरुन्तै पूरै function चलाउँछ", jp: "関数全体がすぐに実行される" },
            { en: "It returns a generator object without running the body", np: "Body नचलाई generator object फर्काउँछ", jp: "本体を実行せずジェネレータオブジェクトが返る" },
            { en: "It returns a Promise", np: "यसले Promise फर्काउँछ", jp: "Promiseが返る" },
            { en: "It returns an array", np: "यसले array फर्काउँछ", jp: "配列が返る" },
          ],
          correctIndex: 1,
          explanation: { en: "The body starts only when `.next()` is called.", np: "`.next()` बोलाएपछि मात्र body सुरु हुन्छ।", jp: "本体は `.next()` を呼んで初めて動き出す。" },
        },
        {
          question: { en: "What does `yield` do?", np: "`yield` ले के गर्छ?", jp: "`yield` は何をするか?" },
          options: [
            { en: "Permanently terminates the function", np: "Function लाई सधैंका लागि टुंग्याउँछ", jp: "関数を完全に終了させる" },
            { en: "Creates a Promise", np: "Promise बनाउँछ", jp: "Promiseを作る" },
            { en: "Produces a value and pauses the generator", np: "मान दिन्छ र generator रोक्छ", jp: "値を出してジェネレータを一時停止する" },
            { en: "Restarts the generator", np: "Generator फेरि सुरु गर्छ", jp: "ジェネレータを再スタートする" },
          ],
          correctIndex: 2,
          explanation: { en: "`return` is what finishes it, with `done: true`.", np: "`done: true` सहित टुंग्याउने चाहिँ `return` हो।", jp: "終了させるのは `return` で、`done: true` になる。" },
        },
        {
          question: { en: "For `function* numbers() { yield 10; yield 20; }`, what does the third `gen.next()` return?", np: "`function* numbers() { yield 10; yield 20; }` मा तेस्रो `gen.next()` ले के फर्काउँछ?", jp: "`function* numbers() { yield 10; yield 20; }` で3回目の `gen.next()` は何を返すか?" },
          options: [
            { en: "`{ value: 20, done: true }`", np: "`{ value: 20, done: true }`", jp: "`{ value: 20, done: true }`" },
            { en: "It throws an error", np: "यसले error दिन्छ", jp: "エラーを投げる" },
            { en: "`{ value: undefined, done: false }`", np: "`{ value: undefined, done: false }`", jp: "`{ value: undefined, done: false }`" },
            { en: "`{ value: undefined, done: true }`", np: "`{ value: undefined, done: true }`", jp: "`{ value: undefined, done: true }`" },
          ],
          correctIndex: 3,
          explanation: { en: "Calling `.next()` on an exhausted generator keeps returning that same result.", np: "सकिएको generator मा `.next()` बोलाउँदा उही नतिजा फर्किरहन्छ।", jp: "使い切ったジェネレータで `.next()` を呼ぶと、同じ結果が返り続ける。" },
        },
        {
          question: { en: "Why can a `while (true)` generator safely represent an infinite sequence?", np: "`while (true)` भएको generator ले अनन्त क्रम किन सुरक्षित रूपमा जनाउन सक्छ?", jp: "`while (true)` のジェネレータが無限列を安全に表せるのはなぜか?" },
          options: [
            { en: "It produces the next value only when `.next()` asks for one", np: "`.next()` ले मागेको बेला मात्र यसले अर्को मान बनाउँछ", jp: "`.next()` が求めたときだけ次の値を作るから" },
            { en: "JavaScript caps generators at 1000 values", np: "JavaScript ले generator लाई 1000 मानमा सीमित गर्छ", jp: "JavaScriptがジェネレータを1000個に制限するから" },
            { en: "The loop is optimised away by the engine", np: "Engine ले loop हटाइदिन्छ", jp: "エンジンがループを最適化で消すから" },
          ],
          correctIndex: 0,
          explanation: { en: "It is only safe while the consumer is bounded too — `[...gen]` would hang.", np: "खपत गर्ने पनि सीमित हुँदा मात्र सुरक्षित छ — `[...gen]` अड्किन्छ।", jp: "消費側も有界な場合に限り安全。`[...gen]` は止まらなくなる。" },
        },
        {
          question: { en: "What does `next(100)` do when the generator is paused at a `yield`?", np: "Generator `yield` मा रोकिएको बेला `next(100)` ले के गर्छ?", jp: "ジェネレータが `yield` で停止中に `next(100)` は何をするか?" },
          options: [
            { en: "Stops the generator", np: "Generator रोक्छ", jp: "ジェネレータを止める" },
            { en: "Makes `100` the result of the paused `yield` expression", np: "`100` लाई रोकिएको `yield` expression को नतिजा बनाउँछ", jp: "`100` を停止中の `yield` 式の結果にする" },
            { en: "Restarts it from the beginning", np: "यसलाई सुरुदेखि फेरि चलाउँछ", jp: "最初から再スタートさせる" },
            { en: "Adds `100` to the return value", np: "Return मानमा `100` जोड्छ", jp: "戻り値に `100` を足す" },
          ],
          correctIndex: 1,
          explanation: { en: "That is how a caller feeds data into a paused function.", np: "यसै गरी caller ले रोकिएको function मा data खुवाउँछ।", jp: "こうして呼び出し側が停止中の関数へデータを渡す。" },
        },
      ],
    },
    {
      id: "iterators-protocol",
      title: { en: "Iterators & the Iterator Protocol", np: "Iterators र Iterator Protocol", jp: "イテレータとイテレータプロトコル" },
      durationMinutes: 9,
      explanation: {
        en: "An <b>iterator</b> is an object that knows how to produce values <b>one at a time</b>. It follows a small standard contract called the <b>iterator protocol</b>.\n\nThere are two related concepts:\n\n• <b>Iterable</b> — an object that can produce an iterator through `[Symbol.iterator]()`\n• <b>Iterator</b> — an object with a `.next()` method that returns `{ value, done }`\n\nThink of the iterable as a <b>book</b> and the iterator as your <b>bookmark</b>. The book holds all the values; the bookmark remembers where you are.\n\n```text\nIterable\n   │\n   │ [Symbol.iterator]()\n   ▼\nIterator\n   │\n   │ .next()\n   ▼\n{ value, done }\n```\n\n---\n\n### The iterator protocol\n\nAn iterator only needs a `next()` method:\n\n```javascript\nconst iterator = {\n  next() {\n    return {\n      value: \"Hello\",\n      done: false\n    };\n  }\n};\n\nconsole.log(iterator.next()); // { value: \"Hello\", done: false }\n```\n\nThe `done` property tells JavaScript whether iteration has finished:\n\n```text\ndone: false → there is another value\ndone: true  → iteration is finished\n```\n\nA real iterator changes its state on every call:\n\n```javascript\nconst iterator = {\n  count: 0,\n\n  next() {\n    this.count++;\n\n    if (this.count <= 3) {\n      return { value: this.count, done: false };\n    }\n\n    return { value: undefined, done: true };\n  }\n};\n```\n\n```text\n{ value: 1, done: false }\n{ value: 2, done: false }\n{ value: 3, done: false }\n{ value: undefined, done: true }\n```\n\n---\n\n### Iterable vs iterator\n\nThese are <b>not the same thing</b>. An iterable provides `[Symbol.iterator]()`:\n\n```javascript\nconst numbers = [10, 20, 30];\n\nconsole.log(typeof numbers[Symbol.iterator]); // \"function\"\n```\n\nCalling it gives you an iterator:\n\n```javascript\nconst iterator = numbers[Symbol.iterator]();\n\nconsole.log(iterator.next()); // { value: 10, done: false }\nconsole.log(iterator.next()); // { value: 20, done: false }\nconsole.log(iterator.next()); // { value: 30, done: false }\nconsole.log(iterator.next()); // { value: undefined, done: true }\n```\n\n```text\nArray\n  │\n  │ [Symbol.iterator]()\n  ▼\nIterator\n  │\n  ├── next() → 10\n  ├── next() → 20\n  ├── next() → 30\n  └── next() → done\n```\n\n---\n\n### 1. Basic — consume an iterator by hand\n\n```javascript\nconst numbers = [10, 20, 30];\n\nconst iterator = numbers[Symbol.iterator]();\n\nconsole.log(iterator.next().value); // 10\nconsole.log(iterator.next().value); // 20\nconsole.log(iterator.next().value); // 30\n```\n\nEvery call to `.next()` advances the iterator.\n\n---\n\n### 2. Intermediate — `for...of` uses the protocol\n\nYou normally never call `.next()` yourself:\n\n```javascript\nconst numbers = [10, 20, 30];\n\nfor (const number of numbers) {\n  console.log(number);\n}\n```\n\nConceptually, JavaScript does something close to:\n\n```javascript\nconst iterator = numbers[Symbol.iterator]();\n\nlet step = iterator.next();\n\nwhile (!step.done) {\n  console.log(step.value);\n  step = iterator.next();\n}\n```\n\nThat is why `for...of` works with any correctly implemented iterable.\n\n---\n\n### 3. Advanced — create your own iterable\n\n```javascript\nconst countdown = {\n  start: 3,\n\n  [Symbol.iterator]() {\n    let current = this.start;\n\n    return {\n      next() {\n        if (current > 0) {\n          return { value: current--, done: false };\n        }\n\n        return { value: undefined, done: true };\n      }\n    };\n  }\n};\n\nfor (const number of countdown) {\n  console.log(number);\n}\n```\n\nOutput:\n\n```text\n3\n2\n1\n```\n\nThe object becomes <b>iterable</b> purely because it provides `[Symbol.iterator]()`.\n\n---\n\n### 4. Advanced — let a generator implement the protocol\n\nThe manual iterator above is verbose. A generator method does the same thing far more cleanly:\n\n```javascript\nconst countdown = {\n  start: 3,\n\n  *[Symbol.iterator]() {\n    for (let i = this.start; i > 0; i--) {\n      yield i;\n    }\n  }\n};\n\nfor (const number of countdown) {\n  console.log(number);\n}\n```\n\nThe generator handles all of this for you:\n\n```text\n[Symbol.iterator]()\n        ↓\n     iterator\n        ↓\n      next()\n        ↓\n     yield\n        ↓\n   { value, done }\n```\n\n---\n\n### Built-in iterables\n\nMany JavaScript values already implement the protocol:\n\n```javascript\nconst array = [1, 2, 3];\nconst string = \"hello\";\nconst set = new Set([1, 2, 3]);\nconst map = new Map([\n  [\"name\", \"Rajan\"],\n  [\"age\", 30]\n]);\n```\n\nAll of them work with `for...of`, because all of them provide `[Symbol.iterator]()`.\n\n---\n\n### What else consumes iterables\n\nThe protocol powers more than `for...of`:\n\n```javascript\nconst copy = [...numbers];              // spread\n\nconst [first, second] = [10, 20, 30];   // destructuring\n\nfor (const value of numbers) {}         // for...of\n```\n\nEach of these pulls values from the iterable through its iterator.\n\n```text\nIterable      needs [Symbol.iterator]()   example: Array\nIterator      needs .next()               example: array iterator\nGenerator     provides both automatically  example: function*\nfor...of      consumes iterables          Arrays, Sets, Maps\nspread ...    consumes iterables          [...set]\n```\n\n> <b>Iterable gives you an iterator; the iterator gives you values through `.next()`.</b>",
        np: "<b>Iterator</b> त्यस्तो object हो जसले <b>एक-एक गरी</b> मान दिन जान्दछ। यसले <b>iterator protocol</b> भनिने सानो मानक सम्झौता पछ्याउँछ।\n\nदुई सम्बन्धित अवधारणा छन्:\n\n• <b>Iterable</b> — `[Symbol.iterator]()` मार्फत iterator दिन सक्ने object\n• <b>Iterator</b> — `{ value, done }` फर्काउने `.next()` method भएको object\n\nIterable लाई <b>किताब</b> र iterator लाई <b>bookmark</b> ठान्नुहोस्। किताबमा सबै मान हुन्छन्; bookmark ले तपाईं कहाँ हुनुहुन्छ सम्झन्छ।\n\n```text\nIterable\n   │\n   │ [Symbol.iterator]()\n   ▼\nIterator\n   │\n   │ .next()\n   ▼\n{ value, done }\n```\n\n---\n\n### Iterator protocol\n\nIterator लाई `next()` method मात्र चाहिन्छ:\n\n```javascript\nconst iterator = {\n  next() {\n    return {\n      value: \"Hello\",\n      done: false\n    };\n  }\n};\n\nconsole.log(iterator.next()); // { value: \"Hello\", done: false }\n```\n\n`done` property ले iteration सकियो कि सकिएन बताउँछ:\n\n```text\ndone: false → अर्को मान छ\ndone: true  → iteration सकियो\n```\n\nवास्तविक iterator ले हरेक call मा आफ्नो अवस्था बदल्छ:\n\n```javascript\nconst iterator = {\n  count: 0,\n\n  next() {\n    this.count++;\n\n    if (this.count <= 3) {\n      return { value: this.count, done: false };\n    }\n\n    return { value: undefined, done: true };\n  }\n};\n```\n\n```text\n{ value: 1, done: false }\n{ value: 2, done: false }\n{ value: 3, done: false }\n{ value: undefined, done: true }\n```\n\n---\n\n### Iterable vs iterator\n\nयी <b>उस्तै होइनन्</b>। Iterable ले `[Symbol.iterator]()` दिन्छ:\n\n```javascript\nconst numbers = [10, 20, 30];\n\nconsole.log(typeof numbers[Symbol.iterator]); // \"function\"\n```\n\nयसलाई बोलाउँदा iterator पाइन्छ:\n\n```javascript\nconst iterator = numbers[Symbol.iterator]();\n\nconsole.log(iterator.next()); // { value: 10, done: false }\nconsole.log(iterator.next()); // { value: 20, done: false }\nconsole.log(iterator.next()); // { value: 30, done: false }\nconsole.log(iterator.next()); // { value: undefined, done: true }\n```\n\n```text\nArray\n  │\n  │ [Symbol.iterator]()\n  ▼\nIterator\n  │\n  ├── next() → 10\n  ├── next() → 20\n  ├── next() → 30\n  └── next() → done\n```\n\n---\n\n### 1. आधारभूत — हातले iterator खपत गर्नु\n\n```javascript\nconst numbers = [10, 20, 30];\n\nconst iterator = numbers[Symbol.iterator]();\n\nconsole.log(iterator.next().value); // 10\nconsole.log(iterator.next().value); // 20\nconsole.log(iterator.next().value); // 30\n```\n\n`.next()` को हरेक call ले iterator अघि बढाउँछ।\n\n---\n\n### 2. मध्यम — `for...of` ले यही protocol प्रयोग गर्छ\n\nसामान्यतया तपाईंले आफैं `.next()` बोलाउनुपर्दैन:\n\n```javascript\nconst numbers = [10, 20, 30];\n\nfor (const number of numbers) {\n  console.log(number);\n}\n```\n\nअवधारणागत रूपमा JavaScript ले यस्तै गर्छ:\n\n```javascript\nconst iterator = numbers[Symbol.iterator]();\n\nlet step = iterator.next();\n\nwhile (!step.done) {\n  console.log(step.value);\n  step = iterator.next();\n}\n```\n\nत्यसैले `for...of` सही ढंगले लागू गरिएको जुनसुकै iterable सँग काम गर्छ।\n\n---\n\n### 3. उन्नत — आफ्नै iterable बनाउनु\n\n```javascript\nconst countdown = {\n  start: 3,\n\n  [Symbol.iterator]() {\n    let current = this.start;\n\n    return {\n      next() {\n        if (current > 0) {\n          return { value: current--, done: false };\n        }\n\n        return { value: undefined, done: true };\n      }\n    };\n  }\n};\n\nfor (const number of countdown) {\n  console.log(number);\n}\n```\n\nOutput:\n\n```text\n3\n2\n1\n```\n\nObject <b>iterable</b> बन्यो किनकि यसले `[Symbol.iterator]()` दिन्छ।\n\n---\n\n### 4. उन्नत — generator ले protocol लागू गर्नु\n\nमाथिको हाते iterator लामो छ। Generator method ले उही काम धेरै सफा तरिकाले गर्छ:\n\n```javascript\nconst countdown = {\n  start: 3,\n\n  *[Symbol.iterator]() {\n    for (let i = this.start; i > 0; i--) {\n      yield i;\n    }\n  }\n};\n\nfor (const number of countdown) {\n  console.log(number);\n}\n```\n\nGenerator ले यो सबै आफैं सम्हाल्छ:\n\n```text\n[Symbol.iterator]()\n        ↓\n     iterator\n        ↓\n      next()\n        ↓\n     yield\n        ↓\n   { value, done }\n```\n\n---\n\n### भित्रैका iterable\n\nधेरै JavaScript मानले यो protocol पहिले नै लागू गरेका छन्:\n\n```javascript\nconst array = [1, 2, 3];\nconst string = \"hello\";\nconst set = new Set([1, 2, 3]);\nconst map = new Map([\n  [\"name\", \"Rajan\"],\n  [\"age\", 30]\n]);\n```\n\nयी सबै `for...of` सँग काम गर्छन्, किनकि सबैले `[Symbol.iterator]()` दिन्छन्।\n\n---\n\n### अरू के-के ले iterable खपत गर्छन्\n\nयो protocol ले `for...of` भन्दा धेरै कुरा चलाउँछ:\n\n```javascript\nconst copy = [...numbers];              // spread\n\nconst [first, second] = [10, 20, 30];   // destructuring\n\nfor (const value of numbers) {}         // for...of\n```\n\nयी सबैले iterable बाट यसको iterator मार्फत मान झिक्छन्।\n\n```text\nIterable      `[Symbol.iterator]()` चाहिन्छ   उदाहरण: Array\nIterator      `.next()` चाहिन्छ              उदाहरण: array iterator\nGenerator     दुबै आफैं दिन्छ                उदाहरण: function*\nfor...of      iterable खपत गर्छ              Array, Set, Map\nspread ...    iterable खपत गर्छ              [...set]\n```\n\n> <b>Iterable ले iterator दिन्छ; iterator ले `.next()` मार्फत मान दिन्छ।</b>",
        jp: "<b>イテレータ</b>は、値を<b>1つずつ</b>取り出す方法を知っているオブジェクトです。<b>イテレータプロトコル</b>という小さな取り決めに従います。\n\n関連する2つの概念があります:\n\n• <b>イテラブル</b> — `[Symbol.iterator]()` でイテレータを作れるオブジェクト\n• <b>イテレータ</b> — `{ value, done }` を返す `.next()` を持つオブジェクト\n\nイテラブルを<b>本</b>、イテレータを<b>しおり</b>と考えてください。本が値を持ち、しおりが今どこかを覚えています。\n\n```text\nIterable\n   │\n   │ [Symbol.iterator]()\n   ▼\nIterator\n   │\n   │ .next()\n   ▼\n{ value, done }\n```\n\n---\n\n### イテレータプロトコル\n\nイテレータに必要なのは `next()` だけです:\n\n```javascript\nconst iterator = {\n  next() {\n    return {\n      value: \"Hello\",\n      done: false\n    };\n  }\n};\n\nconsole.log(iterator.next()); // { value: \"Hello\", done: false }\n```\n\n`done` が反復の終了を伝えます:\n\n```text\ndone: false → まだ値がある\ndone: true  → 反復は終わった\n```\n\n実際のイテレータは呼ばれるたびに状態を進めます:\n\n```javascript\nconst iterator = {\n  count: 0,\n\n  next() {\n    this.count++;\n\n    if (this.count <= 3) {\n      return { value: this.count, done: false };\n    }\n\n    return { value: undefined, done: true };\n  }\n};\n```\n\n```text\n{ value: 1, done: false }\n{ value: 2, done: false }\n{ value: 3, done: false }\n{ value: undefined, done: true }\n```\n\n---\n\n### イテラブルとイテレータ\n\nこの2つは<b>別物</b>です。イテラブルは `[Symbol.iterator]()` を提供します:\n\n```javascript\nconst numbers = [10, 20, 30];\n\nconsole.log(typeof numbers[Symbol.iterator]); // \"function\"\n```\n\n呼び出すとイテレータが得られます:\n\n```javascript\nconst iterator = numbers[Symbol.iterator]();\n\nconsole.log(iterator.next()); // { value: 10, done: false }\nconsole.log(iterator.next()); // { value: 20, done: false }\nconsole.log(iterator.next()); // { value: 30, done: false }\nconsole.log(iterator.next()); // { value: undefined, done: true }\n```\n\n```text\nArray\n  │\n  │ [Symbol.iterator]()\n  ▼\nIterator\n  │\n  ├── next() → 10\n  ├── next() → 20\n  ├── next() → 30\n  └── next() → done\n```\n\n---\n\n### 1. 基本 — 手でイテレータを進める\n\n```javascript\nconst numbers = [10, 20, 30];\n\nconst iterator = numbers[Symbol.iterator]();\n\nconsole.log(iterator.next().value); // 10\nconsole.log(iterator.next().value); // 20\nconsole.log(iterator.next().value); // 30\n```\n\n`.next()` を呼ぶたびにイテレータが進みます。\n\n---\n\n### 2. 中級 — `for...of` はこのプロトコルを使う\n\n普段は自分で `.next()` を呼びません:\n\n```javascript\nconst numbers = [10, 20, 30];\n\nfor (const number of numbers) {\n  console.log(number);\n}\n```\n\n概念的には、JavaScriptはこれに近いことをしています:\n\n```javascript\nconst iterator = numbers[Symbol.iterator]();\n\nlet step = iterator.next();\n\nwhile (!step.done) {\n  console.log(step.value);\n  step = iterator.next();\n}\n```\n\nだから `for...of` は、正しく実装されたどんなイテラブルでも動きます。\n\n---\n\n### 3. 上級 — 自分でイテラブルを作る\n\n```javascript\nconst countdown = {\n  start: 3,\n\n  [Symbol.iterator]() {\n    let current = this.start;\n\n    return {\n      next() {\n        if (current > 0) {\n          return { value: current--, done: false };\n        }\n\n        return { value: undefined, done: true };\n      }\n    };\n  }\n};\n\nfor (const number of countdown) {\n  console.log(number);\n}\n```\n\n出力:\n\n```text\n3\n2\n1\n```\n\n`[Symbol.iterator]()` を提供しているという理由だけで、このオブジェクトは<b>イテラブル</b>になります。\n\n---\n\n### 4. 上級 — ジェネレータにプロトコルを任せる\n\n上の手書きイテレータは冗長です。ジェネレータメソッドなら同じことをずっと簡潔に書けます:\n\n```javascript\nconst countdown = {\n  start: 3,\n\n  *[Symbol.iterator]() {\n    for (let i = this.start; i > 0; i--) {\n      yield i;\n    }\n  }\n};\n\nfor (const number of countdown) {\n  console.log(number);\n}\n```\n\nジェネレータがこれを全部引き受けます:\n\n```text\n[Symbol.iterator]()\n        ↓\n     iterator\n        ↓\n      next()\n        ↓\n     yield\n        ↓\n   { value, done }\n```\n\n---\n\n### 組み込みのイテラブル\n\n多くのJavaScriptの値はすでにこのプロトコルを実装しています:\n\n```javascript\nconst array = [1, 2, 3];\nconst string = \"hello\";\nconst set = new Set([1, 2, 3]);\nconst map = new Map([\n  [\"name\", \"Rajan\"],\n  [\"age\", 30]\n]);\n```\n\nいずれも `[Symbol.iterator]()` を持つので `for...of` で動きます。\n\n---\n\n### イテラブルを消費するもの\n\nこのプロトコルは `for...of` 以外も支えています:\n\n```javascript\nconst copy = [...numbers];              // スプレッド\n\nconst [first, second] = [10, 20, 30];   // 分割代入\n\nfor (const value of numbers) {}         // for...of\n```\n\nどれもイテレータ経由でイテラブルから値を引き出します。\n\n```text\nイテラブル    `[Symbol.iterator]()` が必要   例: 配列\nイテレータ    `.next()` が必要              例: 配列のイテレータ\nジェネレータ  両方を自動で提供              例: function*\nfor...of      イテラブルを消費              配列・Set・Map\nスプレッド    イテラブルを消費              [...set]\n```\n\n> <b>イテラブルがイテレータを渡し、イテレータが `.next()` で値を渡す。</b>",
      },
      diagram: `Iterable
   │
   │ [Symbol.iterator]()
   ▼
Iterator
   │
   │ .next()
   ▼
{ value, done }


An array, unwrapped

Array
  │
  │ [Symbol.iterator]()
  ▼
Iterator
  │
  ├── next() → { value: 10, done: false }
  ├── next() → { value: 20, done: false }
  ├── next() → { value: 30, done: false }
  └── next() → { value: undefined, done: true }


A generator gives you every layer at once

*[Symbol.iterator]()
        ↓
     iterator
        ↓
      next()
        ↓
     yield
        ↓
   { value, done }


The iterator is stateful

iterator
   │
   ├── next() → 10
   │
   ├── next() → 20
   │
   ├── next() → 30
   │
   └── next() → done`,
      codeExample: {
        title: { en: "The contract behind for...of", np: "for...of पछाडिको सम्झौता", jp: "for...of を支える取り決め" },
        code: `// ── 1. Basic — the array is not the iterator ──────────────────────
const numbers = [10, 20, 30];

console.log(numbers.next); // undefined — arrays are iterable, not iterators

const iterator = numbers[Symbol.iterator]();
iterator.next(); // { value: 10, done: false }
iterator.next(); // { value: 20, done: false }

// ── 2. Intermediate — what for...of does under the hood ───────────
const it = numbers[Symbol.iterator]();

let step = it.next();
while (!step.done) {
  console.log(step.value);
  step = it.next();
}

// ── 3. Advanced — implement the protocol by hand ──────────────────
const countdown = {
  start: 3,

  [Symbol.iterator]() {
    let current = this.start; // fresh state per iteration

    return {
      next() {
        if (current > 0) return { value: current--, done: false };
        return { value: undefined, done: true };
      },
    };
  },
};

for (const number of countdown) console.log(number); // 3, 2, 1

// ── 4. Advanced — the same thing with a generator method ──────────
const shorter = {
  start: 3,

  *[Symbol.iterator]() {
    for (let i = this.start; i > 0; i--) yield i;
  },
};

// ── Everything that consumes the protocol ─────────────────────────
const copy = [...new Set([1, 2, 3])];   // spread
const [first, second] = numbers;         // destructuring
for (const char of "hello") {}           // strings are iterable too

// ── A plain object is not iterable ────────────────────────────────
const user = { name: "Rajan", age: 30 };

// for (const value of user) {}          // TypeError
for (const [key, value] of Object.entries(user)) console.log(key, value);`,
      },
      keyTakeaways: [
        { en: "<b>Iterable</b> means the object has `[Symbol.iterator]()`; <b>iterator</b> means it has `.next()`.", np: "<b>Iterable</b> भनेको object सँग `[Symbol.iterator]()` छ; <b>iterator</b> भनेको यससँग `.next()` छ।", jp: "<b>イテラブル</b>は `[Symbol.iterator]()` を持つこと、<b>イテレータ</b>は `.next()` を持つこと。" },
        { en: "`.next()` returns <b>`{ value, done }`</b>, and `done: true` ends the iteration.", np: "`.next()` ले <b>`{ value, done }`</b> फर्काउँछ, र `done: true` ले iteration टुंग्याउँछ।", jp: "`.next()` は<b>`{ value, done }`</b> を返し、`done: true` で反復が終わる。" },
        { en: "Iterators are <b>stateful</b> — they remember how far along they are.", np: "Iterator <b>अवस्था राख्ने</b> हुन्छन् — कति टाढा पुगे सम्झन्छन्।", jp: "イテレータは<b>状態を持ち</b>、どこまで進んだかを覚えている。" },
        { en: "`for...of`, spread and destructuring all consume iterables through this protocol.", np: "`for...of`, spread र destructuring सबैले यही protocol मार्फत iterable खपत गर्छन्।", jp: "`for...of`・スプレッド・分割代入はいずれもこのプロトコル経由でイテラブルを消費する。" },
        { en: "Arrays, strings, `Map`, `Set` and generator objects are <b>built-in iterables</b>.", np: "Array, string, `Map`, `Set` र generator object <b>भित्रैका iterable</b> हुन्।", jp: "配列・文字列・`Map`・`Set`・ジェネレータオブジェクトは<b>組み込みのイテラブル</b>。" },
        { en: "You make any object iterable by implementing `[Symbol.iterator]()`.", np: "`[Symbol.iterator]()` लागू गरेर कुनै पनि object iterable बनाउन सकिन्छ।", jp: "`[Symbol.iterator]()` を実装すれば、どんなオブジェクトもイテラブルにできる。" },
        { en: "A generator method <b>`*[Symbol.iterator]()`</b> is usually the cleanest way to write one.", np: "Generator method <b>`*[Symbol.iterator]()`</b> प्रायः सबैभन्दा सफा तरिका हो।", jp: "書き方として最も簡潔なのは、たいていジェネレータメソッド<b>`*[Symbol.iterator]()`</b>。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking every object is iterable</b> — `for (const value of { name: \"Rajan\" })` throws. Use `Object.entries()`, or give the object `[Symbol.iterator]()`.", np: "<b>हरेक object iterable हो भन्ने ठान्नु</b> — `for (const value of { name: \"Rajan\" })` ले error दिन्छ। `Object.entries()` प्रयोग गर्नुहोस्, वा object लाई `[Symbol.iterator]()` दिनुहोस्।", jp: "<b>すべてのオブジェクトがイテラブルだと思う</b> — `for (const value of { name: \"Rajan\" })` は例外になる。`Object.entries()` を使うか、`[Symbol.iterator]()` を実装する。" },
        { en: "<b>Confusing an iterable with its iterator</b> — `numbers.next` is `undefined`; you have to call `numbers[Symbol.iterator]()` first.", np: "<b>Iterable र यसको iterator अल्मल्याउनु</b> — `numbers.next` `undefined` हो; पहिले `numbers[Symbol.iterator]()` बोलाउनुपर्छ।", jp: "<b>イテラブルとイテレータを混同する</b> — `numbers.next` は `undefined`。先に `numbers[Symbol.iterator]()` を呼ぶ必要がある。" },
        { en: "<b>Forgetting that an iterator carries state</b> — two `.next()` calls give `10` then `20`, not `10` twice. Reusing an exhausted iterator yields nothing.", np: "<b>Iterator ले अवस्था बोक्छ भनी बिर्सनु</b> — दुई `.next()` call ले `10` अनि `20` दिन्छ, `10` दुई पटक होइन। सकिएको iterator पुनः प्रयोग गर्दा केही आउँदैन।", jp: "<b>イテレータが状態を持つことを忘れる</b> — 2回の `.next()` は `10` の次に `20` で、`10` が2回ではない。使い切ったイテレータを再利用しても何も出ない。" },
        { en: "<b>Sharing mutable state across iterations</b> — initialising the counter outside `[Symbol.iterator]()` means the second `for...of` over the same object starts already exhausted.", np: "<b>Iteration बीच परिवर्तनशील अवस्था बाँड्नु</b> — counter लाई `[Symbol.iterator]()` बाहिर सुरु गर्दा, उही object मा दोस्रो `for...of` सकिएकै अवस्थाबाट सुरु हुन्छ।", jp: "<b>反復間で可変の状態を共有する</b> — カウンタを `[Symbol.iterator]()` の外で初期化すると、同じオブジェクトへの2回目の `for...of` は使い切った状態から始まる。" },
      ],
      quiz: [
        {
          question: { en: "What method must an iterable provide?", np: "Iterable ले कुन method दिनैपर्छ?", jp: "イテラブルが備えるべきメソッドは?" },
          options: [
            { en: "`next()`", np: "`next()`", jp: "`next()`" },
            { en: "`iterate()`", np: "`iterate()`", jp: "`iterate()`" },
            { en: "`[Symbol.iterator]()`", np: "`[Symbol.iterator]()`", jp: "`[Symbol.iterator]()`" },
            { en: "`Symbol.next()`", np: "`Symbol.next()`", jp: "`Symbol.next()`" },
          ],
          correctIndex: 2,
          explanation: { en: "`next()` is what the iterator it returns must provide.", np: "`next()` चाहिँ यसले फर्काउने iterator ले दिनुपर्ने हो।", jp: "`next()` は、それが返すイテレータが備えるもの。" },
        },
        {
          question: { en: "What does an iterator's `.next()` return?", np: "Iterator को `.next()` ले के फर्काउँछ?", jp: "イテレータの `.next()` は何を返すか?" },
          options: [
            { en: "A value only", np: "मान मात्र", jp: "値だけ" },
            { en: "An array", np: "एउटा array", jp: "配列" },
            { en: "A Promise", np: "एउटा Promise", jp: "Promise" },
            { en: "`{ value, done }`", np: "`{ value, done }`", jp: "`{ value, done }`" },
          ],
          correctIndex: 3,
          explanation: { en: "An async iterator is the one that returns a promise.", np: "Promise फर्काउने चाहिँ async iterator हो।", jp: "Promiseを返すのは非同期イテレータのほう。" },
        },
        {
          question: { en: "What do two `iterator.next()` calls print for `const iterator = [10, 20, 30][Symbol.iterator]()`?", np: "`const iterator = [10, 20, 30][Symbol.iterator]()` मा दुई `iterator.next()` call ले के देखाउँछन्?", jp: "`const iterator = [10, 20, 30][Symbol.iterator]()` で `iterator.next()` を2回呼ぶと何が出るか?" },
          options: [
            { en: "`{ value: 10, done: false }`, `{ value: 20, done: false }`", np: "`{ value: 10, done: false }`, `{ value: 20, done: false }`", jp: "`{ value: 10, done: false }`, `{ value: 20, done: false }`" },
            { en: "`10`, `20`", np: "`10`, `20`", jp: "`10`, `20`" },
            { en: "`[10, 20]`", np: "`[10, 20]`", jp: "`[10, 20]`" },
            { en: "`undefined`, `undefined`", np: "`undefined`, `undefined`", jp: "`undefined`, `undefined`" },
          ],
          correctIndex: 0,
          explanation: { en: "Use `.next().value` when you only want the value.", np: "मान मात्र चाहिँदा `.next().value` प्रयोग गर्नुहोस्।", jp: "値だけ欲しいときは `.next().value` を使う。" },
        },
        {
          question: { en: "Which of these is <b>not</b> automatically iterable?", np: "यीमध्ये कुन स्वतः iterable <b>होइन</b>?", jp: "自動的にイテラブルで<b>ない</b>のはどれか?" },
          options: [
            { en: "Array", np: "Array", jp: "配列" },
            { en: "String", np: "String", jp: "文字列" },
            { en: "A plain object", np: "सादा object", jp: "素のオブジェクト" },
            { en: "Set", np: "Set", jp: "Set" },
          ],
          correctIndex: 2,
          explanation: { en: "Use `Object.entries()`, or implement `[Symbol.iterator]()` yourself.", np: "`Object.entries()` प्रयोग गर्नुहोस्, वा आफैं `[Symbol.iterator]()` लागू गर्नुहोस्।", jp: "`Object.entries()` を使うか、自分で `[Symbol.iterator]()` を実装する。" },
        },
        {
          question: { en: "What happens when an iterator is finished?", np: "Iterator सकिँदा के हुन्छ?", jp: "イテレータが終わるとどうなるか?" },
          options: [
            { en: "`.next()` throws an error", np: "`.next()` ले error दिन्छ", jp: "`.next()` が例外を投げる" },
            { en: "`.next()` keeps returning `{ done: true }`", np: "`.next()` ले `{ done: true }` फर्काइरहन्छ", jp: "`.next()` は `{ done: true }` を返し続ける" },
            { en: "The iterator becomes `null`", np: "Iterator `null` बन्छ", jp: "イテレータが `null` になる" },
            { en: "It restarts automatically", np: "यो आफैं फेरि सुरु हुन्छ", jp: "自動的に再スタートする" },
          ],
          correctIndex: 1,
          explanation: { en: "Call `[Symbol.iterator]()` again for a fresh iterator.", np: "नयाँ iterator का लागि फेरि `[Symbol.iterator]()` बोलाउनुहोस्।", jp: "新しいイテレータが要るなら再び `[Symbol.iterator]()` を呼ぶ。" },
        },
      ],
    },
    {
      id: "async-generators",
      title: { en: "Async Generators — Lazy Async Sequences", np: "Async Generators — Lazy Async Sequences", jp: "非同期ジェネレータ — 遅延非同期シーケンス" },
      durationMinutes: 9,
      explanation: {
        en: "An <b>async generator</b> combines two JavaScript capabilities:\n\n• <b>Generator</b> — produces multiple values over time using `yield`\n• <b>Async function</b> — can pause with `await` while waiting for a Promise\n\nIt is declared with `async function*`:\n\n```javascript\nasync function* numbers() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\n```\n\nCalling it does <b>not</b> execute the body. It creates an <b>async generator object</b>. The important difference from a normal generator is that `.next()` returns a <b>Promise</b>:\n\n```javascript\nconst generator = numbers();\n\nconsole.log(await generator.next()); // { value: 1, done: false }\nconsole.log(await generator.next()); // { value: 2, done: false }\nconsole.log(await generator.next()); // { value: 3, done: false }\nconsole.log(await generator.next()); // { value: undefined, done: true }\n```\n\n```text\nRegular Generator\n\n.next()\n  ↓\n{ value, done }\n\n\nAsync Generator\n\n.next()\n  ↓\nPromise\n  ↓\n{ value, done }\n```\n\nThe key idea is <b>lazy production</b>: the generator produces the next value only when the consumer asks for it.\n\n---\n\n### 1. Basic — an async generator\n\n```javascript\nasync function* numbers() {\n  yield 10;\n  yield 20;\n  yield 30;\n}\n\nfor await (const number of numbers()) {\n  console.log(number);\n}\n```\n\nOutput:\n\n```text\n10\n20\n30\n```\n\nThe consumption syntax is the difference:\n\n```javascript\nfor (const value of generator)          // synchronous generator\nfor await (const value of asyncGenerator) // async generator\n```\n\n---\n\n### 2. Intermediate — `await` before each value\n\nThe real power shows when each value needs asynchronous work.\n\n```javascript\nfunction wait(ms) {\n  return new Promise(resolve => {\n    setTimeout(resolve, ms);\n  });\n}\n\nasync function* numbers() {\n  await wait(1000);\n  yield 1;\n\n  await wait(1000);\n  yield 2;\n\n  await wait(1000);\n  yield 3;\n}\n\nfor await (const number of numbers()) {\n  console.log(number);\n}\n```\n\nThe values arrive one at a time, and nothing is calculated ahead:\n\n```text\nConsumer asks\n     ↓\n   value 1\n     ↓\nconsumer asks again\n     ↓\n   value 2\n     ↓\nconsumer asks again\n     ↓\n   value 3\n```\n\n---\n\n### 3. Advanced — pagination\n\nPagination is the best real-world use for async generators. Instead of fetching every page upfront, the generator fetches the next page only when the consumer asks for more.\n\n```javascript\nasync function* paginate(url) {\n  while (url) {\n    const response = await fetch(url);\n    const page = await response.json();\n\n    yield page;\n\n    url = page.nextUrl;\n  }\n}\n```\n\n```javascript\nfor await (const page of paginate(\"/api/users?page=1\")) {\n  console.log(page.items);\n}\n```\n\n```text\nRequest page 1\n      ↓\n   yield page 1\n      ↓\nconsumer asks again\n      ↓\nRequest page 2\n      ↓\n   yield page 2\n      ↓\nconsumer asks again\n      ↓\nRequest page 3\n```\n\nPage 2 is never requested until the consumer actually wants it.\n\n---\n\n### 4. Advanced — yield individual items\n\nYou can hide pagination from the consumer entirely by yielding items instead of pages:\n\n```javascript\nasync function* users(url) {\n  while (url) {\n    const response = await fetch(url);\n    const page = await response.json();\n\n    for (const user of page.items) {\n      yield user;\n    }\n\n    url = page.nextUrl;\n  }\n}\n```\n\n```javascript\nfor await (const user of users(\"/api/users?page=1\")) {\n  console.log(user.name);\n}\n```\n\nThe API still returns pages of 100, but the application only sees a flat stream of users. The generator handles pagination behind the scenes.\n\n---\n\n### `yield*` — delegate to another generator\n\n`yield*` lets one generator forward every value from another:\n\n```javascript\nasync function* numbers() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\n\nasync function* allNumbers() {\n  yield* numbers();\n}\n```\n\n```javascript\nfor await (const number of allNumbers()) {\n  console.log(number); // 1, 2, 3\n}\n```\n\nThis is how you <b>compose generators</b> instead of manually forwarding each value.\n\n---\n\n### `break` makes them truly lazy\n\n`for await...of` can stop early:\n\n```javascript\nasync function* numbers() {\n  for (let i = 1; i <= 1000; i++) {\n    console.log(\"Producing:\", i);\n\n    yield i;\n  }\n}\n```\n\n```javascript\nfor await (const number of numbers()) {\n  console.log(number);\n\n  if (number === 3) {\n    break;\n  }\n}\n```\n\nOutput:\n\n```text\nProducing: 1\n1\nProducing: 2\n2\nProducing: 3\n3\n```\n\nValues 4 through 1000 are never produced. That matters most when each value is expensive — API requests, database queries, file reads, paginated data, network streams. You only pay for what you consume.\n\n---\n\n### Async generator vs Promise vs generator\n\n```text\n                          Promise    Generator   Async Generator\nRepresents waiting        yes        no          yes\nProduces multiple values  no         yes         yes\nUses await                no         no          yes\nUses yield                no         yes         yes\nLazy                      no         yes         yes\nConsumed with             await      for...of    for await...of\n```\n\nA simple mental model:\n\n```text\nPromise\n\"Give me ONE value later.\"\n\nGenerator\n\"Give me MANY values, one at a time.\"\n\nAsync Generator\n\"Give me MANY values, one at a time,\nand I may need to WAIT before producing each one.\"\n```",
        np: "<b>Async generator</b> ले JavaScript का दुई क्षमता जोड्छ:\n\n• <b>Generator</b> — `yield` ले समयक्रममा धेरै मान दिन्छ\n• <b>Async function</b> — Promise कुर्दै `await` ले रोकिन सक्छ\n\nयो `async function*` ले घोषणा गरिन्छ:\n\n```javascript\nasync function* numbers() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\n```\n\nयसलाई बोलाउँदा body <b>चल्दैन</b>। यसले <b>async generator object</b> बनाउँछ। सामान्य generator भन्दा मुख्य भिन्नता — `.next()` ले <b>Promise</b> फर्काउँछ:\n\n```javascript\nconst generator = numbers();\n\nconsole.log(await generator.next()); // { value: 1, done: false }\nconsole.log(await generator.next()); // { value: 2, done: false }\nconsole.log(await generator.next()); // { value: 3, done: false }\nconsole.log(await generator.next()); // { value: undefined, done: true }\n```\n\n```text\nRegular Generator\n\n.next()\n  ↓\n{ value, done }\n\n\nAsync Generator\n\n.next()\n  ↓\nPromise\n  ↓\n{ value, done }\n```\n\nमुख्य विचार <b>अल्छी उत्पादन</b> हो: खपत गर्नेले मागेको बेला मात्र generator ले अर्को मान बनाउँछ।\n\n---\n\n### 1. आधारभूत — async generator\n\n```javascript\nasync function* numbers() {\n  yield 10;\n  yield 20;\n  yield 30;\n}\n\nfor await (const number of numbers()) {\n  console.log(number);\n}\n```\n\nOutput:\n\n```text\n10\n20\n30\n```\n\nभिन्नता खपत गर्ने वाक्यविन्यासमा छ:\n\n```javascript\nfor (const value of generator)          // synchronous generator\nfor await (const value of asyncGenerator) // async generator\n```\n\n---\n\n### 2. मध्यम — हरेक मानअघि `await`\n\nहरेक मानलाई asynchronous काम चाहिँदा वास्तविक शक्ति देखिन्छ।\n\n```javascript\nfunction wait(ms) {\n  return new Promise(resolve => {\n    setTimeout(resolve, ms);\n  });\n}\n\nasync function* numbers() {\n  await wait(1000);\n  yield 1;\n\n  await wait(1000);\n  yield 2;\n\n  await wait(1000);\n  yield 3;\n}\n\nfor await (const number of numbers()) {\n  console.log(number);\n}\n```\n\nमान एक-एक गरी आउँछन्, र अघि नै केही गणना हुँदैन:\n\n```text\nConsumer asks\n     ↓\n   value 1\n     ↓\nconsumer asks again\n     ↓\n   value 2\n     ↓\nconsumer asks again\n     ↓\n   value 3\n```\n\n---\n\n### 3. उन्नत — pagination\n\nAsync generator को सबैभन्दा राम्रो वास्तविक प्रयोग pagination हो। सबै page अघि नै नल्याई, खपत गर्नेले थप मागेको बेला मात्र generator ले अर्को page ल्याउँछ।\n\n```javascript\nasync function* paginate(url) {\n  while (url) {\n    const response = await fetch(url);\n    const page = await response.json();\n\n    yield page;\n\n    url = page.nextUrl;\n  }\n}\n```\n\n```javascript\nfor await (const page of paginate(\"/api/users?page=1\")) {\n  console.log(page.items);\n}\n```\n\n```text\nRequest page 1\n      ↓\n   yield page 1\n      ↓\nconsumer asks again\n      ↓\nRequest page 2\n      ↓\n   yield page 2\n      ↓\nconsumer asks again\n      ↓\nRequest page 3\n```\n\nखपत गर्नेले नचाहेसम्म page 2 कहिल्यै मागिँदैन।\n\n---\n\n### 4. उन्नत — छुट्टाछुट्टै item yield गर्नु\n\nPage को सट्टा item yield गरेर खपत गर्नेबाट pagination पूरै लुकाउन सकिन्छ:\n\n```javascript\nasync function* users(url) {\n  while (url) {\n    const response = await fetch(url);\n    const page = await response.json();\n\n    for (const user of page.items) {\n      yield user;\n    }\n\n    url = page.nextUrl;\n  }\n}\n```\n\n```javascript\nfor await (const user of users(\"/api/users?page=1\")) {\n  console.log(user.name);\n}\n```\n\nAPI ले अझै 100-100 को page फर्काउँछ, तर application ले user को सपाट धारा मात्र देख्छ। Pagination generator ले पर्दा पछाडि सम्हाल्छ।\n\n---\n\n### `yield*` — अर्को generator लाई सुम्पनु\n\n`yield*` ले एउटा generator लाई अर्कोका सबै मान पठाउन दिन्छ:\n\n```javascript\nasync function* numbers() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\n\nasync function* allNumbers() {\n  yield* numbers();\n}\n```\n\n```javascript\nfor await (const number of allNumbers()) {\n  console.log(number); // 1, 2, 3\n}\n```\n\nयसैगरी हरेक मान हातले नपठाई <b>generator जोड्न</b> सकिन्छ।\n\n---\n\n### `break` ले साँच्चै अल्छी बनाउँछ\n\n`for await...of` अघि नै रोकिन सक्छ:\n\n```javascript\nasync function* numbers() {\n  for (let i = 1; i <= 1000; i++) {\n    console.log(\"Producing:\", i);\n\n    yield i;\n  }\n}\n```\n\n```javascript\nfor await (const number of numbers()) {\n  console.log(number);\n\n  if (number === 3) {\n    break;\n  }\n}\n```\n\nOutput:\n\n```text\nProducing: 1\n1\nProducing: 2\n2\nProducing: 3\n3\n```\n\n4 देखि 1000 सम्मका मान कहिल्यै बन्दैनन्। हरेक मान महँगो हुँदा — API request, database query, file पढाइ, paginated data, network stream — यो सबैभन्दा महत्वपूर्ण हुन्छ। तपाईंले खपत गरेको जति मात्र तिर्नुहुन्छ।\n\n---\n\n### Async generator vs Promise vs generator\n\n```text\n                          Promise    Generator   Async Generator\nकुर्ने कुरा जनाउँछ        हो         होइन        हो\nधेरै मान दिन्छ            दिँदैन     दिन्छ       दिन्छ\nawait प्रयोग गर्छ         गर्दैन     गर्दैन      गर्छ\nyield प्रयोग गर्छ         गर्दैन     गर्छ        गर्छ\nअल्छी                     होइन       हो          हो\nखपत गर्ने तरिका           await      for...of    for await...of\n```\n\nसरल मानसिक model:\n\n```text\nPromise\n\"मलाई पछि एउटा मान देऊ।\"\n\nGenerator\n\"मलाई धेरै मान देऊ, एक-एक गरी।\"\n\nAsync Generator\n\"मलाई धेरै मान देऊ, एक-एक गरी,\nर हरेक बनाउनुअघि मैले कुर्नुपर्न सक्छ।\"\n```",
        jp: "<b>非同期ジェネレータ</b>は、JavaScriptの2つの能力を組み合わせます:\n\n• <b>ジェネレータ</b> — `yield` で時間をかけて複数の値を出す\n• <b>非同期関数</b> — Promiseを待つあいだ `await` で止まれる\n\n`async function*` で宣言します:\n\n```javascript\nasync function* numbers() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\n```\n\n呼んでも本体は<b>実行されません</b>。<b>非同期ジェネレータオブジェクト</b>が作られます。通常のジェネレータとの大きな違いは、`.next()` が<b>Promise</b>を返すことです:\n\n```javascript\nconst generator = numbers();\n\nconsole.log(await generator.next()); // { value: 1, done: false }\nconsole.log(await generator.next()); // { value: 2, done: false }\nconsole.log(await generator.next()); // { value: 3, done: false }\nconsole.log(await generator.next()); // { value: undefined, done: true }\n```\n\n```text\nRegular Generator\n\n.next()\n  ↓\n{ value, done }\n\n\nAsync Generator\n\n.next()\n  ↓\nPromise\n  ↓\n{ value, done }\n```\n\n肝は<b>遅延生成</b>です。消費側が求めたときにだけ、次の値を作ります。\n\n---\n\n### 1. 基本 — 非同期ジェネレータ\n\n```javascript\nasync function* numbers() {\n  yield 10;\n  yield 20;\n  yield 30;\n}\n\nfor await (const number of numbers()) {\n  console.log(number);\n}\n```\n\n出力:\n\n```text\n10\n20\n30\n```\n\n違いは消費の構文です:\n\n```javascript\nfor (const value of generator)          // 同期ジェネレータ\nfor await (const value of asyncGenerator) // 非同期ジェネレータ\n```\n\n---\n\n### 2. 中級 — 値ごとに `await` する\n\n各値に非同期の作業が要るとき、真価が出ます。\n\n```javascript\nfunction wait(ms) {\n  return new Promise(resolve => {\n    setTimeout(resolve, ms);\n  });\n}\n\nasync function* numbers() {\n  await wait(1000);\n  yield 1;\n\n  await wait(1000);\n  yield 2;\n\n  await wait(1000);\n  yield 3;\n}\n\nfor await (const number of numbers()) {\n  console.log(number);\n}\n```\n\n値は1つずつ届き、先回りの計算はありません:\n\n```text\nConsumer asks\n     ↓\n   value 1\n     ↓\nconsumer asks again\n     ↓\n   value 2\n     ↓\nconsumer asks again\n     ↓\n   value 3\n```\n\n---\n\n### 3. 上級 — ページネーション\n\n実務で最も向くのがページネーションです。全ページを先に取りに行かず、消費側が求めたときだけ次のページを取得します。\n\n```javascript\nasync function* paginate(url) {\n  while (url) {\n    const response = await fetch(url);\n    const page = await response.json();\n\n    yield page;\n\n    url = page.nextUrl;\n  }\n}\n```\n\n```javascript\nfor await (const page of paginate(\"/api/users?page=1\")) {\n  console.log(page.items);\n}\n```\n\n```text\nRequest page 1\n      ↓\n   yield page 1\n      ↓\nconsumer asks again\n      ↓\nRequest page 2\n      ↓\n   yield page 2\n      ↓\nconsumer asks again\n      ↓\nRequest page 3\n```\n\n消費側が求めるまで、2ページ目は取得されません。\n\n---\n\n### 4. 上級 — 要素単位でyieldする\n\nページではなく要素をyieldすれば、ページネーションを消費側から完全に隠せます:\n\n```javascript\nasync function* users(url) {\n  while (url) {\n    const response = await fetch(url);\n    const page = await response.json();\n\n    for (const user of page.items) {\n      yield user;\n    }\n\n    url = page.nextUrl;\n  }\n}\n```\n\n```javascript\nfor await (const user of users(\"/api/users?page=1\")) {\n  console.log(user.name);\n}\n```\n\nAPIは100件ずつ返し続けますが、アプリからはユーザーの平坦な流れに見えます。ページ送りはジェネレータが裏で担います。\n\n---\n\n### `yield*` — 別のジェネレータへ委譲する\n\n`yield*` は、あるジェネレータが別のジェネレータの値をすべて転送できるようにします:\n\n```javascript\nasync function* numbers() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\n\nasync function* allNumbers() {\n  yield* numbers();\n}\n```\n\n```javascript\nfor await (const number of allNumbers()) {\n  console.log(number); // 1, 2, 3\n}\n```\n\n1つずつ手で転送せずに<b>ジェネレータを合成</b>できます。\n\n---\n\n### `break` が真の遅延を生む\n\n`for await...of` は途中で止められます:\n\n```javascript\nasync function* numbers() {\n  for (let i = 1; i <= 1000; i++) {\n    console.log(\"Producing:\", i);\n\n    yield i;\n  }\n}\n```\n\n```javascript\nfor await (const number of numbers()) {\n  console.log(number);\n\n  if (number === 3) {\n    break;\n  }\n}\n```\n\n出力:\n\n```text\nProducing: 1\n1\nProducing: 2\n2\nProducing: 3\n3\n```\n\n4から1000までは作られません。各値が高価なとき — APIリクエスト・DBクエリ・ファイル読み込み・ページ送り・ネットワークストリーム — これが効きます。消費した分だけ払えば済みます。\n\n---\n\n### 非同期ジェネレータ・Promise・ジェネレータ\n\n```text\n                          Promise    ジェネレータ  非同期ジェネレータ\n待ちを表す                はい       いいえ        はい\n複数の値を出す            いいえ     はい          はい\nawaitを使う               いいえ     いいえ        はい\nyieldを使う               いいえ     はい          はい\n遅延                      いいえ     はい          はい\n消費の仕方                await      for...of      for await...of\n```\n\n覚え方:\n\n```text\nPromise\n「あとで1つの値をください。」\n\nジェネレータ\n「たくさんの値を、1つずつください。」\n\n非同期ジェネレータ\n「たくさんの値を1つずつ、\nそして作る前に待つかもしれません。」\n```",
      },
      diagram: `async function*
      │
      ▼
Async Generator
      │
      │ .next()
      ▼
   Promise
      │
      ▼
{ value, done }
      │
      ▼
   next value


Pagination, fetched on demand

Request page 1
      ↓
   yield page 1
      ↓
consumer asks again
      ↓
Request page 2
      ↓
   yield page 2
      ↓
consumer asks again
      ↓
Request page 3


break stops the work, not just the loop

for await ... of
      │
      ├── value 1  → produced
      ├── value 2  → produced
      ├── value 3  → produced
      │      │
      │      └── break
      │
      └── values 4..1000 never produced


Three tools, three questions

Promise            one value, later
Generator          many values, one at a time
Async Generator    many values, one at a time, each may need a wait`,
      codeExample: {
        title: { en: "Values that arrive when asked for", np: "मागेको बेला आउने मान", jp: "求めたときに届く値" },
        code: `// ── 1. Basic — consumed with for await...of ───────────────────────
async function* numbers() {
  yield 10;
  yield 20;
  yield 30;
}

for await (const number of numbers()) console.log(number);

// .next() returns a Promise, so it has to be awaited
const gen = numbers();
console.log(await gen.next()); // { value: 10, done: false }

// ── 2. Intermediate — await between values ────────────────────────
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function* ticks() {
  await wait(1000);
  yield 1;
  await wait(1000);
  yield 2; // nothing is computed ahead of time
}

// ── 3. Advanced — pagination, one page per request ────────────────
async function* paginate(url) {
  while (url) {
    const response = await fetch(url);
    const page = await response.json();

    yield page;

    url = page.nextUrl; // page 2 is not fetched until asked for
  }
}

// ── 4. Advanced — hide pagination behind a flat stream ────────────
async function* users(url) {
  while (url) {
    const response = await fetch(url);
    const page = await response.json();

    for (const user of page.items) yield user; // caller sees users, not pages

    url = page.nextUrl;
  }
}

for await (const user of users("/api/users?page=1")) console.log(user.name);

// ── yield* composes generators instead of forwarding by hand ──────
async function* allNumbers() {
  yield* numbers();
}

// ── break stops production, not just iteration ────────────────────
async function* upTo1000() {
  for (let i = 1; i <= 1000; i++) {
    console.log("Producing:", i);
    yield i;
  }
}

for await (const n of upTo1000()) {
  if (n === 3) break; // 4 through 1000 are never produced
}`,
      },
      keyTakeaways: [
        { en: "`async function*` creates an <b>async generator</b>; calling it does not run the body.", np: "`async function*` ले <b>async generator</b> बनाउँछ; बोलाउँदा body चल्दैन।", jp: "`async function*` は<b>非同期ジェネレータ</b>を作る。呼んでも本体は動かない。" },
        { en: "`yield` produces values one at a time while `await` allows asynchronous work between them.", np: "`yield` ले एक-एक गरी मान दिन्छ भने `await` ले बीचमा asynchronous काम गर्न दिन्छ।", jp: "`yield` が値を1つずつ出し、`await` がその合間に非同期の作業を許す。" },
        { en: "`.next()` returns a <b>Promise</b>, so it must be awaited.", np: "`.next()` ले <b>Promise</b> फर्काउँछ, त्यसैले await गर्नैपर्छ।", jp: "`.next()` は<b>Promise</b>を返すので await が要る。" },
        { en: "Consume an async generator with <b>`for await...of`</b>, not `for...of`.", np: "Async generator लाई `for...of` होइन, <b>`for await...of`</b> ले खपत गर्नुहोस्।", jp: "非同期ジェネレータは `for...of` ではなく<b>`for await...of`</b> で消費する。" },
        { en: "Async generators are naturally <b>lazy</b> — the next value is produced only when requested.", np: "Async generator स्वभावैले <b>अल्छी</b> हुन्छन् — मागेको बेला मात्र अर्को मान बन्छ।", jp: "非同期ジェネレータは本質的に<b>遅延</b>で、求められたときだけ次の値を作る。" },
        { en: "<b>`yield*`</b> delegates every value from another generator, so generators compose.", np: "<b>`yield*`</b> ले अर्को generator का सबै मान सुम्पन्छ, त्यसैले generator जोडिन्छन्।", jp: "<b>`yield*`</b> は別のジェネレータの値をすべて委譲し、合成を可能にする。" },
        { en: "<b>`break`</b> prevents all the remaining work, which matters when each value is an API call or query.", np: "<b>`break`</b> ले बाँकी सबै काम रोक्छ, जुन हरेक मान API call वा query हुँदा महत्वपूर्ण हुन्छ।", jp: "<b>`break`</b> は残りの作業を丸ごと止める。各値がAPI呼び出しやクエリなら重要。" },
        { en: "Pagination and streaming are the major real-world use cases.", np: "Pagination र streaming मुख्य वास्तविक प्रयोग हुन्।", jp: "ページネーションとストリーミングが主な実用例。" },
      ],
      commonMistakes: [
        { en: "<b>Using `for...of`</b> — an async generator is async iterable, not synchronously iterable, so `for (const n of numbers())` fails. Use `for await...of`.", np: "<b>`for...of` प्रयोग गर्नु</b> — async generator async iterable हो, synchronously iterable होइन, त्यसैले `for (const n of numbers())` असफल हुन्छ। `for await...of` प्रयोग गर्नुहोस्।", jp: "<b>`for...of` を使う</b> — 非同期ジェネレータは非同期イテラブルであり同期イテラブルではないので `for (const n of numbers())` は失敗する。`for await...of` を使う。" },
        { en: "<b>Expecting `.next()` to return the value directly</b> — `generator.next().value` is `undefined` because `.next()` returns a Promise. Await it first.", np: "<b>`.next()` ले सिधै मान फर्काउँछ भन्ने ठान्नु</b> — `.next()` ले Promise फर्काउने भएकाले `generator.next().value` `undefined` हुन्छ। पहिले await गर्नुहोस्।", jp: "<b>`.next()` が値を直接返すと思う</b> — `.next()` はPromiseを返すので `generator.next().value` は `undefined`。まず await する。" },
        { en: "<b>Fetching every page upfront</b> — a `Promise.all` over pages 1 to 4 wastes network and memory when the consumer only needs the first. Yield pages lazily instead.", np: "<b>सबै page अघि नै ल्याउनु</b> — खपत गर्नेलाई पहिलो मात्र चाहिँदा page 1 देखि 4 सम्मको `Promise.all` ले network र memory खेर फाल्छ। बरु page अल्छी तरिकाले yield गर्नुहोस्।", jp: "<b>全ページを先に取得する</b> — 消費側が最初の1ページしか要らないのに `Promise.all` で1〜4ページ取るのは無駄。遅延してyieldする。" },
        { en: "<b>Forgetting that `break` is what makes laziness pay off</b> — consuming the whole generator when you only need a few values produces every expensive value anyway.", np: "<b>`break` ले नै अल्छीपनको फाइदा दिन्छ भनी बिर्सनु</b> — केही मान मात्र चाहिँदा पनि पूरै generator खपत गर्दा हरेक महँगो मान बन्छ।", jp: "<b>遅延が効くのは `break` のおかげだと忘れる</b> — 数個しか要らないのに全部消費すれば、高価な値をすべて作ってしまう。" },
      ],
      quiz: [
        {
          question: { en: "How do you declare an async generator?", np: "Async generator कसरी घोषणा गर्ने?", jp: "非同期ジェネレータの宣言はどれか?" },
          options: [
            { en: "`function async* generator() {}`", np: "`function async* generator() {}`", jp: "`function async* generator() {}`" },
            { en: "`async function* generator() {}`", np: "`async function* generator() {}`", jp: "`async function* generator() {}`" },
            { en: "`async generator function() {}`", np: "`async generator function() {}`", jp: "`async generator function() {}`" },
            { en: "`function* async generator() {}`", np: "`function* async generator() {}`", jp: "`function* async generator() {}`" },
          ],
          correctIndex: 1,
          explanation: { en: "`async` comes first, then `function*`.", np: "पहिले `async`, अनि `function*`।", jp: "先に `async`、その後 `function*`。" },
        },
        {
          question: { en: "What does `.next()` return for an async generator?", np: "Async generator मा `.next()` ले के फर्काउँछ?", jp: "非同期ジェネレータの `.next()` は何を返すか?" },
          options: [
            { en: "A Promise", np: "एउटा Promise", jp: "Promise" },
            { en: "The yielded value itself", np: "yield भएको मान आफैं", jp: "yieldされた値そのもの" },
            { en: "`{ value, done }` directly", np: "सिधै `{ value, done }`", jp: "`{ value, done }` を直接" },
            { en: "An array", np: "एउटा array", jp: "配列" },
          ],
          correctIndex: 0,
          explanation: { en: "Await it to get the `{ value, done }` object.", np: "`{ value, done }` object पाउन await गर्नुहोस्।", jp: "await して `{ value, done }` を取り出す。" },
        },
        {
          question: { en: "Which loop should consume an async generator?", np: "Async generator कुन loop ले खपत गर्नुपर्छ?", jp: "非同期ジェネレータを消費するループは?" },
          options: [
            { en: "`for`", np: "`for`", jp: "`for`" },
            { en: "`for...in`", np: "`for...in`", jp: "`for...in`" },
            { en: "`for...of`", np: "`for...of`", jp: "`for...of`" },
            { en: "`for await...of`", np: "`for await...of`", jp: "`for await...of`" },
          ],
          correctIndex: 3,
          explanation: { en: "`for...of` fails because the generator is async iterable.", np: "Generator async iterable भएकाले `for...of` असफल हुन्छ।", jp: "ジェネレータは非同期イテラブルなので `for...of` では動かない。" },
        },
        {
          question: { en: "Why are async generators useful for pagination?", np: "Pagination का लागि async generator किन उपयोगी छन्?", jp: "ページネーションに非同期ジェネレータが向く理由は?" },
          options: [
            { en: "They fetch the next page only when the consumer asks for it", np: "खपत गर्नेले मागेको बेला मात्र तिनले अर्को page ल्याउँछन्", jp: "消費側が求めたときだけ次のページを取得するから" },
            { en: "They cache every page automatically", np: "तिनले हरेक page स्वतः cache गर्छन्", jp: "全ページを自動でキャッシュするから" },
            { en: "They make every request synchronous", np: "तिनले हरेक request synchronous बनाउँछन्", jp: "すべてのリクエストを同期にするから" },
            { en: "They eliminate HTTP requests", np: "तिनले HTTP request हटाउँछन्", jp: "HTTPリクエストをなくすから" },
          ],
          correctIndex: 0,
          explanation: { en: "Nothing beyond the current page is requested unless it is needed.", np: "आवश्यक नभएसम्म हालको page भन्दा पर केही मागिँदैन।", jp: "必要にならない限り、現在のページより先は要求されない。" },
        },
        {
          question: { en: "What does a `for await...of` loop over `yield 1; yield 2; yield 3;` print if it breaks at `2`?", np: "`yield 1; yield 2; yield 3;` मा `for await...of` ले `2` मा break गरे के देखाउँछ?", jp: "`yield 1; yield 2; yield 3;` を `for await...of` で回し `2` で break すると何が出るか?" },
          options: [
            { en: "`1`, `2`", np: "`1`, `2`", jp: "`1`, `2`" },
            { en: "Only `2`", np: "`2` मात्र", jp: "`2` だけ" },
            { en: "`1`, `2`, `3`", np: "`1`, `2`, `3`", jp: "`1`, `2`, `3`" },
            { en: "It throws, generators cannot break", np: "यसले error दिन्छ, generator मा break मिल्दैन", jp: "例外になる。ジェネレータではbreakできない" },
          ],
          correctIndex: 0,
          explanation: { en: "The third value is never produced, which is the point of laziness.", np: "तेस्रो मान कहिल्यै बन्दैन, अल्छीपनको सार यही हो।", jp: "3つ目は作られない。それが遅延の狙い。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What does calling a generator function return?", np: "Generator function बोलाउँदा के फर्किन्छ?", jp: "ジェネレータ関数を呼ぶと何が返るか?" },
      options: [
        { en: "The first yielded value", np: "पहिलो yield भएको मान", jp: "最初にyieldされた値" },
        { en: "A generator object, with the body not yet run", np: "Body नचलेको generator object", jp: "本体未実行のジェネレータオブジェクト" },
        { en: "An array of every yielded value", np: "yield भएका सबै मानको array", jp: "yieldされた全値の配列" },
      ],
      correctIndex: 1,
      explanation: { en: "The body starts at the first `.next()` call.", np: "Body पहिलो `.next()` call मा सुरु हुन्छ।", jp: "本体は最初の `.next()` で動き出す。" },
    },
    {
      question: { en: "What does `yield` do that `return` does not?", np: "`return` ले नगर्ने के काम `yield` ले गर्छ?", jp: "`return` にできて `yield` にしかできないことは?" },
      options: [
        { en: "It marks the generator as done", np: "यसले generator सकिएको जनाउँछ", jp: "ジェネレータを終了扱いにする" },
        { en: "It pauses the generator so it can resume later", np: "यसले generator रोक्छ ताकि पछि जारी राख्न सकियोस्", jp: "後で再開できるようジェネレータを一時停止する" },
        { en: "It converts the value to a Promise", np: "यसले मानलाई Promise बनाउँछ", jp: "値をPromiseに変換する" },
      ],
      correctIndex: 1,
      explanation: { en: "`return` is the one that finishes it with `done: true`.", np: "`done: true` सहित टुंग्याउने चाहिँ `return` हो।", jp: "`done: true` で終了させるのは `return` のほう。" },
    },
    {
      question: { en: "What does `[...example()]` give for `function* example() { yield 1; return 2; }`?", np: "`function* example() { yield 1; return 2; }` मा `[...example()]` ले के दिन्छ?", jp: "`function* example() { yield 1; return 2; }` で `[...example()]` は何になるか?" },
      options: [
        { en: "`[2]`", np: "`[2]`", jp: "`[2]`" },
        { en: "`[1, 2]`", np: "`[1, 2]`", jp: "`[1, 2]`" },
        { en: "`[1]`", np: "`[1]`", jp: "`[1]`" },
      ],
      correctIndex: 2,
      explanation: { en: "Spread collects yielded values and stops at `done: true`.", np: "Spread ले yield भएका मान जम्मा गर्छ र `done: true` मा रोकिन्छ।", jp: "スプレッドはyieldされた値を集め、`done: true` で止まる。" },
    },
    {
      question: { en: "What does `.next(100)` do while a generator is paused at a `yield`?", np: "Generator `yield` मा रोकिँदा `.next(100)` ले के गर्छ?", jp: "`yield` で停止中に `.next(100)` は何をするか?" },
      options: [
        { en: "It restarts the generator", np: "यसले generator फेरि सुरु गर्छ", jp: "ジェネレータを再スタートさせる" },
        { en: "It appends `100` to the yielded sequence", np: "यसले yield को क्रममा `100` थप्छ", jp: "yieldの列に `100` を追加する" },
        { en: "It makes `100` the value of the paused `yield` expression", np: "यसले `100` लाई रोकिएको `yield` expression को मान बनाउँछ", jp: "`100` を停止中の `yield` 式の値にする" },
      ],
      correctIndex: 2,
      explanation: { en: "That is how the caller feeds data into a paused function.", np: "यसै गरी caller ले रोकिएको function मा data खुवाउँछ।", jp: "こうして呼び出し側が停止中の関数へデータを渡す。" },
    },
    {
      question: { en: "What makes an object <b>iterable</b>?", np: "कुनै object लाई <b>iterable</b> केले बनाउँछ?", jp: "オブジェクトを<b>イテラブル</b>にするものは?" },
      options: [
        { en: "A `[Symbol.iterator]()` method", np: "`[Symbol.iterator]()` method", jp: "`[Symbol.iterator]()` メソッド" },
        { en: "A `next()` method", np: "`next()` method", jp: "`next()` メソッド" },
        { en: "A `length` property", np: "`length` property", jp: "`length` プロパティ" },
      ],
      correctIndex: 0,
      explanation: { en: "`next()` is what the iterator it returns must have.", np: "`next()` चाहिँ यसले फर्काउने iterator सँग हुनुपर्ने हो।", jp: "`next()` は、それが返すイテレータに必要なもの。" },
    },
    {
      question: { en: "What shape does an iterator's `.next()` return?", np: "Iterator को `.next()` ले कस्तो आकार फर्काउँछ?", jp: "イテレータの `.next()` が返す形は?" },
      options: [
        { en: "`{ value, done }`", np: "`{ value, done }`", jp: "`{ value, done }`" },
        { en: "The value alone", np: "मान मात्र", jp: "値のみ" },
        { en: "`[value, done]`", np: "`[value, done]`", jp: "`[value, done]`" },
      ],
      correctIndex: 0,
      explanation: { en: "`done: true` is what ends a `for...of` loop.", np: "`for...of` loop टुंग्याउने चाहिँ `done: true` हो।", jp: "`for...of` を終わらせるのが `done: true`。" },
    },
    {
      question: { en: "Which of these is <b>not</b> iterable by default?", np: "यीमध्ये कुन पूर्वनिर्धारित रूपमा iterable <b>होइन</b>?", jp: "既定でイテラブルで<b>ない</b>のはどれか?" },
      options: [
        { en: "A `Set`", np: "एउटा `Set`", jp: "`Set`" },
        { en: "A plain object", np: "सादा object", jp: "素のオブジェクト" },
        { en: "A string", np: "एउटा string", jp: "文字列" },
      ],
      correctIndex: 1,
      explanation: { en: "Use `Object.entries()`, or implement `[Symbol.iterator]()` on it.", np: "`Object.entries()` प्रयोग गर्नुहोस्, वा यसमा `[Symbol.iterator]()` लागू गर्नुहोस्।", jp: "`Object.entries()` を使うか、`[Symbol.iterator]()` を実装する。" },
    },
    {
      question: { en: "Why is a generator method the cleanest way to write `[Symbol.iterator]()`?", np: "`[Symbol.iterator]()` लेख्न generator method किन सबैभन्दा सफा तरिका हो?", jp: "`[Symbol.iterator]()` を書くのにジェネレータメソッドが最も簡潔なのはなぜか?" },
      options: [
        { en: "Generators can use primitive keys", np: "Generator ले primitive key प्रयोग गर्न सक्छ", jp: "プリミティブのキーが使えるから" },
        { en: "Generators run faster than manual iterators", np: "Generator हाते iterator भन्दा छिटो चल्छ", jp: "手書きのイテレータより速いから" },
        { en: "Generators already satisfy the iterator shape, so `yield` is all you write", np: "Generator ले पहिले नै iterator को आकार पूरा गर्छ, त्यसैले `yield` लेखे पुग्छ", jp: "ジェネレータはすでにイテレータの形を満たすので `yield` を書くだけで済む" },
      ],
      correctIndex: 2,
      explanation: { en: "You skip writing `next()` and the `{ value, done }` bookkeeping entirely.", np: "`next()` र `{ value, done }` को हिसाब लेख्नै पर्दैन।", jp: "`next()` と `{ value, done }` の管理を書かずに済む。" },
    },
    {
      question: { en: "How is an async generator declared?", np: "Async generator कसरी घोषणा गरिन्छ?", jp: "非同期ジェネレータはどう宣言するか?" },
      options: [
        { en: "`async function`", np: "`async function`", jp: "`async function`" },
        { en: "`function* async`", np: "`function* async`", jp: "`function* async`" },
        { en: "`async function*`", np: "`async function*`", jp: "`async function*`" },
      ],
      correctIndex: 2,
      explanation: { en: "It combines `await` for waiting with `yield` for producing values.", np: "यसले कुर्न `await` र मान दिन `yield` जोड्छ।", jp: "待つための `await` と値を出す `yield` を組み合わせる。" },
    },
    {
      question: { en: "Which loop consumes an async generator?", np: "Async generator कुन loop ले खपत गर्छ?", jp: "非同期ジェネレータを消費するループは?" },
      options: [
        { en: "`for await...of`", np: "`for await...of`", jp: "`for await...of`" },
        { en: "`for...of`", np: "`for...of`", jp: "`for...of`" },
        { en: "`for...in`", np: "`for...in`", jp: "`for...in`" },
      ],
      correctIndex: 0,
      explanation: { en: "`.next()` returns a promise, so each step has to be awaited.", np: "`.next()` ले promise फर्काउँछ, त्यसैले हरेक चरण await गर्नुपर्छ।", jp: "`.next()` はPromiseを返すので、各ステップをawaitする必要がある。" },
    },
    {
      question: { en: "Why does `break` matter more for an async generator than a plain loop?", np: "सामान्य loop भन्दा async generator मा `break` किन बढी महत्वपूर्ण छ?", jp: "普通のループより非同期ジェネレータで `break` が重要なのはなぜか?" },
      options: [
        { en: "It stops the remaining values from being produced at all", np: "यसले बाँकी मान बन्नै नदिने गरी रोक्छ", jp: "残りの値がそもそも作られなくなるから" },
        { en: "It closes the network connection", np: "यसले network connection बन्द गर्छ", jp: "ネットワーク接続を閉じるから" },
        { en: "It converts the generator to an array", np: "यसले generator लाई array बनाउँछ", jp: "ジェネレータを配列に変えるから" },
      ],
      correctIndex: 0,
      explanation: { en: "Each unproduced value may have been an API call or a query.", np: "नबनेको हरेक मान एउटा API call वा query हुन सक्थ्यो।", jp: "作られなかった各値は、API呼び出しやクエリだったかもしれない。" },
    },
    {
      question: { en: "What does `yield*` do?", np: "`yield*` ले के गर्छ?", jp: "`yield*` は何をするか?" },
      options: [
        { en: "Yields an array of all remaining values", np: "बाँकी सबै मानको array yield गर्छ", jp: "残りの値の配列をyieldする" },
        { en: "Delegates every value from another generator", np: "अर्को generator का सबै मान सुम्पन्छ", jp: "別のジェネレータの値をすべて委譲する" },
        { en: "Repeats the previous value", np: "अघिल्लो मान दोहोर्‍याउँछ", jp: "直前の値を繰り返す" },
      ],
      correctIndex: 1,
      explanation: { en: "It is how generators compose without forwarding each value by hand.", np: "हरेक मान हातले नपठाई generator जोड्ने तरिका यही हो।", jp: "各値を手で転送せずにジェネレータを合成する方法。" },
    },
  ],
};
