import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_27_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "JavaScript has a few powerful meta-programming features that most developers never use directly but encounter in frameworks: `Proxy` intercepts operations on objects, `Reflect` provides a clean API for those same operations, `Symbol` creates unique identifiers that power built-in protocols, and `WeakMap`/`WeakSet` provide GC-friendly storage. Understanding these unlocks how Vue 3 reactivity, Immer, and many ORMs work under the hood.",
      np: "JavaScript मा केही powerful meta-programming features छन् जुन धेरैजसो developers directly use गर्दैनन् तर frameworks मा encounter गर्छन्: `Proxy`, `Reflect`, `Symbol`, `WeakMap`/`WeakSet`। यी बुझ्नाले Vue 3 reactivity, Immer, र many ORMs कसरी काम गर्छन् unlock हुन्छ।",
      jp: "多くの開発者は直接使わないが、フレームワーク内で遭遇する強力なメタプログラミング機能: `Proxy`・`Reflect`・`Symbol`・`WeakMap`/`WeakSet`。これらを理解するとVue 3リアクティビティ・Immer・多くのORMの仕組みが解明される。",
    },
  ],
  sections: [
    {
      title: { en: "Proxy — intercept object operations", np: "Proxy — object operations intercept गर्नु", jp: "Proxy — オブジェクト操作のインターセプト" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>Proxy</b> wraps an object and lets you intercept operations performed on it. Instead of `user.name` reaching the object directly, the read passes through your handler first. The wrapped object is the <b>target</b>; the object holding the trap functions is the <b>handler</b>; each trap function intercepts one kind of operation. That makes Proxy the tool behind validation, logging, access control, change tracking, API wrappers and reactive systems.",
            np: "<b>Proxy</b> ले object लाई बेर्छ र त्यसमा हुने operation intercept गर्न दिन्छ। `user.name` सिधै object मा नपुगी पहिले तपाईंको handler हुँदै जान्छ। बेरिएको object <b>target</b> हो; trap function राख्ने object <b>handler</b>; हरेक trap ले एक किसिमको operation intercept गर्छ। त्यसैले validation, logging, access control, change tracking, API wrapper र reactive system पछाडि Proxy हुन्छ।",
            jp: "<b>Proxy</b> はオブジェクトを包み、そこで行われる操作を横取りできるようにする。`user.name` は直接オブジェクトへ届かず、まずハンドラーを通る。包まれた側が<b>ターゲット</b>、トラップ関数を持つ側が<b>ハンドラー</b>で、各トラップが1種類の操作を横取りする。だから検証・ログ・アクセス制御・変更追跡・APIラッパー・リアクティブ実装の土台になる。",
          },
        },
        {
          type: "code",
          title: { en: "How a read travels through a Proxy", np: "Read कसरी Proxy हुँदै जान्छ", jp: "読み取りがProxyを通る道筋" },
          code: `Code
 │
 │ user.name
 ▼
Proxy
 │
 │ get trap
 ▼
Target object
 │
 ▼
"Alice"


The traps you can define

get(target, prop, receiver)          reading a property
set(target, prop, value, receiver)   writing a property
has(target, prop)                    'key' in obj
deleteProperty(target, prop)         delete obj.key
ownKeys(target)                      Object.keys(obj)
apply(target, thisArg, args)         fn()
construct(target, args)              new Fn()`,
        },
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
        {
          type: "paragraph",
          text: {
            en: "One rule catches people out: a `set` trap must <b>return `true`</b> to say the assignment was handled. Returning nothing is falsy, and in strict mode that throws a `TypeError`. Note too that the Proxy is a wrapper, not a replacement — the target object still exists on its own and can be modified directly, bypassing every trap.",
            np: "एउटा नियमले धेरैलाई अल्झाउँछ: `set` trap ले assignment सम्हालियो भन्न <b>`true` फर्काउनैपर्छ</b>। केही नफर्काउनु falsy हो, र strict mode मा त्यसले `TypeError` दिन्छ। यो पनि ख्याल गर्नुहोस् — Proxy बेर्ने हो, प्रतिस्थापन होइन; target object आफैं रहन्छ र सिधै बदल्दा हरेक trap छल्छ।",
            jp: "つまずきやすい規則がひとつ。`set` トラップは代入を扱ったことを示すために<b>`true` を返す</b>必要がある。何も返さないと falsy になり、strictモードでは `TypeError` になる。また Proxy は差し替えではなく包みであり、ターゲット自体は残るので、直接触ればすべてのトラップを迂回できる。",
          },
        },
        { type: "youtube", videoId: "sClk6aB_CPk", title: "JavaScript Proxy & Reflect Explained" },
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
        {
          type: "paragraph",
          text: {
            en: "The pairing is easiest to remember as two halves of the same job: <b>Proxy intercepts an object operation, Reflect performs it.</b> Every trap has a matching `Reflect` method with the same arguments, so a handler that only wants to observe can forward with a one-line `Reflect` call and leave the default behaviour intact.",
            np: "यो जोडी उही कामका दुई आधा भनी सम्झ्दा सजिलो हुन्छ: <b>Proxy ले object operation intercept गर्छ, Reflect ले त्यो गर्छ।</b> हरेक trap सँग उही argument भएको `Reflect` method छ, त्यसैले हेर्न मात्र चाहने handler ले एक लाइनको `Reflect` call ले forward गरेर default व्यवहार जस्ताको तस्तै राख्न सक्छ।",
            jp: "この2つは同じ仕事の両輪と覚えると早い。<b>Proxy が操作を横取りし、Reflect がその操作を実行する。</b>各トラップには同じ引数の `Reflect` メソッドがあるので、観察だけしたいハンドラーは1行の `Reflect` 呼び出しで転送し、既定の挙動をそのまま保てる。",
          },
        },
      ],
    },
    {
      title: { en: "Symbols — unique, non-string keys", np: "Symbols — unique, non-string keys", jp: "Symbol — ユニークな非文字列キー" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>Symbol</b> is a primitive that is guaranteed to be unique. `Symbol(\"id\") === Symbol(\"id\")` is `false` — the description is only a label for debugging, never an identity. That uniqueness is what makes Symbols useful as property keys a library can add without colliding with anything the application defines, and as the keys behind JavaScript's built-in protocols.",
            np: "<b>Symbol</b> एउटा primitive हो जुन अद्वितीय हुने ग्यारेन्टी छ। `Symbol(\"id\") === Symbol(\"id\")` `false` हो — description debug का लागि label मात्र हो, पहिचान होइन। यही अद्वितीयताले Symbol लाई त्यस्तो property key बनाउँछ जुन library ले application का कुनै पनि नाम सँग नठोक्किई थप्न सक्छ, र JavaScript का भित्रैका protocol का key पनि यही हुन्।",
            jp: "<b>Symbol</b> は一意であることが保証されたプリミティブ。`Symbol(\"id\") === Symbol(\"id\")` は `false` で、説明文字列はデバッグ用のラベルにすぎず同一性ではない。この一意性のおかげで、ライブラリがアプリ側の名前と衝突せずにプロパティキーを足せるし、JavaScript 組み込みのプロトコルのキーにもなっている。",
          },
        },
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
        {
          type: "paragraph",
          text: {
            en: "Symbols are <b>not</b> a privacy mechanism. A Symbol key is skipped by `Object.keys()`, `for...in` and `JSON.stringify()`, but anyone can still list it with `Object.getOwnPropertySymbols(obj)` and read the value. They give you uniqueness and freedom from accidental access, not security. For genuinely private class state, use a `#privateField`.",
            np: "Symbol गोपनीयताको संयन्त्र <b>होइन</b>। Symbol key `Object.keys()`, `for...in` र `JSON.stringify()` ले छाड्छन्, तर जो कोहीले `Object.getOwnPropertySymbols(obj)` ले सूचीबद्ध गरी मान पढ्न सक्छ। यसले अद्वितीयता र संयोगवश पहुँचबाट छुटकारा दिन्छ, सुरक्षा होइन। साँच्चै private class अवस्थाका लागि `#privateField` प्रयोग गर्नुहोस्।",
            jp: "Symbol はプライバシーの仕組みでは<b>ない</b>。Symbol キーは `Object.keys()`・`for...in`・`JSON.stringify()` から漏れるが、`Object.getOwnPropertySymbols(obj)` で誰でも列挙して値を読める。得られるのは一意性と偶発的アクセスの回避であって、機密性ではない。本当に private なクラスの状態には `#privateField` を使う。",
          },
        },
      ],
    },
    {
      title: { en: "WeakMap — object-keyed data that can still be collected", np: "WeakMap — संकलन हुन सक्ने object-key भएको data", jp: "WeakMap — 回収されうるオブジェクトキーのデータ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>WeakMap</b> stores key-value pairs where the keys must be objects. What sets it apart from `Map` is garbage collection: a `Map` holds its keys <b>strongly</b>, so an entry alone is enough to keep an object alive forever, while a `WeakMap` holds them <b>weakly</b> and never becomes the reason an object survives. That makes it the right store for data attached to objects whose lifetime you do not control — metadata, per-instance private state, and caches.",
            np: "<b>WeakMap</b> ले key-value जोडी राख्छ जहाँ key object नै हुनुपर्छ। `Map` भन्दा भिन्नता garbage collection मा छ: `Map` ले आफ्ना key <b>बलियो</b> गरी राख्छ, त्यसैले entry मात्रैले object सधैंका लागि जीवित राख्न पुग्छ; `WeakMap` ले <b>कमजोर</b> गरी राख्छ र object बाँच्नुको कारण कहिल्यै बन्दैन। त्यसैले आफूले आयु नियन्त्रण नगर्ने object सँग जोडिएको data — metadata, प्रति-instance private अवस्था र cache — का लागि यो सही भण्डार हो।",
            jp: "<b>WeakMap</b> はキーがオブジェクトでなければならないキー・値の集合。`Map` との違いはガベージコレクションにある。`Map` はキーを<b>強く</b>保持するので項目があるだけでオブジェクトが生き続けるが、`WeakMap` は<b>弱く</b>保持し、オブジェクトが生き残る理由にはならない。だから寿命を自分で持たないオブジェクトに紐づくデータ、つまりメタデータ・インスタンスごとの私的状態・キャッシュの置き場に向く。",
          },
        },
        {
          type: "code",
          title: { en: "Associating data with an object, and how it differs from Map", np: "Object सँग data जोड्नु, र Map भन्दा कसरी फरक", jp: "オブジェクトへのデータ紐づけと、Mapとの違い" },
          code: `// ── Basic — attach data to an object ──────────────────────────────
const metadata = new WeakMap();

const user = { name: "Alice" };

metadata.set(user, { lastLogin: "today" });
metadata.get(user);   // { lastLogin: "today" }
metadata.has(user);   // true
metadata.delete(user);

// ── Intermediate — per-instance private state ─────────────────────
const privateData = new WeakMap();

class User {
  constructor(name, password) {
    this.name = name;
    privateData.set(this, { password });   // never a public property
  }

  checkPassword(password) {
    return privateData.get(this).password === password;
  }
}

const alice = new User("Alice", "secret");
alice.checkPassword("secret");   // true
alice.password;                  // undefined
// Modern code should prefer #privateField for class state; WeakMap still
// fits metadata attached from outside the class.

// ── Advanced — a cache that does not pin its keys ─────────────────
const cache = new WeakMap();

function calculate(user) {
  if (cache.has(user)) return cache.get(user);

  const result = { score: user.age * 10 };
  cache.set(user, result);
  return result;
}

calculate(alice);   // computed
calculate(alice);   // served from the cache

// ── Map holds on, WeakMap lets go ─────────────────────────────────
// Map
//   object ───────► data
//     └── strong reference, the object cannot be collected
//
// WeakMap
//   object ───────► data
//     └── weak reference, the entry goes when the object does

// ── The limits are deliberate ─────────────────────────────────────
const wm = new WeakMap();

// wm.set("user", 123);   // TypeError — keys must be objects
// for (const entry of wm) {}   // not iterable, and there is no .size
// Enumerating it would reveal exactly when the collector ran.`,
        },
      ],
    },
    {
      title: { en: "Choosing between the four", np: "चार मध्ये कुन छान्ने", jp: "4つの使い分け" },
      blocks: [
        {
          type: "table",
          caption: { en: "What each one is for", np: "कुन चाहिँ केका लागि", jp: "それぞれの役割" },
          headers: [{ en: "Feature", np: "सुविधा", jp: "機能" }, { en: "Main purpose", np: "मुख्य उद्देश्य", jp: "主な目的" }, { en: "Reach for it when", np: "कहिले प्रयोग गर्ने", jp: "使う場面" }],
          rows: [
            [{ en: "`Proxy`", np: "`Proxy`", jp: "`Proxy`" }, { en: "Intercept object operations", np: "Object operation intercept गर्न", jp: "オブジェクト操作を横取りする" }, { en: "Validation, reactivity, logging, mocking", np: "Validation, reactivity, logging, mocking", jp: "検証・リアクティビティ・ログ・モック" }],
            [{ en: "`Reflect`", np: "`Reflect`", jp: "`Reflect`" }, { en: "Perform or forward those operations", np: "ती operation गर्न वा forward गर्न", jp: "その操作を実行・転送する" }, { en: "Inside a Proxy handler, to keep `receiver` correct", np: "Proxy handler भित्र, `receiver` सही राख्न", jp: "Proxyハンドラ内で `receiver` を正しく保つため" }],
            [{ en: "`Symbol`", np: "`Symbol`", jp: "`Symbol`" }, { en: "Unique keys and built-in protocols", np: "अद्वितीय key र भित्रैका protocol", jp: "一意なキーと組み込みプロトコル" }, { en: "Metadata keys, `Symbol.iterator`, `Symbol.toPrimitive`", np: "Metadata key, `Symbol.iterator`, `Symbol.toPrimitive`", jp: "メタデータのキー、`Symbol.iterator`、`Symbol.toPrimitive`" }],
            [{ en: "`WeakMap`", np: "`WeakMap`", jp: "`WeakMap`" }, { en: "Object-associated data without retention", np: "Object सँग जोडिएको data, नरोकी", jp: "保持せずにオブジェクトへ紐づけるデータ" }, { en: "Caches and metadata for objects you do not own", np: "आफ्नो नभएका object का cache र metadata", jp: "自分が所有しないオブジェクトのキャッシュやメタデータ" }],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "Four mistakes account for most of the trouble with these APIs. Thinking a <b>Proxy replaces the target</b> — it does not, the original object is still there and still writable. Treating a <b>Symbol key as private</b> — `Object.getOwnPropertySymbols()` finds it. Passing a <b>primitive to a WeakMap</b> — the keys must be objects, so use a plain `Map` when your keys are strings. And reaching for <b>Proxy everywhere</b> — interception costs performance and makes code harder to step through, so it should earn its place rather than being used because it is available.",
            np: "यी API सँगका अधिकांश समस्या चार गल्तीबाट आउँछन्। <b>Proxy ले target प्रतिस्थापन गर्छ</b> भन्ने ठान्नु — गर्दैन, मूल object त्यहीँ छ र लेख्न मिल्छ। <b>Symbol key private हो</b> भन्ने ठान्नु — `Object.getOwnPropertySymbols()` ले भेट्टाउँछ। <b>WeakMap मा primitive</b> पठाउनु — key object नै हुनुपर्छ, त्यसैले key string भए सामान्य `Map` प्रयोग गर्नुहोस्। र <b>जताततै Proxy</b> प्रयोग गर्नु — intercept ले performance खान्छ र code पछ्याउन गाह्रो बनाउँछ, त्यसैले उपलब्ध छ भन्दैमा होइन, काम लागेर मात्र प्रयोग गर्नुहोस्।",
            jp: "これらのAPIでの躓きはだいたい4つ。<b>Proxy がターゲットを置き換える</b>と思うこと — 置き換えず、元のオブジェクトは残り書き換えもできる。<b>Symbol キーが private</b> だと思うこと — `Object.getOwnPropertySymbols()` で見つかる。<b>WeakMap にプリミティブ</b>を渡すこと — キーはオブジェクトのみなので、文字列キーなら素の `Map` を使う。そして<b>どこでも Proxy</b> を使うこと — 横取りは性能を食い追跡を難しくするので、使えるからではなく必要だから使う。",
          },
        },
      ],
    },
  ],
  quiz: [
    {
      question: { en: "What does a Proxy primarily let you do?", np: "Proxy ले मुख्यतः के गर्न दिन्छ?", jp: "Proxyが主に可能にすることは?" },
      options: [
        { en: "Intercept operations performed on an object", np: "Object मा हुने operation intercept गर्न", jp: "オブジェクトへの操作を横取りする" },
        { en: "Create private variables", np: "Private variable बनाउन", jp: "プライベート変数を作る" },
        { en: "Make an object immutable", np: "Object लाई अपरिवर्तनीय बनाउन", jp: "オブジェクトを不変にする" },
        { en: "Deep-clone an object", np: "Object deep-clone गर्न", jp: "オブジェクトをディープコピーする" },
      ],
      correctIndex: 0,
      explanation: { en: "Reads, writes, `in`, `delete`, `Object.keys` and calls can all be trapped.", np: "Read, write, `in`, `delete`, `Object.keys` र call सबै trap गर्न सकिन्छ।", jp: "読み取り・書き込み・`in`・`delete`・`Object.keys`・呼び出しをすべて横取りできる。" },
    },
    {
      question: { en: "Why must a `set` trap return `true`?", np: "`set` trap ले `true` किन फर्काउनुपर्छ?", jp: "`set` トラップが `true` を返すべき理由は?" },
      options: [
        { en: "It signals the assignment was handled; a falsy value throws in strict mode", np: "यसले assignment सम्हालियो भन्छ; falsy मान strict mode मा error दिन्छ", jp: "代入を扱ったことを示すため。falsyな値はstrictモードで例外になる" },
        { en: "It makes the property read-only", np: "यसले property read-only बनाउँछ", jp: "プロパティを読み取り専用にするため" },
        { en: "It caches the written value", np: "यसले लेखिएको मान cache गर्छ", jp: "書き込んだ値をキャッシュするため" },
      ],
      correctIndex: 0,
      explanation: { en: "Returning nothing is falsy, which strict mode reports as a `TypeError`.", np: "केही नफर्काउनु falsy हो, र strict mode ले यसलाई `TypeError` भन्छ।", jp: "何も返さないとfalsyになり、strictモードでは `TypeError` になる。" },
    },
    {
      question: { en: "Why is `Reflect.get()` preferred over `target[prop]` inside a Proxy?", np: "Proxy भित्र `target[prop]` भन्दा `Reflect.get()` किन रोजिन्छ?", jp: "Proxy内で `target[prop]` より `Reflect.get()` が好まれる理由は?" },
      options: [
        { en: "It forwards the operation and passes `receiver`, so getters see the right `this`", np: "यसले operation forward गर्छ र `receiver` पठाउँछ, त्यसैले getter ले सही `this` देख्छ", jp: "操作を転送し `receiver` を渡すので、ゲッターが正しい `this` を見るから" },
        { en: "It clones the object first", np: "यसले पहिले object clone गर्छ", jp: "先にオブジェクトを複製するから" },
        { en: "It makes properties private", np: "यसले property private बनाउँछ", jp: "プロパティをプライベートにするから" },
        { en: "It converts the key to a Symbol", np: "यसले key लाई Symbol बनाउँछ", jp: "キーをSymbolに変換するから" },
      ],
      correctIndex: 0,
      explanation: { en: "Without `receiver`, a getter runs against the raw target and skips your traps.", np: "`receiver` नभए, getter कच्चा target मा चल्छ र तपाईंका trap छल्छ।", jp: "`receiver` がないと、ゲッターは生のターゲットで動きトラップを迂回する。" },
    },
    {
      question: { en: "What is the result of `Symbol(\"id\") === Symbol(\"id\")`?", np: "`Symbol(\"id\") === Symbol(\"id\")` को नतिजा के हो?", jp: "`Symbol(\"id\") === Symbol(\"id\")` の結果は?" },
      options: [
        { en: "`true`, because the descriptions match", np: "`true`, किनकि description मिल्छ", jp: "`true`。説明が一致するから" },
        { en: "`false`, because every `Symbol()` call creates a unique value", np: "`false`, किनकि हरेक `Symbol()` call ले अद्वितीय मान बनाउँछ", jp: "`false`。`Symbol()` の呼び出しごとに一意な値ができるから" },
        { en: "`true`, because Symbols are strings", np: "`true`, किनकि Symbol string हुन्", jp: "`true`。Symbolは文字列だから" },
        { en: "It throws an error", np: "यसले error दिन्छ", jp: "エラーになる" },
      ],
      correctIndex: 1,
      explanation: { en: "The description is a debugging label, never an identity.", np: "Description debug को label हो, पहिचान होइन।", jp: "説明はデバッグ用のラベルであり、同一性ではない。" },
    },
    {
      question: { en: "Does a Symbol key make a property genuinely private?", np: "Symbol key ले property साँच्चै private बनाउँछ?", jp: "SymbolキーはプロパティをTrulyプライベートにするか?" },
      options: [
        { en: "Yes, nothing can read it", np: "हो, कसैले पढ्न सक्दैन", jp: "はい、誰も読めない" },
        { en: "Yes, but only in strict mode", np: "हो, तर strict mode मा मात्र", jp: "はい、ただしstrictモードのみ" },
        { en: "No, `Object.getOwnPropertySymbols()` still finds it", np: "होइन, `Object.getOwnPropertySymbols()` ले अझै भेट्टाउँछ", jp: "いいえ、`Object.getOwnPropertySymbols()` で見つかる" },
      ],
      correctIndex: 2,
      explanation: { en: "Symbols give uniqueness, not security. Use `#privateField` for real privacy.", np: "Symbol ले अद्वितीयता दिन्छ, सुरक्षा होइन। साँच्चै privacy लाई `#privateField` प्रयोग गर्नुहोस्।", jp: "Symbolが与えるのは一意性であって機密性ではない。本当のprivateには `#privateField`。" },
    },
    {
      question: { en: "What does `Symbol.for(\"app.id\") === Symbol.for(\"app.id\")` return?", np: "`Symbol.for(\"app.id\") === Symbol.for(\"app.id\")` ले के फर्काउँछ?", jp: "`Symbol.for(\"app.id\") === Symbol.for(\"app.id\")` の結果は?" },
      options: [
        { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
        { en: "`false`", np: "`false`", jp: "`false`" },
        { en: "`true`", np: "`true`", jp: "`true`" },
        { en: "A `TypeError`", np: "एउटा `TypeError`", jp: "`TypeError`" },
      ],
      correctIndex: 2,
      explanation: { en: "`Symbol.for()` looks the key up in a global registry instead of creating a new symbol.", np: "`Symbol.for()` ले नयाँ symbol नबनाई global registry मा key खोज्छ।", jp: "`Symbol.for()` は新規作成ではなくグローバルレジストリからキーを引く。" },
    },
    {
      question: { en: "What is the main advantage of `WeakMap` over `Map`?", np: "`Map` भन्दा `WeakMap` को मुख्य फाइदा के हो?", jp: "`Map` に対する `WeakMap` の主な利点は?" },
      options: [
        { en: "It supports array indexes", np: "यसले array index समर्थन गर्छ", jp: "配列のインデックスに対応する" },
        { en: "It sorts its keys automatically", np: "यसले key स्वतः क्रमबद्ध गर्छ", jp: "キーを自動で整列する" },
        { en: "It can store duplicate keys", np: "यसले दोहोरिएका key राख्न सक्छ", jp: "重複するキーを保存できる" },
        { en: "It does not stop its object keys from being garbage-collected", np: "यसले आफ्ना object key लाई garbage-collect हुनबाट रोक्दैन", jp: "オブジェクトのキーが回収されるのを妨げない" },
      ],
      correctIndex: 3,
      explanation: { en: "A `Map` entry alone is enough to keep an object alive indefinitely.", np: "`Map` को entry मात्रैले object लाई अनिश्चितकालसम्म जीवित राख्न पुग्छ।", jp: "`Map` は項目があるだけでオブジェクトを無期限に生かす。" },
    },
    {
      question: { en: "What happens with `new WeakMap().set(\"user\", 123)`?", np: "`new WeakMap().set(\"user\", 123)` मा के हुन्छ?", jp: "`new WeakMap().set(\"user\", 123)` はどうなるか?" },
      options: [
        { en: "It stores the entry normally", np: "यसले entry सामान्य रूपमा राख्छ", jp: "通常どおり保存される" },
        { en: "It throws a `TypeError` because keys must be objects", np: "यसले `TypeError` दिन्छ किनकि key object हुनुपर्छ", jp: "キーはオブジェクトでなければならないので `TypeError` になる" },
        { en: "It silently converts the key to an object", np: "यसले चुपचाप key लाई object बनाउँछ", jp: "静かにキーをオブジェクトへ変換する" },
      ],
      correctIndex: 1,
      explanation: { en: "Use a plain `Map` when your keys are primitives.", np: "Key primitive भए सामान्य `Map` प्रयोग गर्नुहोस्।", jp: "キーがプリミティブなら素の `Map` を使う。" },
    },
    {
      question: { en: "Why can you not iterate a `WeakMap` or read its `.size`?", np: "`WeakMap` iterate गर्न वा यसको `.size` पढ्न किन मिल्दैन?", jp: "`WeakMap` を反復したり `.size` を読めないのはなぜか?" },
      options: [
        { en: "It would be too slow to compute", np: "गणना गर्न धेरै ढिलो हुन्थ्यो", jp: "計算が遅すぎるから" },
        { en: "Doing so would reveal exactly when the garbage collector ran", np: "त्यसो गरे garbage collector कहिले चल्यो भनी ठ्याक्कै थाहा हुन्थ्यो", jp: "そうするとGCの実行時期が正確に分かってしまうから" },
        { en: "Those methods were removed in a later spec", np: "ती method पछिल्लो spec मा हटाइए", jp: "後の仕様で削除されたから" },
      ],
      correctIndex: 1,
      explanation: { en: "The omissions are deliberate, not an oversight.", np: "यी नराखिनु जानाजान हो, बिर्सिएको होइन।", jp: "この欠落は手抜きではなく意図的なもの。" },
    },
    {
      question: { en: "Which is the best reason <b>not</b> to reach for Proxy?", np: "Proxy प्रयोग <b>नगर्ने</b> उत्तम कारण कुन हो?", jp: "Proxyを<b>使わない</b>最良の理由は?" },
      options: [
        { en: "Interception costs performance and makes code harder to follow", np: "Intercept ले performance खान्छ र code पछ्याउन गाह्रो बनाउँछ", jp: "横取りは性能を食い、コードを追いにくくするから" },
        { en: "It only works in Node.js", np: "यो Node.js मा मात्र काम गर्छ", jp: "Node.jsでしか動かないから" },
        { en: "It cannot be used with classes", np: "यो class सँग प्रयोग गर्न मिल्दैन", jp: "クラスと一緒に使えないから" },
      ],
      correctIndex: 0,
      explanation: { en: "Use it where interception itself earns its place, not because it exists.", np: "Intercept आफैंले ठाउँ कमाउने बेला प्रयोग गर्नुहोस्, भएकै भरमा होइन।", jp: "存在するからではなく、横取りが必要な場面で使う。" },
    },
  ],
  faq: [
    {
      question: { en: "Why use Reflect.get inside a Proxy instead of target[prop]?", np: "Proxy भित्र target[prop] को सट्टा Reflect.get किन?", jp: "Proxy内で target[prop] ではなく Reflect.get を使う理由は？" },
      answer: {
        en: "Because of `receiver`. If the target has a getter that uses `this`, `target[prop]` runs that getter with `this` bound to the target, so the getter sees the raw object and skips your traps. `Reflect.get(target, prop, receiver)` passes the proxy along as `this`, so the getter reads through the proxy and any nested interception still applies. The same holds for `Reflect.set` with setters. If your handler never needs to observe reads made from inside a getter, `target[prop]` works, but forwarding through `Reflect` is the habit that avoids a whole class of subtle bugs.",
        np: "`receiver` का कारण। Target मा `this` प्रयोग गर्ने getter छ भने, `target[prop]` ले त्यो getter लाई `this` target मा bind गरेर चलाउँछ, त्यसैले getter ले कच्चा object देख्छ र तपाईंका trap छल्छ। `Reflect.get(target, prop, receiver)` ले proxy लाई `this` का रूपमा पठाउँछ, त्यसैले getter proxy हुँदै पढ्छ। Setter सँग `Reflect.set` मा पनि उही लागू हुन्छ।",
        jp: "`receiver` のため。ターゲットに `this` を使うゲッターがあると、`target[prop]` は `this` をターゲットに束縛して実行するので、ゲッターは生のオブジェクトを見てトラップを迂回する。`Reflect.get(target, prop, receiver)` はプロキシを `this` として渡すため、ゲッターはプロキシ経由で読み、入れ子の横取りも効く。セッターと `Reflect.set` でも同じ。",
      },
    },
    {
      question: { en: "When should I pick WeakMap over Map?", np: "Map भन्दा WeakMap कहिले छान्ने?", jp: "MapではなくWeakMapを選ぶのはいつか？" },
      answer: {
        en: "Pick `WeakMap` when the keys are objects you did not create and the entry should disappear along with the object — DOM element metadata, per-instance state, or a cache keyed by domain objects. Pick `Map` when you need any of what `WeakMap` deliberately withholds: primitive keys, iteration, `.size`, or entries that must survive independently of their keys. Those omissions are not oversights; enumerating a `WeakMap` would let you observe exactly when the garbage collector ran.",
        np: "Key आफूले नबनाएका object हुन् र object सँगै entry हराउनुपर्छ भने `WeakMap` छान्नुहोस् — DOM element metadata, प्रति-instance अवस्था, वा domain object ले key बनाइएको cache। `WeakMap` ले जानाजान नदिने कुरा चाहिए `Map` छान्नुहोस्: primitive key, iteration, `.size`, वा key भन्दा स्वतन्त्र रूपमा बाँच्नुपर्ने entry।",
        jp: "自分が作っていないオブジェクトがキーで、オブジェクトと一緒に項目も消えるべきなら `WeakMap`。DOM要素のメタデータ、インスタンスごとの状態、ドメインオブジェクトをキーにしたキャッシュなど。`WeakMap` があえて持たないもの、つまりプリミティブのキー・反復・`.size`・キーと独立に残る項目が要るなら `Map`。これらの欠落は手抜きではなく、列挙できるとGCの実行時期が観測できてしまうため。",
      },
    },
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
