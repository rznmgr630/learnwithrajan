import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_5_LESSONS: JsLessonDay = {
  day: 5,
  title: { en: "Objects — Creation, Methods, Destructuring & Spread", np: "Objects — Creation, Methods, Destructuring र Spread", jp: "オブジェクト・メソッド・分割代入・スプレッド" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "object-fundamentals",
      title: { en: "Object Fundamentals & Built-in Methods", np: "Object आधारभूत कुरा र Built-in Methods", jp: "オブジェクトの基礎と組み込みメソッド" },
      durationMinutes: 9,
      explanation: {
        en: "An object is a collection of key-value pairs — think of it as a labelled filing cabinet where each drawer (property) has a name and holds a value, which can be a string, number, function, or even another object.\n\n<b>Creating and accessing</b>\n• Object literals `{ key: value }` are the most common way to create one\n• Dot notation (`user.name`) is for known, fixed keys; bracket notation (`user[key]`) is required when the key is dynamic or stored in a variable\n• ES6 shorthand lets you write `{ name, age }` instead of `{ name: name, age: age }` when a variable's name matches the property name\n\n<b>Reading many properties at once</b>\n• `Object.keys()`, `Object.values()`, and `Object.entries()` turn an object into arrays you can loop over, `.map()`, or `.filter()` — exactly like a real array\n• `Object.fromEntries()` reverses `Object.entries()` — it's how you \"map\" or \"filter\" an object, since objects don't have their own `.map()`/`.filter()`\n• `Object.freeze()` makes an object's top-level properties read-only; `Object.hasOwn(obj, key)` is the modern way to check a property exists directly on the object.",
        np: "Object भनेको key-value pairs को collection हो — labelled filing cabinet जस्तै जहाँ हरेक drawer (property) को नाम हुन्छ र मान (value) राखिन्छ। Dot notation fixed keys का लागि, bracket notation dynamic keys का लागि। Object.keys/values/entries ले object लाई array मा बदल्छ ताकि map/filter प्रयोग गर्न सकिन्छ।",
        jp: "オブジェクトはキーと値のペアの集合 — ラベル付きファイルキャビネットのようなもの。ドット記法は固定キー、ブラケット記法は動的キーに使う。Object.keys/values/entriesはオブジェクトを配列に変換しmap/filterを可能にする。",
      },
      diagram: `const user = { name: "Alice", age: 30 };
                    │              │
                    ▼              ▼
              key/property       value

user.name         ← dot notation (fixed key)
user["age"]       ← bracket notation (dynamic/computed key)

Object.entries(user)                   →  [["name","Alice"], ["age",30]]
                                                     │
                                    now a real array — map/filter it
                                                     │
Object.fromEntries( ...mapped/filtered... )  →  back to a plain object`,
      codeExample: {
        title: { en: "Object literals, property access, and useful Object methods", np: "Object literals, property access र Object methods", jp: "オブジェクトリテラル・プロパティアクセス・Objectメソッド" },
        code: `// ── Object literal + shorthand method ────────────────────────────
const user = {
  name: "Alice",
  age: 30,
  greet() { return \`Hi, I'm \${this.name}\`; },   // shorthand method (ES6)
};

// ── Property access ───────────────────────────────────────────────
user.name;              // "Alice" — dot notation
const key = "age";
user[key];               // 30 — bracket notation (dynamic key)

// ── Add / update / delete ─────────────────────────────────────────
user.email = "alice@example.com";   // add
user.age = 31;                       // update
delete user.email;                   // remove entirely

// ── Property shorthand + computed keys ────────────────────────────
const name = "Bob", age = 25;
const person = { name, age };        // same as { name: name, age: age }
const field = "score";
const result = { [field]: 100 };     // { score: 100 }

// ── Checking existence ────────────────────────────────────────────
Object.hasOwn(user, "name");    // true — modern, preferred check

// ── Object.keys / values / entries / fromEntries ──────────────────
const scores = { alice: 95, bob: 87, carol: 92 };
Object.keys(scores);     // ["alice", "bob", "carol"]
Object.values(scores);   // [95, 87, 92]
Object.entries(scores);  // [["alice", 95], ["bob", 87], ["carol", 92]]

const passing = Object.fromEntries(
  Object.entries(scores).filter(([, score]) => score >= 90)
);
// { alice: 95, carol: 92 }

// ── freeze — shallow, top-level only ──────────────────────────────
const config = Object.freeze({ apiUrl: "https://api.example.com" });
// config.apiUrl = "x";  // silently ignored (TypeError in strict mode)`,
      },
      keyTakeaways: [
        { en: "Use dot notation for known, fixed keys; use bracket notation when the key is dynamic, computed, or stored in a variable.", np: "थाहा भएको fixed key का लागि dot notation; dynamic/computed key वा variable मा रहेको key का लागि bracket notation प्रयोग गर्नुहोस्।", jp: "既知の固定キーにはドット記法、動的・計算されたキーや変数に格納されたキーにはブラケット記法を使う。" },
        { en: "`Object.keys/values/entries` convert an object into an array so you can use array methods on it; `Object.fromEntries` converts the result back into an object.", np: "`Object.keys/values/entries` ले object लाई array मा बदल्छ ताकि array methods प्रयोग गर्न सकिन्छ; `Object.fromEntries` ले फेरि object मा फिर्ता बदल्छ।", jp: "`Object.keys/values/entries`はオブジェクトを配列に変換し配列メソッドを使えるようにする。`Object.fromEntries`は結果を再びオブジェクトに戻す。" },
        { en: "`Object.freeze()` only freezes top-level properties — any nested object or array inside it is still fully mutable.", np: "`Object.freeze()` ले top-level properties मात्र freeze गर्छ — भित्रको nested object/array अझै mutable नै रहन्छ।", jp: "`Object.freeze()`はトップレベルのプロパティのみを凍結する。内部のネストされたオブジェクト/配列は依然として変更可能。" },
      ],
      commonMistakes: [
        { en: "Writing `user[name]` when you meant the literal string key `\"name\"` — without quotes, JavaScript looks up a variable called `name`, not the property `name`.", np: "`\"name\"` literal key चाहेको ठाउँमा `user[name]` लेख्नु — quotes बिना JS ले `name` नामको variable खोज्छ, property होइन।", jp: "文字列キー`\"name\"`のつもりで`user[name]`と書くこと。引用符がないとJSは`name`という変数を探してしまう。" },
        { en: "Assuming `Object.freeze()` deep-freezes an object — mutating a nested object inside a frozen one still works.", np: "`Object.freeze()` ले deep freeze गर्छ भन्ने ठान्नु — frozen object भित्रको nested object अझै mutate गर्न सकिन्छ।", jp: "`Object.freeze()`が深く凍結すると思い込むこと。凍結されたオブジェクト内のネストされたオブジェクトはまだ変更可能。" },
        { en: "Using `\"key\" in obj` when you only want the object's own properties — `in` also checks inherited properties up the prototype chain, unlike `Object.hasOwn()`.", np: "Object आफ्नै property मात्र चाहिँदा `\"key\" in obj` प्रयोग गर्नु — `in` ले prototype chain का inherited properties पनि check गर्छ, `Object.hasOwn()` ले गर्दैन।", jp: "自身のプロパティだけを確認したいのに`\"key\" in obj`を使うこと。`in`はプロトタイプチェーンの継承プロパティも確認するが`Object.hasOwn()`はしない。" },
      ],
      quiz: [
        {
          question: { en: "Which notation must you use when the property key is stored in a variable?", np: "Property key variable मा राखिएको बेला कुन notation प्रयोग गर्नुपर्छ?", jp: "プロパティキーが変数に格納されている場合、どちらの記法を使うべき？" },
          options: [
            { en: "Dot notation, e.g. `obj.key`", np: "Dot notation, जस्तै `obj.key`", jp: "ドット記法、例: `obj.key`" },
            { en: "Bracket notation, e.g. `obj[key]`", np: "Bracket notation, जस्तै `obj[key]`", jp: "ブラケット記法、例: `obj[key]`" },
          ],
          correctIndex: 1,
          explanation: { en: "Dot notation only works with a literal, fixed property name; bracket notation evaluates the expression inside it, so it works with variables.", np: "Dot notation ले literal, fixed property name मात्र काम गर्छ; bracket notation ले भित्रको expression evaluate गर्छ, त्यसैले variable सँग काम गर्छ।", jp: "ドット記法はリテラルの固定プロパティ名でのみ機能する。ブラケット記法は内部の式を評価するため変数でも機能する。" },
        },
        {
          question: { en: "What does `Object.freeze()` protect against for nested objects?", np: "Nested objects का लागि `Object.freeze()` ले केबाट सुरक्षा दिन्छ?", jp: "`Object.freeze()`はネストされたオブジェクトに対して何を保護する？" },
          options: [
            { en: "It deep-freezes everything, including nested objects", np: "यसले nested objects समेत सबै deep-freeze गर्छ", jp: "ネストされたオブジェクトを含め、すべてを深く凍結する" },
            { en: "Nothing — it only freezes top-level properties; nested objects remain mutable", np: "केही होइन — यसले top-level properties मात्र freeze गर्छ; nested objects mutable नै रहन्छ", jp: "何もない — トップレベルのプロパティのみを凍結し、ネストされたオブジェクトは変更可能なまま" },
          ],
          correctIndex: 1,
          explanation: { en: "Object.freeze() is shallow. To fully lock a nested structure you'd need to recursively freeze every nested object yourself.", np: "Object.freeze() shallow हो। Nested structure पूर्ण रूपमा lock गर्न हरेक nested object recursively freeze गर्नुपर्छ।", jp: "Object.freeze()は浅い。ネストされた構造を完全にロックするには各ネストされたオブジェクトを再帰的に凍結する必要がある。" },
        },
        {
          question: { en: "What is the key difference between `\"key\" in obj` and `Object.hasOwn(obj, \"key\")`?", np: "`\"key\" in obj` र `Object.hasOwn(obj, \"key\")` बीचको मुख्य फरक के हो?", jp: "`\"key\" in obj`と`Object.hasOwn(obj, \"key\")`の主な違いは？" },
          options: [
            { en: "There is no difference — they always return the same result", np: "फरक छैन — दुवैले सधैं उस्तै result दिन्छन्", jp: "違いはない — 常に同じ結果を返す" },
            { en: "`in` also checks properties inherited via the prototype chain; `Object.hasOwn` checks only the object's own properties", np: "`in` ले prototype chain बाट inherit भएका properties पनि check गर्छ; `Object.hasOwn` ले object का आफ्नै properties मात्र check गर्छ", jp: "`in`はプロトタイプチェーン経由で継承されたプロパティも確認する。`Object.hasOwn`はオブジェクト自身のプロパティのみ確認する" },
          ],
          correctIndex: 1,
          explanation: { en: "`in` walks up the prototype chain, so it can return true for inherited methods like `toString`. `Object.hasOwn` is the precise, own-property-only check.", np: "`in` prototype chain माथि walk गर्छ, त्यसैले inherited method जस्तै `toString` का लागि पनि true फर्काउन सक्छ। `Object.hasOwn` precise, own-property-only check हो।", jp: "`in`はプロトタイプチェーンを遡るため、`toString`のような継承メソッドにもtrueを返せる。`Object.hasOwn`は自身のプロパティのみを正確に確認する。" },
        },
      ],
    },
    {
      id: "destructuring-spread-rest",
      title: { en: "Destructuring, Spread & Rest", np: "Destructuring, Spread र Rest", jp: "分割代入・スプレッド・rest" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Destructuring</b> unpacks values out of an object or array by name or position, instead of reaching in one property at a time — `const { name, age } = user` reads exactly like the shape of the data itself. It works with renaming (`{ name: userName }`), default values (`{ country = \"Unknown\" }`), nested shapes, and directly inside function parameters.\n\n<b>Spread</b> (`...`) expands an iterable's items into a new array or object — `{...obj1, ...obj2}` merges objects left to right, with later keys overwriting earlier ones. <b>Rest</b> (`...`) does the opposite: it collects whatever remaining items are left into a real array, and can only appear as the very last item in a destructuring pattern or function parameter list.",
        np: "Destructuring ले object/array बाट value लाई नाम वा position अनुसार unpack गर्छ। Spread (`...`) ले iterable लाई नयाँ array/object मा फिँजाउँछ; Rest (`...`) ले बाँकी सबै items लाई array मा collect गर्छ।",
        jp: "分割代入はオブジェクトや配列から名前や位置で値を取り出す。スプレッド(`...`)はイテラブルを新しい配列/オブジェクトに展開する。rest(`...`)は残りの項目を配列に集める。",
      },
      diagram: `const { name, age } = user;              ← object destructuring
const [first, , third] = [10, 20, 30];   ← array destructuring (skip with ,)
const [head, ...tail] = [1, 2, 3, 4];    ← rest collects [2, 3, 4]

{ ...obj1, ...obj2 }    ← spread MERGES, later keys win
function f(...args) {}  ← rest COLLECTS all arguments into an array

     spread  →  expands   ...arr  into  a, b, c
     rest    →  collects  a, b, c  into ...arr`,
      codeExample: {
        title: { en: "Destructuring, spread, and rest in practice", np: "Destructuring, spread, rest व्यवहारमा", jp: "分割代入・スプレッド・restの実践" },
        code: `const user = { name: "Alice", age: 30, address: { city: "Kathmandu" } };

// ── Object destructuring — rename, default, nested ────────────────
const { name, age } = user;
const { name: userName } = user;             // rename while destructuring
const { country = "Unknown" } = user;        // default (user has no country)
const { address: { city } } = user;          // nested destructuring

// In function parameters — very common in React/Express:
function greet({ name, age }) { return \`\${name} is \${age}\`; }

// ── Array destructuring — skip items, swap variables ───────────────
const [first, , third] = [10, 20, 30];   // skip index 1 with an empty slot
let a = 1, b = 2;
[a, b] = [b, a];                          // swap: a = 2, b = 1

// ── Spread — expanding into a new array/object ──────────────────────
const merged   = [...[1, 2], ...[3, 4]];        // [1, 2, 3, 4]
const combined = { ...{ a: 1 }, ...{ a: 2, b: 3 } };  // { a: 2, b: 3 } — last wins

// ── Rest — collecting the remainder ─────────────────────────────────
function sum(...numbers) {                 // rest gathers all args into an array
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4, 5);  // 15

const [head, ...tail] = [1, 2, 3, 4];   // head = 1, tail = [2, 3, 4]
const { name: n, ...rest } = user;      // n = "Alice", rest = { age: 30, address: {...} }`,
      },
      keyTakeaways: [
        { en: "Destructuring pulls values out by name or position and works directly in function parameters — no manual `.property` or `[index]` access needed.", np: "Destructuring ले नाम वा position अनुसार value निकाल्छ, function parameters मा सिधै काम गर्छ — manual property/index access चाहिँदैन।", jp: "分割代入は名前や位置で値を取り出し、関数パラメータで直接機能する。手動のプロパティ/インデックスアクセスは不要。" },
        { en: "Spread always creates a NEW array/object; when merging objects, later spread sources overwrite earlier ones for duplicate keys.", np: "Spread ले सधैं नयाँ array/object बनाउँछ; object merge गर्दा duplicate key मा पछिल्लो source ले अगाडिको overwrite गर्छ।", jp: "スプレッドは常に新しい配列/オブジェクトを作る。オブジェクトをマージする際、重複キーは後のソースが前のものを上書きする。" },
        { en: "Rest collects \"everything else\" into a real array, but it must be the LAST element in the pattern — you can't have anything after it.", np: "Rest ले 'बाँकी सबै' लाई एक real array मा collect गर्छ, तर यो pattern को अन्तिम element हुनुपर्छ।", jp: "restは「残り全部」を実際の配列に集めるが、パターンの最後の要素でなければならない。" },
      ],
      commonMistakes: [
        { en: "Confusing spread and rest because they share the same `...` syntax — spread EXPANDS an existing iterable, rest COLLECTS remaining values into one.", np: "Spread र rest दुवैले `...` syntax प्रयोग गर्ने भएर मिलाउनु — spread ले फिँजाउँछ, rest ले collect गर्छ।", jp: "同じ`...`構文を使うためスプレッドとrestを混同すること。スプレッドは展開し、restは収集する。" },
        { en: "Assuming `{...obj}` performs a deep copy — it only copies top-level keys; nested objects/arrays inside are still shared references.", np: "`{...obj}` ले deep copy गर्छ भन्ने ठान्नु — यसले top-level keys मात्र copy गर्छ, nested object/array अझै shared रहन्छ।", jp: "`{...obj}`が深いコピーを行うと思い込むこと。トップレベルのキーのみをコピーし、ネストされた参照は共有されたまま。" },
        { en: "Destructuring a property that doesn't exist without a default value and being surprised it silently returns `undefined` instead of throwing.", np: "Default value बिना नभएको property destructure गरेर error आउनुको सट्टा `undefined` आउँदा अनौठो मान्नु।", jp: "存在しないプロパティをデフォルト値なしで分割代入し、エラーではなく黙って`undefined`が返されて驚くこと。" },
      ],
      quiz: [
        {
          question: { en: "In `const { country = \"Unknown\" } = user`, what happens if `user.country` is `undefined`?", np: "`const { country = \"Unknown\" } = user` मा `user.country` `undefined` भएमा के हुन्छ?", jp: "`const { country = \"Unknown\" } = user`で`user.country`が`undefined`の場合どうなる？" },
          options: [
            { en: "It throws an error", np: "Error throw हुन्छ", jp: "エラーがスローされる" },
            { en: "`country` becomes `\"Unknown\"`", np: "`country` `\"Unknown\"` हुन्छ", jp: "`country`は`\"Unknown\"`になる" },
          ],
          correctIndex: 1,
          explanation: { en: "Destructuring defaults apply whenever the extracted value is exactly `undefined`, not just when the key is missing entirely.", np: "Extract भएको value ठ्याक्कै `undefined` भएमा destructuring default apply हुन्छ, key नभएको बेला मात्र होइन।", jp: "分割代入のデフォルトは、抽出された値がまさに`undefined`である場合に適用される。キーが完全に欠けている場合だけではない。" },
        },
        {
          question: { en: "What does `const [head, ...tail] = [1, 2, 3]` produce?", np: "`const [head, ...tail] = [1, 2, 3]` ले के दिन्छ?", jp: "`const [head, ...tail] = [1, 2, 3]`は何を生成する？" },
          options: [
            { en: "`head = 1`, `tail = [2, 3]`", np: "`head = 1`, `tail = [2, 3]`", jp: "`head = 1`、`tail = [2, 3]`" },
            { en: "`head = [1, 2, 3]`, `tail = undefined`", np: "`head = [1, 2, 3]`, `tail = undefined`", jp: "`head = [1, 2, 3]`、`tail = undefined`" },
          ],
          correctIndex: 0,
          explanation: { en: "The rest pattern collects everything after the first matched element into a new array.", np: "Rest pattern ले पहिलो matched element पछिका सबैलाई नयाँ array मा collect गर्छ।", jp: "restパターンは最初にマッチした要素以降のすべてを新しい配列に集める。" },
        },
        {
          question: { en: "Does `{...obj1, ...obj2}` deep copy nested objects inside `obj1` or `obj2`?", np: "`{...obj1, ...obj2}` ले `obj1` वा `obj2` भित्रका nested objects deep copy गर्छ?", jp: "`{...obj1, ...obj2}`は`obj1`や`obj2`内のネストされたオブジェクトを深くコピーする？" },
          options: [
            { en: "Yes, the result is fully independent at every level", np: "हो, result हरेक level मा पूर्ण independent हुन्छ", jp: "はい、結果はすべてのレベルで完全に独立している" },
            { en: "No — only top-level keys are copied; nested objects/arrays remain shared references", np: "होइन — top-level keys मात्र copy हुन्छ; nested objects/arrays shared reference नै रहन्छ", jp: "いいえ — トップレベルのキーのみコピーされ、ネストされたオブジェクト/配列は共有参照のまま" },
          ],
          correctIndex: 1,
          explanation: { en: "Spread is a shallow copy operation, exactly like `Object.assign`. Mutating a nested value through the copy will also change the original.", np: "Spread एक shallow copy operation हो, `Object.assign` जस्तै। Copy मार्फत nested value mutate गर्दा original पनि बदलिन्छ।", jp: "スプレッドは`Object.assign`と同様に浅いコピー操作。コピー経由でネストされた値を変更すると元も変わる。" },
        },
      ],
    },
    {
      id: "cloning-shallow-deep",
      title: { en: "Cloning Objects — Shallow vs Deep", np: "Object Cloning — Shallow vs Deep", jp: "オブジェクトのクローン — 浅いvs深い" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>shallow copy</b> (`{...obj}` or `Object.assign({}, obj)`) copies an object's top-level properties by value — but if a property's value is itself an object or array, only the reference is copied, not the data it points to. So the original and the copy end up pointing at the exact same nested object, and mutating it through either one affects both.\n\nA <b>deep clone</b> walks the entire structure and creates brand-new, fully independent copies at every level. `structuredClone()` is the modern, built-in way to do this (Node 17+, all modern browsers) and correctly handles `Date`, `Map`, `Set`, and `RegExp`. Avoid `JSON.parse(JSON.stringify(obj))` for this — it silently drops functions, `undefined` values, and `Symbol` keys, and turns `Date` objects into plain strings.",
        np: "Shallow copy ले top-level properties मात्र value द्वारा copy गर्छ — nested object/array भने अझै same reference रहन्छ। Deep clone ले हरेक level मा independent copy बनाउँछ। `structuredClone()` modern deep clone को लागि उपयोग गर्नुहोस्।",
        jp: "浅いコピーはトップレベルのプロパティのみをコピーする — ネストされたオブジェクト/配列は同じ参照のまま。深いクローンはすべてのレベルで独立したコピーを作る。深いクローンには`structuredClone()`を使う。",
      },
      diagram: `original ──┬── name: "Alice"          (copied BY VALUE — independent)
           └── hobbies: [...] ───┐
                                  │  SAME array reference
shallow = {...original} ──┬── name: "Bob"        (independent copy)
                           └── hobbies: [...] ────┘  ← mutating this affects original too!

deep = structuredClone(original)  →  every level is a brand-new, independent copy`,
      codeExample: {
        title: { en: "Shallow copy vs deep clone — the classic interview question", np: "Shallow copy vs deep clone — classic interview question", jp: "浅いコピーと深いクローン — 定番の面接質問" },
        code: `const original = {
  name: "Alice",
  hobbies: ["reading", "coding"],   // nested reference type
  address: { city: "Kathmandu" },   // another nested object
};

// ── Shallow copy — copies top-level properties only ────────────────
const shallow = { ...original };           // same as Object.assign({}, original)

shallow.name = "Bob";
console.log(original.name);   // "Alice" — top-level is independent, not affected

shallow.hobbies.push("gaming");
console.log(original.hobbies);   // ["reading", "coding", "gaming"] — affected! shared reference

// ── Deep clone — creates a fully independent copy ───────────────────
const deep = structuredClone(original);   // ES2022, Node 17+, modern browsers
deep.address.city = "Pokhara";
console.log(original.address.city);   // "Kathmandu" — NOT affected ✅

// ── Avoid this for deep cloning ──────────────────────────────────────
// const lossy = JSON.parse(JSON.stringify(original));
// loses: functions, undefined values, Symbol keys; Date becomes a string`,
      },
      keyTakeaways: [
        { en: "Spread/`Object.assign` only copy top-level properties — nested objects and arrays remain shared references between the original and the copy.", np: "Spread/`Object.assign` ले top-level properties मात्र copy गर्छ — nested object/array original र copy बीच shared reference नै रहन्छ।", jp: "スプレッド/`Object.assign`はトップレベルのプロパティのみをコピーする。ネストされたオブジェクト/配列は元とコピーの間で共有参照のまま。" },
        { en: "`structuredClone()` is the modern, native way to deep clone — it correctly handles `Date`, `Map`, `Set`, and `RegExp`, unlike the lossy `JSON.parse(JSON.stringify())` trick.", np: "`structuredClone()` modern, native deep clone तरिका हो — यसले `Date`, `Map`, `Set`, `RegExp` सही ढंगले handle गर्छ, lossy `JSON.parse(JSON.stringify())` भन्दा फरक।", jp: "`structuredClone()`は現代的なネイティブの深いクローン手法。`Date`・`Map`・`Set`・`RegExp`を正しく処理する。損失のある`JSON.parse(JSON.stringify())`とは異なる。" },
        { en: "Reach for a deep clone only when you genuinely need to mutate nested data without touching the original — otherwise a cheap shallow copy is simpler and faster.", np: "Original नछोई nested data mutate गर्नुपर्दा मात्र deep clone प्रयोग गर्नुहोस् — अन्यथा shallow copy छिटो र सरल हुन्छ।", jp: "元に触れずにネストされたデータを本当に変更する必要がある場合のみ深いクローンを使う。それ以外は安価な浅いコピーの方が簡単で速い。" },
      ],
      commonMistakes: [
        { en: "Believing `{...obj}` is a full deep copy, then being surprised when mutating a nested array through the copy also changes the original.", np: "`{...obj}` लाई पूर्ण deep copy मान्नु, अनि copy मार्फत nested array mutate गर्दा original पनि बदलिँदा अचम्मित हुनु।", jp: "`{...obj}`が完全な深いコピーだと信じ、コピー経由でネストされた配列を変更すると元も変わることに驚くこと。" },
        { en: "Deep-cloning data that contains `Date` objects, functions, or `undefined` with `JSON.parse(JSON.stringify(x))`, silently corrupting or losing them.", np: "`Date`, function, `undefined` भएको data लाई `JSON.parse(JSON.stringify(x))` ले deep-clone गर्दा silently corrupt/loss हुनु।", jp: "`Date`オブジェクト・関数・`undefined`を含むデータを`JSON.parse(JSON.stringify(x))`で深くクローンし、黙って破損・消失させること。" },
        { en: "Deep-cloning large objects \"just to be safe\" when a shallow copy would have been enough, hurting performance for no real benefit.", np: "Shallow copy नै पर्याप्त हुँदा 'सुरक्षाको लागि' ठूला object deep-clone गर्नु, अनावश्यक performance loss हुनु।", jp: "浅いコピーで十分な場合でも「念のため」大きなオブジェクトを深くクローンし、無駄にパフォーマンスを損なうこと。" },
      ],
      quiz: [
        {
          question: { en: "After `const shallow = {...original}`, if you push a new item to `shallow.hobbies`, what happens to `original.hobbies`?", np: "`const shallow = {...original}` पछि `shallow.hobbies` मा नयाँ item push गर्दा `original.hobbies` मा के हुन्छ?", jp: "`const shallow = {...original}`の後、`shallow.hobbies`に新しい項目をpushすると`original.hobbies`はどうなる？" },
          options: [
            { en: "It stays unaffected — arrays are always copied by value", np: "प्रभाव पर्दैन — array सधैं value द्वारा copy हुन्छ", jp: "影響を受けない — 配列は常に値でコピーされる" },
            { en: "It also changes, because both point to the same array reference", np: "यो पनि बदलिन्छ, किनकि दुवैले same array reference देखाउँछन्", jp: "変わる — 両方が同じ配列参照を指しているため" },
          ],
          correctIndex: 1,
          explanation: { en: "A shallow copy only copies the top-level reference, not a new array — so both variables point at the same underlying array in memory.", np: "Shallow copy ले top-level reference मात्र copy गर्छ, नयाँ array होइन — त्यसैले दुवै variable memory मा same array लाई point गर्छन्।", jp: "浅いコピーはトップレベルの参照のみをコピーし、新しい配列は作らない。そのため両方の変数はメモリ内の同じ配列を指す。" },
        },
        {
          question: { en: "Which method is the modern, preferred way to deep clone an object in JavaScript?", np: "JavaScript मा object deep clone गर्ने modern, preferred तरिका कुन हो?", jp: "JavaScriptでオブジェクトを深くクローンする現代的で推奨される方法は？" },
          options: [
            { en: "`JSON.parse(JSON.stringify(obj))`", np: "`JSON.parse(JSON.stringify(obj))`", jp: "`JSON.parse(JSON.stringify(obj))`" },
            { en: "`structuredClone(obj)`", np: "`structuredClone(obj)`", jp: "`structuredClone(obj)`" },
          ],
          correctIndex: 1,
          explanation: { en: "structuredClone() is built into modern JavaScript and correctly handles Date, Map, Set, and RegExp, which JSON round-tripping cannot.", np: "structuredClone() modern JS मा built-in छ र Date, Map, Set, RegExp सही ढंगले handle गर्छ, JSON round-trip ले सक्दैन।", jp: "structuredClone()はモダンJavaScriptに組み込まれており、Date・Map・Set・RegExpを正しく処理する。JSONの往復変換ではできない。" },
        },
        {
          question: { en: "What does `JSON.parse(JSON.stringify(obj))` lose or corrupt when cloning?", np: "`JSON.parse(JSON.stringify(obj))` ले clone गर्दा के हराउँछ वा corrupt गर्छ?", jp: "`JSON.parse(JSON.stringify(obj))`はクローン時に何を失う、または破損させる？" },
          options: [
            { en: "Nothing — it produces a perfect, lossless clone", np: "केही होइन — यसले perfect, lossless clone दिन्छ", jp: "何も — 完璧で無損失のクローンを生成する" },
            { en: "Functions, `undefined` values, and `Symbol` keys are dropped; `Date` objects become plain strings", np: "Functions, `undefined` values, `Symbol` keys हराउँछ; `Date` objects plain string मा बदलिन्छ", jp: "関数・`undefined`値・`Symbol`キーが失われ、`Date`オブジェクトは文字列になる" },
          ],
          correctIndex: 1,
          explanation: { en: "JSON has no representation for functions, undefined, or symbols, and serializes Date objects as ISO strings instead of Date instances.", np: "JSON मा function, undefined, symbol को कुनै representation छैन, र Date object लाई ISO string को रूपमा serialize गर्छ।", jp: "JSONには関数・undefined・シンボルの表現がなく、DateオブジェクトをインスタンスではなくISO文字列としてシリアライズする。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Which notation must you use when a property key is dynamic or stored in a variable?", np: "Property key dynamic वा variable मा रहेको बेला कुन notation प्रयोग गर्नुपर्छ?", jp: "プロパティキーが動的または変数に格納されている場合、どちらの記法を使うべき？" },
      options: [{ en: "Dot notation", np: "Dot notation", jp: "ドット記法" }, { en: "Bracket notation", np: "Bracket notation", jp: "ブラケット記法" }],
      correctIndex: 1,
      explanation: { en: "Bracket notation evaluates the expression inside it, so it works with variables and computed keys; dot notation only accepts a literal name.", np: "Bracket notation ले भित्रको expression evaluate गर्छ, त्यसैले variable सँग काम गर्छ।", jp: "ブラケット記法は内部の式を評価するため変数でも機能する。" },
    },
    {
      question: { en: "Does `Object.freeze()` deep-freeze nested objects inside the frozen object?", np: "`Object.freeze()` ले frozen object भित्रका nested objects पनि deep-freeze गर्छ?", jp: "`Object.freeze()`は凍結されたオブジェクト内のネストされたオブジェクトも深く凍結する？" },
      options: [{ en: "Yes, everything nested is frozen too", np: "हो, nested सबै पनि freeze हुन्छ", jp: "はい、ネストされたものもすべて凍結される" }, { en: "No — only top-level properties are frozen", np: "होइन — top-level properties मात्र freeze हुन्छ", jp: "いいえ — トップレベルのプロパティのみ凍結される" }],
      correctIndex: 1,
      explanation: { en: "Object.freeze() is shallow; nested structures need to be frozen individually to be fully immutable.", np: "Object.freeze() shallow हो; nested structure लाई पूर्ण immutable बनाउन individually freeze गर्नुपर्छ।", jp: "Object.freeze()は浅い。完全に不変にするにはネストされた構造を個別に凍結する必要がある。" },
    },
    {
      question: { en: "What's the difference between `\"key\" in obj` and `Object.hasOwn(obj, \"key\")`?", np: "`\"key\" in obj` र `Object.hasOwn(obj, \"key\")` मा के फरक छ?", jp: "`\"key\" in obj`と`Object.hasOwn(obj, \"key\")`の違いは？" },
      options: [{ en: "No difference", np: "फरक छैन", jp: "違いはない" }, { en: "`in` also checks inherited properties; `hasOwn` checks only own properties", np: "`in` ले inherited properties पनि check गर्छ; `hasOwn` ले आफ्नै properties मात्र check गर्छ", jp: "`in`は継承プロパティも確認する。`hasOwn`は自身のプロパティのみ確認する" }],
      correctIndex: 1,
      explanation: { en: "`in` walks the prototype chain; Object.hasOwn is the precise own-property check.", np: "`in` ले prototype chain walk गर्छ; Object.hasOwn precise own-property check हो।", jp: "`in`はプロトタイプチェーンを遡る。Object.hasOwnは正確な自己プロパティ確認。" },
    },
    {
      question: { en: "In `const { country = \"Unknown\" } = user`, when does the default value `\"Unknown\"` get used?", np: "`const { country = \"Unknown\" } = user` मा default value `\"Unknown\"` कहिले प्रयोग हुन्छ?", jp: "`const { country = \"Unknown\" } = user`でデフォルト値`\"Unknown\"`はいつ使われる？" },
      options: [{ en: "Whenever `user.country` is exactly `undefined`", np: "`user.country` ठ्याक्कै `undefined` भएमा", jp: "`user.country`がまさに`undefined`のとき" }, { en: "Only if the `user` object is completely empty", np: "`user` object पूर्ण खाली भएमा मात्र", jp: "`user`オブジェクトが完全に空の場合のみ" }],
      correctIndex: 0,
      explanation: { en: "Destructuring defaults trigger whenever the extracted value is undefined, regardless of why.", np: "Extract भएको value undefined भएमा जुनसुकै कारणले पनि default trigger हुन्छ।", jp: "分割代入のデフォルトは、抽出された値がundefinedであれば理由を問わず発動する。" },
    },
    {
      question: { en: "Is `...` for spread and `...` for rest the same operation?", np: "Spread को `...` र rest को `...` उस्तै operation हो?", jp: "スプレッドの`...`とrestの`...`は同じ操作？" },
      options: [{ en: "Yes, always identical", np: "हो, सधैं उस्तै", jp: "はい、常に同一" }, { en: "No — spread expands an iterable, rest collects remaining values into one", np: "होइन — spread ले फिँजाउँछ, rest ले बाँकीलाई एकमा collect गर्छ", jp: "いいえ — スプレッドは展開し、restは残りを1つに集める" }],
      correctIndex: 1,
      explanation: { en: "Same syntax, opposite direction: spread pulls values out into a new structure, rest gathers loose values into an array.", np: "Syntax उस्तै तर विपरीत दिशा: spread ले value बाहिर निकाल्छ, rest ले array मा जम्मा गर्छ।", jp: "同じ構文だが逆方向: スプレッドは値を取り出し、restは配列に集める。" },
    },
    {
      question: { en: "Does `{...obj1, ...obj2}` create fully independent nested objects?", np: "`{...obj1, ...obj2}` ले पूर्ण independent nested objects बनाउँछ?", jp: "`{...obj1, ...obj2}`は完全に独立したネストされたオブジェクトを作る？" },
      options: [{ en: "Yes, at every level", np: "हो, हरेक level मा", jp: "はい、すべてのレベルで" }, { en: "No — only the top level is new; nested objects/arrays are still shared", np: "होइन — top level मात्र नयाँ हो; nested objects/arrays अझै shared छन्", jp: "いいえ — トップレベルのみ新規で、ネストされたオブジェクト/配列は共有されたまま" }],
      correctIndex: 1,
      explanation: { en: "Spread is a shallow-copy operation, just like Object.assign.", np: "Spread एक shallow-copy operation हो, Object.assign जस्तै।", jp: "スプレッドはObject.assignと同様の浅いコピー操作。" },
    },
    {
      question: { en: "After a shallow copy, does mutating a nested array through the copy affect the original?", np: "Shallow copy पछि copy मार्फत nested array mutate गर्दा original प्रभावित हुन्छ?", jp: "浅いコピー後、コピー経由でネストされた配列を変更すると元は影響を受ける？" },
      options: [{ en: "Yes — the nested array reference is shared", np: "हो — nested array reference shared हुन्छ", jp: "はい — ネストされた配列の参照は共有されている" }, { en: "No — every level is independent", np: "होइन — हरेक level independent छ", jp: "いいえ — すべてのレベルが独立している" }],
      correctIndex: 0,
      explanation: { en: "Only top-level values are copied by a shallow copy; nested references remain shared.", np: "Shallow copy ले top-level values मात्र copy गर्छ; nested references shared नै रहन्छ।", jp: "浅いコピーはトップレベルの値のみをコピーし、ネストされた参照は共有されたまま。" },
    },
    {
      question: { en: "Which is the modern, preferred way to deep clone an object with Dates and Maps inside it?", np: "Dates र Maps भएको object deep clone गर्ने modern, preferred तरिका कुन हो?", jp: "DateとMapを含むオブジェクトを深くクローンする現代的で推奨される方法は？" },
      options: [{ en: "`structuredClone(obj)`", np: "`structuredClone(obj)`", jp: "`structuredClone(obj)`" }, { en: "`JSON.parse(JSON.stringify(obj))`", np: "`JSON.parse(JSON.stringify(obj))`", jp: "`JSON.parse(JSON.stringify(obj))`" }],
      correctIndex: 0,
      explanation: { en: "structuredClone() correctly preserves Date and Map instances; JSON round-tripping corrupts or loses them.", np: "structuredClone() ले Date र Map instances सही ढंगले preserve गर्छ; JSON round-trip ले corrupt/loss गराउँछ।", jp: "structuredClone()はDateとMapのインスタンスを正しく保持する。JSONの往復変換は破損・消失させる。" },
    },
    {
      question: { en: "Why should you avoid `JSON.parse(JSON.stringify(obj))` for deep cloning objects with functions?", np: "Function भएको object deep clone गर्दा `JSON.parse(JSON.stringify(obj))` किन avoid गर्नुपर्छ?", jp: "関数を含むオブジェクトを深くクローンする際に`JSON.parse(JSON.stringify(obj))`を避けるべき理由は？" },
      options: [{ en: "It's too slow to matter in practice", np: "यो व्यवहारमा धेरै ढिलो हुन्छ", jp: "実際には遅すぎて問題にならない" }, { en: "JSON has no representation for functions — they are silently dropped", np: "JSON मा function को कुनै representation छैन — silently हराउन्छ", jp: "JSONには関数の表現がなく、黙って削除される" }],
      correctIndex: 1,
      explanation: { en: "JSON.stringify simply omits function-valued properties entirely, along with undefined and Symbol keys.", np: "JSON.stringify ले function-valued properties लाई पूर्ण रूपमा omit गर्छ, undefined र Symbol keys सँगै।", jp: "JSON.stringifyは関数値のプロパティをundefinedやSymbolキーとともに完全に省略する。" },
    },
  ],
};
