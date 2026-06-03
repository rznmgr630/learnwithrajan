import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_9_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "ES6 classes are syntactic sugar over the prototype system you learned yesterday. Under the hood they work exactly the same way — but the syntax is much cleaner and easier to reason about, especially for inheritance. Classes also introduce private fields, static methods, and getters/setters in a familiar way.",
      np: "ES6 classes हिजो सिकेको prototype system माथि syntactic sugar हो। भित्री रूपमा ठ्याक्कै उही काम गर्छ — तर syntax धेरै clean र clear छ, खासगरी inheritance का लागि।",
      jp: "ES6クラスは昨日学んだプロトタイプシステム上の糖衣構文。内部の動作は全く同じだが構文が格段にわかりやすくなる。プライベートフィールド・staticメソッド・getter/setterも自然に扱える。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "2ZphE5HcQPQ", title: "JavaScript Classes — ES6" },
      ],
    },
    {
      title: { en: "Class basics", np: "Class basics", jp: "クラスの基本" },
      blocks: [
        {
          type: "code",
          title: { en: "Class syntax vs prototype syntax — side by side", np: "Class syntax vs prototype syntax — side by side", jp: "クラス構文とプロトタイプ構文の比較" },
          code: `// ── Prototype way (Day 8) ───────────────────────────────────────────
function UserOld(name, age) {
  this.name = name;
  this.age  = age;
}
UserOld.prototype.greet = function () {
  return \`Hi, I'm \${this.name}\`;
};

// ── Class way (exactly equivalent under the hood) ────────────────────
class User {
  constructor(name, age) {   // called when you use 'new User(...)'
    this.name = name;
    this.age  = age;
  }

  // Instance methods — added to User.prototype automatically
  greet() {
    return \`Hi, I'm \${this.name}\`;
  }

  isAdult() {
    return this.age >= 18;
  }
}

const alice = new User("Alice", 30);
alice.greet();     // "Hi, I'm Alice"
alice.isAdult();   // true

// Proof that classes compile to prototypes:
typeof User;  // "function" — classes ARE functions
Object.getPrototypeOf(alice) === User.prototype;  // true`,
        },
      ],
    },
    {
      title: { en: "Inheritance with extends and super", np: "extends र super सँग inheritance", jp: "extendsとsuperによる継承" },
      blocks: [
        {
          type: "code",
          title: { en: "Extending a class — cleaner than prototype chains", np: "Class extend गर्नु — prototype chain भन्दा clean", jp: "クラスの継承 — プロトタイプチェーンより明快" },
          code: `class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return \`\${this.name} makes a sound\`;
  }

  toString() {
    return \`Animal(\${this.name})\`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);          // MUST call super() before accessing 'this'
    this.breed = breed;
  }

  // Override the parent method
  speak() {
    return \`\${this.name} barks!\`;
  }

  // Call the parent method with super.method()
  fullDescription() {
    return \`\${super.speak()} — specifically, \${this.name} barks!\`;
  }
}

const rex = new Dog("Rex", "Labrador");
rex.speak();            // "Rex barks!" — overridden method
rex.fullDescription();  // "Rex makes a sound — specifically, Rex barks!"
rex.toString();         // "Animal(Rex)" — inherited from Animal

rex instanceof Dog;     // true
rex instanceof Animal;  // true — Dog extends Animal

// ── Abstract-like pattern — base class that should not be instantiated ──
class Shape {
  constructor(color) {
    if (new.target === Shape) {
      throw new Error("Shape is abstract — use a subclass");
    }
    this.color = color;
  }

  area() { throw new Error("area() must be implemented"); }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  area() { return Math.PI * this.radius ** 2; }
}

new Circle("red", 5).area();  // ~78.54
// new Shape("blue");          // Error: Shape is abstract`,
        },
      ],
    },
    {
      title: { en: "Static methods, getters/setters & private fields", np: "Static methods, getters/setters र private fields", jp: "staticメソッド・getter/setter・プライベートフィールド" },
      blocks: [
        {
          type: "code",
          title: { en: "Advanced class features (ES2022+)", np: "Advanced class features", jp: "クラスの高度な機能" },
          code: `class BankAccount {
  // ── Private fields (#) — only accessible inside the class ─────────────
  #balance;
  #owner;
  #transactions = [];

  constructor(owner, initialBalance = 0) {
    this.#owner   = owner;
    this.#balance = initialBalance;
  }

  // ── Getter — accessed like a property, not a method call ───────────────
  get balance() {
    return this.#balance;
  }

  get owner() {
    return this.#owner;
  }

  // ── Setter — validates before assignment ──────────────────────────────
  set nickname(value) {
    if (typeof value !== "string" || value.length < 2) {
      throw new Error("Nickname must be at least 2 characters");
    }
    this.#owner = value;
  }

  // ── Instance methods ──────────────────────────────────────────────────
  deposit(amount) {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.#balance += amount;
    this.#transactions.push({ type: "deposit", amount, date: new Date() });
    return this;  // return 'this' for method chaining
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    this.#transactions.push({ type: "withdrawal", amount, date: new Date() });
    return this;
  }

  // ── Static methods — called on the class, not instances ───────────────
  static createSavingsAccount(owner) {
    return new BankAccount(owner, 0);
  }

  static isValidAmount(amount) {
    return typeof amount === "number" && amount > 0 && isFinite(amount);
  }
}

const account = new BankAccount("Alice", 1000);

// Getter — no ()
account.balance;  // 1000

// Method chaining (each method returns 'this')
account.deposit(500).withdraw(200);
account.balance;  // 1300

// Private field — not accessible from outside
// account.#balance;  // SyntaxError: Private field '#balance' must be declared

// Static methods — called on the class
BankAccount.isValidAmount(100);    // true
BankAccount.isValidAmount(-50);    // false
const savings = BankAccount.createSavingsAccount("Bob");`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            { en: "**Classes are NOT hoisted** the same way function declarations are. They sit in the TDZ until their definition — you cannot use a class before its declaration.", np: "**Classes hoist हुँदैन** function declarations जस्तो। Declaration सम्म TDZ मा — declaration अगाडि use गर्न मिल्दैन।", jp: "**クラスは関数宣言のようにはホイストされない**。TDZにあり、宣言前には使えない。" },
            { en: "**Private fields (#)** are enforced at the language level — not just a convention like `_name`. Accessing them from outside the class always throws a SyntaxError.", np: "**Private fields (#)** language level मा enforce हुन्छ — `_name` जस्तो convention मात्र होइन। Class बाहिरबाट access गर्दा SyntaxError।", jp: "**プライベートフィールド(#)**は言語レベルで強制される。クラス外からのアクセスは常にSyntaxErrorになる。" },
            { en: "**Static methods** belong to the class itself, not to instances. You call them with `ClassName.method()`. They are useful for factory methods and utilities related to the class.", np: "**Static methods** class को हो, instances को होइन। `ClassName.method()` ले call गर्नुहोस्। Factory methods र class-related utilities का लागि उपयोगी।", jp: "**staticメソッド**はクラス自体に属し、インスタンスには属さない。`ClassName.method()`で呼び出す。ファクトリメソッドや関連ユーティリティに使う。" },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "Are classes in JavaScript real classes (like Java/C++)?", np: "JavaScript का classes real classes हुन् (Java/C++ जस्तो)?", jp: "JavaScriptのクラスはJava/C++のような本当のクラスか？" },
      answer: {
        en: "No. JavaScript classes are syntactic sugar over the prototype system. There is no copy-based inheritance — methods are shared via the prototype chain, not copied into each instance. JavaScript is a prototype-based language that added class syntax in ES6 for developer convenience. The behaviour is fundamentally different from class-based languages: `class Dog extends Animal` creates a prototype chain, not a class hierarchy with separate method tables.",
        np: "होइन। JavaScript classes prototype system माथि syntactic sugar हो। Copy-based inheritance छैन — methods prototype chain मार्फत shared हुन्छ। JS prototype-based language हो जसमा ES6 मा class syntax developer convenience का लागि थपियो। `class Dog extends Animal` ले prototype chain बनाउँछ — separate method tables सहितको class hierarchy होइन।",
        jp: "いいえ。JavaScriptのクラスはプロトタイプシステム上の糖衣構文。コピーベースの継承ではなくプロトタイプチェーンでメソッドを共有する。`class Dog extends Animal`はプロトタイプチェーンを作るのであってクラス階層ではない。",
      },
    },
    {
      question: { en: "When should I use a class vs a factory function?", np: "Class vs factory function — कहिले कुन?", jp: "クラスとファクトリ関数の使い分けは？" },
      answer: {
        en: "Use a **class** when: you need inheritance, you are building something that genuinely models a hierarchy, or you are working with a framework that expects classes (React class components, TypeScript decorators). Use a **factory function** (`function createUser() { return { ...} }`) when: you want cleaner private state without `#`, you want functional composition over inheritance, or you want to avoid the `new` keyword and `this` complexity.",
        np: "**Class** कहिले: inheritance चाहिए, hierarchy model गर्नुपर्छ, वा framework (React class components) ले expect गर्छ। **Factory function** कहिले: `#` बिना clean private state, functional composition, वा `new` र `this` complexity avoid गर्न।",
        jp: "**クラス**: 継承が必要、階層モデルが必要、フレームワークがクラスを期待する場合。**ファクトリ関数**: `#`なしのきれいなプライベート状態、関数合成の優先、`new`と`this`の複雑さを避けたい場合。",
      },
    },
  ],
};
