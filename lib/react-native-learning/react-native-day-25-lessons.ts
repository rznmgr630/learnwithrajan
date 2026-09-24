import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_25_LESSONS = normalizePastedLessonDay({
  "day": 25,
  "title": "Android Fundamentals for React Native Developers",
  "overview": "📖 **4 lessons**\n\nToday we're doing the Android equivalent of Day 24.\n\nYou already know that React Native is not just JavaScript running in a browser-like environment.\n\nOn Android, your React Native application is also a real native application:\n\n```\nReact Native\n    ↓\n   android/\n    ↓\nAndroid project\n    ↓\nKotlin / Java + Android APIs\n    ↓\nAndroid OS\n```\n\nThe goal today isn't to become an Android developer.\n\nIt's to understand enough of the Android project that you can confidently work with:\n\n- Gradle\n- `AndroidManifest.xml`\n- `MainActivity`\n- `MainApplication`\n- Kotlin\n- Build variants\n- Signing\n- Keystores\n- AAB files\n- `adb logcat`\n- ANRs\n\nBy the end of today, `android/` should feel much less mysterious.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn25-1",
      "title": "Gradle and the Android project structure",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nWhen you create a React Native application, you get an Android project alongside your JavaScript code.\n\nA typical structure looks roughly like:\n\n```\nandroid/\n├── app/\n│   ├── build.gradle\n│   └── src/\n│       └── main/\n│           ├── AndroidManifest.xml\n│           ├── java/\n│           └── res/\n│\n├── build.gradle\n├── gradle.properties\n├── settings.gradle\n└── gradlew\n```\n\nThe exact structure varies between React Native and Android Gradle Plugin versions, but these are the files you'll commonly encounter.\n\nThe first thing to understand is:\n\n> Gradle is the build system that turns your Android project and its dependencies into an installable application.\n\nConceptually:\n\n```\nYour source code\n    ↓\nGradle\n    ↓\nCompile\n    ↓\nPackage\n    ↓\nSign\n    ↓\nAPK / AAB\n```\n\n---\n\n# What is Gradle?\n\nGradle is a build automation system.\n\nIt handles things like:\n\n```\nDependencies\nCompilation\nBuild variants\nResource processing\nCode generation\nPackaging\nSigning\nTesting\n```\n\nFor a React Native developer, you can think of it as the Android equivalent of the machinery that takes your project and produces the application.\n\nYou might run:\n\n```\ncd android\n./gradlew assembleDebug\n```\n\nand Gradle will coordinate the work needed to produce a debug build.\n\n---\n\n# What is `android/build.gradle`?\n\nThe top-level Gradle configuration controls settings that apply to the broader Android project.\n\nDepending on the current project structure and Gradle version, you may see configuration related to:\n\n```\nAndroid Gradle Plugin\nRepositories\nBuild configuration\nPlugins\nShared project settings\n```\n\nThink:\n\n```\nandroid/build.gradle\n      ↓\nAndroid project-level configuration\n```\n\nIt isn't the configuration for one particular app screen or activity.\n\nIt's the higher-level build configuration.\n\n---\n\n# What is `app/build.gradle`?\n\nNow look at:\n\n```\nandroid/app/build.gradle\n```\n\nThis is much more directly related to your actual Android application module.\n\nYou may find configuration for things such as:\n\n```\nApplication ID\nMinimum SDK\nTarget SDK\nDependencies\nBuild types\nSigning configurations\nVersion information\n```\n\nConceptually:\n\n```\nandroid/build.gradle\n      ↓\nProject-level configuration\n\nandroid/app/build.gradle\n      ↓\nApplication module configuration\n```\n\nThat's an important distinction.\n\n---\n\n# Application ID\n\nYou may see something like:\n\n```\nandroid {\n  defaultConfig {\n      applicationId \"com.example.myapp\"\n  }\n}\n```\n\nThe application ID identifies your Android application package.\n\nFor example:\n\n```\ncom.example.myapp\n```\n\nGoogle Play and Android use this identity to distinguish your application.\n\nChanging it is not a casual change.\n\nIt can effectively identify a different application from the one you previously published.\n\n---\n\n# Dependencies\n\nYou may also see:\n\n```\ndependencies {\n  implementation(...)\n}\n```\n\nThis is where Android dependencies can be declared.\n\nConceptually:\n\n```\nReact Native app\n    ↓\nNative dependency\n    ↓\nGradle\n    ↓\nAndroid library\n```\n\nThis is one reason native Android build failures can look intimidating.\n\nYour JavaScript can be completely fine while Gradle fails because of a native dependency or build configuration.\n\n---\n\n# Android Gradle Plugin\n\nYou'll also encounter the **Android Gradle Plugin**, usually abbreviated **AGP**.\n\nAGP connects Android's build tooling with Gradle.\n\nThink:\n\n```\nGradle\n +\nAndroid Gradle Plugin\n ↓\nAndroid build\n```\n\nFor the current React Native/Android toolchain, **AGP 9 is a major baseline to understand**, and current React Native releases are moving toward **Kotlin 2.0+** as part of the modern Android toolchain.\n\nThe exact supported versions depend on the React Native version you're using, so when upgrading RN, always check that release's Android requirements rather than assuming every project can immediately use the newest Android tooling.\n\n---\n\n# What is `gradle.properties`?\n\nYou may also encounter:\n\n```\nandroid/gradle.properties\n```\n\nThis can contain Gradle and Android build configuration.\n\nFor example:\n\n```\norg.gradle.jvmargs=...\n```\n\nIt can also contain React Native or Android-specific build settings.\n\nThe important thing is:\n\n> Don't treat every Gradle file as interchangeable.\n\nDifferent files operate at different levels of the build.\n\n---\n\n# The Android build mental model\n\nThink about the structure like this:\n\n```\nandroid/\n│\n├── build.gradle\n│      ↓\n│   Project-level build configuration\n│\n├── app/\n│   └── build.gradle\n│          ↓\n│      Application configuration\n│\n├── settings.gradle\n│      ↓\n│   Project/modules/dependency setup\n│\n└── gradle.properties\n     ↓\n  Gradle/build settings\n```\n\nThe exact syntax may change as Android's Gradle tooling evolves, but this mental model remains useful.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Gradle is Android's build automation system.\n- `android/build.gradle` contains higher-level project configuration.\n- `android/app/build.gradle` configures the application module.\n- `dependencies` define native libraries used by the Android project.\n- `applicationId` identifies the Android application.\n- AGP connects Android's build tooling with Gradle.\n- Current Android/RN projects use a rapidly evolving Gradle and Kotlin toolchain, so check your RN version's supported versions when upgrading."
      ],
      "commonMistakes": [
        "### Mistake 1: Editing the wrong Gradle file\n\nAlways ask:\n\n```\nIs this project-level configuration\nor application-module configuration?\n```\n\n### Mistake 2: Treating Gradle as \"just dependency installation\"\n\nGradle does much more than download libraries.\n\nIt controls major parts of the Android build process.\n\n### Mistake 3: Randomly upgrading AGP\n\nAGP, Gradle, Kotlin, Java, and React Native versions can have compatibility requirements.\n\nDon't upgrade one piece blindly.\n\n### Mistake 4: Assuming a JavaScript error causes every Android build error\n\nBuild failures can happen entirely before your JavaScript runs."
      ],
      "quiz": [
        {
          "question": "What is `android/app/build.gradle` primarily responsible for?",
          "options": [
            "A. React component rendering",
            "B. Application-module build configuration",
            "C. Managing Metro",
            "D. Storing JavaScript dependencies"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn25-2",
      "title": "AndroidManifest, MainActivity, and MainApplication",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nNow let's look at the files that describe the Android application itself.\n\nThe two names you should become very familiar with are:\n\n```\nAndroidManifest.xml\nMainActivity\nMainApplication\n```\n\nThese are central to understanding where React Native fits into Android.\n\n---\n\n# What is `AndroidManifest.xml`?\n\nThe manifest tells Android important information about your application.\n\nYou may find it at:\n\n```\nandroid/app/src/main/AndroidManifest.xml\n```\n\nIt can describe things such as:\n\n```\nPermissions\nActivities\nServices\nReceivers\nIntent filters\nApplication configuration\nDeep links\n```\n\nThink of it as an important declaration of:\n\n> \"What is this Android application, and what Android components does it use?\"\n\n---\n\n# Permissions\n\nSuppose your application needs internet access.\n\nYou might see:\n\n```\n<uses-permission android:name=\"android.permission.INTERNET\" />\n```\n\nFor camera access:\n\n```\n<uses-permission android:name=\"android.permission.CAMERA\" />\n```\n\nThe manifest declares the permission.\n\nFor permissions that require runtime approval, the application may also need to request that permission while running.\n\nSo, similar to iOS:\n\n```\nManifest declaration\n      ↓\nPermission is declared\n\nRuntime request\n      ↓\nUser grants/denies it\n```\n\nDon't confuse those two steps.\n\n---\n\n# Activities\n\nAndroid applications are made up of different native components.\n\nOne important component is an:\n\n```\nActivity\n```\n\nAn Activity represents a UI entry point/screen container in the Android application lifecycle.\n\nA React Native application normally has a main Activity responsible for hosting the React Native UI.\n\n---\n\n# MainActivity\n\nYou'll typically encounter something like:\n\n```\nMainActivity.kt\n```\n\nThis is the main Android Activity for your application.\n\nConceptually:\n\n```\nAndroid launches app\n     ↓\nMainActivity\n     ↓\nReact Native\n     ↓\nJavaScript application\n```\n\nThe exact implementation depends on the React Native version and architecture.\n\nBut the mental model is what matters.\n\n---\n\n# Where does React Native hook into Android?\n\nConceptually:\n\n```\nAndroid OS\n  ↓\nMainActivity\n  ↓\nReact Native infrastructure\n  ↓\nReact Native runtime\n  ↓\nJavaScript\n```\n\nSo if something needs to happen around the Android application's Activity lifecycle, `MainActivity` can become relevant.\n\nFor example:\n\n```\nActivity created\nActivity resumed\nActivity paused\nActivity destroyed\n```\n\nNative integrations sometimes need to respond to these lifecycle events.\n\n---\n\n# MainApplication\n\nYou'll also encounter:\n\n```\nMainApplication.kt\n```\n\nThis represents the Android application's native application-level setup.\n\nThink of the distinction like this:\n\n```\nMainApplication\n      ↓\nApplication-wide initialization\n\nMainActivity\n      ↓\nUI / Activity lifecycle\n```\n\nThe exact React Native implementation varies across versions, but the distinction is useful.\n\n---\n\n# A simple mental model\n\nThink:\n\n```\nAndroidApplication\n     │\n     ├── MainApplication\n     │       ↓\n     │   App-level setup\n     │\n     └── MainActivity\n             ↓\n         UI lifecycle\n             ↓\n        React Native\n```\n\nThis is roughly analogous to the relationship you saw on iOS with:\n\n```\nAppDelegate\n```\n\n---\n\n# Intent filters\n\nNow let's talk about one of the most useful Android concepts for RN developers:\n\n```\nIntent filters\n```\n\nAn **Intent** is Android's way of describing an action or request between application components.\n\nAn Activity can declare that it knows how to handle certain intents.\n\nAn intent filter tells Android:\n\n> \"This component can respond to this kind of intent.\"\n\n---\n\n# Deep links\n\nThis becomes especially important for deep linking.\n\nImagine your app supports:\n\n```\nmyapp://profile/123\n```\n\nAndroid can be configured to associate that URL pattern with your Activity.\n\nConceptually:\n\n```\nUser taps link\n     ↓\nAndroid receives intent\n     ↓\nIntent filter matches\n     ↓\nMainActivity\n     ↓\nReact Native\n     ↓\nNavigation\n     ↓\nProfile screen\n```\n\nThis is the native half of deep linking.\n\nReact Navigation or another JS navigation system then handles the application-level routing.\n\n---\n\n# App links\n\nAndroid also supports HTTP/HTTPS-based deep linking through mechanisms such as Android App Links.\n\nFor example:\n\n```\nhttps://example.com/profile/123\n```\n\ncan potentially open your application rather than simply opening a browser.\n\nThe important thing for today is understanding the layers:\n\n```\nURL\n↓\nAndroid intent\n↓\nManifest configuration\n↓\nActivity\n↓\nReact Native\n↓\nJS navigation\n```\n\n---\n\n# Why the Manifest matters to RN developers\n\nA JavaScript developer might think:\n\n```\n\"I added deep linking in React Navigation.\nWhy doesn't the app open from a URL?\"\n```\n\nBecause there may be a native Android configuration problem.\n\nThe complete feature can involve:\n\n```\nJavaScript configuration\n+\nAndroidManifest\n+\nIntent filters\n+\nNative Activity\n```\n\nThis is exactly why understanding the native project matters.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `AndroidManifest.xml` declares important information about the Android application.\n- Permissions are declared in the manifest.\n- Some permissions also require runtime requests.\n- `MainActivity` is the main Activity hosting the React Native UI.\n- `MainApplication` handles application-level native setup.\n- Intent filters tell Android which intents a component can handle.\n- Deep linking often involves both native Android configuration and JavaScript navigation."
      ],
      "commonMistakes": [
        "### Mistake 1: Thinking the manifest grants every permission\n\nSome permissions require runtime approval.\n\n### Mistake 2: Treating deep linking as purely a JavaScript feature\n\nAndroid needs to know how to route the incoming intent.\n\n### Mistake 3: Confusing MainActivity and MainApplication\n\nRemember:\n\n```\nMainApplication\n→ application-level setup\n\nMainActivity\n→ Activity/UI lifecycle\n```\n\n### Mistake 4: Editing the manifest without understanding the component\n\nEvery `<activity>`, permission, or intent filter has a specific role."
      ],
      "quiz": [
        {
          "question": "What is the purpose of an intent filter?",
          "options": [
            "A. Store JavaScript state",
            "B. Tell Android what kinds of intents a component can handle",
            "C. Compile Kotlin",
            "D. Sign the application"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn25-3",
      "title": "Kotlin, build variants, signing, and AABs",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nNow let's look at two things you'll encounter constantly when working with Android native code:\n\n```\nKotlin\n```\n\nand:\n\n```\nBuild configuration\n```\n\nYou don't need to become a Kotlin expert.\n\nYou need enough Kotlin to read and make small changes to native modules.\n\n---\n\n# Kotlin basics\n\nA variable can look like:\n\n```\nval name = \"Alex\"\nvar count = 0\n```\n\nSimilar to Swift:\n\n```\nval\n→ value shouldn't be reassigned\n\nvar\n→ value can change\n```\n\nYou'll see both frequently.\n\n---\n\n# Functions\n\nA Kotlin function might look like:\n\n```\nfun greet(name: String): String {\n  return \"Hello $name\"\n}\n```\n\nRead it as:\n\n```\nFunction: greet\n\nInput:\nname → String\n\nOutput:\nString\n```\n\n---\n\n# Nullable values\n\nKotlin has explicit nullability.\n\nYou might see:\n\n```\nvar name: String? = null\n```\n\nThe `?` means:\n\n```\nname can be a String\nor\nname can be null\n```\n\nYou may see:\n\n```\nif (name != null) {\n  println(name)\n}\n```\n\nor:\n\n```\nval length = name?.length\n```\n\nThe `?.` means roughly:\n\n```\nIf name exists,\naccess length.\n\nOtherwise:\nreturn null.\n```\n\n---\n\n# Classes\n\nYou might see:\n\n```\nclass MyModule {\n  fun doSomething() {\n      // ...\n  }\n}\n```\n\nThis is simply a class containing a method.\n\nNative modules frequently use classes.\n\n---\n\n# Lambdas\n\nKotlin uses lambdas heavily.\n\nFor example:\n\n```\ndoSomething { result ->\n  println(result)\n}\n```\n\nYou can read this as:\n\n```\nCall doSomething,\nand when the result arrives,\nrun this code.\n```\n\n---\n\n# `if` and `when`\n\nYou'll obviously encounter normal conditions:\n\n```\nif (enabled) {\n  start()\n}\n```\n\nKotlin also has:\n\n```\nwhen (state) {\n  \"loading\" -> showLoading()\n  \"success\" -> showSuccess()\n  else -> showError()\n}\n```\n\nYou don't need more language features than this to begin reading many native RN modules.\n\n---\n\n# Build variants\n\nNow let's move into Android builds.\n\nYour application isn't just:\n\n```\nAndroid app\n```\n\nYou can have different versions of the application.\n\nCommon variants include:\n\n```\ndebug\nrelease\n```\n\n---\n\n# Debug build\n\nA debug build is designed for development.\n\nConceptually:\n\n```\nDebug\n↓\nDevelopment\n↓\nDebugging\n↓\nLocal testing\n```\n\nIt usually has development-oriented configuration and isn't the build you publish to Google Play.\n\nYou might run:\n\n```\ncd android\n./gradlew assembleDebug\n```\n\n---\n\n# Release build\n\nA release build is intended for distribution.\n\nConceptually:\n\n```\nRelease\n↓\nProduction\n↓\nOptimized\n↓\nSigned\n↓\nDistribution\n```\n\nYou need to be more careful with release configuration because this is what users ultimately receive.\n\n---\n\n# Build types vs variants\n\nA build type is something like:\n\n```\ndebug\nrelease\n```\n\nA build variant is the actual combination of build configuration dimensions used to produce a particular artifact.\n\nIn a simple project:\n\n```\ndebug\nrelease\n```\n\nmay be the only variants you notice.\n\nIn a larger application you might have:\n\n```\nfreeDebug\nfreeRelease\nenterpriseDebug\nenterpriseRelease\n```\n\nThis becomes useful when you have multiple environments or product flavors.\n\n---\n\n# Signing\n\nAndroid applications need to be signed.\n\nThis proves that an application was signed using the expected signing identity and allows Android/Google Play to establish continuity of the application identity.\n\nFor a production application, you will typically use a release signing key.\n\nThis is where the:\n\n```\nkeystore\n```\n\ncomes in.\n\n---\n\n# What is a keystore?\n\nA keystore is a file/container used to store cryptographic keys and certificates used for signing.\n\nYou might create one using tools such as:\n\n```\nkeytool\n```\n\nThe important part isn't memorizing the command.\n\nUnderstand the purpose:\n\n```\nYour source code\n    ↓\nBuild\n    ↓\nRelease artifact\n    ↓\nSigning key\n    ↓\nSigned application\n```\n\n---\n\n# Why protect the signing key?\n\nImagine you publish:\n\n```\nMyApp\n```\n\nto Google Play.\n\nYour release signing identity establishes continuity for updates.\n\nYou don't want an attacker to obtain the credentials needed to sign malicious versions as if they were legitimate releases from you.\n\nSo your signing credentials should be treated as sensitive production secrets.\n\nDo not commit private signing keys or their passwords into Git.\n\n---\n\n# Signing configuration\n\nYour Gradle configuration may contain something conceptually like:\n\n```\nsigningConfigs {\n  release {\n      storeFile ...\n      storePassword ...\n      keyAlias ...\n      keyPassword ...\n  }\n}\n```\n\nThe exact configuration depends on how your project manages secrets.\n\nThe fields mean roughly:\n\n```\nstoreFile\n→ Where is the keystore?\n\nstorePassword\n→ How do we unlock the keystore?\n\nkeyAlias\n→ Which key inside the keystore?\n\nkeyPassword\n→ How do we unlock that key?\n```\n\nThese values protect access to the signing identity.\n\nFor production projects, passwords should generally come from secure environment/configuration mechanisms rather than being committed directly to source control.\n\n---\n\n# What is an AAB?\n\nAn **Android App Bundle**, or **AAB**, is the publishing format used by Google Play.\n\nThe file looks like:\n\n```\nMyApp-release.aab\n```\n\nYou can build one with Gradle using the appropriate release bundle task, commonly:\n\n```\ncd android\n./gradlew bundleRelease\n```\n\nThe output is typically under:\n\n```\nandroid/app/build/outputs/bundle/release/\n```\n\nThe exact path can vary by project configuration.\n\n---\n\n# AAB vs APK\n\nAn APK is an installable Android application package.\n\nAn AAB is a publishing bundle.\n\nConceptually:\n\n```\nAPK\n↓\nInstallable package\n```\n\nwhile:\n\n```\nAAB\n↓\nUpload to Google Play\n↓\nGoogle Play generates optimized APKs\n↓\nUsers receive what their device needs\n```\n\nThat's one reason the AAB format matters.\n\n---\n\n# The release pipeline\n\nYou should be able to visualize the process:\n\n```\nReact Native source\n     ↓\nAndroid Gradle build\n     ↓\nRelease configuration\n     ↓\nCompile/package\n     ↓\nSign\n     ↓\nAAB\n     ↓\nGoogle Play\n     ↓\nDevice-specific delivery\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Kotlin is the primary language you'll encounter in modern Android native RN code.\n- Learn enough Kotlin to read variables, functions, nullability, classes, and lambdas.\n- Debug and release are different build types.\n- Larger projects can have multiple build variants.\n- Release applications need signing.\n- A keystore contains signing credentials.\n- Signing credentials are sensitive and should be protected.\n- An AAB is the Android App Bundle used for Google Play publishing.\n- Google Play uses the bundle to generate optimized APKs for users' devices."
      ],
      "commonMistakes": [
        "### Mistake 1: Committing the release keystore\n\nDon't put production signing credentials into your Git repository.\n\n### Mistake 2: Treating debug and release as identical\n\nThey can have different:\n\n```\nSigning\nConfiguration\nOptimization\nEnvironment values\nDependencies\n```\n\n### Mistake 3: Confusing APK and AAB\n\nRemember:\n\n```\nAPK\n→ installable package\n\nAAB\n→ publishing bundle\n```\n\n### Mistake 4: Losing the production signing credentials\n\nSigning credentials are part of the application's release identity.\n\nTreat them accordingly."
      ],
      "quiz": [
        {
          "question": "What is an AAB?",
          "options": [
            "A. Android Activity Builder",
            "B. Android App Bundle",
            "C. Android Build Binary",
            "D. Android Browser Bundle"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn25-4",
      "title": "adb logcat and basic ANR diagnosis",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nWe've looked at how to read native logs on iOS.\n\nAndroid has its own extremely useful tool:\n\n```\nadb logcat\n```\n\n`adb` stands for:\n\n**Android Debug Bridge**\n\nIt lets your development machine communicate with an Android device or emulator.\n\n---\n\n# What can adb do?\n\nYou can use `adb` for things like:\n\n```\nInstalling applications\nLaunching applications\nReading logs\nInspecting devices\nRunning shell commands\nDebugging\n```\n\nFor today's lesson, the most important command is:\n\n```\nadb logcat\n```\n\nThis displays Android system and application logs.\n\n---\n\n# Reading logcat\n\nYou may see output from many different processes:\n\n```\nAndroid system\nReact Native\nYour application\nThird-party SDKs\nOther services\n```\n\nThat's why raw `logcat` output can feel overwhelming.\n\nThe skill isn't memorizing every log.\n\nIt's learning how to find the relevant process, tag, exception, or timestamp.\n\n---\n\n# Logging from Kotlin\n\nYou may encounter:\n\n```\nLog.d(\"MyModule\", \"Module initialized\")\n```\n\nThis produces a debug log.\n\nYou might also see:\n\n```\nLog.e(\"MyModule\", \"Something failed\")\n```\n\nfor an error.\n\nThen:\n\n```\nadb logcat\n```\n\ncan show those messages.\n\n---\n\n# A useful debugging flow\n\nSuppose JavaScript calls:\n\n```\nNativeModule.start()\n```\n\nbut nothing works.\n\nTrace:\n\n```\nJavaScript\n  ↓\nNative Module\n  ↓\nKotlin\n  ↓\nAndroid API\n```\n\nAsk:\n\n```\nDid JS call the method?\n\nDid Kotlin receive it?\n\nDid the native API execute?\n\nDid the API return an error?\n\nDid Android kill or crash the process?\n```\n\nLogs can answer these questions.\n\n---\n\n# What is an ANR?\n\nANR stands for:\n\n**Application Not Responding**\n\nAn ANR happens when Android determines that an application is not responding to important input or system events within the expected time.\n\nA common cause is blocking the main/UI thread.\n\nFor example, imagine:\n\n```\nfun doSomething() {\n  // Very expensive operation\n  // running on the main thread\n}\n```\n\nIf that work takes too long, the application may stop responding.\n\nConceptually:\n\n```\nMain/UI thread\n    ↓\nLong blocking operation\n    ↓\nUI can't respond\n    ↓\nAndroid detects problem\n    ↓\nANR\n```\n\n---\n\n# Why does the main thread matter?\n\nThe Android main thread is responsible for important application/UI work.\n\nYou don't want to perform huge blocking operations there.\n\nFor example, avoid doing something like:\n\n```\nMain thread\n  ↓\nDownload huge file\n  ↓\nProcess huge dataset\n  ↓\nWait for slow network\n  ↓\nUI freezes\n```\n\nInstead, expensive work should generally be moved to an appropriate background mechanism.\n\nThe exact solution depends on the work:\n\n```\nCoroutines\nExecutors\nWorkManager\nNative asynchronous APIs\n```\n\nThe important lesson today is simply:\n\n> Don't block the main thread with long-running work.\n\n---\n\n# How do you diagnose an ANR?\n\nStart with:\n\n```\n1. Reproduce the problem\n```\n\nThen:\n\n```\n2. Look at logcat\n```\n\nLook for:\n\n```\nANR\nApplication Not Responding\nmain thread\nblocked\n```\n\nThen ask:\n\n```\nWhat was the main thread doing?\n```\n\nYou may find that your code was:\n\n```\nWaiting\nLooping\nDoing expensive computation\nPerforming synchronous I/O\nWaiting for another lock/thread\n```\n\n---\n\n# ANR vs crash\n\nThese are different.\n\n### Crash\n\nThe application terminates unexpectedly.\n\n```\nApp\n↓\nException / fatal error\n↓\nProcess dies\n```\n\n### ANR\n\nThe application remains alive but stops responding appropriately.\n\n```\nApp\n↓\nMain thread blocked\n↓\nUI stops responding\n↓\nAndroid detects unresponsiveness\n↓\nANR\n```\n\nThat's an important distinction.\n\n---\n\n# Native Android debugging mental model\n\nWhen an Android problem occurs, think:\n\n```\nIs this JavaScript?\n     ↓\nIs React Native involved?\n     ↓\nDid the native module receive the call?\n     ↓\nDid Kotlin/Java execute?\n     ↓\nDid Android API fail?\n     ↓\nDid the app crash?\n     ↓\nOr is the app simply blocked?\n```\n\nIf it's blocked rather than crashed, start thinking about:\n\n```\nANR\nMain thread\nBlocking operations\nThreading\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `adb` is the Android Debug Bridge.\n- `adb logcat` is one of your most important native debugging tools.\n- Android logs can contain messages from many processes, so filtering and finding the relevant output matters.\n- An ANR means Android detected that the application wasn't responding.\n- Blocking the main thread is a common cause of ANRs.\n- A crash and an ANR are different problems.\n- Native debugging is about tracing the path from JavaScript to Kotlin/Java to Android."
      ],
      "commonMistakes": [
        "### Mistake 1: Assuming an ANR is a crash\n\nThe application may still be running but unable to respond.\n\n### Mistake 2: Doing expensive work on the main thread\n\nLong-running work can freeze the UI.\n\n### Mistake 3: Reading every log line\n\nFocus on:\n\n```\nYour process\nRelevant tags\nExceptions\nANR messages\nTimestamps\n```\n\n### Mistake 4: Only checking Metro\n\nAndroid native problems may only appear in `logcat`."
      ],
      "quiz": [
        {
          "question": "What does ANR stand for?",
          "options": [
            "A. Android Native Runtime",
            "B. Application Not Responding",
            "C. Android Network Request",
            "D. Application Native Renderer"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What is `android/app/build.gradle` primarily responsible for?",
      "options": [
        "A. React component rendering",
        "B. Application-module build configuration",
        "C. Managing Metro",
        "D. Storing JavaScript dependencies"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What is the purpose of an intent filter?",
      "options": [
        "A. Store JavaScript state",
        "B. Tell Android what kinds of intents a component can handle",
        "C. Compile Kotlin",
        "D. Sign the application"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What is an AAB?",
      "options": [
        "A. Android Activity Builder",
        "B. Android App Bundle",
        "C. Android Build Binary",
        "D. Android Browser Bundle"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What does ANR stand for?",
      "options": [
        "A. Android Native Runtime",
        "B. Application Not Responding",
        "C. Android Network Request",
        "D. Application Native Renderer"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What does Gradle manage in an Android project?",
      "options": [
        "A. Build configuration and dependencies",
        "B. React component state",
        "C. iOS entitlements",
        "D. OAuth redirects only"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Where are Android permissions and application components declared?",
      "options": [
        "A. AndroidManifest.xml",
        "B. Info.plist",
        "C. Podfile",
        "D. tsconfig.json"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is the role of MainActivity?",
      "options": [
        "A. It hosts the React Native Android activity",
        "B. It stores refresh tokens",
        "C. It publishes npm modules",
        "D. It configures iOS signing"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is an AAB?",
      "options": [
        "A. An Android App Bundle used for distribution",
        "B. An iOS archive",
        "C. A JavaScript cache",
        "D. A query key"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What can adb logcat help diagnose?",
      "options": [
        "A. Native Android logs and crashes",
        "B. TypeScript route errors",
        "C. CocoaPods versions",
        "D. App Store signing"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is an ANR?",
      "options": [
        "A. An Application Not Responding condition",
        "B. A native route",
        "C. An npm release",
        "D. An authentication refresh"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Self-Check — Build and Sign a Release AAB",
    "goal": "Build and Sign a Release AAB",
    "brief": "Now let's put everything together.\n\nYour goal today is to generate a **release Android App Bundle** using your own signing key.\n\nYou don't need to upload it to Google Play.\n\nThe goal is to understand the complete release pipeline.\n\n---\n\n# Step 1 — Inspect your Android project\n\nOpen:\n\n```\nandroid/\n```\n\nFind:\n\n```\nandroid/build.gradle\nandroid/app/build.gradle\nandroid/gradle.properties\nAndroidManifest.xml\nMainActivity\nMainApplication\n```\n\nTry to explain the purpose of each.\n\nYou should be able to say:\n\n```\nbuild.gradle\n→ project/build configuration\n\napp/build.gradle\n→ application-module configuration\n\nAndroidManifest.xml\n→ Android application declarations\n\nMainActivity\n→ Activity/UI lifecycle\n\nMainApplication\n→ application-level setup\n```\n\n---\n\n# Step 2 — Create your own keystore\n\nIf you don't already have a development/release keystore for this exercise, create one using `keytool`.\n\nFor example:\n\n```\nkeytool -genkeypair \\\n -v \\\n -storetype PKCS12 \\\n -keystore my-release-key.keystore \\\n -alias my-key \\\n -keyalg RSA \\\n -keysize 2048 \\\n -validity 10000\n```\n\nThe exact command and key-management strategy you use for a real production application may differ.\n\nFor this exercise, the important thing is understanding what you've created.\n\nYou now have:\n\n```\nKeystore\n  ↓\nContains signing key\n  ↓\nUsed to sign release application\n```\n\n**Do not commit this keystore to Git.**\n\n---\n\n# Step 3 — Understand the signing fields\n\nYour release signing configuration may conceptually contain:\n\n```\nstoreFile\nstorePassword\nkeyAlias\nkeyPassword\n```\n\nExplain each one:\n\n### `storeFile`\n\nWhere is the keystore?\n\n```\nstoreFile\n  ↓\nFind the keystore containing the key\n```\n\n### `storePassword`\n\nHow do you unlock the keystore?\n\n```\nstorePassword\n  ↓\nProtects access to the keystore\n```\n\n### `keyAlias`\n\nWhich key inside the keystore should be used?\n\n```\nkeyAlias\n  ↓\nSelects the signing key\n```\n\n### `keyPassword`\n\nHow do you unlock that particular key?\n\n```\nkeyPassword\n  ↓\nProtects the selected signing key\n```\n\nThe important security idea is:\n\n```\nKeystore\n  ↓\nProtected container\n\nAlias\n  ↓\nSelects a key\n\nPasswords\n  ↓\nProtect access to the signing material\n```\n\n---\n\n# Step 4 — Configure release signing safely\n\nConnect your keystore to the release build.\n\nFor a real project, don't hard-code production passwords directly into source control.\n\nInstead, use an appropriate secure mechanism such as:\n\n```\nEnvironment variables\nGradle properties outside Git\nCI/CD secrets\nSecret-management systems\n```\n\nYour source repository should not contain your production signing secrets.\n\n---\n\n# Step 5 — Build the release AAB\n\nFrom your project:\n\n```\ncd android\n./gradlew bundleRelease\n```\n\nGradle will go through roughly this process:\n\n```\nReact Native project\n      ↓\nGradle\n      ↓\nCompile\n      ↓\nProcess resources\n      ↓\nPackage\n      ↓\nRelease configuration\n      ↓\nSign\n      ↓\nAAB\n```\n\nLook for the generated bundle under a path similar to:\n\n```\nandroid/app/build/outputs/bundle/release/\n```\n\nYou should find something like:\n\n```\napp-release.aab\n```\n\n---\n\n# Step 6 — Verify what you built\n\nAsk yourself:\n\n```\nIs this a debug build?\n```\n\nNo.\n\nYou built:\n\n```\nRelease\n```\n\nAsk:\n\n```\nIs this an APK?\n```\n\nNo.\n\nYou built:\n\n```\nAAB\n```\n\nAsk:\n\n```\nIs it signed?\n```\n\nIt should be, assuming your release signing configuration was applied correctly.\n\n---\n\n# Step 7 — Explain the entire pipeline\n\nYou should now be able to explain:\n\n```\nReact Native source\n      ↓\nAndroid native project\n      ↓\nGradle\n      ↓\nRelease build\n      ↓\nSigning configuration\n      ↓\nKeystore + signing key\n      ↓\nSigned AAB\n      ↓\nGoogle Play\n```\n\nThat's the important part.\n\n---\n\n# Step 8 — Test your `adb` knowledge\n\nConnect an Android emulator or device and run:\n\n```\nadb devices\n```\n\nYou should see your connected device/emulator.\n\nThen:\n\n```\nadb logcat\n```\n\nWatch the logs while launching your application.\n\nTry to find messages related to your application.\n\nIf you have a native Kotlin log such as:\n\n```\nLog.d(\"MyModule\", \"Hello from native Android\")\n```\n\nsee if you can find it in `logcat`.\n\n---\n\n# Step 9 — Explain ANR diagnosis\n\nWithout looking at your notes, answer:\n\n> What would you investigate if the app becomes completely unresponsive but doesn't immediately crash?\n\nYour answer should include concepts like:\n\n```\nANR\n↓\nMain/UI thread\n↓\nBlocking operation\n↓\nlogcat\n↓\nFind what the main thread was doing\n```\n\n---\n\n# Step 10 — Explain the native lifecycle\n\nFinally, explain this:\n\n```\nAndroid\n  ↓\nMainApplication\n  ↓\nApplication-level setup\n\nAndroid\n  ↓\nMainActivity\n  ↓\nActivity/UI lifecycle\n  ↓\nReact Native\n  ↓\nJavaScript\n```\n\nThen compare it with what you learned yesterday:\n\n```\niOS\n↓\nAppDelegate\n↓\nReact Native\n\nAndroid\n↓\nMainApplication / MainActivity\n↓\nReact Native\n```\n\nYou should now see that React Native sits inside two different native platforms.",
    "steps": [],
    "acceptance": [
      "You can explain what Gradle does.",
      "You understand the difference between `android/build.gradle` and `android/app/build.gradle`.",
      "You know what `AndroidManifest.xml` is responsible for.",
      "You understand permissions and runtime permission requests.",
      "You can explain what an intent filter does.",
      "You understand the native side of Android deep linking.",
      "You know the roles of `MainActivity` and `MainApplication`.",
      "You can read basic Kotlin.",
      "You understand debug vs release builds.",
      "You understand build variants at a basic level.",
      "You know what a keystore is.",
      "You understand the basic release signing fields.",
      "You generated a release AAB.",
      "You know why the AAB is the Google Play publishing format.",
      "You can use `adb logcat`.",
      "You can explain what an ANR is.",
      "You understand why blocking the Android main thread is dangerous."
    ],
    "stretch": [],
    "footer": "If you finish early, try these.\n\n### 1\\. Trace a deep link\n\nPick a deep link used by your application.\n\nTrace:\n\n```\nURL\n↓\nAndroid intent\n↓\nIntent filter\n↓\nMainActivity\n↓\nReact Native\n↓\nJS navigation\n↓\nScreen\n```\n\nTry to identify where each step is configured.\n\n---\n\n### 2. Find a native module\n\nPick one native dependency in your project.\n\nFind its Android implementation.\n\nLook for:\n\n```\n.kt\n.java\n```\n\nfiles.\n\nTry to identify:\n\n```\nClass\nMethods\nParameters\nCallbacks\nAndroid APIs\n```\n\n---\n\n### 3\\. Inspect a build variant\n\nLook at your Gradle configuration and identify:\n\n```\ndebug\nrelease\n```\n\nThen ask:\n\n> What is actually different between these builds?\n\nLook for:\n\n```\nSigning\nOptimization\nDebuggable settings\nEnvironment configuration\nApplication IDs\n```\n\n---\n\n### 4\\. Generate both APK and AAB\n\nBuild a debug APK:\n\n```\n./gradlew assembleDebug\n```\n\nThen build the release AAB:\n\n```\n./gradlew bundleRelease\n```\n\nCompare the artifacts.\n\nRemember:\n\n```\nAPK\n→ installable Android package\n\nAAB\n→ Google Play publishing bundle\n```\n\n---\n\n### 5\\. Find an ANR in a sample app\n\nIf you want to understand ANRs experimentally, create a deliberately blocking operation in a test-only environment.\n\nFor example, don't do this in production:\n\n```\nThread.sleep(10000)\n```\n\non the main thread.\n\nObserve how the application becomes unresponsive and inspect the resulting logs.\n\nThe purpose is to recognize the symptom:\n\n```\nMain thread blocked\n    ↓\nUI stops responding\n    ↓\nAndroid detects unresponsiveness\n    ↓\nANR\n```\n\n---\n\n# 🧠 Final Mental Model\n\nYesterday you learned the iOS side:\n\n```\n                  React Native\n                       │\n                       ↓\n                  Native iOS\n                       │\n              ┌────────┴────────┐\n              ↓                 ↓\n         AppDelegate        Xcode/build\n              ↓\n        React Native\n              ↓\n         JavaScript\n```\n\nToday we're doing the same thing for Android:\n\n```\n                  React Native\n                       │\n                       ↓\n                Native Android\n                       │\n           ┌───────────┴───────────┐\n           ↓                       ↓\n    MainApplication            MainActivity\n           ↓                       ↓\n    App-level setup           UI lifecycle\n                                   ↓\n                             React Native\n                                   ↓\n                              JavaScript\n```\n\nAnd around the Android application you have the build and distribution system:\n\n```\nAndroid project\n    ↓\nGradle\n    ↓\nAndroid Gradle Plugin\n    ↓\nBuild variant\n    ↓\nRelease configuration\n    ↓\nSigning\n    ↓\nKeystore\n    ↓\nAAB\n    ↓\nGoogle Play\n```\n\nYour native configuration sits alongside that:\n\n```\nAndroidManifest.xml\n      ↓\nPermissions\nIntent filters\nActivities\nDeep links\n```\n\nAnd when something goes wrong:\n\n```\nJavaScript problem?\n     ↓\nMetro / RN debugging\n\nNative Android problem?\n     ↓\nadb logcat\n\nApplication crashes?\n     ↓\nCrash / stack trace\n\nApplication freezes?\n     ↓\nANR\n     ↓\nInvestigate main thread\n```\n\nThe most important rule to remember is:\n\n> **React Native doesn't hide Android from you. It gives JavaScript a cross-platform layer on top of a real Android application. When you understand Gradle, the manifest, Activities, Kotlin, signing, and logcat, you can debug the Android side instead of treating `android/` as a black box.**"
  }
});

