import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_14_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Deploying** means running your API on a remote server (usually a Linux container) managed by a cloud platform. The platform handles HTTPS, process restarts, and scaling. Understanding how code goes from your machine to live users — the git push, CI tests, Docker build, and cloud deployment — helps you debug when something goes wrong.",
      np: "Deploy — अरूको Linux container मा env, HTTPS, managed Mongo सँग।",
      jp: "**デプロイ**は env・HTTPS・マネージド Mongo を揃えて他人の Linux コンテナで動かすこと。",
    },
    {
      en: "Before you push to deploy, test your app locally with `NODE_ENV=production node index.js`. Cloud platforms will restart a crashed process, but they cannot fix a missing environment variable or a wrong `PORT`. Make sure `npm start` runs cleanly before you ship.",
      np: "`NODE_ENV=production` स्थानीयमा test गर्नुहोस् — platform PORT ठीक गर्न सक्दैन।",
      jp: "push 前にローカルで `NODE_ENV=production` でテスト。`PORT` ミスはプラットフォームが直してくれない。",
    },
  ],
  sections: [
    {
      title: {
        en: "Preparing for production",
        np: "उत्पादनको तयारी",
        jp: "本番環境の準備",
      },
      blocks: [
        {
          type: "youtube",
          videoId: "Gjnup-PuquQ",
          title: "Docker in 100 Seconds",
        },
        {
          type: "code",
          title: {
            en: "Production start script, health check, and graceful shutdown",
            np: "Production start, health check, graceful shutdown",
            jp: "本番スクリプト・ヘルスチェック・グレースフルシャットダウン",
          },
          code: `// package.json
{
  "scripts": {
    "start": "node index.js",
    "dev":   "nodemon index.js"
  }
}

// index.js — read PORT from env, never hardcode
const PORT = process.env.PORT ?? 3000;
const app = require('./app');

const server = app.listen(PORT, () => {
  console.log(\`Listening on \${PORT} (NODE_ENV=\${process.env.NODE_ENV})\`);
});

// Health check route (used by load balancer / Cloud Run)
app.get('/healthz', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Graceful shutdown — finish in-flight requests before exiting
process.on('SIGTERM', () => {
  console.log('SIGTERM received — closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => process.exit(0));
  });
});`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Environment variables** — put secrets like `JWT_SECRET`, `MONGODB_URI`, and `PORT` in your platform's dashboard (Heroku Config Vars, Railway Variables, etc.). Locally, use a `.env` file. Never commit that file to git — add it to `.gitignore` from day one.",
              np: "env vars — dashboard मा राख्नुहोस्। `.env` commit नगर्नुहोस्।",
              jp: "**環境変数**はホストのダッシュボードへ。`.env` は必ず `.gitignore` に追加。",
            },
            {
              en: "**dotenv** — calling `require('dotenv').config()` at the top of your `index.js` loads your `.env` file in development. In production, the platform injects the variables directly, so you do not need any extra logic. If the `.env` file is absent, `dotenv` does nothing — so it is safe to call it unconditionally.",
              np: "dotenv — development मा `.env` लोड; production मा platform ले inject गर्छ।",
              jp: "**dotenv** は開発用。本番はプラットフォームが直接 env を注入。ファイルがなければ何もしない。",
            },
            {
              en: "**Remove debug logs** from production — especially anything that might print a secret or user data. Replace ad-hoc `console.log` calls with a structured logger like **`pino`** that outputs JSON. Cloud platforms can ingest JSON logs directly into their log viewer, making it easy to search and filter.",
              np: "production मा secrets को `console.log` हटाउनुहोस् — pino जस्ता logger प्रयोग गर्नुहोस्।",
              jp: "本番では秘密情報の `console.log` を削除。`pino` 等の構造化ロガーを使う。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Deploy pipeline",
        np: "Deploy pipeline",
        jp: "デプロイパイプライン",
      },
      blocks: [
        {
          type: "youtube",
          videoId: "Gjnup-PuquQ",
          title: "GitHub Actions CI/CD for Node.js",
        },
        {
          type: "diagram",
          id: "nodejs-deploy-pipeline",
        },
        {
          type: "paragraph",
          text: {
            en: "A typical deploy pipeline works like this: you **push to git**, which triggers **CI** (like GitHub Actions) to run your tests. If tests pass, CI builds a **Docker image** and pushes it to a registry. The cloud platform then pulls the new image and starts it up — **Cloud Run**, **Railway**, **Fly.io**, and **ECS** all work this way. The platform sends `SIGTERM` to the old container so it can finish in-flight requests before shutting down, then the new container takes over with no downtime.",
            np: "Git push → CI (npm test) → Docker build → registry → cloud deploy। SIGTERM ले rolling deploy।",
            jp: "push → CI (テスト) → Docker ビルド → レジストリ → クラウドデプロイ。SIGTERM でローリング更新。",
          },
        },
        {
          type: "code",
          title: {
            en: "Minimal Dockerfile for a Node.js API",
            np: "Node.js API को Dockerfile",
            jp: "Node.js API の最小 Dockerfile",
          },
          code: `# Build stage — install all deps to compile TypeScript (if used)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # skip if plain JS

# Production image — only runtime deps
FROM node:20-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev   # no devDependencies in image
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/index.js"]

# Usage:
# docker build -t my-api:latest .
# docker run -p 3000:8080 --env-file .env my-api:latest`,
        },
      ],
    },
    {
      title: {
        en: "MongoDB Atlas setup",
        np: "MongoDB Atlas सेटअप",
        jp: "MongoDB Atlas の設定",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Atlas connection string shape",
            np: "Atlas connection string",
            jp: "Atlas 接続文字列の形式",
          },
          code: `# .env (local — gitignored)
MONGODB_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/mydb?retryWrites=true&w=majority

# Node code:
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => { console.error(err); process.exit(1); });

# Atlas security checklist:
# 1. Create a DB user with minimum required permissions (readWrite on your DB only)
# 2. Network Access → add your deployment IP or VPC CIDR (not 0.0.0.0/0 in production)
# 3. Enable "Require TLS" (default on Atlas — always keep it)
# 4. Enable Atlas Auditing and Alerts for failed auth attempts`,
        },
        {
          type: "diagram",
          id: "primary-replica",
        },
        {
          type: "paragraph",
          text: {
            en: "**MongoDB Atlas** sets up a replica set automatically — your data is copied to multiple servers so if one goes down, the others keep serving. The **`w=majority`** write concern in your connection string means a write is only confirmed once the majority of replica set members have it, protecting you from data loss if the primary server crashes right after a write.",
            np: "Atlas — replica set, TLS, backup। `w=majority` ले primary failover मा data loss बाट जोगाउँछ।",
            jp: "**Atlas** はデフォルトでレプリカセットを構成。`w=majority` でプライマリ障害時のデータ損失を防ぐ。",
          },
        },
      ],
    },
    {
      title: {
        en: "What to learn next",
        np: "अर्को के सिक्ने?",
        jp: "次に学ぶこと",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Paths to deepen your Node.js stack",
            np: "Node.js stack गहिरो बनाउन",
            jp: "Node スタックを深める学習パス",
          },
          headers: [
            { en: "Track", np: "track", jp: "トラック" },
            { en: "Why", np: "किन", jp: "理由" },
            { en: "Starting point", np: "सुरुवात", jp: "開始点" },
          ],
          rows: [
            [
              { en: "**TypeScript + Node**", np: "TypeScript", jp: "**TypeScript + Node**" },
              { en: "Catch type errors at compile time; better IDE support; required at most companies", np: "compile-time error detection", jp: "コンパイル時の型チェックで品質向上" },
              { en: "`ts-node`, `@types/node`, `tsconfig.json`", np: "ts-node सुरु", jp: "`ts-node` から始める" },
            ],
            [
              { en: "**GraphQL**", np: "GraphQL", jp: "**GraphQL**" },
              { en: "Clients request exactly what they need — eliminates over/under-fetching REST problems", np: "over/under-fetching रोक्छ", jp: "over/under-fetch を排除" },
              { en: "Apollo Server or Mercurius (Fastify)", np: "Apollo Server", jp: "Apollo Server" },
            ],
            [
              { en: "**Redis caching**", np: "Redis", jp: "**Redis キャッシュ**" },
              { en: "Cache expensive DB queries; dramatically cut p99 latency for hot data", np: "DB query cache — latency कम", jp: "DB クエリをキャッシュして p99 を削減" },
              { en: "`ioredis`, cache-aside pattern", np: "ioredis सुरु", jp: "`ioredis` と cache-aside パターン" },
            ],
            [
              { en: "**BullMQ queues**", np: "BullMQ", jp: "**BullMQ キュー**" },
              { en: "Offload slow jobs (email, PDF, video encoding) to background workers", np: "slow jobs background मा", jp: "重い処理をバックグラウンドワーカーに委譲" },
              { en: "BullMQ + Redis, worker process", np: "BullMQ + Redis", jp: "BullMQ + Redis ワーカー" },
            ],
            [
              { en: "**Microservices**", np: "Microservices", jp: "**マイクロサービス**" },
              { en: "Split monolith into independently deployable services — learn gRPC and message brokers", np: "monolith तोड्नु — gRPC र message broker", jp: "モノリスを分割してgRPCやメッセージブローカーを学ぶ" },
              { en: "Start with gRPC-node or NATS messaging", np: "gRPC-node", jp: "gRPC-node か NATS" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why does the platform inject PORT?",
        np: "Platform PORT किन inject गर्छ?",
        jp: "なぜプラットフォームは PORT を注入するのか？",
      },
      answer: {
        en: "Cloud platforms use a **reverse proxy** that routes incoming HTTPS traffic to your process on a dynamically assigned port. If you hardcode port `3000`, the proxy cannot reach your app. Always read the port from `process.env.PORT` — the `?? 3000` fallback means local development still works without setting the variable.",
        np: "proxy ले PORT assign गर्छ — hardcode गर्दा break हुन्छ। `process.env.PORT ?? 3000` प्रयोग गर्नुहोस्।",
        jp: "**リバースプロキシ**が PORT を割り当てる。ハードコードすると壊れる。`process.env.PORT ?? 3000` を使う。",
      },
    },
  ],
};
