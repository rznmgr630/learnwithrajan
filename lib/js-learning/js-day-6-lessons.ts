import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_6_LESSONS: JsLessonDay = {
  day: 6,
  title: { en: "Arrays — Map, Filter, Reduce & Key Methods", np: "Arrays — Map, Filter, Reduce र Key Methods", jp: "配列 — map・filter・reduce・主要メソッド" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "map-filter-reduce",
      title: { en: "Transforming Arrays — map, filter, reduce", np: "Arrays Transform — map, filter, reduce", jp: "配列変換 — map・filter・reduce" },
      durationMinutes: 9,
      explanation: {
        en: "These three methods are the workhorses of modern JavaScript, and each has one specific job:\n\n• <b>map</b> — transforms every element and returns a NEW array of the exact same length, one output per input\n• <b>filter</b> — keeps only the elements where the callback returns `true`, returning a new (possibly shorter) array\n• <b>reduce</b> — folds the entire array down into a single value (a number, an object, a Map — anything), by carrying an accumulator through every step\n\nNone of these three mutate the original array — they always return something new. Because each one returns an array (except reduce, which usually doesn't), you can chain them together: `.filter(...).map(...).reduce(...)` reads left to right as a pipeline, first narrowing down the data, then transforming it, then collapsing it to one answer.",
        np: "map ले हरेक element transform गर्छ र same length को नयाँ array दिन्छ। filter ले callback true भएका element मात्र राख्छ। reduce ले पूरै array लाई एउटा single value मा फोल्ड गर्छ। तीनैले original array mutate गर्दैनन् — chain गर्न सकिन्छ।",
        jp: "mapは各要素を変換し同じ長さの新しい配列を返す。filterはコールバックがtrueの要素だけを残す。reduceは配列全体を1つの値に折り畳む。3つとも元の配列を変更せず、チェーンできる。",
      },
      diagram: `[1, 2, 3, 4, 5]
      │ .filter(n => n % 2 === 0)   →  [2, 4]            shorter, same type
      │ .map(n => n * 10)           →  [20, 40]          same length, transformed
      │ .reduce((sum, n) => sum+n, 0) → 60                single value

products.filter(inStock).map(getPrice).reduce(sum, 0)
         └── narrow down ──┘└─ transform ─┘└── collapse to one ──┘`,
      codeExample: {
        title: { en: "map, filter, reduce — and chaining them together", np: "map, filter, reduce — chain गरेर", jp: "map・filter・reduce — チェーン結合" },
        code: `const products = [
  { id: 1, name: "Apple",  price: 1.5,  category: "fruit",  inStock: true  },
  { id: 2, name: "Bread",  price: 2.5,  category: "bakery", inStock: true  },
  { id: 3, name: "Banana", price: 0.75, category: "fruit",  inStock: false },
];

// ── map — transform every element, same length back ──────────────
const names = products.map(p => p.name);
// ["Apple", "Bread", "Banana"]

// ── filter — keep elements where callback is true ─────────────────
const inStock = products.filter(p => p.inStock);
// 2 products (all except Banana)

// ── reduce — fold the array into ONE value ────────────────────────
// Signature: array.reduce((accumulator, current, index) => ..., initialValue)
const total = products.reduce((sum, p) => sum + p.price, 0);
// 0 + 1.5 + 2.5 + 0.75 = 4.75

const byCategory = products.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] ?? 0) + 1;
  return acc;
}, {});
// { fruit: 2, bakery: 1 }

// ── Chaining — narrow, transform, then collapse ────────────────────
const totalInStockFruitRevenue = products
  .filter(p => p.category === "fruit" && p.inStock)
  .map(p => p.price)
  .reduce((sum, price) => sum + price, 0);
// Only Apple is in-stock fruit → 1.5`,
      },
      keyTakeaways: [
        { en: "`map()` always returns a new array of the SAME length as the input — one output for every input, no exceptions.", np: "`map()` ले सधैं input सँग same length को नयाँ array दिन्छ — हरेक input को एउटा output।", jp: "`map()`は常に入力と同じ長さの新しい配列を返す — 入力ごとに1つの出力。" },
        { en: "`filter()` returns a new array containing only the elements where the callback returned `true` — it can be shorter than the input, never longer.", np: "`filter()` ले callback true भएका element मात्र राखेर नयाँ array दिन्छ — यो input भन्दा छोटो हुन सक्छ, लामो कहिल्यै हुँदैन।", jp: "`filter()`はコールバックがtrueを返した要素だけを含む新しい配列を返す — 入力より短くなることはあるが長くなることはない。" },
        { en: "`reduce()` folds an entire array into a single value by carrying an accumulator forward through every element — the most flexible of the three.", np: "`reduce()` ले accumulator लाई हरेक element मार्फत बढाउँदै पूरै array लाई एउटा value मा फोल्ड गर्छ — तीनमध्ये सबैभन्दा flexible।", jp: "`reduce()`はアキュムレータを各要素に渡しながら配列全体を1つの値に折り畳む — 3つの中で最も柔軟。" },
      ],
      commonMistakes: [
        { en: "Omitting `reduce`'s `initialValue` — without it, `reduce` uses the first element as the starting accumulator, which throws on an empty array and can silently change the result's type.", np: "`reduce` को `initialValue` छुटाउनु — यसबिना पहिलो element नै accumulator बन्छ, empty array मा throw हुन्छ र result को type पनि बदलिन सक्छ।", jp: "`reduce`の`initialValue`を省略すること。省略すると最初の要素がアキュムレータになり、空配列でスローされ、結果の型が変わることがある。" },
        { en: "Expecting `map()` to remove items by returning `null`/`undefined` from the callback — `map()` always keeps the same length; use `filter()` first if you need fewer items.", np: "Callback बाट `null`/`undefined` return गरेर `map()` ले item हटाउँछ भन्ने ठान्नु — `map()` ले सधैं same length राख्छ; कम item चाहिँदा पहिले `filter()` प्रयोग गर्नुहोस्।", jp: "コールバックから`null`/`undefined`を返して`map()`が要素を削除すると思うこと。`map()`は常に同じ長さを保つ。要素を減らすには先に`filter()`を使う。" },
        { en: "Reaching for `reduce()` to solve something `map()` or `filter()` already solves more clearly — reduce is powerful but often harder to read than the simpler method.", np: "`map()` वा `filter()` ले सहज रूपमा गर्न सक्ने काम `reduce()` बाट गर्नु — reduce शक्तिशाली छ तर सरल method भन्दा पढ्न गाह्रो हुन सक्छ।", jp: "`map()`や`filter()`で明確に解決できることを`reduce()`で解決しようとすること。reduceは強力だがシンプルなメソッドより読みにくいことが多い。" },
      ],
      quiz: [
        {
          question: { en: "If you call `.map()` on a 5-item array, how many items does the result have?", np: "5-item array मा `.map()` call गर्दा result मा कति item हुन्छ?", jp: "5要素の配列に`.map()`を呼ぶと、結果には何個の要素がある？" },
          options: [
            { en: "Could be fewer than 5, depending on the callback", np: "Callback अनुसार 5 भन्दा कम हुन सक्छ", jp: "コールバックによっては5未満になることがある" },
            { en: "Always exactly 5", np: "सधैं ठ्याक्कै 5", jp: "常に正確に5" },
          ],
          correctIndex: 1,
          explanation: { en: "map() always produces one output per input, so the result length always matches the input length.", np: "map() ले हरेक input को एउटा output दिन्छ, त्यसैले result length input length सँग सधैं मिल्छ।", jp: "map()は入力ごとに1つの出力を生成するため、結果の長さは常に入力の長さと一致する。" },
        },
        {
          question: { en: "What happens if you call `.reduce()` with no `initialValue` on an empty array?", np: "Empty array मा `initialValue` बिना `.reduce()` call गर्दा के हुन्छ?", jp: "空配列で`initialValue`なしに`.reduce()`を呼ぶとどうなる？" },
          options: [
            { en: "It quietly returns `undefined`", np: "यसले silently `undefined` फर्काउँछ", jp: "黙って`undefined`を返す" },
            { en: "It throws a `TypeError`", np: "यसले `TypeError` throw गर्छ", jp: "`TypeError`をスローする" },
          ],
          correctIndex: 1,
          explanation: { en: "With no initial value and no elements to use as a starting accumulator, reduce has nothing to work with and throws.", np: "Initial value नभई र काम गर्ने element पनि नभई reduce सँग सुरु गर्ने केही हुँदैन, त्यसैले throw हुन्छ।", jp: "初期値も出発点となる要素もない場合、reduceは何も処理できずスローする。" },
        },
        {
          question: { en: "In `products.filter(cb1).map(cb2)`, in what order do the two methods run?", np: "`products.filter(cb1).map(cb2)` मा दुई methods कुन order मा चल्छन्?", jp: "`products.filter(cb1).map(cb2)`で2つのメソッドはどの順序で実行される？" },
          options: [
            { en: "filter runs first over the full array, then map runs on the filtered result", np: "पहिले पूरै array माथि filter चल्छ, त्यसपछि filtered result मा map चल्छ", jp: "先にfilterが全配列に対して実行され、その後mapがフィルタ後の結果に実行される" },
            { en: "Both run at the same time on the original array", np: "दुवै original array मा एकैसाथ चल्छन्", jp: "両方が元の配列に対して同時に実行される" },
          ],
          correctIndex: 0,
          explanation: { en: "Chained methods run strictly left to right — each one completes fully and returns a new array before the next method runs on it.", np: "Chain गरिएका methods बायाँबाट दायाँ क्रममा चल्छन् — हरेक अघिल्लो पूरा भएपछि मात्र अर्को चल्छ।", jp: "チェーンされたメソッドは厳密に左から右に実行される — 各メソッドが完全に完了し新しい配列を返した後に次が実行される。" },
        },
      ],
    },
    {
      id: "find-some-every-includes",
      title: { en: "Finding & Testing — find, some, every, includes", np: "Find र Testing — find, some, every, includes", jp: "検索・テスト — find・some・every・includes" },
      durationMinutes: 9,
      explanation: {
        en: "These methods answer yes/no or \"which one\" questions about an array, and all of them stop iterating as soon as the answer is known — which makes them more efficient than `filter()` when you only need one result or a boolean.\n\n• <b>find</b> / <b>findIndex</b> — return the FIRST matching element (or its index), or `undefined`/`-1` if nothing matches\n• <b>some</b> — `true` if AT LEAST ONE element satisfies the callback\n• <b>every</b> — `true` only if ALL elements satisfy the callback\n• <b>includes</b> — `true` if the array contains that exact value, using an equality check (<b>SameValueZero</b>) that treats `NaN` as equal to itself — unlike `indexOf`, which uses strict equality and can never find `NaN`.",
        np: "find/findIndex ले पहिलो matching element फर्काउँछ। some ले 'कम्तिमा एक' जाँच गर्छ, every ले 'सबै' जाँच गर्छ। includes ले SameValueZero प्रयोग गर्छ जसले NaN लाई आफैं सँग बराबर मान्छ, indexOf ले मान्दैन।",
        jp: "find/findIndexは最初にマッチした要素を返す。someは「少なくとも1つ」、everyは「すべて」を確認する。includesはSameValueZeroを使いNaNを自身と等しいとみなすが、indexOfはそうではない。",
      },
      diagram: `[1, 5, 3, 8, 2, 9, 4, 7, 6]

find(n => n > 6)        →  8    (FIRST match, stops iterating there)
findIndex(n => n > 6)   →  3    (index of that first match)
some(n => n > 8)        →  true   ("does ANY element pass?")
every(n => n > 0)       →  true   ("do ALL elements pass?")
includes(8)             →  true   (exact value match)

[NaN].includes(NaN)   →  true    ← SameValueZero: NaN equals itself
[NaN].indexOf(NaN)    →  -1      ← strict equality: NaN !== NaN`,
      codeExample: {
        title: { en: "find, findIndex, some, every, includes, indexOf", np: "find, findIndex, some, every, includes, indexOf", jp: "find・findIndex・some・every・includes・indexOf" },
        code: `const numbers = [1, 5, 3, 8, 2, 9, 4, 7, 6];

// find — returns the FIRST element where callback is true (or undefined)
numbers.find(n => n > 6);         // 8 — stops after finding the first match

// findIndex — returns the INDEX of the first match (or -1)
numbers.findIndex(n => n > 6);    // 3 (index of 8)

// findLast / findLastIndex — search from the end (ES2023)
numbers.findLast(n => n > 6);     // 7 (last element > 6)

// some — true if ANY element satisfies the callback
numbers.some(n => n > 8);         // true (9 > 8)
numbers.some(n => n > 10);        // false

// every — true only if ALL elements satisfy the callback
numbers.every(n => n > 0);        // true
numbers.every(n => n > 5);        // false

// includes — true if the exact value is in the array (SameValueZero)
numbers.includes(8);              // true
[NaN].includes(NaN);              // true (unlike indexOf, which uses ===)

// indexOf / lastIndexOf — find index by value (strict equality)
numbers.indexOf(5);               // 1
numbers.indexOf(100);             // -1 — not found
[NaN].indexOf(NaN);               // -1 — NaN !== NaN under strict equality`,
      },
      keyTakeaways: [
        { en: "`find`/`findIndex` return the first match (or `undefined`/`-1`) and stop iterating immediately — more efficient than `filter()[0]` when you only need one result.", np: "`find`/`findIndex` ले पहिलो match (वा `undefined`/`-1`) फर्काउँछ र तुरुन्तै रोकिन्छ — एउटा मात्र result चाहिँदा `filter()[0]` भन्दा बढी efficient।", jp: "`find`/`findIndex`は最初のマッチ（または`undefined`/`-1`）を返し、すぐに反復を止める。1つの結果だけ必要な場合`filter()[0]`より効率的。" },
        { en: "`some()` asks \"does AT LEAST ONE pass?\"; `every()` asks \"do ALL pass?\" — both short-circuit as soon as the final answer is certain.", np: "`some()` ले 'कम्तिमा एक pass हुन्छ?' जाँच गर्छ; `every()` ले 'सबै pass हुन्छ?' जाँच गर्छ — दुवैले answer confirm भएपछि तुरुन्तै रोकिन्छन्।", jp: "`some()`は「少なくとも1つ通るか」、`every()`は「すべて通るか」を確認する。両方とも答えが確定した時点で即座に停止する。" },
        { en: "`includes()` uses `SameValueZero` equality, which treats `NaN` as equal to itself; `indexOf()` uses strict equality (`===`) and can never find `NaN` in an array.", np: "`includes()` ले `SameValueZero` equality प्रयोग गर्छ, जसले `NaN` लाई आफैं सँग बराबर मान्छ; `indexOf()` ले strict equality प्रयोग गर्छ र array मा `NaN` कहिल्यै भेट्दैन।", jp: "`includes()`は`SameValueZero`等価性を使い`NaN`を自身と等しいとみなす。`indexOf()`は厳密等価（`===`）を使い配列内で`NaN`を見つけられない。" },
      ],
      commonMistakes: [
        { en: "Writing `array.filter(cb)[0]` to get a single item when `array.find(cb)` already does this more clearly and stops early instead of scanning the whole array.", np: "एउटा item चाहिँदा `array.filter(cb)[0]` लेख्नु — `array.find(cb)` ले पहिले नै यो स्पष्ट र छिटो गर्छ।", jp: "1つの項目が必要な場合に`array.filter(cb)[0]`と書くこと。`array.find(cb)`はより明確で早期に停止する。" },
        { en: "Mixing up `some()` (ANY) with `every()` (ALL) and getting the opposite boolean result from what was intended.", np: "`some()` (ANY) र `every()` (ALL) मिलाउनु र विपरीत boolean result पाउनु।", jp: "`some()`（ANY）と`every()`（ALL）を混同し、意図と逆のブール値の結果を得ること。" },
        { en: "Assuming `indexOf()` can locate `NaN` in an array — it can't, because it uses strict equality where `NaN !== NaN`; use `includes()` instead.", np: "`indexOf()` ले array मा `NaN` भेट्न सक्छ भन्ने ठान्नु — सक्दैन, किनकि यो strict equality प्रयोग गर्छ जहाँ `NaN !== NaN`; `includes()` प्रयोग गर्नुहोस्।", jp: "`indexOf()`が配列内の`NaN`を見つけられると思うこと。`NaN !== NaN`という厳密等価を使うため見つけられない。代わりに`includes()`を使う。" },
      ],
      quiz: [
        {
          question: { en: "What does `find()` return if no element in the array matches the callback?", np: "Array मा कुनै element callback सँग match नभएमा `find()` ले के फर्काउँछ?", jp: "配列内でコールバックにマッチする要素がない場合、`find()`は何を返す？" },
          options: [
            { en: "`null`", np: "`null`", jp: "`null`" },
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
          ],
          correctIndex: 1,
          explanation: { en: "find() returns undefined (not null) when nothing matches — the same convention as accessing a missing object property.", np: "केही match नभएमा find() ले undefined (null होइन) फर्काउँछ — missing object property access जस्तै convention।", jp: "何もマッチしない場合、find()はundefined（nullではない）を返す — 存在しないオブジェクトプロパティにアクセスする場合と同じ規則。" },
        },
        {
          question: { en: "What is the key difference between `some()` and `every()`?", np: "`some()` र `every()` बीचको मुख्य फरक के हो?", jp: "`some()`と`every()`の主な違いは？" },
          options: [
            { en: "`some()` checks if ANY element passes; `every()` checks if ALL elements pass", np: "`some()` ले कुनै एक element pass भयो कि जाँच्छ; `every()` ले सबै pass भयो कि जाँच्छ", jp: "`some()`はANY要素が通るか確認し、`every()`はALL要素が通るか確認する" },
            { en: "They are functionally identical", np: "दुवै functionally उस्तै हुन्", jp: "機能的に同一" },
          ],
          correctIndex: 0,
          explanation: { en: "some() short-circuits to true on the first passing element; every() short-circuits to false on the first failing element.", np: "some() पहिलो pass हुने element मा true मा short-circuit हुन्छ; every() पहिलो fail हुने element मा false मा short-circuit हुन्छ।", jp: "some()は最初に通った要素でtrueに短絡する。every()は最初に失敗した要素でfalseに短絡する。" },
        },
        {
          question: { en: "Why does `[NaN].includes(NaN)` return `true` while `[NaN].indexOf(NaN)` returns `-1`?", np: "`[NaN].includes(NaN)` ले `true` फर्काउँछ तर `[NaN].indexOf(NaN)` ले `-1` फर्काउँछ, किन?", jp: "`[NaN].includes(NaN)`は`true`を返すが`[NaN].indexOf(NaN)`が`-1`を返す理由は？" },
          options: [
            { en: "`includes()` uses `SameValueZero` (treats `NaN` as equal to itself); `indexOf()` uses strict equality where `NaN !== NaN`", np: "`includes()` ले `SameValueZero` प्रयोग गर्छ (NaN लाई आफैं सँग बराबर मान्छ); `indexOf()` ले strict equality प्रयोग गर्छ जहाँ `NaN !== NaN`", jp: "`includes()`は`SameValueZero`を使う（NaNを自身と等しいとみなす）。`indexOf()`は厳密等価を使い`NaN !== NaN`" },
            { en: "They behave identically — this is a trick question", np: "दुवैको behavior उस्तै — यो trick question हो", jp: "両者は同じ動作をする — これは引っかけ問題" },
          ],
          correctIndex: 0,
          explanation: { en: "SameValueZero is almost identical to strict equality except it makes an exception specifically for NaN.", np: "SameValueZero strict equality सँग लगभग उस्तै हो तर NaN का लागि विशेष अपवाद बनाउँछ।", jp: "SameValueZeroは厳密等価とほぼ同じだが、NaNに対して特別な例外を設けている。" },
        },
      ],
    },
    {
      id: "sort-splice-flat-foreach",
      title: { en: "Mutating Methods — sort, splice, flat & forEach", np: "Mutating Methods — sort, splice, flat, forEach", jp: "配列変更メソッド — sort・splice・flat・forEach" },
      durationMinutes: 9,
      explanation: {
        en: "Some array methods change the original array in place (<b>mutate</b>) instead of returning a new one — this matters a lot when working with React/Redux state, where mutating directly can cause bugs or missed re-renders.\n\n• <b>sort</b> — mutates the array; with no comparator it converts elements to STRINGS and sorts lexicographically (so `10` comes before `2`) — always pass `(a, b) => a - b` for numeric sort\n• <b>splice</b> — mutates: removes/inserts/replaces elements at a position; `slice` (no \"p\") does the same job WITHOUT mutating\n• <b>flat(depth)</b> / <b>flatMap</b> — flatten nested arrays by a given depth (or `Infinity` for fully flat); `flatMap` maps then flattens one level in a single, more efficient pass\n• <b>forEach</b> — iterates purely for side effects; it always returns `undefined` and cannot be chained — use `map` instead when you need a new array back.",
        np: "sort, push, pop, splice जस्ता method ले original array mutate गर्छ। sort ले comparator बिना string जस्तो sort गर्छ। slice ले mutate गर्दैन। forEach ले सधैं undefined फर्काउँछ, chain हुँदैन।",
        jp: "sort・push・pop・spliceなどは元の配列を変更する。比較関数なしのsortは文字列としてソートする。sliceは変更しない。forEachは常にundefinedを返しチェーンできない。",
      },
      diagram: `MUTATES the original array         Does NOT mutate
──────────────────────────         ──────────────────────
sort, reverse, push, pop,          map, filter, slice,
shift, unshift, splice, fill       concat, flat, flatMap

nums.sort()            →  [1, 10, 2, 21]   ❌ string sort!
nums.sort((a,b)=>a-b)  →  [1, 2, 10, 21]   ✅ numeric sort

[1, [2, [3, [4]]]].flat()         →  [1, 2, [3, [4]]]    1 level deep
[1, [2, [3, [4]]]].flat(Infinity) →  [1, 2, 3, 4]         fully flat`,
      codeExample: {
        title: { en: "sort, splice/slice, flat/flatMap, forEach — and their gotchas", np: "sort, splice/slice, flat/flatMap, forEach — gotchas सहित", jp: "sort・splice/slice・flat/flatMap・forEachと注意点" },
        code: `// ── sort — MUTATES the original array ────────────────────────────────────
const nums = [10, 1, 21, 2];
nums.sort();                 // [1, 10, 2, 21] — default sorts as STRINGS! Bug waiting to happen
nums.sort((a, b) => a - b);  // [1, 2, 10, 21] — ascending (use (b - a) for descending)

const users = [{ name: "Charlie" }, { name: "Alice" }, { name: "Bob" }];
users.sort((a, b) => a.name.localeCompare(b.name));
// [Alice, Bob, Charlie]

// ── splice — MUTATES: add/remove/replace at a position ───────────────────
const arr = [1, 2, 3, 4, 5];
arr.splice(2, 1);          // removes 1 element at index 2 → arr = [1, 2, 4, 5]
arr.splice(2, 0, 99);      // inserts 99 at index 2, removes 0 → arr = [1, 2, 99, 4, 5]

// ── slice — does NOT mutate, returns a new portion ────────────────────────
const copy = arr.slice(1, 3);  // [2, 99] — from index 1 up to (not including) index 3

// ── flat / flatMap — flatten nested arrays ─────────────────────────────────
[1, [2, [3, [4]]]].flat();          // [1, 2, [3, [4]]] — only one level by default
[1, [2, [3, [4]]]].flat(Infinity);  // [1, 2, 3, 4] — flatten all levels
[[1, 2], [3, 4]].flatMap(x => x);   // [1, 2, 3, 4] — map then flatten one level

// ── forEach — iterate for side effects, always returns undefined ──────────
[1, 2, 3].forEach((n, i) => console.log(i, n));
// Use map() when you need a new array back; forEach() cannot be chained`,
      },
      keyTakeaways: [
        { en: "`.sort()` with no comparator sorts elements as STRINGS — always pass `(a, b) => a - b` for a correct numeric ascending sort.", np: "Comparator बिना `.sort()` ले elements लाई STRING को रूपमा sort गर्छ — सहि numeric sort का लागि `(a, b) => a - b` पास गर्नुहोस्।", jp: "比較関数なしの`.sort()`は要素を文字列としてソートする。正しい数値の昇順ソートには`(a, b) => a - b`を渡す。" },
        { en: "`sort`, `splice`, `push`, `pop`, `shift`, `unshift`, `reverse`, and `fill` all MUTATE the original array in place — avoid using them directly on React/Redux state.", np: "`sort`, `splice`, `push`, `pop`, `shift`, `unshift`, `reverse`, `fill` सबैले original array mutate गर्छन् — React/Redux state मा सिधै प्रयोग नगर्नुहोस्।", jp: "`sort`・`splice`・`push`・`pop`・`shift`・`unshift`・`reverse`・`fill`はすべて元の配列を変更する。React/Reduxの状態には直接使わない。" },
        { en: "`forEach()` always returns `undefined` and cannot be chained — use it only for side effects; use `map()` when you need a transformed array back.", np: "`forEach()` ले सधैं `undefined` फर्काउँछ र chain हुँदैन — side effects का लागि मात्र प्रयोग गर्नुहोस्; नयाँ array चाहिँदा `map()` प्रयोग गर्नुहोस्।", jp: "`forEach()`は常に`undefined`を返しチェーンできない。副作用のみに使い、変換された配列が必要なら`map()`を使う。" },
      ],
      commonMistakes: [
        { en: "Sorting an array of numbers without a comparator and getting lexicographic (string) order instead of numeric order — `[10, 1, 21, 2].sort()` becomes `[1, 10, 2, 21]`.", np: "Numbers को array comparator बिना sort गरेर lexicographic (string) order पाउनु — `[10, 1, 21, 2].sort()` ले `[1, 10, 2, 21]` दिन्छ।", jp: "数値の配列を比較関数なしでソートし、数値順ではなく辞書順（文字列順）になること — `[10, 1, 21, 2].sort()`は`[1, 10, 2, 21]`になる。" },
        { en: "Calling `sort()`, `splice()`, or `push()` directly on a React/Redux state array — the mutation doesn't trigger a re-render and can corrupt state shared elsewhere.", np: "React/Redux state array मा सिधै `sort()`, `splice()`, `push()` call गर्नु — mutation ले re-render trigger गर्दैन र state corrupt गर्न सक्छ।", jp: "React/Reduxの状態配列に直接`sort()`・`splice()`・`push()`を呼ぶこと。変更は再レンダリングを引き起こさず、他で共有される状態を破損させることがある。" },
        { en: "Chaining `.forEach()` expecting it to return a new array or a value — it always returns `undefined`, so `arr.forEach(fn).map(...)` will throw.", np: "`.forEach()` लाई नयाँ array वा value फर्काउँछ भनेर chain गर्नु — यसले सधैं `undefined` फर्काउँछ, त्यसैले `arr.forEach(fn).map(...)` ले throw गर्छ।", jp: "`.forEach()`が新しい配列や値を返すと期待してチェーンすること。常に`undefined`を返すため`arr.forEach(fn).map(...)`はスローする。" },
      ],
      quiz: [
        {
          question: { en: "What does `[10, 1, 21, 2].sort()` return without a comparator?", np: "Comparator बिना `[10, 1, 21, 2].sort()` ले के फर्काउँछ?", jp: "比較関数なしで`[10, 1, 21, 2].sort()`は何を返す？" },
          options: [
            { en: "`[1, 2, 10, 21]` — numeric ascending order", np: "`[1, 2, 10, 21]` — numeric ascending order", jp: "`[1, 2, 10, 21]` — 数値の昇順" },
            { en: "`[1, 10, 2, 21]` — string (lexicographic) order", np: "`[1, 10, 2, 21]` — string (lexicographic) order", jp: "`[1, 10, 2, 21]` — 文字列（辞書）順" },
          ],
          correctIndex: 1,
          explanation: { en: "Without a comparator, sort() converts elements to strings first, so digit-by-digit comparison puts '10' before '2'.", np: "Comparator बिना sort() ले elements लाई पहिले string मा convert गर्छ, त्यसैले '10' '2' भन्दा अगाडि आउँछ।", jp: "比較関数がない場合、sort()は要素を先に文字列に変換するため、'10'が'2'より前に来る。" },
        },
        {
          question: { en: "Which of these methods MUTATES the original array?", np: "यीमध्ये कुन method ले original array mutate गर्छ?", jp: "次のうち元の配列を変更するメソッドはどれ？" },
          options: [
            { en: "`slice()`", np: "`slice()`", jp: "`slice()`" },
            { en: "`splice()`", np: "`splice()`", jp: "`splice()`" },
          ],
          correctIndex: 1,
          explanation: { en: "splice() removes/inserts elements in place on the original array; slice() returns a new array and leaves the original untouched.", np: "splice() ले original array मा सिधै remove/insert गर्छ; slice() ले नयाँ array फर्काउँछ र original नछोई।", jp: "splice()は元の配列に直接要素を削除/挿入する。slice()は新しい配列を返し元は変更しない。" },
        },
        {
          question: { en: "Why shouldn't you use `forEach()` when you need a transformed array back?", np: "Transformed array चाहिँदा `forEach()` किन प्रयोग गर्नु हुँदैन?", jp: "変換された配列が必要な場合、なぜ`forEach()`を使うべきではない？" },
          options: [
            { en: "`forEach()` always returns `undefined` and can't be chained into further array methods", np: "`forEach()` ले सधैं `undefined` फर्काउँछ र थप array methods मा chain गर्न सकिँदैन", jp: "`forEach()`は常に`undefined`を返し、さらなる配列メソッドにチェーンできない" },
            { en: "`forEach()` is deprecated in modern JavaScript", np: "`forEach()` modern JavaScript मा deprecated छ", jp: "`forEach()`はモダンJavaScriptで廃止されている" },
          ],
          correctIndex: 0,
          explanation: { en: "forEach exists purely for side effects (like logging); if you need a new array back, map() is the correct tool.", np: "forEach केवल side effects (जस्तै logging) का लागि हो; नयाँ array चाहिँदा map() सहि tool हो।", jp: "forEachはロギングのような副作用のためだけに存在する。新しい配列が必要ならmap()が正しい選択。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "If you call `.map()` on a 5-item array, how many items does the result always have?", np: "5-item array मा `.map()` call गर्दा result मा सधैं कति item हुन्छ?", jp: "5要素の配列に`.map()`を呼ぶと結果には常に何個の要素がある？" },
      options: [{ en: "Exactly 5", np: "ठ्याक्कै 5", jp: "正確に5" }, { en: "It depends on the callback's return value", np: "Callback को return value अनुसार निर्भर हुन्छ", jp: "コールバックの戻り値に依存する" }],
      correctIndex: 0,
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
      options: [{ en: "filter runs first, over the full array", np: "पहिले पूरै array माथि filter चल्छ", jp: "先にfilterが全配列に対して実行される" }, { en: "map runs first", np: "पहिले map चल्छ", jp: "先にmapが実行される" }],
      correctIndex: 0,
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
      options: [{ en: "`some()` = at least one passes; `every()` = all must pass", np: "`some()` = कम्तिमा एक pass; `every()` = सबै pass हुनुपर्छ", jp: "`some()` = 少なくとも1つ通る; `every()` = すべて通る必要がある" }, { en: "They are interchangeable", np: "दुवै एउटै हुन्", jp: "両者は交換可能" }],
      correctIndex: 0,
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
      options: [{ en: "`[1, 10, 2, 21]` (string order)", np: "`[1, 10, 2, 21]` (string order)", jp: "`[1, 10, 2, 21]`（文字列順）" }, { en: "`[1, 2, 10, 21]` (numeric order)", np: "`[1, 2, 10, 21]` (numeric order)", jp: "`[1, 2, 10, 21]`（数値順）" }],
      correctIndex: 0,
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
      options: [{ en: "It always returns `undefined` and cannot be chained into other array methods", np: "यसले सधैं `undefined` फर्काउँछ र अरू array methods मा chain हुँदैन", jp: "常に`undefined`を返し、他の配列メソッドにチェーンできない" }, { en: "It is significantly slower than every other array method", np: "यो अरू सबै array methods भन्दा धेरै ढिलो हुन्छ", jp: "他のすべての配列メソッドより著しく遅い" }],
      correctIndex: 0,
      explanation: { en: "forEach is designed purely for side effects — for building a new array, map() is the right tool.", np: "forEach केवल side effects का लागि design गरिएको हो — नयाँ array बनाउन map() सहि tool हो।", jp: "forEachは純粋に副作用のために設計されている。新しい配列を構築するにはmap()が適切なツール。" },
    },
  ],
};
