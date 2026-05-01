import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 15 — Routing with React Router v6: Navigation, Parameters & Guards. */
export const REACT_DAY_15_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 15 covers client-side routing with React Router v6: the shift from `BrowserRouter` to `createBrowserRouter`, route objects, nested routes with `<Outlet />`, `Link`/`NavLink`, programmatic navigation, route parameters with `useParams` and `useSearchParams`, passing state between pages with `useLocation`, protected routes, error pages, and the data-router additions (loaders and actions) introduced in v6.4.",
      np: "दिन १५ React Router v6: `createBrowserRouter`, route objects, nested routes, `<Outlet />`, Link/NavLink, navigate, useParams/useSearchParams, useLocation state, protected routes, errorElement, loader/action।",
      jp: "15日目は React Router v6 によるクライアントサイドルーティングを扱います。`createBrowserRouter`・ルートオブジェクト・ネストしたルート・`<Outlet />`・Link/NavLink・プログラムナビゲーション・useParams/useSearchParams・useLocation によるページ間データ受け渡し・保護ルート・エラーページ・v6.4 で追加された loader と action を学びます。",
    },
    {
      en: "The v6 data-router API (`createBrowserRouter` + `RouterProvider`) is the modern recommended approach; the classic `<BrowserRouter>` wrapper still works for simpler setups.",
      np: "`createBrowserRouter` + `RouterProvider` अहिलेको सिफारिस; `<BrowserRouter>` सरल परियोजनाका लागि ठीक छ।",
      jp: "データルーター API（`createBrowserRouter` + `RouterProvider`）が現在の推奨形式です。シンプルな構成では従来の `<BrowserRouter>` も引き続き使えます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Introduction — what is client-side routing?",
        np: "परिचय — client-side routing के हो?",
        jp: "イントロ — クライアントサイドルーティングとは",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Client-side routing intercepts URL changes in the browser and swaps components without a full page reload. The server serves one HTML shell; React owns the rest. React Router v6 made major API improvements over v5: declarative route objects instead of JSX routes, `<Outlet />` for nesting, relative paths, and in v6.4 a full data layer with loaders/actions.",
            np: "Client-side routing: browser मा URL परिवर्तन intercepted; full reload बिना component swap। React Router v6 ले v5 भन्दा route object, `<Outlet />`, relative path, v6.4 मा data layer ल्यायो।",
            jp: "クライアントサイドルーティングはブラウザの URL 変更を捕捉し、フルリロードなしにコンポーネントを切り替えます。サーバは HTML シェルだけ返し、あとは React が管理します。React Router v6 は v5 から大幅に改善され、ルートオブジェクト・`<Outlet />`・相対パス・v6.4 のデータ層が加わりました。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`createBrowserRouter` — the recommended v6.4+ API; unlocks loaders, actions, and `<Await>`.",
              np: "`createBrowserRouter` — v6.4+ सिफारिस; loaders/actions unlock।",
              jp: "`createBrowserRouter` — v6.4 以降の推奨 API。ローダー・アクション・`<Await>` が使える。",
            },
            {
              en: "`BrowserRouter` — the legacy wrapper pattern; fine for apps that do not need data APIs.",
              np: "`BrowserRouter` — पुरानो wrapper; data API नचाहिएको ठाउँमा ठीक।",
              jp: "`BrowserRouter` — 従来のラッパーパターン。データ API が不要なアプリには今でも問題ない。",
            },
            {
              en: "v5 → v6 breaking changes: no `<Switch>`, `exact` removed, `useHistory` → `useNavigate`, `<Redirect>` → `<Navigate>`.",
              np: "v5→v6: `<Switch>` हटाइयो, `exact` छैन, `useHistory`→`useNavigate`, `<Redirect>`→`<Navigate>`।",
              jp: "v5→v6 の破壊的変更: `<Switch>` 削除、`exact` 不要、`useHistory`→`useNavigate`、`<Redirect>`→`<Navigate>`。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Setting up routes with createBrowserRouter",
        np: "createBrowserRouter सँग routes सेटअप",
        jp: "createBrowserRouter によるルート設定",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Pass an array of route objects — each with `path` and `element` — to `createBrowserRouter`, then mount `<RouterProvider router={router} />` at the app root. Nested arrays under `children` define sub-routes rendered via `<Outlet />`.",
            np: "`createBrowserRouter` मा route object array; `<RouterProvider>` root मा mount; `children` ले sub-route।",
            jp: "`path` と `element` を持つルートオブジェクトの配列を `createBrowserRouter` に渡し、アプリルートに `<RouterProvider router={router} />` を置きます。`children` でサブルートを定義し `<Outlet />` で描画します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Full router setup — createBrowserRouter",
            np: "createBrowserRouter — पूर्ण router सेटअप",
            jp: "createBrowserRouter — ルート設定の全体",
          },
          code: `// src/router.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ErrorPage } from "./pages/ErrorPage";
import { productLoader } from "./loaders/productLoader";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
        loader: productLoader,
        errorElement: <ErrorPage />,
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);`,
        },
      ],
    },
    {
      title: {
        en: "Nested routes and <Outlet />",
        np: "Nested routes र <Outlet />",
        jp: "ネストルートと <Outlet />",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A parent route renders a layout component that includes `<Outlet />`. React Router renders the matching child route's element in place of `<Outlet />`. This lets you share navbars, sidebars, and breadcrumbs without repeating markup.",
            np: "Parent route → layout component + `<Outlet />`। Router ले child route element त्यहाँ render गर्छ। navbar/sidebar एकपटक लेख्नु।",
            jp: "親ルートはレイアウトコンポーネントを描画し、そこに `<Outlet />` を置きます。一致した子ルートの要素がそこに差し込まれます。ナビバーやサイドバーを一度だけ書けば済みます。",
          },
        },
        {
          type: "code",
          title: {
            en: "AppLayout with Outlet — shared navbar",
            np: "AppLayout — shared navbar",
            jp: "AppLayout — 共有ナビバーと Outlet",
          },
          code: `// src/layouts/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Child route element renders here */}
        <Outlet />
      </main>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Link, NavLink, and useNavigate",
        np: "Link, NavLink, useNavigate",
        jp: "Link・NavLink・useNavigate",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`<Link to=\"/path\">` renders an `<a>` tag that intercepts clicks to prevent full reloads. `<NavLink>` adds an `isActive` callback for styling the currently active item. `useNavigate()` returns a function for programmatic navigation — useful after form submissions or auth checks.",
            np: "`<Link>` → reload रोक्छ। `<NavLink>` → active styling। `useNavigate` → submit/auth पछि program ले navigate।",
            jp: "`<Link>` はクリックを横取りしてフルリロードを防ぎます。`<NavLink>` は `isActive` で現在のリンクにスタイルを付けられます。`useNavigate` はフォーム送信や認証チェック後にプログラムで遷移するために使います。",
          },
        },
        {
          type: "code",
          title: {
            en: "NavLink with active class",
            np: "NavLink — active class",
            jp: "NavLink — アクティブスタイル",
          },
          code: `// src/components/Navbar.tsx
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center gap-6">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-blue-600 border-b-2 border-blue-600 pb-1"
                : "text-gray-600 hover:text-blue-600 transition-colors"
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}`,
        },
        {
          type: "code",
          title: {
            en: "useNavigate — programmatic navigation after submit",
            np: "useNavigate — submit पछि navigate",
            jp: "useNavigate — 送信後のプログラムナビゲーション",
          },
          code: `import { useNavigate } from "react-router-dom";

export function CreateProductForm() {
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const product = Object.fromEntries(formData);

    await createProduct(product); // call your API
    navigate("/products", { replace: true }); // back to list
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Product name" required />
      <button type="submit">Create</button>
    </form>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Route parameters with useParams",
        np: "useParams सँग route parameters",
        jp: "useParams によるルートパラメータ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Declare a dynamic segment with `:paramName` in the route path. Inside the matching component, call `useParams()` to read the extracted string. Always validate or parse (e.g. `Number(id)`) before using in logic — `useParams` returns `string | undefined`.",
            np: "`:paramName` route path मा; `useParams()` ले string दिन्छ। `Number(id)` जस्तो parse गर्नुस् — undefined हुन सक्छ।",
            jp: "ルートの `path` に `:paramName` を書き、コンポーネント内で `useParams()` で取り出します。戻り値は `string | undefined` なので、使う前に `Number(id)` などで変換・検証しましょう。",
          },
        },
        {
          type: "code",
          title: {
            en: "ProductDetailPage — useParams",
            np: "ProductDetailPage — useParams",
            jp: "ProductDetailPage — useParams の例",
          },
          code: `// src/pages/ProductDetailPage.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../api/products";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(Number(id)),
    enabled: Boolean(id),
  });

  if (isLoading) return <p>Loading product…</p>;
  if (isError || !product) return <p>Product not found.</p>;

  return (
    <article>
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-600">{product.description}</p>
      <span className="text-lg font-semibold">\${product.price}</span>
    </article>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "useSearchParams — query strings for filters and pagination",
        np: "useSearchParams — query strings: filter, pagination",
        jp: "useSearchParams — フィルタとページネーションのクエリ文字列",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useSearchParams()` is the React Router equivalent of `useState` for URL query parameters. It returns the current `URLSearchParams` instance and a setter. Reading query params from the URL makes filters and pagination bookmarkable and shareable.",
            np: "`useSearchParams` → URL query param मा `useState` जस्तो। setter ले URL update गर्छ। filter/pagination bookmark गर्न सकिन्छ।",
            jp: "`useSearchParams()` はクエリパラメータ用の `useState` のようなものです。現在の `URLSearchParams` とセッター関数を返します。URL にフィルタを載せると URL を共有・ブックマークできます。",
          },
        },
        {
          type: "code",
          title: {
            en: "ProductsPage — /products?category=electronics&page=2",
            np: "ProductsPage — query strings",
            jp: "ProductsPage — クエリ文字列の読み書き",
          },
          code: `// src/pages/ProductsPage.tsx
import { useSearchParams } from "react-router-dom";

const CATEGORIES = ["all", "electronics", "clothing", "books"];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") ?? "all";
  const page = Number(searchParams.get("page") ?? "1");

  function handleCategoryChange(newCat: string) {
    setSearchParams({ category: newCat, page: "1" });
  }

  function handlePageChange(newPage: number) {
    setSearchParams({ category, page: String(newPage) });
  }

  return (
    <div>
      {/* Category filter */}
      <div className="flex gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={cat === category ? "btn-active" : "btn"}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid — pass category + page to your data hook */}
      <ProductGrid category={category} page={page} />

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
          Prev
        </button>
        <span>Page {page}</span>
        <button onClick={() => handlePageChange(page + 1)}>Next</button>
      </div>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "useLocation and passing state between routes",
        np: "useLocation र routes बीच state पठाउने",
        jp: "useLocation とルート間のステート受け渡し",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Sometimes you need to pass non-URL data between pages — for example a success message after a form, or a prefetched entity to avoid a second request. Pass `state` in `useNavigate` or `<Link state={...}>`, then read it with `useLocation().state` in the destination. Note: state is lost on manual refresh.",
            np: "URL मा नभएको data pass: `navigate('/page', { state })` वा `<Link state={...}>`। destination मा `useLocation().state`। refresh मा state गुम्छ।",
            jp: "URL に載せたくないデータ（送信後の成功メッセージや先読みエンティティなど）はナビゲーション時に `state` として渡せます。遷移先で `useLocation().state` で読み取ります。手動リロードで消えることに注意してください。",
          },
        },
        {
          type: "code",
          title: {
            en: "Passing and reading route state",
            np: "route state pass र read",
            jp: "ルートステートの受け渡しと読み取り",
          },
          code: `// Sender — navigate with state
import { useNavigate } from "react-router-dom";

function OrderForm() {
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const order = await submitOrder(formData);
    navigate("/order-confirmation", {
      state: { orderId: order.id, total: order.total },
    });
  }
  // …
}

// Receiver — read state in destination page
import { useLocation } from "react-router-dom";

interface OrderState {
  orderId: string;
  total: number;
}

function OrderConfirmationPage() {
  const location = useLocation();
  const state = location.state as OrderState | null;

  if (!state) {
    // State missing on refresh — redirect or show fallback
    return <p>Order placed. <a href="/orders">View orders</a>.</p>;
  }

  return (
    <div>
      <h1>Order confirmed!</h1>
      <p>Order #{state.orderId} · Total: \${state.total}</p>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Protected routes — guarding authenticated pages",
        np: "Protected routes — authentication guard",
        jp: "保護ルート — 認証ガード",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The most common pattern is a `ProtectedRoute` wrapper component that reads auth state and either renders `<Outlet />` for authenticated users or redirects to `/login`. Put it in your route tree as a parent of the routes you want to guard.",
            np: "`ProtectedRoute` wrapper: auth state check — authenticated → `<Outlet />`, otherwise `<Navigate to=\"/login\" />`। guard गर्ने routes को parent मा राख्नु।",
            jp: "`ProtectedRoute` ラッパーが認証状態を確認し、ログイン済みなら `<Outlet />` を、未ログインなら `/login` にリダイレクトします。保護したいルートの親として配置します。",
          },
        },
        {
          type: "code",
          title: {
            en: "ProtectedRoute component",
            np: "ProtectedRoute component",
            jp: "ProtectedRoute コンポーネント",
          },
          code: `// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

// Usage in router config:
//
// {
//   element: <ProtectedRoute />,
//   children: [
//     { path: "dashboard", element: <DashboardPage /> },
//     { path: "settings",  element: <SettingsPage />  },
//     { path: "profile",   element: <ProfilePage />   },
//   ],
// }

// Login page — redirect back after successful login
import { useNavigate, useLocation } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/";

  async function handleLogin(credentials: Credentials) {
    await login(credentials);
    navigate(from, { replace: true }); // go where they wanted
  }
  // …
}`,
        },
      ],
    },
    {
      title: {
        en: "Error pages with errorElement and useRouteError",
        np: "errorElement र useRouteError सँग error pages",
        jp: "errorElement と useRouteError によるエラーページ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Add `errorElement` to any route in the config. React Router catches errors thrown in that route's `loader`, `action`, or component render and shows the error element instead. Inside it, call `useRouteError()` to access the thrown value.",
            np: "`errorElement` route config मा; loader/action/render बाट throw भएमा देखाउँछ। `useRouteError()` ले thrown value पाइन्छ।",
            jp: "ルート設定に `errorElement` を追加すると、そのルートの `loader`・`action`・コンポーネント描画でスローされたエラーが補足されます。`useRouteError()` でスローされた値を取得できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "ErrorPage component",
            np: "ErrorPage component",
            jp: "ErrorPage コンポーネント",
          },
          code: `// src/pages/ErrorPage.tsx
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    // Router threw a Response (e.g. from a loader)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-4xl font-bold">{error.status}</h1>
        <p className="text-gray-600">{error.statusText}</p>
        {error.data?.message && <p>{error.data.message}</p>}
        <Link to="/" className="btn-primary">Back to home</Link>
      </div>
    );
  }

  const message = error instanceof Error ? error.message : "Unknown error";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p className="text-gray-600">{message}</p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Loaders and actions (data router, v6.4+)",
        np: "Loaders र actions (data router, v6.4+)",
        jp: "ローダーとアクション（データルーター v6.4+）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A `loader` function runs on the server or client before the route component renders, receives `{ params, request }`, and its return value is available via `useLoaderData()`. An `action` handles `<Form>` or `fetch`-based mutations and can return data or redirect. Together they shift data concerns out of `useEffect` into the routing layer.",
            np: "`loader` component render अघि; `{ params, request }` पाउँछ; `useLoaderData()` बाट पाइन्छ। `action` — form/mutation handle। data concern routing layer मा।",
            jp: "`loader` はルートコンポーネントが描画される前に実行され `{ params, request }` を受け取ります。戻り値は `useLoaderData()` で取得します。`action` は `<Form>` や fetch ベースの変更を処理します。データ処理を `useEffect` からルーティング層に移せます。",
          },
        },
        {
          type: "code",
          title: {
            en: "productLoader — fetch before render",
            np: "productLoader — render अघि fetch",
            jp: "productLoader — 描画前データ取得",
          },
          code: `// src/loaders/productLoader.ts
import type { LoaderFunctionArgs } from "react-router-dom";
import { json } from "react-router-dom";
import { fetchProductById } from "../api/products";

export async function productLoader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);
  if (isNaN(id)) throw json({ message: "Invalid product ID" }, { status: 400 });

  const product = await fetchProductById(id);
  if (!product) throw json({ message: "Product not found" }, { status: 404 });

  return product; // available via useLoaderData() in the component
}

// src/pages/ProductDetailPage.tsx (data-router version)
import { useLoaderData } from "react-router-dom";
import type { Product } from "../types";

export function ProductDetailPage() {
  const product = useLoaderData() as Product;

  return (
    <article>
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-600">{product.description}</p>
      <span className="text-lg font-semibold">\${product.price}</span>
    </article>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Summary",
        np: "सारांश",
        jp: "まとめ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "You now have a full client-side routing toolkit: `createBrowserRouter` for configuration, `<Outlet />` for nested layouts, `NavLink` for active navigation, `useParams` and `useSearchParams` for URL-driven state, `useLocation` for ephemeral state passing, `ProtectedRoute` for auth guards, `errorElement` for boundary handling, and loaders for co-locating data fetching with routes.",
            np: "createBrowserRouter, Outlet, NavLink, useParams, useSearchParams, useLocation, ProtectedRoute, errorElement, loader — पूर्ण client-side routing toolkit।",
            jp: "`createBrowserRouter`・`<Outlet />`・`NavLink`・`useParams`・`useSearchParams`・`useLocation`・`ProtectedRoute`・`errorElement`・ローダーを組み合わせた完全なクライアントサイドルーティングの知識を習得しました。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "React Router vs TanStack Router — which should I choose?",
        np: "React Router vs TanStack Router — कुन रोज्ने?",
        jp: "React Router と TanStack Router どちらを選ぶ？",
      },
      answer: {
        en: "React Router v6 is the established choice with a huge ecosystem, great docs, and server-framework integrations (Remix). TanStack Router is fully type-safe with automatic route type inference — excellent if TypeScript strictness is top priority. For most new projects React Router v6 is the pragmatic default; reach for TanStack Router if you feel the lack of end-to-end types.",
        np: "React Router v6 — ecosystem ठूलो, Remix integration। TanStack Router — पूर्ण type-safe। नयाँ project मा React Router default; type strictness चाहिए भने TanStack।",
        jp: "React Router v6 はエコシステムが大きく Remix 連携もある定番選択です。TanStack Router は完全な型推論が強みです。多くの新規プロジェクトでは React Router v6 が実用的なデフォルトですが、エンドツーエンドの型安全性が最優先なら TanStack Router を選びます。",
      },
    },
    {
      question: {
        en: "Why use createBrowserRouter instead of BrowserRouter?",
        np: "BrowserRouter बाट createBrowserRouter किन?",
        jp: "BrowserRouter より createBrowserRouter を使う理由は？",
      },
      answer: {
        en: "`createBrowserRouter` unlocks the data API: loaders, actions, fetcher, `defer`, and `<Await>` for streaming. It also enables better error boundaries per route and the `shouldRevalidate` hook. `BrowserRouter` is still fine for apps that do not need these features, but new projects should prefer the data router.",
        np: "`createBrowserRouter` ले loaders/actions/fetcher/defer unlock गर्छ; per-route error boundary। data API नचाहिए `BrowserRouter` ठीक। नयाँ project data router prefer।",
        jp: "`createBrowserRouter` はローダー・アクション・fetcher・`defer`・`<Await>` などデータ API を使えるようにします。ルートごとのエラーバウンダリも強化されます。これらが不要なら `BrowserRouter` でも問題ありませんが、新規プロジェクトはデータルーターを推奨します。",
      },
    },
    {
      question: {
        en: "How do I handle 404 pages?",
        np: "404 pages कसरी?",
        jp: "404 ページはどう処理する？",
      },
      answer: {
        en: "Add a catch-all route with `path: \"*\"` as the last entry at the top level of your router config. It matches any URL that no other route claims. You can also let an individual route's `errorElement` catch loader 404 responses using `isRouteErrorResponse`.",
        np: "`path: \"*\"` router config को अन्तिम entry मा। वा loader बाट 404 throw + `isRouteErrorResponse`।",
        jp: "ルーター設定のトップレベルの最後に `path: \"*\"` のキャッチオールルートを追加します。ローダーで 404 を `throw json({}, { status: 404 })` し、`isRouteErrorResponse` で判別する方法もあります。",
      },
    },
    {
      question: {
        en: "Can I pass data between pages without URL params?",
        np: "URL params बिना pages बीच data pass?",
        jp: "URL パラメータなしでページ間データを渡せる？",
      },
      answer: {
        en: "Yes — use `useNavigate('/path', { state: {...} })` or `<Link to=\"/path\" state={...}>`. Read it with `useLocation().state`. This state lives in session history and is lost on manual refresh; use a persistent store (Zustand, localStorage) for data that must survive reloads.",
        np: "`navigate(path, { state })` वा `<Link state={...}>`; `useLocation().state` ले पढ्ने। refresh मा गुम्छ; reload survive गर्न store/localStorage।",
        jp: "`useNavigate('/path', { state: {...} })` か `<Link state={...}>` で渡し、`useLocation().state` で読みます。セッション履歴に存在するためリロードで消えます。永続化が必要なら Zustand や localStorage を使います。",
      },
    },
    {
      question: {
        en: "How do I preserve scroll position on navigation?",
        np: "Navigation मा scroll position कसरी preserve?",
        jp: "ナビゲーション時にスクロール位置を保持するには？",
      },
      answer: {
        en: "React Router v6 with `createBrowserRouter` handles scroll restoration automatically for most cases. For fine-grained control, add `<ScrollRestoration />` from `react-router-dom` once inside your root layout. For programmatic scrolling (e.g. scroll-to-top on route change), use `useEffect` with `window.scrollTo(0, 0)` and `useLocation` as the trigger.",
        np: "`createBrowserRouter` ले mostly auto handle। fine-grained: `<ScrollRestoration />` root layout मा एकपटक। programmatic: `useEffect` + `useLocation` + `window.scrollTo`।",
        jp: "`createBrowserRouter` は多くの場合スクロール復元を自動で処理します。細かい制御には `<ScrollRestoration />` をルートレイアウトに一か所置きます。ルート変更でトップへ戻したい場合は `useEffect` と `useLocation` で `window.scrollTo(0, 0)` を呼びます。",
      },
    },
    {
      question: {
        en: "What is the difference between useNavigate and redirect?",
        np: "useNavigate र redirect को फरक?",
        jp: "useNavigate と redirect の違いは？",
      },
      answer: {
        en: "`useNavigate` is a hook — use it inside React components and hooks. `redirect` is a utility function from `react-router-dom` intended for use inside loaders and actions (outside the React render tree) where hooks cannot be called. Both produce navigation, but from different runtime contexts.",
        np: "`useNavigate` — hook; component/hook भित्र। `redirect` — loader/action भित्र (React render बाहिर)। उत्पादन एउटै — navigation; context फरक।",
        jp: "`useNavigate` はフック — コンポーネントやカスタムフック内で使います。`redirect` はローダー・アクション（Reactのレンダーツリーの外側）で使うユーティリティ関数です。どちらもナビゲーションを生成しますが、呼び出しコンテキストが異なります。",
      },
    },
    {
      question: {
        en: "How do I test components that use React Router?",
        np: "React Router भएका components कसरी test?",
        jp: "React Router を使うコンポーネントのテストは？",
      },
      answer: {
        en: "Wrap the component under test in `<MemoryRouter initialEntries={['/your-path']}>` (for `BrowserRouter`-based apps) or use `createMemoryRouter` + `RouterProvider` for data-router apps. Both keep routing in-memory without a browser. Testing Library's `render` + your router wrapper lets you assert navigation and URL-driven behavior.",
        np: "`<MemoryRouter initialEntries={['/path']}>` wrap वा `createMemoryRouter` + `RouterProvider`। in-memory routing — browser नचाहिने। Testing Library render + wrapper।",
        jp: "`BrowserRouter` 系なら `<MemoryRouter initialEntries={['/path']}>` でラップします。データルーター系は `createMemoryRouter` + `RouterProvider` を使います。どちらもブラウザ不要で in-memory にルーティングを保ちます。Testing Library の `render` と組み合わせてナビゲーションを検証できます。",
      },
    },
    {
      question: {
        en: "Should routing logic go in components or in route loaders?",
        np: "Routing logic — component मा कि loader मा?",
        jp: "ルーティングロジックはコンポーネントに書くべきか、ローダーに書くべきか？",
      },
      answer: {
        en: "Prefer loaders for data that the route needs before it can render — this enables parallel data fetching, better error boundaries per route, and avoids `useEffect` waterfalls. Keep inside components: user-interaction-triggered fetches, mutations, and UI state. As a rule: if the data is required to show the page at all, it belongs in a loader.",
        np: "Loader: page render गर्न चाहिने data (parallel fetch, better error boundary, useEffect waterfall नहोस्)। Component: user interaction triggered fetch, mutation, UI state। rule: page देखाउनै चाहिने data → loader।",
        jp: "ページ描画に必須なデータはローダーに置くのが望ましいです。並列データ取得・ルートごとのエラーバウンダリ・`useEffect` のウォーターフォール回避につながります。ユーザー操作トリガーの取得・ミューテーション・UI 状態はコンポーネントに残します。原則: ページ表示に絶対必要なデータはローダーへ。",
      },
    },
  ],
  bullets: [
    {
      en: "Set up `createBrowserRouter` with at least three routes (Home, Products list, Product detail with `:id`), and an `AppLayout` that renders a `<Navbar />` and `<Outlet />`.",
      np: "`createBrowserRouter` — Home, Products, `/products/:id`; AppLayout → Navbar + Outlet।",
      jp: "`createBrowserRouter` で Home・Products 一覧・`/products/:id` の 3 ルートを設定し、`AppLayout` に Navbar と `<Outlet />` を置く。",
    },
    {
      en: "Implement `<NavLink>` with an `isActive` class in the navbar, and a `ProtectedRoute` that redirects unauthenticated users to `/login` with the `from` location preserved.",
      np: "NavLink active class; ProtectedRoute → `/login` redirect, `from` location preserve।",
      jp: "ナビバーに isActive スタイル付きの `<NavLink>` を実装し、`ProtectedRoute` で未認証ユーザーを `from` ロケーションを保持して `/login` にリダイレクトする。",
    },
    {
      en: "Add `useSearchParams` to the Products page for a category filter and page number, then write a `productLoader` that throws a 404 `Response` if the product is not found.",
      np: "Products page मा useSearchParams (category + page); productLoader — product नभेटे 404 throw।",
      jp: "Products ページに `useSearchParams` でカテゴリフィルタとページ番号を追加し、`productLoader` で商品が見つからない場合に 404 `Response` をスローする。",
    },
  ],
};
