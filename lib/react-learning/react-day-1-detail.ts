import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_1_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "React is a JavaScript library for building UIs from small, reusable pieces called <b>components</b>.\n\nThink of it like LEGO — each block (component) does one thing, and you stack them to build anything. React handles updating the screen when data changes, so you never manually touch the DOM.\n\nWhy React over plain HTML + JS?\n• <b>Reusable pieces</b> — write a `Button` once, use it 100 times\n• <b>Automatic updates</b> — change your data, React updates the UI for you\n• <b>Huge ecosystem</b> — routing, forms, animations — there's a library for everything",
      np: "React component भन्ने साना टुक्राबाट UI बनाउने JavaScript library हो। LEGO जस्तै — एउटा block एक काम, थुपारेर जे पनि बन्छ।",
      jp: "React はコンポーネントから UI を組み立てる JS ライブラリ。LEGO のように再利用できる部品を積み上げます。",
    },
    {
      en: "In Day 1 we cover:\n• Creating a React project with <b>Vite</b> (the modern build tool)\n• Writing your first functional component\n• Understanding <b>JSX</b> — the HTML-inside-JavaScript syntax\n• Passing data into components with <b>props</b>\n• How React renders to the real DOM",
      np: "Day 1 मा: Vite project, functional component, JSX, props, र DOM rendering।",
      jp: "Day 1: Vite でプロジェクト作成、関数コンポーネント、JSX、props、DOM レンダリングを学びます。",
    },
  ],
  sections: [
    {
      title: { en: "What is React and why use it", np: "React के हो र किन प्रयोग गर्ने", jp: "React とは何か・なぜ使うか" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "There are two ways to build UIs: <b>imperative</b> and <b>declarative</b>.\n\n• <b>Imperative</b> — you give step-by-step instructions: \"find the button, change its colour, find the counter, add 1 to it\"\n  ↳ Like giving someone turn-by-turn driving directions\n• <b>Declarative</b> — you describe the end result: \"the counter shows the current count, the button is blue when active\"\n  ↳ Like telling a GPS your destination and letting it figure out the route\n\nReact is declarative. You describe WHAT the UI should look like for a given state. React figures out HOW to update the DOM efficiently.",
            np: "Imperative = step-by-step निर्देशन। Declarative = अन्तिम अवस्था वर्णन। React declarative छ।",
            jp: "命令型（手順指示）と宣言型（結果記述）の違い。React は宣言型で、状態に応じた UI を記述するだけです。",
          },
        },
        {
          type: "code",
          title: { en: "Imperative (vanilla JS) vs Declarative (React)", np: "Imperative vs Declarative", jp: "命令型 vs 宣言型" },
          code: `// ❌ Imperative — manually tell the DOM what to do
const btn = document.getElementById('like-btn');
btn.addEventListener('click', () => {
  const count = parseInt(btn.textContent);
  btn.textContent = count + 1;
  if (count + 1 > 0) btn.classList.add('liked');
});

// ✅ Declarative — describe what the UI looks like
function LikeButton() {
  const [likes, setLikes] = React.useState(0);
  return (
    <button
      className={likes > 0 ? 'liked' : ''}
      onClick={() => setLikes(likes + 1)}
    >
      {likes}
    </button>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "The <b>virtual DOM</b> is React's secret weapon for performance. Instead of updating the real browser DOM on every change (slow), React:\n1. Keeps a lightweight copy of the DOM in memory (the virtual DOM)\n2. When state changes, creates a new virtual DOM copy\n3. Compares old vs new (called <b>diffing</b>)\n4. Only updates the real DOM where things actually changed\n\nResult: your UI stays fast even with hundreds of components updating.",
            np: "Virtual DOM = memory मा lightweight DOM copy। React diff गरेर real DOM मा minimum update गर्छ।",
            jp: "仮想 DOM はメモリ上の軽量コピー。変更前後を比較し、必要な部分だけ実 DOM を更新します。",
          },
        },
      ],
    },
    {
      title: { en: "Creating a project with Vite", np: "Vite सँग project बनाउने", jp: "Vite でプロジェクト作成" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Vite</b> is a modern build tool that makes React development blazing fast. Think of it as the engine under the hood — it serves your files to the browser during development and bundles them for production.\n\nWhy Vite over the old Create React App?\n• Starts in under 1 second (CRA can take 30s+)\n• Hot reloads changes instantly (no full page refresh)\n• Much smaller and simpler configuration",
            np: "Vite = तीव्र build tool। CRA भन्दा 30x छिटो start। Hot reload instant।",
            jp: "Vite は超高速ビルドツール。CRA より起動が速く、変更即反映の HMR が強力です。",
          },
        },
        {
          type: "code",
          title: { en: "Create a new React project with Vite", np: "Vite सँग नयाँ React project", jp: "Vite で React プロジェクト作成" },
          code: `# Create a new project (run in your terminal)
npm create vite@latest my-app -- --template react

# Navigate into the project folder
cd my-app

# Install dependencies
npm install

# Start the dev server
npm run dev

# Your app is now running at http://localhost:5173`,
        },
        {
          type: "paragraph",
          text: {
            en: "After running those commands, your project folder looks like this:\n\n• `index.html` — the single HTML file your browser loads\n  ↳ Has a `<div id=\"root\">` — React mounts your entire app here\n• `src/main.jsx` — the entry point; connects React to the DOM\n• `src/App.jsx` — your root component (start editing here)\n• `src/App.css` — styles for App\n• `public/` — static assets (images, fonts) that are served as-is\n• `vite.config.js` — Vite configuration (you rarely need to touch this)",
            np: "index.html (root div), src/main.jsx (entry), src/App.jsx (root component) — project structure।",
            jp: "index.html（root div）、src/main.jsx（エントリ）、src/App.jsx（ルートコンポーネント）が主な構成。",
          },
        },
      ],
    },
    {
      title: { en: "JSX — JavaScript + HTML together", np: "JSX — JavaScript + HTML सँगै", jp: "JSX — JS と HTML を一緒に" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>JSX</b> (JavaScript XML) lets you write HTML-like syntax inside JavaScript. It looks like HTML but it's not — it compiles to `React.createElement()` calls. Think of JSX as a shorthand notation, like how `5 + 3` is shorthand for \"add five and three.\"\n\nJSX rules you must know:\n• Must return <b>one root element</b> — wrap in `<div>` or `<>` (empty fragment)\n• Use `<b>className</b>` instead of `class` (class is a JS keyword)\n• Use `<b>htmlFor</b>` instead of `for` on labels\n• JavaScript expressions go inside <b>curly braces</b> `{}`\n• <b>Self-close</b> tags that have no children: `<img />`, `<br />`",
            np: "JSX = HTML-like syntax JavaScript भित्र। className, htmlFor, {} expressions, self-closing tags।",
            jp: "JSX は JS 内に HTML 的な記法を書ける構文。className・htmlFor・{式}・自己閉じタグがポイント。",
          },
        },
        {
          type: "code",
          title: { en: "JSX examples — all the key rules", np: "JSX उदाहरणहरू", jp: "JSX の主なルール例" },
          code: `function UserCard({ name, avatar, isOnline }) {
  const statusText = isOnline ? 'Online' : 'Offline';

  return (
    // One root element — use <> fragment if no wrapper needed
    <div className="card">
      {/* Comments look like this in JSX */}
      <img src={avatar} alt={name} />

      <h2>{name}</h2>

      {/* Expression in JSX */}
      <p>Status: {statusText}</p>

      {/* Inline style is an object, not a string */}
      <span style={{ color: isOnline ? 'green' : 'grey' }}>
        ● {statusText}
      </span>

      {/* Self-closing tag */}
      <hr />
    </div>
  );
}`,
        },
        {
          type: "table",
          caption: {
            en: "HTML vs JSX — key differences to memorize",
            np: "HTML र JSX बीचका फरकहरू",
            jp: "HTML と JSX の主な違い",
          },
          headers: [
            { en: "In HTML", np: "HTML मा", jp: "HTML" },
            { en: "In JSX", np: "JSX मा", jp: "JSX" },
            { en: "Why different", np: "किन फरक", jp: "理由" },
          ],
          rows: [
            [
              { en: "`class=\"btn\"`", np: "`class=\"btn\"`", jp: "`class=\"btn\"`" },
              { en: "`className=\"btn\"`", np: "`className=\"btn\"`", jp: "`className=\"btn\"`" },
              { en: "`class` is a reserved word in JS", np: "class JS keyword", jp: "class は JS の予約語" },
            ],
            [
              { en: "`for=\"name\"`", np: "`for=\"name\"`", jp: "`for=\"name\"`" },
              { en: "`htmlFor=\"name\"`", np: "`htmlFor=\"name\"`", jp: "`htmlFor=\"name\"`" },
              { en: "`for` is a JS keyword (loops)", np: "for JS keyword", jp: "for は JS のループ予約語" },
            ],
            [
              { en: "`onclick=\"fn()\"`", np: "`onclick=\"fn()\"`", jp: "`onclick=\"fn()\"`" },
              { en: "`onClick={fn}`", np: "`onClick={fn}`", jp: "`onClick={fn}`" },
              { en: "Events use camelCase; pass function reference", np: "camelCase, function reference", jp: "camelCase・関数参照を渡す" },
            ],
            [
              { en: "`style=\"color:red\"`", np: "`style=\"color:red\"`", jp: "`style=\"color:red\"`" },
              { en: "`style={{ color: 'red' }}`", np: "`style={{ color: 'red' }}`", jp: "`style={{ color: 'red' }}`" },
              { en: "Style is a JS object, not a string", np: "object, string होइन", jp: "オブジェクトで渡す" },
            ],
            [
              { en: "`<img src=\"x.png\">`", np: "`<img src=\"x.png\">`", jp: "`<img src=\"x.png\">`" },
              { en: "`<img src=\"x.png\" />`", np: "`<img src=\"x.png\" />`", jp: "`<img src=\"x.png\" />`" },
              { en: "All tags must be explicitly closed", np: "सबै tag बन्द हुनुपर्छ", jp: "すべてのタグを明示的に閉じる" },
            ],
          ],
        },
      ],
    },
    {
      title: { en: "Functional components & props", np: "Functional components र props", jp: "関数コンポーネントと props" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>component</b> is just a JavaScript function that returns JSX. That's it.\n\nNaming rule: component names MUST start with a capital letter. `button` is an HTML element. `Button` is your React component.\n\n<b>Props</b> are how you pass data INTO a component — exactly like function arguments. The parent passes props; the child receives them as a single object (usually destructured).\n\n• Props are <b>read-only</b> — the child must never modify them\n  ↳ Think of props as the instruction sheet you hand to a worker — they follow it, they don't rewrite it\n• You can pass any JavaScript value: strings, numbers, booleans, arrays, objects, even functions",
            np: "Component = JSX return गर्ने JS function। Capital letter बाट सुरु। Props = parent बाट child मा data।",
            jp: "コンポーネントは JSX を返す関数。名前は大文字始まり。props は親から子へのデータで読み取り専用。",
          },
        },
        {
          type: "code",
          title: { en: "Components and props in action", np: "Components र props उदाहरण", jp: "コンポーネントと props の例" },
          code: `// A reusable Button component
// Props are destructured from the first argument object
function Button({ label, color = 'blue', onClick }) {
  return (
    <button
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// A Greeting component with a default prop value
function Greeting({ name = 'stranger', age }) {
  return (
    <h1>
      Hello {name}, you are {age} years old!
    </h1>
  );
}

// Using both components in App
function App() {
  return (
    <div>
      <Greeting name="Rajan" age={25} />
      <Greeting /> {/* uses default name="stranger" */}

      <Button
        label="Save"
        color="green"
        onClick={() => alert('Saved!')}
      />
      <Button label="Delete" color="red" onClick={() => {}} />
    </div>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "The special <b>`children`</b> prop lets you nest content inside a component, like HTML:\n\n`<Card><p>Hello inside the card</p></Card>`\n\nInside `Card`, you access the nested content via `{children}`:\n\n`function Card({ children }) { return <div className=\"card\">{children}</div>; }`\n\nThis is how layout components (cards, modals, panels) work — they render whatever you put inside them.",
            np: "children prop = component भित्र nested content। Layout components यसैले काम गर्छन्।",
            jp: "children props でコンポーネント内にコンテンツをネストできます。レイアウト系コンポーネントに便利。",
          },
        },
      ],
    },
    {
      title: { en: "How React renders — the mental model", np: "React कसरी render गर्छ", jp: "React のレンダリングモデル" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Understanding React's render cycle prevents a lot of confusion. Here's exactly what happens:\n\n1. Your `main.jsx` calls `createRoot(document.getElementById('root'))` — finds the `<div id=\"root\">` in index.html\n2. `.render(<App />)` tells React to call the `App` function\n3. React runs `App()`, gets back JSX (a description of the UI)\n4. React converts that JSX into real DOM nodes and inserts them into the `<div id=\"root\">`\n5. When state or props change later, React re-runs the affected component function and updates only what changed",
            np: "createRoot → render → component function call → JSX → real DOM। State बदलिँदा minimum update।",
            jp: "createRoot → render → 関数実行 → JSX → 実 DOM。状態変化時は差分だけ更新されます。",
          },
        },
        {
          type: "code",
          title: { en: "main.jsx — how React connects to the DOM", np: "main.jsx — React र DOM को जोडाइ", jp: "main.jsx — React と DOM の接続" },
          code: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// 1. Find the <div id="root"> in index.html
const rootElement = document.getElementById('root');

// 2. Tell React to "own" that DOM element
const root = createRoot(rootElement);

// 3. Render your App component tree into it
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// StrictMode: development helper that runs components twice
// to catch accidental side effects. Has no effect in production.`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>The component tree</b> — every React app is a tree of components:\n\n• `App` is the root (the trunk)\n• `Header`, `Main`, `Footer` are branches\n• `Button`, `Card`, `Input` are leaves\n\nData flows <b>down</b> (parent passes props to children). Events flow <b>up</b> (child calls a function passed from the parent). This one-way flow makes bugs much easier to trace — you always know where data came from.",
            np: "Component tree: App (root) → branches → leaves। Data नीचे (props), Events माथि (callbacks)।",
            jp: "コンポーネントツリーは木構造。データは下（props）、イベントは上（コールバック）へ流れます。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What exactly is JSX — is it HTML?", np: "JSX ठ्याक्कै के हो?", jp: "JSX とは正確に何ですか？" },
      answer: {
        en: "JSX looks like HTML but it is NOT HTML. It is a syntax extension for JavaScript. Your build tool (Vite) transforms JSX into plain `React.createElement()` function calls that the browser can run. The JSX `<h1>Hello</h1>` becomes `React.createElement('h1', null, 'Hello')`. JSX is just a more readable way to write those function calls.",
        np: "JSX HTML होइन — JavaScript syntax extension हो। Build tool ले `React.createElement()` calls मा convert गर्छ।",
        jp: "JSX は HTML ではなく JS の構文拡張。ビルドツールが `React.createElement()` 呼び出しに変換します。",
      },
    },
    {
      question: { en: "Why not just use HTML directly?", np: "सिधै HTML किन प्रयोग नगर्ने?", jp: "HTML を直接使えばよいのでは？" },
      answer: {
        en: "Plain HTML is static — it cannot update itself when data changes without JavaScript. React (via JSX) lets you express dynamic UIs as a function of data: `UI = f(state)`. When state changes, the UI re-computes automatically. Also, components let you reuse UI pieces — you can't reuse a chunk of HTML without copy-pasting.",
        np: "HTML static छ — data बदलिँदा आफैँ update हुँदैन। React मा UI = f(state) — state बदलिँदा UI automatic update।",
        jp: "HTML は静的で data 変化に自動応答できません。React は UI = f(state) として動的に更新します。",
      },
    },
    {
      question: { en: "What is a component exactly?", np: "Component ठ्याक्कै के हो?", jp: "コンポーネントとは正確に何ですか？" },
      answer: {
        en: "A component is a function (or historically, a class) that: (1) accepts props as input, (2) returns JSX as output. That's it. `function Button(props) { return <button>{props.label}</button>; }` is a complete, valid component. Components compose — you use components inside other components to build complex UIs from simple pieces.",
        np: "Component = props input लिने र JSX output दिने function। Components भित्र components राखेर complex UI बन्छ।",
        jp: "コンポーネントは props を受け取り JSX を返す関数。コンポーネントを組み合わせて複雑な UI を作ります。",
      },
    },
    {
      question: { en: "Can I still use class components?", np: "Class components अझै प्रयोग गर्न मिल्छ?", jp: "クラスコンポーネントはまだ使えますか？" },
      answer: {
        en: "Yes, React still supports class components and has no plans to remove them. But: all modern React code uses functional components + hooks. Class components have more boilerplate, can't use hooks, and are harder to compose. If you're starting new, use function components exclusively. You may encounter class components in older codebases.",
        np: "हो, अझै support गर्छ। तर modern React सबै functional components + hooks प्रयोग गर्छ। New code मा function components मात्र।",
        jp: "まだサポートされていますが、モダンな React は関数コンポーネント + フックが主流です。新規では関数コンポーネントを使いましょう。",
      },
    },
    {
      question: { en: "What is the virtual DOM and do I need to understand it deeply?", np: "Virtual DOM के हो, गहिरो बुझ्न जरुरी छ?", jp: "仮想 DOM は深く理解する必要がありますか？" },
      answer: {
        en: "The virtual DOM is React's internal optimization — it's a lightweight JavaScript object tree that mirrors the real DOM structure. React uses it to batch and minimize real DOM updates. You don't need to understand it deeply to use React effectively. What matters: React is declarative, you describe the UI, React handles efficient updates. The virtual DOM is the implementation detail behind that promise.",
        np: "Virtual DOM = React को internal optimization। গहिरो बुझ्न जरुरी छैन। Declarative UI लेख्नुस् — React ले efficient update handle गर्छ।",
        jp: "仮想 DOM は React の内部最適化。深く理解しなくても React を使えます。宣言的に UI を書けば React が効率よく更新します。",
      },
    },
  ],
};
