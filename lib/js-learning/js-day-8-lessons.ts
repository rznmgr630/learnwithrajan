import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_8_LESSONS: JsLessonDay = {
  day: 8,
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
            { en: "Where the function is written", np: "Function कहाँ लेखिएको छ", jp: "関数がどこに書かれたか" },
            { en: "How the function is called", np: "Function कसरी call गरिएको छ", jp: "関数がどう呼ばれたか" },
            { en: "The function's name", np: "Function को नाम", jp: "関数の名前" },
          ],
          correctIndex: 1,
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
            { en: "Creates a new function with a chosen `this`", np: "छानिएको `this` भएको नयाँ function बनाउँछ", jp: "選んだ `this` を持つ新しい関数を作る" },
            { en: "Deletes `this`", np: "`this` मेटाउँछ", jp: "`this` を削除する" },
          ],
          correctIndex: 1,
          explanation: { en: "That is why it fixes callbacks: `setTimeout(user.greet.bind(user), 1000)`.", np: "त्यसैले यसले callback ठीक गर्छ: `setTimeout(user.greet.bind(user), 1000)`।", jp: "だからコールバックを直せる: `setTimeout(user.greet.bind(user), 1000)`。" },
        },
        {
          question: { en: "What happens with `const greet = user.greet;` then `greet()`?", np: "`const greet = user.greet;` पछि `greet()` गर्दा के हुन्छ?", jp: "`const greet = user.greet;` の後に `greet()` するとどうなるか?" },
          options: [
            { en: "`this` automatically stays `user`", np: "`this` स्वतः `user` नै रहन्छ", jp: "`this` は自動的に `user` のまま" },
            { en: "The object binding is lost", np: "Object binding हराउँछ", jp: "オブジェクトのバインディングが失われる" },
            { en: "JavaScript creates a new object", np: "JavaScript ले नयाँ object बनाउँछ", jp: "JavaScriptが新しいオブジェクトを作る" },
          ],
          correctIndex: 1,
          explanation: { en: "There is no object before the dot any more, so it falls back to default binding.", np: "अब `.` अघि object छैन, त्यसैले यो default binding मा झर्छ।", jp: "もうドットの前にオブジェクトがないので、デフォルトバインディングに戻る。" },
        },
        {
          question: { en: "What is special about arrow functions?", np: "Arrow function मा के विशेष छ?", jp: "アロー関数の特別な点は?" },
          options: [
            { en: "They always have `this` set to the global object", np: "तिनको `this` सधैं global object हुन्छ", jp: "`this` が常にグローバルオブジェクトになる" },
            { en: "They create their own `this`", np: "तिनले आफ्नै `this` बनाउँछन्", jp: "自分の `this` を作る" },
            { en: "They use `this` from the surrounding scope", np: "तिनले वरिपरिको scope बाट `this` लिन्छन्", jp: "周囲のスコープの `this` を使う" },
          ],
          correctIndex: 2,
          explanation: { en: "That makes them ideal inside a method, and wrong as the method itself.", np: "त्यसैले यी method भित्र उपयुक्त छन्, र method आफैं बन्दा गलत।", jp: "だからメソッドの内側では最適だが、メソッド自体には不向き。" },
        },
        {
          question: { en: "What does `new` do to `this` in `function Person(name) { this.name = name; }`?", np: "`function Person(name) { this.name = name; }` मा `new` ले `this` लाई के गर्छ?", jp: "`function Person(name) { this.name = name; }` で `new` は `this` をどうするか?" },
          options: [
            { en: "`this` refers to the new object", np: "`this` ले नयाँ object लाई जनाउँछ", jp: "`this` は新しいオブジェクトを指す" },
            { en: "`this` is always `undefined`", np: "`this` सधैं `undefined` हुन्छ", jp: "`this` は常に `undefined`" },
            { en: "`this` refers to `Person` itself", np: "`this` ले `Person` आफैंलाई जनाउँछ", jp: "`this` は `Person` 自身を指す" },
          ],
          correctIndex: 0,
          explanation: { en: "`new` creates the object, points `this` at it, and returns it automatically.", np: "`new` ले object बनाउँछ, `this` लाई त्यसैतिर देखाउँछ, र स्वतः फर्काउँछ।", jp: "`new` はオブジェクトを作り、`this` をそれに向け、自動的に返す。" },
        },
      ],
    },
    {
      id: "arrow-functions-and-this",
      title: { en: "Arrow Functions & this", np: "Arrow Functions र this", jp: "アロー関数とthis" },
      durationMinutes: 9,
      explanation: {
        en: "Arrow functions do NOT have their own `this` at all. Instead, they capture the `this` of whatever function or scope contains them <b>at the moment they are created</b> — this is called lexical `this`. Because of that, none of the four binding rules from the previous lesson apply to them, and `call()`/`apply()`/`bind()` cannot override an arrow function's `this`.\n\nThis makes arrow functions perfect for callbacks inside a class method or another function, where you want `this` to stay pointed at the surrounding object — but it makes them the <b>wrong</b> choice for object methods defined directly with `{ method: () => {} }`, because at the moment that arrow is created, the surrounding scope is the module, not the object literal.",
        np: "Arrow functions को आफ्नै `this` हुँदैन — यिनले create भएको बेलाको surrounding scope बाट `this` capture गर्छन् (lexical this)। यसैले class method भित्र callback का लागि उत्तम, तर object literal मा method को रूपमा गलत choice।",
        jp: "アロー関数には独自のthisがない。作成時の周囲のスコープからthisをキャプチャする（レキシカルthis）。クラスメソッド内のコールバックには最適だが、オブジェクトリテラルのメソッドとしては誤った選択。",
      },
      diagram: `class Timer {
  start() {
    setInterval(function () { this.seconds++ }, 1000);
    //          └── regular fn: 'this' is undefined here ❌

    setInterval(() => { this.seconds++ }, 1000);
    //          └── arrow fn: captures 'this' from start() → the Timer instance ✅
  }
}

const obj = {
  count: 0,
  bad:  () => { this.count++ },   // 'this' captured from MODULE scope, not obj ❌
  good() { this.count++ },         // regular method — 'this' is obj when called obj.good() ✅
};`,
      codeExample: {
        title: { en: "Arrow functions capture this from their lexical context", np: "Arrow functions ले lexical context बाट this capture गर्छ", jp: "アロー関数はレキシカルコンテキストのthisをキャプチャする" },
        code: `class Timer {
  constructor() { this.seconds = 0; }

  // ❌ Regular function — 'this' is undefined inside the callback
  startBroken() {
    setInterval(function () {
      this.seconds++;   // TypeError: Cannot set property 'seconds' of undefined
    }, 1000);
  }

  // ✅ Arrow function — captures 'this' from startFixed's context (the Timer instance)
  startFixed() {
    setInterval(() => {
      this.seconds++;   // 'this' is the Timer instance
    }, 1000);
  }
}

// ── Arrow function as an object method — wrong! ────────────────────
const counter = {
  count: 0,
  // ❌ Captures 'this' from the surrounding module scope, not the object
  increment: () => { this.count++; },
  // ✅ Regular method — 'this' is the object when called as counter.incrementFixed()
  incrementFixed() { this.count++; },
};

// ── The canonical, correct pattern ─────────────────────────────────
class UserList {
  constructor(users) { this.users = users; }
  getNames() {
    // Arrow function inside .map(): 'this' still refers to the UserList instance
    return this.users.map(user => \`\${user.name} (list size: \${this.users.length})\`);
  }
}`,
      },
      keyTakeaways: [
        { en: "Arrow functions have no `this` of their own — they capture `this` lexically from the enclosing scope at the moment they are created, and that binding never changes.", np: "Arrow functions को आफ्नै `this` हुँदैन — create भएको बेला enclosing scope बाट lexically `this` capture गर्छन्, र त्यो binding कहिल्यै बदलिँदैन।", jp: "アロー関数には独自のthisがない。作成時に囲むスコープからレキシカルにthisをキャプチャし、その束縛は変わらない。" },
        { en: "Use an arrow function for a callback INSIDE a class method or function when you want `this` to stay pointed at the instance/enclosing scope.", np: "Class method वा function भित्र callback का लागि arrow function प्रयोग गर्नुहोस् जब `this` instance/enclosing scope मै रहनुपर्छ।", jp: "thisをインスタンス/囲むスコープに保ちたい場合、クラスメソッドや関数内のコールバックにアロー関数を使う。" },
        { en: "Never use an arrow function to define an object literal method directly (`{ method: () => {} }`) — at creation time its lexical scope is the surrounding module, not the object.", np: "Object literal मा method को रूपमा arrow function कहिल्यै प्रयोग नगर्नुहोस् (`{ method: () => {} }`) — creation बेला lexical scope object होइन, module हो।", jp: "オブジェクトリテラルのメソッドを直接アロー関数で定義しない（`{ method: () => {} }`）。作成時のレキシカルスコープはオブジェクトではなく周囲のモジュール。" },
      ],
      commonMistakes: [
        { en: "Writing `setInterval(function() { this.x++ }, 1000)` inside a class method and being confused why `this` is `undefined` — a regular function loses the surrounding `this`.", np: "Class method भित्र `setInterval(function() { this.x++ }, 1000)` लेखेर `this` `undefined` किन भयो भनेर confuse हुनु।", jp: "クラスメソッド内で`setInterval(function() { this.x++ }, 1000)`と書き、thisがundefinedになる理由が分からず混乱すること。" },
        { en: "Defining an object method as an arrow function (`increment: () => { this.count++ }`) expecting `this` to be the object — it captures the module scope instead.", np: "Object method लाई arrow function (`increment: () => { this.count++ }`) को रूपमा लेखेर `this` object हुनेछ भनी आशा गर्नु — बरु module scope capture हुन्छ।", jp: "オブジェクトメソッドをアロー関数（`increment: () => { this.count++ }`）として定義し、thisがオブジェクトになると期待すること。実際はモジュールスコープをキャプチャする。" },
        { en: "Trying to use `.call()`, `.apply()`, or `.bind()` on an arrow function to change its `this` — arrow functions ignore all explicit binding attempts.", np: "Arrow function मा `this` बदलन `.call()`, `.apply()`, `.bind()` प्रयोग गर्ने प्रयास गर्नु — arrow functions ले सबै explicit binding लाई बेवास्ता गर्छन्।", jp: "アロー関数のthisを変更するために`.call()`、`.apply()`、`.bind()`を使おうとすること。アロー関数はすべての明示的束縛の試みを無視する。" },
      ],
      quiz: [
        {
          question: { en: "Where does an arrow function get its `this` from?", np: "Arrow function ले आफ्नो `this` कहाँबाट पाउँछ?", jp: "アロー関数はthisをどこから取得する？" },
          options: [
            { en: "From the object it is called on, like a regular method", np: "यसलाई call गरिने object बाट, regular method जस्तै", jp: "通常のメソッドのように呼び出されたオブジェクトから" },
            { en: "From the enclosing lexical scope at the time it was created", np: "Create भएको बेलाको enclosing lexical scope बाट", jp: "作成時の囲むレキシカルスコープから" },
          ],
          correctIndex: 1,
          explanation: { en: "Arrow functions have no this-binding mechanism of their own; they simply inherit whatever this was in scope when the arrow was defined.", np: "Arrow functions सँग आफ्नै this-binding mechanism हुँदैन; यिनले arrow define हुँदाको scope को this नै inherit गर्छन्।", jp: "アロー関数には独自のthis束縛機構がない。定義時のスコープにあったthisをそのまま継承する。" },
        },
        {
          question: { en: "Why is an arrow function the WRONG choice for `const obj = { count: 0, inc: () => { this.count++ } }`?", np: "`const obj = { count: 0, inc: () => { this.count++ } }` मा arrow function किन गलत choice हो?", jp: "`const obj = { count: 0, inc: () => { this.count++ } }`でアロー関数が間違った選択なのはなぜ？" },
          options: [
            { en: "Because at creation time, `this` is captured from the module scope, not from `obj`", np: "किनकि creation बेला `this` module scope बाट capture हुन्छ, `obj` बाट होइन", jp: "作成時にthisはobjからではなくモジュールスコープからキャプチャされるため" },
            { en: "Because arrow functions can't access object properties at all", np: "किनकि arrow functions ले object properties access नै गर्न सक्दैनन्", jp: "アロー関数はオブジェクトのプロパティに全くアクセスできないため" },
          ],
          correctIndex: 0,
          explanation: { en: "The arrow is defined in the object literal's surrounding scope, not inside a call to inc() on obj, so it never sees obj as this.", np: "Arrow object literal को surrounding scope मा define हुन्छ, obj मा inc() call भित्र होइन, त्यसैले यसले कहिल्यै obj लाई this को रूपमा देख्दैन।", jp: "アローはobjに対するinc()の呼び出し内ではなく、オブジェクトリテラルを囲むスコープで定義されるため、objをthisとして見ることはない。" },
        },
        {
          question: { en: "Can `.bind()` change what `this` refers to inside an arrow function?", np: "`.bind()` ले arrow function भित्र `this` ले के जनाउँछ बदल्न सक्छ?", jp: "`.bind()`はアロー関数内のthisが指すものを変更できる？" },
          options: [
            { en: "No — arrow functions ignore all explicit binding attempts", np: "होइन — arrow functions ले सबै explicit binding प्रयासलाई बेवास्ता गर्छन्", jp: "いいえ — アロー関数はすべての明示的束縛の試みを無視する" },
            { en: "Yes, exactly like a regular function", np: "हो, regular function जस्तै ठ्याक्कै", jp: "はい、通常の関数とまったく同じ" },
          ],
          correctIndex: 0,
          explanation: { en: "Since arrow functions never had a dynamic this-binding mechanism to begin with, there is nothing for bind()/call()/apply() to override.", np: "Arrow functions मा सुरुदेखि नै dynamic this-binding mechanism नभएकाले, bind()/call()/apply() ले override गर्ने केही हुँदैन।", jp: "アロー関数には最初から動的なthis束縛機構がないため、bind()/call()/apply()が上書きするものが何もない。" },
        },
      ],
    },
    {
      id: "call-apply-bind",
      title: { en: "call, apply, and bind in Depth", np: "call, apply, bind विस्तारमा", jp: "call・apply・bindの詳細" },
      durationMinutes: 9,
      explanation: {
        en: "All three methods explicitly control what `this` is inside a function, but they differ in when they run and how arguments are passed:\n\n• <b>call(thisArg, a, b, c)</b> — invokes the function immediately, with arguments passed individually\n• <b>apply(thisArg, [a, b, c])</b> — invokes the function immediately, with arguments passed as a single array — useful when your arguments already exist as an array\n• <b>bind(thisArg, a, b)</b> — does NOT invoke the function; it returns a brand-new function with `this` (and optionally some leading arguments) permanently fixed, ready to be called later\n\nA classic use case for `bind()` is fixing `this` for an event handler or a callback that will be invoked much later, by code that has no idea what object it \"belongs\" to. With the spread operator available in modern JS, `apply` is rarely needed on its own — `fn.call(thisArg, ...args)` covers the same case.",
        np: "तीनैले `this` explicitly control गर्छन् तर फरक तरिकाले: call ले arguments individually लिन्छ, apply ले array मा लिन्छ, दुवैले तुरुन्तै call गर्छन्। bind ले तुरुन्तै call गर्दैन — this permanently fixed भएको नयाँ function फर्काउँछ, पछि call गर्न।",
        jp: "3つとも明示的にthisを制御するが方法が異なる: callは個別引数、applyは配列引数で、両方とも即座に呼び出す。bindは即座に呼び出さず、thisが固定された新しい関数を返し後で使う。",
      },
      diagram: `                 Calls now?   Arguments as        Returns
call(obj,a,b)      YES        a, b (individual)   fn's return value
apply(obj,[a,b])   YES        [a, b] (array)      fn's return value
bind(obj,a,b)      NO         pre-filled (a, b)    a NEW function

bind() is like currying 'this' itself — the returned function
remembers its 'this' and any pre-filled args forever.`,
      codeExample: {
        title: { en: "call, apply, and bind side by side", np: "call, apply, bind एकैसाथ", jp: "call・apply・bindの比較" },
        code: `function introduce(greeting, punctuation) {
  console.log(\`\${greeting}, I'm \${this.name}\${punctuation}\`);
}

const alice = { name: "Alice" };
const bob   = { name: "Bob" };

// ── call — pass 'this' and arguments one by one ───────────────────
introduce.call(alice, "Hello", "!");   // "Hello, I'm Alice!"
introduce.call(bob,   "Hi", ".");      // "Hi, I'm Bob."

// ── apply — pass 'this' and arguments as an array ──────────────────
introduce.apply(alice, ["Hey", "?"]);  // "Hey, I'm Alice?"

// ── bind — returns a NEW function with 'this' permanently fixed ────
const aliceIntro = introduce.bind(alice, "Howdy");  // 'greeting' pre-filled too
aliceIntro("!");  // "Howdy, I'm Alice!"
aliceIntro("?");  // "Howdy, I'm Alice?"

// ── Real use case: borrowing an array method for an array-like ─────
function sumArguments() {
  // 'arguments' is array-like but not a real array — borrow Array's reduce
  return Array.prototype.reduce.call(arguments, (sum, n) => sum + n, 0);
}
sumArguments(1, 2, 3);  // 6

// ── Real use case: fixing 'this' for an event handler ───────────────
class Button {
  constructor(label) {
    this.label = label;
    this.onClick = this.onClick.bind(this);  // permanently fix 'this' to the instance
  }
  onClick() { console.log(\`\${this.label} clicked\`); }
}
const btn = new Button("Submit");
// document.addEventListener("click", btn.onClick);  // 'this' stays correct even when detached`,
      },
      keyTakeaways: [
        { en: "`call(thisArg, a, b)` and `apply(thisArg, [a, b])` both invoke the function immediately — they differ only in how arguments are passed (individually vs. as an array).", np: "`call(thisArg, a, b)` र `apply(thisArg, [a, b])` दुवैले function तुरुन्तै invoke गर्छन् — फरक arguments pass गर्ने तरिकामा मात्र (individual vs array)।", jp: "`call(thisArg, a, b)`と`apply(thisArg, [a, b])`はどちらも関数を即座に呼び出す。違いは引数の渡し方（個別か配列か）だけ。" },
        { en: "`bind(thisArg)` does NOT call the function — it returns a new function with `this` permanently locked in, for use later as a callback or event handler.", np: "`bind(thisArg)` ले function call गर्दैन — यसले `this` permanently locked भएको नयाँ function फर्काउँछ, पछि callback वा event handler का लागि।", jp: "`bind(thisArg)`は関数を呼び出さない。thisが永久に固定された新しい関数を返し、後でコールバックやイベントハンドラとして使う。" },
        { en: "A common real-world use of `bind()` is fixing `this` on a class method before passing it as a callback, so the method still works correctly once detached from the instance.", np: "`bind()` को सामान्य real-world use: callback को रूपमा pass गर्नुअघि class method मा `this` fix गर्नु, ताकि instance बाट detach भएपछि पनि सहि काम गरोस्।", jp: "`bind()`の一般的な実用例は、コールバックとして渡す前にクラスメソッドのthisを固定すること。インスタンスから切り離されても正しく動作する。" },
      ],
      commonMistakes: [
        { en: "Mixing up `call`'s individual-argument signature with `apply`'s array signature — passing an array to `call` sends the whole array as a single argument, not spread out.", np: "`call` को individual-argument signature र `apply` को array signature मिलाउनु — `call` मा array pass गर्दा array नै एउटा argument बन्छ, फैलिँदैन।", jp: "callの個別引数シグネチャとapplyの配列シグネチャを混同すること。callに配列を渡すと配列全体が1つの引数として送られる。" },
        { en: "Calling `bind()` and expecting the function to run immediately — `bind()` only returns a new function; you still have to call that returned function.", np: "`bind()` call गरेर function तुरुन्तै चल्छ भन्ने आशा गर्नु — `bind()` ले नयाँ function मात्र फर्काउँछ; त्यो returned function लाई अझै call गर्नुपर्छ।", jp: "`bind()`を呼び出すと即座に関数が実行されると期待すること。`bind()`は新しい関数を返すだけで、その関数はまだ呼び出す必要がある。" },
        { en: "Forgetting to bind a class method used as an event handler, then being confused why `this` is `undefined` inside it when the event fires.", np: "Event handler को रूपमा प्रयोग हुने class method bind गर्न बिर्सनु, अनि event fire हुँदा `this` `undefined` भएकोमा confuse हुनु।", jp: "イベントハンドラとして使うクラスメソッドをbindし忘れ、イベント発火時にthisがundefinedになって混乱すること。" },
      ],
      quiz: [
        {
          question: { en: "What is the main difference between `call()` and `apply()`?", np: "`call()` र `apply()` बीचको मुख्य फरक के हो?", jp: "`call()`と`apply()`の主な違いは？" },
          options: [
            { en: "call passes arguments individually; apply passes them as a single array", np: "call ले arguments individually pass गर्छ; apply ले single array मा pass गर्छ", jp: "callは引数を個別に渡す。applyは単一の配列として渡す" },
            { en: "call returns a new function; apply invokes immediately", np: "call ले नयाँ function फर्काउँछ; apply ले तुरुन्तै invoke गर्छ", jp: "callは新しい関数を返す。applyは即座に呼び出す" },
          ],
          correctIndex: 0,
          explanation: { en: "Both invoke the function right away with a given this — only the argument-passing format differs.", np: "दुवैले given this सँग तुरुन्तै function invoke गर्छन् — argument-passing format मात्र फरक हो।", jp: "両方とも指定されたthisで即座に関数を呼び出す。引数の渡し方だけが異なる。" },
        },
        {
          question: { en: "Does `bind()` call the function immediately?", np: "`bind()` ले function तुरुन्तै call गर्छ?", jp: "`bind()`は関数を即座に呼び出す？" },
          options: [
            { en: "No — it returns a new function to be called later", np: "होइन — यसले पछि call गर्न नयाँ function फर्काउँछ", jp: "いいえ — 後で呼び出すための新しい関数を返す" },
            { en: "Yes, exactly like call()", np: "हो, call() जस्तै ठ्याक्कै", jp: "はい、call()とまったく同じ" },
          ],
          correctIndex: 0,
          explanation: { en: "bind() is the only one of the three that doesn't invoke — it produces a reusable, this-locked function instead.", np: "तीनमध्ये bind() मात्र invoke गर्दैन — बरु reusable, this-locked function उत्पादन गर्छ।", jp: "3つのうちbind()だけが呼び出さない。代わりに再利用可能なthis固定関数を生成する。" },
        },
        {
          question: { en: "Why is it common to write `this.onClick = this.onClick.bind(this)` inside a class constructor?", np: "Class constructor भित्र `this.onClick = this.onClick.bind(this)` लेख्नु किन सामान्य हो?", jp: "クラスのコンストラクタ内で`this.onClick = this.onClick.bind(this)`と書くのが一般的なのはなぜ？" },
          options: [
            { en: "So the method keeps working correctly once it's passed elsewhere as a bare callback, detached from the instance", np: "ताकि method अन्यत्र bare callback को रूपमा pass हुँदा, instance बाट detach भए पनि सहि काम गर्न जारी राखोस्", jp: "メソッドが他の場所に生のコールバックとして渡され、インスタンスから切り離されても正しく動作し続けるように" },
            { en: "It's required syntax for all class methods", np: "यो सबै class methods का लागि आवश्यक syntax हो", jp: "すべてのクラスメソッドに必要な構文だから" },
          ],
          correctIndex: 0,
          explanation: { en: "Without binding, passing a method as a callback (e.g. to an event listener) loses implicit binding, and 'this' becomes undefined when it runs.", np: "Bind नगरे, method लाई callback को रूपमा pass गर्दा implicit binding हराउन्छ, र चलाउँदा 'this' undefined हुन्छ।", jp: "束縛しないと、メソッドをコールバックとして渡すと暗黙的束縛が失われ、実行時にthisがundefinedになる。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What is `this` inside a plain function call in strict mode?", np: "Strict mode मा plain function call भित्र `this` के हो?", jp: "strictモードでのプレーンな関数呼び出し内のthisは？" },
      options: [{ en: "`undefined`", np: "`undefined`", jp: "`undefined`" }, { en: "The global object", np: "Global object", jp: "グローバルオブジェクト" }],
      correctIndex: 0,
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
      options: [{ en: "`new` binding — it has the highest priority", np: "`new` binding — highest priority", jp: "`new`束縛 — 最も優先度が高い" }, { en: "Explicit binding always wins", np: "Explicit binding ले सधैं जित्छ", jp: "明示的束縛が常に勝つ" }],
      correctIndex: 0,
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
      options: [{ en: "No — it captures this from the module scope, not the object", np: "होइन — यसले module scope बाट this capture गर्छ, object बाट होइन", jp: "いいえ — オブジェクトではなくモジュールスコープからthisをキャプチャする" }, { en: "Yes — it always refers to the object it's defined on", np: "हो — यो सधैं define भएको object लाई जनाउँछ", jp: "はい — 常に定義されたオブジェクトを指す" }],
      correctIndex: 0,
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
      options: [{ en: "call takes individual arguments; apply takes a single array", np: "call ले individual arguments लिन्छ; apply ले single array लिन्छ", jp: "callは個別の引数を受け取る。applyは単一の配列を受け取る" }, { en: "They pass arguments identically", np: "दुवैले arguments उस्तै तरिकाले pass गर्छन्", jp: "両者は引数を同じように渡す" }],
      correctIndex: 0,
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
      options: [{ en: "So `this` stays correct once the method is detached and called by the event system", np: "ताकि method detach भएर event system ले call गर्दा पनि `this` सहि रहोस्", jp: "メソッドが切り離され、イベントシステムによって呼び出されてもthisが正しいままであるように" }, { en: "It's purely a stylistic convention with no functional effect", np: "यो कुनै functional असर नभएको केवल stylistic convention हो", jp: "機能的な効果はなく、純粋にスタイル上の慣習" }],
      correctIndex: 0,
      explanation: { en: "Event systems call the handler bare, without the instance to the left of a dot, so binding is what preserves the correct this.", np: "Event system ले handler लाई bare call गर्छ, dot को बायाँ instance बिना, त्यसैले bind ले नै सहि this जोगाउँछ।", jp: "イベントシステムはハンドラをドットの左にインスタンスなしで生で呼び出すため、束縛が正しいthisを保持する。" },
    },
  ],
};
