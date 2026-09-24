import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_40_LESSONS = normalizePastedLessonDay({
  "day": 40,
  "title": "Release Management",
  "overview": "### Goal\n\nBy the end of this day, you should be able to answer:\n\n> **“A release has a bug. What exactly should I do?”**\n\nYou should understand the difference between:\n\n```text\nOTA rollback\nStore rollback\nStaged rollout halt\n```\n\nand know how to coordinate them when a native release and OTA update are both involved.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn40-1",
      "title": "Release management is more than pressing \"Release\"",
      "durationMinutes": 4,
      "explanation": "You've already learned how to build and submit an application.\n\nNow imagine this:\n\n```text\nProduction release\n     ↓\n10% of users\n     ↓\nEverything looks good\n     ↓\n50%\n     ↓\nUsers report crashes\n```\n\nAt this point, the important question isn't:\n\n> \"How do I build the app?\"\n\nIt's:\n\n> **\"What is the safest way to stop or recover from this release?\"**\n\nThat's release management.",
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
      "id": "rn40-2",
      "title": "Phased and staged releases",
      "durationMinutes": 4,
      "explanation": "You learned staged rollout on Day 39.\n\nThe same idea applies to the overall release strategy.\n\nInstead of:\n\n```text\n100% users\n   ↓\nNew version\n```\n\nyou can use:\n\n```text\n5%\n↓\n10%\n↓\n25%\n↓\n50%\n↓\n100%\n```\n\nAt every stage:\n\n```text\nRelease\n ↓\nObserve\n ↓\nDecide\n ↓\nContinue or stop\n```\n\nThis is important because a problem affecting 100 users is very different from a problem affecting 1 million users.",
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
      "id": "rn40-3",
      "title": "iOS and Android together",
      "durationMinutes": 4,
      "explanation": "If you support both platforms, don't assume they have to move at exactly the same speed.\n\nFor example:\n\n```text\niOS\n 5% → 25% → 100%\n\nAndroid\n 5% → 10% → 25% → 100%\n```\n\nYou might discover a problem that only affects:\n\n```text\nAndroid 15\n```\n\nwhile iOS is fine.\n\nSo your release management process should track:\n\n```text\nPlatform\nVersion\nBuild number\nRollout percentage\nCrash rate\nANR rate\nImportant errors\n```\n\nA useful release dashboard might look conceptually like:\n\n```text\n            iOS          Android\nVersion      2.4.0        2.4.0\nBuild        120          184\nRollout      25%          10%\nCrash rate   normal       elevated\nStatus       continue     halt\n```",
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
      "id": "rn40-4",
      "title": "What is a rollback?",
      "durationMinutes": 4,
      "explanation": "A rollback means:\n\n> **Stop using the problematic release and return users to a known-good state, when the platform/update mechanism allows that.**\n\nBut there isn't one universal rollback button.\n\nThe correct action depends on **what changed**.",
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
      "id": "rn40-5",
      "title": "First question: What actually broke?",
      "durationMinutes": 4,
      "explanation": "When a production problem appears, ask:\n\n```text\nWhat changed?\n     ↓\nJavaScript?\nNative code?\nConfiguration?\nBackend?\nStore metadata?\n```\n\nFor example:\n\n```text\nJS bug\n  ↓\nOTA may be able to fix/revert\n```\n\nwhile:\n\n```text\nNative crash\n  ↓\nOTA cannot replace the native binary\n```\n\nThis distinction is critical.",
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
      "id": "rn40-6",
      "title": "JS-only bug",
      "durationMinutes": 4,
      "explanation": "Suppose you released:\n\n```text\nApp binary: 2.4.0\nOTA update: JS revision 15\n```\n\nThen you discover:\n\n```text\nCheckout button crashes\n```\n\nYou investigate and find:\n\n```text\nNative code = unchanged\nJS code = bug\n```\n\nIf the installed native runtime is compatible, an OTA rollback or corrective OTA update may be the appropriate recovery mechanism.\n\nConceptually:\n\n```text\nNative binary\n    │\n    ├── JS revision 14 ✅\n    │\n    └── JS revision 15 ❌\n             ↓\n        rollback/fix\n             ↓\n         revision 16\n```\n\nThe important thing is that the native binary already contains everything the corrected JavaScript needs.",
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
      "id": "rn40-7",
      "title": "Native crash",
      "durationMinutes": 4,
      "explanation": "Now imagine:\n\n```text\nNew native module\n      ↓\nProduction\n      ↓\nAndroid crashes during startup\n```\n\nAn OTA update cannot remove a native module or change native startup behavior if the problem exists in the binary itself.\n\nSo:\n\n```text\nNative crash\n   ↓\nOTA rollback ❌\n```\n\nYou need a new native release containing the fix.\n\nDepending on the store/platform state, you may:\n\n```text\nstop the rollout\n      ↓\nfix native code\n      ↓\nbuild new version\n      ↓\ntest\n      ↓\nrelease corrected version\n```",
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
      "id": "rn40-8",
      "title": "Halt vs rollback",
      "durationMinutes": 4,
      "explanation": "These are different actions.\n\n### Halt\n\nYou stop a rollout from reaching more users.\n\n```text\n5%\n↓\nProblem discovered\n↓\nSTOP\n```\n\nThe users who already received the release may still have it.\n\n### Rollback\n\nYou actively move compatible users back toward a known-good version/update.\n\nFor OTA, this can be much more direct than for a store binary.\n\nSo:\n\n```text\nHalt\n= don't expose more users\n\nRollback\n= recover users from the problematic release\n```",
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
      "id": "rn40-9",
      "title": "Store rollback is different",
      "durationMinutes": 4,
      "explanation": "App stores don't behave exactly like Git.\n\nYou shouldn't think:\n\n```text\nproduction 2.4.0\n      ↓\nclick rollback\n      ↓\n2.3.0 everywhere\n```\n\nInstead, depending on the platform and release state, you may need to:\n\n```text\nhalt rollout\n```\n\nand/or:\n\n```text\nrelease a corrected build\n```\n\nFor example:\n\n```text\n2.4.0 ❌\n  ↓\nstop rollout\n  ↓\n2.4.1 ✅\n  ↓\nresume/release\n```\n\nThis is why you should always have a rollback/recovery plan **before** releasing.",
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
      "id": "rn40-10",
      "title": "The rollback decision tree",
      "durationMinutes": 4,
      "explanation": "A useful production mental model:\n\n```text\n            Production bug\n                   ↓\n            What changed?\n                   ↓\n         ┌─────────┴─────────┐\n         ↓                   ↓\n      JS-only              Native\n         ↓                   ↓\n   Compatible?          Binary problem?\n         ↓                   ↓\n    OTA fix/revert       Stop rollout\n                             ↓\n                        New native build\n                             ↓\n                        Store release\n```",
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
      "id": "rn40-11",
      "title": "Coordinating native release + OTA",
      "durationMinutes": 4,
      "explanation": "This is where things become more interesting.\n\nSuppose you're releasing:\n\n```text\nNative version 2.5\n```\n\nand you also have:\n\n```text\nOTA update A\n```\n\nYou must make sure the OTA update is compatible with the native runtime.\n\nThink about the deployment order.\n\nYou generally want:\n\n```text\nNative binary\n     ↓\nCompatible runtime available\n     ↓\nOTA update\n```\n\nrather than accidentally sending JavaScript that expects native capabilities that aren't installed yet.",
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
      "id": "rn40-12",
      "title": "Example: dangerous deployment",
      "durationMinutes": 4,
      "explanation": "Suppose:\n\n```text\nOld binary\n ↓\nNative runtime v1\n```\n\nYour new JavaScript expects:\n\n```text\nNative runtime v2\n```\n\nIf you release the OTA update first:\n\n```text\nOld binary v1\n     ↓\nOTA JS expecting v2\n     ↓\n💥 compatibility problem\n```\n\nA safer rollout might be:\n\n```text\nBuild native v2\n     ↓\nRelease native v2\n     ↓\nConfirm adoption/compatibility\n     ↓\nRelease OTA requiring v2\n```\n\nThis is one of the most important concepts when combining native releases and OTA updates.",
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
      "id": "rn40-13",
      "title": "Release notes",
      "durationMinutes": 4,
      "explanation": "When you release a new version, users should understand what changed.\n\nFor example:\n\n```text\nWhat's new\n\n• Faster app startup\n• Improved profile loading\n• Fixed notification issues\n• Improved offline behavior\n```\n\nAvoid internal engineering language such as:\n\n```text\n\"Refactored authentication state machine.\"\n```\n\nunless users actually benefit from that information.",
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
      "id": "rn40-14",
      "title": "In-app changelog",
      "durationMinutes": 4,
      "explanation": "You can also communicate updates inside the application.\n\nFor example:\n\n```text\n┌──────────────────────────────┐\n│ What's new in version 2.5    │\n│                              │\n│ ✓ Faster startup             │\n│ ✓ Improved search            │\n│ ✓ Better offline support     │\n│                              │\n│              [Continue]       │\n└──────────────────────────────┘\n```\n\nThis can be useful when the release contains meaningful changes that users should notice.",
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
      "id": "rn40-15",
      "title": "Release communication",
      "durationMinutes": 4,
      "explanation": "A good release process can look like:\n\n```text\nBefore release\n   ↓\nInternal announcement\n   ↓\nTesting\n   ↓\nRelease\n   ↓\nRelease notes\n   ↓\nMonitor\n   ↓\nExpand rollout\n```\n\nIf there's a serious issue:\n\n```text\nDetect\n↓\nHalt\n↓\nInvestigate\n↓\nCommunicate internally\n↓\nFix\n↓\nRelease\n↓\nVerify\n```",
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
      "question": "What is release management?",
      "options": [
        "A. The process of planning, releasing, monitoring, communicating, and recovering safely",
        "B. Only pressing the store release button",
        "C. Only writing release notes",
        "D. Only running unit tests"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why use a phased or staged release?",
      "options": [
        "A. To limit exposure while monitoring release health",
        "B. To avoid version numbers",
        "C. To skip store review",
        "D. To add native code through OTA"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should be coordinated across iOS and Android?",
      "options": [
        "A. Version timing, rollout state, fixes, and user communication",
        "B. Only icon colors",
        "C. Only test IDs",
        "D. Only JavaScript imports"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is the first rollback question?",
      "options": [
        "A. What layer actually broke",
        "B. Which editor was used",
        "C. How many files changed",
        "D. Which device is newest"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "How can a compatible JavaScript-only bug be corrected?",
      "options": [
        "A. With a safe OTA corrective update or revert",
        "B. Only with a new native binary",
        "C. By changing the app icon",
        "D. By clearing every user account"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "How should a native crash be handled during staged rollout?",
      "options": [
        "A. Halt the rollout and prepare a fixed native build",
        "B. Ship unsupported JavaScript",
        "C. Ignore crash rates",
        "D. Increase rollout to 100%"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is the difference between halting and rolling back?",
      "options": [
        "A. Halting stops wider distribution; rollback or correction addresses affected users",
        "B. They are always identical",
        "C. Halting changes source maps",
        "D. Rollback creates screenshots"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why is a store rollback difficult?",
      "options": [
        "A. Stores distribute signed binaries and may require a new reviewed build",
        "B. Stores support instant binary replacement",
        "C. Build numbers can decrease freely",
        "D. Native code updates over OTA"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should happen before an OTA uses a new native capability?",
      "options": [
        "A. A compatible native binary must reach users first",
        "B. The OTA should ship first",
        "C. The version should be hidden",
        "D. Testing should be skipped"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What makes release notes useful?",
      "options": [
        "A. They communicate meaningful changes, fixes, risks, and actions clearly",
        "B. They replace monitoring",
        "C. They store credentials",
        "D. They sign the build"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Release Management Self-check",
    "goal": "Write a rollback plan for JavaScript, native, and runtime-compatibility failures.",
    "brief": "Write a rollback plan containing three explicit decisions:\n\n### Scenario A — JS-only bug\n\nAnswer:\n\n```text\nWhat lever do I pull?\nWhy?\nWhat happens to users?\nHow do I verify recovery?\n```\n\n### Scenario B — Native crash\n\nAnswer:\n\n```text\nWhat lever do I pull?\nWhy can't OTA fix it?\nWhat build do I release?\nHow do I prevent more users from receiving the broken version?\n```\n\n### Scenario C — OTA update requires new native capability\n\nAnswer:\n\n```text\nWhich gets released first?\nNative binary or OTA?\nWhy?\nHow do I verify compatibility?\n```\n\nYour final decision table should look something like:\n\n| Problem                            | Primary action                        | Reason                                |\n| ---------------------------------- | ------------------------------------- | ------------------------------------- |\n| JS-only compatible bug             | OTA corrective update/revert          | Native binary is still usable         |\n| Native crash                       | Halt store rollout + new native build | OTA cannot replace broken native code |\n| OTA requires new native capability | Native release first, then OTA        | OTA must match installed runtime      |",
    "steps": [],
    "acceptance": [
      "Choose the correct recovery lever for a JavaScript-only bug.",
      "Explain why OTA cannot fix a native crash.",
      "Sequence the native binary before an OTA that requires new native capability.",
      "Document how recovery will be verified."
    ]
  }
});

