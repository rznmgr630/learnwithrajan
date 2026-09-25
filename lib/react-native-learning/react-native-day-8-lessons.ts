import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_8_LESSONS = normalizePastedLessonDay({
  "day": 8,
  "title": "Device APIs and Permissions",
  "overview": "Today we're moving from the UI into something that makes React Native apps feel like **real mobile apps**.\n\nYour app can show buttons, lists, animations, and screens—but eventually you'll want it to interact with the device itself.\n\nFor example:\n\n- Open the camera\n- Pick a photo\n- Read the user's location\n- Detect device movement\n- Access contacts\n- Trigger haptic feedback (a small vibration or physical response)\n\nThat's where **device APIs** (features provided by the phone's operating system) come in.\n\nBut there's an important rule:\n\n> Your app doesn't automatically get access to everything on the device.\n\nThe user has to grant **permission** (authorization that allows your app to use a protected device feature).\n\nSo today we'll learn both sides:\n\n```\nDevice API\n    +\nPermission\n    ↓\nUseful mobile feature\n```\n\nWe'll also spend a lot of time on what happens when the user says:\n\n> **No.**\n\nBecause a good mobile app should work well even when a permission is denied.\n\n---",
  "totalMinutes": 53,
  "difficulty": "Beginner",
  "lessons": [
    {
      "id": "rn8-1",
      "title": "The expo-* Module Pattern",
      "durationMinutes": 8,
      "explanation": "If you've been using Expo, you've probably noticed package names such as:\n\n```\nexpo-camera\nexpo-location\nexpo-haptics\nexpo-sensors\nexpo-contacts\n```\n\nThey follow a simple pattern:\n\n```\nexpo- + feature\n```\n\nThese packages provide JavaScript-friendly APIs for accessing native device capabilities.\n\nInstead of writing native Android and iOS code yourself, you can often use an Expo package.\n\n---\n\n## What is a device API?\n\nAn **API** (Application Programming Interface) is a way for one piece of software to communicate with another.\n\nYour JavaScript application might say:\n\n```\n\"Give me the device's current location.\"\n```\n\nThe operating system has access to GPS and other location systems.\n\nThe Expo module acts as the convenient interface between your JavaScript code and those native capabilities.\n\nConceptually:\n\n```\nYour React Native app\n       │\n       ▼\n  Expo module\n       │\n       ▼\nNative platform API\n       │\n       ▼\n     Device\n```\n\n---\n\n## Example: Location\n\nYou might use:\n\n```\nimport * as Location from \"expo-location\";\n```\n\nThen your JavaScript can interact with location functionality.\n\nConceptually:\n\n```\nReact Native\n    ↓\nexpo-location\n    ↓\niOS / Android location services\n    ↓\nGPS / network / sensors\n```\n\nYou don't have to manually implement the platform-specific location system.\n\n---\n\n# Common Expo modules\n\nLet's look at the important ones for today.\n\n## `expo-camera`\n\nUsed for camera functionality.\n\nFor example:\n\n```\nScan QR code\nTake a photo\nShow camera preview\n```\n\n---\n\n## `expo-location`\n\nUsed for location information.\n\nFor example:\n\n```\nCurrent location\nLocation updates\nGeolocation\n```\n\n---\n\n## `expo-sensors`\n\nUsed for device sensors.\n\nExamples include:\n\n```\nAccelerometer\nGyroscope\nDevice motion\n```\n\nA **sensor** is hardware that measures something about the device or its environment.\n\nFor example, an accelerometer can detect movement or changes in acceleration.\n\n---\n\n## `expo-contacts`\n\nUsed to interact with the device's contacts.\n\nFor example:\n\n```\nRead contacts\nAccess contact information\n```\n\nBecause contacts contain personal information, the operating system protects them with permissions.\n\n---\n\n## `expo-haptics`\n\nUsed for haptic feedback.\n\n**Haptic feedback** means a physical response from the device, usually a vibration or subtle tactile effect.\n\nFor example:\n\n```\nButton pressed\n    ↓\nSmall vibration\n```\n\nIt can make an interaction feel more physical.\n\n---\n\n# Why does Expo use separate modules?\n\nImagine if Expo had one giant package:\n\n```\nexpo-everything\n```\n\nIt could contain:\n\n```\nCamera\nLocation\nContacts\nSensors\nNotifications\nBluetooth\nHaptics\nCalendar\n...\n```\n\nThat wouldn't be very convenient.\n\nInstead, functionality is separated:\n\n```\nexpo-camera\nexpo-location\nexpo-contacts\nexpo-sensors\nexpo-haptics\n```\n\nThis makes the APIs easier to understand and maintain.\n\n---",
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
      "id": "rn8-2",
      "title": "Requesting Permissions Correctly",
      "durationMinutes": 8,
      "explanation": "Here's one of the most important rules of today's lesson:\n\n> **Ask for permission when the user understands why you need it.**\n\nImagine you install a new app.\n\nYou haven't done anything yet.\n\nSuddenly it asks:\n\n```\nAllow this app to use your camera?\n\nAllow\nDon't Allow\n```\n\nYou might think:\n\n> \"Why does this app need my camera?\"\n\nThat's a poor permission experience.\n\n---\n\n# Ask in context\n\n**In context** means asking for permission at the moment when the user is trying to use the feature that needs it.\n\nFor example, imagine your app has:\n\n```\n┌─────────────────────────┐\n│      Scan Receipt       │\n│                         │\n│     [ Start Scan ]      │\n└─────────────────────────┘\n```\n\nThe user taps:\n\n```\nStart Scan\n```\n\nNow you ask for camera permission.\n\nThat's much easier to understand:\n\n```\nUser wants to scan\n       ↓\nApp needs camera\n       ↓\nAsk for camera permission\n```\n\n---\n\n# Bad flow\n\n```\nApp opens\n  ↓\nAsk camera permission\n  ↓\nAsk location permission\n  ↓\nAsk contacts permission\n  ↓\nAsk notifications permission\n  ↓\nFinally show the app\n```\n\nThis creates a permission wall.\n\nThe user hasn't even used the app yet.\n\n---\n\n# Better flow\n\n```\nApp opens\n  ↓\nShow useful UI\n  ↓\nUser chooses a feature\n  ↓\nExplain why permission is needed\n  ↓\nRequest permission\n```\n\nFor example:\n\n```\nScan a document\n\n[ Scan ]\n```\n\nUser taps Scan.\n\nThen:\n\n```\nTo scan your document, we need\naccess to your camera.\n\n[ Continue ]\n```\n\nThen the operating system displays its permission dialog.\n\n---\n\n# Permission state\n\nA permission isn't simply:\n\n```\nyes\n```\n\nor:\n\n```\nno\n```\n\nYou should think about several possible states.\n\nFor example:\n\n```\nNot asked yet\n     ↓\nRequest\n     ↓\nGranted\n```\n\nOr:\n\n```\nNot asked yet\n     ↓\nRequest\n     ↓\nDenied\n```\n\nThere can also be states where the user has made a choice that changes whether the app can ask again normally.\n\nThe exact behavior differs between iOS and Android and can change with OS versions.\n\n---\n\n# A simple permission state machine\n\nA **state machine** (a model that describes possible states and transitions between them) is useful here.\n\n```\n            ┌─────────────┐\n            │ Not Asked   │\n            └──────┬──────┘\n                   │\n                Request\n                   │\n         ┌─────────┴─────────┐\n         ▼                   ▼\n     Granted               Denied\n         │                   │\n         ▼                   ▼\n   Use feature          Explain / Retry\n                             │\n                             ▼\n                      Ask again or\n                      open Settings\n```\n\nThis is much better than writing:\n\n```\nif permission === true\n```\n\nand ignoring everything else.\n\n---\n\n# Why should you explain before the system dialog?\n\nThe operating system's permission dialog may contain technical language.\n\nYour app can first provide context:\n\n```\nWe use your camera to scan\nbarcodes and receipts.\n```\n\nThen the system can ask:\n\n```\nAllow Example App to use your camera?\n```\n\nThe user understands the reason before making the decision.\n\n---\n\n# Example with Expo\n\nA permission hook can be used with Expo modules.\n\nFor example, with camera-related functionality, the exact API depends on the Expo Camera version you're using, but the basic idea is:\n\n```\nconst [permission, requestPermission] =\n useCameraPermissions();\n```\n\nThen:\n\n```\nif (!permission?.granted) {\n await requestPermission();\n}\n```\n\nThe important part isn't memorizing the exact API yet.\n\nUnderstand the pattern:\n\n```\nCheck permission\n     ↓\nIf needed\n     ↓\nRequest permission\n     ↓\nCheck result\n     ↓\nContinue or handle denial\n```\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Don't request every permission when the app starts.\n- Ask when the user reaches the feature that needs the permission.\n- Explain why the permission is needed.\n- Treat permission as a state, not just a Boolean (true/false value).\n- Always design the denied path.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Asking for camera permission on the splash screen\n\nThe user may not understand why.\n\n### ❌ Assuming permission was granted\n\nAlways check the result.\n\n### ❌ Showing nothing when permission is denied\n\nThe user needs to know what happened and what they can do next.\n\n---"
      ],
      "quiz": [
        {
          "question": "When should you normally ask for camera permission?",
          "options": [
            "A. When the app launches",
            "B. When the user tries to use a camera feature",
            "C. After every button press",
            "D. Only after the user closes the app"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn8-3",
      "title": "iOS vs Android Permission Models",
      "durationMinutes": 7,
      "explanation": "Now we need to understand something important:\n\n> **iOS and Android don't handle permissions in exactly the same way.**\n\nAs a React Native developer, you usually use Expo APIs to make this easier.\n\nBut you still need to understand that the underlying operating systems have different permission systems.\n\n---\n\n# The general idea\n\nBoth platforms protect sensitive information and hardware.\n\nFor example:\n\n```\nCamera\nLocation\nContacts\nMicrophone\nPhotos\n```\n\nThe user gets control over access.\n\nBut the details differ.\n\n---\n\n# iOS\n\nOn iOS, applications declare the types of protected resources they need and provide purpose descriptions for certain permissions.\n\nFor example, the user may see a system prompt explaining why an app wants camera access.\n\nThe exact options depend on the permission and the iOS version.\n\n---\n\n# Android\n\nAndroid also has runtime permissions.\n\n**Runtime permission** means the user can be asked while the application is running rather than having access automatically granted simply because the app was installed.\n\nAndroid's permission behavior can vary by:\n\n```\nAndroid version\nPermission type\nApp target SDK\nUser choices\n```\n\nSome permissions have additional restrictions or special handling.\n\n---\n\n# Why should beginners care?\n\nYou don't need to memorize every Android and iOS permission rule.\n\nInstead, remember:\n\n```\nYour JavaScript code\n      ↓\nExpo API\n      ↓\nOperating system\n      ↓\nPermission decision\n```\n\nThe operating system has the final authority.\n\n---\n\n# A useful example\n\nImagine your app requests location.\n\nOn one device, the user might allow:\n\n```\nWhile using the app\n```\n\nAnother platform/version may present different choices or behavior.\n\nYour application should not assume:\n\n```\npermission = forever\n```\n\nInstead, build your logic around the permission status returned by the API.\n\n---\n\n# Permissions can change later\n\nThis is another important concept.\n\nSuppose the user originally grants camera access.\n\nLater they go into device settings and disable it.\n\nYour app may now find:\n\n```\nPreviously granted\n       ↓\nNow denied\n```\n\nSo you should check permission when it matters rather than assuming the original decision remains forever.\n\n---\n\n# Don't build platform-specific logic unnecessarily\n\nA beginner sometimes writes:\n\n```\nif (Platform.OS === \"ios\") {\n // huge permission system\n}\n\nif (Platform.OS === \"android\") {\n // another huge permission system\n}\n```\n\nSometimes platform-specific code is necessary.\n\nBut for common Expo APIs, start with the Expo permission API.\n\nLet Expo handle as much platform-specific complexity as possible.\n\nOnly handle platform differences when your actual feature requires it.\n\n---",
      "diagram": "```\n            Your App\n               │\n               ▼\n         Expo Permission API\n               │\n         ┌─────┴─────┐\n         ▼           ▼\n        iOS        Android\n         │           │\n         ▼           ▼\n     Permission   Permission\n       system       system\n         │           │\n         └─────┬─────┘\n               ▼\n         Permission result\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- iOS and Android both protect sensitive device capabilities.\n- Their permission systems aren't identical.\n- Expo provides a common API for many common cases.\n- Permission status can change after your app was previously granted access.\n- Don't assume a previously granted permission will always remain granted.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Assuming iOS and Android show the same permission dialog\n\nThey don't necessarily.\n\n### ❌ Assuming \"granted once\" means \"granted forever\"\n\nUsers can change permissions later.\n\n### ❌ Ignoring OS versions\n\nPermission behavior can change between versions.\n\n---"
      ],
      "quiz": [
        {
          "question": "Who ultimately controls whether your app gets access to protected device functionality?",
          "options": [
            "A. Your React component",
            "B. The operating system and the user's permission choice",
            "C. Your database",
            "D. Expo Router"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn8-4",
      "title": "Location, Camera, Image Picker, and Haptics",
      "durationMinutes": 9,
      "explanation": "Now let's look at the actual device APIs you'll commonly use.\n\nWe'll cover:\n\n```\nexpo-location\nexpo-camera\nexpo-image-picker\nexpo-haptics\n```\n\n---\n\n# `expo-location`\n\nLocation is more complicated than:\n\n```\n\"Give me GPS.\"\n```\n\nThere are different types of location access.\n\n---\n\n## Foreground location\n\n**Foreground location** means your app gets location while the user is actively using the app.\n\nFor example:\n\n```\nOpen food delivery app\n      ↓\nSee nearby restaurants\n      ↓\nApp uses current location\n```\n\nThe app is visible and being used.\n\n---\n\n## Background location\n\n**Background location** means the app can receive location information even when it isn't actively visible.\n\nFor example:\n\n```\nFitness tracking\n      ↓\nUser locks phone\n      ↓\nApp continues tracking\n```\n\nBackground location is much more sensitive.\n\nIt can also have stronger platform requirements and restrictions.\n\n---\n\n# Why not always use high accuracy?\n\nLocation accuracy can have a cost.\n\nHigher accuracy may involve more device resources.\n\nThink about three possible choices:\n\n```\nLow accuracy\n  ↓\nLess precise\nPotentially lower resource use\n\nMedium accuracy\n  ↓\nBalance\n\nHigh accuracy\n  ↓\nMore precise\nPotentially more resource use\n```\n\nThe right choice depends on your feature.\n\n---\n\n## Example\n\nA weather app might only need approximate location.\n\nA navigation app may need much more precise location.\n\nYou shouldn't automatically choose maximum accuracy.\n\nAsk:\n\n> \"How accurate does my feature actually need to be?\"\n\n---\n\n# `expo-camera`\n\nCamera functionality might include:\n\n```\nCamera preview\nTaking photos\nVideo\nBarcode scanning\n```\n\nA common flow is:\n\n```\nUser taps \"Scan\"\n      ↓\nCheck camera permission\n      ↓\nRequest if needed\n      ↓\nPermission granted?\n      ↓\nShow camera\n```\n\n---\n\n# `expo-image-picker`\n\nSometimes you don't need the camera at all.\n\nYou might simply want the user to choose an existing photo.\n\nFor example:\n\n```\nProfile\n ↓\nChange photo\n ↓\nChoose from gallery\n```\n\nThat's where an image picker is useful.\n\nThe important distinction is:\n\n```\nCamera\n   ↓\nCreate new image\n\nImage picker\n   ↓\nChoose existing image\n```\n\n---\n\n# `expo-haptics`\n\nHaptics are a great example of a device feature that usually doesn't need a complicated UI.\n\nFor example:\n\n```\nimport * as Haptics from \"expo-haptics\";\n```\n\nYou can trigger feedback when something happens.\n\nConceptually:\n\n```\nUser taps button\n      ↓\nAction succeeds\n      ↓\nHaptic feedback\n      ↓\nSmall physical response\n```\n\n---\n\n# Don't overuse haptics\n\nImagine every button creates a strong vibration.\n\n```\nTap\nBUZZ\n\nTap\nBUZZ\n\nTap\nBUZZ\n\nScroll\nBUZZ\n```\n\nThat would become annoying very quickly.\n\nHaptics should support meaningful interactions.\n\nFor example:\n\n```\nSuccessful action\nImportant confirmation\nSelection\nError\n```\n\ndepending on the product design.\n\n---",
      "diagram": "```\n            Device Features\n                  │\n      ┌───────────┼────────────┐\n      ▼           ▼            ▼\n   Location     Camera       Haptics\n      │           │            │\n      ▼           ▼            ▼\n  GPS/system   Camera API   Vibration\n      │           │\n      ▼           ▼\n  Your React Native app\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Foreground location is used while the app is actively being used.\n- Background location allows location access when the app isn't actively visible, subject to platform rules.\n- Higher location accuracy can require more resources.\n- `expo-camera` is for camera functionality.\n- `expo-image-picker` is useful for choosing existing images.\n- `expo-haptics` provides tactile feedback.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Using background location when foreground location is enough\n\nAsk for the minimum access your feature actually needs.\n\n### ❌ Always requesting maximum location accuracy\n\nMore accuracy isn't always necessary.\n\n### ❌ Confusing camera and image picker\n\nOne creates new media; the other helps select existing media.\n\n---"
      ],
      "quiz": [
        {
          "question": "A delivery app only needs the user's location while they are looking at the delivery screen. Which model is generally more appropriate?",
          "options": [
            "A. Foreground location",
            "B. Background location for everything",
            "C. Contacts permission",
            "D. Camera permission"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn8-5",
      "title": "When Permission Is Denied",
      "durationMinutes": 7,
      "explanation": "This is probably the most important lesson of the day.\n\nImagine your app requests camera permission.\n\nThe user taps:\n\n```\nDon't Allow\n```\n\nWhat happens next?\n\nA beginner might write:\n\n```\nPermission denied\n```\n\nand stop.\n\nBut that's not enough.\n\nYour app needs to handle the situation.\n\n---\n\n# Permission denial is a normal user choice\n\nThe user may deny permission because:\n\n- They don't trust the app yet.\n- They don't need the feature.\n- They accidentally tapped the wrong button.\n- They don't want to provide access.\n- They want to use the app without that feature.\n\nYour application should not treat the user as having done something wrong.\n\n---\n\n# Design the denied state\n\nSuppose your screen is:\n\n```\nScan Receipt\n\n[ Scan ]\n```\n\nUser taps Scan.\n\nPermission denied.\n\nInstead of leaving the screen blank:\n\n```\n❌ Nothing happened\n```\n\nshow something useful:\n\n```\nCamera access is needed to scan\nyour receipt.\n\n[ Try Again ]\n```\n\nDepending on the platform and permission state, you may also need to guide the user to Settings.\n\n---\n\n# The \"Ask Again\" state\n\nSometimes you can request permission again.\n\nFor example:\n\n```\nCamera access wasn't granted.\n\nWould you like to try again?\n\n[ Try Again ]\n```\n\nBut you shouldn't endlessly ask:\n\n```\nNo\n↓\nAsk\n↓\nNo\n↓\nAsk\n↓\nNo\n↓\nAsk\n```\n\nThat creates a terrible experience.\n\n---\n\n# When Settings may be necessary\n\nThere are cases where the user needs to change the permission outside your app.\n\nFor example:\n\n```\nApp\n↓\nPermission denied\n↓\nSystem no longer presents a normal prompt\n↓\nUser needs to change permission\n↓\nDevice Settings\n```\n\nYour UI should explain what to do.\n\nFor example:\n\n```\nCamera access is currently disabled.\n\nTo scan receipts, enable camera access\nin your device settings.\n\n[ Open Settings ]\n```\n\nThe exact available behavior depends on the platform and permission state.\n\n---\n\n# Permission states your UI should consider\n\nA useful beginner model is:\n\n```\n┌───────────────┐\n│ Not requested │\n└───────┬───────┘\n       │\n       ▼\n  Request access\n       │\n  ┌────┴─────┐\n  ▼          ▼\nGranted     Denied\n  │          │\n  ▼          ▼\nUse        Explain\nfeature       │\n             ├── Try again\n             │\n             └── Settings\n```\n\n---\n\n# Don't hide the entire app\n\nSuppose camera permission is denied.\n\nYour entire application shouldn't necessarily become:\n\n```\nCamera permission required.\n\nNothing else works.\n```\n\nIf the camera is only needed for one feature, keep the rest of the app usable.\n\nFor example:\n\n```\nHome\n├── Scan Receipt ← unavailable\n├── History      ← works\n├── Profile      ← works\n└── Settings     ← works\n```\n\nThis is called **graceful degradation** (the app continues providing useful functionality even when some features aren't available).\n\n---\n\n## Example UI\n\n### Permission not requested\n\n```\nScan your receipt\n\n[ Scan Receipt ]\n```\n\n### Permission requested and granted\n\n```\nCamera ready\n\n[ Start Scanning ]\n```\n\n### Permission denied\n\n```\nCamera access is needed\nto scan your receipt.\n\n[ Try Again ]\n```\n\n### Settings required\n\n```\nCamera access is disabled.\n\nEnable camera access in Settings\nto use receipt scanning.\n\n[ Open Settings ]\n```\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Permission denial is a normal part of mobile UX.\n- Always design the denied state.\n- Explain what happened.\n- Give the user a reasonable next step.\n- Don't repeatedly annoy the user with permission prompts.\n- Keep the rest of the app usable when possible.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Showing an error with no action\n\n```\nPermission denied.\n```\n\nAnd nothing else.\n\nThe user doesn't know what to do.\n\n---\n\n### ❌ Asking forever\n\nRepeated permission prompts can frustrate users.\n\n---\n\n### ❌ Breaking unrelated features\n\nCamera permission should not necessarily prevent the user from viewing their profile or browsing history.\n\n---"
      ],
      "quiz": [
        {
          "question": "What should your app do after camera permission is denied?",
          "options": [
            "A. Crash",
            "B. Keep asking every second",
            "C. Explain the situation and provide an appropriate next step",
            "D. Delete the camera feature permanently"
          ],
          "correctIndex": 2,
          "explanation": "**Answer:** C"
        }
      ]
    },
    {
      "id": "rn8-6",
      "title": "Continuous Location Tracking and Cleanup",
      "durationMinutes": 8,
      "explanation": "A one-time location request answers: `Where is the device now?` Continuous tracking answers: `How does the device position change over time?`\n\nWith `expo-location`, `watchPositionAsync` registers a native location subscription. The callback receives updates until you remove that subscription.\n\n```text\nScreen mounts\n     ↓\nPermission granted\n     ↓\nStart location subscription\n     ↓\nReceive coordinate updates\n     ↓\nScreen unmounts\n     ↓\nRemove subscription\n```\n\nAlways remove the watcher in the `useEffect` cleanup function. Otherwise the GPS can continue consuming battery and callbacks can keep running after the screen is gone.\n\nChoose `accuracy`, `timeInterval`, and `distanceInterval` based on the feature. Turn-by-turn navigation needs different accuracy and update frequency than a nearby-store screen. More frequent, higher-accuracy updates normally consume more battery.\n\nIf continuous tracking must continue while the app is backgrounded, foreground permission is not enough. Background location needs separate platform configuration, permission, user explanation, and store-policy justification.",
      "diagram": "Mount → Request permission → Subscribe → Receive updates\n                                      │\nUnmount → Cleanup → Remove subscription",
      "codeExample": {
        "title": "Subscribe to location updates and clean up",
        "code": "import { useEffect } from \"react\";\nimport * as Location from \"expo-location\";\n\nuseEffect(() => {\n  let subscription: Location.LocationSubscription | undefined;\n\n  async function startTracking() {\n    const permission = await Location.requestForegroundPermissionsAsync();\n    if (!permission.granted) return;\n\n    subscription = await Location.watchPositionAsync(\n      {\n        accuracy: Location.Accuracy.Balanced,\n        distanceInterval: 10,\n      },\n      (position) => {\n        console.log(position.coords);\n      },\n    );\n  }\n\n  void startTracking();\n\n  return () => {\n    subscription?.remove();\n  };\n}, []);"
      },
      "keyTakeaways": [
        "Continuous location uses a subscription rather than a one-time request.",
        "Remove the subscription when the screen unmounts.",
        "Accuracy and update frequency directly affect battery usage.",
        "Background tracking requires additional permission and platform configuration."
      ],
      "commonMistakes": [
        "Starting multiple watchers without removing the previous subscription.",
        "Using the highest accuracy and fastest interval without a product reason.",
        "Assuming foreground location permission allows background tracking."
      ],
      "quiz": [
        {
          "question": "What should happen when a screen using `watchPositionAsync` unmounts?",
          "options": [
            "A. Start another watcher",
            "B. Remove the location subscription",
            "C. Request camera permission",
            "D. Clear AsyncStorage"
          ],
          "correctIndex": 1,
          "explanation": "Removing the subscription stops updates and prevents unnecessary battery use."
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What is the `expo-*` module pattern?",
      "options": [
        "A. Separate Expo packages that provide APIs for specific capabilities",
        "B. A CSS naming convention",
        "C. A navigation system",
        "D. A database system"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "When should you normally request camera permission?",
      "options": [
        "A. Immediately when the app starts",
        "B. When the user tries to use the camera feature",
        "C. Every time the screen renders",
        "D. After the user logs out"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What is foreground location?",
      "options": [
        "A. Location access while the app is actively being used",
        "B. Location access only after the phone is turned off",
        "C. Location access to contacts",
        "D. Location access without permission"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why shouldn't you always request the highest location accuracy?",
      "options": [
        "A. Higher accuracy can require more device resources and may be unnecessary",
        "B. High accuracy disables React",
        "C. High accuracy removes navigation",
        "D. High accuracy prevents images from loading"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should happen when the user denies camera permission?",
      "options": [
        "A. The app should crash",
        "B. The app should repeatedly ask until they accept",
        "C. The app should handle the denied state and provide an appropriate next step",
        "D. The app should delete itself"
      ],
      "correctIndex": 2,
      "explanation": "**Answer:** C"
    },
    {
      "question": "What does haptic feedback provide?",
      "options": [
        "A. A physical/tactile response from the device",
        "B. A new navigation stack",
        "C. A database response",
        "D. A camera preview"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "When should you normally ask for camera permission?",
      "options": [
        "A. When the app launches",
        "B. When the user tries to use a camera feature",
        "C. After every button press",
        "D. Only after the user closes the app"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "Who ultimately controls whether your app gets access to protected device functionality?",
      "options": [
        "A. Your React component",
        "B. The operating system and the user's permission choice",
        "C. Your database",
        "D. Expo Router"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "A delivery app only needs the user's location while they are looking at the delivery screen. Which model is generally more appropriate?",
      "options": [
        "A. Foreground location",
        "B. Background location for everything",
        "C. Contacts permission",
        "D. Camera permission"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What must happen to a continuous location subscription when its screen unmounts?",
      "options": [
        "A. It should be removed during cleanup",
        "B. It should start a second subscription",
        "C. It should be stored in JSON",
        "D. It should request camera permission"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "6. Self-Check — Build a Permission-Aware Camera Screen",
    "goal": "Complete the Day 8 self-check project.",
    "brief": "🎯 **Goal:** Build a screen that requests camera permission **only when the user taps \"Scan\"**, and handles granted, denied, and retry/settings states.\n\nThis exercise brings everything from today together.\n\n---\n\n# What we're building\n\nStart with:\n\n```\n┌─────────────────────────────┐\n│                             │\n│       Scan a document       │\n│                             │\n│  Use your camera to scan    │\n│  a receipt or document.     │\n│                             │\n│        [ Scan ]             │\n│                             │\n└─────────────────────────────┘\n```\n\nThe important part:\n\n> **Do not request camera permission when this screen first opens.**\n\nOnly request it when the user taps:\n\n```\n[ Scan ]\n```\n\n---\n\n# Step 1 — Install the camera package\n\nIn an Expo project, install the camera package using the package manager command recommended by Expo for your project.\n\nConceptually:\n\n```\nnpx expo install expo-camera\n```\n\nThe important idea is:\n\n```\nexpo-camera\n    ↓\nCamera API\n```\n\n---\n\n# Step 2 — Import the camera API\n\n```\nimport { useState } from \"react\";\nimport { Button, Text, View } from \"react-native\";\nimport { CameraView, useCameraPermissions } from \"expo-camera\";\n```\n\nDepending on your Expo Camera version, the available components and APIs may differ slightly.\n\nAlways check the version you're using when an API has changed.\n\n---\n\n# Step 3 — Get the permission state\n\n```\nconst [permission, requestPermission] =\n useCameraPermissions();\n```\n\nThink of this as:\n\n```\npermission\n   ↓\n\"What is the current camera permission state?\"\n\nrequestPermission\n   ↓\n\"Ask the user for camera permission.\"\n```\n\n---\n\n# Step 4 — Don't ask on startup\n\nThis is important.\n\nDon't do:\n\n```\nuseEffect(() => {\n requestPermission();\n}, []);\n```\n\nThat would request the permission as soon as the screen appears.\n\nInstead, wait for:\n\n```\nUser taps Scan\n```\n\n---\n\n# Step 5 — Create the Scan handler\n\n```\nconst handleScanPress = async () => {\n if (!permission?.granted) {\n   const result = await requestPermission();\n\n   if (!result.granted) {\n     return;\n   }\n }\n\n // Camera permission is available.\n // Continue to the camera screen.\n};\n```\n\nNow the flow is:\n\n```\nTap Scan\n  ↓\nCheck permission\n  ↓\nAlready granted?\n  │\n┌─┴──────────────┐\n│                │\nYes              No\n│                │\n▼                ▼\nContinue       Request\n                 │\n            ┌────┴────┐\n            ▼         ▼\n         Granted    Denied\n            │         │\n            ▼         ▼\n         Continue   Handle\n```\n\n---\n\n# Step 6 — Handle the denied state\n\nInstead of simply returning:\n\n```\nif (!result.granted) {\n return;\n}\n```\n\nyour UI should tell the user what happened.\n\nFor example:\n\n```\nconst [message, setMessage] = useState(\"\");\n\nconst handleScanPress = async () => {\n if (!permission?.granted) {\n   const result = await requestPermission();\n\n   if (!result.granted) {\n     setMessage(\n       \"Camera access is needed to scan documents.\"\n     );\n     return;\n   }\n }\n\n setMessage(\"\");\n};\n```\n\nNow the user gets feedback.\n\n---\n\n# Step 7 — Render the message\n\n```\n{message ? (\n <Text>{message}</Text>\n) : null}\n```\n\nSo the UI could become:\n\n```\nCamera access is needed\nto scan documents.\n\n[ Try Again ]\n```\n\n---\n\n# Step 8 — Add a retry action\n\n```\n<Button\n title=\"Try Again\"\n onPress={handleScanPress}\n/>\n```\n\nNow the user has a clear next step.\n\n---\n\n# Step 9 — Show the camera after permission\n\nOnce permission is granted, you can show the camera UI.\n\nConceptually:\n\n```\nconst [showCamera, setShowCamera] = useState(false);\n```\n\nThen:\n\n```\nconst handleScanPress = async () => {\n if (!permission?.granted) {\n   const result = await requestPermission();\n\n   if (!result.granted) {\n     setMessage(\n       \"Camera access is needed to scan documents.\"\n     );\n     return;\n   }\n }\n\n setMessage(\"\");\n setShowCamera(true);\n};\n```\n\nThen:\n\n```\nif (showCamera) {\n return (\n   <CameraView\n     style={{ flex: 1 }}\n   />\n );\n}\n```\n\n---\n\n# Complete beginner version\n\nHere's the basic idea put together:\n\n```\nimport { useState } from \"react\";\nimport { Button, Text, View } from \"react-native\";\nimport {\n CameraView,\n useCameraPermissions,\n} from \"expo-camera\";\n\nexport default function ScanScreen() {\n const [permission, requestPermission] =\n   useCameraPermissions();\n\n const [showCamera, setShowCamera] =\n   useState(false);\n\n const [message, setMessage] =\n   useState(\"\");\n\n const handleScanPress = async () => {\n   if (!permission?.granted) {\n     const result = await requestPermission();\n\n     if (!result.granted) {\n       setMessage(\n         \"Camera access is needed to scan documents.\"\n       );\n\n       return;\n     }\n   }\n\n   setMessage(\"\");\n   setShowCamera(true);\n };\n\n if (showCamera) {\n   return (\n     <CameraView\n       style={{ flex: 1 }}\n     />\n   );\n }\n\n return (\n   <View\n     style={{\n       flex: 1,\n       justifyContent: \"center\",\n       alignItems: \"center\",\n       padding: 24,\n     }}\n   >\n     <Text\n       style={{\n         fontSize: 24,\n         fontWeight: \"700\",\n         marginBottom: 12,\n       }}\n     >\n       Scan a document\n     </Text>\n\n     <Text\n       style={{\n         textAlign: \"center\",\n         marginBottom: 24,\n       }}\n     >\n       Use your camera to scan a receipt\n       or document.\n     </Text>\n\n     {message ? (\n       <Text\n         style={{\n           marginBottom: 16,\n           textAlign: \"center\",\n         }}\n       >\n         {message}\n       </Text>\n     ) : null}\n\n     <Button\n       title=\"Scan\"\n       onPress={handleScanPress}\n     />\n   </View>\n );\n}\n```\n\nThis is intentionally simple.\n\nThe goal isn't to build a production scanner yet.\n\nThe goal is to understand the **permission flow**.\n\n---\n\n# What you should test\n\nDon't test only the happy path.\n\nA **happy path** means the normal situation where everything works.\n\nTest all of these:\n\n### Test 1 — First visit\n\nOpen the screen.\n\nExpected:\n\n```\nNo permission dialog\n```\n\nThat's important.\n\n---\n\n### Test 2 — Tap Scan\n\nTap:\n\n```\nScan\n```\n\nExpected:\n\n```\nSystem permission dialog appears\n```\n\n---\n\n### Test 3 — Allow\n\nChoose:\n\n```\nAllow\n```\n\nExpected:\n\n```\nCamera opens\n```\n\n---\n\n### Test 4 — Deny\n\nReset permissions or use a fresh install, then tap Scan.\n\nChoose:\n\n```\nDon't Allow\n```\n\nExpected:\n\n```\nCamera does not open.\n\nApp explains why access is needed.\n```\n\n---\n\n### Test 5 — Try Again\n\nTap:\n\n```\nTry Again\n```\n\nExpected:\n\n```\nPermission flow is handled appropriately\nfor the current OS permission state.\n```\n\n---\n\n### Test 6 — Change permission in Settings\n\nDisable camera access through the device settings.\n\nReturn to the app.\n\nTry:\n\n```\nScan\n```\n\nYour app should detect the current permission state instead of assuming that the original decision is still valid.\n\n---",
    "steps": [],
    "acceptance": [],
    "footer": "# 🧠 Day 8 Mental Model\n\nHere's the most important diagram from today's lesson:\n\n```\n                   User\n                    │\n                    ▼\n             Taps \"Scan\"\n                    │\n                    ▼\n            Check permission\n                    │\n         ┌──────────┴──────────┐\n         │                     │\n     Granted                Not granted\n         │                     │\n         ▼                     ▼\n   Open camera          Request permission\n                               │\n                      ┌────────┴────────┐\n                      │                 │\n                   Granted            Denied\n                      │                 │\n                      ▼                 ▼\n                 Open camera      Explain state\n                                        │\n                               ┌────────┴────────┐\n                               │                 │\n                           Try Again          Settings\n```\n\nAnd the bigger architecture looks like:\n\n```\nYour React Native App\n       │\n       ▼\n  Expo Module\n       │\n       ▼\niOS / Android API\n       │\n       ▼\nPermission System\n       │\n       ▼\nUser Decision\n       │\n  ┌────┴────┐\n  ▼         ▼\nAllow      Deny\n  │         │\n  ▼         ▼\nFeature    Fallback UI\nworks      / retry / settings\n```\n\n---\n\n# 🎯 What You Should Understand After Day 8\n\nBy the end of this lesson, you should be comfortable explaining this:\n\n> **\"How does a React Native app access the camera?\"**\n\nYou should be able to say:\n\n```\nMy React Native code\n      ↓\nexpo-camera\n      ↓\nNative camera APIs\n      ↓\nOperating system permission\n      ↓\nUser grants access\n      ↓\nCamera feature becomes available\n```\n\nAnd you should understand that the flow isn't:\n\n```\nInstall package\n    ↓\nCamera automatically works\n```\n\nIt's:\n\n```\nInstall API\n    ↓\nBuild the feature\n    ↓\nAsk for permission at the right moment\n    ↓\nCheck the result\n    ↓\nHandle granted\n    ↓\nHandle denied\n    ↓\nHandle retry/settings when necessary\n```\n\nThe biggest lesson from Day 8 is:"
  }
});
