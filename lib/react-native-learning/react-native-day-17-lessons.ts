import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_17_LESSONS = normalizePastedLessonDay({
  "day": 17,
  "title": "Modern React in React Native",
  "overview": "📖 **8 lessons**\n\nReact Native is not separate from React.\n\nYour React Native application uses React's component model, state system, effects, hooks, and rendering behavior. React Native 0.83 moved to **React 19.2**, bringing APIs such as `useEffectEvent` into React Native. ([React Native](<https://reactnative.dev/blog/2025/12/10/react-native-0.83?utm_source=chatgpt.com>))\n\nThat means understanding modern React is no longer optional background knowledge if you want to understand why your React Native code behaves the way it does.\n\nToday's lesson is less about memorizing hooks and more about understanding **why React behaves the way it does**.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn17-1",
      "title": "React Native 0.83+ and React 19.2",
      "durationMinutes": 7,
      "explanation": "⏱️ **7 min**\n\n## Explanation\n\nIf you're learning React Native today, you will encounter modern React APIs.\n\nReact Native 0.83 shipped with React 19.2. ([React Native](<https://reactnative.dev/blog/2025/12/10/react-native-0.83?utm_source=chatgpt.com>))\n\nThis matters because React 19 introduced and expanded several APIs that change how we think about:\n\n- Effects\n- Forms\n- Optimistic UI\n- External stores\n- Transitions\n- Suspense\n- Component lifecycle\n\nYou don't need to use every new React API in every application.\n\nBut you **do** need to understand what problem each API is trying to solve.\n\n---\n\n## Why this matters for React Native\n\nImagine you're building:\n\n```\nShopping App\n│\n├── Product List\n├── Product Details\n├── Cart\n├── Checkout\n└── Profile\n```\n\nThe user expects the application to feel responsive.\n\nIf a large update takes too much time:\n\n```\nUser taps\n ↓\nHuge update starts\n ↓\nUI becomes busy\n ↓\nButton feels delayed\n```\n\nModern React gives you tools for saying:\n\n> \"This update can happen, but don't let it make the interface feel stuck.\"\n\nThat's where APIs such as `useTransition` and `useDeferredValue` become useful.\n\n---\n\n## Modern React mental model\n\nThink of React as managing several kinds of work:\n\n```\n                  React\n                    │\n     ┌──────────────┼──────────────┐\n     │              │              │\n     ▼              ▼              ▼\n State updates    Effects       Rendering\n     │              │              │\n     ▼              ▼              ▼\nuseTransition   useEffectEvent   Suspense\n```\n\nThe goal is not to make every component complicated.\n\nThe goal is to use the right tool when a particular problem appears.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- React Native uses React.\n- React Native 0.83 shipped with React 19.2. ([React Native](<https://reactnative.dev/blog/2025/12/10/react-native-0.83?utm_source=chatgpt.com>))\n- Modern React APIs are relevant to React Native.\n- You should understand the problem each hook solves.\n- Don't add advanced hooks simply because they are new."
      ],
      "commonMistakes": [
        "### ❌ Thinking newer hooks replace older hooks\n\nThey don't.\n\n`useState` and `useEffect` are still fundamental.\n\n### ❌ Using advanced React APIs everywhere\n\nAdvanced tools should solve actual problems."
      ],
      "quiz": [
        {
          "question": "What React version shipped with React Native 0.83?",
          "options": [
            "A. React 18",
            "B. React 19.2",
            "C. React 17",
            "D. React 20"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn17-2",
      "title": "`useEffectEvent` — Effects Without Stale Values",
      "durationMinutes": 8,
      "explanation": "⏱️ **8 min**\n\n## Explanation\n\nThis is one of the most important lessons today.\n\nConsider:\n\n```\nuseEffect(() => {\nconst connection = connect(roomId);\n\nconnection.on(\"connected\", () => {\n  showNotification(theme);\n});\n\nreturn () => connection.disconnect();\n}, [roomId, theme]);\n```\n\nAt first glance, this seems reasonable.\n\nBut there are actually two different things happening.\n\nThe connection depends on:\n\n```\nroomId\n```\n\nThe notification uses:\n\n```\ntheme\n```\n\nIf the theme changes, do we really want to disconnect and reconnect the room?\n\nProbably not.\n\nWe want:\n\n```\nroomId changes\n  ↓\nReconnect\n\ntheme changes\n  ↓\nUse latest theme\n```\n\nThis is exactly the type of problem `useEffectEvent` helps solve. React describes Effect Events as a way to separate event-like logic from the reactive part of an Effect. ([React](<https://react.dev/reference/react/useEffectEvent?utm_source=chatgpt.com>))\n\n---\n\n## What is reactive?\n\n**Reactive** means:\n\n> A change should cause the Effect to run again.\n\nFor example:\n\n```\nroomId\n```\n\nIf the room changes, the connection needs to change.\n\nSo:\n\n```\nuseEffect(() => {\nconnect(roomId);\n}, [roomId]);\n```\n\nmakes sense.\n\n---\n\n## What is non-reactive logic?\n\nSuppose the connection fires:\n\n```\nconnected\n```\n\nand you want to display a notification using the latest theme.\n\nThe notification logic should not necessarily cause the connection itself to restart.\n\nThat's **event-like logic**.\n\n---\n\n## `useEffectEvent`\n\nYou can separate the logic:\n\n```\nconst onConnected = useEffectEvent(() => {\nshowNotification(\"Connected!\", theme);\n});\n\nuseEffect(() => {\nconst connection = connect(roomId);\n\nconnection.on(\"connected\", onConnected);\n\nreturn () => {\n  connection.disconnect();\n};\n}, [roomId]);\n```\n\nNow the mental model is:\n\n```\nroomId\n│\n▼\nEffect\n│\n└── Connect / disconnect\n\nConnection event\n│\n▼\nEffect Event\n│\n└── Read latest theme\n```\n\nThe Effect doesn't need to restart just because `theme` changed.\n\nReact's documentation specifically notes that Effect Events see the latest committed values without making the surrounding Effect reactive to those values. ([React](<https://react.dev/reference/react/useEffectEvent?utm_source=chatgpt.com>))\n\n---\n\n## Why this is better than a ref hack\n\nBefore `useEffectEvent`, developers sometimes wrote:\n\n```\nconst themeRef = useRef(theme);\n\nthemeRef.current = theme;\n```\n\nThen:\n\n```\nuseEffect(() => {\nconnection.on(\"connected\", () => {\n  showNotification(themeRef.current);\n});\n}, []);\n```\n\nThis can work, but it is easy to misunderstand.\n\nThe ref is being used as a workaround for:\n\n> \"I need the latest value without making this Effect depend on it.\"\n\n`useEffectEvent` expresses that intention directly.\n\n---\n\n## Important rule\n\nDo **not** use `useEffectEvent` simply to avoid dependencies.\n\nReact explicitly warns against using it as a way to hide dependencies. ([React](<https://react.dev/reference/react/useEffectEvent?utm_source=chatgpt.com>))\n\nUse it when you genuinely have:\n\n```\nEffect\n+\nevent-like logic\n```\n\n---\n\n## Important restriction\n\nAn Effect Event is not a normal callback.\n\nYou should call it from:\n\n- `useEffect`\n- another Effect Event\n\nYou should not call it:\n\n- during render\n- directly from a button handler\n- as a general callback passed to children\n\nReact's documentation explicitly describes these restrictions. ([React](<https://react.dev/reference/react/useEffectEvent?utm_source=chatgpt.com>))\n\n---\n\n## Visual Diagram\n\n```\n               useEffect\n                  │\n        ┌─────────┴─────────┐\n        │                   │\n   Reactive work       Effect Event\n        │                   │\n        ▼                   ▼\n    roomId changes       theme changes\n        │                   │\n        ▼                   ▼\n   reconnect          latest value used\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `useEffectEvent` separates Effect setup from event-like logic.\n- It can read the latest props and state.\n- It helps avoid unnecessary Effect re-synchronization.\n- It is not a replacement for dependency arrays.\n- It should only be called from Effects or Effect Events. ([React](<https://react.dev/reference/react/useEffectEvent?utm_source=chatgpt.com>))"
      ],
      "commonMistakes": [
        "### ❌ Using it to silence dependency warnings\n\nThat defeats its purpose.\n\n### ❌ Calling it inside render\n\nDon't.\n\n### ❌ Passing it to child components as a normal callback\n\nUse normal callbacks for event handlers."
      ],
      "quiz": [
        {
          "question": "If changing `theme` should not reconnect a WebSocket, but the connection callback needs the latest theme, what can help?",
          "options": [
            "A. `useEffectEvent`",
            "B. `useState` only",
            "C. `StyleSheet`",
            "D. `FlatList`"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn17-3",
      "title": "`useActionState` and `useOptimistic`",
      "durationMinutes": 8,
      "explanation": "⏱️ **8 min**\n\n## Explanation\n\nForms and mutations often follow this pattern:\n\n```\nUser taps Save\n    ↓\nRequest starts\n    ↓\nWait...\n    ↓\nSuccess / Error\n```\n\nThat waiting period can make an application feel slow.\n\nModern React gives us tools for managing this kind of interaction.\n\n---\n\n# `useActionState`\n\n`useActionState` is useful when you have an action that changes state and you want React to manage the result of that action.\n\nThink:\n\n```\nSubmit form\n  ↓\nAction\n  ↓\nResult\n  ↓\nUpdated UI\n```\n\nFor example, conceptually:\n\n```\nconst [state, submitAction, isPending] = useActionState(\nasync (previousState, formData) => {\n  const result = await saveProfile(formData);\n\n  return result;\n},\ninitialState\n);\n```\n\nThe exact APIs and patterns depend on how your application handles forms and actions, but the important idea is:\n\n> The action has state associated with it.\n\n---\n\n# Why is that useful?\n\nInstead of separately managing:\n\n```\nisSubmitting\nerror\nsuccess\nresult\n```\n\nyou can structure the action around its state.\n\nFor example:\n\n```\nForm\n│\n▼\nSubmit\n│\n▼\nAction\n│\n├── pending\n├── success\n└── error\n```\n\n---\n\n# `useOptimistic`\n\nNow imagine a social application.\n\nThe user taps:\n\n```\n❤️ Like\n```\n\nShould they have to wait for the server?\n\n```\nTap Like\n ↓\nNetwork request\n ↓\nServer\n ↓\nResponse\n ↓\nHeart changes\n```\n\nThat feels slow.\n\nWith an **optimistic update**, we immediately show the expected result:\n\n```\nTap Like\n ↓\nHeart changes immediately ❤️\n ↓\nServer request\n ↓\nSuccess → keep it\nFailure → undo it\n```\n\n`useOptimistic` is designed for this kind of UI.\n\n---\n\n## What does optimistic mean?\n\n**Optimistic** means:\n\n> We assume the operation will succeed and update the UI before the server confirms it.\n\nThis is useful when the expected result is highly likely and the UI can safely undo the change if the request fails.\n\n---\n\n## Example\n\nConceptually:\n\n```\nconst [optimisticLiked, setOptimisticLiked] =\nuseOptimistic(liked);\n```\n\nThen:\n\n```\nUser taps Like\n     ↓\nOptimistic state\n     ↓\n❤️ immediately\n     ↓\nServer request\n     │\n  ┌──┴──┐\n  ▼     ▼\nSuccess  Failure\n  │       │\n  ▼       ▼\nKeep     Roll back\n```\n\n---\n\n## Important distinction\n\nOptimistic UI does **not** mean:\n\n> \"The server definitely succeeded.\"\n\nIt means:\n\n> \"We'll show the expected result now and correct it if the server says otherwise.\"\n\n---\n\n## Where this becomes useful in React Native\n\nExamples:\n\n```\nLike a post\nFollow a user\nMark notification as read\nRename a note\nMove an item\nToggle a setting\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `useActionState` helps organize state around an action.\n- `useOptimistic` helps make UI changes feel immediate.\n- Optimistic UI must have a failure strategy.\n- Never assume a network request succeeded simply because the UI changed."
      ],
      "commonMistakes": [
        "### ❌ Optimistically changing something that cannot safely be undone\n\nBe careful with financial or irreversible actions.\n\n### ❌ Forgetting rollback\n\nIf the request fails, the UI must return to a correct state.\n\n### ❌ Confusing optimistic UI with server confirmation\n\nThey are different."
      ],
      "quiz": [
        {
          "question": "What does an optimistic update do?",
          "options": [
            "A. Updates the UI before the server confirms success",
            "B. Prevents all network requests",
            "C. Disables errors",
            "D. Stores data permanently"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn17-4",
      "title": "`useSyncExternalStore`",
      "durationMinutes": 6,
      "explanation": "⏱️ **6 min**\n\n## Explanation\n\nMost of the time, React state looks like:\n\n```\nReact\n↓\nuseState\n↓\nComponent\n```\n\nBut sometimes the data lives outside React.\n\nFor example:\n\n```\nNative module\nExternal store\nBrowser API\nDevice API\nCustom event system\n```\n\nNow React needs a safe way to subscribe to changes.\n\nThat's where:\n\n```\nuseSyncExternalStore\n```\n\ncomes in.\n\n---\n\n# What is an external store?\n\nAn **external store** is state managed outside React.\n\nImagine:\n\n```\nNative Module\n   │\n   ▼\nExternal Store\n   │\n   ▼\nReact Component\n```\n\nReact needs to know:\n\n> \"Tell me when the external data changes.\"\n\n---\n\n# The problem\n\nYou could manually write:\n\n```\nuseEffect(() => {\nconst unsubscribe = store.subscribe(() => {\n  setValue(store.getValue());\n});\n\nreturn unsubscribe;\n}, []);\n```\n\nBut React provides a dedicated API for this pattern.\n\n---\n\n# Mental model\n\n```\nExternal Store\n    │\n    ├── getSnapshot()\n    │\n    └── subscribe()\n           │\n           ▼\n    useSyncExternalStore\n           │\n           ▼\n        React UI\n```\n\nA **snapshot** is the current value React should read from the external store.\n\n---\n\n# Why does this matter for React Native?\n\nYou may eventually create a custom hook around:\n\n```\nNative sensors\nBattery state\nConnectivity\nNative SDK state\nCustom native module\n```\n\nIf that source of truth lives outside React, you need a correct subscription model.\n\nThat's where `useSyncExternalStore` becomes relevant.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `useSyncExternalStore` connects React to external stores.\n- It is especially useful when the source of truth lives outside React.\n- You may encounter it when building native-backed hooks.\n- Don't use it for ordinary component state."
      ],
      "commonMistakes": [
        "### ❌ Using it instead of `useState`\n\nIf the state belongs to the component, use normal React state.\n\n### ❌ Creating your own subscription system without cleanup\n\nSubscriptions must be removed when no longer needed."
      ],
      "quiz": [
        {
          "question": "What problem does `useSyncExternalStore` solve?",
          "options": [
            "A. Safely subscribing React to state managed outside React",
            "B. Styling components",
            "C. Navigating screens",
            "D. Loading images"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn17-5",
      "title": "`useTransition` and `useDeferredValue`",
      "durationMinutes": 8,
      "explanation": "⏱️ **8 min**\n\n## Explanation\n\nMobile applications need to stay responsive.\n\nImagine a search screen containing a huge amount of expensive work:\n\n```\nUser types \"react\"\n     ↓\nHuge filtering calculation\n     ↓\nThousands of items update\n     ↓\nTyping feels delayed\n```\n\nThe user doesn't care if the results take a tiny bit longer.\n\nThey care that:\n\n> **The keyboard and typing remain responsive.**\n\n---\n\n# `useTransition`\n\nA transition tells React:\n\n> \"This update is less urgent than immediate user interaction.\"\n\nFor example:\n\n```\nconst [isPending, startTransition] = useTransition();\n\nfunction handleSearch(text: string) {\nsetInput(text);\n\nstartTransition(() => {\n  setSearchQuery(text);\n});\n}\n```\n\nThe idea is:\n\n```\nTyping\n│\n├── Immediate → input value\n│\n└── Lower priority → expensive results\n```\n\n---\n\n# Why is this useful?\n\nWithout prioritization:\n\n```\nKeystroke\n↓\nHeavy calculation\n↓\nUI waits\n```\n\nWith a transition:\n\n```\nKeystroke\n├──────────────→ Input stays responsive\n│\n└── transition → Results update when React can work on them\n```\n\n---\n\n# `useDeferredValue`\n\nSometimes you don't control the state update itself.\n\nInstead, you can create a deferred version of a value:\n\n```\nconst deferredQuery = useDeferredValue(query);\n```\n\nNow:\n\n```\nquery\n│\n├── immediate UI\n│\n└── deferredQuery\n        ↓\n    expensive UI\n```\n\n---\n\n# `useTransition` vs `useDeferredValue`\n\nA simple way to remember:\n\n### `useTransition`\n\nYou control the update:\n\n```\nstartTransition(() => {\nupdateSomething();\n});\n```\n\n### `useDeferredValue`\n\nYou already have a value and want a lower-priority version:\n\n```\nconst deferred = useDeferredValue(value);\n```\n\n---\n\n## Important warning\n\nNeither hook magically makes expensive JavaScript cheap.\n\nIf your code does:\n\n```\n10 million operations\n```\n\nyou still have 10 million operations.\n\nThese tools help React prioritize work so urgent interactions can remain responsive.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `useTransition` marks an update as lower priority.\n- `useDeferredValue` creates a deferred version of a value.\n- They can help keep interactions responsive during expensive rendering.\n- They don't eliminate expensive work."
      ],
      "commonMistakes": [
        "### ❌ Using transitions to hide badly written code\n\nOptimize genuinely expensive work too.\n\n### ❌ Expecting every update to become faster\n\nThe goal is responsiveness, not necessarily less total work."
      ],
      "quiz": [
        {
          "question": "What is the main goal of `useTransition`?",
          "options": [
            "A. Keep urgent interactions responsive while lower-priority updates happen",
            "B. Store data permanently",
            "C. Navigate between screens",
            "D. Fetch images"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn17-6",
      "title": "Suspense and Error Boundaries",
      "durationMinutes": 8,
      "explanation": "⏱️ **8 min**\n\n## Explanation\n\nApplications fail.\n\nData can fail.\n\nComponents can fail.\n\nPromises can fail.\n\nA good application needs to decide:\n\n```\nWhat should the user see while something is loading?\n\nWhat should the user see if something fails?\n```\n\nTwo important React concepts are:\n\n```\nSuspense\nError Boundaries\n```\n\nThink of them as two sides of the same idea.\n\n---\n\n# Suspense\n\nSuspense lets a component tree say:\n\n> \"I'm not ready yet.\"\n\nReact can then display a fallback.\n\nConceptually:\n\n```\n<Suspense fallback={<Loading />}>\n<Profile />\n</Suspense>\n```\n\nIf the supported child suspends:\n\n```\nProfile\n │\n └── not ready\n        ↓\n     Suspense\n        ↓\n     Loading UI\n```\n\nReact's Suspense documentation explains that Suspense can coordinate loading for supported suspending operations such as lazy-loaded components and cached Promises used with `use`. ([React](<https://react.dev/reference/react/Suspense?utm_source=chatgpt.com>))\n\n---\n\n# Error Boundary\n\nNow imagine:\n\n```\nProfile\n ↓\nSomething throws\n```\n\nYou don't want the entire application to become unusable.\n\nAn **Error Boundary** provides a controlled failure UI.\n\nConceptually:\n\n```\n        Component\n           │\n      ┌────┴────┐\n      │         │\n    Works     Throws\n      │         │\n      ▼         ▼\n     UI      Error UI\n```\n\n---\n\n# Suspense + Error Boundary\n\nThese work together conceptually:\n\n```\n           Screen\n             │\n      ┌──────┴──────┐\n      │             │\n  Suspense       Error Boundary\n      │             │\n   Loading        Failure\n```\n\nSo the user can see:\n\n```\nLoading...\n```\n\nwhile something is pending and:\n\n```\nSomething went wrong.\n[Try again]\n```\n\nwhen it fails.\n\n---\n\n# Important React Native point\n\nDon't assume:\n\n```\nfetch() inside useEffect\n```\n\nautomatically triggers Suspense.\n\nReact's Suspense documentation explicitly notes that Suspense does not detect data fetched inside an Effect or event handler. ([React](<https://react.dev/reference/react/Suspense?utm_source=chatgpt.com>))\n\nThis is why libraries such as TanStack Query have their own Suspense-enabled APIs and patterns.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Suspense handles supported \"not ready yet\" states.\n- Error Boundaries handle rendering errors.\n- They solve different problems.\n- They can be combined around a screen or feature.\n- A normal `useEffect` fetch does not automatically activate Suspense. ([React](<https://react.dev/reference/react/Suspense?utm_source=chatgpt.com>))"
      ],
      "commonMistakes": [
        "### ❌ Treating Suspense as a universal loading spinner\n\nIt isn't.\n\n### ❌ Expecting Error Boundaries to catch every async error\n\nError boundaries primarily handle errors during rendering and related React lifecycle work; ordinary async callbacks need their own error handling.\n\n### ❌ Putting the entire application behind one boundary\n\nFeature-level boundaries can provide better recovery."
      ],
      "quiz": [
        {
          "question": "What does Suspense primarily provide?",
          "options": [
            "A. A mechanism for showing fallback UI while supported content is not ready",
            "B. A database",
            "C. Global state",
            "D. Navigation"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn17-7",
      "title": "Component Identity, State Preservation, and Stale Closures",
      "durationMinutes": 8,
      "explanation": "⏱️ **8 min**\n\n## Explanation\n\nSome bugs look like React Native bugs.\n\nFor example:\n\n> \"Why did my input reset?\"\n\n> \"Why is this state from the previous screen still here?\"\n\n> \"Why does my callback see an old value?\"\n\nThese are often React concepts.\n\nThree important ideas are:\n\n```\nComponent identity\nState preservation\nStale closures\n```\n\n---\n\n# Component identity\n\nReact doesn't only care about what your component looks like.\n\nIt also cares about:\n\n> **Which component is this?**\n\nConsider:\n\n```\n{showProfile ? <Profile /> : <Settings />}\n```\n\nReact sees different component types:\n\n```\nProfile\n```\n\nversus:\n\n```\nSettings\n```\n\nTheir state is not interchangeable.\n\n---\n\n# Keys also affect identity\n\nConsider a list:\n\n```\nitems.map(item => (\n<Row key={item.id} item={item} />\n))\n```\n\nThe key helps React understand:\n\n```\n\"This Row represents item 123.\"\n```\n\nIf you use unstable keys, state can appear to move between items.\n\n---\n\n# State preservation\n\nReact often preserves state when the same component remains in the same position in the tree.\n\nFor example:\n\n```\nScreen\n↓\nInput\n↓\nsame component\n```\n\nReact can preserve:\n\n```\nInput text\n```\n\nBut if identity changes:\n\n```\nScreen\n↓\nDifferent component\n```\n\nstate can reset.\n\n---\n\n# Why this matters in React Native\n\nSuppose a form suddenly clears when switching between two modes.\n\nYou might blame:\n\n```\nTextInput\nReact Native\nKeyboard\n```\n\nBut the actual issue may be:\n\n```\nComponent identity changed\n      ↓\nReact created a new component\n      ↓\nState reset\n```\n\n---\n\n# Stale closures\n\nA **closure** is a function that remembers variables from the render where the function was created.\n\nFor example:\n\n```\nfunction Counter() {\nconst [count, setCount] = useState(0);\n\nfunction logCount() {\n  console.log(count);\n}\n}\n```\n\nIf a callback is created during a render where:\n\n```\ncount = 0\n```\n\nthat callback can continue seeing that value.\n\nThis becomes a problem with:\n\n```\nTimers\nSubscriptions\nEvent listeners\nAsync callbacks\nEffects\n```\n\n---\n\n# Example\n\n```\nuseEffect(() => {\nconst timer = setInterval(() => {\n  console.log(count);\n}, 1000);\n\nreturn () => clearInterval(timer);\n}, []);\n```\n\nThe Effect runs once.\n\nThe callback may keep reading the `count` from that render.\n\nThat is a stale closure problem.\n\n---\n\n# Functional state updates\n\nSometimes the correct solution is:\n\n```\nsetCount(current => current + 1);\n```\n\ninstead of:\n\n```\nsetCount(count + 1);\n```\n\nbecause React gives you the latest state value through the updater function.\n\nOther times, the correct solution is changing dependencies or using `useEffectEvent` when the logic genuinely belongs to an Effect Event.\n\n---\n\n## Visual Diagram\n\n```\nRender 1\ncount = 0\n │\n └── callback remembers 0\n\nRender 2\ncount = 1\n │\n └── old callback may still remember 0\n```\n\nThis is why some bugs look \"random.\"\n\nThey aren't necessarily random.\n\nThe function is simply holding onto an older render's values.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- React tracks component identity.\n- Keys help React identify list items.\n- Identity changes can cause state to reset.\n- Closures can capture values from older renders.\n- Stale closures often appear in Effects, timers, subscriptions, and callbacks."
      ],
      "commonMistakes": [
        "### ❌ Assuming same visual UI means same React component identity\n\nIt doesn't.\n\n### ❌ Using array indexes as keys when items can reorder\n\nThis can cause state to appear attached to the wrong item.\n\n### ❌ Ignoring stale closures\n\nThey can produce very confusing bugs."
      ],
      "quiz": [
        {
          "question": "What is a stale closure?",
          "options": [
            "A. A function using values captured from an older render",
            "B. A deleted component",
            "C. A slow network connection",
            "D. A styling bug"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn17-8",
      "title": "Effect Lifecycle and Dependency Reasoning",
      "durationMinutes": 7,
      "explanation": "⏱️ **7 min**\n\n## Explanation\n\nNow let's put everything together.\n\nAn Effect isn't:\n\n> \"Run this code after rendering.\"\n\nThat's too simplistic.\n\nA better mental model is:\n\n> **An Effect synchronizes your component with something outside React.**\n\nExamples:\n\n```\nWebSocket\nTimer\nNative subscription\nLocation listener\nExternal system\n```\n\n---\n\n# Effect lifecycle\n\nConsider:\n\n```\nuseEffect(() => {\nconst subscription = subscribe(userId);\n\nreturn () => {\n  subscription.unsubscribe();\n};\n}, [userId]);\n```\n\nThink:\n\n```\nRender\n↓\nEffect starts\n↓\nExternal system connected\n↓\nuserId changes\n↓\nCleanup old subscription\n↓\nStart new subscription\n```\n\n---\n\n# Dependencies\n\nA dependency array answers:\n\n> \"Which reactive values does this Effect use to determine whether synchronization needs to change?\"\n\nIf:\n\n```\nuseEffect(() => {\nconnect(roomId);\n}, [roomId]);\n```\n\nthen changing `roomId` means:\n\n```\nOld connection\n   ↓\nCleanup\n   ↓\nNew connection\n```\n\n---\n\n# `useEffectEvent` changes the reasoning\n\nSuppose the Effect also needs:\n\n```\ntheme\n```\n\nbut theme should only affect a notification:\n\n```\nConnection\n │\n ├── roomId → reactive\n │\n └── theme → notification only\n```\n\nNow:\n\n```\nconst onConnected = useEffectEvent(() => {\nshowNotification(theme);\n});\n\nuseEffect(() => {\nconst connection = connect(roomId);\n\nconnection.on(\"connected\", onConnected);\n\nreturn () => connection.disconnect();\n}, [roomId]);\n```\n\nThe Effect dependency describes what actually controls the connection.\n\nThe Effect Event reads the latest theme when the event occurs. ([React](<https://react.dev/reference/react/useEffectEvent?utm_source=chatgpt.com>))\n\n---\n\n# The three questions to ask\n\nWhenever you write an Effect, ask:\n\n### 1\\. What external system am I synchronizing with?\n\nIf there is no external system, you may not need an Effect.\n\n### 2\\. What values determine that synchronization?\n\nThose are reactive dependencies.\n\n### 3\\. Is there event-like logic that needs the latest values but should not restart the synchronization?\n\nThat may be a candidate for `useEffectEvent`.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Effects synchronize React with external systems.\n- Dependencies determine when synchronization needs to change.\n- Cleanup reverses the previous synchronization.\n- `useEffectEvent` separates event-like logic from reactive Effect setup.\n- Don't use Effects simply because you need to calculate a value."
      ],
      "commonMistakes": [
        "### ❌ Using `useEffect` for derived values\n\nIf:\n\n```\nfullName = firstName + lastName\n```\n\nyou usually don't need an Effect.\n\n### ❌ Empty dependency arrays everywhere\n\n`[]` does not mean \"always correct.\"\n\n### ❌ Fighting the dependency linter\n\nThe warning may be showing a real design problem."
      ],
      "quiz": [
        {
          "question": "What should an Effect generally be used for?",
          "options": [
            "A. Synchronizing with an external system",
            "B. Calculating simple derived values",
            "C. Styling text",
            "D. Defining TypeScript types"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What React version shipped with React Native 0.83?",
      "options": [
        "A. React 18",
        "B. React 19.2",
        "C. React 17",
        "D. React 20"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "If changing `theme` should not reconnect a WebSocket, but the connection callback needs the latest theme, what can help?",
      "options": [
        "A. `useEffectEvent`",
        "B. `useState` only",
        "C. `StyleSheet`",
        "D. `FlatList`"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does an optimistic update do?",
      "options": [
        "A. Updates the UI before the server confirms success",
        "B. Prevents all network requests",
        "C. Disables errors",
        "D. Stores data permanently"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What problem does `useSyncExternalStore` solve?",
      "options": [
        "A. Safely subscribing React to state managed outside React",
        "B. Styling components",
        "C. Navigating screens",
        "D. Loading images"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is the main goal of `useTransition`?",
      "options": [
        "A. Keep urgent interactions responsive while lower-priority updates happen",
        "B. Store data permanently",
        "C. Navigate between screens",
        "D. Fetch images"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does Suspense primarily provide?",
      "options": [
        "A. A mechanism for showing fallback UI while supported content is not ready",
        "B. A database",
        "C. Global state",
        "D. Navigation"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a stale closure?",
      "options": [
        "A. A function using values captured from an older render",
        "B. A deleted component",
        "C. A slow network connection",
        "D. A styling bug"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should an Effect generally be used for?",
      "options": [
        "A. Synchronizing with an external system",
        "B. Calculating simple derived values",
        "C. Styling text",
        "D. Defining TypeScript types"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which React feature separates urgent updates from non-urgent work?",
      "options": [
        "A. useTransition",
        "B. useState",
        "C. useRef",
        "D. useContext"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What determines whether React preserves a component's state?",
      "options": [
        "A. Component identity and position",
        "B. Its text color",
        "C. The file name only",
        "D. Network speed"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Replace the Ref Hack",
    "goal": "Take a component that uses a ref to keep the latest value available inside an Effect callback and rewrite it using `useEffectEvent`.",
    "brief": "---\n\n## Before\n\nYou may have something like:\n\n```\nfunction ChatRoom({ roomId, theme }) {\nconst themeRef = useRef(theme);\n\nthemeRef.current = theme;\n\nuseEffect(() => {\n  const connection = createConnection(roomId);\n\n  connection.on(\"connected\", () => {\n    showNotification(\"Connected!\", themeRef.current);\n  });\n\n  connection.connect();\n\n  return () => {\n    connection.disconnect();\n  };\n}, [roomId]);\n}\n```\n\nThe ref is acting as a manual \"latest value\" container.\n\n---\n\n## After\n\nUse:\n\n```\nfunction ChatRoom({ roomId, theme }) {\nconst onConnected = useEffectEvent(() => {\n  showNotification(\"Connected!\", theme);\n});\n\nuseEffect(() => {\n  const connection = createConnection(roomId);\n\n  connection.on(\"connected\", onConnected);\n\n  connection.connect();\n\n  return () => {\n    connection.disconnect();\n  };\n}, [roomId]);\n}\n```\n\nNow the intention is much clearer:\n\n```\nroomId\n↓\ncontrols connection\n\ntheme\n↓\nused by connection event\n```\n\nThis is exactly the kind of separation `useEffectEvent` is intended to provide. ([React](<https://react.dev/reference/react/useEffectEvent?utm_source=chatgpt.com>))",
    "steps": [],
    "acceptance": [
      "Why React 19.2 matters to modern React Native.",
      "What `useEffectEvent` solves.",
      "Why a ref hack may be unnecessary for Effect Events.",
      "What `useActionState` is trying to solve.",
      "What optimistic UI means.",
      "Why `useSyncExternalStore` exists.",
      "When `useTransition` can help.",
      "What `useDeferredValue` does.",
      "How Suspense and Error Boundaries differ.",
      "What component identity means.",
      "Why stale closures happen.",
      "How Effect dependencies should be reasoned about."
    ]
  }
});

