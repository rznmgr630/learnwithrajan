import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_NATIVE_DAY_0_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "<b>Phase 0 is a readiness check, not a learning day.</b> React Native builds on React, JavaScript or TypeScript, mobile platform awareness, and a working toolchain. If one of these foundations feels shaky, strengthen it before Day 1.",
      np: "<b>Phase 0 तयारी जाँच हो, सिकाइ दिन होइन।</b> Day 1 अघि React, JavaScript वा TypeScript, मोबाइल प्लेटफर्म र टुलहरू तयार राख्नुहोस्।",
      jp: "<b>Phase 0 は学習日ではなく、準備チェックです。</b> Day 1 の前に React、JavaScript または TypeScript、モバイルの基礎、開発環境を整えます。",
    },
  ],
  sections: [
    {
      title: { en: "React fundamentals", np: "React आधार", jp: "React の基礎" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>React Native is built on React.</b> You should already be comfortable creating function components, composing them, and using JSX to describe UI. Know props and children, conditional rendering, fragments, and how a component describes a screen.",
            np: "<b>React Native, React मै बनेको छ।</b> function component, JSX, props, children र conditional rendering सहज हुनुपर्छ।",
            jp: "<b>React Native は React の上にあります。</b> 関数コンポーネント、JSX、props、children、条件付き表示を自然に使える状態で始めましょう。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            { en: "<b>State and effects:</b> `useState`, `useEffect`, `useRef`, `useMemo`, and `useCallback`. Use an effect to synchronize with an external system, not as a general place for code after rendering.", np: "`useState`, `useEffect`, `useRef`, `useMemo`, `useCallback` बुझ्नुहोस्।", jp: "`useState`、`useEffect`、`useRef`、`useMemo`、`useCallback` を理解します。`useEffect` は外部システムとの同期用です。" },
            { en: "<b>Reusable logic:</b> Context, when it is the wrong tool, and custom hooks for reusable behavior.", np: "Context र custom hook कहिले प्रयोग गर्ने जान्नुहोस्।", jp: "Context とカスタムフックを、使いどころも含めて理解します。" },
            { en: "<b>Lists and forms:</b> stable keys, controlled inputs where React state is the source of truth, and uncontrolled inputs that retain their own value.", np: "स्थिर key र controlled वा uncontrolled input फरक बुझ्नुहोस्।", jp: "安定した key、制御コンポーネントと非制御コンポーネントの違いを理解します。" },
            { en: "<b>Modern React:</b> know the purpose of `useEffectEvent`, `useActionState`, `useOptimistic`, `useTransition`, and Suspense-based fetching. The mobile-specific parts return later in this track.", np: "आधुनिक React API को उद्देश्य चिन्नुहोस्।", jp: "新しい React API の目的を把握します。モバイル向けの使い方はこのトラックで後ほど学びます。" },
          ],
        },
        {
          type: "code",
          title: { en: "A small React component", np: "सानो React component", jp: "小さな React コンポーネント" },
          code: `import { useState } from "react";

type CounterProps = { initialValue?: number };

export function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <button onClick={() => setCount((current) => current + 1)}>
      Count: {count}
    </button>
  );
}`,
        },
      ],
    },
    {
      title: { en: "JavaScript and TypeScript fundamentals", np: "JavaScript र TypeScript आधार", jp: "JavaScript と TypeScript の基礎" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>React Native code is still JavaScript or TypeScript.</b> Be comfortable with variables, scope, functions, objects, arrays, destructuring, modules, errors, closures, and modern syntax. Mobile apps constantly do work that completes later, such as API requests, authentication, file access, storage, and native API calls.",
            np: "<b>React Native कोड JavaScript वा TypeScript नै हो।</b> async काम, API, auth, file र storage का लागि भाषाको आधार चाहिन्छ।",
            jp: "<b>React Native のコードは JavaScript または TypeScript です。</b> 非同期処理、API、認証、ファイル、保存領域に必要な言語の基礎を固めます。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            { en: "<b>Async work:</b> understand Promises, `async`/`await`, `try`/`catch`, and how errors move through asynchronous code.", np: "Promise, `async`/`await`, `try`/`catch` बुझ्नुहोस्।", jp: "Promise、`async`/`await`、`try`/`catch` と非同期エラーの流れを理解します。" },
            { en: "<b>API data:</b> read and write nested JSON, but do not assume JSON received from an API is trustworthy or correctly typed.", np: "API बाट आएको JSON लाई सधैँ सही type भएको नठान्नुहोस्।", jp: "API からの JSON は、正しい型や安全性が保証されているとは考えません。" },
            { en: "<b>TypeScript:</b> define types and interfaces, function parameters and return values, unions, optional properties, basic generics, and safe narrowing of `unknown` values.", np: "type, interface, union, optional property र `unknown` narrowing अभ्यास गर्नुहोस्।", jp: "型、interface、union、オプショナルプロパティ、基本的な generics、`unknown` の安全な絞り込みを使います。" },
          ],
        },
        {
          type: "code",
          title: { en: "Validate API data at runtime", np: "Runtime मा API data जाँच", jp: "API データを実行時に検証する" },
          code: `type User = { id: string; name: string };

async function fetchUser(): Promise<User> {
  const response = await fetch("https://example.com/api/user");
  if (!response.ok) throw new Error(\`Request failed: \${response.status}\`);

  const data: unknown = await response.json();
  if (typeof data !== "object" || data === null || !("id" in data) || !("name" in data)) {
    throw new Error("Invalid user response");
  }

  return data as User;
}`,
        },
      ],
    },
    {
      title: { en: "Mobile platform basics", np: "मोबाइल प्लेटफर्म आधार", jp: "モバイルプラットフォームの基礎" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>React Native does not make iOS and Android the same platform.</b> It gives you a shared React-based development model while your app still runs on two different operating systems with different APIs, lifecycles, permissions, builds, signing, navigation conventions, and background rules.",
            np: "<b>React Native ले iOS र Android एउटै बनाउँदैन।</b> कोड साझा भए पनि API, lifecycle, permission र build नियम अलग हुन्छन्।",
            jp: "<b>React Native は iOS と Android を同じプラットフォームにしません。</b> コードは共有できますが、API、ライフサイクル、権限、ビルドのルールは異なります。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            { en: "<b>Simulator and emulator:</b> useful development environments, but not complete replacements for physical hardware.", np: "Simulator वा emulator विकासका लागि उपयोगी हो, वास्तविक फोनको पूरा विकल्प होइन।", jp: "Simulator と Emulator は便利ですが、実機の完全な代替ではありません。" },
            { en: "<b>Real devices:</b> test hardware, performance, permissions, cameras, biometrics, notifications, sensors, networking, battery behavior, and platform-specific problems.", np: "वास्तविक device मा hardware र permission जाँच्नुहोस्।", jp: "実機ではハードウェア、性能、権限、カメラ、生体認証、通知などを確認します。" },
            { en: "<b>Lifecycle vocabulary:</b> foreground means active for the user, background means not visible with limited execution, and killed means the process has ended and must start again.", np: "foreground, background र killed को अर्थ जान्नुहोस्।", jp: "foreground、background、killed の意味を大まかに理解します。" },
          ],
        },
        {
          type: "code",
          title: { en: "Check the current platform", np: "हालको platform जाँच", jp: "現在のプラットフォームを確認する" },
          code: `import { Platform, Text } from "react-native";

export function PlatformMessage() {
  return <Text>Running on: {Platform.OS}</Text>;
}`,
        },
      ],
    },
    {
      title: { en: "Development tools", np: "विकास टुलहरू", jp: "開発ツール" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Your environment should work before Day 1.</b> This keeps basic setup failures separate from the React Native concepts you are learning. You do not need to be an Xcode or Android Studio expert yet, but you need a working baseline.",
            np: "<b>Day 1 अघि environment चल्नुपर्छ।</b> Xcode वा Android Studio को विशेषज्ञ हुनुपर्दैन, काम गर्ने आधार चाहिन्छ।",
            jp: "<b>Day 1 の前に環境を動かします。</b> Xcode や Android Studio の専門家になる必要はありませんが、動く土台が必要です。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            { en: "<b>Git:</b> create branches, commit changes, inspect diffs, pull updates, resolve basic conflicts, and return to a known state.", np: "Git branch, commit, diff र basic conflict समाधान सहज बनाउनुहोस्।", jp: "Git で branch、commit、diff、pull、基本的な conflict 解消を行えるようにします。" },
            { en: "<b>Terminal:</b> navigate directories, run package-manager commands, read command output, set environment variables when needed, and restart development processes.", np: "terminal मा folder सर्न, command चलाउन र output पढ्न सक्नुहोस्।", jp: "ターミナルで移動、パッケージコマンド実行、出力確認、再起動を行います。" },
            { en: "<b>Xcode:</b> on macOS, install it and launch an iOS Simulator. Later it supports native debugging, signing, builds, logs, and platform-specific work.", np: "macOS मा Xcode install गरेर iOS Simulator चलाउनुहोस्।", jp: "macOS では Xcode を入れ、iOS Simulator を起動します。" },
            { en: "<b>Android Studio:</b> install the Android SDK components and launch at least one Android Emulator.", np: "Android Studio र SDK install गरेर एउटा Emulator चलाउनुहोस्।", jp: "Android Studio と SDK を入れ、少なくとも 1 台の Emulator を起動します。" },
          ],
        },
        {
          type: "code",
          title: { en: "Readiness commands", np: "तयारी जाँच command", jp: "準備確認コマンド" },
          code: `git --version
node --version
npm --version
npx expo --version`,
        },
      ],
    },
    {
      title: { en: "Ready for Day 1?", np: "Day 1 का लागि तयार?", jp: "Day 1 の準備はできた？" },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            { en: "Build a tiny React component using props, state, a list, a custom hook, and an event handler.", np: "props, state, list र custom hook सहित सानो React component बनाउनुहोस्।", jp: "props、state、list、カスタムフック、イベントを使った小さな React コンポーネントを作ります。" },
            { en: "Write one asynchronous TypeScript function with `async`/`await` and explicit error handling.", np: "`async`/`await` र error handling सहित एउटा function लेख्नुहोस्।", jp: "`async`/`await` と明示的なエラー処理を含む TypeScript 関数を 1 つ書きます。" },
            { en: "Launch an iOS Simulator on macOS and an Android Emulator, then make a basic Git commit with your readiness notes.", np: "macOS मा iOS Simulator र Android Emulator चलाएर readiness note को Git commit बनाउनुहोस्।", jp: "macOS では iOS Simulator と Android Emulator を起動し、準備メモを Git commit します。" },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "Should I learn React and React Native at the same time?", np: "React र React Native सँगै सिक्ने?", jp: "React と React Native を同時に学ぶべき？" },
      answer: { en: "No. Strengthen React first. React Native uses React's component model, JSX, state, hooks, and rendering concepts.", np: "होइन। पहिले React बलियो बनाउनुहोस्।", jp: "いいえ。先に React を固めましょう。React Native は React のコンポーネント、JSX、state、hooks を使います。" },
    },
    {
      question: { en: "Does TypeScript validate API JSON automatically?", np: "TypeScript ले API JSON आफैँ validate गर्छ?", jp: "TypeScript は API の JSON を自動検証する？" },
      answer: { en: "No. TypeScript types are compile-time information. Validate runtime data when correctness matters.", np: "गर्दैन। महत्वपूर्ण data runtime मा जाँच्नुपर्छ।", jp: "しません。TypeScript の型はコンパイル時の情報なので、重要なデータは実行時に検証します。" },
    },
  ],
};
