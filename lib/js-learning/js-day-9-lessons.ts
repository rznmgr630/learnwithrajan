import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_9_LESSONS: JsLessonDay = {
  day: 9,
  title: { en: "Strings, Template Literals & Unicode", np: "Strings, Template Literals र Unicode", jp: "文字列・テンプレートリテラル・Unicode" },
  totalMinutes: 27,
  difficulty: { en: "Intermediate", np: "Intermediate", jp: "中級" },
  lessons: [
    {
      id: "strings-immutability",
      title: { en: "Strings & Immutability", np: "Strings र Immutability", jp: "文字列とイミュータビリティ" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>string</b> is a sequence of text characters. JavaScript strings are <b>immutable</b>, meaning string methods never change the original string — they return a new string.\n\n```javascript\nconst name = \"Rajan\";\n\nname.toUpperCase();\n\nconsole.log(name); // \"Rajan\"\n```\n\n---\n\n### Methods you should know\n\n```javascript\nconst text = \"Hello JavaScript\";\n\ntext.slice(0, 5);                // \"Hello\"\ntext.split(\" \");                 // [\"Hello\", \"JavaScript\"]\ntext.padStart(20, \"-\");          // \"----Hello JavaScript\"\ntext.replaceAll(\"Java\", \"Type\"); // \"Hello TypeScript\"\ntext.trim();                     // removes whitespace\ntext.at(-1);                     // \"t\"\n```\n\n<b>Key idea:</b> `slice()` creates a new string; it doesn't modify the original.\n\n---\n\n### 1. Basic — chaining returns new strings\n\n```javascript\nconst username = \"  rajan  \";\n\nconst result = username\n  .trim()\n  .toUpperCase();\n\nconsole.log(result);   // \"RAJAN\"\nconsole.log(username); // \"  rajan  \" — untouched\n```\n\nEach call hands back a fresh string, so the original variable is never rewritten.\n\n---\n\n### 2. Intermediate — `at()` and negative indexes\n\n```javascript\nconst text = \"Hello\";\n\nconsole.log(text.at(0));  // \"H\"\nconsole.log(text.at(-1)); // \"o\"\n```\n\n`at()` accepts negative positions, which `text[-1]` cannot do.\n\n---\n\n### 3. Advanced — building a small transformation\n\n```javascript\nconst raw = \"  hello javascript world  \";\n\nconst title = raw\n  .trim()\n  .split(\" \")\n  .map(word => word.at(0).toUpperCase() + word.slice(1))\n  .join(\" \");\n\nconsole.log(title); // \"Hello Javascript World\"\n```\n\nNothing here mutates `raw`; each step passes a new value along.",
        np: "<b>String</b> पाठ अक्षरहरूको क्रम हो। JavaScript का string <b>immutable</b> हुन्छन्, अर्थात् string method ले मूल string कहिल्यै बदल्दैनन् — तिनले नयाँ string फर्काउँछन्।\n\n```javascript\nconst name = \"Rajan\";\n\nname.toUpperCase();\n\nconsole.log(name); // \"Rajan\"\n```\n\n---\n\n### थाहा हुनुपर्ने method\n\n```javascript\nconst text = \"Hello JavaScript\";\n\ntext.slice(0, 5);                // \"Hello\"\ntext.split(\" \");                 // [\"Hello\", \"JavaScript\"]\ntext.padStart(20, \"-\");          // \"----Hello JavaScript\"\ntext.replaceAll(\"Java\", \"Type\"); // \"Hello TypeScript\"\ntext.trim();                     // removes whitespace\ntext.at(-1);                     // \"t\"\n```\n\n<b>मुख्य विचार:</b> `slice()` ले नयाँ string बनाउँछ; मूललाई बदल्दैन।\n\n---\n\n### 1. आधारभूत — chain गर्दा नयाँ string आउँछ\n\n```javascript\nconst username = \"  rajan  \";\n\nconst result = username\n  .trim()\n  .toUpperCase();\n\nconsole.log(result);   // \"RAJAN\"\nconsole.log(username); // \"  rajan  \" — untouched\n```\n\nहरेक call ले नयाँ string फर्काउँछ, त्यसैले मूल variable कहिल्यै पुनर्लेखन हुँदैन।\n\n---\n\n### 2. मध्यम — `at()` र ऋणात्मक index\n\n```javascript\nconst text = \"Hello\";\n\nconsole.log(text.at(0));  // \"H\"\nconsole.log(text.at(-1)); // \"o\"\n```\n\n`at()` ले ऋणात्मक स्थान स्वीकार गर्छ, जुन `text[-1]` ले सक्दैन।\n\n---\n\n### 3. उन्नत — सानो रूपान्तरण बनाउनु\n\n```javascript\nconst raw = \"  hello javascript world  \";\n\nconst title = raw\n  .trim()\n  .split(\" \")\n  .map(word => word.at(0).toUpperCase() + word.slice(1))\n  .join(\" \");\n\nconsole.log(title); // \"Hello Javascript World\"\n```\n\nयहाँ केहीले पनि `raw` लाई mutate गर्दैन; हरेक चरणले नयाँ value अगाडि पठाउँछ।",
        jp: "<b>文字列</b>はテキストの文字の並びです。JavaScriptの文字列は<b>イミュータブル</b>で、文字列メソッドは元の文字列を決して変えず、新しい文字列を返します。\n\n```javascript\nconst name = \"Rajan\";\n\nname.toUpperCase();\n\nconsole.log(name); // \"Rajan\"\n```\n\n---\n\n### 知っておきたいメソッド\n\n```javascript\nconst text = \"Hello JavaScript\";\n\ntext.slice(0, 5);                // \"Hello\"\ntext.split(\" \");                 // [\"Hello\", \"JavaScript\"]\ntext.padStart(20, \"-\");          // \"----Hello JavaScript\"\ntext.replaceAll(\"Java\", \"Type\"); // \"Hello TypeScript\"\ntext.trim();                     // removes whitespace\ntext.at(-1);                     // \"t\"\n```\n\n<b>要点:</b> `slice()` は新しい文字列を作り、元は変えません。\n\n---\n\n### 1. 基本 — チェーンは新しい文字列を返す\n\n```javascript\nconst username = \"  rajan  \";\n\nconst result = username\n  .trim()\n  .toUpperCase();\n\nconsole.log(result);   // \"RAJAN\"\nconsole.log(username); // \"  rajan  \" — untouched\n```\n\n各呼び出しが新しい文字列を返すので、元の変数は書き換わりません。\n\n---\n\n### 2. 中級 — `at()` と負の添字\n\n```javascript\nconst text = \"Hello\";\n\nconsole.log(text.at(0));  // \"H\"\nconsole.log(text.at(-1)); // \"o\"\n```\n\n`at()` は負の位置を受け取れます。`text[-1]` ではできません。\n\n---\n\n### 3. 上級 — 小さな変換を組み立てる\n\n```javascript\nconst raw = \"  hello javascript world  \";\n\nconst title = raw\n  .trim()\n  .split(\" \")\n  .map(word => word.at(0).toUpperCase() + word.slice(1))\n  .join(\" \");\n\nconsole.log(title); // \"Hello Javascript World\"\n```\n\n`raw` は一切変更されません。各段階が新しい値を次へ渡します。",
      },
      diagram: `const name = "Rajan"

name.toUpperCase()
        ↓
   new string "RAJAN"
        ↓
   name is still "Rajan"


slice(a, b)      part of a string       → new string
split(sep)       string  → array
trim()           strip whitespace       → new string
padStart(n, ch)  pad the front          → new string
replaceAll(a, b) swap every match       → new string
at(i)            one character, i may be negative`,
      codeExample: {
        title: { en: "Methods that return, never mutate", np: "फर्काउने method, mutate नगर्ने", jp: "変更せず返すメソッド" },
        code: `// ── 1. Basic — methods return new strings ─────────────────────────
const username = "  rajan  ";

const result = username.trim().toUpperCase();

console.log(result);   // "RAJAN"
console.log(username); // "  rajan  " — the original is untouched

// ── 2. Intermediate — the everyday method set ─────────────────────
const text = "Hello JavaScript";

console.log(text.slice(0, 5));                // "Hello"
console.log(text.split(" "));                 // ["Hello", "JavaScript"]
console.log(text.replaceAll("Java", "Type")); // "Hello TypeScript"
console.log(text.padStart(20, "-"));          // "----Hello JavaScript"
console.log(text.at(-1));                     // "t"

// ── 3. Advanced — a chain that never mutates its input ────────────
const raw = "  hello javascript world  ";

const title = raw
  .trim()
  .split(" ")
  .map(word => word.at(0).toUpperCase() + word.slice(1))
  .join(" ");

console.log(title); // "Hello Javascript World"
console.log(raw);   // unchanged`,
      },
      keyTakeaways: [
        { en: "JavaScript strings are <b>immutable</b> — methods return new strings and never edit the original.", np: "JavaScript का string <b>immutable</b> हुन्छन् — method ले नयाँ string फर्काउँछन्, मूललाई कहिल्यै सम्पादन गर्दैनन्।", jp: "JavaScriptの文字列は<b>イミュータブル</b>。メソッドは新しい文字列を返し、元は編集しない。" },
        { en: "`slice()` takes a part of a string; `split()` turns one into an array.", np: "`slice()` ले string को भाग लिन्छ; `split()` ले यसलाई array मा बदल्छ।", jp: "`slice()` は文字列の一部を取り、`split()` は配列に変える。" },
        { en: "`trim()`, `padStart()` and `replaceAll()` all hand back fresh strings too.", np: "`trim()`, `padStart()` र `replaceAll()` ले पनि नयाँ string नै फर्काउँछन्।", jp: "`trim()`・`padStart()`・`replaceAll()` もすべて新しい文字列を返す。" },
        { en: "`at()` reads one character and accepts <b>negative indexes</b>, unlike bracket access.", np: "`at()` ले एउटा अक्षर पढ्छ र bracket पहुँच भन्दा फरक <b>ऋणात्मक index</b> स्वीकार गर्छ।", jp: "`at()` は1文字を読み、ブラケット記法と違って<b>負の添字</b>を受け取れる。" },
        { en: "Chaining string methods is safe precisely because each step returns a new value.", np: "String method chain गर्नु सुरक्षित छ किनकि हरेक चरणले नयाँ value फर्काउँछ।", jp: "各段階が新しい値を返すからこそ、文字列メソッドの連鎖は安全。" },
      ],
      commonMistakes: [
        { en: "<b>Expecting a method to change the string in place</b> — `name.toUpperCase();` on its own does nothing visible. Assign the result: `const upper = name.toUpperCase();`.", np: "<b>Method ले string लाई त्यहीँ बदल्छ भन्ने आशा गर्नु</b> — `name.toUpperCase();` एक्लै केही देखिने काम गर्दैन। नतिजा assign गर्नुहोस्: `const upper = name.toUpperCase();`।", jp: "<b>メソッドが文字列をその場で変えると思う</b> — `name.toUpperCase();` だけでは何も起きない。結果を代入する: `const upper = name.toUpperCase();`。" },
        { en: "<b>Using `text[-1]` to read the last character</b> — that is `undefined`. Use `text.at(-1)`.", np: "<b>अन्तिम अक्षर पढ्न `text[-1]` प्रयोग गर्नु</b> — त्यो `undefined` हो। `text.at(-1)` प्रयोग गर्नुहोस्।", jp: "<b>最後の文字を `text[-1]` で読む</b> — それは `undefined`。`text.at(-1)` を使う。" },
        { en: "<b>Reaching for `replace()` when you mean every match</b> — `replace()` with a plain string swaps only the first one. Use `replaceAll()`.", np: "<b>हरेक match भन्न खोज्दा `replace()` प्रयोग गर्नु</b> — साधारण string सँग `replace()` ले पहिलो मात्र बदल्छ। `replaceAll()` प्रयोग गर्नुहोस्।", jp: "<b>すべての一致のつもりで `replace()` を使う</b> — 文字列を渡した `replace()` は最初の1つだけ置換する。`replaceAll()` を使う。" },
      ],
      quiz: [
        {
          question: { en: "What does `name.toUpperCase()` do to `name`?", np: "`name.toUpperCase()` ले `name` लाई के गर्छ?", jp: "`name.toUpperCase()` は `name` に何をするか?" },
          options: [
            { en: "Nothing — it returns a new string", np: "केही होइन — यसले नयाँ string फर्काउँछ", jp: "何もしない。新しい文字列を返す" },
            { en: "Changes it in place", np: "यसलाई त्यहीँ बदल्छ", jp: "その場で変更する" },
            { en: "Deletes it", np: "यसलाई मेटाउँछ", jp: "削除する" },
          ],
          correctIndex: 0,
          explanation: { en: "Strings are immutable, so you have to keep the returned value.", np: "String immutable हुन्छन्, त्यसैले फर्काइएको value राख्नुपर्छ।", jp: "文字列はイミュータブルなので、返り値を受け取る必要がある。" },
        },
        {
          question: { en: "Which method reads the last character of a string?", np: "String को अन्तिम अक्षर कुन method ले पढ्छ?", jp: "文字列の最後の1文字を読むメソッドは?" },
          options: [
            { en: "`text[-1]`", np: "`text[-1]`", jp: "`text[-1]`" },
            { en: "`text.at(-1)`", np: "`text.at(-1)`", jp: "`text.at(-1)`" },
            { en: "`text.last()`", np: "`text.last()`", jp: "`text.last()`" },
          ],
          correctIndex: 1,
          explanation: { en: "Bracket access does not understand negative positions and gives `undefined`.", np: "Bracket पहुँचले ऋणात्मक स्थान बुझ्दैन र `undefined` दिन्छ।", jp: "ブラケット記法は負の位置を理解できず `undefined` になる。" },
        },
        {
          question: { en: "Which method replaces every occurrence of a substring?", np: "कुन method ले substring का हरेक घटना बदल्छ?", jp: "部分文字列のすべての出現を置換するメソッドは?" },
          options: [
            { en: "`replace()`", np: "`replace()`", jp: "`replace()`" },
            { en: "`split()`", np: "`split()`", jp: "`split()`" },
            { en: "`replaceAll()`", np: "`replaceAll()`", jp: "`replaceAll()`" },
          ],
          correctIndex: 2,
          explanation: { en: "`replace()` with a plain string only swaps the first match.", np: "साधारण string सँग `replace()` ले पहिलो match मात्र बदल्छ।", jp: "文字列を渡した `replace()` は最初の一致だけを置き換える。" },
        },
      ],
    },
    {
      id: "template-literals",
      title: { en: "Template Literals & Tagged Templates", np: "Template Literals र Tagged Templates", jp: "テンプレートリテラルとタグ付きテンプレート" },
      durationMinutes: 9,
      explanation: {
        en: "Template literals use backticks and allow <b>expression interpolation</b>, multiline strings, and cleaner dynamic text.\n\n```javascript\nconst name = \"Rajan\";\nconst age = 29;\n\nconst message = `My name is ${name} and I am ${age} years old.`;\n\nconsole.log(message);\n```\n\n---\n\n### Multiline\n\n```javascript\nconst message = `\nHello Rajan,\nWelcome to JavaScript.\nGood luck with your learning!\n`;\n```\n\n---\n\n### Expressions\n\n```javascript\nconst price = 100;\nconst quantity = 3;\n\nconsole.log(`Total: $${price * quantity}`);\n```\n\nInstead of `\"Total: $\" + price * quantity`.\n\n---\n\n### Tagged templates\n\nA <b>tagged template</b> lets a function process a template literal before the final string is created.\n\n```javascript\nfunction tag(strings, ...values) {\n  console.log(strings);\n  console.log(values);\n}\n\nconst name = \"Rajan\";\n\ntag`Hello ${name}!`;\n```\n\nThe tag receives:\n\n• the static pieces of the template\n• the interpolated values\n\n---\n\n### Practical example: HTML escaping\n\n```javascript\nfunction escapeHTML(strings, ...values) {\n  return strings.reduce((result, string, i) => {\n    const value = values[i - 1];\n\n    const escaped = String(value ?? \"\")\n      .replaceAll(\"&\", \"&amp;\")\n      .replaceAll(\"<\", \"&lt;\")\n      .replaceAll(\">\", \"&gt;\")\n      .replaceAll('\"', \"&quot;\");\n\n    return result + escaped + string;\n  });\n}\n\nconst username = \"<script>alert('xss')</script>\";\n\nconst html = escapeHTML`<h1>Hello ${username}</h1>`;\n\nconsole.log(html);\n```\n\nThe important idea is that tagged templates can <b>transform or validate interpolated data</b> before using it.\n\n> In real applications, use a well-tested HTML or template library for security-sensitive escaping rather than building your own.",
        np: "Template literal ले backtick प्रयोग गर्छन् र <b>expression interpolation</b>, multiline string, र सफा dynamic text दिन्छन्।\n\n```javascript\nconst name = \"Rajan\";\nconst age = 29;\n\nconst message = `My name is ${name} and I am ${age} years old.`;\n\nconsole.log(message);\n```\n\n---\n\n### Multiline\n\n```javascript\nconst message = `\nHello Rajan,\nWelcome to JavaScript.\nGood luck with your learning!\n`;\n```\n\n---\n\n### Expression\n\n```javascript\nconst price = 100;\nconst quantity = 3;\n\nconsole.log(`Total: $${price * quantity}`);\n```\n\n`\"Total: $\" + price * quantity` को साटो।\n\n---\n\n### Tagged template\n\n<b>Tagged template</b> ले अन्तिम string बन्नुअघि function लाई template literal process गर्न दिन्छ।\n\n```javascript\nfunction tag(strings, ...values) {\n  console.log(strings);\n  console.log(values);\n}\n\nconst name = \"Rajan\";\n\ntag`Hello ${name}!`;\n```\n\nTag ले पाउँछ:\n\n• Template का स्थिर टुक्रा\n• Interpolate गरिएका value\n\n---\n\n### व्यावहारिक उदाहरण: HTML escaping\n\n```javascript\nfunction escapeHTML(strings, ...values) {\n  return strings.reduce((result, string, i) => {\n    const value = values[i - 1];\n\n    const escaped = String(value ?? \"\")\n      .replaceAll(\"&\", \"&amp;\")\n      .replaceAll(\"<\", \"&lt;\")\n      .replaceAll(\">\", \"&gt;\")\n      .replaceAll('\"', \"&quot;\");\n\n    return result + escaped + string;\n  });\n}\n\nconst username = \"<script>alert('xss')</script>\";\n\nconst html = escapeHTML`<h1>Hello ${username}</h1>`;\n\nconsole.log(html);\n```\n\nमहत्वपूर्ण विचार यो हो कि tagged template ले प्रयोग गर्नुअघि <b>interpolate गरिएको data रूपान्तरण वा प्रमाणित</b> गर्न सक्छ।\n\n> वास्तविक application मा, सुरक्षा-संवेदनशील escaping का लागि आफैं बनाउनुको साटो राम्ररी परीक्षण गरिएको HTML वा template library प्रयोग गर्नुहोस्।",
        jp: "テンプレートリテラルはバッククォートを使い、<b>式の埋め込み</b>・複数行の文字列・すっきりした動的テキストを可能にします。\n\n```javascript\nconst name = \"Rajan\";\nconst age = 29;\n\nconst message = `My name is ${name} and I am ${age} years old.`;\n\nconsole.log(message);\n```\n\n---\n\n### 複数行\n\n```javascript\nconst message = `\nHello Rajan,\nWelcome to JavaScript.\nGood luck with your learning!\n`;\n```\n\n---\n\n### 式\n\n```javascript\nconst price = 100;\nconst quantity = 3;\n\nconsole.log(`Total: $${price * quantity}`);\n```\n\n`\"Total: $\" + price * quantity` の代わりに書けます。\n\n---\n\n### タグ付きテンプレート\n\n<b>タグ付きテンプレート</b>を使うと、最終的な文字列が作られる前に関数がテンプレートリテラルを処理できます。\n\n```javascript\nfunction tag(strings, ...values) {\n  console.log(strings);\n  console.log(values);\n}\n\nconst name = \"Rajan\";\n\ntag`Hello ${name}!`;\n```\n\nタグ関数が受け取るのは:\n\n• テンプレートの静的な部分\n• 埋め込まれた値\n\n---\n\n### 実用例: HTMLのエスケープ\n\n```javascript\nfunction escapeHTML(strings, ...values) {\n  return strings.reduce((result, string, i) => {\n    const value = values[i - 1];\n\n    const escaped = String(value ?? \"\")\n      .replaceAll(\"&\", \"&amp;\")\n      .replaceAll(\"<\", \"&lt;\")\n      .replaceAll(\">\", \"&gt;\")\n      .replaceAll('\"', \"&quot;\");\n\n    return result + escaped + string;\n  });\n}\n\nconst username = \"<script>alert('xss')</script>\";\n\nconst html = escapeHTML`<h1>Hello ${username}</h1>`;\n\nconsole.log(html);\n```\n\n大事なのは、タグ付きテンプレートが使用前に<b>埋め込まれたデータを変換・検証できる</b>という点です。\n\n> 実際のアプリケーションでは、セキュリティに関わるエスケープは自作せず、十分に検証されたHTML・テンプレートライブラリを使ってください。",
      },
      diagram: `\`Hello \${name}!\`
        │
        ├── static pieces:  ["Hello ", "!"]
        └── values:         ["Rajan"]

Plain template literal
        ↓
JavaScript joins them
        ↓
      "Hello Rajan!"


Tagged template
        ↓
tag(strings, ...values)
        ↓
your function decides the result`,
      codeExample: {
        title: { en: "Interpolation, then a tag that intercepts it", np: "Interpolation, अनि यसलाई समात्ने tag", jp: "埋め込みと、それを受け取るタグ" },
        code: `// ── 1. Basic — interpolation and multiline ────────────────────────
const name = "Rajan";
const age = 29;

console.log(\`My name is \${name} and I am \${age} years old.\`);

const letter = \`
Hello Rajan,
Welcome to JavaScript.
\`;

// ── 2. Intermediate — any expression fits inside \${} ──────────────
const price = 100;
const quantity = 3;

console.log(\`Total: $\${price * quantity}\`); // "Total: $300"

// ── 3. Advanced — a tag receives the pieces and the values ────────
function tag(strings, ...values) {
  console.log(strings); // ["Hello ", "!"]
  console.log(values);  // ["Rajan"]
}

tag\`Hello \${name}!\`;

// A tag can transform what was interpolated before it lands in the output
function escapeHTML(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const escaped = String(values[i - 1] ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

    return result + escaped + string;
  });
}

const username = "<script>alert('xss')</script>";

console.log(escapeHTML\`<h1>Hello \${username}</h1>\`);`,
      },
      keyTakeaways: [
        { en: "Template literals use backticks and <b>`${}` interpolation</b> instead of string concatenation.", np: "Template literal ले string जोड्नुको साटो backtick र <b>`${}` interpolation</b> प्रयोग गर्छन्।", jp: "テンプレートリテラルは文字列連結の代わりにバッククォートと<b>`${}` の埋め込み</b>を使う。" },
        { en: "They keep <b>multiline</b> text readable without `\\n` escapes.", np: "तिनले `\\n` escape बिना <b>multiline</b> पाठ पढ्न सजिलो राख्छन्।", jp: "`\\n` を使わずに<b>複数行</b>のテキストを読みやすく保てる。" },
        { en: "Any expression works inside `${}`, including arithmetic and function calls.", np: "`${}` भित्र जुनसुकै expression काम गर्छ, गणित र function call समेत।", jp: "`${}` の中では計算や関数呼び出しを含め、どんな式でも使える。" },
        { en: "A <b>tagged template</b> passes the static pieces and the values to a function.", np: "<b>Tagged template</b> ले स्थिर टुक्रा र value लाई function मा पठाउँछ।", jp: "<b>タグ付きテンプレート</b>は静的な部分と値を関数に渡す。" },
        { en: "Tags can <b>transform or validate</b> interpolated data before it reaches the output.", np: "Tag ले interpolate गरिएको data output मा पुग्नुअघि <b>रूपान्तरण वा प्रमाणित</b> गर्न सक्छ।", jp: "タグは埋め込まれたデータが出力に届く前に<b>変換・検証</b>できる。" },
        { en: "For security-sensitive escaping, prefer a well-tested library over a hand-written tag.", np: "सुरक्षा-संवेदनशील escaping का लागि, हातले लेखिएको tag भन्दा राम्ररी परीक्षण गरिएको library रोज्नुहोस्।", jp: "セキュリティに関わるエスケープは、手書きのタグより実績あるライブラリを使う。" },
      ],
      commonMistakes: [
        { en: "<b>Using quotes instead of backticks</b> — `\"Hello ${name}\"` prints the `${name}` literally. Interpolation only works inside backticks.", np: "<b>Backtick को साटो quote प्रयोग गर्नु</b> — `\"Hello ${name}\"` ले `${name}` जस्ताको तस्तै देखाउँछ। Interpolation backtick भित्र मात्र काम गर्छ।", jp: "<b>バッククォートの代わりに引用符を使う</b> — `\"Hello ${name}\"` は `${name}` をそのまま出力する。埋め込みはバッククォートの中だけ。" },
        { en: "<b>Calling a tag with parentheses</b> — a tagged template is written `tag`Hello ${name}`` with no parentheses; `tag(`Hello`)` is an ordinary call.", np: "<b>Tag लाई कोष्ठक सहित call गर्नु</b> — tagged template `tag`Hello ${name}`` भनी कोष्ठक बिना लेखिन्छ; `tag(`Hello`)` सामान्य call हो।", jp: "<b>タグを括弧付きで呼ぶ</b> — タグ付きテンプレートは括弧なしで `tag`Hello ${name}`` と書く。`tag(`Hello`)` は普通の呼び出し。" },
        { en: "<b>Trusting interpolated user input in HTML</b> — a template literal does not escape anything. Escape deliberately, ideally with a tested library.", np: "<b>HTML मा interpolate गरिएको user input भरोसा गर्नु</b> — template literal ले केही escape गर्दैन। जानाजान escape गर्नुहोस्, राम्रो त परीक्षण गरिएको library ले।", jp: "<b>HTMLに埋め込むユーザー入力を信用する</b> — テンプレートリテラルは何もエスケープしない。意識的に、できれば実績あるライブラリでエスケープする。" },
      ],
      quiz: [
        {
          question: { en: "What character starts a template literal?", np: "Template literal कुन अक्षरले सुरु हुन्छ?", jp: "テンプレートリテラルはどの文字で始まるか?" },
          options: [
            { en: "A backtick", np: "एउटा backtick", jp: "バッククォート" },
            { en: "A single quote", np: "एउटा single quote", jp: "シングルクォート" },
            { en: "A double quote", np: "एउटा double quote", jp: "ダブルクォート" },
          ],
          correctIndex: 0,
          explanation: { en: "Only backticks enable `${}` interpolation and multiline text.", np: "Backtick ले मात्र `${}` interpolation र multiline पाठ सम्भव बनाउँछ।", jp: "`${}` の埋め込みと複数行が使えるのはバッククォートだけ。" },
        },
        {
          question: { en: "What does a tag function receive?", np: "Tag function ले के पाउँछ?", jp: "タグ関数は何を受け取るか?" },
          options: [
            { en: "The finished string only", np: "तयार भएको string मात्र", jp: "完成した文字列だけ" },
            { en: "The static pieces and the interpolated values", np: "स्थिर टुक्रा र interpolate गरिएका value", jp: "静的な部分と埋め込まれた値" },
            { en: "Nothing", np: "केही पनि होइन", jp: "何も受け取らない" },
          ],
          correctIndex: 1,
          explanation: { en: "That is what lets it transform the values before building the result.", np: "त्यसैले यसले नतिजा बनाउनुअघि value रूपान्तरण गर्न सक्छ।", jp: "だから結果を組み立てる前に値を変換できる。" },
        },
        {
          question: { en: "Does a template literal escape HTML for you?", np: "Template literal ले तपाईंका लागि HTML escape गर्छ?", jp: "テンプレートリテラルはHTMLをエスケープしてくれるか?" },
          options: [
            { en: "No — you must escape deliberately", np: "होइन — तपाईंले जानाजान escape गर्नुपर्छ", jp: "いいえ。自分で意識的にエスケープする" },
            { en: "Yes, automatically", np: "हो, स्वतः", jp: "はい、自動的に" },
          ],
          correctIndex: 0,
          explanation: { en: "Interpolated user input goes in exactly as written, script tags included.", np: "Interpolate गरिएको user input जस्ताको तस्तै जान्छ, script tag समेत।", jp: "埋め込まれたユーザー入力はそのまま入る。scriptタグも含めて。" },
        },
      ],
    },
    {
      id: "unicode-normalization",
      title: { en: "Unicode, Normalization & Sorting", np: "Unicode, Normalization र Sorting", jp: "Unicode・正規化・並べ替え" },
      durationMinutes: 9,
      explanation: {
        en: "JavaScript strings are represented using <b>UTF-16 code units</b>. That is why:\n\n```javascript\nconsole.log(\"👍\".length);\n// 2\n```\n\nEven though 👍 looks like one character, the emoji uses <b>two UTF-16 code units</b>.\n\n---\n\n### Code units vs code points\n\n```javascript\nconst emoji = \"👍\";\n\nconsole.log(emoji.length);      // 2\nconsole.log([...emoji].length); // 1\n```\n\nThe spread operator iterates by <b>Unicode code points</b>, so it correctly treats 👍 as one code point.\n\nCompare:\n\n```javascript\nemoji.split(\"\");\n// [\"\\uD83D\", \"\\uDC4D\"]\n\n[...emoji];\n// [\"👍\"]\n```\n\nFor Unicode-aware iteration:\n\n```javascript\nfor (const char of \"Hello 👍\") {\n  console.log(char);\n}\n```\n\n---\n\n### Unicode normalization\n\nTwo strings can <b>look identical but contain different Unicode representations</b>. For example, `é` can be represented as one precomposed character, or as `e` plus a combining accent.\n\n```javascript\nconst a = \"\\u00E9\";\nconst b = \"\\u0065\\u0301\";\n\nconsole.log(a === b); // false\n```\n\nThey look the same but contain different underlying sequences. Use `normalize()` when comparing Unicode text:\n\n```javascript\nconsole.log(\n  a.normalize(\"NFC\") === b.normalize(\"NFC\")\n);\n// true\n```\n\nCommon forms include:\n\n• `NFC` — composed form\n• `NFD` — decomposed form\n• `NFKC` — compatibility composition\n• `NFKD` — compatibility decomposition\n\nFor most ordinary text comparisons, <b>NFC</b> is the common starting point.\n\n---\n\n### `localeCompare()` for sorting\n\nNormal string comparison is based on Unicode code-point ordering, which isn't always appropriate for human language.\n\n```javascript\nconst names = [\"Zoe\", \"Álex\", \"Anna\"];\n\nnames.sort((a, b) => a.localeCompare(b));\n\nconsole.log(names);\n```\n\nYou can provide a locale and options:\n\n```javascript\nnames.sort((a, b) =>\n  a.localeCompare(b, \"en\", {\n    sensitivity: \"base\"\n  })\n);\n```\n\nThis is especially useful when sorting names or words for users.",
        np: "JavaScript का string <b>UTF-16 code unit</b> ले प्रतिनिधित्व गरिन्छन्। त्यसैले:\n\n```javascript\nconsole.log(\"👍\".length);\n// 2\n```\n\n👍 एउटै अक्षर जस्तो देखिए पनि, यो emoji ले <b>दुई UTF-16 code unit</b> प्रयोग गर्छ।\n\n---\n\n### Code unit vs code point\n\n```javascript\nconst emoji = \"👍\";\n\nconsole.log(emoji.length);      // 2\nconsole.log([...emoji].length); // 1\n```\n\nSpread operator ले <b>Unicode code point</b> अनुसार iterate गर्छ, त्यसैले यसले 👍 लाई एउटै code point मान्छ।\n\nतुलना गर्नुहोस्:\n\n```javascript\nemoji.split(\"\");\n// [\"\\uD83D\", \"\\uDC4D\"]\n\n[...emoji];\n// [\"👍\"]\n```\n\nUnicode-सचेत iteration का लागि:\n\n```javascript\nfor (const char of \"Hello 👍\") {\n  console.log(char);\n}\n```\n\n---\n\n### Unicode normalization\n\nदुई string <b>उस्तै देखिए पनि फरक Unicode प्रतिनिधित्व</b> बोक्न सक्छन्। उदाहरणका लागि, `é` लाई एउटै precomposed अक्षर, वा `e` सँग combining accent गरी प्रतिनिधित्व गर्न सकिन्छ।\n\n```javascript\nconst a = \"\\u00E9\";\nconst b = \"\\u0065\\u0301\";\n\nconsole.log(a === b); // false\n```\n\nतिनी उस्तै देखिन्छन् तर भित्री क्रम फरक छ। Unicode पाठ तुलना गर्दा `normalize()` प्रयोग गर्नुहोस्:\n\n```javascript\nconsole.log(\n  a.normalize(\"NFC\") === b.normalize(\"NFC\")\n);\n// true\n```\n\nसामान्य form:\n\n• `NFC` — composed form\n• `NFD` — decomposed form\n• `NFKC` — compatibility composition\n• `NFKD` — compatibility decomposition\n\nधेरैजसो सामान्य पाठ तुलनाका लागि, <b>NFC</b> सामान्य सुरुवात बिन्दु हो।\n\n---\n\n### क्रमबद्ध गर्न `localeCompare()`\n\nसामान्य string तुलना Unicode code-point क्रममा आधारित हुन्छ, जुन मानव भाषाका लागि सधैं उपयुक्त हुँदैन।\n\n```javascript\nconst names = [\"Zoe\", \"Álex\", \"Anna\"];\n\nnames.sort((a, b) => a.localeCompare(b));\n\nconsole.log(names);\n```\n\nतपाईं locale र option दिन सक्नुहुन्छ:\n\n```javascript\nnames.sort((a, b) =>\n  a.localeCompare(b, \"en\", {\n    sensitivity: \"base\"\n  })\n);\n```\n\nUser का लागि नाम वा शब्द क्रमबद्ध गर्दा यो विशेष उपयोगी हुन्छ।",
        jp: "JavaScriptの文字列は<b>UTF-16のコードユニット</b>で表現されます。だから:\n\n```javascript\nconsole.log(\"👍\".length);\n// 2\n```\n\n👍 は1文字に見えますが、この絵文字は<b>2つのUTF-16コードユニット</b>を使います。\n\n---\n\n### コードユニットとコードポイント\n\n```javascript\nconst emoji = \"👍\";\n\nconsole.log(emoji.length);      // 2\nconsole.log([...emoji].length); // 1\n```\n\nスプレッド構文は<b>Unicodeのコードポイント</b>単位で反復するので、👍 を正しく1つとして扱います。\n\n比べてみましょう:\n\n```javascript\nemoji.split(\"\");\n// [\"\\uD83D\", \"\\uDC4D\"]\n\n[...emoji];\n// [\"👍\"]\n```\n\nUnicodeを意識した反復には:\n\n```javascript\nfor (const char of \"Hello 👍\") {\n  console.log(char);\n}\n```\n\n---\n\n### Unicodeの正規化\n\n2つの文字列が<b>同じに見えても、異なるUnicode表現</b>を含むことがあります。たとえば `é` は、1つの合成済み文字としても、`e` と結合アクセントの組み合わせとしても表せます。\n\n```javascript\nconst a = \"\\u00E9\";\nconst b = \"\\u0065\\u0301\";\n\nconsole.log(a === b); // false\n```\n\n見た目は同じでも、内部の並びが違います。Unicodeのテキストを比較するときは `normalize()` を使います:\n\n```javascript\nconsole.log(\n  a.normalize(\"NFC\") === b.normalize(\"NFC\")\n);\n// true\n```\n\nよく使う形式:\n\n• `NFC` — 合成形\n• `NFD` — 分解形\n• `NFKC` — 互換合成\n• `NFKD` — 互換分解\n\nふつうのテキスト比較では、<b>NFC</b> が出発点としてよく使われます。\n\n---\n\n### 並べ替えのための `localeCompare()`\n\n通常の文字列比較はUnicodeのコードポイント順に基づくため、人間の言語には必ずしも適しません。\n\n```javascript\nconst names = [\"Zoe\", \"Álex\", \"Anna\"];\n\nnames.sort((a, b) => a.localeCompare(b));\n\nconsole.log(names);\n```\n\nロケールやオプションも指定できます:\n\n```javascript\nnames.sort((a, b) =>\n  a.localeCompare(b, \"en\", {\n    sensitivity: \"base\"\n  })\n);\n```\n\nユーザー向けに名前や単語を並べ替えるときに特に役立ちます。",
      },
      diagram: `"👍"

UTF-16 code units      ["\\uD83D", "\\uDC4D"]   length 2
Unicode code points    ["👍"]                   [...str].length 1


"é" can arrive two ways

"\\u00E9"           one precomposed character
"\\u0065\\u0301"     e + combining accent

    a === b                     false
    a.normalize("NFC") === b.normalize("NFC")   true


Sorting
"Zoe" < "Álex"?  code-point order says yes
localeCompare()  asks the locale instead`,
      codeExample: {
        title: { en: "Code points, normal forms, and locale sorting", np: "Code point, normal form, र locale sorting", jp: "コードポイント・正規形・ロケール順" },
        code: `// ── 1. Basic — length counts code units, not characters ───────────
console.log("👍".length);      // 2
console.log([...("👍")].length); // 1

// ── 2. Intermediate — iterate by code point ───────────────────────
const emoji = "👍";

console.log(emoji.split("")); // ["\\uD83D", "\\uDC4D"] — broken halves
console.log([...emoji]);      // ["👍"] — one code point

for (const char of "Hello 👍") {
  console.log(char); // H, e, l, l, o, " ", 👍
}

const characters = [..."Hello 👍 World 🌍"];
console.log(characters.length); // counts emoji as one each

// ── 3. Advanced — normalize before comparing ──────────────────────
const a = "\\u00E9";          // é, precomposed
const b = "\\u0065\\u0301";    // e + combining accent

console.log(a === b);                                 // false
console.log(a.normalize("NFC") === b.normalize("NFC")); // true

// ── Human-friendly sorting ────────────────────────────────────────
const users = ["zoe", "Álex", "anna"];

users.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

console.log(users); // ["anna", "Álex", "zoe"]`,
      },
      keyTakeaways: [
        { en: "JavaScript strings use <b>UTF-16 code units</b>, so `\"👍\".length` is `2`.", np: "JavaScript का string ले <b>UTF-16 code unit</b> प्रयोग गर्छन्, त्यसैले `\"👍\".length` `2` हो।", jp: "JavaScriptの文字列は<b>UTF-16のコードユニット</b>を使うので `\"👍\".length` は `2`。" },
        { en: "`[...str]` iterates <b>code points</b>; `split(\"\")` splits UTF-16 code units and can break an emoji in half.", np: "`[...str]` ले <b>code point</b> मा iterate गर्छ; `split(\"\")` ले UTF-16 code unit फुटाउँछ र emoji दुई टुक्रा पार्न सक्छ।", jp: "`[...str]` は<b>コードポイント</b>で反復する。`split(\"\")` はUTF-16のコードユニットで分割し、絵文字を割ってしまう。" },
        { en: "`for...of` over a string is also code-point aware.", np: "String मा `for...of` पनि code-point सचेत हुन्छ।", jp: "文字列に対する `for...of` もコードポイント単位で動く。" },
        { en: "Visually identical text can hold different sequences, so `\"\\u00E9\" === \"\\u0065\\u0301\"` is `false`.", np: "दृश्यमा उस्तै पाठले फरक क्रम बोक्न सक्छ, त्यसैले `\"\\u00E9\" === \"\\u0065\\u0301\"` `false` हो।", jp: "見た目が同じテキストでも並びが違うことがあり、`\"\\u00E9\" === \"\\u0065\\u0301\"` は `false`。" },
        { en: "`normalize()` makes those comparable; <b>NFC</b> is the usual starting point.", np: "`normalize()` ले तिनलाई तुलनायोग्य बनाउँछ; <b>NFC</b> सामान्य सुरुवात हो।", jp: "`normalize()` で比較可能になる。<b>NFC</b> が通常の出発点。" },
        { en: "`localeCompare()` sorts the way people expect, unlike raw code-point ordering.", np: "`localeCompare()` ले मानिसले अपेक्षा गरे जसरी क्रमबद्ध गर्छ, कच्चा code-point क्रम भन्दा फरक।", jp: "`localeCompare()` は生のコードポイント順と違い、人が期待する順に並べる。" },
      ],
      commonMistakes: [
        { en: "<b>Trusting `.length` as a character count</b> — an emoji or other astral character counts as `2`. Use `[...str].length` when you mean code points.", np: "<b>`.length` लाई अक्षरको गन्ती मान्नु</b> — emoji वा अन्य astral अक्षर `2` गनिन्छ। Code point भन्न खोज्दा `[...str].length` प्रयोग गर्नुहोस्।", jp: "<b>`.length` を文字数だと信じる</b> — 絵文字などは `2` と数えられる。コードポイントなら `[...str].length` を使う。" },
        { en: "<b>Using `split(\"\")` on text with emoji</b> — it hands back broken surrogate halves like `\"\\uD83D\"`. Spread the string instead.", np: "<b>Emoji भएको पाठमा `split(\"\")` प्रयोग गर्नु</b> — यसले `\"\\uD83D\"` जस्ता भाँचिएका surrogate आधा फर्काउँछ। बरु string spread गर्नुहोस्।", jp: "<b>絵文字を含む文字列に `split(\"\")` を使う</b> — `\"\\uD83D\"` のような壊れたサロゲートの片割れが返る。スプレッドを使う。" },
        { en: "<b>Comparing user-entered text without normalizing</b> — two visually identical names can fail `===`. Normalize both sides first.", np: "<b>Normalize नगरी user ले लेखेको पाठ तुलना गर्नु</b> — दृश्यमा उस्तै दुई नाम `===` मा असफल हुन सक्छन्। पहिले दुबै पक्ष normalize गर्नुहोस्।", jp: "<b>正規化せずにユーザー入力を比較する</b> — 見た目が同じ名前でも `===` が失敗しうる。両方を先に正規化する。" },
        { en: "<b>Sorting names with a plain `<` comparison</b> — accented letters land in surprising places. Use `localeCompare()` with a locale.", np: "<b>नाम लाई साधारण `<` तुलनाले क्रमबद्ध गर्नु</b> — accent भएका अक्षर अनौठो ठाउँमा पर्छन्। Locale सहित `localeCompare()` प्रयोग गर्नुहोस्।", jp: "<b>名前を単純な `<` で並べ替える</b> — アクセント付きの文字が予想外の位置に来る。ロケール付きの `localeCompare()` を使う。" },
      ],
      quiz: [
        {
          question: { en: "What is `\"👍\".length`?", np: "`\"👍\".length` कति हो?", jp: "`\"👍\".length` はいくつか?" },
          options: [
            { en: "`1`", np: "`1`", jp: "`1`" },
            { en: "`4`", np: "`4`", jp: "`4`" },
            { en: "`2`", np: "`2`", jp: "`2`" },
          ],
          correctIndex: 2,
          explanation: { en: "The emoji is stored as two UTF-16 code units, and `.length` counts those.", np: "Emoji दुई UTF-16 code unit रूपमा राखिन्छ, र `.length` ले तिनै गन्छ।", jp: "絵文字は2つのUTF-16コードユニットとして保存され、`.length` はそれを数える。" },
        },
        {
          question: { en: "Which correctly counts 👍 as one character?", np: "कुनले 👍 लाई एक अक्षर सही रूपमा गन्छ?", jp: "👍 を正しく1文字と数えるのはどれか?" },
          options: [
            { en: "`str.split(\"\").length`", np: "`str.split(\"\").length`", jp: "`str.split(\"\").length`" },
            { en: "`[...str].length`", np: "`[...str].length`", jp: "`[...str].length`" },
            { en: "`str.length`", np: "`str.length`", jp: "`str.length`" },
          ],
          correctIndex: 1,
          explanation: { en: "Spreading iterates code points; `split(\"\")` splits code units.", np: "Spread ले code point मा iterate गर्छ; `split(\"\")` ले code unit फुटाउँछ।", jp: "スプレッドはコードポイントで反復し、`split(\"\")` はコードユニットで分割する。" },
        },
        {
          question: { en: "Why is `\"\\u00E9\" === \"\\u0065\\u0301\"` false?", np: "`\"\\u00E9\" === \"\\u0065\\u0301\"` किन false हो?", jp: "なぜ `\"\\u00E9\" === \"\\u0065\\u0301\"` は false なのか?" },
          options: [
            { en: "They render differently", np: "तिनी फरक देखिन्छन्", jp: "表示が違うから" },
            { en: "`===` cannot compare strings", np: "`===` ले string तुलना गर्न सक्दैन", jp: "`===` は文字列を比較できないから" },
            { en: "They look the same but hold different Unicode sequences", np: "तिनी उस्तै देखिन्छन् तर फरक Unicode क्रम बोक्छन्", jp: "見た目は同じでも異なるUnicodeの並びを持つから" },
          ],
          correctIndex: 2,
          explanation: { en: "One is precomposed, the other is a letter plus a combining accent. `normalize(\"NFC\")` fixes it.", np: "एउटा precomposed हो, अर्को अक्षर सँग combining accent। `normalize(\"NFC\")` ले ठीक गर्छ।", jp: "一方は合成済み、もう一方は文字＋結合アクセント。`normalize(\"NFC\")` で解決する。" },
        },
        {
          question: { en: "Which should you use to sort names for people to read?", np: "मानिसले पढ्नका लागि नाम क्रमबद्ध गर्न कुन प्रयोग गर्नुपर्छ?", jp: "人が読むために名前を並べ替えるにはどれを使うべきか?" },
          options: [
            { en: "`a.localeCompare(b)`", np: "`a.localeCompare(b)`", jp: "`a.localeCompare(b)`" },
            { en: "`a < b`", np: "`a < b`", jp: "`a < b`" },
            { en: "`a.length - b.length`", np: "`a.length - b.length`", jp: "`a.length - b.length`" },
          ],
          correctIndex: 0,
          explanation: { en: "Raw comparison uses code-point order, which misplaces accented letters.", np: "कच्चा तुलनाले code-point क्रम प्रयोग गर्छ, जसले accent भएका अक्षर गलत ठाउँमा राख्छ।", jp: "生の比較はコードポイント順なので、アクセント付きの文字が誤った位置に来る。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Do JavaScript string methods change the original string?", np: "JavaScript का string method ले मूल string बदल्छन्?", jp: "JavaScriptの文字列メソッドは元の文字列を変えるか?" },
      options: [
        { en: "No — strings are immutable, so methods return new strings", np: "होइन — string immutable हुन्छन्, त्यसैले method ले नयाँ string फर्काउँछन्", jp: "いいえ。文字列はイミュータブルで、メソッドは新しい文字列を返す" },
        { en: "Yes, they edit it in place", np: "हो, तिनले त्यहीँ सम्पादन गर्छन्", jp: "はい、その場で書き換える" },
      ],
      correctIndex: 0,
      explanation: { en: "You have to keep the returned value; the original variable is untouched.", np: "तपाईंले फर्काइएको value राख्नुपर्छ; मूल variable जस्ताको तस्तै रहन्छ।", jp: "返り値を受け取る必要がある。元の変数はそのまま。" },
    },
    {
      question: { en: "Which method reads the last character, including with a negative index?", np: "ऋणात्मक index सहित अन्तिम अक्षर कुन method ले पढ्छ?", jp: "負の添字も使って最後の文字を読むメソッドは?" },
      options: [
        { en: "`charAt()`", np: "`charAt()`", jp: "`charAt()`" },
        { en: "`at()`", np: "`at()`", jp: "`at()`" },
        { en: "`slice()`", np: "`slice()`", jp: "`slice()`" },
      ],
      correctIndex: 1,
      explanation: { en: "`text.at(-1)` works where `text[-1]` gives `undefined`.", np: "`text[-1]` ले `undefined` दिने ठाउँमा `text.at(-1)` काम गर्छ।", jp: "`text[-1]` が `undefined` になる場面でも `text.at(-1)` は動く。" },
    },
    {
      question: { en: "What starts a template literal?", np: "Template literal केले सुरु हुन्छ?", jp: "テンプレートリテラルは何で始まるか?" },
      options: [
        { en: "A forward slash", np: "एउटा forward slash", jp: "スラッシュ" },
        { en: "A double quote", np: "एउटा double quote", jp: "ダブルクォート" },
        { en: "A backtick", np: "एउटा backtick", jp: "バッククォート" },
      ],
      correctIndex: 2,
      explanation: { en: "Backticks are what enable `${}` interpolation and multiline text.", np: "Backtick ले नै `${}` interpolation र multiline पाठ सम्भव बनाउँछ।", jp: "バッククォートが `${}` の埋め込みと複数行を可能にする。" },
    },
    {
      question: { en: "What two things does a tagged template hand to its function?", np: "Tagged template ले आफ्नो function लाई कुन दुई कुरा दिन्छ?", jp: "タグ付きテンプレートは関数に何を2つ渡すか?" },
      options: [
        { en: "The static string pieces and the interpolated values", np: "स्थिर string टुक्रा र interpolate गरिएका value", jp: "静的な文字列の断片と、埋め込まれた値" },
        { en: "The finished string and its length", np: "तयार string र यसको लम्बाइ", jp: "完成した文字列とその長さ" },
        { en: "Nothing at all", np: "केही पनि होइन", jp: "何も渡さない" },
      ],
      correctIndex: 0,
      explanation: { en: "That split is what lets a tag escape or validate the values first.", np: "त्यही विभाजनले tag लाई पहिले value escape वा प्रमाणित गर्न दिन्छ।", jp: "この分離があるから、タグは先に値をエスケープ・検証できる。" },
    },
    {
      question: { en: "Why is `\"👍\".length` equal to 2?", np: "`\"👍\".length` किन 2 बराबर हुन्छ?", jp: "なぜ `\"👍\".length` は2なのか?" },
      options: [
        { en: "JavaScript counts bytes", np: "JavaScript ले byte गन्छ", jp: "JavaScriptがバイトを数えるから" },
        { en: "The emoji uses two UTF-16 code units", np: "Emoji ले दुई UTF-16 code unit प्रयोग गर्छ", jp: "この絵文字が2つのUTF-16コードユニットを使うから" },
        { en: "There is a hidden space", np: "लुकेको space छ", jp: "隠れた空白があるから" },
      ],
      correctIndex: 1,
      explanation: { en: "`.length` counts code units, not characters you can see.", np: "`.length` ले देखिने अक्षर होइन, code unit गन्छ।", jp: "`.length` は目に見える文字ではなくコードユニットを数える。" },
    },
    {
      question: { en: "Which safely splits text containing emoji into characters?", np: "Emoji भएको पाठलाई अक्षरमा सुरक्षित रूपमा कुनले फुटाउँछ?", jp: "絵文字を含む文字列を安全に1文字ずつに分けるのはどれか?" },
      options: [
        { en: "`text.split(\"\")`", np: "`text.split(\"\")`", jp: "`text.split(\"\")`" },
        { en: "`text.slice(0)`", np: "`text.slice(0)`", jp: "`text.slice(0)`" },
        { en: "`[...text]`", np: "`[...text]`", jp: "`[...text]`" },
      ],
      correctIndex: 2,
      explanation: { en: "Spreading iterates code points; `split(\"\")` returns broken surrogate halves.", np: "Spread ले code point मा iterate गर्छ; `split(\"\")` ले भाँचिएका surrogate आधा फर्काउँछ।", jp: "スプレッドはコードポイントで反復する。`split(\"\")` は壊れたサロゲートの片割れを返す。" },
    },
    {
      question: { en: "Two names look identical but `===` says false. What should you try?", np: "दुई नाम उस्तै देखिन्छन् तर `===` ले false भन्छ। तपाईंले के प्रयास गर्नुपर्छ?", jp: "2つの名前は同じに見えるのに `===` が false。何を試すべきか?" },
      options: [
        { en: "Normalize both with `normalize(\"NFC\")` before comparing", np: "तुलना गर्नुअघि दुबैलाई `normalize(\"NFC\")` ले normalize गर्नुहोस्", jp: "比較前に両方を `normalize(\"NFC\")` で正規化する" },
        { en: "Compare their lengths instead", np: "बरु तिनको लम्बाइ तुलना गर्नुहोस्", jp: "代わりに長さを比較する" },
        { en: "Convert both to numbers", np: "दुबैलाई number मा बदल्नुहोस्", jp: "両方を数値に変換する" },
      ],
      correctIndex: 0,
      explanation: { en: "One may be precomposed while the other is a letter plus a combining mark.", np: "एउटा precomposed हुन सक्छ भने अर्को अक्षर सँग combining mark।", jp: "一方は合成済み、もう一方は文字＋結合記号かもしれない。" },
    },
    {
      question: { en: "Which comparison sorts accented names the way readers expect?", np: "Accent भएका नाम पाठकले अपेक्षा गरे जसरी कुन तुलनाले क्रमबद्ध गर्छ?", jp: "アクセント付きの名前を読者の期待どおりに並べるのはどの比較か?" },
      options: [
        { en: "`a < b`", np: "`a < b`", jp: "`a < b`" },
        { en: "`a.localeCompare(b)`", np: "`a.localeCompare(b)`", jp: "`a.localeCompare(b)`" },
        { en: "`a.charCodeAt(0) - b.charCodeAt(0)`", np: "`a.charCodeAt(0) - b.charCodeAt(0)`", jp: "`a.charCodeAt(0) - b.charCodeAt(0)`" },
      ],
      correctIndex: 1,
      explanation: { en: "Plain comparison follows code-point order, which is not human alphabetical order.", np: "साधारण तुलनाले code-point क्रम पछ्याउँछ, जुन मानवीय वर्णक्रम होइन।", jp: "単純な比較はコードポイント順で、人間のアルファベット順ではない。" },
    },
    {
      question: { en: "Which normalization form is the usual starting point for text comparison?", np: "पाठ तुलनाका लागि सामान्य सुरुवात बिन्दु कुन normalization form हो?", jp: "テキスト比較で通常の出発点となる正規化形式は?" },
      options: [
        { en: "`NFKD`", np: "`NFKD`", jp: "`NFKD`" },
        { en: "`NFD`", np: "`NFD`", jp: "`NFD`" },
        { en: "`NFC`", np: "`NFC`", jp: "`NFC`" },
      ],
      correctIndex: 2,
      explanation: { en: "NFC is the composed form, and the common default for ordinary comparisons.", np: "NFC composed form हो, र सामान्य तुलनाका लागि सामान्य default।", jp: "NFCは合成形で、通常の比較での一般的な既定。" },
    },
  ],
};
