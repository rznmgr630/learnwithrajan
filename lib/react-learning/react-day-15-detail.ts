import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_15_DETAIL: RoadmapDayDetail = {
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
        en: "Generic hooks — type-safe custom hooks for any data shape",
        np: "Generic hooks — कुनै पनि data shape को लागि type-safe custom hooks",
        jp: "ジェネリックフック — 任意のデータ形状に対応する型安全なカスタムフック",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The `useLocalStorage<T>` hook above already showed the shape: a custom hook needs its own type parameter whenever the data it stores or returns changes per caller. Without a generic, the hook has to pick one hard-coded type (or fall back to `any`, which silently loses all safety) — with a generic, every call site gets its own correct, narrow type.\n\n<b>Why this matters:</b> `useLocalStorage<User>('user', defaultUser)` should return `[User, (val: User) => void]`, while `useLocalStorage<Settings>('settings', defaultSettings)` should return `[Settings, (val: Settings) => void]` — same hook implementation, two completely different, correctly-typed call sites.\n\n<b>Syntax gotcha in `.tsx` files:</b> writing an arrow function with a bare generic — `const useFetch = <T>(url: string) => {...}` — is ambiguous with JSX syntax and fails to parse in `.tsx`. Add a trailing comma: `<T,>(url: string) => {...}`. Regular `function` declarations (like `function useFetch<T>(url: string) {...}`) don't have this problem — prefer them when writing generic hooks in `.tsx` files.",
            np: "Custom hook ले फरक callers मा फरक data return गर्नुपर्दा generic `<T>` चाहिन्छ। `.tsx` मा arrow function generic लेख्दा `<T,>` (trailing comma) चाहिन्छ — JSX सँग ambiguous हुनबाट बचाउन। `function` declaration मा यो समस्या हुँदैन।",
            jp: "呼び出し元ごとに異なるデータを返す必要があるカスタムフックにはジェネリック `<T>` が必要です。`.tsx` でアロー関数にジェネリックを書く場合は `<T,>`（末尾カンマ）が必要— JSX と曖昧にならないようにするためです。`function` 宣言ではこの問題は起きません。",
          },
        },
        {
          type: "code",
          title: {
            en: "A generic useFetch<T> hook",
            np: "Generic useFetch<T> hook",
            jp: "ジェネリック useFetch<T> フック",
          },
          code: `interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

// "function" declaration avoids the <T,> trailing-comma gotcha entirely
function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, isLoading: true, error: null });

    fetch(url)
      .then((res) => res.json() as Promise<T>)
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ data: null, isLoading: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}

// Each call site gets its own correctly-typed result — no "any" anywhere
interface User { id: string; name: string; }
interface Product { id: string; price: number; }

const { data: user } = useFetch<User>('/api/me');         // data: User | null
const { data: products } = useFetch<Product[]>('/api/products'); // data: Product[] | null

// user?.name        -> string | undefined, fully typed
// products?.[0].price -> number | undefined, fully typed`,
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
    {
      title: {
        en: "Generic hooks — type-safe reusable state logic",
        np: "Generic hooks — type-safe reusable state logic",
        jp: "ジェネリックフック — 型安全で再利用可能な state ロジック",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The real payoff of a generic hook is <b>contextual typing</b> — TypeScript looks at the value you actually pass in and infers `T` from it, so the caller almost never types `<T>` by hand. In `useLocalStorage<T>(key: string, initialValue: T)`, the second argument's type <b>is</b> `T` — pass `\"light\"` and `T` becomes `string`; pass `[] as CartItem[]` and `T` becomes `CartItem[]`. No annotation needed at the call site.\n\nAnalogy: a barista can tell your cup size just by looking at the cup you handed over — no need to say \"large\" out loud. But if you walk up empty-handed and just say \"one coffee please,\" there's nothing to measure — you must state the size yourself. That's exactly the difference between `useLocalStorage(\"theme\", \"light\")` (the `initialValue` is the cup — TypeScript reads `T` off it) and `useFetch<User[]>('/api/users')` (the argument is just a URL string — there's no value shaped like `User[]` to look at, so you must supply `<T>` explicitly).\n\n<b>Rule of thumb:</b>\n• If `T` can be read off an argument you're already passing (an initial value, a list of items, a default) — omit `<T>`; TypeScript infers it and still catches mismatched updates later.\n• If `T` describes something that never appears in the arguments (a URL, an id, an empty call with no seed data) — you must write `<T>` explicitly, or TypeScript has nothing to infer it from.",
            np: "Generic hook को फाइदा हो contextual typing — TypeScript ले तपाईंले पास गरेको value हेरेर `T` आफैं पत्ता लगाउँछ, त्यसैले caller ले प्रायः `<T>` हातले लेख्नु पर्दैन। `useLocalStorage(\"theme\", \"light\")` मा दोस्रो argument नै `T` हो — `\"light\"` पास गर्दा `T` = `string` हुन्छ। तर `useFetch<User[]>('/api/users')` मा argument त URL string मात्र हो, त्यहाँ `User[]` जस्तो कुनै value नै छैन infer गर्न — त्यसैले `<T>` हातले लेख्नैपर्छ।\n\nनियम: argument बाट `T` पत्ता लाग्छ भने `<T>` नलेख्नुहोस् — TypeScript ले infer गर्छ। Argument मा `T` को कुनै संकेत नै छैन भने (जस्तै URL मात्र) explicit `<T>` लेख्नैपर्छ।",
            jp: "ジェネリックフックの本当の利点は「文脈による型推論」— TypeScript は渡された値を見て `T` を推論するため、呼び出し側が `<T>` を書く必要はほとんどありません。`useLocalStorage(\"theme\", \"light\")` では第二引数自体が `T` そのものなので、`\"light\"` を渡せば `T` は `string` になります。\n\n一方 `useFetch<User[]>('/api/users')` では引数は URL 文字列だけで、`User[]` のような値が存在しないため推論できません — この場合は `<T>` を明示的に書く必要があります。\n\n目安: 引数から `T` を読み取れるなら `<T>` は省略可能。引数に `T` の手がかりが全くない場合（URL だけなど）は明示的に指定する必要があります。",
          },
        },
        {
          type: "code",
          title: {
            en: "Inferred T vs. explicit T — useLocalStorage, useToggleList, useFetch",
            np: "Inferred vs explicit T — उदाहरणहरू",
            jp: "推論される T と明示する T の例",
          },
          code: `// TypeScript infers T from the *value* you pass in — no <T> needed at the call site
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  const setAndPersist = (next: T) => {
    localStorage.setItem(key, JSON.stringify(next));
    setValue(next);
  };

  return [value, setAndPersist];
}

// No explicit <T> anywhere — TypeScript reads it straight off initialValue
const [theme, setTheme] = useLocalStorage("theme", "light");        // T = string
const [cart, setCart]   = useLocalStorage("cart", [] as CartItem[]); // T = CartItem[]
setTheme("dark");  // ok
setTheme(42);       // Error: number is not assignable to type 'string'

// A generic hook for a list of selectable items — T inferred from initialItems
function useToggleList<T>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);

  const toggle = (item: T) => {
    setItems((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  return { items, toggle };
}

const { items: selectedTags, toggle } = useToggleList(["react", "typescript"]); // T = string
toggle("hooks"); // ok
toggle(5);        // Error: number is not assignable to type 'string'

// --- When there is nothing to infer T from, you MUST supply it explicitly ---
interface User {
  id: string;
  name: string;
}

// "url" is just a string — nothing in the arguments tells TypeScript the response shape
function useFetch<T>(url: string): { data: T | null; isLoading: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(url)
      .then((res) => res.json() as Promise<T>)
      .then((json) => setData(json))
      .finally(() => setIsLoading(false));
  }, [url]);

  return { data, isLoading };
}

// Explicit type argument required — there is no User[] value being passed in
const { data: users } = useFetch<User[]>("/api/users"); // data: User[] | null

// const { data } = useFetch("/api/users");
// Without <T>, TypeScript can't infer anything from a plain string —
// T silently defaults to 'unknown', so 'data' becomes unusable without a manual cast.`,
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
    {
      question: {
        en: "Why doesn't `useLocalStorage(\"theme\", \"light\")` need `<string>`, but `useFetch<User[]>('/api/users')` does?",
        np: "`useLocalStorage(\"theme\", \"light\")` मा `<string>` किन चाहिँदैन, तर `useFetch<User[]>('/api/users')` मा किन चाहिन्छ?",
        jp: "`useLocalStorage(\"theme\", \"light\")` に `<string>` は不要なのに、`useFetch<User[]>('/api/users')` にはなぜ必要？",
      },
      answer: {
        en: "TypeScript infers a generic's type parameter from any argument that has the shape `T`. `useLocalStorage<T>(key: string, initialValue: T)` receives `\"light\"` as `initialValue`, so `T` is inferred as `string` directly — writing `<string>` would be redundant. `useFetch<T>(url: string)` only receives a URL string; nothing in the arguments is shaped like the response data, so TypeScript has no value to look at and `T` must be supplied explicitly, or it silently falls back to `unknown`.",
        np: "TypeScript ले generic को `T` लाई त्यस्तो argument बाट infer गर्छ जसको shape नै `T` हो। `useLocalStorage` मा `initialValue` नै `T` भएकोले `\"light\"` बाट `T = string` सिधै थाहा हुन्छ। `useFetch` मा भने `url` एउटा string मात्र हो — response data जस्तो कुनै argument नै छैन, त्यसैले `T` explicit दिनैपर्छ, नत्र `unknown` मा default हुन्छ।",
        jp: "TypeScript は `T` の形をした引数からジェネリック型を推論します。`useLocalStorage` では `initialValue` 自体が `T` なので `\"light\"` から `T = string` と直接わかります。一方 `useFetch` は `url`（文字列）しか受け取らず、レスポンスデータの形をした引数が無いため推論できず、`<T>` を明示しないと `unknown` にフォールバックします。",
      },
    },
  ],
};
