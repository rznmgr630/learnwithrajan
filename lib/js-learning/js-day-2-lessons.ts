import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_2_LESSONS: JsLessonDay = {
  day: 2,
  title: { en: "Operators, Conditionals & Functions", np: "Operators, Conditionals र Functions", jp: "演算子・条件分岐・関数" },
  totalMinutes: 36,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "operators",
      title: { en: "Operators", np: "Operators", jp: "演算子" },
      durationMinutes: 9,
      explanation: {
        en: "Operators are the small symbols (`+`, `===`, `&&`, `??`) that combine values into new values. Most are familiar from math class, but three are worth slowing down on because they trip up beginners: <b>short-circuit evaluation</b>, <b>nullish coalescing (`??`)</b>, and <b>optional chaining (`?.`)</b> — all three exist to write safer code with less nesting.\n\n• <b>`||` (OR)</b> falls back whenever the left side is any falsy value (`0`, `''`, `null`, `undefined`, `NaN`, `false`)\n  ↳ Dangerous for numbers: `count || 10` replaces a real `0` with `10`\n• <b>`??` (nullish coalescing)</b> falls back only when the left side is exactly `null` or `undefined`\n  ↳ Safe for numbers: `count ?? 10` keeps a real `0` as `0`\n• <b>`?.` (optional chaining)</b> stops and returns `undefined` the moment it hits a `null`/`undefined` link in a chain, instead of throwing",
        np: "|| ले कुनै पनि falsy value मा fallback गर्छ। ?? ले केवल null/undefined मा मात्र fallback गर्छ — number को लागि सुरक्षित। ?. ले chain बीचमा null भेटिए error नफाली undefined फर्काउँछ।",
        jp: "||はfalsy値すべてでフォールバック。??はnull/undefinedのみでフォールバック（数値に安全）。?.はチェーン中でnull/undefinedに当たった時点でエラーなくundefinedを返す。",
      },
      diagram: `0 || 10   ──▶  0 is falsy         ──▶  10   (|| skips real 0 — bug risk)
0 ?? 10   ──▶  0 is not null/undef ──▶  0    (?? keeps real 0 — safe)

user?.address?.city
  │        │        └─ if this link is null/undefined, stop here
  │        └─ if this link is null/undefined, stop here
  └─ if this is null/undefined, whole chain short-circuits to undefined`,
      codeExample: {
        title: { en: "Arithmetic, comparison, logical & nullish operators", np: "मुख्य operators", jp: "主要演算子" },
        code: `// ── Arithmetic ──────────────────────────────────────────────────────
5 + 3    // 8
5 % 3    // 2  (remainder / modulo)
5 ** 3   // 125 (exponentiation)

// ── Comparison (always returns boolean) ────────────────────────────
5 === "5"  // false ← strict (use this)
5 == "5"   // true  ← coercion (avoid)

// ── Logical / short-circuit evaluation ──────────────────────────────
const user = null;
const name = user && user.name;   // null  — stops at user (falsy)
const role = user || "guest";     // "guest" — uses right side when left is falsy

// ── Nullish coalescing ?? ───────────────────────────────────────────
const count = 0;
const a = count || 10;   // 10  — oops, 0 is falsy
const b = count ?? 10;   // 0   — 0 is not null/undefined

// ── Optional chaining ?. ────────────────────────────────────────────
const city = user?.address?.city;  // undefined — no error if user is null

// ── Ternary ─────────────────────────────────────────────────────────
const label = age >= 18 ? "adult" : "minor";`,
      },
      keyTakeaways: [
        { en: "`||` falls back on any falsy value; `??` falls back only on `null`/`undefined`. Prefer `??` whenever `0`, `''`, or `false` are valid values.", np: "`||` कुनै पनि falsy value मा fallback गर्छ; `??` केवल null/undefined मा। 0, '', false valid भएमा `??` प्रयोग गर्नुहोस्।", jp: "`||`はfalsy値全体、`??`はnull/undefinedのみでフォールバック。0・''・falseが有効な値なら`??`を使う。" },
        { en: "`?.` (optional chaining) stops and returns `undefined` the instant it hits a null/undefined link, instead of throwing a TypeError.", np: "`?.` ले null/undefined भेटिनासाथ रोकिएर undefined फर्काउँछ, TypeError दिँदैन।", jp: "`?.`はnull/undefinedに当たった瞬間にundefinedを返し、TypeErrorを投げない。" },
        { en: "Always use `===`/`!==` for comparisons — `==`/`!=` silently coerce types and produce surprising results.", np: "Comparison का लागि सधैं `===`/`!==` प्रयोग गर्नुहोस् — `==`/`!=` ले silently coerce गर्छ।", jp: "比較には常に`===`/`!==`を使う。`==`/`!=`は型を暗黙に変換し予期しない結果を生む。" },
      ],
      commonMistakes: [
        { en: "Using `||` to provide a default for a number that could legitimately be `0` — e.g. `quantity || 1` silently overwrites a real `0`.", np: "0 हुन सक्ने number का लागि default दिन `||` प्रयोग गर्नु — `quantity || 1` ले real 0 लाई silently overwrite गर्छ।", jp: "0になりうる数値のデフォルトに`||`を使うこと。`quantity || 1`は本当の0を上書きする。" },
        { en: "Chaining `.` instead of `?.` on a value that might be null, causing a `TypeError: Cannot read properties of null`.", np: "null हुन सक्ने value मा `?.` को सट्टा `.` प्रयोग गर्दा `TypeError` आउनु।", jp: "nullになりうる値に`.`ではなく`?.`を使わずTypeErrorになること。" },
        { en: "Using `==` for a \"quick\" comparison and getting a surprising `true`, like `\"\" == 0` or `[] == false`.", np: "छिटो comparison का लागि `==` प्रयोग गर्दा `\"\" == 0` जस्तो अनपेक्षित `true` पाउनु।", jp: "手早い比較に`==`を使い、`\"\" == 0`のような予期しない`true`を得ること。" },
      ],
      quiz: [
        {
          question: { en: "If `count` is `0`, what does `count ?? 10` evaluate to?", np: "`count` 0 भएमा `count ?? 10` को नतिजा के हो?", jp: "`count`が0のとき`count ?? 10`は何になる？" },
          options: [{ en: "10", np: "10", jp: "10" }, { en: "0", np: "0", jp: "0" }, { en: "undefined", np: "undefined", jp: "undefined" }],
          correctIndex: 1,
          explanation: { en: "?? only falls back on null/undefined. 0 is neither, so it's kept as-is.", np: "?? ले केवल null/undefined मा मात्र fallback गर्छ। 0 त्यो होइन, त्यसैले जस्तै रहन्छ।", jp: "??はnull/undefinedのみでフォールバック。0はどちらでもないため、そのまま保持される。" },
        },
        {
          question: { en: "What does `user?.address?.city` return when `user` is `null`?", np: "`user` null भएमा `user?.address?.city` ले के फर्काउँछ?", jp: "`user`がnullのとき`user?.address?.city`は何を返す？" },
          options: [{ en: "Throws a TypeError", np: "TypeError आउँछ", jp: "TypeErrorが発生する" }, { en: "undefined", np: "undefined", jp: "undefined" }, { en: "null", np: "null", jp: "null" }],
          correctIndex: 1,
          explanation: { en: "Optional chaining short-circuits to undefined the moment it hits a null/undefined link, no error thrown.", np: "Optional chaining ले null/undefined भेटिनासाथ undefined दिन्छ, error आउँदैन।", jp: "オプショナルチェーンはnull/undefinedに当たった時点でundefinedを返し、エラーは発生しない。" },
        },
        {
          question: { en: "Which operator should you use by default when comparing two values?", np: "दुई value comparison गर्न default मा कुन operator?", jp: "2つの値を比較するときデフォルトで使うべき演算子は？" },
          options: [{ en: "==", np: "==", jp: "==" }, { en: "===", np: "===", jp: "===" }],
          correctIndex: 1,
          explanation: { en: "=== never coerces types, avoiding surprising results from implicit conversion.", np: "=== ले कहिल्यै type coerce गर्दैन, अनपेक्षित नतिजाबाट बचाउँछ।", jp: "===は型を変換しないため、暗黙変換による予期しない結果を避けられる。" },
        },
      ],
    },
    {
      id: "conditionals",
      title: { en: "Conditionals", np: "Conditionals", jp: "条件分岐" },
      durationMinutes: 9,
      explanation: {
        en: "Conditionals let your program take different paths depending on data. `if/else` reads like plain English for a handful of branches; `switch` reads cleaner once you have many exact-match cases; and the <b>guard clause</b> pattern — returning early on invalid input — flattens code that would otherwise nest three or four `if` blocks deep.\n\nThink of guard clauses as a bouncer at the door: reject anyone who doesn't meet the requirements immediately, so the code inside the venue never has to double-check who's allowed to be there.",
        np: "if/else थोरै branches मा राम्रो। switch धेरै exact-match cases मा सफा। Guard clause ले invalid input लाई सुरुमै return गरी nesting हटाउँछ।",
        jp: "if/elseは少数の分岐に向く。switchは多数の完全一致に向く。ガード節は無効な入力を早期returnし、ネストを減らす。",
      },
      diagram: `Nested (hard to read)          Guard clauses (flat, easy to read)
──────────────────────         ───────────────────────────────────
if (order) {                   if (!order) return;
  if (order.items.length) {    if (!order.items.length) return;
    if (order.isPaid) {        if (!order.isPaid) return;
      ship(order);             ship(order);
    }                          // ← actual logic stays at top level
  }
}`,
      codeExample: {
        title: { en: "if/else, switch and guard clauses", np: "if/else, switch र guard clauses", jp: "if/else・switch・ガード節" },
        code: `// ── if / else if / else ──────────────────────────────────────────
const score = 75;
if (score >= 90) {
  console.log("A");
} else if (score >= 70) {
  console.log("C");
} else {
  console.log("F");
}

// ── switch — cleaner for many discrete values ─────────────────────
const day = "Monday";
switch (day) {
  case "Monday":
  case "Tuesday":
    console.log("Early week");
    break;        // without break, execution falls through to the next case
  default:
    console.log("Mid week");
}

// ── Guard clauses — return early instead of deep nesting ──────────
function processOrder(order) {
  if (!order) return;                      // bail early
  if (order.items.length === 0) return;    // bail early
  if (!order.isPaid) return;              // bail early
  ship(order);                             // actual logic at top level
}`,
      },
      keyTakeaways: [
        { en: "Use `if/else` for a handful of branches; `switch` once you have many exact-match cases against the same value.", np: "थोरै branches मा if/else; एउटै value सँग धेरै exact-match cases मा switch।", jp: "分岐が少数ならif/else、同じ値に対する完全一致が多いならswitch。" },
        { en: "Guard clauses (early `return` on invalid input) flatten deep nesting and keep the main logic at the top level.", np: "Guard clause (invalid input मा early return) ले nesting हटाई main logic लाई top level मा राख्छ।", jp: "ガード節（無効入力での早期return）はネストを平らにし、主要ロジックをトップレベルに保つ。" },
        { en: "A `switch` case without `break` falls through to the next case — often unintentional, sometimes used deliberately (as in the Monday/Tuesday example).", np: "`break` नभएको switch case अर्को case मा fall-through हुन्छ — कहिलेकाहीं जानाजानी प्रयोग गरिन्छ।", jp: "`break`のないswitchケースは次のケースにフォールスルーする。意図的に使うこともある。" },
      ],
      commonMistakes: [
        { en: "Forgetting `break` in a `switch` statement, causing unintended fall-through into the next case.", np: "`switch` मा `break` बिर्सनु, अनपेक्षित fall-through हुनु।", jp: "switch文で`break`を忘れ、意図しないフォールスルーが起きること。" },
        { en: "Nesting `if` blocks 3-4 levels deep instead of using guard clauses, making the logic hard to follow.", np: "Guard clause प्रयोग नगरी if block ३-४ level सम्म nest गर्नु।", jp: "ガード節を使わずif文を3〜4段ネストし、ロジックが追いにくくなること。" },
        { en: "Using `switch` with `===`-style exact matching when the actual need is range checks (`score >= 90`) — `switch` can't express ranges directly.", np: "Range check चाहिँदा (score >= 90) switch प्रयोग गर्नु — switch ले range express गर्न सक्दैन।", jp: "範囲チェックが必要な場合にswitchを使うこと。switchは範囲を直接表現できない。" },
      ],
      quiz: [
        {
          question: { en: "What happens if a `switch` case is missing its `break`?", np: "`switch` case मा `break` नभएमा के हुन्छ?", jp: "switchケースに`break`がないと？" },
          options: [{ en: "A SyntaxError is thrown", np: "SyntaxError आउँछ", jp: "SyntaxErrorが発生する" }, { en: "Execution falls through to the next case", np: "Execution अर्को case मा fall-through हुन्छ", jp: "実行が次のケースにフォールスルーする" }, { en: "Nothing happens", np: "केही हुँदैन", jp: "何も起こらない" }],
          correctIndex: 1,
          explanation: { en: "Without break, the switch keeps executing the following case's code too.", np: "break बिना switch ले अर्को case को code पनि चलाउँछ।", jp: "breakがないとswitchは次のケースのコードも実行し続ける。" },
        },
        {
          question: { en: "What is the main benefit of guard clauses over deeply nested if blocks?", np: "Guard clause को मुख्य फायदा के हो?", jp: "ガード節の主な利点は？" },
          options: [{ en: "They run faster", np: "छिटो चल्छ", jp: "実行が速い" }, { en: "They keep the main logic flat and easier to read", np: "Main logic flat र पढ्न सजिलो बनाउँछ", jp: "主要ロジックを平坦にし読みやすくする" }],
          correctIndex: 1,
          explanation: { en: "Guard clauses are about readability and maintainability, not performance.", np: "Guard clause readability र maintainability का लागि हो, performance होइन।", jp: "ガード節はパフォーマンスではなく可読性・保守性のためのもの。" },
        },
        {
          question: { en: "When is `switch` a better choice than a chain of `if/else if`?", np: "`if/else if` को chain भन्दा `switch` कहिले राम्रो?", jp: "`if/else if`の連鎖より`switch`が良いのはいつ？" },
          options: [{ en: "When checking many exact values of the same variable", np: "एउटै variable का धेरै exact value check गर्दा", jp: "同じ変数の多数の完全一致値を確認するとき" }, { en: "When checking numeric ranges", np: "Numeric range check गर्दा", jp: "数値範囲を確認するとき" }],
          correctIndex: 0,
          explanation: { en: "switch shines for many exact-match cases against one value; ranges still need if/else.", np: "switch एउटै value का धेरै exact-match cases मा राम्रो; range का लागि if/else चाहिन्छ।", jp: "switchは1つの値に対する多数の完全一致に向く。範囲比較にはif/elseが必要。" },
        },
      ],
    },
    {
      id: "loops",
      title: { en: "Loops", np: "Loops", jp: "ループ" },
      durationMinutes: 9,
      explanation: {
        en: "All loops repeat a block of code — they differ in <b>what</b> drives the repetition and <b>what</b> they can iterate over.\n\n• <b>for</b> — use when you need a counter or an index\n• <b>while</b> — use when the stopping condition isn't a simple count\n• <b>for...of</b> — use to walk through values in arrays, strings, Sets, and Maps\n  ↳ Gives you the value directly, no index bookkeeping\n• <b>for...in</b> — use to walk through an object's own keys\n  ↳ Not for arrays — it also visits inherited properties, which arrays rarely want",
        np: "for = counter चाहिँदा। while = simple count नभएको exit condition। for...of = array/string/Set/Map को value। for...in = object को key — array को लागि होइन।",
        jp: "for＝カウンタが必要な時。while＝単純なカウントでない終了条件。for...of＝配列・文字列・Set・Mapの値。for...in＝オブジェクトのキー（配列には不向き）。",
      },
      diagram: `for            ── needs a counter/index ──────────▶  for (let i = 0; i < 5; i++)
while          ── condition isn't a simple count ──▶  while (attempts < 3)
for...of       ── values of an iterable ───────────▶  for (const x of arr)
for...in       ── an object's own keys ─────────────▶  for (const k in obj)
                  (avoid on arrays — visits inherited props too)`,
      codeExample: {
        title: { en: "for, while, for...of, for...in — when to use each", np: "Loops — कहिले कुन?", jp: "各ループの使い分け" },
        code: `// ── for — when you need the index or a counted loop ───────────────
for (let i = 0; i < 5; i++) {
  console.log(i);  // 0 1 2 3 4
}

// ── while — when the exit condition is not a simple counter ────────
let attempts = 0;
while (attempts < 3) {
  attempts++;
}

// ── for...of — iterate over iterable values (arrays, strings, Sets, Maps)
const fruits = ["apple", "banana", "cherry"];
for (const fruit of fruits) {
  console.log(fruit);     // apple / banana / cherry
}

// ── for...in — iterate over object keys (not for arrays!)
const person = { name: "Alice", age: 30 };
for (const key in person) {
  console.log(key, person[key]);  // name Alice / age 30
}

// ── break and continue ───────────────────────────────────────────
for (let i = 0; i < 10; i++) {
  if (i === 3) continue;  // skip 3
  if (i === 7) break;     // stop at 7
  console.log(i);         // 0 1 2 4 5 6
}`,
      },
      keyTakeaways: [
        { en: "Use `for...of` for array/string/Set/Map values — it gives you the value directly with no index bookkeeping.", np: "Array/string/Set/Map को value का लागि for...of प्रयोग गर्नुहोस् — index चाहिँदैन।", jp: "配列・文字列・Set・Mapの値には`for...of`を使う。インデックス管理が不要。" },
        { en: "Never use `for...in` on arrays — it also visits inherited properties, which is almost never what you want.", np: "Array मा for...in कहिल्यै प्रयोग नगर्नुहोस् — inherited properties पनि visit गर्छ।", jp: "配列に`for...in`は使わない。継承プロパティも巡回してしまう。" },
        { en: "`break` exits the loop entirely; `continue` skips only the current iteration and moves to the next one.", np: "`break` ले loop पूरै छोड्छ; `continue` ले current iteration मात्र skip गर्छ।", jp: "`break`はループを完全に終了。`continue`は現在の反復のみスキップして次へ進む。" },
      ],
      commonMistakes: [
        { en: "Using `for...in` to loop over an array, accidentally picking up inherited properties or getting keys as strings instead of numbers.", np: "Array loop गर्न for...in प्रयोग गर्दा inherited properties वा string keys आउनु।", jp: "配列のループに`for...in`を使い、継承プロパティや文字列キーを誤って取得すること。" },
        { en: "Forgetting the increment (`i++`) in a `for` loop, causing an infinite loop that freezes the page.", np: "`for` loop मा increment (`i++`) बिर्सनु, infinite loop बन्नु।", jp: "for文で`i++`を忘れ、無限ループでページが固まること。" },
        { en: "Confusing `break` and `continue` — using `break` when you only meant to skip the current item.", np: "`break` र `continue` मिलाउनु — current item मात्र skip गर्ने चाहिँदा break प्रयोग गर्नु।", jp: "`break`と`continue`を混同すること。現在の項目だけスキップしたいのにbreakを使う。" },
      ],
      quiz: [
        {
          question: { en: "Which loop type gives you array values directly without manual indexing?", np: "कुन loop ले manual indexing बिना array value दिन्छ?", jp: "手動インデックス管理なしで配列の値を直接得られるループは？" },
          options: [{ en: "for...in", np: "for...in", jp: "for...in" }, { en: "for...of", np: "for...of", jp: "for...of" }, { en: "while", np: "while", jp: "while" }],
          correctIndex: 1,
          explanation: { en: "for...of iterates over the values of an iterable directly — no index bookkeeping needed.", np: "for...of ले iterable का values सिधै दिन्छ — index चाहिँदैन।", jp: "for...ofはイテラブルの値を直接反復し、インデックス管理が不要。" },
        },
        {
          question: { en: "What does `continue` do inside a loop?", np: "Loop भित्र `continue` ले के गर्छ?", jp: "ループ内の`continue`は何をする？" },
          options: [{ en: "Exits the loop entirely", np: "Loop पूरै छोड्छ", jp: "ループを完全に終了する" }, { en: "Skips the rest of the current iteration and moves to the next", np: "Current iteration को बाँकी skip गरी अर्कोमा जान्छ", jp: "現在の反復の残りをスキップして次に進む" }],
          correctIndex: 1,
          explanation: { en: "continue moves to the next iteration; break is what exits the loop entirely.", np: "continue ले अर्को iteration मा लैजान्छ; break ले loop पूरै छोड्छ।", jp: "continueは次の反復に進む。ループ全体を終了するのはbreak。" },
        },
        {
          question: { en: "Why should you avoid `for...in` on arrays?", np: "Array मा `for...in` किन नगर्ने?", jp: "配列で`for...in`を避けるべき理由は？" },
          options: [{ en: "It's slower than for...of", np: "for...of भन्दा ढिलो", jp: "for...ofより遅い" }, { en: "It also visits inherited properties, not just array items", np: "यसले array items मात्र होइन inherited properties पनि visit गर्छ", jp: "配列要素だけでなく継承プロパティも巡回してしまう" }],
          correctIndex: 1,
          explanation: { en: "for...in enumerates all enumerable properties, including inherited ones, which is rarely what you want on an array.", np: "for...in ले सबै enumerable properties (inherited सहित) enumerate गर्छ।", jp: "for...inは継承分を含むすべての列挙可能プロパティを列挙する。" },
        },
      ],
    },
    {
      id: "function-types",
      title: { en: "Function Types", np: "Function Types", jp: "関数の種類" },
      durationMinutes: 9,
      explanation: {
        en: "A function is just a named block of reusable code, but JavaScript gives you three syntaxes to create one — and the choice affects two things: whether the function is <b>hoisted</b>, and what `this` means inside it.\n\n• <b>Function declaration</b> — `function greet() {}` — fully hoisted, has its own `this`\n  ↳ Best for top-level, named, reusable utilities\n• <b>Function expression</b> — `const greet = function() {}` — not hoisted, has its own `this`\n  ↳ Useful when you need to pass a function around or create it conditionally\n• <b>Arrow function</b> — `const greet = () => {}` — not hoisted, borrows `this` from where it's written\n  ↳ The safe default for callbacks — no surprise `this`, no `arguments`, can't be used as a constructor",
        np: "Function declaration पूरै hoisted, आफ्नै this। Function expression hoisted हुँदैन। Arrow function ले this लाई surrounding context बाट borrow गर्छ — callback को लागि default।",
        jp: "関数宣言は完全にホイストされ独自のthisを持つ。関数式はホイストされない。アロー関数は周囲のthisを継承し、コールバックの安全なデフォルト。",
      },
      diagram: `function greet(){}         hoisted: YES    own 'this': YES
const g = function(){}    hoisted: NO     own 'this': YES
const g = () => {}        hoisted: NO     own 'this': NO (borrows from surrounding scope)`,
      codeExample: {
        title: { en: "Three ways to write a function and the 'this' difference", np: "Function को तीन तरिका र 'this' को फरक", jp: "3種類の関数と'this'の違い" },
        code: `// ── Function Declaration — hoisted, has its own 'this' ─────
function greet(name) {
  return \`Hello, \${name}!\`;
}
// You can call greet() BEFORE this line because it's fully hoisted

// ── Function Expression — NOT hoisted ────────
const greet2 = function (name) {
  return \`Hello, \${name}!\`;
};

// ── Arrow Function — concise, no own 'this' ─
const greet3 = (name) => \`Hello, \${name}!\`;

// ── Key difference: 'this' binding ─────────────────────────────────
const timer = {
  seconds: 0,
  startRegular: function () {
    setInterval(function () {
      this.seconds++;          // ❌ 'this' is undefined/window, not timer
    }, 1000);
  },
  startArrow: function () {
    setInterval(() => {
      this.seconds++;          // ✅ 'this' is the timer object
    }, 1000);
  },
};`,
      },
      keyTakeaways: [
        { en: "Function declarations are hoisted with their full body — you can call them before the line where they're written.", np: "Function declaration पूरै body सहित hoist हुन्छ — declaration अघि call गर्न मिल्छ।", jp: "関数宣言は本体ごとホイストされ、宣言前に呼び出せる。" },
        { en: "Arrow functions don't have their own `this` — they borrow it from the surrounding scope, which is exactly what you want inside callbacks like `setInterval`.", np: "Arrow function को आफ्नै this हुँदैन — surrounding scope बाट borrow गर्छ, callback भित्र यही चाहिने हो।", jp: "アロー関数は独自のthisを持たず、周囲のスコープから借用する。setIntervalのようなコールバック内で有用。" },
        { en: "Arrow functions can't be used as constructors (`new Fn()` throws) and have no `arguments` object.", np: "Arrow function लाई constructor को रूपमा प्रयोग गर्न मिल्दैन र यसमा `arguments` हुँदैन।", jp: "アロー関数はコンストラクタとして使えず、argumentsオブジェクトを持たない。" },
      ],
      commonMistakes: [
        { en: "Using a regular `function` as a callback and being surprised that `this` isn't what you expected inside it.", np: "Regular function लाई callback को रूपमा प्रयोग गर्दा `this` अनपेक्षित हुनु।", jp: "通常のfunctionをコールバックに使い、内部の`this`が期待通りでないこと。" },
        { en: "Trying to call a function expression or arrow function before its declaration line, expecting it to behave like a hoisted function declaration.", np: "Function expression/arrow function लाई declaration अघि call गर्ने प्रयास गर्नु।", jp: "関数式やアロー関数を宣言前に呼び出そうとすること。" },
        { en: "Using an arrow function as an object method when you actually need `this` to refer to the object itself.", np: "Object method मा arrow function प्रयोग गर्दा `this` ले object लाई point नगर्नु।", jp: "オブジェクトメソッドにアロー関数を使い、thisがオブジェクトを指さないこと。" },
      ],
      quiz: [
        {
          question: { en: "Which function type is fully hoisted with its body, letting you call it before its declaration?", np: "कुन function type पूरै body सहित hoist हुन्छ?", jp: "本体ごと完全にホイストされ、宣言前に呼び出せる関数の種類は？" },
          options: [{ en: "Function declaration", np: "Function declaration", jp: "関数宣言" }, { en: "Function expression", np: "Function expression", jp: "関数式" }, { en: "Arrow function", np: "Arrow function", jp: "アロー関数" }],
          correctIndex: 0,
          explanation: { en: "Only function declarations get full hoisting with their body; expressions and arrow functions are just variable assignments.", np: "Function declaration मात्र body सहित पूरै hoist हुन्छ।", jp: "関数宣言のみが本体ごと完全にホイストされる。" },
        },
        {
          question: { en: "Why are arrow functions the safe default for callbacks like setInterval?", np: "setInterval जस्ता callback मा arrow function किन default?", jp: "setIntervalのようなコールバックでアロー関数がデフォルトの理由は？" },
          options: [{ en: "They run faster", np: "छिटो चल्छ", jp: "実行が速い" }, { en: "They borrow `this` from the surrounding scope instead of losing it", np: "यिनले surrounding scope बाट this borrow गर्छन्, गुमाउँदैनन्", jp: "周囲のスコープからthisを借用し、失わない" }],
          correctIndex: 1,
          explanation: { en: "A regular function() loses the intended this inside callbacks; an arrow function keeps the outer this intact.", np: "Regular function() ले callback भित्र intended this गुमाउँछ; arrow function ले outer this कायम राख्छ।", jp: "通常のfunction()はコールバック内で意図したthisを失う。アロー関数は外側のthisを保持する。" },
        },
        {
          question: { en: "Can an arrow function be used with `new` as a constructor?", np: "Arrow function लाई `new` सँग constructor को रूपमा प्रयोग गर्न मिल्छ?", jp: "アロー関数を`new`でコンストラクタとして使える？" },
          options: [{ en: "Yes", np: "हो", jp: "はい" }, { en: "No — it throws a TypeError", np: "होइन — TypeError आउँछ", jp: "いいえ — TypeErrorが発生する" }],
          correctIndex: 1,
          explanation: { en: "Arrow functions are not constructable — attempting new arrowFn() throws a TypeError.", np: "Arrow function constructable छैन — new arrowFn() ले TypeError दिन्छ।", jp: "アロー関数はコンストラクタとして使えず、new arrowFn()はTypeErrorになる。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "If `count` is `0`, what does `count ?? 10` evaluate to?", np: "`count` 0 भएमा `count ?? 10` को नतिजा के हो?", jp: "`count`が0のとき`count ?? 10`は何になる？" },
      options: [{ en: "10", np: "10", jp: "10" }, { en: "0", np: "0", jp: "0" }],
      correctIndex: 1,
      explanation: { en: "?? only falls back on null/undefined, not on 0.", np: "?? ले null/undefined मा मात्र fallback गर्छ, 0 मा होइन।", jp: "??はnull/undefinedのみでフォールバックし、0では動作しない。" },
    },
    {
      question: { en: "What does `user?.name` return when `user` is `null`?", np: "`user` null भएमा `user?.name` ले के फर्काउँछ?", jp: "`user`がnullのとき`user?.name`は何を返す？" },
      options: [{ en: "Throws an error", np: "Error आउँछ", jp: "エラーが発生する" }, { en: "undefined", np: "undefined", jp: "undefined" }],
      correctIndex: 1,
      explanation: { en: "Optional chaining returns undefined instead of throwing when it hits a null link.", np: "Optional chaining ले null भेटिए error नफाली undefined दिन्छ।", jp: "オプショナルチェーンはnullに当たるとエラーを投げずundefinedを返す。" },
    },
    {
      question: { en: "Which comparison operator avoids implicit type coercion?", np: "कुन comparison operator ले implicit coercion avoid गर्छ?", jp: "暗黙の型変換を避ける比較演算子は？" },
      options: [{ en: "==", np: "==", jp: "==" }, { en: "===", np: "===", jp: "===" }],
      correctIndex: 1,
      explanation: { en: "=== never coerces types before comparing.", np: "=== ले comparison अघि कहिल्यै coerce गर्दैन।", jp: "===は比較前に型変換を行わない。" },
    },
    {
      question: { en: "What happens when a switch case is missing its break?", np: "Switch case मा break नभएमा के हुन्छ?", jp: "switchケースにbreakがないと？" },
      options: [{ en: "Falls through to the next case", np: "अर्को case मा fall-through हुन्छ", jp: "次のケースにフォールスルーする" }, { en: "Throws a SyntaxError", np: "SyntaxError आउँछ", jp: "SyntaxErrorが発生する" }],
      correctIndex: 0,
      explanation: { en: "Execution continues into the next case's code without break.", np: "break बिना execution अर्को case को code मा जान्छ।", jp: "breakがないと実行は次のケースのコードに続く。" },
    },
    {
      question: { en: "What is the main benefit of guard clauses?", np: "Guard clause को मुख्य फायदा के हो?", jp: "ガード節の主な利点は？" },
      options: [{ en: "Faster execution", np: "छिटो execution", jp: "実行の高速化" }, { en: "Flatter, more readable code instead of deep nesting", np: "Deep nesting भन्दा flat, पढ्न सजिलो code", jp: "深いネストの代わりに平坦で読みやすいコード" }],
      correctIndex: 1,
      explanation: { en: "Guard clauses are a readability pattern, not a performance optimization.", np: "Guard clause readability pattern हो, performance optimization होइन।", jp: "ガード節は可読性のパターンであり、パフォーマンス最適化ではない。" },
    },
    {
      question: { en: "Which loop should you use to get array values directly, without manual indexing?", np: "Manual indexing बिना array value पाउन कुन loop?", jp: "手動インデックスなしで配列の値を得るループは？" },
      options: [{ en: "for...in", np: "for...in", jp: "for...in" }, { en: "for...of", np: "for...of", jp: "for...of" }],
      correctIndex: 1,
      explanation: { en: "for...of iterates values directly; for...in iterates keys and also picks up inherited properties.", np: "for...of ले values सिधै दिन्छ; for...in ले keys दिन्छ र inherited properties पनि लिन्छ।", jp: "for...ofは値を直接反復。for...inはキーを反復し継承プロパティも取得してしまう。" },
    },
    {
      question: { en: "What does continue do inside a loop, as opposed to break?", np: "Loop भित्र `continue` ले break भन्दा फरक के गर्छ?", jp: "ループ内でcontinueはbreakと違い何をする？" },
      options: [{ en: "Exits the loop entirely", np: "Loop पूरै छोड्छ", jp: "ループを完全に終了する" }, { en: "Skips to the next iteration", np: "अर्को iteration मा जान्छ", jp: "次の反復にスキップする" }],
      correctIndex: 1,
      explanation: { en: "continue skips the rest of the current iteration; break exits the loop entirely.", np: "continue ले current iteration मात्र skip गर्छ; break ले loop पूरै छोड्छ।", jp: "continueは現在の反復のみスキップ。breakはループ全体を終了する。" },
    },
    {
      question: { en: "Which function type is fully hoisted with its body?", np: "कुन function type पूरै body सहित hoist हुन्छ?", jp: "本体ごと完全にホイストされる関数の種類は？" },
      options: [{ en: "Function declaration", np: "Function declaration", jp: "関数宣言" }, { en: "Arrow function", np: "Arrow function", jp: "アロー関数" }],
      correctIndex: 0,
      explanation: { en: "Only function declarations get full hoisting; arrow functions are just variable assignments.", np: "Function declaration मात्र पूरै hoist हुन्छ; arrow function त variable assignment मात्र हो।", jp: "関数宣言のみが完全にホイストされる。アロー関数は単なる変数代入。" },
    },
    {
      question: { en: "Why are arrow functions the safer default inside callbacks?", np: "Callback भित्र arrow function किन safer default हो?", jp: "コールバック内でアロー関数がより安全なデフォルトである理由は？" },
      options: [{ en: "They have no own `this`, so they inherit it from the surrounding scope", np: "यिनको आफ्नै this हुँदैन, surrounding scope बाट inherit गर्छन्", jp: "独自のthisを持たず、周囲のスコープから継承する" }, { en: "They execute asynchronously", np: "Asynchronously execute हुन्छन्", jp: "非同期で実行される" }],
      correctIndex: 0,
      explanation: { en: "Regular functions get a new this inside callbacks, which is often not what you want; arrow functions keep the outer this.", np: "Regular function ले callback भित्र नयाँ this पाउँछ; arrow function ले outer this कायम राख्छ।", jp: "通常の関数はコールバック内で新しいthisを持つ。アロー関数は外側のthisを保持する。" },
    },
    {
      question: { en: "Can an arrow function be used as a constructor with `new`?", np: "Arrow function लाई `new` सँग constructor को रूपमा प्रयोग गर्न मिल्छ?", jp: "アロー関数を`new`でコンストラクタとして使える？" },
      options: [{ en: "Yes", np: "हो", jp: "はい" }, { en: "No", np: "होइन", jp: "いいえ" }],
      correctIndex: 1,
      explanation: { en: "Arrow functions are not constructable — new arrowFn() throws a TypeError.", np: "Arrow function constructable छैन — TypeError आउँछ।", jp: "アロー関数はコンストラクタとして使えず、TypeErrorになる。" },
    },
  ],
};
