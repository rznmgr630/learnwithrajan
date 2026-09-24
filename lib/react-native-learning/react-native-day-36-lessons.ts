import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_36_LESSONS = normalizePastedLessonDay({
  "day": 36,
  "title": "CI/CD",
  "overview": "### Goal\n\nBy the end of this day, you should understand how a React Native app moves from:\n\n```text\nGit push\n  ↓\nGitHub Actions\n  ↓\nLint\n  ↓\nType-check\n  ↓\nTests\n  ↓\nEAS Build\n  ↓\nAndroid / iOS artifact\n  ↓\nEAS Submit\n  ↓\nApp Store / Google Play\n```\n\nThe main idea is simple:\n\n> **Your machine should not be required to manually build and submit every production release.**",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn36-1",
      "title": "What CI/CD actually means",
      "durationMinutes": 5,
      "explanation": "**CI** means **Continuous Integration**.\n\nIt means that whenever code changes, an automated system checks whether the new code is safe to merge.\n\nFor example:\n\n```text\nDeveloper pushes code\n       ↓\nGitHub Actions starts\n       ↓\nnpm install\n       ↓\nLint\n       ↓\nTypeScript check\n       ↓\nJest tests\n       ↓\nBuild check\n```\n\nIf something fails:\n\n```text\n❌ TypeScript error\n      ↓\nCI stops\n      ↓\nNo production build\n```\n\nThis gives the team fast feedback.\n\n**CD** means **Continuous Delivery / Continuous Deployment**.\n\nIn mobile development, this can mean automatically creating a release build and potentially submitting it to the stores.\n\nFor example:\n\n```text\nmain branch\n   ↓\nCI checks\n   ↓\nEAS Build\n   ↓\nAndroid .aab\niOS .ipa\n   ↓\nEAS Submit\n   ↓\nGoogle Play / App Store\n```\n\nThe exact point where human approval happens depends on your release policy.",
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
      "id": "rn36-2",
      "title": "EAS Build",
      "durationMinutes": 5,
      "explanation": "**EAS** means **Expo Application Services**.\n\nEAS Build is used to create installable Android and iOS builds from your React Native project.\n\nInstead of manually opening:\n\n```text\nAndroid Studio\nXcode\n```\n\nand building everything yourself, you can run:\n\n```bash\neas build\n```\n\nFor example:\n\n```bash\neas build --platform android\n```\n\nor:\n\n```bash\neas build --platform ios\n```\n\nOr both:\n\n```bash\neas build --platform all\n```\n\nThe important mental model is:\n\n```text\nYour source code\n     ↓\nEAS Build\n     ↓\nNative Android/iOS build\n     ↓\nArtifact\n```\n\nAn **artifact** means the output file produced by the build process.\n\nFor Android, this could be an `.aab`.\n\nFor iOS, this could be an `.ipa` used for distribution workflows.",
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
      "id": "rn36-3",
      "title": "Why cloud builds are useful",
      "durationMinutes": 5,
      "explanation": "Without a build service, your CI machine needs the native development environment.\n\nFor iOS, that means dealing with things such as:\n\n```text\nmacOS\nXcode\ncertificates\nprovisioning\nCocoaPods\n```\n\nAndroid has its own setup:\n\n```text\nAndroid SDK\nGradle\nJava\nkeystore\nbuild tools\n```\n\nEAS can handle much of this build infrastructure for you.\n\nYour GitHub Actions workflow can therefore say:\n\n```text\n\"Build this commit using the production configuration.\"\n```\n\ninstead of:\n\n```text\n\"Install Xcode\"\n\"Install Android SDK\"\n\"Configure certificates\"\n\"Configure signing\"\n\"Run Gradle\"\n\"Run Xcode build\"\n...\n```",
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
      "id": "rn36-4",
      "title": "EAS Submit",
      "durationMinutes": 5,
      "explanation": "Building an application and submitting it to an app store are two different things.\n\nThink of it like this:\n\n```text\nEAS Build\n\nSource code\n   ↓\nApp binary\n```\n\nwhile:\n\n```text\nEAS Submit\n\nApp binary\n   ↓\nApp Store / Google Play\n```\n\nYou can use:\n\n```bash\neas submit\n```\n\nFor Android:\n\n```bash\neas submit --platform android\n```\n\nFor iOS:\n\n```bash\neas submit --platform ios\n```\n\nThe important distinction is:\n\n> **Build creates the app. Submit sends the app to the store.**",
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
      "id": "rn36-5",
      "title": "Build profiles",
      "durationMinutes": 5,
      "explanation": "You normally don't want one configuration for everything.\n\nFor example:\n\n```text\ndevelopment\nstaging\nproduction\n```\n\nYou might have:\n\n```text\ndevelopment\n   ↓\nlocal development\n\nstaging\n   ↓\nQA / testers\n\nproduction\n   ↓\nreal users\n```\n\nA common EAS configuration uses `eas.json`.\n\nConceptually:\n\n```json\n{\n \"build\": {\n   \"development\": {},\n   \"staging\": {},\n   \"production\": {}\n }\n}\n```\n\nThen:\n\n```bash\neas build --profile development\n```\n\nor:\n\n```bash\neas build --profile staging\n```\n\nor:\n\n```bash\neas build --profile production\n```\n\nThe exact configuration depends on your application.",
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
      "id": "rn36-6",
      "title": "Environment separation",
      "durationMinutes": 5,
      "explanation": "This is one of the most important CI/CD concepts.\n\nYour application might communicate with different APIs:\n\n```text\nDevelopment\n\nhttps://dev-api.example.com\n```\n\n```text\nStaging\n\nhttps://staging-api.example.com\n```\n\n```text\nProduction\n\nhttps://api.example.com\n```\n\nYou do **not** want your production application accidentally pointing at the development API.\n\nA simple mental model:\n\n```text\n               Same codebase\n                    │\n         ┌──────────┼──────────┐\n         ↓          ↓          ↓\n      Dev build  Staging    Production\n         ↓          ↓          ↓\n      Dev API    Staging API  Prod API\n```\n\nEnvironment variables and EAS build profiles can help separate these configurations.\n\nBut remember:\n\n> A variable included in a mobile application is not automatically secret.\n\nIf a value is bundled into the application, a determined user may be able to inspect it.",
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
      "id": "rn36-7",
      "title": "GitHub Actions",
      "durationMinutes": 5,
      "explanation": "Now we connect GitHub to the process.\n\nA GitHub Actions workflow is an automated process triggered by GitHub events.\n\nFor example:\n\n```text\ngit push\n  ↓\nGitHub\n  ↓\nWorkflow starts\n```\n\nA simplified workflow could look like:\n\n```yaml\nname: Mobile CI\n\non:\n push:\n   branches:\n     - main\n\njobs:\n check:\n   runs-on: ubuntu-latest\n\n   steps:\n     - uses: actions/checkout@v4\n\n     - uses: actions/setup-node@v4\n       with:\n         node-version: 22\n\n     - run: npm ci\n\n     - run: npm run lint\n\n     - run: npx tsc --noEmit\n\n     - run: npm test -- --runInBand\n```\n\nThe important part isn't memorizing the YAML.\n\nUnderstand the flow:\n\n```text\ncheckout\n  ↓\ninstall dependencies\n  ↓\nlint\n  ↓\ntype-check\n  ↓\ntest\n```",
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
      "id": "rn36-8",
      "title": "Triggering an EAS build from GitHub Actions",
      "durationMinutes": 5,
      "explanation": "Once the checks pass:\n\n```text\nGitHub Actions\n     ↓\nLint ✅\n     ↓\nTypeScript ✅\n     ↓\nTests ✅\n     ↓\nEAS Build\n```\n\nYou can configure the workflow to authenticate with Expo/EAS using a CI token stored as a GitHub secret.\n\nConceptually:\n\n```yaml\n- run: npm ci\n\n- run: npm run lint\n\n- run: npx tsc --noEmit\n\n- run: npm test -- --runInBand\n\n- run: eas build --platform all --profile production --non-interactive\n```\n\nThe exact authentication and secret setup should be handled through GitHub Secrets rather than putting credentials directly in the repository.",
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
      "id": "rn36-9",
      "title": "GitHub Secrets",
      "durationMinutes": 4,
      "explanation": "Never do this:\n\n```yaml\nEXPO_TOKEN: \"my-real-secret-token\"\n```\n\ninside committed source code.\n\nInstead:\n\n```text\nGitHub Secrets\n     ↓\nGitHub Actions\n     ↓\nEnvironment variable\n     ↓\nEAS CLI\n```\n\nThe same principle applies to:\n\n```text\nAPI secrets\nsigning credentials\ntokens\nprivate keys\nservice credentials\n```",
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
      "id": "rn36-10",
      "title": "Fastlane",
      "durationMinutes": 4,
      "explanation": "**Fastlane** is a separate automation tool commonly used for mobile development.\n\nIt can automate tasks such as:\n\n```text\nbuilding\nsigning\nuploading\nscreenshots\nmetadata\nstore submission\n```\n\nIt gives you more direct control over native mobile release automation.\n\nThink of the tools like this:\n\n```text\nEAS\n↓\nExpo-oriented mobile workflow\n↓\nEasy managed automation\n```\n\nand:\n\n```text\nFastlane\n↓\nLower-level mobile automation\n↓\nMore direct customization\n```\n\nYou might use EAS for most of your application and reach for Fastlane when you have a native or store automation requirement that needs more control.",
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
      "id": "rn36-11",
      "title": "EAS vs Fastlane",
      "durationMinutes": 4,
      "explanation": "Don't think:\n\n```text\nEAS = Fastlane wrapper\n```\n\nA better mental model is:\n\n```text\n                Mobile CI/CD\n                     │\n            ┌────────┴────────┐\n            ↓                 ↓\n           EAS             Fastlane\n            ↓                 ↓\n    Expo-oriented       Native/mobile\n      workflow           automation\n```\n\nThey can also coexist in a larger pipeline.",
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
      "id": "rn36-12",
      "title": "A production CI/CD pipeline",
      "durationMinutes": 4,
      "explanation": "A realistic pipeline could be:\n\n```text\nDeveloper\n  │\n  │ git push\n  ↓\nGitHub\n  │\n  ↓\nGitHub Actions\n  │\n  ├── ESLint\n  │\n  ├── TypeScript\n  │\n  ├── Jest\n  │\n  └── Build checks\n         │\n         ↓\n       EAS\n         │\n         ↓\n    Production build\n         │\n         ↓\n    Approval / release\n         │\n         ↓\n     EAS Submit\n         │\n     ┌───┴────┐\n     ↓        ↓\n  App Store  Google Play\n```\n\nThis is what you should be able to explain after Day 36.",
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
      "id": "rn36-13",
      "title": "Common CI/CD mistakes",
      "durationMinutes": 4,
      "explanation": "### Mistake 1 — Building before testing\n\nBad:\n\n```text\npush\n↓\nbuild\n↓\ndiscover test failure\n```\n\nBetter:\n\n```text\npush\n↓\nlint\n↓\ntype-check\n↓\ntest\n↓\nbuild\n```\n\n### Mistake 2 — Production and staging use the same API\n\nThis can result in:\n\n```text\nstaging app\n   ↓\nproduction database\n```\n\nwhich is obviously dangerous.\n\n### Mistake 3 — Secrets committed to Git\n\nNever commit:\n\n```text\nAPI_SECRET\nEXPO_TOKEN\nPRIVATE_KEY\nPASSWORD\n```\n\n### Mistake 4 — Assuming \"CI passed\" means the app is perfect\n\nCI checks what you configured.\n\nIt cannot automatically prove:\n\n```text\nevery screen works\nevery device works\nevery OS version works\nevery native integration works\n```\n\nCI is a safety net, not magic.",
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
      "question": "What does Continuous Integration provide?",
      "options": [
        "A. Automated checks whenever code changes",
        "B. Manual store review",
        "C. Only cloud hosting",
        "D. Only native debugging"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does EAS Build create?",
      "options": [
        "A. Installable Android and iOS build artifacts",
        "B. JavaScript unit tests only",
        "C. Database migrations",
        "D. Git branches"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why are cloud builds useful?",
      "options": [
        "A. They provide repeatable build environments without relying on one developer machine",
        "B. They remove store review",
        "C. They eliminate native code",
        "D. They replace source control"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does EAS Submit automate?",
      "options": [
        "A. Uploading build artifacts to App Store Connect or Google Play",
        "B. Writing component tests",
        "C. Creating source maps",
        "D. Refreshing tokens"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why use separate build profiles?",
      "options": [
        "A. To configure development, preview, and production builds differently",
        "B. To duplicate every screen",
        "C. To avoid environment variables",
        "D. To disable signing"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Where should production credentials used by CI be stored?",
      "options": [
        "A. In protected CI or EAS secrets",
        "B. Inside source code",
        "C. In console logs",
        "D. In route parameters"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What can GitHub Actions do in a mobile pipeline?",
      "options": [
        "A. Run checks and trigger builds from repository events",
        "B. Replace the app stores",
        "C. Render native UI",
        "D. Store user sessions"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "How should a CI workflow authenticate with EAS?",
      "options": [
        "A. Using a protected token or approved credential mechanism",
        "B. With a password committed to Git",
        "C. Through AsyncStorage",
        "D. With a deep link"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "How does Fastlane relate to EAS?",
      "options": [
        "A. It is a separate automation option that can complement EAS",
        "B. EAS is only a Fastlane alias",
        "C. It is a test matcher",
        "D. It is a state library"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should happen when lint, type-check, or tests fail?",
      "options": [
        "A. The release pipeline should stop before producing a production release",
        "B. The failure should be ignored",
        "C. The app should submit anyway",
        "D. Secrets should be printed"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "CI/CD Self-check",
    "goal": "Push to `main` and have the mobile build start automatically without manually opening Expo, Android Studio, or Xcode.",
    "brief": "Your goal:\n\n> Push to `main` and have the mobile build start automatically without manually opening Expo, Android Studio, or Xcode.\n\nYou should be able to demonstrate:\n\n```text\ngit push origin main\n       ↓\nGitHub Actions starts\n       ↓\nlint\n       ↓\ntype-check\n       ↓\ntests\n       ↓\nEAS Build\n       ↓\nbuild appears in EAS\n```\n\nIf you can do that successfully, you understand the core CI/CD workflow.",
    "steps": [],
    "acceptance": [
      "A push to main starts GitHub Actions.",
      "Lint, type-check, and tests run before the build.",
      "EAS Build starts automatically.",
      "The completed build appears in EAS."
    ]
  }
});

