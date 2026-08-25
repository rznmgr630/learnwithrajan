import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_9_LESSONS: JsLessonDay = {
  day: 9,
  title: { en: "Prototype System & Prototype Chain", np: "Prototype System र Prototype Chain", jp: "プロトタイプシステムと継承チェーン" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "prototype-chain",
      title: { en: "The Prototype Chain", np: "The Prototype Chain", jp: "プロトタイプチェーン" },
      durationMinutes: 9,
      explanation: {
        en: "Every JavaScript <b>object</b> has an internal link to another object called its <b>prototype</b>.\n\nWhen you try to access a property, JavaScript first checks the object itself. If it doesn't find it, JavaScript looks at the object's prototype. If it still doesn't find it, it continues going up the <b>prototype chain</b> until it finds the property or reaches `null`.\n\n```text\nobject\n   ↓\nprototype\n   ↓\nprototype's prototype\n   ↓\n   ...\n   ↓\nnull\n```\n\nThis is how JavaScript provides <b>inheritance</b> (sharing properties and methods between objects).\n\nNothing is copied from the prototype. The object simply <b>looks up</b> the chain when needed.\n\n---\n\n### 1. Property lookup\n\n```javascript\nconst person = {\n  name: \"Rajan\"\n};\n\nconsole.log(person.toString());\n```\n\nThere is no `toString` directly inside `person`. JavaScript looks up the prototype chain:\n\n```text\nperson\n  ↓\nObject.prototype\n  ↓\ntoString() ✅\n```\n\nSo the method can still be used.\n\n---\n\n### 2. Adding a method to a prototype\n\n```javascript\nfunction User(name) {\n  this.name = name;\n}\n\nUser.prototype.greet = function () {\n  console.log(`Hello ${this.name}`);\n};\n\nconst user1 = new User(\"Rajan\");\nconst user2 = new User(\"Alex\");\n\nuser1.greet();\nuser2.greet();\n```\n\nBoth objects can use `greet()` even though `greet` isn't stored directly on either object.\n\n```text\nuser1 ──────┐\n            ↓\n      User.prototype\n            ↑\nuser2 ──────┘\n```\n\nThere is <b>one shared `greet` function</b>, not one copy for every user.\n\n---\n\n### 3. Checking the prototype\n\n```javascript\nObject.getPrototypeOf(user1);\n```\n\nThis is the modern way to inspect an object's prototype.\n\nYou may also see `user1.__proto__`, but `__proto__` is <b>legacy</b> (an older API) and should generally be avoided in new code.\n\n---\n\n### 4. Prototype lookup vs own property\n\n```javascript\nfunction User(name) {\n  this.name = name;\n}\n\nUser.prototype.greet = function () {\n  console.log(\"Hello\");\n};\n\nconst user = new User(\"Rajan\");\n\nconsole.log(user.name);\n// Rajan\n\nconsole.log(user.greet);\n// function\n```\n\n`name` belongs directly to `user`:\n\n```text\nuser\n └── name ✅\n```\n\n`greet` belongs to `User.prototype`:\n\n```text\nuser\n   ↓\nUser.prototype\n └── greet ✅\n```\n\nJavaScript finds both because it searches the prototype chain.\n\n---\n\n### Easy memory trick\n\n> <b>Object → Prototype → Prototype → ... → null</b>",
        np: "हरेक JavaScript <b>object</b> को अर्को object सँग आन्तरिक जोडाइ हुन्छ, जसलाई यसको <b>prototype</b> भनिन्छ।\n\nतपाईंले property पहुँच गर्न खोज्दा, JavaScript ले पहिले object आफैंमा हेर्छ। नभेटे, object को prototype मा हेर्छ। त्यहाँ पनि नभेटे, property भेट्टाउनेसम्म वा `null` पुग्नेसम्म <b>prototype chain</b> माथि चढ्दै जान्छ।\n\n```text\nobject\n   ↓\nprototype\n   ↓\nprototype's prototype\n   ↓\n   ...\n   ↓\nnull\n```\n\nयसै तरिकाले JavaScript ले <b>inheritance</b> (object बीच property र method बाँड्नु) दिन्छ।\n\nPrototype बाट केही copy हुँदैन। Object ले चाहिँदा chain <b>माथि खोज्छ</b> मात्र।\n\n---\n\n### 1. Property खोजी\n\n```javascript\nconst person = {\n  name: \"Rajan\"\n};\n\nconsole.log(person.toString());\n```\n\n`person` भित्र सिधै `toString` छैन। JavaScript ले prototype chain माथि हेर्छ:\n\n```text\nperson\n  ↓\nObject.prototype\n  ↓\ntoString() ✅\n```\n\nत्यसैले method अझै प्रयोग गर्न सकिन्छ।\n\n---\n\n### 2. Prototype मा method थप्नु\n\n```javascript\nfunction User(name) {\n  this.name = name;\n}\n\nUser.prototype.greet = function () {\n  console.log(`Hello ${this.name}`);\n};\n\nconst user1 = new User(\"Rajan\");\nconst user2 = new User(\"Alex\");\n\nuser1.greet();\nuser2.greet();\n```\n\n`greet` कुनै पनि object मा सिधै नराखिए पनि दुबैले प्रयोग गर्न सक्छन्।\n\n```text\nuser1 ──────┐\n            ↓\n      User.prototype\n            ↑\nuser2 ──────┘\n```\n\nहरेक user का लागि छुट्टै copy होइन, <b>एउटै साझा `greet` function</b> हुन्छ।\n\n---\n\n### 3. Prototype जाँच्नु\n\n```javascript\nObject.getPrototypeOf(user1);\n```\n\nयो object को prototype हेर्ने आधुनिक तरिका हो।\n\nतपाईंले `user1.__proto__` पनि देख्न सक्नुहुन्छ, तर `__proto__` <b>legacy</b> (पुरानो API) हो र नयाँ code मा सामान्यतया प्रयोग नगर्नु राम्रो।\n\n---\n\n### 4. Prototype खोजी vs आफ्नै property\n\n```javascript\nfunction User(name) {\n  this.name = name;\n}\n\nUser.prototype.greet = function () {\n  console.log(\"Hello\");\n};\n\nconst user = new User(\"Rajan\");\n\nconsole.log(user.name);\n// Rajan\n\nconsole.log(user.greet);\n// function\n```\n\n`name` सिधै `user` को हो:\n\n```text\nuser\n └── name ✅\n```\n\n`greet` `User.prototype` को हो:\n\n```text\nuser\n   ↓\nUser.prototype\n └── greet ✅\n```\n\nJavaScript ले prototype chain खोज्ने हुनाले दुबै भेट्टाउँछ।\n\n---\n\n### सम्झने सजिलो तरिका\n\n> <b>Object → Prototype → Prototype → ... → null</b>",
        jp: "すべてのJavaScriptの<b>オブジェクト</b>は、<b>プロトタイプ</b>と呼ばれる別のオブジェクトへの内部的なリンクを持っています。\n\nプロパティにアクセスしようとすると、JavaScriptはまずそのオブジェクト自身を調べます。見つからなければプロトタイプを調べ、それでも見つからなければ、プロパティが見つかるか `null` に到達するまで<b>プロトタイプチェーン</b>をたどります。\n\n```text\nobject\n   ↓\nprototype\n   ↓\nprototype's prototype\n   ↓\n   ...\n   ↓\nnull\n```\n\nこれがJavaScriptの<b>継承</b>（オブジェクト間でプロパティやメソッドを共有すること）の仕組みです。\n\nプロトタイプから何かがコピーされるわけではありません。オブジェクトは必要なときにチェーンを<b>たどって探す</b>だけです。\n\n---\n\n### 1. プロパティの探索\n\n```javascript\nconst person = {\n  name: \"Rajan\"\n};\n\nconsole.log(person.toString());\n```\n\n`person` の中に `toString` は直接ありません。JavaScriptはプロトタイプチェーンをたどります:\n\n```text\nperson\n  ↓\nObject.prototype\n  ↓\ntoString() ✅\n```\n\nだからこのメソッドが使えます。\n\n---\n\n### 2. プロトタイプにメソッドを追加する\n\n```javascript\nfunction User(name) {\n  this.name = name;\n}\n\nUser.prototype.greet = function () {\n  console.log(`Hello ${this.name}`);\n};\n\nconst user1 = new User(\"Rajan\");\nconst user2 = new User(\"Alex\");\n\nuser1.greet();\nuser2.greet();\n```\n\n`greet` はどちらのオブジェクトにも直接入っていませんが、両方から使えます。\n\n```text\nuser1 ──────┐\n            ↓\n      User.prototype\n            ↑\nuser2 ──────┘\n```\n\nユーザーごとのコピーではなく、<b>共有された1つの `greet` 関数</b>があります。\n\n---\n\n### 3. プロトタイプを調べる\n\n```javascript\nObject.getPrototypeOf(user1);\n```\n\nこれがオブジェクトのプロトタイプを調べる現代的な方法です。\n\n`user1.__proto__` も見かけますが、`__proto__` は<b>レガシー</b>（古いAPI）であり、新しいコードでは基本的に避けます。\n\n---\n\n### 4. プロトタイプ経由と自身のプロパティ\n\n```javascript\nfunction User(name) {\n  this.name = name;\n}\n\nUser.prototype.greet = function () {\n  console.log(\"Hello\");\n};\n\nconst user = new User(\"Rajan\");\n\nconsole.log(user.name);\n// Rajan\n\nconsole.log(user.greet);\n// function\n```\n\n`name` は `user` 自身のものです:\n\n```text\nuser\n └── name ✅\n```\n\n`greet` は `User.prototype` のものです:\n\n```text\nuser\n   ↓\nUser.prototype\n └── greet ✅\n```\n\nJavaScriptはプロトタイプチェーンを探索するので、どちらも見つかります。\n\n---\n\n### 覚え方\n\n> <b>Object → Prototype → Prototype → ... → null</b>",
      },
      diagram: `const user = new User("Rajan");

user
 ├── name: "Rajan"
 │
 └── [[Prototype]]
          ↓
     User.prototype
     ├── greet()
     │
     └── [[Prototype]]
              ↓
         Object.prototype
         ├── toString()
         ├── hasOwnProperty()
         │
         └── [[Prototype]]
                  ↓
                null


When you write user.greet(), JavaScript checks:

1. Does user have greet?        no
2. Does User.prototype have it? yes
3. Found it, run it`,
      codeExample: {
        title: { en: "Looking up the chain, and sharing one method", np: "Chain माथि खोज्नु, र एउटै method बाँड्नु", jp: "チェーンをたどる、1つのメソッドを共有する" },
        code: `// ── 1. A method found further up the chain ────────────────────────
const person = { name: "Rajan" };

console.log(person.toString()); // from Object.prototype

// ── 2. One shared method on the prototype ─────────────────────────
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  console.log(\`Hello \${this.name}\`);
};

const user1 = new User("Rajan");
const user2 = new User("Alex");

user1.greet(); // Hello Rajan
user2.greet(); // Hello Alex

// Both share the very same function object
console.log(user1.greet === user2.greet); // true

// ── 3. Inspecting the prototype ───────────────────────────────────
console.log(Object.getPrototypeOf(user1) === User.prototype); // true

// ── 4. Own property vs inherited one ──────────────────────────────
console.log(Object.hasOwn(user1, "name"));  // true  — on the object
console.log(Object.hasOwn(user1, "greet")); // false — on the prototype`,
      },
      keyTakeaways: [
        { en: "Every object has an internal <b>prototype</b> link.", np: "हरेक object को आन्तरिक <b>prototype</b> जोडाइ हुन्छ।", jp: "すべてのオブジェクトは内部的な<b>プロトタイプ</b>リンクを持つ。" },
        { en: "JavaScript searches the object first, then its prototype, then higher prototypes.", np: "JavaScript ले पहिले object, त्यसपछि यसको prototype, अनि माथिका prototype खोज्छ।", jp: "JavaScriptはまずオブジェクト、次にそのプロトタイプ、さらに上のプロトタイプを探す。" },
        { en: "This search is called the <b>prototype chain</b>.", np: "यो खोजीलाई <b>prototype chain</b> भनिन्छ।", jp: "この探索を<b>プロトタイプチェーン</b>と呼ぶ。" },
        { en: "The chain ends at <b>`null`</b>.", np: "Chain <b>`null`</b> मा सकिन्छ।", jp: "チェーンは<b>`null`</b>で終わる。" },
        { en: "Prototypes provide <b>inheritance</b> (sharing properties and methods).", np: "Prototype ले <b>inheritance</b> (property र method बाँड्नु) दिन्छ।", jp: "プロトタイプは<b>継承</b>（プロパティとメソッドの共有）を提供する。" },
        { en: "Prototype methods are <b>shared</b> between instances instead of being copied.", np: "Prototype का method copy नभई instance बीच <b>साझा</b> हुन्छन्।", jp: "プロトタイプのメソッドはコピーされず、インスタンス間で<b>共有</b>される。" },
        { en: "Use `Object.getPrototypeOf(obj)` to inspect an object's prototype.", np: "Object को prototype हेर्न `Object.getPrototypeOf(obj)` प्रयोग गर्नुहोस्।", jp: "オブジェクトのプロトタイプを調べるには `Object.getPrototypeOf(obj)` を使う。" },
        { en: "`__proto__` is a <b>legacy</b> API and should generally be avoided.", np: "`__proto__` <b>legacy</b> API हो र सामान्यतया प्रयोग नगर्नु राम्रो।", jp: "`__proto__` は<b>レガシー</b>なAPIで、基本的に避ける。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking prototype methods are copied</b> — `User.prototype.greet` is not copied into every `User` object; each one reaches it through the chain, so `user1.greet === user2.greet` is `true`.", np: "<b>Prototype का method copy हुन्छन् भन्ने ठान्नु</b> — `User.prototype.greet` हरेक `User` object मा copy हुँदैन; हरेकले chain मार्फत पुग्छ, त्यसैले `user1.greet === user2.greet` `true` हुन्छ।", jp: "<b>プロトタイプのメソッドがコピーされると思う</b> — `User.prototype.greet` は各 `User` にコピーされない。チェーン経由で参照するので `user1.greet === user2.greet` は `true`。" },
        { en: "<b>Thinking JavaScript only checks the object itself</b> — even when `greet` isn't inside `user`, the search continues up the prototype chain.", np: "<b>JavaScript ले object आफैं मात्र हेर्छ भन्ने ठान्नु</b> — `greet` `user` भित्र नभए पनि, खोजी prototype chain माथि जारी रहन्छ।", jp: "<b>JavaScriptがオブジェクト自身しか見ないと思う</b> — `greet` が `user` になくても、探索はプロトタイプチェーンを上へ続く。" },
        { en: "<b>Using `__proto__` as the preferred API</b> — it works, but prefer `Object.getPrototypeOf(user)` in new code.", np: "<b>`__proto__` लाई मुख्य API मान्नु</b> — काम गर्छ, तर नयाँ code मा `Object.getPrototypeOf(user)` प्रयोग गर्नुहोस्।", jp: "<b>`__proto__` を推奨APIとして使う</b> — 動くが、新しいコードでは `Object.getPrototypeOf(user)` を使う。" },
      ],
      quiz: [
        {
          question: { en: "What happens when a property isn't found on an object?", np: "Object मा property नभेटिए के हुन्छ?", jp: "オブジェクトにプロパティが見つからないとどうなるか?" },
          options: [
            { en: "JavaScript immediately throws an error", np: "JavaScript ले तुरुन्तै error दिन्छ", jp: "すぐにエラーを投げる" },
            { en: "JavaScript searches the prototype chain", np: "JavaScript ले prototype chain खोज्छ", jp: "プロトタイプチェーンを探索する" },
            { en: "JavaScript creates the property", np: "JavaScript ले property बनाउँछ", jp: "プロパティを作る" },
            { en: "JavaScript searches the global scope", np: "JavaScript ले global scope खोज्छ", jp: "グローバルスコープを探す" },
          ],
          correctIndex: 1,
          explanation: { en: "It keeps climbing until it finds the property or reaches `null`.", np: "यो property भेट्टाउनेसम्म वा `null` पुग्नेसम्म चढिरहन्छ।", jp: "プロパティが見つかるか `null` に達するまでたどり続ける。" },
        },
        {
          question: { en: "Where are methods on `User.prototype` shared?", np: "`User.prototype` का method कहाँ साझा हुन्छन्?", jp: "`User.prototype` のメソッドはどこで共有されるか?" },
          options: [
            { en: "Only with the constructor", np: "Constructor सँग मात्र", jp: "コンストラクタとだけ" },
            { en: "With all instances that use that prototype", np: "त्यो prototype प्रयोग गर्ने सबै instance सँग", jp: "そのプロトタイプを使うすべてのインスタンスと" },
            { en: "Only with the first instance", np: "पहिलो instance सँग मात्र", jp: "最初のインスタンスとだけ" },
            { en: "They are copied into every instance", np: "ती हरेक instance मा copy हुन्छन्", jp: "各インスタンスにコピーされる" },
          ],
          correctIndex: 1,
          explanation: { en: "One function object serves every instance, which saves memory.", np: "एउटै function object ले हरेक instance लाई काम गर्छ, जसले memory बचाउँछ।", jp: "1つの関数オブジェクトがすべてのインスタンスに使われ、メモリを節約できる。" },
        },
        {
          question: { en: "What ends the prototype chain?", np: "Prototype chain के मा सकिन्छ?", jp: "プロトタイプチェーンは何で終わるか?" },
          options: [
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
            { en: "`false`", np: "`false`", jp: "`false`" },
            { en: "`null`", np: "`null`", jp: "`null`" },
            { en: "`0`", np: "`0`", jp: "`0`" },
          ],
          correctIndex: 2,
          explanation: { en: "`Object.prototype`'s own prototype is `null`, which stops the search.", np: "`Object.prototype` को आफ्नै prototype `null` हो, जसले खोजी रोक्छ।", jp: "`Object.prototype` のプロトタイプが `null` で、そこで探索が止まる。" },
        },
        {
          question: { en: "What is the recommended way to get an object's prototype?", np: "Object को prototype लिने सिफारिस गरिएको तरिका कुन हो?", jp: "オブジェクトのプロトタイプを取得する推奨方法は?" },
          options: [
            { en: "`Object.prototype(user)`", np: "`Object.prototype(user)`", jp: "`Object.prototype(user)`" },
            { en: "`Object.getPrototypeOf(user)`", np: "`Object.getPrototypeOf(user)`", jp: "`Object.getPrototypeOf(user)`" },
            { en: "`Object.getProto(user)`", np: "`Object.getProto(user)`", jp: "`Object.getProto(user)`" },
            { en: "`Object.prototypeOf(user)`", np: "`Object.prototypeOf(user)`", jp: "`Object.prototypeOf(user)`" },
          ],
          correctIndex: 1,
          explanation: { en: "`__proto__` also works but is legacy; this is the standard accessor.", np: "`__proto__` पनि काम गर्छ तर legacy हो; यो मानक accessor हो।", jp: "`__proto__` も動くがレガシー。こちらが標準のアクセサ。" },
        },
      ],
    },
    {
      id: "prototype-inheritance",
      title: { en: "Prototype Inheritance", np: "Prototype Inheritance", jp: "プロトタイプ継承" },
      durationMinutes: 9,
      explanation: {
        en: "To make one constructor inherit from another using plain prototypes (before ES6 classes existed), you wire up three things by hand: (1) call the parent constructor with `.call(this, ...)` so it initialises shared properties on the new object; (2) set `Child.prototype = Object.create(Parent.prototype)` so property lookups fall through to the parent's methods; (3) fix `Child.prototype.constructor = Child`, because `Object.create` overwrites it.\n\n`Object.create(proto)` is also useful on its own, without constructors at all — it builds a plain object whose prototype is exactly the object you pass in, which is the cleanest way to do prototypal inheritance directly.",
        np: "Plain prototypes प्रयोग गरी एक constructor लाई अर्कोबाट inherit गराउन तीन कुरा manually setup गर्नुपर्छ: parent constructor call गर्नु, `Child.prototype = Object.create(Parent.prototype)` सेट गर्नु, र constructor reference fix गर्नु। `Object.create(proto)` ले सिधै prototypal inheritance पनि दिन्छ।",
        jp: "コンストラクタ関数だけで継承を組むには3つを手動で設定する: 親コンストラクタの呼び出し、`Object.create`によるプロトタイプチェーンの設定、constructorの修正。`Object.create(proto)`単体でも直接的なプロトタイプ継承に使える。",
      },
      diagram: `function Dog(name, breed) {
  Animal.call(this, name);              ← 1. init shared 'name' property
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype);   ← 2. wire up the chain
Dog.prototype.constructor = Dog;                    ← 3. fix constructor ref

rex = new Dog(...)
  │
  ▼  own props: { name, breed }
Dog.prototype       { bark }
  │
  ▼
Animal.prototype     { speak }
  │
  ▼
Object.prototype`,
      codeExample: {
        title: { en: "Wiring up prototypal inheritance by hand", np: "Prototypal inheritance manually wire गर्नु", jp: "プロトタイプ継承を手動で設定する" },
        code: `// ── Base constructor ────────────────────────────────────────────────
function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return \`\${this.name} makes a sound\`; };

// ── Derived constructor ───────────────────────────────────────────────
function Dog(name, breed) {
  Animal.call(this, name);    // 1. call parent constructor to initialise 'name'
  this.breed = breed;
}

// 2. Wire up the prototype chain so Dog instances inherit from Animal.prototype
Dog.prototype = Object.create(Animal.prototype);

// 3. Fix the constructor reference (Object.create overwrites it)
Dog.prototype.constructor = Dog;

// 4. Add Dog-specific methods
Dog.prototype.bark = function () { return "Woof!"; };

const rex = new Dog("Rex", "Labrador");
rex.speak();             // "Rex makes a sound" — found on Animal.prototype
rex.bark();              // "Woof!" — found on Dog.prototype
rex instanceof Dog;      // true
rex instanceof Animal;   // true — Dog's chain includes Animal.prototype

// ── Object.create used directly, no constructors at all ────────────
const animalProto = {
  init(name)  { this.name = name; return this; },
  speak()     { return \`\${this.name} makes a sound\`; },
};
const dogProto = Object.create(animalProto);
dogProto.bark = function () { return "Woof!"; };

const buddy = Object.create(dogProto).init("Buddy");
buddy.speak();  // "Buddy makes a sound"
buddy.bark();   // "Woof!"`,
      },
      keyTakeaways: [
        { en: "Wiring up constructor-based inheritance takes three manual steps: call the parent constructor with `.call(this, ...)`, set the prototype chain with `Object.create()`, and re-fix the `constructor` reference.", np: "Constructor-based inheritance setup गर्न तीन manual steps चाहिन्छ: parent constructor call, prototype chain सेट, constructor reference fix।", jp: "コンストラクタベースの継承の設定には3つの手動ステップが必要: 親コンストラクタの呼び出し、`Object.create()`によるプロトタイプチェーンの設定、constructor参照の修正。" },
        { en: "`Object.create(proto)` builds a brand-new object whose prototype is exactly the object you pass in — the most direct way to do prototypal inheritance without any constructor at all.", np: "`Object.create(proto)` ले pass गरिएको object लाई ठ्याक्कै prototype बनाएर नयाँ object बनाउँछ — constructor बिनै सबैभन्दा direct prototypal inheritance।", jp: "`Object.create(proto)`は渡されたオブジェクトをまさにプロトタイプとする新しいオブジェクトを作る。コンストラクタなしで最も直接的なプロトタイプ継承。" },
        { en: "`Object.create()` overwrites the `.constructor` property on the new prototype object, so it must be manually restored if code relies on `instance.constructor` pointing to the right function.", np: "`Object.create()` ले नयाँ prototype object को `.constructor` property overwrite गर्छ, त्यसैले `instance.constructor` सहि function लाई point गर्नुपर्ने भए manually restore गर्नुपर्छ।", jp: "`Object.create()`は新しいプロトタイプオブジェクトの`.constructor`プロパティを上書きするため、`instance.constructor`が正しい関数を指す必要がある場合は手動で復元する必要がある。" },
      ],
      commonMistakes: [
        { en: "Forgetting to call `Parent.call(this, ...)` inside the child constructor, leaving properties the parent was supposed to set up completely missing.", np: "Child constructor भित्र `Parent.call(this, ...)` call गर्न बिर्सनु, parent ले setup गर्ने properties पूर्ण रूपमा हराउनु।", jp: "子コンストラクタ内で`Parent.call(this, ...)`を呼び忘れ、親が設定するはずのプロパティが完全に欠落すること。" },
        { en: "Setting `Child.prototype = Parent.prototype` directly instead of `Object.create(Parent.prototype)` — this makes Child and Parent share the exact same prototype object, so adding a method to Child also adds it to Parent.", np: "`Object.create(Parent.prototype)` को सट्टा `Child.prototype = Parent.prototype` सिधै सेट गर्नु — यसले Child र Parent लाई उही prototype object share गराउँछ।", jp: "`Object.create(Parent.prototype)`の代わりに`Child.prototype = Parent.prototype`を直接設定すること。これはChildとParentに同じプロトタイプオブジェクトを共有させる。" },
        { en: "Forgetting to restore `Child.prototype.constructor = Child` after `Object.create`, so `instance.constructor` incorrectly points to the parent.", np: "`Object.create` पछि `Child.prototype.constructor = Child` restore गर्न बिर्सनु, `instance.constructor` गलत रूपमा parent लाई point गर्नु।", jp: "`Object.create`後に`Child.prototype.constructor = Child`を復元し忘れ、`instance.constructor`が誤って親を指すこと。" },
      ],
      quiz: [
        {
          question: { en: "Why does `Dog` need to call `Animal.call(this, name)` inside its constructor?", np: "`Dog` को constructor भित्र `Animal.call(this, name)` किन call गर्नुपर्छ?", jp: "Dogのコンストラクタ内で`Animal.call(this, name)`を呼ぶ必要があるのはなぜ？" },
          options: [
            { en: "So the parent constructor's setup logic runs against the new Dog instance, initialising shared properties like `name`", np: "ताकि parent constructor को setup logic नयाँ Dog instance मा चलोस्, `name` जस्ता shared properties initialize गरोस्", jp: "親コンストラクタの初期化ロジックが新しいDogインスタンスに対して実行され、`name`のような共有プロパティを初期化するように" },
            { en: "It's optional — the prototype chain handles it automatically", np: "यो optional हो — prototype chain ले automatically handle गर्छ", jp: "オプション — プロトタイプチェーンが自動的に処理する" },
          ],
          correctIndex: 0,
          explanation: { en: "The prototype chain only shares methods, not initialisation logic — calling the parent constructor explicitly is what sets instance properties.", np: "Prototype chain ले methods मात्र share गर्छ, initialisation logic होइन — parent constructor explicitly call गर्नाले instance properties सेट हुन्छ।", jp: "プロトタイプチェーンはメソッドのみを共有し、初期化ロジックは共有しない。親コンストラクタを明示的に呼ぶことでインスタンスプロパティが設定される。" },
        },
        {
          question: { en: "What's wrong with setting `Dog.prototype = Animal.prototype` directly instead of `Object.create(Animal.prototype)`?", np: "`Object.create(Animal.prototype)` को सट्टा `Dog.prototype = Animal.prototype` सिधै सेट गर्दा के गल्ती हुन्छ?", jp: "`Object.create(Animal.prototype)`の代わりに`Dog.prototype = Animal.prototype`を直接設定すると何が問題？" },
          options: [
            { en: "Dog and Animal end up sharing the exact same prototype object, so a method added to one appears on the other too", np: "Dog र Animal ले उही prototype object share गर्छन्, एकमा थपिएको method अर्कोमा पनि देखिन्छ", jp: "DogとAnimalが同じプロトタイプオブジェクトを共有し、片方に追加したメソッドが両方に現れる" },
            { en: "Nothing — it's functionally identical to Object.create", np: "केही होइन — यो Object.create सँग functionally identical हो", jp: "何も問題ない — Object.createと機能的に同一" },
          ],
          correctIndex: 0,
          explanation: { en: "Object.create() makes a NEW object that merely links to Animal.prototype; direct assignment makes them literally the same object.", np: "Object.create() ले Animal.prototype लाई link मात्र गर्ने नयाँ object बनाउँछ; direct assignment ले तिनलाई एउटै object बनाउँछ।", jp: "Object.create()はAnimal.prototypeにリンクするだけの新しいオブジェクトを作る。直接代入は文字通り同じオブジェクトにする。" },
        },
        {
          question: { en: "What does `Object.create(proto)` do?", np: "`Object.create(proto)` ले के गर्छ?", jp: "`Object.create(proto)`は何をする？" },
          options: [
            { en: "Creates a brand-new object whose prototype is exactly the object passed in", np: "Pass गरिएको object लाई ठ्याक्कै prototype बनाई नयाँ object बनाउँछ", jp: "渡されたオブジェクトをまさにプロトタイプとする新しいオブジェクトを作る" },
            { en: "Deep clones the object passed in", np: "Pass गरिएको object deep clone गर्छ", jp: "渡されたオブジェクトを深くクローンする" },
          ],
          correctIndex: 0,
          explanation: { en: "This is the most direct, constructor-free way to establish prototypal inheritance in JavaScript.", np: "यो JS मा constructor-बिना prototypal inheritance स्थापित गर्ने सबैभन्दा direct तरिका हो।", jp: "これはJavaScriptでコンストラクタなしでプロトタイプ継承を確立する最も直接的な方法。" },
        },
      ],
    },
    {
      id: "property-descriptors",
      title: { en: "Property Descriptors & Object.defineProperty", np: "Property Descriptors र Object.defineProperty", jp: "プロパティディスクリプタとObject.defineProperty" },
      durationMinutes: 9,
      explanation: {
        en: "Every object property secretly carries three hidden flags controlling its behaviour, in addition to its value:\n\n• <b>writable</b> — can the value be reassigned?\n• <b>enumerable</b> — does it show up in `for...in` loops and `Object.keys()`?\n• <b>configurable</b> — can the property be deleted, or this descriptor itself be changed later?\n\nProperties you create normally (`obj.x = 5`) get all three set to `true` by default. `Object.defineProperty(obj, key, descriptor)` lets you set them explicitly — for example, to make a property read-only or hide it from enumeration. The same mechanism also powers <b>getters and setters</b>: instead of a fixed `value`, a descriptor can define a `get()` function that computes a value on access, and a `set()` function that runs custom logic on assignment.",
        np: "हरेक property मा तीन hidden flags हुन्छन्: writable, enumerable, configurable। Normal property मा सबै true हुन्छ। `Object.defineProperty` ले explicitly control दिन्छ — जस्तै read-only बनाउन वा enumeration बाट hide गर्न। Getter/setter पनि यही मार्फत बनाइन्छ।",
        jp: "すべてのプロパティにはwritable・enumerable・configurableの3つの隠しフラグがある。通常のプロパティはすべてtrue。`Object.defineProperty`で明示的に制御できる。getter/setterもこの仕組みで作られる。",
      },
      diagram: `Object.defineProperty(obj, "id", {
  value: 42,
  writable:     false,   ← obj.id = 99 silently fails
  enumerable:   false,   ← hidden from Object.keys() / for...in
  configurable: false,   ← cannot delete or redefine
});

Instead of a fixed 'value', a descriptor can use:
  get()  →  runs when property is READ    (person.fullName)
  set(v) →  runs when property is WRITTEN (person.fullName = v)`,
      codeExample: {
        title: { en: "Controlling property behaviour with descriptors, getters, and setters", np: "Descriptors, getters, setters सँग property control", jp: "ディスクリプタ・getter・setterによるプロパティ制御" },
        code: `const obj = {};
Object.defineProperty(obj, "id", {
  value:        42,
  writable:     false,  // obj.id = 99 will silently fail (or throw in strict mode)
  enumerable:   false,  // won't appear in for...in or Object.keys()
  configurable: false,  // cannot delete obj.id or redefine this descriptor
});

obj.id;            // 42
obj.id = 99;       // silently ignored (sloppy mode)
Object.keys(obj);  // [] — id is not enumerable

// ── Reading a property's descriptor ───────────────────────────────
Object.getOwnPropertyDescriptor(obj, "id");
// { value: 42, writable: false, enumerable: false, configurable: false }

// ── Getters and setters via defineProperty ────────────────────────
const person = { firstName: "John", lastName: "Doe" };

Object.defineProperty(person, "fullName", {
  get()      { return \`\${this.firstName} \${this.lastName}\`; },
  set(value) { [this.firstName, this.lastName] = value.split(" "); },
  enumerable: true,
  configurable: true,
});

person.fullName;             // "John Doe" — computed on read, no () call needed
person.fullName = "Jane Smith";  // runs the setter
person.firstName;            // "Jane"`,
      },
      keyTakeaways: [
        { en: "Every property has three hidden flags — `writable`, `enumerable`, `configurable` — all `true` by default for normally-created properties, but controllable via `Object.defineProperty()`.", np: "हरेक property मा तीन hidden flags छन् — `writable`, `enumerable`, `configurable` — normal properties मा सबै default `true`, `Object.defineProperty()` ले control गर्न सकिन्छ।", jp: "すべてのプロパティには`writable`・`enumerable`・`configurable`の3つの隠しフラグがある。通常作成されたプロパティはすべてデフォルトでtrueだが`Object.defineProperty()`で制御できる。" },
        { en: "Setting `enumerable: false` hides a property from `Object.keys()` and `for...in` without making it inaccessible — you can still read/write it directly by name.", np: "`enumerable: false` सेट गर्दा property `Object.keys()` र `for...in` बाट hide हुन्छ तर inaccessible हुँदैन — नामले सिधै read/write गर्न सकिन्छ।", jp: "`enumerable: false`を設定すると`Object.keys()`と`for...in`からプロパティが隠れるが、アクセス不能にはならない。直接名前で読み書きできる。" },
        { en: "Getters/setters defined via descriptors let a property look like a plain value from the outside while actually running computed logic on read or write.", np: "Descriptors मार्फत define गरिएका getter/setter ले property बाहिरबाट plain value जस्तो देखाउँछ तर read/write मा computed logic चलाउँछ।", jp: "ディスクリプタで定義されたgetter/setterは、外から見ると単純な値のように見えるが、実際は読み書き時に計算ロジックを実行する。" },
      ],
      commonMistakes: [
        { en: "Assuming that setting `writable: false` in sloppy mode will throw an error on reassignment — it silently ignores the write instead; only strict mode throws a TypeError.", np: "Sloppy mode मा `writable: false` सेट गर्दा reassignment मा error throw हुन्छ भन्ने ठान्नु — यो silently ignore हुन्छ; strict mode मा मात्र TypeError throw हुन्छ।", jp: "sloppyモードで`writable: false`を設定すると再割り当てでエラーがスローされると思うこと。実際は黙って無視される。strictモードのみTypeErrorをスローする。" },
        { en: "Forgetting that `enumerable: false` hides a property from `Object.keys()`/`JSON.stringify()`, then being confused why a property that clearly exists doesn't show up when serialising or looping.", np: "`enumerable: false` ले `Object.keys()`/`JSON.stringify()` बाट property hide गर्छ भन्ने बिर्सनु, अनि property देखिँदैन भन्दा confuse हुनु।", jp: "`enumerable: false`が`Object.keys()`/`JSON.stringify()`からプロパティを隠すことを忘れ、明らかに存在するプロパティがシリアライズやループで表示されないことに混乱すること。" },
        { en: "Calling a getter like a method (`person.fullName()`) instead of accessing it like a property (`person.fullName`) — getters are read without parentheses.", np: "Getter लाई method जस्तै call गर्नु (`person.fullName()`) property जस्तै access गर्नुको सट्टा (`person.fullName`) — getter बिना parentheses पढिन्छ।", jp: "getterをプロパティのようにアクセス（`person.fullName`）する代わりにメソッドのように呼ぶこと（`person.fullName()`）。getterは括弧なしで読む。" },
        { en: "Attempting to change `writable`/`enumerable`/`configurable` on a property whose `configurable` flag is already `false` — the descriptor is locked and the attempt throws.", np: "`configurable` false भइसकेको property को `writable`/`enumerable`/`configurable` बदलन खोज्नु — descriptor locked भएर throw हुन्छ।", jp: "`configurable`が既にfalseのプロパティの`writable`/`enumerable`/`configurable`を変更しようとすること。ディスクリプタはロックされ試みはスローする。" },
      ],
      quiz: [
        {
          question: { en: "What three hidden flags does every property descriptor have, in addition to its value?", np: "Value बाहेक हरेक property descriptor मा कुन तीन hidden flags हुन्छन्?", jp: "値以外に、すべてのプロパティディスクリプタが持つ3つの隠しフラグは？" },
          options: [
            { en: "writable, enumerable, configurable", np: "writable, enumerable, configurable", jp: "writable、enumerable、configurable" },
            { en: "public, private, protected", np: "public, private, protected", jp: "public、private、protected" },
          ],
          correctIndex: 0,
          explanation: { en: "These three flags control reassignment, visibility in enumeration, and whether the descriptor itself can be changed.", np: "यी तीन flags ले reassignment, enumeration मा visibility, र descriptor बदलिन सक्छ कि सक्दैन control गर्छ।", jp: "この3つのフラグは再割り当て・列挙での可視性・ディスクリプタ自体を変更できるかを制御する。" },
        },
        {
          question: { en: "Does `enumerable: false` make a property completely inaccessible?", np: "`enumerable: false` ले property पूर्ण रूपमा inaccessible बनाउँछ?", jp: "`enumerable: false`はプロパティを完全にアクセス不能にする？" },
          options: [
            { en: "No — it only hides the property from `Object.keys()`/`for...in`; direct access by name still works", np: "होइन — यसले property लाई `Object.keys()`/`for...in` बाट मात्र hide गर्छ; नामले direct access अझै काम गर्छ", jp: "いいえ — `Object.keys()`/`for...in`からプロパティを隠すだけで、名前による直接アクセスは機能する" },
            { en: "Yes, it can no longer be read or written", np: "हो, यो अब पढ्न वा लेख्न सकिँदैन", jp: "はい、もう読み書きできなくなる" },
          ],
          correctIndex: 0,
          explanation: { en: "enumerable only controls visibility during enumeration (loops, Object.keys, JSON.stringify) — direct property access is unaffected.", np: "enumerable ले enumeration (loops, Object.keys, JSON.stringify) बेलाको visibility मात्र control गर्छ — direct access मा असर पर्दैन।", jp: "enumerableは列挙時（ループ、Object.keys、JSON.stringify）の可視性のみを制御する。直接アクセスには影響しない。" },
        },
        {
          question: { en: "How do you read the value of a property defined with a `get()` function?", np: "`get()` function सँग define गरिएको property को value कसरी पढ्ने?", jp: "`get()`関数で定義されたプロパティの値はどうやって読む？" },
          options: [
            { en: "Access it like a normal property, e.g. `person.fullName` — no parentheses", np: "Normal property जस्तै access गर्नुहोस्, जस्तै `person.fullName` — parentheses बिना", jp: "通常のプロパティのようにアクセスする（例: `person.fullName`）— 括弧なし" },
            { en: "Call it like a method: `person.fullName()`", np: "Method जस्तै call गर्नुहोस्: `person.fullName()`", jp: "メソッドのように呼び出す: `person.fullName()`" },
          ],
          correctIndex: 0,
          explanation: { en: "Getters are designed to be transparent — they run automatically on property read, so no function-call syntax is needed.", np: "Getters transparent हुने design गरिएका हुन् — property read मा automatically चल्छन्, function-call syntax चाहिँदैन।", jp: "getterは透過的に設計されている。プロパティ読み取り時に自動的に実行されるため、関数呼び出し構文は不要。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "How does JavaScript find a property that isn't directly on an object?", np: "Object मा सिधै नभएको property JS ले कसरी भेट्छ?", jp: "オブジェクトに直接ないプロパティをJSはどうやって見つける？" },
      options: [{ en: "It walks the prototype chain until found or reaching null", np: "यो भेटिने वा null सम्म पुगुन्जेल prototype chain हिँड्छ", jp: "見つかるかnullに達するまでプロトタイプチェーンを歩く" }, { en: "It throws a ReferenceError immediately", np: "यो तुरुन्तै ReferenceError throw गर्छ", jp: "即座にReferenceErrorをスローする" }],
      correctIndex: 0,
      explanation: { en: "Prototype chain lookup is how JavaScript implements inheritance.", np: "Prototype chain lookup नै JS को inheritance implementation हो।", jp: "プロトタイプチェーンの検索がJavaScriptの継承の実装方法。" },
    },
    {
      question: { en: "Do all instances of a constructor share the same prototype methods in memory?", np: "Constructor का सबै instances ले memory मा उही prototype methods share गर्छन्?", jp: "コンストラクタのすべてのインスタンスはメモリ内で同じプロトタイプメソッドを共有する？" },
      options: [{ en: "Yes — one copy shared via the chain", np: "हो — chain मार्फत एउटा copy share हुन्छ", jp: "はい — チェーン経由で1つのコピーが共有される" }, { en: "No — each gets its own copy", np: "होइन — हरेकले आफ्नै copy पाउँछ", jp: "いいえ — 各インスタンスが独自のコピーを持つ" }],
      correctIndex: 0,
      explanation: { en: "This sharing is exactly what makes the prototype pattern memory-efficient.", np: "यही sharing ले prototype pattern लाई memory-efficient बनाउँछ।", jp: "この共有がプロトタイプパターンをメモリ効率的にする理由。" },
    },
    {
      question: { en: "What is the modern, recommended way to inspect an object's prototype?", np: "Object को prototype inspect गर्ने modern, recommended तरिका के हो?", jp: "オブジェクトのプロトタイプを調べる現代的で推奨される方法は？" },
      options: [{ en: "`Object.getPrototypeOf(obj)`", np: "`Object.getPrototypeOf(obj)`", jp: "`Object.getPrototypeOf(obj)`" }, { en: "`obj.__proto__`", np: "`obj.__proto__`", jp: "`obj.__proto__`" }],
      correctIndex: 0,
      explanation: { en: "__proto__ is legacy; Object.getPrototypeOf is the standard API.", np: "__proto__ legacy हो; Object.getPrototypeOf standard API हो।", jp: "__proto__はレガシー。Object.getPrototypeOfが標準API。" },
    },
    {
      question: { en: "Why must `Dog`'s constructor call `Animal.call(this, name)`?", np: "`Dog` को constructor ले `Animal.call(this, name)` किन call गर्नुपर्छ?", jp: "Dogのコンストラクタが`Animal.call(this, name)`を呼ぶ必要があるのはなぜ？" },
      options: [{ en: "To run the parent's initialisation logic on the new instance", np: "नयाँ instance मा parent को initialisation logic चलाउन", jp: "新しいインスタンスに親の初期化ロジックを実行するため" }, { en: "It's unnecessary boilerplate with no effect", np: "यो असर नभएको अनावश्यक boilerplate हो", jp: "効果のない不要なボイラープレート" }],
      correctIndex: 0,
      explanation: { en: "The prototype chain shares methods only, not constructor initialisation logic.", np: "Prototype chain ले methods मात्र share गर्छ, constructor initialisation logic होइन।", jp: "プロトタイプチェーンはメソッドのみを共有し、コンストラクタの初期化ロジックは共有しない。" },
    },
    {
      question: { en: "What's wrong with `Child.prototype = Parent.prototype` instead of `Object.create(Parent.prototype)`?", np: "`Object.create(Parent.prototype)` को सट्टा `Child.prototype = Parent.prototype` मा के गल्ती छ?", jp: "`Object.create(Parent.prototype)`の代わりに`Child.prototype = Parent.prototype`とすると何が問題？" },
      options: [{ en: "Child and Parent end up sharing the literal same prototype object", np: "Child र Parent ले उही literal prototype object share गर्छन्", jp: "ChildとParentが文字通り同じプロトタイプオブジェクトを共有する" }, { en: "Nothing, they're equivalent", np: "केही छैन, दुवै उस्तै", jp: "何も問題ない、同等" }],
      correctIndex: 0,
      explanation: { en: "Object.create makes a new linked object; direct assignment makes them literally the same object, so changes bleed both ways.", np: "Object.create ले नयाँ linked object बनाउँछ; direct assignment ले उही object बनाउँछ, त्यसैले परिवर्तन दुवैतिर फैलिन्छ।", jp: "Object.createは新しいリンクされたオブジェクトを作る。直接代入は文字通り同じオブジェクトにするため、変更が両方に影響する。" },
    },
    {
      question: { en: "What does `Object.create(proto)` do without any constructor involved?", np: "Constructor बिना `Object.create(proto)` ले के गर्छ?", jp: "コンストラクタなしで`Object.create(proto)`は何をする？" },
      options: [{ en: "Creates a new object whose prototype is exactly `proto`", np: "`proto` लाई ठ्याक्कै prototype बनाई नयाँ object बनाउँछ", jp: "protoをまさにプロトタイプとする新しいオブジェクトを作る" }, { en: "Copies all properties from proto into a new object", np: "proto का सबै properties नयाँ object मा copy गर्छ", jp: "protoのすべてのプロパティを新しいオブジェクトにコピーする" }],
      correctIndex: 0,
      explanation: { en: "Object.create links, it doesn't copy — the new object's prototype IS the passed-in object.", np: "Object.create ले link गर्छ, copy गर्दैन — नयाँ object को prototype नै pass गरिएको object हो।", jp: "Object.createはリンクするだけでコピーはしない。新しいオブジェクトのプロトタイプは渡されたオブジェクトそのもの。" },
    },
    {
      question: { en: "What three flags does a property descriptor control besides its value?", np: "Value बाहेक property descriptor ले कुन तीन flags control गर्छ?", jp: "値以外にプロパティディスクリプタが制御する3つのフラグは？" },
      options: [{ en: "writable, enumerable, configurable", np: "writable, enumerable, configurable", jp: "writable、enumerable、configurable" }, { en: "static, private, async", np: "static, private, async", jp: "static、private、async" }],
      correctIndex: 0,
      explanation: { en: "These control reassignment, enumeration visibility, and whether the descriptor can be changed later.", np: "यीले reassignment, enumeration visibility, र descriptor बदलिने अनुमति control गर्छ।", jp: "これらは再割り当て・列挙可視性・ディスクリプタを後で変更できるかを制御する。" },
    },
    {
      question: { en: "Does `enumerable: false` prevent direct access to a property by name?", np: "`enumerable: false` ले नामले property मा direct access रोक्छ?", jp: "`enumerable: false`は名前によるプロパティへの直接アクセスを防ぐ？" },
      options: [{ en: "No — it only hides it from Object.keys()/for...in", np: "होइन — यसले केवल Object.keys()/for...in बाट hide गर्छ", jp: "いいえ — Object.keys()/for...inから隠すだけ" }, { en: "Yes — it blocks all access", np: "हो — यसले सबै access block गर्छ", jp: "はい — すべてのアクセスをブロックする" }],
      correctIndex: 0,
      explanation: { en: "enumerable only affects visibility during enumeration; the property is still directly readable/writable.", np: "enumerable ले enumeration बेलाको visibility मात्र असर गर्छ; property अझै directly readable/writable छ।", jp: "enumerableは列挙時の可視性にのみ影響する。プロパティは直接読み書き可能なままである。" },
    },
    {
      question: { en: "How do you read a property defined via a `get()` descriptor?", np: "`get()` descriptor सँग define गरिएको property कसरी पढ्ने?", jp: "`get()`ディスクリプタで定義されたプロパティはどうやって読む？" },
      options: [{ en: "Like a normal property, no parentheses: `obj.fullName`", np: "Normal property जस्तै, parentheses बिना: `obj.fullName`", jp: "通常のプロパティのように括弧なし: `obj.fullName`" }, { en: "As a method call: `obj.fullName()`", np: "Method call को रूपमा: `obj.fullName()`", jp: "メソッド呼び出しとして: `obj.fullName()`" }],
      correctIndex: 0,
      explanation: { en: "Getters run transparently on property access — no call syntax is needed or valid.", np: "Getters property access मा transparently चल्छन् — call syntax चाहिँदैन।", jp: "getterはプロパティアクセス時に透過的に実行される。呼び出し構文は不要。" },
    },
  ],
};
