import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_45_LESSONS = normalizePastedLessonDay({
  "day": 45,
  "title": "The 2026 State of the React Native Ecosystem",
  "overview": "### Goal\n\nThis is the final day.\n\nYou are not learning another collection of APIs.\n\nYou are learning how to **look at React Native as a moving production ecosystem**.\n\nA senior React Native developer needs to answer questions like:\n\n> \"Is this tutorial still relevant?\"\n\n> \"Can we safely upgrade this application?\"\n\n> \"Is this package using private React Native APIs?\"\n\n> \"Will this old native module work with the current architecture?\"\n\n> \"What changed between our version and the current version?\"\n\n> \"Should we adopt this new tooling now or wait?\"\n\nThat is the skill today's lesson develops.\n\nReact Native 0.87, released in August 2026, made the Strict TypeScript API the default, updated Metro, added experimental Swift Package Manager support, and raised several toolchain minimums. ([React Native][1])",
  "totalMinutes": 60,
  "difficulty": "Advanced",
  "lessons": [
    {
      "id": "rn45-1",
      "title": "React Native is becoming a smaller public API",
      "durationMinutes": 3,
      "explanation": "One of the biggest changes happening in React Native is not a flashy UI feature.\n\nIt is the effort to define a **stable public JavaScript API**.\n\nHistorically, developers could reach into internal files:\n\n```ts\nimport ViewConfig from \"react-native/Libraries/...\"\n```\n\nThis was called a **deep import**.\n\nIt was dangerous because those files were implementation details.\n\nReact Native could change:\n\n```text\nreact-native/Libraries/...\n```\n\nwithout treating the change as a public API break.\n\nThe newer direction is:\n\n```ts\nimport { View } from \"react-native\";\n```\n\nUse the public API.\n\nDon't depend on internal files.\n\nThe Strict TypeScript API makes this boundary much stronger. ([React Native][2])",
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
      "id": "rn45-2",
      "title": "What does \"React Native 1.0\" actually mean?",
      "durationMinutes": 3,
      "explanation": "Think of the road toward 1.0 as:\n\n```text\nOld React Native\n\nHuge public surface\n      ↓\nInternal APIs accidentally used\n      ↓\nLegacy architecture\n      ↓\nDifferent historical behaviors\n      ↓\nMigration work\n\n         ↓\n\nModern React Native\n\nSmaller public API\n      ↓\nStrict typing\n      ↓\nNew Architecture\n      ↓\nMore predictable releases\n      ↓\nStable API\n```\n\nThe important idea is not:\n\n> \"React Native 1.0 is just another version number.\"\n\nThe important idea is:\n\n> React Native is trying to become more predictable for developers who build long-lived applications.",
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
      "id": "rn45-3",
      "title": "The New Architecture is no longer something you should avoid",
      "durationMinutes": 3,
      "explanation": "If you learned React Native several years ago, you probably heard:\n\n```text\n\"Is New Architecture stable yet?\"\n```\n\nThat question has changed.\n\nModern React Native releases have moved strongly toward the New Architecture.\n\nThat means your mental model should be:\n\n```text\nReact\n↓\nFabric\n↓\nNative rendering\n\nReact\n↓\nTurboModules\n↓\nNative functionality\n\nJSI\n↓\nJavaScript ↔ native interoperability\n```\n\nInstead of building your knowledge around:\n\n```text\nOld Bridge\n```\n\nlearn the modern architecture.\n\nAlso remember:\n\n**Bridge is still a useful historical/interoperability concept**, but you should not build new architecture knowledge around the old Bridge model.",
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
      "id": "rn45-4",
      "title": "React Native 0.87",
      "durationMinutes": 3,
      "explanation": "React Native 0.87 was released on August 11, 2026.\n\nSome important changes include:\n\n```text\nStrict TypeScript API → default\n\nMetro → 0.87\n\nSwift Package Manager → experimental support\n\nAGP → 9 support\n\nNode.js → 22.13+\n\nKotlin → 2.0+\n\ncompileSdk → 37\n```\n\nReact Native's official release notes document these toolchain requirements and API changes. ([React Native][1])\n\nThis matters because upgrading React Native isn't just:\n\n```bash\nnpm install react-native@latest\n```\n\nIt can involve:\n\n```text\nNode\nTypeScript\nMetro\nAndroid Gradle Plugin\nKotlin\nGradle\nXcode\nCocoaPods / SwiftPM\nnative libraries\n```",
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
      "id": "rn45-5",
      "title": "Metro is evolving too",
      "durationMinutes": 2,
      "explanation": "Metro is the JavaScript bundler used by React Native.\n\nYou can think of it as:\n\n```text\nTS / JS\n ↓\nMetro\n ↓\nBundle\n ↓\nReact Native application\n```\n\nModern Metro improvements include work around:\n\n```text\nsource maps\nmemory usage\nbuild performance\ndevelopment feedback\n```\n\nThe important lesson isn't memorizing every Metro release.\n\nIt's understanding that:\n\n> Your React Native toolchain is a system, not a single package.",
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
      "id": "rn45-6",
      "title": "Strict TypeScript API",
      "durationMinutes": 2,
      "explanation": "This is one of the most important topics for the final day.\n\nPreviously, React Native exposed many types and internal paths.\n\nThe Strict TypeScript API creates a more controlled public surface.\n\nFor example, old code might contain:\n\n```ts\nimport { ViewProperties } from \"react-native\";\n```\n\nModern code should use:\n\n```ts\nimport type { ViewProps } from \"react-native\";\n```\n\nReact Native documents the migration from old `*Properties` aliases to `*Props`. ([React Native][2])",
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
      "id": "rn45-7",
      "title": "Deep imports are the big warning sign",
      "durationMinutes": 2,
      "explanation": "Suppose you find this in an old project:\n\n```ts\nimport something from \"react-native/Libraries/Renderer/...\";\n```\n\nStop.\n\nDon't blindly upgrade.\n\nAsk:\n\n```text\nWhy is this importing an internal API?\nIs there a public replacement?\nIs the package maintained?\nWas this workaround required by an old RN version?\n```\n\nModern React Native 0.87 removes access to many of these deep imports under the Strict API. ([React Native][1])",
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
      "id": "rn45-8",
      "title": "Other React Native 0.87 removals",
      "durationMinutes": 2,
      "explanation": "The release also removed several deprecated APIs.\n\nExamples include:\n\n```text\nInteractionManager\ndeprecated Modal animated prop\ndeprecated StatusBar props\nNativeMethods types\nundocumented Touchable root export\nuseTurboModules flag\n```\n\nFor example, code using:\n\n```ts\nInteractionManager.runAfterInteractions(...)\n```\n\nneeds to be reconsidered.\n\nThe modern replacement direction is:\n\n```ts\nrequestIdleCallback(...)\n```\n\nReact Native's release notes document these removals. ([React Native][1])\n\nThe lesson is:\n\n> Don't memorize every removed API. Learn how to recognize deprecated APIs and find the supported replacement.",
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
      "id": "rn45-9",
      "title": "Swift Package Manager is worth watching",
      "durationMinutes": 2,
      "explanation": "React Native 0.87 introduces experimental Swift Package Manager support.\n\nSwiftPM is Apple's native package management system.\n\nHistorically, React Native iOS projects have heavily relied on:\n\n```text\nCocoaPods\n```\n\nNow the ecosystem is exploring:\n\n```text\nSwift Package Manager\n```\n\nBut there is an important distinction:\n\n> Experimental support does not mean \"migrate every production application today.\"\n\nReact Native 0.87 calls SwiftPM experimental, while Expo SDK 58's React Native 0.88 RC also includes opt-in SwiftPM tooling. ([React Native][1])\n\nFor a production team, the correct mindset is:\n\n```text\nLearn\n↓\nExperiment\n↓\nEvaluate dependencies\n↓\nTest CI\n↓\nMeasure migration cost\n↓\nAdopt when justified\n```\n\nNot:\n\n```text\nNew technology!\n↓\nMigrate everything immediately\n```",
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
      "id": "rn45-10",
      "title": "CocoaPods is changing",
      "durationMinutes": 2,
      "explanation": "CocoaPods' Trunk registry is scheduled to stop accepting new Podspecs on **December 2, 2026**. Existing packages aren't suddenly disappearing, but the registry is moving toward a read-only model for publishing new specifications. ([CocoaPods Blog][3])\n\nThat makes Swift Package Manager worth watching.\n\nBut again:\n\n```text\nWorth watching ≠ migrate immediately\n```\n\nA production app has:\n\n```text\nnative dependencies\nCI\nrelease signing\nplugins\ncustom pods\nthird-party SDKs\n```\n\nYou need to verify the whole system before changing the package manager.",
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
      "id": "rn45-11",
      "title": "Expo SDK 58",
      "durationMinutes": 2,
      "explanation": "As of September 2026, Expo SDK 58 is in beta.\n\nIt targets:\n\n```text\nReact Native 0.88\nReact 19.3\niOS 27\n```\n\nand currently uses React Native 0.88 Release Candidate. ([Expo][4])\n\nThis is important because Expo follows React Native releases closely.\n\nThe ecosystem looks approximately like:\n\n```text\nReact Native\n     ↑\n     │\nExpo SDK\n     │\n     ├── Expo Router\n     ├── EAS\n     ├── Expo Modules\n     ├── Expo CLI\n     └── Expo libraries\n```",
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
      "id": "rn45-12",
      "title": "iOS 27 changes",
      "durationMinutes": 2,
      "explanation": "Expo SDK 58 is built for iOS 27.\n\nOne important change is the iOS scene-based lifecycle.\n\nThis matters especially if you customize native iOS code.\n\nFor example, older custom `AppDelegate.swift` assumptions may no longer be correct.\n\nExpo's SDK 58 documentation specifically notes that iOS 27 requires the scene-based lifecycle and that Expo projects now generate `SceneDelegate.swift` and the corresponding manifest configuration. ([Expo][4])\n\nThis is exactly why native knowledge matters.\n\nIf you're only a JavaScript developer, this can look like:\n\n> \"My Expo upgrade randomly broke iOS.\"\n\nIf you understand native iOS architecture, you can investigate:\n\n```text\nAppDelegate\nSceneDelegate\nInfo.plist\nUIKit lifecycle\n```",
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
      "id": "rn45-13",
      "title": "Expo Router is changing too",
      "durationMinutes": 2,
      "explanation": "Expo Router SDK 58 includes significant navigation changes.\n\nThe navigation core has been reworked so navigation state is more deterministic and less dependent on a forked React Navigation API surface. ([Expo][4])\n\nMost normal applications may not notice much.\n\nBut custom navigators can be affected.\n\nEspecially code importing from:\n\n```ts\nexpo-router/react-navigation\n```\n\nor relying on customized navigator behavior.\n\nThe lesson:\n\n> Public APIs are safer than implementation-specific APIs.",
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
      "id": "rn45-14",
      "title": "Async routes",
      "durationMinutes": 2,
      "explanation": "Expo Router also has a useful concept called **async routes**.\n\nInstead of loading every web route immediately:\n\n```text\nApplication\n├── Home\n├── Dashboard\n├── Settings\n└── Admin\n```\n\nthe browser can load route chunks as needed.\n\nConceptually:\n\n```text\nInitial load\n  ↓\nHome chunk\n\nNavigate → Dashboard\n  ↓\nDashboard chunk\n```\n\nThis is particularly relevant to Expo web applications.",
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
      "id": "rn45-15",
      "title": "React Native vs Flutter in 2026",
      "durationMinutes": 2,
      "explanation": "Don't treat this as:\n\n> \"Which framework won?\"\n\nThat isn't a useful engineering question.\n\nThe useful question is:\n\n> \"What are the architectural trade-offs?\"\n\n### React Native\n\n```text\nJavaScript / TypeScript\n       ↓\nReact\n       ↓\nFabric / New Architecture\n       ↓\nNative platform\n```\n\n### Flutter\n\n```text\nDart\n↓\nFlutter framework\n↓\nFlutter rendering engine\n↓\nPlatform\n```\n\nReact Native works naturally with the React/TypeScript ecosystem and can share logic with React web applications.\n\nFlutter uses Dart and controls much more of its rendering pipeline itself.\n\nCurrent industry comparisons generally describe both as capable production frameworks, with trade-offs around ecosystem, rendering model, web sharing, hiring, tooling, and graphics-heavy workloads. ([Primeline][5])",
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
      "id": "rn45-16",
      "title": "Performance isn't the whole decision anymore",
      "durationMinutes": 2,
      "explanation": "Old discussions often looked like:\n\n```text\nFlutter = fast\nReact Native = slow\n```\n\nThat is too simplistic for modern React Native.\n\nThe New Architecture has changed the performance characteristics significantly.\n\nFor typical applications:\n\n```text\nForms\nFeeds\nDashboards\nCommerce\nSaaS\nMessaging\nCRUD\n```\n\nboth frameworks can provide excellent performance.\n\nThe bigger differences are often:\n\n```text\nTeam skills\nRendering requirements\nEcosystem\nNative integration\nWeb sharing\nTooling\nProduct requirements\n```",
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
      "id": "rn45-17",
      "title": "Native rendering vs custom rendering",
      "durationMinutes": 2,
      "explanation": "This is one of the most useful differences to understand.\n\nReact Native is designed around native platform UI.\n\nFlutter controls its own rendering system.\n\nThat means:\n\n### React Native\n\nGood when you want:\n\n```text\nNative platform behavior\nNative controls\nReact ecosystem\nWeb + mobile sharing\nNative SDK integration\n```\n\n### Flutter\n\nCan be attractive when you need:\n\n```text\nHighly controlled visual rendering\nCustom graphics\nConsistent rendering across platforms\nDart ecosystem\n```\n\nNeither is universally better.\n\nThe architecture determines the trade-offs.",
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
      "id": "rn45-18",
      "title": "NativeWind",
      "durationMinutes": 2,
      "explanation": "NativeWind brings Tailwind-style styling to React Native.\n\nFor example:\n\n```tsx\n<View className=\"flex-1 items-center justify-center\">\n <Text className=\"text-xl font-bold\">\n   Hello\n </Text>\n</View>\n```\n\nInstead of:\n\n```tsx\n<View\n style={{\n   flex: 1,\n   alignItems: \"center\",\n   justifyContent: \"center\",\n }}\n>\n```\n\nThe important thing isn't:\n\n> \"You must use NativeWind.\"\n\nInstead:\n\n> NativeWind is one popular styling approach in the modern React Native ecosystem.\n\nUnderstand both:\n\n```text\nStyleSheet\n```\n\nand:\n\n```text\nutility-class styling\n```\n\nso you're not dependent on one abstraction.",
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
      "id": "rn45-19",
      "title": "TanStack Query",
      "durationMinutes": 2,
      "explanation": "TanStack Query solves a different problem.\n\nIt manages **server state**.\n\nFor example:\n\n```text\nAPI\n↓\nTanStack Query\n↓\ncache\n↓\nReact component\n```\n\nInstead of manually managing:\n\n```ts\nconst [loading, setLoading] = useState(false);\nconst [error, setError] = useState(null);\nconst [data, setData] = useState(null);\n```\n\nyou can use a query abstraction.\n\nConceptually:\n\n```ts\nconst { data, isLoading, error } = useQuery({\n queryKey: [\"users\"],\n queryFn: fetchUsers,\n});\n```\n\nIt can manage:\n\n```text\nCaching\nRefetching\nStale data\nLoading\nErrors\nRetries\nInvalidation\nPagination\n```",
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
      "id": "rn45-20",
      "title": "Zustand",
      "durationMinutes": 2,
      "explanation": "Zustand is a lightweight client-state management option.\n\nFor example:\n\n```ts\nconst useCartStore = create((set) => ({\n items: [],\n addItem: (item) =>\n   set((state) => ({\n     items: [...state.items, item],\n   })),\n}));\n```\n\nIt is useful for application state such as:\n\n```text\nUI preferences\nLocal workflow state\nCart state\nDraft state\nAuthentication UI state\n```\n\nBut don't automatically put API cache into Zustand.\n\nA useful mental model is:\n\n```text\nServer state\n    ↓\nTanStack Query\n\nClient/application state\n    ↓\nZustand\n\nLocal component state\n    ↓\nuseState\n```\n\nThis separation keeps state architecture easier to reason about.",
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
      "id": "rn45-21",
      "title": "A practical modern stack",
      "durationMinutes": 2,
      "explanation": "A reasonable 2026 React Native stack can look like:\n\n```text\n┌──────────────────────────────┐\n│ React Native + Expo          │\n├──────────────────────────────┤\n│ Expo Router                  │\n├──────────────────────────────┤\n│ TypeScript                   │\n├──────────────────────────────┤\n│ NativeWind / StyleSheet      │\n├──────────────────────────────┤\n│ TanStack Query               │\n├──────────────────────────────┤\n│ Zustand                      │\n├──────────────────────────────┤\n│ Reanimated                   │\n├──────────────────────────────┤\n│ EAS Build / Submit / Update  │\n├──────────────────────────────┤\n│ Sentry / observability       │\n└──────────────────────────────┘\n```\n\nBut don't interpret this as:\n\n> \"These are mandatory.\"\n\nA senior engineer chooses dependencies based on requirements.",
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
      "id": "rn45-22",
      "title": "The most important skill: upgrading old projects",
      "durationMinutes": 2,
      "explanation": "Suppose you inherit:\n\n```text\nReact Native 0.71\n```\n\nDon't immediately run:\n\n```bash\nnpm install react-native@latest\n```\n\nFirst inspect.",
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
      "id": "rn45-23",
      "title": "Upgrade checklist",
      "durationMinutes": 2,
      "explanation": "### Step 1 — Identify versions\n\nCheck:\n\n```text\nReact Native\nReact\nExpo\nNode\nXcode\nCocoaPods\nAndroid Gradle Plugin\nGradle\nKotlin\n```\n\n---\n\n### Step 2 — Find deprecated APIs\n\nSearch the codebase:\n\n```bash\ngrep -R \"InteractionManager\" .\n```\n\nand search for:\n\n```text\ndeprecated components\ndeprecated props\nold navigation APIs\n```\n\n---\n\n### Step 3 — Search for deep imports\n\nThis is extremely important.\n\nSearch for:\n\n```text\nreact-native/Libraries/\nreact-native/src/private/\n```\n\nFor example:\n\n```ts\nimport something from \"react-native/Libraries/...\";\n```\n\nMark every occurrence.\n\nThen find the supported public API replacement.\n\nReact Native 0.87 explicitly removes deep imports under the Strict TypeScript API. ([React Native][1])",
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
      "id": "rn45-24",
      "title": "Step 4 — Audit native dependencies",
      "durationMinutes": 2,
      "explanation": "Check every React Native dependency.\n\nAsk:\n\n```text\nDoes it support the New Architecture?\n\nIs it maintained?\n\nDoes it support current RN?\n\nDoes it support current iOS?\n\nDoes it support current Android?\n\nDoes it use deprecated native APIs?\n\nDoes it require old CocoaPods behavior?\n```\n\nDon't assume:\n\n```text\nnpm package exists\n=\npackage works with current RN\n```",
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
      "id": "rn45-25",
      "title": "Step 5 — Check TypeScript",
      "durationMinutes": 2,
      "explanation": "Run:\n\n```bash\nnpx tsc --noEmit\n```\n\nStrict TypeScript API migration can expose type assumptions that older versions allowed.\n\nFor example:\n\n```text\nOld type\n  ↓\nDeprecated alias\n  ↓\nNew strict API\n  ↓\nCompilation error\n```\n\nThat compilation error is useful.\n\nIt tells you:\n\n> \"This code was depending on something outside the modern public API.\"",
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
      "id": "rn45-26",
      "title": "Step 6 — Check refs",
      "durationMinutes": 2,
      "explanation": "One important Strict API migration area is refs.\n\nModern types can use instance types such as:\n\n```ts\nViewInstance\nTextInputInstance\n```\n\ninstead of relying on older shapes.\n\nSo old code like:\n\n```ts\nuseRef<View>(null)\n```\n\nmay require reconsideration depending on the exact API being used.\n\nThe migration should follow the current Strict TypeScript API documentation rather than blindly changing every ref in the project. ([Expo][4])",
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
      "id": "rn45-27",
      "title": "Step 7 — Upgrade native dependencies",
      "durationMinutes": 2,
      "explanation": "After JavaScript dependencies:\n\n```text\niOS\n↓\nPods / SwiftPM\n↓\nXcode build\n\nAndroid\n↓\nGradle\n↓\nKotlin\n↓\nAGP\n↓\nBuild\n```\n\nTest native builds separately.",
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
      "id": "rn45-28",
      "title": "Step 8 — Test real application behavior",
      "durationMinutes": 2,
      "explanation": "Compilation isn't enough.\n\nTest:\n\n```text\nLaunch\nAuthentication\nNavigation\nDeep links\nPush notifications\nPermissions\nCamera\nLocation\nPayments\nBackground/foreground\nOffline mode\nAnimations\nForms\nKeyboard\nAccessibility\n```\n\nAn upgrade is successful when the **application** works, not merely when TypeScript compiles.",
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
      "id": "rn45-29",
      "title": "Step 9 — Check production behavior",
      "durationMinutes": 2,
      "explanation": "Before releasing:\n\n```text\nCrash reporting\nStartup time\nANRs\nMemory\nNavigation\nNative crashes\nNetwork\nOTA compatibility\n```\n\nRemember what you learned on Days 30–40.\n\nThe upgrade process uses almost everything you've learned in this course.",
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
      "id": "rn45-30",
      "title": "Old tutorial audit",
      "durationMinutes": 2,
      "explanation": "Now let's say you find a tutorial from 2022.\n\nIt says:\n\n```ts\nimport Something from \"react-native/Libraries/...\";\n```\n\n🚨 Investigate.\n\nIt says:\n\n```text\nEnable New Architecture\n```\n\n🚨 Check whether your current version still treats it as an optional architecture.\n\nIt says:\n\n```text\nUse Flipper for debugging\n```\n\n🚨 Check the current debugging workflow.\n\nIt says:\n\n```text\nUse InteractionManager\n```\n\n🚨 Check the modern replacement.\n\nIt says:\n\n```text\nUse deprecated StatusBar props\n```\n\n🚨 Check the current API.\n\nIt says:\n\n```text\nUse old Expo Router imports\n```\n\n🚨 Check the current Expo SDK migration documentation.\n\nThe point is not to automatically say:\n\n> \"Old tutorial = bad.\"\n\nInstead:\n\n> **Old tutorial = evidence that must be verified against the current API.**",
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
      "id": "rn45-31",
      "title": "A senior developer's tutorial filter",
      "durationMinutes": 2,
      "explanation": "When reading an old tutorial, ask:\n\n### Question 1\n\nWhen was it published?\n\n### Question 2\n\nWhat React Native version does it target?\n\n### Question 3\n\nWhat Expo SDK does it target?\n\n### Question 4\n\nDoes it use public APIs?\n\n### Question 5\n\nDoes it use deep imports?\n\n### Question 6\n\nDoes it assume the Legacy Architecture?\n\n### Question 7\n\nDoes it use deprecated APIs?\n\n### Question 8\n\nAre the native dependencies maintained?\n\n### Question 9\n\nDoes the current documentation recommend the same approach?\n\n### Question 10\n\nCan I reproduce the example on the current toolchain?\n\nThat's the skill you should leave this course with.",
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
      "id": "rn45-32",
      "title": "Your mental model after 45 days",
      "durationMinutes": 2,
      "explanation": "You started with:\n\n```text\nReact\n↓\nComponents\n↓\nScreens\n```\n\nYou should now think:\n\n```text\n                        React Native App\n                              │\n         ┌────────────────────┼────────────────────┐\n         ▼                    ▼                    ▼\n      React UI            App State            Server State\n         │                    │                    │\n         ▼                    ▼                    ▼\n      Fabric              Zustand           TanStack Query\n         │\n         ▼\n  Native Platform\n     │        │\n    iOS    Android\n     │        │\n  Swift     Kotlin\n     │        │\n     └────┬───┘\n          ▼\n    TurboModules\n          │\n          ▼\n      OS / Hardware\n```\n\nAround that:\n\n```text\nTesting\nPerformance\nSecurity\nObservability\nCI/CD\nOTA\nApp Stores\nArchitecture\nUpgrades\n```\n\nThat is what production React Native engineering looks like.\n\n---\n\n# Key Takeaways\n\n* React Native is moving toward a smaller, more stable public API.\n* React Native 0.87 makes the Strict TypeScript API the default. ([React Native][1])\n* Deep imports are a major migration warning sign.\n* Deprecated APIs should be replaced rather than carried forward.\n* Swift Package Manager is worth learning and watching, but experimental support is not a reason to migrate every production app immediately. ([React Native][1])\n* Expo SDK 58 is currently in beta and targets React Native 0.88 RC and iOS 27. ([Expo][4])\n* Expo Router is also evolving, especially around navigation internals and custom navigators. ([Expo][4])\n* React Native and Flutter have different rendering models and ecosystem trade-offs; neither should be reduced to a simple \"faster/slower\" comparison. ([Primeline][5])\n* NativeWind, TanStack Query, and Zustand are useful ecosystem choices, not mandatory dependencies.\n* A senior React Native developer needs to know how to **evaluate and upgrade** an application, not just create one.\n\n---\n\n# Common Mistakes\n\n### 1. Treating the latest version as automatically better\n\nLatest doesn't mean:\n\n```text\nupgrade immediately\n```\n\nCheck compatibility first.\n\n### 2. Blindly following old tutorials\n\nAlways verify:\n\n```text\nRN version\nExpo version\nAPI\nnative dependencies\narchitecture\n```\n\n### 3. Using private APIs\n\nIf you see:\n\n```text\nreact-native/Libraries/...\n```\n\ninvestigate.\n\n### 4. Updating only package.json\n\nNative applications have more moving pieces.\n\n### 5. Assuming Strict TypeScript means \"just fix TypeScript errors\"\n\nThe errors may reveal that your application depends on an API that isn't part of the supported public surface.\n\n### 6. Chasing every new tool\n\nYou don't need:\n\n```text\nNew library\nNew state manager\nNew styling system\nNew navigation package\n```\n\nevery month.\n\nUnderstand the problem first.\n\n### 7. Comparing React Native and Flutter using one benchmark\n\nPerformance depends heavily on:\n\n```text\nworkload\ndevice\nrendering model\napplication architecture\nimplementation\n```\n\n---\n\n# Mini Quiz\n\n**1. What is one major purpose of the Strict TypeScript API?**\n\nA. Make React Native apps look better\nB. Define a more controlled and future-proof public API\nC. Replace Hermes\nD. Replace Expo\n\n**Answer:** B\n\n---\n\n**2. What is a major warning sign when reviewing an old React Native project?**\n\nA. TypeScript\nB. Components\nC. Deep imports into `react-native/Libraries/*`\nD. `StyleSheet`\n\n**Answer:** C\n\n---\n\n**3. What is Swift Package Manager?**\n\nA. A React state manager\nB. Apple's native package-management system\nC. A React Native bundler\nD. An Android build system\n\n**Answer:** B\n\n---\n\n**4. Is experimental SwiftPM support a reason to immediately migrate every production application?**\n\nNo.\n\nYou should evaluate dependency compatibility, CI, build behavior, and migration cost first.\n\n---\n\n**5. What does TanStack Query primarily manage?**\n\nServer state such as:\n\n```text\nAPI data\ncaching\nrefetching\nloading\nerrors\ninvalidation\n```\n\n---\n\n**6. What does Zustand primarily provide?**\n\nClient/application state management.\n\n---\n\n**7. Why can an old tutorial still contain useful information?**\n\nBecause the underlying concept may still be correct even if the implementation/API has changed.",
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
      "question": "What direction is React Native's public API moving toward?",
      "options": [
        "A. A smaller and more stable supported surface",
        "B. More private deep imports",
        "C. No TypeScript",
        "D. JavaScript-only rendering"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does React Native 1.0 represent conceptually?",
      "options": [
        "A. A maturity and stability milestone rather than the end of change",
        "B. A complete rewrite in Flutter",
        "C. The removal of native code",
        "D. A new state manager"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is the New Architecture status in modern React Native?",
      "options": [
        "A. It is the normal direction that libraries and applications should support",
        "B. It should always be disabled",
        "C. It is only for web",
        "D. It replaces Metro"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a major warning sign in an old project?",
      "options": [
        "A. Deep imports into React Native internal paths",
        "B. Using public components",
        "C. Using TypeScript",
        "D. Writing tests"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is Swift Package Manager?",
      "options": [
        "A. Apple's native dependency-management system",
        "B. A React state library",
        "C. An Android build tool",
        "D. A JavaScript bundler"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should determine whether React Native or Flutter fits a product?",
      "options": [
        "A. Rendering needs, ecosystem, team skills, platform integration, and product constraints",
        "B. One synthetic benchmark",
        "C. Logo preference",
        "D. Package download count only"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does TanStack Query primarily manage?",
      "options": [
        "A. Server state and its fetching, caching, and invalidation lifecycle",
        "B. Native UI rendering",
        "C. Build signing",
        "D. Navigation routes"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does Zustand primarily manage?",
      "options": [
        "A. Client and application state",
        "B. App Store metadata",
        "C. Native crash symbols",
        "D. Android permissions"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should an upgrade audit examine?",
      "options": [
        "A. Framework versions, public APIs, native dependencies, architecture, types, and production behavior",
        "B. Only package.json",
        "C. Only JavaScript syntax",
        "D. Only screenshots"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why can an old tutorial still be useful?",
      "options": [
        "A. Its underlying concept may remain valid even when the API has changed",
        "B. Every old API remains supported",
        "C. Versions never matter",
        "D. Private imports are stable"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "The Upgrade Audit",
    "goal": "Audit and modernize an old React Native tutorial or project.",
    "brief": "Take an old React Native tutorial or an old React Native project.\n\nIdeally choose something from the **pre-New-Architecture era**.\n\nThen perform a complete audit.\n\n### Step 1 — Identify the age\n\nDocument:\n\n```text\nTutorial/project date:\nReact Native version:\nExpo version:\nReact version:\n```\n\n### Step 2 — Find outdated APIs\n\nLook for:\n\n```text\nDeprecated APIs\nRemoved APIs\nOld navigation APIs\nOld debugging tools\nLegacy Architecture assumptions\n```\n\n### Step 3 — Find deep imports\n\nSearch for:\n\n```text\nreact-native/Libraries/\nreact-native/src/private/\n```\n\nDocument every occurrence.\n\n### Step 4 — Audit TypeScript\n\nIdentify:\n\n```text\nOld types\nDeprecated aliases\nRef assumptions\nPrivate types\nStrict API incompatibilities\n```\n\nReact Native's current Strict API documentation provides specific migration examples and replacement types. ([React Native][2])\n\n### Step 5 — Audit native dependencies\n\nFor each dependency:\n\n```text\nCurrent?\nMaintained?\nNew Architecture compatible?\nCurrent iOS compatible?\nCurrent Android compatible?\n```\n\n### Step 6 — Create the migration plan\n\nYour document should look roughly like:\n\n```text\nOld code\n  ↓\nWhy it is outdated\n  ↓\nCurrent replacement\n  ↓\nMigration required?\n  ↓\nTesting required\n```\n\n### Final acceptance criteria\n\n```text\n[ ] Identified target RN/Expo version\n[ ] Identified deprecated APIs\n[ ] Identified removed APIs\n[ ] Found deep imports\n[ ] Identified Legacy Architecture assumptions\n[ ] Audited native dependencies\n[ ] Identified Strict TypeScript API breakages\n[ ] Proposed modern replacements\n[ ] Tested at least one migration\n[ ] Documented remaining risks\n```\n\n---\n\n# Final Self-Check\n\nTake one genuinely old example:\n\n```tsx\nimport Something from \"react-native/Libraries/SomeInternalFile\";\n\nInteractionManager.runAfterInteractions(() => {\n // ...\n});\n```\n\nDon't just say:\n\n> \"This is old.\"\n\nExplain **why**.\n\nFor example:\n\n```text\n1. This is a deep import.\n2. It depends on a private React Native implementation.\n3. Modern Strict TypeScript API blocks this class of import.\n4. Find the supported public API.\n5. InteractionManager was removed in RN 0.87.\n6. requestIdleCallback is the modern direction.\n7. Test behavior after replacement.\n```\n\nThat is the level of thinking you should have after Day 45.\n\n## The final lesson of the entire course\n\nThe goal of these 45 days was never:\n\n> \"Memorize React Native.\"\n\nIt was to get you to the point where you can encounter an unfamiliar React Native application and ask:\n\n```text\nHow does this work?\n       ↓\nWhere does the code run?\n       ↓\nIs this JavaScript or native?\n       ↓\nIs this public API?\n       ↓\nHow is it tested?\n       ↓\nHow does it behave in production?\n       ↓\nWhat happens when iOS/Android changes?\n       ↓\nCan I safely upgrade it?\n       ↓\nCan I debug it when it breaks?\n```\n\nOnce you can answer those questions, you're no longer just learning React Native—you can **own a production React Native system**.\n\n[1]: https://reactnative.dev/blog/2026/08/11/react-native-0.87?utm_source=chatgpt.com \"React Native 0.87 - Strict TypeScript API, Metro Update, Swift Package Manager, AGP 9 Support · React Native\"\n[2]: https://reactnative.dev/docs/strict-typescript-api?utm_source=chatgpt.com \"Strict TypeScript API · React Native\"\n[3]: https://blog.cocoapods.org/?utm_source=chatgpt.com \"CocoaPods Blog\"\n[4]: https://expo.dev/changelog/sdk-58-beta?utm_source=chatgpt.com \"Expo SDK 58 Beta is now available — Expo changelog\"\n[5]: https://www.primeline.dev/blog/react-native-vs-flutter?utm_source=chatgpt.com \"React Native vs Flutter in 2026 — the honest comparison · Primeline\"",
    "steps": [],
    "acceptance": [
      "Identified target RN/Expo version",
      "Identified deprecated APIs",
      "Identified removed APIs",
      "Found deep imports",
      "Identified Legacy Architecture assumptions",
      "Audited native dependencies",
      "Identified Strict TypeScript API breakages",
      "Proposed modern replacements",
      "Tested at least one migration",
      "Documented remaining risks"
    ],
    "footer": "The goal is not to memorize React Native. It is to understand, test, operate, debug, and safely upgrade a production React Native system."
  }
});

