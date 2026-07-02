import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_17_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Tests (Day 16) catch bugs before they ship. Debugging is what you do when a bug ships anyway — or when you're mid-development and something behaves unexpectedly. Analogy: testing is a pre-flight checklist run before takeoff; debugging is what the pilot does mid-flight when a warning light comes on — you need instruments (DevTools) that tell you exactly what's happening right now, not just whether the plane passed inspection.\n\nToday is about the instruments: React DevTools, the browser's own DevTools, and the handful of error messages that show up constantly in React apps and what they actually mean.",
      np: "Testing (Day 16) ले bug ship हुनुअघि नै पक्रन्छ। Debugging भनेको bug ship भइसकेपछि — वा development बीचमा नै — के भइरहेको छ पत्ता लगाउने काम हो।\n\nAnalogy: testing उडान अघिको checklist हो; debugging उडानको बीचमा warning light बल्दा pilot ले गर्ने काम हो — instruments (DevTools) चाहिन्छ जसले अहिले के भइरहेको छ भन्ने देखाउँछ।\n\nआज हामी instruments सिक्छौं: React DevTools, browser को आफ्नै DevTools, र React मा बारम्बार देखिने error messages को अर्थ।",
      jp: "テスト（Day 16）はバグを出荷前に防ぎます。デバッグはバグが出荷された後、あるいは開発中に予期せぬ動作が起きた時に行う作業です。\n\n例え：テストは離陸前のチェックリスト、デバッグは飛行中に警告灯が点いた時にパイロットが行う対応。今何が起きているかを正確に教えてくれる計器（DevTools）が必要です。\n\n今日はその計器を学びます — React DevTools、ブラウザ自身の DevTools、そして React アプリで頻繁に出るエラーメッセージの意味です。",
    },
    {
      en: "Today's topics:\n\n• <b>React DevTools deep dive</b> — Components tab (live props/state/hooks inspection and editing), Profiler tab's \"highlight updates\" setting\n• <b>Browser DevTools for React</b> — Elements tab (rendered DOM vs JSX), Console warnings\n• <b>Performance tab</b> — recording a profile, reading a flame chart, spotting a blocked main thread\n• <b>Network tab debugging</b> — failed/slow requests, payload inspection, throttling, replaying requests\n• <b>Source maps</b> — what they are, why dev shows real TSX, why they should never ship to production\n• <b>Common React errors</b> — a reference table of the errors you'll see most, their causes and fixes",
      np: "आजका topics:\n\n• <b>React DevTools deep dive</b> — Components tab (live props/state/hooks inspect र edit), Profiler को \"highlight updates\" setting\n• <b>Browser DevTools</b> — Elements tab (rendered DOM vs JSX), Console warnings\n• <b>Performance tab</b> — profile record गर्ने, flame chart पढ्ने, blocked main thread पत्ता लगाउने\n• <b>Network tab debugging</b> — failed/slow requests, payload inspection, throttling, request replay\n• <b>Source maps</b> — के हो, dev मा real TSX किन देखिन्छ, production मा किन नपठाउने\n• <b>Common React errors</b> — बारम्बार देखिने errors को reference table",
      jp: "今日のトピック：\n\n• <b>React DevTools 詳解</b> — Components タブ（props/state/hooks をライブ検査・編集）、Profiler の「highlight updates」設定\n• <b>ブラウザ DevTools</b> — Elements タブ（実際の DOM と JSX の比較）、Console の警告\n• <b>Performance タブ</b> — プロファイル記録、フレームチャートの読み方、メインスレッドのブロック検出\n• <b>Network タブでのデバッグ</b> — 失敗/遅延リクエスト、ペイロード確認、スロットリング、リクエストの再送\n• <b>ソースマップ</b> — 仕組み、開発時に実際の TSX が表示される理由、本番に含めてはいけない理由\n• <b>よくある React エラー</b> — 頻出エラーの原因と対処の一覧",
    },
  ],
  sections: [
    {
      title: {
        en: "React DevTools deep dive — Components tab",
        np: "React DevTools deep dive — Components tab",
        jp: "React DevTools 詳解 — Components タブ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The React DevTools browser extension adds two tabs to your browser's DevTools: <b>Components</b> and <b>Profiler</b>. Day 10 introduced the Profiler for render timing. Today's focus is the Components tab — the single most useful tool for everyday React debugging.\n\nAnalogy: the Components tab is an X-ray of your app. The Elements tab (plain browser DevTools) shows you the skeleton — the rendered `<div>`s and `<span>`s. The Components tab shows you the organs underneath — which component produced that markup, what props it received, what state it currently holds, and which hooks are running inside it.\n\n<b>What you can inspect live:</b>\n• Select any component in the tree — its props, state, and hooks appear in a side panel, each labeled by name (not just index)\n• Hooks show up in the order they were called, labeled by type (`State`, `Effect`, `Ref`, `Context`, `Memo`) — a custom hook's internal hooks are nested underneath it\n• The \"rendered by\" chain shows you the parent hierarchy so you can trace where a prop actually came from\n\n<b>Editing values live — the real power move:</b> double-click any prop or state value in the panel and change it directly. React re-renders the component with your new value immediately, without touching your code. This lets you reproduce an edge case (an empty array, a `null` user, an error string) in seconds instead of hunting for the exact user action that would have produced it.",
            np: "React DevTools extension ले browser DevTools मा दुई tabs थप्छ: <b>Components</b> र <b>Profiler</b>। Day 10 मा Profiler render timing को लागि चिनियौं। आज Components tab मा focus गर्छौं — दैनिक React debugging को सबैभन्दा उपयोगी tool।\n\nAnalogy: Components tab तपाईंको app को X-ray हो। Elements tab (साधारण browser DevTools) ले skeleton देखाउँछ — rendered `<div>` र `<span>` हरू। Components tab ले त्यो markup कुन component बाट आयो, के props पायो, अहिले के state छ, र भित्र कुन hooks चलिरहेका छन् भन्ने देखाउँछ।\n\n<b>Live inspect गर्न सकिने कुराहरू:</b>\n• Tree मा कुनै पनि component select गर्नुहोस् — props, state, र hooks side panel मा नामले label गरिएर देखिन्छ\n• Hooks call भएको क्रममा देखिन्छन्, type अनुसार label हुन्छन् (`State`, `Effect`, `Ref`, `Context`, `Memo`) — custom hook भित्रका hooks nested देखिन्छन्\n• \"rendered by\" chain ले parent hierarchy देखाउँछ जसले prop कहाँबाट आयो भनी trace गर्न मद्दत गर्छ\n\n<b>Live values edit गर्ने — असली शक्ति:</b> panel मा कुनै prop वा state value मा double-click गरेर सिधै बदल्नुहोस्। React ले code नछोई नयाँ value सँग तुरुन्तै re-render गर्छ। यसले edge case (empty array, `null` user, error string) reproduce गर्न सेकेन्डमा सम्भव बनाउँछ — त्यो सटीक user action खोज्नु नपरी।",
            jp: "React DevTools 拡張機能はブラウザの DevTools に <b>Components</b> と <b>Profiler</b> の2つのタブを追加します。Day 10 では Profiler をレンダー時間の計測に使いました。今日は日々の React デバッグで最も役立つ Components タブに焦点を当てます。\n\n例え：Components タブはアプリの X線写真です。Elements タブ（通常のブラウザ DevTools）は骨格 — レンダーされた `<div>` や `<span>` — を見せます。Components タブはその下の臓器、つまりどのコンポーネントがそのマークアップを生成し、どんな props を受け取り、今どんな state を持ち、内部でどのフックが動いているかを見せます。\n\n<b>ライブで検査できること：</b>\n• ツリーで任意のコンポーネントを選択すると props・state・hooks がサイドパネルに名前付きで表示される（インデックスだけではない）\n• hooks は呼び出された順に `State`・`Effect`・`Ref`・`Context`・`Memo` のようなラベルで表示され、カスタムフック内部の hooks はネストして表示される\n• 「rendered by」チェーンで親階層をたどり、prop がどこから来たか追跡できる\n\n<b>値をライブ編集する — 一番強力な使い方：</b> パネル内の任意の prop や state をダブルクリックして直接変更。React はコードに触れず即座に新しい値で再レンダーします。これにより空配列・`null` のユーザー・エラー文字列などのエッジケースを、正確な操作手順を探さずに数秒で再現できます。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "<b>\"Highlight updates when components render\" — the setting worth turning on:</b> in the Components tab's settings (gear icon), enable this and every component that re-renders flashes a colored outline on screen in real time as you interact with the app. A component that flashes on every keystroke somewhere unrelated is almost always missing memoization (Day 10) or is subscribed to state it doesn't need.\n\nAnalogy: it's like sprinkling flour on a floor to see footprints — you don't have to guess who walked where, you just watch where the flashes land.",
            np: "<b>\"Highlight updates when components render\" — on गर्नुपर्ने setting:</b> Components tab को settings (gear icon) मा यो enable गर्नुहोस्, अनि app सँग interact गर्दा re-render हुने हरेक component screen मा real-time मा coloured outline सँग flash हुन्छ। असम्बन्धित ठाउँमा हरेक keystroke मा flash हुने component प्रायः memoization (Day 10) छुटेको वा अनावश्यक state मा subscribed भएको संकेत हो।\n\nAnalogy: भुइँमा पिठो छरेर पदचिन्ह हेर्नु जस्तै — को कहाँ हिँड्यो अनुमान गर्नु पर्दैन, flash कहाँ पर्छ हेरे पुग्छ।",
            jp: "「highlight updates when components render」— 有効にすべき設定：Components タブの設定（歯車アイコン）でこれを有効にすると、アプリを操作する間、再レンダーされたコンポーネントが画面上でリアルタイムに色付きの枠で光ります。無関係な場所でキー入力のたびに光るコンポーネントは、たいてい memoization（Day 10）が抜けているか、不要な state を購読しています。\n\n例え：床に小麦粉を撒いて足跡を見るようなもの — 誰がどこを歩いたか推測する必要はなく、光った場所を見るだけです。",
          },
        },
      ],
    },
    {
      title: {
        en: "Browser DevTools — Elements tab and Console",
        np: "Browser DevTools — Elements tab र Console",
        jp: "ブラウザ DevTools — Elements タブと Console",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The plain Elements tab (no React extension needed) shows the actual DOM the browser rendered — this is your ground truth. When your UI doesn't look right, the first question is always: <b>is the DOM what I expected, or did my JSX not produce what I thought it would?</b>\n\nCommon Elements-tab findings:\n• A `className` you expected isn't there — check for a typo, a conditional that evaluated false, or a `cn()`/`clsx()` merge that dropped it\n• An element you expected to be `hidden` or removed is still present — a conditional render (`{condition && <X />}`) evaluated truthy when you thought it wouldn't\n• Extra whitespace or wrapper `<div>`s you didn't write — often from a UI library's default wrapper, or a `Fragment` you forgot to use instead of a `<div>`\n\n<b>The Console tab</b> is where React's own development-mode warnings appear — these only show in dev builds (stripped in production) and are worth reading, not dismissing:\n• `Warning: Each child in a list should have a unique \"key\" prop` — missing or non-unique keys, see the errors table below\n• `Warning: Failed prop type` — from libraries using PropTypes, or a TypeScript type that was bypassed with `any`/`as`\n• `Warning: Cannot update a component while rendering a different component` — setState called during another component's render (also covered below)\n• React's warnings usually include a component stack trace — read it top to bottom to find exactly which component triggered the warning, not just which component received it",
            np: "साधारण Elements tab (React extension नचाहिने) ले browser ले actually render गरेको DOM देखाउँछ — यही ground truth हो। UI राम्रो नदेखिँदा पहिलो प्रश्न सधैं: <b>DOM मैले सोचे जस्तै छ, कि JSX ले सोचे जस्तो output दिएन?</b>\n\nसाधारण Elements-tab findings:\n• अपेक्षा गरेको `className` छैन — typo, false भएको conditional, वा `cn()`/`clsx()` merge ले हटाएको हुन सक्छ\n• `hidden` वा removed हुनुपर्ने element अझै छ — conditional render (`{condition && <X />}`) truthy भयो जुन तपाईंले सोचेको थिएन\n• तपाईंले नलेखेको extra whitespace वा wrapper `<div>` — प्रायः UI library को default wrapper, वा `Fragment` को सट्टा `<div>` भुलेको\n\n<b>Console tab</b> मा React को आफ्नै development-mode warnings देखिन्छन् — यी dev build मा मात्र देखिन्छन् (production मा हटिन्छन्) र बेवास्ता नगरी पढ्नुपर्छ:\n• `Warning: Each child in a list should have a unique \"key\" prop` — missing वा non-unique keys, तलको errors table हेर्नुहोस्\n• `Warning: Failed prop type` — PropTypes प्रयोग गर्ने libraries बाट, वा `any`/`as` ले bypass गरेको TypeScript type\n• `Warning: Cannot update a component while rendering a different component` — अर्को component render हुँदा setState call भयो (तल पनि cover गरिएको)\n• React को warnings मा प्रायः component stack trace हुन्छ — माथिबाट तल पढ्नुहोस्, कुन component ले warning receive गर्यो होइन, कसले trigger गर्यो भनी थाहा पाउन",
            jp: "通常の Elements タブ（React 拡張不要）はブラウザが実際にレンダーした DOM を表示 — これが根拠となる真実です。UI がおかしい時、最初に問うべきは常に：<b>DOM は期待通りか、それとも JSX が期待した出力を生まなかったのか？</b>\n\nElements タブでよくある発見：\n• 期待した `className` がない — タイプミス、false になった条件分岐、`cn()`/`clsx()` のマージで消えた可能性\n• `hidden` や削除されているはずの要素が残っている — 条件レンダー（`{condition && <X />}`）が想定外に truthy と評価された\n• 書いていないはずの余分な空白やラッパー `<div>` — UI ライブラリのデフォルトラッパーか、`Fragment` を使い忘れた\n\n<b>Console タブ</b>には React 自身の開発モード警告が表示されます — 開発ビルドのみ（本番では除去）で、無視せず読む価値があります：\n• `Warning: Each child in a list should have a unique \"key\" prop` — key の欠如や重複、後述の表を参照\n• `Warning: Failed prop type` — PropTypes を使うライブラリから、または `any`/`as` で回避した TypeScript の型\n• `Warning: Cannot update a component while rendering a different component` — 他コンポーネントのレンダー中に setState が呼ばれた（後述）\n• React の警告には通常コンポーネントのスタックトレースが付く — 上から下に読み、警告を「受け取った」コンポーネントでなく「引き起こした」コンポーネントを特定する",
          },
        },
      ],
    },
    {
      title: {
        en: "Performance tab — flame charts and blocked main thread",
        np: "Performance tab — flame charts र blocked main thread",
        jp: "Performance タブ — フレームチャートとメインスレッドのブロック",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React DevTools' Profiler tells you which <b>component</b> re-rendered and for how long. Chrome's built-in <b>Performance</b> tab tells you what the <b>whole browser</b> was doing — JavaScript execution, layout, painting, garbage collection — all on one timeline. Use it when something feels janky (stuttering scroll, a frozen click) but you're not sure it's even React's fault.\n\n<b>Recording a profile:</b> open DevTools → Performance tab → click Record → perform the janky interaction → stop recording. Chrome then shows a timeline with a <b>flame chart</b> underneath.\n\n<b>Reading the flame chart:</b>\n• Each horizontal bar is a function call; a bar stacked on top of another means the top function was called by the one below it\n• Width = time spent; a wide bar is a long-running function — that's your suspect\n• Yellow bars are usually JavaScript, purple is layout/rendering (recalculating styles, reflow), green is painting\n• The top strip shows FPS and frame drops — a red block means a dropped frame, i.e. visible jank\n\n<b>Spotting a render that blocks the main thread:</b> look for one continuous, wide yellow block with no gaps — that's a <b>long task</b> (anything over 50ms). During a long task, the browser can't respond to clicks, scroll, or repaint, which is what \"frozen\" actually means at the browser level. Click into the block; if the call stack bottoms out in your component's render function or a function it calls synchronously (an unmemoized expensive calculation, a synchronous loop over a huge array), that's your fix target — move it to `useMemo` (Day 10), a Web Worker, or paginate/virtualize the data (Day 10's virtualization).",
            np: "React DevTools को Profiler ले कुन <b>component</b> कति समय re-render भयो भन्छ। Chrome को built-in <b>Performance</b> tab ले <b>पूरा browser</b> ले के गरिरहेको थियो भन्छ — JavaScript execution, layout, painting, garbage collection — सबै एउटै timeline मा। केही janky (scroll stutter, freeze) महसुस भएको तर React को दोष हो कि होइन थाहा नभएको बेला यो प्रयोग गर्नुहोस्।\n\n<b>Profile record गर्ने:</b> DevTools खोल्नुहोस् → Performance tab → Record click गर्नुहोस् → janky interaction गर्नुहोस् → recording stop गर्नुहोस्। Chrome ले timeline र तल <b>flame chart</b> देखाउँछ।\n\n<b>Flame chart पढ्ने:</b>\n• हरेक horizontal bar एउटा function call हो; एउटा माथि अर्को stack भएको bar भनेको तलको function ले माथिको call गरेको हो\n• Width = time; फराकिलो bar भनेको लामो समय लिने function — त्यही suspect हो\n• Yellow bars प्राय: JavaScript, purple layout/rendering (style recalculation, reflow), green painting\n• माथिको strip मा FPS र frame drops देखिन्छ — red block भनेको dropped frame, अर्थात् देखिने jank\n\n<b>Main thread block गर्ने render पत्ता लगाउने:</b> एउटा continuous, wide yellow block बिना gap खोज्नुहोस् — त्यो <b>long task</b> हो (50ms भन्दा बढी)। Long task बेला browser ले click, scroll, वा repaint respond गर्न सक्दैन — यही \"frozen\" को अर्थ हो browser level मा। Block मा click गर्नुहोस्; call stack तपाईंको component को render function वा त्यसले synchronously call गरेको function (unmemoized महँगो calculation, ठूलो array माथिको synchronous loop) मा पुगेमा त्यही fix गर्ने ठाउँ हो — `useMemo` (Day 10), Web Worker, वा data paginate/virtualize (Day 10) गर्नुहोस्।",
            jp: "React DevTools の Profiler は「どのコンポーネント」が「どれだけの時間」再レンダーしたかを教えます。Chrome 標準の <b>Performance</b> タブは「ブラウザ全体」が何をしていたか — JavaScript 実行、レイアウト、ペイント、ガベージコレクション — をひとつのタイムラインで示します。カクつきや固まりを感じても React のせいか分からない時に使います。\n\n<b>プロファイルの記録：</b> DevTools を開く → Performance タブ → Record をクリック → 問題の操作を行う → 記録停止。Chrome はタイムラインとその下に<b>フレームチャート</b>を表示します。\n\n<b>フレームチャートの読み方：</b>\n• 各横バーは関数呼び出し。あるバーの上に別のバーが積まれていれば、下の関数が上の関数を呼び出している\n• 幅＝所要時間。幅の広いバーは時間のかかる関数 — それが容疑者\n• 黄色は主に JavaScript、紫はレイアウト/レンダリング（スタイル再計算、リフロー）、緑はペイント\n• 上部の帯は FPS とフレーム落ちを表示 — 赤いブロックはフレーム落ち、つまり目に見えるカクつき\n\n<b>メインスレッドをブロックするレンダーを見つける：</b> 隙間のない連続した幅広の黄色ブロックを探す — それが<b>ロングタスク</b>（50ms 超）。ロングタスク中はブラウザがクリック・スクロール・再描画に応答できず、これが「固まる」の正体です。ブロックをクリックし、コールスタックが自分のコンポーネントのレンダー関数や同期的に呼ぶ関数（メモ化されていない重い計算、巨大配列への同期ループ）に行き着けば、そこが修正対象 — `useMemo`（Day 10）、Web Worker、またはデータのページネーション/仮想化（Day 10）に移しましょう。",
          },
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
            en: "A huge share of \"React bugs\" are actually network bugs wearing a React costume — a fetch that failed silently, a payload shaped differently than expected, or a race condition between two requests. The Network tab is where you confirm or rule this out before touching component code.\n\n<b>Inspecting failed or slow requests:</b>\n• Red rows are failed requests — click one to see the status code, response body, and request headers\n• Sort by the \"Time\" column to find the slowest requests; a request stuck in \"pending\" for a long time before failing usually means a timeout, not a fast rejection\n• The <b>Preview</b> and <b>Response</b> sub-tabs show you exactly what the server sent back — compare this against what your code assumes the shape to be (a classic bug: expecting `data.items` but the API returns `data.results`)\n• The <b>Payload</b> / <b>Request</b> sub-tab shows exactly what your app sent — useful for confirming a header, token, or body field is actually being included\n\n<b>Throttling network speed to test loading states:</b> the throttling dropdown (default \"No throttling\") has presets like \"Slow 3G\" and \"Fast 3G\". Switch to one, then reload — this is often the only way to actually see your loading spinners, skeleton screens, and suspense fallbacks, which flash by too fast to notice on a fast connection or localhost.\n\n<b>Replaying a request:</b> right-click any request → \"Replay XHR\" (Chrome) or \"Resend\" — re-sends the exact same request without re-triggering the UI action that caused it. Useful for testing whether a bug is in the request itself or in how your component handles the response.",
            np: "धेरैजसो \"React bugs\" वास्तवमा React को भेषमा रहेको network bugs हुन् — silently fail भएको fetch, अपेक्षा भन्दा फरक आकारको payload, वा दुई requests बीचको race condition। Component code नछोई यो confirm वा rule out गर्ने ठाउँ Network tab हो।\n\n<b>Failed वा slow requests inspect गर्ने:</b>\n• Red rows भनेको failed requests — click गरेर status code, response body, र request headers हेर्नुहोस्\n• \"Time\" column अनुसार sort गरेर सबैभन्दा slow requests खोज्नुहोस्; लामो समय \"pending\" रहेर fail हुने request प्रायः timeout हो, fast rejection होइन\n• <b>Preview</b> र <b>Response</b> sub-tabs ले server ले पठाएको वास्तविक data देखाउँछ — तपाईंको code ले अपेक्षा गरेको shape सँग compare गर्नुहोस् (classic bug: `data.items` अपेक्षा गरेको तर API ले `data.results` फर्काउँछ)\n• <b>Payload</b> / <b>Request</b> sub-tab ले तपाईंको app ले वास्तवमा के पठायो देखाउँछ — header, token, वा body field साँच्चै included छ भनी confirm गर्न उपयोगी\n\n<b>Loading states test गर्न network speed throttle गर्ने:</b> throttling dropdown (default \"No throttling\") मा \"Slow 3G\", \"Fast 3G\" जस्ता presets हुन्छन्। एउटा छानेर reload गर्नुहोस् — यसले नै तपाईंको loading spinners, skeleton screens, र suspense fallbacks देख्ने एकमात्र तरिका हो, जुन fast connection वा localhost मा धेरै छिटो flash भएर देखिँदैनन्।\n\n<b>Request replay गर्ने:</b> कुनै request मा right-click → \"Replay XHR\" (Chrome) वा \"Resend\" — त्यही request लाई UI action फेरि trigger नगरी resend गर्छ। Bug request मै छ कि component ले response handle गर्ने तरिकामा छ भनी test गर्न उपयोगी।",
            jp: "「React のバグ」の多くは実は React の皮を被ったネットワークのバグです — 静かに失敗した fetch、想定と違う形のペイロード、2つのリクエスト間の競合状態など。コンポーネントのコードに触る前に、Network タブでこれを確認・除外します。\n\n<b>失敗/遅いリクエストの調査：</b>\n• 赤い行が失敗したリクエスト — クリックしてステータスコード、レスポンス本文、リクエストヘッダーを確認\n• 「Time」列でソートし最も遅いリクエストを探す。長時間「pending」の末に失敗する場合は通常タイムアウトで、即座の拒否とは異なる\n• <b>Preview</b>/<b>Response</b> サブタブでサーバーが実際に返した内容を確認 — コードが想定する形と比較する（典型例：`data.items` を期待しているが API は `data.results` を返す）\n• <b>Payload</b>/<b>Request</b> サブタブでアプリが実際に送った内容を確認 — ヘッダー、トークン、ボディフィールドが本当に含まれているか確認するのに有用\n\n<b>ローディング状態をテストするためのネットワーク速度スロットリング：</b> スロットリングのドロップダウン（既定は「No throttling」）には「Slow 3G」「Fast 3G」などのプリセットがあります。切り替えてリロードすると、高速回線や localhost では一瞬で消えて見えないローディングスピナー、スケルトン画面、Suspense のフォールバックを実際に確認できます。\n\n<b>リクエストの再送：</b> 任意のリクエストを右クリック →「Replay XHR」（Chrome）または「Resend」— UI 操作を再トリガーせずに同じリクエストを再送信。バグがリクエスト自体にあるのか、コンポーネントのレスポンス処理にあるのかを切り分けるのに便利です。",
          },
        },
      ],
    },
    {
      title: {
        en: "Source maps — seeing your real code in the browser",
        np: "Source maps — browser मा तपाईंको वास्तविक code देख्ने",
        jp: "ソースマップ — ブラウザで本物のコードを見る",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The code that actually runs in the browser is never your TSX. It's been transpiled (TypeScript/JSX stripped to plain JS), bundled (many files merged into one), and in production, minified (variable names shortened, whitespace removed). Without help, a breakpoint or error would point you at unreadable, single-letter-variable, one-line-per-file bundled output.\n\nA <b>source map</b> is a file (`.js.map`) that records, position by position, how the transformed output maps back to your original source. Analogy: it's a translator's notes matching every sentence of the translated book back to the exact page and line of the original manuscript — so an editor working with the translation can still point to \"this problem is on page 42, line 3 of the original.\"\n\n<b>Why `console.log` and breakpoints show your real TSX in dev:</b> your dev server (Vite) generates source maps automatically and the browser reads them, so DevTools displays and lets you set breakpoints in the original `.tsx` file — even though a completely different bundled file is what's actually executing.\n\n<b>Why source maps should NOT be shipped publicly to production:</b> a public source map hands anyone your original, unminified source code, including comments, internal variable names, and file/folder structure — a build artifact meant for debugging becomes a way to read your proprietary code. The standard practice: build with source maps generated, but either exclude them from the deployed public assets entirely, or upload them privately to an error-tracking service (like Sentry) via a build-time upload step — the service can then de-minify stack traces on your dashboard without the maps ever being served to browsers.",
            np: "Browser मा वास्तवमा चल्ने code कहिल्यै तपाईंको TSX होइन। यो transpile भएको हुन्छ (TypeScript/JSX plain JS मा strip), bundle भएको (धेरै files एउटामा merge), र production मा minify भएको (variable names छोटो, whitespace हटाइएको)। मद्दत बिना, breakpoint वा error ले तपाईंलाई नपढ्ने, single-letter-variable, one-line-per-file bundled output मा पुर्‍याउँछ।\n\n<b>Source map</b> (`.js.map` file) ले position-by-position transformed output original source सँग कसरी match हुन्छ record गर्छ। Analogy: यो translator को notes जस्तै हो जसले translated book को हरेक वाक्य original manuscript को ठ्याक्कै page र line सँग match गर्छ — जसले गर्दा editor ले \"यो problem original को page 42, line 3 मा छ\" भन्न सक्छ।\n\n<b>Dev मा `console.log` र breakpoints ले तपाईंको वास्तविक TSX किन देखाउँछ:</b> तपाईंको dev server (Vite) ले automatically source maps generate गर्छ र browser ले ती पढ्छ, त्यसैले DevTools ले original `.tsx` file मा breakpoints set गर्न दिन्छ — भलै वास्तवमा चलिरहेको एउटा पूर्ण फरक bundled file होस्।\n\n<b>Source maps किन production मा publicly नपठाउने:</b> public source map ले जो कोहीलाई तपाईंको original, unminified source code — comments, internal variable names, file/folder structure सहित — दिन्छ। Debugging को लागि भनिएको build artifact तपाईंको proprietary code पढ्ने बाटो बन्छ। Standard practice: source maps generate गर्ने तर deployed public assets बाट पूरै exclude गर्ने, वा build-time upload step मार्फत error-tracking service (जस्तै Sentry) मा privately upload गर्ने — त्यो service ले maps browsers मा कहिल्यै serve नगरी dashboard मा stack traces de-minify गर्न सक्छ।",
            jp: "ブラウザで実際に動くコードは決してあなたの TSX そのものではありません。トランスパイル（TypeScript/JSX を素の JS に変換）され、バンドル（多数のファイルを1つに結合）され、本番では minify（変数名を短縮、空白を除去）されています。手助けがなければ、ブレークポイントやエラーは読めない、1文字変数名の、1ファイル1行のバンドル出力を指し示すことになります。\n\n<b>ソースマップ</b>（`.js.map` ファイル）は、変換後の出力が元のソースにどう対応するかを位置ごとに記録します。例え：翻訳された本のすべての文が原稿の正確なページと行に対応しているという翻訳者のメモのようなもの — 編集者は「この問題は原稿の42ページ3行目にある」と指摘できます。\n\n<b>開発時に `console.log` やブレークポイントが本物の TSX を表示する理由：</b> 開発サーバー（Vite）が自動的にソースマップを生成し、ブラウザがそれを読むため、DevTools は実際にはまったく別のバンドルファイルが実行されているにもかかわらず、元の `.tsx` ファイルを表示し、そこにブレークポイントを設定させてくれます。\n\n<b>ソースマップを本番に公開してはいけない理由：</b> 公開されたソースマップは、コメント・内部変数名・ファイル/フォルダ構造を含む、あなたの元の未圧縮ソースコードを誰にでも渡してしまいます。デバッグ用のビルド成果物が、独自コードを読む手段になってしまうのです。標準的な方法：ソースマップは生成するが、公開デプロイ資産からは完全に除外するか、ビルド時のアップロードステップで Sentry のようなエラートラッキングサービスに非公開でアップロードする — そうすればサービス側でダッシュボード上のスタックトレースを復元でき、マップがブラウザに配信されることはありません。",
          },
        },
        {
          type: "code",
          title: {
            en: "Excluding source maps from a public build (Vite)",
            np: "Public build बाट source maps exclude गर्ने (Vite)",
            jp: "本番ビルドからソースマップを除外する（Vite）",
          },
          code: `// vite.config.ts
export default defineConfig({
  build: {
    // Generate maps for a private upload step (e.g. Sentry), but do NOT
    // serve them from the public dist/ folder. "hidden" builds the .map
    // files without adding a "//# sourceMappingURL=" comment to the bundle,
    // so browsers never fetch them — only your upload step reads them.
    sourcemap: "hidden",
  },
});

// Example CI step: upload hidden source maps privately, then delete them
// so they never end up in the deployed public assets.
// npx @sentry/cli sourcemaps upload ./dist
// rm ./dist/**/*.map`,
        },
      ],
    },
    {
      title: {
        en: "Common React errors — causes and fixes",
        np: "Common React errors — causes र fixes",
        jp: "よくある React エラー — 原因と対処",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "These six show up constantly enough that it's worth recognizing them on sight rather than debugging each one from scratch every time.",
            np: "यी छ वटा errors यति धेरै देखा पर्छन् कि हरेक पटक शून्यबाट debug गर्नुभन्दा एकैचोटि चिन्न सक्नु राम्रो हुन्छ।",
            jp: "この6つは頻出するため、毎回ゼロからデバッグするより、見た瞬間に見分けられるようにしておく価値があります。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Common React errors reference",
            np: "Common React errors reference",
            jp: "よくある React エラー一覧",
          },
          headers: [
            { en: "Error", np: "Error", jp: "エラー" },
            { en: "Cause", np: "कारण", jp: "原因" },
            { en: "Fix", np: "समाधान", jp: "対処法" },
          ],
          rows: [
            [
              { en: "\"Cannot update a component while rendering a different component\"", np: "\"Cannot update a component while rendering a different component\"", jp: "「Cannot update a component while rendering a different component」" },
              { en: "A component calls another component's `setState` synchronously during its own render — e.g. reading and updating a parent's state directly in the render body of a child.", np: "एउटा component ले आफ्नै render बेला अर्को component को `setState` लाई synchronously call गर्छ — जस्तै child को render body मा parent को state सिधै update गर्ने।", jp: "あるコンポーネントが自分のレンダー中に別コンポーネントの `setState` を同期的に呼んでいる — 例：子のレンダー本体で親の state を直接更新している。" },
              { en: "Move the state update into an event handler or a `useEffect`, not the render body. If you need to derive state from props, compute it during render instead of calling `setState` at all.", np: "State update लाई render body बाट हटाएर event handler वा `useEffect` मा सार्नुहोस्। Props बाट state derive गर्नु परे render बेलै calculate गर्नुहोस्, `setState` call नगरी।", jp: "state 更新をレンダー本体からイベントハンドラや `useEffect` に移す。props から state を導出したいだけなら `setState` を呼ばずレンダー中に計算する。" },
            ],
            [
              { en: "\"Cannot update state on an unmounted component\"", np: "\"Cannot update state on an unmounted component\"", jp: "「Cannot update state on an unmounted component」" },
              { en: "An async operation (fetch, timer, subscription) resolves after the component has already unmounted, and its callback calls `setState` anyway.", np: "Component unmount भइसकेपछि async operation (fetch, timer, subscription) resolve हुन्छ, र त्यसको callback ले फेरि पनि `setState` call गर्छ।", jp: "コンポーネントがアンマウントされた後に非同期処理（fetch、タイマー、購読）が完了し、そのコールバックが `setState` を呼んでしまう。" },
              { en: "Clean up in `useEffect`'s return function — abort the fetch with `AbortController`, `clearTimeout` the timer, or unsubscribe. See the code example below.", np: "`useEffect` को return function मा cleanup गर्नुहोस् — `AbortController` ले fetch abort गर्ने, timer लाई `clearTimeout`, वा unsubscribe गर्ने। तलको code example हेर्नुहोस्।", jp: "`useEffect` の return 関数でクリーンアップする — `AbortController` で fetch を中止、タイマーは `clearTimeout`、購読は unsubscribe。下のコード例を参照。" },
            ],
            [
              { en: "\"Too many re-renders\"", np: "\"Too many re-renders\"", jp: "「Too many re-renders」" },
              { en: "`setState` is called unconditionally in the component's render body (not inside an event handler or effect) — e.g. `<button onClick={setCount(count + 1)}>` instead of `onClick={() => setCount(count + 1)}`, which invokes it immediately on every render.", np: "`setState` लाई component को render body मा unconditionally call गरिन्छ (event handler वा effect भित्र होइन) — जस्तै `onClick={() => setCount(count + 1)}` को सट्टा `onClick={setCount(count + 1)}`, जसले हरेक render मा तुरुन्तै invoke गर्छ।", jp: "`setState` がイベントハンドラや effect の中ではなく、コンポーネントのレンダー本体で無条件に呼ばれている — 例：`onClick={() => setCount(count + 1)}` の代わりに `onClick={setCount(count + 1)}` と書き、レンダーごとに即座に実行されてしまう。" },
              { en: "Wrap the state update in a function reference for event handlers (`onClick={() => setCount(c => c + 1)}`), and make sure any `setState` outside an event handler lives inside a `useEffect` with a correct dependency array.", np: "Event handlers को लागि state update लाई function reference मा wrap गर्नुहोस् (`onClick={() => setCount(c => c + 1)}`), र event handler बाहिरको कुनै पनि `setState` सही dependency array भएको `useEffect` भित्र राख्नुहोस्।", jp: "イベントハンドラでは state 更新を関数参照でラップする（`onClick={() => setCount(c => c + 1)}`）。イベントハンドラの外の `setState` は正しい依存配列を持つ `useEffect` の中に置く。" },
            ],
            [
              { en: "\"Each child in a list should have a unique 'key' prop\"", np: "\"Each child in a list should have a unique 'key' prop\"", jp: "「Each child in a list should have a unique 'key' prop」" },
              { en: "A `.map()` rendering a list of elements has no `key` prop, or uses the array index as a key on a list that can reorder/filter (which defeats the purpose of a key).", np: "List elements render गर्ने `.map()` मा `key` prop छैन, वा reorder/filter हुन सक्ने list मा array index लाई key को रूपमा प्रयोग गरिएको छ (जसले key को उद्देश्य नै हराउँछ)।", jp: "要素のリストをレンダーする `.map()` に `key` prop がない、または並べ替え/フィルタが起こりうるリストで配列のインデックスを key として使っている（key の目的が失われる）。" },
              { en: "Add a `key` prop using a stable, unique identifier from the data itself (`item.id`), not the array index — index keys are only safe for lists that never reorder, filter, or have items inserted/removed.", np: "Data बाटै stable, unique identifier (`item.id`) प्रयोग गरेर `key` prop थप्नुहोस्, array index होइन — index keys त्यही list को लागि मात्र safe छ जुन कहिल्यै reorder, filter, वा insert/remove हुँदैन।", jp: "配列のインデックスではなく、データ自体の安定した一意な識別子（`item.id`）を `key` に使う — インデックスキーは並べ替え・フィルタ・挿入削除が絶対に起きないリストでのみ安全。" },
            ],
            [
              { en: "\"Objects are not valid as a React child\"", np: "\"Objects are not valid as a React child\"", jp: "「Objects are not valid as a React child」" },
              { en: "JSX is rendering a plain object or array directly, e.g. `<p>{user}</p>` instead of `<p>{user.name}</p>` — React can render strings, numbers, and elements, but not raw objects.", np: "JSX ले सिधै plain object वा array render गर्दैछ, जस्तै `<p>{user.name}</p>` को सट्टा `<p>{user}</p>` — React ले strings, numbers, र elements render गर्न सक्छ, raw objects होइन।", jp: "JSX が生のオブジェクトや配列を直接レンダーしている。例：`<p>{user.name}</p>` の代わりに `<p>{user}</p>` — React は文字列・数値・要素はレンダーできるが生のオブジェクトはできない。" },
              { en: "Render the specific field you need (`user.name`), or `JSON.stringify(user)` if you genuinely need to display the raw shape for debugging.", np: "चाहिने specific field render गर्नुहोस् (`user.name`), वा debugging को लागि raw shape देखाउनु नै परे `JSON.stringify(user)` प्रयोग गर्नुहोस्।", jp: "必要な特定のフィールドをレンダーする（`user.name`）、またはデバッグ目的で本当に生の形を表示したいなら `JSON.stringify(user)` を使う。" },
            ],
            [
              { en: "\"Maximum update depth exceeded\"", np: "\"Maximum update depth exceeded\"", jp: "「Maximum update depth exceeded」" },
              { en: "A `useEffect` has no dependency array (or a dependency that changes every render) and calls `setState` for a value it also depends on — the effect runs, updates state, which triggers a re-render, which re-runs the effect, forever.", np: "`useEffect` मा dependency array छैन (वा हरेक render मा बदलिने dependency छ) र त्यसैले depend गर्ने value को लागि `setState` call गर्छ — effect चल्छ, state update गर्छ, re-render trigger हुन्छ, effect फेरि चल्छ, अनन्तसम्म।", jp: "`useEffect` に依存配列がない（またはレンダーごとに変わる依存がある）状態で、自身が依存する値に対して `setState` を呼んでいる — effect が実行され state を更新し、それが再レンダーを引き起こし、effect が再実行され…と無限に続く。" },
              { en: "Add a correct dependency array so the effect only re-runs when its actual inputs change, and double-check the effect isn't setting the exact state value it lists as a dependency without a guard condition.", np: "सही dependency array थप्नुहोस् ताकि effect वास्तविक inputs बदलिँदा मात्र फेरि चलोस्, र effect ले guard condition बिना नै dependency मा सूचीबद्ध ठ्याक्कै त्यही state value set गरिरहेको छैन भनी दोहोर्याएर जाँच्नुहोस्।", jp: "正しい依存配列を追加し、実際の入力が変わった時だけ effect が再実行されるようにする。また effect がガード条件なしに依存配列に列挙した state 値そのものを更新していないか再確認する。" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "\"Maximum update depth exceeded\" — buggy vs fixed",
            np: "\"Maximum update depth exceeded\" — buggy vs fixed",
            jp: "「Maximum update depth exceeded」— バグ版と修正版",
          },
          code: `// BUGGY — no dependency array, and the effect sets the state it depends on
function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Runs after EVERY render (no dependency array).
    // Setting "results" here causes a re-render, which re-runs this
    // effect again, forever -> "Maximum update depth exceeded"
    setResults(search(query));
  }); // <-- missing dependency array entirely

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

// FIXED — dependency array limits the effect to when "query" actually changes
function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(search(query));
  }, [query]); // only re-runs when query changes, not on every render

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

// EVEN BETTER — derive it during render, no effect or extra state needed at all
function SearchBox() {
  const [query, setQuery] = useState('');
  const results = search(query); // recalculated each render, no setState loop possible

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}`,
        },
        {
          type: "code",
          title: {
            en: "\"Cannot update state on an unmounted component\" — fetch cleanup with AbortController",
            np: "\"Cannot update state on an unmounted component\" — AbortController सँग fetch cleanup",
            jp: "「Cannot update state on an unmounted component」— AbortController での fetch クリーンアップ",
          },
          code: `// BUGGY — no cleanup. If the component unmounts before the fetch resolves
// (user navigates away quickly), setState still fires on an unmounted component.
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data)); // fires even if unmounted
  }, [userId]);

  return user ? <Profile user={user} /> : <Spinner />;
}

// FIXED — AbortController cancels the in-flight request on cleanup,
// and the abort error is deliberately ignored instead of hitting setState
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => {
        if (err.name !== 'AbortError') throw err; // ignore expected cancellation
      });

    // Cleanup runs on unmount OR before the effect re-runs for a new userId
    return () => controller.abort();
  }, [userId]);

  return user ? <Profile user={user} /> : <Spinner />;
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "React DevTools shows my component as \"Anonymous\" — how do I fix that?",
        np: "React DevTools मा मेरो component \"Anonymous\" देखिन्छ — कसरी fix गर्ने?",
        jp: "React DevTools でコンポーネントが「Anonymous」と表示される — どう直す？",
      },
      answer: {
        en: "This happens with arrow function components assigned inline or exported as default without a name, e.g. `export default () => <div />`. React infers a name from the variable/function name where possible, so `const UserCard = () => <div />` shows up correctly, but `export default () => <div />` doesn't. Fix: always name the function (`function UserCard() {}` or `const UserCard = () => {}`) before exporting it.",
        np: "यो inline assign भएको वा नाम नभएको default export arrow function components मा हुन्छ, जस्तै `export default () => <div />`। React ले सम्भव भएसम्म variable/function नाम बाट infer गर्छ, त्यसैले `const UserCard = () => <div />` सही देखिन्छ। Fix: export गर्नुअघि सधैं function लाई नाम दिनुहोस्।",
        jp: "これはインライン代入や名前なしの default export のアロー関数コンポーネントで起きます。例：`export default () => <div />`。React は可能な限り変数/関数名から推測するため `const UserCard = () => <div />` は正しく表示されます。対処法：export する前に必ず関数に名前を付ける。",
      },
    },
    {
      question: {
        en: "The Console shows a warning but my app still seems to work fine — can I ignore it?",
        np: "Console मा warning देखिन्छ तर app राम्रोसँग काम गरिरहेको छ जस्तो छ — ignore गर्न सकिन्छ?",
        jp: "Console に警告が出るがアプリは問題なく動いているように見える — 無視していい？",
      },
      answer: {
        en: "Not safely, no. React's dev warnings exist because a behavior works today by coincidence but will break under slightly different conditions — a missing key works fine until the list reorders; an unmounted-component setState works fine until a user navigates away quickly on a slow connection. Treat every React warning as a bug report about a future failure, not a cosmetic annoyance.",
        np: "सुरक्षित रूपमा होइन। React को dev warnings किनभने कुनै behavior आज संयोगले काम गरिरहेको छ तर अलि फरक conditions मा break हुनेछ — missing key list reorder नहुन्जेल ठीक हुन्छ; unmounted-component setState user slow connection मा छिटो नेभिगेट नगरेसम्म ठीक हुन्छ। हरेक React warning लाई भविष्यको failure को bug report सम्झनुहोस्, cosmetic कुरा होइन।",
        jp: "安全ではありません。React の開発警告は、今は偶然うまく動いているが少し条件が変わると壊れる動作を示すものです — key の欠如はリストが並べ替わるまでは問題なく、アンマウント後の setState は低速回線でユーザーが素早く離脱するまでは問題ありません。すべての React 警告を将来の障害についてのバグ報告として扱いましょう。",
      },
    },
    {
      question: {
        en: "What's the quickest way to tell if a bug is React's fault or the browser/network's fault?",
        np: "Bug React को गल्ती हो कि browser/network को — छिटो थाहा पाउने तरिका के हो?",
        jp: "バグが React のせいかブラウザ/ネットワークのせいか一番早く見分ける方法は？",
      },
      answer: {
        en: "Check the Network tab first. If the request itself failed, returned an unexpected payload, or never fired, the bug is upstream of React — fix the request before touching any component. If the Network tab is clean but the DOM (Elements tab) doesn't match what your JSX should produce, it's a React logic bug — start with React DevTools' Components tab to inspect the actual props/state driving that render.",
        np: "पहिले Network tab जाँच्नुहोस्। Request आफैं fail भयो, अपेक्षा नगरेको payload फर्कायो, वा कहिल्यै fire भएन भने bug React भन्दा माथि छ — कुनै component नछोई request fix गर्नुहोस्। Network tab clean छ तर DOM (Elements tab) JSX ले produce गर्नुपर्ने सँग मिलेन भने त्यो React logic bug हो — त्यो render चलाउने actual props/state inspect गर्न React DevTools को Components tab बाट सुरु गर्नुहोस्।",
        jp: "まず Network タブを確認します。リクエスト自体が失敗した、想定外のペイロードを返した、あるいは一度も発火していない場合、バグは React より上流にあります — コンポーネントに触る前にリクエストを直しましょう。Network タブが問題なく、DOM（Elements タブ）が JSX が生成すべきものと一致しない場合は React のロジックバグです — React DevTools の Components タブでそのレンダーを駆動している実際の props/state を調べるところから始めます。",
      },
    },
    {
      question: {
        en: "Should I leave console.log statements in for debugging, or always use breakpoints?",
        np: "Debugging को लागि console.log राख्ने कि सधैं breakpoints प्रयोग गर्ने?",
        jp: "デバッグ用に console.log を残すべきか、常にブレークポイントを使うべきか？",
      },
      answer: {
        en: "Both have a place. `console.log` is faster for a quick \"is this value what I think it is\" check and leaves a trail you can scroll back through. Breakpoints (set directly in the Sources tab, or via a `debugger;` statement in code) are better when you need to inspect the full call stack, step through execution line by line, or examine a complex object interactively rather than reading a flattened string. Remove both before committing — a stray `console.log` in production code is a smell, and `debugger;` statements will literally pause other developers' browsers.",
        np: "दुवैको ठाउँ छ। `console.log` छिटो \"यो value मैले सोचे जस्तै हो\" जाँच्नको लागि छिटो हुन्छ र scroll back गर्न सकिने trail छोड्छ। Breakpoints (Sources tab मा सिधै वा code मा `debugger;` statement मार्फत) चाहिँ पूरा call stack inspect गर्नुपर्दा, line by line step through गर्नुपर्दा, वा जटिल object interactively जाँच्नुपर्दा राम्रो हुन्छ। Commit गर्नुअघि दुवै हटाउनुहोस् — production code मा बाँकी रहेको `console.log` एउटा smell हो, र `debugger;` statement ले अरु developers को browser साँच्चै pause गराउँछ।",
        jp: "どちらにも役割があります。`console.log` は「この値は思った通りか」を素早く確認するのに速く、スクロールして遡れる履歴を残します。ブレークポイント（Sources タブで直接設定するか、コード内の `debugger;` 文）は、コールスタック全体を調べたい時、実行を1行ずつ追いたい時、フラットな文字列ではなく複雑なオブジェクトを対話的に調べたい時に向いています。コミット前にはどちらも削除しましょう — 本番コードに残った `console.log` は良くない兆候であり、`debugger;` 文は他の開発者のブラウザを文字通り一時停止させます。",
      },
    },
    {
      question: {
        en: "My error only happens in production, not in dev — how do I debug that without source maps exposed?",
        np: "मेरो error production मा मात्र हुन्छ, dev मा हुँदैन — source maps public नगरी कसरी debug गर्ने?",
        jp: "エラーが本番でしか起きず開発環境では再現しない — ソースマップを公開せずにどうデバッグする？",
      },
      answer: {
        en: "This is exactly what privately-uploaded source maps are for. Set up an error tracker (Sentry or similar) with a build-time step that uploads the source maps directly to the service, without ever serving them publicly. When a production error occurs, the tracker's dashboard shows you the de-minified stack trace pointing at your real `.tsx` files and line numbers, using the private maps it already has — your users' browsers never receive the maps.",
        np: "यही किसिमको काम को लागि privately-uploaded source maps हुन्छन्। Error tracker (Sentry वा त्यस्तै) setup गर्नुहोस्, जसमा build-time step ले source maps लाई सिधै service मा upload गर्छ, कहिल्यै publicly serve नगरी। Production मा error आउँदा, tracker को dashboard ले आफूसँग भएको private maps प्रयोग गरेर de-minified stack trace तपाईंको वास्तविक `.tsx` files र line numbers सहित देखाउँछ — users को browser ले कहिल्यै maps पाउँदैन।",
        jp: "まさにこのために非公開アップロードのソースマップがあります。ビルド時のステップでソースマップをサービスに直接アップロードし、公開配信は一切しないエラートラッカー（Sentry など）を設定しましょう。本番でエラーが発生すると、トラッカーのダッシュボードは既に持っている非公開マップを使って、本物の `.tsx` ファイルと行番号を指す復元済みスタックトレースを表示します — ユーザーのブラウザがマップを受け取ることは一切ありません。",
      },
    },
  ],
};
