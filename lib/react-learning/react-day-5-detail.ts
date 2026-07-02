import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_5_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Every React component needs a look. Unlike plain HTML where one `styles.css` file rules everything, React gives you several ways to style components — each with trade-offs.\n\nAnalogy: choosing a styling approach is like choosing how to dress:\n• <b>Off-the-rack</b> (Tailwind CSS) — grab utility classes, combine them, done fast\n• <b>Bespoke tailoring</b> (CSS Modules) — scoped styles, your own design language\n• <b>A uniform</b> (component library) — consistent, opinionated, zero decision fatigue\n\nNone is wrong. Pick the one that fits your team and project.",
      np: "React मा styling को धेरै तरिका: plain CSS, CSS Modules, Tailwind, inline styles, र UI libraries।",
      jp: "React のスタイリング方法は複数あります。Tailwind、CSS Modules、UIライブラリなどを比較します。",
    },
    {
      en: "In this day we cover:\n• <b>Plain CSS with `className`</b> — the simplest starting point\n• <b>CSS Modules</b> — scoped styles that never leak into other components\n• <b>Tailwind CSS</b> — utility-first, compose styles directly in JSX\n• <b>Inline styles</b> — dynamic values from JavaScript\n• <b>UI component libraries</b> — shadcn/ui, Radix UI, MUI, Mantine",
      np: "className, CSS Modules, Tailwind, inline styles, र UI libraries सबै cover गर्छौं।",
      jp: "className・CSS Modules・Tailwind・インラインスタイル・UIライブラリを学びます。",
    },
  ],
  sections: [
    {
      title: { en: "Plain CSS and className", np: "Plain CSS र className", jp: "プレーン CSS と className" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React uses <b>`className`</b> instead of `class` — because `class` is a reserved keyword in JavaScript. This is the most common beginner trip-up.\n\nPlain CSS: create a `.css` file, import it, and use class names in `className`. Simple — but global. A `.button` class in `Button.css` can accidentally affect every button in your entire app.\n\n• Use plain CSS for truly global styles (fonts, resets, base typography)\n↳ Put these in `index.css` or `global.css`\n• Avoid plain CSS for component-specific styles — use CSS Modules or Tailwind instead",
            np: "React मा `class` को सट्टा `className` प्रयोग गरिन्छ। Plain CSS global हुन्छ — component-specific styles को लागि Modules वा Tailwind राम्रो।",
            jp: "React では `class` の代わりに `className` を使います。プレーン CSS はグローバルなので注意が必要です。",
          },
        },
        {
          type: "code",
          title: { en: "Button.css + Button.jsx", np: "Button.css र Button.jsx", jp: "Button.css と Button.jsx" },
          code: `/* Button.css */
.button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.primary { background: #3b82f6; color: white; }
.danger  { background: #ef4444; color: white; }

/* Button.jsx */
import "./Button.css";

function Button({ label, variant = "primary" }) {
  return (
    <button className={\`button \${variant}\`}>
      {label}
    </button>
  );
}`,
        },
      ],
    },
    {
      title: { en: "CSS Modules — scoped styles", np: "CSS Modules — scoped styles", jp: "CSS Modules — スコープ付きスタイル" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "CSS Modules solve the global-name-collision problem by compiling class names to unique identifiers.\n\nAnalogy: CSS Modules are like a serial-numbered stamp — even if every component has a class called `.button`, they all get different compiled names like `Button_button__3xK4z`. No collisions, ever.\n\n• Files must end in <b>`.module.css`</b>\n• Import the module as an object: `import styles from './Card.module.css'`\n• Access classes as properties: `styles.card`\n↳ The runtime value is the unique compiled name — you never type it manually",
            np: "CSS Modules ले class names लाई unique identifiers मा compile गर्छ। `.module.css` file बनाउनुस् र object को रूपमा import गर्नुस्।",
            jp: "CSS Modules はクラス名をユニークなIDにコンパイルしてスコープを確保します。",
          },
        },
        {
          type: "code",
          title: { en: "Card.module.css + Card.jsx", np: "Card.module.css र Card.jsx", jp: "Card.module.css と Card.jsx" },
          code: `/* Card.module.css */
.card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}
.title    { font-size: 1.125rem; font-weight: 600; }
.featured { border-color: #3b82f6; background: #eff6ff; }

/* Card.jsx */
import styles from "./Card.module.css";
import clsx from "clsx"; // npm install clsx

function Card({ title, featured }) {
  return (
    <div className={clsx(styles.card, { [styles.featured]: featured })}>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: { en: "Tailwind CSS — utility-first styling", np: "Tailwind CSS — utility-first", jp: "Tailwind CSS — ユーティリティファースト" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Tailwind gives you hundreds of tiny single-purpose CSS classes. Instead of writing a separate CSS file, you compose styles directly in JSX.\n\nAnalogy: Tailwind is like cooking with individual spices — no premixed sauces, just raw ingredients you combine exactly the way you want.\n\n• `p-4` = `padding: 1rem`\n• `rounded-xl` = `border-radius: 0.75rem`\n• `hover:shadow-lg` = shadow appears on hover\n• `md:text-base` = apply at medium screen width and above\n↳ The prefix before `:` is a <b>modifier</b> — Tailwind supports responsive, hover, focus, dark mode, group, and more",
            np: "Tailwind मा utility classes JSX भित्रै compose गरिन्छ। `p-4`, `rounded-xl`, `hover:shadow-lg` जस्ता classes।",
            jp: "Tailwind はクラスを JSX に直接書いてスタイルを組み立てます。レスポンシブやダークモードもサポート。",
          },
        },
        {
          type: "code",
          title: { en: "Tailwind product card", np: "Tailwind card", jp: "Tailwind カードコンポーネント" },
          code: `// Install (Vite): npm install -D tailwindcss @tailwindcss/vite
// vite.config.js: plugins: [tailwindcss()]
// main.css: @import "tailwindcss";

function ProductCard({ name, price, image, inStock }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <img
        src={image}
        alt={name}
        className="mb-4 h-40 w-full rounded-lg object-cover"
      />
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        {name}
      </h3>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600">\${price}</span>
        <span
          className={\`rounded-full px-2.5 py-0.5 text-xs font-medium \${
            inStock
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }\`}
        >
          {inStock ? "In stock" : "Sold out"}
        </span>
      </div>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: { en: "Inline styles and dynamic styling", np: "Inline styles र dynamic styling", jp: "インラインスタイルと動的スタイリング" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "In React, the `style` prop takes a <b>JavaScript object</b> — not a CSS string. Property names are camelCase: `backgroundColor`, not `background-color`.\n\nUse inline styles for truly <b>dynamic values</b> that come from JavaScript at runtime:\n• Colours from a user preference stored in state\n• Positions from drag-and-drop coordinates\n• Progress bar widths computed from a percentage\n↳ For everything else, prefer Tailwind or CSS Modules — inline styles cannot do `:hover`, media queries, or keyframe animations\n\nBest pattern: <b>Tailwind for base styles + inline style for the one dynamic value</b>.",
            np: "React मा `style` prop JavaScript object लिन्छ। Dynamic values को लागि use गर्नुस् — hover/media queries support हुँदैन।",
            jp: "React の `style` は JS オブジェクトです。動的な値（色・座標）に使い、ホバーやメディアクエリは CSS で。",
          },
        },
        {
          type: "code",
          title: { en: "Progress bar + avatar with inline dynamic styles", np: "Dynamic inline style", jp: "動的インラインスタイル例" },
          code: `function ProgressBar({ value, max = 100 }) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-2 w-full rounded-full bg-gray-200">
      {/* Tailwind = base shape; inline = dynamic width */}
      <div
        className="h-full rounded-full bg-blue-500 transition-[width] duration-500"
        style={{ width: \`\${percent}%\` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemax={max}
      />
    </div>
  );
}

function Avatar({ user }) {
  // avatarColor comes from user's profile (e.g. "#e11d48")
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white"
      style={{ backgroundColor: user.avatarColor }}
    >
      {user.initials}
    </div>
  );
}`,
        },
      ],
    },
    {
      title: { en: "UI component libraries", np: "UI component libraries", jp: "UI コンポーネントライブラリ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A component library gives you pre-built, accessible components — modals, dropdowns, date pickers, tooltips — that would take days to build correctly from scratch.\n\nAnalogy: a UI library is like buying furniture. Faster than building, looks professional immediately — but you're bound to their design decisions. There are two categories:\n• <b>Headless libraries</b> (Radix UI, Headless UI) — behaviour and accessibility only; you add all the styles\n• <b>Styled libraries</b> (MUI, Mantine, shadcn/ui) — come with visual design",
            np: "UI libraries pre-built accessible components दिन्छन्। Headless (no styles) र opinionated (full styles) — दुई प्रकार।",
            jp: "UI ライブラリは既製コンポーネントを提供。ヘッドレス型と完全スタイル型があります。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Popular React UI libraries — choose based on how much control you need",
            np: "Popular UI libraries",
            jp: "主要 React UI ライブラリ比較",
          },
          headers: [
            { en: "Library", np: "Library", jp: "ライブラリ" },
            { en: "Styling", np: "Styling", jp: "スタイル" },
            { en: "Approach", np: "Approach", jp: "アプローチ" },
            { en: "Best for", np: "Best for", jp: "向いている用途" },
          ],
          rows: [
            [
              { en: "shadcn/ui", np: "shadcn/ui", jp: "shadcn/ui" },
              { en: "Tailwind", np: "Tailwind", jp: "Tailwind" },
              { en: "Copy-paste into your project — you own the code", np: "Copy-paste", jp: "ソースをプロジェクトにコピー" },
              { en: "Tailwind projects, full design control", np: "Tailwind + control", jp: "Tailwind × 自由度重視" },
            ],
            [
              { en: "Radix UI", np: "Radix UI", jp: "Radix UI" },
              { en: "Headless (unstyled)", np: "Unstyled", jp: "スタイルなし" },
              { en: "Accessible primitives — you supply all styles", np: "Accessible primitives", jp: "アクセシブルな土台のみ" },
              { en: "Custom design systems", np: "Custom design", jp: "独自デザインシステム" },
            ],
            [
              { en: "MUI (Material UI)", np: "MUI", jp: "MUI" },
              { en: "Material Design", np: "Material Design", jp: "Material Design" },
              { en: "Full-featured, highly opinionated", np: "Full-featured", jp: "フル機能・意見が強め" },
              { en: "Admin dashboards, enterprise apps", np: "Admin, enterprise", jp: "管理画面・エンタープライズ" },
            ],
            [
              { en: "Mantine", np: "Mantine", jp: "Mantine" },
              { en: "Custom CSS", np: "Custom CSS", jp: "独自 CSS" },
              { en: "100+ components, form hooks, great DX", np: "100+ components", jp: "100+コンポーネント・DX良好" },
              { en: "Mid-size projects wanting batteries-included", np: "Mid-size projects", jp: "中規模・フル装備希望" },
            ],
          ],
        },
        {
          type: "code",
          title: { en: "shadcn/ui — install and use", np: "shadcn/ui setup", jp: "shadcn/ui のセットアップ" },
          code: `# 1. Initialise shadcn/ui in your Vite + Tailwind project
npx shadcn@latest init

# 2. Add individual components (copies source into src/components/ui/)
npx shadcn@latest add button card dialog

// 3. Use — fully customisable, the source code is yours
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function ProfileCard({ user }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{user.bio}</p>
        <Button variant="outline" className="mt-4">
          Follow
        </Button>
      </CardContent>
    </Card>
  );
}`,
        },
      ],
    },
    {
      title: { en: "React Icons — a single package for every icon set", np: "React Icons — एउटै package मा सबै icon sets", jp: "React Icons — 全アイコンセットを1パッケージで" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`react-icons` bundles the most popular icon sets — Font Awesome, Material Design, Feather, Bootstrap Icons, Ionicons, and more — behind one consistent component API. Instead of installing a separate package per icon set, you install `react-icons` once and import from whichever sub-package you need.\n\nAnalogy: `react-icons` is a hardware store with every brand of screw on one shelf, organized by aisle (sub-package) — you still have to walk to the right aisle instead of dumping the whole store in your cart.\n\n• Each icon set lives in its own sub-path: `react-icons/fa` (Font Awesome), `react-icons/md` (Material Design), `react-icons/fi` (Feather)\n• Icons render as inline SVG components — they inherit `color` from CSS `currentColor` by default, and accept a `size` prop directly\n↳ `<FaHeart color=\"red\" size={24} />` needs no extra CSS classes for sizing/coloring",
            np: "`react-icons` ले Font Awesome, Material Design, Feather जस्ता popular icon sets लाई एउटै API मुनि ल्याउँछ। हरेक set आफ्नो sub-path मा हुन्छ — जस्तै `react-icons/fa`।",
            jp: "`react-icons` は Font Awesome、Material Design、Feather など主要アイコンセットを1つの API にまとめます。各セットは `react-icons/fa` のようなサブパスにあります。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "<b>The one gotcha that matters — how you import it.</b> Day 24's bundle-analysis lesson already flagged this: `import * as Icons from 'react-icons'` pulls every icon from every icon set into your bundle, adding megabytes for a handful of icons. Always import named icons from the specific sub-package instead — bundlers can then tree-shake away everything you didn't use.",
            np: "Bundle bloat जोगिन सधैं specific sub-package बाट named import गर्नुस् — `react-icons` बाट सिधै `* as Icons` import नगर्नुस् (Day 24 मा bundle analysis मा यो touch भइसकेको छ)।",
            jp: "バンドル肥大化を避けるため、必ず特定のサブパッケージから named import すること。`react-icons` から `* as Icons` で読み込むのは禁物（Day 24 のバンドル分析でも触れています）。",
          },
        },
        {
          type: "code",
          title: { en: "Correct vs incorrect react-icons imports", np: "Correct vs incorrect import", jp: "正しい import と誤った import" },
          code: `// npm install react-icons

// CORRECT — named import from the specific set's sub-package
// Bundler tree-shakes away every other icon in "fa" and every other set entirely
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { MdSettings } from "react-icons/md";

function LikeButton({ liked }) {
  return (
    <button aria-label="Like">
      {/* color defaults to currentColor — inherits the button's text color */}
      <FaHeart color={liked ? "#ef4444" : "currentColor"} size={20} />
    </button>
  );
}

// WRONG — pulls in every icon from every icon set (Font Awesome, Material,
// Feather, Bootstrap, Ionicons...) even though only one icon is used.
// This alone can add several MB to your production bundle.
import * as Icons from "react-icons";
function BadButton() {
  return <Icons.FaHeart />;
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I use react-icons or install a single icon library directly (e.g. `lucide-react`)?",
        np: "react-icons कि सिधै एउटा icon library (जस्तै `lucide-react`) install गर्ने?",
        jp: "react-icons と単体アイコンライブラリ（`lucide-react` など）、どちらを使うべき？",
      },
      answer: {
        en: "Use a single dedicated library like `lucide-react` (the default in shadcn/ui) when your whole app commits to one visual style — it's already tree-shakeable per-icon and has a smaller, more consistent icon set. Reach for `react-icons` when you need icons from multiple design systems in one project (e.g. matching a specific brand's Font Awesome icon someone designed with) — just be disciplined about importing from the correct sub-package every time.",
        np: "एउटै visual style भए `lucide-react` जस्तो single library राम्रो। धेरै design systems बाट icons चाहिएमा `react-icons` — तर sub-package बाट मात्र import गर्नुस्।",
        jp: "一貫したビジュアルスタイルなら `lucide-react` のような単体ライブラリが良い。複数のデザインシステムのアイコンが必要なら `react-icons` を、サブパッケージから正しく import して使う。",
      },
    },
    {
      question: { en: "Why `className` instead of `class`?", np: "`className` किन?", jp: "なぜ `className`？" },
      answer: {
        en: "`class` is a reserved keyword in JavaScript (ES6 classes). Since JSX compiles to JavaScript function calls, using `class` would cause a syntax conflict. React chose `className` to sidestep this. Similarly, `for` in `<label for='...'>` becomes `htmlFor` in JSX.",
        np: "`class` JavaScript keyword हो। JSX JavaScript मा compile हुने भएकाले `className` प्रयोग गरिन्छ।",
        jp: "`class` は JS の予約語なので `className` を使います。`for` → `htmlFor` も同様です。",
      },
    },
    {
      question: { en: "What is the difference between CSS Modules and styled-components?", np: "CSS Modules र styled-components?", jp: "CSS Modules と styled-components の違いは？" },
      answer: {
        en: "CSS Modules: standard CSS files with scoped class names — compiled at build time, zero runtime cost. styled-components: CSS written in JavaScript template literals — requires a runtime library (~12kB gzipped) and generates class names dynamically. For new projects, CSS Modules or Tailwind is generally preferred for simplicity and performance. styled-components excels at dynamic theming based on JavaScript props.",
        np: "CSS Modules: build time, zero runtime। styled-components: runtime library, JS भित्र CSS।",
        jp: "CSS Modules はビルド時処理でゼロランタイムコスト。styled-components はランタイムコストあり。",
      },
    },
    {
      question: { en: "Should I use Tailwind or CSS Modules?", np: "Tailwind कि CSS Modules?", jp: "Tailwind と CSS Modules どちらを使う？" },
      answer: {
        en: "Both are excellent choices. Tailwind is faster to write (no file-switching), enforces a consistent design scale, and is the default in most modern starters (Next.js, shadcn/ui). CSS Modules are better when you need full CSS power (complex animations, pseudo-selectors) or when migrating from an existing CSS codebase. Many teams use both: Tailwind for layout and spacing, CSS Modules for complex component-specific styles.",
        np: "Tailwind: छिटो, consistent। CSS Modules: full CSS power। अधिकांश नयाँ projects मा Tailwind popular।",
        jp: "どちらも良い選択。新規は Tailwind が多数派。複雑なアニメーションは CSS Modules が有利。",
      },
    },
    {
      question: { en: "How do I conditionally apply CSS classes?", np: "Conditional CSS classes?", jp: "条件付きクラスの適用方法は？" },
      answer: {
        en: "Three approaches: 1) Template literal: `className={\`btn \${active ? 'btn-active' : ''}\`}`. 2) `clsx` package (recommended): `className={clsx('btn', { 'btn-active': active, 'btn-disabled': disabled })}` — handles undefined/false cleanly. 3) `cn` helper from shadcn/ui (combines `clsx` + `tailwind-merge`): `className={cn('btn', isActive && 'ring-2')}`. Install clsx with `npm install clsx`.",
        np: "Template literal, clsx library, वा shadcn `cn` utility — तीनवटा तरिका।",
        jp: "テンプレートリテラル、clsx ライブラリ、shadcn の `cn` が一般的です。",
      },
    },
    {
      question: { en: "Can I use multiple styling approaches in the same project?", np: "एउटै project मा multiple approaches?", jp: "複数スタイリング方法の混在は OK？" },
      answer: {
        en: "Yes, and it's common in production apps. A typical setup: Tailwind for layout, spacing, and responsive styles + CSS Modules for complex component animations + inline styles for one or two dynamic computed values + shadcn/ui for interactive elements (modals, comboboxes). The rule of thumb: be consistent within a single component — don't mix Tailwind and CSS Modules for the same element.",
        np: "हो — Tailwind layout, CSS Modules animations, inline dynamic values, shadcn/ui interactive elements। एउटा component भित्र consistent रहनुस्।",
        jp: "はい。Tailwind + CSS Modules + インライン + UI ライブラリの混在は実務では一般的です。",
      },
    },
  ],
};
