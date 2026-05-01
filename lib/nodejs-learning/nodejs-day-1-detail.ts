import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_1_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "If you only know JavaScript in the browser, **Node.js** can feel mysterious: it uses the same language, but there is no DOM and no “page.” Think of Node as a program that runs your `.js` files on your computer or server, powered by the same V8 engine Chrome uses—optimized for building APIs, CLIs, and tools.",
      np: "ब्राउजर बाहिर JS चलाउने कारण Node.js — V8 मा आधारित, API र टुलका लागि।",
      jp: "ブラウザ以外で JS を動かすのが Node.js。同じ V8 で CLI・API・ツールを作る。",
    },
    {
      en: "This first stretch connects everyday words (**runtime**, **event loop**, **non-blocking I/O**) to what you will actually see when code runs: one main thread for JavaScript, with the operating system and libuv handling waiting on disks and networks in the background.",
      np: "रनटाइम र इभेन्ट लूपलाई साधारण शब्दमा जोड्नुहोस् — मुख्य थ्रेड र पृष्ठभूमि I/O।",
      jp: "ランタイムやイベントループを「コードがどう動くか」と結びつけて押さえる。",
    },
  ],
  sections: [
    {
      title: { en: "Welcome — what Node is (in plain language)", np: "स्वागत — Node के हो", jp: "ようこそ・Node とは" },
      blocks: [
        {
          type: "code",
          title: { en: "Node vs browser globals", np: "Node बनाम ब्राउजर", jp: "Node とブラウザ" },
          code: `// In Node there is no window/document — you get process, module, require, …
console.log(typeof window); // "undefined"
console.log(process.version); // e.g. v20.x.x`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Node.js** is not a framework and not a language—it is a **runtime**: a program that reads your JavaScript and talks to the OS (files, network, timers). **npm** is the huge library registry that ships with Node so you can reuse other people’s packages. Node shines when you work with JSON, HTTP, streams, and automation; it is not automatically the best choice for heavy CPU-only math on a single process (there are workers and native addons for that later).",
            np: "Node रनटाइम हो — JS चलाउने इन्जिन। npm ले प्याकेज साझा गर्छ। JSON र HTTP मा बलियो।",
            jp: "Node は**ランタイム**（JS を実行するエンジン）。**npm** でパッケージを共有。JSON・HTTP・自動化に強い。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Preview the roadmap** — skim once so you see the arc: core modules → npm → Express APIs → MongoDB → auth → tests → deploy. You do not need to memorize it; come back when you wonder “where does this topic fit?”",
              np: "पूरै बाटो एक पटक हेर्नुहोस् — पछि फर्केर बुझ्न सजिलो हुन्छ।",
              jp: "全体の流れを一度眺める。後で「今どこ？」と確認するため。",
            },
            {
              en: "**Browser vs Node** — in the browser you manipulate the DOM and `window`. In Node you get `globalThis`, modules, `process`, and file/network APIs. Same syntax, different built-ins.",
              np: "ब्राउजरमा DOM; Node मा process र फाइल/नेटवर्क API।",
              jp: "ブラウザは DOM、Node は `process`・ファイル・ネットワーク API。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Architecture — how the pieces fit together", np: "आर्किटेक्चर", jp: "アーキテクチャ" },
      blocks: [
        {
          type: "code",
          title: { en: "Peek at the OS layer Node talks to", np: "OS जाँच", jp: "OS を覗く" },
          code: `const os = require('os');

console.log('platform:', os.platform());
console.log('CPU cores:', os.cpus().length);
// Node uses libuv under these APIs — you rarely import libuv directly.`,
        },
        {
          type: "paragraph",
          text: {
            en: "At a high level: **V8** compiles and runs your JavaScript. **libuv** is C library code bundled with Node that implements the **event loop**, a thread pool for some blocking work (like parts of file I/O on some systems), and cross-platform wrappers around the OS. You rarely call libuv directly—you use Node’s APIs (`fs`, `http`, `setTimeout`) and they delegate underneath.",
            np: "V8 ले JS चलाउँछ; libuv ले इभेन्ट लूप र async I/O। तपाईंले प्रायः Node API मात्र प्रयोग गर्नुहुन्छ।",
            jp: "**V8** が JS を実行。**libuv** がイベントループと OS との橋渡し。直接 libuv は触らない。",
          },
        },
        {
          type: "diagram",
          id: "node-one-thread-io",
        },
        {
          type: "paragraph",
          text: {
            en: "The diagram above is the mental model: **one JavaScript thread** runs your callbacks in order. While thousands of sockets or file handles “wait,” the OS and libuv track them; when data arrives, your callback is queued. That is why Node can feel fast for I/O-heavy servers without spawning a thread per connection.",
            np: "एक JS थ्रेडले कलब्याक चलाउँछ; धेरै कनेक्सन पर्खँदा पनि OS ले ट्र्याक गर्छ।",
            jp: "JS は一本線で進む。待ちは OS/libuv に任せ、準備できたらコールバックが並ぶ。",
          },
        },
      ],
    },
    {
      title: { en: "How Node runs code — event loop (big picture)", np: "इभेन्ट लूप", jp: "イベントループの見取り図" },
      blocks: [
        {
          type: "code",
          title: { en: "Order of execution (run and watch the console)", np: "चलाउने क्रम", jp: "実行順の例" },
          code: `console.log('1 sync');

setTimeout(() => console.log('4 timer'), 0);

Promise.resolve().then(() => console.log('3 microtask'));

console.log('2 sync');
// Typical: 1, 2, 3, 4 — microtasks before the next timer callback`,
        },
        {
          type: "paragraph",
          text: {
            en: "You do not need every phase name on day one, but you **should** know: timers (`setTimeout`), I/O callbacks, and `setImmediate` are scheduled in different turns of the loop. Between phases, **microtasks** run (`Promise.then`, `queueMicrotask`)—that ordering explains tricky interview-style logs you will see later.",
            np: "टाइमर, I/O र microtask को क्रम बुझ्नुहोस् — लग आउटपुट त्यहीँबाट आउँछ।",
            jp: "フェーズの細部より「順番がある」を押さえる。Promise はマイクロタスクとして挟まる。",
          },
        },
        {
          type: "diagram",
          id: "node-event-loop-phases",
        },
        {
          type: "diagram",
          id: "node-execution-priority",
        },
        {
          type: "paragraph",
          text: {
            en: "The second diagram shows **why** `console.log`, `setTimeout`, `Promise.then`, and `process.nextTick` can print in an order that surprises beginners. When you are debugging, assume **nothing is simultaneous**—everything is ordered by these rules.",
            np: "आउटपुट क्रम अचम्म लाग्न सक्छ — लग हेर्दा यही नियमले व्याख्या गर्छ।",
            jp: "ログの順序は「同時」ではなくルールで決まる。デバッグ時はこの順を思い出す。",
          },
        },
      ],
    },
    {
      title: { en: "Installing Node & your first program", np: "स्थापना र पहिलो कार्यक्रम", jp: "インストールと最初のプログラム" },
      blocks: [
        {
          type: "code",
          title: { en: "Check versions, then run a file", np: "संस्करण र फाइल", jp: "バージョン確認と実行" },
          code: `# Terminal (after installing Node):
#   node -v
#   npm -v

// hello.js — save next to where you run the command
console.log('Hello from Node');
//   node hello.js`,
        },
        {
          type: "paragraph",
          text: {
            en: "Install a **current LTS** version from **nodejs.org** unless your team pins something else. **Version managers** (`nvm`, `fnm`, `volta`) let each project use its own Node version—when you join a real codebase, there is often an `.nvmrc` or `engines` field in `package.json`. After install, open a terminal and check **both** `node -v` and `npm -v`.",
            np: "LTS प्रयोग गर्नुहोस्; nvm/fnm ले परियोजना अनुसार संस्करण। `node -v` र `npm -v` जाँच।",
            jp: "**LTS** を入れる。`nvm` / `fnm` でプロジェクトごとにバージョンを揃える。`node -v` と `npm -v` を確認。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**No browser needed** — `node path/to/file.js` executes top-to-bottom. Use `node` alone to open the REPL (read-eval-print loop) for tiny experiments.",
              np: "`node file.js` ले चलाउँछ; `node` मात्रले REPL।",
              jp: "`node file.js` で実行。対話的な試しは `node` のみで REPL。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Course structure, recap habit & learning paths", np: "पाठ्यक्रम र बाटो", jp: "構成・振り返り・学び方" },
      blocks: [
        {
          type: "code",
          title: { en: "Every Node project starts here", np: "सुरुवाती package.json", jp: "プロジェクトの形" },
          code: `// package.json (Sketch — npm init creates this for you)
{
  "name": "my-learning-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  }
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "This track mirrors a classic Node curriculum: **modules and core APIs first**, then **npm**, then **Express** for HTTP, **MongoDB/Mongoose** for data, **JWT auth**, **errors and logging**, **Jest**, integration tests and TDD-style exercises, and finally **deployment**. Each block below builds on the previous—skipping ahead works only if you already know that layer.",
            np: "क्रम — मोड्युल → npm → Express → Mongo → प्रमाणीकरण → त्रुटि → परीक्षण → डिप्लोइ।",
            jp: "モジュール → npm → Express → DB → 認証 → エラー → テスト → デプロイの順が土台。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Recap habit** — after each study session, write three short notes: (1) what you ran successfully, (2) what error message you saw and how you fixed it, (3) one thing to look up in the official docs. That turns passive reading into muscle memory.",
              np: "हरेक पटक — के चल्यो, के त्रुटि, डकमा के हेर्ने।",
              jp: "**振り返り** — 成功したこと・直したエラー・ドキュメントで確認することを3つ書く。",
            },
            {
              en: "**Learning paths** — want depth on **internals**? Spend extra time on the event loop and profiling. Prefer **shipping APIs**? Focus on Express, validation, and tests. Growing toward **DevOps**? Pair this track with Docker and CI once REST + Mongo feel familiar.",
              np: "गहिराइ — इन्टर्नल, API डिजाइन, वा Docker/CI मध्ये छान्न सकिन्छ।",
              jp: "**進み方** — 内部・API 設計・Docker/CI のどれを厚くするか選べる。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why is blocking the event loop a problem?",
        np: "इभेन्ट लूप रोक्नु किन खतरनाक?",
        jp: "イベントループをブロックすると何がまずい？",
      },
      answer: {
        en: "The main JavaScript thread handles all queued callbacks for your process. If you run a long **synchronous** loop or huge computation there, timers fire late, HTTP responses stall, and the server looks “frozen.” Use **async APIs** for disk/network, split CPU work with **worker threads** or separate processes when needed.",
        np: "लामो sync कामले टाइमर र HTTP ठप्प पार्छ — async वा worker प्रयोग गर्नुहोस्।",
        jp: "重い同期処理でタイマーやレスポンスが遅れる。I/O は非同期 API、CPU はワーカー等へ。",
      },
    },
    {
      question: {
        en: "Where should I read official, up-to-date facts?",
        np: "आधिकारिक जानकारी कहाँ?",
        jp: "公式の情報はどこ？",
      },
      answer: {
        en: "Bookmark **nodejs.org/docs** for the stable API reference and guides. Use **npmjs.com** for package READMEs and versions. This roadmap is an **orientation**—always verify behavior for your exact Node major version.",
        np: "nodejs.org/docs र npmjs.com — संस्करण अनुसार फरक हुन सक्छ।",
        jp: "**nodejs.org/docs** と **npmjs.com**。バージョンごとに挙動は確認する。",
      },
    },
  ],
};
