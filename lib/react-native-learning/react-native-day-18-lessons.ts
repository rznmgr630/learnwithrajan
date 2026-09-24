import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_18_LESSONS = normalizePastedLessonDay({
  "day": 18,
  "title": "TypeScript in React Native",
  "overview": "📖 **6 lessons**\n\nTypeScript isn't just about adding types to variables.\n\nIn a React Native application, TypeScript can protect:\n\n```\nNavigation\nAPI data\nComponent props\nNative modules\nEnvironment configuration\nState\nHooks\n```\n\nThe goal today is to make TypeScript catch mistakes **before your application runs**.\n\nOne important current detail: React Native 0.87 made its Strict TypeScript API the default. The new API generates types from React Native's source and restricts the public API to root exports rather than internal deep imports. ([React Native](<https://reactnative.dev/blog/2026/08/11/react-native-0.87?utm_source=chatgpt.com>))",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn18-1",
      "title": "TypeScript as the Default",
      "durationMinutes": 8,
      "explanation": "⏱️ **8 min**\n\n## Explanation\n\nJavaScript allows this:\n\n```\nconst userId = \"123\";\n\nnavigateToUser(userId);\n```\n\nBut perhaps the function expects:\n\n```\nnumber\n```\n\nJavaScript won't necessarily catch this before runtime.\n\nTypeScript can.\n\n```\nconst userId: number = \"123\";\n```\n\nTypeScript reports an error before you run the application.\n\n---\n\n# Why this matters on mobile\n\nMobile bugs are expensive to discover.\n\nYou might need to:\n\n```\nBuild\n↓\nInstall\n↓\nNavigate\n↓\nTap button\n↓\nReach broken screen\n```\n\nA compiler error is much cheaper:\n\n```\nType error\n↓\nFix code\n↓\nBuild\n```\n\n---\n\n# Types describe contracts\n\nA **contract** means:\n\n> An agreed shape that code expects.\n\nFor example:\n\n```\ntype User = {\nid: string;\nname: string;\n};\n```\n\nNow:\n\n```\nfunction UserCard({ user }: { user: User }) {\nreturn <Text>{user.name}</Text>;\n}\n```\n\nTypeScript knows:\n\n```\nuser.id → string\nuser.name → string\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- TypeScript catches many mistakes before runtime.\n- Types describe the shape of data.\n- New React Native applications should use TypeScript.\n- Think of types as contracts between parts of your application."
      ],
      "commonMistakes": [
        "### ❌ Using `any` everywhere\n\n`any` tells TypeScript:\n\n> \"Don't check this.\"\n\nToo much `any` removes much of the benefit.\n\n### ❌ Typing everything as `string`\n\nUse the actual type."
      ],
      "quiz": [
        {
          "question": "What is the main purpose of TypeScript?",
          "options": [
            "A. Catch many programming mistakes before runtime",
            "B. Replace React",
            "C. Replace navigation",
            "D. Create native screens automatically"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn18-2",
      "title": "The Strict TypeScript API in React Native",
      "durationMinutes": 10,
      "explanation": "⏱️ **10 min**\n\n## Explanation\n\nOlder React Native projects often relied on separately maintained TypeScript definitions.\n\nReact Native's modern Strict TypeScript API changes that.\n\nIn React Native 0.87, the Strict TypeScript API became the default. The types are generated from React Native's source rather than maintained separately. ([React Native](<https://reactnative.dev/docs/strict-typescript-api?utm_source=chatgpt.com>))\n\n---\n\n# Why generated types?\n\nImagine the actual implementation says:\n\n```\nTextInput has behavior X\n```\n\nbut the TypeScript definitions say:\n\n```\nTextInput has behavior Y\n```\n\nNow your editor and the actual framework disagree.\n\nGenerating types from the source helps reduce this kind of drift.\n\n**Drift** means two representations slowly become different over time.\n\n---\n\n# Root exports\n\nThe modern API is intentionally scoped to what React Native exports from:\n\n```\nimport { ... } from \"react-native\";\n```\n\nThe goal is to avoid depending on internal file paths.\n\n---\n\n# Deep imports\n\nYou might encounter old code like:\n\n```\nimport Something from \"react-native/Libraries/...\";\n```\n\nThese are **deep imports**.\n\nThey reach into internal implementation files rather than the public API.\n\nModern React Native's Strict API treats these as unsupported/type errors. ([React Native](<https://reactnative.dev/docs/strict-typescript-api?utm_source=chatgpt.com>))\n\n---\n\n# Why deep imports are dangerous\n\nImagine React Native changes:\n\n```\nreact-native/Libraries/OldPath\n```\n\nto:\n\n```\nreact-native/Libraries/NewPath\n```\n\nYour application breaks.\n\nBut if you use:\n\n```\nimport { Something } from \"react-native\";\n```\n\nthe framework can preserve the public API even if its internal implementation changes.\n\n---\n\n## Visual Diagram\n\n```\nYour App\n │\n ├── Public API\n │      ↓\n │   react-native\n │\n └── Internal API\n        ↓\n   Libraries/...\n```\n\nPrefer the public API.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- React Native 0.87 makes the Strict TypeScript API the default. ([React Native](<https://reactnative.dev/blog/2026/08/11/react-native-0.87?utm_source=chatgpt.com>))\n- Types are generated from React Native's source.\n- The public API is intentionally scoped to root exports.\n- Deep imports into internal React Native files should be removed. ([React Native](<https://reactnative.dev/docs/strict-typescript-api?utm_source=chatgpt.com>))"
      ],
      "commonMistakes": [
        "### ❌ Importing internal React Native files\n\nAvoid:\n\n```\nreact-native/Libraries/...\n```\n\n### ❌ Assuming old type packages are always correct\n\nModern React Native has moved toward generated types."
      ],
      "quiz": [
        {
          "question": "Why should you avoid React Native deep imports?",
          "options": [
            "A. They depend on internal implementation details",
            "B. They are slower",
            "C. They disable TypeScript",
            "D. They increase image size"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn18-3",
      "title": "Expo Router and Typed Routes",
      "durationMinutes": 10,
      "explanation": "⏱️ **10 min**\n\n## Explanation\n\nNavigation is one of the best places to use TypeScript.\n\nImagine this route:\n\n```\n/users/[id]\n```\n\nThe screen requires:\n\n```\nid\n```\n\nWithout typing, someone might navigate to:\n\n```\n/users\n```\n\nand forget the ID.\n\nThat's a runtime problem.\n\nTyped routes can help catch invalid routes and parameters during development.\n\nExpo Router can generate route types and provide static checking for links and route parameters. ([Expo documentation](<https://docs.expo.dev/router/reference/typed-routes/?utm_source=chatgpt.com>))\n\n---\n\n# Example route\n\nSuppose your project contains:\n\n```\napp/\n├── index.tsx\n└── users/\n  └── [id].tsx\n```\n\nThe dynamic route is:\n\n```\n/users/[id]\n```\n\nThe `id` is required.\n\n---\n\n# Typed navigation\n\nConceptually:\n\n```\nrouter.push({\npathname: \"/users/[id]\",\nparams: {\n  id: \"123\",\n},\n});\n```\n\nTypeScript can understand that:\n\n```\nid\n```\n\nis required.\n\n---\n\n# Missing parameter\n\nThis:\n\n```\nrouter.push({\npathname: \"/users/[id]\",\n});\n```\n\nshould be rejected when using the typed route system.\n\nExpo Router's typed routes documentation shows that dynamic route parameters are statically checked. ([Expo documentation](<https://docs.expo.dev/router/reference/typed-routes/?utm_source=chatgpt.com>))\n\n---\n\n# Why this is powerful\n\nYou move the error from:\n\n```\nRuntime\n```\n\nto:\n\n```\nCompile time\n```\n\n**Compile time** means while TypeScript is checking your source code before the application runs.\n\n---\n\n# `useLocalSearchParams`\n\nOn the destination screen, you can type route parameters:\n\n```\nconst { id } =\nuseLocalSearchParams<{ id: string }>();\n```\n\nExpo Router also supports strongly typed route parameters through its generated route types. ([Expo documentation](<https://docs.expo.dev/router/reference/typed-routes/?utm_source=chatgpt.com>))\n\n---\n\n## Visual Diagram\n\n```\nNavigation\n  │\n  ▼\nRoute definition\n  │\n  ▼\nTypeScript\n  │\n┌──┴───┐\n▼      ▼\nValid  Invalid\n│      │\n▼      ▼\nBuild  Error\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Routes can be typed.\n- Required route parameters can be checked.\n- Typed navigation catches mistakes before runtime.\n- Expo Router can generate route types automatically. ([Expo documentation](<https://docs.expo.dev/router/reference/typed-routes/?utm_source=chatgpt.com>))"
      ],
      "commonMistakes": [
        "### ❌ Using strings everywhere\n\nTyped route helpers provide stronger safety.\n\n### ❌ Treating route parameters as trusted forever\n\nTypeScript checks your code, but external URLs can still contain unexpected values."
      ],
      "quiz": [
        {
          "question": "What does a dynamic route like:\n\n```\n/users/[id]\n```\n\nmean?",
          "options": [
            "A. The route requires a dynamic `id` parameter",
            "B. It always means the ID is optional",
            "C. It creates a database",
            "D. It creates a tab"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn18-4",
      "title": "Typing Environment Variables",
      "durationMinutes": 10,
      "explanation": "⏱️ **10 min**\n\n## Explanation\n\nApplications often need configuration:\n\n```\nAPI URL\nEnvironment name\nPublic app identifier\nFeature flags\n```\n\nYou may have:\n\n```\nDevelopment\nStaging\nProduction\n```\n\nThe values can differ.\n\n---\n\n# The problem\n\nEnvironment variables often start as strings:\n\n```\nAPI_URL=\"https://example.com\"\n```\n\nBut your application needs to know:\n\n```\nIs this actually present?\nIs it a valid URL?\nIs this configuration allowed?\n```\n\n---\n\n# Don't scatter environment variables\n\nAvoid having:\n\n```\nprocess.env.API_URL\n```\n\nin 40 files.\n\nInstead, create one configuration layer.\n\nConceptually:\n\n```\nEnvironment\n   ↓\nValidation\n   ↓\nConfig object\n   ↓\nApplication\n```\n\n---\n\n# Example\n\n```\nconst config = {\napiUrl: process.env.EXPO_PUBLIC_API_URL,\n};\n```\n\nThen your application uses:\n\n```\nconfig.apiUrl\n```\n\nrather than accessing environment values everywhere.\n\n---\n\n# Validation\n\nYou can validate configuration using a schema.\n\nFor example:\n\n```\nconst configSchema = z.object({\napiUrl: z.string().url(),\n});\n```\n\nNow a bad configuration can fail early.\n\n---\n\n# Important security warning\n\nA value bundled into a mobile application is generally **not a secret**.\n\nNever treat:\n\n```\nEXPO_PUBLIC_API_KEY\n```\n\nas a private secret merely because it came from an environment file.\n\nThe application has to receive the value somehow.\n\nFor actual secrets, use a secure backend architecture rather than putting the secret into the mobile bundle.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Environment configuration should have one clear entry point.\n- Validate configuration.\n- Type your configuration object.\n- Don't treat client-bundled environment variables as secrets."
      ],
      "commonMistakes": [
        "### ❌ Putting secrets in the mobile app\n\nUsers can inspect mobile application bundles and runtime behavior.\n\n### ❌ Accessing environment variables everywhere\n\nCentralize configuration.\n\n### ❌ Assuming `.env` automatically makes something secure\n\nIt doesn't."
      ],
      "quiz": [
        {
          "question": "Why validate environment configuration?",
          "options": [
            "A. To detect missing or invalid configuration early",
            "B. To make animations faster",
            "C. To create routes",
            "D. To compress images"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn18-5",
      "title": "Typing Native Module Bridges",
      "durationMinutes": 10,
      "explanation": "⏱️ **10 min**\n\n## Explanation\n\nEventually, you may interact with native code.\n\nFor example:\n\n```\nJavaScript\n  │\n  ▼\nNative Module\n  │\n┌──┴───┐\n▼      ▼\niOS   Android\n```\n\nJavaScript needs to know:\n\n```\nWhat functions exist?\nWhat arguments do they accept?\nWhat do they return?\n```\n\nThat's where TypeScript becomes extremely valuable.\n\n---\n\n# Example\n\nSuppose a native module exposes:\n\n```\ngetBatteryLevel()\n```\n\nMaybe it returns:\n\n```\nPromise<number>\n```\n\nYou can define:\n\n```\ninterface BatteryModule {\ngetBatteryLevel(): Promise<number>;\n}\n```\n\nNow:\n\n```\nconst level = await BatteryModule.getBatteryLevel();\n```\n\nTypeScript understands:\n\n```\nlevel → number\n```\n\n---\n\n# Why this matters\n\nWithout types:\n\n```\nconst level = await NativeModules.Battery.getBatteryLevel();\n```\n\nYou may have no reliable information about:\n\n```\narguments\nreturn type\nerrors\nmethods\n```\n\nWith types:\n\n```\nJavaScript contract\n     │\n     ▼\nTypeScript\n     │\n     ▼\nNative module\n```\n\n---\n\n# Codegen\n\nModern React Native uses **Codegen** (code generation) to help create native interfaces from typed specifications in supported native-module architectures.\n\nThe important beginner idea is:\n\n> Don't manually guess the shape of a native API.\n\nDefine a clear contract and let the tooling help connect JavaScript/TypeScript and native code.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Native modules are boundaries between JavaScript and native code.\n- Type those boundaries carefully.\n- Types document what native code expects.\n- Code generation can reduce manually maintained bridge code."
      ],
      "commonMistakes": [
        "### ❌ Using `any` for native modules\n\nThis removes type safety exactly where you need it.\n\n### ❌ Assuming iOS and Android implementations are identical\n\nThey may differ."
      ],
      "quiz": [
        {
          "question": "Why should a native module interface be typed?",
          "options": [
            "A. To make the JavaScript/native contract explicit",
            "B. To make images smaller",
            "C. To replace navigation",
            "D. To remove all native code"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn18-6",
      "title": "TypeScript as a Safety Net",
      "durationMinutes": 12,
      "explanation": "⏱️ **12 min**\n\n## Explanation\n\nThe biggest TypeScript lesson is not:\n\n> \"Add types everywhere.\"\n\nIt is:\n\n> **Use types at important boundaries.**\n\nImportant boundaries include:\n\n```\nNavigation\nAPI responses\nNative modules\nEnvironment configuration\nComponent props\nShared state\n```\n\n---\n\n# Example architecture\n\n```\n              TypeScript\n                  │\n     ┌────────────┼────────────┐\n     │            │            │\n     ▼            ▼            ▼\n Navigation      API        Native\n     │            │            │\n     ▼            ▼            ▼\n  Routes       Models      Modules\n```\n\nIf those boundaries are typed, many mistakes are caught before runtime.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Type boundaries, not just variables.\n- Navigation should be typed.\n- Native APIs should be typed.\n- Configuration should be typed and validated.\n- API responses should have known shapes."
      ],
      "commonMistakes": [
        "### ❌ Using `any` at boundaries\n\nThis removes protection.\n\n### ❌ Trusting API data blindly\n\nTypeScript doesn't validate data received over the network at runtime.\n\n### ❌ Thinking TypeScript replaces runtime validation\n\nIt doesn't."
      ],
      "quiz": [
        {
          "question": "Where is TypeScript especially valuable?",
          "options": [
            "A. At navigation, API, native-module, and configuration boundaries",
            "B. Only inside button components",
            "C. Only in CSS",
            "D. Only in tests"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What is the main purpose of TypeScript?",
      "options": [
        "A. Catch many programming mistakes before runtime",
        "B. Replace React",
        "C. Replace navigation",
        "D. Create native screens automatically"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why should you avoid React Native deep imports?",
      "options": [
        "A. They depend on internal implementation details",
        "B. They are slower",
        "C. They disable TypeScript",
        "D. They increase image size"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does a dynamic route like:\n\n```\n/users/[id]\n```\n\nmean?",
      "options": [
        "A. The route requires a dynamic `id` parameter",
        "B. It always means the ID is optional",
        "C. It creates a database",
        "D. It creates a tab"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why validate environment configuration?",
      "options": [
        "A. To detect missing or invalid configuration early",
        "B. To make animations faster",
        "C. To create routes",
        "D. To compress images"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why should a native module interface be typed?",
      "options": [
        "A. To make the JavaScript/native contract explicit",
        "B. To make images smaller",
        "C. To replace navigation",
        "D. To remove all native code"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Where is TypeScript especially valuable?",
      "options": [
        "A. At navigation, API, native-module, and configuration boundaries",
        "B. Only inside button components",
        "C. Only in CSS",
        "D. Only in tests"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should replace repeated untyped route strings?",
      "options": [
        "A. Typed routes",
        "B. More any types",
        "C. Deep imports",
        "D. Runtime comments"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why should environment access be centralized?",
      "options": [
        "A. To validate configuration at one boundary",
        "B. To hide client secrets securely",
        "C. To disable TypeScript",
        "D. To replace navigation"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should protect untrusted API data at runtime?",
      "options": [
        "A. Runtime validation",
        "B. TypeScript alone",
        "C. A type assertion",
        "D. A deep import"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should define the contract between JavaScript and a native module?",
      "options": [
        "A. Explicit typed interfaces",
        "B. Global variables",
        "C. Untyped objects",
        "D. Route names"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Make Invalid Navigation Impossible",
    "goal": "Make navigating to a route with a missing required parameter a compile-time error, and remove remaining React Native deep imports.",
    "brief": "---\n\n## Step 1 — Create a dynamic route\n\n```\napp/\n└── profile/\n  └── [id].tsx\n```\n\nThis means:\n\n```\n/profile/[id]\n```\n\nrequires:\n\n```\nid\n```\n\n---\n\n## Step 2 — Navigate correctly\n\n```\nrouter.push({\npathname: \"/profile/[id]\",\nparams: {\n  id: \"123\",\n},\n});\n```\n\n---\n\n## Step 3 — Try the invalid version\n\n```\nrouter.push({\npathname: \"/profile/[id]\",\n});\n```\n\nYour goal is for TypeScript to reject it.\n\nExpo Router's typed-route system is specifically designed to make route paths and dynamic parameters statically checkable. ([Expo documentation](<https://docs.expo.dev/router/reference/typed-routes/?utm_source=chatgpt.com>))\n\n---\n\n## Step 4 — Search for deep imports\n\nLook through your project for:\n\n```\nreact-native/Libraries/\n```\n\nor other internal React Native paths.\n\nReplace them with supported root exports where available.\n\nReact Native 0.87's Strict TypeScript API intentionally restricts the public API to root exports. ([React Native](<https://reactnative.dev/docs/strict-typescript-api?utm_source=chatgpt.com>))",
    "steps": [],
    "acceptance": [
      "You can demonstrate:\n\n```\nCorrect route + correct params\n       ↓\nTypeScript accepts\n\nMissing required param\n       ↓\nTypeScript rejects\n```\n\nAnd:\n\n```\nreact-native/Libraries/...\n```\n\ndoesn't appear in your application code."
    ]
  }
});

