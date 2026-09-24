import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_28_LESSONS = normalizePastedLessonDay({
  "day": 28,
  "title": "Authoring and Publishing a Native Module",
  "overview": "📖 **4 lessons**\n\nToday we're taking the next step.\n\nSo far, you've learned how to:\n\n```\nUse native modules\nBuild Fabric components\nConfigure iOS and Android\nHandle platform differences\n```\n\nToday we're going to turn that knowledge into something reusable.\n\nInstead of writing native code directly inside one application, we're going to package it as a **standalone React Native native module**.\n\nThe goal is to reach this kind of architecture:\n\n```\nReact Native App\n      ↓\nYour Native Module\n      ↓\n┌───────────────┐\n│ JS / TS API   │\n├───────────────┤\n│ iOS           │\n│ Android       │\n└───────────────┘\n```\n\nAnd eventually:\n\n```\nnpm install your-native-module\n```\n\nThen another React Native application can use it.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn28-1",
      "title": "Structuring a standalone native module",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nA native module package is different from native code that only exists inside your application.\n\nInside an application, you might have:\n\n```\nmy-app/\n├── app/\n├── ios/\n├── android/\n└── package.json\n```\n\nA standalone native module is its own package.\n\nConceptually:\n\n```\nmy-native-module/\n├── src/\n│   └── index.ts\n├── ios/\n├── android/\n├── package.json\n├── README.md\n└── example/\n```\n\nThe package contains three important parts:\n\n```\nJavaScript / TypeScript API\n        +\niOS implementation\n        +\nAndroid implementation\n```\n\n---\n\n# The JavaScript / TypeScript side\n\nThis is what users of your package interact with.\n\nFor example:\n\n```\nimport { BatteryModule } from \"my-native-module\";\n\nconst level = await BatteryModule.getBatteryLevel();\n```\n\nThe consumer shouldn't need to know:\n\n```\nSwift\nKotlin\nObjective-C\nJava\nJNI\n```\n\nThey should see a clean TypeScript API.\n\nThink:\n\n```\nYour native implementation\n      ↓\n   JS/TS API\n      ↓\n React Native app\n```\n\n---\n\n# The iOS implementation\n\nYour package can contain its iOS native implementation:\n\n```\nmy-native-module/\n└── ios/\n  ├── BatteryModule.swift\n  └── ...\n```\n\nThe exact structure depends on the module architecture and tooling you're using.\n\nThe important concept is:\n\n```\niOS implementation\n      ↓\nimplements\n      ↓\nJS-facing API\n```\n\n---\n\n# The Android implementation\n\nAndroid has its own implementation:\n\n```\nmy-native-module/\n└── android/\n  ├── ...\n  └── BatteryModule.kt\n```\n\nAgain, the internal implementation can be completely different from iOS.\n\nFor example:\n\n```\nJavaScript\n  ↓\ngetBatteryLevel()\n  ↓\n┌──────────────┬──────────────┐\n↓              ↓\niOS            Android\nSwift          Kotlin\n↓              ↓\niOS API        Android API\n```\n\nThe JavaScript API stays the same.\n\n---\n\n# Why keep the API shared?\n\nImagine your module exposes:\n\n```\ngetBatteryLevel(): Promise<number>\n```\n\nYour application doesn't need:\n\n```\ngetIOSBatteryLevel()\n```\n\nand:\n\n```\ngetAndroidBatteryLevel()\n```\n\nunless there is a genuine platform-specific reason.\n\nInstead:\n\n```\ngetBatteryLevel()\n      ↓\n platform abstraction\n   ↙       ↘\n iOS     Android\n```\n\nThis makes your module easier to consume.\n\n---\n\n# The package.json file\n\nYour `package.json` describes the package itself.\n\nIt can contain things such as:\n\n```\nPackage name\nVersion\nDependencies\nPeer dependencies\nEntry points\nScripts\nRepository information\nLicense\n```\n\nFor example:\n\n```\n{\n\"name\": \"my-native-module\",\n\"version\": \"1.0.0\"\n}\n```\n\nThe package metadata becomes especially important once you publish to npm.\n\n---\n\n# What about an example app?\n\nA good native module package should have an example application.\n\nConceptually:\n\n```\nmy-native-module/\n├── src/\n├── ios/\n├── android/\n├── package.json\n└── example/\n  ├── app/\n  ├── ios/\n  └── android/\n```\n\nThe example app answers an important question:\n\n> **Does this package actually work when consumed by another React Native application?**\n\nThat is different from merely testing the native source files.\n\n---\n\n# Why the example app matters\n\nImagine your module builds successfully inside its own development environment.\n\nThat doesn't necessarily mean another developer can install it.\n\nYou also need to verify:\n\n```\nnpm install\n    ↓\nNative dependency linking/configuration\n    ↓\niOS build\n    ↓\nAndroid build\n    ↓\nJS API works\n```\n\nThe example app gives you a realistic integration test.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- A standalone native module is its own package.\n- It usually contains a JS/TS API plus native iOS and Android implementations.\n- The JS API should hide unnecessary platform details.\n- iOS and Android implementations can be completely different internally.\n- `package.json` defines important package metadata.\n- An example app is extremely useful for testing real consumption."
      ],
      "commonMistakes": [
        "### Mistake 1: Building the module only inside one app\n\nThat makes it difficult to know whether it is actually reusable.\n\n### Mistake 2: Exposing native implementation details\n\nPrefer:\n\n```\ngetBatteryLevel()\n```\n\nover:\n\n```\ncallAndroidBatteryManager()\n```\n\n### Mistake 3: Forgetting Android\n\nA native module isn't automatically cross-platform.\n\n### Mistake 4: Not having an example app\n\nYou want to test the package the same way a real consumer would use it."
      ],
      "quiz": [
        {
          "question": "What are the main pieces of a standalone React Native native module?",
          "options": [
            "A. Only JavaScript",
            "B. JS/TS API plus native platform implementations",
            "C. Only Swift",
            "D. Only Kotlin"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn28-2",
      "title": "Testing native code outside the main application",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nNow let's talk about testing.\n\nNative modules can fail in places that ordinary JavaScript tests don't cover.\n\nFor example:\n\n```\nTypeScript\n  ↓\nLooks correct\n  ↓\nNative implementation\n  ↓\nBuild failure\n```\n\nOr:\n\n```\nBuild succeeds\n  ↓\nNative API behaves incorrectly\n```\n\nThat's why you want multiple layers of testing.\n\n---\n\n# JavaScript tests\n\nStart with the JavaScript-facing API.\n\nSuppose your module exposes:\n\n```\ngetBatteryLevel()\n```\n\nYou can test things such as:\n\n```\nDoes the function exist?\nDoes it return the expected type?\nDoes the JS wrapper behave correctly?\nAre errors handled correctly?\n```\n\nThese tests don't necessarily execute the real native implementation.\n\nThat's okay.\n\nThey're testing a different layer.\n\n---\n\n# Native implementation tests\n\nYou can also test the native code using the platform's testing tools.\n\nFor iOS:\n\n```\nSwift / Objective-C\n     ↓\niOS test target\n```\n\nFor Android:\n\n```\nKotlin / Java\n     ↓\nAndroid test target\n```\n\nThe exact testing strategy depends on what your module does.\n\nFor example, if the native module contains:\n\n```\nParsing\nValidation\nState management\nData conversion\n```\n\nthose parts can often be tested independently.\n\n---\n\n# Integration testing\n\nEventually you want to test:\n\n```\nReact Native\n  ↓\nYour JS API\n  ↓\nNative module\n  ↓\nReal platform API\n```\n\nThis is where the example application becomes valuable.\n\nFor example:\n\n```\nexample app\n    ↓\nimport native module\n    ↓\ncall getBatteryLevel()\n    ↓\nnative implementation\n    ↓\ndisplay result\n```\n\nNow you're testing the entire integration.\n\n---\n\n# Why isolation matters\n\nSuppose your application has:\n\n```\n100 screens\n+\nnavigation\n+\nauthentication\n+\nnetworking\n+\nstate management\n+\nyour native module\n```\n\nIf the native module breaks, debugging the whole application can be painful.\n\nA small example application is much easier:\n\n```\nExample App\n  ↓\nNative Module\n  ↓\nPlatform\n```\n\nThis reduces unrelated variables.\n\n---\n\n# A useful testing pyramid\n\nThink about testing at several levels:\n\n```\n           End-to-end\n               ↑\n        Example app tests\n               ↑\n     Native integration tests\n               ↑\n      Native unit tests\n               ↑\n     JS/TS unit tests\n```\n\nYou don't necessarily need hundreds of tests at every layer.\n\nThe point is that each layer answers a different question.\n\n---\n\n# Test both platforms\n\nIf your module supports both:\n\n```\niOS\nAndroid\n```\n\ntest both.\n\nA module can easily have:\n\n```\niOS\n↓\nWorks\n\nAndroid\n↓\nBuild failure\n```\n\nor:\n\n```\niOS\n↓\nCorrect behavior\n\nAndroid\n↓\nDifferent edge case\n```\n\nDon't assume one platform proves the other.\n\n---\n\n# Test installation\n\nThis is particularly important for published packages.\n\nPretend you're a user.\n\nStart with a clean example app and test:\n\n```\nInstall package\n    ↓\nInstall dependencies\n    ↓\nConfigure native project\n    ↓\nBuild iOS\n    ↓\nBuild Android\n    ↓\nRun example\n```\n\nIf that process is confusing, your package documentation probably needs work.\n\n---\n\n# Test a clean package\n\nOne useful practice is testing the actual package contents rather than accidentally relying on files that exist only in your repository.\n\nYou want to know:\n\n```\nWhat will npm actually contain?\n```\n\nand:\n\n```\nCan a consumer install exactly that package?\n```\n\nThis catches packaging mistakes such as:\n\n```\nMissing native source\nMissing generated files\nIncorrect entry point\nMissing config plugin\nIncorrect package metadata\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Test the JS API separately from native implementation details.\n- Test native code using platform-specific testing tools where appropriate.\n- Use an example app for real React Native integration testing.\n- Test iOS and Android independently.\n- Test installation and packaging, not just source code.\n- A clean example app makes native debugging much easier."
      ],
      "commonMistakes": [
        "### Mistake 1: Only testing TypeScript\n\nThe native implementation can still be broken.\n\n### Mistake 2: Only testing inside your main application\n\nYour application may hide packaging or integration problems.\n\n### Mistake 3: Testing only iOS\n\nAndroid can have completely different native behavior.\n\n### Mistake 4: Never testing a clean installation\n\nA package that works in a monorepo can fail when installed by a real consumer."
      ],
      "quiz": [
        {
          "question": "Why is an example application useful?",
          "options": [
            "A. It replaces TypeScript",
            "B. It tests how the published module behaves when consumed by a React Native app",
            "C. It makes Android unnecessary",
            "D. It automatically fixes native bugs"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn28-3",
      "title": "Versioning and New Architecture compatibility",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nNow we reach an important difference between:\n\n```\nWriting a native module\n```\n\nand:\n\n```\nPublishing a native module\n```\n\nOnce other developers depend on your package, changes become a compatibility problem.\n\nSuppose version:\n\n```\n1.0.0\n```\n\nworks with a particular React Native setup.\n\nYou publish:\n\n```\n1.1.0\n```\n\nand change the native API.\n\nNow consumers may break.\n\nThat's why versioning matters.\n\n---\n\n# Semantic versioning\n\nA common convention is:\n\n```\nMAJOR.MINOR.PATCH\n```\n\nFor example:\n\n```\n1.4.2\n```\n\nmeans:\n\n```\n1 → major\n4 → minor\n2 → patch\n```\n\nThe general idea is:\n\n```\nPatch\n↓\nBug fixes\n\nMinor\n↓\nBackward-compatible features\n\nMajor\n↓\nBreaking changes\n```\n\nThis gives consumers information about how risky an upgrade might be.\n\n---\n\n# Example\n\nSuppose your module exposes:\n\n```\ngetBatteryLevel()\n```\n\nYou add:\n\n```\ngetBatteryState()\n```\n\nwithout breaking the existing API.\n\nThat could generally be a minor release:\n\n```\n1.0.0\n↓\n1.1.0\n```\n\nBut if you change:\n\n```\ngetBatteryLevel()\n```\n\ninto:\n\n```\ngetBatteryLevel(options)\n```\n\nand existing consumers can no longer use the old API, that may require a major-version change depending on the compatibility impact.\n\n---\n\n# Native modules have more compatibility dimensions\n\nA React Native native module isn't only compatible with JavaScript.\n\nIt can depend on:\n\n```\nReact Native version\niOS version\nAndroid version\nXcode\nSwift\nKotlin\nAndroid Gradle Plugin\nGradle\nCocoaPods\nNew Architecture\n```\n\nSo your compatibility story can become more complicated.\n\n---\n\n# New Architecture compatibility\n\nThis is especially important in modern React Native development.\n\nReact Native's New Architecture includes technologies such as:\n\n```\nFabric\nTurboModules\nCodegen\nJSI\n```\n\nA module intended for current React Native applications needs to clearly communicate whether it supports the New Architecture.\n\nBy 2026, this isn't something you should treat as an optional afterthought when publishing a serious native module.\n\nYour package should clearly document:\n\n```\nSupported React Native versions\nNew Architecture support\niOS requirements\nAndroid requirements\nInstallation requirements\n```\n\n---\n\n# Why compatibility documentation matters\n\nImagine someone installs:\n\n```\nmy-native-module\n```\n\nand gets:\n\n```\nBuild failure\n```\n\nbecause their project uses a different React Native architecture or unsupported version.\n\nWithout documentation, they have to debug your package themselves.\n\nWith good documentation:\n\n```\nReact Native:\nSupported versions: ...\n\nNew Architecture:\nSupported: Yes\n\niOS:\nMinimum version: ...\n\nAndroid:\nMinimum SDK: ...\n```\n\nthe consumer knows what to expect.\n\n---\n\n# Breaking native changes\n\nNative modules can have breaking changes that aren't obvious from TypeScript.\n\nFor example:\n\n```\nKotlin API changed\nSwift API changed\nGradle configuration changed\niOS deployment requirement changed\nNative event behavior changed\n```\n\nEven if:\n\n```\nindex.ts\n```\n\nlooks almost identical, the package can still be breaking.\n\nThat's why native versioning needs to consider the entire package.\n\n---\n\n# Peer dependencies\n\nA native module may also need to communicate which React Native versions it expects.\n\nFor example, package metadata may use peer dependencies to express compatibility.\n\nConceptually:\n\n```\nYour module\n  ↓\nexpects React Native\n  ↓\nsupported version range\n```\n\nThis helps consumers identify incompatible combinations earlier.\n\n---\n\n# Don't hide compatibility requirements\n\nYour README should make important requirements obvious.\n\nFor example:\n\n```\n## Requirements\n\nReact Native:\n...\n\nNew Architecture:\nSupported\n\niOS:\n...\n\nAndroid:\n...\n```\n\nDon't make users dig through source code to figure this out.\n\n---\n\n# Release checklist\n\nBefore publishing:\n\n```\nVersion updated\n      ↓\nChangelog updated\n      ↓\nCompatibility checked\n      ↓\nNew Architecture status confirmed\n      ↓\niOS tested\n      ↓\nAndroid tested\n      ↓\nExample app tested\n      ↓\nPackage contents checked\n```\n\nThen publish.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Publishing creates a compatibility responsibility.\n- Use consistent versioning such as semantic versioning.\n- Native modules have more compatibility dimensions than ordinary JS packages.\n- Document supported React Native versions.\n- Clearly state New Architecture compatibility.\n- Document iOS and Android requirements.\n- Treat native changes as potential breaking changes even when the TypeScript API looks unchanged."
      ],
      "commonMistakes": [
        "### Mistake 1: Treating a native module like a normal JavaScript-only package\n\nNative dependencies introduce additional compatibility concerns.\n\n### Mistake 2: Not documenting New Architecture support\n\nConsumers need to know whether the package works with their React Native setup.\n\n### Mistake 3: Changing native requirements without changing the version appropriately\n\nThis can unexpectedly break consumers.\n\n### Mistake 4: Testing only the repository\n\nAlways test the package as a consumer would install it."
      ],
      "quiz": [
        {
          "question": "Why does New Architecture compatibility matter when publishing a native module?",
          "options": [
            "A. It only affects TypeScript formatting",
            "B. React Native architecture affects how native modules integrate with the framework",
            "C. It only matters for web",
            "D. It determines the npm package name"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn28-4",
      "title": "Publishing to npm and documenting installation",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nNow we're ready to turn the module into something other developers can install.\n\nThe basic publishing flow looks like:\n\n```\nDevelop\n ↓\nTest\n ↓\nVersion\n ↓\nPackage\n ↓\nPublish\n ↓\nConsumer installs\n ↓\nNative project configured\n ↓\nModule works\n```\n\nPublishing the package itself is only part of the job.\n\nYou also need to explain how to install it.\n\n---\n\n# The README is part of the product\n\nFor a native module, the README isn't just optional documentation.\n\nIt should answer:\n\n```\nWhat does this package do?\nHow do I install it?\nDoes it support my React Native version?\nDoes it support the New Architecture?\nAre there native configuration steps?\nDoes it require a config plugin?\nWhat iOS/Android versions are supported?\nHow do I use the API?\n```\n\nA package with excellent code and terrible installation instructions is still difficult to use.\n\n---\n\n# Installation\n\nA typical installation might look like:\n\n```\nnpm install my-native-module\n```\n\nor:\n\n```\nyarn add my-native-module\n```\n\nBut native modules can require additional configuration.\n\nFor example:\n\n```\nnpm install\n     ↓\nNative dependency installed\n     ↓\niOS native configuration\n     ↓\nAndroid native configuration\n     ↓\nBuild\n```\n\nThe exact process depends on how your module is designed.\n\n---\n\n# Expo users\n\nIf your module is intended to work with Expo projects, you need to think about Expo's native configuration model.\n\nFor example, your module might require a:\n\n```\nConfig plugin\n```\n\nThe plugin can modify native configuration during prebuild.\n\nConceptually:\n\n```\napp.config.ts\n     ↓\nConfig plugin\n     ↓\nios/\nandroid/\n     ↓\nNative configuration\n```\n\nYour README should clearly say if a config plugin is required.\n\n---\n\n# Example installation documentation\n\nA consumer shouldn't have to guess.\n\nYou want something along the lines of:\n\n```\n## Installation\n\nnpm install my-native-module\n\n## Expo\n\nAdd the plugin to your Expo configuration:\n\n...\n\nThen run:\n\nnpx expo prebuild\n```\n\nThe exact instructions depend on your package.\n\nThe important part is that every required step is documented.\n\n---\n\n# npm publishing\n\nOnce you're ready, you'll need an npm account and appropriate package configuration.\n\nThe general flow is:\n\n```\nnpm login\n    ↓\nnpm publish\n```\n\nBefore doing this, verify:\n\n```\nPackage name\nVersion\nREADME\nLicense\nFiles included\nEntry points\nNative source\nConfig plugin\n```\n\n---\n\n# Check what you're publishing\n\nOne of the most useful habits is checking the package contents before publishing.\n\nYou don't want:\n\n```\nSource exists locally\n     ↓\nnpm package\n     ↓\nNative files missing\n```\n\nYour local repository can contain files that aren't included in the published package.\n\nSo inspect the package contents before publishing.\n\n---\n\n# Private publishing\n\nYou don't necessarily need to publish publicly for today's exercise.\n\nYou can practice with:\n\n```\nPrivate package\n```\n\nor:\n\n```\nLocal package\n```\n\nThe important thing is proving:\n\n```\nAnother application\n      ↓\nConsumes your module\n      ↓\nNative code builds\n      ↓\nJS API works\n```\n\nThat's the actual skill we're practicing.\n\n---\n\n# Example app as documentation\n\nYour example application can serve two purposes:\n\n```\nTesting\n+\nDocumentation\n```\n\nFor example:\n\n```\nexample/\n ↓\nBasic usage\n ↓\nShows expected behavior\n```\n\nSomeone maintaining the package can also use it to verify future releases.\n\n---\n\n# A good native module README\n\nA practical README might contain:\n\n```\n# My Native Module\n\n## What it does\n\n...\n\n## Requirements\n\nReact Native:\n...\n\nNew Architecture:\n...\n\niOS:\n...\n\nAndroid:\n...\n\n## Installation\n\n...\n\n## Expo configuration\n\n...\n\n## Usage\n\n...\n\n## API\n\n...\n\n## Example\n\n...\n\n## Troubleshooting\n\n...\n\n## License\n...\n```\n\nThis gives consumers a predictable place to look for information.\n\n---\n\n# Publishing checklist\n\nBefore you publish, check:\n\n```\n[ ] Package name is correct\n[ ] Version is correct\n[ ] README is complete\n[ ] License exists\n[ ] JS/TS entry point works\n[ ] iOS implementation included\n[ ] Android implementation included\n[ ] Config plugin documented if required\n[ ] New Architecture support documented\n[ ] React Native compatibility documented\n[ ] Example app works\n[ ] iOS tested\n[ ] Android tested\n[ ] Package contents inspected\n```\n\nThen:\n\n```\nnpm publish\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Publishing a native module means publishing both code and an installation experience.\n- Your README should document compatibility and native configuration.\n- Expo-compatible modules may need config-plugin documentation.\n- Always verify the actual package contents.\n- A private package is enough for practicing the publishing workflow.\n- An example app is both a test environment and a usage reference."
      ],
      "commonMistakes": [
        "### Mistake 1: Only documenting the JavaScript API\n\nNative installation requirements are equally important.\n\n### Mistake 2: Forgetting Expo users\n\nIf your package supports Expo, clearly document any required config plugin or prebuild step.\n\n### Mistake 3: Publishing without checking package contents\n\nYour published package may not contain everything in your repository.\n\n### Mistake 4: No compatibility information\n\nConsumers need to know which React Native and platform versions you support."
      ],
      "quiz": [
        {
          "question": "What should a native module README document?",
          "options": [
            "A. Only the function names",
            "B. Installation, compatibility, native requirements, configuration, and usage",
            "C. Only the npm package name",
            "D. Only the source code"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What are the main pieces of a standalone React Native native module?",
      "options": [
        "A. Only JavaScript",
        "B. JS/TS API plus native platform implementations",
        "C. Only Swift",
        "D. Only Kotlin"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "Why is an example application useful?",
      "options": [
        "A. It replaces TypeScript",
        "B. It tests how the published module behaves when consumed by a React Native app",
        "C. It makes Android unnecessary",
        "D. It automatically fixes native bugs"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "Why does New Architecture compatibility matter when publishing a native module?",
      "options": [
        "A. It only affects TypeScript formatting",
        "B. React Native architecture affects how native modules integrate with the framework",
        "C. It only matters for web",
        "D. It determines the npm package name"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What should a native module README document?",
      "options": [
        "A. Only the function names",
        "B. Installation, compatibility, native requirements, configuration, and usage",
        "C. Only the npm package name",
        "D. Only the source code"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What should a standalone native module expose?",
      "options": [
        "A. A small stable public API",
        "B. Application-specific screen internals",
        "C. Every native dependency",
        "D. Unversioned global state"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why use an example application with a native module?",
      "options": [
        "A. To test integration outside the main application",
        "B. To replace package tests",
        "C. To hide installation steps",
        "D. To avoid native builds"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What communicates breaking API changes?",
      "options": [
        "A. Semantic versioning",
        "B. A query key",
        "C. A splash screen",
        "D. A route parameter"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should New Architecture compatibility include?",
      "options": [
        "A. Clear support for Codegen and required native contracts",
        "B. Only a README badge",
        "C. Deep React Native imports",
        "D. No platform tests"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What must installation documentation explain?",
      "options": [
        "A. Setup, permissions, configuration, and usage",
        "B. Only the package name",
        "C. Only JavaScript syntax",
        "D. Private credentials"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should happen before publishing to npm?",
      "options": [
        "A. Build, test, package, and verify the public contents",
        "B. Delete native sources",
        "C. Remove version information",
        "D. Disable TypeScript"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Self-Check — Publish a Native Module",
    "goal": "Publish a Native Module",
    "brief": "Now let's put everything together.\n\nYour goal is to create a small standalone native module and have a separate example application consume it.\n\nYou don't need to build something complicated.\n\nA tiny module is better.\n\nFor example:\n\n```\nDeviceInfoModule\n```\n\nwith:\n\n```\ngetDeviceName()\n```\n\nor:\n\n```\ngetBatteryLevel()\n```\n\nThe goal is the packaging workflow, not the complexity of the native API.\n\n---\n\n# Step 1 — Choose the API\n\nStart with a tiny JavaScript interface.\n\nFor example:\n\n```\ngetBatteryLevel(): Promise<number>\n```\n\nYour React Native application should be able to write:\n\n```\nconst level = await getBatteryLevel();\n```\n\nThat's it.\n\nKeep the first module small.\n\n---\n\n# Step 2 — Create the package\n\nYour project should conceptually look like:\n\n```\nmy-native-module/\n├── src/\n│   └── index.ts\n├── ios/\n├── android/\n├── example/\n├── package.json\n└── README.md\n```\n\nYou don't need dozens of files.\n\nThe important thing is having a clear separation between:\n\n```\nPackage API\nNative implementations\nExample consumer\nDocumentation\n```\n\n---\n\n# Step 3 — Implement iOS\n\nImplement the native functionality using the appropriate iOS API.\n\nFor example:\n\n```\nJavaScript\n   ↓\ngetBatteryLevel()\n   ↓\niOS native implementation\n   ↓\niOS battery API\n   ↓\nnumber\n   ↓\nJavaScript\n```\n\nTest that it actually returns a sensible value.\n\n---\n\n# Step 4 — Implement Android\n\nNow implement the same API on Android.\n\nConceptually:\n\n```\nJavaScript\n   ↓\ngetBatteryLevel()\n   ↓\nAndroid native implementation\n   ↓\nAndroid battery API\n   ↓\nnumber\n   ↓\nJavaScript\n```\n\nThe native implementations can be completely different.\n\nThe JavaScript API remains:\n\n```\ngetBatteryLevel()\n```\n\n---\n\n# Step 5 — Build the example app\n\nCreate a small screen:\n\n```\n┌──────────────────────────┐\n│      Battery Demo        │\n│                          │\n│      Battery: 82%        │\n│                          │\n│       [ Refresh ]        │\n└──────────────────────────┘\n```\n\nThe example app should consume your module as a dependency.\n\nDon't copy the module's implementation into the example app.\n\nThe point is to simulate a real consumer.\n\n---\n\n# Step 6 — Test the package\n\nVerify:\n\n```\nExample app\n    ↓\nImports package\n    ↓\nCalls native module\n    ↓\niOS works\n```\n\nThen:\n\n```\nExample app\n    ↓\nImports package\n    ↓\nCalls native module\n    ↓\nAndroid works\n```\n\n---\n\n# Step 7 — Add compatibility documentation\n\nIn the README, document:\n\n```\nReact Native versions\nNew Architecture support\niOS requirements\nAndroid requirements\nExpo compatibility\n```\n\nBe specific.\n\nIf something isn't supported, say so.\n\n---\n\n# Step 8 — Add installation instructions\n\nDocument the actual process.\n\nFor example:\n\n```\nnpm install my-native-module\n```\n\nThen document any required native configuration.\n\nIf your package requires a config plugin:\n\n```\nInstall package\n    ↓\nAdd plugin\n    ↓\nnpx expo prebuild\n    ↓\nBuild\n```\n\nMake sure the instructions match what you've actually tested.\n\n---\n\n# Step 9 — Version the package\n\nStart with:\n\n```\n1.0.0\n```\n\nif this is your first stable release.\n\nThen imagine you need to change the native implementation.\n\nAsk:\n\n```\nIs this backward compatible?\n```\n\nIf yes, determine whether it is a minor or patch change.\n\nIf existing consumers would break, consider whether it requires a major version.\n\nThe exact versioning decision depends on the compatibility impact.\n\n---\n\n# Step 10 — Inspect the package\n\nBefore publishing, verify what will actually be included.\n\nLook for:\n\n```\nJS/TS entry point\niOS source\nAndroid source\npackage metadata\nREADME\nconfig plugin\n```\n\nYou don't want to publish a package that works only because your local repository contains files that aren't shipped.\n\n---\n\n# Step 11 — Publish privately if necessary\n\nYou don't need to make your module a public npm package for this exercise.\n\nThe important thing is:\n\n```\nPackage\n  ↓\nPublished/consumable artifact\n  ↓\nExample application\n  ↓\nSuccessful native build\n```\n\nThat demonstrates that you've learned the packaging workflow.\n\n---\n\n# Step 12 — Install it like a stranger\n\nThis is the most important test.\n\nPretend you know nothing about the module.\n\nStart with the example application.\n\nThen follow only the README:\n\n```\nRead README\n   ↓\nInstall package\n   ↓\nConfigure native project\n   ↓\nBuild iOS\n   ↓\nBuild Android\n   ↓\nRun application\n```\n\nIf you need to open your source code to figure out installation, improve the documentation.\n\n---\n\n# Step 13 — Test a release-like environment\n\nDon't rely exclusively on:\n\n```\n\"It works on my machine.\"\n```\n\nTest the package in a clean enough environment that you can catch:\n\n```\nMissing files\nIncorrect package metadata\nMissing native configuration\nIncorrect peer dependencies\nBroken config plugins\nArchitecture incompatibilities\n```\n\nThis is what separates a reusable native module from native code that merely works inside your own application.\n\n---\n\n# Step 14 — Write your release checklist\n\nCreate a checklist like:\n\n```\nNative Module Release\n\nPackage:\n[ ] package.json\n[ ] JS/TS API\n[ ] iOS implementation\n[ ] Android implementation\n\nCompatibility:\n[ ] React Native versions documented\n[ ] New Architecture support documented\n[ ] iOS requirements documented\n[ ] Android requirements documented\n\nInstallation:\n[ ] npm installation tested\n[ ] Expo configuration documented\n[ ] Config plugin documented if needed\n[ ] Example app tested\n\nQuality:\n[ ] iOS tested\n[ ] Android tested\n[ ] Package contents inspected\n[ ] README complete\n[ ] Version updated\n```\n\nThis becomes a reusable checklist for future native packages.",
    "steps": [],
    "acceptance": [
      "You have created a standalone native module package.",
      "The package exposes a small JS/TypeScript API.",
      "You have an iOS native implementation.",
      "You have an Android native implementation.",
      "You have an example React Native application.",
      "The example application consumes the module as a dependency.",
      "The module works on iOS.",
      "The module works on Android.",
      "You have tested the package outside your main application.",
      "You have documented installation.",
      "You have documented React Native compatibility.",
      "You have documented New Architecture compatibility.",
      "You have documented any Expo/config-plugin requirements.",
      "You have assigned a package version.",
      "You have inspected the package contents.",
      "You have published it privately or otherwise created a consumable package artifact.",
      "You can explain the difference between **writing native code** and **shipping a reusable native package**."
    ],
    "stretch": [],
    "footer": "Once your module works, try these.\n\n### 1\\. Add a second method\n\nFor example:\n\n```\ngetBatteryLevel()\ngetBatteryState()\n```\n\nKeep the API simple.\n\n---\n\n### 2\\. Add an event\n\nFor example:\n\n```\nonBatteryLevelChanged\n```\n\nNow your module needs to handle:\n\n```\nNative\n ↓\nevent\n ↓\nJavaScript\n```\n\nThis connects directly to the native-module concepts from Day 22.\n\n---\n\n### 3\\. Add Expo support\n\nCreate a config plugin if your native implementation requires native project configuration.\n\nThen test:\n\n```\napp.config.ts\n    ↓\nConfig plugin\n    ↓\nprebuild\n    ↓\nios/android\n    ↓\nnative module\n```\n\n---\n\n### 4\\. Add automated tests\n\nCreate:\n\n```\nJS tests\n+\niOS tests\n+\nAndroid tests\n+\nExample app integration tests\n```\n\nYou don't need perfect coverage.\n\nThe goal is to understand which layer each test is validating.\n\n---\n\n### 5\\. Publish a second version\n\nStart with:\n\n```\n1.0.0\n```\n\nThen make a backward-compatible improvement.\n\nPublish:\n\n```\n1.1.0\n```\n\nThen document the change in a changelog.\n\n---\n\n### 6\\. Test New Architecture compatibility explicitly\n\nRun the example app using the React Native architecture configuration you're targeting.\n\nVerify:\n\n```\nJS API\n ↓\nNative module\n ↓\nNew Architecture\n ↓\niOS / Android\n```\n\nThis is especially important for a module intended for modern React Native applications.\n\n---\n\n# 🧠 Final Mental Model\n\nDay 22 taught you how a native module works:\n\n```\nJavaScript\n  ↓\nNative Module\n  ↓\niOS / Android API\n```\n\nToday we're turning that into a reusable package:\n\n```\n                Native Module Package\n                         │\n        ┌────────────────┼────────────────┐\n        ↓                ↓                ↓\n     JS / TS            iOS            Android\n        │                │                │\n        └────────────────┼────────────────┘\n                         ↓\n                  Example App\n                         ↓\n                  Real Integration\n```\n\nAnd the publishing lifecycle becomes:\n\n```\nDesign API\n  ↓\nImplement native code\n  ↓\nTest native code\n  ↓\nBuild example app\n  ↓\nTest integration\n  ↓\nDocument compatibility\n  ↓\nVersion package\n  ↓\nInspect package contents\n  ↓\nPublish\n  ↓\nConsumer installs package\n```\n\nThe most important rule to remember is:\n\n> **A native module isn't finished when the native code works. It's finished when another React Native application can install it, configure it, build it, and use it without needing to understand your internal implementation.**"
  }
});

