import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_17_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "You've written tests (Day 16) to catch bugs before they ship. Today you learn to catch and diagnose the bugs that get through anyway — in development and in production. Analogy: testing is a smoke detector installed before the fire; debugging is knowing how to read the smoke, find the source, and put it out fast when the alarm does go off.",
      np: "Day 16 मा tests लेख्यौं। आज ती bugs पत्ता लगाउने र fix गर्ने सिक्छौं जुन tests बाट बच्न सक्छन् — development र production दुवैमा।",
      jp: "Day 16 でテストを書きました。今日はテストをすり抜けたバグを開発環境と本番環境で見つけ、診断する方法を学びます。",
    },
    {
      en: "Today's topics:\n• <b>React DevTools</b> — the Components tab and the Profiler tab\n• <b>Browser DevTools fundamentals</b> — Elements panel, `$r`, Console tricks\n• <b>Performance tab</b> — recording traces, spotting long tasks and layout thrashing\n• <b>Network tab debugging</b> — inspecting and replaying requests, throttling\n• <b>Source Maps</b> — making production stack traces readable, safely\n• <b>Common React errors</b> — the messages you'll see most, and how to fix each",
      np: "React DevTools, Browser DevTools, Performance tab, Network tab, Source Maps, Common React errors।",
      jp: "React DevTools・ブラウザ DevTools・Performance タブ・Network タブ・ソースマップ・よくある React エラーを学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "React DevTools — Components and Profiler tabs",
        np: "React DevTools — Components र Profiler tabs",
        jp: "React DevTools — Components タブと Profiler タブ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The React DevTools browser extension adds two panels to your browser's DevTools. Analogy: the Components tab is an X-ray of your component tree — you see props, state, and hooks live, without adding a single `console.log`.\n\n<b>Components tab:</b>\n• Click any component in the tree to see its current props, state, and hook values on the right\n• Edit a prop or state value live in the panel — the UI updates instantly, no code change needed, great for testing edge cases (empty arrays, long strings, error states)\n• The search bar filters the tree by component name — essential once a tree has hundreds of nodes\n• The \"eye\" icon jumps from a DOM element to its owning component, and vice versa\n\n<b>Profiler tab:</b>\n• Click record, interact with your app, click stop — React records every render that happened\n• The <b>flame chart</b> shows each commit as a bar; wider bars took longer; color intensity shows relative render cost\n• The <b>ranked chart</b> sorts components by render duration for a single commit — fastest way to spot the one slow component in a big tree\n• Hovering a bar shows <b>why it rendered</b> — \"props changed\", \"state changed\", \"hooks changed\", or \"parent re-rendered\" (enable this via the gear icon: \"Record why each component rendered\")",
            np: "Components tab: props/state/hooks live हेर्ने, edit गर्ने। Profiler tab: flame chart, ranked chart, 'किन render भयो' देखाउने।",
            jp: "Components タブ：props/state/hooks をライブ表示・編集。Profiler タブ：フレームチャート、ランクチャート、再レンダー理由を表示。",
          },
        },
        {
          type: "code",
          title: { en: "Reading a Profiler flame chart", np: "Profiler flame chart पढ्ने", jp: "Profiler フレームチャートの読み方" },
          code: `// Workflow to diagnose "this page feels laggy when I type"

// 1. Open React DevTools -> Profiler tab
// 2. Click the gear icon -> check "Record why each component rendered"
// 3. Click the record (circle) button
// 4. Type in the input that feels laggy
// 5. Click stop

// What to look for in the flame chart:
// - A wide bar for a component you didn't expect to re-render at all
//   -> hover it -> tooltip says "Props changed: onClick"
//   -> the onClick prop is a NEW function every render (inline arrow function)
//   -> fix: wrap it in useCallback, or move it out of the render if it doesn't need props

// Example of the exact bug the Profiler surfaces:
function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {/* New arrow function every render -> ExpensiveList re-renders every keystroke
          even though its own data never changed */}
      <ExpensiveList onItemClick={(id) => console.log(id)} />
    </div>
  );
}

// Fixed — stable reference + memoized child (Day 10)
function SearchPageFixed() {
  const [query, setQuery] = useState('');
  const handleItemClick = useCallback((id: string) => console.log(id), []);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <MemoizedExpensiveList onItemClick={handleItemClick} />
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Browser DevTools fundamentals for React",
        np: "React को लागि Browser DevTools fundamentals",
        jp: "React のためのブラウザ DevTools 基礎",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "You don't always need the React DevTools extension — the browser's built-in Elements and Console panels have React-aware shortcuts worth knowing.\n\n<b>Elements panel:</b>\n• Selecting a DOM node and switching to the Console gives you `$0` (the selected element) — useful for quick `$0.getBoundingClientRect()` checks\n• When React DevTools is installed, selecting a component in its Components tab also makes it available in the Console as <b>`$r`</b> — you can call `$r.props`, `$r.state`, or even trigger its methods directly from the console\n\n<b>Console tricks:</b>\n• `console.table(arrayOfObjects)` — renders an array of objects (like API responses or list state) as a sortable table instead of a collapsed array — the single most underused debugging tool\n• `console.log('%c styled text', 'color: red; font-size: 20px')` — styled logs to make a specific breakpoint-like marker stand out in a noisy log stream\n• Conditional breakpoints — right-click a line number in the Sources panel → \"Add conditional breakpoint\" → enter an expression like `item.id === 'broken-123'` — the debugger only pauses when that's true, instead of stepping through every iteration of a loop",
            np: "$0 = selected DOM element, $r = selected React component (props/state access). console.table() ले arrays लाई readable table मा देखाउँछ। Conditional breakpoints ले specific condition मा मात्र pause गर्छ।",
            jp: "$0 は選択中のDOM要素、$r は選択中のReactコンポーネント。console.table() は配列を読みやすい表にする。条件付きブレークポイントは特定条件でのみ一時停止。",
          },
        },
        {
          type: "code",
          title: { en: "console.table and $r in practice", np: "console.table र $r को प्रयोग", jp: "console.table と $r の実例" },
          code: `// In the browser console, after selecting a component in React DevTools:
$r.props        // { userId: '42', onSave: f }
$r.state        // for class components, or hook state snapshot for function components

// console.table — turn this unreadable array log:
console.log(users);
// [{id:1,name:'Amy',role:'admin'}, {id:2,name:'Sam',role:'user'}, ...]

// into a sortable, scannable table:
console.table(users);
// ┌─────────┬────┬────────┬─────────┐
// │ (index) │ id │  name  │  role   │
// ├─────────┼────┼────────┼─────────┤
// │    0    │ 1  │ 'Amy'  │ 'admin' │
// │    1    │ 2  │ 'Sam'  │ 'user'  │
// └─────────┴────┴────────┴─────────┘

// Conditional breakpoint equivalent in code (when you can't use the Sources panel):
items.forEach(item => {
  if (item.id === 'broken-123') debugger; // only pauses for this one item
  processItem(item);
});`,
        },
      ],
    },
    {
      title: {
        en: "Performance tab — long tasks and layout thrashing",
        np: "Performance tab — long tasks र layout thrashing",
        jp: "Performance タブ — ロングタスクとレイアウトスラッシング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The browser's Performance tab (not React-specific) records everything the browser did — JavaScript execution, layout, painting — on one timeline. Use it when React DevTools' Profiler shows a component is slow, but you need to know <b>why</b> at the browser level.\n\n<b>What to look for:</b>\n• <b>Long tasks</b> — any task over 50ms blocks the main thread; the Performance tab flags these with a red triangle in the corner of the task block\n• <b>Layout thrashing</b> — repeated purple \"Layout\" and green \"Paint\" blocks in quick succession, usually caused by reading a DOM measurement (`offsetHeight`, `getBoundingClientRect`) and writing a style in a loop, forcing the browser to recalculate layout on every iteration instead of once\n• <b>Yellow \"Scripting\" blocks</b> that are wide — usually your own JS (a big `.map()`/`.filter()` in render, or an unmemoized expensive computation from Day 10)",
            np: "Long tasks (50ms+) red triangle ले देखिन्छन्। Layout thrashing = layout/paint repeated हुने — DOM measure र style write loop मा mix गर्दा हुन्छ।",
            jp: "ロングタスク（50ms超）は赤い三角で示される。レイアウトスラッシングは DOM 測定とスタイル書き込みをループ内で混在させると発生。",
          },
        },
        {
          type: "code",
          title: { en: "Fixing layout thrashing", np: "Layout thrashing fix गर्ने", jp: "レイアウトスラッシングの修正" },
          code: `// BUGGY — read then write, repeated for every item -> forces layout recalculation N times
function resizeAllCards(cards: HTMLElement[]) {
  cards.forEach(card => {
    const height = card.offsetHeight;       // READ  (forces layout)
    card.style.height = height + 10 + 'px'; // WRITE (invalidates layout)
    // next iteration's READ now has to recompute layout because of the WRITE above
  });
}

// FIXED — batch all reads, then batch all writes
function resizeAllCardsFixed(cards: HTMLElement[]) {
  const heights = cards.map(card => card.offsetHeight); // all READS first
  cards.forEach((card, i) => {
    card.style.height = heights[i] + 10 + 'px';          // all WRITES after
  });
}

// In React, this usually shows up inside a useLayoutEffect or a ref callback
// that measures DOM nodes in a loop — batch the measurements the same way.`,
        },
      ],
    },
    {
      title: {
        en: "Network tab debugging",
        np: "Network tab debugging",
        jp: "Network タブでのデバッグ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Most \"my data isn't showing up\" bugs are network bugs, not React bugs — check the Network tab before you suspect your component code.\n\n<b>Core workflow:</b>\n• Filter by <b>Fetch/XHR</b> to hide static assets and focus on API calls\n• Click a request → <b>Headers</b> tab to check the URL, method, and whether auth headers were actually sent\n• Click <b>Response</b> to see exactly what the server returned — often the bug is that the API shape changed and your component is reading a field that no longer exists\n• Right-click a request → <b>\"Copy as fetch\"</b> or <b>\"Replay XHR\"</b> to re-run the exact same request outside your app and isolate whether the bug is in the request or in how you handle the response\n\n<b>Throttling for race conditions:</b> set the network throttle dropdown to \"Slow 3G\" to expose bugs that only appear when requests take longer than expected — a classic one is a search box firing request A, then request B (newer query) resolving first, then request A resolving <b>after</b> B and overwriting the newer results with stale data. This needs request cancellation (`AbortController`, or a library like TanStack Query which handles it for you).",
            np: "Fetch/XHR filter, Headers/Response check, Copy as fetch/Replay XHR। Throttle (Slow 3G) ले race conditions (purानो response ले नयाँ लाई overwrite गर्ने) उजागर गर्छ।",
            jp: "Fetch/XHRフィルタ、Headers/Response確認、Copy as fetch/Replay XHR。スロットリング（Slow 3G）で競合状態（古い応答が新しい結果を上書き）を発見。",
          },
        },
        {
          type: "code",
          title: { en: "Fixing a stale-response race condition", np: "Stale-response race condition fix", jp: "古い応答の競合状態の修正" },
          code: `// BUGGY — whichever request resolves LAST wins, even if it was fired first
function SearchBox() {
  const [results, setResults] = useState([]);

  function handleChange(query: string) {
    fetch(\`/api/search?q=\${query}\`)
      .then(res => res.json())
      .then(data => setResults(data)); // race: old, slow request can overwrite new results
  }

  return <input onChange={e => handleChange(e.target.value)} />;
}

// FIXED — cancel the previous request when a new one starts
function SearchBoxFixed() {
  const [results, setResults] = useState([]);
  const abortRef = useRef<AbortController | null>(null);

  function handleChange(query: string) {
    abortRef.current?.abort(); // cancel any in-flight request
    const controller = new AbortController();
    abortRef.current = controller;

    fetch(\`/api/search?q=\${query}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => { if (err.name !== 'AbortError') throw err; });
  }

  return <input onChange={e => handleChange(e.target.value)} />;
}

// TanStack Query (Day 18/20) does this cancellation automatically per query key —
// one more reason to prefer it over raw fetch for anything beyond a one-off call.`,
        },
      ],
    },
    {
      title: {
        en: "Source Maps — making production errors readable",
        np: "Source Maps — production errors पढ्न मिल्ने बनाउने",
        jp: "ソースマップ — 本番エラーを読めるようにする",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A production build is minified — variable names are shortened, whitespace removed, code sometimes rearranged. A stack trace from minified code looks like `at t.onClick (main-a1b2c3.js:1:48213)` — useless for finding the actual bug. A <b>source map</b> is a separate file that maps positions in the minified output back to positions in your original source, so error trackers can show you the real file, function name, and line number.\n\n<b>The security tradeoff:</b> a source map effectively exposes your original, unminified source code (including comments and variable names) to anyone who requests it. The standard practice: build source maps, but don't serve them publicly — upload them directly to your error tracker (Sentry, Bugsnag) during your CI build step, and configure your server/CDN to not serve the `.map` files to browsers.",
            np: "Source map ले minified code लाई original source सँग map गर्छ — real error location देखाउन। Security को लागि publicly serve नगरी error tracker मा मात्र upload गर्ने।",
            jp: "ソースマップは圧縮コードを元のソースにマッピングし、実際のエラー箇所を表示する。セキュリティのため公開せず、エラートラッカーにのみアップロードする。",
          },
        },
        {
          type: "code",
          title: { en: "Vite source maps + Sentry upload", np: "Vite source maps + Sentry upload", jp: "Vite ソースマップ + Sentry アップロード" },
          code: `// vite.config.ts — generate source maps for the production build
export default defineConfig({
  build: {
    sourcemap: true, // generates .js.map files alongside your bundle
  },
});

// CI step: upload maps to Sentry, then delete them so they never ship to users
// (using @sentry/vite-plugin handles this automatically)
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  build: { sourcemap: true },
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'your-org',
      project: 'your-project',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        filesToDeleteAfterUpload: ['./dist/**/*.js.map'], // upload, then scrub from dist/
      },
    }),
  ],
});

// Result: Sentry shows the REAL file/line/function in stack traces,
// but curl-ing your-site.com/assets/main-a1b2c3.js.map returns 404 for end users.`,
        },
      ],
    },
    {
      title: {
        en: "Common React errors — cause and fix",
        np: "Common React errors — कारण र समाधान",
        jp: "よくある React エラー — 原因と対処法",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Errors and warnings you'll see the most",
            np: "सबैभन्दा धेरै देखिने errors/warnings",
            jp: "最も頻繁に見るエラー・警告",
          },
          headers: [
            { en: "Message", np: "Message", jp: "メッセージ" },
            { en: "Common cause", np: "सामान्य कारण", jp: "よくある原因" },
            { en: "Fix", np: "समाधान", jp: "対処法" },
          ],
          rows: [
            [
              { en: "\"Can't perform a React state update on an unmounted component\"", np: "Unmounted component मा state update", jp: "アンマウント後の state 更新" },
              { en: "An async call (fetch, timeout) resolves after the component unmounted, then calls setState", np: "Async call component unmount भइसकेपछि resolve भई setState call गर्छ", jp: "非同期処理がアンマウント後に解決し setState を呼ぶ" },
              { en: "Cancel with `AbortController` in the effect cleanup, or track a mounted ref/flag", np: "Effect cleanup मा AbortController प्रयोग गर्नुहोस्", jp: "エフェクトのクリーンアップで AbortController を使う" },
            ],
            [
              { en: "\"Maximum update depth exceeded\"", np: "Maximum update depth exceeded", jp: "最大更新深度超過" },
              { en: "`setState` called unconditionally inside the render body, or in a `useEffect` with a dependency that changes every render", np: "Render body मा unconditionally setState call, वा हरेक render मा change हुने dependency भएको useEffect", jp: "レンダー中に無条件で setState、または依存が毎回変わる useEffect" },
              { en: "Move the setState into an event handler, or fix the effect's dependency array (Day 8)", np: "setState लाई event handler मा सार्नुहोस् वा dependency array fix गर्नुहोस्", jp: "setState をイベントハンドラに移すか依存配列を修正" },
            ],
            [
              { en: "\"Objects are not valid as a React child\"", np: "Objects React child को रूपमा invalid", jp: "オブジェクトは React の子要素として無効" },
              { en: "Rendering `{someObject}` directly in JSX instead of a string/number/element", np: "JSX मा object सीधै render गर्दा", jp: "JSX でオブジェクトを直接レンダーしている" },
              { en: "Render a specific field (`{user.name}`) or `JSON.stringify(obj)` for debugging only", np: "Specific field render गर्नुहोस् (`{user.name}`)", jp: "特定のフィールドをレンダーする（`{user.name}`）" },
            ],
            [
              { en: "\"Each child in a list should have a unique 'key' prop\"", np: "List child मा unique key prop चाहिन्छ", jp: "リストの子要素には一意の key が必要" },
              { en: "`.map()` without a `key`, or using array index as key on a reorderable list (Day 13)", np: "`.map()` मा key नभएको, वा reorderable list मा index key", jp: "`.map()` に key がない、または並び替え可能なリストで index key" },
              { en: "Add a stable `key` from your data — never the array index for dynamic lists", np: "Data बाट stable key दिनुहोस्, index होइन", jp: "データから安定した key を付ける。動的リストでは index を使わない" },
            ],
            [
              { en: "\"Rendered more hooks than during the previous render\"", np: "अघिल्लो render भन्दा बढी hooks render भयो", jp: "前回より多くのフックがレンダーされた" },
              { en: "A hook called conditionally — inside an `if`, after an early `return`, or inside a loop (Day 11 FAQ)", np: "Hook लाई `if` भित्र वा early return पछि conditionally call गरेको", jp: "if文内や早期returnの後などフックを条件付きで呼んでいる" },
              { en: "Always call hooks unconditionally at the top level; put the condition INSIDE the hook body instead", np: "Hooks लाई सधैं top level मा unconditionally call गर्नुहोस्", jp: "フックは常にトップレベルで無条件に呼ぶ" },
            ],
            [
              { en: "\"Cannot read properties of undefined (reading 'x')\"", np: "Undefined को property पढ्न खोज्दा error", jp: "undefined のプロパティ読み取りエラー" },
              { en: "Rendering before async data has arrived — `data.user.name` when `data` is still `undefined` on first render", np: "Async data नआउँदै render गर्दा — पहिलो render मा `data` undefined हुन्छ", jp: "非同期データ到着前にレンダー — 初回レンダーで data が undefined" },
              { en: "Guard with a loading check (`if (!data) return <Spinner />`) or optional chaining (`data?.user?.name`)", np: "Loading check वा optional chaining (`data?.user?.name`) प्रयोग गर्नुहोस्", jp: "ローディングチェックまたはオプショナルチェイニングを使う" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Do I need React DevTools if I already have good tests?",
        np: "Tests राम्रो भए React DevTools चाहिन्छ?",
        jp: "良いテストがあれば React DevTools は不要？",
      },
      answer: {
        en: "Yes — tests catch known failure cases; DevTools help you understand unknown ones. When a user reports \"this page feels slow\" or \"this shows the wrong data sometimes\", there's no test written for that yet. The Profiler and Components tab are for exploring live, unexpected behavior — tests are for locking in behavior you've already understood.",
        np: "हो — tests ले known cases पत्ता लगाउँछन्, DevTools ले unknown/unexpected behavior explore गर्न मद्दत गर्छ।",
        jp: "はい。テストは既知の失敗を検出し、DevTools は未知の挙動の調査に役立ちます。",
      },
    },
    {
      question: {
        en: "Why does my component show up as \"Anonymous\" in the Profiler?",
        np: "Component 'Anonymous' किन देखिन्छ Profiler मा?",
        jp: "なぜコンポーネントが Profiler で「Anonymous」と表示される？",
      },
      answer: {
        en: "This happens with inline arrow function components (`const X = () => {...}` assigned without a clear name context, or components created inside another function/render). Give components a named function declaration (`function UserCard() {...}`) instead of an anonymous arrow assigned to a `const` in some cases — named function declarations always show their name in DevTools and stack traces.",
        np: "Inline arrow function components ले यस्तो हुन्छ। Named function declaration (`function UserCard() {...}`) प्रयोग गर्नुहोस्।",
        jp: "無名アロー関数コンポーネントで起こる。名前付き関数宣言を使うと解決します。",
      },
    },
    {
      question: {
        en: "The bug only happens in production, not in dev — where do I even start?",
        np: "Bug production मा मात्र हुन्छ, dev मा हुँदैन — कहाँबाट सुरु गर्ने?",
        jp: "バグが本番だけで発生する場合、どこから始める？",
      },
      answer: {
        en: "Start with `npm run preview` (Day 23) — it's the closest local approximation to production (minified, real env vars). If it only reproduces on the actual deployed site, check: environment variable differences, CORS/domain differences affecting cookies or API calls, and whether Strict Mode's dev-only double-invoking (Day 13) was accidentally masking a missing cleanup function that now causes a real leak in production.",
        np: "`npm run preview` बाट सुरु गर्नुहोस् — यो production को नजिक हुन्छ। Env vars, CORS, र StrictMode ले लुकाएको missing cleanup check गर्नुहोस्।",
        jp: "`npm run preview` から始める。環境変数の違い、CORS、StrictMode が隠していたクリーンアップ漏れを確認する。",
      },
    },
    {
      question: {
        en: "Is `console.log` debugging actually bad practice?",
        np: "console.log debugging नराम्रो अभ्यास हो?",
        jp: "console.log デバッグは本当に悪い習慣？",
      },
      answer: {
        en: "No — it's a legitimate first step for quick checks. It becomes a problem when it's your ONLY tool: it can't show you WHY a re-render happened, can't measure timing accurately (logs are cheap but misleading for perf), and gets left in code accidentally. Use it for quick value checks; reach for the Profiler, breakpoints, and the Network tab for anything about timing, renders, or requests.",
        np: "होइन — quick check को लागि ठिकै छ। समस्या तब हुन्छ जब यो एउटै tool बन्छ — किन re-render भयो भन्ने देखाउँदैन।",
        jp: "いいえ。簡易チェックには有効。唯一の手段になると、なぜ再レンダーが起きたか等は分からない。",
      },
    },
    {
      question: {
        en: "Should I ship source maps to production for faster debugging?",
        np: "Faster debugging को लागि production मा source maps ship गर्ने?",
        jp: "デバッグを速くするため本番にソースマップを出すべき？",
      },
      answer: {
        en: "No — publicly serving source maps exposes your original source code to anyone. Generate them during the build, upload them privately to your error tracker (Sentry), and configure your hosting to return 404 for `.map` file requests from browsers. You get readable stack traces in your error dashboard without exposing source to end users.",
        np: "होइन — publicly serve गर्दा source code exposed हुन्छ। Build बेला बनाएर error tracker मा मात्र privately upload गर्नुहोस्।",
        jp: "いいえ。公開すると元のソースが露出します。ビルド時に生成し、エラートラッカーに非公開でアップロードしてください。",
      },
    },
  ],
};
