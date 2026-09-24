import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_26_LESSONS = normalizePastedLessonDay({
  "day": 26,
  "title": "Native Build Configuration",
  "overview": "📖 **4 lessons**\n\nToday we're moving from understanding the native projects themselves to understanding **how Expo configures those native projects for you**.\n\nOn Days 24 and 25, we looked directly at:\n\n```\niOS\n↓\nios/\n↓\nXcode\n↓\nNative configuration\n```\n\nand:\n\n```\nAndroid\n↓\nandroid/\n↓\nGradle\n↓\nNative configuration\n```\n\nBut with an Expo-based React Native project, you don't always want to manually edit those native files.\n\nInstead, you can describe your native configuration at the JavaScript/TypeScript project level:\n\n```\napp.json / app.config.ts\n         ↓\n    Expo config\n         ↓\n   Config plugins\n         ↓\n   Native projects\n     ↙       ↘\n   iOS     Android\n```\n\nThis gives you an important principle:\n\n> **Your app configuration can be the source of truth, while Expo generates and modifies the native projects for you.**\n\nToday we'll learn how that works.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn26-1",
      "title": "app.json, app.config.ts, and the native project",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nIf you're using Expo, you may have a file like:\n\n```\napp.json\n```\n\nor:\n\n```\napp.config.ts\n```\n\nThese files describe important configuration for your application.\n\nFor example:\n\n```\n{\n\"expo\": {\n  \"name\": \"MyApp\",\n  \"slug\": \"my-app\",\n  \"version\": \"1.0.0\"\n}\n}\n```\n\nYou can think of this as the high-level description of your application.\n\nInstead of immediately opening:\n\n```\nios/\nandroid/\n```\n\nyou can often start with:\n\n```\napp.json\n```\n\nor:\n\n```\napp.config.ts\n```\n\n---\n\n# What does \"single source of truth\" mean?\n\nSuppose you need to configure your application name.\n\nYou don't want to have:\n\n```\niOS name\nAndroid name\nExpo name\nJavaScript name\n```\n\nall maintained independently.\n\nInstead, you want one configuration source that can generate or influence the native configuration.\n\nConceptually:\n\n```\n           app.config.ts\n                │\n      ┌─────────┴─────────┐\n      ↓                   ↓\n    iOS                 Android\n      ↓                   ↓\nNative configuration   Native configuration\n```\n\nThis is what people mean when they describe the Expo app configuration as the source of truth for generated native configuration.\n\n---\n\n# `app.json` vs `app.config.ts`\n\nBoth can describe Expo configuration.\n\nA simple `app.json` might look like:\n\n```\n{\n\"expo\": {\n  \"name\": \"MyApp\",\n  \"slug\": \"my-app\",\n  \"version\": \"1.0.0\"\n}\n}\n```\n\nA TypeScript configuration can look more like:\n\n```\nimport { ExpoConfig } from \"expo/config\";\n\nexport default ({ config }: { config: ExpoConfig }) => ({\n...config,\nname: \"MyApp\",\nslug: \"my-app\",\n});\n```\n\nThe important difference is that `app.config.ts` can contain JavaScript/TypeScript logic.\n\nThat becomes useful when configuration depends on:\n\n```\nEnvironment variables\nBuild profiles\nEnvironment-specific values\nConditional configuration\nCustom logic\n```\n\n---\n\n# Native configuration\n\nYour Expo configuration can describe things that eventually affect the native application.\n\nFor example:\n\n```\nApp name\nBundle identifier\nPackage name\nPermissions\nIcons\nSplash screen\nURL schemes\nAssociated domains\nAndroid configuration\niOS configuration\n```\n\nThe configuration might look simple:\n\n```\nExpo config\n   ↓\n\"Give my app this name\"\n\"Use this icon\"\n\"Add this URL scheme\"\n\"Configure this permission\"\n```\n\nExpo then translates those requirements into native configuration.\n\n---\n\n# What happens to `ios/` and `android/`?\n\nThis is an important distinction.\n\nIf your project doesn't have:\n\n```\nios/\nandroid/\n```\n\nyou can use:\n\n```\nnpx expo prebuild\n```\n\nto generate them.\n\nConceptually:\n\n```\napp.json / app.config.ts\n        ↓\n    expo prebuild\n        ↓\n  ┌─────┴─────┐\n  ↓           ↓\n ios/       android/\n```\n\nThe generated projects contain the native files we discussed on Days 24 and 25.\n\nSo:\n\n```\nExpo configuration\n      ↓\nNative project generation\n      ↓\nXcode / Gradle projects\n```\n\n---\n\n# Why this matters\n\nImagine you manually edit:\n\n```\nios/Info.plist\n```\n\nand:\n\n```\nandroid/AndroidManifest.xml\n```\n\nEverything works.\n\nThen someone deletes the native directories and runs:\n\n```\nnpx expo prebuild\n```\n\nYour manual changes may no longer be there.\n\nThat's why manually editing generated native files can become problematic in a prebuild-based workflow.\n\nInstead, you want the configuration to be reproducible:\n\n```\nConfiguration\n    ↓\nGenerate native projects\n    ↓\nSame configuration every time\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `app.json` and `app.config.ts` define Expo application configuration.\n- `app.config.ts` allows dynamic JavaScript/TypeScript configuration.\n- Native configuration can be generated from Expo configuration.\n- `npx expo prebuild` generates the native `ios/` and `android/` projects.\n- Treat generated native files carefully if your project relies on prebuild.\n- Reproducible configuration is more reliable than undocumented manual edits."
      ],
      "commonMistakes": [
        "### Mistake 1: Editing generated files without understanding the workflow\n\nYour changes may disappear when native projects are regenerated.\n\n### Mistake 2: Assuming `app.json` is only metadata\n\nIt can influence real native application configuration.\n\n### Mistake 3: Confusing Expo configuration with JavaScript runtime configuration\n\nSome configuration affects how the native application is built rather than what happens during JavaScript execution.\n\n### Mistake 4: Thinking `ios/` and `android/` are always required in an Expo project\n\nThey can be generated when needed."
      ],
      "quiz": [
        {
          "question": "What is the main purpose of `app.config.ts`?",
          "options": [
            "A. Replace React components",
            "B. Define Expo application configuration",
            "C. Replace Gradle",
            "D. Store JavaScript state"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn26-2",
      "title": "Config plugins",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nNow we get to one of the most important concepts today:\n\n> **Config plugins.**\n\nSuppose your application needs a native change.\n\nFor example:\n\n```\niOS permission description\n```\n\nor:\n\n```\nAndroidManifest modification\n```\n\nYou could manually edit:\n\n```\nios/Info.plist\n```\n\nor:\n\n```\nandroid/AndroidManifest.xml\n```\n\nBut if those projects are generated, manual changes aren't ideal.\n\nA config plugin lets you describe the change programmatically.\n\nConceptually:\n\n```\napp.config.ts\n    ↓\nConfig plugin\n    ↓\nNative project modification\n```\n\n---\n\n# What does a config plugin do?\n\nA config plugin is code that modifies native project configuration during the Expo prebuild process.\n\nThink of it as:\n\n```\n\"Whenever the native project is generated,\nmake this native change.\"\n```\n\nFor example:\n\n```\nConfig plugin\n    ↓\nModify Info.plist\n    ↓\nAdd permission description\n```\n\nor:\n\n```\nConfig plugin\n    ↓\nModify AndroidManifest.xml\n    ↓\nAdd native configuration\n```\n\n---\n\n# Why not just edit the native files?\n\nBecause your native project may be generated repeatedly.\n\nImagine:\n\n```\napp.config.ts\n     ↓\nprebuild\n     ↓\nios/\nandroid/\n```\n\nIf you manually edit:\n\n```\nios/Info.plist\n```\n\nyou've created a change that isn't necessarily represented in your source configuration.\n\nA config plugin makes the change reproducible.\n\n```\nGit repository\n    ↓\napp.config.ts\n    ↓\nconfig plugin\n    ↓\nprebuild\n    ↓\nsame native modification\n```\n\nThat's much easier to reason about.\n\n---\n\n# Example: Permission description\n\nSuppose your iOS application uses the camera.\n\niOS needs a usage-description string explaining why your application needs camera access.\n\nYou could conceptually have:\n\n```\nNSCameraUsageDescription\n      ↓\n\"Take photos for your profile.\"\n```\n\nA config plugin can add this to the generated iOS configuration.\n\nThe important thing is that you don't have to manually open:\n\n```\nios/Info.plist\n```\n\nand type it every time.\n\n---\n\n# Config plugin mental model\n\nThink of a plugin as a transformation:\n\n```\nNative project\n    +\nPlugin instructions\n    ↓\nModified native project\n```\n\nFor example:\n\n```\nExpo config\n   ↓\nPlugin\n   ↓\nInfo.plist\n   ↓\nNSCameraUsageDescription\n```\n\n---\n\n# Where do config plugins live?\n\nYou can use plugins provided by Expo or libraries.\n\nYou can also create your own.\n\nA project might contain something like:\n\n```\nplugins/\n└── withCameraPermission.ts\n```\n\nThen your configuration can reference it.\n\nConceptually:\n\n```\n{\n\"expo\": {\n  \"plugins\": [\n    \"./plugins/withCameraPermission\"\n  ]\n}\n}\n```\n\nThe exact plugin API depends on what you're modifying.\n\n---\n\n# A simple plugin\n\nA config plugin can use Expo's configuration-plugin APIs.\n\nConceptually, you might see code like:\n\n```\nimport { ConfigPlugin, withInfoPlist } from \"expo/config-plugins\";\n\nconst withCameraPermission: ConfigPlugin = (config) => {\nreturn withInfoPlist(config, (config) => {\n  config.modResults.NSCameraUsageDescription =\n    \"Take photos for your profile.\";\n\n  return config;\n});\n};\n\nexport default withCameraPermission;\n```\n\nThe important part isn't memorizing every line.\n\nUnderstand the flow:\n\n```\nconfig\n↓\nwithInfoPlist\n↓\nmodify Info.plist\n↓\nreturn config\n```\n\n---\n\n# What is a \"mod\"?\n\nYou may see terminology such as:\n\n```\nwithInfoPlist\nwithAndroidManifest\n```\n\nThese are ways for a plugin to modify specific native configuration.\n\nFor example:\n\n```\nwithInfoPlist\n      ↓\niOS Info.plist\n\nwithAndroidManifest\n      ↓\nAndroidManifest.xml\n```\n\nThis gives you a controlled way to modify native configuration.\n\n---\n\n# Config plugins aren't just for permissions\n\nYou can use them for many native configuration requirements.\n\nFor example:\n\n```\nPermissions\nURL schemes\nAndroid manifest entries\niOS Info.plist values\nEntitlements\nNative build settings\nApp extensions\nThird-party SDK configuration\n```\n\nThe exact capability depends on the plugin APIs and the native change you're trying to make.\n\n---\n\n# Config plugin vs native module\n\nDon't confuse these.\n\nA native module provides runtime functionality:\n\n```\nJavaScript\n  ↓\nNative Module\n  ↓\nNative API\n```\n\nA config plugin changes how the native project is configured:\n\n```\nExpo config\n  ↓\nConfig Plugin\n  ↓\nNative project configuration\n```\n\nSo:\n\n```\nNative Module\n→ runtime behavior\n\nConfig Plugin\n→ build/native configuration\n```\n\n---\n\n# Config plugin vs manually editing native files\n\nThink:\n\n```\nManual edit\n  ↓\nChange exists in generated project\n  ↓\nMay be lost on regeneration\n```\n\nversus:\n\n```\nConfig plugin\n  ↓\nChange described in source code\n  ↓\nApplied during prebuild\n  ↓\nReproducible\n```\n\nThis is the main reason config plugins are valuable.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Config plugins modify native projects during Expo's prebuild process.\n- They allow native configuration changes without manually editing generated files.\n- Plugins can modify iOS and Android configuration.\n- They make native configuration reproducible.\n- A config plugin changes build/native configuration; a native module provides runtime functionality."
      ],
      "commonMistakes": [
        "### Mistake 1: Thinking a config plugin runs every time the app renders\n\nIt doesn't.\n\nIt's part of native project configuration/build preparation.\n\n### Mistake 2: Putting runtime logic in a config plugin\n\nConfig plugins are for configuring the native project.\n\n### Mistake 3: Manually editing the same file after adding a plugin\n\nThat can create confusion about which configuration is authoritative.\n\n### Mistake 4: Forgetting to regenerate the native project\n\nIf you change a plugin, you generally need to run the appropriate prebuild process to apply the modification."
      ],
      "quiz": [
        {
          "question": "What does a config plugin primarily do?",
          "options": [
            "A. Render React components",
            "B. Modify native project configuration during prebuild",
            "C. Replace Metro",
            "D. Store application state"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn26-3",
      "title": "EAS Build and build profiles",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nNow let's talk about building your application.\n\nYou already know that native applications need platform-specific build tools.\n\nFor iOS:\n\n```\nXcode\n```\n\nFor Android:\n\n```\nGradle\n```\n\nNormally, you'd need the appropriate development environment locally.\n\nFor iOS, that traditionally means having access to macOS and Xcode.\n\nExpo provides another option:\n\n```\nEAS Build\n```\n\n---\n\n# What is EAS Build?\n\n**EAS Build** is Expo's cloud build service for React Native and Expo applications.\n\nInstead of doing the complete native build locally, you can send your project configuration to Expo's build infrastructure.\n\nConceptually:\n\n```\nYour computer\n    ↓\nEAS Build\n    ↓\nCloud build environment\n    ↓\niOS / Android build\n    ↓\nArtifact\n```\n\nThis can be particularly useful for iOS.\n\n---\n\n# Why is cloud iOS building useful?\n\nBuilding iOS applications natively requires Apple's tooling.\n\nIf you don't own a Mac, local iOS development has an obvious limitation.\n\nWith a cloud build service:\n\n```\nWindows / Linux\n     ↓\nEAS Build\n     ↓\nmacOS build environment\n     ↓\niOS artifact\n```\n\nSo you don't necessarily need to own a Mac just to perform a cloud iOS build.\n\nThere are still Apple account, signing, testing, and device-related requirements to understand, but the actual build machine can be provided by the service.\n\n---\n\n# EAS Build flow\n\nA simplified workflow looks like:\n\n```\napp.json / app.config.ts\n         ↓\n    Config plugins\n         ↓\n     Native config\n         ↓\n       EAS Build\n         ↓\n  ┌──────────────┐\n  ↓              ↓\n iOS           Android\n  ↓              ↓\nartifact       artifact\n```\n\nThis connects everything we've learned so far.\n\n---\n\n# What are build profiles?\n\nEAS Build uses build profiles to describe different kinds of builds.\n\nA common setup has:\n\n```\ndevelopment\npreview\nproduction\n```\n\nThese are not magical names.\n\nThey're simply different build configurations that you define according to your project's needs.\n\n---\n\n# Development profile\n\nA development build is intended for active development.\n\nConceptually:\n\n```\ndevelopment\n   ↓\nDevelopers\n   ↓\nDevelopment client\n   ↓\nDebugging/testing\n```\n\nYou might use this when you need native code or native dependencies that aren't available in a standard Expo Go environment.\n\n---\n\n# Preview profile\n\nA preview build is useful for testing something closer to a distributable application without necessarily treating it as your production release.\n\nFor example:\n\n```\npreview\n ↓\nQA\nInternal testers\nStakeholders\n```\n\nIt can be useful for sharing a build with people who aren't actively developing the application.\n\n---\n\n# Production profile\n\nProduction is for your real release build.\n\nConceptually:\n\n```\nproduction\n   ↓\nRelease configuration\n   ↓\nSigning\n   ↓\nStore distribution\n```\n\nThis is the build you ultimately want to distribute to users.\n\n---\n\n# Why have multiple profiles?\n\nBecause development and production have different requirements.\n\nFor example:\n\n```\nDevelopment\n→ debugging\n→ development server\n→ internal testing\n\nPreview\n→ testing\n→ internal distribution\n\nProduction\n→ release\n→ store submission\n→ production configuration\n```\n\nYou don't want to manually change dozens of settings every time you switch from development to production.\n\nProfiles let you encode those differences.\n\n---\n\n# `eas.json`\n\nEAS build profiles are typically configured in:\n\n```\neas.json\n```\n\nA simplified example might look like:\n\n```\n{\n\"build\": {\n  \"development\": {\n    \"developmentClient\": true\n  },\n  \"preview\": {},\n  \"production\": {}\n}\n}\n```\n\nAgain, the exact settings depend on your application.\n\nThe important mental model is:\n\n```\neas.json\n  ↓\nBuild profiles\n  ↓\nDifferent build behavior\n```\n\n---\n\n# Local build vs EAS Build\n\nYou can think of the difference as:\n\n```\nLocal build\n  ↓\nYour machine\n  ↓\nXcode / Gradle\n  ↓\nArtifact\n```\n\nversus:\n\n```\nEAS Build\n  ↓\nExpo cloud infrastructure\n  ↓\nXcode / Gradle\n  ↓\nArtifact\n```\n\nThe underlying native technologies haven't disappeared.\n\nThey're simply being run in the cloud.\n\n---\n\n# Does EAS remove native development?\n\nNo.\n\nThis is important.\n\nEAS doesn't mean:\n\n```\n\"I never need to understand iOS or Android.\"\n```\n\nYou still need to understand:\n\n```\nSigning\nNative configuration\nBuild variants/profiles\nPermissions\nBundle identifiers\nPackage names\nNative dependencies\n```\n\nEAS makes the build process easier to automate and run remotely.\n\nIt doesn't make native concepts disappear.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- EAS Build is a cloud build service for Expo/React Native apps.\n- It can build iOS and Android applications remotely.\n- Cloud iOS builds are especially useful when you don't have a Mac locally.\n- Build profiles let you define different build configurations.\n- Development, preview, and production serve different purposes.\n- `eas.json` defines EAS build profiles.\n- EAS doesn't eliminate the need to understand native configuration."
      ],
      "commonMistakes": [
        "### Mistake 1: Thinking EAS is only for publishing\n\nEAS can be useful throughout development and testing.\n\n### Mistake 2: Assuming development and production should use identical configuration\n\nThey often have different requirements.\n\n### Mistake 3: Thinking EAS replaces Xcode and Gradle conceptually\n\nThe cloud build infrastructure still uses the platform's native build tooling.\n\n### Mistake 4: Assuming cloud builds eliminate signing\n\nThey don't.\n\nProduction applications still need appropriate signing configuration."
      ],
      "quiz": [
        {
          "question": "What is the main advantage of EAS Build?",
          "options": [
            "A. It replaces React",
            "B. It provides cloud infrastructure for building iOS and Android apps",
            "C. It replaces TypeScript",
            "D. It eliminates native configuration"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn26-4",
      "title": "Prebuild, native assets, icons, and splash screens",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nNow let's connect everything together.\n\nYou have:\n\n```\napp.config.ts\n     ↓\nconfig plugins\n     ↓\nprebuild\n     ↓\nios/\nandroid/\n```\n\nAnd then:\n\n```\nios/\nandroid/\n     ↓\nEAS Build\n     ↓\nApp\n```\n\nOne of the easiest places to see this system working is with native assets.\n\n---\n\n# What does `npx expo prebuild` do?\n\nRun:\n\n```\nnpx expo prebuild\n```\n\nExpo generates native projects based on your Expo configuration.\n\nConceptually:\n\n```\napp.json / app.config.ts\n        ↓\n    Prebuild\n        ↓\n  ┌─────┴─────┐\n  ↓           ↓\n ios/       android/\n```\n\nIf those directories already exist, the behavior depends on the project's configuration and prebuild options.\n\nThe important idea is:\n\n> Prebuild synchronizes the native project with the Expo configuration and config plugins.\n\n---\n\n# Why would you use prebuild?\n\nMaybe you started with an Expo project and later need native access.\n\nFor example:\n\n```\nNeed custom native configuration\n        ↓\nNeed iOS/Android projects\n        ↓\nnpx expo prebuild\n```\n\nNow you can open:\n\n```\nios/\n```\n\nin Xcode and:\n\n```\nandroid/\n```\n\nin Android Studio.\n\nThis is sometimes described as moving toward a more native or \"bare\" workflow.\n\nBut remember:\n\n> Having generated native directories does not mean you must abandon Expo tooling.\n\nYou can continue using Expo modules, config plugins, and EAS.\n\n---\n\n# App icons\n\nYour application icon is part of the native application.\n\nIn an Expo configuration, you can specify the icon.\n\nConceptually:\n\n```\n{\n\"expo\": {\n  \"icon\": \"./assets/icon.png\"\n}\n}\n```\n\nExpo can then use that asset during native project generation/building.\n\nThe native platforms have their own requirements for application icons.\n\nRather than manually creating every native asset directory yourself, the Expo tooling can generate the appropriate native resources from your configured assets.\n\n---\n\n# Why icon generation matters\n\nA single source asset may need to become multiple native resources.\n\nConceptually:\n\n```\nicon.png\n ↓\nNative asset generation\n ↓\niOS icon resources\n +\nAndroid icon resources\n```\n\nThe platforms may require different sizes, formats, or metadata.\n\nTooling handles much of this repetitive work.\n\n---\n\n# Splash screens\n\nSplash screens work similarly.\n\nYou may configure:\n\n```\nSplash image\nBackground color\nPlatform-specific settings\n```\n\nThen:\n\n```\nExpo configuration\n     ↓\nNative asset/config generation\n     ↓\niOS / Android\n```\n\nThe important thing is that the splash screen is not simply a React component.\n\nIt appears before your React Native application is fully rendered.\n\nSo it is part of the native startup experience.\n\n---\n\n# Native startup vs React Native UI\n\nThis distinction is useful.\n\nYour React Native application eventually renders:\n\n```\n<App />\n```\n\nBut before that happens, the native application needs to start.\n\nConceptually:\n\n```\nAndroid / iOS launches application\n        ↓\nNative startup\n        ↓\nSplash screen\n        ↓\nReact Native initializes\n        ↓\nJavaScript starts\n        ↓\nReact UI renders\n```\n\nThat's why splash-screen configuration belongs in native build configuration.\n\n---\n\n# Asset generation and build configuration\n\nThis gives us another useful mental model:\n\n```\nJavaScript/TypeScript configuration\n           ↓\n     Expo config\n           ↓\n   Asset generation\n           ↓\n     Native resources\n           ↓\n     Native application\n```\n\nYou don't need to manually maintain every generated image resource.\n\n---\n\n# Config plugins + assets\n\nA config plugin can also help when a third-party native library requires special native resources or configuration.\n\nFor example:\n\n```\nExpo configuration\n     ↓\nConfig plugin\n     ↓\nNative resource/configuration\n```\n\nThis is why config plugins become especially valuable as an Expo application becomes more native.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `npx expo prebuild` generates native iOS and Android projects from your Expo configuration.\n- Prebuild allows you to access and customize native projects when necessary.\n- Expo can generate native assets such as application icons and splash-screen resources.\n- Splash screens are part of native startup, not ordinary React Native UI.\n- A single configured asset can be transformed into platform-specific native resources.\n- Config plugins can extend this system for additional native requirements."
      ],
      "commonMistakes": [
        "### Mistake 1: Treating the splash screen as a normal React component\n\nThe native splash screen appears before your React UI is ready.\n\n### Mistake 2: Manually maintaining generated native assets unnecessarily\n\nLet the build/prebuild tooling handle assets when possible.\n\n### Mistake 3: Forgetting that prebuild can change native files\n\nAlways understand which native changes are generated and which are manually maintained.\n\n### Mistake 4: Thinking prebuild means \"Expo is gone\"\n\nYou can still use Expo tooling after generating native projects."
      ],
      "quiz": [
        {
          "question": "What does `npx expo prebuild` primarily do?",
          "options": [
            "A. Start Metro",
            "B. Generate native iOS and Android projects from Expo configuration",
            "C. Upload an app to Google Play",
            "D. Convert TypeScript to JavaScript"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What is the main purpose of `app.config.ts`?",
      "options": [
        "A. Replace React components",
        "B. Define Expo application configuration",
        "C. Replace Gradle",
        "D. Store JavaScript state"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What does a config plugin primarily do?",
      "options": [
        "A. Render React components",
        "B. Modify native project configuration during prebuild",
        "C. Replace Metro",
        "D. Store application state"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What is the main advantage of EAS Build?",
      "options": [
        "A. It replaces React",
        "B. It provides cloud infrastructure for building iOS and Android apps",
        "C. It replaces TypeScript",
        "D. It eliminates native configuration"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What does `npx expo prebuild` primarily do?",
      "options": [
        "A. Start Metro",
        "B. Generate native iOS and Android projects from Expo configuration",
        "C. Upload an app to Google Play",
        "D. Convert TypeScript to JavaScript"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "Why use app.config.ts instead of only static app.json?",
      "options": [
        "A. It can generate configuration dynamically",
        "B. It replaces React Native",
        "C. It stores server data",
        "D. It disables native projects"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does a config plugin modify?",
      "options": [
        "A. Native project configuration during prebuild",
        "B. Only component state",
        "C. Only API responses",
        "D. Only navigation history"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What are EAS build profiles used for?",
      "options": [
        "A. Defining different build environments and settings",
        "B. Rendering lists",
        "C. Managing query keys",
        "D. Creating reducers"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does Expo prebuild generate?",
      "options": [
        "A. Native iOS and Android projects from app configuration",
        "B. A production database",
        "C. A JavaScript framework",
        "D. OAuth tokens"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Where should icons and splash configuration be declared?",
      "options": [
        "A. In the application configuration and native assets",
        "B. Inside every screen",
        "C. In query cache",
        "D. In refresh tokens"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why must config plugins be repeatable?",
      "options": [
        "A. Prebuild may apply them more than once",
        "B. React renders only once",
        "C. Stores reject TypeScript",
        "D. Gradle cannot use files"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Self-Check — Create a Config Plugin",
    "goal": "Create a Config Plugin",
    "brief": "Now let's put everything together.\n\nYour goal is to create a small config plugin that modifies a native permission string.\n\nWe'll use iOS as the example.\n\nThe final flow should be:\n\n```\napp.config.ts\n     ↓\nConfig plugin\n     ↓\nnpx expo prebuild\n     ↓\nios/Info.plist\n     ↓\nPermission string appears\n```\n\nYou should not manually edit `Info.plist`.\n\n---\n\n# Step 1 — Create a plugins directory\n\nCreate:\n\n```\nplugins/\n```\n\nThen create:\n\n```\nplugins/withCameraPermission.ts\n```\n\nYour project might look like:\n\n```\nmy-app/\n├── app.config.ts\n├── package.json\n├── plugins/\n│   └── withCameraPermission.ts\n├── assets/\n└── ...\n```\n\n---\n\n# Step 2 — Write the config plugin\n\nStart with:\n\n```\nimport { ConfigPlugin, withInfoPlist } from \"expo/config-plugins\";\n\nconst withCameraPermission: ConfigPlugin = (config) => {\n return withInfoPlist(config, (config) => {\n   config.modResults.NSCameraUsageDescription =\n     \"Take photos for your profile.\";\n\n   return config;\n });\n};\n\nexport default withCameraPermission;\n```\n\nRead this from top to bottom.\n\nFirst:\n\n```\nwithInfoPlist\n```\n\nmeans:\n\n```\n\"We want to modify iOS Info.plist.\"\n```\n\nThen:\n\n```\nNSCameraUsageDescription\n```\n\nis the native iOS key being configured.\n\nAnd:\n\n```\n\"Take photos for your profile.\"\n```\n\nis the value that iOS will display as the permission explanation.\n\n---\n\n# Step 3 — Register the plugin\n\nNow add the plugin to your Expo configuration.\n\nFor example:\n\n```\nexport default {\n expo: {\n   name: \"MyApp\",\n   slug: \"my-app\",\n\n   plugins: [\n     \"./plugins/withCameraPermission\",\n   ],\n },\n};\n```\n\nIf you already have an `app.config.ts`, don't replace your existing configuration.\n\nAdd the plugin to the existing `plugins` array.\n\n---\n\n# Step 4 — Run prebuild\n\nNow run:\n\n```\nnpx expo prebuild\n```\n\nExpo will process:\n\n```\napp.config.ts\n     ↓\nplugins\n     ↓\nnative configuration\n```\n\nand generate/update the native projects.\n\n---\n\n# Step 5 — Inspect Info.plist\n\nOpen:\n\n```\nios/\n```\n\nand locate:\n\n```\nInfo.plist\n```\n\nSearch for:\n\n```\nNSCameraUsageDescription\n```\n\nYou should find your configured value:\n\n```\nTake photos for your profile.\n```\n\nThe important part is:\n\n```\nYou did not manually edit Info.plist.\n```\n\nThe config plugin generated the change.\n\n---\n\n# Step 6 — Understand what just happened\n\nYou started with:\n\n```\nTypeScript\n```\n\nand ended with:\n\n```\nNative iOS configuration\n```\n\nThe complete pipeline was:\n\n```\napp.config.ts\n      ↓\nConfig plugin\n      ↓\nwithInfoPlist\n      ↓\nNSCameraUsageDescription\n      ↓\nnpx expo prebuild\n      ↓\nios/Info.plist\n```\n\nThis is the core concept of today's lesson.\n\n---\n\n# Step 7 — Try an Android modification\n\nOnce the iOS example makes sense, try creating a plugin that modifies:\n\n```\nAndroidManifest.xml\n```\n\nusing:\n\n```\nwithAndroidManifest\n```\n\nThe goal isn't to memorize the API.\n\nThe goal is to understand:\n\n```\nConfig plugin\n      ↓\nNative platform configuration\n```\n\nYou can use the same basic idea for both platforms.\n\n---\n\n# Step 8 — Check reproducibility\n\nNow remove the generated native projects:\n\n```\nios/\nandroid/\n```\n\nThen run:\n\n```\nnpx expo prebuild\n```\n\nAgain.\n\nCheck:\n\n```\nios/Info.plist\n```\n\nYour permission string should appear again.\n\nThis proves that the configuration is reproducible.\n\nThat's the real purpose of the exercise.\n\n---\n\n# Step 9 — Inspect the generated project\n\nOpen the generated:\n\n```\nios/\n```\n\nand:\n\n```\nandroid/\n```\n\nLook at some of the files you learned about on Days 24 and 25.\n\nFor iOS:\n\n```\nInfo.plist\nAppDelegate\nXcode project\n```\n\nFor Android:\n\n```\nAndroidManifest.xml\nMainActivity\nMainApplication\nbuild.gradle\n```\n\nNotice what happened:\n\n```\nExpo configuration\n      ↓\nNative projects\n```\n\nYou are now connecting the concepts from the previous two days.\n\n---\n\n# Step 10 — Explain the entire architecture\n\nYou should now be able to explain this:\n\n```\n                   app.config.ts\n                        │\n                        ↓\n                 Config plugins\n                        │\n                        ↓\n                   Prebuild\n                   ↙       ↘\n                 iOS      Android\n                  ↓          ↓\n             Xcode       Gradle\n                  ↘          ↙\n                   Native app\n                        ↓\n                 EAS Build\n                        ↓\n                App artifact\n```\n\nThat's the mental model for today's lesson.",
    "steps": [],
    "acceptance": [
      "You have an `app.json` or `app.config.ts`.",
      "You understand why it can act as the source of truth for native configuration.",
      "You understand what a config plugin does.",
      "You created a config plugin.",
      "The plugin changes an iOS permission description.",
      "You registered the plugin in Expo configuration.",
      "You ran `npx expo prebuild`.",
      "You verified the permission string inside the generated `Info.plist`.",
      "You can delete the native project and regenerate the same change.",
      "You understand what EAS Build does.",
      "You understand development, preview, and production build profiles.",
      "You know why `eas.json` exists.",
      "You understand why app icons and splash screens involve native assets.",
      "You understand why a splash screen is different from a React Native component."
    ],
    "stretch": [],
    "footer": "Once the basic plugin works, try these.\n\n### 1\\. Add an Android modification\n\nCreate a plugin using:\n\n```\nwithAndroidManifest\n```\n\nand make a small, safe change to the generated Android manifest.\n\nThen run:\n\n```\nnpx expo prebuild\n```\n\nand verify the change.\n\n---\n\n### 2\\. Make the permission text configurable\n\nInstead of hard-coding:\n\n```\nTake photos for your profile.\n```\n\npass the value through your Expo configuration.\n\nConceptually:\n\n```\napp.config.ts\n    ↓\npermission description\n    ↓\nconfig plugin\n    ↓\nInfo.plist\n```\n\nNow your plugin is no longer tied to one specific string.\n\n---\n\n### 3\\. Create different build profiles\n\nConfigure:\n\n```\ndevelopment\npreview\nproduction\n```\n\nin:\n\n```\neas.json\n```\n\nThen decide what each profile should represent.\n\nFor example:\n\n```\ndevelopment\n→ active development\n\npreview\n→ internal testing\n\nproduction\n→ store release\n```\n\n---\n\n### 4\\. Inspect generated assets\n\nConfigure an application icon and splash screen.\n\nThen run:\n\n```\nnpx expo prebuild\n```\n\nExplore the generated native project.\n\nTry to identify where the platform-specific resources ended up.\n\n---\n\n### 5\\. Build using EAS\n\nOnce your configuration works locally, try a cloud build using the appropriate EAS build profile.\n\nCompare:\n\n```\nLocal prebuild\n```\n\nwith:\n\n```\nCloud build\n```\n\nRemember:\n\n```\nPrebuild\n→ generates/configures native projects\n\nEAS Build\n→ builds the application artifact\n```\n\nThey're related, but they are not the same operation.\n\n---\n\n# 🧠 Final Mental Model\n\nDay 24 taught you:\n\n```\niOS\n↓\nXcode\n↓\nInfo.plist\n↓\nAppDelegate\n↓\nNative application\n```\n\nDay 25 taught you:\n\n```\nAndroid\n↓\nGradle\n↓\nAndroidManifest\n↓\nMainActivity\n↓\nMainApplication\n↓\nNative application\n```\n\nToday we're adding Expo's configuration layer:\n\n```\n               Expo configuration\n                       │\n              app.json / app.config.ts\n                       │\n                       ↓\n                Config plugins\n                       │\n                       ↓\n                    Prebuild\n                  ↙         ↘\n                iOS        Android\n                 ↓            ↓\n              Xcode        Gradle\n                 ↓            ↓\n                 └────┬───────┘\n                      ↓\n                 Native app\n                      ↓\n                  EAS Build\n                      ↓\n              iOS / Android\n                 artifacts\n```\n\nThe most important distinction to remember is:\n\n```\napp.config.ts\n→ What should the native app be configured like?\n\nConfig plugin\n→ How should that configuration modify the native project?\n\nnpx expo prebuild\n→ Generate/apply the native project configuration.\n\nEAS Build\n→ Build the configured native application in the cloud.\n```\n\nAnd the most important rule is:\n\n> **If your Expo project uses prebuild, prefer describing native configuration through Expo config and config plugins instead of making undocumented manual changes to generated native files. This makes your native setup reproducible across machines, CI, and future builds.**"
  }
});

