import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_11_LESSONS: JsLessonDay = {
  day: 11,
  title: { en: "The this Keyword — Contexts, call, apply & bind", np: "this Keyword — Contexts, call, apply, bind", jp: "this・call・apply・bind" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "four-rules-of-this",
      title: { en: "The Four Rules of this", np: "this का चार Rules", jp: "thisの4つのルール" },
      durationMinutes: 9,
      explanation: {
        en: "`this` is a special JavaScript value that tells you <b>which object a regular function is working with</b>.\n\nThe most important rule is:\n\n> <b>For regular functions, `this` is decided by how the function is called, not where it is written.</b>\n\nThere are four main ways `this` is determined:\n\n<b>Default binding</b> — a regular function is called by itself.\n\n<b>Implicit binding</b> — a function is called as an object method.\n\n<b>Explicit binding</b> — `call()`, `apply()`, or `bind()` chooses the value of `this`.\n\n<b>`new` binding</b> — `new` creates a new object and makes `this` refer to it.\n\n```text\nHow is the function called?\n          │\n          ├── greet()\n          │      ↓\n          │   Default\n          │\n          ├── user.greet()\n          │      ↓\n          │   Implicit → user\n          │\n          ├── greet.call(user)\n          │      ↓\n          │   Explicit → user\n          │\n          └── new Person()\n                 ↓\n            New object\n```\n\n<b>Important:</b> Arrow functions are different. They do <b>not</b> create their own `this`; they use `this` from the surrounding scope.\n\n---\n\n### 1. Basic — Default Binding\n\nA regular function called by itself uses <b>default binding</b>.\n\n```javascript\n\"use strict\";\n\nfunction showThis() {\n  console.log(this);\n}\n\nshowThis();\n// undefined\n```\n\nIn <b>strict mode</b> (`\"use strict\"`), `this` is `undefined`. Without strict mode in a browser, it can refer to the global object.\n\n---\n\n### 2. Basic — Implicit Binding\n\nWhen a function is called through an object, `this` refers to the object before the `.`.\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nThe object before `.` is `user`, so:\n\n```text\nthis → user\n```\n\n---\n\n### 3. Intermediate — Explicit Binding with `call()`\n\n`call()` lets you choose what `this` should be.\n\n```javascript\nfunction greet() {\n  console.log(`Hello, ${this.name}`);\n}\n\nconst user = {\n  name: \"Rajan\"\n};\n\ngreet.call(user);\n// Hello, Rajan\n```\n\n---\n\n### 4. Intermediate — `apply()`\n\n`apply()` works like `call()`, but function arguments are passed as an array.\n\n```javascript\nfunction introduce(city, country) {\n  console.log(`${this.name} lives in ${city}, ${country}`);\n}\n\nconst user = {\n  name: \"Rajan\"\n};\n\nintroduce.apply(user, [\"Tokyo\", \"Japan\"]);\n// Rajan lives in Tokyo, Japan\n```\n\nFor `this` they behave the same:\n\n```text\ncall(user, arg1, arg2)\napply(user, [arg1, arg2])\n```\n\nThe main difference is how arguments are passed.\n\n---\n\n### 5. Intermediate — `bind()`\n\n`bind()` creates a <b>new function</b> with `this` permanently connected to the object you provide.\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nfunction greet() {\n  console.log(`Hello, ${this.name}`);\n}\n\nconst greetUser = greet.bind(user);\n\ngreetUser();\n// Hello, Rajan\n```\n\nUnlike `call()` and `apply()`, `bind()` does <b>not</b> immediately run the function.\n\n```text\ncall()  → runs now\napply() → runs now\nbind()  → creates a new function\n```\n\n---\n\n### 6. Advanced — Losing `this`\n\nThis is one of the most common `this` problems.\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nBut if you take the method out of the object:\n\n```javascript\nconst greet = user.greet;\n\ngreet();\n// undefined\n```\n\nWhy? `user.greet()` has an object before the `.`, but `greet()` does not, so the <b>implicit binding is lost</b>.\n\n---\n\n### 7. Advanced — Fixing a Callback with `bind()`\n\nThis commonly happens when passing an object method as a callback.\n\n```javascript\nsetTimeout(user.greet, 1000);\n// Hello, undefined\n```\n\nThe method is passed without its `user` object. Fix it with `bind()`:\n\n```javascript\nsetTimeout(user.greet.bind(user), 1000);\n// Hello, Rajan\n```\n\n---\n\n### 8. Advanced — `new` Binding\n\nWhen a function is called with `new`, JavaScript creates a new object and makes `this` refer to it.\n\n```javascript\nfunction Person(name) {\n  this.name = name;\n}\n\nconst user = new Person(\"Rajan\");\n\nconsole.log(user.name);\n// Rajan\n```\n\n```text\nnew Person()\n     │\n     ↓\nnew object\n     │\n     ↓\nthis → new object\n```\n\n---\n\n### 9. Important — Arrow Functions\n\nArrow functions do <b>not</b> have their own `this`. They use `this` from the surrounding code.\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    const showName = () => {\n      console.log(this.name);\n    };\n\n    showName();\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nHere, the arrow function gets `this` from `greet()`. This is why arrow functions are very useful for callbacks.",
        np: "`this` JavaScript को विशेष value हो जसले <b>सामान्य function कुन object सँग काम गर्दै छ</b> भन्ने बताउँछ।\n\nसबैभन्दा महत्वपूर्ण नियम:\n\n> <b>सामान्य function का लागि, `this` कहाँ लेखिएको छ भन्दा कसरी call गरिएको छ त्यसले तय गर्छ।</b>\n\n`this` तय हुने चार मुख्य तरिका छन्:\n\n<b>Default binding</b> — सामान्य function आफैं call हुन्छ।\n\n<b>Implicit binding</b> — function object method का रूपमा call हुन्छ।\n\n<b>Explicit binding</b> — `call()`, `apply()`, वा `bind()` ले `this` को value छान्छ।\n\n<b>`new` binding</b> — `new` ले नयाँ object बनाउँछ र `this` लाई त्यसैतिर देखाउँछ।\n\n```text\nHow is the function called?\n          │\n          ├── greet()\n          │      ↓\n          │   Default\n          │\n          ├── user.greet()\n          │      ↓\n          │   Implicit → user\n          │\n          ├── greet.call(user)\n          │      ↓\n          │   Explicit → user\n          │\n          └── new Person()\n                 ↓\n            New object\n```\n\n<b>महत्वपूर्ण:</b> Arrow function फरक छन्। तिनले आफ्नै `this` <b>बनाउँदैनन्</b>; तिनले वरिपरिको scope बाट `this` लिन्छन्।\n\n---\n\n### 1. आधारभूत — Default Binding\n\nआफैं call हुने सामान्य function ले <b>default binding</b> प्रयोग गर्छ।\n\n```javascript\n\"use strict\";\n\nfunction showThis() {\n  console.log(this);\n}\n\nshowThis();\n// undefined\n```\n\n<b>Strict mode</b> (`\"use strict\"`) मा, `this` `undefined` हुन्छ। Browser मा strict mode बिना, यो global object लाई जनाउन सक्छ।\n\n---\n\n### 2. आधारभूत — Implicit Binding\n\nFunction object मार्फत call हुँदा, `this` ले `.` अघिको object लाई जनाउँछ।\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\n`.` अघिको object `user` हो, त्यसैले:\n\n```text\nthis → user\n```\n\n---\n\n### 3. मध्यम — `call()` सँग Explicit Binding\n\n`call()` ले `this` के हुनुपर्छ छान्न दिन्छ।\n\n```javascript\nfunction greet() {\n  console.log(`Hello, ${this.name}`);\n}\n\nconst user = {\n  name: \"Rajan\"\n};\n\ngreet.call(user);\n// Hello, Rajan\n```\n\n---\n\n### 4. मध्यम — `apply()`\n\n`apply()` `call()` जस्तै काम गर्छ, तर function argument array रूपमा पठाइन्छन्।\n\n```javascript\nfunction introduce(city, country) {\n  console.log(`${this.name} lives in ${city}, ${country}`);\n}\n\nconst user = {\n  name: \"Rajan\"\n};\n\nintroduce.apply(user, [\"Tokyo\", \"Japan\"]);\n// Rajan lives in Tokyo, Japan\n```\n\n`this` का लागि दुबै उस्तै व्यवहार गर्छन्:\n\n```text\ncall(user, arg1, arg2)\napply(user, [arg1, arg2])\n```\n\nमुख्य फरक argument कसरी पठाइन्छ भन्नेमा हो।\n\n---\n\n### 5. मध्यम — `bind()`\n\n`bind()` ले <b>नयाँ function</b> बनाउँछ जसको `this` तपाईंले दिएको object सँग स्थायी रूपमा जोडिन्छ।\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nfunction greet() {\n  console.log(`Hello, ${this.name}`);\n}\n\nconst greetUser = greet.bind(user);\n\ngreetUser();\n// Hello, Rajan\n```\n\n`call()` र `apply()` भन्दा फरक, `bind()` ले function लाई तुरुन्तै <b>चलाउँदैन</b>।\n\n```text\ncall()  → runs now\napply() → runs now\nbind()  → creates a new function\n```\n\n---\n\n### 6. उन्नत — `this` हराउनु\n\nयो `this` सँग सम्बन्धित सबैभन्दा सामान्य समस्यामध्ये एक हो।\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nतर method लाई object बाट बाहिर निकाले:\n\n```javascript\nconst greet = user.greet;\n\ngreet();\n// undefined\n```\n\nकिन? `user.greet()` मा `.` अघि object छ, तर `greet()` मा छैन, त्यसैले <b>implicit binding हराउँछ</b>।\n\n---\n\n### 7. उन्नत — `bind()` ले Callback ठीक गर्नु\n\nObject method लाई callback रूपमा पठाउँदा यो प्रायः हुन्छ।\n\n```javascript\nsetTimeout(user.greet, 1000);\n// Hello, undefined\n```\n\nMethod आफ्नो `user` object बिना पठाइन्छ। `bind()` ले ठीक गर्नुहोस्:\n\n```javascript\nsetTimeout(user.greet.bind(user), 1000);\n// Hello, Rajan\n```\n\n---\n\n### 8. उन्नत — `new` Binding\n\nFunction `new` सँग call हुँदा, JavaScript ले नयाँ object बनाउँछ र `this` लाई त्यसैतिर देखाउँछ।\n\n```javascript\nfunction Person(name) {\n  this.name = name;\n}\n\nconst user = new Person(\"Rajan\");\n\nconsole.log(user.name);\n// Rajan\n```\n\n```text\nnew Person()\n     │\n     ↓\nnew object\n     │\n     ↓\nthis → new object\n```\n\n---\n\n### 9. महत्वपूर्ण — Arrow Functions\n\nArrow function का आफ्नै `this` <b>हुँदैन</b>। तिनले वरिपरिको code बाट `this` लिन्छन्।\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    const showName = () => {\n      console.log(this.name);\n    };\n\n    showName();\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nयहाँ, arrow function ले `greet()` बाट `this` पाउँछ। त्यसैले callback का लागि arrow function धेरै उपयोगी हुन्छन्।",
        jp: "`this` は、<b>通常の関数がどのオブジェクトを相手にしているか</b>を示すJavaScriptの特別な値です。\n\n最も重要な規則はこれです:\n\n> <b>通常の関数では、`this` は「どこに書かれたか」ではなく「どう呼ばれたか」で決まる。</b>\n\n`this` の決まり方は主に4つあります:\n\n<b>デフォルトバインディング</b> — 通常の関数がそれ単体で呼ばれる。\n\n<b>暗黙のバインディング</b> — 関数がオブジェクトのメソッドとして呼ばれる。\n\n<b>明示的バインディング</b> — `call()`・`apply()`・`bind()` が `this` の値を選ぶ。\n\n<b>`new` バインディング</b> — `new` が新しいオブジェクトを作り、`this` をそれに向ける。\n\n```text\nHow is the function called?\n          │\n          ├── greet()\n          │      ↓\n          │   Default\n          │\n          ├── user.greet()\n          │      ↓\n          │   Implicit → user\n          │\n          ├── greet.call(user)\n          │      ↓\n          │   Explicit → user\n          │\n          └── new Person()\n                 ↓\n            New object\n```\n\n<b>重要:</b> アロー関数は別物です。自分の `this` を<b>作らず</b>、周囲のスコープの `this` を使います。\n\n---\n\n### 1. 基本 — デフォルトバインディング\n\n単体で呼ばれた通常の関数は<b>デフォルトバインディング</b>になります。\n\n```javascript\n\"use strict\";\n\nfunction showThis() {\n  console.log(this);\n}\n\nshowThis();\n// undefined\n```\n\n<b>strictモード</b>（`\"use strict\"`）では `this` は `undefined` です。ブラウザでstrictモードでない場合はグローバルオブジェクトを指すことがあります。\n\n---\n\n### 2. 基本 — 暗黙のバインディング\n\nオブジェクト経由で呼ばれると、`this` は `.` の前のオブジェクトを指します。\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\n`.` の前は `user` なので:\n\n```text\nthis → user\n```\n\n---\n\n### 3. 中級 — `call()` による明示的バインディング\n\n`call()` は `this` に何を使うかを選べます。\n\n```javascript\nfunction greet() {\n  console.log(`Hello, ${this.name}`);\n}\n\nconst user = {\n  name: \"Rajan\"\n};\n\ngreet.call(user);\n// Hello, Rajan\n```\n\n---\n\n### 4. 中級 — `apply()`\n\n`apply()` は `call()` と同じ働きですが、引数を配列で渡します。\n\n```javascript\nfunction introduce(city, country) {\n  console.log(`${this.name} lives in ${city}, ${country}`);\n}\n\nconst user = {\n  name: \"Rajan\"\n};\n\nintroduce.apply(user, [\"Tokyo\", \"Japan\"]);\n// Rajan lives in Tokyo, Japan\n```\n\n`this` については同じ振る舞いです:\n\n```text\ncall(user, arg1, arg2)\napply(user, [arg1, arg2])\n```\n\n違いは引数の渡し方だけです。\n\n---\n\n### 5. 中級 — `bind()`\n\n`bind()` は、渡したオブジェクトに `this` が固定された<b>新しい関数</b>を作ります。\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nfunction greet() {\n  console.log(`Hello, ${this.name}`);\n}\n\nconst greetUser = greet.bind(user);\n\ngreetUser();\n// Hello, Rajan\n```\n\n`call()` や `apply()` と違い、`bind()` はすぐには関数を<b>実行しません</b>。\n\n```text\ncall()  → runs now\napply() → runs now\nbind()  → creates a new function\n```\n\n---\n\n### 6. 上級 — `this` を失う\n\nこれは `this` にまつわる最もよくある問題の1つです。\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nしかしメソッドをオブジェクトの外に取り出すと:\n\n```javascript\nconst greet = user.greet;\n\ngreet();\n// undefined\n```\n\nなぜでしょう? `user.greet()` には `.` の前にオブジェクトがありますが、`greet()` にはありません。つまり<b>暗黙のバインディングが失われた</b>のです。\n\n---\n\n### 7. 上級 — `bind()` でコールバックを直す\n\nオブジェクトのメソッドをコールバックとして渡すときによく起こります。\n\n```javascript\nsetTimeout(user.greet, 1000);\n// Hello, undefined\n```\n\nメソッドが `user` オブジェクトなしで渡されています。`bind()` で直します:\n\n```javascript\nsetTimeout(user.greet.bind(user), 1000);\n// Hello, Rajan\n```\n\n---\n\n### 8. 上級 — `new` バインディング\n\n`new` を付けて関数を呼ぶと、JavaScriptは新しいオブジェクトを作り、`this` をそれに向けます。\n\n```javascript\nfunction Person(name) {\n  this.name = name;\n}\n\nconst user = new Person(\"Rajan\");\n\nconsole.log(user.name);\n// Rajan\n```\n\n```text\nnew Person()\n     │\n     ↓\nnew object\n     │\n     ↓\nthis → new object\n```\n\n---\n\n### 9. 重要 — アロー関数\n\nアロー関数は自分の `this` を<b>持ちません</b>。周囲のコードの `this` を使います。\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    const showName = () => {\n      console.log(this.name);\n    };\n\n    showName();\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nここではアロー関数が `greet()` から `this` を受け取ります。だからアロー関数はコールバックにとても便利なのです。",
      },
      diagram: `Regular Function

        How was it called?
               │
     ┌─────────┼─────────┐
     ↓         ↓         ↓
   fn()     obj.fn()   fn.call(obj)
     │         │         │
     ↓         ↓         ↓
 Default    obj       chosen object


Arrow Function

        Where was it created?
               │
               ↓
     Uses surrounding \`this\`


Easy rule to remember

fn()             → default
obj.fn()         → obj
fn.call(obj)     → obj
fn.apply(obj)    → obj
fn.bind(obj)     → fixed to obj
new Fn()         → new object
arrow function   → surrounding this`,
      codeExample: {
        title: { en: "Every binding rule, one at a time", np: "हरेक binding नियम, एक-एक गरी", jp: "各バインディング規則を1つずつ" },
        code: `// ── 1. Basic — default binding ────────────────────────────────────
"use strict";

function showThis() {
  console.log(this); // undefined in strict mode
}

showThis();

// ── 2. Basic — implicit binding ───────────────────────────────────
const user = {
  name: "Rajan",

  greet() {
    console.log(this.name);
  }
};

user.greet(); // Rajan — the object before the dot

// ── 3. Intermediate — call() ──────────────────────────────────────
function hello() {
  console.log(\`Hello, \${this.name}\`);
}

hello.call(user); // Hello, Rajan

// ── 4. Intermediate — apply() passes arguments as an array ────────
function introduce(city, country) {
  console.log(\`\${this.name} lives in \${city}, \${country}\`);
}

introduce.apply(user, ["Tokyo", "Japan"]); // Rajan lives in Tokyo, Japan

// ── 5. Intermediate — bind() returns a new function ───────────────
const greetUser = hello.bind(user);
greetUser(); // Hello, Rajan

// ── 6. Advanced — losing this ─────────────────────────────────────
const detached = user.greet;
detached(); // undefined — no object before the dot

// ── 7. Advanced — fixing a callback ───────────────────────────────
setTimeout(user.greet, 1000);            // Hello, undefined
setTimeout(user.greet.bind(user), 1000); // Rajan

// ── 8. Advanced — new binding ─────────────────────────────────────
function Person(name) {
  this.name = name;
}

console.log(new Person("Rajan").name); // Rajan

// ── 9. Arrow functions borrow the surrounding this ────────────────
const account = {
  name: "Rajan",

  greet() {
    const showName = () => console.log(this.name);
    showName();
  }
};

account.greet(); // Rajan`,
      },
      keyTakeaways: [
        { en: "`this` depends on <b>how a regular function is called</b>.", np: "`this` <b>सामान्य function कसरी call भयो</b> त्यसमा निर्भर हुन्छ।", jp: "`this` は<b>通常の関数がどう呼ばれたか</b>で決まる。" },
        { en: "`fn()` → <b>default binding</b>.", np: "`fn()` → <b>default binding</b>।", jp: "`fn()` → <b>デフォルトバインディング</b>。" },
        { en: "`obj.fn()` → <b>implicit binding</b>, so `this` is `obj`.", np: "`obj.fn()` → <b>implicit binding</b>, त्यसैले `this` `obj` हुन्छ।", jp: "`obj.fn()` → <b>暗黙のバインディング</b>で `this` は `obj`。" },
        { en: "`fn.call(obj)` and `fn.apply(obj)` → <b>explicit binding</b>, and both run immediately.", np: "`fn.call(obj)` र `fn.apply(obj)` → <b>explicit binding</b>, र दुबै तुरुन्तै चल्छन्।", jp: "`fn.call(obj)` と `fn.apply(obj)` → <b>明示的バインディング</b>。どちらもすぐ実行される。" },
        { en: "`fn.bind(obj)` → creates a function with fixed `this`.", np: "`fn.bind(obj)` → स्थिर `this` भएको function बनाउँछ।", jp: "`fn.bind(obj)` → `this` が固定された関数を作る。" },
        { en: "`new Person()` → `this` refers to the new object.", np: "`new Person()` → `this` ले नयाँ object लाई जनाउँछ।", jp: "`new Person()` → `this` は新しいオブジェクトを指す。" },
        { en: "Taking `obj.method` out of the object can lose `this`.", np: "`obj.method` लाई object बाट बाहिर निकाल्दा `this` हराउन सक्छ।", jp: "`obj.method` をオブジェクトの外に取り出すと `this` を失うことがある。" },
        { en: "Arrow functions <b>do not have their own `this`</b>; they take it from the surrounding scope.", np: "Arrow function का <b>आफ्नै `this` हुँदैन</b>; तिनले वरिपरिको scope बाट लिन्छन्।", jp: "アロー関数は<b>自分の `this` を持たず</b>、周囲のスコープから受け取る。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking `this` always means \"the current object\"</b> — after `const fn = user.greet;`, calling `fn()` no longer has `user` attached.", np: "<b>`this` सधैं \"वर्तमान object\" हो भन्ने ठान्नु</b> — `const fn = user.greet;` पछि, `fn()` call गर्दा `user` जोडिएको हुँदैन।", jp: "<b>`this` は常に「今のオブジェクト」だと思う</b> — `const fn = user.greet;` の後に `fn()` を呼んでも `user` は付いてこない。" },
        { en: "<b>Confusing `call()` and `bind()`</b> — `greet.call(user)` runs the function now, while `greet.bind(user)` returns a new function to call later.", np: "<b>`call()` र `bind()` भ्रममा पार्नु</b> — `greet.call(user)` ले function अहिले चलाउँछ, जब कि `greet.bind(user)` ले पछि call गर्न नयाँ function फर्काउँछ।", jp: "<b>`call()` と `bind()` を混同する</b> — `greet.call(user)` は今すぐ実行し、`greet.bind(user)` は後で呼ぶ新しい関数を返す。" },
        { en: "<b>Assuming arrow functions have their own `this`</b> — they don't; a top-level `const greet = () => console.log(this);` logs the surrounding `this`.", np: "<b>Arrow function का आफ्नै `this` हुन्छ भन्ने ठान्नु</b> — हुँदैन; top-level `const greet = () => console.log(this);` ले वरिपरिको `this` देखाउँछ।", jp: "<b>アロー関数が自分の `this` を持つと思う</b> — 持たない。トップレベルの `const greet = () => console.log(this);` は周囲の `this` を出す。" },
        { en: "<b>Using an arrow function as an object method when you expect the object as `this`</b> — `greet: () => console.log(this.name)` usually logs `undefined`. Use a regular method: `greet() { ... }`.", np: "<b>Object लाई `this` चाहिँदा arrow function लाई object method बनाउनु</b> — `greet: () => console.log(this.name)` ले सामान्यतया `undefined` देखाउँछ। सामान्य method प्रयोग गर्नुहोस्: `greet() { ... }`।", jp: "<b>オブジェクトを `this` にしたいのにアロー関数をメソッドにする</b> — `greet: () => console.log(this.name)` はたいてい `undefined` を出す。通常のメソッド `greet() { ... }` を使う。" },
      ],
      quiz: [
        {
          question: { en: "What determines `this` for a regular function?", np: "सामान्य function का लागि `this` के ले तय गर्छ?", jp: "通常の関数の `this` は何で決まるか?" },
          options: [
            { en: "How the function is called", np: "Function कसरी call गरिएको छ", jp: "関数がどう呼ばれたか" },
            { en: "Where the function is written", np: "Function कहाँ लेखिएको छ", jp: "関数がどこに書かれたか" },
            { en: "The function's name", np: "Function को नाम", jp: "関数の名前" },
          ],
          correctIndex: 0,
          explanation: { en: "The call site decides it, which is why the same function can see different objects.", np: "Call site ले तय गर्छ, त्यसैले उही function ले फरक object देख्न सक्छ।", jp: "呼び出し側が決めるので、同じ関数でも別のオブジェクトを見ることがある。" },
        },
        {
          question: { en: "Given `const user = { name: \"Rajan\", greet() { console.log(this.name); } }`, what is `this` in `user.greet()`?", np: "`const user = { name: \"Rajan\", greet() { console.log(this.name); } }` मा, `user.greet()` भित्र `this` के हो?", jp: "`const user = { name: \"Rajan\", greet() { console.log(this.name); } }` のとき `user.greet()` の `this` は?" },
          options: [
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
            { en: "`user`", np: "`user`", jp: "`user`" },
            { en: "`window`", np: "`window`", jp: "`window`" },
          ],
          correctIndex: 1,
          explanation: { en: "Implicit binding: `this` is whatever sits before the dot at the call site.", np: "Implicit binding: call site मा `.` अघि जे छ त्यही `this` हुन्छ।", jp: "暗黙のバインディング: 呼び出し時にドットの前にあるものが `this` になる。" },
        },
        {
          question: { en: "What does `bind()` do?", np: "`bind()` ले के गर्छ?", jp: "`bind()` は何をするか?" },
          options: [
            { en: "Immediately runs the function", np: "Function तुरुन्तै चलाउँछ", jp: "関数をすぐ実行する" },
            { en: "Deletes `this`", np: "`this` मेटाउँछ", jp: "`this` を削除する" },
            { en: "Creates a new function with a chosen `this`", np: "छानिएको `this` भएको नयाँ function बनाउँछ", jp: "選んだ `this` を持つ新しい関数を作る" },
          ],
          correctIndex: 2,
          explanation: { en: "That is why it fixes callbacks: `setTimeout(user.greet.bind(user), 1000)`.", np: "त्यसैले यसले callback ठीक गर्छ: `setTimeout(user.greet.bind(user), 1000)`।", jp: "だからコールバックを直せる: `setTimeout(user.greet.bind(user), 1000)`。" },
        },
        {
          question: { en: "What happens with `const greet = user.greet;` then `greet()`?", np: "`const greet = user.greet;` पछि `greet()` गर्दा के हुन्छ?", jp: "`const greet = user.greet;` の後に `greet()` するとどうなるか?" },
          options: [
            { en: "The object binding is lost", np: "Object binding हराउँछ", jp: "オブジェクトのバインディングが失われる" },
            { en: "`this` automatically stays `user`", np: "`this` स्वतः `user` नै रहन्छ", jp: "`this` は自動的に `user` のまま" },
            { en: "JavaScript creates a new object", np: "JavaScript ले नयाँ object बनाउँछ", jp: "JavaScriptが新しいオブジェクトを作る" },
          ],
          correctIndex: 0,
          explanation: { en: "There is no object before the dot any more, so it falls back to default binding.", np: "अब `.` अघि object छैन, त्यसैले यो default binding मा झर्छ।", jp: "もうドットの前にオブジェクトがないので、デフォルトバインディングに戻る。" },
        },
        {
          question: { en: "What is special about arrow functions?", np: "Arrow function मा के विशेष छ?", jp: "アロー関数の特別な点は?" },
          options: [
            { en: "They always have `this` set to the global object", np: "तिनको `this` सधैं global object हुन्छ", jp: "`this` が常にグローバルオブジェクトになる" },
            { en: "They use `this` from the surrounding scope", np: "तिनले वरिपरिको scope बाट `this` लिन्छन्", jp: "周囲のスコープの `this` を使う" },
            { en: "They create their own `this`", np: "तिनले आफ्नै `this` बनाउँछन्", jp: "自分の `this` を作る" },
          ],
          correctIndex: 1,
          explanation: { en: "That makes them ideal inside a method, and wrong as the method itself.", np: "त्यसैले यी method भित्र उपयुक्त छन्, र method आफैं बन्दा गलत।", jp: "だからメソッドの内側では最適だが、メソッド自体には不向き。" },
        },
        {
          question: { en: "What does `new` do to `this` in `function Person(name) { this.name = name; }`?", np: "`function Person(name) { this.name = name; }` मा `new` ले `this` लाई के गर्छ?", jp: "`function Person(name) { this.name = name; }` で `new` は `this` をどうするか?" },
          options: [
            { en: "`this` refers to `Person` itself", np: "`this` ले `Person` आफैंलाई जनाउँछ", jp: "`this` は `Person` 自身を指す" },
            { en: "`this` is always `undefined`", np: "`this` सधैं `undefined` हुन्छ", jp: "`this` は常に `undefined`" },
            { en: "`this` refers to the new object", np: "`this` ले नयाँ object लाई जनाउँछ", jp: "`this` は新しいオブジェクトを指す" },
          ],
          correctIndex: 2,
          explanation: { en: "`new` creates the object, points `this` at it, and returns it automatically.", np: "`new` ले object बनाउँछ, `this` लाई त्यसैतिर देखाउँछ, र स्वतः फर्काउँछ।", jp: "`new` はオブジェクトを作り、`this` をそれに向け、自動的に返す。" },
        },
      ],
      youtubeIds: ["9T4z98JcHR0"],
    },
    {
      id: "arrow-functions-and-this",
      title: { en: "Arrow Functions & this", np: "Arrow Functions र this", jp: "アロー関数とthis" },
      durationMinutes: 9,
      explanation: {
        en: "Arrow functions are different from normal functions because they <b>do not have their own `this`</b>.\n\nInstead, an arrow function uses the `this` from the <b>surrounding scope where it was created</b>. This is called <b>lexical `this`</b> (it gets `this` from the outside).\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    const sayName = () => {\n      console.log(this.name);\n    };\n\n    sayName();\n  }\n};\n\nuser.greet(); // Rajan\n```\n\nHere, `sayName` is an arrow function. It does not create its own `this`, so it uses the `this` from `greet()`.\n\n---\n\n### Important\n\nThe four normal `this` rules do <b>not</b> change an arrow function's `this`:\n\n• Default binding\n• Implicit binding\n• Explicit binding\n• `new` binding\n\nEven `call()`, `apply()`, and `bind()` cannot change an arrow function's `this`.\n\nThink of an arrow function as saying:\n\n> \"I won't create my own `this`. I'll use the `this` from outside.\"\n\n---\n\n### 1. Basic example\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    const sayHello = () => {\n      console.log(this.name);\n    };\n\n    sayHello();\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nThe arrow function gets `this` from `greet()`.\n\n---\n\n### 2. Very common callback example\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    setTimeout(() => {\n      console.log(this.name);\n    }, 1000);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nThe arrow function keeps the `this` from `greet()`. This is one of the main reasons arrow functions are useful for callbacks.\n\n---\n\n### 3. Arrow function as an object method — common mistake\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet: () => {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// undefined\n```\n\nWhy? Because the arrow function does <b>not</b> get `this` from `user`. The object does not create a new `this` for the arrow function.\n\nFor object methods, use a normal method:\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\n---\n\n### 4. `call()` cannot change arrow `this`\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nconst greet = () => {\n  console.log(this.name);\n};\n\ngreet.call(user);\n// does NOT make `this` become user\n```\n\nFor arrow functions, `call()`, `apply()`, and `bind()` cannot change `this`.",
        np: "Arrow function सामान्य function भन्दा फरक छन् किनकि तिनका <b>आफ्नै `this` हुँदैन</b>।\n\nबरु, arrow function ले <b>आफू बनेको वरिपरिको scope</b> बाट `this` लिन्छ। यसलाई <b>lexical `this`</b> (बाहिरबाट `this` पाउने) भनिन्छ।\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    const sayName = () => {\n      console.log(this.name);\n    };\n\n    sayName();\n  }\n};\n\nuser.greet(); // Rajan\n```\n\nयहाँ, `sayName` arrow function हो। यसले आफ्नै `this` बनाउँदैन, त्यसैले `greet()` बाट `this` लिन्छ।\n\n---\n\n### महत्वपूर्ण\n\nसामान्य `this` का चार नियमले arrow function को `this` <b>बदल्दैनन्</b>:\n\n• Default binding\n• Implicit binding\n• Explicit binding\n• `new` binding\n\n`call()`, `apply()`, र `bind()` ले पनि arrow function को `this` बदल्न सक्दैनन्।\n\nArrow function यसो भन्छ जस्तै सोच्नुहोस्:\n\n> \"म आफ्नै `this` बनाउँदिन। म बाहिरको `this` प्रयोग गर्छु।\"\n\n---\n\n### 1. आधारभूत उदाहरण\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    const sayHello = () => {\n      console.log(this.name);\n    };\n\n    sayHello();\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nArrow function ले `greet()` बाट `this` पाउँछ।\n\n---\n\n### 2. धेरै सामान्य callback उदाहरण\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    setTimeout(() => {\n      console.log(this.name);\n    }, 1000);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nArrow function ले `greet()` को `this` राख्छ। Callback का लागि arrow function उपयोगी हुनुको यो मुख्य कारण हो।\n\n---\n\n### 3. Object method रूपमा arrow function — सामान्य गल्ती\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet: () => {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// undefined\n```\n\nकिन? किनकि arrow function ले `user` बाट `this` <b>पाउँदैन</b>। Object ले arrow function का लागि नयाँ `this` बनाउँदैन।\n\nObject method का लागि, सामान्य method प्रयोग गर्नुहोस्:\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\n---\n\n### 4. `call()` ले arrow को `this` बदल्न सक्दैन\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nconst greet = () => {\n  console.log(this.name);\n};\n\ngreet.call(user);\n// does NOT make `this` become user\n```\n\nArrow function का लागि, `call()`, `apply()`, र `bind()` ले `this` बदल्न सक्दैनन्।",
        jp: "アロー関数は通常の関数と違い、<b>自分の `this` を持ちません</b>。\n\n代わりに、<b>作られた場所の周囲のスコープ</b>の `this` を使います。これを<b>レキシカルな `this`</b>（外側から `this` を受け取る）と呼びます。\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    const sayName = () => {\n      console.log(this.name);\n    };\n\n    sayName();\n  }\n};\n\nuser.greet(); // Rajan\n```\n\nここで `sayName` はアロー関数です。自分の `this` を作らないので、`greet()` の `this` を使います。\n\n---\n\n### 重要\n\n通常の `this` の4つの規則は、アロー関数の `this` を<b>変えません</b>:\n\n• デフォルトバインディング\n• 暗黙のバインディング\n• 明示的バインディング\n• `new` バインディング\n\n`call()`・`apply()`・`bind()` でさえ、アロー関数の `this` は変えられません。\n\nアロー関数はこう言っていると考えてください:\n\n> 「自分の `this` は作らない。外側の `this` を使う。」\n\n---\n\n### 1. 基本の例\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    const sayHello = () => {\n      console.log(this.name);\n    };\n\n    sayHello();\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nアロー関数は `greet()` から `this` を受け取ります。\n\n---\n\n### 2. とてもよくあるコールバックの例\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    setTimeout(() => {\n      console.log(this.name);\n    }, 1000);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nアロー関数は `greet()` の `this` を保ちます。アロー関数がコールバックに便利な主な理由の1つです。\n\n---\n\n### 3. オブジェクトのメソッドにするのはよくある間違い\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet: () => {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// undefined\n```\n\nなぜでしょう? アロー関数は `user` から `this` を<b>受け取らない</b>からです。オブジェクトはアロー関数のために新しい `this` を作りません。\n\nオブジェクトのメソッドには通常のメソッドを使います:\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\n---\n\n### 4. `call()` はアロー関数の `this` を変えられない\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nconst greet = () => {\n  console.log(this.name);\n};\n\ngreet.call(user);\n// does NOT make `this` become user\n```\n\nアロー関数では `call()`・`apply()`・`bind()` のいずれも `this` を変えられません。",
      },
      diagram: `Normal function
      │
      └── this depends on HOW it is called


Arrow function
      │
      └── this comes from WHERE it was created
                    │
                    ↓
              surrounding scope`,
      codeExample: {
        title: { en: "Where the arrow gets its this, and where it doesn't", np: "Arrow ले `this` कहाँबाट पाउँछ, कहाँबाट पाउँदैन", jp: "アローが this を得る場所、得られない場所" },
        code: `// ── 1. Basic — the arrow borrows this from greet() ────────────────
const user = {
  name: "Rajan",

  greet() {
    const sayHello = () => console.log(this.name);
    sayHello();
  }
};

user.greet(); // Rajan

// ── 2. The common callback win ────────────────────────────────────
const account = {
  name: "Rajan",

  greet() {
    setTimeout(() => {
      console.log(this.name); // Rajan — this survives the delay
    }, 1000);
  }
};

account.greet();

// ── 3. Common mistake — arrow as the method itself ────────────────
const broken = {
  name: "Rajan",

  greet: () => {
    console.log(this.name); // undefined — no this from the object
  }
};

broken.greet();

// ── 4. call() cannot change an arrow function's this ──────────────
const greet = () => console.log(this.name);

greet.call(user); // still not user`,
      },
      keyTakeaways: [
        { en: "Arrow functions <b>do not have their own `this`</b>.", np: "Arrow function का <b>आफ्नै `this` हुँदैन</b>।", jp: "アロー関数は<b>自分の `this` を持たない</b>。" },
        { en: "They use <b>lexical `this`</b> (the `this` from where they were created).", np: "तिनले <b>lexical `this`</b> (आफू बनेको ठाउँको `this`) प्रयोग गर्छन्।", jp: "<b>レキシカルな `this`</b>（作られた場所の `this`）を使う。" },
        { en: "`call()`, `apply()`, and `bind()` <b>cannot change</b> an arrow function's `this`.", np: "`call()`, `apply()`, र `bind()` ले arrow function को `this` <b>बदल्न सक्दैनन्</b>।", jp: "`call()`・`apply()`・`bind()` はアロー関数の `this` を<b>変えられない</b>。" },
        { en: "Arrow functions are great for <b>callbacks</b> when you want to keep the surrounding `this`.", np: "वरिपरिको `this` राख्न चाहँदा <b>callback</b> का लागि arrow function उत्तम छन्।", jp: "周囲の `this` を保ちたい<b>コールバック</b>にはアロー関数が最適。" },
        { en: "Avoid arrow functions as <b>object methods</b> when you need `this` to refer to the object.", np: "`this` ले object लाई जनाउनुपर्दा <b>object method</b> रूपमा arrow function नचलाउनुहोस्।", jp: "`this` にオブジェクトを求めるなら、<b>オブジェクトのメソッド</b>にアロー関数を使わない。" },
        { en: "Normal functions get `this` based on <b>how they are called</b>; arrow functions get it from <b>where they are created</b>.", np: "सामान्य function ले <b>कसरी call भयो</b> त्यसबाट `this` पाउँछन्; arrow function ले <b>कहाँ बनियो</b> त्यसबाट।", jp: "通常の関数は<b>どう呼ばれたか</b>で、アロー関数は<b>どこで作られたか</b>で `this` が決まる。" },
      ],
      commonMistakes: [
        { en: "<b>Using an arrow function as an object method</b> — `greet: () => console.log(this.name)` never sees `user`, because the object literal creates no `this`.", np: "<b>Arrow function लाई object method बनाउनु</b> — `greet: () => console.log(this.name)` ले `user` कहिल्यै देख्दैन, किनकि object literal ले `this` बनाउँदैन।", jp: "<b>アロー関数をオブジェクトのメソッドにする</b> — `greet: () => console.log(this.name)` は `user` を見られない。オブジェクトリテラルは `this` を作らないから。" },
        { en: "<b>Thinking `bind()` can fix an arrow function</b> — `greet.bind(user)()` still uses the surrounding `this`.", np: "<b>`bind()` ले arrow function ठीक गर्न सक्छ भन्ने ठान्नु</b> — `greet.bind(user)()` ले अझै वरिपरिको `this` प्रयोग गर्छ।", jp: "<b>`bind()` でアロー関数を直せると思う</b> — `greet.bind(user)()` でも周囲の `this` のまま。" },
        { en: "<b>Reaching for a normal function inside a method</b> — that is where an arrow shines, since `setTimeout(() => this.name, 1000)` keeps the method's `this`.", np: "<b>Method भित्र सामान्य function प्रयोग गर्नु</b> — त्यहीँ arrow उपयोगी हुन्छ, किनकि `setTimeout(() => this.name, 1000)` ले method को `this` राख्छ।", jp: "<b>メソッドの内側で通常の関数を使う</b> — そこはアローの出番。`setTimeout(() => this.name, 1000)` はメソッドの `this` を保つ。" },
      ],
      quiz: [
        {
          question: { en: "Does an arrow function have its own `this`?", np: "Arrow function को आफ्नै `this` हुन्छ?", jp: "アロー関数は自分の `this` を持つか?" },
          options: [
            { en: "No", np: "हुँदैन", jp: "いいえ" },
            { en: "Yes", np: "हुन्छ", jp: "はい" },
          ],
          correctIndex: 0,
          explanation: { en: "It borrows `this` from the scope it was written in.", np: "यसले आफू लेखिएको scope बाट `this` लिन्छ।", jp: "書かれたスコープから `this` を借りる。" },
        },
        {
          question: { en: "Where does an arrow function get `this` from?", np: "Arrow function ले `this` कहाँबाट पाउँछ?", jp: "アロー関数は `this` をどこから得るか?" },
          options: [
            { en: "The object to the left of `.`", np: "`.` को बायाँको object", jp: "`.` の左のオブジェクト" },
            { en: "`new`", np: "`new`", jp: "`new`" },
            { en: "`call()`", np: "`call()`", jp: "`call()`" },
            { en: "The surrounding scope where it was created", np: "आफू बनेको वरिपरिको scope", jp: "作られた場所の周囲のスコープ" },
          ],
          correctIndex: 3,
          explanation: { en: "None of the four binding rules apply to it.", np: "चारै binding नियम यसमा लागू हुँदैनन्।", jp: "4つのバインディング規則はいずれも適用されない。" },
        },
        {
          question: { en: "What does this print? `const user = { name: \"Rajan\", greet() { const fn = () => console.log(this.name); fn(); } }; user.greet();`", np: "यसले के देखाउँछ? `const user = { name: \"Rajan\", greet() { const fn = () => console.log(this.name); fn(); } }; user.greet();`", jp: "何が出力されるか? `const user = { name: \"Rajan\", greet() { const fn = () => console.log(this.name); fn(); } }; user.greet();`" },
          options: [
            { en: "`Rajan`", np: "`Rajan`", jp: "`Rajan`" },
            { en: "`null`", np: "`null`", jp: "`null`" },
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
            { en: "Error", np: "Error", jp: "エラー" },
          ],
          correctIndex: 0,
          explanation: { en: "`greet()` is a normal method, so its `this` is `user`, and the arrow inherits it.", np: "`greet()` सामान्य method हो, त्यसैले यसको `this` `user` हुन्छ, र arrow ले त्यही पाउँछ।", jp: "`greet()` は通常のメソッドなので `this` は `user`。アローがそれを受け継ぐ。" },
        },
      ],
    },
    {
      id: "call-apply-bind",
      title: { en: "call, apply, and bind in Depth", np: "call, apply, bind विस्तारमा", jp: "call・apply・bindの詳細" },
      durationMinutes: 9,
      explanation: {
        en: "`call()`, `apply()`, and `bind()` are methods that let you control what <b>`this`</b> refers to inside a normal function.\n\nThe main difference is <b>when the function runs</b> and <b>how arguments are given</b>.\n\n```text\nMethod     Runs immediately?   Arguments\n------------------------------------------------\ncall()     Yes                 One by one\napply()    Yes                 Inside an array\nbind()     No                  Returns a new function\n```\n\nThink of them like this:\n\n```text\ncall   → \"Run it now with this object.\"\napply  → \"Run it now with this object and these array arguments.\"\nbind   → \"Prepare a new function to run later.\"\n```\n\n---\n\n### 1. `call()` — run immediately\n\n`call()` runs the function <b>right away</b>. Arguments are passed <b>one by one</b>.\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nfunction greet(age, city) {\n  console.log(this.name, age, city);\n}\n\ngreet.call(user, 30, \"Tokyo\");\n// Rajan 30 Tokyo\n```\n\nThis means:\n\n```text\nthis → user\nage  → 30\ncity → Tokyo\n```\n\n---\n\n### 2. `apply()` — run immediately with an array\n\n`apply()` works almost like `call()`, but arguments are provided as <b>one array</b>.\n\n```javascript\nconst args = [30, \"Tokyo\"];\n\ngreet.apply(user, args);\n// Rajan 30 Tokyo\n```\n\nThis is useful when your arguments are <b>already inside an array</b>.\n\n---\n\n### 3. `bind()` — create a new function\n\n`bind()` does <b>not</b> run the function immediately. Instead, it creates a <b>new function</b> with `this` fixed.\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nfunction greet() {\n  console.log(this.name);\n}\n\nconst greetUser = greet.bind(user);\n\ngreetUser();\n// Rajan\n```\n\nThink of it as:\n\n```text\ngreet\n  ↓\nbind(user)\n  ↓\nnew function\n  ↓\ncall later\n```\n\n---\n\n### 4. `bind()` can also fix arguments\n\nYou can provide arguments while creating the new function.\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nconst add10 = add.bind(null, 10);\n\nconsole.log(add10(5));\n// 15\n```\n\nHere `10` is already fixed as the first argument. This is called <b>partial application</b> (pre-filling some arguments).\n\n---\n\n### 5. The most common real-world use\n\nSuppose an object has a method:\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nBut if you take the method out:\n\n```javascript\nconst greet = user.greet;\n\ngreet();\n// undefined\n```\n\nThe connection to `user` is lost. Fix it with `bind()`:\n\n```javascript\nconst greet = user.greet.bind(user);\n\ngreet();\n// Rajan\n```\n\nThis is one of the most common reasons to use `bind()`.\n\n---\n\n### 6. Modern JavaScript\n\nWith the spread operator (`...`), `apply()` is needed less often:\n\n```javascript\nintroduce.call(user, ...[30, \"Tokyo\"]);\n```\n\nSo today, you will often see `call()` plus spread instead of `apply()`.\n\n---\n\n### Easy memory trick\n\n> <b>Call = now + comma</b>\n> <b>Apply = now + array</b>\n> <b>Bind = later + new function</b>",
        np: "`call()`, `apply()`, र `bind()` यस्ता method हुन् जसले सामान्य function भित्र <b>`this`</b> ले के जनाउँछ भन्ने नियन्त्रण गर्न दिन्छन्।\n\nमुख्य फरक <b>function कहिले चल्छ</b> र <b>argument कसरी दिइन्छ</b> भन्नेमा हो।\n\n```text\nMethod     Runs immediately?   Arguments\n------------------------------------------------\ncall()     Yes                 One by one\napply()    Yes                 Inside an array\nbind()     No                  Returns a new function\n```\n\nयसरी सोच्नुहोस्:\n\n```text\ncall   → \"Run it now with this object.\"\napply  → \"Run it now with this object and these array arguments.\"\nbind   → \"Prepare a new function to run later.\"\n```\n\n---\n\n### 1. `call()` — तुरुन्तै चलाउनु\n\n`call()` ले function <b>तुरुन्तै</b> चलाउँछ। Argument <b>एक-एक गरी</b> पठाइन्छन्।\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nfunction greet(age, city) {\n  console.log(this.name, age, city);\n}\n\ngreet.call(user, 30, \"Tokyo\");\n// Rajan 30 Tokyo\n```\n\nयसको अर्थ:\n\n```text\nthis → user\nage  → 30\ncity → Tokyo\n```\n\n---\n\n### 2. `apply()` — array सँग तुरुन्तै चलाउनु\n\n`apply()` `call()` जस्तै काम गर्छ, तर argument <b>एउटा array</b> मा दिइन्छन्।\n\n```javascript\nconst args = [30, \"Tokyo\"];\n\ngreet.apply(user, args);\n// Rajan 30 Tokyo\n```\n\nArgument <b>पहिले नै array भित्र</b> हुँदा यो उपयोगी हुन्छ।\n\n---\n\n### 3. `bind()` — नयाँ function बनाउनु\n\n`bind()` ले function तुरुन्तै <b>चलाउँदैन</b>। बरु, `this` स्थिर भएको <b>नयाँ function</b> बनाउँछ।\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nfunction greet() {\n  console.log(this.name);\n}\n\nconst greetUser = greet.bind(user);\n\ngreetUser();\n// Rajan\n```\n\nयसरी सोच्नुहोस्:\n\n```text\ngreet\n  ↓\nbind(user)\n  ↓\nnew function\n  ↓\ncall later\n```\n\n---\n\n### 4. `bind()` ले argument पनि तय गर्न सक्छ\n\nनयाँ function बनाउँदै argument दिन सक्नुहुन्छ।\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nconst add10 = add.bind(null, 10);\n\nconsole.log(add10(5));\n// 15\n```\n\nयहाँ `10` पहिलो argument रूपमा पहिले नै तय भइसक्यो। यसलाई <b>partial application</b> (केही argument पहिले भर्नु) भनिन्छ।\n\n---\n\n### 5. सबैभन्दा सामान्य वास्तविक प्रयोग\n\nमानौं object सँग method छ:\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nतर method बाहिर निकाले:\n\n```javascript\nconst greet = user.greet;\n\ngreet();\n// undefined\n```\n\n`user` सँगको जोडाइ हराउँछ। `bind()` ले ठीक गर्नुहोस्:\n\n```javascript\nconst greet = user.greet.bind(user);\n\ngreet();\n// Rajan\n```\n\n`bind()` प्रयोग गर्ने सबैभन्दा सामान्य कारणमध्ये यो एक हो।\n\n---\n\n### 6. आधुनिक JavaScript\n\nSpread operator (`...`) सँग, `apply()` कम चाहिन्छ:\n\n```javascript\nintroduce.call(user, ...[30, \"Tokyo\"]);\n```\n\nत्यसैले आजकाल `apply()` को साटो `call()` सँगै spread प्रायः देखिन्छ।\n\n---\n\n### सम्झने सजिलो तरिका\n\n> <b>Call = अहिले + comma</b>\n> <b>Apply = अहिले + array</b>\n> <b>Bind = पछि + नयाँ function</b>",
        jp: "`call()`・`apply()`・`bind()` は、通常の関数の中で<b>`this`</b> が何を指すかを制御できるメソッドです。\n\n主な違いは<b>いつ関数が実行されるか</b>と<b>引数の渡し方</b>です。\n\n```text\nMethod     Runs immediately?   Arguments\n------------------------------------------------\ncall()     Yes                 One by one\napply()    Yes                 Inside an array\nbind()     No                  Returns a new function\n```\n\nこう考えてください:\n\n```text\ncall   → \"Run it now with this object.\"\napply  → \"Run it now with this object and these array arguments.\"\nbind   → \"Prepare a new function to run later.\"\n```\n\n---\n\n### 1. `call()` — すぐ実行する\n\n`call()` は関数を<b>その場で</b>実行します。引数は<b>1つずつ</b>渡します。\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nfunction greet(age, city) {\n  console.log(this.name, age, city);\n}\n\ngreet.call(user, 30, \"Tokyo\");\n// Rajan 30 Tokyo\n```\n\nつまり:\n\n```text\nthis → user\nage  → 30\ncity → Tokyo\n```\n\n---\n\n### 2. `apply()` — 配列ですぐ実行する\n\n`apply()` は `call()` とほぼ同じですが、引数を<b>1つの配列</b>で渡します。\n\n```javascript\nconst args = [30, \"Tokyo\"];\n\ngreet.apply(user, args);\n// Rajan 30 Tokyo\n```\n\n引数が<b>すでに配列に入っている</b>ときに便利です。\n\n---\n\n### 3. `bind()` — 新しい関数を作る\n\n`bind()` は関数をすぐには<b>実行しません</b>。代わりに `this` を固定した<b>新しい関数</b>を作ります。\n\n```javascript\nconst user = {\n  name: \"Rajan\"\n};\n\nfunction greet() {\n  console.log(this.name);\n}\n\nconst greetUser = greet.bind(user);\n\ngreetUser();\n// Rajan\n```\n\nこうイメージしてください:\n\n```text\ngreet\n  ↓\nbind(user)\n  ↓\nnew function\n  ↓\ncall later\n```\n\n---\n\n### 4. `bind()` は引数も固定できる\n\n新しい関数を作るときに引数を与えられます。\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nconst add10 = add.bind(null, 10);\n\nconsole.log(add10(5));\n// 15\n```\n\nここでは `10` が第1引数として固定済みです。これを<b>部分適用</b>（一部の引数を先に埋めること）と呼びます。\n\n---\n\n### 5. 最もよくある実践的な用途\n\nオブジェクトにメソッドがあるとします:\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    console.log(this.name);\n  }\n};\n\nuser.greet();\n// Rajan\n```\n\nしかしメソッドを取り出すと:\n\n```javascript\nconst greet = user.greet;\n\ngreet();\n// undefined\n```\n\n`user` とのつながりが失われます。`bind()` で直します:\n\n```javascript\nconst greet = user.greet.bind(user);\n\ngreet();\n// Rajan\n```\n\nこれが `bind()` を使う最もよくある理由の1つです。\n\n---\n\n### 6. 現代のJavaScript\n\nスプレッド構文（`...`）があるので `apply()` の出番は減りました:\n\n```javascript\nintroduce.call(user, ...[30, \"Tokyo\"]);\n```\n\n今では `apply()` の代わりに `call()` とスプレッドの組み合わせをよく見かけます。\n\n---\n\n### 覚え方\n\n> <b>Call = 今すぐ + カンマ</b>\n> <b>Apply = 今すぐ + 配列</b>\n> <b>Bind = あとで + 新しい関数</b>",
      },
      diagram: `              Function
                  │
       ┌──────────┼──────────┐
       ↓          ↓          ↓
     call()    apply()    bind()
       │          │          │
   runs now    runs now   runs later
       │          │          │
   a, b, c     [a,b,c]    new function


Method     Runs immediately?   Arguments
------------------------------------------------
call()     Yes                 One by one
apply()    Yes                 Inside an array
bind()     No                  Returns a new function`,
      codeExample: {
        title: { en: "Run now, run now with an array, or run later", np: "अहिले चलाउनु, array सँग अहिले, वा पछि", jp: "今すぐ・配列で今すぐ・あとで" },
        code: `const user = { name: "Rajan" };

function greet(age, city) {
  console.log(this.name, age, city);
}

// ── 1. call() — runs now, arguments one by one ────────────────────
greet.call(user, 30, "Tokyo"); // Rajan 30 Tokyo

// ── 2. apply() — runs now, arguments in an array ──────────────────
greet.apply(user, [30, "Tokyo"]); // Rajan 30 Tokyo

// ── 3. bind() — returns a new function to call later ──────────────
function sayName() {
  console.log(this.name);
}

const greetUser = sayName.bind(user);
greetUser(); // Rajan

// ── 4. bind() can pre-fill arguments too ──────────────────────────
function add(a, b) {
  return a + b;
}

const add10 = add.bind(null, 10);
console.log(add10(5)); // 15

// ── 5. The classic fix — a method that lost its object ────────────
const account = {
  name: "Rajan",
  greet() {
    console.log(this.name);
  }
};

const detached = account.greet;
detached(); // undefined

const bound = account.greet.bind(account);
bound(); // Rajan

// ── 6. Modern JS often uses call() plus spread instead of apply ───
greet.call(user, ...[30, "Tokyo"]); // Rajan 30 Tokyo`,
      },
      keyTakeaways: [
        { en: "<b>`call()`</b> → runs the function immediately with arguments <b>one by one</b>.", np: "<b>`call()`</b> → function तुरुन्तै चलाउँछ, argument <b>एक-एक गरी</b>।", jp: "<b>`call()`</b> → 引数を<b>1つずつ</b>渡して即座に実行する。" },
        { en: "<b>`apply()`</b> → runs the function immediately with arguments in an <b>array</b>.", np: "<b>`apply()`</b> → function तुरुन्तै चलाउँछ, argument <b>array</b> मा।", jp: "<b>`apply()`</b> → 引数を<b>配列</b>で渡して即座に実行する。" },
        { en: "<b>`bind()`</b> → returns a <b>new function</b> that can be called later.", np: "<b>`bind()`</b> → पछि call गर्न मिल्ने <b>नयाँ function</b> फर्काउँछ।", jp: "<b>`bind()`</b> → あとで呼べる<b>新しい関数</b>を返す。" },
        { en: "All three can set `this` for <b>normal functions</b>, but none of them work on arrow functions.", np: "तीनैले <b>सामान्य function</b> का लागि `this` सेट गर्न सक्छन्, तर कुनैले पनि arrow function मा काम गर्दैनन्।", jp: "3つとも<b>通常の関数</b>の `this` を設定できるが、アロー関数には効かない。" },
        { en: "`bind()` is useful when you need to keep `this` for a callback or event handler.", np: "Callback वा event handler का लागि `this` राख्नुपर्दा `bind()` उपयोगी हुन्छ।", jp: "コールバックやイベントハンドラで `this` を保ちたいときに `bind()` が役立つ。" },
        { en: "`call()` and `apply()` <b>execute</b> the function; `bind()` <b>does not</b>.", np: "`call()` र `apply()` ले function <b>चलाउँछन्</b>; `bind()` ले <b>चलाउँदैन</b>।", jp: "`call()` と `apply()` は関数を<b>実行する</b>。`bind()` は<b>実行しない</b>。" },
        { en: "Memory trick: <b>call = now + comma</b>, <b>apply = now + array</b>, <b>bind = later + new function</b>.", np: "सम्झने तरिका: <b>call = अहिले + comma</b>, <b>apply = अहिले + array</b>, <b>bind = पछि + नयाँ function</b>।", jp: "覚え方: <b>call = 今すぐ+カンマ</b>、<b>apply = 今すぐ+配列</b>、<b>bind = あとで+新しい関数</b>。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking `bind()` runs the function</b> — `const greetUser = greet.bind(user);` runs nothing. You still need `greetUser()`.", np: "<b>`bind()` ले function चलाउँछ भन्ने ठान्नु</b> — `const greetUser = greet.bind(user);` ले केही चलाउँदैन। तपाईंलाई अझै `greetUser()` चाहिन्छ।", jp: "<b>`bind()` が関数を実行すると思う</b> — `const greetUser = greet.bind(user);` では何も動かない。`greetUser()` が必要。" },
        { en: "<b>Confusing `call()` and `apply()`</b> — `fn.call(user, 10, 20)` passes arguments separately, `fn.apply(user, [10, 20])` passes them in an array.", np: "<b>`call()` र `apply()` भ्रममा पार्नु</b> — `fn.call(user, 10, 20)` ले argument छुट्टाछुट्टै पठाउँछ, `fn.apply(user, [10, 20])` ले array मा।", jp: "<b>`call()` と `apply()` を混同する</b> — `fn.call(user, 10, 20)` は個別に、`fn.apply(user, [10, 20])` は配列で渡す。" },
        { en: "<b>Trying to use these to change an arrow function's `this`</b> — `greet.call(user)` on an arrow function changes nothing; arrows take `this` from their surrounding scope.", np: "<b>यिनले arrow function को `this` बदल्न खोज्नु</b> — arrow function मा `greet.call(user)` ले केही बदल्दैन; arrow ले वरिपरिको scope बाट `this` लिन्छ।", jp: "<b>これらでアロー関数の `this` を変えようとする</b> — アロー関数への `greet.call(user)` は何も変えない。アローは周囲のスコープから `this` を取る。" },
      ],
      quiz: [
        {
          question: { en: "Which method runs the function immediately?", np: "कुन method ले function तुरुन्तै चलाउँछ?", jp: "関数をすぐに実行するのはどれか?" },
          options: [
            { en: "`bind()`", np: "`bind()`", jp: "`bind()`" },
            { en: "`call()`", np: "`call()`", jp: "`call()`" },
            { en: "Both `bind()` and `call()`", np: "`bind()` र `call()` दुबै", jp: "`bind()` と `call()` の両方" },
            { en: "None", np: "कुनै पनि होइन", jp: "どれでもない" },
          ],
          correctIndex: 1,
          explanation: { en: "`apply()` also runs immediately; `bind()` is the one that waits.", np: "`apply()` पनि तुरुन्तै चल्छ; `bind()` चाहिँ कुर्छ।", jp: "`apply()` もすぐ実行する。待つのは `bind()`。" },
        },
        {
          question: { en: "Which method expects arguments inside an array?", np: "कुन method ले argument array भित्र खोज्छ?", jp: "引数を配列で受け取るのはどれか?" },
          options: [
            { en: "`call()`", np: "`call()`", jp: "`call()`" },
            { en: "`bind()`", np: "`bind()`", jp: "`bind()`" },
            { en: "`apply()`", np: "`apply()`", jp: "`apply()`" },
            { en: "`map()`", np: "`map()`", jp: "`map()`" },
          ],
          correctIndex: 2,
          explanation: { en: "Remember: apply = array.", np: "सम्झनुहोस्: apply = array।", jp: "覚え方: apply = array。" },
        },
        {
          question: { en: "What does `bind()` return?", np: "`bind()` ले के फर्काउँछ?", jp: "`bind()` は何を返すか?" },
          options: [
            { en: "The function's result", np: "Function को नतिजा", jp: "関数の結果" },
            { en: "An array", np: "एउटा array", jp: "配列" },
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
            { en: "A new function", np: "नयाँ function", jp: "新しい関数" },
          ],
          correctIndex: 3,
          explanation: { en: "The returned function has `this` fixed, and any pre-filled arguments baked in.", np: "फर्काइएको function को `this` स्थिर हुन्छ, र पहिले भरिएका argument पनि समावेश हुन्छन्।", jp: "返される関数は `this` が固定され、先に埋めた引数も含まれている。" },
        },
        {
          question: { en: "What does this print? `const fn = greet.bind(user); fn();` where `user = { name: \"Rajan\" }`", np: "यसले के देखाउँछ? `const fn = greet.bind(user); fn();` जहाँ `user = { name: \"Rajan\" }`", jp: "何が出力されるか? `const fn = greet.bind(user); fn();`（`user = { name: \"Rajan\" }`）" },
          options: [
            { en: "`Rajan`", np: "`Rajan`", jp: "`Rajan`" },
            { en: "`user`", np: "`user`", jp: "`user`" },
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
            { en: "Error", np: "Error", jp: "エラー" },
          ],
          correctIndex: 0,
          explanation: { en: "`bind()` fixed `this` to `user`, so calling `fn()` later still logs the name.", np: "`bind()` ले `this` लाई `user` मा स्थिर गर्‍यो, त्यसैले पछि `fn()` call गर्दा पनि नाम देखिन्छ।", jp: "`bind()` が `this` を `user` に固定したので、あとで `fn()` を呼んでも名前が出る。" },
        },
      ],
      youtubeIds: ["75W8UPQ5l7k", "ke_y6z0xRpk"],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What is `this` inside a plain function call in strict mode?", np: "Strict mode मा plain function call भित्र `this` के हो?", jp: "strictモードでのプレーンな関数呼び出し内のthisは？" },
      options: [{ en: "The global object", np: "Global object", jp: "グローバルオブジェクト" }, { en: "`undefined`", np: "`undefined`", jp: "`undefined`" }],
      correctIndex: 1,
      explanation: { en: "Strict mode default binding does not fall back to the global object.", np: "Strict mode default binding ले global object मा फिर्ता जाँदैन।", jp: "strictモードのデフォルト束縛はグローバルオブジェクトにフォールバックしない。" },
    },
    {
      question: { en: "What happens to `this` when you extract a method off its object and call it bare?", np: "Method लाई object बाट extract गरेर bare call गर्दा `this` को हुन्छ?", jp: "オブジェクトからメソッドを取り出して生で呼び出すとthisはどうなる？" },
      options: [{ en: "It's lost — falls back to default binding", np: "हराउन्छ — default binding मा फिर्ता जान्छ", jp: "失われる — デフォルト束縛にフォールバックする" }, { en: "It stays pointed at the original object", np: "मूल object मै रहन्छ", jp: "元のオブジェクトを指したままになる" }],
      correctIndex: 0,
      explanation: { en: "Without the object to the left of a dot at the call site, implicit binding cannot apply.", np: "Call site मा dot को बायाँ object नभई implicit binding लागू हुँदैन।", jp: "呼び出し場所でドットの左にオブジェクトがなければ暗黙的束縛は適用されない。" },
    },
    {
      question: { en: "Which binding rule wins if a function is both called with `new` and bound with `bind()`?", np: "Function `new` सँग call भएको छ र `bind()` ले पनि bind भएको छ भने कुन rule जित्छ?", jp: "関数が`new`で呼ばれ、かつ`bind()`で束縛されている場合、どちらのルールが勝つ？" },
      options: [{ en: "Explicit binding always wins", np: "Explicit binding ले सधैं जित्छ", jp: "明示的束縛が常に勝つ" }, { en: "`new` binding — it has the highest priority", np: "`new` binding — highest priority", jp: "`new`束縛 — 最も優先度が高い" }],
      correctIndex: 1,
      explanation: { en: "new binding sits above explicit binding in the priority order of the four this rules.", np: "चार this rules को priority order मा new binding explicit binding भन्दा माथि छ।", jp: "4つのthisルールの優先順位では、new束縛は明示的束縛より上位にある。" },
    },
    {
      question: { en: "Where does an arrow function's `this` come from?", np: "Arrow function को `this` कहाँबाट आउँछ?", jp: "アロー関数のthisはどこから来る？" },
      options: [{ en: "The lexical scope surrounding it at creation time", np: "Creation बेलाको surrounding lexical scope", jp: "作成時の周囲のレキシカルスコープ" }, { en: "Whatever object it's later called on", np: "पछि जुन object मा call हुन्छ त्यही", jp: "後で呼び出されるオブジェクト" }],
      correctIndex: 0,
      explanation: { en: "Arrow functions have no dynamic this-binding — they inherit this from where they were defined.", np: "Arrow functions मा dynamic this-binding हुँदैन — यिनले define भएको ठाउँबाट this inherit गर्छन्।", jp: "アロー関数には動的なthis束縛がない。定義された場所からthisを継承する。" },
    },
    {
      question: { en: "Is an arrow function a good choice for an object literal method like `{ inc: () => { this.count++ } }`?", np: "`{ inc: () => { this.count++ } }` जस्तो object literal method का लागि arrow function राम्रो choice हो?", jp: "`{ inc: () => { this.count++ } }`のようなオブジェクトリテラルのメソッドにアロー関数は適切？" },
      options: [{ en: "Yes — it always refers to the object it's defined on", np: "हो — यो सधैं define भएको object लाई जनाउँछ", jp: "はい — 常に定義されたオブジェクトを指す" }, { en: "No — it captures this from the module scope, not the object", np: "होइन — यसले module scope बाट this capture गर्छ, object बाट होइन", jp: "いいえ — オブジェクトではなくモジュールスコープからthisをキャプチャする" }],
      correctIndex: 1,
      explanation: { en: "The arrow's lexical scope at creation time is the module, not the object literal being built.", np: "Arrow को creation बेलाको lexical scope module हो, बन्दै गरेको object literal होइन।", jp: "アローの作成時のレキシカルスコープは、構築中のオブジェクトリテラルではなくモジュール。" },
    },
    {
      question: { en: "Can `bind()` override an arrow function's `this`?", np: "`bind()` ले arrow function को `this` override गर्न सक्छ?", jp: "`bind()`はアロー関数のthisを上書きできる？" },
      options: [{ en: "No — arrow functions ignore explicit binding entirely", np: "होइन — arrow functions ले explicit binding लाई पूर्ण बेवास्ता गर्छन्", jp: "いいえ — アロー関数は明示的束縛を完全に無視する" }, { en: "Yes, just like a regular function", np: "हो, regular function जस्तै", jp: "はい、通常の関数と同じ" }],
      correctIndex: 0,
      explanation: { en: "There is no dynamic this-binding to override on an arrow function in the first place.", np: "Arrow function मा override गर्ने dynamic this-binding सुरुदेखि नै हुँदैन।", jp: "そもそもアロー関数には上書きすべき動的なthis束縛が存在しない。" },
    },
    {
      question: { en: "What is the key difference in how `call()` and `apply()` pass arguments?", np: "`call()` र `apply()` ले arguments pass गर्ने तरिकामा मुख्य फरक के हो?", jp: "`call()`と`apply()`の引数の渡し方の主な違いは？" },
      options: [{ en: "They pass arguments identically", np: "दुवैले arguments उस्तै तरिकाले pass गर्छन्", jp: "両者は引数を同じように渡す" }, { en: "call takes individual arguments; apply takes a single array", np: "call ले individual arguments लिन्छ; apply ले single array लिन्छ", jp: "callは個別の引数を受け取る。applyは単一の配列を受け取る" }],
      correctIndex: 1,
      explanation: { en: "This is the sole functional difference between the two methods; both invoke immediately.", np: "यही दुई methods बीचको एकमात्र functional फरक हो; दुवैले तुरुन्तै invoke गर्छन्।", jp: "これが2つのメソッドの唯一の機能的な違い。両方とも即座に呼び出す。" },
    },
    {
      question: { en: "Does `bind()` invoke the function immediately?", np: "`bind()` ले function तुरुन्तै invoke गर्छ?", jp: "`bind()`は関数を即座に呼び出す？" },
      options: [{ en: "No — it returns a new function for later use", np: "होइन — यसले पछि प्रयोगका लागि नयाँ function फर्काउँछ", jp: "いいえ — 後で使うための新しい関数を返す" }, { en: "Yes, immediately", np: "हो, तुरुन्तै", jp: "はい、即座に" }],
      correctIndex: 0,
      explanation: { en: "bind() is the odd one out among the three — it never calls the function itself.", np: "तीनमध्ये bind() अलग हो — यसले function आफैं कहिल्यै call गर्दैन।", jp: "3つの中でbind()は例外的で、関数自体を決して呼び出さない。" },
    },
    {
      question: { en: "Why bind a class method used as an event handler in the constructor?", np: "Constructor मा event handler को रूपमा प्रयोग हुने class method किन bind गर्ने?", jp: "コンストラクタでイベントハンドラとして使うクラスメソッドをなぜbindするのか？" },
      options: [{ en: "It's purely a stylistic convention with no functional effect", np: "यो कुनै functional असर नभएको केवल stylistic convention हो", jp: "機能的な効果はなく、純粋にスタイル上の慣習" }, { en: "So `this` stays correct once the method is detached and called by the event system", np: "ताकि method detach भएर event system ले call गर्दा पनि `this` सहि रहोस्", jp: "メソッドが切り離され、イベントシステムによって呼び出されてもthisが正しいままであるように" }],
      correctIndex: 1,
      explanation: { en: "Event systems call the handler bare, without the instance to the left of a dot, so binding is what preserves the correct this.", np: "Event system ले handler लाई bare call गर्छ, dot को बायाँ instance बिना, त्यसैले bind ले नै सहि this जोगाउँछ।", jp: "イベントシステムはハンドラをドットの左にインスタンスなしで生で呼び出すため、束縛が正しいthisを保持する。" },
    },
  ],
};
