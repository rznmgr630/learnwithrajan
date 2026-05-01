import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 13 — TypeScript with React: types, generics, utility types, safe components, hooks, context, and avoiding common TS mistakes. */
export const REACT_DAY_13_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 13 adds static safety to every React pattern you have learned. TypeScript catches an entire class of bugs at compile time — wrong prop shapes, missing handlers, null dereferences — that unit tests often miss. Almost every enterprise React project uses TypeScript today, and Vite makes bootstrapping trivial with `--template react-ts`.",
      np: "दिन १३ हरेक React pattern मा static safety थप्छ। TypeScript compile मै bugs समात्छ — गलत props, missing handler, null dereference। आधुनिक enterprise React सबै TypeScript मा छ; Vite मा `--template react-ts` ले सजिलो सुरु।",
      jp: "13日目はすべての React パターンに静的安全性を加えます。TypeScript はプロップの形状の不一致・ハンドラの欠落・null 参照など、ユニットテストが見逃しがちなバグをコンパイル時に捕捉します。現代のエンタープライズ React はほぼ TypeScript で、Vite の `--template react-ts` で即座に始められます。",
    },
    {
      en: "Topics span typed props, common React utility types, annotating hooks (useState, useRef, useReducer), typing context, generic components, event handler types, and common mistakes to avoid.",
      np: "Topics: typed props, React utility types, hooks annotation, context, generic components, event handler types, र common mistakes।",
      jp: "型付き props・React ユーティリティ型・フックの注釈（useState・useRef・useReducer）・コンテキストの型付け・ジェネリックコンポーネント・イベントハンドラの型・よくあるミスを扱います。",
    },
  ],
  sections: [
    {
      title: {
        en: "Introduction — Why TypeScript in React",
        np: "परिचय — React मा TypeScript किन",
        jp: "イントロ — React で TypeScript を使う理由",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "TypeScript is a superset of JavaScript that adds a compile-time type layer. In React it eliminates entire bug classes: you cannot pass a number where a callback is expected, forget a required prop, or call `.toUpperCase()` on a possibly-null value without TypeScript telling you first. Every modern enterprise React codebase uses TypeScript; the ecosystem (shadcn/ui, TanStack Query, Radix) ships types by default.",
            np: "TypeScript JavaScript को superset हो जसले compile-time type layer थप्छ। React मा पूरा bug classes हटाउँछ: number पठाउँदा callback चाहिएको ठाउँमा, required prop बिर्सिंदा, nullable मा `.toUpperCase()` — सबै compile मा देखिन्छ। आधुनिक enterprise React र ecosystem (shadcn/ui, TanStack Query) TypeScript by default।",
            jp: "TypeScript はコンパイル時の型レイヤーを追加する JavaScript のスーパーセットです。コールバックが期待される場所に数値を渡す・required prop を忘れる・null かもしれない値に `.toUpperCase()` を呼ぶ、といったバグクラスを根絶します。現代のエンタープライズ React と shadcn/ui・TanStack Query などのエコシステムはデフォルトで型を同梱します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Bootstrap a TypeScript React app with Vite",
            np: "Vite सँग TypeScript React app सुरु गर्ने",
            jp: "Vite で TypeScript React アプリを作成",
          },
          code: `# Create with TypeScript template
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install && npm run dev

# tsconfig.json key compiler options (Vite sets these already)
# "strict": true        — enables all strictness flags
# "jsx": "react-jsx"   — modern JSX transform, no React import needed`,
        },
      ],
    },
    {
      title: {
        en: "Typing Component Props — interface vs type alias",
        np: "Component Props type गर्ने — interface vs type alias",
        jp: "コンポーネント Props の型付け — interface と type エイリアス",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Define a `Props` interface (or type alias) and pass it as a generic argument to your function's parameter destructuring. Mark optional fields with `?`. Use `React.ReactNode` for the `children` prop. Callback types are written as `(arg: T) => void` or `(arg: T) => R`.",
            np: "`Props` interface (वा type alias) बनाउनुस् र function parameter मा destructure गर्नुस्। Optional fields `?` ले। `children` को लागि `React.ReactNode`। Callback types: `(arg: T) => void`।",
            jp: "`Props` interface（または type エイリアス）を定義し、関数パラメータの分割代入に型を付けます。省略可能フィールドは `?`。`children` には `React.ReactNode`。コールバック型は `(arg: T) => void` 形式です。",
          },
        },
        {
          type: "code",
          title: {
            en: "ProductCard with fully typed props interface",
            np: "ProductCard — typed props interface",
            jp: "ProductCard — 完全に型付けされた props interface",
          },
          code: `import type { ReactNode } from "react";

interface ProductCardProps {
  name: string;
  price: number;
  onAdd: (id: string) => void;
  image?: string;          // optional — may be undefined
  children?: ReactNode;    // optional slot for extra content
}

export function ProductCard({ name, price, onAdd, image, children }: ProductCardProps) {
  return (
    <div className="rounded-lg border p-4">
      {image && <img src={image} alt={name} className="mb-2 rounded" />}
      <h2 className="font-semibold">{name}</h2>
      <p className="text-gray-600">\${price.toFixed(2)}</p>
      {children}
      <button
        type="button"
        onClick={() => onAdd(String(Math.random()))}
        className="mt-2 rounded bg-blue-600 px-3 py-1 text-white"
      >
        Add to cart
      </button>
    </div>
  );
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`interface` is open (can be augmented via declaration merging) — preferred for public component props.",
              np: "`interface` open (declaration merging सम्भव) — public props मा राम्रो।",
              jp: "`interface` は拡張可能（宣言マージ）— 公開コンポーネントの props に推奨。",
            },
            {
              en: "`type` alias supports unions, intersections, and mapped types — use it when you need those capabilities.",
              np: "`type` alias union/intersection/mapped — ती चाहिए भने प्रयोग गर्नुस्।",
              jp: "`type` エイリアスはユニオン・交差・マップ型に対応 — それらが必要なときに使います。",
            },
            {
              en: "Both compile away; there is no runtime difference. Many teams pick one and stay consistent.",
              np: "दुवै compile मा हराउँछन्; runtime फरक छैन। एउटा छानेर consistent रहनुस्।",
              jp: "どちらもコンパイル時に消える。ランタイムの差はなし。チームで統一することが重要です。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Common React Utility Types",
        np: "सामान्य React Utility Types",
        jp: "よく使う React ユーティリティ型",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React ships rich built-in types. `ReactNode` is the widest type for anything renderable (string, number, JSX, null, array). `ReactElement` is a narrower type for actual JSX. `CSSProperties` types an inline style object. The event types (`MouseEvent`, `ChangeEvent`, `FormEvent`, `KeyboardEvent`) all take a generic HTML element type so TypeScript knows which properties are available.",
            np: "React built-in types: `ReactNode` — सबभन्दा फराकिलो renderable (string, number, JSX, null, array)। `ReactElement` — actual JSX। `CSSProperties` — inline style। Event types HTML element generic सहित।",
            jp: "React の組み込み型: `ReactNode` はレンダー可能なすべてを表す最も広い型。`ReactElement` は実際の JSX の狭い型。`CSSProperties` はインラインスタイルオブジェクト。イベント型は HTML 要素のジェネリックを取り、利用可能なプロパティを TypeScript が認識します。",
          },
        },
        {
          type: "table",
          caption: {
            en: "React type quick reference",
            np: "React type quick reference",
            jp: "React 型クイックリファレンス",
          },
          headers: [
            { en: "Type", np: "Type", jp: "型" },
            { en: "Use case", np: "कहाँ प्रयोग", jp: "使いどころ" },
            { en: "Example", np: "उदाहरण", jp: "例" },
          ],
          rows: [
            [
              { en: "ReactNode", np: "ReactNode", jp: "ReactNode" },
              { en: "children prop, any renderable value", np: "children prop", jp: "children prop / レンダー可能な値" },
              { en: "children: ReactNode", np: "children: ReactNode", jp: "children: ReactNode" },
            ],
            [
              { en: "ReactElement", np: "ReactElement", jp: "ReactElement" },
              { en: "must be actual JSX (not string/null)", np: "actual JSX", jp: "実際の JSX のみ" },
              { en: "renderItem: () => ReactElement", np: "renderItem: () => ReactElement", jp: "renderItem: () => ReactElement" },
            ],
            [
              { en: "FC<Props>", np: "FC<Props>", jp: "FC<Props>" },
              { en: "function component type (some teams avoid)", np: "function component type", jp: "関数コンポーネント型（使わないチームもあり）" },
              { en: "const Btn: FC<BtnProps> = ...", np: "const Btn: FC<BtnProps>", jp: "const Btn: FC<BtnProps> = ..." },
            ],
            [
              { en: "CSSProperties", np: "CSSProperties", jp: "CSSProperties" },
              { en: "inline style objects", np: "inline style", jp: "インラインスタイルオブジェクト" },
              { en: "style: CSSProperties", np: "style: CSSProperties", jp: "style: CSSProperties" },
            ],
            [
              { en: "MouseEvent<T>", np: "MouseEvent<T>", jp: "MouseEvent<T>" },
              { en: "onClick handlers", np: "onClick handler", jp: "onClick ハンドラ" },
              { en: "MouseEvent<HTMLButtonElement>", np: "MouseEvent<HTMLButtonElement>", jp: "MouseEvent<HTMLButtonElement>" },
            ],
            [
              { en: "ChangeEvent<T>", np: "ChangeEvent<T>", jp: "ChangeEvent<T>" },
              { en: "onChange on inputs/selects", np: "input/select onChange", jp: "input/select の onChange" },
              { en: "ChangeEvent<HTMLInputElement>", np: "ChangeEvent<HTMLInputElement>", jp: "ChangeEvent<HTMLInputElement>" },
            ],
            [
              { en: "FormEvent<T>", np: "FormEvent<T>", jp: "FormEvent<T>" },
              { en: "form onSubmit", np: "form onSubmit", jp: "フォームの onSubmit" },
              { en: "FormEvent<HTMLFormElement>", np: "FormEvent<HTMLFormElement>", jp: "FormEvent<HTMLFormElement>" },
            ],
            [
              { en: "KeyboardEvent<T>", np: "KeyboardEvent<T>", jp: "KeyboardEvent<T>" },
              { en: "onKeyDown / onKeyUp", np: "onKeyDown/onKeyUp", jp: "onKeyDown / onKeyUp" },
              { en: "KeyboardEvent<HTMLInputElement>", np: "KeyboardEvent<HTMLInputElement>", jp: "KeyboardEvent<HTMLInputElement>" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Event handler types in practice",
            np: "Event handler types व्यवहारमा",
            jp: "イベントハンドラ型の実践例",
          },
          code: `import { useState, type ChangeEvent, type FormEvent } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ChangeEvent<HTMLInputElement> — TypeScript knows e.target.value is a string
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // FormEvent<HTMLFormElement> — e.preventDefault() is available
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={handleEmailChange} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Log in</button>
    </form>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Typing useState — Inference vs Explicit Annotation",
        np: "useState type गर्ने — Inference vs Explicit Annotation",
        jp: "useState の型付け — 推論 vs 明示的注釈",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "TypeScript infers the state type from the initial value when it is unambiguous. Provide an explicit generic when the initial value is `null`, `undefined`, or a union type — otherwise TypeScript will widen or narrow incorrectly and give you confusing errors later.",
            np: "Initial value स्पष्ट भए TypeScript inferrence गर्छ। `null`, `undefined`, वा union type भए explicit generic दिनुस् — नत्र TypeScript गलत widen/narrow गर्छ।",
            jp: "初期値が明確なら TypeScript は型を推論します。初期値が `null`・`undefined`・ユニオン型の場合は明示的なジェネリックを渡します。そうしないと TypeScript が誤って拡大・縮小し、後で分かりにくいエラーになります。",
          },
        },
        {
          type: "code",
          title: {
            en: "useState inference vs explicit annotation",
            np: "useState inference vs explicit",
            jp: "useState 推論 vs 明示的注釈",
          },
          code: `import { useState } from "react";

// ✅ Inference is fine — TypeScript knows it's number
const [count, setCount] = useState(0);

// ✅ Inference is fine — TypeScript knows it's string
const [name, setName] = useState("Alice");

// ✅ Explicit needed — initial null, but will hold a User later
interface User { id: string; name: string; email: string }
const [user, setUser] = useState<User | null>(null);

// ✅ Explicit needed — initial [] is untyped without annotation
const [items, setItems] = useState<string[]>([]);

// ✅ Union type — must be explicit
type Status = "idle" | "loading" | "success" | "error";
const [status, setStatus] = useState<Status>("idle");

// ❌ Wrong — TypeScript infers never[] for empty array
// const [items, setItems] = useState([]);  // items: never[]`,
        },
      ],
    },
    {
      title: {
        en: "Typing useRef — DOM Refs vs Mutable Value Refs",
        np: "useRef type गर्ने — DOM Refs vs Mutable Value Refs",
        jp: "useRef の型付け — DOM ref と可変値 ref",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "There are two distinct patterns. For DOM refs (attaching to a JSX element) use `useRef<HTMLInputElement>(null)` — the `| null` initial value is required and TypeScript widens the type to `HTMLInputElement | null`. For mutable values you want to persist without causing re-renders (e.g. an interval ID) use `useRef<number>(0)` — no null, because you always control the value.",
            np: "दुई pattern छन्। DOM refs मा `useRef<HTMLInputElement>(null)` — `| null` initial चाहिन्छ। Mutable value (जस्तै interval ID) मा `useRef<number>(0)` — null छैन किनकि आफैँ control मा।",
            jp: "2種類のパターンがあります。DOM ref には `useRef<HTMLInputElement>(null)` — 初期値 `null` が必要で型は `HTMLInputElement | null`。再レンダーなしに値を保持する可変 ref（interval ID など）は `useRef<number>(0)` — 常に自分で制御するので null は不要です。",
          },
        },
        {
          type: "code",
          title: {
            en: "useRef for DOM element and for mutable interval ID",
            np: "useRef — DOM element र interval ID",
            jp: "useRef — DOM 要素と interval ID の例",
          },
          code: `import { useEffect, useRef } from "react";

export function AutoFocusSearch() {
  // DOM ref — must be HTMLInputElement | null
  const inputRef = useRef<HTMLInputElement>(null);

  // Mutable ref — stores interval ID, never null
  const intervalRef = useRef<number>(0);

  useEffect(() => {
    // Safe access after null check (or non-null assertion if sure)
    inputRef.current?.focus();

    intervalRef.current = window.setInterval(() => {
      console.log("tick");
    }, 1000);

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, []);

  return <input ref={inputRef} type="search" placeholder="Search…" />;
}`,
        },
      ],
    },
    {
      title: {
        en: "Typing useReducer — Discriminated Union Actions",
        np: "useReducer type गर्ने — Discriminated Union Actions",
        jp: "useReducer の型付け — 判別ユニオンアクション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Define a `CartState` interface and a `CartAction` discriminated union. Each action variant has a `type` literal and its own payload shape. TypeScript narrows the action in each switch case, so you get full autocomplete and safety when accessing payload fields.",
            np: "`CartState` interface र `CartAction` discriminated union बनाउनुस्। प्रत्येक variant मा `type` literal र आफ्नो payload। TypeScript switch case मा narrow गर्छ।",
            jp: "`CartState` interface と `CartAction` 判別ユニオンを定義します。各バリアントは `type` リテラルと独自のペイロード形状を持ちます。TypeScript は switch の各 case でアクションを絞り込み、ペイロードフィールドへの完全な補完と安全性を提供します。",
          },
        },
        {
          type: "code",
          title: {
            en: "useReducer with discriminated union CartAction",
            np: "useReducer — CartAction discriminated union",
            jp: "useReducer と判別ユニオン CartAction",
          },
          code: `import { useReducer } from "react";

interface CartItem { id: string; name: string; qty: number }
interface CartState { items: CartItem[]; total: number }

type CartAction =
  | { type: "ADD"; payload: CartItem }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      // TypeScript knows action.payload is CartItem here
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i,
          ),
          total: state.total + 1,
        };
      }
      return {
        items: [...state.items, action.payload],
        total: state.total + 1,
      };
    }
    case "REMOVE":
      // TypeScript knows action.payload is { id: string } here
      return {
        items: state.items.filter((i) => i.id !== action.payload.id),
        total: Math.max(0, state.total - 1),
      };
    case "CLEAR":
      return { items: [], total: 0 };
    default:
      return state;
  }
}

const INITIAL: CartState = { items: [], total: 0 };

export function Cart() {
  const [cart, dispatch] = useReducer(cartReducer, INITIAL);

  return (
    <div>
      <p>{cart.total} items in cart</p>
      <button
        type="button"
        onClick={() =>
          dispatch({ type: "ADD", payload: { id: "p1", name: "Widget", qty: 1 } })
        }
      >
        Add Widget
      </button>
      <button type="button" onClick={() => dispatch({ type: "CLEAR" })}>
        Clear cart
      </button>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Typing Context — The Null Pattern and useAuth Hook",
        np: "Context type गर्ने — Null Pattern र useAuth Hook",
        jp: "Context の型付け — null パターンと useAuth フック",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`createContext` needs a default value that matches the context type. Two common patterns: (1) pass `null` as default and assert in the consumer hook that the value is non-null (throw an error if the hook is used outside the provider); (2) provide a no-op default object that matches the interface. Pattern 1 is safer because it catches missing providers at runtime.",
            np: "`createContext` लाई default value चाहिन्छ। Pattern 1: `null` default → consumer hook मा non-null assert (provider बाहिर throw)। Pattern 2: no-op default object। Pattern 1 बढी safe — missing provider runtime मा समात्छ।",
            jp: "`createContext` には型に合うデフォルト値が必要です。パターン1: デフォルト `null`・コンシューマーフックで non-null アサート（プロバイダ外なら throw）。パターン2: インターフェースに合う no-op デフォルトオブジェクト。パターン1の方が安全 — プロバイダの欠如をランタイムで捕捉できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Typed AuthContext with null pattern + useAuth hook",
            np: "Typed AuthContext null pattern + useAuth hook",
            jp: "null パターンの AuthContext と useAuth フック",
          },
          code: `import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthUser { id: string; email: string; role: "admin" | "user" }

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Pass null as default — the hook will guard against this
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, _password: string) => {
    // In a real app, call your API here
    setUser({ id: "u1", email, role: "user" });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Throws a clear error if used outside <AuthProvider> — no silent null bugs
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

// Usage
function ProfileButton() {
  const { user, logout } = useAuth(); // safe — throws if no provider
  if (!user) return <a href="/login">Log in</a>;
  return <button type="button" onClick={logout}>{user.email}</button>;
}`,
        },
      ],
    },
    {
      title: {
        en: "Generics in Components — Select<T> and List<T>",
        np: "Generic Components — Select<T> र List<T>",
        jp: "ジェネリックコンポーネント — Select<T> と List<T>",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Generic components let you write type-safe reusable UI that works for any data shape. A `Select<T>` dropdown knows which option type it holds; a `List<T>` accepts an array of any record type and a `renderItem` function. TypeScript ensures the `onChange` value and the `renderItem` argument both match `T`.",
            np: "Generic components — कुनै पनि data shape मा type-safe reusable UI। `Select<T>` ले कुन option type छ जान्छ; `List<T>` ले `renderItem` को argument र `onChange` दुवै `T` match गराउँछ।",
            jp: "ジェネリックコンポーネントを使うと、どんなデータ形状にも対応する型安全な再利用可能 UI が書けます。`Select<T>` はどのオプション型を持つか知り、`List<T>` の `renderItem` 引数と `onChange` 値はどちらも `T` と一致することを TypeScript が保証します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Generic Select<T> and List<T> components",
            np: "Generic Select<T> र List<T> components",
            jp: "ジェネリックな Select<T> と List<T>",
          },
          code: `import type { ReactNode } from "react";

// T must have id and label — the constraint makes rendering safe
interface SelectProps<T extends { id: string; label: string }> {
  options: T[];
  value: T | null;
  onChange: (selected: T) => void;
  placeholder?: string;
}

export function Select<T extends { id: string; label: string }>({
  options,
  value,
  onChange,
  placeholder = "Select…",
}: SelectProps<T>) {
  return (
    <select
      value={value?.id ?? ""}
      onChange={(e) => {
        const found = options.find((o) => o.id === e.target.value);
        if (found) onChange(found);
      }}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// Generic list with a renderItem slot
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

export function List<T>({ items, renderItem, keyExtractor, emptyMessage = "No items." }: ListProps<T>) {
  if (items.length === 0) return <p className="text-gray-500">{emptyMessage}</p>;
  return (
    <ul>
      {items.map((item, i) => (
        <li key={keyExtractor(item)}>{renderItem(item, i)}</li>
      ))}
    </ul>
  );
}

// Usage — TypeScript enforces the shape
interface Country { id: string; label: string; code: string }
const countries: Country[] = [
  { id: "np", label: "Nepal", code: "NP" },
  { id: "jp", label: "Japan", code: "JP" },
];

function CountryPicker() {
  return (
    <Select<Country>
      options={countries}
      value={null}
      onChange={(c) => console.log(c.code)} // c is Country, not unknown
    />
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Typing Event Handlers — Inline vs Extracted",
        np: "Event Handlers type गर्ने — Inline vs Extracted",
        jp: "イベントハンドラの型付け — インライン vs 抽出",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "TypeScript can infer event handler types from the JSX attribute when written inline — no annotation needed. When you extract a handler to a named function, you must annotate the event parameter explicitly because TypeScript cannot look backward from the JSX call site.",
            np: "Inline लेख्दा TypeScript JSX attribute बाट infer गर्छ — annotation चाहिँदैन। Named function मा parameter explicitly annotate गर्नुपर्छ — TypeScript JSX call site बाट backward हेर्न सक्दैन।",
            jp: "JSX 属性にインラインで書くと TypeScript がイベントハンドラ型を推論 — 注釈不要。名前付き関数に抽出する場合はパラメータを明示的に注釈する必要があります。TypeScript は JSX 呼び出し元から逆算できないためです。",
          },
        },
        {
          type: "code",
          title: {
            en: "Inline inference vs extracted handler annotation",
            np: "Inline inference vs extracted handler",
            jp: "インライン推論 vs 抽出ハンドラの注釈",
          },
          code: `import { type ChangeEvent, type MouseEvent } from "react";

// ✅ Inline — TypeScript infers ChangeEvent<HTMLInputElement> automatically
<input onChange={(e) => console.log(e.target.value)} />

// ✅ Extracted — must annotate because there's no inference site
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};
<input onChange={handleChange} />

// ✅ Using React.MouseEventHandler<T> shorthand type
import type { MouseEventHandler } from "react";
const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
  e.currentTarget.disabled = true; // TypeScript knows this is a button
};

// as const for action type narrowing in reducer dispatch
const ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  CLEAR: "CLEAR",
} as const;
// typeof ACTIONS["ADD"] is "ADD" not string — discriminated union works
type ActionType = (typeof ACTIONS)[keyof typeof ACTIONS];`,
        },
      ],
    },
    {
      title: {
        en: "Avoiding Common TypeScript Mistakes",
        np: "सामान्य TypeScript गल्तीहरूबाट बच्ने",
        jp: "よくある TypeScript のミスを避ける",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "TypeScript's value comes from accurate types. Three anti-patterns undermine that: (1) `any` disables type-checking entirely for a value — use `unknown` if you genuinely do not know the type, then narrow. (2) Type assertions (`as Foo`) bypass the compiler's safety checks — only use when you have outside knowledge the compiler cannot see. (3) Non-null assertions (`!`) on DOM refs and API responses are the leading cause of runtime crashes in TypeScript codebases.",
            np: "TypeScript को मूल्य accurate types बाट। तीन anti-patterns: (1) `any` — type-check पूरै बन्द; `unknown` + narrow प्रयोग गर्नुस्। (2) Type assertions (`as Foo`) — compiler safety bypass; विशेष ज्ञान भए मात्र। (3) Non-null assertions (`!`) — DOM refs र API responses मा runtime crash को मुख्य कारण।",
            jp: "TypeScript の価値は正確な型から生まれます。3つのアンチパターン: (1) `any` は値の型検査を完全に無効化 — 型が不明なら `unknown` を使い絞り込む。(2) 型アサート（`as Foo`）はコンパイラの安全検査をバイパス — コンパイラが見えない外部知識がある場合のみ。(3) 非 null アサーション（`!`）は TypeScript コードベースでランタイムクラッシュの主因です。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Replace `any` with `unknown` and narrow with type guards, `typeof`, or `instanceof`.",
              np: "`any` लाई `unknown` + type guard/`typeof`/`instanceof` ले replace गर्नुस्।",
              jp: "`any` を `unknown` に替え、型ガード・`typeof`・`instanceof` で絞り込む。",
            },
            {
              en: "Avoid `as Foo` unless you are casting from `unknown` after validation. Never use `as any` as a workaround.",
              np: "`as Foo` validation पछि `unknown` बाट मात्र। `as any` workaround कहिल्यै नगर्नुस्।",
              jp: "バリデーション後に `unknown` からキャストする場合以外は `as Foo` を避ける。`as any` を逃げ道にしない。",
            },
            {
              en: "Use optional chaining (`?.`) over non-null assertion (`!`) wherever possible — it is safer and clearer.",
              np: "Non-null `!` भन्दा optional chaining `?.` जहाँ सम्भव — बढी safe र स्पष्ट।",
              jp: "非 null アサーション `!` より optional chaining `?.` を優先 — より安全で明確です。",
            },
            {
              en: "Enable `\"strict\": true` in `tsconfig.json` — it activates `noImplicitAny`, `strictNullChecks`, and eight other checks.",
              np: "`tsconfig.json` मा `\"strict\": true` — `noImplicitAny`, `strictNullChecks` र अरू ८ check सक्रिय।",
              jp: "`tsconfig.json` の `\"strict\": true` を有効に — `noImplicitAny`・`strictNullChecks` など 8 つの検査が有効になります。",
            },
          ],
        },
        {
          type: "code",
          title: {
            en: "any vs unknown — safe narrowing pattern",
            np: "any vs unknown — safe narrowing",
            jp: "any vs unknown — 安全な絞り込みパターン",
          },
          code: `// ❌ any — TypeScript trusts you completely, no safety
async function fetchUser(): Promise<any> {
  const res = await fetch("/api/user");
  return res.json(); // returns any — caller gets no type help
}

// ✅ unknown + assertion function — safe
interface ApiUser { id: string; name: string }

function assertIsApiUser(val: unknown): asserts val is ApiUser {
  if (
    typeof val !== "object" ||
    val === null ||
    typeof (val as Record<string, unknown>).id !== "string"
  ) {
    throw new Error("Invalid API response shape");
  }
}

async function fetchUserSafe(): Promise<ApiUser> {
  const res = await fetch("/api/user");
  const data: unknown = await res.json();
  assertIsApiUser(data); // narrows data to ApiUser
  return data;           // fully typed downstream
}

// ❌ Non-null assertion on DOM ref — crashes if ref not attached yet
const el = inputRef.current!.focus(); // throws if null

// ✅ Optional chaining — safe
inputRef.current?.focus();`,
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
            en: "You can now write fully typed React components with safe props interfaces, annotate every hook pattern, build generic reusable components, type event handlers correctly, and avoid the common TypeScript anti-patterns that introduce runtime bugs in typed codebases.",
            np: "अब safe props interface सहित पूर्ण typed React components, हरेक hook annotation, generic reusable components, सही event handler types, र runtime bugs ल्याउने anti-patterns बाट बच्न सक्नुहुन्छ।",
            jp: "安全な props interface を持つ完全に型付けされた React コンポーネント・あらゆるフックパターンの注釈・ジェネリック再利用可能コンポーネント・正しいイベントハンドラ型付け・ランタイムバグを招く一般的アンチパターンの回避ができるようになりました。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I use `React.FC` or not?",
        np: "`React.FC` प्रयोग गर्ने कि नगर्ने?",
        jp: "`React.FC` を使うべきか？",
      },
      answer: {
        en: "Many teams avoid `React.FC` (also written `React.FunctionComponent`). It used to implicitly add `children` to all components (removed in React 18 types), and it prevents you from using generics cleanly. The current recommendation is to type props directly: `function Btn({ label }: BtnProps) {}`. Use `FC` only if your team has an explicit style guide requiring it.",
        np: "धेरै team `React.FC` बेवास्ता गर्छ। पहिले सबै components मा `children` implicitly थप्थ्यो (React 18 types मा हटाइयो), र generics राम्रोसँग काम गर्दैन। अहिलेको recommendation: `function Btn({ label }: BtnProps) {}` सीधा। Team style guide छ भने मात्र `FC`।",
        jp: "多くのチームは `React.FC` を避けます。以前はすべてのコンポーネントに暗黙的に `children` を追加していました（React 18 の型で削除）。また、ジェネリックの記述が煩雑になります。現在の推奨は直接 props に型を付ける方法: `function Btn({ label }: BtnProps) {}`。チームのスタイルガイドが要求する場合のみ `FC` を使用してください。",
      },
    },
    {
      question: {
        en: "What is the difference between ReactNode and ReactElement?",
        np: "ReactNode र ReactElement को फरक के हो?",
        jp: "ReactNode と ReactElement の違いは？",
      },
      answer: {
        en: "`ReactNode` is the widest renderable type: JSX, string, number, boolean, null, undefined, or an array of those. `ReactElement` is narrower — it is the object returned by `React.createElement()` (i.e. actual JSX). Use `ReactNode` for the `children` prop. Use `ReactElement` when a prop must be a real JSX element (e.g. a `renderIcon` prop that cannot be a string).",
        np: "`ReactNode` — सबभन्दा फराकिलो renderable: JSX, string, number, boolean, null, undefined, वा ती को array। `ReactElement` — `React.createElement()` ले return गर्ने object (actual JSX)। `children` को लागि `ReactNode`। `renderIcon` जस्तो actual JSX चाहिने prop मा `ReactElement`।",
        jp: "`ReactNode` はレンダー可能な最も広い型: JSX・string・number・boolean・null・undefined またはそれらの配列。`ReactElement` は `React.createElement()` が返すオブジェクト（実際の JSX）と狭い型。`children` prop には `ReactNode`。`renderIcon` のように本物の JSX 要素でなければならない prop には `ReactElement`。",
      },
    },
    {
      question: {
        en: "How do I type an event handler for a custom HTML element?",
        np: "Custom HTML element को event handler type गर्ने कसरी?",
        jp: "カスタム HTML 要素のイベントハンドラはどう型付けする？",
      },
      answer: {
        en: "Use the React synthetic event types with the specific HTML element generic: `React.ChangeEvent<HTMLSelectElement>`, `React.MouseEvent<HTMLDivElement>`, `React.KeyboardEvent<HTMLTextAreaElement>`. If you use a native DOM event (from `addEventListener`), use the native `Event` / `MouseEvent` / `KeyboardEvent` types from the TypeScript DOM lib instead.",
        np: "React synthetic event types + specific HTML element generic: `ChangeEvent<HTMLSelectElement>`, `MouseEvent<HTMLDivElement>`। Native DOM event (`addEventListener`) मा TypeScript DOM lib को native `Event`/`MouseEvent` types।",
        jp: "React の合成イベント型に HTML 要素ジェネリックを組み合わせます: `ChangeEvent<HTMLSelectElement>`・`MouseEvent<HTMLDivElement>`・`KeyboardEvent<HTMLTextAreaElement>`。`addEventListener` からのネイティブ DOM イベントには TypeScript の DOM lib の `Event`/`MouseEvent`/`KeyboardEvent` 型を使います。",
      },
    },
    {
      question: {
        en: "What is `as const` and when does it help?",
        np: "`as const` के हो र कहाँ काम लाग्छ?",
        jp: "`as const` とは何で、どんなときに役立つ？",
      },
      answer: {
        en: "`as const` tells TypeScript to infer the narrowest possible literal type and make all properties readonly. Without it, `{ type: \"ADD\" }` has type `{ type: string }`. With `as const`, the type becomes `{ readonly type: \"ADD\" }`. This is essential for discriminated union action objects and for `const` enum-like maps, because TypeScript can then narrow inside switch/if statements.",
        np: "`as const` — TypeScript लाई narrowest literal type र readonly properties infer गर्न भन्छ। बिना यसको `{ type: \"ADD\" }` को type `{ type: string }`। `as const` सँग `{ readonly type: \"ADD\" }`। Discriminated union action objects र const enum-like maps मा आवश्यक।",
        jp: "`as const` は TypeScript に最も狭いリテラル型と readonly プロパティを推論するよう指示します。なしでは `{ type: \"ADD\" }` の型は `{ type: string }`。`as const` を付けると `{ readonly type: \"ADD\" }`。判別ユニオンのアクションオブジェクトや定数マップに必須で、switch/if 文内での絞り込みが可能になります。",
      },
    },
    {
      question: {
        en: "interface vs type — which to prefer for props?",
        np: "interface vs type — props मा कुन राम्रो?",
        jp: "interface と type — props にはどちらを好むべき？",
      },
      answer: {
        en: "The React community slightly favors `interface` for component props because it supports declaration merging (useful when extending third-party component props) and its error messages tend to be clearer. However, `type` is necessary for union props (`type ButtonVariant = \"primary\" | \"ghost\"`), discriminated unions, and mapped types. A pragmatic rule: default to `interface`, reach for `type` when you need capabilities it cannot provide.",
        np: "React community `interface` props मा slight favor गर्छ — declaration merging (third-party props extend) र clearer error messages। `type` union props, discriminated unions, mapped types मा आवश्यक। व्यावहारिक नियम: default `interface`, capability चाहिए भए `type`।",
        jp: "React コミュニティはコンポーネントの props に `interface` を若干好みます — 宣言マージ（サードパーティの props を拡張するとき有用）とエラーメッセージの明確さが理由です。ただし `type` はユニオン props・判別ユニオン・マップ型に必要です。実用的なルール: デフォルト `interface`、それが提供できない機能が必要なときに `type`。",
      },
    },
    {
      question: {
        en: "How do I migrate a `.jsx` file to `.tsx`?",
        np: "`.jsx` file लाई `.tsx` मा migrate गर्ने कसरी?",
        jp: "`.jsx` ファイルを `.tsx` に移行するには？",
      },
      answer: {
        en: "Rename the file from `.jsx` to `.tsx`. TypeScript will immediately surface implicit `any` props — add a `Props` interface for each component. Fix type errors in order: start with the most-imported shared components (types trickle down). Use `// @ts-expect-error` sparingly to defer complex migrations, remove them as you go. In strict mode, `strictNullChecks` will expose the most issues — fix nullable accesses with optional chaining.",
        np: "File `.jsx` → `.tsx` rename गर्नुस्। TypeScript implicit `any` props देखाउँछ — `Props` interface थप्नुस्। सबैभन्दा बढी import हुने shared components बाट fix सुरु गर्नुस्। `// @ts-expect-error` कम प्रयोग। Strict mode मा `strictNullChecks` nullable accesses देखाउँछ — optional chaining ले fix।",
        jp: "ファイルを `.jsx` → `.tsx` にリネームします。TypeScript が暗黙の `any` props をすぐに示します — 各コンポーネントに `Props` interface を追加。最も多くインポートされる共有コンポーネントからエラーを修正（型は下へ流れます）。複雑な移行の先送りには `// @ts-expect-error` を控えめに。strict モードでは `strictNullChecks` が null アクセスを最も多く露出 — optional chaining で修正。",
      },
    },
    {
      question: {
        en: "What are utility types useful for in React?",
        np: "React मा utility types कहाँ काम लाग्छन्?",
        jp: "React でユーティリティ型はどこで役立つ？",
      },
      answer: {
        en: "`Partial<T>` makes all fields optional — useful for update form state where not every field is always filled. `Pick<T, K>` selects specific fields — use when a child only needs a subset of a larger props interface. `Omit<T, K>` removes fields — extend a third-party component but strip one prop. `ReturnType<typeof fn>` extracts the return type of a function — useful to type the result of a custom hook without writing the interface twice.",
        np: "`Partial<T>` — सबै fields optional (update form state)। `Pick<T, K>` — specific fields select (child को subset)। `Omit<T, K>` — fields हटाउनु (third-party extend)। `ReturnType<typeof fn>` — custom hook को return type, interface दोहोर्याउनु परैन।",
        jp: "`Partial<T>` は全フィールドを省略可能に — すべてのフィールドが常に入力されるわけではない更新フォームの状態に便利。`Pick<T, K>` は特定フィールドを選択 — 子が大きな props interface のサブセットのみ必要なとき。`Omit<T, K>` はフィールドを除去 — サードパーティコンポーネントを拡張してプロップを一つ削除。`ReturnType<typeof fn>` は関数の戻り型を抽出 — カスタムフックの型を interface を二重に書かずに型付けするのに便利。",
      },
    },
    {
      question: {
        en: "How do I type children that only accepts specific components?",
        np: "Children मा specific components मात्र accept गर्ने कसरी type गर्ने?",
        jp: "特定のコンポーネントのみを受け入れる children はどう型付けする？",
      },
      answer: {
        en: "TypeScript cannot enforce this perfectly at the JSX level — `ReactNode` is too broad, and `ReactElement` still accepts any JSX. The pragmatic approach is to use discriminated props: instead of passing children, pass a typed array (`items: MenuItem[]`) and render it internally. If you need slot-like composition, use named props (`header: ReactElement`, `footer: ReactElement`) instead of the generic `children` prop.",
        np: "TypeScript JSX level मा यो perfectly enforce गर्न सक्दैन। Pragmatic approach: children भन्दा typed array (`items: MenuItem[]`) pass गरेर internally render। Slot-like composition मा named props (`header: ReactElement`) प्रयोग generic `children` भन्दा।",
        jp: "TypeScript は JSX レベルでこれを完全には強制できません — `ReactNode` は広すぎ、`ReactElement` も任意の JSX を受け入れます。実用的なアプローチ: children の代わりに型付き配列（`items: MenuItem[]`）を渡して内部でレンダー。スロット的な合成が必要なら、汎用 `children` prop の代わりに named props（`header: ReactElement`、`footer: ReactElement`）を使います。",
      },
    },
  ],
  bullets: [
    {
      en: "Convert a plain `.jsx` component to `.tsx` by renaming and adding a `Props` interface — fix every TypeScript error before moving on.",
      np: "`.jsx` → `.tsx` rename, `Props` interface थप्नुस् — अगाडि जानु अघि हरेक TypeScript error fix गर्नुस्।",
      jp: "`.jsx` を `.tsx` にリネームし `Props` interface を追加 — 次へ進む前にすべての TypeScript エラーを修正する。",
    },
    {
      en: "Build the `Select<T>` generic component and use it with two different option types (e.g. `Country` and `Category`) to see TypeScript enforce the constraint.",
      np: "`Select<T>` generic component बनाउनुस् र दुई फरक option types (जस्तै `Country` र `Category`) सँग प्रयोग गर्नुस् — TypeScript constraint enforce गर्छ।",
      jp: "`Select<T>` ジェネリックコンポーネントを作り、2種類の option 型（例: `Country` と `Category`）で使ってみて TypeScript が制約を強制するのを確認する。",
    },
    {
      en: "Wire `useReducer` with a `CartAction` discriminated union and verify TypeScript prevents dispatching an action with the wrong payload shape.",
      np: "`CartAction` discriminated union सहित `useReducer` wire गर्नुस् र TypeScript ले गलत payload shape को action dispatch रोक्छ भनी verify गर्नुस्।",
      jp: "`CartAction` 判別ユニオンで `useReducer` を接続し、TypeScript が誤ったペイロード形状のアクションのディスパッチを防ぐことを確認する。",
    },
  ],
};
