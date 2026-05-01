import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 9 — useReducer & useContext: complex state machines, shared data, app-state pattern, Cart exercise. */
export const REACT_DAY_9_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 9 upgrades your state toolkit: `useReducer` replaces `useState` when state transitions get complex or actions share intent, and `useContext` eliminates prop-drilling by broadcasting values to any descendant. You combine them into the 'application-state pattern' — a reducer-backed context that acts as a lightweight global store — then guard against the performance trap of recreating the provider value on every render.",
      np: "दिन ९ state toolkit अपग्रेड: `useReducer` जटिल transitions मा `useState` लाई विस्थापित गर्छ, `useContext` prop-drilling हटाउँछ। दुवैलाई मिलाएर 'application-state pattern' — reducer-backed context हल्का global store — बनाउनु हुन्छ र provider value पटक-पटक recreate हुने performance trap बाट बच्नु हुन्छ।",
      jp: "9日目は状態管理を強化します。状態遷移が複雑になったとき `useState` を `useReducer` に切り替え、`useContext` で prop のバケツリレーを解消します。両者を組み合わせた「アプリ状態パターン」でリデューサーをバックにした軽量グローバルストアを作り、プロバイダの値が毎レンダーで再生成されるパフォーマンス問題も防ぎます。",
    },
    {
      en: "The day closes with a Shopping Cart exercise wiring `CartContext` + `useReducer` together with `ADD_ITEM`, `REMOVE_ITEM`, and `CLEAR_CART` actions — a pattern you will recognise in Redux, Zustand, and server-side frameworks alike.",
      np: "दिनको अन्त्यमा Shopping Cart अभ्यास: `CartContext` + `useReducer` — `ADD_ITEM`, `REMOVE_ITEM`, `CLEAR_CART` actions — Redux, Zustand मा परिचित pattern।",
      jp: "最後は Shopping Cart 演習で `CartContext` + `useReducer` に `ADD_ITEM`・`REMOVE_ITEM`・`CLEAR_CART` アクションを組み合わせます。Redux や Zustand でも見慣れたパターンです。",
    },
  ],
  sections: [
    {
      title: {
        en: "Introduction — When useState Isn't Enough",
        np: "परिचय — useState कहिले अपर्याप्त हुन्छ",
        jp: "イントロ — useState では足りないとき",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useState` works well for independent, simple values. The cracks appear when: (1) the next state depends on the previous state in a non-trivial way, (2) several state pieces must be updated atomically, (3) the same 'action intent' (e.g. 'submit form') touches multiple slices, or (4) you need to express the full set of valid states explicitly (idle / loading / error / success).",
            np: "`useState` स्वतन्त्र, सरल मान मा राम्रो। समस्या देखिन्छ जब: (1) अर्को state अघिल्लोमा जटिल निर्भर, (2) धेरै state एकैसाथ update, (3) एउटै 'action' धेरै slice छुन्छ, (4) सबै valid states स्पष्ट रूपमा व्यक्त गर्नु छ।",
            jp: "`useState` は独立したシンプルな値には向いています。しかし次の場合に限界が来ます: (1) 次の状態が前の状態に複雑に依存する、(2) 複数の状態を原子的に更新する必要がある、(3) 同じ「アクション意図」が複数のスライスに触れる、(4) 全ての有効な状態を明示的に表現したい（idle/loading/error/success）。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Switch to `useReducer` when the number of `useState` setters called together exceeds two or three.",
              np: "एकसाथ दुई-तीन भन्दा बढी `useState` setters हुँदा `useReducer` मा जानु।",
              jp: "一緒に呼ぶ `useState` セッターが 2〜3 個を超えたら `useReducer` の切り替え時。",
            },
            {
              en: "Use `useReducer` when you want reducer logic to live outside the component and be unit-tested without React.",
              np: "reducer logic component बाहिर राखेर React बिना unit test गर्न `useReducer` प्रयोग गर्नुस।",
              jp: "リデューサーのロジックをコンポーネントの外に出して React なしでテストしたいときも `useReducer` が有効です。",
            },
            {
              en: "Keep `useState` for local, isolated UI state (toggle, input value, hover) — `useReducer` adds boilerplate not worth it there.",
              np: "local, isolated UI state (toggle, input, hover) मा `useState` राख्नुस — `useReducer` त्यहाँ boilerplate मात्र थप्छ।",
              jp: "ローカルで独立した UI 状態（トグル、入力値、ホバー）には `useState` のままで。`useReducer` のボイラープレートは割に合いません。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "useReducer Basics — Dispatch, Action Types, and the Reducer Function",
        np: "useReducer आधारभूत — Dispatch, Action Types, र Reducer Function",
        jp: "useReducer の基本 — dispatch・アクション型・リデューサー関数",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useReducer(reducer, initialState)` returns `[state, dispatch]`. You call `dispatch({ type: 'INCREMENT' })` and React calls `reducer(currentState, action)` synchronously, then re-renders with the returned new state. Action types are conventionally `SCREAMING_SNAKE_CASE` string literals — use a TypeScript union to get exhaustive checking.",
            np: "`useReducer(reducer, initialState)` ले `[state, dispatch]` फर्काउँछ। `dispatch({ type: 'INCREMENT' })` भन्नु र React ले `reducer(currentState, action)` synchronously call गर्छ, नयाँ state मा re-render। Action types `SCREAMING_SNAKE_CASE` string literals — TypeScript union ले exhaustive check।",
            jp: "`useReducer(reducer, initialState)` は `[state, dispatch]` を返します。`dispatch({ type: 'INCREMENT' })` を呼ぶと React が `reducer(currentState, action)` を同期で実行し、返された新しい状態で再レンダーします。アクション型は `SCREAMING_SNAKE_CASE` の文字列リテラルが慣習で、TypeScript の判別共用体で網羅チェックができます。",
          },
        },
        {
          type: "code",
          title: {
            en: "useReducer counter — increment / decrement / reset",
            np: "useReducer counter — increment / decrement / reset",
            jp: "useReducer カウンター — increment/decrement/reset",
          },
          code: `type CounterAction =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET" };

type CounterState = { count: number };

function counterReducer(
  state: CounterState,
  action: CounterAction
): CounterState {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    case "RESET":
      return { count: 0 };
    default: {
      // TypeScript ensures this is unreachable when the union is exhaustive
      const _exhaustive: never = action;
      return state;
    }
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
    </div>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "Key insight: the reducer must be a **pure function** — same inputs always produce the same output, no side effects, no mutation. Return a new object (spread the old state and override the changed fields). Mutation is a silent bug because React does a shallow reference check to decide whether to re-render.",
            np: "मुख्य बुँदा: reducer **pure function** हुनुपर्छ — same inputs, same output, side effects छैन, mutation छैन। नयाँ object फर्काउनु (पुरानो state spread गर्नु र परिवर्तित field override गर्नु)। Mutation silent bug हो — React shallow reference check ले re-render decide गर्छ।",
            jp: "重要なポイント: リデューサーは**純粋関数**でなければなりません。同じ入力で常に同じ出力、副作用なし、ミューテーションなし。古い状態をスプレッドして変更フィールドを上書きした新しいオブジェクトを返します。ミューテーションは React の浅い参照チェックをすり抜けるサイレントバグになります。",
          },
        },
      ],
    },
    {
      title: {
        en: "Modeling State as a Discriminated Union — idle / loading / error / success",
        np: "Discriminated Union मा State — idle / loading / error / success",
        jp: "判別共用体で状態をモデリング — idle/loading/error/success",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Representing async fetch state with three independent booleans (`isLoading`, `isError`, `isSuccess`) allows impossible combinations (`isLoading && isSuccess`). A discriminated union collapses them into one mutually exclusive `status` field — the TypeScript compiler can then narrow the type in each branch.",
            np: "तीन स्वतन्त्र booleans (`isLoading`, `isError`, `isSuccess`) ले असम्भव combinations (`isLoading && isSuccess`) allow गर्छ। Discriminated union ले एउटा `status` field मा collapse गर्छ — TypeScript compiler ले प्रत्येक branch मा type narrow गर्छ।",
            jp: "三つの独立した boolean（`isLoading`/`isError`/`isSuccess`）では `isLoading && isSuccess` のような不可能な組み合わせが生まれます。判別共用体は一つの `status` フィールドに集約し、TypeScript コンパイラが各分岐で型を絞り込めます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Async status machine with discriminated union",
            np: "Discriminated union सहित async status machine",
            jp: "判別共用体による非同期ステートマシン",
          },
          code: `// --- State shape ---
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

// --- Actions ---
type FetchAction<T> =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: T }
  | { type: "FETCH_ERROR"; message: string }
  | { type: "RESET" };

function fetchReducer<T>(
  state: FetchState<T>,
  action: FetchAction<T>
): FetchState<T> {
  switch (action.type) {
    case "FETCH_START":
      return { status: "loading" };
    case "FETCH_SUCCESS":
      return { status: "success", data: action.payload };
    case "FETCH_ERROR":
      return { status: "error", message: action.message };
    case "RESET":
      return { status: "idle" };
    default: {
      const _: never = action;
      return state;
    }
  }
}

// --- Usage ---
function UserProfile({ userId }: { userId: string }) {
  const [state, dispatch] = useReducer(fetchReducer<User>, { status: "idle" });

  useEffect(() => {
    dispatch({ type: "FETCH_START" });
    fetchUser(userId)
      .then((data) => dispatch({ type: "FETCH_SUCCESS", payload: data }))
      .catch((e) => dispatch({ type: "FETCH_ERROR", message: e.message }));
  }, [userId]);

  if (state.status === "idle") return <button>Load</button>;
  if (state.status === "loading") return <Spinner />;
  if (state.status === "error") return <ErrorBanner message={state.message} />;
  // TypeScript knows: state.status === "success", state.data is User
  return <div>{state.data.name}</div>;
}`,
        },
      ],
    },
    {
      title: {
        en: "useContext — createContext, Provider, and the useContext Hook",
        np: "useContext — createContext, Provider, र useContext Hook",
        jp: "useContext — createContext・Provider・useContext フック",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`createContext(defaultValue)` creates a context object. Wrap the tree in `<Context.Provider value={...}>` to supply a value. Any descendant calls `useContext(Context)` to read it without receiving it as a prop. The default value is only used when a component renders outside any matching Provider.",
            np: "`createContext(defaultValue)` context object बनाउँछ। `<Context.Provider value={...}>` ले tree wrap गर्नु। कुनै पनि descendant ले prop बिना `useContext(Context)` ले पढ्छ। Default value provider बाहिर render हुँदा मात्र प्रयोग।",
            jp: "`createContext(defaultValue)` でコンテキストオブジェクトを作成します。`<Context.Provider value={...}>` でツリーをラップして値を提供します。すべての子孫は props なしで `useContext(Context)` で読み取れます。デフォルト値は対応する Provider の外でレンダーされた場合のみ使われます。",
          },
        },
        {
          type: "code",
          title: {
            en: "ThemeContext — createContext + Provider + useContext",
            np: "ThemeContext — createContext + Provider + useContext",
            jp: "ThemeContext — createContext + Provider + useContext",
          },
          code: `import { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

// 1. Create the context with a sensible default (or null + throw pattern)
const ThemeContext = createContext<ThemeContextValue | null>(null);
ThemeContext.displayName = "ThemeContext"; // shows in React DevTools

// 2. A custom hook that throws a friendly error if used outside the provider
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}

// 3. Provider component — owns the state
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Consumer — no prop drilling needed
function NavBar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav data-theme={theme}>
      <button onClick={toggleTheme}>Switch to {theme === "light" ? "dark" : "light"}</button>
    </nav>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "The `null + throw` pattern in the custom hook is safer than a silently wrong default: you get an early, readable error in development instead of a mysterious undefined behaviour in production.",
            np: "custom hook मा `null + throw` pattern silently wrong default भन्दा सुरक्षित: production मा mysterious undefined behaviour को सट्टा development मा early, readable error पाउनु हुन्छ।",
            jp: "カスタムフックの `null + throw` パターンは、サイレントに誤ったデフォルト値より安全です。本番環境での不可解な undefined 動作ではなく、開発時に早期の読みやすいエラーが得られます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Combining useReducer + useContext — The Application-State Pattern",
        np: "useReducer + useContext मिलाउने — Application-State Pattern",
        jp: "useReducer + useContext の組み合わせ — アプリ状態パターン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The pattern: create a context that holds both `state` and `dispatch`, wrap the app (or a subtree) in the Provider that owns the reducer, then any descendant reads state or fires actions via `useContext`. This is essentially what Redux does — React's built-in primitives are sufficient for many apps.",
            np: "Pattern: `state` र `dispatch` दुवै hold गर्ने context बनाउनु, reducer own गर्ने Provider ले app (वा subtree) wrap गर्नु, फेरि descendant ले `useContext` मार्फत state पढ्न वा actions fire गर्न सक्छ। यो Redux ले गर्ने कुरा हो — धेरै app मा React का built-in primitives पर्याप्त।",
            jp: "パターン: `state` と `dispatch` の両方を保持するコンテキストを作成し、リデューサーを所有する Provider でアプリ（またはサブツリー）をラップし、すべての子孫が `useContext` で状態を読んだりアクションを発火したりできます。これは本質的に Redux が行っていることであり、多くのアプリでは React の組み込みプリミティブで十分です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Application-state pattern skeleton",
            np: "Application-state pattern skeleton",
            jp: "アプリ状態パターンの骨子",
          },
          code: `// store/appStore.tsx
import { createContext, useContext, useReducer, useMemo } from "react";

// 1. Types
type AppState = { count: number; user: string | null };
type AppAction =
  | { type: "INCREMENT" }
  | { type: "SET_USER"; name: string }
  | { type: "LOGOUT" };

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// 2. Reducer (pure, testable without React)
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "SET_USER":
      return { ...state, user: action.name };
    case "LOGOUT":
      return { ...state, user: null };
    default: {
      const _: never = action;
      return state;
    }
  }
}

const INITIAL_STATE: AppState = { count: 0, user: null };

// 3. Context
const AppContext = createContext<AppContextValue | null>(null);
AppContext.displayName = "AppContext";

// 4. Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);
  // Wrap in useMemo so the context value object is stable when state hasn't changed
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// 5. Custom hook
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside <AppProvider>");
  return ctx;
}

// 6. Usage anywhere in the tree
function Header() {
  const { state, dispatch } = useApp();
  return (
    <header>
      <span>Count: {state.count}</span>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
    </header>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Context Performance Gotcha — Stable Provider Values",
        np: "Context Performance Gotcha — Stable Provider Values",
        jp: "コンテキストのパフォーマンス注意点 — 安定したプロバイダ値",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every time the Provider's parent re-renders, the `value={...}` object literal is a brand-new reference — which triggers every `useContext` subscriber to re-render, even if the data they read did not change. The fix is `useMemo` (or splitting into separate contexts for parts that change at different frequencies).",
            np: "Provider को parent re-render हुँदा `value={...}` object literal नयाँ reference हो — जसले हरेक `useContext` subscriber लाई re-render trigger गर्छ, उनीहरूले पढेको data परिवर्तन नभए पनि। Fix: `useMemo` (वा फरक-फरक frequency मा परिवर्तन हुने parts लाई अलग-अलग contexts)।",
            jp: "Provider の親が再レンダーするたびに `value={...}` のオブジェクトリテラルは新しい参照になり、読んでいるデータが変わっていなくても全ての `useContext` サブスクライバーが再レンダーされます。対策は `useMemo`（または変化の頻度が異なる部分を別のコンテキストに分割）です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Bad vs good — provider value stability",
            np: "गलत vs सही — provider value stability",
            jp: "悪い例 vs 良い例 — プロバイダ値の安定性",
          },
          code: `// ❌ BAD — new object every render, every consumer re-renders
function BadProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  return (
    <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
    //                   ^^^^^^^^^^^^^^^^^ new reference on every render
  );
}

// ✅ GOOD — memoized; consumers only re-render when state reference changes
function GoodProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  // dispatch is stable (never changes) — safe to omit from deps
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// ✅ ALTERNATIVE — split contexts for high/low frequency updates
const StateCtx = createContext<AppState | null>(null);
const DispatchCtx = createContext<React.Dispatch<AppAction> | null>(null);

function SplitProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  // Components that only dispatch never re-render from state changes
  return (
    <DispatchCtx.Provider value={dispatch}>
      <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
    </DispatchCtx.Provider>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "`dispatch` from `useReducer` is guaranteed stable (React never creates a new dispatch function for the same reducer instance), so it is safe to omit from `useMemo` deps and from `useEffect` deps.",
            np: "`useReducer` बाट `dispatch` stable हुन्छ (React ले एउटै reducer instance का लागि नयाँ dispatch function बनाउँदैन), त्यसैले `useMemo` deps र `useEffect` deps बाट omit गर्न सुरक्षित।",
            jp: "`useReducer` の `dispatch` は安定していることが保証されています（React は同じリデューサーインスタンスに対して新しい dispatch 関数を作りません）。そのため `useMemo` の依存配列や `useEffect` の依存配列から省略しても安全です。",
          },
        },
      ],
    },
    {
      title: {
        en: "Exercise: Shopping Cart — CartContext with useReducer",
        np: "अभ्यास: Shopping Cart — CartContext with useReducer",
        jp: "演習: ショッピングカート — useReducer 付き CartContext",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Build a `CartContext` that lets any component in the tree add items, remove items, and clear the cart — without passing callbacks through every intermediate layer. Model the cart as an array of `CartItem` objects and implement three action types.",
            np: "एउटा `CartContext` बनाउनुस् जसले tree मा कुनै पनि component लाई items add, remove, clear cart गर्न दिन्छ — हर intermediate layer मार्फत callbacks पास नगरी। Cart लाई `CartItem` objects को array मा model गर्नु र तीन action types implement गर्नु।",
            jp: "ツリーの任意のコンポーネントが中間レイヤーを通じてコールバックを渡すことなく、アイテムの追加・削除・カートのクリアができる `CartContext` を構築します。カートを `CartItem` オブジェクトの配列としてモデル化し、三つのアクション型を実装します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Full CartContext implementation",
            np: "पूर्ण CartContext implementation",
            jp: "CartContext の完全な実装",
          },
          code: `// store/CartContext.tsx
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from "react";

// --- Types ---
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type CartState = { items: CartItem[] };

type CartAction =
  | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "CLEAR_CART" };

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

// --- Reducer ---
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        // Increment quantity if item already in cart
        return {
          items: state.items.map((i) =>
            i.id === action.item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "CLEAR_CART":
      return { items: [] };
    default: {
      const _: never = action;
      return state;
    }
  }
}

// --- Context ---
const CartContext = createContext<CartContextValue | null>(null);
CartContext.displayName = "CartContext";

// --- Provider ---
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// --- Custom hook ---
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside <CartProvider>");
  const { state, dispatch } = ctx;
  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
  return { items: state.items, totalItems, totalPrice, dispatch };
}

// --- Usage in components ---
function ProductCard({ product }: { product: Omit<CartItem, "quantity"> }) {
  const { dispatch } = useCart();
  return (
    <div>
      <h3>{product.name} — \${product.price}</h3>
      <button onClick={() => dispatch({ type: "ADD_ITEM", item: product })}>
        Add to cart
      </button>
    </div>
  );
}

function CartSummary() {
  const { items, totalItems, totalPrice, dispatch } = useCart();
  return (
    <aside>
      <h2>Cart ({totalItems})</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} x{item.quantity}
            <button onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id })}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p>Total: \${totalPrice.toFixed(2)}</p>
      <button onClick={() => dispatch({ type: "CLEAR_CART" })}>Clear cart</button>
    </aside>
  );
}

// --- App root ---
function App() {
  return (
    <CartProvider>
      <ProductCard product={{ id: "1", name: "Keyboard", price: 99 }} />
      <ProductCard product={{ id: "2", name: "Mouse", price: 49 }} />
      <CartSummary />
    </CartProvider>
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
            en: "You now model complex state transitions with `useReducer` (pure reducer, discriminated union, exhaustive switch), share state to any descendant with `useContext`, compose both into an application-state pattern backed by stable, memoized provider values, and build the Shopping Cart as a concrete example of the pattern in production.",
            np: "`useReducer` (pure reducer, discriminated union, exhaustive switch) ले जटिल state transitions model गर्नु, `useContext` ले कुनै पनि descendant मा state share गर्नु, दुवैलाई stable, memoized provider values सहित application-state pattern मा compose गर्नु, र Shopping Cart लाई production मा pattern को ठोस उदाहरणको रूपमा बनाउनु।",
            jp: "`useReducer`（純粋リデューサー・判別共用体・網羅的 switch）で複雑な状態遷移をモデル化し、`useContext` で任意の子孫に状態を共有し、両者を安定したメモ化プロバイダ値を持つアプリ状態パターンに組み合わせ、Shopping Cart を本番環境でのパターンの具体例として構築できます。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "useReducer vs useState — when should I switch?",
        np: "useReducer vs useState — कहिले switch गर्ने?",
        jp: "useReducer vs useState — いつ切り替える？",
      },
      answer: {
        en: "Switch when: (1) you call multiple `setState` functions together to represent one logical event, (2) the next state depends non-trivially on the current state, (3) you want the logic in a plain function you can test without mounting a component, or (4) you need explicit state machine semantics (idle/loading/error/success). Keep `useState` for simple isolated values — `useReducer` adds boilerplate that isn't worth it for a single boolean.",
        np: "Switch गर्नु जब: (1) एउटा logical event का लागि धेरै `setState` एकसाथ, (2) अर्को state अघिल्लोमा जटिल निर्भर, (3) component mount नगरी plain function test, (4) explicit state machine (idle/loading/error/success)। Simple isolated values मा `useState` राख्नु।",
        jp: "切り替えるとき: (1) 一つの論理イベントで複数の `setState` をまとめて呼ぶ、(2) 次の状態が現在の状態に複雑に依存する、(3) コンポーネントをマウントせずに純粋関数でテストしたい、(4) 明示的なステートマシンのセマンティクスが必要。単純な独立した値には `useState` を維持します。",
      },
    },
    {
      question: {
        en: "Why is dispatch stable — do I need it in useEffect deps?",
        np: "dispatch किन stable छ — useEffect deps मा चाहिन्छ?",
        jp: "dispatch が安定している理由 — useEffect の依存配列に入れる？",
      },
      answer: {
        en: "React guarantees that the `dispatch` function from `useReducer` will be the same reference for the lifetime of the component. This means you can safely omit it from `useEffect` and `useCallback` dependency arrays without triggering stale-closure bugs. `useState`'s setter is similarly stable.",
        np: "React ले guarantee गर्छ कि `useReducer` बाट `dispatch` function component को lifetime मा same reference हुन्छ। यसले `useEffect` र `useCallback` dependency arrays बाट omit गर्न सुरक्षित बनाउँछ stale-closure bugs trigger नगरी। `useState` को setter पनि त्यस्तै stable।",
        jp: "React は `useReducer` の `dispatch` 関数がコンポーネントのライフタイム中に同じ参照であることを保証します。つまり `useEffect` や `useCallback` の依存配列からの省略がスタールクロージャのバグを引き起こさずに安全にできます。`useState` のセッターも同様に安定しています。",
      },
    },
    {
      question: {
        en: "Can I have multiple contexts in one app?",
        np: "एउटा app मा धेरै contexts राख्न सकिन्छ?",
        jp: "一つのアプリに複数のコンテキストを持てる？",
      },
      answer: {
        en: "Absolutely — multiple focused contexts are usually better than one giant context. Separate contexts for `AuthContext`, `ThemeContext`, `CartContext`, etc., mean that a theme change does not force every cart consumer to re-render. Compose providers near the root and consume only what a component actually needs.",
        np: "बिल्कुल — धेरै focused contexts प्रायः एउटा giant context भन्दा राम्रो। `AuthContext`, `ThemeContext`, `CartContext` अलग-अलग context मा राख्दा theme change ले cart consumers लाई re-render force गर्दैन। Root नजिक providers compose गर्नुस र component ले वास्तवमा चाहिने मात्र consume।",
        jp: "もちろんです。複数の focused なコンテキストは通常、一つの巨大なコンテキストより優れています。`AuthContext`・`ThemeContext`・`CartContext` などを分けることで、テーマの変更がカートのコンシューマーの再レンダーを強制しません。ルート近くでプロバイダを組み合わせ、コンポーネントは実際に必要なものだけを消費します。",
      },
    },
    {
      question: {
        en: "Context vs prop drilling vs Zustand — when to use each?",
        np: "Context vs prop drilling vs Zustand — कहिले कुन?",
        jp: "Context vs prop drilling vs Zustand — それぞれいつ使う？",
      },
      answer: {
        en: "Prop drilling is fine up to 2–3 levels — it is explicit and refactor-friendly. Reach for `useContext` when data needs to jump many levels or be consumed by many unrelated components. Reach for an external library (Zustand, Jotai, Redux Toolkit) when you need DevTools, computed selectors, subscriptions to slices of state, or cross-tab syncing — things React context alone makes awkward.",
        np: "Prop drilling 2-3 levels सम्म ठीक — explicit र refactor-friendly। data धेरै levels jump गर्नु परे वा धेरै unrelated components ले चाहिए भने `useContext`। DevTools, computed selectors, state slices को subscriptions, cross-tab sync चाहिए भने external library (Zustand, Jotai, Redux Toolkit)।",
        jp: "prop のバケツリレーは 2〜3 レベルまでは問題ありません。データが多くのレベルを超えるか、無関係な多くのコンポーネントで必要な場合は `useContext` を使います。DevTools、computed セレクタ、状態スライスのサブスクリプション、クロスタブ同期が必要な場合は外部ライブラリ（Zustand・Jotai・Redux Toolkit）を検討します。",
      },
    },
    {
      question: {
        en: "Why not put all app state into one giant context?",
        np: "सबै app state एउटा giant context मा किन नराख्ने?",
        jp: "すべてのアプリ状態を一つの巨大なコンテキストに入れない理由は？",
      },
      answer: {
        en: "Because every time any piece of state changes, every consumer of that context re-renders — including components that only care about an unrelated slice. Split contexts by update frequency and dependency to keep re-renders targeted. Alternatively, use a selector-aware library (Zustand, Jotai) which subscribes components to only the atoms they read.",
        np: "किनकि जुनसुकै state परिवर्तन हुँदा त्यो context का सबै consumers re-render हुन्छन् — unrelated slice मात्र care गर्ने components पनि। Update frequency र dependency अनुसार contexts split गर्नु। वैकल्पिक रूपमा selector-aware library (Zustand, Jotai)।",
        jp: "いずれかの状態が変わるたびにそのコンテキストのすべてのコンシューマーが再レンダーされるからです。関係のないスライスしか必要としないコンポーネントも含めて。更新頻度と依存関係によってコンテキストを分割し、再レンダーをターゲットに絞ります。代替として、セレクタ対応ライブラリ（Zustand・Jotai）を使うと読んでいる atom のみを購読できます。",
      },
    },
    {
      question: {
        en: "What is Context.displayName and why should I set it?",
        np: "Context.displayName के हो र किन set गर्ने?",
        jp: "Context.displayName とは何か、なぜ設定するべきか？",
      },
      answer: {
        en: "`displayName` is a string React DevTools uses to label the context in the component tree inspector. Without it the tree shows `Context.Provider` for every context, making debugging very hard. Set it once after creating the context: `MyContext.displayName = 'MyContext'`.",
        np: "`displayName` एक string हो जसलाई React DevTools ले component tree inspector मा context label गर्न प्रयोग गर्छ। यसबिना tree ले हर context लाई `Context.Provider` देखाउँछ, debugging गाह्रो। Context create गरेपछि एकपटक set गर्नु: `MyContext.displayName = 'MyContext'`।",
        jp: "`displayName` は React DevTools がコンポーネントツリーインスペクターでコンテキストをラベル付けするために使う文字列です。これがないとツリーはすべてのコンテキストを `Context.Provider` と表示し、デバッグが非常に難しくなります。コンテキスト作成後に一度設定します: `MyContext.displayName = 'MyContext'`。",
      },
    },
    {
      question: {
        en: "How does context work in Next.js Server Components?",
        np: "Next.js Server Components मा context कसरी काम गर्छ?",
        jp: "Next.js Server Components でコンテキストはどう機能する？",
      },
      answer: {
        en: "React Context does not work in Server Components — they run on the server and have no React state or hooks. Mark any component that uses `useContext` with `'use client'` at the top. Provider components must also be client components. A common pattern is a thin `'use client'` wrapper that supplies the context, with server components as children passed via `props.children` (server components can be passed as children to client providers).",
        np: "React Context Server Components मा काम गर्दैन — ती server मा run हुन्छन् र React state वा hooks छैन। `useContext` प्रयोग गर्ने कुनै पनि component को शीर्षमा `'use client'` राख्नु। Provider components पनि client components हुनुपर्छ। Common pattern: पातलो `'use client'` wrapper जसले context supply गर्छ, server components `props.children` मार्फत।",
        jp: "React Context は Server Components では機能しません。Server Components はサーバーで実行され、React の状態やフックを持ちません。`useContext` を使うコンポーネントには先頭に `'use client'` を付けます。Provider コンポーネントもクライアントコンポーネントである必要があります。一般的なパターンは、コンテキストを提供する薄い `'use client'` ラッパーを作り、サーバーコンポーネントを `props.children` として渡すことです。",
      },
    },
    {
      question: {
        en: "Is there a performance cost to reading from context?",
        np: "Context बाट पढ्दा performance cost छ?",
        jp: "コンテキストから読み取るパフォーマンスコストはある？",
      },
      answer: {
        en: "The cost is in re-renders, not in the read itself. `useContext` is a synchronous read — essentially free. The cost comes from the fact that when the context value changes, every component that calls `useContext` for that context re-renders. Mitigate by: keeping context values stable (useMemo), splitting contexts by change frequency, or using a library with selector support (Zustand, Jotai, use-context-selector).",
        np: "Cost read मा होइन, re-renders मा। `useContext` synchronous read हो — essentially free। Cost context value परिवर्तन हुँदा त्यो context का हर `useContext` component re-render हुनु हो। Mitigate: context values stable राख्नु (useMemo), frequency अनुसार context split, वा selector support भएको library।",
        jp: "コストは読み取り自体ではなく再レンダーにあります。`useContext` は同期読み取りで本質的に無料です。コストはコンテキスト値が変わったときにそのコンテキストの `useContext` を呼ぶすべてのコンポーネントが再レンダーすることから来ます。対策: コンテキスト値を安定させる（useMemo）、変化頻度でコンテキストを分割、セレクタをサポートするライブラリ（Zustand・Jotai・use-context-selector）の使用。",
      },
    },
  ],
  bullets: [
    {
      en: "Refactor a multi-`useState` component to `useReducer`: write the reducer, define action types as a TypeScript union, verify the exhaustive `never` branch.",
      np: "Multi-`useState` component लाई `useReducer` मा refactor: reducer लेख्नु, TypeScript union action types define, exhaustive `never` branch verify।",
      jp: "複数の `useState` コンポーネントを `useReducer` にリファクタ: リデューサーを書き、アクション型を TypeScript 共用体で定義し、網羅的 `never` 分岐を確認する。",
    },
    {
      en: "Model an async fetch with a discriminated union (idle → loading → success | error) and confirm impossible states like `{ status: 'loading', data: User }` are rejected by TypeScript.",
      np: "Discriminated union ले async fetch model गर्नु (idle → loading → success | error) र TypeScript ले `{ status: 'loading', data: User }` जस्ता impossible states reject गर्छ कि भनी confirm।",
      jp: "判別共用体で非同期取得をモデル化（idle → loading → success | error）し、`{ status: 'loading', data: User }` のような不可能な状態を TypeScript が拒否することを確認する。",
    },
    {
      en: "Build the Shopping Cart from scratch: `CartContext`, `cartReducer`, `CartProvider`, `useCart` hook, a product listing page, and a cart sidebar — wire up `ADD_ITEM`, `REMOVE_ITEM`, `CLEAR_CART`.",
      np: "Shopping Cart scratch बाट बनाउनु: `CartContext`, `cartReducer`, `CartProvider`, `useCart` hook, product listing page, cart sidebar — `ADD_ITEM`, `REMOVE_ITEM`, `CLEAR_CART` wire up।",
      jp: "Shopping Cart をゼロから構築: `CartContext`・`cartReducer`・`CartProvider`・`useCart` フック・商品一覧ページ・カートサイドバーを作り、`ADD_ITEM`・`REMOVE_ITEM`・`CLEAR_CART` を繋ぐ。",
    },
  ],
};
