import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_PHASE_0_LESSONS = normalizePastedLessonDay({
  "day": 0,
  "title": "Phase 0 — Before You Start",
  "overview": "**Not part of the 45 days.**\n\nReact Native assumes you already understand React, modern JavaScript/TypeScript, and basic mobile development concepts. This phase is a **readiness check**, not another full learning track.\n\nYou do not need to be an expert in everything below. You should be comfortable enough that when the 45-day course introduces a React Native concept, you can focus on **React Native itself** instead of stopping to learn the underlying React or JavaScript concept.",
  "totalMinutes": 60,
  "difficulty": "Beginner",
  "lessons": [
    {
      "id": "rn-phase-0-1",
      "title": "React — You Must Already Know",
      "durationMinutes": 6,
      "explanation": "React Native uses React's programming model. If React itself is still shaky, React Native will feel unnecessarily confusing.\n\nYou should already be comfortable with:\n\n### Components and JSX\n\n* Functional components\n* JSX syntax\n* Expressions inside JSX\n* Conditional rendering\n* Component composition\n* Props\n* `children`\n* Reusable components\n\nYou should understand the difference between:\n\n```text\nComponent\n   ↓\nProps\n   ↓\nRendered UI\n```\n\nand:\n\n```text\nComponent\n   ↓\nState changes\n   ↓\nRe-render\n   ↓\nUpdated UI\n```\n\n### State and Effects\n\nYou should be comfortable using:\n\n* `useState`\n* `useEffect`\n* `useRef`\n* `useMemo`\n* `useCallback`\n\nMore importantly, you should understand **why** you are using them.\n\nFor example:\n\n* `useState` → component state that affects rendering\n* `useRef` → persistent mutable value that does not trigger a render\n* `useEffect` → synchronize with something outside React\n* `useMemo` → cache a calculated value\n* `useCallback` → cache a function reference\n\nYou should also understand that `useEffect` is **not** a general-purpose place to put code that happens after rendering.\n\nThe 45-day track will build on this understanding when dealing with:\n\n* App lifecycle\n* subscriptions\n* networking\n* native APIs\n* permissions\n* cleanup\n* performance\n\n### Context\n\nYou should know:\n\n* How React Context works\n* How to create a context\n* How to consume context\n* When Context is useful\n* When Context is the wrong tool\n\nYou should understand that Context is not automatically a global state-management solution.\n\nFor example:\n\n```text\nGood candidates\n├── Theme\n├── Authentication context\n└── Locale\n\nPotentially poor candidates\n├── Frequently changing large collections\n├── Complex server state\n└── Everything in the application\n```\n\nThe goal is to understand **why** you would choose Context rather than simply knowing its API.\n\n### Lists and Keys\n\nYou should understand:\n\n* Rendering arrays\n* `map()`\n* `key`\n* Stable keys\n* Why array indexes can be problematic as keys\n* Why React uses keys to identify component instances\n\nThis becomes especially important in React Native because mobile applications frequently contain:\n\n* `FlatList`\n* `SectionList`\n* Infinite lists\n* Virtualized content\n\n### Controlled and Uncontrolled Inputs\n\nYou should understand the difference between:\n\n```text\nControlled\nReact state → input value\ninput event → React state\n```\n\nand:\n\n```text\nUncontrolled\nInput manages its own current value\nReact accesses it when needed\n```\n\nYou should be comfortable with:\n\n* Input state\n* `value`\n* `onChange`\n* `ref`\n* Form validation\n* When controlled inputs are appropriate\n\n### Custom Hooks\n\nYou should be able to create and use custom hooks such as:\n\n```ts\nfunction useOnlineStatus() {\n  // reusable stateful logic\n}\n```\n\nYou should understand that a custom hook shares **logic**, not component UI.\n\n---\n\n## React 19 Awareness\n\nYou do not need deep expertise in every React 19 feature before starting.\n\nYou should, however, know that modern React includes APIs and patterns such as:\n\n* `useEffectEvent`\n* `useActionState`\n* `useOptimistic`\n* `useTransition`\n* Suspense-based data fetching\n\nThe goal at this stage is **awareness**, not mastery.\n\nThe React Native track will revisit the relevant concepts specifically in the context of mobile applications, including how asynchronous work, rendering, transitions, and data loading affect the user experience.\n\nYou will go deeper into these topics later in the track.",
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
      "id": "rn-phase-0-2",
      "title": "JavaScript / TypeScript — You Must Already Know",
      "durationMinutes": 6,
      "explanation": "React Native is not a replacement for JavaScript or TypeScript knowledge.\n\nYou should already be comfortable with the JavaScript fundamentals covered by the **Node.js track's Phase 0 prerequisites**.\n\nAt minimum, you should be comfortable with:\n\n* Variables and scope\n* Functions\n* Objects and arrays\n* Destructuring\n* Spread/rest syntax\n* Array methods\n* Modules\n* Classes and prototypes at a basic level\n* Closures\n* Error handling\n* Modern ES syntax\n* TypeScript fundamentals\n* Generics at a basic level\n* Interfaces/types\n* Union types\n* Type narrowing\n\nYou do not need to memorize every JavaScript API.\n\nYou do need to be able to read and write modern TypeScript without fighting the language itself.\n\n---\n\n## Promises and Async/Await\n\nThis is especially important.\n\nReact Native applications constantly perform asynchronous work:\n\n```text\nUser action\n    ↓\nAPI request\n    ↓\nWaiting\n    ↓\nResponse\n    ↓\nUpdate state\n    ↓\nRender UI\n```\n\nYou should understand:\n\n* Promises\n* `then()`\n* `catch()`\n* `finally()`\n* `async`\n* `await`\n* `try/catch`\n* Promise rejection\n* Parallel promises with `Promise.all()`\n* Basic cancellation concepts\n\nYou should be able to understand code such as:\n\n```ts\nasync function loadUser() {\n  try {\n    const response = await fetch(\"/api/user\");\n    const user = await response.json();\n\n    return user;\n  } catch (error) {\n    throw error;\n  }\n}\n```\n\nYou should understand what happens while the request is waiting rather than thinking the JavaScript thread simply stops.\n\nThe 45-day track will build on this when covering:\n\n* Networking\n* Offline support\n* App lifecycle\n* Request cancellation\n* Authentication\n* Background behavior\n* Data synchronization\n\n---\n\n## JSON\n\nYou should be comfortable with:\n\n```ts\nJSON.stringify()\nJSON.parse()\n```\n\nand with the common API pattern:\n\n```text\nHTTP response\n      ↓\nJSON\n      ↓\nJavaScript object\n      ↓\nTypeScript model\n      ↓\nApplication state\n      ↓\nUI\n```\n\nYou should understand that JSON itself does not contain TypeScript types.\n\nFor example:\n\n```json\n{\n  \"id\": 123,\n  \"name\": \"Rajan\"\n}\n```\n\ndoes not automatically guarantee that the server will always return the expected structure.\n\nThe React Native track will later build on this when discussing API validation, networking, authentication, caching, and error handling.",
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
      "id": "rn-phase-0-3",
      "title": "Mobile Basics — You Must Already Know",
      "durationMinutes": 6,
      "explanation": "You do not need previous mobile-development experience.\n\nYou **do** need to understand the basic vocabulary.\n\n---\n\n## Simulator vs Emulator vs Real Device\n\nUnderstand the difference between:\n\n### iOS Simulator\n\nRuns an iOS environment on your Mac.\n\n```text\nMac\n │\n └── iOS Simulator\n       └── Your application\n```\n\n### Android Emulator\n\nRuns an Android virtual device on your computer.\n\n```text\nComputer\n │\n └── Android Emulator\n       └── Your application\n```\n\n### Real Device\n\nThe application runs on actual hardware.\n\n```text\nPhysical iPhone / Android\n        ↓\nActual CPU\nActual GPU\nActual memory\nActual sensors\nActual network\nActual battery\n```\n\nA simulator or emulator is extremely useful, but it is **not the same thing as real hardware**.\n\nThe 45-day track will repeatedly distinguish between:\n\n```text\nWorks in simulator\n        ≠\nWorks correctly on a real device\n```",
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
      "id": "rn-phase-0-4",
      "title": "iOS and Android Are Different Platforms",
      "durationMinutes": 6,
      "explanation": "Do not approach React Native with this mental model:\n\n```text\nReact Native\n      ↓\nOne platform with two skins\n```\n\nInstead:\n\n```text\n                 React Native\n                      │\n             ┌────────┴────────┐\n             │                 │\n            iOS             Android\n             │                 │\n       Apple platform    Google platform\n             │                 │\n        Swift/Obj-C       Kotlin/Java\n        Xcode             Gradle\n        CocoaPods/        Android SDK\n        SwiftPM\n```\n\nThey have different:\n\n* Operating systems\n* Application lifecycles\n* Native APIs\n* Permission systems\n* Build systems\n* UI conventions\n* Navigation behavior\n* Background behavior\n* Notification systems\n* Security models\n* Debugging tools\n* Store requirements\n\nReact Native provides a common programming model, but it does not eliminate these platform differences.\n\nYou will learn how to work with those differences throughout the track.",
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
      "id": "rn-phase-0-5",
      "title": "App Lifecycle — At a Glance",
      "durationMinutes": 6,
      "explanation": "Before starting, understand these basic terms:\n\n### Foreground\n\nThe application is currently active and visible to the user.\n\n```text\nApp\n ↓\nVisible\n ↓\nUser interacting\n```\n\n### Background\n\nThe application is no longer actively visible.\n\nThe operating system may restrict what it can do.\n\n```text\nApp\n ↓\nBackground\n ↓\nOS controls available resources\n```\n\n### Killed / Terminated\n\nThe application process is no longer running.\n\n```text\nApp\n ↓\nProcess terminated\n ↓\nNo JavaScript is currently running\n```\n\nThis distinction becomes extremely important.\n\nFor example:\n\n```text\nForeground\n    ↓\nBackground\n    ↓\nKilled\n    ↓\nUser opens app again\n```\n\nThe application cannot assume that the previous JavaScript process is still alive.\n\nDay 9 will go much deeper into:\n\n* `AppState`\n* Cold starts\n* Warm starts\n* Background transitions\n* Process termination\n* State restoration\n* Notifications launching the app\n* Deep links launching the app\n* Network requests interrupted by lifecycle changes\n\nFor Phase 0, you only need to understand the basic vocabulary.",
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
      "id": "rn-phase-0-6",
      "title": "Tools — You Must Have Ready",
      "durationMinutes": 6,
      "explanation": "You should be comfortable with basic development tooling before starting.\n\n## Git\n\nYou should know how to:\n\n```bash\ngit clone\ngit status\ngit add\ngit commit\ngit pull\ngit push\ngit checkout\ngit switch\ngit branch\n```\n\nYou should also understand:\n\n* Branches\n* Pull requests\n* Merge conflicts at a basic level\n* `.gitignore`\n\nYou do not need advanced Git knowledge.",
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
      "id": "rn-phase-0-7",
      "title": "Terminal",
      "durationMinutes": 4,
      "explanation": "You should be comfortable navigating a project from the command line.\n\nYou should know commands such as:\n\n```bash\ncd\nls\npwd\nmkdir\nrm\ncp\nmv\ncat\n```\n\nand understand how to:\n\n* Run npm/pnpm/yarn commands\n* Install dependencies\n* Start development servers\n* Read command output\n* Stop running processes\n* Set basic environment variables\n\nThe goal is simple:\n\n> The terminal should feel normal, not intimidating.",
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
      "id": "rn-phase-0-8",
      "title": "Xcode — macOS Only",
      "durationMinutes": 4,
      "explanation": "If you want to build for iOS, you need a Mac.\n\nYou should have:\n\n* Xcode installed\n* Xcode Command Line Tools configured\n* At least one iOS Simulator available\n* A basic understanding of where Xcode fits into React Native development\n\nYou do **not** need to know Swift or advanced Xcode development yet.\n\nThe 45-day track will teach you progressively about:\n\n* Xcode projects\n* iOS native code\n* Build configuration\n* Signing\n* Provisioning\n* Native debugging\n* CocoaPods / Swift Package Manager\n* iOS release builds",
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
      "id": "rn-phase-0-9",
      "title": "Android Studio",
      "durationMinutes": 4,
      "explanation": "You should have:\n\n* Android Studio installed\n* Android SDK configured\n* At least one Android Emulator created\n* A working Android build environment\n\nYou do not need to know Kotlin or advanced Gradle configuration yet.\n\nThe course will introduce those gradually when you reach the native Android sections.",
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
      "id": "rn-phase-0-10",
      "title": "Your Environment Should Actually Run",
      "durationMinutes": 4,
      "explanation": "Before Day 1, verify that your development environment works.\n\nYou should be able to:\n\n```text\n                React Native project\n                       │\n             ┌─────────┴─────────┐\n             │                   │\n          iOS Simulator      Android Emulator\n             │                   │\n             └─────────┬─────────┘\n                       │\n                 App launches\n```\n\nAt minimum:\n\n* Create/open a React Native project\n* Start Metro\n* Launch the iOS simulator if using macOS\n* Launch an Android emulator\n* Run the application\n* Make a small code change\n* See the change reflected in the application\n* Stop and restart the development environment\n\nIf the project cannot run before Day 1, fixing the environment should come **before** starting the actual lessons.",
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
      "id": "rn-phase-0-11",
      "title": "Final Readiness Check",
      "durationMinutes": 4,
      "explanation": "You are ready for the 45-day React Native track if you can comfortably answer **yes** to these questions:\n\n### React\n\n* Can I create a functional component?\n* Do I understand JSX?\n* Can I pass and use props?\n* Do I understand `children`?\n* Can I use `useState`?\n* Do I understand when an effect is actually needed?\n* Do I understand `useRef`?\n* Do I know the purpose of `useMemo` and `useCallback`?\n* Can I create a custom hook?\n* Do I understand Context and when not to use it?\n* Do I understand keys in lists?\n* Do I understand controlled inputs?\n\n### JavaScript / TypeScript\n\n* Can I comfortably read modern TypeScript?\n* Do I understand Promises?\n* Can I use `async/await`?\n* Can I handle rejected Promises?\n* Do I understand `try/catch`?\n* Can I work with JSON?\n* Can I work with arrays, objects, destructuring, and modules?\n\n### Mobile\n\n* Do I understand simulator vs emulator vs real device?\n* Do I understand that iOS and Android have different native platforms?\n* Do I understand foreground, background, and killed states?\n\n### Tools\n\n* Can I use Git without constantly looking up basic commands?\n* Am I comfortable in the terminal?\n* Is Xcode installed if I am targeting iOS?\n* Is Android Studio installed?\n* Can I launch at least one simulator/emulator?\n* Can I run a React Native application successfully?",
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
      "id": "rn-phase-0-12",
      "title": "If Your React Is Shaky",
      "durationMinutes": 4,
      "explanation": "Stop here and strengthen React first.\n\nReact Native is **not** the place to learn React fundamentals for the first time.\n\nYou don't need to know every advanced React feature before starting, but you should be comfortable with the core mental model:\n\n```text\nState / Props\n      ↓\n   Render\n      ↓\nReact reconciles changes\n      ↓\nReact Native updates\nnative UI\n```\n\nOnce that mental model is solid, the React Native track becomes much easier because you can focus on what actually makes mobile development different:\n\n```text\nReact\n  +\nNative platforms\n  +\nMobile lifecycle\n  +\nNetworking\n  +\nStorage\n  +\nNative APIs\n  +\nPerformance\n  +\nSecurity\n  +\nTesting\n  +\nDeployment\n```\n\n**Phase 0 is complete when the foundations stop being the thing you are learning. The 45 days should then be about becoming a React Native engineer.**",
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
      "question": "What should Phase 0 help you verify?",
      "options": [
        "That your React, TypeScript, mobile, and tooling foundations are ready",
        "That you have published an app",
        "That you know every native API",
        "That you have mastered Swift"
      ],
      "correctIndex": 0,
      "explanation": "Phase 0 is a readiness check for the foundations used throughout the track."
    },
    {
      "question": "What is `useEffect` primarily for?",
      "options": [
        "Formatting JSX",
        "Synchronizing with something outside React",
        "Replacing every event handler",
        "Creating component props"
      ],
      "correctIndex": 1,
      "explanation": "Effects synchronize React with external systems."
    },
    {
      "question": "What does a custom hook share?",
      "options": [
        "Rendered UI",
        "Native binaries",
        "Reusable stateful logic",
        "App-store metadata"
      ],
      "correctIndex": 2,
      "explanation": "Custom hooks share logic, not component UI."
    },
    {
      "question": "What happens while an awaited request is pending?",
      "options": [
        "The entire device stops",
        "JavaScript permanently exits",
        "The Promise remains pending and later settles",
        "TypeScript validates the response"
      ],
      "correctIndex": 2,
      "explanation": "Await pauses that async function until the Promise settles without stopping the device."
    },
    {
      "question": "Does JSON automatically contain TypeScript type guarantees?",
      "options": [
        "Only on Android",
        "Yes",
        "Only in development",
        "No"
      ],
      "correctIndex": 3,
      "explanation": "JSON is runtime data and must be validated when correctness matters."
    },
    {
      "question": "Why must you test on a real device?",
      "options": [
        "Real hardware exposes actual sensors, performance, networking, and battery behavior",
        "Simulators cannot render text",
        "Metro only runs on phones",
        "TypeScript requires it"
      ],
      "correctIndex": 0,
      "explanation": "Virtual devices do not fully reproduce real hardware behavior."
    },
    {
      "question": "How should you think about iOS and Android?",
      "options": [
        "As one platform with two skins",
        "As different native platforms behind a shared React programming model",
        "As identical build systems",
        "As browser targets"
      ],
      "correctIndex": 1,
      "explanation": "React Native shares code without erasing native platform differences."
    },
    {
      "question": "What does killed or terminated mean?",
      "options": [
        "The app is visible",
        "The app is minimized but fully active",
        "The application process is no longer running",
        "The network is offline"
      ],
      "correctIndex": 2,
      "explanation": "No JavaScript from that process is running after termination."
    },
    {
      "question": "What should work before Day 1?",
      "options": [
        "Only Git status",
        "A React Native app should launch and reflect a small code change",
        "A production store release",
        "A custom native module"
      ],
      "correctIndex": 1,
      "explanation": "A working development baseline keeps setup problems out of the lessons."
    },
    {
      "question": "What should you do if React fundamentals are still shaky?",
      "options": [
        "Skip directly to native modules",
        "Memorize Xcode menus",
        "Strengthen React before continuing",
        "Avoid hooks"
      ],
      "correctIndex": 2,
      "explanation": "The track assumes React's core mental model is already comfortable."
    }
  ],
  "project": {
    "name": "React Native Readiness Check",
    "goal": "Prove that your environment and prerequisite knowledge are ready before Day 1.",
    "brief": "Complete the readiness check in the lesson, then run a React Native application on every simulator or emulator available to you.",
    "steps": [
      "Create a small component using props, state, a list, and an event handler.",
      "Write one asynchronous TypeScript function with explicit error handling.",
      "Start Metro and launch the application in an iOS Simulator on macOS or an Android Emulator.",
      "Make a small code change and verify that it appears in the running application.",
      "Commit your readiness notes with Git."
    ],
    "acceptance": [
      "You can explain the React concepts in the readiness checklist.",
      "You can work with Promises, async/await, JSON, and basic TypeScript.",
      "You understand simulator, emulator, real-device, and lifecycle vocabulary.",
      "Your React Native application launches and updates successfully.",
      "Git and the terminal are ready for daily use."
    ]
  }
});
