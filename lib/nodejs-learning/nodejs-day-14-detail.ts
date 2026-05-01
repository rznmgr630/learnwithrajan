import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_14_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Deploying** means your API runs on someone else’s Linux container or VM with **environment variables**, **HTTPS termination**, and **managed MongoDB**—Heroku-style platforms hide ops early; later you may graduate to Docker + Kubernetes or serverless.",
      np: "डिप्लोइ — env, HTTPS, बादल Mongo।",
      jp: "**デプロイ**で env・HTTPS・マネージド Mongo を揃える。",
    },
    {
      en: "Before **`git push heroku main`**, turn off debug printers, respect **`NODE_ENV=production`**, and verify **`npm start`** boots non-interactively—platforms restart crashed processes; they cannot fix misconfigured ports.",
      np: "`NODE_ENV` र `PORT` — व्यावहारिक सुरुवात आदेश।",
      jp: "**本番**ではデバッグ出力を抑え、`PORT` を環境から読む。",
    },
  ],
  sections: [
    {
      title: {
        en: "Production checklist & platform basics",
        np: "उत्पादन चेकलिस्ट",
        jp: "本番チェックリスト",
      },
      blocks: [
        {
          type: "code",
          title: { en: "Typical production env (never commit real values)", np: "env उदाहरण", jp: "本番 env の例" },
          code: `# Heroku / Railway / Render dashboards → Config Vars
NODE_ENV=production
PORT=8080
JWT_SECRET=<long-random-string>
MONGODB_URI=<atlas-srv-connection-string>

# package.json
# "scripts": { "start": "node index.js" }`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Secrets** — configure **`JWT_SECRET`**, **`MONGODB_URI`**, API keys in the host dashboard—never bake into images publicly.",
              np: "गोप्य ड्यासबोर्डमा — छविमा नभित्र्याउनु।",
              jp: "**秘密**はホストの環境変数へ。イメージに焼かない。",
            },
            {
              en: "**Logs** — stdout/stderr stream to the platform log viewer—learn **`heroku logs --tail`** or your cloud equivalent.",
              np: "लग हेर्न आदेश सिक्नुहोस्।",
              jp: "**ログ**はプラットフォームのビューアで追う。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "MongoDB in the cloud & what to learn next",
        np: "बादल Mongo र अर्को सिकाइ",
        jp: "クラウド Mongo と次の学び",
      },
      blocks: [
        {
          type: "code",
          title: { en: "Atlas URI shape (replace user/password/cluster)", np: "Atlas URI", jp: "Atlas の URI 形" },
          code: `# .env (local — gitignored)
MONGODB_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/mydb?retryWrites=true&w=majority

# Node reads:
mongoose.connect(process.env.MONGODB_URI);`,
        },
        {
          type: "diagram",
          id: "primary-replica",
        },
        {
          type: "paragraph",
          text: {
            en: "**Atlas** (or similar) hosts replica sets with backups and TLS—point **`MONGODB_URI`** to the SRV connection string and whitelist only deployment IPs/VPNs. After deployment, deepen **TypeScript**, **GraphQL**, **observability** (OpenTelemetry), or **microservices** patterns—this Node foundation plugs into all of them.",
            np: "Atlas ले TLS र ब्याकअप — URI श्वेतसूची IP।",
            jp: "**Atlas** は TLS とバックアップが楽。**TypeScript** や可観測性へ進める。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why does the platform inject PORT?",
        np: "प्लेटफर्मले PORT किन दिन्छ?",
        jp: "PORT を注入される理由？",
      },
      answer: {
        en: "Shared hosts route external traffic through a reverse proxy to **your process’s assigned port**—hardcoding **3000** breaks because only their routing table knows the mapping. Always **`process.env.PORT ?? 3000`** for local fallback.",
        np: `हार्डकोड नगर्नु — \`process.env.PORT\` प्रयोग गर्नुहोस्।`,
        jp: "**プロキシが割り当てたポート**にバインドする必要がある。`process.env.PORT` を使う。",
      },
    },
  ],
};
