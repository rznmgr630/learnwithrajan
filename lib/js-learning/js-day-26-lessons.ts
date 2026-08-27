import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_26_LESSONS: JsLessonDay = {
  day: 26,
  title: { en: "TypeScript — types, interfaces, generics & utility types", np: "TypeScript — type, interface, generics र utility type", jp: "TypeScript — 型・インターフェース・ジェネリクス・ユーティリティ型" },
  totalMinutes: 43,
  difficulty: { en: "Intermediate", np: "मध्यम", jp: "中級" },
  lessons: [
    {
      id: "basic-types",
      title: { en: "Basic types, inference and narrowing", np: "आधारभूत type, inference र narrowing", jp: "基本の型・推論・絞り込み" },
      durationMinutes: 9,
      explanation: {
        en: "<b>TypeScript</b> is a <b>static type system</b> layered on top of JavaScript. <i>Static</i> here means the checking happens while you write and build the code, not while it runs. It describes what kind of values your variables, functions and APIs are expected to hold, and catches a large class of mistakes before the code runs.\n\nThe goal is not to annotate everything. It is to make <b>contracts explicit</b> — a <i>contract</i> being the promise about what a value looks like — plus better editor help, and safer <i>refactoring</i> (reshaping code without changing what it does).\n\n---\n\n### 1. Basic — let inference do the work\n\nMuch of the time you do not need an annotation at all:\n\n```typescript\nconst name = \"Alice\";   // string\nconst age = 30;         // number\nconst active = true;    // boolean\n```\n\nTo <i>annotate</i> is to write the type down yourself, like `: string`. Do it when the type says something useful, not to repeat what the compiler already worked out:\n\n```typescript\nconst scores: number[] = [90, 85, 92];\nconst tags: Array<string> = [\"javascript\", \"typescript\"];\n```\n\nBoth array forms mean the same thing. A <b>tuple</b> is a fixed-length array where each slot means something specific, so the position carries meaning.\n\n```typescript\nconst point: [number, number] = [10, 20];\nconst entry: [string, number] = [\"age\", 30];\n```\n\n---\n\n### 2. Intermediate — unions and narrowing\n\nA <b>union</b> (written with `|`) says a value may be one of several types:\n\n```typescript\nlet id: string | number;\n\nid = 123;\nid = \"user-123\";\n```\n\nTypeScript then refuses any operation that is not valid for <b>both</b> members, until you <b>narrow</b> it — that is, prove which one you actually have — with a check:\n\n```typescript\nfunction printId(id: string | number) {\n  if (typeof id === \"string\") {\n    console.log(id.toUpperCase());\n  } else {\n    console.log(id.toFixed(2));\n  }\n}\n```\n\n```text\nstring | number\n      │\n      ▼\n typeof id === \"string\"\n      │\n ┌────┴────┐\n ▼         ▼\nstring    number\n```\n\nInside each branch, only the operations valid for that member are allowed.\n\n---\n\n### 3. Advanced — literal types\n\nSometimes you do not want \"any string\", you want <b>these</b> strings:\n\n```typescript\ntype Direction = \"north\" | \"south\" | \"east\" | \"west\";\n\nlet heading: Direction = \"north\";\n\nheading = \"up\";   // Error: not assignable to Direction\n```\n\nThis is how you model application state, configuration and API contracts precisely:\n\n```typescript\ntype Status = \"pending\" | \"success\" | \"failed\";\n```\n\n---\n\n### Functions\n\nTypeScript describes both parameters and the return value:\n\n```typescript\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n```\n\n`?` marks an optional parameter, and a default value is inferred:\n\n```typescript\nfunction greet(name: string, greeting?: string): string {\n  return `${greeting ?? \"Hello\"}, ${name}`;\n}\n\nfunction repeat(text: string, times = 1) {   // times is number\n  return text.repeat(times);\n}\n```",
        np: "<b>TypeScript</b> JavaScript माथि राखिएको static type system हो। तपाईंका variable, function र API ले कस्ता मान बोक्ने अपेक्षा छ भन्ने वर्णन गर्छ, र code चल्नुअघि नै धेरै गल्ती समात्छ।\n\nलक्ष्य सबैतिर annotation थप्नु होइन। <b>सम्झौता स्पष्ट</b> बनाउनु, editor को सहयोग बढाउनु र refactor सुरक्षित बनाउनु हो।\n\n---\n\n### 1. आधारभूत — inference लाई काम गर्न दिनुहोस्\n\nधेरैजसो बेला annotation चाहिँदैन:\n\n```typescript\nconst name = \"Alice\";   // string\nconst age = 30;         // number\nconst active = true;    // boolean\n```\n\nType ले सम्झौता बताउँछ वा अस्पष्टता हटाउँछ भने मात्र annotate गर्नुहोस्, compiler ले जानेकै कुरा दोहोर्‍याउन होइन:\n\n```typescript\nconst scores: number[] = [90, 85, 92];\nconst tags: Array<string> = [\"javascript\", \"typescript\"];\n```\n\nदुबै array रूपको अर्थ उही हो। <b>Tuple</b> फरक छ: त्यहाँ स्थानले अर्थ बोक्छ।\n\n```typescript\nconst point: [number, number] = [10, 20];\nconst entry: [string, number] = [\"age\", 30];\n```\n\n---\n\n### 2. मध्यम — union र narrowing\n\n<b>Union</b> ले मान धेरैमध्ये एक हुन सक्छ भन्छ:\n\n```typescript\nlet id: string | number;\n\nid = 123;\nid = \"user-123\";\n```\n\nअनि TypeScript ले <b>दुबै</b> सदस्यका लागि मान्य नहुने operation अस्वीकार गर्छ, जबसम्म तपाईं जाँचले <b>narrow</b> गर्नुहुन्न:\n\n```typescript\nfunction printId(id: string | number) {\n  if (typeof id === \"string\") {\n    console.log(id.toUpperCase());\n  } else {\n    console.log(id.toFixed(2));\n  }\n}\n```\n\n```text\nstring | number\n      │\n      ▼\n typeof id === \"string\"\n      │\n ┌────┴────┐\n ▼         ▼\nstring    number\n```\n\nहरेक branch भित्र, त्यो सदस्यका लागि मान्य operation मात्र अनुमति हुन्छ।\n\n---\n\n### 3. उन्नत — literal type\n\nकहिलेकाहीं \"जुनसुकै string\" होइन, <b>यी</b> string चाहिन्छ:\n\n```typescript\ntype Direction = \"north\" | \"south\" | \"east\" | \"west\";\n\nlet heading: Direction = \"north\";\n\nheading = \"up\";   // Error: Direction मा assign गर्न मिल्दैन\n```\n\nApplication अवस्था, configuration र API सम्झौता ठ्याक्कै यसरी नै model गरिन्छ:\n\n```typescript\ntype Status = \"pending\" | \"success\" | \"failed\";\n```\n\n---\n\n### Function\n\nTypeScript ले parameter र फर्कने मान दुबै वर्णन गर्छ:\n\n```typescript\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n```\n\n`?` ले वैकल्पिक parameter जनाउँछ, र default मान inferred हुन्छ:\n\n```typescript\nfunction greet(name: string, greeting?: string): string {\n  return `${greeting ?? \"Hello\"}, ${name}`;\n}\n\nfunction repeat(text: string, times = 1) {   // times number हो\n  return text.repeat(times);\n}\n```",
        jp: "<b>TypeScript</b> はJavaScriptの上に載る静的型システム。変数・関数・APIがどんな値を持つ想定かを記述し、実行前に多くの誤りを捕まえる。\n\n目的はあらゆる場所に注釈を足すことではない。<b>契約を明示</b>し、エディタの支援を強め、リファクタリングを安全にすること。\n\n---\n\n### 1. 基本 — 推論に任せる\n\n多くの場合、注釈は不要:\n\n```typescript\nconst name = \"Alice\";   // string\nconst age = 30;         // number\nconst active = true;    // boolean\n```\n\n型が契約を伝えるときや曖昧さを消すときに注釈する。コンパイラが既に知っていることの繰り返しはしない:\n\n```typescript\nconst scores: number[] = [90, 85, 92];\nconst tags: Array<string> = [\"javascript\", \"typescript\"];\n```\n\n配列の2つの書き方は同じ意味。<b>タプル</b>は違い、位置が意味を持つ。\n\n```typescript\nconst point: [number, number] = [10, 20];\nconst entry: [string, number] = [\"age\", 30];\n```\n\n---\n\n### 2. 中級 — ユニオンと絞り込み\n\n<b>ユニオン</b>は値が複数の型のいずれかでありうることを表す:\n\n```typescript\nlet id: string | number;\n\nid = 123;\nid = \"user-123\";\n```\n\nTypeScriptは<b>両方</b>に有効でない操作を、判定で<b>絞り込む</b>まで拒む:\n\n```typescript\nfunction printId(id: string | number) {\n  if (typeof id === \"string\") {\n    console.log(id.toUpperCase());\n  } else {\n    console.log(id.toFixed(2));\n  }\n}\n```\n\n```text\nstring | number\n      │\n      ▼\n typeof id === \"string\"\n      │\n ┌────┴────┐\n ▼         ▼\nstring    number\n```\n\n各分岐の中では、その型に有効な操作だけが許される。\n\n---\n\n### 3. 上級 — リテラル型\n\n「任意の文字列」ではなく<b>この</b>文字列だけ、という場面がある:\n\n```typescript\ntype Direction = \"north\" | \"south\" | \"east\" | \"west\";\n\nlet heading: Direction = \"north\";\n\nheading = \"up\";   // Error: Direction に代入できない\n```\n\nアプリの状態・設定・APIの契約は、こうして正確に表す:\n\n```typescript\ntype Status = \"pending\" | \"success\" | \"failed\";\n```\n\n---\n\n### 関数\n\nTypeScriptは引数と戻り値の両方を記述する:\n\n```typescript\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n```\n\n`?` は任意の引数を示し、既定値からは型が推論される:\n\n```typescript\nfunction greet(name: string, greeting?: string): string {\n  return `${greeting ?? \"Hello\"}, ${name}`;\n}\n\nfunction repeat(text: string, times = 1) {   // times は number\n  return text.repeat(times);\n}\n```",
      },
      diagram: `Inference fills in what you did not write

const name = "Alice"      →  string
const age = 30            →  number
const scores = [90, 85]   →  number[]


A union has to be narrowed before you can use it

              string | number
                    │
                    ▼
            typeof id === "string"
                    │
             ┌──────┴──────┐
             ▼             ▼
          string         number
             │             │
      .toUpperCase()   .toFixed(2)


Array, tuple and literal, side by side

number[]                any length, all numbers
[number, number]        exactly two, position matters
"north" | "south"       one of these two strings only`,
      codeExample: {
        title: { en: "Inference, unions, narrowing and literals", np: "Inference, union, narrowing र literal", jp: "推論・ユニオン・絞り込み・リテラル" },
        code: `// ── Let inference do the work ─────────────────────────────────────
const name = "Alice";     // string
const age = 30;           // number
const active = true;      // boolean

// Annotate when it states a contract, not to restate the obvious
const scores: number[] = [90, 85, 92];
const tags: Array<string> = ["javascript", "typescript"];

// ── Tuples — position carries meaning ─────────────────────────────
const point: [number, number] = [10, 20];
const entry: [string, number] = ["age", 30];

// ── Unions and narrowing ──────────────────────────────────────────
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());   // narrowed to string here
  } else {
    console.log(id.toFixed(2));      // narrowed to number here
  }
}

//   string | number
//         │
//   typeof id === "string"
//         │
//    ┌────┴────┐
//    ▼         ▼
//  string    number

// ── Literal types — only these values ─────────────────────────────
type Direction = "north" | "south" | "east" | "west";

let heading: Direction = "north";
// heading = "up";   // Error: not assignable to Direction

// ── Functions — parameters and return ─────────────────────────────
function add(a: number, b: number): number {
  return a + b;
}

function greet(name: string, greeting?: string): string {
  return \`\${greeting ?? "Hello"}, \${name}\`;
}

function repeat(text: string, times = 1) {   // times inferred as number
  return text.repeat(times);
}`,
      },
      keyTakeaways: [
        { en: "TypeScript checks <b>contracts</b> before the code runs; it does not change what the JavaScript does.", np: "TypeScript ले code चल्नुअघि <b>सम्झौता</b> जाँच्छ; JavaScript ले के गर्छ त्यो बदल्दैन।", jp: "TypeScriptは実行前に<b>契約</b>を検査する。JavaScriptの動作自体は変えない。" },
        { en: "<b>Inference</b> covers most cases — `const name = \"Alice\"` is already `string`.", np: "<b>Inference</b> ले धेरैजसो अवस्था समेट्छ — `const name = \"Alice\"` पहिले नै `string` हो।", jp: "<b>推論</b>がほとんどを埋める。`const name = \"Alice\"` はすでに `string`。" },
        { en: "A <b>tuple</b> fixes both the length and the meaning of each position.", np: "<b>Tuple</b> ले लम्बाइ र हरेक स्थानको अर्थ दुबै तय गर्छ।", jp: "<b>タプル</b>は長さと各位置の意味の両方を固定する。" },
        { en: "A <b>union</b> allows several types, but only operations valid for all of them.", np: "<b>Union</b> ले धेरै type दिन्छ, तर सबैका लागि मान्य operation मात्र।", jp: "<b>ユニオン</b>は複数の型を許すが、全部に有効な操作しか許さない。" },
        { en: "<b>Narrowing</b> with `typeof`, `in` or a truthiness check unlocks the member-specific methods.", np: "`typeof`, `in` वा truthiness जाँचले गरिने <b>narrowing</b> ले सदस्य-विशेष method खोल्छ।", jp: "`typeof`・`in`・真偽判定による<b>絞り込み</b>が、その型固有のメソッドを解放する。" },
        { en: "<b>Literal types</b> accept only the listed values, which is how you model status and configuration.", np: "<b>Literal type</b> ले सूचीका मान मात्र लिन्छ, status र configuration यसै गरी model गरिन्छ।", jp: "<b>リテラル型</b>は列挙した値だけを受け、状態や設定はこれで表す。" },
        { en: "`?` marks a parameter optional; a default value gives you the type for free.", np: "`?` ले parameter वैकल्पिक बनाउँछ; default मानले type नि:शुल्क दिन्छ।", jp: "`?` は引数を任意にし、既定値があれば型は自動で決まる。" },
      ],
      commonMistakes: [
        { en: "<b>Annotating what inference already knows</b> — `const name: string = \"Alice\"` adds noise without adding information.", np: "<b>Inference ले जानेकै कुरा annotate गर्नु</b> — `const name: string = \"Alice\"` ले जानकारी नथपी हल्ला मात्र थप्छ।", jp: "<b>推論済みのことに注釈する</b> — `const name: string = \"Alice\"` は情報を足さず雑音だけ増やす。" },
        { en: "<b>Using a union without narrowing</b> — calling `id.toUpperCase()` on `string | number` fails, because it is not valid for `number`.", np: "<b>Narrow नगरी union प्रयोग गर्नु</b> — `string | number` मा `id.toUpperCase()` बोलाउँदा असफल हुन्छ, किनकि `number` का लागि मान्य छैन।", jp: "<b>絞り込まずにユニオンを使う</b> — `string | number` に `id.toUpperCase()` は `number` に無効なので通らない。" },
        { en: "<b>Reaching for `string` where a literal union fits</b> — `status: string` accepts `\"pendign\"`; `Status` catches the typo at compile time.", np: "<b>Literal union मिल्ने ठाउँमा `string` प्रयोग गर्नु</b> — `status: string` ले `\"pendign\"` लिन्छ; `Status` ले compile मै typo समात्छ।", jp: "<b>リテラルユニオンで足りる所に `string` を使う</b> — `status: string` は `\"pendign\"` を受けるが、`Status` は打ち間違いをコンパイル時に捕まえる。" },
        { en: "<b>Treating a tuple like an array</b> — `[number, number]` is not `number[]`; pushing a third value defeats the point of the fixed shape.", np: "<b>Tuple लाई array जस्तो ठान्नु</b> — `[number, number]` `number[]` होइन; तेस्रो मान push गर्दा तय आकारको अर्थ नै रहँदैन।", jp: "<b>タプルを配列扱いする</b> — `[number, number]` は `number[]` ではない。3つ目を push すれば固定した形の意味が消える。" },
      ],
      quiz: [
        {
          question: { en: "What is type narrowing?", np: "Type narrowing के हो?", jp: "型の絞り込みとは?" },
          options: [
            { en: "Using a check so TypeScript knows which union member you have", np: "जाँच गरेर TypeScript लाई union को कुन सदस्य हो थाहा दिनु", jp: "判定でユニオンのどの型かをTypeScriptに知らせること" },
            { en: "Reducing the number of properties on a type", np: "Type का property संख्या घटाउनु", jp: "型のプロパティ数を減らすこと" },
            { en: "Converting a type to `any`", np: "Type लाई `any` मा बदल्नु", jp: "型を `any` に変えること" },
          ],
          correctIndex: 0,
          explanation: { en: "Inside the branch, only that member's operations are allowed.", np: "Branch भित्र, त्यही सदस्यका operation मात्र अनुमति हुन्छन्।", jp: "その分岐の中では、その型の操作だけが許される。" },
        },
        {
          question: { en: "What type is inferred for `const age = 30`?", np: "`const age = 30` का लागि कुन type inferred हुन्छ?", jp: "`const age = 30` はどの型に推論されるか?" },
          options: [
            { en: "`any`", np: "`any`", jp: "`any`" },
            { en: "`number`", np: "`number`", jp: "`number`" },
            { en: "`30`", np: "`30`", jp: "`30`" },
          ],
          correctIndex: 1,
          explanation: { en: "An explicit `: number` here would only restate what is already known.", np: "यहाँ स्पष्ट `: number` ले जानेकै कुरा दोहोर्‍याउँछ।", jp: "ここで明示的に `: number` と書いても、既知のことの繰り返しにすぎない。" },
        },
        {
          question: { en: "Why does `[number, number]` differ from `number[]`?", np: "`[number, number]` `number[]` भन्दा किन फरक छ?", jp: "`[number, number]` が `number[]` と違うのはなぜか?" },
          options: [
            { en: "It fixes the length and gives each position a meaning", np: "यसले लम्बाइ तय गर्छ र हरेक स्थानलाई अर्थ दिन्छ", jp: "長さを固定し、各位置に意味を与えるから" },
            { en: "It allows only numbers", np: "यसले number मात्र दिन्छ", jp: "数値しか許さないから" },
            { en: "It is read-only", np: "यो read-only हो", jp: "読み取り専用だから" },
          ],
          correctIndex: 0,
          explanation: { en: "That is why a tuple suits a coordinate pair or a key-value entry.", np: "त्यसैले tuple coordinate जोडी वा key-value entry लाई सुहाउँछ।", jp: "だからタプルは座標の組やキーと値の対に向く。" },
        },
        {
          question: { en: "What does `type Status = \"pending\" | \"success\"` accept?", np: "`type Status = \"pending\" | \"success\"` ले के लिन्छ?", jp: "`type Status = \"pending\" | \"success\"` は何を受け取るか?" },
          options: [
            { en: "Any string", np: "जुनसुकै string", jp: "任意の文字列" },
            { en: "Any value that is not null", np: "null नभएको जुनसुकै मान", jp: "nullでない任意の値" },
            { en: "Only those two exact strings", np: "ती दुई ठ्याक्कै string मात्र", jp: "その2つの文字列だけ" },
          ],
          correctIndex: 2,
          explanation: { en: "A typo like `\"pendign\"` is then a compile error, not a runtime bug.", np: "अनि `\"pendign\"` जस्तो typo runtime bug होइन, compile error बन्छ।", jp: "`\"pendign\"` のような打ち間違いは実行時のバグではなくコンパイルエラーになる。" },
        },
        {
          question: { en: "In `function repeat(text: string, times = 1)`, what is the type of `times`?", np: "`function repeat(text: string, times = 1)` मा `times` को type के हो?", jp: "`function repeat(text: string, times = 1)` の `times` の型は?" },
          options: [
            { en: "`number`", np: "`number`", jp: "`number`" },
            { en: "`any`", np: "`any`", jp: "`any`" },
            { en: "`unknown`", np: "`unknown`", jp: "`unknown`" },
          ],
          correctIndex: 0,
          explanation: { en: "The default value is enough for TypeScript to infer it.", np: "Default मान TypeScript लाई infer गर्न पर्याप्त छ।", jp: "既定値があれば推論には十分。" },
        },
      ],
      youtubeIds: ["BwuLxPH8IDs"],
    },
    {
      id: "any-vs-unknown",
      title: { en: "`any` vs `unknown`", np: "`any` vs `unknown`", jp: "`any` と `unknown`" },
      durationMinutes: 8,
      explanation: {
        en: "`any` tells TypeScript \"trust me, do not check this\". Every property access and method call on an `any` compiles, <b>including the ones that will throw at runtime</b>, so a single `any` can quietly disable checking across an entire call chain.\n\n```typescript\nlet loose: any = \"hello\";\n\nloose.toUpperCase();      // fine\nloose.doesNotExist();     // also compiles, throws at runtime\nloose.a.b.c;              // also compiles\n```\n\n---\n\n### `unknown` is the safe counterpart\n\n`unknown` accepts any value but lets you do <b>nothing</b> with it until you prove the type:\n\n```typescript\nlet value: unknown = JSON.parse(input);\n\nvalue.toUpperCase();   // Error: 'value' is of type 'unknown'\n\nif (typeof value === \"string\") {\n  value.toUpperCase();  // narrowed, and now allowed\n}\n```\n\n```text\nany      → disables type safety\nunknown  → requires you to prove the type\n```\n\n---\n\n### Where to use it\n\nReach for `unknown` at the <b>edges</b> of your program — the places where data arrives from outside and TypeScript has no way to know its shape:\n\n• parsed JSON\n• a `catch` binding\n• a third-party <i>payload</i> (the body of data an external service sends back)\n• data read from storage\n\nThen narrow inward. Narrowing an unknown object usually takes two steps: confirm it is an object, then confirm the property exists.\n\n```typescript\nfunction process(data: unknown) {\n  if (typeof data === \"object\" && data !== null && \"value\" in data) {\n    return (data as { value: number }).value;\n  }\n\n  throw new TypeError(\"unexpected payload\");\n}\n```\n\nThe cast at the end is doing real work: you have checked enough to justify it, which is exactly the discipline `any` skips.",
        np: "`any` ले TypeScript लाई \"मलाई विश्वास गर, यो नजाँच\" भन्छ। `any` मा हरेक property पहुँच र method call compile हुन्छ, <b>runtime मा error दिनेहरू पनि</b>, त्यसैले एउटै `any` ले पूरै call chain मा जाँच चुपचाप बन्द गर्न सक्छ।\n\n```typescript\nlet loose: any = \"hello\";\n\nloose.toUpperCase();      // ठीकै\nloose.doesNotExist();     // यो पनि compile हुन्छ, runtime मा error\nloose.a.b.c;              // यो पनि compile हुन्छ\n```\n\n---\n\n### `unknown` सुरक्षित जोडी हो\n\n`unknown` ले जुनसुकै मान लिन्छ तर type प्रमाणित नगरेसम्म <b>केही</b> गर्न दिँदैन:\n\n```typescript\nlet value: unknown = JSON.parse(input);\n\nvalue.toUpperCase();   // Error: 'value' को type 'unknown' हो\n\nif (typeof value === \"string\") {\n  value.toUpperCase();  // narrow भयो, अब अनुमति छ\n}\n```\n\n```text\nany      → type safety बन्द गर्छ\nunknown  → type प्रमाणित गर्न लगाउँछ\n```\n\n---\n\n### कहाँ प्रयोग गर्ने\n\nProgram का <b>किनार</b> मा `unknown` प्रयोग गर्नुहोस्, जहाँ मान type system बाहिरबाट आउँछन्:\n\n• parse भएको JSON\n• `catch` को binding\n• तेस्रो पक्षको payload\n• storage बाट पढिएको data\n\nअनि भित्रतिर narrow गर्नुहोस्। Unknown object narrow गर्न प्रायः दुई चरण लाग्छ: यो object हो भनी पुष्टि, अनि property छ भनी पुष्टि।\n\n```typescript\nfunction process(data: unknown) {\n  if (typeof data === \"object\" && data !== null && \"value\" in data) {\n    return (data as { value: number }).value;\n  }\n\n  throw new TypeError(\"unexpected payload\");\n}\n```\n\nअन्त्यको cast ले साँचो काम गर्दैछ: तपाईंले यसलाई जायज ठहराउन पर्याप्त जाँच्नुभयो, र यही अनुशासन `any` ले छाड्छ।",
        jp: "`any` は「信じて、確認しないで」とTypeScriptに告げる。`any` に対するプロパティ参照もメソッド呼び出しもすべて通る。<b>実行時に落ちるものまで</b>通るので、たった1つの `any` が呼び出し連鎖全体の検査を黙って無効にしうる。\n\n```typescript\nlet loose: any = \"hello\";\n\nloose.toUpperCase();      // 通る\nloose.doesNotExist();     // これも通る。実行時に落ちる\nloose.a.b.c;              // これも通る\n```\n\n---\n\n### `unknown` は安全な対\n\n`unknown` はどんな値も受けるが、型を証明するまで<b>何も</b>させない:\n\n```typescript\nlet value: unknown = JSON.parse(input);\n\nvalue.toUpperCase();   // Error: 'value' は 'unknown' 型\n\nif (typeof value === \"string\") {\n  value.toUpperCase();  // 絞り込み済みなので許される\n}\n```\n\n```text\nany      → 型安全を無効にする\nunknown  → 型の証明を求める\n```\n\n---\n\n### どこで使うか\n\nプログラムの<b>境界</b>、つまり型システムの外から値が来る場所で `unknown` を使う:\n\n• パースしたJSON\n• `catch` の束縛\n• 外部のペイロード\n• ストレージから読んだデータ\n\nそこから内側へ絞り込む。unknownなオブジェクトの絞り込みはたいてい2段階。オブジェクトであることを確かめ、次にプロパティの存在を確かめる。\n\n```typescript\nfunction process(data: unknown) {\n  if (typeof data === \"object\" && data !== null && \"value\" in data) {\n    return (data as { value: number }).value;\n  }\n\n  throw new TypeError(\"unexpected payload\");\n}\n```\n\n最後のキャストはちゃんと仕事をしている。正当化できるだけ確認したうえでのキャストであり、`any` が飛ばすのはまさにこの規律だ。",
      },
      diagram: `Two ways to say "I do not know the type yet"

any                              unknown
 │                                │
 ▼                                ▼
every access compiles       no access compiles
 │                                │
 ▼                                ▼
including the ones          until you narrow
that throw                        │
                                  ▼
                            then only what
                            the narrowed type allows


Where unknown belongs: at the edges

  network / JSON / storage / catch
                │
                ▼
            unknown
                │
        typeof / in / instanceof
                │
                ▼
          a known type
                │
                ▼
        the rest of your code`,
      codeExample: {
        title: { en: "Why one is safe and the other is not", np: "एउटा किन सुरक्षित छ र अर्को किन छैन", jp: "一方が安全で他方が安全でない理由" },
        code: `// ── any — checking is switched off ────────────────────────────────
let loose: any = "hello";

loose.toUpperCase();      // fine
loose.doesNotExist();     // also compiles, throws at runtime
loose.a.b.c;              // also compiles

// ── unknown — you must prove the type first ───────────────────────
let value: unknown = JSON.parse(input);

// value.toUpperCase();   // Error: 'value' is of type 'unknown'

if (typeof value === "string") {
  value.toUpperCase();    // narrowed, and now allowed
}

// ── The rule ──────────────────────────────────────────────────────
// any      -> disables type safety
// unknown  -> requires you to prove the type

// Narrowing an unknown object takes two steps
function process(data: unknown) {
  if (typeof data === "object" && data !== null && "value" in data) {
    return (data as { value: number }).value;
  }
  throw new TypeError("unexpected payload");
}`,
      },
      keyTakeaways: [
        { en: "`any` <b>switches off</b> checking for every expression it touches.", np: "`any` ले छोएको हरेक expression का लागि जाँच <b>बन्द</b> गर्छ।", jp: "`any` は触れたあらゆる式の検査を<b>止める</b>。" },
        { en: "`unknown` accepts any value but permits <b>no operation</b> until you narrow.", np: "`unknown` ले जुनसुकै मान लिन्छ तर narrow नगरेसम्म <b>कुनै operation</b> दिँदैन।", jp: "`unknown` はどんな値も受けるが、絞り込むまで<b>操作を許さない</b>。" },
        { en: "Use `unknown` at the <b>edges</b>: parsed JSON, `catch` bindings, third-party payloads.", np: "<b>किनार</b> मा `unknown` प्रयोग गर्नुहोस्: parse भएको JSON, `catch` binding, तेस्रो पक्षको payload।", jp: "<b>境界</b>で `unknown` を使う。パースしたJSON・`catch` の束縛・外部のペイロード。" },
        { en: "Narrowing an unknown object takes two steps: it is an object, and the property exists.", np: "Unknown object narrow गर्न दुई चरण लाग्छ: यो object हो, र property छ।", jp: "unknownなオブジェクトの絞り込みは2段階。オブジェクトであること、プロパティがあること。" },
        { en: "A cast after a real check is honest; a cast instead of a check is `any` with extra syntax.", np: "साँचो जाँचपछिको cast इमान्दार छ; जाँचको सट्टाको cast थप syntax भएको `any` हो।", jp: "検査の後のキャストは誠実。検査の代わりのキャストは、構文が増えただけの `any`。" },
      ],
      commonMistakes: [
        { en: "<b>Typing a parameter `any` to make an error go away</b> — the error was the type system telling you the shape is unproven. Take `unknown` and narrow.", np: "<b>Error हटाउन parameter लाई `any` बनाउनु</b> — त्यो error type system ले आकार अप्रमाणित छ भनेको थियो। `unknown` लिनुहोस् र narrow गर्नुहोस्।", jp: "<b>エラーを消すために引数を `any` にする</b> — そのエラーは形が未証明だという型システムの指摘。`unknown` を受けて絞り込む。" },
        { en: "<b>Assuming `any` is contained</b> — it spreads: the return value of an `any` expression is also `any`, so one annotation can disable a whole chain.", np: "<b>`any` सीमित छ भन्ने ठान्नु</b> — यो फैलिन्छ: `any` expression को नतिजा पनि `any` हुन्छ, त्यसैले एउटै annotation ले पूरै chain बन्द गर्न सक्छ।", jp: "<b>`any` は局所的だと思う</b> — 伝播する。`any` の式の戻り値も `any` なので、注釈ひとつで連鎖全体が無効になる。" },
        { en: "<b>Casting straight from `unknown`</b> — `(data as User).name` without a check is the same risk as `any`, just written differently.", np: "<b>`unknown` बाट सिधै cast गर्नु</b> — जाँचबिना `(data as User).name` `any` कै जोखिम हो, बस फरक तरिकाले लेखिएको।", jp: "<b>`unknown` からいきなりキャストする</b> — 確認なしの `(data as User).name` は書き方が違うだけで `any` と同じ危険。" },
      ],
      quiz: [
        {
          question: { en: "What is the main advantage of `unknown` over `any`?", np: "`any` भन्दा `unknown` को मुख्य फाइदा के हो?", jp: "`any` に対する `unknown` の主な利点は?" },
          options: [
            { en: "It is faster at runtime", np: "यो runtime मा छिटो हुन्छ", jp: "実行時に速い" },
            { en: "It requires you to narrow before using the value", np: "यसले मान प्रयोग गर्नुअघि narrow गर्न लगाउँछ", jp: "値を使う前に絞り込みを要求する" },
            { en: "It automatically becomes a string", np: "यो स्वतः string बन्छ", jp: "自動的に文字列になる" },
            { en: "It disables checking entirely", np: "यसले जाँच पूरै बन्द गर्छ", jp: "検査を完全に無効にする" },
          ],
          correctIndex: 1,
          explanation: { en: "`any` compiles every access, including the ones that throw.", np: "`any` ले हरेक पहुँच compile गर्छ, error दिनेहरू पनि।", jp: "`any` は落ちるものまで含め、すべての参照を通す。" },
        },
        {
          question: { en: "Which line fails to compile?", np: "कुन line compile हुँदैन?", jp: "コンパイルできないのはどれか?" },
          options: [
            { en: "`let a: any = x; a.nope();`", np: "`let a: any = x; a.nope();`", jp: "`let a: any = x; a.nope();`" },
            { en: "`let c: any = x; c.a.b.c;`", np: "`let c: any = x; c.a.b.c;`", jp: "`let c: any = x; c.a.b.c;`" },
            { en: "`let b: unknown = x; b.nope();`", np: "`let b: unknown = x; b.nope();`", jp: "`let b: unknown = x; b.nope();`" },
          ],
          correctIndex: 2,
          explanation: { en: "`unknown` permits no operation until the type is proven.", np: "Type प्रमाणित नभएसम्म `unknown` ले कुनै operation दिँदैन।", jp: "`unknown` は型が証明されるまで操作を許さない。" },
        },
        {
          question: { en: "Where does `unknown` belong?", np: "`unknown` कहाँ सुहाउँछ?", jp: "`unknown` はどこに置くべきか?" },
          options: [
            { en: "Only inside classes", np: "Class भित्र मात्र", jp: "クラスの中だけ" },
            { en: "On every function parameter", np: "हरेक function parameter मा", jp: "すべての関数の引数" },
            { en: "At the edges, where values enter from outside the type system", np: "किनारमा, जहाँ type system बाहिरबाट मान भित्रिन्छन्", jp: "型システムの外から値が入る境界" },
          ],
          correctIndex: 2,
          explanation: { en: "Parsed JSON, a `catch` binding and third-party payloads are the classic cases.", np: "Parse भएको JSON, `catch` binding र तेस्रो पक्षको payload classic उदाहरण हुन्।", jp: "パースしたJSON・`catch` の束縛・外部のペイロードが典型。" },
        },
        {
          question: { en: "Why is `(data as User).name` on an unchecked `unknown` a problem?", np: "जाँच नगरिएको `unknown` मा `(data as User).name` किन समस्या हो?", jp: "未確認の `unknown` に対する `(data as User).name` が問題なのはなぜか?" },
          options: [
            { en: "Casts are not allowed in TypeScript", np: "TypeScript मा cast अनुमति छैन", jp: "TypeScriptではキャストが許されないから" },
            { en: "It asserts a shape nobody verified, which is the same risk as `any`", np: "यसले कसैले नजाँचेको आकार दाबी गर्छ, जुन `any` कै जोखिम हो", jp: "誰も検証していない形を断言することになり、`any` と同じ危険だから" },
            { en: "It makes the value readonly", np: "यसले मान readonly बनाउँछ", jp: "値が読み取り専用になるから" },
          ],
          correctIndex: 1,
          explanation: { en: "A cast is fine once the check justifies it.", np: "जाँचले जायज ठहराएपछि cast ठीकै हो।", jp: "確認が裏付けたうえでのキャストなら問題ない。" },
        },
      ],
    },
    {
      id: "interfaces-and-types",
      title: { en: "Interfaces and type aliases", np: "Interface र type alias", jp: "インターフェースと型エイリアス" },
      durationMinutes: 8,
      explanation: {
        en: "An <b>interface</b> describes the shape of an object: which properties exist, which are optional with `?`, and which are `readonly`.\n\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  role?: \"admin\" | \"user\";\n  readonly createdAt: Date;\n}\n```\n\nTypeScript then enforces that shape, and `readonly` blocks reassignment after construction:\n\n```typescript\nuser.createdAt = new Date();   // Error\n```\n\n---\n\n### `interface` vs `type`\n\nA <b>type alias</b> describes the same object shape:\n\n```typescript\ntype Product = {\n  id: string;\n  name: string;\n  price: number;\n};\n```\n\nBut it can also describe things an interface cannot — unions, tuples and intersections:\n\n```typescript\ntype ID = string | number;\ntype Point = [number, number];\ntype Status = \"pending\" | \"success\" | \"failed\";\n```\n\nInterfaces extend, and merge across declarations:\n\n```typescript\ninterface Animal {\n  name: string;\n  speak(): void;\n}\n\ninterface Dog extends Animal {\n  breed: string;\n}\n```\n\n---\n\n### A practical rule\n\n```text\ninterface → object and class contracts\ntype      → unions, tuples, intersections,\n            computed and derived types\n```\n\nFor an ordinary object shape either works, so pick one and stay consistent within a codebase. Reach for `type` the moment you are <b>composing</b> a type rather than declaring a plain shape.",
        np: "<b>Interface</b> ले object को आकार वर्णन गर्छ: कुन property छन्, `?` ले कुन वैकल्पिक छन्, र कुन `readonly` छन्।\n\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  role?: \"admin\" | \"user\";\n  readonly createdAt: Date;\n}\n```\n\nअनि TypeScript ले त्यो आकार लागू गर्छ, र `readonly` ले निर्माणपछि पुनः assign रोक्छ:\n\n```typescript\nuser.createdAt = new Date();   // Error\n```\n\n---\n\n### `interface` vs `type`\n\n<b>Type alias</b> ले उही object आकार वर्णन गर्छ:\n\n```typescript\ntype Product = {\n  id: string;\n  name: string;\n  price: number;\n};\n```\n\nतर यसले interface ले नसक्ने कुरा पनि वर्णन गर्न सक्छ — union, tuple र intersection:\n\n```typescript\ntype ID = string | number;\ntype Point = [number, number];\ntype Status = \"pending\" | \"success\" | \"failed\";\n```\n\nInterface `extends` हुन्छन्, र declaration बीच merge हुन्छन्:\n\n```typescript\ninterface Animal {\n  name: string;\n  speak(): void;\n}\n\ninterface Dog extends Animal {\n  breed: string;\n}\n```\n\n---\n\n### व्यावहारिक नियम\n\n```text\ninterface → object र class सम्झौता\ntype      → union, tuple, intersection,\n            गणना र व्युत्पन्न type\n```\n\nसादा object आकारमा दुबै चल्छन्, त्यसैले एउटा छानेर codebase भित्र एकनास रहनुहोस्। सादा आकार घोषणा नगरी type <b>जोड्दै</b> हुनुहुन्छ भने तुरुन्तै `type` रोज्नुहोस्।",
        jp: "<b>インターフェース</b>はオブジェクトの形、つまりどのプロパティがあり、どれが `?` で任意で、どれが `readonly` かを記述する。\n\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  role?: \"admin\" | \"user\";\n  readonly createdAt: Date;\n}\n```\n\nTypeScriptはその形を強制し、`readonly` は生成後の再代入を防ぐ:\n\n```typescript\nuser.createdAt = new Date();   // Error\n```\n\n---\n\n### `interface` と `type`\n\n<b>型エイリアス</b>は同じ形を記述できる:\n\n```typescript\ntype Product = {\n  id: string;\n  name: string;\n  price: number;\n};\n```\n\nさらに、インターフェースにできないことも表せる。ユニオン・タプル・インターセクション:\n\n```typescript\ntype ID = string | number;\ntype Point = [number, number];\ntype Status = \"pending\" | \"success\" | \"failed\";\n```\n\nインターフェースは拡張でき、宣言をまたいでマージされる:\n\n```typescript\ninterface Animal {\n  name: string;\n  speak(): void;\n}\n\ninterface Dog extends Animal {\n  breed: string;\n}\n```\n\n---\n\n### 実務的な指針\n\n```text\ninterface → オブジェクトとクラスの契約\ntype      → ユニオン・タプル・インターセクション、\n            計算・導出した型\n```\n\n素のオブジェクトの形はどちらでもよいので、ひとつ選んでコードベース内で一貫させる。単なる形の宣言ではなく型を<b>合成</b>し始めたら `type` に切り替える。",
      },
      diagram: `What each one can express

interface                    type
──────────                   ────
object shape        yes      object shape        yes
extends             yes      unions              yes
declaration merge   yes      tuples              yes
unions              no       intersections       yes
tuples              no       computed types      yes


Optional and readonly, in one shape

interface User {
  id: number;              required, writable
  role?: "admin" | "user"; optional
  readonly createdAt: Date; set once, then frozen
}`,
      codeExample: {
        title: { en: "Declaring and composing object shapes", np: "Object आकार घोषणा र संयोजन", jp: "オブジェクトの形の宣言と合成" },
        code: `// ── interface — describe object shape ─────────────────────────────
interface User {
  id:         number;
  name:       string;
  email:      string;
  role?:      "admin" | "user";  // optional property
  readonly createdAt: Date;       // cannot be changed after creation
}

// ── type alias — same result for object types ──────────────────────
type Product = {
  id:    string;
  name:  string;
  price: number;
};

// ── interface vs type: which to use? ──────────────────────────────
// interface: use for objects and classes — can be extended/merged
// type: use for unions, tuples, primitives, and computed types
// For plain objects either works — prefer interface when in doubt

// ── Extending interfaces ───────────────────────────────────────────
interface Animal {
  name: string;
  speak(): void;
}

interface Dog extends Animal {
  breed: string;
  fetch(): void;
}

// ── Intersection types — combine multiple types ────────────────────
type Admin = User & { adminLevel: 1 | 2 | 3 };

// ── Index signatures — objects with dynamic keys ───────────────────
interface StringMap {
  [key: string]: string;  // any string key, string value
}

const translations: StringMap = {
  hello: "नमस्ते",
  bye:   "बिदाई",
};

// ── Function types ────────────────────────────────────────────────
interface Formatter {
  (value: number, decimals?: number): string;
}

const formatPrice: Formatter = (n, d = 2) => n.toFixed(d);

// ── Class implementing an interface ──────────────────────────────
interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}

class Config implements Serializable {
  private data: Record<string, unknown> = {};

  serialize(): string { return JSON.stringify(this.data); }
  deserialize(data: string): void { this.data = JSON.parse(data); }
}`,
      },
      keyTakeaways: [
        { en: "An <b>interface</b> describes an object shape: required, optional (`?`) and `readonly` properties.", np: "<b>Interface</b> ले object आकार वर्णन गर्छ: आवश्यक, वैकल्पिक (`?`) र `readonly` property।", jp: "<b>インターフェース</b>はオブジェクトの形を記述する。必須・任意（`?`）・`readonly` のプロパティ。" },
        { en: "`readonly` blocks reassignment after construction, at compile time only.", np: "`readonly` ले निर्माणपछि पुनः assign रोक्छ, compile time मा मात्र।", jp: "`readonly` は生成後の再代入を防ぐ。ただしコンパイル時のみ。" },
        { en: "A <b>type alias</b> can also express unions, tuples and intersections, which an interface cannot.", np: "<b>Type alias</b> ले union, tuple र intersection पनि व्यक्त गर्न सक्छ, जुन interface ले सक्दैन।", jp: "<b>型エイリアス</b>はユニオン・タプル・インターセクションも表せる。インターフェースには無理。" },
        { en: "Interfaces <b>extend</b> and <b>merge</b> across declarations, which suits public contracts.", np: "Interface declaration बीच <b>extend</b> र <b>merge</b> हुन्छन्, जुन सार्वजनिक सम्झौतालाई सुहाउँछ।", jp: "インターフェースは宣言をまたいで<b>拡張</b>と<b>マージ</b>ができ、公開契約に向く。" },
        { en: "For a plain object shape either works — consistency inside a codebase matters more than the choice.", np: "सादा object आकारमा दुबै चल्छन् — छनोट भन्दा codebase भित्रको एकरूपता महत्वपूर्ण छ।", jp: "素の形はどちらでもよい。選択そのものより、コードベース内の一貫性が大事。" },
      ],
      commonMistakes: [
        { en: "<b>Expecting `readonly` to protect at runtime</b> — it is erased on compile, so nothing stops a plain JavaScript caller from writing the field.", np: "<b>`readonly` ले runtime मा जोगाउँछ भन्ने आशा गर्नु</b> — यो compile मा मेटिन्छ, त्यसैले सादा JavaScript caller लाई field लेख्नबाट केही रोक्दैन।", jp: "<b>`readonly` が実行時に守ると思う</b> — コンパイルで消えるので、素のJavaScriptからの書き込みは止められない。" },
        { en: "<b>Reaching for `interface` to express a union</b> — `interface ID = string | number` is not valid; that is what `type` is for.", np: "<b>Union व्यक्त गर्न `interface` प्रयोग गर्नु</b> — `interface ID = string | number` मान्य छैन; त्यसका लागि `type` हो।", jp: "<b>ユニオンを表そうとして `interface` を使う</b> — `interface ID = string | number` は無効。それは `type` の役目。" },
        { en: "<b>Marking everything optional</b> — a shape where every property is `?` stops describing a contract and pushes the checks into every consumer.", np: "<b>सबै कुरा वैकल्पिक बनाउनु</b> — हरेक property `?` भएको आकारले सम्झौता वर्णन गर्न छाड्छ र जाँच हरेक consumer मा धकेल्छ।", jp: "<b>すべてを任意にする</b> — 全プロパティが `?` の形は契約の記述をやめ、確認をすべての利用側へ押し付ける。" },
      ],
      quiz: [
        {
          question: { en: "Which can an interface <b>not</b> express?", np: "Interface ले कुन व्यक्त गर्न <b>सक्दैन</b>?", jp: "インターフェースが表せ<b>ない</b>のはどれか?" },
          options: [
            { en: "An optional property", np: "वैकल्पिक property", jp: "任意のプロパティ" },
            { en: "A union such as `string | number`", np: "`string | number` जस्तो union", jp: "`string | number` のようなユニオン" },
            { en: "A method signature", np: "Method signature", jp: "メソッドのシグネチャ" },
          ],
          correctIndex: 1,
          explanation: { en: "Unions, tuples and intersections are what `type` adds.", np: "Union, tuple र intersection `type` ले थप्छ।", jp: "ユニオン・タプル・インターセクションは `type` が加えるもの。" },
        },
        {
          question: { en: "What does `readonly createdAt: Date` guarantee?", np: "`readonly createdAt: Date` ले केको ग्यारेन्टी गर्छ?", jp: "`readonly createdAt: Date` は何を保証するか?" },
          options: [
            { en: "The property is private", np: "Property private हुन्छ", jp: "プロパティがprivateになる" },
            { en: "The object is frozen at runtime", np: "Object runtime मा frozen हुन्छ", jp: "実行時にオブジェクトが凍結される" },
            { en: "The value cannot be reassigned, checked at compile time", np: "मान पुनः assign गर्न मिल्दैन, compile time मा जाँचिन्छ", jp: "再代入できない。コンパイル時に検査される" },
          ],
          correctIndex: 2,
          explanation: { en: "`Object.freeze()` is what enforces it at runtime.", np: "Runtime मा लागू गर्ने चाहिँ `Object.freeze()` हो।", jp: "実行時に強制するのは `Object.freeze()`。" },
        },
        {
          question: { en: "When is `type` clearly the right choice?", np: "`type` स्पष्ट रूपमा कहिले सही छनोट हो?", jp: "`type` が明らかに正しいのはどんなときか?" },
          options: [
            { en: "When declaring a plain object shape", np: "सादा object आकार घोषणा गर्दा", jp: "素のオブジェクトの形を宣言するとき" },
            { en: "When the object has more than five properties", np: "Object मा पाँचभन्दा बढी property हुँदा", jp: "プロパティが5個を超えるとき" },
            { en: "When composing a union, tuple or intersection", np: "Union, tuple वा intersection जोड्दा", jp: "ユニオン・タプル・インターセクションを合成するとき" },
          ],
          correctIndex: 2,
          explanation: { en: "For a plain shape either works; pick one and stay consistent.", np: "सादा आकारमा दुबै चल्छन्; एउटा छानेर एकनास रहनुहोस्।", jp: "素の形はどちらでもよい。ひとつ選んで一貫させる。" },
        },
      ],
    },
    {
      id: "generics",
      title: { en: "Generics — reuse without losing the type", np: "Generics — type नगुमाई पुनःप्रयोग", jp: "ジェネリクス — 型を失わない再利用" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>generic</b> is a type the caller fills in. Without one, a reusable function throws away everything it knew:\n\n```typescript\nfunction getFirst(values: any[]) {\n  return values[0];\n}\n\nconst value = getFirst([10, 20, 30]);   // any\n```\n\nWith a generic, the connection survives:\n\n```typescript\nfunction getFirst<T>(values: T[]): T {\n  return values[0];\n}\n\nconst n = getFirst([10, 20, 30]);   // number\nconst s = getFirst([\"Alice\", \"Bob\"]);  // string\n```\n\n```text\ngetFirst([1, 2, 3])\n       ↓\n     T = number\n\ngetFirst([\"a\", \"b\"])\n       ↓\n     T = string\n```\n\n`T` is a placeholder, not a type you declare in advance. TypeScript fills it in at each <i>call site</i> — each place the function is actually called.\n\n---\n\n### Generic API responses\n\nGenerics shine when one structure wraps many payloads:\n\n```typescript\ninterface ApiResponse<T> {\n  data: T;\n  status: number;\n  message: string;\n}\n\ntype UsersResponse = ApiResponse<User[]>;\ntype ProductResponse = ApiResponse<Product>;\n```\n\nOne contract, no duplication, and `response.data` still has a real type.\n\n---\n\n### Constraints\n\nSometimes a generic needs a guarantee. A <b>constraint</b>, written with `extends`, limits what `T` is allowed to be:\n\n```typescript\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst user = { name: \"Alice\", age: 30 };\n\ngetProperty(user, \"name\");   // string\ngetProperty(user, \"age\");    // number\ngetProperty(user, \"email\");  // Error: not a key of user\n```\n\n`keyof T` means \"the keys that actually exist on `T`\", and the return type `T[K]` looks up the type of that specific property. The signature is doing real work: it is impossible to ask for a key that is not there.",
        np: "<b>Generic</b> भनेको caller ले भर्ने type हो। यसबिना, पुनःप्रयोग्य function ले आफूले जानेको सबै फाल्छ:\n\n```typescript\nfunction getFirst(values: any[]) {\n  return values[0];\n}\n\nconst value = getFirst([10, 20, 30]);   // any\n```\n\nGeneric सँग, सम्बन्ध बाँच्छ:\n\n```typescript\nfunction getFirst<T>(values: T[]): T {\n  return values[0];\n}\n\nconst n = getFirst([10, 20, 30]);   // number\nconst s = getFirst([\"Alice\", \"Bob\"]);  // string\n```\n\n```text\ngetFirst([1, 2, 3])\n       ↓\n     T = number\n\ngetFirst([\"a\", \"b\"])\n       ↓\n     T = string\n```\n\n`T` अघि नै घोषणा गर्ने type होइन। TypeScript ले हरेक call site मा यो निकाल्छ।\n\n---\n\n### Generic API response\n\nएउटै संरचनाले धेरै payload बेर्दा generic चम्किन्छ:\n\n```typescript\ninterface ApiResponse<T> {\n  data: T;\n  status: number;\n  message: string;\n}\n\ntype UsersResponse = ApiResponse<User[]>;\ntype ProductResponse = ApiResponse<Product>;\n```\n\nएउटै सम्झौता, नक्कल छैन, र `response.data` को अझै साँचो type छ।\n\n---\n\n### Constraint\n\nकहिलेकाहीं generic लाई ग्यारेन्टी चाहिन्छ। `extends` ले `T` के हुन सक्छ साँघुरो पार्छ:\n\n```typescript\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst user = { name: \"Alice\", age: 30 };\n\ngetProperty(user, \"name\");   // string\ngetProperty(user, \"age\");    // number\ngetProperty(user, \"email\");  // Error: user को key होइन\n```\n\n`keyof T` को अर्थ \"`T` मा साँच्चै भएका key\" हो, र फर्कने type `T[K]` ले त्यही property को type खोज्छ। Signature ले साँचो काम गर्दैछ: नभएको key माग्नै असम्भव छ।",
        jp: "<b>ジェネリクス</b>は呼び出し側が埋める型。これがないと、再利用可能な関数は分かっていたことをすべて捨ててしまう:\n\n```typescript\nfunction getFirst(values: any[]) {\n  return values[0];\n}\n\nconst value = getFirst([10, 20, 30]);   // any\n```\n\nジェネリクスがあれば、結び付きが残る:\n\n```typescript\nfunction getFirst<T>(values: T[]): T {\n  return values[0];\n}\n\nconst n = getFirst([10, 20, 30]);   // number\nconst s = getFirst([\"Alice\", \"Bob\"]);  // string\n```\n\n```text\ngetFirst([1, 2, 3])\n       ↓\n     T = number\n\ngetFirst([\"a\", \"b\"])\n       ↓\n     T = string\n```\n\n`T` は前もって宣言する型ではない。TypeScriptが呼び出し地点ごとに決める。\n\n---\n\n### ジェネリックなAPIレスポンス\n\nひとつの構造が多くのペイロードを包むとき、ジェネリクスが活きる:\n\n```typescript\ninterface ApiResponse<T> {\n  data: T;\n  status: number;\n  message: string;\n}\n\ntype UsersResponse = ApiResponse<User[]>;\ntype ProductResponse = ApiResponse<Product>;\n```\n\n契約はひとつ、重複はなし、それでいて `response.data` は実際の型を保つ。\n\n---\n\n### 制約\n\nジェネリクスに保証が必要なこともある。`extends` が `T` の取りうる範囲を狭める:\n\n```typescript\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst user = { name: \"Alice\", age: 30 };\n\ngetProperty(user, \"name\");   // string\ngetProperty(user, \"age\");    // number\ngetProperty(user, \"email\");  // Error: user のキーではない\n```\n\n`keyof T` は「`T` に実在するキー」を意味し、戻り値の `T[K]` はそのプロパティの型を引く。シグネチャがちゃんと働いていて、存在しないキーを求めること自体が不可能になる。",
      },
      diagram: `The generic keeps the link the annotation would break

any[]                         T[]
  │                            │
  ▼                            ▼
values[0]                   values[0]
  │                            │
  ▼                            ▼
 any                           T
                               │
              ┌────────────────┴────────────────┐
              ▼                                 ▼
   getFirst([1, 2, 3])              getFirst(["a", "b"])
        T = number                       T = string


A constraint makes a wrong call impossible

K extends keyof T
        │
        ▼
   the key must exist on T
        │
  ┌─────┴─────┐
  ▼           ▼
"name"      "email"
 ok         Error, T has no such key`,
      codeExample: {
        title: { en: "Generic functions, responses and constraints", np: "Generic function, response र constraint", jp: "ジェネリック関数・レスポンス・制約" },
        code: `// ── Without generics — not type-safe ────────────────────────────
function getFirstAny(arr: any[]): any { return arr[0]; }
const first = getFirstAny([1, 2, 3]);
// first is typed as 'any' — TypeScript cannot help you here

// ── With generics — fully type-safe ──────────────────────────────
function getFirst<T>(arr: T[]): T { return arr[0]; }

const num  = getFirst([1, 2, 3]);       // T = number — inferred automatically
const str  = getFirst(["a", "b", "c"]); // T = string
const user = getFirst<User>([alice]);   // T = User — explicitly specified

// ── Generic interfaces and classes ────────────────────────────────
interface ApiResponse<T> {
  data:    T;
  status:  number;
  message: string;
}

type UsersResponse    = ApiResponse<User[]>;
type ProductResponse  = ApiResponse<Product>;

async function fetchUsers(): Promise<ApiResponse<User[]>> {
  const res = await fetch("/api/users");
  return res.json();
}

// ── Generic constraints — T must have certain properties ──────────
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30 };
getProperty(user, "name");  // "Alice" — return type is string
getProperty(user, "age");   // 30 — return type is number
// getProperty(user, "email");  // ❌ "email" doesn't exist on user

// ── Multiple type parameters ───────────────────────────────────────
function merge<A, B>(a: A, b: B): A & B {
  return { ...a, ...b } as A & B;
}

const merged = merge({ name: "Alice" }, { age: 30 });
merged.name;  // ✅ string
merged.age;   // ✅ number`,
      },
      keyTakeaways: [
        { en: "A <b>generic</b> is a type the caller supplies, worked out per call site.", np: "<b>Generic</b> caller ले दिने type हो, हरेक call site मा निकालिने।", jp: "<b>ジェネリクス</b>は呼び出し側が与える型で、呼び出し地点ごとに決まる。" },
        { en: "`any[]` makes a function reusable by <b>throwing away</b> the type; `T[]` keeps it.", np: "`any[]` ले type <b>फालेर</b> function पुनःप्रयोग्य बनाउँछ; `T[]` ले जोगाउँछ।", jp: "`any[]` は型を<b>捨てて</b>再利用可能にする。`T[]` は型を保つ。" },
        { en: "A generic <b>interface</b> such as `ApiResponse<T>` gives one contract for many payloads.", np: "`ApiResponse<T>` जस्तो generic <b>interface</b> ले धेरै payload लाई एउटै सम्झौता दिन्छ।", jp: "`ApiResponse<T>` のようなジェネリックな<b>インターフェース</b>は、多くのペイロードに1つの契約を与える。" },
        { en: "<b>`extends`</b> constrains a generic, and `keyof T` restricts it to keys that exist.", np: "<b>`extends`</b> ले generic सीमित गर्छ, र `keyof T` ले भएका key मा मात्र सीमित पार्छ।", jp: "<b>`extends`</b> がジェネリクスを制約し、`keyof T` は実在するキーだけに限る。" },
        { en: "An indexed return type `T[K]` reads back the exact type of that property.", np: "Indexed return type `T[K]` ले त्यो property को ठ्याक्कै type फर्काउँछ।", jp: "添字付きの戻り値型 `T[K]` は、そのプロパティの正確な型を返す。" },
      ],
      commonMistakes: [
        { en: "<b>Adding `<T>` and then annotating with `any` anyway</b> — `function f<T>(x: any): T` breaks the link the generic existed to keep.", np: "<b>`<T>` थपेर पनि `any` ले annotate गर्नु</b> — `function f<T>(x: any): T` ले generic राख्नुको कारणै भत्काउँछ।", jp: "<b>`<T>` を足しながら結局 `any` で注釈する</b> — `function f<T>(x: any): T` はジェネリクスが守るはずの結び付きを壊す。" },
        { en: "<b>Reaching for a generic with only one call site</b> — if `T` is always `User`, the parameter is noise; write `User`.", np: "<b>एउटै call site हुँदा generic प्रयोग गर्नु</b> — `T` सधैं `User` हो भने, parameter हल्ला मात्र हो; `User` लेख्नुहोस्।", jp: "<b>呼び出し地点が1つなのにジェネリクスにする</b> — `T` が常に `User` なら、その引数は雑音。`User` と書く。" },
        { en: "<b>Forgetting the constraint</b> — without `K extends keyof T`, `obj[key]` accepts any string and the return type degrades.", np: "<b>Constraint बिर्सनु</b> — `K extends keyof T` नभए, `obj[key]` ले जुनसुकै string लिन्छ र return type बिग्रन्छ।", jp: "<b>制約を忘れる</b> — `K extends keyof T` がないと `obj[key]` は任意の文字列を受け、戻り値の型が劣化する。" },
      ],
      quiz: [
        {
          question: { en: "For `function first<T>(items: T[]): T`, what is the type of `first([1, 2, 3])`?", np: "`function first<T>(items: T[]): T` मा `first([1, 2, 3])` को type के हो?", jp: "`function first<T>(items: T[]): T` のとき `first([1, 2, 3])` の型は?" },
          options: [
            { en: "`any`", np: "`any`", jp: "`any`" },
            { en: "`unknown`", np: "`unknown`", jp: "`unknown`" },
            { en: "`number[]`", np: "`number[]`", jp: "`number[]`" },
            { en: "`number`", np: "`number`", jp: "`number`" },
          ],
          correctIndex: 3,
          explanation: { en: "The generic preserves the link between the argument and the result.", np: "Generic ले argument र नतिजाबीचको सम्बन्ध जोगाउँछ।", jp: "ジェネリクスが引数と結果の結び付きを保つ。" },
        },
        {
          question: { en: "What does `K extends keyof T` guarantee?", np: "`K extends keyof T` ले केको ग्यारेन्टी गर्छ?", jp: "`K extends keyof T` は何を保証するか?" },
          options: [
            { en: "That the key actually exists on the object", np: "Key object मा साँच्चै छ", jp: "そのキーがオブジェクトに実在すること" },
            { en: "That the value is a string", np: "मान string हो", jp: "値が文字列であること" },
            { en: "That the object is readonly", np: "Object readonly छ", jp: "オブジェクトが読み取り専用であること" },
          ],
          correctIndex: 0,
          explanation: { en: "`getProperty(user, \"email\")` then fails to compile when there is no `email`.", np: "`email` नभए `getProperty(user, \"email\")` compile हुँदैन।", jp: "`email` がなければ `getProperty(user, \"email\")` はコンパイルできない。" },
        },
        {
          question: { en: "Why does `ApiResponse<T>` beat writing a response type per endpoint?", np: "प्रति endpoint response type लेख्नुभन्दा `ApiResponse<T>` किन राम्रो?", jp: "エンドポイントごとにレスポンス型を書くより `ApiResponse<T>` が良いのはなぜか?" },
          options: [
            { en: "It is checked at runtime", np: "यो runtime मा जाँचिन्छ", jp: "実行時に検査されるから" },
            { en: "One contract covers every payload without losing `data`'s type", np: "एउटै सम्झौताले `data` को type नगुमाई हरेक payload समेट्छ", jp: "`data` の型を失わずに1つの契約で全ペイロードを覆えるから" },
            { en: "It makes the response immutable", np: "यसले response अपरिवर्तनीय बनाउँछ", jp: "レスポンスが不変になるから" },
          ],
          correctIndex: 1,
          explanation: { en: "The wrapper stays fixed while `T` varies per endpoint.", np: "Wrapper स्थिर रहन्छ भने `T` प्रति endpoint फरक हुन्छ।", jp: "ラッパーは固定のまま、`T` だけがエンドポイントごとに変わる。" },
        },
      ],
    },
    {
      id: "utility-types",
      title: { en: "Utility types — derive, do not duplicate", np: "Utility type — नक्कल नगरी व्युत्पन्न गर्नुहोस्", jp: "ユーティリティ型 — 複製せず導出する" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>utility type</b> is a built-in helper that reshapes a type you already have, so one definition stays the <b>single source of truth</b> — the one place a change has to be made. Start from one interface:\n\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  password: string;\n  role: \"admin\" | \"user\";\n  createdAt: Date;\n}\n```\n\n---\n\n### The six worth knowing\n\n<b>`Partial<T>`</b> makes every property optional — exactly the shape of a PATCH body, the partial update an API accepts when you only want to change a field or two:\n\n```typescript\ntype UserUpdate = Partial<User>;\n\nupdateUser(1, { name: \"Bob\" });\n```\n\n<b>`Pick<T, K>`</b> keeps only the listed properties:\n\n```typescript\ntype UserProfile = Pick<User, \"id\" | \"name\" | \"email\">;\n```\n\n<b>`Omit<T, K>`</b> drops them, which is how a public response type is built from an internal record:\n\n```typescript\ntype PublicUser = Omit<User, \"password\" | \"createdAt\">;\n```\n\n<b>`Record<K, V>`</b> builds a keyed map:\n\n```typescript\ntype RolePermissions = Record<\"admin\" | \"user\", string[]>;\n```\n\n<b>`ReturnType<T>`</b> reads a function's result type:\n\n```typescript\ntype NewUser = ReturnType<typeof createUser>;\n```\n\n<b>`Readonly<T>`</b> freezes the shape:\n\n```typescript\ntype FrozenUser = Readonly<User>;\n```\n\n---\n\n### They compose\n\nThe real gain is combining them, so API input types stay in step with the model automatically:\n\n```typescript\ntype CreateUserInput = Omit<User, \"id\" | \"createdAt\">;\n\ntype UpdateUserInput = Partial<Omit<User, \"id\" | \"createdAt\">>;\n```\n\nChange `User` once and both follow. Hand-write those two instead and they drift apart the first time somebody adds a field.",
        np: "Utility type ले पहिले नै भएको type रूपान्तरण गर्छ, त्यसैले एउटै परिभाषा <b>सत्यको एक स्रोत</b> रहन्छ। एउटा interface बाट सुरु गरौं:\n\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  password: string;\n  role: \"admin\" | \"user\";\n  createdAt: Date;\n}\n```\n\n---\n\n### जान्नै पर्ने छ वटा\n\n<b>`Partial<T>`</b> ले हरेक property वैकल्पिक बनाउँछ — ठ्याक्कै PATCH body को आकार:\n\n```typescript\ntype UserUpdate = Partial<User>;\n\nupdateUser(1, { name: \"Bob\" });\n```\n\n<b>`Pick<T, K>`</b> ले सूचीका property मात्र राख्छ:\n\n```typescript\ntype UserProfile = Pick<User, \"id\" | \"name\" | \"email\">;\n```\n\n<b>`Omit<T, K>`</b> ले हटाउँछ, यसरी नै भित्री record बाट सार्वजनिक response type बन्छ:\n\n```typescript\ntype PublicUser = Omit<User, \"password\" | \"createdAt\">;\n```\n\n<b>`Record<K, V>`</b> ले key भएको map बनाउँछ:\n\n```typescript\ntype RolePermissions = Record<\"admin\" | \"user\", string[]>;\n```\n\n<b>`ReturnType<T>`</b> ले function को नतिजा type पढ्छ:\n\n```typescript\ntype NewUser = ReturnType<typeof createUser>;\n```\n\n<b>`Readonly<T>`</b> ले आकार जमाउँछ:\n\n```typescript\ntype FrozenUser = Readonly<User>;\n```\n\n---\n\n### यी जोडिन्छन्\n\nवास्तविक फाइदा यी जोड्नुमा छ, ताकि API input type model सँग स्वतः मिलिरहून्:\n\n```typescript\ntype CreateUserInput = Omit<User, \"id\" | \"createdAt\">;\n\ntype UpdateUserInput = Partial<Omit<User, \"id\" | \"createdAt\">>;\n```\n\n`User` एक पटक बदल्नुहोस्, दुबै पछ्याउँछन्। ती दुई हातले लेख्नुभयो भने, कसैले field थप्ने पहिलो पटकमै फरक पर्न थाल्छन्।",
        jp: "ユーティリティ型は既存の型を変換するので、定義ひとつが<b>単一の情報源</b>のまま保たれる。ひとつのインターフェースから始める:\n\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  password: string;\n  role: \"admin\" | \"user\";\n  createdAt: Date;\n}\n```\n\n---\n\n### 覚えておく6つ\n\n<b>`Partial<T>`</b> は全プロパティを任意にする。PATCHボディの形そのもの:\n\n```typescript\ntype UserUpdate = Partial<User>;\n\nupdateUser(1, { name: \"Bob\" });\n```\n\n<b>`Pick<T, K>`</b> は挙げたものだけを残す:\n\n```typescript\ntype UserProfile = Pick<User, \"id\" | \"name\" | \"email\">;\n```\n\n<b>`Omit<T, K>`</b> は落とす。内部レコードから公開レスポンス型を作るのはこれ:\n\n```typescript\ntype PublicUser = Omit<User, \"password\" | \"createdAt\">;\n```\n\n<b>`Record<K, V>`</b> はキー付きのマップを作る:\n\n```typescript\ntype RolePermissions = Record<\"admin\" | \"user\", string[]>;\n```\n\n<b>`ReturnType<T>`</b> は関数の戻り値型を読む:\n\n```typescript\ntype NewUser = ReturnType<typeof createUser>;\n```\n\n<b>`Readonly<T>`</b> は形を凍らせる:\n\n```typescript\ntype FrozenUser = Readonly<User>;\n```\n\n---\n\n### 組み合わせる\n\n本当の利点は組み合わせにある。APIの入力型がモデルに自動で追随する:\n\n```typescript\ntype CreateUserInput = Omit<User, \"id\" | \"createdAt\">;\n\ntype UpdateUserInput = Partial<Omit<User, \"id\" | \"createdAt\">>;\n```\n\n`User` を一度変えれば両方が追う。この2つを手書きすれば、誰かがフィールドを足した最初の瞬間からずれ始める。",
      },
      diagram: `One model, many derived shapes

              interface User
                    │
     ┌──────────────┼──────────────┐
     ▼              ▼              ▼
 Partial<User>  Pick<User,     Omit<User,
     │           "id"|"name">   "password">
     ▼              ▼              ▼
 every field    just those     everything
 optional       three          except that


They compose, so the API types follow the model

Omit<User, "id" | "createdAt">          -> CreateUserInput
Partial<Omit<User, "id" | "createdAt">> -> UpdateUserInput

change User once
        │
        ▼
both follow automatically`,
      codeExample: {
        title: { en: "Deriving API types from one model", np: "एउटै model बाट API type व्युत्पन्न गर्नु", jp: "ひとつのモデルからAPIの型を導く" },
        code: `interface User {
  id:       number;
  name:     string;
  email:    string;
  password: string;
  role:     "admin" | "user";
  createdAt: Date;
}

// ── Partial<T> — all properties become optional ────────────────────
// Perfect for update/patch operations
type UserUpdate = Partial<User>;
function updateUser(id: number, changes: UserUpdate) { /* ... */ }
updateUser(1, { name: "Bob" });          // only provide what changed

// ── Required<T> — all properties become required ──────────────────
type CompleteUser = Required<User>;      // removes all ? optionals

// ── Pick<T, K> — keep only the listed properties ──────────────────
type UserProfile = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string }
// Use for API response shaping — never return the password

// ── Omit<T, K> — remove listed properties ─────────────────────────
type PublicUser = Omit<User, "password" | "createdAt">;
// { id: number; name: string; email: string; role: "admin" | "user" }

// ── Record<K, V> — object with specific key and value types ────────
type RolePermissions = Record<"admin" | "user", string[]>;
const permissions: RolePermissions = {
  admin: ["read", "write", "delete"],
  user:  ["read"],
};

type IdMap = Record<string, User>;      // string keys → User values

// ── ReturnType<T> — extract the return type of a function ─────────
function createUser(name: string, email: string) {
  return { id: Date.now(), name, email };
}
type NewUser = ReturnType<typeof createUser>;
// { id: number; name: string; email: string }

// ── Readonly<T> — all properties cannot be reassigned ─────────────
type FrozenUser = Readonly<User>;
const user: FrozenUser = { id: 1, name: "Alice", /* ... */ };
// user.name = "Bob";  // ❌ Error: cannot assign to 'name' — it is read-only

// ── NonNullable<T> — removes null and undefined ────────────────────
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;  // string

// ── Combining utility types ────────────────────────────────────────
type CreateUserInput = Omit<User, "id" | "createdAt">;
type UpdateUserInput = Partial<Omit<User, "id" | "createdAt">>;`,
      },
      keyTakeaways: [
        { en: "Utility types <b>transform an existing type</b>, keeping one definition as the source of truth.", np: "Utility type ले <b>भएको type रूपान्तरण</b> गर्छ, एउटै परिभाषालाई सत्यको स्रोत राख्दै।", jp: "ユーティリティ型は<b>既存の型を変換</b>し、定義ひとつを情報源に保つ。" },
        { en: "`Partial<T>` makes every property optional — the shape of an update payload.", np: "`Partial<T>` ले हरेक property वैकल्पिक बनाउँछ — update payload को आकार।", jp: "`Partial<T>` は全プロパティを任意にする。更新ペイロードの形。" },
        { en: "`Pick<T, K>` keeps the listed keys; `Omit<T, K>` drops them.", np: "`Pick<T, K>` ले सूचीका key राख्छ; `Omit<T, K>` ले हटाउँछ।", jp: "`Pick<T, K>` は挙げたキーを残し、`Omit<T, K>` は落とす。" },
        { en: "`Record<K, V>` builds a keyed map, and `ReturnType<typeof fn>` reads a function's result.", np: "`Record<K, V>` ले key भएको map बनाउँछ, र `ReturnType<typeof fn>` ले function को नतिजा पढ्छ।", jp: "`Record<K, V>` はキー付きマップを作り、`ReturnType<typeof fn>` は関数の結果を読む。" },
        { en: "They <b>compose</b>: `Partial<Omit<User, \"id\">>` describes an update body in one line.", np: "यी <b>जोडिन्छन्</b>: `Partial<Omit<User, \"id\">>` ले एक लाइनमा update body वर्णन गर्छ।", jp: "<b>合成できる</b>。`Partial<Omit<User, \"id\">>` は更新ボディを1行で表す。" },
        { en: "Deriving beats duplicating — two hand-written types drift apart the first time the model changes.", np: "व्युत्पन्न गर्नु नक्कल भन्दा राम्रो — हातले लेखिएका दुई type model बदलिने पहिलो पटकमै फरक पर्छन्।", jp: "導出は複製に勝る。手書きの2つの型は、モデルが変わった最初の瞬間からずれる。" },
      ],
      commonMistakes: [
        { en: "<b>Hand-writing `CreateUser` and `UpdateUser`</b> — the moment somebody adds a field to `User`, the copies silently fall behind.", np: "<b>`CreateUser` र `UpdateUser` हातले लेख्नु</b> — कसैले `User` मा field थप्ने बित्तिकै, copy चुपचाप पछि पर्छन्।", jp: "<b>`CreateUser` と `UpdateUser` を手書きする</b> — 誰かが `User` にフィールドを足した瞬間、複製は黙って取り残される。" },
        { en: "<b>Using `Partial<T>` for a create payload</b> — creation usually has required fields; `Omit` is the right tool there, and `Partial` belongs on updates.", np: "<b>Create payload का लागि `Partial<T>` प्रयोग गर्नु</b> — creation मा प्रायः आवश्यक field हुन्छन्; त्यहाँ `Omit` सही हो, र `Partial` update मा सुहाउँछ।", jp: "<b>作成用ペイロードに `Partial<T>` を使う</b> — 作成には必須項目があるのが普通。そこは `Omit` が正しく、`Partial` は更新向き。" },
        { en: "<b>Expecting `Readonly<T>` to freeze at runtime</b> — like `readonly`, it is a compile-time constraint only.", np: "<b>`Readonly<T>` ले runtime मा जमाउँछ भन्ने आशा गर्नु</b> — `readonly` जस्तै, यो compile-time मात्रको बन्देज हो।", jp: "<b>`Readonly<T>` が実行時に凍結すると思う</b> — `readonly` と同じくコンパイル時だけの制約。" },
      ],
      quiz: [
        {
          question: { en: "What does `Partial<User>` produce?", np: "`Partial<User>` ले के बनाउँछ?", jp: "`Partial<User>` は何を作るか?" },
          options: [
            { en: "A type with every property removed", np: "हरेक property हटाइएको type", jp: "すべてのプロパティを取り除いた型" },
            { en: "A type where every property is read-only", np: "हरेक property read-only भएको type", jp: "すべてが読み取り専用になった型" },
            { en: "A type where every property is optional", np: "हरेक property वैकल्पिक भएको type", jp: "すべてのプロパティが任意になった型" },
            { en: "A type where every property is `any`", np: "हरेक property `any` भएको type", jp: "すべてが `any` になった型" },
          ],
          correctIndex: 2,
          explanation: { en: "That is exactly the shape of a PATCH or update body.", np: "यो ठ्याक्कै PATCH वा update body को आकार हो।", jp: "これはPATCHや更新ボディの形そのもの。" },
        },
        {
          question: { en: "What does `Omit<User, \"password\">` produce?", np: "`Omit<User, \"password\">` ले के बनाउँछ?", jp: "`Omit<User, \"password\">` は何を作るか?" },
          options: [
            { en: "Everything except `password`", np: "`password` बाहेक सबै", jp: "`password` を除くすべて" },
            { en: "A type where `password` is optional", np: "`password` वैकल्पिक भएको type", jp: "`password` が任意になった型" },
            { en: "Only `password`", np: "`password` मात्र", jp: "`password` だけ" },
            { en: "An unrelated new type", np: "असम्बन्धित नयाँ type", jp: "無関係な新しい型" },
          ],
          correctIndex: 0,
          explanation: { en: "It is how a public response type is built from an internal record.", np: "भित्री record बाट सार्वजनिक response type यसै गरी बन्छ।", jp: "内部レコードから公開レスポンス型を作る方法。" },
        },
        {
          question: { en: "Why derive `UpdateUserInput` from `User` rather than writing it out?", np: "`UpdateUserInput` हातले लेख्नुको सट्टा `User` बाट किन व्युत्पन्न गर्ने?", jp: "`UpdateUserInput` を手書きせず `User` から導く理由は?" },
          options: [
            { en: "It compiles faster", np: "यो छिटो compile हुन्छ", jp: "コンパイルが速いから" },
            { en: "Two hand-written definitions drift apart as the model changes", np: "हातले लेखिएका दुई परिभाषा model बदलिँदा फरक पर्छन्", jp: "手書きの2つはモデルの変化とともにずれるから" },
            { en: "Derived types are checked at runtime", np: "व्युत्पन्न type runtime मा जाँचिन्छन्", jp: "導出した型は実行時に検査されるから" },
          ],
          correctIndex: 1,
          explanation: { en: "Change `User` once and every derived type follows.", np: "`User` एक पटक बदल्नुहोस्, हरेक व्युत्पन्न type पछ्याउँछ।", jp: "`User` を一度変えれば、導出された型はすべて追随する。" },
        },
        {
          question: { en: "Which utility builds `{ admin: string[]; user: string[] }` from a key union?", np: "Key union बाट `{ admin: string[]; user: string[] }` कुन utility ले बनाउँछ?", jp: "キーのユニオンから `{ admin: string[]; user: string[] }` を作るのはどれか?" },
          options: [
            { en: "`Record<K, V>`", np: "`Record<K, V>`", jp: "`Record<K, V>`" },
            { en: "`Pick<T, K>`", np: "`Pick<T, K>`", jp: "`Pick<T, K>`" },
            { en: "`ReturnType<T>`", np: "`ReturnType<T>`", jp: "`ReturnType<T>`" },
          ],
          correctIndex: 0,
          explanation: { en: "`Record<\"admin\" | \"user\", string[]>` gives exactly that shape.", np: "`Record<\"admin\" | \"user\", string[]>` ले ठ्याक्कै त्यही आकार दिन्छ।", jp: "`Record<\"admin\" | \"user\", string[]>` がまさにその形を与える。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What is the main advantage of `unknown` over `any`?", np: "`any` भन्दा `unknown` को मुख्य फाइदा के हो?", jp: "`any` に対する `unknown` の主な利点は?" },
      options: [
        { en: "It is faster at runtime", np: "यो runtime मा छिटो हुन्छ", jp: "実行時に速い" },
        { en: "It automatically becomes a string", np: "यो स्वतः string बन्छ", jp: "自動的に文字列になる" },
        { en: "It requires you to narrow the type before using it", np: "यसले प्रयोगअघि type narrow गर्न लगाउँछ", jp: "使う前に型を絞り込ませる" },
        { en: "It disables checking entirely", np: "यसले जाँच पूरै बन्द गर्छ", jp: "検査を完全に無効にする" },
      ],
      correctIndex: 2,
      explanation: { en: "`any` compiles every access, including the ones that throw at runtime.", np: "`any` ले हरेक पहुँच compile गर्छ, runtime मा error दिनेहरू पनि।", jp: "`any` は実行時に落ちるものまで含め、すべての参照を通す。" },
    },
    {
      question: { en: "For `function first<T>(items: T[]): T`, what is `first([1, 2, 3])`?", np: "`function first<T>(items: T[]): T` मा `first([1, 2, 3])` के हो?", jp: "`function first<T>(items: T[]): T` のとき `first([1, 2, 3])` は?" },
      options: [
        { en: "`any`", np: "`any`", jp: "`any`" },
        { en: "`number`", np: "`number`", jp: "`number`" },
        { en: "`unknown`", np: "`unknown`", jp: "`unknown`" },
        { en: "`number[]`", np: "`number[]`", jp: "`number[]`" },
      ],
      correctIndex: 1,
      explanation: { en: "The generic keeps the link between the argument and the result.", np: "Generic ले argument र नतिजाबीचको सम्बन्ध जोगाउँछ।", jp: "ジェネリクスが引数と結果の結び付きを保つ。" },
    },
    {
      question: { en: "What does `Partial<User>` do?", np: "`Partial<User>` ले के गर्छ?", jp: "`Partial<User>` は何をするか?" },
      options: [
        { en: "Removes all properties", np: "सबै property हटाउँछ", jp: "すべてのプロパティを取り除く" },
        { en: "Converts every property to `any`", np: "हरेक property `any` मा बदल्छ", jp: "すべてを `any` に変える" },
        { en: "Makes every property read-only", np: "हरेक property read-only बनाउँछ", jp: "すべてを読み取り専用にする" },
        { en: "Makes every property optional", np: "हरेक property वैकल्पिक बनाउँछ", jp: "すべてのプロパティを任意にする" },
      ],
      correctIndex: 3,
      explanation: { en: "That is exactly the shape of an update payload.", np: "यो ठ्याक्कै update payload को आकार हो।", jp: "これは更新ペイロードの形そのもの。" },
    },
    {
      question: { en: "What does `Omit<User, \"password\">` produce?", np: "`Omit<User, \"password\">` ले के बनाउँछ?", jp: "`Omit<User, \"password\">` は何を作るか?" },
      options: [
        { en: "All of `User` except `password`", np: "`password` बाहेक `User` का सबै", jp: "`password` を除く `User` のすべて" },
        { en: "A type where `password` is optional", np: "`password` वैकल्पिक भएको type", jp: "`password` が任意の型" },
        { en: "A type containing only `password`", np: "`password` मात्र भएको type", jp: "`password` だけの型" },
        { en: "A completely unrelated type", np: "पूर्णतः असम्बन्धित type", jp: "まったく無関係な型" },
      ],
      correctIndex: 0,
      explanation: { en: "It is how you build a public response type from an internal record.", np: "भित्री record बाट सार्वजनिक response type यसै गरी बन्छ।", jp: "内部レコードから公開レスポンス型を作る方法。" },
    },
    {
      question: { en: "What is type narrowing?", np: "Type narrowing के हो?", jp: "型の絞り込みとは?" },
      options: [
        { en: "Reducing the number of properties on a type", np: "Type का property संख्या घटाउनु", jp: "型のプロパティ数を減らすこと" },
        { en: "Using a check such as `typeof` so TypeScript knows which union member you have", np: "`typeof` जस्तो जाँचले TypeScript लाई union को कुन सदस्य हो थाहा दिनु", jp: "`typeof` などの判定で、ユニオンのどの型かを知らせること" },
        { en: "Converting a type to `any`", np: "Type लाई `any` मा बदल्नु", jp: "型を `any` に変えること" },
      ],
      correctIndex: 1,
      explanation: { en: "Inside the branch, only that member's operations are allowed.", np: "Branch भित्र, त्यही सदस्यका operation मात्र अनुमति हुन्छन्।", jp: "その分岐の中では、その型の操作だけが許される。" },
    },
    {
      question: { en: "When should you prefer `type` over `interface`?", np: "`interface` भन्दा `type` कहिले रोज्ने?", jp: "`interface` より `type` を選ぶのはいつか?" },
      options: [
        { en: "Always, interfaces are deprecated", np: "सधैं, interface अप्रचलित छन्", jp: "常に。interfaceは非推奨" },
        { en: "Only inside classes", np: "Class भित्र मात्र", jp: "クラスの中だけ" },
        { en: "For unions, tuples and intersections", np: "Union, tuple र intersection का लागि", jp: "ユニオン・タプル・インターセクションのため" },
      ],
      correctIndex: 2,
      explanation: { en: "For a plain object shape either works; interfaces also merge and extend.", np: "सादा object आकारमा दुबै चल्छन्; interface merge र extend पनि हुन्छन्।", jp: "素の形はどちらでもよい。インターフェースはマージと拡張もできる。" },
    },
    {
      question: { en: "What does the constraint `K extends keyof T` guarantee?", np: "`K extends keyof T` ले केको ग्यारेन्टी गर्छ?", jp: "`K extends keyof T` は何を保証するか?" },
      options: [
        { en: "That the key actually exists on the object", np: "Key object मा साँच्चै छ", jp: "キーがオブジェクトに実在すること" },
        { en: "That the value is a string", np: "मान string हो", jp: "値が文字列であること" },
        { en: "That the object is readonly", np: "Object readonly छ", jp: "オブジェクトが読み取り専用であること" },
      ],
      correctIndex: 0,
      explanation: { en: "`getProperty(user, \"email\")` fails to compile when `User` has no `email`.", np: "`User` मा `email` नभए `getProperty(user, \"email\")` compile हुँदैन।", jp: "`User` に `email` がなければコンパイルできない。" },
    },
    {
      question: { en: "Why derive `UpdateUser` from `User` instead of writing it out?", np: "`UpdateUser` हातले लेख्नुको सट्टा `User` बाट किन व्युत्पन्न गर्ने?", jp: "`UpdateUser` を手書きせず `User` から導出する理由は?" },
      options: [
        { en: "Two hand-written definitions drift apart as the model changes", np: "हातले लेखिएका दुई परिभाषा model बदलिँदा फरक पर्छन्", jp: "手書きの2つはモデルの変化とともにずれるから" },
        { en: "It compiles faster", np: "यो छिटो compile हुन्छ", jp: "コンパイルが速いから" },
        { en: "Derived types are checked at runtime", np: "व्युत्पन्न type runtime मा जाँचिन्छन्", jp: "導出した型は実行時に検査されるから" },
      ],
      correctIndex: 0,
      explanation: { en: "One definition stays the single source of truth.", np: "एउटै परिभाषा सत्यको एक स्रोत रहन्छ।", jp: "定義ひとつが単一の情報源であり続ける。" },
    },
  ],
};
