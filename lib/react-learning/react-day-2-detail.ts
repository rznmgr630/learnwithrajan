import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_2_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 2 is about tooling: a repeatable dev environment, generating a real project with a bundler, reading the folder layout, and writing a small component you can import elsewhere. By the end you should recognize every top-level file in a Vite + React starter and know where to add new components.",
      np: "दिन २ उपकरण मा केन्द्रित: दोहोर्याउन मिल्ने विकास वातावरण, bundler सहित परियोजना बनाउने, फोल्डर लेआउट पढ्ने, र अन्तर्ग्रहण गर्न मिल्ने सानो कम्पोनेन्ट। अन्त्यमा Vite + React starter का मुख्य फाइल चिन्नुहोस्।",
      jp: "2日目は開発環境とプロジェクトの骨格です。エディタと Node をそろえ、Vite でアプリを生成し、ディレクトリの役割を把握し、小さなコンポーネントを切り出してみます。",
    },
    {
      en: "Lessons 03–07 cover: scaffold & structure & components, then how React updates the UI (render vs commit, reconciliation at a high level), and finally the wider ecosystem (routing, data, styling, meta-frameworks) you bolt on around the core library. Commands use Vite; CRA is legacy for new apps — ideas still transfer.",
      np: "०३–०७: scaffold, संरचना, कम्पोनेन्ट; अनि React ले UI कसरी अद्यावधिक गर्छ (render vs commit, reconciliation); अन्त्यमा इकोसिस्टम (routing, data, styling, meta-framework)। Vite; CRA पुरानो — विचार उस्तै।",
      jp: "03〜07：作成・構成・コンポーネント → React が UI をどう更新するか（レンダーとコミット、和解の概要）→ 核のまわりのエコシステム（ルーティング、取得、スタイル、メタフレームワーク）。Vite 前提。CRA は新規では旧式寄りですが考え方は共通です。",
    },
  ],
  sections: [
    {
      title: {
        en: "Setting up the development environment",
        np: "विकास वातावरण सेटअप",
        jp: "開発環境のセットアップ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Install Node.js LTS from nodejs.org (or use nvm/fnm to switch versions per project). LTS gives you a stable `node` and `npm` so you can run `npm create`, `npm install`, and `npm run dev` without surprises.",
            np: "Node.js LTS nodejs.org बाट (वा nvm/fnm)। LTS ले स्थिर `node` र `npm` दिन्छ — `npm create`, `install`, `run dev`।",
            jp: "Node.js（LTS） を入れます（nvm / fnm でバージョン切替も可）。`npm create` や `npm run dev` の前提になります。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Terminal — macOS Terminal, Windows Terminal, or the integrated terminal in VS Code (`View → Terminal`). You will live here for installs and scripts.",
              np: "टर्मिनल — macOS Terminal, Windows Terminal, वा VS Code टर्मिनल। स्थापना र script यहीँ।",
              jp: "ターミナル — OS 付属か VS Code 統合ターミナル。インストールと npm script はここで実行します。",
            },
            {
              en: "Editor — VS Code with extensions such as ESLint and the official ES7+ React/Redux/React-Native snippets (optional) speeds up JSX. Enable “format on save” if your team uses Prettier.",
              np: "सम्पादक — VS Code, ESLint, React snippets (वैकल्पिक)। टिमले Prettier प्रयोग गरे फर्म्याट अन सेभ।",
              jp: "エディタ — VS Code + ESLint など。チームで Prettier なら保存時フォーマットを有効に。",
            },
            {
              en: "Browser — Chrome, Edge, or Firefox with React DevTools (browser extension) so you can inspect the component tree after the app runs.",
              np: "ब्राउजर — Chrome/Edge/Firefox र React DevTools extension — कम्पोनेन्ट रूख हेर्न।",
              jp: "ブラウザ — Chrome 等 + React DevTools 拡張でコンポーネントツリーを確認します。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "03 · Creating a React app",
        np: "०३ · React एप बनाउने",
        jp: "03 · React アプリの作成",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The modern default is Vite: fast dev server, native ESM, and minimal config. `npm create vite@latest` downloads the latest template wizard; you pick a project name and the React or React + TypeScript template.",
            np: "आधुनिक मानक Vite: छिटो dev server, ESM, कम config। `npm create vite@latest` ले wizard चलाउँछ — नाम र React वा React + TS टेम्प्लेट छान्नुहोस्।",
            jp: "現状の定番は Vite です。`npm create vite@latest` でウィザードが開き、React または React + TypeScript を選びます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Scaffold + first run",
            np: "Scaffold + पहिलो चलाउने",
            jp: "作成して起動",
          },
          code: `# Interactive wizard (choose React or React + TypeScript)
npm create vite@latest

# Or non-interactive example:
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev`,
        },
        {
          type: "paragraph",
          text: {
            en: "Create React App (`create-react-app`) still exists in older courses; it wraps webpack and is slower to start than Vite. If you maintain CRA apps, the ideas in this day still apply — entry `index.js`, `src/App.js`, `public/index.html`.",
            np: "CRA पुराना पाठ्यक्रममा; webpack, Vite भन्दा ढिलो सुरु। CRA मर्मत गर्दा पनि — `index.js`, `src/App.js`, `public/index.html` उस्तै अवधारणा।",
            jp: "CRA は教材で残っていますが、新規は Vite やフレームワークが主流です。CRA でも入口・`src`・`public` の役割は同型です。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`package.json` — lists dependencies (React, etc.) and scripts (`dev`, `build`, `preview`).",
              np: "`package.json` — dependencies (React) र scripts (`dev`, `build`, `preview`)।",
              jp: "`package.json` — 依存関係と npm scripts（`dev` / `build` 等）の定義。",
            },
            {
              en: "`package-lock.json` (or `pnpm-lock.yaml`) — pins exact versions so teammates get the same tree under `node_modules`.",
              np: "`package-lock.json` — सटीक संस्करण पिन गर्छ — `node_modules` उस्तै।",
              jp: "ロックファイルで依存のバージョンを固定し、環境差を減らします。",
            },
            {
              en: "`npm run dev` — starts the development server with Hot Module Replacement / Fast Refresh so edits re-render without losing all client state when possible.",
              np: "`npm run dev` — dev server + Fast Refresh — सम्पादनले छिटो पुन: प्रदर्शन।",
              jp: "`npm run dev` — 開発サーバーと Fast Refresh で編集がすぐ反映されます。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "04 · Project structure",
        np: "०४ · परियोजना संरचना",
        jp: "04 · プロジェクト構成",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Vite keeps a thin root: `index.html` at the top (not inside `public/`) is the real entry the browser loads — it contains a `<script type=\"module\" src=\"/src/main.jsx\">` (or `.tsx`). `public/` holds static assets copied as-is (favicon, `robots.txt`). `src/` is where your React code lives.",
            np: "Vite पातलो जरा: `index.html` माथि (public भित्र होइन) — ब्राउजर प्रवेश; `<script type=\"module\" src=\"/src/main.jsx\">`। `public/` स्थिर फाइल। `src/` React कोड।",
            jp: "`index.html` がルートにあり、`<script type=\"module\" src=\"/src/main.jsx\">` で JS を読み込みます。`public/` はそのまま配信される静的ファイル、`src/` がアプリ本体です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Typical Vite + React layout (simplified)",
            np: "Vite + React लेआउट (सरलीकृत)",
            jp: "典型的なフォルダ構成（簡略）",
          },
          code: `my-app/
├── index.html          # Browser entry; links to /src/main.jsx
├── package.json
├── vite.config.js      # Vite plugins & path aliases (optional)
├── public/
│   └── vite.svg        # Served at /vite.svg
└── src/
    ├── main.jsx        # createRoot + render(<App />)
    ├── App.jsx         # Root component (often refactored later)
    ├── App.css
    └── assets/         # Images imported from JS (hashed on build)`,
        },
        {
          type: "paragraph",
          text: {
            en: "Files under `src/` are bundled — imports are analyzed, JSX is compiled, and unused code can be tree-shaken in production. Files in `public/` are not processed; use them for files that must keep exact URLs or names.",
            np: "`src/` भित्र bundle — import विश्लेषण, JSX कम्पाइल। `public/` प्रक्रिया हुँदैन; URL/नाम ठ्याक्कै चाहिने।",
            jp: "`src/` はバンドル対象、`public/` はビルド処理を通さずそのまま配信されます。",
          },
        },
      ],
    },
    {
      title: {
        en: "05 · Creating a React component",
        np: "०५ · React कम्पोनेन्ट बनाउने",
        jp: "05 · React コンポーネントの作成",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A function component is a JavaScript function whose name starts with a capital letter and that returns JSX. Export it as `default` when each file owns one primary component (Vite/React style), or use named exports when a file exports several small helpers.",
            np: "फंक्शन कम्पोनेन्ट — नाम ठूलो अक्षरबाट, JSX फर्काउँछ। फाइलमा एक मुख्य भए `default export`; धेरै साना भए named export।",
            jp: "関数コンポーネントは先頭大文字の関数で JSX を返すものです。ファイルごとに主役が一つなら default export、複数なら named export が使われます。",
          },
        },
        {
          type: "code",
          title: {
            en: "src/components/Greeting.jsx",
            np: "src/components/Greeting.jsx",
            jp: "src/components/Greeting.jsx",
          },
          code: `function Greeting({ name }) {
  return (
    <section aria-labelledby="greeting-heading">
      <h2 id="greeting-heading">Hello, {name}</h2>
      <p>Welcome to your Vite + React app.</p>
    </section>
  );
}

export default Greeting;`,
        },
        {
          type: "code",
          title: {
            en: "Use it from App.jsx",
            np: "App.jsx बाट प्रयोग",
            jp: "App.jsx から利用",
          },
          code: `import Greeting from "./components/Greeting.jsx";

function App() {
  return (
    <main>
      <Greeting name="Ada" />
    </main>
  );
}

export default App;`,
        },
        {
          type: "paragraph",
          text: {
            en: "Convention: one component per file when the component grows; keep `components/` for reusable UI and leave `App` as the composition root until you add routing. Props like `{ name }` are covered in depth on the next days — here, treat them as function arguments for markup.",
            np: "रूढिवाची: कम्पोनेन्ट ठूलो भए फाइल प्रति एक; `components/` पुन: प्रयोग UI। `App` संरचनाको जरा। `{ name }` props अर्को दिन — अहिले markup को तर्क जस्तै।",
            jp: "成長に合わせて 1 ファイル 1 コンポーネント と `components/` 分けが一般的です。`{ name }` など props は続きの日で深掘りします。",
          },
        },
      ],
    },
    {
      title: {
        en: "06 · How React works",
        np: "०६ · React कसरी काम गर्छ",
        jp: "06 · React の動き方",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React splits work into roughly render and commit. During render, your component functions run and React builds a lightweight description of the UI (a tree of React elements — plain objects, not DOM nodes). During commit, React applies the minimal DOM updates needed so the browser matches that description.",
            np: "React ले काम render र commit मा बाँड्छ। render मा कम्पोनेन्ट चल्छ र UI को वर्णन (React elements — सादा object, DOM होइन)। commit मा न्यूनतम DOM अद्यावधिक।",
            jp: "大ざっぱに レンダー と コミット があります。レンダーで関数コンポーネントが走り、UI の記述（要素のツリー。DOM ではない）が作られます。コミットで実 DOM へ必要最小限の変更が入ります。",
          },
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Trigger — state or parent props change (or the root mounts).",
              np: "ट्रिगर — state वा अभिभावक props बदलिन्छ (वा root mount)।",
              jp: "きっかけ — state や親からの props の変化、または初回マウント。",
            },
            {
              en: "Render — React calls your components purely to compute the next element tree (same inputs → same JSX output is the goal).",
              np: "Render — React ले कम्पोनेन्ट शुद्ध रूपमा चलाउँछ — अर्को element रूख (उस्तै इनपुट → उस्तै JSX लक्ष्य)।",
              jp: "レンダー — 次の要素ツリーを求めるためにコンポーネントを呼びます（同じ入力なら同じ出力が理想）。",
            },
            {
              en: "Reconciliation — React diffs the new tree with the previous one and decides which fibers/DOM nodes can be reused vs recreated.",
              np: "Reconciliation — React ले नयाँ र पुरानो रूख diff गर्छ — कुन fiber/DOM पुन: प्रयोग वा नयाँ।",
              jp: "和解（リコンシリエーション） — 前回ツリーとの差分で、再利用と更新の範囲を決めます。",
            },
            {
              en: "Commit — DOM mutations, refs, layout, and paint run in a careful order; concurrent features may yield work across frames (details come later).",
              np: "Commit — DOM, ref, layout, paint क्रममा; concurrent ले frame बीच yield गर्न सक्छ (पछि)।",
              jp: "コミット — DOM 更新や ref、レイアウトなどが順序立てて実行されます（Concurrent は後の話）。",
            },
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "The phrase virtual DOM usually means the in-memory tree of React elements from the last render and the tree from the current render. React does not mirror every HTML attribute into a giant parallel DOM object for its own sake — it compares element descriptions, figures out what changed, then updates the real DOM in one coordinated commit. That batching is why small frequent state changes do not always map one-to-one to expensive layout work.",
            np: "virtual DOM भनेको प्राय स्मृतिमा React element रूख — अघिल्लो र अहिलेको render। React ले हरेक HTML विशेषता प्रतिलिपि गर्दैन — element वर्णन तुलना गर्छ, वास्तविक DOM मा समन्वयित commit। batching ले सानो state परिवर्तन सधै महँगो layout सँग मेल खाँदैन।",
            jp: "仮想 DOM とは、ざっくり メモリ上の React 要素ツリー（前回レンダーと今回レンダー）を指す言い方です。ブラウザの DOM を常に丸ごと二重管理するのではなく、要素の記述同士を比較し、必要な差分だけ 実 DOM に反映します。まとめて更新するので、細かい state 変更が必ずしもレイアウト嵐に直結しません。",
          },
        },
        {
          type: "diagram",
          id: "react-virtual-dom",
        },
        {
          type: "paragraph",
          text: {
            en: "Fiber is React’s internal unit of work (a linked structure per component instance). You rarely touch it directly; knowing it exists explains why “render” can be scheduled, paused, or retried in modern React.",
            np: "Fiber React को आन्तरिक काम एकाइ — प्रत्यक्ष छुनु पर्दैन; \"render\" किन schedule/pause हुन्छ भन्ने बुझाउँछ।",
            jp: "Fiber は内部の作業単位です。直接は触れませんが、「レンダーがスケジュールされる」理由の一端になります。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "Rules of thumb for Day 2: keep side effects (timers, `fetch`, subscriptions) out of the render body — you will wire them with `useEffect` or data libraries soon. Treat render as predictable: given props/state, return JSX only.",
            np: "दिन २ नियम: side effect (timer, `fetch`) render शरीरभित्र होइन — चाँडै `useEffect` वा data लाइब्रेरी। render लाई पूर्वानुमेय मान्नुहोस्।",
            jp: "今日の心得：`fetch` やタイマーはレンダー本体に書かない（後で `useEffect` やデータ層へ）。props/state が決まれば JSX が決まるようにします。",
          },
        },
      ],
    },
    {
      title: {
        en: "07 · React ecosystem",
        np: "०७ · React इकोसिस्टम",
        jp: "07 · React エコシステム",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The `react` and `react-dom` packages solve UI composition and updates. Almost everything else — routing, server data caching, global state, forms, CSS strategy, testing, bundling — comes from the ecosystem: community packages or meta-frameworks (Next.js, Remix, React Router v7 framework mode) that ship opinions on routing and data loading.",
            np: "`react` / `react-dom` ले UI संरचना र अद्यावधिक। बाँकी — routing, data caching, state, forms, CSS, testing, bundling — इकोसिस्टम वा meta-framework (Next.js, Remix) बाट।",
            jp: "`react` / `react-dom` は UI の組み立てと更新が中心です。ルーティング、サーバデータの取得・キャッシュ、フォーム、スタイル、テストなどは周辺のエコシステムか、それらを束ねるメタフレームワーク（Next.js、Remix など）で補います。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Common layers teams add (examples, not exhaustive)",
            np: "टिमले थप्ने स्तर (उदाहरण मात्र)",
            jp: "よく足す層の例（網羅ではありません）",
          },
          headers: [
            { en: "Concern", np: "चिन्ता", jp: "関心" },
            { en: "Typical tools", np: "साधारण उपकरण", jp: "例となるツール" },
          ],
          rows: [
            [
              { en: "URLs & screens", np: "URL र स्क्रिन", jp: "URL と画面" },
              {
                en: "React Router, TanStack Router; or a framework’s file-based routes",
                np: "React Router; वा framework को route",
                jp: "React Router、TanStack Router、各フレームのルート",
              },
            ],
            [
              { en: "Remote data", np: "टाढा डाटा", jp: "リモートデータ" },
              {
                en: "TanStack Query, SWR, Apollo Client; or framework loaders / Server Components",
                np: "TanStack Query, SWR; वा framework loader",
                jp: "TanStack Query、SWR、フレームの loader / RSC など",
              },
            ],
            [
              { en: "Styling", np: "शैली", jp: "スタイル" },
              {
                en: "CSS Modules, Tailwind, vanilla-extract, styled-components — pick one convention per app",
                np: "CSS Modules, Tailwind — एपमा एक नियम",
                jp: "CSS Modules、Tailwind 等。アプリ内で方針を統一",
              },
            ],
            [
              { en: "Forms", np: "फर्म", jp: "フォーム" },
              {
                en: "Controlled inputs in React; libraries like React Hook Form for scale",
                np: "controlled input; React Hook Form ठूलो फर्म",
                jp: "制御コンポーネント、規模が出たら React Hook Form など",
              },
            ],
            [
              { en: "Testing", np: "परीक्षण", jp: "テスト" },
              {
                en: "Vitest + React Testing Library; Playwright/Cypress for E2E",
                np: "Vitest + RTL; Playwright E2E",
                jp: "Vitest + Testing Library、E2E は Playwright 等",
              },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "You do not install all of these on Day 2. Start with plain React + Vite, then add one concern at a time when a real feature needs it — that avoids dependency soup and makes debugging easier.",
            np: "दिन २ मा सबै स्थापना गर्नुहोइन। React + Vite बाट, एक चिन्ता एक पटक जब वास्तविक फिचर चाहिन्छ — निर्भरता soup बचाउँछ।",
            jp: "今日ですべて入れる必要はありません。Vite + React から始め、必要になった関心ごとに一つずつ足すのが運用しやすいです。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between `npm`, `npx`, and `node`?",
        np: "`npm`, `npx`, `node` मा के फरक?",
        jp: "`npm` と `npx` と `node` の違いは？",
      },
      answer: {
        en: "`node` runs JavaScript on your machine. `npm` is the package manager that installs libraries into `node_modules` and reads `package.json`. `npx` runs a package binary without installing it globally — `npm create vite@latest` uses it to fetch and execute the Vite scaffolding tool once.",
        np: "`node` JS चलाउँछ। `npm` लाइब्रेरी स्थापना। `npx` अस्थायी रूपमा package binary चलाउँछ — `npm create vite@latest`।",
        jp: "`node` は実行環境、`npm` は依存のインストール、`npx` は（グローバルに入れずに）CLI を一時実行するのに使います。",
      },
    },
    {
      question: {
        en: "Why is `node_modules` so large?",
        np: "`node_modules` यति ठूलो किन?",
        jp: "`node_modules` が巨大なのはなぜ？",
      },
      answer: {
        en: "Each dependency can pull in transitive dependencies (their own dependencies). The lockfile keeps versions reproducible. Do not commit hand-edits inside `node_modules`; reinstall with `npm install` if something looks corrupted.",
        np: "प्रत्येक निर्भरताले अप्रत्यक्ष निर्भरता तान्छ। lockfile पुनरुत्पादन। `node_modules` हातले नसुनाउनु; बिग्रिए `npm install`।",
        jp: "依存の依存が連鎖するためです。通常は Git にコミットせず、壊れたら `node_modules` を消して `npm install` し直します。",
      },
    },
    {
      question: {
        en: "Default export vs named export — when do I use which?",
        np: "default vs named export — कहिले?",
        jp: "default export と named export、どちらを使う？",
      },
      answer: {
        en: "Default: one main thing per file (`import App from \"./App\"` — any local name works). Named: several exports (`import { formatDate, slugify } from \"./utils\"`). Mixing styles is fine; stay consistent within a codebase so imports are grep-friendly.",
        np: "Default: फाइलमा एक मुख्य। Named: धेरै। मिश्रण मिल्छ; कोडबेसमा एकरूपता राख्नुहोस्।",
        jp: "ファイルの主役が一つなら default、ユーティリティを複数出すなら named が読みやすいことが多いです。",
      },
    },
    {
      question: {
        en: "Should component files be `.js` or `.jsx`?",
        np: "`.js` वा `.jsx`?",
        jp: "拡張子は `.js` と `.jsx` どちら？",
      },
      answer: {
        en: "If the file contains JSX, `.jsx` (or `.tsx` with TypeScript) makes that obvious to humans and tooling. Some teams use `.js` everywhere with Babel/Vite configured to parse JSX anyway — pick a team rule and stick to it.",
        np: "JSX छ भने `.jsx` (वा `.tsx`)। केही टिम `.js` मात्र — टिम नियम पालन गर्नुहोस्।",
        jp: "JSX を含むなら `.jsx` / `.tsx` が分かりやすいです。設定で `.js` にもできるのでチーム規約に合わせます。",
      },
    },
    {
      question: {
        en: "What is `vite.config.js` for?",
        np: "`vite.config.js` के लागि?",
        jp: "`vite.config.js` は何用？",
      },
      answer: {
        en: "Vite-specific settings: plugins (e.g. `@vitejs/plugin-react`), path aliases like `@/` → `src/`, server port, and build targets. You can start without touching it; add config when you need aliases or SSR later.",
        np: "Vite सेटिङ: plugin, path alias `@/` → `src/`, port, build। सुरुमा नछोए पनि हुन्छ; alias चाहिएपछि।",
        jp: "プラグイン、パスエイリアス、開発サーバー設定など。最初はデフォルトのままで問題ありません。",
      },
    },
    {
      question: {
        en: "How do environment variables work in Vite?",
        np: "Vite मा env कसरी?",
        jp: "Vite で環境変数は？",
      },
      answer: {
        en: "Define `VITE_`-prefixed variables in `.env`, `.env.local`, etc. Access them in client code as `import.meta.env.VITE_API_URL`. Only `VITE_*` keys are exposed to the browser bundle — never put secrets in front-end env files.",
        np: "`.env` मा `VITE_` उपसर्ग। कोडमा `import.meta.env.VITE_*`। गोप्य कुरा frontend `.env` मा होइन।",
        jp: "クライアントに載せる値は `VITE_` 接頭辞付きで `import.meta.env` から読みます。秘密情報はフロントの `.env` に置かないでください。",
      },
    },
    {
      question: {
        en: "Can I put HTML pages inside `src/`?",
        np: "`src/` भित्र HTML?",
        jp: "`src/` に HTML ページを置ける？",
      },
      answer: {
        en: "SPAs usually have one `index.html` at the project root. Additional “pages” are React components switched by the router, not separate `.html` files in `src/`. Multi-page setups exist but are a different Vite mode.",
        np: "SPA मा प्राय एक `index.html` जरामा। अतिरिक्त \"पृष्ठ\" router ले कम्पोनेन्ट बदल्छ। बहु-पृष्ठ अर्को Vite मोड।",
        jp: "典型的な SPA はルートの `index.html` 一枚で、画面はルーターがコンポーネントを切り替えます。",
      },
    },
    {
      question: {
        en: "What breaks if I rename `main.jsx` but forget to update `index.html`?",
        np: "`main.jsx` नाम बदल्यो, `index.html` बिर्सिए के हुन्छ?",
        jp: "`main.jsx` をリネームしたのに `index.html` を直さないと？",
      },
      answer: {
        en: "The browser requests the old path and gets 404 — blank page or Vite error overlay. The `<script type=\"module\" src=\"...\">` must always point to your real entry file.",
        np: "ब्राउजर पुरानो path माग्छ — 404। `<script src=\"...\">` सधै वास्तविक entry मिलाउनुहोस्।",
        jp: "モジュールの読み込みが失敗し、白画面やエラーオーバーレイになります。`index.html` の script パスを合わせます。",
      },
    },
    {
      question: {
        en: "How does Fast Refresh differ from a full page reload?",
        np: "Fast Refresh र पूर्ण reload मा फरक?",
        jp: "Fast Refresh とフルリロードの違いは？",
      },
      answer: {
        en: "Fast Refresh tries to patch components in place and preserve React state when your edit is compatible (e.g. JSX tweak). Syntax errors or certain edits still force a harder reload. It speeds the edit-save-feedback loop.",
        np: "Fast Refresh स्थानमा patch — मिल्दो सम्पादनमा state जोगाउँछ। syntax त्रुटिमा कडा reload।",
        jp: "互換のある変更では状態を保ったまま差し替えを試みます。構文エラーなどではフルリロードに近い挙動になります。",
      },
    },
    {
      question: {
        en: "Should every component live in `components/`?",
        np: "सबै `components/` मा?",
        jp: "全部 `components/` に置く？",
      },
      answer: {
        en: "Common pattern: `components/` for reusable UI, `pages/` or `routes/` when you adopt a router, `hooks/` for custom hooks, `lib/` for non-UI helpers. Flat `src/` is fine for tiny apps — refactor into folders as files multiply.",
        np: "`components/` पुन: प्रयोग; router भए `pages/`; `hooks/`, `lib/`। सानो एपमा फ्ल्याट `src/` मिल्छ।",
        jp: "再利用 UI は `components/`、ルート単位は `pages/` などに分けるパターンが多いです。小規模なら最初はフラットでも構いません。",
      },
    },
    {
      question: {
        en: "What is reconciliation in one sentence?",
        np: "Reconciliation एक वाक्यमा?",
        jp: "リコンシリエーション（和解）を一文で？",
      },
      answer: {
        en: "React compares the newly rendered element tree with the last one and reuses or updates the smallest set of internal nodes and DOM elements so the screen matches your latest JSX.",
        np: "React ले नयाँ element रूख पुरानोसँग तुलना गर्छ र न्यूनतम internal/DOM नोड पुन: प्रयोग वा अद्यावधिक गर्छ।",
        jp: "新しい要素ツリーと前回のツリーを比較し、画面を最新の JSX に合わせるために必要最小限のノードだけを再利用・更新することです。",
      },
    },
    {
      question: {
        en: "Is the virtual DOM a second copy of the whole HTML page in memory?",
        np: "virtual DOM पूरै HTML को दोस्रो प्रतिलिपि हो?",
        jp: "仮想 DOM はページ全体の HTML のコピー？",
      },
      answer: {
        en: "Not really. It is the tree of plain JavaScript objects React builds from your components — lightweight descriptions (type, props, children), not a full clone of every DOM property. The browser still owns the real DOM; React’s job is to compute patches so that DOM stays in sync with your latest UI description.",
        np: "पूर्ण प्रतिलिपि होइन। सादा JS object रूख — हल्का वर्णन (type, props, children), हरेक DOM गुणको प्रतिलिपि होइन। वास्तविक DOM ब्राउजरको; React ले patch गन्छ।",
        jp: "ページ全体の HTML を丸ごと複製しているわけではありません。要素を表す軽いオブジェクトのツリーで、ブラウザの 実 DOM は別です。React はそのツリー同士の差分から、実 DOM への最小の更新を計算します。",
      },
    },
    {
      question: {
        en: "Is Next.js “React” or something different?",
        np: "Next.js \"React\" हो वा फरक?",
        jp: "Next.js は React とは別物？",
      },
      answer: {
        en: "Next.js is a React framework: it still renders React components, but adds a file router, build pipeline, optional server-side data APIs, and deployment defaults. You learn the same component model; the framework decides where code runs (client vs server) more explicitly.",
        np: "Next.js React फ्रेमवर्क हो — अझै React कम्पोनेन्ट; file router, build, server data API थप्छ। कम्पोनेन्ट मोडेल उस्तै; client vs server स्पष्ट।",
        jp: "Next.js は React 上のフレームワークです。コンポーネントは React のままですが、ルーティングやビルド、データ取得の置き場（クライアント／サーバ）の扱いが強くなります。",
      },
    },
  ],
  bullets: [
    {
      en: "Run `npm create vite@latest`, install deps, and confirm `npm run dev` opens the starter page.",
      np: "`npm create vite@latest`, install, `npm run dev` ले starter खुल्छ भन्ने पुष्टि।",
      jp: "Vite で作成し `npm run dev` で起動できることを確認する。",
    },
    {
      en: "Trace the load chain: `index.html` → `src/main.jsx` → `App.jsx` in DevTools Network tab.",
      np: "लोड चेन: `index.html` → `main.jsx` → `App.jsx` Network मा।",
      jp: "Network タブで index.html → main → App の読み込み順を追う。",
    },
    {
      en: "Add `src/components/Greeting.jsx`, import it into `App`, and change props to see Fast Refresh.",
      np: "`Greeting.jsx` थपी `App` मा import; props बदल्दै Fast Refresh।",
      jp: "新規コンポーネントを作り App から import、props を変えて Fast Refresh を体感する。",
    },
    {
      en: "In your own words, describe render → reconcile → commit; note one ecosystem package you might add first (e.g. router) and why.",
      np: "आफ्नै शब्दमा render → reconcile → commit; पहिलो इकोसिस्टम प्याकेज (जस्तै router) र किन।",
      jp: "render → reconcile → commit を自分の言葉で説明し、最初に足しそうな周辺パッケージ（例：ルータ）と理由を一行で書く。",
    },
  ],
};
