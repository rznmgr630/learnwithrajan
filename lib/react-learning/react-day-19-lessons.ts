import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_19_LESSONS: LessonDay = {
  day: 19,
  title: "Accessibility and Internationalization",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "day1",
      title: "Accessibility Starts with Semantic HTML",
      durationMinutes: 12,
      explanation: "Accessibility is a correctness requirement. Semantic HTML gives browsers and assistive technologies useful meaning. A button already has keyboard behavior and button semantics; a div with onClick does not. Start with the correct native element before reaching for ARIA.",
      diagram: "Prefer <button>Save</button>\nover <div onClick={save}>Save</div>\n\nNative semantics → keyboard + browser behavior → assistive technology",
      codeExample: {
        title: "Semantic controls",
        code: "function DeleteButton({ onDelete }: { onDelete: () => void }) {\n  return <button type=\"button\" onClick={onDelete}>Delete</button>;\n}"
      },
      keyTakeaways: [
        "Use semantic HTML first.",
        "Native controls provide built-in behavior.",
        "ARIA should fill gaps rather than recreate native controls."
      ],
      commonMistakes: [
        "Clickable divs without keyboard behavior.",
        "Adding redundant ARIA roles.",
        "Using placeholder text as the only label."
      ],
      quiz: [
        {
          question: "Which is normally the correct clickable control for an action?",
          options: [
            "button",
            "div",
            "span",
            "p"
          ],
          correctIndex: 0,
          explanation: "A button has built-in keyboard and accessibility semantics."
        }
      ]
    },
    {
      id: "day2",
      title: "Keyboard Navigation and Focus Management",
      durationMinutes: 12,
      explanation: "Keyboard users rely on Tab, Shift+Tab, Enter, Space, and Escape. Applications need logical focus order and visible focus. Dialogs need a focus strategy: move focus into the dialog, keep it appropriately contained while open, and return focus to the trigger when it closes.",
      diagram: "Open modal → focus modal → contain focus → close → return focus to trigger",
      codeExample: {
        title: "Focus return",
        code: "const triggerRef = useRef<HTMLButtonElement>(null);\n\nfunction closeDialog() {\n  setOpen(false);\n  requestAnimationFrame(() => triggerRef.current?.focus());\n}"
      },
      keyTakeaways: [
        "Keyboard interaction must be intentional.",
        "Dialogs need focus management.",
        "Returning focus preserves keyboard context."
      ],
      commonMistakes: [
        "Removing focus outlines without replacement.",
        "Letting focus disappear after a modal closes.",
        "Building custom keyboard behavior for controls that already have native behavior."
      ],
      quiz: [
        {
          question: "Where should focus often return after a modal closes?",
          options: [
            "The element that opened it",
            "Footer",
            "Address bar",
            "Random element"
          ],
          correctIndex: 0,
          explanation: "Returning focus preserves context."
        }
      ]
    },
    {
      id: "day3",
      title: "ARIA, Screen Readers, and Testing",
      durationMinutes: 12,
      explanation: "ARIA communicates roles, names, states, and relationships when native HTML is insufficient. Examples include aria-expanded, aria-controls, aria-live, and aria-describedby. Screen readers consume the browser's accessibility tree. Automated tools such as eslint-plugin-jsx-a11y catch common issues, but manual keyboard and screen-reader testing are still important.",
      diagram: "React DOM → accessibility tree → screen reader → user",
      codeExample: {
        title: "Accessible disclosure",
        code: "function DetailsButton({ open }: { open: boolean }) {\n  return (\n    <button aria-expanded={open} aria-controls=\"details\">\n      Details\n    </button>\n  );\n}"
      },
      keyTakeaways: [
        "ARIA communicates UI state and relationships.",
        "Screen readers use the accessibility tree.",
        "Linting catches only some problems."
      ],
      commonMistakes: [
        "Adding ARIA without matching behavior.",
        "Using aria-label when a visible label is appropriate.",
        "Assuming a clean linter means full accessibility."
      ],
      quiz: [
        {
          question: "What does aria-expanded communicate?",
          options: [
            "Expanded/collapsed state",
            "Route loaded state",
            "File validity",
            "Disabled state"
          ],
          correctIndex: 0,
          explanation: "aria-expanded exposes expandable-control state."
        }
      ]
    },
    {
      id: "day4",
      title: "Contrast, Reduced Motion, and Accessible Components",
      durationMinutes: 12,
      explanation: "Text and controls need sufficient contrast, and important information should not be conveyed by color alone. Motion should respect prefers-reduced-motion. Headless accessible component libraries such as Radix UI, React Aria, and Base UI can provide interaction primitives while leaving visual design to the application.",
      diagram: "Accessible UI\n├─ semantics\n├─ keyboard support\n├─ contrast\n├─ screen-reader state\n└─ reduced motion",
      codeExample: {
        title: "Reduced motion CSS",
        code: "@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms;\n    animation-iteration-count: 1;\n    transition-duration: 0.01ms;\n    scroll-behavior: auto;\n  }\n}"
      },
      keyTakeaways: [
        "Do not rely on color alone.",
        "Respect reduced-motion preferences.",
        "Headless libraries can provide accessible interaction primitives."
      ],
      commonMistakes: [
        "Low-contrast text.",
        "Animating everything regardless of user preference.",
        "Assuming a library makes every application detail accessible automatically."
      ],
      quiz: [
        {
          question: "What does prefers-reduced-motion represent?",
          options: [
            "A user's reduced-motion preference",
            "Language",
            "Timezone",
            "Theme"
          ],
          correctIndex: 0,
          explanation: "It lets CSS adapt motion to user preference."
        }
      ]
    },
    {
      id: "day5",
      title: "Internationalization, Formatting, and RTL",
      durationMinutes: 12,
      explanation: "Internationalization (i18n) prepares an application for multiple languages and regional conventions. Libraries such as react-i18next and next-intl help manage translation resources and pluralization. JavaScript Intl APIs format dates, numbers, and currencies. RTL languages require layout support; logical CSS properties such as margin-inline-start avoid hard-coded left/right assumptions.",
      diagram: "Data → locale\n├─ translation\n├─ date/number format\n├─ currency\n└─ direction → LTR / RTL",
      codeExample: {
        title: "Locale-aware formatting",
        code: "const price = new Intl.NumberFormat(\"en-US\", {\n  style: \"currency\",\n  currency: \"USD\",\n}).format(1234.5);\n\nconst date = new Intl.DateTimeFormat(\"en-US\", {\n  dateStyle: \"medium\",\n}).format(new Date());"
      },
      keyTakeaways: [
        "Use locale-aware formatting.",
        "Design translation keys around meaning.",
        "Use logical CSS properties for RTL."
      ],
      commonMistakes: [
        "Concatenating translated fragments that fail in other languages.",
        "Hard-coded currency/date formats.",
        "Assuming RTL is only flipping the page."
      ],
      quiz: [
        {
          question: "What does Intl provide?",
          options: [
            "Locale-aware formatting APIs",
            "Routing",
            "State management",
            "CSS modules"
          ],
          correctIndex: 0,
          explanation: "Intl provides locale-aware dates, numbers, currencies, and more."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "Why start with semantic HTML?",
      options: [
        "Native elements provide useful accessibility behavior",
        "ARIA is always slower",
        "CSS requires it",
        "React requires it"
      ],
      correctIndex: 0,
      explanation: "Semantic elements provide roles and interaction behavior."
    },
    {
      question: "Where should focus often return after closing a modal?",
      options: [
        "Trigger",
        "Footer",
        "Disappear",
        "Address bar"
      ],
      correctIndex: 0,
      explanation: "Returning focus preserves keyboard context."
    },
    {
      question: "What is ARIA for?",
      options: [
        "Semantics, states, and relationships",
        "Replacing HTML",
        "Styling",
        "Fetching"
      ],
      correctIndex: 0,
      explanation: "ARIA fills semantic gaps."
    },
    {
      question: "Does an accessibility linter prove a UI is fully accessible?",
      options: [
        "Yes",
        "No",
        "Only production",
        "Only TypeScript"
      ],
      correctIndex: 1,
      explanation: "Automated tools catch only a subset."
    },
    {
      question: "What should reduced-motion support do?",
      options: [
        "Respect user preference",
        "Disable keyboard",
        "Disable CSS",
        "Change language"
      ],
      correctIndex: 0,
      explanation: "Motion should adapt to user preference."
    },
    {
      question: "What is internationalization?",
      options: [
        "Designing software for multiple languages/locales",
        "One translation",
        "Only RTL",
        "Only currency"
      ],
      correctIndex: 0,
      explanation: "i18n covers language and regional differences."
    },
    {
      question: "What does Intl help with?",
      options: [
        "Locale-aware formatting",
        "Routing",
        "State",
        "Testing"
      ],
      correctIndex: 0,
      explanation: "Intl handles dates, numbers, currencies, and more."
    },
    {
      question: "Why use logical CSS properties?",
      options: [
        "They adapt to writing direction",
        "They make APIs faster",
        "They replace HTML",
        "They prevent renders"
      ],
      correctIndex: 0,
      explanation: "Logical properties express start/end rather than fixed left/right."
    }
  ],
  project: {
    name: "Accessible and Localized Settings",
    goal: "Build an accessible, keyboard-friendly, localized settings interface.",
    brief: "Create a settings page with a custom disclosure, confirmation modal, keyboard support, accessible errors, reduced-motion support, and English/Japanese formatting.",
    steps: [
      "Use native semantic controls.",
      "Build an expandable settings section with accessible state.",
      "Create a modal with focus management and focus return.",
      "Ensure important information is not communicated by color alone.",
      "Add reduced-motion CSS.",
      "Format dates and currency with Intl.",
      "Add English and Japanese translations.",
      "Use logical CSS properties for RTL support."
    ],
    acceptance: [
      "Main flow is keyboard operable.",
      "Modal focus moves into the dialog and returns to its trigger.",
      "Interactive controls have accessible names.",
      "Expanded state is exposed.",
      "Dates and currency are locale-aware.",
      "Reduced-motion users get reduced animation.",
      "Accessibility is checked with keyboard navigation and linting."
    ],
    stretch: [
      "Test with a screen reader.",
      "Add Arabic and verify RTL.",
      "Use React Aria or Radix for the dialog.",
      "Add axe assertions."
    ]
  }
};
