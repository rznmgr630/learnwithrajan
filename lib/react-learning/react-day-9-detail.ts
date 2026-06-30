import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_9_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "When a component has multiple related state variables that change together — like a form with <b>loading</b>, <b>error</b>, and <b>data</b> — `useState` starts to feel messy. `useReducer` centralises all update logic in one place like a traffic controller.\n\nAnalogy: `useState` is like having separate drawers for each piece of clothing. `useReducer` is like a wardrobe with labelled sections — everything organised, one door, one system.",
      np: "useReducer ले सम्बन्धित state एकैठाउँ व्यवस्थापन गर्छ। useContext ले prop drilling बेगर data share गर्छ।",
      jp: "`useReducer` で関連 state を一元管理し、`useContext` で prop drilling なしにデータ共有します。",
    },
    {
      en: "In this day we cover:\n\n• <b>useReducer</b> — state + action + reducer pattern\n  ↳ All state transitions go through one function — easy to track, test, and debug\n• <b>useContext</b> — sharing data across the tree without passing props at every level\n• <b>Combining both</b> — the classic app-level state pattern\n• <b>When NOT to use Context</b> — performance gotchas and when to reach for Zustand instead",
      np: "useReducer, useContext, दुवैको combination, र Context को performance gotchas।",
      jp: "`useReducer`・`useContext`・組み合わせパターン・Context の落とし穴を学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "useReducer — the pattern",
        np: "useReducer — pattern",
        jp: "useReducer の基本パターン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>reducer</b> is a pure function that takes the current state and an action, and returns the next state. Think of it like a bank teller — you bring a request (action) to the teller, they check their rules (switch statement), and update the account (state). You never touch the vault directly.\n\nThe three pieces:\n• <b>State</b> — the current data (what's in the vault)\n• <b>Action</b> — a description of what happened (`{ type: 'INCREMENT' }`)\n• <b>Reducer</b> — the pure function that decides the next state given an action",
            np: "Reducer = pure function जसले state र action लिएर नयाँ state फर्काउँछ।",
            jp: "reducer は state と action を受け取り次の state を返す純粋関数です。",
          },
        },
        {
          type: "code",
          title: { en: "Counter with useReducer", np: "useReducer counter", jp: "useReducer カウンター" },
          code: `import { useReducer } from 'react';

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' };

type State = { count: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    case 'reset':     return { count: 0 };
    default:          return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>−</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "Notice: the component never touches state directly — it only calls `dispatch`. This means you can test the reducer function in complete isolation — no React needed, just call `reducer(state, action)` and assert the result.",
            np: "Component ले सिधै state छोड्दैन — dispatch मात्र call गर्छ। Reducer छुट्टै test गर्न मिल्छ।",
            jp: "コンポーネントは `dispatch` を呼ぶだけ。reducer は単体テスト可能です。",
          },
        },
      ],
    },
    {
      title: {
        en: "useReducer with complex async state",
        np: "Async state को लागि useReducer",
        jp: "複雑な非同期状態での useReducer",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The real power of `useReducer` shines when state has multiple fields that change together. Compare: managing an API fetch with three `useState` calls vs one `useReducer`.\n\nThe reducer makes every transition explicit and prevents impossible states — like `loading: true` AND `error: 'Failed'` both being true at the same time.",
            np: "API fetch को तीनवटा useState vs एउटा useReducer — reducer ले impossible state रोक्छ।",
            jp: "API フェッチを `useState` 3つ vs `useReducer` 1つで比較——reducer は不整合状態を防ぎます。",
          },
        },
        {
          type: "code",
          title: { en: "Async data reducer", np: "Async data reducer", jp: "非同期データ reducer" },
          code: `type Post = { id: number; title: string };

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Post[] }
  | { status: 'error'; error: string };

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; data: Post[] }
  | { type: 'FETCH_ERROR'; error: string }
  | { type: 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':   return { status: 'loading' };
    case 'FETCH_SUCCESS': return { status: 'success', data: action.data };
    case 'FETCH_ERROR':   return { status: 'error', error: action.error };
    case 'RESET':         return { status: 'idle' };
    default:              return state;
  }
}

function PostsList() {
  const [state, dispatch] = useReducer(reducer, { status: 'idle' });

  useEffect(() => {
    dispatch({ type: 'FETCH_START' });
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => dispatch({ type: 'FETCH_SUCCESS', data }))
      .catch(err => dispatch({ type: 'FETCH_ERROR', error: err.message }));
  }, []);

  if (state.status === 'loading') return <p>Loading...</p>;
  if (state.status === 'error')   return <p>Error: {state.error}</p>;
  if (state.status === 'success') return <ul>{state.data.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
  return null;
}`,
        },
      ],
    },
    {
      title: {
        en: "useContext — sharing data without prop drilling",
        np: "useContext — prop drilling बेगर data share",
        jp: "useContext — prop drilling なしで共有",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Prop drilling</b> is passing data through multiple components just to reach a deeply nested one. Analogy: prop drilling is like a game of telephone — you pass a message through 5 people to reach one person. Context is like a radio broadcast — any component that tunes in receives the signal directly.\n\nContext works in three steps:\n1. <b>Create</b> — `createContext(defaultValue)` defines the channel\n2. <b>Provide</b> — `<Context.Provider value={...}>` broadcasts the value\n3. <b>Consume</b> — `useContext(Context)` tunes in anywhere in the tree",
            np: "Context = 3 steps: create, provide, consume। Prop drilling हटाउँछ।",
            jp: "Context は create → provide → consume の 3 ステップ。prop drilling を解消します。",
          },
        },
        {
          type: "code",
          title: { en: "Theme context example", np: "Theme context उदाहरण", jp: "テーマ Context の例" },
          code: `import { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

// 1. Create
const ThemeContext = createContext<Theme>('light');

// 2. Provide at the top level
function App() {
  const [theme, setTheme] = useState<Theme>('light');
  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      <Sidebar />  {/* Sidebar doesn't need to know about theme */}
    </ThemeContext.Provider>
  );
}

// 3. Consume anywhere — Sidebar never received theme as a prop
function DeepButton() {
  const theme = useContext(ThemeContext);
  return (
    <button className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}>
      Themed Button
    </button>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Combining useReducer + useContext",
        np: "useReducer + useContext combination",
        jp: "useReducer + useContext の組み合わせ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The pattern: put `state` and `dispatch` from `useReducer` inside a Context. Any component can read state OR dispatch actions without prop drilling. Wrap it in a custom hook (`usePosts()`) so consumers don't even need to know Context is involved.",
            np: "useReducer को state र dispatch Context मा राख्नुहोस् — custom hook मा wrap गर्नुहोस्।",
            jp: "`useReducer` の `state` と `dispatch` を Context に入れ、カスタムフックでラップします。",
          },
        },
        {
          type: "code",
          title: { en: "Posts context + reducer pattern", np: "Posts context pattern", jp: "Posts context パターン" },
          code: `import { createContext, useContext, useReducer } from 'react';

type Post = { id: number; title: string };
type PostsState = { posts: Post[]; loading: boolean };
type PostsAction =
  | { type: 'SET_POSTS'; posts: Post[] }
  | { type: 'ADD_POST'; post: Post }
  | { type: 'SET_LOADING'; loading: boolean };

function postsReducer(state: PostsState, action: PostsAction): PostsState {
  switch (action.type) {
    case 'SET_POSTS':   return { ...state, posts: action.posts };
    case 'ADD_POST':    return { ...state, posts: [action.post, ...state.posts] };
    case 'SET_LOADING': return { ...state, loading: action.loading };
    default:            return state;
  }
}

const PostsContext = createContext<{
  state: PostsState;
  dispatch: React.Dispatch<PostsAction>;
} | null>(null);

// Provider
export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(postsReducer, { posts: [], loading: false });
  return <PostsContext.Provider value={{ state, dispatch }}>{children}</PostsContext.Provider>;
}

// Custom hook — consumers never need to import Context directly
export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used inside PostsProvider');
  return ctx;
}

// Usage anywhere in the tree
function NewPostButton() {
  const { dispatch } = usePosts();
  const addPost = () => dispatch({ type: 'ADD_POST', post: { id: Date.now(), title: 'New Post' } });
  return <button onClick={addPost}>Add Post</button>;
}`,
        },
      ],
    },
    {
      title: {
        en: "When NOT to use Context",
        np: "Context कहिले नप्रयोग गर्ने",
        jp: "Context を使うべきでない場面",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Context re-renders <b>every consumer</b> when the value changes — even consumers that only care about one field. Analogy: a fire alarm evacuates the whole building even if smoke is only in one room. If you put `user`, `theme`, `cartItems`, and `notifications` all in one Context, updating the cart re-renders components that only need the user.\n\nSolutions:\n• <b>Split contexts</b> by update frequency — `UserContext`, `ThemeContext`, `CartContext` separately\n  ↳ Low-frequency data (theme, locale) in one context; high-frequency (cart, notifications) in another\n• <b>Memoize the value</b> — `const value = useMemo(() => ({ state, dispatch }), [state])`\n• <b>Switch to Zustand</b> when you have frequent updates, many consumers, or need selector subscriptions",
            np: "Context ले सबै consumer re-render गर्छ। Split गर्नुहोस् वा Zustand प्रयोग गर्नुहोस्।",
            jp: "Context は全 consumer を再レンダーします。分割するか Zustand を使いましょう。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Choosing the right state solution",
            np: "सही state solution छान्नुहोस्",
            jp: "適切な状態管理の選び方",
          },
          headers: [
            { en: "Solution", np: "समाधान", jp: "ソリューション" },
            { en: "When to use", np: "कहिले", jp: "使う場面" },
            { en: "Performance", np: "प्रदर्शन", jp: "パフォーマンス" },
          ],
          rows: [
            [
              { en: "useState", np: "useState", jp: "useState" },
              { en: "Simple local state in one component", np: "सरल local state", jp: "シンプルなローカル状態" },
              { en: "Excellent", np: "उत्कृष्ट", jp: "優秀" },
            ],
            [
              { en: "useReducer", np: "useReducer", jp: "useReducer" },
              { en: "Complex state with many related transitions", np: "धेरै transitions भएको state", jp: "複雑な状態遷移" },
              { en: "Excellent", np: "उत्कृष्ट", jp: "優秀" },
            ],
            [
              { en: "Context", np: "Context", jp: "Context" },
              { en: "Low-frequency shared data (theme, user, locale)", np: "कम update हुने shared data", jp: "更新頻度が低い共有データ" },
              { en: "Good if split well", np: "split गरे राम्रो", jp: "適切に分割すれば良好" },
            ],
            [
              { en: "Zustand", np: "Zustand", jp: "Zustand" },
              { en: "Frequent updates, many consumers, need selectors", np: "frequent updates, selectors", jp: "高頻度更新・セレクターが必要" },
              { en: "Excellent (selector subscriptions)", np: "selector subscription", jp: "セレクター購読で優秀" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between useReducer and Redux?",
        np: "useReducer र Redux मा के फरक?",
        jp: "useReducer と Redux の違いは？",
      },
      answer: {
        en: "`useReducer` is built into React — it handles state for one component tree. Redux is a standalone library with a global store, middleware (thunks/sagas for async), time-travel debugging, and a larger ecosystem. For most apps, `useReducer` + Context is enough. Reach for Redux when you need middleware, advanced DevTools, or a very large team needing strict patterns.",
        np: "useReducer = built-in, local। Redux = global store, middleware, time-travel debugging।",
        jp: "`useReducer` は組み込みでローカル。Redux はグローバルストア・ミドルウェア・タイムトラベルを持つ外部ライブラリ。",
      },
    },
    {
      question: {
        en: "Does Context replace Redux?",
        np: "Context ले Redux replace गर्छ?",
        jp: "Context は Redux の代替になる？",
      },
      answer: {
        en: "Context replaces Redux for simple cases — sharing a theme, current user, or locale. It does NOT replace Redux for high-frequency updates, complex async flows, or large apps needing fine-grained subscriptions. Zustand is a better modern alternative for most apps that were previously using Redux.",
        np: "Simple sharing को लागि हो। High-frequency updates को लागि Zustand वा Redux।",
        jp: "テーマや現在ユーザーの共有には十分。高頻度更新や複雑な非同期には Zustand か Redux。",
      },
    },
    {
      question: {
        en: "Can I update Context without re-rendering all consumers?",
        np: "सबै consumer re-render नगरी Context update गर्न मिल्छ?",
        jp: "全 consumer を再レンダーせずに Context を更新できる？",
      },
      answer: {
        en: "Not natively. Context always re-renders all consumers when the value reference changes. Mitigations: (1) split into smaller contexts by update frequency, (2) memoize the context value with `useMemo`, (3) put `dispatch` in its own separate context (it never changes), or (4) switch to Zustand which has built-in selector subscriptions.",
        np: "Native मा सकिँदैन। Split, useMemo, वा Zustand प्रयोग गर्नुहोस्।",
        jp: "ネイティブでは不可。コンテキスト分割・`useMemo`・Zustand などで軽減します。",
      },
    },
    {
      question: {
        en: "When does a Context consumer re-render?",
        np: "Context consumer कहिले re-render गर्छ?",
        jp: "Context コンシューマはいつ再レンダーされる？",
      },
      answer: {
        en: "A consumer re-renders whenever the Context value reference changes — even if the data inside looks the same. This is why passing `value={{ state, dispatch }}` inline to a Provider causes all consumers to re-render on every parent re-render (new object reference each time). Fix: wrap the value in `useMemo`.",
        np: "Context value reference बदलिए consumer re-render हुन्छ। useMemo ले fix गर्नुहोस्।",
        jp: "Context 値の参照が変わるたびに再レンダー。`useMemo` でインライン `{}` の問題を防ぎます。",
      },
    },
    {
      question: {
        en: "Should I use useReducer or useState for form state?",
        np: "Form state को लागि useReducer वा useState?",
        jp: "フォーム状態に useReducer と useState どちら？",
      },
      answer: {
        en: "Use `useState` for simple forms (2-3 fields). Use `useReducer` when: you have complex validation logic, fields depend on each other, you need a loading/error/success lifecycle alongside the field values, or you want to reset all fields at once cleanly. React Hook Form is the best choice for most real forms — it handles all of this and avoids re-renders on every keystroke.",
        np: "Simple form = useState। Complex form = useReducer। Real project = React Hook Form।",
        jp: "シンプルなフォームは `useState`。複雑なら `useReducer`。実案件は React Hook Form が最適。",
      },
    },
  ],
};
