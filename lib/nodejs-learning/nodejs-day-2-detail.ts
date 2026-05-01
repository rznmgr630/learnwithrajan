import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_2_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Before frameworks, Node shares code through **modules**. Each file is its own little world: what you `require` is cached, paths are resolved carefully, and built-in modules like **path** and **os** stop your scripts from breaking when folders or operating systems differ.",
      np: "मोड्युलले कोड साझेदारी गर्छ — require, cache, path, os।",
      jp: "モジュールでコードを共有。`require` はキャッシュされ、`path` / `os` で環境差を吸収する。",
    },
    {
      en: "Think of **CommonJS** (`require` / `module.exports`) as the original Node style (still everywhere). **ES modules** (`import` / `export`) are first-class too—teams often mix them during migration; just follow one consistent approach per project.",
      np: "CommonJS र ESM — परियोजनामा एकै शैली राख्नुहोस्।",
      jp: "CommonJS が王道。ESM との混在はプロジェクトのルールに従う。",
    },
  ],
  sections: [
    {
      title: { en: "Introduction & the global object", np: "परिचय र ग्लोबल", jp: "はじめに・グローバル" },
      blocks: [
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
            en: "Unlike a browser script where top-level names can attach to `window`, each Node **module file is wrapped** in a function (see below). That means a bare `var x = 1` at the top of a file does **not** become a global variable—it stays private to that file unless you attach it to `globalThis` (almost always a bad idea for app code). Use **explicit exports** instead.",
            np: "प्रत्येक फाइल आफ्नै स्कोप — ग्लोबलमा थप्नु हुँदैन; निर्यात प्रयोग गर्नुहोस्।",
            jp: "ファイル単位でスコープが閉じる。グローバル汚染は避け、export を使う。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**globalThis** — the cross-environment name for “the one global object.” In Node, putting helpers on `globalThis` makes them visible everywhere and hard to test—reserve it for polyfills or debugging shims, not business logic.",
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
            en: "When you `require('./something')`, Node resolves a **real file path**, runs the file **once**, stores the exported object in **`require.cache`**, and hands you the **same** exports object on every later `require` from any file. That is why side effects at import time happen only once—and why mutating `module.exports` affects all importers.",
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
              en: "**Creating a module** — assign what you want public to `module.exports`. You can also write `exports.foo = …` because `exports` starts as an alias of `module.exports`, but **do not** reassign `exports = …` or you break the link.",
              np: "`module.exports` प्रयोग गर्नुहोस् — `exports = {}` ले जडान टुट्छ।",
              jp: "**作成** — `module.exports` に公開したいものを載せる。`exports` の再代入は危険。",
            },
            {
              en: "**Loading** — `require('./relative')` searches relative to the current file; `require('lodash')` searches **node_modules** upward from the current folder; core modules like `fs` win by name without paths.",
              np: "`./` सापेक्षिक; प्याकेज नामले node_modules खोज्छ।",
              jp: "**読み込み** — `./` は相対、`lodash` のような名前は node_modules を遡る。",
            },
            {
              en: "**Module wrapper function** — Node wraps your file so these variables exist: `exports`, `require`, `module`, `__filename`, `__dirname`. That is why `__dirname` is always the folder of the **current** file.",
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
            en: "Never build paths with string concatenation like `folder + '/' + file`—on Windows separators differ. **`path.join`** and **`path.resolve`** normalize slashes. **`path.parse`** splits a path into root, dir, base, name, extension—handy for renaming uploads or logs.",
            np: "`path.join` प्रयोग गर्नुहोस् — Windows मा `/` मात्र जोड्नु हुँदैन।",
            jp: "パスは **`path.join`** / **`resolve`**。文字連結は環境で壊れる。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "**os** answers “what machine am I on?” — `os.platform()`, `os.release()`, `os.homedir()`, `os.cpus().length`. Useful for diagnostic logging; avoid dumping sensitive paths from production hosts into user-visible errors.",
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
        en: "`module.exports = createServer` exposes **one** function as the whole module. `module.exports = { createUser, listUsers }` exposes **multiple** names—consumers destructure: `const { createUser } = require('./users')`. Pick one style per folder so imports stay predictable.",
        np: "एक फङ्क्शन वा अब्जेक्ट निर्यात — टोलीले बुझ्ने शैली राख्नुहोस्।",
        jp: "単一なら関数をそのまま、複数ならオブジェクトでまとめる。フォルダで統一する。",
      },
    },
  ],
};
