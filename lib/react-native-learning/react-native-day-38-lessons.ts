import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_38_LESSONS = normalizePastedLessonDay({
  "day": 38,
  "title": "App Store Submission",
  "overview": "### Goal\n\nBy the end of this day, you should understand the complete iOS release flow:\n\n```text\nReact Native app\n     ↓\nProduction build\n     ↓\nApp Store Connect\n     ↓\nTestFlight\n     ↓\nMetadata + screenshots\n     ↓\nApp Review\n     ↓\nApproved\n     ↓\nApp Store release\n```",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn38-1",
      "title": "App Store submission is different from building",
      "durationMinutes": 4,
      "explanation": "On Day 36, you learned:\n\n```text\nEAS Build\n   ↓\niOS application binary\n```\n\nThat doesn't mean users can immediately download it.\n\nYou still need to get the build into:\n\n**App Store Connect**\n\nand then go through Apple's distribution/review process.\n\nThink of it as:\n\n```text\nBUILD\n ↓\n\"Does the app compile?\"\n\nSUBMISSION\n ↓\n\"Is this release configured correctly?\"\n\nREVIEW\n ↓\n\"Does this app meet Apple's requirements?\"\n\nRELEASE\n ↓\n\"Make it available to users.\"\n```",
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
      "id": "rn38-2",
      "title": "App Store Connect",
      "durationMinutes": 4,
      "explanation": "**App Store Connect** is Apple's platform for managing your applications.\n\nYou use it for things such as:\n\n* app information\n* builds\n* TestFlight\n* screenshots\n* descriptions\n* keywords\n* pricing\n* availability\n* privacy information\n* review submission\n* release management\n\nYour EAS build eventually appears here.\n\nConceptually:\n\n```text\nEAS Build\n   ↓\niOS binary\n   ↓\nApp Store Connect\n   ↓\n┌─────────────────────┐\n│ Build               │\n│ Metadata            │\n│ Screenshots         │\n│ Privacy information │\n│ Testing             │\n└─────────────────────┘\n```",
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
      "id": "rn38-3",
      "title": "TestFlight",
      "durationMinutes": 4,
      "explanation": "**TestFlight** is Apple's beta-testing system.\n\nInstead of immediately releasing:\n\n```text\nApp Store → everyone\n```\n\nyou can first distribute:\n\n```text\nApp Store Connect\n      ↓\n  TestFlight\n      ↓\n   Testers\n```\n\nThis is extremely useful because the production build can be tested in an environment much closer to what real users will experience.",
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
      "id": "rn38-4",
      "title": "Internal vs external testing",
      "durationMinutes": 4,
      "explanation": "TestFlight has different testing arrangements.\n\n### Internal testing\n\nInternal testers are associated with your App Store Connect team.\n\nThis is useful for:\n\n```text\nDevelopers\nQA\nProduct team\nInternal stakeholders\n```\n\nFor example:\n\n```text\nProduction build\n     ↓\nTestFlight\n     ↓\nInternal testers\n     ↓\nFind bugs\n```\n\n### External testing\n\nExternal testers are people outside your App Store Connect team.\n\nThis can be useful for:\n\n```text\nbeta customers\nclient testers\nlarger QA groups\nreal-world testing\n```\n\nExternal testing can involve Apple's beta review process.\n\nThe important thing is:\n\n> **TestFlight is not the same thing as the App Store.**\n\nIt is a testing/distribution environment before the public release.",
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
      "id": "rn38-5",
      "title": "TestFlight build lifecycle",
      "durationMinutes": 4,
      "explanation": "A typical workflow looks like:\n\n```text\nCode\n↓\nEAS Build\n↓\nUpload to App Store Connect\n↓\nBuild processing\n↓\nTestFlight\n↓\nInternal testing\n↓\nExternal testing if needed\n↓\nFix issues\n↓\nFinal App Store submission\n```\n\nThis gives you a chance to catch problems before public release.",
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
      "id": "rn38-6",
      "title": "What should you test in TestFlight?",
      "durationMinutes": 4,
      "explanation": "Don't only test:\n\n```text\n\"Does the app open?\"\n```\n\nTest the actual production-like flow.\n\nFor example:\n\n```text\nInstall\n↓\nLaunch\n↓\nLogin\n↓\nPermissions\n↓\nNavigation\n↓\nAPI requests\n↓\nPush notifications\n↓\nDeep links\n↓\nImages\n↓\nPayments if applicable\n↓\nLogout\n```\n\nAlso test:\n\n```text\ncold launch\nbackground → foreground\npoor network\nno network\nfresh installation\nexisting installation\n```",
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
      "id": "rn38-7",
      "title": "App Review",
      "durationMinutes": 4,
      "explanation": "After testing, you submit the app for Apple's review.\n\nThe review process evaluates whether the application meets Apple's requirements.\n\nOne important lesson:\n\n> **Passing your local tests does not guarantee App Review approval.**\n\nYour application can technically work perfectly and still have submission problems.",
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
      "id": "rn38-8",
      "title": "Common reasons for rejection",
      "durationMinutes": 4,
      "explanation": "There isn't one single \"App Store rejection bug.\"\n\nCommon categories include:\n\n### Crashes or broken functionality\n\nIf the reviewer launches your application and encounters:\n\n```text\ncrash\nbroken login\ndead button\nbroken navigation\n```\n\nthat's obviously a serious problem.\n\n---\n\n### Incomplete app\n\nFor example:\n\n```text\nComing soon\nComing soon\nComing soon\n```\n\nthrough major parts of the application can create review problems.\n\nThe reviewer should be able to understand what the application actually does.\n\n---\n\n### Login problems\n\nIf your application requires authentication, the reviewer needs a way to access the relevant functionality.\n\nFor example, if review requires an account:\n\n```text\nReviewer\n  ↓\nLogin\n  ↓\nCannot access app\n```\n\nthat can become a problem.\n\nProvide the required review information and instructions through App Store Connect when appropriate.\n\n---\n\n### Privacy problems\n\nIf your application collects user data, your privacy declarations need to accurately describe what happens.\n\nThe important principle is:\n\n> **Don't say your app does one thing while the actual implementation does another.**\n\n---\n\n### Payments and digital content\n\nApps involving purchases or digital content have additional Apple requirements.\n\nDon't assume:\n\n```text\n\"I already have Stripe.\"\n```\n\nmeans your mobile payment implementation automatically satisfies Apple's rules.\n\nPayment architecture needs to be designed around the type of product being sold and the applicable store rules.\n\n---\n\n### Misleading metadata\n\nYour:\n\n```text\napp name\ndescription\nscreenshots\npreview\n```\n\nshould accurately represent the application.\n\nDon't advertise functionality that doesn't exist in the submitted build.",
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
      "id": "rn38-9",
      "title": "Review notes",
      "durationMinutes": 4,
      "explanation": "Sometimes the reviewer needs additional information.\n\nFor example:\n\n```text\nDemo account:\nemail: reviewer@example.com\npassword: ********\n\nSteps:\n1. Login\n2. Open Profile\n3. Select Settings\n4. Open Subscription\n```\n\nThe exact information depends on the app.\n\nThe goal is simple:\n\n> Give the reviewer enough information to evaluate the actual functionality.",
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
      "id": "rn38-10",
      "title": "Screenshots",
      "durationMinutes": 4,
      "explanation": "Screenshots aren't just decoration.\n\nThey are part of your App Store listing.\n\nThink about the journey:\n\n```text\nSearch result\n    ↓\nApp listing\n    ↓\nScreenshots\n    ↓\nDescription\n    ↓\nInstall\n```\n\nYour screenshots should clearly communicate:\n\n```text\nWhat does this app do?\nWhat does it look like?\nWhat problem does it solve?\n```\n\nYou may need screenshots for different device sizes.",
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
      "id": "rn38-11",
      "title": "Automating screenshots",
      "durationMinutes": 4,
      "explanation": "Manually taking screenshots for every device can become annoying.\n\nA mature release pipeline can automate this.\n\nConceptually:\n\n```text\nApp build\n  ↓\nAutomated test/device\n  ↓\nNavigate to screen\n  ↓\nCapture screenshot\n  ↓\nGenerate required sizes\n  ↓\nUpload metadata\n```\n\nTools such as Fastlane can be useful here.\n\nThe important idea isn't memorizing a specific screenshot tool.\n\nIt's:\n\n> **Release assets can be automated just like builds and tests.**",
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
      "id": "rn38-12",
      "title": "App previews",
      "durationMinutes": 4,
      "explanation": "An **App Preview** is a short video showing the application.\n\nIt can communicate:\n\n```text\n\"Here's what the app actually does.\"\n```\n\nFor example:\n\n```text\nLaunch\n↓\nLogin\n↓\nMain feature\n↓\nResult\n```\n\nDon't think of this as a marketing video that must contain everything.\n\nIt should quickly demonstrate the application's actual experience.",
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
      "id": "rn38-13",
      "title": "Metadata",
      "durationMinutes": 3,
      "explanation": "Metadata can include:\n\n```text\nApp name\nSubtitle\nDescription\nKeywords\nCategory\nSupport URL\nMarketing URL\nPrivacy information\nScreenshots\nApp preview\n```\n\nTreat metadata as part of your release.\n\nA production release isn't complete if:\n\n```text\nbinary = ready\nmetadata = incomplete\n```",
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
      "id": "rn38-14",
      "title": "Handling a rejection",
      "durationMinutes": 3,
      "explanation": "This is an important engineering skill.\n\nIf Apple rejects your app:\n\n```text\n❌ Rejected\n```\n\ndon't immediately assume:\n\n```text\n\"Our whole app is broken.\"\n```\n\nInstead:\n\n```text\nRead rejection reason\n      ↓\nIdentify exact guideline/issue\n      ↓\nReproduce if possible\n      ↓\nDetermine:\n  metadata problem?\n  configuration problem?\n  code problem?\n  missing information?\n      ↓\nFix\n      ↓\nTest again\n      ↓\nSubmit again\n```\n\nA rejection is feedback about a specific submission.\n\nTreat it like a debugging report.",
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
      "id": "rn38-15",
      "title": "Rejection example",
      "durationMinutes": 3,
      "explanation": "Suppose the reviewer says:\n\n> Login could not be completed.\n\nDon't randomly change authentication code.\n\nFirst ask:\n\n```text\nCan we reproduce it?\n```\n\nThen check:\n\n```text\nProduction API\n↓\nAuth endpoint\n↓\nCredentials\n↓\nNetwork\n↓\nEnvironment configuration\n↓\nApp behavior\n```\n\nMaybe the application was accidentally pointing to:\n\n```text\nstaging-api.example.com\n```\n\ninstead of:\n\n```text\napi.example.com\n```\n\nThis is why release testing matters.",
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
      "id": "rn38-16",
      "title": "Complete iOS release pipeline",
      "durationMinutes": 3,
      "explanation": "You should understand this flow:\n\n```text\n                Development\n                     ↓\n                  Git push\n                     ↓\n                CI checks\n                     ↓\n                EAS Build\n                     ↓\n             iOS production build\n                     ↓\n             App Store Connect\n                     ↓\n                TestFlight\n                     ↓\n             Internal testing\n                     ↓\n             External testing\n                     ↓\n              Final validation\n                     ↓\n             Metadata complete\n                     ↓\n              Submit for review\n                     ↓\n               Apple review\n                 ↙       ↘\n             Rejected   Approved\n               ↓           ↓\n              Fix       Release\n               ↓\n            Resubmit\n```",
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
      "question": "How is App Store submission different from building?",
      "options": [
        "A. Building creates the binary; submission prepares and sends it through Apple's release process",
        "B. They are identical",
        "C. Submission runs unit tests only",
        "D. Building writes metadata only"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is App Store Connect used for?",
      "options": [
        "A. Managing apps, builds, metadata, testers, and releases",
        "B. Writing React components",
        "C. Running Metro",
        "D. Managing Android signing"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is TestFlight?",
      "options": [
        "A. Apple's beta distribution system",
        "B. A JavaScript test runner",
        "C. An Android testing track",
        "D. A source-map service"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Who can use an internal TestFlight build?",
      "options": [
        "A. App Store Connect users assigned as internal testers",
        "B. Every App Store user automatically",
        "C. Only Android users",
        "D. Only unauthenticated users"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should be tested in TestFlight?",
      "options": [
        "A. The real release build, permissions, login, purchases, links, and critical flows",
        "B. Only the app icon",
        "C. Only TypeScript compilation",
        "D. Only unit tests"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What happens during App Review?",
      "options": [
        "A. Apple evaluates the submitted app against its policies and expected behavior",
        "B. Metro bundles JavaScript locally",
        "C. Google signs the AAB",
        "D. Jest creates snapshots"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What commonly causes App Store rejection?",
      "options": [
        "A. Broken flows, incomplete metadata, privacy problems, or policy violations",
        "B. Having component tests",
        "C. Using TypeScript",
        "D. Using an AAB"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why are review notes useful?",
      "options": [
        "A. They explain login details, special setup, and behavior reviewers need to verify",
        "B. They replace screenshots",
        "C. They hide permissions",
        "D. They create certificates"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should App Store screenshots represent?",
      "options": [
        "A. The real product and its important user experience accurately",
        "B. Unrelated marketing claims",
        "C. Debug menus only",
        "D. Source code"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should happen after a rejection?",
      "options": [
        "A. Understand the reason, fix it, respond clearly, and resubmit",
        "B. Create a new repository",
        "C. Ignore the feedback",
        "D. Submit the same build repeatedly"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "App Store Submission Self-check",
    "goal": "Complete the iOS submission flow from build through App Store review.",
    "brief": "You should be able to take a real React Native application and complete:\n\n```text\nEAS Build\n  ↓\nApp Store Connect\n  ↓\nTestFlight\n  ↓\nInternal testing\n  ↓\nMetadata\n  ↓\nScreenshots\n  ↓\nSubmit\n```\n\nThe important part is **end to end**.\n\nDon't just learn:\n\n```bash\neas submit\n```\n\nUnderstand everything that happens before and after that command.",
    "steps": [],
    "acceptance": [
      "Create the production build.",
      "Upload it to App Store Connect.",
      "Test it through TestFlight.",
      "Complete metadata and screenshots.",
      "Submit the build for review."
    ]
  }
});

