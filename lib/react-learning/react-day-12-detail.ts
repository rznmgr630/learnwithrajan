import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 12 — Error Boundaries, Portals & Code Splitting with Suspense: getDerivedStateFromError, react-error-boundary, createPortal, React.lazy, Suspense, combined error+loading boundaries. */
export const REACT_DAY_12_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 12 tackles three production essentials that are often skipped in tutorials. Error boundaries catch JavaScript errors thrown inside a React subtree and display a fallback instead of crashing the entire app. Portals let you render a component's output outside its DOM parent — critical for modals and tooltips that must escape CSS `overflow: hidden`. Code splitting with `React.lazy` + `Suspense` defers loading heavy route components until they are needed, shrinking the initial bundle.",
      np: "दिन १२ — Error boundaries: JS error catch, crash रोक्नु। Portals: DOM parent बाहिर render, overflow escape। Code splitting: React.lazy + Suspense, bundle size घटाउनु।",
      jp: "12日目は本番で必須の3テーマを扱います。Error boundaries はサブツリーの JS エラーをキャッチしクラッシュを防ぎます。Portals は CSS の `overflow: hidden` を突破してモーダルを描画します。`React.lazy` + `Suspense` でコードを分割し初期バンドルを小さくします。",
    },
    {
      en: "These three features solve problems that `try/catch`, normal rendering, and static imports cannot address. Understanding why each exists makes React production architecture much clearer.",
      np: "try/catch, normal render, static import ले solve नहुने problem। production architecture स्पष्ट।",
      jp: "それぞれ `try/catch`・通常レンダー・静的インポートが解決できない問題を扱います。存在理由を理解すると本番アーキテクチャが見えてきます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Introduction — what breaks a React tree",
        np: "परिचय — React tree के कारण crash हुन्छ",
        jp: "React ツリーが壊れる原因",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When a component throws an error during rendering, in a lifecycle method, or in a constructor, React cannot know what to put on screen. Before React 16, this left the component in a corrupted state and produced cryptic DOM. Since React 16, an unhandled render error unmounts the entire component tree — intentionally, so you cannot silently display broken UI. The solution is to place an error boundary above the risky subtree.",
            np: "render/lifecycle/constructor मा error → React थाहा छैन के देखाउने। React 16 — unhandled error ले पूरै tree unmount। solution: risky subtree माथि error boundary।",
            jp: "レンダー・ライフサイクル・コンストラクタで投げられたエラーを React は処理できず、React 16 以降は意図的にツリー全体をアンマウントします。破損した UI を表示しないためです。対策は危険なサブツリーの上に error boundary を置くことです。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "`try/catch` cannot catch errors in render because React drives rendering outside your call stack — you write JSX that React calls later. Event handlers and async code (`setTimeout`, `fetch`) are also outside the boundary; those still need `try/catch` or `.catch()` at the call site.",
            np: "`try/catch` render error catch गर्न सक्दैन — React आफ्नै call stack मा render। event handler र async (setTimeout, fetch) पनि boundary बाहिर।",
            jp: "`try/catch` がレンダーエラーをキャッチできないのは、React が自分のコールスタックでレンダーを呼ぶためです。イベントハンドラや非同期コードも境界外なので `try/catch` が必要です。",
          },
        },
      ],
    },
    {
      title: {
        en: "Error boundaries — class component implementation",
        np: "Error boundaries — class component implementation",
        jp: "Error boundary — クラスコンポーネント実装",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Error boundaries must be class components because they rely on two lifecycle methods that have no hook equivalent yet: `static getDerivedStateFromError(error)` updates state so the next render shows the fallback, and `componentDidCatch(error, info)` is for side effects like logging. You only need to write this once (or use `react-error-boundary`).",
            np: "`getDerivedStateFromError` — state update → fallback render। `componentDidCatch` — logging (side effect)। hook equivalent छैन → class component।",
            jp: "Error boundary はクラスコンポーネントが必要です。`getDerivedStateFromError` でフォールバック状態をセット、`componentDidCatch` でロギングを行います。hook に相当するものはまだありません。",
          },
        },
        {
          type: "code",
          title: {
            en: "Manual ErrorBoundary class component",
            np: "Manual ErrorBoundary class component",
            jp: "手作り ErrorBoundary クラスコンポーネント",
          },
          code: `import { Component, type ReactNode, type ErrorInfo } from "react";

interface ErrorBoundaryProps {
  fallback: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, info: ErrorInfo) => void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  // Called during render phase — must be pure, return new state
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // Called after render — safe for side effects like logging
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
    // In production, report to Sentry / Datadog / etc.
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      return typeof fallback === "function"
        ? fallback(this.state.error!)
        : fallback;
    }
    return this.props.children;
  }
}

// --- usage ---
function App() {
  return (
    <ErrorBoundary
      fallback={(err) => (
        <div role="alert" className="error-screen">
          <h2>Something went wrong</h2>
          <pre>{err.message}</pre>
        </div>
      )}
      onError={(err) => reportToSentry(err)}
    >
      <Dashboard />
    </ErrorBoundary>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "react-error-boundary — the modern shortcut",
        np: "react-error-boundary — आधुनिक shortcut",
        jp: "react-error-boundary — 現代的な近道",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`react-error-boundary` by Brian Vaughn (maintained by the React team in practice) wraps the class boilerplate and adds first-class support for: a `FallbackComponent` that receives `error` and `resetErrorBoundary`, `onError` callback, and `resetKeys` — an array of values that, when changed, automatically reset the boundary. This means your UI can recover when the condition that caused the error no longer holds.",
            np: "`react-error-boundary` — class boilerplate wrap। `FallbackComponent` (error + resetErrorBoundary), `onError`, `resetKeys` (automatic reset)।",
            jp: "`react-error-boundary` はクラスのボイラープレートをラップします。`FallbackComponent`（`error` と `resetErrorBoundary` を受け取る）・`onError`・`resetKeys`（変化でボーダーを自動リセット）をサポートします。",
          },
        },
        {
          type: "code",
          title: {
            en: "react-error-boundary with FallbackComponent and resetKeys",
            np: "react-error-boundary — FallbackComponent + resetKeys",
            jp: "react-error-boundary の FallbackComponent と resetKeys",
          },
          code: `import { ErrorBoundary } from "react-error-boundary";

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="error-card">
      <h3>Widget failed to load</h3>
      <p className="error-message">{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function Dashboard({ userId }: { userId: string }) {
  return (
    // resetKeys: when userId changes, boundary resets automatically
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        // send to your error tracking service
        logErrorToService(error, info);
      }}
      resetKeys={[userId]}
    >
      <UserProfile userId={userId} />
    </ErrorBoundary>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Error boundary placement strategy",
        np: "Error boundary placement strategy",
        jp: "Error boundary の配置戦略",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Placement is a product decision. A single root boundary prevents white screens but hides the whole app on any error. Granular boundaries (one per widget, route, or sidebar panel) isolate failures — a broken recommendation widget does not kill the navigation. The recommended strategy: one root boundary as a last resort, plus granular boundaries around independently-loaded widgets, third-party integrations, and unstable data-driven sections.",
            np: "root boundary — white screen रोक्छ तर सब लुकाउँछ। granular — widget एकको error = navigation ठिक। strategy: root (last resort) + granular widget/third-party/unstable sections।",
            jp: "単一ルート境界は白画面を防ぎますが障害が全体に波及します。細かい境界はウィジェット単位で障害を封じ込めます。推奨はルート境界（最後の砦）＋独立ウィジェットや不安定なセクションへの細粒度境界の組み合わせです。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Root boundary — catch catastrophic failures, show a global \"Something went wrong\" page",
              np: "Root boundary — catastrophic failure; global error page",
              jp: "ルート境界 — 壊滅的な障害をキャッチしグローバルエラーページを表示",
            },
            {
              en: "Route-level boundary — each page route gets its own boundary; other routes stay alive",
              np: "Route-level — प्रत्येक page route आफ्नो boundary; अन्य route चालु",
              jp: "ルートレベル境界 — 各ページルートに境界を置き、他のルートを維持",
            },
            {
              en: "Widget-level boundary — dashboards, cards, third-party embeds, any independently loaded section",
              np: "Widget-level — dashboard card, third-party embed, independent section",
              jp: "ウィジェットレベル境界 — ダッシュボードカード・サードパーティ埋め込み・独立読み込みセクション",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "createPortal — render outside the DOM hierarchy",
        np: "createPortal — DOM hierarchy बाहिर render",
        jp: "createPortal — DOM 階層の外にレンダー",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`createPortal(children, domNode)` renders a React subtree into an arbitrary DOM node outside the component's own DOM parent. This is the solution when a modal or tooltip is inside a container with `overflow: hidden` or `transform` (which creates a new stacking context that traps `position: fixed` children). Portal children still live in the React tree — they receive context and event bubbles — but their DOM output lands in the target node, usually `document.body`.",
            np: "`createPortal` — component DOM parent बाहिर render। `overflow:hidden`/`transform` escape। React tree मा छ (context + events) तर DOM output target node मा।",
            jp: "`createPortal` はコンポーネントの DOM 親の外に React サブツリーを描画します。`overflow:hidden` や `transform` による積み重なりコンテキストを突破します。React ツリーには属しているので context とイベントは通常通り機能します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Modal using createPortal — renders in document.body",
            np: "Modal — createPortal, document.body मा render",
            jp: "Modal — createPortal で document.body にレンダー",
          },
          code: `import { createPortal } from "react-dom";
import { useEffect, useCallback, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll while open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // createPortal escapes any overflow/transform ancestor
  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal"
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="modal-close"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </>,
    document.body
  );
}

// --- usage ---
function Page() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ overflow: "hidden" }}> {/* would trap a normal fixed child */}
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm action">
        <p>Are you sure you want to continue?</p>
        <button onClick={() => setOpen(false)}>Yes</button>
      </Modal>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Portals and event bubbling",
        np: "Portals र event bubbling",
        jp: "Portals とイベントバブリング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Even though a portal's DOM output is in `document.body`, events fired inside it bubble through the React component tree (not the DOM tree). This means a click inside a modal will bubble to the portal's parent component in React — which is usually what you want for `onClose` patterns, but can surprise you with event handlers higher in the tree that you expect to be skipped. Use `e.stopPropagation()` on the modal container if you see unexpected parent handlers firing.",
            np: "portal DOM = `document.body` तर event React component tree मा bubble। click = portal parent मा bubble। unexpected handler → `e.stopPropagation()`।",
            jp: "ポータルの DOM は `document.body` にありますが、イベントは React のコンポーネントツリーを通じてバブルします。予期しない親ハンドラが発火する場合は `e.stopPropagation()` を使います。",
          },
        },
      ],
    },
    {
      title: {
        en: "React.lazy + Suspense for code splitting",
        np: "React.lazy + Suspense — code splitting",
        jp: "React.lazy + Suspense によるコード分割",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`React.lazy(() => import('./HeavyComponent'))` creates a lazy component that is loaded on demand via a dynamic `import()`. Your bundler (webpack, Vite, Turbopack) splits the module into a separate chunk that is only fetched when the lazy component first renders. `Suspense` is the companion: it catches the pending promise thrown by the lazy component and shows a `fallback` until the chunk has loaded.",
            np: "`React.lazy` + dynamic `import()` → separate chunk, demand मा load। `Suspense` pending promise catch → `fallback` देखाउँछ जब सम्म chunk load।",
            jp: "`React.lazy` は動的 `import()` でオンデマンドロードする遅延コンポーネントを作ります。バンドラーが別チャンクに分割し、`Suspense` がロード中に `fallback` を表示します。",
          },
        },
        {
          type: "code",
          title: {
            en: "React.lazy + Suspense — route-level code splitting",
            np: "React.lazy + Suspense — route-level splitting",
            jp: "React.lazy + Suspense でルートレベル分割",
          },
          code: `import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Each lazy import becomes its own JS chunk
const HomePage    = lazy(() => import("./pages/HomePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const SettingsPage  = lazy(() => import("./pages/SettingsPage"));
// Named export: { import('./pages/AdminPage').then(m => ({ default: m.AdminPage })) }
const AdminPage   = lazy(() =>
  import("./pages/AdminPage").then((m) => ({ default: m.AdminPage }))
);

function LoadingSpinner() {
  return (
    <div className="page-spinner" aria-label="Loading page…">
      <span className="spinner" />
    </div>
  );
}

export function AppRouter() {
  return (
    // Single Suspense wraps all routes — one spinner for any route transition
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings"  element={<SettingsPage />} />
        <Route path="/admin"     element={<AdminPage />} />
      </Routes>
    </Suspense>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Suspense boundaries — nesting for granular loading states",
        np: "Suspense boundaries — granular loading को लागि nesting",
        jp: "Suspense の入れ子で細粒度ローディング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "You can nest `Suspense` boundaries just like error boundaries. The nearest ancestor `Suspense` catches the pending promise. Multiple independent lazy components in the same subtree all suspend against the same boundary, meaning they show a single spinner until all chunks load. If you want separate spinners — or want part of the page to appear instantly while another part loads — nest a `Suspense` closer to each independently loading section.",
            np: "`Suspense` nest गर्न सकिन्छ। nearest Suspense = catch। एउटै subtree = एउटै spinner। separate spinner → अलग section मा अलग Suspense।",
            jp: "`Suspense` は error boundary と同様に入れ子にできます。最も近い祖先の `Suspense` がキャッチします。独立したセクションには個別に `Suspense` を近付けることで別々のスピナーを実現できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Nested Suspense for independent section loading",
            np: "Nested Suspense — independent section loading",
            jp: "独立セクションの入れ子 Suspense",
          },
          code: `import { lazy, Suspense } from "react";

const HeavyChart   = lazy(() => import("./HeavyChart"));
const HeavyTable   = lazy(() => import("./HeavyTable"));
const HeavySidebar = lazy(() => import("./HeavySidebar"));

function Skeleton({ height }: { height: number }) {
  return <div className="skeleton" style={{ height }} aria-hidden />;
}

export function AnalyticsDashboard() {
  return (
    <div className="dashboard-grid">
      {/* Chart loads independently — its own spinner */}
      <Suspense fallback={<Skeleton height={300} />}>
        <HeavyChart />
      </Suspense>

      {/* Table loads independently */}
      <Suspense fallback={<Skeleton height={400} />}>
        <HeavyTable />
      </Suspense>

      {/* Sidebar loads independently */}
      <Suspense fallback={<Skeleton height={600} />}>
        <HeavySidebar />
      </Suspense>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Error boundary + Suspense — the production wrapper",
        np: "Error boundary + Suspense — production wrapper",
        jp: "Error boundary + Suspense の本番ラッパー",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "In production, lazy components can fail to load (network error, chunk expired after deploy). Wrap each `Suspense` with an `ErrorBoundary` so a failed chunk shows a \"Failed to load\" message with a retry button instead of breaking the tree silently. The standard order is: `ErrorBoundary` outside, `Suspense` inside — the error boundary catches both render errors and chunk-load failures.",
            np: "production मा lazy chunk fail हुन सक्छ। ErrorBoundary बाहिर + Suspense भित्र। fail chunk → \"Failed to load\" + retry। render error + chunk-load failure दुवै catch।",
            jp: "本番ではチャンクの読み込みが失敗することがあります。`ErrorBoundary` を外、`Suspense` を内に置くことでレンダーエラーとチャンクロード失敗の両方をキャッチし、リトライ付きフォールバックを表示できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "AsyncBoundary — combined ErrorBoundary + Suspense wrapper",
            np: "AsyncBoundary — ErrorBoundary + Suspense combined",
            jp: "AsyncBoundary — ErrorBoundary + Suspense の組み合わせ",
          },
          code: `import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface AsyncBoundaryProps {
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  children: ReactNode;
}

function DefaultLoadingFallback() {
  return (
    <div className="loading-state" aria-label="Loading…">
      <span className="spinner" />
    </div>
  );
}

function DefaultErrorFallback({
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert" className="error-state">
      <p>Failed to load this section.</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}

export function AsyncBoundary({
  loadingFallback = <DefaultLoadingFallback />,
  errorFallback,
  children,
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={
        (errorFallback
          ? () => <>{errorFallback}</>
          : DefaultErrorFallback) as React.ComponentType<{
          error: Error;
          resetErrorBoundary: () => void;
        }>
      }
    >
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

// --- usage ---
const HeavyReport = lazy(() => import("./HeavyReport"));

function ReportsPage() {
  return (
    <AsyncBoundary
      loadingFallback={<Skeleton height={500} />}
    >
      <HeavyReport />
    </AsyncBoundary>
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
            en: "You can now catch and recover from render errors with `ErrorBoundary` (class or `react-error-boundary`), escape DOM ancestry with `createPortal` for modals and tooltips, and split your bundle into on-demand chunks with `React.lazy` + `Suspense`. Combining all three in an `AsyncBoundary` wrapper component is the production-grade pattern for any route or independently loaded widget.",
            np: "ErrorBoundary (class/library) render error catch। createPortal modal/tooltip। React.lazy + Suspense bundle split। AsyncBoundary = production pattern।",
            jp: "Error boundary でレンダーエラーを回復、createPortal でモーダル・ツールチップの DOM 束縛を解除、React.lazy + Suspense でバンドル分割が実装できます。AsyncBoundary としてまとめるのが本番の定番パターンです。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why can't I use hooks in error boundaries?",
        np: "Error boundary मा hook किन प्रयोग गर्न सकिँदैन?",
        jp: "Error boundary で hook が使えない理由は？",
      },
      answer: {
        en: "Error boundaries rely on `getDerivedStateFromError` and `componentDidCatch`, which are class component lifecycle methods. React has not yet provided hook equivalents because the semantics are complex (the boundary must still render even when its children throw, and it runs in the commit phase). The React team has discussed a `use(ErrorBoundary)` hook but it is not stable as of React 18/19. Use `react-error-boundary` to avoid writing class components yourself.",
        np: "`getDerivedStateFromError`/`componentDidCatch` — class lifecycle। hook equivalent छैन (semantic complex)। react-error-boundary प्रयोग गर्नुस्।",
        jp: "Error boundary は `getDerivedStateFromError` と `componentDidCatch` というクラスライフサイクルに依存しています。React 18/19 時点でフック版は安定していません。`react-error-boundary` を使うと class コンポーネントを書かずに済みます。",
      },
    },
    {
      question: {
        en: "Does an error boundary catch async errors?",
        np: "Error boundary ले async error catch गर्छ?",
        jp: "Error boundary は非同期エラーをキャッチする？",
      },
      answer: {
        en: "No — error boundaries only catch errors thrown synchronously during: rendering, lifecycle methods, and class constructors. Errors in event handlers, `setTimeout` callbacks, and `async/await` code escape the boundary because they happen outside React's render cycle. You must handle those with `try/catch` / `.catch()` and set error state yourself. Some teams use a pattern of catching async errors and rethrowing them inside a `useEffect` to make them catchable by an error boundary.",
        np: "render/lifecycle/constructor synchronous error मात्र। event handler/setTimeout/async → React render cycle बाहिर। try/catch + setState। useEffect मा rethrow trick।",
        jp: "非同期エラーはキャッチしません。レンダー・ライフサイクル・コンストラクタの同期エラーだけです。非同期エラーは `try/catch` で捕捉し状態にセットします。`useEffect` で再スローすることで境界にキャッチさせるパターンもあります。",
      },
    },
    {
      question: {
        en: "How do I reset an error boundary after fixing an issue?",
        np: "Error boundary reset कसरी गर्ने?",
        jp: "Error boundary をリセットするには？",
      },
      answer: {
        en: "With `react-error-boundary`, the `FallbackComponent` receives `resetErrorBoundary` — call it from a \"Retry\" button. For programmatic reset, use the `resetKeys` prop: include any value in the array that changes when the underlying problem is resolved (e.g. `[userId]` so switching users clears the error). For the manual class component, add a `reset()` method that calls `this.setState({ hasError: false, error: null })`.",
        np: "`react-error-boundary` — `resetErrorBoundary` (Retry button)। `resetKeys` programmatic reset। manual class — `reset()` method।",
        jp: "`react-error-boundary` では `resetErrorBoundary` を Retry ボタンで呼びます。`resetKeys` に問題解決後に変わる値を入れると自動リセットできます。手作りクラスなら `setState({ hasError: false })` メソッドを追加します。",
      },
    },
    {
      question: {
        en: "When would I use a portal vs just placing the component normally?",
        np: "portal vs normal placement — कहिले portal?",
        jp: "portal と通常配置の使い分けは？",
      },
      answer: {
        en: "Use a portal when: (1) an ancestor has `overflow: hidden` or `overflow: auto` that would clip your element; (2) an ancestor has a CSS `transform`, `filter`, or `perspective` that creates a new stacking context and traps `position: fixed` descendants; (3) you need the element to be at the top of the z-index stack regardless of where it lives in the React tree. Typical candidates: modals, dropdown menus, tooltips, toast notifications, date pickers.",
        np: "`overflow:hidden` ancestor, `transform`/`filter` stacking context, z-index top চाहिए। modal, dropdown, tooltip, toast, date picker।",
        jp: "（1）`overflow:hidden` な祖先、（2）`transform`/`filter` の積み重なりコンテキスト、（3）確実に z-index の最上位にしたい場合にポータルを使います。モーダル・ドロップダウン・ツールチップ・トースト・日付ピッカーが典型例です。",
      },
    },
    {
      question: {
        en: "Does createPortal affect server-side rendering?",
        np: "createPortal ले SSR मा प्रभाव पार्छ?",
        jp: "createPortal は SSR に影響する？",
      },
      answer: {
        en: "On the server, `createPortal` renders its children inline (as if no portal existed) because there is no real DOM to target. This can cause a hydration mismatch if the client then moves the content to `document.body`. The standard fix is to gate portal rendering with a `mounted` state: set it to `true` in `useEffect` (which only runs on the client) and render the portal only when `mounted` is `true`.",
        np: "server — portal children inline render (DOM छैन)। hydration mismatch। fix: `mounted` state useEffect मा `true` → portal only client side।",
        jp: "サーバーではターゲット DOM がないため children がインラインに描画され、クライアントでの `document.body` への移動とハイドレーション不一致が起きます。`useEffect` 内で `mounted = true` にしてからポータルを描画するのが定番の対処法です。",
      },
    },
    {
      question: {
        en: "How much does code splitting actually help?",
        np: "code splitting ले वास्तवमा कति फाइदा गर्छ?",
        jp: "コード分割は実際どれだけ効果がある？",
      },
      answer: {
        en: "It depends on your bundle composition. Route-level splitting is most impactful when different routes have heavy, exclusive dependencies (a chart library only used on the analytics page, a rich text editor only on the editor route). Splitting removes those bytes from the initial bundle, directly reducing Time to Interactive. For tiny apps where the entire JS is < 100 KB gzipped, the benefit is smaller than the overhead of extra network round trips. Measure with bundle analysis tools (webpack-bundle-analyzer, Vite's rollup-plugin-visualizer) before optimising.",
        np: "route-specific heavy dependency = most impact। initial bundle size कम → TTI कम। tiny app (< 100KB) = overhead > benefit। bundle analyzer पहिले।",
        jp: "ルートごとに重い専用ライブラリがある場合に最も効果的です。TTI を直接改善します。全 JS が圧縮後 100KB 以下の小さなアプリでは、追加のネットワークラウンドトリップのオーバーヘッドが上回る場合もあります。まず bundle analyzer で計測しましょう。",
      },
    },
    {
      question: {
        en: "What is Suspense for data fetching (React 19 / experimental)?",
        np: "Suspense for data fetching (React 19) भनेको के?",
        jp: "データ取得の Suspense（React 19/実験的）とは？",
      },
      answer: {
        en: "Suspense for data fetching extends the same mechanism to async data: a component `throw`s a Promise when its data is not yet available, and the nearest `Suspense` boundary shows a fallback until the Promise resolves. React 19 introduces `use(promise)` — a hook you can call with a Promise or Context inside any component (including inside `if` blocks), which is the stable API for promise-based Suspense. Libraries like TanStack Query and SWR have offered Suspense mode for some time via `suspense: true` option.",
        np: "data Promise throw → nearest Suspense fallback। React 19 `use(promise)` — if block भित्र पनि। TanStack Query/SWR `suspense: true` पहिलेदेखि।",
        jp: "コンポーネントがデータ未取得時に Promise を throw し、最近接の `Suspense` がフォールバックを表示します。React 19 の `use(promise)` が安定 API です。TanStack Query や SWR は `suspense: true` オプションで以前から対応しています。",
      },
    },
    {
      question: {
        en: "Should I code-split every route?",
        np: "हर route code-split गर्ने?",
        jp: "すべてのルートをコード分割すべき？",
      },
      answer: {
        en: "Not necessarily. Split routes that are: heavy (large exclusive dependencies), infrequently visited (admin panels, settings), or behind authentication (loaded by a small fraction of users). Keep core routes — the landing page, main dashboard — in the initial bundle if they are loaded immediately after login. The overhead of an extra network request can exceed the savings for a 5 KB component. A pragmatic rule: lazy-load any route chunk that exceeds ~30–50 KB uncompressed.",
        np: "heavy dependency, infrequent visit (admin), auth-behind route = split। core route = initial bundle। 5KB component split = overhead। ~30-50KB uncompressed = lazy。",
        jp: "重い排他的依存・訪問頻度の低い（管理画面・設定）・認証後のルートは分割を検討します。ログイン直後に読み込まれるコアルートは初期バンドルに含めます。圧縮前で 30〜50 KB を超えるルートチャンクが遅延読み込みの目安です。",
      },
    },
  ],
  bullets: [
    {
      en: "Write a manual `ErrorBoundary` class component with `getDerivedStateFromError` and `componentDidCatch`, wrap a component that intentionally throws, and verify the fallback UI renders.",
      np: "manual ErrorBoundary — getDerivedStateFromError + componentDidCatch; throw component wrap; fallback verify।",
      jp: "手作り `ErrorBoundary` を書き、意図的に throw するコンポーネントをラップしてフォールバック UI を確認する。",
    },
    {
      en: "Replace the manual class with `react-error-boundary`, add `resetKeys={[userId]}`, and confirm the boundary auto-resets when the user ID changes.",
      np: "react-error-boundary, resetKeys=[userId]; user ID बदल्दा auto-reset confirm।",
      jp: "`react-error-boundary` に切り替え `resetKeys={[userId]}` を追加し、ユーザー ID 変更で自動リセットされることを確認する。",
    },
    {
      en: "Build a `Modal` component using `createPortal` that renders in `document.body`, closes on Escape key and outside clicks, and does not break inside a parent with `overflow: hidden`.",
      np: "createPortal Modal — document.body; Escape/outside-click close; overflow:hidden parent ठिक।",
      jp: "`createPortal` で `document.body` に描画するモーダルを作り、Escape キーと外クリックで閉じ、`overflow:hidden` 親の中でも正しく動くことを確認する。",
    },
    {
      en: "Add route-level code splitting with `React.lazy` and `Suspense`, wrap each route in an `AsyncBoundary`, and observe the network tab to confirm separate JS chunks are fetched on navigation.",
      np: "React.lazy + Suspense route-level splitting; AsyncBoundary; network tab separate chunk confirm।",
      jp: "ルートレベルのコード分割を `React.lazy` + `Suspense` で行い、各ルートを `AsyncBoundary` でラップし、ナビゲーション時にネットワークタブで別チャンクを確認する。",
    },
  ],
};
