import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_15_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "React apps are <b>single-page applications</b> — the server sends one HTML file, and JavaScript handles showing different \"pages.\" React Router maps URLs to components.\n\nAnalogy: React Router is like a hotel receptionist — the guest (URL) comes in, the receptionist (router) checks the list, and sends them to the right room (component). You change rooms (navigate) without checking out of the hotel (no page reload).\n\n<b>Why not just use `<a>` tags?</b> A normal link reloads the entire page from the server. React Router intercepts the click, updates the URL bar, and swaps the component — instant, no flicker.",
      np: "React Router ले URL लाई component मा map गर्छ। SPA मा page reload नभई navigation हुन्छ।",
      jp: "React Router は URL をコンポーネントにマッピングします。SPA なのでページリロードなしで画面が切り替わります。",
    },
    {
      en: "In this day we cover:\n\n• <b>`BrowserRouter`</b> — wraps your app and enables URL-based routing\n• <b>Route definitions</b> — map paths to components\n• <b>`<Link>` and `<NavLink>`</b> — client-side navigation without page refresh\n• <b>URL params and search params</b> — reading `:id` and `?sort=price` from the URL\n• <b>Nested routes with `<Outlet>`</b> — shared layout components\n• <b>`useNavigate`</b> — programmatic navigation from code\n• <b>Protected routes</b> — redirect unauthenticated users to login",
      np: "BrowserRouter, routes, Link, URL params, nested routes, useNavigate, protected routes — सबै cover गर्छौं।",
      jp: "BrowserRouter・ルート定義・Link・URLパラメータ・ネストルート・useNavigate・保護ルートを網羅します。",
    },
  ],
  sections: [
    {
      title: {
        en: "Setting up React Router v6",
        np: "React Router v6 सेटअप",
        jp: "React Router v6 のセットアップ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Install React Router, wrap your app in `<BrowserRouter>`, then define routes with `<Routes>` and `<Route>`.\n\n• `path=\"/\"` — home page\n• `path=\"/posts/:id\"` — `:id` is a URL parameter (wildcard that matches anything)\n• `path=\"*\"` — catch-all for 404 pages\n\n<b>v6 vs v5 changes:</b> `<Switch>` became `<Routes>`, the `exact` prop is gone (all routes match exactly by default), and `component=` became `element=`.",
            np: "npm install react-router-dom। BrowserRouter ले app wrap गर्नुहोस्। Routes र Route ले path-to-component map गर्छ।",
            jp: "npm install 後、BrowserRouter でアプリをラップし Routes / Route でパスとコンポーネントを対応付けます。",
          },
        },
        {
          type: "code",
          title: {
            en: "main.jsx + App.jsx — basic routing setup",
            np: "basic routing setup",
            jp: "基本ルーティング設定",
          },
          code: `// main.jsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// App.jsx
import { Routes, Route } from "react-router-dom";
import Home       from "./pages/Home";
import PostList   from "./pages/PostList";
import PostDetail from "./pages/PostDetail";
import NotFound   from "./pages/NotFound";
import Navbar     from "./components/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/posts"     element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
    </>
  );
}

// Navbar.jsx — client-side links
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      {/* NavLink adds an "active" class when the URL matches */}
      <NavLink to="/posts" className={({ isActive }) => isActive ? "active" : ""}>
        Posts
      </NavLink>
    </nav>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "URL parameters and search params",
        np: "URL parameters र search params",
        jp: "URLパラメータとサーチパラメータ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React Router gives you two types of dynamic URL data:\n\n• <b>URL parameters</b> — part of the path: `/posts/42` → `:id` = `\"42\"`\n  ↳ Use `useParams()` to read them\n• <b>Search params</b> — after the `?`: `/posts?sort=price&order=asc`\n  ↳ Use `useSearchParams()` to read and update them\n\nSearch params are great for filters and sorting — they're bookmarkable, shareable, and updating them doesn't cause a navigation.",
            np: "useParams() ले :id पढ्छ। useSearchParams() ले ?sort=price जस्ता query strings पढ्छ।",
            jp: "`useParams()` で `:id`、`useSearchParams()` で `?sort=price` のようなクエリを読み取ります。",
          },
        },
        {
          type: "code",
          title: {
            en: "useParams + useSearchParams",
            np: "params examples",
            jp: "パラメータの例",
          },
          code: `// PostDetail.jsx — reading a URL parameter
import { useParams } from "react-router-dom";

export default function PostDetail() {
  const { id } = useParams();  // "/posts/42" → id = "42"

  // fetch by id (TanStack Query)
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn:  () => fetch(\`/api/posts/\${id}\`).then(r => r.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  return <h1>{post.title}</h1>;
}

// PostList.jsx — reading + updating search params
import { useSearchParams } from "react-router-dom";

export default function PostList() {
  const [params, setParams] = useSearchParams();
  const sort  = params.get("sort")  ?? "date";
  const order = params.get("order") ?? "desc";

  return (
    <select value={sort} onChange={e => setParams({ sort: e.target.value, order })}>
      <option value="date">Date</option>
      <option value="price">Price</option>
    </select>
    // URL updates to ?sort=price without a page reload
  );
}

// useLocation — full URL object
import { useLocation } from "react-router-dom";
const location = useLocation();
// { pathname: "/posts", search: "?sort=price", hash: "", state: null }`,
        },
      ],
    },
    {
      title: {
        en: "Nested routes with Outlet",
        np: "Nested routes — Outlet",
        jp: "ネストルートと Outlet",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Nested routes let a parent route render a shared layout while child routes fill in the content area.\n\nAnalogy: nested routes are like Russian dolls — the outer doll (layout) always renders; the inner doll (page content) swaps based on the URL.\n\n`<Outlet />` is the placeholder where the active child route renders. Think of it like `{children}` but driven by the URL.\n\n• `/dashboard` → renders `DashboardLayout` + `Overview` (index route)\n• `/dashboard/settings` → renders `DashboardLayout` + `Settings`\n  ↳ The sidebar is always visible — only the content area changes",
            np: "Outlet ले child route को content render गर्छ। Layout always देखिन्छ, content मात्र URL अनुसार बदलिन्छ।",
            jp: "Outlet はアクティブな子ルートがレンダーされる場所。レイアウトは常に表示、中身だけURLで切り替わります。",
          },
        },
        {
          type: "code",
          title: {
            en: "DashboardLayout + nested route definitions",
            np: "nested routes example",
            jp: "ネストルートの例",
          },
          code: `// App.jsx — nested route definition
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index            element={<Overview />} />     {/* /dashboard */}
    <Route path="posts"     element={<PostManager />} />  {/* /dashboard/posts */}
    <Route path="settings"  element={<Settings />} />     {/* /dashboard/settings */}
  </Route>
</Routes>

// DashboardLayout.jsx — the outer shell
import { Outlet, NavLink } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex">
      <aside className="w-48 border-r p-4">
        <NavLink to="/dashboard">Overview</NavLink>
        <NavLink to="/dashboard/posts">Posts</NavLink>
        <NavLink to="/dashboard/settings">Settings</NavLink>
      </aside>

      <main className="flex-1 p-6">
        {/* Active child route renders here */}
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
        en: "Programmatic navigation with useNavigate",
        np: "useNavigate — programmatic navigation",
        jp: "useNavigate によるプログラム的ナビゲーション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useNavigate` lets you navigate from JavaScript code — not from clicking a link. Common uses:\n\n• Redirect after a form submits successfully\n• Go back to the previous page — `navigate(-1)`\n• Replace the current history entry so \"back\" doesn't return to login — `navigate('/dashboard', { replace: true })`\n• Navigate with state — pass data to the next page without exposing it in the URL",
            np: "useNavigate() ले form submit पछि, logout पछि जस्ता programmatic navigation गर्छ।",
            jp: "`useNavigate()` でフォーム送信後のリダイレクトや戻るボタンなどを制御します。",
          },
        },
        {
          type: "code",
          title: {
            en: "useNavigate patterns",
            np: "navigate patterns",
            jp: "navigate のパターン",
          },
          code: `import { useNavigate, useLocation } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "/dashboard";

  async function handleSubmit(e) {
    e.preventDefault();
    await login(email, password);
    // replace: true removes the login page from history
    navigate(from, { replace: true });
  }
}

function PostDetail({ id }) {
  const navigate = useNavigate();

  async function handleDelete() {
    await deletePost(id);
    navigate("/posts");     // go to list after delete
  }

  function handleBack() {
    navigate(-1);           // equivalent to browser back button
  }
}

// Passing invisible state (lost on page refresh)
navigate("/order-success", { state: { orderId: "abc-123" } });

// Reading it on the destination page
const { state } = useLocation();
console.log(state?.orderId); // "abc-123"`,
        },
      ],
    },
    {
      title: {
        en: "Protected routes — auth guards",
        np: "Protected routes — auth guards",
        jp: "保護ルート（認証ガード）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A protected route redirects unauthenticated users to the login page. Analogy: a bouncer at a club — no wristband (token), you get sent to the ticket counter (login page).\n\n<b>The pattern:</b>\n1. Create a `RequireAuth` wrapper component\n2. Check if the user is logged in\n3. If yes — render `{children}`\n4. If no — `<Navigate to=\"/login\" />` redirects them\n\nAlways pass `replace` on the redirect so login replaces the protected URL in history — otherwise pressing Back after login loops back to login again.",
            np: "RequireAuth wrapper ले unauthenticated users लाई login page मा redirect गर्छ।",
            jp: "RequireAuth ラッパーで未認証ユーザーをログインページにリダイレクトします。",
          },
        },
        {
          type: "code",
          title: {
            en: "RequireAuth + redirect back after login",
            np: "auth guard pattern",
            jp: "認証ガードパターン",
          },
          code: `// RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

export function RequireAuth({ children }) {
  const { user }   = useAuth();
  const location   = useLocation();

  if (!user) {
    // Save where the user was trying to go
    return (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
  }

  return children;
}

// App.jsx — wrap protected routes
<Routes>
  <Route path="/login" element={<Login />} />

  <Route path="/dashboard" element={
    <RequireAuth>
      <DashboardLayout />
    </RequireAuth>
  }>
    <Route index           element={<Overview />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>

// Login.jsx — redirect back after successful login
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "/dashboard";

  async function onSubmit(data) {
    await signIn(data.email, data.password);
    navigate(from, { replace: true });
  }
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between BrowserRouter and HashRouter?",
        np: "BrowserRouter र HashRouter मा के फरक?",
        jp: "BrowserRouter と HashRouter の違いは？",
      },
      answer: {
        en: "<b>BrowserRouter</b> uses the HTML5 History API — clean URLs like `/posts/42`. Requires the server to serve `index.html` for all routes (configure Nginx / Vite's `historyApiFallback`). <b>HashRouter</b> uses the URL hash — `/#/posts/42`. No server config needed; works on any static host. Use BrowserRouter for modern apps; HashRouter only when you can't control the server.",
        np: "BrowserRouter = clean URLs (/posts/42), server config चाहिन्छ। HashRouter = /#/ URLs, server config चाहिँदैन।",
        jp: "BrowserRouter はクリーンな URL でサーバー設定が必要。HashRouter は `/#/` 形式でサーバー設定不要。",
      },
    },
    {
      question: {
        en: "How do I handle 404 pages?",
        np: "404 pages कसरी handle गर्ने?",
        jp: "404 ページはどう処理する？",
      },
      answer: {
        en: "Add a catch-all route at the END of your `<Routes>` with `path=\"*\"`. React Router tries routes in order — `*` only matches if nothing else did. `<Route path=\"*\" element={<NotFound />} />`. This must be last, or it will match before specific routes.",
        np: "Routes को अन्तमा `path=\"*\"` भएको route थप्नुहोस्। यो सबैभन्दा पछि match हुन्छ।",
        jp: "`<Routes>` の末尾に `path=\"*\"` を追加。他のルートにマッチしなかった場合にのみ使われます。",
      },
    },
    {
      question: {
        en: "What is the difference between `<Link>` and `<a>`?",
        np: "`<Link>` र `<a>` मा के फरक?",
        jp: "`<Link>` と `<a>` の違いは？",
      },
      answer: {
        en: "`<a href=\"/posts\">` causes a full page reload — the browser sends a new HTTP request. `<Link to=\"/posts\">` intercepts the click, updates the URL using the History API, and swaps the React component — no server request, no flicker, no lost state. Use `<Link>` for internal navigation; `<a>` for external links (other domains).",
        np: "`<a>` ले full page reload गर्छ। `<Link>` ले component swap मात्र गर्छ, server request पठाउँदैन।",
        jp: "`<a>` はページ全体をリロード。`<Link>` はクライアント側でコンポーネントを切り替えるだけです。",
      },
    },
    {
      question: {
        en: "How do I show a loading state during navigation?",
        np: "Navigation को बेला loading state कसरी देखाउने?",
        jp: "ナビゲーション中にローディングを表示するには？",
      },
      answer: {
        en: "For lazy-loaded routes, wrap with `<Suspense fallback={<Spinner />}>` — React shows the fallback while the chunk downloads. For data-loading patterns (React Router loaders), use `const navigation = useNavigation(); navigation.state === 'loading'`.",
        np: "Lazy routes मा `<Suspense fallback={<Spinner />}>` use गर्नुहोस्। Data loading मा `useNavigation()` hook।",
        jp: "lazy ルートには `<Suspense>` が便利。データローディングには `useNavigation()` フックを使います。",
      },
    },
    {
      question: {
        en: "How do I pass data between routes without URL params?",
        np: "URL params बिना routes बीचमा data कसरी pass गर्ने?",
        jp: "URLパラメータなしでルート間でデータを渡すには？",
      },
      answer: {
        en: "Three options:\n• <b>Router state</b>: `navigate('/success', { state: { orderId } })` — lost on page refresh, good for one-time messages\n• <b>Global state</b>: Zustand / Context — persists while the app is open\n• <b>Server refetch</b>: fetch on the destination page with TanStack Query — most reliable, works after refresh",
        np: "Router state (navigate), global state (Zustand), वा destination मा re-fetch (TanStack Query)।",
        jp: "router state・global state・サーバーフェッチの3択。リフレッシュ後も必要なら TanStack Query が最確実。",
      },
    },
  ],
};
