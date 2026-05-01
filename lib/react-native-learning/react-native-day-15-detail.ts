import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 15 — Part 2 kickoff: VS Code snippets, native capability mindset & scalable project structure. */
export const REACT_NATIVE_DAY_15_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Part 2 shifts from pure JavaScript UI work to **native device capabilities**. Before touching camera or GPS, invest 30 minutes in your editor setup (**VS Code snippets + Expo Tools**), internalize the **bridge cost model** (what runs in JS vs what serializes across the native boundary), and lay down a scalable folder structure — `services/`, `hooks/`, `screens/` — that will hold the rest of the course without becoming a big-ball-of-mud.",
      np: "भाग २ मा नेटिभ क्षमता, VS Code सेटअप, र फोल्डर संरचना।",
      jp: "Part 2 ではネイティブ機能を扱います。まず **VS Code 拡張**の整備、**ブリッジコストモデル**の理解、そしてスケーラブルなフォルダ構成を固めましょう。",
    },
  ],
  sections: [
    {
      title: { en: "VS Code Extensions & Snippets for RN Productivity", np: "VS Code एक्सटेन्सन", jp: "VS Code 拡張とスニペット" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Three extensions pay the biggest dividends: **ES7+ React/Redux/React-Native snippets** (dsznajder) for instant component and hook stubs, **Expo Tools** for `app.json`/`eas.json` autocomplete, and **Error Lens** to surface TypeScript errors inline without leaving the editor. Add **Prettier** with `singleQuote: true` and `trailingComma: 'all'` to match the Expo/RN ecosystem defaults.",
            np: "ES7 स्निपेट, Expo Tools, Error Lens, र Prettier इन्स्टल गर्नुस्।",
            jp: "**ES7+ スニペット**・**Expo Tools**・**Error Lens**・**Prettier** の4つが最も費用対効果が高いです。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`rnf`** expands to a functional component with `StyleSheet.create` — saves ~12 lines every screen.",
              np: "`rnf` → घटक टेम्प्लेट।",
              jp: "**`rnf`** で関数コンポーネント＋StyleSheet の雛形を即生成。",
            },
            {
              en: "**`rnfe`** — same but typed: arrow function with explicit `React.FC<Props>` signature.",
              np: "`rnfe` → TypeScript घटक।",
              jp: "**`rnfe`** は TypeScript の props 型付き版。",
            },
            {
              en: "**`imp`** / **`imd`** — default and named import one-liners, faster than typing `import { useState } from 'react'` by hand.",
              np: "इम्पोर्ट सर्टकट।",
              jp: "**`imp`/`imd`** でインポートを素早く記述できます。",
            },
            {
              en: "**Expo Tools** autocompletes `permissions`, `plugins`, `splash`, and SDK version fields in `app.json` and `app.config.ts` — no more guessing `expo-camera` plugin syntax.",
              np: "Expo Tools — app.json सहायता।",
              jp: "**Expo Tools** は `app.json` のプラグイン・権限フィールドを補完します。",
            },
          ],
        },
        {
          type: "code",
          title: { en: "Custom workspace snippet — typed screen shell", np: "स्क्रिन स्निपेट", jp: "型付きスクリーン用スニペット" },
          code: `// .vscode/rn.code-snippets  (create this file at the repo root)
{
  "RN Typed Screen": {
    "prefix": "rnscreen",
    "body": [
      "import React from 'react';",
      "import { View, Text, StyleSheet } from 'react-native';",
      "import type { NativeStackScreenProps } from '@react-navigation/native-stack';",
      "import type { RootStackParamList } from '@/navigation/types';",
      "",
      "type Props = NativeStackScreenProps<RootStackParamList, '$1'>;",
      "",
      "export default function $1Screen({ navigation, route }: Props) {",
      "  return (",
      "    <View style={styles.container}>",
      "      <Text>$1</Text>",
      "    </View>",
      "  );",
      "}",
      "",
      "const styles = StyleSheet.create({",
      "  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },",
      "});"
    ],
    "description": "React Native typed screen with navigation props"
  },
  "RN Custom Hook": {
    "prefix": "rnhook",
    "body": [
      "import { useState, useEffect, useCallback } from 'react';",
      "",
      "export function use$1() {",
      "  const [data, setData] = useState<$2 | undefined>();",
      "  const [error, setError] = useState<Error | null>(null);",
      "  const [loading, setLoading] = useState(false);",
      "",
      "  const load = useCallback(async () => {",
      "    setLoading(true);",
      "    try {",
      "      $3",
      "    } catch (e) {",
      "      setError(e as Error);",
      "    } finally {",
      "      setLoading(false);",
      "    }",
      "  }, []);",
      "",
      "  useEffect(() => { void load(); }, [load]);",
      "  return { data, error, loading, reload: load };",
      "}"
    ],
    "description": "React Native custom hook with loading/error state"
  }
}`,
        },
      ],
    },
    {
      title: { en: "Native Capability Mindset — JS vs Bridge vs Native", np: "JS बनाम ब्रिज बनाम नेटिभ", jp: "JS・ブリッジ・ネイティブの分業" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every call that crosses the **JS-to-native bridge** is asynchronous and serializes arguments to JSON. The bridge is not a bottleneck for one-shot calls like requesting a photo, but it becomes a problem for **tight loops**: running `setInterval` to poll a sensor 60 times per second, or driving animations frame-by-frame from JS. For those patterns, reach for **Reanimated worklets** (run on the UI thread) or a custom **TurboModule** (synchronous C++ boundary in the new architecture).",
            np: "ब्रिज पार गर्दा JSON सिरियलाइज हुन्छ — बारम्बार कल नगर्नुस्।",
            jp: "**ブリッジ越えの呼び出し**は非同期でJSONシリアライズされます。アニメーションや高頻度センサーはワークレットかネイティブモジュールで処理しましょう。",
          },
        },
        { type: "diagram", id: "react-native-native-module-bridge" },
        {
          type: "table",
          caption: { en: "Capability availability by workflow", np: "क्षमता तालिका", jp: "ワークフロー別の機能一覧" },
          headers: [
            { en: "Capability", np: "क्षमता", jp: "機能" },
            { en: "Expo SDK (managed)", np: "Expo SDK", jp: "Expo SDK（管理）" },
            { en: "Bare workflow", np: "बेयर वर्कफ्लो", jp: "Bare ワークフロー" },
            { en: "Custom native module", np: "कस्टम नेटिभ", jp: "カスタムモジュール" },
          ],
          rows: [
            [
              { en: "Camera", np: "क्यामेरा", jp: "カメラ" },
              { en: "expo-camera / expo-image-picker", np: "Expo SDK", jp: "expo-camera" },
              { en: "react-native-vision-camera", np: "बेयर SDK", jp: "Vision Camera" },
              { en: "AVFoundation (iOS) / Camera2 (Android)", np: "नेटिभ", jp: "AVFoundation / Camera2" },
            ],
            [
              { en: "GPS / Location", np: "स्थान", jp: "位置情報" },
              { en: "expo-location", np: "Expo SDK", jp: "expo-location" },
              { en: "@react-native-community/geolocation", np: "बेयर", jp: "コミュニティ版" },
              { en: "CLLocationManager (iOS) / FusedLocationProvider (Android)", np: "नेटिभ", jp: "ネイティブ位置API" },
            ],
            [
              { en: "Bluetooth (BLE)", np: "ब्लुटुथ", jp: "Bluetooth" },
              { en: "Not available in managed workflow", np: "उपलब्ध छैन", jp: "管理版では不可" },
              { en: "react-native-ble-plx", np: "बेयर", jp: "BLE Plx" },
              { en: "CoreBluetooth (iOS) / BluetoothGatt (Android)", np: "नेटिभ", jp: "CoreBluetooth" },
            ],
            [
              { en: "Push Notifications", np: "पुस नोटिफिकेसन", jp: "プッシュ通知" },
              { en: "expo-notifications", np: "Expo SDK", jp: "expo-notifications" },
              { en: "expo-notifications or notifee", np: "बेयर", jp: "notifee など" },
              { en: "APNs / FCM direct SDK integration", np: "नेटिभ", jp: "APNs / FCM 直接統合" },
            ],
          ],
        },
      ],
    },
    {
      title: { en: "Scalable Project Structure for Part 2", np: "फोल्डर संरचना", jp: "Part 2 のフォルダ構成" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A **three-layer architecture** keeps native-boundary concerns (permissions, device APIs) isolated in `services/`, reusable stateful logic in `hooks/`, and rendering in `screens/` and `components/`. This prevents permission prompts and native module calls from leaking into pure UI components, making each layer independently testable.",
            np: "सेवा, हुक, र स्क्रिन — तीन तह राख्नुस्।",
            jp: "**3層アーキテクチャ**：`services/`（権限・デバイスAPI）、`hooks/`（状態ロジック）、`screens/`（描画）で分離します。",
          },
        },
        {
          type: "code",
          title: { en: "Recommended folder layout", np: "फोल्डर ढाँचा", jp: "フォルダ構成の例" },
          code: `src/
├── screens/              # One file per route screen, default export
│   ├── HomeScreen.tsx
│   ├── ListingDetailScreen.tsx
│   └── ProfileScreen.tsx
├── components/           # Pure UI — no navigation deps, no native calls
│   ├── Avatar.tsx
│   ├── ImageRow.tsx
│   └── ListingCard.tsx
├── hooks/                # Custom hooks — own state + side-effects
│   ├── useLocation.ts        # wraps expo-location
│   ├── useImagePicker.ts     # wraps expo-image-picker
│   └── useListings.ts        # wraps API client
├── services/             # Native capability wrappers + API calls
│   ├── locationService.ts    # raw permission + coords logic
│   ├── mediaService.ts       # upload FormData helpers
│   └── apiClient.ts          # axios/fetch instance
├── navigation/           # Navigator definitions + TypeScript param lists
│   ├── RootNavigator.tsx
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── types.ts              # export RootTabParamList, RootStackParamList
└── lib/                  # Utilities, constants, theme tokens
    ├── theme.ts
    └── colors.ts`,
        },
      ],
    },
    {
      title: { en: "Debugging Native-Only Issues — adb logcat & Xcode Console", np: "नेटिभ डिबगिङ", jp: "ネイティブ問題のデバッグ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Metro's log panel only surfaces JS-side exceptions. For native crashes, missing permission entitlements, or broken CocoaPods linkage, you must read **`adb logcat`** (Android) or the **Xcode console** (iOS). Develop the habit of keeping a terminal tab open with logcat filtered to your app's process.",
            np: "Android: `adb logcat`; iOS: Xcode कन्सोल।",
            jp: "Metro はJS側のみ表示します。ネイティブクラッシュや権限の問題は **`adb logcat`**（Android）か **Xcode Console**（iOS）で確認します。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`adb logcat -s ReactNativeJS`** — filters to only JS exceptions forwarded into Android's log buffer. Start here.",
              np: "JS त्रुटि फिल्टर।",
              jp: "**`adb logcat -s ReactNativeJS`** でJS例外のみ絞り込めます。",
            },
            {
              en: "**`adb logcat *:E`** — all native error-level logs: permission denials, missing entitlements, network cleartext policy violations.",
              np: "सबै नेटिभ त्रुटि।",
              jp: "**`adb logcat *:E`** でエラーレベルの全ログを表示します。",
            },
            {
              en: "**`adb logcat | grep -i 'YOUR_PACKAGE_NAME'`** — narrow to your app's process on a busy device with many background services.",
              np: "प्याकेज नाम फिल्टर।",
              jp: "**grep** でパッケージ名に絞ると他アプリのログが邪魔になりません。",
            },
            {
              en: "In **Xcode**, open Window → Devices & Simulators → Device Logs to view symbolicated crash reports that Metro never shows.",
              np: "Xcode डिभाइस लग।",
              jp: "Xcode の **Device Logs** でシンボル付きクラッシュレポートを確認できます。",
            },
            {
              en: "**Flipper** (or the built-in Expo Dev Tools network tab) shows bridge traffic counts and React DevTools component tree — useful for diagnosing over-rendering.",
              np: "Flipper ब्रिज निरीक्षण।",
              jp: "**Flipper** でブリッジ通信回数とコンポーネントツリーを確認できます。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I eject from the Expo managed workflow to bare?",
        np: "Expo managed कहिले छोड्ने?",
        jp: "いつ Expo 管理ワークフローを抜けるべきですか？",
      },
      answer: {
        en: "Eject only when you need a **native SDK not covered by the Expo ecosystem** — for example, a proprietary hardware BLE SDK or a custom C++ signal-processing library. Most camera, location, and notification needs are covered by Expo SDK. Before ejecting, try a **development build** (`npx expo run:android` / `npx expo run:ios`) — it compiles a custom binary that includes your native module but preserves Expo's toolchain (`eas build`, `expo-updates`, etc.).",
        np: "Expo SDK नभएको SDK चाहिँदा मात्र; development build पहिले जाँच्नुस्।",
        jp: "Expo SDK にない独自ネイティブSDKが必要なときだけ抜けましょう。まず **development build** を試してください。Expo ツールチェーンを維持したままカスタムモジュールを使えます。",
      },
    },
    {
      question: {
        en: "What is the difference between a **development build** and Expo Go?",
        np: "development build र Expo Go फरक?",
        jp: "**development build** と Expo Go の違いは？",
      },
      answer: {
        en: "**Expo Go** is a pre-built sandbox app that only runs modules bundled with its binary — you cannot add native modules to it. A **development build** is a custom `.apk`/`.ipa` you compile once with `eas build --profile development`. It includes your app's native modules and behaves exactly like a production build, except it also has the Expo dev-client overlay for hot reload and developer menus. Think of it as Expo Go that you compiled yourself.",
        np: "development build आफ्नो नेटिभ मड्युल सहितको कस्टम APK/IPA हो।",
        jp: "**Expo Go** はプリビルドのサンドボックスです。**development build** は自前でビルドした APK/IPA で、独自ネイティブモジュールも組み込めます。",
      },
    },
    {
      question: {
        en: "How do I know if a function call crosses the bridge or stays in JS?",
        np: "ब्रिज पार गर्छ कि JS मा रहन्छ?",
        jp: "ブリッジを越えるかどうかをどう見分けますか？",
      },
      answer: {
        en: "If the function is implemented purely in `.ts`/`.tsx` and only uses React/JS APIs, it stays in JS. If it calls a **native module** — look for `NativeModules.XXX`, `requireNativeComponent`, a TurboModule `getEnforcing` call, or any Expo API (like `expo-location` or `expo-image-picker`) that ultimately wraps platform code — it crosses the bridge. Reading the library's source (usually in `ios/` and `android/` subdirectories) confirms it.",
        np: "NativeModules छ भने ब्रिज पार।",
        jp: "`NativeModules.XXX` や TurboModule の呼び出しがあればブリッジ越えです。純粋な `.ts` ファイルなら JS 内で完結します。",
      },
    },
    {
      question: {
        en: "Why organize into `services/` and `hooks/` instead of putting everything in a screen component?",
        np: "सबै स्क्रिनमा किन नराख्ने?",
        jp: "なぜ `services/`・`hooks/` に分けるのですか？",
      },
      answer: {
        en: "**Testability** and **reuse**. A `locationService.ts` function can be unit-tested by mocking the `expo-location` module — no simulator needed. A `useLocation` hook can be shared across a MapScreen and a NearbyListingsScreen without duplicating permission logic. Screens become thin orchestrators: call hooks, render components, and handle navigation. They stay readable and are less fragile to refactor.",
        np: "परीक्षण र पुनः प्रयोगको लागि।",
        jp: "**テスト可能性**と**再利用性**です。`locationService.ts` はモックでテストでき、`useLocation` は複数画面で共有できます。スクリーンは薄いオーケストレーターになります。",
      },
    },
    {
      question: {
        en: "Can I use Expo SDK modules in a bare (non-managed) workflow?",
        np: "बेयर वर्कफ्लोमा Expo SDK काम गर्छ?",
        jp: "Bare ワークフローでも Expo SDK モジュールは使えますか？",
      },
      answer: {
        en: "Yes — almost all Expo SDK packages (`expo-location`, `expo-image-picker`, `expo-notifications`, etc.) work in a bare workflow. You just need to run `npx expo install <package>` and then `npx pod-install` (iOS) or a Gradle sync (Android) to link the native code. The managed workflow simply automates that linking step at build time via config plugins.",
        np: "हो, `npx expo install` र pod-install गर्नुस्।",
        jp: "ほぼ全ての Expo SDK パッケージは Bare ワークフローでも動きます。`npx expo install` 後に iOS は `pod install`、Android は Gradle sync が必要です。",
      },
    },
  ],
};
