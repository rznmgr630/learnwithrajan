import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapTag } from "@/lib/challenge-data";

const RN_TAG: Record<string, LocalizedString> = {
  prerequisites: { en: "prerequisites", np: "पूर्वआवश्यकता", jp: "前提知識" },
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
  gestures: { en: "gestures", np: "gestures", jp: "ジェスチャー" },
  animation: { en: "animation", np: "animation", jp: "アニメーション" },
  device: { en: "device APIs", np: "device APIs", jp: "デバイスAPI" },
  lifecycle: { en: "lifecycle", np: "lifecycle", jp: "ライフサイクル" },
  storage: { en: "storage", np: "storage", jp: "ストレージ" },
  media: { en: "media", np: "media", jp: "メディア" },
  files: { en: "files", np: "files", jp: "ファイル" },
  webview: { en: "WebView", np: "WebView", jp: "WebView" },
  security: { en: "security", np: "security", jp: "セキュリティ" },
  state: { en: "state", np: "state", jp: "状態管理" },
  architecture: { en: "architecture", np: "architecture", jp: "アーキテクチャ" },
  validation: { en: "validation", np: "validation", jp: "バリデーション" },
  react: { en: "modern React", np: "modern React", jp: "モダンReact" },
  typescript: { en: "TypeScript", np: "TypeScript", jp: "TypeScript" },
  "server-state": { en: "server state", np: "server state", jp: "サーバー状態" },
  offline: { en: "offline-first", np: "offline-first", jp: "オフライン優先" },
  sync: { en: "sync", np: "sync", jp: "同期" },
  "native-modules": { en: "native modules", np: "native modules", jp: "ネイティブモジュール" },
  "turbo-modules": { en: "TurboModules", np: "TurboModules", jp: "TurboModules" },
  fabric: { en: "Fabric", np: "Fabric", jp: "Fabric" },
  ios: { en: "iOS", np: "iOS", jp: "iOS" },
  android: { en: "Android", np: "Android", jp: "Android" },
  build: { en: "build", np: "build", jp: "ビルド" },
  configuration: { en: "configuration", np: "configuration", jp: "設定" },
  publishing: { en: "publishing", np: "publishing", jp: "公開" },
  testing: { en: "testing", np: "testing", jp: "テスト" },
  quality: { en: "quality", np: "quality", jp: "品質" },
  debugging: { en: "debugging", np: "debugging", jp: "デバッグ" },
  devtools: { en: "DevTools", np: "DevTools", jp: "DevTools" },
  accessibility: { en: "accessibility", np: "accessibility", jp: "アクセシビリティ" },
  observability: { en: "observability", np: "observability", jp: "オブザーバビリティ" },
  "supply-chain": { en: "supply chain", np: "supply chain", jp: "サプライチェーン" },
};

export function reactNativeTags(slugs: [string, string]): RoadmapTag[] {
  return [
    { slug: slugs[0], label: RN_TAG[slugs[0]] ?? { en: slugs[0], np: slugs[0], jp: slugs[0] } },
    { slug: slugs[1], label: RN_TAG[slugs[1]] ?? { en: slugs[1], np: slugs[1], jp: slugs[1] } },
  ];
}

const RN_DAY_TITLE: Record<number, LocalizedString> = {
  0: {
    en: "Phase 0 — Before You Start",
    np: "Phase 0 — सुरु गर्नुअघि",
    jp: "Phase 0 — はじめる前に",
  },
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
  if (day === 0) return { en: "Phase 0 — Before You Start", np: "Phase 0 — सुरु गर्नुअघि", jp: "Phase 0 — はじめる前に" };
  const foundationTitles: Record<number, LocalizedString> = {
    1: { en: "React Native setup, runtime & New Architecture", np: "RN setup र runtime", jp: "RN セットアップとランタイム" },
    2: { en: "React Native internals: state update to native UI", np: "RN internals", jp: "RN 内部: state から UI" },
    3: { en: "Core components and layout", np: "कोर कम्पोनेन्ट र layout", jp: "コアコンポーネントとレイアウト" },
  };
  foundationTitles[4] = { en: "Styling", np: "Styling", jp: "スタイリング" };
  foundationTitles[5] = { en: "Navigation", np: "Navigation", jp: "ナビゲーション" };
  foundationTitles[6] = { en: "Lists and performance basics", np: "Lists र performance", jp: "リストとパフォーマンス基礎" };
  foundationTitles[7] = { en: "Gestures and Animation", np: "Gestures and Animation", jp: "ジェスチャーとアニメーション" };
  foundationTitles[8] = { en: "Device APIs and Permissions", np: "Device APIs and Permissions", jp: "デバイスAPIと権限" };
  foundationTitles[9] = { en: "App Lifecycle", np: "App Lifecycle", jp: "アプリのライフサイクル" };
  foundationTitles[10] = { en: "Storage", np: "Storage", jp: "ストレージ" };
  foundationTitles[11] = { en: "Networking and Data Fetching", np: "Networking and Data Fetching", jp: "ネットワークとデータ取得" };
  foundationTitles[12] = { en: "Push Notifications and Background Work", np: "Push Notifications and Background Work", jp: "プッシュ通知とバックグラウンド処理" };
  foundationTitles[13] = { en: "Media and Files", np: "Media and Files", jp: "メディアとファイル" };
  foundationTitles[14] = { en: "WebView and Web/Native Boundaries", np: "WebView and Web/Native Boundaries", jp: "WebViewとWeb・ネイティブ境界" };
  foundationTitles[15] = { en: "State Management", np: "State Management", jp: "状態管理" };
  foundationTitles[16] = { en: "Forms", np: "Forms", jp: "フォーム" };
  foundationTitles[17] = { en: "Modern React in React Native", np: "Modern React in React Native", jp: "React NativeのモダンReact" };
  foundationTitles[18] = { en: "TypeScript in React Native", np: "TypeScript in React Native", jp: "React NativeのTypeScript" };
  foundationTitles[19] = { en: "Server State in Depth", np: "Server State in Depth", jp: "サーバー状態の詳細" };
  foundationTitles[20] = { en: "Offline-first and Sync", np: "Offline-first and Sync", jp: "オフライン優先と同期" };
  foundationTitles[21] = { en: "Authentication Architecture", np: "Authentication Architecture", jp: "認証アーキテクチャ" };
  foundationTitles[22] = { en: "Bridging to Native Code", np: "Bridging to Native Code", jp: "ネイティブコードとの連携" };
  foundationTitles[23] = { en: "Fabric Native Components", np: "Fabric Native Components", jp: "Fabricネイティブコンポーネント" };
  foundationTitles[24] = { en: "iOS Fundamentals for React Native Developers", np: "iOS Fundamentals for React Native Developers", jp: "React Native開発者のためのiOS基礎" };
  foundationTitles[25] = { en: "Android Fundamentals for React Native Developers", np: "Android Fundamentals for React Native Developers", jp: "React Native開発者のためのAndroid基礎" };
  foundationTitles[26] = { en: "Native Build Configuration", np: "Native Build Configuration", jp: "ネイティブビルド設定" };
  foundationTitles[27] = { en: "Platform Differences in Practice", np: "Platform Differences in Practice", jp: "プラットフォーム差異の実践" };
  foundationTitles[28] = { en: "Authoring and Publishing a Native Module", np: "Authoring and Publishing a Native Module", jp: "ネイティブモジュールの作成と公開" };
  foundationTitles[29] = { en: "Testing", np: "Testing", jp: "テスト" };
  foundationTitles[30] = { en: "Debugging and DevTools", np: "Debugging and DevTools", jp: "デバッグとDevTools" };
  foundationTitles[31] = { en: "Performance", np: "Performance", jp: "パフォーマンス" };
  foundationTitles[32] = { en: "Accessibility", np: "Accessibility", jp: "アクセシビリティ" };
  foundationTitles[33] = { en: "Production Observability", np: "Production Observability", jp: "本番オブザーバビリティ" };
  foundationTitles[34] = { en: "Mobile Security Fundamentals", np: "Mobile Security Fundamentals", jp: "モバイルセキュリティ基礎" };
  foundationTitles[35] = { en: "Auth Security and Supply-Chain Risk", np: "Auth Security and Supply-Chain Risk", jp: "認証セキュリティとサプライチェーンリスク" };
  if (foundationTitles[day]) return foundationTitles[day];
  return RN_DAY_TITLE[day - 35] ?? { en: `Day ${day}`, np: `दिन ${day}`, jp: `Day ${day}` };
}

export function reactNativeWeekTitle(weekId: string): LocalizedString {
  return RN_WEEK_TITLE[weekId] ?? { en: weekId, np: weekId, jp: weekId };
}
