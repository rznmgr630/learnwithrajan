import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_30_LESSONS = normalizePastedLessonDay({
  "day": 30,
  "title": "Debugging and DevTools",
  "overview": "**Goal:** By the end of this day, you should be able to debug a React Native application using React Native DevTools, Metro, Hermes, Xcode, and `adb logcat`, and diagnose a crash without adding `console.log()` everywhere.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn30-1",
      "title": "What does debugging actually mean?",
      "durationMinutes": 3,
      "explanation": "Debugging simply means finding out:\n\n> **Why did the application do something I didn't expect?**\n\nFor example:\n\n```text\nYou tap Login\n     |\n     v\nApp becomes white\n     |\n     v\nSomething went wrong\n```\n\nYour job isn't to immediately change code.\n\nYour job is to answer:\n\n```text\nWhat happened?\n     ↓\nWhere did it happen?\n     ↓\nWhy did it happen?\n     ↓\nWhat is the smallest correct fix?\n```\n\nThis mindset is extremely important.\n\nA common beginner mistake is:\n\n```text\nSomething broke\n    ↓\nChange random code\n    ↓\nTry again\n    ↓\nStill broken\n    ↓\nChange more code\n```\n\nThat's guessing, not debugging.\n\nA better approach is:\n\n```text\nProblem\n ↓\nReproduce\n ↓\nCollect evidence\n ↓\nFind the failing layer\n ↓\nUnderstand the cause\n ↓\nFix\n ↓\nReproduce again\n```",
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
      "id": "rn30-2",
      "title": "React Native DevTools",
      "durationMinutes": 3,
      "explanation": "**React Native DevTools** is the current official debugging experience for React Native applications.\n\nIt gives you tools for inspecting and understanding your running application.\n\nYou can use it to investigate things such as:\n\n```text\nComponents\nProps\nState\nReact renders\nNetwork activity\nConsole errors\nPerformance\nProfiler information\n```\n\nThink of it as your main React-side debugging workspace.\n\n```text\nReact Native application\n       |\n       v\nReact Native DevTools\n       |\n  +----+----+----+\n  |    |    |    |\n  v    v    v    v\nComponents\nConsole\nNetwork\nProfiler\n```\n\n### Important distinction\n\nReact Native DevTools is not the same thing as debugging the native iOS or Android application.\n\nYou still need:\n\n```text\nReact Native DevTools\n       +\nXcode\n       +\nadb logcat\n```\n\nfor serious production debugging.",
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
      "id": "rn30-3",
      "title": "Why did remote JS debugging change?",
      "durationMinutes": 3,
      "explanation": "Older React Native workflows commonly used **remote JavaScript debugging**.\n\nThe basic idea was:\n\n```text\nReact Native app\n     |\n     | JavaScript\n     v\nChrome\n     |\n     v\nJavaScript runs in Chrome\n```\n\nThat sounds convenient, but it changes the environment in which your JavaScript executes.\n\nYour real application might use:\n\n```text\nHermes\n```\n\nwhile remote debugging could execute JavaScript in a browser JavaScript engine.\n\nThat means you could accidentally debug:\n\n```text\nChrome environment\n```\n\ninstead of:\n\n```text\nreal React Native JavaScript environment\n```\n\nThis can make debugging behavior different from what users experience.\n\nModern React Native debugging instead focuses on debugging the actual application environment.\n\nThe important beginner takeaway is:\n\n> **Don't assume that debugging JavaScript in a browser is the same thing as debugging JavaScript inside your React Native application.**",
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
      "id": "rn30-4",
      "title": "What happened to Flipper?",
      "durationMinutes": 3,
      "explanation": "You may encounter older React Native tutorials saying:\n\n> \"Open Flipper to debug React Native.\"\n\nThat advice is increasingly outdated for modern React Native development.\n\nThe modern direction is:\n\n```text\nOld workflow\nReact Native\n   |\n   v\nFlipper\n   |\n   +-- debugging tools\n\n\nModern workflow\nReact Native\n   |\n   v\nReact Native DevTools\n```\n\nThis doesn't mean every Flipper-related tool or plugin suddenly became useless.\n\nIt means you shouldn't build your current React Native debugging workflow around old tutorials that assume Flipper is the primary debugger.",
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
      "id": "rn30-5",
      "title": "Metro — the development server",
      "durationMinutes": 3,
      "explanation": "You have already seen Metro indirectly.\n\nWhen you run:\n\n```bash\nnpx expo start\n```\n\nor a React Native development command, Metro is involved.\n\nMetro is the JavaScript bundler used by React Native.\n\nVery roughly:\n\n```text\nYour source code\n     |\n     v\n   Metro\n     |\n     +-- transforms code\n     +-- resolves modules\n     +-- creates source maps\n     +-- serves bundle\n     |\n     v\nReact Native application\n```\n\nMetro is part of your everyday development loop.",
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
      "id": "rn30-6",
      "title": "Why source maps matter",
      "durationMinutes": 3,
      "explanation": "Suppose the application crashes and the stack trace says:\n\n```text\nat anonymous\nat t\nat n\nat o\n```\n\nThat's not very useful.\n\nYour original source might have been:\n\n```tsx\nfunction LoginScreen() {\n const user = response.data.user;\n return <Text>{user.name}</Text>;\n}\n```\n\nA **source map** helps connect transformed/bundled code back to your original source code.\n\nConceptually:\n\n```text\nBundled code\n   |\n   v\nsource map\n   |\n   v\nOriginal TypeScript/JavaScript\n```\n\nSo instead of:\n\n```text\nbundle.js:1:28491\n```\n\nyou can get something closer to:\n\n```text\nLoginScreen.tsx:42\n```\n\nThat's a huge difference when debugging.",
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
      "id": "rn30-7",
      "title": "Metro's source-map improvements",
      "durationMinutes": 3,
      "explanation": "Modern Metro versions have continued improving source-map generation and development performance.\n\nThe important lesson for you isn't memorizing a specific Metro version number.\n\nThe practical effect is:\n\n```text\nedit code\n  ↓\nMetro transforms code\n  ↓\nsource maps generated\n  ↓\ndebugger can map runtime code\n     back to your source\n```\n\nFaster source-map processing and lower memory usage can make the development/debugging loop feel faster, especially in larger applications.\n\nThink:\n\n> **Metro is not just \"the thing that starts my app.\" It is part of the machinery that makes debugging your source code possible.**",
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
      "id": "rn30-8",
      "title": "Hermes debugging",
      "durationMinutes": 3,
      "explanation": "React Native applications commonly use **Hermes**, a JavaScript engine optimized for React Native.\n\nThe important architecture is:\n\n```text\nYour JS/TS\n   |\n   v\nMetro\n   |\n   v\nHermes\n   |\n   v\nReact Native runtime\n```\n\nWhen something fails in JavaScript, you may see a stack trace involving Hermes.\n\nSource maps help turn that runtime information into something understandable.\n\nFor example:\n\n```text\nHermes stack\n    |\n    v\nsource map\n    |\n    v\nLoginScreen.tsx:42\n```\n\nThat lets you debug your actual source rather than trying to understand minified or transformed code.",
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
      "id": "rn30-9",
      "title": "Reactotron",
      "durationMinutes": 3,
      "explanation": "**Reactotron** is another debugging tool that can be used alongside your React Native development workflow.\n\nIt can provide useful visibility into application behavior such as:\n\n```text\nlogs\nstate\nactions\nnetwork-related information\nevents\n```\n\nThink of it as an optional companion:\n\n```text\nReact Native DevTools\n       |\n       +-- main React debugging\n\nReactotron\n       |\n       +-- additional application visibility\n```\n\nYou don't need Reactotron to understand React Native debugging.\n\nLearn it as an alternative/companion tool, especially when working on projects that already use it.",
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
      "id": "rn30-10",
      "title": "When React Native DevTools isn't enough",
      "durationMinutes": 3,
      "explanation": "Here's an important debugging rule:\n\n> **If the problem happens below JavaScript, look below JavaScript.**\n\nFor example:\n\n```text\nJavaScript problem\n     |\n     v\nReact Native DevTools\n```\n\nBut:\n\n```text\nNative crash\n     |\n     v\nXcode / adb logcat\n```\n\nYour debugging tools should match the layer where the problem occurs.",
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
      "id": "rn30-11",
      "title": "Xcode console",
      "durationMinutes": 3,
      "explanation": "On iOS, Xcode gives you access to native application logs.\n\nFor example:\n\n```text\nReact Native\n    |\n    v\niOS native code\n    |\n    v\nXcode\n    |\n    v\nConsole/logs\n```\n\nThis becomes important when you see:\n\n```text\nnative crash\npermission problem\nSwift/Objective-C error\nnative module failure\niOS lifecycle issue\nsigning/build issue\n```\n\nIf JavaScript looks completely normal but the application suddenly disappears, don't spend an hour staring at React components.\n\nCheck the native logs.",
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
      "id": "rn30-12",
      "title": "`adb logcat`",
      "durationMinutes": 3,
      "explanation": "Android provides a similar native debugging path through:\n\n```bash\nadb logcat\n```\n\n`adb` means **Android Debug Bridge**.\n\nIt lets your computer communicate with an Android device or emulator.\n\nFor example:\n\n```bash\nadb devices\n```\n\nshows connected devices.\n\nThen:\n\n```bash\nadb logcat\n```\n\nshows Android logs.\n\nYou can think of it as:\n\n```text\nReact Native\n     |\n     v\nAndroid runtime\n     |\n     v\nadb logcat\n     |\n     v\nnative logs\n```\n\nThis is especially useful for:\n\n```text\nAndroid crashes\nnative modules\npermissions\nGradle/runtime problems\nmemory issues\nAndroid system errors\n```",
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
      "id": "rn30-13",
      "title": "Finding the correct layer",
      "durationMinutes": 3,
      "explanation": "When something breaks, ask:\n\n```text\nIs JavaScript running?\n       |\n       +-- No ---> native/device logs\n       |\n       +-- Yes\n             |\n             v\n     Is React rendering?\n             |\n       +-----+-----+\n       |           |\n      No          Yes\n       |           |\n    React        UI/event/\n    problem      network problem\n```\n\nThis prevents random debugging.",
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
      "id": "rn30-14",
      "title": "The \"white screen of death\"",
      "durationMinutes": 3,
      "explanation": "One of the most frustrating React Native problems is:\n\n```text\nApp launches\n   |\n   v\nWhite screen\n   |\n   v\nNothing obvious\n```\n\nThere isn't one single cause.\n\nPossible causes include:\n\n```text\nJavaScript exception\nrendering exception\nnavigation problem\nfailed initialization\nbroken import\nnative module crash\nincorrect environment variable\nfailed API initialization\nbad startup state\n```\n\nSo don't immediately assume:\n\n> \"React Native is broken.\"",
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
      "id": "rn30-15",
      "title": "Diagnosing a white screen",
      "durationMinutes": 3,
      "explanation": "Start with the simplest question:\n\n> **Is JavaScript actually running?**\n\nCheck the development logs and React Native DevTools.\n\nIf you find:\n\n```text\nUnable to resolve module\n```\n\nyou have a module/bundling problem.\n\nIf you find:\n\n```text\nCannot read property 'x' of undefined\n```\n\nyou have a JavaScript runtime problem.\n\nIf the JavaScript side looks normal but the application terminates:\n\n```text\ncheck Xcode\ncheck adb logcat\n```",
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
      "id": "rn30-16",
      "title": "A practical white-screen checklist",
      "durationMinutes": 3,
      "explanation": "When you see a white screen:\n\n### Step 1 — Reproduce it\n\nWrite down exactly:\n\n```text\nWhat did I do?\nWhich screen?\nCold launch or navigation?\niOS or Android?\nDevelopment or production?\n```\n\n### Step 2 — Check JavaScript errors\n\nLook at:\n\n```text\nReact Native DevTools\nMetro output\n```\n\n### Step 3 — Check navigation\n\nAsk:\n\n```text\nDid the correct route load?\nDid a layout crash?\nDid a redirect loop happen?\n```\n\n### Step 4 — Check native logs\n\niOS:\n\n```text\nXcode console\n```\n\nAndroid:\n\n```bash\nadb logcat\n```\n\n### Step 5 — Check startup dependencies\n\nFor example:\n\n```text\nauthentication\nstorage\nenvironment variables\nnative modules\nAPI initialization\nfonts\nnavigation\n```\n\n### Step 6 — Fix the actual cause\n\nDon't hide the problem with:\n\n```tsx\nif (error) return null;\n```\n\nunless that is genuinely the intended UI.",
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
      "id": "rn30-17",
      "title": "What is a stack trace?",
      "durationMinutes": 3,
      "explanation": "A **stack trace** shows the chain of function calls that led to an error.\n\nImagine:\n\n```tsx\nfunction App() {\n loadUser();\n}\n\nfunction loadUser() {\n fetchProfile();\n}\n\nfunction fetchProfile() {\n throw new Error(\"Failed\");\n}\n```\n\nThe stack might look conceptually like:\n\n```text\nError: Failed\n\nfetchProfile()\nloadUser()\nApp()\n```\n\nRead it from the failure outward.\n\n```text\nWhere did it fail?\n       ↓\nWho called that?\n       ↓\nWho called that?\n```\n\nThis gives you the path that led to the problem.",
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
      "id": "rn30-18",
      "title": "Symbolicated vs unsymbolicated crashes",
      "durationMinutes": 3,
      "explanation": "Native production crashes can sometimes look terrible:\n\n```text\n0x0000000104A21F\n0x0000000105BC92\n0x0000000106AB31\n```\n\nThis isn't very useful by itself.\n\n**Symbolication** means converting those addresses into meaningful function/file information using the appropriate debug symbols.\n\nConceptually:\n\n```text\nMemory address\n     |\n     v\ndebug symbols\n     |\n     v\nFunction / file / line\n```\n\nInstead of:\n\n```text\n0x104A21F\n```\n\nyou might get:\n\n```text\nSomeNativeModule.swift:128\n```\n\nThat gives you something you can investigate.",
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
      "id": "rn30-19",
      "title": "Why you shouldn't add `console.log()` to everything",
      "durationMinutes": 3,
      "explanation": "`console.log()` is useful.\n\nBut it should not be your entire debugging strategy.\n\nBad debugging:\n\n```text\nconsole.log(\"1\");\nconsole.log(\"2\");\nconsole.log(\"3\");\nconsole.log(\"4\");\nconsole.log(\"5\");\n```\n\nThen:\n\n> \"I think it crashed somewhere between 2 and 3.\"\n\nA better approach is:\n\n```text\nReact Native DevTools\n     +\nstack trace\n     +\nsource maps\n     +\nnative logs\n```\n\nThe goal is to use **evidence from the system**, not just add more noise.",
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
      "id": "rn30-20",
      "title": "Day 30 mental model",
      "durationMinutes": 3,
      "explanation": "Remember this:\n\n```text\n             Something broke\n                   |\n         +---------+---------+\n         |                   |\n      JS/React             Native\n         |                   |\n         v                   v\nReact Native DevTools    Xcode / logcat\n         |                   |\n         +---------+---------+\n                   |\n                   v\n              stack trace\n                   |\n                   v\n              source maps\n                   |\n                   v\n             original source\n```",
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
      "question": "What is the first step in debugging?",
      "options": [
        "A. Reproduce the problem consistently",
        "B. Add random logs everywhere",
        "C. Rewrite the feature",
        "D. Clear every cache"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is React Native DevTools designed to inspect?",
      "options": [
        "A. React components, network activity, performance, and JavaScript debugging",
        "B. App Store signing only",
        "C. Gradle publishing only",
        "D. Database migrations"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does Metro do during development?",
      "options": [
        "A. Bundles and serves the JavaScript application",
        "B. Signs iOS builds",
        "C. Stores refresh tokens",
        "D. Runs the backend"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why are source maps important?",
      "options": [
        "A. They map bundled code locations back to original source",
        "B. They improve image resolution",
        "C. They request permissions",
        "D. They create native views"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What JavaScript engine is commonly used by React Native?",
      "options": [
        "A. Hermes",
        "B. CocoaPods",
        "C. Gradle",
        "D. Maestro"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which tool provides detailed native iOS logs?",
      "options": [
        "A. Xcode console",
        "B. AndroidManifest",
        "C. Jest snapshots",
        "D. Expo Router"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which command-line log system is useful on Android?",
      "options": [
        "A. adb logcat",
        "B. pod install",
        "C. git log",
        "D. npm publish"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should you identify before choosing a debugging tool?",
      "options": [
        "A. Which layer is failing",
        "B. Which color the screen uses",
        "C. How many files exist",
        "D. Which editor is open"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does a stack trace show?",
      "options": [
        "A. The sequence of function calls leading to an error",
        "B. Only the final UI color",
        "C. The app store listing",
        "D. A list of dependencies"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is symbolication?",
      "options": [
        "A. Converting native crash addresses into readable function and source information",
        "B. Compressing images",
        "C. Creating an AAB",
        "D. Refreshing a token"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Debugging Self-check",
    "goal": "Reproduce and diagnose a crash using only device logs and a symbolicated stack trace. Do not add `console.log()`.",
    "brief": "> **Reproduce and diagnose a crash using only device logs and a symbolicated stack trace. Do not add `console.log()`.**\n\nYour process should be:\n\n```text\n1. Reproduce crash\n2. Capture device logs\n3. Find crash timestamp\n4. Locate exception\n5. Read stack trace\n6. Symbolicate if necessary\n7. Find source file/function\n8. Identify root cause\n9. Fix\n10. Reproduce again\n```\n\nThe important part is:\n\n**Don't guess. Follow the evidence.**",
    "steps": [],
    "acceptance": [
      "Reproduce the crash.",
      "Capture and inspect device logs.",
      "Use the stack trace to identify the root cause.",
      "Verify the fix by reproducing the original flow again."
    ]
  }
});

