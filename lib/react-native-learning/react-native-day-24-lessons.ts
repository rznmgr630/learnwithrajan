import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_24_LESSONS = normalizePastedLessonDay({
  "day": 24,
  "title": "iOS Fundamentals for React Native Developers",
  "overview": "📖 **4 lessons**\n\nToday we're going deeper into the **iOS side of React Native**.\n\nOn previous days, we learned how React Native communicates with native functionality and native UI.\n\nToday we're going to understand the project underneath:\n\n```\nReact Native\n    ↓\n   ios/\n    ↓\nXcode project\n    ↓\nNative iOS application\n    ↓\niOS\n```\n\nThe goal isn't to become an iOS developer.\n\nThe goal is to become an RN developer who can confidently answer questions like:\n\n- Where does my iOS app actually start?\n- Where does React Native connect to the native application?\n- Where do iOS permissions get configured?\n- What are entitlements?\n- What's the difference between a certificate and a provisioning profile?\n- Why does my project have CocoaPods?\n- What is Swift Package Manager?\n- How do I read a small Swift native module?\n- Where do I look when an iOS app crashes?\n\nBy the end of today, `ios/` should stop feeling like a mysterious folder.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn24-1",
      "title": "Understanding the `ios/` project and AppDelegate",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nWhen you create a React Native application, you don't just get JavaScript.\n\nYou get a complete native application for each platform.\n\nConceptually:\n\n```\nmy-app/\n│\n├── android/\n│\n├── ios/\n│\n├── src/\n│\n├── package.json\n│\n└── ...\n```\n\nThe `ios/` directory contains the native iOS project.\n\nThink of it as:\n\n```\nios/\n ↓\nNative iOS application\n ↓\nReact Native is embedded inside it\n```\n\nThis is an important mental shift.\n\nReact Native isn't replacing iOS.\n\nInstead:\n\n```\niOS application\n    ↓\nReact Native runtime\n    ↓\nYour JavaScript application\n```\n\n---\n\n# What is inside `ios/`?\n\nA typical project may contain something similar to:\n\n```\nios/\n├── MyApp/\n│   ├── AppDelegate.swift\n│   ├── Info.plist\n│   ├── Images.xcassets/\n│   └── ...\n│\n├── MyApp.xcodeproj/\n├── MyApp.xcworkspace/\n├── Podfile\n├── Podfile.lock\n└── ...\n```\n\nThe exact structure depends on your React Native version and dependency setup.\n\nLet's look at the important pieces.\n\n---\n\n## `AppDelegate.swift`\n\nThis is one of the most important native files.\n\nThe `AppDelegate` participates in the lifecycle of the iOS application.\n\nConceptually:\n\n```\niOS launches app\n     ↓\nAppDelegate\n     ↓\nReact Native initialization\n     ↓\nReact Native runtime\n     ↓\nYour JS application\n```\n\nModern React Native projects commonly have an `AppDelegate` that inherits from React Native's app delegate infrastructure.\n\nConceptually, you might see something like:\n\n```\nclass AppDelegate: RCTAppDelegate {\n\n  override func application(\n      _ application: UIApplication,\n      didFinishLaunchingWithOptions launchOptions:\n      [UIApplication.LaunchOptionsKey : Any]? = nil\n  ) -> Bool {\n\n      // Native initialization\n\n      return super.application(\n          application,\n          didFinishLaunchingWithOptions: launchOptions\n      )\n  }\n}\n```\n\nThe exact implementation depends on your RN version and project template.\n\nYou don't need to memorize it.\n\nThe important thing is understanding the relationship:\n\n```\niOS lifecycle\n    ↓\nAppDelegate\n    ↓\nReact Native initialization\n    ↓\nJS application\n```\n\n---\n\n# Where does React Native hook into iOS?\n\nWhen iOS starts your application, native code runs first.\n\nReact Native is then initialized as part of that native application.\n\nConceptually:\n\n```\n                  iOS\n                   ↓\n             AppDelegate\n                   ↓\n        React Native initialization\n                   ↓\n            React Native\n                   ↓\n           JavaScript bundle\n                   ↓\n             App component\n```\n\nThis is why the `AppDelegate` becomes relevant when integrating native SDKs.\n\nFor example, a native SDK might require:\n\n```\n\"Initialize this SDK when the app starts.\"\n```\n\nThat may involve the `AppDelegate`.\n\n---\n\n# `.xcodeproj` vs `.xcworkspace`\n\nYou may encounter both:\n\n```\nMyApp.xcodeproj\n```\n\nand:\n\n```\nMyApp.xcworkspace\n```\n\nA simple mental model:\n\n### `.xcodeproj`\n\nThe Xcode project itself.\n\n### `.xcworkspace`\n\nAn Xcode workspace that can contain the project plus additional projects/dependencies.\n\nWhen CocoaPods is involved, you'll commonly open:\n\n```\nMyApp.xcworkspace\n```\n\nrather than directly opening the `.xcodeproj`.\n\n---\n\n# What is Xcode?\n\n**Xcode** is Apple's development environment for building iOS applications.\n\nYou'll use it for things such as:\n\n```\nWriting native Swift/Objective-C\n      ↓\nConfiguring the iOS project\n      ↓\nBuilding the app\n      ↓\nRunning the simulator\n      ↓\nDebugging native code\n      ↓\nReading native logs\n      ↓\nInvestigating crashes\n```\n\nAs an RN developer, you don't need to live inside Xcode.\n\nBut you should be comfortable opening your project's iOS side.\n\n---\n\n# Why does this matter for RN?\n\nImagine a JavaScript error:\n\n```\nCannot read property 'foo' of undefined\n```\n\nThat's usually a JavaScript problem.\n\nBut imagine:\n\n```\nApp crashes immediately after launch\n```\n\nor:\n\n```\nNative module cannot initialize\n```\n\nor:\n\n```\nPermission request crashes\n```\n\nor:\n\n```\niOS build fails\n```\n\nNow you may need to inspect:\n\n```\nios/\nAppDelegate\nInfo.plist\nXcode configuration\nNative Swift/Objective-C\nSigning\nDependencies\n```\n\nUnderstanding the native project makes these problems much easier to reason about.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `ios/` contains the native iOS application that hosts React Native.\n- Xcode is Apple's development environment for the native iOS side.\n- `AppDelegate` participates in the native application lifecycle.\n- React Native initializes inside the native iOS application.\n- `.xcodeproj` is the Xcode project.\n- `.xcworkspace` is commonly used when dependency projects such as CocoaPods are involved.\n- You don't need to become an iOS expert, but you should be able to navigate the project."
      ],
      "commonMistakes": [
        "### Mistake 1: Treating `ios/` as generated junk\n\nDon't.\n\nYou may need to configure it when integrating native functionality.\n\n### Mistake 2: Editing dependency files randomly\n\nKnow whether you're changing:\n\n```\nYour application\n```\n\nor:\n\n```\nA dependency\n```\n\nbefore making changes.\n\n### Mistake 3: Assuming React Native replaces the iOS application\n\nIt doesn't.\n\nReact Native runs inside a native application.\n\n### Mistake 4: Being afraid of Xcode\n\nYou don't need to master Xcode.\n\nYou need to become comfortable navigating it."
      ],
      "quiz": [
        {
          "question": "What is the best mental model for the `ios/` directory?",
          "options": [
            "A. A cache generated by Metro",
            "B. The native iOS application containing React Native",
            "C. A JavaScript dependency folder",
            "D. A replacement for `src/`"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn24-2",
      "title": "Info.plist, permissions, entitlements, and signing",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nOne of the most common things RN developers encounter on iOS is:\n\n> \"The native feature works on Android, but iOS needs some configuration.\"\n\nVery often, that configuration lives in:\n\n```\nInfo.plist\nEntitlements\nSigning configuration\n```\n\nThese are different things.\n\nLet's separate them.\n\n---\n\n# What is `Info.plist`?\n\n`Info.plist` is an important configuration file for an iOS application.\n\nIt contains metadata and configuration information that iOS uses when running your app.\n\nFor example:\n\n```\nApp name\nBundle information\nURL schemes\nPermission descriptions\nBackground capabilities\nOther application configuration\n```\n\n---\n\n# Permission usage descriptions\n\nSuppose your app uses the camera.\n\niOS expects your application to explain why it wants camera access.\n\nYou might have:\n\n```\n<key>NSCameraUsageDescription</key>\n<string>This app uses the camera to take photos.</string>\n```\n\nFor microphone access:\n\n```\n<key>NSMicrophoneUsageDescription</key>\n<string>This app uses the microphone for audio recording.</string>\n```\n\nFor location:\n\n```\n<key>NSLocationWhenInUseUsageDescription</key>\n<string>This app uses your location to show nearby places.</string>\n```\n\nThe important distinction is:\n\n```\nUsage description\n      ↓\nExplains why permission is needed\n```\n\nIt doesn't itself grant the permission.\n\nThe application still needs to request the permission through the appropriate native API/library.\n\n---\n\n# URL schemes\n\nYou may also see URL scheme configuration.\n\nFor example, your application might support:\n\n```\nmyapp://profile/123\n```\n\nor another custom URL scheme used by an SDK.\n\nConceptually:\n\n```\nExternal application\n      ↓\nmyapp://...\n      ↓\nYour iOS application\n```\n\nThis is often relevant to:\n\n- Deep linking\n- Authentication callbacks\n- Third-party SDKs\n- Payment integrations\n- Other app-to-app communication\n\n---\n\n# Background modes\n\nSome iOS functionality requires declaring background capabilities.\n\nFor example, an application may need certain background behavior for supported use cases such as:\n\n```\nAudio\nLocation\nBackground processing\nBluetooth\nRemote notifications\n```\n\nThe exact capabilities depend on what your application is doing.\n\nThe important lesson is:\n\n> Declaring a background capability doesn't mean iOS gives your application unlimited background execution.\n\niOS still controls when and how applications can run in the background.\n\n---\n\n# What are entitlements?\n\nThis is where things get confusing.\n\nAn **entitlement** is a capability or permission associated with the application at the code-signing level.\n\nExamples include capabilities such as:\n\n```\nPush Notifications\nAssociated Domains\nKeychain Sharing\niCloud\nApp Groups\n```\n\nYou may see an entitlements file such as:\n\n```\nMyApp.entitlements\n```\n\nConceptually:\n\n```\nInfo.plist\n  ↓\nApplication configuration\n\nEntitlements\n  ↓\nSpecial capabilities granted to the app\n```\n\nThey are related, but they are not the same thing.\n\n---\n\n# Certificates\n\nNow we get to signing.\n\nAn iOS application needs to be properly signed.\n\nA **certificate** is part of Apple's code-signing system and identifies the signing identity used to sign your application.\n\nThink:\n\n```\nCertificate\n  ↓\n\"Who signed this application?\"\n```\n\n---\n\n# Provisioning profiles\n\nA **provisioning profile** connects several pieces of Apple's signing and distribution system.\n\nVery roughly:\n\n```\nApp identity\n+\nSigning information\n+\nEntitlements/capabilities\n+\nDistribution/development context\n```\n\nThe profile helps determine whether the application is allowed to run in a particular context.\n\nDon't worry about memorizing Apple's entire signing system today.\n\nJust remember:\n\n```\nCertificate\n  ↓\nSigning identity\n\nProvisioning Profile\n  ↓\nRules/context for the signed app\n\nEntitlements\n  ↓\nCapabilities the app requests/uses\n```\n\n---\n\n# The three-way mental model\n\nThis is worth memorizing:\n\n```\nCertificate\n  ↓\nWho signed it?\n\nProvisioning Profile\n  ↓\nIs this signed app allowed\nin this context?\n\nEntitlements\n  ↓\nWhat special capabilities\ndoes the app use?\n```\n\nYou will eventually encounter errors involving:\n\n```\nSigning\nProvisioning\nEntitlements\nCapabilities\nBundle identifiers\n```\n\nWhen that happens, don't treat them as one giant \"iOS signing problem.\"\n\nAsk which layer is actually failing.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `Info.plist` contains important application configuration.\n- Permission usage-description strings explain why your app requests protected resources.\n- URL schemes allow URL-based integration with your app.\n- Background modes declare supported background capabilities.\n- Entitlements represent special application capabilities.\n- Certificates are part of code signing.\n- Provisioning profiles define the context in which a signed app can run/distribute.\n- These concepts are related but not interchangeable."
      ],
      "commonMistakes": [
        "### Mistake 1: Thinking usage descriptions grant permissions\n\nThey don't.\n\nThey explain the purpose of the permission request.\n\n### Mistake 2: Confusing Info.plist with entitlements\n\nThey're separate configuration mechanisms.\n\n### Mistake 3: Thinking certificates are permissions\n\nCertificates primarily establish signing identity.\n\n### Mistake 4: Assuming every background task can run indefinitely\n\niOS controls background execution."
      ],
      "quiz": [
        {
          "question": "What does a permission usage-description string primarily do?",
          "options": [
            "A. Grants the permission",
            "B. Explains why the application needs the permission",
            "C. Signs the application",
            "D. Enables JavaScript"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn24-3",
      "title": "CocoaPods, Swift Package Manager, and reading Swift",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nReact Native applications often depend on native libraries.\n\nFor example:\n\n```\nReact Native\n   ↓\nNative dependency\n   ↓\niOS SDK/library\n```\n\nHistorically, CocoaPods has been one of the main ways RN iOS dependencies are integrated.\n\nBut the ecosystem is changing.\n\n---\n\n# What is CocoaPods?\n\n**CocoaPods** is a dependency manager for Apple-platform projects.\n\nA React Native project may contain:\n\n```\nios/\n└── Podfile\n```\n\nThe `Podfile` describes dependencies and configuration.\n\nYou may run:\n\n```\ncd ios\npod install\n```\n\nwhich installs/configures the CocoaPods dependencies.\n\nYou'll also commonly see:\n\n```\nPodfile.lock\n```\n\nwhich records resolved dependency versions.\n\n---\n\n# Why are we talking about CocoaPods now?\n\nBecause CocoaPods entered **maintenance mode in 2024**.\n\nThe CocoaPods team announced that it would no longer be actively developed as it had been historically.\n\nThere is also an important upcoming ecosystem change:\n\n> CocoaPods Trunk is scheduled to stop accepting new Podspec submissions on **December 2, 2026**.\n\nThis does **not** mean existing CocoaPods projects suddenly stop working on that date.\n\nThe important distinction is:\n\n```\nExisting CocoaPods ecosystem\n      ↓\nCan continue to build/use existing packages\n\nCocoaPods Trunk\n      ↓\nNew Podspec submissions stop\nDecember 2, 2026\n```\n\nSo this is an ecosystem transition, not an instant \"CocoaPods stops working\" event.\n\n---\n\n# What is Swift Package Manager?\n\n**Swift Package Manager**, commonly called **SwiftPM** or **SPM**, is Apple's package-management system.\n\nIt provides another way to manage native dependencies.\n\nConceptually:\n\n```\nCocoaPods\n\nReact Native\n  ↓\nPodfile\n  ↓\nCocoaPods\n  ↓\nNative dependencies\n```\n\nversus:\n\n```\nSwift Package Manager\n\nReact Native\n  ↓\nSwiftPM\n  ↓\nNative dependencies\n```\n\n---\n\n# React Native 0.87 and SwiftPM\n\nReact Native 0.87 introduced **experimental Swift Package Manager support** for iOS.\n\nThis is important because it gives React Native another dependency-management path on iOS.\n\nHowever:\n\n> The support is experimental, and CocoaPods remains the default supported dependency path.\n\nSo don't interpret this as:\n\n```\nRN 0.87\n  ↓\nEveryone must migrate to SwiftPM\n```\n\nInstead think:\n\n```\nCocoaPods\n  ↓\nExisting/default ecosystem\n\nSwiftPM\n  ↓\nEmerging alternative\n```\n\nThis matters because native dependency management is a major part of maintaining RN applications.\n\n---\n\n# Why should an RN developer care?\n\nYou may not personally write a `Podfile`.\n\nBut eventually you'll encounter:\n\n```\npod install failed\nNative dependency conflict\nXcode package resolution\nSwift package\nBuild setting\nLinking error\n```\n\nUnderstanding the dependency layer lets you ask the right question.\n\nFor example:\n\n```\n\"Is my JavaScript broken?\"\n\nMaybe not.\n\n\"Is the native dependency failing?\"\n\nMaybe.\n\n\"Is Xcode unable to link the native library?\"\n\nPossibly.\n\n\"Is CocoaPods/SwiftPM configuration incorrect?\"\n\nPossibly.\n```\n\n---\n\n# Now: enough Swift to read native code\n\nYou don't need to become a Swift expert.\n\nYou need enough Swift to read and make small changes.\n\nStart with variables.\n\n```\nlet name = \"Alex\"\nvar count = 0\n```\n\n`let` means the value can't be reassigned.\n\n`var` means it can change.\n\n---\n\n# Functions\n\n```\nfunc greet(name: String) -> String {\n  return \"Hello \\(name)\"\n}\n```\n\nYou can read this as:\n\n```\nFunction: greet\n\nInput:\nname → String\n\nOutput:\nString\n```\n\n---\n\n# Optionals\n\nOptionals are extremely important in Swift.\n\n```\nvar name: String?\n```\n\nThis means:\n\n```\nname might contain a String\nOR\nname might be nil\n```\n\nYou might see:\n\n```\nif let name = name {\n  print(name)\n}\n```\n\nThis means:\n\n```\nIf name exists,\nuse it.\n```\n\nYou might also see:\n\n```\nlet name = optionalName ?? \"Unknown\"\n```\n\nRead that as:\n\n```\nUse optionalName\nunless it's nil,\nthen use \"Unknown\".\n```\n\n---\n\n# Classes\n\nYou may see:\n\n```\nclass MyModule {\n  func doSomething() {\n      // ...\n  }\n}\n```\n\nThis is a class containing a method.\n\nYou'll encounter classes frequently in native modules and native components.\n\n---\n\n# Closures\n\nClosures are another common Swift pattern.\n\nYou might see:\n\n```\ndoSomething { result in\n  print(result)\n}\n```\n\nYou can roughly read this as:\n\n```\nCall doSomething,\nand when the result arrives,\nrun this piece of code.\n```\n\n---\n\n# `guard`\n\nYou'll also see:\n\n```\nguard let value = optionalValue else {\n  return\n}\n```\n\nRead this as:\n\n```\nI need value to exist.\n\nIf it doesn't:\n  leave the function.\n\nOtherwise:\n  continue.\n```\n\nThat's enough Swift for today.\n\nYou don't need to memorize every language feature.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- CocoaPods is a native dependency manager widely used by RN iOS projects.\n- CocoaPods entered maintenance mode in 2024.\n- CocoaPods Trunk is scheduled to stop accepting new Podspec submissions on December 2, 2026.\n- This does not mean existing CocoaPods projects immediately stop working.\n- RN 0.87 introduced experimental Swift Package Manager support.\n- CocoaPods remains the default supported path in RN 0.87.\n- You only need a practical subset of Swift to begin reading native RN code.\n- Focus first on variables, functions, optionals, classes, closures, and `guard`."
      ],
      "commonMistakes": [
        "### Mistake 1: \"CocoaPods dies in December 2026\"\n\nThat's too simplistic.\n\nThe important change is the Trunk submission cutoff.\n\n### Mistake 2: Migrating everything immediately\n\nSwiftPM support in RN 0.87 is experimental.\n\nUnderstand the tradeoffs before changing a production project.\n\n### Mistake 3: Trying to learn all of Swift first\n\nYou don't need that.\n\nLearn enough to read the native code you're actually working with.\n\n### Mistake 4: Ignoring native dependencies\n\nYour JavaScript code can be perfectly correct while the native dependency layer is broken."
      ],
      "quiz": [
        {
          "question": "What is Swift Package Manager?",
          "options": [
            "A. A JavaScript runtime",
            "B. Apple's native package-management system",
            "C. A replacement for Xcode",
            "D. A React state-management library"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn24-4",
      "title": "Native logs, debugging, and crash symbolication",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nEventually you'll encounter an iOS bug that doesn't appear clearly in JavaScript.\n\nFor example:\n\n```\nApp crashes immediately\n```\n\nor:\n\n```\nNative module initialization failed\n```\n\nor:\n\n```\nXcode reports an exception\n```\n\nAt that point, you need to understand native debugging.\n\n---\n\n# Reading native logs\n\nWhen running the application from Xcode, you'll see native output in the Xcode console.\n\nFor example:\n\n```\nprint(\"Native module initialized\")\n```\n\nYou might see:\n\n```\nNative module initialized\n```\n\nYou can use logging to answer questions like:\n\n```\nDid this native method run?\n\nDid initialization happen?\n\nWhat value reached native code?\n\nWhere did the failure occur?\n```\n\n---\n\n# A simple debugging strategy\n\nSuppose JavaScript calls:\n\n```\nNativeModule.start()\n```\n\nbut nothing appears to happen.\n\nDon't immediately rewrite the JavaScript.\n\nTrace the path:\n\n```\nJavaScript\n  ↓\nNative Module\n  ↓\nSwift\n  ↓\niOS API\n```\n\nAdd/check logs:\n\n```\nJS called start()\n      ↓\nNative method entered\n      ↓\niOS API called\n      ↓\niOS API returned\n```\n\nNow you can identify where the chain breaks.\n\n---\n\n# Native exception vs JavaScript exception\n\nThese are different worlds.\n\nA JavaScript error might look like:\n\n```\nTypeError:\nCannot read properties of undefined\n```\n\nA native crash may instead contain:\n\n```\nFatal error\nSIGABRT\nEXC_BAD_ACCESS\nuncaught exception\n```\n\nThe debugging tools and information can therefore be different.\n\nYour first question should be:\n\n> **Which layer actually crashed?**\n\n---\n\n# What is a crash report?\n\nA crash report contains information about what happened when the application terminated unexpectedly.\n\nYou might encounter information such as:\n\n```\nException Type\nThread\nBinary Images\nStack Trace\nAddresses\n```\n\nThe stack trace is particularly useful.\n\nConceptually:\n\n```\nFunction A\n ↓\nFunction B\n ↓\nFunction C\n ↓\nCrash\n```\n\nIt helps you understand the chain of native calls that led to the failure.\n\n---\n\n# What is symbolication?\n\nSometimes a crash report contains memory addresses rather than useful function names.\n\nFor example:\n\n```\n0x0000000101234567\n```\n\nThat's not very helpful by itself.\n\n**Symbolication** maps those machine addresses back to meaningful symbols.\n\nInstead of:\n\n```\n0x0000000101234567\n```\n\nyou may eventually get something closer to:\n\n```\nMyNativeModule.performOperation()\n```\n\nor a source file and line.\n\nConceptually:\n\n```\nCompiled machine address\n      ↓\nDebug symbols\n      ↓\nFunction/file/line\n```\n\n---\n\n# Why do symbols matter?\n\nImagine your production application crashes.\n\nWithout useful symbols:\n\n```\nAddress: 0x101234567\n```\n\nWith symbols:\n\n```\nPaymentModule.swift:84\n```\n\nThe second one gives you something actionable.\n\nThis is why release builds and crash-reporting systems need appropriate symbol files.\n\n---\n\n# What is a stack trace?\n\nA stack trace shows the sequence of functions involved around the crash.\n\nConceptually:\n\n```\nMyApp\n↓\nReact Native\n↓\nNativeModule\n↓\nSome iOS API\n↓\nCrash\n```\n\nYou can use the stack to work backwards:\n\n```\nWhere did the crash happen?\n      ↓\nWhat called that function?\n      ↓\nWhy was that function called?\n      ↓\nWhat input caused the problem?\n```\n\n---\n\n# Native debugging mental model\n\nWhen debugging a native iOS problem, think:\n\n```\n1. Did JavaScript call the native code?\n          ↓\n2. Did native code receive the expected values?\n          ↓\n3. Did the iOS API execute?\n          ↓\n4. Did the API return an error?\n          ↓\n5. Did native code crash?\n          ↓\n6. What does the stack trace say?\n```\n\nThis prevents random guessing.\n\n---\n\n# Example\n\nSuppose:\n\n```\nNativeCamera.takePhoto();\n```\n\ndoesn't work.\n\nYou could trace:\n\n```\nJS:\ntakePhoto() called\n     ↓\nNative:\ntakePhoto() entered\n     ↓\nPermission:\ncamera permission available?\n     ↓\niOS:\ncamera API called\n     ↓\nResult:\nsuccess / error\n```\n\nIf the application crashes between:\n\n```\nNative:\ntakePhoto() entered\n```\n\nand:\n\n```\niOS:\ncamera API called\n```\n\nyou know where to focus.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Xcode provides important native logs and debugging information.\n- First determine whether the problem is JavaScript or native.\n- Native crashes may contain stack traces and memory addresses.\n- Symbolication turns machine addresses into useful function/source information.\n- Logs are useful for tracing execution through the JS → native → iOS path.\n- Don't debug by guessing; trace the execution path."
      ],
      "commonMistakes": [
        "### Mistake 1: Only looking at Metro logs\n\nA native crash may never produce a useful JavaScript error.\n\n### Mistake 2: Assuming every crash is React Native's fault\n\nThe problem could be:\n\n```\nYour Swift code\nNative SDK\niOS API\nXcode configuration\nSigning\nDependency\n```\n\n### Mistake 3: Ignoring the stack trace\n\nThe stack often tells you where to start investigating.\n\n### Mistake 4: Treating memory addresses as meaningless\n\nThey become useful once symbolicated."
      ],
      "quiz": [
        {
          "question": "What does symbolication primarily do?",
          "options": [
            "A. Converts JavaScript to Swift",
            "B. Converts native crash addresses into useful symbols/source information",
            "C. Installs CocoaPods",
            "D. Grants iOS permissions"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What is the best mental model for the `ios/` directory?",
      "options": [
        "A. A cache generated by Metro",
        "B. The native iOS application containing React Native",
        "C. A JavaScript dependency folder",
        "D. A replacement for `src/`"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What does a permission usage-description string primarily do?",
      "options": [
        "A. Grants the permission",
        "B. Explains why the application needs the permission",
        "C. Signs the application",
        "D. Enables JavaScript"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What is Swift Package Manager?",
      "options": [
        "A. A JavaScript runtime",
        "B. Apple's native package-management system",
        "C. A replacement for Xcode",
        "D. A React state-management library"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What does symbolication primarily do?",
      "options": [
        "A. Converts JavaScript to Swift",
        "B. Converts native crash addresses into useful symbols/source information",
        "C. Installs CocoaPods",
        "D. Grants iOS permissions"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What is AppDelegate responsible for?",
      "options": [
        "A. Starting and configuring the iOS application",
        "B. Rendering every React component",
        "C. Managing Android variants",
        "D. Publishing npm packages"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Where are iOS usage descriptions commonly configured?",
      "options": [
        "A. Info.plist",
        "B. AndroidManifest.xml",
        "C. package.json only",
        "D. Metro cache"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What grants an iOS app special capabilities?",
      "options": [
        "A. Entitlements",
        "B. Query keys",
        "C. Gradle tasks",
        "D. JavaScript refs"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What manages many iOS native dependencies?",
      "options": [
        "A. CocoaPods",
        "B. adb",
        "C. AAB",
        "D. ProGuard"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why is crash symbolication important?",
      "options": [
        "A. It converts native addresses into readable stack information",
        "B. It signs the application",
        "C. It creates icons",
        "D. It refreshes tokens"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which tool shows native iOS logs and debugging information?",
      "options": [
        "A. Xcode",
        "B. Android Studio only",
        "C. npm registry",
        "D. AsyncStorage"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Self-Check — Explore Your iOS Project",
    "goal": "Explore Your iOS Project",
    "brief": "Now let's put everything together.\n\nYour goal today is **not** to build a native module.\n\nYour goal is to become comfortable navigating the native iOS project.\n\n---\n\n# Step 1 — Open the iOS project\n\nFrom your React Native project, open the iOS project in Xcode.\n\nIf you're using CocoaPods, you'll typically open the workspace:\n\n```\nopen ios/*.xcworkspace\n```\n\nIf your project doesn't use CocoaPods, open the appropriate Xcode project/workspace for your setup.\n\n---\n\n# Step 2 — Find `AppDelegate`\n\nIn Xcode's Project Navigator, locate:\n\n```\nAppDelegate.swift\n```\n\nLook at:\n\n```\nclass AppDelegate\n```\n\nand:\n\n```\napplication(...)\n```\n\nTry to identify:\n\n```\nWhere does the native app start?\n       ↓\nWhere does React Native get initialized?\n```\n\nYou don't need to modify anything here.\n\n---\n\n# Step 3 — Find `Info.plist`\n\nLocate your application's:\n\n```\nInfo.plist\n```\n\nLook through the existing configuration.\n\nSee if you can identify:\n\n```\nBundle information\nURL-related configuration\nPermission descriptions\nOther application settings\n```\n\n---\n\n# Step 4 — Add one usage-description string\n\nChoose **a permission your application actually uses**.\n\nFor example, if your app uses the camera, add:\n\n```\n<key>NSCameraUsageDescription</key>\n<string>This app uses the camera to take photos.</string>\n```\n\nIf it uses the microphone:\n\n```\n<key>NSMicrophoneUsageDescription</key>\n<string>This app uses the microphone for audio recording.</string>\n```\n\nDon't add random permissions just for practice.\n\nThe point is to connect the configuration to a real native feature.\n\n---\n\n# Step 5 — Find the permission request\n\nNow search your project for the feature that actually requests the permission.\n\nYour goal is to understand:\n\n```\nReact Native feature\n      ↓\nNative library/API\n      ↓\niOS permission\n      ↓\nInfo.plist usage description\n```\n\nFor example:\n\n```\nCamera component\n      ↓\nNative camera API\n      ↓\nCamera permission\n      ↓\nNSCameraUsageDescription\n```\n\nThis connection is much more important than memorizing the plist key.\n\n---\n\n# Step 6 — Run the application\n\nBuild and launch your application through Xcode.\n\nWatch the console.\n\nLook for:\n\n```\nNative logs\nWarnings\nErrors\nExceptions\n```\n\nDon't worry if you don't understand everything.\n\nPractice identifying which messages are:\n\n```\nJavaScript\nReact Native\niOS\nThird-party SDK\n```\n\n---\n\n# Step 7 — Inspect signing\n\nIn Xcode, find your application target and inspect the:\n\n```\nSigning & Capabilities\n```\n\nsection.\n\nLook at:\n\n```\nTeam\nBundle Identifier\nSigning\nCapabilities\n```\n\nYou don't need to change anything.\n\nThe goal is simply to understand where these settings live.\n\n---\n\n# Step 8 — Find your dependency configuration\n\nLook for:\n\n```\nPodfile\n```\n\nif your project uses CocoaPods.\n\nThen identify:\n\n```\nPodfile\nPodfile.lock\n```\n\nAsk yourself:\n\n> What role does each file play?\n\nYou should be able to explain:\n\n```\nPodfile\n→ dependency/configuration instructions\n\nPodfile.lock\n→ resolved dependency versions\n```\n\n---\n\n# Step 9 — Find a Swift file\n\nOpen a small Swift file in the project.\n\nDon't try to understand the entire file.\n\nInstead, identify:\n\n```\nlet\nvar\nfunc\nclass\nif\nguard\n?\n```\n\nSee if you can recognize what each construct is doing.\n\n---\n\n# Step 10 — Explain the architecture\n\nWithout looking at your notes, explain this:\n\n```\niOS\n↓\nAppDelegate\n↓\nReact Native\n↓\nJavaScript\n```\n\nThen explain:\n\n```\nJavaScript\n↓\nNative Module\n↓\nNative functionality\n```\n\nAnd:\n\n```\nJavaScript\n↓\nFabric Component\n↓\nNative UI\n```\n\nIf you can explain all three, you've connected the previous lessons with today's material.",
    "steps": [],
    "acceptance": [
      "You opened your `ios/` project in Xcode.",
      "You found `AppDelegate.swift`.",
      "You understand that React Native runs inside a native iOS application.",
      "You found `Info.plist`.",
      "You understand what usage-description strings are for.",
      "You understand the basic purpose of URL schemes and background modes.",
      "You can explain the difference between entitlements, certificates, and provisioning profiles.",
      "You know what CocoaPods does.",
      "You understand why Swift Package Manager matters to the RN ecosystem.",
      "You can read basic Swift syntax.",
      "You know where to look for native logs.",
      "You understand what symbolication means.",
      "You added one appropriate usage-description string to `Info.plist`."
    ],
    "stretch": [],
    "footer": "If you finish early, try these.\n\n### 1\\. Find a native dependency\n\nPick one dependency in your RN project that has an iOS implementation.\n\nTrace:\n\n```\nJavaScript package\n     ↓\niOS dependency\n     ↓\nNative implementation\n```\n\nTry to identify where it enters the iOS build.\n\n---\n\n### 2\\. Explore Signing & Capabilities\n\nOpen:\n\n```\nTarget\n↓\nSigning & Capabilities\n```\n\nLook at the capabilities currently enabled.\n\nFor each one, ask:\n\n> What native functionality requires this?\n\n---\n\n### 3\\. Read a small Swift file\n\nFind a native file related to one of your dependencies.\n\nDon't try to understand everything.\n\nIdentify:\n\n```\nClass\nMethods\nProperties\nOptionals\nCallbacks\n```\n\n---\n\n### 4\\. Follow a permission from start to finish\n\nPick one permission.\n\nTrace:\n\n```\nReact Native code\n     ↓\nNative library\n     ↓\niOS permission API\n     ↓\nInfo.plist\n     ↓\niOS system prompt\n```\n\nThis is an excellent exercise for understanding the native boundary.\n\n---\n\n# 🧠 Final Mental Model\n\nYou now have a bigger picture of what actually happens inside a React Native application.\n\nYour application isn't simply:\n\n```\nReact Native\n  ↓\nJavaScript\n```\n\nIt's closer to:\n\n```\n                       React Native App\n                              │\n                  ┌───────────┴───────────┐\n                  ↓                       ↓\n             JavaScript               Native iOS\n                  │                       │\n                  │                  AppDelegate\n                  │                       │\n                  │                    Xcode\n                  │                       │\n                  └───────────┬───────────┘\n                              ↓\n                       React Native runtime\n                              │\n                  ┌───────────┴───────────┐\n                  ↓                       ↓\n            Native Module          Fabric Component\n                  ↓                       ↓\n           Native behavior            Native UI\n                  │                       │\n                  └───────────┬───────────┘\n                              ↓\n                             iOS\n```\n\nAnd around all of this are the configuration and build systems:\n\n```\nInfo.plist\n  ↓\nApp configuration\n\nEntitlements\n  ↓\nCapabilities\n\nCertificates\n  ↓\nSigning identity\n\nProvisioning Profiles\n  ↓\nSigning/distribution context\n\nCocoaPods / SwiftPM\n  ↓\nNative dependencies\n\nXcode\n  ↓\nBuild + run + debug\n```\n\nThe most important mental model is:\n\n> **React Native is a cross-platform framework running inside real native applications. As an RN developer, understanding the native project means knowing where JavaScript ends, where iOS begins, and how the two connect.**"
  }
});

