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
        en: "JavaScript classes provide several features for controlling <b>where functionality lives</b>, <b>how properties are accessed</b>, and <b>how internal data is protected</b>.\n\n• <b>Static methods</b> → belong to the class itself, not its instances.\n• <b>Getters</b> → read a value like a property while running a method behind the scenes.\n• <b>Setters</b> → assign a value like a property while running validation or transformation.\n• <b>Private fields</b> → use `#` to make class data accessible only inside the class.\n• Together, private fields and controlled methods provide <b>encapsulation</b>.\n\n---\n\n### 1. Static methods\n\nStatic methods belong to the <b>class</b>, so you don't need an instance.\n\n```javascript\nclass Calculator {\n  static add(a, b) {\n    return a + b;\n  }\n}\n\nconsole.log(Calculator.add(2, 3));\n// 5\n```\n\nThis does <b>not</b> work:\n\n```javascript\nconst calculator = new Calculator();\n\ncalculator.add(2, 3);\n// TypeError\n```\n\nBecause `add()` belongs to `Calculator`, not `calculator`.\n\n---\n\n### 2. Getters\n\nA getter lets you access a method like a normal property.\n\n```javascript\nclass Rectangle {\n  constructor(width, height) {\n    this.width = width;\n    this.height = height;\n  }\n\n  get area() {\n    return this.width * this.height;\n  }\n}\n\nconst rectangle = new Rectangle(10, 5);\n\nconsole.log(rectangle.area);\n// 50\n```\n\nNotice there are <b>no parentheses</b>: `rectangle.area` instead of `rectangle.area()`.\n\n---\n\n### 3. Setters\n\nA setter lets you control what happens when a property is assigned.\n\n```javascript\nclass User {\n  set name(value) {\n    this._name = value.trim();\n  }\n\n  get name() {\n    return this._name;\n  }\n}\n\nconst user = new User();\n\nuser.name = \"  Rajan  \";\n\nconsole.log(user.name);\n// \"Rajan\"\n```\n\nThe assignment `user.name = \"  Rajan  \";` automatically calls the setter.\n\n---\n\n### 4. Private fields\n\nPrivate fields use `#` and can only be accessed inside the class.\n\n```javascript\nclass BankAccount {\n  #balance = 0;\n\n  deposit(amount) {\n    this.#balance += amount;\n  }\n\n  getBalance() {\n    return this.#balance;\n  }\n}\n\nconst account = new BankAccount();\n\naccount.deposit(100);\n\nconsole.log(account.getBalance());\n// 100\n\nconsole.log(account.#balance);\n// SyntaxError\n```\n\n`#balance` is genuinely private. `_balance` would only be a naming convention.\n\n---\n\n### 5. Combining everything\n\n```javascript\nclass BankAccount {\n  #balance = 0;\n\n  constructor(owner) {\n    this.owner = owner;\n  }\n\n  deposit(amount) {\n    if (amount <= 0) {\n      throw new Error(\"Amount must be positive\");\n    }\n\n    this.#balance += amount;\n  }\n\n  get balance() {\n    return this.#balance;\n  }\n\n  static create(owner) {\n    return new BankAccount(owner);\n  }\n}\n\nconst account = BankAccount.create(\"Rajan\");\n\naccount.deposit(500);\n\nconsole.log(account.balance);\n// 500\n```\n\nHere:\n\n```text\nstatic create()  → class-level factory\n#balance         → private internal state\ndeposit()        → controlled modification\nget balance      → controlled reading\n```",
        np: "JavaScript का class ले <b>कार्यक्षमता कहाँ रहन्छ</b>, <b>property कसरी पहुँच गरिन्छ</b>, र <b>आन्तरिक data कसरी सुरक्षित हुन्छ</b> नियन्त्रण गर्न केही सुविधा दिन्छन्।\n\n• <b>Static method</b> → instance होइन, class आफैंको हुन्छ।\n• <b>Getter</b> → पर्दा पछाडि method चलाउँदै property जस्तै value पढ्न दिन्छ।\n• <b>Setter</b> → validation वा रूपान्तरण चलाउँदै property जस्तै value assign गर्न दिन्छ।\n• <b>Private field</b> → `#` प्रयोग गरी class को data class भित्र मात्र पहुँचयोग्य बनाउँछ।\n• Private field र नियन्त्रित method मिलेर <b>encapsulation</b> दिन्छन्।\n\n---\n\n### 1. Static method\n\nStatic method <b>class</b> को हुन्छ, त्यसैले instance चाहिँदैन।\n\n```javascript\nclass Calculator {\n  static add(a, b) {\n    return a + b;\n  }\n}\n\nconsole.log(Calculator.add(2, 3));\n// 5\n```\n\nयो काम <b>गर्दैन</b>:\n\n```javascript\nconst calculator = new Calculator();\n\ncalculator.add(2, 3);\n// TypeError\n```\n\nकिनकि `add()` `calculator` होइन, `Calculator` को हो।\n\n---\n\n### 2. Getter\n\nGetter ले method लाई सामान्य property जस्तै पहुँच गर्न दिन्छ।\n\n```javascript\nclass Rectangle {\n  constructor(width, height) {\n    this.width = width;\n    this.height = height;\n  }\n\n  get area() {\n    return this.width * this.height;\n  }\n}\n\nconst rectangle = new Rectangle(10, 5);\n\nconsole.log(rectangle.area);\n// 50\n```\n\nध्यान दिनुहोस्, <b>कोष्ठक छैनन्</b>: `rectangle.area()` होइन `rectangle.area`।\n\n---\n\n### 3. Setter\n\nSetter ले property assign हुँदा के हुन्छ नियन्त्रण गर्न दिन्छ।\n\n```javascript\nclass User {\n  set name(value) {\n    this._name = value.trim();\n  }\n\n  get name() {\n    return this._name;\n  }\n}\n\nconst user = new User();\n\nuser.name = \"  Rajan  \";\n\nconsole.log(user.name);\n// \"Rajan\"\n```\n\n`user.name = \"  Rajan  \";` assignment ले स्वतः setter call गर्छ।\n\n---\n\n### 4. Private field\n\nPrivate field ले `#` प्रयोग गर्छन् र class भित्र मात्र पहुँच गर्न सकिन्छ।\n\n```javascript\nclass BankAccount {\n  #balance = 0;\n\n  deposit(amount) {\n    this.#balance += amount;\n  }\n\n  getBalance() {\n    return this.#balance;\n  }\n}\n\nconst account = new BankAccount();\n\naccount.deposit(100);\n\nconsole.log(account.getBalance());\n// 100\n\nconsole.log(account.#balance);\n// SyntaxError\n```\n\n`#balance` साँच्चै private हो। `_balance` भने नामकरण convention मात्र हुन्थ्यो।\n\n---\n\n### 5. सबै जोड्नु\n\n```javascript\nclass BankAccount {\n  #balance = 0;\n\n  constructor(owner) {\n    this.owner = owner;\n  }\n\n  deposit(amount) {\n    if (amount <= 0) {\n      throw new Error(\"Amount must be positive\");\n    }\n\n    this.#balance += amount;\n  }\n\n  get balance() {\n    return this.#balance;\n  }\n\n  static create(owner) {\n    return new BankAccount(owner);\n  }\n}\n\nconst account = BankAccount.create(\"Rajan\");\n\naccount.deposit(500);\n\nconsole.log(account.balance);\n// 500\n```\n\nयहाँ:\n\n```text\nstatic create()  → class-level factory\n#balance         → private internal state\ndeposit()        → controlled modification\nget balance      → controlled reading\n```",
        jp: "JavaScriptのクラスには、<b>機能をどこに置くか</b>、<b>プロパティにどうアクセスするか</b>、<b>内部データをどう守るか</b>を制御する機能があります。\n\n• <b>静的メソッド</b> → インスタンスではなくクラス自身に属する。\n• <b>ゲッター</b> → 裏でメソッドを実行しつつ、プロパティのように値を読める。\n• <b>セッター</b> → 検証や変換を行いつつ、プロパティのように値を代入できる。\n• <b>プライベートフィールド</b> → `#` を使い、クラス内部からのみアクセスできるようにする。\n• プライベートフィールドと制御されたメソッドを合わせて<b>カプセル化</b>になる。\n\n---\n\n### 1. 静的メソッド\n\n静的メソッドは<b>クラス</b>に属するので、インスタンスは不要です。\n\n```javascript\nclass Calculator {\n  static add(a, b) {\n    return a + b;\n  }\n}\n\nconsole.log(Calculator.add(2, 3));\n// 5\n```\n\nこれは<b>動きません</b>:\n\n```javascript\nconst calculator = new Calculator();\n\ncalculator.add(2, 3);\n// TypeError\n```\n\n`add()` は `calculator` ではなく `Calculator` に属しているからです。\n\n---\n\n### 2. ゲッター\n\nゲッターを使うと、メソッドを普通のプロパティのように読めます。\n\n```javascript\nclass Rectangle {\n  constructor(width, height) {\n    this.width = width;\n    this.height = height;\n  }\n\n  get area() {\n    return this.width * this.height;\n  }\n}\n\nconst rectangle = new Rectangle(10, 5);\n\nconsole.log(rectangle.area);\n// 50\n```\n\n<b>括弧がない</b>ことに注目してください: `rectangle.area()` ではなく `rectangle.area`。\n\n---\n\n### 3. セッター\n\nセッターを使うと、プロパティへの代入時の動作を制御できます。\n\n```javascript\nclass User {\n  set name(value) {\n    this._name = value.trim();\n  }\n\n  get name() {\n    return this._name;\n  }\n}\n\nconst user = new User();\n\nuser.name = \"  Rajan  \";\n\nconsole.log(user.name);\n// \"Rajan\"\n```\n\n`user.name = \"  Rajan  \";` という代入が自動的にセッターを呼びます。\n\n---\n\n### 4. プライベートフィールド\n\nプライベートフィールドは `#` を使い、クラス内部からのみアクセスできます。\n\n```javascript\nclass BankAccount {\n  #balance = 0;\n\n  deposit(amount) {\n    this.#balance += amount;\n  }\n\n  getBalance() {\n    return this.#balance;\n  }\n}\n\nconst account = new BankAccount();\n\naccount.deposit(100);\n\nconsole.log(account.getBalance());\n// 100\n\nconsole.log(account.#balance);\n// SyntaxError\n```\n\n`#balance` は本当にプライベートです。`_balance` は命名の慣習にすぎません。\n\n---\n\n### 5. すべてを組み合わせる\n\n```javascript\nclass BankAccount {\n  #balance = 0;\n\n  constructor(owner) {\n    this.owner = owner;\n  }\n\n  deposit(amount) {\n    if (amount <= 0) {\n      throw new Error(\"Amount must be positive\");\n    }\n\n    this.#balance += amount;\n  }\n\n  get balance() {\n    return this.#balance;\n  }\n\n  static create(owner) {\n    return new BankAccount(owner);\n  }\n}\n\nconst account = BankAccount.create(\"Rajan\");\n\naccount.deposit(500);\n\nconsole.log(account.balance);\n// 500\n```\n\nここでは:\n\n```text\nstatic create()  → class-level factory\n#balance         → private internal state\ndeposit()        → controlled modification\nget balance      → controlled reading\n```",
      },
      diagram: `                 Calculator
              ┌───────────────┐
              │ static add()  │ ← Class itself
              └───────────────┘
                      │
                  Calculator.add()
                      │
                      ▼
              ┌───────────────┐
              │   instance    │
              │               │
              │ #balance      │ ← Private
              │ balance       │
              │ getBalance()  │
              │ deposit()     │
              └───────────────┘


Class
 └── static methods

Instance
 ├── public properties
 ├── getters/setters
 └── private fields (#)`,
      codeExample: {
        title: { en: "Static, getter, setter and private field together", np: "Static, getter, setter र private field सँगै", jp: "静的メソッド・ゲッター・セッター・プライベートフィールド" },
        code: `// ── 1. Static — called on the class, not an instance ──────────────
class Calculator {
  static add(a, b) {
    return a + b;
  }
}

console.log(Calculator.add(2, 3)); // 5
// new Calculator().add(2, 3);     // TypeError

// ── 2. Getter — read like a property, no parentheses ──────────────
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  get area() {
    return this.width * this.height;
  }
}

console.log(new Rectangle(10, 5).area); // 50

// ── 3. Setter — assignment runs your code ─────────────────────────
class User {
  set name(value) {
    this._name = value.trim();
  }

  get name() {
    return this._name;
  }
}

const user = new User();
user.name = "  Rajan  ";
console.log(user.name); // "Rajan"

// ── 4 and 5. Private state behind controlled access ───────────────
class BankAccount {
  #balance = 0;

  constructor(owner) {
    this.owner = owner;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.#balance += amount;
  }

  get balance() {
    return this.#balance;
  }

  static create(owner) {
    return new BankAccount(owner);
  }
}

const account = BankAccount.create("Rajan");
account.deposit(500);

console.log(account.balance); // 500
// account.#balance;          // SyntaxError — genuinely private`,
      },
      keyTakeaways: [
        { en: "<b>`static`</b> → belongs to the class, not instances.", np: "<b>`static`</b> → instance होइन, class को हुन्छ।", jp: "<b>`static`</b> → インスタンスではなくクラスに属する。" },
        { en: "<b>`get`</b> → access a method like a property.", np: "<b>`get`</b> → method लाई property जस्तै पहुँच गर्नु।", jp: "<b>`get`</b> → メソッドをプロパティのように読む。" },
        { en: "<b>`set`</b> → assign through a method-like property.", np: "<b>`set`</b> → method जस्तो property मार्फत assign गर्नु।", jp: "<b>`set`</b> → メソッドのようなプロパティを通じて代入する。" },
        { en: "<b>`#field`</b> → genuinely private class field.", np: "<b>`#field`</b> → साँच्चै private class field।", jp: "<b>`#field`</b> → 本当にプライベートなクラスフィールド。" },
        { en: "<b>Encapsulation</b> → keep internal state private and expose controlled operations.", np: "<b>Encapsulation</b> → आन्तरिक state private राख्नु र नियन्त्रित operation मात्र देखाउनु।", jp: "<b>カプセル化</b> → 内部状態を隠し、制御された操作だけを公開する。" },
        { en: "`static` methods are called with `ClassName.method()`.", np: "`static` method `ClassName.method()` ले call गरिन्छन्।", jp: "`static` メソッドは `ClassName.method()` で呼ぶ。" },
        { en: "Private fields cannot be accessed from outside the class.", np: "Private field class बाहिरबाट पहुँच गर्न सकिँदैन।", jp: "プライベートフィールドはクラスの外からアクセスできない。" },
        { en: "Classes themselves are in the <b>Temporal Dead Zone (TDZ)</b> until their declaration runs.", np: "Class आफैं आफ्नो declaration नचल्दासम्म <b>Temporal Dead Zone (TDZ)</b> मा हुन्छन्।", jp: "クラス自体も宣言が実行されるまで<b>一時的デッドゾーン（TDZ）</b>にある。" },
      ],
      commonMistakes: [
        { en: "<b>Calling a static method on an instance</b> — `new Calculator().add(2, 3)` throws a `TypeError`. Use `Calculator.add(2, 3)`.", np: "<b>Instance मा static method call गर्नु</b> — `new Calculator().add(2, 3)` ले `TypeError` दिन्छ। `Calculator.add(2, 3)` प्रयोग गर्नुहोस्।", jp: "<b>インスタンスから静的メソッドを呼ぶ</b> — `new Calculator().add(2, 3)` は `TypeError`。`Calculator.add(2, 3)` を使う。" },
        { en: "<b>Calling a getter like a function</b> — `rectangle.area()` throws a `TypeError`; write `rectangle.area`.", np: "<b>Getter लाई function जस्तै call गर्नु</b> — `rectangle.area()` ले `TypeError` दिन्छ; `rectangle.area` लेख्नुहोस्।", jp: "<b>ゲッターを関数のように呼ぶ</b> — `rectangle.area()` は `TypeError`。`rectangle.area` と書く。" },
        { en: "<b>Treating `_balance` as truly private</b> — the underscore is only a convention, and outside code can still read and write it. Use `#balance` for real privacy.", np: "<b>`_balance` लाई साँच्चै private मान्नु</b> — underscore convention मात्र हो, र बाहिरी code ले अझै पढ्न र लेख्न सक्छ। वास्तविक privacy का लागि `#balance` प्रयोग गर्नुहोस्।", jp: "<b>`_balance` を本当にプライベートだと思う</b> — アンダースコアは慣習にすぎず、外部から読み書きできる。本当に隠すなら `#balance`。" },
        { en: "<b>Accessing a private field outside the class</b> — `account.#balance` is a `SyntaxError`. Expose a getter or method such as `account.balance`.", np: "<b>Class बाहिर private field पहुँच गर्नु</b> — `account.#balance` `SyntaxError` हो। `account.balance` जस्तो getter वा method देखाउनुहोस्।", jp: "<b>クラスの外でプライベートフィールドにアクセスする</b> — `account.#balance` は `SyntaxError`。`account.balance` のようなゲッターやメソッドを公開する。" },
      ],
      quiz: [
        {
          question: { en: "Where does a static method belong?", np: "Static method कसको हुन्छ?", jp: "静的メソッドはどこに属するか?" },
          options: [
            { en: "Every instance", np: "हरेक instance", jp: "各インスタンス" },
            { en: "The class itself", np: "Class आफैं", jp: "クラス自身" },
            { en: "`Object.prototype`", np: "`Object.prototype`", jp: "`Object.prototype`" },
          ],
          correctIndex: 1,
          explanation: { en: "That is why instances cannot call it, only `ClassName.method()` can.", np: "त्यसैले instance ले call गर्न सक्दैन, `ClassName.method()` ले मात्र सक्छ।", jp: "だからインスタンスからは呼べず、`ClassName.method()` でのみ呼べる。" },
        },
        {
          question: { en: "How do you access a getter?", np: "Getter कसरी पहुँच गर्नुहुन्छ?", jp: "ゲッターにはどうアクセスするか?" },
          options: [
            { en: "`user.name()`", np: "`user.name()`", jp: "`user.name()`" },
            { en: "`user.name`", np: "`user.name`", jp: "`user.name`" },
            { en: "`get user.name`", np: "`get user.name`", jp: "`get user.name`" },
          ],
          correctIndex: 1,
          explanation: { en: "A getter looks like a property from the outside, so no parentheses.", np: "बाहिरबाट getter property जस्तै देखिन्छ, त्यसैले कोष्ठक हुँदैनन्।", jp: "外からはプロパティに見えるので、括弧は付けない。" },
        },
        {
          question: { en: "What does `#balance` mean?", np: "`#balance` को अर्थ के हो?", jp: "`#balance` は何を意味するか?" },
          options: [
            { en: "A naming convention", np: "नामकरण convention", jp: "命名の慣習" },
            { en: "A protected field", np: "Protected field", jp: "protectedなフィールド" },
            { en: "A genuinely private class field", np: "साँच्चै private class field", jp: "本当にプライベートなクラスフィールド" },
          ],
          correctIndex: 2,
          explanation: { en: "Reading it from outside is a `SyntaxError`, unlike the `_name` convention.", np: "बाहिरबाट पढ्दा `SyntaxError` हुन्छ, `_name` convention भन्दा फरक।", jp: "`_name` の慣習と違い、外から読むと `SyntaxError` になる。" },
        },
        {
          question: { en: "Which correctly calls `static double(n)` on `class MathUtils`?", np: "`class MathUtils` को `static double(n)` कसरी सही रूपमा call हुन्छ?", jp: "`class MathUtils` の `static double(n)` を正しく呼ぶのはどれか?" },
          options: [
            { en: "`new MathUtils().double(5)`", np: "`new MathUtils().double(5)`", jp: "`new MathUtils().double(5)`" },
            { en: "`MathUtils.double(5)`", np: "`MathUtils.double(5)`", jp: "`MathUtils.double(5)`" },
            { en: "`MathUtils.prototype.double(5)`", np: "`MathUtils.prototype.double(5)`", jp: "`MathUtils.prototype.double(5)`" },
          ],
          correctIndex: 1,
          explanation: { en: "Static methods live on the class object, not on its prototype.", np: "Static method class object मा हुन्छन्, यसको prototype मा होइन।", jp: "静的メソッドはクラスオブジェクトにあり、プロトタイプにはない。" },
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
