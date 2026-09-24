import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_41_LESSONS = normalizePastedLessonDay({
  "day": 41,
  "title": "Advanced Animation and Custom Rendering",
  "overview": "### Goal\n\nMove beyond:\n\n```text\n\"Make this view fade in.\"\n```\n\nand understand how React Native handles:\n\n```text\ngesture-driven animation\ncomplex animation chains\nshared transitions\ncustom drawing\n```\n\nYou'll also learn when **not** to reach for a graphics engine.",
  "totalMinutes": 60,
  "difficulty": "Advanced",
  "lessons": [
    {
      "id": "rn41-1",
      "title": "Why advanced animation is different",
      "durationMinutes": 4,
      "explanation": "A simple animation might be:\n\n```text\nopacity: 0 → 1\n```\n\nBut a real mobile interaction might involve:\n\n```text\nFinger moves\n    ↓\nGesture position changes\n    ↓\nCard follows finger\n    ↓\nScale changes\n    ↓\nBackground changes\n    ↓\nOther elements react\n    ↓\nRelease\n    ↓\nSpring animation\n```\n\nThat's where Reanimated becomes extremely useful.",
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
      "id": "rn41-2",
      "title": "Reanimated worklets",
      "durationMinutes": 4,
      "explanation": "A **worklet** is a function that Reanimated can execute in its animation runtime rather than treating it like an ordinary JavaScript function running on the main React JS execution path.\n\nThe important mental model is:\n\n```text\nNormal JS logic\n     ↓\nJavaScript runtime\n```\n\nwhile animation work can be:\n\n```text\nGesture\n ↓\nReanimated worklet\n ↓\nAnimation runtime\n ↓\nUI-side updates\n```\n\nThis helps animations remain responsive even when the normal JS side is busy.",
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
      "id": "rn41-3",
      "title": "Shared values",
      "durationMinutes": 4,
      "explanation": "You should already understand the basic idea of a shared value.\n\nFor example:\n\n```tsx\nconst translateX = useSharedValue(0);\n```\n\nThen:\n\n```tsx\nconst animatedStyle = useAnimatedStyle(() => ({\n transform: [\n   { translateX: translateX.value }\n ],\n}));\n```\n\nThe important part is:\n\n```text\ntranslateX.value\n      ↓\nanimated style\n      ↓\nnative/UI update\n```",
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
      "id": "rn41-4",
      "title": "Chained animations",
      "durationMinutes": 3,
      "explanation": "You don't always want:\n\n```text\nA → finish\nB → finish\nC → finish\n```\n\nYou might want:\n\n```text\nA\n↓\nB\n↓\nC\n```\n\nFor example:\n\n```tsx\ntranslateX.value = withSequence(\n withTiming(100),\n withTiming(0),\n withSpring(50)\n);\n```\n\nThe idea is:\n\n```text\nMove\n↓\nReturn\n↓\nSpring\n```\n\nYou can combine animation primitives to create more natural interactions.",
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
      "id": "rn41-5",
      "title": "`withTiming`",
      "durationMinutes": 3,
      "explanation": "`withTiming` moves a value toward a target over a configured duration/easing curve.\n\nFor example:\n\n```tsx\nopacity.value = withTiming(1, {\n duration: 300,\n});\n```\n\nThink:\n\n```text\n0\n│\n│  smooth change\n│\n1\n```\n\nGood for predictable transitions.",
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
      "id": "rn41-6",
      "title": "`withSpring`",
      "durationMinutes": 3,
      "explanation": "`withSpring` creates spring-like motion.\n\nFor example:\n\n```tsx\nscale.value = withSpring(1);\n```\n\nInstead of:\n\n```text\n0.8 ───────────→ 1\n```\n\nyou get behavior closer to:\n\n```text\n0.8\n↓\n1.05\n↓\n0.98\n↓\n1.01\n↓\n1\n```\n\ndepending on the configuration.\n\nThis often feels more natural for gestures and interactive UI.",
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
      "id": "rn41-7",
      "title": "Gesture-driven animation",
      "durationMinutes": 3,
      "explanation": "This is where Reanimated becomes particularly powerful.\n\nImagine a draggable card.\n\n```text\nFinger\n ↓\nGesture translation\n ↓\nShared value\n ↓\nAnimated style\n ↓\nCard follows finger\n```\n\nConceptually:\n\n```tsx\nconst translateX = useSharedValue(0);\n\nconst gesture = Gesture.Pan()\n .onUpdate((event) => {\n   translateX.value = event.translationX;\n });\n```\n\nThen:\n\n```tsx\nconst animatedStyle = useAnimatedStyle(() => ({\n transform: [\n   { translateX: translateX.value }\n ],\n}));\n```\n\nNow the animation is directly connected to the gesture.",
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
      "id": "rn41-8",
      "title": "Gesture + spring",
      "durationMinutes": 3,
      "explanation": "A common interaction is:\n\n```text\nDrag\n↓\nFollow finger\n↓\nRelease\n↓\nSpring back\n```\n\nConceptually:\n\n```tsx\n.onEnd(() => {\n translateX.value = withSpring(0);\n});\n```\n\nThis pattern appears in:\n\n```text\nbottom sheets\nswipe cards\ndrag-and-drop\ndismissible rows\ninteractive sliders\ncarousels\n```",
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
      "id": "rn41-9",
      "title": "Chained animation example",
      "durationMinutes": 3,
      "explanation": "Imagine a card being dismissed.\n\nYou could coordinate:\n\n```text\ntranslateX\n   ↓\ncard moves away\n\nopacity\n   ↓\ncard fades\n\nscale\n   ↓\ncard becomes slightly smaller\n```\n\nConceptually:\n\n```tsx\ntranslateX.value = withTiming(500);\n\nopacity.value = withTiming(0);\n\nscale.value = withTiming(0.8);\n```\n\nThese values can change together.",
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
      "id": "rn41-10",
      "title": "Shared element transitions",
      "durationMinutes": 3,
      "explanation": "A **shared element transition** means an element visually transforms from its position on one screen into its corresponding position on another screen.\n\nFor example:\n\n```text\nLIST SCREEN\n\n┌───────────────────┐\n│ 🖼 Product        │\n│    $49            │\n└───────────────────┘\n         │\n         │ tap\n         ↓\nDETAIL SCREEN\n\n      ┌──────────────┐\n      │              │\n      │    🖼        │\n      │              │\n      └──────────────┘\n```\n\nInstead of:\n\n```text\nold screen disappears\n       ↓\nnew screen appears\n```\n\nthe image appears to physically move between screens.\n\nThis makes the UI feel connected.",
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
      "id": "rn41-11",
      "title": "Why shared transitions are useful",
      "durationMinutes": 3,
      "explanation": "They work especially well for:\n\n```text\nimage galleries\nproduct lists\nprofile pictures\narticles\ncards → detail screens\n```\n\nFor example:\n\n```text\nProduct list\n  ↓\nTap product\n  ↓\nProduct image expands\n  ↓\nDetail screen\n```\n\nThe user visually understands:\n\n> \"This is the same thing I just selected.\"",
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
      "id": "rn41-12",
      "title": "Don't animate everything",
      "durationMinutes": 3,
      "explanation": "A common beginner mistake is:\n\n```text\n\"Animation looks cool.\"\n```\n\nand then adding animation everywhere.\n\nThat can make an application:\n\n```text\nslower\ndistracting\nharder to navigate\nharder to maintain\n```\n\nAnimation should communicate something.\n\nGood examples:\n\n```text\nfeedback\ncontinuity\nspatial relationship\nstate change\ngesture response\n```",
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
      "id": "rn41-13",
      "title": "What is React Native Skia?",
      "durationMinutes": 3,
      "explanation": "**React Native Skia** gives you a powerful 2D graphics API inside React Native.\n\nIt is useful when standard React Native views aren't the right abstraction.\n\nThink:\n\n```text\nNormal UI\n  ↓\nView\nText\nImage\nPressable\n```\n\nversus:\n\n```text\nCustom graphics\n  ↓\nSkia\n  ↓\nCanvas / paths / shapes / effects\n```",
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
      "id": "rn41-14",
      "title": "What can Skia do?",
      "durationMinutes": 3,
      "explanation": "Skia can be used for things such as:\n\n```text\ncustom charts\ndrawing\ngraphs\ncustom shapes\nvisual effects\ngames\ncustom progress indicators\ncomplex illustrations\nimage manipulation\n```\n\nFor example:\n\n```text\n     ╭──────╮\n  ╭──╯      ╰──╮\n───╯            ╰──\n```\n\nA chart like this may be better represented as graphics rather than hundreds of React Native views.",
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
      "id": "rn41-15",
      "title": "Native components vs Skia",
      "durationMinutes": 3,
      "explanation": "This is an important decision.\n\n### Use normal React Native components when:\n\n```text\nbuttons\nforms\nlists\ncards\nnavigation\nsettings\ntext\nstandard UI\n```\n\nFor example:\n\n```tsx\n<View>\n <Text>Profile</Text>\n <Pressable>\n   <Text>Edit</Text>\n </Pressable>\n</View>\n```\n\nYou don't need Skia for this.",
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
      "id": "rn41-16",
      "title": "Use Skia when the problem is actually graphics",
      "durationMinutes": 3,
      "explanation": "Imagine you need:\n\n```text\ncomplex drawing\ninteractive chart\ncustom path\nparticle-like visual\ncanvas-based editor\nadvanced visual effect\n```\n\nThat's where Skia starts making sense.\n\nMental model:\n\n```text\nIs this standard application UI?\n      │\n   Yes ─────→ React Native components\n      │\n     No\n      ↓\nIs this custom 2D graphics?\n      │\n   Yes ─────→ Skia may fit\n```",
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
      "id": "rn41-17",
      "title": "Don't use Skia to solve normal layout",
      "durationMinutes": 3,
      "explanation": "This would be unnecessary:\n\n```text\nDraw a rectangle with Skia\n      ↓\nPut text on it\n      ↓\nBuild a button manually\n```\n\nwhen you could simply use:\n\n```tsx\n<View>\n <Text>Save</Text>\n</View>\n```\n\nStandard components give you:\n\n```text\naccessibility\nlayout\ntext handling\ntouch behavior\nplatform behavior\n```\n\nYou don't want to rebuild all of that unnecessarily.",
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
      "id": "rn41-18",
      "title": "Reanimated + Skia",
      "durationMinutes": 3,
      "explanation": "These tools solve different problems.\n\nThink:\n\n```text\nReanimated\n   ↓\n\"When should this value move?\"\n```\n\nwhile:\n\n```text\nSkia\n   ↓\n\"How should this custom graphic be drawn?\"\n```\n\nThey can work together.\n\nFor example:\n\n```text\nGesture\n  ↓\nReanimated shared value\n  ↓\nSkia drawing\n  ↓\nInteractive graphic\n```\n\nThis is useful for things like:\n\n```text\ninteractive charts\ndrawing tools\ncustom gestures\nvisual editors\n```",
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
      "id": "rn41-19",
      "title": "Advanced animation mental model",
      "durationMinutes": 3,
      "explanation": "At this point you should think about animation like this:\n\n```text\n            User gesture\n                 ↓\n            Gesture system\n                 ↓\n         Reanimated shared value\n                 ↓\n            Worklet logic\n                 ↓\n      ┌──────────┴──────────┐\n      ↓                     ↓\nReact Native view         Skia\n      ↓                     ↓\nStandard UI             Custom graphics\n```\n\nYou don't need Skia for every animation.\n\nYou don't need Reanimated for every simple state transition.\n\nChoose the tool based on the problem.",
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
      "question": "Why are advanced animations different from simple transitions?",
      "options": [
        "A. They often combine continuous gestures, physics, coordination, and custom rendering",
        "B. They always require a WebView",
        "C. They cannot run on mobile",
        "D. They replace navigation"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a Reanimated worklet?",
      "options": [
        "A. A function that can run in Reanimated's UI runtime",
        "B. A server mutation",
        "C. A build profile",
        "D. A test snapshot"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a shared value?",
      "options": [
        "A. A value designed to drive animation work across the Reanimated runtime",
        "B. A global password",
        "C. A store review note",
        "D. A query key"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a chained animation?",
      "options": [
        "A. A sequence where one animation begins after or alongside another",
        "B. A native build pipeline",
        "C. A dependency audit",
        "D. A navigation type"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "When is withTiming useful?",
      "options": [
        "A. When a value should animate toward a target over a duration",
        "B. When simulating spring physics",
        "C. When uploading an AAB",
        "D. When creating a source map"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "When is withSpring useful?",
      "options": [
        "A. When motion should follow spring-like physics",
        "B. When submitting metadata",
        "C. When mocking a module",
        "D. When rotating a token"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should drive a gesture-based animation?",
      "options": [
        "A. Continuous gesture values such as translation or velocity",
        "B. Console logs",
        "C. Store screenshots",
        "D. Build numbers"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What links two screens in a shared element transition?",
      "options": [
        "A. A stable shared transition identity for the corresponding element",
        "B. A refresh token",
        "C. A source-map ID",
        "D. A test matcher"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "When is Skia appropriate?",
      "options": [
        "A. When the problem needs custom graphics, drawing, shaders, or canvas rendering",
        "B. For ordinary text layout",
        "C. For every button",
        "D. For API caching"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why should advanced animation avoid unnecessary JavaScript-thread dependency?",
      "options": [
        "A. A busy JavaScript thread can otherwise interrupt responsiveness",
        "B. JavaScript cannot hold values",
        "C. Native code has no UI thread",
        "D. It prevents store review"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Advanced Animation Self-check",
    "goal": "Build a product-list-to-detail shared element transition.",
    "brief": "Build:\n\n```text\nProduct List\n```\n\nwith items such as:\n\n```text\n┌─────────────────────┐\n│ 🖼 Product A   $20   │\n└─────────────────────┘\n\n┌─────────────────────┐\n│ 🖼 Product B   $30   │\n└─────────────────────┘\n```\n\nWhen the user taps an item:\n\n```text\nList item\n   ↓\ntap\n   ↓\nDetail screen\n```\n\nThe selected image should transition visually into its larger position on the detail screen.\n\nYour goal isn't just:\n\n```text\n\"navigate to another screen\"\n```\n\nIt should feel like:\n\n```text\nList image\n    ↓\nexpands/moves\n    ↓\nDetail image\n```\n\n### After completing it, you should be able to explain:\n\n* What part is handled by navigation.\n* What part is handled by Reanimated.\n* How the shared element knows which item is being transitioned.\n* Why you wouldn't use Skia just to create the product card.\n* A situation where Skia **would** be justified.\n* Why animation logic should avoid unnecessarily depending on the normal JS execution path.\n\n---\n\n### How Days 40–41 fit the overall track\n\nYou now have a useful progression:\n\n```text\nDay 33  Observability\n  ↓\nDay 34  Mobile security\n  ↓\nDay 35  Auth + supply chain\n  ↓\nDay 36  CI/CD\n  ↓\nDay 37  OTA + versioning\n  ↓\nDay 38  iOS submission\n  ↓\nDay 39  Android submission\n  ↓\nDay 40  Release management\n  ↓\nDay 41  Advanced animation + rendering\n```\n\nSo Day 40 teaches **how to safely operate releases**, while Day 41 moves back into **advanced client-side engineering**.",
    "steps": [],
    "acceptance": [
      "Navigate from a selected product to its detail screen.",
      "Animate the selected image into its detail position.",
      "Explain how the shared element is identified.",
      "Explain what navigation and Reanimated each handle.",
      "Identify when Skia would and would not be justified."
    ]
  }
});

