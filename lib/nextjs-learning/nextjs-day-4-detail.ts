import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_4_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "The App Router uses the file system as the routing API. Special filenames — `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` — tell Next.js exactly what to render for each URL, error state, and loading boundary. Learning these conventions is the foundation of all routing in Next.js.",
      np: "App Router file system routing — `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` जस्ता special filenames। यो convention नै routing को base।",
      jp: "App Router はファイルシステムをルーティング API として使います。`page.tsx`・`layout.tsx` などの特殊ファイルが URL・エラー・ローディングをそれぞれ制御します。",
    },
    {
      en: "Beyond static paths, you will use **dynamic segments** (`[id]`), **catch-all routes** (`[...slug]`), **query string parameters** (`searchParams`), and **nested layouts** to build real-world apps with product pages, admin sections, and paginated lists.",
      np: "Dynamic `[id]`, catch-all `[...slug]`, query `searchParams`, nested layouts — real app को लागि आवश्यक।",
      jp: "動的セグメント・キャッチオール・クエリパラメータ・ネストレイアウトで実際のアプリを構築します。",
    },
  ],
  sections: [
    {
      title: {
        en: "Route file conventions overview",
        np: "Route file conventions",
        jp: "ルートファイル規約の概要",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Next.js recognises specific filenames inside each `app/` segment folder. Most are optional — you only create the ones you need. The most important is `page.tsx`, which makes the folder a publicly accessible route. Everything else handles UI states around that page.",
            np: "Next.js ले special filename चिन्छ — `page.tsx` मात्र अनिवार्य। बाँकी UI state को लागि optional।",
            jp: "Next.js は各フォルダ内の特殊ファイル名を認識します。必須は `page.tsx` のみで、他は UI の状態に応じて追加します。",
          },
        },
        {
          type: "table",
          caption: {
            en: "App Router special file conventions",
            np: "App Router special files",
            jp: "App Router の特殊ファイル一覧",
          },
          headers: [
            { en: "File", np: "File", jp: "ファイル" },
            { en: "Purpose", np: "उद्देश्य", jp: "目的" },
            { en: "Notes", np: "टिप्पणी", jp: "備考" },
          ],
          rows: [
            [
              { en: "page.tsx", np: "page.tsx", jp: "page.tsx" },
              { en: "Makes the folder a public URL route", np: "Public URL route", jp: "公開 URL ルートにする" },
              { en: "Required for the route to exist", np: "Route को लागि अनिवार्य", jp: "ルート存在に必須" },
            ],
            [
              { en: "layout.tsx", np: "layout.tsx", jp: "layout.tsx" },
              { en: "Shared UI wrapper for the segment and all its children", np: "Segment र children को wrapper", jp: "セグメントと子の共通 UI ラッパー" },
              { en: "Persists across navigations (not unmounted)", np: "Navigation मा unmount हुँदैन", jp: "ナビゲーション間で維持される" },
            ],
            [
              { en: "loading.tsx", np: "loading.tsx", jp: "loading.tsx" },
              { en: "Suspense fallback shown while the page is streaming", np: "Page stream हुँदा देखिने fallback", jp: "ページのストリーミング中に表示" },
              { en: "Auto-wraps page in React Suspense", np: "Suspense मा auto-wrap", jp: "自動で Suspense に包まれる" },
            ],
            [
              { en: "error.tsx", np: "error.tsx", jp: "error.tsx" },
              { en: "Error boundary UI for runtime errors in the segment", np: "Runtime error को UI", jp: "セグメントのランタイムエラー UI" },
              { en: "Must be a Client Component ('use client')", np: "'use client' अनिवार्य", jp: "Client Component 必須" },
            ],
            [
              { en: "not-found.tsx", np: "not-found.tsx", jp: "not-found.tsx" },
              { en: "UI shown when notFound() is called or no route matches", np: "`notFound()` वा route match नभए", jp: "`notFound()` 呼び出しや一致なしで表示" },
              { en: "Can be segment-scoped", np: "Segment-specific हुन सक्छ", jp: "セグメントごとに定義可能" },
            ],
            [
              { en: "template.tsx", np: "template.tsx", jp: "template.tsx" },
              { en: "Like layout.tsx but re-mounts on every navigation", np: "Layout जस्तै तर हर navigation मा re-mount", jp: "layout.tsx と同様だがナビごとに再マウント" },
              { en: "Useful for per-route animations or analytics", np: "Animation/analytics को लागि", jp: "ページごとのアニメーションや分析に便利" },
            ],
            [
              { en: "route.ts", np: "route.ts", jp: "route.ts" },
              { en: "API endpoint (GET, POST, etc.) — no JSX returned", np: "API endpoint — JSX फर्काउँदैन", jp: "API エンドポイント（JSX を返さない）" },
              { en: "Cannot coexist with page.tsx in the same folder", np: "page.tsx सँग एउटै folder मा हुँदैन", jp: "同フォルダに page.tsx と共存不可" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "loading.tsx and error.tsx — minimal implementations",
            np: "loading.tsx र error.tsx — minimal",
            jp: "loading.tsx と error.tsx の最小実装",
          },
          code: `// app/products/loading.tsx
// Automatically shown while ProductsPage is fetching data.
export default function ProductsLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <span className="loading loading-spinner loading-lg" />
    </div>
  );
}

// app/products/error.tsx
// MUST be a Client Component — it needs the 'reset' callback from React.
"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductsError({ error, reset }: Props) {
  useEffect(() => {
    // Log to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 py-20">
      <h2 className="text-xl font-semibold">Something went wrong!</h2>
      <p className="text-gray-500">{error.message}</p>
      <button className="btn btn-primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Dynamic & catch-all routes",
        np: "Dynamic र catch-all routes",
        jp: "動的ルートとキャッチオールルート",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Dynamic segments** are folder names wrapped in square brackets: `[id]`. The segment value is available via the `params` prop in `page.tsx`. In Next.js 15, `params` is a **Promise** — you must `await` it before accessing properties.",
            np: "Square bracket `[id]` — dynamic segment। `params` prop मा value। Next.js 15 मा `params` Promise — `await` गर्नुहोस्।",
            jp: "角括弧で囲んだフォルダ名が動的セグメント。`params` プロップで値を取得します。Next.js 15 では `params` は Promise なので `await` が必要です。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/products/[id]/page.tsx — single dynamic segment",
            np: "Single dynamic segment",
            jp: "単一動的セグメントの例",
          },
          code: `// app/products/[id]/page.tsx
// URL: /products/42  →  params.id = "42"

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params; // ← await required in Next.js 15

  const res = await fetch(\`https://fakestoreapi.com/products/\${id}\`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    // Render the nearest not-found.tsx boundary
    import { notFound } from "next/navigation";
    notFound();
  }

  const product = await res.json();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <p className="text-xl text-green-600">\${product.price}</p>
    </main>
  );
}`,
        },
        {
          type: "code",
          title: {
            en: "Nested dynamic segments — products/[productId]/reviews/[reviewId]",
            np: "Nested dynamic segments",
            jp: "ネストした動的セグメントの例",
          },
          code: `// app/products/[productId]/reviews/[reviewId]/page.tsx
// URL: /products/5/reviews/3  →  params = { productId: "5", reviewId: "3" }

interface Props {
  params: Promise<{ productId: string; reviewId: string }>;
}

export default async function ReviewPage({ params }: Props) {
  const { productId, reviewId } = await params;

  return (
    <div className="p-8">
      <p className="text-sm text-gray-500">
        Product #{productId} — Review #{reviewId}
      </p>
      <h1 className="mt-2 text-2xl font-bold">Review Details</h1>
    </div>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Catch-all segments** use `[...slug]` to match any number of path segments. `params.slug` is always an array of strings. The **optional catch-all** variant `[[...slug]]` also matches the base path with no extra segments (where `slug` is `undefined` or an empty array).",
            np: "`[...slug]` — zero वा बढी segment match। `params.slug` array। `[[...slug]]` — base path पनि match (optional)।",
            jp: "`[...slug]` は任意数のセグメントを配列で受け取ります。`[[...slug]]` はベースパスも含めてオプションでマッチします。",
          },
        },
        {
          type: "code",
          title: {
            en: "Catch-all routes — [...slug] vs [[...slug]]",
            np: "Catch-all routes",
            jp: "キャッチオールルートの比較",
          },
          code: `// app/docs/[...slug]/page.tsx
// Matches: /docs/intro, /docs/api/fetch, /docs/guide/routing/advanced
// Does NOT match: /docs  (base path only — use [[...slug]] for that)

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function DocsPage({ params }: Props) {
  const { slug } = await params;
  // slug = ["api", "fetch"]  for URL /docs/api/fetch

  return (
    <div className="p-8">
      <p className="text-sm text-gray-500">
        Path: /docs/{slug.join("/")}
      </p>
      <h1 className="text-2xl font-bold">
        {slug[slug.length - 1]} {/* last segment as title */}
      </h1>
    </div>
  );
}

// app/docs/[[...slug]]/page.tsx
// Optional catch-all — ALSO matches /docs (slug is undefined or [])

interface OptionalProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function DocsRootPage({ params }: OptionalProps) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return <h1>Docs Home</h1>;
  }

  return (
    <div>
      <h1>Doc: {slug.join(" / ")}</h1>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Query string parameters",
        np: "Query string parameters",
        jp: "クエリ文字列パラメータ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Query string parameters (the `?key=value` part of a URL) are available in `page.tsx` via the `searchParams` prop. In Next.js 15, `searchParams` is also a **Promise** — await it before use. Using `searchParams` opts the page into **dynamic rendering** automatically because the values are request-specific.",
            np: "Query params `searchParams` prop — Next.js 15 मा Promise, `await` गर्नुहोस्। `searchParams` प्रयोगले route dynamic बनाउँछ।",
            jp: "クエリパラメータは `searchParams` プロップで取得します。Next.js 15 では Promise です。使うとルートが自動的に dynamic になります。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/products/page.tsx — sort and pagination via searchParams",
            np: "searchParams — sort र pagination",
            jp: "searchParams でソートとページネーション",
          },
          code: `// app/products/page.tsx
// URL: /products?sort=price&page=2

interface Props {
  searchParams: Promise<{
    sort?: string;
    page?: string;
    q?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { sort = "name", page = "1", q = "" } = await searchParams;
  const pageNumber = parseInt(page, 10);

  // The values from searchParams are always strings — parse numbers explicitly.
  const res = await fetch(
    \`https://api.example.com/products?sort=\${sort}&page=\${pageNumber}&q=\${q}\`,
    { cache: "no-store" } // dynamic — depends on query params
  );
  const { products, totalPages } = await res.json();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Search form — navigates by changing the URL */}
      <form className="flex gap-2 mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search..."
          className="input input-bordered flex-1"
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {/* Sort links */}
      <div className="flex gap-2 mb-4">
        <a href={\`?sort=name&q=\${q}\`} className="btn btn-sm btn-ghost">By Name</a>
        <a href={\`?sort=price&q=\${q}\`} className="btn btn-sm btn-ghost">By Price</a>
      </div>

      <ul className="space-y-2">
        {products.map((p: { id: number; title: string }) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex gap-2 mt-6">
        {pageNumber > 1 && (
          <a href={\`?page=\${pageNumber - 1}&sort=\${sort}&q=\${q}\`} className="btn btn-sm">
            Previous
          </a>
        )}
        {pageNumber < totalPages && (
          <a href={\`?page=\${pageNumber + 1}&sort=\${sort}&q=\${q}\`} className="btn btn-sm">
            Next
          </a>
        )}
      </div>
    </main>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Layouts — nested and root",
        np: "Layouts — nested र root",
        jp: "レイアウト：ルートとネスト",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**The root layout** (`app/layout.tsx`) is the only required layout — it must return `<html>` and `<body>` elements. Every page in your application renders inside this layout's `{children}`. It is a Server Component and is an ideal place for global providers, the global nav, and fonts.",
            np: "Root layout `app/layout.tsx` — `<html>` र `<body>` अनिवार्य। हर page `{children}` मा render। Global nav, providers, fonts राख्ने ठाउँ।",
            jp: "ルートレイアウト `app/layout.tsx` は `<html>` と `<body>` が必須。すべてのページが `{children}` に入ります。グローバルナビやフォントの設置場所として最適です。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/layout.tsx — production-ready root layout",
            np: "Root layout — production-ready",
            jp: "本番向けルートレイアウト",
          },
          code: `// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

// Static metadata for the whole app (individual pages can override)
export const metadata: Metadata = {
  title: {
    default: "My Store",
    template: "%s | My Store", // e.g. "Product Name | My Store"
  },
  description: "The best store on the internet.",
  openGraph: {
    siteName: "My Store",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[geistSans.variable, geistMono.variable].join(" ")}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <footer className="border-t py-8 text-center text-sm text-gray-500">
          © 2025 My Store
        </footer>
      </body>
    </html>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Nested layouts** are created by adding a `layout.tsx` inside any sub-folder. The nested layout receives `children` which includes the page or further nested layouts below it. Layouts **stack automatically** — the root layout always wraps everything, then segment layouts wrap their subtree on top of that. Layouts share state across navigations within their segment (perfect for a sidebar that stays open).",
            np: "Sub-folder मा `layout.tsx` — nested layout। Automatically stack हुन्छ — root layout सबैभन्दा बाहिर। Navigation मा state share गर्छ (sidebar open रहन्छ)।",
            jp: "サブフォルダに `layout.tsx` を置くと自動でスタックされます。ルートレイアウトが最外層で、セグメントレイアウトがその上に重なります。同セグメント内の遷移では再マウントされません。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/dashboard/layout.tsx — nested layout with sidebar",
            np: "Nested layout — sidebar सहित",
            jp: "ネストレイアウト：サイドバー付き Dashboard",
          },
          code: `// app/dashboard/layout.tsx
// This wraps every page under /dashboard/*
// The root layout still wraps this layout.

import Link from "next/link";

const navLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — stays mounted across all /dashboard/* navigations */}
      <aside className="w-64 border-r bg-gray-50 p-6">
        <h2 className="mb-6 text-lg font-bold">Dashboard</h2>
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Page content renders here */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}`,
        },
        {
          type: "code",
          title: {
            en: "Dynamic metadata with generateMetadata",
            np: "Dynamic metadata — generateMetadata",
            jp: "generateMetadata で動的にメタデータを生成",
          },
          code: `// app/products/[id]/page.tsx
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

// This function generates metadata per page — called at request time (or build time for static routes).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetch(\`https://fakestoreapi.com/products/\${id}\`).then(
    (r) => r.json()
  );

  return {
    title: product.title,           // becomes "Product Title | My Store"
    description: product.description,
    openGraph: {
      title: product.title,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await fetch(\`https://fakestoreapi.com/products/\${id}\`).then(
    (r) => r.json()
  );
  // Note: Next.js deduplicates the fetch above — it only hits the network once.

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{product.title}</h1>
    </div>
  );
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Can a layout access the current URL / pathname?",
        np: "Layout मा current URL/pathname?",
        jp: "レイアウトで現在の URL・パスを取得できる？",
      },
      answer: {
        en: "Not directly in Server Component layouts — they do not receive the pathname as a prop. The standard pattern is to create a small `'use client'` component inside the layout that calls `usePathname()` from `next/navigation`. This component can then apply active styles, conditionally render elements, or track page views. The layout itself stays a Server Component and simply renders this Client Component as a child.",
        np: "Server Component layout ले pathname prop पाउँदैन। `usePathname()` भएको `'use client'` child component बनाउनुहोस् — layout Server Component नै रहन्छ।",
        jp: "Server Component のレイアウトは pathname を props で受け取りません。`usePathname()` を使う小さな Client Component を子として配置するのが標準パターンです。",
      },
    },
    {
      question: {
        en: "What is the difference between `params` and `searchParams`?",
        np: "`params` र `searchParams` मा के फरक?",
        jp: "`params` と `searchParams` の違いは？",
      },
      answer: {
        en: "`params` contains the values from **dynamic route segments** in the URL path — e.g. `/products/42` gives `{ id: '42' }` for `app/products/[id]/page.tsx`. `searchParams` contains the **query string** — everything after `?` in the URL, e.g. `/products?sort=price&page=2` gives `{ sort: 'price', page: '2' }`. Both are Promises in Next.js 15. `params` is available in layouts, pages, and `generateMetadata`. `searchParams` is only available in `page.tsx`, not layouts.",
        np: "`params` — URL path segment value (`[id]`). `searchParams` — `?` पछिको query string। दुवै Next.js 15 मा Promise। `searchParams` layout मा हुँदैन।",
        jp: "`params` は URL パスのセグメント値、`searchParams` は `?` 以降のクエリ文字列です。どちらも Next.js 15 では Promise。`searchParams` は `page.tsx` 専用でレイアウトでは使えません。",
      },
    },
    {
      question: {
        en: "How do I share state between a layout and its pages?",
        np: "Layout र page बीच state कसरी share?",
        jp: "レイアウトとページ間で state を共有するには？",
      },
      answer: {
        en: "Server Components (layouts included) cannot hold React state. The two recommended approaches are: (1) **URL state** — store the value in a query parameter and read it via `searchParams` in the page. This is shareable, bookmarkable, and works across navigations. (2) **React Context in a Client Component wrapper** — create a `'use client'` provider that wraps the layout's children. Any Client Component descendant can consume the context with `useContext`. Avoid storing application data in layout state — prefer URL state or a dedicated state library.",
        np: "Server Component layout state राख्न सक्दैन। URL state (query params) वा Client Component Context Provider — दुवै options। URL state bookmarkable र navigation-safe।",
        jp: "Server Component の layout は state を持てません。① URL にクエリパラメータとして入れる（ブックマーク可）② Client Component の Context Provider でラップする、が主な選択肢です。",
      },
    },
    {
      question: {
        en: "Can I have multiple root layouts?",
        np: "Multiple root layouts?",
        jp: "複数のルートレイアウトを持てる？",
      },
      answer: {
        en: "Yes — this is called a **route group** layout. By creating multiple `(groupName)` folders at the top of `app/`, each group can have its own `layout.tsx` that acts as its local root layout with its own `<html>` and `<body>`. This is useful when you want completely different shells — for example, a marketing site with a public nav and an `(app)` group with an authenticated sidebar, each with different fonts or themes. Route groups do not add a URL segment, so `/pricing` stays `/pricing` even if the file is at `app/(marketing)/pricing/page.tsx`.",
        np: "Route groups — `(marketing)`, `(app)` — प्रत्येकको छुट्टै layout। URL segment थपिँदैन। Marketing nav र authenticated sidebar फरक shell।",
        jp: "ルートグループ `(name)` を使えば、グループごとに独立した layout.tsx（`<html>` と `<body>` 含む）を持てます。URL セグメントは追加されません。",
      },
    },
    {
      question: {
        en: "What does `generateStaticParams` do for dynamic routes?",
        np: "`generateStaticParams` dynamic route को लागि के गर्छ?",
        jp: "動的ルートで `generateStaticParams` は何をする？",
      },
      answer: {
        en: "`generateStaticParams` is an async function exported from a dynamic segment's `page.tsx`. It returns an array of param objects — one per page you want to pre-render at build time. For `app/products/[id]/page.tsx`, returning `[{ id: '1' }, { id: '2' }]` tells Next.js to build `/products/1` and `/products/2` as static HTML at build time. Without it, the pages are still served (Next.js renders them on first request and then caches them), but they are not pre-built. This is the App Router equivalent of `getStaticPaths` from the Pages Router.",
        np: "`generateStaticParams` ले build time मा pre-render गर्ने param array return गर्छ। Pages Router को `getStaticPaths` जस्तै। नभए first request मा render र cache।",
        jp: "`generateStaticParams` はビルド時に pre-render したい params の配列を返します。Pages Router の `getStaticPaths` に相当します。なければ初回リクエスト時にレンダーしてキャッシュします。",
      },
    },
  ],
  bullets: [
    {
      en: "Build a `/products/[id]` dynamic route — fetch product data by ID, add `generateStaticParams` for the first 10 products, and add a `not-found.tsx` for invalid IDs.",
      np: "`/products/[id]` route — data fetch, `generateStaticParams`, `not-found.tsx` सहित।",
      jp: "`/products/[id]` を作り、`generateStaticParams` で 10 件を静的生成し、無効 ID に `not-found.tsx` を表示する。",
    },
    {
      en: "Add a `/docs/[[...slug]]` optional catch-all route that renders a docs home when no slug is provided and the specific doc path otherwise.",
      np: "`[[...slug]]` optional catch-all — slug नभए home, भए specific doc।",
      jp: "`[[...slug]]` を作り、slug なしで docs ホーム、あればその記事を表示する。",
    },
    {
      en: "Create a `/products` listing page that reads `?sort=` and `?page=` from `searchParams` — wire up sort links and previous/next pagination entirely through URL changes.",
      np: "`searchParams` मा `sort` र `page` पढी sort links र pagination URL मार्फत।",
      jp: "`searchParams` で sort と page を読み取り、リンクだけで並び替えとページネーションを実装する。",
    },
  ],
};
