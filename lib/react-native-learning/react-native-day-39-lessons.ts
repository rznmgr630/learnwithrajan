import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_39_LESSONS = normalizePastedLessonDay({
  "day": 39,
  "title": "Play Store Submission",
  "overview": "### Goal\n\nUnderstand the Android release process:\n\n```text\nReact Native\n    ↓\nEAS Build\n    ↓\nAndroid AAB\n    ↓\nGoogle Play Console\n    ↓\nInternal testing\n    ↓\nClosed/Open testing\n    ↓\nProduction\n    ↓\nStaged rollout\n```",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn39-1",
      "title": "Google Play Console",
      "durationMinutes": 5,
      "explanation": "Google Play Console is the Android equivalent of Apple's App Store Connect in terms of release management.\n\nYou use it for:\n\n* application configuration\n* releases\n* testing tracks\n* store listing\n* screenshots\n* app content\n* data safety information\n* countries/regions\n* production releases\n* staged rollouts",
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
      "id": "rn39-2",
      "title": "AAB",
      "durationMinutes": 5,
      "explanation": "On Day 25, you learned about the Android application bundle.\n\nAn **AAB** means:\n\n> **Android App Bundle**\n\nThe important distinction is:\n\n```text\nAPK\n↓\nInstallable Android package\n```\n\nwhile:\n\n```text\nAAB\n↓\nPublishing format\n↓\nGoogle Play generates optimized APKs\n↓\nDevices receive what they need\n```\n\nFor modern Google Play distribution, your production Android application should generally be published as an AAB.\n\nSo your pipeline becomes:\n\n```text\nEAS Build\n   ↓\nAndroid AAB\n   ↓\nGoogle Play Console\n```",
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
      "id": "rn39-3",
      "title": "Signing",
      "durationMinutes": 5,
      "explanation": "Android applications need to be signed.\n\nThink of signing as establishing:\n\n> \"This release came from the same application publisher.\"\n\nConceptually:\n\n```text\nYour source\n   ↓\nBuild\n   ↓\nSigning\n   ↓\nAAB\n   ↓\nGoogle Play\n```\n\nYour signing credentials are extremely important.\n\nThey should not be casually stored in:\n\n```text\nGit\npublic repository\nsource code\nchat messages\n```",
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
      "id": "rn39-4",
      "title": "Google Play testing tracks",
      "durationMinutes": 5,
      "explanation": "Google Play provides different testing stages.\n\nThe important ones for this syllabus are:\n\n```text\nInternal\n  ↓\nClosed\n  ↓\nOpen\n  ↓\nProduction\n```\n\nThey serve different purposes.",
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
      "id": "rn39-5",
      "title": "Internal testing",
      "durationMinutes": 4,
      "explanation": "**Internal testing** is designed for a small group of testers.\n\nThink:\n\n```text\nDevelopment team\nQA\nProduct team\n```\n\nExample:\n\n```text\nNew Android build\n      ↓\nInternal testing\n      ↓\n10 testers\n      ↓\nFind serious problems\n```\n\nThis is a great first step before wider distribution.",
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
      "id": "rn39-6",
      "title": "Closed testing",
      "durationMinutes": 4,
      "explanation": "Closed testing allows a larger controlled group.\n\nFor example:\n\n```text\nInternal team\n     ↓\nClosed beta\n     ↓\nSelected customers/testers\n```\n\nThe audience is still controlled.\n\nThis is useful when you want more realistic testing without opening the application to everyone.",
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
      "id": "rn39-7",
      "title": "Open testing",
      "durationMinutes": 4,
      "explanation": "Open testing makes the test version available to a much broader audience.\n\nConceptually:\n\n```text\nInternal\n  ↓\nSmall trusted group\n\nClosed\n  ↓\nControlled larger group\n\nOpen\n  ↓\nBroader testers\n\nProduction\n  ↓\nEveryone\n```\n\nYou don't necessarily need to use every track for every release.\n\nThe right testing strategy depends on the application and team.",
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
      "id": "rn39-8",
      "title": "Play Console configuration",
      "durationMinutes": 4,
      "explanation": "Before releasing, you need more than the AAB.\n\nYou also configure things such as:\n\n```text\nApp name\nDescription\nIcon\nScreenshots\nCategory\nContent information\nData safety\nCountries/regions\nPricing\nTesting configuration\nRelease configuration\n```\n\nAgain:\n\n> **The store listing is part of the product release.**",
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
      "id": "rn39-9",
      "title": "Data safety",
      "durationMinutes": 4,
      "explanation": "Google Play asks developers to provide information about how the application handles user data.\n\nThis needs to match the actual application.\n\nFor example, if your application collects:\n\n```text\nemail\nlocation\nanalytics data\ndevice information\n```\n\nyou need to understand how that data is collected and used.\n\nDon't guess.\n\nThe declaration should reflect your actual implementation and third-party SDK behavior.",
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
      "id": "rn39-10",
      "title": "Common Play Store problems",
      "durationMinutes": 4,
      "explanation": "The exact reasons vary, but common categories include:\n\n### Broken functionality\n\n```text\nCrash\nLogin doesn't work\nImportant feature doesn't work\n```\n\n### Incorrect declarations\n\nFor example:\n\n```text\nData safety information\n```\n\ndoesn't accurately represent what the application or SDKs do.\n\n### Permission problems\n\nDon't request permissions simply because:\n\n```text\n\"We might need it later.\"\n```\n\nRequest permissions because the application actually needs them and the use is appropriate.\n\n### Store listing problems\n\nYour:\n\n```text\nscreenshots\ndescription\nicon\nclaims\n```\n\nshould accurately represent the application.\n\n### Policy problems\n\nGoogle Play has policies around areas such as:\n\n```text\nprivacy\npermissions\npayments\nuser-generated content\nmalware/security\ndeceptive behavior\n```\n\nYour job as a developer is not simply to make the binary compile.\n\nYou also need to understand the platform's release requirements.",
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
      "id": "rn39-11",
      "title": "Staged rollout",
      "durationMinutes": 4,
      "explanation": "One of the most useful Play Store release features is staged rollout.\n\nInstead of:\n\n```text\n100% of users\n```\n\nyou can release to a smaller percentage first.\n\nFor example:\n\n```text\nProduction release\n      ↓\n      5%\n      ↓\nMonitor\n      ↓\n      10%\n      ↓\nMonitor\n      ↓\n      25%\n      ↓\nMonitor\n      ↓\n      50%\n      ↓\nMonitor\n      ↓\n     100%\n```\n\nThis reduces the blast radius (the number of users affected if something goes wrong).",
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
      "id": "rn39-12",
      "title": "What should you monitor?",
      "durationMinutes": 4,
      "explanation": "During a staged rollout, look at things such as:\n\n```text\nCrash rate\nANR rate\nLogin failures\nAPI errors\nUser reports\nStartup problems\n```\n\nThis connects directly to **Day 33 — Production Observability**.\n\nYour previous lessons are now starting to connect:\n\n```text\nDay 33\nObservability\n    ↓\nDay 39\nStaged rollout\n    ↓\nMonitor production\n    ↓\nDetect problems\n    ↓\nPause / fix / continue\n```\n\nThis is why these topics shouldn't be learned independently.",
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
      "id": "rn39-13",
      "title": "Staged rollout vs OTA",
      "durationMinutes": 4,
      "explanation": "This distinction is very important.\n\n### OTA\n\n```text\nJavaScript/assets\n    ↓\nExisting native binary\n```\n\n### Play Store staged rollout\n\n```text\nNew Android binary\n    ↓\nGoogle Play\n    ↓\nPercentage of users\n```\n\nSo:\n\n```text\nOTA\n= update compatible JS remotely\n\nStaged store rollout\n= gradually distribute a new native application build\n```\n\nThey solve different problems.",
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
      "id": "rn39-14",
      "title": "Complete Android release pipeline",
      "durationMinutes": 4,
      "explanation": "Your mental model should now be:\n\n```text\nCode\n↓\nGitHub\n↓\nCI\n↓\nLint\n↓\nType-check\n↓\nTests\n↓\nEAS Build\n↓\nAndroid AAB\n↓\nGoogle Play Console\n↓\nInternal testing\n↓\nClosed testing\n      ↓\n(optional)\nOpen testing\n      ↓\nProduction\n      ↓\nStaged rollout\n      ↓\nMonitoring\n      ↓\n100%\n```",
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
      "question": "What is Google Play Console used for?",
      "options": [
        "A. Managing Android builds, testing, store details, releases, and monitoring",
        "B. Writing React components",
        "C. Running Xcode",
        "D. Managing TestFlight"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why does Google Play use an AAB?",
      "options": [
        "A. It lets Google generate optimized APKs for different devices",
        "B. It contains only JavaScript tests",
        "C. It replaces signing",
        "D. It is an iOS archive"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why is Android signing important?",
      "options": [
        "A. It proves updates come from the same application identity",
        "B. It creates screenshots",
        "C. It controls query caching",
        "D. It replaces version codes"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is the internal testing track for?",
      "options": [
        "A. Fast distribution to a small controlled tester group",
        "B. Immediate release to every user",
        "C. iOS beta testing",
        "D. Only store screenshots"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a closed testing track?",
      "options": [
        "A. A release track for a defined group of testers",
        "B. A production rollout to everyone",
        "C. A local emulator",
        "D. An OTA channel only"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is open testing?",
      "options": [
        "A. A broader opt-in beta that eligible users can join",
        "B. A private Git branch",
        "C. An App Store review",
        "D. A native crash"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What information must Play Console configuration include?",
      "options": [
        "A. Accurate app content, privacy, audience, permissions, and store details",
        "B. Only the package name",
        "C. Only JavaScript source",
        "D. Only CI logs"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does the Data safety form describe?",
      "options": [
        "A. How the app collects, shares, and protects user data",
        "B. How Metro bundles code",
        "C. How lists render",
        "D. How Jest mocks modules"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why use a staged rollout?",
      "options": [
        "A. To release gradually and stop if health metrics degrade",
        "B. To avoid signing",
        "C. To skip testing tracks",
        "D. To add native modules through OTA"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should be monitored during rollout?",
      "options": [
        "A. Crashes, ANRs, ratings, performance, and critical business flows",
        "B. Only download count",
        "C. Only screenshots",
        "D. Only source-map size"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Play Store Submission Self-check",
    "goal": "Submit a production-like Android build to Google Play's **internal testing track** from beginning to end.",
    "brief": "Your task:\n\n> Submit a production-like Android build to Google Play's **internal testing track** from beginning to end.\n\nYou should be able to demonstrate:\n\n```text\nReact Native project\n      ↓\nProduction configuration\n      ↓\nEAS Build\n      ↓\nAAB\n      ↓\nGoogle Play Console\n      ↓\nInternal testing track\n      ↓\nAdd tester\n      ↓\nInstall\n      ↓\nTest\n```\n\nAnd you should be able to explain:\n\n1. Why Google Play uses an **AAB** for publishing.\n2. What the **internal**, **closed**, and **open** testing tracks are for.\n3. What makes a store release different from an OTA update.\n4. Why a **staged rollout** is useful.\n5. What you would monitor after releasing to 5–10% of users.\n\n### The bigger picture\n\nAfter Day 39, your production release knowledge should look like this:\n\n```text\n                 React Native App\n                        │\n            ┌───────────┴───────────┐\n            ↓                       ↓\n       OTA Update              Native Build\n            │                       │\n      JS / assets              EAS Build\n            │                       │\n            │                ┌──────┴──────┐\n            │                ↓             ↓\n            │              iOS           Android\n            │                ↓             ↓\n            │          TestFlight      Play Testing\n            │                ↓             ↓\n            │          App Review      Production\n            │                ↓             ↓\n            │           App Store     Staged Rollout\n            │                              │\n            └──────────────┬───────────────┘\n                           ↓\n                      Observability\n                           ↓\n                    Monitor + Respond\n```\n\nThat gives you the complete **build → test → submit → release → monitor** mental model before moving into the final production/advanced React Native topics.",
    "steps": [],
    "acceptance": [
      "Create a production AAB.",
      "Upload it to Google Play Console.",
      "Release it through internal testing.",
      "Add a tester and install the build.",
      "Explain testing tracks, staged rollout, and store release versus OTA."
    ]
  }
});

