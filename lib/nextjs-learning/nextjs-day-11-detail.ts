import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_11_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Deploying a Next.js app means more than pushing code — it requires a **production build**, a clean environment variable audit, a database that survives serverless cold starts, and a reliable pipeline so every `git push` to `main` goes live automatically. Vercel is the zero-config option; self-hosting on Docker or a VPS is also fully supported.",
      np: "Next.js deploy गर्नु भनेको code push मात्र होइन — **production build**, environment variable audit, serverless-compatible database, र automatic pipeline चाहिन्छ।",
      jp: "Next.js のデプロイはコードをプッシュするだけではありません。**プロダクションビルド**、環境変数の監査、サーバーレス向けデータベース、`git push` で自動公開されるパイプラインが必要です。Vercel はゼロ設定の選択肢で、Docker や VPS でのセルフホストも完全にサポートされています。",
    },
  ],
  sections: [
    {
      title: {
        en: "Production checklist",
        np: "Production checklist",
        jp: "本番環境チェックリスト",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Run `npm run build` locally before deploying. Next.js prints a build summary that shows each route's rendering strategy (○ static, λ server-side, ◐ ISR) and flags TypeScript and ESLint errors. Fixing these locally is faster than debugging failed CI runs.",
            np: "Deploy गर्नुअघि `npm run build` locally run गर्नुहोस्। Next.js ले route rendering strategy र TypeScript/ESLint error देखाउँछ।",
            jp: "デプロイ前にローカルで `npm run build` を実行します。Next.js はルートのレンダリング戦略（○ 静的、λ サーバーサイド、◐ ISR）を表示し、TypeScript・ESLint エラーを報告します。CI の失敗を修正するよりローカルで直す方が速いです。",
          },
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Run `npm run build` — fix all TypeScript and ESLint errors.",
              np: "`npm run build` — TypeScript र ESLint error ठीक गर्नुहोस्।",
              jp: "`npm run build` を実行し、TypeScript・ESLint エラーをすべて修正する。",
            },
            {
              en: "Audit all `process.env.*` references — every variable needed in production must be set in the Vercel dashboard (or your server's environment).",
              np: "`process.env.*` सबै audit गर्नुहोस् — production मा चाहिने variable Vercel dashboard मा set गर्नुहोस्।",
              jp: "すべての `process.env.*` 参照を確認し、本番で必要な変数を Vercel ダッシュボードに設定する。",
            },
            {
              en: "Run `npx prisma generate` — the generated Prisma client must match your schema; CI environments start from scratch.",
              np: "`npx prisma generate` run गर्नुहोस् — CI environment मा client regenerate हुनु पर्छ।",
              jp: "`npx prisma generate` を実行する。CI 環境はゼロから始まるため、生成クライアントがスキーマと一致している必要がある。",
            },
            {
              en: "Check `.gitignore` — `.env*`, `node_modules/`, and `.next/` must be excluded. Never commit secrets.",
              np: "`.gitignore` check गर्नुहोस् — `.env*`, `node_modules/`, `.next/` exclude गर्नुहोस्।",
              jp: "`.gitignore` を確認する。`.env*`・`node_modules/`・`.next/` を除外すること。シークレットは絶対コミットしない。",
            },
            {
              en: "Verify `NEXTAUTH_URL` is set to your production domain (not `localhost`) and `NEXTAUTH_SECRET` is a strong random value.",
              np: "`NEXTAUTH_URL` production domain मा set गर्नुहोस् र `NEXTAUTH_SECRET` strong random value राख्नुहोस्।",
              jp: "`NEXTAUTH_URL` を本番ドメインに設定し、`NEXTAUTH_SECRET` を強力なランダム値にする。",
            },
            {
              en: "Test the production build locally with `npm run start` (after `npm run build`) to catch runtime issues before deploying.",
              np: "`npm run build` पछि `npm run start` ले local मा production test गर्नुहोस्।",
              jp: "`npm run build` 後に `npm run start` でローカルの本番ビルドをテストし、デプロイ前にランタイムエラーを見つける。",
            },
            {
              en: "If deploying to Docker, set `output: 'standalone'` in `next.config.ts` to produce a minimal Node.js bundle.",
              np: "Docker deploy को लागि `next.config.ts` मा `output: 'standalone'` set गर्नुहोस्।",
              jp: "Docker にデプロイする場合は `next.config.ts` に `output: 'standalone'` を設定して最小限の Node.js バンドルを生成する。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "GitHub & Vercel setup",
        np: "GitHub र Vercel setup",
        jp: "GitHub と Vercel のセットアップ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Push your project to GitHub, then connect the repository to Vercel. Vercel detects Next.js automatically, builds on every push, and publishes `main` as the production deployment. Every other branch gets a unique preview URL.",
            np: "Project GitHub push गर्नुहोस्, त्यसपछि Vercel मा connect गर्नुहोस्। Vercel ले Next.js auto-detect गर्छ र `main` branch लाई production मा deploy गर्छ।",
            jp: "プロジェクトを GitHub にプッシュして Vercel に接続します。Vercel は Next.js を自動検出し、プッシュのたびにビルドして `main` を本番デプロイとして公開します。",
          },
        },
        {
          type: "code",
          title: {
            en: "First push to GitHub",
            np: "GitHub मा पहिलो push",
            jp: "GitHub への最初のプッシュ",
          },
          code: `# Initialise a new repository (skip if already a git repo)
git init
git add .
git commit -m "feat: initial Next.js app"

# Create the GitHub repo and push
gh repo create my-nextjs-app --public --source=. --remote=origin --push

# Or if you created the repo on github.com manually:
git remote add origin https://github.com/YOUR_USER/my-nextjs-app.git
git branch -M main
git push -u origin main`,
        },
        {
          type: "code",
          title: {
            en: "Vercel CLI deployment (alternative to UI)",
            np: "Vercel CLI deploy",
            jp: "Vercel CLI でのデプロイ（UI の代替）",
          },
          code: `# Install Vercel CLI globally
npm install -g vercel

# Login and link the project
vercel login
vercel link          # Associate local dir with a Vercel project

# Deploy a preview build
vercel

# Deploy to production
vercel --prod`,
        },
        {
          type: "paragraph",
          text: {
            en: "Set environment variables in the **Vercel dashboard** under Project → Settings → Environment Variables. Vercel distinguishes three environments: **Production** (`main`), **Preview** (other branches), and **Development** (local `vercel dev`). A variable added only to Production will not be present in Preview builds — configure each environment intentionally.",
            np: "**Vercel dashboard** मा Project → Settings → Environment Variables मा env vars set गर्नुहोस्। Production, Preview, Development तीनवटा environment छन् — intentionally configure गर्नुहोस्।",
            jp: "**Vercel ダッシュボード**の Project → Settings → Environment Variables で環境変数を設定します。Vercel は **Production**（`main`）・**Preview**（他ブランチ）・**Development**（ローカル `vercel dev`）の3環境を区別します。意図的に各環境を設定してください。",
          },
        },
        {
          type: "diagram",
          id: "nextjs-vercel-deploy",
        },
      ],
    },
    {
      title: {
        en: "Database in production",
        np: "Production मा database",
        jp: "本番環境のデータベース",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Serverless functions spin up and down constantly — each invocation may open a new database connection. Without **connection pooling**, you will quickly exhaust the database's connection limit under real traffic. Use a pooler (PgBouncer, Prisma Accelerate, or a managed pool from your DB provider) between your app and the database.",
            np: "Serverless function हरेक invocation मा नयाँ DB connection खोल्न सक्छ। **Connection pooling** बिना connection limit exhaust हुन्छ। Prisma Accelerate वा PgBouncer जस्तो pooler प्रयोग गर्नुहोस्।",
            jp: "サーバーレス関数は常にスピンアップ・ダウンし、各呼び出しで新しい DB 接続が開かれる可能性があります。**コネクションプーリング**なしでは、実トラフィック下でデータベースの接続数制限にすぐ達します。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Common database options for Next.js on Vercel (comparison)",
            np: "Vercel मा Next.js को लागि database विकल्प",
            jp: "Vercel 上の Next.js でよく使われるデータベースの比較",
          },
          headers: [
            { en: "Provider", np: "Provider", jp: "プロバイダー" },
            { en: "Type", np: "प्रकार", jp: "種類" },
            { en: "Built-in pooling", np: "Built-in pooling", jp: "組み込みプーリング" },
            { en: "Notes", np: "नोट", jp: "備考" },
          ],
          rows: [
            [
              { en: "Vercel Postgres (Neon)", np: "Vercel Postgres", jp: "Vercel Postgres（Neon）" },
              { en: "Managed Postgres", np: "Managed Postgres", jp: "マネージド Postgres" },
              { en: "Yes (HTTP driver)", np: "हो (HTTP driver)", jp: "あり（HTTP ドライバー）" },
              {
                en: "Tight Vercel integration; free tier available",
                np: "Vercel integration; free tier",
                jp: "Vercel との統合が緊密。無料枠あり",
              },
            ],
            [
              { en: "PlanetScale", np: "PlanetScale", jp: "PlanetScale" },
              { en: "Serverless MySQL", np: "Serverless MySQL", jp: "サーバーレス MySQL" },
              { en: "Yes (HTTP)", np: "हो (HTTP)", jp: "あり（HTTP）" },
              {
                en: "Branching like git; Vitess under the hood",
                np: "git जस्तो branching; Vitess backend",
                jp: "Git ライクなブランチ機能。Vitess ベース",
              },
            ],
            [
              { en: "Supabase", np: "Supabase", jp: "Supabase" },
              { en: "Managed Postgres + realtime", np: "Managed Postgres + realtime", jp: "マネージド Postgres + リアルタイム" },
              {
                en: "PgBouncer included (Transaction mode)",
                np: "PgBouncer included",
                jp: "PgBouncer 内蔵（トランザクションモード）",
              },
              {
                en: "Auth, Storage, Edge Functions bundled",
                np: "Auth, Storage, Edge Functions सहित",
                jp: "Auth・Storage・Edge Functions が同梱",
              },
            ],
            [
              { en: "Railway", np: "Railway", jp: "Railway" },
              { en: "Managed Postgres / MySQL / Redis", np: "Managed Postgres/MySQL/Redis", jp: "マネージド Postgres/MySQL/Redis" },
              { en: "No (add Prisma Accelerate)", np: "छैन (Prisma Accelerate थप्नुहोस्)", jp: "なし（Prisma Accelerate を追加）" },
              {
                en: "Simple UI; good free hobby tier",
                np: "Simple UI; free tier राम्रो",
                jp: "シンプルな UI。無料ホビー枠あり",
              },
            ],
            [
              { en: "Prisma Accelerate", np: "Prisma Accelerate", jp: "Prisma Accelerate" },
              { en: "Connection proxy + caching layer", np: "Connection proxy + caching", jp: "接続プロキシ＋キャッシュ層" },
              { en: "Yes (pooling + edge cache)", np: "हो (pooling + edge cache)", jp: "あり（プーリング＋エッジキャッシュ）" },
              {
                en: "Works with any Postgres/MySQL; replaces DATABASE_URL",
                np: "कुनै पनि Postgres/MySQL सँग काम गर्छ",
                jp: "任意の Postgres/MySQL と連携。DATABASE_URL を置き換える",
              },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Running prisma migrate deploy in CI / build step",
            np: "CI मा prisma migrate deploy",
            jp: "CI / ビルドステップで prisma migrate deploy を実行",
          },
          code: `# In package.json — run migrations before the Next.js build
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}

# On Vercel you can also set this as the Build Command override:
# prisma generate && prisma migrate deploy && next build`,
        },
      ],
    },
    {
      title: {
        en: "Troubleshooting common issues",
        np: "सामान्य समस्या troubleshoot गर्ने",
        jp: "よくある問題のトラブルシューティング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Most deployment failures fall into a handful of categories. Check the **Vercel build logs** (Build & Deployment tab) and **Function logs** (Runtime Logs tab) before assuming the problem is in your application code.",
            np: "अधिकांश deployment failure कुछ categories मा पर्छन्। **Vercel build logs** र **Function logs** check गर्नुहोस्।",
            jp: "デプロイの失敗のほとんどはいくつかのカテゴリに収まります。アプリケーションコードの問題と決めつける前に **Vercel ビルドログ**（Build & Deployment タブ）と **Function ログ**（Runtime Logs タブ）を確認してください。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`Module not found: Can't resolve '...'`** — A package is missing from `dependencies` (not just `devDependencies`). Move it to `dependencies` or add `npm install <pkg>` to the build command.",
              np: "**Module not found** — package `dependencies` मा छैन। `dependencies` मा सार्नुहोस्।",
              jp: "**`Module not found`** — パッケージが `dependencies`（`devDependencies` ではなく）にありません。`dependencies` へ移すかビルドコマンドに `npm install <pkg>` を追加してください。",
            },
            {
              en: "**Missing environment variable at runtime** — `undefined` errors that only appear in production. Double-check the Vercel dashboard and remember that client-side env vars must be prefixed with `NEXT_PUBLIC_`.",
              np: "**Missing env var** — production मा `undefined` error। `NEXT_PUBLIC_` prefix client-side var मा चाहिन्छ।",
              jp: "**実行時の環境変数の欠落** — 本番でのみ現れる `undefined` エラー。Vercel ダッシュボードを再確認し、クライアント側の変数には `NEXT_PUBLIC_` プレフィックスが必要なことを覚えておいてください。",
            },
            {
              en: "**`PrismaClientInitializationError` / `ECONNREFUSED`** — Prisma client was not generated, the `DATABASE_URL` is wrong, or the database is not reachable from Vercel's region. Add `prisma generate` to the build command and verify the connection string.",
              np: "**Prisma initialization error** — `prisma generate` build command मा छैन वा `DATABASE_URL` गलत छ।",
              jp: "**`PrismaClientInitializationError`** — Prisma クライアントが生成されていないか、`DATABASE_URL` が誤っているか、データベースが Vercel のリージョンから到達できない状態です。",
            },
            {
              en: "**Function size exceeded (>250 MB)** — a heavy dependency (e.g., Puppeteer, `sharp` bundled incorrectly) is included in the serverless bundle. Use `serverExternalPackages` in `next.config.ts` to exclude large native modules.",
              np: "**Function size exceeded** — heavy dependency serverless bundle मा परेको छ। `serverExternalPackages` मा exclude गर्नुहोस्।",
              jp: "**関数サイズ超過（>250 MB）** — 重い依存関係がサーバーレスバンドルに含まれています。`next.config.ts` の `serverExternalPackages` で大きなネイティブモジュールを除外してください。",
            },
            {
              en: "**`TypeError: Cannot read properties of undefined (reading 'headers')`** — usually caused by calling `headers()` or `cookies()` from `next/headers` without `await` in Next.js 15. These APIs are async in Next 15; always `await` them.",
              np: "**async headers/cookies await छैन** — Next.js 15 मा `headers()` र `cookies()` async छन्; `await` गर्नुहोस्।",
              jp: "**`TypeError: Cannot read properties of undefined`** — Next.js 15 では `next/headers` の `headers()` や `cookies()` が非同期です。常に `await` してください。",
            },
            {
              en: "**How to rollback**: go to Vercel dashboard → Deployments tab → find the last good deployment → click the `...` menu → **Promote to Production**. Vercel keeps all previous deployments permanently.",
              np: "**Rollback**: Vercel dashboard → Deployments → अघिल्लो राम्रो deployment → `...` → **Promote to Production**।",
              jp: "**ロールバック方法**: Vercel ダッシュボード → Deployments タブ → 最後の正常なデプロイを探す → `...` メニュー → **Promote to Production**。Vercel はすべての過去デプロイを永続保存します。",
            },
            {
              en: "**Custom domain**: add a CNAME record pointing to `cname.vercel-dns.com` (for subdomains) or two A records pointing to Vercel's IPs (for apex domains). SSL is provisioned automatically via Let's Encrypt.",
              np: "**Custom domain**: subdomain को लागि CNAME `cname.vercel-dns.com` वा apex domain को लागि A record। SSL auto।",
              jp: "**カスタムドメイン**: サブドメインには `cname.vercel-dns.com` を指す CNAME、apex ドメインには Vercel の IP を指す A レコードを追加します。SSL は Let's Encrypt で自動プロビジョニングされます。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Can I self-host Next.js without Vercel?",
        np: "Vercel बिना Next.js self-host गर्न सकिन्छ?",
        jp: "Vercel なしで Next.js をセルフホストできますか？",
      },
      answer: {
        en: "Yes — Next.js is an open-source framework with no vendor lock-in. Three options: (1) **Node.js server** — `next start` after `next build`; (2) **Docker** — set `output: 'standalone'` in `next.config.ts`, build an image from `.next/standalone`; (3) **Static export** — `output: 'export'` generates pure HTML/CSS/JS deployable to any static host (GitHub Pages, S3, Netlify), but ISR, middleware, and API routes are unavailable.",
        np: "हो — (1) **Node.js**: `next build` पछि `next start`; (2) **Docker**: `output: 'standalone'` राखेर image बनाउनुहोस्; (3) **Static export**: `output: 'export'` ले static files बनाउँछ।",
        jp: "はい。3つの選択肢: (1) **Node.js サーバー** — `next build` 後に `next start`; (2) **Docker** — `output: 'standalone'` を設定して `.next/standalone` からイメージをビルド; (3) **静的エクスポート** — `output: 'export'` で HTML/CSS/JS を生成（ただし ISR・ミドルウェア・API ルートは使用不可）。",
      },
    },
    {
      question: {
        en: "How do I run `prisma migrate` in production safely?",
        np: "Production मा `prisma migrate` कसरी safely run गर्ने?",
        jp: "本番環境で `prisma migrate` を安全に実行するには？",
      },
      answer: {
        en: "Use `prisma migrate deploy` (not `prisma migrate dev`) in production. `migrate deploy` applies pending migration files without creating new ones or prompting — safe for CI and build scripts. Add it to the `build` script in `package.json` so it runs before `next build`. Never run `prisma migrate dev` in production — it can reset your database.",
        np: "Production मा `prisma migrate deploy` प्रयोग गर्नुहोस् (`migrate dev` होइन)। `migrate deploy` ले pending migrations apply गर्छ — CI को लागि safe। `migrate dev` ले DB reset गर्न सक्छ।",
        jp: "本番では `prisma migrate deploy`（`prisma migrate dev` ではなく）を使います。`migrate deploy` は確認なしで保留中のマイグレーションを適用します。CI・ビルドスクリプトに安全です。`prisma migrate dev` は絶対に本番で使わないでください。",
      },
    },
    {
      question: {
        en: "What is the difference between a preview deployment and a production deployment?",
        np: "Preview deployment र production deployment मा के फरक छ?",
        jp: "プレビューデプロイと本番デプロイの違いは？",
      },
      answer: {
        en: "Every push to any branch triggers a **preview deployment** — a fully functional, isolated Next.js instance with a unique URL. Pushing to `main` (or merging a PR into `main`) triggers the **production deployment** at your primary domain. Preview deployments are ideal for QA, design reviews, and stakeholder sign-off before merging.",
        np: "कुनै पनि branch push गर्दा **preview deployment** बन्छ — unique URL सहित isolated instance। `main` push गर्दा **production** हुन्छ। Preview ले QA र sign-off को लागि उपयोगी।",
        jp: "どのブランチへのプッシュでも**プレビューデプロイ**がトリガーされます。ユニーク URL を持つ独立した Next.js インスタンスです。`main` へのプッシュで**プロダクションデプロイ**が発生します。プレビューは QA・デザインレビューに最適です。",
      },
    },
    {
      question: {
        en: "How do I rollback a broken production deployment on Vercel?",
        np: "Vercel मा broken production deployment rollback कसरी गर्ने?",
        jp: "Vercel で壊れた本番デプロイをロールバックするには？",
      },
      answer: {
        en: "Vercel keeps every deployment permanently. Go to your project's **Deployments** tab, find the last known-good deployment, click the `...` overflow menu, and select **Promote to Production**. The rollback is instant — no re-build required. You can also use the Vercel CLI: `vercel rollback [deployment-url]`.",
        np: "Vercel ले सबै deployment permanent राख्छ। **Deployments** tab → good deployment → `...` → **Promote to Production**। CLI मा `vercel rollback [url]` पनि गर्न सकिन्छ।",
        jp: "Vercel はすべてのデプロイを永続保存します。**Deployments** タブで最後の正常デプロイを見つけ、`...` メニューから **Promote to Production** を選びます。ロールバックは即時で再ビルド不要です。CLI でも `vercel rollback [deployment-url]` が使えます。",
      },
    },
    {
      question: {
        en: "Are serverless function cold starts a problem for Next.js apps?",
        np: "Serverless function cold start Next.js app मा समस्या हो?",
        jp: "サーバーレス関数のコールドスタートは Next.js アプリの問題になりますか？",
      },
      answer: {
        en: "Cold starts (a new container spinning up after inactivity adds 200ms–2s of latency) are real but manageable. Strategies: (1) Keep function bundles small — tree-shake dependencies, use `serverExternalPackages`; (2) Use **Edge Runtime** (`export const runtime = 'edge'`) for latency-sensitive routes — Edge functions have near-zero cold starts; (3) Vercel Pro/Enterprise plans offer **Always-On** functions that stay warm. Static pages (○) have no cold start at all.",
        np: "Cold start (200ms–2s) manageable छ। (1) Bundle सानो राख्नुहोस्; (2) **Edge Runtime** प्रयोग गर्नुहोस्; (3) Static pages मा cold start हुँदैन।",
        jp: "コールドスタート（非アクティブ後に 200ms〜2s の遅延）は現実の問題ですが対処可能です。対策: (1) バンドルを小さく保つ; (2) 遅延に敏感なルートには **Edge Runtime**（`export const runtime = 'edge'`）を使用; (3) 静的ページ（○）にはコールドスタートが一切ありません。",
      },
    },
  ],
};
