import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapTag } from "@/lib/challenge-data";

const RN_TAG: Record<string, LocalizedString> = {
  expo: { en: "Expo", np: "Expo", jp: "Expo" },
  fundamentals: { en: "fundamentals", np: "आधार", jp: "基礎" },
  metro: { en: "Metro", np: "Metro", jp: "Metro" },
  toolchain: { en: "tooling", np: "टुल", jp: "ツールチェーン" },
  "core-ui": { en: "core UI", np: "कोर UI", jp: "コアUI" },
  jsx: { en: "JSX", np: "JSX", jp: "JSX" },
  flexbox: { en: "flexbox", np: "फ्लेक्स", jp: "flexbox" },
  styling: { en: "styling", np: "शैली", jp: "スタイル" },
  navigation: { en: "navigation", np: "नेभिगेशन", jp: "ナビ" },
  screens: { en: "screens", np: "स्क्रिन", jp: "画面" },
  lists: { en: "lists", np: "सूची", jp: "リスト" },
  forms: { en: "forms", np: "फर्म", jp: "フォーム" },
  inputs: { en: "inputs", np: "इन्पुट", jp: "入力" },
  networking: { en: "networking", np: "नेटवर्क", jp: "ネットワーク" },
  caching: { en: "offline", np: "अफलाइन", jp: "オフライン" },
  auth: { en: "auth", np: "प्रमाणीकरण", jp: "認証" },
  native: { en: "native APIs", np: "नेटिव", jp: "ネイティブAPI" },
  shipping: { en: "ship", np: "रिलिज", jp: "リリース" },
  permissions: { en: "permissions", np: "अनुमति", jp: "権限" },
  notifications: { en: "push", np: "सूचना", jp: "通知" },
  platform: { en: "platform", np: "प्लेटफर्म", jp: "プラットフォーム" },
  performance: { en: "performance", np: "कार्यप्रदर्शन", jp: "パフォーマンス" },
  hooks: { en: "hooks", np: "हुक", jp: "フック" },
};

export function reactNativeTags(slugs: [string, string]): RoadmapTag[] {
  return [
    { slug: slugs[0], label: RN_TAG[slugs[0]] ?? { en: slugs[0], np: slugs[0], jp: slugs[0] } },
    { slug: slugs[1], label: RN_TAG[slugs[1]] ?? { en: slugs[1], np: slugs[1], jp: slugs[1] } },
  ];
}

const RN_DAY_TITLE: Record<number, LocalizedString> = {
  1: {
    en: "Course intro — how to use this track, prerequisites & learning paths",
    np: "परिचय, शर्त र बाटो।",
    jp: "コースの使い方・前提・学び方",
  },
  2: {
    en: "What React Native is & why Expo fits beginners",
    np: "RN र Expo फिलसफी।",
    jp: "React Native と Expo の位置づけ",
  },
  3: {
    en: "Dev environment & your first runnable screen",
    np: "वातावरण र पहिलो एप।",
    jp: "開発環境と最初のアプリ",
  },
  4: {
    en: "Simulator, emulator & real device installs",
    np: "सिम, इमुलेटर, फोन।",
    jp: "シミュレータ・エミュレータ・実機",
  },
  5: {
    en: "Logging & debugging — Chrome, VS Code, Expo publish quirks",
    np: "लग, डिबग, पब्लिश।",
    jp: "ログ・デバッグ・公開まわり",
  },
  6: {
    en: "Core APIs — View, Text, Image in practice",
    np: "View, Text, Image।",
    jp: "View・Text・Image",
  },
  7: {
    en: "Touch targets, alerts, StyleSheet & platform branches",
    np: "टच, अलर्ट, स्टाइलशीट।",
    jp: "タッチ・アラート・StyleSheet・分岐",
  },
  8: {
    en: "Dimensions, orientation & the full Flexbox toolkit",
    np: "डाइमेन्सन र फ्लेक्स।",
    jp: "寸法・向き変更・Flex の全体像",
  },
  9: {
    en: "Layout exercises — welcome & view-image flows, refactoring mindset",
    np: "स्वागत र स्क्रिन अभ्यास।",
    jp: "ウェルカム/画像画面・リファクタ",
  },
  10: {
    en: "Styling — borders, shadows, spacing, typography, encapsulation & icons",
    np: "सीमा, छाया, मार्जिन।",
    jp: "線・影・余白・文字・アイコン",
  },
  11: {
    en: "Lists — FlatList, separators, gestures, swipe & pull-to-refresh",
    np: "फ्लाटलिस्ट र जेस्चर।",
    jp: "FlatList・区切り・スワイプ・更新",
  },
  12: {
    en: "Input primitives — TextInput, Switch, Picker & Modal patterns",
    np: "टेक्स्टइनपुट, स्विच, पिकर।",
    jp: "TextInput・Switch・Picker・Modal",
  },
  13: {
    en: "Forms — Formik, Yup, reusable Field & Submit components",
    np: "Formik र Yup।",
    jp: "Formik・Yup・部品化フォーム",
  },
  14: {
    en: "Additional polish — chevrons, long text, flexible architecture & snippets",
    np: "पоли र आर्किटेक्चर।",
    jp: "磨き・アーキ・スニペット",
  },
  15: {
    en: "Part 2 kickoff — VS Code snippets & native capability mindset",
    np: "भाग २ सुरुवात र नेटिव।",
    jp: "Part 2 開始・ネイティブ機能",
  },
  16: {
    en: "Device media — ImagePicker, permissions library & reusable image rows",
    np: "इमेज र अनुमति।",
    jp: "写真・権限・コンポーザブル入力",
  },
  17: {
    en: "Geolocation hooks & declarative navigators — stack + tabs nesting",
    np: "लोकेशन र नेभिगेशन।",
    jp: "位置情報・スタック・タブ",
  },
  18: {
    en: "API layers with ApiSauce/fetch — errors, spinners & upload progress",
    np: "API र अपलोड।",
    jp: "API 層・エラー・インジケータ",
  },
  19: {
    en: "Offline cache — AsyncStorage strategies & auth persistence",
    np: "क्यास र प्रमाणीकरण।",
    jp: "オフライン・キャッシュ・認証永続化",
  },
  20: {
    en: "Push, App Store / Play workflows, OTA updates & course wrap-up",
    np: "पुश, स्टोर, OTA।",
    jp: "通知・ストア・OTA・まとめ",
  },
};

const RN_WEEK_TITLE: Record<string, LocalizedString> = {
  "rn-w1": { en: "Getting started", np: "सुरुवात", jp: "はじめに" },
  "rn-w2": { en: "Tooling & debugging", np: "टुलिङ", jp: "ツールとデバッグ" },
  "rn-w3": { en: "Core components", np: "कोर कम्पोनेन्ट", jp: "コアコンポーネント" },
  "rn-w4": { en: "Layout & exercises", np: "लेआउट", jp: "レイアウト演習" },
  "rn-w5": { en: "Styling & lists", np: "शैली र सूची", jp: "スタイルとリスト" },
  "rn-w6": { en: "Inputs & forms", np: "इन्पुट र फर्म", jp: "入力とフォーム" },
  "rn-w7": { en: "Polish & Part 2 intro", np: "पार्ट २", jp: "磨きと Part 2" },
  "rn-w8": { en: "Native & navigation", np: "नेटिव", jp: "ネイティブとナビ" },
  "rn-w9": { en: "Networking & offline", np: "नेटवर्क", jp: "通信とオフライン" },
  "rn-w10": { en: "Auth, push & distribution", np: "वितरण", jp: "認証・通知・配布" },
};

export function reactNativeDayTitle(day: number): LocalizedString {
  return RN_DAY_TITLE[day] ?? { en: `Day ${day}`, np: `दिन ${day}`, jp: `Day ${day}` };
}

export function reactNativeWeekTitle(weekId: string): LocalizedString {
  return RN_WEEK_TITLE[weekId] ?? { en: weekId, np: weekId, jp: weekId };
}
