import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 1 — Getting Started · course meta (mirrors intro / prerequisites / how-to sections). */
export const REACT_NATIVE_DAY_1_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "This roadmap follows the classic **Ultimate React Native Part 1** opening: introductions, prerequisites, how to consume the lessons, learning paths, and where source code lives. Treat each day modal as lecture notes—you still run demos on your machine.",
      np: "अन्तिम RN पाठ १ को सुरुवात — आफ्नो मेसिनमा चलाइ हेर्नुहोस्।",
      jp: "**Ultimate RN** 前半と同様の構成で、概要・前提・学び方・パス・ソースについて整理します。手を動かすのは自分の環境で。",
    },
  ],
  sections: [
    {
      title: { en: "Introduction", np: "परिचय", jp: "イントロダクション" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**React Native** lets teams ship **iOS + Android UIs from one codebase**, using React’s component model. You are not manipulating the DOM—you drive **native views** (UILabel, UIButton equivalents) from JavaScript. Expect **Metro**, **Simulator/Emulator/Device** loops, and later **stores + OTA updates**.",
            np: "RN ले एक कोडको साथ iOS र Android चलाउँछ।",
            jp: "ひとつの **JavaScript/React** レイヤが **両OSのネイティブ UI** に橋渡しします。**DOM はありません**。",
          },
        },
      ],
    },
    {
      title: { en: "Prerequisites", np: "पूर्वआवश्यकता", jp: "前提知識" },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**JavaScript fundamentals** — closures, async/await, modules (`import/export`). TypeScript familiarity helps but strict typing can grow with the project.",
              np: "JS र async/await — TS लाभकारी।",
              jp: "**JS と async/await** は必須。**TypeScript** は徐々で可。",
            },
            {
              en: "**React basics** — components, JSX, hooks (`useState`, `useEffect`), lifting state.",
              np: "React उपकरणहरू।",
              jp: "**コンポーネント・JSX・フック** が分かれば十分スタートできます。",
            },
            {
              en: "**Terminal comfort** plus optional **brew**/**choco** installs; Xcode (macOS only for iOS) and Android SDK for emulators.",
              np: "टर्मिनल, Xcode/Android।",
              jp: "ターミナル操作。**iOS は macOS + Xcode**。Android は SDK / Studio。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "How to Use This Course",
        np: "पाठको प्रयोग",
        jp: "このコースの使い方",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "**Skim headings first** → open modal sections that match video chapters if you paired this with lectures.",
              np: "पहिले शीर्षक पढ्नुहोस्।",
              jp: "見出しを先にざっと見てから中身へ。動画があるならチャプターに対応。",
            },
            {
              en: "**Type every snippet** rather than blindly pasting—you learn Metro errors and JSX typos.",
              np: "टाइप गर्नुहोस् — टायपोले सिकाउँछ।",
              jp: "**手で打つ** と Metro のエラー慣れが進みます。",
            },
            {
              en: "**Check off a day** only after emulator/device steps succeeded *and* you can explain FAQs without reading.",
              np: "FAQ बिना भन्न मिल्छ भने टिक गर्नुहोस्।",
              jp: "実機確認と「自分の言葉での説明」ができてから完了に。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Learning Paths", np: "सिकाइ बाटाहरू", jp: "ラーニングパス" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Linear path**: Days 1–14 ≈ RN Part 1 (UI layer + forms); Days 15–20 Part 2 (native capabilities, navigation, API, offline/auth/push/store). Jump to **Networking** early if you prototype against a REST backend—come back for layout polish.",
            np: "१–१४ UI; १५–२० नेटिव।",
            jp: "**1〜14** が前半（UI〜フォーム）、**15〜20** がネイティブ・ナビ・API 等。**API が先**なら一時ジャンプも可。",
          },
        },
      ],
    },
    {
      title: { en: "Follow Me Around", np: "सँग चलाइ", jp: "一緒に進めるとき" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "If you shadow a tutor’s IDE, duplicate their **exact SDK + Expo/React Navigation versions**. When imports fail, freeze versions in `package.json` and reinstall `node_modules`—Part 2 has a revisit on **Auto Import** quirks.",
            np: "संस्करण एउटै राख्नुहोस्।",
            jp: "講師と**同じバージョン固定**。**自動インポート**の問題は後半でも触れます。",
          },
        },
      ],
    },
    {
      title: { en: "Source Code", np: "स्रोत कोड", jp: "ソースコード" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Mirror the course repo structure locally: **`/screens`** for route targets, **`/components`** for reusable primitives, **`/navigation`** once stacks/tabs arrive. Fork early so merges from upstream course fixes do not scramble your homework.",
            np: "फाइलहरू गुच्छेदार फोल्डरमा।",
            jp: "**screens / components / navigation** と分けるのが王道。自分用に早めにフォークすると安全です。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Can I skip to Day 15 if UI work bores me?",
        np: "१५मा हाम फाल्न?",
        jp: "UI を飛ばして 15 日目から？",
      },
      answer: {
        en: "You can skim **flex + lists + forms** (Days 8–13) briefly, but **navigation + native modules assume you know JSX layout**—budget at least skim time before Part 2.",
        np: "Flex र फर्म छिटफुट चाहिए।",
        jp: "**レイアウトとリスト**の概要は読んでおくと後半が破綻しません。",
      },
    },
  ],
};
