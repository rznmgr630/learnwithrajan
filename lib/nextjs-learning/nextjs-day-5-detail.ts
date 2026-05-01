import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_5_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Next.js provides file-based conventions for navigating between routes, showing loading skeletons, handling missing pages, and catching unexpected errors — all without extra libraries. The **`<Link>`** component handles client-side transitions with prefetching; **`useRouter`** handles imperative navigation; and special files **`loading.tsx`**, **`not-found.tsx`**, and **`error.tsx`** wire up the remaining UX concerns automatically.",
      np: "Next.js मा `<Link>`, `useRouter`, `loading.tsx`, `not-found.tsx`, र `error.tsx` ले नेभिगेशन र UI सम्बन्धित सबै काम गर्छन्।",
      jp: "Next.js では `<Link>`、`useRouter`、`loading.tsx`、`not-found.tsx`、`error.tsx` がナビゲーションと UI の主要な関心事をカバーします。",
    },
  ],
  sections: [
    {
      title: {
        en: "Link & active navigation",
        np: "Link र active navigation",
        jp: "Link とアクティブナビゲーション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The **`<Link>`** component from `next/link` renders a standard `<a>` tag but intercepts clicks to perform a client-side transition — no full page reload. In production it **prefetches** linked pages when they enter the viewport (or on hover in development). Use **`usePathname()`** from `next/navigation` to detect the current route and apply active styles.",
            np: "`next/link` को `<Link>` ले client-side transition गर्छ र production मा prefetch पनि। `usePathname()` ले active link थाहा पाउन मद्दत गर्छ।",
            jp: "`next/link` の `<Link>` はクライアント遷移とプリフェッチを行います。`usePathname()` でアクティブリンクを検出できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/components/NavBar.tsx — Link with active class",
            np: "Link र active class",
            jp: "Link とアクティブクラスの例",
          },
          code: `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 p-4 border-b">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={
            pathname === href
              ? "font-semibold text-blue-600 underline"
              : "text-gray-600 hover:text-blue-500"
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`href`** accepts a string or a URL object `{ pathname, query }`.",
              np: "`href` string वा URL object हुन सक्छ।",
              jp: "`href` は文字列または URL オブジェクトを受け付けます。",
            },
            {
              en: "**`replace`** prop replaces the history stack entry instead of pushing.",
              np: "`replace` ले history push गर्दैन, बदल्छ।",
              jp: "`replace` を使うと history にプッシュせず置き換えます。",
            },
            {
              en: "**`scroll={false}`** prevents scrolling to the top on navigation.",
              np: "`scroll={false}` ले नेभिगेशनमा माथि scroll गर्दैन।",
              jp: "`scroll={false}` でナビゲーション時のトップスクロールを無効化。",
            },
            {
              en: "**`prefetch={false}`** disables the automatic prefetch for a specific link.",
              np: "`prefetch={false}` ले auto-prefetch बन्द गर्छ।",
              jp: "`prefetch={false}` で特定リンクの自動プリフェッチを無効化。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Programmatic navigation",
        np: "प्रोग्रामेटिक नेभिगेशन",
        jp: "プログラムによるナビゲーション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`useRouter()`** from `next/navigation` provides imperative navigation for Client Components. Use it after form submission, authentication checks, or timer-based redirects. **`router.push()`** navigates and adds to the history stack; **`router.replace()`** replaces the current entry; **`router.back()`** mirrors the browser back button; **`router.refresh()`** re-fetches server data for the current route without a full reload.",
            np: "`useRouter()` ले Client Component भित्र imperative navigation दिन्छ — form submit पछि, auth check, timer redirect आदिमा।",
            jp: "`useRouter()` はフォーム送信後や認証チェック後の命令的ナビゲーションに使います。",
          },
        },
        {
          type: "code",
          title: {
            en: "useRouter — push, replace, back, refresh",
            np: "useRouter उदाहरण",
            jp: "useRouter の使用例",
          },
          code: `"use client";

import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      // Push adds to history — user can go back
      router.push("/dashboard");
    } else {
      // Replace avoids leaving the failed login in history
      router.replace("/login?error=credentials");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Log in</button>
      <button type="button" onClick={() => router.back()}>
        Cancel
      </button>
    </form>
  );
}`,
        },
        {
          type: "code",
          title: {
            en: "Server-side redirect (Server Actions / Route Handlers)",
            np: "Server-side redirect",
            jp: "サーバーサイドリダイレクト",
          },
          code: `// Server Component or Server Action — no "use client" needed
import { redirect } from "next/navigation";

export async function requireAuth(userId: string | null) {
  if (!userId) {
    redirect("/login"); // throws internally, stops execution
  }
}`,
        },
      ],
    },
    {
      title: {
        en: "Loading UI & Suspense",
        np: "Loading UI र Suspense",
        jp: "ローディング UI と Suspense",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Create a **`loading.tsx`** file in any route segment folder. Next.js automatically wraps that segment's `page.tsx` in a **React Suspense** boundary and shows your loading UI while the page data fetches. This gives users instant visual feedback and is the recommended way to build skeleton screens for async Server Components.",
            np: "`loading.tsx` फाइल राख्नाले Next.js ले segment लाई Suspense मा बेर्छ र data fetch हुँदासम्म loading UI देखाउँछ।",
            jp: "`loading.tsx` を置くと Next.js がそのセグメントを Suspense で包み、データ取得中にローディング UI を表示します。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/products/loading.tsx — skeleton screen",
            np: "loading.tsx skeleton उदाहरण",
            jp: "loading.tsx スケルトン画面の例",
          },
          code: `// No "use client" needed — loading.tsx can be a Server Component
export default function ProductsLoading() {
  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg bg-gray-200 h-48" />
      ))}
    </div>
  );
}`,
        },
        {
          type: "code",
          title: {
            en: "Granular Suspense — wrap individual slow components",
            np: "Granular Suspense उदाहरण",
            jp: "個別コンポーネントへの Suspense 適用",
          },
          code: `import { Suspense } from "react";
import ProductList from "./ProductList";
import ReviewsSidebar from "./ReviewsSidebar";

export default function ProductsPage() {
  return (
    <div className="flex gap-8">
      {/* Each boundary shows its own fallback independently */}
      <Suspense fallback={<p>Loading products…</p>}>
        <ProductList />
      </Suspense>
      <Suspense fallback={<p>Loading reviews…</p>}>
        <ReviewsSidebar />
      </Suspense>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Not Found & error boundaries",
        np: "Not Found र error boundaries",
        jp: "Not Found とエラー境界",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Place a **`not-found.tsx`** file in a segment to customise the 404 UI. Call **`notFound()`** (imported from `next/navigation`) inside a Server Component to trigger it — for example when a database record is missing. For runtime exceptions, place an **`error.tsx`** file; it **must** be a Client Component because it receives `error` and `reset` props from React's error boundary. For errors in the root layout, use `app/global-error.tsx`.",
            np: "`not-found.tsx` ले 404 UI दिन्छ; `notFound()` call गरेर trigger हुन्छ। `error.tsx` Client Component हो र runtime error समात्छ।",
            jp: "`not-found.tsx` で 404 UI をカスタマイズ。`notFound()` を呼ぶと表示されます。`error.tsx` はクライアントコンポーネントで runtime エラーを捕捉します。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/products/[id]/page.tsx — calling notFound()",
            np: "notFound() call उदाहरण",
            jp: "notFound() の呼び出し例",
          },
          code: `import { notFound } from "next/navigation";
import { getProduct } from "@/lib/db";

interface Props {
  params: { id: string };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(Number(params.id));

  if (!product) {
    notFound(); // renders the nearest not-found.tsx
  }

  return <h1>{product.name}</h1>;
}`,
        },
        {
          type: "code",
          title: {
            en: "app/products/[id]/not-found.tsx — custom 404 page",
            np: "not-found.tsx उदाहरण",
            jp: "not-found.tsx のカスタム 404",
          },
          code: `import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-4">
      <h2 className="text-2xl font-bold">Product not found</h2>
      <p className="text-gray-500">
        The product you are looking for does not exist or has been removed.
      </p>
      <Link href="/products" className="text-blue-600 underline">
        Back to Products
      </Link>
    </div>
  );
}`,
        },
        {
          type: "code",
          title: {
            en: "app/products/error.tsx — segment-level error boundary",
            np: "error.tsx Client Component उदाहरण",
            jp: "error.tsx セグメントレベルのエラー境界",
          },
          code: `"use client"; // MUST be a Client Component

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductsError({ error, reset }: Props) {
  useEffect(() => {
    // Log to your error tracking service (Sentry, etc.)
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-xl font-semibold text-red-600">
        Something went wrong!
      </h2>
      <p className="text-gray-500 text-sm">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}`,
        },
        {
          type: "code",
          title: {
            en: "app/global-error.tsx — root layout error handler",
            np: "global-error.tsx उदाहरण",
            jp: "global-error.tsx ルートレイアウト用",
          },
          code: `"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error.tsx replaces the root layout, so include html/body
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-3xl font-bold">Application Error</h1>
          <p>{error.message}</p>
          <button onClick={reset}>Reload</button>
        </div>
      </body>
    </html>
  );
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Each route segment can have its own `error.tsx` — errors bubble up to the nearest boundary.",
              np: "हरेक segment मा आफ्नै `error.tsx` हुन सक्छ; error नजिकको boundary सम्म bubble up गर्छ।",
              jp: "各セグメントに `error.tsx` を置けます。エラーは最も近い境界まで伝播します。",
            },
            {
              en: "**`error.tsx`** does NOT catch errors thrown in `layout.tsx` of the same folder — use the parent segment's error file or a higher boundary.",
              np: "सोही folder को `layout.tsx` को error `error.tsx` ले समात्दैन — माथिको boundary चाहिन्छ।",
              jp: "同じフォルダの `layout.tsx` のエラーは `error.tsx` では捕捉できません。親セグメントのファイルを使います。",
            },
            {
              en: "`global-error.tsx` replaces the root layout, so it must include `<html>` and `<body>` tags.",
              np: "`global-error.tsx` ले root layout लाई replace गर्छ, `html` र `body` tag चाहिन्छ।",
              jp: "`global-error.tsx` はルートレイアウトを置き換えるため `<html>` と `<body>` が必要です。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between `<Link>` and a plain `<a>` tag?",
        np: "`<Link>` र `<a>` मा के फरक छ?",
        jp: "`<Link>` と普通の `<a>` タグの違いは？",
      },
      answer: {
        en: "A plain `<a>` tag triggers a **full page reload**, discarding all React state and re-downloading the entire page bundle. `<Link>` performs a **client-side transition** — only the changed route segment data is fetched, React state in shared layouts is preserved, and in production the target page is **prefetched** in the background so navigation feels instant.",
        np: "साधारण `<a>` ले full page reload गर्छ। `<Link>` ले client-side transition गर्छ — layout state सुरक्षित रहन्छ र production मा target prefetch हुन्छ।",
        jp: "通常の `<a>` はフルリロードします。`<Link>` はクライアント遷移のみで、共有レイアウトの状態を維持し、本番ではプリフェッチも行います。",
      },
    },
    {
      question: {
        en: "Can I prefetch a page programmatically without rendering a Link?",
        np: "Link बिना programmatically prefetch गर्न सकिन्छ?",
        jp: "Link を使わずプログラムでプリフェッチできますか？",
      },
      answer: {
        en: "Yes — call **`router.prefetch('/target-path')`** from `useRouter()`. This is useful for hover handlers on custom button components or when you want to warm up a route before the user explicitly navigates there. Note that `prefetch` is a best-effort call; Next.js may ignore it in low-connectivity conditions.",
        np: "`useRouter()` बाट `router.prefetch('/path')` call गर्न सकिन्छ। Custom button वा hover handler मा उपयोगी।",
        jp: "`useRouter()` から `router.prefetch('/path')` を呼べます。カスタムボタンのホバー処理などに有効です。",
      },
    },
    {
      question: {
        en: "Does `loading.tsx` work with Server Actions?",
        np: "`loading.tsx` Server Actions सँग काम गर्छ?",
        jp: "`loading.tsx` は Server Actions と連携しますか？",
      },
      answer: {
        en: "`loading.tsx` handles **page-level data loading** (the initial render of a route segment), not the pending state of a Server Action. For Server Actions use **`useFormStatus()`** (from `react-dom`) or the `useTransition` hook to show a spinner or disable buttons while the action is in flight.",
        np: "`loading.tsx` page render को लागि हो। Server Action को pending state को लागि `useFormStatus()` वा `useTransition` प्रयोग गर्नुहोस्।",
        jp: "`loading.tsx` はページレベルのデータ読み込み用です。Server Action の pending 状態には `useFormStatus()` や `useTransition` を使います。",
      },
    },
    {
      question: {
        en: "How do I test error boundaries locally?",
        np: "Error boundaries locally कसरी test गर्ने?",
        jp: "ローカルでエラー境界をテストするには？",
      },
      answer: {
        en: "In development, Next.js shows a full-screen error overlay on top of your `error.tsx`. To see your custom UI, dismiss the overlay with the X button or press Escape. You can also temporarily throw an error in a component (e.g. `throw new Error('test')`) or write a unit test with **React Testing Library** and `ErrorBoundary`. In production builds the overlay is absent and only your `error.tsx` renders.",
        np: "Development मा overlay देखिन्छ — X वा Escape ले बन्द गर्नुहोस् आफ्नो UI हेर्न। Component मा `throw new Error('test')` गर्दा पनि काम गर्छ।",
        jp: "開発中はエラーオーバーレイが表示されます。X か Escape で閉じると自分の UI が見えます。コンポーネント内で `throw new Error('test')` しても確認できます。",
      },
    },
    {
      question: {
        en: "When should I use `global-error.tsx` vs a segment-level `error.tsx`?",
        np: "`global-error.tsx` vs segment-level `error.tsx` कहिले प्रयोग गर्ने?",
        jp: "`global-error.tsx` とセグメントレベルの `error.tsx` の使い分けは？",
      },
      answer: {
        en: "Use **segment-level** `error.tsx` files in specific route folders (e.g. `app/dashboard/error.tsx`) to show contextual recovery UI without breaking the entire shell (navigation, sidebar, etc. remain visible). Reserve **`global-error.tsx`** for catastrophic errors in the root layout or root providers that prevent the shell from rendering at all — it must include `<html>` and `<body>` since it completely replaces the layout.",
        np: "Segment-level `error.tsx` ले partial recovery दिन्छ — navigation intact रहन्छ। `global-error.tsx` root layout crash भएमा मात्र प्रयोग गर्नुहोस्।",
        jp: "セグメントレベルの `error.tsx` はナビゲーションを残しながら部分復帰を提供します。`global-error.tsx` はルートレイアウトが壊れた場合の最後の手段です。",
      },
    },
    {
      question: {
        en: "Does calling `notFound()` count as throwing an exception?",
        np: "`notFound()` throw जस्तै हो?",
        jp: "`notFound()` は例外を throw しますか？",
      },
      answer: {
        en: "Internally **`notFound()`** throws a special Next.js signal that bypasses the normal `error.tsx` boundary and instead renders the nearest `not-found.tsx`. This means you should not wrap `notFound()` calls in a `try/catch` block — doing so would swallow the signal and the not-found page would never render.",
        np: "`notFound()` भित्री रूपमा throw गर्छ तर `error.tsx` bypass गर्छ — `not-found.tsx` रेन्डर हुन्छ। `try/catch` मा नराख्नुहोस्।",
        jp: "`notFound()` は内部的に throw しますが `error.tsx` をバイパスして `not-found.tsx` を表示します。`try/catch` で囲まないでください。",
      },
    },
  ],
};
