import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_12_DETAIL: RoadmapDayDetail = {
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
        en: "useTransition & useDeferredValue — keeping the UI responsive",
        np: "useTransition & useDeferredValue — UI responsive राख्ने",
        jp: "useTransition & useDeferredValue — UI を応答性良く保つ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React's concurrent features let you mark some state updates as non-urgent, so they can be interrupted by more important work (like typing). Analogy: `useTransition` is like a priority queue at a hospital — a user typing (urgent) goes straight in, a background report generation (non-urgent) waits.\n\n<b>useTransition</b> — wraps a state update as non-urgent. React can pause and resume it.\n<b>useDeferredValue</b> — creates a lagging copy of a value. The UI renders with the old value instantly, then updates when idle.\n\nBoth solve the same problem (slow renders blocking fast interactions) with different APIs.",
            np: "useTransition: non-urgent update wrap गर्छ। useDeferredValue: value को lagging copy बनाउँछ।",
            jp: "useTransition は低優先度更新をマーク。useDeferredValue は値の遅延コピーを作ります。",
          },
        },
        {
          type: "code",
          title: { en: "useTransition and useDeferredValue", np: "useTransition र useDeferredValue", jp: "useTransition と useDeferredValue" },
          code: `// useTransition — for filtering a large list
function ProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(allProducts);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val); // urgent — update input immediately

    startTransition(() => {
      // non-urgent — React can defer this if the user keeps typing
      setResults(allProducts.filter(p => p.name.includes(val)));
    });
  };

  return (
    <>
      <input value={query} onChange={handleSearch} />
      {isPending && <p>Filtering...</p>}
      <ProductList products={results} />
    </>
  );
}

// useDeferredValue — alternative approach
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  // deferredQuery lags behind query — the list re-renders
  // with the old value until React has time to update
  const results = useMemo(
    () => allProducts.filter(p => p.name.includes(deferredQuery)),
    [deferredQuery]
  );

  const isStale = query !== deferredQuery;

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      <ProductList products={results} />
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
  ],
};
