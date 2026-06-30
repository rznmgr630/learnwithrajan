import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_11_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Custom hooks let you extract and reuse stateful logic between components. If you find yourself copy-pasting the same `useState` + `useEffect` pattern in multiple components, that's a signal to make a custom hook. Analogy: a custom hook is like a recipe — instead of improvising every time you cook pasta, you write the recipe once and follow it each time. The result is consistent and shareable.\n\n<b>Why custom hooks matter:</b>\n• They move complexity OUT of components — the component stays clean and readable\n• They're just functions, so they're easy to test in isolation\n• They compose — you can build hooks that call other hooks",
      np: "Custom hooks ले stateful logic निकालेर components बीच share गर्छ। useState+useEffect pattern copy-paste गर्नु परे custom hook बनाउनु।",
      jp: "カスタムフックは状態ロジックを抽出して再利用します。同じ useState+useEffect をコピーしているなら、フックに切り出すサインです。",
    },
    {
      en: "Today's topics:\n• <b>Custom hooks</b> — rules, patterns, real examples (`useLocalStorage`, `useDebounce`, `useWindowSize`)\n• <b>useRef</b> — DOM access and mutable values that don't trigger re-renders\n• <b>forwardRef</b> — passing refs through component boundaries\n• <b>Compound components</b> — components that work as a coordinated system\n• <b>Render props pattern</b> — sharing behavior by passing UI as a function",
      np: "Custom hooks, useRef, forwardRef, compound components, render props — advanced React patterns।",
      jp: "カスタムフック・useRef・forwardRef・複合コンポーネント・レンダープロップを学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Building custom hooks",
        np: "Custom hooks बनाउने",
        jp: "カスタムフックの作り方",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A custom hook is a JavaScript function whose name starts with `use` and that calls other hooks inside. Three rules:\n• Must start with `use` — React uses this to enforce the rules of hooks\n  ↳ `useLocalStorage` ✓, `localStorageHelper` ✗ (won't get linting protection)\n• Can call `useState`, `useEffect`, other custom hooks\n• Returns whatever the component needs — state values, setter functions, loading flags\n\n<b>What a custom hook cannot do:</b> return JSX. It's a logic container, not a component.",
            np: "Custom hook = `use` बाट सुरु हुने function जसले अन्य hooks call गर्छ। JSX return गर्न सक्दैन।",
            jp: "`use` で始まる関数で他のフックを呼びます。JSX は返せません。",
          },
        },
        {
          type: "code",
          title: { en: "Three practical custom hooks", np: "तीन उदाहरण", jp: "3つの実践例" },
          code: `// 1. useLocalStorage — persist state to localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}

// 2. useDebounce — delay a value until user stops typing
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// 3. useWindowSize — track viewport dimensions
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return size;
}

// Usage — components become simple:
function SearchBar() {
  const [query, setQuery] = useLocalStorage('search', '');
  const debouncedQuery = useDebounce(query);
  const { width } = useWindowSize();
  // component is now just UI — all logic in hooks
}`,
        },
      ],
    },
    {
      title: {
        en: "useRef — DOM access and mutable values",
        np: "useRef — DOM access र mutable values",
        jp: "useRef — DOM アクセスと可変値",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useRef` has two completely different uses:\n• <b>DOM ref</b> — hold a reference to a DOM element so you can call imperative methods (`.focus()`, `.scrollIntoView()`, `.play()`)\n• <b>Mutable container</b> — store a value that persists across renders but does NOT trigger re-renders when changed\n\nAnalogy: a ref is like a sticky note on your desk — you can read and update it anytime without disturbing anyone else in the office (no re-renders).",
            np: "useRef: DOM element access र re-render trigger नगर्ने mutable value store गर्न।",
            jp: "`useRef` は DOM への参照と、再レンダーを起こさない可変値の保持という2用途があります。",
          },
        },
        {
          type: "code",
          title: { en: "useRef examples", np: "useRef उदाहरण", jp: "useRef の使用例" },
          code: `// 1. DOM access — focus input on mount
function SearchInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="Search..." />;
}

// 2. Mutable container — track previous value without re-render
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0);

  useEffect(() => {
    prevCountRef.current = count; // update AFTER render
  }, [count]);

  return (
    <div>
      <p>Current: {count} | Previous: {prevCountRef.current}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

// 3. Store interval ID to clear later (no re-render needed)
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  };
  const stop = () => clearInterval(intervalRef.current);

  return (
    <div>
      {seconds}s
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "forwardRef — passing refs through components",
        np: "forwardRef — components मार्फत refs पास गर्ने",
        jp: "forwardRef — コンポーネントを超えて ref を渡す",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "By default, `ref` is not a regular prop — you can't pass a `ref` to a custom component the same way you pass `className`. `forwardRef` lets your custom component accept a ref from its parent and attach it to a DOM element inside.\n\n<b>When you need it:</b>\n• Building a reusable `<Input>` component that the parent needs to `.focus()`\n• Building a UI library with accessible components\n• Integrating with third-party libraries that use refs\n\n<b>React 19 note:</b> In React 19, `ref` is passed as a regular prop — `forwardRef` is no longer needed. But most projects still use React 18, so knowing `forwardRef` remains important.",
            np: "forwardRef ले custom component मा parent बाट ref accept गर्न दिन्छ। React 19 मा यो आवश्यक छैन।",
            jp: "`forwardRef` でカスタムコンポーネントが親からの ref を受け取れます。React 19 では不要になります。",
          },
        },
        {
          type: "code",
          title: { en: "forwardRef example", np: "forwardRef उदाहरण", jp: "forwardRef の例" },
          code: `import { forwardRef, useRef } from 'react';

// A reusable Input that forwards its ref to the underlying <input>
const Input = forwardRef(function Input({ label, ...props }, ref) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input ref={ref} {...props} />
    </div>
  );
});

// Parent can now focus the input imperatively
function LoginForm() {
  const emailRef = useRef(null);

  const handleValidationError = () => {
    emailRef.current?.focus(); // bring user back to the field
    emailRef.current?.select(); // highlight existing text
  };

  return (
    <form>
      <Input ref={emailRef} label="Email" type="email" />
      <button type="button" onClick={handleValidationError}>
        Test Focus
      </button>
    </form>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Compound components",
        np: "Compound components",
        jp: "複合コンポーネント",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Compound components are a group of components that work together as a system, sharing implicit state through Context. Analogy: `<select>` and `<option>` are compound components — `<option>` only makes sense inside `<select>`, and `<select>` manages which `<option>` is active.\n\n<b>Why use this pattern:</b>\n• Flexible API — the parent controls the structure, not the internals\n• Clean usage at the call site — reads like markup\n• Shared state lives in one place (Context) — no prop drilling",
            np: "Compound components = एकसाथ काम गर्ने components को group। Context मार्फत state share गर्छन्।",
            jp: "複合コンポーネントは Context で暗黙的に状態を共有するグループです。",
          },
        },
        {
          type: "code",
          title: { en: "Tabs compound component", np: "Tabs compound component", jp: "Tabs 複合コンポーネント" },
          code: `import { createContext, useContext, useState } from 'react';

const TabsContext = createContext(null);

function Tabs({ defaultValue, children }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }) {
  return <div role="tablist">{children}</div>;
};

Tabs.Trigger = function TabsTrigger({ value, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={active === value}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ value, children }) {
  const { active } = useContext(TabsContext);
  if (active !== value) return null;
  return <div role="tabpanel">{children}</div>;
};

// Usage — reads like markup, not a configuration object:
<Tabs defaultValue="profile">
  <Tabs.List>
    <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="profile"><ProfileForm /></Tabs.Panel>
  <Tabs.Panel value="settings"><SettingsForm /></Tabs.Panel>
</Tabs>`,
        },
      ],
    },
    {
      title: {
        en: "Render props pattern",
        np: "Render props pattern",
        jp: "レンダープロップパターン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The render props pattern means passing a function as a prop — and the component calls that function to get the UI to render. Analogy: render props is like renting a venue — the venue owner (component) provides the space and chairs, you decide how to decorate it (the UI).\n\n<b>Historical context:</b> Before hooks, render props was the main way to share stateful logic. Today, custom hooks do this better in most cases. Render props still appears in some libraries (React Router's `<Route render={...}>`, some animation libraries).",
            np: "Render props = function prop पास गर्ने pattern। Hooks आएपछि custom hooks ले धेरैजसो replace गरेको छ।",
            jp: "関数をプロップとして渡すパターン。今はカスタムフックで置き換えられることが多いです。",
          },
        },
        {
          type: "code",
          title: { en: "Render props vs custom hook", np: "Render props vs custom hook", jp: "レンダープロップ vs カスタムフック" },
          code: `// OLD: render props pattern
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return render(pos);
}

// Usage — works but nests deeply with multiple render props:
<MouseTracker render={({ x, y }) => <div>Mouse: {x}, {y}</div>} />

// MODERN: custom hook (simpler, more composable)
function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return pos;
}

// Component stays in full control of its own JSX:
function Cursor() {
  const { x, y } = useMousePosition();
  return <div style={{ left: x, top: y }} className="cursor-dot" />;
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Can a custom hook return JSX?",
        np: "Custom hook ले JSX return गर्न सक्छ?",
        jp: "カスタムフックは JSX を返せる？",
      },
      answer: {
        en: "No. A custom hook returns data — state values, setters, derived values — not UI. If you need to return JSX, that's a component. The rule of thumb: if it has a `return (...)` with JSX, it's a component; if it has a `return { value, setter }`, it's a hook.",
        np: "होइन। Hook ले data return गर्छ, JSX होइन। JSX return गर्न परे त्यो component हो।",
        jp: "いいえ。フックはデータを返します。JSX を返したいなら、それはコンポーネントです。",
      },
    },
    {
      question: {
        en: "What is the difference between a custom hook and a utility function?",
        np: "Custom hook र utility function मा के फरक?",
        jp: "カスタムフックとユーティリティ関数の違いは？",
      },
      answer: {
        en: "A utility function is a plain function — no hooks inside. A custom hook is a function that contains React hooks (`useState`, `useEffect`, etc.). If your function doesn't call any hooks, it doesn't need the `use` prefix — it's just a regular function and can be called anywhere (inside loops, conditions, non-component functions).",
        np: "Utility function = hooks बिनाको plain function। Custom hook = React hooks भएको function।",
        jp: "ユーティリティ関数はフックを呼ばない純粋関数。カスタムフックは内部でフックを呼びます。",
      },
    },
    {
      question: {
        en: "When should I use render props vs custom hooks?",
        np: "Render props vs custom hooks कहिले?",
        jp: "レンダープロップとカスタムフックの使い分けは？",
      },
      answer: {
        en: "Prefer custom hooks — they're simpler, more readable, and compose better without nesting. Use render props when: the library you're integrating with uses render props and you have no choice, or when you need to share both logic AND structural UI (like a virtual list that needs to render each row via a render function). In practice, custom hooks cover 95% of cases.",
        np: "Custom hooks prefer गर्नुहोस्। Render props: library require गरे वा UI structure+logic दुवै share गर्नु परे।",
        jp: "基本はカスタムフック。ライブラリが要求する場合や UI 構造も共有したい場合にレンダープロップ。",
      },
    },
    {
      question: {
        en: "What happens if I call a hook conditionally?",
        np: "Hook condition मा call गरे के हुन्छ?",
        jp: "条件付きでフックを呼ぶとどうなる？",
      },
      answer: {
        en: "React tracks hooks by their call order — hook 1, hook 2, hook 3, etc. on every render. If you wrap a hook in an `if` statement, it might get skipped on some renders, shifting the order — React then reads the wrong state for the wrong hook. ESLint's `react-hooks/rules-of-hooks` plugin catches this automatically. Always call hooks at the top level of your function.",
        np: "React ले hooks को order track गर्छ। Condition मा call गरे order shift हुन्छ र wrong state मिल्छ।",
        jp: "React はフック呼び出し順を追います。条件分岐でスキップすると順番がずれてバグになります。",
      },
    },
    {
      question: {
        en: "What is `useImperativeHandle`?",
        np: "`useImperativeHandle` के हो?",
        jp: "`useImperativeHandle` とは？",
      },
      answer: {
        en: "`useImperativeHandle` lets you customise what a parent sees when it uses a ref on your component. Instead of exposing the raw DOM node, you expose a controlled object with specific methods like `{ focus, scrollToTop, reset }`. Used with `forwardRef` and mainly in component library development. Avoid in regular app code — prefer passing callbacks as props instead.",
        np: "`useImperativeHandle` ले parent को ref मा expose हुने value customize गर्छ। `forwardRef` सँग use हुन्छ।",
        jp: "親の ref に公開するオブジェクトをカスタマイズします。`forwardRef` と一緒に使います。",
      },
    },
  ],
};
