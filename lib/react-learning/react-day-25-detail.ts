import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_25_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "You've spent 24 days learning individual pieces — hooks, patterns, routing, testing, performance. A portfolio project is where those pieces get welded into one thing that proves you can ship. Analogy: you've been practicing scales and chords for 24 days; a project is the first full song — it's where fingers that know the theory learn to play together under real pressure (real APIs, real edge cases, real deadlines).",
      np: "24 दिनसम्म अलग-अलग टुक्रा सिक्यौं — hooks, patterns, routing, testing, performance। Project ले ती सबैलाई एकसाथ जोड्छ, जसले तपाईं ship गर्न सक्नुहुन्छ भनेर देखाउँछ।",
      jp: "24日間で個々の要素——フック・パターン・ルーティング・テスト・パフォーマンス——を学びました。プロジェクトはそれらを一つに溶接し、実際に出荷できることを証明する場です。",
    },
    {
      en: "Today's topics:\n• <b>How to use this list</b> — picking the right project for where you are\n• <b>Beginner projects</b> — Todo App, Weather App, Notes App\n• <b>Intermediate projects</b> — Movie Search, Expense Tracker (leveled up), Dashboard, Chat App\n• <b>Advanced projects</b> — Kanban Board, E-commerce Store, Admin Panel, GitHub Explorer, Trello Clone, Notion Clone\n• <b>Scoping a project so it's resume-worthy</b> — MVP first, deploy it, write a README",
      np: "List कसरी use गर्ने, Beginner/Intermediate/Advanced projects, र resume-worthy project कसरी scope गर्ने।",
      jp: "リストの使い方、初級・中級・上級プロジェクト、履歴書に載せる価値のあるプロジェクトの絞り方を学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "How to use this list",
        np: "यो list कसरी use गर्ने",
        jp: "このリストの使い方",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Don't build every project below — that's busywork, not learning. Pick <b>one from your current tier</b>, finish it completely (deployed, not just running on localhost), then move up a tier. A finished beginner project teaches more than an abandoned advanced one.\n\n<b>How to pick:</b>\n• If you're unsure about forms, state, or basic API calls — start Beginner\n• If you're comfortable with hooks and API calls but haven't combined routing + auth + a data layer — start Intermediate\n• If you want to demonstrate architecture decisions to an employer — go straight to Advanced and treat the README as part of the deliverable, not an afterthought",
            np: "सबै project नबनाउनुहोस् — एउटा tier बाट एउटा छान्नुहोस्, पूरा गरेर deploy गर्नुहोस्, अनि माथिल्लो tier मा जानुहोस्।",
            jp: "すべて作る必要はありません。今のレベルから1つ選び、デプロイまで完成させてから次のレベルへ進みましょう。",
          },
        },
      ],
    },
    {
      title: {
        en: "Beginner projects",
        np: "Beginner projects",
        jp: "初級プロジェクト",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Beginner tier — core CRUD and state fundamentals",
            np: "Beginner tier — CRUD र state fundamentals",
            jp: "初級レベル — CRUD と state の基礎",
          },
          headers: [
            { en: "Project", np: "Project", jp: "プロジェクト" },
            { en: "Key skills exercised", np: "मुख्य skills", jp: "習得スキル" },
            { en: "Related days", np: "सम्बन्धित days", jp: "関連する日" },
          ],
          rows: [
            [
              { en: "Todo App", np: "Todo App", jp: "Todo アプリ" },
              { en: "Add/edit/delete/toggle items, filtering, localStorage persistence", np: "CRUD, filtering, localStorage", jp: "CRUD・フィルタ・localStorage" },
              { en: "Day 3 (lists & events), Day 6 (useState & immutability)", np: "Day 3, Day 6", jp: "Day 3, Day 6" },
            ],
            [
              { en: "Weather App", np: "Weather App", jp: "天気アプリ" },
              { en: "Calling a public API, loading/error states, controlled search input", np: "Public API call, loading/error state", jp: "外部API呼び出し・ローディング/エラー状態" },
              { en: "Day 8 (useEffect, fetch, CRUD)", np: "Day 8", jp: "Day 8" },
            ],
            [
              { en: "Notes App", np: "Notes App", jp: "メモアプリ" },
              { en: "Rich text or markdown input, controlled forms, persisting structured data", np: "Controlled form, structured data persist", jp: "制御フォーム・構造化データの永続化" },
              { en: "Day 4 (props/state), Day 7 (forms)", np: "Day 4, Day 7", jp: "Day 4, Day 7" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Intermediate projects",
        np: "Intermediate projects",
        jp: "中級プロジェクト",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "<b>Movie Search</b> — search-as-you-type against a public movie API (debounced input), paginated results, a detail route per movie. Exercises: `useDebounce` (Day 11), dynamic routes (Day 18), TanStack Query caching (Day 18/20).",
              np: "Movie Search — debounced search, pagination, detail route। Day 11, 18, 20 को concepts प्रयोग गर्छ।",
              jp: "Movie Search — デバウンス検索・ページネーション・詳細ルート。Day 11, 18, 20 の内容を活用。",
            },
            {
              en: "<b>Expense Tracker, leveled up</b> — you built a basic version in Day 7. Extend it: persist to a real backend or IndexedDB instead of memory, add category filtering, add a spending-by-category chart. Exercises: data layer separation (Day 24), derived/computed state, a charting library.",
              np: "Expense Tracker (upgraded) — Day 7 को version लाई persistence, filtering, chart थपेर extend गर्नुहोस्।",
              jp: "Expense Tracker（強化版）— Day 7 の版に永続化・フィルタ・チャートを追加して拡張。",
            },
            {
              en: "<b>Dashboard</b> — multiple data widgets (charts, tables, stats) fed by one or more APIs, with a sidebar layout and route-based sections. Exercises: layout routes (Day 18), Suspense boundaries per widget (Day 14), memoization to avoid re-rendering unrelated widgets (Day 10).",
              np: "Dashboard — बहु widgets, layout routes, per-widget Suspense, memoization।",
              jp: "Dashboard — 複数ウィジェット、レイアウトルート、ウィジェット単位の Suspense、メモ化。",
            },
            {
              en: "<b>Chat App</b> — a message list with optimistic sends, either mocked with a fake delay or wired to a real-time backend (Firebase, Supabase, WebSockets). Exercises: optimistic updates (Day 20), auto-scrolling refs (Day 11), uncontrolled message input (Day 12).",
              np: "Chat App — optimistic sends, real-time वा mocked backend। Day 20, 11, 12 प्रयोग गर्छ।",
              jp: "Chat App — 楽観的送信、リアルタイムまたはモック。Day 20, 11, 12 を活用。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Advanced projects",
        np: "Advanced projects",
        jp: "上級プロジェクト",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Advanced tier — production-shaped complexity",
            np: "Advanced tier — production-level complexity",
            jp: "上級レベル — 本番規模の複雑さ",
          },
          headers: [
            { en: "Project", np: "Project", jp: "プロジェクト" },
            { en: "Key skills exercised", np: "मुख्य skills", jp: "習得スキル" },
            { en: "Related days", np: "सम्बन्धित days", jp: "関連する日" },
          ],
          rows: [
            [
              { en: "Kanban Board", np: "Kanban Board", jp: "かんばんボード" },
              { en: "Drag-and-drop reordering, optimistic reordering, compound-component columns", np: "Drag-and-drop, optimistic update, compound components", jp: "ドラッグ&ドロップ・楽観的更新・複合コンポーネント" },
              { en: "Day 11 (compound components), Day 20 (optimistic updates)", np: "Day 11, Day 20", jp: "Day 11, Day 20" },
            ],
            [
              { en: "E-commerce Store", np: "E-commerce Store", jp: "ECストア" },
              { en: "Product catalog, cart state (global), checkout form, protected routes for account pages", np: "Global cart state, checkout, protected routes", jp: "グローバルカート状態・チェックアウト・保護ルート" },
              { en: "Day 18 (Zustand), Day 19 (auth/protected routes), Day 7 (forms)", np: "Day 18, 19, 7", jp: "Day 18, 19, 7" },
            ],
            [
              { en: "Admin Panel", np: "Admin Panel", jp: "管理パネル" },
              { en: "Role-gated views, data tables with sort/filter/pagination, bulk mutations", np: "Role-gated views, data tables, bulk mutations", jp: "権限別ビュー・データテーブル・一括更新" },
              { en: "Day 19 (auth, RBAC), Day 20 (mutations, infinite queries)", np: "Day 19, Day 20", jp: "Day 19, Day 20" },
            ],
            [
              { en: "GitHub Explorer", np: "GitHub Explorer", jp: "GitHub エクスプローラー" },
              { en: "Search users/repos via the public GitHub API, paginated results, dynamic detail routes, skeleton loading", np: "Public API pagination, dynamic routes, skeleton loading", jp: "公開APIのページネーション・動的ルート・スケルトン表示" },
              { en: "Day 20 (TanStack pagination), Day 18 (dynamic params), Day 14 (loading states)", np: "Day 20, 18, 14", jp: "Day 20, 18, 14" },
            ],
            [
              { en: "Trello Clone", np: "Trello Clone", jp: "Trello クローン" },
              { en: "Nested boards/lists/cards, deeply nested compound state, real-time-ish collaboration feel", np: "Nested state, compound components, collaboration UX", jp: "ネスト状態・複合コンポーネント・共同編集風UX" },
              { en: "Day 9 (useReducer for complex state), Day 11 (compound components)", np: "Day 9, Day 11", jp: "Day 9, Day 11" },
            ],
            [
              { en: "Notion Clone", np: "Notion Clone", jp: "Notion クローン" },
              { en: "Block-based editor (each line is its own editable component), slash commands, nested pages", np: "Block-based editor, polymorphic blocks, nested routing", jp: "ブロック型エディタ・ポリモーフィックブロック・ネストルーティング" },
              { en: "Day 12 (polymorphic components), Day 18 (nested/layout routes)", np: "Day 12, Day 18", jp: "Day 12, Day 18" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "<b>These are the hardest to finish — and that's the point.</b> A half-finished Notion clone with a working block editor and nothing else still demonstrates more engineering judgment than ten completed todo apps. Depth beats breadth once you're past the beginner tier.",
            np: "यी सबैभन्दा गाह्रो छन् — त्यही नै मुख्य कुरा हो। आधा-सकिएको Notion clone ले पनि दश Todo apps भन्दा बढी judgment देखाउँछ।",
            jp: "これらは最も完成が難しい——それが重要な点です。半完成の Notion クローンでも、完成した Todo アプリ10個より多くの判断力を示します。",
          },
        },
      ],
    },
    {
      title: {
        en: "Scoping a project so it's actually resume-worthy",
        np: "Resume-worthy हुने गरी project scope गर्ने",
        jp: "履歴書に載る価値のあるプロジェクトの絞り方",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The difference between \"I followed a tutorial\" and \"I built something\" is scoping discipline, not raw feature count. Analogy: a tutorial clone is a paint-by-numbers picture; a scoped project is a sketch you designed yourself — smaller, rougher at the edges, but unmistakably yours.\n\n<b>Rules that make a project resume-worthy:</b>\n• <b>Ship an MVP first.</b> Get the single core flow working end-to-end (e.g. for a Kanban board: create a card, drag it between columns, persist the state) before adding anything else. A working narrow slice beats a broken wide one.\n• <b>Go one feature deep, not ten features shallow.</b> Pick ONE feature to over-engineer on purpose — real-time sync, offline support, keyboard shortcuts — so you have something specific and technical to talk about in an interview.\n• <b>Deploy it live.</b> A GitHub link nobody can click and run is a resume line, not a portfolio piece. Vercel/Netlify for the frontend, a free-tier backend (Railway, Render, Supabase) if you need one.\n• <b>Write a README that explains decisions, not just setup steps.</b> \"Why I chose Zustand over Context here\" is more valuable to a reviewer than installation instructions alone.\n• <b>Add 3-5 tests for the trickiest logic</b> (Day 16) — not for coverage percentage, but to show you know what's worth testing.",
            np: "MVP पहिले सिद्ध गर्नुहोस्, एउटा feature गहिरो गर्नुहोस्, live deploy गर्नुहोस्, decisions explain गर्ने README लेख्नुहोस्, र सबैभन्दा जटिल logic को लागि केही tests थप्नुहोस्।",
            jp: "まずMVPを完成させ、1つの機能を深く作り込み、実際にデプロイし、設計判断を説明するREADMEを書き、最も複雑なロジックにテストを追加しましょう。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I use a UI library (shadcn/ui, MUI) or build everything from scratch?",
        np: "UI library (shadcn/ui, MUI) use गर्ने कि सबै scratch बाट बनाउने?",
        jp: "UIライブラリ（shadcn/ui、MUI）を使うべきか、それともゼロから作るべきか？",
      },
      answer: {
        en: "Use a UI library for generic pieces (buttons, dialogs, dropdowns) — nobody is impressed by a hand-rolled dropdown, and it's wasted time. Build from scratch the pieces that ARE the point of the project (the Kanban drag logic, the block editor, the chart). Reviewers care about the parts that show your specific engineering, not the parts every project has identically.",
        np: "Generic pieces (buttons, dialogs) को लागि library use गर्नुहोस्। Project को core logic (drag, editor) चाहिं आफैं बनाउनुहोस्।",
        jp: "汎用部品（ボタン、ダイアログ）はライブラリを使い、プロジェクトの核となるロジック（ドラッグ処理、エディタ）は自作しましょう。",
      },
    },
    {
      question: {
        en: "Do I need a real backend, or is a mock API enough?",
        np: "Real backend चाहिन्छ, कि mock API पुग्छ?",
        jp: "本物のバックエンドが必要？それともモックAPIで十分？",
      },
      answer: {
        en: "A mock (json-server, MSW, or a public API) is fine for beginner/intermediate projects — the frontend skills are the point. For advanced projects meant to demonstrate full-stack range, a small real backend (Supabase, a simple Express/Next.js API route) adds credibility, but don't let backend work stall the frontend project this list is meant to exercise.",
        np: "Beginner/intermediate मा mock API पुग्छ। Advanced मा real backend ले credibility थप्छ, तर frontend काम रोक्नु हुँदैन।",
        jp: "初中級ではモックAPIで十分。上級では本物のバックエンドが信頼性を高めますが、フロントエンド作業を止めないように。",
      },
    },
    {
      question: {
        en: "How many projects should be in my portfolio?",
        np: "Portfolio मा कति projects हुनुपर्छ?",
        jp: "ポートフォリオにはいくつプロジェクトを載せるべき？",
      },
      answer: {
        en: "Two to three finished, deployed, well-documented projects beat six half-finished ones. Reviewers spend seconds per project — depth and polish on a smaller set reads as more competent than a long list of unfinished clones.",
        np: "दुई-तीन पूरा भएका, deployed, राम्रो documented projects छ अधूरा भन्दा राम्रो हो।",
        jp: "2〜3個の完成度の高いプロジェクトの方が、6個の未完成なものより評価されます。",
      },
    },
  ],
};
