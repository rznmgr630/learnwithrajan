import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 3 — Setting up · first app · Metro / Fast Refresh. */
export const REACT_NATIVE_DAY_3_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Covers **Setting Up the Development Environment** + **Your First App** + how **Metro/Fast Refresh** accelerates edits.",
      np: "वातावरण र पहिलो एप।",
      jp: "**環境構築** と **最初のアプリ**、**Metro と Fast Refresh** へ。",
    },
  ],
  sections: [
    {
      title: {
        en: "Setting Up the Development Environment",
        np: "विकास वातावरण",
        jp: "開発環境のセットアップ",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Install **Node LTS**, watchman (macOS), **Xcode** + command-line tools + accepting licenses, Android Studio SDK + emulator image.",
              np: "Node LTS / Xcode / Android SDK।",
              jp: "**Node LTS**、Watchman。**Xcode**。**Android Studio** とエミュ画像。",
            },
            {
              en: "**`npm i -g eas-cli`** later for cloud builds—you can postpone until Distribution day.",
              np: "EAS पछि।",
              jp: "**eas-cli** は配布編まで後回し可。",
            },
            {
              en: "**Java / JDK alignment** matters for Gradle—match Android Studio bundled JDK if Gradle errors appear.",
              np: "JDK मेल खान्छ।",
              jp: "**JDK** は Android Studio と揃えると Gradle が安定しやすいです。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Your First App", np: "पहिलो एप", jp: "最初のアプリ" },
      blocks: [
        {
          type: "code",
          title: { en: "Expo scaffold", np: "Expo थाल्नु", jp: "Expo 作成" },
          code: `# stable template (SDK matches install instructions)
npx create-expo-app@latest storefront
cd storefront
npx expo start`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Press `i` / `a`** in CLI for Simulator/Emulator after they boot. Scan QR only with **camera / Expo Go** when using development servers on LAN—watch firewall prompts.",
            np: "`i` / `a` जाल।",
            jp: "CLI で **`i`/`a`**。QR は同一ネットワークで。",
          },
        },
      ],
    },
    {
      title: { en: "Metro & Fast Refresh (preview)", np: "Metro", jp: "Metro と Fast Refresh" },
      blocks: [
        { type: "diagram", id: "react-native-metro-fast-refresh" },
        {
          type: "paragraph",
          text: {
            en: "**Fast Refresh** survives many local state updates when you tweak JSX—it **drops state** only when signatures change materially. Shake device / `⌘D` exposes dev menu refreshes.",
            np: "रिफ्रेस स्थिति जोगाउँछ यदि हस्ताक्षर मिल्छ।",
            jp: "**Fast Refresh** は可能なら状態維持。振ってデベロッパメニューを出せます。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Bundler stuck at 99%?",
        np: "99% टङ्क?",
        jp: "99% で止まる",
      },
      answer: {
        en: "**Clear caches**: `rm -rf .expo` + reinstall node_modules ; ensure **Metro** not blocked by antivirus scanning huge `node_modules`.",
                            np: "क्याश मेटाएर पुन स्थापना।",
        jp: "キャッシュ削除・プロセス検索・アンチウイルスの除外などを確認。",
      },
    },
  ],
};
