import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_31_LESSONS = normalizePastedLessonDay({
  "day": 31,
  "title": "Performance",
  "overview": "**Goal:** By the end of this day, you should understand why a React Native screen becomes slow, identify whether the JS or UI side is responsible, find unnecessary renders, profile the application, and make an optimization based on measurements rather than guessing.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn31-1",
      "title": "What does \"slow\" actually mean?",
      "durationMinutes": 3,
      "explanation": "When someone says:\n\n> \"The app is slow.\"\n\nThat's not specific enough.\n\nIt could mean:\n\n```text\nApp takes too long to start\n      OR\nScreen takes too long to appear\n      OR\nButton responds slowly\n      OR\nScrolling is janky\n      OR\nAnimation drops frames\n      OR\nImages take too long to appear\n      OR\nNavigation feels delayed\n```\n\nYour first job is to identify **which kind of slowness** you have.",
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
      "id": "rn31-2",
      "title": "JS thread vs UI thread",
      "durationMinutes": 3,
      "explanation": "This connects directly to the React Native architecture you learned earlier.\n\nA simplified model:\n\n```text\n               React Native\n                    |\n         +----------+----------+\n         |                     |\n         v                     v\n     JS thread             UI thread\n         |                     |\n         |                     |\n     React logic          native rendering\n     state updates        layout\n     API handling         animations\n     event handling       touch handling\n```\n\nThere are also native/background execution contexts for native modules and platform work.\n\nThe important thing is:\n\n> **Not every performance problem is a JavaScript problem.**",
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
      "id": "rn31-3",
      "title": "What happens when the JS thread is blocked?",
      "durationMinutes": 3,
      "explanation": "Imagine you run expensive JavaScript:\n\n```tsx id=\"j0b2hk\"\nfor (let i = 0; i < 500000000; i++) {\n // expensive work\n}\n```\n\nThe JS thread is busy.\n\n```text\nJS thread\n████████████████████████████\n        busy\n```\n\nNow JavaScript cannot respond quickly to events or updates.\n\nThe user may experience:\n\n```text\nbutton feels delayed\nscroll feels bad\nanimations stutter\ninput feels slow\n```\n\nThat's why expensive JavaScript work can make the application feel frozen.",
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
      "id": "rn31-4",
      "title": "UI thread vs JS thread",
      "durationMinutes": 3,
      "explanation": "Now imagine an animation.\n\nIf the animation depends heavily on JavaScript:\n\n```text\nJS thread\n  |\n  v\ncalculate animation\n  |\n  v\nsend update\n  |\n  v\nUI\n```\n\nIf JS becomes busy, the animation can suffer.\n\nTools such as **Reanimated** are designed to allow certain animation work to execute closer to the UI/native side.\n\nConceptually:\n\n```text\nTraditional JS-heavy animation\n\nJS\n|\nv\ncalculate\n|\nv\nUI\n\n\nUI-focused animation\n\nUI thread\n  |\n  v\nanimation work\n  |\n  v\nscreen\n```",
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
      "id": "rn31-5",
      "title": "Why Reanimated exists",
      "durationMinutes": 3,
      "explanation": "Reanimated is not simply:\n\n> \"A library for prettier animations.\"\n\nOne of its important performance goals is allowing animation logic to run independently from ordinary JavaScript work where appropriate.\n\nThat means:\n\n```text\nJS thread busy\n     |\n     X\nanimation does not necessarily have to stop\n```\n\nThis is particularly useful for:\n\n```text\ngestures\ndragging\nscroll animations\ninteractive transitions\nshared element-like effects\n```",
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
      "id": "rn31-6",
      "title": "Why Gesture Handler exists",
      "durationMinutes": 3,
      "explanation": "Touch interactions can become complicated.\n\nFor example:\n\n```text\nSwipe\n |\n +-- finger movement\n +-- velocity\n +-- gesture recognition\n +-- animation\n +-- UI update\n```\n\n**React Native Gesture Handler** provides gesture primitives designed for performant native interaction.\n\nTogether, Gesture Handler and Reanimated are commonly used for:\n\n```text\ndragging\nswiping\nbottom sheets\ncarousels\ninteractive animations\n```\n\nThe important concept is:\n\n> Keep time-sensitive interaction work away from a blocked JS thread when the architecture allows it.",
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
      "id": "rn31-7",
      "title": "Unnecessary re-renders",
      "durationMinutes": 3,
      "explanation": "One of the most common React performance problems is unnecessary rendering.\n\nSuppose:\n\n```tsx id=\"h0kjax\"\nfunction Profile() {\n const [name, setName] = useState(\"Rajan\");\n const [count, setCount] = useState(0);\n\n return (\n   <>\n     <UserProfile name={name} />\n\n     <Button\n       title=\"Increase\"\n       onPress={() => setCount(count + 1)}\n     />\n   </>\n );\n}\n```\n\nWhen `count` changes, `Profile` renders again.\n\nDepending on the component tree, children may also render again.\n\nThat doesn't automatically mean there's a problem.\n\nThe important question is:\n\n> **Is the extra work expensive enough to matter?**",
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
      "id": "rn31-8",
      "title": "`memo`",
      "durationMinutes": 3,
      "explanation": "`memo` can prevent a component from rendering when its props haven't changed.\n\n```tsx id=\"2k8s4j\"\nconst UserProfile = memo(\n function UserProfile({\n   name,\n }: {\n   name: string;\n }) {\n   return <Text>{name}</Text>;\n }\n);\n```\n\nConceptually:\n\n```text\nParent renders\n    |\n    v\nUserProfile\n    |\n    +-- props same --> can skip render\n    |\n    +-- props changed -> render\n```\n\nBut don't put `memo()` everywhere.\n\nIf the component is tiny and cheap, adding memoization can make the code harder to understand without providing meaningful benefit.",
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
      "id": "rn31-9",
      "title": "Stable references",
      "durationMinutes": 2,
      "explanation": "This is a common source of confusion.\n\nConsider:\n\n```tsx id=\"04qv1j\"\nfunction Screen() {\n const options = {\n   color: \"red\",\n };\n\n return <Child options={options} />;\n}\n```\n\nEvery render creates a new object.\n\nSo:\n\n```text\nrender 1\noptions -> object A\n\nrender 2\noptions -> object B\n```\n\nEven though the contents look the same:\n\n```text\nA !== B\n```\n\nThat can cause a memoized child to render again.",
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
      "id": "rn31-10",
      "title": "`useMemo`",
      "durationMinutes": 2,
      "explanation": "You can use `useMemo` when you genuinely need a stable calculated value or an expensive calculation.\n\n```tsx id=\"04i5s3\"\nconst options = useMemo(\n () => ({\n   color: \"red\",\n }),\n []\n);\n```\n\nNow React can reuse the value between renders until the dependencies change.\n\nBut don't use:\n\n```text\nuseMemo\nuseCallback\nmemo\n```\n\neverywhere automatically.\n\nThe correct process is:\n\n```text\nMeasure\n ↓\nFind expensive work\n ↓\nUnderstand why it repeats\n ↓\nOptimize\n ↓\nMeasure again\n```",
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
      "id": "rn31-11",
      "title": "`useCallback`",
      "durationMinutes": 2,
      "explanation": "Functions are also recreated during rendering.\n\n```tsx id=\"f9xw2v\"\nconst handlePress = () => {\n console.log(\"Pressed\");\n};\n```\n\nA new function is created when the component renders.\n\n`useCallback` can preserve a function reference:\n\n```tsx id=\"h9r9i1\"\nconst handlePress = useCallback(() => {\n console.log(\"Pressed\");\n}, []);\n```\n\nThis becomes useful when the function is passed to memoized children or used in dependency-sensitive logic.\n\nAgain:\n\n> Don't use `useCallback` just because you can.",
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
      "id": "rn31-12",
      "title": "Selector-based state",
      "durationMinutes": 2,
      "explanation": "Global state can also cause unnecessary renders.\n\nImagine:\n\n```text id=\"4v6e47\"\nGlobal store\n\nuser\ncart\nnotifications\nsettings\nmessages\n```\n\nIf a component subscribes to the entire store:\n\n```text\nStore changes\n     |\n     v\nComponent re-renders\n```\n\neven if the component only needs:\n\n```text\nuser.name\n```\n\nA selector allows the component to subscribe to a smaller piece of state.\n\n```tsx id=\"u8v4o2\"\nconst userName = useStore(\n (state) => state.user.name\n);\n```\n\nConceptually:\n\n```text\nEntire store\n    |\n    v\nselector\n    |\n    v\nuser.name\n    |\n    v\ncomponent\n```\n\nThis can reduce unnecessary renders.",
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
      "id": "rn31-13",
      "title": "React Native DevTools Profiler",
      "durationMinutes": 2,
      "explanation": "Don't guess which component is slow.\n\nProfile it.\n\nThe React Native DevTools profiler helps you understand rendering behavior.\n\nConceptually:\n\n```text\nScreen\n |\n v\nProfile\n |\n +-- Component A\n +-- Component B\n +-- Component C\n |\n v\nWhich component did expensive work?\n```\n\nYou may discover:\n\n```text\nYou thought:\n\"API is slow.\"\n\nActual problem:\nLargeListItem rendered 2,000 times.\n```\n\nThat's why profiling is important.",
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
      "id": "rn31-14",
      "title": "A real performance debugging example",
      "durationMinutes": 2,
      "explanation": "Imagine your screen feels slow when typing:\n\n```text\nSearch input\n    |\n    v\nUser types \"react\"\n    |\n    v\nScreen feels laggy\n```\n\nDon't immediately add:\n\n```tsx\nuseMemo()\nuseCallback()\nmemo()\n```\n\nInstead investigate.\n\nMaybe:\n\n```text\ntyping\n |\n v\nstate update\n |\n v\nentire screen renders\n |\n v\n5,000 list items render\n |\n v\nJS thread becomes busy\n```\n\nNow you have an actual explanation.",
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
      "id": "rn31-15",
      "title": "Bundle size",
      "durationMinutes": 2,
      "explanation": "Your application contains JavaScript code and dependencies.\n\nThe more code you ship, the more work can be required during startup and loading.\n\nYou should understand:\n\n```text\nsource code\n  |\n  v\nMetro\n  |\n  v\nbundle\n  |\n  v\nHermes bytecode/runtime\n  |\n  v\napplication\n```\n\nBundle size can affect:\n\n```text\nstartup\nmemory\ndownload/update size\nparsing/loading work\n```",
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
      "id": "rn31-16",
      "title": "Hermes bytecode",
      "durationMinutes": 2,
      "explanation": "Hermes can use bytecode rather than treating your JavaScript exactly like source text at runtime.\n\nA simplified view:\n\n```text\nJavaScript\n   |\n   v\nMetro/build\n   |\n   v\nHermes bytecode\n   |\n   v\nHermes runtime\n```\n\nThe exact build pipeline depends on your React Native/Expo setup, so don't memorize this as one universal build command.\n\nThe important idea is:\n\n> **Your source code isn't simply copied unchanged into the running application.**",
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
      "id": "rn31-17",
      "title": "Lazy screens and code splitting",
      "durationMinutes": 2,
      "explanation": "You don't necessarily need every piece of application code immediately.\n\nImagine an application with:\n\n```text\nHome\nSearch\nProfile\nSettings\nAdmin\nReports\nAnalytics\n```\n\nA user may never open:\n\n```text\nAdmin\nReports\nAnalytics\n```\n\nLoading everything as early as possible can increase startup work.\n\n**Lazy loading** means loading some code only when it is needed.\n\nConceptually:\n\n```text\nApp startup\n   |\n   +--> Home code\n   |\n   +--> critical code\n   |\n   v\nApplication ready\n\nLater:\nUser opens Reports\n   |\n   v\nload Reports code\n```\n\nThe exact support and implementation depend on your Expo/React Native architecture, so learn the concept first.",
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
      "id": "rn31-18",
      "title": "Image performance",
      "durationMinutes": 2,
      "explanation": "Images can be surprisingly expensive.\n\nConsider a list:\n\n```text\n5,000 products\n    |\n    v\n5,000 images\n```\n\nProblems can come from:\n\n```text\nlarge image dimensions\nlarge file size\ndecoding\nnetwork requests\nmemory usage\nlack of caching\ntoo many simultaneous loads\n```\n\nA good image strategy considers:\n\n```text\ncorrect dimensions\nappropriate format\ncaching\nlazy loading\nthumbnails\nplaceholders\n```\n\nDon't download a 5 MB original image when the UI displays it at:\n\n```text\n80 × 80\n```",
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
      "id": "rn31-19",
      "title": "List performance",
      "durationMinutes": 2,
      "explanation": "This connects directly to Day 6.\n\nRemember:\n\n```text\nScrollView + map\n      |\n      v\npotentially thousands of mounted items\n```\n\nwhile virtualized lists:\n\n```text\nFlashList / FlatList\n      |\n      v\nlimited active rendering window\n```\n\nPerformance depends on more than the list itself.\n\nA slow row can still make a virtualized list slow.\n\nFor example:\n\n```tsx id=\"n7y7gk\"\nfunction ProductRow() {\n // expensive calculation\n // expensive image\n // expensive child tree\n}\n```\n\nYou need to optimize:\n\n```text\nlist\n+\nrow\n+\nimages\n+\nstate subscriptions\n```",
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
      "id": "rn31-20",
      "title": "Cold start time",
      "durationMinutes": 2,
      "explanation": "**Cold start** means starting the application when its process isn't already running.\n\nThink:\n\n```text\nApp completely closed\n      |\n      v\nTap app icon\n      |\n      v\nProcess starts\n      |\n      v\nNative initialization\n      |\n      v\nJS runtime starts\n      |\n      v\nJavaScript initializes\n      |\n      v\nNavigation initializes\n      |\n      v\nFirst screen renders\n      |\n      v\nUser can interact\n```\n\nEvery stage can contribute to startup time.",
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
      "id": "rn31-21",
      "title": "What actually affects cold start?",
      "durationMinutes": 2,
      "explanation": "Potential contributors include:\n\n```text\nnative initialization\nJavaScript bundle size\nHermes startup\nmodule initialization\nlarge dependency graph\nsynchronous startup work\nnavigation initialization\nstate restoration\nfont loading\ndatabase initialization\nauthentication initialization\nnetwork requests\nexpensive first render\n```\n\nNotice something important:\n\n> **Not all startup work belongs in startup.**\n\nFor example, if analytics configuration can happen after the first usable screen appears, you may not want to block the entire application on it.",
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
      "id": "rn31-22",
      "title": "Bad startup architecture",
      "durationMinutes": 2,
      "explanation": "Imagine:\n\n```text\nApp starts\n  |\n  +-- initialize database\n  |\n  +-- restore auth\n  |\n  +-- fetch profile\n  |\n  +-- fetch notifications\n  |\n  +-- load analytics\n  |\n  +-- load settings\n  |\n  +-- load fonts\n  |\n  +-- THEN show Home\n```\n\nThe user waits for everything.",
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
      "id": "rn31-23",
      "title": "Better startup thinking",
      "durationMinutes": 2,
      "explanation": "Ask:\n\n> What does the user actually need before they can see and use the first screen?\n\nFor example:\n\n```text\nApp starts\n  |\n  +-- critical initialization\n  |\n  v\nShow usable UI\n  |\n  +-- restore additional data\n  +-- load non-critical resources\n  +-- initialize analytics\n```\n\nThe exact architecture depends on the application, but the principle is:\n\n> **Don't make non-critical work block the first useful screen.**",
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
      "id": "rn31-24",
      "title": "Measuring performance",
      "durationMinutes": 2,
      "explanation": "Don't say:\n\n> \"I think this optimization made it faster.\"\n\nMeasure before and after.\n\n```text\nBefore\n-------\nStartup: 2.8s\nScreen render: 180ms\nList interaction: janky\n\n\nOptimization\n\n\nAfter\n-----\nStartup: 2.1s\nScreen render: 95ms\nList interaction: smoother\n```\n\nNow you have evidence.",
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
      "id": "rn31-25",
      "title": "A practical performance debugging process",
      "durationMinutes": 2,
      "explanation": "When a screen is slow:\n\n### Step 1 — Describe the problem\n\n```text\n\"Scrolling is janky.\"\n```\n\nis better than:\n\n```text\n\"The app is slow.\"\n```\n\n### Step 2 — Reproduce it\n\nUse the same:\n\n```text\ndevice\ndata size\nscreen\ninteraction\n```\n\n### Step 3 — Profile\n\nUse:\n\n```text\nReact Native DevTools\n```\n\n### Step 4 — Identify the actual expensive work\n\nMaybe it's:\n\n```text\nunnecessary renders\nexpensive calculation\nlarge images\nJS thread blocking\nlarge list\nstate subscription\n```\n\n### Step 5 — Make one meaningful change\n\nFor example:\n\n```text\nmemoize expensive row\n```\n\n### Step 6 — Measure again\n\n```text\nBefore → 150ms\nAfter  → 60ms\n```\n\nNow you know the change helped.",
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
      "id": "rn31-26",
      "title": "Don't optimize blindly",
      "durationMinutes": 2,
      "explanation": "This is one of the most important lessons in this entire day.\n\nDon't automatically add:\n\n```text\nmemo()\nuseMemo()\nuseCallback()\nFlashList\nReanimated\nlazy loading\n```\n\nto everything.\n\nOptimization should answer a real problem.\n\nThink:\n\n```text\nPerformance problem\n      |\n      v\nMeasurement\n      |\n      v\nRoot cause\n      |\n      v\nTargeted optimization\n      |\n      v\nMeasurement again\n```\n\nNot:\n\n```text\nPerformance problem\n      |\n      v\nAdd useMemo everywhere\n```\n\n---\n\n# Day 31 mental model\n\nKeep this picture in your head:\n\n```text\n                Performance\n                    |\n      +-------------+-------------+\n      |             |             |\n      v             v             v\n  JS thread      UI thread     Native\n      |             |             |\n      v             v             v\nReact/rendering   animations    platform work\nstate updates     gestures      modules\nAPI logic         layout        device APIs\n      |\n      v\nunnecessary work\n      |\n      v\nprofile + measure\n      |\n      v\ntargeted fix\n```\n\nAnd remember:\n\n```text\nFast app ≠ lots of optimization\n\nFast app = little unnecessary work\n          + correct architecture\n          + measured performance\n```",
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
      "question": "What should you do before optimizing performance?",
      "options": [
        "A. Measure and identify the actual bottleneck",
        "B. Add memo everywhere",
        "C. Rewrite native code",
        "D. Remove every image"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What can happen when the JavaScript thread is blocked?",
      "options": [
        "A. JavaScript-driven interactions and updates can feel delayed",
        "B. The app is automatically published",
        "C. iOS signing stops",
        "D. The database is deleted"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why can UI-thread animations remain smooth?",
      "options": [
        "A. They can run without waiting for a busy JavaScript thread",
        "B. They disable rendering",
        "C. They remove all state",
        "D. They use network caching"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What problem does React.memo help reduce?",
      "options": [
        "A. Unnecessary child re-renders when props are unchanged",
        "B. Native crashes",
        "C. Authentication expiry",
        "D. Build signing"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why do stable references matter for memoized components?",
      "options": [
        "A. New object or function references can make props appear changed",
        "B. They increase bundle size",
        "C. They request permissions",
        "D. They create source maps"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "When should useMemo be used?",
      "options": [
        "A. When a measured expensive calculation or stable value benefits from memoization",
        "B. For every string",
        "C. To replace state",
        "D. To fetch all server data"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is selector-based state access useful for?",
      "options": [
        "A. Subscribing a component only to the state it needs",
        "B. Signing an AAB",
        "C. Creating an Info.plist",
        "D. Publishing npm packages"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does the React Native DevTools profiler reveal?",
      "options": [
        "A. Which components render and how long rendering takes",
        "B. Only network passwords",
        "C. Store review status",
        "D. Native signing certificates"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why is list virtualization important?",
      "options": [
        "A. It limits rendering work to the items needed around the viewport",
        "B. It loads the entire dataset",
        "C. It disables scrolling",
        "D. It replaces query caching"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is cold start time?",
      "options": [
        "A. The time from launching the app until it becomes usable",
        "B. The duration of a test",
        "C. The time to publish npm",
        "D. The refresh-token lifetime"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Performance Self-check",
    "goal": "Profile a janky screen, find the actual re-render culprit, and fix it without guessing.",
    "brief": "> **Profile a janky screen, find the actual re-render culprit, and fix it without guessing.**\n\nBuild a screen with:\n\n```text\nSearch input\n   +\nLarge list\n   +\nExpensive list item\n   +\nGlobal state\n```\n\nThen:\n\n### Step 1\n\nReproduce the jank.\n\n### Step 2\n\nOpen React Native DevTools profiler.\n\n### Step 3\n\nFind which component is rendering unnecessarily.\n\n### Step 4\n\nDetermine why.\n\nFor example:\n\n```text\nSearch input changes\n      |\n      v\nParent renders\n      |\n      v\nnew object created\n      |\n      v\nmemoized child receives new reference\n      |\n      v\nchild renders again\n```\n\n### Step 5\n\nFix the actual problem.\n\nFor example:\n\n```tsx\nconst options = useMemo(\n () => ({\n   color: \"red\",\n }),\n []\n);\n```\n\nor use a more appropriate state selector.\n\n### Step 6\n\nProfile again.\n\nYou should be able to explain:\n\n```text\nBefore:\nThe list item rendered unnecessarily because ______.\n\nFix:\nI changed ______.\n\nAfter:\nThe profiler showed ______.\n```\n\nThat final explanation is more important than simply saying:\n\n> \"I added `useMemo`, and now it's faster.\"",
    "steps": [],
    "acceptance": [
      "Reproduce the jank.",
      "Use the profiler to identify the unnecessary render.",
      "Fix the actual cause.",
      "Profile again and explain the measured difference."
    ]
  }
});

