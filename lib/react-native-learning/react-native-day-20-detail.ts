import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 20 — Push notifications, EAS Build/Submit, OTA updates & course wrap-up. */
export const REACT_NATIVE_DAY_20_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 20 closes the React Native course. You will wire up **push notifications** with `expo-notifications` (FCM + APNs tokens, payload shape, foreground/background listeners), build and ship your app with **EAS Build** profiles and **`eas submit`**, push JS-only bug fixes live with **expo-updates OTA channels**, manage **app versioning**, and get a clear picture of what you can build now plus where to go next.",
      np: "Push notification, EAS Build, OTA अपडेट, versioning र course wrap-up।",
      jp: "Day 20 では expo-notifications によるプッシュ通知、EAS Build/Submit、OTA アップデート、バージョン管理、そして次のステップを学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Push Notifications with expo-notifications",
        np: "expo-notifications सँग push notification",
        jp: "expo-notifications でプッシュ通知",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Push notifications on mobile flow through two vendor gateways: **APNs** (Apple Push Notification service) for iOS and **FCM** (Firebase Cloud Messaging) for Android. Expo abstracts both behind a unified **Expo Push Token**. Your backend sends a notification to Expo's servers; Expo routes it to the correct vendor; the vendor delivers it to the device. The device token must be registered and stored server-side, and rotated when the OS revokes it.",
            np: "APNs (iOS) र FCM (Android) लाई Expo ले एकीकृत गर्छ।",
            jp: "iOS は **APNs**、Android は **FCM** を経由します。Expo が両方を統一した **Expo Push Token** で抽象化します。",
          },
        },
        {
          type: "code",
          title: {
            en: "registerForPushNotificationsAsync — request permission & get token",
            np: "अनुमति र token लिने",
            jp: "通知権限のリクエストとトークン取得",
          },
          code: `import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Tell Expo how to display notifications while the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device.');
    return null;
  }

  // Android: create a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  // projectId is in app.json under expo.extra.eas.projectId
  const { data: token } = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  });

  return token; // send this to your backend and store it per user
}

// --- In your root component ---
export function useNotifications() {
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) savePushTokenToServer(token); // your API call
    });

    // Fires when a notification is received while the app is in the foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Received:', notification.request.content);
      },
    );

    // Fires when the user taps a notification (foreground, background, killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { screen, id } = response.notification.request.content.data as {
          screen?: string;
          id?: string;
        };
        if (screen && id) {
          navigationRef.current?.navigate(screen, { id });
        }
      },
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);
}`,
        },
        {
          type: "table",
          caption: {
            en: "Notification payload shape — key fields",
            np: "Payload आकार",
            jp: "通知ペイロードの主要フィールド",
          },
          headers: [
            { en: "Field", np: "फिल्ड", jp: "フィールド" },
            { en: "Type", np: "प्रकार", jp: "型" },
            { en: "Purpose", np: "उद्देश्य", jp: "用途" },
          ],
          rows: [
            [
              { en: "title", np: "शीर्षक", jp: "title" },
              { en: "string", np: "string", jp: "string" },
              { en: "Bold heading shown in the notification tray", np: "शीर्षक", jp: "通知トレイの見出し" },
            ],
            [
              { en: "body", np: "मुख्य पाठ", jp: "body" },
              { en: "string", np: "string", jp: "string" },
              { en: "Secondary line of text under the title", np: "द्वितीयक लाइन", jp: "タイトル下のテキスト" },
            ],
            [
              { en: "data", np: "डेटा", jp: "data" },
              { en: "Record<string, unknown>", np: "object", jp: "Record<string, unknown>" },
              { en: "Custom payload — use for deep-link routing (screen + id)", np: "कस्टम डेटा", jp: "画面名や ID など独自データ" },
            ],
            [
              { en: "badge", np: "ब्याज", jp: "badge" },
              { en: "number", np: "number", jp: "number" },
              { en: "iOS app icon badge count", np: "आइकन सङ्ख्या", jp: "iOS アイコンのバッジ数" },
            ],
            [
              { en: "sound", np: "ध्वनि", jp: "sound" },
              { en: "'default' | string", np: "string", jp: "string" },
              { en: "Notification sound ('default' or a bundled audio asset)", np: "डिफल्ट वा कस्टम", jp: "default または独自サウンド" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "EAS Build Profiles & App Versioning",
        np: "EAS Build प्रोफाइल र संस्करण",
        jp: "EAS Build プロファイルとアプリバージョニング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**EAS Build** replaces the classic `expo build` command and runs native compilation on Expo's cloud infrastructure. You define build behaviours in **`eas.json`** using three conventional profiles: **development** (debug build installed via Expo Go or dev client), **preview** (internal distribution — TestFlight / internal Play track), and **production** (store-ready binary).",
            np: "EAS Build ले eas.json प्रोफाइल (development/preview/production) प्रयोग गर्छ।",
            jp: "**EAS Build** は `eas.json` の **development / preview / production** プロファイルでビルド動作を定義します。",
          },
        },
        {
          type: "code",
          title: {
            en: "eas.json — build profiles",
            np: "eas.json कन्फिग",
            jp: "eas.json ビルドプロファイル",
          },
          code: `// eas.json
{
  "cli": { "version": ">= 10.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": true },
      "env": { "EXPO_PUBLIC_API_URL": "http://localhost:3000" }
    },
    "preview": {
      "distribution": "internal",
      "env": { "EXPO_PUBLIC_API_URL": "https://staging-api.example.com" }
    },
    "production": {
      "autoIncrement": true,
      "env": { "EXPO_PUBLIC_API_URL": "https://api.example.com" }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "you@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDE12345"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account.json",
        "track": "production"
      }
    }
  }
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`version`** in `app.json` (e.g. `\"1.2.0\"`) is the human-readable string shown in app stores. **`buildNumber`** (iOS) and **`versionCode`** (Android) are monotonically increasing integers that the stores use to identify each binary submission — both must increment with every store upload.",
              np: "version मानव-पठनीय; buildNumber/versionCode स्टोर कार्यका लागि बढ्दो पूर्णांक।",
              jp: "`version` は表示用の文字列。`buildNumber`/`versionCode` はストアへの提出ごとに増加させる整数です。",
            },
            {
              en: "Use `\"autoIncrement\": true` in the production profile so EAS automatically bumps `buildNumber` and `versionCode` without you touching `app.json` every release.",
              np: "autoIncrement: true ले स्वत: बढाउँछ।",
              jp: "`autoIncrement: true` で EAS がビルド番号を自動インクリメントします。",
            },
            {
              en: "Run **`eas build --platform ios --profile production`** or **`--platform android`**. Check build status at expo.dev. Download the artifact for manual QA before submitting.",
              np: "eas build कमाण्ड चलाउनुस्, expo.dev मा स्थिति हेर्नुस्।",
              jp: "`eas build --platform ios --profile production` でビルド開始。expo.dev でステータスを確認できます。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Submitting to App Store & Play Store with eas submit",
        np: "eas submit सँग स्टोरमा पठाउने",
        jp: "eas submit でストア申請",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`eas submit`** uploads the compiled binary to **App Store Connect** (iOS) or **Google Play Console** (Android) using the credentials in `eas.json`. It does **not** submit metadata — you still need to add screenshots, privacy nutrition labels, age ratings, and a review note manually in the respective consoles before hitting 'Submit for Review'.",
            np: "eas submit binary अपलोड गर्छ, metadata भने कन्सोलमा म्यानुअल भर्नुपर्छ।",
            jp: "`eas submit` はバイナリをアップロードするだけです。スクリーンショットやプライバシー情報はコンソールで手動入力が必要です。",
          },
        },
        {
          type: "diagram",
          id: "react-native-release-pipeline",
        },
      ],
    },
    {
      title: {
        en: "OTA Updates with expo-updates",
        np: "expo-updates सँग OTA अपडेट",
        jp: "expo-updates で OTA アップデート",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Over-the-air (OTA) updates** let you push **JavaScript and asset changes** to users without going through the App Store / Play Store review cycle. You publish an update to a named **channel** (e.g. `production`) via `eas update --branch production --message 'fix crash'`. The next time a user opens the app it downloads the update in the background; on the following launch they see the fix.",
            np: "OTA ले JS/asset परिवर्तन store review बिना पठाउँछ।",
            jp: "**OTA** を使うと JS/アセット変更をストア審査なしで届けられます。`eas update` コマンドで指定チャンネルに公開します。",
          },
        },
        {
          type: "code",
          title: {
            en: "expo-updates — channel strategy & rollback",
            np: "channel strategy र rollback",
            jp: "チャンネル戦略とロールバック",
          },
          code: `// app.json / app.config.js
{
  "expo": {
    "runtimeVersion": { "policy": "appVersion" },
    "updates": {
      "url": "https://u.expo.dev/<your-project-id>",
      "checkAutomatically": "ON_LOAD"
    }
  }
}

// --- Publish an update ---
// eas update --branch production --message "fix login crash"

// --- Rollback to previous update ---
// eas update:rollback --branch production --count 1

// --- Manual in-app update check (optional) ---
import * as Updates from 'expo-updates';

export async function checkForUpdate() {
  if (Updates.isEmbeddedLaunch) return; // running from store binary, no OTA yet
  try {
    const result = await Updates.checkForUpdateAsync();
    if (result.isAvailable) {
      await Updates.fetchUpdateAsync();
      // Prompt the user or reload immediately
      await Updates.reloadAsync();
    }
  } catch (e) {
    console.warn('OTA check failed:', e);
  }
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**OTA only covers JS and bundled assets** — images, fonts, JSON. It cannot update native code (Swift/Kotlin) or change native dependencies. Any change to `app.json` native fields, or adding/removing a native module, requires a full store build.",
              np: "OTA JS र assets मात्र। native code परिवर्तनले store build चाहिन्छ।",
              jp: "OTA は JS とアセットのみ対象。**ネイティブコードの変更はストアビルドが必要**です。",
            },
            {
              en: "**`runtimeVersion`** ties an update bundle to a specific native binary — with `appVersion` policy, an OTA update published against app version `1.2.0` will only be applied to users running that exact binary. This prevents incompatible JS from loading on older natives.",
              np: "runtimeVersion ले OTA bundle लाई सही native binary सँग जोड्छ।",
              jp: "`runtimeVersion` で OTA バンドルを対応するネイティブバイナリに紐づけます。古いバイナリに新しい JS が当たるのを防ぎます。",
            },
            {
              en: "Maintain at least **three channels**: `development` (local devs), `preview` (QA / testers), `production` (live users). Promote an update from `preview` to `production` only after sign-off.",
              np: "development/preview/production तीन channel राख्नुस्।",
              jp: "`development` → `preview` → `production` の 3 チャンネル運用が推奨です。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Course Wrap-Up — What You Can Build & Where to Go Next",
        np: "पाठ्यक्रम समाप्ति — अब के बनाउन सकिन्छ?",
        jp: "コースまとめ — 今できること・次のステップ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "After 20 days you have a solid foundation. You can build fully functional React Native apps with screens, navigation, forms, camera integration, real API calls with error handling, offline caching, auth flows, push notifications, and shipped builds on both stores.",
            np: "२० दिनमा पूर्ण फंक्सनल RN app बनाउन सक्छौ।",
            jp: "20 日間で画面・ナビ・フォーム・カメラ・API・オフライン・認証・通知・ストア申請まで実装できるようになりました。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**What you can ship now**: marketplace / listing apps, social feed apps, on-demand service apps (Uber-style), simple e-commerce, internal enterprise tools.",
              np: "अहिले: marketplace, social feed, enterprise tool बनाउन सकिन्छ।",
              jp: "マーケットプレイス・SNS・社内ツールなどを今すぐリリースできます。",
            },
            {
              en: "**Native Modules**: write Swift/Kotlin bridges when the JS layer cannot do it — camera HAL access, Bluetooth, background audio. Use **`expo-modules-core`** or the classic bridge.",
              np: "Native Modules: Swift/Kotlin bridge भिडाउन सिक्नुस्।",
              jp: "カメラ・Bluetooth など JS 層では届かない機能は **ネイティブモジュール**を書きます。",
            },
            {
              en: "**Expo Router**: file-system based routing (similar to Next.js) — cleaner deep-links, typed navigation, shared layouts, and Web support from the same codebase.",
              np: "Expo Router: फाइल-सिस्टम routing, deep-link, Web समर्थन।",
              jp: "**Expo Router** はファイルシステムベースのルーティングで Web との共有も容易です。",
            },
            {
              en: "**React Query (TanStack Query)**: replace your custom `useApi` hooks with a battle-tested server-state library — automatic caching, background refetch, infinite scroll, optimistic updates.",
              np: "React Query: server-state को लागि सबैभन्दा राम्रो library।",
              jp: "**React Query** はサーバーステート管理の定番。自動キャッシュや楽観的更新が使えます。",
            },
            {
              en: "**Zustand for RN**: lightweight global state — replace bulky Redux for settings, cart state, or UI overlays. Works seamlessly with React Native and can be persisted via AsyncStorage middleware.",
              np: "Zustand: Redux को हलुका विकल्प, AsyncStorage middleware सँग persist।",
              jp: "**Zustand** は軽量なグローバルステート管理。AsyncStorage ミドルウェアで永続化も簡単です。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Do push notifications work in Expo Go?",
        np: "Expo Go मा push notification काम गर्छ?",
        jp: "Expo Go でプッシュ通知は動く？",
      },
      answer: {
        en: "**Partial support** — Expo Go shares its own APNs/FCM certificates so you can test the notification flow end-to-end during development. However, production apps require a **custom development build** (EAS dev build) with your own credentials so that your bundle ID and APNs team certificate match. Never ship Expo Go as your production binary.",
        np: "Expo Go मा test हुन्छ, production मा custom dev build चाहिन्छ।",
        jp: "Expo Go でテストはできますが、本番は**カスタム開発ビルド**（EAS dev build）が必要です。",
      },
    },
    {
      question: {
        en: "Can I push an OTA update that adds a new screen?",
        np: "नयाँ screen OTA मार्फत थप्न सकिन्छ?",
        jp: "新しい画面を OTA で追加できる？",
      },
      answer: {
        en: "**Yes, if the screen is pure JS/TSX** with no new native dependencies. Adding a screen that uses a new `expo-*` or native library — e.g. adding `expo-barcode-scanner` for the first time — requires rebuilding the native binary because the native module must be compiled in. OTA only ships the JS bundle delta.",
        np: "नेटिव dependency नभएको JS screen OTA ले थप्न सकिन्छ।",
        jp: "純粋な JS 画面なら可能です。ネイティブモジュールを新たに追加する場合はストアビルドが必要です。",
      },
    },
    {
      question: {
        en: "What is the difference between version, buildNumber, and versionCode?",
        np: "version, buildNumber, versionCode मा के फरक छ?",
        jp: "version、buildNumber、versionCode の違いは？",
      },
      answer: {
        en: "`version` (e.g. `\"1.3.0\"`) is the **marketing version** displayed in the stores and visible to users. `buildNumber` (iOS) and `versionCode` (Android) are **store-internal integers** that must increase monotonically with every upload — the stores reject a binary with the same or lower build integer as a previous submission. You can upload multiple builds for the same `version` (e.g., for bug fixes before promotion to production).",
        np: "version देखिने; buildNumber/versionCode स्टोरले जाँच्छ र हमेसा बढ्नुपर्छ।",
        jp: "`version` はユーザーに見える番号、`buildNumber`/`versionCode` はストアが管理する単調増加の整数です。",
      },
    },
    {
      question: {
        en: "Should I use `eas update` or release a new store build for a hotfix?",
        np: "hotfix मा OTA वा store build?",
        jp: "ホットフィックスは OTA と store build どちら？",
      },
      answer: {
        en: "Use **OTA (`eas update`)** when the bug is in JS/TS logic or assets only — it reaches users in minutes. Use a **full store build** when the bug is in native code, a native dependency, or your app config (`app.json` native fields). A good rule of thumb: if the fix does not require changing `ios/` or `android/` folders, OTA is safe and much faster.",
        np: "JS/asset bug मा OTA, native bug मा store build।",
        jp: "JS/アセットのみのバグは OTA、ネイティブコードのバグはストアビルドを使います。",
      },
    },
    {
      question: {
        en: "What should I learn after this course to become a senior React Native developer?",
        np: "senior RN developer बन्न पछि के सिक्ने?",
        jp: "シニア React Native 開発者になるには次に何を学ぶ？",
      },
      answer: {
        en: "Focus on four areas: (1) **Native modules** — write Swift and Kotlin bridges to access platform APIs unavailable in JS. (2) **Performance** — master the JS/native bridge thread model, `useMemo`/`useCallback`, `react-native-reanimated` for 60fps animations on the UI thread. (3) **Architecture** — learn feature-sliced design, React Query + Zustand patterns, and monorepo setups sharing code with a Next.js web app. (4) **CI/CD** — automate EAS builds, E2E tests with Maestro or Detox, and release trains so the whole team can ship confidently.",
        np: "Native modules, Performance (reanimated), Architecture (React Query/Zustand), CI/CD (EAS + E2E)।",
        jp: "①ネイティブモジュール ②パフォーマンス（reanimated） ③アーキテクチャ（React Query/Zustand） ④CI/CD（EAS + E2E）の 4 領域を深めましょう。",
      },
    },
  ],
};
