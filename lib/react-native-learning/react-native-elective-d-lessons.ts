import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_ELECTIVE_D_LESSONS = normalizePastedLessonDay({
  "day": 49,
  "label": {
    "en": "Elective D",
    "np": "Elective D",
    "jp": "選択科目 D"
  },
  "title": "React Native Web and Universal Apps",
  "overview": "Learn how to build a genuinely universal application where **React Native, React Native Web, and web-specific technologies work together without forcing every platform into the same UI**.\n\nThe key principle:\n\n> **Universal does not mean identical.**",
  "totalMinutes": 60,
  "difficulty": "Advanced",
  "lessons": [
    {
      "id": "rn-elective-d-1",
      "title": "What is React Native Web?",
      "durationMinutes": 3,
      "explanation": "React Native Web allows React Native components and APIs to target the browser.\n\nConceptually:\n\n```text\nReact Native\n     │\n     ├── iOS\n     ├── Android\n     │\n     └── Web\n           ↓\n     React Native Web\n           ↓\n        Browser\n```\n\nInstead of creating:\n\n```text\nMobile components\n+\nCompletely separate web components\n```\n\nyou can potentially share a significant amount of UI and logic.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-2",
      "title": "React Native primitives on the web",
      "durationMinutes": 3,
      "explanation": "Common React Native components can map to web equivalents.\n\nConceptually:\n\n```text\n<View>        → web element\n<Text>        → text element\n<Pressable>   → interactive web element\n<Image>       → image element\n<ScrollView>  → scrollable container\n```\n\nBut this does **not** mean the behavior is always identical.\n\nWeb has its own platform:\n\n* Browser navigation\n* Keyboard and mouse\n* Hover\n* Focus\n* URLs\n* SEO\n* Browser accessibility APIs\n* Responsive layouts\n* Right-click/context menus\n* Browser history\n\nTherefore:\n\n```text\nReact Native API\n        ↓\nReact Native Web\n        ↓\nBrowser platform\n```\n\nhas its own constraints.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-3",
      "title": "Universal architecture",
      "durationMinutes": 3,
      "explanation": "A scalable universal application can look like:\n\n```text\napps/\n├── mobile/\n├── web/\n└── admin/\n\npackages/\n├── ui/\n├── design-system/\n├── domain/\n├── api/\n├── state/\n└── config/\n```\n\nThe important question isn't:\n\n> “How much code can I share?”\n\nInstead:\n\n> “Which code has the same meaning on every platform?”",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-4",
      "title": "Share business logic first",
      "durationMinutes": 3,
      "explanation": "Suppose you have checkout logic.\n\n```ts\nexport function calculateTotal(\n  items: CartItem[],\n  taxRate: number,\n) {\n  // shared business rules\n}\n```\n\nThis is a strong candidate for sharing.\n\n```text\n              calculateTotal()\n                     │\n        ┌────────────┼────────────┐\n        ↓            ↓            ↓\n      iOS          Android        Web\n```\n\nThe business rule doesn't care about the platform.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-5",
      "title": "Share hooks carefully",
      "durationMinutes": 3,
      "explanation": "A hook can also be shared:\n\n```ts\nfunction useCart() {\n  // shared cart state and behavior\n}\n```\n\nBut a hook that directly depends on a platform-specific API may not be.\n\nFor example:\n\n```ts\nuseCamera()\n```\n\nmight require completely different implementations.\n\nTherefore:\n\n```text\nShared hook\n     │\n     └── platform adapter\n             ├── native\n             └── web\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-6",
      "title": "Platform-specific files",
      "durationMinutes": 3,
      "explanation": "React Native's platform-specific file conventions can keep differences isolated.\n\nFor example:\n\n```text\nButton.tsx\nButton.native.tsx\nButton.web.tsx\n```\n\nOr:\n\n```text\nstorage.ts\nstorage.native.ts\nstorage.web.ts\n```\n\nThen the consumer can use:\n\n```ts\nimport { storage } from \"./storage\";\n```\n\nwithout knowing which implementation is selected.\n\nConceptually:\n\n```text\n                 import storage\n                       │\n              ┌────────┴────────┐\n              │                 │\n           Native              Web\n              │                 │\n       storage.native.ts   storage.web.ts\n```\n\nThis is much cleaner than spreading platform checks throughout the application.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-7",
      "title": "Avoid platform checks everywhere",
      "durationMinutes": 3,
      "explanation": "This becomes difficult to maintain:\n\n```tsx\nfunction ProductCard() {\n  if (Platform.OS === \"web\") {\n    // ...\n  }\n\n  if (Platform.OS === \"ios\") {\n    // ...\n  }\n\n  if (Platform.OS === \"android\") {\n    // ...\n  }\n\n  // more logic...\n}\n```\n\nImagine this pattern across 200 components.\n\nYou eventually get:\n\n```text\nComponent\n ├── iOS condition\n ├── Android condition\n ├── Web condition\n ├── tablet condition\n ├── TV condition\n └── browser condition\n```\n\nThe component becomes responsible for too many platforms.\n\nPrefer:\n\n```text\nProductCard\n     │\n     ├── shared behavior\n     │\n     └── platform-specific primitive\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-8",
      "title": "Universal design systems",
      "durationMinutes": 3,
      "explanation": "A universal design system should define the **language of the product**, not force identical layouts.\n\nA design system can share:\n\n### Tokens\n\n```ts\nconst spacing = {\n  xs: 4,\n  sm: 8,\n  md: 16,\n  lg: 24,\n  xl: 32,\n};\n```\n\nAnd:\n\n```text\nColors\nTypography\nSpacing\nRadius\nElevation\nMotion\nIcons\n```\n\nThese become the foundation for:\n\n```text\niOS\nAndroid\nWeb\nTablet\nTV\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-9",
      "title": "Responsive design",
      "durationMinutes": 3,
      "explanation": "Mobile and web have fundamentally different layout expectations.\n\nMobile:\n\n```text\n┌──────────────┐\n│              │\n│    Card      │\n│              │\n└──────────────┘\n```\n\nDesktop:\n\n```text\n┌────────┬─────────────────────────┐\n│        │                         │\n│ Side   │       Content           │\n│ bar    │                         │\n│        │                         │\n└────────┴─────────────────────────┘\n```\n\nDon't simply stretch the mobile layout.\n\nInstead, design components around **responsive behavior**.\n\nFor example:\n\n```text\n< 600px\n    ↓\nsingle column\n\n600–1024px\n    ↓\ntwo columns\n\n> 1024px\n    ↓\nsidebar + multi-column content\n```\n\nThe exact breakpoints should come from your design requirements rather than being treated as universal magic numbers.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-10",
      "title": "Platform-conditional styling",
      "durationMinutes": 3,
      "explanation": "Platform differences should be intentional.\n\nFor example:\n\n```text\nMobile\n├── compact spacing\n├── bottom navigation\n└── touch-first interaction\n\nWeb\n├── larger layout\n├── keyboard navigation\n├── hover states\n└── URL-based navigation\n```\n\nThe mistake is trying to create:\n\n```text\none CSS/layout configuration\n```\n\nfor every platform.\n\nInstead:\n\n```text\nShared design tokens\n        │\n        ├── Native composition\n        │\n        └── Web composition\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-11",
      "title": "Accessibility across platforms",
      "durationMinutes": 3,
      "explanation": "Accessibility isn't exactly the same across platforms.\n\nNative:\n\n```text\nVoiceOver\nTalkBack\n```\n\nWeb:\n\n```text\nKeyboard\nScreen readers\nFocus management\nARIA\nBrowser accessibility tree\n```\n\nA universal component therefore needs to preserve the correct accessibility semantics for each platform.\n\nFor example:\n\n```text\nShared intent:\n\"Activate this action\"\n\n        ↓\n\nNative:\naccessible + accessibilityRole\n\nWeb:\nsemantic interactive element + keyboard behavior\n```\n\nThe **meaning** is shared.\n\nThe implementation can differ.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-12",
      "title": "Web navigation is different",
      "durationMinutes": 3,
      "explanation": "Mobile navigation might look like:\n\n```text\nHome\n ↓\nProduct\n ↓\nCheckout\n```\n\nWeb navigation also has:\n\n```text\nURL\nBrowser history\nBack/forward\nRefresh\nDeep links\nBookmarks\nSEO\n```\n\nTherefore, a universal application needs to consider whether a route should be represented by a real URL.\n\nFor example:\n\n```text\n/products/123\n```\n\nis meaningful on the web because a user can:\n\n* Bookmark it\n* Refresh it\n* Share it\n* Open it directly\n\nThis is different from treating navigation purely as an in-memory mobile stack.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-13",
      "title": "React Native Web vs a dedicated web application",
      "durationMinutes": 3,
      "explanation": "React Native Web is not automatically the answer for every web application.\n\nConsider what the web experience needs.\n\nReact Native Web is attractive when:\n\n```text\n✓ Large amount of UI is shared\n✓ Mobile and web have similar product flows\n✓ Shared design system is valuable\n✓ Team wants shared React Native primitives\n```\n\nA dedicated web implementation may make more sense when:\n\n```text\n✓ SEO is critical\n✓ Web-specific interactions dominate\n✓ Highly complex desktop layouts\n✓ Browser-native behavior is central\n✓ Web performance requirements differ substantially\n```\n\nThis is where your existing **Next.js knowledge** becomes important.\n\nA universal product can use:\n\n```text\nReact Native\n      +\nReact Native Web\n      +\nNext.js\n```\n\nrather than trying to make React Native Web responsible for everything.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-14",
      "title": "Universal architecture with Next.js",
      "durationMinutes": 3,
      "explanation": "A practical architecture could be:\n\n```text\n                    Shared packages\n                         │\n          ┌──────────────┼──────────────┐\n          │              │              │\n       Domain           API           Design\n       Logic           Client         Tokens\n          │              │              │\n          └──────────────┼──────────────┘\n                         │\n               ┌─────────┴─────────┐\n               │                   │\n          React Native          Next.js\n               │                   │\n         iOS / Android            Web\n```\n\nThis gives you a crucial distinction:\n\n> **Shared code does not require one application runtime.**",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-15",
      "title": "Sharing components beyond Solito",
      "durationMinutes": 3,
      "explanation": "Solito is useful, but universal architecture shouldn't depend on one library.\n\nYou can build shared packages around:\n\n```text\npackages/\n├── ui/\n├── primitives/\n├── design-tokens/\n├── domain/\n├── api/\n├── validation/\n├── hooks/\n└── config/\n```\n\nThen applications consume those packages.\n\n```text\nMobile ──────┐\n             │\nWeb ─────────┼──→ shared packages\n             │\nAdmin ───────┘\n```\n\nThis gives you more control over the architecture.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-16",
      "title": "Component sharing strategy",
      "durationMinutes": 3,
      "explanation": "Use three levels.\n\n### Level 1 — Fully shared\n\n```text\nBusiness logic\nValidation\nTypes\nAPI clients\nData transformations\n```\n\n### Level 2 — Shared primitives\n\n```text\nButton\nText\nCard\nInput\nModal\nAvatar\n```\n\n### Level 3 — Platform-specific composition\n\n```text\nDesktop navigation\nMobile navigation\nTV navigation\nWeb table\nNative gesture interface\n```\n\nThis is usually healthier than trying to make every screen 100% shared.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-17",
      "title": "The universal component trap",
      "durationMinutes": 3,
      "explanation": "Imagine:\n\n```tsx\n<UniversalDashboard />\n```\n\nthat contains:\n\n```text\nWeb\n+ desktop sidebar\n+ hover behavior\n+ keyboard shortcuts\n+ tables\n\nMobile\n+ bottom navigation\n+ gestures\n+ mobile cards\n\nTV\n+ focus navigation\n\nWearable\n+ tiny screen\n```\n\nEventually the component becomes:\n\n```text\n1,500 lines\n+\nPlatform checks\n+\nResponsive checks\n+\nSpecial cases\n```\n\nThat's not successful code sharing.\n\nA better architecture is:\n\n```text\nDashboard Domain\n       │\n       ├── WebDashboard\n       ├── MobileDashboard\n       └── TVDashboard\n              │\n              ↓\n       Shared domain logic\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-18",
      "title": "Universal design system at scale",
      "durationMinutes": 3,
      "explanation": "A mature design system might look like:\n\n```text\nDesign System\n│\n├── Tokens\n│   ├── colors\n│   ├── spacing\n│   ├── typography\n│   └── radius\n│\n├── Primitives\n│   ├── Text\n│   ├── Box\n│   ├── Stack\n│   └── Pressable\n│\n├── Components\n│   ├── Button\n│   ├── Input\n│   ├── Card\n│   └── Dialog\n│\n└── Platform adapters\n    ├── Web\n    └── Native\n```\n\nThis allows the design language to remain consistent while implementation details vary.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-19",
      "title": "Universal app decision framework",
      "durationMinutes": 3,
      "explanation": "When creating a new component, ask:\n\n### Question 1\n\nDoes the behavior mean the same thing everywhere?\n\nIf yes:\n\n```text\nShare it.\n```\n\n### Question 2\n\nDoes the interaction differ?\n\nIf yes:\n\n```text\nShare the logic.\nSeparate the UI.\n```\n\n### Question 3\n\nDoes the platform provide fundamentally different capabilities?\n\nIf yes:\n\n```text\nCreate a platform adapter.\n```\n\n### Question 4\n\nWould sharing make the component harder to understand?\n\nIf yes:\n\n```text\nDon't share it just for the sake of sharing.\n```\n\nThis last point is extremely important.\n\n**Code duplication is sometimes cheaper than abstraction complexity.**",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn-elective-d-20",
      "title": "Universal application mental model",
      "durationMinutes": 3,
      "explanation": "The complete architecture should look something like:\n\n```text\n                    PRODUCT\n                       │\n              ┌────────┴────────┐\n              │                  │\n         Shared Core        Platform UX\n              │                  │\n       ┌──────┼──────┐      ┌────┼─────┐\n       │      │      │      │    │     │\n     Domain  API   State   iOS Android Web\n       │      │      │      │    │     │\n       └──────┴──────┘      └────┴─────┘\n```\n\nThe **shared core represents what the product does**.\n\nThe **platform layer represents how the user experiences it**.\n\nThat distinction is the heart of universal application architecture.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    }
  ],
  "finalQuiz": [
    {
      "question": "What does React Native Web provide?",
      "options": [
        "A way for React Native primitives and APIs to target browsers",
        "A native build server",
        "A database",
        "An iOS simulator"
      ],
      "correctIndex": 0,
      "explanation": "React Native Web maps supported React Native abstractions to the browser."
    },
    {
      "question": "What is the strongest universal sharing boundary?",
      "options": [
        "Business logic, types, validation, and data access",
        "Every screen layout",
        "All navigation behavior",
        "Every interaction"
      ],
      "correctIndex": 0,
      "explanation": "Product rules and data code usually transfer cleanly across platforms."
    },
    {
      "question": "Why use `.web.tsx` and `.native.tsx` files?",
      "options": [
        "To isolate meaningful platform implementations",
        "To change package versions",
        "To avoid TypeScript",
        "To store environment secrets"
      ],
      "correctIndex": 0,
      "explanation": "Platform files keep differences local instead of spreading conditionals."
    },
    {
      "question": "Why avoid `Platform.OS` checks throughout the app?",
      "options": [
        "They make platform boundaries scattered and hard to maintain",
        "They disable Metro",
        "They prevent API calls",
        "They remove accessibility"
      ],
      "correctIndex": 0,
      "explanation": "Centralized platform seams keep the shared code understandable."
    },
    {
      "question": "What should a universal design system share first?",
      "options": [
        "Tokens and semantic primitives",
        "One fixed screen width",
        "Mobile-only gestures",
        "Browser history"
      ],
      "correctIndex": 0,
      "explanation": "Tokens create consistency while allowing platform-appropriate components."
    },
    {
      "question": "What does responsive web design account for?",
      "options": [
        "Different viewport sizes and input modes",
        "Only phone dimensions",
        "Only native safe areas",
        "Only app-store rules"
      ],
      "correctIndex": 0,
      "explanation": "Web layouts must adapt across viewport sizes and device inputs."
    },
    {
      "question": "How does web navigation differ from mobile navigation?",
      "options": [
        "It includes URLs, browser history, and deep linking expectations",
        "It has no routes",
        "It cannot go back",
        "It only uses tabs"
      ],
      "correctIndex": 0,
      "explanation": "The browser exposes addressable URLs and its own history model."
    },
    {
      "question": "When may Next.js be preferable for the web layer?",
      "options": [
        "When the web product needs web-first routing, rendering, or composition",
        "Whenever a Pressable exists",
        "Only for native builds",
        "When there is no web UI"
      ],
      "correctIndex": 0,
      "explanation": "A dedicated web framework can serve web-specific product requirements better."
    },
    {
      "question": "What is the universal component trap?",
      "options": [
        "Forcing all platforms through one component despite different UX needs",
        "Sharing TypeScript types",
        "Using design tokens",
        "Testing business rules"
      ],
      "correctIndex": 0,
      "explanation": "Maximum component reuse can create complex and compromised interfaces."
    },
    {
      "question": "What does universal does not mean identical mean?",
      "options": [
        "Share the product core while adapting UX to each platform",
        "Duplicate all code",
        "Remove platform features",
        "Use the same navigation everywhere"
      ],
      "correctIndex": 0,
      "explanation": "Universal architecture balances shared product behavior with platform-native experience."
    }
  ],
  "project": {
    "name": "Universal Application",
    "goal": "Build one universal feature for iOS, Android, and web with a shared core and platform-specific user experience.",
    "brief": "## Build a Universal Application\n\nCreate one feature that runs on:\n\n* iOS\n* Android\n* Web\n\nA good example would be a **project management dashboard**, **expense tracker**, **e-commerce flow**, or **learning application**.\n\n### Requirements\n\nBuild:\n\n```text\nShared\n├── TypeScript models\n├── API client\n├── validation\n├── business logic\n├── state\n└── design tokens\n\nNative\n├── mobile navigation\n├── touch interactions\n└── native accessibility\n\nWeb\n├── URL routing\n├── responsive layout\n├── keyboard navigation\n└── desktop composition\n```\n\n### Acceptance criteria\n\n* Same core business rules on all platforms\n* Shared TypeScript types\n* Shared API/data layer\n* Shared design tokens\n* Shared reusable primitives where appropriate\n* Web-specific behavior isolated\n* Native-specific behavior isolated\n* No large `Platform.OS` conditionals scattered throughout the application\n* Responsive web layout\n* Keyboard-accessible web interactions\n* Native accessibility support\n* Clear documentation explaining what is shared and what isn't\n\n### Self-check\n\nYou should be able to explain:\n\n1. What does React Native Web actually provide?\n2. What should always be shared?\n3. What should usually remain platform-specific?\n4. When should you use `.web.tsx` or `.native.tsx`?\n5. Why shouldn't every screen be 100% shared?\n6. How does web navigation differ from mobile navigation?\n7. Why does a universal design system need tokens?\n8. When would Next.js be preferable to forcing everything through React Native Web?\n9. How do you prevent platform conditionals from spreading through the codebase?\n10. What does **“universal does not mean identical”** mean in practical architecture?\n\n---\n\n## Final takeaway for both electives\n\nThese two electives should ultimately teach one architectural principle:\n\n```text\n                 DON'T SHARE EVERYTHING\n                         │\n                         ↓\n              SHARE THE RIGHT THINGS\n                         │\n          ┌──────────────┴──────────────┐\n          │                             │\n       Shared                         Specific\n       Core                            UX\n          │                             │\n   Business logic                 Platform behavior\n   API/data                       Interaction\n   Validation                     Navigation\n   State                           Native APIs\n   Design tokens                  Spatial/TV/Web UX\n```\n\n**Elective C** teaches this principle across **different device categories**.\n\n**Elective D** teaches it across **native and web platforms**.\n\nTogether, they move you from *“I know how to build React Native apps”* toward *“I know how to architect a multi-platform product without pretending every platform is the same.”*",
    "steps": [],
    "acceptance": [
      "Share TypeScript models, business rules, and the API layer.",
      "Use shared design tokens and appropriate reusable primitives.",
      "Isolate web-specific and native-specific behavior.",
      "Support responsive and keyboard-accessible web interaction.",
      "Document what is shared and what remains platform-specific."
    ]
  }
});

