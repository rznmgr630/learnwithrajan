import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_14_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Production React apps need to handle failures gracefully. An unhandled error in one component shouldn't crash your entire app. <b>Error Boundaries</b> are React's try/catch for the component tree — they catch errors in children and show a fallback UI instead of a white screen. Analogy: an Error Boundary is like a circuit breaker — when one circuit fails, it trips without taking down the whole house.",
      np: "Error Boundaries ले component tree मा errors catch गरेर fallback UI देखाउँछ। एउटा component crash हुँदा पूरो app crash हुँदैन।",
      jp: "Error Boundary はコンポーネントツリーの try/catch です。一つのエラーでアプリ全体がクラッシュするのを防ぎます。",
    },
    {
      en: "Today's topics:\n• <b>Error Boundaries</b> — catching render errors, `react-error-boundary` library\n• <b>Granular placement</b> — where to put boundaries for best user experience\n• <b>Portals</b> — rendering DOM output outside the parent tree (modals, tooltips)\n• <b>React.lazy + Suspense</b> — code splitting for faster initial loads\n• <b>useTransition + useDeferredValue</b> — keeping the UI responsive during heavy updates",
      np: "Error Boundaries, Portals, React.lazy+Suspense, useTransition, useDeferredValue।",
      jp: "Error Boundary・Portal・React.lazy+Suspense・useTransition・useDeferredValue を学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Error Boundaries — catching render errors",
        np: "Error Boundaries — render errors catch गर्ने",
        jp: "Error Boundary — レンダーエラーを捕捉する",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "An Error Boundary catches JavaScript errors that happen during rendering, in lifecycle methods, or in constructors of the component tree below it. Without one, a single error causes the whole React tree to unmount — the user sees a blank page.\n\n<b>Two ways to create them:</b>\n• Write a class component with `componentDidCatch` and `getDerivedStateFromError` (verbose, old way)\n• Use the `react-error-boundary` library (modern, recommended — no class components needed)\n\n<b>Important:</b> Error Boundaries do NOT catch errors in event handlers, async code (setTimeout, Promises), or server-side rendering. Those need try/catch.",
            np: "Error Boundary ले render errors catch गर्छ। `react-error-boundary` library use गर्नुहोस्। Async errors catch गर्दैन।",
            jp: "レンダー中のエラーを捕捉。`react-error-boundary` が現代的な方法。非同期エラーは対象外。",
          },
        },
        {
          type: "code",
          title: { en: "react-error-boundary usage", np: "react-error-boundary उदाहरण", jp: "react-error-boundary の使い方" },
          code: `import { ErrorBoundary } from 'react-error-boundary';

// The fallback shown when something crashes
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="error-card">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

// Wrap any component tree that might fail
function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        // Log to Sentry, Datadog, etc.
        console.error('Caught error:', error, info.componentStack);
      }}
    >
      <Dashboard />
    </ErrorBoundary>
  );
}

// Programmatic reset — e.g. after navigation
function Dashboard() {
  const { resetBoundary } = useErrorBoundary();

  return (
    <button onClick={resetBoundary}>Reset</button>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Where to place Error Boundaries",
        np: "Error Boundaries कहाँ राख्ने",
        jp: "Error Boundary の配置場所",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Placement granularity matters. Analogy: circuit breakers at the right level — one breaker for the whole house is too coarse (a fridge fault kills all lights), one per lightbulb is too fine (too complex to manage). Aim for feature-level boundaries.\n\n<b>Three placement strategies:</b>\n• App-level — one boundary at the root. Catches everything but shows one error screen for any failure\n• Feature-level — wrap each major section (sidebar, main content, notifications widget). One section fails, rest stays up\n• Component-level — wrap individual risky components (third-party embeds, dynamic imports). Most granular",
            np: "Feature-level Error Boundaries best practice। एउटा section crash हुँदा बाँकी काम गर्छ।",
            jp: "機能レベルの境界が最適。一箇所のエラーが他に影響しません。",
          },
        },
        {
          type: "code",
          title: { en: "Feature-level boundaries", np: "Feature-level boundaries", jp: "機能レベルの境界" },
          code: `function App() {
  return (
    <div className="app-layout">
      {/* Sidebar crash won't affect main content */}
      <ErrorBoundary FallbackComponent={SidebarError}>
        <Sidebar />
      </ErrorBoundary>

      {/* Each dashboard widget is isolated */}
      <main>
        <ErrorBoundary FallbackComponent={WidgetError}>
          <RevenueChart />
        </ErrorBoundary>

        <ErrorBoundary FallbackComponent={WidgetError}>
          <RecentOrders />
        </ErrorBoundary>
      </main>
    </div>
  );
}

// Async errors (event handlers) need regular try/catch:
async function handleSubmit() {
  try {
    await api.post('/orders', data);
  } catch (err) {
    setError(err.message); // handle in state, not Error Boundary
  }
}`,
        },
      ],
    },
    {
      title: {
        en: "Portals — render outside the parent DOM",
        np: "Portals — parent DOM बाहिर render गर्ने",
        jp: "Portal — 親 DOM の外にレンダーする",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A Portal lets you render a component's output to a different DOM node than its parent. Analogy: a Portal is like a transporter — your component lives in one part of the React tree, but its DOM output appears somewhere entirely different (typically the `<body>`).\n\n<b>Why you need this:</b>\n• Modals and dialogs — they need to overlay everything; if rendered inside a `overflow: hidden` container, they get clipped\n• Tooltips — same problem, need to escape stacking contexts\n• Notification toasts — should always appear on top, not inside a card\n\n<b>Key insight:</b> Portal children still receive Context from their React parent — events still bubble up through the React tree, not the DOM tree.",
            np: "Portal ले component को DOM output अर्को node मा render गर्छ। Modals, tooltips, toasts को लागि।",
            jp: "Portal は DOM の別ノードにレンダーします。モーダルやツールチップに使います。",
          },
        },
        {
          type: "code",
          title: { en: "Modal with Portal", np: "Portal सहित Modal", jp: "Portal を使ったモーダル" },
          code: `import { createPortal } from 'react-dom';
import { useEffect } from 'react';

function Modal({ isOpen, onClose, children }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  // Render into #modal-root (add <div id="modal-root"></div> to index.html)
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevent overlay click
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}

// Usage — even though Modal renders to #modal-root in the DOM,
// it still receives the ThemeContext from its React parent:
function ProductPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Buy Now</button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <CheckoutForm />
      </Modal>
    </>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "React.lazy + Suspense — code splitting",
        np: "React.lazy + Suspense — code splitting",
        jp: "React.lazy + Suspense — コード分割",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "By default, Vite bundles your entire app into one JavaScript file. For large apps, this means a user downloading the dashboard code even if they only visit the login page. Code splitting breaks the bundle into chunks — loaded on demand.\n\n`React.lazy` + `Suspense` is the built-in way to do this:\n• `React.lazy(() => import('./Dashboard'))` — tells the bundler to split Dashboard into a separate chunk\n• `<Suspense fallback={<Spinner />}>` — shows the fallback while the chunk is loading\n\n<b>Most impactful split:</b> split by route — each page is its own chunk, downloaded only when navigated to.",
            np: "React.lazy ले bundle को separate chunk बनाउँछ, needed हुँदा मात्र download हुन्छ।",
            jp: "React.lazy + Suspense でルートごとにバンドルを分割し、必要時だけ読み込みます。",
          },
        },
        {
          type: "code",
          title: { en: "Route-based code splitting", np: "Route-based code splitting", jp: "ルートベースのコード分割" },
          code: `import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Each page is its own chunk — downloaded only when navigated to
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

// A reusable page loader
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="spinner" />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}

// You can also split heavy components within a page:
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));

function PostEditor() {
  const [showEditor, setShowEditor] = useState(false);
  return showEditor
    ? <Suspense fallback={<div>Loading editor...</div>}><RichTextEditor /></Suspense>
    : <button onClick={() => setShowEditor(true)}>Open Editor</button>;
}`,
        },
      ],
    },
    {
      title: {
        en: "useTransition — marking updates as non-urgent",
        np: "useTransition — non-urgent updates mark गर्ने",
        jp: "useTransition — 低優先度更新のマーク",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React renders synchronously by default — a slow state update (e.g. filtering 10,000 items) blocks the entire UI, making typing feel laggy. `useTransition` lets you mark a state update as <b>non-urgent</b>, telling React it can pause and interrupt that update if a more important update (like a keypress) comes in.\n\nHow it works:\n• `startTransition(fn)` — wraps the non-urgent state update\n• `isPending` — `true` while the transition is in progress; use it to show a loading indicator\n• React renders the current UI immediately with the urgent update, then finishes the transition in the background\n\nAnalogy: a hospital triage system — a patient typing (urgent) goes straight to a doctor. A routine checkup (the transition) waits. The hospital keeps functioning; nobody is frozen.",
            np: "useTransition: non-urgent update wrap। startTransition() + isPending। React urgent update पहिले finish गर्छ।",
            jp: "startTransition で低優先度更新をラップ。isPending でローディング表示。React は緊急更新を優先。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "<b>When to use `useTransition`:</b>\n• Filtering or sorting a large list based on user input\n• Switching between heavy tabs where each tab renders a lot of content\n• Navigating between routes with expensive components\n\n<b>When NOT to use `useTransition`:</b>\n• Controlled inputs — the input's `value` must update urgently or it feels broken\n• Animation — use CSS transitions or Framer Motion instead\n• Simple toggles — the overhead is not worth it for fast updates",
            np: "Use: large list filter, tab switch, route navigate। Avoid: controlled inputs, animations।",
            jp: "大規模リスト・タブ切り替え・ルート遷移に有効。入力フィールドやアニメーションには不向き。",
          },
        },
        {
          type: "code",
          title: { en: "useTransition — search filter and tab switching", np: "useTransition examples", jp: "useTransition の使用例" },
          code: `import { useState, useTransition } from 'react';

// 1. Filter a large list — input stays responsive while list re-renders
function ProductSearch({ allProducts }: { allProducts: { id: number; name: string }[] }) {
  const [query, setQuery]            = useState('');
  const [results, setResults]        = useState(allProducts);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val); // urgent — update input immediately

    startTransition(() => {
      // non-urgent — React can defer this if the user keeps typing
      setResults(allProducts.filter(p =>
        p.name.toLowerCase().includes(val.toLowerCase())
      ));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Search products..." />
      {isPending && <p className="text-sm text-gray-400">Filtering...</p>}
      <ul style={{ opacity: isPending ? 0.6 : 1 }}>
        {results.map(p => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}

// 2. Tab switching — switch immediately, render tab content in background
type Tab = 'overview' | 'details' | 'reviews';

function ProductPage() {
  const [activeTab, setActiveTab]    = useState<Tab>('overview');
  const [isPending, startTransition] = useTransition();

  const switchTab = (tab: Tab) => {
    startTransition(() => setActiveTab(tab));
  };

  return (
    <div>
      <div className="flex gap-2">
        {(['overview', 'details', 'reviews'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className={activeTab === tab ? 'font-bold' : 'opacity-60'}
          >
            {isPending ? '...' : tab}
          </button>
        ))}
      </div>
      {activeTab === 'overview' && <div>Overview content</div>}
      {activeTab === 'details'  && <div>Details content</div>}
      {activeTab === 'reviews'  && <div>Reviews content</div>}
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "useDeferredValue — a lagging copy of a fast-changing value",
        np: "useDeferredValue — fast-changing value को lagging copy",
        jp: "useDeferredValue — 高速変化する値の遅延コピー",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useDeferredValue` takes a value and returns a <b>deferred copy</b> of it — a version that lags behind and only updates when React has spare time. It solves the same problem as `useTransition` (keeping the UI responsive during expensive renders) but with a different API.\n\nKey difference:\n• `useTransition` — you control the update: `startTransition(() => setState(newVal))`\n  ↳ Use when you own the state setter\n• `useDeferredValue` — you defer a value you received (from a prop or state): `const deferred = useDeferredValue(query)`\n  ↳ Use when you don't own the state — e.g. the value comes from a prop, or from a third-party component you can't modify\n\nThe deferred value is always a trailing snapshot — it's the last value React had time to render. While it's stale (`value !== deferred`), you can visually indicate this to the user.",
            np: "useDeferredValue: value को lagging copy। Own state = useTransition। Prop/third-party = useDeferredValue।",
            jp: "useDeferredValue は値の遅延コピー。自分で state を持てない場合に useTransition の代わりに使う。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Best practice — memoize the expensive component:</b> Wrap the component that uses the deferred value in `React.memo`. Without `memo`, the component re-renders twice on every keystroke (once with the new value, once with the deferred value) — `memo` prevents the second render by comparing props shallowly.\n\n<b>Stale content pattern:</b> use `value !== deferredValue` as a staleness flag to dim the old results while fresh ones are computing — better UX than a full loading spinner.",
            np: "React.memo + useDeferredValue = keystroke दुई re-render बाट बचाउँछ। Stale flag ले old results dim गर्छ।",
            jp: "React.memo と組み合わせると二重再レンダーを防ぐ。staleness フラグで古い結果を薄表示。",
          },
        },
        {
          type: "code",
          title: { en: "useDeferredValue — search results with stale dimming", np: "useDeferredValue example", jp: "useDeferredValue の使用例" },
          code: `import { useState, useDeferredValue, useMemo, memo } from 'react';

// Expensive component — memoize so it only re-renders when deferredQuery changes
const SearchResults = memo(function SearchResults({
  query,
  products,
}: {
  query: string;
  products: { id: number; name: string }[];
}) {
  const results = useMemo(
    () => products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())),
    [query, products],
  );

  return (
    <ul>
      {results.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
});

function ProductSearch({ allProducts }: { allProducts: { id: number; name: string }[] }) {
  const [query, setQuery] = useState('');
  const deferredQuery     = useDeferredValue(query);

  // isStale: the displayed list is behind the input
  const isStale = query !== deferredQuery;

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />

      {/* Dim old results while fresh results are computing */}
      <div style={{ opacity: isStale ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        <SearchResults query={deferredQuery} products={allProducts} />
      </div>
    </div>
  );
}

// When to prefer useDeferredValue over useTransition:
// - You receive the value as a prop (can't wrap setState in startTransition)
// - A child component owns the slow render, not the parent
// - You want to keep the API reactive (value flows down, not imperative)`,
        },
      ],
    },
    {
      title: {
        en: "Retry strategies — recovering from transient failures",
        np: "Retry strategies — transient failures बाट recover गर्ने",
        jp: "リトライ戦略 — 一時的な障害からの復旧",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Not every failure is permanent. A flaky mobile network, a server briefly restarting, a load balancer routing to an unhealthy node for one request — these are <b>transient</b> failures that often succeed on the very next try. Showing the user a hard error page for a blip that would have resolved itself in 2 seconds is bad UX. Analogy: if a phone call drops once, you redial — you don't assume the other person's phone is broken forever.\n\n<b>Exponential backoff with jitter:</b> instead of retrying immediately (which can hammer an already-struggling server) or at a fixed interval (which causes every failed client to retry in lockstep — a \"thundering herd\"), each retry waits longer than the last, plus a small random jitter so clients don't all retry at the exact same moment.",
            np: "हरेक failure permanent हुँदैन — network blip जस्ता transient failures प्रायः अर्को try मा नै सफल हुन्छन्। Exponential backoff + jitter ले retry लाई क्रमशः ढिलो र randomize गर्छ।",
            jp: "すべての失敗が恒久的とは限りません。一時的な障害は次の試行で成功することが多い。指数バックオフ＋ジッターで再試行の間隔を徐々に広げ、ランダム化します。",
          },
        },
        {
          type: "code",
          title: { en: "Retry with exponential backoff, and TanStack Query's built-in retry", np: "Exponential backoff retry", jp: "指数バックオフによるリトライ" },
          code: `// Hand-rolled retry with exponential backoff + jitter
async function fetchWithRetry(url: string, maxAttempts = 3): Promise<Response> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return res;
    } catch (err) {
      if (attempt === maxAttempts) throw err; // out of retries — surface the error

      const baseDelay = 2 ** attempt * 100;         // 200ms, 400ms, 800ms...
      const jitter = Math.random() * 100;
      await new Promise(r => setTimeout(r, baseDelay + jitter));
    }
  }
  throw new Error('unreachable');
}

// The pragmatic answer in real apps — TanStack Query already does this for you
function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetchWithRetry('/api/products'),
    retry: 3,                                  // retry up to 3 times automatically
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // capped exponential backoff
  });
}

// Automatic retries are NOT a replacement for a manual "Try again" —
// give the user their own escape hatch once automatic retries are exhausted:
function ProductList() {
  const { data, error, refetch, isFetching } = useProducts();

  if (error) {
    return (
      <div role="alert">
        <p>Couldn't load products.</p>
        <button onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Retrying...' : 'Try again'}
        </button>
      </div>
    );
  }
  return <ul>{data?.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}

// The same "give the user an escape hatch" idea applies to Error Boundaries —
// resetErrorBoundary (covered earlier in this file) is the manual retry for render errors.`,
        },
      ],
    },
    {
      title: {
        en: "Empty states — the UI state everyone forgets to design",
        np: "Empty states — सबैले बिर्सने UI state",
        jp: "空状態 — みんなが設計を忘れる UI ステート",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every data-driven component actually has <b>four</b> states, not two (\"loading\" and \"done\"):\n• <b>Loading</b> — the request is in flight\n• <b>Error</b> — the request failed\n• <b>Empty</b> — the request succeeded, but there is zero data to show\n• <b>Success with data</b> — the request succeeded and there's something to render\n\n<b>The bug this section exists to prevent:</b> treating \"empty\" as a special case of \"error.\" A search for a product that doesn't exist is a <b>successful</b> response containing an empty array — that is completely different from the server failing. Showing \"Something went wrong\" for a legitimate zero-results search is confusing and, if the user's search was correct, actively wrong.\n\n<b>A good empty state does two things a generic \"No data\" doesn't:</b> it explains *why* it's empty (no results for this filter vs. you haven't created anything yet vs. everything is done), and it offers a next action (clear filters, create your first item, invite a teammate).",
            np: "हरेक data component मा वास्तवमा चार states हुन्छन्: loading, error, empty, success-with-data। Empty र error फरक हुन् — empty result पनि एउटा valid success response हो।",
            jp: "データ表示コンポーネントには実は4つの状態があります：loading・error・empty・success。空とエラーは別物 — 検索結果ゼロも正常な成功レスポンスです。",
          },
        },
        {
          type: "code",
          title: { en: "Correctly branching on all four states", np: "चार states सही तरिकाले branch गर्ने", jp: "4つの状態を正しく分岐する" },
          code: `function ProductSearchResults({ query }: { query: string }) {
  const { data, isLoading, error } = useProductSearch(query);

  if (isLoading) return <Skeleton count={6} />;

  if (error) {
    // A REAL failure — the request itself did not succeed
    return <ErrorState message="Couldn't reach the server." onRetry={() => refetch()} />;
  }

  if (data && data.length === 0) {
    // NOT an error — a successful response with zero items
    return (
      <EmptyState
        title={\`No results for "\${query}"\`}
        hint="Try a different spelling, or remove some filters."
        action={{ label: 'Clear filters', onClick: clearFilters }}
      />
    );
  }

  // Success with data
  return <ul>{data!.map(p => <ProductCard key={p.id} product={p} />)}</ul>;
}

// A reusable EmptyState — explains WHY and offers a NEXT ACTION, not just "No data"
function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="empty-state">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-gray-500">{hint}</p>
      {action && <button onClick={action.onClick}>{action.label}</button>}
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
        en: "Can I use try/catch instead of Error Boundaries?",
        np: "Error Boundaries को सट्टा try/catch use गर्न सक्छु?",
        jp: "Error Boundary の代わりに try/catch を使える？",
      },
      answer: {
        en: "try/catch only works for imperative code (event handlers, async functions). Error Boundaries catch errors that happen during rendering — and you can't wrap JSX in a try/catch. You need both: Error Boundaries for render errors, try/catch for async/event handler errors. They complement each other.",
        np: "try/catch: event handlers, async। Error Boundaries: render errors। दुवै चाहिन्छ।",
        jp: "try/catch はイベントハンドラや非同期向け。Error Boundary はレンダーエラー向け。両方が必要です。",
      },
    },
    {
      question: {
        en: "Do Error Boundaries catch errors in event handlers?",
        np: "Error Boundaries ले event handlers को errors catch गर्छ?",
        jp: "Error Boundary はイベントハンドラのエラーを捕捉する？",
      },
      answer: {
        en: "No. Error Boundaries only catch errors that occur during rendering, in lifecycle methods, and in constructors. Event handler errors (onClick, onChange) happen outside the render cycle — use try/catch inside them. This is a common gotcha: a button click crashes silently if you don't have try/catch in the handler.",
        np: "होइन। Event handler errors try/catch ले handle गर्नुहोस्।",
        jp: "いいえ。イベントハンドラのエラーは try/catch で処理してください。",
      },
    },
    {
      question: {
        en: "When should I NOT use lazy loading?",
        np: "Lazy loading कहिले use नगर्ने?",
        jp: "遅延読み込みを使わない場面は？",
      },
      answer: {
        en: "Don't lazy-load small components (buttons, inputs, simple cards) — the HTTP request overhead outweighs the bundle savings. Lazy loading is best for route-level pages, heavy components (rich text editors, chart libraries, maps), and admin sections rarely visited. A good rule of thumb: lazy-load anything over 10KB that isn't needed on initial load.",
        np: "Small components lazy-load नगर्नुहोस्। Routes, heavy components (charts, editors) को लागि राम्रो।",
        jp: "小さなコンポーネントは不要。ルートや重いコンポーネント（チャート、エディタ）に使います。",
      },
    },
    {
      question: {
        en: "What is the difference between Suspense for data fetching vs lazy loading?",
        np: "Data fetching Suspense र lazy loading Suspense मा के फरक?",
        jp: "データ取得の Suspense と遅延読み込みの Suspense の違いは？",
      },
      answer: {
        en: "Same component, different trigger. For lazy loading, Suspense activates when a lazy-imported component hasn't loaded its JS chunk yet. For data fetching, Suspense activates when a component 'suspends' (throws a Promise) while waiting for data — this requires a Suspense-compatible data library (TanStack Query, Relay, Next.js). The `<Suspense>` wrapper is identical in both cases.",
        np: "Same component, different trigger। Lazy: JS chunk load। Data: Promise throw। TanStack Query ले support गर्छ।",
        jp: "同じコンポーネント、異なるトリガー。遅延読み込みは JS チャンク、データ取得は Promise のスロー。",
      },
    },
    {
      question: {
        en: "What is a Suspense boundary waterfall?",
        np: "Suspense boundary waterfall के हो?",
        jp: "Suspense ウォーターフォールとは？",
      },
      answer: {
        en: "A waterfall happens when Suspense boundaries are nested, causing sequential loading: the outer boundary loads first, reveals the inner component, which triggers another load. Instead of loading A and B in parallel, you load A, then B — doubling the wait time. Fix: hoist data fetching to the parent so all data loads in parallel before Suspense boundaries kick in.",
        np: "Nested Suspense boundaries ले sequential loading गराउँछ। Data fetching parent मा hoist गरेर fix गर्ने।",
        jp: "入れ子の Suspense が順次ロードを引き起こす問題。親でデータ取得を並列化して解決します。",
      },
    },
    {
      question: {
        en: "Should I retry every failed request automatically?",
        np: "हरेक failed request automatically retry गर्नुपर्छ?",
        jp: "失敗したリクエストはすべて自動リトライすべき？",
      },
      answer: {
        en: "No — only retry errors that are plausibly transient (network errors, 502/503/504 status codes, timeouts). Don't retry a 401 (unauthorized) or 400 (bad request) — retrying the exact same broken request will just fail the exact same way and waste time before showing the real error. Most HTTP clients and TanStack Query let you inspect the error/status in a `retry` function to make this decision.",
        np: "होइन — transient errors (network, 502/503/504) मात्र retry गर्नुहोस्। 401/400 जस्ता errors retry गर्दा फेरि उही किसिमले fail हुन्छ।",
        jp: "いいえ。一時的なエラー（ネットワーク、502/503/504）のみリトライしてください。401や400は再試行しても同じ結果になります。",
      },
    },
    {
      question: {
        en: "Is an empty state the same thing as a loading skeleton?",
        np: "Empty state र loading skeleton उस्तै हो?",
        jp: "空状態とローディングスケルトンは同じもの？",
      },
      answer: {
        en: "No — they're opposite ends of the same request. A skeleton is a placeholder shown WHILE you don't yet know the outcome. An empty state is shown AFTER you know the outcome, and the outcome is \"success, zero items.\" Showing a skeleton forever when data has already arrived (but is empty) is a common bug — always check `isLoading` first, then check the data length separately.",
        np: "होइन — फरक हुन्। Skeleton ले नतिजा थाहा नहुँदै देखाउँछ, empty state ले नतिजा 'success तर zero items' भएपछि देखाउँछ।",
        jp: "いいえ、別物です。スケルトンは結果が分かる前、空状態は「成功だがゼロ件」と分かった後に表示します。",
      },
    },
  ],
};
