import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 3 aligns with the “Building components” video block (~58m): intro → ListGroup → fragments → lists → conditionals → events. */
export const REACT_DAY_3_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 3 moves from scaffolding to composition: you will build a small ListGroup-style component, return lists without wrapper div pollution using fragments, render arrays safely with `key`, branch UI with conditional rendering, and wire DOM events in React’s model.",
      np: "दिन ३ scaffolding बाट composition मा: ListGroup-शैली कम्पोनेन्ट, fragment ले अतिरिक्त div बिना सूची, `key` सहित सूची, conditional rendering, र घटना।",
      jp: "3日目は組み立てに移ります。ListGroup 風コンポーネント、フラグメント、キー付きリスト、条件付きレンダー、イベントを扱います。",
    },
    {
      en: "Lesson timings in your course (Introduction 0m35s through Handling events) map to the sections below — treat timestamps as optional pacing, not prerequisites to memorize.",
      np: "पाठ्यक्रम समय (Introduction 0m35s देखि events) तलका खण्डसँग मेल खान्छ — समय मुख्य होइन।",
      jp: "動画の目安時間（イントロ 0m35s 〜 イベント）は下の見出しに対応。時間は目安で十分です。",
    },
  ],
  sections: [
    {
      title: {
        en: "01 · Introduction",
        np: "०१ · परिचय",
        jp: "01 · はじめに",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Components are the unit of reuse: each one should have a clear boundary (props in, JSX out). Prefer many small components over one giant file — easier to test, name, and refactor. Today every example stays function-based; class components still exist in legacy codebases but are not the default for new work.",
            np: "कम्पोनेन्ट पुन: प्रयोग एकाइ: स्पष्ट सीमा (props भित्र, JSX बाहिर)। धेरै साना कम्पोनेन्ट — परीक्षण र refactor सजिलो। आज फंक्शन मात्र; class पुरानो कोडबेसमा।",
            jp: "コンポーネントは再利用の単位です。境界（props → JSX）をはっきりさせ、小さく分けるとテストと改修が楽です。今日は関数コンポーネントのみ扱います。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "One responsibility — a `ListGroup` lists items; it should not also fetch data or own global app state (those come later with hooks and data libraries).",
              np: "एक जिम्मेवारी — `ListGroup` ले वस्तु सूची गर्छ; data fetch वा global state पछि।",
              jp: "単一責任 — リスト表示とデータ取得は分ける（取得は後の章）。",
            },
            {
              en: "Naming — `PascalCase` for components (`ListGroup`), `camelCase` for values and functions (`handleSelect`).",
              np: "नाम — कम्पोनेन्ट `PascalCase` (`ListGroup`), मान/फंक्फन `camelCase` (`handleSelect`)।",
              jp: "命名 — コンポーネントは `PascalCase`、関数・変数は `camelCase`。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "02 · Creating a ListGroup component (~5m 36s)",
        np: "०२ · ListGroup कम्पोनेन्ट (~५m ३६s)",
        jp: "02 · ListGroup コンポーネント（約 5m36s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A ListGroup receives an array of labels (or richer objects later) via props and maps each entry to a row. Keep presentation (CSS classes, `aria` roles) inside the list component so parents only pass data + callbacks.",
            np: "ListGroup ले props मार्फत लेबल सरणी लिन्छ र प्रत्येक पङ्क्तिमा map। CSS/`aria` सूची भित्र; अभिभावकले डाटा + callback मात्र।",
            jp: "ListGroup は props で項目配列を受け取り、行に map します。見た目や `aria` はリスト側に閉じ込め、親はデータとコールバックを渡す形にします。",
          },
        },
        {
          type: "code",
          title: {
            en: "ListGroup.jsx — props + map",
            np: "ListGroup.jsx — props + map",
            jp: "ListGroup.jsx",
          },
          code: `function ListGroup({ items, heading = "Pick one", onSelect }) {
  return (
    <div className="list-group-root">
      {heading ? <h2 className="list-group-label">{heading}</h2> : null}
      <ul className="list-group" role="listbox" aria-label={heading}>
        {items.map((label, index) => (
          <li
            key={\`\${label}-\${index}\`}
            role="option"
            tabIndex={0}
            className="list-group-item"
            onClick={() => onSelect?.(label, index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.(label, index);
              }
            }}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListGroup;`,
        },
        {
          type: "paragraph",
          text: {
            en: "Default parameter `heading = \"Pick one\"` shows optional props with fallbacks. `onSelect?.(...)` uses optional chaining so the list still renders if the parent omits the callback. The `key` uses `label` + `index` as a teaching default; prefer stable ids from your data when items can reorder or labels can repeat.",
            np: "Default `heading`। `onSelect?.`। `key` मा `label-index` शिक्षण डिफल्ट; पुन: क्रम वा दोहोरिएको लेबल भए डाटाबाट स्थिर id।",
            jp: "デフォルト引数と `?.` の説明は上のとおり。`key` の `\`${label}-${index}\`` は教材向けの折衷で、並び替えや重複ラベルがある本番データでは 一意の id を使ってください。",
          },
        },
      ],
    },
    {
      title: {
        en: "03 · Fragments (~2m 28s)",
        np: "०३ · Fragments (~२m २८s)",
        jp: "03 · フラグメント（約 2m28s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "JSX expressions must return a single parent. Without fragments you might wrap rows in an extra `<div>` that breaks semantics (e.g. `ul` may only contain `li`). `<React.Fragment>` or the short syntax `<>...</>` group siblings without adding a DOM node.",
            np: "JSX ले एक अभिभावक फर्काउनुपर्छ। अतिरिक्त `<div>` ले semantics बिग्रिन्छ (जस्तै `ul` भित्र `li` मात्र)। `<Fragment>` वा `<>...<>` DOM नथपी समूह।",
            jp: "JSX は親が一つという制約があります。余計な `<div>` で `ul` の構造が壊れないよう、フラグメントで兄弟をまとめます（DOM ノードは増えません）。",
          },
        },
        {
          type: "code",
          title: {
            en: "Short fragment inside a strict parent",
            np: "कडा अभिभावक भित्र छोटो fragment",
            jp: "厳しい親の下でのフラグメント",
          },
          code: `import { Fragment } from "react";

function Toolbar({ left, right }) {
  return (
    <header className="toolbar">
      <Fragment>
        {left}
        <span className="grow" aria-hidden />
        {right}
      </Fragment>
    </header>
  );
}

// Inside .map: <Fragment key={city.id}>…</Fragment> — short <> cannot take key.`,
        },
      ],
    },
    {
      title: {
        en: "04 · Rendering lists (~3m 30s)",
        np: "०४ · सूची render (~३m ३०s)",
        jp: "04 · リストのレンダー（約 3m30s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When you `.map` JSX, each sibling at the top level of the map needs a stable `key`. Keys help React match previous and next trees so state and DOM nodes are reused instead of destroyed and recreated. `key` is not a prop — do not read `props.key` inside the child; pass an explicit `id` if the child needs it.",
            np: "`.map` मा प्रत्येक शीर्ष स्तर `key` चाहिन्छ। React ले रूख मिलाउँछ। `key` prop होइन — बच्चालाई `id` छुट्टै पठाउनुहोस्।",
            jp: "`.map` で並べる各要素には安定した `key` が必要です。差分でどれとどれが同じアイテムか判断します。`key` は props ではありません（子に識別子が必要なら `id` を別途渡す）。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Stable business ids — `item.id`, ISBN, username — beat array index when the list can reorder, insert, or delete.",
              np: "स्थिर id — `item.id` — सूची पुन: क्रम, थप, मेट हुन्छ भने index भन्दा राम्रो।",
              jp: "安定した ID（`item.id` 等）は並び替え・挿入があるリストで index より適切です。",
            },
            {
              en: "Index as key is acceptable only for static lists that never reorder and have no internal state keyed by position.",
              np: "Index key मात्र स्थिर सूचीमा जुन कहिल्यै पुन: क्रम हुँदैन।",
              jp: "index を key にするのは、並び替えない静的リストの例外に近いです。",
            },
          ],
        },
        {
          type: "code",
          title: {
            en: "List of objects with stable keys",
            np: "स्थिर key सहित वस्तु सूची",
            jp: "オブジェクト配列と key",
          },
          code: `const cities = [
  { id: "tyo", name: "Tokyo" },
  { id: "ktm", name: "Kathmandu" },
];

function CityList() {
  return (
    <ul>
      {cities.map((city) => (
        <li key={city.id}>{city.name}</li>
      ))}
    </ul>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "05 · Conditional rendering (~5m 25s)",
        np: "०५ · सर्तीय render (~५m २५s)",
        jp: "05 · 条件付きレンダー（約 5m25s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Pick a style and stay consistent: `condition && <Node />` (watch out — the number `0` renders as text), ternary `a ? b : c`, or early `return null` at the top of a component for loading / error guards.",
            np: "एक शैली राख्नुहोस्: `&&` (`0` पाठ render हुन्छ!), ternary, वा early return null loading/error को लागि।",
            jp: "`&&`（`0` が表示される罠に注意）、三項、先頭の `return null`（ガード）から選び、ファイル内で揃えます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Ternary + null guard",
            np: "Ternary + null guard",
            jp: "三項と null ガード",
          },
          code: `function Banner({ status, message }) {
  if (status === "loading") return <p className="muted">Loading…</p>;
  if (status === "error") return <p role="alert">{message}</p>;
  return message ? <p>{message}</p> : null;
}`,
        },
      ],
    },
    {
      title: {
        en: "06 · Handling events",
        np: "०६ · घटना ह्यान्डलिङ",
        jp: "06 · イベント処理",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Pass a function reference to props like `onClick={handleClick}`, not `onClick={handleClick()}` (that would invoke immediately on render). Handlers can receive the synthetic event object (`event.preventDefault()`, `event.stopPropagation()`). Name handlers `handleThing` in components for readability.",
            np: "`onClick={handleClick}` — `handleClick()` होइन (render मै चल्छ)। synthetic event। नाम `handleThing`।",
            jp: "`onClick={handleClick}` と書き、`handleClick()` としない（後者は描画時に実行されます）。SyntheticEvent で `preventDefault` 等。ハンドラ名は `handle…` が読みやすいです。",
          },
        },
        {
          type: "code",
          title: {
            en: "Inline vs extracted handler",
            np: "इनलाइन बनाम निकालिएको",
            jp: "インラインと抽出",
          },
          code: `import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((c) => c + 1);

  return (
    <div>
      <button type="button" onClick={increment}>
        count is {count}
      </button>
      <button type="button" onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "This snippet previews `useState` (covered in depth next): the important pattern for events is `setState` with an updater `c => c + 1` when the new value depends on the previous one, avoiding stale closures in rapid clicks.",
            np: "`useState` पूर्वावलोकन; `c => c + 1` updater — छिटो क्लिकमा stale closure बचाउँछ।",
            jp: "`useState` は次で本格導入。`c => c + 1` の updater は連打時の古い値に依存しないための定番です。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why can’t I put `key` on the inner `<span>` instead of the outer `<li>`?",
        np: "`key` भित्र `<span>` मा किन होइन?",
        jp: "`key` は外側の `<li>` にしか付けられないの？",
      },
      answer: {
        en: "`key` belongs on the outermost element React returns from the `.map` callback for that iteration — the one that is a direct sibling in the list React is reconciling. If you wrap the `<li>` in a fragment, the fragment needs the key instead.",
        np: "`key` `.map` बाट फर्कने सबैभन्दा बाहिरी sibling मा — reconcile हुने सूचीमा। Fragment ले बेर्ने भए fragment मा key।",
        jp: "`.map` が返す兄弟の並びの一番外につけます。フラグメントで包むならフラグメントに key が必要です。",
      },
    },
    {
      question: {
        en: "What happens if I use `items.map((item, i) => <li key={i}>` on a sortable list?",
        np: "sortable सूचीमा `key={i}`?",
        jp: "並び替えリストで `key={i}` すると？",
      },
      answer: {
        en: "When order changes, React may reuse the wrong DOM node for a different item — inputs keep old text, animations fire on the wrong row, internal state gets mixed up. Prefer stable ids from your data model.",
        np: "क्रम बदल्दा React गलत DOM पुन: प्रयोग गर्न सक्छ — input पुरानो पाठ, state मिस। स्थिर id रोज्नुहोस्।",
        jp: "順序が変わると別アイテムに DOM が付け替わり、入力値や内部 state がずれます。データの id を使ってください。",
      },
    },
    {
      question: {
        en: "Does `<></>` accept a `key` prop?",
        np: "`<>` मा `key`?",
        jp: "`<></>` に `key` は付けられる？",
      },
      answer: {
        en: "No. The short syntax cannot take attributes. Use `<React.Fragment key={id}>…</React.Fragment>` when a keyed fragment is required (common inside `.map`).",
        np: "होइन। छोटो syntax मा attribute हुँदैन। `key` चाहिए `<Fragment key={id}>`।",
        jp: "付けられません。 短縮形には属性を書けないので、`<Fragment key={…}>` を使います。",
      },
    },
    {
      question: {
        en: "Why does `{count && <Badge />}` show “0” on screen sometimes?",
        np: "`{count && <Badge />}` ले \"0\" किन देखाउँछ?",
        jp: "`{count && …}` で 0 が画面に出るのは？",
      },
      answer: {
        en: "React renders any renderable value returned from `{…}`. The number `0` is renderable, so `0 && <Badge />` evaluates to `0`, which prints. Use `count > 0 && …`, `Boolean(count) && …`, or a ternary.",
        np: "React ले render हुने मान देखाउँछ। `0` render हुन्छ। `count > 0 &&` वा ternary प्रयोग गर्नुहोस्।",
        jp: "`0` は表示可能な値なので、`0 && …` は `0` が表示されます。`count > 0` や三項で避けます。",
      },
    },
    {
      question: {
        en: "Should I use an arrow in `onClick={() => doThing(id)}` or bind another way?",
        np: "`onClick={() => doThing(id)}` वा bind?",
        jp: "`onClick={() => …}` でいい？",
      },
      answer: {
        en: "Inline arrows are fine for small lists and are the most readable way to pass `id`. For huge tables, you might memoize rows or attach one delegated listener on the parent — optimisation comes when profiling says you need it.",
        np: "सानो सूचीमा inline arrow ठीक — `id` पठाउन पढ्न सजिलो। ठूलो तालिकामा पछि memo वा delegation।",
        jp: "小さめなら インライン arrow で十分です。巨大化してからメモや委譲を検討します。",
      },
    },
    {
      question: {
        en: "Are React events the same as native DOM events?",
        np: "React घटना र native DOM उस्तै?",
        jp: "React のイベントはネイティブと同じ？",
      },
      answer: {
        en: "They are wrapped for consistent behavior across browsers (`SyntheticEvent`). Most patterns match the DOM (`preventDefault`, `stopPropagation`), but avoid mixing assumptions about exact event timing with very low-level native APIs unless you read the docs.",
        np: "Wrapped (`SyntheticEvent`) — ब्राउजर बीच सुसंगत। धेरै DOM जस्तै; न्यून स्तर native API मा सावधान।",
        jp: "SyntheticEvent でラップされ、ブラウザ差を吸収します。基本 API は似ていますが、細部はドキュメント確認が安全です。",
      },
    },
    {
      question: {
        en: "Can a list item component call `useState` for its own hover state?",
        np: "सूची वस्तुले `useState` hover को लागि?",
        jp: "各行で hover の useState は？",
      },
      answer: {
        en: "Yes — local UI state like hover or expand/collapse per row is a normal pattern. Just ensure `key` stays stable so React does not remount the row component on unrelated parent re-renders.",
        np: "हो — hover जस्ता स्थानीय UI state। `key` स्थिर राख्नुहोस्।",
        jp: "問題ありません。行ごとの UI 状態はよくあります。`key` を安定させておけば、親の再レンダーで行が不必要にマウントし直されにくいです。",
      },
    },
    {
      question: {
        en: "What is the difference between `children` and mapping `items` yourself?",
        np: "`children` बनाम `items` map?",
        jp: "`children` と `items` の map の違いは？",
      },
      answer: {
        en: "`children` is whatever JSX the parent nested between your tags — flexible but less explicit about shape. Mapping `items` from props makes the data contract obvious (`string[]` or `{id,name}[]`) and is typical for `ListGroup`-style APIs.",
        np: "`children` — अभिभावकले नेस्ट गरेको JSX, लचिलो। `items` map — डाटा सम्झौता स्पष्ट — ListGroup API।",
        jp: "`children` は親が挟んだ任意のノード。`items` + map はデータ形が明確で、ListGroup 型 API に向きます。",
      },
    },
  ],
  bullets: [
    {
      en: "Implement `ListGroup` with `items`, optional `heading`, and `onSelect`; verify keyboard Enter/Space on a row.",
      np: "`ListGroup` मा `items`, `heading`, `onSelect`; Enter/Space जाँच।",
      jp: "`ListGroup` を実装し、キーボードで選択できるか確認する。",
    },
    {
      en: "Refactor a wrapper `<div>` that broke list semantics into a fragment; confirm DevTools shows only `ul > li`.",
      np: "semantics बिग्रने `<div>` लai fragment मा; DevTools मा `ul > li` मात्र।",
      jp: "余計な div をフラグメントに直し、`ul > li` 構造を DevTools で確認する。",
    },
    {
      en: "Build a small list with reorder (drag buttons or shuffle) using id keys, not index — watch React DevTools preserve row state.",
      np: "पुन: क्रम सूचीमा id key, index होइन — DevTools मा state।",
      jp: "並び替え可能なリストで id を key にし、行の state が保たれるか見る。",
    },
  ],
};
