import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 11 — Custom Hooks & Advanced Composition Patterns: useLocalStorage, useDebounce, usePrevious, useOnClickOutside, compound components, render props, useId, useTransition, useDeferredValue. */
export const REACT_DAY_11_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 11 moves beyond built-in hooks into the art of building your own. A custom hook is simply a function whose name starts with `use` and that calls other hooks inside — it extracts logic, never markup. You will build four essential utility hooks (`useLocalStorage`, `useDebounce`, `usePrevious`, `useOnClickOutside`), then study two structural patterns — Compound Components and Render Props — that let you write highly reusable, composable UI. You finish with `useId`, `useTransition`, and `useDeferredValue` for accessible forms and responsive heavy-list UIs.",
      np: "दिन ११ — custom hook: `useLocalStorage`, `useDebounce`, `usePrevious`, `useOnClickOutside`। structure pattern: Compound Component, Render Props। अन्तमा `useId`, `useTransition`, `useDeferredValue`।",
      jp: "11日目はカスタムフックの設計に踏み込みます。`useLocalStorage`・`useDebounce`・`usePrevious`・`useOnClickOutside` を自作し、Compound Components と Render Props という構造パターンを学びます。最後に `useId`・`useTransition`・`useDeferredValue` で アクセシブルなフォームと重い UI の応答性確保を扱います。",
    },
    {
      en: "Custom hooks are the primary mechanism for sharing stateful logic across components without touching the component tree structure. Unlike HOCs or render props, hooks keep JSX clean while still composing behavior freely.",
      np: "custom hook — component tree नबदली stateful logic साझा गर्ने मुख्य तरिका। HOC/render props भन्दा JSX सफा।",
      jp: "カスタムフックはコンポーネントツリーを変えずにステートフルなロジックを共有する主要な手段です。HOC やレンダープロップと比べて JSX をクリーンに保ちます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Introduction — what makes a custom hook",
        np: "परिचय — custom hook के हो",
        jp: "カスタムフックとは何か",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Any JavaScript function that starts with `use` and calls at least one React hook is a custom hook. React treats it specially: the linter enforces hook rules inside it, and each call site gets its own independent state. Custom hooks extract logic — not JSX. If you find yourself copying the same `useState` + `useEffect` pattern into multiple components, that is the signal to factor it out.",
            np: "`use` बाट सुरु + अन्दर hook call = custom hook। React ले rules enforce गर्छ। logic निकाल्ने, JSX होइन। copy-paste pattern देख्दा → factor out गर्ने संकेत।",
            jp: "`use` で始まり内部で hook を呼ぶ関数がカスタムフックです。React はルールを強制し、呼び出し元ごとに独立した状態を持ちます。JSX ではなくロジックを抽出するものです。同じ `useState`+`useEffect` パターンをコピーしているならフック化のサインです。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Name must start with `use` — the linter uses this to apply hook rules",
              np: "नाम `use` बाट सुरु — linter को लागि",
              jp: "名前は `use` で始める — linter がこれでルールを適用する",
            },
            {
              en: "Can call other hooks (including other custom hooks) at the top level",
              np: "top level मा अन्य hook (custom पनि) call गर्न सकिन्छ",
              jp: "トップレベルで他のフック（カスタムフック含む）を呼び出せる",
            },
            {
              en: "Returns whatever is useful to the caller — state, callbacks, refs, derived values",
              np: "caller लाई चाहिने कुरा return गर्ने — state, callback, ref, derived value",
              jp: "呼び出し元に便利なものを返す — 状態・コールバック・ref・派生値など",
            },
            {
              en: "Each call site is fully independent — two components using the same hook do not share state",
              np: "प्रत्येक call site स्वतन्त्र — same hook दुई ठाउँमा = state साझा होइन",
              jp: "呼び出し元ごとに完全に独立 — 同じフックを使う2つのコンポーネントは状態を共有しない",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Building useLocalStorage",
        np: "useLocalStorage बनाउने",
        jp: "useLocalStorage を作る",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useLocalStorage` wraps `useState` with a synchronisation layer to `window.localStorage`. Key concerns: JSON serialisation/deserialisation, graceful handling of `JSON.parse` errors (corrupted values), SSR safety (localStorage is browser-only — guard with `typeof window !== 'undefined'`), and keeping the React state and the stored value in sync when the hook is called.",
            np: "`useLocalStorage` = `useState` + `localStorage` sync। JSON parse error handle, SSR safe (`typeof window`), React state + storage sync।",
            jp: "`useLocalStorage` は `useState` に `localStorage` 同期層を重ねます。JSON の読み書き・パースエラーのハンドル・SSR 安全性（`typeof window`）・React 状態とストレージの同期が主な関心事です。",
          },
        },
        {
          type: "code",
          title: {
            en: "useLocalStorage — full implementation",
            np: "useLocalStorage — पूर्ण implementation",
            jp: "useLocalStorage の完全な実装",
          },
          code: `import { useState, useCallback } from "react";

function readFromStorage<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") return initialValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : initialValue;
  } catch {
    // corrupted JSON — fall back to initial value
    return initialValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readFromStorage(key, initialValue)
  );

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next =
          typeof value === "function"
            ? (value as (prev: T) => T)(prev)
            : value;
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(next));
          } catch {
            // storage full or private mode — ignore silently
          }
        }
        return next;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// Usage
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
  return (
    <button onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
      Current: {theme}
    </button>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Building useDebounce",
        np: "useDebounce बनाउने",
        jp: "useDebounce を作る",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useDebounce` delays committing a value to state until the user has stopped changing it for a given delay. This is the essential hook for search inputs that call an API — you do not want a network request per keystroke. The hook stores the latest value in `useState`, sets a `setTimeout` in a `useEffect`, and clears it whenever the value or delay changes.",
            np: "`useDebounce` — value बदल्न रोकिएपछि delay ms पछि state update। search input + API call मा essential। setTimeout + useEffect + cleanup।",
            jp: "`useDebounce` は変更が止まってから一定時間後に値を確定します。キー入力ごとに API を叩かないための必須フックです。`useEffect` で `setTimeout` をセットし、値か delay が変わるたびにクリアします。",
          },
        },
        {
          type: "code",
          title: {
            en: "useDebounce applied to a search input",
            np: "search input मा useDebounce",
            jp: "検索入力に適用した useDebounce",
          },
          code: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ---- Usage in a search component ----
function UserSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery) return;
    // only fires 500ms after the user stops typing
    fetch(\`/api/users?q=\${encodeURIComponent(debouncedQuery)}\`)
      .then((r) => r.json())
      .then(console.log);
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search users…"
    />
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Building usePrevious",
        np: "usePrevious बनाउने",
        jp: "usePrevious を作る",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`usePrevious` captures the previous render's value of any prop or state. The trick is `useRef`: a ref's `.current` is mutable and survives re-renders without causing them. Store the current value in a `useEffect` (which runs after render), so the ref lags one cycle behind — exactly the previous value.",
            np: "`usePrevious` — `useRef` मा previous value। `useEffect` render पछि — एक cycle पछाडि। trigger नगर्ने mutation।",
            jp: "`usePrevious` は ref に前回の値を保存します。`useEffect` はレンダー後に走るので ref が 1 サイクル遅れになり、ちょうど前の値になります。ref の更新は再レンダーを起こしません。",
          },
        },
        {
          type: "code",
          title: {
            en: "usePrevious — track previous prop/state",
            np: "usePrevious — previous prop/state",
            jp: "usePrevious — 前の値を追う",
          },
          code: `import { useRef, useEffect } from "react";

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  // Runs *after* render — the ref still holds the old value during this render
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current; // previous render's value
}

// ---- Usage ----
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Now: {count} | Before: {prevCount ?? "—"}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Building useOnClickOutside",
        np: "useOnClickOutside बनाउने",
        jp: "useOnClickOutside を作る",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useOnClickOutside` detects pointer events that land outside a given DOM element — the backbone of any dropdown or modal close-on-outside-click behaviour. Pass it a ref to the container and a callback; it adds a `mousedown` (and optionally `touchstart`) listener to the document, checks whether the target is inside the ref, and calls the handler if not. Clean up in the return.",
            np: "`useOnClickOutside` — ref'd element बाहिर click = callback। `mousedown`/`touchstart` document मा। target inside check → handler। cleanup return मा।",
            jp: "`useOnClickOutside` は ref の外のポインタイベントを検出します。ドロップダウン・モーダルの外側クリックで閉じる定番です。`document` に `mousedown` を登録し、クリック先が ref の内側か確認してコールバックを呼びます。",
          },
        },
        {
          type: "code",
          title: {
            en: "useOnClickOutside — dropdown close example",
            np: "useOnClickOutside — dropdown बन्द उदाहरण",
            jp: "useOnClickOutside — ドロップダウン閉じる例",
          },
          code: `import { useEffect, RefObject } from "react";

export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// ---- Usage ----
function Dropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)}>Menu</button>
      {open && (
        <ul className="dropdown-menu">
          <li>Option 1</li>
          <li>Option 2</li>
        </ul>
      )}
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Compound Component Pattern",
        np: "Compound Component Pattern",
        jp: "Compound Components パターン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Compound components are a group of components that share implicit state through React context. The parent (e.g. `Tabs`) owns the state and exposes child components (`Tab`, `TabPanel`) as named exports or static properties. Consumers get an expressive, HTML-like API — they compose children in JSX without passing state manually, because the context handles the wiring. This is the pattern used by Radix UI, Headless UI, and Reach UI.",
            np: "Compound components — context मार्फत implicit state share। parent (Tabs) ले state राख्छ; Tab, TabPanel child। consumer लाई HTML-like API। Radix/Headless UI मा यो pattern।",
            jp: "Compound Components は context で暗黙的に状態を共有するコンポーネント群です。`Tabs` が状態を持ち、`Tab`・`TabPanel` が子です。利用者は props を手で受け渡さず JSX で宣言的に組み合わせるだけです。Radix UI や Headless UI がこのパターンを採用しています。",
          },
        },
        {
          type: "code",
          title: {
            en: "Compound Tabs — TabsProvider, Tab, TabPanel via context",
            np: "Compound Tabs — context मार्फत",
            jp: "Compound Tabs — context 経由",
          },
          code: `import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

// --- context ---
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab/TabPanel must be used inside <Tabs>");
  return ctx;
}

// --- provider / root ---
export function Tabs({
  defaultTab,
  children,
}: {
  defaultTab: string;
  children: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

// --- tab button ---
export function Tab({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button
      role="tab"
      aria-selected={activeTab === id}
      onClick={() => setActiveTab(id)}
      className={activeTab === id ? "tab tab--active" : "tab"}
    >
      {children}
    </button>
  );
}

// --- panel ---
export function TabPanel({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const { activeTab } = useTabsContext();
  if (activeTab !== id) return null;
  return <div role="tabpanel">{children}</div>;
}

// --- consumer ---
function App() {
  return (
    <Tabs defaultTab="profile">
      <div role="tablist">
        <Tab id="profile">Profile</Tab>
        <Tab id="settings">Settings</Tab>
      </div>
      <TabPanel id="profile"><ProfilePane /></TabPanel>
      <TabPanel id="settings"><SettingsPane /></TabPanel>
    </Tabs>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Render Props Pattern",
        np: "Render Props Pattern",
        jp: "Render Props パターン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Render props pass a function as a prop (or as `children`) that the component calls with its internal state. The component owns the behaviour; the caller decides the markup. This decouples what a component does from what it looks like. Common uses: `DataFetcher`, `Toggle`, `MouseTracker`. Since hooks solve the same sharing problem with less ceremony, render props are now mostly seen in class-compatible libraries or when you need to pass render logic through a third-party component slot.",
            np: "Render props — function as prop/children। component = behaviour; caller = markup। DataFetcher, Toggle। hook ले कम ceremony मा same problem solve — अब library/class-compatible cases मा।",
            jp: "Render props は関数を prop（または `children`）として渡すパターンです。コンポーネントが振る舞いを持ち、呼び出し元がマークアップを決めます。フックが同じ問題を低コストで解決するため、今はライブラリや class コンポーネントとの共存時に見られます。",
          },
        },
        {
          type: "code",
          title: {
            en: "DataFetcher render-prop component",
            np: "DataFetcher render-prop component",
            jp: "DataFetcher レンダープロップコンポーネント",
          },
          code: `import { useState, useEffect, type ReactNode } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface DataFetcherProps<T> {
  url: string;
  children: (state: FetchState<T>) => ReactNode;
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ data: null, loading: true, error: null });
    fetch(url, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
        return r.json() as Promise<T>;
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e) => {
        if (e.name === "AbortError") return;
        setState({ data: null, loading: false, error: e as Error });
      });
    return () => ctrl.abort();
  }, [url]);

  return <>{children(state)}</>;
}

// --- consumer ---
function UserCard({ id }: { id: number }) {
  return (
    <DataFetcher<{ name: string; email: string }>
      url={\`/api/users/\${id}\`}
    >
      {({ data, loading, error }) => {
        if (loading) return <Spinner />;
        if (error) return <ErrorMsg message={error.message} />;
        return <p>{data!.name} — {data!.email}</p>;
      }}
    </DataFetcher>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "useId — stable IDs for accessible forms",
        np: "useId — accessible form को लागि stable ID",
        jp: "useId — アクセシブルなフォームの安定した ID",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useId` (React 18+) returns a stable, unique string per component instance that is guaranteed to match between the server render and the client hydration. Before `useId`, developers used a counter or `Math.random()` — both cause hydration mismatches where the server-generated HTML has different `id` / `for` attributes than the client-rendered tree, producing React hydration errors and broken `<label>` associations.",
            np: "`useId` (React 18+) — server/client match। counter/Math.random() → hydration mismatch। label/input pairing को लागि।",
            jp: "`useId`（React 18+）はサーバーとクライアントで一致する安定した一意 ID を返します。以前は counter や `Math.random()` を使いハイドレーション不一致が起きていました。`<label>` と `<input>` の紐付けに最適です。",
          },
        },
        {
          type: "code",
          title: {
            en: "useId for accessible label-input pairing",
            np: "useId — label/input accessible pair",
            jp: "useId でアクセシブルなラベル入力ペア",
          },
          code: `import { useId } from "react";

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}

export function FormField({
  label,
  type = "text",
  value,
  onChange,
}: FormFieldProps) {
  // Each rendered instance gets a unique, hydration-safe ID
  const id = useId();

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// Using two instances — each gets a different id automatically
function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form>
      <FormField label="Email" type="email" value={email} onChange={setEmail} />
      <FormField label="Password" type="password" value={password} onChange={setPassword} />
    </form>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "useTransition + useDeferredValue — urgent vs non-urgent updates",
        np: "useTransition + useDeferredValue — urgent vs non-urgent",
        jp: "useTransition + useDeferredValue — 緊急 vs 非緊急な更新",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React 18's concurrent features let you mark a state update as non-urgent so the browser stays responsive during heavy work. `useTransition` gives you `startTransition(fn)` — any `setState` calls inside `fn` are deferred. React can interrupt them to handle urgent events (like typing). `isPending` tells you if a transition is in flight. `useDeferredValue` works on the value side: it lags the derived value behind the latest input, letting the old content render while the new content prepares.",
            np: "`useTransition` — `startTransition` भित्र setState = non-urgent। `isPending` in-flight। `useDeferredValue` — value side lag; पुरानो content देखाउ नयाँ तयार हुन्जेल।",
            jp: "`useTransition` の `startTransition` 内の `setState` は非緊急とみなされ中断可能です。`isPending` で進行中か分かります。`useDeferredValue` は値の側で遅延させ、新しい内容の準備中に古い内容を表示します。",
          },
        },
        {
          type: "code",
          title: {
            en: "useTransition — filter a large list without blocking typing",
            np: "useTransition — typing block नगरी large list filter",
            jp: "useTransition — 入力をブロックせず大きなリストをフィルター",
          },
          code: `import { useState, useTransition, useDeferredValue, memo } from "react";

const ITEMS = Array.from({ length: 10_000 }, (_, i) => \`Item \${i + 1}\`);

// memo prevents re-render when query hasn't changed
const ItemList = memo(function ItemList({ query }: { query: string }) {
  const filtered = ITEMS.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <ul>
      {filtered.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
});

// --- useTransition approach ---
function FilterWithTransition() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value); // urgent — update the input immediately
    startTransition(() => {
      setQuery(e.target.value); // non-urgent — can be interrupted
    });
  }

  return (
    <div>
      <input value={input} onChange={handleChange} placeholder="Filter…" />
      {isPending && <span>Updating…</span>}
      <ItemList query={query} />
    </div>
  );
}

// --- useDeferredValue approach (value-side) ---
function FilterWithDeferred() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter…"
      />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <ItemList query={deferredQuery} />
      </div>
    </div>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "Choose `useTransition` when you own the state setter (you can wrap `setState` in `startTransition`). Choose `useDeferredValue` when the value comes from a parent and you cannot control when it is set — for example, a prop passed into a deep component.",
            np: "`useTransition` — आफ्नो setState wrap गर्न सक्दा। `useDeferredValue` — parent बाट prop आउँछ, control छैन।",
            jp: "`useTransition` は自分で `setState` できるとき。`useDeferredValue` は親から値が渡され設定タイミングを制御できないときに使います。",
          },
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
            en: "You can now extract reusable logic into custom hooks (`useLocalStorage`, `useDebounce`, `usePrevious`, `useOnClickOutside`), compose complex component APIs with Compound Components and Render Props, generate hydration-safe IDs with `useId`, and keep heavy renders non-blocking with `useTransition` and `useDeferredValue`.",
            np: "custom hook (useLocalStorage/useDebounce/usePrevious/useOnClickOutside), Compound Components, Render Props, useId, useTransition, useDeferredValue — सबै।",
            jp: "カスタムフック・Compound Components・Render Props・useId・useTransition・useDeferredValue の全体を押さえました。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Custom hooks vs utility functions — when do I add the `use` prefix?",
        np: "custom hook vs utility function — `use` prefix कहिले?",
        jp: "カスタムフック vs ユーティリティ関数 — いつ `use` を付ける？",
      },
      answer: {
        en: "Add `use` when the function calls at least one hook (`useState`, `useEffect`, `useRef`, or another custom hook). A plain utility that only transforms data (`formatDate`, `clamp`) never calls hooks and must not start with `use`. The distinction matters because React enforces hook rules (call at top level, not in conditions) inside any `use`-prefixed function — and the linter catches violations.",
        np: "कम्तिमा एक hook call गरे `use`। data transform मात्र = plain function। rule enforcement + linter।",
        jp: "hook を1つでも呼び出すなら `use` を付けます。データ変換のみの純関数には付けません。`use` 付きの関数には hook ルールが適用されリンターが検証します。",
      },
    },
    {
      question: {
        en: "Can custom hooks call other custom hooks?",
        np: "custom hook ले अर्को custom hook call गर्न सक्छ?",
        jp: "カスタムフックから他のカスタムフックを呼べる？",
      },
      answer: {
        en: "Yes — that is one of the most powerful aspects of the hook model. `useUserSearch` might call `useDebounce` internally, which calls `useState` and `useEffect`. The chain composes naturally, and each layer stays focused on one concern. The only rule is top-level calls — no hooks inside conditionals or loops anywhere in the chain.",
        np: "हो — hook model को शक्तिशाली पक्ष। `useUserSearch` ले `useDebounce` call; त्यसले `useState`+`useEffect`। top-level rule सर्वत्र।",
        jp: "はい。hook モデルの強力な点の一つです。`useUserSearch` が `useDebounce` を呼び、それが `useState`+`useEffect` を呼ぶ連鎖が自然に組めます。条件や ループの中で呼ばないトップレベルルールは全階層で守ります。",
      },
    },
    {
      question: {
        en: "Is the Compound Component pattern overengineering for small apps?",
        np: "Compound Component — small app मा overengineering?",
        jp: "Compound Components は小さなアプリでは過剰設計？",
      },
      answer: {
        en: "For a one-off Tabs widget used once, yes — just colocate state with the component. But the pattern pays off when: the component is used in multiple places with different layouts, third-party consumers need to customise individual sub-components, or you are building a design-system primitive. At small scale, using it anyway is good practice; just don't block on it.",
        np: "एकपटक प्रयोग = simple state colocate। अनेक ठाउँ / layout फरक / design system = compound। small scale मा practice राम्रो।",
        jp: "一箇所だけなら状態を同居させれば十分です。複数の場所で異なるレイアウト、サードパーティのカスタマイズ、デザインシステムのプリミティブならパターンが活きます。練習として使うのは良いですが必須ではありません。",
      },
    },
    {
      question: {
        en: "When should I use render props vs custom hooks?",
        np: "render props vs custom hook — कहिले?",
        jp: "render props とカスタムフックをどう使い分ける？",
      },
      answer: {
        en: "Custom hooks are the modern default: less syntax, better TypeScript inference, easier to test. Prefer render props when: you need to pass behaviour into a slot of a third-party component that does not accept hooks, you are working with class components that cannot use hooks, or you genuinely need the render function to receive the state at the JSX composition layer (not hook call site). Many libraries expose both APIs.",
        np: "custom hook = modern default। render props: third-party slot, class component, JSX layer state चाहिए। library दुवै expose गर्छन्।",
        jp: "カスタムフックが現代のデフォルトです。サードパーティのスロットに挿入する場合、クラスコンポーネントを扱う場合、JSX の組み合わせ層で状態を受け取る必要がある場合にレンダープロップが有効です。",
      },
    },
    {
      question: {
        en: "useId vs crypto.randomUUID — when to use each?",
        np: "useId vs crypto.randomUUID — कहिले कुन?",
        jp: "useId と crypto.randomUUID の使い分けは？",
      },
      answer: {
        en: "`useId` is for DOM attributes that must match between the server HTML and the client-hydrated tree (form `id`/`for`, ARIA attributes). It runs during render, is stable across renders, and is SSR-safe. `crypto.randomUUID()` generates a cryptographically random ID; use it outside of render (event handlers, data init) for entity IDs (database rows, list keys generated once). Never call it during render — it produces a new value every render and will cause hydration mismatches.",
        np: "`useId` — SSR safe, DOM attribute match। render मा। `crypto.randomUUID` — event/data init, entity ID। render मा होइन — hydration mismatch।",
        jp: "`useId` はサーバーとクライアントで一致する必要がある DOM 属性用。`crypto.randomUUID` はイベントハンドラやデータ初期化でのエンティティ ID に使います。レンダー中に `randomUUID` を呼ぶとハイドレーション不一致が起きます。",
      },
    },
    {
      question: {
        en: "What does startTransition actually do under the hood?",
        np: "startTransition भित्र के हुन्छ?",
        jp: "startTransition は内部で何をしているの？",
      },
      answer: {
        en: "When you call `startTransition(fn)`, React executes `fn` synchronously to collect the setState calls inside it, then marks those updates as \"transition\" (non-urgent) priority. React's scheduler can then yield back to the browser event loop to handle urgent events (typing, clicking) before committing the transition work. The old UI stays visible (or you see `isPending`) until React finishes preparing the new tree, which it can do in background slices.",
        np: "`startTransition` — setState collect; 'transition' priority mark। scheduler ले urgent events पहिले handle; background slices मा नया tree तयार।",
        jp: "`startTransition(fn)` を呼ぶと React は同期的に `fn` を実行して setState を収集し「transition」（非緊急）優先度でマークします。スケジューラーは緊急イベントを先に処理し、新しいツリーをバックグラウンドで準備します。",
      },
    },
    {
      question: {
        en: "useDeferredValue vs debounce — what is the difference?",
        np: "useDeferredValue vs debounce — फरक के?",
        jp: "useDeferredValue と debounce の違いは？",
      },
      answer: {
        en: "`useDebounce` waits for a fixed time (e.g. 500ms) before updating — it always introduces that delay, even on fast machines. `useDeferredValue` is adaptive: React delays the non-urgent value only when it needs to keep the browser responsive. On an idle machine, the deferred value may update immediately (no artificial delay). `useDeferredValue` also integrates with Suspense boundaries and concurrent rendering in a way debounce cannot.",
        np: "`useDebounce` — fixed delay (500ms)। `useDeferredValue` — adaptive; fast machine मा delay छैन। Suspense + concurrent rendering support।",
        jp: "`useDebounce` は固定時間（例: 500ms）待ちます。`useDeferredValue` は適応的で、暇なときは遅延なしで更新されます。また Suspense や concurrent rendering と統合されます。",
      },
    },
    {
      question: {
        en: "Can I share custom hooks between React Native and React web?",
        np: "React Native र React web बीच custom hook share गर्न सकिन्छ?",
        jp: "React Native と React web でカスタムフックを共有できる？",
      },
      answer: {
        en: "Yes, if the hook only uses platform-agnostic hooks (`useState`, `useEffect`, `useCallback`, `useRef`, `useMemo`, `useReducer`, `useContext`). Avoid hooks that touch DOM APIs (`useOnClickOutside` uses `document` — not available in React Native), `localStorage` (use AsyncStorage instead), or browser-only globals. A common pattern is a monorepo with a `packages/hooks` shared package imported by both `apps/web` and `apps/native`.",
        np: "हो — DOM-independent hook। `document`/`localStorage` = web only। monorepo `packages/hooks` share।",
        jp: "DOM に依存しないフック（`useState`・`useEffect` 等）なら共有できます。`document` や `localStorage` を使うフックは Web 専用です。monorepo の共有パッケージとして切り出すのが定番です。",
      },
    },
  ],
  bullets: [
    {
      en: "Implement `useLocalStorage<T>` with SSR guard and JSON error handling, then wire it to a theme toggle that persists across page reloads.",
      np: "useLocalStorage — SSR guard + JSON error; theme toggle persistent।",
      jp: "`useLocalStorage<T>` を SSR ガードと JSON エラー処理付きで実装し、ページリロードで永続するテーマトグルに使う。",
    },
    {
      en: "Build a search input that uses `useDebounce(500)` and fires a real (or mocked) API call only after the user stops typing. Observe the network tab.",
      np: "useDebounce(500) + search input; typing रोकेपछि मात्र API call।",
      jp: "`useDebounce(500)` を使った検索入力を作り、入力が止まってからだけ API が呼ばれることをネットワークタブで確認する。",
    },
    {
      en: "Build a `Tabs` compound component with `TabsProvider`, `Tab`, and `TabPanel` using context, then demonstrate how easily different layouts are achieved without changing the state logic.",
      np: "Tabs compound component — context; layout बदल्दा state logic नबदलिने देखाउनु।",
      jp: "context で `Tabs` Compound Component を作り、状態ロジックを変えずに異なるレイアウトを実現できることを示す。",
    },
    {
      en: "Wrap a 10,000-item list filter with `useTransition`; compare the typing responsiveness before and after with the React DevTools Profiler.",
      np: "10,000-item filter + useTransition; DevTools Profiler मा typing responsive compare।",
      jp: "1万件リストのフィルターを `useTransition` でラップし、適用前後の入力応答性を DevTools Profiler で比較する。",
    },
  ],
};
