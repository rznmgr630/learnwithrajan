import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_6_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "State in React has one golden rule: <b>never mutate it directly — always replace it</b>. This sounds annoying at first, but it is the secret behind why React can efficiently detect what changed.\n\nAnalogy: React's change detection is like a wax seal on an envelope — it checks whether the seal is intact (same reference) or broken (new reference). If you open the envelope and re-seal it (mutate the object in place), React doesn't notice anything changed. You must hand React a brand-new envelope with new contents.",
      np: "State directly mutate नगर्नुस् — हमेशा नयाँ object/array बनाउनुस्। React reference compare गर्छ, content होइन।",
      jp: "React の state は直接変更せず必ず置き換えます。参照を比較するため、同じオブジェクトを変えても検知できません。",
    },
    {
      en: "Today we cover:\n• <b>Why immutability matters</b> — the reference comparison model\n• <b>Updating nested objects</b> — spreading at every level\n• <b>Updating arrays</b> — add, remove, update, reorder without mutating\n• <b>Immer</b> — write mutations, get immutability for free\n• <b>useState lazy initialisation & functional updates</b> — performance and correctness",
      np: "Immutability, nested objects update, arrays update, Immer, lazy init, functional updates।",
      jp: "イミュータビリティ・ネストオブジェクト更新・配列操作・Immer・遅延初期化を学びます。",
    },
  ],
  sections: [
    {
      title: { en: "Why React requires immutability", np: "Immutability किन?", jp: "イミュータビリティが必要な理由" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React detects state changes using <b>reference equality</b> (`Object.is`). It asks: \"is this the same object in memory as before?\" — not \"did any property inside change?\"\n\nIf you mutate an object and pass the same reference to `setState`, React sees an identical reference and skips re-rendering. Your UI stays stale.\n\nThe fix is always to create a <b>new object or array</b> with the changes applied. The spread operator (`...`) is the most common tool for this.",
            np: "React ले `Object.is` बाट reference compare गर्छ। Mutate गरेर same reference दिए re-render हुँदैन। नयाँ object/array बनाउनु पर्छ।",
            jp: "React は `Object.is` で参照を比較します。同じ参照を渡すと再レンダーされません。",
          },
        },
        {
          type: "code",
          title: { en: "Mutation bug vs immutable fix", np: "Mutation bug र fix", jp: "ミューテーションのバグと修正" },
          code: `import { useState } from "react";

function ProfileForm() {
  const [user, setUser] = useState({ name: "Rajan", age: 25 });

  // ❌ BUG — mutating the existing object; React sees same reference → no re-render
  function handleBuggyUpdate() {
    user.name = "Updated";
    setUser(user); // same object! React bails out
  }

  // ✅ FIX — spread creates a new object; React sees new reference → re-renders
  function handleCorrectUpdate() {
    setUser({ ...user, name: "Updated" });
  }

  // ✅ ALSO CORRECT — functional update receives the latest state snapshot
  function handleFunctionalUpdate(newName) {
    setUser(prev => ({ ...prev, name: newName }));
  }

  return <p>Name: {user.name}</p>;
}`,
        },
      ],
    },
    {
      title: { en: "Updating nested objects", np: "Nested objects update", jp: "ネストされたオブジェクトの更新" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Nested objects require spreading at <b>every level</b>. A shallow spread (`{ ...state }`) only copies the top-level properties — nested objects still share the same reference.\n\nAnalogy: imagine copying a folder by scanning the cover but not the pages inside. The cover is a copy but the pages are still the originals.\n\nSpread each level explicitly:\n• `{ ...form }` — copies the outer form object\n• `{ ...form.address }` — copies the nested address object\n↳ This gets verbose fast — Immer (Section 4) solves this elegantly",
            np: "Nested objects को लागि हरेक level मा spread गर्नु पर्छ। Shallow spread ले भित्रका objects shared रहन्छन्।",
            jp: "ネストされたオブジェクトは各レベルでスプレッドが必要です。浅いコピーでは内部の参照は共有されたままです。",
          },
        },
        {
          type: "code",
          title: { en: "Updating nested form state", np: "Nested form state update", jp: "ネストフォームの state 更新" },
          code: `const [form, setForm] = useState({
  user:    { name: "", email: "" },
  address: { city: "", zip: "" },
});

// ✅ Update nested field — must spread both levels
function handleNameChange(name) {
  setForm(prev => ({
    ...prev,               // copy top-level keys (user, address)
    user: {
      ...prev.user,        // copy nested user keys
      name,                // override just the name
    },
  }));
}

// Generic handler for any nested field
function handleChange(section, field, value) {
  setForm(prev => ({
    ...prev,
    [section]: { ...prev[section], [field]: value },
  }));
}

// Usage
<input
  value={form.user.name}
  onChange={e => handleChange("user", "name", e.target.value)}
/>`,
        },
      ],
    },
    {
      title: { en: "Updating arrays in state", np: "Arrays update", jp: "配列の state 更新" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Arrays are the most common state structure — todo lists, posts, messages. The four operations you need are: <b>add</b>, <b>remove</b>, <b>update</b>, and <b>reorder</b>. None of them should mutate the original array.\n\n• Never use `push()`, `pop()`, `splice()`, or `sort()` directly on a state array\n↳ These mutate in place — use the immutable equivalents below instead",
            np: "Arrays मा push/pop/splice directly use नगर्नुस् — immutable equivalents प्रयोग गर्नुस्।",
            jp: "配列の state 操作は push/splice を避け、イミュータブルな方法を使います。",
          },
        },
        {
          type: "code",
          title: { en: "The 4 immutable array operations", np: "4 immutable array operations", jp: "4つのイミュータブル配列操作" },
          code: `const [todos, setTodos] = useState([
  { id: 1, text: "Buy groceries", done: false },
  { id: 2, text: "Walk the dog",  done: false },
]);

// ADD — spread existing items + append the new one
function addTodo(text) {
  setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
}

// REMOVE — filter out the item by id
function removeTodo(id) {
  setTodos(prev => prev.filter(t => t.id !== id));
}

// UPDATE / TOGGLE — map and replace the matching item
function toggleTodo(id) {
  setTodos(prev =>
    prev.map(t => (t.id === id ? { ...t, done: !t.done } : t))
  );
}

// REORDER — copy the array first, then swap positions
function moveUp(index) {
  if (index === 0) return;
  setTodos(prev => {
    const copy = [...prev];
    [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
    return copy;
  });
}`,
        },
      ],
    },
    {
      title: { en: "Immer — write mutations, get immutability", np: "Immer", jp: "Immer — ミューテーションを書いてイミュータビリティを得る" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Immer uses a JavaScript <b>Proxy</b> to intercept mutations and convert them to immutable updates automatically. You write code that looks like mutation, but Immer produces a fresh object under the hood.\n\nAnalogy: Immer is like a professional translator who listens to you speaking broken English and delivers perfect formal prose to the audience. You say what you mean naturally; the audience hears what they need.\n\n• Install: `npm install immer`\n• Use `produce(draft => { ... })` — `draft` is a mutable proxy; mutations on it produce a new immutable result\n↳ Particularly valuable when nesting is 3+ levels deep — the spread-at-every-level approach becomes unreadable",
            np: "Immer ले Proxy use गरेर mutation code लाई immutable updates मा convert गर्छ। Deeply nested state को लागि ideal।",
            jp: "Immer は Proxy でミューテーション操作をイミュータブルな更新に変換します。深いネストに最適です。",
          },
        },
        {
          type: "code",
          title: { en: "Immer vs manual spread — same result, less code", np: "Immer vs manual spread", jp: "Immer vs スプレッド比較" },
          code: `import { produce } from "immer";

// Without Immer — 4 lines, easy to get wrong
setForm(prev => ({
  ...prev,
  user: { ...prev.user, name: value },
}));

// With Immer — 1 line, reads like plain assignment
setForm(produce(draft => { draft.user.name = value; }));

// Immer with arrays — no filter/map gymnastics
setTodos(
  produce(draft => {
    const todo = draft.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
  })
);

// Adding to a nested array
setData(
  produce(draft => {
    draft.posts[postId].comments.push({ id: Date.now(), text });
  })
);`,
        },
      ],
    },
    {
      title: { en: "Lazy initialisation & functional updates", np: "Lazy init र functional updates", jp: "遅延初期化と関数型更新" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Two `useState` patterns every developer should know:\n\n<b>Lazy initialisation</b> — pass a function to `useState` instead of a value. React calls the function once (on mount) instead of on every render. Critical when the initial value is expensive to compute.\n• `useState(JSON.parse(localStorage.getItem('cart') ?? '[]'))` — runs on EVERY render (bad)\n• `useState(() => JSON.parse(localStorage.getItem('cart') ?? '[]'))` — runs ONCE (good)\n\n<b>Functional updates</b> — pass a function to the setter instead of a value. The function receives the <b>latest state snapshot</b>, safe from stale closures in async code or rapid successive calls.",
            np: "Lazy init: function pass गर्दा once मात्र run हुन्छ। Functional update: prev state guarantee हुन्छ।",
            jp: "遅延初期化は初回のみ実行。関数型更新は最新の state を確実に受け取ります。",
          },
        },
        {
          type: "code",
          title: { en: "Lazy init + stale closure fix", np: "Lazy init र stale closure fix", jp: "遅延初期化とクロージャのバグ修正" },
          code: `import { useState } from "react";

// ✅ LAZY INIT — parse only once, not on every render
const [cart, setCart] = useState(
  () => JSON.parse(localStorage.getItem("cart") ?? "[]")
);

// --- Stale closure bug with rapid updates ---

function Counter() {
  const [count, setCount] = useState(0);

  // BUG — all three calls read the same stale \`count\` (0)
  // Result: count becomes 1, not 3
  function increment3TimesBuggy() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  // ✅ FIX — each call receives the *latest* count from the queue
  // Result: count correctly becomes 3
  function increment3TimesCorrect() {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment3TimesBuggy}>Buggy +3</button>
      <button onClick={increment3TimesCorrect}>Correct +3</button>
    </div>
  );
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What is a shallow copy and why does it matter?", np: "Shallow copy के हो?", jp: "浅いコピーとは何ですか？" },
      answer: {
        en: "A shallow copy (`{ ...obj }` or `[...arr]`) copies only the top-level properties. Nested objects and arrays still share the same reference as the original. This means mutating a nested property on a shallow copy also mutates the original — the same bug you were trying to avoid. For one level of nesting, spreading is enough. For deeper nesting, spread each level or use Immer.",
        np: "Shallow copy ले top-level मात्र copy गर्छ। Nested objects same reference share गर्छन्। Deep nesting मा Immer use गर्नुस्।",
        jp: "浅いコピーはトップレベルのみコピーします。ネストされた値は元と同じ参照を共有します。",
      },
    },
    {
      question: { en: "Does React use `Object.is` for comparison?", np: "React ले `Object.is` use गर्छ?", jp: "React は `Object.is` で比較しますか？" },
      answer: {
        en: "Yes. React uses `Object.is` to compare previous and next state values. `Object.is` is like `===` but handles two edge cases: `Object.is(NaN, NaN)` returns `true` (unlike `===`), and `Object.is(+0, -0)` returns `false` (unlike `===`). For most practical state comparisons, the key insight is: a new object reference always triggers a re-render, and the same object reference never does — regardless of what changed inside it.",
        np: "हो। `Object.is` same reference = no re-render, new reference = re-render।",
        jp: "はい。React は `Object.is` で比較します。同じ参照 = 再レンダーなし、新しい参照 = 再レンダー。",
      },
    },
    {
      question: { en: "When should I use Immer?", np: "Immer कहिले use गर्ने?", jp: "Immer はいつ使う？" },
      answer: {
        en: "Use Immer when: 1) State has 3+ levels of nesting (spread chains become error-prone). 2) You're updating multiple properties in one operation. 3) You have complex array operations (find + modify + nested array push). 4) Your team finds the spread syntax hard to review. Avoid Immer for simple flat state — `setCount(n => n + 1)` doesn't need Immer. It adds ~8kB to your bundle, so it's a deliberate choice.",
        np: "3+ level nesting, multiple properties update, complex arrays — Immer useful। Simple flat state मा आवश्यक छैन।",
        jp: "3階層以上のネスト、複数プロパティ同時更新、複雑な配列操作に有効。単純な state には不要。",
      },
    },
    {
      question: { en: "Can I store functions in state?", np: "State मा functions store गर्न सकिन्छ?", jp: "state に関数を保存できる？" },
      answer: {
        en: "Yes, but with a gotcha. `useState` treats a function argument as lazy initialisation. If you call `setState(myFunction)`, React calls it immediately and stores the result. To store a function itself in state, wrap it: `setState(() => myFunction)`. In practice, storing functions in state is rare — refs (`useRef`) or callbacks stored in a ref are more common for mutable function references.",
        np: "State मा function store गर्न `setState(() => myFunction)` — direct call गर्दा lazy init मान्छ।",
        jp: "setState に関数を渡すと遅延初期化として実行されます。関数を値として保存するには `() => fn` でラップします。",
      },
    },
    {
      question: { en: "What is the difference between `state` and `ref` for storing values?", np: "State र ref को फरक?", jp: "state と ref の違いは？" },
      answer: {
        en: "Both persist values between renders. The key difference: `useState` triggers a re-render when updated; `useRef` does not. Use state for anything the UI needs to display or react to. Use ref for: values the component needs to remember but that don't affect the rendered output (timer IDs, previous values, DOM node references, animation frame handles). Mutating a ref is intentional — refs are the one place React lets you break the immutability rule.",
        np: "State update = re-render। Ref update = no re-render। UI display गर्नुपर्ने state, internal tracking को लागि ref।",
        jp: "state 更新 = 再レンダー。ref 更新 = 再レンダーなし。表示に必要なら state、内部追跡には ref。",
      },
    },
  ],
};
