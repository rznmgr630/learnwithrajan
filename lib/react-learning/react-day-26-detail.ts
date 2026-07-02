import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_26_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Today you learn nothing new about React. That's the point. Interview prep isn't a 26th chunk of material — it's the skill of <b>articulating</b>, out loud, under a clock, with a stranger watching, what you already built over the last 25 days. Analogy: you've spent 25 days learning to cook every dish on the menu; today is about being able to describe your recipe to a food critic in two clear sentences while the pan is still on the heat.\n\n<b>Why candidates who know React still fail interviews:</b> most rejections aren't about missing knowledge — they're about knowledge that's never been compressed into a spoken, structured answer before. \"I know how reconciliation works\" and \"I can explain reconciliation clearly in 60 seconds to someone who's never seen my code\" are different skills. Today drills the second one.",
      np: "आज नयाँ React सिकाइँदैन — बरु 25 दिनसम्म सिकेको कुरा clock मुनि, अनजान व्यक्तिको अगाडि, स्पष्टसँग बोलेर <b>articulate</b> गर्ने अभ्यास हो। धेरै candidates React नजानेर होइन, ज्ञानलाई कहिल्यै बोलेर structured जवाफमा compress नगरेकोले interview मा फेल हुन्छन्।",
      jp: "今日新しい React の知識は学びません。それが本題です — 面接対策とは、この25日間で身につけたことを、時間制限の中、初対面の相手の前で<b>言葉にして説明する</b>スキルです。多くの候補者は知識不足でなく、知っていることを話し言葉に圧縮した経験がないために不合格になります。",
    },
    {
      en: "Today's topics:\n• <b>Frequently asked conceptual questions</b> — a review index pointing each question back to the day that already taught the answer\n• <b>Coding challenges</b> — the short, live-coding prompts screening rounds use, and what each one is really testing\n• <b>Machine coding exercises</b> — building a small complete feature under time pressure, and how it's scored\n• <b>Performance debugging scenarios</b> — \"here's a slow component, find and fix it\" prompts\n• <b>System design for frontend</b> — structuring an open-ended \"design X\" conversation\n• <b>Real-world debugging exercises</b> — going from a vague bug report to a verified fix",
      np: "आजका topics: conceptual प्रश्नहरूको review index, coding challenges, machine coding exercises, performance debugging scenarios, frontend system design, र real-world debugging exercises।",
      jp: "本日のトピック：頻出概念質問の復習インデックス、コーディング課題、機械式コーディング演習、パフォーマンスデバッグ、フロントエンド設計面接、実務デバッグ演習。",
    },
  ],
  sections: [
    {
      title: {
        en: "Frequently asked conceptual questions",
        np: "बारम्बार सोधिने conceptual प्रश्नहरू",
        jp: "頻出の概念質問",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "This section is deliberately not a rehash — it's an index. Every question below was already answered in depth on an earlier day; the table just tells you exactly where to go re-read if your answer feels shaky. Practice saying each one-line answer out loud before you check the source day — if you can't compress it to one sentence, that's the day to revisit first.",
            np: "यो section दोहोर्याइ पढाइ होइन — एक index मात्र हो। तलका हरेक प्रश्नको गहिरो जवाफ पहिल्यै कुनै न कुनै दिनमा सिकाइसकिएको छ; तपाईंको जवाफ कमजोर लाग्यो भने table ले ठ्याक्कै कुन दिन फर्केर हेर्ने भन्छ।",
            jp: "このセクションは復習ではなく索引です。以下の質問はすべて過去のいずれかの日で詳しく学んでいます。答えに自信がなければ、表が示す該当日に戻って確認してください。",
          },
        },
        {
          type: "table",
          caption: {
            en: "8 common questions and where you already learned the answer",
            np: "8 वटा सामान्य प्रश्न र जवाफ सिकिएको दिन",
            jp: "頻出質問8選と、すでに学んだ該当日",
          },
          headers: [
            { en: "Question", np: "प्रश्न", jp: "質問" },
            { en: "Answered in depth in", np: "गहिरो जवाफ यहाँ", jp: "詳しい回答はこちら" },
          ],
          rows: [
            [
              { en: "What is the Virtual DOM and why does it help?", np: "Virtual DOM के हो र किन उपयोगी छ?", jp: "Virtual DOM とは何で、なぜ役立つのか？" },
              { en: "Day 13 — Virtual DOM section: cheap JS tree, diff before touching the real DOM", np: "Day 13 — Virtual DOM section", jp: "Day 13 — Virtual DOM の項" },
            ],
            [
              { en: "Explain reconciliation and keys.", np: "Reconciliation र keys को व्याख्या गर्नुहोस्।", jp: "Reconciliation と key を説明してください。" },
              { en: "Day 13 — Reconciliation & Diffing Algorithm section, incl. the index-as-key bug", np: "Day 13 — Reconciliation section", jp: "Day 13 — Reconciliation の項" },
            ],
            [
              { en: "Controlled vs uncontrolled components — what's the difference?", np: "Controlled vs uncontrolled components — फरक के हो?", jp: "制御 vs 非制御コンポーネントの違いは？" },
              { en: "Day 4 (controlled inputs) and Day 7 (RHF's uncontrolled-by-default model)", np: "Day 4 र Day 7", jp: "Day 4 と Day 7" },
            ],
            [
              { en: "When does useEffect run relative to useLayoutEffect?", np: "useEffect र useLayoutEffect कहिले-कहिले चल्छन्?", jp: "useEffect と useLayoutEffect はいつ実行される？" },
              { en: "Day 8 (useEffect basics) and Day 13's Render Phase vs Commit Phase table", np: "Day 8 र Day 13", jp: "Day 8 と Day 13" },
            ],
            [
              { en: "What problem do custom hooks actually solve?", np: "Custom hooks ले साँच्चै के समस्या समाधान गर्छ?", jp: "カスタムフックは何を解決するのか？" },
              { en: "Day 11 — custom hooks section", np: "Day 11", jp: "Day 11" },
            ],
            [
              { en: "Explain React.memo / useMemo / useCallback — and when they DON'T help.", np: "React.memo / useMemo / useCallback कहिले काम नगर्ने?", jp: "React.memo/useMemo/useCallback が効かないのはいつ？" },
              { en: "Day 10 — Performance day covers both the technique and its common misuses", np: "Day 10 — Performance day", jp: "Day 10 — パフォーマンスの日" },
            ],
            [
              { en: "What is prop drilling, and how do you avoid it?", np: "Prop drilling के हो, कसरी बच्ने?", jp: "Prop drilling とは何で、どう避ける？" },
              { en: "Day 9 (useContext) and Day 19 (Zustand as a further alternative)", np: "Day 9 र Day 19", jp: "Day 9 と Day 19" },
            ],
            [
              { en: "What's the difference between state and props?", np: "State र props मा के फरक छ?", jp: "state と props の違いは？" },
              { en: "Day 4 — Props, state, children & DevTools", np: "Day 4", jp: "Day 4" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Coding challenges — common live-coding prompts",
        np: "Coding challenges — live-coding मा सोधिने सामान्य प्रश्नहरू",
        jp: "コーディング課題 — よく出るライブコーディング問題",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Screening rounds favor short (15-30 minute) prompts that look small but are chosen deliberately — each one is a trap for a specific, common mistake. The interviewer almost never cares only \"does it work\"; they're watching HOW you get there.",
            np: "Screening round मा 15-30 मिनेटका छोटा तर सोचिसमझि छानिएका प्रश्नहरू आउँछन् — हरेकले एउटा specific सामान्य गल्ती समात्न design गरिएको हुन्छ। Interviewer ले 'काम गर्छ कि गर्दैन' मात्र हेर्दैन, बरु कसरी पुग्यौ भन्ने हेर्छ।",
            jp: "スクリーニング面接では15〜30分の一見単純な課題が出ますが、それぞれ特定のよくある間違いを狙った設計です。面接官は「動くかどうか」だけでなく「どう辿り着いたか」を見ています。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Classic prompts and what's actually being evaluated",
            np: "Classic प्रश्नहरू र साँच्चै जाँचिने कुरा",
            jp: "定番課題と実際に評価される点",
          },
          headers: [
            { en: "Challenge", np: "Challenge", jp: "課題" },
            { en: "What the interviewer is actually evaluating", np: "साँच्चै के जाँचिँदैछ", jp: "実際に評価される点" },
          ],
          rows: [
            [
              { en: "Build a debounced search input from scratch (no library)", np: "Library बिना debounced search input बनाउनुहोस्", jp: "ライブラリなしでデバウンス検索入力を実装" },
              { en: "Whether the setTimeout is cleared in the useEffect cleanup — a missing clearTimeout means every keystroke stacks a fresh, uncancelled timer instead of resetting it", np: "useEffect cleanup मा clearTimeout छ कि छैन — नभए हरेक keystroke ले टाइमर थुप्रिन्छ", jp: "useEffect のクリーンアップで clearTimeout しているか — なければキー入力のたびにタイマーが積み重なる" },
            ],
            [
              { en: "Build a controlled accordion where only one section is open", np: "एक पटकमा एउटा मात्र खुल्ने controlled accordion", jp: "1つだけ開く制御式アコーディオン" },
              { en: "State ownership (a single open-index in the parent, not per-item booleans) AND accessibility — `aria-expanded`, a real `<button>` header, and keyboard operability, not just visual toggling", np: "State ownership (parent मा single open-index) र accessibility (`aria-expanded`, real button, keyboard)", jp: "状態の所有権（親に単一のopen-index）とアクセシビリティ（aria-expanded、実際のbutton、キーボード操作）" },
            ],
            [
              { en: "Implement a counter with undo/redo using useReducer", np: "useReducer प्रयोग गरी undo/redo सहित counter", jp: "useReducer を使った undo/redo 付きカウンター" },
              { en: "Reducer design — modeling history as a stack/array of past states instead of scattering undo logic across multiple useState calls, and never mutating the history array in place", np: "Reducer design — history लाई stack/array मा राख्ने, मिश्रित useState मा होइन; array मा mutate नगर्ने", jp: "reducer設計 — 履歴を配列で管理し複数のuseStateに分散させないこと、履歴配列を直接変更しないこと" },
            ],
            [
              { en: "Build a custom `useToggle` or `useLocalStorage` hook, live", np: "Live मा custom `useToggle` वा `useLocalStorage` hook बनाउनुहोस्", jp: "その場で custom useToggle/useLocalStorage フックを実装" },
              { en: "Clean hook interface design (sensible return shape/naming), a lazy `useState` initializer for the localStorage read, and syncing writes back via an effect without causing an infinite render loop", np: "राम्रो hook interface, lazy useState initializer, र infinite loop नहुने गरी sync गर्ने effect", jp: "適切なフックインターフェース、localStorage読み込みの遅延初期化、無限ループを起こさない同期処理" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Reference shape — undo/redo counter with useReducer",
            np: "Reference — undo/redo counter",
            jp: "参照実装 — undo/redo カウンター",
          },
          code: `type State = { past: number[]; present: number; future: number[] };
type Action = { type: "increment" } | { type: "decrement" } | { type: "undo" } | { type: "redo" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { past: [...state.past, state.present], present: state.present + 1, future: [] };
    case "decrement":
      return { past: [...state.past, state.present], present: state.present - 1, future: [] };
    case "undo": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future], // stash current so redo can restore it
      };
    }
    case "redo": {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return { past: [...state.past, state.present], present: next, future: rest };
    }
  }
}
// The trick the interviewer is watching for: any new action clears "future" —
// once you branch off history with a fresh increment, the old redo path is gone.`,
        },
      ],
    },
    {
      title: {
        en: "Machine coding exercises",
        np: "Machine coding exercises",
        jp: "機械式コーディング演習",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>machine coding round</b> asks you to build a small but complete feature — a GitHub repo search app, a shopping cart, a Kanban board — from an empty project in 45-90 minutes. Analogy: a coding challenge tests whether you can change a tire; a machine coding round hands you a stripped-down car and asks you to drive it off the lot, working brakes and all.\n\n<b>What strong candidates cover under time pressure:</b>\n• <b>Loading, error, and empty states</b> — not just the happy path with data already there\n↳ \"what does the screen show while the fetch is in flight, if it fails, and if the result is an empty array\" are three separate, checkable states\n• <b>Debouncing the search input</b> if there's a search box — an interviewer will often type quickly on purpose to see if you fire a request per keystroke\n• <b>Basic accessibility</b> — semantic elements (`<button>`, not a `<div onClick>`), labelled inputs, focus that goes somewhere sensible\n• <b>Componentization</b> — a handful of small, named components with clear responsibilities, not one function with all the JSX inline\n• <b>NOT over-engineering</b> — no premature abstraction. Building a generic `useFetchFactory<T>` or a plugin system for a 60-minute cart exercise burns your clock and signals you can't read the scope of the task correctly; a few well-named, slightly-repeated lines usually beats a clever abstraction you don't have time to finish",
            np: "Machine coding round: 45-90 मिनेटमा GitHub repo search वा shopping cart जस्तो सानो तर पूर्ण feature बनाउने। Checklist: loading/error/empty states, search debounce, basic accessibility, componentization, र over-engineering नगर्ने (premature abstraction होइन) — समय भित्र scope भन्दा बढी clever बन्न खोज्दा नोक्सान हुन्छ।",
            jp: "機械式コーディングラウンドは45〜90分で小さくも完全な機能（GitHubリポジトリ検索、ショッピングカート等）をゼロから作る演習です。チェックリスト：loading/error/empty状態、検索のデバウンス、基本的なアクセシビリティ、コンポーネント分割、そして過剰設計をしないこと（時間内に収まらない汎用的な抽象化は避ける）。",
          },
        },
      ],
    },
    {
      title: {
        en: "Performance debugging scenarios",
        np: "Performance debugging scenarios",
        jp: "パフォーマンスデバッグの実例",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Interviewers hand you working-but-slow code and watch your diagnostic process more than the final fix. The approach is always the same first step: open React DevTools' Profiler tab (Day 10), record the slow interaction, and see exactly which components re-rendered and why — never guess before you've looked.\n\n<b>Scenario 1 — a list re-renders entirely on every keystroke of an unrelated search box.</b>\nThe Profiler shows every row flashing on each keystroke even though the rows' own data hasn't changed. Diagnosis: the list and the search input share a parent, so typing re-renders the parent, which re-renders every row by default. Fix: wrap the row component in `React.memo` (Day 10), and check the parent isn't creating a new inline array/object prop each render that would defeat the memo.\n\n<b>Scenario 2 — a component recalculates an expensive derived value on every render.</b>\nThe Profiler shows a long render duration on a component even when the specific prop that value depends on didn't change — e.g. filtering or sorting a large array inline in the component body, on every render, including renders triggered by unrelated state (a modal opening, a theme toggle). Fix: wrap the calculation in `useMemo` with the correct dependency array, so it only re-runs when its actual inputs change.\n\n<b>Scenario 3 — a context provider's value object is recreated every render, so every consumer re-renders.</b>\nThe Profiler shows components scattered across the tree re-rendering together even though they read unrelated pieces of context. Diagnosis: the Provider passes `value={{ user, theme, setTheme }}` — a brand-new object every render, which React treats as \"changed\" for every consumer via reference equality. Fix: memoize the value object with `useMemo`, or — better for scale — split one large context into smaller, independently-updating contexts (Day 9/13) so unrelated state doesn't fan out.",
            np: "Interviewer ले काम गर्ने तर ढिलो code दिन्छ — पहिलो step सधैं Profiler tab खोली कुन component किन re-render भयो हेर्ने हो, अड्कल नगर्ने। Scenario 1: unrelated search box मा list पूरै re-render — memo + referential equality fix। Scenario 2: expensive derived value हरेक render मा recalculate — useMemo fix। Scenario 3: context value object हरेक render मा नयाँ — सबै consumer re-render, memoize वा context split fix।",
            jp: "面接官は動くが遅いコードを渡し、最終的な修正より診断プロセスを見ます。まずProfilerタブで何が・なぜ再レンダーしたか確認するのが常に第一歩です。シナリオ1：無関係な検索ボックスでリスト全体が再レンダー→memoと参照等価性で解決。シナリオ2：毎回高コストな導出値を再計算→useMemoで解決。シナリオ3：contextの値オブジェクトが毎回新規作成され全consumerが再レンダー→memo化またはcontext分割で解決。",
          },
        },
      ],
    },
    {
      title: {
        en: "System design for frontend",
        np: "Frontend system design",
        jp: "フロントエンド設計面接",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Frontend system design (\"design a Twitter feed\", \"design a real-time chat UI\") is a lighter-weight cousin of backend system design — there's no single correct architecture, and you're scored on structured thinking, not a memorized diagram. Analogy: it's an open-ended design review, not a written exam — the interviewer wants to see your reasoning surface, not just your final answer.\n\n<b>The shape of a strong answer, in order:</b>\n• <b>Component breakdown</b> — sketch the tree out loud: `FeedPage` → `FeedList` → `PostCard` → smaller presentational pieces (Day 12's Smart/Presentational split)\n• <b>State ownership</b> — separate what's local UI state (a like button's optimistic toggle), what's server state cached via TanStack Query (the feed itself, Day 19/21), and what's true global client state (current user, unread count — Zustand, Day 19)\n• <b>Data fetching and caching strategy</b> — cursor-based pagination for an infinite feed, cache invalidation when a new post is created, optimistic updates for likes and replies (Day 21)\n• <b>Handling real-time updates</b> — name the trade-off out loud: WebSockets give immediacy at the cost of connection-management complexity; polling is simpler to implement and reason about but adds latency and wasted requests. Picking either is fine — not naming the trade-off is the mistake\n• <b>Pagination / infinite scroll</b> — mention `IntersectionObserver` or a \"load more\" sentinel, and how it composes with TanStack Query's `useInfiniteQuery`\n• <b>How deep to go</b> — in a 20-30 minute conversation, you won't reach implementation code. Spend most of your time on component breakdown and state ownership (the parts that reveal how you think), and only go one level deeper on whichever area the interviewer leans into with follow-up questions",
            np: "Frontend system design ('design a Twitter feed', 'design a chat UI') मा एउटै सही जवाफ हुँदैन — structured thinking नै score हुन्छ। क्रम: component breakdown → state ownership (local/server/global) → data fetching/caching strategy → real-time updates को trade-off (websockets vs polling) बोल्ने → pagination/infinite scroll → समय सीमित भएकोले component breakdown र state ownership मा बढी समय दिने, interviewer ले खोतार्दा मात्र गहिरो जाने।",
            jp: "フロントエンド設計（「Twitterフィードを設計して」等）には唯一の正解はなく、構造的思考が評価されます。順序：コンポーネント構造→状態の所有権（local/server/global）→データ取得・キャッシュ戦略→リアルタイム更新のトレードオフ（WebSocket vs ポーリング）を言語化→ページネーション/無限スクロール→時間が限られるためコンポーネント構造と状態配置に重点を置き、面接官が深掘りする部分のみさらに詳しく。",
          },
        },
      ],
    },
    {
      title: {
        en: "Real-world debugging exercises",
        np: "Real-world debugging exercises",
        jp: "実務デバッグ演習",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "This style of exercise hands you a vague bug report — \"users say the cart total is sometimes stale\" — and evaluates your process: can you reproduce it, isolate the cause, fix it, and verify the fix, all under a timer, without anyone giving you a hint. Analogy: it's a doctor's differential diagnosis, not an open-book exam — the symptom rarely names the disease.\n\n<b>A structured approach that works under pressure:</b>\n• <b>Reproduce first</b> — vague words like \"sometimes\" are a clue; ask what action precedes it (rapid clicks, fast navigation, a specific input)\n• <b>Isolate</b> — narrow to the smallest piece of code that could cause it (a stale closure, a missing effect dependency, a race condition between two async calls)\n• <b>Fix</b> — apply the smallest correct change, not a rewrite\n• <b>Verify</b> — deliberately re-trigger the original repro steps and confirm the bug is actually gone, not just \"probably fixed\"\n\n<b>The best way to practice this without a real interview lined up:</b> intentionally break one of your own earlier project days — comment out a `clearTimeout`, remove a `key`, drop a `useEffect` dependency, swap a functional updater back to a stale closure — then set a 10-minute timer and fix it using only the four-step process above. Debugging your own past code under a clock is the closest realistic simulation of this interview format.",
            np: "यस प्रकारको exercise मा अस्पष्ट bug report दिइन्छ ('कहिलेकाहीँ cart total stale देखिन्छ') — reproduce → isolate → fix → verify, यही चार-step process clock मुनि चलाउने क्षमता जाँचिन्छ। अभ्यास गर्ने उत्तम तरिका: आफ्नै पुरानो project day मा जानाजान bug हाल्नुहोस् (clearTimeout हटाउने, key हटाउने, useEffect dependency छुटाउने) र 10 मिनेटको timer राखी माथिकै 4-step process ले fix गर्नुहोस्।",
            jp: "この形式の演習は「カート合計が時々古い値になる」といった曖昧なバグ報告を渡し、再現→切り分け→修正→検証という4ステップをタイマー下で実行できるかを見ます。実戦練習の最良の方法は、自分の過去のプロジェクトに意図的にバグを仕込み（clearTimeoutを消す、keyを外す、useEffectの依存を落とす等）、10分タイマーで上記の4ステップだけを使って直すことです。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How much internals knowledge (Fiber, reconciliation) do I actually need?",
        np: "Fiber, reconciliation जस्ता internals ज्ञान वास्तवमा कति चाहिन्छ?",
        jp: "Fiber や reconciliation などの内部知識はどれくらい必要？",
      },
      answer: {
        en: "Enough to explain the mental model in plain language — what the Virtual DOM is for, what reconciliation does, why keys matter, and roughly what happens when you call `setState` (Day 13). You do not need to recite the Fiber data structure's internal fields or React's source code. Mid-level interviews stop at \"explain the concept clearly\"; only deep infra/framework-team roles go further than that.",
        np: "Virtual DOM किन चाहियो, reconciliation ले के गर्छ, keys किन महत्त्वपूर्ण छ, र setState कल गर्दा roughly के हुन्छ (Day 13) — यति plain भाषामा भन्न सके पुग्छ। Fiber को internal fields वा React source code cram गर्नु पर्दैन।",
        jp: "Virtual DOM の目的、reconciliation の役割、key の重要性、setState 呼び出し時に何が起きるか（Day 13）を平易な言葉で説明できれば十分です。Fiber の内部フィールドや React のソースコードを暗記する必要はありません。",
      },
    },
    {
      question: {
        en: "Should I memorize algorithms too, or is React-specific prep enough?",
        np: "Algorithms पनि memorize गर्नुपर्छ, कि React-specific prep मात्र पुग्छ?",
        jp: "アルゴリズムも暗記すべき？それとも React 対策だけで十分？",
      },
      answer: {
        en: "Depends on the company and role. Startups and product-focused frontend roles usually skip DSA entirely and go straight to React coding/machine coding rounds. Larger companies (especially FAANG-adjacent) often still include one general algorithms round alongside the React-specific rounds. Check the interview process description or ask your recruiter directly — don't guess and over-prepare the wrong track.",
        np: "Company र role अनुसार फरक पर्छ। Startups ले सामान्यतया DSA छाडेर सिधै React coding/machine coding round मा जान्छन्। ठूला companies (FAANG-adjacent) मा React-specific round सँगै एउटा general algorithms round पनि हुन सक्छ। Recruiter सँग सोधेर पक्का गर्नुहोस्।",
        jp: "会社や職種によります。スタートアップやプロダクト中心のフロントエンド職では通常DSAは省かれ、React特有のコーディング/機械式コーディングに直行します。大企業（FAANG系）ではReact特有のラウンドに加え一般的なアルゴリズムラウンドが含まれることもあります。推測せずリクルーターに確認しましょう。",
      },
    },
    {
      question: {
        en: "What's the actual difference between a machine coding round and a system design round?",
        np: "Machine coding round र system design round मा वास्तविक फरक के हो?",
        jp: "機械式コーディングラウンドとシステム設計ラウンドの実際の違いは？",
      },
      answer: {
        en: "Machine coding is hands-on — you write real, running code for 45-90 minutes and the interviewer evaluates the actual result (does it work, is it structured, does it handle edge cases). System design is a whiteboard/verbal conversation — you rarely write more than pseudocode or a diagram, and you're evaluated on how you reason about trade-offs, not on producing working software.",
        np: "Machine coding = hands-on — 45-90 मिनेट वास्तविक चल्ने code लेखिन्छ, नतिजा (काम गर्छ, structured छ, edge cases handle गर्छ) मूल्याङ्कन हुन्छ। System design = whiteboard/verbal छलफल — pseudocode/diagram भन्दा बढी code लेखिँदैन, trade-offs बारे सोचाइ नै मूल्याङ्कन हुन्छ।",
        jp: "機械式コーディングは実践型 — 45〜90分実際に動くコードを書き、結果（動作するか、構造化されているか、エッジケースを扱えるか）が評価されます。システム設計はホワイトボード/口頭での議論 — 疑似コードや図以上のコードはほぼ書かず、トレードオフの考え方が評価されます。",
      },
    },
    {
      question: {
        en: "What if the interviewer asks about a library or pattern I haven't personally used?",
        np: "Interviewer ले मैले प्रयोग नगरेको library/pattern बारे सोध्यो भने के गर्ने?",
        jp: "使ったことのないライブラリやパターンについて聞かれたらどうする？",
      },
      answer: {
        en: "Say so plainly, then reason from what you do know — \"I haven't used Recoil directly, but I've used Zustand and Context (Day 9/19), and based on that I'd expect Recoil's atoms to work like...\". Interviewers consistently rate honest reasoning-from-first-principles higher than a guess dressed up as confident knowledge — the second one falls apart the moment they ask one follow-up question.",
        np: "स्पष्टसँग भन्नुहोस् कि प्रयोग गरेको छैन, अनि जानेको कुराबाट reason गर्नुहोस् — जस्तै 'Recoil प्रयोग गरेको छैन, तर Zustand र Context (Day 9/19) प्रयोग गरेको छु, त्यसैको आधारमा...' Interviewers ले confident देखिने अड्कलभन्दा honest first-principles reasoning लाई बढी मूल्याङ्कन गर्छन्।",
        jp: "使ったことがないと正直に伝え、知っている知識から推論しましょう（例：「Recoilは使ったことがありませんが、ZustandとContext（Day 9/19）の経験から推測すると…」）。面接官は自信ありげな当てずっぽうより、正直な第一原理からの推論を高く評価します。",
      },
    },
  ],
};
