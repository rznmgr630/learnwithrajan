import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_ELECTIVE_C_LESSONS = normalizePastedLessonDay({
  "day": 48,
  "label": {
    "en": "Elective C",
    "np": "Elective C",
    "jp": "選択科目 C"
  },
  "title": "Beyond Phones",
  "overview": "Learn how React Native concepts change when the target device is no longer a conventional phone. You will work through **TVs, constrained wearable experiences, and visionOS**, while learning how to decide what should be shared and what should be platform-specific.",
  "totalMinutes": 60,
  "difficulty": "Advanced",
  "lessons": [
    {
      "id": "rn-elective-c-1",
      "title": "React Native beyond the phone",
      "durationMinutes": 4,
      "explanation": "React Native is often introduced as:\n\n> Build an iOS and Android app from one codebase.\n\nThat mental model becomes incomplete when targeting other device categories.\n\nA phone gives you:\n\n* Touch\n* A relatively large screen\n* Frequent interaction\n* Camera and sensors\n* On-screen keyboard\n* Usually reliable connectivity\n* Battery constraints, but relatively large resources\n\nA TV, wearable, or spatial device changes these assumptions.\n\n```text\n                    Shared React Native Core\n                             │\n          ┌──────────────────┼──────────────────┐\n          │                  │                  │\n       Phone               TV              Wearable\n          │                  │                  │\n       Touch             Remote/D-pad       Tiny screen\n       Gestures          Focus navigation   Short sessions\n       Keyboard          Large UI           Limited resources\n          │                  │                  │\n          └──────────────────┼──────────────────┘\n                             │\n                         visionOS\n                             │\n                    Spatial interaction\n                    Different UI model\n```\n\nThe important lesson:\n\n> **React Native can share code, but it cannot make different devices behave like the same device.**\n\n---\n\n# React Native for TV",
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
      "id": "rn-elective-c-2",
      "title": "Android TV",
      "durationMinutes": 4,
      "explanation": "Android TV changes the interaction model significantly.\n\nOn a phone:\n\n```text\nUser\n ↓\nTouch\n ↓\nButton\n```\n\nOn a TV:\n\n```text\nUser\n ↓\nRemote / D-pad\n ↓\nFocus movement\n ↓\nFocused element\n ↓\nSelect\n```\n\nThe user isn't directly touching the UI.\n\nThis means your application needs to think about:\n\n* Focus\n* Directional navigation\n* Selection\n* Back navigation\n* Large-screen layouts\n* Remote-control input\n* Focus visibility\n* Screen distance\n\nA mobile interface that works perfectly with touch may be frustrating on TV.\n\n### Focus is the key concept\n\nImagine:\n\n```text\n┌─────────┐ ┌─────────┐ ┌─────────┐\n│ Movie 1 │ │ Movie 2 │ │ Movie 3 │\n└─────────┘ └─────────┘ └─────────┘\n      ↑\n    Focus\n```\n\nPressing right:\n\n```text\nMovie 1 → Movie 2 → Movie 3\n```\n\nPressing left:\n\n```text\nMovie 3 → Movie 2 → Movie 1\n```\n\nYour UI therefore needs a **focus model**, not just a touch model.\n\n### What should be shared?\n\nUsually:\n\n```text\nShared\n├── API calls\n├── authentication\n├── business rules\n├── data models\n├── caching\n└── state management\n\nTV-specific\n├── focus behavior\n├── remote input\n├── large-screen layout\n└── TV-specific navigation\n```\n\n---\n\n# tvOS",
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
      "id": "rn-elective-c-3",
      "title": "Apple TV and tvOS",
      "durationMinutes": 4,
      "explanation": "tvOS has similar high-level challenges but is not simply “iOS with a bigger screen.”\n\nYou need to think about:\n\n* Focus-driven navigation\n* Remote interaction\n* Large-screen typography\n* TV-safe layouts\n* Different interaction expectations\n* tvOS-specific APIs/capabilities\n\nThe important architecture is:\n\n```text\n                    Shared Feature\n                         │\n              ┌──────────┴──────────┐\n              │                     │\n          iOS UI                 tvOS UI\n              │                     │\n           Touch                 Focus\n```\n\nThe underlying feature can remain shared while presentation and interaction differ.",
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
      "id": "rn-elective-c-4",
      "title": "Designing for remote and D-pad navigation",
      "durationMinutes": 4,
      "explanation": "A common mistake is trying to make a mobile layout work unchanged on TV.\n\nInstead, design around **spatial navigation**.\n\nExample:\n\n```text\n        [ A ] [ B ] [ C ]\n\n        [ D ] [ E ] [ F ]\n\n        [ G ] [ H ] [ I ]\n```\n\nThe remote effectively moves the user through a spatial graph:\n\n```text\n       ↑\n       │\n←──── [E] ────→\n       │\n       ↓\n```\n\nThis means component design should consider:\n\n* What receives focus?\n* Where does focus go next?\n* How does the user know what is focused?\n* What happens when focus reaches an edge?\n* Does the back button behave predictably?\n\n### Common mistake\n\n```tsx\n<Pressable onPress={...}>\n  ...\n</Pressable>\n```\n\nand assuming the same component automatically provides a good TV experience.\n\nThe interaction model is fundamentally different.",
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
      "id": "rn-elective-c-5",
      "title": "Wearables and constrained screens",
      "durationMinutes": 4,
      "explanation": "Wearables introduce a different problem.\n\nThe biggest constraint is often not rendering technology.\n\nIt is **interaction density**.\n\nA watch screen might be:\n\n```text\n┌─────────────┐\n│  10:32 AM   │\n│             │\n│   72 bpm    │\n│             │\n│   [Start]   │\n└─────────────┘\n```\n\nYou cannot simply shrink a phone interface.\n\n### Wearable design principles\n\nPrefer:\n\n* Short interactions\n* Clear primary actions\n* Minimal navigation\n* Large touch targets\n* Minimal text\n* Important information first\n* Offline capability\n* Fast startup\n* Efficient synchronization\n\nAvoid:\n\n* Complex forms\n* Deep navigation\n* Large data-entry workflows\n* Long lists unless absolutely necessary\n* Heavy background processing",
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
      "id": "rn-elective-c-6",
      "title": "Companion-device architecture",
      "durationMinutes": 4,
      "explanation": "A wearable often works together with a phone.\n\nInstead of:\n\n```text\nWearable → Backend\n```\n\nyou may have:\n\n```text\n             Backend\n                │\n          ┌─────┴─────┐\n          │           │\n       Phone       Wearable\n          │           │\n          └───────────┘\n        synchronization\n```\n\nThis introduces additional concerns:\n\n* Synchronization\n* Connectivity loss\n* Offline state\n* Data freshness\n* Battery consumption\n* Retry behavior\n* Conflict resolution\n\nFor example:\n\n```text\nPhone:\nsteps = 8,420\n\nWearable:\nsteps = 8,500\n```\n\nYour architecture needs a clear rule for how those values are reconciled.\n\nThis is where your backend/system-design knowledge becomes useful even though you're building a mobile interface.",
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
      "id": "rn-elective-c-7",
      "title": "Constrained-device engineering",
      "durationMinutes": 4,
      "explanation": "A constrained device has fewer resources available.\n\nThink about:\n\n* CPU\n* Memory\n* Battery\n* Storage\n* Network\n* Screen size\n* Input methods\n\nA feature that is acceptable on a phone may be inappropriate on a wearable.\n\nFor example:\n\n```text\nPhone:\nfetch → process → render 500 records\n\nWearable:\nfetch → process → render 10 records\n```\n\nThe correct solution isn't necessarily “optimize React.”\n\nSometimes the correct solution is **changing the amount of work the device performs**.",
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
      "id": "rn-elective-c-8",
      "title": "visionOS",
      "durationMinutes": 4,
      "explanation": "visionOS introduces another major shift.\n\nInstead of:\n\n```text\nscreen\n```\n\nyou start thinking about:\n\n```text\nspace\n```\n\nA traditional mobile application:\n\n```text\n┌────────────────────────┐\n│                        │\n│        Content         │\n│                        │\n└────────────────────────┘\n```\n\nA spatial experience can involve:\n\n```text\n             Object\n               │\n        ┌──────┴──────┐\n        │             │\n     Window         Volume\n        │\n     Spatial\n   environment\n```\n\nThe interaction model may involve:\n\n* Gaze\n* Hand gestures\n* Spatial positioning\n* Windows\n* Volumes\n* Immersive experiences\n\nThis means simply sharing the mobile UI isn't always desirable.",
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
      "id": "rn-elective-c-9",
      "title": "What can be shared with visionOS?",
      "durationMinutes": 4,
      "explanation": "You may share:\n\n```text\n✓ API layer\n✓ Authentication\n✓ Domain models\n✓ Validation\n✓ Business rules\n✓ State logic\n✓ Networking\n✓ Data transformation\n```\n\nBut potentially separate:\n\n```text\n✗ Navigation\n✗ Spatial interaction\n✗ Layout\n✗ Gestures\n✗ Platform-specific UI\n✗ Immersive experiences\n```\n\nThe architecture becomes:\n\n```text\n             Shared Domain\n                   │\n        ┌──────────┼──────────┐\n        │          │          │\n       iOS       Android   visionOS\n        │          │          │\n     Touch       Touch     Spatial\n     UI           UI       UI\n```",
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
      "id": "rn-elective-c-10",
      "title": "Where “write once” actually works",
      "durationMinutes": 4,
      "explanation": "A useful way to think about React Native is to divide your application into layers.\n\n### High sharing\n\n```text\nBusiness rules       ██████████\nAPI client            ██████████\nData models           ██████████\nValidation            ██████████\nState logic           █████████░\nCaching               █████████░\n```\n\n### Medium sharing\n\n```text\nDesign tokens         ████████░░\nComponents            ██████░░░░\nNavigation            ████░░░░░░\n```\n\n### Low sharing\n\n```text\nNative APIs           ██░░░░░░░░\nPlatform interaction  ██░░░░░░░░\nSpatial UI            █░░░░░░░░░\nTV focus              █░░░░░░░░░\n```\n\nThe exact boundary depends on the product.",
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
      "id": "rn-elective-c-11",
      "title": "The platform-adapter pattern",
      "durationMinutes": 4,
      "explanation": "Instead of:\n\n```tsx\nif (Platform.OS === \"android\") {\n  // 50 lines\n}\n\nif (Platform.OS === \"ios\") {\n  // 50 lines\n}\n\nif (Platform.OS === \"tv\") {\n  // 50 lines\n}\n```\n\nprefer a platform boundary.\n\n```text\nFeature\n  │\n  ├── shared business logic\n  │\n  └── platform adapter\n          ├── iOS\n          ├── Android\n          ├── TV\n          └── visionOS\n```\n\nThis keeps platform differences contained.",
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
      "id": "rn-elective-c-12",
      "title": "Where “write once” breaks",
      "durationMinutes": 4,
      "explanation": "The biggest mistake is believing:\n\n> React Native means every platform should use exactly the same UI.\n\nInstead:\n\n> **Share what represents the product; specialize what represents the platform.**\n\nFor example:\n\n```text\nCheckout business rules\n        ↓\n      Shared\n        ↓\n ┌──────┼────────┐\n │      │        │\nPhone   Web      TV\n │      │        │\nTouch   Mouse    Remote\n```\n\nThe checkout rules can be identical.\n\nThe interaction doesn't have to be.",
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
      "question": "What changes most when React Native targets a TV?",
      "options": [
        "The interaction model becomes focus-driven",
        "TypeScript stops working",
        "APIs cannot be shared",
        "State management is removed"
      ],
      "correctIndex": 0,
      "explanation": "TV interfaces are controlled through focus, remotes, and directional navigation."
    },
    {
      "question": "What should usually remain shared between phone and TV apps?",
      "options": [
        "Touch gestures",
        "The API, domain rules, and data models",
        "Focus styling",
        "Screen composition"
      ],
      "correctIndex": 1,
      "explanation": "Business logic and data layers are strong sharing candidates."
    },
    {
      "question": "What must a D-pad interface make visually clear?",
      "options": [
        "The current focused element",
        "The Metro version",
        "The bundle ID",
        "The database schema"
      ],
      "correctIndex": 0,
      "explanation": "Users need a strong focus indicator because they cannot touch the target directly."
    },
    {
      "question": "Why should a wearable avoid copying a phone screen?",
      "options": [
        "Wearables do not support JavaScript",
        "Wearables favor brief, constrained interactions",
        "Wearables have no networking",
        "Wearables cannot display text"
      ],
      "correctIndex": 1,
      "explanation": "Small screens, short sessions, and limited resources require a focused experience."
    },
    {
      "question": "What is a common companion-device architecture?",
      "options": [
        "The wearable owns every business rule",
        "The phone and companion coordinate around shared domain data",
        "The TV stores all credentials",
        "Every platform duplicates the API"
      ],
      "correctIndex": 1,
      "explanation": "Companion experiences coordinate with a primary device while sharing domain concepts."
    },
    {
      "question": "What is the safest place for platform differences?",
      "options": [
        "Scattered through every component",
        "Inside focused platform adapters and presentation layers",
        "Inside API response data",
        "Inside test names"
      ],
      "correctIndex": 1,
      "explanation": "Adapters keep platform-specific behavior behind a clear boundary."
    },
    {
      "question": "Why does visionOS require a different UX approach?",
      "options": [
        "It removes React",
        "It introduces spatial interaction and presentation",
        "It only supports lists",
        "It behaves exactly like iOS"
      ],
      "correctIndex": 1,
      "explanation": "Spatial devices change interaction, layout, and environmental assumptions."
    },
    {
      "question": "When does write-once work best?",
      "options": [
        "For shared domain logic and stable primitives",
        "For every platform screen",
        "For all navigation",
        "For remote focus behavior"
      ],
      "correctIndex": 0,
      "explanation": "Stable product rules can be shared more safely than platform interaction."
    },
    {
      "question": "When is sharing harmful?",
      "options": [
        "When it forces unlike platforms into one compromised UX",
        "Whenever TypeScript is used",
        "Whenever APIs are cached",
        "When tests are shared"
      ],
      "correctIndex": 0,
      "explanation": "Sharing is harmful when platform needs become conditionals and compromises."
    },
    {
      "question": "What should guide a multi-device architecture?",
      "options": [
        "Maximum line reuse",
        "The right shared core with device-specific interaction",
        "One layout for every screen",
        "No platform adapters"
      ],
      "correctIndex": 1,
      "explanation": "Share product behavior while preserving the interaction model of each device."
    }
  ],
  "project": {
    "name": "Multi-platform Feature Architecture",
    "goal": "Design one feature for phones, TVs, constrained devices, and visionOS without forcing them into the same UI.",
    "brief": "## Multi-platform Feature Architecture\n\nBuild one feature and design it for:\n\n* Phone\n* TV\n* Wearable/constrained device\n* visionOS conceptually\n\nThe goal isn't necessarily to ship every target.\n\nThe goal is to demonstrate **platform-aware architecture**.\n\n### Example\n\nBuild a media experience:\n\n```text\n                Media Domain\n                     │\n        ┌────────────┼────────────┐\n        │            │            │\n      Phone          TV       Wearable\n        │            │            │\n      Touch        Remote     Quick action\n```\n\n### Acceptance criteria\n\n* Shared API/domain layer\n* Platform-specific presentation where required\n* TV focus model documented\n* Wearable constraints documented\n* visionOS adaptation documented\n* Clear explanation of what is shared and why\n* Clear explanation of what is platform-specific and why\n\n### Self-check\n\nYou should be able to answer:\n\n1. Why shouldn't the TV simply reuse the phone UI?\n2. What makes wearable development different?\n3. Which layers can be shared?\n4. Where does platform-specific code belong?\n5. Why does visionOS require a different interaction model?\n6. When is “write once” actually harmful?\n\n---",
    "steps": [],
    "acceptance": [
      "Share the API and domain layer.",
      "Document the TV focus model.",
      "Document wearable constraints.",
      "Document the visionOS adaptation.",
      "Explain every shared and platform-specific boundary."
    ]
  }
});

