import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_10_LESSONS: JsLessonDay = {
  day: 10,
  title: { en: "ES6 Classes — Inheritance, Static & Private Fields", np: "ES6 Classes — Inheritance, Static, Private", jp: "ES6クラス・継承・static・プライベート" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "class-basics",
      title: { en: "Class Basics", np: "Class Basics", jp: "クラスの基本" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>class</b> is a blueprint for creating objects. `class User {}` defines how `User` objects should behave; it does not create an object itself.\n\nJavaScript classes were introduced in <b>ES6</b>, but JavaScript still uses <b>prototype-based inheritance</b> underneath. Classes are essentially a cleaner syntax over the existing constructor-function and prototype system.\n\n```javascript\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n\n  greet() {\n    return `Hello, ${this.name}`;\n  }\n}\n\nconst user = new User(\"John\");\n\nconsole.log(user.name);    // \"John\"\nconsole.log(user.greet()); // \"Hello, John\"\n```\n\nWhen `new User(\"John\")` runs:\n\n1. A new object is created.\n2. Its prototype is linked to `User.prototype`.\n3. `constructor()` runs with `this` referring to the new object.\n4. `this.name = name` adds the property.\n5. The new object is returned.\n\n---\n\n### 1. Basic class\n\n```javascript\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n\n  greet() {\n    return `Hi, ${this.name}`;\n  }\n}\n\nconst user = new User(\"Rajan\");\n\nconsole.log(user.greet());\n// Hi, Rajan\n```\n\n---\n\n### 2. Multiple instances share the same method\n\n```javascript\nconst user1 = new User(\"Rajan\");\nconst user2 = new User(\"John\");\n\nconsole.log(user1.greet());\nconsole.log(user2.greet());\n\nconsole.log(user1.greet === user2.greet);\n// true\n```\n\nBoth objects use the <b>same</b> `greet()` method from `User.prototype`.\n\nSo creating 1,000 users does <b>not</b> create 1,000 copies of `greet()`.\n\n```text\nname  → stored on each instance\ngreet → shared through User.prototype\n```\n\n---\n\n### 3. Class inheritance\n\n```javascript\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n\n  greet() {\n    return `Hi ${this.name}`;\n  }\n}\n\nclass Admin extends User {\n  deleteUser() {\n    return \"User deleted\";\n  }\n}\n\nconst admin = new Admin(\"Rajan\");\n\nconsole.log(admin.greet());\n// Hi Rajan\n\nconsole.log(admin.deleteUser());\n// User deleted\n```\n\nThe lookup works roughly like:\n\n```text\nadmin\n  ↓\nAdmin.prototype\n  ↓\nUser.prototype\n  ↓\nObject.prototype\n  ↓\nnull\n```",
        np: "<b>Class</b> object बनाउने खाका हो। `class User {}` ले `User` object कस्तो व्यवहार गर्नुपर्छ परिभाषित गर्छ; यसले आफैं object बनाउँदैन।\n\nJavaScript का class <b>ES6</b> मा आए, तर JavaScript ले भित्री रूपमा अझै <b>prototype-आधारित inheritance</b> प्रयोग गर्छ। Class मूलतः अवस्थित constructor-function र prototype प्रणालीमाथिको सफा syntax हो।\n\n```javascript\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n\n  greet() {\n    return `Hello, ${this.name}`;\n  }\n}\n\nconst user = new User(\"John\");\n\nconsole.log(user.name);    // \"John\"\nconsole.log(user.greet()); // \"Hello, John\"\n```\n\n`new User(\"John\")` चल्दा:\n\n1. नयाँ object बन्छ।\n2. यसको prototype `User.prototype` सँग जोडिन्छ।\n3. `constructor()` चल्छ, `this` ले नयाँ object जनाउँछ।\n4. `this.name = name` ले property थप्छ।\n5. नयाँ object फर्काइन्छ।\n\n---\n\n### 1. आधारभूत class\n\n```javascript\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n\n  greet() {\n    return `Hi, ${this.name}`;\n  }\n}\n\nconst user = new User(\"Rajan\");\n\nconsole.log(user.greet());\n// Hi, Rajan\n```\n\n---\n\n### 2. धेरै instance ले उही method बाँड्छन्\n\n```javascript\nconst user1 = new User(\"Rajan\");\nconst user2 = new User(\"John\");\n\nconsole.log(user1.greet());\nconsole.log(user2.greet());\n\nconsole.log(user1.greet === user2.greet);\n// true\n```\n\nदुबै object ले `User.prototype` को <b>उही</b> `greet()` method प्रयोग गर्छन्।\n\nत्यसैले 1,000 user बनाउँदा `greet()` का 1,000 copy <b>बन्दैनन्</b>।\n\n```text\nname  → stored on each instance\ngreet → shared through User.prototype\n```\n\n---\n\n### 3. Class inheritance\n\n```javascript\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n\n  greet() {\n    return `Hi ${this.name}`;\n  }\n}\n\nclass Admin extends User {\n  deleteUser() {\n    return \"User deleted\";\n  }\n}\n\nconst admin = new Admin(\"Rajan\");\n\nconsole.log(admin.greet());\n// Hi Rajan\n\nconsole.log(admin.deleteUser());\n// User deleted\n```\n\nखोजी मोटामोटी यसरी हुन्छ:\n\n```text\nadmin\n  ↓\nAdmin.prototype\n  ↓\nUser.prototype\n  ↓\nObject.prototype\n  ↓\nnull\n```",
        jp: "<b>クラス</b>はオブジェクトを作るための設計図です。`class User {}` は `User` オブジェクトの振る舞いを定義するだけで、オブジェクト自体は作りません。\n\nJavaScriptのクラスは<b>ES6</b>で導入されましたが、内部では今も<b>プロトタイプベースの継承</b>を使っています。クラスは既存のコンストラクタ関数とプロトタイプの仕組みに対する、より読みやすい構文です。\n\n```javascript\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n\n  greet() {\n    return `Hello, ${this.name}`;\n  }\n}\n\nconst user = new User(\"John\");\n\nconsole.log(user.name);    // \"John\"\nconsole.log(user.greet()); // \"Hello, John\"\n```\n\n`new User(\"John\")` を実行すると:\n\n1. 新しいオブジェクトが作られる。\n2. そのプロトタイプが `User.prototype` にリンクされる。\n3. `this` が新しいオブジェクトを指した状態で `constructor()` が実行される。\n4. `this.name = name` がプロパティを追加する。\n5. 新しいオブジェクトが返される。\n\n---\n\n### 1. 基本のクラス\n\n```javascript\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n\n  greet() {\n    return `Hi, ${this.name}`;\n  }\n}\n\nconst user = new User(\"Rajan\");\n\nconsole.log(user.greet());\n// Hi, Rajan\n```\n\n---\n\n### 2. 複数のインスタンスが同じメソッドを共有する\n\n```javascript\nconst user1 = new User(\"Rajan\");\nconst user2 = new User(\"John\");\n\nconsole.log(user1.greet());\nconsole.log(user2.greet());\n\nconsole.log(user1.greet === user2.greet);\n// true\n```\n\nどちらのオブジェクトも `User.prototype` の<b>同じ</b> `greet()` を使います。\n\nだからユーザーを1,000人作っても `greet()` のコピーが1,000個できるわけでは<b>ありません</b>。\n\n```text\nname  → stored on each instance\ngreet → shared through User.prototype\n```\n\n---\n\n### 3. クラスの継承\n\n```javascript\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n\n  greet() {\n    return `Hi ${this.name}`;\n  }\n}\n\nclass Admin extends User {\n  deleteUser() {\n    return \"User deleted\";\n  }\n}\n\nconst admin = new Admin(\"Rajan\");\n\nconsole.log(admin.greet());\n// Hi Rajan\n\nconsole.log(admin.deleteUser());\n// User deleted\n```\n\n探索はおおよそこうなります:\n\n```text\nadmin\n  ↓\nAdmin.prototype\n  ↓\nUser.prototype\n  ↓\nObject.prototype\n  ↓\nnull\n```",
      },
      diagram: `              User (class)
                  │
                  │ new User("John")
                  ▼
        ┌─────────────────────┐
        │     user object     │
        │                     │
        │ name: "John"        │
        └──────────┬──────────┘
                   │
                   │ [[Prototype]]
                   ▼
        ┌─────────────────────┐
        │   User.prototype    │
        │                     │
        │ greet() { ... }     │
        └─────────────────────┘


The important part:

name  → stored on each instance
greet → shared through User.prototype`,
      codeExample: {
        title: { en: "One blueprint, many instances, one shared method", np: "एउटै खाका, धेरै instance, एउटै साझा method", jp: "1つの設計図・多数のインスタンス・共有される1つのメソッド" },
        code: `// ── 1. Basic class ────────────────────────────────────────────────
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return \`Hi, \${this.name}\`;
  }
}

const user = new User("Rajan");
console.log(user.greet()); // Hi, Rajan

// ── 2. Every instance shares one method object ────────────────────
const user1 = new User("Rajan");
const user2 = new User("John");

console.log(user1.greet()); // Hi, Rajan
console.log(user2.greet()); // Hi, John

console.log(user1.greet === user2.greet); // true — one shared function

// ── 3. Inheritance with extends ───────────────────────────────────
class Admin extends User {
  deleteUser() {
    return "User deleted";
  }
}

const admin = new Admin("Rajan");

console.log(admin.greet());      // Hi Rajan — found on User.prototype
console.log(admin.deleteUser()); // User deleted — found on Admin.prototype`,
      },
      keyTakeaways: [
        { en: "<b>Class</b> → blueprint for creating objects.", np: "<b>Class</b> → object बनाउने खाका।", jp: "<b>クラス</b> → オブジェクトを作る設計図。" },
        { en: "<b>`new`</b> → creates an instance and runs the constructor.", np: "<b>`new`</b> → instance बनाउँछ र constructor चलाउँछ।", jp: "<b>`new`</b> → インスタンスを作り、コンストラクタを実行する。" },
        { en: "<b>`constructor()`</b> → initializes instance properties.", np: "<b>`constructor()`</b> → instance का property initialise गर्छ।", jp: "<b>`constructor()`</b> → インスタンスのプロパティを初期化する。" },
        { en: "<b>Class methods</b> → stored on the class's `.prototype`, not copied to every instance.", np: "<b>Class का method</b> → class को `.prototype` मा राखिन्छन्, हरेक instance मा copy हुँदैनन्।", jp: "<b>クラスのメソッド</b> → クラスの `.prototype` に置かれ、各インスタンスにコピーされない。" },
        { en: "<b>ES6 classes</b> → cleaner syntax over JavaScript's existing prototype system.", np: "<b>ES6 class</b> → JavaScript को अवस्थित prototype प्रणालीमाथिको सफा syntax।", jp: "<b>ES6のクラス</b> → 既存のプロトタイプの仕組みに対する読みやすい構文。" },
        { en: "<b>`extends`</b> → creates inheritance between classes.", np: "<b>`extends`</b> → class बीच inheritance बनाउँछ।", jp: "<b>`extends`</b> → クラス間に継承を作る。" },
        { en: "<b>`super()`</b> → calls the parent constructor.", np: "<b>`super()`</b> → parent constructor call गर्छ।", jp: "<b>`super()`</b> → 親のコンストラクタを呼ぶ。" },
        { en: "Classes still use <b>prototypes internally</b>.", np: "Class ले भित्री रूपमा अझै <b>prototype</b> प्रयोग गर्छन्।", jp: "クラスは内部では今も<b>プロトタイプ</b>を使っている。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking the class itself is an object instance</b> — `class User {}` is the blueprint, and `new User()` produces the actual instance.", np: "<b>Class आफैं object instance हो भन्ने ठान्नु</b> — `class User {}` खाका हो, र `new User()` ले वास्तविक instance बनाउँछ।", jp: "<b>クラス自体がインスタンスだと思う</b> — `class User {}` は設計図で、実際のインスタンスは `new User()` が作る。" },
        { en: "<b>Putting methods inside the constructor unnecessarily</b> — `this.greet = function () { ... }` creates a new function for every instance. Declare `greet() { ... }` as a class method instead.", np: "<b>अनावश्यक रूपमा constructor भित्र method राख्नु</b> — `this.greet = function () { ... }` ले हरेक instance का लागि नयाँ function बनाउँछ। बरु `greet() { ... }` लाई class method रूपमा घोषणा गर्नुहोस्।", jp: "<b>必要もなくコンストラクタ内にメソッドを書く</b> — `this.greet = function () { ... }` はインスタンスごとに新しい関数を作る。代わりに `greet() { ... }` をクラスのメソッドとして書く。" },
        { en: "<b>Thinking classes replaced prototypes</b> — they didn't. Classes are cleaner syntax for the same underlying prototype-based model.", np: "<b>Class ले prototype प्रतिस्थापन गर्‍यो भन्ने ठान्नु</b> — गरेको छैन। Class उही prototype-आधारित model का लागि सफा syntax हो।", jp: "<b>クラスがプロトタイプに取って代わったと思う</b> — そうではない。クラスは同じプロトタイプベースの仕組みの読みやすい構文。" },
      ],
      quiz: [
        {
          question: { en: "Does `class User {}` create a `User` object?", np: "`class User {}` ले `User` object बनाउँछ?", jp: "`class User {}` は `User` オブジェクトを作るか?" },
          options: [
            { en: "Yes", np: "बनाउँछ", jp: "はい" },
            { en: "No", np: "बनाउँदैन", jp: "いいえ" },
          ],
          correctIndex: 1,
          explanation: { en: "It only defines the blueprint; `new User()` creates the instance.", np: "यसले खाका मात्र परिभाषित गर्छ; `new User()` ले instance बनाउँछ।", jp: "設計図を定義するだけ。インスタンスを作るのは `new User()`。" },
        },
        {
          question: { en: "Where are normal class methods stored?", np: "सामान्य class method कहाँ राखिन्छन्?", jp: "通常のクラスメソッドはどこに置かれるか?" },
          options: [
            { en: "On every instance", np: "हरेक instance मा", jp: "各インスタンス上" },
            { en: "On `User.prototype`", np: "`User.prototype` मा", jp: "`User.prototype` 上" },
            { en: "On `Object.prototype`", np: "`Object.prototype` मा", jp: "`Object.prototype` 上" },
          ],
          correctIndex: 1,
          explanation: { en: "That is why `user1.greet === user2.greet` is `true`.", np: "त्यसैले `user1.greet === user2.greet` `true` हुन्छ।", jp: "だから `user1.greet === user2.greet` は `true` になる。" },
        },
        {
          question: { en: "What does `new User(\"John\")` do?", np: "`new User(\"John\")` ले के गर्छ?", jp: "`new User(\"John\")` は何をするか?" },
          options: [
            { en: "Creates an instance and runs the constructor", np: "Instance बनाउँछ र constructor चलाउँछ", jp: "インスタンスを作りコンストラクタを実行する" },
            { en: "Only creates the class", np: "Class मात्र बनाउँछ", jp: "クラスを作るだけ" },
            { en: "Copies every method into the object", np: "हरेक method object मा copy गर्छ", jp: "すべてのメソッドをオブジェクトにコピーする" },
          ],
          correctIndex: 0,
          explanation: { en: "It links the new object to `User.prototype` first, then runs `constructor()`.", np: "यसले पहिले नयाँ object लाई `User.prototype` सँग जोड्छ, त्यसपछि `constructor()` चलाउँछ।", jp: "まず新しいオブジェクトを `User.prototype` にリンクし、その後 `constructor()` を実行する。" },
        },
      ],
      youtubeIds: ["u6mVHkMpoMk"],
    },
    {
      id: "inheritance-extends-super",
      title: { en: "Inheritance with extends and super", np: "extends र super सँग Inheritance", jp: "extendsとsuperによる継承" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Inheritance</b> lets one class reuse another class's properties and methods instead of duplicating the same code across multiple classes. The class holding the shared logic is called the <b>parent</b> (or base) class; the class that reuses it is the <b>child</b> (or derived) class, connected with the `extends` keyword — e.g. `class Student extends Person {}` gives `Student` everything `Person` has, without rewriting a single line. Under the hood this sets up the entire prototype chain from Day 8 in one line, which is also why `instanceof` reflects the whole chain: a `Student` instance is `instanceof Student` AND `instanceof Person`.\n\nWhen the child defines its own `constructor(...)`, it must call `super(...)` first to run the parent's constructor and set up the inherited properties — using `this` before `super(...)` throws a `ReferenceError`, because the object doesn't exist yet until the parent has initialized it.\n\nA child can also <b>override</b> a method by redefining it with the same name — JavaScript then uses the child's version instead of the parent's. If the child still wants the parent's behaviour too, `super.method()` (no `new`, no parentheses after `super`) calls the parent's original implementation from inside the override. If a method isn't found directly on the child at all, JavaScript walks up to the parent's prototype and keeps looking until it finds it or reaches `Object` — this lookup is called the prototype chain.",
        np: "Inheritance ले एउटा class को properties/methods अर्को class ले reuse गर्न दिन्छ, code duplicate नगरी। Parent class मा shared logic हुन्छ, child class ले `extends` प्रयोग गरेर त्यो inherit गर्छ — यसैले `instanceof` ले पूरै chain (parent + child दुवै) चिन्छ। Child को आफ्नै constructor भए `super(...)` पहिले call गर्नुपर्छ — नत्र `this` प्रयोग गर्दा ReferenceError हुन्छ। Child ले method override गर्न सक्छ, र `super.method()` ले parent को version पनि call गर्न सकिन्छ। भित्री रूपमा यो अझै prototype chain lookup नै हो।",
        jp: "継承は、あるクラスのプロパティやメソッドを別のクラスが再利用できるようにする仕組みで、コードの重複を避けられる。共有ロジックを持つのが親クラス、`extends`で継承するのが子クラス — そのため`instanceof`はチェーン全体（親と子の両方）を認識する。子が独自のコンストラクタを持つ場合、まず`super(...)`を呼ぶ必要がある — それより前に`this`を使うとReferenceErrorになる。子はメソッドをオーバーライドでき、`super.method()`で親のバージョンも呼び出せる。内部的にはこれもプロトタイプチェーンによるルックアップ。",
      },
      diagram: `Person (parent)                       Student extends Person (child)
  constructor(name, age)                 constructor(name, age, grade) {
  introduce() { ... }                      super(name, age);   ← MUST run before 'this'
                                            this.grade = grade;
                                          }
                                          study() { ... }

john = new Student("John", 20, "A")

john.study()          → found on Student                    ✅
john.introduce()      → not on Student, look up the chain
                      → found on Person (prototype lookup)  ✅

john instanceof Student  → true
john instanceof Person   → true   ← chain includes Person.prototype`,
      codeExample: {
        title: { en: "extends, super(), overriding, and calling the parent's method", np: "extends, super(), method override", jp: "extends・super()・メソッドのオーバーライド" },
        code: `// ── Basic inheritance — reuse without rewriting ──────────────────────
class Animal {
  speak() { return "Animal makes a sound"; }
}
class Dog extends Animal {}   // Dog gets speak() for free, no code duplication

const dog = new Dog();
dog.speak();   // "Animal makes a sound" — inherited, not redefined

// ── super() — initialize the inherited properties first ──────────────
class Person {
  constructor(name) { this.name = name; }
}
class Student extends Person {
  constructor(name, course) {
    super(name);          // MUST run before touching 'this'
    this.course = course;
  }
}
const student = new Student("Alice", "JavaScript");
student.name;    // "Alice" — set up by Person's constructor
student.course;  // "JavaScript"

// ── Overriding a method ────────────────────────────────────────────────
class Cat extends Animal {
  speak() { return "Meow!"; }   // replaces Animal's speak()
}
new Cat().speak();   // "Meow!" — Cat's own version wins

// ── Calling the parent's version too, via super.method() ─────────────
class Puppy extends Animal {
  speak() { return super.speak() + " ... and also, Woof!"; }
}
new Puppy().speak();   // "Animal makes a sound ... and also, Woof!"

// ── Real-world example ──────────────────────────────────────────────────
class Employee {
  constructor(name) { this.name = name; }
  login() { return \`\${this.name} logged in.\`; }
}
class Manager extends Employee {
  approveLeave() { return \`\${this.name} approved leave.\`; }
}
const manager = new Manager("Sarah");
manager.login();         // "Sarah logged in." — inherited from Employee
manager.approveLeave();  // "Sarah approved leave." — Manager's own method`,
      },
      keyTakeaways: [
        { en: "Inheritance lets a child class reuse a parent class's properties and methods via `extends`, instead of duplicating the same code in multiple classes.", np: "Inheritance ले child class लाई `extends` मार्फत parent class को properties/methods reuse गर्न दिन्छ, धेरै classes मा उही code duplicate नगरी।", jp: "継承は`extends`を通じて子クラスが親クラスのプロパティやメソッドを再利用できるようにし、複数のクラスで同じコードを重複させずに済む。" },
        { en: "`super(...)` calls the parent's constructor and must run before any use of `this` in the child's constructor — using `this` first throws a ReferenceError.", np: "`super(...)` ले parent को constructor call गर्छ र child को constructor मा `this` प्रयोग गर्नुअघि चल्नुपर्छ — पहिले `this` प्रयोग गर्दा ReferenceError हुन्छ।", jp: "`super(...)`は親のコンストラクタを呼び、子のコンストラクタでthisを使う前に実行する必要がある。先にthisを使うとReferenceErrorになる。" },
        { en: "A child class can override an inherited method by redefining it with the same name; `super.method()` lets it also call the parent's original version.", np: "Child class ले inherited method लाई उही नामले redefine गरेर override गर्न सक्छ; `super.method()` ले parent को original version पनि call गर्न दिन्छ।", jp: "子クラスは同じ名前で再定義することで継承したメソッドをオーバーライドできる。`super.method()`で親の元のバージョンも呼び出せる。" },
        { en: "Behind the scenes, method lookup still walks the prototype chain from Day 8 — if a method isn't found on the child, JavaScript looks up to the parent, then further up until it's found.", np: "भित्री रूपमा method lookup अझै Day 8 को prototype chain मार्फत हुन्छ — child मा method नभेटिए JS ले parent मा, त्यसपछि माथि खोज्छ।", jp: "内部的にはメソッドの検索はDay 8のプロトタイプチェーンをたどる。子に見つからなければ親、さらに上へと探す。" },
      ],
      commonMistakes: [
        { en: "Forgetting `extends` entirely, so the child class doesn't inherit anything from the intended parent class.", np: "`extends` नै बिर्सनु, त्यसले child class ले चाहिएको parent class बाट केही inherit गर्दैन।", jp: "`extends`自体を書き忘れること。その結果、子クラスは意図した親クラスから何も継承しない。" },
        { en: "Trying to use `this` in a derived class's constructor before calling `super(...)` — this always throws a ReferenceError.", np: "Derived class को constructor मा `super(...)` call गर्नुअघि `this` प्रयोग गर्ने प्रयास गर्नु — यसले सधैं ReferenceError throw गर्छ।", jp: "`super(...)`を呼ぶ前に派生クラスのコンストラクタでthisを使おうとすること。これは常にReferenceErrorをスローする。" },
        { en: "Confusing inheritance with copying — a child doesn't get its own copy of the parent's methods, it accesses them through the prototype chain, which is memory efficient.", np: "Inheritance लाई copying सँग confuse गर्नु — child ले parent को methods को आफ्नै copy पाउँदैन, prototype chain मार्फत access गर्छ, जुन memory efficient छ।", jp: "継承をコピーと混同すること。子は親のメソッドの独自コピーを持たず、プロトタイプチェーンを通じてアクセスする。これはメモリ効率が良い。" },
        { en: "Rewriting a method that's identical to the parent's version instead of simply letting the child inherit it unchanged.", np: "Parent को version सँग उस्तै method फेरि लेख्नु, child ले त्यसलाई unchanged inherit गर्न दिनुको सट्टा।", jp: "親のバージョンと同一のメソッドを書き直すこと。子にそのまま継承させれば十分な場合。" },
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
        en: "<b>Static methods</b> belong to the class itself, not to any instance — you call them as `ClassName.method()` without ever creating an object, which is perfect for utilities and factory functions (e.g. `Calculator.add(2, 3)`). Calling a static method on an instance (`instance.staticMethod()`) throws, because static members only exist on the class.\n\n<b>Getters (`get`)</b> and <b>setters (`set`)</b> let a method be accessed like a plain property — no `()` — while still running code behind the scenes. A getter is handy for computed values (`get area() { return this.width * this.height; }`, read as `rect.area`), and a setter is handy for validating or transforming a value before it's stored, such as trimming whitespace or rejecting a negative age.\n\n<b>Private fields (`#name`)</b> take this further: a field declared with a `#` prefix is only accessible from inside that class's own body — accessing `obj.#balance` from outside code is a `SyntaxError`, not just a convention like `_balance`. Combining private fields with public methods (`deposit()`, `getBalance()`) lets the class fully control how its internal state is read or changed — this is the essence of <b>encapsulation</b>. One more subtlety: unlike function declarations, classes are not hoisted the same way — they sit in the Temporal Dead Zone (Day 3) until their declaration line runs, so a class can't be used before it's declared.",
        np: "Static methods class को आफ्नै हो, instance को होइन — `ClassName.method()` बाट call हुन्छ, object नबनाई। Instance मा static method call गर्दा throw हुन्छ। Getter/setter ले method लाई property जस्तै access गर्न दिन्छ — getter ले computed value दिन्छ, setter ले store गर्नुअघि value validate/transform गर्छ। Private fields (`#name`) class body भित्र मात्र accessible हुन्छन् — बाहिरबाट access गर्दा SyntaxError, `_name` convention भन्दा बलियो — यसैले encapsulation सम्भव हुन्छ। Classes पनि function जस्तो hoist हुँदैनन्, declaration नचलुन्जेल Temporal Dead Zone मा रहन्छन्।",
        jp: "staticメソッドはインスタンスではなくクラス自体に属し、オブジェクトを作らずに`ClassName.method()`として呼べる。インスタンスでstaticメソッドを呼ぶとスローする。getter/setterはメソッドをプロパティのようにアクセスさせる — getterは計算値を返し、setterは保存前に値を検証・変換する。プライベートフィールド(`#name`)はクラス本体内のみアクセス可能で、外部からアクセスするとSyntaxErrorになる（`_name`という慣習より強力）。これによりカプセル化が実現する。クラスも関数のようにはホイストされず、宣言されるまでTemporal Dead Zoneにある。",
      },
      diagram: `Calculator                            BankAccount
  static add(a, b)                       #balance             ← private, class-only
                                          get balance()         ← read like a property
Calculator.add(5, 3)  → 8                set nickname(v)       ← write like a property
(no 'new' needed)                        deposit(amount)

const acc = new BankAccount(...)

acc.balance             ✅ getter runs, returns #balance
acc.#balance             ❌ SyntaxError — outside the class body
acc.deposit(500)         → updates #balance internally`,
      codeExample: {
        title: { en: "Static methods, getters/setters, and private fields together", np: "Static methods, getters/setters, private fields", jp: "staticメソッド・getter/setter・プライベートフィールド" },
        code: `// ── Static methods — belong to the class, not an instance ────────────
class MathHelper {
  static square(n) { return n * n; }
}
MathHelper.square(4);        // 16 — called on the class directly

class User {
  constructor(name) { this.name = name; }
  static createGuest() { return new User("Guest"); }   // factory pattern
}
const guest = User.createGuest();
guest.name;   // "Guest"

// ── Getters — read like a property, no () ─────────────────────────────
class Rectangle {
  constructor(width, height) { this.width = width; this.height = height; }
  get area() { return this.width * this.height; }
}
const rect = new Rectangle(5, 4);
rect.area;    // 20 — not rect.area()

// ── Setters — validate before storing ───────────────────────────────────
class Person {
  set age(value) {
    if (value < 0) { console.log("Invalid age"); return; }
    this._age = value;
  }
}
const person = new Person();
person.age = -5;   // "Invalid age" — setter rejected it

// ── Private fields (#) — real encapsulation ─────────────────────────────
class BankAccount {
  #balance = 0;                       // only this class can touch #balance

  deposit(amount) { this.#balance += amount; }
  withdraw(amount) { if (amount <= this.#balance) this.#balance -= amount; }
  getBalance() { return this.#balance; }
}

const account = new BankAccount();
account.deposit(500);
account.withdraw(200);
account.getBalance();     // 300

// account.#balance;      // SyntaxError — private fields can't be read from outside`,
      },
      keyTakeaways: [
        { en: "Static methods and properties belong to the class itself — call them as `ClassName.method()`, never on an instance.", np: "Static methods/properties class को आफ्नै हुन् — `ClassName.method()` को रूपमा call गर्ने, instance मा होइन।", jp: "staticメソッドとプロパティはクラス自体に属する。`ClassName.method()`として呼び、インスタンスでは呼ばない。" },
        { en: "Getters (`get`) let you read a computed value like a plain property, with no `()`.", np: "Getters (`get`) ले computed value लाई plain property जस्तै पढ्न दिन्छ, `()` बिना।", jp: "getter（`get`）は計算値を`()`なしで通常のプロパティのように読ませる。" },
        { en: "Setters (`set`) run validation or transformation logic before a value is actually stored.", np: "Setters (`set`) ले value वास्तवमा store हुनुअघि validation वा transformation logic चलाउँछ।", jp: "setter（`set`）は値が実際に保存される前に検証や変換ロジックを実行する。" },
        { en: "Private fields (`#name`) are enforced by the language itself — accessing them outside the class throws a SyntaxError, giving real encapsulation rather than just a naming convention.", np: "Private fields (`#name`) language ले नै enforce गर्छ — class बाहिरबाट access गर्दा SyntaxError, यसैले real encapsulation हुन्छ, केवल naming convention होइन।", jp: "プライベートフィールド（`#name`）は言語自体によって強制される。クラス外からアクセスするとSyntaxErrorになり、単なる命名規則ではなく本物のカプセル化になる。" },
      ],
      commonMistakes: [
        { en: "Calling a static method on an instance (`new MathHelper().square(4)`) instead of on the class (`MathHelper.square(4)`).", np: "Static method लाई instance मा call गर्नु (`new MathHelper().square(4)`) class मा नभई (`MathHelper.square(4)`)।", jp: "staticメソッドをクラス（`MathHelper.square(4)`）ではなくインスタンス（`new MathHelper().square(4)`）で呼ぶこと。" },
        { en: "Calling a getter like a function (`user.fullName()`) — getters are accessed as plain properties, with no parentheses.", np: "Getter लाई function जस्तै call गर्नु (`user.fullName()`) — getters plain property जस्तै access हुन्छन्, parentheses बिना।", jp: "getterを関数のように呼ぶこと（`user.fullName()`）。getterは括弧なしで通常のプロパティとしてアクセスする。" },
        { en: "Writing a setter with no validation at all, which defeats the purpose of using a setter in the first place.", np: "Setter मा कुनै validation नै नराख्नु, जसले setter प्रयोग गर्ने उद्देश्य नै हराउँछ।", jp: "検証を全く行わないsetterを書くこと。そもそもsetterを使う意味がなくなる。" },
        { en: "Forgetting the `#` when referencing a private field inside a class method (`this.balance` instead of `this.#balance`), which silently reads or creates a different, non-private property.", np: "Class method भित्र private field reference गर्दा `#` बिर्सनु (`this.#balance` को सट्टा `this.balance`), जसले silently फरक, non-private property पढ्छ वा बनाउँछ।", jp: "クラスメソッド内でプライベートフィールドを参照する際に`#`を忘れること（`this.#balance`ではなく`this.balance`）。これは別の非プライベートなプロパティを黙って読み書きしてしまう。" },
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
