import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_22_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "On Day 1 you had a single App.tsx. By now you have 22 days of React knowledge — but without intentional structure, your codebase grows into a tangled mess where changing one thing breaks another. Production architecture is the discipline of organizing code so teams can move fast without stepping on each other.\n\nAnalogy: a city without zoning laws works fine for a village but becomes chaos at city scale. Feature-folder architecture is your zoning: each neighborhood (feature) owns its streets, buildings, and utilities — and the neighborhoods talk through well-defined roads (public API).",
      np: "Production architecture ले codebase lai organized राख्छ। Feature-folder pattern ले हर feature lai आफ्नो boundary दिन्छ।",
      jp: "本番アーキテクチャはコードを整理し、チームが衝突せず動けるようにする。機能フォルダが各チームの担当範囲を明確にします。",
    },
    {
      en: "Today's topics:\n• <b>Feature-folder architecture</b> — co-locating everything a feature needs\n• <b>Barrel files and public API</b> — controlling what leaks between modules\n• <b>Data layer patterns</b> — separating API calls from UI components\n• <b>Environment strategy</b> — managing config across dev/staging/prod\n• <b>Storybook</b> — building and documenting components in isolation\n• <b>Production readiness checklist</b> — what to verify before shipping",
      np: "Feature folders, barrel files, data layer, env strategy, Storybook र production checklist cover गर्छौं।",
      jp: "機能フォルダ・バレルファイル・データ層・環境戦略・Storybook・本番チェックリストを学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Feature-folder architecture",
        np: "Feature-folder architecture",
        jp: "機能フォルダアーキテクチャ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The most common architectural mistake in React: organizing by file type instead of by feature.\n\n<b>Type-based (bad for scale):</b>\n```\nsrc/\n  components/   <- everything in one bucket\n  hooks/\n  utils/\n  services/\n```\nThis means every time you work on the `users` feature, you touch `components/UserCard.tsx`, `hooks/useUsers.ts`, `services/users.ts` — three folders, one feature. As the codebase grows, these folders become impossible to navigate.\n\n<b>Feature-based (scales well):</b>\n```\nsrc/\n  features/\n    users/       <- everything for Users in one place\n      index.ts   <- public API\n      UserCard.tsx\n      useUsers.ts\n      users.api.ts\n    products/\n      index.ts\n      ProductList.tsx\n      ...\n  shared/        <- truly shared: Button, Modal, utils\n  pages/         <- thin route components that compose features\n  app/           <- global config: router, providers, store\n```",
            np: "Type-based organization scale मा fail हुन्छ। Feature-based ले एउटा feature को सबै files एकठाउँ राख्छ।",
            jp: "型ベース整理はスケールしない。機能ベースでは1つの機能に必要な全ファイルが同じ場所に。",
          },
        },
        {
          type: "code",
          title: { en: "Feature folder with public API", np: "Feature folder structure", jp: "機能フォルダと公開API" },
          code: `// Feature folder structure
src/features/products/
├── index.ts              // PUBLIC API — only export what other features need
├── ProductList.tsx        // internal
├── ProductCard.tsx        // internal
├── ProductDetail.tsx      // internal
├── useProducts.ts         // internal custom hook
├── useProduct.ts          // internal
├── products.api.ts        // API calls (internal)
├── products.types.ts      // types (can be exported via index.ts)
└── products.test.tsx      // tests

// features/products/index.ts — the public API
export { ProductList } from './ProductList';
export { ProductDetail } from './ProductDetail';
export type { Product } from './products.types';
// NOT exporting: ProductCard, useProducts, products.api.ts
// Why: implementation details — let the feature own them

// pages/ProductsPage.tsx — ONLY imports from the public API
import { ProductList } from '@/features/products';  // ✓ through index.ts
// import { ProductCard } from '@/features/products/ProductCard'; // ✗ bypass

// The rule: cross-feature imports ALWAYS go through index.ts
// Within a feature, direct imports are fine`,
        },
      ],
    },
    {
      title: {
        en: "Data layer patterns — keeping API calls out of components",
        np: "Data layer — API calls components बाट अलग राख्ने",
        jp: "データ層 — コンポーネントから API 呼び出しを分離",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Components should describe UI, not know about HTTP. A component that calls `fetch('/api/products')` directly is tightly coupled to that endpoint — you can't test it without mocking `fetch`, can't reuse it with a different data source, and can't change the API URL without touching the component.\n\n<b>The data layer pattern separates concerns into 3 layers:</b>\n• <b>API module</b> — raw HTTP calls, returns typed data\n• <b>Query hook</b> — wraps TanStack Query around the API module, provides loading/error state\n• <b>Component</b> — receives data via props or calls the query hook, no HTTP knowledge",
            np: "Data layer ले API calls, query hooks र components अलग राख्छ। Components ले HTTP जान्नु हुँदैन।",
            jp: "データ層パターン：API モジュール・クエリフック・コンポーネントの3層分離。",
          },
        },
        {
          type: "code",
          title: { en: "3-layer data pattern", np: "3-layer data pattern", jp: "3層データパターン" },
          code: `// Layer 1: API module — only HTTP, typed return values
// features/products/products.api.ts
import { apiClient } from '@/shared/api-client';
import type { Product } from './products.types';

export const productsApi = {
  getAll: () => apiClient.get<Product[]>('/products'),
  getById: (id: string) => apiClient.get<Product>(\`/products/\${id}\`),
  create: (data: CreateProductDto) => apiClient.post<Product>('/products', data),
  update: (id: string, data: UpdateProductDto) =>
    apiClient.put<Product>(\`/products/\${id}\`, data),
  delete: (id: string) => apiClient.delete(\`/products/\${id}\`),
};

// Layer 2: Query hooks — TanStack Query wrappers
// features/products/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from './products.api';

export const PRODUCTS_KEYS = {
  all: ['products'] as const,
  detail: (id: string) => ['products', id] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEYS.all,
    queryFn: productsApi.getAll,
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS.all }),
  });
}

// Layer 3: Component — uses the hook, no HTTP
// features/products/ProductList.tsx
function ProductList() {
  const { data: products, isLoading, error } = useProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <ul>
      {products?.map(p => (
        <ProductCard key={p.id} product={p} onDelete={() => deleteProduct(p.id)} />
      ))}
    </ul>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Shared API client:</b> Instead of calling `fetch` directly, all API modules use a shared `apiClient` that handles the base URL, auth headers, and error normalization. This way, when your backend URL changes or you rotate API tokens, you update one place.",
            np: "Shared api-client ले base URL, auth headers र error normalization handle गर्छ — एकठाउँ update गर्नुपर्छ।",
            jp: "共有 apiClient がベース URL・認証ヘッダー・エラー正規化を担当 — 変更は1箇所のみ。",
          },
        },
        {
          type: "code",
          title: { en: "Shared API client", np: "Shared API client", jp: "共有 API クライアント" },
          code: `// shared/api-client.ts
import axios from 'axios';
import { authStore } from '@/features/auth/auth.store';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

// Normalize errors — unwrap axios envelope
apiClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) authStore.getState().logout();
    return Promise.reject(err.response?.data ?? err);
  }
);`,
        },
      ],
    },
    {
      title: {
        en: "Storybook — build and document components in isolation",
        np: "Storybook — components isolation मा build र document गर्ने",
        jp: "Storybook — コンポーネントを単独でビルド・ドキュメント化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Storybook is a tool for developing UI components in isolation — without needing a backend, a logged-in user, or a specific page context. Each \"story\" is a snapshot of a component in a particular state.\n\n<b>Why Storybook matters:</b>\n• Develop components without backend dependencies\n• Test edge cases visually (loading, empty, error, disabled states)\n• Automatic documentation — designers and PMs can browse components\n• Catch visual regressions before merging\n• Onboard new developers — they can explore the component library interactively",
            np: "Storybook ले components lai isolation मा develop गर्न दिन्छ। Backend नचाही design र edge cases test गर्न सकिन्छ।",
            jp: "Storybook でコンポーネントを単独開発。バックエンド不要でエッジケースをビジュアルテスト。",
          },
        },
        {
          type: "code",
          title: { en: "Installing and writing stories", np: "Storybook setup र stories", jp: "Storybook 設定とストーリー作成" },
          code: `# Install Storybook (auto-detects Vite + React)
npx storybook@latest init

# Start Storybook dev server
npm run storybook
# Opens http://localhost:6006

# Every component gets a .stories.tsx file
# features/products/ProductCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';

const meta: Meta<typeof ProductCard> = {
  title: 'Features/Products/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],         // generates docs page automatically
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

// Each named export = one "story" = one variant
export const Default: Story = {
  args: {
    product: { id: '1', name: 'Wireless Keyboard', price: 79.99, stock: 12 },
  },
};

export const OutOfStock: Story = {
  args: {
    product: { id: '2', name: 'USB Hub', price: 29.99, stock: 0 },
  },
};

export const Loading: Story = {
  render: () => <ProductCard.Skeleton />,
};

// Storybook renders each story as a live component
// you can interact with controls (args) in real time`,
        },
      ],
    },
    {
      title: {
        en: "Production readiness checklist",
        np: "Production readiness checklist",
        jp: "本番対応チェックリスト",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Before shipping to production",
            np: "Production ship गर्नु अघि",
            jp: "本番リリース前のチェック",
          },
          headers: [
            { en: "Area", np: "क्षेत्र", jp: "カテゴリ" },
            { en: "Check", np: "जाँच", jp: "確認事項" },
            { en: "How", np: "कसरी", jp: "方法" },
          ],
          rows: [
            [
              { en: "Build", np: "Build", jp: "ビルド" },
              { en: "`npm run build` succeeds without errors", np: "Build error नहोस्", jp: "ビルドエラーなし" },
              { en: "Run in CI on every PR", np: "CI मा check गर्नुहोस्", jp: "CI でPRごとに実行" },
            ],
            [
              { en: "TypeScript", np: "TypeScript", jp: "TypeScript" },
              { en: "`tsc --noEmit` passes with no errors", np: "tsc error नहोस्", jp: "型エラーなし" },
              { en: "Part of CI pipeline", np: "CI मा जोड्नुहोस्", jp: "CI パイプラインに組込" },
            ],
            [
              { en: "Tests", np: "Tests", jp: "テスト" },
              { en: "All tests pass (`npm test -- --run`)", np: "Tests pass हुनुपर्छ", jp: "全テスト通過" },
              { en: "Vitest + RTL", np: "Vitest + RTL", jp: "Vitest + RTL" },
            ],
            [
              { en: "Bundle size", np: "Bundle size", jp: "バンドルサイズ" },
              { en: "Initial JS < 200KB gzipped", np: "Initial JS < 200KB", jp: "初期 JS < 200KB" },
              { en: "rollup-plugin-visualizer", np: "Visualizer", jp: "ビジュアライザー" },
            ],
            [
              { en: "Env vars", np: "Env vars", jp: "環境変数" },
              { en: "No secrets in `.env` committed; `.env.example` exists", np: "Secrets commit नहोस्", jp: "秘密情報なし・.env.example あり" },
            ],
            [
              { en: "Routing", np: "Routing", jp: "ルーティング" },
              { en: "Direct URL navigation works (SPA redirect rule set)", np: "Direct URL काम गर्छ", jp: "直接 URL アクセスが動作" },
              { en: "Test by typing /route in browser bar", np: "Browser bar बाट test", jp: "ブラウザバーで確認" },
            ],
            [
              { en: "Accessibility", np: "Accessibility", jp: "アクセシビリティ" },
              { en: "No critical axe violations on key pages", np: "axe violations नहोस्", jp: "axe 違反なし" },
              { en: "`@axe-core/react` in dev", np: "axe dev tool", jp: "axe-core/react" },
            ],
            [
              { en: "Error handling", np: "Error handling", jp: "エラー処理" },
              { en: "ErrorBoundary wraps page-level routes", np: "ErrorBoundary छ", jp: "ErrorBoundary でルート保護" },
              { en: "Check routes/root.tsx", np: "Root check", jp: "root.tsx を確認" },
            ],
            [
              { en: "Loading states", np: "Loading states", jp: "ローディング状態" },
              { en: "Every data-fetching component shows a skeleton/spinner", np: "Skeleton/spinner छ", jp: "スケルトン/スピナーあり" },
              { en: "Throttle network in DevTools", np: "Network throttle test", jp: "DevTools でネットワーク制限" },
            ],
            [
              { en: "Performance", np: "Performance", jp: "パフォーマンス" },
              { en: "Lighthouse score > 90 on key pages", np: "Lighthouse > 90", jp: "Lighthouse スコア 90 以上" },
              { en: "Chrome DevTools Lighthouse", np: "Lighthouse", jp: "Lighthouse" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Putting it together — the 9-week React journey",
        np: "React journey को सारांश",
        jp: "React 9週間の旅の総まとめ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "You have covered the complete React stack from novice to production engineer:\n\n<b>Week 1 — Foundation:</b> What React is, JSX, Vite, components, file structure\n<b>Week 2 — Core mechanics:</b> Props, state, event handling, styling, immutability\n<b>Week 3 — Forms & API:</b> Controlled forms, RHF, Zod, useEffect, data fetching\n<b>Week 4 — Advanced hooks:</b> useReducer, useContext, performance — memo/useCallback/useMemo\n<b>Week 5 — Advanced patterns:</b> Custom hooks, compound components, error boundaries, portals, Suspense\n<b>Week 6 — TypeScript & testing:</b> Type-safe props/hooks/events, Vitest, RTL, renderHook\n<b>Week 7 — Routing & state:</b> React Router v6, Zustand, TanStack Query basics\n<b>Week 8 — Production patterns:</b> Auth flows, advanced TanStack Query, Framer Motion, accessibility\n<b>Week 9 — Production readiness:</b> Build optimization, deployment, production architecture",
            np: "22 days मा React fundamentals देखि production-grade architecture सम्म cover गर्यौं।",
            jp: "22日間でReact の基礎から本番グレードのアーキテクチャまでをカバーしました。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "<b>What makes a senior React developer:</b>\n• They write components that are easy to delete, not just easy to understand\n• They think in terms of data flow: where does the data live, who changes it, and who reads it\n• They treat the bundle size as a budget, not an afterthought\n• They write tests that give them confidence, not tests that just hit 100% coverage\n• They choose boring, proven patterns over clever new ones\n• They know when to reach for a library and when to write the 20 lines themselves\n\n<b>The last principle:</b> You don't master React by memorizing APIs. You master it by building things, getting them wrong, and understanding why.",
            np: "Senior developer components easily deletable बनाउँछन्, data flow मा सोच्छन्, bundle size budget सम्झन्छन्।",
            jp: "シニア開発者は削除しやすいコンポーネントを書き、データフローで考え、バンドルサイズを予算と捉えます。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I NOT use feature folders?",
        np: "Feature folders कहिले use नगर्ने?",
        jp: "機能フォルダを使わないべき場面は？",
      },
      answer: {
        en: "Feature folders shine when you have 3+ features and a team of 2+ developers. For a solo project with one or two features, the overhead of the structure can slow you down — a flat `components/` + `hooks/` structure works fine. The signal to switch: when you catch yourself searching for where a file lives rather than knowing instinctively.",
        np: "3+ features र 2+ developers भएमा feature folders useful हुन्छ। Solo small project मा flat structure ठिक छ।",
        jp: "機能が3つ以上・開発者2人以上のときに効果的。小規模ソロプロジェクトはフラット構成で十分。",
      },
    },
    {
      question: {
        en: "What is a barrel file and why are they controversial?",
        np: "Barrel file के हो? किन controversial?",
        jp: "バレルファイルとは？なぜ議論を呼ぶ？",
      },
      answer: {
        en: "A barrel file is an `index.ts` that re-exports from other modules — you import from the barrel instead of the concrete file. They're controversial because: (1) they can accidentally expose internal modules if you're not careful about what you export; (2) bundlers sometimes have trouble tree-shaking through barrel files; (3) they can create circular dependency issues at scale. Use them at feature boundaries (`features/products/index.ts`) but avoid deeply nested barrel files within a feature.",
        np: "Barrel file ले re-exports गर्छ। Feature boundaries मा useful छ, तर nested barrels circular dependencies ल्याउन सक्छ।",
        jp: "バレルファイルは再エクスポートする index.ts。機能境界では有用、深いネストは循環依存を生む。",
      },
    },
    {
      question: {
        en: "Do I need Storybook for every project?",
        np: "हर project मा Storybook चाहिन्छ?",
        jp: "全プロジェクトで Storybook は必要？",
      },
      answer: {
        en: "No. Storybook adds meaningful value when: (1) you have a component library used across multiple pages or projects; (2) you have designers who need to review components without running the full app; (3) you have enough components that manual regression testing becomes impractical. For a single-page app built by one developer, the value-to-overhead ratio is often too low. The alternative: write good unit tests with RTL and use the dev server with mock data.",
        np: "Component library, designer review वा manual regression impractical भएमा Storybook useful। Solo small app मा RTL tests पर्याप्त हुन सक्छ।",
        jp: "コンポーネントライブラリ・デザイナーレビュー・手動テスト困難な場合に有効。ソロ小規模アプリなら RTL テストで十分。",
      },
    },
    {
      question: {
        en: "What's the difference between `shared/` and `features/`?",
        np: "`shared/` र `features/` मा के फरक?",
        jp: "`shared/` と `features/` の違いは？",
      },
      answer: {
        en: "`features/` contains everything for a specific domain: users, products, dashboard. Each feature is owned by one team and has a clear business meaning. `shared/` contains utilities and components with no business logic that any feature can use: `Button`, `Modal`, `formatDate`, `useDebounce`. The rule: if a module needs to know what the app does (users, products, auth), it belongs in `features/`. If it could be extracted into a standalone npm package, it belongs in `shared/`.",
        np: "`features/` मा business domain-specific code, `shared/` मा business logic नभएको reusable utilities। npm package निकाल्न सकिने भए `shared/` मा।",
        jp: "`features/` はビジネスドメイン固有、`shared/` はビジネスロジックなしの汎用ユーティリティ。npm 化できるなら `shared/`。",
      },
    },
    {
      question: {
        en: "I finished the 22-day track — what next?",
        np: "22 days सकिएपछि के?",
        jp: "22日間を終えたら次は？",
      },
      answer: {
        en: "The best next steps depend on your goal:\n• <b>Full-stack</b>: Learn Next.js (App Router, server components, server actions) or Remix\n• <b>Native apps</b>: React Native + Expo — most React knowledge transfers directly\n• <b>Performance expert</b>: Deep-dive React internals (Fiber, reconciler, concurrent mode)\n• <b>Frontend infrastructure</b>: Micro-frontends, module federation, monorepo with Turborepo\n• <b>Best general advice</b>: Build a real project with a real user. Every open question from 22 days will come up, and solving them in context is how the knowledge becomes permanent.",
        np: "Next.js (full-stack), React Native (mobile), React internals (performance), वा real project build गर्नुहोस्।",
        jp: "Next.js（フルスタック）、React Native（モバイル）、React 内部構造（パフォーマンス）、または実プロジェクト構築。",
      },
    },
  ],
};
