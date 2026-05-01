import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_5_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Express** is a small framework on top of Node’s **`http`** module: it matches URLs and HTTP verbs to handler functions, runs **middleware** in order, and parses JSON bodies—so you spend time on **business rules** instead of boilerplate.",
      np: "Express ले HTTP र रूट सजिलो बनाउँछ — मिडलवेयर चेन।",
      jp: "Express は **`http` の上にルーティングとミドルウェア** を載せる薄いフレームワーク。",
    },
    {
      en: "Pair code with **Postman** (or similar): saving requests lets you replay **GET/POST/PUT/DELETE** against localhost exactly like a mobile app or SPA would—without building a frontend yet.",
      np: "Postman ले अनुरोध दोहोर्याउन मिल्छ — फ्रन्ट बिना परीक्षण।",
      jp: "**Postman** でローカル API をフロント無しで検証できる。",
    },
  ],
  sections: [
    {
      title: { en: "RESTful services & introducing Express", np: "REST र Express", jp: "REST と Express" },
      blocks: [
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
            en: "**REST** is a style, not a single standard: you model **resources** (`/api/genres`, `/api/movies`) and use HTTP methods for intent—**GET** read, **POST** create, **PUT/PATCH** replace/update, **DELETE** remove. Respond with **meaningful status codes** (`200`, `201`, `400`, `404`, `422`) so clients and logs stay understandable.",
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
            en: "The diagram compares interaction styles—your APIs here focus on the **REST** column: many endpoints, JSON bodies, cache-friendly **GET** when responses are public. **`const app = express()`** creates the app; **`app.listen(port)`** binds to a TCP port; everything between is middleware and routes.",
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
            en: "Start minimal: **`app.get('/', (req, res) => res.send('ok'))`** proves wiring works. Add **`express.json()`** before routes that read **`req.body`**. Use **`nodemon`** in development so saves restart the server—**never** rely on file watchers in production (use **systemd**, **Docker**, or your host’s process manager).",
            np: "विकासमा nodemon; उत्पादनमा प्रक्रिया प्रबन्धक।",
            jp: "開発は **nodemon**。本番はプロセスマネージャと別。**JSON は `express.json()` の後**。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "**Environment variables** carry secrets and port numbers—**`process.env.PORT`** is how cloud hosts inject ports. Locally, **`dotenv`** loads a **`.env`** file (gitignored). Production should inject vars via the platform, not committed files.",
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
            en: "**Route parameters** (`/api/items/:id`) land in **`req.params`**. **Query strings** (`?page=2`) appear in **`req.query`**—always validate and coerce types (strings arrive as strings). **POST** bodies need **`express.json()`** and **schema validation** (`Joi`, **`zod`**, etc.) **before** touching the database—never trust raw JSON.",
            np: "`params`, `query`, `body` — डेटाबेस अघि प्रमाणीकरण।",
            jp: "**ルート** — `params` / `query` / `body`。DB の前に検証。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Postman** — group requests in collections; mirror **`Content-Type: application/json`**; save successful responses as examples for teammates.",
              np: "Postman संग्रह र हेडर उही राख्नुहोस्।",
              jp: "**Postman** — コレクションで再現性を保つ。",
            },
            {
              en: "**PUT vs PATCH** — PUT often replaces a whole resource; PATCH applies partial updates—pick one convention for your API and document it.",
              np: "PUT/PATCH सम्झौता टोलीले लेख्नुहोस्।",
              jp: "**PUT/PATCH** — チームで意味を決めドキュメント化。",
            },
            {
              en: "**Genres API project** — plural routes, shared validation helper, tests for **both** happy paths and validation failures.",
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
        en: "Close to HTTP boundaries—middleware or small controller functions—so bad input never reaches persistence. Database validators (later with Mongoose) are a **second** line of defense, not the only one.",
        np: "HTTP नजिक पहिलो रेखा — DB अघि रोक्नुहोस्।",
        jp: "HTTP の境界で止める。DB は第二の防壁。",
      },
    },
  ],
};
