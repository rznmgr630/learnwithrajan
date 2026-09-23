import type { LessonDay, LessonQuizQuestion } from "@/lib/learn/lesson-types";
import type { LocalizedString } from "@/lib/i18n/types";

const local = (en: string): LocalizedString => ({ en, np: en, jp: en });
const check = (question: string, explanation: string): LessonQuizQuestion => ({
  question: local(question),
  options: [local(explanation)],
  correctIndex: 0,
  explanation: local(explanation),
});

export const REACT_NATIVE_PHASE_0_LESSONS: LessonDay = {
  day: 0,
  title: local("Phase 0 — Before You Start"),
  totalMinutes: 60,
  difficulty: local("Beginner"),
  lessons: [
    {
      id: "react-prerequisites",
      title: local("React fundamentals you must already know"),
      durationMinutes: 18,
      explanation: local("<b>React Native is built on React</b>, so this track assumes you can already build a small React application. If React is shaky, strengthen it before learning mobile-specific concepts.\n\n### Components, JSX, props, and children\n\nA <b>component</b> is a reusable piece of UI and behavior. Be comfortable with function components, composing small components into bigger ones, JSX expressions, conditional rendering, fragments, props, and children.\n\n### State and effects\n\nKnow \`useState\`, \`useEffect\`, \`useRef\`, \`useMemo\`, and \`useCallback\`. Use an effect to synchronize with an external system, not as a general place for code after rendering. Understand Context, custom hooks, stable list keys, controlled inputs, and uncontrolled inputs."),
      diagram: "Parent Component\n      │\n      ├── props ──→ Child Component\n      ├── Context ─→ Descendant Components\n      ├── state ──→ re-render\n      └── custom hooks → reusable behavior",
      codeExample: { title: local("A small React component"), code: "import { useState } from \"react\";\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount((value) => value + 1)}>Count: {count}</button>;\n}" },
      keyTakeaways: ["React Native assumes React knowledge.", "Know components, JSX, props, state, hooks, lists, and forms.", "Use Context and custom hooks as architectural tools."].map(local),
      commonMistakes: ["Trying to learn React and React Native at the same time.", "Using useEffect for calculations that do not synchronize with an external system.", "Using array indexes as keys when stable identifiers exist."].map(local),
      quiz: [check("Why is React knowledge a prerequisite?", "React Native uses React's component model, JSX, state, hooks, and rendering concepts.")],
    },
    {
      id: "javascript-typescript-prerequisites",
      title: local("JavaScript and TypeScript fundamentals"),
      durationMinutes: 15,
      explanation: local("<b>React Native code is still JavaScript or TypeScript.</b> Be comfortable with variables, scope, functions, objects, arrays, destructuring, modules, error handling, closures, and modern syntax.\n\n### Promises and async/await\n\nMobile applications constantly perform asynchronous work: API requests, authentication, file operations, storage, and native API calls. Understand Promises, \`async\`/\`await\`, \`try/catch\`, and how errors propagate.\n\n### JSON and TypeScript\n\nRead and write nested JSON, but do not assume API data is trustworthy or correctly typed. Define types and interfaces, type parameters and return values, unions, optional properties, basic generics, and safely narrow \`unknown\` values."),
      diagram: "User action\n    │\n    ├── async operation → Promise → result / error\n    └── JSON data ← API",
      codeExample: { title: local("Validate API data at runtime"), code: "type User = { id: string; name: string };\n\nasync function fetchUser(): Promise<User> {\n  const response = await fetch(\"https://example.com/api/user\");\n  if (!response.ok) throw new Error(\"Request failed\");\n  const data: unknown = await response.json();\n  return data as User;\n}" },
      keyTakeaways: ["Strong JavaScript and TypeScript fundamentals still matter.", "Promises and async/await are essential for mobile operations.", "TypeScript does not validate runtime JSON."].map(local),
      commonMistakes: ["Using any everywhere.", "Forgetting rejected Promises.", "Assuming API data matches its TypeScript type."].map(local),
      quiz: [check("Does TypeScript automatically validate API JSON?", "No. Types are compile-time information; important runtime data still needs validation.")],
    },
    {
      id: "mobile-platform-basics",
      title: local("Understand mobile platforms before writing mobile code"),
      durationMinutes: 10,
      explanation: local("<b>React Native does not turn iOS and Android into the same platform.</b> It gives you shared React-based code while your app still runs on two different operating systems.\n\nSimulators and emulators help development, but real devices are essential for hardware behavior, performance, permissions, cameras, biometrics, notifications, sensors, networking, battery behavior, and platform-specific problems.\n\niOS and Android have different APIs, lifecycles, permission systems, build systems, signing, navigation conventions, background rules, and native tooling. Know that <b>foreground</b> means active, <b>background</b> means not visible with limited execution, and <b>killed</b> means the process has ended."),
      diagram: "Mobile Application\n       │\n  ┌────┴────┐\n iOS     Android\n  │          │\nSimulator  Emulator\n  └────┬────┘\n React Native\n Shared JS/TS",
      codeExample: { title: local("Check the current platform"), code: "import { Platform, Text } from \"react-native\";\n\nexport function PlatformMessage() {\n  return <Text>Running on: {Platform.OS}</Text>;\n}" },
      keyTakeaways: ["A simulator or emulator is not a complete replacement for real hardware.", "iOS and Android genuinely behave differently.", "Shared code does not remove platform-specific concerns."].map(local),
      commonMistakes: ["Assuming iOS behavior matches Android.", "Testing only in a simulator or emulator.", "Ignoring platform differences until the end of a project."].map(local),
      quiz: [check("Why does React Native still require iOS and Android knowledge?", "Shared React code does not remove differences in APIs, lifecycle, permissions, builds, signing, and native behavior.")],
    },
    {
      id: "development-tools",
      title: local("Set up the tools you will use throughout the track"),
      durationMinutes: 12,
      explanation: local("<b>Your development environment should be ready before Day 1.</b> This separates tooling problems from application-learning problems.\n\nBe comfortable with Git branches, commits, diffs, pulls, basic conflicts, and returning to a known state. Use the terminal to navigate folders, run package-manager commands, read output, set environment variables, and restart development processes.\n\nOn macOS, install Xcode and launch an iOS Simulator. Install Android Studio, the required Android SDK components, and launch at least one Android Emulator. You do not need mastery of native IDEs yet, only a working baseline."),
      diagram: "Your computer\n   ├── Xcode → iOS Simulator\n   ├── Android Studio → Android Emulator\n   └── Git → React Native app",
      codeExample: { title: local("Readiness commands"), code: "git --version\nnode --version\nnpm --version\nnpx expo --version" },
      keyTakeaways: ["Have Git and a comfortable terminal workflow.", "Verify Xcode and an iOS Simulator on macOS.", "Verify Android Studio and an Android Emulator.", "A working baseline is enough before Day 1."].map(local),
      commonMistakes: ["Starting before a simulator or emulator boots.", "Treating native build errors as application-code problems.", "Skipping Git because the project is for learning."].map(local),
      quiz: [check("Do you need to master Xcode and Android Studio before starting?", "No. You need a working baseline and basic familiarity; deeper native tooling comes later.")],
    },
  ],
  finalQuiz: [
    check("What should you do if React fundamentals are shaky?", "Strengthen React first."),
    check("What lifecycle terms should you know before Day 1?", "Foreground, background, and killed."),
    check("What tools should be ready before starting?", "Git, a terminal, Xcode and an iOS Simulator on macOS, plus Android Studio and an Android Emulator."),
  ],
  project: {
    name: local("React Native Readiness Check"),
    goal: local("Verify that your React, JavaScript or TypeScript, mobile, and tooling foundations are ready for this track."),
    brief: local("Before Day 1, verify every prerequisite. You should be able to explain React state and effects, async code, runtime JSON validation, mobile platform differences, lifecycle states, and your development tools."),
    steps: ["Build a tiny React component using props, state, a list, a custom hook, and an event handler.", "Write one async TypeScript function with explicit error handling.", "Launch an iOS Simulator on macOS and an Android Emulator.", "Make a Git commit containing your readiness notes."].map(local),
    acceptance: ["You can explain the required React concepts without a tutorial.", "You can write basic asynchronous TypeScript.", "You understand JSON as runtime data, not guaranteed TypeScript data.", "Git and your simulator or emulator are working."].map(local),
    stretch: ["Test the same small React concept in a browser and describe what changes in React Native.", "Connect a physical device and identify one behavior that differs from an emulator or simulator."].map(local),
  },
};
