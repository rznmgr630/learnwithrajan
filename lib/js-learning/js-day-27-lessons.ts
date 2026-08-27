import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_27_LESSONS: JsLessonDay = {
  day: 27,
  title: { en: "Advanced JavaScript — Proxy, Reflect, Symbols & WeakMap", np: "Advanced JavaScript — Proxy, Reflect, Symbol र WeakMap", jp: "上級JavaScript — Proxy・Reflect・Symbol・WeakMap" },
  totalMinutes: 34,
  difficulty: { en: "Advanced", np: "उन्नत", jp: "上級" },
  lessons: [
    {
      id: "proxy",
      title: { en: "Proxy — intercept object operations", np: "Proxy — object operation intercept गर्नु", jp: "Proxy — オブジェクト操作を横取りする" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>Proxy</b> wraps an object and lets you step in whenever someone reads from it, writes to it, or asks it a question. To <i>intercept</i> here just means \"run your code first, then decide what happens\".\n\nNormally `user.name` goes straight to the object. With a proxy in the way, the read passes through your code first:\n\n```text\nCode\n │\n │ user.name\n ▼\nProxy\n │\n │ get trap\n ▼\nTarget object\n │\n ▼\n\"Alice\"\n```\n\nThree words to know:\n\n• the <b>target</b> is the original object being wrapped\n• the <b>handler</b> is the object holding your functions\n• a <b>trap</b> is one of those functions, each catching one kind of operation\n\n---\n\n### 1. Basic — watch what happens\n\n```javascript\nconst user = { name: \"Alice\", age: 30 };\n\nconst proxy = new Proxy(user, {\n  get(target, property) {\n    console.log(`Reading ${property}`);\n    return target[property];\n  },\n\n  set(target, property, value) {\n    console.log(`Writing ${property} = ${value}`);\n    target[property] = value;\n    return true;\n  }\n});\n\nproxy.name;     // logs \"Reading name\", gives back \"Alice\"\nproxy.age = 31; // logs \"Writing age = 31\"\n```\n\n---\n\n### 2. Intermediate — refuse bad data\n\nBecause the `set` trap runs before the write lands, it can reject the value:\n\n```javascript\nconst user = new Proxy({}, {\n  set(target, property, value) {\n    if (property === \"age\") {\n      if (typeof value !== \"number\" || value < 0) {\n        throw new TypeError(\"Age must be a positive number\");\n      }\n    }\n\n    target[property] = value;\n    return true;\n  }\n});\n\nuser.age = 30;   // fine\nuser.age = -5;   // TypeError\n```\n\n> <b>A `set` trap must return `true`.</b> That is how it reports \"I handled the write\". Returning nothing counts as `false`, and in strict mode that throws.\n\n---\n\n### 3. Advanced — the idea behind reactive frameworks\n\nIf a `get` trap records <i>who</i> read a value, and a `set` trap tells those readers it changed, you have the core of a reactive system — the mechanism Vue uses to re-render when data changes:\n\n```javascript\nfunction reactive(object) {\n  return new Proxy(object, {\n    get(target, property) {\n      // remember that something read this property\n      return target[property];\n    },\n\n    set(target, property, value) {\n      target[property] = value;\n      // tell whoever read it that it changed\n      return true;\n    }\n  });\n}\n```\n\n---\n\n### The traps you can define\n\n```text\nget(target, prop, receiver)          reading a property\nset(target, prop, value, receiver)   writing a property\nhas(target, prop)                    'key' in obj\ndeleteProperty(target, prop)         delete obj.key\nownKeys(target)                      Object.keys(obj)\napply(target, thisArg, args)         calling a function\nconstruct(target, args)              new Fn()\n```\n\nOne thing to keep straight: a proxy <b>wraps</b> the target, it does not replace it. The original object is still there, and code holding a direct reference to it can change it without any trap firing.",
        np: "<b>Proxy</b> ले object लाई बेर्छ र कसैले त्यसबाट पढ्दा, लेख्दा वा सोध्दा तपाईंलाई बीचमा पस्न दिन्छ। यहाँ <i>intercept</i> को अर्थ \"पहिले तपाईंको code चलाऊ, अनि के हुने तय गर\" भन्ने मात्र हो।\n\nसामान्यतया `user.name` सिधै object मा जान्छ। बीचमा proxy भए, पढाइ पहिले तपाईंको code हुँदै जान्छ:\n\n```text\nCode\n │\n │ user.name\n ▼\nProxy\n │\n │ get trap\n ▼\nTarget object\n │\n ▼\n\"Alice\"\n```\n\nतीन शब्द जान्नुहोस्:\n\n• <b>target</b> बेरिएको मूल object हो\n• <b>handler</b> तपाईंका function राख्ने object हो\n• <b>trap</b> ती मध्ये एउटा function हो, हरेकले एक किसिमको operation समात्छ\n\n---\n\n### 1. आधारभूत — के हुँदैछ हेर्नुहोस्\n\n```javascript\nconst user = { name: \"Alice\", age: 30 };\n\nconst proxy = new Proxy(user, {\n  get(target, property) {\n    console.log(`Reading ${property}`);\n    return target[property];\n  },\n\n  set(target, property, value) {\n    console.log(`Writing ${property} = ${value}`);\n    target[property] = value;\n    return true;\n  }\n});\n\nproxy.name;     // \"Reading name\" log गर्छ, \"Alice\" फर्काउँछ\nproxy.age = 31; // \"Writing age = 31\" log गर्छ\n```\n\n---\n\n### 2. मध्यम — नराम्रो data अस्वीकार गर्नुहोस्\n\n`set` trap लेखाइ हुनुअघि चल्ने भएकाले, यसले मान अस्वीकार गर्न सक्छ:\n\n```javascript\nconst user = new Proxy({}, {\n  set(target, property, value) {\n    if (property === \"age\") {\n      if (typeof value !== \"number\" || value < 0) {\n        throw new TypeError(\"Age must be a positive number\");\n      }\n    }\n\n    target[property] = value;\n    return true;\n  }\n});\n\nuser.age = 30;   // ठीकै\nuser.age = -5;   // TypeError\n```\n\n> <b>`set` trap ले `true` फर्काउनैपर्छ।</b> यसै गरी यसले \"मैले लेखाइ सम्हालें\" भन्छ। केही नफर्काउनु `false` सरह हो, र strict mode मा त्यसले error दिन्छ।\n\n---\n\n### 3. उन्नत — reactive framework पछाडिको विचार\n\n`get` trap ले <i>कसले</i> मान पढ्यो टिप्छ, र `set` trap ले तिनलाई बदलियो भन्छ भने, तपाईंसँग reactive system को सार हुन्छ — data बदलिँदा Vue ले फेरि render गर्न प्रयोग गर्ने संयन्त्र:\n\n```javascript\nfunction reactive(object) {\n  return new Proxy(object, {\n    get(target, property) {\n      // कसैले यो property पढ्यो भनी सम्झनुहोस्\n      return target[property];\n    },\n\n    set(target, property, value) {\n      target[property] = value;\n      // पढ्नेलाई बदलियो भन्नुहोस्\n      return true;\n    }\n  });\n}\n```\n\n---\n\n### तपाईंले परिभाषित गर्न सक्ने trap\n\n```text\nget(target, prop, receiver)          property पढ्दा\nset(target, prop, value, receiver)   property लेख्दा\nhas(target, prop)                    'key' in obj\ndeleteProperty(target, prop)         delete obj.key\nownKeys(target)                      Object.keys(obj)\napply(target, thisArg, args)         function बोलाउँदा\nconstruct(target, args)              new Fn()\n```\n\nएउटा कुरा प्रस्ट राख्नुहोस्: proxy ले target <b>बेर्छ</b>, प्रतिस्थापन गर्दैन। मूल object त्यहीँ छ, र त्यसको सिधा reference भएको code ले कुनै trap नचलाई बदल्न सक्छ।",
        jp: "<b>Proxy</b> はオブジェクトを包み、誰かが読み・書き・問い合わせをするたびに割り込めるようにする。ここでの<i>横取り</i>とは「まず自分のコードを走らせ、そのうえで何が起きるかを決める」という意味にすぎない。\n\n普段 `user.name` はそのままオブジェクトへ届く。あいだにプロキシがあると、読み取りはまずこちらのコードを通る:\n\n```text\nCode\n │\n │ user.name\n ▼\nProxy\n │\n │ get trap\n ▼\nTarget object\n │\n ▼\n\"Alice\"\n```\n\n覚える語は3つ:\n\n• <b>ターゲット</b>は包まれる元のオブジェクト\n• <b>ハンドラー</b>は自分の関数を持つオブジェクト\n• <b>トラップ</b>はその関数のひとつで、1種類の操作を捕まえる\n\n---\n\n### 1. 基本 — 何が起きているか見る\n\n```javascript\nconst user = { name: \"Alice\", age: 30 };\n\nconst proxy = new Proxy(user, {\n  get(target, property) {\n    console.log(`Reading ${property}`);\n    return target[property];\n  },\n\n  set(target, property, value) {\n    console.log(`Writing ${property} = ${value}`);\n    target[property] = value;\n    return true;\n  }\n});\n\nproxy.name;     // \"Reading name\" を出し、\"Alice\" を返す\nproxy.age = 31; // \"Writing age = 31\" を出す\n```\n\n---\n\n### 2. 中級 — 不正なデータを拒む\n\n`set` トラップは書き込みが着地する前に走るので、値を拒否できる:\n\n```javascript\nconst user = new Proxy({}, {\n  set(target, property, value) {\n    if (property === \"age\") {\n      if (typeof value !== \"number\" || value < 0) {\n        throw new TypeError(\"Age must be a positive number\");\n      }\n    }\n\n    target[property] = value;\n    return true;\n  }\n});\n\nuser.age = 30;   // 通る\nuser.age = -5;   // TypeError\n```\n\n> <b>`set` トラップは `true` を返さねばならない。</b>それが「書き込みを処理した」という報告になる。何も返さないと `false` 扱いで、strictモードでは例外になる。\n\n---\n\n### 3. 上級 — リアクティブなフレームワークの土台\n\n`get` トラップが<i>誰が</i>読んだかを記録し、`set` トラップがその読み手へ変化を伝えるなら、それはリアクティブ実装の核心そのもの。Vueがデータの変化で再描画するのに使う仕組みだ:\n\n```javascript\nfunction reactive(object) {\n  return new Proxy(object, {\n    get(target, property) {\n      // 誰かがこのプロパティを読んだと覚えておく\n      return target[property];\n    },\n\n    set(target, property, value) {\n      target[property] = value;\n      // 読んだ相手に変わったと伝える\n      return true;\n    }\n  });\n}\n```\n\n---\n\n### 定義できるトラップ\n\n```text\nget(target, prop, receiver)          プロパティの読み取り\nset(target, prop, value, receiver)   プロパティの書き込み\nhas(target, prop)                    'key' in obj\ndeleteProperty(target, prop)         delete obj.key\nownKeys(target)                      Object.keys(obj)\napply(target, thisArg, args)         関数の呼び出し\nconstruct(target, args)              new Fn()\n```\n\nひとつ押さえておくこと。プロキシはターゲットを<b>包む</b>のであって置き換えない。元のオブジェクトは残っており、それを直接参照するコードはトラップを一切通さずに書き換えられる。",
      },
      diagram: `A read, with and without a proxy

Without                        With

code                           code
 │                              │
 │ user.name                    │ user.name
 ▼                              ▼
target                        Proxy
 │                              │ get trap runs
 ▼                              ▼
"Alice"                       target
                                │
                                ▼
                              "Alice"


The three pieces

new Proxy(target, handler)
            │        │
            │        └── holds the traps
            └── the original object, still reachable


A set trap has one obligation

set(target, prop, value) {
  target[prop] = value;
  return true;      ← "I handled it". Without this, strict mode throws.
}`,
      codeExample: {
        title: { en: "Traps, validation and reactivity", np: "Trap, validation र reactivity", jp: "トラップ・検証・リアクティビティ" },
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
      keyTakeaways: [
        { en: "A <b>Proxy</b> wraps a target object and runs your code before an operation reaches it.", np: "<b>Proxy</b> ले target object बेर्छ र operation त्यहाँ पुग्नुअघि तपाईंको code चलाउँछ।", jp: "<b>Proxy</b> はターゲットを包み、操作が届く前に自分のコードを走らせる。" },
        { en: "The <b>target</b> is the original object, the <b>handler</b> holds your functions, and each function is a <b>trap</b>.", np: "<b>Target</b> मूल object हो, <b>handler</b> ले तपाईंका function राख्छ, र हरेक function एउटा <b>trap</b> हो।", jp: "<b>ターゲット</b>が元のオブジェクト、<b>ハンドラー</b>が関数を持ち、各関数が<b>トラップ</b>。" },
        { en: "Traps exist for reads, writes, `in`, `delete`, `Object.keys`, calls and `new`.", np: "पढाइ, लेखाइ, `in`, `delete`, `Object.keys`, call र `new` का लागि trap छन्।", jp: "読み・書き・`in`・`delete`・`Object.keys`・呼び出し・`new` にトラップがある。" },
        { en: "A `set` trap must <b>return `true`</b>, otherwise strict mode treats the write as refused and throws.", np: "`set` trap ले <b>`true` फर्काउनैपर्छ</b>, नत्र strict mode ले लेखाइ अस्वीकार भएको ठानी error दिन्छ।", jp: "`set` トラップは<b>`true` を返す</b>必要がある。さもないとstrictモードは拒否とみなして例外を投げる。" },
        { en: "A proxy <b>wraps</b> the target; direct access to the original still bypasses every trap.", np: "Proxy ले target <b>बेर्छ</b>; मूलमा सिधै पहुँच गर्दा अझै हरेक trap छल्छ।", jp: "プロキシはターゲットを<b>包む</b>だけ。元へ直接触れればトラップはすべて素通りされる。" },
        { en: "Recording reads in `get` and announcing writes in `set` is the core of a <b>reactive system</b>.", np: "`get` मा पढाइ टिप्नु र `set` मा लेखाइ सुनाउनु <b>reactive system</b> को सार हो।", jp: "`get` で読みを記録し `set` で書きを告げるのが<b>リアクティブ実装</b>の核心。" },
      ],
      commonMistakes: [
        { en: "<b>Forgetting `return true` in a `set` trap</b> — the write appears to work in sloppy mode and throws a `TypeError` in strict mode, which is where module code runs.", np: "<b>`set` trap मा `return true` बिर्सनु</b> — sloppy mode मा लेखाइ भएजस्तो देखिन्छ र strict mode मा `TypeError` दिन्छ, जहाँ module code चल्छ।", jp: "<b>`set` トラップで `return true` を忘れる</b> — 非strictでは書けたように見え、モジュールが走るstrictモードでは `TypeError` になる。" },
        { en: "<b>Assuming the proxy replaces the target</b> — anything still holding the original object writes to it directly, and no trap runs.", np: "<b>Proxy ले target प्रतिस्थापन गर्छ भन्ने ठान्नु</b> — मूल object समातिरहेको जुनसुकैले सिधै लेख्छ, र कुनै trap चल्दैन।", jp: "<b>プロキシがターゲットを置き換えると思う</b> — 元のオブジェクトを持つ側は直接書き込め、トラップは動かない。" },
        { en: "<b>Putting a proxy on a hot path</b> — every intercepted operation costs more than a plain property access, so use it where interception is the point.", np: "<b>Hot path मा proxy राख्नु</b> — intercept भएको हरेक operation सादा property पहुँच भन्दा महँगो हुन्छ, त्यसैले intercept नै उद्देश्य भएको ठाउँमा प्रयोग गर्नुहोस्।", jp: "<b>ホットパスにプロキシを置く</b> — 横取りされた操作は素のプロパティ参照より高くつく。横取り自体が目的の場所で使う。" },
      ],
      quiz: [
        {
          question: { en: "What does a Proxy primarily let you do?", np: "Proxy ले मुख्यतः के गर्न दिन्छ?", jp: "Proxyが主に可能にすることは?" },
          options: [
            { en: "Create private variables", np: "Private variable बनाउन", jp: "プライベート変数を作る" },
            { en: "Make an object immutable", np: "Object अपरिवर्तनीय बनाउन", jp: "オブジェクトを不変にする" },
            { en: "Run your code when an operation is performed on an object", np: "Object मा operation हुँदा आफ्नो code चलाउन", jp: "オブジェクトへの操作時に自分のコードを走らせる" },
            { en: "Deep-clone an object", np: "Object deep-clone गर्न", jp: "オブジェクトをディープコピーする" },
          ],
          correctIndex: 2,
          explanation: { en: "Reads, writes, `in`, `delete`, `Object.keys` and calls can all be trapped.", np: "पढाइ, लेखाइ, `in`, `delete`, `Object.keys` र call सबै trap गर्न सकिन्छ।", jp: "読み・書き・`in`・`delete`・`Object.keys`・呼び出しをすべて捕まえられる。" },
        },
        {
          question: { en: "Why must a `set` trap return `true`?", np: "`set` trap ले `true` किन फर्काउनुपर्छ?", jp: "`set` トラップが `true` を返すべき理由は?" },
          options: [
            { en: "It signals the write was handled; anything falsy throws in strict mode", np: "यसले लेखाइ सम्हालियो भन्छ; falsy मानले strict mode मा error दिन्छ", jp: "書き込みを処理したと示すため。falsyな値はstrictモードで例外になる" },
            { en: "It makes the property read-only", np: "यसले property read-only बनाउँछ", jp: "プロパティを読み取り専用にするため" },
            { en: "It caches the value", np: "यसले मान cache गर्छ", jp: "値をキャッシュするため" },
          ],
          correctIndex: 0,
          explanation: { en: "Returning nothing counts as `false`, which strict mode reports as a `TypeError`.", np: "केही नफर्काउनु `false` सरह हो, जसलाई strict mode ले `TypeError` भन्छ।", jp: "何も返さないのは `false` 扱いで、strictモードでは `TypeError`。" },
        },
        {
          question: { en: "What is the `target` in `new Proxy(target, handler)`?", np: "`new Proxy(target, handler)` मा `target` के हो?", jp: "`new Proxy(target, handler)` の `target` とは?" },
          options: [
            { en: "The object holding the trap functions", np: "Trap function राख्ने object", jp: "トラップ関数を持つオブジェクト" },
            { en: "The original object being wrapped", np: "बेरिएको मूल object", jp: "包まれる元のオブジェクト" },
            { en: "The value returned from a trap", np: "Trap बाट फर्केको मान", jp: "トラップが返した値" },
          ],
          correctIndex: 1,
          explanation: { en: "The handler is the second argument; each of its functions is a trap.", np: "Handler दोस्रो argument हो; यसका हरेक function trap हुन्।", jp: "ハンドラーは第2引数で、その各関数がトラップ。" },
        },
        {
          question: { en: "Which pair of traps forms the core of a reactive system?", np: "कुन जोडी trap ले reactive system को सार बनाउँछ?", jp: "リアクティブ実装の核心をなすトラップの組は?" },
          options: [
            { en: "`get` to record who read, and `set` to announce a change", np: "कसले पढ्यो टिप्न `get`, र बदलाव सुनाउन `set`", jp: "誰が読んだかを記録する `get` と、変化を告げる `set`" },
            { en: "`has` and `ownKeys`", np: "`has` and `ownKeys`", jp: "`has` and `ownKeys`" },
            { en: "`apply` and `construct`", np: "`apply` and `construct`", jp: "`apply` and `construct`" },
          ],
          correctIndex: 0,
          explanation: { en: "That is the mechanism behind Vue re-rendering when data changes.", np: "Data बदलिँदा Vue ले फेरि render गर्ने संयन्त्र यही हो।", jp: "データの変化でVueが再描画する仕組みがこれ。" },
        },
        {
          question: { en: "Does wrapping an object in a Proxy protect the original?", np: "Object लाई Proxy मा बेर्दा मूल जोगिन्छ?", jp: "Proxyで包めば元のオブジェクトは守られるか?" },
          options: [
            { en: "Yes, the target becomes unreachable", np: "हो, target मा पुग्न सकिँदैन", jp: "はい、ターゲットに到達できなくなる" },
            { en: "No, code holding the target writes to it with no trap firing", np: "होइन, target समातेको code ले trap नचलाई लेख्छ", jp: "いいえ。ターゲットを持つコードはトラップを通さず書き込める" },
            { en: "Only for reads, not writes", np: "पढाइका लागि मात्र, लेखाइका लागि होइन", jp: "読み取りだけ守られ、書き込みは守られない" },
          ],
          correctIndex: 1,
          explanation: { en: "A proxy is a wrapper, not a replacement.", np: "Proxy बेर्ने हो, प्रतिस्थापन होइन।", jp: "プロキシは包むものであって、置き換えではない。" },
        },
      ],
      youtubeIds: ["sClk6aB_CPk"],
    },
    {
      id: "reflect",
      title: { en: "Reflect — performing the same operations", np: "Reflect — उही operation गर्नु", jp: "Reflect — 同じ操作を実行する" },
      durationMinutes: 8,
      explanation: {
        en: "<b>Reflect</b> is a built-in object holding one function for every basic thing you can do to an object. `Reflect.get(user, \"name\")` does what `user.name` does; `Reflect.has(user, \"name\")` does what `\"name\" in user` does.\n\nThat sounds redundant on its own. It becomes useful inside a Proxy handler, where you often want to say \"do the normal thing\" after your code has run.\n\n```text\nProxy\n  ↓ intercepts\nObject operation\n\nReflect\n  ↓ performs\nObject operation\n```\n\nEvery trap has a matching `Reflect` method with the same arguments, so forwarding is a one-liner:\n\n```javascript\nconst proxy = new Proxy(user, {\n  get(target, property, receiver) {\n    return Reflect.get(target, property, receiver);\n  }\n});\n```\n\n---\n\n### Why not just `target[property]`?\n\nMost of the time it works. It breaks when the target has a <b>getter</b> — a property defined as a function that computes its value:\n\n```javascript\nconst person = {\n  firstName: \"Rajan\",\n\n  get greeting() {\n    return `Hello ${this.firstName}`;\n  }\n};\n```\n\nNotice the getter uses `this`. When you write `target[property]`, that getter runs with `this` pointing at the <b>raw target</b>, so it reads straight from the original object and skips your traps entirely.\n\n`Reflect.get(target, property, receiver)` passes the <i>receiver</i> — the object the read was originally made on, which is your proxy — so the getter's `this` is the proxy and nested reads go through your handler as expected.\n\n```javascript\nconst proxy = new Proxy(person, {\n  get(target, property, receiver) {\n    return Reflect.get(target, property, receiver);\n  }\n});\n\nproxy.greeting;   // \"Hello Rajan\", read through the proxy\n```\n\nThe same applies to `Reflect.set` with setters.\n\n---\n\n### The methods\n\n```javascript\nReflect.get(obj, \"name\");             // obj.name\nReflect.set(obj, \"age\", 31);          // obj.age = 31\nReflect.has(obj, \"name\");             // \"name\" in obj\nReflect.deleteProperty(obj, \"temp\");  // delete obj.temp\nReflect.ownKeys(obj);                 // string keys plus symbols\nReflect.apply(fn, thisArg, [a, b]);   // fn.apply(thisArg, [a, b])\nReflect.construct(Cls, [a, b]);       // new Cls(a, b)\n```\n\nThere is a second, smaller benefit: these return values instead of throwing. `Reflect.deleteProperty(obj, key)` gives back `true` or `false`, where `delete` in strict mode can throw.",
        np: "<b>Reflect</b> भित्रैको object हो जसमा object मा गर्न सकिने हरेक आधारभूत कामका लागि एउटा function छ। `Reflect.get(user, \"name\")` ले `user.name` ले गर्ने काम गर्छ; `Reflect.has(user, \"name\")` ले `\"name\" in user` ले गर्ने।\n\nआफैंमा यो दोहोरो जस्तो सुनिन्छ। Proxy handler भित्र यो उपयोगी बन्छ, जहाँ तपाईंको code चलेपछि प्रायः \"सामान्य काम गर\" भन्न चाहनुहुन्छ।\n\n```text\nProxy\n  ↓ intercept गर्छ\nObject operation\n\nReflect\n  ↓ गर्छ\nObject operation\n```\n\nहरेक trap सँग उही argument भएको `Reflect` method छ, त्यसैले forward गर्नु एक लाइनको काम हो:\n\n```javascript\nconst proxy = new Proxy(user, {\n  get(target, property, receiver) {\n    return Reflect.get(target, property, receiver);\n  }\n});\n```\n\n---\n\n### `target[property]` ले किन नपुग्ने?\n\nधेरैजसो बेला पुग्छ। Target मा <b>getter</b> — मान गणना गर्ने function का रूपमा परिभाषित property — हुँदा भाँचिन्छ:\n\n```javascript\nconst person = {\n  firstName: \"Rajan\",\n\n  get greeting() {\n    return `Hello ${this.firstName}`;\n  }\n};\n```\n\nGetter ले `this` प्रयोग गरेको ख्याल गर्नुहोस्। `target[property]` लेख्दा, त्यो getter `this` ले <b>कच्चा target</b> लाई देखाउँदै चल्छ, त्यसैले यसले सिधै मूल object बाट पढ्छ र तपाईंका trap पूरै छल्छ।\n\n`Reflect.get(target, property, receiver)` ले <i>receiver</i> — पढाइ मूलतः जुन object मा भएको थियो, अर्थात् तपाईंको proxy — पठाउँछ, त्यसैले getter को `this` proxy हुन्छ र भित्री पढाइ अपेक्षाअनुसार तपाईंको handler हुँदै जान्छ।\n\n```javascript\nconst proxy = new Proxy(person, {\n  get(target, property, receiver) {\n    return Reflect.get(target, property, receiver);\n  }\n});\n\nproxy.greeting;   // \"Hello Rajan\", proxy हुँदै पढिएको\n```\n\nSetter सँग `Reflect.set` मा पनि उही लागू हुन्छ।\n\n---\n\n### Method हरू\n\n```javascript\nReflect.get(obj, \"name\");             // obj.name\nReflect.set(obj, \"age\", 31);          // obj.age = 31\nReflect.has(obj, \"name\");             // \"name\" in obj\nReflect.deleteProperty(obj, \"temp\");  // delete obj.temp\nReflect.ownKeys(obj);                 // string key र symbol\nReflect.apply(fn, thisArg, [a, b]);   // fn.apply(thisArg, [a, b])\nReflect.construct(Cls, [a, b]);       // new Cls(a, b)\n```\n\nदोस्रो, सानो फाइदा पनि छ: यी error दिनुको सट्टा मान फर्काउँछन्। `Reflect.deleteProperty(obj, key)` ले `true` वा `false` दिन्छ, जहाँ strict mode मा `delete` ले error दिन सक्छ।",
        jp: "<b>Reflect</b> は組み込みのオブジェクトで、オブジェクトに対してできる基本操作それぞれに対応する関数を持つ。`Reflect.get(user, \"name\")` は `user.name` と同じことをし、`Reflect.has(user, \"name\")` は `\"name\" in user` と同じことをする。\n\nそれだけなら冗長に聞こえる。役に立つのはProxyのハンドラーの中で、自分のコードを走らせた後に「通常どおりの処理をして」と言いたいときだ。\n\n```text\nProxy\n  ↓ 横取りする\nObject operation\n\nReflect\n  ↓ 実行する\nObject operation\n```\n\n各トラップには同じ引数の `Reflect` メソッドがあるので、転送は1行で済む:\n\n```javascript\nconst proxy = new Proxy(user, {\n  get(target, property, receiver) {\n    return Reflect.get(target, property, receiver);\n  }\n});\n```\n\n---\n\n### なぜ `target[property]` では足りないのか\n\nたいていは足りる。破綻するのは、ターゲットに<b>ゲッター</b>、つまり値を計算する関数として定義されたプロパティがあるときだ:\n\n```javascript\nconst person = {\n  firstName: \"Rajan\",\n\n  get greeting() {\n    return `Hello ${this.firstName}`;\n  }\n};\n```\n\nゲッターが `this` を使っている点に注目。`target[property]` と書くと、そのゲッターは `this` が<b>生のターゲット</b>を指した状態で走るので、元のオブジェクトから直接読み、トラップを完全に迂回する。\n\n`Reflect.get(target, property, receiver)` は<i>receiver</i>、つまり読み取りが本来行われた相手であるプロキシを渡す。だからゲッターの `this` はプロキシになり、入れ子の読み取りも期待どおりハンドラーを通る。\n\n```javascript\nconst proxy = new Proxy(person, {\n  get(target, property, receiver) {\n    return Reflect.get(target, property, receiver);\n  }\n});\n\nproxy.greeting;   // \"Hello Rajan\"、プロキシ経由で読まれる\n```\n\nセッターと `Reflect.set` でも同じ。\n\n---\n\n### メソッド一覧\n\n```javascript\nReflect.get(obj, \"name\");             // obj.name\nReflect.set(obj, \"age\", 31);          // obj.age = 31\nReflect.has(obj, \"name\");             // \"name\" in obj\nReflect.deleteProperty(obj, \"temp\");  // delete obj.temp\nReflect.ownKeys(obj);                 // 文字列キーとシンボル\nReflect.apply(fn, thisArg, [a, b]);   // fn.apply(thisArg, [a, b])\nReflect.construct(Cls, [a, b]);       // new Cls(a, b)\n```\n\nもうひとつ小さな利点。これらは例外ではなく値を返す。`Reflect.deleteProperty(obj, key)` は `true` か `false` を返すが、strictモードの `delete` は例外を投げうる。",
      },
      diagram: `Two halves of the same job

Proxy                Reflect
  │                     │
  │ intercepts          │ performs
  ▼                     ▼
   an object operation


Why receiver matters

target[property]                 Reflect.get(target, prop, receiver)
       │                                        │
       ▼                                        ▼
getter runs with                        getter runs with
this = raw target                       this = the proxy
       │                                        │
       ▼                                        ▼
reads bypass your traps                 reads go through your traps


Trap and method, one for one

get             → Reflect.get
set             → Reflect.set
has             → Reflect.has
deleteProperty  → Reflect.deleteProperty
ownKeys         → Reflect.ownKeys
apply           → Reflect.apply
construct       → Reflect.construct`,
      codeExample: {
        title: { en: "Forwarding an operation correctly", np: "Operation सही ढंगले forward गर्नु", jp: "操作を正しく転送する" },
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
      keyTakeaways: [
        { en: "<b>`Reflect`</b> holds one function per fundamental object operation, mirroring the Proxy traps exactly.", np: "<b>`Reflect`</b> सँग हरेक आधारभूत object operation का लागि एउटा function छ, Proxy trap सँग ठ्याक्कै मिल्ने।", jp: "<b>`Reflect`</b> は基本操作ごとに関数を持ち、Proxyのトラップと正確に対応する。" },
        { en: "Inside a handler, `Reflect` is how you say \"now do the normal thing\".", np: "Handler भित्र, \"अब सामान्य काम गर\" भन्ने तरिका `Reflect` हो।", jp: "ハンドラーの中で「では通常の処理を」と言う手段が `Reflect`。" },
        { en: "The <b>receiver</b> is the object the operation was originally performed on — your proxy.", np: "<b>Receiver</b> operation मूलतः जुन object मा भएको थियो त्यही हो — तपाईंको proxy।", jp: "<b>receiver</b> は操作が本来行われた相手、つまりあなたのプロキシ。" },
        { en: "Passing `receiver` keeps a getter's `this` pointing at the proxy, so nested reads stay intercepted.", np: "`receiver` पठाउँदा getter को `this` proxy मै रहन्छ, त्यसैले भित्री पढाइ intercept भइरहन्छ।", jp: "`receiver` を渡せばゲッターの `this` はプロキシのままで、入れ子の読み取りも横取りされ続ける。" },
        { en: "`Reflect` methods return values rather than throwing, which makes them easier to compose.", np: "`Reflect` का method error दिनुको सट्टा मान फर्काउँछन्, जसले जोड्न सजिलो बनाउँछ।", jp: "`Reflect` のメソッドは例外ではなく値を返すので、組み合わせやすい。" },
      ],
      commonMistakes: [
        { en: "<b>Forwarding with `target[prop]`</b> — it works until the target has a getter that uses `this`, and then reads silently bypass your traps.", np: "<b>`target[prop]` ले forward गर्नु</b> — target मा `this` प्रयोग गर्ने getter नआएसम्म चल्छ, अनि पढाइ चुपचाप तपाईंका trap छल्छ।", jp: "<b>`target[prop]` で転送する</b> — `this` を使うゲッターが現れるまでは動くが、その後は読み取りが黙ってトラップを迂回する。" },
        { en: "<b>Dropping the `receiver` argument</b> — `Reflect.get(target, prop)` without it behaves like `target[prop]`, so the fix only works when you pass it through.", np: "<b>`receiver` argument छाड्नु</b> — यसबिना `Reflect.get(target, prop)` `target[prop]` जस्तै व्यवहार गर्छ, त्यसैले पठाउँदा मात्र समाधान काम गर्छ।", jp: "<b>`receiver` を渡し忘れる</b> — 無しの `Reflect.get(target, prop)` は `target[prop]` と同じ挙動になり、対策にならない。" },
        { en: "<b>Assuming `Reflect` is only for proxies</b> — `Reflect.has` and `Reflect.ownKeys` are useful anywhere you want an expression instead of an operator.", np: "<b>`Reflect` proxy का लागि मात्र हो भन्ने ठान्नु</b> — operator होइन expression चाहिने जुनसुकै ठाउँमा `Reflect.has` र `Reflect.ownKeys` उपयोगी छन्।", jp: "<b>`Reflect` はプロキシ専用だと思う</b> — 演算子ではなく式が欲しい場面なら、`Reflect.has` や `Reflect.ownKeys` はどこでも役立つ。" },
      ],
      quiz: [
        {
          question: { en: "Why is `Reflect.get()` preferred over `target[prop]` inside a Proxy?", np: "Proxy भित्र `target[prop]` भन्दा `Reflect.get()` किन रोजिन्छ?", jp: "Proxy内で `target[prop]` より `Reflect.get()` が好まれる理由は?" },
          options: [
            { en: "It makes properties private", np: "यसले property private बनाउँछ", jp: "プロパティをプライベートにするから" },
            { en: "It passes `receiver`, so a getter's `this` is the proxy rather than the raw target", np: "यसले `receiver` पठाउँछ, त्यसैले getter को `this` कच्चा target होइन proxy हुन्छ", jp: "`receiver` を渡すので、ゲッターの `this` が生のターゲットではなくプロキシになるから" },
            { en: "It clones the object first", np: "यसले पहिले object clone गर्छ", jp: "先にオブジェクトを複製するから" },
            { en: "It converts the key to a Symbol", np: "यसले key लाई Symbol बनाउँछ", jp: "キーをSymbolに変換するから" },
          ],
          correctIndex: 1,
          explanation: { en: "Without it, a getter reads straight from the target and skips your traps.", np: "यसबिना, getter सिधै target बाट पढ्छ र तपाईंका trap छल्छ।", jp: "無ければ、ゲッターはターゲットから直接読みトラップを飛ばす。" },
        },
        {
          question: { en: "What is the `receiver`?", np: "`receiver` के हो?", jp: "`receiver` とは何か?" },
          options: [
            { en: "The value being written", np: "लेखिँदै गरेको मान", jp: "書き込まれる値" },
            { en: "The object the operation was originally performed on", np: "Operation मूलतः जुन object मा भएको थियो", jp: "操作が本来行われた相手のオブジェクト" },
            { en: "The handler object", np: "Handler object", jp: "ハンドラーのオブジェクト" },
          ],
          correctIndex: 1,
          explanation: { en: "Inside a proxy handler, that is the proxy itself.", np: "Proxy handler भित्र, त्यो proxy आफैं हो।", jp: "プロキシのハンドラー内では、それはプロキシ自身。" },
        },
        {
          question: { en: "How many `Reflect` methods correspond to Proxy traps?", np: "कति `Reflect` method Proxy trap सँग मिल्छन्?", jp: "Proxyのトラップに対応する `Reflect` メソッドはどれだけあるか?" },
          options: [
            { en: "One for every trap, with the same arguments", np: "हरेक trap का लागि एउटा, उही argument सहित", jp: "すべてのトラップに1つずつ、同じ引数で" },
            { en: "Only `get` and `set`", np: "`get` र `set` मात्र", jp: "`get` と `set` だけ" },
            { en: "None, they are unrelated APIs", np: "कुनै पनि होइन, ती असम्बन्धित API हुन्", jp: "ない。無関係なAPI" },
          ],
          correctIndex: 0,
          explanation: { en: "That is what makes forwarding a one-line call.", np: "त्यसैले forward गर्नु एक लाइनको call बन्छ।", jp: "だから転送が1行の呼び出しで済む。" },
        },
        {
          question: { en: "What does `Reflect.deleteProperty(obj, key)` return?", np: "`Reflect.deleteProperty(obj, key)` ले के फर्काउँछ?", jp: "`Reflect.deleteProperty(obj, key)` は何を返すか?" },
          options: [
            { en: "The deleted value", np: "मेटिएको मान", jp: "削除された値" },
            { en: "`true` or `false`", np: "`true` वा `false`", jp: "`true` か `false`" },
            { en: "Nothing, it throws on failure", np: "केही होइन, असफल भए error दिन्छ", jp: "何も返さず、失敗時は例外" },
          ],
          correctIndex: 1,
          explanation: { en: "Returning a value instead of throwing makes it easier to compose.", np: "Error दिनुको सट्टा मान फर्काउँदा जोड्न सजिलो हुन्छ।", jp: "例外ではなく値を返すので組み合わせやすい。" },
        },
      ],
    },
    {
      id: "symbols",
      title: { en: "Symbols — unique keys and built-in protocols", np: "Symbol — अद्वितीय key र भित्रैका protocol", jp: "Symbol — 一意なキーと組み込みプロトコル" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>Symbol</b> is a value that is guaranteed to be unlike any other value, even one created the same way:\n\n```javascript\nconst id1 = Symbol(\"id\");\nconst id2 = Symbol(\"id\");\n\nid1 === id2;   // false\n```\n\nThe `\"id\"` string is only a <i>description</i> — a label that shows up when debugging. It has nothing to do with identity.\n\nThat uniqueness has two uses.\n\n---\n\n### 1. Basic — a key that cannot collide\n\nA Symbol can be an object key, and because no other code can produce the same Symbol, nothing can accidentally overwrite it:\n\n```javascript\nconst ID = Symbol(\"id\");\n\nconst user = {\n  name: \"Rajan\",\n  [ID]: 123\n};\n\nuser[ID];             // 123\nObject.keys(user);    // [\"name\"] — the Symbol is not listed\nJSON.stringify(user); // '{\"name\":\"Rajan\"}' — and not serialised\n```\n\nThis is why libraries attach internal data with Symbol keys: an application property called `id` and a library's `Symbol(\"id\")` cannot clash.\n\n---\n\n### 2. Intermediate — Symbols are not private\n\nBeing skipped by `Object.keys()` is <b>not</b> privacy. Anyone can list them:\n\n```javascript\nObject.getOwnPropertySymbols(user);   // [Symbol(id)]\n```\n\nSo a Symbol gives you <b>uniqueness and freedom from accidents</b>, not security. For state that genuinely must not be reachable, use a class private field:\n\n```javascript\nclass Account {\n  #balance = 0;\n}\n```\n\n---\n\n### 3. Advanced — well-known Symbols\n\nJavaScript reserves a handful of Symbols as the hooks for its own behaviour. A <i>protocol</i> here just means \"implement this key and the language will use it\".\n\nThe most common is `Symbol.iterator`, which makes an object work with `for...of`:\n\n```javascript\nconst numbers = {\n  values: [1, 2, 3],\n\n  *[Symbol.iterator]() {\n    yield* this.values;\n  }\n};\n\nfor (const number of numbers) {\n  console.log(number);   // 1, 2, 3\n}\n```\n\nOthers let you control type conversion (`Symbol.toPrimitive`), `instanceof` (`Symbol.hasInstance`), the string tag (`Symbol.toStringTag`) and async iteration (`Symbol.asyncIterator`).\n\n---\n\n### `Symbol()` vs `Symbol.for()`\n\n`Symbol()` makes a brand new one every time. `Symbol.for(key)` looks in a <b>global registry</b> instead, so the same key always gives back the same Symbol:\n\n```javascript\nSymbol(\"id\") === Symbol(\"id\");           // false\nSymbol.for(\"app.id\") === Symbol.for(\"app.id\");   // true\n```\n\nUse `Symbol()` for a key that should never equal anything else. Use `Symbol.for()` when two separate modules need to agree on the same Symbol by name.",
        np: "<b>Symbol</b> त्यस्तो मान हो जुन अरू कुनै पनि मान भन्दा फरक हुने ग्यारेन्टी छ, उही तरिकाले बनाइएको भए पनि:\n\n```javascript\nconst id1 = Symbol(\"id\");\nconst id2 = Symbol(\"id\");\n\nid1 === id2;   // false\n```\n\n`\"id\"` string केवल <i>description</i> हो — debug गर्दा देखिने label। यसको पहिचानसँग कुनै सम्बन्ध छैन।\n\nयो अद्वितीयताका दुई प्रयोग छन्।\n\n---\n\n### 1. आधारभूत — नठोक्किने key\n\nSymbol object को key हुन सक्छ, र अरू कुनै code ले उही Symbol बनाउन नसक्ने भएकाले, संयोगवश कसैले यो मेट्न सक्दैन:\n\n```javascript\nconst ID = Symbol(\"id\");\n\nconst user = {\n  name: \"Rajan\",\n  [ID]: 123\n};\n\nuser[ID];             // 123\nObject.keys(user);    // [\"name\"] — Symbol सूचीमा छैन\nJSON.stringify(user); // '{\"name\":\"Rajan\"}' — serialise पनि हुँदैन\n```\n\nत्यसैले library ले भित्री data Symbol key ले जोड्छन्: application को `id` property र library को `Symbol(\"id\")` ठोक्किन सक्दैनन्।\n\n---\n\n### 2. मध्यम — Symbol private होइनन्\n\n`Object.keys()` ले छाड्नु <b>गोपनीयता होइन</b>। जो कोहीले सूचीबद्ध गर्न सक्छ:\n\n```javascript\nObject.getOwnPropertySymbols(user);   // [Symbol(id)]\n```\n\nत्यसैले Symbol ले <b>अद्वितीयता र संयोगबाट छुटकारा</b> दिन्छ, सुरक्षा होइन। साँच्चै पुग्न नहुने अवस्थाका लागि class को private field प्रयोग गर्नुहोस्:\n\n```javascript\nclass Account {\n  #balance = 0;\n}\n```\n\n---\n\n### 3. उन्नत — well-known Symbol\n\nJavaScript ले आफ्नै व्यवहारका hook का रूपमा केही Symbol सुरक्षित राखेको छ। यहाँ <i>protocol</i> को अर्थ \"यो key लागू गर्नुहोस्, भाषाले प्रयोग गर्नेछ\" भन्ने मात्र हो।\n\nसबैभन्दा सामान्य `Symbol.iterator` हो, जसले object लाई `for...of` सँग काम गर्ने बनाउँछ:\n\n```javascript\nconst numbers = {\n  values: [1, 2, 3],\n\n  *[Symbol.iterator]() {\n    yield* this.values;\n  }\n};\n\nfor (const number of numbers) {\n  console.log(number);   // 1, 2, 3\n}\n```\n\nअरूले type रूपान्तरण (`Symbol.toPrimitive`), `instanceof` (`Symbol.hasInstance`), string tag (`Symbol.toStringTag`) र async iteration (`Symbol.asyncIterator`) नियन्त्रण गर्न दिन्छन्।\n\n---\n\n### `Symbol()` vs `Symbol.for()`\n\n`Symbol()` ले हरेक पटक बिल्कुल नयाँ बनाउँछ। `Symbol.for(key)` ले बरु <b>global registry</b> मा खोज्छ, त्यसैले उही key ले सधैं उही Symbol दिन्छ:\n\n```javascript\nSymbol(\"id\") === Symbol(\"id\");           // false\nSymbol.for(\"app.id\") === Symbol.for(\"app.id\");   // true\n```\n\nअरू कसैसँग बराबर नहुनुपर्ने key का लागि `Symbol()` प्रयोग गर्नुहोस्। दुई छुट्टै module ले नामले उही Symbol मा सहमत हुनुपर्दा `Symbol.for()` प्रयोग गर्नुहोस्।",
        jp: "<b>Symbol</b> は、同じ作り方をした値とさえ一致しないことが保証された値だ:\n\n```javascript\nconst id1 = Symbol(\"id\");\nconst id2 = Symbol(\"id\");\n\nid1 === id2;   // false\n```\n\n`\"id\"` という文字列は<i>説明</i>にすぎず、デバッグ時に見えるラベルだ。同一性とは無関係。\n\nこの一意性には2つの用途がある。\n\n---\n\n### 1. 基本 — 衝突しないキー\n\nSymbolはオブジェクトのキーになれる。他のコードが同じSymbolを作れない以上、うっかり上書きされることもない:\n\n```javascript\nconst ID = Symbol(\"id\");\n\nconst user = {\n  name: \"Rajan\",\n  [ID]: 123\n};\n\nuser[ID];             // 123\nObject.keys(user);    // [\"name\"] — Symbolは並ばない\nJSON.stringify(user); // '{\"name\":\"Rajan\"}' — 直列化もされない\n```\n\nだからライブラリは内部データをSymbolキーで付ける。アプリ側の `id` とライブラリの `Symbol(\"id\")` はぶつかりようがない。\n\n---\n\n### 2. 中級 — Symbolはprivateではない\n\n`Object.keys()` に出ないことは<b>機密性ではない</b>。誰でも列挙できる:\n\n```javascript\nObject.getOwnPropertySymbols(user);   // [Symbol(id)]\n```\n\nSymbolが与えるのは<b>一意性と事故の回避</b>であって、安全性ではない。本当に到達させたくない状態には、クラスのプライベートフィールドを使う:\n\n```javascript\nclass Account {\n  #balance = 0;\n}\n```\n\n---\n\n### 3. 上級 — well-known Symbol\n\nJavaScriptは自身の振る舞いのフックとして、いくつかのSymbolを予約している。ここでの<i>プロトコル</i>は「このキーを実装すれば言語がそれを使う」という意味にすぎない。\n\n最もよく使うのが `Symbol.iterator` で、オブジェクトを `for...of` で回せるようにする:\n\n```javascript\nconst numbers = {\n  values: [1, 2, 3],\n\n  *[Symbol.iterator]() {\n    yield* this.values;\n  }\n};\n\nfor (const number of numbers) {\n  console.log(number);   // 1, 2, 3\n}\n```\n\nほかにも型変換（`Symbol.toPrimitive`）・`instanceof`（`Symbol.hasInstance`）・文字列タグ（`Symbol.toStringTag`）・非同期反復（`Symbol.asyncIterator`）を制御できる。\n\n---\n\n### `Symbol()` と `Symbol.for()`\n\n`Symbol()` は毎回まったく新しいものを作る。`Symbol.for(key)` は代わりに<b>グローバルレジストリ</b>を引くので、同じキーなら常に同じSymbolが返る:\n\n```javascript\nSymbol(\"id\") === Symbol(\"id\");           // false\nSymbol.for(\"app.id\") === Symbol.for(\"app.id\");   // true\n```\n\n他の何とも等しくなってはいけないキーには `Symbol()`。別々のモジュールが名前で同じSymbolに合意する必要があるときは `Symbol.for()`。",
      },
      diagram: `Every Symbol() call makes a new value

Symbol("id")  ──►  a brand new symbol
Symbol("id")  ──►  a different brand new symbol
                   the description is only a debug label


Symbol.for() shares one through a registry

Symbol.for("app.id")  ──┐
                        ├──►  the same symbol, both times
Symbol.for("app.id")  ──┘


A Symbol key is skipped, not hidden

Object.keys(user)                 ["name"]
JSON.stringify(user)              {"name":"Rajan"}
Object.getOwnPropertySymbols(user)  [Symbol(id)]   ← still findable

uniqueness, yes.  privacy, no.  use #privateField for that.


Well-known symbols are hooks the language calls

Symbol.iterator      for...of
Symbol.toPrimitive   +value, \`\${value}\`
Symbol.hasInstance   x instanceof Y
Symbol.asyncIterator for await...of`,
      codeExample: {
        title: { en: "Unique keys, protocols and the registry", np: "अद्वितीय key, protocol र registry", jp: "一意なキー・プロトコル・レジストリ" },
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
      keyTakeaways: [
        { en: "Every `Symbol()` call produces a <b>unique</b> value; the description is only a debug label.", np: "हरेक `Symbol()` call ले <b>अद्वितीय</b> मान बनाउँछ; description केवल debug label हो।", jp: "`Symbol()` の呼び出しごとに<b>一意</b>な値ができる。説明はデバッグ用のラベルにすぎない。" },
        { en: "A Symbol key is skipped by `Object.keys()`, `for...in` and `JSON.stringify()`.", np: "Symbol key लाई `Object.keys()`, `for...in` र `JSON.stringify()` ले छाड्छन्।", jp: "Symbolキーは `Object.keys()`・`for...in`・`JSON.stringify()` から漏れる。" },
        { en: "Skipped is <b>not private</b> — `Object.getOwnPropertySymbols()` finds it. Use `#privateField` for real privacy.", np: "छाडिनु <b>private होइन</b> — `Object.getOwnPropertySymbols()` ले भेट्टाउँछ। साँचो privacy लाई `#privateField`।", jp: "漏れることは<b>privateではない</b>。`Object.getOwnPropertySymbols()` で見つかる。本当のprivateは `#privateField`。" },
        { en: "<b>Well-known Symbols</b> are the keys the language itself looks for, such as `Symbol.iterator`.", np: "<b>Well-known Symbol</b> भाषाले आफैं खोज्ने key हुन्, जस्तै `Symbol.iterator`।", jp: "<b>well-known Symbol</b> は言語自身が探すキー。`Symbol.iterator` など。" },
        { en: "`Symbol.for(key)` shares one Symbol through a <b>global registry</b>, so the same key always matches.", np: "`Symbol.for(key)` ले <b>global registry</b> मार्फत एउटै Symbol बाँड्छ, त्यसैले उही key सधैं मिल्छ।", jp: "`Symbol.for(key)` は<b>グローバルレジストリ</b>で1つのSymbolを共有し、同じキーなら常に一致する。" },
      ],
      commonMistakes: [
        { en: "<b>Treating a Symbol key as private</b> — it is invisible to ordinary enumeration but fully readable through `Object.getOwnPropertySymbols()`.", np: "<b>Symbol key लाई private ठान्नु</b> — यो सामान्य enumeration मा देखिँदैन तर `Object.getOwnPropertySymbols()` ले पूरै पढ्न सकिन्छ।", jp: "<b>Symbolキーをprivate扱いする</b> — 通常の列挙には出ないが、`Object.getOwnPropertySymbols()` で完全に読める。" },
        { en: "<b>Expecting two `Symbol(\"id\")` calls to match</b> — they never do; reach for `Symbol.for(\"id\")` when you need a shared one.", np: "<b>दुई `Symbol(\"id\")` call मिल्छन् भन्ने आशा गर्नु</b> — कहिल्यै मिल्दैनन्; साझा चाहिँदा `Symbol.for(\"id\")` प्रयोग गर्नुहोस्।", jp: "<b>2つの `Symbol(\"id\")` が一致すると思う</b> — 決して一致しない。共有したいなら `Symbol.for(\"id\")`。" },
        { en: "<b>Expecting Symbol-keyed data to survive `JSON.stringify()`</b> — it is dropped silently, so anything you need on the wire must use a string key.", np: "<b>Symbol-key भएको data `JSON.stringify()` पछि बाँच्छ भन्ने आशा गर्नु</b> — यो चुपचाप हट्छ, त्यसैले पठाउनुपर्ने कुरा string key मा हुनुपर्छ।", jp: "<b>Symbolキーのデータが `JSON.stringify()` を生き延びると思う</b> — 黙って落ちる。送る必要があるものは文字列キーにする。" },
      ],
      quiz: [
        {
          question: { en: "What is the result of `Symbol(\"id\") === Symbol(\"id\")`?", np: "`Symbol(\"id\") === Symbol(\"id\")` को नतिजा के हो?", jp: "`Symbol(\"id\") === Symbol(\"id\")` の結果は?" },
          options: [
            { en: "`true`, because the descriptions match", np: "`true`, किनकि description मिल्छ", jp: "`true`。説明が一致するから" },
            { en: "It throws an error", np: "यसले error दिन्छ", jp: "エラーになる" },
            { en: "`true`, because Symbols are strings", np: "`true`, किनकि Symbol string हुन्", jp: "`true`。Symbolは文字列だから" },
            { en: "`false`, because every call creates a unique value", np: "`false`, किनकि हरेक call ले अद्वितीय मान बनाउँछ", jp: "`false`。呼び出しごとに一意な値ができるから" },
          ],
          correctIndex: 3,
          explanation: { en: "The description is a debugging label, never an identity.", np: "Description debug को label हो, पहिचान होइन।", jp: "説明はデバッグ用のラベルで、同一性ではない。" },
        },
        {
          question: { en: "Does a Symbol key make a property private?", np: "Symbol key ले property private बनाउँछ?", jp: "Symbolキーはプロパティをprivateにするか?" },
          options: [
            { en: "Yes, nothing can read it", np: "हो, कसैले पढ्न सक्दैन", jp: "はい、誰も読めない" },
            { en: "Yes, but only in strict mode", np: "हो, तर strict mode मा मात्र", jp: "はい、ただしstrictモードのみ" },
            { en: "No, `Object.getOwnPropertySymbols()` still finds it", np: "होइन, `Object.getOwnPropertySymbols()` ले भेट्टाउँछ", jp: "いいえ、`Object.getOwnPropertySymbols()` で見つかる" },
          ],
          correctIndex: 2,
          explanation: { en: "It gives uniqueness, not security. Use `#privateField` for real privacy.", np: "यसले अद्वितीयता दिन्छ, सुरक्षा होइन। साँचो privacy लाई `#privateField`।", jp: "得られるのは一意性で、安全性ではない。本当のprivateは `#privateField`。" },
        },
        {
          question: { en: "What does `Symbol.for(\"app.id\") === Symbol.for(\"app.id\")` return?", np: "`Symbol.for(\"app.id\") === Symbol.for(\"app.id\")` ले के फर्काउँछ?", jp: "`Symbol.for(\"app.id\") === Symbol.for(\"app.id\")` は何を返すか?" },
          options: [
            { en: "`true`", np: "`true`", jp: "`true`" },
            { en: "`false`", np: "`false`", jp: "`false`" },
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
            { en: "A `TypeError`", np: "`TypeError`", jp: "`TypeError`" },
          ],
          correctIndex: 0,
          explanation: { en: "`Symbol.for()` looks the key up in a global registry instead of creating a new one.", np: "`Symbol.for()` ले नयाँ नबनाई global registry मा key खोज्छ।", jp: "`Symbol.for()` は新規作成ではなくグローバルレジストリを引く。" },
        },
        {
          question: { en: "What does implementing `[Symbol.iterator]` on an object do?", np: "Object मा `[Symbol.iterator]` लागू गर्दा के हुन्छ?", jp: "オブジェクトに `[Symbol.iterator]` を実装すると何が起きるか?" },
          options: [
            { en: "It makes the object work with `for...of` and spread", np: "यसले object लाई `for...of` र spread सँग काम गर्ने बनाउँछ", jp: "`for...of` やスプレッドで使えるようになる" },
            { en: "It freezes the object", np: "यसले object जमाउँछ", jp: "オブジェクトが凍結される" },
            { en: "It hides the object's keys", np: "यसले object का key लुकाउँछ", jp: "オブジェクトのキーが隠れる" },
          ],
          correctIndex: 0,
          explanation: { en: "Well-known Symbols are the keys the language itself looks for.", np: "Well-known Symbol भाषाले आफैं खोज्ने key हुन्।", jp: "well-known Symbolは言語自身が探すキー。" },
        },
        {
          question: { en: "Why do libraries attach internal data with Symbol keys?", np: "Library ले भित्री data Symbol key ले किन जोड्छन्?", jp: "ライブラリが内部データをSymbolキーで付けるのはなぜか?" },
          options: [
            { en: "No other code can produce the same Symbol, so nothing collides", np: "अरू कुनै code ले उही Symbol बनाउन सक्दैन, त्यसैले ठोक्किँदैन", jp: "他のコードが同じSymbolを作れないので衝突しないから" },
            { en: "Symbols are faster than strings", np: "Symbol string भन्दा छिटो छन्", jp: "Symbolは文字列より速いから" },
            { en: "Symbol keys are encrypted", np: "Symbol key encrypt हुन्छन्", jp: "Symbolキーは暗号化されるから" },
          ],
          correctIndex: 0,
          explanation: { en: "An application property named `id` cannot clash with a library's `Symbol(\"id\")`.", np: "`id` नामको application property library को `Symbol(\"id\")` सँग ठोक्किन सक्दैन।", jp: "アプリの `id` プロパティとライブラリの `Symbol(\"id\")` はぶつからない。" },
        },
      ],
    },
    {
      id: "weakmap",
      title: { en: "WeakMap — data attached to an object", np: "WeakMap — object सँग जोडिएको data", jp: "WeakMap — オブジェクトに結び付くデータ" },
      durationMinutes: 8,
      explanation: {
        en: "A <b>WeakMap</b> stores key-value pairs where every key must be an object. What makes it different from a normal `Map` is how it interacts with <b>garbage collection</b> — the engine's automatic clean-up of objects nothing can reach any more.\n\nA `Map` holds its keys <b>strongly</b>. Being in the map is itself a reason for the object to stay alive:\n\n```javascript\nconst map = new Map();\n\nlet user = { name: \"Rajan\" };\n\nmap.set(user, \"metadata\");\n\nuser = null;   // the Map still holds the object, so it stays\n```\n\nA `WeakMap` holds them <b>weakly</b>. It never becomes the reason an object survives:\n\n```javascript\nconst map = new WeakMap();\n\nlet user = { name: \"Rajan\" };\n\nmap.set(user, \"metadata\");\n\nuser = null;   // nothing else reaches it, so the object and its entry can go\n```\n\n> <b>Weak does not mean unimportant.</b> It means the reference does not keep the object alive.\n\n---\n\n### 1. Basic — metadata\n\n```javascript\nconst metadata = new WeakMap();\n\nconst user = { id: 1, name: \"Rajan\" };\n\nmetadata.set(user, { lastLogin: \"today\", clicks: 5 });\nmetadata.get(user);   // { lastLogin: \"today\", clicks: 5 }\n```\n\nThis is ideal for objects whose lifetime you do not control — DOM elements are the classic case. When the element is removed, the entry goes with it and you never write clean-up code.\n\n---\n\n### 2. Intermediate — per-instance private state\n\nBefore `#privateField` existed, a WeakMap was how you kept data off the instance:\n\n```javascript\nconst privateData = new WeakMap();\n\nclass User {\n  constructor(name, password) {\n    this.name = name;\n    privateData.set(this, { password });\n  }\n\n  checkPassword(password) {\n    return privateData.get(this).password === password;\n  }\n}\n\nnew User(\"Alice\", \"secret\").password;   // undefined\n```\n\nModern code should prefer `#password`, but the pattern is worth recognising in older libraries.\n\n---\n\n### 3. Advanced — the limits, and why they exist\n\n```javascript\nconst map = new WeakMap();\n\nmap.set(\"user\", 123);   // TypeError — keys must be objects\nmap.size;               // undefined\nfor (const entry of map) {}   // not iterable\n```\n\nNone of this is an oversight. If you could count or list the entries, you could watch them disappear and so <b>observe exactly when the garbage collector ran</b>, which the language deliberately keeps unobservable.\n\n`WeakSet` follows the same rules but stores only objects, with no values — useful for marking things as already handled:\n\n```javascript\nconst processed = new WeakSet();\n\nfunction process(user) {\n  if (processed.has(user)) return;\n  processed.add(user);\n}\n```\n\n---\n\n### Choosing\n\n```text\nobject → some data?          WeakMap\nremember objects only?       WeakSet\nneed size, iteration\nor primitive keys?           Map / Set\n```",
        np: "<b>WeakMap</b> ले key-value जोडी राख्छ जहाँ हरेक key object नै हुनुपर्छ। सामान्य `Map` भन्दा फरक कुरा यो <b>garbage collection</b> — कसैले पुग्न नसक्ने object लाई engine ले स्वतः सफा गर्ने काम — सँग कसरी वर्तन्छ भन्नेमा छ।\n\n`Map` ले आफ्ना key <b>बलियो</b> गरी राख्छ। Map मा हुनु आफैंमा object जीवित रहनुको कारण हो:\n\n```javascript\nconst map = new Map();\n\nlet user = { name: \"Rajan\" };\n\nmap.set(user, \"metadata\");\n\nuser = null;   // Map ले अझै object समातेको छ, त्यसैले रहन्छ\n```\n\n`WeakMap` ले <b>कमजोर</b> गरी राख्छ। यो object बाँच्नुको कारण कहिल्यै बन्दैन:\n\n```javascript\nconst map = new WeakMap();\n\nlet user = { name: \"Rajan\" };\n\nmap.set(user, \"metadata\");\n\nuser = null;   // अरू कसैले पुग्दैन, त्यसैले object र entry जान सक्छन्\n```\n\n> <b>Weak को अर्थ महत्वहीन होइन।</b> यसको अर्थ त्यो reference ले object जीवित राख्दैन।\n\n---\n\n### 1. आधारभूत — metadata\n\n```javascript\nconst metadata = new WeakMap();\n\nconst user = { id: 1, name: \"Rajan\" };\n\nmetadata.set(user, { lastLogin: \"today\", clicks: 5 });\nmetadata.get(user);   // { lastLogin: \"today\", clicks: 5 }\n```\n\nआफूले आयु नियन्त्रण नगर्ने object का लागि यो उत्तम छ — DOM element classic उदाहरण हो। Element हट्दा entry पनि सँगै जान्छ र तपाईंले सफाइको code कहिल्यै लेख्नु पर्दैन।\n\n---\n\n### 2. मध्यम — प्रति-instance private अवस्था\n\n`#privateField` आउनुअघि, instance बाहिर data राख्ने तरिका WeakMap नै थियो:\n\n```javascript\nconst privateData = new WeakMap();\n\nclass User {\n  constructor(name, password) {\n    this.name = name;\n    privateData.set(this, { password });\n  }\n\n  checkPassword(password) {\n    return privateData.get(this).password === password;\n  }\n}\n\nnew User(\"Alice\", \"secret\").password;   // undefined\n```\n\nआधुनिक code ले `#password` रोज्नुपर्छ, तर पुराना library मा यो ढाँचा चिन्न लायक छ।\n\n---\n\n### 3. उन्नत — सीमा, र किन छन्\n\n```javascript\nconst map = new WeakMap();\n\nmap.set(\"user\", 123);   // TypeError — key object हुनुपर्छ\nmap.size;               // undefined\nfor (const entry of map) {}   // iterable होइन\n```\n\nयीमध्ये केही पनि बिर्सिएको होइन। Entry गन्न वा सूचीबद्ध गर्न पाए, तिनी हराएको हेर्न सकिन्थ्यो र त्यसरी <b>garbage collector कहिले चल्यो ठ्याक्कै देख्न</b> सकिन्थ्यो, जुन भाषाले जानाजान देख्न नमिल्ने राखेको छ।\n\n`WeakSet` ले उही नियम पछ्याउँछ तर मानबिना object मात्र राख्छ — पहिले नै सम्हालिएको भनी चिन्ह लगाउन उपयोगी:\n\n```javascript\nconst processed = new WeakSet();\n\nfunction process(user) {\n  if (processed.has(user)) return;\n  processed.add(user);\n}\n```\n\n---\n\n### छनोट\n\n```text\nobject → केही data?          WeakMap\nobject मात्र सम्झने?          WeakSet\nsize, iteration वा\nprimitive key चाहिने?        Map / Set\n```",
        jp: "<b>WeakMap</b> はキーがすべてオブジェクトでなければならないキー・値の集合。通常の `Map` との違いは<b>ガベージコレクション</b>、つまり到達できなくなったオブジェクトをエンジンが自動で片付ける仕組みとの関わり方にある。\n\n`Map` はキーを<b>強く</b>保持する。マップに入っていること自体が、そのオブジェクトが生き続ける理由になる:\n\n```javascript\nconst map = new Map();\n\nlet user = { name: \"Rajan\" };\n\nmap.set(user, \"metadata\");\n\nuser = null;   // Mapがまだ握っているので残り続ける\n```\n\n`WeakMap` は<b>弱く</b>保持する。オブジェクトが生き残る理由には決してならない:\n\n```javascript\nconst map = new WeakMap();\n\nlet user = { name: \"Rajan\" };\n\nmap.set(user, \"metadata\");\n\nuser = null;   // 他に到達経路がないので、オブジェクトも項目も消えられる\n```\n\n> <b>弱いは重要でないという意味ではない。</b>その参照がオブジェクトを生かさない、という意味だ。\n\n---\n\n### 1. 基本 — メタデータ\n\n```javascript\nconst metadata = new WeakMap();\n\nconst user = { id: 1, name: \"Rajan\" };\n\nmetadata.set(user, { lastLogin: \"today\", clicks: 5 });\nmetadata.get(user);   // { lastLogin: \"today\", clicks: 5 }\n```\n\n寿命を自分で持たないオブジェクトに最適で、DOM要素が典型例。要素が取り除かれれば項目も一緒に消え、後片付けのコードを書かずに済む。\n\n---\n\n### 2. 中級 — インスタンスごとの私的状態\n\n`#privateField` が登場する前は、データをインスタンスの外に置く手段がWeakMapだった:\n\n```javascript\nconst privateData = new WeakMap();\n\nclass User {\n  constructor(name, password) {\n    this.name = name;\n    privateData.set(this, { password });\n  }\n\n  checkPassword(password) {\n    return privateData.get(this).password === password;\n  }\n}\n\nnew User(\"Alice\", \"secret\").password;   // undefined\n```\n\n現代のコードは `#password` を選ぶべきだが、古いライブラリで見かける形として知る価値はある。\n\n---\n\n### 3. 上級 — 制限と、その理由\n\n```javascript\nconst map = new WeakMap();\n\nmap.set(\"user\", 123);   // TypeError — キーはオブジェクトのみ\nmap.size;               // undefined\nfor (const entry of map) {}   // 反復できない\n```\n\nどれも抜け落ちではない。項目を数えたり並べたりできれば、消える様子を見られてしまい、<b>ガベージコレクタが走った時期を正確に観測</b>できてしまう。言語はそれを意図的に観測不能に保っている。\n\n`WeakSet` は同じ規則で、値を持たずオブジェクトだけを記録する。処理済みの印付けに便利だ:\n\n```javascript\nconst processed = new WeakSet();\n\nfunction process(user) {\n  if (processed.has(user)) return;\n  processed.add(user);\n}\n```\n\n---\n\n### 選び方\n\n```text\nオブジェクト → データ?        WeakMap\nオブジェクトを覚えるだけ?      WeakSet\nサイズ・反復・\nプリミティブのキーが要る?      Map / Set\n```",
      },
      diagram: `The same entry, two different consequences

Map                              WeakMap

  Map ──strong──► object           WeakMap ──weak──► object
                    │                                  │
                    ▼                                  ▼
       stays alive because the        can be collected as soon as
       Map is still reachable         nothing else reaches it


What WeakMap deliberately does not give you

map.set("user", 123)     TypeError, keys must be objects
map.size                 undefined
for (const e of map) {}  not iterable

Counting or listing entries would let you watch them vanish,
and so observe exactly when the collector ran.


Picking one

object → some data?      WeakMap
remember objects only?   WeakSet
size, iteration,
primitive keys?          Map / Set`,
      codeExample: {
        title: { en: "Attaching data without pinning the object", np: "Object नअड्काई data जोड्नु", jp: "オブジェクトを縛らずにデータを付ける" },
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
      keyTakeaways: [
        { en: "A <b>`WeakMap`</b> attaches data to an object without keeping that object alive.", np: "<b>`WeakMap`</b> ले object लाई जीवित नराखी यससँग data जोड्छ।", jp: "<b>`WeakMap`</b> はオブジェクトを生かし続けずにデータを結び付ける。" },
        { en: "A `Map` holds keys <b>strongly</b> — being in the map is itself a reason to stay alive.", np: "`Map` ले key <b>बलियो</b> गरी राख्छ — map मा हुनु आफैंमा जीवित रहने कारण हो।", jp: "`Map` はキーを<b>強く</b>保持する。マップにあること自体が生き続ける理由になる。" },
        { en: "`WeakMap` keys must be <b>objects</b>; a primitive key throws a `TypeError`.", np: "`WeakMap` का key <b>object</b> हुनुपर्छ; primitive key ले `TypeError` दिन्छ।", jp: "`WeakMap` のキーは<b>オブジェクト</b>のみ。プリミティブは `TypeError`。" },
        { en: "There is <b>no `.size` and no iteration</b>, because either would let you observe the collector.", np: "<b>`.size` र iteration छैनन्</b>, किनकि दुबैले collector देख्न दिन्थे।", jp: "<b>`.size` も反復もない</b>。どちらもコレクタを観測できてしまうから。" },
        { en: "`WeakSet` stores objects only, which suits marking things as already handled.", np: "`WeakSet` ले object मात्र राख्छ, जुन पहिले नै सम्हालिएको चिन्ह लगाउन सुहाउँछ।", jp: "`WeakSet` はオブジェクトだけを保持し、処理済みの印付けに向く。" },
        { en: "Default to `Map` and `Set`; reach for the weak versions when the collection should not decide lifetime.", np: "पूर्वनिर्धारित रूपमा `Map` र `Set`; collection ले आयु तय गर्नु नहुँदा weak संस्करण रोज्नुहोस्।", jp: "既定は `Map` と `Set`。コレクションが寿命を決めるべきでないときに弱い版を使う。" },
      ],
      commonMistakes: [
        { en: "<b>Passing a string key</b> — `cache.set(\"user-1\", data)` throws a `TypeError`; use a plain `Map` when the keys are primitives.", np: "<b>String key पठाउनु</b> — `cache.set(\"user-1\", data)` ले `TypeError` दिन्छ; key primitive भए सामान्य `Map` प्रयोग गर्नुहोस्।", jp: "<b>文字列のキーを渡す</b> — `cache.set(\"user-1\", data)` は `TypeError`。キーがプリミティブなら素の `Map`。" },
        { en: "<b>Expecting to iterate it</b> — there is no `keys()`, `values()` or `.size`. If you need those, `Map` is the right structure.", np: "<b>यसलाई iterate गर्ने आशा गर्नु</b> — `keys()`, `values()` वा `.size` छैनन्। ती चाहिए, सही संरचना `Map` हो।", jp: "<b>反復できると思う</b> — `keys()`・`values()`・`.size` はない。必要なら `Map` が正解。" },
        { en: "<b>Using it as a clean-up notification</b> — setting `object = null` gives no callback and no guaranteed timing; collection is not observable.", np: "<b>सफाइको सूचना का रूपमा प्रयोग गर्नु</b> — `object = null` गर्दा callback आउँदैन र समयको ग्यारेन्टी हुँदैन; collection देख्न सकिँदैन।", jp: "<b>後片付けの通知として使う</b> — `object = null` してもコールバックはなく、時期の保証もない。回収は観測できない。" },
      ],
      quiz: [
        {
          question: { en: "What is the main advantage of `WeakMap` over `Map`?", np: "`Map` भन्दा `WeakMap` को मुख्य फाइदा के हो?", jp: "`Map` に対する `WeakMap` の主な利点は?" },
          options: [
            { en: "It does not stop its object keys from being garbage-collected", np: "यसले आफ्ना object key लाई garbage-collect हुनबाट रोक्दैन", jp: "オブジェクトのキーが回収されるのを妨げない" },
            { en: "It sorts its keys automatically", np: "यसले key स्वतः क्रमबद्ध गर्छ", jp: "キーを自動で整列する" },
            { en: "It supports array indexes", np: "यसले array index समर्थन गर्छ", jp: "配列のインデックスに対応する" },
            { en: "It can store duplicate keys", np: "यसले दोहोरिएका key राख्न सक्छ", jp: "重複キーを保存できる" },
          ],
          correctIndex: 0,
          explanation: { en: "A `Map` entry alone is enough to keep an object alive indefinitely.", np: "`Map` को entry मात्रैले object अनिश्चितकालसम्म जीवित राख्न पुग्छ।", jp: "`Map` は項目があるだけでオブジェクトを無期限に生かす。" },
        },
        {
          question: { en: "What happens with `new WeakMap().set(\"user\", 123)`?", np: "`new WeakMap().set(\"user\", 123)` मा के हुन्छ?", jp: "`new WeakMap().set(\"user\", 123)` はどうなるか?" },
          options: [
            { en: "It stores the entry normally", np: "यसले entry सामान्य रूपमा राख्छ", jp: "通常どおり保存される" },
            { en: "It converts the key to an object", np: "यसले key लाई object बनाउँछ", jp: "キーをオブジェクトに変換する" },
            { en: "It throws a `TypeError` because keys must be objects", np: "यसले `TypeError` दिन्छ किनकि key object हुनुपर्छ", jp: "キーはオブジェクトである必要があり `TypeError` になる" },
          ],
          correctIndex: 2,
          explanation: { en: "Use a plain `Map` when your keys are strings or numbers.", np: "Key string वा number भए सामान्य `Map` प्रयोग गर्नुहोस्।", jp: "キーが文字列や数値なら素の `Map` を使う。" },
        },
        {
          question: { en: "Why does `WeakMap` have no `.size` and no iteration?", np: "`WeakMap` मा `.size` र iteration किन छैनन्?", jp: "`WeakMap` に `.size` も反復もないのはなぜか?" },
          options: [
            { en: "They are too slow to compute", np: "तिनी गणना गर्न धेरै ढिलो छन्", jp: "計算が遅すぎるから" },
            { en: "They would reveal exactly when the garbage collector ran", np: "तिनले garbage collector कहिले चल्यो ठ्याक्कै देखाउँथे", jp: "ガベージコレクタが走った時期が分かってしまうから" },
            { en: "They were removed in a later spec", np: "पछिल्लो spec मा हटाइए", jp: "後の仕様で削除されたから" },
          ],
          correctIndex: 1,
          explanation: { en: "The omissions are deliberate, not an oversight.", np: "यी नराखिनु जानाजान हो, बिर्सिएको होइन।", jp: "この欠落は意図的なもので、抜け落ちではない。" },
        },
        {
          question: { en: "Which structure suits metadata about DOM elements you did not create?", np: "आफूले नबनाएका DOM element को metadata लाई कुन संरचना सुहाउँछ?", jp: "自分が作っていないDOM要素のメタデータに向く構造は?" },
          options: [
            { en: "`Map`", np: "`Map`", jp: "`Map`" },
            { en: "An array of pairs", np: "जोडीको array", jp: "ペアの配列" },
            { en: "`WeakMap`", np: "`WeakMap`", jp: "`WeakMap`" },
          ],
          correctIndex: 2,
          explanation: { en: "When the element is removed, the entry goes with it and needs no clean-up.", np: "Element हट्दा entry सँगै जान्छ र सफाइ चाहिँदैन।", jp: "要素が消えれば項目も消え、後片付けは不要。" },
        },
        {
          question: { en: "What does `WeakSet` store?", np: "`WeakSet` ले के राख्छ?", jp: "`WeakSet` は何を保持するか?" },
          options: [
            { en: "Key-value pairs", np: "Key-value जोडी", jp: "キーと値の対" },
            { en: "Primitives only", np: "Primitive मात्र", jp: "プリミティブのみ" },
            { en: "Objects only, with no values", np: "मानबिना object मात्र", jp: "値を持たず、オブジェクトのみ" },
          ],
          correctIndex: 2,
          explanation: { en: "That makes it a natural fit for marking objects as already handled.", np: "त्यसैले object पहिले नै सम्हालिएको चिन्ह लगाउन यो स्वाभाविक छ।", jp: "だから処理済みの印付けに自然に合う。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What does a Proxy primarily let you do?", np: "Proxy ले मुख्यतः के गर्न दिन्छ?", jp: "Proxyが主に可能にすることは?" },
      options: [
        { en: "Run your code when an operation is performed on an object", np: "Object मा operation हुँदा आफ्नो code चलाउन", jp: "オブジェクトへの操作時に自分のコードを走らせる" },
        { en: "Create private variables", np: "Private variable बनाउन", jp: "プライベート変数を作る" },
        { en: "Make an object immutable", np: "Object अपरिवर्तनीय बनाउन", jp: "オブジェクトを不変にする" },
        { en: "Deep-clone an object", np: "Object deep-clone गर्न", jp: "オブジェクトをディープコピーする" },
      ],
      correctIndex: 0,
      explanation: { en: "Reads, writes, `in`, `delete`, `Object.keys` and calls can all be trapped.", np: "पढाइ, लेखाइ, `in`, `delete`, `Object.keys` र call सबै trap गर्न सकिन्छ।", jp: "読み・書き・`in`・`delete`・`Object.keys`・呼び出しをすべて捕まえられる。" },
    },
    {
      question: { en: "Why must a `set` trap return `true`?", np: "`set` trap ले `true` किन फर्काउनुपर्छ?", jp: "`set` トラップが `true` を返すべき理由は?" },
      options: [
        { en: "It signals the write was handled; anything falsy throws in strict mode", np: "यसले लेखाइ सम्हालियो भन्छ; falsy मानले strict mode मा error दिन्छ", jp: "書き込みを処理したと示すため。falsyな値はstrictモードで例外になる" },
        { en: "It makes the property read-only", np: "यसले property read-only बनाउँछ", jp: "プロパティを読み取り専用にするため" },
        { en: "It caches the written value", np: "यसले लेखिएको मान cache गर्छ", jp: "書き込んだ値をキャッシュするため" },
      ],
      correctIndex: 0,
      explanation: { en: "Returning nothing counts as `false`, which strict mode reports as a `TypeError`.", np: "केही नफर्काउनु `false` सरह हो, जसलाई strict mode ले `TypeError` भन्छ।", jp: "何も返さないのは `false` 扱いで、strictモードでは `TypeError`。" },
    },
    {
      question: { en: "Why is `Reflect.get()` preferred over `target[prop]` inside a Proxy?", np: "Proxy भित्र `target[prop]` भन्दा `Reflect.get()` किन रोजिन्छ?", jp: "Proxy内で `target[prop]` より `Reflect.get()` が好まれる理由は?" },
      options: [
        { en: "It passes `receiver`, so a getter's `this` is the proxy rather than the raw target", np: "यसले `receiver` पठाउँछ, त्यसैले getter को `this` कच्चा target होइन proxy हुन्छ", jp: "`receiver` を渡すので、ゲッターの `this` が生のターゲットではなくプロキシになるから" },
        { en: "It clones the object first", np: "यसले पहिले object clone गर्छ", jp: "先にオブジェクトを複製するから" },
        { en: "It makes properties private", np: "यसले property private बनाउँछ", jp: "プロパティをプライベートにするから" },
        { en: "It converts the key to a Symbol", np: "यसले key लाई Symbol बनाउँछ", jp: "キーをSymbolに変換するから" },
      ],
      correctIndex: 0,
      explanation: { en: "Without it, a getter reads straight from the target and skips your traps.", np: "यसबिना, getter सिधै target बाट पढ्छ र तपाईंका trap छल्छ।", jp: "無ければ、ゲッターはターゲットから直接読みトラップを飛ばす。" },
    },
    {
      question: { en: "What is the result of `Symbol(\"id\") === Symbol(\"id\")`?", np: "`Symbol(\"id\") === Symbol(\"id\")` को नतिजा के हो?", jp: "`Symbol(\"id\") === Symbol(\"id\")` の結果は?" },
      options: [
        { en: "`true`, because the descriptions match", np: "`true`, किनकि description मिल्छ", jp: "`true`。説明が一致するから" },
        { en: "`true`, because Symbols are strings", np: "`true`, किनकि Symbol string हुन्", jp: "`true`。Symbolは文字列だから" },
        { en: "`false`, because every call creates a unique value", np: "`false`, किनकि हरेक call ले अद्वितीय मान बनाउँछ", jp: "`false`。呼び出しごとに一意な値ができるから" },
        { en: "It throws an error", np: "यसले error दिन्छ", jp: "エラーになる" },
      ],
      correctIndex: 2,
      explanation: { en: "The description is a debugging label, never an identity.", np: "Description debug को label हो, पहिचान होइन।", jp: "説明はデバッグ用のラベルで、同一性ではない。" },
    },
    {
      question: { en: "Does a Symbol key make a property genuinely private?", np: "Symbol key ले property साँच्चै private बनाउँछ?", jp: "Symbolキーはプロパティを本当にprivateにするか?" },
      options: [
        { en: "Yes, nothing can read it", np: "हो, कसैले पढ्न सक्दैन", jp: "はい、誰も読めない" },
        { en: "No, `Object.getOwnPropertySymbols()` still finds it", np: "होइन, `Object.getOwnPropertySymbols()` ले भेट्टाउँछ", jp: "いいえ、`Object.getOwnPropertySymbols()` で見つかる" },
        { en: "Yes, but only in strict mode", np: "हो, तर strict mode मा मात्र", jp: "はい、ただしstrictモードのみ" },
      ],
      correctIndex: 1,
      explanation: { en: "Symbols give uniqueness, not security. Use `#privateField` for real privacy.", np: "Symbol ले अद्वितीयता दिन्छ, सुरक्षा होइन। साँचो privacy लाई `#privateField`।", jp: "Symbolが与えるのは一意性で、機密性ではない。本当のprivateは `#privateField`。" },
    },
    {
      question: { en: "What does `Symbol.for(\"app.id\") === Symbol.for(\"app.id\")` return?", np: "`Symbol.for(\"app.id\") === Symbol.for(\"app.id\")` ले के फर्काउँछ?", jp: "`Symbol.for(\"app.id\") === Symbol.for(\"app.id\")` は何を返すか?" },
      options: [
        { en: "`false`", np: "`false`", jp: "`false`" },
        { en: "`true`", np: "`true`", jp: "`true`" },
        { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
        { en: "A `TypeError`", np: "`TypeError`", jp: "`TypeError`" },
      ],
      correctIndex: 1,
      explanation: { en: "`Symbol.for()` looks the key up in a global registry instead of creating a new symbol.", np: "`Symbol.for()` ले नयाँ symbol नबनाई global registry मा key खोज्छ।", jp: "`Symbol.for()` は新規作成ではなくグローバルレジストリを引く。" },
    },
    {
      question: { en: "What is the main advantage of `WeakMap` over `Map`?", np: "`Map` भन्दा `WeakMap` को मुख्य फाइदा के हो?", jp: "`Map` に対する `WeakMap` の主な利点は?" },
      options: [
        { en: "It supports array indexes", np: "यसले array index समर्थन गर्छ", jp: "配列のインデックスに対応する" },
        { en: "It sorts its keys automatically", np: "यसले key स्वतः क्रमबद्ध गर्छ", jp: "キーを自動で整列する" },
        { en: "It can store duplicate keys", np: "यसले दोहोरिएका key राख्न सक्छ", jp: "重複キーを保存できる" },
        { en: "It does not stop its object keys from being garbage-collected", np: "यसले आफ्ना object key लाई garbage-collect हुनबाट रोक्दैन", jp: "オブジェクトのキーが回収されるのを妨げない" },
      ],
      correctIndex: 3,
      explanation: { en: "A `Map` entry alone is enough to keep an object alive indefinitely.", np: "`Map` को entry मात्रैले object अनिश्चितकालसम्म जीवित राख्न पुग्छ।", jp: "`Map` は項目があるだけでオブジェクトを無期限に生かす。" },
    },
    {
      question: { en: "What happens with `new WeakMap().set(\"user\", 123)`?", np: "`new WeakMap().set(\"user\", 123)` मा के हुन्छ?", jp: "`new WeakMap().set(\"user\", 123)` はどうなるか?" },
      options: [
        { en: "It throws a `TypeError` because keys must be objects", np: "यसले `TypeError` दिन्छ किनकि key object हुनुपर्छ", jp: "キーはオブジェクトである必要があり `TypeError` になる" },
        { en: "It stores the entry normally", np: "यसले entry सामान्य रूपमा राख्छ", jp: "通常どおり保存される" },
        { en: "It silently converts the key to an object", np: "यसले चुपचाप key लाई object बनाउँछ", jp: "静かにキーをオブジェクトへ変換する" },
      ],
      correctIndex: 0,
      explanation: { en: "Use a plain `Map` when your keys are primitives.", np: "Key primitive भए सामान्य `Map` प्रयोग गर्नुहोस्।", jp: "キーがプリミティブなら素の `Map` を使う。" },
    },
    {
      question: { en: "Why does `WeakMap` offer no iteration or `.size`?", np: "`WeakMap` ले iteration वा `.size` किन दिँदैन?", jp: "`WeakMap` に反復も `.size` もないのはなぜか?" },
      options: [
        { en: "They would be too slow to compute", np: "तिनी गणना गर्न धेरै ढिलो हुन्थे", jp: "計算が遅すぎるから" },
        { en: "They would reveal exactly when the garbage collector ran", np: "तिनले garbage collector कहिले चल्यो ठ्याक्कै देखाउँथे", jp: "ガベージコレクタが走った時期が分かってしまうから" },
        { en: "They were removed in a later spec", np: "पछिल्लो spec मा हटाइए", jp: "後の仕様で削除されたから" },
      ],
      correctIndex: 1,
      explanation: { en: "Collection timing is deliberately kept unobservable.", np: "Collection कहिले हुन्छ जानाजान देख्न नमिल्ने राखिएको छ।", jp: "回収の時期は意図的に観測できないようにされている。" },
    },
    {
      question: { en: "Which is the best reason <b>not</b> to reach for Proxy?", np: "Proxy प्रयोग <b>नगर्ने</b> उत्तम कारण कुन हो?", jp: "Proxyを<b>使わない</b>最良の理由は?" },
      options: [
        { en: "It only works in Node.js", np: "यो Node.js मा मात्र काम गर्छ", jp: "Node.jsでしか動かないから" },
        { en: "It cannot be used with classes", np: "यो class सँग प्रयोग गर्न मिल्दैन", jp: "クラスと一緒に使えないから" },
        { en: "Interception costs performance and makes code harder to follow", np: "Intercept ले performance खान्छ र code पछ्याउन गाह्रो बनाउँछ", jp: "横取りは性能を食い、コードを追いにくくするから" },
      ],
      correctIndex: 2,
      explanation: { en: "Use it where interception itself earns its place, not because it exists.", np: "Intercept आफैंले ठाउँ कमाउने बेला प्रयोग गर्नुहोस्, भएकै भरमा होइन।", jp: "存在するからではなく、横取りが必要な場面で使う。" },
    },
  ],
};
