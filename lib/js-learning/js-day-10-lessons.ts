import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_10_LESSONS: JsLessonDay = {
  day: 10,
  title: { en: "Regular Expressions", np: "Regular Expressions", jp: "正規表現" },
  totalMinutes: 27,
  difficulty: { en: "Advanced", np: "Advanced", jp: "上級" },
  lessons: [
    {
      id: "regex-syntax-flags",
      title: { en: "Regex Syntax, Flags & Quantifiers", np: "Regex Syntax, Flags र Quantifiers", jp: "正規表現の構文・フラグ・量指定子" },
      durationMinutes: 9,
      explanation: {
        en: "Regular expressions (<b>regex</b>) are patterns used to search, match, validate, extract, and replace text.\n\n### Creating a regular expression\n\n```javascript\nconst pattern = /hello/i;              // literal\nconst dynamic = new RegExp(\"hello\", \"i\"); // constructor\n```\n\nUse the <b>literal</b> for fixed patterns. Use `RegExp` when the pattern itself must be built at runtime.\n\n---\n\n### Flags\n\n```text\ng   global — find all matches\ni   case-insensitive\nm   multiline — ^ and $ work per line\ns   dot matches newline\nu   Unicode-aware matching\ny   sticky — must match at lastIndex\n```\n\n```javascript\nconst pattern = /javascript/gi;\n\nconsole.log(\"JavaScript javascript JAVASCRIPT\".match(pattern));\n// [\"JavaScript\", \"javascript\", \"JAVASCRIPT\"]\n```\n\n---\n\n### The `lastIndex` trap\n\nRegex objects with `g` or `y` keep a mutable `lastIndex`.\n\n```javascript\nconst regex = /cat/g;\n\nconsole.log(regex.test(\"cat\")); // true\nconsole.log(regex.lastIndex);   // 3\n\nconsole.log(regex.test(\"cat\")); // false\n```\n\nThe second call starts searching from `lastIndex = 3`, already at the end. Reset it when needed with `regex.lastIndex = 0;`.\n\nThis is why <b>stateful regex objects can produce surprising results</b> when reused.\n\n---\n\n### Character classes\n\n```javascript\n/[abc]/   // a, b or c\n/[a-z]/   // any lowercase letter\n/[0-9]/   // any digit\n/[^0-9]/  // anything except a digit\n```\n\nCommon shortcuts:\n\n```text\n\\d   digit          \\D   non-digit\n\\w   word character \\W   non-word character\n\\s   whitespace     \\S   non-whitespace\n```\n\n---\n\n### Quantifiers\n\n```text\n*       0 or more\n+       1 or more\n?       0 or 1\n{3}     exactly 3\n{3,}    3 or more\n{3,5}   between 3 and 5\n```\n\n```javascript\n/\\d+/       // one or more digits\n/\\d{4}/     // exactly four digits\n/colou?r/   // color or colour\n```\n\n---\n\n### Anchors\n\n```text\n^   beginning\n$   end\n```\n\n```javascript\nconsole.log(/^\\d+$/.test(\"12345\"));  // true\nconsole.log(/^\\d+$/.test(\"123abc\")); // false\n\nconsole.log(/\\d+/.test(\"abc123xyz\")); // true — digits anywhere\n```\n\n`/^\\d+$/` means the <b>entire string</b> must be digits.",
        np: "Regular expression (<b>regex</b>) पाठ खोज्न, match गर्न, प्रमाणित गर्न, निकाल्न र बदल्न प्रयोग हुने pattern हुन्।\n\n### Regular expression बनाउनु\n\n```javascript\nconst pattern = /hello/i;              // literal\nconst dynamic = new RegExp(\"hello\", \"i\"); // constructor\n```\n\nनिश्चित pattern का लागि <b>literal</b> प्रयोग गर्नुहोस्। Pattern नै runtime मा बनाउनुपर्दा `RegExp` प्रयोग गर्नुहोस्।\n\n---\n\n### Flag\n\n```text\ng   global — find all matches\ni   case-insensitive\nm   multiline — ^ and $ work per line\ns   dot matches newline\nu   Unicode-aware matching\ny   sticky — must match at lastIndex\n```\n\n```javascript\nconst pattern = /javascript/gi;\n\nconsole.log(\"JavaScript javascript JAVASCRIPT\".match(pattern));\n// [\"JavaScript\", \"javascript\", \"JAVASCRIPT\"]\n```\n\n---\n\n### `lastIndex` को पासो\n\n`g` वा `y` भएका regex object ले बदलिने `lastIndex` राख्छन्।\n\n```javascript\nconst regex = /cat/g;\n\nconsole.log(regex.test(\"cat\")); // true\nconsole.log(regex.lastIndex);   // 3\n\nconsole.log(regex.test(\"cat\")); // false\n```\n\nदोस्रो call `lastIndex = 3` बाट खोज्न थाल्छ, जुन पहिले नै अन्त्यमा छ। चाहिँदा `regex.lastIndex = 0;` ले reset गर्नुहोस्।\n\nत्यसैले पुनः प्रयोग गर्दा <b>stateful regex object ले अचम्मको नतिजा</b> दिन सक्छन्।\n\n---\n\n### Character class\n\n```javascript\n/[abc]/   // a, b or c\n/[a-z]/   // any lowercase letter\n/[0-9]/   // any digit\n/[^0-9]/  // anything except a digit\n```\n\nसामान्य शर्टकट:\n\n```text\n\\d   digit          \\D   non-digit\n\\w   word character \\W   non-word character\n\\s   whitespace     \\S   non-whitespace\n```\n\n---\n\n### Quantifier\n\n```text\n*       0 or more\n+       1 or more\n?       0 or 1\n{3}     exactly 3\n{3,}    3 or more\n{3,5}   between 3 and 5\n```\n\n```javascript\n/\\d+/       // one or more digits\n/\\d{4}/     // exactly four digits\n/colou?r/   // color or colour\n```\n\n---\n\n### Anchor\n\n```text\n^   beginning\n$   end\n```\n\n```javascript\nconsole.log(/^\\d+$/.test(\"12345\"));  // true\nconsole.log(/^\\d+$/.test(\"123abc\")); // false\n\nconsole.log(/\\d+/.test(\"abc123xyz\")); // true — digits anywhere\n```\n\n`/^\\d+$/` को अर्थ <b>पूरै string</b> अंक हुनुपर्छ भन्ने हो।",
        jp: "正規表現（<b>regex</b>）は、テキストの検索・照合・検証・抽出・置換に使うパターンです。\n\n### 正規表現の作り方\n\n```javascript\nconst pattern = /hello/i;              // literal\nconst dynamic = new RegExp(\"hello\", \"i\"); // constructor\n```\n\n固定のパターンには<b>リテラル</b>を、パターン自体を実行時に組み立てるなら `RegExp` を使います。\n\n---\n\n### フラグ\n\n```text\ng   global — find all matches\ni   case-insensitive\nm   multiline — ^ and $ work per line\ns   dot matches newline\nu   Unicode-aware matching\ny   sticky — must match at lastIndex\n```\n\n```javascript\nconst pattern = /javascript/gi;\n\nconsole.log(\"JavaScript javascript JAVASCRIPT\".match(pattern));\n// [\"JavaScript\", \"javascript\", \"JAVASCRIPT\"]\n```\n\n---\n\n### `lastIndex` の落とし穴\n\n`g` や `y` を持つ正規表現オブジェクトは、変化する `lastIndex` を保持します。\n\n```javascript\nconst regex = /cat/g;\n\nconsole.log(regex.test(\"cat\")); // true\nconsole.log(regex.lastIndex);   // 3\n\nconsole.log(regex.test(\"cat\")); // false\n```\n\n2回目は `lastIndex = 3`、つまり末尾から探し始めます。必要なら `regex.lastIndex = 0;` で戻します。\n\nだから<b>状態を持つ正規表現オブジェクトは再利用時に驚く結果</b>を生むことがあります。\n\n---\n\n### 文字クラス\n\n```javascript\n/[abc]/   // a, b or c\n/[a-z]/   // any lowercase letter\n/[0-9]/   // any digit\n/[^0-9]/  // anything except a digit\n```\n\nよく使う省略記法:\n\n```text\n\\d   digit          \\D   non-digit\n\\w   word character \\W   non-word character\n\\s   whitespace     \\S   non-whitespace\n```\n\n---\n\n### 量指定子\n\n```text\n*       0 or more\n+       1 or more\n?       0 or 1\n{3}     exactly 3\n{3,}    3 or more\n{3,5}   between 3 and 5\n```\n\n```javascript\n/\\d+/       // one or more digits\n/\\d{4}/     // exactly four digits\n/colou?r/   // color or colour\n```\n\n---\n\n### アンカー\n\n```text\n^   beginning\n$   end\n```\n\n```javascript\nconsole.log(/^\\d+$/.test(\"12345\"));  // true\nconsole.log(/^\\d+$/.test(\"123abc\")); // false\n\nconsole.log(/\\d+/.test(\"abc123xyz\")); // true — digits anywhere\n```\n\n`/^\\d+$/` は<b>文字列全体</b>が数字であることを意味します。",
      },
      diagram: `/pattern/flags

  /\\d{4}-\\d{2}-\\d{2}/g
   │                   │
   pattern             flags


g  all matches      i  ignore case
m  ^ $ per line     s  . matches newline
u  Unicode aware    y  sticky at lastIndex


\\d digit   \\w word char   \\s whitespace
\\D not     \\W not         \\S not

*  0+      +  1+      ?  0 or 1
{3} exactly   {3,} 3+   {3,5} 3 to 5

^  start of input      $  end of input`,
      codeExample: {
        title: { en: "Literals, flags, classes and anchors", np: "Literal, flag, class र anchor", jp: "リテラル・フラグ・クラス・アンカー" },
        code: `// ── 1. Basic — literal, constructor, and test() ───────────────────
const literal = /hello/i;
const dynamic = new RegExp("hello", "i");

console.log(literal.test("Hello")); // true
console.log(dynamic.test("HELLO")); // true

// ── 2. Intermediate — flags change the whole behaviour ────────────
console.log("JavaScript javascript JAVASCRIPT".match(/javascript/gi));
// ["JavaScript", "javascript", "JAVASCRIPT"]

// ── Classes, quantifiers and anchors together ─────────────────────
console.log(/^\\d+$/.test("12345"));   // true  — the whole string is digits
console.log(/^\\d+$/.test("123abc"));  // false
console.log(/\\d+/.test("abc123xyz")); // true  — digits somewhere

console.log(/colou?r/.test("color"));  // true
console.log(/colou?r/.test("colour")); // true

// ── 3. Advanced — the lastIndex trap on a reused /g regex ─────────
const regex = /cat/g;

console.log(regex.test("cat"));  // true
console.log(regex.lastIndex);    // 3
console.log(regex.test("cat"));  // false — resumed from index 3

regex.lastIndex = 0;
console.log(regex.test("cat"));  // true again`,
      },
      keyTakeaways: [
        { en: "`/pattern/flags` is the normal regex syntax; `new RegExp()` is for patterns built at runtime.", np: "`/pattern/flags` सामान्य regex syntax हो; `new RegExp()` runtime मा बन्ने pattern का लागि।", jp: "`/pattern/flags` が通常の構文。実行時に組み立てるパターンには `new RegExp()`。" },
        { en: "`g`, `i`, `m`, `s`, `u` and `y` each change how the pattern behaves.", np: "`g`, `i`, `m`, `s`, `u` र `y` हरेकले pattern को व्यवहार बदल्छन्।", jp: "`g`・`i`・`m`・`s`・`u`・`y` はそれぞれパターンの動きを変える。" },
        { en: "`g` and `y` make a regex object <b>stateful</b> through `lastIndex`, so reusing one can surprise you.", np: "`g` र `y` ले regex object लाई `lastIndex` मार्फत <b>stateful</b> बनाउँछन्, त्यसैले पुनः प्रयोगले अचम्ममा पार्न सक्छ।", jp: "`g` と `y` は `lastIndex` によって正規表現オブジェクトを<b>状態付き</b>にするので、使い回すと驚くことがある。" },
        { en: "Character classes define which characters are allowed; `\\d`, `\\w` and `\\s` are the common shortcuts.", np: "Character class ले कुन अक्षर अनुमति छन् परिभाषित गर्छ; `\\d`, `\\w` र `\\s` सामान्य शर्टकट हुन्।", jp: "文字クラスは許される文字を定義する。`\\d`・`\\w`・`\\s` がよく使う省略記法。" },
        { en: "Quantifiers control repetition: `*`, `+`, `?`, `{3}`, `{3,}` and `{3,5}`.", np: "Quantifier ले दोहोरिने संख्या नियन्त्रण गर्छ: `*`, `+`, `?`, `{3}`, `{3,}` र `{3,5}`।", jp: "量指定子が繰り返しを制御する: `*`・`+`・`?`・`{3}`・`{3,}`・`{3,5}`。" },
        { en: "`^` and `$` anchor a pattern to the start and end, turning a search into a validation.", np: "`^` र `$` ले pattern लाई सुरु र अन्त्यमा बाँध्छन्, खोजीलाई प्रमाणीकरणमा बदल्छन्।", jp: "`^` と `$` はパターンを先頭と末尾に固定し、検索を検証に変える。" },
      ],
      commonMistakes: [
        { en: "<b>Reusing a `/g` regex across calls</b> — `regex.test()` twice on the same string can give `true` then `false`, because `lastIndex` moved. Reset it, or use a fresh regex.", np: "<b>`/g` regex लाई call बीच पुनः प्रयोग गर्नु</b> — उही string मा `regex.test()` दुई पटक गर्दा `true` अनि `false` आउन सक्छ, किनकि `lastIndex` सर्‍यो। Reset गर्नुहोस्, वा नयाँ regex प्रयोग गर्नुहोस्।", jp: "<b>`/g` の正規表現を呼び出し間で使い回す</b> — 同じ文字列に `regex.test()` を2回すると `true` の次が `false` になりうる。`lastIndex` が動くため。リセットするか新しい正規表現を使う。" },
        { en: "<b>Forgetting anchors when validating</b> — `/\\d+/.test(\"abc123\")` is `true` because it only needs digits <i>somewhere</i>. Use `/^\\d+$/` to require the whole string.", np: "<b>प्रमाणित गर्दा anchor बिर्सनु</b> — `/\\d+/.test(\"abc123\")` `true` हो किनकि यसलाई कतै अंक भए पुग्छ। पूरै string चाहिएमा `/^\\d+$/` प्रयोग गर्नुहोस्।", jp: "<b>検証時にアンカーを忘れる</b> — `/\\d+/.test(\"abc123\")` は `true`。どこかに数字があればよいから。文字列全体を求めるなら `/^\\d+$/`。" },
        { en: "<b>Building a pattern from user input without escaping</b> — `new RegExp(userInput)` can throw or match far more than intended. Escape it, or avoid dynamic patterns.", np: "<b>Escape नगरी user input बाट pattern बनाउनु</b> — `new RegExp(userInput)` ले error दिन सक्छ वा सोचेभन्दा धेरै match गर्न सक्छ। Escape गर्नुहोस्, वा dynamic pattern बच्नुहोस्।", jp: "<b>ユーザー入力からエスケープせずにパターンを作る</b> — `new RegExp(userInput)` は例外になったり、意図以上に一致したりする。エスケープするか動的パターンを避ける。" },
      ],
      quiz: [
        {
          question: { en: "Which flag makes a regex find every match instead of just the first?", np: "कुन flag ले regex लाई पहिलो मात्र होइन, हरेक match भेट्टाउन लगाउँछ?", jp: "最初の1つではなくすべての一致を見つけさせるフラグは?" },
          options: [
            { en: "`g`", np: "`g`", jp: "`g`" },
            { en: "`i`", np: "`i`", jp: "`i`" },
            { en: "`m`", np: "`m`", jp: "`m`" },
          ],
          correctIndex: 0,
          explanation: { en: "`i` ignores case and `m` changes what `^` and `$` mean per line.", np: "`i` ले case बेवास्ता गर्छ र `m` ले प्रति line `^` र `$` को अर्थ बदल्छ।", jp: "`i` は大文字小文字を無視し、`m` は行ごとの `^` と `$` の意味を変える。" },
        },
        {
          question: { en: "What does `/^\\d+$/` require?", np: "`/^\\d+$/` ले के माग गर्छ?", jp: "`/^\\d+$/` は何を要求するか?" },
          options: [
            { en: "Digits somewhere in the string", np: "String मा कतै अंक", jp: "文字列のどこかに数字があること" },
            { en: "The entire string to be digits", np: "पूरै string अंक हुनुपर्ने", jp: "文字列全体が数字であること" },
            { en: "Exactly one digit", np: "ठ्याक्कै एउटा अंक", jp: "ちょうど1桁の数字" },
          ],
          correctIndex: 1,
          explanation: { en: "The anchors pin the pattern to both ends, so nothing else may appear.", np: "Anchor ले pattern लाई दुबै छेउमा बाँध्छ, त्यसैले अरू केही आउन सक्दैन।", jp: "アンカーが両端に固定するので、他のものは入れない。" },
        },
        {
          question: { en: "Why can `regex.test(\"cat\")` return `true` then `false` for `/cat/g`?", np: "`/cat/g` का लागि `regex.test(\"cat\")` ले किन पहिले `true` अनि `false` फर्काउँछ?", jp: "`/cat/g` で `regex.test(\"cat\")` が `true` の次に `false` を返すのはなぜか?" },
          options: [
            { en: "The string changed", np: "String बदलियो", jp: "文字列が変わったから" },
            { en: "`test()` is random", np: "`test()` अनियमित छ", jp: "`test()` がランダムだから" },
            { en: "`lastIndex` moved to the end after the first match", np: "पहिलो match पछि `lastIndex` अन्त्यमा सर्‍यो", jp: "最初の一致後に `lastIndex` が末尾へ移動したから" },
          ],
          correctIndex: 2,
          explanation: { en: "Global and sticky regexes are stateful; reset `lastIndex` or use a new regex.", np: "Global र sticky regex stateful हुन्छन्; `lastIndex` reset गर्नुहोस् वा नयाँ regex प्रयोग गर्नुहोस्।", jp: "globalとstickyの正規表現は状態を持つ。`lastIndex` をリセットするか新しい正規表現を使う。" },
        },
      ],
    },
    {
      id: "regex-groups-lookarounds",
      title: { en: "Greedy vs Lazy, Groups & Lookarounds", np: "Greedy vs Lazy, Group र Lookaround", jp: "貪欲と遅延・グループ・先読み" },
      durationMinutes: 9,
      explanation: {
        en: "Regex quantifiers are <b>greedy by default</b>. They try to consume as much text as possible.\n\n```javascript\nconst text = \"<b>Hello</b><b>World</b>\";\n\nconsole.log(text.match(/<b>.*<\\/b>/));\n```\n\nThe `.*` is greedy, so it consumes `Hello</b><b>World` and matches the entire string.\n\nAdd `?` for a <b>lazy</b> quantifier:\n\n```javascript\nconsole.log(text.match(/<b>.*?<\\/b>/));\n// <b>Hello</b>\n```\n\n```text\n.*   greedy\n.*?  lazy\n```\n\nGreedy matching can silently consume more data than intended, especially in structured text.\n\n---\n\n### Capture groups\n\nParentheses create a <b>capture group</b>.\n\n```javascript\nconst regex = /(\\d{4})-(\\d{2})-(\\d{2})/;\n\nconst result = \"2026-08-26\".match(regex);\n\nconsole.log(result[1]); // 2026\nconsole.log(result[2]); // 08\nconsole.log(result[3]); // 26\n```\n\nYou can also create <b>named groups</b>:\n\n```javascript\nconst regex =\n  /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;\n\nconst result = \"2026-08-26\".match(regex);\n\nconsole.log(result.groups.year);  // 2026\nconsole.log(result.groups.month); // 08\nconsole.log(result.groups.day);   // 26\n```\n\nNamed groups are much easier to read in complex patterns.\n\n---\n\n### Backreferences\n\nA backreference matches <b>the same text that was captured earlier</b>.\n\n```javascript\nconst regex = /\\b(\\w+)\\s+\\1\\b/i;\n\nconsole.log(regex.test(\"hello hello\")); // true\nconsole.log(regex.test(\"hello world\")); // false\n```\n\n`(\\w+)` captures `hello`, and `\\1` then requires the same captured value again.\n\nNamed backreference: `/(?<word>\\w+)\\s+\\k<word>/i`.\n\n---\n\n### Lookahead and lookbehind\n\nLookarounds check surrounding text <b>without consuming it</b>.\n\n```javascript\n\"100 dollars\".match(/\\d+(?= dollars)/); // [\"100\"] — positive lookahead\n\"$100\".match(/(?<=\\$)\\d+/);             // [\"100\"] — positive lookbehind\n```\n\nNegative forms invert the test:\n\n```javascript\n/\\d+(?! dollars)/   // digits NOT followed by \" dollars\"\n/(?<!\\$)\\d+/        // digits NOT preceded by \"$\"\n```\n\n> <b>Lookarounds inspect context without including that context in the match.</b>",
        np: "Regex का quantifier <b>default मा greedy</b> हुन्छन्। तिनले सकेसम्म धेरै पाठ खान खोज्छन्।\n\n```javascript\nconst text = \"<b>Hello</b><b>World</b>\";\n\nconsole.log(text.match(/<b>.*<\\/b>/));\n```\n\n`.*` greedy भएकाले यसले `Hello</b><b>World` खान्छ र पूरै string match गर्छ।\n\n<b>Lazy</b> quantifier का लागि `?` थप्नुहोस्:\n\n```javascript\nconsole.log(text.match(/<b>.*?<\\/b>/));\n// <b>Hello</b>\n```\n\n```text\n.*   greedy\n.*?  lazy\n```\n\nGreedy matching ले सोचेभन्दा धेरै data चुपचाप खान सक्छ, विशेष गरी संरचित पाठमा।\n\n---\n\n### Capture group\n\nकोष्ठकले <b>capture group</b> बनाउँछ।\n\n```javascript\nconst regex = /(\\d{4})-(\\d{2})-(\\d{2})/;\n\nconst result = \"2026-08-26\".match(regex);\n\nconsole.log(result[1]); // 2026\nconsole.log(result[2]); // 08\nconsole.log(result[3]); // 26\n```\n\nतपाईं <b>named group</b> पनि बनाउन सक्नुहुन्छ:\n\n```javascript\nconst regex =\n  /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;\n\nconst result = \"2026-08-26\".match(regex);\n\nconsole.log(result.groups.year);  // 2026\nconsole.log(result.groups.month); // 08\nconsole.log(result.groups.day);   // 26\n```\n\nजटिल pattern मा named group धेरै पढ्न सजिलो हुन्छ।\n\n---\n\n### Backreference\n\nBackreference ले <b>अघि capture गरिएकै पाठ</b> match गर्छ।\n\n```javascript\nconst regex = /\\b(\\w+)\\s+\\1\\b/i;\n\nconsole.log(regex.test(\"hello hello\")); // true\nconsole.log(regex.test(\"hello world\")); // false\n```\n\n`(\\w+)` ले `hello` capture गर्छ, अनि `\\1` ले उही capture गरिएको value फेरि माग्छ।\n\nNamed backreference: `/(?<word>\\w+)\\s+\\k<word>/i`।\n\n---\n\n### Lookahead र lookbehind\n\nLookaround ले वरिपरिको पाठ <b>नखाइकन</b> जाँच्छ।\n\n```javascript\n\"100 dollars\".match(/\\d+(?= dollars)/); // [\"100\"] — positive lookahead\n\"$100\".match(/(?<=\\$)\\d+/);             // [\"100\"] — positive lookbehind\n```\n\nNegative रूपले जाँच उल्टाउँछ:\n\n```javascript\n/\\d+(?! dollars)/   // digits NOT followed by \" dollars\"\n/(?<!\\$)\\d+/        // digits NOT preceded by \"$\"\n```\n\n> <b>Lookaround ले context जाँच्छ तर त्यो context लाई match मा समावेश गर्दैन।</b>",
        jp: "正規表現の量指定子は<b>既定で貪欲（greedy）</b>です。できるだけ多くのテキストを取り込もうとします。\n\n```javascript\nconst text = \"<b>Hello</b><b>World</b>\";\n\nconsole.log(text.match(/<b>.*<\\/b>/));\n```\n\n`.*` が貪欲なので `Hello</b><b>World` まで取り込み、文字列全体に一致します。\n\n<b>遅延（lazy）</b>にするには `?` を付けます:\n\n```javascript\nconsole.log(text.match(/<b>.*?<\\/b>/));\n// <b>Hello</b>\n```\n\n```text\n.*   greedy\n.*?  lazy\n```\n\n貪欲な一致は、特に構造化されたテキストで、意図より多くのデータを黙って取り込むことがあります。\n\n---\n\n### キャプチャグループ\n\n丸括弧が<b>キャプチャグループ</b>を作ります。\n\n```javascript\nconst regex = /(\\d{4})-(\\d{2})-(\\d{2})/;\n\nconst result = \"2026-08-26\".match(regex);\n\nconsole.log(result[1]); // 2026\nconsole.log(result[2]); // 08\nconsole.log(result[3]); // 26\n```\n\n<b>名前付きグループ</b>も作れます:\n\n```javascript\nconst regex =\n  /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;\n\nconst result = \"2026-08-26\".match(regex);\n\nconsole.log(result.groups.year);  // 2026\nconsole.log(result.groups.month); // 08\nconsole.log(result.groups.day);   // 26\n```\n\n複雑なパターンでは名前付きグループの方がずっと読みやすくなります。\n\n---\n\n### 後方参照\n\n後方参照は<b>前にキャプチャしたのと同じテキスト</b>に一致します。\n\n```javascript\nconst regex = /\\b(\\w+)\\s+\\1\\b/i;\n\nconsole.log(regex.test(\"hello hello\")); // true\nconsole.log(regex.test(\"hello world\")); // false\n```\n\n`(\\w+)` が `hello` をキャプチャし、`\\1` が同じ値をもう一度要求します。\n\n名前付き後方参照: `/(?<word>\\w+)\\s+\\k<word>/i`。\n\n---\n\n### 先読みと後読み\n\n先読み・後読みは、周囲のテキストを<b>消費せずに</b>確認します。\n\n```javascript\n\"100 dollars\".match(/\\d+(?= dollars)/); // [\"100\"] — 肯定先読み\n\"$100\".match(/(?<=\\$)\\d+/);             // [\"100\"] — 肯定後読み\n```\n\n否定形は条件を反転させます:\n\n```javascript\n/\\d+(?! dollars)/   // digits NOT followed by \" dollars\"\n/(?<!\\$)\\d+/        // digits NOT preceded by \"$\"\n```\n\n> <b>先読み・後読みは文脈を調べるが、その文脈は一致結果に含めない。</b>",
      },
      diagram: `"<b>Hello</b><b>World</b>"

/<b>.*<\\/b>/     greedy → matches the whole string
/<b>.*?<\\/b>/    lazy   → matches <b>Hello</b>


(\\d{4})-(\\d{2})-(\\d{2})
   │        │        │
 group 1  group 2  group 3

(?<year>...)  named group → result.groups.year


\\1            backreference to group 1
\\k<word>      named backreference


(?= )   positive lookahead     (?! )   negative lookahead
(?<= )  positive lookbehind    (?<! )  negative lookbehind
        context is checked, never consumed`,
      codeExample: {
        title: { en: "Matching less, capturing more", np: "कम match, धेरै capture", jp: "少なく一致し、多くを捉える" },
        code: `// ── 1. Basic — greedy versus lazy ─────────────────────────────────
const text = "<b>Hello</b><b>World</b>";

console.log(text.match(/<b>.*<\\/b>/)[0]);  // whole string — greedy
console.log(text.match(/<b>.*?<\\/b>/)[0]); // <b>Hello</b> — lazy

// ── 2. Intermediate — capture groups, numbered and named ──────────
const numbered = "2026-08-26".match(/(\\d{4})-(\\d{2})-(\\d{2})/);

console.log(numbered[1], numbered[2], numbered[3]); // 2026 08 26

const named = "2026-08-26".match(
  /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/
);

console.log(named.groups.year, named.groups.month, named.groups.day);

// ── 3. Advanced — backreferences find repeated words ──────────────
const doubled = /\\b(\\w+)\\s+\\1\\b/i;

console.log(doubled.test("hello hello")); // true
console.log(doubled.test("hello world")); // false

// ── Lookarounds check context without consuming it ────────────────
console.log("100 dollars".match(/\\d+(?= dollars)/)[0]); // "100"
console.log("$100".match(/(?<=\\$)\\d+/)[0]);             // "100"`,
      },
      keyTakeaways: [
        { en: "Quantifiers are <b>greedy by default</b>; adding `?` makes them lazy, as in `.*?`.", np: "Quantifier <b>default मा greedy</b> हुन्छन्; `?` थप्दा lazy बन्छन्, जस्तै `.*?`।", jp: "量指定子は<b>既定で貪欲</b>。`?` を付けると `.*?` のように遅延になる。" },
        { en: "Greedy matching can quietly swallow more text than you meant, especially in HTML-like input.", np: "Greedy matching ले चुपचाप सोचेभन्दा धेरै पाठ निल्न सक्छ, विशेष गरी HTML जस्तो input मा।", jp: "貪欲な一致は、特にHTMLのような入力で、意図より多くを黙って飲み込む。" },
        { en: "Parentheses create <b>capture groups</b>, read as `result[1]`, `result[2]` and so on.", np: "कोष्ठकले <b>capture group</b> बनाउँछ, `result[1]`, `result[2]` आदि रूपमा पढिन्छ।", jp: "丸括弧が<b>キャプチャグループ</b>を作り、`result[1]`・`result[2]` などで読む。" },
        { en: "<b>Named groups</b> `(?<year>...)` read far better than numbered ones in complex patterns.", np: "जटिल pattern मा <b>named group</b> `(?<year>...)` संख्या भएका भन्दा धेरै राम्रो पढिन्छ।", jp: "複雑なパターンでは<b>名前付きグループ</b> `(?<year>...)` の方が番号よりずっと読みやすい。" },
        { en: "A <b>backreference</b> (`\\1` or `\\k<name>`) matches the same text captured earlier.", np: "<b>Backreference</b> (`\\1` वा `\\k<name>`) ले अघि capture गरिएकै पाठ match गर्छ।", jp: "<b>後方参照</b>（`\\1` や `\\k<name>`）は前にキャプチャした同じテキストに一致する。" },
        { en: "<b>Lookarounds</b> inspect context without including it in the match: `(?=)`, `(?!)`, `(?<=)`, `(?<!)`.", np: "<b>Lookaround</b> ले context जाँच्छ तर match मा समावेश गर्दैन: `(?=)`, `(?!)`, `(?<=)`, `(?<!)`।", jp: "<b>先読み・後読み</b>は文脈を調べるが一致には含めない: `(?=)`・`(?!)`・`(?<=)`・`(?<!)`。" },
      ],
      commonMistakes: [
        { en: "<b>Using `.*` where you meant one element</b> — `/<b>.*<\\/b>/` swallows everything up to the last `</b>`. Use the lazy `.*?`.", np: "<b>एउटा element भन्न खोज्दा `.*` प्रयोग गर्नु</b> — `/<b>.*<\\/b>/` ले अन्तिम `</b>` सम्म सबै निल्छ। Lazy `.*?` प्रयोग गर्नुहोस्।", jp: "<b>1つの要素のつもりで `.*` を使う</b> — `/<b>.*<\\/b>/` は最後の `</b>` まで飲み込む。遅延の `.*?` を使う。" },
        { en: "<b>Counting group numbers by hand in a long pattern</b> — add one group and every index shifts. Use named groups instead.", np: "<b>लामो pattern मा group संख्या हातले गन्नु</b> — एउटा group थप्दा हरेक index सर्छ। बरु named group प्रयोग गर्नुहोस्।", jp: "<b>長いパターンでグループ番号を手で数える</b> — 1つ足すだけで全部の番号がずれる。名前付きグループを使う。" },
        { en: "<b>Expecting a lookahead to appear in the match</b> — `/\\d+(?= dollars)/` returns only `\"100\"`, never `\" dollars\"`.", np: "<b>Lookahead match मा देखिन्छ भन्ने आशा गर्नु</b> — `/\\d+(?= dollars)/` ले `\"100\"` मात्र फर्काउँछ, `\" dollars\"` कहिल्यै होइन।", jp: "<b>先読みが一致結果に含まれると思う</b> — `/\\d+(?= dollars)/` が返すのは `\"100\"` だけで、`\" dollars\"` は含まれない。" },
      ],
      quiz: [
        {
          question: { en: "What does adding `?` after `.*` do?", np: "`.*` पछि `?` थप्दा के हुन्छ?", jp: "`.*` の後に `?` を付けると何が起こるか?" },
          options: [
            { en: "Makes it lazy, matching as little as possible", np: "यसलाई lazy बनाउँछ, सकेसम्म थोरै match गर्छ", jp: "遅延にして、できるだけ少なく一致させる" },
            { en: "Makes it optional", np: "यसलाई वैकल्पिक बनाउँछ", jp: "省略可能にする" },
            { en: "Makes it case-insensitive", np: "यसलाई case-insensitive बनाउँछ", jp: "大文字小文字を区別しなくする" },
          ],
          correctIndex: 0,
          explanation: { en: "`.*` grabs as much as it can; `.*?` stops at the first chance.", np: "`.*` ले सकेसम्म धेरै लिन्छ; `.*?` पहिलो मौकामै रोकिन्छ।", jp: "`.*` は可能な限り取り込み、`.*?` は最初の機会で止まる。" },
        },
        {
          question: { en: "How do you read a named group `(?<year>\\d{4})` from a match?", np: "Match बाट named group `(?<year>\\d{4})` कसरी पढ्नुहुन्छ?", jp: "一致結果から名前付きグループ `(?<year>\\d{4})` をどう読むか?" },
          options: [
            { en: "`result.year`", np: "`result.year`", jp: "`result.year`" },
            { en: "`result.groups.year`", np: "`result.groups.year`", jp: "`result.groups.year`" },
            { en: "`result[\"year\"]`", np: "`result[\"year\"]`", jp: "`result[\"year\"]`" },
          ],
          correctIndex: 1,
          explanation: { en: "Named captures land on the `groups` object of the match result.", np: "Named capture match नतिजाको `groups` object मा पर्छन्।", jp: "名前付きキャプチャは一致結果の `groups` オブジェクトに入る。" },
        },
        {
          question: { en: "What does `(?=...)` do?", np: "`(?=...)` ले के गर्छ?", jp: "`(?=...)` は何をするか?" },
          options: [
            { en: "Captures the text inside it", np: "यसभित्रको पाठ capture गर्छ", jp: "中のテキストをキャプチャする" },
            { en: "Makes the group optional", np: "Group लाई वैकल्पिक बनाउँछ", jp: "グループを省略可能にする" },
            { en: "Checks what follows without including it in the match", np: "पछाडि के छ जाँच्छ तर match मा समावेश गर्दैन", jp: "後に続くものを確認するが、一致には含めない" },
          ],
          correctIndex: 2,
          explanation: { en: "That is why `/\\d+(?= dollars)/` on `\"100 dollars\"` returns just `\"100\"`.", np: "त्यसैले `\"100 dollars\"` मा `/\\d+(?= dollars)/` ले `\"100\"` मात्र फर्काउँछ।", jp: "だから `\"100 dollars\"` に対する `/\\d+(?= dollars)/` は `\"100\"` だけを返す。" },
        },
      ],
    },
    {
      id: "regex-apis-redos",
      title: { en: "Matching APIs, replace() & ReDoS", np: "Matching API, replace() र ReDoS", jp: "照合API・replace()・ReDoS" },
      durationMinutes: 9,
      explanation: {
        en: "JavaScript provides several APIs for working with regex, and they differ in what they return and whether they keep state.\n\n### `match()`\n\n```javascript\nconst text = \"cat dog cat\";\n\nconsole.log(text.match(/cat/g));\n// [\"cat\", \"cat\"]\n```\n\nWithout `g`, it also gives capture-group information:\n\n```javascript\n\"hello 123\".match(/(\\w+)\\s(\\d+)/);\n```\n\n---\n\n### `matchAll()`\n\nUseful when you need <b>all matches plus their capture groups</b>.\n\n```javascript\nconst text = \"John:25, Rajan:29\";\n\nconst regex = /(\\w+):(\\d+)/g;\n\nfor (const match of text.matchAll(regex)) {\n  console.log(match[1], match[2]);\n}\n// John 25\n// Rajan 29\n```\n\n`matchAll()` requires a global or sticky regex.\n\n---\n\n### `exec()`\n\n`exec()` returns the next match and updates `lastIndex` when using `g`.\n\n```javascript\nconst regex = /\\d+/g;\n\nconsole.log(regex.exec(\"Age 29\")); // [\"29\"]\nconsole.log(regex.exec(\"Age 29\")); // null\n```\n\nIt is useful when you need <b>manual, stateful iteration</b> through matches.\n\n---\n\n### `replace()` with a function\n\n```javascript\nconst text = \"Price: $100\";\n\nconst result = text.replace(\n  /\\$(\\d+)/,\n  (_, amount) => `$${Number(amount) * 2}`\n);\n\nconsole.log(result);\n// Price: $200\n```\n\nThe callback receives the matched text and captured groups, which lets you perform <b>logic during replacement</b> rather than substituting a fixed string.\n\n---\n\n### Catastrophic backtracking and ReDoS\n\nSome patterns become extremely slow on carefully constructed input.\n\n```javascript\nconst regex = /^(a+)+$/;\n```\n\nThis looks harmless, but a string such as `aaaaaaaaaaaaaaaaaaaaX` can make the engine explore an enormous number of paths before concluding it doesn't match. This is <b>catastrophic backtracking</b>, and in an app that processes user input it can cause a <b>Regular Expression Denial of Service (ReDoS)</b>.\n\nBe careful with:\n\n```text\nnested quantifiers\nambiguous alternatives\nlarge uncontrolled input\n```\n\nPatterns resembling `(a+)+`, `(a|aa)+` and `(.*)+` deserve scrutiny.\n\n> <b>Regex is powerful, but don't blindly run complex patterns against unlimited user input.</b>",
        np: "JavaScript ले regex सँग काम गर्न धेरै API दिन्छ, र तिनी के फर्काउँछन् र state राख्छन् कि राख्दैनन् भन्नेमा फरक छन्।\n\n### `match()`\n\n```javascript\nconst text = \"cat dog cat\";\n\nconsole.log(text.match(/cat/g));\n// [\"cat\", \"cat\"]\n```\n\n`g` बिना, यसले capture-group जानकारी पनि दिन्छ:\n\n```javascript\n\"hello 123\".match(/(\\w+)\\s(\\d+)/);\n```\n\n---\n\n### `matchAll()`\n\n<b>सबै match सँगै तिनका capture group</b> चाहिँदा उपयोगी।\n\n```javascript\nconst text = \"John:25, Rajan:29\";\n\nconst regex = /(\\w+):(\\d+)/g;\n\nfor (const match of text.matchAll(regex)) {\n  console.log(match[1], match[2]);\n}\n// John 25\n// Rajan 29\n```\n\n`matchAll()` लाई global वा sticky regex चाहिन्छ।\n\n---\n\n### `exec()`\n\n`g` प्रयोग गर्दा `exec()` ले अर्को match फर्काउँछ र `lastIndex` अद्यावधिक गर्छ।\n\n```javascript\nconst regex = /\\d+/g;\n\nconsole.log(regex.exec(\"Age 29\")); // [\"29\"]\nconsole.log(regex.exec(\"Age 29\")); // null\n```\n\nMatch मार्फत <b>हातले, stateful iteration</b> चाहिँदा यो उपयोगी छ।\n\n---\n\n### Function सँग `replace()`\n\n```javascript\nconst text = \"Price: $100\";\n\nconst result = text.replace(\n  /\\$(\\d+)/,\n  (_, amount) => `$${Number(amount) * 2}`\n);\n\nconsole.log(result);\n// Price: $200\n```\n\nCallback ले match भएको पाठ र capture गरिएका group पाउँछ, जसले निश्चित string राख्नुको साटो <b>replacement कै बेला logic</b> चलाउन दिन्छ।\n\n---\n\n### Catastrophic backtracking र ReDoS\n\nकेही pattern होसियारीपूर्वक बनाइएको input मा अत्यन्तै ढिलो हुन्छन्।\n\n```javascript\nconst regex = /^(a+)+$/;\n```\n\nयो निर्दोष देखिन्छ, तर `aaaaaaaaaaaaaaaaaaaaX` जस्तो string ले engine लाई match हुँदैन भन्ने निष्कर्षमा पुग्नुअघि अत्यन्तै धेरै बाटो खोज्न लगाउन सक्छ। यसलाई <b>catastrophic backtracking</b> भनिन्छ, र user input process गर्ने app मा यसले <b>Regular Expression Denial of Service (ReDoS)</b> निम्त्याउन सक्छ।\n\nयीमा होसियार हुनुहोस्:\n\n```text\nnested quantifiers\nambiguous alternatives\nlarge uncontrolled input\n```\n\n`(a+)+`, `(a|aa)+` र `(.*)+` जस्ता pattern लाई ध्यान दिनुपर्छ।\n\n> <b>Regex शक्तिशाली छ, तर असीमित user input माथि जटिल pattern आँखा चिम्लेर नचलाउनुहोस्।</b>",
        jp: "JavaScriptには正規表現を扱うAPIがいくつかあり、返すものと状態を持つかどうかが違います。\n\n### `match()`\n\n```javascript\nconst text = \"cat dog cat\";\n\nconsole.log(text.match(/cat/g));\n// [\"cat\", \"cat\"]\n```\n\n`g` がなければ、キャプチャグループの情報も返します:\n\n```javascript\n\"hello 123\".match(/(\\w+)\\s(\\d+)/);\n```\n\n---\n\n### `matchAll()`\n\n<b>すべての一致とそのキャプチャグループ</b>が必要なときに便利です。\n\n```javascript\nconst text = \"John:25, Rajan:29\";\n\nconst regex = /(\\w+):(\\d+)/g;\n\nfor (const match of text.matchAll(regex)) {\n  console.log(match[1], match[2]);\n}\n// John 25\n// Rajan 29\n```\n\n`matchAll()` にはglobalまたはstickyの正規表現が必要です。\n\n---\n\n### `exec()`\n\n`g` を使うと `exec()` は次の一致を返し、`lastIndex` を更新します。\n\n```javascript\nconst regex = /\\d+/g;\n\nconsole.log(regex.exec(\"Age 29\")); // [\"29\"]\nconsole.log(regex.exec(\"Age 29\")); // null\n```\n\n一致を<b>手動で、状態を保ちながら</b>たどりたいときに役立ちます。\n\n---\n\n### 関数を渡す `replace()`\n\n```javascript\nconst text = \"Price: $100\";\n\nconst result = text.replace(\n  /\\$(\\d+)/,\n  (_, amount) => `$${Number(amount) * 2}`\n);\n\nconsole.log(result);\n// Price: $200\n```\n\nコールバックは一致したテキストとキャプチャグループを受け取るので、固定の文字列に置き換えるのではなく<b>置換の最中にロジック</b>を実行できます。\n\n---\n\n### 破滅的バックトラッキングとReDoS\n\n一部のパターンは、巧妙に作られた入力に対して極端に遅くなります。\n\n```javascript\nconst regex = /^(a+)+$/;\n```\n\n無害に見えますが、`aaaaaaaaaaaaaaaaaaaaX` のような文字列を与えると、一致しないと結論するまでにエンジンが膨大な経路を探索しかねません。これが<b>破滅的バックトラッキング</b>で、ユーザー入力を処理するアプリでは<b>正規表現によるサービス拒否（ReDoS）</b>につながります。\n\n次には注意しましょう:\n\n```text\nnested quantifiers\nambiguous alternatives\nlarge uncontrolled input\n```\n\n`(a+)+`・`(a|aa)+`・`(.*)+` のようなパターンは要注意です。\n\n> <b>正規表現は強力だが、無制限のユーザー入力に複雑なパターンを無警戒に走らせない。</b>",
      },
      diagram: `match()      convenient          all matches with /g, groups without
matchAll()   all + groups        needs /g or /y, returns an iterator
exec()       stateful iteration  one match per call, moves lastIndex
replace(fn)  logic per match     callback gets the match and groups


Catastrophic backtracking

/^(a+)+$/  against  "aaaaaaaaaaaaaaaaaaaaX"
        │
        ├── nested quantifier
        ├── engine tries a huge number of splits
        └── slow enough to hang a request  → ReDoS

Watch for:  (a+)+    (a|aa)+    (.*)+`,
      codeExample: {
        title: { en: "Four APIs, and the pattern that hangs", np: "चार API, र अड्काउने pattern", jp: "4つのAPIと、止まるパターン" },
        code: `// ── 1. Basic — match() for a quick list ───────────────────────────
console.log("cat dog cat".match(/cat/g)); // ["cat", "cat"]

// Without /g you get capture groups instead
console.log("hello 123".match(/(\\w+)\\s(\\d+)/));

// ── 2. Intermediate — matchAll() for matches plus groups ──────────
const text = "John:25, Rajan:29";

for (const match of text.matchAll(/(\\w+):(\\d+)/g)) {
  console.log(match[1], match[2]); // John 25, then Rajan 29
}

// ── exec() steps through one match at a time ──────────────────────
const stateful = /\\d+/g;

console.log(stateful.exec("Age 29")); // ["29"]
console.log(stateful.exec("Age 29")); // null — lastIndex moved

// ── 3. Advanced — replace() with a function ───────────────────────
const priced = "Price: $100".replace(
  /\\$(\\d+)/,
  (_, amount) => \`$\${Number(amount) * 2}\`
);

console.log(priced); // "Price: $200"

// ── Patterns to scrutinise before running on user input ───────────
// /^(a+)+$/ against "aaaaaaaaaaaaaaaaaaaaX" can hang the engine
// Nested quantifiers like (a+)+, (a|aa)+ and (.*)+ risk ReDoS`,
      },
      keyTakeaways: [
        { en: "`match()` is convenient: all matches with `/g`, capture groups without it.", np: "`match()` सुविधाजनक छ: `/g` सँग सबै match, बिना capture group।", jp: "`match()` は手軽。`/g` 付きならすべての一致、なしならキャプチャグループ。" },
        { en: "`matchAll()` gives <b>all matches plus their groups</b>, and needs a global or sticky regex.", np: "`matchAll()` ले <b>सबै match सँगै तिनका group</b> दिन्छ, र global वा sticky regex चाहिन्छ।", jp: "`matchAll()` は<b>すべての一致とグループ</b>を返し、globalかstickyの正規表現が必要。" },
        { en: "`exec()` gives <b>stateful control</b>, returning one match per call and moving `lastIndex`.", np: "`exec()` ले <b>stateful नियन्त्रण</b> दिन्छ, प्रति call एउटा match फर्काउँछ र `lastIndex` सार्छ।", jp: "`exec()` は<b>状態を伴う制御</b>を与え、呼び出しごとに1件返して `lastIndex` を進める。" },
        { en: "`replace()` accepts a <b>function</b>, so you can compute the replacement from the match and its groups.", np: "`replace()` ले <b>function</b> स्वीकार गर्छ, त्यसैले match र यसका group बाट replacement गणना गर्न सकिन्छ।", jp: "`replace()` は<b>関数</b>を受け取れるので、一致とグループから置換内容を計算できる。" },
        { en: "Complex patterns can suffer <b>catastrophic backtracking</b>, which becomes a ReDoS risk on user input.", np: "जटिल pattern ले <b>catastrophic backtracking</b> भोग्न सक्छन्, जुन user input मा ReDoS जोखिम बन्छ।", jp: "複雑なパターンは<b>破滅的バックトラッキング</b>に陥ることがあり、ユーザー入力ではReDoSの危険になる。" },
        { en: "Treat nested quantifiers, ambiguous alternatives and unbounded input as warning signs.", np: "Nested quantifier, अस्पष्ट विकल्प र असीमित input लाई चेतावनीको संकेत मान्नुहोस्।", jp: "入れ子の量指定子・曖昧な選択肢・無制限の入力は危険信号と考える。" },
      ],
      commonMistakes: [
        { en: "<b>Calling `matchAll()` without a global flag</b> — it throws a `TypeError`. Add `/g` (or `/y`).", np: "<b>Global flag बिना `matchAll()` call गर्नु</b> — यसले `TypeError` दिन्छ। `/g` (वा `/y`) थप्नुहोस्।", jp: "<b>globalフラグなしで `matchAll()` を呼ぶ</b> — `TypeError` になる。`/g`（または `/y`）を付ける。" },
        { en: "<b>Calling `exec()` in a loop without noticing `lastIndex`</b> — the second call on the same string can return `null`. That statefulness is the point, but it surprises people.", np: "<b>`lastIndex` ध्यान नदिई loop मा `exec()` call गर्नु</b> — उही string मा दोस्रो call ले `null` फर्काउन सक्छ। त्यो statefulness नै उद्देश्य हो, तर मानिसलाई अचम्ममा पार्छ।", jp: "<b>`lastIndex` に気づかず `exec()` をループで呼ぶ</b> — 同じ文字列への2回目が `null` を返しうる。その状態性が本質だが、驚かれやすい。" },
        { en: "<b>Running an unvetted complex pattern on user input</b> — a nested quantifier like `(a+)+` can hang a request. Simplify the pattern, or bound the input length.", np: "<b>User input मा जाँच नगरिएको जटिल pattern चलाउनु</b> — `(a+)+` जस्तो nested quantifier ले request अड्काउन सक्छ। Pattern सरल बनाउनुहोस्, वा input को लम्बाइ सीमित गर्नुहोस्।", jp: "<b>検証していない複雑なパターンをユーザー入力に走らせる</b> — `(a+)+` のような入れ子の量指定子はリクエストを止めうる。パターンを単純にするか、入力長を制限する。" },
      ],
      quiz: [
        {
          question: { en: "Which API returns every match together with its capture groups?", np: "कुन API ले हरेक match सँगै यसका capture group फर्काउँछ?", jp: "各一致とそのキャプチャグループをまとめて返すAPIはどれか?" },
          options: [
            { en: "`matchAll()`", np: "`matchAll()`", jp: "`matchAll()`" },
            { en: "`match()`", np: "`match()`", jp: "`match()`" },
            { en: "`test()`", np: "`test()`", jp: "`test()`" },
          ],
          correctIndex: 0,
          explanation: { en: "`match()` with `/g` drops the group information; `matchAll()` keeps it.", np: "`/g` सँगको `match()` ले group जानकारी हटाउँछ; `matchAll()` ले राख्छ।", jp: "`/g` 付きの `match()` はグループ情報を失うが、`matchAll()` は保持する。" },
        },
        {
          question: { en: "What does `replace()` gain from a function replacement?", np: "Function replacement ले `replace()` लाई के दिन्छ?", jp: "置換に関数を渡すと `replace()` は何を得るか?" },
          options: [
            { en: "It runs faster", np: "यो छिटो चल्छ", jp: "速く動く" },
            { en: "It can compute the replacement from the match and its groups", np: "यसले match र यसका group बाट replacement गणना गर्न सक्छ", jp: "一致とグループから置換内容を計算できる" },
            { en: "It becomes case-insensitive", np: "यो case-insensitive बन्छ", jp: "大文字小文字を区別しなくなる" },
          ],
          correctIndex: 1,
          explanation: { en: "The callback receives the matched text and captures, so logic can run per match.", np: "Callback ले match भएको पाठ र capture पाउँछ, त्यसैले प्रति match logic चल्न सक्छ।", jp: "コールバックが一致テキストとキャプチャを受け取るので、一致ごとに処理を実行できる。" },
        },
        {
          question: { en: "What makes `/^(a+)+$/` dangerous on user input?", np: "User input मा `/^(a+)+$/` लाई के ले खतरनाक बनाउँछ?", jp: "ユーザー入力に対して `/^(a+)+$/` が危険なのはなぜか?" },
          options: [
            { en: "It always matches everything", np: "यसले सधैं सबै match गर्छ", jp: "常にすべてに一致するから" },
            { en: "It is invalid syntax", np: "यो अवैध syntax हो", jp: "構文として不正だから" },
            { en: "Nested quantifiers can cause catastrophic backtracking, a ReDoS risk", np: "Nested quantifier ले catastrophic backtracking निम्त्याउन सक्छ, ReDoS जोखिम", jp: "入れ子の量指定子が破滅的バックトラッキングを招き、ReDoSの危険になるから" },
          ],
          correctIndex: 2,
          explanation: { en: "A non-matching string like `aaaa...X` forces the engine through a huge search space.", np: "`aaaa...X` जस्तो match नहुने string ले engine लाई विशाल खोज क्षेत्र घुम्न बाध्य पार्छ।", jp: "`aaaa...X` のような一致しない文字列が、エンジンに膨大な探索を強いる。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Which flag makes `^` and `$` match at each line instead of the whole input?", np: "कुन flag ले `^` र `$` लाई पूरै input होइन, हरेक line मा match गराउँछ?", jp: "`^` と `$` を入力全体ではなく各行に一致させるフラグは?" },
      options: [
        { en: "`m`", np: "`m`", jp: "`m`" },
        { en: "`g`", np: "`g`", jp: "`g`" },
        { en: "`s`", np: "`s`", jp: "`s`" },
      ],
      correctIndex: 0,
      explanation: { en: "`s` makes the dot match newlines, and `g` finds every match.", np: "`s` ले dot लाई newline match गराउँछ, र `g` ले हरेक match भेट्टाउँछ।", jp: "`s` はドットを改行に一致させ、`g` はすべての一致を見つける。" },
    },
    {
      question: { en: "Why can a reused `/g` regex return `false` on a string it just matched?", np: "भर्खरै match गरेको string मा पुनः प्रयोग गरिएको `/g` regex ले किन `false` फर्काउन सक्छ?", jp: "直前に一致した文字列に対して、使い回した `/g` の正規表現が `false` を返すのはなぜか?" },
      options: [
        { en: "Because `/g` disables `test()`", np: "किनकि `/g` ले `test()` निष्क्रिय पार्छ", jp: "`/g` が `test()` を無効にするから" },
        { en: "Because `lastIndex` resumed the search past the match", np: "किनकि `lastIndex` ले match पछिबाट खोजी सुरु गर्‍यो", jp: "`lastIndex` が一致の後から検索を再開するから" },
        { en: "Because strings are immutable", np: "किनकि string immutable हुन्छन्", jp: "文字列がイミュータブルだから" },
      ],
      correctIndex: 1,
      explanation: { en: "Reset with `regex.lastIndex = 0`, or build a fresh regex each time.", np: "`regex.lastIndex = 0` ले reset गर्नुहोस्, वा हरेक पटक नयाँ regex बनाउनुहोस्।", jp: "`regex.lastIndex = 0` でリセットするか、毎回新しい正規表現を作る。" },
    },
    {
      question: { en: "What does `/^\\d+$/` check that `/\\d+/` does not?", np: "`/\\d+/` ले नजाँच्ने के कुरा `/^\\d+$/` ले जाँच्छ?", jp: "`/\\d+/` にはできず `/^\\d+$/` にできる確認は?" },
      options: [
        { en: "That the string contains a digit", np: "String मा अंक छ भन्ने", jp: "文字列に数字が含まれること" },
        { en: "That the digits are unique", np: "अंक अद्वितीय छन् भन्ने", jp: "数字が重複していないこと" },
        { en: "That the whole string is digits from start to end", np: "पूरै string सुरुदेखि अन्त्यसम्म अंक छ भन्ने", jp: "文字列全体が最初から最後まで数字であること" },
      ],
      correctIndex: 2,
      explanation: { en: "Anchors turn a search into a validation.", np: "Anchor ले खोजीलाई प्रमाणीकरणमा बदल्छ।", jp: "アンカーが検索を検証に変える。" },
    },
    {
      question: { en: "What is the difference between `.*` and `.*?`", np: "`.*` र `.*?` बीच के फरक छ?", jp: "`.*` と `.*?` の違いは?" },
      options: [
        { en: "`.*` is greedy, `.*?` is lazy", np: "`.*` greedy हो, `.*?` lazy", jp: "`.*` が貪欲で `.*?` が遅延" },
        { en: "`.*` is lazy, `.*?` is greedy", np: "`.*` lazy हो, `.*?` greedy", jp: "`.*` が遅延で `.*?` が貪欲" },
        { en: "They are identical", np: "तिनी उस्तै हुन्", jp: "同じもの" },
      ],
      correctIndex: 0,
      explanation: { en: "Greedy takes as much as it can; lazy stops at the earliest possible point.", np: "Greedy ले सकेसम्म धेरै लिन्छ; lazy सबैभन्दा चाँडो सम्भव बिन्दुमा रोकिन्छ।", jp: "貪欲は可能な限り取り込み、遅延は最も早い時点で止まる。" },
    },
    {
      question: { en: "How do you read a named capture group from a match result?", np: "Match नतिजाबाट named capture group कसरी पढ्नुहुन्छ?", jp: "一致結果から名前付きキャプチャグループをどう読むか?" },
      options: [
        { en: "`result.name`", np: "`result.name`", jp: "`result.name`" },
        { en: "`result.groups.name`", np: "`result.groups.name`", jp: "`result.groups.name`" },
        { en: "`result[0].name`", np: "`result[0].name`", jp: "`result[0].name`" },
      ],
      correctIndex: 1,
      explanation: { en: "Named captures collect on the `groups` object, which beats counting indexes.", np: "Named capture `groups` object मा जम्मा हुन्छन्, जुन index गन्नु भन्दा राम्रो।", jp: "名前付きキャプチャは `groups` オブジェクトに集まる。番号を数えるより良い。" },
    },
    {
      question: { en: "What does a backreference like `\\1` match?", np: "`\\1` जस्तो backreference ले के match गर्छ?", jp: "`\\1` のような後方参照は何に一致するか?" },
      options: [
        { en: "Any single character", np: "जुनसुकै एउटा अक्षर", jp: "任意の1文字" },
        { en: "The first character of the string", np: "String को पहिलो अक्षर", jp: "文字列の最初の文字" },
        { en: "The same text captured by group 1 earlier", np: "अघि group 1 ले capture गरेकै पाठ", jp: "前にグループ1がキャプチャした同じテキスト" },
      ],
      correctIndex: 2,
      explanation: { en: "That is how `/\\b(\\w+)\\s+\\1\\b/` finds a repeated word.", np: "त्यसै गरी `/\\b(\\w+)\\s+\\1\\b/` ले दोहोरिएको शब्द भेट्टाउँछ।", jp: "そうやって `/\\b(\\w+)\\s+\\1\\b/` は繰り返された単語を見つける。" },
    },
    {
      question: { en: "Does a lookahead appear in the matched text?", np: "Lookahead match भएको पाठमा देखिन्छ?", jp: "先読みは一致したテキストに含まれるか?" },
      options: [
        { en: "No — it checks context without consuming it", np: "होइन — यसले नखाइकन context जाँच्छ", jp: "いいえ。消費せずに文脈を確認するだけ" },
        { en: "Yes, it is captured too", np: "हो, यो पनि capture हुन्छ", jp: "はい、これもキャプチャされる" },
      ],
      correctIndex: 0,
      explanation: { en: "`/\\d+(?= dollars)/` on `\"100 dollars\"` returns only `\"100\"`.", np: "`\"100 dollars\"` मा `/\\d+(?= dollars)/` ले `\"100\"` मात्र फर्काउँछ।", jp: "`\"100 dollars\"` に対する `/\\d+(?= dollars)/` は `\"100\"` だけを返す。" },
    },
    {
      question: { en: "Which API requires a global or sticky regex?", np: "कुन API लाई global वा sticky regex चाहिन्छ?", jp: "globalまたはstickyの正規表現が必要なAPIはどれか?" },
      options: [
        { en: "`match()`", np: "`match()`", jp: "`match()`" },
        { en: "`matchAll()`", np: "`matchAll()`", jp: "`matchAll()`" },
        { en: "`test()`", np: "`test()`", jp: "`test()`" },
      ],
      correctIndex: 1,
      explanation: { en: "Calling it with a plain regex throws a `TypeError`.", np: "साधारण regex सँग call गर्दा `TypeError` आउँछ।", jp: "フラグなしの正規表現で呼ぶと `TypeError` になる。" },
    },
    {
      question: { en: "What is the risk behind a pattern like `(a+)+` on user input?", np: "User input मा `(a+)+` जस्तो pattern पछाडिको जोखिम के हो?", jp: "ユーザー入力に対する `(a+)+` のようなパターンの危険は?" },
      options: [
        { en: "It silently ignores matches", np: "यसले चुपचाप match बेवास्ता गर्छ", jp: "一致を黙って無視する" },
        { en: "It only works in Node.js", np: "यो Node.js मा मात्र काम गर्छ", jp: "Node.jsでしか動かない" },
        { en: "Catastrophic backtracking, which can cause a ReDoS", np: "Catastrophic backtracking, जसले ReDoS निम्त्याउन सक्छ", jp: "破滅的バックトラッキングで、ReDoSにつながりうる" },
      ],
      correctIndex: 2,
      explanation: { en: "Nested quantifiers let one crafted string explode the engine's search space.", np: "Nested quantifier ले एउटै बनाइएको string ले engine को खोज क्षेत्र विस्फोट गराउन दिन्छ।", jp: "入れ子の量指定子により、細工した1つの文字列がエンジンの探索空間を爆発させる。" },
    },
  ],
};
