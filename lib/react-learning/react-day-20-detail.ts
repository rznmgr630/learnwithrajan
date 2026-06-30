import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_20_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "<b>Accessibility</b> (a11y) means your app works for everyone — people using screen readers, keyboard-only users, people with low vision or motor disabilities. It's not an optional feature; in many countries it's a legal requirement under disability discrimination laws.\n\nThe good news: most accessibility comes free from using the right HTML elements. Analogy: accessible design is like a ramp alongside stairs — it's not just for wheelchair users; it helps everyone with strollers, luggage, or a sprained ankle. Good HTML is like building the ramp into the architecture from the start, not bolting it on afterwards.",
      np: "Accessibility (a11y) = app सबैले प्रयोग गर्न मिल्ने। Semantic HTML, ARIA, focus management र keyboard navigation।",
      jp: "アクセシビリティ(a11y)とは、すべての人がアプリを使えるようにすることです。",
    },
    {
      en: "Today we cover the five pillars of React accessibility:\n\n• <b>Semantic HTML</b> — use the right element for the job; screen readers understand `<button>` but not `<div onClick>`\n• <b>ARIA attributes</b> — bridge the gap when HTML alone can't communicate meaning\n• <b>Focus management</b> — control where keyboard focus goes when modals open/close\n• <b>Keyboard navigation</b> — every interaction must be reachable without a mouse\n• <b>Testing accessibility</b> — automated checks with axe + React Testing Library queries",
      np: "Semantic HTML, ARIA, focus management, keyboard navigation र testing — पाँच pillars।",
      jp: "セマンティックHTML・ARIA・フォーカス管理・キーボードナビゲーション・テストの5つを学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Semantic HTML — the foundation",
        np: "Semantic HTML — आधार",
        jp: "セマンティックHTML — 基礎",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Screen readers understand the meaning of HTML elements — `<button>` announces itself as a button, `<nav>` as navigation, `<h1>` as a heading. Generic `<div>` and `<span>` elements have no meaning.\n\nThe most common accessibility mistake in React: using a `<div>` with an `onClick` instead of a `<button>`. A `<button>` is:\n• Keyboard-focusable by default (Tab to reach it)\n• Activatable with Enter and Space keys\n• Announced as \"button\" by screen readers\n• Disabled with the `disabled` attribute\n\nA `<div onClick>` has none of these without extra work.\n\nThe rule: <b>if it does something, it's a `<button>`; if it goes somewhere, it's an `<a>`</b>.",
            np: "`<button>` keyboard-focusable छ, `<div onClick>` छैन। सही element रोज्नुहोस्।",
            jp: "`<button>` はキーボードフォーカス可能ですが `<div onClick>` はそうではありません。",
          },
        },
        {
          type: "code",
          title: { en: "Semantic elements — bad vs good", np: "Semantic HTML उदाहरण", jp: "セマンティックHTMLの例" },
          code: `// ❌ BAD — div with onClick, no keyboard access, no semantic meaning
function BadToggle({ isOpen, onToggle }) {
  return (
    <div onClick={onToggle} className="toggle-btn">
      {isOpen ? "Close" : "Open"}
    </div>
  );
}

// ✅ GOOD — button element, keyboard accessible, correct semantics
function GoodToggle({ isOpen, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      {isOpen ? "Close" : "Open"}
    </button>
  );
}

// ✅ Correct landmark structure
function PageLayout({ children }) {
  return (
    <>
      <header>
        <nav aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>
      <main id="main-content">
        {children}
      </main>
      <footer>
        <p>© 2025</p>
      </footer>
    </>
  );
}`,
        },
        {
          type: "table",
          caption: {
            en: "Semantic HTML elements — use these instead of divs",
            np: "Semantic elements — div को सट्टा प्रयोग गर्ने",
            jp: "div の代わりに使うセマンティック要素",
          },
          headers: [
            { en: "Element", np: "Element", jp: "要素" },
            { en: "Role", np: "Role", jp: "ロール" },
            { en: "Use when", np: "कहिले", jp: "使う場面" },
          ],
          rows: [
            [
              { en: "`<header>`", np: "`<header>`", jp: "`<header>`" },
              { en: "banner", np: "banner", jp: "バナー" },
              { en: "Site header or section header", np: "Site वा section header", jp: "サイトやセクションのヘッダー" },
            ],
            [
              { en: "`<nav>`", np: "`<nav>`", jp: "`<nav>`" },
              { en: "navigation", np: "navigation", jp: "ナビゲーション" },
              { en: "Primary navigation links", np: "Navigation links", jp: "主要なナビゲーションリンク" },
            ],
            [
              { en: "`<main>`", np: "`<main>`", jp: "`<main>`" },
              { en: "main", np: "main", jp: "メインコンテンツ" },
              { en: "Primary page content (once per page)", np: "मुख्य content (एक पटक मात्र)", jp: "ページの主要コンテンツ（1回のみ）" },
            ],
            [
              { en: "`<article>`", np: "`<article>`", jp: "`<article>`" },
              { en: "article", np: "article", jp: "記事" },
              { en: "Self-contained content (blog post, card)", np: "Independent content", jp: "独立したコンテンツ（ブログ記事等）" },
            ],
            [
              { en: "`<button>`", np: "`<button>`", jp: "`<button>`" },
              { en: "button", np: "button", jp: "ボタン" },
              { en: "Any clickable action (NOT navigation)", np: "Action (navigation होइन)", jp: "クリック可能なアクション" },
            ],
            [
              { en: "`<a href>`", np: "`<a href>`", jp: "`<a href>`" },
              { en: "link", np: "link", jp: "リンク" },
              { en: "Navigation to a URL", np: "URL मा navigate गर्न", jp: "URLへのナビゲーション" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "ARIA — when HTML isn't enough",
        np: "ARIA — HTML पर्याप्त नभएको बेला",
        jp: "ARIA — HTML だけでは不十分な場合",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "ARIA (Accessible Rich Internet Applications) attributes add semantic information that HTML alone can't provide.\n\nAnalogy: ARIA is like adding subtitles to a silent film — you use it when the visual story can't be understood from the footage alone.\n\nThe golden rule: <b>no ARIA is better than bad ARIA</b>. Wrong ARIA is worse than no ARIA — it actively misleads screen readers.\n\nCommon ARIA attributes:\n• `aria-label` — names an element that has no visible text (icon buttons)\n• `aria-labelledby` — points to another element's text as the label\n• `aria-describedby` — adds a longer description (hint text, error messages)\n• `aria-expanded` — communicates open/closed state of accordions, dropdowns\n• `aria-live` — announces dynamic content changes (notifications, errors)\n• `aria-hidden=\"true\"` — hides decorative elements from screen readers",
            np: "ARIA attributes screen readers लाई semantic information दिन्छ। Wrong ARIA भन्दा no ARIA better।",
            jp: "ARIA 属性はスクリーンリーダーに意味を伝えます。誤った ARIA は使わないより悪いです。",
          },
        },
        {
          type: "code",
          title: { en: "Common ARIA patterns in React", np: "ARIA patterns", jp: "ARIA パターン" },
          code: `// aria-label for icon-only buttons
function CloseButton({ onClose }) {
  return (
    <button type="button" onClick={onClose} aria-label="Close dialog">
      ✕  {/* Screen reader announces: "Close dialog, button" */}
    </button>
  );
}

// aria-expanded for accordion
function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId(); // React 18+ unique ID

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      <div id={contentId} hidden={!isOpen}>
        {children}
      </div>
    </div>
  );
}

// aria-live for toast notifications
function ToastContainer({ message }) {
  return (
    // polite = waits for user to finish; assertive = interrupts immediately
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}

// aria-describedby for form field hints and errors
function FormField({ id, label, hint, error, ...inputProps }) {
  const hintId = \`\${id}-hint\`;
  const errorId = \`\${id}-error\`;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-describedby={\`\${hint ? hintId : ""} \${error ? errorId : ""}\`.trim()}
        aria-invalid={!!error}
        {...inputProps}
      />
      {hint && <p id={hintId}>{hint}</p>}
      {error && <p id={errorId} role="alert">{error}</p>}
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Focus management — modals and drawers",
        np: "Focus management — modals र drawers",
        jp: "フォーカス管理 — モーダルとドロワー",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When a modal opens, keyboard focus must move inside it — otherwise a keyboard user is stuck interacting with the background. When the modal closes, focus must return to the element that triggered it.\n\nAnalogy: when a modal opens, focus should jump inside it — like a spotlight following the main actor onto the stage. When they exit, the spotlight returns to where it was.\n\nThe three requirements for accessible modals:\n1. When opened — move focus to the first focusable element inside\n2. While open — trap focus (Tab cycles only within the modal)\n3. When closed — return focus to the trigger element\n\n`react-focus-lock` handles all three with a single wrapper component.",
            np: "Modal खुल्दा focus inside जाने, बन्द हुँदा trigger मा फर्कने। `react-focus-lock` ले automatically handle गर्छ।",
            jp: "モーダルを開いたらフォーカスを内部へ、閉じたらトリガー要素へ戻します。",
          },
        },
        {
          type: "code",
          title: { en: "Accessible modal with focus trap", np: "Accessible modal", jp: "アクセシブルなモーダル" },
          code: `import { useRef, useEffect } from "react";
import FocusLock from "react-focus-lock"; // npm install react-focus-lock

function Modal({ isOpen, onClose, title, children }) {
  const triggerRef = useRef(null); // store the element that opened the modal

  // Manual approach (without react-focus-lock)
  const closeButtonRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      // Move focus inside when modal opens
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // react-focus-lock traps Tab inside; react-remove-scroll stops background scroll
    <FocusLock returnFocus> {/* returnFocus automatically restores prior focus */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        {/* Dialog content */}
        <div className="relative rounded-2xl bg-white p-6 shadow-2xl">
          <h2 id="modal-title">{title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute right-4 top-4"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    </FocusLock>
  );
}

// Keyboard: Escape to close
useEffect(() => {
  const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
  if (isOpen) document.addEventListener("keydown", handleEsc);
  return () => document.removeEventListener("keydown", handleEsc);
}, [isOpen, onClose]);`,
        },
      ],
    },
    {
      title: {
        en: "Keyboard navigation",
        np: "Keyboard navigation",
        jp: "キーボードナビゲーション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every interaction in your app must be reachable and operable with only a keyboard. The Tab key moves focus between interactive elements. Enter and Space activate buttons/links.\n\nFor custom widgets (tabs, listboxes, tree views), the <b>roving tabindex</b> pattern is the standard:\n• Only ONE item in the group is in the tab sequence at a time (`tabIndex={0}`)\n• All others are removed from tab sequence but programmatically focusable (`tabIndex={-1}`)\n• Arrow keys move the active item and shift the `tabIndex={0}` to the new item\n• This prevents Tab from having to skip through every item in a large list\n\n`tabIndex` values to know:\n• `tabIndex={0}` — natural tab order (same as a native interactive element)\n• `tabIndex={-1}` — not in tab order, but focusable via `element.focus()`\n• `tabIndex={1+}` — avoid; creates unpredictable tab order",
            np: "Roving tabindex pattern: एक item मात्र tab sequence मा। Arrow keys ले active item move गर्छ।",
            jp: "ロービングtabindexパターン：グループ内の1要素だけ tab 順序に含め、矢印キーで移動します。",
          },
        },
        {
          type: "code",
          title: { en: "Roving tabindex — accessible tab list", np: "Roving tabindex pattern", jp: "ロービングtabindex" },
          code: `import { useState, useRef } from "react";

function TabList({ tabs }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);

  function handleKeyDown(e, index) {
    let newIndex = index;

    if (e.key === "ArrowRight") {
      newIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      newIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      newIndex = 0;
    } else if (e.key === "End") {
      newIndex = tabs.length - 1;
    } else {
      return; // let other keys propagate normally
    }

    e.preventDefault();
    setActiveIndex(newIndex);
    tabRefs.current[newIndex]?.focus(); // move focus to new tab
  }

  return (
    <div>
      <div role="tablist" aria-label="Content tabs">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[index] = el)}
            role="tab"
            id={\`tab-\${tab.id}\`}
            aria-selected={index === activeIndex}
            aria-controls={\`panel-\${tab.id}\`}
            tabIndex={index === activeIndex ? 0 : -1} // roving tabindex
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={\`panel-\${tab.id}\`}
          aria-labelledby={\`tab-\${tab.id}\`}
          hidden={index !== activeIndex}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Testing accessibility",
        np: "Accessibility testing",
        jp: "アクセシビリティのテスト",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Automated tools catch ~30% of accessibility issues — the rest require manual testing (keyboard navigation, screen reader). Use both.\n\nTools to use:\n• <b>axe-core</b> — integrates with React DevTools and RTL; catches missing labels, wrong roles, color contrast\n• <b>React Testing Library</b> — its query priorities enforce accessible markup (prefer `getByRole` over `getByTestId`)\n• <b>eslint-plugin-jsx-a11y</b> — catches accessibility issues at write time\n• <b>NVDA</b> (Windows, free) or <b>VoiceOver</b> (Mac, built-in) — real screen reader testing",
            np: "axe-core, RTL queries, eslint-plugin-jsx-a11y र real screen reader test गर्नुहोस्।",
            jp: "axe-core・RTL・eslint-plugin-jsx-a11y で自動チェック、実際のスクリーンリーダーでも確認。",
          },
        },
        {
          type: "code",
          title: { en: "Accessibility testing with RTL and axe", np: "RTL + axe testing", jp: "RTL と axe によるテスト" },
          code: `// 1. Install: npm install -D @axe-core/react jest-axe
// For dev-only axe overlay: add to main.jsx
if (import.meta.env.DEV) {
  import("@axe-core/react").then(({ default: axe }) => {
    axe(React, ReactDOM, 1000); // logs violations to console every second
  });
}

// 2. jest-axe for automated test assertions
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

test("Button component has no accessibility violations", async () => {
  const { container } = render(
    <button type="button" onClick={() => {}}>Submit</button>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// 3. RTL accessible queries — these ENFORCE good accessibility
// Preferred order (most to least semantic):
screen.getByRole("button", { name: /submit/i });      // best
screen.getByLabelText("Email address");               // for inputs
screen.getByPlaceholderText("Enter email");           // ok
screen.getByText("Submit");                           // ok for non-interactive
screen.getByTestId("submit-btn");                     // last resort

// If getByRole fails, your component likely has an accessibility problem
// (missing aria-label, wrong role, no accessible name)

// 4. Check ARIA state in tests
test("Accordion is keyboard accessible", async () => {
  const { getByRole } = render(<Accordion title="FAQ" content="Answer" />);
  const button = getByRole("button", { name: "FAQ" });

  expect(button).toHaveAttribute("aria-expanded", "false");
  await userEvent.click(button);
  expect(button).toHaveAttribute("aria-expanded", "true");
});`,
        },
        {
          type: "table",
          caption: {
            en: "WCAG 2.1 conformance levels — what to target",
            np: "WCAG 2.1 levels",
            jp: "WCAG 2.1 適合レベル",
          },
          headers: [
            { en: "Level", np: "Level", jp: "レベル" },
            { en: "Requirement", np: "आवश्यकता", jp: "要件" },
            { en: "Example criteria", np: "उदाहरण", jp: "基準例" },
          ],
          rows: [
            [
              { en: "A — Must", np: "A — अनिवार्य", jp: "A — 必須" },
              { en: "Minimum; legal floor in most jurisdictions", np: "Minimum legal requirement", jp: "最低限の法的要件" },
              { en: "All images have alt text; form inputs have labels", np: "Image alt, form labels", jp: "画像にalt・フォームにラベル" },
            ],
            [
              { en: "AA — Should", np: "AA — गर्नुपर्छ", jp: "AA — 推奨" },
              { en: "Standard target for most apps; required by WCAG compliance", np: "Standard target", jp: "標準的な目標レベル" },
              { en: "4.5:1 color contrast; keyboard accessible; focus visible", np: "Color contrast, keyboard access", jp: "コントラスト比・キーボード操作" },
            ],
            [
              { en: "AAA — Nice", np: "AAA — राम्रो", jp: "AAA — 理想" },
              { en: "Enhanced; not required for full conformance", np: "Enhanced, not required", jp: "強化レベル（必須ではない）" },
              { en: "7:1 contrast; sign language videos; no time limits", np: "7:1 contrast, no time limits", jp: "7:1コントラスト・時間制限なし" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between aria-label and aria-labelledby?",
        np: "aria-label र aria-labelledby मा के फरक?",
        jp: "aria-label と aria-labelledby の違いは？",
      },
      answer: {
        en: "`aria-label` provides the accessible name as a string directly: `aria-label=\"Close menu\"`. `aria-labelledby` points to another element's text: `aria-labelledby=\"modal-title-id\"` — the accessible name is whatever text that element contains. Use `aria-labelledby` when a visible label element already exists (avoids duplication and stays in sync). Use `aria-label` for icon-only elements with no visible label.",
        np: "`aria-label` = direct string। `aria-labelledby` = अर्को element को text point। Visible label छ भने `aria-labelledby` use गर्नुहोस्।",
        jp: "`aria-label` は直接文字列を指定。`aria-labelledby` は別要素のテキストを参照します。",
      },
    },
    {
      question: {
        en: "What are the most common accessibility mistakes in React?",
        np: "React मा सबभन्दा common accessibility mistakes?",
        jp: "React で最も多いアクセシビリティの間違いは？",
      },
      answer: {
        en: "The top 5:\n• `<div onClick>` instead of `<button>` — not keyboard accessible\n• Missing `alt` on `<img>` — screen readers read the file name\n• Form inputs without `<label>` — users can't tell what to type\n• Missing focus styles — `outline: none` without a replacement loses keyboard users\n• `aria-hidden=\"true\"` on elements that contain interactive content — hides them from assistive tech but they're still clickable",
        np: "div onClick, img without alt, input without label, focus style हटाउनु — top 5 mistakes।",
        jp: "div onClick、alt なし img、label なし input、フォーカススタイル削除が主な間違いです。",
      },
    },
    {
      question: {
        en: "Do I need to test with a real screen reader?",
        np: "Real screen reader सँग test गर्नु पर्छ?",
        jp: "実際のスクリーンリーダーでテストする必要がありますか？",
      },
      answer: {
        en: "Yes, eventually. Automated tools catch structural issues but can't tell you if the experience makes sense. Spend 30 minutes with VoiceOver (Mac: Cmd+F5) or NVDA (Windows, free) navigating your app with only the keyboard and no mouse. You'll find issues automated tools miss: confusing announcement order, verbose labels, navigation that works visually but is disorienting by ear. Aim for a weekly screen reader check on critical user flows.",
        np: "हो। Automated tools ~30% issue catch गर्छ। VoiceOver वा NVDA सँग manual test पनि गर्नुहोस्।",
        jp: "はい。自動ツールは~30%しか検出できません。VoiceOver や NVDA でも確認しましょう。",
      },
    },
    {
      question: {
        en: "What is the color contrast requirement?",
        np: "Color contrast requirement के हो?",
        jp: "カラーコントラストの要件は？",
      },
      answer: {
        en: "WCAG AA requires: 4.5:1 contrast ratio for normal text, 3:1 for large text (18pt+ or 14pt+ bold). Use a tool to check: the axe browser extension highlights contrast failures. Common mistake: light gray text on white backgrounds. Rule of thumb: if you squint and the text is hard to read, it probably fails contrast. Tailwind's default text colors are designed to meet AA requirements.",
        np: "WCAG AA: normal text 4.5:1, large text 3:1 contrast ratio। axe extension ले check गर्न सकिन्छ।",
        jp: "WCAG AA：通常テキスト 4.5:1、大きいテキスト 3:1 のコントラスト比が必要です。",
      },
    },
    {
      question: {
        en: "Does Tailwind CSS support accessibility out of the box?",
        np: "Tailwind CSS ले accessibility automatically support गर्छ?",
        jp: "Tailwind CSS はアクセシビリティをすぐにサポートしていますか？",
      },
      answer: {
        en: "Partially. Tailwind provides utilities that help: `sr-only` (visually hides but keeps in accessibility tree), `not-sr-only` (reverses it), `focus:ring` for visible focus styles, and default text colors that meet contrast ratios. But Tailwind can't force you to use semantic elements, add ARIA attributes, or manage focus. It's a tool; accessibility still requires deliberate choices. One gotcha: if you use `outline-none` to remove focus rings, always add a `focus:ring` alternative.",
        np: "`sr-only`, `focus:ring` utilities helpful छ। तर semantic HTML र ARIA आफैं गर्नु पर्छ।",
        jp: "`sr-only`・`focus:ring` など便利なユーティリティがありますが、セマンティックHTMLやARIAは自分で対応が必要です。",
      },
    },
  ],
};
