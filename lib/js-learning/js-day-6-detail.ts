import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_6_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Array methods like `map`, `filter`, `reduce`, and `sort` are the workhorses of modern JavaScript. Learning to chain them fluently — and understanding how `reduce` works under the hood — is one of the clearest signals of JavaScript proficiency in a technical interview.",
      np: "`map`, `filter`, `reduce`, `sort` जस्ता array methods आधुनिक JavaScript का workhorse हुन्। तिनलाई chain गर्न सिक्नु र `reduce` कसरी काम गर्छ बुझ्नु technical interview मा JS proficiency को सबैभन्दा ठूलो signal हो।",
      jp: "`map`・`filter`・`reduce`・`sort`などの配列メソッドはモダンJSの要。チェーンの流暢な使いこなしと`reduce`の仕組みの理解はJS技術面接での重要なシグナル。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "R8rmfD9Y5-c", title: "Array Methods You Must Know (map, filter, reduce)" },
      ],
    },
    {
      title: { en: "Transforming arrays — map, filter, reduce", np: "Arrays transform — map, filter, reduce", jp: "配列変換 — map・filter・reduce" },
      blocks: [
        {
          type: "code",
          title: { en: "map, filter, reduce — the three essential methods", np: "map, filter, reduce — तीन मुख्य methods", jp: "map・filter・reduce — 3つの基本メソッド" },
          code: `const products = [
  { id: 1, name: "Apple",  price: 1.5,  category: "fruit",    inStock: true  },
  { id: 2, name: "Bread",  price: 2.5,  category: "bakery",   inStock: true  },
  { id: 3, name: "Banana", price: 0.75, category: "fruit",    inStock: false },
  { id: 4, name: "Milk",   price: 1.2,  category: "dairy",    inStock: true  },
  { id: 5, name: "Cake",   price: 5.0,  category: "bakery",   inStock: true  },
];

// ── map — transform every element, returns new array of same length ────
const names     = products.map(p => p.name);
// ["Apple", "Bread", "Banana", "Milk", "Cake"]

const withTax   = products.map(p => ({ ...p, priceWithTax: p.price * 1.13 }));
// Each product now has a priceWithTax field

const nameUpper = products.map(p => p.name.toUpperCase());
// ["APPLE", "BREAD", "BANANA", "MILK", "CAKE"]

// ── filter — keep elements where callback returns true ──────────────────
const inStock   = products.filter(p => p.inStock);
// 4 products (all except Banana)

const expensive = products.filter(p => p.price > 2);
// [Bread, Cake]

const fruits    = products.filter(p => p.category === "fruit");
// [Apple, Banana]

// ── reduce — fold array into a single value ─────────────────────────────
// Signature: array.reduce(callback(accumulator, currentValue, index), initialValue)

// Sum all prices:
const total = products.reduce((sum, p) => sum + p.price, 0);
// 0 + 1.5 + 2.5 + 0.75 + 1.2 + 5.0 = 10.95

// Count by category:
const byCategory = products.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] ?? 0) + 1;
  return acc;
}, {});
// { fruit: 2, bakery: 2, dairy: 1 }

// Build a lookup Map:
const productMap = products.reduce((map, p) => {
  map.set(p.id, p);
  return map;
}, new Map());
// productMap.get(1) → { id: 1, name: "Apple", ... }

// ── Chaining — combine methods ──────────────────────────────────────────
const totalInStockFruitRevenue = products
  .filter(p => p.category === "fruit" && p.inStock)
  .map(p => p.price)
  .reduce((sum, price) => sum + price, 0);
// Only Apple is in-stock fruit → 1.5`,
        },
      ],
    },
    {
      title: { en: "Finding and testing — find, some, every, includes", np: "Finding र testing — find, some, every, includes", jp: "検索・テスト — find・some・every・includes" },
      blocks: [
        {
          type: "code",
          title: { en: "Searching and checking array contents", np: "Array contents search र check गर्नु", jp: "配列の検索と確認" },
          code: `const numbers = [1, 5, 3, 8, 2, 9, 4, 7, 6];

// find — returns the FIRST element where callback is true (or undefined)
numbers.find(n => n > 6);         // 8 — stops after finding the first match

// findIndex — returns the INDEX of the first match (or -1)
numbers.findIndex(n => n > 6);    // 3 (index of 8)

// findLast / findLastIndex — search from the end (ES2023)
numbers.findLast(n => n > 6);     // 7 (last element > 6)

// some — returns true if ANY element satisfies the callback
numbers.some(n => n > 8);         // true (9 > 8)
numbers.some(n => n > 10);        // false

// every — returns true only if ALL elements satisfy the callback
numbers.every(n => n > 0);        // true
numbers.every(n => n > 5);        // false

// includes — returns true if the exact value is in the array
numbers.includes(8);              // true
numbers.includes(10);             // false
// Note: uses SameValueZero — strict equality but NaN === NaN
[NaN].includes(NaN);              // true (unlike indexOf which uses ===)

// indexOf / lastIndexOf — find index by value
numbers.indexOf(5);               // 1
numbers.lastIndexOf(5);           // 1 (only one 5)
numbers.indexOf(100);             // -1 — not found`,
        },
      ],
    },
    {
      title: { en: "Mutating methods — sort, splice, flat, forEach", np: "Mutating methods — sort, splice, flat, forEach", jp: "配列変更メソッド — sort・splice・flat・forEach" },
      blocks: [
        {
          type: "code",
          title: { en: "sort, flat, flatMap, forEach, splice — and their gotchas", np: "sort, flat, flatMap, forEach, splice — gotchas सहित", jp: "sort・flat・flatMap・forEach・spliceと注意点" },
          code: `// ── sort — MUTATES the original array ────────────────────────────────────
const nums = [10, 1, 21, 2];
nums.sort();              // [1, 10, 2, 21] — default sorts as STRINGS! Bug waiting to happen
nums.sort((a, b) => a - b);  // [1, 2, 10, 21] — ascending (b - a for descending)

// Sort objects:
const users = [{ name: "Charlie" }, { name: "Alice" }, { name: "Bob" }];
users.sort((a, b) => a.name.localeCompare(b.name));
// [Alice, Bob, Charlie]

// ── forEach — iterate with a callback, returns undefined (not chainable) ─
[1, 2, 3].forEach((n, i) => console.log(i, n));
// Use map when you need a new array; use forEach for side effects only

// ── flat — flatten nested arrays ─────────────────────────────────────────
[1, [2, [3, [4]]]].flat();     // [1, 2, [3, [4]]] — only one level by default
[1, [2, [3, [4]]]].flat(2);    // [1, 2, 3, [4]]
[1, [2, [3, [4]]]].flat(Infinity);  // [1, 2, 3, 4] — flatten all levels

// ── flatMap — map then flatten one level (more efficient than .map().flat()) ─
[[1, 2], [3, 4]].flatMap(x => x);          // [1, 2, 3, 4]
["hello world", "foo bar"].flatMap(s => s.split(" "));  // ["hello", "world", "foo", "bar"]

// ── splice — MUTATES: add/remove/replace elements at a position ──────────
const arr = [1, 2, 3, 4, 5];
arr.splice(2, 1);          // removes 1 element at index 2 → arr = [1, 2, 4, 5]
arr.splice(2, 0, 99);      // inserts 99 at index 2, removes 0 → arr = [1, 2, 99, 4, 5]

// ── slice — does NOT mutate, returns a portion ───────────────────────────
const copy = arr.slice(1, 3);  // [2, 99] — from index 1 up to (not including) index 3
arr.slice(-2);                 // last two elements`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            { en: "**Mutating methods** (avoid in React/Redux state): `sort`, `reverse`, `push`, `pop`, `shift`, `unshift`, `splice`, `fill`. Always use non-mutating alternatives (`[...arr].sort(...)`) when working with state.", np: "**Mutating methods** (React/Redux state मा avoid): sort, reverse, push, pop, splice। State सँग काम गर्दा `[...arr].sort(...)` जस्ता non-mutating alternatives प्रयोग गर्नुहोस्।", jp: "**変更メソッド**（Reactの状態では避ける）: sort・reverse・push・pop・splice。状態を扱う場合は`[...arr].sort()`のような非変更的な方法を使う。" },
            { en: "**map vs forEach**: use `map` when you need a new transformed array. Use `forEach` only for side effects (logging, sending requests). `forEach` always returns `undefined` and cannot be chained.", np: "**map vs forEach**: 新अarray चाहिए → map। Side effects मात्र → forEach। forEach ले undefined return गर्छ, chain हुँदैन।", jp: "**map vs forEach**: 新しい配列が必要→map。副作用のみ→forEach。forEachはundefinedを返しチェーン不可。" },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "Can you implement reduce from scratch?", np: "Reduce scratch बाट implement गर्न सकिन्छ?", jp: "reduceをスクラッチで実装できますか？" },
      answer: {
        en: "Yes. `reduce` iterates over an array and accumulates a result. It starts with an initial value (the accumulator) and calls the callback with (accumulator, currentValue, index, array) for each element, using the return value as the new accumulator. Here is a simple implementation: `function myReduce(array, callback, initialValue) { let acc = initialValue; for (let i = 0; i < array.length; i++) { acc = callback(acc, array[i], i, array); } return acc; }`",
        np: "`reduce` array iterate गर्छ र result accumulate गर्छ। Simple implementation: `function myReduce(array, cb, init) { let acc = init; for (let i = 0; i < array.length; i++) { acc = cb(acc, array[i], i, array); } return acc; }`",
        jp: "シンプルな実装: `function myReduce(arr, cb, init) { let acc = init; for (let i = 0; i < arr.length; i++) { acc = cb(acc, arr[i], i, arr); } return acc; }` reduceは配列を走査して累積値を返す。",
      },
    },
    {
      question: { en: "Why does .sort() without a comparator give wrong results for numbers?", np: ".sort() comparator बिना numbers को लागि गलत result किन दिन्छ?", jp: "比較関数なしの.sort()が数値で正しくない結果を返す理由は？" },
      answer: {
        en: "Without a comparator, `.sort()` converts each element to a string and sorts lexicographically (like a dictionary). So `10` comes before `2` because `'1'` comes before `'2'` alphabetically. Always pass a numeric comparator when sorting numbers: `(a, b) => a - b` for ascending, `(b, a) => a - b` for descending. The comparator function should return a negative number if `a` should come first, a positive number if `b` should come first, and 0 if they are equal.",
        np: "Comparator बिना `.sort()` हरेक element लाई string मा convert गरेर lexicographically sort गर्छ। त्यसैले `10` ले `2` भन्दा अगाडि आउँछ — '1' ले '2' भन्दा alphabetically अगाडि हुन्छ। Numbers sort गर्न हमेशा `(a, b) => a - b` comparator pass गर्नुहोस्।",
        jp: "比較関数なしの`.sort()`は各要素を文字列に変換して辞書順にソート。そのため`10`が`2`より前に来る（'1'<'2'）。数値のソートには`(a, b) => a - b`を渡す。",
      },
    },
  ],
};
