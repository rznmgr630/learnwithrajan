import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_3_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Next.js supports multiple styling approaches out of the box: **Global CSS**, **CSS Modules**, **Tailwind CSS**, and third-party libraries like **DaisyUI**. You can mix approaches — use Tailwind for layout utilities, CSS Modules for scoped component styles, and DaisyUI for pre-built semantic components. Picking the right tool for each situation is the key skill.",
      np: "Next.js मा Global CSS, CSS Modules, Tailwind, DaisyUI सबै सँगै चल्छन्। काम अनुसार सही tool छान्नु महत्त्वपूर्ण।",
      jp: "Next.js は Global CSS・CSS Modules・Tailwind・DaisyUI など複数のスタイリング手法をサポートします。用途に応じて組み合わせることが重要です。",
    },
    {
      en: "The Mosh course's styling section teaches you to apply each approach, understand the scoping rules, and choose confidently. Pay attention to how each method handles **class name collisions** — that is the core problem every CSS architecture solves.",
      np: "Mosh course मा प्रत्येक approach प्रयोग, scoping rules, र class collision कसरी handle हुन्छ भन्ने सिकाइन्छ।",
      jp: "Mosh コースではそれぞれの手法の適用・スコープルール・クラス名衝突の回避方法を学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Global Styles & CSS Modules",
        np: "Global Styles र CSS Modules",
        jp: "グローバルスタイルと CSS Modules",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Global styles** live in `app/globals.css` and are imported once in `app/layout.tsx`. They apply to every element in your application — ideal for CSS resets, custom properties (variables), base typography, and body/html defaults. Because they are global, class name collisions are your responsibility.",
            np: "`app/globals.css` मा global styles — `layout.tsx` मा एकपटक import। CSS reset, variables, base typography को लागि। Collision आफ्नै जिम्मेवारी।",
            jp: "`app/globals.css` をグローバルスタイルに使い、`layout.tsx` で一度 import します。リセット・変数・ベースタイポグラフィに向いています。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/globals.css — typical global stylesheet",
            np: "app/globals.css — सामान्य global CSS",
            jp: "app/globals.css — グローバルスタイルの例",
          },
          code: `/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS variables (design tokens) */
:root {
  --color-brand: #0070f3;
  --color-brand-dark: #005bb5;
  --font-sans: "Geist", sans-serif;
  --radius: 0.5rem;
}

/* Base reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  line-height: 1.6;
  color: #111;
  background-color: #fff;
}

/* Global utility — applies everywhere */
.container {
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: 1.5rem;
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "**CSS Modules** solve the global collision problem by auto-generating unique class names at build time. Name your file `ComponentName.module.css`, import it as a JavaScript object, and reference class names via `styles.className`. The generated HTML class might look like `Button_primary__xK3q2` — completely unique per file.",
            np: "CSS Modules ले build time मा unique class names बनाउँछ। `*.module.css` — import object, `styles.className`। Collision impossible।",
            jp: "CSS Modules はビルド時に一意なクラス名を生成し衝突を防ぎます。`*.module.css` を import してオブジェクト経由で参照します。",
          },
        },
        {
          type: "code",
          title: {
            en: "ProductCard.module.css + ProductCard.tsx",
            np: "CSS Module + Component example",
            jp: "CSS Module と Component の組み合わせ例",
          },
          code: `/* app/components/ProductCard.module.css */
.card {
  border: 1px solid #e2e8f0;
  border-radius: var(--radius, 0.5rem);
  padding: 1.5rem;
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0070f3;
  margin-top: 0.5rem;
}

/* app/components/ProductCard.tsx */
import styles from "./ProductCard.module.css";

interface Props {
  title: string;
  price: number;
}

export default function ProductCard({ title, price }: Props) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.price}>\${price.toFixed(2)}</p>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Tailwind CSS in Next.js",
        np: "Tailwind CSS",
        jp: "Next.js で Tailwind CSS を使う",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Tailwind CSS** is a utility-first framework: instead of writing `.card { padding: 1.5rem; }` in a CSS file, you compose small single-purpose classes directly in JSX: `className=\"p-6 rounded-lg border\"`. `create-next-app` includes Tailwind when you choose it in the wizard — no manual configuration needed.",
            np: "Tailwind utility-first — CSS file लेख्नु पर्दैन, JSX मा class compose। `create-next-app` मा include।",
            jp: "Tailwind は utility-first で、CSS ファイルを書かず JSX 内でクラスを組み合わせます。`create-next-app` でセットアップ済み。",
          },
        },
        {
          type: "code",
          title: {
            en: "tailwind.config.ts — standard Next.js config",
            np: "tailwind.config.ts — standard config",
            jp: "tailwind.config.ts の設定例",
          },
          code: `// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  // Tell Tailwind where to scan for class names (removes unused classes in prod)
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Add custom colors, fonts, spacing, etc.
      colors: {
        brand: "#0070f3",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
      },
    },
  },
  // Dark mode via a "dark" class on <html> (controlled by your app)
  darkMode: "class",
  plugins: [],
};

export default config;`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Dark mode** with Tailwind's `class` strategy: add the `dark` class to the `<html>` element to activate dark variants. Use `localStorage` + a Client Component to persist the preference. Every dark style is opt-in: `className=\"bg-white dark:bg-gray-900\"`.",
            np: "Dark mode — `<html>` मा `dark` class थप। `localStorage` + Client Component। `dark:` prefix।",
            jp: "ダークモードは `<html>` に `dark` クラスを追加して有効化。`localStorage` で保存し `dark:` プレフィックスでスタイルを定義します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Tailwind in practice — responsive card component",
            np: "Tailwind — responsive card",
            jp: "Tailwind 実用例：レスポンシブカード",
          },
          code: `// app/components/FeatureCard.tsx
interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: Props) {
  return (
    <div
      className="
        flex flex-col gap-3
        rounded-xl border border-gray-200 bg-white
        p-6 shadow-sm
        transition-shadow hover:shadow-md
        dark:border-gray-700 dark:bg-gray-800
        sm:flex-row sm:gap-4
      "
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "DaisyUI — semantic component classes",
        np: "DaisyUI component classes",
        jp: "DaisyUI：セマンティックなコンポーネントクラス",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**DaisyUI** is a Tailwind plugin that adds semantic component class names like `btn`, `card`, `navbar`, `hero`, and `badge`. Instead of writing 10 Tailwind utility classes for a button, you write `className=\"btn btn-primary\"` and DaisyUI's CSS handles the rest. It ships 30+ themes including `light`, `dark`, `cupcake`, and `forest`.",
            np: "DaisyUI Tailwind plugin — `btn`, `card`, `hero`, `navbar` जस्ता semantic class। 30+ themes।",
            jp: "DaisyUI は Tailwind プラグインで `btn`・`card`・`hero` などのセマンティッククラスを提供。30+ テーマ付き。",
          },
        },
        {
          type: "code",
          title: {
            en: "Installing DaisyUI",
            np: "DaisyUI install",
            jp: "DaisyUI のインストール",
          },
          code: `# Install the package
npm install daisyui

# Then add it to tailwind.config.ts:
# plugins: [require("daisyui")]`,
        },
        {
          type: "code",
          title: {
            en: "tailwind.config.ts with DaisyUI configured",
            np: "DaisyUI सहित tailwind.config.ts",
            jp: "DaisyUI を追加した tailwind.config.ts",
          },
          code: `// tailwind.config.ts
import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {} },
  darkMode: "class",
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "cupcake", "forest"], // include only what you need
    darkTheme: "dark",   // theme activated when "dark" class is on <html>
    base: true,          // apply DaisyUI base styles
    styled: true,        // include component styles
    utils: true,         // include utility classes
  },
};

export default config;`,
        },
        {
          type: "code",
          title: {
            en: "DaisyUI components in a Next.js page",
            np: "Next.js page मा DaisyUI",
            jp: "Next.js ページで DaisyUI を使う",
          },
          code: `// app/page.tsx — demonstrating DaisyUI components
export default function HomePage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <nav className="navbar bg-base-200 shadow-sm">
        <div className="navbar-brand text-xl font-bold">MyApp</div>
        <div className="navbar-end gap-2">
          <button className="btn btn-ghost btn-sm">Login</button>
          <button className="btn btn-primary btn-sm">Sign up</button>
        </div>
      </nav>

      {/* Hero section */}
      <section className="hero py-20">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="mt-4 text-base-content/70">
              Build beautiful UIs faster with DaisyUI components.
            </p>
            <button className="btn btn-primary mt-6">Get Started</button>
          </div>
        </div>
      </section>

      {/* Card */}
      <div className="mx-auto max-w-sm p-4">
        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Feature Card</h2>
            <p>DaisyUI handles all the default styles.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Learn more</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Choosing your approach — and the cn() helper",
        np: "Approach छान्नुहोस् र cn() helper",
        jp: "手法の選び方と cn() ヘルパー",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Styling approach comparison",
            np: "Styling approach तुलना",
            jp: "スタイリング手法の比較",
          },
          headers: [
            { en: "Approach", np: "Approach", jp: "手法" },
            { en: "Scope", np: "Scope", jp: "スコープ" },
            { en: "Learning curve", np: "सिक्न समय", jp: "学習コスト" },
            { en: "Best for", np: "उपयुक्त", jp: "向いている用途" },
            { en: "Bundle size", np: "Bundle size", jp: "バンドルサイズ" },
          ],
          rows: [
            [
              { en: "Global CSS", np: "Global CSS", jp: "グローバル CSS" },
              { en: "Global", np: "Global", jp: "グローバル" },
              { en: "Low", np: "कम", jp: "低" },
              { en: "Resets, design tokens, base styles", np: "Reset, tokens, base", jp: "リセット・トークン・ベース" },
              { en: "Depends on content", np: "content मा निर्भर", jp: "コンテンツ依存" },
            ],
            [
              { en: "CSS Modules", np: "CSS Modules", jp: "CSS Modules" },
              { en: "Component-scoped", np: "Component scope", jp: "コンポーネント単位" },
              { en: "Low", np: "कम", jp: "低" },
              { en: "Component-specific complex styles", np: "Complex component styles", jp: "複雑なコンポーネントスタイル" },
              { en: "Small (tree-shaken)", np: "सानो", jp: "小（自動削除あり）" },
            ],
            [
              { en: "Tailwind CSS", np: "Tailwind CSS", jp: "Tailwind CSS" },
              { en: "Utility-first (atomic)", np: "Utility-first", jp: "ユーティリティファースト" },
              { en: "Medium", np: "मध्यम", jp: "中" },
              { en: "Rapid UI prototyping, responsive design", np: "Rapid UI, responsive", jp: "素早い UI・レスポンシブ" },
              { en: "Very small (purge unused)", np: "धेरै सानो (purge)", jp: "非常に小（未使用を除去）" },
            ],
            [
              { en: "DaisyUI", np: "DaisyUI", jp: "DaisyUI" },
              { en: "Semantic components", np: "Semantic components", jp: "セマンティックコンポーネント" },
              { en: "Low", np: "कम", jp: "低" },
              { en: "Rapid prototyping, themed apps", np: "Rapid prototype, themed app", jp: "プロトタイプ・テーマ付きアプリ" },
              { en: "Small (built on Tailwind)", np: "सानो (Tailwind base)", jp: "小（Tailwind ベース）" },
            ],
            [
              { en: "CSS-in-JS (styled-components)", np: "CSS-in-JS", jp: "CSS-in-JS" },
              { en: "Component-scoped", np: "Component scope", jp: "コンポーネント単位" },
              { en: "Medium", np: "मध्यम", jp: "中" },
              { en: "Dynamic runtime theming", np: "Dynamic theming", jp: "実行時のダイナミックテーマ" },
              { en: "Larger (runtime overhead)", np: "ठूलो (runtime)", jp: "やや大（ランタイムオーバーヘッド）" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "**CSS-in-JS warning**: Libraries like `styled-components` and `emotion` require client-side JavaScript to inject styles. They conflict with Server Components and require extra setup in Next.js App Router. Prefer Tailwind, CSS Modules, or DaisyUI in new Next.js projects unless you have a specific reason.",
            np: "CSS-in-JS (styled-components, emotion) Server Components सँग conflict गर्छ। नयाँ App Router project मा Tailwind/CSS Modules नै राम्रो।",
            jp: "styled-components や emotion は Server Component と競合します。新規の App Router プロジェクトでは Tailwind か CSS Modules が推奨です。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "The **`cn()` helper** is a community pattern that combines `clsx` (for conditional class merging) with `tailwind-merge` (for resolving Tailwind class conflicts). Without it, `className={\"p-4 \" + (large ? \"p-8\" : \"\")}` would produce both `p-4` and `p-8` — Tailwind Merge keeps only the last relevant class.",
            np: "`cn()` helper — `clsx` + `tailwind-merge`। Conditional classes + Tailwind conflict resolve। `p-4` र `p-8` दुवै भए एउटा मात्र राख्छ।",
            jp: "`cn()` は `clsx` と `tailwind-merge` を組み合わせたヘルパー。条件付きクラスと Tailwind の競合を同時に解決します。",
          },
        },
        {
          type: "code",
          title: {
            en: "lib/utils.ts — cn() helper setup and usage",
            np: "lib/utils.ts — cn() setup र usage",
            jp: "lib/utils.ts：cn() のセットアップと使い方",
          },
          code: `# First, install the two packages:
# npm install clsx tailwind-merge

// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names conditionally and resolve Tailwind conflicts.
 * Usage: cn("p-4", isLarge && "p-8")  → "p-8"  (p-4 is overridden)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ----- Usage in a component -----

// app/components/Button.tsx
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles always applied
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50",
        // Variant styles
        {
          "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600":
            variant === "primary",
          "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500":
            variant === "secondary",
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600":
            variant === "danger",
        },
        // Size styles
        { "h-8 px-3 text-sm": size === "sm", "h-10 px-4": size === "md", "h-12 px-6 text-lg": size === "lg" },
        // Allow callers to override via className
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Can I use Tailwind AND CSS Modules in the same project?",
        np: "Tailwind र CSS Modules सँगै?",
        jp: "Tailwind と CSS Modules を同じプロジェクトで使える？",
      },
      answer: {
        en: "Absolutely. They operate at different levels — Tailwind generates utility classes globally, while CSS Modules generate scoped classes per file. A common pattern: use Tailwind for spacing, typography, and responsive layout, and use CSS Modules for complex component-specific styles that would be verbose in Tailwind (custom animations, pseudo-selectors, generated content). There is no technical conflict.",
        np: "हो। Tailwind utility classes; CSS Modules scoped classes — कुनै conflict छैन। Spacing/layout = Tailwind; complex animation = CSS Modules।",
        jp: "全く問題ありません。Tailwind はグローバルなユーティリティ、CSS Modules はファイル単位のスコープで動作し、競合しません。",
      },
    },
    {
      question: {
        en: "How do I add custom fonts with Next.js font optimisation?",
        np: "Next.js font optimisation मा custom font?",
        jp: "Next.js のフォント最適化でカスタムフォントを追加するには？",
      },
      answer: {
        en: "Use the `next/font` module. For Google Fonts: `import { Inter } from 'next/font/google'`, call `Inter({ subsets: ['latin'] })` to get a font object, and apply `font.className` to `<body>` in the root layout. For local fonts: `import localFont from 'next/font/local'`. Next.js automatically self-hosts the font files (no Google request from the browser), inlines the `@font-face` declaration, and sets `font-display: swap` — zero layout shift and no third-party tracker.",
        np: "`next/font/google` → `Inter({ subsets: ['latin'] })` → `font.className` on `<body>`। Self-hosted, inlined — tracker नहुने, layout shift नहुने।",
        jp: "`next/font/google` から import し、`Inter({ subsets: ['latin'] })` の `.className` を `<body>` に適用します。自己ホスト・インライン化・`font-display: swap` で CLS ゼロ。",
      },
    },
    {
      question: {
        en: "Does DaisyUI work with dark mode?",
        np: "DaisyUI र dark mode?",
        jp: "DaisyUI はダークモードに対応している？",
      },
      answer: {
        en: "Yes — it is one of DaisyUI's strengths. Every DaisyUI component uses **semantic color tokens** like `bg-base-100`, `text-primary`, `bg-base-200`. These tokens automatically remap when you switch the active theme. Set `data-theme=\"dark\"` on `<html>` (or use Tailwind's `class` strategy with `darkTheme: 'dark'` in the DaisyUI config) and all components flip to their dark appearance with zero extra CSS.",
        np: "हो। `bg-base-100` जस्ता semantic tokens — theme बदल्दा automatically dark। `data-theme=\"dark\"` on `<html>`। extra CSS चाहिँदैन।",
        jp: "DaisyUI の強みです。`bg-base-100` などのセマンティックトークンがテーマ切替で自動で対応。`<html>` に `data-theme=\"dark\"` を設定するだけでダーク表示に切り替わります。",
      },
    },
    {
      question: {
        en: "How do I conditionally apply Tailwind classes?",
        np: "Tailwind class conditionally कसरी?",
        jp: "Tailwind クラスを条件付きで適用するには？",
      },
      answer: {
        en: "Three common patterns: (1) **Template literal**: `className={\`btn \${isActive ? 'btn-primary' : 'btn-ghost'}\`}` — simple but messy at scale. (2) **clsx** (standalone): `className={clsx('btn', { 'btn-primary': isActive })}` — cleaner for many conditions. (3) **cn() helper** (clsx + tailwind-merge): the recommended pattern when using Tailwind — it also resolves duplicate utility conflicts like `p-4 p-8` → `p-8`.",
        np: "(1) template literal, (2) `clsx`, (3) `cn()` helper — `cn()` recommended: conflict resolve पनि गर्छ।",
        jp: "①テンプレートリテラル、②`clsx` 単体、③`cn()` ヘルパー（clsx + tailwind-merge）の 3 パターン。Tailwind では `cn()` が推奨です。",
      },
    },
    {
      question: {
        en: "What is `cn()` and why use it instead of just clsx?",
        np: "`cn()` के हो र clsx भन्दा किन?",
        jp: "`cn()` とは何か、なぜ clsx だけでは不十分？",
      },
      answer: {
        en: "`cn()` wraps `clsx` (conditional class merging) with `tailwind-merge` (Tailwind-aware conflict resolution). The problem `clsx` alone cannot solve: `clsx('p-4', 'p-8')` produces `'p-4 p-8'` — both classes exist in the DOM and the winner depends on CSS specificity/order, not your intent. `tailwind-merge` knows Tailwind's class groups (all `p-*` utilities conflict) and keeps only the last one: `'p-8'`. This makes it safe to compose components where callers override specific utilities via `className` props.",
        np: "`clsx` conditional merging। `tailwind-merge` Tailwind conflict resolve (`p-4 p-8` → `p-8`)। Caller ले `className` override गर्दा safe।",
        jp: "`clsx` は条件付き結合、`tailwind-merge` は `p-4 p-8` → `p-8` のように Tailwind のクラスグループを認識して競合解決します。`className` props で上書きするコンポーネント設計に必須です。",
      },
    },
  ],
  bullets: [
    {
      en: "Create a `Button` component that accepts a `variant` prop and applies different Tailwind classes — use `cn()` so callers can pass additional `className` without conflicts.",
      np: "`variant` prop सहित Button बनाउनुहोस् — `cn()` प्रयोग गरी caller override safe।",
      jp: "`variant` props を受け取る Button コンポーネントを作り、`cn()` で安全に上書きできるようにする。",
    },
    {
      en: "Convert one of your components to use CSS Modules — run `npm run build` and inspect the generated class names in the output HTML.",
      np: "एउटा component CSS Modules मा convert गर्नुहोस् — build HTML मा generated class names हेर्नुहोस्।",
      jp: "CSS Modules でコンポーネントを書き直し、`npm run build` 後の HTML で生成されたクラス名を確認する。",
    },
    {
      en: "Add DaisyUI to your project, set two themes in `tailwind.config.ts`, and build a page that uses `btn`, `card`, and `navbar` — then toggle `data-theme` on `<html>` to verify theme switching.",
      np: "DaisyUI install, दुई theme, `btn`/`card`/`navbar` page — `data-theme` toggle गरी theme check।",
      jp: "DaisyUI をインストールしてテーマを 2 つ設定し、`btn`・`card`・`navbar` を使ったページを作って `data-theme` の切り替えを確認する。",
    },
  ],
};
