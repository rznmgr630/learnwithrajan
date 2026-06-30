import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_14_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Tests give you confidence to change your code without breaking things. For React, the gold-standard approach is testing <b>behavior, not implementation</b> — interact with your components the way a user would (click buttons, type in inputs, check text appears) rather than checking internal state.\n\nAnalogy: testing implementation is like inspecting every gear in a car engine to see if it works; testing behavior is like taking the car for a test drive. The test drive tells you what actually matters: does the car go, stop, and steer?\n\n<b>The testing stack:</b>\n• <b>Vitest</b> — the test runner (like Jest but faster, built for Vite)\n• <b>React Testing Library (RTL)</b> — renders components and provides human-friendly queries\n• <b>@testing-library/user-event</b> — simulates real user interactions (typing, clicking)\n• <b>@testing-library/jest-dom</b> — adds custom matchers like `toBeInTheDocument()`",
      np: "Testing = behavior test, implementation नहोस्। Vitest + RTL + userEvent — stack।",
      jp: "テストは実装でなく振る舞いを検証。Vitest + RTL + userEvent が現代の標準スタックです。",
    },
    {
      en: "In this day we cover:\n\n• Setting up <b>Vitest + RTL</b>\n• Writing your first <b>component test</b>\n• Testing <b>async behavior</b> — loading states and API calls\n• Testing <b>custom hooks</b> with `renderHook`\n• <b>Best practices</b> — what to test, what not to test, query priority",
      np: "Vitest setup, component tests, async tests, renderHook, best practices — सबै cover।",
      jp: "セットアップ、コンポーネントテスト、非同期テスト、renderHook、ベストプラクティスを学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Setting up Vitest + React Testing Library",
        np: "Vitest + RTL setup",
        jp: "Vitest + RTL のセットアップ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Vitest integrates directly with Vite — no separate config file needed for most projects. It reads your `vite.config.ts` and adds test settings inside it.\n\n<b>What each package does:</b>\n• `vitest` — test runner, assertion library, mock functions\n• `@testing-library/react` — renders React components into a virtual DOM\n• `@testing-library/user-event` — simulates real user interactions (more realistic than `fireEvent`)\n• `@testing-library/jest-dom` — adds matchers: `toBeInTheDocument`, `toHaveValue`, `toBeDisabled`\n• `jsdom` — provides the browser environment (window, document) for Node.js tests",
            np: "Vitest Vite सँग integrate हुन्छ। RTL + userEvent + jest-dom — testing stack।",
            jp: "Vitest は Vite と統合。RTL + userEvent + jest-dom の 3 パッケージで構成されます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Install + configure",
            np: "Install र configure",
            jp: "インストールと設定",
          },
          code: `npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom

// vite.config.ts — add test block
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});

// src/test/setup.ts — run before every test file
import "@testing-library/jest-dom";

// package.json scripts
{
  "scripts": {
    "test":    "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  }
}`,
        },
      ],
    },
    {
      title: {
        en: "Your first component test",
        np: "पहिलो component test",
        jp: "最初のコンポーネントテスト",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "RTL's philosophy: find elements the way a user finds them — by visible text, by accessible role, by label — NOT by CSS class or implementation detail.\n\nThe query types:\n• `getBy...` — finds the element, throws if not found\n• `queryBy...` — finds the element, returns `null` if not found (use to assert absence)\n• `findBy...` — async, waits up to 1 second for the element to appear\n\nAlways prefer `getByRole` over `getByTestId`. A passing test that uses `getByRole('button')` means the button is accessible; a test using `getByTestId('submit-btn')` tells you nothing about accessibility.",
            np: "RTL: role/label/text बाट elements खोज्नुहोस्, CSS class बाट होइन। getBy/queryBy/findBy — तीन queries।",
            jp: "RTL では role・label・text で要素を探します。CSS クラスや実装詳細には依存しません。",
          },
        },
        {
          type: "code",
          title: {
            en: "Component test examples",
            np: "Component test examples",
            jp: "コンポーネントテストの例",
          },
          code: `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

// Basic render + click test
test("calls onClick when clicked", async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  // Find by accessible role + name
  const btn = screen.getByRole("button", { name: /click me/i });
  await userEvent.click(btn);

  expect(handleClick).toHaveBeenCalledOnce();
});

// Test that something is NOT rendered
test("does not show error message initially", () => {
  render(<LoginForm />);
  expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
});

// Test form interaction
test("shows error when email is invalid", async () => {
  render(<LoginForm />);
  const user = userEvent.setup();

  await user.type(screen.getByLabelText(/email/i), "not-an-email");
  await user.click(screen.getByRole("button", { name: /sign in/i }));

  expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
});`,
        },
      ],
    },
    {
      title: {
        en: "Testing async behavior — loading and API calls",
        np: "Async behavior test गर्ने",
        jp: "非同期の振る舞いをテストする",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Components that fetch data have three states: loading, success, and error. Test all three. The key tool is `vi.mock()` — it replaces your API module with a controlled fake so tests don't hit the real network.\n\nAnalogy: mocking is like using a stunt double — the movie runs normally, but the dangerous parts are performed by a controlled substitute.",
            np: "Async components: loading, success, error — तीनै state test गर्नुहोस्। `vi.mock()` ले API fake बनाउँछ।",
            jp: "非同期コンポーネントは loading・success・error の 3 状態をテスト。`vi.mock()` でネットワークをモック。",
          },
        },
        {
          type: "code",
          title: {
            en: "Testing async loading, success & error states",
            np: "Async states test",
            jp: "非同期の状態テスト",
          },
          code: `import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import * as api from "./api"; // the module your component uses
import { PostList } from "./PostList";

// Mock the whole API module
vi.mock("./api");

test("shows loading then posts", async () => {
  vi.mocked(api.fetchPosts).mockResolvedValue([
    { id: 1, title: "Hello World" },
    { id: 2, title: "Second Post" },
  ]);

  render(<PostList />);

  // Loading state appears immediately
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for posts to appear (findBy is async)
  expect(await screen.findByText("Hello World")).toBeInTheDocument();
  expect(screen.getByText("Second Post")).toBeInTheDocument();

  // Loading is gone
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});

test("shows error when fetch fails", async () => {
  vi.mocked(api.fetchPosts).mockRejectedValue(new Error("Network error"));

  render(<PostList />);

  expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
});`,
        },
      ],
    },
    {
      title: {
        en: "Testing custom hooks with renderHook",
        np: "Custom hooks test — renderHook",
        jp: "renderHook でカスタムフックをテスト",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Hooks can't be called outside of a React component — they need the React runtime. `renderHook` creates a minimal component wrapper around your hook so you can test it directly.\n\n`act()` wraps any interaction that causes state updates — this tells React to process the update synchronously so assertions see the final state.",
            np: "Hooks React runtime चाहिन्छ। `renderHook` ले minimal wrapper बनाउँछ। `act()` ले state updates process गर्छ।",
            jp: "フックは React ランタイムが必要。`renderHook` が最小ラッパーを作成。`act()` で状態更新を同期処理します。",
          },
        },
        {
          type: "code",
          title: {
            en: "renderHook + act examples",
            np: "renderHook examples",
            jp: "renderHook の例",
          },
          code: `import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";
import { useAuth } from "./useAuth";
import { AuthProvider } from "./AuthProvider";

// Test a simple hook
test("useCounter increments and decrements", () => {
  const { result } = renderHook(() => useCounter(0));

  expect(result.current.count).toBe(0);

  act(() => result.current.increment());
  expect(result.current.count).toBe(1);

  act(() => result.current.decrement());
  expect(result.current.count).toBe(0);
});

// Test a hook that needs Context
test("useAuth returns user when logged in", async () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
  });

  expect(result.current.user).toBeNull();

  await act(async () => {
    await result.current.login("test@example.com", "password");
  });

  expect(result.current.user?.email).toBe("test@example.com");
});`,
        },
      ],
    },
    {
      title: {
        en: "Testing best practices",
        np: "Testing best practices",
        jp: "テストのベストプラクティス",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>What to test:</b>\n• The happy path — does the feature work when used correctly?\n• Error cases — what happens when an API fails or form is invalid?\n• Edge cases — empty state, single item, max items\n• Accessibility — can assistive technology interact with this?\n\n<b>What NOT to test:</b>\n• Implementation details — component internal state, private methods\n• Third-party library behavior — test that you call the library correctly, not that the library works\n• Snapshot tests for complex UI — brittle, fail on every style change, add no value",
            np: "Happy path, error cases, edge cases test गर्नुहोस्। Implementation details र snapshots test नगर्नुहोस्।",
            jp: "正常系・エラー・エッジケースをテスト。実装詳細・スナップショットは避けましょう。",
          },
        },
        {
          type: "table",
          caption: {
            en: "RTL query priority — use the highest applicable",
            np: "RTL query priority",
            jp: "RTL クエリの優先順位",
          },
          headers: [
            { en: "Priority", np: "Priority", jp: "優先度" },
            { en: "Query", np: "Query", jp: "クエリ" },
            { en: "When to use", np: "प्रयोग", jp: "用途" },
          ],
          rows: [
            [
              { en: "1 (best)", np: "1 (सबैभन्दा राम्रो)", jp: "1（最良）" },
              { en: "getByRole", np: "getByRole", jp: "getByRole" },
              { en: "Buttons, inputs, headings, links — anything with a role", np: "Role भएका elements", jp: "role のある要素すべて" },
            ],
            [
              { en: "2", np: "2", jp: "2" },
              { en: "getByLabelText", np: "getByLabelText", jp: "getByLabelText" },
              { en: "Form inputs with associated labels", np: "Label भएका inputs", jp: "ラベル付き入力" },
            ],
            [
              { en: "3", np: "3", jp: "3" },
              { en: "getByPlaceholderText", np: "getByPlaceholderText", jp: "getByPlaceholderText" },
              { en: "Inputs without labels (use labels instead)", np: "Label नभएका inputs", jp: "ラベルなし入力" },
            ],
            [
              { en: "4", np: "4", jp: "4" },
              { en: "getByText", np: "getByText", jp: "getByText" },
              { en: "Any visible text — paragraphs, headings, buttons", np: "Visible text", jp: "表示テキスト" },
            ],
            [
              { en: "5 (last resort)", np: "5 (अन्तिम)", jp: "5（最終手段）" },
              { en: "getByTestId", np: "getByTestId", jp: "getByTestId" },
              { en: "Only when nothing else works", np: "अरु नभएको बेला मात्र", jp: "他の手段が使えない場合のみ" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between Vitest and Jest?",
        np: "Vitest र Jest को फरक?",
        jp: "Vitest と Jest の違いは？",
      },
      answer: {
        en: "Vitest is Jest-compatible (same API: `describe`, `test`, `expect`, `vi.mock`) but built for Vite. Key differences: Vitest starts faster because it reuses the Vite dev server; it supports ES modules natively without Babel transform; `vi.mock` is more predictable than `jest.mock`. If you know Jest, Vitest feels identical — just faster.",
        np: "Vitest Jest-compatible छ (same API) तर Vite को लागि। Faster startup, native ESM support।",
        jp: "Vitest は Jest と同じ API ですが Vite 向けに最適化。ES モジュールをネイティブサポートし起動が速いです。",
      },
    },
    {
      question: {
        en: "Why does RTL avoid testing implementation details?",
        np: "RTL ले implementation details test किन avoid गर्छ?",
        jp: "RTL が実装詳細を避けるのはなぜ？",
      },
      answer: {
        en: "Implementation details tests break when you refactor — even if the feature still works perfectly. For example, testing that a component has `isOpen: true` in state will break if you rename that variable to `menuVisible`. RTL tests that what the USER sees changed (the dropdown opened), not how you implemented it. This makes tests resilient to refactoring.",
        np: "Implementation test refactor गर्दा break हुन्छ। User देख्ने behavior test गर्नुहोस् — refactor-resistant।",
        jp: "実装テストはリファクタリングで壊れます。ユーザーが見る振る舞いをテストすれば、実装を変えても壊れません。",
      },
    },
    {
      question: {
        en: "How do I test a component that uses React Router?",
        np: "React Router use गर्ने component कसरी test गर्ने?",
        jp: "React Router を使うコンポーネントのテスト方法は？",
      },
      answer: {
        en: "Wrap the component in a `MemoryRouter` (from react-router-dom) in your test. `MemoryRouter` keeps navigation in memory — no real browser history needed. `render(<MemoryRouter initialEntries={['/posts/1']}><PostDetail /></MemoryRouter>)`. For testing navigation (clicking a link causes redirect), use `createMemoryRouter` and `RouterProvider` from React Router v6.",
        np: "`MemoryRouter` मा wrap गर्नुहोस्। Browser history नचाहिने in-memory routing। Test मा route params पनि set गर्न सकिन्छ।",
        jp: "`MemoryRouter` でラップすれば実ブラウザ不要。React Router v6 では `createMemoryRouter` も使えます。",
      },
    },
    {
      question: {
        en: "What is the difference between a mock, a stub, and a spy?",
        np: "Mock, stub, spy को फरक?",
        jp: "モック・スタブ・スパイの違いは？",
      },
      answer: {
        en: "In practice with Vitest they overlap, but conceptually: a <b>stub</b> replaces a function with a fake that returns controlled values (`vi.fn(() => 'fake data')`). A <b>spy</b> wraps the real function to record calls without replacing it (`vi.spyOn(api, 'fetch')`). A <b>mock</b> replaces a whole module with a fake implementation (`vi.mock('./api')`). In tests, you'll mostly use `vi.fn()` for callbacks and `vi.mock()` for API modules.",
        np: "Stub: fake return value। Spy: real function wrap गरेर calls record। Mock: whole module replace।",
        jp: "スタブ: 偽の戻り値。スパイ: 本物をラップして記録。モック: モジュール全体を置換。実務では `vi.fn()` と `vi.mock()` が中心です。",
      },
    },
    {
      question: {
        en: "How do I test a component that uses Context?",
        np: "Context use गर्ने component कसरी test गर्ने?",
        jp: "Context を使うコンポーネントのテスト方法は？",
      },
      answer: {
        en: "Create a custom `renderWithProviders` helper that wraps your component in all the Providers it needs. Call this instead of `render` in tests. Example: `function renderWithProviders(ui) { return render(<ThemeProvider><QueryClientProvider client={testClient}>{ui}</QueryClientProvider></ThemeProvider>); }`. For Context values you want to control in a specific test, create a test-specific provider that accepts a value prop.",
        np: "`renderWithProviders` helper बनाउनुहोस् जसले सबै Providers wrap गर्छ। Test-specific Context values को लागि test provider।",
        jp: "全 Provider をラップする `renderWithProviders` ヘルパーを用意しましょう。テスト固有の値は専用 Provider で渡します。",
      },
    },
  ],
};
