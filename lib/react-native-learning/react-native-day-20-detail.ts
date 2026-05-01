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
        en: "App Icon and Splash Screen Setup",
        np: "App Icon र Splash Screen सेटअप",
        jp: "アプリアイコンとスプラッシュスクリーンの設定",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Your app icon and splash screen are the first things users see — they need to meet strict platform requirements. iOS requires a **1024×1024 PNG** with no transparency and no pre-rounded corners (iOS rounds them automatically). Android requires the same base size plus an **adaptive icon** (separate foreground + background layers) for devices running API 26+. Configure both in `app.json` under the `expo` key.",
            np: "iOS: 1024×1024 PNG, transparency नहुने। Android: adaptive icon (foreground + background)। app.json मा configure गर्नुस्।",
            jp: "iOS は 1024×1024 の PNG（透過なし）、Android は API 26 以上向けにアダプティブアイコン（前景＋背景レイヤー）が必要です。`app.json` で設定します。",
          },
        },
        {
          type: "code",
          title: {
            en: "app.json — icon and splash screen configuration",
            np: "app.json icon र splash config",
            jp: "app.json アイコン・スプラッシュ設定",
          },
          code: `{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#6366f1"
    },
    "ios": {
      "icon": "./assets/icon.png",
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "android": {
      "icon": "./assets/icon.png",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#6366f1"
      },
      "package": "com.yourcompany.yourapp"
    }
  }
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**iOS icon rules**: 1024×1024 PNG, RGB colour space, no transparency (fully opaque), no pre-applied rounded corners — the OS applies them. Any transparency will be rejected at upload.",
              np: "iOS: 1024×1024, पारदर्शिता नहुने, कुना नगोलाउनुस् — OS ले गर्छ।",
              jp: "iOS は 1024×1024 の不透明 PNG。角丸は OS が適用するため事前に入れないこと。",
            },
            {
              en: "**Android adaptive icon safe zone**: the inner **66%** of the foreground image is the guaranteed visible area across all launcher shapes (circle, squircle, rounded square). Keep critical content inside this zone to avoid clipping.",
              np: "Android adaptive icon: भित्री 66% safe zone मा मुख्य content राख्नुस्।",
              jp: "Android アダプティブアイコンの**セーフゾーンは内側 66%**。ランチャー形状に関わらずこの範囲は必ず表示されます。",
            },
            {
              en: "**Asset compression**: use `npx expo-optimize` or squash.io before submission. Uncompressed icons add unnecessary app size. Compress PNGs to under 200 KB before building.",
              np: "npx expo-optimize वा squash.io ले compress गर्नुस्।",
              jp: "提出前に `npx expo-optimize` または squash.io で圧縮してください。",
            },
            {
              en: "**Splash screen resizeMode**: `contain` fits the image within the background while preserving aspect ratio; `cover` fills the screen and may crop edges. Use `contain` with a solid `backgroundColor` that matches your brand colour for the cleanest result.",
              np: "resizeMode: contain (letterbox) वा cover (crop)। contain + solid background राम्रो।",
              jp: "`contain` はアスペクト比を保ちます。`cover` は画面を塗りつぶしますが端が切れる場合があります。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Optimizing Assets and JavaScript Bundle",
        np: "Assets र JS Bundle अप्टिमाइज गर्ने",
        jp: "アセットと JavaScript バンドルの最適化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A smaller app bundle means faster downloads, quicker cold-start times, and lower memory usage. Optimization has two fronts: **asset compression** (images, fonts) and **JS bundle trimming** (Hermes, tree-shaking, lazy loading, removing dead dependencies).",
            np: "सानो bundle → छिटो download, छिटो startup। Asset compression र JS bundle trimming दुवै गर्नुस्।",
            jp: "バンドルを小さくするとダウンロードが速く、コールドスタートも改善します。アセット圧縮と JS バンドル削減の 2 軸で取り組みます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Asset optimization — expo-optimize and sharp CLI",
            np: "Asset compression कमाण्डहरू",
            jp: "アセット最適化コマンド",
          },
          code: `# Install expo-optimize (asset compression)
npx expo-optimize

# Or manually with sharp CLI for batch PNG/JPEG compression
npx sharp-cli --input ./assets/**/*.png --output ./assets-optimized/`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Use **WebP** format for Android images — WebP achieves 25–35% smaller file sizes than JPEG at equivalent quality and is natively supported on Android API 15+.",
              np: "Android मा WebP format प्रयोग गर्नुस् — JPEG भन्दा 25–35% सानो।",
              jp: "Android 画像は **WebP** 形式を使うと JPEG 比 25〜35% 小さくなります。",
            },
            {
              en: "Use **`react-native-svg`** with SVG files instead of PNG for icons and illustrations — SVGs are resolution-independent and usually much smaller than rasterized PNGs.",
              np: "Icon को लागि react-native-svg + SVG प्रयोग गर्नुस्।",
              jp: "アイコンは **react-native-svg** で SVG を使うと解像度非依存でサイズも小さくなります。",
            },
          ],
        },
        {
          type: "code",
          title: {
            en: "app.json — enable Hermes JS engine",
            np: "Hermes JS engine enable गर्ने",
            jp: "Hermes エンジンの有効化",
          },
          code: `// app.json — enable Hermes engine (default in Expo SDK 48+)
{
  "expo": {
    "jsEngine": "hermes"
  }
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Hermes** pre-compiles your JavaScript to bytecode at **build time** rather than parsing it at runtime. This produces faster Time-To-Interactive (TTI), lower peak memory usage, and smaller JS bundle size. Hermes is the default engine from Expo SDK 48 onwards — enable it explicitly if you're on an older SDK.",
            np: "Hermes ले JS लाई build time मा bytecode मा compile गर्छ → छिटो startup, कम memory।",
            jp: "**Hermes** はビルド時に JS をバイトコードへプリコンパイルし、TTI 短縮・メモリ削減・バンドル縮小を実現します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Analyze JS bundle size after export",
            np: "Bundle size analysis",
            jp: "バンドルサイズの分析",
          },
          code: `# Analyze bundle size
npx expo export --platform android
# View stats in dist/_expo/static/js/`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Remove unused dependencies with **`npx depcheck`** — it lists packages that are declared in `package.json` but never imported. Removing them shrinks `node_modules` and therefore the bundle.",
              np: "npx depcheck ले unused dependencies देखाउँछ।",
              jp: "`npx depcheck` で未使用パッケージを特定して削除しましょう。",
            },
            {
              en: "Use **dynamic imports** and **React.lazy** for heavy screens that are not needed on the initial render — e.g. a PDF viewer or a complex chart screen. This splits the bundle and defers loading until navigation.",
              np: "भारी screen लाई dynamic import / React.lazy प्रयोग गर्नुस्।",
              jp: "重い画面には **dynamic import / React.lazy** を使いバンドルを分割しましょう。",
            },
            {
              en: "Avoid bloated libraries: replace **moment.js** (329 KB) with **date-fns** (tree-shakable, ~13 KB per used function), and replace full **lodash** with **lodash-es** so bundlers can tree-shake unused utilities.",
              np: "moment.js → date-fns, lodash → lodash-es (tree-shaking)।",
              jp: "moment.js → date-fns、lodash → lodash-es に置き換えてツリーシェイキングを活用しましょう。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Error Reporting with Sentry",
        np: "Sentry सँग Error Reporting",
        jp: "Sentry によるエラー報告",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Shipping to the store means you lose the ability to see crashes in your terminal. **Sentry** fills that gap — it captures unhandled JS exceptions, native crashes, and performance traces, then maps them back to your original TypeScript source via **source maps** uploaded during the EAS build. You get a stack trace pointing to the exact line in your `.tsx` file, not minified bytecode.",
            np: "Production मा crash देख्न Sentry चाहिन्छ। Source map upload गरेमा original TypeScript line देखाउँछ।",
            jp: "本番では Sentry がクラッシュを補足し、EAS ビルド時にアップロードしたソースマップで元の TypeScript の行番号を特定できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Install Sentry packages",
            np: "Sentry install गर्ने",
            jp: "Sentry パッケージのインストール",
          },
          code: `npx expo install @sentry/react-native sentry-expo`,
        },
        {
          type: "code",
          title: {
            en: "app.tsx — initialize Sentry and wrap root component",
            np: "Sentry initialize र root wrap गर्ने",
            jp: "Sentry の初期化とルートコンポーネントのラップ",
          },
          code: `// app.tsx — initialize Sentry
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableInExpoDevelopment: false, // only report in production
  debug: false,
  tracesSampleRate: 0.2, // 20% of transactions for performance monitoring
  profilesSampleRate: 0.1,
});

export default Sentry.wrap(App); // wrap root component for error boundaries`,
        },
        {
          type: "code",
          title: {
            en: "app.json — Sentry plugin for source map uploads during EAS builds",
            np: "app.json Sentry plugin config",
            jp: "app.json の Sentry プラグイン設定",
          },
          code: `{
  "expo": {
    "plugins": [
      [
        "@sentry/react-native/expo",
        {
          "organization": "your-org",
          "project": "your-project"
        }
      ]
    ]
  }
}`,
        },
        {
          type: "code",
          title: {
            en: "Manual error capture and user context",
            np: "Manual error capture र user context",
            jp: "手動エラーキャプチャとユーザーコンテキスト",
          },
          code: `// Capture a specific error with context
Sentry.captureException(error, {
  extra: { userId: user?.id, screen: 'UploadScreen' },
  tags: { action: 'image_upload' },
});

// Capture a message (non-exception)
Sentry.captureMessage('Payment flow reached unexpected state', 'warning');

// Add user context
Sentry.setUser({ id: user.id, email: user.email });`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Set **`enableInExpoDevelopment: false`** so Sentry only reports errors in production builds — you don't want development noise polluting your error dashboard.",
              np: "Development मा Sentry disable गर्नुस् — production मा मात्र report गर्नुस्।",
              jp: "`enableInExpoDevelopment: false` で開発中の不要なノイズをダッシュボードに送らないようにします。",
            },
            {
              en: "**`tracesSampleRate`** controls what fraction of transactions are sent as performance traces. `0.2` (20%) is a good production default — collecting 100% is expensive. Adjust based on your monthly event quota.",
              np: "tracesSampleRate: 0.2 (20%) production मा राम्रो — 100% महँगो हुन्छ।",
              jp: "`tracesSampleRate: 0.2` で 20% のトランザクションのみを送信し、コストを抑えます。",
            },
            {
              en: "Use **`Sentry.setUser`** after login and **`Sentry.setUser(null)`** after logout so every error report is tied to the user who experienced it — critical for reproducing bugs.",
              np: "Login पछि Sentry.setUser() र logout पछि null set गर्नुस्।",
              jp: "ログイン後は `Sentry.setUser()` でユーザー情報を紐づけ、ログアウト後は `null` をセットしましょう。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Environment Management with app.config.ts",
        np: "app.config.ts सँग Environment व्यवस्थापन",
        jp: "app.config.ts による環境管理",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Static `app.json` cannot read environment variables. **`app.config.ts`** replaces it with a dynamic TypeScript file that runs at build time — you can read `process.env` to produce different config values for staging vs production. This lets staging and production builds have **separate bundle identifiers**, meaning they can be installed **side-by-side** on the same device for safer QA.",
            np: "app.config.ts dynamic config दिन्छ — staging र production को bundle ID अलग राख्न सकिन्छ, दुवै एकै device मा install हुन सक्छन्।",
            jp: "`app.config.ts` はビルド時に `process.env` を読み取り、ステージングと本番で異なる設定を生成します。バンドル ID を分けることで同一デバイスへの同時インストールが可能になります。",
          },
        },
        {
          type: "code",
          title: {
            en: "app.config.ts — dynamic per-environment configuration",
            np: "app.config.ts dynamic config",
            jp: "app.config.ts の動的設定",
          },
          code: `// app.config.ts — dynamic per-environment config
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.APP_ENV === 'staging' ? 'MyApp (Staging)' : 'MyApp',
  slug: 'myapp',
  ios: {
    bundleIdentifier:
      process.env.APP_ENV === 'staging'
        ? 'com.mycompany.myapp.staging'
        : 'com.mycompany.myapp',
  },
  android: {
    package:
      process.env.APP_ENV === 'staging'
        ? 'com.mycompany.myapp.staging'
        : 'com.mycompany.myapp',
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    eas: { projectId: process.env.EAS_PROJECT_ID },
  },
});`,
        },
        {
          type: "code",
          title: {
            en: "eas.json — set APP_ENV per build profile",
            np: "eas.json मा APP_ENV set गर्ने",
            jp: "eas.json でビルドプロファイルごとに APP_ENV を設定",
          },
          code: `// eas.json — set APP_ENV per build profile
{
  "build": {
    "preview": {
      "env": {
        "APP_ENV": "staging",
        "EXPO_PUBLIC_API_URL": "https://staging-api.example.com"
      }
    },
    "production": {
      "env": {
        "APP_ENV": "production",
        "EXPO_PUBLIC_API_URL": "https://api.example.com"
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
              en: "**Side-by-side installation**: because staging and production have different `bundleIdentifier` / `package` values, both apps can be installed on the same device simultaneously — a QA engineer can compare them without swapping builds.",
              np: "Staging र production को bundle ID फरक हुँदा दुवै एकै device मा राख्न सकिन्छ।",
              jp: "バンドル ID が異なるため、ステージングと本番を同一デバイスに同時インストールして比較できます。",
            },
            {
              en: "Prefix client-side env vars with **`EXPO_PUBLIC_`** — only these are inlined into the JS bundle. Never prefix secrets (API keys, signing keys) with `EXPO_PUBLIC_` or they will be visible in the bundle.",
              np: "Client-side vars लाई EXPO_PUBLIC_ prefix लगाउनुस्। Secret vars लाई यो prefix नगर्नुस्।",
              jp: "クライアントに渡す変数のみ **`EXPO_PUBLIC_`** プレフィックスをつけます。秘密情報にはつけないでください。",
            },
            {
              en: "**`app.config.ts` takes precedence over `app.json`** — if both files exist, Expo uses `app.config.ts`. You can delete `app.json` once migrated, or keep a minimal `app.json` with just the `expo.extra.eas.projectId` for tooling compatibility.",
              np: "app.config.ts ले app.json लाई override गर्छ।",
              jp: "`app.config.ts` は `app.json` より優先されます。移行後は `app.json` を削除しても構いません。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Building the iOS App Step-by-Step",
        np: "iOS App Step-by-Step Build गर्ने",
        jp: "iOS アプリのビルド手順",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Building an iOS app for distribution requires an **Apple Developer Account** ($99/year), a **distribution certificate** (.p12), and a **provisioning profile**. EAS can manage all of these for you via `eas credentials` — it creates, signs, and stores credentials securely in Expo's secrets vault so your CI/CD pipeline never needs local Keychain access.",
            np: "iOS build को लागि Apple Developer Account ($99/year), distribution certificate र provisioning profile चाहिन्छ। EAS ले यी सबै manage गर्न सक्छ।",
            jp: "iOS 配布には **Apple Developer アカウント**（年 $99）、配布証明書（.p12）、プロビジョニングプロファイルが必要です。`eas credentials` で EAS が自動管理できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "iOS build walkthrough — commands",
            np: "iOS build commands",
            jp: "iOS ビルドのコマンド手順",
          },
          code: `# 1. Ensure eas.json is configured with ios credentials
eas credentials

# 2. Build for App Store (production profile)
eas build --platform ios --profile production

# 3. Monitor build at expo.dev/accounts/[username]/projects/[slug]/builds
# Build logs show CocoaPods install, xcodebuild archive, and IPA signing

# 4. Download the .ipa artifact from expo.dev (or let eas submit handle it directly)`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Apple Developer Account** ($99/year) is required to distribute outside TestFlight. Enroll at developer.apple.com. Allow up to 48 hours for account activation after enrolment.",
              np: "Apple Developer Account ($99/year) — developer.apple.com मा enroll गर्नुस्।",
              jp: "Apple Developer アカウント（年 $99）は developer.apple.com で登録。有効化まで最大 48 時間かかります。",
            },
            {
              en: "The **`bundleIdentifier`** in `app.json` must **exactly match** the App ID registered in App Store Connect and the provisioning profile. Any mismatch causes the build to fail at signing.",
              np: "app.json को bundleIdentifier र App Store Connect को App ID बिल्कुल मिल्नुपर्छ।",
              jp: "`bundleIdentifier` は App Store Connect の App ID と完全一致が必要。不一致はサイニングエラーになります。",
            },
            {
              en: "**`app.json` `version`** is the user-visible string (e.g. `\"2.1.0\"`). **`ios.buildNumber`** is the monotonically increasing integer the App Store checks (e.g. `\"42\"`). Both must be set before building for production.",
              np: "version (user-visible) र ios.buildNumber (store integer) दुवै set गर्नुस्।",
              jp: "`version` は表示用の文字列、`ios.buildNumber` はストアが管理する単調増加の整数です。",
            },
            {
              en: "**App icons must have no alpha channel** — the App Store rejects uploads with transparent icon pixels. Run `file assets/icon.png` and verify `color model: RGB, no alpha` before building.",
              np: "App icon मा alpha channel हुनु हुँदैन — App Store ले reject गर्छ।",
              jp: "アイコンにアルファチャンネルがあると App Store アップロードが拒否されます。事前に確認してください。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Distributing to the App Store",
        np: "App Store मा वितरण गर्ने",
        jp: "App Store への配布",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Once your iOS build is complete on EAS, use **`eas submit`** to upload the compiled `.ipa` directly to **App Store Connect**. Submission only uploads the binary — you must complete the app record in App Store Connect (screenshots, descriptions, privacy labels, age rating) before submitting for Apple review.",
            np: "eas submit ले .ipa App Store Connect मा upload गर्छ। Metadata भने App Store Connect मा नै भर्नुपर्छ।",
            jp: "`eas submit` でコンパイル済みの .ipa を App Store Connect にアップロードします。スクリーンショット等のメタデータはコンソールで手入力が必要です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Submit to App Store Connect via EAS",
            np: "App Store मा submit गर्ने",
            jp: "EAS で App Store Connect に提出",
          },
          code: `# Submit the latest iOS build from EAS to App Store Connect
eas submit --platform ios --profile production

# Or specify a build ID
eas submit --platform ios --id <build-id>`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**App Store Connect setup**: create the app record, set the category, configure the age rating questionnaire, and add your privacy policy URL before attempting submission.",
              np: "App Store Connect मा app record, category, age rating, privacy policy URL थप्नुस्।",
              jp: "App Store Connect でアプリレコード作成・カテゴリ・年齢制限・プライバシーポリシー URL を入力してから提出します。",
            },
            {
              en: "**Screenshots**: Apple requires at minimum **iPhone 6.5 inch** (1284×2778) and **iPad 12.9 inch** (2048×2732) sizes. You can capture these from Xcode Simulator. Fastlane snapshot can automate screenshot generation.",
              np: "Screenshot: iPhone 6.5\" र iPad 12.9\" size अनिवार्य। Simulator बाट लिन सकिन्छ।",
              jp: "スクリーンショットは最低限 iPhone 6.5 インチと iPad 12.9 インチサイズが必要。Simulator から取得できます。",
            },
            {
              en: "**Privacy nutrition label**: declare every category of data your app collects (e.g. email addresses, crash data, identifiers) and link it to a purpose. Apple enforces this strictly — omissions can cause rejection.",
              np: "Privacy label: app ले collect गर्ने data declare गर्नुस्। नगरे reject हुन सक्छ।",
              jp: "プライバシーラベルは収集するデータカテゴリと目的を正確に申告してください。不備は却下の原因になります。",
            },
            {
              en: "**TestFlight first**: distribute your `preview` build to internal and external testers for **1–2 weeks** before submitting to the public store. This surface crashes and UX issues before they reach all users.",
              np: "Store submit गर्नु अघि TestFlight मा 1-2 हप्ता test गर्नुस्।",
              jp: "本番申請の前に TestFlight で 1〜2 週間テストし、クラッシュや UX 問題を事前に発見しましょう。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Building the Android App Step-by-Step",
        np: "Android App Step-by-Step Build गर्ने",
        jp: "Android アプリのビルド手順",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Android production builds for the Play Store must be in **AAB (Android App Bundle)** format — the Play Store handles APK splitting per device architecture. For direct device installs (internal testing outside Play Store), use **APK** format via the `preview` profile. EAS can generate and securely store your **keystore** file so your signing key is never lost.",
            np: "Play Store मा AAB format चाहिन्छ। Direct install को लागि APK। Keystore EAS ले manage गर्न सक्छ।",
            jp: "Play Store には **AAB 形式**が必須。デバイス直接インストールは APK。キーストアは EAS に安全に保管できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Android build walkthrough — commands",
            np: "Android build commands",
            jp: "Android ビルドのコマンド手順",
          },
          code: `# Build for Google Play (AAB format, required for Play Store)
eas build --platform android --profile production

# The output is a .aab (Android App Bundle) — Play Store handles APK splitting
# For direct APK install use: eas build --platform android --profile preview`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Google Play Developer Account** ($25 one-time fee) at play.google.com/console. Account activation is usually instant after the fee is paid, but can take up to 3 days.",
              np: "Google Play Developer Account: $25 one-time। play.google.com/console मा register गर्नुस्।",
              jp: "Google Play Developer アカウントは $25 の一回払い。通常即時有効化されます。",
            },
            {
              en: "**Keystore management**: run `eas credentials` to have EAS generate, sign, and store your Android keystore. Never lose the keystore — without it you cannot publish updates to an existing app on the Play Store.",
              np: "eas credentials ले keystore manage गर्छ। Keystore नगुमाउनुस् — नभए update publish गर्न सकिँदैन।",
              jp: "キーストアは `eas credentials` で EAS に管理させましょう。失うと既存アプリのアップデートを公開できなくなります。",
            },
            {
              en: "**`versionCode`** in `app.json` must increase with every Play Store upload — use `\"autoIncrement\": true` in the production EAS profile to handle this automatically.",
              np: "versionCode हर upload मा बढ्नुपर्छ। autoIncrement: true राख्नुस्।",
              jp: "`versionCode` は毎回増やす必要があります。EAS プロファイルで `autoIncrement: true` を使いましょう。",
            },
            {
              en: "**Target SDK**: Google requires apps to target a recent Android API level (currently API 34 / Android 14). EAS builds with the Expo SDK set the correct `compileSdkVersion` and `targetSdkVersion` automatically — check expo.dev/changelog for the current SDK's Android target.",
              np: "Target SDK: Google API 34 (Android 14) require गर्छ। Expo SDK ले automatically set गर्छ।",
              jp: "Google は現在 API 34 以上を要求。Expo SDK が `targetSdkVersion` を自動設定します。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Distributing to the Google Play Store",
        np: "Google Play Store मा वितरण गर्ने",
        jp: "Google Play Store への配布",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`eas submit`** uses a Google Play **service account JSON** file (created in Google Play Console → Setup → API access) to authenticate and upload your AAB to a chosen release track. The service account needs `Release Manager` permissions on your app in the Play Console.",
            np: "eas submit ले service-account.json प्रयोग गरेर AAB upload गर्छ। Play Console मा API access setup गर्नुस्।",
            jp: "`eas submit` は Google Play の**サービスアカウント JSON**（Play Console → API アクセスで作成）を使って AAB をアップロードします。",
          },
        },
        {
          type: "code",
          title: {
            en: "Submit to Google Play via EAS",
            np: "Google Play मा submit गर्ने",
            jp: "EAS で Google Play に提出",
          },
          code: `# Submit the latest Android build from EAS to Google Play (internal track)
eas submit --platform android --profile production

# service-account.json from Google Play Console (API access) must be configured in eas.json`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Internal testing track** — up to 100 testers, changes are live within seconds. Ideal for the dev team and trusted stakeholders during development.",
              np: "Internal testing: 100 जना सम्म, तुरुन्त live। Developer team को लागि।",
              jp: "**内部テストトラック** — 最大 100 名、数秒で公開。開発チームのテストに最適。",
            },
            {
              en: "**Closed testing (alpha)** — invite specific users or Google Groups. Useful for a limited beta with select users before open beta.",
              np: "Closed testing (alpha): specific users वा groups लाई invite।",
              jp: "**クローズドテスト（アルファ）** — 特定ユーザーやグループを招待。限定ベータに使います。",
            },
            {
              en: "**Open testing (beta)** — any user can opt in via the Play Store listing. Good for gathering broader feedback before production launch.",
              np: "Open testing (beta): कुनै पनि user opt-in गर्न सक्छ।",
              jp: "**オープンテスト（ベータ）** — 誰でもオプトイン可能。広範なフィードバック収集に使います。",
            },
            {
              en: "**Production with staged rollout** — release to a percentage of users (e.g. 10% → 50% → 100%) over several days. Monitor **Android Vitals** (crash rate, ANR rate) between each stage and halt/rollback if metrics degrade.",
              np: "Production staged rollout: 10% → 50% → 100%। Android Vitals (crash rate, ANR) monitor गर्नुस्।",
              jp: "**段階的公開**で 10% → 50% → 100% と展開。各段階で Android Vitals（クラッシュ率・ANR 率）を監視し問題があればロールバック。",
            },
            {
              en: "**ANRs (App Not Responding)**: triggered when the main thread is blocked for >5 seconds. Monitor ANR rate in Play Console → Android Vitals. Common causes are heavy work on the JS thread — move to background workers or async operations.",
              np: "ANR: main thread 5 sec भन्दा बढी block भए trigger हुन्छ। Play Console Vitals मा monitor गर्नुस्।",
              jp: "**ANR** はメインスレッドが 5 秒以上ブロックされると発生。Play Console → Android Vitals で監視し、重い処理はバックグラウンドに移しましょう。",
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
