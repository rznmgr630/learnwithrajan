import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_1_LESSONS = normalizePastedLessonDay({
  day: 1,
  title: "React Native setup, the mobile runtime, and the New Architecture",
  totalMinutes: 51,
  difficulty: "Beginner",
  lessons: [
    {
      id: "react-native-mental-model",
      title: "What React Native is and how it builds mobile UI",
      durationMinutes: 9,
      explanation: `<b>React Native</b> (a framework for building native mobile applications with React and JavaScript or TypeScript) lets you use React concepts while targeting iOS and Android.\n\nReact Native is <b>not</b> React running inside a browser.\n\nThere is no browser DOM (Document Object Model — the browser's tree of HTML elements). Instead, React Native renders native platform views such as iOS <b>UIView</b>-based components and Android native views.\n\n---\n\n### 1. Basic — React Native's job\n\nIn a web React application, you might write:\n\n\`\`\`tsx\n<h1>Hello, Rajan</h1>\n\`\`\`\n\nThe browser eventually displays an HTML element.\n\nIn React Native, you write:\n\n\`\`\`tsx\n<Text>Hello, Rajan</Text>\n\`\`\`\n\nThe important difference is that \`Text\` is a React Native component that represents native mobile UI rather than an HTML element.\n\nA simple mental model is:\n\n\`\`\`text\nReact component\n      ↓\nReact element tree\n      ↓\nReact Native renderer\n      ↓\nNative platform views\n      ↓\n       Screen\n\`\`\`\n\n---\n\n### 2. React Native is not a web browser\n\nA React Native application does not normally give you:\n\n\`\`\`text\n<div>\n<span>\n<button>\nCSS cascade\nDOM APIs\nwindow.document\n\`\`\`\n\nInstead, you work with components such as:\n\n\`\`\`tsx\n<View>\n  <Text>Hello</Text>\n  <Pressable>\n    <Text>Continue</Text>\n  </Pressable>\n</View>\n\`\`\`\n\nThese components describe mobile UI.\n\nYou can reuse your React knowledge, but you must learn the mobile platform underneath it.\n\n---\n\n### 3. One codebase does not mean identical platforms\n\niOS and Android have different:\n\n- Navigation conventions\n- Permission systems\n- Build systems\n- Background execution rules\n- Native UI behavior\n- App store requirements\n- Device sizes and capabilities\n\nReact Native gives you a shared programming model, but it does not erase platform differences.\n\nA production React Native developer needs to know when code can be shared and when platform-specific behavior is required.\n\n---\n\n### 4. Important — the runtime\n\nYour JavaScript or TypeScript code runs inside a JavaScript runtime, normally <b>Hermes</b> (the JavaScript engine optimized for React Native).\n\nReact Native connects that JavaScript execution environment to native iOS and Android functionality.\n\nThink about the application as several parts:\n\n\`\`\`text\n                 React / TypeScript\n                         │\n                         ↓\n                  JavaScript runtime\n                      (Hermes)\n                         │\n              ┌──────────┴──────────┐\n              ↓                     ↓\n          React Native           Native APIs\n           rendering          iOS / Android\n              │                     │\n              └──────────┬──────────┘\n                         ↓\n                       Device\n\`\`\`\n\nYou will learn exactly how these pieces communicate later. For Day 1, the important idea is that React Native is a native application runtime, not a browser page.`,
      diagram: `React Native mental model\n\n        Your code\n   React + TypeScript\n          │\n          ↓\n    React component\n          │\n          ↓\n    React element tree\n          │\n          ↓\n  React Native renderer\n          │\n     ┌────┴────┐\n     ↓         ↓\n   iOS      Android\n native       native\n  views        views\n     │         │\n     └────┬────┘\n          ↓\n       Device UI`,
      codeExample: {
        title: "A simple React Native component",
        code: `import { Pressable, Text, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <View>
      <Text>Welcome, Rajan</Text>

      <Pressable>
        <Text>Continue</Text>
      </Pressable>
    </View>
  );
}

// View and Text are React Native components.
// They are not HTML div and span elements.`,
      },
      keyTakeaways: [
        "<b>React Native</b> uses React concepts to build native mobile applications.",
        "React Native does <b>not</b> render a browser DOM.",
        "<b>View</b>, <b>Text</b>, <b>Pressable</b> and other primitives describe native mobile UI.",
        "iOS and Android share application code but still have important platform differences.",
        "<b>Hermes</b> is the JavaScript engine used by modern React Native applications.",
      ],
      commonMistakes: [
        "<b>Thinking React Native is React for websites</b> — React Native has a different runtime and native UI layer.",
        "<b>Treating View like a div</b> — the components look familiar but their behavior and styling rules are different.",
        "<b>Assuming one code path always behaves identically on iOS and Android</b> — platform differences are part of mobile development.",
        "<b>Trying to learn React Native without knowing React</b> — React Native builds directly on React concepts such as components, props and hooks.",
      ],
      quiz: [
        {
          question: "What does React Native primarily build?",
          options: [
            "HTML websites",
            "Native mobile applications",
            "PostgreSQL databases",
            "Node.js servers",
          ],
          correctIndex: 1,
          explanation: "React Native is used to build native mobile applications for platforms such as iOS and Android.",
        },
        {
          question: "Does React Native use the browser DOM as its normal rendering target?",
          options: [
            "Yes, every component becomes an HTML element",
            "No, it renders native platform UI",
            "Only on Android",
            "Only in development",
          ],
          correctIndex: 1,
          explanation: "React Native does not normally render a browser DOM. It renders native platform UI.",
        },
        {
          question: "What is Hermes?",
          options: [
            "A navigation library",
            "A CSS framework",
            "A JavaScript engine used by React Native",
            "An Android emulator",
          ],
          correctIndex: 2,
          explanation: "Hermes is the JavaScript engine used by modern React Native applications.",
        },
      ],
    },
    {
      id: "expo-vs-bare",
      title: "Expo, development builds, and the bare workflow",
      durationMinutes: 9,
      explanation: `<b>Expo</b> is a set of tools and services that makes React Native development, native configuration, builds and deployment easier.\n\nFor modern React Native projects, Expo is a practical default rather than simply a beginner-only tool.\n\n---\n\n### 1. Basic — Expo vs React Native without Expo\n\nThere are two common ways to think about your project setup.\n\n<b>Expo</b> gives you a managed development experience, Expo modules, configuration tools and cloud services such as EAS.\n\nA project can still generate and work with native \`ios/\` and \`android/\` projects when you need direct native control.\n\nA more traditional bare React Native setup gives you direct control over the native projects from the beginning.\n\nThink about the choices like this:\n\n\`\`\`text\n                    React Native\n                         │\n              ┌──────────┴──────────┐\n              ↓                     ↓\n            Expo             Bare / direct native\n              │                     │\n              ↓                     ↓\n   Expo tools + EAS       Full native project control\n              │                     │\n              └──────────┬──────────┘\n                         ↓\n                  iOS + Android\n\`\`\`\n\n---\n\n### 2. Why Expo is the default in this track\n\nExpo can provide:\n\n- Project creation\n- Native modules\n- Configuration through \`app.json\` or \`app.config.ts\`\n- Development builds\n- Cloud builds through EAS\n- App submission through EAS Submit\n- Over-the-air updates through EAS Update\n- A consistent workflow for iOS and Android\n\nThis does not mean Expo hides native development forever.\n\nWhen you need native configuration, you can generate native projects with:\n\n\`\`\`bash\nnpx expo prebuild\n\`\`\`\n\n---\n\n### 3. Expo Go vs development builds\n\nThese are not the same thing.\n\n<b>Expo Go</b> is a prebuilt application that contains a fixed set of native capabilities. It is useful for quickly trying common Expo features.\n\nA <b>development build</b> is your own native application containing the native modules your project needs.\n\nThat distinction matters when a third-party package requires native code that Expo Go does not contain.\n\nFor example:\n\n\`\`\`text\nThird-party native module\n          │\n          ↓\n     Is it included\n       in Expo Go?\n       /        \\\\\n     yes         no\n      │           │\n      ↓           ↓\n  Expo Go     Development build\n\`\`\`\n\n---\n\n### 4. When bare/native control matters\n\nYou may need direct native access when you are:\n\n- Writing a custom native module\n- Modifying native build settings\n- Integrating a native SDK\n- Debugging an iOS or Android build problem\n- Working with platform-specific capabilities\n- Maintaining an existing bare React Native application\n\nThe goal is not to avoid native code. The goal is to use the simplest workflow that still gives you the control your application needs.`,
      diagram: `Choosing a project workflow\n\n                 React Native app\n                        │\n                        ↓\n                Start with Expo\n                        │\n              ┌─────────┴─────────┐\n              ↓                   ↓\n        Standard needs       Native control\n              │                   │\n              ↓                   ↓\n         Expo workflow       prebuild / native\n              │                   │\n              └─────────┬─────────┘\n                        ↓\n                  iOS + Android`,
      codeExample: {
        title: "Create an Expo React Native project",
        code: `# Create a new Expo project
npx create-expo-app@latest my-mobile-app

# Enter the project
cd my-mobile-app

# Start the development server
npx expo start

# Generate native projects when you need native access
npx expo prebuild`,
      },
      keyTakeaways: [
        "<b>Expo</b> is a production-capable React Native platform, not merely a beginner wrapper.",
        "<b>Expo Go</b> is a prebuilt app with a fixed set of native capabilities.",
        "A <b>development build</b> is your own native app containing the native modules your project needs.",
        "<b>npx expo prebuild</b> generates native iOS and Android projects when direct native access is needed.",
        "Use the simplest workflow that gives your application enough native control.",
      ],
      commonMistakes: [
        "<b>Thinking Expo means you cannot use native code</b> — Expo projects can use native modules and generated native projects.",
        "<b>Assuming every native library works in Expo Go</b> — Expo Go only contains the native capabilities bundled into that client.",
        "<b>Calling prebuild 'ejecting'</b> — modern Expo uses continuous native generation rather than treating native projects as a one-way escape.",
        "<b>Choosing bare native development just because it sounds more advanced</b> — more native configuration also means more maintenance responsibility.",
      ],
      quiz: [
        {
          question: "What is Expo?",
          options: [
            "Only a UI component library",
            "A set of tools and services for React Native development",
            "A replacement for TypeScript",
            "An Android emulator",
          ],
          correctIndex: 1,
          explanation: "Expo provides tools, modules, configuration, builds and other services around React Native development.",
        },
        {
          question: "Why might a native package fail in Expo Go?",
          options: [
            "Expo Go cannot run JavaScript",
            "The package may require native code that Expo Go does not contain",
            "TypeScript prevents it",
            "Expo Go only works on Android",
          ],
          correctIndex: 1,
          explanation: "Expo Go contains a predefined set of native capabilities. A package requiring other native code may need a development build.",
        },
        {
          question: "What does `npx expo prebuild` do?",
          options: [
            "Deletes the JavaScript source",
            "Creates native iOS and Android projects from the Expo configuration",
            "Publishes the app to the App Store",
            "Runs unit tests",
          ],
          correctIndex: 1,
          explanation: "Prebuild generates the native iOS and Android project files from the Expo configuration and installed native modules.",
        },
      ],
    },
    {
      id: "new-architecture",
      title: "The New Architecture: JSI, Fabric, TurboModules, and Codegen",
      durationMinutes: 11,
      explanation: `Modern React Native uses the <b>New Architecture</b> (the modern rendering and native-module architecture built around Fabric, TurboModules, JSI and Codegen).\n\nYou do not need to become a native framework engineer on Day 1, but you do need a correct mental model.\n\n---\n\n### 1. Why did React Native need a new architecture?\n\nOlder React Native applications relied heavily on the <b>Legacy Architecture</b>, including the traditional Bridge.\n\nThe Bridge introduced communication overhead between JavaScript and native code.\n\nA simplified historical model looked like:\n\n\`\`\`text\nJavaScript\n    │\n    ↓\n  Bridge\n    │\n serialization\n    │\n    ↓\n Native code\n\`\`\`\n\nThe New Architecture changes how JavaScript and native systems communicate and how UI is rendered.\n\n---\n\n### 2. JSI\n\n<b>JSI</b> (JavaScript Interface — a C++ interface that allows JavaScript runtimes to interact with native C++ objects) provides the foundation for direct JavaScript-to-native interoperability.\n\nThe important beginner-level idea is:\n\n\`\`\`text\nOld mental model:\nJavaScript → Bridge → serialized message → Native\n\nNew mental model:\nJavaScript runtime ↔ JSI ↔ native/C++ objects\n\`\`\`\n\nDo not interpret this as \"JavaScript becomes native code.\" JavaScript is still running in a JavaScript runtime. JSI provides a lower-level interface between the runtime and native systems.\n\n---\n\n### 3. Fabric\n\n<b>Fabric</b> is React Native's modern rendering system.\n\nIt manages how React's UI description becomes native UI.\n\nA simplified flow is:\n\n\`\`\`text\nReact components\n      ↓\nReact element tree\n      ↓\nReact reconciliation\n      ↓\nFabric\n      ↓\nNative UI\n\`\`\`\n\nFabric is important because it makes React Native's rendering system more closely integrated with modern React behavior and provides a foundation for improved performance and interoperability.\n\n---\n\n### 4. TurboModules\n\n<b>TurboModules</b> are the modern native-module system.\n\nA native module lets JavaScript access platform functionality that is not available through normal JavaScript code.\n\nExamples can include:\n\n- Bluetooth\n- Device information\n- Specialized sensors\n- Native SDKs\n- Platform-specific services\n\nTurboModules support lazy loading, meaning a native module does not necessarily need to be initialized before it is actually needed.\n\n---\n\n### 5. Codegen\n\n<b>Codegen</b> (code generation that creates native interfaces from typed specifications) helps keep JavaScript and native interfaces consistent.\n\nA simplified idea is:\n\n\`\`\`text\nTyped specification\n       ↓\n     Codegen\n       ↓\nGenerated native interface\n       ↓\nNative implementation\n       ↓\nJavaScript API\n\`\`\`\n\nThis becomes especially important when you eventually write your own native modules.\n\n---\n\n### 6. The four terms together\n\nRemember this simple mapping:\n\n\`\`\`text\nJSI\n ↓\nCommunication foundation\n\nFabric\n ↓\nUI rendering system\n\nTurboModules\n ↓\nNative module system\n\nCodegen\n ↓\nTyped/generated native interfaces\n\`\`\`\n\nYou will revisit these concepts in the advanced native-module lessons. Day 1 is about understanding what they mean, not memorizing implementation details.`,
      diagram: `React Native New Architecture\n\n             React\n               │\n               ↓\n       React element tree\n               │\n               ↓\n          React renderer\n               │\n               ↓\n            Fabric\n               │\n               ↓\n          Native UI\n\nJavaScript runtime\n       │\n       ↓\n      JSI\n       │\n       ↓\n Native capabilities\n       │\n       ↓\n TurboModules\n       │\n       ↓\n Native implementations\n\nCodegen provides generated\ninterfaces between typed specs\nand native implementations.`,
      codeExample: {
        title: "The mental model rather than a custom native module",
        code: `// Normal React Native application code
import { Text, View } from "react-native";

export default function App() {
  return (
    <View>
      <Text>Hello from the New Architecture</Text>
    </View>
  );
}

// You normally do NOT write JSI, Fabric or TurboModule
// code for a normal screen.
//
// Those systems are underneath your React Native code.
// You interact with them indirectly through React Native
// and native modules.`,
      },
      keyTakeaways: [
        "<b>JSI</b> provides a low-level interface between the JavaScript runtime and native/C++ systems.",
        "<b>Fabric</b> is the modern React Native rendering system.",
        "<b>TurboModules</b> are the modern system for native modules.",
        "<b>Codegen</b> generates native interfaces from typed specifications.",
        "You do not need to write New Architecture code for normal screens; you need to understand the architecture so you can debug and extend it later.",
      ],
      commonMistakes: [
        "<b>Thinking JSI means JavaScript directly becomes C++</b> — JSI provides an interface between the JavaScript runtime and native/C++ objects.",
        "<b>Thinking Fabric is a styling system</b> — Fabric is part of React Native's rendering architecture.",
        "<b>Thinking every app needs a custom TurboModule</b> — most applications can use existing native modules.",
        "<b>Memorizing acronyms without understanding the flow</b> — focus first on how React code reaches native UI and native capabilities.",
      ],
      quiz: [
        {
          question: "What is Fabric primarily responsible for?",
          options: [
            "Database queries",
            "React Native UI rendering",
            "JavaScript package installation",
            "App store screenshots",
          ],
          correctIndex: 1,
          explanation: "Fabric is React Native's modern rendering system.",
        },
        {
          question: "What are TurboModules?",
          options: [
            "A CSS framework",
            "A modern system for native modules",
            "A navigation router",
            "An Android emulator",
          ],
          correctIndex: 1,
          explanation: "TurboModules are the modern native-module system in React Native's New Architecture.",
        },
        {
          question: "What is Codegen used for?",
          options: [
            "Generating screenshots",
            "Generating native interfaces from typed specifications",
            "Compressing images",
            "Creating npm accounts",
          ],
          correctIndex: 1,
          explanation: "Codegen helps generate native interfaces from typed specifications.",
        },
      ],
    },
    {
      id: "metro-hermes-eas",
      title: "Metro, Hermes, development builds, and EAS",
      durationMinutes: 8,
      explanation: `<b>Metro</b> and <b>Hermes</b> are two pieces of the React Native development runtime that you should recognize immediately.\n\nYou will also encounter <b>EAS</b> (Expo Application Services), which handles important build and deployment workflows.\n\n---\n\n### 1. Metro\n\n<b>Metro</b> is the JavaScript bundler used by React Native.\n\nA <b>bundler</b> (a tool that processes your source files and packages the JavaScript your application needs) takes modules such as:\n\n\`\`\`text\nApp.tsx\n  ↓\ncomponents/\n  ↓\nhooks/\n  ↓\nnode_modules/\n  ↓\nMetro\n  ↓\nApplication JavaScript bundle\n\`\`\`\n\nMetro is not Vite, although both are development/build tools.\n\nFor this track, you mainly need to know that Metro understands the React Native project structure, resolves modules and serves/builds the JavaScript used by the application.\n\n---\n\n### 2. Hermes\n\n<b>Hermes</b> is the JavaScript engine used by React Native.\n\nYour TypeScript does not run directly on the phone as TypeScript. It is transformed into JavaScript, which is then executed by the JavaScript runtime.\n\nThink:\n\n\`\`\`text\nTypeScript / JavaScript source\n            ↓\n          Metro\n            ↓\n      JavaScript output\n            ↓\n          Hermes\n            ↓\n        Application\n\`\`\`\n\nYou will later learn how Hermes affects startup time, memory usage, debugging and performance.\n\n---\n\n### 3. EAS\n\n<b>EAS</b> (Expo Application Services) provides cloud services for React Native and Expo projects.\n\nImportant services include:\n\n- <b>EAS Build</b> — creates installable iOS and Android builds\n- <b>EAS Submit</b> — helps submit builds to app stores\n- <b>EAS Update</b> — delivers compatible JavaScript updates over the air\n\nYou will learn these in depth later. On Day 1, understand their roles.\n\n---\n\n### 4. Development vs production\n\nA development build is designed for debugging and iteration.\n\nA production build is optimized and signed for distribution.\n\nDo not judge production performance from a development build. Development tools and debugging features can make the application slower.\n\nA simple pipeline is:\n\n\`\`\`text\nSource code\n    ↓\nDevelopment\n    ↓\nDevelopment build\n    ↓\nTesting\n    ↓\nProduction build\n    ↓\nApp Store / Play Store\n\`\`\`\n\nYou will build this pipeline throughout the course.`,
      diagram: `React Native toolchain\n\nTypeScript / JavaScript\n          │\n          ↓\n        Metro\n          │\n          ↓\n   JavaScript bundle\n          │\n          ↓\n       Hermes\n          │\n          ↓\n     React Native app\n          │\n     ┌────┴────┐\n     ↓         ↓\n    iOS     Android\n\nEAS supports:\nBuild → Submit → Update`,
      codeExample: {
        title: "Useful Day 1 commands",
        code: `# Create a new Expo project
npx create-expo-app@latest my-mobile-app

# Start Metro through Expo
npx expo start

# Generate native projects when needed
npx expo prebuild

# Install a package
npm install <package-name>

# Start a development build workflow
npx expo run:ios
npx expo run:android`,
      },
      keyTakeaways: [
        "<b>Metro</b> is React Native's JavaScript bundler.",
        "<b>Hermes</b> is the JavaScript engine that executes your application's JavaScript.",
        "<b>EAS Build</b> creates installable application builds.",
        "<b>EAS Submit</b> helps with app-store submission.",
        "<b>EAS Update</b> can deliver compatible JavaScript updates without a full native store release.",
        "Development builds and production builds have different purposes and performance characteristics.",
      ],
      commonMistakes: [
        "<b>Thinking TypeScript runs directly on the device</b> — TypeScript is transformed before the application executes.",
        "<b>Thinking Metro is a server-side API server</b> — Metro is the JavaScript bundler/development server for the React Native project.",
        "<b>Testing production performance only in development mode</b> — development tooling can significantly affect performance.",
        "<b>Assuming EAS Update can change native code</b> — native changes normally require a new native build.",
      ],
      quiz: [
        {
          question: "What is Metro?",
          options: [
            "A mobile database",
            "A JavaScript bundler for React Native",
            "A native camera API",
            "A testing framework",
          ],
          correctIndex: 1,
          explanation: "Metro processes and bundles the JavaScript used by React Native applications.",
        },
        {
          question: "What executes JavaScript in a modern React Native application?",
          options: [
            "PostgreSQL",
            "Hermes",
            "Xcode",
            "Metro",
          ],
          correctIndex: 1,
          explanation: "Hermes is the JavaScript engine. Metro prepares the JavaScript; Hermes executes it.",
        },
        {
          question: "Which EAS service is primarily responsible for creating application builds?",
          options: [
            "EAS Build",
            "EAS Submit",
            "EAS Update",
            "EAS Router",
          ],
          correctIndex: 0,
          explanation: "EAS Build creates installable iOS and Android application builds.",
        },
      ],
    },
    {
      id: "using-the-track",
      title: "How to use this track and organize the source code",
      durationMinutes: 6,
      explanation: `Treat each day as a practical lesson rather than reading material to finish quickly.

### How to use the track

• Skim the lesson headings first so you understand the goal.
• Type the examples instead of blindly pasting them. Metro errors and JSX mistakes are part of learning.
• Mark a day complete only after the application works and you can explain the main ideas without reading.
• Follow the phases in order when possible. If you jump ahead for a project, return to the skipped foundations.

### Keep dependency versions aligned

If you follow a tutorial or existing project, check its React Native, Expo, SDK, and navigation-library versions. APIs and setup steps can differ between releases.

When an import or native package fails:

\`\`\`text
Check the package documentation
        ↓
Check Expo / React Native compatibility
        ↓
Install the compatible version
        ↓
Rebuild when native code changed
\`\`\`

Do not copy an old package version into a modern project without checking compatibility.

### Organize the project by responsibility

A simple starting structure is:

\`\`\`text
app/ or screens/    → route targets
components/         → reusable UI
hooks/              → reusable stateful logic
services/           → API and external integrations
navigation/         → navigation configuration when used
\`\`\`

The exact folder names can change. The important rule is to keep route screens, reusable UI, domain logic, and external integrations from becoming one mixed folder.`,
      diagram: `Learn the goal
      ↓
Type and run the example
      ↓
Fix errors
      ↓
Explain the result
      ↓
Mark the day complete`,
      codeExample: {
        title: "A clear starter structure",
        code: `app/
components/
hooks/
services/
navigation/`,
      },
      keyTakeaways: [
        "Complete a lesson by running and explaining it, not only by reading it.",
        "Check package compatibility before copying versions from another project.",
        "Separate route screens, reusable UI, hooks, and external services.",
      ],
      commonMistakes: [
        "Copying tutorial dependencies without checking their React Native or Expo compatibility.",
        "Marking a lesson complete before running the example.",
        "Putting screens, reusable components, API calls, and navigation into one folder.",
      ],
      quiz: [
        {
          question: "When should you mark a lesson complete?",
          options: [
            "After reading the title",
            "After the example works and you can explain the main ideas",
            "After copying the code",
            "Before resolving build errors",
          ],
          correctIndex: 1,
          explanation: "Running the example and explaining it confirms that the lesson was understood.",
        },
        {
          question: "What should you check before copying a package version from a tutorial?",
          options: [
            "Only the package name",
            "The tutorial author's editor theme",
            "Compatibility with your React Native and Expo versions",
            "The number of files in the project",
          ],
          correctIndex: 2,
          explanation: "Package and native SDK compatibility can change across React Native and Expo releases.",
        },
      ],
    },
    {
      id: "first-project-device",
      title: "Create the project and run it on a device",
      durationMinutes: 8,
      explanation: `Now you will create and run your first React Native application.\n\nThe goal is not to build a feature yet. The goal is to understand the complete development loop:\n\n\`\`\`text\nWrite code\n   ↓\nMetro\n   ↓\nDevelopment app\n   ↓\nSimulator / emulator / device\n   ↓\nSee the result\n   ↓\nChange code\n   ↓\nRepeat\n\`\`\`\n\n---\n\n### 1. Create the application\n\nRun:\n\n\`\`\`bash\nnpx create-expo-app@latest my-mobile-app\n\`\`\`\n\nThen:\n\n\`\`\`bash\ncd my-mobile-app\nnpx expo start\n\`\`\`\n\nExpo starts the development environment and gives you options for opening the application.\n\n---\n\n### 2. Simulator vs emulator vs physical device\n\nAn <b>iOS Simulator</b> is Apple's simulated iOS environment on macOS.\n\nAn <b>Android Emulator</b> simulates an Android device.\n\nA <b>physical device</b> is an actual iPhone or Android phone.\n\nYou should eventually test on all three kinds of environments because simulated and physical devices can expose different problems.\n\nFor example:\n\n\`\`\`text\nSimulator / Emulator\n├── fast development feedback\n├── easy debugging\n└── configurable device sizes\n\nPhysical device\n├── real performance\n├── real sensors\n├── real network conditions\n└── real permission behavior\n\`\`\`\n\n---\n\n### 3. Make your first change\n\nOpen the main screen in the generated project and replace its content with a simple screen.\n\nFor example:\n\n\`\`\`tsx\nimport { StyleSheet, Text, View } from "react-native";\n\nexport default function HomeScreen() {\n  return (\n    <View style={styles.container}>\n      <Text style={styles.title}>My First React Native App</Text>\n      <Text>Day 1 — Mobile runtime and setup</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    alignItems: "center",\n    justifyContent: "center",\n  },\n  title: {\n    fontSize: 24,\n    fontWeight: "700",\n  },\n});\n\`\`\`\n\nDo not worry about every styling property yet. Styling is covered in depth later.\n\n---\n\n### 4. Understand the development loop\n\nWhen you save the file, the development environment detects the change and updates the running application.\n\nYour first objective is simply:\n\n\`\`\`text\nEdit\n ↓\nSave\n ↓\nApp updates\n ↓\nInspect\n ↓\nEdit again\n\`\`\`\n\nThis loop becomes your daily workflow.\n\n---\n\n### 5. Learn the important failure point\n\nIf a native package is added that requires native code, changing JavaScript alone may not be enough.\n\nYou may need a new development build.\n\nThat is one of the most important differences between a JavaScript-only change and a native dependency change.\n\nLater lessons will teach exactly when you need to rebuild.`,
      diagram: `Your first development loop\n\n        Write code\n             │\n             ↓\n           Metro\n             │\n             ↓\n      Development app\n             │\n       ┌─────┴─────┐\n       ↓           ↓\n   Simulator    Physical\n    / Emulator    device\n       │           │\n       └─────┬─────┘\n             ↓\n        Inspect UI\n             │\n             ↓\n          Edit again`,
      codeExample: {
        title: "Your first React Native screen",
        code: `import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        My First React Native App
      </Text>

      <Text>Day 1 — React Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
});`,
      },
      keyTakeaways: [
        "`npx create-expo-app@latest` creates a new Expo React Native project.",
        "`npx expo start` starts the development environment.",
        "Test on both simulated and physical devices as your application becomes more complex.",
        "JavaScript-only changes and native dependency changes can have different rebuild requirements.",
        "The daily development loop is: edit → run → inspect → fix → repeat.",
      ],
      commonMistakes: [
        "<b>Only testing on a simulator</b> — physical devices reveal real performance, sensors, permissions and network behavior.",
        "<b>Changing native dependencies without rebuilding</b> — a development build may need to be regenerated when native code changes.",
        "<b>Trying to learn styling deeply on Day 1</b> — first understand the runtime and project workflow.",
        "<b>Ignoring build errors and only looking at JavaScript errors</b> — React Native applications can fail at both the JavaScript and native build layers.",
      ],
      quiz: [
        {
          question: "What is an Android Emulator?",
          options: [
            "A database",
            "A simulated Android device",
            "A JavaScript engine",
            "A React component",
          ],
          correctIndex: 1,
          explanation: "An Android Emulator simulates an Android device so you can run and test the application.",
        },
        {
          question: "Why should you eventually test on a physical device?",
          options: [
            "Because simulators cannot run React Native",
            "Because physical devices expose real performance, sensors, permissions and network behavior",
            "Because TypeScript only works on phones",
            "Because Expo requires a physical device",
          ],
          correctIndex: 1,
          explanation: "Physical devices can behave differently from simulators and emulators, especially for performance and hardware-dependent features.",
        },
        {
          question: "What may be required after adding a native dependency?",
          options: [
            "Deleting the project",
            "Creating or rebuilding a development build",
            "Replacing TypeScript",
            "Installing PostgreSQL",
          ],
          correctIndex: 1,
          explanation: "Native dependencies can require the native application to be rebuilt so the native code is included.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the most important difference between React and React Native?",
      options: [
        "React uses JavaScript while React Native does not",
        "React Native targets native mobile UI rather than the browser DOM",
        "React Native cannot use components",
        "React is only for TypeScript",
      ],
      correctIndex: 1,
      explanation: "React Native uses React concepts but targets native mobile UI rather than the browser DOM.",
    },
    {
      question: "Which component is commonly used instead of an HTML `div` in React Native?",
      options: [
        "View",
        "Div",
        "Container",
        "Section",
      ],
      correctIndex: 0,
      explanation: "View is one of React Native's fundamental UI components.",
    },
    {
      question: "Why is Expo a useful default for modern React Native projects?",
      options: [
        "It removes the need to learn React",
        "It provides tooling, native modules, configuration and build/deployment workflows",
        "It only works for prototypes",
        "It replaces iOS and Android",
      ],
      correctIndex: 1,
      explanation: "Expo provides a broad development and production workflow around React Native.",
    },
    {
      question: "What is JSI?",
      options: [
        "A JavaScript-to-native interoperability interface",
        "A database",
        "A navigation library",
        "A CSS syntax",
      ],
      correctIndex: 0,
      explanation: "JSI provides a low-level interface between the JavaScript runtime and native/C++ systems.",
    },
    {
      question: "What is Fabric?",
      options: [
        "The React Native rendering system",
        "A package manager",
        "An app store",
        "A testing library",
      ],
      correctIndex: 0,
      explanation: "Fabric is the modern rendering system used by React Native's New Architecture.",
    },
    {
      question: "What are TurboModules?",
      options: [
        "A native module system",
        "A React web router",
        "A CSS framework",
        "A database ORM",
      ],
      correctIndex: 0,
      explanation: "TurboModules are the modern native-module system in React Native's New Architecture.",
    },
    {
      question: "What is Metro responsible for?",
      options: [
        "Bundling JavaScript for React Native",
        "Managing PostgreSQL",
        "Rendering native buttons directly",
        "Submitting apps to stores",
      ],
      correctIndex: 0,
      explanation: "Metro is React Native's JavaScript bundler and development server.",
    },
    {
      question: "What is Hermes?",
      options: [
        "A JavaScript engine",
        "A navigation library",
        "A native database",
        "An iOS simulator",
      ],
      correctIndex: 0,
      explanation: "Hermes is the JavaScript engine used by modern React Native applications.",
    },
    {
      question: "What is the main purpose of a development build?",
      options: [
        "To provide a custom native application for development and debugging",
        "To replace the App Store",
        "To run PostgreSQL",
        "To compile TypeScript on the server",
      ],
      correctIndex: 0,
      explanation: "A development build is your own native application configured for development and debugging.",
    },
    {
      question: "Which EAS service creates application builds?",
      options: [
        "EAS Build",
        "EAS Submit",
        "EAS Update",
        "EAS Router",
      ],
      correctIndex: 0,
      explanation: "EAS Build creates installable iOS and Android builds.",
    },
  ],
  project: {
    name: "First React Native App",
    goal: "Create and run a small Expo React Native application while understanding the mobile runtime and development workflow.",
    brief: "Create a simple React Native app that displays a welcome screen, explains that it is running on React Native, and demonstrates that you can create a project, run it, edit the UI and inspect the result on a simulator, emulator or physical device.",
    steps: [
      "Create a new Expo project using `npx create-expo-app@latest`.",
      "Start the project with `npx expo start`.",
      "Open the application on an iOS Simulator, Android Emulator, or physical device.",
      "Replace the starter screen with a simple `View` containing a title and description.",
      "Add a small section explaining: `React Native is not a browser DOM; it renders native mobile UI.`",
      "Run the application again after changing the text and confirm the development loop works.",
      "Open the project and identify where the Expo configuration, application code and package dependencies are located.",
      "Write a short note in your own words explaining the roles of React, Hermes, Metro, Fabric, TurboModules and EAS.",
    ],
    acceptance: [
      "The application starts successfully on at least one simulator, emulator or physical device.",
      "The screen contains a `View` and multiple `Text` components.",
      "Changing the source code updates the running development application.",
      "You can explain why React Native does not use the browser DOM for normal native mobile rendering.",
      "You can explain the difference between Expo Go and a development build.",
      "You can explain the basic roles of Metro, Hermes, Fabric, TurboModules and EAS.",
      "No custom native module or advanced library is required for this project.",
    ],
    stretch: [
      "Run the same project on both iOS and Android and note one visible platform difference.",
      "Generate native projects with `npx expo prebuild` and inspect the generated `ios/` and `android/` directories.",
      "Create a development build and compare it conceptually with Expo Go.",
      "Draw your own diagram showing the path from TypeScript source code to the native device UI.",
    ],
  },
});
