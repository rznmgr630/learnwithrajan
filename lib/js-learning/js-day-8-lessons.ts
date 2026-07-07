import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_8_LESSONS: JsLessonDay = {
  day: 8,
  title: { en: "Prototype System & Prototype Chain", np: "Prototype System र Prototype Chain", jp: "プロトタイプシステムと継承チェーン" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "prototype-chain",
      title: { en: "The Prototype Chain", np: "The Prototype Chain", jp: "プロトタイプチェーン" },
      durationMinutes: 9,
      explanation: {
        en: "Every JavaScript object has an internal link to another object called its <b>prototype</b>. When you access a property and it isn't found directly on the object, JavaScript automatically walks up this chain — checking the prototype, then the prototype's prototype, and so on — until it finds the property or reaches `null`. This walk is exactly how inheritance works in JavaScript, with no copying involved.\n\nMethods added to a constructor's `.prototype` (like `User.prototype.greet`) are shared by ALL instances through this chain — memory-efficient, since there's only one copy of `greet` no matter how many users you create. `Object.getPrototypeOf(obj)` is the modern, correct way to inspect the chain (`obj.__proto__` is legacy and discouraged).",
        np: "हरेक JS object सँग prototype भनिने अर्को object को link हुन्छ। Property नभेटिएमा JS ले automatically prototype chain मा माथि खोज्छ जबसम्म भेटिँदैन वा `null` सम्म पुग्दैन। Constructor को `.prototype` मा थपिएका methods सबै instances ले share गर्छन्।",
        jp: "すべてのJSオブジェクトはプロトタイプという別のオブジェクトへのリンクを持つ。プロパティが見つからない場合、見つかるか`null`に達するまでチェーンを遡る。コンストラクタの`.prototype`に追加されたメソッドはすべてのインスタンスで共有される。",
      },
      diagram: `alice = { name: "Alice", age: 30 }
   │
   ▼  [[Prototype]]
User.prototype { greet, isAdult }
   │
   ▼  [[Prototype]]
Object.prototype { toString, hasOwnProperty, ... }
   │
   ▼
 null   ← chain ends here

Lookup order for alice.greet():
1. alice's own props?  no  →  2. User.prototype?  YES, found`,
      codeExample: {
        title: { en: "Constructor functions, the prototype chain, and Object.create", np: "Constructor functions, prototype chain, Object.create", jp: "コンストラクタ関数・プロトタイプチェーン・Object.create" },
        code: `// ── Constructor function (pre-ES6 way to share methods) ────────────
function User(name, age) {
  this.name = name;    // instance property — unique per object
  this.age  = age;
}

// Methods on the prototype are shared across ALL instances
User.prototype.greet = function () { return \`Hi, I'm \${this.name}\`; };
User.prototype.isAdult = function () { return this.age >= 18; };

const alice = new User("Alice", 30);
alice.greet();     // "Hi, I'm Alice" — found on User.prototype, not on alice itself

// ── Lookup order ─────────────────────────────────────────────────────
// 1. alice's own properties  → { name, age }
// 2. User.prototype          → { greet, isAdult }
// 3. Object.prototype        → { toString, hasOwnProperty, ... }
// 4. null                    → not found, returns undefined

alice.hasOwnProperty("name");   // true  — own property
alice.hasOwnProperty("greet");  // false — inherited via the prototype chain

// ── Inspecting the chain — the modern, correct way ──────────────────
Object.getPrototypeOf(alice) === User.prototype;               // true
Object.getPrototypeOf(User.prototype) === Object.prototype;    // true

// ── instanceof — checks if a prototype is somewhere in the chain ────
alice instanceof User;    // true
alice instanceof Object;  // true — every object chain reaches Object.prototype

// ── Object.create — build an object with a chosen prototype directly ─
const animal = { speak() { return \`\${this.name} makes a sound\`; } };
const dog = Object.create(animal);
dog.name = "Rex";
dog.speak();  // "Rex makes a sound" — found on animal, dog's prototype`,
      },
      keyTakeaways: [
        { en: "Property lookup walks the prototype chain automatically: own property first, then the prototype, then its prototype, until `null` — this IS inheritance in JavaScript.", np: "Property lookup ले automatically prototype chain हिँड्छ: पहिले own property, त्यसपछि prototype, `null` सम्म — यही JS को inheritance हो।", jp: "プロパティ検索は自動的にプロトタイプチェーンを歩く: まず自身のプロパティ、次にプロトタイプ、nullまで — これがJSの継承。" },
        { en: "Methods placed on `Constructor.prototype` are shared by every instance through the chain, rather than duplicated onto each individual object.", np: "`Constructor.prototype` मा राखिएका methods हरेक individual object मा duplicate नभई chain मार्फत हरेक instance ले share गर्छन्।", jp: "`Constructor.prototype`に配置されたメソッドは、各オブジェクトに複製されるのではなくチェーンを通じてすべてのインスタンスで共有される。" },
        { en: "Use `Object.getPrototypeOf(obj)` to inspect an object's prototype — `obj.__proto__` is a legacy accessor and discouraged in modern code.", np: "Object को prototype inspect गर्न `Object.getPrototypeOf(obj)` प्रयोग गर्नुहोस् — `obj.__proto__` legacy हो र modern code मा discouraged छ।", jp: "オブジェクトのプロトタイプを調べるには`Object.getPrototypeOf(obj)`を使う。`obj.__proto__`はレガシーで現代のコードでは推奨されない。" },
      ],
      commonMistakes: [
        { en: "Using `\"key\" in obj` or a truthy check to test for an own property when you actually need `Object.hasOwn()` — `in` also matches inherited prototype properties.", np: "Own property test गर्नुपर्दा `\"key\" in obj` प्रयोग गर्नु — `in` ले inherited prototype properties पनि match गर्छ, `Object.hasOwn()` चाहिन्छ।", jp: "自身のプロパティを確認したいのに`\"key\" in obj`を使うこと。`in`は継承されたプロトタイプのプロパティにもマッチする。`Object.hasOwn()`が必要。" },
        { en: "Assuming each instance gets its own private copy of a prototype method — they all share the exact same function in memory.", np: "हरेक instance ले prototype method को आफ्नै private copy पाउँछ भन्ने ठान्नु — सबैले memory मा उही function share गर्छन्।", jp: "各インスタンスがプロトタイプメソッドの独自のプライベートコピーを持つと思うこと。実際はすべて同じ関数をメモリ内で共有する。" },
        { en: "Using the legacy `obj.__proto__` accessor instead of `Object.getPrototypeOf(obj)` / `Object.setPrototypeOf(obj, proto)` in modern code.", np: "Modern code मा `Object.getPrototypeOf(obj)` को सट्टा legacy `obj.__proto__` accessor प्रयोग गर्नु।", jp: "モダンなコードで`Object.getPrototypeOf(obj)`の代わりにレガシーな`obj.__proto__`アクセサを使うこと。" },
      ],
      quiz: [
        {
          question: { en: "If `alice.greet` is not an own property of `alice`, where does JavaScript find it?", np: "`alice.greet` `alice` को own property नभएमा JS ले यो कहाँ भेट्छ?", jp: "`alice.greet`が`alice`自身のプロパティでない場合、JSはどこで見つける？" },
          options: [
            { en: "It walks up the prototype chain, e.g. to `User.prototype`", np: "यो prototype chain मा माथि हिँड्छ, जस्तै `User.prototype` सम्म", jp: "プロトタイプチェーンを遡る（例: `User.prototype`まで）" },
            { en: "It throws a ReferenceError immediately", np: "यो तुरुन्तै ReferenceError throw गर्छ", jp: "即座にReferenceErrorをスローする" },
          ],
          correctIndex: 0,
          explanation: { en: "JavaScript automatically checks the object's prototype, then its prototype, and so on, before giving up.", np: "JS ले हार मान्नु अघि object को prototype, त्यसको prototype क्रमशः check गर्छ।", jp: "JSは諦める前にオブジェクトのプロトタイプ、さらにそのプロトタイプを順に確認する。" },
        },
        {
          question: { en: "Do two different `User` instances share the same `greet` function in memory?", np: "दुई फरक `User` instances ले memory मा उही `greet` function share गर्छन्?", jp: "2つの異なる`User`インスタンスはメモリ内で同じ`greet`関数を共有する？" },
          options: [
            { en: "Yes — it lives once on `User.prototype` and is shared by all instances", np: "हो — यो `User.prototype` मा एकपल्ट रहन्छ र सबै instances ले share गर्छन्", jp: "はい — `User.prototype`に1つだけ存在し、すべてのインスタンスで共有される" },
            { en: "No — each instance gets its own private copy", np: "होइन — हरेक instance ले आफ्नै private copy पाउँछ", jp: "いいえ — 各インスタンスが独自のプライベートコピーを持つ" },
          ],
          correctIndex: 0,
          explanation: { en: "Prototype methods are defined once and looked up via the chain, which is exactly why the prototype pattern is memory-efficient.", np: "Prototype methods एकपल्ट define हुन्छन् र chain मार्फत lookup हुन्छन्, यही prototype pattern को memory efficiency हो।", jp: "プロトタイプメソッドは一度だけ定義されチェーン経由で検索される。これがプロトタイプパターンがメモリ効率的な理由。" },
        },
        {
          question: { en: "What is the modern, correct way to read an object's prototype?", np: "Object को prototype पढ्ने modern, correct तरिका के हो?", jp: "オブジェクトのプロトタイプを読む現代的で正しい方法は？" },
          options: [
            { en: "`obj.__proto__`", np: "`obj.__proto__`", jp: "`obj.__proto__`" },
            { en: "`Object.getPrototypeOf(obj)`", np: "`Object.getPrototypeOf(obj)`", jp: "`Object.getPrototypeOf(obj)`" },
          ],
          correctIndex: 1,
          explanation: { en: "__proto__ is a legacy accessor kept for compatibility; Object.getPrototypeOf() is the standard, recommended API.", np: "__proto__ compatibility का लागि राखिएको legacy accessor हो; Object.getPrototypeOf() standard, recommended API हो।", jp: "__proto__は互換性のために残されたレガシーアクセサ。Object.getPrototypeOf()が標準の推奨API。" },
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
