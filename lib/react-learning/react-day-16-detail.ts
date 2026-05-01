import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 16 — Global State Management: Zustand, Context Patterns & TanStack Query. */
export const REACT_DAY_16_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 16 explores the full global-state spectrum in a React app: when plain Context + useReducer is enough, when Zustand is the right lightweight store, and when TanStack Query (React Query) removes the need to manage server state manually at all. You will build a real cart store with Zustand, wire up persistence, and handle data-fetching with useQuery and useMutation.",
      np: "दिन १६ — global state spectrum: Context + useReducer, Zustand store, TanStack Query। cart store, persistence, useQuery, useMutation।",
      jp: "16日目はグローバル状態の全体像を扱います。Context + useReducer で足りるケース、Zustand が適切な軽量ストア、そして TanStack Query でサーバー状態を手動管理する必要がなくなる場合を学びます。Zustand で実際のカートストアを構築し、永続化・useQuery・useMutation まで進めます。",
    },
    {
      en: "The guiding principle: keep server state (what lives on the server) and client/UI state (what lives only in the browser) in separate stores — TanStack Query owns the former; Zustand or Context owns the latter.",
      np: "原則: server state (TanStack Query) र client/UI state (Zustand/Context) — अलग रहोस्।",
      jp: "基本原則: サーバー状態（サーバーにあるデータ）と クライアント/UI 状態（ブラウザのみに存在するデータ）は別々のストアで管理します。TanStack Query が前者を、Zustand または Context が後者を担います。",
    },
  ],
  sections: [
    {
      title: {
        en: "Introduction — the state management spectrum",
        np: "परिचय — state management spectrum",
        jp: "イントロ — 状態管理のスペクトル",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "As apps grow, prop-drilling becomes painful and multiple components need to read or mutate the same slice of state. Solutions exist on a spectrum from built-in (Context + useReducer) through lightweight stores (Zustand, Jotai) to heavyweight (Redux Toolkit) and server-state libraries (TanStack Query, SWR). Picking the right tool prevents over-engineering and under-powering.",
            np: "app ठूलो भएपछि prop-drilling र shared state problem। spectrum: Context/useReducer → Zustand → Redux Toolkit + TanStack Query। सही tool — over/under-engineering बच्नु।",
            jp: "アプリが成長するにつれ、prop のバケツリレーが苦痛になり複数コンポーネントが同じ状態を共有する必要が出ます。解決策はスペクトルになっています: ビルトイン（Context + useReducer）→ 軽量ストア（Zustand・Jotai）→ 重厚（Redux Toolkit）→ サーバー状態ライブラリ（TanStack Query・SWR）。適切な道具選びが過剰設計と力不足の両方を防ぎます。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Server state** — data fetched from an API: loading, caching, deduplication, background refresh, pagination. Best managed by TanStack Query.",
              np: "**Server state** — API data: loading, cache, dedupe, background refresh। TanStack Query ले best।",
              jp: "**サーバー状態** — API から取得するデータ: ローディング・キャッシュ・重複排除・バックグラウンド更新・ページネーション。TanStack Query が最適。",
            },
            {
              en: "**Client/UI state** — modal open, sidebar collapsed, selected items, shopping cart. Best kept in Zustand or Context.",
              np: "**Client/UI state** — modal, sidebar, selected items, cart। Zustand/Context ले best।",
              jp: "**クライアント/UI 状態** — モーダルの開閉・サイドバーの折り畳み・選択アイテム・カート。Zustand または Context が最適。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Context + useReducer — the built-in pattern",
        np: "Context + useReducer — built-in pattern",
        jp: "Context + useReducer — ビルトインパターン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "For small to medium apps, `createContext` + `useReducer` is zero-dependency global state. A `Provider` wraps the subtree; consumers call `useContext`. Auth state and theme are classic use cases. It does not scale well past a few top-level concerns: every consumer re-renders when any value in the context changes unless you split contexts or add memoization.",
            np: "`createContext` + `useReducer` — zero-dep। Provider + useContext। auth/theme। तर धेरै consumers → हरेक re-render; context split वा memo चाहिन्छ।",
            jp: "`createContext` + `useReducer` は依存なしのグローバル状態です。`Provider` でサブツリーを囲み、消費側は `useContext` を呼びます。認証状態やテーマが典型的なユースケースです。ただしコンテキスト内の値が変わるたびに全消費者が再レンダーするため、コンテキストを分割するかメモ化が必要になります。",
          },
        },
        {
          type: "code",
          title: {
            en: "Auth context with useReducer",
            np: "useReducer सँग auth context",
            jp: "useReducer による認証コンテキスト",
          },
          code: `// src/context/AuthContext.tsx
import { createContext, useContext, useReducer } from "react";

interface User { id: string; name: string; email: string }

type AuthState = { user: User | null; isAuthenticated: boolean };
type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload, isAuthenticated: true };
    case "LOGOUT":
      return { user: null, isAuthenticated: false };
    default:
      return state;
  }
}

const initialState: AuthState = { user: null, isAuthenticated: false };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}`,
        },
      ],
    },
    {
      title: {
        en: "Zustand fundamentals — create, set, get",
        np: "Zustand fundamentals — create, set, get",
        jp: "Zustand の基本 — create・set・get",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Zustand stores are plain functions. Call `create<StateShape>()` with a callback that receives `set` and `get`; return your initial state and actions. Any component that calls `useStore(selector)` re-renders only when the selected slice changes — no Provider needed, no boilerplate.",
            np: "`create<Shape>()(callback)` — `set`, `get`; initial state + actions return। `useStore(selector)` — selected slice बदल्दा मात्र re-render। Provider नचाहिने।",
            jp: "Zustand ストアは普通の関数です。`create<StateShape>()` に `set` と `get` を受け取るコールバックを渡し、初期状態とアクションを返します。`useStore(selector)` を呼ぶコンポーネントは選択したスライスが変わったときだけ再レンダーします。Provider も定型コードも不要です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Full cart store with Zustand",
            np: "Zustand — पूर्ण cart store",
            jp: "Zustand — カートストアの全体",
          },
          code: `// src/store/cartStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  // Derived getter
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      items: [],

      addItem: (newItem) =>
        set(
          (state) => {
            const existing = state.items.find((i) => i.id === newItem.id);
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.id === newItem.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                ),
              };
            }
            return { items: [...state.items, { ...newItem, quantity: 1 }] };
          },
          false,
          "cart/addItem"
        ),

      removeItem: (id) =>
        set(
          (state) => ({ items: state.items.filter((i) => i.id !== id) }),
          false,
          "cart/removeItem"
        ),

      updateQuantity: (id, quantity) =>
        set(
          (state) => ({
            items:
              quantity <= 0
                ? state.items.filter((i) => i.id !== id)
                : state.items.map((i) =>
                    i.id === id ? { ...i, quantity } : i
                  ),
          }),
          false,
          "cart/updateQuantity"
        ),

      clearCart: () => set({ items: [] }, false, "cart/clearCart"),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "CartStore" }
  )
);`,
        },
        {
          type: "code",
          title: {
            en: "Using the cart store in components",
            np: "Component मा cart store use",
            jp: "コンポーネントでカートストアを使う",
          },
          code: `// src/components/AddToCartButton.tsx
import { useCartStore } from "../store/cartStore";

interface Props {
  product: { id: number; name: string; price: number };
}

export function AddToCartButton({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      onClick={() => addItem(product)}
      className="btn-primary"
    >
      Add to cart
    </button>
  );
}

// src/components/CartIcon.tsx — reads only itemCount (no re-render on price changes)
export function CartIcon() {
  const itemCount = useCartStore((s) => s.itemCount());
  return (
    <div className="relative">
      <ShoppingCartIcon />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Zustand actions and async — defining logic inside create()",
        np: "Zustand actions र async — create() भित्र logic",
        jp: "Zustand アクションと非同期 — create() 内にロジックを定義",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Actions in Zustand are just functions inside the `create` callback. Async actions work naturally: call `set` before (for loading state) and after (for data or error) the awaited work. This is far simpler than Redux: no action creators, no thunks, no reducers in separate files.",
            np: "Zustand action = create callback भित्रका functions। async: await अघि `set(loading)`, पछि `set(data/error)`। Redux भन्दा सरल — no thunk/action creator।",
            jp: "Zustand のアクションは `create` コールバック内の普通の関数です。非同期アクションも自然に書けます: await の前に `set(loading: true)`、後に `set(data/error)` を呼ぶだけです。Redux のような action creator・thunk・別ファイルの reducer は不要です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Async action inside Zustand store",
            np: "Zustand store भित्र async action",
            jp: "Zustand ストア内の非同期アクション",
          },
          code: `// src/store/userStore.ts
import { create } from "zustand";
import { fetchCurrentUser } from "../api/auth";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  loadUser: () => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  loading: false,
  error: null,

  loadUser: async () => {
    set({ loading: true, error: null });
    try {
      const user = await fetchCurrentUser();
      set({ user, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load user",
        loading: false,
      });
    }
  },

  clearUser: () => set({ user: null, error: null }),
}));`,
        },
      ],
    },
    {
      title: {
        en: "Zustand persistence with the persist middleware",
        np: "persist middleware सँग Zustand persistence",
        jp: "persist ミドルウェアによる Zustand の永続化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Wrap your store with `persist(fn, { name: 'key', storage: createJSONStorage(() => localStorage) })` to automatically serialize to and hydrate from localStorage (or sessionStorage, AsyncStorage for React Native). Use `partialize` to persist only a subset of state — for example, cart items but not derived loading flags.",
            np: "`persist(fn, { name, storage })` ले localStorage/sessionStorage मा auto serialize/hydrate। `partialize` ले subset मात्र persist — जस्तै items, loading नभई।",
            jp: "`persist(fn, { name, storage })` でストアを包むと localStorage（または sessionStorage・React Native の AsyncStorage）へ自動でシリアライズ・ハイドレーションします。`partialize` で一部のみ永続化できます（例: items は保存するが loading フラグは保存しない）。",
          },
        },
        {
          type: "code",
          title: {
            en: "Cart store with persist middleware",
            np: "persist middleware सँग cart store",
            jp: "persist ミドルウェア付きカートストア",
          },
          code: `// src/store/cartStore.ts (with persistence)
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        addItem: (newItem) =>
          set((state) => {
            const existing = state.items.find((i) => i.id === newItem.id);
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
                ),
              };
            }
            return { items: [...state.items, { ...newItem, quantity: 1 }] };
          }),
        removeItem: (id) =>
          set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
        clearCart: () => set({ items: [] }),
        total: () =>
          get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        itemCount: () =>
          get().items.reduce((sum, i) => sum + i.quantity, 0),
      }),
      {
        name: "cart-storage",                      // localStorage key
        storage: createJSONStorage(() => localStorage),
        // Only persist items — not derived methods (they are not serializable)
        partialize: (state) => ({ items: state.items }),
      }
    ),
    { name: "CartStore" }
  )
);`,
        },
      ],
    },
    {
      title: {
        en: "TanStack Query overview — QueryClient and QueryClientProvider",
        np: "TanStack Query — QueryClient र QueryClientProvider",
        jp: "TanStack Query の概要 — QueryClient と QueryClientProvider",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "TanStack Query manages all server-state concerns: caching, background refetching, deduplication, loading/error states, pagination, and invalidation. Create one `QueryClient` and wrap your app in `<QueryClientProvider client={queryClient}>`. All `useQuery` and `useMutation` calls share the same cache.",
            np: "TanStack Query: cache, background refetch, dedupe, loading/error, pagination, invalidation। `QueryClient` एउटा; `<QueryClientProvider>` root मा। useQuery/useMutation — एउटै cache।",
            jp: "TanStack Query はキャッシュ・バックグラウンド再取得・重複排除・ローディング/エラー状態・ページネーション・無効化などサーバー状態のすべてを管理します。`QueryClient` を一つ作り `<QueryClientProvider client={queryClient}>` でアプリを包みます。すべての `useQuery` と `useMutation` が同じキャッシュを共有します。",
          },
        },
        {
          type: "code",
          title: {
            en: "QueryClientProvider setup",
            np: "QueryClientProvider setup",
            jp: "QueryClientProvider のセットアップ",
          },
          code: `// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,     // 5 minutes
      gcTime: 1000 * 60 * 10,       // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);`,
        },
      ],
    },
    {
      title: {
        en: "useQuery — fetching data with cache awareness",
        np: "useQuery — cache aware data fetch",
        jp: "useQuery — キャッシュを意識したデータ取得",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useQuery({ queryKey, queryFn })` fetches data once (or until stale) and caches it under `queryKey`. The hook returns `{ data, isLoading, isFetching, isError, error, refetch }`. `staleTime` controls how long data is considered fresh; `gcTime` controls how long unused cached data is kept in memory.",
            np: "`useQuery({ queryKey, queryFn })` — `queryKey` अन्तर्गत cache। `{ data, isLoading, isFetching, isError, error, refetch }` return। `staleTime` — fresh कति बेर; `gcTime` — unused cache memory मा कति।",
            jp: "`useQuery({ queryKey, queryFn })` はデータを一度（または古くなるまで）取得し `queryKey` でキャッシュします。`{ data, isLoading, isFetching, isError, error, refetch }` を返します。`staleTime` は新鮮さの期間、`gcTime` は未使用キャッシュのメモリ保持時間を制御します。",
          },
        },
        {
          type: "code",
          title: {
            en: "useQuery — product list with loading, error, and data states",
            np: "useQuery — product list: loading/error/data",
            jp: "useQuery — ローディング・エラー・データ状態を持つ商品リスト",
          },
          code: `// src/api/products.ts
export async function fetchProducts(category?: string): Promise<Product[]> {
  const url = category && category !== "all"
    ? \`/api/products?category=\${category}\`
    : "/api/products";

  const res = await fetch(url);
  if (!res.ok) throw new Error(\`Failed to fetch products: \${res.status}\`);
  return res.json();
}

// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/products";

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ["products", category],     // cache key — refetches when category changes
    queryFn: () => fetchProducts(category),
    staleTime: 1000 * 60 * 2,            // 2 min — fresh enough for product lists
  });
}

// src/pages/ProductsPage.tsx
import { useProducts } from "../hooks/useProducts";

export function ProductsPage() {
  const { data: products, isLoading, isError, error } = useProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600">
        Failed to load products: {error.message}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "useMutation — POST/PUT/DELETE with cache invalidation",
        np: "useMutation — POST/PUT/DELETE + cache invalidation",
        jp: "useMutation — POST/PUT/DELETE とキャッシュ無効化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useMutation({ mutationFn })` handles writes. Call `mutate(variables)` or `mutateAsync(variables)`. On success, call `queryClient.invalidateQueries({ queryKey })` so the affected list re-fetches automatically. For instant UI updates without waiting for re-fetch, use optimistic updates: update the cache immediately in `onMutate`, then rollback in `onError`.",
            np: "`useMutation` — writes। `mutate()` / `mutateAsync()`। success → `invalidateQueries`। instant UI: `onMutate` मा cache update, `onError` मा rollback।",
            jp: "`useMutation({ mutationFn })` で書き込みを処理します。`mutate(variables)` または `mutateAsync(variables)` を呼びます。成功時に `queryClient.invalidateQueries({ queryKey })` で関連リストを自動再取得させます。再取得を待たず即座に UI を更新するには `onMutate` でキャッシュを先に更新し、`onError` でロールバックします。",
          },
        },
        {
          type: "code",
          title: {
            en: "useMutation — create product with optimistic update",
            np: "useMutation — product create + optimistic update",
            jp: "useMutation — 商品作成とオプティミスティック更新",
          },
          code: `// src/hooks/useCreateProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../api/products";
import type { Product } from "../types";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    // --- Optimistic update pattern ---
    onMutate: async (newProduct) => {
      // 1. Cancel any outgoing refetches (avoid overwriting our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // 2. Snapshot the current value for rollback
      const previousProducts = queryClient.getQueryData<Product[]>(["products"]);

      // 3. Optimistically insert the new product with a temp id
      queryClient.setQueryData<Product[]>(["products"], (old = []) => [
        ...old,
        { ...newProduct, id: Date.now(), createdAt: new Date().toISOString() },
      ]);

      // 4. Return context with snapshot
      return { previousProducts };
    },

    onError: (_err, _newProduct, context) => {
      // Rollback on failure
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
    },

    onSettled: () => {
      // Always re-sync with server after mutation (success or error)
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Usage in component
function CreateProductButton() {
  const { mutate, isPending } = useCreateProduct();

  return (
    <button
      disabled={isPending}
      onClick={() => mutate({ name: "New Widget", price: 9.99 })}
      className="btn-primary"
    >
      {isPending ? "Creating…" : "Create product"}
    </button>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Decision guide — which tool for which use case?",
        np: "Decision guide — कुन use case मा कुन tool?",
        jp: "判断ガイド — どのユースケースにどのツールを使う？",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The right tool depends on the kind of state, team size, and how much abstraction complexity is acceptable. The table below summarizes the trade-offs.",
            np: "state को प्रकार, team size, abstraction complexity — सही tool छान्न तलको table हेर्नुस्।",
            jp: "状態の種類・チームの規模・許容できる抽象化の複雑さに応じて適切なツールが変わります。以下の表でトレードオフをまとめます。",
          },
        },
        {
          type: "table",
          caption: {
            en: "State management tool comparison",
            np: "State management tool तुलना",
            jp: "状態管理ツールの比較",
          },
          headers: [
            { en: "Use case", np: "Use case", jp: "ユースケース" },
            { en: "Context + useReducer", np: "Context + useReducer", jp: "Context + useReducer" },
            { en: "Zustand", np: "Zustand", jp: "Zustand" },
            { en: "Redux Toolkit", np: "Redux Toolkit", jp: "Redux Toolkit" },
            { en: "TanStack Query", np: "TanStack Query", jp: "TanStack Query" },
          ],
          rows: [
            [
              { en: "Auth / theme (app-wide, rarely changes)", np: "Auth/theme (app-wide, rarely changes)", jp: "認証・テーマ（アプリ全体・ほぼ変化なし）" },
              { en: "Excellent", np: "उत्कृष्ट", jp: "最適" },
              { en: "Good", np: "राम्रो", jp: "良い" },
              { en: "Overkill", np: "अत्यधिक", jp: "過剰" },
              { en: "Not applicable", np: "लागू नहुने", jp: "対象外" },
            ],
            [
              { en: "Cart, sidebar, modal state", np: "Cart, sidebar, modal", jp: "カート・サイドバー・モーダル" },
              { en: "Fine for small", np: "सानो app मा ठीक", jp: "小規模ならOK" },
              { en: "Excellent", np: "उत्कृष्ट", jp: "最適" },
              { en: "Overkill", np: "अत्यधिक", jp: "過剰" },
              { en: "Not applicable", np: "लागू नहुने", jp: "対象外" },
            ],
            [
              { en: "Complex business logic with many slices", np: "Complex business logic (धेरै slices)", jp: "複雑なビジネスロジック（多数スライス）" },
              { en: "Hard to scale", np: "scale गाह्रो", jp: "スケール困難" },
              { en: "Good with slices", np: "slices सँग राम्रो", jp: "スライスで対応可" },
              { en: "Excellent", np: "उत्कृष्ट", jp: "最適" },
              { en: "Not applicable", np: "लागू नहुने", jp: "対象外" },
            ],
            [
              { en: "API data: lists, detail pages, pagination", np: "API data: list, detail, pagination", jp: "API データ（一覧・詳細・ページネーション）" },
              { en: "Manual boilerplate", np: "manual boilerplate", jp: "手動でボイラープレート" },
              { en: "Manual boilerplate", np: "manual boilerplate", jp: "手動でボイラープレート" },
              { en: "RTK Query works", np: "RTK Query ले हुन्छ", jp: "RTK Query で対応可" },
              { en: "Excellent", np: "उत्कृष्ट", jp: "最適" },
            ],
            [
              { en: "Background sync, stale-while-revalidate", np: "Background sync, SWR pattern", jp: "バックグラウンド同期・stale-while-revalidate" },
              { en: "Not built-in", np: "built-in छैन", jp: "ビルトインなし" },
              { en: "Not built-in", np: "built-in छैन", jp: "ビルトインなし" },
              { en: "Partial (polling)", np: "partial (polling)", jp: "部分的（ポーリング）" },
              { en: "Excellent", np: "उत्कृष्ट", jp: "最適" },
            ],
            [
              { en: "Optimistic updates with safe rollback", np: "Optimistic updates + rollback", jp: "オプティミスティック更新と安全なロールバック" },
              { en: "Complex to implement", np: "implement गाह्रो", jp: "実装が複雑" },
              { en: "Manual but easy", np: "manual तर सजिलो", jp: "手動だが簡単" },
              { en: "Good (RTK Query)", np: "राम्रो (RTK Query)", jp: "良い（RTK Query）" },
              { en: "Built-in pattern", np: "built-in pattern", jp: "組み込みパターン" },
            ],
            [
              { en: "Bundle size concern", np: "Bundle size concern", jp: "バンドルサイズの懸念" },
              { en: "Zero (built-in)", np: "शून्य (built-in)", jp: "ゼロ（ビルトイン）" },
              { en: "~1 kB gzipped", np: "~1 kB gzipped", jp: "~1 kB gzip 圧縮後" },
              { en: "~11 kB gzipped", np: "~11 kB gzipped", jp: "~11 kB gzip 圧縮後" },
              { en: "~13 kB gzipped", np: "~13 kB gzipped", jp: "~13 kB gzip 圧縮後" },
            ],
          ],
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
            en: "You now have the full global-state toolkit: Context + useReducer for auth and theme, Zustand for client UI state (cart, modal, sidebar) with devtools and `persist`, and TanStack Query for all server state with caching, background refresh, and optimistic updates. Using the right tool for each kind of state keeps your codebase clean, performant, and easy to reason about.",
            np: "Context/useReducer (auth/theme), Zustand + persist (UI state), TanStack Query (server state) — सही tool for सही state। codebase clean र performant।",
            jp: "認証/テーマには Context + useReducer、UI 状態（カート・モーダル・サイドバー）には devtools と persist 付き Zustand、サーバー状態にはキャッシュ・バックグラウンド更新・オプティミスティック更新を持つ TanStack Query — 適切な道具を適切な状態に使うことでコードベースが整理され、パフォーマンスも把握しやすくなります。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Zustand vs Redux — which to use for a new project?",
        np: "Zustand vs Redux — नयाँ project मा कुन?",
        jp: "Zustand と Redux — 新規プロジェクトにはどちら？",
      },
      answer: {
        en: "For most new projects, start with Zustand — it is minimal (~1 kB), requires no Provider or action creator boilerplate, and supports slices, middleware, and devtools. Reach for Redux Toolkit if you are joining an existing Redux codebase, need very fine-grained time-travel debugging, or the team already has Redux expertise. RTK Query is a strong choice if you want Redux and a built-in server-state layer.",
        np: "新규 project → Zustand (simple, ~1kB, no boilerplate)। existing Redux codebase, time-travel debug, या team expertise भए Redux Toolkit। RTK Query चाहिए भने Redux + server-state एकसाथ।",
        jp: "新規プロジェクトでは Zustand から始めるのが賢明です（~1 kB・Provider 不要・action creator 不要）。既存 Redux コードベースへの参加、高精度なタイムトラベルデバッグ、チームの Redux 習熟度が高い場合は Redux Toolkit が適します。Redux + サーバー状態層を一緒に欲しい場合は RTK Query が有力候補です。",
      },
    },
    {
      question: {
        en: "Does Zustand work with React DevTools?",
        np: "Zustand React DevTools सँग काम गर्छ?",
        jp: "Zustand は React DevTools で動作する？",
      },
      answer: {
        en: "Zustand has its own devtools via the `devtools` middleware from `zustand/middleware`. It integrates with the Redux DevTools browser extension — you can inspect state, see named action labels, and time-travel. It does not appear in the React component tree DevTools (that is `useDebugValue` territory), but the Redux DevTools panel gives you everything you need.",
        np: "`devtools` middleware → Redux DevTools extension। state inspect, action labels, time-travel। React component tree DevTools मा नआउँछ — तर Redux DevTools panel पर्याप्त।",
        jp: "Zustand には `zustand/middleware` の `devtools` ミドルウェアがあり Redux DevTools ブラウザ拡張機能と連携します。状態の確認・アクションラベル付きの履歴・タイムトラベルができます。React のコンポーネントツリー DevTools には現れませんが、Redux DevTools パネルで必要なことは全て確認できます。",
      },
    },
    {
      question: {
        en: "When should I use TanStack Query vs useEffect + fetch?",
        np: "TanStack Query vs useEffect + fetch — कहिले?",
        jp: "TanStack Query と useEffect + fetch はどう使い分ける？",
      },
      answer: {
        en: "Use `useEffect + fetch` when learning the platform, for one-off loads in small apps, or when bundle size is critical. Switch to TanStack Query when you hit any of: data shared by multiple components, background refresh requirements, deduplication across routes, pagination, or complex loading/error UX. TanStack Query is almost always worth the ~13 kB in production apps.",
        np: "`useEffect + fetch` — platform learning, small app, bundle size critical। TanStack Query — multiple components share data, background refresh, dedupe, pagination, complex UX। production app मा ~13 kB worth।",
        jp: "`useEffect + fetch` はプラットフォームを学ぶとき、小規模な単発ロード、バンドルサイズが最優先の場合に使います。複数コンポーネントがデータを共有する・バックグラウンド更新が必要・ルート間の重複排除・ページネーション・複雑な UX があれば TanStack Query に切り替えます。本番アプリでは ~13 kB はほぼ常に投資価値があります。",
      },
    },
    {
      question: {
        en: "Can I combine Zustand for UI state and TanStack Query for server state?",
        np: "Zustand (UI state) र TanStack Query (server state) combine गर्न सकिन्छ?",
        jp: "UI 状態は Zustand、サーバー状態は TanStack Query と組み合わせられる？",
      },
      answer: {
        en: "Absolutely — this is the recommended pattern. Zustand holds UI state: which modal is open, sidebar expanded, selected filters, cart items. TanStack Query holds server state: product lists, user profiles, any data that originates from an API. Neither library steps on the other; they coexist cleanly in the same app.",
        np: "हो — यही recommended pattern। Zustand: modal, sidebar, filters, cart। TanStack Query: products, users, API data। दुवै coexist गर्छन्।",
        jp: "はい — これが推奨パターンです。Zustand はモーダルの開閉・サイドバー・フィルタ選択・カートなどの UI 状態を保持します。TanStack Query は商品リスト・ユーザープロフィールなど API 由来のデータを保持します。両ライブラリは干渉せず同じアプリに共存できます。",
      },
    },
    {
      question: {
        en: "What is a query key and why does it matter?",
        np: "Query key के हो र किन महत्त्वपूर्ण छ?",
        jp: "クエリキーとは何か、なぜ重要か？",
      },
      answer: {
        en: "A query key is an array that uniquely identifies a cached query — similar to a cache key in a Map. When the key changes, TanStack Query triggers a new fetch. When you call `invalidateQueries({ queryKey: ['products'] })`, it refetches every query whose key starts with `'products'`. Design keys hierarchically: `['products']`, `['products', category]`, `['products', id]` — this makes targeted invalidation easy and precise.",
        np: "query key — cached query को unique identifier। key बदलिए new fetch। `invalidateQueries` ले key match भएका refetch। hierarchical design: `['products']`, `['products', category]`, `['products', id]` — targeted invalidation easy।",
        jp: "クエリキーはキャッシュされたクエリを一意に識別する配列です（Map のキーに相当）。キーが変わると TanStack Query が新規取得を行います。`invalidateQueries({ queryKey: ['products'] })` を呼ぶと `'products'` で始まるキーを持つすべてのクエリを再取得します。`['products']`・`['products', category]`・`['products', id]` のように階層的に設計すると部分的な無効化が簡単になります。",
      },
    },
    {
      question: {
        en: "How do I handle optimistic updates safely with rollback on error?",
        np: "Optimistic updates — error मा rollback कसरी safe गर्ने?",
        jp: "オプティミスティック更新をエラー時のロールバック付きで安全に扱うには？",
      },
      answer: {
        en: "In `useMutation`, implement three callbacks: (1) `onMutate` — cancel outgoing queries with `cancelQueries`, snapshot the current cache data, apply the optimistic change with `setQueryData`, return the snapshot as context. (2) `onError` — receive the context and call `setQueryData` to restore the snapshot. (3) `onSettled` — always call `invalidateQueries` to sync with the server, regardless of success or failure.",
        np: "`onMutate`: cancelQueries, snapshot, setQueryData (optimistic), context return। `onError`: snapshot ले rollback। `onSettled`: invalidateQueries (success/error दुवैमा)।",
        jp: "`useMutation` の 3 つのコールバックを実装します: (1) `onMutate` — `cancelQueries` で進行中のクエリをキャンセル、現在のキャッシュをスナップショット、`setQueryData` でオプティミスティック変更を適用しスナップショットをコンテキストとして返す。(2) `onError` — コンテキストを受け取り `setQueryData` でスナップショットを復元。(3) `onSettled` — 成功/失敗どちらでも `invalidateQueries` でサーバーと同期。",
      },
    },
    {
      question: {
        en: "Does Zustand replace Context entirely?",
        np: "Zustand ले Context पूर्ण replace गर्छ?",
        jp: "Zustand は Context を完全に置き換えられる？",
      },
      answer: {
        en: "Not necessarily. Context is still idiomatic for dependency injection — passing a service instance, a feature flag, or a theme object down a subtree without prop-drilling. For frequently-updated state (cart, notifications, selected items), Zustand is better because it avoids re-rendering all Context consumers. Use Context for stable config, Zustand for dynamic state.",
        np: "Context — dependency injection: service instance, feature flag, theme subtree। Zustand — frequently-updated state (cart, notifications)। Context: stable config; Zustand: dynamic state।",
        jp: "必ずしもそうではありません。Context はサービスインスタンス・フィーチャーフラグ・テーマオブジェクトをサブツリーに prop なしで注入する依存性注入として今でも有用です。頻繁に更新される状態（カート・通知・選択アイテム）には、すべての Context 消費者の再レンダーを避けられる Zustand が優れています。安定した設定は Context、動的な状態は Zustand と使い分けます。",
      },
    },
    {
      question: {
        en: "What is the difference between staleTime and gcTime in TanStack Query?",
        np: "TanStack Query मा staleTime र gcTime को फरक?",
        jp: "TanStack Query の staleTime と gcTime の違いは？",
      },
      answer: {
        en: "`staleTime` is how long data is considered fresh after it was fetched — during this window, TanStack Query will NOT refetch, even when the window regains focus. Default is 0 (always stale). `gcTime` (formerly `cacheTime`) is how long inactive (un-subscribed) cache entries are kept in memory before being garbage-collected. Default is 5 minutes. Set `staleTime` higher to reduce network traffic; set `gcTime` higher to preserve data across route unmounts.",
        np: "`staleTime` — data कति बेर fresh (window मा refetch नहोस्)। default: 0। `gcTime` (cacheTime) — unsubscribed cache कति बेर memory मा। default: 5 min। `staleTime` बढाउ → network कम; `gcTime` बढाउ → route unmount पछि पनि data preserve।",
        jp: "`staleTime` はデータ取得後に「新鮮」とみなす時間です。この間は TanStack Query はウィンドウフォーカス時でも再取得しません。デフォルトは 0（常に古い）。`gcTime`（旧 `cacheTime`）は未購読のキャッシュエントリがガベージコレクションされるまでメモリに保持される時間です。デフォルトは 5 分。`staleTime` を大きくするとネットワーク通信が減り、`gcTime` を大きくするとルートがアンマウントされても一時的にデータが保持されます。",
      },
    },
  ],
  bullets: [
    {
      en: "Build a `useCartStore` with Zustand: `addItem`, `removeItem`, `clearCart`, a derived `total()`, and wire it to a `CartIcon` component that shows the item count badge.",
      np: "Zustand `useCartStore`: addItem, removeItem, clearCart, total(); CartIcon मा item count badge।",
      jp: "Zustand で `useCartStore` を構築する: `addItem`・`removeItem`・`clearCart`・派生 `total()`、商品数バッジを表示する `CartIcon` コンポーネントに接続する。",
    },
    {
      en: "Add `persist` middleware so the cart survives page refresh, and verify with the Redux DevTools extension that action labels appear.",
      np: "`persist` middleware — cart page refresh survive। Redux DevTools मा action labels।",
      jp: "`persist` ミドルウェアでカートがページリフレッシュ後も残ることを確認し、Redux DevTools 拡張でアクションラベルが表示されることを検証する。",
    },
    {
      en: "Replace a `useEffect + fetch` data-loading pattern in an existing component with `useQuery`, and implement `useMutation` with `onMutate` optimistic update and `onError` rollback for a create operation.",
      np: "useEffect + fetch → useQuery। useMutation + onMutate (optimistic) + onError (rollback) implement।",
      jp: "既存コンポーネントの `useEffect + fetch` を `useQuery` に置き換え、作成操作に `onMutate` オプティミスティック更新と `onError` ロールバック付きの `useMutation` を実装する。",
    },
  ],
};
