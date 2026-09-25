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
  "ci-cd": { en: "CI/CD", np: "CI/CD", jp: "CI/CD" },
  eas: { en: "EAS", np: "EAS", jp: "EAS" },
  ota: { en: "OTA", np: "OTA", jp: "OTA" },
  versioning: { en: "versioning", np: "versioning", jp: "バージョン管理" },
  "app-store": { en: "App Store", np: "App Store", jp: "App Store" },
  "play-store": { en: "Play Store", np: "Play Store", jp: "Play Store" },
  submission: { en: "submission", np: "submission", jp: "ストア申請" },
  release: { en: "release", np: "release", jp: "リリース" },
  skia: { en: "Skia", np: "Skia", jp: "Skia" },
  monorepo: { en: "monorepo", np: "monorepo", jp: "モノレポ" },
  "code-sharing": { en: "code sharing", np: "code sharing", jp: "コード共有" },
  capstone: { en: "capstone", np: "capstone", jp: "総合プロジェクト" },
  ecosystem: { en: "ecosystem", np: "ecosystem", jp: "エコシステム" },
  upgrades: { en: "upgrades", np: "upgrades", jp: "アップグレード" },
  "expo-router": { en: "Expo Router", np: "Expo Router", jp: "Expo Router" },
  "custom-rendering": { en: "custom rendering", np: "custom rendering", jp: "カスタム描画" },
  "beyond-phones": { en: "beyond phones", np: "beyond phones", jp: "スマートフォン以外" },
  "universal-web": { en: "universal web", np: "universal web", jp: "ユニバーサルWeb" },
};

export function reactNativeTags(slugs: [string, string]): RoadmapTag[] {
  return [
    { slug: slugs[0], label: RN_TAG[slugs[0]] ?? { en: slugs[0], np: slugs[0], jp: slugs[0] } },
    { slug: slugs[1], label: RN_TAG[slugs[1]] ?? { en: slugs[1], np: slugs[1], jp: slugs[1] } },
  ];
}

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
  foundationTitles[36] = { en: "CI/CD", np: "CI/CD", jp: "CI/CD" };
  foundationTitles[37] = { en: "OTA Updates and Versioning", np: "OTA Updates and Versioning", jp: "OTA更新とバージョン管理" };
  foundationTitles[38] = { en: "App Store Submission", np: "App Store Submission", jp: "App Store申請" };
  foundationTitles[39] = { en: "Play Store Submission", np: "Play Store Submission", jp: "Play Store申請" };
  foundationTitles[40] = { en: "Release Management", np: "Release Management", jp: "リリース管理" };
  foundationTitles[41] = { en: "Advanced Animation and Custom Rendering", np: "Advanced Animation and Custom Rendering", jp: "高度なアニメーションとカスタム描画" };
  foundationTitles[42] = { en: "Monorepos and Code Sharing", np: "Monorepos and Code Sharing", jp: "モノレポとコード共有" };
  foundationTitles[43] = { en: "Architecture at Scale", np: "Architecture at Scale", jp: "大規模アーキテクチャ" };
  foundationTitles[44] = { en: "Extending Your Capstone with a Real Native Feature", np: "Extending Your Capstone with a Real Native Feature", jp: "実際のネイティブ機能で総合プロジェクトを拡張" };
  foundationTitles[45] = { en: "The 2026 State of the React Native Ecosystem", np: "The 2026 State of the React Native Ecosystem", jp: "2026年のReact Nativeエコシステム" };
  foundationTitles[46] = { en: "Expo Router Deep Dive", np: "Expo Router Deep Dive", jp: "Expo Router 詳細" };
  foundationTitles[47] = { en: "Advanced Skia and Custom Rendering", np: "Advanced Skia and Custom Rendering", jp: "高度なSkiaとカスタム描画" };
  foundationTitles[48] = { en: "Beyond Phones", np: "Beyond Phones", jp: "スマートフォンを超えて" };
  foundationTitles[49] = { en: "React Native Web and Universal Apps", np: "React Native Web and Universal Apps", jp: "React Native Webとユニバーサルアプリ" };
  if (foundationTitles[day]) return foundationTitles[day];
  return { en: `Day ${day}`, np: `दिन ${day}`, jp: `Day ${day}` };
}
