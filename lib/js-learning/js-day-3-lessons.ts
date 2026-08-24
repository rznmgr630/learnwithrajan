import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_3_LESSONS: JsLessonDay = {
  day: 3,
  title: { en: "Operators, Conditionals & Functions", np: "Operators, Conditionals र Functions", jp: "演算子・条件分岐・関数" },
  totalMinutes: 36,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "operators",
      title: { en: "Operators", np: "Operators", jp: "演算子" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Operators</b> (symbols that perform an operation on values) are used to calculate, compare, or combine values.\n\nExamples:\n\n```javascript\n+\n-\n*\n/\n===\n&&\n||\n??\n?.\n```\n\nMost operators are straightforward, but three are especially useful to understand:\n\n• `||` → OR\n• `??` → nullish coalescing\n• `?.` → optional chaining\n\n---\n\n### 1. `||` — OR\n\n<b>`||`</b> (OR operator that uses a fallback when the left value is falsy) returns the right side when the left side is <b>falsy</b>.\n\n```javascript\nconst name = \"\";\n\nconsole.log(name || \"Guest\");\n// \"Guest\"\n```\n\nRemember, these values are falsy:\n\n```text\nfalse\n0\n\"\"\nnull\nundefined\nNaN\n```\n\nThis can cause problems with numbers:\n\n```javascript\nconst count = 0;\n\nconsole.log(count || 10);\n// 10\n```\n\nThe `0` was a real value, but `||` treated it as falsy.\n\n---\n\n### 2. `??` — Nullish Coalescing\n\n<b>Nullish coalescing</b> (using a fallback only when a value is `null` or `undefined`) uses the right side only when the left side is `null` or `undefined`.\n\n```javascript\nconst count = 0;\n\nconsole.log(count ?? 10);\n// 0\n```\n\nThis is different from `||`.\n\n```javascript\n0 || 10;   // 10\n0 ?? 10;   // 0\n\n\"\" || \"Hi\";  // \"Hi\"\n\"\" ?? \"Hi\";  // \"\"\n\nfalse || true; // true\nfalse ?? true; // false\n```\n\nThink:\n\n```text\n|| → fallback for any falsy value\n\n?? → fallback only for null or undefined\n```\n\n---\n\n### 3. `?.` — Optional Chaining\n\n<b>Optional chaining</b> (safely accessing a value that might not exist) prevents an error when part of an object is `null` or `undefined`.\n\nWithout `?.`:\n\n```javascript\nconst user = {};\n\nconsole.log(user.address.city);\n// Error\n```\n\nWith `?.`:\n\n```javascript\nconsole.log(user.address?.city);\n// undefined\n```\n\nIf JavaScript finds `null` or `undefined` while following the chain, it stops and returns `undefined`.\n\nExample:\n\n```javascript\nconst user = null;\n\nconsole.log(user?.name);\n// undefined\n```\n\nInstead of:\n\n```javascript\nuser.name;\n// Error\n```",
        np: "<b>Operator</b> (value माथि काम गर्ने चिन्ह) value गणना गर्न, तुलना गर्न, वा जोड्न प्रयोग हुन्छन्।\n\nउदाहरण:\n\n```javascript\n+\n-\n*\n/\n===\n&&\n||\n??\n?.\n```\n\nधेरैजसो operator सरल छन्, तर तीन ओटा बुझ्न विशेष उपयोगी छन्:\n\n• `||` → OR\n• `??` → nullish coalescing\n• `?.` → optional chaining\n\n---\n\n### 1. `||` — OR\n\n<b>`||`</b> (बायाँ value falsy भएमा fallback प्रयोग गर्ने OR operator) बायाँ पट्टि <b>falsy</b> भएमा दायाँ पट्टि फर्काउँछ।\n\n```javascript\nconst name = \"\";\n\nconsole.log(name || \"Guest\");\n// \"Guest\"\n```\n\nसम्झनुहोस्, यी value falsy हुन्:\n\n```text\nfalse\n0\n\"\"\nnull\nundefined\nNaN\n```\n\nयसले संख्यासँग समस्या ल्याउन सक्छ:\n\n```javascript\nconst count = 0;\n\nconsole.log(count || 10);\n// 10\n```\n\n`0` वास्तविक value थियो, तर `||` ले यसलाई falsy मानिदियो।\n\n---\n\n### 2. `??` — Nullish Coalescing\n\n<b>Nullish coalescing</b> (value `null` वा `undefined` हुँदा मात्र fallback प्रयोग गर्नु) ले बायाँ पट्टि `null` वा `undefined` हुँदा मात्र दायाँ पट्टि प्रयोग गर्छ।\n\n```javascript\nconst count = 0;\n\nconsole.log(count ?? 10);\n// 0\n```\n\nयो `||` भन्दा फरक छ।\n\n```javascript\n0 || 10;   // 10\n0 ?? 10;   // 0\n\n\"\" || \"Hi\";  // \"Hi\"\n\"\" ?? \"Hi\";  // \"\"\n\nfalse || true; // true\nfalse ?? true; // false\n```\n\nसोच्नुहोस्:\n\n```text\n|| → fallback for any falsy value\n\n?? → fallback only for null or undefined\n```\n\n---\n\n### 3. `?.` — Optional Chaining\n\n<b>Optional chaining</b> (अवस्थित नहुन सक्ने value सुरक्षित रूपमा पहुँच गर्नु) ले object को कुनै भाग `null` वा `undefined` हुँदा error आउनबाट रोक्छ।\n\n`?.` बिना:\n\n```javascript\nconst user = {};\n\nconsole.log(user.address.city);\n// Error\n```\n\n`?.` सँग:\n\n```javascript\nconsole.log(user.address?.city);\n// undefined\n```\n\nChain पछ्याउँदै जाँदा JavaScript ले `null` वा `undefined` भेट्यो भने, यो रोकिन्छ र `undefined` फर्काउँछ।\n\nउदाहरण:\n\n```javascript\nconst user = null;\n\nconsole.log(user?.name);\n// undefined\n```\n\nयसको साटो:\n\n```javascript\nuser.name;\n// Error\n```",
        jp: "<b>演算子</b>（値に対して操作を行う記号）は、値を計算・比較・結合するために使います。\n\n例:\n\n```javascript\n+\n-\n*\n/\n===\n&&\n||\n??\n?.\n```\n\nほとんどの演算子は分かりやすいですが、特に理解しておくと役立つものが3つあります:\n\n• `||` → OR\n• `??` → null合体（nullish coalescing）\n• `?.` → オプショナルチェーン\n\n---\n\n### 1. `||` — OR\n\n<b>`||`</b>（左の値がfalsyのときフォールバックを使うOR演算子）は、左側が<b>falsy</b>のときに右側を返します。\n\n```javascript\nconst name = \"\";\n\nconsole.log(name || \"Guest\");\n// \"Guest\"\n```\n\nfalsyな値は次のとおりです:\n\n```text\nfalse\n0\n\"\"\nnull\nundefined\nNaN\n```\n\nこれは数値で問題を起こすことがあります:\n\n```javascript\nconst count = 0;\n\nconsole.log(count || 10);\n// 10\n```\n\n`0` は本物の値でしたが、`||` はそれをfalsyとして扱いました。\n\n---\n\n### 2. `??` — null合体\n\n<b>null合体（Nullish coalescing）</b>（値が `null` か `undefined` のときだけフォールバックを使う）は、左側が `null` か `undefined` のときだけ右側を使います。\n\n```javascript\nconst count = 0;\n\nconsole.log(count ?? 10);\n// 0\n```\n\nこれは `||` とは違います。\n\n```javascript\n0 || 10;   // 10\n0 ?? 10;   // 0\n\n\"\" || \"Hi\";  // \"Hi\"\n\"\" ?? \"Hi\";  // \"\"\n\nfalse || true; // true\nfalse ?? true; // false\n```\n\nこう考えてください:\n\n```text\n|| → fallback for any falsy value\n\n?? → fallback only for null or undefined\n```\n\n---\n\n### 3. `?.` — オプショナルチェーン\n\n<b>オプショナルチェーン</b>（存在しないかもしれない値に安全にアクセスする）は、オブジェクトの一部が `null` や `undefined` のときにエラーを防ぎます。\n\n`?.` なし:\n\n```javascript\nconst user = {};\n\nconsole.log(user.address.city);\n// Error\n```\n\n`?.` あり:\n\n```javascript\nconsole.log(user.address?.city);\n// undefined\n```\n\nチェーンをたどる途中で `null` か `undefined` を見つけると、JavaScriptはそこで止まって `undefined` を返します。\n\n例:\n\n```javascript\nconst user = null;\n\nconsole.log(user?.name);\n// undefined\n```\n\nこう書く代わりに:\n\n```javascript\nuser.name;\n// Error\n```",
      },
      diagram: `                    Operators
                        |
        +---------------+---------------+
        |               |               |
       ||              ??              ?.
      OR          Nullish fallback   Safe access
        |               |               |
   Any falsy       null / undefined   Stops safely
   → fallback       → fallback       → undefined


|| vs ??

count = 0

count || 10
    ↓
0 is falsy
    ↓
10

count ?? 10
    ↓
0 is NOT null/undefined
    ↓
0`,
      codeExample: {
        title: { en: "OR, nullish coalescing and optional chaining", np: "OR, nullish coalescing र optional chaining", jp: "OR・null合体・オプショナルチェーン" },
        code: `const count = 0;
const name = "";
const user = null;

// OR
console.log(count || 10);
// 10

// Nullish coalescing
console.log(count ?? 10);
// 0

// Optional chaining
console.log(user?.name);
// undefined`,
      },
      keyTakeaways: [
        { en: "<b>Operators</b> → symbols that perform operations on values.", np: "<b>Operator</b> → value माथि काम गर्ने चिन्ह।", jp: "<b>演算子</b> → 値に対して操作を行う記号。" },
        { en: "`||` → uses the right side when the left side is falsy.", np: "`||` → बायाँ पट्टि falsy हुँदा दायाँ पट्टि प्रयोग गर्छ।", jp: "`||` → 左側がfalsyのとき右側を使う。" },
        { en: "`??` → uses the right side only for `null` or `undefined`.", np: "`??` → `null` वा `undefined` का लागि मात्र दायाँ पट्टि प्रयोग गर्छ।", jp: "`??` → `null` か `undefined` のときだけ右側を使う。" },
        { en: "`?.` → safely accesses properties that might not exist.", np: "`?.` → अवस्थित नहुन सक्ने property सुरक्षित रूपमा पहुँच गर्छ।", jp: "`?.` → 存在しないかもしれないプロパティに安全にアクセスする。" },
        { en: "Use `??` when `0`, `\"\"`, or `false` are valid values.", np: "`0`, `\"\"`, वा `false` मान्य value हुँदा `??` प्रयोग गर्नुहोस्।", jp: "`0`、`\"\"`、`false` が有効な値のときは `??` を使う。" },
        { en: "Use `?.` to avoid errors when accessing nested data.", np: "Nested data पहुँच गर्दा error बच्न `?.` प्रयोग गर्नुहोस्।", jp: "入れ子のデータにアクセスするときは `?.` でエラーを避ける。" },
      ],
      commonMistakes: [
        { en: "<b>Using `||` when `0` is a valid value</b> — `const count = 0; count || 10` gives `10`. If `0` is valid, use `count ?? 10`, which gives `0`.", np: "<b>`0` मान्य value हुँदा `||` प्रयोग गर्नु</b> — `const count = 0; count || 10` ले `10` दिन्छ। `0` मान्य भए `count ?? 10` प्रयोग गर्नुहोस्, जो `0` दिन्छ।", jp: "<b>`0` が有効な値なのに `||` を使う</b> — `const count = 0; count || 10` は `10` になる。`0` が有効なら `count ?? 10` を使えば `0` になる。" },
        { en: "<b>Thinking `??` handles every falsy value</b> — `false ?? true` is `false`, `0 ?? 10` is `0`, `\"\" ?? \"Hello\"` is `\"\"`. `??` only checks for `null` and `undefined`.", np: "<b>`??` ले हरेक falsy value सम्हाल्छ भन्ने ठान्नु</b> — `false ?? true` `false` हो, `0 ?? 10` `0` हो, `\"\" ?? \"Hello\"` `\"\"` हो। `??` ले `null` र `undefined` मात्र जाँच्छ।", jp: "<b>`??` がすべてのfalsyな値を扱うと思う</b> — `false ?? true` は `false`、`0 ?? 10` は `0`、`\"\" ?? \"Hello\"` は `\"\"`。`??` が見るのは `null` と `undefined` だけ。" },
        { en: "<b>Forgetting optional chaining</b> — with `const user = null`, `user.name` throws an error while `user?.name` returns `undefined`.", np: "<b>Optional chaining बिर्सनु</b> — `const user = null` सँग, `user.name` ले error दिन्छ जब कि `user?.name` ले `undefined` फर्काउँछ।", jp: "<b>オプショナルチェーンを忘れる</b> — `const user = null` のとき `user.name` はエラーになるが、`user?.name` は `undefined` を返す。" },
      ],
      quiz: [
        {
          question: { en: "What does `0 || 10` return?", np: "`0 || 10` ले के फर्काउँछ?", jp: "`0 || 10` は何を返すか?" },
          options: [
            { en: "`0`", np: "`0`", jp: "`0`" },
            { en: "`10`", np: "`10`", jp: "`10`" },
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
          ],
          correctIndex: 1,
          explanation: { en: "`0` is falsy, so `||` falls back to the right side.", np: "`0` falsy हो, त्यसैले `||` दायाँ पट्टि fallback गर्छ।", jp: "`0` はfalsyなので `||` は右側にフォールバックする。" },
        },
        {
          question: { en: "What does `0 ?? 10` return?", np: "`0 ?? 10` ले के फर्काउँछ?", jp: "`0 ?? 10` は何を返すか?" },
          options: [
            { en: "`0`", np: "`0`", jp: "`0`" },
            { en: "`10`", np: "`10`", jp: "`10`" },
            { en: "`null`", np: "`null`", jp: "`null`" },
          ],
          correctIndex: 0,
          explanation: { en: "`0` is neither `null` nor `undefined`, so `??` keeps it.", np: "`0` न `null` न `undefined` हो, त्यसैले `??` ले यसलाई राख्छ।", jp: "`0` は `null` でも `undefined` でもないので `??` はそのまま残す。" },
        },
        {
          question: { en: "What does `user?.name` do?", np: "`user?.name` ले के गर्छ?", jp: "`user?.name` は何をするか?" },
          options: [
            { en: "Always throws an error", np: "सधैं error दिन्छ", jp: "常にエラーを投げる" },
            { en: "Safely accesses `name`", np: "`name` लाई सुरक्षित रूपमा पहुँच गर्छ", jp: "`name` に安全にアクセスする" },
            { en: "Deletes `name`", np: "`name` मेटाउँछ", jp: "`name` を削除する" },
          ],
          correctIndex: 1,
          explanation: { en: "If `user` is `null` or `undefined`, the chain stops and returns `undefined` instead of throwing.", np: "`user` `null` वा `undefined` भए, chain रोकिन्छ र error दिनुको साटो `undefined` फर्काउँछ।", jp: "`user` が `null` か `undefined` なら、チェーンは止まりエラーを投げずに `undefined` を返す。" },
        },
        {
          question: { en: "Which operator should you use when `0` is a valid value and you only want a fallback for missing values?", np: "`0` मान्य value हुँदा र हराएका value का लागि मात्र fallback चाहिँदा कुन operator प्रयोग गर्नुपर्छ?", jp: "`0` が有効な値で、欠けている値だけにフォールバックしたいときはどの演算子を使うべきか?" },
          options: [
            { en: "`||`", np: "`||`", jp: "`||`" },
            { en: "`??`", np: "`??`", jp: "`??`" },
            { en: "`&&`", np: "`&&`", jp: "`&&`" },
          ],
          correctIndex: 1,
          explanation: { en: "`??` only falls back for `null` and `undefined`, so a real `0` survives.", np: "`??` ले `null` र `undefined` का लागि मात्र fallback गर्छ, त्यसैले वास्तविक `0` बाँच्छ।", jp: "`??` は `null` と `undefined` のときだけフォールバックするので、本物の `0` は残る。" },
        },
      ],
    },
    {
      id: "conditionals",
      title: { en: "Conditionals", np: "Conditionals", jp: "条件分岐" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Conditionals</b> (statements that let your program make decisions) allow code to take different paths depending on a value.\n\nThe main ways to write conditions are:\n\n```javascript\nif / else\nswitch\nguard clauses\n```\n\n---\n\n### 1. `if / else`\n\n<b>`if`</b> (runs code when a condition is true) is the most common way to make a decision.\n\n```javascript\nconst age = 20;\n\nif (age >= 18) {\n  console.log(\"Adult\");\n} else {\n  console.log(\"Minor\");\n}\n```\n\nYou can also use `else if` (checks another condition when the previous one was false):\n\n```javascript\nconst score = 75;\n\nif (score >= 90) {\n  console.log(\"A\");\n} else if (score >= 70) {\n  console.log(\"B\");\n} else {\n  console.log(\"C\");\n}\n```\n\nUse `if / else` when you have a few different conditions.\n\n---\n\n### 2. `switch`\n\n<b>`switch`</b> (checks one value against several exact values) is useful when you have many fixed choices.\n\n```javascript\nconst day = \"Monday\";\n\nswitch (day) {\n  case \"Monday\":\n    console.log(\"Start of the week\");\n    break;\n\n  case \"Friday\":\n    console.log(\"Almost weekend\");\n    break;\n\n  default:\n    console.log(\"Normal day\");\n}\n```\n\n<b>`break`</b> (stops the `switch` from continuing to the next case) is usually needed after each case.\n\n<b>`default`</b> (runs when no case matches) handles everything else.\n\n---\n\n### 3. Guard Clauses\n\nA <b>guard clause</b> (returning early when a condition is not valid) helps keep code simple and avoids deep nesting.\n\nWithout a guard clause:\n\n```javascript\nfunction processUser(user) {\n  if (user) {\n    if (user.isActive) {\n      if (user.isAdmin) {\n        console.log(\"Process user\");\n      }\n    }\n  }\n}\n```\n\nThis becomes deeply nested and harder to read.\n\nWith a guard clause:\n\n```javascript\nfunction processUser(user) {\n  if (!user) return;\n  if (!user.isActive) return;\n  if (!user.isAdmin) return;\n\n  console.log(\"Process user\");\n}\n```\n\nThe invalid cases are handled immediately.\n\nThink of a guard clause like a <b>bouncer</b>:\n\n```text\nUser arrives\n     ↓\nValid user?\n   No → Leave\n   Yes\n     ↓\nActive?\n   No → Leave\n   Yes\n     ↓\nAdmin?\n   No → Leave\n   Yes\n     ↓\nProcess user\n```",
        np: "<b>Conditional</b> (तपाईंको program लाई निर्णय गर्न दिने statement) ले value अनुसार code लाई फरक बाटो लिन दिन्छ।\n\nCondition लेख्ने मुख्य तरिका:\n\n```javascript\nif / else\nswitch\nguard clauses\n```\n\n---\n\n### 1. `if / else`\n\n<b>`if`</b> (condition सही हुँदा code चलाउने) निर्णय गर्ने सबैभन्दा सामान्य तरिका हो।\n\n```javascript\nconst age = 20;\n\nif (age >= 18) {\n  console.log(\"Adult\");\n} else {\n  console.log(\"Minor\");\n}\n```\n\nतपाईं `else if` (अघिल्लो condition गलत हुँदा अर्को condition जाँच्ने) पनि प्रयोग गर्न सक्नुहुन्छ:\n\n```javascript\nconst score = 75;\n\nif (score >= 90) {\n  console.log(\"A\");\n} else if (score >= 70) {\n  console.log(\"B\");\n} else {\n  console.log(\"C\");\n}\n```\n\nकेही फरक condition हुँदा `if / else` प्रयोग गर्नुहोस्।\n\n---\n\n### 2. `switch`\n\n<b>`switch`</b> (एउटा value लाई धेरै ठ्याक्कै मिल्ने value सँग जाँच्ने) धेरै निश्चित विकल्प हुँदा उपयोगी छ।\n\n```javascript\nconst day = \"Monday\";\n\nswitch (day) {\n  case \"Monday\":\n    console.log(\"Start of the week\");\n    break;\n\n  case \"Friday\":\n    console.log(\"Almost weekend\");\n    break;\n\n  default:\n    console.log(\"Normal day\");\n}\n```\n\n<b>`break`</b> (`switch` लाई अर्को case मा जान रोक्ने) सामान्यतया हरेक case पछि चाहिन्छ।\n\n<b>`default`</b> (कुनै case मिल्दा नमिलेमा चल्ने) बाँकी सबै सम्हाल्छ।\n\n---\n\n### 3. Guard Clauses\n\n<b>Guard clause</b> (condition मान्य नभएमा चाँडै return गर्नु) ले code सरल राख्न मद्दत गर्छ र गहिरो nesting बचाउँछ।\n\nGuard clause बिना:\n\n```javascript\nfunction processUser(user) {\n  if (user) {\n    if (user.isActive) {\n      if (user.isAdmin) {\n        console.log(\"Process user\");\n      }\n    }\n  }\n}\n```\n\nयो गहिरो रूपमा nested र पढ्न कठिन हुन्छ।\n\nGuard clause सँग:\n\n```javascript\nfunction processUser(user) {\n  if (!user) return;\n  if (!user.isActive) return;\n  if (!user.isAdmin) return;\n\n  console.log(\"Process user\");\n}\n```\n\nअमान्य case तुरुन्तै सम्हालिन्छन्।\n\nGuard clause लाई <b>bouncer</b> जस्तै सोच्नुहोस्:\n\n```text\nUser arrives\n     ↓\nValid user?\n   No → Leave\n   Yes\n     ↓\nActive?\n   No → Leave\n   Yes\n     ↓\nAdmin?\n   No → Leave\n   Yes\n     ↓\nProcess user\n```",
        jp: "<b>条件分岐（Conditionals）</b>（プログラムに判断をさせる文）は、値に応じてコードが別の道を通れるようにします。\n\n条件の主な書き方:\n\n```javascript\nif / else\nswitch\nguard clauses\n```\n\n---\n\n### 1. `if / else`\n\n<b>`if`</b>（条件が真のときコードを実行する）は、最も一般的な判断の方法です。\n\n```javascript\nconst age = 20;\n\nif (age >= 18) {\n  console.log(\"Adult\");\n} else {\n  console.log(\"Minor\");\n}\n```\n\n`else if`（前の条件が偽のとき別の条件を調べる）も使えます:\n\n```javascript\nconst score = 75;\n\nif (score >= 90) {\n  console.log(\"A\");\n} else if (score >= 70) {\n  console.log(\"B\");\n} else {\n  console.log(\"C\");\n}\n```\n\n条件がいくつかあるときは `if / else` を使いましょう。\n\n---\n\n### 2. `switch`\n\n<b>`switch`</b>（1つの値を複数の厳密な値と照合する）は、決まった選択肢が多いときに便利です。\n\n```javascript\nconst day = \"Monday\";\n\nswitch (day) {\n  case \"Monday\":\n    console.log(\"Start of the week\");\n    break;\n\n  case \"Friday\":\n    console.log(\"Almost weekend\");\n    break;\n\n  default:\n    console.log(\"Normal day\");\n}\n```\n\n<b>`break`</b>（`switch` が次のcaseへ進むのを止める）は通常、各caseの後に必要です。\n\n<b>`default`</b>（どのcaseにも一致しないときに実行される）が残りすべてを受け持ちます。\n\n---\n\n### 3. ガード節\n\n<b>ガード節（guard clause）</b>（条件が妥当でないとき早く返す）は、コードを単純に保ち、深いネストを避けます。\n\nガード節なし:\n\n```javascript\nfunction processUser(user) {\n  if (user) {\n    if (user.isActive) {\n      if (user.isAdmin) {\n        console.log(\"Process user\");\n      }\n    }\n  }\n}\n```\n\nこれは深くネストして読みにくくなります。\n\nガード節あり:\n\n```javascript\nfunction processUser(user) {\n  if (!user) return;\n  if (!user.isActive) return;\n  if (!user.isAdmin) return;\n\n  console.log(\"Process user\");\n}\n```\n\n妥当でないケースをすぐに処理します。\n\nガード節は<b>入口の係員</b>のようなものだと考えてください:\n\n```text\nUser arrives\n     ↓\nValid user?\n   No → Leave\n   Yes\n     ↓\nActive?\n   No → Leave\n   Yes\n     ↓\nAdmin?\n   No → Leave\n   Yes\n     ↓\nProcess user\n```",
      },
      diagram: `                  Conditionals
                       |
          +------------+------------+
          |            |            |
        if/else      switch      Guard Clause
          |            |            |
    Conditions     Exact values   Exit early
          |            |            |
       if true      case match    return
       if false    default        continue`,
      codeExample: {
        title: { en: "Guard clauses keeping a function flat", np: "Guard clause ले function सम्म राख्नु", jp: "ガード節で関数をフラットに保つ" },
        code: `function checkAccess(user) {
  if (!user) return "No user";
  if (!user.isActive) return "Account inactive";

  if (user.isAdmin) {
    return "Admin access";
  }

  return "User access";
}

console.log(
  checkAccess({
    isActive: true,
    isAdmin: false
  })
);

// "User access"`,
      },
      keyTakeaways: [
        { en: "<b>Conditionals</b> → let your program make decisions.", np: "<b>Conditional</b> → तपाईंको program लाई निर्णय गर्न दिन्छन्।", jp: "<b>条件分岐</b> → プログラムに判断をさせる。" },
        { en: "<b>`if / else`</b> → best for normal conditions.", np: "<b>`if / else`</b> → सामान्य condition का लागि उत्तम।", jp: "<b>`if / else`</b> → 通常の条件に最適。" },
        { en: "<b>`switch`</b> → useful for many exact-value choices.", np: "<b>`switch`</b> → धेरै ठ्याक्कै मिल्ने value का विकल्पका लागि उपयोगी।", jp: "<b>`switch`</b> → 厳密な値の選択肢が多いときに便利。" },
        { en: "<b>Guard clause</b> → handles invalid cases early with `return`.", np: "<b>Guard clause</b> → अमान्य case लाई `return` ले चाँडै सम्हाल्छ।", jp: "<b>ガード節</b> → 妥当でないケースを `return` で早く処理する。" },
        { en: "Guard clauses reduce deeply nested code.", np: "Guard clause ले गहिरो nested code घटाउँछ।", jp: "ガード節は深くネストしたコードを減らす。" },
        { en: "Use `break` in `switch` to stop after a matching case.", np: "मिल्ने case पछि रोक्न `switch` मा `break` प्रयोग गर्नुहोस्।", jp: "一致したcaseの後で止めるために `switch` では `break` を使う。" },
        { en: "Use `default` when no `switch` case matches.", np: "कुनै `switch` case मिल्दा नमिलेमा `default` प्रयोग गर्नुहोस्।", jp: "`switch` のどのcaseにも一致しないときは `default` を使う。" },
      ],
      commonMistakes: [
        { en: "<b>Forgetting `break` in `switch`</b> — without it, JavaScript falls through and keeps running the next case as well. Add `break;` at the end of each case.", np: "<b>`switch` मा `break` बिर्सनु</b> — यसबिना, JavaScript तल झर्छ र अर्को case पनि चलाइरहन्छ। हरेक case को अन्तमा `break;` थप्नुहोस्।", jp: "<b>`switch` で `break` を忘れる</b> — なければJavaScriptは次のcaseへ流れ落ちて実行を続ける。各caseの最後に `break;` を付ける。" },
        { en: "<b>Creating deeply nested conditions</b> — three levels of `if (user) { if (user.isActive) { if (user.isAdmin) { ... } } }` is better written as three guard clauses that `return` early.", np: "<b>गहिरो nested condition बनाउनु</b> — `if (user) { if (user.isActive) { if (user.isAdmin) { ... } } }` जस्ता तीन तह लाई चाँडै `return` गर्ने तीन guard clause ले लेख्नु राम्रो।", jp: "<b>深くネストした条件を作る</b> — `if (user) { if (user.isActive) { if (user.isAdmin) { ... } } }` の3階層は、早く `return` する3つのガード節に書き換える方がよい。" },
        { en: "<b>Forgetting `else if`</b> — when only one result should run, chain the conditions with `else if` instead of writing separate unrelated `if` statements.", np: "<b>`else if` बिर्सनु</b> — एउटै नतिजा मात्र चल्नुपर्ने बेला, छुट्टाछुट्टै असम्बन्धित `if` लेख्नुको साटो condition लाई `else if` ले chain गर्नुहोस्।", jp: "<b>`else if` を忘れる</b> — 実行される結果が1つだけであるべきときは、無関係な `if` を並べるのではなく `else if` でつなぐ。" },
      ],
      quiz: [
        {
          question: { en: "Which is best for checking several exact values?", np: "धेरै ठ्याक्कै मिल्ने value जाँच्न कुन उत्तम हो?", jp: "厳密な値を複数調べるのに最適なのはどれか?" },
          options: [
            { en: "`switch`", np: "`switch`", jp: "`switch`" },
            { en: "`for`", np: "`for`", jp: "`for`" },
            { en: "`while`", np: "`while`", jp: "`while`" },
          ],
          correctIndex: 0,
          explanation: { en: "`switch` compares one value against a list of fixed cases; `for` and `while` are loops, not decisions.", np: "`switch` ले एउटा value लाई निश्चित case को सूची सँग तुलना गर्छ; `for` र `while` loop हुन्, निर्णय होइनन्।", jp: "`switch` は1つの値を固定のcase一覧と照合する。`for` と `while` はループで、判断ではない。" },
        },
        {
          question: { en: "What is a guard clause?", np: "Guard clause के हो?", jp: "ガード節とは何か?" },
          options: [
            { en: "A loop", np: "एउटा loop", jp: "ループ" },
            { en: "An early exit when a condition is not valid", np: "Condition मान्य नभएमा चाँडै बाहिरिनु", jp: "条件が妥当でないときの早期リターン" },
            { en: "A type of variable", np: "Variable को एक प्रकार", jp: "変数の一種" },
          ],
          correctIndex: 1,
          explanation: { en: "It `return`s as soon as an input is invalid, so the main logic below stays flat.", np: "Input अमान्य भएको बित्तिकै यो `return` गर्छ, त्यसैले तलको मुख्य logic सम्म रहन्छ।", jp: "入力が妥当でないとすぐ `return` するので、下の主要なロジックがフラットに保たれる。" },
        },
        {
          question: { en: "What does `break` do in a `switch`?", np: "`switch` मा `break` ले के गर्छ?", jp: "`switch` の中で `break` は何をするか?" },
          options: [
            { en: "Starts the next case", np: "अर्को case सुरु गर्छ", jp: "次のcaseを始める" },
            { en: "Stops the switch", np: "Switch रोक्छ", jp: "switchを止める" },
            { en: "Repeats the case", np: "Case दोहोर्याउँछ", jp: "caseを繰り返す" },
          ],
          correctIndex: 1,
          explanation: { en: "Without `break`, execution falls through into the following cases.", np: "`break` बिना, execution तलका case मा झर्छ।", jp: "`break` がないと、実行は後続のcaseへ流れ落ちる。" },
        },
        {
          question: { en: "Why use guard clauses?", np: "Guard clause किन प्रयोग गर्ने?", jp: "なぜガード節を使うのか?" },
          options: [
            { en: "To make code more deeply nested", np: "Code अझ गहिरो nested बनाउन", jp: "コードをもっと深くネストさせるため" },
            { en: "To avoid checking conditions", np: "Condition जाँच्न बच्न", jp: "条件を調べずに済ませるため" },
            { en: "To keep code flatter and easier to read", np: "Code सम्म र पढ्न सजिलो राख्न", jp: "コードをフラットで読みやすく保つため" },
          ],
          correctIndex: 2,
          explanation: { en: "The invalid cases are dealt with up front, leaving the real logic at one indentation level.", np: "अमान्य case पहिले सम्हालिन्छन्, र वास्तविक logic एउटै indentation तहमा रहन्छ।", jp: "妥当でないケースを先に片付けることで、本来のロジックが1段のインデントに収まる。" },
        },
      ],
    },
    {
      id: "loops",
      title: { en: "Loops", np: "Loops", jp: "ループ" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Loops</b> (a way to repeat code) let you run the same block of code multiple times.\n\nJavaScript has several types of loops:\n\n```javascript\nfor\nwhile\nfor...of\nfor...in\n```\n\n---\n\n### 1. `for`\n\n<b>`for`</b> (a loop commonly used with a counter or index) is useful when you know how many times you want to repeat something.\n\n```javascript\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n```\n\nOutput:\n\n```text\n0\n1\n2\n3\n4\n```\n\nUse `for` when you need the index or a counter.\n\n---\n\n### 2. `while`\n\n<b>`while`</b> (a loop that continues while a condition is true) is useful when you don't know exactly how many times the loop will run.\n\n```javascript\nlet count = 0;\n\nwhile (count < 5) {\n  console.log(count);\n  count++;\n}\n```\n\nThe loop stops when:\n\n```text\ncount < 5\n```\n\nbecomes false.\n\n---\n\n### 3. `for...of`\n\n<b>`for...of`</b> (a loop that gives you each value directly) is useful for arrays, strings, Sets, and Maps.\n\n```javascript\nconst fruits = [\"apple\", \"banana\", \"orange\"];\n\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n```\n\nOutput:\n\n```text\napple\nbanana\norange\n```\n\nYou don't need to manage the index yourself.\n\nCompare:\n\n```javascript\nfor (let i = 0; i < fruits.length; i++) {\n  console.log(fruits[i]);\n}\n```\n\nwith:\n\n```javascript\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n```\n\n`for...of` is usually cleaner when you only need the values.\n\n---\n\n### 4. `for...in`\n\n<b>`for...in`</b> (a loop that gives you object keys) is mainly used for objects.\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nfor (const key in user) {\n  console.log(key);\n}\n```\n\nOutput:\n\n```text\nname\nage\n```\n\nYou can use the key to get the value:\n\n```javascript\nfor (const key in user) {\n  console.log(user[key]);\n}\n```\n\nOutput:\n\n```text\nRajan\n30\n```\n\nAvoid using `for...in` for arrays because it is designed for object keys and can include inherited properties.",
        np: "<b>Loop</b> (code दोहोर्याउने तरिका) ले तपाईंलाई उही code block धेरै पटक चलाउन दिन्छ।\n\nJavaScript मा केही प्रकारका loop छन्:\n\n```javascript\nfor\nwhile\nfor...of\nfor...in\n```\n\n---\n\n### 1. `for`\n\n<b>`for`</b> (counter वा index सँग सामान्यतया प्रयोग हुने loop) कति पटक दोहोर्याउने थाहा हुँदा उपयोगी छ।\n\n```javascript\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n```\n\nOutput:\n\n```text\n0\n1\n2\n3\n4\n```\n\nIndex वा counter चाहिँदा `for` प्रयोग गर्नुहोस्।\n\n---\n\n### 2. `while`\n\n<b>`while`</b> (condition सही रहेसम्म चलिरहने loop) loop कति पटक चल्छ ठ्याक्कै थाहा नहुँदा उपयोगी छ।\n\n```javascript\nlet count = 0;\n\nwhile (count < 5) {\n  console.log(count);\n  count++;\n}\n```\n\nLoop रोकिन्छ जब:\n\n```text\ncount < 5\n```\n\nगलत बन्छ।\n\n---\n\n### 3. `for...of`\n\n<b>`for...of`</b> (हरेक value सिधै दिने loop) array, string, Set, र Map का लागि उपयोगी छ।\n\n```javascript\nconst fruits = [\"apple\", \"banana\", \"orange\"];\n\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n```\n\nOutput:\n\n```text\napple\nbanana\norange\n```\n\nतपाईंले आफैं index व्यवस्थापन गर्नु पर्दैन।\n\nतुलना गर्नुहोस्:\n\n```javascript\nfor (let i = 0; i < fruits.length; i++) {\n  console.log(fruits[i]);\n}\n```\n\nयो सँग:\n\n```javascript\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n```\n\nvalue मात्र चाहिँदा `for...of` सामान्यतया सफा हुन्छ।\n\n---\n\n### 4. `for...in`\n\n<b>`for...in`</b> (object का key दिने loop) मुख्यतया object का लागि प्रयोग हुन्छ।\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nfor (const key in user) {\n  console.log(key);\n}\n```\n\nOutput:\n\n```text\nname\nage\n```\n\nValue लिन key प्रयोग गर्न सक्नुहुन्छ:\n\n```javascript\nfor (const key in user) {\n  console.log(user[key]);\n}\n```\n\nOutput:\n\n```text\nRajan\n30\n```\n\nArray का लागि `for...in` प्रयोग नगर्नुहोस्, किनकि यो object का key का लागि बनाइएको हो र inherited property पनि समेट्न सक्छ।",
        jp: "<b>ループ</b>（コードを繰り返す方法）を使うと、同じコードのかたまりを何度も実行できます。\n\nJavaScriptにはいくつかの種類のループがあります:\n\n```javascript\nfor\nwhile\nfor...of\nfor...in\n```\n\n---\n\n### 1. `for`\n\n<b>`for`</b>（カウンタや添字と一緒によく使うループ）は、繰り返す回数が分かっているときに便利です。\n\n```javascript\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n```\n\n出力:\n\n```text\n0\n1\n2\n3\n4\n```\n\n添字やカウンタが必要なときは `for` を使いましょう。\n\n---\n\n### 2. `while`\n\n<b>`while`</b>（条件が真である間続くループ）は、何回繰り返すか正確には分からないときに便利です。\n\n```javascript\nlet count = 0;\n\nwhile (count < 5) {\n  console.log(count);\n  count++;\n}\n```\n\nループが止まるのは:\n\n```text\ncount < 5\n```\n\nが偽になったときです。\n\n---\n\n### 3. `for...of`\n\n<b>`for...of`</b>（各値を直接渡してくれるループ）は、配列・文字列・Set・Mapに便利です。\n\n```javascript\nconst fruits = [\"apple\", \"banana\", \"orange\"];\n\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n```\n\n出力:\n\n```text\napple\nbanana\norange\n```\n\n添字を自分で管理する必要はありません。\n\n比べてみてください:\n\n```javascript\nfor (let i = 0; i < fruits.length; i++) {\n  console.log(fruits[i]);\n}\n```\n\nと:\n\n```javascript\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n```\n\n値だけが必要なときは、たいてい `for...of` の方がすっきりします。\n\n---\n\n### 4. `for...in`\n\n<b>`for...in`</b>（オブジェクトのキーを渡すループ）は主にオブジェクトに使います。\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nfor (const key in user) {\n  console.log(key);\n}\n```\n\n出力:\n\n```text\nname\nage\n```\n\nキーを使って値を取り出せます:\n\n```javascript\nfor (const key in user) {\n  console.log(user[key]);\n}\n```\n\n出力:\n\n```text\nRajan\n30\n```\n\n`for...in` は配列には使わないでください。オブジェクトのキーのために設計されており、継承したプロパティも含みうるからです。",
      },
      diagram: `                       Loops
                         |
        +----------------+----------------+
        |                |                |
       for             while          for...of
        |                |                |
 Counter / index     Condition          Values
        |                |                |
        +----------------+----------------+
                         |
                     for...in
                         |
                      Object keys`,
      codeExample: {
        title: { en: "The four loop forms side by side", np: "चारै loop रूप सँगसँगै", jp: "4つのループを並べて比較" },
        code: `const fruits = ["apple", "banana", "orange"];

// for
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}

// while
let i = 0;

while (i < fruits.length) {
  console.log(fruits[i]);
  i++;
}

// for...of
for (const fruit of fruits) {
  console.log(fruit);
}

// for...in
const user = {
  name: "Rajan",
  age: 30
};

for (const key in user) {
  console.log(key, user[key]);
}`,
      },
      keyTakeaways: [
        { en: "<b>Loop</b> → repeats a block of code.", np: "<b>Loop</b> → code को block दोहोर्याउँछ।", jp: "<b>ループ</b> → コードのかたまりを繰り返す。" },
        { en: "<b>`for`</b> → use when you need a counter or index.", np: "<b>`for`</b> → counter वा index चाहिँदा प्रयोग गर्नुहोस्।", jp: "<b>`for`</b> → カウンタや添字が必要なときに使う。" },
        { en: "<b>`while`</b> → use when repetition depends on a condition.", np: "<b>`while`</b> → दोहोरिने काम condition मा निर्भर हुँदा प्रयोग गर्नुहोस्।", jp: "<b>`while`</b> → 繰り返しが条件に依存するときに使う。" },
        { en: "<b>`for...of`</b> → use to get values from arrays, strings, Sets, and Maps.", np: "<b>`for...of`</b> → array, string, Set, र Map बाट value लिन प्रयोग गर्नुहोस्।", jp: "<b>`for...of`</b> → 配列・文字列・Set・Mapから値を取り出すのに使う。" },
        { en: "<b>`for...in`</b> → use to get keys from objects.", np: "<b>`for...in`</b> → object बाट key लिन प्रयोग गर्नुहोस्।", jp: "<b>`for...in`</b> → オブジェクトからキーを取り出すのに使う。" },
        { en: "Avoid `for...in` for arrays.", np: "Array का लागि `for...in` प्रयोग नगर्नुहोस्।", jp: "配列に `for...in` は使わない。" },
        { en: "`for...of` gives you the value directly, so you don't need index management.", np: "`for...of` ले value सिधै दिन्छ, त्यसैले index व्यवस्थापन चाहिँदैन।", jp: "`for...of` は値を直接くれるので、添字の管理が不要。" },
      ],
      commonMistakes: [
        { en: "<b>Creating an infinite `while` loop</b> — if `count` never changes inside `while (count < 5)`, the condition never becomes false. Remember `count++` in the body.", np: "<b>अनन्त `while` loop बनाउनु</b> — `while (count < 5)` भित्र `count` कहिल्यै बदलिँदैन भने, condition कहिल्यै गलत बन्दैन। Body मा `count++` सम्झनुहोस्।", jp: "<b>無限 `while` ループを作る</b> — `while (count < 5)` の中で `count` が変わらなければ条件は偽にならない。本体に `count++` を忘れないこと。" },
        { en: "<b>Using `for...in` for arrays</b> — it iterates keys (and can include inherited properties). Use `for...of` when you want the values.", np: "<b>Array का लागि `for...in` प्रयोग गर्नु</b> — यो key मा घुम्छ (र inherited property पनि समेट्न सक्छ)। Value चाहिँदा `for...of` प्रयोग गर्नुहोस्।", jp: "<b>配列に `for...in` を使う</b> — キーを反復し（継承したプロパティも含みうる）。値が欲しいなら `for...of` を使う。" },
        { en: "<b>Forgetting that `for...in` gives keys</b> — `for (const value in user)` logs `name`, not `\"Rajan\"`. Read the value with `user[key]`.", np: "<b>`for...in` ले key दिन्छ भनी बिर्सनु</b> — `for (const value in user)` ले `\"Rajan\"` होइन `name` देखाउँछ। Value `user[key]` ले पढ्नुहोस्।", jp: "<b>`for...in` がキーを渡すことを忘れる</b> — `for (const value in user)` は `\"Rajan\"` ではなく `name` を出す。値は `user[key]` で読む。" },
      ],
      quiz: [
        {
          question: { en: "Which loop is best when you need an index?", np: "Index चाहिँदा कुन loop उत्तम हो?", jp: "添字が必要なときに最適なループはどれか?" },
          options: [
            { en: "`for...of`", np: "`for...of`", jp: "`for...of`" },
            { en: "`for`", np: "`for`", jp: "`for`" },
            { en: "`for...in`", np: "`for...in`", jp: "`for...in`" },
          ],
          correctIndex: 1,
          explanation: { en: "A classic `for` loop owns the counter, so the index is available in the body.", np: "Classic `for` loop सँग counter हुन्छ, त्यसैले body मा index उपलब्ध हुन्छ।", jp: "従来の `for` ループはカウンタを持つので、本体で添字が使える。" },
        },
        {
          question: { en: "Which loop gives you array values directly?", np: "कुन loop ले array का value सिधै दिन्छ?", jp: "配列の値を直接くれるループはどれか?" },
          options: [
            { en: "`for...of`", np: "`for...of`", jp: "`for...of`" },
            { en: "`for...in`", np: "`for...in`", jp: "`for...in`" },
            { en: "`while`", np: "`while`", jp: "`while`" },
          ],
          correctIndex: 0,
          explanation: { en: "`for...of` hands you each value, so there is no `arr[i]` lookup to manage.", np: "`for...of` ले हरेक value दिन्छ, त्यसैले `arr[i]` को खोजी व्यवस्थापन गर्नु पर्दैन।", jp: "`for...of` は各値を渡してくれるので、`arr[i]` の参照を管理する必要がない。" },
        },
        {
          question: { en: "Which loop is mainly used for object keys?", np: "मुख्यतया object का key का लागि कुन loop प्रयोग हुन्छ?", jp: "主にオブジェクトのキーに使うループはどれか?" },
          options: [
            { en: "`for`", np: "`for`", jp: "`for`" },
            { en: "`for...of`", np: "`for...of`", jp: "`for...of`" },
            { en: "`for...in`", np: "`for...in`", jp: "`for...in`" },
          ],
          correctIndex: 2,
          explanation: { en: "`for...in` iterates the keys of an object, which is why it is the wrong tool for arrays.", np: "`for...in` object का key मा घुम्छ, त्यसैले यो array का लागि गलत उपकरण हो।", jp: "`for...in` はオブジェクトのキーを反復する。だから配列には不向き。" },
        },
        {
          question: { en: "When is `while` useful?", np: "`while` कहिले उपयोगी हुन्छ?", jp: "`while` はどんなときに便利か?" },
          options: [
            { en: "When repetition depends on a condition", np: "दोहोरिने काम condition मा निर्भर हुँदा", jp: "繰り返しが条件に依存するとき" },
            { en: "Only for arrays", np: "Array का लागि मात्र", jp: "配列のときだけ" },
            { en: "Only for objects", np: "Object का लागि मात्र", jp: "オブジェクトのときだけ" },
          ],
          correctIndex: 0,
          explanation: { en: "Use `while` when you don't know the number of iterations up front, only the condition that ends them.", np: "कति पटक घुम्ने अगावै थाहा नहुँदा, अन्त्य गर्ने condition मात्र थाहा हुँदा `while` प्रयोग गर्नुहोस्।", jp: "反復回数が事前に分からず、終了条件だけが分かっているときに `while` を使う。" },
        },
      ],
    },
    {
      id: "function-types",
      title: { en: "Function Types", np: "Function Types", jp: "関数の種類" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>function</b> (a reusable block of code) lets you write code once and use it many times.\n\nJavaScript has three common ways to create functions:\n\n```javascript\nFunction declaration\nFunction expression\nArrow function\n```\n\nThe main differences are <b>hoisting</b> (whether you can use the function before its definition) and <b>`this`</b> (the value that a regular function gets based on how it is called).\n\n---\n\n### 1. Function Declaration\n\n<b>Function declaration</b> (a function created with the `function` keyword) is fully hoisted.\n\n```javascript\ngreet();\n\nfunction greet() {\n  console.log(\"Hello\");\n}\n```\n\nThis works because the entire function is available before execution reaches its definition.\n\nA function declaration has its own <b>`this`</b> (a value determined by how the function is called).\n\nUse it for named, reusable functions.\n\n---\n\n### 2. Function Expression\n\n<b>Function expression</b> (a function stored inside a variable) is created as part of an assignment.\n\n```javascript\nconst greet = function () {\n  console.log(\"Hello\");\n};\n\ngreet();\n```\n\nIt is not available before the assignment:\n\n```javascript\ngreet(); // Error\n\nconst greet = function () {\n  console.log(\"Hello\");\n};\n```\n\nLike a function declaration, it has its own <b>`this`</b>.\n\nFunction expressions are useful when you want to:\n\n• Store a function in a variable\n• Pass a function to another function\n• Create a function conditionally\n\n---\n\n### 3. Arrow Function\n\n<b>Arrow function</b> (a shorter function syntax that uses `=>`) looks like this:\n\n```javascript\nconst greet = () => {\n  console.log(\"Hello\");\n};\n```\n\nArrow functions are not hoisted:\n\n```javascript\ngreet(); // Error\n\nconst greet = () => {\n  console.log(\"Hello\");\n};\n```\n\nThe important difference is `this`.\n\nAn arrow function does not create its own <b>`this`</b>. It uses `this` from the surrounding code.\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    const sayName = () => {\n      console.log(this.name);\n    };\n\n    sayName();\n  }\n};\n\nuser.greet(); // Rajan\n```\n\nArrow functions are commonly used for callbacks:\n\n```javascript\nconst numbers = [1, 2, 3];\n\nnumbers.map((number) => number * 2);\n```",
        np: "<b>Function</b> (पुनः प्रयोग गर्न मिल्ने code block) ले तपाईंलाई code एक पटक लेखी धेरै पटक प्रयोग गर्न दिन्छ।\n\nJavaScript मा function बनाउने तीन सामान्य तरिका छन्:\n\n```javascript\nFunction declaration\nFunction expression\nArrow function\n```\n\nमुख्य फरक हुन् <b>hoisting</b> (definition अघि function प्रयोग गर्न मिल्छ कि मिल्दैन) र <b>`this`</b> (सामान्य function कसरी call भयो त्यसका आधारमा पाउने value)।\n\n---\n\n### 1. Function Declaration\n\n<b>Function declaration</b> (`function` keyword ले बनाइएको function) पूर्ण रूपमा hoist हुन्छ।\n\n```javascript\ngreet();\n\nfunction greet() {\n  console.log(\"Hello\");\n}\n```\n\nयो काम गर्छ किनकि execution यसको definition मा पुग्नुअघि नै पूरै function उपलब्ध हुन्छ।\n\nFunction declaration को आफ्नै <b>`this`</b> (function कसरी call भयो त्यसले निर्धारण गर्ने value) हुन्छ।\n\nनाम भएका, पुनः प्रयोग गर्न मिल्ने function का लागि यो प्रयोग गर्नुहोस्।\n\n---\n\n### 2. Function Expression\n\n<b>Function expression</b> (variable भित्र राखिएको function) assignment को भाग रूपमा बनाइन्छ।\n\n```javascript\nconst greet = function () {\n  console.log(\"Hello\");\n};\n\ngreet();\n```\n\nAssignment अघि यो उपलब्ध हुँदैन:\n\n```javascript\ngreet(); // Error\n\nconst greet = function () {\n  console.log(\"Hello\");\n};\n```\n\nFunction declaration जस्तै, यसको आफ्नै <b>`this`</b> हुन्छ।\n\nFunction expression यस्ता बेला उपयोगी हुन्छन्:\n\n• Function लाई variable मा राख्न\n• Function लाई अर्को function मा पठाउन\n• Condition अनुसार function बनाउन\n\n---\n\n### 3. Arrow Function\n\n<b>Arrow function</b> (`=>` प्रयोग गर्ने छोटो function syntax) यस्तो देखिन्छ:\n\n```javascript\nconst greet = () => {\n  console.log(\"Hello\");\n};\n```\n\nArrow function hoist हुँदैनन्:\n\n```javascript\ngreet(); // Error\n\nconst greet = () => {\n  console.log(\"Hello\");\n};\n```\n\nमहत्वपूर्ण फरक `this` हो।\n\nArrow function आफ्नै <b>`this`</b> बनाउँदैन। यो वरिपरिको code बाट `this` लिन्छ।\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    const sayName = () => {\n      console.log(this.name);\n    };\n\n    sayName();\n  }\n};\n\nuser.greet(); // Rajan\n```\n\nArrow function सामान्यतया callback का लागि प्रयोग हुन्छन्:\n\n```javascript\nconst numbers = [1, 2, 3];\n\nnumbers.map((number) => number * 2);\n```",
        jp: "<b>関数</b>（再利用できるコードのかたまり）を使うと、一度書いたコードを何度も使えます。\n\nJavaScriptで関数を作る一般的な方法は3つあります:\n\n```javascript\nFunction declaration\nFunction expression\nArrow function\n```\n\n主な違いは<b>ホイスティング</b>（定義より前に関数を使えるか）と<b>`this`</b>（通常の関数が呼び出し方に応じて受け取る値）です。\n\n---\n\n### 1. 関数宣言\n\n<b>関数宣言</b>（`function` キーワードで作る関数）は完全にホイスティングされます。\n\n```javascript\ngreet();\n\nfunction greet() {\n  console.log(\"Hello\");\n}\n```\n\n実行が定義に達する前から関数全体が使えるので、これは動きます。\n\n関数宣言は自分の<b>`this`</b>（呼び出し方によって決まる値）を持ちます。\n\n名前付きで再利用する関数にはこれを使いましょう。\n\n---\n\n### 2. 関数式\n\n<b>関数式</b>（変数に入れた関数）は代入の一部として作られます。\n\n```javascript\nconst greet = function () {\n  console.log(\"Hello\");\n};\n\ngreet();\n```\n\n代入より前には使えません:\n\n```javascript\ngreet(); // Error\n\nconst greet = function () {\n  console.log(\"Hello\");\n};\n```\n\n関数宣言と同じく、自分の<b>`this`</b>を持ちます。\n\n関数式は次のようなときに役立ちます:\n\n• 関数を変数に入れる\n• 関数を別の関数に渡す\n• 条件に応じて関数を作る\n\n---\n\n### 3. アロー関数\n\n<b>アロー関数</b>（`=>` を使う短い関数構文）はこう書きます:\n\n```javascript\nconst greet = () => {\n  console.log(\"Hello\");\n};\n```\n\nアロー関数はホイスティングされません:\n\n```javascript\ngreet(); // Error\n\nconst greet = () => {\n  console.log(\"Hello\");\n};\n```\n\n重要な違いは `this` です。\n\nアロー関数は自分の<b>`this`</b>を作りません。周囲のコードの `this` を使います。\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  greet() {\n    const sayName = () => {\n      console.log(this.name);\n    };\n\n    sayName();\n  }\n};\n\nuser.greet(); // Rajan\n```\n\nアロー関数はコールバックによく使われます:\n\n```javascript\nconst numbers = [1, 2, 3];\n\nnumbers.map((number) => number * 2);\n```",
      },
      diagram: `                    Function Types
                         |
          +--------------+--------------+
          |              |              |
     Declaration     Expression       Arrow
          |              |              |
     function x()    const x =      const x =
                    function()      () =>
          |              |              |
       Hoisted?        No             No
          |              |              |
      Own this         Own this     Borrows this`,
      codeExample: {
        title: { en: "Declaration, expression and arrow side by side", np: "Declaration, expression र arrow सँगसँगै", jp: "宣言・関数式・アローを並べて比較" },
        code: `// Function declaration
function add(a, b) {
  return a + b;
}

// Function expression
const subtract = function (a, b) {
  return a - b;
};

// Arrow function
const multiply = (a, b) => {
  return a * b;
};

console.log(add(5, 2));       // 7
console.log(subtract(5, 2));  // 3
console.log(multiply(5, 2));   // 10

// A one-line arrow function can be shorter
const double = (a) => a * 2;`,
      },
      keyTakeaways: [
        { en: "<b>Function declaration</b> → fully hoisted and has its own `this`.", np: "<b>Function declaration</b> → पूर्ण रूपमा hoist हुन्छ र आफ्नै `this` हुन्छ।", jp: "<b>関数宣言</b> → 完全にホイスティングされ、自分の `this` を持つ。" },
        { en: "<b>Function expression</b> → not hoisted and has its own `this`.", np: "<b>Function expression</b> → hoist हुँदैन र आफ्नै `this` हुन्छ।", jp: "<b>関数式</b> → ホイスティングされず、自分の `this` を持つ。" },
        { en: "<b>Arrow function</b> → not hoisted and borrows `this` from the surrounding code.", np: "<b>Arrow function</b> → hoist हुँदैन र वरिपरिको code बाट `this` लिन्छ।", jp: "<b>アロー関数</b> → ホイスティングされず、周囲のコードから `this` を借りる。" },
        { en: "Function declarations are good for named, reusable functions.", np: "Function declaration नाम भएका, पुनः प्रयोग गर्न मिल्ने function का लागि राम्रो छन्।", jp: "関数宣言は名前付きで再利用する関数に向く。" },
        { en: "Function expressions are useful when storing or passing functions.", np: "Function expression function राख्दा वा पठाउँदा उपयोगी हुन्छन्।", jp: "関数式は関数を保存したり渡したりするときに役立つ。" },
        { en: "Arrow functions are commonly used for callbacks.", np: "Arrow function सामान्यतया callback का लागि प्रयोग हुन्छन्।", jp: "アロー関数はコールバックによく使われる。" },
        { en: "Arrow functions do not have their own `this` or `arguments`.", np: "Arrow function का आफ्नै `this` वा `arguments` हुँदैनन्।", jp: "アロー関数は自分の `this` も `arguments` も持たない。" },
        { en: "Arrow functions cannot be used with `new` as constructors.", np: "Arrow function लाई `new` सँग constructor रूपमा प्रयोग गर्न मिल्दैन।", jp: "アロー関数は `new` を使ってコンストラクタとして使えない。" },
      ],
      commonMistakes: [
        { en: "<b>Calling a function expression too early</b> — `greet()` above `const greet = function () {}` throws an error, because the function is created only when execution reaches the assignment.", np: "<b>Function expression धेरै चाँडै call गर्नु</b> — `const greet = function () {}` माथि `greet()` ले error दिन्छ, किनकि function execution assignment मा पुगेपछि मात्र बन्छ।", jp: "<b>関数式を早すぎるタイミングで呼ぶ</b> — `const greet = function () {}` より前の `greet()` はエラーになる。関数は実行が代入に達したときに初めて作られる。" },
        { en: "<b>Expecting arrow functions to have their own `this`</b> — an object method written as `greet: () => { console.log(this.name); }` usually logs `undefined`. For object methods use a regular function: `greet() { console.log(this.name); }`.", np: "<b>Arrow function का आफ्नै `this` हुन्छ भन्ने आशा गर्नु</b> — `greet: () => { console.log(this.name); }` लेखिएको object method सामान्यतया `undefined` देखाउँछ। Object method का लागि सामान्य function प्रयोग गर्नुहोस्: `greet() { console.log(this.name); }`।", jp: "<b>アロー関数が自分の `this` を持つと思う</b> — `greet: () => { console.log(this.name); }` と書いたオブジェクトのメソッドは通常 `undefined` を出す。オブジェクトのメソッドには通常の関数 `greet() { console.log(this.name); }` を使う。" },
        { en: "<b>Assuming arrow functions are just shorter regular functions</b> — they look similar, but their behaviour with `this`, `arguments` and `new` is different.", np: "<b>Arrow function केवल छोटो सामान्य function हो भन्ने ठान्नु</b> — यी मिल्दो देखिन्छन्, तर `this`, `arguments` र `new` सँगको व्यवहार फरक छ।", jp: "<b>アロー関数は通常の関数の短縮形にすぎないと思う</b> — 見た目は似ているが、`this`・`arguments`・`new` に対する振る舞いが違う。" },
      ],
      quiz: [
        {
          question: { en: "Which function type is fully hoisted?", np: "कुन function type पूर्ण रूपमा hoist हुन्छ?", jp: "完全にホイスティングされる関数の種類はどれか?" },
          options: [
            { en: "Arrow function", np: "Arrow function", jp: "アロー関数" },
            { en: "Function expression", np: "Function expression", jp: "関数式" },
            { en: "Function declaration", np: "Function declaration", jp: "関数宣言" },
          ],
          correctIndex: 2,
          explanation: { en: "A function declaration is hoisted with its whole body, so it can be called before its definition.", np: "Function declaration आफ्नो पूरै body सँग hoist हुन्छ, त्यसैले यसलाई definition अघि call गर्न सकिन्छ।", jp: "関数宣言は本体ごとホイスティングされるので、定義より前に呼び出せる。" },
        },
        {
          question: { en: "Which function borrows `this` from its surrounding code?", np: "कुन function ले वरिपरिको code बाट `this` लिन्छ?", jp: "周囲のコードから `this` を借りる関数はどれか?" },
          options: [
            { en: "Arrow function", np: "Arrow function", jp: "アロー関数" },
            { en: "Function declaration", np: "Function declaration", jp: "関数宣言" },
            { en: "Function expression", np: "Function expression", jp: "関数式" },
          ],
          correctIndex: 0,
          explanation: { en: "An arrow function never creates its own `this`, which is what makes it handy inside a method but wrong as a method.", np: "Arrow function आफ्नै `this` कहिल्यै बनाउँदैन, यसैले यो method भित्र उपयोगी छ तर method रूपमा गलत।", jp: "アロー関数は自分の `this` を作らない。だからメソッドの内側では便利だが、メソッド自体には不向き。" },
        },
        {
          question: { en: "Which is commonly used for callbacks?", np: "Callback का लागि सामान्यतया कुन प्रयोग हुन्छ?", jp: "コールバックによく使われるのはどれか?" },
          options: [
            { en: "Arrow function", np: "Arrow function", jp: "アロー関数" },
            { en: "`var` function", np: "`var` function", jp: "`var` の関数" },
            { en: "Constructor function only", np: "Constructor function मात्र", jp: "コンストラクタ関数だけ" },
          ],
          correctIndex: 0,
          explanation: { en: "Short arrow syntax reads well inline, as in `numbers.map((n) => n * 2)`.", np: "छोटो arrow syntax inline राम्रो पढिन्छ, जस्तै `numbers.map((n) => n * 2)`।", jp: "短いアロー構文はインラインで読みやすい。例: `numbers.map((n) => n * 2)`。" },
        },
        {
          question: { en: "Which function type can be used with `new`?", np: "कुन function type `new` सँग प्रयोग गर्न मिल्छ?", jp: "`new` と一緒に使えるのはどの関数か?" },
          options: [
            { en: "Arrow function", np: "Arrow function", jp: "アロー関数" },
            { en: "Regular function", np: "सामान्य function", jp: "通常の関数" },
            { en: "Both", np: "दुबै", jp: "両方" },
          ],
          correctIndex: 1,
          explanation: { en: "Arrow functions have no `[[Construct]]` behaviour, so `new` on one throws a TypeError.", np: "Arrow function मा `[[Construct]]` व्यवहार हुँदैन, त्यसैले यसमा `new` गर्दा TypeError आउँछ।", jp: "アロー関数には `[[Construct]]` の振る舞いがないため、`new` を使うとTypeErrorになる。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "If `count` is `0`, what does `count ?? 10` evaluate to?", np: "`count` 0 भएमा `count ?? 10` को नतिजा के हो?", jp: "`count`が0のとき`count ?? 10`は何になる？" },
      options: [{ en: "10", np: "10", jp: "10" }, { en: "0", np: "0", jp: "0" }],
      correctIndex: 1,
      explanation: { en: "?? only falls back on null/undefined, not on 0.", np: "?? ले null/undefined मा मात्र fallback गर्छ, 0 मा होइन।", jp: "??はnull/undefinedのみでフォールバックし、0では動作しない。" },
    },
    {
      question: { en: "What does `user?.name` return when `user` is `null`?", np: "`user` null भएमा `user?.name` ले के फर्काउँछ?", jp: "`user`がnullのとき`user?.name`は何を返す？" },
      options: [{ en: "Throws an error", np: "Error आउँछ", jp: "エラーが発生する" }, { en: "undefined", np: "undefined", jp: "undefined" }],
      correctIndex: 1,
      explanation: { en: "Optional chaining returns undefined instead of throwing when it hits a null link.", np: "Optional chaining ले null भेटिए error नफाली undefined दिन्छ।", jp: "オプショナルチェーンはnullに当たるとエラーを投げずundefinedを返す。" },
    },
    {
      question: { en: "Which comparison operator avoids implicit type coercion?", np: "कुन comparison operator ले implicit coercion avoid गर्छ?", jp: "暗黙の型変換を避ける比較演算子は？" },
      options: [{ en: "==", np: "==", jp: "==" }, { en: "===", np: "===", jp: "===" }],
      correctIndex: 1,
      explanation: { en: "=== never coerces types before comparing.", np: "=== ले comparison अघि कहिल्यै coerce गर्दैन।", jp: "===は比較前に型変換を行わない。" },
    },
    {
      question: { en: "What happens when a switch case is missing its break?", np: "Switch case मा break नभएमा के हुन्छ?", jp: "switchケースにbreakがないと？" },
      options: [{ en: "Falls through to the next case", np: "अर्को case मा fall-through हुन्छ", jp: "次のケースにフォールスルーする" }, { en: "Throws a SyntaxError", np: "SyntaxError आउँछ", jp: "SyntaxErrorが発生する" }],
      correctIndex: 0,
      explanation: { en: "Execution continues into the next case's code without break.", np: "break बिना execution अर्को case को code मा जान्छ।", jp: "breakがないと実行は次のケースのコードに続く。" },
    },
    {
      question: { en: "What is the main benefit of guard clauses?", np: "Guard clause को मुख्य फायदा के हो?", jp: "ガード節の主な利点は？" },
      options: [{ en: "Faster execution", np: "छिटो execution", jp: "実行の高速化" }, { en: "Flatter, more readable code instead of deep nesting", np: "Deep nesting भन्दा flat, पढ्न सजिलो code", jp: "深いネストの代わりに平坦で読みやすいコード" }],
      correctIndex: 1,
      explanation: { en: "Guard clauses are a readability pattern, not a performance optimization.", np: "Guard clause readability pattern हो, performance optimization होइन।", jp: "ガード節は可読性のパターンであり、パフォーマンス最適化ではない。" },
    },
    {
      question: { en: "Which loop should you use to get array values directly, without manual indexing?", np: "Manual indexing बिना array value पाउन कुन loop?", jp: "手動インデックスなしで配列の値を得るループは？" },
      options: [{ en: "for...in", np: "for...in", jp: "for...in" }, { en: "for...of", np: "for...of", jp: "for...of" }],
      correctIndex: 1,
      explanation: { en: "for...of iterates values directly; for...in iterates keys and also picks up inherited properties.", np: "for...of ले values सिधै दिन्छ; for...in ले keys दिन्छ र inherited properties पनि लिन्छ।", jp: "for...ofは値を直接反復。for...inはキーを反復し継承プロパティも取得してしまう。" },
    },
    {
      question: { en: "What does continue do inside a loop, as opposed to break?", np: "Loop भित्र `continue` ले break भन्दा फरक के गर्छ?", jp: "ループ内でcontinueはbreakと違い何をする？" },
      options: [{ en: "Exits the loop entirely", np: "Loop पूरै छोड्छ", jp: "ループを完全に終了する" }, { en: "Skips to the next iteration", np: "अर्को iteration मा जान्छ", jp: "次の反復にスキップする" }],
      correctIndex: 1,
      explanation: { en: "continue skips the rest of the current iteration; break exits the loop entirely.", np: "continue ले current iteration मात्र skip गर्छ; break ले loop पूरै छोड्छ।", jp: "continueは現在の反復のみスキップ。breakはループ全体を終了する。" },
    },
    {
      question: { en: "Which function type is fully hoisted with its body?", np: "कुन function type पूरै body सहित hoist हुन्छ?", jp: "本体ごと完全にホイストされる関数の種類は？" },
      options: [{ en: "Function declaration", np: "Function declaration", jp: "関数宣言" }, { en: "Arrow function", np: "Arrow function", jp: "アロー関数" }],
      correctIndex: 0,
      explanation: { en: "Only function declarations get full hoisting; arrow functions are just variable assignments.", np: "Function declaration मात्र पूरै hoist हुन्छ; arrow function त variable assignment मात्र हो।", jp: "関数宣言のみが完全にホイストされる。アロー関数は単なる変数代入。" },
    },
    {
      question: { en: "Why are arrow functions the safer default inside callbacks?", np: "Callback भित्र arrow function किन safer default हो?", jp: "コールバック内でアロー関数がより安全なデフォルトである理由は？" },
      options: [{ en: "They have no own `this`, so they inherit it from the surrounding scope", np: "यिनको आफ्नै this हुँदैन, surrounding scope बाट inherit गर्छन्", jp: "独自のthisを持たず、周囲のスコープから継承する" }, { en: "They execute asynchronously", np: "Asynchronously execute हुन्छन्", jp: "非同期で実行される" }],
      correctIndex: 0,
      explanation: { en: "Regular functions get a new this inside callbacks, which is often not what you want; arrow functions keep the outer this.", np: "Regular function ले callback भित्र नयाँ this पाउँछ; arrow function ले outer this कायम राख्छ।", jp: "通常の関数はコールバック内で新しいthisを持つ。アロー関数は外側のthisを保持する。" },
    },
    {
      question: { en: "Can an arrow function be used as a constructor with `new`?", np: "Arrow function लाई `new` सँग constructor को रूपमा प्रयोग गर्न मिल्छ?", jp: "アロー関数を`new`でコンストラクタとして使える？" },
      options: [{ en: "Yes", np: "हो", jp: "はい" }, { en: "No", np: "होइन", jp: "いいえ" }],
      correctIndex: 1,
      explanation: { en: "Arrow functions are not constructable — new arrowFn() throws a TypeError.", np: "Arrow function constructable छैन — TypeError आउँछ।", jp: "アロー関数はコンストラクタとして使えず、TypeErrorになる。" },
    },
  ],
};
