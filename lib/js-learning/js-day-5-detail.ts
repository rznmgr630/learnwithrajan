import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_5_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Objects are the fundamental building block of JavaScript — almost everything is an object or behaves like one. Understanding how to create, read, update, and delete properties, how destructuring works, and how to clone objects correctly will save you hours of debugging.",
      np: "Objects JavaScript को fundamental building block हो — लगभग सबै कुरा object हो वा object जस्तो व्यवहार गर्छ। Create, read, update, delete — र destructuring तथा cloning सहि ढंगले गर्न सिक्नु जरुरी छ।",
      jp: "オブジェクトはJavaScriptの基本構成要素。CRUD・分割代入・クローニングを正しく理解するとデバッグ時間が大幅に減る。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "PFmuCDHHpwk", title: "JavaScript Objects and Prototypes" },
      ],
    },
    {
      title: { en: "Creating and working with objects", np: "Objects सिर्जना र प्रयोग", jp: "オブジェクトの作成と操作" },
      blocks: [
        {
          type: "code",
          title: { en: "Object literals, property access, and mutation", np: "Object literals, property access र mutation", jp: "オブジェクトリテラル・プロパティアクセス・変更" },
          code: `// ── Object literal ────────────────────────────────────────────────
const user = {
  name: "Alice",
  age: 30,
  address: {
    city: "Kathmandu",
    country: "Nepal",
  },
  greet() {                     // shorthand method syntax (ES6)
    return \`Hi, I'm \${this.name}\`;
  },
};

// ── Property access ───────────────────────────────────────────────
user.name;                      // "Alice" — dot notation
user["age"];                    // 30 — bracket notation (use when key is dynamic)
user.address.city;              // "Kathmandu" — nested access

const key = "name";
user[key];                      // "Alice" — dynamic key access

// ── Adding / updating properties ───────────────────────────────────
user.email = "alice@example.com";   // add new property
user.age = 31;                       // update existing
user["hobbies"] = ["reading", "coding"];

// ── Deleting properties ────────────────────────────────────────────
delete user.email;              // removes the property entirely

// ── Checking if a property exists ─────────────────────────────────
"name" in user;                 // true — checks own AND inherited properties
user.hasOwnProperty("name");    // true — checks own properties only
Object.hasOwn(user, "name");    // true — modern, preferred over hasOwnProperty

// ── Property shorthand (ES6) ───────────────────────────────────────
const name = "Bob";
const age  = 25;
const person = { name, age };   // same as { name: name, age: age }

// ── Computed property names ───────────────────────────────────────
const field = "score";
const result = { [field]: 100 };  // { score: 100 }`,
        },
      ],
    },
    {
      title: { en: "Destructuring, spread & rest", np: "Destructuring, spread र rest", jp: "分割代入・スプレッド・rest" },
      blocks: [
        {
          type: "code",
          title: { en: "Unpacking objects and arrays cleanly", np: "Objects र arrays clearly unpack गर्नु", jp: "オブジェクトと配列を簡潔に展開する" },
          code: `// ── Object destructuring ─────────────────────────────────────────
const { name, age } = user;          // extract name and age
console.log(name, age);              // "Alice" 30

// Rename while destructuring:
const { name: userName, age: userAge } = user;

// Default values (used when the property is undefined):
const { country = "Unknown" } = user;  // "Unknown" — user has no country

// Nested destructuring:
const { address: { city } } = user;    // "Kathmandu"

// In function parameters — very common in React/Express:
function greet({ name, age }) {
  return \`\${name} is \${age}\`;
}

// ── Array destructuring ───────────────────────────────────────────
const [first, second, , fourth] = [10, 20, 30, 40];  // skip third with empty comma
console.log(first, second, fourth);   // 10 20 40

// Swapping variables:
let a = 1, b = 2;
[a, b] = [b, a];   // a = 2, b = 1

// ── Spread operator — expanding an iterable ───────────────────────
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2];      // [1, 2, 3, 4, 5, 6]

const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3 };
const combined = { ...obj1, ...obj2 };  // { a: 1, b: 2, c: 3 }

// Overriding with spread (last one wins for duplicate keys):
const updated = { ...user, age: 31 };  // shallow copy with age updated

// ── Rest parameters — collect remaining items ─────────────────────
function sum(...numbers) {              // rest collects all arguments into an array
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4, 5);  // 15

const [head, ...tail] = [1, 2, 3, 4];  // head = 1, tail = [2, 3, 4]
const { name: n, ...rest } = user;     // n = "Alice", rest = { age: 30, address: ... }`,
        },
      ],
    },
    {
      title: { en: "Cloning objects — shallow vs deep", np: "Objects clone — shallow vs deep", jp: "オブジェクトのクローン — 浅いvs深い" },
      blocks: [
        {
          type: "code",
          title: { en: "Shallow copy vs deep clone — the interview question", np: "Shallow copy vs deep clone — interview question", jp: "浅いコピーと深いクローン" },
          code: `const original = {
  name: "Alice",
  hobbies: ["reading", "coding"],   // nested reference type
  address: { city: "Kathmandu" },   // another nested object
};

// ── Shallow copy — copies top-level properties only ────────────────
const shallow1 = Object.assign({}, original);
const shallow2 = { ...original };                // same result

// The top-level 'name' is independent:
shallow1.name = "Bob";
console.log(original.name);  // "Alice" — not affected

// But nested objects are STILL shared references:
shallow1.hobbies.push("gaming");
console.log(original.hobbies);  // ["reading", "coding", "gaming"] — affected!

shallow1.address.city = "Pokhara";
console.log(original.address.city);  // "Pokhara" — affected!

// ── Deep clone — creates fully independent copy ───────────────────

// Option 1: JSON (fast, but lossy — loses functions, undefined, Date, Symbol)
const deep1 = JSON.parse(JSON.stringify(original));
deep1.hobbies.push("gaming");
console.log(original.hobbies);  // not affected ✅

// Option 2: structuredClone (modern, native, handles more types)
const deep2 = structuredClone(original);  // ES2022, Node 17+
deep2.address.city = "Pokhara";
console.log(original.address.city);  // "Kathmandu" — not affected ✅

// Option 3: Lodash cloneDeep (for maximum compatibility or complex objects)
// import { cloneDeep } from "lodash";
// const deep3 = cloneDeep(original);

// Rule: use structuredClone for deep cloning — it handles Date, RegExp, Map, Set`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            { en: "**Shallow copy** (`{...obj}` or `Object.assign`) is fine for flat objects. Any nested objects or arrays are still shared between the original and the copy.", np: "**Shallow copy** flat objects का लागि ठीक। Nested objects/arrays original र copy दुवैमा shared रहन्छ।", jp: "**浅いコピー**はフラットなオブジェクトなら問題なし。ネストされた参照は共有されたまま。" },
            { en: "**Deep clone** with `structuredClone()` creates a completely independent copy. Use it when you need to mutate a nested structure without affecting the original.", np: "**Deep clone** `structuredClone()` ले पूरै independent copy बनाउँछ। Nested structure mutate गर्दा original affect हुनु हुँदैन भने प्रयोग गर्नुहोस्।", jp: "**深いクローン** `structuredClone()`は完全に独立したコピーを作る。ネストされた構造を変更する際に使う。" },
            { en: "**Object.assign(target, source)** is equivalent to spreading: it copies own enumerable properties from source to target. The target is mutated in place.", np: "**Object.assign(target, source)** spread जस्तै। Source बाट target मा own enumerable properties copy गर्छ। Target mutate हुन्छ।", jp: "**Object.assign**はスプレッドと同等。sourceのownかつenumerableなプロパティをtargetにコピー（targetは変更される）。" },
          ],
        },
      ],
    },
    {
      title: { en: "Useful Object methods", np: "उपयोगी Object methods", jp: "便利なObjectメソッド" },
      blocks: [
        {
          type: "code",
          title: { en: "Object.keys, values, entries, fromEntries, freeze", np: "Object methods", jp: "Objectメソッド" },
          code: `const scores = { alice: 95, bob: 87, carol: 92 };

Object.keys(scores);     // ["alice", "bob", "carol"]
Object.values(scores);   // [95, 87, 92]
Object.entries(scores);  // [["alice", 95], ["bob", 87], ["carol", 92]]

// Transform an object (like map but for objects):
const doubled = Object.fromEntries(
  Object.entries(scores).map(([key, val]) => [key, val * 2])
);
// { alice: 190, bob: 174, carol: 184 }

// Filter an object:
const passing = Object.fromEntries(
  Object.entries(scores).filter(([, score]) => score >= 90)
);
// { alice: 95, carol: 92 }

// Freeze — prevent modifications (shallow — does not deep-freeze)
const config = Object.freeze({ apiUrl: "https://api.example.com", timeout: 5000 });
// config.timeout = 10000;  // silently ignored in sloppy mode, TypeError in strict

// Object.isFrozen(config);  // true`,
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What is the difference between spread and Object.assign?", np: "Spread र Object.assign मा के फरक?", jp: "スプレッドとObject.assignの違いは？" },
      answer: {
        en: "They are functionally equivalent for creating a shallow copy. The main differences: `Object.assign` mutates the target object and returns it (so `Object.assign({}, source)` creates a new object only because the first argument is a new `{}`). Spread always creates a new object/array. Spread is more readable for simple merges. `Object.assign` is useful when you want to merge into an existing object in place.",
        np: "दुवैले shallow copy बनाउँछन्। `Object.assign` target object mutate गर्छ। Spread हमेशा नयाँ object बनाउँछ। Simple merge का लागि spread बढी readable। Existing object मा merge गर्न `Object.assign` उपयोगी।",
        jp: "どちらも浅いコピーを作成。`Object.assign`はターゲットを変更して返す。スプレッドは常に新しいオブジェクトを作る。単純なマージはスプレッドの方が読みやすい。既存のオブジェクトに直接マージする場合は`Object.assign`が便利。",
      },
    },
    {
      question: { en: "How do you deep clone an object?", np: "Object deep clone कसरी गर्ने?", jp: "オブジェクトを深くクローンするには？" },
      answer: {
        en: "Use `structuredClone(obj)` — it is built into modern JavaScript (Node 17+, all modern browsers) and handles Date, RegExp, Map, Set, ArrayBuffer, and more. For older environments or complex class instances, use Lodash's `cloneDeep`. Avoid `JSON.parse(JSON.stringify(obj))` — it loses functions, `undefined` values, `Symbol` keys, `Date` objects become strings, and it cannot handle circular references.",
        np: "Modern JS मा `structuredClone(obj)` प्रयोग गर्नुहोस् — Node 17+, modern browsers मा available र Date, Map, Set पनि handle गर्छ। पुरानो environment का लागि Lodash `cloneDeep`। `JSON.parse(JSON.stringify)` avoid गर्नुहोस् — functions, undefined, Symbol, Date हराउँछ।",
        jp: "`structuredClone(obj)`を使う（Node 17+・モダンブラウザ対応、Date・Map・Setも処理可能）。古い環境ではLodash `cloneDeep`。`JSON.parse(JSON.stringify)`は関数・undefined・Symbol・Dateが失われるので避ける。",
      },
    },
  ],
};
