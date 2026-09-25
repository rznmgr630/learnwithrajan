import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_ELECTIVE_A_LESSONS = normalizePastedLessonDay({
  "day": 46,
  "label": {
    "en": "Elective A",
    "np": "Elective A",
    "jp": "選択科目 A"
  },
  "title": "Expo Router Deep Dive",
  "overview": "### Goal\n\nBy the end of this elective, you should be able to design a larger Expo Router application with:\n\n* nested layouts\n* route groups\n* typed routes\n* route-level code splitting\n* server functions/API routes\n* web output from the same routing structure\n\nThe important shift is to stop thinking about routing as:\n\n> \"I need to navigate from Screen A to Screen B.\"\n\nand start thinking about it as:\n\n> \"My application has a route architecture, and the filesystem defines that architecture.\"",
  "totalMinutes": 60,
  "difficulty": "Advanced",
  "lessons": [
    {
      "id": "rn-elective-a-1",
      "title": "Expo Router mental model",
      "durationMinutes": 4,
      "explanation": "Expo Router uses the filesystem as the source of truth for routes.\n\nFor example:\n\n```text\napp/\n├── _layout.tsx\n├── index.tsx\n├── settings.tsx\n└── profile.tsx\n```\n\nbecomes roughly:\n\n```text\n/\n├── /\n├── /settings\n└── /profile\n```\n\nSo:\n\n```text\nFile structure\n     ↓\nRoute structure\n     ↓\nNavigation\n```\n\nThis is called **file-based routing** (routes are created from files and folders instead of manually registering every screen).",
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
      "id": "rn-elective-a-2",
      "title": "The root layout",
      "durationMinutes": 4,
      "explanation": "The root layout:\n\n```text\napp/_layout.tsx\n```\n\nis the place where application-level navigation configuration normally lives.\n\nFor example:\n\n```tsx\nimport { Stack } from \"expo-router\";\n\nexport default function RootLayout() {\n return <Stack />;\n}\n```\n\nThink of it as:\n\n```text\nApp\n↓\nRoot Layout\n↓\nRoutes\n```\n\nYou can also configure screens:\n\n```tsx\n<Stack>\n <Stack.Screen\n   name=\"index\"\n   options={{\n     title: \"Home\",\n   }}\n />\n</Stack>\n```",
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
      "id": "rn-elective-a-3",
      "title": "Nested layouts",
      "durationMinutes": 4,
      "explanation": "Suppose you have:\n\n```text\napp/\n├── _layout.tsx\n├── index.tsx\n└── account/\n   ├── _layout.tsx\n   ├── profile.tsx\n   └── security.tsx\n```\n\nNow you have:\n\n```text\nRoot Layout\n   │\n   ├── Home\n   │\n   └── Account Layout\n         ├── Profile\n         └── Security\n```\n\nThe nested layout controls navigation behavior for that section.\n\nFor example:\n\n```tsx\n// app/account/_layout.tsx\n\nimport { Stack } from \"expo-router\";\n\nexport default function AccountLayout() {\n return (\n   <Stack>\n     <Stack.Screen name=\"profile\" options={{ title: \"Profile\" }} />\n     <Stack.Screen name=\"security\" options={{ title: \"Security\" }} />\n   </Stack>\n );\n}\n```\n\nThis is useful because account-specific navigation stays inside the account feature.",
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
      "id": "rn-elective-a-4",
      "title": "Why nested layouts matter",
      "durationMinutes": 3,
      "explanation": "Without nested layouts, a large application can become difficult to reason about.\n\nImagine:\n\n```text\napp/\n├── home\n├── profile\n├── profile-edit\n├── profile-security\n├── orders\n├── order-details\n├── order-payment\n├── admin\n├── admin-users\n├── admin-settings\n└── ...\n```\n\nEverything is mixed together.\n\nInstead:\n\n```text\napp/\n├── (main)/\n│   ├── _layout.tsx\n│   ├── home.tsx\n│   └── profile.tsx\n│\n├── orders/\n│   ├── _layout.tsx\n│   ├── index.tsx\n│   └── [id].tsx\n│\n└── admin/\n   ├── _layout.tsx\n   ├── users.tsx\n   └── settings.tsx\n```\n\nThe route tree now communicates the architecture.",
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
      "id": "rn-elective-a-5",
      "title": "Route groups",
      "durationMinutes": 3,
      "explanation": "A folder wrapped in parentheses is a **route group**.\n\nFor example:\n\n```text\napp/\n├── (auth)/\n│   ├── login.tsx\n│   └── register.tsx\n│\n└── (app)/\n   ├── home.tsx\n   └── profile.tsx\n```\n\nThe parentheses mean:\n\n> Organize these routes together without adding that folder name to the URL.\n\nSo:\n\n```text\n(auth)/login.tsx\n```\n\ncan still produce:\n\n```text\n/login\n```\n\nnot:\n\n```text\n/auth/login\n```\n\nThis is extremely useful for organizing large applications.",
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
      "id": "rn-elective-a-6",
      "title": "Route groups and authentication",
      "durationMinutes": 3,
      "explanation": "A common structure is:\n\n```text\napp/\n├── _layout.tsx\n│\n├── (auth)/\n│   ├── login.tsx\n│   └── register.tsx\n│\n└── (app)/\n   ├── _layout.tsx\n   ├── index.tsx\n   └── profile.tsx\n```\n\nYou can then make `(app)/_layout.tsx` responsible for authenticated navigation.\n\nConceptually:\n\n```text\n            Root\n             │\n      ┌──────┴──────┐\n      ▼             ▼\n   (auth)          (app)\n      │              │\n    Login          Home\n   Register        Profile\n```\n\nThe group does not itself magically authenticate the user.\n\nYour application still needs authentication state and authorization logic.",
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
      "id": "rn-elective-a-7",
      "title": "Dynamic routes",
      "durationMinutes": 3,
      "explanation": "Suppose:\n\n```text\napp/\n└── users/\n   └── [id].tsx\n```\n\nThis represents:\n\n```text\n/users/123\n/users/456\n/users/abc\n```\n\nInside the screen:\n\n```tsx\nimport { useLocalSearchParams } from \"expo-router\";\n\nexport default function UserScreen() {\n const { id } = useLocalSearchParams<{ id: string }>();\n\n return <Text>User: {id}</Text>;\n}\n```\n\nThe `[id]` is a **dynamic segment** (a route segment whose value changes).",
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
      "id": "rn-elective-a-8",
      "title": "Catch-all routes",
      "durationMinutes": 3,
      "explanation": "You may also encounter:\n\n```text\napp/\n└── docs/\n   └── [...slug].tsx\n```\n\nThis can match paths such as:\n\n```text\n/docs/react\n/docs/react/hooks\n/docs/react/hooks/use-state\n```\n\nThis is useful for documentation systems and deeply nested content.",
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
      "id": "rn-elective-a-9",
      "title": "Parallel routes",
      "durationMinutes": 3,
      "explanation": "Parallel routing becomes useful when multiple navigation sections need to coexist.\n\nThink about an application with:\n\n```text\nMain content\n+\nModal\n+\nIndependent navigation section\n```\n\nExpo Router provides advanced routing primitives that can support more complex route structures.\n\nThe important idea is:\n\n```text\nOne application\n     ↓\nMultiple route branches\n     ↓\nDifferent UI/navigation responsibilities\n```\n\nDon't introduce this complexity just because the feature exists.\n\nUse it when your application's navigation model actually requires it.",
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
      "id": "rn-elective-a-10",
      "title": "Typed routes",
      "durationMinutes": 3,
      "explanation": "One of the biggest advantages of typed routing is catching navigation mistakes at compile time.\n\nInstead of:\n\n```ts\nrouter.push(\"/profiel\");\n```\n\nand discovering the typo only at runtime, typed routes can help TypeScript understand valid routes.\n\nConceptually:\n\n```text\nFilesystem\n   ↓\nRoute types generated\n   ↓\nTypeScript\n   ↓\nInvalid route → compile error\n```\n\nThis is especially valuable in large applications.",
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
      "id": "rn-elective-a-11",
      "title": "Typed route parameters",
      "durationMinutes": 3,
      "explanation": "Suppose:\n\n```text\napp/\n└── products/\n   └── [id].tsx\n```\n\nYour application can reason about:\n\n```text\n/products/:id\n```\n\nrather than treating every navigation path as an arbitrary string.\n\nThis reduces errors involving:\n\n```text\nwrong route\nmissing parameter\nincorrect parameter name\ninvalid navigation target\n```",
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
      "id": "rn-elective-a-12",
      "title": "End-to-end typed navigation",
      "durationMinutes": 3,
      "explanation": "Typed routing becomes much more useful when it is used consistently.\n\nFor example:\n\n```text\nScreen\n↓\nrouter.push()\n↓\nroute type\n↓\ndynamic params\n↓\ndestination\n```\n\nYou want the compiler to help you across the whole chain.\n\nThis is particularly valuable when a project contains dozens or hundreds of routes.",
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
      "id": "rn-elective-a-13",
      "title": "Route-based code splitting",
      "durationMinutes": 3,
      "explanation": "Large applications should not necessarily load every piece of JavaScript immediately.\n\nImagine:\n\n```text\nApplication\n├── Home\n├── Orders\n├── Admin\n├── Analytics\n└── Settings\n```\n\nInstead of loading everything immediately:\n\n```text\nInitial bundle\n   ↓\nHome\n```\n\nand later:\n\n```text\nNavigate → Analytics\n             ↓\n       Analytics code\n```\n\nThis is **code splitting** (dividing application code into smaller pieces that can be loaded when needed).\n\nThe benefit can be:\n\n```text\nSmaller initial work\n      ↓\nFaster startup\n      ↓\nLoad expensive features later\n```",
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
      "id": "rn-elective-a-14",
      "title": "Code splitting isn't automatically faster",
      "durationMinutes": 3,
      "explanation": "There is a trade-off.\n\nWithout splitting:\n\n```text\nLarge initial bundle\n↓\nMore startup work\n```\n\nWith too much splitting:\n\n```text\nMany small chunks\n↓\nMore requests/loading boundaries\n↓\nPotential navigation delays\n```\n\nSo the goal is not:\n\n> \"Split everything.\"\n\nThe goal is:\n\n> \"Don't make the user load expensive code before they need it.\"",
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
      "id": "rn-elective-a-15",
      "title": "Server functions",
      "durationMinutes": 3,
      "explanation": "Modern Expo applications can also use server-side functionality.\n\nThe important mental model is:\n\n```text\nMobile/Web client\n      │\n      ▼\nExpo Router route\n      │\n      ▼\nServer\n      │\n      ▼\nDatabase / external API\n```\n\nServer code runs away from the user's device.\n\nThis means secrets can stay server-side.\n\nFor example:\n\n```text\nClient\n ↓\n/api/payment\n ↓\nServer\n ↓\nPrivate API key\n```\n\ninstead of:\n\n```text\nClient\n ↓\nPrivate API key ❌\n```",
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
      "id": "rn-elective-a-16",
      "title": "API routes",
      "durationMinutes": 3,
      "explanation": "You can structure API routes alongside your application routes.\n\nConceptually:\n\n```text\napp/\n├── index.tsx\n├── profile.tsx\n└── api/\n   └── users+api.ts\n```\n\nThe exact file conventions depend on the Expo Router version and server configuration you're using, so treat the current Expo documentation as the source of truth when implementing this.\n\nThe important architecture is:\n\n```text\nUI route\n   +\nAPI route\n   +\nserver-side logic\n```",
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
      "id": "rn-elective-a-17",
      "title": "Server functions vs client functions",
      "durationMinutes": 3,
      "explanation": "This distinction is important.\n\n### Client function\n\n```ts\nasync function loadUsers() {\n return fetch(\"/api/users\");\n}\n```\n\nRuns from the application.\n\n### Server function\n\n```text\nClient\n↓\nServer function\n↓\nDatabase\n```\n\nThe server can access:\n\n```text\nprivate credentials\ndatabase\nserver environment variables\ntrusted backend services\n```\n\nThe client cannot safely own those secrets.",
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
      "id": "rn-elective-a-18",
      "title": "Universal web output",
      "durationMinutes": 3,
      "explanation": "One of Expo Router's powerful ideas is that the same routing structure can support:\n\n```text\niOS\nAndroid\nWeb\n```\n\nFor example:\n\n```text\napp/\n├── index.tsx\n├── products/\n│   ├── index.tsx\n│   └── [id].tsx\n└── settings.tsx\n```\n\ncan represent the same application structure across platforms.\n\n```text\n            app/\n             │\n     ┌───────┼────────┐\n     ▼       ▼        ▼\n    iOS   Android     Web\n```\n\nThe UI implementation may still need platform-specific behavior.",
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
      "id": "rn-elective-a-19",
      "title": "Web is not simply \"mobile in a browser\"",
      "durationMinutes": 3,
      "explanation": "This is an important mistake.\n\nWeb has:\n\n```text\nMouse\nKeyboard\nURL sharing\nSEO considerations\nBrowser history\nHover\nDifferent viewport behavior\nAccessibility expectations\n```\n\nMobile has:\n\n```text\nTouch\nNative navigation\nApp lifecycle\nPermissions\nDevice hardware\n```\n\nSo:\n\n```text\nShared routing\n≠\nidentical application behavior\n```",
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
      "id": "rn-elective-a-20",
      "title": "Platform-specific routes",
      "durationMinutes": 3,
      "explanation": "If necessary, you can use platform-specific files:\n\n```text\nprofile.tsx\nprofile.web.tsx\nprofile.ios.tsx\nprofile.android.tsx\n```\n\nThis allows:\n\n```text\nShared architecture\n+\nPlatform-specific implementation\n```\n\nrather than forcing everything into:\n\n```tsx\nif (Platform.OS === ...)\n```",
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
      "id": "rn-elective-a-21",
      "title": "Universal architecture",
      "durationMinutes": 3,
      "explanation": "A mature Expo Router application can look like:\n\n```text\n                   Expo Router\n                        │\n        ┌───────────────┼───────────────┐\n        ▼               ▼               ▼\n       iOS           Android            Web\n        │               │               │\n     Native          Native           Browser\n      APIs             APIs             APIs\n```\n\nThe route structure remains conceptually shared.",
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
      "question": "What is Expo Router's core mental model?",
      "options": [
        "A. The file system defines the application's route structure",
        "B. Routes live only in Redux",
        "C. Every screen needs manual native registration",
        "D. URLs are unrelated to screens"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does the root layout control?",
      "options": [
        "A. Navigation and providers shared across the route tree",
        "B. Only one button",
        "C. Android signing",
        "D. API caching"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why use nested layouts?",
      "options": [
        "A. To share navigation and UI structure within part of the route tree",
        "B. To disable navigation",
        "C. To store secrets",
        "D. To publish native modules"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does a route group do?",
      "options": [
        "A. Organizes routes without adding the group name to the URL",
        "B. Creates a native module",
        "C. Changes the bundle identifier",
        "D. Adds a database table"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a dynamic route?",
      "options": [
        "A. A route whose path contains a parameter such as an item ID",
        "B. A route that changes app signing",
        "C. A fixed home screen",
        "D. A native crash"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a catch-all route useful for?",
      "options": [
        "A. Matching an unknown number of trailing path segments",
        "B. Only authentication",
        "C. Only native builds",
        "D. Only testing"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What do typed routes provide?",
      "options": [
        "A. Compile-time checking for route paths and parameters",
        "B. Automatic server deployment",
        "C. Native rendering",
        "D. Secure storage"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should be considered before relying on route-based code splitting?",
      "options": [
        "A. Whether the loading boundary and actual bundle behavior improve the user experience",
        "B. Only the file name",
        "C. Only the icon color",
        "D. Only the device model"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "How should platform-specific routes be handled?",
      "options": [
        "A. Use focused platform files or route implementations behind a shared intent",
        "B. Duplicate the entire application",
        "C. Ignore web behavior",
        "D. Use private imports"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What makes a universal architecture healthy?",
      "options": [
        "A. Shared domain logic with platform-appropriate UI and navigation seams",
        "B. Identical implementation everywhere",
        "C. No platform testing",
        "D. All code in route files"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Universal Expo Router Project",
    "goal": "Build a typed universal route structure with nested layouts and platform-aware behavior.",
    "brief": "Build a small **universal account application**.\n\n### Requirements\n\n```text\napp/\n├── _layout.tsx\n├── (auth)/\n│   ├── login.tsx\n│   └── register.tsx\n│\n├── (app)/\n│   ├── _layout.tsx\n│   ├── index.tsx\n│   └── profile.tsx\n│\n├── products/\n│   ├── index.tsx\n│   └── [id].tsx\n│\n└── api/\n   └── profile+api.ts\n```\n\nImplement:\n\n* nested layouts\n* route groups\n* dynamic route\n* typed navigation\n* API route/server function\n* web output\n* at least one platform-specific screen\n\n### Acceptance criteria\n\n```text\n[ ] Authentication routes are separated\n[ ] App routes have their own layout\n[ ] Dynamic product route works\n[ ] Navigation is typed\n[ ] API route works\n[ ] Sensitive server value stays server-side\n[ ] Web route works\n[ ] Mobile route works\n[ ] Platform-specific behavior is documented\n```\n\n### Self-check\n\nOpen the same project on:\n\n```text\niOS\nAndroid\nWeb\n```\n\nand explain:\n\n> Which parts are shared, and which parts are platform-specific?",
    "steps": [],
    "acceptance": [
      "Use a root layout and nested layouts.",
      "Include route groups and dynamic routes.",
      "Enable typed navigation and parameters.",
      "Handle authentication routing.",
      "Demonstrate mobile and web behavior."
    ]
  }
});

