import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_1_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 1 sets expectations: what you should already know, what React is for, and how to run a tiny app in the browser. You will not master every API today — the goal is a clear mental model and a working `Hello React` on your machine.",
      np: "दिन १ ले अपेक्षा सेट गर्छ: तपाईंले पहिले नै जान्नुपर्ने, React किन, र ब्राउजरमा सानो एप कसरी चलाउने। आज सबै API मास्टर गर्ने होइन — स्पष्ट मानसिक मोडेल र काम गर्ने `Hello React`।",
      jp: "1日目は前提・Reactの役割・ブラウザで最小アプリを動かす流れを押さえます。今日ですべてのAPIを覚える必要はなく、心の模型と動く Hello を目標にします。",
    },
    {
      en: "Keep Node LTS installed, use any modern editor (VS Code is common), and follow along in a fresh Vite + React project or Create React App if your course uses it — the ideas transfer either way.",
      np: "Node LTS राख्नुहोस्, आधुनिक सम्पादक प्रयोग गर्नुहोस्, र Vite + React वा तपाईंको पाठ्यक्रमले प्रयोग गर्ने CRA मा अनुसरण गर्नुहोस् — विचार दुवैमा उस्तै।",
      jp: "Node LTS と好きなエディタ（VS Code が多い）を用意し、Vite + React か教材が使うテンプレートで手を動かしてください。考え方は共通です。",
    },
  ],
  sections: [
    {
      title: {
        en: "Prerequisites",
        np: "पूर्वआवश्यकताहरू",
        jp: "前提知識",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "You should be comfortable in HTML, CSS, and JavaScript (ES2015+) — especially `let`/`const`, arrow functions, modules (`import`/`export`), and template literals. TypeScript is optional for this day but pairs well with React later.",
            np: "HTML, CSS, र JavaScript (ES2015+) मा सहज हुनुहोस् — `let`/`const`, arrow, `import`/`export`, template literal। TypeScript वैकल्पिक तर पछि राम्रो जोडा।",
            jp: "HTML・CSS・JavaScript（ES2015+） に慣れていること（`let`/`const`、アロー関数、`import`/`export`、テンプレートリテラル）。TypeScript は任意ですが後で相性が良いです。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Node.js (LTS) — ships `npm` / `npx` so you can scaffold and run dev servers.",
              np: "Node.js (LTS) — `npm` / `npx` सहित scaffold र dev server।",
              jp: "Node.js（LTS） — `npm` / `npx` でプロジェクト作成と開発サーバー起動。",
            },
            {
              en: "A code editor with syntax highlighting and a terminal pane (VS Code, WebStorm, etc.).",
              np: "सम्पादक — syntax highlighting र टर्मिनल (VS Code, WebStorm)।",
              jp: "エディタ — シンタックスハイライトとターミナル（VS Code など）。",
            },
            {
              en: "Git basics — clone, commit, branch — so you can save checkpoints as you experiment.",
              np: "Git आधार — clone, commit, branch — प्रयोग गर्दा checkpoint।",
              jp: "Git の基本 — clone / commit / branch で試行のチェックポイントを残す。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "What is React?",
        np: "React के हो?",
        jp: "React とは？",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React is a JavaScript library for building user interfaces from reusable pieces called components. You describe *what* the UI should look like for a given state; React figures out efficient updates to the real DOM.",
            np: "React प्रयोगकर्ता इन्टरफेस बनाउने JavaScript लाइब्रेरी हो — कम्पोनेन्ट भनिने पुन: प्रयोग योग्य टुक्राहरूबाट। अवस्थाको लागि UI कस्तो हुनुपर्छ वर्णन गर्नुहोस्; React ले DOM अद्यावधिक कुशलतापूर्वक गर्छ।",
            jp: "React は コンポーネント と呼ぶ部品から ユーザーインターフェース を組み立てる JavaScript ライブラリです。ある状態に対して UI をどう見せるかを宣言すると、React が実 DOM への効率的な更新を担います。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Declarative — you write UI as a function of data instead of manually mutating the DOM.",
              np: "घोषणात्मक — DOM हातले मेटाउनुको सट्टा डाटाको फंक्शनको रूपमा UI।",
              jp: "宣言的 — DOM を直接いじるより、データの関数として UI を書く。",
            },
            {
              en: "Component model — small units compose into screens; props flow down, events bubble up.",
              np: "कम्पोनेन्ट मोडेल — साना एकाइहरूले स्क्रिन बनाउँछन्; props तल, घटना माथि।",
              jp: "コンポーネント — 小さな単位が画面を構成。props は下へ、イベントは上へ。",
            },
            {
              en: "Ecosystem — routing, data fetching, styling, and forms are usually solved with companion libraries (React Router, TanStack Query, etc.).",
              np: "इकोसिस्टम — routing, data fetching, styling साथी लाइब्रेरीले (React Router, TanStack Query)।",
              jp: "エコシステム — ルーティングや取得・スタイルは別ライブラリで補うのが一般的。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Minimal example — root + component",
        np: "न्यूनतम उदाहरण — root + कम्पोनेन्ट",
        jp: "最小例 — root とコンポーネント",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Modern apps call `createRoot` from `react-dom/client`, pass a DOM node, then `render` a React element tree. Your root component is often named `App`.",
            np: "आधुनिक एपले `createRoot` (`react-dom/client`) प्रयोग गर्छ, DOM node दिन्छ, अनि `render` ले React element रूख। जरा कम्पोनेन्ट प्रायः `App`।",
            jp: "最近は `react-dom/client` の `createRoot` に DOM ノードを渡し、`render` で要素ツリーを描画します。ルートは多く `App` です。",
          },
        },
        {
          type: "code",
          title: {
            en: "main.jsx — entry file (Vite-style)",
            np: "main.jsx — प्रवेश फाइल (Vite-शैली)",
            jp: "main.jsx — エントリ（Vite 想定）",
          },
          code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`,
        },
        {
          type: "code",
          title: {
            en: "App.jsx — your first component",
            np: "App.jsx — तपाईंको पहिलो कम्पोनेन्ट",
            jp: "App.jsx — 最初のコンポーネント",
          },
          code: `function App() {
  const title = "Hello, React";

  return (
    <main>
      <h1>{title}</h1>
      <p>Edit App.jsx and save — Fast Refresh updates the browser.</p>
    </main>
  );
}

export default App;`,
        },
        {
          type: "paragraph",
          text: {
            en: "JSX looks like HTML in JavaScript but compiles to `React.createElement` calls. Curly braces `{title}` embed JavaScript expressions inside markup.",
            np: "JSX JavaScript भित्र HTML जस्तो देखिन्छ तर `React.createElement` मा कम्पाइल हुन्छ। `{title}` ले अभिव्यक्ति हाल्छ।",
            jp: "JSX は HTML に似た構文ですが `React.createElement` に変換されます。`{title}` で式を埋め込みます。",
          },
        },
      ],
    },
    {
      title: {
        en: "How updates flow (mental model)",
        np: "अद्यावधिक कसरी बग्छ (मानसिक मोडेल)",
        jp: "更新の流れ（心の模型）",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "State or props change on a component.",
              np: "कम्पोनेन्टमा state वा props बदलिन्छ।",
              jp: "コンポーネントの state または props が変わる。",
            },
            {
              en: "React re-runs your component function (or class render) to compute the next UI description.",
              np: "React ले कम्पोनेन्ट फंक्फन फेरि चलाउँछ — अर्को UI वर्णन।",
              jp: "React が関数を再実行し、次の UI 記述を求める。",
            },
            {
              en: "React reconciles with the previous tree and updates only what changed in the real DOM.",
              np: "React ले अघिल्लो रूखसँग मिलाउँछ र वास्तविक DOM मा परिवर्तन मात्र अद्यावधिक गर्छ।",
              jp: "差分を取り、実 DOM は必要な部分だけ更新される。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is JSX?",
        np: "JSX के हो?",
        jp: "JSX とは？",
      },
      answer: {
        en: "A syntax extension that lets you write tree-shaped UI next to JavaScript. The build tool (Vite, Babel, etc.) transforms JSX into plain function calls the browser can run.",
        np: "वाक्य विस्तार जसले UI रूख JavaScript नजिक लेख्न दिन्छ। build उपकरणले JSX ले सादा फंक्फन कलमा बदल्छ।",
        jp: "JavaScript の横に木構造の UI を書くための構文拡張です。Vite / Babel などがブラウザで動く関数呼び出しに変換します。",
      },
    },
    {
      question: {
        en: "Why does React use a virtual tree instead of touching the DOM directly every time?",
        np: "React ले हरेक पटक सिधै DOM किन छोड्दैन?",
        jp: "毎回 DOM を直接触らないのはなぜ？",
      },
      answer: {
        en: "Batching and diffing many small reads/writes on the real DOM is slow. React computes the next tree in memory, diffs against the last render, and applies a minimal patch — fewer layout thrashes and clearer component logic.",
        np: "धेरै साना DOM पढाइ/लेखाइ ढिलो। React ले स्मृतिमा अर्को रूख गन्छ, अन्तर गर्छ, न्यून patch लगाउँछ — कम layout thrash, स्पष्ट तर्क।",
        jp: "細かい DOM 操作のたびにレイアウトが走ると遅いため、メモリ上で次ツリーを作り差分だけ実 DOM に反映します。",
      },
    },
    {
      question: {
        en: "What is `StrictMode` and should I keep it?",
        np: "`StrictMode` के हो, राख्ने?",
        jp: "`StrictMode` とは？外していい？",
      },
      answer: {
        en: "A development-only wrapper that double-invokes some lifecycles and warns about unsafe patterns so you catch bugs early. Keep it in dev; it does not affect production bundle behavior beyond helping you write safer code.",
        np: "विकास-मात्र wrapper जसले केही lifecycle दुई पटक चलाउँछ। dev मा राख्नुहोस्; production मा असुरक्षित ढाँचा चाँडो समात्न मद्दत।",
        jp: "開発時に厳しめのチェックをしてくれるラッパーです。開発では残すのがおすすめです。",
      },
    },
    {
      question: {
        en: "What is the difference between React and React DOM?",
        np: "React र React DOM मा के फरक?",
        jp: "React と React DOM の違いは？",
      },
      answer: {
        en: "`react` owns components, state, and reconciliation. `react-dom` bridges that model to browser DOM nodes (`createRoot`, `render`, event delegation). Other renderers exist (e.g. React Native for mobile).",
        np: "`react` ले कम्पोनेन्ट, state, reconciliation। `react-dom` ले ब्राउजर DOM (`createRoot`, `render`) जोड्छ। अन्य renderer (React Native) पनि।",
        jp: "`react` がコンポーネントと調停、`react-dom` がブラウザ DOM との橋渡しです。",
      },
    },
    {
      question: {
        en: "Can I learn React without npm?",
        np: "npm बिना React सिक्न मिल्छ?",
        jp: "npm なしで学べる？",
      },
      answer: {
        en: "For serious projects you will use a package manager. For quick experiments, online playgrounds (StackBlitz, CodeSandbox) hide tooling — but locally, `npm create vite@latest` is the common path.",
        np: "गम्भीर परियोजनामा package manager चाहिन्छ। अनलाइन playground ले उपकरण लुकाउँछ; स्थानीयमा `npm create vite@latest` सामान्य।",
        jp: "本番寄りではパッケージマネージャが前提です。手元では Vite などのスキャフォールドが一般的です。",
      },
    },
    {
      question: {
        en: "Is React a framework?",
        np: "React फ्रेमवर्क हो?",
        jp: "React はフレームワーク？",
      },
      answer: {
        en: "Officially it is a library focused on UI. In practice teams add routing, data, and build tooling — so it feels framework-sized. Next.js is closer to a full framework built on React.",
        np: "आधिकारिक रूपमा लाइब्रेरी UI केन्द्रित। व्यवहारमा routing, data, build थपिन्छ — फ्रेमवर्क जस्तो। Next.js React माथि पूर्ण फ्रेमवर्क नजिक।",
        jp: "公式には UI に特化したライブラリ。ルーティング等を足すとフレームワーク級になります。",
      },
    },
    {
      question: {
        en: "What are props (preview for the next lessons)?",
        np: "props के हुन् (अर्को पाठको पूर्वावलोकन)?",
        jp: "props とは（次のレッスンの予告）？",
      },
      answer: {
        en: "Props (short for properties) are read-only inputs passed from a parent component to a child. They let you reuse the same component with different data — think function arguments for UI.",
        np: "Props अभिभावकबाट सन्तानमा पढाइ-मात्र इनपुट। फरक डाटासँग पुन: प्रयोग — UI को फंक्फन तर्क।",
        jp: "props は親から子へ渡す読み取り専用の入力で、同じ部品を別データで再利用するためのものです。",
      },
    },
    {
      question: {
        en: "Why do I see the app twice in development sometimes?",
        np: "विकासमा एप दुई पटक किन देखिन्छ?",
        jp: "開発で二重に見えることがあるのは？",
      },
      answer: {
        en: "`StrictMode` intentionally double-invokes render paths in development to surface side effects. Remove `StrictMode` only if you understand the trade-off — do not silence warnings just to hide duplicate logs.",
        np: "`StrictMode` ले dev मा जानाजानी दुई पटक चलाउँछ। side effect देखाउन। बुझेर मात्र हटाउनुहोस्।",
        jp: "`StrictMode` が開発時に意図的に二重実行することがあります。警告を消す目的で安易に外さないでください。",
      },
    },
    {
      question: {
        en: "Where should I put side effects like `fetch` or timers?",
        np: "`fetch` वा timer जस्ता side effect कहाँ?",
        jp: "`fetch` やタイマーはどこに？",
      },
      answer: {
        en: "Not inside the render body of a component — that would run unpredictably. Day 1 stops at the model; later you will use `useEffect` (or newer data APIs) with clear dependency lists.",
        np: "render शरीरभित्र होइन — अनियमित चल्छ। आज मोडेल मात्र; पछि `useEffect` (वा नयाँ data API) निर्भरता सूचीसहित।",
        jp: "レンダー関数の本体に直接書かないのが原則です。後のレッスンで `useEffect` などを学びます。",
      },
    },
    {
      question: {
        en: "How do I create a new project today?",
        np: "आज नयाँ परियोजना कसरी बनाउने?",
        jp: "今日どうやって新規プロジェクトを作る？",
      },
      answer: {
        en: "Run `npm create vite@latest my-app -- --template react` (or `react-ts`), `cd my-app`, `npm install`, `npm run dev`. CRA is legacy for new work — prefer Vite or a framework starter your team standardizes on.",
        np: "`npm create vite@latest my-app -- --template react`, `cd`, `npm install`, `npm run dev`। CRA पुरानो — Vite रोज्नुहोस्।",
        jp: "`npm create vite@latest` で React テンプレートを選び、`npm run dev`。新規は Vite 系が一般的です。",
      },
    },
  ],
  bullets: [
    {
      en: "Scaffold a Vite React app, run dev, and change `App.jsx` while watching Fast Refresh.",
      np: "Vite React एप बनाउनुहोस्, dev चलाउनुहोस्, `App.jsx` बदल्दै Fast Refresh हेर्नुहोस्।",
      jp: "Vite で React を作り、保存しながら Fast Refresh を確認する。",
    },
    {
      en: "Draw a quick diagram: state change → re-render → DOM patch.",
      np: "चित्र: state बदलाव → re-render → DOM patch।",
      jp: "state → 再レンダー → DOM 更新の図を手で描く。",
    },
  ],
};
