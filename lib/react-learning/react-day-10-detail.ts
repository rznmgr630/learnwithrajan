import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 10 — Performance Optimization: React.memo, useCallback, useMemo, useRef, Profiler, and when NOT to optimize. */
export const REACT_DAY_10_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 10 is about making React fast — but more importantly, about measuring before touching anything. You learn `React.memo` to skip unnecessary re-renders, `useCallback` to stabilise function references, `useMemo` to cache expensive derivations, and `useRef` for DOM access and mutable values that must not trigger renders. The day ends with the React DevTools Profiler and a frank look at when optimisation makes things worse, not better.",
      np: "दिन १० React तीव्र बनाउने — तर सबभन्दा महत्त्वपूर्ण, केही छुनु अघि मापन गर्ने। `React.memo` अनावश्यक re-renders skip, `useCallback` function references stable, `useMemo` महँगो derivations cache, `useRef` DOM access र mutable values render trigger नगरी। दिनको अन्त्यमा React DevTools Profiler र optimisation कहिले खराब बनाउँछ भन्ने सोझो विश्लेषण।",
      jp: "10日目は React を速くすること、そして何より何かに触れる前に計測することについてです。不要な再レンダーをスキップする `React.memo`、関数参照を安定させる `useCallback`、高コストな計算をキャッシュする `useMemo`、レンダーを発生させない DOM アクセスとミュータブル値のための `useRef` を学びます。最後に React DevTools プロファイラーと、最適化が悪化させる場合の率直な考察で締めくくります。",
    },
    {
      en: "The golden rule: **measure first, optimise second**. Wrapping everything in `memo` and `useCallback` without profiling adds cognitive overhead and can actually introduce new bugs (stale closures, missed dependency arrays) with no measurable speed gain.",
      np: "सुनौलो नियम: **पहिले मापन, पछि optimise**। Profiling बिना सबथोक `memo` र `useCallback` मा wrap गर्दा cognitive overhead थप्छ र measurable speed gain बिना नयाँ bugs (stale closures, missed dependency arrays) introduce गर्न सक्छ।",
      jp: "黄金律: **まず計測、次に最適化**。プロファイリングなしに全てを `memo` と `useCallback` で包むことは、認知的なオーバーヘッドを加え、計測可能なパフォーマンス向上なしに新しいバグ（古いクロージャー、見逃した依存配列）を引き起こす可能性があります。",
    },
  ],
  sections: [
    {
      title: {
        en: "Introduction — Measure Before You Optimise",
        np: "परिचय — Optimise गर्नु अघि मापन गर्नुस",
        jp: "イントロ — 最適化の前に計測する",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React's default reconciler is already fast for most apps. A component re-rendering is not inherently a problem — it is a problem only when it causes a frame drop or perceptible lag. The React DevTools Profiler flame graph shows you exactly which components render, how long they take, and why. Until you see a concrete problem there, write clear code first.",
            np: "React को default reconciler अधिकांश apps मा पहिल्यै तीव्र। Component re-rendering inherently problem होइन — यो problem तब हो जब frame drop वा perceptible lag गराउँछ। React DevTools Profiler flame graph ले कुन components render हुन्छन्, कति लिन्छन्, र किन — ठ्याक्कै देखाउँछ। त्यहाँ concrete problem नदेखेसम्म, clear code पहिले।",
            jp: "React のデフォルトの調整器はほとんどのアプリに対して既に十分に速いです。コンポーネントの再レンダーそのものは問題ではありません。フレームドロップや知覚可能な遅延を引き起こす場合のみ問題です。React DevTools プロファイラーのフレームグラフは、どのコンポーネントがレンダーし、どのくらいかかるか、そしてなぜかを正確に示します。そこで具体的な問題が見えるまで、まず明確なコードを書きましょう。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Open DevTools → Profiler tab → record an interaction → look for bars that are surprisingly wide (long render time) or unusually frequent.",
              np: "DevTools → Profiler tab → interaction record → आश्चर्यजनक रूपमा चौडा (लामो render time) वा असामान्य रूपमा frequent bars खोज्नुस।",
              jp: "DevTools → Profiler タブ → インタラクションを記録 → 異常に広い（レンダー時間が長い）または異常に頻繁なバーを探す。",
            },
            {
              en: "The browser Performance tab (Lighthouse / CPU throttle) tells you about the real-world impact; React Profiler tells you about the React tree specifically.",
              np: "Browser Performance tab (Lighthouse / CPU throttle) ले real-world impact; React Profiler ले React tree specifically।",
              jp: "ブラウザの Performance タブ（Lighthouse / CPU スロットル）は実世界の影響を、React プロファイラーは React ツリーに特化した情報を教えてくれます。",
            },
            {
              en: "A component that re-renders in 0.5 ms is never your bottleneck — leave it alone.",
              np: "0.5 ms मा re-render हुने component कहिल्यै bottleneck होइन — त्यसलाई छोड्नुस।",
              jp: "0.5 ms で再レンダーするコンポーネントはボトルネックになりません — そのままにしておきましょう。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "React.memo — Skipping Re-Renders When Props Have Not Changed",
        np: "React.memo — Props नबदलिएमा Re-Renders Skip",
        jp: "React.memo — props が変わっていないときの再レンダーをスキップ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`React.memo(Component)` wraps a component so React skips re-rendering it if the **props haven't changed** since the last render. The comparison is **shallow**: primitives compared by value, objects/arrays/functions compared by reference. This means a parent that passes a new object literal or arrow function on every render will still cause the memoized child to re-render.",
            np: "`React.memo(Component)` component wrap गर्छ ताकि React ले अन्तिम render देखि **props नबदलिएमा** re-render skip गर्छ। तुलना **shallow**: primitives value अनुसार, objects/arrays/functions reference अनुसार। यसले मतलब हर render मा नयाँ object literal वा arrow function pass गर्ने parent ले memoized child लाई अझै पनि re-render गराउँछ।",
            jp: "`React.memo(Component)` はコンポーネントをラップし、最後のレンダー以降**props が変わっていない**場合に React が再レンダーをスキップします。比較は**浅い**: プリミティブは値で、オブジェクト/配列/関数は参照で比較します。これはレンダーごとに新しいオブジェクトリテラルやアロー関数を渡す親が、メモ化された子を依然として再レンダーさせることを意味します。",
          },
        },
        {
          type: "code",
          title: {
            en: "React.memo — WITHOUT vs WITH memo",
            np: "React.memo — memo बिना vs सहित",
            jp: "React.memo — memo なし vs あり",
          },
          code: `// ProductCard.tsx

// ❌ WITHOUT memo — re-renders every time the parent re-renders,
//    even when product hasn't changed
function ProductCard({ product }: { product: Product }) {
  console.log("ProductCard rendered:", product.id);
  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>\${product.price}</p>
    </div>
  );
}

// ✅ WITH memo — React compares product by reference before re-rendering.
//    If the parent passes the same product object, the render is skipped.
const ProductCard = React.memo(function ProductCard({
  product,
}: {
  product: Product;
}) {
  console.log("ProductCard rendered:", product.id);
  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>\${product.price}</p>
    </div>
  );
});

// Parent component
function ProductList({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState("");
  // When filter changes, ProductList re-renders.
  // Without memo: every ProductCard re-renders too (wasteful for 100+ items).
  // With memo: only cards whose product reference changed re-render.
  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "You can pass a custom comparator as the second argument to `React.memo` for deep or field-specific equality: `React.memo(Component, (prev, next) => prev.id === next.id)`. Use sparingly — the comparator itself runs on every render and deep comparison can be slower than just re-rendering.",
            np: "Deep वा field-specific equality का लागि `React.memo` को दोस्रो argument मा custom comparator pass गर्न सकिन्छ: `React.memo(Component, (prev, next) => prev.id === next.id)`। कम प्रयोग — comparator आफैं हर render मा run र deep comparison फेरि render भन्दा ढिलो हुन सक्छ।",
            jp: "深いまたはフィールド固有の等価性のために `React.memo` の第二引数としてカスタムコンパレータを渡せます: `React.memo(Component, (prev, next) => prev.id === next.id)`。慎重に使いましょう。コンパレータ自体が毎レンダーで実行され、深い比較は再レンダーより遅くなることがあります。",
          },
        },
      ],
    },
    {
      title: {
        en: "useCallback — Stabilising Function References",
        np: "useCallback — Function References Stable राख्दै",
        jp: "useCallback — 関数参照の安定化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useCallback(fn, deps)` returns a memoized version of `fn` that only changes when the dependency array changes. Its **sole purpose** is to preserve reference equality for functions passed to memoized children or listed in `useEffect` / `useImperativeHandle` deps. Without memoized children or effect deps, `useCallback` is wasted overhead.",
            np: "`useCallback(fn, deps)` ले `fn` को memoized version फर्काउँछ जुन dependency array परिवर्तन हुँदा मात्र बदलिन्छ। यसको **एकमात्र उद्देश्य** memoized children वा `useEffect` / `useImperativeHandle` deps मा listed functions को reference equality preserve गर्नु। Memoized children वा effect deps बिना, `useCallback` wasteful overhead।",
            jp: "`useCallback(fn, deps)` は依存配列が変わったときのみ変化する `fn` のメモ化バージョンを返します。その**唯一の目的**は、メモ化された子コンポーネントに渡す、または `useEffect` / `useImperativeHandle` の依存配列に列挙する関数の参照等価性を保つことです。メモ化された子や effect の依存配列がなければ、`useCallback` は無駄なオーバーヘッドです。",
          },
        },
        {
          type: "code",
          title: {
            en: "useCallback — stabilising a handler passed to a memo'd list",
            np: "useCallback — memo'd list मा pass गरिएको handler stable राख्दै",
            jp: "useCallback — memo 化されたリストに渡すハンドラーの安定化",
          },
          code: `// SelectableList.tsx — memoized child
const SelectableList = React.memo(function SelectableList({
  items,
  onSelect,
}: {
  items: Item[];
  onSelect: (id: string) => void;
}) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} onClick={() => onSelect(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});

// Parent component
function Dashboard({ items }: { items: Item[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ❌ WITHOUT useCallback — new function reference on every render,
  //    defeats React.memo on SelectableList
  const handleSelectBad = (id: string) => setSelectedId(id);

  // ✅ WITH useCallback — stable reference; SelectableList only re-renders
  //    when items change, not on every parent state update
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []); // setSelectedId is stable, so deps are empty

  return (
    <div>
      <p>Selected: {selectedId ?? "none"}</p>
      <SelectableList items={items} onSelect={handleSelect} />
    </div>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "Common mistake: wrapping every function in `useCallback` 'just in case'. If the receiving component is not wrapped in `memo`, the function reference stability is irrelevant — the child re-renders because the parent re-rendered, not because of the prop reference. `useCallback` only buys you something when the receiver bails out based on props.",
            np: "Common mistake: 'just in case' भनेर हर function लाई `useCallback` मा wrap। Receiving component `memo` मा wrap छैन भने, function reference stability irrelevant — child parent re-render हुनाले re-render हुन्छ, prop reference को कारण होइन। `useCallback` ले तब मात्र फाइदा दिन्छ जब receiver props को आधारमा bail out गर्छ।",
            jp: "よくある間違い: 「念のため」ですべての関数を `useCallback` で包む。受け取るコンポーネントが `memo` で包まれていなければ、関数参照の安定性は無関係です。子は props の参照ではなく親の再レンダーによって再レンダーされます。`useCallback` は受け手が props に基づいてスキップする場合のみ効果があります。",
          },
        },
      ],
    },
    {
      title: {
        en: "useMemo — Memoising Expensive Derived Values",
        np: "useMemo — महँगो Derived Values Memoising",
        jp: "useMemo — 高コストな派生値のメモ化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useMemo(fn, deps)` caches the return value of `fn` and only recomputes when deps change. Use it when a pure computation (filtering, sorting, mapping) is genuinely expensive — measurably more than the overhead of the memo bookkeeping itself. It does **not** prevent re-renders; it only prevents re-running a computation inside a render.",
            np: "`useMemo(fn, deps)` ले `fn` को return value cache गर्छ र deps बदल्दा मात्र recompute। Pure computation (filtering, sorting, mapping) genuinely expensive हुँदा प्रयोग — memo bookkeeping overhead भन्दा measurably बढी। यसले re-renders **prevent गर्दैन**; render भित्र computation re-run मात्र prevent।",
            jp: "`useMemo(fn, deps)` は `fn` の戻り値をキャッシュし、依存が変わったときのみ再計算します。純粋な計算（フィルタリング・ソート・マッピング）が本当にコスト高な場合、つまりメモ帳簿のオーバーヘッド自体より計測可能に重い場合に使います。再レンダーを**防ぎません**。レンダー内での計算の再実行を防ぐだけです。",
          },
        },
        {
          type: "code",
          title: {
            en: "useMemo — filtered and sorted list computation",
            np: "useMemo — filtered र sorted list computation",
            jp: "useMemo — フィルタリングとソートのリスト計算",
          },
          code: `function ProductCatalog({
  products,
}: {
  products: Product[];
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "price">("name");

  // ❌ WITHOUT useMemo — re-computed on every render, including when
  //    an unrelated piece of state (e.g. a modal toggle) changes
  const filteredBad = products
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));

  // ✅ WITH useMemo — only re-computed when products, query, or sortKey change
  const filtered = useMemo(
    () =>
      products
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1)),
    [products, query, sortKey]
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <select
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value as "name" | "price")}
      >
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>
      <ul>
        {filtered.map((p) => (
          <li key={p.id}>
            {p.name} — \${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "Rule of thumb: start without `useMemo`. If profiling shows the computation is a hot-path (> 1ms consistently), add it. Simple array operations on small lists (< 200 items) are almost never the bottleneck — the DOM work typically takes far longer than the JS derivation.",
            np: "Rule of thumb: `useMemo` बिना सुरु। Profiling ले computation hot-path (consistently > 1ms) देखाए थप्नु। सानो lists (< 200 items) मा simple array operations प्रायः कहिल्यै bottleneck होइनन् — DOM work सामान्यतया JS derivation भन्दा धेरै लामो।",
            jp: "経験則: `useMemo` なしで始める。プロファイリングで計算がホットパス（一貫して > 1ms）であることが示されたら追加します。小さなリスト（< 200 アイテム）の単純な配列操作はほぼボトルネックになりません。DOM の作業は通常 JS の計算より遥かに時間がかかります。",
          },
        },
      ],
    },
    {
      title: {
        en: "useRef — DOM Access, Mutable Values, and the Latest-Callback Pattern",
        np: "useRef — DOM Access, Mutable Values, र Latest-Callback Pattern",
        jp: "useRef — DOM アクセス・ミュータブル値・最新コールバックパターン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useRef(initialValue)` returns a mutable ref object `{ current: T }` that persists for the full lifetime of the component. Unlike `useState`, mutating `.current` does **not** schedule a re-render — which is the point. Three distinct use cases: (1) imperative DOM access (focus, scroll, canvas), (2) storing a mutable value that must survive re-renders without causing them (interval IDs, previous values), and (3) the 'latest-callback' pattern to avoid stale closures in long-lived effects.",
            np: "`useRef(initialValue)` ले mutable ref object `{ current: T }` फर्काउँछ जुन component को पूर्ण lifetime मा persist हुन्छ। `useState` भन्दा फरक, `.current` mutate गर्दा re-render **schedule हुँदैन** — यही बिन्दु। तीन distinct use cases: (1) imperative DOM access (focus, scroll, canvas), (2) re-renders survive गर्ने तर trigger नगर्ने mutable value store (interval IDs, previous values), (3) long-lived effects मा stale closures बच्न 'latest-callback' pattern।",
            jp: "`useRef(initialValue)` はコンポーネントのライフタイム全体で持続するミュータブルな ref オブジェクト `{ current: T }` を返します。`useState` と異なり、`.current` のミューテーションは再レンダーを**スケジュールしません**。それが要点です。三つの別々のユースケース: (1) 命令的な DOM アクセス（フォーカス・スクロール・キャンバス）、(2) 再レンダーを生き延びながらも引き起こさないミュータブル値の保存（インターバル ID・前の値）、(3) 長命な effect でのスタールクロージャを避ける「最新コールバック」パターン。",
          },
        },
        {
          type: "code",
          title: {
            en: "useRef — focus management after modal opens",
            np: "useRef — modal open भएपछि focus management",
            jp: "useRef — モーダルが開いた後のフォーカス管理",
          },
          code: `// Use case 1: DOM access — focus the first input when a modal opens
function SearchModal({ isOpen }: { isOpen: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // After the DOM updates and the modal is visible, move focus
      inputRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <dialog open>
      <input ref={inputRef} type="search" placeholder="Search..." />
    </dialog>
  );
}`,
        },
        {
          type: "code",
          title: {
            en: "useRef — storing interval ID and a previous value",
            np: "useRef — interval ID र previous value store",
            jp: "useRef — インターバル ID と前の値の保存",
          },
          code: `// Use case 2: mutable value without re-render
function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (intervalRef.current !== null) return; // already running
    intervalRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current === null) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null; // mutation — no re-render needed
  };

  useEffect(() => () => stop(), []); // cleanup on unmount

  return (
    <div>
      <p>{elapsed}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}

// Use case 3: latest-callback pattern — avoid stale closure in setInterval
function LiveSearch({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");
  // Store the latest onSearch in a ref so the effect below never goes stale
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }); // no deps — update on every render, but never causes effect re-run

  useEffect(() => {
    const id = setInterval(() => {
      onSearchRef.current(query); // always calls the latest version
    }, 500);
    return () => clearInterval(id);
  }, [query]); // safe: query is the only real dependency

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}`,
        },
      ],
    },
    {
      title: {
        en: "React Profiler — Finding Render Hot-Spots",
        np: "React Profiler — Render Hot-Spots खोज्दै",
        jp: "React プロファイラー — レンダーのホットスポットを見つける",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The React DevTools Profiler (browser extension) records renders during an interaction and shows a flame graph. Each bar is a component; width represents render time; colour indicates how 'hot' it is. Click any bar to see **why it rendered** (which prop or state changed). The 'Ranked' view sorts by self-time to immediately surface the biggest offenders.",
            np: "React DevTools Profiler (browser extension) ले interaction को दौरान renders record गर्छ र flame graph देखाउँछ। हर bar component हो; width render time; colour 'hot' कति। कुनै bar click गर्दा **किन render भयो** (कुन prop वा state बदलियो) देखिन्छ। 'Ranked' view ले self-time अनुसार sort गरेर सबभन्दा ठूला offenders तुरुन्त देखाउँछ।",
            jp: "React DevTools プロファイラー（ブラウザ拡張機能）はインタラクション中のレンダーを記録し、フレームグラフを表示します。各バーはコンポーネント、幅はレンダー時間、色は「熱さ」を示します。バーをクリックすると**なぜレンダーしたか**（どの prop や状態が変わったか）が分かります。'Ranked' ビューは自己時間でソートし、最大の問題を即座に表面化させます。",
          },
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Install React DevTools (Chrome/Firefox extension).",
              np: "React DevTools install (Chrome/Firefox extension)।",
              jp: "React DevTools をインストール（Chrome/Firefox 拡張機能）。",
            },
            {
              en: "Open DevTools → Profiler tab → click the record button (●).",
              np: "DevTools → Profiler tab → record button (●) click।",
              jp: "DevTools → Profiler タブ → レコードボタン（●）をクリック。",
            },
            {
              en: "Perform the slow interaction in your app (scroll, type, click).",
              np: "App मा ढिलो interaction perform (scroll, type, click)।",
              jp: "アプリで遅いインタラクション（スクロール・入力・クリック）を実行。",
            },
            {
              en: "Stop recording and inspect the flame graph. Look for wide bars or bars you did not expect to be there.",
              np: "Recording रोक्नुस र flame graph inspect। चौडा bars वा नहुनु पर्ने bars खोज्नुस।",
              jp: "記録を停止してフレームグラフを検査。幅広いバーや存在しないはずのバーを探す。",
            },
            {
              en: "Click a bar → 'Why did this render?' shows the changed props/state/context.",
              np: "Bar click → 'Why did this render?' ले changed props/state/context देखाउँछ।",
              jp: "バーをクリック → 'Why did this render?' で変わった props/state/context が分かる。",
            },
            {
              en: "Switch to 'Ranked' chart for a sorted view of self-render times.",
              np: "'Ranked' chart मा switch — self-render times sorted view।",
              jp: "'Ranked' チャートに切り替えて自己レンダー時間のソートビューを確認。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Common Pitfalls — Over-Memoising and Defeating Memo",
        np: "Common Pitfalls — Over-Memoising र Memo लाई हराउने",
        jp: "よくある落とし穴 — 過度なメモ化と memo の無効化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Memoisation can be defeated silently, giving you the cost of the machinery without the benefit. The most common culprits that cause a memoized component to re-render despite `React.memo`:",
            np: "Memoisation silently defeat हुन सक्छ, machinery को cost दिन्छ benefit बिना। `React.memo` को बावजुद memoized component re-render गर्ने सबभन्दा common culprits:",
            jp: "メモ化は機構のコストはかかるのに恩恵なしで、サイレントに無効化されることがあります。`React.memo` にもかかわらずメモ化されたコンポーネントを再レンダーさせる最も一般的な原因:",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Inline object props**: `<Comp style={{ color: 'red' }} />` — new object every render. Fix: hoist to a constant or `useMemo`.",
              np: "**Inline object props**: `<Comp style={{ color: 'red' }} />` — हर render मा नयाँ object। Fix: constant वा `useMemo` मा hoist।",
              jp: "**インラインオブジェクト props**: `<Comp style={{ color: 'red' }} />` — レンダーごとに新しいオブジェクト。修正: 定数に持ち上げるか `useMemo` を使う。",
            },
            {
              en: "**Inline array props**: `<Comp items={[a, b, c]} />` — new array every render. Fix: `useMemo`.",
              np: "**Inline array props**: `<Comp items={[a, b, c]} />` — हर render मा नयाँ array। Fix: `useMemo`।",
              jp: "**インライン配列 props**: `<Comp items={[a, b, c]} />` — レンダーごとに新しい配列。修正: `useMemo`。",
            },
            {
              en: "**Inline function props**: `<Comp onClick={() => doSomething()} />` — new function every render. Fix: `useCallback`.",
              np: "**Inline function props**: `<Comp onClick={() => doSomething()} />` — हर render मा नयाँ function। Fix: `useCallback`।",
              jp: "**インライン関数 props**: `<Comp onClick={() => doSomething()} />` — レンダーごとに新しい関数。修正: `useCallback`。",
            },
            {
              en: "**Unstable key props**: changing a component's `key` unmounts and remounts it (never memoized). Use stable IDs from data, not array indices for dynamic lists.",
              np: "**Unstable key props**: component को `key` बदल्दा unmount र remount (कहिल्यै memoized होइन)। Dynamic lists मा array indices होइन, data बाट stable IDs।",
              jp: "**不安定な key props**: コンポーネントの `key` を変えると アンマウントして再マウント（メモ化されない）。動的リストには配列インデックスではなくデータからの安定した ID を使う。",
            },
            {
              en: "**Context value instability**: a provider that creates `value={{...}}` inline defeats every consumer — wrap the value in `useMemo`.",
              np: "**Context value instability**: `value={{...}}` inline provider ले हर consumer defeat गर्छ — `useMemo` मा value wrap।",
              jp: "**コンテキスト値の不安定性**: `value={{...}}` インラインのプロバイダはすべてのコンシューマーを無効化します — 値を `useMemo` で包む。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "When NOT to Optimise — Premature Optimisation",
        np: "Optimise कहिले नगर्ने — Premature Optimisation",
        jp: "最適化しない場面 — 早すぎる最適化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Donald Knuth's quote applies directly: 'Premature optimisation is the root of all evil'. In React terms: wrapping components in `memo` before measuring adds complexity, risks stale bugs, and makes code harder to read — with no measurable gain. Components that render in less than a few milliseconds do not need optimisation.",
            np: "Donald Knuth को quote सिधै लागू: 'Premature optimisation is the root of all evil'। React terms मा: measuring अघि components `memo` मा wrap गर्दा complexity थप, stale bugs को जोखिम, code पढ्न गाह्रो — measurable gain बिना। कुछ milliseconds भन्दा कम render हुने components लाई optimisation चाहिँदैन।",
            jp: "Donald Knuth の言葉がそのまま当てはまります: 「早すぎる最適化はすべての悪の根源」。React の文脈では: 計測前にコンポーネントを `memo` で包むことは複雑さを加え、古いバグのリスクを生み、計測可能な改善なしにコードを読みにくくします。数ミリ秒未満でレンダーするコンポーネントは最適化が不要です。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Do not `memo` a component that receives children — `children` is a new object on every render, defeating memo immediately.",
              np: "Children receive गर्ने component `memo` नगर्नु — `children` हर render मा नयाँ object, memo तुरुन्त defeat।",
              jp: "`children` を受け取るコンポーネントを `memo` しない — `children` はレンダーごとに新しいオブジェクトで、即座に memo を無効化します。",
            },
            {
              en: "Do not `useMemo` a computation that takes less than 0.1 ms — the bookkeeping overhead may exceed the computation.",
              np: "0.1 ms भन्दा कम computation `useMemo` नगर्नु — bookkeeping overhead computation भन्दा बढी हुन सक्छ।",
              jp: "0.1 ms 未満の計算を `useMemo` しない — 管理オーバーヘッドが計算を超える可能性があります。",
            },
            {
              en: "Do not add `useCallback` to every function in a component — only add it where a memoized child or effect dep demands a stable reference.",
              np: "Component को हर function मा `useCallback` थप नगर्नु — memoized child वा effect dep ले stable reference चाहिएको ठाउँमा मात्र।",
              jp: "コンポーネントの全ての関数に `useCallback` を追加しない — メモ化された子や effect の依存配列が安定した参照を必要とする箇所のみ。",
            },
            {
              en: "Do not optimise list items unless the list has > 100 items and profiling shows render time > 16 ms per interaction (one 60 fps frame budget).",
              np: "List items > 100 र profiling ले interaction प्रति render time > 16 ms (60 fps frame budget) देखाएनसम्म optimise नगर्नु।",
              jp: "リストアイテムはリストが 100 アイテムを超え、プロファイリングでインタラクションごとのレンダー時間が > 16 ms（60 fps 一フレームの予算）を示すまで最適化しない。",
            },
          ],
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
            en: "You can now profile a React app with DevTools, skip unnecessary re-renders with `React.memo`, stabilise function and object references with `useCallback` and `useMemo`, manage DOM access and mutable values with `useRef`, and — critically — know when not to reach for any of these tools. The discipline of measuring first and optimising second is the skill that separates pragmatic engineers from those who create unmaintainable, over-engineered React code.",
            np: "अब DevTools ले React app profile, `React.memo` ले अनावश्यक re-renders skip, `useCallback` र `useMemo` ले function र object references stable, `useRef` ले DOM access र mutable values manage, र — critically — यी tools कहिले नछोस्नु भन्ने जान्नु हुन्छ। पहिले मापन, पछि optimise को discipline — pragmatic engineers र unmaintainable, over-engineered React code बनाउनेहरू बीचको फरक।",
            jp: "DevTools で React アプリをプロファイルし、`React.memo` で不要な再レンダーをスキップし、`useCallback` と `useMemo` で関数とオブジェクトの参照を安定させ、`useRef` で DOM アクセスとミュータブル値を管理し、そして何より重要なこととして、これらのツールをいつ使わないかを知っています。まず計測して次に最適化する規律が、実用的なエンジニアとメンテナンス不能な過剰設計の React コードを作る人を分けるスキルです。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Does React.memo do deep comparison?",
        np: "React.memo deep comparison गर्छ?",
        jp: "React.memo は深い比較をする？",
      },
      answer: {
        en: "No. `React.memo` does a **shallow comparison** by default — it iterates the props object's keys and checks `Object.is(prevProp, nextProp)` for each. This means nested objects or arrays are compared by reference, not by contents. You can supply a custom `areEqual(prev, next)` second argument for field-specific or deep equality, but use it carefully — the comparator runs on every render.",
        np: "होइन। `React.memo` ले default मा **shallow comparison** — props object को keys iterate गर्छ र हर मा `Object.is(prevProp, nextProp)` check। यसले nested objects वा arrays contents होइन, reference अनुसार compare। Field-specific वा deep equality का लागि custom `areEqual(prev, next)` second argument supply गर्न सकिन्छ — comparator हर render मा run।",
        jp: "いいえ。`React.memo` はデフォルトで**浅い比較**を行います。props オブジェクトのキーを反復し、各々に `Object.is(prevProp, nextProp)` を確認します。これはネストされたオブジェクトや配列が内容ではなく参照で比較されることを意味します。フィールド固有または深い等価性のためにカスタム `areEqual(prev, next)` の第二引数を提供できますが、注意して使いましょう。コンパレータはレンダーごとに実行されます。",
      },
    },
    {
      question: {
        en: "Why does my memoized component still re-render?",
        np: "मेरो memoized component अझैपनि किन re-render गर्छ?",
        jp: "メモ化されたコンポーネントがまだ再レンダーするのはなぜ？",
      },
      answer: {
        en: "The most likely causes: (1) a parent passes a new object or function reference on every render (inline `{}` or `() =>` in JSX), (2) the component reads a context that changed, (3) the component's own state or a ref-tracked value changed, (4) you're in React's Strict Mode (dev-only double render), (5) you passed `children` — which is always a new reference. Use 'Why did this render?' in the Profiler to pinpoint the cause.",
        np: "सबभन्दा likely कारणहरू: (1) parent ले हर render मा नयाँ object वा function reference pass (JSX मा inline `{}` वा `() =>`), (2) component ले changed context पढ्छ, (3) component को आफ्नै state वा ref-tracked value बदलियो, (4) React को Strict Mode (dev-only double render), (5) `children` pass — जो सधैं नयाँ reference। Profiler मा 'Why did this render?' ले कारण pinpoint।",
        jp: "最も可能性の高い原因: (1) 親がレンダーごとに新しいオブジェクトや関数参照を渡す（JSX のインライン `{}` や `() =>`）、(2) コンポーネントが変わったコンテキストを読んでいる、(3) コンポーネント自身の状態や ref 追跡の値が変わった、(4) React の Strict Mode（開発時のみの二重レンダー）、(5) `children` を渡した — 常に新しい参照。プロファイラーの 'Why did this render?' で原因を特定してください。",
      },
    },
    {
      question: {
        en: "Should I wrap every component in memo?",
        np: "हर component memo मा wrap गर्नु पर्छ?",
        jp: "すべてのコンポーネントを memo で包むべき？",
      },
      answer: {
        en: "No. `React.memo` has a cost: it allocates a wrapper, runs the comparison function on every render, and adds noise to the component tree in DevTools. Apply it selectively to components that (a) render frequently, (b) are expensive to render, and (c) receive stable props from a controlled parent. The React team's own guidance is to profile first and memo second.",
        np: "होइन। `React.memo` को cost: wrapper allocate, हर render मा comparison function run, DevTools मा component tree मा noise। Components मा selective रूपमा apply: (a) बारम्बार render, (b) render गर्न महँगो, (c) controlled parent बाट stable props receive। React team को आफ्नै guidance: पहिले profile, पछि memo।",
        jp: "いいえ。`React.memo` にはコストがあります。ラッパーを割り当て、レンダーごとに比較関数を実行し、DevTools のコンポーネントツリーにノイズを加えます。(a) 頻繁にレンダーし、(b) レンダーコストが高く、(c) 制御された親から安定した props を受け取るコンポーネントに選択的に適用します。React チーム自身のガイダンスは、まずプロファイルして次に memo です。",
      },
    },
    {
      question: {
        en: "What is the difference between useCallback and useMemo?",
        np: "useCallback र useMemo बीचको फरक के हो?",
        jp: "useCallback と useMemo の違いは？",
      },
      answer: {
        en: "`useCallback(fn, deps)` is syntactic sugar for `useMemo(() => fn, deps)`. Both memoize a value across renders. The difference is semantic: `useCallback` is conventionally for stabilising function references, `useMemo` for caching computed values (numbers, arrays, objects). Under the hood they are identical — use the more readable form for the intent you're expressing.",
        np: "`useCallback(fn, deps)` `useMemo(() => fn, deps)` को syntactic sugar। दुवैले renders मा value memoize। फरक semantic: `useCallback` conventionally function references stable राख्न, `useMemo` computed values (numbers, arrays, objects) cache। भित्र identical — express गर्ने intent को लागि readable form।",
        jp: "`useCallback(fn, deps)` は `useMemo(() => fn, deps)` の糖衣構文です。両方ともレンダー全体で値をメモ化します。違いはセマンティクスです: `useCallback` は慣習的に関数参照の安定化に、`useMemo` は計算値（数値・配列・オブジェクト）のキャッシュに使います。内部的には同一です。表現する意図に対してより読みやすい形を使いましょう。",
      },
    },
    {
      question: {
        en: "What is the cost of useMemo itself?",
        np: "useMemo आफ्नै cost के हो?",
        jp: "useMemo 自体のコストは？",
      },
      answer: {
        en: "`useMemo` stores the computed value and the deps array in React's fiber, checks deps on every render, and runs the factory function when they change. This bookkeeping is fast but not free. For trivial computations (adding two numbers, accessing an object property) the overhead of `useMemo` exceeds any gain — skip it. Profile first to know whether the computation is actually a hot path.",
        np: "`useMemo` ले computed value र deps array React को fiber मा store गर्छ, हर render मा deps check, परिवर्तन हुँदा factory function run। यो bookkeeping fast तर free होइन। Trivial computations (दुई numbers add, object property access) मा `useMemo` overhead ले gain exceed — skip। Computation hot path हो कि होइन जान्न profile।",
        jp: "`useMemo` は計算値と依存配列を React のファイバーに保存し、レンダーごとに依存を確認し、変わったときにファクトリ関数を実行します。この管理は速いですが無料ではありません。些細な計算（二つの数字の加算、オブジェクトプロパティのアクセス）では `useMemo` のオーバーヘッドが効果を上回ります。計算が実際にホットパスかどうかを知るためにまずプロファイルしてください。",
      },
    },
    {
      question: {
        en: "When does useRef NOT trigger a re-render?",
        np: "useRef कहिले re-render trigger गर्दैन?",
        jp: "useRef が再レンダーをトリガーしないのはいつ？",
      },
      answer: {
        en: "Always — mutating `ref.current` never schedules a re-render. That is the defining property of a ref. React is not aware of the mutation. If you need a value that (a) persists across renders AND (b) triggers a re-render when it changes, use `useState`. Use a ref for values that change behind the scenes (interval IDs, abort controllers, previous render values, latest-callback patterns) where the UI should not react to the change.",
        np: "सधैं — `ref.current` mutate गर्दा re-render schedule हुँदैन। यो ref को defining property। React mutation बारे aware छैन। (a) renders मा persist र (b) परिवर्तन हुँदा re-render trigger गर्ने value चाहिए भने `useState` प्रयोग। Scenes पछाडि परिवर्तन हुने values (interval IDs, abort controllers, previous render values, latest-callback patterns) का लागि ref — UI ले change मा react नगर्नुपर्ने।",
        jp: "常に — `ref.current` のミューテーションは再レンダーをスケジュールしません。それが ref の定義的な特性です。React はミューテーションを認識しません。(a) レンダーを越えて持続し、かつ (b) 変わったときに再レンダーをトリガーする値が必要な場合は `useState` を使います。UI が変化に反応しない裏での変化（インターバル ID・中止コントローラー・前のレンダー値・最新コールバックパターン）には ref を使います。",
      },
    },
    {
      question: {
        en: "How do I find which component is causing slow renders?",
        np: "कुन component ले ढिलो renders गराउँछ कसरी थाहा पाउने?",
        jp: "どのコンポーネントが遅いレンダーを引き起こしているかどう見つける？",
      },
      answer: {
        en: "Use the React DevTools Profiler: (1) record an interaction, (2) look at the flame graph for the widest bars in an unexpected part of the tree, (3) switch to 'Ranked' to see the top render times sorted by duration. Then click each bar for 'Why did this render?' to understand whether the cause is a prop change, state change, or context change. For coarser analysis, the browser's own Performance tab with CPU throttling can show JavaScript long tasks.",
        np: "React DevTools Profiler: (1) interaction record, (2) flame graph मा tree को unexpected भागमा चौडा bars, (3) duration अनुसार sort गरेको top render times देख्न 'Ranked' मा switch। फेरि 'Why did this render?' को लागि हर bar click — prop change, state change, वा context change। Coarser analysis का लागि CPU throttling सहित browser को Performance tab ले JavaScript long tasks देखाउँछ।",
        jp: "React DevTools プロファイラーを使います: (1) インタラクションを記録、(2) ツリーの予期しない部分の最も幅広いバーをフレームグラフで確認、(3) 'Ranked' に切り替えて時間順にソートされたレンダー時間トップを確認。次に各バーをクリックして 'Why did this render?' で prop の変化・状態の変化・コンテキストの変化のどれが原因かを把握します。より大まかな分析には、CPU スロットリング付きのブラウザ自身の Performance タブが JavaScript の長いタスクを示します。",
      },
    },
    {
      question: {
        en: "What is the stale closure problem?",
        np: "Stale closure problem के हो?",
        jp: "スタールクロージャ問題とは？",
      },
      answer: {
        en: "A stale closure occurs when a function 'closes over' a variable at the time it is created, then that variable is updated in state but the function still sees the old value. Common in `useEffect` with a `[]` dep array that reads props or state. The fix is to list the value in the dep array (so the effect re-runs with the fresh value) or use the ref-pattern to always read the latest value without causing the effect to re-run. ESLint's `react-hooks/exhaustive-deps` catches most instances.",
        np: "Stale closure तब हुन्छ जब function create हुने बेला variable 'close over' गर्छ, फेरि त्यो variable state मा update हुन्छ तर function ले पुरानो value देख्छ। `useEffect` मा `[]` dep array सहित props वा state पढ्दा common। Fix: value लाई dep array मा list (effect fresh value सहित re-run), वा effect re-run नगरी latest value पढ्न ref-pattern। ESLint को `react-hooks/exhaustive-deps` ले अधिकांश cases catch।",
        jp: "スタールクロージャは関数が作成時に変数を「クローズオーバー」し、その後その変数が状態で更新されるが、関数がまだ古い値を見ている場合に発生します。`[]` 依存配列を持つ `useEffect` で props や状態を読む場合によく見られます。修正は値を依存配列に列挙する（effect が新しい値で再実行される）か、effect を再実行させずに常に最新の値を読む ref パターンを使うことです。ESLint の `react-hooks/exhaustive-deps` はほとんどのケースを検出します。",
      },
    },
  ],
  bullets: [
    {
      en: "Profile your app before touching anything: open Profiler, record a slow interaction, screenshot the flame graph, and write down the component name and self-render time before adding a single `memo` or `useCallback`.",
      np: "केही छुनु अघि app profile: Profiler open, ढिलो interaction record, flame graph screenshot, र एउटा `memo` वा `useCallback` थप्नु अघि component name र self-render time लेख्नु।",
      jp: "何かに触れる前にアプリをプロファイル: プロファイラーを開き、遅いインタラクションを記録し、フレームグラフをスクリーンショットして、`memo` や `useCallback` を一つ追加する前にコンポーネント名と自己レンダー時間を書き留める。",
    },
    {
      en: "Wrap a `ProductCard` list in `React.memo`, then deliberately break it by passing an inline `style` object, observe the re-renders in the Profiler, and fix it with `useMemo` or a hoisted constant.",
      np: "`ProductCard` list `React.memo` मा wrap, inline `style` object pass गरेर deliberately break, Profiler मा re-renders observe, र `useMemo` वा hoisted constant ले fix।",
      jp: "`ProductCard` リストを `React.memo` で包み、インライン `style` オブジェクトを渡して意図的に破り、プロファイラーで再レンダーを観察し、`useMemo` またはホイストされた定数で修正する。",
    },
    {
      en: "Build the `useRef` trio: DOM focus on modal open, interval ID storage in a stopwatch, and the latest-callback pattern for a debounced search effect — confirm that none of them trigger a re-render when `.current` is mutated.",
      np: "`useRef` trio बनाउनु: modal open मा DOM focus, stopwatch मा interval ID storage, debounced search effect को latest-callback pattern — र `.current` mutate हुँदा कुनैले re-render trigger नगर्ने confirm।",
      jp: "`useRef` の三つ組を構築: モーダルオープン時の DOM フォーカス、ストップウォッチのインターバル ID 保存、デバウンス検索 effect の最新コールバックパターン — そして `.current` がミューテートされたときにどれも再レンダーをトリガーしないことを確認する。",
    },
  ],
};
