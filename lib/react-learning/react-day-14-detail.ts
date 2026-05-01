import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 14 — Testing React Apps: RTL, Vitest, userEvent, mocking fetch, renderHook, forms, and what not to test. */
export const REACT_DAY_14_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 14 is about testing React applications with confidence. The guiding philosophy from the Testing Library team is: test behavior, not implementation. Your tests should resemble how a real user interacts with the UI — clicking buttons, typing into fields, reading visible text — rather than inspecting component internals like state variables or private methods.",
      np: "दिन १४ React apps testing मा। Testing Library को मूल दर्शन: implementation होइन, behavior test गर्नुस्। Tests ले real user जस्तो interact गर्नु पर्छ — button click, field type, text पढ्ने — state variables वा private methods होइन।",
      jp: "14日目は React アプリのテストです。Testing Library の指針: 実装ではなく振る舞いをテストする。テストは実際のユーザーが UI を操作する方法に似せます — ボタンクリック・フィールド入力・テキスト読み取り — state 変数や内部メソッドの検査ではありません。",
    },
    {
      en: "Topics cover the Vitest + RTL setup, queries (getBy/queryBy/findBy), userEvent vs fireEvent, async testing, mocking fetch, context testing with renderWithProviders, testing custom hooks with renderHook, form testing, and what to deliberately skip.",
      np: "Topics: Vitest + RTL setup, queries (getBy/queryBy/findBy), userEvent vs fireEvent, async testing, mock fetch, context testing, renderHook, form testing, र के test नगर्ने।",
      jp: "Vitest + RTL のセットアップ・クエリ（getBy/queryBy/findBy）・userEvent と fireEvent・非同期テスト・fetch モック・コンテキストテスト・renderHook・フォームテスト・意図的にスキップすべきことを扱います。",
    },
  ],
  sections: [
    {
      title: {
        en: "Testing Philosophy — Behavior Over Implementation",
        np: "Testing दर्शन — Implementation भन्दा Behavior",
        jp: "テストの哲学 — 実装より振る舞い",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Tests that rely on component internals (state variable names, CSS class names, child component structure) break whenever you refactor — even if the user experience stays the same. Tests that rely on visible text, ARIA roles, and user gestures survive refactors because they express intent. This is the Testing Library philosophy: the more your tests resemble the way your software is used, the more confidence they give you.",
            np: "Component internals (state variable names, CSS classes, child structure) मा dependent tests refactor मा टुट्छन् — user experience नबदलिए पनि। Visible text, ARIA roles, र user gestures मा dependent tests refactor survive गर्छन् किनकि intent express गर्छन्। Testing Library दर्शन: tests ले software use हुने तरिका जत्ति resembles, confidence त्ति बढी।",
            jp: "コンポーネントの内部（state 変数名・CSS クラス・子コンポーネント構造）に依存するテストはリファクタリングで壊れます — ユーザー体験が同じでも。見えるテキスト・ARIA ロール・ユーザー操作に依存するテストはリファクタリングを生き延びます。意図を表現するからです。Testing Library の哲学: テストがソフトウェアの使われ方に似るほど、信頼性が高まります。",
          },
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Unit tests — individual components, utilities, custom hooks in isolation.",
              np: "Unit tests — individual components, utilities, custom hooks isolation मा।",
              jp: "ユニットテスト — 個々のコンポーネント・ユーティリティ・カスタムフックを単独で。",
            },
            {
              en: "Integration tests — a feature composed of several components; tests user flows through the feature.",
              np: "Integration tests — धेरै components को feature; user flow।",
              jp: "統合テスト — 複数コンポーネントで構成された機能; 機能を通したユーザーフロー。",
            },
            {
              en: "E2E tests (Playwright/Cypress) — real browser, real network; tests critical user journeys end-to-end.",
              np: "E2E tests (Playwright/Cypress) — real browser, real network; critical user journeys।",
              jp: "E2E テスト（Playwright/Cypress）— 実ブラウザ・実ネットワーク; 重要なユーザージャーニーをエンドツーエンドで。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Setup — Vitest, RTL, user-event, and jsdom",
        np: "Setup — Vitest, RTL, user-event, jsdom",
        jp: "セットアップ — Vitest・RTL・user-event・jsdom",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Vitest is Vite's native test runner — fast, ESM-first, compatible with Jest's API. React Testing Library (`@testing-library/react`) provides component rendering and DOM queries. `@testing-library/user-event` simulates realistic browser user interactions. `jsdom` provides a DOM environment in Node. `@testing-library/jest-dom` adds custom matchers like `toBeInTheDocument()`.",
            np: "Vitest — Vite को native test runner, fast, ESM-first, Jest API compatible। RTL — component rendering र DOM queries। `user-event` — realistic browser interactions simulate। `jsdom` — Node मा DOM environment। `jest-dom` — `toBeInTheDocument()` जस्ता custom matchers।",
            jp: "Vitest は Vite のネイティブテストランナー — 高速・ESM ファースト・Jest API 互換。RTL はコンポーネントレンダーと DOM クエリ。`user-event` はリアルなブラウザ操作をシミュレート。`jsdom` は Node に DOM 環境を提供。`jest-dom` は `toBeInTheDocument()` などのカスタムマッチャーを追加します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Install and configure Vitest + RTL",
            np: "Vitest + RTL install र configure गर्ने",
            jp: "Vitest + RTL のインストールと設定",
          },
          code: `# Install test dependencies
npm install -D vitest @testing-library/react @testing-library/user-event \
  @testing-library/jest-dom jsdom

# vite.config.ts — add the test block
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",        // DOM environment in Node
    globals: true,               // describe/it/expect without imports
    setupFiles: "./src/test/setup.ts",
  },
});

# src/test/setup.ts — import jest-dom matchers once
import "@testing-library/jest-dom";`,
        },
      ],
    },
    {
      title: {
        en: "Render and Query — getBy, queryBy, findBy",
        np: "Render र Query — getBy, queryBy, findBy",
        jp: "レンダーとクエリ — getBy・queryBy・findBy",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`render(<Component />)` mounts your component into a real (jsdom) DOM. Then use `screen` to query what is visible. The query prefix determines behavior on failure: `getBy*` throws if not found (assertion included); `queryBy*` returns `null` if not found (useful for asserting absence); `findBy*` is async and waits (useful for elements that appear after a network call).",
            np: "`render(<Component />)` — jsdom DOM मा mount। `screen` बाट query। `getBy*` — नभेटे throw (assertion included)। `queryBy*` — नभेटे `null` return (absence assert गर्न)। `findBy*` — async, wait गर्छ (network call पछि देखिने elements)।",
            jp: "`render(<Component />)` は jsdom の本物の DOM にマウントします。次に `screen` で見えるものをクエリします。プレフィックスで失敗時の動作が変わります: `getBy*` は見つからないと throw（アサーション内蔵）; `queryBy*` は見つからないと `null` を返す（不在のアサートに便利）; `findBy*` は非同期で待機（ネットワーク呼び出し後に現れる要素に便利）。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Query prefix cheat-sheet",
            np: "Query prefix cheat-sheet",
            jp: "クエリプレフィックスのチートシート",
          },
          headers: [
            { en: "Prefix", np: "Prefix", jp: "プレフィックス" },
            { en: "If not found", np: "नभेटे", jp: "見つからない場合" },
            { en: "Async?", np: "Async?", jp: "非同期？" },
            { en: "Use when", np: "कहाँ", jp: "使いどころ" },
          ],
          rows: [
            [
              { en: "getBy*", np: "getBy*", jp: "getBy*" },
              { en: "throws", np: "throw", jp: "スロー" },
              { en: "No", np: "होइन", jp: "いいえ" },
              { en: "element must be present right now", np: "element अहिले नै छ", jp: "要素が今すぐ存在する必要がある" },
            ],
            [
              { en: "queryBy*", np: "queryBy*", jp: "queryBy*" },
              { en: "returns null", np: "null return", jp: "null を返す" },
              { en: "No", np: "होइन", jp: "いいえ" },
              { en: "asserting element is absent", np: "element नभएको assert", jp: "要素が不在であることをアサート" },
            ],
            [
              { en: "findBy*", np: "findBy*", jp: "findBy*" },
              { en: "rejects promise", np: "promise reject", jp: "Promise を reject" },
              { en: "Yes", np: "हो", jp: "はい" },
              { en: "element appears asynchronously", np: "async element", jp: "要素が非同期に現れる" },
            ],
            [
              { en: "getAllBy*", np: "getAllBy*", jp: "getAllBy*" },
              { en: "throws", np: "throw", jp: "スロー" },
              { en: "No", np: "होइन", jp: "いいえ" },
              { en: "multiple elements expected", np: "धेरै elements", jp: "複数の要素が期待される" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Testing a Button component",
            np: "Button component test गर्ने",
            jp: "Button コンポーネントのテスト",
          },
          code: `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with the correct text", () => {
    render(<Button>Save changes</Button>);
    // getByRole is the best query — uses accessible name
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole("button", { name: /click me/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    await user.click(screen.getByRole("button", { name: /disabled/i }));

    expect(handleClick).not.toHaveBeenCalled();
  });
});`,
        },
      ],
    },
    {
      title: {
        en: "Firing Events — userEvent vs fireEvent",
        np: "Events fire गर्ने — userEvent vs fireEvent",
        jp: "イベントの発火 — userEvent と fireEvent",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`userEvent` from `@testing-library/user-event` v14+ simulates real browser interactions: typing fires keydown/keypress/input/keyup events in sequence; clicking moves focus first. `fireEvent` dispatches a single synthetic DOM event immediately — it skips the browser's natural event cascade and does not move focus. Prefer `userEvent` for all simulated interactions; use `fireEvent` only when you need a single low-level event that `userEvent` cannot easily produce.",
            np: "`userEvent` (v14+) — real browser interactions simulate: typing ले keydown/keypress/input/keyup sequence fire गर्छ; click ले focus move। `fireEvent` — single synthetic DOM event, browser event cascade skip, focus move छैन। सबै interactions मा `userEvent` prefer; single low-level event मात्र `fireEvent`।",
            jp: "`userEvent`（v14+）はリアルなブラウザ操作をシミュレート: タイプは keydown/keypress/input/keyup を順に発火; クリックは先にフォーカスを移動。`fireEvent` は単一の合成 DOM イベントをすぐにディスパッチ — ブラウザのイベントカスケードをスキップしフォーカスも移動しません。すべてのシミュレート操作に `userEvent` を優先; `userEvent` で再現しにくい単一の低レベルイベントにのみ `fireEvent`。",
          },
        },
        {
          type: "code",
          title: {
            en: "userEvent setup pattern (v14 API)",
            np: "userEvent setup pattern (v14 API)",
            jp: "userEvent セットアップパターン（v14 API）",
          },
          code: `import userEvent from "@testing-library/user-event";

// v14+ requires setup() for proper event sequencing
// Call setup() ONCE per test (outside render is fine)
it("types into an input", async () => {
  const user = userEvent.setup();
  render(<input aria-label="Username" />);

  const input = screen.getByRole("textbox", { name: /username/i });
  await user.type(input, "alice@example.com");

  expect(input).toHaveValue("alice@example.com");
});

it("selects an option", async () => {
  const user = userEvent.setup();
  render(
    <select aria-label="Country">
      <option value="np">Nepal</option>
      <option value="jp">Japan</option>
    </select>,
  );

  await user.selectOptions(
    screen.getByRole("combobox", { name: /country/i }),
    "np",
  );

  expect(screen.getByRole("combobox", { name: /country/i })).toHaveValue("np");
});`,
        },
      ],
    },
    {
      title: {
        en: "Testing Async Behavior — waitFor and findBy",
        np: "Async Behavior test — waitFor र findBy",
        jp: "非同期の振る舞いのテスト — waitFor と findBy",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When a component fetches data, it renders a loading state first, then transitions to data or error. Test all three states. `findBy*` queries poll the DOM until the element appears (default timeout 1000ms). `waitFor` runs a callback repeatedly until it stops throwing — use it when `findBy` does not fit (e.g. waiting for an element to disappear, or asserting multiple things).",
            np: "Component data fetch गर्दा: loading → data/error। तीनवटै states test गर्नुस्। `findBy*` — DOM poll, element नदेखाउञ्जेल (default 1000ms)। `waitFor` — callback repeatedly run, throw नगरुञ्जेल — `findBy` नभएको ठाउँमा।",
            jp: "コンポーネントがデータを取得するとき、最初にローディング状態をレンダーし、その後データまたはエラーへ遷移します。3つの状態すべてをテストします。`findBy*` は要素が現れるまで DOM をポーリング（デフォルトタイムアウト 1000ms）。`waitFor` はコールバックがスローを止めるまで繰り返し実行 — `findBy` が合わない場合（要素の消滅を待つ、複数のことをアサートするなど）に使います。",
          },
        },
        {
          type: "code",
          title: {
            en: "Testing async fetch — loading → success state",
            np: "Async fetch test — loading → success state",
            jp: "非同期 fetch のテスト — loading → success 状態",
          },
          code: `import { render, screen, waitFor } from "@testing-library/react";
import { UserList } from "./UserList"; // fetches /api/users in useEffect

// Mock fetch globally for this test file
beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => [
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
    ],
  } as Response);
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("shows a loading spinner then renders users", async () => {
  render(<UserList />);

  // Assert loading state is visible immediately
  expect(screen.getByRole("status")).toBeInTheDocument(); // spinner with role="status"

  // Wait for users to appear (findBy polls the DOM)
  expect(await screen.findByText("Alice")).toBeInTheDocument();
  expect(screen.getByText("Bob")).toBeInTheDocument();

  // Spinner should be gone now
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

it("shows an error message when fetch fails", async () => {
  vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));

  render(<UserList />);

  // Wait for error message
  expect(await screen.findByRole("alert")).toHaveTextContent(/failed to load/i);
});`,
        },
      ],
    },
    {
      title: {
        en: "Mocking Fetch — vi.mock, vi.fn, and MSW",
        np: "Fetch Mock गर्ने — vi.mock, vi.fn, र MSW",
        jp: "fetch のモック — vi.mock・vi.fn・MSW",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The simplest approach is `vi.spyOn(globalThis, \"fetch\")` or assigning `globalThis.fetch = vi.fn()`. This works for single tests but gets unwieldy when many tests need different responses. Mock Service Worker (MSW) intercepts requests at the network level using a service worker (browser) or Node interceptor (tests) — tests never see the mock details, making them more realistic and reusable.",
            np: "Simplest: `vi.spyOn(globalThis, \"fetch\")` वा `globalThis.fetch = vi.fn()`। Single tests मा ठिक, धेरैमा unwieldy। Mock Service Worker (MSW) — network level मा intercept (service worker/Node interceptor) — tests ले mock details देख्दैन, realistic र reusable।",
            jp: "最もシンプルなのは `vi.spyOn(globalThis, \"fetch\")` または `globalThis.fetch = vi.fn()` の割り当て。単一テストには十分ですが、多くのテストで異なるレスポンスが必要になると煩雑です。Mock Service Worker（MSW）はサービスワーカー（ブラウザ）または Node インターセプター（テスト）を使ってネットワークレベルでリクエストを傍受 — テストはモックの詳細を見ず、より現実的で再利用可能です。",
          },
        },
        {
          type: "code",
          title: {
            en: "MSW handler example for testing",
            np: "Testing को लागि MSW handler",
            jp: "テスト用 MSW ハンドラの例",
          },
          code: `// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
    ]);
  }),

  http.post("/api/users", async ({ request }) => {
    const body = await request.json() as { name: string };
    return HttpResponse.json({ id: "3", name: body.name }, { status: 201 });
  }),

  http.delete("/api/users/:id", ({ params }) => {
    return HttpResponse.json({ deleted: params.id });
  }),
];

// src/test/setup.ts — start MSW before all tests
import { setupServer } from "msw/node";
import { handlers } from "../mocks/handlers";

const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());   // reset per-test overrides
afterAll(() => server.close());

// In a test — override a handler for a specific scenario
import { http, HttpResponse } from "msw";
it("shows error when server returns 500", async () => {
  server.use(
    http.get("/api/users", () => new HttpResponse(null, { status: 500 })),
  );
  render(<UserList />);
  expect(await screen.findByRole("alert")).toBeInTheDocument();
});`,
        },
      ],
    },
    {
      title: {
        en: "Testing Components with Context — renderWithProviders",
        np: "Context भएको Component test — renderWithProviders",
        jp: "Context を使うコンポーネントのテスト — renderWithProviders",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Components that call `useContext` (or custom hooks built on it) require the matching Provider to be present in the tree during testing. Wrap `render` calls with your Providers in a `renderWithProviders` utility so every test file gets a fully wired context without boilerplate. You can also pass custom initial state to override defaults per test.",
            np: "`useContext` (वा त्यसमा बनेका custom hooks) call गर्ने components लाई testing मा matching Provider tree मा चाहिन्छ। `renderWithProviders` utility मा Providers wrap गर्नुस् — हरेक test file मा boilerplate बिना context। Custom initial state पनि per-test pass गर्न सकिन्छ।",
            jp: "`useContext`（またはそれに基づくカスタムフック）を呼び出すコンポーネントには、テスト中にツリー内に対応する Provider が必要です。`renderWithProviders` ユーティリティで Provider を `render` 呼び出しにラップすることで、ボイラープレートなしにすべてのテストファイルで完全に接続されたコンテキストを得られます。テストごとにデフォルトを上書きするカスタム初期状態も渡せます。",
          },
        },
        {
          type: "code",
          title: {
            en: "renderWithProviders utility and usage",
            np: "renderWithProviders utility र usage",
            jp: "renderWithProviders ユーティリティと使い方",
          },
          code: `// src/test/renderWithProviders.tsx
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

interface WrapperOptions {
  theme?: "light" | "dark";
}

function createWrapper({ theme = "light" }: WrapperOptions = {}) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AuthProvider>
        <ThemeProvider initialTheme={theme}>
          {children}
        </ThemeProvider>
      </AuthProvider>
    );
  };
}

export function renderWithProviders(
  ui: ReactElement,
  options: WrapperOptions & Omit<RenderOptions, "wrapper"> = {},
) {
  const { theme, ...renderOptions } = options;
  return render(ui, {
    wrapper: createWrapper({ theme }),
    ...renderOptions,
  });
}

// Usage in a test
import { renderWithProviders } from "@/test/renderWithProviders";
import { ProfileMenu } from "./ProfileMenu"; // uses useAuth() and useTheme()

it("shows the user email in the profile menu", async () => {
  renderWithProviders(<ProfileMenu />, { theme: "dark" });
  // The component has access to both AuthContext and ThemeContext
  expect(await screen.findByText(/log in/i)).toBeInTheDocument();
});`,
        },
      ],
    },
    {
      title: {
        en: "Testing Custom Hooks — renderHook",
        np: "Custom Hooks test — renderHook",
        jp: "カスタムフックのテスト — renderHook",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`renderHook` from `@testing-library/react` mounts a hook in a minimal component wrapper and returns the hook's result via `result.current`. Wrap state-changing calls in `act()` to flush React's update queue. Use the `wrapper` option to provide context providers.",
            np: "`renderHook` — minimal component wrapper मा hook mount गर्छ; `result.current` मा hook result। State-changing calls `act()` मा wrap गर्नुस् — React update queue flush। Context providers को लागि `wrapper` option।",
            jp: "`renderHook` は最小限のコンポーネントラッパーにフックをマウントし、`result.current` でフックの結果を返します。状態変更の呼び出しは `act()` でラップして React の更新キューをフラッシュします。コンテキストプロバイダには `wrapper` オプションを使います。",
          },
        },
        {
          type: "code",
          title: {
            en: "renderHook example — testing useCounter custom hook",
            np: "renderHook — useCounter custom hook test",
            jp: "renderHook の例 — useCounter カスタムフックのテスト",
          },
          code: `// src/hooks/useCounter.ts
export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  const reset = () => setCount(initialValue);
  return { count, increment, decrement, reset };
}

// src/hooks/useCounter.test.ts
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("initialises with the given value", () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it("increments the counter", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("decrements the counter", () => {
    const { result } = renderHook(() => useCounter(3));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(2);
  });

  it("resets to initial value", () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
      result.current.increment();
    });
    expect(result.current.count).toBe(12);

    act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(10);
  });
});`,
        },
      ],
    },
    {
      title: {
        en: "Testing Forms — type, submit, assert validation",
        np: "Forms test — type, submit, validation assert",
        jp: "フォームのテスト — 入力・送信・バリデーション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Test forms by simulating real user actions: type into labelled fields with `userEvent.type`, click the submit button, and then assert the visible validation messages or the success state. Query fields by label text (`getByLabelText`) — it ties the test to accessible markup, which both tests and enforces good labelling.",
            np: "Forms test real user actions simulate गरेर: labelled fields मा `userEvent.type`, submit button click, अनि validation messages वा success state assert। Fields `getByLabelText` बाट query — accessible markup सँग tie गर्छ।",
            jp: "フォームをテストするにはリアルなユーザー操作をシミュレートします: ラベル付きフィールドに `userEvent.type`、送信ボタンをクリック、そして見えるバリデーションメッセージや成功状態をアサート。`getByLabelText` でフィールドをクエリ — アクセシブルなマークアップに結びつけ、良いラベル付けをテストと強制の両方で促します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Form test — fill fields, submit, assert error messages",
            np: "Form test — fields fill, submit, error messages assert",
            jp: "フォームテスト — フィールド入力・送信・エラーメッセージのアサート",
          },
          code: `// ContactForm shows required-field errors on submit when fields are empty
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Submit without filling anything
    await user.click(screen.getByRole("button", { name: /send message/i }));

    // Assert visible error messages (rendered by aria-live or explicit error elements)
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it("submits successfully with valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ContactForm onSubmit={onSubmit} />);

    // Use label text to find fields — tests accessible markup
    await user.type(screen.getByLabelText(/your name/i), "Alice");
    await user.type(screen.getByLabelText(/email address/i), "alice@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there");

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Alice",
      email: "alice@example.com",
      message: "Hello there",
    });
  });

  it("clears errors when the user starts correcting a field", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();

    // Start typing — error should disappear
    await user.type(screen.getByLabelText(/your name/i), "A");
    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
  });
});`,
        },
      ],
    },
    {
      title: {
        en: "What NOT to Test — Avoiding Implementation Details",
        np: "के test नगर्ने — Implementation Details नछोड्ने",
        jp: "何をテストすべきでないか — 実装の詳細を避ける",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Tests that inspect internal state, CSS class names, component structure, or the number of times a sub-component re-rendered are testing how things work internally rather than what the user experiences. They break on refactors that preserve behavior and give false confidence.",
            np: "Internal state, CSS class names, component structure, वा sub-component re-render count inspect गर्ने tests — user experience होइन, internal mechanism test गर्छन्। Behavior-preserving refactors मा टुट्छन् र false confidence दिन्छन्।",
            jp: "内部 state・CSS クラス名・コンポーネント構造・サブコンポーネントの再レンダー回数を検査するテストは、ユーザーが体験することではなく内部の動作をテストしています。振る舞いを保持するリファクタリングで壊れ、偽の自信を与えます。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Do NOT: assert component internal state — `expect(component.state.isOpen).toBe(true)`. DO: assert what the user sees — `expect(screen.getByRole('dialog')).toBeVisible()`.",
              np: "नगर्नुस्: internal state assert — `component.state.isOpen`। गर्नुस्: user ले देख्ने — `screen.getByRole('dialog')`।",
              jp: "しない: 内部 state のアサート — `component.state.isOpen`。する: ユーザーが見るものをアサート — `screen.getByRole('dialog')`。",
            },
            {
              en: "Do NOT: query by CSS class — `container.querySelector('.btn-primary')`. DO: query by role or accessible name — `screen.getByRole('button', { name: /save/i })`.",
              np: "नगर्नुस्: CSS class query — `.btn-primary`। गर्नुस्: role/accessible name — `getByRole('button')`।",
              jp: "しない: CSS クラスによるクエリ — `.btn-primary`。する: ロールまたはアクセス可能な名前 — `getByRole('button', { name: /save/i })`。",
            },
            {
              en: "Do NOT: test private implementation functions separately. DO: test the component through its public props and rendered output.",
              np: "नगर्नुस्: private implementation functions अलग test। गर्नुस्: public props र rendered output मार्फत।",
              jp: "しない: 内部実装の関数を個別にテスト。する: 公開 props とレンダー出力を通じてコンポーネントをテスト。",
            },
            {
              en: "Do NOT: snapshot test entire page trees — snapshots grow stale, are hard to review, and give no insight into what changed. DO: snapshot small, stable, pure display components when intentional.",
              np: "नगर्नुस्: entire page snapshot — stale, review गाह्रो। गर्नुस्: small, stable, pure display components को intentional snapshot।",
              jp: "しない: ページ全体のツリーのスナップショットテスト — 陳腐化し、レビューが困難で、何が変わったか分からない。する: 小さく安定したピュアな表示コンポーネントの意図的なスナップショット。",
            },
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
            en: "You can now configure Vitest and React Testing Library, write behavior-driven tests for components (sync and async), mock `fetch` with spies or MSW, wrap context-dependent components in `renderWithProviders`, test custom hooks with `renderHook`, fill and submit forms with `userEvent`, and confidently identify what to skip.",
            np: "अब Vitest र RTL configure गर्न, behavior-driven tests लेख्न (sync र async), `fetch` mock गर्न, context-dependent components `renderWithProviders` मा wrap गर्न, `renderHook` ले custom hooks test गर्न, `userEvent` ले forms fill र submit गर्न, र के test नगर्ने थाहा पाउनुहुन्छ।",
            jp: "Vitest と RTL の設定・コンポーネントの振る舞い駆動テスト（同期・非同期）・`fetch` のスパイまたは MSW によるモック・`renderWithProviders` でのコンテキスト依存コンポーネントのラップ・`renderHook` によるカスタムフックのテスト・`userEvent` によるフォームの入力・送信・スキップすべきことの自信ある特定ができるようになりました。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between getBy, queryBy, and findBy?",
        np: "getBy, queryBy, र findBy को फरक के हो?",
        jp: "getBy・queryBy・findBy の違いは？",
      },
      answer: {
        en: "`getBy*` throws immediately if the element is not found — use it when the element must be present right now. `queryBy*` returns `null` if not found — use it to assert that something does NOT exist (`expect(queryByText('Error')).not.toBeInTheDocument()`). `findBy*` is async and returns a Promise that resolves when the element appears — use it for elements rendered after data loading or user events that trigger async updates.",
        np: "`getBy*` — element नभेटे तुरुन्त throw; अहिले नै छ भन्नुस्। `queryBy*` — नभेटे `null` return; absence assert गर्न। `findBy*` — async Promise, element नदेखाउञ्जेल resolve; data loading वा async updates पछि।",
        jp: "`getBy*` は要素が見つからないとすぐ throw — 今すぐ存在すべき要素に。`queryBy*` は見つからないと `null` を返す — 何かが存在しないことをアサートするのに（`expect(queryByText('Error')).not.toBeInTheDocument()`）。`findBy*` は非同期で Promise を返し要素が現れるまで resolve を待つ — データ読み込みや非同期更新後にレンダーされる要素に。",
      },
    },
    {
      question: {
        en: "Should I test implementation details like state?",
        np: "State जस्ता implementation details test गर्नु पर्छ?",
        jp: "state などの実装の詳細はテストすべき？",
      },
      answer: {
        en: "No. Testing internal state means your test knows about React specifics rather than user experience. If you rename a state variable, the test breaks even though the app still works. Test what the user sees and does. The internal state is an implementation detail — the test should not care whether you use `useState`, `useReducer`, or a third-party store, as long as the rendered output and behavior are correct.",
        np: "होइन। Internal state test गर्नु भनेको React specifics थाहा छ तर user experience होइन। State variable rename गर्दा test टुट्छ — app काम गर्दैनमा पनि। User ले देख्ने र गर्ने test गर्नुस्। Internal state implementation detail — rendered output र behavior ठिक भए `useState`, `useReducer`, वा third-party store — test ले care गर्नु छैन।",
        jp: "いいえ。内部 state をテストするとは、ユーザー体験ではなく React の内部を知ることを意味します。state 変数を名前変更するとテストが壊れます — アプリが動いていても。ユーザーが見て行うことをテストします。内部 state は実装の詳細 — レンダー出力と振る舞いが正しければ、`useState`・`useReducer`・サードパーティストアのどれを使うかテストは関知すべきでありません。",
      },
    },
    {
      question: {
        en: "Why use userEvent over fireEvent?",
        np: "fireEvent भन्दा userEvent किन राम्रो?",
        jp: "fireEvent より userEvent を使う理由は？",
      },
      answer: {
        en: "`userEvent` simulates the full browser event sequence: for a click, it dispatches pointerover → pointerenter → mouseover → mouseenter → pointermove → mousemove → pointerdown → mousedown → focus → pointerup → mouseup → click. `fireEvent.click` dispatches only the `click` event. Components with focus management, onFocus handlers, or input masking libraries may work correctly with real events but silently fail with `fireEvent`. Use `userEvent` for realistic confidence.",
        np: "`userEvent` full browser event sequence simulate गर्छ: click मा pointerover → ... → click। `fireEvent.click` — `click` event मात्र। Focus management, onFocus handlers, input masking — real events सँग ठिक तर `fireEvent` सँग silent fail। Realistic confidence को लागि `userEvent`।",
        jp: "`userEvent` はブラウザのイベントシーケンス全体をシミュレート: クリックでは pointerover → mouseenter → ... → click を順に発火。`fireEvent.click` は `click` イベントのみをディスパッチ。フォーカス管理・onFocus ハンドラ・入力マスクライブラリは実イベントでは正しく動くが `fireEvent` では静かに失敗することがあります。現実的な自信のために `userEvent` を使います。",
      },
    },
    {
      question: {
        en: "How do I test something that uses useNavigate or React Router?",
        np: "useNavigate वा React Router भएको कुरा test गर्ने कसरी?",
        jp: "useNavigate や React Router を使うものはどうテストする？",
      },
      answer: {
        en: "Wrap your component in `<MemoryRouter>` (or `<BrowserRouter>` with jsdom) in tests. For `useNavigate`, you can also mock the module: `vi.mock('react-router-dom', () => ({ ...vi.importActual('react-router-dom'), useNavigate: () => vi.fn() }))`. Then assert navigation happened by checking that `navigate` was called with the right path. The RTL community recommends using `MemoryRouter` with an `initialEntries` prop to set up route state.",
        np: "Tests मा `<MemoryRouter>` (वा jsdom सँग `<BrowserRouter>`) wrap गर्नुस्। `useNavigate` mock गर्न: `vi.mock('react-router-dom', ...)`. `navigate` ले सही path सँग call भयो भनी assert गर्नुस्। RTL community `initialEntries` सहित `MemoryRouter` recommend गर्छ।",
        jp: "テストでコンポーネントを `<MemoryRouter>`（または jsdom の `<BrowserRouter>`）でラップします。`useNavigate` のモック: `vi.mock('react-router-dom', () => ({ ...vi.importActual('react-router-dom'), useNavigate: () => vi.fn() }))`。次に `navigate` が正しいパスで呼ばれたかをアサートして検証。RTL コミュニティは `initialEntries` プロップ付きの `MemoryRouter` を推奨しています。",
      },
    },
    {
      question: {
        en: "How do I test a component that uses fetch?",
        np: "fetch प्रयोग गर्ने component test गर्ने कसरी?",
        jp: "fetch を使うコンポーネントのテスト方法は？",
      },
      answer: {
        en: "Three options in increasing complexity: (1) `vi.spyOn(globalThis, 'fetch')` for one-off mocks in a single test. (2) A `vi.mock('../api/client')` to mock your entire API module. (3) MSW to intercept at the network level — recommended for teams with many integration tests because it mocks realistically and handler definitions are reused across tests and Storybook.",
        np: "तीन options: (1) `vi.spyOn(globalThis, 'fetch')` — single test one-off। (2) `vi.mock('../api/client')` — entire API module mock। (3) MSW — network level intercept; धेरै integration tests भएका teams को लागि recommend — realistic mock, handlers tests र Storybook दुवैमा reuse।",
        jp: "複雑さの順に3つの選択肢: (1) 単一テストの一回きりモックには `vi.spyOn(globalThis, 'fetch')`。(2) API モジュール全体のモックに `vi.mock('../api/client')`。(3) ネットワークレベルでの傍受に MSW — 統合テストが多いチームに推奨。現実的にモックし、ハンドラ定義をテストと Storybook の両方で再利用できます。",
      },
    },
    {
      question: {
        en: "What setup does @testing-library/user-event need?",
        np: "@testing-library/user-event लाई के setup चाहिन्छ?",
        jp: "@testing-library/user-event に必要なセットアップは？",
      },
      answer: {
        en: "Install `@testing-library/user-event@14` (or latest). In every test that needs it, call `const user = userEvent.setup()` before rendering — this creates an instance with proper event sequencing. Always `await` the user event calls (`await user.click(...)`, `await user.type(...)`). The `setup()` call can also receive options: `{ delay: null }` removes the artificial delay between keystrokes (useful to speed up tests).",
        np: "`@testing-library/user-event@14` (वा latest) install गर्नुस्। हरेक test मा render अघि `const user = userEvent.setup()` — proper event sequencing। User event calls `await` गर्नुस्। `setup({ delay: null })` — keystrokes बीचको artificial delay हटाउँछ (tests speed up)।",
        jp: "`@testing-library/user-event@14`（または最新）をインストールします。必要な各テストでレンダー前に `const user = userEvent.setup()` を呼びます — 適切なイベントシーケンスを持つインスタンスを作成します。ユーザーイベントの呼び出しは常に `await`。`setup({ delay: null })` でキーストローク間の人工的な遅延を除去してテストを高速化できます。",
      },
    },
    {
      question: {
        en: "E2E vs integration vs unit — when to use each in React?",
        np: "E2E vs integration vs unit — React मा कहिले कुन?",
        jp: "E2E・統合・ユニット — React でそれぞれいつ使う？",
      },
      answer: {
        en: "Unit tests (RTL + Vitest): fast, numerous — test individual components, hooks, and utilities in isolation. These should be the bulk of your test suite. Integration tests (RTL + Vitest + MSW): test user flows across several components with mocked network — catch wiring bugs between components. E2E tests (Playwright): real browser, real backend (or staging) — expensive and slower but catch environment issues, authentication flows, and third-party integrations. A healthy React project has many unit, moderate integration, and few but critical E2E tests.",
        np: "Unit (RTL + Vitest): fast, धेरै — individual components, hooks, utilities isolation मा। Test suite को bulk। Integration (RTL + Vitest + MSW): user flows across components + mocked network — components बीचको wiring bugs। E2E (Playwright): real browser, real backend — expensive, slow; environment issues, auth flows, third-party। Healthy React: धेरै unit, moderate integration, केही E2E।",
        jp: "ユニットテスト（RTL + Vitest）: 高速・多数 — 個々のコンポーネント・フック・ユーティリティを単独で。テストスイートの大部分。統合テスト（RTL + Vitest + MSW）: モックネットワークで複数コンポーネントにまたがるユーザーフロー — コンポーネント間の接続バグを捕捉。E2E（Playwright）: 実ブラウザ・実バックエンド（またはステージング）— 高コスト・低速だが環境問題・認証フロー・サードパーティ統合を捕捉。健全な React プロジェクトは多くのユニット・中程度の統合・少数だが重要な E2E テストを持ちます。",
      },
    },
    {
      question: {
        en: "How do I test error boundaries?",
        np: "Error boundaries test गर्ने कसरी?",
        jp: "エラーバウンダリのテスト方法は？",
      },
      answer: {
        en: "Create a test component that throws when given a specific prop (`if (props.shouldThrow) throw new Error('Boom')`), then wrap it in your `ErrorBoundary`, render with `shouldThrow={true}`, and assert the fallback UI is shown. Note: React intentionally logs errors to the console in test mode — suppress that noise with `vi.spyOn(console, 'error').mockImplementation(() => {})` in `beforeEach` and `vi.restoreAllMocks()` in `afterEach`.",
        np: "Test component बनाउनुस् जो specific prop मा throw गर्छ, `ErrorBoundary` मा wrap, `shouldThrow={true}` सँग render, fallback UI देखिन्छ assert। React test mode मा console मा errors log गर्छ — `vi.spyOn(console, 'error').mockImplementation(() => {})` ले suppress गर्नुस् (`beforeEach` मा, `afterEach` मा `vi.restoreAllMocks()`)।",
        jp: "特定の prop で throw するテストコンポーネントを作り（`if (props.shouldThrow) throw new Error('Boom')`）、`ErrorBoundary` でラップ、`shouldThrow={true}` でレンダーし、フォールバック UI が表示されることをアサートします。注意: React はテストモードで意図的に console にエラーを出力します — `beforeEach` で `vi.spyOn(console, 'error').mockImplementation(() => {})` によりノイズを抑制し、`afterEach` で `vi.restoreAllMocks()` します。",
      },
    },
  ],
  bullets: [
    {
      en: "Add Vitest + RTL + user-event to an existing Vite project and write your first test for a `Button` component — assert it renders and calls its `onClick` handler.",
      np: "Existing Vite project मा Vitest + RTL + user-event थप्नुस् र `Button` component को पहिलो test लेख्नुस् — renders र `onClick` call assert गर्नुस्।",
      jp: "既存の Vite プロジェクトに Vitest + RTL + user-event を追加し、`Button` コンポーネントの最初のテストを書く — レンダーと `onClick` ハンドラの呼び出しをアサートする。",
    },
    {
      en: "Build `renderWithProviders` and use it to test a component that relies on context — confirm it renders correctly with both default and custom provider values.",
      np: "`renderWithProviders` बनाउनुस् र context-dependent component test गर्न प्रयोग गर्नुस् — default र custom provider values दुवैमा ठिक render confirm गर्नुस्।",
      jp: "`renderWithProviders` を作り、コンテキストに依存するコンポーネントのテストに使う — デフォルトとカスタムのプロバイダ値の両方で正しくレンダーされることを確認する。",
    },
    {
      en: "Write an async test for a component that fetches data: mock `fetch` with `vi.spyOn`, assert the loading state, then wait for the data to appear with `findBy`, and assert the error state by making the spy reject.",
      np: "Data fetch गर्ने component को async test लेख्नुस्: `vi.spyOn` ले `fetch` mock, loading state assert, `findBy` ले data wait, spy reject गराएर error state assert।",
      jp: "データを取得するコンポーネントの非同期テストを書く: `vi.spyOn` で `fetch` をモック・ローディング状態をアサート・`findBy` でデータが現れるまで待つ・spy を reject させてエラー状態をアサートする。",
    },
  ],
};
