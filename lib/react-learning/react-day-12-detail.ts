import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_12_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 11 gave you compound components and render props. Today you round out the component design pattern toolkit — the patterns that show up constantly in real codebases and in interviews: separating logic from markup, sharing cross-cutting behavior, and building flexible APIs. Analogy: if hooks are your tools, patterns are the blueprints for how to arrange rooms in a house — the same tools (useState, props, children) combine differently depending on the shape of the problem.",
      np: "Day 11 मा compound components र render props सिक्यौं। आज बाँकी component design patterns — logic/markup separation, cross-cutting behavior sharing, flexible APIs।",
      jp: "Day 11 で複合コンポーネントとレンダープロップを学びました。今日は残りのコンポーネント設計パターンを学びます。",
    },
    {
      en: "Today's topics:\n• <b>Smart vs Presentational Components</b> — separating data/logic from markup\n• <b>Higher-Order Components (HOC)</b> — wrapping components to inject behavior\n• <b>Provider Pattern</b> — the Context.Provider pattern, named explicitly\n• <b>Uncontrolled Components</b> — letting the DOM own form state, refs and `defaultValue`\n• <b>Slot Pattern</b> — named placeholders inside a component via props\n• <b>Polymorphic Components</b> — one component, many rendered elements, via an `as` prop",
      np: "Smart/Presentational, HOC, Provider Pattern, Uncontrolled Components, Slot Pattern, Polymorphic Components।",
      jp: "Smart/Presentational・HOC・Provider パターン・非制御コンポーネント・スロットパターン・ポリモーフィックコンポーネントを学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Smart vs Presentational Components",
        np: "Smart vs Presentational Components",
        jp: "Smart vs Presentational コンポーネント",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "This is the oldest React architecture pattern — splitting components into two roles. Analogy: a restaurant kitchen (smart) decides what to cook and when; the plating station (presentational) just arranges whatever it's handed, without caring where the food came from.\n\n<b>Smart (container) components:</b>\n• Own state, fetch data, contain business logic\n• Usually don't render much markup themselves — they delegate\n• Know \"how things work\"\n\n<b>Presentational components:</b>\n• Receive everything via props — no state, no data fetching, no hooks besides `useState` for pure UI concerns (like a dropdown's open/closed state)\n• Easy to test, easy to reuse, easy to preview in Storybook\n• Know \"how things look\"",
            np: "Smart components ले state/logic राख्छन्, presentational components ले props बाट UI मात्र render गर्छन्।",
            jp: "Smart はロジック・状態を持ち、Presentational は props だけで見た目を描画します。",
          },
        },
        {
          type: "code",
          title: { en: "Splitting a component into smart + presentational", np: "Smart + Presentational split", jp: "Smart + Presentational の分離" },
          code: `// SMART — knows about data fetching, owns state
function UserListContainer() {
  const { data: users, isLoading, error } = useUsers(); // TanStack Query
  const [filter, setFilter] = useState('');

  const filtered = users?.filter(u =>
    u.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <UserList
      users={filtered ?? []}
      filter={filter}
      onFilterChange={setFilter}
    />
  );
}

// PRESENTATIONAL — pure function of its props, no hooks that touch data
function UserList({
  users,
  filter,
  onFilterChange,
}: {
  users: { id: string; name: string }[];
  filter: string;
  onFilterChange: (value: string) => void;
}) {
  return (
    <div>
      <input value={filter} onChange={e => onFilterChange(e.target.value)} placeholder="Filter..." />
      <ul>
        {users.map(u => <li key={u.id}>{u.name}</li>)}
      </ul>
    </div>
  );
}

// UserList can now be dropped into Storybook with fake data,
// tested without mocking useUsers, and reused with a different data source.`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Is this pattern still relevant with hooks?</b> Partially. Custom hooks (Day 11) replaced most of the reason to write class-based container components. But the underlying principle — separate \"what data\" from \"how it looks\" — is still exactly how senior developers organize feature folders: a `useProducts()` hook (smart) feeding a `<ProductCard>` (presentational).",
            np: "Hooks आएपछि container components कम भए, तर 'data बनाम UI' छुट्याउने सिद्धान्त अझै लागू हुन्छ।",
            jp: "フックの登場で container コンポーネントは減りましたが、データとUIを分ける原則は今も有効です。",
          },
        },
      ],
    },
    {
      title: {
        en: "Higher-Order Components (HOC)",
        np: "Higher-Order Components (HOC)",
        jp: "高階コンポーネント（HOC）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A Higher-Order Component is a function that takes a component and returns a new, enhanced component. Analogy: a HOC is like a gift-wrapping service — you hand over a plain box (component), and get back the same box wrapped with extra paper and a ribbon (added behavior), without changing what's inside.\n\n<b>Naming convention:</b> `withX` — `withAuth`, `withLogging`, `withErrorBoundary`.\n\n<b>What HOCs are used for:</b>\n• Injecting shared behavior (auth checks, logging, analytics) into many components without repeating code\n• Conditionally rendering based on cross-cutting rules (subscription tier, feature flags)\n\n<b>Why they're less common today:</b> Custom hooks solve the same reuse problem without wrapping the component tree — no extra nesting in DevTools, no prop-name collisions between the HOC and the wrapped component. HOCs still appear in older codebases and a few libraries (`react-redux`'s `connect`, before hooks existed).",
            np: "HOC = component लिएर enhanced component फर्काउने function। Custom hooks ले धेरैजसो replace गरेको छ।",
            jp: "HOC はコンポーネントを受け取り拡張版を返す関数。今は主にカスタムフックに置き換わっています。",
          },
        },
        {
          type: "code",
          title: { en: "withAuth HOC vs equivalent custom hook", np: "withAuth HOC vs custom hook", jp: "withAuth HOC とカスタムフックの比較" },
          code: `// HOC — wraps the component, injects a redirect check
function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading) return <Spinner />;
    if (!user) return <Navigate to="/login" replace />;

    return <Component {...props} />;
  };
}

// Usage — Dashboard has no idea it's wrapped
const ProtectedDashboard = withAuth(Dashboard);

// Common HOC pitfalls:
// 1. Prop collisions — the HOC and the wrapped component both define "loading"
// 2. Ref forwarding — HOCs need forwardRef to pass refs through (see Day 11)
// 3. Wrapper hell — withAuth(withLogging(withTheme(Component))) is hard to read in DevTools

// MODERN equivalent — a guard component (simpler, no wrapping):
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Usage — explicit at the call site, no hidden wrapping
<RequireAuth>
  <Dashboard />
</RequireAuth>`,
        },
      ],
    },
    {
      title: {
        en: "Provider Pattern",
        np: "Provider Pattern",
        jp: "Provider パターン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "You've used Context (Day 9) and compound components with Context (Day 11) — the Provider Pattern is the name for wrapping that up into a dedicated, reusable unit: a Context, a Provider component that owns the state, and a custom hook that reads it safely. Analogy: a Provider is like a building's electrical panel — it distributes power (state) to every outlet (component) in the tree, without each room needing its own generator.\n\n<b>The 3-part shape:</b>\n• Create the Context (usually with a `null` default, typed)\n• Write a `XProvider` component that owns the state and renders `<XContext.Provider value={...}>`\n• Write a `useX()` hook that calls `useContext(XContext)` and throws if used outside the provider — this catches misuse at development time instead of a silent `undefined`",
            np: "Provider Pattern = Context + Provider component + custom hook जसले outside-usage मा error throw गर्छ।",
            jp: "Provider パターンは Context・Provider コンポーネント・安全に読むカスタムフックの3点セットです。",
          },
        },
        {
          type: "code",
          title: { en: "A reusable ThemeProvider with a guarded hook", np: "ThemeProvider example", jp: "ThemeProvider の例" },
          code: `import { createContext, useContext, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

// 1. Create the context — no default value, so misuse is detectable
const ThemeContext = createContext<ThemeContextValue | null>(null);

// 2. The provider owns the state
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

// 3. The hook — guards against usage outside the provider
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

// Usage — App is wrapped once, any descendant can read/toggle theme
function App() {
  return (
    <ThemeProvider>
      <Toolbar />
    </ThemeProvider>
  );
}

function Toolbar() {
  const { theme, toggleTheme } = useTheme(); // throws a clear error if misused
  return <button onClick={toggleTheme}>Current: {theme}</button>;
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Multiple providers — the \"provider hell\" problem:</b> Large apps often nest `<ThemeProvider><AuthProvider><QueryClientProvider>...` many levels deep. Fix by composing them into a single `AppProviders` component so `App` stays flat.",
            np: "धेरै providers nest हुँदा 'provider hell' हुन्छ — AppProviders component मा compose गरेर fix गर्ने।",
            jp: "多数の Provider をネストすると『Provider 地獄』に。AppProviders にまとめて解決します。",
          },
        },
        {
          type: "code",
          title: { en: "Composing multiple providers", np: "Multiple providers compose गर्ने", jp: "複数 Provider の合成" },
          code: `function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// App stays flat and readable
function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Uncontrolled Components",
        np: "Uncontrolled Components",
        jp: "非制御コンポーネント",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Day 4 introduced controlled inputs — React state is the single source of truth. An uncontrolled component flips this: the DOM itself holds the current value, and React only reads it when needed (usually via a ref, on submit). Analogy: a controlled input is a live dictation — you transcribe every keystroke into state. An uncontrolled input is a mailbox — you don't watch it constantly, you just check it (via `ref.current.value`) when you need the letter.\n\n<b>Why choose uncontrolled:</b>\n• Fewer re-renders — the component doesn't re-render on every keystroke, which matters for very large forms or performance-sensitive inputs\n• Simpler for one-off values you only read once (a search box read on submit, not on every keystroke)\n• Required for the native `<input type=\"file\">` — its `value` can't be set programmatically for security reasons, so it's uncontrolled by necessity\n• Easy interop with non-React code / vanilla JS widgets that expect to own the DOM node",
            np: "Uncontrolled component मा DOM ले value राख्छ, React ले ref मार्फत चाहिँदा मात्र पढ्छ। File input सधैं uncontrolled हुन्छ।",
            jp: "非制御コンポーネントでは DOM が値を保持し、React は ref で必要な時だけ読む。file input は常に非制御。",
          },
        },
        {
          type: "code",
          title: { en: "Uncontrolled form with refs and defaultValue", np: "Uncontrolled form example", jp: "非制御フォームの例" },
          code: `import { useRef } from 'react';

function ContactForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null); // file inputs MUST be uncontrolled

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Read values only when needed — no re-render happened while typing
    const payload = {
      name: nameRef.current?.value ?? '',
      email: emailRef.current?.value ?? '',
      file: fileRef.current?.files?.[0] ?? null,
    };
    submitContact(payload);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* defaultValue, not value — DOM owns the current text after mount */}
      <input ref={nameRef} name="name" defaultValue="" placeholder="Name" />
      <input ref={emailRef} name="email" defaultValue="" placeholder="Email" />
      <input ref={fileRef} type="file" />
      <button type="submit">Send</button>
    </form>
  );
}

// Native form data — an alternative that skips refs entirely
function ContactFormNative() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    submitContact({ name: data.get('name'), email: data.get('email') });
  }
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" defaultValue="" />
      <input name="email" defaultValue="" />
      <button type="submit">Send</button>
    </form>
  );
}`,
        },
        {
          type: "table",
          caption: { en: "Controlled vs Uncontrolled", np: "Controlled vs Uncontrolled", jp: "制御 vs 非制御" },
          headers: [
            { en: "Aspect", np: "पक्ष", jp: "観点" },
            { en: "Controlled", np: "Controlled", jp: "制御" },
            { en: "Uncontrolled", np: "Uncontrolled", jp: "非制御" },
          ],
          rows: [
            [
              { en: "Source of truth", np: "Source of truth", jp: "信頼できる情報源" },
              { en: "React state", np: "React state", jp: "React state" },
              { en: "The DOM node itself", np: "DOM node आफैं", jp: "DOM ノード自体" },
            ],
            [
              { en: "Re-renders on keystroke", np: "Keystroke मा re-render", jp: "キー入力での再レンダー" },
              { en: "Yes, every change", np: "हो, हरेक change मा", jp: "毎回発生" },
              { en: "No", np: "छैन", jp: "なし" },
            ],
            [
              { en: "Instant validation / formatting", np: "Instant validation", jp: "即時バリデーション" },
              { en: "Easy — read `value` on every render", np: "सजिलो", jp: "簡単" },
              { en: "Harder — needs event listeners", np: "गाह्रो", jp: "難しい" },
            ],
            [
              { en: "Best for", np: "उपयुक्त", jp: "適するケース" },
              { en: "Most app forms — RHF, Zod (Day 7)", np: "Most forms", jp: "多くのフォーム" },
              { en: "File inputs, huge forms, non-React interop", np: "File input, ठूला forms", jp: "file input・巨大フォーム" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Slot Pattern",
        np: "Slot Pattern",
        jp: "スロットパターン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The `children` prop (Day 4) is really just one slot. The Slot Pattern generalizes this to <b>multiple named slots</b> — a component exposes several \"holes\" that the caller fills with arbitrary JSX, while the component controls the layout around them. Analogy: a picture frame with multiple openings — you supply the photos (content), the frame (component) supplies the fixed structure around each opening.\n\n<b>Why not just use more props for text?</b> Because slots accept full JSX, not just strings — a `header` slot might need an icon plus a button, not just a title string.",
            np: "Slot Pattern = children लाई multiple named slots मा generalize गर्ने — component ले layout control गर्छ, caller ले content भर्छ।",
            jp: "スロットパターンは children を複数の名前付きスロットに一般化 — レイアウトは component が、中身は呼び出し側が決めます。",
          },
        },
        {
          type: "code",
          title: { en: "A Card with named slots", np: "Named slots भएको Card", jp: "名前付きスロットを持つ Card" },
          code: `interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode; // the default/main slot
}

function Card({ header, footer, children }: CardProps) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

// Usage — each slot receives full JSX, not just text
<Card
  header={
    <div className="flex justify-between">
      <h3>Invoice #1042</h3>
      <StatusBadge status="paid" />
    </div>
  }
  footer={<Button onClick={downloadPdf}>Download PDF</Button>}
>
  <InvoiceLineItems items={invoice.items} />
</Card>

// Compare to the compound-component version (Day 11) — Card.Header / Card.Footer
// achieves the same idea but reads more like markup for deeply nested structures.
// Slots (props) are simpler when there are only 2-3 fixed regions.`,
        },
      ],
    },
    {
      title: {
        en: "Polymorphic Components",
        np: "Polymorphic Components",
        jp: "ポリモーフィックコンポーネント",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A polymorphic component renders as a different HTML element (or a different component) depending on an `as` prop, while keeping the same styling and behavior. Analogy: a cookie cutter that can stamp out its shape in dough, clay, or paper — the shape (styling/behavior) is fixed, the material (underlying element) changes.\n\n<b>Why this matters:</b> a `<Button>` styled component is usually a `<button>`, but sometimes you need it to render as an `<a>` (a link styled like a button) — without duplicating all the button's styles into a separate `LinkButton` component.\n\n<b>TypeScript challenge:</b> the props need to change based on `as` — `as=\"a\"` should require `href`, `as=\"button\"` should allow `type=\"submit\"`. This needs generics.",
            np: "Polymorphic component ले `as` prop अनुसार फरक HTML element render गर्छ, तर styling/behavior उही राख्छ।",
            jp: "ポリモーフィックコンポーネントは `as` プロップで異なる HTML 要素をレンダーしつつ、スタイルと挙動は同じに保ちます。",
          },
        },
        {
          type: "code",
          title: { en: "A polymorphic Button with `as`", np: "`as` सहित polymorphic Button", jp: "`as` を使うポリモーフィック Button" },
          code: `import { type ElementType, type ComponentPropsWithoutRef } from 'react';

// Generic prop type: takes the props of whatever "as" resolves to,
// plus our own "variant" prop
type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'variant'>;

function Button<T extends ElementType = 'button'>({
  as,
  variant = 'primary',
  className,
  ...rest
}: ButtonProps<T>) {
  const Component = as || 'button';
  return (
    <Component className={\`btn btn-\${variant} \${className ?? ''}\`} {...rest} />
  );
}

// Renders a real <button> — gets button-specific props like "type"
<Button type="submit" variant="primary">Save</Button>

// Renders an <a> — TypeScript now requires "href" and disallows "type"
<Button as="a" href="/pricing" variant="secondary">See pricing</Button>

// Renders a React Router Link — same styling, different underlying component
<Button as={Link} to="/dashboard">Go to Dashboard</Button>`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Where you've already seen this:</b> Radix UI's `asChild` prop and shadcn/ui components use a related technique (a \"Slot\" primitive that merges props onto its child) to achieve the same polymorphism without an `as` prop. Both solve the same problem: one component, many possible rendered elements.",
            np: "Radix UI को `asChild` र shadcn/ui ले उस्तै समस्या फरक तरिकाले (Slot primitive) solve गर्छन्।",
            jp: "Radix UI の `asChild` や shadcn/ui も同じ問題を Slot プリミティブで解決しています。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should every component be strictly \"smart\" or \"presentational\"?",
        np: "हरेक component strictly smart वा presentational हुनुपर्छ?",
        jp: "すべてのコンポーネントは厳密に Smart か Presentational であるべき？",
      },
      answer: {
        en: "No — treat it as a spectrum, not a rule to enforce everywhere. Small apps often mix concerns in one component and that's fine. The pattern earns its keep once a component gets reused in multiple contexts, or once you want to test the UI without mocking data fetching.",
        np: "होइन — spectrum हो, कडा नियम होइन। Component धेरै ठाउँमा reuse हुन थालेपछि यो pattern उपयोगी हुन्छ।",
        jp: "いいえ、厳密なルールではなくスペクトラムです。再利用が増えた時に有効になります。",
      },
    },
    {
      question: {
        en: "Are HOCs deprecated?",
        np: "HOCs deprecated हुन्?",
        jp: "HOC は非推奨？",
      },
      answer: {
        en: "Not deprecated, just rarely the best first choice. For new code, prefer custom hooks (Day 11) or a guard/wrapper component. Reach for a HOC only when you must alter what a component renders based on external conditions AND the consuming code can't be changed (e.g. wrapping a third-party component you don't own).",
        np: "Deprecated होइन, तर पहिलो choice होइन। Custom hooks वा guard component prefer गर्नुहोस्।",
        jp: "非推奨ではありませんが第一選択ではありません。カスタムフックやガードコンポーネントを優先してください。",
      },
    },
    {
      question: {
        en: "Can I mix controlled and uncontrolled on the same input?",
        np: "एउटै input मा controlled र uncontrolled mix गर्न सकिन्छ?",
        jp: "同じ input で制御と非制御を混在できる？",
      },
      answer: {
        en: "No — React will warn you: \"A component is changing an uncontrolled input to be controlled.\" This happens by accident when `value` starts as `undefined` and later becomes a string. Fix: always initialize state with a real value (`useState('')`, not `useState()`), or commit fully to `defaultValue` + refs.",
        np: "होइन — React ले warning दिन्छ। `value` सुरुमा `undefined` भएर पछि string हुँदा हुन्छ। `useState('')` बाट सुरु गर्नुहोस्।",
        jp: "できません。React が警告を出します。`useState('')` のように実値で初期化してください。",
      },
    },
    {
      question: {
        en: "Slot pattern vs compound components — which do I pick?",
        np: "Slot pattern vs compound components — कुन छान्ने?",
        jp: "スロットパターンと複合コンポーネント、どちらを選ぶ？",
      },
      answer: {
        en: "Use slots (named props) when you have 2-4 fixed, clearly-named regions (header/footer/sidebar). Use compound components (Day 11) when the number of children is dynamic or order-dependent (Tabs.Trigger repeated N times, Accordion.Item repeated N times) — slots don't handle repetition well since each prop is singular.",
        np: "2-4 fixed regions भए slots। Dynamic/repeated children (Tabs, Accordion) भए compound components।",
        jp: "固定領域が2〜4個ならスロット。動的・繰り返しの子要素なら複合コンポーネント。",
      },
    },
    {
      question: {
        en: "Do I need the full generic TypeScript setup for polymorphic components?",
        np: "Polymorphic components को लागि पूरा generic TypeScript चाहिन्छ?",
        jp: "ポリモーフィックコンポーネントに完全なジェネリック型は必要？",
      },
      answer: {
        en: "Only if you're building a shared UI library where callers need full type safety for every possible `as` value. For app-level code, a simpler version — `as?: ElementType` typed loosely as `any` for the rest props — is a reasonable trade-off. Most teams reach for a library (Radix, Chakra) rather than hand-rolling this.",
        np: "Shared UI library बनाउँदा मात्र चाहिन्छ। App-level code मा simpler version पर्याप्त हुन्छ।",
        jp: "共有 UI ライブラリを作る場合のみ必要。アプリレベルなら簡易版で十分です。",
      },
    },
  ],
};
