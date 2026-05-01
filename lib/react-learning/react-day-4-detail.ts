import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 4 follows the “Managing state” block: props, callbacks, state vs props, children, DevTools, then Button + Alert exercises. */
export const REACT_DAY_4_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Managing state (~6m in-course) is about deciding who owns a piece of data and how it flows through props as read-only inputs. You will pass values and callbacks down, compare state vs props, compose with `children`, use React DevTools to debug trees, then finish with a Button and Alert exercise pattern common in forms and modals.",
      np: "state व्यवस्थापन (~६m) — कसले डाटा मालिक र props मार्फत पढाइ-मात्र प्रवाह। मान र callback तल, state vs props, `children`, DevTools, अनि Button र Alert अभ्यास।",
      jp: "状態の扱い（教材では約6分の塊）では、どのコンポーネントがデータの持ち主かと、props で下へ読み取り専用で渡す流れを固めます。値とコールバック、state と props の違い、`children`、DevTools、最後に Button / Alert の演習パターンです。",
    },
    {
      en: "Lessons 08–14 in your playlist (props → functions → state vs props → children → DevTools → two exercises) map to the sections below. Times are hints for pacing, not requirements.",
      np: "०८–१४ (props → functions → state vs props → children → DevTools → अभ्यास) तल मेल खान्छ। समय गति संकेत मात्र।",
      jp: "プレイリストの 08〜14 が以下の見出しに対応します。時間は目安です。",
    },
  ],
  sections: [
    {
      title: {
        en: "Managing state — overview (~6m 03s)",
        np: "state व्यवस्थापन — अवलोकन (~६m ०३s)",
        jp: "状態管理の概要（約 6m03s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "State is data that belongs to a component and may change over time (via `useState`, `useReducer`, or class `this.state` in legacy code). When state changes, React re-renders that component and its descendants so the UI stays in sync. Lift state up when two siblings need the same value — store it in the nearest common parent and pass it down as props.",
            np: "State कम्पोनेन्टको डाटा जो समयसँग बदलिन्छ (`useState`…)। बदल्दा React re-render गर्छ। Lift state up — दुई भाइलाई चाहिए नजिकको अभिभावक मा राखी props तल।",
            jp: "state はコンポーネントが持ち、時間で変えられるデータです（`useState` 等）。変わるとその subtree が再レンダーされます。兄弟で共有するなら共通親に state を持ち上げ、props で配ります。",
          },
        },
        {
          type: "code",
          title: {
            en: "Lifted counter — parent owns state",
            np: "उठाइएको counter — अभिभावकमा state",
            jp: "親が state を持つカウンター",
          },
          code: `import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  return (
    <main>
      <CounterDisplay value={count} />
      <CounterControls count={count} onIncrement={() => setCount((c) => c + 1)} />
    </main>
  );
}

function CounterDisplay({ value }) {
  return <p className="tabular-nums">Count: {value}</p>;
}

function CounterControls({ count, onIncrement }) {
  return (
    <button type="button" onClick={onIncrement}>
      Increment (now {count})
    </button>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "08 · Passing data via props (~3m 58s)",
        np: "०८ · props मार्फत डाटा (~३m ५८s)",
        jp: "08 · props でデータを渡す（約 3m58s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Props are the public inputs to a component. The parent chooses values; the child reads them and renders JSX. Destructure in the signature for clarity: `function Avatar({ src, alt, size = 40 }) { … }`. React elements are props too — that is how you pass icons or layout slots without new syntax.",
            np: "Props सार्वजनिक इनपुट; अभिभावक मान छान्छ, सन्तान पढ्छ। स्पष्टताको लागि destructure: `function Avatar({ src, alt, size = 40 })`।",
            jp: "props は親から子への公開入力です。シグネチャで分割代入すると読みやすくなります。要素を props で渡すこともよくあります。",
          },
        },
      ],
    },
    {
      title: {
        en: "09 · Passing functions via props (~3m 46s)",
        np: "०९ · props मार्फत फंक्फन (~३m ४६s)",
        jp: "09 · props で関数を渡す（約 3m46s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Callbacks let a child notify the parent (“user clicked row 3”, “form submitted”). Name them `onSomething` in props to mirror DOM conventions (`onClick`). The parent passes `() => handleSomething(id)` when the child should not know about parent implementation details — only the contract (`onSelect(item)`).",
            np: "Callback ले सन्तानले अभिभावकलाई सूचित गर्छ। props मा `onSomething`। अभिभावकले `() => handle(id)` — सम्झौता मात्र।",
            jp: "コールバックで子が親に通知します。props 名は `on…` が慣習。親は `() => …` で id などを閉じ込めます。",
          },
        },
      ],
    },
    {
      title: {
        en: "10 · State vs props (~1m 33s)",
        np: "१० · state बनाम props (~१m ३३s)",
        jp: "10 · state と props（約 1m33s）",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Props — external configuration from parent; treat as read-only in the child (do not assign to `props.xxx`).",
              np: "Props — अभिभावकबाट; सन्तानमा पढाइ-मात्र (`props.x` मा assign नगर्नुहोस्)।",
              jp: "props — 親からの設定。子では書き換えない（再代入しない）。",
            },
            {
              en: "State — internal data the component owns and updates; changing state schedules a re-render of that component.",
              np: "State — कम्पोनेन्टले धान्छ र अद्यावधिक गर्छ; बदल्दा re-render।",
              jp: "state — そのコンポーネントが保持・更新。変えると再レンダー。",
            },
            {
              en: "Derived data — if a value can be computed from props + state alone, do not store it in another state variable — compute during render (or memoize later when profiling says you need it).",
              np: "व्युत्पन्न — props+state बाट गन्न मिल्छ भने अर्को state मा नराख्नुहोस् — render मा गन्नुहोस्।",
              jp: "派生値は props と state から計算できるなら、別の state に複製しないのが原則です。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "11 · Passing children (~5m 05s)",
        np: "११ · children पास (~५m ०५s)",
        jp: "11 · children を渡す（約 5m05s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Whatever JSX sits between a component’s opening and closing tags becomes the `children` prop — a powerful composition pattern for cards, layouts, and dialogs. You can type `children` as `ReactNode` in TypeScript. `children` is a prop like any other; you can combine it with explicit props (`title`, `footer`).",
            np: "ट्याग बीचको JSX `children` prop — composition। TS मा `ReactNode`। `children` पनि एउटा prop — `title` सँग मिश्रण।",
            jp: "開始タグと終了タグの間の JSX が `children` です。カードやレイアウトの合成に使います。TypeScript では `ReactNode` 等で型付けできます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Card shell with header slot + children",
            np: "header + children सहित Card",
            jp: "ヘッダーと children を持つ Card",
          },
          code: `function Card({ title, children }) {
  return (
    <section className="card">
      {title ? <header className="card-header">{title}</header> : null}
      <div className="card-body">{children}</div>
    </section>
  );
}

// Usage
<Card title="Settings">
  <p>Update your profile information.</p>
  <button type="button">Save</button>
</Card>`,
        },
      ],
    },
    {
      title: {
        en: "12 · Inspecting components with React DevTools (~2m 10s)",
        np: "१२ · React DevTools (~२m १०s)",
        jp: "12 · React DevTools（約 2m10s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Install the React Developer Tools browser extension. The Components tab shows the live tree: pick a node to inspect props, state, and hooks values at that moment. Use the search/filter box to jump to deep components. The Profiler tab (separate topic) records render timing — enable it when optimising hot paths.",
            np: "React DevTools extension। Components ट्याब — props, state, hooks। खोज बाकस। Profiler अर्को विषय — अनुकूलनमा।",
            jp: "React Developer Tools を入れ、Components タブでツリーを選び props / state / hooks を確認します。Profilerは別途パフォーマンス調査に使います。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Highlight updates (older DevTools option) or watch Fast Refresh logs to catch accidental render storms during development.",
              np: "Highlight updates वा Fast Refresh — विकासमा अनावश्यक render समात्न।",
              jp: "更新のハイライトやログで、過剰な再レンダーを掴みやすくなります。",
            },
            {
              en: "Rules: DevTools only sees development builds clearly; production may use minified names — still useful for props/state inspection.",
              np: "DevTools dev build मा स्पष्ट; production मा नाम minify — तैपनि उपयोगी।",
              jp: "本番は名前が短縮されることもありますが、props/state の確認には依然有用です。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "13 · Exercise — Building a Button component (~7m 02s)",
        np: "१३ · अभ्यास — Button कम्पोनेन्ट (~७m ०२s)",
        jp: "13 · 演習：Button コンポーネント（約 7m02s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Wrap a native `<button>` so your app shares one visual system (variants: primary / secondary / danger), `disabled`, `type=\"button\"` inside forms to avoid accidental submit, and optional `children` for the label.",
            np: "नेटिभ `<button>` लपेट्नुहोस् — variant, `disabled`, फर्म भित्र `type=\"button\"` (submit नचलोस्), `children` लेबल।",
            jp: "ネイティブ `<button>` をラップし、variant、`disabled`、フォーム内では `type=\"button\"`（誤送信防止）、ラベルは `children` とします。",
          },
        },
        {
          type: "code",
          title: {
            en: "Button.jsx — variants + disabled",
            np: "Button.jsx — variant + disabled",
            jp: "Button.jsx",
          },
          code: `function Button({
  variant = "primary",
  disabled = false,
  type = "button",
  children,
  ...rest
}) {
  const className = ["btn", \`btn--\${variant}\`, disabled ? "btn--disabled" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={className} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

export default Button;`,
        },
      ],
    },
    {
      title: {
        en: "14 · Exercise — Showing an Alert",
        np: "१४ · अभ्यास — Alert देखाउने",
        jp: "14 · 演習：アラートを表示する",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Combine local state in a parent (`showAlert`) with a Button that toggles or sets it true, and an Alert child that renders only when the flag is true. Reset with a dismiss control. For accessibility, use `role=\"alert\"` on the message region and return focus to the triggering button after dismiss when possible.",
            np: "`showAlert` state, Button ले true, Alert सर्तीय render। dismiss। `role=\"alert\"`।",
            jp: "親の `showAlert` などの state と Button で表示を切り替え、条件付きで Alert を出します。`role=\"alert\"` と閉じた後のフォーカスに配慮します。",
          },
        },
        {
          type: "code",
          title: {
            en: "App.jsx — button opens alert",
            np: "App.jsx — button ले alert",
            jp: "App.jsx の例",
          },
          code: `import { useState } from "react";
import Button from "./Button.jsx";
import Alert from "./Alert.jsx";

export default function App() {
  const [visible, setVisible] = useState(false);

  return (
    <main>
      <Button variant="primary" onClick={() => setVisible(true)}>
        Show alert
      </Button>
      {visible ? (
        <Alert onClose={() => setVisible(false)}>
          Something important happened.
        </Alert>
      ) : null}
    </main>
  );
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Can a child component update a prop value directly?",
        np: "सन्तानले props सिधै बदल्न मिल्छ?",
        jp: "子が props を直接書き換えていい？",
      },
      answer: {
        en: "No. Props are read-only inputs. The child should call a callback prop (`onRename`) or dispatch to context / external store patterns — the parent (or store owner) performs the actual state update.",
        np: "होइन। Props पढाइ-मात्र। सन्तानले callback (`onRename`) — अभिभावक ले state अद्यावधिक।",
        jp: "ダメです。 変更は親（やストアの持ち主）が行い、子は コールバック で依頼します。",
      },
    },
    {
      question: {
        en: "Why pass `() => handleClick(id)` instead of `handleClick` when I need an id?",
        np: "`() => handleClick(id)` किन?",
        jp: "id が要るとき `() => handleClick(id)` にする理由は？",
      },
      answer: {
        en: "`handleClick` alone has no slot for `id` unless you wrap it. The arrow closes over the current `id` from the render where the button was created. Alternative: `onClick={(e) => handleClick(e, id)}` or a small child component that receives `id` as a prop and calls `onSelect(id)` internally.",
        np: "`handleClick` मात्रमा `id` छैन। arrow ले id बन्द गर्छ। वा सानो सन्तान कम्पोनेन्ट।",
        jp: "`handleClick` だけでは `id` を渡せないので、クロージャで包むか、子コンポーネントに `id` を渡して内部で `onSelect(id)` とします。",
      },
    },
    {
      question: {
        en: "Is `children` always an array?",
        np: "`children` सधै सरणी?",
        jp: "`children` は常に配列？",
      },
      answer: {
        en: "No. A single child is a single node; multiple nodes become an array (or fragment). Use `React.Children` utilities if you need to map or count children robustly.",
        np: "होइन। एक सन्तान एक नोड; धेरै सरणी वा fragment। `React.Children` प्रयोग।",
        jp: "単一ノードのこともあれば、複数では配列になり得ます。数えたり変形するなら `React.Children` が安全です。",
      },
    },
    {
      question: {
        en: "What is prop drilling?",
        np: "prop drilling के हो?",
        jp: "prop drilling とは？",
      },
      answer: {
        en: "Passing the same prop through many intermediate layers that do not use it, only forward it. It is valid for small apps. When it hurts readability, reach for context, composition (`children`), or state libraries — not on Day 4’s quiz, but you will see them soon.",
        np: "धेरै मध्यवर्ती तहबाट एउटै prop मात्र अगाडि पठाउनु — सानो एपमा ठीक। पढ्न गाह्रो भए context, children, state लाइब्रेरी।",
        jp: "使わない中間コンポーネントを何層も通して props を渡すことです。小規模では問題なく、肥大したら Context や合成で緩和します。",
      },
    },
    {
      question: {
        en: "How do I share data without prop drilling — what is React Context?",
        np: "prop drilling बिना डाटा साझਾ — React Context के हो?",
        jp: "prop drilling なしでデータを共有するには？ Context とは？",
      },
      answer: {
        en: "Context lets a parent provide a value once and any descendant read it with `useContext`, skipping intermediate props. Typical steps: `createContext(default)`, wrap with `<MyContext.Provider value={…}>`, read with `useContext(MyContext)` in nested components. Use it for theme, locale, auth session, or rarely-changing global defaults — not as a replacement for every piece of state (too many providers hurts traceability). Official reference: React docs → Context / `useContext`.",
        np: "Context — अभिभावकले `Provider` मार्फत मान दिन्छ, सन्तान `useContext` ले पढ्छ। theme/locale/auth जस्ता स्थिर-ish मानको लागि; हरेक state को लागि होइन। React डकुमेन्टेशन → Context।",
        jp: "Context は親が `Provider` で値を渡し、深い子が `useContext` で読む仕組みです。テーマ・ロケール・認証など更新頻度が低い共有に向き、すべての state を Context に押し込むのは避けます。詳細は React 公式の Context / `useContext` を参照してください。",
      },
    },
    {
      question: {
        en: "Why must `type=\"button\"` be the default for reusable buttons in forms?",
        np: "फर्ममा `type=\"button\"` किन?",
        jp: "フォームで `type=\"button\"` をデフォルトにする理由は？",
      },
      answer: {
        en: "Inside a `<form>`, the HTML default for `<button>` is `submit`. A reusable `Button` that omits `type` could accidentally submit the form when the user only wanted a local action. Default to `button` and set `submit` explicitly for primary form submission.",
        np: "`<form>` भित्र `<button>` को पूर्वनिर्धारित `submit`। `button` डिफल्ट; submit मुख्य पेशकशवाला मात्र।",
        jp: "フォーム内では `<button>` の省略形が `submit` になりがちです。共有 `Button` は `type=\"button\"` を既定にし、送信専用は `submit` と明示します。",
      },
    },
    {
      question: {
        en: "DevTools shows `hooks` state — is that different from props?",
        np: "DevTools मा hooks state — props भन्दा फरक?",
        jp: "DevTools の hooks と props は別？",
      },
      answer: {
        en: "Hooks hold component state and side-effect bookkeeping (`useState`, `useEffect`, etc.). They are internal to the component function, not passed by the parent. Props remain the external API from parents; DevTools simply surfaces both for debugging.",
        np: "Hooks आन्तरिक state; props अभिभावकबाट बाह्य API। DevTools दुवै debug को लागि देखाउँछ।",
        jp: "hooks はコンポーネント内部の state 等、props は親からの入力です。DevTools は両方を表示するだけです。",
      },
    },
    {
      question: {
        en: "Should Alert content live in state or be passed as children?",
        np: "Alert सामग्री state वा children?",
        jp: "Alert の本文は state？ children？",
      },
      answer: {
        en: "Visibility (`open` / `visible`) is state. Message body is often `children` so `<Alert>Saved!</Alert>` reads naturally, or a `message` prop if you prefer a stricter API. Pick one style per design system.",
        np: "दृश्यता state। सन्देश प्राय children वा `message` prop — डिजाइन प्रणालीमा एकरूप।",
        jp: "開閉は state、本文は `children` か `message` prop のどちらかに揃えるのが一般的です。",
      },
    },
    {
      question: {
        en: "What is wrong with mutating an object stored in state?",
        np: "state भित्रको object म्युटेट गर्दा के बिग्रिन्छ?",
        jp: "state のオブジェクトを直接変えるとダメなのは？",
      },
      answer: {
        en: "React relies on reference changes to know something updated. Mutating `obj.count++` in place keeps the same reference, so React may skip re-rendering. Prefer `setState` with a new object (`setForm({ ...form, name: next })`) or functional updaters for arrays.",
        np: "React ले reference हेर्छ। स्थानमा mutate गर्दा उही reference — re-render छुट्न सक्छ। `{ ...form, … }` नयाँ object प्रयोग गर्नुहोस्।",
        jp: "参照が変わったかで更新を検知します。インプレース改変は参照が同じのままなので再レンダーされないことがあります。スプレッドで新オブジェクトを渡します。",
      },
    },
  ],
  bullets: [
    {
      en: "Refactor a piece of UI so all configuration arrives via props and all reactions go through `on…` callbacks.",
      np: "UI लाई props र `on…` callback मार्फत मात्र कन्फिगर/प्रतिक्रिया गर्नुहोस्।",
      jp: "設定は props、親への通知は `on…` に集約してリファクタする。",
    },
    {
      en: "Open React DevTools, select a leaf component, and verify props vs hooks values while toggling UI.",
      np: "DevTools मा पात कम्पोनेन्ट छानी props vs hooks UI बदल्दै जाँच।",
      jp: "DevTools で末端コンポーネントを選び、操作しながら props / hooks を見比べる。",
    },
    {
      en: "Complete the Button + Alert flow: default `type=\"button\"`, variant class, dismiss sets `visible` false.",
      np: "Button + Alert: `type=\"button\"` डिफल्ट, variant, dismiss ले `visible` false।",
      jp: "Button + Alert を完成させ、`type=\"button\"`・variant・閉じるで state を false に戻す。",
    },
  ],
};
