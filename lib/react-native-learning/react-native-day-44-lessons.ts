import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_44_LESSONS = normalizePastedLessonDay({
  "day": 44,
  "title": "Extending Your Capstone with a Real Native Feature",
  "overview": "### Goal\n\nBy the end of this day, you should be able to take the capstone application you've been building and add a feature that **cannot reasonably be implemented with JavaScript alone**.\n\nYou will create or integrate a real native capability, expose it to React Native through the **New Architecture**, test it from JavaScript, and document the setup so another developer can run it without asking you questions.\n\nThis is the point where React Native stops being:\n\n> \"I know how to build screens with React.\"\n\nand becomes:\n\n> \"I can own a React Native application that crosses the JavaScript and native boundary.\"",
  "totalMinutes": 60,
  "difficulty": "Advanced",
  "lessons": [
    {
      "id": "rn44-1",
      "title": "What does \"a real native feature\" actually mean?",
      "durationMinutes": 4,
      "explanation": "Throughout this course, you've used APIs such as:\n\n```tsx\nCamera\nLocation\nNotifications\nSecureStore\n```\n\nThose are useful, but the native implementation was already written for you.\n\nFor this exercise, you need to go one level deeper.\n\nYou are going to create or integrate something where **your application needs native iOS or Android code**.\n\nFor example:\n\n```text\nReact Native\n    │\n    │ JavaScript / TypeScript\n    ▼\nNative Module\n    │\n┌───┴────┐\n▼        ▼\niOS      Android\nSwift    Kotlin\n```\n\nThe React Native application calls one API:\n\n```ts\nconst result = await NativeDeviceFeature.getSomething();\n```\n\nbut underneath that API:\n\n```text\nJavaScript\n  ↓\nTurboModule\n  ↓\nSwift / Kotlin\n  ↓\nOperating system\n  ↓\nNative result\n  ↓\nJavaScript\n```\n\nThat boundary is the important part of today's lesson.",
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
      "id": "rn44-2",
      "title": "Choosing the right native feature",
      "durationMinutes": 4,
      "explanation": "Don't choose a feature just because you can technically write it natively.\n\nThe feature should answer:\n\n> \"Why couldn't I simply write this in TypeScript?\"\n\nGood examples include:\n\n### Device-level functionality\n\n```text\nBattery information\nDevice sensors\nHardware capabilities\nSpecialized device APIs\n```\n\n### Security-related functionality\n\n```text\nBiometric capability\nSecure hardware information\nDevice security signals\nNative cryptographic operation\n```\n\n### Platform functionality\n\n```text\nCustom iOS API\nCustom Android API\nNative system setting\nNative notification capability\n```\n\n### Custom hardware\n\n```text\nBluetooth device\nNFC\nSpecialized scanner\nExternal hardware\n```\n\nThe important part is that the native implementation should solve a **real application requirement**.\n\nDon't create:\n\n```ts\nNativeModule.add(1, 2)\n```\n\njust because it is easy.\n\nThat teaches you almost nothing.",
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
      "id": "rn44-3",
      "title": "The native boundary",
      "durationMinutes": 4,
      "explanation": "Before writing code, understand the architecture.\n\nYour React component might look like:\n\n```tsx\nconst handleScan = async () => {\n const result = await ScannerModule.scan();\n\n setResult(result);\n};\n```\n\nThe component doesn't know anything about Swift or Kotlin.\n\nInstead:\n\n```text\n┌──────────────────────────────┐\n│ React Component              │\n│                              │\n│ ScannerModule.scan()         │\n└──────────────┬───────────────┘\n              │\n              ▼\n┌──────────────────────────────┐\n│ TypeScript API               │\n│                              │\n│ NativeScanner.scan()         │\n└──────────────┬───────────────┘\n              │\n              ▼\n┌──────────────────────────────┐\n│ TurboModule                  │\n│                              │\n│ Native interface             │\n└──────────────┬───────────────┘\n              │\n      ┌───────┴────────┐\n      ▼                ▼\n┌─────────────┐  ┌─────────────┐\n│ iOS         │  │ Android     │\n│ Swift       │  │ Kotlin      │\n└─────────────┘  └─────────────┘\n```\n\nThis separation is important.\n\nYour React code should not contain:\n\n```tsx\nif (Platform.OS === \"ios\") {\n  // 500 lines of native logic\n}\n```\n\nInstead, the platform implementation belongs on the native side.",
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
      "id": "rn44-4",
      "title": "What is a TurboModule?",
      "durationMinutes": 4,
      "explanation": "A **TurboModule** is React Native's modern system for exposing native functionality to JavaScript.\n\nInstead of treating native functionality as an untyped collection of methods, you define a typed interface.\n\nThink of it as a contract.\n\nFor example:\n\n```ts\nexport interface Spec {\n getBatteryLevel(): Promise<number>;\n}\n```\n\nThis says:\n\n> \"The native implementation must provide `getBatteryLevel()` and it returns a Promise containing a number.\"\n\nThen you provide native implementations.\n\n```text\nTypeScript specification\n         │\n         ▼\n      Codegen\n         │\n   ┌─────┴─────┐\n   ▼           ▼\n  iOS        Android\n Swift        Kotlin\n```\n\n**Codegen (code generation)** creates native glue code from your typed specification.\n\nThis reduces the amount of manually maintained JavaScript/native plumbing.",
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
      "id": "rn44-5",
      "title": "Fabric and TurboModules are not the same thing",
      "durationMinutes": 4,
      "explanation": "This is an important distinction.\n\n### Fabric\n\nFabric is primarily the modern rendering architecture.\n\nIt is involved when React Native needs to render and update UI.\n\n```text\nReact\n ↓\nFabric\n ↓\nNative UI\n```\n\n### TurboModules\n\nTurboModules are for native functionality that is exposed as modules.\n\n```text\nJavaScript\n ↓\nTurboModule\n ↓\nNative API\n```\n\nSo:\n\n```text\nUI component\n    ↓\n  Fabric\n\nNative functionality\n    ↓\nTurboModule\n```\n\nDon't say:\n\n> \"I use Fabric to call my native module.\"\n\nUsually, you are using **TurboModules for native module APIs** and **Fabric for rendering**.\n\nBoth are parts of the New Architecture.",
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
      "id": "rn44-6",
      "title": "The Codegen contract",
      "durationMinutes": 4,
      "explanation": "The TypeScript specification becomes the contract between your application and native code.\n\nFor example:\n\n```ts\ninterface Spec {\n getDeviceInfo(): Promise<{\n   model: string;\n   osVersion: string;\n }>;\n}\n```\n\nNow the expected result is explicit:\n\n```ts\n{\n model: \"iPhone\",\n osVersion: \"27.0\"\n}\n```\n\nThis is much safer than:\n\n```ts\nany\n```\n\nbecause the native and JavaScript sides agree on the shape.",
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
      "id": "rn44-7",
      "title": "Think about errors before writing native code",
      "durationMinutes": 3,
      "explanation": "Native APIs fail.\n\nFor example:\n\n```text\nPermission denied\nHardware unavailable\nUnsupported device\nNative API failure\nTimeout\nInvalid input\n```\n\nDon't turn everything into:\n\n```ts\nthrow new Error(\"Something went wrong\");\n```\n\nDefine meaningful errors.\n\nFor example:\n\n```ts\ntype ScannerError =\n | \"permission_denied\"\n | \"hardware_unavailable\"\n | \"cancelled\"\n | \"unknown\";\n```\n\nThen the JavaScript layer can respond appropriately:\n\n```ts\ntry {\n await ScannerModule.scan();\n} catch (error) {\n // Show appropriate UI\n}\n```",
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
      "id": "rn44-8",
      "title": "iOS implementation",
      "durationMinutes": 3,
      "explanation": "The iOS side will normally involve Swift.\n\nConceptually:\n\n```swift\nfunc getDeviceInfo() -> DeviceInfo {\n   return DeviceInfo(\n       model: UIDevice.current.model,\n       osVersion: UIDevice.current.systemVersion\n   )\n}\n```\n\nYour native implementation is responsible for:\n\n```text\nCalling Apple API\n     ↓\nHandling native errors\n     ↓\nReturning expected result\n```\n\nThe React Native layer shouldn't need to understand:\n\n```swift\nUIDevice\n```\n\nor any other iOS-specific API.",
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
      "id": "rn44-9",
      "title": "Android implementation",
      "durationMinutes": 3,
      "explanation": "The Android implementation performs the same contract using Kotlin.\n\nConceptually:\n\n```kotlin\nfun getDeviceInfo(): DeviceInfo {\n   // Android-specific implementation\n}\n```\n\nNow you have:\n\n```text\nSame JavaScript API\n\n       ↓\n\n┌───────────────────┐\n│ iOS implementation│\n│ Swift             │\n└───────────────────┘\n\n       +\n\n┌────────────────────┐\n│ Android implementation│\n│ Kotlin             │\n└────────────────────┘\n```\n\nThe consumer doesn't care which platform is running.",
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
      "id": "rn44-10",
      "title": "Platform differences are normal",
      "durationMinutes": 3,
      "explanation": "Don't force iOS and Android to behave identically when the operating systems don't provide equivalent capabilities.\n\nFor example:\n\n```text\nReact Native API\n      │\n      ├── iOS → native API A\n      │\n      └── Android → native API B\n```\n\nYou can still expose a common API:\n\n```ts\ngetDeviceSecurityStatus()\n```\n\nwhile the underlying implementation differs.\n\nThis is one of the most useful skills when writing cross-platform software.",
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
      "id": "rn44-11",
      "title": "What should live in JavaScript?",
      "durationMinutes": 3,
      "explanation": "A good rule is:\n\n### JavaScript\n\nOwns:\n\n```text\nUI\napplication state\nbusiness rules\nnavigation\nAPI calls\nuser interactions\nerror presentation\n```\n\n### Native\n\nOwns:\n\n```text\nhardware\nOS APIs\nplatform permissions\nnative lifecycle\nnative SDKs\nplatform-specific implementation\n```\n\nFor example:\n\n```text\n❌ React component\n     ↓\n  300 lines\n  Swift-like logic\n\n✅ React component\n     ↓\nNativeFeature.start()\n     ↓\nNative implementation\n```\n\nKeep the boundary small.",
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
      "id": "rn44-12",
      "title": "Testing the native feature",
      "durationMinutes": 3,
      "explanation": "You need multiple levels of testing.\n\n### JavaScript unit test\n\nTest your application logic:\n\n```ts\nexpect(formatNativeResult(result)).toBe(...);\n```\n\n### Native module test\n\nTest the native implementation itself.\n\nFor example:\n\n```text\nDoes the iOS API return the expected value?\nDoes Android handle unavailable hardware?\nDoes permission denial produce the expected error?\n```\n\n### Integration test\n\nTest:\n\n```text\nReact Native\n    ↓\nTurboModule\n    ↓\nNative implementation\n```\n\nThis catches problems that a pure JavaScript unit test cannot.",
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
      "id": "rn44-13",
      "title": "Test both platforms",
      "durationMinutes": 3,
      "explanation": "This is critical.\n\nDo not test:\n\n```text\nMac → iOS simulator → works\n```\n\nand assume Android works.\n\nYou should have:\n\n```text\niOS simulator/device\n       +\nAndroid emulator/device\n```\n\nbecause the native implementations are different.\n\nA common bug looks like:\n\n```text\nJavaScript API\n     ↓\niOS works\n     ↓\nAndroid method missing\n```\n\nYour TypeScript interface can be correct while the native implementation is broken.",
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
      "id": "rn44-14",
      "title": "Handle permissions correctly",
      "durationMinutes": 3,
      "explanation": "If your feature requires permission:\n\n```text\nUser action\n   ↓\nCheck permission\n   ↓\nRequest permission if needed\n   ↓\nNative operation\n   ↓\nResult/error\n```\n\nDon't request permissions immediately when the application launches unless there is a genuine reason.\n\nExplain why the permission is required.\n\nFor example:\n\n> \"We need Bluetooth access to connect to your device.\"\n\nis much better than suddenly showing a permission dialog with no context.",
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
      "id": "rn44-15",
      "title": "Document the feature for another developer",
      "durationMinutes": 3,
      "explanation": "This is part of your actual assignment.\n\nYour documentation should answer:\n\n### What does it do?\n\n```text\nThis module provides access to ...\n```\n\n### Why is native code required?\n\n```text\nThe feature uses an OS API that isn't available through\nthe standard React Native JavaScript APIs.\n```\n\n### How does it work?\n\n```text\nReact component\n     ↓\nTypeScript API\n     ↓\nTurboModule\n     ↓\nSwift / Kotlin\n```\n\n### How do I install it?\n\nInclude:\n\n```bash\nnpm install ...\n```\n\nor whatever your project actually requires.\n\n### How do I build it?\n\nFor example:\n\n```bash\nnpx expo run:ios\n```\n\nand:\n\n```bash\nnpx expo run:android\n```\n\n### What native dependencies are required?\n\nDocument:\n\n```text\niOS\n- framework\n- permission\n- configuration\n\nAndroid\n- dependency\n- permission\n- manifest configuration\n```\n\n### How do I test it?\n\nExplain:\n\n```text\n1. Start development build\n2. Open feature\n3. Grant permission\n4. Trigger operation\n5. Verify result\n```",
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
      "id": "rn44-16",
      "title": "Documentation should include failure cases",
      "durationMinutes": 3,
      "explanation": "Don't document only:\n\n> \"Run this command and it works.\"\n\nAlso document:\n\n```text\nIf iOS build fails:\n→ Check ...\n\nIf Android cannot find module:\n→ Check ...\n\nIf permission is denied:\n→ Reset permission and retry.\n\nIf native code changed:\n→ Rebuild the native application.\n```\n\nThis is the difference between documentation that looks good and documentation that actually helps another engineer.",
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
      "id": "rn44-17",
      "title": "The final test: another developer",
      "durationMinutes": 3,
      "explanation": "Your self-check is intentionally different from previous days.\n\nGive the documentation to another developer.\n\nDon't explain anything verbally.\n\nAsk them to:\n\n```text\nClone project\n   ↓\nRead documentation\n   ↓\nInstall dependencies\n   ↓\nBuild native application\n   ↓\nRun iOS/Android\n   ↓\nUse feature\n   ↓\nRun tests\n```\n\nIf they get stuck and ask:\n\n> \"What should I do here?\"\n\ndon't immediately fix it for them.\n\nAsk:\n\n> \"What part of the documentation was unclear?\"\n\nThen improve the documentation.\n\nThat is how production documentation gets better.",
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
      "id": "rn44-18",
      "title": "Day 44 mental model",
      "durationMinutes": 3,
      "explanation": "Remember this:\n\n```text\n                   React Native App\n                         │\n                         ▼\n                TypeScript API\n                         │\n                         ▼\n                   Codegen contract\n                         │\n                         ▼\n                   TurboModule\n                   /          \\\n                  /            \\\n                 ▼              ▼\n              iOS              Android\n             Swift             Kotlin\n               │                 │\n               ▼                 ▼\n          Apple APIs        Android APIs\n```\n\nAnd for UI:\n\n```text\nReact\n ↓\nFabric\n ↓\nNative UI\n```\n\n---\n\n# Key Takeaways\n\n* A real native feature should solve a problem that JavaScript alone cannot reasonably solve.\n* TurboModules expose native functionality to JavaScript.\n* Fabric is primarily the rendering side of the New Architecture.\n* Codegen creates native glue from typed specifications.\n* iOS and Android can have different implementations behind the same JavaScript API.\n* Keep business logic in JavaScript and platform-specific functionality native.\n* Test JavaScript, native implementation, and the integration boundary.\n* Always test both iOS and Android.\n* Good native documentation explains setup, architecture, permissions, building, testing, and troubleshooting.\n* A feature is not truly finished if another engineer cannot build and run it.\n\n---\n\n# Common Mistakes\n\n### 1. Choosing a fake native feature\n\nCreating a native module for something JavaScript can already do doesn't teach you much.\n\n### 2. Putting business logic inside Swift/Kotlin\n\nNative code should primarily deal with the platform boundary.\n\n### 3. Testing only the JavaScript API\n\nThe TypeScript API can pass while the native implementation is broken.\n\n### 4. Testing only iOS\n\nAndroid is a separate native implementation.\n\n### 5. Forgetting rebuilds\n\nChanging native code usually requires rebuilding the native application.\n\n### 6. Making the native API huge\n\nPrefer:\n\n```ts\nNativeFeature.start()\nNativeFeature.stop()\n```\n\nover exposing dozens of internal native methods.\n\n### 7. Poor documentation\n\nIf another developer needs you on a call to get started, the documentation isn't finished yet.\n\n---\n\n# Mini Quiz\n\n**1. What is the main purpose of a TurboModule?**\n\nA. Render React components\nB. Expose native functionality to JavaScript\nC. Replace TypeScript\nD. Manage navigation\n\n**Answer:** B\n\n---\n\n**2. What is Fabric mainly responsible for?**\n\nA. Native module APIs\nB. Rendering\nC. API requests\nD. Secure storage\n\n**Answer:** B\n\n---\n\n**3. Why use Codegen?**\n\nA. To generate UI screenshots\nB. To create native glue from a typed native-module specification\nC. To replace Metro\nD. To compile JavaScript into SQL\n\n**Answer:** B\n\n---\n\n**4. Why should native modules be tested on both platforms?**\n\nBecause iOS and Android have separate native implementations.\n\n---\n\n**5. What is the most important test for today's exercise?**\n\nAnother developer should be able to follow your documentation and successfully build and use the feature without your help.",
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
      "question": "What qualifies as a real native feature?",
      "options": [
        "A. A capability that genuinely requires platform APIs or native implementation",
        "B. Any React component",
        "C. A JavaScript calculation",
        "D. A route name"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "How should a native feature be chosen?",
      "options": [
        "A. Choose a small useful capability with a clear native reason",
        "B. Choose the largest possible API",
        "C. Move all business logic native",
        "D. Support only one platform"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is the native boundary?",
      "options": [
        "A. The typed contract between JavaScript and platform implementations",
        "B. A screen border",
        "C. A store listing",
        "D. A Git branch"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does a TurboModule provide?",
      "options": [
        "A. A typed New Architecture interface for native module APIs",
        "B. Custom rendering only",
        "C. Server-state caching",
        "D. Navigation animations"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "How is Fabric different from TurboModules?",
      "options": [
        "A. Fabric handles native UI components; TurboModules expose native capabilities",
        "B. They are identical",
        "C. Fabric manages APIs",
        "D. TurboModules only render text"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does Codegen use?",
      "options": [
        "A. A typed specification to generate cross-language glue",
        "B. Screenshots",
        "C. Store metadata",
        "D. Runtime logs"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why define native errors early?",
      "options": [
        "A. JavaScript callers need predictable failure behavior across platforms",
        "B. Native code cannot throw",
        "C. Errors replace permissions",
        "D. It removes testing"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should normally remain in JavaScript?",
      "options": [
        "A. Product and business logic that does not require native execution",
        "B. All platform APIs",
        "C. Signing credentials",
        "D. Native UI internals"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why test both iOS and Android implementations?",
      "options": [
        "A. They are separate implementations with different platform behavior",
        "B. One automatically proves the other",
        "C. Android uses Swift",
        "D. iOS uses Kotlin"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is the strongest documentation test?",
      "options": [
        "A. Another developer can build and use the feature without help",
        "B. The file has many comments",
        "C. The API has many methods",
        "D. Only the author can run it"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Real Native Capstone Feature",
    "goal": "Add one genuinely native feature to your capstone.",
    "brief": "### Goal\n\nAdd one genuinely native feature to your capstone.\n\n### Requirements\n\nYour feature must have:\n\n* a TypeScript API\n* a native iOS implementation\n* a native Android implementation\n* appropriate error handling\n* tests\n* documentation\n* a working React Native UI using the feature\n\n### Acceptance criteria\n\n```text\n[ ] Feature requires native functionality\n[ ] TypeScript API is typed\n[ ] TurboModule/New Architecture boundary is understood\n[ ] iOS implementation works\n[ ] Android implementation works\n[ ] Errors are handled\n[ ] JavaScript tests exist\n[ ] Native/integration testing exists where appropriate\n[ ] Documentation explains setup\n[ ] Documentation explains permissions\n[ ] Documentation explains building\n[ ] Another developer can follow it without help\n```\n\n### Stretch\n\nAdd a small automated integration test that verifies:\n\n```text\nReact Native\n    ↓\nTurboModule\n    ↓\nNative implementation\n    ↓\nResult\n```",
    "steps": [],
    "acceptance": [
      "a TypeScript API",
      "a native iOS implementation",
      "a native Android implementation",
      "appropriate error handling",
      "tests",
      "documentation",
      "a working React Native UI using the feature"
    ]
  }
});

