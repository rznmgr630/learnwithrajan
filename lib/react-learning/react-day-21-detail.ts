import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_21_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Shipping your React app means turning your source files into optimized static files that browsers can load fast. Vite bundles your code, tree-shakes unused imports, splits it into chunks, and hashes filenames for caching. Analogy: building for production is like packing for a trip — you don't pack your entire wardrobe, just what you need, folded efficiently into the smallest bag.\n\n<b>Why production builds matter:</b>\n• Dev mode includes extra warnings, source maps, and HMR code — all bloat\n• Production mode removes all of that, minifies code, and applies tree-shaking\n↳ A dev bundle can be 10× larger than a production bundle",
      np: "React app build गरेर production-ready static files बनाउने। Vite ले bundle, tree-shake, code split र cache गर्छ।",
      jp: "React アプリを本番用静的ファイルにビルドする。Vite がバンドル・ツリーシェイク・コード分割・キャッシュを担います。",
    },
    {
      en: "Today we cover the full production pipeline:\n• <b>`npm run build`</b> — what it produces and why\n• <b>Code splitting</b> — breaking the bundle into smaller chunks loaded on demand\n• <b>Bundle analysis</b> — finding and eliminating bloat\n• <b>Environment variables</b> — managing secrets and config per environment\n• <b>Deployment</b> — zero-config deploys to Vercel and Netlify",
      np: "Build output, code splitting, bundle analysis, env variables, Vercel/Netlify deploy cover गर्छौं।",
      jp: "ビルド出力・コード分割・バンドル分析・環境変数・Vercel/Netlify デプロイを学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Understanding the build output",
        np: "Build output बुझ्ने",
        jp: "ビルド出力を理解する",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Running `npm run build` triggers Vite to compile, minify, and bundle everything into the `dist/` folder. Each output file has a content hash in its name — `index-3f8a2c.js`. This hash changes only when the file's content changes, so CDNs and browsers can cache these files aggressively.\n\n<b>Key files in `dist/`:</b>\n• `index.html` — the entry point; references the hashed JS/CSS\n• `assets/index-[hash].js` — your app code (minified)\n• `assets/vendor-[hash].js` — node_modules (React, React DOM, etc.)\n• `assets/index-[hash].css` — your styles",
            np: "`npm run build` ले `dist/` folder मा compile, minify, bundle गर्छ। Content hash ले caching सजिलो बनाउँछ।",
            jp: "`npm run build` で `dist/` にコンパイル・圧縮・バンドル。コンテンツハッシュで長期キャッシュが可能。",
          },
        },
        {
          type: "code",
          title: { en: "Build and preview locally", np: "Build र preview", jp: "ビルドとローカルプレビュー" },
          code: `# Build for production
npm run build

# Preview the production build locally (not dev server)
npm run preview

# The dist/ folder is what you deploy — nothing else
# dist/
#   index.html
#   assets/
#     index-DhRp9OmK.js    (your app code, minified)
#     vendor-BXdJ8O7k.js   (react, react-dom, etc.)
#     index-CHN1XyLb.css   (styles)`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Always test with `npm run preview` before deploying.</b> The dev server (`npm run dev`) behaves differently — it doesn't minify, doesn't split chunks the same way, and doesn't enforce production environment variables. A bug that only appears in production is usually caught by `npm run preview` first.",
            np: "Deploy अघि `npm run preview` ले test गर्नुहोस् — dev server भन्दा production-like।",
            jp: "デプロイ前に `npm run preview` でテスト — dev サーバーより本番に近い動作。",
          },
        },
      ],
    },
    {
      title: {
        en: "Code splitting strategies",
        np: "Code splitting strategies",
        jp: "コード分割の戦略",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "By default, Vite bundles your entire app into one JS file. With a large app, that means the browser downloads ALL your code even for the login page — most of it unused. Code splitting breaks the bundle into smaller chunks loaded on demand.\n\n<b>The biggest win: route-based splitting.</b> Lazy-load each page component so users only download the code for the pages they visit.",
            np: "Code splitting ले bundle lai chunks मा divide गर्छ। Route-based splitting सबभन्दा effective छ।",
            jp: "コード分割でバンドルをチャンクに分割。ルートベース分割が最も効果的。",
          },
        },
        {
          type: "code",
          title: { en: "Route-based and component-based splitting", np: "Splitting patterns", jp: "分割パターン" },
          code: `// Route-based splitting — biggest win
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}

// Component-based splitting — for heavy optional components
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));
const HeavyChart = lazy(() => import('./components/HeavyChart'));

// vite.config.ts — manual chunks for predictable splitting
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
};`,
        },
      ],
    },
    {
      title: {
        en: "Bundle analysis — finding and eliminating bloat",
        np: "Bundle analysis — bloat हटाउने",
        jp: "バンドル分析 — 肥大化の発見と除去",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "You can't optimize what you can't see. Bundle analysis shows you exactly what is inside your production bundle as an interactive treemap — each box represents a module, sized by its contribution to the bundle.\n\n<b>Common bloat sources:</b>\n• `moment.js` — 230KB. Replace with `date-fns` (tree-shakeable)\n• `lodash` — importing the whole library for one function. Use `lodash-es` or native JS\n• Icon libraries — `import * as Icons from 'react-icons'` pulls everything in. Always use named imports\n• Unused translations — i18n libraries that bundle all locales",
            np: "Bundle visualizer ले treemap देखाउँछ। Moment.js, full lodash, icon libraries common bloat हुन्।",
            jp: "バンドルビジュアライザーでツリーマップ表示。moment、lodash、アイコンライブラリが肥大化の典型例。",
          },
        },
        {
          type: "code",
          title: { en: "Setting up rollup-plugin-visualizer", np: "Bundle visualizer setup", jp: "バンドルビジュアライザー設定" },
          code: `# Install
npm install -D rollup-plugin-visualizer

# vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,           // auto-open in browser after build
      gzipSize: true,       // show gzipped sizes (what users download)
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],
});

// Run npm run build — a treemap opens automatically
// Boxes = modules, size = bundle contribution
// Click to drill down into node_modules`,
        },
        {
          type: "table",
          caption: {
            en: "Common bundle size fixes",
            np: "Bundle size fixes",
            jp: "バンドルサイズの修正例",
          },
          headers: [
            { en: "Problem", np: "समस्या", jp: "問題" },
            { en: "Bad", np: "गलत", jp: "悪い例" },
            { en: "Good", np: "राम्रो", jp: "良い例" },
            { en: "Saving", np: "बचत", jp: "削減量" },
          ],
          rows: [
            [
              { en: "Date library", np: "Date library", jp: "日付ライブラリ" },
              { en: "`moment`", np: "`moment`", jp: "`moment`" },
              { en: "`date-fns`", np: "`date-fns`", jp: "`date-fns`" },
              { en: "~200KB", np: "~200KB", jp: "~200KB" },
            ],
            [
              { en: "Lodash", np: "Lodash", jp: "Lodash" },
              { en: "`import _ from 'lodash'`", np: "full import", jp: "全体インポート" },
              { en: "`import { debounce } from 'lodash-es'`", np: "named import", jp: "名前付きインポート" },
              { en: "~500KB", np: "~500KB", jp: "~500KB" },
            ],
            [
              { en: "Icons", np: "Icons", jp: "アイコン" },
              { en: "`import * as Icons from 'react-icons/fa'`", np: "全部", jp: "全体インポート" },
              { en: "`import { FaCheck } from 'react-icons/fa'`", np: "named", jp: "名前付き" },
              { en: "~300KB", np: "~300KB", jp: "~300KB" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Environment variables",
        np: "Environment variables",
        jp: "環境変数",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Different environments (development, staging, production) need different config — different API URLs, different feature flags, different analytics keys. Vite uses `.env` files for this.\n\n<b>Critical rule: only variables prefixed with `VITE_` are exposed to the browser.</b> Everything else is only available in Vite's Node.js config files, not in your React code. This prevents accidental exposure of server secrets.\n\n<b>File priority (highest to lowest):</b>\n• `.env.production.local` — local overrides for production mode\n• `.env.production` — production environment\n• `.env.local` — local overrides (never commit)\n• `.env` — default for all environments",
            np: "VITE_ prefix भएका variables मात्र browser मा expose हुन्छन्। `.env.local` कहिले commit नगर्नुहोस्।",
            jp: "`VITE_` プレフィックスの変数のみブラウザに公開。`.env.local` はコミットしない。",
          },
        },
        {
          type: "code",
          title: { en: "Env variables in Vite", np: "Env variables", jp: "Vite の環境変数" },
          code: `# .env (committed — default values, no secrets)
VITE_APP_NAME=My App
VITE_API_URL=https://api.example.com

# .env.development (committed — dev overrides)
VITE_API_URL=http://localhost:8000

# .env.local (NEVER commit — local secrets)
VITE_GOOGLE_ANALYTICS_ID=UA-XXXXX

# .env.example (commit this — documents what's needed)
VITE_API_URL=
VITE_GOOGLE_ANALYTICS_ID=

# In your React code — use import.meta.env, NOT process.env
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
const isDev = import.meta.env.DEV;          // built-in Vite boolean
const isProd = import.meta.env.PROD;        // built-in Vite boolean
const mode = import.meta.env.MODE;          // 'development' | 'production'

// TypeScript: add to vite-env.d.ts for type safety
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
}`,
        },
      ],
    },
    {
      title: {
        en: "Deploying to Vercel and Netlify",
        np: "Vercel र Netlify मा deploy गर्ने",
        jp: "Vercel・Netlify へのデプロイ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Vercel and Netlify are the two most popular platforms for deploying React SPAs — both detect Vite projects automatically, run your build command, and serve the `dist/` folder from a global CDN.\n\n<b>The SPA routing gotcha:</b> When a user directly visits `yourapp.com/dashboard`, the server looks for a `dashboard.html` file — which doesn't exist (it's a SPA). You need to tell the server to always serve `index.html` and let React Router handle the rest.",
            np: "Vercel र Netlify automatically Vite detect गर्छन्। SPA routing को लागि redirect config चाहिन्छ।",
            jp: "Vercel・Netlify は Vite を自動検出。SPA ルーティングのためにリダイレクト設定が必要。",
          },
        },
        {
          type: "code",
          title: { en: "Deploying to Vercel and Netlify", np: "Deploy config", jp: "デプロイ設定" },
          code: `# --- VERCEL ---
# Option 1: CLI deploy
npm install -g vercel
vercel          # follow prompts, detects Vite automatically

# Option 2: GitHub integration (recommended)
# 1. Push code to GitHub
# 2. Import project at vercel.com/new
# 3. Vercel auto-detects: Build Command: npm run build, Output: dist

# vercel.json — fix SPA routing (serve index.html for all routes)
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}

# --- NETLIFY ---
# public/_redirects — fix SPA routing
/* /index.html 200

# netlify.toml (alternative, more explicit)
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# --- ENVIRONMENT VARIABLES ---
# Vercel: Dashboard → Project → Settings → Environment Variables
# Netlify: Dashboard → Site → Site configuration → Environment variables
# Both support per-environment values (preview, production)`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Preview deployments</b> are one of the biggest productivity wins: every pull request gets its own live URL automatically. Your team can review the actual deployed app, not just the code diff. Vercel and Netlify both do this out of the box when connected to GitHub.",
            np: "Preview deployments: हर PR को आफ्नै live URL। Team ले actual deployed app review गर्न सक्छ।",
            jp: "プレビューデプロイ：PR ごとに専用 URL が自動生成。チームが実際のアプリをレビュー可能。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why does my deployed app show a blank page on refresh?",
        np: "Deployed app refresh गर्दा blank page किन?",
        jp: "デプロイ後にリロードすると白紙になるのはなぜ？",
      },
      answer: {
        en: "The server is looking for a file at that URL path (e.g. `/dashboard`) and returning a 404 when it doesn't find one. Your SPA only has `index.html` — React Router handles the routing in the browser. Fix it by adding the rewrite rule: `/* /index.html 200` (Netlify) or the Vercel rewrites config. Always test after deploying by directly typing a route URL into the browser.",
        np: "Server ले `/dashboard` file खोज्छ र 404 दिन्छ। Rewrite rule थप्नुहोस्: `/* /index.html 200`।",
        jp: "サーバーが `/dashboard` ファイルを探して 404。`/* /index.html 200` のリライトルールを追加してください。",
      },
    },
    {
      question: {
        en: "What is tree-shaking?",
        np: "Tree-shaking के हो?",
        jp: "ツリーシェイキングとは？",
      },
      answer: {
        en: "Tree-shaking is the process of removing code that is imported but never actually used. Vite (via Rollup) traces every `import` and `export` and drops anything not reachable from your entry point. It only works with ES modules (`import`/`export`) — not CommonJS (`require`). This is why `import { debounce } from 'lodash-es'` is better than `import _ from 'lodash'` — the ES module version lets the bundler drop all the lodash functions you didn't use.",
        np: "Tree-shaking ले import भएर पनि use नभएका code हटाउँछ। ES modules मा मात्र काम गर्छ।",
        jp: "未使用のコードを削除する最適化。ES モジュール形式でのみ有効。",
      },
    },
    {
      question: {
        en: "Should I commit the `dist/` folder?",
        np: "`dist/` folder commit गर्ने?",
        jp: "`dist/` フォルダをコミットすべき？",
      },
      answer: {
        en: "No. Add `dist/` to `.gitignore`. The build is a derived artifact — it can always be regenerated from source. Committing it causes noisy diffs, merge conflicts, and risks accidentally serving a stale build. Your CI/CD pipeline (Vercel, Netlify, GitHub Actions) runs `npm run build` on each deploy automatically.",
        np: "`dist/` `.gitignore` मा राख्नुहोस्। CI/CD ले automatically build गर्छ।",
        jp: "`dist/` は `.gitignore` に追加。CI/CD が自動ビルドするため不要。",
      },
    },
    {
      question: {
        en: "How do I serve the app from a subdirectory (e.g. `/my-app/`)?",
        np: "Subdirectory `/my-app/` बाट app serve गर्ने?",
        jp: "サブディレクトリ（`/my-app/`）から配信するには？",
      },
      answer: {
        en: "Set `base` in `vite.config.ts`: `export default defineConfig({ base: '/my-app/' })`. This tells Vite to prefix all asset URLs with `/my-app/`. Also configure your React Router with `<BrowserRouter basename='/my-app'>`. This is common for GitHub Pages (`username.github.io/repo-name`) and when hosting multiple apps on one domain under different paths.",
        np: "`vite.config.ts` मा `base: '/my-app/'` set गर्नुहोस्। React Router मा `basename` पनि।",
        jp: "`vite.config.ts` に `base: '/my-app/'` を設定。React Router にも `basename` を指定。",
      },
    },
    {
      question: {
        en: "What is the difference between `npm run build` and `npm run preview`?",
        np: "`npm run build` र `npm run preview` मा के फरक?",
        jp: "`npm run build` と `npm run preview` の違いは？",
      },
      answer: {
        en: "`npm run build` compiles your source code into the `dist/` folder — it produces the static files but doesn't serve them. `npm run preview` starts a local static file server that serves the `dist/` folder, mimicking what a production CDN would do. Use `preview` to catch issues (missing env vars, routing bugs, broken assets) before pushing to Vercel/Netlify.",
        np: "`build` ले `dist/` बनाउँछ। `preview` ले त्यही serve गर्छ। Deploy अघि preview गर्नुहोस्।",
        jp: "`build` が `dist/` を生成、`preview` がそれをサーブ。デプロイ前の確認に使う。",
      },
    },
  ],
};
