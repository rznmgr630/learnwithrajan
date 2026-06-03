import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_8_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "The prototype system is the engine under the hood of every object in JavaScript. Classes (Day 9) are just a cleaner syntax on top of prototypes — understanding prototypes first means classes will make complete sense. Most developers skip this and then spend years confused about why things work the way they do.",
      np: "Prototype system JavaScript को हरेक object को engine हो। Classes (Day 9) केवल prototypes माथि cleaner syntax हो — prototype पहिले बुझ्नाले classes पूरै sense गर्छन्। धेरैजसो developers यो skip गर्छन् र वर्षौंसम्म confused हुन्छन्।",
      jp: "プロトタイプシステムはJavaScriptの全オブジェクトを動かすエンジン。クラス（Day 9）はプロトタイプの上に乗った糖衣構文。プロトタイプを先に理解するとクラスが完全に腑に落ちる。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "wstwjQ1yqWQ", title: "JavaScript Prototype and Prototype Chain" },
      ],
    },
    {
      title: { en: "The prototype chain", np: "Prototype chain", jp: "プロトタイプチェーン" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every JavaScript object has an internal link to another object called its **prototype**. When you try to access a property on an object and it is not found, JavaScript automatically looks up the prototype chain — checking the prototype's prototype, and so on, until it reaches `null`. This is how inheritance works in JavaScript.",
            np: "JavaScript को हरेक object सँग आफ्नो **prototype** भनिने अर्को object को internal link हुन्छ। Property access गर्दा नभेटेमा JavaScript automatically prototype chain मा माथि खोज्छ — prototype को prototype, र यसरी `null` सम्म। यही JavaScript को inheritance हो।",
            jp: "JavaScriptのすべてのオブジェクトは**プロトタイプ**と呼ばれる別のオブジェクトへの内部リンクを持つ。プロパティが見つからないとJSは自動的にプロトタイプチェーンをたどり`null`まで検索する。これがJSの継承の仕組み。",
          },
        },
        {
          type: "code",
          title: { en: "prototype, __proto__, and Object.getPrototypeOf", np: "prototype, __proto__, Object.getPrototypeOf", jp: "prototype・__proto__・Object.getPrototypeOf" },
          code: `// ── Constructor functions (pre-ES6 way to create objects with shared methods) ─
function User(name, age) {
  this.name = name;    // instance property — unique per object
  this.age  = age;
}

// Methods added to the prototype are shared across ALL instances (memory efficient)
User.prototype.greet = function () {
  return \`Hi, I'm \${this.name}\`;
};

User.prototype.isAdult = function () {
  return this.age >= 18;
};

const alice = new User("Alice", 30);
const bob   = new User("Bob",   17);

alice.greet();    // "Hi, I'm Alice" — found on User.prototype
alice.isAdult();  // true

// ── The prototype chain ─────────────────────────────────────────────────
// alice's own properties: { name: "Alice", age: 30 }
// alice.__proto__  → User.prototype { greet, isAdult }
// User.prototype.__proto__ → Object.prototype { toString, hasOwnProperty, ... }
// Object.prototype.__proto__ → null

// Property lookup order:
// 1. alice's own properties — found? use it
// 2. User.prototype — found? use it
// 3. Object.prototype — found? use it
// 4. null — not found, return undefined

alice.hasOwnProperty("name");  // true  — own property
alice.hasOwnProperty("greet"); // false — on prototype, not own

// ── The right way to check the prototype chain (not __proto__) ────────────
Object.getPrototypeOf(alice) === User.prototype;  // true
Object.getPrototypeOf(User.prototype) === Object.prototype;  // true

// ── instanceof — checks if prototype is in the chain ──────────────────────
alice instanceof User;   // true
alice instanceof Object; // true — everything inherits from Object

// ── Object.create — create an object with a specific prototype ─────────────
const animal = {
  speak() { return \`\${this.name} makes a sound\`; },
};

const dog = Object.create(animal);
dog.name = "Rex";
dog.speak();  // "Rex makes a sound" — found on animal (its prototype)

Object.getPrototypeOf(dog) === animal;  // true`,
        },
      ],
    },
    {
      title: { en: "Prototype inheritance", np: "Prototype inheritance", jp: "プロトタイプ継承" },
      blocks: [
        {
          type: "code",
          title: { en: "Extending a constructor function with prototypal inheritance", np: "Constructor function prototype inheritance सहित extend गर्नु", jp: "コンストラクタ関数のプロトタイプ継承" },
          code: `// ── Base constructor ────────────────────────────────────────────────
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return \`\${this.name} makes a sound\`;
};

// ── Derived constructor ───────────────────────────────────────────────
function Dog(name, breed) {
  Animal.call(this, name);    // 1. call parent constructor to initialise 'name'
  this.breed = breed;
}

// 2. Set up the prototype chain so Dog instances inherit from Animal.prototype
Dog.prototype = Object.create(Animal.prototype);

// 3. Fix the constructor reference (Object.create breaks it)
Dog.prototype.constructor = Dog;

// 4. Add Dog-specific methods
Dog.prototype.bark = function () {
  return "Woof!";
};

const rex = new Dog("Rex", "Labrador");
rex.speak();  // "Rex makes a sound" — from Animal.prototype
rex.bark();   // "Woof!" — from Dog.prototype
rex instanceof Dog;    // true
rex instanceof Animal; // true — Dog.prototype chain includes Animal.prototype

// ── Modern alternative: Object.create for clean prototypal inheritance ───
const animalProto = {
  init(name) { this.name = name; return this; },
  speak()    { return \`\${this.name} makes a sound\`; },
};

const dogProto = Object.create(animalProto);
dogProto.initDog = function(name, breed) {
  this.init(name);
  this.breed = breed;
  return this;
};
dogProto.bark = function() { return "Woof!"; };

const buddy = Object.create(dogProto).initDog("Buddy", "Poodle");
buddy.speak(); // "Buddy makes a sound"
buddy.bark();  // "Woof!"`,
        },
      ],
    },
    {
      title: { en: "Property descriptors & Object.defineProperty", np: "Property descriptors र Object.defineProperty", jp: "プロパティディスクリプタとObject.defineProperty" },
      blocks: [
        {
          type: "code",
          title: { en: "Controlling property behaviour with descriptors", np: "Descriptors सँग property behaviour control", jp: "ディスクリプタでプロパティ動作を制御" },
          code: `// Every property has three hidden flags:
// writable   — can the value be changed?
// enumerable — does it show in for...in loops and Object.keys()?
// configurable — can the descriptor itself be changed or the property deleted?

const obj = {};
Object.defineProperty(obj, "id", {
  value:        42,
  writable:     false,  // obj.id = 99 will silently fail (or throw in strict mode)
  enumerable:   false,  // won't appear in for...in or Object.keys()
  configurable: false,  // cannot delete obj.id or redefine this descriptor
});

obj.id;           // 42
obj.id = 99;      // silently ignored in sloppy mode
Object.keys(obj); // [] — id is not enumerable

// ── Reading a property's descriptor ───────────────────────────────
Object.getOwnPropertyDescriptor(obj, "id");
// { value: 42, writable: false, enumerable: false, configurable: false }

// ── getters and setters via defineProperty ────────────────────────
const person = { firstName: "John", lastName: "Doe" };

Object.defineProperty(person, "fullName", {
  get() { return \`\${this.firstName} \${this.lastName}\`; },
  set(value) {
    [this.firstName, this.lastName] = value.split(" ");
  },
  enumerable: true,
  configurable: true,
});

person.fullName;        // "John Doe"
person.fullName = "Jane Smith";
person.firstName;       // "Jane"`,
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What is the difference between prototype and __proto__?", np: "prototype र __proto__ मा के फरक?", jp: "prototypeと__proto__の違いは？" },
      answer: {
        en: "`prototype` is a property on **constructor functions**. When you call `new MyFunction()`, the newly created object's internal `[[Prototype]]` is set to `MyFunction.prototype`. `__proto__` (and its modern equivalent `Object.getPrototypeOf()`) is a property on **instances** that gives you access to the object's prototype. Use `Object.getPrototypeOf(obj)` instead of `obj.__proto__` — `__proto__` is deprecated and not recommended.",
        np: "`prototype` **constructor functions** मा property हो। `new MyFunction()` call गर्दा नयाँ object को `[[Prototype]]` = `MyFunction.prototype` हुन्छ। `__proto__` **instances** मा property हो जसले object को prototype access दिन्छ। `obj.__proto__` deprecated छ — `Object.getPrototypeOf(obj)` प्रयोग गर्नुहोस्।",
        jp: "`prototype`は**コンストラクタ関数**のプロパティ。`new`で作られたオブジェクトの`[[Prototype]]`がこれになる。`__proto__`は**インスタンス**のプロパティで、オブジェクトのプロトタイプにアクセスする。`__proto__`はdeprecated、`Object.getPrototypeOf()`を使う。",
      },
    },
    {
      question: { en: "Do all objects inherit from Object.prototype?", np: "सबै objects Object.prototype बाट inherit गर्छन्?", jp: "すべてのオブジェクトはObject.prototypeを継承するか？" },
      answer: {
        en: "Almost all objects do. The prototype chain of most objects ends at `Object.prototype`, which provides methods like `hasOwnProperty`, `toString`, `valueOf`, and `isPrototypeOf`. The exception is objects created with `Object.create(null)`, which have no prototype at all — useful for creating pure dictionaries with no inherited properties.",
        np: "लगभग सबैले गर्छन्। अधिकांश objects को prototype chain `Object.prototype` मा समाप्त हुन्छ जसले `hasOwnProperty`, `toString` आदि दिन्छ। Exception: `Object.create(null)` ले prototype नै नभएको objects बनाउँछ — pure dictionaries का लागि उपयोगी।",
        jp: "ほぼすべてのオブジェクトが継承する。ほとんどのオブジェクトのプロトタイプチェーンは`Object.prototype`で終わり、`hasOwnProperty`・`toString`などを提供する。例外は`Object.create(null)`で作られたオブジェクト（継承なし）。",
      },
    },
  ],
};
