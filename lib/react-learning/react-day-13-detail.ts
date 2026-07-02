import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_13_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "You've been calling `setState` for 12 days without asking what actually happens after you call it. Today you open the hood. Understanding React's internals — the Virtual DOM, reconciliation, Fiber, and the render/commit split — is what separates \"I can build with React\" from \"I know why my app is slow and how to fix it.\" This is also the single most common senior-level interview topic. Analogy: you've been driving the car for 12 days; today you learn how the engine actually turns fuel into motion.",
      np: "12 दिनसम्म setState call गर्यौं, आज भित्री कुरा बुझ्ने पालो — Virtual DOM, reconciliation, Fiber, render/commit split। यो senior interview को सबैभन्दा common topic हो।",
      jp: "12日間 setState を呼んできましたが、今日は内部を見ます。Virtual DOM・reconciliation・Fiber・render/commit の分離を理解します。シニア面接で最頻出のトピックです。",
    },
    {
      en: "Today's topics:\n• <b>Virtual DOM</b> — why React doesn't touch the real DOM directly\n• <b>Reconciliation & the Diffing Algorithm</b> — how React decides what changed\n• <b>Fiber</b> — the architecture that makes rendering interruptible\n• <b>Render Phase vs Commit Phase</b> — the two-phase update model\n• <b>Scheduling & Batching</b> — how React prioritizes and groups updates\n• <b>Strict Mode</b> — why your components render twice in development\n• <b>Concurrent Rendering</b> — how React 18+ keeps apps responsive under load",
      np: "Virtual DOM, Reconciliation, Diffing, Fiber, Render/Commit Phase, Scheduling, Batching, Strict Mode, Concurrent Rendering।",
      jp: "Virtual DOM・Reconciliation・Diffing・Fiber・Render/Commitフェーズ・Scheduling・Batching・Strict Mode・並行レンダリングを学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "The Virtual DOM — why React doesn't touch the real DOM directly",
        np: "Virtual DOM — किन React ले real DOM सीधै touch गर्दैन",
        jp: "Virtual DOM — なぜ React は実 DOM を直接操作しないのか",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The real DOM is slow to mutate — every change can trigger layout recalculation and repainting, which are expensive browser operations. The Virtual DOM is a lightweight JavaScript object tree that mirrors the real DOM's structure. Analogy: the Virtual DOM is an architect's blueprint — cheap to redraw and compare on paper, versus expensive to physically rebuild a wall every time you change your mind.\n\n<b>The core idea:</b> every time state changes, React builds a brand-new Virtual DOM tree describing what the UI *should* look like. It doesn't touch the real DOM yet — it compares the new tree against the previous one first, and only applies the minimal set of real DOM changes needed. This comparison step is called <b>reconciliation</b>.\n\n<b>Common misconception:</b> the Virtual DOM isn't inherently \"faster than the DOM\" in isolation — a single DOM write can be faster than diffing plus a DOM write. The win is <b>batching many changes into one real DOM update</b> instead of many, and giving React a declarative model (\"here's what the UI should look like\") instead of an imperative one (\"here's how to mutate it step by step\").",
            np: "Virtual DOM = हल्का JS object tree जसले real DOM mirror गर्छ। State change हुँदा नयाँ tree बनाइ पुरानोसँग compare गरी minimal DOM changes मात्र apply गरिन्छ — यसलाई reconciliation भनिन्छ।",
            jp: "Virtual DOM は実 DOM を映す軽量な JS オブジェクトツリー。状態変化のたびに新しいツリーを作り、前のツリーと比較して最小限の実 DOM 変更のみ適用する — これが reconciliation です。",
          },
        },
        {
          type: "diagram",
          id: "react-virtual-dom",
        },
      ],
    },
    {
      title: {
        en: "Reconciliation and the Diffing Algorithm",
        np: "Reconciliation र Diffing Algorithm",
        jp: "Reconciliation と Diffing アルゴリズム",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Reconciliation is the process of comparing two Virtual DOM trees (old vs new) and computing the minimal set of real DOM operations to get from one to the other. A naive tree-diff algorithm is O(n³) — too slow for UI at 60fps. React's diffing algorithm makes it O(n) with two heuristics:\n\n<b>Heuristic 1 — different element types produce different trees.</b> If a `<div>` becomes a `<span>` at the same position, React doesn't bother diffing their children — it tears down the whole subtree and builds a new one from scratch. This is why swapping element types is more expensive than updating attributes.\n\n<b>Heuristic 2 — keys tell React which list items persisted.</b> Without keys, React compares list items by position — index 0 vs index 0, index 1 vs index 1. If you insert an item at the front, every item after it appears \"changed\" by position, even though only one item is actually new. A stable, unique `key` lets React match old and new items by identity, not position, so it can reorder/reuse them instead of re-rendering everything below the insertion point.",
            np: "Reconciliation ले दुई Virtual DOM trees compare गरी minimal DOM operations निकाल्छ। Two heuristics: (1) फरक element type भए subtree पूरै rebuild हुन्छ (2) keys ले list items लाई position भन्दा identity द्वारा match गर्छ।",
            jp: "Reconciliation は2つの Virtual DOM ツリーを比較し最小限の DOM 操作を導く。2つのヒューリスティック：(1) 要素タイプが違えばサブツリー全体を再構築 (2) key で位置でなく同一性によりリスト項目を照合。",
          },
        },
        {
          type: "code",
          title: { en: "Why array index as key breaks reconciliation", np: "Array index key ले reconciliation किन बिगार्छ", jp: "配列インデックスキーが reconciliation を壊す理由" },
          code: `// BAD — index as key
function TodoList({ todos }: { todos: { id: string; text: string }[] }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>
          <input defaultValue={todo.text} /> {/* uncontrolled — keeps its own DOM state */}
        </li>
      ))}
    </ul>
  );
}

// Insert a new todo at the FRONT of the array:
// Before: [ {id: 'a', text: 'Buy milk'} ]           key=0 -> "Buy milk"
// After:  [ {id: 'b', text: 'Call mom'}, {id:'a',...} ]  key=0 -> "Call mom", key=1 -> "Buy milk"
//
// React sees key=0 "changed text" (it thinks it's the SAME element, just updated).
// Since the <input> is uncontrolled, React reuses the DOM node and its typed-in value —
// so the new item at position 0 displays the OLD item's leftover input state. Bug!

// GOOD — stable identity as key
function TodoListFixed({ todos }: { todos: { id: string; text: string }[] }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <input defaultValue={todo.text} />
        </li>
      ))}
    </ul>
  );
}
// Now React sees a NEW key ('b') appear and an EXISTING key ('a') move —
// it inserts a new DOM node instead of confusingly reusing one.`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Rule of thumb:</b> index-as-key is only safe when the list is static (never reordered, filtered, or has items inserted/removed) — for anything else, use a stable ID from your data.",
            np: "List कहिल्यै reorder/filter/insert नहुने भए मात्र index-as-key सुरक्षित छ।",
            jp: "リストが並び替え・フィルタ・挿入されない場合のみインデックスキーは安全です。",
          },
        },
      ],
    },
    {
      title: {
        en: "Fiber — the architecture behind interruptible rendering",
        np: "Fiber — interruptible rendering को architecture",
        jp: "Fiber — 中断可能なレンダリングを支える構造",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Before React 16, reconciliation walked the component tree recursively and synchronously — once started, it couldn't stop until the whole tree was processed, even if it took so long the browser dropped frames (janky scrolling, unresponsive typing). Fiber (introduced in React 16) rewrote the reconciler around a linked-list data structure instead of a plain recursive call stack.\n\n<b>What a Fiber actually is:</b> a JavaScript object representing one unit of work for one component instance — it holds the component's type, props, state, and pointers to its parent, child, and sibling fibers. Analogy: the old recursive stack is like reading a book straight through with no bookmark — Fiber is the same book with a bookmark on every page, so you can stop after any page, do something more urgent, and resume exactly where you left off.\n\n<b>Why this matters practically:</b> Fiber is what makes `useTransition`, `useDeferredValue`, Suspense, and time-slicing possible (Day 14/old-Day 12). None of those APIs could exist with the old synchronous, non-interruptible reconciler.",
            np: "Fiber = हरेक component को एक unit-of-work object, linked-list structure मा। Render कामलाई pause/resume गर्न मिल्ने बनायो — यसैले useTransition, Suspense जस्ता features सम्भव भए।",
            jp: "Fiber は各コンポーネントの作業単位を表すオブジェクトで、連結リスト構造を持つ。レンダー作業を一時停止・再開可能にし、useTransition や Suspense を実現しました。",
          },
        },
        {
          type: "diagram",
          id: "react-render-cycle",
        },
      ],
    },
    {
      title: {
        en: "Render Phase vs Commit Phase",
        np: "Render Phase vs Commit Phase",
        jp: "Render フェーズ vs Commit フェーズ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every React update happens in two distinct phases:\n\n<b>1. Render phase (can be interrupted, can be thrown away):</b>\n• React calls your component functions, builds the new Fiber tree, and diffs it against the current tree\n• Pure — no DOM mutations happen here, and no side effects should happen here either\n• Interruptible — React can pause, abandon, or restart this phase (e.g. a higher-priority update comes in) without any visible side effect, precisely because nothing has touched the screen yet\n\n<b>2. Commit phase (synchronous, cannot be interrupted):</b>\n• React applies the computed changes to the real DOM in one synchronous pass\n• Runs `useLayoutEffect` callbacks synchronously right after the DOM mutates, then runs `useEffect` callbacks asynchronously after the browser paints\n• Cannot be paused — once commit starts, it must finish, or the user would see a half-updated UI\n\n<b>Why this split exists:</b> if rendering could mutate the DOM directly, an interrupted/discarded render would leave the screen in an inconsistent state. Keeping the render phase pure and DOM-free is what makes it safe to interrupt.",
            np: "Render phase: component functions call गरी नयाँ Fiber tree बनाउने — pure, interruptible, DOM छुँदैन। Commit phase: real DOM मा changes apply गर्ने — synchronous, interrupt हुन सक्दैन।",
            jp: "Render フェーズ：新しい Fiber ツリーを作る — 純粋で中断可能、DOM に触れない。Commit フェーズ：実 DOM に変更を適用 — 同期的で中断不可。",
          },
        },
        {
          type: "table",
          caption: { en: "Render phase vs commit phase", np: "Render vs Commit phase", jp: "Render フェーズ vs Commit フェーズ" },
          headers: [
            { en: "", np: "", jp: "" },
            { en: "Render phase", np: "Render phase", jp: "Render フェーズ" },
            { en: "Commit phase", np: "Commit phase", jp: "Commit フェーズ" },
          ],
          rows: [
            [
              { en: "Touches the DOM?", np: "DOM touch गर्छ?", jp: "DOM に触れる？" },
              { en: "No", np: "छैन", jp: "しない" },
              { en: "Yes", np: "हो", jp: "する" },
            ],
            [
              { en: "Interruptible?", np: "Interruptible?", jp: "中断可能？" },
              { en: "Yes (concurrent features)", np: "हो", jp: "可能" },
              { en: "No — always synchronous", np: "छैन", jp: "不可能" },
            ],
            [
              { en: "What runs here", np: "के चल्छ", jp: "実行内容" },
              { en: "Component functions, diffing", np: "Component functions, diffing", jp: "コンポーネント関数、diff計算" },
              { en: "DOM mutations, useLayoutEffect, useEffect", np: "DOM mutations, effects", jp: "DOM変更、useLayoutEffect、useEffect" },
            ],
            [
              { en: "Side effects allowed?", np: "Side effects हुन्छ?", jp: "副作用は許可？" },
              { en: "No — must stay pure", np: "छैन — pure हुनुपर्छ", jp: "不可 — 純粋関数であるべき" },
              { en: "Yes — this is where effects fire", np: "हो", jp: "可能" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Scheduling and Batching",
        np: "Scheduling र Batching",
        jp: "スケジューリングとバッチング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Scheduling</b> is how React decides which update to work on first when multiple updates are pending. Not all updates are equally urgent — a keystroke should win over a background data refresh. React assigns updates a priority (called a \"lane\") and the scheduler works on higher-priority lanes first, pausing lower-priority render work if needed. This is the mechanism underneath `useTransition` (Day 14) — marking an update as \"low priority\" is literally assigning it to a lower-priority lane.\n\n<b>Batching</b> is grouping multiple state updates into a single re-render instead of one re-render per `setState` call. Before React 18, batching only happened inside React event handlers — a `setTimeout` or a Promise callback would trigger a separate re-render per update. <b>Automatic batching (React 18+)</b> extended this everywhere: timeouts, promises, native event handlers all batch now.",
            np: "Scheduling ले कुन update पहिले process गर्ने भन्ने priority (lane) अनुसार decide गर्छ। Batching ले multiple setState calls लाई एउटै re-render मा group गर्छ — React 18 देखि सबैतिर automatic।",
            jp: "スケジューリングは優先度（lane）に基づきどの更新を先に処理するか決める。バッチングは複数の setState を1回の再レンダーにまとめる — React 18からはどこでも自動的に行われます。",
          },
        },
        {
          type: "code",
          title: { en: "Automatic batching — before vs after React 18", np: "Automatic batching example", jp: "自動バッチングの例" },
          code: `function Counter() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    // Inside a React event handler — ALWAYS batched, even pre-18
    setCount(c => c + 1);
    setFlag(f => !f);
    // Only ONE re-render happens here, not two
  }

  function handleFetch() {
    fetch('/api/data').then(() => {
      // Before React 18: TWO re-renders (not batched — outside React's event system)
      // React 18+:        ONE re-render (automatic batching covers promises too)
      setCount(c => c + 1);
      setFlag(f => !f);
    });
  }

  // Opting OUT of batching when you genuinely need synchronous, separate renders
  // (rare — e.g. reading layout between two specific updates)
  function handleUrgentUpdate() {
    flushSync(() => {
      setCount(c => c + 1);
    });
    // DOM is updated here — count's new value is already painted
    flushSync(() => {
      setFlag(f => !f);
    });
  }

  return <button onClick={handleClick}>{count} / {String(flag)}</button>;
}`,
        },
      ],
    },
    {
      title: {
        en: "Strict Mode — why components render twice in development",
        np: "Strict Mode — development मा components दुई पटक किन render हुन्छन्",
        jp: "Strict Mode — 開発中にコンポーネントが2回レンダーされる理由",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`<StrictMode>` is a development-only wrapper that intentionally double-invokes certain functions to surface bugs that would otherwise hide until production. It does nothing in production builds — zero runtime cost for your users.\n\n<b>What gets double-invoked in development:</b>\n• Component function bodies (render phase) — to catch impure rendering (e.g. mutating a variable outside the function, relying on `Math.random()` or `Date.now()` directly during render)\n• `useState`, `useMemo`, `useReducer` initializer functions\n• Effect setup + cleanup functions are run an extra mount/unmount/mount cycle — to catch effects that don't clean up properly (e.g. a subscription that isn't unsubscribed, so remounting doubles it)\n\n<b>The real bug Strict Mode is designed to catch:</b> an effect that subscribes to something in its setup but doesn't unsubscribe in its cleanup. Under Strict Mode's extra mount/unmount/mount, that bug becomes visible immediately (duplicate subscriptions) instead of silently accumulating in production over time as users navigate.",
            np: "StrictMode ले development मा मात्र functions double-invoke गरी impure rendering र missing effect cleanup जस्ता bugs पहिल्यै देखाउँछ। Production मा कुनै असर पर्दैन।",
            jp: "StrictMode は開発時のみ関数を二重実行し、不純なレンダリングやエフェクトのクリーンアップ漏れを早期発見する。本番には一切影響しません。",
          },
        },
        {
          type: "code",
          title: { en: "The exact bug Strict Mode catches", np: "StrictMode ले पक्रने bug", jp: "StrictMode が捕捉するバグ" },
          code: `// BUGGY — subscribes but never unsubscribes correctly
function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    // Missing: return () => connection.disconnect();
    // In production this silently leaks a connection every time roomId changes
    // or the component remounts. Under StrictMode's extra mount/unmount/mount,
    // you immediately see TWO active connections in the network tab — impossible to miss.
  }, [roomId]);

  return <div>Connected to {roomId}</div>;
}

// FIXED
function ChatRoomFixed({ roomId }: { roomId: string }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect(); // cleanup — StrictMode's double-run now shows ONE connection
  }, [roomId]);

  return <div>Connected to {roomId}</div>;
}`,
        },
      ],
    },
    {
      title: {
        en: "Concurrent Rendering",
        np: "Concurrent Rendering",
        jp: "並行レンダリング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Concurrent Rendering is the umbrella term for everything Fiber, scheduling, and the render/commit split enable together: React can prepare multiple versions of the UI at once, pause work on one to handle something more urgent, and discard in-progress renders that are no longer needed. \"Concurrent\" doesn't mean parallel (JavaScript is still single-threaded) — it means <b>interruptible</b>.\n\n<b>You already met concurrent rendering's user-facing APIs:</b> `useTransition` and `useDeferredValue` (Day 14) are how you opt specific updates into low-priority, interruptible treatment. Suspense (Day 14) is how components declare \"I'm not ready yet\" and let React render a fallback for just that part of the tree without blocking everything else.\n\n<b>The mental model that ties this whole day together:</b> React is not a library that immediately reflects your state into the DOM. It's a scheduler that decides, based on priority, WHEN to run your render phase, and only commits to the DOM once, atomically, when the result is ready and not superseded by newer, higher-priority work.",
            np: "Concurrent Rendering ले Fiber + Scheduling + render/commit split सबै जोड्छ — React ले multiple UI versions prepare गरी priority अनुसार काम गर्छ। 'Concurrent' ले parallel भन्दा 'interruptible' अर्थ दिन्छ।",
            jp: "並行レンダリングは Fiber・スケジューリング・render/commit分離をすべて統合する概念。「並行」とはスレッド並列ではなく「中断可能」を意味します。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Is the Virtual DOM always faster than manipulating the real DOM directly?",
        np: "Virtual DOM सधैं real DOM भन्दा फास्ट हुन्छ?",
        jp: "Virtual DOM は常に実DOM操作より速い？",
      },
      answer: {
        en: "No. A hand-optimized, targeted DOM update can outperform React's diff-then-update pipeline for a single, known change. The Virtual DOM's value is developer experience at scale — you write declarative code without manually tracking what changed, and React batches many changes into efficient DOM writes. It trades a small per-update overhead for a large reduction in the complexity of managing a big, frequently-changing UI by hand.",
        np: "होइन। Single, known change को लागि hand-optimized DOM update बढी फास्ट हुन सक्छ। Virtual DOM को फाइदा scale मा developer experience हो।",
        jp: "いいえ。単一の既知の変更なら手動最適化の方が速いこともあります。Virtual DOM の価値は規模が大きい時の開発体験にあります。",
      },
    },
    {
      question: {
        en: "Does every state update go through the full render + commit cycle?",
        np: "हरेक state update ले पूरा render+commit cycle जान्छ?",
        jp: "すべての状態更新が render+commit サイクルを通る？",
      },
      answer: {
        en: "Yes, conceptually — but React can bail out early. If a component's render output is referentially identical to its previous output (common with `React.memo`, or when state is set to the same value it already had), React skips re-rendering children of that subtree entirely. That's why Day 10's memoization techniques (`memo`, `useMemo`, `useCallback`) work — they help React's bail-out checks succeed more often.",
        np: "हो, तर React ले early bail-out गर्न सक्छ — output उही भए (memo को कारणले), subtree re-render skip हुन्छ।",
        jp: "概念上はい。ただし出力が同一なら（memo などにより）React はサブツリーの再レンダーを省略できます。",
      },
    },
    {
      question: {
        en: "Why does Strict Mode make my API calls fire twice?",
        np: "Strict Mode ले API calls किन दुई पटक fire गर्छ?",
        jp: "Strict Mode で API 呼び出しが2回発火するのはなぜ？",
      },
      answer: {
        en: "Because your `useEffect` is doing the fetch without proper cleanup/cancellation, and StrictMode's extra mount/unmount/mount cycle exposes it. This is by design — in production (without StrictMode) the same class of bug would manifest as duplicate network requests when a component remounts quickly (e.g. fast navigation). Fix it with an `AbortController` in the effect cleanup, or use a data-fetching library (TanStack Query, Day 17/18) that already handles this.",
        np: "useEffect मा proper cleanup नभएकोले हो — StrictMode ले यो bug उजागर गर्छ। AbortController वा TanStack Query use गर्नुहोस्।",
        jp: "useEffect に適切なクリーンアップがないためです。AbortController や TanStack Query の利用で解決します。",
      },
    },
    {
      question: {
        en: "What's the difference between reconciliation and rendering?",
        np: "Reconciliation र rendering मा के फरक?",
        jp: "Reconciliation と rendering の違いは？",
      },
      answer: {
        en: "\"Rendering\" is React calling your component function to get a description of the UI (JSX -> Virtual DOM nodes). \"Reconciliation\" is the subsequent step of comparing that new description against the previous one to compute what changed. Rendering always happens when a component re-renders; reconciliation is the diffing that decides whether any real DOM work is needed as a result.",
        np: "Rendering = component function call गरी UI description निकाल्ने। Reconciliation = नयाँ र पुरानो description compare गर्ने।",
        jp: "Rendering はコンポーネント関数を呼びUI記述を得ること。Reconciliation は新旧の記述を比較すること。",
      },
    },
    {
      question: {
        en: "Do I need to understand Fiber internals to use React well?",
        np: "React राम्रोसँग use गर्न Fiber internals बुझ्नुपर्छ?",
        jp: "React をうまく使うために Fiber の内部を理解する必要はある？",
      },
      answer: {
        en: "Not to build most apps — but it's high-value knowledge for three situations: debugging confusing re-render or stale-closure bugs, understanding why `useTransition`/Suspense behave the way they do, and technical interviews at mid-to-senior level, where \"explain what happens when you call setState\" is one of the most common questions.",
        np: "Basic apps को लागि जरुरी छैन, तर debugging, concurrent features बुझ्न, र interviews को लागि उपयोगी छ।",
        jp: "基本的なアプリには不要ですが、デバッグ・並行機能の理解・面接対策に有用です。",
      },
    },
  ],
};
