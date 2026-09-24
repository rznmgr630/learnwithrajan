import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_37_LESSONS = normalizePastedLessonDay({
  "day": 37,
  "title": "OTA Updates and Versioning",
  "overview": "### Goal\n\nUnderstand the difference between:\n\n```text\nStore release\n```\n\nand:\n\n```text\nOTA JavaScript update\n```\n\nand know exactly when an OTA update is safe and when you must create a new native build.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn37-1",
      "title": "What is an OTA update?",
      "durationMinutes": 5,
      "explanation": "**OTA** means **Over The Air**.\n\nInstead of asking users to download a completely new application from the App Store or Google Play, you can distribute compatible JavaScript/asset changes remotely.\n\nWith EAS Update, the basic idea is:\n\n```text\nExisting installed app\n       ↓\nChecks for compatible update\n       ↓\nDownloads JS/assets\n       ↓\nRuns newer code\n```\n\nThis can be much faster than waiting for a store release.",
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
      "id": "rn37-2",
      "title": "The most important limitation",
      "durationMinutes": 5,
      "explanation": "This is the rule you absolutely need to remember:\n\n> **OTA updates cannot magically add or change native code that isn't already inside the installed binary.**\n\nSuppose your installed application already contains:\n\n```text\nNative binary\n   +\nReact Native JavaScript\n```\n\nAn OTA update can replace compatible:\n\n```text\nJavaScript\nassets\n```\n\nBut it cannot turn the existing binary into a completely different native application.\n\nFor example, if you add a new native module:\n\n```text\nOld binary\n└── Native modules A, B, C\n```\n\nand your new JS expects:\n\n```text\nNative modules A, B, C, D\n```\n\nthe old installed binary does not magically acquire module D.\n\nYou need:\n\n```text\nnew native build\n     ↓\nApp Store / Google Play\n```",
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
      "id": "rn37-3",
      "title": "OTA vs store release",
      "durationMinutes": 5,
      "explanation": "Think of the decision like this:\n\n```text\nDid native code change?\n       │\n    ┌──┴──┐\n    │     │\n   Yes    No\n    │     │\n    ↓     ↓\nStore    OTA may\nrelease  be suitable\n```\n\nExamples of changes that **may** fit an OTA update:\n\n```text\nReact component changes\nJavaScript bug fixes\ncopy/text changes\nsome styling changes\ncompatible JS logic changes\n```\n\nChanges requiring a new native build can include:\n\n```text\nnew native dependency\nnative module changes\niOS native configuration changes\nAndroid native configuration changes\npermissions requiring native manifest/config changes\nchanges to native code\nchanges requiring a different native runtime\n```\n\nThe exact compatibility depends on the installed binary and update configuration.",
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
      "id": "rn37-4",
      "title": "Why this matters",
      "durationMinutes": 5,
      "explanation": "Imagine you discover this bug:\n\n```text\nProduction bug:\n\"Checkout button doesn't work.\"\n```\n\nYou determine:\n\n```text\nJavaScript bug\n```\n\nand the installed binary already supports everything your fixed code needs.\n\nAn OTA update might allow:\n\n```text\nFix\n↓\nEAS Update\n↓\nUsers receive fix\n```\n\nwithout waiting for store review.\n\nBut imagine:\n\n```text\nCrash caused by missing native module\n```\n\nAn OTA update isn't enough.\n\nYou need:\n\n```text\nNative code\n↓\nnew build\n↓\nstore release\n```",
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
      "id": "rn37-5",
      "title": "Version vs build number",
      "durationMinutes": 5,
      "explanation": "Mobile versioning has multiple concepts.\n\nA simple way to understand them:\n\n### Version\n\nThis is the user-facing application version.\n\nFor example:\n\n```text\n1.4.0\n```\n\nUsers might see:\n\n```text\nVersion 1.4.0\n```\n\n### Build number\n\nThis identifies a particular build of that version.\n\nFor example:\n\n```text\n1.4.0 (build 127)\n```\n\nThe exact implementation differs between Android and iOS, but conceptually:\n\n```text\nVersion\n  ↓\nWhat release is this?\n\nBuild number\n  ↓\nWhich particular binary is this?\n```",
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
      "id": "rn37-6",
      "title": "Why build numbers matter",
      "durationMinutes": 5,
      "explanation": "Suppose you upload:\n\n```text\n1.4.0 build 100\n```\n\nThen you fix something and build again:\n\n```text\n1.4.0 build 101\n```\n\nThe user-facing version can remain:\n\n```text\n1.4.0\n```\n\nwhile the build identifier increases.\n\nA later release could become:\n\n```text\n1.5.0 build 120\n```\n\nThe exact versioning strategy is a team decision, but the important thing is to keep it predictable.",
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
      "id": "rn37-7",
      "title": "iOS and Android versioning",
      "durationMinutes": 5,
      "explanation": "You need to understand that iOS and Android don't use exactly the same native terminology.\n\nConceptually:\n\n```text\n                   App version\n                       │\n            ┌──────────┴──────────┐\n            ↓                     ↓\n          iOS                   Android\n            │                     │\n     marketing version       versionName\n     build number            versionCode\n```\n\nThe values need to be managed consistently.\n\nFor example:\n\n```text\nUser-facing:\n1.5.0\n\niOS:\n1.5.0 / build 120\n\nAndroid:\n1.5.0 / versionCode 120\n```\n\nYour CI/CD pipeline should make it difficult to accidentally upload an old build number.",
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
      "id": "rn37-8",
      "title": "Update channels",
      "durationMinutes": 5,
      "explanation": "An OTA update should not necessarily go to everyone immediately.\n\nYou might have:\n\n```text\ndevelopment\nstaging\nproduction\n```\n\nand potentially production release channels/branches designed for controlled rollout.\n\nConceptually:\n\n```text\n                EAS Update\n                    │\n            ┌───────┴───────┐\n            ↓               ↓\n         Testing          Production\n                            │\n                   ┌────────┴────────┐\n                   ↓                 ↓\n                 Group A          Group B\n```\n\nThis allows you to test an update before exposing it broadly.",
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
      "id": "rn37-9",
      "title": "Staged rollout",
      "durationMinutes": 4,
      "explanation": "Imagine you have:\n\n```text\n100,000 users\n```\n\nYou don't necessarily want a risky update to reach everyone immediately.\n\nA staged strategy could conceptually look like:\n\n```text\n5%\n↓\nverify\n↓\n25%\n↓\nverify\n↓\n50%\n↓\nverify\n↓\n100%\n```\n\nDuring each stage, you monitor:\n\n```text\ncrashes\nstartup failures\nAPI errors\nuser reports\nperformance\nupdate adoption\n```\n\nIf something goes wrong:\n\n```text\npause rollout\n```\n\nThis is much safer than blindly sending an update to everyone.",
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
      "id": "rn37-10",
      "title": "OTA updates and compatibility",
      "durationMinutes": 4,
      "explanation": "Imagine your installed application has:\n\n```text\nNative runtime: 1.5\n```\n\nYour OTA update expects:\n\n```text\nNative runtime: 2.0\n```\n\nThat can be a problem.\n\nThe JavaScript update must be compatible with the native binary that is already installed.\n\nThis is why OTA systems use compatibility concepts such as **runtime versions**.\n\nThink:\n\n```text\nNative binary\n    │\n    ↓\nRuntime compatibility\n    │\n    ↓\nOTA JavaScript\n```\n\nIf the native runtime doesn't match what the update expects, that update should not be delivered to that binary.",
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
      "id": "rn37-11",
      "title": "When OTA is the wrong fix",
      "durationMinutes": 4,
      "explanation": "Don't use OTA simply because it is faster.\n\nAsk:\n\n```text\nDoes the fix require native changes?\n```\n\nIf yes:\n\n```text\nOTA ❌\nStore build ✅\n```\n\nAlso consider whether the change is too risky to distribute remotely.\n\nFor example:\n\n```text\nMajor authentication architecture change\nMajor native dependency change\nLarge migration\nBreaking native/API compatibility\n```\n\nYou may prefer a full store release even when some JavaScript-only path technically could be updated OTA.",
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
      "id": "rn37-12",
      "title": "Example decision",
      "durationMinutes": 4,
      "explanation": "Suppose you discover:\n\n### Bug A\n\n```text\nWrong button text\n```\n\nPotentially:\n\n```text\nOTA ✅\n```\n\n### Bug B\n\n```text\nIncorrect JavaScript calculation\n```\n\nPotentially:\n\n```text\nOTA ✅\n```\n\n### Bug C\n\n```text\nNew native biometric library required\n```\n\n```text\nOTA ❌\nStore release ✅\n```\n\n### Bug D\n\n```text\nNew Android permission configuration required\n```\n\n```text\nOTA ❌\nStore release ✅\n```\n\nThe important question isn't:\n\n> \"Can I upload this quickly?\"\n\nThe question is:\n\n> **\"Can the currently installed native binary safely run this new JavaScript?\"**",
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
      "id": "rn37-13",
      "title": "Day 37 workflow",
      "durationMinutes": 4,
      "explanation": "A production OTA workflow could look like:\n\n```text\nDeveloper fixes JS bug\n       ↓\nRun tests\n       ↓\nCreate EAS Update\n       ↓\nTarget controlled channel\n       ↓\nSmall group receives update\n       ↓\nMonitor\n       ↓\nNo problems?\n       ↓\nExpand rollout\n       ↓\nAll users\n```\n\nIf native code changed:\n\n```text\nDeveloper changes native code\n       ↓\nEAS Build\n       ↓\nNew Android/iOS binary\n       ↓\nStore submission\n       ↓\nStore review/release\n```",
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
      "question": "What does an OTA update normally deliver?",
      "options": [
        "A. Compatible JavaScript and asset changes",
        "B. A new native module binary",
        "C. A new signing certificate",
        "D. A new device OS"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is the most important OTA limitation?",
      "options": [
        "A. It cannot add native code that is absent from the installed binary",
        "B. It cannot change text",
        "C. It cannot update images",
        "D. It always requires store review"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "When is a store release required?",
      "options": [
        "A. When native code or native configuration changes",
        "B. For every typo",
        "C. For every API response",
        "D. For every state update"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why must OTA updates match the installed runtime?",
      "options": [
        "A. The JavaScript must be compatible with the native capabilities in that binary",
        "B. The app store requires Jest",
        "C. The device needs a new account",
        "D. GitHub Actions blocks it"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is the user-facing application version?",
      "options": [
        "A. The release version shown to users",
        "B. The CI run number only",
        "C. The Git branch",
        "D. The device identifier"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why must build numbers increase?",
      "options": [
        "A. Stores use them to distinguish uploaded binaries",
        "B. They change component state",
        "C. They invalidate query caches",
        "D. They create source maps"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "How are iOS and Android build identifiers commonly represented?",
      "options": [
        "A. iOS build number and Android version code",
        "B. Both use query keys",
        "C. Both use route names",
        "D. Both use refresh tokens"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is an update channel?",
      "options": [
        "A. A named stream that controls which builds receive which updates",
        "B. A screen-reader role",
        "C. A native log",
        "D. A test snapshot"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why use a staged rollout?",
      "options": [
        "A. To limit early exposure and monitor problems before wider release",
        "B. To avoid versioning",
        "C. To disable crash reporting",
        "D. To skip compatibility checks"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "When is an OTA update the wrong fix?",
      "options": [
        "A. When the change requires native code or an incompatible runtime",
        "B. When text changes",
        "C. When a JavaScript bug is fixed",
        "D. When an asset changes compatibly"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "OTA Update Self-check",
    "goal": "Ship an OTA update to a controlled subset of users and verify that only that group receives it.",
    "brief": "Your task:\n\n> Ship an OTA update to a controlled subset of users and verify that only that group receives it.\n\nYour test should prove:\n\n```text\nUser Group A\n   ↓\nreceives OTA ✅\n\nUser Group B\n   ↓\ndoes NOT receive OTA ✅\n```\n\nThen verify:\n\n```text\nA → new JavaScript version\nB → previous version\n```\n\nFinally, explain:\n\n> Why can the OTA update change the JavaScript but not introduce a native module that wasn't present in the installed binary?\n\nIf you can explain that clearly, you've understood the most important concept of Day 37.",
    "steps": [],
    "acceptance": [
      "User Group A receives the OTA update.",
      "User Group B remains on the previous JavaScript version.",
      "The update is compatible with the installed native runtime.",
      "Explain why an OTA update cannot introduce a missing native module."
    ]
  }
});

