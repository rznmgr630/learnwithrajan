import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_6_LESSONS: JsLessonDay = {
  day: 6,
  title: { en: "Objects — Creation, Methods, Destructuring & Spread", np: "Objects — Creation, Methods, Destructuring र Spread", jp: "オブジェクト・メソッド・分割代入・スプレッド" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "object-fundamentals",
      title: { en: "Object Fundamentals & Built-in Methods", np: "Object आधारभूत कुरा र Built-in Methods", jp: "オブジェクトの基礎と組み込みメソッド" },
      durationMinutes: 9,
      explanation: {
        en: "An <b>object</b> is a collection of <b>key-value pairs</b> (a named property and its value).\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n```\n\nHere, `name` and `age` are <b>keys</b>, while `\"Rajan\"` and `30` are their values.\n\n---\n\n### Accessing properties\n\n• <b>Dot notation</b> — use when you know the property name: `user.name`\n• <b>Bracket notation</b> — use when the property name is stored in a variable: `user[key]`\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconsole.log(user.name); // Rajan\n\nconst key = \"age\";\nconsole.log(user[key]); // 30\n```\n\n---\n\n### Object shorthand\n\n<b>Object shorthand</b> lets you write `{ name, age }` instead of `{ name: name, age: age }` when the variable and property have the same name.\n\n---\n\n### Useful object methods\n\n• `Object.keys()` → returns all keys as an array\n• `Object.values()` → returns all values as an array\n• `Object.entries()` → returns key-value pairs as an array\n• `Object.fromEntries()` → turns key-value pairs back into an object\n• `Object.freeze()` → prevents top-level properties from being changed\n• `Object.hasOwn()` → checks whether an object directly has a property\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconsole.log(Object.keys(user));\n// [\"name\", \"age\"]\n\nconsole.log(Object.entries(user));\n// [[\"name\", \"Rajan\"], [\"age\", 30]]\n```",
        np: "<b>Object</b> भनेको <b>key-value जोडी</b> (नाम दिइएको property र यसको value) को संग्रह हो।\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n```\n\nयहाँ, `name` र `age` <b>key</b> हुन्, जब कि `\"Rajan\"` र `30` तिनका value हुन्।\n\n---\n\n### Property पहुँच गर्नु\n\n• <b>Dot notation</b> — property को नाम थाहा हुँदा प्रयोग गर्नुहोस्: `user.name`\n• <b>Bracket notation</b> — property को नाम variable मा राखिएको बेला प्रयोग गर्नुहोस्: `user[key]`\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconsole.log(user.name); // Rajan\n\nconst key = \"age\";\nconsole.log(user[key]); // 30\n```\n\n---\n\n### Object shorthand\n\n<b>Object shorthand</b> ले variable र property को नाम उही हुँदा `{ name: name, age: age }` को साटो `{ name, age }` लेख्न दिन्छ।\n\n---\n\n### उपयोगी object method\n\n• `Object.keys()` → सबै key array रूपमा फर्काउँछ\n• `Object.values()` → सबै value array रूपमा फर्काउँछ\n• `Object.entries()` → key-value जोडी array रूपमा फर्काउँछ\n• `Object.fromEntries()` → key-value जोडीलाई फेरि object बनाउँछ\n• `Object.freeze()` → top-level property बदलिनबाट रोक्छ\n• `Object.hasOwn()` → object सँग सिधै property छ कि छैन जाँच्छ\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconsole.log(Object.keys(user));\n// [\"name\", \"age\"]\n\nconsole.log(Object.entries(user));\n// [[\"name\", \"Rajan\"], [\"age\", 30]]\n```",
        jp: "<b>オブジェクト</b>とは<b>キーと値の組</b>（名前の付いたプロパティとその値）の集まりです。\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n```\n\nここでは `name` と `age` が<b>キー</b>、`\"Rajan\"` と `30` がその値です。\n\n---\n\n### プロパティへのアクセス\n\n• <b>ドット記法</b> — プロパティ名が分かっているとき: `user.name`\n• <b>ブラケット記法</b> — プロパティ名が変数に入っているとき: `user[key]`\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconsole.log(user.name); // Rajan\n\nconst key = \"age\";\nconsole.log(user[key]); // 30\n```\n\n---\n\n### オブジェクトの短縮記法\n\n<b>短縮記法</b>を使うと、変数名とプロパティ名が同じとき `{ name: name, age: age }` の代わりに `{ name, age }` と書けます。\n\n---\n\n### よく使うオブジェクトのメソッド\n\n• `Object.keys()` → すべてのキーを配列で返す\n• `Object.values()` → すべての値を配列で返す\n• `Object.entries()` → キーと値の組を配列で返す\n• `Object.fromEntries()` → キーと値の組をオブジェクトに戻す\n• `Object.freeze()` → トップレベルのプロパティの変更を防ぐ\n• `Object.hasOwn()` → そのオブジェクトが直接そのプロパティを持つか調べる\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconsole.log(Object.keys(user));\n// [\"name\", \"age\"]\n\nconsole.log(Object.entries(user));\n// [[\"name\", \"Rajan\"], [\"age\", 30]]\n```",
      },
      diagram: `Object
│
├── name  → "Rajan"
├── age   → 30
└── role  → "Developer"

Object.keys()
      ↓
["name", "age", "role"]

Object.values()
      ↓
["Rajan", 30, "Developer"]`,
      codeExample: {
        title: { en: "Reading properties and listing them", np: "Property पढ्नु र सूचीबद्ध गर्नु", jp: "プロパティの読み取りと一覧化" },
        code: `const user = {
  name: "Rajan",
  age: 30
};

console.log(user.name); // Rajan

const key = "age";
console.log(user[key]); // 30

console.log(Object.keys(user));
// ["name", "age"]

console.log(Object.entries(user));
// [["name", "Rajan"], ["age", 30]]`,
      },
      keyTakeaways: [
        { en: "Objects store data as <b>key-value pairs</b>.", np: "Object ले data लाई <b>key-value जोडी</b> रूपमा राख्छ।", jp: "オブジェクトはデータを<b>キーと値の組</b>で保存する。" },
        { en: "Use <b>dot notation</b> for known property names.", np: "थाहा भएका property नामका लागि <b>dot notation</b> प्रयोग गर्नुहोस्।", jp: "分かっているプロパティ名には<b>ドット記法</b>を使う。" },
        { en: "Use <b>bracket notation</b> for dynamic property names.", np: "Dynamic property नामका लागि <b>bracket notation</b> प्रयोग गर्नुहोस्।", jp: "動的なプロパティ名には<b>ブラケット記法</b>を使う。" },
        { en: "`Object.keys()`, `values()`, and `entries()` turn object data into arrays.", np: "`Object.keys()`, `values()`, र `entries()` ले object को data लाई array मा बदल्छन्।", jp: "`Object.keys()`・`values()`・`entries()` はオブジェクトのデータを配列に変える。" },
        { en: "`Object.fromEntries()` converts entries back into an object.", np: "`Object.fromEntries()` ले entries लाई फेरि object मा बदल्छ।", jp: "`Object.fromEntries()` はエントリをオブジェクトに戻す。" },
        { en: "`Object.freeze()` prevents changes to top-level properties.", np: "`Object.freeze()` ले top-level property मा परिवर्तन हुनबाट रोक्छ।", jp: "`Object.freeze()` はトップレベルのプロパティの変更を防ぐ。" },
        { en: "`Object.hasOwn()` checks for a property's direct existence.", np: "`Object.hasOwn()` ले property सिधै छ कि छैन जाँच्छ।", jp: "`Object.hasOwn()` はプロパティが直接存在するかを調べる。" },
      ],
      commonMistakes: [
        { en: "<b>Using `user.key` when `key` is a variable</b> — that looks for a property literally named `key`. Use `user[key]` instead.", np: "<b>`key` variable हुँदा `user.key` प्रयोग गर्नु</b> — यसले ठ्याक्कै `key` नामको property खोज्छ। बरु `user[key]` प्रयोग गर्नुहोस्।", jp: "<b>`key` が変数なのに `user.key` と書く</b> — それは文字どおり `key` という名前のプロパティを探す。`user[key]` を使う。" },
        { en: "<b>Assuming objects have `.map()` or `.filter()`</b> — they don't. Convert with `Object.entries()` first, then map over the pairs.", np: "<b>Object सँग `.map()` वा `.filter()` छ भन्ने ठान्नु</b> — छैन। पहिले `Object.entries()` ले बदल्नुहोस्, त्यसपछि जोडीमा map गर्नुहोस्।", jp: "<b>オブジェクトに `.map()` や `.filter()` があると思う</b> — ない。まず `Object.entries()` で変換してから組をmapする。" },
        { en: "<b>Thinking `Object.freeze()` deeply freezes nested objects</b> — it only freezes the top level, so nested objects can still be changed.", np: "<b>`Object.freeze()` ले nested object पनि गहिरो रूपमा freeze गर्छ भन्ने ठान्नु</b> — यसले top level मात्र freeze गर्छ, त्यसैले nested object अझै बदल्न सकिन्छ।", jp: "<b>`Object.freeze()` が入れ子まで凍結すると思う</b> — トップレベルだけを凍結するので、入れ子のオブジェクトは変更できる。" },
      ],
      quiz: [
        {
          question: { en: "How do you access a dynamic property?", np: "Dynamic property कसरी पहुँच गर्नुहुन्छ?", jp: "動的なプロパティにはどうアクセスするか?" },
          options: [
            { en: "`user.key`", np: "`user.key`", jp: "`user.key`" },
            { en: "`user[key]`", np: "`user[key]`", jp: "`user[key]`" },
            { en: "`user->key`", np: "`user->key`", jp: "`user->key`" },
          ],
          correctIndex: 1,
          explanation: { en: "Bracket notation evaluates the variable; dot notation would look for a property literally called `key`.", np: "Bracket notation ले variable evaluate गर्छ; dot notation ले ठ्याक्कै `key` नामको property खोज्छ।", jp: "ブラケット記法は変数を評価する。ドット記法は文字どおり `key` というプロパティを探してしまう。" },
        },
        {
          question: { en: "What does `Object.keys(user)` return?", np: "`Object.keys(user)` ले के फर्काउँछ?", jp: "`Object.keys(user)` は何を返すか?" },
          options: [
            { en: "An array of keys", np: "Key को array", jp: "キーの配列" },
            { en: "An array of values", np: "Value को array", jp: "値の配列" },
            { en: "A new object", np: "नयाँ object", jp: "新しいオブジェクト" },
          ],
          correctIndex: 0,
          explanation: { en: "`Object.values()` gives the values and `Object.entries()` gives both as pairs.", np: "`Object.values()` ले value दिन्छ र `Object.entries()` ले दुबै जोडीमा दिन्छ।", jp: "`Object.values()` は値を、`Object.entries()` は両方を組で返す。" },
        },
        {
          question: { en: "Which method converts entries back into an object?", np: "कुन method ले entries लाई फेरि object मा बदल्छ?", jp: "エントリをオブジェクトに戻すのはどのメソッドか?" },
          options: [
            { en: "`Object.keys()`", np: "`Object.keys()`", jp: "`Object.keys()`" },
            { en: "`Object.entries()`", np: "`Object.entries()`", jp: "`Object.entries()`" },
            { en: "`Object.fromEntries()`", np: "`Object.fromEntries()`", jp: "`Object.fromEntries()`" },
          ],
          correctIndex: 2,
          explanation: { en: "It is the inverse of `Object.entries()`, which is handy after mapping over pairs.", np: "यो `Object.entries()` को उल्टो हो, जो जोडीमा map गरेपछि उपयोगी हुन्छ।", jp: "`Object.entries()` の逆。組をmapした後に便利。" },
        },
      ],
    },
    {
      id: "destructuring-spread-rest",
      title: { en: "Destructuring, Spread & Rest", np: "Destructuring, Spread र Rest", jp: "分割代入・スプレッド・rest" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Destructuring</b> (taking values out of an object or array) lets you get the data you need without accessing each property separately.\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconst { name, age } = user;\n\nconsole.log(name); // Rajan\nconsole.log(age);  // 30\n```\n\nYou can also <b>rename</b> properties and provide <b>default values</b>:\n\n```javascript\nconst { name: userName, country = \"Unknown\" } = user;\n```\n\nWith arrays, destructuring uses the <b>position</b> of each value:\n\n```javascript\nconst numbers = [10, 20, 30];\n\nconst [first, second] = numbers;\n\nconsole.log(first);  // 10\nconsole.log(second); // 20\n```\n\n---\n\n### Spread\n\n<b>Spread</b> (`...`) expands values into a new array or object.\n\n```javascript\nconst user = { name: \"Rajan\", age: 30 };\n\nconst updatedUser = {\n  ...user,\n  age: 31\n};\n\nconsole.log(updatedUser);\n// { name: \"Rajan\", age: 31 }\n```\n\nWhen spreading objects, later properties <b>overwrite</b> earlier ones.\n\n---\n\n### Rest\n\n<b>Rest</b> (`...`) does the opposite of spread — it collects the remaining values into an array.\n\n```javascript\nconst [first, ...rest] = [10, 20, 30, 40];\n\nconsole.log(first); // 10\nconsole.log(rest);  // [20, 30, 40]\n```\n\nThe same idea works with function parameters:\n\n```javascript\nfunction add(...numbers) {\n  return numbers.reduce((sum, n) => sum + n, 0);\n}\n\nconsole.log(add(1, 2, 3)); // 6\n```",
        np: "<b>Destructuring</b> (object वा array बाट value निकाल्नु) ले हरेक property छुट्टै पहुँच नगरी चाहिने data लिन दिन्छ।\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconst { name, age } = user;\n\nconsole.log(name); // Rajan\nconsole.log(age);  // 30\n```\n\nतपाईं property लाई <b>rename</b> गर्न र <b>default value</b> दिन पनि सक्नुहुन्छ:\n\n```javascript\nconst { name: userName, country = \"Unknown\" } = user;\n```\n\nArray सँग, destructuring ले हरेक value को <b>स्थान</b> प्रयोग गर्छ:\n\n```javascript\nconst numbers = [10, 20, 30];\n\nconst [first, second] = numbers;\n\nconsole.log(first);  // 10\nconsole.log(second); // 20\n```\n\n---\n\n### Spread\n\n<b>Spread</b> (`...`) ले value लाई नयाँ array वा object मा फैलाउँछ।\n\n```javascript\nconst user = { name: \"Rajan\", age: 30 };\n\nconst updatedUser = {\n  ...user,\n  age: 31\n};\n\nconsole.log(updatedUser);\n// { name: \"Rajan\", age: 31 }\n```\n\nObject spread गर्दा, पछिका property ले अघिल्लालाई <b>overwrite</b> गर्छन्।\n\n---\n\n### Rest\n\n<b>Rest</b> (`...`) ले spread को उल्टो गर्छ — यसले बाँकी value लाई array मा जम्मा गर्छ।\n\n```javascript\nconst [first, ...rest] = [10, 20, 30, 40];\n\nconsole.log(first); // 10\nconsole.log(rest);  // [20, 30, 40]\n```\n\nयही विचार function parameter सँग पनि काम गर्छ:\n\n```javascript\nfunction add(...numbers) {\n  return numbers.reduce((sum, n) => sum + n, 0);\n}\n\nconsole.log(add(1, 2, 3)); // 6\n```",
        jp: "<b>分割代入（Destructuring）</b>（オブジェクトや配列から値を取り出すこと）を使うと、プロパティを1つずつ参照せずに必要なデータを取り出せます。\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconst { name, age } = user;\n\nconsole.log(name); // Rajan\nconsole.log(age);  // 30\n```\n\nプロパティの<b>名前を変える</b>ことや<b>既定値</b>を与えることもできます:\n\n```javascript\nconst { name: userName, country = \"Unknown\" } = user;\n```\n\n配列では、分割代入は各値の<b>位置</b>を使います:\n\n```javascript\nconst numbers = [10, 20, 30];\n\nconst [first, second] = numbers;\n\nconsole.log(first);  // 10\nconsole.log(second); // 20\n```\n\n---\n\n### スプレッド\n\n<b>スプレッド</b>（`...`）は値を新しい配列やオブジェクトに展開します。\n\n```javascript\nconst user = { name: \"Rajan\", age: 30 };\n\nconst updatedUser = {\n  ...user,\n  age: 31\n};\n\nconsole.log(updatedUser);\n// { name: \"Rajan\", age: 31 }\n```\n\nオブジェクトを展開するとき、後のプロパティが前のものを<b>上書き</b>します。\n\n---\n\n### レスト\n\n<b>レスト</b>（`...`）はスプレッドの逆で、残りの値を配列にまとめます。\n\n```javascript\nconst [first, ...rest] = [10, 20, 30, 40];\n\nconsole.log(first); // 10\nconsole.log(rest);  // [20, 30, 40]\n```\n\n同じ考え方が関数の引数にも使えます:\n\n```javascript\nfunction add(...numbers) {\n  return numbers.reduce((sum, n) => sum + n, 0);\n}\n\nconsole.log(add(1, 2, 3)); // 6\n```",
      },
      diagram: `Destructuring
Object/Array
    ↓
Take values out
    ↓
Variables

Spread
[1, 2, 3]
    ↓  ...
1, 2, 3

Rest
1, 2, 3
    ↓  ...
[1, 2, 3]`,
      codeExample: {
        title: { en: "Destructuring, spread and rest together", np: "Destructuring, spread र rest सँगै", jp: "分割代入・スプレッド・レストをまとめて" },
        code: `const user = { name: "Rajan", age: 30 };

// Destructuring, with a rename and a default
const { name, age } = user;
const { name: userName, country = "Unknown" } = user;

// Array destructuring works by position
const [first, second] = [10, 20, 30];

// Spread expands — later properties win
const updatedUser = { ...user, age: 31 };
console.log(updatedUser); // { name: "Rajan", age: 31 }

// Rest collects the remainder
const [head, ...rest] = [10, 20, 30, 40];
console.log(head); // 10
console.log(rest); // [20, 30, 40]

function add(...numbers) {
  return numbers.reduce((sum, n) => sum + n, 0);
}

console.log(add(1, 2, 3)); // 6`,
      },
      keyTakeaways: [
        { en: "<b>Destructuring</b> takes values out of objects or arrays.", np: "<b>Destructuring</b> ले object वा array बाट value निकाल्छ।", jp: "<b>分割代入</b>はオブジェクトや配列から値を取り出す。" },
        { en: "Object destructuring uses <b>property names</b>.", np: "Object destructuring ले <b>property नाम</b> प्रयोग गर्छ।", jp: "オブジェクトの分割代入は<b>プロパティ名</b>を使う。" },
        { en: "Array destructuring uses <b>position</b>.", np: "Array destructuring ले <b>स्थान</b> प्रयोग गर्छ।", jp: "配列の分割代入は<b>位置</b>を使う。" },
        { en: "<b>Spread</b> (`...`) expands values.", np: "<b>Spread</b> (`...`) ले value फैलाउँछ।", jp: "<b>スプレッド</b>（`...`）は値を展開する。" },
        { en: "<b>Rest</b> (`...`) collects remaining values into an array.", np: "<b>Rest</b> (`...`) ले बाँकी value array मा जम्मा गर्छ।", jp: "<b>レスト</b>（`...`）は残りの値を配列にまとめる。" },
        { en: "With objects, later spread properties overwrite earlier ones.", np: "Object मा, पछिका spread property ले अघिल्लालाई overwrite गर्छन्।", jp: "オブジェクトでは、後に展開したプロパティが前のものを上書きする。" },
        { en: "Rest must be the <b>last item</b> in a destructuring pattern or function parameter list.", np: "Rest destructuring pattern वा function parameter सूचीको <b>अन्तिम item</b> हुनुपर्छ।", jp: "レストは分割代入パターンや引数リストの<b>最後</b>でなければならない。" },
      ],
      commonMistakes: [
        { en: "<b>Confusing spread and rest</b> — they share the `...` syntax, but spread <b>expands</b> values while rest <b>collects</b> them.", np: "<b>Spread र rest भ्रममा पार्नु</b> — दुबैले `...` syntax प्रयोग गर्छन्, तर spread ले value <b>फैलाउँछ</b> जब कि rest ले <b>जम्मा</b> गर्छ।", jp: "<b>スプレッドとレストを混同する</b> — 記法は同じ `...` だが、スプレッドは<b>展開</b>し、レストは<b>まとめる</b>。" },
        { en: "<b>Putting rest before another item</b> — `const [first, ...rest, last] = numbers;` is an error. Rest must come last.", np: "<b>Rest लाई अर्को item अघि राख्नु</b> — `const [first, ...rest, last] = numbers;` error हो। Rest अन्तिममा आउनुपर्छ।", jp: "<b>レストを他の要素の前に置く</b> — `const [first, ...rest, last] = numbers;` はエラー。レストは最後に置く。" },
        { en: "<b>Forgetting that object spread uses the later value</b> — `const user = { age: 30, ...{ age: 31 } };` leaves `user.age` as `31`.", np: "<b>Object spread ले पछिल्लो value लिन्छ भनी बिर्सनु</b> — `const user = { age: 30, ...{ age: 31 } };` ले `user.age` लाई `31` बनाउँछ।", jp: "<b>オブジェクト展開では後の値が勝つことを忘れる</b> — `const user = { age: 30, ...{ age: 31 } };` では `user.age` は `31` になる。" },
      ],
      quiz: [
        {
          question: { en: "What does destructuring do?", np: "Destructuring ले के गर्छ?", jp: "分割代入は何をするか?" },
          options: [
            { en: "Deletes an object", np: "Object मेटाउँछ", jp: "オブジェクトを削除する" },
            { en: "Takes values out of an object or array", np: "Object वा array बाट value निकाल्छ", jp: "オブジェクトや配列から値を取り出す" },
            { en: "Converts an object into a string", np: "Object लाई string मा बदल्छ", jp: "オブジェクトを文字列に変換する" },
          ],
          correctIndex: 1,
          explanation: { en: "Objects destructure by property name, arrays by position.", np: "Object property नामले, array स्थानले destructure हुन्छन्।", jp: "オブジェクトはプロパティ名で、配列は位置で分割代入する。" },
        },
        {
          question: { en: "What does spread (`...`) do?", np: "Spread (`...`) ले के गर्छ?", jp: "スプレッド（`...`）は何をするか?" },
          options: [
            { en: "Collects remaining values", np: "बाँकी value जम्मा गर्छ", jp: "残りの値をまとめる" },
            { en: "Expands values", np: "Value फैलाउँछ", jp: "値を展開する" },
            { en: "Deletes values", np: "Value मेटाउँछ", jp: "値を削除する" },
          ],
          correctIndex: 1,
          explanation: { en: "It copies the items out into a new array or object literal.", np: "यसले item लाई नयाँ array वा object literal मा निकाल्छ।", jp: "要素を新しい配列やオブジェクトリテラルに取り出す。" },
        },
        {
          question: { en: "What does rest (`...`) do?", np: "Rest (`...`) ले के गर्छ?", jp: "レスト（`...`）は何をするか?" },
          options: [
            { en: "Collects remaining values", np: "बाँकी value जम्मा गर्छ", jp: "残りの値をまとめる" },
            { en: "Expands an array", np: "Array फैलाउँछ", jp: "配列を展開する" },
            { en: "Copies only the first value", np: "पहिलो value मात्र copy गर्छ", jp: "最初の値だけをコピーする" },
          ],
          correctIndex: 0,
          explanation: { en: "Whatever is left over after the named items goes into one array.", np: "नाम दिइएका item पछि बाँकी रहेको सबै एउटा array मा जान्छ।", jp: "名前を付けた要素の後に残ったものが1つの配列に入る。" },
        },
        {
          question: { en: "Which must be last?", np: "कुन अन्तिममा हुनुपर्छ?", jp: "最後に置かなければならないのはどれか?" },
          options: [
            { en: "Spread", np: "Spread", jp: "スプレッド" },
            { en: "Rest", np: "Rest", jp: "レスト" },
            { en: "Destructuring", np: "Destructuring", jp: "分割代入" },
          ],
          correctIndex: 1,
          explanation: { en: "Rest has to be final because it swallows everything remaining.", np: "Rest ले बाँकी सबै निल्ने हुनाले यो अन्तिम हुनैपर्छ।", jp: "レストは残りをすべて取り込むので最後でなければならない。" },
        },
      ],
    },
    {
      id: "cloning-shallow-deep",
      title: { en: "Cloning Objects — Shallow vs Deep", np: "Object Cloning — Shallow vs Deep", jp: "オブジェクトのクローン — 浅いvs深い" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>shallow copy</b> (`{...obj}` or `Object.assign({}, obj)`) copies an object's top-level properties by value — but if a property's value is itself an object or array, only the reference is copied, not the data it points to. So the original and the copy end up pointing at the exact same nested object, and mutating it through either one affects both.\n\nA <b>deep clone</b> walks the entire structure and creates brand-new, fully independent copies at every level. `structuredClone()` is the modern, built-in way to do this (Node 17+, all modern browsers) and correctly handles `Date`, `Map`, `Set`, and `RegExp`. Avoid `JSON.parse(JSON.stringify(obj))` for this — it silently drops functions, `undefined` values, and `Symbol` keys, and turns `Date` objects into plain strings.",
        np: "Shallow copy ले top-level properties मात्र value द्वारा copy गर्छ — nested object/array भने अझै same reference रहन्छ। Deep clone ले हरेक level मा independent copy बनाउँछ। `structuredClone()` modern deep clone को लागि उपयोग गर्नुहोस्।",
        jp: "浅いコピーはトップレベルのプロパティのみをコピーする — ネストされたオブジェクト/配列は同じ参照のまま。深いクローンはすべてのレベルで独立したコピーを作る。深いクローンには`structuredClone()`を使う。",
      },
      diagram: `original ──┬── name: "Alice"          (copied BY VALUE — independent)
           └── hobbies: [...] ───┐
                                  │  SAME array reference
shallow = {...original} ──┬── name: "Bob"        (independent copy)
                           └── hobbies: [...] ────┘  ← mutating this affects original too!

deep = structuredClone(original)  →  every level is a brand-new, independent copy`,
      codeExample: {
        title: { en: "Shallow copy vs deep clone — the classic interview question", np: "Shallow copy vs deep clone — classic interview question", jp: "浅いコピーと深いクローン — 定番の面接質問" },
        code: `const original = {
  name: "Alice",
  hobbies: ["reading", "coding"],   // nested reference type
  address: { city: "Kathmandu" },   // another nested object
};

// ── Shallow copy — copies top-level properties only ────────────────
const shallow = { ...original };           // same as Object.assign({}, original)

shallow.name = "Bob";
console.log(original.name);   // "Alice" — top-level is independent, not affected

shallow.hobbies.push("gaming");
console.log(original.hobbies);   // ["reading", "coding", "gaming"] — affected! shared reference

// ── Deep clone — creates a fully independent copy ───────────────────
const deep = structuredClone(original);   // ES2022, Node 17+, modern browsers
deep.address.city = "Pokhara";
console.log(original.address.city);   // "Kathmandu" — NOT affected ✅

// ── Avoid this for deep cloning ──────────────────────────────────────
// const lossy = JSON.parse(JSON.stringify(original));
// loses: functions, undefined values, Symbol keys; Date becomes a string`,
      },
      keyTakeaways: [
        { en: "Spread/`Object.assign` only copy top-level properties — nested objects and arrays remain shared references between the original and the copy.", np: "Spread/`Object.assign` ले top-level properties मात्र copy गर्छ — nested object/array original र copy बीच shared reference नै रहन्छ।", jp: "スプレッド/`Object.assign`はトップレベルのプロパティのみをコピーする。ネストされたオブジェクト/配列は元とコピーの間で共有参照のまま。" },
        { en: "`structuredClone()` is the modern, native way to deep clone — it correctly handles `Date`, `Map`, `Set`, and `RegExp`, unlike the lossy `JSON.parse(JSON.stringify())` trick.", np: "`structuredClone()` modern, native deep clone तरिका हो — यसले `Date`, `Map`, `Set`, `RegExp` सही ढंगले handle गर्छ, lossy `JSON.parse(JSON.stringify())` भन्दा फरक।", jp: "`structuredClone()`は現代的なネイティブの深いクローン手法。`Date`・`Map`・`Set`・`RegExp`を正しく処理する。損失のある`JSON.parse(JSON.stringify())`とは異なる。" },
        { en: "Reach for a deep clone only when you genuinely need to mutate nested data without touching the original — otherwise a cheap shallow copy is simpler and faster.", np: "Original नछोई nested data mutate गर्नुपर्दा मात्र deep clone प्रयोग गर्नुहोस् — अन्यथा shallow copy छिटो र सरल हुन्छ।", jp: "元に触れずにネストされたデータを本当に変更する必要がある場合のみ深いクローンを使う。それ以外は安価な浅いコピーの方が簡単で速い。" },
      ],
      commonMistakes: [
        { en: "Believing `{...obj}` is a full deep copy, then being surprised when mutating a nested array through the copy also changes the original.", np: "`{...obj}` लाई पूर्ण deep copy मान्नु, अनि copy मार्फत nested array mutate गर्दा original पनि बदलिँदा अचम्मित हुनु।", jp: "`{...obj}`が完全な深いコピーだと信じ、コピー経由でネストされた配列を変更すると元も変わることに驚くこと。" },
        { en: "Deep-cloning data that contains `Date` objects, functions, or `undefined` with `JSON.parse(JSON.stringify(x))`, silently corrupting or losing them.", np: "`Date`, function, `undefined` भएको data लाई `JSON.parse(JSON.stringify(x))` ले deep-clone गर्दा silently corrupt/loss हुनु।", jp: "`Date`オブジェクト・関数・`undefined`を含むデータを`JSON.parse(JSON.stringify(x))`で深くクローンし、黙って破損・消失させること。" },
        { en: "Deep-cloning large objects \"just to be safe\" when a shallow copy would have been enough, hurting performance for no real benefit.", np: "Shallow copy नै पर्याप्त हुँदा 'सुरक्षाको लागि' ठूला object deep-clone गर्नु, अनावश्यक performance loss हुनु।", jp: "浅いコピーで十分な場合でも「念のため」大きなオブジェクトを深くクローンし、無駄にパフォーマンスを損なうこと。" },
      ],
      quiz: [
        {
          question: { en: "After `const shallow = {...original}`, if you push a new item to `shallow.hobbies`, what happens to `original.hobbies`?", np: "`const shallow = {...original}` पछि `shallow.hobbies` मा नयाँ item push गर्दा `original.hobbies` मा के हुन्छ?", jp: "`const shallow = {...original}`の後、`shallow.hobbies`に新しい項目をpushすると`original.hobbies`はどうなる？" },
          options: [
            { en: "It stays unaffected — arrays are always copied by value", np: "प्रभाव पर्दैन — array सधैं value द्वारा copy हुन्छ", jp: "影響を受けない — 配列は常に値でコピーされる" },
            { en: "It also changes, because both point to the same array reference", np: "यो पनि बदलिन्छ, किनकि दुवैले same array reference देखाउँछन्", jp: "変わる — 両方が同じ配列参照を指しているため" },
          ],
          correctIndex: 1,
          explanation: { en: "A shallow copy only copies the top-level reference, not a new array — so both variables point at the same underlying array in memory.", np: "Shallow copy ले top-level reference मात्र copy गर्छ, नयाँ array होइन — त्यसैले दुवै variable memory मा same array लाई point गर्छन्।", jp: "浅いコピーはトップレベルの参照のみをコピーし、新しい配列は作らない。そのため両方の変数はメモリ内の同じ配列を指す。" },
        },
        {
          question: { en: "Which method is the modern, preferred way to deep clone an object in JavaScript?", np: "JavaScript मा object deep clone गर्ने modern, preferred तरिका कुन हो?", jp: "JavaScriptでオブジェクトを深くクローンする現代的で推奨される方法は？" },
          options: [
            { en: "`JSON.parse(JSON.stringify(obj))`", np: "`JSON.parse(JSON.stringify(obj))`", jp: "`JSON.parse(JSON.stringify(obj))`" },
            { en: "`structuredClone(obj)`", np: "`structuredClone(obj)`", jp: "`structuredClone(obj)`" },
          ],
          correctIndex: 1,
          explanation: { en: "structuredClone() is built into modern JavaScript and correctly handles Date, Map, Set, and RegExp, which JSON round-tripping cannot.", np: "structuredClone() modern JS मा built-in छ र Date, Map, Set, RegExp सही ढंगले handle गर्छ, JSON round-trip ले सक्दैन।", jp: "structuredClone()はモダンJavaScriptに組み込まれており、Date・Map・Set・RegExpを正しく処理する。JSONの往復変換ではできない。" },
        },
        {
          question: { en: "What does `JSON.parse(JSON.stringify(obj))` lose or corrupt when cloning?", np: "`JSON.parse(JSON.stringify(obj))` ले clone गर्दा के हराउँछ वा corrupt गर्छ?", jp: "`JSON.parse(JSON.stringify(obj))`はクローン時に何を失う、または破損させる？" },
          options: [
            { en: "Nothing — it produces a perfect, lossless clone", np: "केही होइन — यसले perfect, lossless clone दिन्छ", jp: "何も — 完璧で無損失のクローンを生成する" },
            { en: "Functions, `undefined` values, and `Symbol` keys are dropped; `Date` objects become plain strings", np: "Functions, `undefined` values, `Symbol` keys हराउँछ; `Date` objects plain string मा बदलिन्छ", jp: "関数・`undefined`値・`Symbol`キーが失われ、`Date`オブジェクトは文字列になる" },
          ],
          correctIndex: 1,
          explanation: { en: "JSON has no representation for functions, undefined, or symbols, and serializes Date objects as ISO strings instead of Date instances.", np: "JSON मा function, undefined, symbol को कुनै representation छैन, र Date object लाई ISO string को रूपमा serialize गर्छ।", jp: "JSONには関数・undefined・シンボルの表現がなく、DateオブジェクトをインスタンスではなくISO文字列としてシリアライズする。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Which notation must you use when a property key is dynamic or stored in a variable?", np: "Property key dynamic वा variable मा रहेको बेला कुन notation प्रयोग गर्नुपर्छ?", jp: "プロパティキーが動的または変数に格納されている場合、どちらの記法を使うべき？" },
      options: [{ en: "Dot notation", np: "Dot notation", jp: "ドット記法" }, { en: "Bracket notation", np: "Bracket notation", jp: "ブラケット記法" }],
      correctIndex: 1,
      explanation: { en: "Bracket notation evaluates the expression inside it, so it works with variables and computed keys; dot notation only accepts a literal name.", np: "Bracket notation ले भित्रको expression evaluate गर्छ, त्यसैले variable सँग काम गर्छ।", jp: "ブラケット記法は内部の式を評価するため変数でも機能する。" },
    },
    {
      question: { en: "Does `Object.freeze()` deep-freeze nested objects inside the frozen object?", np: "`Object.freeze()` ले frozen object भित्रका nested objects पनि deep-freeze गर्छ?", jp: "`Object.freeze()`は凍結されたオブジェクト内のネストされたオブジェクトも深く凍結する？" },
      options: [{ en: "Yes, everything nested is frozen too", np: "हो, nested सबै पनि freeze हुन्छ", jp: "はい、ネストされたものもすべて凍結される" }, { en: "No — only top-level properties are frozen", np: "होइन — top-level properties मात्र freeze हुन्छ", jp: "いいえ — トップレベルのプロパティのみ凍結される" }],
      correctIndex: 1,
      explanation: { en: "Object.freeze() is shallow; nested structures need to be frozen individually to be fully immutable.", np: "Object.freeze() shallow हो; nested structure लाई पूर्ण immutable बनाउन individually freeze गर्नुपर्छ।", jp: "Object.freeze()は浅い。完全に不変にするにはネストされた構造を個別に凍結する必要がある。" },
    },
    {
      question: { en: "What's the difference between `\"key\" in obj` and `Object.hasOwn(obj, \"key\")`?", np: "`\"key\" in obj` र `Object.hasOwn(obj, \"key\")` मा के फरक छ?", jp: "`\"key\" in obj`と`Object.hasOwn(obj, \"key\")`の違いは？" },
      options: [{ en: "No difference", np: "फरक छैन", jp: "違いはない" }, { en: "`in` also checks inherited properties; `hasOwn` checks only own properties", np: "`in` ले inherited properties पनि check गर्छ; `hasOwn` ले आफ्नै properties मात्र check गर्छ", jp: "`in`は継承プロパティも確認する。`hasOwn`は自身のプロパティのみ確認する" }],
      correctIndex: 1,
      explanation: { en: "`in` walks the prototype chain; Object.hasOwn is the precise own-property check.", np: "`in` ले prototype chain walk गर्छ; Object.hasOwn precise own-property check हो।", jp: "`in`はプロトタイプチェーンを遡る。Object.hasOwnは正確な自己プロパティ確認。" },
    },
    {
      question: { en: "In `const { country = \"Unknown\" } = user`, when does the default value `\"Unknown\"` get used?", np: "`const { country = \"Unknown\" } = user` मा default value `\"Unknown\"` कहिले प्रयोग हुन्छ?", jp: "`const { country = \"Unknown\" } = user`でデフォルト値`\"Unknown\"`はいつ使われる？" },
      options: [{ en: "Whenever `user.country` is exactly `undefined`", np: "`user.country` ठ्याक्कै `undefined` भएमा", jp: "`user.country`がまさに`undefined`のとき" }, { en: "Only if the `user` object is completely empty", np: "`user` object पूर्ण खाली भएमा मात्र", jp: "`user`オブジェクトが完全に空の場合のみ" }],
      correctIndex: 0,
      explanation: { en: "Destructuring defaults trigger whenever the extracted value is undefined, regardless of why.", np: "Extract भएको value undefined भएमा जुनसुकै कारणले पनि default trigger हुन्छ।", jp: "分割代入のデフォルトは、抽出された値がundefinedであれば理由を問わず発動する。" },
    },
    {
      question: { en: "Is `...` for spread and `...` for rest the same operation?", np: "Spread को `...` र rest को `...` उस्तै operation हो?", jp: "スプレッドの`...`とrestの`...`は同じ操作？" },
      options: [{ en: "Yes, always identical", np: "हो, सधैं उस्तै", jp: "はい、常に同一" }, { en: "No — spread expands an iterable, rest collects remaining values into one", np: "होइन — spread ले फिँजाउँछ, rest ले बाँकीलाई एकमा collect गर्छ", jp: "いいえ — スプレッドは展開し、restは残りを1つに集める" }],
      correctIndex: 1,
      explanation: { en: "Same syntax, opposite direction: spread pulls values out into a new structure, rest gathers loose values into an array.", np: "Syntax उस्तै तर विपरीत दिशा: spread ले value बाहिर निकाल्छ, rest ले array मा जम्मा गर्छ।", jp: "同じ構文だが逆方向: スプレッドは値を取り出し、restは配列に集める。" },
    },
    {
      question: { en: "Does `{...obj1, ...obj2}` create fully independent nested objects?", np: "`{...obj1, ...obj2}` ले पूर्ण independent nested objects बनाउँछ?", jp: "`{...obj1, ...obj2}`は完全に独立したネストされたオブジェクトを作る？" },
      options: [{ en: "Yes, at every level", np: "हो, हरेक level मा", jp: "はい、すべてのレベルで" }, { en: "No — only the top level is new; nested objects/arrays are still shared", np: "होइन — top level मात्र नयाँ हो; nested objects/arrays अझै shared छन्", jp: "いいえ — トップレベルのみ新規で、ネストされたオブジェクト/配列は共有されたまま" }],
      correctIndex: 1,
      explanation: { en: "Spread is a shallow-copy operation, just like Object.assign.", np: "Spread एक shallow-copy operation हो, Object.assign जस्तै।", jp: "スプレッドはObject.assignと同様の浅いコピー操作。" },
    },
    {
      question: { en: "After a shallow copy, does mutating a nested array through the copy affect the original?", np: "Shallow copy पछि copy मार्फत nested array mutate गर्दा original प्रभावित हुन्छ?", jp: "浅いコピー後、コピー経由でネストされた配列を変更すると元は影響を受ける？" },
      options: [{ en: "Yes — the nested array reference is shared", np: "हो — nested array reference shared हुन्छ", jp: "はい — ネストされた配列の参照は共有されている" }, { en: "No — every level is independent", np: "होइन — हरेक level independent छ", jp: "いいえ — すべてのレベルが独立している" }],
      correctIndex: 0,
      explanation: { en: "Only top-level values are copied by a shallow copy; nested references remain shared.", np: "Shallow copy ले top-level values मात्र copy गर्छ; nested references shared नै रहन्छ।", jp: "浅いコピーはトップレベルの値のみをコピーし、ネストされた参照は共有されたまま。" },
    },
    {
      question: { en: "Which is the modern, preferred way to deep clone an object with Dates and Maps inside it?", np: "Dates र Maps भएको object deep clone गर्ने modern, preferred तरिका कुन हो?", jp: "DateとMapを含むオブジェクトを深くクローンする現代的で推奨される方法は？" },
      options: [{ en: "`structuredClone(obj)`", np: "`structuredClone(obj)`", jp: "`structuredClone(obj)`" }, { en: "`JSON.parse(JSON.stringify(obj))`", np: "`JSON.parse(JSON.stringify(obj))`", jp: "`JSON.parse(JSON.stringify(obj))`" }],
      correctIndex: 0,
      explanation: { en: "structuredClone() correctly preserves Date and Map instances; JSON round-tripping corrupts or loses them.", np: "structuredClone() ले Date र Map instances सही ढंगले preserve गर्छ; JSON round-trip ले corrupt/loss गराउँछ।", jp: "structuredClone()はDateとMapのインスタンスを正しく保持する。JSONの往復変換は破損・消失させる。" },
    },
    {
      question: { en: "Why should you avoid `JSON.parse(JSON.stringify(obj))` for deep cloning objects with functions?", np: "Function भएको object deep clone गर्दा `JSON.parse(JSON.stringify(obj))` किन avoid गर्नुपर्छ?", jp: "関数を含むオブジェクトを深くクローンする際に`JSON.parse(JSON.stringify(obj))`を避けるべき理由は？" },
      options: [{ en: "It's too slow to matter in practice", np: "यो व्यवहारमा धेरै ढिलो हुन्छ", jp: "実際には遅すぎて問題にならない" }, { en: "JSON has no representation for functions — they are silently dropped", np: "JSON मा function को कुनै representation छैन — silently हराउन्छ", jp: "JSONには関数の表現がなく、黙って削除される" }],
      correctIndex: 1,
      explanation: { en: "JSON.stringify simply omits function-valued properties entirely, along with undefined and Symbol keys.", np: "JSON.stringify ले function-valued properties लाई पूर्ण रूपमा omit गर्छ, undefined र Symbol keys सँगै।", jp: "JSON.stringifyは関数値のプロパティをundefinedやSymbolキーとともに完全に省略する。" },
    },
  ],
};
