import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_2_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "In Node.js, you share code between files using **modules**. Each file is its own separate space — when you `require` a file, Node runs it once and saves the result. Built-in modules like **path** and **os** help your code work the same way on any computer or operating system.",
      np: "मोड्युलले कोड साझेदारी गर्छ — require, cache, path, os।",
      jp: "モジュールでコードを共有。`require` はキャッシュされ、`path` / `os` で環境差を吸収する。",
    },
    {
      en: "**CommonJS** (`require` / `module.exports`) is the original Node.js way of importing code — you'll see it everywhere. **ES modules** (`import` / `export`) are the modern style. Most projects pick one and stick with it, though you may see both during a transition.",
      np: "CommonJS र ESM — परियोजनामा एकै शैली राख्नुहोस्।",
      jp: "CommonJS が王道。ESM との混在はプロジェクトのルールに従う。",
    },
  ],
  sections: [
    {
      title: { en: "Introduction & the global object", np: "परिचय र ग्लोबल", jp: "はじめに・グローバル" },
      blocks: [
        {
          type: "youtube",
          videoId: "fBNz5xF-Kx4",
          title: "Node.js Modules Explained",
        },
        {
          type: "code",
          title: { en: "Each file is its own scope", np: "फाइल स्कोप", jp: "ファイルは別スコープ" },
          code: `// In a CommonJS module, top-level \`this\` points at module.exports
console.log(this === module.exports); // true

const secret = 42; // not global — other files cannot see \`secret\`
globalThis.demo = 'avoid this in real apps';`,
        },
        {
          type: "paragraph",
          text: {
            en: "In a browser, variables at the top of a script can accidentally become global (attached to `window`). Node prevents this — every file is **wrapped in a function**, so a `var x = 1` at the top stays private to that file. If you want other files to use it, export it. Putting things on `globalThis` is almost always a bad idea.",
            np: "प्रत्येक फाइल आफ्नै स्कोप — ग्लोबलमा थप्नु हुँदैन; निर्यात प्रयोग गर्नुहोस्।",
            jp: "ファイル単位でスコープが閉じる。グローバル汚染は避け、export を使う。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**globalThis** — this is the global object, available in any environment (Node, browser, etc.). Putting your own functions on it means they're visible everywhere in your app, which makes code hard to test and debug. Use it only for polyfills or temporary debugging, not real app logic.",
              np: "`globalThis` मा व्यापार लजिक नराख्नुहोस् — परीक्षण गाह्रो हुन्छ।",
              jp: "`globalThis` はテストしにくい。ビジネスロジックは置かない。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Modules — create, load & the wrapper function", np: "मोड्युल सिर्जना र लोड", jp: "モジュールの作成・読み込み・ラッパー" },
      blocks: [
        {
          type: "youtube",
          videoId: "yxJG-edtgPM",
          title: "CommonJS vs ES Modules in Node.js",
        },
        {
          type: "code",
          title: { en: "Tiny export / import pair", np: "सानो उदाहरण", jp: "小さい例" },
          code: `// math.js
module.exports.add = (a, b) => a + b;

// app.js
const math = require('./math');
console.log(math.add(2, 3));`,
        },
        {
          type: "paragraph",
          text: {
            en: "When you call `require('./something')`, Node finds the file, runs it **once**, and saves the result in **`require.cache`**. Every time you `require` that same file again — from anywhere in your project — you get back the exact same object. This means any setup code in that file only runs once, and any changes to `module.exports` will be seen by everyone who imports it.",
            np: "`require` ले पथ हल गर्छ, एक पटक चलाउँछ, cache मा राख्छ — पछि एउटै exports फर्काउँछ।",
            jp: "`require` は一度だけ実行し、同じ exports を返す。だから副作用は一回。",
          },
        },
        {
          type: "diagram",
          id: "nodejs-require-resolution",
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Creating a module** — put whatever you want to share on `module.exports`. You can also use the shorthand `exports.foo = …` since `exports` starts as an alias for `module.exports`. Just don't do `exports = {}` — that breaks the connection and nothing gets exported.",
              np: "`module.exports` प्रयोग गर्नुहोस् — `exports = {}` ले जडान टुट्छ।",
              jp: "**作成** — `module.exports` に公開したいものを載せる。`exports` の再代入は危険。",
            },
            {
              en: "**Loading** — `require('./file')` looks for a file relative to where you are. `require('lodash')` looks inside the `node_modules` folder, walking up until it finds it. Built-in modules like `fs` are always available just by name — no path needed.",
              np: "`./` सापेक्षिक; प्याकेज नामले node_modules खोज्छ।",
              jp: "**読み込み** — `./` は相対、`lodash` のような名前は node_modules を遡る。",
            },
            {
              en: "**Module wrapper** — Node secretly wraps every file in a function before running it. That's how variables like `exports`, `require`, `module`, `__filename`, and `__dirname` become available. So `__dirname` always gives you the folder path of the file you're currently in.",
              np: "व्रापरले `__dirname` र `__filename` दिन्छ।",
              jp: "**ラッパー** — `__dirname` / `__filename` はこの仕組みで渡される。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Path & OS modules — portable scripts", np: "Path र OS", jp: "path と os" },
      blocks: [
        {
          type: "code",
          title: { en: "Path snippet", np: "path उदाहरण", jp: "path の例" },
          code: `const path = require('path');

const full = path.join(__dirname, 'config', 'default.json');
const { name, ext } = path.parse('/var/log/app.log');
// name === 'app', ext === '.log'`,
        },
        {
          type: "paragraph",
          text: {
            en: "Don't build file paths by joining strings like `folder + '/' + file` — that breaks on Windows because it uses `\\` instead of `/`. Use **`path.join`** or **`path.resolve`** and Node handles the slashes for you. **`path.parse`** is handy when you need to pull apart a file path — like grabbing just the filename or extension from an upload.",
            np: "`path.join` प्रयोग गर्नुहोस् — Windows मा `/` मात्र जोड्नु हुँदैन।",
            jp: "パスは **`path.join`** / **`resolve`**。文字連結は環境で壊れる。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "The **os** module tells you about the machine your code is running on — things like the operating system, number of CPUs, and the home directory. It's useful for logging and diagnostics. Just be careful not to leak sensitive info like file paths into error messages that users might see.",
            np: "`os` ले प्लेटफर्म र CPU संख्या — लगमा संवेदनशील पथ नदेखाउनुहोस्।",
            jp: "**os** — プラットフォームや CPU 数。本番では詳細を出しすぎない。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I use default export or named exports in CommonJS?",
        np: "CommonJS मा default वा named?",
        jp: "CommonJS で default と named？",
      },
      answer: {
        en: "If your file does one thing, just export that one function directly: `module.exports = createServer`. If it does multiple things, export an object: `module.exports = { createUser, listUsers }` — then whoever imports it can do `const { createUser } = require('./users')`. The key is to pick one style and stick to it across a folder so your imports are easy to predict.",
        np: "एक फङ्क्शन वा अब्जेक्ट निर्यात — टोलीले बुझ्ने शैली राख्नुहोस्।",
        jp: "単一なら関数をそのまま、複数ならオブジェクトでまとめる。フォルダで統一する。",
      },
    },
  ],
};
