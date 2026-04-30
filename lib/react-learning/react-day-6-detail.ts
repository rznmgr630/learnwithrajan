import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 6 — “Managing component state” (~41m): useState, structure, purity, Strict Mode, immutable updates, Immer, lifting state, exercises. */
export const REACT_DAY_6_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 6 goes **inside** the component: **`useState`** for local data, **how to shape state** so updates stay predictable, **pure render** rules, **Strict Mode** in development, **immutable patterns** for objects and arrays (including nested data), optional **Immer** to reduce boilerplate, and **sharing state** by lifting it — ending with **state update drills** and an **ExpandableText** exercise.",
      np: "दिन ६ कम्पोनेन्ट **भित्र**: **`useState`**, **state संरचना**, **शुद्ध render**, **Strict Mode**, **immutable** object/array (नेस्ट), **Immer**, **state उठाउने**, अभ्यास र **ExpandableText**।",
      jp: "6日目は**コンポーネント内の state** です。**`useState`**、**状態の形**、**純粋なレンダー**、**Strict Mode**、**オブジェクト／配列のイミュータブル更新**（ネスト含む）、**Immer**、**状態の持ち上げ**、最後に **state 更新の演習** と **ExpandableText** です。",
    },
    {
      en: "Your module runs about **41 minutes** from Introduction (**0m25s**) through **ExpandableText** (**~6m22s**). Treat timestamps as **pacing hints**.",
      np: "मोड्युल **~४१ मिनेट** Introduction देखि **ExpandableText**। समय **संकेत** मात्र।",
      jp: "教材は **約41分**（イントロ **0m25s** 〜 **ExpandableText** 約 **6m22s**）。時間は**目安**です。",
    },
  ],
  sections: [
    {
      title: {
        en: "Introduction (~0m 25s)",
        np: "परिचय (~०m २५s)",
        jp: "イントロ（約 0m25s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Local state** answers: “What does this widget remember between renders?” Prefer **the smallest representation** that can derive everything else (avoid syncing two booleans that mean the same thing). Remote server data is a **different concern** — you will layer **fetching libraries** later; today stays **client-only `useState`**.",
            np: "**स्थानीय state** — \"render बीच के याद?\" **न्यूनतम प्रतिनिधित्व**। दुई bool sync नगर्नुहोस्। सर्वर डाटा **अर्को चिन्ता** — आज **`useState`** मात्र।",
            jp: "**ローカル state** は「この UI が覚えておくこと」を表します。**冗長な二重フラグ**を避け、表現を最小に。**サーバデータ**は別レイヤで後から足します。今日は **`useState`** に集中します。",
          },
        },
      ],
    },
    {
      title: {
        en: "Understanding the State Hook (~4m 28s)",
        np: "State Hook बुझ्दै (~४m २८s)",
        jp: "State Hook の理解（約 4m28s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useState(initial)` returns **`[value, setValue]`**. Call **`setValue(next)`** or **`setValue(prev => next)`** — the **functional updater** avoids stale reads when the new value depends on the old one (rapid clicks, batched events). State updates may be **asynchronous and batched**; never assume `setCount(c+1); console.log(c)` prints the new number immediately.",
            np: "`useState` **`[value, setValue]`** फर्काउँछ। **`setValue(prev => …)`** — **functional updater** stale बचाउँछ। अद्यावधिक **async/batch** — `set` पछि तुरुन्त `console` पुरानो।",
            jp: "`useState` は **`[値, セッター]`** を返します。**`setX(x => …)`** の関数型更新で、連打時の古い値に依存しないようにします。更新は**バッチ**され得るので、直後の `console` は古い値のままかもしれません。",
          },
        },
        {
          type: "code",
          title: {
            en: "Functional updater for counters",
            np: "counter को लागि functional updater",
            jp: "関数型更新の例",
          },
          code: `const [count, setCount] = useState(0);

function bump() {
  setCount((c) => c + 1);
  setCount((c) => c + 1); // both see latest — results in +2
}`,
        },
      ],
    },
    {
      title: {
        en: "Choosing the state structure (~2m 56s)",
        np: "state संरचना छान्दै (~२m ५६s)",
        jp: "状態の形の選び方（約 2m56s）",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Avoid redundant fields** — e.g. store `items` only; derive `count` with `items.length` unless counting is expensive.",
              np: "**अनावश्यक फिल्ड होइन** — `items` मात्र; `count` ले `items.length` बाट।",
              jp: "**重複フィールドを持たない** — `items` があれば `length` で数は足りることが多いです。",
            },
            {
              en: "**Avoid deeply mirrored props in state** — if props are the source of truth, either use props directly or **reset** local state when an `id` prop changes (`useEffect` pattern comes next unit).",
              np: "**props लाई state मा नक्कल** — स्रोत props भए प्रत्यक्ष वा `id` बदल्दा reset (पछि `useEffect`)।",
              jp: "**props のコピーを state に常備しない** — 真実の源泉を一つに。`id` が変わったら同期するのは次の `useEffect` の話。",
            },
            {
              en: "**Normalize nested lists** when you need O(1) lookup by id (`Record<id, Item>` plus `order: id[]`).",
              np: "**नेस्ट सूची normalize** — O(1) lookup (`Record` + `order`)।",
              jp: "id 参照が多いなら **`Record` + id の配列** など正規化を検討します。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Keeping components pure (~2m 03s)",
        np: "कम्पोनेन्ट शुद्ध राख्दै (~२m ०३s)",
        jp: "コンポーネントを純粋に（約 2m03s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A component should be **pure** with respect to props + state: **same inputs → same JSX** (no reading `Math.random()`, mutating external variables, or writing to the DOM during render). **Side effects** belong in event handlers, `useEffect`, or data libraries — not in the render path.",
            np: "**शुद्ध** — उस्तै props+state → उस्तै JSX। `Math.random()` बाह्य mutate render मा होइन। **side effect** handler/`useEffect` मा।",
            jp: "**同じ props と state なら同じ JSX**（`Math.random()` や外部変数の破壊的変更、レンダー中の DOM 操作は避ける）。**副作用**はイベントや `useEffect` へ。",
          },
        },
      ],
    },
    {
      title: {
        en: "Understanding Strict Mode (~2m 42s)",
        np: "Strict Mode (~२m ४२s)",
        jp: "Strict Mode（約 2m42s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`<StrictMode>` in development **double-invokes** render and certain effects to surface **non-idempotent** bugs. It does **not** change production output size meaningfully. Do not “fix” duplicate logs by removing StrictMode — **fix impure render logic** instead.",
            np: "dev मा `<StrictMode>` **दुई पटक** render/effect — **non-idempotent** bug। production फरक छैन। StrictMode हटाउनु समाधान होइन।",
            jp: "開発時 **`<StrictMode>`** は意図的に二重実行することがあります。**本番の挙動を変えるためではなく**、副作用のバグを見つけるためです。ログが二重になるからといって外さない方がよいです。",
          },
        },
      ],
    },
    {
      title: {
        en: "Updating objects (~2m 21s)",
        np: "वस्तु अद्यावधिक (~२m २१s)",
        jp: "オブジェクトの更新（約 2m21s）",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Replace one field immutably",
            np: "एक फिल्ड इम्युटेबल",
            jp: "イミュータブルに1フィールドだけ変える",
          },
          code: `const [user, setUser] = useState({ name: \"Ada\", age: 36 });

function rename(next) {
  setUser({ ...user, name: next });
}

// Safer when user may be stale:
function renameSafe(next) {
  setUser((u) => ({ ...u, name: next }));
}`,
        },
      ],
    },
    {
      title: {
        en: "Updating nested objects (~2m 15s)",
        np: "नेस्ट वस्तु (~२m १५s)",
        jp: "ネストしたオブジェクト（約 2m15s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Spread **each level** you replace: `setForm({ ...form, address: { ...form.address, city: nextCity } })`. For very deep trees, **flatten state**, **normalize by id**, or use **Immer** — manual spreads become error-prone.",
            np: "प्रत्येक स्तर **spread**: `address: { ...form.address, city }`। गहिरो भए **flatten**, **id normalize**, वा **Immer**।",
            jp: "ネストは**各レベルをスプレッド**でコピーします。深すぎるなら**フラット化**や **Immer** を検討します。",
          },
        },
      ],
    },
    {
      title: {
        en: "Updating arrays (~1m 49s)",
        np: "सरणी अद्यावधिक (~१m ४९s)",
        jp: "配列の更新（約 1m49s）",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Add** — `setItems([...items, newItem])` or `items.concat(newItem)`.",
              np: "**थप** — `[...items, new]` वा `concat`।",
              jp: "**追加**: スプレッドや `concat` で新配列を作る。",
            },
            {
              en: "**Remove** — `items.filter((_, i) => i !== index)` or filter by `id`.",
              np: "**हटाउने** — `filter`।",
              jp: "**削除**: `filter` で新しい配列にする。",
            },
            {
              en: "**Replace at index** — `items.map((x, i) => (i === idx ? next : x))`.",
              np: "**इन्डेक्स बदल** — `map`।",
              jp: "**置換**: `map` で該当要素だけ差し替え。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Updating array of objects (~1m 46s)",
        np: "वस्तुहरूको सरणी (~१m ४६s)",
        jp: "オブジェクトの配列（約 1m46s）",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Patch one item by id",
            np: "id बाट एउटा वस्तु patch",
            jp: "id で1件だけ更新",
          },
          code: `function updateTodo(todos, id, patch) {
  return todos.map((t) => (t.id === id ? { ...t, ...patch } : t));
}`,
        },
      ],
    },
    {
      title: {
        en: "Simplifying update logic with Immer (~2m 56s)",
        np: "Immer सहित सरलीकरण (~२m ५६s)",
        jp: "Immer で更新を簡略化（約 2m56s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The **`immer`** package `produce(current, draft => { draft.x.y = 1 })` returns a **new immutable snapshot** while you write **mutative-looking** code on a draft proxy. Great for **complex nested forms**. Install **`immer`** and optionally **`use-immer`** hook; keep team agreement — not every codebase adopts it.",
            np: "**`immer`** `produce` — **mutable जस्तो** लेख, **immutable** नतिजा। जटिल फर्म। **`immer`**, **`use-immer`**।",
            jp: "**`immer`** の `produce` は、**書き味はミュータブル**、結果は**イミュータブル**です。ネストしたフォーム向き。**`use-immer`** もあります。採用はチーム合意で。",
          },
        },
      ],
    },
    {
      title: {
        en: "Sharing state between components (~6m 22s)",
        np: "कम्पोनेन्ट बीच state (~६m २२s)",
        jp: "コンポーネント間で state を共有（約 6m22s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When two components must stay in sync, **lift state** to their **closest common parent** and pass **values + setters (or wrapped callbacks)** as props. Same pattern as Day 4 — now you apply it after **mutable-update discipline** is clear.",
            np: "दुई कम्पोनेन्ट sync — **नजिकको अभिभावक** मा state, **मान + setter** props। दिन ४ जस्तै — अहिले **immutable** पछि।",
            jp: "同期が必要なら**共通親に state を持ち上げ**、値と更新関数を props で渡します（Day 4 の延長）。**イミュータブル更新**とセットで使います。",
          },
        },
      ],
    },
    {
      title: {
        en: "Exercise — Updating state (~4m 49s)",
        np: "अभ्यास — state अद्यावधिक (~४m ४९s)",
        jp: "演習：state の更新（約 4m49s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Practice **toggle booleans**, **numeric counters with bounds**, and **immutable object patches** in one small screen. Add **unit tests** later with React Testing Library — for now, click through every path in the browser.",
            np: "**toggle bool**, **सीमा सहित counter**, **object patch** एउटा स्क्रिनमा। पछि RTL test; अहिले ब्राउजरमा सबै path।",
            jp: "**真偽のトグル**、**上下限付きカウンタ**、**オブジェクトの部分更新**を一画面で練習します。まずはブラウザで全経路を押さえます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Exercise — Building an ExpandableText component (~6m 22s)",
        np: "अभ्यास — ExpandableText (~६m २२s)",
        jp: "演習：ExpandableText（約 6m22s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Track **`expanded`** with `useState(false)`. Show a **truncated preview** (CSS `line-clamp` or substring) plus a **Show more** control that flips state; **Show less** collapses. Pass **`maxLines`** or **`maxChars`** as props so the component stays reusable.",
            np: "**`expanded`** `useState(false)`। **truncated** + **Show more/less**। **`maxLines`/`maxChars`** props।",
            jp: "**`expanded`** を `useState` で持ち、**省略表示**と **もっと見る／閉じる** を切り替えます。**`maxLines`** などは props で再利用性を上げます。",
          },
        },
        {
          type: "code",
          title: {
            en: "ExpandableText.jsx (sketch)",
            np: "ExpandableText.jsx",
            jp: "ExpandableText の骨子",
          },
          code: `import { useState } from "react";

export function ExpandableText({ text, maxChars = 120 }) {
  const [open, setOpen] = useState(false);
  const needsClamp = text.length > maxChars;
  const shown = !needsClamp || open ? text : \`\${text.slice(0, maxChars)}…\`;

  return (
    <div>
      <p>{shown}</p>
      {needsClamp ? (
        <button type=\"button\" onClick={() => setOpen((v) => !v)}>
          {open ? \"Show less\" : \"Show more\"}
        </button>
      ) : null}
    </div>
  );
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why does my array update not re-render when I use `items.push(x)`?",
        np: "`items.push` ले re-render किन गर्दैन?",
        jp: "`push` しても再レンダーされないのは？",
      },
      answer: {
        en: "`push` **mutates the same array reference** React already knew about. Always build a **new array** (`[...items, x]`) or use functional updaters so the reference changes and React can detect the update.",
        np: "`push` **उही reference** mutate गर्छ। **नयाँ सरणी** (`[...items, x]`) वा functional updater।",
        jp: "`push` は**同じ配列参照**を変えるだけなので、検知されません。**新しい配列**を返してください。",
      },
    },
    {
      question: {
        en: "When should I split one `useState` object vs many `useState` primitives?",
        np: "एक object state वा धेरै primitive?",
        jp: "オブジェクト1つの state と、複数の useState どちら？",
      },
      answer: {
        en: "If fields **always change together**, one object is fine. If you update **one field extremely often** (typing in an input) and others rarely, **separate state** can reduce unrelated re-renders of children — measure before micro-optimizing.",
        np: "सधै सँगै बदल्छन् भने object। एउटा फिल्ड धेरै छिटो बदल्छ भने **छुट्टै state** — माइक्रो अनुकूलन अघि मापन।",
        jp: "まとまって変わるならオブジェクト。**更新頻度が大きく違う**なら分ける選択もあります（まず測定）。",
      },
    },
    {
      question: {
        en: "Is Immer a replacement for Redux?",
        np: "Immer ले Redux प्रतिस्थापन गर्छ?",
        jp: "Immer は Redux の代わり？",
      },
      answer: {
        en: "**No.** Immer is a **tool for immutable updates**. Redux Toolkit **uses Immer internally** for reducers, but you can use Immer with plain `useState` too. Redux solves **global store + time-travel debugging** — a different scope.",
        np: "**होइन।** Immer **immutable अद्यावधिक उपकरण**। Redux Toolkit **भित्र Immer**। Redux **global store** — फरक दायरा।",
        jp: "**別物**です。Immer は**更新の書きやすさ**用。Redux は**グローバルストア**など別の問題を扱います（RTK は内部で Immer を利用）。",
      },
    },
    {
      question: {
        en: "Does StrictMode run effects twice in production?",
        np: "StrictMode production मा effect दुई पटक?",
        jp: "Strict Mode は本番でも effect が二重？",
      },
      answer: {
        en: "**Double-invocation of some effects is a development aid** to detect missing cleanup. Production behavior follows your dependency arrays; StrictMode does not intentionally double-fire production effects the same way.",
        np: "dev मा केही effect **दुई पटक** — cleanup जाँच। production **निर्भरता सूची** अनुसार।",
        jp: "開発時の挙動が中心で、**本番を意図的に二重実行するためではありません**（クリーンアップ漏れの検出が目的）。",
      },
    },
    {
      question: {
        en: "Can I store a Date or Map in useState?",
        np: "useState मा Date वा Map?",
        jp: "useState に Date や Map を入れていい？",
      },
      answer: {
        en: "**Yes**, but updates must still **replace the reference** when the content changes (`setD(new Date(t))`, `setM(new Map(m))` after mutating a copy). Many teams **serialize to primitives** (ISO strings) for simpler equality reasoning.",
        np: "**हो**, तर **reference बदल्नुहोस्**। सरलताको लागि **ISO string** पनि।",
        jp: "**可能**ですが、中身を変えたら**新しい参照**を渡す必要があります。比較を単純にしたいなら **ISO 文字列**なども検討されます。",
      },
    },
    {
      question: {
        en: "What is wrong with `useState(Math.random())`?",
        np: "`useState(Math.random())` किन बेठीक?",
        jp: "`useState(Math.random())` がダメな理由は？",
      },
      answer: {
        en: "The initializer runs **again when React remounts** the component (routes, keys, StrictMode dev remounts). You get a **new random value unexpectedly**. Use **`useState(() => initialFromProps())`** or **`useMemo`** patterns when the initial value is expensive or must be stable per mount policy.",
        np: "initializer **remount** मा फेरि — **अनपेक्षित random**। **`useState(() => …)`** प्रयोग।",
        jp: "初期化子は**再マウントで再実行**されます。毎回変わっては困る値は **`useState(() => …)`** や方針に応じて `useMemo` を検討します。",
      },
    },
    {
      question: {
        en: "Should ExpandableText be controlled from the parent?",
        np: "ExpandableText अभिभावकबाट नियन्त्रित?",
        jp: "ExpandableText は親から制御？",
      },
      answer: {
        en: "**Internal state** is fine when only the component cares about expanded/collapsed. If the parent must **deep-link** open sections or **persist** expansion, lift `expanded` up and pass **`expanded` + `onToggle`** props (controlled pattern).",
        np: "कम्पोनेन्ट मात्र हेर्छ भने **आन्तरिक state**। **URL/persist** चाहिए **controlled**।",
        jp: "開閉がこの UI 内だけなら**内部 state**で十分。**URL 同期や永続化**なら親に持ち上げて制御します。",
      },
    },
    {
      question: {
        en: "How does this relate to `useReducer`?",
        np: "`useReducer` सँग सम्बन्ध?",
        jp: "`useReducer` との関係は？",
      },
      answer: {
        en: "`useReducer` shines when **many event types** update the same complex state machine. Everything you learned about **immutable updates** still applies — reducers must return **new state objects**. You will refactor to `useReducer` when transitions multiply.",
        np: "`useReducer` — **धेरै घटना** एउटा जटिल state। **immutable** फेरि लागू।",
        jp: "**遷移が増えたら `useReducer`** が向きます。ここで学んだ**イミュータブル更新**はそのまま reducer に活きます。",
      },
    },
  ],
  bullets: [
    {
      en: "Rewrite one mutating `items.push` into an immutable `setItems([...items, x])` and watch DevTools re-render.",
      np: "`push` लाई `[...items, x]` मा; DevTools मा re-render।",
      jp: "`push` をやめてスプレッド追加に書き換え、再レンダーを確認する。",
    },
    {
      en: "Implement **ExpandableText** with `maxChars`, keyboard-accessible toggle, and `aria-expanded` on the button.",
      np: "**ExpandableText** `maxChars`, keyboard, `aria-expanded`।",
      jp: "**ExpandableText** に `maxChars`、キーボード、`aria-expanded` を付ける。",
    },
    {
      en: "Optional: install **`immer`** and rewrite one nested `setForm({...})` spread chain using `produce`.",
      np: "वैकल्पिक: **`immer`** स्थापना गरी `produce` ले nested `setForm`।",
      jp: "任意で **`immer`** を入れ、ネストした `setForm` を `produce` で書き直す。",
    },
  ],
};
