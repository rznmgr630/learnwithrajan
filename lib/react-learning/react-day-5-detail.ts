import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 5 — “Styling components” block (~32m): global CSS → modules → CSS-in-JS, concerns, inline, UI kits, icons, module exercise, Like component. */
export const REACT_DAY_5_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 5 surveys how to style React components without fighting the framework: global CSS, CSS Modules for local class names, CSS-in-JS trade-offs, separation of concerns, inline styles for dynamic one-offs, UI libraries for speed, and icons. You finish with a CSS Modules exercise and a Like toggle that ties styling to state.",
      np: "दिन ५ ले React कम्पोनेन्ट कसरी शैली दिने हेर्छ: global CSS, CSS Modules, CSS-in-JS, चिन्ता अलगाव, inline, UI लाइब्रेरी, आइकन। अन्त्यमा CSS Modules अभ्यास र Like toggle।",
      jp: "5日目は React コンポーネントのスタイル の選択肢を横断します。グローバル CSS、CSS Modules、CSS-in-JS、関心の分離、インライン、UI ライブラリ、アイコン。最後に CSS Modules の演習 と Like トグルです。",
    },
    {
      en: "Your playlist totals about 32 minutes; timestamps below are pacing hints (Introduction 0m26s through Like ~5m19s). Pick one primary strategy per project — mixing three styling systems without discipline creates maintenance pain.",
      np: "प्लेलिस्ट ~३२ मिनेट; तलका समय गति संकेत। प्रति परियोजना एक मुख्य रणनीति — धेरै प्रणाली मिसाउँदा मर्मत दुख्छ।",
      jp: "再生リストは 約32分。タイムスタンプは目安です。プロジェクトごとに 主軸となるスタイル方針を一つ 決めると運用が楽です。",
    },
  ],
  sections: [
    {
      title: {
        en: "Introduction (~0m 26s)",
        np: "परिचय (~०m २६s)",
        jp: "イントロ（約 0m26s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React does not care where your CSS lives — only that class names on `className` or `style` objects reach the DOM. The ecosystem offers many answers; the skill is matching team size, design system maturity, and SSR constraints to a stack you can sustain.",
            np: "React लाई CSS कहाँ भन्दा className वा `style` DOM मा पुग्छ भन्ने मात्र। टिम, डिजाइन प्रणाली, SSR अनुसार stack छान्नुहोस्।",
            jp: "React は CSS の置き場所より、`className` / `style` が DOM に届くかが本質です。チーム規模や SSR に合わせて選びます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Vanilla CSS (~4m 11s)",
        np: "Vanilla CSS (~४m ११s)",
        jp: "Vanilla CSS（約 4m11s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Import a `.css` file from your entry (`main.jsx`) or from a component. Rules are global unless you use a naming convention (BEM, ITCSS) or build tools that hash classes. Good for reset, fonts, and tokens shared app-wide.",
            np: "`.css` `main.jsx` वा कम्पोनेन्टबाट import। नियम विश्वव्यापी — BEM जस्तो नाम वा hash। reset, font, token को लागि राम्रो।",
            jp: "`.css` を `main.jsx` やコンポーネントから import。グローバルになるので BEM 等かビルドのスコープ化が鍵。リセットやトークンに向きます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Component.jsx + sidecar global class names",
            np: "Component.jsx + global class",
            jp: "グローバルクラス例",
          },
          code: `import "./Badge.css";

export function Badge({ children }) {
  return <span className="badge badge--pill">{children}</span>;
}`,
        },
      ],
    },
    {
      title: {
        en: "CSS Modules (~3m 45s)",
        np: "CSS Modules (~३m ४५s)",
        jp: "CSS Modules（約 3m45s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Rename to `*.module.css`. Vite/webpack turns `.button` into a unique string at build time; you import `styles` as an object and use `styles.button`. Collisions disappear without runtime CSS-in-JS. `composes:` can reuse other local classes.",
            np: "फाइललाई `*.module.css` नाम दिनुहोस् — build ले अद्वितीय class string बनाउँछ; `styles.button`। `composes:` पुन: प्रयोग।",
            jp: "`*.module.css` を import すると `styles` オブジェクトが得られ、ビルド時にクラス名が一意化されます。`composes:` でローカルクラスを合成できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Button.module.css + JSX",
            np: "Button.module.css + JSX",
            jp: "Button.module.css",
          },
          code: `/* Button.module.css */
.root {
  border-radius: 999px;
  padding: 0.5rem 1rem;
}
.primary {
  composes: root;
  background: var(--accent);
  color: var(--accent-fg);
}

// Button.jsx
import styles from "./Button.module.css";

export function Button({ children }) {
  return <button type="button" className={styles.primary}>{children}</button>;
}`,
        },
      ],
    },
    {
      title: {
        en: "CSS-in-JS (~7m 51s)",
        np: "CSS-in-JS (~७m ५१s)",
        jp: "CSS-in-JS（約 7m51s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Libraries like styled-components or Emotion let you write CSS inside JavaScript (template literals or `css` props). Pros: colocation, easy dynamic styles from props, theme objects. Cons: runtime cost, SSR setup, debugging generated class names. Zero-runtime options (Vanilla Extract, Linaria) compile to static CSS files — middle ground.",
            np: "styled-components / Emotion — JS भित्र CSS। फाइदा: colocation, props बाट गतिशील। बेफाइदा: runtime, SSR। Vanilla Extract — शून्य-runtime।",
            jp: "styled-components / Emotion などは JS 内にスタイル。動的スタイルに強い一方、ランタイムコストと SSR 設定があります。Vanilla Extract 等はビルドで静的 CSS に落とします。",
          },
        },
      ],
    },
    {
      title: {
        en: "Separation of concerns (~2m 30s)",
        np: "चिन्ता अलगाव (~२m ३०s)",
        jp: "関心の分離（約 2m30s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "“Separation” does not mean “never put CSS near a component.” It means boundaries are clear: markup + behavior + scoped styles ship together for a feature, while design tokens (colors, spacing scales) stay shared. Avoid scattering magic numbers across dozens of files without a token layer.",
            np: "\"अलग\" भनेको \"CSS टाढा\" होइन — सीमा स्पष्ट: markup, व्यवहार, scoped style सँगै; token साझा। जादू संख्या छर्न नदिनुहोस्।",
            jp: "分離は「CSS を遠ざける」ではなく、責務の境界をはっきりさせることです。機能単位でまとめ、デザイントークンは共有レイヤに置きます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Inline styles (~1m 02s)",
        np: "इनलाइन शैली (~१m ०२s)",
        jp: "インラインスタイル（約 1m02s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The `style` prop accepts a camelCase JavaScript object (`backgroundColor`, not `background-color`). Good for one-off dynamics (progress width, drag position). Not for full themes — no pseudo-classes (`:hover`) unless you duplicate logic in JS. Prefer classes for complex styling.",
            np: "`style` — camelCase object (`backgroundColor`)। गतिशील एकल को लागि। `:hover` जस्तो छैन — जटिल शैली class मा।",
            jp: "`style` は キャメルケースのオブジェクトです。進捗バー幅など動的な一回り向き。`:hover` は CSS 側が向いています。",
          },
        },
        {
          type: "code",
          title: {
            en: "Dynamic bar width",
            np: "गतिशील बार चौडाइ",
            jp: "動的な幅",
          },
          code: `function ProgressBar({ value }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: \`\${value}%\` }} />
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Popular UI libraries (~2m 03s)",
        np: "लोकप्रिय UI लाइब्रेरी (~२m ०३s)",
        jp: "代表的な UI ライブラリ（約 2m03s）",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "MUI (Material UI) — comprehensive React components + theming; heavier bundle, strong docs.",
              np: "MUI — थोक कम्पोनेन्ट + theme; bundle भारी।",
              jp: "MUI — コンポーネントとテーマが揃い、バンドルは大きめ。",
            },
            {
              en: "Chakra UI / Mantine — ergonomic props (`colorScheme`, `size`), good DX for internal tools.",
              np: "Chakra / Mantine — सुविधाजनक props, आन्तरिक उपकरण।",
              jp: "Chakra / Mantine — props で組みやすい内向けツール向き。",
            },
            {
              en: "Radix Primitives / React Aria — unstyled accessible building blocks; you bring CSS Modules or Tailwind.",
              np: "Radix / React Aria — unstyled, पहुँच; CSS Modules/Tailwind सँग।",
              jp: "Radix 等はスタイルなしの高水準プリミティブ。見た目は自分で載せます。",
            },
            {
              en: "Bootstrap (`react-bootstrap`) — familiar grid + components; class-based mental model maps from HTML/CSS courses.",
              np: "react-bootstrap — चिनिएको grid; HTML पाठ्यक्रमसँग मेल।",
              jp: "react-bootstrap — 馴染みのグリッドとコンポーネント。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Adding icons (~1m 52s)",
        np: "आइकन थप्दै (~१m ५२s)",
        jp: "アイコンの追加（約 1m52s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Use `react-icons` (many packs as tree-shakeable imports), `lucide-react`, or inline SVG components for full control. Prefer SVG for crisp scaling; set `aria-hidden` on decorative icons and pair with visible text or `aria-label` on the control.",
            np: "`react-icons`, `lucide-react`, वा SVG। सजावटी मा `aria-hidden`; नियन्त्रणमा `aria-label`।",
            jp: "`react-icons` や `lucide-react`、または SVG コンポーネント。装飾なら `aria-hidden`、操作手段にはラベルを。",
          },
        },
        {
          type: "code",
          title: {
            en: "Lucide icon as a child of a button",
            np: "बटन भित्र Lucide",
            jp: "ボタン内に Lucide",
          },
          code: `import { Heart } from "lucide-react";

export function LikeButton({ liked, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      onClick={onToggle}
    >
      <Heart size={20} aria-hidden fill={liked ? "currentColor" : "none"} />
    </button>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Exercise — Using CSS Modules (~3m 00s)",
        np: "अभ्यास — CSS Modules (~३m ००s)",
        jp: "演習：CSS Modules（約 3m00s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Convert a component that used global class strings to `*.module.css`. Verify in DevTools that emitted class names include a hash suffix. Extract shared tokens (`--radius`, `--shadow`) to `:root` or a `tokens.css` import so modules stay lean.",
            np: "global class बाट `*.module.css` मा। DevTools मा hash पुष्टि। token `:root` वा `tokens.css`।",
            jp: "グローバル class を `*.module.css` に移し、DevTools で ハッシュ付きクラスを確認します。トークンは共通ファイルへ。",
          },
        },
      ],
    },
    {
      title: {
        en: "Building a Like component (~5m 19s)",
        np: "Like कम्पोनेन्ट (~५m १९s)",
        jp: "Like コンポーネント（約 5m19s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Combine `useState` for `liked` with visual feedback from CSS Modules (filled vs outline heart) or an icon prop. Keep click target at least ~44×44 CSS px for touch. Optional: `prefers-reduced-motion` media query to tone down animations.",
            np: "`useState` ले `liked` र CSS Module वा icon। क्लिक लक्ष्य ~४४px। `prefers-reduced-motion`।",
            jp: "`liked` の state と CSS Modules（塗りつぶし／線）やアイコンで表現します。タップ領域を確保し、必要なら `prefers-reduced-motion` で動きを控えめにします。",
          },
        },
        {
          type: "code",
          title: {
            en: "LikeButton.jsx + LikeButton.module.css (sketch)",
            np: "LikeButton.jsx + module css",
            jp: "Like ボタン例",
          },
          code: `import { useState } from "react";
import styles from "./LikeButton.module.css";
import { Heart } from "lucide-react";

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button
      type="button"
      className={\`\${styles.hit} \${liked ? styles.on : styles.off}\`}
      aria-pressed={liked}
      aria-label="Like"
      onClick={() => setLiked((v) => !v)}
    >
      <Heart className={styles.icon} size={22} aria-hidden />
    </button>
  );
}

/* LikeButton.module.css */
.hit { display: inline-grid; place-items: center; min-width: 44px; min-height: 44px; border: 0; border-radius: 999px; cursor: pointer; }
.on { color: crimson; background: color-mix(in oklab, crimson 12%, transparent); }
.off { color: var(--muted); background: var(--elevated); }
.icon { display: block; }`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Can I use Tailwind with React?",
        np: "React सँग Tailwind?",
        jp: "React で Tailwind は使える？",
      },
      answer: {
        en: "Yes — Tailwind is a utility-first CSS build step that emits classes you place in `className`. It pairs well with Vite and PostCSS. It is not “CSS-in-JS” in the styled-components sense, but still co-locates styling with JSX via class lists.",
        np: "हो — Tailwind utility CSS build; `className` मा। Vite सँग राम्रो। styled-components जस्तो CSS-in-JS होइन।",
        jp: "使えます。 ユーティリティクラスを `className` に並べる方式で、Vite との組み合わせが一般的です。",
      },
    },
    {
      question: {
        en: "Why does my CSS Module class print as `Button_primary__x3F9a`?",
        np: "Module class लामो किन?",
        jp: "CSS Modules のクラス名が長いのは？",
      },
      answer: {
        en: "The bundler scopes your original class names by appending a hash derived from the file path and content. That guarantees uniqueness across the app while you keep short names like `.primary` in source.",
        np: "Bundler ले hash जोड्छ — फाइल र सामग्रीबाट अद्वितीयता; स्रोतमा `.primary` छोटो राख्न मिल्छ।",
        jp: "ビルドがファイル由来のハッシュを付け、アプリ全体で衝突しないようにしています。ソースでは短い名前で書けます。",
      },
    },
    {
      question: {
        en: "Should I mix CSS Modules and styled-components in one app?",
        np: "CSS Modules र styled-components मिसाउने?",
        jp: "CSS Modules と styled-components を混ぜていい？",
      },
      answer: {
        en: "Possible during migrations, but two mental models confuse onboarding. Prefer one primary system per surface (marketing pages might stay global CSS while the app shell uses modules, if documented).",
        np: "माइग्रेसनमा मिल्छ; दुई मोडेल भ्रम। एक मुख्य प्रणाली रोज्नुहोस्।",
        jp: "移行中はあり得ますが、方針を文書化して主軸を一つに寄せるのが無難です。",
      },
    },
    {
      question: {
        en: "Do inline styles beat CSS specificity wars?",
        np: "inline ले specificity जित्छ?",
        jp: "インラインで詳細度の戦いに勝てる？",
      },
      answer: {
        en: "Inline declarations are very specific to the element, but you still lose pseudo-elements, media queries, and animations unless you reimplement them. Use inline for truly dynamic values; keep design language in classes.",
        np: "इनलाइन विशिष्ट तर pseudo/media/animation हराउँछ। गतिशील मान मात्र; डिजाइन class मा।",
        jp: "インラインは要素に直結しますが、疑似クラスやメディアクエリは別途必要です。動的な数値に寄せ、デザイン言語は class に。",
      },
    },
    {
      question: {
        en: "How do UI libraries affect bundle size?",
        np: "UI लाइब्रेरी ले bundle कसरी?",
        jp: "UI ライブラリはバンドルにどう効く？",
      },
      answer: {
        en: "Full suites import many components unless you tree-shake carefully. Measure with `rollup-plugin-visualizer` or Next’s analyzer. Headless libraries ship less CSS because you supply styles.",
        np: "पूरा suite धेरै import — tree-shake। Headless ले कम CSS।",
        jp: "丸ごと取り込むと大きくなりやすいので tree-shaking と分析ツールで確認します。ヘッドレスは見た目分が軽いです。",
      },
    },
    {
      question: {
        en: "Can I use `class` instead of `className` in React?",
        np: "`class` प्रयोग गर्न मिल्छ?",
        jp: "`class` ではダメ？",
      },
      answer: {
        en: "Use `className` — React mirrors the DOM property name. (`class` works in some legacy compatibility paths but is not the JSX convention.)",
        np: "`className` प्रयोग गर्नुहोस् — DOM सम्पत्ति नाम। `class` JSX मा होइन।",
        jp: "`className` を使います（DOM のプロパティ名に合わせています）。",
      },
    },
    {
      question: {
        en: "What about CSS variables with React?",
        np: "CSS variables र React?",
        jp: "CSS 変数（カスタムプロパティ）は？",
      },
      answer: {
        en: "Excellent combo. Define tokens on `:root` or a layout wrapper, read them in any CSS file or inline `style={{ [\"--x\"]: value }}` for per-instance overrides. They bridge global design with component-specific tweaks.",
        np: "राम्रो जोडा। `:root` मा token; `style={{ ['--x']: v }}` पनि।",
        jp: "相性が良いです。 `:root` でトークンを定義し、インラインでは `style={{ ['--x']: value }}` で上書きもできます。",
      },
    },
    {
      question: {
        en: "Should the Like button own state or receive `liked` from parent?",
        np: "Like मा state अभिभावक वा सन्तान?",
        jp: "Like の state は親？子？",
      },
      answer: {
        en: "Local state is fine for a self-contained social “like” on a demo page. If other widgets must react (counter, analytics, disabled after submit), lift `liked` and pass `liked` + `onToggle` as props — same pattern as Day 4.",
        np: "डेमोमा स्थानीय state ठीक। अरू UI ले प्रतिक्रिया दिनुपर्छ भने lift गरी props।",
        jp: "デモなら子で stateで十分です。他の UI と連動するなら 親に持ち上げ、Day 4 と同様に props で渡します。",
      },
    },
  ],
  bullets: [
    {
      en: "Move one component from global classes to CSS Modules; confirm hashed classes in DevTools.",
      np: "एउटा कम्पोनेन्ट CSS Modules मा; DevTools मा hash।",
      jp: "1 コンポーネントを CSS Modules に移し、DevTools でハッシュを確認する。",
    },
    {
      en: "Add `lucide-react` (or `react-icons`) to a button with `aria-pressed` for a toggle.",
      np: "`lucide-react` + बटन + `aria-pressed`।",
      jp: "トグルボタンに `aria-pressed` とアイコンを付ける。",
    },
    {
      en: "Build LikeButton with `useState`, module classes for on/off, and 44px minimum hit target.",
      np: "LikeButton `useState`, on/off class, ४४px hit।",
      jp: "LikeButton を state・モジュール CSS・44px タップ領域で完成させる。",
    },
  ],
};
