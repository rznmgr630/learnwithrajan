import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_6_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Once routes exist, **middleware** is how Express stays organized: shared logic (parsing, auth, logging) runs **once** in order for every request—or skips to **`next(err)`** when something fails. Configuration and folder structure keep that logic **testable** as the app grows.",
      np: "मिडलवेयरले साझा लजिक क्रममा चलाउँछ — परीक्षण योग्य संरचना।",
      jp: "**ミドルウェア** で共通処理を順に適用。構成でテストしやすくする。",
    },
    {
      en: "**Debugging** with **`node --inspect`** plus Chrome DevTools beats endless **`console.log`** for stepping through async code—you see the real call stack when promises pause.",
      np: "`--inspect` ले async डिबग सजिलो बनाउँछ।",
      jp: "**`--inspect`** で非同期もブレークポイントを張れる。",
    },
  ],
  sections: [
    {
      title: { en: "Middleware — the heart of Express", np: "मिडलवेयर", jp: "ミドルウェア" },
      blocks: [
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
            en: "A middleware function receives **`(req, res, next)`**. Call **`next()`** to pass control forward; call **`next(err)`** to jump to Express **error-handling middleware** (signature **`(err, req, res, next)`**). If you **`res.send`** or **`res.json`**, the chain stops—later middleware does not run unless you forgot something.",
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
              en: "**Built-ins** — **`express.json()`** parses JSON bodies; **`express.urlencoded`** handles HTML forms; **`express.static`** serves files—mount **`static`** before expensive routes so favicons do not hit auth.",
              np: "`express.json` अघि रूट — बडी पहिले पार्स।",
              jp: "**組み込み** — JSON・フォーム・静的ファイル。順序が重要。",
            },
            {
              en: "**Third-party** — **`cors`** configures cross-origin rules; **`helmet`** sets safer HTTP headers; **`morgan`** logs requests—add only what you need and order security-related middleware **early**.",
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
            en: "**`NODE_ENV`** is a convention: **`production`** enables optimizations and hides verbose errors in some libraries; **`test`** switches databases or mocks. Centralize config—read **`process.env`** once through a **`config.js`** or validated schema—so typos surface at startup, not mid-request.",
            np: "`NODE_ENV` र एक पटक विन्यास जाँच।",
            jp: "**NODE_ENV** — 起動時に設定を一箇所で検証。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Debugging** — run **`node --inspect server.js`**, open **chrome://inspect**, set breakpoints, inspect **`req`** objects. Pair with structured logs (JSON lines) instead of string clutter.",
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
            en: "**Template engines** (Pug, EJS, Handlebars) render HTML when you need **server-side pages** alongside JSON APIs—many SPAs skip them and serve static assets separately. **Database integration** preview: keep **`mongoose.connect`** and models out of **`index.js`**—use **`startup/`** or **`db.js`** so tests can swap URIs.",
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
            en: "The cache-aside pattern is database-centric, but the **same idea** applies to structuring apps: **one responsibility per module**—routes orchestrate, services encapsulate domain rules, data access stays thin. Your **restructure project** should move files **without changing HTTP behavior**—prove equivalence with tests or manual Postman runs.",
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
        en: "Express walks middleware **sequentially**. Body parsers must run **before** handlers that read **`req.body`**. Auth must run **before** protected routes. Error handlers with four arguments must be registered **after** routes so `next(err)` reaches them.",
        np: "पार्सर अघि, प्रमाणीकरण रूट अघि, त्रुटि अन्तिम।",
        jp: "パーサ → 認証 → ルート → エラーの順。",
      },
    },
  ],
};
