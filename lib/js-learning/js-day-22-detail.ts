import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_22_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "JavaScript has a few powerful meta-programming features that most developers never use directly but encounter in frameworks: `Proxy` intercepts operations on objects, `Reflect` provides a clean API for those same operations, `Symbol` creates unique identifiers that power built-in protocols, and `WeakMap`/`WeakSet` provide GC-friendly storage. Understanding these unlocks how Vue 3 reactivity, Immer, and many ORMs work under the hood.",
      np: "JavaScript मा केही powerful meta-programming features छन् जुन धेरैजसो developers directly use गर्दैनन् तर frameworks मा encounter गर्छन्: `Proxy`, `Reflect`, `Symbol`, `WeakMap`/`WeakSet`। यी बुझ्नाले Vue 3 reactivity, Immer, र many ORMs कसरी काम गर्छन् unlock हुन्छ।",
      jp: "多くの開発者は直接使わないが、フレームワーク内で遭遇する強力なメタプログラミング機能: `Proxy`・`Reflect`・`Symbol`・`WeakMap`/`WeakSet`。これらを理解するとVue 3リアクティビティ・Immer・多くのORMの仕組みが解明される。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "sClk6aB_CPk", title: "JavaScript Proxy & Reflect Explained" },
      ],
    },
    {
      title: { en: "Proxy — intercept object operations", np: "Proxy — object operations intercept गर्नु", jp: "Proxy — オブジェクト操作のインターセプト" },
      blocks: [
        {
          type: "code",
          title: { en: "Intercepting get, set, and other object traps", np: "get, set र other object traps intercept गर्नु", jp: "get・set・その他のオブジェクトトラップをインターセプト" },
          code: `// ── Basic Proxy ────────────────────────────────────────────────────
const handler = {
  // Intercept property reads
  get(target, prop, receiver) {
    console.log(\`Getting \${prop}\`);
    return Reflect.get(target, prop, receiver);  // forward to target
  },
  // Intercept property writes
  set(target, prop, value, receiver) {
    console.log(\`Setting \${prop} = \${value}\`);
    return Reflect.set(target, prop, value, receiver);
  },
};

const obj = new Proxy({ name: "Alice", age: 30 }, handler);
obj.name;       // logs "Getting name", returns "Alice"
obj.age = 31;   // logs "Setting age = 31"

// ── Validation proxy ────────────────────────────────────────────────
function createValidated(schema) {
  return new Proxy({}, {
    set(target, prop, value) {
      const validator = schema[prop];
      if (validator && !validator(value)) {
        throw new TypeError(\`Invalid value for \${prop}: \${value}\`);
      }
      target[prop] = value;
      return true;  // must return true from set trap
    },
  });
}

const user = createValidated({
  age:   (v) => typeof v === "number" && v >= 0 && v <= 150,
  email: (v) => typeof v === "string" && v.includes("@"),
});

user.age = 30;       // ✅
user.age = -5;       // ❌ TypeError: Invalid value for age
user.email = "a@b";  // ✅

// ── Reactive data (Vue 3 reactivity simplified) ────────────────────
function reactive(obj) {
  const subscribers = new Map();

  return new Proxy(obj, {
    get(target, prop) {
      // Track which effects depend on this property
      track(prop, subscribers);
      return Reflect.get(target, prop);
    },
    set(target, prop, value) {
      const result = Reflect.set(target, prop, value);
      // Notify effects that depended on this property
      trigger(prop, subscribers);
      return result;
    },
  });
}

// ── Other useful Proxy traps ───────────────────────────────────────
const handler2 = {
  has(target, prop)          { return prop in target; },     // 'key' in obj
  deleteProperty(target, prop) { delete target[prop]; return true; }, // delete obj.key
  ownKeys(target)            { return Object.keys(target); }, // Object.keys()
  apply(target, thisArg, args) { return target.apply(thisArg, args); }, // fn()
  construct(target, args)    { return new target(...args); }, // new Fn()
};`,
        },
      ],
    },
    {
      title: { en: "Reflect — a clean API for fundamental operations", np: "Reflect — fundamental operations को clean API", jp: "Reflect — 基本操作のクリーンなAPI" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`Reflect` provides static methods that mirror every Proxy trap — `Reflect.get`, `Reflect.set`, `Reflect.has`, etc. It is the recommended way to forward operations inside a Proxy handler because it correctly handles `receiver` (which makes `this` work properly in prototype chains). It also turns previously imperative operations into expressions: `Reflect.deleteProperty(obj, key)` returns `true`/`false` instead of throwing.",
            np: "`Reflect` ले हर Proxy trap mirror गर्ने static methods provide गर्छ। Proxy handler भित्र operations forward गर्ने recommended way हो किनभने यसले `receiver` correctly handle गर्छ। Imperative operations लाई expressions मा transform गर्छ।",
            jp: "`Reflect`は全Proxyトラップに対応する静的メソッドを提供する。`receiver`を正しく処理するためProxyハンドラ内でのforwardに推奨される。命令的な操作を式に変換: `Reflect.deleteProperty`はthrowの代わりに`true`/`false`を返す。",
          },
        },
        {
          type: "code",
          title: { en: "Reflect methods and why they matter in Proxy handlers", np: "Reflect methods र Proxy handlers मा किन important", jp: "Reflectメソッドとなぜそれがプロキシハンドラで重要か" },
          code: `// Reflect methods mirror exactly what Proxy traps intercept
Reflect.get(obj, "name");             // obj.name
Reflect.set(obj, "age", 31);          // obj.age = 31
Reflect.has(obj, "name");             // "name" in obj
Reflect.deleteProperty(obj, "temp");  // delete obj.temp
Reflect.ownKeys(obj);                 // Object.getOwnPropertyNames + Symbols
Reflect.apply(fn, thisArg, [a, b]);   // fn.apply(thisArg, [a, b])
Reflect.construct(Cls, [a, b]);       // new Cls(a, b)

// ── Why use Reflect.get instead of target[prop] ────────────────────
class Base {
  get doubled() { return this.value * 2; }  // 'this' matters here
}
class Derived extends Base {
  value = 5;
}

const derived = new Derived();
const proxy = new Proxy(derived, {
  get(target, prop, receiver) {
    // ❌ Without receiver — 'this' in getter is 'target', not the proxy
    // return target[prop];

    // ✅ With Reflect.get + receiver — 'this' in getter is the proxy
    return Reflect.get(target, prop, receiver);
  }
});`,
        },
      ],
    },
    {
      title: { en: "Symbols — unique, non-string keys", np: "Symbols — unique, non-string keys", jp: "Symbol — ユニークな非文字列キー" },
      blocks: [
        {
          type: "code",
          title: { en: "Using Symbols for unique identifiers and built-in protocols", np: "Symbols — unique identifiers र built-in protocols", jp: "Symbolによるユニーク識別子と組み込みプロトコル" },
          code: `// ── Every Symbol is unique ────────────────────────────────────────
const id1 = Symbol("id");
const id2 = Symbol("id");
id1 === id2;  // false — even with the same description

// ── Symbols as object property keys ──────────────────────────────
const SECRET = Symbol("secret");

const obj = {
  name: "Alice",
  [SECRET]: "top-secret",  // Symbol key — not visible in for...in or Object.keys()
};

obj[SECRET];            // "top-secret"
Object.keys(obj);       // ["name"] — Symbol not included
JSON.stringify(obj);    // '{"name":"Alice"}' — Symbol omitted

// Use Symbols for "private" properties or meta-data you don't want
// to collide with user-defined properties

// ── Well-known Symbols — built-in protocols ────────────────────────

// Symbol.iterator — makes an object iterable (Day 18)
class Fibonacci {
  *[Symbol.iterator]() {
    let [a, b] = [0, 1];
    while (true) {
      yield a;
      [a, b] = [b, a + b];
    }
  }
}

// Symbol.toPrimitive — control type conversion
class Money {
  constructor(amount, currency) {
    this.amount = amount; this.currency = currency;
  }
  [Symbol.toPrimitive](hint) {
    if (hint === "number")  return this.amount;
    if (hint === "string")  return \`\${this.amount} \${this.currency}\`;
    return this.amount;  // default
  }
}
const price = new Money(99.99, "USD");
+price;          // 99.99 (number conversion)
\`\${price}\`;    // "99.99 USD" (string conversion)
price + 0.01;    // 100 (default conversion)

// Symbol.hasInstance — control instanceof
class EvenNumber {
  static [Symbol.hasInstance](num) {
    return Number(num) % 2 === 0;
  }
}
2 instanceof EvenNumber;   // true
3 instanceof EvenNumber;   // false

// Symbol.for / Symbol.keyFor — global symbol registry
const globalId = Symbol.for("app.id");       // create/retrieve from registry
Symbol.for("app.id") === globalId;           // true — same symbol`,
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "When would I actually use Proxy in production?", np: "Production मा Proxy actually कहिले use गर्ने?", jp: "実際の本番コードでProxyをいつ使うか？" },
      answer: {
        en: "Common production uses: (1) Validation — intercept `set` to validate before writing; (2) Reactivity systems — Vue 3 uses Proxy to track property accesses and trigger updates; (3) Default values — return a default when a property is missing instead of `undefined`; (4) Logging and debugging — intercept all operations to trace what a library does to an object; (5) Mocking in tests — intercept calls and record arguments. Proxy has a small performance overhead — do not use it on hot paths where you need maximum speed.",
        np: "Production use cases: (1) Validation — `set` intercept; (2) Reactivity systems — Vue 3; (3) Default values; (4) Logging/debugging; (5) Test mocking। Performance overhead छ — hot paths मा avoid गर्नुहोस्।",
        jp: "本番での用途: (1)バリデーション — setインターセプト; (2)リアクティビティシステム — Vue 3; (3)デフォルト値; (4)ログ/デバッグ; (5)テストモック。パフォーマンスオーバーヘッドがあるため、高頻度のコードパスでは避ける。",
      },
    },
    {
      question: { en: "What is the difference between Symbol() and Symbol.for()?", np: "Symbol() र Symbol.for() मा के फरक?", jp: "Symbol()とSymbol.for()の違いは？" },
      answer: {
        en: "`Symbol()` creates a brand new unique symbol every time — two calls with the same description string produce different symbols. `Symbol.for(key)` looks up a global registry: if a symbol with that key already exists, it returns that one; otherwise it creates a new one and registers it. Use `Symbol()` for local, private keys that should never be equal to anything else. Use `Symbol.for()` when you need to share a symbol across modules or libraries (e.g. `Symbol.for('nodejs.rejection')` used by Node.js internals).",
        np: "`Symbol()` हर पटक brand new unique symbol create गर्छ। `Symbol.for(key)` global registry lookup गर्छ: key भएको symbol already exist छ भने त्यही return, नभए new create गरेर register। Local, private keys का लागि `Symbol()`। Modules/libraries across share गर्न `Symbol.for()`।",
        jp: "`Symbol()`は毎回新しいユニークなシンボルを作成。`Symbol.for(key)`はグローバルレジストリを検索: そのキーのシンボルが既にあれば返し、なければ作成して登録。ローカルなプライベートキーには`Symbol()`。モジュール/ライブラリ間での共有には`Symbol.for()`。",
      },
    },
  ],
};
