import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_42_LESSONS = normalizePastedLessonDay({
  "day": 42,
  "title": "Monorepos and Code Sharing",
  "overview": "### Goal\n\nBy the end of this day, you should understand how to structure one repository containing:\n\n```text\nReact Native mobile\n       +\nReact web\n       +\nshared business logic\n       +\nshared UI/design system\n```\n\nwhile still accepting that **mobile and web are different platforms**.",
  "totalMinutes": 60,
  "difficulty": "Advanced",
  "lessons": [
    {
      "id": "rn42-1",
      "title": "Why share code?",
      "durationMinutes": 4,
      "explanation": "Imagine you have:\n\n```text\nMobile app\nWeb app\n```\n\nBoth applications need:\n\n```text\nauthentication\nAPI calls\nvalidation\nbusiness rules\ntypes\nformatting\nstate logic\n```\n\nWithout sharing, you might have:\n\n```text\nmobile/\n auth.ts\n validation.ts\n api.ts\n\nweb/\n auth.ts\n validation.ts\n api.ts\n```\n\nNow you have the same business logic in two places.\n\nEventually:\n\n```text\nMobile validation ≠ Web validation\n```\n\nThat creates bugs.\n\nA shared codebase lets you have:\n\n```text\npackages/\n api/\n auth/\n validation/\n types/\n ui/\n```\n\nand then:\n\n```text\napps/\n mobile/\n web/\n```\n\nConceptually:\n\n```text\n                Monorepo\n                   │\n         ┌─────────┴─────────┐\n         ↓                   ↓\n      Mobile                Web\n         │                   │\n         └─────────┬─────────┘\n                   ↓\n            Shared packages\n         ┌─────────┼─────────┐\n         ↓         ↓         ↓\n       types      API      business\n                             logic\n```",
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
      "id": "rn42-2",
      "title": "What is a monorepo?",
      "durationMinutes": 4,
      "explanation": "A **monorepo** (monolithic repository) means multiple applications/packages live in one Git repository.\n\nFor example:\n\n```text\nmy-product/\n├── apps/\n│   ├── mobile/\n│   └── web/\n│\n├── packages/\n│   ├── api/\n│   ├── auth/\n│   ├── types/\n│   ├── validation/\n│   └── ui/\n│\n├── package.json\n├── pnpm-workspace.yaml\n└── turbo.json\n```\n\nYou can have:\n\n```text\napps/mobile\napps/web\n```\n\nusing:\n\n```text\npackages/types\npackages/auth\npackages/api\n```\n\nfrom the same repository.",
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
      "id": "rn42-3",
      "title": "pnpm workspaces",
      "durationMinutes": 4,
      "explanation": "**pnpm workspaces** allow multiple packages to exist together as one workspace.\n\nFor example:\n\n```yaml\npackages:\n - \"apps/*\"\n - \"packages/*\"\n```\n\nNow pnpm understands:\n\n```text\napps/mobile\napps/web\npackages/api\npackages/auth\n```\n\nas part of the same workspace.\n\nA package can depend on another workspace package.\n\nFor example:\n\n```json\n{\n \"dependencies\": {\n   \"@myapp/types\": \"workspace:*\"\n }\n}\n```\n\nThe important idea is:\n\n```text\nMobile\n  ↓\n@myapp/types\n\nWeb\n  ↓\n@myapp/types\n```\n\nBoth consume the same source.",
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
      "id": "rn42-4",
      "title": "What does Turborepo add?",
      "durationMinutes": 4,
      "explanation": "Turborepo is a build/task orchestration tool for monorepos.\n\nImagine you have:\n\n```text\nmobile\nweb\nshared packages\n```\n\nand you run:\n\n```bash\npnpm build\n```\n\nYou don't want to blindly rebuild everything every time.\n\nTurborepo can understand relationships between packages and coordinate tasks such as:\n\n```text\nlint\ntype-check\ntest\nbuild\n```\n\nConceptually:\n\n```text\n             turbo\n               │\n      ┌────────┼────────┐\n      ↓        ↓        ↓\n    mobile    web     packages\n      │        │        │\n      └────────┴────────┘\n             dependencies\n```\n\nIt can also cache task results, which can make large repositories faster.",
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
      "id": "rn42-5",
      "title": "What should be shared?",
      "durationMinutes": 4,
      "explanation": "A useful rule:\n\n> **Share behavior and rules more aggressively than you share presentation.**\n\nGood candidates:\n\n```text\ntypes\nAPI clients\nvalidation\nbusiness rules\ndate/number formatting\ndata transformation\nauthentication logic\nstate machines\ncustom hooks\nutility functions\n```\n\nFor example:\n\n```ts\nexport function calculateTotal(\n items: CartItem[],\n): number {\n return items.reduce(\n   (total, item) => total + item.price * item.quantity,\n   0,\n );\n}\n```\n\nThere is no reason for this calculation to be different on:\n\n```text\nweb\n```\n\nand:\n\n```text\nmobile\n```\n\nSo put it in shared code.",
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
      "id": "rn42-6",
      "title": "Shared hooks",
      "durationMinutes": 4,
      "explanation": "Hooks can also be shared when they don't depend on platform-specific APIs.\n\nFor example:\n\n```ts\nexport function useCartTotal(items: CartItem[]) {\n return useMemo(\n   () => calculateTotal(items),\n   [items],\n );\n}\n```\n\nBoth applications can use:\n\n```text\nMobile\n ↓\nuseCartTotal()\n\nWeb\n ↓\nuseCartTotal()\n```\n\nThis is exactly the type of thing you'll practice in the self-check.",
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
      "id": "rn42-7",
      "title": "Shared UI",
      "durationMinutes": 4,
      "explanation": "You can share UI components too, but this requires more thought.\n\nFor example:\n\n```text\nButton\nInput\nCard\nTypography\nModal\n```\n\nYou might create a shared design system.\n\nConceptually:\n\n```text\npackages/ui\n   │\n   ├── Button\n   ├── Input\n   ├── Card\n   └── Typography\n      │\n      ├─────────────┐\n      ↓             ↓\n    Mobile         Web\n```\n\nBut don't assume every component should be identical.",
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
      "id": "rn42-8",
      "title": "Platform-specific UI",
      "durationMinutes": 4,
      "explanation": "Mobile and web have different interaction models.\n\nFor example:\n\n```text\nMobile\n└── bottom tab navigation\n\nWeb\n└── desktop sidebar\n```\n\nYou can share the business logic while allowing the presentation to differ.\n\nThink:\n\n```text\nShared\n├── user data\n├── permissions\n├── validation\n└── business rules\n\nPlatform-specific\n├── navigation UI\n├── gestures\n├── keyboard behavior\n└── platform controls\n```",
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
      "id": "rn42-9",
      "title": "Solito + Expo Router + Next.js",
      "durationMinutes": 4,
      "explanation": "A common React Native + web architecture uses:\n\n```text\nExpo\n+\nExpo Router\n+\nNext.js\n+\nSolito\n```\n\nThe goal is to share React code between:\n\n```text\nReact Native\n```\n\nand:\n\n```text\nNext.js\n```\n\nSolito provides patterns/components for building cross-platform navigation and shared screens between React Native and Next.js applications.\n\nThe important lesson isn't:\n\n> \"Use Solito everywhere.\"\n\nIt's:\n\n> **Use a cross-platform abstraction where the user experience and component behavior genuinely overlap.**",
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
      "id": "rn42-10",
      "title": "Example shared screen",
      "durationMinutes": 4,
      "explanation": "Imagine:\n\n```text\nProfile\n```\n\nThe shared screen might contain:\n\n```text\nProfile data\nProfile avatar\nName\nEmail\nEdit button\n```\n\nBut platform behavior can differ:\n\n```text\nMobile\n   ↓\nNative navigation\n   ↓\nTouch interaction\n\nWeb\n   ↓\nNext.js routing\n   ↓\nMouse/keyboard interaction\n```\n\nThe underlying data and business rules can still be shared.",
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
      "id": "rn42-11",
      "title": "What cannot be shared?",
      "durationMinutes": 4,
      "explanation": "This is just as important as knowing what can be shared.\n\nSuppose you use:\n\n```ts\nimport * as SecureStore from \"expo-secure-store\";\n```\n\nThat's mobile-specific.\n\nA web application doesn't have the same native secure-storage API.\n\nLikewise:\n\n```text\nCamera\nBluetooth\nBiometrics\nPush notifications\nApp lifecycle\nNative sensors\nKeychain\nAndroid-specific APIs\niOS-specific APIs\n```\n\nmay require platform-specific implementations.\n\nSo don't force everything into:\n\n```text\nshared/\n```",
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
      "id": "rn42-12",
      "title": "Platform-specific files",
      "durationMinutes": 4,
      "explanation": "React Native supports platform-specific file conventions.\n\nFor example:\n\n```text\nstorage.ts\nstorage.ios.ts\nstorage.android.ts\nstorage.web.ts\n```\n\nThen your shared code can import:\n\n```ts\nimport { saveToken } from \"./storage\";\n```\n\nand the platform-specific implementation can be selected appropriately.\n\nConceptually:\n\n```text\n                   storage.ts\n                      │\n         ┌────────────┼────────────┐\n         ↓            ↓            ↓\n    storage.ios   storage.android storage.web\n```\n\nThis gives you:\n\n```text\nsame interface\ndifferent implementation\n```\n\nwhich is a very powerful architecture pattern.",
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
      "id": "rn42-13",
      "title": "Shared interface, different implementation",
      "durationMinutes": 3,
      "explanation": "For example:\n\n```ts\nexport interface SecureStorage {\n get(key: string): Promise<string | null>;\n set(key: string, value: string): Promise<void>;\n remove(key: string): Promise<void>;\n}\n```\n\nThen:\n\n```text\niOS\n↓\nKeychain implementation\n\nAndroid\n↓\nKeystore-backed implementation\n\nWeb\n↓\nWeb-specific implementation\n```\n\nThe business logic doesn't need to know how the storage works.",
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
      "id": "rn42-14",
      "title": "Avoid the \"everything shared\" mistake",
      "durationMinutes": 3,
      "explanation": "A common monorepo mistake is:\n\n```text\n\"Everything must be shared!\"\n```\n\nThen you end up with:\n\n```text\nif (Platform.OS === \"ios\") ...\nif (Platform.OS === \"android\") ...\nif (typeof window !== \"undefined\") ...\nif (isWeb) ...\n```\n\neverywhere.\n\nEventually the supposedly shared component becomes harder to understand than three platform-specific implementations.\n\nA better principle:\n\n> **Share where the abstraction is genuinely common. Split where platform behavior is genuinely different.**",
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
      "id": "rn42-15",
      "title": "Shared design system",
      "durationMinutes": 3,
      "explanation": "A design system is a collection of reusable UI rules and components.\n\nFor example:\n\n```text\nColors\nTypography\nSpacing\nButtons\nInputs\nCards\nIcons\nForm components\n```\n\nYou might have:\n\n```text\npackages/design-system\n```\n\nwith:\n\n```text\nButton\nText\nInput\nCard\nModal\n```\n\nThe goal isn't necessarily identical pixels on every platform.\n\nInstead:\n\n```text\nShared design language\n       +\nPlatform-appropriate implementation\n```",
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
      "id": "rn42-16",
      "title": "Business logic outside UI",
      "durationMinutes": 3,
      "explanation": "Suppose you have checkout logic.\n\nBad architecture:\n\n```tsx\nfunction CheckoutScreen() {\n // 300 lines\n // API calls\n // validation\n // calculations\n // permissions\n // UI\n}\n```\n\nBetter:\n\n```text\nCheckoutScreen\n     ↓\nuseCheckout()\n     ↓\nCheckoutService\n     ↓\nAPI\n```\n\nNow the important business rules don't depend on rendering.",
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
      "question": "Why share code between mobile and web?",
      "options": [
        "A. To keep common business rules and reusable behavior in one implementation",
        "B. To make every UI identical",
        "C. To remove platform APIs",
        "D. To avoid testing"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a monorepo?",
      "options": [
        "A. One repository containing multiple applications and packages",
        "B. One component with many screens",
        "C. A mobile database",
        "D. A build profile"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What do pnpm workspaces provide?",
      "options": [
        "A. Workspace dependency management across repository packages",
        "B. Native rendering",
        "C. App Store submission",
        "D. Crash symbolication"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does Turborepo add?",
      "options": [
        "A. Task orchestration, caching, and dependency-aware execution",
        "B. Secure token storage",
        "C. Native permissions",
        "D. Screen-reader roles"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a good candidate for sharing?",
      "options": [
        "A. Platform-independent business logic and types",
        "B. Every native view",
        "C. All navigation code",
        "D. Platform permissions"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "How should platform-specific UI be handled?",
      "options": [
        "A. Keep a shared interface with focused platform implementations",
        "B. Force one implementation everywhere",
        "C. Use runtime strings only",
        "D. Copy the entire application"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is Solito used for?",
      "options": [
        "A. Sharing navigation-aware screens between React Native and Next.js",
        "B. Building native modules",
        "C. Running unit tests",
        "D. Signing Android builds"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should not be forced into a shared package?",
      "options": [
        "A. Behavior that genuinely depends on one platform",
        "B. Pure validation rules",
        "C. Domain types",
        "D. Shared calculations"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why keep business logic outside UI components?",
      "options": [
        "A. It becomes easier to share, test, and reason about",
        "B. It prevents all rendering",
        "C. It removes APIs",
        "D. It replaces state"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is the main danger of sharing everything?",
      "options": [
        "A. Shared packages become coupled to conflicting platform requirements",
        "B. The repository gets smaller",
        "C. Tests become faster",
        "D. Builds need fewer tools"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Monorepo Self-check",
    "goal": "Share one useful implementation between a mobile app and a web app.",
    "brief": "Create a monorepo containing:\n\n```text\napps/\n mobile/\n web/\n\npackages/\n shared/\n```\n\nThen create something genuinely useful, for example:\n\n```ts\nexport function calculateCartTotal(\n items: CartItem[],\n discount: number,\n) {\n // business logic\n}\n```\n\nor a non-trivial hook such as:\n\n```ts\nuseCartSummary()\n```\n\nUse it from both:\n\n```text\nReact Native\n```\n\nand:\n\n```text\nReact web\n```\n\nThe important part is:\n\n```text\nOne implementation\n      ↓\nMobile + Web\n```\n\nnot copying the same function into both apps.",
    "steps": [],
    "acceptance": [
      "Create mobile and web applications in one workspace.",
      "Create a shared package.",
      "Add non-trivial shared business logic or a hook.",
      "Use the same implementation from both applications without copying it."
    ]
  }
});

