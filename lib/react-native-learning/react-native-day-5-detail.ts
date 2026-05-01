import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 5 — logging · debugging · publishing intro · auto import. */
export const REACT_NATIVE_DAY_5_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Logging**, **Debugging in Chrome**, **Debugging in VS Code**, **`expo publish` / preview channels mentality**, plus **Fixing the Auto Import Issue**—matching the tooling tail of Getting Started chapters.",
                            np: "लग डिबग VSCode प्रकाशित।",
      jp: "**ログ・Chrome/VS Code デバッグ・公開メンタルモデル・自動インポート**の整理。",
    },
  ],
  sections: [
    {
      title: { en: "Logging", np: "Logging", jp: "ロギング" },
      blocks: [
        {
          type: "code",
          title: { en: "Prefer structured prefixes", np: "संरचित लग", jp: "整形ログ" },
          code: `import { Platform } from 'react-native';

const tag = '[Auth]';

export function logAuth(message: string, data?: unknown) {
  if (__DEV__) {
    console.log(tag, Platform.OS, message, data ?? '');
  }
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Flipper / Reactotron** optional—courses often rely on **`console.log` + breakpoints** early. Strip noisy logs before release builds.",
                            np: "रिलिजअघि हटाएर।",
              jp: "本番前にログを過剰に残さない。**Flipper** 等は後から。",
          },
        },
      ],
    },
    {
      title: {
        en: "Debugging in Chrome",
        np: "Chrome डिबग",
        jp: "Chrome でデバッグ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Open developer menu → **Debug JS Remotely** (classic) or Hermes-aware **Chrome DevTools**. Remember **network latency differs** vs device-only JS debugger—prefer **wired Metro** profiling for perf bugs.",
                            np: "नेट कार्य डिभाइससँग भिन्न।",
              jp: "リモートデバッグは**ネットワーク・タイミング**が変わり得ます。パフォ問題は別手段も。",
          },
        },
      ],
    },
    {
      title: {
        en: "Debugging in VSCode",
        np: "VSCode डिबग",
        jp: "VS Code でデバッグ",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`.vscode/launch.json`** attaches to Expo/Metro—you may need **`expo-router` / RN extension pack** combos depending on toolchain year.",
                                  np: "launch.json उपयोग।",
              jp: "**launch.json** で Metro にアタッチ。プロジェクトごとに拡張の組み合わせあり。",
            },
            {
              en: "**Source maps** enable stepping TypeScript—not bundler min lines.",
                                  np: "सोर्स म्याप ध्यान।",
              jp: "**ソースマップ** で TS 行に止まれるか確認。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Publishing", np: "प्रकाशन", jp: "公開（Publishing）" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Modern stacks favor **Expo Updates / EAS Update** profiles—traditional **`expo publish`** concepts map to channels + manifests. Coordinate **OTA vs store review boundaries**.",
                            np: "अप्डेट्स बनाम स्टोर।",
              jp: "**チャネル + manifest** と **OTA の範囲** を把握（詳細は配布編）。",
          },
        },
        { type: "diagram", id: "react-native-release-pipeline" },
      ],
    },
    {
      title: {
        en: "Fixing the Auto Import Issue",
        np: "स्व इम्पोर्ट ठिक",
        jp: "自動インポートの修正",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Path aliases**: ensure `tsconfig.json` **`paths`** + Metro resolver **`babel-plugin-module-resolver`** stay synchronized—imports from `@/components` confuse editors when only TS knows aliases.",
                                  np: "paths र Metro एकै भए।",
              jp: "tsconfig の paths と Metro/Babel がずれると自動インポートが壊れがちです。",
            },
            {
              en: "**Default export preference** conflicts with barrel files—explicit named exports reduce circular import loops.",
                                  np: "ब्यारेल सावधानी।",
              jp: "index.ts バレルは循環や補完の混乱の元。名前付き export が安定しやすいです。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Hermes breakpoints weird?",
        np: "Hermes ब्रेक त्रासदी?",
        jp: "Hermes でブレークがおかしい",
      },
      answer: {
        en: "**Disable minify in debug**, prefer **Flipper inspector** attach, rebuild dev client—Hermes bytecode mapping occasionally lags tooling versions.",
                                    np: "डिभ मिनफाइ घटाओ।",
        jp: "デバッグでは **ミニファイ無効化**。**Dev Client を再ビルド** でマッピングを揃えます。",
      },
    },
  ],
};
