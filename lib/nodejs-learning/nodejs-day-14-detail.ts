import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_14_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Deploying** means your API runs on someone else's Linux container with **environment variables**, **HTTPS termination**, and **managed MongoDB**. Understanding the pipeline from `git push` to live traffic helps you debug failed deploys and reason about cold-start latency.",
      np: "Deploy — अरूको Linux container मा env, HTTPS, managed Mongo सँग।",
      jp: "**デプロイ**は env・HTTPS・マネージド Mongo を揃えて他人の Linux コンテナで動かすこと。",
    },
    {
      en: "Before any push, run `NODE_ENV=production node index.js` locally — platforms restart crashed processes, but they cannot fix a misconfigured `PORT` or a missing environment variable. Ship only after `npm start` boots without errors.",
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
              en: "**Environment variables** — store `JWT_SECRET`, `MONGODB_URI`, `PORT` in the host dashboard (Heroku Config Vars, Railway Variables, `.env` locally). **Never commit `.env`** — add it to `.gitignore` immediately.",
              np: "env vars — dashboard मा राख्नुहोस्। `.env` commit नगर्नुहोस्।",
              jp: "**環境変数**はホストのダッシュボードへ。`.env` は必ず `.gitignore` に追加。",
            },
            {
              en: "**Dotenv locally** — `require('dotenv').config()` at the top of `index.js` loads `.env` in development. In production the platform injects env vars directly — do not call `dotenv.config()` based on `NODE_ENV`; it simply does nothing if the file is absent.",
              np: "dotenv — development मा `.env` लोड; production मा platform ले inject गर्छ।",
              jp: "**dotenv** は開発用。本番はプラットフォームが直接 env を注入。ファイルがなければ何もしない。",
            },
            {
              en: "**Debug output off** — in production, remove `console.log` of secrets, keep structured error logs. Use a logger like `pino` that writes JSON — pipe to your cloud log viewer.",
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
          type: "diagram",
          id: "nodejs-deploy-pipeline",
        },
        {
          type: "paragraph",
          text: {
            en: "A typical pipeline: **Git push** triggers **CI** (GitHub Actions) which runs `npm test` and `npm run build`. Only if all tests pass does CI build a **Docker image** (`FROM node:20-alpine`, `COPY`, `npm ci --production`) and push it to a **container registry** (e.g. `ghcr.io/your-app:sha`). The deploy step tells your cloud platform to pull and run the new image — **Cloud Run**, **ECS**, **Railway**, or **Fly.io** all follow this pattern. The platform sends a `SIGTERM` to the old container and starts the new one, doing a rolling deploy with zero downtime.",
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
            en: "**Atlas** provisions a replica set by default — your data is automatically replicated to secondary members. The **`w=majority`** write concern in the connection string ensures a write is acknowledged only after it reaches a majority of replica set members, protecting against data loss on primary failover.",
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
        en: "Shared platforms route external HTTPS traffic through a **reverse proxy** to your process's assigned port. Hardcoding `3000` breaks because only their internal routing table knows the mapping. Always read from `process.env.PORT ?? 3000` — the fallback keeps local dev working without setting the variable.",
        np: "proxy ले PORT assign गर्छ — hardcode गर्दा break हुन्छ। `process.env.PORT ?? 3000` प्रयोग गर्नुहोस्।",
        jp: "**リバースプロキシ**が PORT を割り当てる。ハードコードすると壊れる。`process.env.PORT ?? 3000` を使う。",
      },
    },
  ],
};
