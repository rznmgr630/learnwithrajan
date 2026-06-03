import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_5_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Express** is a lightweight framework built on top of Node's built-in `http` module. It handles the repetitive parts — matching URLs to functions, running shared logic in order, and parsing JSON — so you can focus on writing your app's actual logic.",
      np: "Express ले HTTP र रूट सजिलो बनाउँछ — मिडलवेयर चेन।",
      jp: "Express は **`http` の上にルーティングとミドルウェア** を載せる薄いフレームワーク。",
    },
    {
      en: "Use **Postman** (or a similar tool) to test your API while you build it. You can save and replay requests — GET, POST, PUT, DELETE — against your local server without needing a frontend at all.",
      np: "Postman ले अनुरोध दोहोर्याउन मिल्छ — फ्रन्ट बिना परीक्षण।",
      jp: "**Postman** でローカル API をフロント無しで検証できる。",
    },
  ],
  sections: [
    {
      title: { en: "RESTful services & introducing Express", np: "REST र Express", jp: "REST と Express" },
      blocks: [
        {
          type: "youtube",
          videoId: "L72fhGm1tfE",
          title: "Express JS Crash Course",
        },
        {
          type: "code",
          title: { en: "REST-shaped routes on one app", np: "REST रूट", jp: "REST 風ルート" },
          code: `const express = require('express');
const app = express();

app.get('/api/genres', (req, res) => res.json([]));
app.post('/api/genres', (req, res) => res.status(201).json({ id: 'new' }));
// PUT/PATCH/DELETE on /api/genres/:id — choose verbs + status codes deliberately.`,
        },
        {
          type: "paragraph",
          text: {
            en: "**REST** is a set of conventions, not a strict standard. You name your URLs after the things in your app (`/api/genres`, `/api/movies`) and use HTTP methods to say what you want to do — **GET** to read, **POST** to create, **PUT/PATCH** to update, **DELETE** to remove. Return clear status codes (`200`, `201`, `400`, `404`) so anyone reading your logs or using your API knows exactly what happened.",
            np: "संसाधन URL र HTTP verb — स्थिति कोड स्पष्ट राख्नुहोस्।",
            jp: "**REST** — リソースとメソッドとステータスコードを揃えるスタイル。",
          },
        },
        {
          type: "diagram",
          id: "rest-graphql-grpc",
        },
        {
          type: "paragraph",
          text: {
            en: "The diagram shows different API styles — for this course, we focus on REST: separate endpoints, JSON bodies, and GET requests that browsers can cache. **`const app = express()`** creates your app, and **`app.listen(port)`** starts it. Everything you add between those two lines is your middleware and routes.",
            np: "यहाँ REST धेरै एन्डपोइन्ट र JSON — `express()` र `listen`।",
            jp: "このコースでは REST 列が中心。`express()` と `listen` でサーバが待つ。",
          },
        },
      ],
    },
    {
      title: {
        en: "First server, nodemon & environment variables",
        np: "पहिलो सर्भर, nodemon र env",
        jp: "最初のサーバ・nodemon・環境変数",
      },
      blocks: [
        {
          type: "code",
          title: { en: "Tiny Express server", np: "सानो सर्भर", jp: "小さなサーバ" },
          code: `const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(\`Listening on \${port}\`));`,
        },
        {
          type: "paragraph",
          text: {
            en: "Start with something simple — `app.get('/', (req, res) => res.send('ok'))` just to confirm everything is wired up. Add **`express.json()`** before any route that reads a request body, otherwise `req.body` will be undefined. Use **nodemon** while developing so your server restarts automatically on file changes — but use a proper process manager like systemd or Docker in production.",
            np: "विकासमा nodemon; उत्पादनमा प्रक्रिया प्रबन्धक।",
            jp: "開発は **nodemon**。本番はプロセスマネージャと別。**JSON は `express.json()` の後**。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "**Environment variables** are the right place to store secrets and config like port numbers. Cloud platforms inject `PORT` automatically, and locally you can use **`dotenv`** to load a `.env` file. Just make sure that file is in your `.gitignore` — never commit real secrets to version control.",
            np: "`process.env` र `.env` — गोप्य Git मा नहाल्नु।",
            jp: "**環境変数** — `dotenv` はローカル用。本番はプラットフォームの注入。",
          },
        },
      ],
    },
    {
      title: {
        en: "Routes, verbs, Postman, validation & CRUD projects",
        np: "रूट, क्रिया, Postman",
        jp: "ルート・メソッド・Postman",
      },
      blocks: [
        {
          type: "youtube",
          videoId: "fBNz5xF-Kx4",
          title: "REST API with Node.js & Express",
        },
        {
          type: "code",
          title: { en: "params, query, body", np: "params, query, body", jp: "params・query・body" },
          code: `app.get('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const page = Number(req.query.page ?? 1);
  res.json({ id, page });
});

app.post('/api/items', (req, res) => {
  // Needs express.json() above — validate req.body before DB
  res.status(201).json(req.body);
});`,
        },
        {
          type: "diagram",
          id: "request-response",
        },
        {
          type: "paragraph",
          text: {
            en: "Parts of the URL like `/api/items/:id` show up in **`req.params`**. Query strings like `?page=2` show up in **`req.query`** — but everything there is a string, so convert types before using them. POST body data comes from **`req.body`** and needs `express.json()` to work. Always validate the body with a schema library like **Joi** or **Zod** before passing anything to your database.",
            np: "`params`, `query`, `body` — डेटाबेस अघि प्रमाणीकरण।",
            jp: "**ルート** — `params` / `query` / `body`。DB の前に検証。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Postman** — organize your requests in a collection so teammates can reuse them. Always set `Content-Type: application/json` on requests with a body, and save example responses so others know what to expect.",
              np: "Postman संग्रह र हेडर उही राख्नुहोस्।",
              jp: "**Postman** — コレクションで再現性を保つ。",
            },
            {
              en: "**PUT vs PATCH** — PUT typically replaces the whole resource with what you send. PATCH updates only the fields you include. Pick one approach and stick to it across your API so it stays consistent.",
              np: "PUT/PATCH सम्झौता टोलीले लेख्नुहोस्।",
              jp: "**PUT/PATCH** — チームで意味を決めドキュメント化。",
            },
            {
              en: "**Genres API project** — use plural route names, share your validation logic across routes, and write tests for both the happy path and the cases where validation should fail.",
              np: "Genres परियोजना — खुसी र त्रुटि दुवै परीक्षण।",
              jp: "**Genres API** — 成功と 400 を両方テスト。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "Where should validation live?", np: "प्रमाणीकरण कहाँ?", jp: "検証はどこで？" },
      answer: {
        en: "Validation should happen as close to the incoming request as possible — in middleware or at the top of your controller — so bad data never reaches your database. Mongoose validations are a useful backup, but they should not be your only line of defense.",
        np: "HTTP नजिक पहिलो रेखा — DB अघि रोक्नुहोस्।",
        jp: "HTTP の境界で止める。DB は第二の防壁。",
      },
    },
  ],
};
