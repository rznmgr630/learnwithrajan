import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_22_LESSONS = normalizePastedLessonDay({
  "day": 22,
  "title": "Bridging to Native Code",
  "overview": "📖 **4 lessons**\n\nToday we're going underneath React Native.\n\nSo far, we've mostly written JavaScript or TypeScript:\n\n```\nReact Native\n   ↓\nComponents\n   ↓\nHooks\n   ↓\nNavigation\n   ↓\nState\n   ↓\nAPIs\n```\n\nBut a phone has capabilities that don't naturally live in JavaScript.\n\nFor example:\n\n- Battery information\n- Bluetooth\n- NFC\n- Native sensors\n- Platform-specific APIs\n- Custom camera functionality\n- Specialized audio processing\n- Native SDKs provided by a company\n\nWhen JavaScript needs to communicate with code written in **Swift/Objective-C** on iOS or **Kotlin/Java** on Android, we need a bridge between the two worlds.\n\nThat is what today's lesson is about.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn22-1",
      "title": "When do you actually need a native module?",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nLet's start with the most important rule:\n\n> **Don't write native code just because you can.**\n\nNative modules are powerful, but they introduce additional complexity.\n\nBefore creating one, first ask:\n\n```\nDo I actually need native code?\n        ↓\n      No\n        ↓\nUse JavaScript/Expo/RN library\n```\n\nIf the answer is yes:\n\n```\nNeed native capability\n      ↓\nDoes an existing library provide it?\n     ↙          ↘\n   YES           NO\n    ↓             ↓\nUse library      Build module\n```\n\nThis should be your first decision.\n\n---\n\n## What is a native module?\n\nA **native module** is code written for the operating system that exposes functionality to your React Native JavaScript/TypeScript code.\n\nFor example:\n\n```\nJavaScript\n  ↓\nBatteryModule.getLevel()\n  ↓\nNative module\n  ↓\niOS / Android battery API\n  ↓\nBattery percentage\n```\n\nJavaScript doesn't need to know how iOS or Android actually retrieves the battery level.\n\nIt simply gets a useful API.\n\n---\n\n## Why can't JavaScript do everything?\n\nReact Native's JavaScript environment isn't automatically the same as the operating system's native APIs.\n\nFor example, imagine Android provides:\n\n```\nBatteryManager\n```\n\nYour React Native TypeScript code can't simply assume that this Android class exists:\n\n```\nconst battery = BatteryManager.getLevel();\n```\n\nIt doesn't work like that.\n\nYou need native code that understands Android's API.\n\nThe native module becomes the translator:\n\n```\nReact Native JavaScript\n      ↕\n Native module\n      ↕\nOperating system API\n```\n\n---\n\n## Common reasons for creating a native module\n\nYou might need one when:\n\n### 1\\. A platform API isn't exposed by React Native\n\nFor example, a new operating-system feature that your current libraries don't support.\n\n### 2\\. A third-party SDK only provides native SDKs\n\nSuppose a company provides:\n\n```\niOS SDK\nAndroid SDK\n```\n\nbut doesn't provide a React Native package.\n\nYou may need to connect those SDKs to JavaScript.\n\n### 3\\. You need specialized performance\n\nSome workloads are much better suited to native code.\n\nFor example:\n\n- Image processing\n- Audio processing\n- Cryptographic operations\n- Complex hardware interaction\n\n### 4\\. You need platform-specific behavior\n\nSometimes iOS and Android expose different capabilities.\n\nYour JavaScript API can hide those differences.\n\nFor example:\n\n```\nconst battery = await BatteryModule.getLevel();\n```\n\nBehind the scenes:\n\n```\niOS → iOS battery API\n\nAndroid → Android battery API\n```\n\nJavaScript sees one consistent API.\n\n---\n\n# Why native modules should be rare\n\nEvery native module creates another piece of code you have to maintain.\n\nYou may now have:\n\n```\nTypeScript\n +\niOS Swift\n +\nAndroid Kotlin\n```\n\nInstead of only:\n\n```\nTypeScript\n```\n\nYou also have platform-specific concerns.\n\nFor example:\n\n```\nTypeScript API\n    ↓\niOS implementation\n    ↓\nAndroid implementation\n```\n\nIf you change the JavaScript API, you may need to update both native implementations.\n\n---\n\n## A useful decision tree\n\nBefore creating a native module, ask:\n\n```\nDo I need native functionality?\n        ↓\n       NO\n        ↓\n     Stop\n\n        YES\n        ↓\nDoes React Native already provide it?\n     ↙          ↘\n   YES           NO\n    ↓             ↓\nUse RN API      Does Expo provide it?\n                  ↙      ↘\n                YES       NO\n                 ↓         ↓\n            Use Expo     Search existing\n            module       community library\n                            ↓\n                       Still unavailable?\n                            ↓\n                     Build native module\n```\n\nThis can save you a lot of unnecessary work.\n\n---\n\n## Example: Battery level\n\nSuppose your app wants to display:\n\n```\nBattery: 78%\n```\n\nYou could imagine an API like:\n\n```\nconst level = await BatteryModule.getLevel();\n\nconsole.log(level);\n// 0.78\n```\n\nThe JavaScript code doesn't need to understand:\n\n```\nUIDevice\nBatteryManager\nKotlin\nSwift\nObjective-C\n```\n\nThe native module hides those details.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Native modules expose native functionality to JavaScript.\n- Use an existing library before writing your own.\n- Native code is useful for platform APIs and native-only SDKs.\n- Native modules increase project complexity.\n- A good native module hides platform-specific implementation details behind a simple JavaScript API."
      ],
      "commonMistakes": [
        "### Mistake 1: Writing a native module when a library already exists\n\nAlways search first.\n\n### Mistake 2: Putting platform-specific logic directly throughout the app\n\nKeep it behind a clean API.\n\n### Mistake 3: Assuming iOS and Android APIs are identical\n\nThey often aren't.\n\n### Mistake 4: Creating a native module for something JavaScript can already handle\n\nDon't introduce complexity without a reason."
      ],
      "quiz": [
        {
          "question": "When should you consider writing a native module?",
          "options": [
            "A. Every time you create a screen",
            "B. Whenever you want to avoid TypeScript",
            "C. When you genuinely need native functionality that isn't already provided by an appropriate library/API",
            "D. Whenever a button needs styling"
          ],
          "correctIndex": 2,
          "explanation": "**Answer:** C"
        }
      ]
    },
    {
      "id": "rn22-2",
      "title": "Writing a TurboModule: Codegen and the generated code",
      "durationMinutes": 17,
      "explanation": "⏱ **17 min**\n\n## Explanation\n\nNow we're getting deeper into React Native internals.\n\nYou've already learned that JavaScript needs a way to communicate with native code.\n\nModern React Native uses the **New Architecture**, which includes technologies such as:\n\n- JSI\n- TurboModules\n- Fabric\n- Codegen\n\nYou encountered these concepts earlier in the course.\n\nToday we're going to connect them together.\n\n---\n\n## What is a TurboModule?\n\nA **TurboModule** is a modern React Native native module system designed to provide efficient communication between JavaScript and native code.\n\nInstead of thinking:\n\n```\nJavaScript\n  ↓\nMagic bridge\n  ↓\nNative\n```\n\nthink:\n\n```\nJavaScript API\n     ↓\nTyped specification\n     ↓\nCodegen\n     ↓\nNative implementation\n```\n\nThe important addition is the **specification**.\n\n---\n\n# What is a Codegen spec?\n\n**Codegen** means **code generation**.\n\nInstead of manually writing all the glue code that connects JavaScript and native code, you describe your module's API in a structured specification.\n\nFor example, conceptually:\n\n```\nBatteryModule\n\ngetBatteryLevel()\ngetBatteryState()\n```\n\nThe specification describes:\n\n- Module name\n- Methods\n- Parameters\n- Return values\n- Types\n\nThen React Native's tooling generates parts of the native integration.\n\n---\n\n## Why is Codegen useful?\n\nImagine you have:\n\n```\nJavaScript API\n    ↓\nNative interface\n    ↓\nNative implementation\n```\n\nWithout a standardized generated interface, you would have more glue code to maintain manually.\n\nWith Codegen:\n\n```\nTypeScript-like specification\n        ↓\n      Codegen\n     ↙        ↘\niOS generated   Android generated\ninterfaces      interfaces\n```\n\nThis makes the contract between JavaScript and native code more explicit.\n\n---\n\n## What is an API contract?\n\nAn **API contract** is an agreed description of what an API provides.\n\nFor example:\n\n```\ngetBatteryLevel()\n```\n\nmight have the contract:\n\n```\nInput:\nnothing\n\nOutput:\nnumber\n```\n\nSo JavaScript knows:\n\n```\ngetBatteryLevel()\n→ Promise<number>\n```\n\nThe native implementation has to follow that contract.\n\n---\n\n## Why types matter\n\nSuppose JavaScript expects:\n\n```\nnumber\n```\n\nbut Android accidentally returns:\n\n```\n\"78%\"\n```\n\nNow you have a mismatch.\n\nA strong typed specification helps catch these kinds of problems.\n\nFor example:\n\n```\nExpected:\nnumber\n\nReceived:\nstring\n```\n\nThat's much easier to reason about than an undocumented native interface.\n\n---\n\n# What does Codegen actually generate?\n\nThis is an important beginner question.\n\nCodegen doesn't magically write your entire native feature.\n\nYou still write the native implementation.\n\nThink of it like this:\n\n```\nYou write:\n\n\"What functions does my module expose?\"\n           ↓\n     Codegen reads spec\n           ↓\nGenerates integration/types/interfaces\n           ↓\nYou implement native behavior\n```\n\nSo:\n\n```\nCodegen\n≠\nAutomatically creates the entire feature\n```\n\nIt generates the pieces needed to connect your declared API to the native implementation.\n\n---\n\n## Conceptual TurboModule architecture\n\n```\n               JavaScript\n                   │\n                   │\n           BatteryModule\n                   │\n                   ↓\n            Codegen contract\n                   │\n           ┌───────┴────────┐\n           ↓                ↓\n     iOS generated     Android generated\n        interface          interface\n           ↓                ↓\n     Swift/Obj-C        Kotlin/Java\n           │                │\n           └───────┬────────┘\n                   ↓\n            Operating system\n```\n\n---\n\n## Why TurboModules matter\n\nTurboModules fit into React Native's newer architecture.\n\nThey are designed around more direct and efficient JavaScript-to-native communication.\n\nYou've already seen this idea on Day 2:\n\n```\nJS\n↓\nJSI\n↓\nNative\n```\n\n**JSI (JavaScript Interface)** is the low-level interface that allows JavaScript to interact with native/C++ functionality without relying on the old serialized bridge model for every interaction.\n\nYou don't need to memorize the internal implementation yet.\n\nThe important idea is:\n\n> **TurboModules are the modern way of exposing native functionality to React Native's JavaScript environment.**",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- TurboModules are part of React Native's modern native-module architecture.\n- A Codegen specification describes the native module's API.\n- Codegen generates integration code/interfaces from that specification.\n- You still implement the actual native functionality.\n- Types make the JavaScript/native contract clearer.\n- TurboModules work with the New Architecture and JSI."
      ],
      "commonMistakes": [
        "### Mistake 1: Thinking Codegen writes the native implementation\n\nIt doesn't.\n\nYou still implement the native functionality.\n\n### Mistake 2: Treating the spec as optional documentation\n\nThe spec defines an important contract.\n\n### Mistake 3: Ignoring types\n\nNative boundaries are exactly where type mismatches can become difficult bugs.\n\n### Mistake 4: Learning TurboModules without understanding why they exist\n\nRemember the basic goal:\n\n```\nJavaScript\n  ↕\nNative functionality\n```\n\nEverything else supports that communication."
      ],
      "quiz": [
        {
          "question": "What is the purpose of a Codegen specification?",
          "options": [
            "A. To define the native module's API so tooling can generate integration code",
            "B. To design the application's colors",
            "C. To replace React components",
            "D. To store authentication tokens"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn22-3",
      "title": "Expo Modules API — the easier way to write native code",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nIf you're using Expo, you don't necessarily want to manually build every part of a native module from scratch.\n\nExpo provides the **Expo Modules API**, which gives you a structured way to create native modules for Expo/React Native applications.\n\nThe idea is:\n\n```\nJavaScript / TypeScript\n        ↓\n  Expo Module API\n        ↓\n  Native implementation\n        ↓\n    iOS / Android\n```\n\nIt handles much of the boilerplate (repetitive setup code) for you.\n\n---\n\n## Why does this matter?\n\nWithout a higher-level API, creating a native module can involve a lot of platform-specific setup.\n\nYou might need to deal with:\n\n```\niOS project configuration\nAndroid project configuration\nNative registration\nGenerated interfaces\nPackage configuration\nBuild configuration\n```\n\nExpo Modules API gives you a more structured developer experience.\n\n---\n\n# What does a module expose?\n\nImagine you want:\n\n```\nconst battery = await BatteryModule.getLevel();\n```\n\nYour module needs to expose:\n\n```\nBatteryModule\n  ↓\ngetLevel()\n```\n\nThe native implementation then performs the actual operating-system call.\n\n---\n\n## Conceptual Expo module\n\nYou might think of the native module like this:\n\n```\nModule(\"BatteryModule\") {\n  Function(\"getLevel\") {\n      // Ask the operating system\n      // for the current battery level\n\n      return batteryLevel\n  }\n}\n```\n\nThe exact syntax depends on the platform and Expo Modules API version you're using, but the architecture is the important part.\n\nJavaScript gets a clean API:\n\n```\nconst battery = await BatteryModule.getLevel();\n```\n\nNative code handles:\n\n```\n\"How do I get battery information on this operating system?\"\n```\n\n---\n\n## Modules can expose more than functions\n\nA native module can expose things such as:\n\n- Functions\n- Constants\n- Events\n- Properties\n- Native objects\n- Lifecycle behavior\n\nFor example:\n\n```\nBatteryModule\n\ngetLevel()\ngetState()\n\nonBatteryChanged()\n```\n\nJavaScript might subscribe to battery changes:\n\n```\nNative battery changes\n      ↓\nNative module emits event\n      ↓\nReact Native\n      ↓\nJavaScript listener\n      ↓\nUI updates\n```\n\n---\n\n# What is an event?\n\nAn **event** is a message saying that something happened.\n\nFor example:\n\n```\nBattery changed\n```\n\nThe native side can notify JavaScript:\n\n```\nNative\n↓\n\"Battery changed to 62%\"\n↓\nJavaScript\n↓\nUpdate UI\n```\n\nThis is useful for things that change over time.\n\n---\n\n## Expo Modules API vs TurboModules\n\nThese aren't necessarily competing concepts.\n\nThink of it like this:\n\n```\nTurboModules\n   ↓\nReact Native's native-module architecture\n\nExpo Modules API\n   ↓\nHigher-level developer API for building modules\n```\n\nExpo Modules API can integrate with React Native's modern architecture while giving you a friendlier way to define native functionality.\n\n---\n\n## When should you use Expo Modules API?\n\nIf you're already building an Expo project and genuinely need custom native functionality, Expo Modules API is often a natural place to start.\n\nFor example:\n\n```\nExpo app\n ↓\nNeed custom native functionality\n ↓\nExisting Expo module?\n ↓\nNo\n ↓\nCreate custom Expo module\n```\n\n---\n\n## What about JavaScript-only Expo apps?\n\nYou don't need to write native modules for normal application logic.\n\nFor example, don't create a native module for:\n\n```\nCalculating a total\nFormatting a date\nFiltering an array\nManaging React state\nRendering a button\n```\n\nThese are normal JavaScript/TypeScript problems.\n\nNative modules are for actual native capabilities.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Expo Modules API makes creating native modules easier in Expo projects.\n- It reduces repetitive native setup.\n- A module can expose functions, events, constants, and other native behavior.\n- JavaScript gets a clean API while native code handles operating-system details.\n- Use it when you genuinely need custom native functionality."
      ],
      "commonMistakes": [
        "### Mistake 1: Using native code for ordinary JavaScript logic\n\nDon't.\n\n### Mistake 2: Creating a custom module before searching Expo libraries\n\nAn existing Expo package may already solve the problem.\n\n### Mistake 3: Exposing too much native complexity\n\nKeep the JavaScript API simple.\n\nInstead of exposing:\n\n```\nAndroidBatteryManager\nBatteryIntent\nBatteryReceiver\n...\n```\n\nprefer:\n\n```\nBatteryModule.getLevel()\n```"
      ],
      "quiz": [
        {
          "question": "Why is Expo Modules API useful?",
          "options": [
            "A. It replaces TypeScript",
            "B. It provides a more convenient way to create native modules in Expo projects",
            "C. It removes the need for native operating systems",
            "D. It automatically creates your entire application"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn22-4",
      "title": "\"Ejecting\" vs Expo Prebuild and Continuous Native Generation",
      "durationMinutes": 13,
      "explanation": "⏱ **13 min**\n\n## Explanation\n\nIf you've been around React Native for a while, you may have heard the word:\n\n> **\"Eject.\"**\n\nThis can be confusing if you're learning modern Expo.\n\nHistorically, developers often talked about \"ejecting\" from Expo.\n\nThe simplified idea was:\n\n```\nExpo-managed project\n     ↓\nEject\n     ↓\nGenerate native iOS/Android projects\n     ↓\nManually manage them\n```\n\nThe modern Expo workflow is better understood through **prebuild** and **continuous native generation**.\n\n---\n\n# What is prebuild?\n\n**Prebuild** is the process of generating native Android and iOS project files from your Expo project configuration.\n\nConceptually:\n\n```\napp.json / app.config\n      +\nExpo configuration\n      +\nNative dependencies\n      ↓\n    Prebuild\n      ↓\nios/\nandroid/\n```\n\nThe generated native projects can then be built as native applications.\n\n---\n\n## Why is this useful?\n\nSuppose your Expo app needs native functionality.\n\nYou can configure your project and generate the native projects when needed.\n\nYou don't have to think:\n\n```\n\"I have permanently left Expo.\"\n```\n\nThat's not the most useful mental model anymore.\n\nInstead, think:\n\n```\nExpo project\n  ↓\nConfiguration\n  ↓\nGenerate native projects\n  ↓\nBuild native app\n```\n\n---\n\n# What is continuous native generation?\n\n**Continuous native generation** means treating native project files as generated output from your project configuration rather than treating them as the primary source of truth whenever possible.\n\nThink about a build pipeline:\n\n```\nProject configuration\n      ↓\nPrebuild\n      ↓\nNative projects\n      ↓\nBuild\n```\n\nIf configuration changes, native projects can be regenerated.\n\nThis reduces the need to manually maintain every native project modification.\n\n---\n\n## Why is this different from the old \"eject\" mental model?\n\nThe old mental model was often:\n\n```\nExpo\n↓\nEject\n↓\nNow manually maintain everything forever\n```\n\nA better modern mental model is:\n\n```\nExpo project\n    ↓\nNeed native project?\n    ↓\nPrebuild\n    ↓\nNative projects generated\n    ↓\nBuild\n```\n\nYou can still customize native behavior when needed.\n\nThe important difference is that native projects can be generated from your configuration.\n\n---\n\n# What happens when you add a native dependency?\n\nImagine you add a package that requires native code.\n\nYour project may need native configuration.\n\nWith Expo's tooling, configuration plugins and prebuild can apply the required native changes.\n\nA **config plugin** is code that modifies native project configuration during the prebuild process.\n\nConceptually:\n\n```\nExpo config\n  ↓\nConfig plugin\n  ↓\nModify native project\n  ↓\nBuild\n```\n\nThis is one of the reasons Expo's modern native workflow is much more flexible than the old idea of a simple \"managed vs ejected\" split.\n\n---\n\n## Should you manually edit generated native files?\n\nYou need to be careful.\n\nIf a native project is generated from configuration, manually changing generated files can create a maintenance problem.\n\nYou may have:\n\n```\nYour manual change\n     +\nGenerated configuration\n     ↓\nRegeneration\n     ↓\nManual change disappears\n```\n\nThat's why configuration and config plugins are important.\n\n---\n\n# When should you care about native projects?\n\nAs a beginner:\n\n```\nDon't worry about them unless you need them.\n```\n\nAs you start building advanced applications:\n\n```\nNeed custom native functionality\n      ↓\nUnderstand prebuild\n      ↓\nUnderstand native projects\n      ↓\nUnderstand config plugins\n      ↓\nBuild/customize safely\n```\n\nYou don't need to manually manage native files just to build a normal Expo application.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- \"Ejecting\" is an older mental model for leaving the managed Expo workflow.\n- Modern Expo uses prebuild to generate native projects from configuration.\n- Continuous native generation treats generated native projects as build output.\n- Config plugins can apply native configuration during prebuild.\n- Avoid relying on manual changes to generated files when configuration can express the change."
      ],
      "commonMistakes": [
        "### Mistake 1: Thinking Expo means \"no native code ever\"\n\nExpo can work with native code.\n\n### Mistake 2: Thinking prebuild means you have abandoned Expo\n\nIt doesn't.\n\n### Mistake 3: Manually editing generated files without understanding regeneration\n\nYour changes may disappear when the native projects are regenerated.\n\n### Mistake 4: Avoiding native functionality because you think Expo can't support it\n\nModern Expo is designed to support custom native functionality when necessary."
      ],
      "quiz": [
        {
          "question": "What does Expo prebuild primarily do?",
          "options": [
            "A. Convert TypeScript into JavaScript",
            "B. Generate native iOS and Android project files from Expo configuration",
            "C. Create React components",
            "D. Store authentication tokens"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "When should you consider writing a native module?",
      "options": [
        "A. Every time you create a screen",
        "B. Whenever you want to avoid TypeScript",
        "C. When you genuinely need native functionality that isn't already provided by an appropriate library/API",
        "D. Whenever a button needs styling"
      ],
      "correctIndex": 2,
      "explanation": "**Answer:** C"
    },
    {
      "question": "What is the purpose of a Codegen specification?",
      "options": [
        "A. To define the native module's API so tooling can generate integration code",
        "B. To design the application's colors",
        "C. To replace React components",
        "D. To store authentication tokens"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why is Expo Modules API useful?",
      "options": [
        "A. It replaces TypeScript",
        "B. It provides a more convenient way to create native modules in Expo projects",
        "C. It removes the need for native operating systems",
        "D. It automatically creates your entire application"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What does Expo prebuild primarily do?",
      "options": [
        "A. Convert TypeScript into JavaScript",
        "B. Generate native iOS and Android project files from Expo configuration",
        "C. Create React components",
        "D. Store authentication tokens"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "When should you create a native module?",
      "options": [
        "A. Whenever you need a button",
        "B. Whenever you need a new React component",
        "C. When you genuinely need native functionality that isn't already provided by a suitable library",
        "D. For every Expo project"
      ],
      "correctIndex": 2,
      "explanation": "**Answer:** C"
    },
    {
      "question": "What does Codegen do?",
      "options": [
        "A. Generates parts of the native integration from a defined API specification",
        "B. Creates the application's UI",
        "C. Stores native data",
        "D. Replaces React"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does the Expo Modules API provide?",
      "options": [
        "A. A higher-level way to create native modules for Expo/React Native projects",
        "B. A database",
        "C. A navigation library",
        "D. A replacement for TypeScript"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does Expo prebuild do?",
      "options": [
        "A. Generates native project files from Expo configuration",
        "B. Converts CSS into React Native styles",
        "C. Creates user accounts",
        "D. Downloads application data"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should JavaScript ideally see from your native battery module?",
      "options": [
        "A. Every platform-specific battery implementation detail",
        "B. A small, clean API such as `getLevel()`",
        "C. Raw Android/iOS source code",
        "D. The entire operating-system battery framework"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "When is a native module justified?",
      "options": [
        "A. When JavaScript cannot access a required native capability",
        "B. Whenever a component has props",
        "C. For every API request",
        "D. Only for styling"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "footer": "# 🔗 How the Four Lessons Connect\n\nLet's put everything together.\n\nSuppose your application needs access to battery information.\n\nFirst ask:\n\n```\nDo I really need native functionality?\n```\n\nIf yes:\n\n```\nDoes an existing library already provide it?\n```\n\nIf no suitable library exists:\n\n```\nCreate native module\n```\n\nIf you're using Expo:\n\n```\nExpo project\n   ↓\nExpo Modules API\n   ↓\nNative module\n```\n\nThe architecture becomes:\n\n```\n               React Native app\n                      │\n                      │\n                      ↓\n              TypeScript API\n                      │\n                      ↓\n               Native module\n                      │\n             ┌────────┴────────┐\n             ↓                 ↓\n           iOS              Android\n             │                 │\n             ↓                 ↓\n       iOS battery API   Android battery API\n             │                 │\n             └────────┬────────┘\n                      ↓\n                 Battery level\n```\n\nAnd if your module requires native project generation:\n\n```\nExpo configuration\n       ↓\n    Prebuild\n       ↓\nios/ + android/\n       ↓\nNative build\n```\n\n---\n\n# 🧠 The Most Important Mental Model\n\nDon't think:\n\n> \"React Native means JavaScript and native code are completely separate.\"\n\nThink:\n\n```\n             React Native\n                  │\n         ┌────────┴────────┐\n         ↓                 ↓\n   JavaScript/TS       Native code\n         │                 │\n         └────────┬────────┘\n                  ↓\n         Native module API\n```\n\nYour JavaScript application should ideally interact with a **small, understandable API**.\n\nFor example:\n\n```\nconst batteryLevel =\n await BatteryModule.getLevel();\n```\n\nJavaScript doesn't need to know how the operating system produced that number.\n\nThat's the job of the native module.",
  "project": {
    "name": "Self-check: Build a Battery Native Module",
    "goal": "Build a Battery Native Module",
    "brief": "Now let's build a small native module.\n\nYour goal is to expose one native function:\n\n```\nBatteryModule.getLevel()\n```\n\nand call it from React Native.\n\nThe JavaScript side should eventually look conceptually like:\n\n```\nconst level = await BatteryModule.getLevel();\n\nconsole.log(level);\n```\n\nYou might receive:\n\n```\n0.78\n```\n\nmeaning:\n\n```\n78%\n```\n\nThe exact implementation details can differ depending on your Expo SDK and native-platform APIs, so use the Expo Modules API documentation for the SDK version your project is actually using.\n\n---\n\n## Step 1 — Create an Expo project\n\nStart with an Expo application configured for development builds/native modules.\n\nYour project should conceptually look like:\n\n```\nmy-app/\n├── app/\n├── assets/\n├── package.json\n├── app.json\n└── ...\n```\n\nYou will then add your native module package/source according to the Expo Modules API structure.\n\n---\n\n## Step 2 — Define the JavaScript API\n\nBefore writing native code, decide what JavaScript should see.\n\nKeep it simple:\n\n```\nBatteryModule\n└── getLevel()\n```\n\nDon't expose platform-specific details.\n\nGood:\n\n```\nawait BatteryModule.getLevel();\n```\n\nLess useful:\n\n```\nawait AndroidBatteryManager.getBatteryIntent();\n```\n\nYour JavaScript API should describe **what you need**, not **how Android or iOS happens to implement it**.\n\n---\n\n# Step 3 — Implement the native function\n\nYour native module needs to ask the operating system for the battery level.\n\nConceptually:\n\n```\ngetLevel()\n   ↓\nAsk native operating system\n   ↓\nReceive battery value\n   ↓\nReturn number to JavaScript\n```\n\nThe native implementation differs between platforms.\n\nFor example:\n\n```\niOS\n↓\niOS battery API\n\nAndroid\n↓\nAndroid battery API\n```\n\nYour JavaScript API remains the same.\n\n---\n\n# Step 4 — Generate native projects\n\nIf your project uses Expo prebuild, the configuration and native module need to be incorporated into the native projects.\n\nConceptually:\n\n```\nExpo project\n    ↓\nPrebuild\n    ↓\nNative projects\n    ↓\niOS + Android\n```\n\nThis is where the Day 22 lesson about continuous native generation becomes practical.\n\n---\n\n# Step 5 — Call the module from JavaScript\n\nCreate a simple screen:\n\n```\nBattery\n\n[Check battery]\n\nBattery level:\n78%\n```\n\nWhen the user taps:\n\n```\nCheck battery\n```\n\nyour application calls:\n\n```\nconst level = await BatteryModule.getLevel();\n```\n\nThen convert the value to a percentage for display.\n\n---\n\n# Step 6 — Handle errors\n\nNative APIs can fail.\n\nDon't assume:\n\n```\ngetLevel()\n```\n\nwill always succeed.\n\nHandle errors:\n\n```\ntry {\n const level = await BatteryModule.getLevel();\n\n // Update UI\n} catch (error) {\n // Show a useful error\n}\n```\n\nThe user shouldn't see a mysterious application crash just because a native API wasn't available.\n\n---\n\n# Step 7 — Test both platforms\n\nThis is important.\n\nTest:\n\n```\niOS\n```\n\nand:\n\n```\nAndroid\n```\n\nA native module isn't finished simply because it works on one platform.\n\nYour goal is:\n\n```\nSame JavaScript API\n       ↓\n┌───────┴────────┐\n↓                ↓\niOS            Android\n↓                ↓\nBattery        Battery\nAPI             API\n```",
    "steps": [],
    "acceptance": [
      "You have a native module called something like `BatteryModule`.",
      "JavaScript can call `getLevel()`.",
      "The native implementation retrieves the battery level.",
      "JavaScript receives the value.",
      "The UI displays the battery percentage.",
      "Native errors are handled.",
      "The module works on the platform(s) you target.",
      "You understand where Expo Modules API fits.",
      "You understand why Codegen/TurboModules exist.",
      "You understand the purpose of prebuild."
    ],
    "stretch": [
      "Native events.",
      "Promise-based native functions.",
      "Native constants.",
      "Type-safe module APIs.",
      "Codegen specifications.",
      "Config plugins.",
      "Platform-specific implementations.",
      "Testing native modules.",
      "Error handling across the JS/native boundary."
    ],
    "footer": "Once the basic module works, extend it.\n\nAdd:\n\n```\ngetLevel()\ngetState()\nisLowPowerModeEnabled()\n```\n\nThen add a native event:\n\n```\nBattery changes\n    ↓\nNative event\n    ↓\nJavaScript listener\n    ↓\nReact Native UI\n```\n\nYour UI could then update automatically:\n\n```\nBattery\n\n78%\n↓\n77%\n↓\n76%\n```\n\nwithout requiring the user to press a button.\n\nYou could also explore:"
  }
});

