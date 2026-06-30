import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_16_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "As apps grow, state management becomes a challenge. `useState` and Context work for medium-sized apps, but larger apps benefit from dedicated tools. Two categories:\n\n• <b>Client state</b> — UI toggles, user preferences, cart items — things that live in the browser. Use <b>Zustand</b>.\n• <b>Server state</b> — data fetched from an API — it needs caching, background refresh, and synchronization. Use <b>TanStack Query</b>.\n\nAnalogy: Zustand is like a shared whiteboard in the office (everyone can read and update it); TanStack Query is like a smart assistant who fetches documents from the archive, caches them on your desk, and automatically refreshes them when they might be stale.",
      np: "Zustand = client state (cart, preferences)। TanStack Query = server state (API data, caching)।",
      jp: "Zustand はクライアント状態、TanStack Query はサーバー状態（API データのキャッシュと同期）に使います。",
    },
    {
      en: "In this day we cover:\n\n• <b>Zustand</b> — creating a store, selectors, actions\n• <b>Zustand middleware</b> — `persist` (save to localStorage), `devtools` (Redux DevTools)\n• <b>TanStack Query `useQuery`</b> — fetching with caching, loading/error states\n• <b>TanStack Query `useMutation`</b> — create/update/delete with cache invalidation\n• <b>Optimistic updates</b> — instant UI feedback before the server responds\n• <b>Choosing the right tool</b> — when to use what",
      np: "Zustand store, middleware, TanStack Query useQuery/useMutation, optimistic updates, tool selection।",
      jp: "Zustand・ミドルウェア・TanStack Query の useQuery/useMutation・楽観的更新・ツール選択を網羅します。",
    },
  ],
  sections: [
    {
      title: {
        en: "Zustand — the simplest global store",
        np: "Zustand — global store",
        jp: "Zustand — シンプルなグローバルストア",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Zustand is a tiny state management library (under 1KB). No providers, no boilerplate — just a `create()` function that returns a hook. Analogy: Context + useReducer is like writing a contract in triplicate; Zustand is like a sticky note that everyone can read.\n\n<b>Key concepts:</b>\n• The store holds both <b>state</b> (data) and <b>actions</b> (functions that update state) in one object\n• Call `set()` to update state — Zustand handles re-renders automatically\n• Use <b>selectors</b> to subscribe to only part of the store — prevents unnecessary re-renders",
            np: "Zustand tiny (1KB), no boilerplate। create() ले hook return गर्छ। State र actions एकै ठाउँमा।",
            jp: "Zustand は 1KB 以下。`create()` でフックを作るだけ。state と action を同じオブジェクトに定義します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Creating and using a Zustand cart store",
            np: "Zustand cart store",
            jp: "Zustand カートストア",
          },
          code: `// stores/useCartStore.js
import { create } from "zustand";

const useCartStore = create((set) => ({
  // ── state ──────────────────────────────────────────
  items: [],

  // ── actions ────────────────────────────────────────
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateQuantity: (id, qty) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
    })),

  clearCart: () => set({ items: [] }),
}));

// ── Component usage ────────────────────────────────────
function CartIcon() {
  // Selector: only re-renders when item count changes
  const count = useCartStore((state) => state.items.length);
  return <span>{count}</span>;
}

function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button onClick={() => addItem({ id: product.id, name: product.name, qty: 1 })}>
      Add to cart
    </button>
  );
}

function CartPage() {
  // Subscribe to multiple fields at once
  const { items, removeItem, clearCart } = useCartStore();

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </li>
      ))}
      <button onClick={clearCart}>Clear all</button>
    </ul>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Zustand middleware — persist & devtools",
        np: "Zustand middleware",
        jp: "Zustand ミドルウェア",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Zustand middleware wraps your store creator to add extra behaviour:\n\n• <b>`persist`</b> — automatically saves and restores state from `localStorage`. Perfect for cart items, user preferences, theme settings — survives page refresh.\n• <b>`devtools`</b> — connects to the Redux DevTools browser extension so you can inspect state changes, time-travel debug, and see action names.\n\nCompose them by nesting: `devtools(persist(storeCreator))`.",
            np: "persist ले localStorage मा state save गर्छ। devtools ले Redux DevTools extension सँग connect गर्छ।",
            jp: "persist は localStorage に自動保存、devtools は Redux DevTools でデバッグ可能にします。",
          },
        },
        {
          type: "code",
          title: {
            en: "persist + devtools middleware",
            np: "middleware example",
            jp: "ミドルウェアの例",
          },
          code: `import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const useCartStore = create(
  devtools(
    persist(
      (set) => ({
        items: [],
        addItem: (item) => set((s) => ({ items: [...s.items, item] }), false, "cart/addItem"),
        clearCart: () => set({ items: [] }, false, "cart/clear"),
      }),
      {
        name: "cart-storage",   // key in localStorage
        // Only persist the items array, not derived values
        partialize: (state) => ({ items: state.items }),
      }
    ),
    { name: "CartStore" }       // name shown in Redux DevTools
  )
);

// Subscribe to state changes outside React (e.g. in an analytics module)
useCartStore.subscribe(
  (state) => state.items.length,  // what to watch
  (count) => analytics.track("cartUpdated", { count })
);

// Read/write state outside a component
const currentItems = useCartStore.getState().items;
useCartStore.setState({ items: [] });`,
        },
      ],
    },
    {
      title: {
        en: "TanStack Query — server state management",
        np: "TanStack Query — server state",
        jp: "TanStack Query — サーバー状態管理",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "TanStack Query manages data that comes from a server. It solves problems that `useEffect + useState` don't handle automatically:\n\n• <b>Caching</b> — the same query across different components doesn't fetch twice\n• <b>Background refetch</b> — stale data is refreshed automatically when the window refocuses\n• <b>Loading/error states</b> — `isLoading`, `isFetching`, `error` out of the box\n• <b>Deduplication</b> — multiple components requesting the same data get one network call\n\nAnalogy: `useEffect` for fetching is like going to the library yourself every time; TanStack Query is like a library subscription service that delivers updates automatically.",
            np: "TanStack Query = API data caching, background refetch, loading/error states automatic।",
            jp: "TanStack Query はキャッシュ・バックグラウンドrefetch・ローディング状態を自動で管理します。",
          },
        },
        {
          type: "code",
          title: {
            en: "QueryClient setup + useQuery examples",
            np: "useQuery examples",
            jp: "useQuery の例",
          },
          code: `// main.jsx — set up the QueryClient provider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:  1000 * 60 * 5,  // data is "fresh" for 5 minutes
      retry:      2,               // retry failed requests twice
    },
  },
});

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

// PostList.jsx — useQuery
import { useQuery } from "@tanstack/react-query";

export default function PostList() {
  const {
    data: posts,
    isLoading,
    error,
    isFetching,  // true when background-refetching
  } = useQuery({
    queryKey:  ["posts"],                          // cache key
    queryFn:   () => fetch("/api/posts").then(r => r.json()),
  });

  if (isLoading) return <p>Loading posts...</p>;
  if (error)     return <p>Error: {error.message}</p>;

  return (
    <ul>
      {isFetching && <span>Refreshing...</span>}
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}

// Query with a parameter — refetches automatically when userId changes
const { data: userPosts } = useQuery({
  queryKey: ["posts", userId],        // different key = separate cache entry
  queryFn:  () => fetch(\`/api/users/\${userId}/posts\`).then(r => r.json()),
  enabled:  !!userId,                 // don't fetch until userId is defined
});`,
        },
      ],
    },
    {
      title: {
        en: "TanStack Query — mutations and cache invalidation",
        np: "useMutation — create/update/delete",
        jp: "useMutation とキャッシュ無効化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useMutation` handles create, update, and delete operations. After a mutation succeeds, you <b>invalidate</b> the relevant queries — TanStack Query automatically refetches them so the UI shows fresh data.\n\n<b>Optimistic updates</b> go a step further: update the UI instantly before the server responds, then roll back on error. Analogy: tapping a like button — the count increments instantly (optimistic) even though the server hasn't confirmed yet.",
            np: "useMutation ले POST/PUT/DELETE handle गर्छ। onSuccess मा invalidateQueries ले fresh data fetch गर्छ।",
            jp: "useMutation で変更操作を行い、成功後に invalidateQueries でデータを自動更新します。",
          },
        },
        {
          type: "code",
          title: {
            en: "useMutation + optimistic update",
            np: "mutation + optimistic update",
            jp: "ミューテーションと楽観的更新",
          },
          code: `import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreatePost() {
  const queryClient = useQueryClient();

  // ── Basic mutation (refetch after success) ───────────────
  const { mutate, isPending } = useMutation({
    mutationFn: (newPost) =>
      fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(newPost),
      }).then(r => r.json()),

    onSuccess: () => {
      // Tell TanStack Query the posts list is now stale → refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <button onClick={() => mutate({ title: "New post" })} disabled={isPending}>
      {isPending ? "Saving..." : "Create Post"}
    </button>
  );
}

// ── Optimistic delete (instant UI, rollback on error) ────────
const deleteMutation = useMutation({
  mutationFn: (id) => fetch(\`/api/posts/\${id}\`, { method: "DELETE" }),

  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ["posts"] }); // stop in-flight refetches
    const previous = queryClient.getQueryData(["posts"]);     // snapshot
    queryClient.setQueryData(["posts"], (old) =>              // remove optimistically
      old.filter((p) => p.id !== id)
    );
    return { previous };                                      // save snapshot for rollback
  },

  onError: (_err, _id, ctx) => {
    queryClient.setQueryData(["posts"], ctx.previous);        // rollback on failure
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });   // always sync with server
  },
});`,
        },
      ],
    },
    {
      title: {
        en: "Choosing the right state tool",
        np: "सही state tool छान्नुहोस्",
        jp: "適切な状態管理ツールの選択",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>The golden rule:</b> use the simplest tool that solves the problem.\n\n• Local component state only one component cares about → `useState`\n• State shared between a few nearby components → lift state up to parent\n• App-wide UI state (theme, auth user, cart) → Zustand\n• Data from a server (posts, products, user profile) → TanStack Query\n\nThe most common mistake: using Zustand to store fetched data (then you have to manage loading/error/cache yourself). Let TanStack Query own server data; let Zustand own client state. They work great together.",
            np: "useState → local, lift state → sibling sharing, Zustand → app-wide UI, TanStack Query → server data।",
            jp: "useState は local、Zustand は app-wide UI、TanStack Query はサーバーデータ。混同しないことが重要。",
          },
        },
        {
          type: "table",
          caption: {
            en: "State management decision table",
            np: "State tool decision table",
            jp: "状態管理ツール選択表",
          },
          headers: [
            { en: "State type", np: "State type", jp: "状態の種類" },
            { en: "Tool", np: "Tool", jp: "ツール" },
            { en: "Example", np: "Example", jp: "例" },
            { en: "When NOT to use", np: "कहिले नगर्ने", jp: "使わない場面" },
          ],
          rows: [
            [
              { en: "Local UI state", np: "Local UI state", jp: "ローカルUI状態" },
              { en: "useState / useReducer", np: "useState", jp: "useState" },
              { en: "Form fields, toggle, modal open", np: "form, toggle", jp: "フォーム・モーダル開閉" },
              { en: "Never — always the first choice", np: "सधैं use गर्ने", jp: "常に最初の選択" },
            ],
            [
              { en: "Shared UI state", np: "Shared UI", jp: "共有UI状態" },
              { en: "Context (small apps) / Zustand", np: "Context/Zustand", jp: "Context / Zustand" },
              { en: "Theme, sidebar open, notifications", np: "theme, sidebar", jp: "テーマ・サイドバー" },
              { en: "If only 1–2 components need it — lift state instead", np: "少数component → lift state", jp: "1–2コンポーネントなら lift state" },
            ],
            [
              { en: "Server / API data", np: "Server data", jp: "サーバーデータ" },
              { en: "TanStack Query", np: "TanStack Query", jp: "TanStack Query" },
              { en: "Posts list, user profile, product catalog", np: "posts, user, products", jp: "投稿一覧・ユーザー情報" },
              { en: "Never store API data in Zustand", np: "Zustand मा API data नराख्नुहोस्", jp: "Zustand に API データを入れない" },
            ],
            [
              { en: "Complex client logic", np: "Complex client logic", jp: "複雑なクライアントロジック" },
              { en: "Zustand with slices", np: "Zustand", jp: "Zustand（スライス）" },
              { en: "Shopping cart, wizard steps, undo/redo", np: "cart, wizard, undo", jp: "カート・ウィザード・Undo" },
              { en: "When data primarily lives on the server", np: "server data को लागि नगर्ने", jp: "サーバーデータには不向き" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I use Zustand vs Context?",
        np: "Zustand vs Context — कहिले के?",
        jp: "Zustand と Context はどう使い分ける？",
      },
      answer: {
        en: "Context re-renders ALL consumers when its value changes — even components that don't use the changed part. This causes performance issues in large apps. Zustand uses selectors so components only re-render when their specific slice of state changes. Rule of thumb: Context is fine for low-frequency updates (theme, locale, auth user). Use Zustand when state changes frequently (cart, notifications) or you have many consumers.",
        np: "Context ले सबै consumers re-render गर्छ। Zustand ले selector ले आवश्यक component मात्र re-render गर्छ।",
        jp: "Context は変更時に全 consumer が再レンダー。Zustand は selector で必要な部分だけ再レンダーします。",
      },
    },
    {
      question: {
        en: "Does TanStack Query replace useEffect for data fetching?",
        np: "TanStack Query ले useEffect replace गर्छ?",
        jp: "TanStack Query は useEffect の代わりになる？",
      },
      answer: {
        en: "Yes, for data fetching. TanStack Query handles everything useEffect + useState does for fetching, plus: caching, deduplication, background refetch, retry logic, loading/error states, and cache invalidation. The only time to use useEffect for fetching is if you explicitly want no caching or have a one-time side effect not tied to UI.",
        np: "Data fetching को लागि हो। TanStack Query ले caching, retry, background refetch सबै handle गर्छ।",
        jp: "データ取得には TanStack Query の方が優れています。キャッシュ・リトライ・バックグラウンドrefetch を自動化します。",
      },
    },
    {
      question: {
        en: "How do I reset TanStack Query cache on logout?",
        np: "Logout मा TanStack Query cache कसरी reset गर्ने?",
        jp: "ログアウト時に TanStack Query のキャッシュをリセットするには？",
      },
      answer: {
        en: "Call `queryClient.clear()` in your logout handler — this removes ALL cached data. If you use the Zustand auth store, trigger this in the `logout` action. Place `queryClient` outside React (singleton) so it's accessible anywhere: `const queryClient = new QueryClient()` at the module level, not inside a component.",
        np: "logout handler मा `queryClient.clear()` call गर्नुहोस् — सबै cache remove हुन्छ।",
        jp: "ログアウト処理で `queryClient.clear()` を呼ぶと全キャッシュが削除されます。",
      },
    },
    {
      question: {
        en: "Can Zustand and TanStack Query work together?",
        np: "Zustand र TanStack Query सँगै use गर्न सकिन्छ?",
        jp: "Zustand と TanStack Query は一緒に使える？",
      },
      answer: {
        en: "Yes — this is the recommended pattern. Zustand manages client state (cart, auth token, UI preferences). TanStack Query manages server state (fetched data). They don't conflict. Example: Zustand stores `authToken` → TanStack Query reads it from the Zustand store to add to API request headers. `useCartStore` (Zustand) + `useProducts` query (TanStack) on the same page is completely normal.",
        np: "हो। Zustand = client state, TanStack Query = server state। दुवै एकै page मा use गर्न सकिन्छ।",
        jp: "推奨パターンです。Zustand はクライアント状態、TanStack Query はサーバーデータを担当します。",
      },
    },
    {
      question: {
        en: "What is the difference between `staleTime` and `gcTime` in TanStack Query?",
        np: "`staleTime` र `gcTime` मा के फरक?",
        jp: "`staleTime` と `gcTime` の違いは？",
      },
      answer: {
        en: "`staleTime` — how long data is considered \"fresh.\" While fresh, TanStack Query serves it from cache without refetching (default: 0 = immediately stale). `gcTime` (formerly `cacheTime`) — how long unused cache data is kept in memory before being garbage collected (default: 5 minutes). Set `staleTime: 1000 * 60 * 5` for data that changes infrequently (products, settings) to avoid unnecessary background refetches.",
        np: "staleTime = data कति देर fresh मानिन्छ। gcTime = unused cache कति देर memory मा राखिन्छ।",
        jp: "staleTime はデータが「新鮮」な期間、gcTime はキャッシュがメモリに残る期間（デフォルト5分）。",
      },
    },
  ],
};
