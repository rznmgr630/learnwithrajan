import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_1_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Next.js** is the React framework for production built by Vercel. It adds **file-system routing**, **React Server Components by default**, a single optimised toolchain (Turbopack in dev), built-in image/font/script optimisation, and deployment-ready conventions — so you ship features instead of wiring tools.",
      np: "Next.js भनेको Vercel को React framework जसले routing, RSC, र build toolchain एकीकृत गर्छ।",
      jp: "Next.js は Vercel が作った本番向け React フレームワークで、ルーティング・RSC・ビルドツールが統合されています。",
    },
    {
      en: "You still write **React components** for every UI piece. Next.js decides *where* and *when* they run — on the server at build time, on the server per request, or in the browser — giving you control over performance and SEO without a separate backend for most use cases.",
      np: "UI React component मा लेख्नुहोस्; Next.js ले कहाँ र कहिले run हुन्छ निर्णय गर्छ।",
      jp: "UI は React コンポーネントで書き、どこでいつ実行するかは Next.js が管理します。",
    },
  ],
  sections: [
    {
      title: {
        en: "Why Next.js — React vs Next.js vs Remix",
        np: "किन Next.js — तुलना",
        jp: "Next.js を選ぶ理由：比較表",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Plain **Create React App** (now deprecated) ships a client-side-only SPA: the browser downloads a blank HTML shell and JavaScript renders everything. This is slow on first load and invisible to search engines without extra work. Next.js renders on the server so users see content fast and crawlers index your pages out of the box.",
            np: "CRA ले client-side मात्र SPA पाठाउँछ — पहिलो load ढिलो र SEO गाह्रो। Next.js ले server मा render गर्छ।",
            jp: "CRA は CSR のみの SPA。初期ロードが遅く SEO も弱い。Next.js はサーバーレンダリングで解決します。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Framework comparison at a glance",
            np: "फ्रेमवर्क तुलना",
            jp: "フレームワーク比較",
          },
          headers: [
            { en: "Feature", np: "सुविधा", jp: "機能" },
            { en: "Create React App", np: "CRA", jp: "CRA" },
            { en: "Next.js 15", np: "Next.js 15", jp: "Next.js 15" },
            { en: "Remix", np: "Remix", jp: "Remix" },
          ],
          rows: [
            [
              { en: "Rendering", np: "Rendering", jp: "レンダリング" },
              { en: "CSR only", np: "CSR मात्र", jp: "CSR のみ" },
              { en: "SSR / SSG / ISR / CSR hybrid", np: "SSR/SSG/ISR/CSR", jp: "SSR/SSG/ISR/CSR ハイブリッド" },
              { en: "SSR-first, loaders", np: "SSR-first", jp: "SSR 中心" },
            ],
            [
              { en: "Routing", np: "Routing", jp: "ルーティング" },
              { en: "Manual (React Router)", np: "React Router", jp: "手動（React Router）" },
              { en: "File-system (App Router)", np: "File-system", jp: "ファイルシステム" },
              { en: "File-system (Flat Routes)", np: "File-system", jp: "ファイルシステム" },
            ],
            [
              { en: "React Server Components", np: "RSC", jp: "RSC" },
              { en: "No", np: "छैन", jp: "なし" },
              { en: "Yes (default)", np: "हो (डिफल्ट)", jp: "あり（既定）" },
              { en: "Partial", np: "आंशिक", jp: "一部" },
            ],
            [
              { en: "API routes built-in", np: "API routes", jp: "API ルート内蔵" },
              { en: "No", np: "छैन", jp: "なし" },
              { en: "Yes (route.ts)", np: "हो", jp: "あり" },
              { en: "Yes (resource routes)", np: "हो", jp: "あり" },
            ],
            [
              { en: "Build tool", np: "Build tool", jp: "ビルドツール" },
              { en: "Webpack (CRA)", np: "Webpack", jp: "Webpack" },
              { en: "Turbopack (dev) / Webpack (prod)", np: "Turbopack/Webpack", jp: "Turbopack (dev)" },
              { en: "Vite", np: "Vite", jp: "Vite" },
            ],
          ],
        },
        { type: "diagram", id: "nextjs-request-lifecycle" },
      ],
    },
    {
      title: {
        en: "Setting up — scaffold with create-next-app",
        np: "सेटअप — create-next-app",
        jp: "セットアップ：create-next-app",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Prerequisites**: Node.js 18.17+ (check with `node -v`), basic React knowledge (components, props, useState), and TypeScript basics. You do not need to know Webpack or Babel — Next.js configures everything.",
            np: "Node.js 18.17+, React basics, TypeScript basics — Webpack/Babel थाहा नहुनु पर्दैन।",
            jp: "Node.js 18.17 以上、React の基礎、TypeScript の基礎が前提。Webpack/Babel の知識は不要です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Bootstrap a new Next.js 15 project",
            np: "नयाँ Next.js 15 project",
            jp: "Next.js 15 プロジェクト作成",
          },
          code: `# Run in any directory — the wizard creates a new folder
npx create-next-app@latest my-app

# Interactive prompts (choose these for this course):
# ✔ Would you like to use TypeScript? › Yes
# ✔ Would you like to use ESLint? › Yes
# ✔ Would you like to use Tailwind CSS? › Yes
# ✔ Would you like your code inside a 'src/' directory? › No
# ✔ Would you like to use App Router? (recommended) › Yes
# ✔ Would you like to use Turbopack for 'next dev'? › Yes
# ✔ Would you like to customize the import alias? › No (keep @/*)

cd my-app
npm run dev   # opens http://localhost:3000`,
        },
        {
          type: "paragraph",
          text: {
            en: "The `package.json` contains four scripts: `dev` (starts Turbopack dev server with HMR), `build` (compiles + optimises for production), `start` (runs the production build locally), and `lint` (runs ESLint with Next.js rules).",
            np: "`dev`, `build`, `start`, `lint` — चार npm script।",
            jp: "`dev`・`build`・`start`・`lint` の 4 つのスクリプトが含まれます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Project structure walkthrough",
        np: "Project structure",
        jp: "プロジェクト構造の解説",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Scaffolded folder tree",
            np: "Scaffolded folder tree",
            jp: "生成されたフォルダツリー",
          },
          code: `my-app/
├── app/                      ← App Router root
│   ├── favicon.ico
│   ├── globals.css           ← Global styles, imported in layout.tsx
│   ├── layout.tsx            ← Root layout (wraps every page)
│   └── page.tsx              ← "/" route — your first page
├── public/                   ← Static assets served from "/"
│   └── (images, icons, etc.)
├── next.config.ts            ← Next.js configuration
├── tailwind.config.ts        ← Tailwind configuration
├── tsconfig.json             ← TypeScript configuration
├── eslint.config.mjs         ← ESLint rules
└── package.json`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`app/` is the **App Router** directory. Every folder inside it that contains a `page.tsx` becomes a URL route.",
              np: "`app/` भित्र `page.tsx` भएको फोल्डर = URL route।",
              jp: "`app/` 内で `page.tsx` があるフォルダが URL ルートになります。",
            },
            {
              en: "`app/layout.tsx` is the **root layout** — it must contain `<html>` and `<body>` tags and wraps every page in your application.",
              np: "`app/layout.tsx` root layout — `<html>` र `<body>` अनिवार्य।",
              jp: "`app/layout.tsx` はルートレイアウトで、`<html>` と `<body>` が必要です。",
            },
            {
              en: "`public/` files are served as-is at the root: `public/logo.png` is accessible at `/logo.png` — no `import` needed.",
              np: "`public/` फाइल `/` बाट serve हुन्छ — `import` चाहिँदैन।",
              jp: "`public/` のファイルはルートから直接提供されます。",
            },
            {
              en: "`next.config.ts` lets you enable experimental features, set `redirects`, `rewrites`, environment variables, and image domain allow-lists.",
              np: "`next.config.ts` मा redirects, rewrites, image domains सेट।",
              jp: "`next.config.ts` でリダイレクト・書き換え・画像ドメインなどを設定します。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Hello Next.js — your first page",
        np: "पहिलो page",
        jp: "最初のページ：Hello Next.js",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`app/page.tsx` exports a **default React component** — that is all a route needs. Server Components (the default) are `async` functions, so you can `await` data directly inside the component body without `useEffect`.",
            np: "`app/page.tsx` ले default React component export गर्छ — route को लागि यति मात्र।",
            jp: "`app/page.tsx` は default の React コンポーネントをエクスポートするだけでルートになります。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/page.tsx — minimal root route",
            np: "app/page.tsx — सरल root route",
            jp: "app/page.tsx — 最小ルートの例",
          },
          code: `// app/page.tsx
// This is a React Server Component (default in App Router).
// No "use client" directive needed — it runs on the server.

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Hello, Next.js!</h1>
      <p className="mt-4 text-lg text-gray-600">
        Edit <code className="font-mono">app/page.tsx</code> and save to see
        changes instantly.
      </p>
    </main>
  );
}`,
        },
        {
          type: "code",
          title: {
            en: "app/layout.tsx — root layout (auto-generated, annotated)",
            np: "app/layout.tsx — root layout (टिप्पणीसहित)",
            jp: "app/layout.tsx — ルートレイアウト（コメント付き）",
          },
          code: `// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

// Metadata is picked up by Next.js and turned into <head> tags.
export const metadata: Metadata = {
  title: "My Next.js App",
  description: "Learning Next.js with Mosh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* next/font automatically injects <style> — no className needed on body */}
      <body className={geist.className}>
        {children}  {/* ← every page renders here */}
      </body>
    </html>
  );
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Can I use Next.js without TypeScript?",
        np: "TypeScript बिना Next.js?",
        jp: "TypeScript なしで Next.js を使える？",
      },
      answer: {
        en: "Yes. Answer 'No' to the TypeScript prompt when running `create-next-app` and files will be `.jsx` / `.js`. You can also add TypeScript to an existing JS project later: just create a `tsconfig.json` and run `npm run dev` — Next.js auto-configures it. The Mosh course uses TypeScript throughout; following along in TS is strongly recommended.",
        np: "हो, `.js`/`.jsx` प्रयोग गर्न सकिन्छ। पछि `tsconfig.json` थपेर TypeScript सक्रिय गर्न सकिन्छ। Mosh course TS प्रयोग गर्छ।",
        jp: "可能です。JS で始めてあとから `tsconfig.json` を追加するだけで Next.js が自動設定します。Mosh コースは TS を使用するので、合わせることを推奨します。",
      },
    },
    {
      question: {
        en: "What is the difference between `app/` and `pages/`?",
        np: "`app/` र `pages/` मा के फरक?",
        jp: "`app/` と `pages/` の違いは？",
      },
      answer: {
        en: "`pages/` is the **Pages Router** — the original Next.js routing system introduced in v1. Every file in `pages/` is a route; data fetching used `getServerSideProps` / `getStaticProps`. The **App Router** (`app/`) was introduced in Next.js 13 and is the recommended approach from Next.js 13+ onward. It uses React Server Components, nested layouts, `loading.tsx` / `error.tsx` conventions, and colocated data fetching with `async` components. You can run both directories in the same project during migration, but new projects should use `app/` only.",
        np: "`pages/` पुरानो Pages Router — `getServerSideProps` प्रयोग। `app/` नयाँ App Router — RSC, nested layout, async component। नयाँ project मा `app/` मात्र।",
        jp: "`pages/` は旧 Pages Router で `getSSP`/`gSP` でデータ取得。`app/` は新しい App Router で RSC・ネストレイアウト・async コンポーネントを使います。新規は `app/` 推奨。",
      },
    },
    {
      question: {
        en: "Do I need a separate backend with Next.js?",
        np: "Next.js मा छुट्टै backend चाहिन्छ?",
        jp: "Next.js とは別にバックエンドが必要？",
      },
      answer: {
        en: "Not always. Next.js provides **Route Handlers** (`app/api/.../route.ts`) for API endpoints, and Server Components can query databases directly without any separate API. For simple to medium apps, Next.js is a full-stack solution. You might add a separate backend when you need a public API consumed by mobile apps, when teams split frontend and backend deployments, or when you need long-running background services.",
        np: "होइन — Route Handlers र Server Components ले DB query गर्न सक्छ। मोबाइल app वा अलग टिम भए छुट्टै backend।",
        jp: "必須ではありません。Route Handlers で API を作り、Server Component から直接 DB にアクセスできます。モバイル API や大規模チームでは別 BE も検討します。",
      },
    },
    {
      question: {
        en: "When should I choose Next.js over plain React?",
        np: "plain React भन्दा Next.js कहिले?",
        jp: "plain React より Next.js を選ぶのはいつ？",
      },
      answer: {
        en: "Choose Next.js when you need **SEO** (marketing pages, blogs, e-commerce), **server-side data fetching** without client spinners, **API routes** alongside your UI, or **production optimisations** (image, font, code splitting) without manual Webpack config. Stick with plain React (+ Vite) for internal dashboards, admin tools, or apps that are entirely behind a login where SSR provides minimal benefit.",
        np: "SEO, server-side data, API routes, production optimisation चाहिए भने Next.js। Login पछाडिको internal tool मा plain React पनि ठीक।",
        jp: "SEO・サーバーデータ・API ルート・本番最適化が必要なら Next.js。ログイン後の管理画面などは plain React + Vite でも十分です。",
      },
    },
    {
      question: {
        en: "How does Turbopack differ from Webpack?",
        np: "Turbopack र Webpack मा के फरक?",
        jp: "Turbopack と Webpack の違いは？",
      },
      answer: {
        en: "**Turbopack** is Vercel's Rust-based successor to Webpack, designed for incremental compilation. It only rebuilds the modules that changed rather than re-processing the whole dependency graph, giving much faster Hot Module Replacement (HMR) on large apps. In Next.js 15, Turbopack is the default `dev` bundler. Production builds still use Webpack (Turbopack prod support is in progress). You do not configure either manually in a standard Next.js project.",
        np: "Turbopack Rust-based, incremental compilation — परिवर्तित module मात्र rebuild। Dev मा तीव्र HMR। Prod अझै Webpack।",
        jp: "Turbopack は Rust 製で増分コンパイルが得意。変更分だけ再ビルドするため大規模プロジェクトの HMR が高速。本番は Webpack のまま（移行中）。",
      },
    },
    {
      question: {
        en: "What learning paths come after this Next.js track?",
        np: "Next.js पछि के पढ्ने?",
        jp: "Next.js の次に学ぶべきことは？",
      },
      answer: {
        en: "After the core Next.js concepts: **databases** with Prisma + PostgreSQL (covered in Mosh's course), **authentication** with NextAuth.js / Auth.js, **deployment** with Vercel or Docker + a VPS, and then deeper topics like advanced caching strategies, middleware, internationalisation (i18n), and performance monitoring. The Mosh course covers all of these in sequence.",
        np: "Prisma + DB, NextAuth, Vercel deployment, advanced caching — Mosh course ले क्रमिक ढाकेको छ।",
        jp: "次は Prisma + DB、NextAuth、Vercel デプロイ、高度なキャッシュ戦略と続きます。Mosh コースで順に学べます。",
      },
    },
  ],
  bullets: [
    {
      en: "Run `npx create-next-app@latest` and explore the generated files — trace how `layout.tsx` wraps `page.tsx`.",
      np: "`create-next-app` चलाई `layout.tsx` र `page.tsx` को सम्बन्ध हेर्नुहोस्।",
      jp: "`create-next-app` を実行し、`layout.tsx` が `page.tsx` を包む流れを確認する。",
    },
    {
      en: "Modify `app/page.tsx` — change the `<h1>` text, save, and observe Turbopack's instant HMR in the browser.",
      np: "`page.tsx` मा `<h1>` परिवर्तन गरी Turbopack HMR हेर्नुहोस्।",
      jp: "`page.tsx` の `<h1>` を変えて保存し、Turbopack の瞬時 HMR を確認する。",
    },
    {
      en: "Add a second page at `app/about/page.tsx` and navigate to `/about` in the browser — no router config needed.",
      np: "`app/about/page.tsx` थपी `/about` मा navigate गर्नुहोस् — router config चाहिँदैन।",
      jp: "`app/about/page.tsx` を追加して `/about` にアクセスし、設定不要でルートが増えることを確かめる。",
    },
  ],
};
