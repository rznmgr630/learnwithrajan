import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_4_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Props are how parent components talk to children — read-only data flowing downward. State is a component's private memory — data it owns and can change. Together they are the two fundamental data types in React. Analogy: props are like a letter you receive (read-only, came from outside); state is your own notebook (you control it, you update it, you decide what goes in it).",
      np: "Props = parent बाट आउने read-only data। State = component को आफ्नै memory। Lifting state up ले siblings बीच data share गर्न दिन्छ।",
      jp: "propsは親から子への読み取り専用データ、stateはコンポーネント自身のメモリです。",
    },
    {
      en: "Today we cover:\n• <b>Props in depth</b> — destructuring, defaults, spread, callbacks\n• <b>useState</b> — reading, updating, functional updates, batching\n• <b>Updating objects and arrays</b> in state immutably\n• <b>The children prop</b> — composition pattern\n• <b>Lifting state up</b> — sharing state between sibling components",
      np: "Props (destructuring, defaults), useState, immutable updates, children prop, र lifting state up।",
      jp: "props（分割代入、デフォルト値）、useState、不変更新、childrenプロップ、state引き上げ。",
    },
  ],
  sections: [
    {
      title: { en: "Props in depth", np: "Props को गहिरो ज्ञान", jp: "propsの詳細" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Props are <b>immutable inputs</b> — a component receives them but cannot modify them. Think of a component as a function: props are its parameters. Trying to change a prop inside the component is like a function trying to modify its caller's variables — it breaks the one-way data flow React is built on.\n\nBest practices:\n• <b>Destructure props</b> in the function signature for cleaner code\n• <b>Set default values</b> with `= defaultValue` in destructuring\n• <b>Spread props</b> with `{...props}` to pass all props down to a child\n• <b>Callback props</b> (functions passed as props) are how children communicate back to parents",
            np: "Props = immutable inputs। Destructure गर्नुहोस्, default values राख्नुहोस्। Callback props ले children → parent communication हुन्छ।",
            jp: "propsは不変の入力値。分割代入、デフォルト値、スプレッド、コールバックの4つのパターン。",
          },
        },
        {
          type: "code",
          title: { en: "Props patterns", np: "Props ढाँचाहरू", jp: "propsのパターン" },
          code: `// Destructuring + default values in the signature
function Button({
  label,
  variant = 'primary',   // default if not passed
  disabled = false,
  onClick,               // callback prop — parent passes a function
}) {
  return (
    <button
      disabled={disabled}
      className={'btn btn-' + variant}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// Usage
<Button label="Save" onClick={() => handleSave()} />
<Button label="Delete" variant="danger" onClick={() => handleDelete(id)} />
<Button label="Loading..." disabled={true} />

// Spread pattern — pass all parent props down
function IconButton({ icon, ...rest }) {
  return <button {...rest}>{icon} {rest.label}</button>;
}`,
        },
        {
          type: "table",
          caption: {
            en: "Common prop patterns",
            np: "सामान्य prop ढाँचाहरू",
            jp: "よく使うpropsパターン",
          },
          headers: [
            { en: "Pattern", np: "ढाँचा", jp: "パターン" },
            { en: "Syntax", np: "Syntax", jp: "構文" },
            { en: "Use when", np: "कहिले प्रयोग", jp: "使いどき" },
          ],
          rows: [
            [
              { en: "Required prop", np: "Required prop", jp: "必須prop" },
              { en: "`function Foo({ name })`", np: "`function Foo({ name })`", jp: "`function Foo({ name })`" },
              { en: "Always needed", np: "सधैं चाहिन्छ", jp: "常に必要" },
            ],
            [
              { en: "Optional with default", np: "Default सहित optional", jp: "デフォルト付きオプション" },
              { en: "`{ size = 'md' }`", np: "`{ size = 'md' }`", jp: "`{ size = 'md' }`" },
              { en: "Has a sensible fallback", np: "Fallback छ", jp: "代替値がある" },
            ],
            [
              { en: "Callback prop", np: "Callback prop", jp: "コールバックprop" },
              { en: "`{ onSubmit }`", np: "`{ onSubmit }`", jp: "`{ onSubmit }`" },
              { en: "Child notifies parent", np: "Child → Parent", jp: "子が親に通知" },
            ],
            [
              { en: "Children prop", np: "Children prop", jp: "childrenプロップ" },
              { en: "`{ children }`", np: "`{ children }`", jp: "`{ children }`" },
              { en: "Wrap arbitrary content", np: "Content wrap", jp: "任意の内容を包む" },
            ],
          ],
        },
      ],
    },
    {
      title: { en: "useState — giving components memory", np: "useState — component लाई memory", jp: "useState — コンポーネントにメモリを" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>useState</b> lets a component remember a value between renders. Without it, every time React re-renders your component, all local variables reset to their initial values.\n\nAnalogy: a light switch has state — it is either ON or OFF. When you flip it, the room updates instantly. `useState` works the same way — you have a current value (the switch position) and a setter function (the flipper). Call the setter, React re-renders the component with the new value.\n\nImportant rules:\n• <b>Never modify state directly</b> — `count++` does not trigger a re-render; `setCount(count + 1)` does\n• <b>State updates may batch</b> — calling `setCount(count + 1)` three times in a row only adds 1, not 3\n  ↳ Use the functional form: `setCount(prev => prev + 1)` to always work off the latest value\n• <b>useState is per-component</b> — each component instance has its own independent state",
            np: "useState ले component लाई renders बीच value याद राख्न दिन्छ। Setter call = re-render। Functional update `prev => prev + 1` सबैभन्दा safe।",
            jp: "useStateはレンダー間で値を保持します。セッター呼び出しで再レンダー。関数型更新が安全。",
          },
        },
        {
          type: "code",
          title: { en: "Counter with functional update", np: "Counter — functional update सहित", jp: "カウンター（関数型更新）" },
          code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // initial value = 0

  // Functional update — always works off the latest state
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset     = () => setCount(0);

  // WHY functional update matters:
  // setCount(count + 1) three times => adds 1 (uses same stale 'count')
  // setCount(prev => prev + 1) three times => adds 3 (each gets fresh value)

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: { en: "Updating objects and arrays in state", np: "State मा objects र arrays update गर्ने", jp: "stateのオブジェクト・配列更新" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React state must be treated as <b>immutable</b> — you cannot modify objects or arrays in place. You must always create a new object or array.\n\nAnalogy: React's state is like a photograph — you cannot erase and redraw on it, you take a new photo each time. React compares the old photo with the new photo (by reference) to decide whether to re-render. If you modify the same photo, React sees the same reference and thinks nothing changed.\n\nThe three most common array operations:\n• <b>Add item</b> — spread the old array and add the new item: `[...arr, newItem]`\n• <b>Remove item</b> — filter out the item: `arr.filter(i => i.id !== id)`\n• <b>Update item</b> — map and replace the matching item: `arr.map(i => i.id === id ? {...i, done: true} : i)`",
            np: "State immutable छ — object/array directly modify नगर्नुहोस्। नयाँ array/object बनाउनुहोस्। Spread operator `...` सबैभन्दा common tool।",
            jp: "stateは不変。直接変更せず、新しい配列・オブジェクトを作成しましょう。",
          },
        },
        {
          type: "code",
          title: { en: "Immutable state updates", np: "Immutable state updates", jp: "不変なstate更新" },
          code: `import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Buy milk',   done: false },
    { id: 2, text: 'Walk dog',   done: false },
    { id: 3, text: 'Read book',  done: true  },
  ]);
  const [user, setUser] = useState({ name: 'Rajan', age: 25 });

  // ADD — spread existing array, append new item
  const addTodo = (text) => {
    setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
  };

  // REMOVE — filter out the item
  const removeTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // UPDATE — map, replace matching item
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  // UPDATE OBJECT — spread existing, override one field
  const updateName = (name) => {
    setUser(prev => ({ ...prev, name }));
  };

  // BAD (never do this):
  // todos.push({ id: 4, text: 'bad' }); // mutating — React won't see the change
  // setTodos(todos); // same reference — no re-render
}`,
        },
      ],
    },
    {
      title: { en: "The children prop", np: "Children prop", jp: "childrenプロップ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The <b>children</b> prop is special — it holds whatever JSX you place between the opening and closing tags of a component. It enables the <b>composition pattern</b>: you build a wrapper component that controls layout and style, and the consumer controls the content inside.\n\nAnalogy: children is like the filling inside a sandwich — the bread (the wrapper component) defines the shape and style, but you choose what goes in the middle. Different sandwiches, same bread.\n\nWhen to use children:\n• Layout components — `<Card>`, `<Modal>`, `<Section>`, `<Container>`\n• Wrapper utilities — `<ErrorBoundary>`, `<AuthGuard>`, `<Tooltip>`\n• Compound components — where parent and children share implicit state (covered in Day 11)",
            np: "Children prop = component tags बीचको JSX। Layout components (`<Card>`, `<Modal>`) मा बहुत उपयोगी।",
            jp: "childrenプロップはタグ間のJSX。レイアウトコンポーネントで活躍します。",
          },
        },
        {
          type: "code",
          title: { en: "Card component with children", np: "Card component — children सहित", jp: "childrenを使ったCardコンポーネント" },
          code: `// The wrapper — controls layout, style, and structure
function Card({ title, children, footer }) {
  return (
    <div className="card">
      {title && <div className="card-header"><h3>{title}</h3></div>}
      <div className="card-body">
        {children}  {/* whatever the consumer puts between <Card>...</Card> */}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

// Consumer — controls the content
function App() {
  return (
    <div>
      <Card title="User Profile">
        <img src="/avatar.jpg" alt="User" />
        <p>Name: Rajan</p>
        <p>Role: Developer</p>
      </Card>

      <Card title="Stats" footer={<button>View All</button>}>
        <p>Posts: 42</p>
        <p>Followers: 128</p>
      </Card>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: { en: "Lifting state up", np: "State lifting up", jp: "stateの引き上げ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Lifting state up</b> is the pattern for sharing state between sibling components. Since props only flow downward (parent → child), two siblings cannot directly share state. The solution: move the state to their common parent and pass it down as props.\n\nAnalogy: if two siblings need to share information, they pass notes through their parent — the parent holds the data, sends it down to whichever sibling needs to read it, and gives the other sibling a function to update it.\n\nThe pattern:\n1. Move state from the child that owned it to the lowest common ancestor\n2. Pass the state value as a prop to the child that reads it\n3. Pass the setter (or a handler function) as a prop to the child that changes it",
            np: "Lifting state up = siblings बीच state share गर्न state लाई parent मा move गर्ने। Value prop down, setter prop down।",
            jp: "兄弟間でstateを共有するには、共通の親に引き上げてpropsで渡します。",
          },
        },
        {
          type: "code",
          title: { en: "Lifting state to share between siblings", np: "Siblings बीच state share", jp: "兄弟間でstate共有" },
          code: `import { useState } from 'react';

// SearchInput reads from and writes to the state
function SearchInput({ query, onQueryChange }) {
  return (
    <input
      value={query}
      onChange={e => onQueryChange(e.target.value)}
      placeholder="Search..."
    />
  );
}

// ResultsList only reads the state (it doesn't own it)
function ResultsList({ query }) {
  const results = ['Apple', 'Banana', 'Cherry'].filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <ul>
      {results.map(r => <li key={r}>{r}</li>)}
    </ul>
  );
}

// Parent owns the state and passes it down to both siblings
function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div>
      {/* SearchInput writes to state via callback prop */}
      <SearchInput query={query} onQueryChange={setQuery} />
      {/* ResultsList reads state via value prop */}
      <ResultsList query={query} />
    </div>
  );
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What happens if I modify props directly?",
        np: "Props directly modify गरे के हुन्छ?",
        jp: "propsを直接変更したらどうなる？",
      },
      answer: {
        en: "React will not catch it at runtime, but it breaks the one-way data flow. The parent component still thinks the original value is correct — now there is a mismatch between what the parent thinks and what the child shows. On the next render, the parent will overwrite your change with the old value. Always call a callback prop (like `onChange`) to ask the parent to update its state.",
        np: "Props modify गर्दा parent को value unchanged रहन्छ — next render मा overwrite हुन्छ। Callback prop बाट parent को state update गर्नुहोस्।",
        jp: "直接変更しても親は古い値を持ったまま。次のレンダーで上書きされます。コールバックpropで更新を依頼しましょう。",
      },
    },
    {
      question: {
        en: "Why does my state update seem delayed by one render?",
        np: "State update एक render ढिलो देखिन्छ — किन?",
        jp: "stateの更新が1レンダー遅れて見えるのはなぜ？",
      },
      answer: {
        en: "State updates are asynchronous — `setState` schedules a re-render, it does not update the variable in place immediately. After calling `setCount(5)`, reading `count` in the same function still gives you the old value. The new value (`5`) is only available in the next render's function call. This is why functional updates (`prev => prev + 1`) are safer than reading the current state variable.",
        np: "setState ले re-render schedule गर्छ, immediately variable update गर्दैन। Same function मा old value नै पाउँछ। Functional update `prev => ...` प्रयोग गर्नुहोस्।",
        jp: "setState は再レンダーをスケジュールするだけ。同じ関数内では古い値のまま。関数型更新を使いましょう。",
      },
    },
    {
      question: {
        en: "What is the difference between controlled and uncontrolled components?",
        np: "Controlled र uncontrolled components को फरक के हो?",
        jp: "制御コンポーネントと非制御コンポーネントの違いは？",
      },
      answer: {
        en: "A controlled component's value is driven by React state — `<input value={text} onChange={e => setText(e.target.value)} />`. React owns the value, the DOM reflects it. An uncontrolled component stores its own value in the DOM — you read it with a ref when needed (`inputRef.current.value`). Controlled components are more verbose but give you full control (validation, formatting, disabling submit). Prefer controlled for any form you need to interact with programmatically.",
        np: "Controlled = React state ले value control गर्छ। Uncontrolled = DOM ले value राख्छ, ref बाट पढ्छ। Forms को लागि controlled नै best।",
        jp: "制御：ReactのstateがDOM値を管理。非制御：DOMが値を保持しrefで読む。フォームは制御が推奨。",
      },
    },
    {
      question: {
        en: "How many useState calls can I have in one component?",
        np: "एउटा component मा कति useState हुन सक्छ?",
        jp: "1つのコンポーネントにuseStateはいくつ使える？",
      },
      answer: {
        en: "As many as you need — React tracks them by call order. The only rule: never call `useState` inside a loop, condition, or nested function. Always call hooks at the top level of the component. If you find yourself using 6+ separate state variables that all change together, consider merging them into one object with `useState({ ... })` or switching to `useReducer` (covered in Day 9).",
        np: "जति चाहियो उति। Loop, condition, nested function भित्र call नगर्नुहोस् — top level मात्र। ६+ related state छ भने useReducer consider गर्नुहोस्।",
        jp: "必要なだけ使えます。ループや条件の中では呼ばないこと。6個以上関連するなら`useReducer`も検討。",
      },
    },
    {
      question: {
        en: "When should I use an object vs separate state variables?",
        np: "Object state बनाम separate state variables — कहिले के?",
        jp: "オブジェクトstateと個別変数、どちらを使う？",
      },
      answer: {
        en: "Use separate variables for independent values that change independently (e.g., `isLoading`, `error`, `searchQuery` — they change at different times for different reasons). Use an object when values are part of the same entity and change together (e.g., a form with `name`, `email`, `password` — they are all about the same user). One common mistake: putting unrelated values in one object makes every update verbose (you must spread the whole object even if only one field changed).",
        np: "Independent values = separate variables। Related entity (form fields) = object। Unrelated values लाई एउटै object मा नराख्नुहोस्।",
        jp: "独立した値は別々に、同じエンティティのフィールドはオブジェクトで。無関係な値を1つにまとめないこと。",
      },
    },
  ],
};
