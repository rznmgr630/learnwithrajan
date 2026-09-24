import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_27_LESSONS = normalizePastedLessonDay({
  "day": 27,
  "title": "Platform Differences in Practice",
  "overview": "📖 **4 lessons**\n\nToday we're moving from **building native configuration** to understanding an important reality of React Native development:\n\n> **One codebase does not mean identical behavior on iOS and Android.**\n\nReact Native gives you a shared JavaScript layer, but the two platforms still have different:\n\n```\nPermissions\nPrivacy rules\nUI conventions\nNavigation behavior\nStore requirements\nNative APIs\n```\n\nA good React Native developer knows when to share code and when to respect platform differences.\n\nThe goal is not:\n\n```\niOS = Android\n```\n\nThe goal is:\n\n```\nShared product\n     ↓\nShared React Native code\n     ↓\nPlatform-aware behavior\n```",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn27-1",
      "title": "iOS App Tracking Transparency",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nOne of the most important platform-specific privacy systems on iOS is **App Tracking Transparency**, commonly called **ATT**.\n\nATT controls whether an app can ask a user for permission to track them across apps and websites owned by other companies.\n\nThe important distinction is:\n\n```\nAnalytics\n  ≠\nTracking\n```\n\nNot every analytics implementation requires the ATT prompt.\n\nYou need to understand what your SDK and data collection actually do.\n\n---\n\n# What is App Tracking Transparency?\n\nImagine your application wants to use an advertising or attribution SDK that performs tracking covered by Apple's ATT rules.\n\nThe user may see a system prompt asking whether they want to allow tracking.\n\nConceptually:\n\n```\nApp\n↓\nATT authorization request\n↓\niOS system prompt\n↓\nUser chooses\n├── Allow\n└── Ask App Not to Track\n```\n\nThe decision belongs to the user.\n\nYour application should respect the result.\n\n---\n\n# The ATT permission is different from ordinary permissions\n\nYou have already seen permissions such as:\n\n```\nCamera\nMicrophone\nLocation\nPhotos\n```\n\nATT is different.\n\nIt's specifically about tracking as defined by Apple's privacy framework.\n\nSo don't think:\n\n```\n\"Every app needs ATT.\"\n```\n\nInstead think:\n\n```\n\"Does this app or one of its SDKs perform tracking that falls under Apple's ATT rules?\"\n```\n\nIf the answer is no, you should not add an unnecessary tracking prompt simply because the API exists.\n\n---\n\n# The Info.plist requirement\n\nIf your application requests ATT authorization, iOS expects the appropriate usage-description configuration.\n\nA commonly used key is:\n\n```\nNSUserTrackingUsageDescription\n```\n\nFor example:\n\n```\nNSUserTrackingUsageDescription\n\"Your data will be used to provide personalized ads.\"\n```\n\nThe exact wording should accurately describe your intended use.\n\nThis connects directly to Day 24 and Day 26.\n\nRemember:\n\n```\nExpo configuration\n      ↓\nConfig plugin / native configuration\n      ↓\nInfo.plist\n      ↓\niOS permission/privacy behavior\n```\n\n---\n\n# Requesting ATT\n\nAt runtime, your application can request authorization through Apple's tracking authorization APIs.\n\nConceptually:\n\n```\nApp starts\n ↓\nDetermine whether ATT applies\n ↓\nRequest authorization\n ↓\niOS prompt\n ↓\nUser decision\n ↓\nApp adapts behavior\n```\n\nThe application should not simply assume that authorization was granted.\n\n---\n\n# What happens if the user denies it?\n\nYour application should continue functioning according to your privacy design.\n\nFor example:\n\n```\nATT denied\n  ↓\nDon't perform tracking that requires ATT authorization\n```\n\nThis doesn't necessarily mean:\n\n```\nAnalytics = completely disabled\n```\n\nbecause different analytics and measurement technologies have different privacy characteristics and requirements.\n\nThe important principle is:\n\n> **The app must respect the user's ATT decision and comply with Apple's rules for the technologies it uses.**\n\n---\n\n# ATT and the App Store\n\nATT isn't just a runtime API.\n\nIt is also connected to Apple's App Store privacy requirements.\n\nWhen submitting an application, you need to accurately describe your app's data collection and tracking practices.\n\nThat means you need to understand what your dependencies are doing.\n\nFor example:\n\n```\nYour code\n +\nAnalytics SDK\n +\nAdvertising SDK\n +\nAttribution SDK\n      ↓\nActual data practices\n      ↓\nApp Store privacy disclosures\n```\n\nThis is why adding a third-party SDK isn't purely a JavaScript decision.\n\nA dependency can introduce native privacy requirements.\n\n---\n\n# Don't blindly copy permission strings\n\nA common mistake is writing:\n\n```\n\"Allow tracking?\"\n```\n\nwithout understanding what the application actually does.\n\nThe permission explanation should accurately communicate the purpose.\n\nFor example:\n\n```\nBad approach:\n\"Allow tracking to continue.\"\n\nBetter approach:\nA clear explanation of the actual purpose\nof the tracking technology being used.\n```\n\nYour privacy copy should be reviewed against the actual implementation and Apple's current requirements.\n\n---\n\n# ATT vs App Tracking\n\nKeep this mental model:\n\n```\nATT\n↓\nSpecific iOS privacy authorization\n↓\nTracking across apps/websites\n```\n\nIt is not:\n\n```\nATT\n↓\nGeneral analytics permission\n```\n\nThat distinction matters.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- ATT is Apple's framework for user authorization around covered tracking.\n- Not every analytics implementation requires ATT.\n- If your app requests ATT authorization, the appropriate native configuration must be present.\n- The user decides whether to allow tracking.\n- Your application must respect the user's decision.\n- App Store privacy disclosures need to accurately reflect your app and SDK data practices.\n- Third-party SDKs can introduce privacy requirements you didn't write yourself."
      ],
      "commonMistakes": [
        "### Mistake 1: Asking for ATT automatically\n\nOnly request it when your app's tracking use actually requires it.\n\n### Mistake 2: Treating ATT as an analytics permission\n\nTracking and analytics aren't automatically the same thing.\n\n### Mistake 3: Ignoring SDK behavior\n\nA dependency can perform data collection or tracking that affects your app's privacy obligations.\n\n### Mistake 4: Forgetting native configuration\n\nThe JavaScript request doesn't replace required iOS configuration."
      ],
      "quiz": [
        {
          "question": "What does ATT primarily concern?",
          "options": [
            "A. Android notifications",
            "B. iOS tracking authorization",
            "C. iOS screen orientation",
            "D. Android storage"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn27-2",
      "title": "Android runtime vs install-time permissions",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nAndroid has its own permission model, and it works differently from iOS.\n\nOne particularly important distinction is:\n\n```\nInstall-time / normal permissions\n        vs\nRuntime permissions\n```\n\nThe application doesn't necessarily ask the user about every permission when it is used.\n\nThe behavior depends on the permission and Android version.\n\n---\n\n# What is a runtime permission?\n\nA runtime permission is a permission that the application requests while it is running.\n\nFor example, an application might need access to:\n\n```\nCamera\nMicrophone\nLocation\n```\n\nThe general flow is:\n\n```\nApp\n↓\nCheck permission\n↓\nNot granted\n↓\nRequest permission\n↓\nAndroid system dialog\n↓\nUser decision\n```\n\nThis is different from simply declaring a permission in:\n\n```\nAndroidManifest.xml\n```\n\n---\n\n# Manifest declaration\n\nAndroid permissions are declared in the application manifest.\n\nConceptually:\n\n```\n<uses-permission\n  android:name=\"android.permission.CAMERA\" />\n```\n\nThis tells Android:\n\n```\n\"This application declares that it may need camera access.\"\n```\n\nBut declaring the permission does not necessarily mean the user has granted it.\n\nThink:\n\n```\nManifest declaration\n      ↓\nApplication is declaring a requirement\n```\n\nversus:\n\n```\nRuntime grant\n      ↓\nUser has granted access\n```\n\n---\n\n# The two-step mental model\n\nFor permissions that require runtime approval:\n\n```\nStep 1\nDeclare permission\n      ↓\nAndroidManifest.xml\n\nStep 2\nRequest permission\n      ↓\nRuntime system dialog\n```\n\nBoth pieces matter.\n\nIf you forget the manifest declaration, the runtime request may not work correctly.\n\nIf you declare the permission but never request it, the application may not actually have access.\n\n---\n\n# Example: Camera\n\nImagine your React Native app has a camera feature.\n\nYou need:\n\n```\nAndroidManifest\n    ↓\nCAMERA permission\n```\n\nThen at runtime:\n\n```\nUser opens camera feature\n    ↓\nCheck CAMERA permission\n    ↓\nNot granted?\n    ↓\nRequest permission\n    ↓\nUser responds\n    ↓\nOpen camera if allowed\n```\n\nThis is much safer than requesting every permission immediately when the application launches.\n\n---\n\n# Ask at the point of need\n\nSuppose your app has:\n\n```\nHome\nProfile\nCamera\nSettings\n```\n\nThe user doesn't need camera access simply because they opened the home screen.\n\nA better flow is:\n\n```\nOpen app\n↓\nNo camera prompt\n\nOpen camera feature\n↓\nCheck permission\n↓\nRequest if necessary\n```\n\nThis gives the user context for the request.\n\n---\n\n# Runtime permission states\n\nYou should think about more than:\n\n```\ngranted\nnot granted\n```\n\nA permission can have different states depending on the platform and permission.\n\nConceptually:\n\n```\nUnknown\n ↓\nUser makes decision\n ↓\nGranted / denied\n```\n\nThe user may also be able to change permissions later in system settings.\n\nSo your application should check the current state when the feature needs it.\n\n---\n\n# What if the user denies the permission?\n\nYour application should handle it.\n\nFor example:\n\n```\nCamera requested\n     ↓\nUser denies\n     ↓\nCamera cannot start\n     ↓\nShow useful explanation / alternative\n```\n\nDon't simply crash or leave the user staring at a broken screen.\n\n---\n\n# What if the user denies permanently?\n\nDepending on the permission and Android version, the application may eventually need to direct the user to system settings rather than repeatedly showing a permission dialog.\n\nThe exact behavior varies by permission and Android version.\n\nThe general principle is:\n\n```\nCheck\n↓\nRequest when appropriate\n↓\nHandle denial\n↓\nProvide a path forward when possible\n```\n\n---\n\n# Android permission design\n\nA good permission flow is:\n\n```\nFeature\n↓\nDoes this feature actually need permission?\n↓\nCheck current permission\n↓\nAlready granted?\n├── Yes → Continue\n└── No\n     ↓\nExplain/request when appropriate\n     ↓\nUser decision\n     ↓\nContinue or provide fallback\n```\n\nThis is a much better mental model than:\n\n```\nApp launches\n↓\nRequest every permission\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Android distinguishes between permission declaration and runtime authorization.\n- Permissions are commonly declared in `AndroidManifest.xml`.\n- Runtime permissions must be requested when appropriate.\n- The user can deny permissions.\n- Applications should handle denied permissions gracefully.\n- Ask for permissions in the context where the feature needs them.\n- Always check the current permission state rather than assuming it."
      ],
      "commonMistakes": [
        "### Mistake 1: Declaring a permission and assuming it's automatically granted\n\nThe manifest declaration and runtime grant are different concepts.\n\n### Mistake 2: Requesting everything on startup\n\nThis can create a poor user experience and unnecessary permission requests.\n\n### Mistake 3: Ignoring denial\n\nYour feature needs a sensible fallback.\n\n### Mistake 4: Assuming every Android permission behaves identically\n\nPermission behavior depends on the permission type and Android version."
      ],
      "quiz": [
        {
          "question": "For a runtime Android permission, which two pieces generally matter?",
          "options": [
            "A. TypeScript and Metro",
            "B. Manifest declaration and runtime request",
            "C. Xcode and Info.plist",
            "D. Gradle and CocoaPods only"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn27-3",
      "title": "Sharing features without forking your whole codebase",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nNow we get to the practical React Native question:\n\n> **What should I do when iOS and Android need different implementations?**\n\nThe answer is usually **not**:\n\n```\nCreate two completely separate applications.\n```\n\nYou want to share as much code as makes sense while isolating the platform-specific parts.\n\nThink:\n\n```\nShared application\n     │\n┌─────┴─────┐\n↓           ↓\nShared      Platform-specific\nlogic       behavior\n           ↓\n      iOS / Android\n```\n\n---\n\n# Platform-specific code\n\nReact Native gives you several ways to handle platform differences.\n\nOne of the simplest is:\n\n```\nimport { Platform } from \"react-native\";\n```\n\nThen:\n\n```\nif (Platform.OS === \"ios\") {\n// iOS behavior\n} else {\n// Android behavior\n}\n```\n\nThis is useful for small differences.\n\n---\n\n# Example: Platform-specific behavior\n\nImagine you need different text:\n\n```\nconst message =\nPlatform.OS === \"ios\"\n  ? \"Open Settings to change this permission.\"\n  : \"Open Android settings to change this permission.\";\n```\n\nMost of the feature remains shared.\n\nOnly the platform-specific behavior differs.\n\n---\n\n# Don't duplicate the entire screen\n\nBad architecture:\n\n```\nCameraScreenIOS.tsx\nCameraScreenAndroid.tsx\n```\n\nwith hundreds of lines duplicated between them.\n\nYou might end up with:\n\n```\niOS code\n ↓\ncopy/paste\n ↓\nAndroid code\n```\n\nNow every bug fix has to happen twice.\n\nInstead, try:\n\n```\nCameraScreen\n    ↓\nShared UI and business logic\n    ↓\nPlatform-specific permission helper\n```\n\nFor example:\n\n```\nCameraScreen\n ↓\nuseCameraPermission()\n ↓\niOS implementation\nAndroid implementation\n```\n\n---\n\n# Platform-specific files\n\nReact Native also supports platform-specific file extensions.\n\nFor example:\n\n```\nPermissionHelper.ios.ts\nPermissionHelper.android.ts\n```\n\nThen your shared code can import:\n\n```\nimport { requestPermission } from \"./PermissionHelper\";\n```\n\nThe platform-specific resolver can select the appropriate implementation.\n\nConceptually:\n\n```\n                  PermissionHelper\n                         │\n               ┌─────────┴─────────┐\n               ↓                   ↓\n    PermissionHelper.ios.ts   PermissionHelper.android.ts\n               ↓                   ↓\n             iOS               Android\n```\n\nThis is often cleaner than filling one file with dozens of:\n\n```\nif (Platform.OS === ...)\n```\n\nconditions.\n\n---\n\n# When should you use `Platform.OS`?\n\nUse it when the difference is small and local.\n\nFor example:\n\n```\nconst padding = Platform.OS === \"ios\" ? 20 : 16;\n```\n\nThat's easy to understand.\n\nBut if a file becomes:\n\n```\nif (Platform.OS === \"ios\") {\n // 100 lines\n}\n\nif (Platform.OS === \"android\") {\n // 150 lines\n}\n```\n\nyou probably have a good candidate for platform-specific modules/files.\n\n---\n\n# Platform-specific UI\n\nSome differences aren't just implementation details.\n\nUsers actually expect different platform behavior.\n\nFor example:\n\n```\niOS\n→ Back navigation conventions\n→ Tab bar conventions\n→ Navigation gestures\n```\n\nand:\n\n```\nAndroid\n→ System back behavior\n→ Edge-to-edge layouts\n→ Android navigation conventions\n```\n\nYour goal isn't to make both platforms visually identical.\n\nYour goal is to make the application feel natural on each platform.\n\n---\n\n# Back navigation\n\nOn Android, users commonly expect the system back action to work.\n\nFor example:\n\n```\nScreen B\n ↓\nBack\n ↓\nScreen A\n```\n\nOn iOS, navigation often relies more heavily on:\n\n```\nNavigation stack\nSwipe-back gesture\nNavigation bar\n```\n\nThis means a navigation design that feels natural on iOS may not automatically feel natural on Android.\n\n---\n\n# Tab bars\n\nPlatform conventions can also differ.\n\nA bottom tab bar is common on both platforms, but details such as:\n\n```\nSpacing\nIcon treatment\nLabels\nNavigation behavior\nSafe areas\n```\n\ncan differ.\n\nDon't force an identical visual implementation if doing so makes the application feel unlike the platform users expect.\n\n---\n\n# Android edge-to-edge\n\nModern Android applications increasingly need to account for content drawing around system bars.\n\nConceptually:\n\n```\n┌─────────────────────────┐\n│ Status bar              │\n├─────────────────────────┤\n│                         │\n│ App content             │\n│                         │\n├─────────────────────────┤\n│ Navigation area         │\n└─────────────────────────┘\n```\n\nWith edge-to-edge behavior, your application may draw behind system bars.\n\nThat means you need to think about:\n\n```\nInsets\nSafe areas\nStatus bar\nNavigation bar\nTouch targets\n```\n\nA layout that looks fine on one Android device can look wrong if it doesn't account for system insets.\n\n---\n\n# Shared feature, different implementation\n\nImagine a location feature.\n\nThe JavaScript API can stay the same:\n\n```\ngetCurrentLocation()\n```\n\nBut the implementation can account for platform differences:\n\n```\n            getCurrentLocation()\n                     ↓\n            Shared application API\n               ↙           ↘\n            iOS           Android\n             ↓               ↓\n      iOS permission    Android permission\n      flow/API          flow/API\n```\n\nYour screen doesn't need to know every native detail.\n\n---\n\n# The goal: isolate differences\n\nA useful architecture is:\n\n```\nShared UI\n  ↓\nShared business logic\n  ↓\nPlatform abstraction\n  ↓\n┌──────────────┐\n↓              ↓\niOS          Android\n```\n\nThis gives you:\n\n```\nMaximum sharing\n+\nExplicit platform differences\n```\n\nThat's much better than pretending the platforms are identical.\n\n---\n\n# A practical rule\n\nWhen implementing a feature, ask:\n\n### Question 1\n\nCan the feature be identical on both platforms?\n\nIf yes:\n\n```\nShare the code.\n```\n\n### Question 2\n\nIs there a small platform difference?\n\nUse:\n\n```\nPlatform.OS\n```\n\nor a small platform-specific helper.\n\n### Question 3\n\nIs the implementation substantially different?\n\nUse:\n\n```\n.ios.ts\n.android.ts\n```\n\nor separate native implementations behind a shared interface.\n\n### Question 4\n\nDoes the feature depend on native APIs?\n\nConsider:\n\n```\nExpo module\nNative module\nNative component\n```\n\ndepending on whether you need functionality or UI.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- React Native lets you share most of your code without pretending iOS and Android are identical.\n- Use `Platform.OS` for small differences.\n- Use `.ios` and `.android` files when implementations become substantially different.\n- Keep shared business logic and UI shared whenever possible.\n- Respect platform-specific navigation and layout conventions.\n- Android edge-to-edge requires careful handling of system insets.\n- The goal is shared architecture with explicit platform-specific behavior."
      ],
      "commonMistakes": [
        "### Mistake 1: Forking the entire application\n\nMost features don't need completely separate iOS and Android codebases.\n\n### Mistake 2: Hiding every platform difference\n\nUsers notice when an application ignores platform conventions.\n\n### Mistake 3: One enormous `Platform.OS` file\n\nExtract substantial differences into platform-specific modules.\n\n### Mistake 4: Treating layout differences as bugs\n\nSome differences are intentional platform conventions."
      ],
      "quiz": [
        {
          "question": "You have 10 lines of different behavior between iOS and Android. What is usually reasonable?",
          "options": [
            "A. Duplicate the entire screen",
            "B. Use a small platform-specific branch",
            "C. Rewrite the application",
            "D. Remove the feature"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn27-4",
      "title": "Store readiness and permission configuration",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nNow let's connect platform differences to something that matters in production:\n\n> **Your application needs to satisfy platform requirements before it can be distributed.**\n\nA large number of native configuration problems come down to mismatches like:\n\n```\nJavaScript expects permission\n      ↓\nNative configuration missing\n```\n\nor:\n\n```\nNative permission declared\n      ↓\nApplication doesn't correctly handle the runtime flow\n```\n\nThese problems can cause crashes, broken features, privacy issues, or store-review problems.\n\nBut be careful with the phrase:\n\n> \"Missing usage-description strings and manifest permissions are the #1 store-rejection cause.\"\n\nThere isn't a reliable universal statistic establishing that as the number-one cause across the App Store and Google Play.\n\nIt is safer to think of missing native configuration as **a common and important source of submission problems**, not as a proven universal #1 cause.\n\n---\n\n# iOS usage descriptions\n\nSuppose your application uses the camera.\n\nYour iOS native configuration needs the appropriate usage-description key.\n\nConceptually:\n\n```\nCamera feature\n   ↓\niOS permission request\n   ↓\nRequired usage description\n   ↓\nUser understands why access is needed\n```\n\nWithout the required native configuration, the application can have serious problems when requesting the permission.\n\n---\n\n# Android manifest permissions\n\nAndroid has a similar configuration requirement.\n\nIf your feature requires a permission, the appropriate declaration may need to exist in:\n\n```\nAndroidManifest.xml\n```\n\nFor example:\n\n```\n<uses-permission\n  android:name=\"android.permission.CAMERA\" />\n```\n\nThen, if it's a runtime permission, your application must also request it appropriately.\n\nSo remember:\n\n```\nAndroid\n ↓\nManifest declaration\n +\nRuntime request when required\n```\n\n---\n\n# Native configuration and store review\n\nStore review isn't simply:\n\n```\n\"Does the JavaScript code compile?\"\n```\n\nThe final application includes:\n\n```\nJavaScript\n+\nNative code\n+\nNative configuration\n+\nPermissions\n+\nEntitlements\n+\nThird-party SDKs\n+\nPrivacy declarations\n```\n\nSo a feature can work perfectly in one development environment and still have a problem during distribution because the final native configuration isn't correct.\n\n---\n\n# Example: Camera feature\n\nLet's walk through the complete feature.\n\nYour React Native code has:\n\n```\nCameraScreen\n```\n\nThe user taps:\n\n```\nTake Photo\n```\n\nNow:\n\n```\nReact Native\n    ↓\nCheck permission\n    ↓\nPlatform-specific flow\n```\n\n### iOS\n\n```\niOS\n↓\nCamera authorization\n↓\nUsage description\n↓\nSystem prompt\n↓\nUser decision\n```\n\n### Android\n\n```\nAndroid\n↓\nManifest declaration\n↓\nCheck runtime permission\n↓\nRequest permission\n↓\nUser decision\n```\n\nThe user sees one product feature:\n\n```\n\"Take a photo\"\n```\n\nBut underneath, the platforms can have different native requirements.\n\n---\n\n# Test the denied state\n\nDon't only test:\n\n```\nPermission granted\n```\n\nAlso test:\n\n```\nPermission denied\n```\n\nand:\n\n```\nPermission previously denied\n```\n\nand, where relevant:\n\n```\nPermission changed in system settings\n```\n\nYour feature should remain understandable.\n\nFor example:\n\n```\nCamera unavailable\n     ↓\nExplain why\n     ↓\nOffer appropriate next step\n```\n\n---\n\n# Test a fresh installation\n\nPermission state can survive application reinstalls or upgrades differently depending on the platform and testing setup.\n\nFor reliable testing, understand the state you're starting from.\n\nA useful test matrix is:\n\n```\nFresh install\n   ↓\nPermission not decided\n\nPermission granted\n   ↓\nFeature works\n\nPermission denied\n   ↓\nFeature handles denial\n\nPermission changed in Settings\n   ↓\nFeature detects new state\n```\n\n---\n\n# Test both platforms\n\nDon't assume:\n\n```\nWorks on iOS\n  ↓\nWorks on Android\n```\n\nInstead:\n\n```\n               Feature\n                  ↓\n         ┌────────┴────────┐\n         ↓                 ↓\n       iOS              Android\n         ↓                 ↓\n     Test flow         Test flow\n```\n\nYou need to verify each platform's permission and UI behavior.\n\n---\n\n# Privacy and permissions should be intentional\n\nA good application doesn't request permissions just because it can.\n\nAsk:\n\n```\nDoes this feature actually need the permission?\n```\n\nThen:\n\n```\nWhen does it need it?\n```\n\nThen:\n\n```\nCan the user understand why?\n```\n\nThen:\n\n```\nWhat happens if they say no?\n```\n\nThis produces a much better permission experience.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Native configuration is part of the final application, not an implementation detail you can ignore.\n- iOS permissions can require usage-description strings.\n- Android permissions can require manifest declarations and runtime requests.\n- Missing native configuration can cause broken features and submission problems.\n- Don't rely on the claim that permission mistakes are universally the \"#1\" store-rejection cause.\n- Test granted, denied, and changed permission states.\n- Test the complete feature independently on iOS and Android."
      ],
      "commonMistakes": [
        "### Mistake 1: Testing only the happy path\n\nA permission feature isn't finished when it works only after the user taps \"Allow.\"\n\n### Mistake 2: Forgetting the native configuration\n\nJavaScript permission code doesn't replace native configuration.\n\n### Mistake 3: Assuming iOS and Android permission flows are identical\n\nThey aren't.\n\n### Mistake 4: Requesting permissions before they're needed\n\nAsk at the point where the user understands why the feature needs access."
      ],
      "quiz": [
        {
          "question": "For a camera feature, which statement is most accurate?",
          "options": [
            "A. JavaScript permission code is always enough",
            "B. iOS and Android have identical permission systems",
            "C. Native configuration and platform-specific permission handling may both be required",
            "D. Permissions only matter during development"
          ],
          "correctIndex": 2,
          "explanation": "**Answer:** C"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What does ATT primarily concern?",
      "options": [
        "A. Android notifications",
        "B. iOS tracking authorization",
        "C. iOS screen orientation",
        "D. Android storage"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "For a runtime Android permission, which two pieces generally matter?",
      "options": [
        "A. TypeScript and Metro",
        "B. Manifest declaration and runtime request",
        "C. Xcode and Info.plist",
        "D. Gradle and CocoaPods only"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "You have 10 lines of different behavior between iOS and Android. What is usually reasonable?",
      "options": [
        "A. Duplicate the entire screen",
        "B. Use a small platform-specific branch",
        "C. Rewrite the application",
        "D. Remove the feature"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "For a camera feature, which statement is most accurate?",
      "options": [
        "A. JavaScript permission code is always enough",
        "B. iOS and Android have identical permission systems",
        "C. Native configuration and platform-specific permission handling may both be required",
        "D. Permissions only matter during development"
      ],
      "correctIndex": 2,
      "explanation": "**Answer:** C"
    },
    {
      "question": "What does App Tracking Transparency govern on iOS?",
      "options": [
        "A. Permission to track users across apps and websites",
        "B. Camera access on Android",
        "C. Gradle signing",
        "D. Native module publishing"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "When should Android runtime permissions be requested?",
      "options": [
        "A. When the user reaches the feature that needs them",
        "B. At every application launch",
        "C. After the feature fails silently",
        "D. Only during build"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "How should most shared cross-platform features be structured?",
      "options": [
        "A. Shared logic with small platform-specific seams",
        "B. Two completely separate applications",
        "C. One giant platform condition",
        "D. Native code only"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What helps select a platform-specific implementation?",
      "options": [
        "A. Platform-specific files or focused Platform checks",
        "B. Query invalidation",
        "C. Refresh tokens",
        "D. CocoaPods only"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why must store permission declarations match application behavior?",
      "options": [
        "A. Reviewers and users need an accurate privacy explanation",
        "B. It improves list rendering",
        "C. It creates build variants",
        "D. It prevents all crashes"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should happen when a permission is denied?",
      "options": [
        "A. Show an honest fallback or recovery path",
        "B. Loop the prompt forever",
        "C. Pretend it succeeded",
        "D. Delete user data"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Self-Check — Ship a Cross-Platform Permission Feature",
    "goal": "Ship a Cross-Platform Permission Feature",
    "brief": "Now let's put everything together.\n\nYour goal is to implement a feature that requires permission on both platforms.\n\nWe'll use:\n\n```\nCamera\n```\n\nas the example.\n\nThe final user experience should look roughly like:\n\n```\n┌────────────────────────────┐\n│                            │\n│       Camera Feature       │\n│                            │\n│       [ Take Photo ]       │\n│                            │\n└────────────────────────────┘\n```\n\nThe important part isn't the camera UI itself.\n\nThe important part is the permission flow.\n\n---\n\n# Step 1 — Identify the platform requirements\n\nStart by writing down:\n\n```\nFeature:\nCamera\n\niOS:\nCamera usage description\niOS authorization flow\n\nAndroid:\nCAMERA manifest permission\nRuntime permission flow\n```\n\nThis is your platform checklist.\n\n---\n\n# Step 2 — Configure iOS\n\nIf you're using Expo, configure the native permission through your Expo configuration and/or the appropriate library/config plugin.\n\nThe generated iOS project should contain the required camera usage description.\n\nConceptually:\n\n```\napp.config.ts\n     ↓\nNative configuration\n     ↓\nInfo.plist\n     ↓\nNSCameraUsageDescription\n```\n\nDon't simply open the generated `Info.plist` and manually add it if your project relies on prebuild.\n\n---\n\n# Step 3 — Configure Android\n\nMake sure the Android application declares the required camera permission.\n\nConceptually:\n\n```\nExpo/native configuration\n     ↓\nAndroidManifest.xml\n     ↓\nCAMERA\n```\n\nThen make sure your runtime permission flow actually requests access when the feature needs it.\n\n---\n\n# Step 4 — Check permission before using the camera\n\nYour application should not immediately assume access.\n\nThink:\n\n```\nUser taps \"Take Photo\"\n       ↓\nCheck permission\n       ↓\nGranted?\n  ┌────┴────┐\n Yes        No\n  ↓          ↓\nOpen       Request\ncamera     permission\n```\n\n---\n\n# Step 5 — Handle the user's decision\n\nIf the user grants permission:\n\n```\nPermission granted\n      ↓\nOpen camera\n```\n\nIf the user denies:\n\n```\nPermission denied\n      ↓\nDon't open camera\n      ↓\nExplain what happened\n```\n\nThe exact UI is up to your application.\n\n---\n\n# Step 6 — Keep the feature shared\n\nDon't build:\n\n```\nCameraScreenIOS\nCameraScreenAndroid\n```\n\nwith two completely separate implementations unless there is a genuine need.\n\nInstead, aim for:\n\n```\nCameraScreen\n     ↓\nShared UI\n     ↓\nShared feature logic\n     ↓\nPlatform-specific permission behavior\n```\n\nThe user should experience the same product feature even though the native permission systems differ.\n\n---\n\n# Step 7 — Test iOS\n\nTest at least:\n\n```\nFresh installation\n     ↓\nTap Take Photo\n     ↓\nATT? No — camera permission\n     ↓\nCamera permission prompt\n     ↓\nAllow\n     ↓\nCamera opens\n```\n\nThen test:\n\n```\nDeny\n↓\nCamera does not open\n↓\nUseful fallback appears\n```\n\nAlso verify the native usage description is present.\n\n---\n\n# Step 8 — Test Android\n\nTest:\n\n```\nFresh installation\n     ↓\nTap Take Photo\n     ↓\nCamera permission request\n     ↓\nAllow\n     ↓\nCamera opens\n```\n\nThen:\n\n```\nDeny\n↓\nCamera does not open\n↓\nUseful fallback appears\n```\n\nAlso verify:\n\n```\nAndroidManifest.xml\n```\n\ncontains the appropriate declaration.\n\n---\n\n# Step 9 — Test a changed permission state\n\nGo into the device's system settings.\n\nChange the camera permission.\n\nReturn to your application.\n\nThen try the feature again.\n\nYour application should check the current state rather than relying on an old assumption.\n\n---\n\n# Step 10 — Test the release build\n\nThis is important.\n\nDon't stop at:\n\n```\nDevelopment build works\n```\n\nTest the actual build configuration you'll distribute.\n\nConceptually:\n\n```\nDevelopment\n     ↓\nWorks\n\nPreview / internal build\n     ↓\nWorks\n\nProduction-style build\n     ↓\nWorks\n```\n\nNative configuration problems can appear only when you're working with the final build configuration.\n\n---\n\n# Step 11 — Explain the difference between the platforms\n\nWhen you're done, you should be able to explain:\n\n```\niOS\n↓\nNative usage description\n↓\niOS authorization API\n↓\nUser decision\n```\n\nversus:\n\n```\nAndroid\n↓\nManifest declaration\n↓\nRuntime permission request\n↓\nUser decision\n```\n\nThe React Native feature is shared.\n\nThe native permission mechanisms are not.\n\n---\n\n# Step 12 — Extend the exercise to ATT\n\nNow try the same reasoning with an iOS tracking-related feature.\n\nAsk:\n\n```\nDoes this feature actually involve tracking\nunder Apple's ATT rules?\n```\n\nIf yes, determine:\n\n```\nATT configuration\n+\nruntime authorization\n+\nuser decision\n+\nbehavior after denial\n+\nApp Store privacy disclosures\n```\n\nDo not add an ATT prompt merely because you have analytics.\n\nThe implementation and SDK behavior determine whether ATT applies.\n\n---\n\n# Step 13 — Write your platform checklist\n\nCreate a small checklist like:\n\n```\nFeature: Camera\n\nShared:\n[ ] UI\n[ ] Business logic\n[ ] Error handling\n\niOS:\n[ ] Usage description\n[ ] Permission request\n[ ] Denied state\n[ ] Settings state\n\nAndroid:\n[ ] Manifest permission\n[ ] Runtime request\n[ ] Denied state\n[ ] Settings state\n\nRelease:\n[ ] iOS build tested\n[ ] Android build tested\n[ ] Privacy requirements checked\n```\n\nThis is the kind of checklist that prevents small native configuration mistakes from becoming production problems.",
    "steps": [],
    "acceptance": [
      "You have implemented one permission-dependent feature.",
      "The feature has a shared React Native UI.",
      "iOS uses the correct native permission configuration.",
      "Android uses the correct manifest configuration where required.",
      "The runtime permission flow works on both platforms.",
      "You tested the granted state.",
      "You tested the denied state.",
      "You tested changing the permission in system settings.",
      "You understand that iOS and Android may require different native implementations.",
      "You did not fork the entire feature into separate applications.",
      "You tested a release-style build.",
      "You understand the difference between ATT and ordinary permissions.",
      "You understand why third-party SDKs can affect platform privacy requirements."
    ],
    "stretch": [],
    "footer": "Once the camera flow works, try these.\n\n### 1\\. Add location\n\nImplement:\n\n```\nGet current location\n```\n\nand compare:\n\n```\niOS location permission\n```\n\nwith:\n\n```\nAndroid location permission\n```\n\nPay attention to the different permission types and platform behavior.\n\n---\n\n### 2\\. Add a platform-specific helper\n\nCreate:\n\n```\npermissions.ios.ts\npermissions.android.ts\n```\n\nExpose the same JavaScript API:\n\n```\nrequestCameraPermission()\n```\n\nbut implement the platform-specific behavior separately.\n\nYour screen should remain:\n\n```\nCameraScreen\n    ↓\nrequestCameraPermission()\n```\n\nwithout knowing the platform implementation.\n\n---\n\n### 3\\. Test edge-to-edge\n\nOn Android, inspect your feature with modern edge-to-edge behavior enabled.\n\nCheck:\n\n```\nStatus bar\nNavigation area\nSafe/inset handling\nTouch targets\n```\n\nThen compare the same screen on iOS.\n\n---\n\n### 4\\. Test back behavior\n\nNavigate:\n\n```\nHome\n↓\nCamera\n↓\nCamera details\n```\n\nTest:\n\n```\nAndroid system back\n```\n\nand:\n\n```\niOS back gesture\n```\n\nMake sure the navigation behavior feels appropriate on each platform.\n\n---\n\n### 5\\. Review your dependencies\n\nPick one native dependency your application uses.\n\nAsk:\n\n```\nDoes it collect data?\nDoes it request permissions?\nDoes it use native APIs?\nDoes it require iOS configuration?\nDoes it require Android configuration?\nDoes it affect App Store privacy disclosures?\n```\n\nThis is a valuable habit when working with third-party SDKs.\n\n---\n\n# 🧠 Final Mental Model\n\nThe previous days taught you how native configuration works.\n\nToday we're adding the most important practical lesson:\n\n```\n           React Native App\n                  │\n        ┌─────────┴─────────┐\n        ↓                   ↓\n      Shared              Native\n      code                differences\n        │                   │\n        │          ┌────────┴────────┐\n        │          ↓                 ↓\n        │         iOS             Android\n        │          ↓                 ↓\n        │     Info.plist        Manifest\n        │     permissions       permissions\n        │     ATT               runtime requests\n        │     gestures          edge-to-edge\n        │     UI conventions    system back\n        │\n        └──────────┬───────────────┘\n                   ↓\n             One product\n```\n\nThe goal isn't to eliminate platform differences.\n\nIt's to **isolate them intelligently**.\n\nRemember:\n\n```\nShared feature\n    ↓\nShared React Native code\n    ↓\nPlatform-specific boundary\n    ↓\niOS / Android implementation\n```\n\nFor small differences:\n\n```\nPlatform.OS\n```\n\nFor larger differences:\n\n```\n.ios.ts\n.android.ts\n```\n\nFor native functionality:\n\n```\nNative module / Expo module\n```\n\nFor native UI:\n\n```\nFabric component\n```\n\nAnd for permissions:\n\n```\niOS\n→ native usage descriptions + platform authorization flow\n\nAndroid\n→ manifest declaration + runtime permission flow when required\n```\n\nThe most important rule to remember is:\n\n> **React Native lets you share your application code, but good cross-platform development means respecting the native platform where users actually experience differences.**"
  }
});

