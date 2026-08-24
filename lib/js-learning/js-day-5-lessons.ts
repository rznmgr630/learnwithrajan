import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_5_LESSONS: JsLessonDay = {
  day: 5,
  title: { en: "Closures, Higher-Order Functions & Currying", np: "Closures, Higher-Order Functions र Currying", jp: "クロージャ・高階関数・カリー化" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "closures",
      title: { en: "Closures — the Foundation", np: "Closures — आधार", jp: "クロージャの基礎" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>closure</b> (a function that remembers variables from where it was created) happens when a function is created inside another function.\n\nThe inner function can still access the outer function's variables even after the outer function has finished.\n\nThink of it like a <b>backpack</b> 🎒:\n\n```text\nOuter Function\n     │\n     ├── name = \"Rajan\"\n     │\n     ↓\nInner Function\n     │\n     └── remembers → name\n```\n\nExample:\n\n```javascript\nfunction greet() {\n  const name = \"Rajan\";\n\n  function sayHello() {\n    console.log(name);\n  }\n\n  return sayHello;\n}\n\nconst hello = greet();\n\nhello(); // Rajan\n```\n\nNormally, you might expect `name` to disappear when `greet()` finishes.\n\nBut `sayHello()` still has access to it.\n\nThat's a <b>closure</b>.\n\n---\n\n### A closure keeps a live reference\n\nClosures keep a <b>live reference</b> (a connection to the original variable), not a copy.\n\n```javascript\nfunction counter() {\n  let count = 0;\n\n  return function () {\n    count++;\n    return count;\n  };\n}\n\nconst next = counter();\n\nconsole.log(next()); // 1\nconsole.log(next()); // 2\nconsole.log(next()); // 3\n```\n\nThe inner function keeps access to `count`.\n\n```text\ncount → 0\n   ↓\nnext() → 1\n   ↓\ncount → 1\n   ↓\nnext() → 2\n   ↓\ncount → 2\n```",
        np: "<b>Closure</b> (आफू बनेको ठाउँका variable सम्झने function) तब बन्छ जब एउटा function अर्को function भित्र बनाइन्छ।\n\nOuter function सकिएपछि पनि inner function ले outer function का variable पहुँच गर्न सक्छ।\n\nयसलाई <b>ब्यागप्याक</b> 🎒 जस्तै सोच्नुहोस्:\n\n```text\nOuter Function\n     │\n     ├── name = \"Rajan\"\n     │\n     ↓\nInner Function\n     │\n     └── remembers → name\n```\n\nउदाहरण:\n\n```javascript\nfunction greet() {\n  const name = \"Rajan\";\n\n  function sayHello() {\n    console.log(name);\n  }\n\n  return sayHello;\n}\n\nconst hello = greet();\n\nhello(); // Rajan\n```\n\nसामान्यतया, `greet()` सकिँदा `name` हराउँछ भन्ने तपाईंलाई लाग्न सक्छ।\n\nतर `sayHello()` सँग अझै यसको पहुँच हुन्छ।\n\nयही <b>closure</b> हो।\n\n---\n\n### Closure ले live reference राख्छ\n\nClosure ले copy होइन, <b>live reference</b> (मूल variable सँगको जोडाइ) राख्छ।\n\n```javascript\nfunction counter() {\n  let count = 0;\n\n  return function () {\n    count++;\n    return count;\n  };\n}\n\nconst next = counter();\n\nconsole.log(next()); // 1\nconsole.log(next()); // 2\nconsole.log(next()); // 3\n```\n\nInner function ले `count` को पहुँच राख्छ।\n\n```text\ncount → 0\n   ↓\nnext() → 1\n   ↓\ncount → 1\n   ↓\nnext() → 2\n   ↓\ncount → 2\n```",
        jp: "<b>クロージャ</b>（作られた場所の変数を覚えている関数）は、関数が別の関数の中で作られたときに生まれます。\n\n外側の関数が終わったあとでも、内側の関数は外側の変数にアクセスできます。\n\n<b>バックパック</b> 🎒 のようなものだと考えてください:\n\n```text\nOuter Function\n     │\n     ├── name = \"Rajan\"\n     │\n     ↓\nInner Function\n     │\n     └── remembers → name\n```\n\n例:\n\n```javascript\nfunction greet() {\n  const name = \"Rajan\";\n\n  function sayHello() {\n    console.log(name);\n  }\n\n  return sayHello;\n}\n\nconst hello = greet();\n\nhello(); // Rajan\n```\n\n普通なら `greet()` が終わった時点で `name` は消えると思うかもしれません。\n\nしかし `sayHello()` はまだそれにアクセスできます。\n\nこれが<b>クロージャ</b>です。\n\n---\n\n### クロージャは生きた参照を保つ\n\nクロージャはコピーではなく<b>生きた参照</b>（元の変数へのつながり）を保ちます。\n\n```javascript\nfunction counter() {\n  let count = 0;\n\n  return function () {\n    count++;\n    return count;\n  };\n}\n\nconst next = counter();\n\nconsole.log(next()); // 1\nconsole.log(next()); // 2\nconsole.log(next()); // 3\n```\n\n内側の関数は `count` へのアクセスを保ち続けます。\n\n```text\ncount → 0\n   ↓\nnext() → 1\n   ↓\ncount → 1\n   ↓\nnext() → 2\n   ↓\ncount → 2\n```",
      },
      diagram: `greet()
│
├── name → "Rajan"
│
└── sayHello()
       │
       └── remembers → name
              │
              ↓
           "Rajan"

greet() finishes
       ↓
sayHello() still remembers name`,
      codeExample: {
        title: { en: "A counter that remembers its own count", np: "आफ्नै count सम्झने counter", jp: "自分のカウントを覚えるカウンター" },
        code: `function counter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const next = counter();

console.log(next()); // 1
console.log(next()); // 2
console.log(next()); // 3`,
      },
      keyTakeaways: [
        { en: "<b>Closure</b> → a function remembers variables from its outer scope.", np: "<b>Closure</b> → function ले आफ्नो outer scope का variable सम्झन्छ।", jp: "<b>クロージャ</b> → 関数が外側のスコープの変数を覚えている。" },
        { en: "It is created when a function is created inside another function.", np: "यो एउटा function अर्को function भित्र बनाउँदा बन्छ।", jp: "関数が別の関数の中で作られたときに生まれる。" },
        { en: "The inner function keeps a <b>live reference</b> (connection) to those variables.", np: "Inner function ले ती variable सँग <b>live reference</b> (जोडाइ) राख्छ।", jp: "内側の関数はそれらの変数への<b>生きた参照</b>（つながり）を保つ。" },
        { en: "The outer function can finish, but the variables can stay alive while the closure exists.", np: "Outer function सकिन सक्छ, तर closure रहेसम्म variable जीवित रहन सक्छन्।", jp: "外側の関数は終わってもよいが、クロージャがある間は変数が生き続けられる。" },
        { en: "Closures are commonly used for counters, private data, callbacks, and event handlers.", np: "Closure सामान्यतया counter, private data, callback, र event handler का लागि प्रयोग हुन्छन्।", jp: "クロージャはカウンター・プライベートなデータ・コールバック・イベントハンドラによく使われる。" },
        { en: "Closures use memory because they keep outer variables alive.", np: "Closure ले outer variable जीवित राख्ने हुनाले memory प्रयोग गर्छन्।", jp: "クロージャは外側の変数を生かし続けるためメモリを使う。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking a closure stores a copy</b> — it keeps a connection to the original variable, so the closure always sees the updated value.", np: "<b>Closure ले copy राख्छ भन्ने ठान्नु</b> — यो मूल variable सँग जोडाइ राख्छ, त्यसैले closure ले सधैं अद्यावधिक value देख्छ।", jp: "<b>クロージャはコピーを持つと思う</b> — 元の変数へのつながりを保つので、常に更新後の値が見える。" },
        { en: "<b>Thinking the outer function must stay running</b> — it doesn't. The outer function returns and finishes, and the inner function still has access.", np: "<b>Outer function चलिरहनु पर्छ भन्ने ठान्नु</b> — पर्दैन। Outer function return गरी सकिन्छ, र inner function सँग अझै पहुँच हुन्छ।", jp: "<b>外側の関数が動き続けている必要があると思う</b> — 必要ない。外側の関数はreturnして終わり、それでも内側の関数はアクセスできる。" },
        { en: "<b>Forgetting about memory</b> — a closure keeps its remembered variables alive. Be careful with many closures inside <b>event listeners</b> or <b>timers</b>, since they can hold data in memory longer than expected.", np: "<b>Memory बिर्सनु</b> — closure ले सम्झेका variable जीवित राख्छ। <b>Event listener</b> वा <b>timer</b> भित्र धेरै closure बनाउँदा होसियार हुनुहोस्, तिनले data अपेक्षा भन्दा लामो समय memory मा राख्न सक्छन्।", jp: "<b>メモリを忘れる</b> — クロージャは覚えている変数を生かし続ける。<b>イベントリスナー</b>や<b>タイマー</b>の中で多数作ると、想定より長くデータがメモリに残ることがある。" },
      ],
      quiz: [
        {
          question: { en: "What is a closure?", np: "Closure के हो?", jp: "クロージャとは何か?" },
          options: [
            { en: "A loop", np: "एउटा loop", jp: "ループ" },
            { en: "A function that remembers variables from its outer scope", np: "आफ्नो outer scope का variable सम्झने function", jp: "外側のスコープの変数を覚えている関数" },
            { en: "A special type of object", np: "object को एक विशेष प्रकार", jp: "特殊な種類のオブジェクト" },
          ],
          correctIndex: 1,
          explanation: { en: "It is formed when a function is created inside another and keeps access to that outer scope.", np: "यो एउटा function अर्को भित्र बन्दा बन्छ र त्यो outer scope को पहुँच राख्छ।", jp: "関数が別の関数の中で作られ、その外側のスコープへのアクセスを保つときに生まれる。" },
        },
        {
          question: { en: "Does a closure keep a copy of the variable?", np: "Closure ले variable को copy राख्छ?", jp: "クロージャは変数のコピーを持つか?" },
          options: [
            { en: "Yes", np: "हो", jp: "はい" },
            { en: "No, it keeps a live reference", np: "होइन, यो live reference राख्छ", jp: "いいえ、生きた参照を保つ" },
          ],
          correctIndex: 1,
          explanation: { en: "Because it is a live reference, later changes to the variable are visible inside the closure.", np: "Live reference भएकाले, variable मा पछि हुने परिवर्तन closure भित्र देखिन्छ।", jp: "生きた参照なので、後の変更もクロージャの中から見える。" },
        },
        {
          question: { en: "Can the outer function finish while the closure still works?", np: "Closure काम गरिरहँदा outer function सकिन सक्छ?", jp: "クロージャが動いている間に外側の関数は終われるか?" },
          options: [
            { en: "Yes", np: "सक्छ", jp: "はい" },
            { en: "No", np: "सक्दैन", jp: "いいえ" },
          ],
          correctIndex: 0,
          explanation: { en: "The outer call returns and leaves the stack, but the variables it holds stay alive for the closure.", np: "Outer call return गरी stack छोड्छ, तर यसले राखेका variable closure का लागि जीवित रहन्छन्।", jp: "外側の呼び出しはreturnしてスタックから外れるが、保持していた変数はクロージャのために生き続ける。" },
        },
        {
          question: { en: "What does a closure keep alive?", np: "Closure ले के जीवित राख्छ?", jp: "クロージャは何を生かし続けるか?" },
          options: [
            { en: "Outer variables it needs", np: "यसलाई चाहिने outer variable", jp: "必要な外側の変数" },
            { en: "The entire application", np: "पूरै application", jp: "アプリ全体" },
            { en: "The browser", np: "Browser", jp: "ブラウザ" },
          ],
          correctIndex: 0,
          explanation: { en: "Only the variables it actually references, which is why leaks come from holding more than you need.", np: "यसले वास्तवमा reference गरेका variable मात्र, त्यसैले चाहिने भन्दा धेरै राख्दा leak हुन्छ।", jp: "実際に参照している変数だけ。だから必要以上に保持するとリークになる。" },
        },
      ],
    },
    {
      id: "higher-order-functions",
      title: { en: "Higher-Order Functions", np: "Higher-Order Functions", jp: "高階関数" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>higher-order function</b> (a function that takes another function as an argument or returns a function) is a common JavaScript pattern.\n\nThis works because functions are <b>first-class values</b> (functions can be stored, passed around, and returned like normal values).\n\nA function can:\n\n• Be stored in a variable\n• Be passed to another function\n• Be returned from another function\n\n---\n\n### Taking a Function\n\n```javascript\nfunction processUser(name, callback) {\n  callback(name);\n}\n\nfunction greet(name) {\n  console.log(`Hello ${name}`);\n}\n\nprocessUser(\"Rajan\", greet);\n```\n\nHere:\n\n```text\nprocessUser → Higher-Order Function\ngreet       → Function passed as an argument\n```\n\nThe higher-order function doesn't need to know exactly what `greet()` does.\n\n---\n\n### Common Example: `map()`\n\n```javascript\nconst numbers = [1, 2, 3];\n\nconst doubled = numbers.map(function (num) {\n  return num * 2;\n});\n\nconsole.log(doubled);\n// [2, 4, 6]\n```\n\n`map()` is a <b>higher-order function</b> because it receives a function.\n\n```text\nnumbers\n   ↓\nmap()\n   ↓\nfunction(num)\n   ↓\n[2, 4, 6]\n```\n\n---\n\n### Returning a Function\n\nA higher-order function can also return another function.\n\n```javascript\nfunction createMultiplier(x) {\n  return function (num) {\n    return num * x;\n  };\n}\n\nconst double = createMultiplier(2);\n\nconsole.log(double(5)); // 10\n```\n\nHere, `createMultiplier()` returns a function.\n\nThe returned function also forms a <b>closure</b> (it remembers `x` from the outer function).",
        np: "<b>Higher-order function</b> (अर्को function लाई argument रूपमा लिने वा function फर्काउने function) JavaScript को सामान्य pattern हो।\n\nयो सम्भव छ किनकि function <b>first-class value</b> (function लाई सामान्य value जस्तै राख्न, पठाउन र फर्काउन सकिन्छ) हुन्।\n\nFunction यी गर्न सक्छ:\n\n• Variable मा राखिनु\n• अर्को function मा पठाइनु\n• अर्को function बाट फर्काइनु\n\n---\n\n### Function लिनु\n\n```javascript\nfunction processUser(name, callback) {\n  callback(name);\n}\n\nfunction greet(name) {\n  console.log(`Hello ${name}`);\n}\n\nprocessUser(\"Rajan\", greet);\n```\n\nयहाँ:\n\n```text\nprocessUser → Higher-Order Function\ngreet       → Function passed as an argument\n```\n\nHigher-order function लाई `greet()` ठ्याक्कै के गर्छ भन्ने थाहा हुनु आवश्यक छैन।\n\n---\n\n### सामान्य उदाहरण: `map()`\n\n```javascript\nconst numbers = [1, 2, 3];\n\nconst doubled = numbers.map(function (num) {\n  return num * 2;\n});\n\nconsole.log(doubled);\n// [2, 4, 6]\n```\n\n`map()` <b>higher-order function</b> हो किनकि यसले function पाउँछ।\n\n```text\nnumbers\n   ↓\nmap()\n   ↓\nfunction(num)\n   ↓\n[2, 4, 6]\n```\n\n---\n\n### Function फर्काउनु\n\nHigher-order function ले अर्को function पनि फर्काउन सक्छ।\n\n```javascript\nfunction createMultiplier(x) {\n  return function (num) {\n    return num * x;\n  };\n}\n\nconst double = createMultiplier(2);\n\nconsole.log(double(5)); // 10\n```\n\nयहाँ, `createMultiplier()` ले function फर्काउँछ।\n\nफर्काइएको function ले <b>closure</b> पनि बनाउँछ (यो outer function बाट `x` सम्झन्छ)।",
        jp: "<b>高階関数</b>（別の関数を引数として受け取る、あるいは関数を返す関数）はJavaScriptでよく使われるパターンです。\n\nこれが可能なのは、関数が<b>第一級の値</b>（関数を通常の値と同じように保存・受け渡し・返却できる）だからです。\n\n関数は次のことができます:\n\n• 変数に入れる\n• 別の関数に渡す\n• 別の関数から返す\n\n---\n\n### 関数を受け取る\n\n```javascript\nfunction processUser(name, callback) {\n  callback(name);\n}\n\nfunction greet(name) {\n  console.log(`Hello ${name}`);\n}\n\nprocessUser(\"Rajan\", greet);\n```\n\nここでは:\n\n```text\nprocessUser → Higher-Order Function\ngreet       → Function passed as an argument\n```\n\n高階関数は `greet()` が具体的に何をするかを知らなくてかまいません。\n\n---\n\n### よくある例: `map()`\n\n```javascript\nconst numbers = [1, 2, 3];\n\nconst doubled = numbers.map(function (num) {\n  return num * 2;\n});\n\nconsole.log(doubled);\n// [2, 4, 6]\n```\n\n`map()` は関数を受け取るので<b>高階関数</b>です。\n\n```text\nnumbers\n   ↓\nmap()\n   ↓\nfunction(num)\n   ↓\n[2, 4, 6]\n```\n\n---\n\n### 関数を返す\n\n高階関数は別の関数を返すこともできます。\n\n```javascript\nfunction createMultiplier(x) {\n  return function (num) {\n    return num * x;\n  };\n}\n\nconst double = createMultiplier(2);\n\nconsole.log(double(5)); // 10\n```\n\nここでは `createMultiplier()` が関数を返しています。\n\n返された関数は<b>クロージャ</b>にもなります（外側の関数の `x` を覚えている）。",
      },
      diagram: `Higher-Order Function
        │
        ├── Takes a function
        │       ↓
        │   custom behavior
        │
        └── Returns a function
                ↓
          new function`,
      codeExample: {
        title: { en: "Taking a function, and returning one", np: "Function लिनु, र फर्काउनु", jp: "関数を受け取り、関数を返す" },
        code: `// Taking a function
function processUser(name, callback) {
  callback(name);
}

function greet(name) {
  console.log(\`Hello \${name}\`);
}

processUser("Rajan", greet);

// A built-in higher-order function
const numbers = [1, 2, 3];

const doubled = numbers.map(function (num) {
  return num * 2;
});

console.log(doubled); // [2, 4, 6]

// Returning a function
function createMultiplier(x) {
  return function (num) {
    return num * x;
  };
}

const double = createMultiplier(2);

console.log(double(5)); // 10`,
      },
      keyTakeaways: [
        { en: "<b>Higher-order function</b> → takes a function or returns a function.", np: "<b>Higher-order function</b> → function लिन्छ वा function फर्काउँछ।", jp: "<b>高階関数</b> → 関数を受け取る、または関数を返す。" },
        { en: "<b>First-class value</b> → functions can be stored, passed, and returned like other values.", np: "<b>First-class value</b> → function लाई अरू value जस्तै राख्न, पठाउन र फर्काउन सकिन्छ।", jp: "<b>第一級の値</b> → 関数も他の値と同じように保存・受け渡し・返却できる。" },
        { en: "`map()`, `filter()`, and `reduce()` are common higher-order functions.", np: "`map()`, `filter()`, र `reduce()` सामान्य higher-order function हुन्।", jp: "`map()`・`filter()`・`reduce()` は代表的な高階関数。" },
        { en: "Passing a function lets you provide custom behavior.", np: "Function पठाउँदा तपाईं custom behavior दिन सक्नुहुन्छ।", jp: "関数を渡すことで独自の振る舞いを差し込める。" },
        { en: "Returning a function lets you create specialized functions.", np: "Function फर्काउँदा तपाईं विशेषीकृत function बनाउन सक्नुहुन्छ।", jp: "関数を返すことで特化した関数を作れる。" },
        { en: "Closures and higher-order functions are often used together.", np: "Closure र higher-order function प्रायः सँगै प्रयोग हुन्छन्।", jp: "クロージャと高階関数はよく組み合わせて使われる。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking every function is a higher-order function</b> — `function add(a, b) { return a + b; }` is just a normal function. It becomes higher-order when it takes or returns another function.", np: "<b>हरेक function higher-order function हो भन्ने ठान्नु</b> — `function add(a, b) { return a + b; }` सामान्य function मात्र हो। यो अर्को function लिँदा वा फर्काउँदा higher-order बन्छ।", jp: "<b>すべての関数が高階関数だと思う</b> — `function add(a, b) { return a + b; }` は普通の関数。別の関数を受け取るか返すときに高階関数になる。" },
        { en: "<b>Confusing calling a function with passing it</b> — `process(greet)` passes the function, while `process(greet())` calls `greet` first and passes its result.", np: "<b>Function call गर्नु र पठाउनु भ्रममा पार्नु</b> — `process(greet)` ले function पठाउँछ, जब कि `process(greet())` ले पहिले `greet` call गरी यसको नतिजा पठाउँछ।", jp: "<b>関数を呼ぶことと渡すことを混同する</b> — `process(greet)` は関数を渡し、`process(greet())` はまず `greet` を呼んでその結果を渡す。" },
        { en: "<b>Thinking `map()` knows what your function does</b> — `map()` simply calls your function for each item; your function decides what happens to each one.", np: "<b>`map()` लाई तपाईंको function के गर्छ थाहा छ भन्ने ठान्नु</b> — `map()` ले हरेक item का लागि तपाईंको function मात्र call गर्छ; हरेकलाई के हुन्छ त्यो तपाईंको function ले तय गर्छ।", jp: "<b>`map()` が自分の関数の中身を知っていると思う</b> — `map()` は各要素に対して関数を呼ぶだけ。各要素に何をするかは自分の関数が決める。" },
      ],
      quiz: [
        {
          question: { en: "What is a higher-order function?", np: "Higher-order function के हो?", jp: "高階関数とは何か?" },
          options: [
            { en: "A function that only performs calculations", np: "गणना मात्र गर्ने function", jp: "計算だけを行う関数" },
            { en: "A function that takes or returns another function", np: "अर्को function लिने वा फर्काउने function", jp: "別の関数を受け取る、または返す関数" },
            { en: "A function with many parameters", np: "धेरै parameter भएको function", jp: "引数が多い関数" },
          ],
          correctIndex: 1,
          explanation: { en: "The number of parameters is irrelevant; what matters is whether a function is passed in or returned.", np: "Parameter को संख्या सम्बन्धित छैन; function पठाइयो वा फर्काइयो त्यो मात्र महत्वपूर्ण छ।", jp: "引数の数は関係ない。関数が渡されるか返されるかが本質。" },
        },
        {
          question: { en: "Why can JavaScript pass functions as arguments?", np: "JavaScript ले function लाई argument रूपमा किन पठाउन सक्छ?", jp: "なぜJavaScriptは関数を引数として渡せるのか?" },
          options: [
            { en: "Functions are first-class values", np: "Function first-class value हुन्", jp: "関数が第一級の値だから" },
            { en: "Functions are objects only", np: "Function केवल object हुन्", jp: "関数はオブジェクトにすぎないから" },
            { en: "Because of loops", np: "Loop का कारण", jp: "ループがあるから" },
          ],
          correctIndex: 0,
          explanation: { en: "Being first-class means a function can go anywhere a value can: a variable, an argument, a return value.", np: "First-class हुनुको अर्थ function value जान सक्ने कतै पनि जान सक्छ: variable, argument, return value।", jp: "第一級であるとは、値が置ける場所すべてに関数も置けるということ: 変数・引数・戻り値。" },
        },
        {
          question: { en: "Is `map()` a higher-order function?", np: "`map()` higher-order function हो?", jp: "`map()` は高階関数か?" },
          options: [
            { en: "Yes", np: "हो", jp: "はい" },
            { en: "No", np: "होइन", jp: "いいえ" },
          ],
          correctIndex: 0,
          explanation: { en: "It takes a function and calls it once per item.", np: "यो function लिन्छ र हरेक item का लागि एक पटक call गर्छ।", jp: "関数を受け取り、各要素につき1回呼び出す。" },
        },
        {
          question: { en: "Can a higher-order function return another function?", np: "Higher-order function ले अर्को function फर्काउन सक्छ?", jp: "高階関数は別の関数を返せるか?" },
          options: [
            { en: "Yes", np: "सक्छ", jp: "はい" },
            { en: "No", np: "सक्दैन", jp: "いいえ" },
          ],
          correctIndex: 0,
          explanation: { en: "`createMultiplier(2)` returns a function that remembers `x`, which is a closure too.", np: "`createMultiplier(2)` ले `x` सम्झने function फर्काउँछ, जो closure पनि हो।", jp: "`createMultiplier(2)` は `x` を覚えた関数を返す。それはクロージャでもある。" },
        },
      ],
    },
    {
      id: "currying-composition",
      title: { en: "Currying & Composition", np: "Currying र Composition", jp: "カリー化と合成" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Currying</b> turns a function that expects several arguments at once into a chain of functions that each take exactly one argument, one at a time — `f(a, b, c)` becomes `f(a)(b)(c)`. <b>Partial application</b> is the more general idea: pre-filling some of a function's arguments now, and getting back a new function that only needs the rest later.\n\nThink of a vending machine: a normal function is like paying with the exact amount at once. A curried function is like inserting one coin at a time — the machine remembers what you've already fed it, and only dispenses the result once the final coin arrives.\n\n<b>Function composition</b> chains small, single-purpose functions into a pipeline — `pipe(add1, double, square)` reads left to right as \"do this, then this, then this,\" which is often easier to follow than one large function doing everything at once.",
        np: "Currying ले multi-argument function लाई एक-एक argument लिने functions को chain मा बदल्छ — f(a,b,c) → f(a)(b)(c)।",
        jp: "カリー化は複数の引数を一度に取る関数を、1つずつ引数を取る関数の連鎖に変換する。",
      },
      diagram: `add(2, 3)                       curriedAdd(2)(3)
──────────────                  ──────────────────────
one call, all args at once      curriedAdd(2) ──▶ returns (b) => 2 + b
                                 (b) => 2+b (3) ──▶ 5

pipe(add1, double, square)(3)
  3 → add1 → 4 → double → 8 → square → 64`,
      codeExample: {
        title: { en: "Currying, partial application, and composition", np: "Currying, partial application, composition", jp: "カリー化・部分適用・合成" },
        code: `// ── Curried version ───────────────────────────────────────────────
const curriedAdd = (a) => (b) => a + b;
curriedAdd(2)(3);  // 5
const add2 = curriedAdd(2);   // returns (b) => 2 + b
add2(3);  // 5

// ── Why currying is useful — creating specialised functions ───────
const multiply = (a) => (b) => a * b;
const double  = multiply(2);
const triple  = multiply(3);
[1, 2, 3].map(double);  // [2, 4, 6]

// ── Partial application with bind() ───────────────────────────────
function log(level, message) {
  console.log(\`[\${level.toUpperCase()}] \${message}\`);
}
const logError = log.bind(null, "error");
logError("Database connection failed");   // [ERROR] Database connection failed

// ── Function composition — combining functions ───────────────────
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const add1   = x => x + 1;
const double2 = x => x * 2;
const square = x => x * x;
const transform = pipe(add1, double2, square);
transform(3);  // step1: 3+1=4, step2: 4*2=8, step3: 8*8=64`,
      },
      keyTakeaways: [
        { en: "Currying converts `f(a, b, c)` into `f(a)(b)(c)` — a chain of single-argument functions instead of one multi-argument call.", np: "Currying ले `f(a,b,c)` लाई `f(a)(b)(c)` मा बदल्छ — single-argument functions को chain।", jp: "カリー化は`f(a,b,c)`を`f(a)(b)(c)`に変換する — 単一引数関数の連鎖。" },
        { en: "Partial application (e.g. via `.bind()`) pre-fills some arguments now and returns a new function needing only the rest.", np: "Partial application (जस्तै `.bind()` मार्फत) ले केही arguments अगावै भर्छ र बाँकीका लागि नयाँ function दिन्छ।", jp: "部分適用（例: `.bind()`）は一部の引数を先に埋め、残りだけを必要とする新しい関数を返す。" },
        { en: "Function composition (`pipe`/`compose`) chains small single-purpose functions left-to-right (or right-to-left) into a readable pipeline.", np: "Function composition (`pipe`/`compose`) ले साना function हरूलाई बायाँबाट दायाँ (वा उल्टो) pipeline मा जोड्छ।", jp: "関数合成（`pipe`/`compose`）は小さな単機能関数を左から右（または逆）にパイプラインとして連結する。" },
      ],
      commonMistakes: [
        { en: "Confusing currying with partial application — currying always produces single-argument steps; partial application can fill any number of arguments at once.", np: "Currying र partial application मिलाउनु — currying ले सधैं single-argument steps दिन्छ; partial application ले जुनसुकै संख्याको argument भर्न सक्छ।", jp: "カリー化と部分適用を混同すること。カリー化は常に単一引数のステップを生む。部分適用は任意数の引数を一度に埋められる。" },
        { en: "Mixing up the order in `pipe` (left-to-right) vs `compose` (right-to-left) and getting the wrong transformation order.", np: "`pipe` (बायाँबाट दायाँ) र `compose` (दायाँबाट बायाँ) को order मिलाउनु।", jp: "`pipe`（左から右）と`compose`（右から左）の順序を混同すること。" },
        { en: "Over-currying every function in a codebase \"just in case\" — it adds indirection that isn't worth it unless you actually reuse partially-applied versions.", np: "पूरै codebase मा हरेक function लाई 'just in case' curry गर्नु — यसले अनावश्यक indirection थप्छ।", jp: "「念のため」コードベースのすべての関数をカリー化すること。実際に部分適用版を再利用しない限り価値のない間接化を加える。" },
      ],
      quiz: [
        {
          question: { en: "What does currying turn `f(a, b, c)` into?", np: "Currying ले `f(a, b, c)` लाई केमा बदल्छ?", jp: "カリー化は`f(a, b, c)`を何に変換する？" },
          options: [{ en: "f(a)(b)(c)", np: "f(a)(b)(c)", jp: "f(a)(b)(c)" }, { en: "f(a, b, c, d)", np: "f(a, b, c, d)", jp: "f(a, b, c, d)" }],
          correctIndex: 0,
          explanation: { en: "Currying converts a multi-argument call into a chain of single-argument function calls.", np: "Currying ले multi-argument call लाई single-argument function calls को chain मा बदल्छ।", jp: "カリー化は多引数呼び出しを単一引数関数呼び出しの連鎖に変換する。" },
        },
        {
          question: { en: "In `pipe(add1, double, square)(3)`, in what order do the functions run?", np: "`pipe(add1, double, square)(3)` मा function हरू कुन order मा चल्छन्?", jp: "`pipe(add1, double, square)(3)`で関数はどの順序で実行される？" },
          options: [{ en: "Left to right: add1, then double, then square", np: "बायाँबाट दायाँ: add1, double, square", jp: "左から右: add1、double、square" }, { en: "Right to left: square, then double, then add1", np: "दायाँबाट बायाँ: square, double, add1", jp: "右から左: square、double、add1" }],
          correctIndex: 0,
          explanation: { en: "pipe runs functions left-to-right, in the order listed; compose runs right-to-left.", np: "pipe ले listed order मा बायाँबाट दायाँ चलाउँछ; compose ले दायाँबाट बायाँ चलाउँछ।", jp: "pipeは記載順に左から右へ実行。composeは右から左へ実行。" },
        },
        {
          question: { en: "What does `.bind(null, \"error\")` do to a two-argument function `log(level, message)`?", np: "`.bind(null, \"error\")` ले `log(level, message)` मा के गर्छ?", jp: "`.bind(null, \"error\")`は2引数関数`log(level, message)`に何をする？" },
          options: [{ en: "Calls log immediately with level=\"error\"", np: "level='error' सँग log तुरुन्तै call गर्छ", jp: "level=\"error\"で即座にlogを呼び出す" }, { en: "Returns a new function that only needs the remaining `message` argument", np: "बाँकी `message` argument मात्र चाहिने नयाँ function फर्काउँछ", jp: "残りの`message`引数だけを必要とする新しい関数を返す" }],
          correctIndex: 1,
          explanation: { en: "This is partial application — level is pre-filled, and the returned function only needs message.", np: "यो partial application हो — level pre-filled हुन्छ, return भएको function लाई message मात्र चाहिन्छ।", jp: "これは部分適用 — levelは先に埋められ、返された関数はmessageだけを必要とする。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "After `outer()` finishes running, does its local variable captured by a returned inner function disappear?", np: "`outer()` सकिएपछि return भएको inner function ले captured गरेको local variable हराउँछ?", jp: "`outer()`の実行後、返された内側の関数がキャプチャしたローカル変数は消える？" },
      options: [{ en: "Yes, immediately", np: "हो, तुरुन्तै", jp: "はい、すぐに" }, { en: "No — the closure keeps it alive", np: "होइन — closure ले जिउँदो राख्छ", jp: "いいえ — クロージャが保持し続ける" }],
      correctIndex: 1,
      explanation: { en: "As long as the inner function still references it, the variable stays alive.", np: "Inner function ले reference गरेसम्म variable जिउँदो रहन्छ।", jp: "内側の関数が参照し続ける限り変数は生き続ける。" },
    },
    {
      question: { en: "Do two separate calls to the same closure factory share the captured variable?", np: "एउटै closure factory का दुई फरक call ले captured variable share गर्छन्?", jp: "同じクロージャファクトリの2つの呼び出しはキャプチャした変数を共有する？" },
      options: [{ en: "Yes", np: "हो", jp: "はい" }, { en: "No — each call gets an independent copy", np: "होइन — हरेक call को independent copy हुन्छ", jp: "いいえ — 各呼び出しは独立したコピーを持つ" }],
      correctIndex: 1,
      explanation: { en: "Each call creates a fresh scope and a fresh closure.", np: "हरेक call ले नयाँ scope र नयाँ closure बनाउँछ।", jp: "各呼び出しは新しいスコープと新しいクロージャを作る。" },
    },
    {
      question: { en: "What is a common risk of closures if not cleaned up?", np: "Cleanup नगरेमा closure को सामान्य जोखिम के हो?", jp: "クリーンアップしない場合のクロージャの一般的なリスクは？" },
      options: [{ en: "Slower execution", np: "ढिलो execution", jp: "実行が遅くなる" }, { en: "Variables staying alive in memory longer than needed", np: "Variable अनुमान भन्दा बढी समय memory मा रहनु", jp: "変数が必要以上に長くメモリに残る" }],
      correctIndex: 1,
      explanation: { en: "Closures attached to long-lived listeners/timers can quietly block garbage collection.", np: "लामो समय रहने listener/timer मा जोडिएको closure ले garbage collection रोक्न सक्छ।", jp: "長寿命のリスナー・タイマーに結び付いたクロージャはガベージコレクションを妨げることがある。" },
    },
    {
      question: { en: "What makes a function \"higher-order\"?", np: "कुन कुराले function लाई 'higher-order' बनाउँछ?", jp: "何が関数を「高階」にする？" },
      options: [{ en: "It takes or returns a function", np: "यसले function लिन्छ वा return गर्छ", jp: "関数を受け取るか返す" }, { en: "It runs asynchronously", np: "Asynchronously चल्छ", jp: "非同期で実行される" }],
      correctIndex: 0,
      explanation: { en: "Taking a function as an argument or returning one is the defining trait.", np: "Function argument को रूपमा लिनु वा return गर्नु नै defining trait हो।", jp: "関数を引数に取るか返すことが定義的な特徴。" },
    },
    {
      question: { en: "Which of these is a built-in higher-order function?", np: "यीमध्ये कुन built-in higher-order function हो?", jp: "次のうち組み込み高階関数はどれ？" },
      options: [{ en: "Array.prototype.map", np: "Array.prototype.map", jp: "Array.prototype.map" }, { en: "String.prototype.trim", np: "String.prototype.trim", jp: "String.prototype.trim" }],
      correctIndex: 0,
      explanation: { en: "map() takes a function argument and calls it per item.", np: "map() ले function argument लिन्छ र हरेक item मा call गर्छ।", jp: "map()は関数引数を受け取り各要素に対して呼び出す。" },
    },
    {
      question: { en: "What's wrong with passing `doThing()` instead of `doThing` as a callback?", np: "Callback को रूपमा `doThing` को सट्टा `doThing()` pass गर्दा के गल्ती?", jp: "コールバックとして`doThing`ではなく`doThing()`を渡すと何が問題？" },
      options: [{ en: "Nothing", np: "केही छैन", jp: "問題ない" }, { en: "It calls the function immediately, passing its result instead of the function", np: "यसले function तुरुन्तै call गर्छ, function को सट्टा result pass गर्छ", jp: "即座に関数を呼び出し、関数の代わりに結果を渡す" }],
      correctIndex: 1,
      explanation: { en: "You must pass a function reference so it can be called later, not the result of calling it now.", np: "पछि call गर्न function reference pass गर्नुपर्छ, अहिले call गरेको result होइन।", jp: "後で呼び出せるように関数参照を渡す必要がある。今呼び出した結果ではない。" },
    },
    {
      question: { en: "What does currying turn `f(a, b, c)` into?", np: "Currying ले `f(a, b, c)` लाई केमा बदल्छ?", jp: "カリー化は`f(a, b, c)`を何に変換する？" },
      options: [{ en: "f(a)(b)(c)", np: "f(a)(b)(c)", jp: "f(a)(b)(c)" }, { en: "f(c, b, a)", np: "f(c, b, a)", jp: "f(c, b, a)" }],
      correctIndex: 0,
      explanation: { en: "Currying chains single-argument function calls.", np: "Currying ले single-argument function calls को chain बनाउँछ।", jp: "カリー化は単一引数関数呼び出しの連鎖を作る。" },
    },
    {
      question: { en: "In `pipe(add1, double, square)(3)`, what order do the functions run in?", np: "`pipe(add1, double, square)(3)` मा function हरू कुन order मा चल्छन्?", jp: "`pipe(add1, double, square)(3)`の実行順序は？" },
      options: [{ en: "Left to right", np: "बायाँबाट दायाँ", jp: "左から右" }, { en: "Right to left", np: "दायाँबाट बायाँ", jp: "右から左" }],
      correctIndex: 0,
      explanation: { en: "pipe runs functions in the order listed, left to right; compose is the right-to-left version.", np: "pipe ले listed order मा बायाँबाट दायाँ चलाउँछ; compose उल्टो हो।", jp: "pipeは記載順に左から右へ実行。composeは逆。" },
    },
    {
      question: { en: "What does `.bind(null, \"error\")` do to `log(level, message)`?", np: "`.bind(null, \"error\")` ले `log(level, message)` मा के गर्छ?", jp: "`.bind(null, \"error\")`は`log(level, message)`に何をする？" },
      options: [{ en: "Returns a new function needing only `message`", np: "बाँकी `message` मात्र चाहिने नयाँ function फर्काउँछ", jp: "残りの`message`だけを必要とする新しい関数を返す" }, { en: "Calls log immediately", np: "log तुरुन्तै call गर्छ", jp: "即座にlogを呼び出す" }],
      correctIndex: 0,
      explanation: { en: "bind() with a leading argument performs partial application, pre-filling level.", np: "bind() ले leading argument सहित partial application गर्छ, level pre-fill हुन्छ।", jp: "先頭引数付きのbind()は部分適用を行い、levelを先に埋める。" },
    },
    {
      question: { en: "Is currying the same thing as partial application?", np: "Currying र partial application उस्तै हो?", jp: "カリー化と部分適用は同じ？" },
      options: [{ en: "Yes, identical", np: "हो, उस्तै", jp: "はい、同一" }, { en: "No — currying is a special, always-single-argument form of the more general partial application", np: "होइन — currying partial application को special, सधैं single-argument form हो", jp: "いいえ — カリー化はより一般的な部分適用の特殊で常に単一引数の形" }],
      correctIndex: 1,
      explanation: { en: "Currying always produces single-argument steps; partial application can fill any number of arguments at once.", np: "Currying ले सधैं single-argument steps दिन्छ; partial application ले जुनसुकै संख्याको argument भर्न सक्छ।", jp: "カリー化は常に単一引数のステップを生む。部分適用は任意数の引数を一度に埋められる。" },
    },
  ],
};
