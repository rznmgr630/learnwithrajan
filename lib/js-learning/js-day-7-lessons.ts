import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_7_LESSONS: JsLessonDay = {
  day: 7,
  title: { en: "Arrays — Map, Filter, Reduce & Key Methods", np: "Arrays — Map, Filter, Reduce र Key Methods", jp: "配列 — map・filter・reduce・主要メソッド" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "map-filter-reduce",
      title: { en: "Transforming Arrays — map, filter, reduce", np: "Arrays Transform — map, filter, reduce", jp: "配列変換 — map・filter・reduce" },
      durationMinutes: 9,
      explanation: {
        en: "`map()`, `filter()`, and `reduce()` are three important array methods. Each has a specific job:\n\n<b>`map()`</b> — transforms every element and returns a <b>new array</b> with the same length.\n\n<b>`filter()`</b> — keeps elements that pass a condition and returns a <b>new array</b> that can be shorter.\n\n<b>`reduce()`</b> — processes the whole array and produces <b>one final value</b> (such as a number, object, or array).\n\nThey <b>do not change the original array</b>.\n\nYou can also <b>chain</b> them together:\n\n```javascript\nusers\n  .filter(user => user.active)\n  .map(user => user.name)\n  .reduce((result, name) => result + \", \" + name);\n```\n\nThink of it as:\n\n<b>Filter → Transform → Combine</b>\n\n---\n\n### 1. Basic — `map()`\n\nTransform every number:\n\n```javascript\nconst numbers = [1, 2, 3, 4];\n\nconst doubled = numbers.map(num => num * 2);\n\nconsole.log(doubled);\n// [2, 4, 6, 8]\n```\n\n`map()` runs the callback for every element and creates a new array.\n\n---\n\n### 2. Basic to Intermediate — `filter()`\n\nKeep only numbers greater than 10:\n\n```javascript\nconst numbers = [5, 12, 8, 20, 3];\n\nconst result = numbers.filter(num => num > 10);\n\nconsole.log(result);\n// [12, 20]\n```\n\nThe callback must return `true` to keep an element.\n\n---\n\n### 3. Intermediate — `map()` + `filter()`\n\nGet the names of adults:\n\n```javascript\nconst users = [\n  { name: \"Rajan\", age: 30 },\n  { name: \"Sam\", age: 16 },\n  { name: \"John\", age: 25 }\n];\n\nconst adults = users\n  .filter(user => user.age >= 18)\n  .map(user => user.name);\n\nconsole.log(adults);\n// [\"Rajan\", \"John\"]\n```\n\nFirst, `filter()` keeps the adults. Then, `map()` extracts their names.\n\n---\n\n### 4. Intermediate — `reduce()`\n\nCalculate a total:\n\n```javascript\nconst prices = [10, 20, 30];\n\nconst total = prices.reduce(\n  (sum, price) => sum + price,\n  0\n);\n\nconsole.log(total);\n// 60\n```\n\n`sum` is the <b>accumulator</b> (the value carried through each step).\n\nThe steps are:\n\n```text\n0 + 10 = 10\n10 + 20 = 30\n30 + 30 = 60\n```\n\n---\n\n### 5. Advanced — `filter()` + `map()` + `reduce()`\n\nCalculate the total price of active products:\n\n```javascript\nconst products = [\n  { name: \"Laptop\", price: 1000, active: true },\n  { name: \"Mouse\", price: 50, active: false },\n  { name: \"Keyboard\", price: 100, active: true }\n];\n\nconst total = products\n  .filter(product => product.active)\n  .map(product => product.price)\n  .reduce((sum, price) => sum + price, 0);\n\nconsole.log(total);\n// 1100\n```\n\nThe pipeline is:\n\n```text\nproducts\n   ↓\nfilter() → keep active products\n   ↓\nmap() → get their prices\n   ↓\nreduce() → add the prices\n   ↓\n1100\n```",
        np: "`map()`, `filter()`, र `reduce()` तीन महत्वपूर्ण array method हुन्। हरेकको आफ्नै काम छ:\n\n<b>`map()`</b> — हरेक element बदल्छ र उही लम्बाइको <b>नयाँ array</b> फर्काउँछ।\n\n<b>`filter()`</b> — condition पास गर्ने element राख्छ र छोटो हुन सक्ने <b>नयाँ array</b> फर्काउँछ।\n\n<b>`reduce()`</b> — पूरै array process गर्छ र <b>एउटा अन्तिम value</b> (जस्तै number, object, वा array) दिन्छ।\n\nयिनले <b>मूल array बदल्दैनन्</b>।\n\nतपाईं यिनलाई <b>chain</b> पनि गर्न सक्नुहुन्छ:\n\n```javascript\nusers\n  .filter(user => user.active)\n  .map(user => user.name)\n  .reduce((result, name) => result + \", \" + name);\n```\n\nयसरी सोच्नुहोस्:\n\n<b>Filter → Transform → Combine</b>\n\n---\n\n### 1. आधारभूत — `map()`\n\nहरेक संख्या बदल्नुहोस्:\n\n```javascript\nconst numbers = [1, 2, 3, 4];\n\nconst doubled = numbers.map(num => num * 2);\n\nconsole.log(doubled);\n// [2, 4, 6, 8]\n```\n\n`map()` ले हरेक element का लागि callback चलाउँछ र नयाँ array बनाउँछ।\n\n---\n\n### 2. आधारभूतदेखि मध्यम — `filter()`\n\n10 भन्दा ठूला संख्या मात्र राख्नुहोस्:\n\n```javascript\nconst numbers = [5, 12, 8, 20, 3];\n\nconst result = numbers.filter(num => num > 10);\n\nconsole.log(result);\n// [12, 20]\n```\n\nElement राख्न callback ले `true` फर्काउनुपर्छ।\n\n---\n\n### 3. मध्यम — `map()` + `filter()`\n\nवयस्कका नाम लिनुहोस्:\n\n```javascript\nconst users = [\n  { name: \"Rajan\", age: 30 },\n  { name: \"Sam\", age: 16 },\n  { name: \"John\", age: 25 }\n];\n\nconst adults = users\n  .filter(user => user.age >= 18)\n  .map(user => user.name);\n\nconsole.log(adults);\n// [\"Rajan\", \"John\"]\n```\n\nपहिले `filter()` ले वयस्क राख्छ। त्यसपछि `map()` ले तिनका नाम निकाल्छ।\n\n---\n\n### 4. मध्यम — `reduce()`\n\nजम्मा गणना गर्नुहोस्:\n\n```javascript\nconst prices = [10, 20, 30];\n\nconst total = prices.reduce(\n  (sum, price) => sum + price,\n  0\n);\n\nconsole.log(total);\n// 60\n```\n\n`sum` <b>accumulator</b> (हरेक चरणमा बोकिने value) हो।\n\nचरणहरू:\n\n```text\n0 + 10 = 10\n10 + 20 = 30\n30 + 30 = 60\n```\n\n---\n\n### 5. उन्नत — `filter()` + `map()` + `reduce()`\n\nसक्रिय product को कुल मूल्य गणना गर्नुहोस्:\n\n```javascript\nconst products = [\n  { name: \"Laptop\", price: 1000, active: true },\n  { name: \"Mouse\", price: 50, active: false },\n  { name: \"Keyboard\", price: 100, active: true }\n];\n\nconst total = products\n  .filter(product => product.active)\n  .map(product => product.price)\n  .reduce((sum, price) => sum + price, 0);\n\nconsole.log(total);\n// 1100\n```\n\nPipeline यो हो:\n\n```text\nproducts\n   ↓\nfilter() → keep active products\n   ↓\nmap() → get their prices\n   ↓\nreduce() → add the prices\n   ↓\n1100\n```",
        jp: "`map()`・`filter()`・`reduce()` は重要な配列メソッドです。それぞれ役割があります:\n\n<b>`map()`</b> — すべての要素を変換し、同じ長さの<b>新しい配列</b>を返す。\n\n<b>`filter()`</b> — 条件を満たす要素だけを残し、短くなりうる<b>新しい配列</b>を返す。\n\n<b>`reduce()`</b> — 配列全体を処理して<b>1つの最終的な値</b>（数値・オブジェクト・配列など）を作る。\n\nいずれも<b>元の配列は変更しません</b>。\n\nつなげて<b>チェーン</b>することもできます:\n\n```javascript\nusers\n  .filter(user => user.active)\n  .map(user => user.name)\n  .reduce((result, name) => result + \", \" + name);\n```\n\nこう考えてください:\n\n<b>絞る → 変換する → まとめる</b>\n\n---\n\n### 1. 基本 — `map()`\n\nすべての数値を変換する:\n\n```javascript\nconst numbers = [1, 2, 3, 4];\n\nconst doubled = numbers.map(num => num * 2);\n\nconsole.log(doubled);\n// [2, 4, 6, 8]\n```\n\n`map()` は各要素にコールバックを実行し、新しい配列を作ります。\n\n---\n\n### 2. 基本から中級 — `filter()`\n\n10より大きい数値だけを残す:\n\n```javascript\nconst numbers = [5, 12, 8, 20, 3];\n\nconst result = numbers.filter(num => num > 10);\n\nconsole.log(result);\n// [12, 20]\n```\n\n要素を残すにはコールバックが `true` を返す必要があります。\n\n---\n\n### 3. 中級 — `map()` + `filter()`\n\n成人の名前を取り出す:\n\n```javascript\nconst users = [\n  { name: \"Rajan\", age: 30 },\n  { name: \"Sam\", age: 16 },\n  { name: \"John\", age: 25 }\n];\n\nconst adults = users\n  .filter(user => user.age >= 18)\n  .map(user => user.name);\n\nconsole.log(adults);\n// [\"Rajan\", \"John\"]\n```\n\nまず `filter()` が成人を残し、次に `map()` が名前を取り出します。\n\n---\n\n### 4. 中級 — `reduce()`\n\n合計を計算する:\n\n```javascript\nconst prices = [10, 20, 30];\n\nconst total = prices.reduce(\n  (sum, price) => sum + price,\n  0\n);\n\nconsole.log(total);\n// 60\n```\n\n`sum` が<b>アキュムレータ</b>（各ステップで持ち越される値）です。\n\n手順:\n\n```text\n0 + 10 = 10\n10 + 20 = 30\n30 + 30 = 60\n```\n\n---\n\n### 5. 上級 — `filter()` + `map()` + `reduce()`\n\n有効な商品の合計金額を計算する:\n\n```javascript\nconst products = [\n  { name: \"Laptop\", price: 1000, active: true },\n  { name: \"Mouse\", price: 50, active: false },\n  { name: \"Keyboard\", price: 100, active: true }\n];\n\nconst total = products\n  .filter(product => product.active)\n  .map(product => product.price)\n  .reduce((sum, price) => sum + price, 0);\n\nconsole.log(total);\n// 1100\n```\n\nパイプラインはこうです:\n\n```text\nproducts\n   ↓\nfilter() → keep active products\n   ↓\nmap() → get their prices\n   ↓\nreduce() → add the prices\n   ↓\n1100\n```",
      },
      diagram: `Array
  │
  ├── filter() → keep what you need
  │
  ├── map()    → change each item
  │
  └── reduce() → create one final result`,
      codeExample: {
        title: { en: "From one method to a full pipeline", np: "एउटा method देखि पूरै pipeline सम्म", jp: "1つのメソッドから完全なパイプラインまで" },
        code: `// ── 1. Basic — map() ──────────────────────────────────────────────
const numbers = [1, 2, 3, 4];

const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8]

// ── 2. Basic to intermediate — filter() ───────────────────────────
const values = [5, 12, 8, 20, 3];

const big = values.filter(num => num > 10);
console.log(big); // [12, 20]

// ── 3. Intermediate — filter() + map() ────────────────────────────
const users = [
  { name: "Rajan", age: 30 },
  { name: "Sam", age: 16 },
  { name: "John", age: 25 }
];

const adults = users
  .filter(user => user.age >= 18)
  .map(user => user.name);

console.log(adults); // ["Rajan", "John"]

// ── 4. Intermediate — reduce() ────────────────────────────────────
const prices = [10, 20, 30];

const sumOfPrices = prices.reduce((sum, price) => sum + price, 0);
console.log(sumOfPrices); // 60

// ── 5. Advanced — the full pipeline ───────────────────────────────
const products = [
  { name: "Laptop", price: 1000, active: true },
  { name: "Mouse", price: 50, active: false },
  { name: "Keyboard", price: 100, active: true }
];

const total = products
  .filter(product => product.active)
  .map(product => product.price)
  .reduce((sum, price) => sum + price, 0);

console.log(total); // 1100`,
      },
      keyTakeaways: [
        { en: "`map()` → <b>transform every item</b>.", np: "`map()` → <b>हरेक item बदल्नु</b>।", jp: "`map()` → <b>すべての要素を変換する</b>。" },
        { en: "`filter()` → <b>keep matching items</b>.", np: "`filter()` → <b>मिल्ने item राख्नु</b>।", jp: "`filter()` → <b>条件に合う要素を残す</b>。" },
        { en: "`reduce()` → <b>combine items into one result</b>.", np: "`reduce()` → <b>item लाई एउटै नतिजामा जोड्नु</b>।", jp: "`reduce()` → <b>要素を1つの結果にまとめる</b>。" },
        { en: "`map()` and `filter()` return arrays.", np: "`map()` र `filter()` ले array फर्काउँछन्।", jp: "`map()` と `filter()` は配列を返す。" },
        { en: "`reduce()` can return any value.", np: "`reduce()` ले जुनसुकै value फर्काउन सक्छ।", jp: "`reduce()` はどんな値でも返せる。" },
        { en: "These methods don't change the original array.", np: "यी method ले मूल array बदल्दैनन्।", jp: "これらのメソッドは元の配列を変更しない。" },
        { en: "You can combine them into a <b>pipeline</b> (a sequence of operations).", np: "तपाईं यिनलाई <b>pipeline</b> (कार्यहरूको क्रम) मा जोड्न सक्नुहुन्छ।", jp: "これらを<b>パイプライン</b>（処理の連なり）に組み合わせられる。" },
      ],
      commonMistakes: [
        { en: "<b>Using `map()` when you want to remove items</b> — `map()` always returns the same number of elements; use `filter()` to drop them.", np: "<b>Item हटाउन `map()` प्रयोग गर्नु</b> — `map()` ले सधैं उही संख्याको element फर्काउँछ; हटाउन `filter()` प्रयोग गर्नुहोस्।", jp: "<b>要素を取り除きたいのに `map()` を使う</b> — `map()` は常に同じ数を返す。落とすなら `filter()`。" },
        { en: "<b>Using `filter()` when you want to transform items</b> — `filter()` only keeps or drops; it never changes a value.", np: "<b>Item बदल्न `filter()` प्रयोग गर्नु</b> — `filter()` ले राख्ने वा हटाउने मात्र गर्छ; value कहिल्यै बदल्दैन।", jp: "<b>要素を変換したいのに `filter()` を使う</b> — `filter()` は残すか落とすかだけで、値は変えない。" },
        { en: "<b>Forgetting to return a value from `map()`</b> — a callback with braces and no `return` fills the new array with `undefined`.", np: "<b>`map()` बाट value return गर्न बिर्सनु</b> — brace भएको तर `return` नभएको callback ले नयाँ array लाई `undefined` ले भर्छ।", jp: "<b>`map()` で値を返し忘れる</b> — 波括弧があって `return` がないと、新しい配列は `undefined` で埋まる。" },
        { en: "<b>Using `reduce()` when `map()` or `filter()` would be simpler</b> — pick the method that names your intent.", np: "<b>`map()` वा `filter()` सजिलो हुँदा `reduce()` प्रयोग गर्नु</b> — उद्देश्य बताउने method छान्नुहोस्।", jp: "<b>`map()` や `filter()` で足りるのに `reduce()` を使う</b> — 意図を名前で表せるメソッドを選ぶ。" },
        { en: "<b>Making a long `reduce()` when a simple loop would be easier to understand</b> — readability beats cleverness.", np: "<b>सरल loop बुझ्न सजिलो हुँदा लामो `reduce()` लेख्नु</b> — पढ्न सजिलो हुनु चलाखी भन्दा राम्रो।", jp: "<b>単純なループの方が分かりやすいのに長い `reduce()` を書く</b> — 賢さより読みやすさ。" },
      ],
      quiz: [
        {
          question: { en: "What does `map()` do?", np: "`map()` ले के गर्छ?", jp: "`map()` は何をするか?" },
          options: [
            { en: "Removes items", np: "Item हटाउँछ", jp: "要素を取り除く" },
            { en: "Combines everything into one value", np: "सबैलाई एउटै value मा जोड्छ", jp: "すべてを1つの値にまとめる" },
            { en: "Transforms every item", np: "हरेक item बदल्छ", jp: "すべての要素を変換する" },
          ],
          correctIndex: 2,
          explanation: { en: "It returns a new array of the same length, one transformed item per input.", np: "यसले उही लम्बाइको नयाँ array फर्काउँछ, हरेक input का लागि एउटा बदलिएको item।", jp: "同じ長さの新しい配列を返す。入力1つにつき変換後の要素が1つ。" },
        },
        {
          question: { en: "What does `filter()` do?", np: "`filter()` ले के गर्छ?", jp: "`filter()` は何をするか?" },
          options: [
            { en: "Keeps items that pass a condition", np: "Condition पास गर्ने item राख्छ", jp: "条件を満たす要素を残す" },
            { en: "Changes every item", np: "हरेक item बदल्छ", jp: "すべての要素を変える" },
            { en: "Sorts the array", np: "Array क्रमबद्ध गर्छ", jp: "配列を並べ替える" },
          ],
          correctIndex: 0,
          explanation: { en: "The callback returns `true` to keep an element and `false` to drop it.", np: "Callback ले element राख्न `true` र हटाउन `false` फर्काउँछ।", jp: "コールバックが `true` を返せば残り、`false` なら落とされる。" },
        },
        {
          question: { en: "What does `reduce()` do?", np: "`reduce()` ले के गर्छ?", jp: "`reduce()` は何をするか?" },
          options: [
            { en: "Always returns an array", np: "सधैं array फर्काउँछ", jp: "常に配列を返す" },
            { en: "Builds one final result from an array", np: "Array बाट एउटा अन्तिम नतिजा बनाउँछ", jp: "配列から1つの最終結果を作る" },
            { en: "Removes duplicate values", np: "दोहोरिएका value हटाउँछ", jp: "重複した値を取り除く" },
          ],
          correctIndex: 1,
          explanation: { en: "That result can be a number, a string, an object or even another array.", np: "त्यो नतिजा number, string, object वा अर्को array पनि हुन सक्छ।", jp: "その結果は数値・文字列・オブジェクト、さらには別の配列にもなりうる。" },
        },
        {
          question: { en: "What does `[1, 2, 3].filter(n => n > 1).map(n => n * 10)` produce?", np: "`[1, 2, 3].filter(n => n > 1).map(n => n * 10)` ले के दिन्छ?", jp: "`[1, 2, 3].filter(n => n > 1).map(n => n * 10)` は何を返すか?" },
          options: [
            { en: "`[1, 2, 3]`", np: "`[1, 2, 3]`", jp: "`[1, 2, 3]`" },
            { en: "`60`", np: "`60`", jp: "`60`" },
            { en: "`[20, 30]`", np: "`[20, 30]`", jp: "`[20, 30]`" },
          ],
          correctIndex: 2,
          explanation: { en: "`filter()` leaves `[2, 3]`, then `map()` multiplies each by ten.", np: "`filter()` ले `[2, 3]` छोड्छ, त्यसपछि `map()` ले हरेकलाई दसले गुणन गर्छ।", jp: "`filter()` が `[2, 3]` を残し、`map()` が各要素を10倍する。" },
        },
      ],
    },
    {
      id: "find-some-every-includes",
      title: { en: "Finding & Testing — find, some, every, includes", np: "Find र Testing — find, some, every, includes", jp: "検索・テスト — find・some・every・includes" },
      durationMinutes: 9,
      explanation: {
        en: "These methods help you <b>find something</b> or <b>check a condition</b> in an array.\n\nThey stop as soon as they know the answer, so they can be better than `filter()` when you only need one result or a `true`/`false` answer.\n\n<b>`find()`</b> — returns the <b>first matching element</b>, or `undefined`.\n\n<b>`findIndex()`</b> — returns the <b>index</b> of the first matching element, or `-1`.\n\n<b>`some()`</b> — returns `true` if <b>at least one</b> element matches.\n\n<b>`every()`</b> — returns `true` only if <b>all</b> elements match.\n\n<b>`includes()`</b> — checks whether an array contains a specific value and returns `true` or `false`.\n\n---\n\n### 1. Basic — `find()`\n\nFind the first number greater than 10:\n\n```javascript\nconst numbers = [5, 12, 8, 20];\n\nconst result = numbers.find(num => num > 10);\n\nconsole.log(result);\n// 12\n```\n\n`find()` stops after finding `12`.\n\n---\n\n### 2. Basic — `includes()`\n\nCheck whether a value exists:\n\n```javascript\nconst fruits = [\"apple\", \"banana\", \"orange\"];\n\nconsole.log(fruits.includes(\"banana\"));\n// true\n\nconsole.log(fruits.includes(\"mango\"));\n// false\n```\n\nUse `includes()` when you already know the value you are looking for.\n\n---\n\n### 3. Intermediate — `findIndex()`\n\nFind where a user appears:\n\n```javascript\nconst users = [\n  { id: 1, name: \"Rajan\" },\n  { id: 2, name: \"John\" },\n  { id: 3, name: \"Sam\" }\n];\n\nconst index = users.findIndex(user => user.id === 2);\n\nconsole.log(index);\n// 1\n```\n\nIf no user matches, `findIndex()` returns `-1`.\n\n---\n\n### 4. Intermediate — `some()`\n\nCheck whether at least one user is an admin:\n\n```javascript\nconst users = [\n  { name: \"Rajan\", admin: false },\n  { name: \"John\", admin: true },\n  { name: \"Sam\", admin: false }\n];\n\nconst hasAdmin = users.some(user => user.admin);\n\nconsole.log(hasAdmin);\n// true\n```\n\nYou don't need to know <b>which</b> user is an admin. You only need a yes/no answer.\n\n---\n\n### 5. Advanced — `every()`\n\nCheck whether all products are in stock:\n\n```javascript\nconst products = [\n  { name: \"Laptop\", stock: 5 },\n  { name: \"Mouse\", stock: 10 },\n  { name: \"Keyboard\", stock: 2 }\n];\n\nconst allInStock = products.every(product => product.stock > 0);\n\nconsole.log(allInStock);\n// true\n```\n\nIf even one product has `stock: 0`, the result becomes `false`.\n\n---\n\n### 6. Real-World — choosing the right method\n\nChoose the method based on the question:\n\n```text\n\"Which user?\"            → find()\n\"Where is the user?\"     → findIndex()\n\"Does at least one?\"     → some()\n\"Do all?\"                → every()\n\"Does this value exist?\" → includes()\n```",
        np: "यी method ले array मा <b>केही खोज्न</b> वा <b>condition जाँच्न</b> मद्दत गर्छन्।\n\nजवाफ थाहा भएको बित्तिकै यी रोकिन्छन्, त्यसैले एउटै नतिजा वा `true`/`false` जवाफ मात्र चाहिँदा यी `filter()` भन्दा राम्रा हुन सक्छन्।\n\n<b>`find()`</b> — <b>पहिलो मिल्ने element</b>, वा `undefined` फर्काउँछ।\n\n<b>`findIndex()`</b> — पहिलो मिल्ने element को <b>index</b>, वा `-1` फर्काउँछ।\n\n<b>`some()`</b> — <b>कम्तीमा एउटा</b> element मिल्यो भने `true` फर्काउँछ।\n\n<b>`every()`</b> — <b>सबै</b> element मिले मात्र `true` फर्काउँछ।\n\n<b>`includes()`</b> — array मा निश्चित value छ कि छैन जाँच्छ र `true` वा `false` फर्काउँछ।\n\n---\n\n### 1. आधारभूत — `find()`\n\n10 भन्दा ठूलो पहिलो संख्या खोज्नुहोस्:\n\n```javascript\nconst numbers = [5, 12, 8, 20];\n\nconst result = numbers.find(num => num > 10);\n\nconsole.log(result);\n// 12\n```\n\n`find()` `12` भेटेपछि रोकिन्छ।\n\n---\n\n### 2. आधारभूत — `includes()`\n\nValue छ कि छैन जाँच्नुहोस्:\n\n```javascript\nconst fruits = [\"apple\", \"banana\", \"orange\"];\n\nconsole.log(fruits.includes(\"banana\"));\n// true\n\nconsole.log(fruits.includes(\"mango\"));\n// false\n```\n\nखोजिरहेको value पहिले नै थाहा हुँदा `includes()` प्रयोग गर्नुहोस्।\n\n---\n\n### 3. मध्यम — `findIndex()`\n\nUser कहाँ छ भेट्टाउनुहोस्:\n\n```javascript\nconst users = [\n  { id: 1, name: \"Rajan\" },\n  { id: 2, name: \"John\" },\n  { id: 3, name: \"Sam\" }\n];\n\nconst index = users.findIndex(user => user.id === 2);\n\nconsole.log(index);\n// 1\n```\n\nकुनै user नमिले, `findIndex()` ले `-1` फर्काउँछ।\n\n---\n\n### 4. मध्यम — `some()`\n\nकम्तीमा एउटा user admin छ कि जाँच्नुहोस्:\n\n```javascript\nconst users = [\n  { name: \"Rajan\", admin: false },\n  { name: \"John\", admin: true },\n  { name: \"Sam\", admin: false }\n];\n\nconst hasAdmin = users.some(user => user.admin);\n\nconsole.log(hasAdmin);\n// true\n```\n\n<b>कुन</b> user admin हो थाहा हुनु पर्दैन। तपाईंलाई हो/होइन जवाफ मात्र चाहिन्छ।\n\n---\n\n### 5. उन्नत — `every()`\n\nसबै product stock मा छन् कि जाँच्नुहोस्:\n\n```javascript\nconst products = [\n  { name: \"Laptop\", stock: 5 },\n  { name: \"Mouse\", stock: 10 },\n  { name: \"Keyboard\", stock: 2 }\n];\n\nconst allInStock = products.every(product => product.stock > 0);\n\nconsole.log(allInStock);\n// true\n```\n\nएउटै product को `stock: 0` भए पनि नतिजा `false` हुन्छ।\n\n---\n\n### 6. वास्तविक प्रयोग — सही method छान्नु\n\nप्रश्न अनुसार method छान्नुहोस्:\n\n```text\n\"Which user?\"            → find()\n\"Where is the user?\"     → findIndex()\n\"Does at least one?\"     → some()\n\"Do all?\"                → every()\n\"Does this value exist?\" → includes()\n```",
        jp: "これらのメソッドは配列の中で<b>何かを探す</b>、あるいは<b>条件を確かめる</b>のに役立ちます。\n\n答えが分かった時点で止まるので、1件だけ欲しいときや `true`/`false` だけ欲しいときは `filter()` より適しています。\n\n<b>`find()`</b> — <b>最初に一致した要素</b>、なければ `undefined` を返す。\n\n<b>`findIndex()`</b> — 最初に一致した要素の<b>添字</b>、なければ `-1` を返す。\n\n<b>`some()`</b> — <b>少なくとも1つ</b>一致すれば `true` を返す。\n\n<b>`every()`</b> — <b>すべて</b>一致したときだけ `true` を返す。\n\n<b>`includes()`</b> — 配列に特定の値が含まれるかを調べ、`true` か `false` を返す。\n\n---\n\n### 1. 基本 — `find()`\n\n10より大きい最初の数値を探す:\n\n```javascript\nconst numbers = [5, 12, 8, 20];\n\nconst result = numbers.find(num => num > 10);\n\nconsole.log(result);\n// 12\n```\n\n`find()` は `12` を見つけた時点で止まります。\n\n---\n\n### 2. 基本 — `includes()`\n\n値が存在するか調べる:\n\n```javascript\nconst fruits = [\"apple\", \"banana\", \"orange\"];\n\nconsole.log(fruits.includes(\"banana\"));\n// true\n\nconsole.log(fruits.includes(\"mango\"));\n// false\n```\n\n探している値がすでに分かっているときは `includes()` を使います。\n\n---\n\n### 3. 中級 — `findIndex()`\n\nユーザーの位置を探す:\n\n```javascript\nconst users = [\n  { id: 1, name: \"Rajan\" },\n  { id: 2, name: \"John\" },\n  { id: 3, name: \"Sam\" }\n];\n\nconst index = users.findIndex(user => user.id === 2);\n\nconsole.log(index);\n// 1\n```\n\n一致するユーザーがいなければ `findIndex()` は `-1` を返します。\n\n---\n\n### 4. 中級 — `some()`\n\n管理者が1人でもいるか調べる:\n\n```javascript\nconst users = [\n  { name: \"Rajan\", admin: false },\n  { name: \"John\", admin: true },\n  { name: \"Sam\", admin: false }\n];\n\nconst hasAdmin = users.some(user => user.admin);\n\nconsole.log(hasAdmin);\n// true\n```\n\n<b>誰が</b>管理者かを知る必要はありません。はい／いいえだけで十分です。\n\n---\n\n### 5. 上級 — `every()`\n\nすべての商品に在庫があるか調べる:\n\n```javascript\nconst products = [\n  { name: \"Laptop\", stock: 5 },\n  { name: \"Mouse\", stock: 10 },\n  { name: \"Keyboard\", stock: 2 }\n];\n\nconst allInStock = products.every(product => product.stock > 0);\n\nconsole.log(allInStock);\n// true\n```\n\n1つでも `stock: 0` があれば結果は `false` になります。\n\n---\n\n### 6. 実践 — 正しいメソッドを選ぶ\n\n問いに合わせてメソッドを選びます:\n\n```text\n\"Which user?\"            → find()\n\"Where is the user?\"     → findIndex()\n\"Does at least one?\"     → some()\n\"Do all?\"                → every()\n\"Does this value exist?\" → includes()\n```",
      },
      diagram: `Array
 │
 ├── find()       → Which item matches first?
 │
 ├── findIndex()  → Where is the first match?
 │
 ├── some()       → Does at least one match?
 │
 ├── every()      → Do all match?
 │
 └── includes()   → Does this exact value exist?`,
      codeExample: {
        title: { en: "Searching, then testing, then choosing", np: "खोज्नु, जाँच्नु, अनि छान्नु", jp: "探す・確かめる・選ぶ" },
        code: `// ── 1. Basic — find() ─────────────────────────────────────────────
const numbers = [5, 12, 8, 20];

console.log(numbers.find(num => num > 10)); // 12

// ── 2. Basic — includes() ─────────────────────────────────────────
const fruits = ["apple", "banana", "orange"];

console.log(fruits.includes("banana")); // true
console.log(fruits.includes("mango"));  // false

// ── 3. Intermediate — findIndex() ─────────────────────────────────
const people = [
  { id: 1, name: "Rajan" },
  { id: 2, name: "John" },
  { id: 3, name: "Sam" }
];

console.log(people.findIndex(person => person.id === 2)); // 1

// ── 4. Intermediate — some() ──────────────────────────────────────
const staff = [
  { name: "Rajan", admin: false },
  { name: "John", admin: true }
];

console.log(staff.some(person => person.admin)); // true

// ── 5. Advanced — every() ─────────────────────────────────────────
const products = [
  { name: "Laptop", stock: 5 },
  { name: "Keyboard", stock: 2 }
];

console.log(products.every(product => product.stock > 0)); // true

// ── 6. Real-world — pick the method that answers your question ────
const users = [
  { id: 1, name: "Rajan", active: true },
  { id: 2, name: "John", active: false },
  { id: 3, name: "Sam", active: true }
];

const user = users.find(u => u.id === 2);
const hasInactiveUser = users.some(u => !u.active);
const allActive = users.every(u => u.active);

console.log(user);            // { id: 2, name: "John", active: false }
console.log(hasInactiveUser); // true
console.log(allActive);       // false`,
      },
      keyTakeaways: [
        { en: "`find()` → <b>first matching item</b>.", np: "`find()` → <b>पहिलो मिल्ने item</b>।", jp: "`find()` → <b>最初に一致した要素</b>。" },
        { en: "`findIndex()` → <b>index of the first matching item</b>.", np: "`findIndex()` → <b>पहिलो मिल्ने item को index</b>।", jp: "`findIndex()` → <b>最初に一致した要素の添字</b>。" },
        { en: "`some()` → <b>at least one matches</b>.", np: "`some()` → <b>कम्तीमा एउटा मिल्छ</b>।", jp: "`some()` → <b>少なくとも1つ一致する</b>。" },
        { en: "`every()` → <b>all match</b>.", np: "`every()` → <b>सबै मिल्छन्</b>।", jp: "`every()` → <b>すべて一致する</b>。" },
        { en: "`includes()` → <b>value exists</b>.", np: "`includes()` → <b>value छ</b>।", jp: "`includes()` → <b>値が存在する</b>。" },
        { en: "These methods stop early when they already know the answer.", np: "जवाफ थाहा भइसकेपछि यी method चाँडै रोकिन्छन्।", jp: "これらは答えが分かった時点で早く止まる。" },
        { en: "Use `find()` instead of `filter()` when you only need the <b>first match</b>.", np: "<b>पहिलो match</b> मात्र चाहिँदा `filter()` को साटो `find()` प्रयोग गर्नुहोस्।", jp: "<b>最初の一致</b>だけが必要なら `filter()` ではなく `find()` を使う。" },
      ],
      commonMistakes: [
        { en: "<b>Using `filter()` when you only need one matching item</b> — it walks the whole array and hands back an array you then have to index into.", np: "<b>एउटा मिल्ने item मात्र चाहिँदा `filter()` प्रयोग गर्नु</b> — यसले पूरै array घुम्छ र array फर्काउँछ, जसबाट तपाईंले फेरि item निकाल्नुपर्छ।", jp: "<b>1件だけでよいのに `filter()` を使う</b> — 配列全体を走査し、さらに添字で取り出す必要のある配列を返す。" },
        { en: "<b>Forgetting that `find()` returns `undefined` when nothing matches</b> — reading a property off that result throws a `TypeError`.", np: "<b>केही नमिले `find()` ले `undefined` फर्काउँछ भनी बिर्सनु</b> — त्यो नतिजाबाट property पढ्दा `TypeError` आउँछ।", jp: "<b>一致がないと `find()` が `undefined` を返すことを忘れる</b> — その結果からプロパティを読むと `TypeError` になる。" },
        { en: "<b>Forgetting that `findIndex()` returns `-1` when nothing matches</b> — `-1` is a valid array index from the end in some APIs, so check explicitly.", np: "<b>केही नमिले `findIndex()` ले `-1` फर्काउँछ भनी बिर्सनु</b> — केही API मा `-1` अन्त्यबाटको मान्य index हो, त्यसैले स्पष्ट जाँच्नुहोस्।", jp: "<b>一致がないと `findIndex()` が `-1` を返すことを忘れる</b> — API によっては `-1` が末尾からの有効な添字なので、明示的に確認する。" },
        { en: "<b>Using `every()` when you actually mean \"at least one\"</b> — that is `some()`.", np: "<b>\"कम्तीमा एउटा\" भन्न खोज्दा `every()` प्रयोग गर्नु</b> — त्यो `some()` हो।", jp: "<b>「少なくとも1つ」のつもりで `every()` を使う</b> — それは `some()` の役目。" },
        { en: "<b>Using `includes()` to search objects by a property</b> — `includes()` compares whole values, so use `find()` or `some()` instead.", np: "<b>Property अनुसार object खोज्न `includes()` प्रयोग गर्नु</b> — `includes()` ले पूरै value तुलना गर्छ, त्यसैले `find()` वा `some()` प्रयोग गर्नुहोस्।", jp: "<b>プロパティでオブジェクトを探すのに `includes()` を使う</b> — `includes()` は値全体を比較するので、`find()` か `some()` を使う。" },
      ],
      quiz: [
        {
          question: { en: "Which method returns the first matching element?", np: "कुन method ले पहिलो मिल्ने element फर्काउँछ?", jp: "最初に一致した要素を返すのはどれか?" },
          options: [
            { en: "`find()`", np: "`find()`", jp: "`find()`" },
            { en: "`filter()`", np: "`filter()`", jp: "`filter()`" },
            { en: "`some()`", np: "`some()`", jp: "`some()`" },
          ],
          correctIndex: 0,
          explanation: { en: "`filter()` returns every match as an array and `some()` returns a boolean.", np: "`filter()` ले सबै match array मा फर्काउँछ र `some()` ले boolean फर्काउँछ।", jp: "`filter()` は一致すべてを配列で、`some()` は真偽値を返す。" },
        },
        {
          question: { en: "What does `some()` return?", np: "`some()` ले के फर्काउँछ?", jp: "`some()` は何を返すか?" },
          options: [
            { en: "The matching element", np: "मिल्ने element", jp: "一致した要素" },
            { en: "`true` if at least one element matches", np: "कम्तीमा एउटा element मिले `true`", jp: "少なくとも1つ一致すれば `true`" },
            { en: "The matching index", np: "मिल्ने index", jp: "一致した添字" },
          ],
          correctIndex: 1,
          explanation: { en: "It answers a yes/no question, so it never tells you which element matched.", np: "यसले हो/होइन प्रश्नको जवाफ दिन्छ, त्यसैले कुन element मिल्यो भन्दैन।", jp: "はい／いいえに答えるだけなので、どの要素が一致したかは分からない。" },
        },
        {
          question: { en: "What does `every()` check?", np: "`every()` ले के जाँच्छ?", jp: "`every()` は何を確かめるか?" },
          options: [
            { en: "Whether a value exists", np: "Value छ कि", jp: "値が存在するか" },
            { en: "Whether one element matches", np: "एउटा element मिल्छ कि", jp: "1つの要素が一致するか" },
            { en: "Whether all elements match", np: "सबै element मिल्छन् कि", jp: "すべての要素が一致するか" },
          ],
          correctIndex: 2,
          explanation: { en: "A single failing element makes the whole result `false`.", np: "एउटै element नमिले पूरै नतिजा `false` हुन्छ।", jp: "1つでも条件を満たさなければ全体が `false` になる。" },
        },
        {
          question: { en: "What does `[2, 4, 6].find(num => num > 10)` return?", np: "`[2, 4, 6].find(num => num > 10)` ले के फर्काउँछ?", jp: "`[2, 4, 6].find(num => num > 10)` は何を返すか?" },
          options: [
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
            { en: "`-1`", np: "`-1`", jp: "`-1`" },
            { en: "`[]`", np: "`[]`", jp: "`[]`" },
          ],
          correctIndex: 0,
          explanation: { en: "`find()` gives `undefined` when nothing matches; `-1` is what `findIndex()` returns.", np: "केही नमिले `find()` ले `undefined` दिन्छ; `-1` `findIndex()` ले फर्काउँछ।", jp: "一致がなければ `find()` は `undefined`。`-1` を返すのは `findIndex()`。" },
        },
      ],
    },
    {
      id: "sort-splice-flat-foreach",
      title: { en: "Mutating Methods — sort, splice, flat & forEach", np: "Mutating Methods — sort, splice, flat, forEach", jp: "配列変更メソッド — sort・splice・flat・forEach" },
      durationMinutes: 9,
      explanation: {
        en: "Some array methods <b>mutate</b> (change) the original array, while others create a new result.\n\nThis is important when working with React or Redux because changing an existing array directly can cause bugs.\n\n<b>`sort()`</b> — changes the original array and sorts its elements.\n\n<b>`splice()`</b> — changes the original array by removing, adding, or replacing elements.\n\n<b>`flat()`</b> — creates a new array by removing nested array levels.\n\n<b>`flatMap()`</b> — runs `map()` and then flattens one level.\n\n<b>`forEach()`</b> — runs code for every element but returns `undefined`.\n\n---\n\n### 1. Basic — `sort()`\n\nSort numbers from smallest to largest:\n\n```javascript\nconst numbers = [10, 2, 5, 1];\n\nnumbers.sort((a, b) => a - b);\n\nconsole.log(numbers);\n// [1, 2, 5, 10]\n```\n\nAlways use a <b>comparator</b> (function that tells `sort()` how to compare values) for numbers.\n\nWithout one:\n\n```javascript\n[10, 2, 5, 1].sort();\n// [1, 10, 2, 5]\n```\n\nJavaScript treats the values like strings when no comparator is provided.\n\n---\n\n### 2. Basic — `splice()`\n\nRemove elements from an array:\n\n```javascript\nconst fruits = [\"apple\", \"banana\", \"orange\", \"mango\"];\n\nfruits.splice(1, 2);\n\nconsole.log(fruits);\n// [\"apple\", \"mango\"]\n```\n\n`splice(start, deleteCount)` means:\n\n• Start at index `1`\n• Remove `2` elements\n\n`splice()` changes the original array.\n\n---\n\n### 3. Intermediate — `splice()` to add or replace\n\nYou can also add elements:\n\n```javascript\nconst fruits = [\"apple\", \"orange\"];\n\nfruits.splice(1, 0, \"banana\");\n\nconsole.log(fruits);\n// [\"apple\", \"banana\", \"orange\"]\n```\n\nOr replace an element:\n\n```javascript\nconst fruits = [\"apple\", \"banana\", \"orange\"];\n\nfruits.splice(1, 1, \"mango\");\n\nconsole.log(fruits);\n// [\"apple\", \"mango\", \"orange\"]\n```\n\nIf you want a similar operation <b>without changing the original</b>, use `slice()` (no `p`).\n\n---\n\n### 4. Intermediate — `flat()`\n\nFlatten nested arrays:\n\n```javascript\nconst numbers = [1, [2, 3], [4, 5]];\n\nconst result = numbers.flat();\n\nconsole.log(result);\n// [1, 2, 3, 4, 5]\n```\n\nFor deeper nesting, provide a depth:\n\n```javascript\nconst numbers = [1, [2, [3, [4]]]];\n\nconsole.log(numbers.flat(2));\n// [1, 2, 3, [4]]\n```\n\nUse `flat(Infinity)` to flatten all levels.\n\n---\n\n### 5. Advanced — `flatMap()`\n\n`flatMap()` combines `map()` and one level of `flat()`:\n\n```javascript\nconst users = [\n  { name: \"Rajan\", skills: [\"JavaScript\", \"React\"] },\n  { name: \"John\", skills: [\"Node.js\", \"Python\"] }\n];\n\nconst skills = users.flatMap(user => user.skills);\n\nconsole.log(skills);\n// [\"JavaScript\", \"React\", \"Node.js\", \"Python\"]\n```\n\nInstead of `users.map(user => user.skills).flat();` you can write `users.flatMap(user => user.skills);`.\n\n---\n\n### 6. Advanced — `forEach()`\n\nUse `forEach()` when you simply want to <b>do something</b> for every element:\n\n```javascript\nconst users = [\"Rajan\", \"John\", \"Sam\"];\n\nusers.forEach(user => {\n  console.log(`Hello ${user}`);\n});\n```\n\nIt returns `undefined`:\n\n```javascript\nconst result = users.forEach(user => user.toUpperCase());\n\nconsole.log(result);\n// undefined\n```\n\nIf you need a <b>new array</b>, use `map()` instead:\n\n```javascript\nconst names = users.map(user => user.toUpperCase());\n\nconsole.log(names);\n// [\"RAJAN\", \"JOHN\", \"SAM\"]\n```",
        np: "केही array method ले मूल array लाई <b>mutate</b> (परिवर्तन) गर्छन्, अरूले नयाँ नतिजा बनाउँछन्।\n\nReact वा Redux सँग काम गर्दा यो महत्वपूर्ण छ किनकि अवस्थित array सिधै बदल्दा bug आउन सक्छ।\n\n<b>`sort()`</b> — मूल array बदल्छ र element क्रमबद्ध गर्छ।\n\n<b>`splice()`</b> — element हटाएर, थपेर वा बदलेर मूल array परिवर्तन गर्छ।\n\n<b>`flat()`</b> — nested array तह हटाएर नयाँ array बनाउँछ।\n\n<b>`flatMap()`</b> — `map()` चलाउँछ र एक तह flatten गर्छ।\n\n<b>`forEach()`</b> — हरेक element का लागि code चलाउँछ तर `undefined` फर्काउँछ।\n\n---\n\n### 1. आधारभूत — `sort()`\n\nसानोदेखि ठूलो क्रममा संख्या मिलाउनुहोस्:\n\n```javascript\nconst numbers = [10, 2, 5, 1];\n\nnumbers.sort((a, b) => a - b);\n\nconsole.log(numbers);\n// [1, 2, 5, 10]\n```\n\nसंख्याका लागि सधैं <b>comparator</b> (`sort()` लाई कसरी तुलना गर्ने बताउने function) प्रयोग गर्नुहोस्।\n\nयसबिना:\n\n```javascript\n[10, 2, 5, 1].sort();\n// [1, 10, 2, 5]\n```\n\nComparator नदिँदा JavaScript ले value लाई string जस्तै व्यवहार गर्छ।\n\n---\n\n### 2. आधारभूत — `splice()`\n\nArray बाट element हटाउनुहोस्:\n\n```javascript\nconst fruits = [\"apple\", \"banana\", \"orange\", \"mango\"];\n\nfruits.splice(1, 2);\n\nconsole.log(fruits);\n// [\"apple\", \"mango\"]\n```\n\n`splice(start, deleteCount)` को अर्थ:\n\n• Index `1` बाट सुरु गर\n• `2` element हटाऊ\n\n`splice()` ले मूल array बदल्छ।\n\n---\n\n### 3. मध्यम — `splice()` ले थप्नु वा बदल्नु\n\nतपाईं element थप्न पनि सक्नुहुन्छ:\n\n```javascript\nconst fruits = [\"apple\", \"orange\"];\n\nfruits.splice(1, 0, \"banana\");\n\nconsole.log(fruits);\n// [\"apple\", \"banana\", \"orange\"]\n```\n\nवा element बदल्न:\n\n```javascript\nconst fruits = [\"apple\", \"banana\", \"orange\"];\n\nfruits.splice(1, 1, \"mango\");\n\nconsole.log(fruits);\n// [\"apple\", \"mango\", \"orange\"]\n```\n\n<b>मूल नबदली</b> उस्तै काम चाहिएमा, `slice()` (`p` बिना) प्रयोग गर्नुहोस्।\n\n---\n\n### 4. मध्यम — `flat()`\n\nNested array flatten गर्नुहोस्:\n\n```javascript\nconst numbers = [1, [2, 3], [4, 5]];\n\nconst result = numbers.flat();\n\nconsole.log(result);\n// [1, 2, 3, 4, 5]\n```\n\nगहिरो nesting का लागि, depth दिनुहोस्:\n\n```javascript\nconst numbers = [1, [2, [3, [4]]]];\n\nconsole.log(numbers.flat(2));\n// [1, 2, 3, [4]]\n```\n\nसबै तह flatten गर्न `flat(Infinity)` प्रयोग गर्नुहोस्।\n\n---\n\n### 5. उन्नत — `flatMap()`\n\n`flatMap()` ले `map()` र `flat()` को एक तह जोड्छ:\n\n```javascript\nconst users = [\n  { name: \"Rajan\", skills: [\"JavaScript\", \"React\"] },\n  { name: \"John\", skills: [\"Node.js\", \"Python\"] }\n];\n\nconst skills = users.flatMap(user => user.skills);\n\nconsole.log(skills);\n// [\"JavaScript\", \"React\", \"Node.js\", \"Python\"]\n```\n\n`users.map(user => user.skills).flat();` को साटो `users.flatMap(user => user.skills);` लेख्न सक्नुहुन्छ।\n\n---\n\n### 6. उन्नत — `forEach()`\n\nहरेक element का लागि केवल <b>केही गर्न</b> चाहँदा `forEach()` प्रयोग गर्नुहोस्:\n\n```javascript\nconst users = [\"Rajan\", \"John\", \"Sam\"];\n\nusers.forEach(user => {\n  console.log(`Hello ${user}`);\n});\n```\n\nयसले `undefined` फर्काउँछ:\n\n```javascript\nconst result = users.forEach(user => user.toUpperCase());\n\nconsole.log(result);\n// undefined\n```\n\n<b>नयाँ array</b> चाहिएमा, `map()` प्रयोग गर्नुहोस्:\n\n```javascript\nconst names = users.map(user => user.toUpperCase());\n\nconsole.log(names);\n// [\"RAJAN\", \"JOHN\", \"SAM\"]\n```",
        jp: "配列メソッドには元の配列を<b>変更（mutate）</b>するものと、新しい結果を作るものがあります。\n\nReactやReduxでは、既存の配列を直接変更するとバグの原因になるため、この違いが重要です。\n\n<b>`sort()`</b> — 元の配列を変更して並べ替える。\n\n<b>`splice()`</b> — 要素の削除・追加・置換で元の配列を変更する。\n\n<b>`flat()`</b> — 入れ子の階層を減らした新しい配列を作る。\n\n<b>`flatMap()`</b> — `map()` を実行してから1階層だけ平らにする。\n\n<b>`forEach()`</b> — 各要素に対してコードを実行するが `undefined` を返す。\n\n---\n\n### 1. 基本 — `sort()`\n\n数値を小さい順に並べる:\n\n```javascript\nconst numbers = [10, 2, 5, 1];\n\nnumbers.sort((a, b) => a - b);\n\nconsole.log(numbers);\n// [1, 2, 5, 10]\n```\n\n数値には必ず<b>比較関数（comparator）</b>（`sort()` に比べ方を教える関数）を渡します。\n\n渡さないと:\n\n```javascript\n[10, 2, 5, 1].sort();\n// [1, 10, 2, 5]\n```\n\n比較関数がないと、JavaScriptは値を文字列として扱います。\n\n---\n\n### 2. 基本 — `splice()`\n\n配列から要素を削除する:\n\n```javascript\nconst fruits = [\"apple\", \"banana\", \"orange\", \"mango\"];\n\nfruits.splice(1, 2);\n\nconsole.log(fruits);\n// [\"apple\", \"mango\"]\n```\n\n`splice(start, deleteCount)` の意味:\n\n• 添字 `1` から始める\n• `2` 個削除する\n\n`splice()` は元の配列を変更します。\n\n---\n\n### 3. 中級 — `splice()` で追加・置換\n\n要素を追加できます:\n\n```javascript\nconst fruits = [\"apple\", \"orange\"];\n\nfruits.splice(1, 0, \"banana\");\n\nconsole.log(fruits);\n// [\"apple\", \"banana\", \"orange\"]\n```\n\n置き換えもできます:\n\n```javascript\nconst fruits = [\"apple\", \"banana\", \"orange\"];\n\nfruits.splice(1, 1, \"mango\");\n\nconsole.log(fruits);\n// [\"apple\", \"mango\", \"orange\"]\n```\n\n<b>元を変えずに</b>似たことをしたいときは `slice()`（`p` なし）を使います。\n\n---\n\n### 4. 中級 — `flat()`\n\n入れ子の配列を平らにする:\n\n```javascript\nconst numbers = [1, [2, 3], [4, 5]];\n\nconst result = numbers.flat();\n\nconsole.log(result);\n// [1, 2, 3, 4, 5]\n```\n\nもっと深い入れ子には深さを指定します:\n\n```javascript\nconst numbers = [1, [2, [3, [4]]]];\n\nconsole.log(numbers.flat(2));\n// [1, 2, 3, [4]]\n```\n\nすべての階層を平らにするには `flat(Infinity)` を使います。\n\n---\n\n### 5. 上級 — `flatMap()`\n\n`flatMap()` は `map()` と1階層の `flat()` を合わせたものです:\n\n```javascript\nconst users = [\n  { name: \"Rajan\", skills: [\"JavaScript\", \"React\"] },\n  { name: \"John\", skills: [\"Node.js\", \"Python\"] }\n];\n\nconst skills = users.flatMap(user => user.skills);\n\nconsole.log(skills);\n// [\"JavaScript\", \"React\", \"Node.js\", \"Python\"]\n```\n\n`users.map(user => user.skills).flat();` の代わりに `users.flatMap(user => user.skills);` と書けます。\n\n---\n\n### 6. 上級 — `forEach()`\n\n各要素に対して単に<b>何かをしたい</b>ときは `forEach()` を使います:\n\n```javascript\nconst users = [\"Rajan\", \"John\", \"Sam\"];\n\nusers.forEach(user => {\n  console.log(`Hello ${user}`);\n});\n```\n\n返り値は `undefined` です:\n\n```javascript\nconst result = users.forEach(user => user.toUpperCase());\n\nconsole.log(result);\n// undefined\n```\n\n<b>新しい配列</b>が必要なら `map()` を使います:\n\n```javascript\nconst names = users.map(user => user.toUpperCase());\n\nconsole.log(names);\n// [\"RAJAN\", \"JOHN\", \"SAM\"]\n```",
      },
      diagram: `Original Array
     │
     ├── sort()    → changes original
     │
     ├── splice()  → changes original
     │
     ├── flat()    → returns new array
     │
     ├── flatMap() → map + flatten one level
     │
     └── forEach() → runs code, returns undefined`,
      codeExample: {
        title: { en: "What mutates, what returns something new", np: "के mutate हुन्छ, के नयाँ फर्काउँछ", jp: "変更するもの、新しく返すもの" },
        code: `// ── 1. Basic — sort() mutates, and needs a comparator ─────────────
const numbers = [10, 2, 5, 1];

numbers.sort((a, b) => a - b);
console.log(numbers); // [1, 2, 5, 10]

console.log([10, 2, 5, 1].sort()); // [1, 10, 2, 5] — compared as strings

// ── 2. Basic — splice() removes in place ──────────────────────────
const fruits = ["apple", "banana", "orange", "mango"];

fruits.splice(1, 2);
console.log(fruits); // ["apple", "mango"]

// ── 3. Intermediate — splice() adds and replaces ──────────────────
const basket = ["apple", "orange"];

basket.splice(1, 0, "banana");
console.log(basket); // ["apple", "banana", "orange"]

basket.splice(1, 1, "mango");
console.log(basket); // ["apple", "mango", "orange"]

// ── 4. Intermediate — flat() returns a new array ──────────────────
console.log([1, [2, 3], [4, 5]].flat());   // [1, 2, 3, 4, 5]
console.log([1, [2, [3, [4]]]].flat(2));   // [1, 2, 3, [4]]

// ── 5. Advanced — flatMap() is map plus one flatten ───────────────
const users = [
  { name: "Rajan", skills: ["JavaScript", "React"] },
  { name: "John", skills: ["Node.js", "Python"] }
];

console.log(users.flatMap(user => user.skills));
// ["JavaScript", "React", "Node.js", "Python"]

// ── 6. Advanced — forEach() returns undefined ─────────────────────
const names = ["Rajan", "John", "Sam"];

names.forEach(name => console.log(\`Hello \${name}\`));

console.log(names.forEach(name => name.toUpperCase())); // undefined
console.log(names.map(name => name.toUpperCase()));     // ["RAJAN", "JOHN", "SAM"]`,
      },
      keyTakeaways: [
        { en: "`sort()` → sorts and <b>mutates</b> the original array.", np: "`sort()` → क्रमबद्ध गर्छ र मूल array <b>mutate</b> गर्छ।", jp: "`sort()` → 並べ替えて元の配列を<b>変更</b>する。" },
        { en: "`splice()` → adds, removes or replaces and <b>mutates</b> the original array.", np: "`splice()` → थप्छ, हटाउँछ वा बदल्छ र मूल array <b>mutate</b> गर्छ।", jp: "`splice()` → 追加・削除・置換をして元の配列を<b>変更</b>する。" },
        { en: "`slice()` → similar to `splice()`, but <b>doesn't mutate</b>.", np: "`slice()` → `splice()` जस्तै, तर <b>mutate गर्दैन</b>।", jp: "`slice()` → `splice()` に似ているが<b>変更しない</b>。" },
        { en: "`flat()` → removes nested array levels and returns a new array.", np: "`flat()` → nested array तह हटाउँछ र नयाँ array फर्काउँछ।", jp: "`flat()` → 入れ子の階層を減らし、新しい配列を返す。" },
        { en: "`flatMap()` → `map()` plus one level of `flat()`.", np: "`flatMap()` → `map()` सँगै `flat()` को एक तह।", jp: "`flatMap()` → `map()` と1階層の `flat()` を合わせたもの。" },
        { en: "`forEach()` → runs code for every item and returns `undefined`.", np: "`forEach()` → हरेक item का लागि code चलाउँछ र `undefined` फर्काउँछ।", jp: "`forEach()` → 各要素にコードを実行し `undefined` を返す。" },
        { en: "Use `map()` when you need a <b>new array</b>.", np: "<b>नयाँ array</b> चाहिँदा `map()` प्रयोग गर्नुहोस्।", jp: "<b>新しい配列</b>が必要なときは `map()` を使う。" },
      ],
      commonMistakes: [
        { en: "<b>Forgetting that `sort()` changes the original array</b> — it returns the same array it just reordered, so the source is gone.", np: "<b>`sort()` ले मूल array बदल्छ भनी बिर्सनु</b> — यसले भर्खर पुनःक्रमित गरेकै array फर्काउँछ, त्यसैले मूल हराउँछ।", jp: "<b>`sort()` が元の配列を変えることを忘れる</b> — 並べ替えた同じ配列を返すので、元の並びは失われる。" },
        { en: "<b>Using `sort()` without a comparator for numbers</b> — `[10, 2, 5, 1].sort()` gives `[1, 10, 2, 5]`, because values are compared as strings.", np: "<b>संख्याका लागि comparator बिना `sort()` प्रयोग गर्नु</b> — `[10, 2, 5, 1].sort()` ले `[1, 10, 2, 5]` दिन्छ, किनकि value string जस्तै तुलना हुन्छन्।", jp: "<b>数値に比較関数なしで `sort()` を使う</b> — `[10, 2, 5, 1].sort()` は `[1, 10, 2, 5]`。値が文字列として比較されるため。" },
        { en: "<b>Confusing `splice()` with `slice()`</b> — `splice()` mutates, `slice()` returns a copy of a section.", np: "<b>`splice()` र `slice()` भ्रममा पार्नु</b> — `splice()` ले mutate गर्छ, `slice()` ले खण्डको copy फर्काउँछ।", jp: "<b>`splice()` と `slice()` を混同する</b> — `splice()` は変更し、`slice()` は一部のコピーを返す。" },
        { en: "<b>Expecting `forEach()` to return a new array</b> — it always returns `undefined`.", np: "<b>`forEach()` ले नयाँ array फर्काउँछ भन्ने आशा गर्नु</b> — यसले सधैं `undefined` फर्काउँछ।", jp: "<b>`forEach()` が新しい配列を返すと思う</b> — 常に `undefined` を返す。" },
        { en: "<b>Mutating React or Redux state directly with `sort()` or `splice()`</b> — copy first, for example `[...items].sort(...)`.", np: "<b>React वा Redux state लाई `sort()` वा `splice()` ले सिधै mutate गर्नु</b> — पहिले copy गर्नुहोस्, जस्तै `[...items].sort(...)`।", jp: "<b>ReactやReduxの状態を `sort()` や `splice()` で直接変更する</b> — まずコピーする。例: `[...items].sort(...)`。" },
      ],
      quiz: [
        {
          question: { en: "Which method changes the original array?", np: "कुन method ले मूल array बदल्छ?", jp: "元の配列を変更するのはどれか?" },
          options: [
            { en: "`map()`", np: "`map()`", jp: "`map()`" },
            { en: "`sort()`", np: "`sort()`", jp: "`sort()`" },
            { en: "`flat()`", np: "`flat()`", jp: "`flat()`" },
          ],
          correctIndex: 1,
          explanation: { en: "`map()` and `flat()` both return new arrays and leave the source alone.", np: "`map()` र `flat()` दुबैले नयाँ array फर्काउँछन् र स्रोत छुँदैनन्।", jp: "`map()` と `flat()` はどちらも新しい配列を返し、元はそのまま。" },
        },
        {
          question: { en: "What does `splice()` do?", np: "`splice()` ले के गर्छ?", jp: "`splice()` は何をするか?" },
          options: [
            { en: "Only sorts an array", np: "Array क्रमबद्ध मात्र गर्छ", jp: "配列を並べ替えるだけ" },
            { en: "Creates a deep copy", np: "Deep copy बनाउँछ", jp: "ディープコピーを作る" },
            { en: "Adds, removes, or replaces elements", np: "Element थप्छ, हटाउँछ वा बदल्छ", jp: "要素を追加・削除・置換する" },
          ],
          correctIndex: 2,
          explanation: { en: "All three operations happen in place, on the original array.", np: "तीनै काम मूल array मै हुन्छन्।", jp: "3つの操作すべてが元の配列上で行われる。" },
        },
        {
          question: { en: "What does `forEach()` return?", np: "`forEach()` ले के फर्काउँछ?", jp: "`forEach()` は何を返すか?" },
          options: [
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
            { en: "The original array", np: "मूल array", jp: "元の配列" },
            { en: "A new array", np: "नयाँ array", jp: "新しい配列" },
          ],
          correctIndex: 0,
          explanation: { en: "It exists for side effects; use `map()` when you want a result back.", np: "यो side effect का लागि हो; नतिजा चाहिँदा `map()` प्रयोग गर्नुहोस्।", jp: "副作用のためのメソッド。結果が欲しいときは `map()` を使う。" },
        },
        {
          question: { en: "Which method combines mapping and flattening one level?", np: "कुन method ले mapping र एक तह flattening जोड्छ?", jp: "mapと1階層の平坦化を合わせたメソッドはどれか?" },
          options: [
            { en: "`splice()`", np: "`splice()`", jp: "`splice()`" },
            { en: "`flatMap()`", np: "`flatMap()`", jp: "`flatMap()`" },
            { en: "`sort()`", np: "`sort()`", jp: "`sort()`" },
          ],
          correctIndex: 1,
          explanation: { en: "It is shorthand for `.map(...).flat()`, and only flattens a single level.", np: "यो `.map(...).flat()` को छोटो रूप हो, र एक तह मात्र flatten गर्छ।", jp: "`.map(...).flat()` の短縮形で、平坦化は1階層だけ。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "If you call `.map()` on a 5-item array, how many items does the result always have?", np: "5-item array मा `.map()` call गर्दा result मा सधैं कति item हुन्छ?", jp: "5要素の配列に`.map()`を呼ぶと結果には常に何個の要素がある？" },
      options: [{ en: "It depends on the callback's return value", np: "Callback को return value अनुसार निर्भर हुन्छ", jp: "コールバックの戻り値に依存する" }, { en: "Exactly 5", np: "ठ्याक्कै 5", jp: "正確に5" }],
      correctIndex: 1,
      explanation: { en: "map() always produces one output per input element, regardless of what the callback returns.", np: "map() ले callback ले जे फर्काए पनि हरेक input element को एउटा output दिन्छ।", jp: "map()はコールバックが何を返しても入力要素ごとに1つの出力を生成する。" },
    },
    {
      question: { en: "What happens if `reduce()` is called with no `initialValue` on an empty array?", np: "Empty array मा `initialValue` बिना `reduce()` call गर्दा के हुन्छ?", jp: "空配列で`initialValue`なしに`reduce()`を呼ぶとどうなる？" },
      options: [{ en: "It throws a `TypeError`", np: "यसले `TypeError` throw गर्छ", jp: "`TypeError`をスローする" }, { en: "It returns `0`", np: "यसले `0` फर्काउँछ", jp: "`0`を返す" }],
      correctIndex: 0,
      explanation: { en: "With nothing to seed the accumulator and no elements to fall back on, reduce has no valid starting point and throws.", np: "Accumulator सुरु गर्ने केही र fallback गर्ने element नभई reduce सँग valid starting point हुँदैन।", jp: "アキュムレータを初期化するものも代替となる要素もない場合、reduceには有効な出発点がなくスローする。" },
    },
    {
      question: { en: "In `array.filter(a).map(b)`, does `filter` or `map` run first?", np: "`array.filter(a).map(b)` मा `filter` वा `map` कुन पहिले चल्छ?", jp: "`array.filter(a).map(b)`で`filter`と`map`のどちらが先に実行される？" },
      options: [{ en: "map runs first", np: "पहिले map चल्छ", jp: "先にmapが実行される" }, { en: "filter runs first, over the full array", np: "पहिले पूरै array माथि filter चल्छ", jp: "先にfilterが全配列に対して実行される" }],
      correctIndex: 1,
      explanation: { en: "Chained calls execute strictly left to right, each fully completing before the next one starts.", np: "Chain गरिएका calls बायाँबाट दायाँ क्रममा चल्छन्, अघिल्लो पूरा भएपछि मात्र अर्को सुरु हुन्छ।", jp: "チェーンされた呼び出しは厳密に左から右へ実行され、各呼び出しが完全に完了してから次が開始する。" },
    },
    {
      question: { en: "What does `find()` return when no element matches?", np: "कुनै element match नभएमा `find()` ले के फर्काउँछ?", jp: "マッチする要素がない場合`find()`は何を返す？" },
      options: [{ en: "`undefined`", np: "`undefined`", jp: "`undefined`" }, { en: "`null`", np: "`null`", jp: "`null`" }],
      correctIndex: 0,
      explanation: { en: "find() returns undefined, not null, when nothing satisfies the callback.", np: "कुनै element callback सँग match नभएमा find() ले undefined फर्काउँछ, null होइन।", jp: "何もコールバックを満たさない場合、find()はnullではなくundefinedを返す。" },
    },
    {
      question: { en: "What is the difference between `some()` and `every()`?", np: "`some()` र `every()` बीचको फरक के हो?", jp: "`some()`と`every()`の違いは？" },
      options: [{ en: "They are interchangeable", np: "दुवै एउटै हुन्", jp: "両者は交換可能" }, { en: "`some()` = at least one passes; `every()` = all must pass", np: "`some()` = कम्तिमा एक pass; `every()` = सबै pass हुनुपर्छ", jp: "`some()` = 少なくとも1つ通る; `every()` = すべて通る必要がある" }],
      correctIndex: 1,
      explanation: { en: "some() needs just one passing element to return true; every() needs all of them to pass.", np: "some() लाई true फर्काउन एउटा मात्र pass हुने element चाहिन्छ; every() लाई सबै pass हुनुपर्छ।", jp: "some()はtrueを返すのに1つ通る要素だけが必要。every()はすべてが通る必要がある。" },
    },
    {
      question: { en: "Why can `indexOf()` never find `NaN` in an array, while `includes()` can?", np: "`indexOf()` ले array मा `NaN` किन कहिल्यै भेट्दैन, तर `includes()` ले भेट्छ?", jp: "`indexOf()`が配列内で`NaN`を見つけられないのに`includes()`は見つけられるのはなぜ？" },
      options: [{ en: "indexOf uses strict equality (`NaN !== NaN`); includes uses SameValueZero", np: "indexOf ले strict equality प्रयोग गर्छ (`NaN !== NaN`); includes ले SameValueZero प्रयोग गर्छ", jp: "indexOfは厳密等価（`NaN !== NaN`）を使う。includesはSameValueZeroを使う" }, { en: "indexOf is older and has a bug that was never fixed", np: "indexOf पुरानो हो र यसमा कहिल्यै fix नभएको bug छ", jp: "indexOfは古く、修正されなかったバグがある" }],
      correctIndex: 0,
      explanation: { en: "This is a deliberate equality-algorithm difference, not a bug — SameValueZero treats NaN as equal to itself.", np: "यो जानाजानी equality-algorithm फरक हो, bug होइन — SameValueZero ले NaN लाई आफैं सँग बराबर मान्छ।", jp: "これは意図的な等価アルゴリズムの違いであり、バグではない。SameValueZeroはNaNを自身と等しいとみなす。" },
    },
    {
      question: { en: "What does `[10, 1, 21, 2].sort()` return without a comparator?", np: "Comparator बिना `[10, 1, 21, 2].sort()` ले के फर्काउँछ?", jp: "比較関数なしで`[10, 1, 21, 2].sort()`は何を返す？" },
      options: [{ en: "`[1, 2, 10, 21]` (numeric order)", np: "`[1, 2, 10, 21]` (numeric order)", jp: "`[1, 2, 10, 21]`（数値順）" }, { en: "`[1, 10, 2, 21]` (string order)", np: "`[1, 10, 2, 21]` (string order)", jp: "`[1, 10, 2, 21]`（文字列順）" }],
      correctIndex: 1,
      explanation: { en: "sort() without a comparator always converts to strings first and compares lexicographically.", np: "Comparator बिना sort() ले सधैं पहिले string मा convert गर्छ र lexicographically compare गर्छ।", jp: "比較関数なしのsort()は常に先に文字列に変換し辞書順に比較する。" },
    },
    {
      question: { en: "Does `slice()` mutate the original array?", np: "`slice()` ले original array mutate गर्छ?", jp: "`slice()`は元の配列を変更する？" },
      options: [{ en: "No — it returns a new array and leaves the original untouched", np: "होइन — यसले नयाँ array फर्काउँछ र original नछोई", jp: "いいえ — 新しい配列を返し元は変更しない" }, { en: "Yes — it works exactly like `splice()`", np: "हो — यो `splice()` जस्तै काम गर्छ", jp: "はい — `splice()`とまったく同じように動作する" }],
      correctIndex: 0,
      explanation: { en: "slice() and splice() sound similar but behave oppositely: slice never mutates, splice always does.", np: "slice() र splice() सुन्दा उस्तै तर behavior विपरीत छ: slice ले कहिल्यै mutate गर्दैन, splice ले सधैं गर्छ।", jp: "slice()とsplice()は名前が似ているが動作は逆: sliceは決して変更せず、spliceは常に変更する。" },
    },
    {
      question: { en: "Why shouldn't you rely on `forEach()` to build a new array?", np: "नयाँ array बनाउन `forEach()` मा किन भर पर्नु हुँदैन?", jp: "新しい配列を構築するために`forEach()`に頼るべきでない理由は？" },
      options: [{ en: "It is significantly slower than every other array method", np: "यो अरू सबै array methods भन्दा धेरै ढिलो हुन्छ", jp: "他のすべての配列メソッドより著しく遅い" }, { en: "It always returns `undefined` and cannot be chained into other array methods", np: "यसले सधैं `undefined` फर्काउँछ र अरू array methods मा chain हुँदैन", jp: "常に`undefined`を返し、他の配列メソッドにチェーンできない" }],
      correctIndex: 1,
      explanation: { en: "forEach is designed purely for side effects — for building a new array, map() is the right tool.", np: "forEach केवल side effects का लागि design गरिएको हो — नयाँ array बनाउन map() सहि tool हो।", jp: "forEachは純粋に副作用のために設計されている。新しい配列を構築するにはmap()が適切なツール。" },
    },
  ],
};
