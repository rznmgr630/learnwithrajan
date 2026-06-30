import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_13_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "TypeScript adds a type layer on top of JavaScript. In React, this means your IDE knows exactly what props a component accepts, what events your handlers receive, and what your hooks return — before you even run the code.\n\nAnalogy: TypeScript is like labels on every box in a warehouse — without labels you have to open each box to know what's inside; with labels, you find what you need instantly and can't accidentally put the wrong thing in the wrong box.\n\n<b>Why TypeScript in React?</b>\n• <b>Autocomplete</b> — your editor suggests valid props as you type\n• <b>Catch bugs early</b> — passing a number where a string is expected becomes a compile error, not a runtime crash\n• <b>Self-documenting</b> — the type signature tells you exactly how to use a component without reading its source\n• <b>Safe refactoring</b> — rename a prop and TypeScript flags every file that needs updating",
      np: "TypeScript ले JavaScript माथि type layer थप्छ। React मा: props, events, hooks सबैमा type safety।",
      jp: "TypeScript は JavaScript に型を追加。props・イベント・フックの型が IDE に見えるので補完とバグ検出が改善します。",
    },
    {
      en: "In this day we cover:\n\n• Setting up a React + TypeScript project with Vite\n• Typing component <b>props interfaces</b>\n• <b>Event types</b> — MouseEvent, ChangeEvent, FormEvent\n• Typing <b>hooks</b> — useState, useRef, useReducer, useContext\n• <b>Generic components</b> — reusable components that work with any data type\n• Useful <b>utility types</b> — Partial, Pick, Omit, ComponentProps",
      np: "Vite setup, props typing, event types, hooks typing, generic components, utility types — सबै cover गर्छौं।",
      jp: "Vite セットアップ、props 型付け、イベント型、フック型付け、ジェネリックコンポーネント、ユーティリティ型を学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Setting up React with TypeScript",
        np: "React + TypeScript सेटअप",
        jp: "React + TypeScript のセットアップ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Vite makes TypeScript setup trivial — one flag and you get a fully configured project with `tsconfig.json`, `.tsx` files, and type checking built in.\n\nThe most important `tsconfig.json` option is `\"strict\": true` — this enables a bundle of strict checks that catch the most common mistakes. Always start with strict mode on.",
            np: "Vite को `--template react-ts` flag ले TypeScript project ready गर्छ। `strict: true` सधैं राख्नुहोस्।",
            jp: "`--template react-ts` で完全な TypeScript 構成が即座に用意されます。`strict: true` は必ず有効にしましょう。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create a project + key tsconfig options",
            np: "Project बनाउने + tsconfig",
            jp: "プロジェクト作成と tsconfig",
          },
          code: `# Create a React + TypeScript project
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install && npm run dev

// tsconfig.json — key options
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}

// Preferred — plain function with typed props
function Button({ label, onClick }: ButtonProps) { return <button onClick={onClick}>{label}</button>; }

// Avoid React.FC — has implicit children, awkward generics
// const Button: React.FC<ButtonProps> = ({ label }) => { ... }`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Why avoid `React.FC`?</b>\n• It implicitly adds `children?: ReactNode` to every component — even ones that shouldn't accept children\n• It makes generics awkward\n• The React team itself moved away from it\n\nJust type props directly on the function — simpler and more explicit.",
            np: "`React.FC` ले implicit children थप्छ र generics awkward बनाउँछ। Plain typed function नै राम्रो।",
            jp: "`React.FC` は暗黙の children と不便なジェネリクスがあるため、直接 props を型付けした関数が推奨です。",
          },
        },
      ],
    },
    {
      title: {
        en: "Typing component props",
        np: "Component props type गर्ने",
        jp: "コンポーネント props の型付け",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Props are the primary place you spend time with TypeScript in React. Use `interface` for objects you'll extend; use `type` for unions and computed types. Either works — pick one and be consistent.\n\n<b>Common prop patterns:</b>\n• <b>Required prop</b> — `label: string`\n• <b>Optional prop with default</b> — `variant?: 'primary' | 'secondary'`\n• <b>Callback prop</b> — `onClick?: (id: string) => void`\n• <b>Children</b> — `children: React.ReactNode`\n• <b>CSS class override</b> — `className?: string`",
            np: "Interface vs type: दुवै चल्छ। Union types, optional props, callback props — सबै patterns।",
            jp: "interface と type は混在可能。Union 型、省略可能 props、コールバック props の典型パターン。",
          },
        },
        {
          type: "code",
          title: {
            en: "Props interfaces — common patterns",
            np: "Props interface patterns",
            jp: "props インターフェースのパターン",
          },
          code: `interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  className?: string;
}

function Button({ label, variant = "primary", size = "md", disabled = false, onClick }: ButtonProps) {
  return (
    <button className={\`btn btn-\${variant} btn-\${size}\`} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}

// Discriminated union — different shapes for different alert types
type AlertProps =
  | { type: "success"; message: string }
  | { type: "error"; message: string; code: number }
  | { type: "warning"; message: string; dismissible?: boolean };

function Alert(props: AlertProps) {
  if (props.type === "error") {
    // TypeScript knows props.code exists here
    return <div>Error {props.code}: {props.message}</div>;
  }
  return <div>{props.message}</div>;
}`,
        },
      ],
    },
    {
      title: {
        en: "Typing events",
        np: "Event types",
        jp: "イベントの型付け",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React wraps native browser events in its own `SyntheticEvent` system. Each event type is a generic: `React.ChangeEvent<HTMLInputElement>` means \"a change event on an input element.\" TypeScript narrows the event so `e.target.value` is always a string, not `any`.",
            np: "React events generic हुन्छन्: `ChangeEvent<HTMLInputElement>` मा `e.target.value` string नै हो।",
            jp: "React イベントはジェネリックで、`ChangeEvent<HTMLInputElement>` なら `e.target.value` が string と確定します。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Common React event types",
            np: "सामान्य event types",
            jp: "よく使う React イベント型",
          },
          headers: [
            { en: "Event", np: "Event", jp: "イベント" },
            { en: "Type", np: "Type", jp: "型" },
            { en: "Use for", np: "प्रयोग", jp: "用途" },
          ],
          rows: [
            [
              { en: "onClick", np: "onClick", jp: "onClick" },
              { en: "React.MouseEvent<HTMLButtonElement>", np: "MouseEvent", jp: "MouseEvent" },
              { en: "Button clicks", np: "Button click", jp: "ボタンクリック" },
            ],
            [
              { en: "onChange", np: "onChange", jp: "onChange" },
              { en: "React.ChangeEvent<HTMLInputElement>", np: "ChangeEvent", jp: "ChangeEvent" },
              { en: "Input, select, textarea", np: "Input, select", jp: "入力要素" },
            ],
            [
              { en: "onSubmit", np: "onSubmit", jp: "onSubmit" },
              { en: "React.FormEvent<HTMLFormElement>", np: "FormEvent", jp: "FormEvent" },
              { en: "Form submission", np: "Form submit", jp: "フォーム送信" },
            ],
            [
              { en: "onKeyDown", np: "onKeyDown", jp: "onKeyDown" },
              { en: "React.KeyboardEvent<HTMLInputElement>", np: "KeyboardEvent", jp: "KeyboardEvent" },
              { en: "Keyboard shortcuts", np: "Keyboard", jp: "キーボード操作" },
            ],
            [
              { en: "onDrop", np: "onDrop", jp: "onDrop" },
              { en: "React.DragEvent<HTMLDivElement>", np: "DragEvent", jp: "DragEvent" },
              { en: "Drag and drop", np: "Drag & drop", jp: "ドラッグ＆ドロップ" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Event typing in practice",
            np: "Event typing example",
            jp: "イベント型付けの実例",
          },
          code: `function SearchForm() {
  const [query, setQuery] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); // TypeScript knows this is a string
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Searching for:", query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={handleChange} />
      <button type="submit">Search</button>
    </form>
  );
}

// Custom event callback types
interface TableProps {
  onRowSelect: (id: string) => void;
  onSort: (column: string, direction: "asc" | "desc") => void;
}`,
        },
      ],
    },
    {
      title: {
        en: "Typing hooks",
        np: "Hooks type गर्ने",
        jp: "フックの型付け",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Most hooks infer their types automatically from the initial value. But for nullable state (`null` initially, something later) you must provide an explicit generic — otherwise TypeScript infers the type as `null` forever.",
            np: "Hooks अधिकतर type infer गर्छन्। Nullable state मा explicit generic चाहिन्छ।",
            jp: "フックは多くの場合型を推論しますが、初期値が null の場合は明示的なジェネリクスが必要です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Typing useState, useRef, useReducer, custom hooks",
            np: "Hook types",
            jp: "フックの型付け例",
          },
          code: `// useState — explicit generic when initial value is null
const [user, setUser] = useState<User | null>(null);
const [posts, setPosts] = useState<Post[]>([]);
const [count, setCount] = useState(0); // inferred as number

// useRef — typed to the DOM element
const inputRef = useRef<HTMLInputElement>(null);
// inputRef.current is HTMLInputElement | null

// useReducer
type State = { count: number; status: "idle" | "loading" | "error" };
type Action = { type: "increment" } | { type: "setLoading" } | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment": return { ...state, count: state.count + 1 };
    case "setLoading": return { ...state, status: "loading" };
    case "reset":      return { count: 0, status: "idle" };
  }
}
const [state, dispatch] = useReducer(reducer, { count: 0, status: "idle" });

// useContext — guard against null
const ThemeContext = createContext<"light" | "dark" | null>(null);
function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx; // now guaranteed non-null
}

// Generic custom hook
function useLocalStorage<T>(key: string, initial: T): [T, (val: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initial;
  });
  const set = (val: T) => {
    localStorage.setItem(key, JSON.stringify(val));
    setValue(val);
  };
  return [value, set];
}`,
        },
      ],
    },
    {
      title: {
        en: "Generic components & utility types",
        np: "Generic components र utility types",
        jp: "ジェネリックコンポーネントとユーティリティ型",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Generic components let you write one component that works with any data type. A `<List>` component can render a list of users, posts, or products — all type-safe.\n\nAnalogy: a generic component is like a vending machine with configurable slots — the machine mechanism is the same, but what goes in each slot depends on the customer.",
            np: "Generic components एकै पटक लेखेर कुनै पनि data type सँग काम गर्छन्।",
            jp: "ジェネリックコンポーネントは任意のデータ型で再利用できる汎用コンポーネントです。",
          },
        },
        {
          type: "code",
          title: {
            en: "Generic components + utility types",
            np: "Generic + utility types",
            jp: "ジェネリックコンポーネントとユーティリティ型",
          },
          code: `// Generic list component
function List<T extends { id: string | number }>({
  items,
  renderItem,
  emptyMessage = "No items found",
}: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
}) {
  if (items.length === 0) return <p>{emptyMessage}</p>;
  return <ul>{items.map((item) => <li key={item.id}>{renderItem(item)}</li>)}</ul>;
}

// TypeScript infers T from the items array
<List items={users} renderItem={(u) => <span>{u.name}</span>} />
<List items={posts} renderItem={(p) => <span>{p.title}</span>} />

// --- Utility types ---
interface ButtonProps {
  label: string;
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  onClick: () => void;
}

type OptionalButton = Partial<ButtonProps>;                    // all optional
type CoreButton    = Pick<ButtonProps, "label" | "variant">;  // subset
type NoClick       = Omit<ButtonProps, "onClick">;            // remove prop

// ComponentProps — extract props from any component
import { ComponentProps } from "react";
type NativeInputProps = ComponentProps<"input">;              // all native input props
type MyButtonProps    = ComponentProps<typeof Button>;        // from your component`,
        },
        {
          type: "table",
          caption: {
            en: "React-specific TypeScript types quick reference",
            np: "React TypeScript types",
            jp: "React 固有の TypeScript 型",
          },
          headers: [
            { en: "Type", np: "Type", jp: "型" },
            { en: "Meaning", np: "अर्थ", jp: "意味" },
          ],
          rows: [
            [
              { en: "React.ReactNode", np: "ReactNode", jp: "ReactNode" },
              { en: "Anything renderable — JSX, string, number, null, array", np: "Renderable सबै", jp: "レンダー可能なすべて" },
            ],
            [
              { en: "React.ReactElement", np: "ReactElement", jp: "ReactElement" },
              { en: "A JSX element specifically (not null or string)", np: "JSX element मात्र", jp: "JSX 要素のみ" },
            ],
            [
              { en: "React.CSSProperties", np: "CSSProperties", jp: "CSSProperties" },
              { en: "Type for the style prop object", np: "style prop को type", jp: "style prop の型" },
            ],
            [
              { en: "React.RefObject<T>", np: "RefObject", jp: "RefObject" },
              { en: "Read-only ref from useRef", np: "useRef ref", jp: "useRef の読み取り専用 ref" },
            ],
            [
              { en: "React.MouseEventHandler<T>", np: "MouseEventHandler", jp: "MouseEventHandler" },
              { en: "Shorthand for (e: MouseEvent<T>) => void", np: "onClick shorthand", jp: "onClick の省略型" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I use `interface` or `type` for props?",
        np: "`interface` कि `type` props को लागि?",
        jp: "props には `interface` と `type` どちらを使う？",
      },
      answer: {
        en: "Both work for objects. `interface` is slightly better for props because it gives clearer error messages and supports `extends` for composition. `type` is better for unions, mapped types, and computed types. Common convention: `interface` for component props, `type` for everything else. The most important thing is consistency within your team.",
        np: "दुवै चल्छ। Props को लागि `interface` राम्रो error messages दिन्छ। Unions को लागि `type` राम्रो।",
        jp: "どちらでも機能します。props には `interface`、Union 型には `type` がよく使われます。チームで統一するのが大切です。",
      },
    },
    {
      question: {
        en: "What is `React.FC` and why avoid it?",
        np: "`React.FC` के हो र किन avoid गर्ने?",
        jp: "`React.FC` とは？なぜ避けるのか？",
      },
      answer: {
        en: "`React.FC` was popular in React 17 because it added `children` automatically. That implicit children caused bugs — components that shouldn't accept children did. React 18 removed the implicit children from `React.FC`. Now there is no reason to use it — just type props directly on the function.",
        np: "`React.FC` ले पहिले implicit children थप्थ्यो — bug prone। React 18 पछि plain typed function नै राम्रो।",
        jp: "React 18 で暗黙の children が廃止されました。今は直接 props を型付けするほうがシンプルです。",
      },
    },
    {
      question: {
        en: "How do I type a ref for a third-party component?",
        np: "Third-party component को ref type कसरी गर्ने?",
        jp: "サードパーティコンポーネントの ref をどう型付けする？",
      },
      answer: {
        en: "Check the library's documentation — most well-maintained libraries export the ref type. If the library doesn't export types, build a minimal interface with just the methods you need: `interface MySelectRef { focus(): void; clear(): void; }` then use `useRef<MySelectRef | null>(null)`.",
        np: "Library ले ref type export गर्छ — documentation हेर्नुहोस्। Export नभए `interface` बनाउनुहोस्।",
        jp: "ライブラリのドキュメントで ref 型を確認。エクスポートされていなければ必要なメソッドだけの interface を自作します。",
      },
    },
    {
      question: {
        en: "What is `as const` and when do I need it?",
        np: "`as const` के हो?",
        jp: "`as const` とは？",
      },
      answer: {
        en: "`as const` tells TypeScript to infer the narrowest possible type. Without it: `const SIZES = ['sm', 'md', 'lg']` is typed as `string[]`. With it: `const SIZES = ['sm', 'md', 'lg'] as const` is `readonly ['sm', 'md', 'lg']`. You can then derive a union type: `type Size = typeof SIZES[number]` which equals `'sm' | 'md' | 'lg'`.",
        np: "`as const` ले narrowest type infer गर्छ। Array बाट union type derive गर्न उपयोगी।",
        jp: "`as const` で最も狭い型を推論。`typeof SIZES[number]` で Union 型を導出できます。",
      },
    },
    {
      question: {
        en: "How do I handle `any` in legacy code?",
        np: "Legacy code मा `any` कसरी handle गर्ने?",
        jp: "レガシーコードの `any` はどう扱う？",
      },
      answer: {
        en: "Gradually. Strategy: (1) Enable `strict: true` immediately. (2) Use `unknown` instead of `any` where data comes from outside (API responses, localStorage) — it forces you to check the type before using it. (3) Add types file by file starting with the most-used utilities. (4) Use `// @ts-expect-error` with a comment rather than `// @ts-ignore` — `ts-expect-error` will fail if the error disappears, keeping the codebase honest.",
        np: "Gradually type गर्नुहोस्। `strict: true` सुरुमा। `any` को सट्टा `unknown` प्रयोग गर्नुहोस्।",
        jp: "段階的に型付け。`strict: true` 有効化、外部データには `unknown` を使い、ファイル単位で進めましょう。",
      },
    },
  ],
};
