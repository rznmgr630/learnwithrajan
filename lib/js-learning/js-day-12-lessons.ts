import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_12_LESSONS: JsLessonDay = {
  day: 12,
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
            { en: "JavaScript creates the property", np: "JavaScript ले property बनाउँछ", jp: "プロパティを作る" },
            { en: "JavaScript searches the prototype chain", np: "JavaScript ले prototype chain खोज्छ", jp: "プロトタイプチェーンを探索する" },
            { en: "JavaScript searches the global scope", np: "JavaScript ले global scope खोज्छ", jp: "グローバルスコープを探す" },
          ],
          correctIndex: 2,
          explanation: { en: "It keeps climbing until it finds the property or reaches `null`.", np: "यो property भेट्टाउनेसम्म वा `null` पुग्नेसम्म चढिरहन्छ।", jp: "プロパティが見つかるか `null` に達するまでたどり続ける。" },
        },
        {
          question: { en: "Where are methods on `User.prototype` shared?", np: "`User.prototype` का method कहाँ साझा हुन्छन्?", jp: "`User.prototype` のメソッドはどこで共有されるか?" },
          options: [
            { en: "Only with the constructor", np: "Constructor सँग मात्र", jp: "コンストラクタとだけ" },
            { en: "They are copied into every instance", np: "ती हरेक instance मा copy हुन्छन्", jp: "各インスタンスにコピーされる" },
            { en: "Only with the first instance", np: "पहिलो instance सँग मात्र", jp: "最初のインスタンスとだけ" },
            { en: "With all instances that use that prototype", np: "त्यो prototype प्रयोग गर्ने सबै instance सँग", jp: "そのプロトタイプを使うすべてのインスタンスと" },
          ],
          correctIndex: 3,
          explanation: { en: "One function object serves every instance, which saves memory.", np: "एउटै function object ले हरेक instance लाई काम गर्छ, जसले memory बचाउँछ।", jp: "1つの関数オブジェクトがすべてのインスタンスに使われ、メモリを節約できる。" },
        },
        {
          question: { en: "What ends the prototype chain?", np: "Prototype chain के मा सकिन्छ?", jp: "プロトタイプチェーンは何で終わるか?" },
          options: [
            { en: "`null`", np: "`null`", jp: "`null`" },
            { en: "`false`", np: "`false`", jp: "`false`" },
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
            { en: "`0`", np: "`0`", jp: "`0`" },
          ],
          correctIndex: 0,
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
      youtubeIds: ["wstwjQ1yqWQ"],
    },
    {
      id: "prototype-inheritance",
      title: { en: "Prototype Inheritance", np: "Prototype Inheritance", jp: "プロトタイプ継承" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Prototype inheritance</b> means one object can use properties and methods from another object's prototype.\n\nBefore ES6 `class` syntax, this was commonly done using <b>constructor functions</b> and prototypes.\n\nThere are three important steps:\n\n1. Call the parent constructor with `Parent.call(this, ...)`.\n2. Connect the child prototype to the parent prototype using `Object.create()`.\n3. Fix the `constructor` property.\n\n---\n\n### 1. Parent constructor\n\n```javascript\nfunction Animal(name) {\n  this.name = name;\n}\n\nAnimal.prototype.speak = function () {\n  console.log(`${this.name} makes a sound`);\n};\n```\n\nNow create a child constructor:\n\n```javascript\nfunction Dog(name, breed) {\n  Animal.call(this, name);\n  this.breed = breed;\n}\n```\n\n`Animal.call(this, name)` runs the parent constructor using the new `Dog` object.\n\n---\n\n### 2. Connect the prototypes\n\n```javascript\nDog.prototype = Object.create(Animal.prototype);\n```\n\nNow the prototype chain becomes:\n\n```text\ndog\n ↓\nDog.prototype\n ↓\nAnimal.prototype\n ↓\nObject.prototype\n ↓\nnull\n```\n\nSo a `Dog` can use methods from `Animal.prototype`.\n\n---\n\n### 3. Fix the constructor\n\n`Object.create()` replaces the child prototype, so the `constructor` property now points to `Animal`. Fix it:\n\n```javascript\nDog.prototype.constructor = Dog;\n```\n\nComplete example:\n\n```javascript\nfunction Animal(name) {\n  this.name = name;\n}\n\nAnimal.prototype.speak = function () {\n  console.log(`${this.name} makes a sound`);\n};\n\nfunction Dog(name, breed) {\n  Animal.call(this, name);\n  this.breed = breed;\n}\n\nDog.prototype = Object.create(Animal.prototype);\nDog.prototype.constructor = Dog;\n\nDog.prototype.bark = function () {\n  console.log(\"Woof!\");\n};\n\nconst dog = new Dog(\"Max\", \"Labrador\");\n\ndog.speak();\ndog.bark();\n```\n\nOutput:\n\n```text\nMax makes a sound\nWoof!\n```\n\n`dog.speak()` is found through `Animal.prototype`, and `dog.bark()` is found on `Dog.prototype`.\n\n---\n\n### `Object.create()` by itself\n\nYou don't need constructors to use prototype inheritance.\n\n```javascript\nconst animal = {\n  speak() {\n    console.log(\"Animal sound\");\n  }\n};\n\nconst dog = Object.create(animal);\n\ndog.speak();\n// Animal sound\n```\n\nHere:\n\n```text\ndog\n ↓\nanimal\n ↓\nObject.prototype\n ↓\nnull\n```\n\n`Object.create(animal)` creates a new object whose prototype is `animal`.\n\n---\n\n### Easy memory trick\n\n> <b>Call → Connect → Fix</b>\n\n```text\nParent.call()\n      ↓\nObject.create()\n      ↓\nconstructor = Child\n```",
        np: "<b>Prototype inheritance</b> को अर्थ एउटा object ले अर्को object को prototype का property र method प्रयोग गर्न सक्छ भन्ने हो।\n\nES6 `class` syntax अघि, यो सामान्यतया <b>constructor function</b> र prototype ले गरिन्थ्यो।\n\nतीन महत्वपूर्ण चरण छन्:\n\n1. `Parent.call(this, ...)` ले parent constructor call गर्नु।\n2. `Object.create()` ले child prototype लाई parent prototype सँग जोड्नु।\n3. `constructor` property ठीक गर्नु।\n\n---\n\n### 1. Parent constructor\n\n```javascript\nfunction Animal(name) {\n  this.name = name;\n}\n\nAnimal.prototype.speak = function () {\n  console.log(`${this.name} makes a sound`);\n};\n```\n\nअब child constructor बनाउनुहोस्:\n\n```javascript\nfunction Dog(name, breed) {\n  Animal.call(this, name);\n  this.breed = breed;\n}\n```\n\n`Animal.call(this, name)` ले नयाँ `Dog` object प्रयोग गरी parent constructor चलाउँछ।\n\n---\n\n### 2. Prototype जोड्नु\n\n```javascript\nDog.prototype = Object.create(Animal.prototype);\n```\n\nअब prototype chain यस्तो बन्छ:\n\n```text\ndog\n ↓\nDog.prototype\n ↓\nAnimal.prototype\n ↓\nObject.prototype\n ↓\nnull\n```\n\nत्यसैले `Dog` ले `Animal.prototype` का method प्रयोग गर्न सक्छ।\n\n---\n\n### 3. Constructor ठीक गर्नु\n\n`Object.create()` ले child prototype प्रतिस्थापन गर्छ, त्यसैले `constructor` property अब `Animal` तिर देखाउँछ। ठीक गर्नुहोस्:\n\n```javascript\nDog.prototype.constructor = Dog;\n```\n\nपूरा उदाहरण:\n\n```javascript\nfunction Animal(name) {\n  this.name = name;\n}\n\nAnimal.prototype.speak = function () {\n  console.log(`${this.name} makes a sound`);\n};\n\nfunction Dog(name, breed) {\n  Animal.call(this, name);\n  this.breed = breed;\n}\n\nDog.prototype = Object.create(Animal.prototype);\nDog.prototype.constructor = Dog;\n\nDog.prototype.bark = function () {\n  console.log(\"Woof!\");\n};\n\nconst dog = new Dog(\"Max\", \"Labrador\");\n\ndog.speak();\ndog.bark();\n```\n\nOutput:\n\n```text\nMax makes a sound\nWoof!\n```\n\n`dog.speak()` `Animal.prototype` मार्फत भेटिन्छ, र `dog.bark()` `Dog.prototype` मा भेटिन्छ।\n\n---\n\n### `Object.create()` आफैं\n\nPrototype inheritance प्रयोग गर्न constructor चाहिँदैन।\n\n```javascript\nconst animal = {\n  speak() {\n    console.log(\"Animal sound\");\n  }\n};\n\nconst dog = Object.create(animal);\n\ndog.speak();\n// Animal sound\n```\n\nयहाँ:\n\n```text\ndog\n ↓\nanimal\n ↓\nObject.prototype\n ↓\nnull\n```\n\n`Object.create(animal)` ले `animal` prototype भएको नयाँ object बनाउँछ।\n\n---\n\n### सम्झने सजिलो तरिका\n\n> <b>Call → Connect → Fix</b>\n\n```text\nParent.call()\n      ↓\nObject.create()\n      ↓\nconstructor = Child\n```",
        jp: "<b>プロトタイプ継承</b>とは、あるオブジェクトが別のオブジェクトのプロトタイプにあるプロパティやメソッドを使えることです。\n\nES6の `class` 構文が登場する前は、<b>コンストラクタ関数</b>とプロトタイプでこれを行うのが一般的でした。\n\n重要な手順は3つです:\n\n1. `Parent.call(this, ...)` で親のコンストラクタを呼ぶ。\n2. `Object.create()` で子のプロトタイプを親のプロトタイプにつなぐ。\n3. `constructor` プロパティを直す。\n\n---\n\n### 1. 親のコンストラクタ\n\n```javascript\nfunction Animal(name) {\n  this.name = name;\n}\n\nAnimal.prototype.speak = function () {\n  console.log(`${this.name} makes a sound`);\n};\n```\n\n次に子のコンストラクタを作ります:\n\n```javascript\nfunction Dog(name, breed) {\n  Animal.call(this, name);\n  this.breed = breed;\n}\n```\n\n`Animal.call(this, name)` は新しい `Dog` オブジェクトを使って親のコンストラクタを実行します。\n\n---\n\n### 2. プロトタイプをつなぐ\n\n```javascript\nDog.prototype = Object.create(Animal.prototype);\n```\n\nこれでプロトタイプチェーンはこうなります:\n\n```text\ndog\n ↓\nDog.prototype\n ↓\nAnimal.prototype\n ↓\nObject.prototype\n ↓\nnull\n```\n\n`Dog` は `Animal.prototype` のメソッドを使えます。\n\n---\n\n### 3. コンストラクタを直す\n\n`Object.create()` は子のプロトタイプを置き換えるので、`constructor` は `Animal` を指してしまいます。直しましょう:\n\n```javascript\nDog.prototype.constructor = Dog;\n```\n\n完成した例:\n\n```javascript\nfunction Animal(name) {\n  this.name = name;\n}\n\nAnimal.prototype.speak = function () {\n  console.log(`${this.name} makes a sound`);\n};\n\nfunction Dog(name, breed) {\n  Animal.call(this, name);\n  this.breed = breed;\n}\n\nDog.prototype = Object.create(Animal.prototype);\nDog.prototype.constructor = Dog;\n\nDog.prototype.bark = function () {\n  console.log(\"Woof!\");\n};\n\nconst dog = new Dog(\"Max\", \"Labrador\");\n\ndog.speak();\ndog.bark();\n```\n\n出力:\n\n```text\nMax makes a sound\nWoof!\n```\n\n`dog.speak()` は `Animal.prototype` 経由で、`dog.bark()` は `Dog.prototype` で見つかります。\n\n---\n\n### `Object.create()` 単体で\n\nプロトタイプ継承にコンストラクタは必須ではありません。\n\n```javascript\nconst animal = {\n  speak() {\n    console.log(\"Animal sound\");\n  }\n};\n\nconst dog = Object.create(animal);\n\ndog.speak();\n// Animal sound\n```\n\nここでは:\n\n```text\ndog\n ↓\nanimal\n ↓\nObject.prototype\n ↓\nnull\n```\n\n`Object.create(animal)` は `animal` をプロトタイプに持つ新しいオブジェクトを作ります。\n\n---\n\n### 覚え方\n\n> <b>Call → Connect → Fix</b>\n\n```text\nParent.call()\n      ↓\nObject.create()\n      ↓\nconstructor = Child\n```",
      },
      diagram: `Child object
     │
     ↓
Child.prototype
     │
     ↓
Parent.prototype
     │
     ↓
Object.prototype
     │
     ↓
null

When JavaScript cannot find a method on the child object,
it searches upward through this chain.


Call → Connect → Fix

Parent.call(this, ...)
      ↓
Object.create(Parent.prototype)
      ↓
Child.prototype.constructor = Child`,
      codeExample: {
        title: { en: "Call the parent, connect, then fix", np: "Parent call गर्नु, जोड्नु, अनि ठीक गर्नु", jp: "親を呼ぶ・つなぐ・直す" },
        code: `// ── 1. Parent constructor with a shared method ────────────────────
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function () {
  console.log(\`\${this.name} makes a sound\`);
};

// ── 2. Child constructor calls the parent ─────────────────────────
function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

// ── 3. Connect the prototypes, then fix the constructor ───────────
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function () {
  console.log("Woof!");
};

const dog = new Dog("Max", "Labrador");

dog.speak(); // Max makes a sound — from Animal.prototype
dog.bark();  // Woof! — from Dog.prototype

console.log(dog.constructor === Dog); // true, thanks to the fix

// ── Object.create() on its own, no constructors needed ────────────
const animal = {
  speak() {
    console.log("Animal sound");
  }
};

const pet = Object.create(animal);
pet.speak(); // Animal sound`,
      },
      keyTakeaways: [
        { en: "<b>Prototype inheritance</b> lets one object use another object's methods.", np: "<b>Prototype inheritance</b> ले एउटा object लाई अर्को object का method प्रयोग गर्न दिन्छ।", jp: "<b>プロトタイプ継承</b>により、あるオブジェクトが別のオブジェクトのメソッドを使える。" },
        { en: "`Parent.call(this, ...)` runs the parent constructor for the child object.", np: "`Parent.call(this, ...)` ले child object का लागि parent constructor चलाउँछ।", jp: "`Parent.call(this, ...)` は子オブジェクトのために親のコンストラクタを実行する。" },
        { en: "`Object.create(Parent.prototype)` connects the child to the parent prototype.", np: "`Object.create(Parent.prototype)` ले child लाई parent prototype सँग जोड्छ।", jp: "`Object.create(Parent.prototype)` が子を親のプロトタイプにつなぐ。" },
        { en: "`Child.prototype.constructor = Child` fixes the constructor reference.", np: "`Child.prototype.constructor = Child` ले constructor reference ठीक गर्छ।", jp: "`Child.prototype.constructor = Child` がコンストラクタ参照を直す。" },
        { en: "`Object.create(proto)` can create an object directly from a prototype, with no constructor at all.", np: "`Object.create(proto)` ले constructor बिनै prototype बाट सिधै object बनाउन सक्छ।", jp: "`Object.create(proto)` はコンストラクタなしでプロトタイプから直接オブジェクトを作れる。" },
        { en: "The child does <b>not</b> copy the parent's methods; it finds them through the prototype chain.", np: "Child ले parent का method copy <b>गर्दैन</b>; prototype chain मार्फत भेट्टाउँछ।", jp: "子は親のメソッドを<b>コピーしない</b>。プロトタイプチェーンをたどって見つける。" },
      ],
      commonMistakes: [
        { en: "<b>Forgetting `Parent.call()`</b> — without it, the properties the parent constructor sets are never initialised on the child.", np: "<b>`Parent.call()` बिर्सनु</b> — यसबिना, parent constructor ले सेट गर्ने property child मा कहिल्यै initialise हुँदैनन्।", jp: "<b>`Parent.call()` を忘れる</b> — 親のコンストラクタが設定するプロパティが子で初期化されない。" },
        { en: "<b>Forgetting `Object.create()`</b> — writing `Dog.prototype = Animal.prototype;` makes both constructors share the <b>same</b> prototype object, so adding to one changes the other.", np: "<b>`Object.create()` बिर्सनु</b> — `Dog.prototype = Animal.prototype;` लेख्दा दुबै constructor ले <b>उही</b> prototype object बाँड्छन्, त्यसैले एउटामा थप्दा अर्को पनि बदलिन्छ।", jp: "<b>`Object.create()` を忘れる</b> — `Dog.prototype = Animal.prototype;` と書くと両者が<b>同じ</b>プロトタイプを共有し、片方への追加がもう片方にも影響する。" },
        { en: "<b>Forgetting the constructor fix</b> — after `Dog.prototype = Object.create(Animal.prototype);`, `dog.constructor` reports `Animal` until you set `Dog.prototype.constructor = Dog;`.", np: "<b>Constructor ठीक गर्न बिर्सनु</b> — `Dog.prototype = Object.create(Animal.prototype);` पछि, `Dog.prototype.constructor = Dog;` नगरेसम्म `dog.constructor` ले `Animal` देखाउँछ।", jp: "<b>コンストラクタの修正を忘れる</b> — `Dog.prototype = Object.create(Animal.prototype);` の後、`Dog.prototype.constructor = Dog;` を書くまで `dog.constructor` は `Animal` を指す。" },
      ],
      quiz: [
        {
          question: { en: "What does `Object.create(Animal.prototype)` do?", np: "`Object.create(Animal.prototype)` ले के गर्छ?", jp: "`Object.create(Animal.prototype)` は何をするか?" },
          options: [
            { en: "Copies all Animal methods", np: "Animal का सबै method copy गर्छ", jp: "Animalのメソッドをすべてコピーする" },
            { en: "Creates a new Animal", np: "नयाँ Animal बनाउँछ", jp: "新しいAnimalを作る" },
            { en: "Connects the new object's prototype to `Animal.prototype`", np: "नयाँ object को prototype लाई `Animal.prototype` सँग जोड्छ", jp: "新しいオブジェクトのプロトタイプを `Animal.prototype` につなぐ" },
            { en: "Deletes the child prototype", np: "Child prototype मेटाउँछ", jp: "子のプロトタイプを削除する" },
          ],
          correctIndex: 2,
          explanation: { en: "Nothing is copied; the new object simply links upward to that prototype.", np: "केही copy हुँदैन; नयाँ object त्यो prototype तिर माथि जोडिन्छ मात्र।", jp: "何もコピーされない。新しいオブジェクトがそのプロトタイプへ上向きにリンクするだけ。" },
        },
        {
          question: { en: "Why do we use `Animal.call(this, name)`?", np: "`Animal.call(this, name)` किन प्रयोग गर्छौं?", jp: "なぜ `Animal.call(this, name)` を使うのか?" },
          options: [
            { en: "To create a prototype", np: "Prototype बनाउन", jp: "プロトタイプを作るため" },
            { en: "To change `Object.prototype`", np: "`Object.prototype` बदल्न", jp: "`Object.prototype` を変えるため" },
            { en: "To create a new function", np: "नयाँ function बनाउन", jp: "新しい関数を作るため" },
            { en: "To call the parent constructor for the child object", np: "Child object का लागि parent constructor call गर्न", jp: "子オブジェクトのために親のコンストラクタを呼ぶため" },
          ],
          correctIndex: 3,
          explanation: { en: "It runs the parent's setup with `this` pointing at the new child instance.", np: "यसले `this` लाई नयाँ child instance तिर देखाउँदै parent को setup चलाउँछ।", jp: "`this` を新しい子インスタンスに向けたまま親の初期化処理を実行する。" },
        },
        {
          question: { en: "Why do we write `Dog.prototype.constructor = Dog;`?", np: "`Dog.prototype.constructor = Dog;` किन लेख्छौं?", jp: "なぜ `Dog.prototype.constructor = Dog;` と書くのか?" },
          options: [
            { en: "To fix the constructor reference", np: "Constructor reference ठीक गर्न", jp: "コンストラクタ参照を直すため" },
            { en: "To create Dog", np: "Dog बनाउन", jp: "Dogを作るため" },
            { en: "To call Dog", np: "Dog call गर्न", jp: "Dogを呼ぶため" },
            { en: "To create inheritance", np: "Inheritance बनाउन", jp: "継承を作るため" },
          ],
          correctIndex: 0,
          explanation: { en: "`Object.create()` replaced the prototype, so `constructor` pointed at `Animal` until this line.", np: "`Object.create()` ले prototype प्रतिस्थापन गर्‍यो, त्यसैले यो line नआउन्जेल `constructor` ले `Animal` देखाउँथ्यो।", jp: "`Object.create()` がプロトタイプを置き換えたため、この行までは `constructor` が `Animal` を指していた。" },
        },
        {
          question: { en: "What does `Object.create(animal)` do?", np: "`Object.create(animal)` ले के गर्छ?", jp: "`Object.create(animal)` は何をするか?" },
          options: [
            { en: "Copies `animal`", np: "`animal` copy गर्छ", jp: "`animal` をコピーする" },
            { en: "Creates an object whose prototype is `animal`", np: "`animal` prototype भएको object बनाउँछ", jp: "`animal` をプロトタイプに持つオブジェクトを作る" },
            { en: "Deletes `animal`", np: "`animal` मेटाउँछ", jp: "`animal` を削除する" },
            { en: "Converts `animal` into a class", np: "`animal` लाई class मा बदल्छ", jp: "`animal` をクラスに変換する" },
          ],
          correctIndex: 1,
          explanation: { en: "This is prototype inheritance without any constructor function.", np: "यो constructor function बिनाको prototype inheritance हो।", jp: "コンストラクタ関数なしのプロトタイプ継承。" },
        },
      ],
    },
    {
      id: "property-descriptors",
      title: { en: "Property Descriptors & Object.defineProperty", np: "Property Descriptors र Object.defineProperty", jp: "プロパティディスクリプタとObject.defineProperty" },
      durationMinutes: 9,
      explanation: {
        en: "Every JavaScript object property has hidden settings called a <b>property descriptor</b>. These settings control what can happen when you read, change, enumerate, or delete the property.\n\nThere are two descriptor types:\n\n• <b>Data descriptor</b> — uses `value` with `writable`, `enumerable`, and `configurable`\n• <b>Accessor descriptor</b> — uses `get` and/or `set` instead of `value`\n\nThe three main flags are:\n\n<b>`writable`</b> — whether the property's value can be changed\n\n<b>`enumerable`</b> — whether the property appears in `Object.keys()`, `for...in`, etc.\n\n<b>`configurable`</b> — whether the property can be deleted or its descriptor changed\n\n```javascript\nconst user = {};\n\nObject.defineProperty(user, \"name\", {\n  value: \"Rajan\",\n  writable: false,\n  enumerable: true,\n  configurable: false\n});\n```\n\nNow `user.name` can be read, but its value cannot be reassigned.\n\n> <b>Important:</b> properties created normally with `obj.x = 5` have all three flags set to `true`. With `Object.defineProperty()`, unspecified descriptor flags default to `false`.\n\n---\n\n### 1. Basic `defineProperty`\n\n```javascript\nconst user = {};\n\nObject.defineProperty(user, \"name\", {\n  value: \"Rajan\",\n  writable: true,\n  enumerable: true,\n  configurable: true\n});\n\nconsole.log(user.name); // \"Rajan\"\n```\n\n---\n\n### 2. Read-only property\n\n```javascript\nconst user = {};\n\nObject.defineProperty(user, \"id\", {\n  value: 101,\n  writable: false\n});\n\nuser.id = 202;\n\nconsole.log(user.id); // 101\n```\n\n`writable: false` prevents reassignment.\n\n---\n\n### 3. Hidden property\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nObject.defineProperty(user, \"password\", {\n  value: \"secret\",\n  enumerable: false\n});\n\nconsole.log(Object.keys(user));\n// [\"name\"]\n\nconsole.log(user.password);\n// \"secret\"\n```\n\nThe property still exists; it simply doesn't appear in normal enumeration.\n\n---\n\n### 4. Getters and setters\n\nAccessor descriptors don't use `value`. They use `get` and `set`.\n\n```javascript\nconst user = {\n  firstName: \"Rajan\",\n  lastName: \"Magar\"\n};\n\nObject.defineProperty(user, \"fullName\", {\n  get() {\n    return `${this.firstName} ${this.lastName}`;\n  },\n\n  set(value) {\n    [this.firstName, this.lastName] = value.split(\" \");\n  }\n});\n\nconsole.log(user.fullName);\n// \"Rajan Magar\"\n\nuser.fullName = \"John Doe\";\n\nconsole.log(user.firstName);\n// \"John\"\n```\n\nHere, `fullName` behaves like a normal property even though its value is calculated dynamically.\n\n---\n\n### 5. Inspecting descriptors\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nconsole.log(Object.getOwnPropertyDescriptor(user, \"name\"));\n```\n\nOutput:\n\n```javascript\n{\n  value: \"Rajan\",\n  writable: true,\n  enumerable: true,\n  configurable: true\n}\n```\n\nYou can inspect every own property with `Object.getOwnPropertyDescriptors(user)`.",
        np: "हरेक JavaScript object property का लुकेका सेटिङ हुन्छन्, जसलाई <b>property descriptor</b> भनिन्छ। यी सेटिङले property पढ्दा, बदल्दा, enumerate गर्दा वा मेटाउँदा के हुन सक्छ नियन्त्रण गर्छन्।\n\nDescriptor का दुई प्रकार छन्:\n\n• <b>Data descriptor</b> — `writable`, `enumerable`, र `configurable` सँगै `value` प्रयोग गर्छ\n• <b>Accessor descriptor</b> — `value` को साटो `get` र/वा `set` प्रयोग गर्छ\n\nतीन मुख्य flag:\n\n<b>`writable`</b> — property को value बदल्न मिल्छ कि मिल्दैन\n\n<b>`enumerable`</b> — property `Object.keys()`, `for...in` आदिमा देखिन्छ कि देखिँदैन\n\n<b>`configurable`</b> — property मेटाउन वा यसको descriptor बदल्न मिल्छ कि मिल्दैन\n\n```javascript\nconst user = {};\n\nObject.defineProperty(user, \"name\", {\n  value: \"Rajan\",\n  writable: false,\n  enumerable: true,\n  configurable: false\n});\n```\n\nअब `user.name` पढ्न मिल्छ, तर यसको value reassign गर्न मिल्दैन।\n\n> <b>महत्वपूर्ण:</b> `obj.x = 5` ले सामान्य रूपमा बनेका property का तीनै flag `true` हुन्छन्। `Object.defineProperty()` सँग, नतोकिएका descriptor flag default मा `false` हुन्छन्।\n\n---\n\n### 1. आधारभूत `defineProperty`\n\n```javascript\nconst user = {};\n\nObject.defineProperty(user, \"name\", {\n  value: \"Rajan\",\n  writable: true,\n  enumerable: true,\n  configurable: true\n});\n\nconsole.log(user.name); // \"Rajan\"\n```\n\n---\n\n### 2. Read-only property\n\n```javascript\nconst user = {};\n\nObject.defineProperty(user, \"id\", {\n  value: 101,\n  writable: false\n});\n\nuser.id = 202;\n\nconsole.log(user.id); // 101\n```\n\n`writable: false` ले reassignment रोक्छ।\n\n---\n\n### 3. लुकेको property\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nObject.defineProperty(user, \"password\", {\n  value: \"secret\",\n  enumerable: false\n});\n\nconsole.log(Object.keys(user));\n// [\"name\"]\n\nconsole.log(user.password);\n// \"secret\"\n```\n\nProperty अझै अवस्थित छ; यो सामान्य enumeration मा देखिँदैन मात्र।\n\n---\n\n### 4. Getter र setter\n\nAccessor descriptor ले `value` प्रयोग गर्दैनन्। तिनले `get` र `set` प्रयोग गर्छन्।\n\n```javascript\nconst user = {\n  firstName: \"Rajan\",\n  lastName: \"Magar\"\n};\n\nObject.defineProperty(user, \"fullName\", {\n  get() {\n    return `${this.firstName} ${this.lastName}`;\n  },\n\n  set(value) {\n    [this.firstName, this.lastName] = value.split(\" \");\n  }\n});\n\nconsole.log(user.fullName);\n// \"Rajan Magar\"\n\nuser.fullName = \"John Doe\";\n\nconsole.log(user.firstName);\n// \"John\"\n```\n\nयहाँ, `fullName` को value गतिशील रूपमा गणना हुने भए पनि सामान्य property जस्तै व्यवहार गर्छ।\n\n---\n\n### 5. Descriptor हेर्नु\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nconsole.log(Object.getOwnPropertyDescriptor(user, \"name\"));\n```\n\nOutput:\n\n```javascript\n{\n  value: \"Rajan\",\n  writable: true,\n  enumerable: true,\n  configurable: true\n}\n```\n\n`Object.getOwnPropertyDescriptors(user)` ले हरेक own property हेर्न सकिन्छ।",
        jp: "JavaScriptのすべてのプロパティには<b>プロパティディスクリプタ</b>と呼ばれる隠れた設定があります。読み取り・変更・列挙・削除のときに何ができるかを、この設定が制御します。\n\nディスクリプタには2種類あります:\n\n• <b>データディスクリプタ</b> — `value` と `writable`・`enumerable`・`configurable` を使う\n• <b>アクセサディスクリプタ</b> — `value` の代わりに `get` や `set` を使う\n\n主なフラグは3つです:\n\n<b>`writable`</b> — 値を変更できるか\n\n<b>`enumerable`</b> — `Object.keys()` や `for...in` などに現れるか\n\n<b>`configurable`</b> — 削除やディスクリプタの変更ができるか\n\n```javascript\nconst user = {};\n\nObject.defineProperty(user, \"name\", {\n  value: \"Rajan\",\n  writable: false,\n  enumerable: true,\n  configurable: false\n});\n```\n\nこれで `user.name` は読めますが、値を再代入することはできません。\n\n> <b>重要:</b> `obj.x = 5` のように普通に作ったプロパティは3つのフラグがすべて `true` です。`Object.defineProperty()` では、指定しなかったフラグは既定で `false` になります。\n\n---\n\n### 1. 基本の `defineProperty`\n\n```javascript\nconst user = {};\n\nObject.defineProperty(user, \"name\", {\n  value: \"Rajan\",\n  writable: true,\n  enumerable: true,\n  configurable: true\n});\n\nconsole.log(user.name); // \"Rajan\"\n```\n\n---\n\n### 2. 読み取り専用のプロパティ\n\n```javascript\nconst user = {};\n\nObject.defineProperty(user, \"id\", {\n  value: 101,\n  writable: false\n});\n\nuser.id = 202;\n\nconsole.log(user.id); // 101\n```\n\n`writable: false` が再代入を防ぎます。\n\n---\n\n### 3. 隠れたプロパティ\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nObject.defineProperty(user, \"password\", {\n  value: \"secret\",\n  enumerable: false\n});\n\nconsole.log(Object.keys(user));\n// [\"name\"]\n\nconsole.log(user.password);\n// \"secret\"\n```\n\nプロパティは存在し続けます。通常の列挙に現れないだけです。\n\n---\n\n### 4. ゲッターとセッター\n\nアクセサディスクリプタは `value` を使わず、`get` と `set` を使います。\n\n```javascript\nconst user = {\n  firstName: \"Rajan\",\n  lastName: \"Magar\"\n};\n\nObject.defineProperty(user, \"fullName\", {\n  get() {\n    return `${this.firstName} ${this.lastName}`;\n  },\n\n  set(value) {\n    [this.firstName, this.lastName] = value.split(\" \");\n  }\n});\n\nconsole.log(user.fullName);\n// \"Rajan Magar\"\n\nuser.fullName = \"John Doe\";\n\nconsole.log(user.firstName);\n// \"John\"\n```\n\nここでは `fullName` の値は動的に計算されますが、普通のプロパティのように振る舞います。\n\n---\n\n### 5. ディスクリプタを調べる\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nconsole.log(Object.getOwnPropertyDescriptor(user, \"name\"));\n```\n\n出力:\n\n```javascript\n{\n  value: \"Rajan\",\n  writable: true,\n  enumerable: true,\n  configurable: true\n}\n```\n\n`Object.getOwnPropertyDescriptors(user)` ですべての自身のプロパティを調べられます。",
      },
      diagram: `             Property Descriptor
                     │
          ┌──────────┴──────────┐
          │                     │
     Data Property         Accessor Property
          │                     │
     ┌────┴────┐           ┌────┴────┐
   value    writable      get       set
            enumerable
            configurable


Think of a property like a locked cabinet:

┌─────────────────────────────┐
│ user.name                   │
├─────────────────────────────┤
│ value: "Rajan"              │
│ writable: false             │
│ enumerable: true            │
│ configurable: false         │
└─────────────────────────────┘`,
      codeExample: {
        title: { en: "Locking, hiding and computing a property", np: "Property lock गर्नु, लुकाउनु र गणना गर्नु", jp: "プロパティを固定・非表示・計算する" },
        code: `// ── 1. Basic defineProperty ───────────────────────────────────────
const user = {};

Object.defineProperty(user, "name", {
  value: "Rajan",
  writable: true,
  enumerable: true,
  configurable: true
});

console.log(user.name); // "Rajan"

// ── 2. Read-only — writable defaults to false ─────────────────────
Object.defineProperty(user, "id", {
  value: 101,
  writable: false
});

user.id = 202;
console.log(user.id); // 101

// ── 3. Hidden from enumeration, but still readable ────────────────
Object.defineProperty(user, "password", {
  value: "secret",
  enumerable: false
});

console.log(Object.keys(user)); // ["name"]
console.log(user.password);     // "secret"

// ── 4. Accessor descriptor — get and set instead of value ─────────
const person = {
  firstName: "Rajan",
  lastName: "Magar"
};

Object.defineProperty(person, "fullName", {
  get() {
    return \`\${this.firstName} \${this.lastName}\`;
  },
  set(value) {
    [this.firstName, this.lastName] = value.split(" ");
  }
});

console.log(person.fullName); // "Rajan Magar"

person.fullName = "John Doe";
console.log(person.firstName); // "John"

// ── 5. Inspecting what a property actually allows ─────────────────
console.log(Object.getOwnPropertyDescriptor(person, "firstName"));
// { value: "John", writable: true, enumerable: true, configurable: true }`,
      },
      keyTakeaways: [
        { en: "<b>Property descriptors</b> control how object properties behave.", np: "<b>Property descriptor</b> ले object property कसरी व्यवहार गर्छन् नियन्त्रण गर्छन्।", jp: "<b>プロパティディスクリプタ</b>がプロパティの振る舞いを制御する。" },
        { en: "<b>`writable`</b> → can the value change?", np: "<b>`writable`</b> → value बदल्न मिल्छ?", jp: "<b>`writable`</b> → 値を変更できるか?" },
        { en: "<b>`enumerable`</b> → does it appear during enumeration?", np: "<b>`enumerable`</b> → enumeration मा देखिन्छ?", jp: "<b>`enumerable`</b> → 列挙時に現れるか?" },
        { en: "<b>`configurable`</b> → can it be deleted or reconfigured?", np: "<b>`configurable`</b> → मेटाउन वा पुनः configure गर्न मिल्छ?", jp: "<b>`configurable`</b> → 削除や再設定ができるか?" },
        { en: "<b>`Object.defineProperty()`</b> lets you control these settings.", np: "<b>`Object.defineProperty()`</b> ले यी सेटिङ नियन्त्रण गर्न दिन्छ।", jp: "<b>`Object.defineProperty()`</b> でこれらの設定を制御できる。" },
        { en: "<b>Getters and setters</b> are accessor descriptors and use `get`/`set` instead of `value`.", np: "<b>Getter र setter</b> accessor descriptor हुन् र `value` को साटो `get`/`set` प्रयोग गर्छन्।", jp: "<b>ゲッターとセッター</b>はアクセサディスクリプタで、`value` の代わりに `get`/`set` を使う。" },
        { en: "`Object.getOwnPropertyDescriptor()` lets you inspect a property's configuration.", np: "`Object.getOwnPropertyDescriptor()` ले property को configuration हेर्न दिन्छ।", jp: "`Object.getOwnPropertyDescriptor()` でプロパティの設定を調べられる。" },
        { en: "Be careful: with `defineProperty()`, unspecified flags default to <b>`false`</b>.", np: "होसियार: `defineProperty()` सँग, नतोकिएका flag default मा <b>`false`</b> हुन्छन्।", jp: "注意: `defineProperty()` では指定しなかったフラグは既定で<b>`false`</b>。" },
      ],
      commonMistakes: [
        { en: "<b>Assuming `defineProperty()` defaults behave like normal properties</b> — `Object.defineProperty(user, \"age\", { value: 30 })` leaves `writable` as `false`, so `user.age = 40` silently does nothing.", np: "<b>`defineProperty()` का default सामान्य property जस्तै हुन्छन् भन्ने ठान्नु</b> — `Object.defineProperty(user, \"age\", { value: 30 })` ले `writable` लाई `false` छोड्छ, त्यसैले `user.age = 40` ले चुपचाप केही गर्दैन।", jp: "<b>`defineProperty()` の既定値が普通のプロパティと同じだと思う</b> — `Object.defineProperty(user, \"age\", { value: 30 })` は `writable` が `false` のままなので、`user.age = 40` は黙って何も起きない。" },
        { en: "<b>Using `value` together with `get` or `set`</b> — a descriptor cannot define both a data property and an accessor; it throws a `TypeError`.", np: "<b>`value` लाई `get` वा `set` सँगै प्रयोग गर्नु</b> — descriptor ले data property र accessor दुबै परिभाषित गर्न सक्दैन; यसले `TypeError` दिन्छ।", jp: "<b>`value` と `get`/`set` を同時に使う</b> — ディスクリプタはデータプロパティとアクセサの両方を定義できず、`TypeError` になる。" },
        { en: "<b>Thinking `enumerable: false` makes a property private</b> — `user.password` still works. It only hides the property from enumeration.", np: "<b>`enumerable: false` ले property निजी बनाउँछ भन्ने ठान्नु</b> — `user.password` अझै काम गर्छ। यसले property लाई enumeration बाट लुकाउँछ मात्र।", jp: "<b>`enumerable: false` でプライベートになると思う</b> — `user.password` は依然として読める。列挙から隠すだけ。" },
      ],
      quiz: [
        {
          question: { en: "What does `writable: false` do?", np: "`writable: false` ले के गर्छ?", jp: "`writable: false` は何をするか?" },
          options: [
            { en: "Hides the property", np: "Property लुकाउँछ", jp: "プロパティを隠す" },
            { en: "Prevents deleting the property", np: "Property मेटाउनबाट रोक्छ", jp: "プロパティの削除を防ぐ" },
            { en: "Prevents changing its value", np: "यसको value बदल्नबाट रोक्छ", jp: "値の変更を防ぐ" },
            { en: "Makes the property private", np: "Property निजी बनाउँछ", jp: "プロパティをプライベートにする" },
          ],
          correctIndex: 2,
          explanation: { en: "Hiding is `enumerable`, and preventing deletion is `configurable`.", np: "लुकाउने `enumerable` हो, र मेटाउन रोक्ने `configurable` हो।", jp: "隠すのは `enumerable`、削除を防ぐのは `configurable`。" },
        },
        {
          question: { en: "What does `obj.x` print after `Object.defineProperty(obj, \"x\", { value: 10 }); obj.x = 20;`?", np: "`Object.defineProperty(obj, \"x\", { value: 10 }); obj.x = 20;` पछि `obj.x` ले के देखाउँछ?", jp: "`Object.defineProperty(obj, \"x\", { value: 10 }); obj.x = 20;` の後 `obj.x` は何を出すか?" },
          options: [
            { en: "`20`", np: "`20`", jp: "`20`" },
            { en: "`10`", np: "`10`", jp: "`10`" },
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
          ],
          correctIndex: 1,
          explanation: { en: "`writable` was not specified, so it defaulted to `false` and the assignment was ignored.", np: "`writable` तोकिएको थिएन, त्यसैले default `false` भयो र assignment बेवास्ता भयो।", jp: "`writable` を指定しなかったので既定の `false` になり、代入は無視された。" },
        },
        {
          question: { en: "Which descriptor is used for a computed property?", np: "गणना गरिने property का लागि कुन descriptor प्रयोग हुन्छ?", jp: "計算されるプロパティにはどのディスクリプタを使うか?" },
          options: [
            { en: "`get`", np: "`get`", jp: "`get`" },
            { en: "`value`", np: "`value`", jp: "`value`" },
            { en: "`writable`", np: "`writable`", jp: "`writable`" },
            { en: "`enumerable`", np: "`enumerable`", jp: "`enumerable`" },
          ],
          correctIndex: 0,
          explanation: { en: "`get` (with an optional `set`) makes an accessor property, which cannot also use `value`.", np: "`get` (वैकल्पिक `set` सहित) ले accessor property बनाउँछ, जसले `value` पनि प्रयोग गर्न सक्दैन।", jp: "`get`（必要なら `set` も）でアクセサプロパティになる。`value` とは併用できない。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "How does JavaScript find a property that isn't directly on an object?", np: "Object मा सिधै नभएको property JS ले कसरी भेट्छ?", jp: "オブジェクトに直接ないプロパティをJSはどうやって見つける？" },
      options: [{ en: "It throws a ReferenceError immediately", np: "यो तुरुन्तै ReferenceError throw गर्छ", jp: "即座にReferenceErrorをスローする" }, { en: "It walks the prototype chain until found or reaching null", np: "यो भेटिने वा null सम्म पुगुन्जेल prototype chain हिँड्छ", jp: "見つかるかnullに達するまでプロトタイプチェーンを歩く" }],
      correctIndex: 1,
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
      options: [{ en: "`obj.__proto__`", np: "`obj.__proto__`", jp: "`obj.__proto__`" }, { en: "`Object.getPrototypeOf(obj)`", np: "`Object.getPrototypeOf(obj)`", jp: "`Object.getPrototypeOf(obj)`" }],
      correctIndex: 1,
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
      options: [{ en: "Nothing, they're equivalent", np: "केही छैन, दुवै उस्तै", jp: "何も問題ない、同等" }, { en: "Child and Parent end up sharing the literal same prototype object", np: "Child र Parent ले उही literal prototype object share गर्छन्", jp: "ChildとParentが文字通り同じプロトタイプオブジェクトを共有する" }],
      correctIndex: 1,
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
      options: [{ en: "static, private, async", np: "static, private, async", jp: "static、private、async" }, { en: "writable, enumerable, configurable", np: "writable, enumerable, configurable", jp: "writable、enumerable、configurable" }],
      correctIndex: 1,
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
      options: [{ en: "As a method call: `obj.fullName()`", np: "Method call को रूपमा: `obj.fullName()`", jp: "メソッド呼び出しとして: `obj.fullName()`" }, { en: "Like a normal property, no parentheses: `obj.fullName`", np: "Normal property जस्तै, parentheses बिना: `obj.fullName`", jp: "通常のプロパティのように括弧なし: `obj.fullName`" }],
      correctIndex: 1,
      explanation: { en: "Getters run transparently on property access — no call syntax is needed or valid.", np: "Getters property access मा transparently चल्छन् — call syntax चाहिँदैन।", jp: "getterはプロパティアクセス時に透過的に実行される。呼び出し構文は不要。" },
    },
  ],
};
