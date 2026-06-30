import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_2_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "A well-organized project saves hours of confusion later. React doesn't enforce a folder structure — you decide. But there are proven patterns that scale.\n\nAnalogy: organizing a project is like setting up a kitchen. You can throw everything in one drawer, but you'll waste time searching. Put knives in one place, spices on one shelf — and everything is findable in seconds.\n\nThe same principle applies to code: components in `components/`, utilities in `utils/`, data-fetching logic in `hooks/` or `services/`.",
      np: "React folder structure enforce गर्दैन। तर proven patterns छन्। Kitchen जस्तै — सबै एक drawer मा राख्न सकिन्छ, तर खोज्न समय लाग्छ।",
      jp: "React はフォルダ構成を強制しません。キッチンの整理と同じ — 場所を決めると探す時間が減ります。",
    },
    {
      en: "In Day 2 we cover:\n• <b>ES module imports and exports</b> — named vs default\n• <b>Organizing component files</b> — flat vs feature-based layouts\n• <b>The entry chain</b> — index.html → main.jsx → App.jsx\n• <b>Path aliases</b> — replacing `../../components/Button` with `@/components/Button`\n• <b>React DevTools</b> — inspecting your component tree and debugging re-renders",
      np: "Day 2 मा: ES modules, file organization, entry chain, path aliases, React DevTools।",
      jp: "Day 2: ES モジュール、ファイル構成、エントリーチェーン、パスエイリアス、React DevTools を学びます。",
    },
  ],
  sections: [
    {
      title: { en: "ES Modules — import and export", np: "ES Modules — import र export", jp: "ES モジュール — import と export" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>ES Modules</b> are JavaScript's built-in system for splitting code across files. Before modules, JavaScript had no official way to share code between files — everything was global and messy. Modules fix that.\n\nThere are two export styles:\n• <b>Default export</b> — one per file, imported with any name you choose\n  ↳ Use for the main thing a file provides (usually a component)\n• <b>Named export</b> — multiple per file, imported by exact name\n  ↳ Use for utilities, hooks, constants, types\n\nRule of thumb: components → default export. Utilities and hooks → named exports.",
            np: "ES Modules = JavaScript को code-sharing system। Default export (एक per file) vs Named export (धेरै per file)।",
            jp: "ES モジュールは JS の公式コード共有システム。デフォルト（1 つ）vs 名前付き（複数）。",
          },
        },
        {
          type: "code",
          title: { en: "Named vs default exports and imports", np: "Named vs default export/import", jp: "名前付き vs デフォルトのエクスポート" },
          code: `// ─── src/components/Button.jsx ───────────────────────────
// Default export — one main thing from this file
export default function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

// ─── src/utils/format.js ──────────────────────────────────
// Named exports — multiple utilities from one file
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const MAX_ITEMS = 100;

// ─── src/App.jsx ──────────────────────────────────────────
// Importing a default export (you name it yourself)
import Button from './components/Button';

// Importing named exports (must match exact name)
import { formatDate, capitalize, MAX_ITEMS } from './utils/format';

// Rename on import with 'as'
import { formatDate as fmtDate } from './utils/format';`,
        },
        {
          type: "paragraph",
          text: {
            en: "Common import/export mistakes:\n• Mixing up default and named imports — `import { Button }` when Button is a default export gives `undefined`\n• Forgetting the curly braces for named imports\n• Circular imports (A imports B, B imports A) — causes bugs at runtime\n\n<b>Re-exporting</b> with `export { Button } from './Button'` in an `index.js` file lets you group related exports together for cleaner imports.",
            np: "Default import: `import Button` (curly braces नाइ)। Named import: `import { fn }` (curly braces चाहिन्छ)।",
            jp: "デフォルトは波括弧なし、名前付きは波括弧あり。混同に注意。",
          },
        },
      ],
    },
    {
      title: { en: "Organizing your component files", np: "Component files organize गर्ने", jp: "コンポーネントファイルの整理" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "There is no single correct way to organize a React project. But two layouts dominate in practice: <b>flat by type</b> and <b>feature-based</b>.\n\n<b>Flat by type</b> (great for small projects, under 20 components):\n• All components in `src/components/`\n• All hooks in `src/hooks/`\n• All utilities in `src/utils/`\n\n<b>Feature-based</b> (scales to large apps):\n• Each feature gets its own folder: `src/features/posts/`\n• That folder contains the components, hooks, and utils just for that feature\n• Shared things go in `src/shared/` or `src/common/`\n\nStart flat, move to feature-based when you have 20+ components or multiple developers.",
            np: "Flat by type (small project) vs Feature-based (large app)। 20+ components भएपछि feature-based तिर जानुस्।",
            jp: "タイプ別フラット（小規模向け）vs フィーチャー別（大規模向け）。20 コンポーネントを超えたら移行検討。",
          },
        },
        {
          type: "code",
          title: { en: "Flat vs feature-based folder layout", np: "Flat vs Feature-based layout", jp: "フラット vs フィーチャー構成" },
          code: `// ─── FLAT LAYOUT (good for learning + small apps) ─────────
src/
  components/
    Button.jsx
    Card.jsx
    Header.jsx
    Modal.jsx
  hooks/
    useAuth.js
    useFetch.js
  utils/
    format.js
    validate.js
  App.jsx
  main.jsx

// ─── FEATURE-BASED LAYOUT (good for large apps) ────────────
src/
  features/
    posts/
      PostCard.jsx
      PostList.jsx
      usePostData.js
    auth/
      LoginForm.jsx
      useAuth.js
  shared/
    components/
      Button.jsx
      Modal.jsx
    utils/
      format.js
  App.jsx
  main.jsx

// ─── BARREL FILE (index.js) — cleaner imports ───────────────
// src/components/index.js
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Modal } from './Modal';

// Now one import instead of three:
import { Button, Card, Modal } from '@/components';`,
        },
      ],
    },
    {
      title: { en: "The index.html → main.jsx → App.jsx chain", np: "Entry chain बुझ्ने", jp: "エントリーチェーンを理解する" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When you run `npm run dev` and open your browser, here's exactly what happens:\n\n1. Browser requests your site → Vite serves `index.html`\n2. `index.html` has a `<script type=\"module\" src=\"/src/main.jsx\">` — browser loads `main.jsx`\n3. `main.jsx` imports `App`, calls `createRoot`, and calls `render(<App />)`\n4. React runs `App()`, gets the component tree, and writes it into `<div id=\"root\">`\n5. Your page appears\n\nUnderstanding this chain helps debug blank pages — if your app shows nothing, check each step in order.",
            np: "Browser → index.html → main.jsx → createRoot → App render। Blank page? यही chain check गर्नुस्।",
            jp: "ブラウザ → index.html → main.jsx → createRoot → App レンダリング。空白画面はこのチェーンを順に確認。",
          },
        },
        {
          type: "code",
          title: { en: "The three entry files in full", np: "तीन entry files", jp: "3 つのエントリーファイル" },
          code: `// ─── index.html ────────────────────────────────────────────
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My App</title>
  </head>
  <body>
    <!-- React mounts your entire app into this div -->
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

// ─── src/main.jsx ────────────────────────────────────────────
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// ─── src/App.jsx ─────────────────────────────────────────────
import './App.css';

function App() {
  return (
    <main>
      <h1>Hello React</h1>
      <p>Edit App.jsx and save to see hot reload in action.</p>
    </main>
  );
}

export default App;`,
        },
      ],
    },
    {
      title: { en: "Absolute imports with path aliases", np: "Path aliases सँग absolute imports", jp: "パスエイリアスで絶対パスインポート" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Relative imports like `../../components/Button` are fragile — move a file one folder deeper and every import breaks. <b>Path aliases</b> let you write `@/components/Button` from anywhere in the project.\n\nThe `@` alias is the community standard — it maps to your `src/` folder. Most projects you encounter use this convention.",
            np: "Relative import `../../` fragile छ। Path alias `@/` ले src/ folder map गर्छ — कहाँबाट पनि import गर्न मिल्छ।",
            jp: "相対パス `../../` は壊れやすい。`@/` エイリアスで src/ を指定すればどこからでも同じパスで import できます。",
          },
        },
        {
          type: "code",
          title: { en: "Setting up the @ path alias", np: "@ alias setup", jp: "@ エイリアスの設定" },
          code: `// ─── vite.config.js ─────────────────────────────────────────
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

// ─── tsconfig.json (TypeScript only) ────────────────────────
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// ─── Usage ───────────────────────────────────────────────────
// Before (fragile):
import Button from '../../components/Button';

// After (clean alias):
import Button from '@/components/Button';
import { formatDate } from '@/utils/format';
import { useAuth } from '@/hooks/useAuth';

// Install Node types if you get a 'path' error:
// npm install --save-dev @types/node`,
        },
      ],
    },
    {
      title: { en: "React DevTools — your debugging superpower", np: "React DevTools — debugging superpower", jp: "React DevTools — デバッグの強力ツール" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>React DevTools</b> is a browser extension (Chrome and Firefox) that adds two panels to your browser's developer tools:\n\n• <b>Components tab</b> — shows your entire component tree; click any component to inspect its current props and state\n  ↳ Essential for debugging \"why is this component showing the wrong data?\"\n• <b>Profiler tab</b> — records which components re-rendered and how long each took\n  ↳ Use this to find performance bottlenecks — components that re-render too often\n\nInstall it by searching \"React Developer Tools\" in the Chrome Web Store or Firefox Add-ons.",
            np: "React DevTools = browser extension। Components tab (props/state inspect), Profiler tab (re-render track)।",
            jp: "React DevTools はブラウザ拡張。Components タブで props/state を確認、Profiler タブで再レンダリングを追跡。",
          },
        },
        {
          type: "code",
          title: { en: "What DevTools shows for a component", np: "DevTools inspection उदाहरण", jp: "DevTools での検査例" },
          code: `// Clicking this component in DevTools shows:
// Props: { items: Array(3), title: "My List", onSelect: f }
// State: { selectedIndex: 1 }
// Rendered by: App > MainPanel > ItemList

function ItemList({ items, title, onSelect }) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <div>
      <h2>{title}</h2>
      {items.map((item, i) => (
        <div
          key={item.id}
          style={{ fontWeight: i === selectedIndex ? 'bold' : 'normal' }}
          onClick={() => { setSelectedIndex(i); onSelect(item); }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}

// DevTools power tips:
// ⚙️ Settings → "Highlight updates when components render"
//    A flash appears on every re-render — spot unnecessary renders visually
//
// Profiler → Record → interact → Stop
//    Flamegraph shows render time per component`,
        },
        {
          type: "paragraph",
          text: {
            en: "Three DevTools workflows to use every day:\n\n• <b>Inspect state</b> — click a component in the tree → see its state in the right panel → edit values live to test different scenarios\n• <b>Trace a bug</b> — click the component showing wrong data → trace its props up the tree to find where the wrong value comes from\n• <b>Performance check</b> — use Profiler during a slow interaction to find which component is the bottleneck",
            np: "DevTools 3 workflows: state inspect, bug source tracing, performance profiling।",
            jp: "毎日使う 3 つのワークフロー：state 確認、バグ追跡、パフォーマンス計測。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What is the difference between .jsx and .js files?", np: ".jsx र .js फाइलमा के फरक?", jp: ".jsx と .js の違いは？" },
      answer: {
        en: "Technically, Vite allows JSX syntax in both `.js` and `.jsx` files. The `.jsx` extension is a convention that signals 'this file contains JSX' — editors give better syntax highlighting and autocomplete. TypeScript projects use `.tsx` (TypeScript + JSX) and `.ts` (TypeScript, no JSX). Convention: use `.jsx` for components, `.js` for pure JavaScript utilities.",
        np: "Technically दुवैमा JSX चल्छ। `.jsx` = JSX भएको signal। TypeScript: `.tsx` (JSX) र `.ts` (no JSX)।",
        jp: "どちらでも JSX が動きます。`.jsx` は JSX を含む目印の慣習。TypeScript では `.tsx`/`.ts` を使います。",
      },
    },
    {
      question: { en: "Do I need barrel files (index.js)?", np: "Barrel files (index.js) चाहिन्छ?", jp: "バレルファイル（index.js）は必要？" },
      answer: {
        en: "No, they are optional. Barrel files (`index.js` that re-exports from sibling files) make imports cleaner: `import { Button, Card } from '@/components'` instead of two separate lines. The downside: large barrel files slow down build tools (tree-shaking becomes harder). For projects under 50 components barrel files are fine. For large apps, some teams skip them for build performance.",
        np: "Optional। Barrel files import clean बनाउँछ। 50 भन्दा कम component मा ठीक। Large app मा build slow हुन सक्छ।",
        jp: "任意です。クリーンな import になりますが、大規模では tree-shaking が難しくなる場合も。",
      },
    },
    {
      question: { en: "Why does Vite start so much faster than Create React App?", np: "Vite किन CRA भन्दा धेरै छिटो start हुन्छ?", jp: "Vite が CRA よりはるかに速い理由は？" },
      answer: {
        en: "CRA bundles your entire app with webpack before serving the first page — on a large project that can take 30–60 seconds. Vite skips the pre-bundling step in development: it serves source files as native ES modules and lets the browser do the importing. Only the files the current page actually needs are loaded. HMR (hot module replacement) is also faster because Vite only processes the one changed file.",
        np: "CRA = bundle पहिले, server पछि (slow)। Vite = native ES modules serve (no bundle), browser import गर्छ (fast)।",
        jp: "CRA は先にすべてバンドル（遅い）。Vite は ES モジュールをそのまま配信し、ブラウザが import します（速い）。",
      },
    },
    {
      question: { en: "What is import.meta.env?", np: "import.meta.env के हो?", jp: "import.meta.env とは？" },
      answer: {
        en: "`import.meta.env` is Vite's way to access environment variables in your React code. Create a `.env` file in your project root and prefix variables with `VITE_`: `VITE_API_URL=https://api.example.com`. Access it in code with `import.meta.env.VITE_API_URL`. Only variables prefixed with `VITE_` are exposed to the browser — never put secrets like private API keys here.",
        np: "Vite environment variables। `.env` file मा `VITE_` prefix। `import.meta.env.VITE_NAME` ले access। Secret server side राख्नुस्।",
        jp: "Vite の環境変数アクセス。`.env` に `VITE_` プレフィックスで定義し参照。秘密鍵はブラウザに置かない。",
      },
    },
    {
      question: { en: "My browser shows a blank white page — what do I check first?", np: "Browser blank white page — के check गर्ने?", jp: "ブラウザが真っ白 — まず何を確認する？" },
      answer: {
        en: "Check in this order: (1) Open browser DevTools (F12) → Console tab — is there a JavaScript error? Fix that first. (2) Check the Elements tab — is there content inside `<div id=\"root\">`? If empty, React failed to mount. (3) Check your terminal — is the Vite dev server running? Does it show errors? (4) Verify `main.jsx` — does `document.getElementById('root')` match the actual id in `index.html`? (5) Is `App.jsx` returning valid JSX with exactly one root element?",
        np: "Order: (1) Console error, (2) #root content, (3) Vite terminal error, (4) getElementById id match, (5) JSX valid।",
        jp: "確認順：① コンソールエラー、② #root の中身、③ Vite ターミナルエラー、④ id 一致、⑤ JSX の有効性。",
      },
    },
  ],
};
