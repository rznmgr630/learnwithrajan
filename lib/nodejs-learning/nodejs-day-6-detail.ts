import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_6_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Middleware** is how you share logic across all your routes without duplicating it. Things like parsing request bodies, checking auth, and logging happen once in the middleware chain before your route handler ever runs. Good folder structure keeps all of that logic easy to find and test as your app grows.",
      np: "मिडलवेयरले साझा लजिक क्रममा चलाउँछ — परीक्षण योग्य संरचना।",
      jp: "**ミドルウェア** で共通処理を順に適用。構成でテストしやすくする。",
    },
    {
      en: "Using **`node --inspect`** with Chrome DevTools is much more powerful than adding `console.log` everywhere. You can set breakpoints, step through async code, and see the actual call stack when a Promise is waiting — which makes tracking down bugs much faster.",
      np: "`--inspect` ले async डिबग सजिलो बनाउँछ।",
      jp: "**`--inspect`** で非同期もブレークポイントを張れる。",
    },
  ],
  sections: [
    {
      title: { en: "Middleware — the heart of Express", np: "मिडलवेयर", jp: "ミドルウェア" },
      blocks: [
        {
          type: "youtube",
          videoId: "MIr1oxQ3pao",
          title: "Express Middleware Explained",
        },
        {
          type: "code",
          title: { en: "Three middlewares in order", np: "मिडलवेयर क्रम", jp: "順番に並べる" },
          code: `const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.get('/api/ping', (req, res) => res.send('pong'));`,
        },
        {
          type: "paragraph",
          text: {
            en: "Every middleware function gets three arguments: **`req`**, **`res`**, and **`next`**. Call **`next()`** when you are done and want the next middleware to run. Call **`next(err)`** if something goes wrong — Express will skip to your error handler. Once you call `res.send()` or `res.json()`, the chain stops and no more middleware runs.",
            np: "`next()` अगाडि, `next(err)` त्रुटि ह्यान्डलर, प्रतिक्रिया पठाएपछि रोकिन्छ।",
            jp: "**ミドルウェア** — `next()` で次へ、`next(err)` でエラーへ。送信後はチェーン停止。",
          },
        },
        {
          type: "diagram",
          id: "nodejs-express-middleware-chain",
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Built-ins** — `express.json()` parses JSON request bodies, `express.urlencoded` handles HTML form data, and `express.static` serves files from a folder. Mount static files before your route middleware so simple file requests do not go through your auth checks.",
              np: "`express.json` अघि रूट — बडी पहिले पार्स।",
              jp: "**組み込み** — JSON・フォーム・静的ファイル。順序が重要。",
            },
            {
              en: "**Third-party** — `cors` controls which origins can call your API, `helmet` sets secure HTTP headers, and `morgan` logs every request. Add only what you actually need, and put security middleware near the top so it runs before anything else.",
              np: "cors, helmet — सुरक्षा अगाडि।",
              jp: "**サードパーティ** — cors / helmet は早めに。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Environments, configuration & debugging",
        np: "वातावरण, विन्यास र डिबग",
        jp: "環境・設定・デバッグ",
      },
      blocks: [
        {
          type: "youtube",
          videoId: "L72fhGm1tfE",
          title: "Debugging Node.js with Chrome DevTools",
        },
        {
          type: "code",
          title: { en: "NODE_ENV + inspect flag", np: "NODE_ENV र inspect", jp: "環境と inspect" },
          code: `# Terminal (development):
NODE_ENV=development node --inspect server.js
# Then open chrome://inspect → inspect your process

console.log(process.env.NODE_ENV);
console.log(process.env.PORT ?? 3000);`,
        },
        {
          type: "paragraph",
          text: {
            en: "**`NODE_ENV`** is a widely used convention. Setting it to `production` tells libraries to enable optimizations and hide detailed error messages from users. Setting it to `test` lets you point to a test database or use mocks. Read all your environment variables in one place — a `config.js` file or a validated schema — so a missing or misspelled variable fails at startup rather than crashing mid-request.",
            np: "`NODE_ENV` र एक पटक विन्यास जाँच।",
            jp: "**NODE_ENV** — 起動時に設定を一箇所で検証。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Debugging** — start your server with `node --inspect server.js`, go to `chrome://inspect` in Chrome, and attach to your process. You can set breakpoints and inspect `req` and `res` objects directly. Pair this with structured (JSON) logs instead of scattered `console.log` strings — they are much easier to search and filter.",
              np: "`--inspect` र संरचित लग।",
              jp: "**デバッグ** — `--inspect` と構造化ログ。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Templating, database hooks & folder structure",
        np: "टेम्प्लेट, डाटाबेस र फोल्डर",
        jp: "テンプレート・DB・フォルダ構成",
      },
      blocks: [
        {
          type: "code",
          title: { en: "Suggested folder layout", np: "फोल्डर संरचना", jp: "フォルダ例" },
          code: `/*
  src/
    index.js       ← creates app, listens
    routes/
    models/
    middleware/
    startup/db.js  ← mongoose.connect isolated here
*/`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Template engines** like Pug, EJS, or Handlebars let Express render HTML on the server — useful if your app serves web pages, not just a JSON API. Many modern apps skip templates entirely and serve a separate frontend. For database connections, keep **`mongoose.connect`** and your models in their own file (like `startup/db.js`) so tests can easily swap in a different database URI.",
            np: "SSR को लागि टेम्प्लेट; DB जडान अलग फाइलमा।",
            jp: "SSR が要るときテンプレート。DB 接続は別モジュールへ。",
          },
        },
        {
          type: "diagram",
          id: "cache-aside-pattern",
        },
        {
          type: "paragraph",
          text: {
            en: "The cache-aside pattern is about databases, but the same principle applies to how you structure your app: **each module should do one thing**. Routes handle incoming requests, services contain your business logic, and data access files talk to the database. When you refactor your folder structure, the API should behave exactly the same — verify that with your existing tests or Postman.",
            np: "पुनर्संरचना — व्यवहार उही, फाइल मात्र बाँड्नुहोस्।",
            jp: "**リファクタ** — 挙動は変えずフォルダだけ分ける。Postman で確認。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "Why does middleware order matter?", np: "मिडलवेयर क्रम किन?", jp: "ミドルウェアの順番は？" },
      answer: {
        en: "Express runs middleware in the order you register it. Body parsers need to come before any handler that reads `req.body`. Auth middleware must come before the routes it is protecting. Error handlers (the ones with four arguments) must be registered last — after all your routes — so that `next(err)` has somewhere to land.",
        np: "पार्सर अघि, प्रमाणीकरण रूट अघि, त्रुटि अन्तिम।",
        jp: "パーサ → 認証 → ルート → エラーの順。",
      },
    },
  ],
};
