import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_3_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Most UIs are lists — a feed of posts, a grid of products, a history of messages. React renders lists with <b>.map()</b>, which transforms an array of data into an array of JSX elements. Analogy: `.map()` is like a factory stamper — feed it 10 blanks, it stamps 10 cards, one for each item. No manual loops, no DOM manipulation — just describe the shape of one item and React handles the rest.",
      np: "React ले `.map()` बाट list render गर्छ। key prop, conditional rendering, र event handlers — यिनी मिलाएर interactive UI बन्छ।",
      jp: "Reactはリストを`.map()`でレンダーします。keyプロップ、条件付きレンダー、イベントハンドラーが今日のテーマです。",
    },
    {
      en: "Today we cover:\n• <b>Rendering arrays</b> with `.map()` — transforming data into JSX\n• The <b>key prop</b> — why React needs a unique ID on every list item\n• <b>Conditional rendering</b> — three patterns: `&&`, ternary, and early return\n• <b>Event handlers</b> — `onClick`, `onChange`, `onSubmit` and passing arguments",
      np: "`.map()` ले list render, `key` prop, conditional rendering (`&&`, ternary, early return), र event handlers (`onClick`, `onChange`)।",
      jp: "`.map()`によるリスト表示、`key`プロップ、条件付きレンダー、イベントハンドラーを学びます。",
    },
  ],
  sections: [
    {
      title: { en: "Rendering lists with .map()", np: ".map() ले list render", jp: "リストのレンダー" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>.map()</b> is a JavaScript array method that creates a new array by transforming each item. In React, you use it to turn an array of data into an array of JSX elements. Think of it as an assembly line — each raw data item goes in one end, a finished JSX element comes out the other.\n\nThe key things to know:\n• <b>`.map()` must return JSX</b> from its callback — otherwise React renders nothing\n  ↳ The most common mistake: `items.map(i => { i.name })` — missing `return` or the parenthesis shorthand\n• <b>You can embed `.map()` directly in JSX</b> inside curly braces `{}`\n• <b>Real data should be objects</b> with IDs, not plain strings",
            np: "`.map()` ले data array लाई JSX array मा बदल्छ। callback ले JSX return गर्नुपर्छ।",
            jp: "`.map()`でデータ配列をJSX配列に変換します。コールバックはJSXを返す必要があります。",
          },
        },
        {
          type: "code",
          title: { en: "Simple list → object list", np: "सरल list → object list", jp: "シンプルなリスト→オブジェクトリスト" },
          code: `// Simple string array — works but no keys and no real data
const fruits = ['Apple', 'Banana', 'Cherry'];
return <ul>{fruits.map(fruit => <li>{fruit}</li>)}</ul>;

// Real data with objects and IDs
const products = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Phone',  price: 499 },
  { id: 3, name: 'Tablet', price: 299 },
];

return (
  <ul>
    {products.map(product => (
      <li key={product.id}>
        <strong>{product.name}</strong> — $\{product.price}
      </li>
    ))}
  </ul>
);`,
        },
      ],
    },
    {
      title: { en: "The key prop — why React needs it", np: "key prop — React लाई किन चाहिन्छ", jp: "keyプロップの役割" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When React updates a list, it needs to know which items changed, which were added, and which were removed. Without `key`, React has to re-render the entire list from scratch every time. With `key`, React can surgically update just the items that changed.\n\nAnalogy: imagine 10 identical gift boxes — without labels, to find the right one you must open all 10; with unique labels (keys), you grab the right box instantly. Keys are those labels.\n\nRules for good keys:\n• <b>Must be unique among siblings</b> — not globally unique, just within the same `.map()`\n• <b>Must be stable</b> — the same item should always have the same key across renders\n• <b>Never use array index as a key</b> if the list can reorder, filter, or have items added/removed\n  ↳ If you add an item at the top, every index shifts — React thinks everything changed",
            np: "key ले React लाई list update गर्न मद्दत गर्छ। stable, unique ID प्रयोग गर्नुहोस्। index प्रयोग नगर्नुहोस्।",
            jp: "keyはReactがリスト更新を効率化するために必要です。安定したIDを使いましょう。",
          },
        },
        {
          type: "code",
          title: { en: "Bad key vs good key", np: "खराब key बनाम राम्रो key", jp: "悪いkeyと良いkey" },
          code: `// BAD — using array index
// If you add an item to the top, every key shifts => React re-renders everything
todos.map((todo, index) => <li key={index}>{todo.text}</li>)

// BAD — using random value (new key on every render)
todos.map(todo => <li key={Math.random()}>{todo.text}</li>)

// GOOD — using the item's stable, unique ID
todos.map(todo => <li key={todo.id}>{todo.text}</li>)

// GOOD — if no ID, combine fields that together are unique
posts.map(post => (
  <li key={post.userId + '-' + post.date}>{post.title}</li>
))`,
        },
      ],
    },
    {
      title: { en: "Conditional rendering — three patterns", np: "Conditional rendering — तीन ढाँचा", jp: "条件付きレンダーの3パターン" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React has no special `if` syntax in JSX — you use plain JavaScript. Three patterns cover 95% of cases:\n\n• <b>`&&` operator</b> — show something when a condition is true, show nothing otherwise\n  ↳ `{isLoggedIn && <Dashboard />}` — renders nothing when `isLoggedIn` is false\n  ↳ Warning: `{count && <span>{count}</span>}` renders the number `0` when count is 0! Use `{count > 0 && ...}` instead\n• <b>Ternary `? :`</b> — show one of two options\n  ↳ `{isLoading ? <Spinner /> : <Content data={data} />}` — either/or\n• <b>Early return</b> — return early if a guard condition is met\n  ↳ Best for: error states, auth guards, loading states at the top of a component",
            np: "`&&` (show/hide), ternary (either/or), early return (guard) — तीन conditional rendering ढाँचा।",
            jp: "`&&`（表示/非表示）、三項演算子（どちらか）、早期リターン（ガード）の3パターン。",
          },
        },
        {
          type: "code",
          title: { en: "All three patterns in action", np: "तीनै ढाँचा", jp: "3パターンのコード例" },
          code: `function UserProfile({ user, isLoading, error }) {
  // Pattern 3: Early return — guards at the top
  if (error)     return <div className="error">Error: {error.message}</div>;
  if (isLoading) return <div className="spinner">Loading...</div>;
  if (!user)     return null; // render nothing

  return (
    <div>
      <h1>{user.name}</h1>

      {/* Pattern 1: && — show badge only if admin */}
      {user.isAdmin && <span className="badge">Admin</span>}

      {/* Pattern 2: ternary — show follow or unfollow */}
      <button>{user.isFollowing ? 'Unfollow' : 'Follow'}</button>

      {/* Pattern 1 with count fix */}
      {user.posts.length > 0 && <p>{user.posts.length} posts</p>}
    </div>
  );
}`,
        },
      ],
    },
    {
      title: { en: "Event handlers", np: "Event handlers", jp: "イベントハンドラー" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Event handlers are functions that run when a user interacts with the UI. Analogy: event handlers are like customer service reps — they wait patiently until a specific thing happens (a button click, a keystroke, a form submit), then spring into action.\n\nKey rules:\n• <b>Pass the function reference, not a call</b> — `onClick={handleClick}` not `onClick={handleClick()}`\n  ↳ `onClick={handleClick()}` runs immediately when the component renders, not on click\n• <b>To pass arguments, wrap in an arrow function</b> — `onClick={() => handleDelete(item.id)}`\n• <b>Prevent default for forms</b> — `e.preventDefault()` stops the page from reloading on submit\n• <b>Synthetic events</b> — React wraps native DOM events in a consistent `SyntheticEvent` object that works the same in all browsers",
            np: "Event handler = user interaction मा run हुने function। reference pass गर्नुहोस् (`handleClick`), call होइन (`handleClick()`)।",
            jp: "イベントハンドラーはユーザー操作で実行される関数。参照を渡し、呼び出さないこと。",
          },
        },
        {
          type: "code",
          title: { en: "onClick, onChange, onSubmit", np: "onClick, onChange, onSubmit", jp: "主要イベントの例" },
          code: `import { useState } from 'react';

function EventDemo() {
  const [text, setText] = useState('');
  const [items, setItems] = useState(['Apple', 'Banana']);

  // onClick — handle button click
  const handleAdd = () => {
    if (text.trim()) {
      setItems(prev => [...prev, text]);
      setText('');
    }
  };

  // onClick with argument — delete specific item
  const handleDelete = (itemToRemove) => {
    setItems(prev => prev.filter(item => item !== itemToRemove));
  };

  // onSubmit — handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // stop page reload
    handleAdd();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* onChange — sync input value to state */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add item..."
      />
      <button type="submit">Add</button>
      <ul>
        {items.map(item => (
          <li key={item}>
            {item}
            {/* Arrow function to pass argument */}
            <button type="button" onClick={() => handleDelete(item)}>x</button>
          </li>
        ))}
      </ul>
    </form>
  );
}`,
        },
      ],
    },
    {
      title: { en: "Putting it together — a filterable list", np: "सब मिलाएर — filterable list", jp: "まとめ — フィルタリスト" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Let's combine `.map()`, `key`, conditional rendering, and event handlers into one complete component — a searchable product list. This pattern appears in almost every real app: search bars, filter dropdowns, data tables. The flow is always the same: hold data in state → filter based on user input → render filtered results with `.map()` → show empty state when nothing matches.",
            np: "`.map()`, `key`, conditional rendering, र event handlers मिलाएर searchable product list — real app मा common pattern।",
            jp: "`.map()`、`key`、条件付きレンダー、イベントハンドラーを組み合わせた検索リスト。実際のアプリでよく見るパターンです。",
          },
        },
        {
          type: "code",
          title: { en: "Filterable product list", np: "Filterable product list", jp: "フィルタリング商品リスト" },
          code: `import { useState } from 'react';

const ALL_PRODUCTS = [
  { id: 1, name: 'Laptop',  category: 'Electronics', price: 999 },
  { id: 2, name: 'T-Shirt', category: 'Clothing',    price: 29  },
  { id: 3, name: 'Phone',   category: 'Electronics', price: 699 },
  { id: 4, name: 'Jeans',   category: 'Clothing',    price: 59  },
];

export function ProductList() {
  const [search, setSearch] = useState('');

  const filtered = ALL_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search products..."
      />

      {filtered.length === 0 ? (
        <p>No products match "{search}"</p>
      ) : (
        <p>{filtered.length} product(s) found</p>
      )}

      <ul>
        {filtered.map(product => (
          <li key={product.id}>
            <strong>{product.name}</strong>
            <span> ({product.category})</span>
            <span> — $\{product.price}</span>
          </li>
        ))}
      </ul>
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
        en: "Why does React warn about missing keys?",
        np: "React ले missing keys को बारे warning किन दिन्छ?",
        jp: "keyがないとなぜ警告が出るの？",
      },
      answer: {
        en: "Without keys, React cannot track which list items changed between renders. It compares items by position — so adding an item at the top means React thinks every item changed and re-renders the whole list. Keys let React match old and new items by identity, making updates faster and preventing bugs like input focus being lost when an item updates.",
        np: "key बिना React items position बाट compare गर्छ — bugs आउन सक्छ। key ले React लाई items identity बाट track गर्न दिन्छ।",
        jp: "keyなしでは位置で比較するため、先頭追加で全再レンダーになります。keyで同一性を追跡できます。",
      },
    },
    {
      question: {
        en: "Can I use array index as key?",
        np: "Array index key को रूपमा प्रयोग गर्न मिल्छ?",
        jp: "配列インデックスをkeyにしていい？",
      },
      answer: {
        en: "Only if the list is static and will never be reordered, filtered, or have items added/removed. In practice most lists change — use a stable unique ID. The index-as-key bug is subtle: deleting item at index 2 makes item 3 become index 2, and React reuses the old component instance — potentially showing stale state like text that was typed in an input field.",
        np: "Static list मात्रामा ठीक। List change हुन्छ भने stable ID प्रयोग गर्नुहोस्।",
        jp: "静的リストのみOK。変化するリストには安定したIDを使いましょう。",
      },
    },
    {
      question: {
        en: "What is the difference between `&&` and ternary for conditional rendering?",
        np: "Conditional rendering मा `&&` र ternary को फरक के हो?",
        jp: "`&&`と三項演算子の違いは？",
      },
      answer: {
        en: "`&&` renders something or nothing (show/hide). Ternary renders one of two things (either/or). Use `&&` when you have nothing to show for the false case. Use ternary when you need to swap between two components. Watch the `0` trap: `{count && <span />}` renders the number `0` when count is 0 — use `{count > 0 && <span />}` to be safe.",
        np: "`&&` = show/hide। Ternary = either/or। `0 && ...` ले `0` render गर्छ — `count > 0 && ...` प्रयोग गर्नुहोस्।",
        jp: "`&&`は表示/非表示、三項演算子はどちらか。`0 &&`は`0`を表示するので注意。",
      },
    },
    {
      question: {
        en: "Why wrap event handlers in arrow functions when passing arguments?",
        np: "Argument pass गर्दा event handlers लाई arrow function मा किन wrap गर्ने?",
        jp: "引数渡しで矢印関数でラップするのはなぜ？",
      },
      answer: {
        en: "`onClick={handleDelete(item.id)}` calls the function immediately during render — you would see it run before any click happens. You need to give React a function to call later: `onClick={() => handleDelete(item.id)}`. The arrow function is a new function that, when React calls it on click, then calls `handleDelete(item.id)` with the right argument.",
        np: "`handleDelete(item.id)` = render time मा call। `() => handleDelete(item.id)` = click time मा call। React लाई function reference चाहिन्छ।",
        jp: "`onClick={fn()}`はレンダー時に即実行されます。`onClick={() => fn()}`でクリック時に実行させましょう。",
      },
    },
    {
      question: {
        en: "What is event bubbling and how do I stop it?",
        np: "Event bubbling के हो र कसरी रोक्ने?",
        jp: "イベントバブリングとは？止めるには？",
      },
      answer: {
        en: "When you click a button inside a div, the click event fires on the button AND bubbles up to the div — both handlers run. Call `e.stopPropagation()` inside a handler to stop the event from bubbling. A common case: a clickable card that contains a delete button — without `stopPropagation`, clicking delete also triggers the card's own click handler.",
        np: "Event click button → parent div तक बुलबुले गर्छ। `e.stopPropagation()` ले रोक्छ।",
        jp: "クリックは子から親へバブルします。`e.stopPropagation()`で止められます。",
      },
    },
  ],
};
