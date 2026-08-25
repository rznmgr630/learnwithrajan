import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_8_LESSONS: JsLessonDay = {
  day: 8,
  title: { en: "Set & Map", np: "Set र Map", jp: "SetとMap" },
  totalMinutes: 18,
  difficulty: { en: "Intermediate", np: "Intermediate", jp: "中級" },
  lessons: [
    {
      id: "map-collection",
      title: { en: "Map", np: "Map", jp: "Map" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>Map</b> is a JavaScript collection that stores <b>key-value pairs</b>. Unlike a plain object, a `Map` can use <b>any value as a key</b> — including objects, arrays, and functions.\n\n```javascript\nconst users = new Map();\n\nusers.set(1, \"Rajan\");\nusers.set(2, \"John\");\n\nconsole.log(users.get(1));\n// \"Rajan\"\n```\n\nA `Map` remembers the <b>insertion order</b> of its entries and provides built-in methods for adding, reading, checking, and removing data.\n\n---\n\n### 1. Basic — create and access\n\n```javascript\nconst users = new Map();\n\nusers.set(\"u1\", \"Rajan\");\nusers.set(\"u2\", \"John\");\n\nconsole.log(users.get(\"u1\"));\n// \"Rajan\"\n\nconsole.log(users.size);\n// 2\n```\n\n---\n\n### 2. Intermediate — objects as keys\n\n```javascript\nconst user = { id: 1 };\n\nconst roles = new Map();\n\nroles.set(user, \"admin\");\n\nconsole.log(roles.get(user));\n// \"admin\"\n```\n\nObjects can be keys because `Map` uses the <b>actual key value or reference</b>, not a string conversion like ordinary object property keys.\n\n---\n\n### 3. Advanced — count occurrences\n\n```javascript\nconst words = [\"js\", \"react\", \"js\", \"node\", \"react\", \"js\"];\n\nconst count = new Map();\n\nfor (const word of words) {\n  count.set(word, (count.get(word) ?? 0) + 1);\n}\n\nconsole.log(count);\n// Map { \"js\" => 3, \"react\" => 2, \"node\" => 1 }\n```\n\n---\n\n### Key methods\n\n```javascript\nmap.set(key, value);     // add or update\nmap.get(key);            // get value\nmap.has(key);            // check key\nmap.delete(key);         // remove key\nmap.clear();             // remove everything\nmap.size;                // number of entries\n```\n\nYou can also iterate directly:\n\n```javascript\nfor (const [key, value] of users) {\n  console.log(key, value);\n}\n```\n\n---\n\n### Map vs Object\n\n```text\nFeature       Map                             Object\n─────────────────────────────────────────────────────────────\nKey types     Any value                       String / Symbol\nSize          .size                           Manual\nIteration     Built-in                        More awkward\nAdd/update    .set()                          Assignment\nRead          .get()                          obj[key]\nBest for      Dynamic key-value collections   Structured data\n```",
        np: "<b>Map</b> JavaScript को त्यस्तो collection हो जसले <b>key-value जोडी</b> राख्छ। साधारण object भन्दा फरक, `Map` ले <b>जुनसुकै value लाई key</b> बनाउन सक्छ — object, array र function समेत।\n\n```javascript\nconst users = new Map();\n\nusers.set(1, \"Rajan\");\nusers.set(2, \"John\");\n\nconsole.log(users.get(1));\n// \"Rajan\"\n```\n\n`Map` ले आफ्ना entry को <b>insertion order</b> सम्झन्छ र data थप्न, पढ्न, जाँच्न र हटाउन built-in method दिन्छ।\n\n---\n\n### 1. आधारभूत — बनाउनु र पहुँच गर्नु\n\n```javascript\nconst users = new Map();\n\nusers.set(\"u1\", \"Rajan\");\nusers.set(\"u2\", \"John\");\n\nconsole.log(users.get(\"u1\"));\n// \"Rajan\"\n\nconsole.log(users.size);\n// 2\n```\n\n---\n\n### 2. मध्यम — object लाई key बनाउनु\n\n```javascript\nconst user = { id: 1 };\n\nconst roles = new Map();\n\nroles.set(user, \"admin\");\n\nconsole.log(roles.get(user));\n// \"admin\"\n```\n\nObject key बन्न सक्छन् किनकि `Map` ले साधारण object property key जस्तै string मा नबदली <b>वास्तविक key value वा reference</b> प्रयोग गर्छ।\n\n---\n\n### 3. उन्नत — गन्ती गर्नु\n\n```javascript\nconst words = [\"js\", \"react\", \"js\", \"node\", \"react\", \"js\"];\n\nconst count = new Map();\n\nfor (const word of words) {\n  count.set(word, (count.get(word) ?? 0) + 1);\n}\n\nconsole.log(count);\n// Map { \"js\" => 3, \"react\" => 2, \"node\" => 1 }\n```\n\n---\n\n### मुख्य method\n\n```javascript\nmap.set(key, value);     // add or update\nmap.get(key);            // get value\nmap.has(key);            // check key\nmap.delete(key);         // remove key\nmap.clear();             // remove everything\nmap.size;                // number of entries\n```\n\nतपाईं सिधै iterate पनि गर्न सक्नुहुन्छ:\n\n```javascript\nfor (const [key, value] of users) {\n  console.log(key, value);\n}\n```\n\n---\n\n### Map vs Object\n\n```text\nFeature       Map                             Object\n─────────────────────────────────────────────────────────────\nKey types     Any value                       String / Symbol\nSize          .size                           Manual\nIteration     Built-in                        More awkward\nAdd/update    .set()                          Assignment\nRead          .get()                          obj[key]\nBest for      Dynamic key-value collections   Structured data\n```",
        jp: "<b>Map</b> は<b>キーと値の組</b>を保存するJavaScriptのコレクションです。普通のオブジェクトと違い、`Map` は<b>どんな値でもキーにできます</b> — オブジェクト・配列・関数も含めて。\n\n```javascript\nconst users = new Map();\n\nusers.set(1, \"Rajan\");\nusers.set(2, \"John\");\n\nconsole.log(users.get(1));\n// \"Rajan\"\n```\n\n`Map` はエントリの<b>挿入順</b>を覚えており、追加・取得・確認・削除の組み込みメソッドを備えています。\n\n---\n\n### 1. 基本 — 作成とアクセス\n\n```javascript\nconst users = new Map();\n\nusers.set(\"u1\", \"Rajan\");\nusers.set(\"u2\", \"John\");\n\nconsole.log(users.get(\"u1\"));\n// \"Rajan\"\n\nconsole.log(users.size);\n// 2\n```\n\n---\n\n### 2. 中級 — オブジェクトをキーにする\n\n```javascript\nconst user = { id: 1 };\n\nconst roles = new Map();\n\nroles.set(user, \"admin\");\n\nconsole.log(roles.get(user));\n// \"admin\"\n```\n\n`Map` は通常のオブジェクトのキーのように文字列へ変換せず、<b>実際の値や参照</b>をキーとして使うので、オブジェクトもキーにできます。\n\n---\n\n### 3. 上級 — 出現回数を数える\n\n```javascript\nconst words = [\"js\", \"react\", \"js\", \"node\", \"react\", \"js\"];\n\nconst count = new Map();\n\nfor (const word of words) {\n  count.set(word, (count.get(word) ?? 0) + 1);\n}\n\nconsole.log(count);\n// Map { \"js\" => 3, \"react\" => 2, \"node\" => 1 }\n```\n\n---\n\n### 主なメソッド\n\n```javascript\nmap.set(key, value);     // add or update\nmap.get(key);            // get value\nmap.has(key);            // check key\nmap.delete(key);         // remove key\nmap.clear();             // remove everything\nmap.size;                // number of entries\n```\n\n直接反復もできます:\n\n```javascript\nfor (const [key, value] of users) {\n  console.log(key, value);\n}\n```\n\n---\n\n### Map と Object\n\n```text\nFeature       Map                             Object\n─────────────────────────────────────────────────────────────\nKey types     Any value                       String / Symbol\nSize          .size                           Manual\nIteration     Built-in                        More awkward\nAdd/update    .set()                          Assignment\nRead          .get()                          obj[key]\nBest for      Dynamic key-value collections   Structured data\n```",
      },
      diagram: `Map

┌─────────┬──────────┐
│   Key   │  Value   │
├─────────┼──────────┤
│    1    │ "Rajan"  │
│    2    │ "John"   │
│   user  │  {...}   │
└─────────┴──────────┘


Feature       Map                             Object
─────────────────────────────────────────────────────────────
Key types     Any value                       String / Symbol
Size          .size                           Manual
Iteration     Built-in                        More awkward
Add/update    .set()                          Assignment
Read          .get()                          obj[key]
Best for      Dynamic key-value collections   Structured data`,
      codeExample: {
        title: { en: "Creating, keying and counting with a Map", np: "Map बनाउनु, key दिनु र गन्नु", jp: "Mapの作成・キー・集計" },
        code: `// ── 1. Basic — create and access ──────────────────────────────────
const users = new Map();

users.set("u1", "Rajan");
users.set("u2", "John");

console.log(users.get("u1")); // "Rajan"
console.log(users.size);      // 2

// ── 2. Intermediate — an object as a key ──────────────────────────
const user = { id: 1 };
const roles = new Map();

roles.set(user, "admin");
console.log(roles.get(user)); // "admin"

// A different object with the same shape is a different key
console.log(roles.get({ id: 1 })); // undefined

// ── 3. Advanced — counting occurrences ────────────────────────────
const words = ["js", "react", "js", "node", "react", "js"];
const count = new Map();

for (const word of words) {
  count.set(word, (count.get(word) ?? 0) + 1);
}

console.log(count); // Map { "js" => 3, "react" => 2, "node" => 1 }

// ── Iterating gives you [key, value] pairs ────────────────────────
for (const [key, value] of users) {
  console.log(key, value);
}`,
      },
      keyTakeaways: [
        { en: "A <b>Map</b> stores <b>key-value pairs</b> and can use <b>any value as a key</b>, including objects and functions.", np: "<b>Map</b> ले <b>key-value जोडी</b> राख्छ र object र function समेत <b>जुनसुकै value लाई key</b> बनाउन सक्छ।", jp: "<b>Map</b> は<b>キーと値の組</b>を保存し、オブジェクトや関数も含め<b>どんな値でもキー</b>にできる。" },
        { en: "`map.set()` adds or updates, `map.get()` reads, and `map.has()` checks.", np: "`map.set()` ले थप्छ वा अद्यावधिक गर्छ, `map.get()` ले पढ्छ, र `map.has()` ले जाँच्छ।", jp: "`map.set()` で追加・更新、`map.get()` で取得、`map.has()` で確認する。" },
        { en: "`map.size` gives the number of entries — no manual counting.", np: "`map.size` ले entry को संख्या दिन्छ — हातले गन्नु पर्दैन।", jp: "`map.size` がエントリ数を返す。自分で数える必要はない。" },
        { en: "A `Map` remembers <b>insertion order</b> and is iterable with `for...of`, yielding `[key, value]` pairs.", np: "`Map` ले <b>insertion order</b> सम्झन्छ र `for...of` ले iterate गर्न मिल्छ, `[key, value]` जोडी दिन्छ।", jp: "`Map` は<b>挿入順</b>を保ち、`for...of` で `[key, value]` の組を反復できる。" },
        { en: "Object keys are compared by <b>reference</b>, so two identical-looking objects are different keys.", np: "Object key <b>reference</b> ले तुलना हुन्छन्, त्यसैले उस्तै देखिने दुई object फरक key हुन्।", jp: "オブジェクトのキーは<b>参照</b>で比較されるので、見た目が同じ2つのオブジェクトは別のキー。" },
        { en: "Use a `Map` for dynamic key-value collections; use a plain object for structured, known-shape data.", np: "Dynamic key-value collection का लागि `Map` प्रयोग गर्नुहोस्; संरचित, ज्ञात आकारको data का लागि साधारण object।", jp: "動的なキーと値のコレクションには `Map`、構造が決まったデータには通常のオブジェクトを使う。" },
      ],
      commonMistakes: [
        { en: "<b>Using bracket notation</b> — `map[\"name\"] = \"Rajan\"` sets a normal property, so `map.get(\"name\")` is `undefined`. Use `map.set(\"name\", \"Rajan\")`.", np: "<b>Bracket notation प्रयोग गर्नु</b> — `map[\"name\"] = \"Rajan\"` ले सामान्य property सेट गर्छ, त्यसैले `map.get(\"name\")` `undefined` हुन्छ। `map.set(\"name\", \"Rajan\")` प्रयोग गर्नुहोस्।", jp: "<b>ブラケット記法を使う</b> — `map[\"name\"] = \"Rajan\"` は普通のプロパティを設定するので `map.get(\"name\")` は `undefined`。`map.set(\"name\", \"Rajan\")` を使う。" },
        { en: "<b>Assuming two identical-looking objects are the same key</b> — `map.set({ id: 1 }, \"Rajan\")` then `map.get({ id: 1 })` gives `undefined`, because those are two different references. Keep the same object in a variable.", np: "<b>उस्तै देखिने दुई object उही key हुन् भन्ने ठान्नु</b> — `map.set({ id: 1 }, \"Rajan\")` पछि `map.get({ id: 1 })` ले `undefined` दिन्छ, किनकि ती दुई फरक reference हुन्। उही object लाई variable मा राख्नुहोस्।", jp: "<b>見た目が同じ2つのオブジェクトを同じキーだと思う</b> — `map.set({ id: 1 }, \"Rajan\")` の後 `map.get({ id: 1 })` は `undefined`。別の参照だから。同じオブジェクトを変数に保持する。" },
        { en: "<b>Reaching for `Object.keys()` on a Map</b> — a `Map` is not a plain object. Iterate it directly, or use `map.keys()` and `map.values()`.", np: "<b>Map मा `Object.keys()` प्रयोग गर्नु</b> — `Map` साधारण object होइन। सिधै iterate गर्नुहोस्, वा `map.keys()` र `map.values()` प्रयोग गर्नुहोस्।", jp: "<b>Mapに `Object.keys()` を使う</b> — `Map` は普通のオブジェクトではない。直接反復するか、`map.keys()` と `map.values()` を使う。" },
      ],
      quiz: [
        {
          question: { en: "What can a `Map` use as a key?", np: "`Map` ले के लाई key बनाउन सक्छ?", jp: "`Map` はキーに何を使えるか?" },
          options: [
            { en: "Any JavaScript value", np: "जुनसुकै JavaScript value", jp: "任意のJavaScriptの値" },
            { en: "Only numbers", np: "Number मात्र", jp: "数値だけ" },
            { en: "Strings and numbers", np: "String र number", jp: "文字列と数値" },
            { en: "Only strings", np: "String मात्र", jp: "文字列だけ" },
          ],
          correctIndex: 0,
          explanation: { en: "Objects, arrays and functions all work, because keys are not converted to strings.", np: "Object, array र function सबै काम गर्छन्, किनकि key string मा बदलिँदैनन्।", jp: "キーは文字列に変換されないので、オブジェクト・配列・関数も使える。" },
        },
        {
          question: { en: "Which method adds a key-value pair?", np: "कुन method ले key-value जोडी थप्छ?", jp: "キーと値の組を追加するメソッドは?" },
          options: [
            { en: "`add()`", np: "`add()`", jp: "`add()`" },
            { en: "`set()`", np: "`set()`", jp: "`set()`" },
            { en: "`push()`", np: "`push()`", jp: "`push()`" },
            { en: "`insert()`", np: "`insert()`", jp: "`insert()`" },
          ],
          correctIndex: 1,
          explanation: { en: "`add()` belongs to `Set`; `Map` uses `set()` for both adding and updating.", np: "`add()` `Set` को हो; `Map` ले थप्न र अद्यावधिक गर्न दुबैका लागि `set()` प्रयोग गर्छ।", jp: "`add()` は `Set` のもの。`Map` は追加も更新も `set()` を使う。" },
        },
        {
          question: { en: "What does `map.get(\"name\")` return after `map.set(\"name\", \"Rajan\")`?", np: "`map.set(\"name\", \"Rajan\")` पछि `map.get(\"name\")` ले के फर्काउँछ?", jp: "`map.set(\"name\", \"Rajan\")` の後、`map.get(\"name\")` は何を返すか?" },
          options: [
            { en: "`\"name\"`", np: "`\"name\"`", jp: "`\"name\"`" },
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
            { en: "`\"Rajan\"`", np: "`\"Rajan\"`", jp: "`\"Rajan\"`" },
          ],
          correctIndex: 2,
          explanation: { en: "`get()` looks the key up and returns its stored value.", np: "`get()` ले key खोज्छ र यसको भण्डारित value फर्काउँछ।", jp: "`get()` はキーを探して、保存された値を返す。" },
        },
      ],
    },
    {
      id: "set-collection",
      title: { en: "Set", np: "Set", jp: "Set" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>Set</b> is a JavaScript collection that stores <b>unique values</b>. If you add the same value multiple times, the `Set` keeps only one copy.\n\n```javascript\nconst numbers = new Set();\n\nnumbers.add(10);\nnumbers.add(20);\nnumbers.add(10);\n\nconsole.log(numbers);\n// Set { 10, 20 }\n```\n\nA `Set` can store <b>any JavaScript value</b> — strings, numbers, objects, arrays, functions, and more. It remembers insertion order and is especially useful when you need to remove duplicates or quickly check whether a value exists.\n\n---\n\n### 1. Basic — remove duplicates\n\n```javascript\nconst numbers = [1, 2, 2, 3, 3, 3];\n\nconst uniqueNumbers = [...new Set(numbers)];\n\nconsole.log(uniqueNumbers);\n// [1, 2, 3]\n```\n\n---\n\n### 2. Intermediate — check membership\n\n```javascript\nconst permissions = new Set([\n  \"read\",\n  \"write\",\n  \"delete\"\n]);\n\nconsole.log(permissions.has(\"write\"));\n// true\n\nconsole.log(permissions.has(\"admin\"));\n// false\n```\n\n`has()` is useful when you only need to know whether a value exists.\n\n---\n\n### 3. Advanced — set operations\n\n```javascript\nconst frontend = new Set([\"React\", \"Vue\", \"Angular\"]);\nconst backend = new Set([\"Node\", \"Laravel\", \"React\"]);\n\nconst common = [...frontend].filter(skill => backend.has(skill));\n\nconsole.log(common);\n// [\"React\"]\n```\n\nThis finds values that exist in both collections.\n\n---\n\n### Key methods\n\n```javascript\nset.add(value);       // add a value\nset.has(value);       // check if value exists\nset.delete(value);    // remove a value\nset.clear();          // remove everything\nset.size;             // number of unique values\n```\n\nYou can iterate over a `Set` directly:\n\n```javascript\nfor (const value of set) {\n  console.log(value);\n}\n```\n\n---\n\n### Set vs Array\n\n```text\nFeature            Set               Array\n──────────────────────────────────────────────────────\nDuplicate values   No                Yes\nOrder              Insertion order   Insertion order\nCheck existence    .has()            .includes()\nAdd                .add()            .push()\nAccess by index    No                Yes\nBest for           Unique values     Ordered collections\n```",
        np: "<b>Set</b> JavaScript को त्यस्तो collection हो जसले <b>अद्वितीय value</b> राख्छ। उही value धेरै पटक थप्नुभयो भने, `Set` ले एउटा मात्र राख्छ।\n\n```javascript\nconst numbers = new Set();\n\nnumbers.add(10);\nnumbers.add(20);\nnumbers.add(10);\n\nconsole.log(numbers);\n// Set { 10, 20 }\n```\n\n`Set` ले <b>जुनसुकै JavaScript value</b> राख्न सक्छ — string, number, object, array, function र अझ धेरै। यसले insertion order सम्झन्छ र duplicate हटाउनु वा value छ कि छैन छिटो जाँच्नुपर्दा विशेष उपयोगी हुन्छ।\n\n---\n\n### 1. आधारभूत — duplicate हटाउनु\n\n```javascript\nconst numbers = [1, 2, 2, 3, 3, 3];\n\nconst uniqueNumbers = [...new Set(numbers)];\n\nconsole.log(uniqueNumbers);\n// [1, 2, 3]\n```\n\n---\n\n### 2. मध्यम — सदस्यता जाँच्नु\n\n```javascript\nconst permissions = new Set([\n  \"read\",\n  \"write\",\n  \"delete\"\n]);\n\nconsole.log(permissions.has(\"write\"));\n// true\n\nconsole.log(permissions.has(\"admin\"));\n// false\n```\n\nValue छ कि छैन मात्र थाहा चाहिँदा `has()` उपयोगी हुन्छ।\n\n---\n\n### 3. उन्नत — set operation\n\n```javascript\nconst frontend = new Set([\"React\", \"Vue\", \"Angular\"]);\nconst backend = new Set([\"Node\", \"Laravel\", \"React\"]);\n\nconst common = [...frontend].filter(skill => backend.has(skill));\n\nconsole.log(common);\n// [\"React\"]\n```\n\nयसले दुबै collection मा भएका value भेट्टाउँछ।\n\n---\n\n### मुख्य method\n\n```javascript\nset.add(value);       // add a value\nset.has(value);       // check if value exists\nset.delete(value);    // remove a value\nset.clear();          // remove everything\nset.size;             // number of unique values\n```\n\n`Set` लाई सिधै iterate गर्न सक्नुहुन्छ:\n\n```javascript\nfor (const value of set) {\n  console.log(value);\n}\n```\n\n---\n\n### Set vs Array\n\n```text\nFeature            Set               Array\n──────────────────────────────────────────────────────\nDuplicate values   No                Yes\nOrder              Insertion order   Insertion order\nCheck existence    .has()            .includes()\nAdd                .add()            .push()\nAccess by index    No                Yes\nBest for           Unique values     Ordered collections\n```",
        jp: "<b>Set</b> は<b>一意な値</b>を保存するJavaScriptのコレクションです。同じ値を何度追加しても、`Set` は1つだけ保持します。\n\n```javascript\nconst numbers = new Set();\n\nnumbers.add(10);\nnumbers.add(20);\nnumbers.add(10);\n\nconsole.log(numbers);\n// Set { 10, 20 }\n```\n\n`Set` は<b>どんなJavaScriptの値</b>でも保存できます — 文字列・数値・オブジェクト・配列・関数など。挿入順を覚えており、重複を取り除いたり、値の有無をすばやく確認したいときに特に便利です。\n\n---\n\n### 1. 基本 — 重複を取り除く\n\n```javascript\nconst numbers = [1, 2, 2, 3, 3, 3];\n\nconst uniqueNumbers = [...new Set(numbers)];\n\nconsole.log(uniqueNumbers);\n// [1, 2, 3]\n```\n\n---\n\n### 2. 中級 — 含まれるか調べる\n\n```javascript\nconst permissions = new Set([\n  \"read\",\n  \"write\",\n  \"delete\"\n]);\n\nconsole.log(permissions.has(\"write\"));\n// true\n\nconsole.log(permissions.has(\"admin\"));\n// false\n```\n\n値の有無だけ知りたいときは `has()` が便利です。\n\n---\n\n### 3. 上級 — 集合演算\n\n```javascript\nconst frontend = new Set([\"React\", \"Vue\", \"Angular\"]);\nconst backend = new Set([\"Node\", \"Laravel\", \"React\"]);\n\nconst common = [...frontend].filter(skill => backend.has(skill));\n\nconsole.log(common);\n// [\"React\"]\n```\n\n両方のコレクションに存在する値を見つけられます。\n\n---\n\n### 主なメソッド\n\n```javascript\nset.add(value);       // add a value\nset.has(value);       // check if value exists\nset.delete(value);    // remove a value\nset.clear();          // remove everything\nset.size;             // number of unique values\n```\n\n`Set` は直接反復できます:\n\n```javascript\nfor (const value of set) {\n  console.log(value);\n}\n```\n\n---\n\n### Set と Array\n\n```text\nFeature            Set               Array\n──────────────────────────────────────────────────────\nDuplicate values   No                Yes\nOrder              Insertion order   Insertion order\nCheck existence    .has()            .includes()\nAdd                .add()            .push()\nAccess by index    No                Yes\nBest for           Unique values     Ordered collections\n```",
      },
      diagram: `Array

[10, 20, 10, 30, 20]

        ↓ new Set()

Set

{ 10, 20, 30 }


Feature            Set               Array
──────────────────────────────────────────────────────
Duplicate values   No                Yes
Order              Insertion order   Insertion order
Check existence    .has()            .includes()
Add                .add()            .push()
Access by index    No                Yes
Best for           Unique values     Ordered collections`,
      codeExample: {
        title: { en: "Deduping, checking and comparing with a Set", np: "Set ले duplicate हटाउनु, जाँच्नु र तुलना गर्नु", jp: "Setで重複排除・確認・比較" },
        code: `// ── 1. Basic — the classic dedupe ─────────────────────────────────
const numbers = [1, 2, 2, 3, 3, 3];

const uniqueNumbers = [...new Set(numbers)];
console.log(uniqueNumbers); // [1, 2, 3]

// ── 2. Intermediate — membership checks ───────────────────────────
const permissions = new Set(["read", "write", "delete"]);

console.log(permissions.has("write")); // true
console.log(permissions.has("admin")); // false
console.log(permissions.size);         // 3

// ── 3. Advanced — values present in both collections ──────────────
const frontend = new Set(["React", "Vue", "Angular"]);
const backend = new Set(["Node", "Laravel", "React"]);

const common = [...frontend].filter(skill => backend.has(skill));
console.log(common); // ["React"]

// ── No index access, and objects compare by reference ─────────────
const letters = new Set(["a", "b", "c"]);

console.log(letters[0]);   // undefined
console.log([...letters][0]); // "a"

console.log(new Set([{ id: 1 }, { id: 1 }]).size); // 2 — different objects

const user = { id: 1 };
console.log(new Set([user, user]).size); // 1 — same reference`,
      },
      keyTakeaways: [
        { en: "A <b>Set</b> stores <b>unique values</b> — adding the same value twice keeps only one copy.", np: "<b>Set</b> ले <b>अद्वितीय value</b> राख्छ — उही value दुई पटक थप्दा एउटा मात्र रहन्छ।", jp: "<b>Set</b> は<b>一意な値</b>を保存する。同じ値を2回追加しても1つだけ残る。" },
        { en: "`[...new Set(array)]` is the shortest way to remove duplicates from an array.", np: "`[...new Set(array)]` array बाट duplicate हटाउने सबैभन्दा छोटो तरिका हो।", jp: "`[...new Set(array)]` は配列から重複を取り除く最短の方法。" },
        { en: "`set.has(value)` checks membership quickly, which is often clearer than `array.includes()`.", np: "`set.has(value)` ले छिटो सदस्यता जाँच्छ, जुन प्रायः `array.includes()` भन्दा स्पष्ट हुन्छ।", jp: "`set.has(value)` は素早く存在を確認でき、`array.includes()` より明確なことが多い。" },
        { en: "`add()`, `has()`, `delete()`, `clear()` and `size` are the methods you need.", np: "`add()`, `has()`, `delete()`, `clear()` र `size` नै चाहिने method हुन्।", jp: "必要なのは `add()`・`has()`・`delete()`・`clear()`・`size`。" },
        { en: "A `Set` has <b>no index access</b>; spread it into an array first if you need positions.", np: "`Set` मा <b>index पहुँच हुँदैन</b>; स्थान चाहिएमा पहिले array मा spread गर्नुहोस्।", jp: "`Set` には<b>添字アクセスがない</b>。位置が必要なら先に配列へ展開する。" },
        { en: "Objects are compared by <b>reference</b>, so two identical-looking objects both stay in the set.", np: "Object <b>reference</b> ले तुलना हुन्छन्, त्यसैले उस्तै देखिने दुई object दुबै set मा रहन्छन्।", jp: "オブジェクトは<b>参照</b>で比較されるので、見た目が同じ2つはどちらも残る。" },
      ],
      commonMistakes: [
        { en: "<b>Expecting index access</b> — `set[0]` is `undefined`. Iterate the set, or convert it first with `[...set]`.", np: "<b>Index पहुँचको आशा गर्नु</b> — `set[0]` `undefined` हो। Set iterate गर्नुहोस्, वा पहिले `[...set]` ले बदल्नुहोस्।", jp: "<b>添字アクセスを期待する</b> — `set[0]` は `undefined`。反復するか、`[...set]` で配列にする。" },
        { en: "<b>Assuming duplicate objects are removed</b> — `new Set([{ id: 1 }, { id: 1 }]).size` is `2`, because those are two different references. Reuse the same object to get `1`.", np: "<b>Duplicate object हट्छन् भन्ने ठान्नु</b> — `new Set([{ id: 1 }, { id: 1 }]).size` `2` हो, किनकि ती दुई फरक reference हुन्। `1` पाउन उही object पुनः प्रयोग गर्नुहोस्।", jp: "<b>重複したオブジェクトが除かれると思う</b> — `new Set([{ id: 1 }, { id: 1 }]).size` は `2`。別の参照だから。`1` にしたければ同じオブジェクトを使う。" },
        { en: "<b>Using an array where a set fits better</b> — repeated `includes()` checks on a large array are slower and read less clearly than `set.has()`.", np: "<b>Set उपयुक्त हुने ठाउँमा array प्रयोग गर्नु</b> — ठूलो array मा बारम्बार `includes()` जाँच्नु ढिलो हुन्छ र `set.has()` भन्दा कम स्पष्ट पढिन्छ।", jp: "<b>Setが合う場面で配列を使う</b> — 大きな配列で `includes()` を繰り返すのは遅く、`set.has()` より読みにくい。" },
      ],
      quiz: [
        {
          question: { en: "What is the main property of a `Set`?", np: "`Set` को मुख्य विशेषता के हो?", jp: "`Set` の主な特徴は?" },
          options: [
            { en: "It stores key-value pairs", np: "यसले key-value जोडी राख्छ", jp: "キーと値の組を保存する" },
            { en: "It automatically sorts values", np: "यसले value स्वतः क्रमबद्ध गर्छ", jp: "値を自動的に並べ替える" },
            { en: "It stores values by index", np: "यसले value लाई index ले राख्छ", jp: "添字で値を保存する" },
            { en: "It stores only unique values", np: "यसले अद्वितीय value मात्र राख्छ", jp: "一意な値だけを保存する" },
          ],
          correctIndex: 3,
          explanation: { en: "Key-value pairs are a `Map`; a `Set` holds values only, each one once.", np: "Key-value जोडी `Map` हो; `Set` ले value मात्र राख्छ, हरेक एक पटक।", jp: "キーと値の組は `Map`。`Set` は値だけを、それぞれ1回ずつ保持する。" },
        },
        {
          question: { en: "Which method checks whether a value exists in a `Set`?", np: "`Set` मा value छ कि छैन कुन method ले जाँच्छ?", jp: "`Set` に値があるか調べるメソッドは?" },
          options: [
            { en: "`has()`", np: "`has()`", jp: "`has()`" },
            { en: "`includes()`", np: "`includes()`", jp: "`includes()`" },
            { en: "`contains()`", np: "`contains()`", jp: "`contains()`" },
            { en: "`find()`", np: "`find()`", jp: "`find()`" },
          ],
          correctIndex: 0,
          explanation: { en: "`includes()` is the array method; sets use `has()`, and so do maps.", np: "`includes()` array को method हो; set ले `has()` प्रयोग गर्छ, map ले पनि त्यही।", jp: "`includes()` は配列のメソッド。SetもMapも `has()` を使う。" },
        },
        {
          question: { en: "What is `new Set([1, 2, 2, 3, 3]).size`?", np: "`new Set([1, 2, 2, 3, 3]).size` के हो?", jp: "`new Set([1, 2, 2, 3, 3]).size` は?" },
          options: [
            { en: "`5`", np: "`5`", jp: "`5`" },
            { en: "`2`", np: "`2`", jp: "`2`" },
            { en: "`3`", np: "`3`", jp: "`3`" },
          ],
          correctIndex: 2,
          explanation: { en: "The duplicates collapse, leaving `1`, `2` and `3`.", np: "Duplicate हट्छन्, `1`, `2` र `3` बाँकी रहन्छन्।", jp: "重複がまとまり、`1`・`2`・`3` が残る。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Which collection stores key-value pairs, and which stores unique values?", np: "कुन collection ले key-value जोडी राख्छ, र कुनले अद्वितीय value?", jp: "キーと値の組を保存するのはどちらで、一意な値を保存するのはどちらか?" },
      options: [
        { en: "Map stores pairs, Set stores unique values", np: "Map ले जोडी राख्छ, Set ले अद्वितीय value", jp: "Mapが組を、Setが一意な値を保存する" },
        { en: "Set stores pairs, Map stores unique values", np: "Set ले जोडी राख्छ, Map ले अद्वितीय value", jp: "Setが組を、Mapが一意な値を保存する" },
        { en: "Both store key-value pairs", np: "दुबैले key-value जोडी राख्छन्", jp: "どちらもキーと値の組を保存する" },
      ],
      correctIndex: 0,
      explanation: { en: "`Map` is the key-value collection; `Set` holds values only, each one once.", np: "`Map` key-value collection हो; `Set` ले value मात्र राख्छ, हरेक एक पटक।", jp: "`Map` がキーと値のコレクション。`Set` は値だけを1回ずつ保持する。" },
    },
    {
      question: { en: "Why can a `Map` use an object as a key when a plain object cannot?", np: "साधारण object ले नसक्दा `Map` ले object लाई किन key बनाउन सक्छ?", jp: "普通のオブジェクトにはできないのに、なぜ `Map` はオブジェクトをキーにできるのか?" },
      options: [
        { en: "`Map` converts objects to JSON first", np: "`Map` ले object लाई पहिले JSON मा बदल्छ", jp: "`Map` はオブジェクトを先にJSONに変換するから" },
        { en: "`Map` keeps the actual value or reference instead of converting it to a string", np: "`Map` ले string मा नबदली वास्तविक value वा reference राख्छ", jp: "`Map` は文字列に変換せず、実際の値や参照を保持するから" },
        { en: "`Map` copies the object", np: "`Map` ले object copy गर्छ", jp: "`Map` がオブジェクトをコピーするから" },
      ],
      correctIndex: 1,
      explanation: { en: "Plain object keys are coerced to strings, so every object would become `\"[object Object]\"`.", np: "साधारण object का key string मा बदलिन्छन्, त्यसैले हरेक object `\"[object Object]\"` बन्थ्यो।", jp: "普通のオブジェクトのキーは文字列に変換されるため、どのオブジェクトも `\"[object Object]\"` になってしまう。" },
    },
    {
      question: { en: "What is the shortest way to remove duplicates from an array?", np: "Array बाट duplicate हटाउने सबैभन्दा छोटो तरिका के हो?", jp: "配列から重複を取り除く最短の方法は?" },
      options: [
        { en: "`array.filter(unique)`", np: "`array.filter(unique)`", jp: "`array.filter(unique)`" },
        { en: "`array.sort().dedupe()`", np: "`array.sort().dedupe()`", jp: "`array.sort().dedupe()`" },
        { en: "`[...new Set(array)]`", np: "`[...new Set(array)]`", jp: "`[...new Set(array)]`" },
      ],
      correctIndex: 2,
      explanation: { en: "The set drops duplicates, and the spread turns it back into an array.", np: "Set ले duplicate हटाउँछ, र spread ले फेरि array बनाउँछ।", jp: "Setが重複を落とし、スプレッドで配列に戻す。" },
    },
    {
      question: { en: "Which method adds an entry: `Map` versus `Set`?", np: "Entry थप्ने method कुन हो: `Map` vs `Set`?", jp: "エントリを追加するメソッドは、`Map` と `Set` でどちらがどれか?" },
      options: [
        { en: "`Map` uses `set()`, `Set` uses `add()`", np: "`Map` ले `set()`, `Set` ले `add()`", jp: "`Map` は `set()`、`Set` は `add()`" },
        { en: "Both use `add()`", np: "दुबैले `add()` प्रयोग गर्छन्", jp: "どちらも `add()`" },
        { en: "Both use `set()`", np: "दुबैले `set()` प्रयोग गर्छन्", jp: "どちらも `set()`" },
      ],
      correctIndex: 0,
      explanation: { en: "A map entry needs a key and a value; a set entry is just the value.", np: "Map entry लाई key र value चाहिन्छ; set entry केवल value हो।", jp: "Mapのエントリはキーと値が必要。Setのエントリは値だけ。" },
    },
    {
      question: { en: "What does `set[0]` return for `new Set([\"a\", \"b\"])`?", np: "`new Set([\"a\", \"b\"])` का लागि `set[0]` ले के फर्काउँछ?", jp: "`new Set([\"a\", \"b\"])` に対して `set[0]` は何を返すか?" },
      options: [
        { en: "`\"a\"`", np: "`\"a\"`", jp: "`\"a\"`" },
        { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
        { en: "`0`", np: "`0`", jp: "`0`" },
      ],
      correctIndex: 1,
      explanation: { en: "Sets have no numeric indexes. Spread into an array first: `[...set][0]`.", np: "Set मा numeric index हुँदैन। पहिले array मा spread गर्नुहोस्: `[...set][0]`।", jp: "Setに数値の添字はない。まず配列に展開する: `[...set][0]`。" },
    },
    {
      question: { en: "How many entries does `new Set([{ id: 1 }, { id: 1 }])` hold?", np: "`new Set([{ id: 1 }, { id: 1 }])` मा कति entry हुन्छन्?", jp: "`new Set([{ id: 1 }, { id: 1 }])` にはいくつのエントリがあるか?" },
      options: [
        { en: "`1`", np: "`1`", jp: "`1`" },
        { en: "`0`", np: "`0`", jp: "`0`" },
        { en: "`2`", np: "`2`", jp: "`2`" },
      ],
      correctIndex: 2,
      explanation: { en: "They look alike but are separate references, so both are kept.", np: "तिनी उस्तै देखिन्छन् तर छुट्टै reference हुन्, त्यसैले दुबै रहन्छन्।", jp: "見た目は同じでも別々の参照なので、両方とも保持される。" },
    },
    {
      question: { en: "Which is the natural choice for counting how many times each word appears?", np: "हरेक शब्द कति पटक आयो गन्न कुन स्वाभाविक छनोट हो?", jp: "各単語の出現回数を数えるのに自然な選択はどれか?" },
      options: [
        { en: "A `Map`, using the word as the key and the count as the value", np: "शब्दलाई key र गन्तीलाई value बनाई `Map`", jp: "単語をキー、回数を値にした `Map`" },
        { en: "A `Set`, using `add()` for each word", np: "हरेक शब्दका लागि `add()` प्रयोग गरी `Set`", jp: "各単語に `add()` を使う `Set`" },
        { en: "An array of booleans", np: "Boolean को array", jp: "真偽値の配列" },
      ],
      correctIndex: 0,
      explanation: { en: "A set only records presence; the counts need a value per key.", np: "Set ले उपस्थिति मात्र राख्छ; गन्तीका लागि हरेक key सँग value चाहिन्छ।", jp: "Setは存在の有無だけ。回数にはキーごとの値が必要。" },
    },
    {
      question: { en: "What does `map.size` do that a plain object does not offer directly?", np: "साधारण object ले सिधै नदिने कुन काम `map.size` ले गर्छ?", jp: "`map.size` は、普通のオブジェクトが直接提供しない何をしてくれるか?" },
      options: [
        { en: "Sorts the entries", np: "Entry क्रमबद्ध गर्छ", jp: "エントリを並べ替える" },
        { en: "Reports the number of entries without counting keys manually", np: "Key हातले नगनी entry को संख्या बताउँछ", jp: "キーを自分で数えずにエントリ数を返す" },
        { en: "Removes duplicate values", np: "Duplicate value हटाउँछ", jp: "重複した値を取り除く" },
      ],
      correctIndex: 1,
      explanation: { en: "With an object you would write `Object.keys(obj).length` instead.", np: "Object सँग तपाईंले `Object.keys(obj).length` लेख्नुपर्थ्यो।", jp: "オブジェクトなら `Object.keys(obj).length` と書くことになる。" },
    },
    {
      question: { en: "When iterating a `Map` with `for...of`, what does each step give you?", np: "`for...of` ले `Map` iterate गर्दा हरेक चरणले के दिन्छ?", jp: "`for...of` で `Map` を反復すると、各ステップで何が得られるか?" },
      options: [
        { en: "Just the key", np: "Key मात्र", jp: "キーだけ" },
        { en: "Just the value", np: "Value मात्र", jp: "値だけ" },
        { en: "A `[key, value]` pair", np: "`[key, value]` जोडी", jp: "`[key, value]` の組" },
      ],
      correctIndex: 2,
      explanation: { en: "That is why `for (const [key, value] of map)` destructures the pair.", np: "त्यसैले `for (const [key, value] of map)` ले जोडी destructure गर्छ।", jp: "だから `for (const [key, value] of map)` で組を分割代入する。" },
    },
  ],
};
