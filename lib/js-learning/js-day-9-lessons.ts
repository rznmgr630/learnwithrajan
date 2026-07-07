import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_9_LESSONS: JsLessonDay = {
  day: 9,
  title: { en: "ES6 Classes — Inheritance, Static & Private Fields", np: "ES6 Classes — Inheritance, Static, Private", jp: "ES6クラス・継承・static・プライベート" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "class-basics",
      title: { en: "Class Basics", np: "Class Basics", jp: "クラスの基本" },
      durationMinutes: 9,
      explanation: {
        en: "An ES6 `class` is <b>syntactic sugar</b> over the exact same prototype system from Day 8 — it compiles down to a constructor function with methods on its `.prototype`, nothing more. `typeof MyClass` is literally `\"function\"`, and `Object.getPrototypeOf(instance) === MyClass.prototype` is `true`, exactly as it was for the constructor-function pattern.\n\nWhat changes is purely the syntax: the `constructor(...)` method replaces the constructor function's body, and every other method written inside the class body is automatically placed onto the prototype — no more manually writing `User.prototype.greet = function() {...}` by hand.",
        np: "ES6 `class` Day 8 को उही prototype system माथिको syntactic sugar हो — यो constructor function मा नै compile हुन्छ। `typeof MyClass` वास्तवमा `\"function\"` हो। बदलिने कुरा केवल syntax हो — `constructor()` र भित्रका methods automatically prototype मा जान्छन्।",
        jp: "ES6のクラスはDay 8と同じプロトタイプシステム上の糖衣構文で、コンストラクタ関数にコンパイルされる。`typeof MyClass`は実際に`\"function\"`。変わるのは構文だけ — `constructor()`と内部のメソッドは自動的にプロトタイプに配置される。",
      },
      diagram: `class User {                      function UserOld(name) {
  constructor(name) {                 this.name = name;
    this.name = name;               }
  }                                  UserOld.prototype.greet = function() {
  greet() { return this.name; }         return this.name;
}                                    };

  ── COMPILE TO THE EXACT SAME THING ──

typeof User === "function"                       ✅ classes ARE functions
Object.getPrototypeOf(new User()) === User.prototype   ✅ same mechanism`,
      codeExample: {
        title: { en: "Class syntax vs the equivalent prototype syntax", np: "Class syntax vs equivalent prototype syntax", jp: "クラス構文と等価なプロトタイプ構文" },
        code: `// ── Prototype way (Day 8) ───────────────────────────────────────────
function UserOld(name, age) {
  this.name = name;
  this.age  = age;
}
UserOld.prototype.greet = function () { return \`Hi, I'm \${this.name}\`; };

// ── Class way (exactly equivalent under the hood) ────────────────────
class User {
  constructor(name, age) {   // called automatically when you use 'new User(...)'
    this.name = name;
    this.age  = age;
  }

  // Instance methods — added to User.prototype automatically, no manual wiring
  greet() { return \`Hi, I'm \${this.name}\`; }
  isAdult() { return this.age >= 18; }
}

const alice = new User("Alice", 30);
alice.greet();     // "Hi, I'm Alice"
alice.isAdult();   // true

// ── Proof that classes compile to prototypes ────────────────────────
typeof User;                                       // "function" — classes ARE functions
Object.getPrototypeOf(alice) === User.prototype;   // true — same mechanism as Day 8`,
      },
      keyTakeaways: [
        { en: "A `class` is syntactic sugar over a constructor function plus its `.prototype` — under the hood it's exactly the same mechanism covered on Day 8.", np: "`class` constructor function र त्यसको `.prototype` माथिको syntactic sugar हो — भित्री रूपमा Day 8 को उही mechanism हो।", jp: "クラスはコンストラクタ関数とその`.prototype`の上の糖衣構文。内部的にはDay 8で学んだのと同じ仕組み。" },
        { en: "`typeof MyClass` is `\"function\"`, and instances still relate to the class through `Object.getPrototypeOf()`, exactly like the constructor-function pattern.", np: "`typeof MyClass` `\"function\"` हो, र instances अझै `Object.getPrototypeOf()` मार्फत class सँग सम्बन्धित हुन्छन्, constructor-function pattern जस्तै।", jp: "`typeof MyClass`は`\"function\"`。インスタンスは`Object.getPrototypeOf()`を通じてクラスと関連する。コンストラクタ関数パターンと同じ。" },
        { en: "Methods written inside a class body are automatically placed on the class's `.prototype` — you never have to write `ClassName.prototype.method = ...` by hand.", np: "Class body भित्र लेखिएका methods automatically class को `.prototype` मा जान्छन् — `ClassName.prototype.method = ...` manually लेख्नु पर्दैन।", jp: "クラス本体内に書かれたメソッドは自動的にクラスの`.prototype`に配置される。`ClassName.prototype.method = ...`を手動で書く必要はない。" },
      ],
      commonMistakes: [
        { en: "Believing classes are a fundamentally different, \"real\" OOP mechanism unrelated to prototypes — they are the same mechanism with nicer syntax on top.", np: "Classes prototypes सँग सम्बन्ध नभएको fundamentally फरक, 'real' OOP mechanism हो भन्ने विश्वास गर्नु — यिनी उही mechanism हुन्, राम्रो syntax मात्र थपिएको।", jp: "クラスはプロトタイプとは無関係な根本的に異なる「本物の」OOP機構だと信じること。実際は同じ機構の上に見やすい構文を乗せたもの。" },
        { en: "Trying to call a class as a plain function without `new` (`User(\"Alice\")`) — class constructors throw a TypeError if called this way, unlike ordinary constructor functions.", np: "`new` बिना class लाई plain function जस्तै call गर्ने प्रयास गर्नु (`User(\"Alice\")`) — यसरी call गर्दा class constructors ले TypeError throw गर्छन्।", jp: "`new`なしでクラスをプレーンな関数として呼び出そうとすること（`User(\"Alice\")`）。クラスコンストラクタはこのように呼ばれるとTypeErrorをスローする。" },
        { en: "Forgetting that methods inside a class body are non-enumerable by default (unlike properties assigned with `obj.method = fn`), which can surprise code relying on `Object.keys()` or `for...in`.", np: "Class body भित्रका methods default रूपमा non-enumerable हुन्छन् भन्ने बिर्सनु (`obj.method = fn` जस्तो होइन), `Object.keys()` वा `for...in` मा भर पर्ने code अचम्मित हुन सक्छ।", jp: "クラス本体内のメソッドがデフォルトで列挙不可であることを忘れること（`obj.method = fn`とは異なる）。`Object.keys()`や`for...in`に依存するコードを驚かせることがある。" },
      ],
      quiz: [
        {
          question: { en: "What does `typeof MyClass` return for a class declared with `class MyClass {}`?", np: "`class MyClass {}` को लागि `typeof MyClass` ले के फर्काउँछ?", jp: "`class MyClass {}`で宣言されたクラスの`typeof MyClass`は？" },
          options: [
            { en: "`\"class\"`", np: "`\"class\"`", jp: "`\"class\"`" },
            { en: "`\"function\"`", np: "`\"function\"`", jp: "`\"function\"`" },
          ],
          correctIndex: 1,
          explanation: { en: "Classes compile to constructor functions, so JavaScript reports their type as function, not a special 'class' type.", np: "Classes constructor functions मा compile हुन्छन्, त्यसैले JS ले तिनको type function नै report गर्छ, special 'class' type होइन।", jp: "クラスはコンストラクタ関数にコンパイルされるため、JSは特別な'class'型ではなくfunctionとして型を報告する。" },
        },
        {
          question: { en: "Where do methods written inside a class body end up?", np: "Class body भित्र लेखिएका methods कहाँ जान्छन्?", jp: "クラス本体内に書かれたメソッドはどこに配置される？" },
          options: [
            { en: "As own properties on each instance", np: "हरेक instance मा own properties को रूपमा", jp: "各インスタンス自身のプロパティとして" },
            { en: "On the class's `.prototype`, shared by every instance", np: "Class को `.prototype` मा, हरेक instance ले share गर्ने", jp: "クラスの`.prototype`に、すべてのインスタンスで共有される" },
          ],
          correctIndex: 1,
          explanation: { en: "This is identical to the constructor-function pattern — instance methods live once on the shared prototype.", np: "यो constructor-function pattern सँग identical छ — instance methods shared prototype मा एकपल्ट रहन्छन्।", jp: "これはコンストラクタ関数パターンと同一。インスタンスメソッドは共有プロトタイプに一度だけ存在する。" },
        },
        {
          question: { en: "What happens if you call a class as a plain function, without `new`?", np: "Class लाई `new` बिना plain function जस्तै call गर्दा के हुन्छ?", jp: "`new`なしでクラスをプレーンな関数として呼び出すとどうなる？" },
          options: [
            { en: "It throws a TypeError", np: "यसले TypeError throw गर्छ", jp: "TypeErrorをスローする" },
            { en: "It runs normally, just without setting up `this` correctly", np: "यो normally चल्छ, `this` सहि setup नभएको बाहेक", jp: "正常に実行されるが、thisが正しく設定されないだけ" },
          ],
          correctIndex: 0,
          explanation: { en: "Unlike constructor functions, class constructors explicitly require the 'new' keyword and throw if it's missing.", np: "Constructor functions फरक, class constructors ले explicitly 'new' keyword चाहिन्छ र नभएमा throw गर्छ।", jp: "コンストラクタ関数とは異なり、クラスのコンストラクタは明示的にnewキーワードを要求し、なければスローする。" },
        },
      ],
    },
    {
      id: "inheritance-extends-super",
      title: { en: "Inheritance with extends and super", np: "extends र super सँग Inheritance", jp: "extendsとsuperによる継承" },
      durationMinutes: 9,
      explanation: {
        en: "`class Dog extends Animal` sets up the entire prototype chain from Day 8 in one line — no more manual `Object.create()` or fixing `.constructor`. Inside `Dog`'s constructor, `super(name)` calls `Animal`'s constructor, and it MUST be called before you touch `this` anywhere in the constructor, or JavaScript throws a `ReferenceError`.\n\n`super.method()` (without `new` or parentheses after `super`) lets a child class call the PARENT's version of a method it has overridden — useful when you want to extend the parent's behaviour rather than fully replace it. `instanceof` naturally reflects the whole chain: a `Dog` instance is `instanceof Dog` AND `instanceof Animal`.",
        np: "`class Dog extends Animal` ले एक लाइनमा पूरै prototype chain सेटअप गर्छ। `super(name)` ले parent constructor call गर्छ, र `this` touch गर्नुअघि call गर्नैपर्छ। `super.method()` ले parent को overridden method call गर्छ।",
        jp: "`class Dog extends Animal`は1行でプロトタイプチェーン全体を設定する。`super(name)`は親のコンストラクタを呼び、thisに触れる前に必ず呼ぶ必要がある。`super.method()`は親のオーバーライドされたメソッドを呼ぶ。",
      },
      diagram: `class Dog extends Animal {
  constructor(name, breed) {
    super(name);         ← MUST run before using 'this' — calls Animal's constructor
    this.breed = breed;
  }
  speak() { return \`\${this.name} barks!\`; }        ← overrides Animal.speak
  full()  { return super.speak() + " " + this.speak(); }  ← calls PARENT's version too
}

rex = new Dog("Rex", "Lab")
rex instanceof Dog     → true
rex instanceof Animal  → true   ← chain includes Animal.prototype`,
      codeExample: {
        title: { en: "extends, super(), and overriding methods", np: "extends, super(), method override", jp: "extends・super()・メソッドのオーバーライド" },
        code: `class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a sound\`; }
  toString() { return \`Animal(\${this.name})\`; }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);          // MUST call super() before accessing 'this'
    this.breed = breed;
  }

  // Override the parent method
  speak() { return \`\${this.name} barks!\`; }

  // Call the parent's version via super.method()
  fullDescription() { return \`\${super.speak()} — specifically, \${this.name} barks!\`; }
}

const rex = new Dog("Rex", "Labrador");
rex.speak();            // "Rex barks!" — overridden method wins
rex.fullDescription();  // "Rex makes a sound — specifically, Rex barks!"
rex.toString();         // "Animal(Rex)" — inherited unchanged from Animal

rex instanceof Dog;     // true
rex instanceof Animal;  // true — Dog's chain includes Animal.prototype

// ── Abstract-like base class ────────────────────────────────────────
class Shape {
  constructor(color) {
    if (new.target === Shape) throw new Error("Shape is abstract — use a subclass");
    this.color = color;
  }
  area() { throw new Error("area() must be implemented"); }
}
class Circle extends Shape {
  constructor(color, radius) { super(color); this.radius = radius; }
  area() { return Math.PI * this.radius ** 2; }
}
new Circle("red", 5).area();  // ~78.54
// new Shape("blue");          // Error: Shape is abstract`,
      },
      keyTakeaways: [
        { en: "`extends` sets up the full prototype chain in one keyword — no more manually calling `Object.create()` and fixing `.constructor` like on Day 8.", np: "`extends` ले एक keyword मा पूरै prototype chain सेटअप गर्छ — Day 8 जस्तो manually `Object.create()` र `.constructor` fix गर्नु पर्दैन।", jp: "`extends`は1つのキーワードでプロトタイプチェーン全体を設定する。Day 8のように手動で`Object.create()`や`.constructor`修正は不要。" },
        { en: "In a derived class's constructor, `super(...)` calls the parent's constructor and MUST run before any use of `this` — accessing `this` before it throws a ReferenceError.", np: "Derived class को constructor मा `super(...)` ले parent constructor call गर्छ र `this` प्रयोग गर्नुअघि चलाउनु पर्छ — नत्र ReferenceError।", jp: "派生クラスのコンストラクタでは`super(...)`が親のコンストラクタを呼び、thisを使う前に実行する必要がある。それ以前にthisにアクセスするとReferenceErrorをスローする。" },
        { en: "`super.method()` calls the parent's version of an overridden method, letting the child extend rather than fully replace the parent's behaviour.", np: "`super.method()` ले overridden method को parent version call गर्छ, child ले parent को behaviour पूर्ण रूपमा replace नगरी extend गर्न मिल्छ।", jp: "`super.method()`はオーバーライドされたメソッドの親バージョンを呼び、子が親の動作を完全に置き換えずに拡張できるようにする。" },
      ],
      commonMistakes: [
        { en: "Trying to use `this` in a derived class's constructor before calling `super(...)` — this always throws a ReferenceError.", np: "Derived class को constructor मा `super(...)` call गर्नुअघि `this` प्रयोग गर्ने प्रयास गर्नु — यसले सधैं ReferenceError throw गर्छ।", jp: "`super(...)`を呼ぶ前に派生クラスのコンストラクタでthisを使おうとすること。これは常にReferenceErrorをスローする。" },
        { en: "Forgetting to call `super(...)` at all in a derived class's constructor when the parent constructor also needs to run.", np: "Parent constructor पनि चलाउनुपर्दा derived class को constructor मा `super(...)` call नै गर्न बिर्सनु।", jp: "親コンストラクタも実行する必要がある場合に、派生クラスのコンストラクタで`super(...)`を呼ぶこと自体を忘れること。" },
        { en: "Calling `super.method()` outside of an overriding method or misunderstanding it as invoking the parent CONSTRUCTOR rather than a parent method.", np: "`super.method()` लाई overriding method बाहिर call गर्नु वा parent CONSTRUCTOR call गरेको ठान्नु, parent method होइन।", jp: "オーバーライドメソッドの外で`super.method()`を呼ぶこと、または親のメソッドではなく親のコンストラクタを呼び出すものと誤解すること。" },
      ],
      quiz: [
        {
          question: { en: "What must happen before you can use `this` inside a derived class's constructor?", np: "Derived class को constructor भित्र `this` प्रयोग गर्नुअघि के हुनुपर्छ?", jp: "派生クラスのコンストラクタ内でthisを使う前に何が必要？" },
          options: [
            { en: "Nothing special — `this` is always available", np: "विशेष केही होइन — `this` सधैं available हुन्छ", jp: "特別なことは何もない — thisは常に利用可能" },
            { en: "`super(...)` must be called first", np: "पहिले `super(...)` call हुनुपर्छ", jp: "先に`super(...)`を呼ぶ必要がある" },
          ],
          correctIndex: 1,
          explanation: { en: "The parent constructor sets up 'this' — accessing it beforehand throws a ReferenceError.", np: "Parent constructor ले 'this' सेटअप गर्छ — अगावै access गर्दा ReferenceError हुन्छ।", jp: "親コンストラクタがthisを設定する。それ以前にアクセスするとReferenceErrorをスローする。" },
        },
        {
          question: { en: "What does `super.speak()` do inside an overriding `speak()` method?", np: "Overriding `speak()` method भित्र `super.speak()` ले के गर्छ?", jp: "オーバーライドする`speak()`メソッド内で`super.speak()`は何をする？" },
          options: [
            { en: "Calls the parent class's version of `speak()`", np: "Parent class को `speak()` version call गर्छ", jp: "親クラスの`speak()`のバージョンを呼ぶ" },
            { en: "Calls `speak()` on every instance created so far", np: "अहिलेसम्म बनेका सबै instances मा `speak()` call गर्छ", jp: "今まで作られたすべてのインスタンスでspeak()を呼ぶ" },
          ],
          correctIndex: 0,
          explanation: { en: "super.method() reaches up one level in the prototype chain to invoke the parent's implementation.", np: "super.method() ले prototype chain मा एक level माथि गएर parent को implementation call गर्छ।", jp: "super.method()はプロトタイプチェーンを1段上って親の実装を呼び出す。" },
        },
        {
          question: { en: "If `Dog extends Animal`, is a `Dog` instance `instanceof Animal`?", np: "`Dog extends Animal` भए `Dog` instance `instanceof Animal` हो?", jp: "`Dog extends Animal`の場合、Dogインスタンスはinstanceof Animalか？" },
          options: [
            { en: "Yes — extends wires Dog's prototype chain to include Animal.prototype", np: "हो — extends ले Dog को prototype chain मा Animal.prototype समावेश गराउँछ", jp: "はい — extendsはDogのプロトタイプチェーンにAnimal.prototypeを含める" },
            { en: "No — instanceof only recognises the direct class, not ancestors", np: "होइन — instanceof ले direct class मात्र चिन्छ, ancestors होइन", jp: "いいえ — instanceofは直接のクラスのみを認識し、祖先は認識しない" },
          ],
          correctIndex: 0,
          explanation: { en: "instanceof checks the entire prototype chain, and extends puts the parent's prototype into that chain.", np: "instanceof ले पूरै prototype chain check गर्छ, र extends ले parent को prototype त्यो chain मा राख्छ।", jp: "instanceofはプロトタイプチェーン全体を確認し、extendsはそのチェーンに親のプロトタイプを入れる。" },
        },
      ],
    },
    {
      id: "static-getters-private",
      title: { en: "Static Methods, Getters/Setters & Private Fields", np: "Static Methods, Getters/Setters, Private Fields", jp: "staticメソッド・getter/setter・プライベートフィールド" },
      durationMinutes: 9,
      explanation: {
        en: "Classes add several ES2022+ features in a syntax that reads naturally:\n\n• <b>Private fields (#name)</b> — declared with a `#` prefix, accessible ONLY from inside the class body. This is enforced at the language level, not just a naming convention like `_name` — code outside the class gets a `SyntaxError` for even trying `obj.#balance`.\n• <b>Getters/setters (`get`/`set`)</b> — same idea as Day 8's `defineProperty`, but with cleaner class syntax; accessed like plain properties, no `()`.\n• <b>Static methods</b> — belong to the CLASS itself (`ClassName.method()`), not to instances; ideal for factory functions and utilities related to the class as a whole.\n\nOne more subtlety: unlike function declarations, <b>classes are not hoisted</b> the same way — they exist in the Temporal Dead Zone (Day 3) until their declaration line runs, so you cannot use a class before it's declared.",
        np: "Private fields (#name) class body भित्र मात्र accessible छन् — language level मा enforce हुन्छ। Getters/setters property जस्तै access हुन्छ। Static methods class को हो, instances को होइन। Classes hoist हुँदैनन् — TDZ मा रहन्छन्।",
        jp: "プライベートフィールド(#name)はクラス本体内のみアクセス可能で言語レベルで強制される。getter/setterはプロパティのようにアクセスする。staticメソッドはクラス自体に属す。クラスはホイストされずTDZにある。",
      },
      diagram: `class BankAccount {
  #balance;                      ← private, only usable inside THIS class

  get balance() { return this.#balance; }        ← read like a property, no ()
  set nickname(v) { ...validate... }              ← write like a property

  static createSavingsAccount(owner) { ... }      ← called as BankAccount.createSavingsAccount()
}

account.balance;              ✅ getter — reads #balance
account.#balance;              ❌ SyntaxError — outside the class body
BankAccount.createSavingsAccount("Bob");   ← static — on the CLASS, not an instance`,
      codeExample: {
        title: { en: "Private fields, getters/setters, and static methods together", np: "Private fields, getters/setters, static methods", jp: "プライベートフィールド・getter/setter・staticメソッド" },
        code: `class BankAccount {
  // ── Private fields (#) — only accessible inside the class ─────────────
  #balance;
  #owner;

  constructor(owner, initialBalance = 0) {
    this.#owner   = owner;
    this.#balance = initialBalance;
  }

  // ── Getter — accessed like a property, not a method call ───────────────
  get balance() { return this.#balance; }

  // ── Setter — validates before assignment ──────────────────────────────
  set nickname(value) {
    if (typeof value !== "string" || value.length < 2) {
      throw new Error("Nickname must be at least 2 characters");
    }
    this.#owner = value;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.#balance += amount;
    return this;  // return 'this' to allow method chaining
  }

  // ── Static methods — called on the class, not instances ───────────────
  static createSavingsAccount(owner) { return new BankAccount(owner, 0); }
  static isValidAmount(amount) { return typeof amount === "number" && amount > 0; }
}

const account = new BankAccount("Alice", 1000);
account.balance;              // 1000 — getter, no ()
account.deposit(500).deposit(200);  // method chaining (each returns 'this')
account.balance;              // 1700

// account.#balance;           // SyntaxError: Private field '#balance' must be declared

BankAccount.isValidAmount(100);            // true — called on the class
const savings = BankAccount.createSavingsAccount("Bob");`,
      },
      keyTakeaways: [
        { en: "Private fields (`#name`) are enforced by the language itself — accessing `obj.#field` from outside the class always throws a SyntaxError, unlike a `_name` naming convention.", np: "Private fields (`#name`) language ले नै enforce गर्छ — class बाहिरबाट `obj.#field` access गर्दा सधैं SyntaxError, `_name` convention जस्तो होइन।", jp: "プライベートフィールド（`#name`）は言語自体によって強制される。クラス外から`obj.#field`にアクセスすると常にSyntaxErrorをスローする。`_name`という命名規則とは異なる。" },
        { en: "Static methods (`static method()`) belong to the class itself, called as `ClassName.method()` — not on instances — and are ideal for factory functions.", np: "Static methods (`static method()`) class को नै हो, `ClassName.method()` को रूपमा call हुन्छ — instances मा होइन — factory functions का लागि उत्तम।", jp: "staticメソッド（`static method()`）はクラス自体に属し、`ClassName.method()`として呼ばれる（インスタンスではない）。ファクトリ関数に最適。" },
        { en: "Classes are not hoisted like function declarations — they remain in the Temporal Dead Zone until their declaration executes, so using one before its declaration throws.", np: "Classes function declarations जस्तो hoist हुँदैनन् — declaration नचलुन्जेल Temporal Dead Zone मा रहन्छन्, declaration अगाडि प्रयोग गर्दा throw हुन्छ।", jp: "クラスは関数宣言のようにホイストされない。宣言が実行されるまでTemporal Dead Zoneに留まり、宣言前に使うとスローする。" },
      ],
      commonMistakes: [
        { en: "Trying to access `obj.#field` from outside the class, or copy-pasting a `#field` name between unrelated classes expecting it to work the same way.", np: "Class बाहिरबाट `obj.#field` access गर्ने प्रयास गर्नु, वा असम्बन्धित classes बीच `#field` नाम copy-paste गरेर उस्तै काम गर्छ भन्ने आशा गर्नु।", jp: "クラス外から`obj.#field`にアクセスしようとすること、または無関係なクラス間で`#field`という名前をコピーして同じように動作すると期待すること。" },
        { en: "Calling a static method on an instance (`account.createSavingsAccount()`) instead of on the class (`BankAccount.createSavingsAccount()`) — instances don't have static methods on them.", np: "Static method लाई instance मा call गर्नु (`account.createSavingsAccount()`) class मा नभई (`BankAccount.createSavingsAccount()`) — instances मा static methods हुँदैनन्।", jp: "staticメソッドをクラス（`BankAccount.createSavingsAccount()`）ではなくインスタンス（`account.createSavingsAccount()`）で呼ぶこと。インスタンスにはstaticメソッドがない。" },
        { en: "Referencing a class before its declaration line in the same module scope, expecting hoisting to work like it does for `function` declarations.", np: "Function declarations जस्तै hoisting काम गर्छ भनी आशा गरेर, class को declaration अगाडि नै त्यसलाई reference गर्नु।", jp: "関数宣言のようにホイストが機能すると期待して、宣言行より前に同じモジュールスコープでクラスを参照すること。" },
      ],
      quiz: [
        {
          question: { en: "What happens if code outside the class tries to access `obj.#balance`?", np: "Class बाहिरको code ले `obj.#balance` access गर्ने प्रयास गर्दा के हुन्छ?", jp: "クラス外のコードが`obj.#balance`にアクセスしようとするとどうなる？" },
          options: [
            { en: "It returns `undefined`", np: "यसले `undefined` फर्काउँछ", jp: "`undefined`を返す" },
            { en: "It throws a SyntaxError — private fields are enforced by the language", np: "यसले SyntaxError throw गर्छ — private fields language ले enforce गर्छ", jp: "SyntaxErrorをスローする — プライベートフィールドは言語によって強制される" },
          ],
          correctIndex: 1,
          explanation: { en: "Unlike an underscore convention, # is a real language feature that makes external access a parse-time error.", np: "Underscore convention भन्दा फरक, # एक real language feature हो जसले external access लाई parse-time error बनाउँछ।", jp: "アンダースコアの慣習とは異なり、#は本物の言語機能であり、外部アクセスを解析時エラーにする。" },
        },
        {
          question: { en: "How do you call a static method named `create` on a class `Widget`?", np: "`Widget` class मा `create` नामको static method कसरी call गर्ने?", jp: "`Widget`クラスの`create`という静的メソッドはどうやって呼ぶ？" },
          options: [
            { en: "`new Widget().create()`", np: "`new Widget().create()`", jp: "`new Widget().create()`" },
            { en: "`Widget.create()`", np: "`Widget.create()`", jp: "`Widget.create()`" },
          ],
          correctIndex: 1,
          explanation: { en: "Static methods belong to the class itself, not to any instance, so they're called directly on the class name.", np: "Static methods class को नै हुन्, कुनै instance को होइन, त्यसैले class name मा सिधै call हुन्छ।", jp: "staticメソッドはインスタンスではなくクラス自体に属するため、クラス名で直接呼ばれる。" },
        },
        {
          question: { en: "Can you reference a `class` before its declaration line in the same scope, the way you can with a hoisted `function` declaration?", np: "Hoisted `function` declaration जस्तै same scope मा `class` लाई declaration अगाडि reference गर्न सकिन्छ?", jp: "ホイストされた関数宣言のように、同じスコープで宣言行より前にクラスを参照できる？" },
          options: [
            { en: "No — classes sit in the Temporal Dead Zone until declared", np: "होइन — classes declared नभएसम्म Temporal Dead Zone मा रहन्छन्", jp: "いいえ — クラスは宣言されるまでTemporal Dead Zoneにある" },
            { en: "Yes, classes are hoisted exactly like functions", np: "हो, classes functions जस्तै exactly hoist हुन्छन्", jp: "はい、クラスは関数と同じようにホイストされる" },
          ],
          correctIndex: 0,
          explanation: { en: "Classes behave like let/const declarations for hoisting purposes — accessible only after the declaration executes.", np: "Hoisting का लागि classes let/const declarations जस्तै behave गर्छन् — declaration execute भएपछि मात्र accessible।", jp: "ホイスティングの観点ではクラスはlet/const宣言のように動作する。宣言が実行された後のみアクセス可能。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Are ES6 classes a fundamentally different mechanism from prototypes?", np: "ES6 classes prototypes भन्दा fundamentally फरक mechanism हो?", jp: "ES6クラスはプロトタイプとは根本的に異なる機構か？" },
      options: [{ en: "No — classes compile to the same constructor+prototype mechanism", np: "होइन — classes उही constructor+prototype mechanism मा compile हुन्छन्", jp: "いいえ — クラスは同じコンストラクタ+プロトタイプ機構にコンパイルされる" }, { en: "Yes — classes use a completely separate inheritance model", np: "हो — classes ले पूर्ण फरक inheritance model प्रयोग गर्छन्", jp: "はい — クラスは完全に別の継承モデルを使う" }],
      correctIndex: 0,
      explanation: { en: "typeof a class is 'function', and instances relate to it via Object.getPrototypeOf, exactly like Day 8's pattern.", np: "Class को typeof 'function' हो, र instances Object.getPrototypeOf मार्फत सम्बन्धित हुन्छन्, Day 8 जस्तै।", jp: "クラスのtypeofは'function'であり、インスタンスはObject.getPrototypeOfを通じて関連する。Day 8のパターンと同じ。" },
    },
    {
      question: { en: "What must you call before using `this` in a derived class's constructor?", np: "Derived class को constructor मा `this` प्रयोग गर्नुअघि के call गर्नुपर्छ?", jp: "派生クラスのコンストラクタでthisを使う前に何を呼ぶ必要がある？" },
      options: [{ en: "`super(...)`", np: "`super(...)`", jp: "`super(...)`" }, { en: "Nothing — `this` is available immediately", np: "केही होइन — `this` तुरुन्तै available हुन्छ", jp: "何も — thisは即座に利用可能" }],
      correctIndex: 0,
      explanation: { en: "super() runs the parent constructor which sets up this; skipping it throws.", np: "super() ले parent constructor चलाउँछ जसले this सेटअप गर्छ; skip गर्दा throw हुन्छ।", jp: "super()は親コンストラクタを実行してthisを設定する。スキップするとスローする。" },
    },
    {
      question: { en: "What does `super.speak()` do inside an overridden `speak()` method?", np: "Overridden `speak()` method भित्र `super.speak()` ले के गर्छ?", jp: "オーバーライドされたspeak()メソッド内でsuper.speak()は何をする？" },
      options: [{ en: "Calls the parent class's implementation of speak()", np: "Parent class को speak() implementation call गर्छ", jp: "親クラスのspeak()の実装を呼ぶ" }, { en: "Recursively calls the current method forever", np: "Current method लाई recursively सधैं call गर्छ", jp: "現在のメソッドを再帰的に永遠に呼ぶ" }],
      correctIndex: 0,
      explanation: { en: "super.method() reaches one level up the prototype chain to the parent's version.", np: "super.method() ले prototype chain मा एक level माथि parent को version सम्म पुग्छ।", jp: "super.method()はプロトタイプチェーンを1段上って親のバージョンに到達する。" },
    },
    {
      question: { en: "Does `Dog extends Animal` make a `Dog` instance `instanceof Animal`?", np: "`Dog extends Animal` ले `Dog` instance `instanceof Animal` बनाउँछ?", jp: "`Dog extends Animal`はDogインスタンスをinstanceof Animalにする？" },
      options: [{ en: "Yes", np: "हो", jp: "はい" }, { en: "No — instanceof only checks the immediate class", np: "होइन — instanceof ले immediate class मात्र check गर्छ", jp: "いいえ — instanceofは直近のクラスのみを確認する" }],
      correctIndex: 0,
      explanation: { en: "extends puts Animal.prototype into Dog's prototype chain, so instanceof recognises both.", np: "extends ले Animal.prototype लाई Dog को prototype chain मा राख्छ, त्यसैले instanceof ले दुवै चिन्छ।", jp: "extendsはAnimal.prototypeをDogのプロトタイプチェーンに入れるため、instanceofは両方を認識する。" },
    },
    {
      question: { en: "How do you access a property defined with a `get` keyword inside a class?", np: "Class भित्र `get` keyword सँग define गरिएको property कसरी access गर्ने?", jp: "クラス内でgetキーワードで定義されたプロパティはどうやってアクセスする？" },
      options: [{ en: "Like a normal property, no parentheses", np: "Normal property जस्तै, parentheses बिना", jp: "通常のプロパティのように括弧なし" }, { en: "As a method call with parentheses", np: "Parentheses सहित method call को रूपमा", jp: "括弧付きのメソッド呼び出しとして" }],
      correctIndex: 0,
      explanation: { en: "Getters are read transparently, exactly like Day 8's defineProperty-based getters.", np: "Getters transparently पढिन्छन्, Day 8 को defineProperty-based getters जस्तै।", jp: "getterは透過的に読まれる。Day 8のdefinePropertyベースのgetterと同じ。" },
    },
    {
      question: { en: "What happens if code outside a class tries to access a `#privateField`?", np: "Class बाहिरको code ले `#privateField` access गर्ने प्रयास गर्दा के हुन्छ?", jp: "クラス外のコードが`#privateField`にアクセスしようとするとどうなる？" },
      options: [{ en: "SyntaxError — enforced at the language level", np: "SyntaxError — language level मा enforce", jp: "SyntaxError — 言語レベルで強制される" }, { en: "It just returns undefined", np: "यसले केवल undefined फर्काउँछ", jp: "単にundefinedを返す" }],
      correctIndex: 0,
      explanation: { en: "Private fields are a real language feature, not a naming convention like _field.", np: "Private fields real language feature हो, _field जस्तो naming convention होइन।", jp: "プライベートフィールドは_fieldのような命名規則ではなく本物の言語機能。" },
    },
    {
      question: { en: "How do you call a static method `Widget.build()`?", np: "Static method `Widget.build()` कसरी call गर्ने?", jp: "静的メソッド`Widget.build()`はどうやって呼ぶ？" },
      options: [{ en: "Directly on the class: `Widget.build()`", np: "सिधै class मा: `Widget.build()`", jp: "クラスで直接: `Widget.build()`" }, { en: "On an instance: `new Widget().build()`", np: "Instance मा: `new Widget().build()`", jp: "インスタンスで: `new Widget().build()`" }],
      correctIndex: 0,
      explanation: { en: "Static methods live on the class itself, not on instances.", np: "Static methods class को नै हो, instances को होइन।", jp: "staticメソッドはインスタンスではなくクラス自体にある。" },
    },
    {
      question: { en: "Are classes hoisted the same way function declarations are?", np: "Classes function declarations जस्तै hoist हुन्छन्?", jp: "クラスは関数宣言のようにホイストされる？" },
      options: [{ en: "No — they remain in the Temporal Dead Zone until declared", np: "होइन — declared नभएसम्म Temporal Dead Zone मा रहन्छन्", jp: "いいえ — 宣言されるまでTemporal Dead Zoneに留まる" }, { en: "Yes, fully hoisted and usable before declaration", np: "हो, पूर्ण hoisted र declaration अघि प्रयोग योग्य", jp: "はい、完全にホイストされ宣言前でも使える" }],
      correctIndex: 0,
      explanation: { en: "Classes behave like let/const for hoisting, unlike function declarations.", np: "Function declarations भन्दा फरक, hoisting का लागि classes let/const जस्तै behave गर्छन्।", jp: "関数宣言とは異なり、クラスはホイスティングの観点でlet/constのように動作する。" },
    },
    {
      question: { en: "What is a typical use case for a static method on a class?", np: "Class मा static method को typical use case के हो?", jp: "クラスの静的メソッドの典型的な使用例は？" },
      options: [{ en: "A factory function related to the class as a whole, like `BankAccount.createSavingsAccount()`", np: "पूरै class सँग सम्बन्धित factory function, जस्तै `BankAccount.createSavingsAccount()`", jp: "`BankAccount.createSavingsAccount()`のようなクラス全体に関連するファクトリ関数" }, { en: "Storing per-instance private state", np: "Per-instance private state store गर्नु", jp: "インスタンスごとのプライベート状態を保存すること" }],
      correctIndex: 0,
      explanation: { en: "Static methods are for class-level utilities and factories, not per-instance state (that's what private fields are for).", np: "Static methods class-level utilities र factories का लागि हो, per-instance state का लागि होइन (त्यो private fields को काम हो)।", jp: "staticメソッドはクラスレベルのユーティリティやファクトリのためであり、インスタンスごとの状態のためではない（それはプライベートフィールドの役割）。" },
    },
  ],
};
