import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_25_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "You've now covered 24 days of individual React mechanics — hooks, patterns, routing, auth, performance, testing. None of that becomes real skill until it survives contact with a project you designed yourself, where nobody hands you the file structure or tells you which hook to reach for. Analogy: 24 days of scales and chords make you technically capable; a project is the first song you write yourself — where your hands have to decide, under real constraints, which chord goes where, with no sheet music to follow. The apps below are ordered by difficulty on purpose — skipping tiers to chase an impressive-sounding project (a Notion clone before you've shipped a Todo app) usually produces something that looks ambitious in a README and falls apart the moment you touch it.",
      np: "अहिलेसम्म 24 दिनमा React का अलग-अलग mechanics — hooks, patterns, routing, auth, performance, testing — सिक्नुभयो। तर ती real skill तब मात्र बन्छन् जब आफैं design गरेको project मा टिक्छन्, जहाँ कसैले file structure दिँदैन वा कुन hook प्रयोग गर्ने भन्दैन। Analogy: 24 दिनको scales र chords ले तपाईंलाई technically सक्षम बनाउँछ; project भनेको तपाईंले आफैं लेखेको पहिलो गीत हो — जहाँ कुन chord कहाँ राख्ने भन्ने निर्णय, कुनै sheet music बिना, तपाईंका हातले नै लिनुपर्छ। तलका apps जानाजान कठिनाइ अनुसार क्रमबद्ध छन् — Todo app नबनाई सिधै Notion clone जस्तो प्रभावशाली project पछ्याउँदा, README मा राम्रो देखिए पनि छोइनासाथ भत्किन्छ।",
      jp: "ここまでの24日間で、フック・パターン・ルーティング・認証・パフォーマンス・テストといった React の個々の仕組みを学んできました。しかし、それらが本当のスキルになるのは、誰もファイル構成を用意してくれず、どのフックを使うべきかも教えてくれない、自分で設計したプロジェクトを実際に生き延びてからです。たとえるなら、24日間のスケールとコード練習は技術的な土台を作りますが、プロジェクトは自分で書く最初の曲——楽譜なしで、どのコードをどこに置くかを自分の手で決めなければならない場面です。以下のアプリはあえて難易度順に並べています。Todo アプリも作らずに Notion クローンのような見栄えのするプロジェクトに飛びつくと、README では野心的に見えても、触れた瞬間に崩れるものになりがちです。",
    },
    {
      en: "Today's topics:\n• <b>Tier 1 — Foundations</b> — single-feature apps that lock in CRUD, controlled forms, and basic data fetching\n• <b>Tier 2 — Multi-feature apps</b> — combining routing, caching, and derived state in one project\n• <b>Tier 3 — Full products</b> — auth, role gating, drag-and-drop, and admin-grade data tables\n• <b>Tier 4 — Team-scale clones</b> — deeply nested state and editor-like UIs that mirror real production tools\n• <b>How to pick your next project</b> — practical rules for choosing and actually finishing, not just starting",
      np: "आजका विषयहरू:\n• <b>Tier 1 — आधारभूत</b> — CRUD, controlled forms र basic data fetching बसाल्ने single-feature apps\n• <b>Tier 2 — Multi-feature apps</b> — एउटै project मा routing, caching र derived state जोड्ने\n• <b>Tier 3 — Full products</b> — auth, role gating, drag-and-drop र admin-grade data tables\n• <b>Tier 4 — Team-scale clones</b> — real production tools जस्तै deeply nested state र editor-like UI\n• <b>अर्को project कसरी छान्ने</b> — छान्ने र वास्तवमै सिद्ध्याउने practical नियमहरू",
      jp: "今日のトピック：\n• <b>Tier 1 — 基礎</b> — CRUD・制御フォーム・基本的なデータ取得を定着させる単機能アプリ\n• <b>Tier 2 — 複数機能アプリ</b> — ルーティング・キャッシュ・派生状態を1つのプロジェクトで組み合わせる\n• <b>Tier 3 — 本格プロダクト</b> — 認証・ロール制御・ドラッグ&ドロップ・管理者向けデータテーブル\n• <b>Tier 4 — チーム規模のクローン</b> — 実際の本番ツールを模した深くネストした状態とエディタ風UI\n• <b>次のプロジェクトの選び方</b> — 選んで実際に完成させるための実践的なルール",
    },
  ],
  sections: [
    {
      title: {
        en: "Tier 1 — Foundations (single-feature apps)",
        np: "Tier 1 — आधारभूत (single-feature apps)",
        jp: "Tier 1 — 基礎（単機能アプリ）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Tier 1 apps exercise exactly one core mechanic each, end to end. The goal isn't impressiveness — it's finishing something completely, including the boring parts (empty states, persistence, edge cases) that tutorials usually skip.",
            np: "Tier 1 का apps ले एउटै core mechanic लाई पूरै end-to-end अभ्यास गराउँछन्। लक्ष्य प्रभावशाली देखिनु होइन — empty state, persistence, edge cases जस्ता 'बोरिङ' भाग सहित पूरै finish गर्नु हो, जुन tutorial हरूले प्रायः छाड्छन्।",
            jp: "Tier 1 のアプリはそれぞれ1つの中核メカニクスだけを最初から最後まで練習します。目的は見栄えではなく、チュートリアルが省略しがちな空状態・永続化・エッジケースも含めて完全に仕上げることです。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Tier 1 — pick one, finish it completely before moving up",
            np: "Tier 1 — एउटा छान्नुहोस्, माथि जानुअघि पूरै सिद्ध्याउनुहोस्",
            jp: "Tier 1 — 1つ選び、次に進む前に完全に仕上げる",
          },
          headers: [
            { en: "Project", np: "Project", jp: "プロジェクト" },
            { en: "Core skills exercised", np: "मुख्य skills", jp: "習得スキル" },
            { en: "Suggested stretch goal", np: "Stretch goal", jp: "ストレッチゴール" },
          ],
          rows: [
            [
              { en: "Todo App", np: "Todo App", jp: "Todo アプリ" },
              {
                en: "Add/edit/delete/toggle, filtering, list rendering & conditionals (Day 3), `useState` + immutability (Day 6)",
                np: "Add/edit/delete/toggle, filtering, list rendering र conditionals (Day 3), `useState` + immutability (Day 6)",
                jp: "追加/編集/削除/切替、フィルタ、リスト描画と条件分岐（Day 3）、`useState`+イミュータブル（Day 6）",
              },
              {
                en: "Add undo/redo with a history stack, or drag-to-reorder items",
                np: "History stack सहित undo/redo, वा drag-to-reorder थप्नुहोस्",
                jp: "履歴スタックによる undo/redo、またはドラッグでの並べ替えを追加",
              },
            ],
            [
              { en: "Weather App", np: "Weather App", jp: "天気アプリ" },
              {
                en: "Calling a public API, loading/error states, `useEffect` & CRUD/API layering (Day 8), controlled search input (Day 4)",
                np: "Public API call, loading/error state, `useEffect` र API layering (Day 8), controlled search input (Day 4)",
                jp: "公開API呼び出し、ローディング/エラー状態、`useEffect`とAPI層構造（Day 8）、制御された検索入力（Day 4）",
              },
              {
                en: "Add geolocation auto-lookup and cache the last successful result for offline viewing",
                np: "Geolocation auto-lookup थप्नुहोस् र offline हेर्न अन्तिम result cache गर्नुहोस्",
                jp: "位置情報による自動検索を追加し、オフライン閲覧用に最後の結果をキャッシュする",
              },
            ],
            [
              { en: "Notes App", np: "Notes App", jp: "メモアプリ" },
              {
                en: "Controlled forms, props/state/children composition (Day 4), building forms with RHF & Zod (Day 7)",
                np: "Controlled forms, props/state/children composition (Day 4), RHF र Zod (Day 7)",
                jp: "制御フォーム、props/state/children構成（Day 4）、RHFとZodでのフォーム構築（Day 7）",
              },
              {
                en: "Add markdown rendering and full-text search across all saved notes",
                np: "Markdown rendering र सबै notes मा full-text search थप्नुहोस्",
                jp: "Markdown 表示と全ノートを対象にした全文検索を追加",
              },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Tier 2 — Multi-feature apps",
        np: "Tier 2 — Multi-feature apps",
        jp: "Tier 2 — 複数機能アプリ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Tier 2 apps force you to combine two or three mechanics in one codebase — routing plus caching, or layout plus derived state. This is where most tutorial-followers stall, because no single tutorial covers this exact combination; you have to make the pieces fit yourself.",
            np: "Tier 2 का apps ले routing + caching, वा layout + derived state जस्ता दुई-तीन mechanics एउटै codebase मा जोड्न बाध्य पार्छन्। यहीँ धेरैजसो tutorial-followers अड्किन्छन्, किनभने कुनै एउटा tutorial ले यो exact combination cover गर्दैन — टुक्राहरू आफैं जोड्नुपर्छ।",
            jp: "Tier 2 のアプリでは、ルーティングとキャッシュ、レイアウトと派生状態など、2〜3個のメカニクスを1つのコードベースで組み合わせる必要があります。この組み合わせをそのまま扱うチュートリアルは存在しないため、多くの人がここで詰まります——自分でパーツを組み合わせる力が試されます。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Tier 2 — combine what you learned across separate days",
            np: "Tier 2 — अलग-अलग days मा सिकेको कुरा जोड्नुहोस्",
            jp: "Tier 2 — 別々の日に学んだことを組み合わせる",
          },
          headers: [
            { en: "Project", np: "Project", jp: "プロジェクト" },
            { en: "Core skills exercised", np: "मुख्य skills", jp: "習得スキル" },
            { en: "Suggested stretch goal", np: "Stretch goal", jp: "ストレッチゴール" },
          ],
          rows: [
            [
              { en: "Movie Search", np: "Movie Search", jp: "映画検索" },
              {
                en: "Debounced search via a custom hook (Day 11), dynamic detail routes (Day 18), TanStack Query caching (Day 19)",
                np: "Custom hook मार्फत debounced search (Day 11), dynamic detail routes (Day 18), TanStack Query caching (Day 19)",
                jp: "カスタムフックによるデバウンス検索（Day 11）、動的詳細ルート（Day 18）、TanStack Query によるキャッシュ（Day 19）",
              },
              {
                en: "Add a persisted \"watchlist\" backed by Zustand global state (Day 19)",
                np: "Zustand global state (Day 19) मा आधारित persisted 'watchlist' थप्नुहोस्",
                jp: "Zustand のグローバル状態（Day 19）を使った永続的な「ウォッチリスト」を追加",
              },
            ],
            [
              { en: "Expense Tracker (leveled up)", np: "Expense Tracker (upgraded)", jp: "家計簿アプリ（強化版）" },
              {
                en: "You built a smaller version in Day 7 — extend it with `useReducer` for complex state (Day 9) and real persistence instead of memory",
                np: "Day 7 मा सानो version बनाइसक्नुभयो — जटिल state को लागि `useReducer` (Day 9) र memory को सट्टा real persistence थपेर extend गर्नुहोस्",
                jp: "Day 7 で小さい版を作りました——複雑な状態には `useReducer`（Day 9）を使い、メモリではなく実際の永続化に拡張しましょう",
              },
              {
                en: "Add a monthly budget with over-budget alerts and a spending-by-category chart",
                np: "Over-budget alert सहित monthly budget र category अनुसारको spending chart थप्नुहोस्",
                jp: "予算超過アラート付きの月次予算と、カテゴリ別支出チャートを追加",
              },
            ],
            [
              { en: "Dashboard", np: "Dashboard", jp: "ダッシュボード" },
              {
                en: "Layout routes (Day 18), per-widget Suspense boundaries (Day 14), memoization to isolate widget re-renders (Day 10)",
                np: "Layout routes (Day 18), per-widget Suspense boundaries (Day 14), widget re-render छुट्याउने memoization (Day 10)",
                jp: "レイアウトルート（Day 18）、ウィジェット単位の Suspense 境界（Day 14）、再レンダーを分離するメモ化（Day 10）",
              },
              {
                en: "Make widgets user-configurable — drag to rearrange, show/hide, and persist the layout",
                np: "Widgets लाई user-configurable बनाउनुहोस् — drag गरेर rearrange, show/hide, र layout persist गर्नुहोस्",
                jp: "ウィジェットをユーザー設定可能にする——ドラッグでの並び替え、表示/非表示、レイアウトの永続化",
              },
            ],
            [
              { en: "Chat App", np: "Chat App", jp: "チャットアプリ" },
              {
                en: "Optimistic sends via TanStack Query mutations (Day 21), auto-scroll refs & uncontrolled message input (Day 11/12)",
                np: "TanStack Query mutations (Day 21) मार्फत optimistic sends, auto-scroll refs र uncontrolled input (Day 11/12)",
                jp: "TanStack Query のミューテーションによる楽観的送信（Day 21）、自動スクロール ref と非制御入力（Day 11/12）",
              },
              {
                en: "Add typing indicators and read receipts using a real-time backend (Firebase, Supabase, or WebSockets)",
                np: "Real-time backend (Firebase, Supabase, वा WebSockets) प्रयोग गरी typing indicator र read receipt थप्नुहोस्",
                jp: "リアルタイムバックエンド（Firebase、Supabase、WebSocket）を使ってタイピング表示と既読機能を追加",
              },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Tier 3 — Full products",
        np: "Tier 3 — Full products",
        jp: "Tier 3 — 本格プロダクト",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Tier 3 apps are shaped like real products: they need auth, role-based access, and data at scale (tables with sort/filter/pagination, not a hardcoded array of five items). Treat these as the ones you actually deploy and put on a resume.",
            np: "Tier 3 का apps वास्तविक product जस्तै आकारका हुन्छन् — auth, role-based access, र scale भएको data (hardcoded 5-item array होइन, sort/filter/pagination भएको table) चाहिन्छ। यिनैलाई deploy गरेर resume मा राख्नुहोस्।",
            jp: "Tier 3 のアプリは実際のプロダクトの形をしています——認証、ロールベースのアクセス制御、そしてスケールするデータ（5件だけのハードコード配列ではなく、ソート・フィルタ・ページネーション付きのテーブル）が必要です。これらこそ実際にデプロイして履歴書に載せるべきものです。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Tier 3 — production-shaped, resume-worthy",
            np: "Tier 3 — production जस्तो, resume-worthy",
            jp: "Tier 3 — 本番規模で履歴書に載る価値がある",
          },
          headers: [
            { en: "Project", np: "Project", jp: "プロジェクト" },
            { en: "Core skills exercised", np: "मुख्य skills", jp: "習得スキル" },
            { en: "Suggested stretch goal", np: "Stretch goal", jp: "ストレッチゴール" },
          ],
          rows: [
            [
              { en: "Kanban Board", np: "Kanban Board", jp: "かんばんボード" },
              {
                en: "Compound-component columns (Day 11), optimistic reordering with mutations (Day 21)",
                np: "Compound-component columns (Day 11), mutations सहित optimistic reordering (Day 21)",
                jp: "複合コンポーネントの列構成（Day 11）、ミューテーションによる楽観的な並べ替え（Day 21）",
              },
              {
                en: "Add real-time multi-user sync so two open tabs see the same board update live",
                np: "Real-time multi-user sync थप्नुहोस् ताकि दुई tab मा board update live देखियोस्",
                jp: "2つのタブで同じボードの更新がリアルタイムに反映されるマルチユーザー同期を追加",
              },
            ],
            [
              { en: "E-commerce Store", np: "E-commerce Store", jp: "ECストア" },
              {
                en: "Global cart state via Zustand (Day 19), protected account/checkout routes with auth (Day 20), checkout forms (Day 7)",
                np: "Zustand मार्फत global cart state (Day 19), auth सहित protected checkout routes (Day 20), checkout forms (Day 7)",
                jp: "Zustand によるグローバルカート状態（Day 19）、認証付き保護ルートの決済/アカウント画面（Day 20）、決済フォーム（Day 7）",
              },
              {
                en: "Add a protected order-history page and a discount-code flow validated with Zod",
                np: "Protected order-history page र Zod ले validate गरेको discount-code flow थप्नुहोस्",
                jp: "保護された注文履歴ページと、Zod で検証するクーポンコードの流れを追加",
              },
            ],
            [
              { en: "Admin Panel", np: "Admin Panel", jp: "管理パネル" },
              {
                en: "Role-gated views & protected routes (Day 20), data tables with sort/filter/pagination and bulk mutations (Day 21)",
                np: "Role-gated views र protected routes (Day 20), sort/filter/pagination भएका data table र bulk mutations (Day 21)",
                jp: "ロール制御ビューと保護ルート（Day 20）、ソート/フィルタ/ページネーション付きデータテーブルと一括更新（Day 21）",
              },
              {
                en: "Add CSV export and an audit log recording every admin action",
                np: "CSV export र हरेक admin action record गर्ने audit log थप्नुहोस्",
                jp: "CSVエクスポートと、すべての管理操作を記録する監査ログを追加",
              },
            ],
            [
              { en: "GitHub Explorer", np: "GitHub Explorer", jp: "GitHub エクスプローラー" },
              {
                en: "Paginated public API search with TanStack Query (Day 19/21), dynamic route params (Day 18), skeleton loading via Suspense (Day 14)",
                np: "TanStack Query (Day 19/21) ले paginated public API search, dynamic route params (Day 18), Suspense मार्फत skeleton loading (Day 14)",
                jp: "TanStack Query によるページ分割された公開API検索（Day 19/21）、動的ルートパラメータ（Day 18）、Suspense によるスケルトン表示（Day 14）",
              },
              {
                en: "Add a side-by-side repo comparison view backed by two cached queries",
                np: "दुई cached queries मा आधारित side-by-side repo comparison view थप्नुहोस्",
                jp: "2つのキャッシュされたクエリを使った、リポジトリの並列比較ビューを追加",
              },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Tier 4 — Team-scale clones",
        np: "Tier 4 — Team-scale clones",
        jp: "Tier 4 — チーム規模のクローン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Tier 4 clones deliberately copy tools built by real engineering teams — Trello, Notion. You will not finish a feature-complete clone, and that's expected. The value is in how far you get: a working nested-board reducer or a working block editor is a serious engineering artifact on its own, even unfinished.",
            np: "Tier 4 का clones ले वास्तविक engineering team हरूले बनाएका tools (Trello, Notion) लाई जानाजान copy गर्छन्। Feature-complete clone सिद्धिने अपेक्षा गरिएको छैन। मूल्य त तपाईं कहाँसम्म पुग्नुभयो भन्नेमा छ — काम गर्ने nested-board reducer वा block editor आफैंमा गम्भीर engineering artifact हो, अधूरो भए पनि।",
            jp: "Tier 4 のクローンは、実際のエンジニアリングチームが作ったツール（Trello、Notion）を意図的に模倣します。機能完全なクローンを完成させることは期待されていません。価値はどこまで到達したかにあります——動作するネストされたボードの reducer や動作するブロックエディタは、未完成であっても立派なエンジニアリング成果物です。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Tier 4 — depth over completeness",
            np: "Tier 4 — completeness भन्दा depth",
            jp: "Tier 4 — 完成度より深さ",
          },
          headers: [
            { en: "Project", np: "Project", jp: "プロジェクト" },
            { en: "Core skills exercised", np: "मुख्य skills", jp: "習得スキル" },
            { en: "Suggested stretch goal", np: "Stretch goal", jp: "ストレッチゴール" },
          ],
          rows: [
            [
              { en: "Trello Clone", np: "Trello Clone", jp: "Trello クローン" },
              {
                en: "`useReducer` for deeply nested board/list/card state (Day 9), compound components for boards and lists (Day 11)",
                np: "Deeply nested board/list/card state को लागि `useReducer` (Day 9), boards र lists को लागि compound components (Day 11)",
                jp: "深くネストしたボード/リスト/カードの状態管理に `useReducer`（Day 9）、ボードとリストの複合コンポーネント（Day 11）",
              },
              {
                en: "Add board-level permissions (owner/editor/viewer) reusing your Day 20 auth patterns",
                np: "Day 20 का auth patterns पुन: प्रयोग गरी board-level permissions (owner/editor/viewer) थप्नुहोस्",
                jp: "Day 20 の認証パターンを再利用して、ボード単位の権限（オーナー/編集者/閲覧者）を追加",
              },
            ],
            [
              { en: "Notion Clone", np: "Notion Clone", jp: "Notion クローン" },
              {
                en: "Polymorphic block components rendered via an `as`-style prop (Day 12), nested/layout routes for pages (Day 18)",
                np: "`as`-style prop मार्फत polymorphic block components (Day 12), pages को लागि nested/layout routes (Day 18)",
                jp: "`as` 風プロップで描画するポリモーフィックなブロックコンポーネント（Day 12）、ページ用のネスト/レイアウトルート（Day 18）",
              },
              {
                en: "Add keyboard-driven slash commands and drag-to-reorder blocks",
                np: "Keyboard-driven slash commands र drag-to-reorder blocks थप्नुहोस्",
                jp: "キーボード操作のスラッシュコマンドと、ドラッグでのブロック並べ替えを追加",
              },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "<b>These are the hardest to finish — and that's the point.</b> A half-finished Notion clone with a working block editor and nothing else still demonstrates more engineering judgment than ten completed Todo apps. Depth beats breadth once you're past the beginner tier.",
            np: "यी सबैभन्दा गाह्रो सिद्ध्याउन — र त्यही नै मुख्य कुरा हो। काम गर्ने block editor मात्र भएको आधा-सकिएको Notion clone ले पनि दश पूरा भएका Todo apps भन्दा बढी engineering judgment देखाउँछ। Beginner tier पार गरेपछि depth ले breadth लाई जित्छ।",
            jp: "これらは最も完成が難しい——それが重要な点です。動作するブロックエディタだけの半完成の Notion クローンでも、完成した Todo アプリ10個より多くの判断力を示します。初級レベルを超えたら、幅よりも深さが勝ちます。",
          },
        },
      ],
    },
    {
      title: {
        en: "How to pick your next project",
        np: "अर्को project कसरी छान्ने",
        jp: "次のプロジェクトの選び方",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Three rules that matter more than the list above:</b>\n• <b>Pick one that scares you slightly.</b> If you can already picture the entire implementation before writing a line, it's too easy — the skill-building happens in the parts you don't yet know how to build.\n• <b>Always add ONE feature beyond the obvious scope.</b> A Todo app with undo/redo, or a Weather app with offline caching, forces you to solve a problem the \"standard\" version doesn't have — that's usually where the real learning is.\n↳ Pick the extra feature before you start, not after — bolting it on later teaches you far less than designing for it from the beginning.\n• <b>Deploy every project, even if it's rough.</b> An unpolished app running live on Vercel/Netlify is worth more than a polished one that only runs on `localhost`. Deployment surfaces problems (env vars, build errors, CORS) that never show up in dev mode, and those are lessons in themselves.",
            np: "<b>माथिको list भन्दा बढी महत्त्वपूर्ण तीन नियम:</b>\n• <b>अलिकति डर लाग्ने project छान्नुहोस्।</b> कोड लेख्नु अघि नै पूरै implementation कल्पना गर्न सक्नुभयो भने, त्यो धेरै सजिलो हो — नयाँ skill त तपाईंलाई अझै थाहा नभएको भाग बनाउँदा मात्र बन्छ।\n• <b>सधैं मौलिक scope भन्दा बाहिर एउटा feature थप्नुहोस्।</b> Undo/redo भएको Todo app, वा offline caching भएको Weather app ले 'standard' version मा नभएको समस्या समाधान गर्न बाध्य पार्छ — वास्तविक सिकाइ प्रायः त्यहीँ हुन्छ।\n↳ यो extra feature सुरु गर्नु अघि नै छान्नुहोस्, पछि होइन — पछि थप्दा सिकाइ धेरै कम हुन्छ, सुरुदेखि नै त्यसको लागि design गर्दा बढी हुन्छ।\n• <b>हरेक project deploy गर्नुहोस्, जति नै rough भए पनि।</b> `localhost` मा मात्र चल्ने polished app भन्दा Vercel/Netlify मा live चलिरहेको अधुरो app धेरै मूल्यवान हुन्छ। Deployment ले dev mode मा कहिल्यै नदेखिने समस्याहरू (env vars, build errors, CORS) देखाउँछ, र ती आफैंमा पाठ हुन्।",
            jp: "<b>上記のリストより重要な3つのルール：</b>\n• <b>少し怖いと感じるものを選ぶ。</b> コードを書く前に実装全体が想像できてしまうなら、それは簡単すぎます——スキルはまだ作り方がわからない部分でこそ身につきます。\n• <b>常に想定スコープを超える機能を1つ追加する。</b> Undo/redo 付きの Todo アプリや、オフラインキャッシュ付きの天気アプリは、「標準版」にはない問題を解決させます——本当の学びは大抵そこにあります。\n↳ この追加機能は始める前に決めておくこと。後付けでは学びが少なく、最初から設計に組み込む方がずっと多く学べます。\n• <b>荒削りでも必ずデプロイする。</b> `localhost` でしか動かない完成度の高いアプリより、Vercel/Netlify で実際に動いている未完成のアプリの方が価値があります。デプロイは開発モードでは決して現れない問題（環境変数、ビルドエラー、CORS）を表面化させ、それ自体が学びになります。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I follow a tutorial for these?",
        np: "यी project हरूको लागि tutorial पछ्याउने?",
        jp: "これらにはチュートリアルに従うべき？",
      },
      answer: {
        en: "Not for the whole project — that defeats the purpose. It's fine to reference a tutorial for one unfamiliar piece (e.g. \"how does drag-and-drop reordering work\") and then close the tab and implement the rest yourself. If you follow a tutorial for the entire build, you're practicing typing, not engineering — you won't have made any of the decisions that come up when you get stuck.",
        np: "पूरा project को लागि होइन — त्यसले उद्देश्य नै बिगार्छ। एउटा अपरिचित भाग (जस्तै 'drag-and-drop reordering कसरी काम गर्छ') को लागि tutorial हेर्नु ठिकै हो, तर बाँकी आफैं implement गर्नुहोस्। पूरै tutorial पछ्याउनु भनेको typing अभ्यास हो, engineering होइन — अड्किंदा आउने decisions तपाईंले लिनुभएको हुँदैन।",
        jp: "プロジェクト全体には使わないでください——それでは目的が台無しです。知らない1つの部分（例：「ドラッグ&ドロップの並べ替えはどう実装するか」）だけチュートリアルを参照し、あとは自分で実装するのは問題ありません。全体をチュートリアル通りに作ると、それはタイピングの練習であってエンジニアリングではありません——詰まった時に必要な意思決定を一度も経験しないままになります。",
      },
    },
    {
      question: {
        en: "How long should each project take?",
        np: "हरेक project लाई कति समय लाग्नुपर्छ?",
        jp: "各プロジェクトにどれくらい時間をかけるべき？",
      },
      answer: {
        en: "Roughly: Tier 1 apps in a weekend, Tier 2 apps in 1-2 weeks of evenings, Tier 3 apps in 3-4 weeks, Tier 4 clones can run a month or more if you're doing it alongside a job or other days of this track. If a Tier 1 app is taking more than 2 weeks, that's a signal to cut scope, not to push through — you likely picked too many features instead of one deep one.",
        np: "अनुमानित: Tier 1 apps एक weekend मा, Tier 2 apps 1-2 हप्ता साँझ-साँझमा, Tier 3 apps 3-4 हप्ता, Tier 4 clones job वा अरू days सँगै गर्दा एक महिना वा बढी। Tier 1 app 2 हप्ता भन्दा बढी लाग्दैछ भने, त्यो जोड लगाएर गर्ने संकेत होइन, scope घटाउने संकेत हो — प्रायः एउटा गहिरो feature भन्दा धेरै feature छानिएको हुन्छ।",
        jp: "目安：Tier 1 は週末で、Tier 2 は平日夜で1〜2週間、Tier 3 は3〜4週間、Tier 4 のクローンは仕事や他の日と並行するなら1ヶ月以上かかることもあります。Tier 1 のアプリに2週間以上かかっているなら、それは無理に続ける合図ではなく、スコープを削る合図です——1つを深く掘るのではなく機能を詰め込みすぎている可能性が高いです。",
      },
    },
    {
      question: {
        en: "What if I get stuck?",
        np: "अड्किएँ भने के गर्ने?",
        jp: "詰まったらどうすればいい？",
      },
      answer: {
        en: "Getting stuck is the point — it's the signal that you've hit the edge of what the earlier days taught you directly. Search for the specific mechanism you're missing (not \"how to build a Kanban board\", but \"how to reorder an array with drag-and-drop in React\"), read the docs for the one library involved, and give it a real 30-60 minute attempt before looking at someone else's solution. If you're stuck longer than that on one specific bug, step away and debug with Day 17's tools (React DevTools, breakpoints) rather than guessing.",
        np: "अड्किनु नै मुख्य कुरा हो — यसले अघिल्ला days ले सिकाएको सीमा भेटिएको संकेत गर्छ। ('Kanban board कसरी बनाउने' होइन, बरु 'React मा drag-and-drop ले array कसरी reorder गर्छ' जस्तो) specific mechanism search गर्नुहोस्, सम्बन्धित library को docs पढ्नुहोस्, र अरूको solution हेर्नु अघि 30-60 मिनेट आफैं प्रयास गर्नुहोस्। एउटै bug मा त्यो भन्दा बढी अड्किए, अनुमान लगाउनुको सट्टा Day 17 का tools (React DevTools, breakpoints) प्रयोग गरेर debug गर्नुहोस्।",
        jp: "詰まることこそが重要です——それは、これまでの日々が直接教えてくれた範囲の限界に達した合図です。「Kanban ボードの作り方」ではなく「React でドラッグ&ドロップによる配列の並べ替え方法」のように具体的な仕組みを検索し、関係するライブラリのドキュメントを読み、他人の解答を見る前に本気で30〜60分試してください。同じバグにそれ以上詰まったら、当て推量ではなく Day 17 のツール（React DevTools、ブレークポイント）でデバッグしましょう。",
      },
    },
    {
      question: {
        en: "Should I use TypeScript for all of these?",
        np: "यी सबैको लागि TypeScript प्रयोग गर्ने?",
        jp: "これらすべてに TypeScript を使うべき？",
      },
      answer: {
        en: "Yes, by this point in the track — Day 15 covered typing props, hooks, and events, and every project here benefits from it. TypeScript catches the exact mistakes that are easy to make in a bigger app (passing the wrong shape of data between an API response and a component) before they become runtime bugs. The one exception: if you're building a Tier 1 app purely to experiment with a new idea quickly, plain JS is fine for that throwaway spike.",
        np: "यो track को यो चरणमा, हो — Day 15 मा props, hooks, events type गर्ने सिकियो, र यहाँका सबै projects लाई त्यसले फाइदा दिन्छ। ठूलो app मा हुने easy mistakes (API response र component बीच data को गलत shape पास हुनु) लाई runtime bug बन्नु अघि नै TypeScript ले समात्छ। एउटै अपवाद: कुनै नयाँ idea छिटो experiment गर्न मात्र बनाउने Tier 1 throwaway app को लागि plain JS ठिकै हुन्छ।",
        jp: "トラックのこの段階では、はい使うべきです——Day 15 で props・hooks・イベントの型付けを学んでおり、ここにあるすべてのプロジェクトがその恩恵を受けます。TypeScript は、大きなアプリで起きがちなミス（API レスポンスとコンポーネントの間でデータの形が食い違う）を実行時バグになる前に捕まえます。唯一の例外は、新しいアイデアを素早く試すだけの使い捨ての Tier 1 スパイクで、その場合は plain JS でも構いません。",
      },
    },
  ],
};
