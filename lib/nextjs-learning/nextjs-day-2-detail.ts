import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_2_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "The App Router makes **React Server Components (RSC)** the default. Every component you write runs on the server unless you opt in to the client with `'use client'`. Understanding the boundary between server and client — and when to cross it — is the single most important mental model in modern Next.js.",
      np: "App Router मा default Server Component; `'use client'` ले client मा opt-in। यो boundary बुझ्नु Next.js को सबैभन्दा महत्त्वपूर्ण concept।",
      jp: "App Router では RSC がデフォルト。`'use client'` でクライアントに切り替えます。この境界を理解することが Next.js 最重要の概念です。",
    },
    {
      en: "Server Components fetch data, access the file system, and import sensitive secrets — **none of that code ships to the browser**. Client Components handle interactivity: hooks, event handlers, and browser APIs. The two can be composed: a Server Component renders a Client Component as its child.",
      np: "Server Component — data fetch, DB access, secrets — browser मा code आउँदैन। Client Component — hooks, events। दुवै compose हुन्छन्।",
      jp: "Server Component はデータ取得・DB・秘密情報を扱いブラウザにコードを送りません。Client Component はインタラクションを担い、双方を合成できます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Server vs Client Components",
        np: "Server vs Client Component",
        jp: "Server Component と Client Component",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Server Components** are the default in `app/`. They are async React functions that run on the server (at build time or per request). They can `await` database calls, read the file system, import server-only packages, and return JSX — but they cannot use `useState`, `useEffect`, event handlers, or any browser-only API.",
            np: "Server Component default async function — DB, file system, server-only package। `useState`, `useEffect`, event handler हुँदैन।",
            jp: "Server Component は既定の async 関数。DB・ファイルシステム・サーバー専用パッケージを使えますが、`useState`・`useEffect`・イベントハンドラは使えません。",
          },
        },
        {
          type: "code",
          title: {
            en: "Server Component — fetch data directly (no useEffect)",
            np: "Server Component — सिधै data fetch",
            jp: "Server Component：useEffect なしで直接データ取得",
          },
          code: `// app/users/page.tsx
// This is a Server Component (no "use client" → runs on server).

interface User {
  id: number;
  name: string;
  email: string;
}

export default async function UsersPage() {
  // Direct async/await — no useEffect, no useState, no loading state.
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const users: User[] = await res.json();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="border rounded p-3">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Client Components** opt in with the `'use client'` directive at the top of the file (before any imports). They are bundled and sent to the browser, hydrated, and can use all React hooks and browser APIs. Use them for interactive elements: forms, modals, dropdowns, anything that listens to user events.",
            np: "`'use client'` directive — browser मा bundle हुन्छ। hooks, events, browser API चाहिए भए।",
            jp: "ファイル先頭に `'use client'` を書くと Client Component に。ブラウザで実行され、フック・イベント・ブラウザ API が使えます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Client Component — interactive counter with useState",
            np: "Client Component — useState सहित counter",
            jp: "Client Component：useState を使ったカウンター",
          },
          code: `// app/components/Counter.tsx
"use client"; // ← This directive makes it a Client Component

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setCount((c) => c - 1)}
        className="px-3 py-1 bg-gray-200 rounded"
      >
        -
      </button>
      <span className="text-xl font-bold tabular-nums">{count}</span>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-3 py-1 bg-gray-200 rounded"
      >
        +
      </button>
    </div>
  );
}`,
        },
        {
          type: "table",
          caption: {
            en: "When to use Server vs Client Components",
            np: "कहिले कुन प्रयोग गर्ने",
            jp: "Server と Client の使い分け",
          },
          headers: [
            { en: "Need", np: "आवश्यकता", jp: "要件" },
            { en: "Server Component", np: "Server Component", jp: "Server Component" },
            { en: "Client Component", np: "Client Component", jp: "Client Component" },
          ],
          rows: [
            [
              { en: "Fetch data", np: "Data fetch", jp: "データ取得" },
              { en: "Yes (async/await directly)", np: "हो", jp: "◯（直接 await）" },
              { en: "Via SWR / React Query", np: "SWR/Query मार्फत", jp: "SWR / React Query" },
            ],
            [
              { en: "Access database / secrets", np: "DB / secrets", jp: "DB・秘密情報" },
              { en: "Yes", np: "हो", jp: "◯" },
              { en: "No — never", np: "होइन", jp: "✕ 絶対 NG" },
            ],
            [
              { en: "useState / useReducer", np: "useState", jp: "useState" },
              { en: "No", np: "होइन", jp: "✕" },
              { en: "Yes", np: "हो", jp: "◯" },
            ],
            [
              { en: "onClick / onChange events", np: "Events", jp: "イベント" },
              { en: "No", np: "होइन", jp: "✕" },
              { en: "Yes", np: "हो", jp: "◯" },
            ],
            [
              { en: "useEffect / lifecycle", np: "useEffect", jp: "useEffect" },
              { en: "No", np: "होइन", jp: "✕" },
              { en: "Yes", np: "हो", jp: "◯" },
            ],
            [
              { en: "Browser APIs (localStorage, window)", np: "Browser API", jp: "ブラウザ API" },
              { en: "No", np: "होइन", jp: "✕" },
              { en: "Yes", np: "हो", jp: "◯" },
            ],
            [
              { en: "Reduce JS bundle size", np: "Bundle size घटाउने", jp: "JS バンドル削減" },
              { en: "Yes (zero JS shipped)", np: "हो (JS शिप हुँदैन)", jp: "◯（JS を送らない）" },
              { en: "No", np: "होइन", jp: "✕" },
            ],
          ],
        },
        { type: "diagram", id: "nextjs-client-server-boundary" },
        {
          type: "paragraph",
          text: {
            en: "**The tree rule**: A Server Component can import and render a Client Component as its child. However, a Client Component cannot import a Server Component (because the Server Component runs asynchronously on the server). The typical pattern is: Server Component fetches data and passes it as props to an interactive Client Component leaf.",
            np: "Server Component ले Client Component child render गर्न सक्छ। Client ले Server import गर्न सक्दैन। Server ले data fetch गरी Client props मा दिनु राम्रो pattern।",
            jp: "Server Component は Client Component を子として render できます。Client Component は Server Component を import できません。Server でデータ取得 → props で Client に渡すパターンが一般的。",
          },
        },
      ],
    },
    {
      title: {
        en: "Data fetching patterns",
        np: "Data fetching patterns",
        jp: "データ取得パターン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "In Server Components, `fetch()` is enhanced by Next.js. You can control caching behaviour with the `cache` option. The three modes map directly to the three rendering strategies: **force-cache** (static), **no-store** (dynamic), and **next.revalidate** (ISR).",
            np: "Next.js ले `fetch()` enhance गर्छ। `cache` option ले static, dynamic, ISR तीनवटा strategy नियन्त्रण।",
            jp: "Next.js は `fetch()` を拡張し、`cache` オプションで static・dynamic・ISR を制御できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "fetch() cache options — all three variants",
            np: "fetch() cache options — तीनवटा",
            jp: "fetch() の cache オプション 3 種",
          },
          code: `// 1. STATIC (force-cache) — fetched once at build time, cached indefinitely.
//    Equivalent to getStaticProps in the Pages Router.
const staticData = await fetch("https://api.example.com/config", {
  cache: "force-cache", // default in Next.js
});

// 2. DYNAMIC (no-store) — fetched fresh on every request, never cached.
//    Equivalent to getServerSideProps in the Pages Router.
const dynamicData = await fetch("https://api.example.com/live-prices", {
  cache: "no-store",
});

// 3. ISR (revalidate) — cached, but rebuilt in the background after N seconds.
//    Equivalent to getStaticProps with revalidate in the Pages Router.
const isrData = await fetch("https://api.example.com/products", {
  next: { revalidate: 60 }, // rebuild every 60 seconds at most
});`,
        },
        {
          type: "paragraph",
          text: {
            en: "You can also set a **segment-level** cache option by exporting a config constant from `page.tsx` or `layout.tsx`. This overrides the `fetch` default for the entire segment and is useful when you want all fetches to share the same strategy without annotating each one.",
            np: "Segment-level config export गरी सबै fetch को strategy एकैसाथ override गर्न सकिन्छ।",
            jp: "セグメントレベルで config をエクスポートすれば、すべての fetch に同じ戦略を一括適用できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Segment-level cache config",
            np: "Segment-level cache config",
            jp: "セグメントレベルのキャッシュ設定",
          },
          code: `// app/dashboard/page.tsx
// Force this entire route to be dynamic — never cached.
export const dynamic = "force-dynamic";

// OR: revalidate every 30 seconds (ISR) for the whole segment.
export const revalidate = 30;

export default async function DashboardPage() {
  // All fetch() calls here are affected by the config above.
  const data = await fetch("https://api.example.com/stats").then((r) =>
    r.json()
  );
  return <div>{JSON.stringify(data)}</div>;
}`,
        },
        { type: "diagram", id: "nextjs-data-fetch-cache" },
      ],
    },
    {
      title: {
        en: "Rendering strategies — Static, Dynamic, and ISR",
        np: "Rendering strategies",
        jp: "レンダリング戦略：Static・Dynamic・ISR",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Next.js automatically picks the rendering strategy for each route based on the `fetch` options you use. You never call a different API — you just change the cache option and Next.js does the right thing at build and request time.",
            np: "`fetch` option हेरेर Next.js ले rendering strategy स्वत: छान्छ। अलग API चाहिँदैन।",
            jp: "`fetch` オプションを見て Next.js が自動的に戦略を選択します。別の API を呼ぶ必要はありません。",
          },
        },
        { type: "diagram", id: "nextjs-render-strategies" },
        {
          type: "table",
          caption: {
            en: "Rendering strategy comparison",
            np: "Rendering strategy तुलना",
            jp: "レンダリング戦略比較",
          },
          headers: [
            { en: "Strategy", np: "Strategy", jp: "戦略" },
            { en: "When built", np: "कहिले build", jp: "ビルドのタイミング" },
            { en: "Triggered by", np: "कारण", jp: "トリガー" },
            { en: "Best for", np: "उपयुक्त", jp: "向いているページ" },
          ],
          rows: [
            [
              { en: "Static (SSG)", np: "Static", jp: "Static (SSG)" },
              { en: "At build time", np: "Build time मा", jp: "ビルド時" },
              { en: "`force-cache` (default)", np: "`force-cache`", jp: "`force-cache`（既定）" },
              { en: "Marketing pages, blogs, docs", np: "Marketing, blog, docs", jp: "マーケ・ブログ・ドキュメント" },
            ],
            [
              { en: "Dynamic (SSR)", np: "Dynamic", jp: "Dynamic (SSR)" },
              { en: "Per request", np: "प्रत्येक request मा", jp: "リクエストごと" },
              { en: "`no-store`, cookies(), headers()", np: "`no-store`, cookies()", jp: "`no-store`・cookies()・headers()" },
              { en: "Dashboards, personalised pages", np: "Dashboard, personalised", jp: "ダッシュボード・パーソナライズ" },
            ],
            [
              { en: "ISR", np: "ISR", jp: "ISR" },
              { en: "At build, then background rebuild", np: "Build + background rebuild", jp: "ビルド後、バックグラウンドで再ビルド" },
              { en: "`next: { revalidate: N }`", np: "`revalidate`", jp: "`next: { revalidate: N }`" },
              { en: "Product pages, news, listings", np: "Products, news", jp: "商品ページ・ニュース" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "**What triggers dynamic rendering automatically?** If your Server Component (or any component in the render tree) calls `cookies()`, `headers()`, or `searchParams`, Next.js automatically opts the entire route into dynamic rendering — even if you did not set `no-store` on any fetch. This makes sense: these values are request-specific, so the result cannot be cached.",
            np: "`cookies()`, `headers()`, `searchParams` प्रयोग भए route स्वत: dynamic हुन्छ — `no-store` नचाहिँदा पनि।",
            jp: "`cookies()`・`headers()`・`searchParams` を使うとリクエスト固有のため、ルート全体が自動的に dynamic になります。",
          },
        },
        {
          type: "code",
          title: {
            en: "ISR in practice — product page rebuilt every 60 s",
            np: "ISR — product page हरेक ६० सेकेन्डमा rebuild",
            jp: "ISR の実例：60 秒ごとに再ビルドする商品ページ",
          },
          code: `// app/products/[id]/page.tsx
interface Product {
  id: number;
  title: string;
  price: number;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  // Cached for 60 seconds — background revalidation after that.
  const res = await fetch(\`https://fakestoreapi.com/products/\${id}\`, {
    next: { revalidate: 60 },
  });
  const product: Product = await res.json();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <p className="text-2xl text-green-600 mt-2">\${product.price}</p>
    </div>
  );
}

// Optional: pre-render a known set of IDs at build time.
export async function generateStaticParams() {
  const products: Product[] = await fetch("https://fakestoreapi.com/products")
    .then((r) => r.json());
  return products.map((p) => ({ id: String(p.id) }));
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Can I mix Server and Client Components in the same file?",
        np: "एउटै file मा Server र Client?",
        jp: "同じファイルに Server と Client を混在できる？",
      },
      answer: {
        en: "Not exactly. A file is either a Server Component (no directive) or a Client Component (`'use client'`). However, a Server Component file can **import** a Client Component and render it in its JSX — the two files collaborate. The key rule: `'use client'` marks a boundary — that file and everything it imports is part of the client bundle.",
        np: "File या त Server या Client। तर Server Component file ले Client Component import/render गर्न सक्छ। `'use client'` boundary को रूपमा काम गर्छ।",
        jp: "ファイル単位で Server か Client か決まります。ただし Server Component ファイルが Client Component をインポートして render することは可能。`'use client'` はバンドル境界を示します。",
      },
    },
    {
      question: {
        en: "Why can't I use `useState` in a Server Component?",
        np: "Server Component मा `useState` किन?",
        jp: "Server Component で `useState` が使えないのはなぜ？",
      },
      answer: {
        en: "`useState` manages state in the browser between renders — it is fundamentally a client-side concept tied to a running browser instance. Server Components run once on the server and produce HTML; there is no persistent React instance to hold state between user interactions. If you need state, either move the component to a Client Component or hoist the state to a Client Component wrapper and pass down static data as props.",
        np: "`useState` browser instance को state — server मा persistent instance छैन। State चाहिए भए Client Component बनाउनुहोस् वा Client wrapper मा hoist।",
        jp: "`useState` はブラウザのランニングインスタンスに紐づく概念です。Server Component はサーバーで一度実行されるだけなので、永続インスタンスがありません。",
      },
    },
    {
      question: {
        en: "Does `fetch` caching apply to database queries too?",
        np: "DB query मा पनि `fetch` caching?",
        jp: "DB クエリにも `fetch` キャッシュは効く？",
      },
      answer: {
        en: "No. The `cache` option on `fetch()` only applies to HTTP requests made through the built-in `fetch`. If you use **Prisma**, **Drizzle**, a raw database driver, or any other non-`fetch` data source, the request is not cached by Next.js automatically. Use `unstable_cache` from `next/cache` (or the new `use cache` directive in Next.js 15 canary) to cache the results of arbitrary async functions including database queries.",
        np: "`fetch()` HTTP request मात्र। Prisma/Drizzle/raw DB — cache हुँदैन। `unstable_cache` वा `use cache` directive प्रयोग।",
        jp: "`fetch()` の cache は HTTP リクエストのみ。Prisma や raw DB クライアントには効きません。任意の非同期関数は `unstable_cache` または `use cache` でキャッシュします。",
      },
    },
    {
      question: {
        en: "What automatically triggers dynamic rendering?",
        np: "Dynamic rendering स्वत: कहिले हुन्छ?",
        jp: "dynamic レンダリングが自動的にトリガーされるのはいつ？",
      },
      answer: {
        en: "Calling any of these functions in a Server Component (anywhere in the render tree) opts the route into dynamic rendering: `cookies()`, `headers()`, `searchParams` (the page prop), `connection()`, `unstable_noStore()`, and any `fetch()` with `cache: 'no-store'`. This is called **dynamic APIs** in the Next.js docs. You do not need to configure anything extra — Next.js detects them at build time.",
        np: "`cookies()`, `headers()`, `searchParams`, `no-store` fetch — dynamic APIs। Build time मा Next.js ले detect गर्छ।",
        jp: "`cookies()`・`headers()`・`searchParams`・`no-store` の fetch などの dynamic API を使うと、Next.js がビルド時に検出し自動的に dynamic になります。",
      },
    },
    {
      question: {
        en: "How is ISR different from on-demand revalidation?",
        np: "ISR र on-demand revalidation मा के फरक?",
        jp: "ISR とオンデマンド再検証の違いは？",
      },
      answer: {
        en: "**ISR** (`next: { revalidate: N }`) uses time-based expiry: the cached page is served until `N` seconds have elapsed, then a background request rebuilds it for the next visitor. **On-demand revalidation** (`revalidatePath()` / `revalidateTag()` from `next/cache`) lets you purge a specific cached page instantly — for example, from a webhook when a CMS publishes new content. On-demand is more precise but requires an external trigger; ISR is automatic but has a staleness window.",
        np: "ISR = time-based (N seconds पछि rebuild)। On-demand = `revalidatePath()`/`revalidateTag()` — webhook बाट तुरुन्तै purge। On-demand सटीक तर external trigger चाहिन्छ।",
        jp: "ISR は時間経過で再ビルド。On-demand は `revalidatePath()` / `revalidateTag()` で即時パージ。CMS webhook など外部トリガーが必要ですが正確です。",
      },
    },
    {
      question: {
        en: "Is React Context API usable on the server?",
        np: "Server मा React Context?",
        jp: "サーバーで React Context は使える？",
      },
      answer: {
        en: "No. React Context depends on a running React tree in the browser (or during SSR hydration). Server Components do not have a React context tree in the same sense — they run in isolation per request. If you need to pass data across many Server Components, use function arguments or fetch the same data in multiple places (Next.js deduplicates identical `fetch()` calls automatically within a request). Context providers must live in Client Components.",
        np: "React Context browser React tree चाहिन्छ। Server Component isolation मा चल्छ — Context छैन। Data pass गर्न function argument वा multiple fetch (Next.js dedup गर्छ)। Context Provider Client Component मा।",
        jp: "React Context はブラウザの React ツリーが必要です。Server Component はリクエストごとに独立して実行されます。データを渡すには関数引数か複数 fetch（同一リクエスト内は自動重複排除）を使い、Context Provider は Client に置きます。",
      },
    },
  ],
  bullets: [
    {
      en: "Build a page that fetches data in a Server Component and passes it as props to an interactive Client Component child.",
      np: "Server Component मा data fetch गरी Client Component child मा props पठाउनुहोस्।",
      jp: "Server Component でデータを取得し、Client Component の子に props で渡すページを作る。",
    },
    {
      en: "Experiment with all three `fetch` cache options — use the Network tab in DevTools to confirm which requests hit the server on each page load.",
      np: "तीनवटा cache option try गर्नुहोस् — DevTools Network tab मा confirm।",
      jp: "3 種の cache オプションを試し、DevTools の Network タブで実際のリクエストを確認する。",
    },
    {
      en: "Add `console.log('rendered')` inside a Server Component and a Client Component — observe where each log appears (terminal vs browser console).",
      np: "Server र Client दुवैमा `console.log` राखी log कहाँ देखिन्छ (terminal vs browser) जाँच।",
      jp: "Server と Client それぞれに `console.log` を入れ、ログがターミナルとブラウザのどちらに出るか確認する。",
    },
  ],
};
