import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_10_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "React is already fast out of the box. But as apps grow, unnecessary re-renders can slow things down — especially lists with hundreds of items or components doing expensive calculations on every render.\n\nReact gives you three memoization tools:\n• <b>React.memo</b> — skip re-rendering a component if its props haven't changed\n• <b>useCallback</b> — keep a stable function reference between renders\n• <b>useMemo</b> — cache the result of an expensive calculation\n\nAnalogy: these are like a smart secretary who only interrupts the boss when something actually changed — not for every notification.",
      np: "React.memo, useCallback, useMemo — unnecessary re-render रोक्ने तीनवटा tools।",
      jp: "React.memo・useCallback・useMemo — 不要な再レンダーを防ぐ 3 つのメモ化ツール。",
    },
    {
      en: "The golden rule of optimization: <b>measure first, optimize second</b>. Most apps are already fast enough. Adding `useMemo` and `useCallback` everywhere makes code harder to read without meaningful speed gains.\n\nWe cover:\n• When and why React re-renders\n• React.memo — skipping unchanged child renders\n• useCallback — stable function references for memoized children\n• useMemo — caching expensive computed values\n• The React Profiler — finding actual bottlenecks",
      np: "Measure first। React.memo, useCallback, useMemo, React Profiler cover गर्छौं।",
      jp: "まず計測。React.memo・useCallback・useMemo・Profiler を学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "When does React re-render?",
        np: "React कहिले re-render गर्छ?",
        jp: "React はいつ再レンダーするか？",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React re-renders a component when:\n• <b>Its own state changes</b> — a `useState` or `useReducer` update\n• <b>Its parent re-renders</b> — even if the child's props didn't change\n• <b>A context it consumes changes</b>\n\nThe key insight: a parent re-rendering causes ALL its children to re-render by default. This is usually fine — re-renders are cheap. It only matters when a child is expensive to render (large lists, complex calculations) or when re-rendering breaks correctness (animations, focus).",
            np: "State change, parent re-render, वा consumed context change भएमा re-render हुन्छ।",
            jp: "state 変化・親の再レンダー・消費 Context の変化で再レンダーされます。",
          },
        },
        {
          type: "code",
          title: { en: "The default re-render cascade", np: "Default re-render cascade", jp: "デフォルトの再レンダー連鎖" },
          code: `function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Click {count}</button>
      {/* Child re-renders every time Parent re-renders
          even though message never changes */}
      <Child message="Hello" />
    </div>
  );
}

function Child({ message }: { message: string }) {
  console.log('Child rendered');  // fires on every Parent click
  return <p>{message}</p>;
}

// Use React DevTools > Components > "Highlight updates when components render"
// to visualise this in the browser`,
        },
      ],
    },
    {
      title: {
        en: "React.memo — skip unchanged children",
        np: "React.memo — unchanged children skip गर्नुहोस्",
        jp: "React.memo — 変化のない子をスキップ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`React.memo` wraps a component and tells React: only re-render this component if its props actually changed (using shallow equality comparison). Analogy: memo is like a delivery person who only rings the doorbell if the package is new — not every time they drive past your house.\n\nIMPORTANT gotcha: memo uses <b>shallow equality</b>. If you pass `onClick={() => handleClick(id)}` inline, it creates a <b>new function reference on every render</b>, breaking memo. This is why `useCallback` exists.",
            np: "React.memo ले props change नभएमा re-render skip गर्छ। Inline functions ले memo तोड्छ — useCallback चाहिन्छ।",
            jp: "`React.memo` は props が変化しなければ再レンダーをスキップ。インライン関数は memo を壊すので `useCallback` が必要。",
          },
        },
        {
          type: "code",
          title: { en: "React.memo with useCallback", np: "React.memo + useCallback", jp: "React.memo + useCallback" },
          code: `import { memo, useCallback, useState } from 'react';

// Memoized child — only re-renders if product or onDelete changes
const ProductCard = memo(function ProductCard({
  product,
  onDelete,
}: {
  product: { id: number; name: string };
  onDelete: (id: number) => void;
}) {
  console.log('ProductCard rendered:', product.name);
  return (
    <div>
      <p>{product.name}</p>
      <button onClick={() => onDelete(product.id)}>Delete</button>
    </div>
  );
});

function ProductList({ products }: { products: { id: number; name: string }[] }) {
  const [search, setSearch] = useState('');

  // Without useCallback: new function every render → memo is useless
  // With useCallback: same function reference → memo works
  const handleDelete = useCallback((id: number) => {
    console.log('delete', id);
  }, []); // empty deps — function never needs to change

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />
      {products.map(p => (
        <ProductCard key={p.id} product={p} onDelete={handleDelete} />
      ))}
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "useCallback — stable function references",
        np: "useCallback — stable function reference",
        jp: "useCallback — 安定した関数参照",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useCallback(fn, deps)` returns the <b>same function reference</b> between renders unless one of its dependencies changes. It takes the same dependency array as `useEffect` — list every variable from the outer scope that the function uses.\n\nWhen to use `useCallback`:\n• When passing a callback to a `React.memo` component — otherwise memo is bypassed\n• When a function is itself a dependency of another `useEffect` — to avoid infinite loops\n  ↳ Without `useCallback`, a new function on every render triggers the effect on every render\n\nWhen NOT to use `useCallback`:\n• On every function by default — the memoization itself has a cost\n• On event handlers that aren't passed to memoized children",
            np: "useCallback ले function reference stable राख्छ। memo components र useEffect dependencies को लागि प्रयोग गर्नुहोस्।",
            jp: "`useCallback` は関数参照を安定化。memo コンポーネントや useEffect の依存配列に渡す際に使います。",
          },
        },
        {
          type: "code",
          title: { en: "useCallback preventing infinite useEffect loop", np: "Infinite loop prevention", jp: "無限ループ防止" },
          code: `// BAD: fetchData is a new function every render
// → triggers useEffect every render → fetches every render → infinite loop
function BadComponent({ userId }: { userId: number }) {
  const fetchData = async () => {
    const res = await fetch(\`/api/users/\${userId}\`);
    return res.json();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData changes every render!
}

// GOOD: fetchData is stable — only changes when userId changes
function GoodComponent({ userId }: { userId: number }) {
  const fetchData = useCallback(async () => {
    const res = await fetch(\`/api/users/\${userId}\`);
    return res.json();
  }, [userId]); // only recreate when userId changes

  useEffect(() => {
    fetchData();
  }, [fetchData]); // now stable ✓
}`,
        },
      ],
    },
    {
      title: {
        en: "useMemo — cache expensive computations",
        np: "useMemo — expensive computation cache गर्नुहोस्",
        jp: "useMemo — 高コスト計算のキャッシュ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useMemo(fn, deps)` caches the <b>result</b> of a computation until its dependencies change. The function runs once, stores the result, and returns the cached value on subsequent renders — only recomputing when deps change.\n\nAnalogy: like a pre-computed answer sheet — instead of solving 100 maths problems on every render, you solve them once and reuse the answers until the questions change.\n\nGood use cases for `useMemo`:\n• Sorting or filtering large arrays (1000+ items)\n• Complex derived data (running totals, grouped objects)\n• Expensive regex operations\n\nBad use cases (overhead outweighs benefit):\n• Simple arithmetic (`count * 2`)\n• String concatenation\n• Arrays with < 100 items",
            np: "useMemo ले computation result cache गर्छ। Large arrays sort/filter को लागि उपयोगी।",
            jp: "`useMemo` は計算結果をキャッシュ。大きな配列のソート・フィルタリングに有効です。",
          },
        },
        {
          type: "code",
          title: { en: "useMemo for filtered and sorted list", np: "Filter र sort को useMemo", jp: "フィルター＋ソートの useMemo" },
          code: `import { useMemo, useState } from 'react';

type Product = { id: number; name: string; price: number; category: string };

function ProductList({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');

  // Without useMemo: runs on every render (every keystroke in search)
  // With useMemo: only recomputes when products, search, category, or sortBy changes
  const filteredAndSorted = useMemo(() => {
    return products
      .filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === 'all' || p.category === category)
      )
      .sort((a, b) =>
        sortBy === 'name'
          ? a.name.localeCompare(b.name)
          : a.price - b.price
      );
  }, [products, search, category, sortBy]);

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      <p>Showing {filteredAndSorted.length} products</p>
      {filteredAndSorted.map(p => <div key={p.id}>{p.name} — {p.price}</div>)}
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "The React Profiler — find real bottlenecks",
        np: "React Profiler — real bottleneck खोज्नुहोस्",
        jp: "React Profiler — 実際のボトルネックを見つける",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Never optimize without measuring first. Analogy: optimizing without the Profiler is like taking medicine before knowing your diagnosis — you might make things worse.\n\nThe React DevTools Profiler has two views:\n• <b>Flamegraph</b> — shows which components rendered in a commit, and how long each took\n  ↳ Wide yellow bars = slow components\n• <b>Ranked chart</b> — lists components sorted by render time\n\nHow to use:\n1. Open DevTools → Profiler tab\n2. Click Record\n3. Interact with your app (do the slow thing)\n4. Click Stop\n5. Look for wide bars or components that rendered when they shouldn't have",
            np: "Measure first। Profiler को flamegraph र ranked chart प्रयोग गरेर slow components खोज्नुहोस्।",
            jp: "まず計測。Profiler のフレームグラフとランク表で遅いコンポーネントを特定します。",
          },
        },
        {
          type: "code",
          title: { en: "Profiler API for production monitoring", np: "Profiler API", jp: "Profiler API" },
          code: `import { Profiler } from 'react';

// Wrap any subtree to measure it programmatically
function App() {
  function onRenderCallback(
    id: string,          // "ProductList"
    phase: string,       // "mount" or "update"
    actualDuration: number,   // ms this render took
    baseDuration: number,     // ms without memoization
    startTime: number,
    commitTime: number
  ) {
    // Log or send to analytics
    if (actualDuration > 16) {  // > 1 frame at 60fps
      console.warn(\`Slow render in \${id}: \${actualDuration.toFixed(1)}ms\`);
    }
  }

  return (
    <Profiler id="ProductList" onRender={onRenderCallback}>
      <ProductList products={products} />
    </Profiler>
  );
}`,
        },
        {
          type: "table",
          caption: {
            en: "Optimization tools at a glance",
            np: "Optimization tools summary",
            jp: "最適化ツール早見表",
          },
          headers: [
            { en: "Tool", np: "Tool", jp: "ツール" },
            { en: "What it prevents", np: "के रोक्छ", jp: "防ぐこと" },
            { en: "When to use", np: "कहिले", jp: "使う場面" },
          ],
          rows: [
            [
              { en: "React.memo", np: "React.memo", jp: "React.memo" },
              { en: "Child re-render when parent re-renders", np: "Parent re-render मा child re-render", jp: "親再レンダー時の子の再レンダー" },
              { en: "Expensive components receiving stable props", np: "Expensive components", jp: "重いコンポーネントに安定した props を渡す時" },
            ],
            [
              { en: "useCallback", np: "useCallback", jp: "useCallback" },
              { en: "New function reference on every render", np: "हरेक render मा नयाँ function", jp: "毎レンダーでの新しい関数参照" },
              { en: "Callbacks passed to memo components or useEffect deps", np: "memo component वा useEffect deps", jp: "memo コンポーネントや useEffect 依存配列" },
            ],
            [
              { en: "useMemo", np: "useMemo", jp: "useMemo" },
              { en: "Re-running expensive computation on every render", np: "हरेक render मा expensive computation", jp: "毎レンダーでの高コスト計算" },
              { en: "Filtering/sorting large datasets, complex derivations", np: "Large dataset filter/sort", jp: "大規模データのフィルター・ソート" },
            ],
            [
              { en: "key prop", np: "key prop", jp: "key prop" },
              { en: "Stale state persisting across item changes", np: "Stale state", jp: "アイテム変化時の古い state の残存" },
              { en: "Force-reset a component when identity changes", np: "Identity change मा reset", jp: "アイデンティティ変化時に強制リセット" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Virtualization — rendering only what's on screen",
        np: "Virtualization — screen मा देखिने मात्र render गर्ने",
        jp: "仮想化 — 画面に見える分だけレンダーする",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "None of the tools above fix this problem: rendering a list of 10,000 rows creates 10,000 real DOM nodes, even though a typical screen can only show ~20 of them at once. `React.memo` and `useMemo` make each row cheaper to compute, but they don't reduce how many DOM nodes exist — the browser still has to lay out, paint, and keep 10,000 nodes in memory. Analogy: virtualization is like a paginated phone book instead of a single 10,000-page scroll — you only ever print the page someone is actually reading.\n\n<b>The core idea:</b>\n• Calculate which rows are currently visible in the scroll container, plus a small \"overscan\" buffer (a few extra rows above/below, so fast scrolling doesn't show blank gaps)\n• Render ONLY those rows as real DOM nodes, absolutely positioned at their correct offset\n• Render an invisible \"spacer\" the height of the FULL list, so the scrollbar behaves as if all 10,000 rows exist\n• As the user scrolls, swap which rows are rendered — old rows unmount, new ones mount, but the DOM node count stays roughly constant",
            np: "10,000 rows भएको list ले 10,000 DOM nodes बनाउँछ, स्क्रिनमा ~20 मात्र देखिए पनि। Memoization ले यो घटाउँदैन। Virtualization ले visible rows मात्र render गर्छ, बाँकीलाई spacer ले fake गर्छ।",
            jp: "10,000行のリストは実際には約20行しか画面に見えなくても10,000個のDOMノードを作る。メモ化はこれを減らさない。仮想化は見える行だけをレンダーし、残りはスペーサーで見せかける。",
          },
        },
        {
          type: "code",
          title: { en: "Virtualizing a 10,000-row list with @tanstack/react-virtual", np: "@tanstack/react-virtual उदाहरण", jp: "@tanstack/react-virtual の例" },
          code: `import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

function BigList({ items }: { items: { id: string; name: string }[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,           // 10,000
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,        // estimated row height in px
    overscan: 5,                   // extra rows above/below viewport
  });

  return (
    // The scroll container — fixed height, overflow auto
    <div ref={parentRef} style={{ height: 500, overflow: 'auto' }}>
      {/* Spacer — makes the scrollbar act like all 10,000 rows exist */}
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualRow.size,
              transform: \`translateY(\${virtualRow.start}px)\`, // positions this row
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}

// Only ~20-30 <div> rows exist in the DOM at any time, regardless of
// whether "items" has 100 rows or 1,000,000 rows.`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>`@tanstack/react-virtual` vs the older `react-window`:</b> both solve the same problem. `react-window` is smaller and simpler for fixed-size lists/grids; `@tanstack/react-virtual` (from the TanStack team behind Query) is the more actively maintained modern choice, with better support for dynamic/variable row heights and horizontal + grid virtualization.\n\n<b>When virtualization is NOT worth it:</b>\n• Lists under roughly 100-200 items — the browser handles that many real DOM nodes fine, and virtualization adds real complexity (no native browser find-in-page, trickier accessibility, harder to test)\n• Content with wildly unpredictable heights that are expensive to measure — variable-height virtualization works, but the estimation logic gets fiddly and bugs (overlapping/gapped rows) are easy to introduce",
            np: "`react-window` सानो/fixed-size list को लागि। `@tanstack/react-virtual` बढी actively maintained, variable heights सपोर्ट गर्छ। 100-200 items भन्दा कम भए virtualization चाहिँदैन।",
            jp: "`react-window` は固定サイズの小規模リスト向け。`@tanstack/react-virtual` はより活発にメンテナンスされ可変高さに対応。100〜200件未満なら仮想化は不要。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I wrap every component in React.memo?",
        np: "हरेक component React.memo मा wrap गर्ने?",
        jp: "全コンポーネントを React.memo でラップすべき？",
      },
      answer: {
        en: "No. Memoization has its own overhead — React has to shallow-compare all props on every render. Only use `React.memo` on components that: (1) render frequently, (2) receive the same props most of the time, and (3) are expensive to render. The React DevTools Profiler will show you which components actually need it.",
        np: "होइन। Memoization को आफ्नै overhead छ। Profiler ले देखाएको expensive components मात्र wrap गर्नुहोस्।",
        jp: "不要。メモ化自体にコストがあります。Profiler で遅いと特定したコンポーネントだけに適用してください。",
      },
    },
    {
      question: {
        en: "What is referential equality?",
        np: "Referential equality के हो?",
        jp: "参照等価とは？",
      },
      answer: {
        en: "JavaScript compares objects, arrays, and functions by reference (memory address), not by value. `{a: 1} === {a: 1}` is `false` — they are two different objects in memory. This is why `React.memo` thinks props changed even when the values look the same: a new object literal `{}` creates a new reference on every render.",
        np: "JS ले object/array/function को reference compare गर्छ। `{} === {}` → false। त्यसैले React.memo ले नयाँ object ले prop change भएको ठान्छ।",
        jp: "JS はオブジェクト・配列・関数を参照で比較します。`{} === {}` は `false`。だから `React.memo` は新しいオブジェクトを「変化あり」と判断します。",
      },
    },
    {
      question: {
        en: "Does useMemo run during render?",
        np: "useMemo render को बेला चल्छ?",
        jp: "useMemo はレンダー中に実行される？",
      },
      answer: {
        en: "Yes — unlike `useEffect` (which runs after render), `useMemo` runs during render synchronously. This means you must not put side effects inside `useMemo` (no fetch calls, no DOM mutations, no logging). Use `useMemo` only for pure computations — same inputs always produce the same outputs.",
        np: "हो, render को बेला synchronously। Side effects (fetch, DOM mutation) useMemo भित्र नराख्नुहोस्।",
        jp: "はい、レンダー中に同期実行されます。副作用（fetch・DOM 操作）を `useMemo` に入れてはいけません。",
      },
    },
    {
      question: {
        en: "What is the difference between useMemo and useEffect?",
        np: "useMemo र useEffect मा के फरक?",
        jp: "useMemo と useEffect の違いは？",
      },
      answer: {
        en: "`useMemo` runs during render and returns a cached value — use it to derive data from state/props. `useEffect` runs after render and returns a cleanup function — use it for side effects (fetch, subscriptions, timers). Rule: if you need a value, use `useMemo`. If you need to DO something, use `useEffect`.",
        np: "useMemo = render को बेला, value return गर्छ। useEffect = render पछि, side effect को लागि।",
        jp: "`useMemo` はレンダー中に値を返す。`useEffect` はレンダー後に副作用を実行。値が欲しいなら `useMemo`、何かしたいなら `useEffect`。",
      },
    },
    {
      question: {
        en: "How do I know if optimization is actually needed?",
        np: "Optimization चाहिन्छ भनेर कसरी थाहा पाउने?",
        jp: "最適化が本当に必要かどうかをどう判断する？",
      },
      answer: {
        en: "Measure first with the React DevTools Profiler. Signs you need optimization: (1) Profiler shows a component taking > 16ms to render (slower than 60fps), (2) a component renders 10+ times when the user does one action, (3) the app feels sluggish during a specific interaction. If none of these are true, skip optimization — premature optimization makes code harder to read and maintain.",
        np: "Profiler ले > 16ms render देखाए, वा एउटा action मा 10+ renders देखाए optimize गर्नुहोस्।",
        jp: "Profiler で > 16ms のレンダーや 1 アクションで 10+ 回の再レンダーが見えたら対処。なければ不要です。",
      },
    },
    {
      question: {
        en: "Do I still need React.memo and useMemo if I'm using virtualization?",
        np: "Virtualization प्रयोग गरे पनि React.memo र useMemo चाहिन्छ?",
        jp: "仮想化を使っていても React.memo や useMemo は必要？",
      },
      answer: {
        en: "Yes — they solve different problems. Virtualization reduces <b>how many</b> rows exist in the DOM at once (e.g. rendering 20 out of 10,000). `React.memo`/`useMemo` reduce <b>how expensive</b> each of those rendered rows is to compute. A virtualized row that does a heavy calculation on every scroll-triggered render still benefits from `useMemo`. Use both together for very large, computation-heavy lists.",
        np: "हो, दुबैले फरक समस्या समाधान गर्छन्। Virtualization ले rows को संख्या घटाउँछ, React.memo/useMemo ले हरेक row render गर्न कति खर्चिलो छ त्यो घटाउँछ। धेरै ठूलो, heavy computation भएको list मा दुबै सँगै प्रयोग गर्नुहोस्।",
        jp: "はい、解決する問題が異なります。仮想化はDOM上の行数を減らし、React.memo/useMemoは各行のレンダーコストを減らします。計算量の多い巨大リストでは両方を併用してください。",
      },
    },
  ],
};
