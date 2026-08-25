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
        en: "<b>Inheritance</b> lets one class reuse the properties and methods of another class instead of duplicating code.\n\n• <b>Parent class</b> → contains shared behavior.\n• <b>Child class</b> → inherits and can add or override behavior.\n• <b>`extends`</b> → connects the child to the parent.\n• <b>`super()`</b> → calls the parent constructor.\n• <b>`super.method()`</b> → calls a method from the parent class.\n\n```javascript\nclass Person {\n  constructor(name) {\n    this.name = name;\n  }\n\n  greet() {\n    return `Hello, ${this.name}`;\n  }\n}\n\nclass Student extends Person {\n  constructor(name, grade) {\n    super(name);\n    this.grade = grade;\n  }\n}\n\nconst student = new Student(\"Rajan\", 10);\n\nconsole.log(student.name);    // Rajan\nconsole.log(student.grade);   // 10\nconsole.log(student.greet()); // Hello, Rajan\n```\n\nUnder the hood, `extends` creates a <b>prototype chain</b>:\n\n```text\nstudent\n   ↓\nStudent.prototype\n   ↓\nPerson.prototype\n   ↓\nObject.prototype\n   ↓\nnull\n```\n\nThat's why:\n\n```javascript\nstudent instanceof Student // true\nstudent instanceof Person  // true\n```\n\n---\n\n### 1. Basic inheritance\n\n```javascript\nclass Person {\n  greet() {\n    return \"Hello!\";\n  }\n}\n\nclass Student extends Person {}\n\nconst student = new Student();\n\nconsole.log(student.greet());\n// Hello!\n```\n\nThe child automatically gets the parent's methods.\n\n---\n\n### 2. `super()` in a constructor\n\n```javascript\nclass Person {\n  constructor(name) {\n    this.name = name;\n  }\n}\n\nclass Student extends Person {\n  constructor(name, grade) {\n    super(name);\n    this.grade = grade;\n  }\n}\n\nconst student = new Student(\"Rajan\", 10);\n\nconsole.log(student.name);  // Rajan\nconsole.log(student.grade); // 10\n```\n\n`super(name)` runs the parent constructor so `this.name` can be initialized.\n\nIn a derived class, you <b>cannot use `this` before `super()`</b>:\n\n```javascript\nclass Student extends Person {\n  constructor(name) {\n    this.name = name; // ReferenceError\n    super(name);\n  }\n}\n```\n\n---\n\n### 3. Method overriding and `super.method()`\n\n```javascript\nclass Person {\n  greet() {\n    return \"Hello from Person\";\n  }\n}\n\nclass Student extends Person {\n  greet() {\n    return `${super.greet()} and hello from Student`;\n  }\n}\n\nconst student = new Student();\n\nconsole.log(student.greet());\n// Hello from Person and hello from Student\n```\n\nThe child overrides `greet()`, but `super.greet()` lets it reuse the parent's implementation.",
        np: "<b>Inheritance</b> ले एउटा class लाई code दोहोर्याउनुको साटो अर्को class का property र method पुनः प्रयोग गर्न दिन्छ।\n\n• <b>Parent class</b> → साझा behavior राख्छ।\n• <b>Child class</b> → inherit गर्छ र behavior थप्न वा override गर्न सक्छ।\n• <b>`extends`</b> → child लाई parent सँग जोड्छ।\n• <b>`super()`</b> → parent constructor call गर्छ।\n• <b>`super.method()`</b> → parent class को method call गर्छ।\n\n```javascript\nclass Person {\n  constructor(name) {\n    this.name = name;\n  }\n\n  greet() {\n    return `Hello, ${this.name}`;\n  }\n}\n\nclass Student extends Person {\n  constructor(name, grade) {\n    super(name);\n    this.grade = grade;\n  }\n}\n\nconst student = new Student(\"Rajan\", 10);\n\nconsole.log(student.name);    // Rajan\nconsole.log(student.grade);   // 10\nconsole.log(student.greet()); // Hello, Rajan\n```\n\nभित्री रूपमा, `extends` ले <b>prototype chain</b> बनाउँछ:\n\n```text\nstudent\n   ↓\nStudent.prototype\n   ↓\nPerson.prototype\n   ↓\nObject.prototype\n   ↓\nnull\n```\n\nत्यसैले:\n\n```javascript\nstudent instanceof Student // true\nstudent instanceof Person  // true\n```\n\n---\n\n### 1. आधारभूत inheritance\n\n```javascript\nclass Person {\n  greet() {\n    return \"Hello!\";\n  }\n}\n\nclass Student extends Person {}\n\nconst student = new Student();\n\nconsole.log(student.greet());\n// Hello!\n```\n\nChild ले parent का method स्वतः पाउँछ।\n\n---\n\n### 2. Constructor मा `super()`\n\n```javascript\nclass Person {\n  constructor(name) {\n    this.name = name;\n  }\n}\n\nclass Student extends Person {\n  constructor(name, grade) {\n    super(name);\n    this.grade = grade;\n  }\n}\n\nconst student = new Student(\"Rajan\", 10);\n\nconsole.log(student.name);  // Rajan\nconsole.log(student.grade); // 10\n```\n\n`super(name)` ले parent constructor चलाउँछ ताकि `this.name` initialise हुन सकोस्।\n\nDerived class मा, तपाईंले <b>`super()` अघि `this` प्रयोग गर्न सक्नुहुन्न</b>:\n\n```javascript\nclass Student extends Person {\n  constructor(name) {\n    this.name = name; // ReferenceError\n    super(name);\n  }\n}\n```\n\n---\n\n### 3. Method override र `super.method()`\n\n```javascript\nclass Person {\n  greet() {\n    return \"Hello from Person\";\n  }\n}\n\nclass Student extends Person {\n  greet() {\n    return `${super.greet()} and hello from Student`;\n  }\n}\n\nconst student = new Student();\n\nconsole.log(student.greet());\n// Hello from Person and hello from Student\n```\n\nChild ले `greet()` override गर्छ, तर `super.greet()` ले parent को implementation पुनः प्रयोग गर्न दिन्छ।",
        jp: "<b>継承</b>を使うと、コードを複製せずに、あるクラスが別のクラスのプロパティやメソッドを再利用できます。\n\n• <b>親クラス</b> → 共通の振る舞いを持つ。\n• <b>子クラス</b> → 継承し、振る舞いを追加したり上書きしたりできる。\n• <b>`extends`</b> → 子を親につなぐ。\n• <b>`super()`</b> → 親のコンストラクタを呼ぶ。\n• <b>`super.method()`</b> → 親クラスのメソッドを呼ぶ。\n\n```javascript\nclass Person {\n  constructor(name) {\n    this.name = name;\n  }\n\n  greet() {\n    return `Hello, ${this.name}`;\n  }\n}\n\nclass Student extends Person {\n  constructor(name, grade) {\n    super(name);\n    this.grade = grade;\n  }\n}\n\nconst student = new Student(\"Rajan\", 10);\n\nconsole.log(student.name);    // Rajan\nconsole.log(student.grade);   // 10\nconsole.log(student.greet()); // Hello, Rajan\n```\n\n内部では `extends` が<b>プロトタイプチェーン</b>を作ります:\n\n```text\nstudent\n   ↓\nStudent.prototype\n   ↓\nPerson.prototype\n   ↓\nObject.prototype\n   ↓\nnull\n```\n\nだからこうなります:\n\n```javascript\nstudent instanceof Student // true\nstudent instanceof Person  // true\n```\n\n---\n\n### 1. 基本の継承\n\n```javascript\nclass Person {\n  greet() {\n    return \"Hello!\";\n  }\n}\n\nclass Student extends Person {}\n\nconst student = new Student();\n\nconsole.log(student.greet());\n// Hello!\n```\n\n子は親のメソッドを自動的に受け継ぎます。\n\n---\n\n### 2. コンストラクタでの `super()`\n\n```javascript\nclass Person {\n  constructor(name) {\n    this.name = name;\n  }\n}\n\nclass Student extends Person {\n  constructor(name, grade) {\n    super(name);\n    this.grade = grade;\n  }\n}\n\nconst student = new Student(\"Rajan\", 10);\n\nconsole.log(student.name);  // Rajan\nconsole.log(student.grade); // 10\n```\n\n`super(name)` が親のコンストラクタを実行するので `this.name` が初期化されます。\n\n派生クラスでは<b>`super()` より前に `this` を使えません</b>:\n\n```javascript\nclass Student extends Person {\n  constructor(name) {\n    this.name = name; // ReferenceError\n    super(name);\n  }\n}\n```\n\n---\n\n### 3. メソッドの上書きと `super.method()`\n\n```javascript\nclass Person {\n  greet() {\n    return \"Hello from Person\";\n  }\n}\n\nclass Student extends Person {\n  greet() {\n    return `${super.greet()} and hello from Student`;\n  }\n}\n\nconst student = new Student();\n\nconsole.log(student.greet());\n// Hello from Person and hello from Student\n```\n\n子は `greet()` を上書きしますが、`super.greet()` で親の実装を再利用できます。",
      },
      diagram: `             Person
        ┌────────────────┐
        │ name           │
        │ greet()        │
        └───────┬────────┘
                │
             extends
                ↓
            Student
        ┌────────────────┐
        │ grade          │
        │ study()        │
        └───────┬────────┘
                │
                ↓
             student
        ┌────────────────┐
        │ name: "Rajan"  │
        │ grade: 10      │
        └────────────────┘


student.greet() is not found on student,
so JavaScript walks up the chain to Person.prototype.`,
      codeExample: {
        title: { en: "Extending, calling super, then overriding", np: "Extend गर्नु, super call गर्नु, अनि override गर्नु", jp: "継承する・superを呼ぶ・上書きする" },
        code: `// ── 1. Basic inheritance — the child gets the parent's methods ────
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return \`Hello, \${this.name}\`;
  }
}

class Student extends Person {
  constructor(name, grade) {
    super(name);      // must run before this is used
    this.grade = grade;
  }
}

const student = new Student("Rajan", 10);

console.log(student.name);    // Rajan
console.log(student.grade);   // 10
console.log(student.greet()); // Hello, Rajan

// ── 2. The chain extends built for us ─────────────────────────────
console.log(student instanceof Student); // true
console.log(student instanceof Person);  // true

// ── 3. Overriding, and reusing the parent with super.method() ─────
class Teacher extends Person {
  greet() {
    return \`\${super.greet()} and hello from Teacher\`;
  }
}

console.log(new Teacher("Rajan").greet());
// Hello, Rajan and hello from Teacher`,
      },
      keyTakeaways: [
        { en: "<b>`extends`</b> → creates inheritance between classes.", np: "<b>`extends`</b> → class बीच inheritance बनाउँछ।", jp: "<b>`extends`</b> → クラス間に継承を作る。" },
        { en: "<b>`super()`</b> → calls the parent constructor.", np: "<b>`super()`</b> → parent constructor call गर्छ।", jp: "<b>`super()`</b> → 親のコンストラクタを呼ぶ。" },
        { en: "<b>`super.method()`</b> → calls the parent's method.", np: "<b>`super.method()`</b> → parent को method call गर्छ।", jp: "<b>`super.method()`</b> → 親のメソッドを呼ぶ。" },
        { en: "A child can <b>override</b> parent methods.", np: "Child ले parent का method <b>override</b> गर्न सक्छ।", jp: "子は親のメソッドを<b>上書き</b>できる。" },
        { en: "Child instances are `instanceof` both the child and the parent.", np: "Child instance child र parent दुबैको `instanceof` हुन्छ।", jp: "子のインスタンスは子と親の両方の `instanceof` になる。" },
        { en: "Method lookup follows the <b>prototype chain</b>.", np: "Method खोजीले <b>prototype chain</b> पछ्याउँछ।", jp: "メソッドの探索は<b>プロトタイプチェーン</b>をたどる。" },
        { en: "In a child constructor, <b>`super()` must run before `this` is used</b>.", np: "Child constructor मा, <b>`this` प्रयोग गर्नुअघि `super()` चल्नैपर्छ</b>।", jp: "子のコンストラクタでは、<b>`this` を使う前に `super()` を実行</b>しなければならない。" },
      ],
      commonMistakes: [
        { en: "<b>Using `this` before `super()`</b> — `this.name = name;` above `super(name);` throws a `ReferenceError`. Call `super()` first, then assign.", np: "<b>`super()` अघि `this` प्रयोग गर्नु</b> — `super(name);` माथि `this.name = name;` ले `ReferenceError` दिन्छ। पहिले `super()` call गर्नुहोस्, त्यसपछि assign।", jp: "<b>`super()` の前に `this` を使う</b> — `super(name);` より上の `this.name = name;` は `ReferenceError`。先に `super()` を呼び、その後に代入する。" },
        { en: "<b>Calling `super` like a normal object</b> — `super.greet()` is right for a parent method, but `super().greet()` is wrong. `super()` is only for the parent constructor.", np: "<b>`super` लाई सामान्य object जस्तै call गर्नु</b> — parent method का लागि `super.greet()` ठीक हो, तर `super().greet()` गलत। `super()` parent constructor का लागि मात्र हो।", jp: "<b>`super` を普通のオブジェクトのように呼ぶ</b> — 親のメソッドには `super.greet()` が正しく、`super().greet()` は誤り。`super()` は親のコンストラクタ専用。" },
        { en: "<b>Forgetting that overriding replaces the parent's version</b> — once `Student` defines its own `greet()`, `student.greet()` uses that one. Call `super.greet()` when you also need the parent's behaviour.", np: "<b>Override ले parent को संस्करण प्रतिस्थापन गर्छ भनी बिर्सनु</b> — `Student` ले आफ्नै `greet()` परिभाषित गरेपछि, `student.greet()` ले त्यही प्रयोग गर्छ। Parent को behavior पनि चाहिए `super.greet()` call गर्नुहोस्।", jp: "<b>上書きが親の実装を置き換えることを忘れる</b> — `Student` が自前の `greet()` を定義すると `student.greet()` はそちらを使う。親の振る舞いも必要なら `super.greet()` を呼ぶ。" },
      ],
      quiz: [
        {
          question: { en: "What does `extends` do?", np: "`extends` ले के गर्छ?", jp: "`extends` は何をするか?" },
          options: [
            { en: "Creates a new object", np: "नयाँ object बनाउँछ", jp: "新しいオブジェクトを作る" },
            { en: "Creates inheritance between classes", np: "Class बीच inheritance बनाउँछ", jp: "クラス間に継承を作る" },
            { en: "Copies all parent methods into the child", np: "Parent का सबै method child मा copy गर्छ", jp: "親のメソッドをすべて子にコピーする" },
          ],
          correctIndex: 1,
          explanation: { en: "Nothing is copied; it links the child's prototype to the parent's.", np: "केही copy हुँदैन; यसले child को prototype लाई parent को सँग जोड्छ।", jp: "コピーはされない。子のプロトタイプを親につなぐだけ。" },
        },
        {
          question: { en: "Why do we use `super()` in a child constructor?", np: "Child constructor मा `super()` किन प्रयोग गर्छौं?", jp: "子のコンストラクタでなぜ `super()` を使うのか?" },
          options: [
            { en: "To create a new class", np: "नयाँ class बनाउन", jp: "新しいクラスを作るため" },
            { en: "To run the parent constructor", np: "Parent constructor चलाउन", jp: "親のコンストラクタを実行するため" },
            { en: "To call any method", np: "जुनसुकै method call गर्न", jp: "任意のメソッドを呼ぶため" },
          ],
          correctIndex: 1,
          explanation: { en: "It initialises the parent's properties, and must run before `this` is touched.", np: "यसले parent का property initialise गर्छ, र `this` छुनुअघि चल्नैपर्छ।", jp: "親のプロパティを初期化する。`this` に触れる前に実行しなければならない。" },
        },
        {
          question: { en: "What happens with `class Student extends Person { greet() { return super.greet(); } }`?", np: "`class Student extends Person { greet() { return super.greet(); } }` मा के हुन्छ?", jp: "`class Student extends Person { greet() { return super.greet(); } }` では何が起こるか?" },
          options: [
            { en: "Calls `Student.greet()` again", np: "`Student.greet()` फेरि call गर्छ", jp: "`Student.greet()` をもう一度呼ぶ" },
            { en: "Calls `Person.greet()`", np: "`Person.greet()` call गर्छ", jp: "`Person.greet()` を呼ぶ" },
            { en: "Creates a new `Person`", np: "नयाँ `Person` बनाउँछ", jp: "新しい `Person` を作る" },
          ],
          correctIndex: 1,
          explanation: { en: "`super.method()` reaches the parent's implementation without recursing.", np: "`super.method()` ले recursion नगरी parent को implementation मा पुग्छ।", jp: "`super.method()` は再帰せずに親の実装へ到達する。" },
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
