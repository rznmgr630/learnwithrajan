import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 17 — Geolocation hooks + React Navigation nested stacks/tabs architecture. */
export const REACT_NATIVE_DAY_17_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Two heavy-hitting topics land on the same day: **geolocation** (requesting foreground permissions, one-shot and live position updates, custom `useLocation` hook with cleanup) and **React Navigation** (nested Tab + Stack navigators, TypeScript param lists, `useNavigation` / `useRoute` hooks, deep linking). Together they represent the skeleton of almost every production RN app.",
      np: "जियोलोकेसन हुक र React Navigation नेस्टेड संरचना।",
      jp: "**ジオロケーション**のカスタムフックと **React Navigation**（タブ・スタックのネスト・TypeScript型定義）を同時に学びます。",
    },
  ],
  sections: [
    {
      title: { en: "expo-location — Permissions & Getting a Position", np: "expo-location अनुमति र स्थान", jp: "expo-location の権限と位置取得" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`expo-location`** wraps CoreLocation (iOS) and FusedLocationProviderClient (Android) behind a unified API. Always call **`requestForegroundPermissionsAsync`** before any location call — the OS blocks all location reads without it. Use **`getCurrentPositionAsync`** for a one-shot fix and **`watchPositionAsync`** for live tracking. Both accept an `accuracy` option (Low through BestForNavigation) that trades battery life for precision.",
            np: "`requestForegroundPermissionsAsync` पहिले, त्यसपछि स्थान लिनुस्।",
            jp: "位置取得前に必ず **`requestForegroundPermissionsAsync`** を呼びます。一度だけなら `getCurrentPositionAsync`、継続なら `watchPositionAsync` を使います。",
          },
        },
        {
          type: "code",
          title: { en: "`useLocation` custom hook with cleanup", np: "useLocation हुक", jp: "useLocation カスタムフック" },
          code: `import { useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { Linking, Alert } from 'react-native';

export interface LocationState {
  coords: Location.LocationObjectCoords | null;
  error: string | null;
  loading: boolean;
}

/**
 * Custom hook that requests foreground location permission and returns
 * the current coordinates. Uses an 'alive' flag to avoid setState-after-
 * unmount warnings when the component is removed before the async call resolves.
 */
export function useLocation(): LocationState & { refresh: () => void } {
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { status, canAskAgain } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        if (!canAskAgain) {
          Alert.alert(
            'Location blocked',
            'Enable location access in Settings to use this feature.',
            [
              { text: 'Not now', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
        }
        setError('Permission denied');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoords(position.coords);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not get location');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    // Only call fetchLocation if still mounted
    fetchLocation().catch(() => {
      if (!alive) return;
    });
    return () => { alive = false; };
  }, [fetchLocation]);

  return { coords, error, loading, refresh: fetchLocation };
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "The **`alive` flag pattern** is critical when using async calls inside `useEffect`: if the component unmounts before `getCurrentPositionAsync` resolves (e.g. the user navigates away immediately), calling `setCoords` on the unmounted component would trigger a warning. The cleanup function sets `alive = false` so any in-flight callbacks know to discard their results.",
            np: "`alive` ले unmount पछि state अपडेट रोक्छ।",
            jp: "**`alive` フラグ**で unmount 後の setState 警告とメモリリークを防ぎます。",
          },
        },
      ],
    },
    {
      title: { en: "Live Position Tracking with watchPositionAsync", np: "लाइभ ट्र्याकिंग", jp: "watchPositionAsync でリアルタイム追跡" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`watchPositionAsync` returns a **`LocationSubscription`** object with a `remove()` method. Always call `remove()` in the `useEffect` cleanup function to stop the GPS hardware from draining the battery after the component unmounts. Set `timeInterval` and `distanceInterval` to prevent update floods: a 5-second or 10-metre threshold is appropriate for most tracking UIs.",
            np: "`subscription.remove()` cleanup मा बोलाउनुस्।",
            jp: "`watchPositionAsync` は **`LocationSubscription`** を返します。cleanup で `remove()` を呼ばないとGPSが動き続けます。",
          },
        },
        {
          type: "code",
          title: { en: "`watchPositionAsync` hook with cleanup", np: "वाच क्लिनअप", jp: "継続追跡と cleanup" },
          code: `import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

/**
 * Hook for continuous GPS tracking.
 * Cleans up the hardware subscription when the component unmounts.
 */
export function useLiveLocation() {
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || !mounted) return;

      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,       // minimum 5 s between updates
          distanceInterval: 10,     // minimum 10 m between updates
        },
        (location) => {
          if (mounted) setCoords(location.coords);
        },
      );
    })();

    return () => {
      mounted = false;
      subscriptionRef.current?.remove();  // stop GPS hardware
      subscriptionRef.current = null;
    };
  }, []);

  return coords;
}`,
        },
      ],
    },
    {
      title: { en: "React Navigation Nested Architecture — Tabs + Stacks", np: "ट्याब र स्ट्याक नेस्टिंग", jp: "タブ＋スタックのネスト構成" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The standard pattern for a production app is: **`NavigationContainer`** at the root, then either an **`AuthNavigator`** (Stack) for unauthenticated users or an **`AppNavigator`** (Tabs) for authenticated users. Each tab contains its own **Stack navigator**, giving each tab an **independent navigation history** — pressing Back inside the Feed tab only pops within that tab's stack, not across the whole app.",
            np: "प्रत्येक ट्याबको आफ्नै Stack इतिहास हुन्छ।",
            jp: "各タブが**独立したスタック履歴**を持つのが定番構成です。タブをまたいだ Back はなく、タブ内だけで pop します。",
          },
        },
        { type: "diagram", id: "react-native-navigation-stacks" },
        {
          type: "code",
          title: { en: "TypeScript param lists and nested navigator setup", np: "TypeScript नेभिगेसन टाइप", jp: "TypeScript 型定義とネスト構成" },
          code: `// navigation/types.ts
import type { NavigatorScreenParams } from '@react-navigation/native';

export type FeedStackParamList = {
  FeedList: undefined;
  ListingDetail: { id: string; title: string };
};

export type AccountStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
};

export type AppTabParamList = {
  Feed: NavigatorScreenParams<FeedStackParamList>;
  Account: NavigatorScreenParams<AccountStackParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: { email?: string };
};

// navigation/FeedNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const FeedStack = createNativeStackNavigator<FeedStackParamList>();

export function FeedNavigator() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen name="FeedList" component={FeedListScreen} />
      <FeedStack.Screen
        name="ListingDetail"
        component={ListingDetailScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </FeedStack.Navigator>
  );
}

// navigation/AppNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const AppTab = createBottomTabNavigator<AppTabParamList>();

export function AppNavigator() {
  return (
    // headerShown: false lets each child Stack own its header
    <AppTab.Navigator screenOptions={{ headerShown: false }}>
      <AppTab.Screen name="Feed" component={FeedNavigator} />
      <AppTab.Screen name="Account" component={AccountNavigator} />
    </AppTab.Navigator>
  );
}`,
        },
      ],
    },
    {
      title: { en: "useNavigation and useRoute Hooks", np: "useNavigation र useRoute", jp: "useNavigation と useRoute フック" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`useNavigation`** and **`useRoute`** let any component deep in the tree access navigation actions and route params without prop drilling. Type them against your param list so TypeScript enforces the exact params required for each route, catching typos and missing fields at compile time rather than at runtime.",
            np: "Prop drilling नगरी navigation र params पाउनुस्।",
            jp: "**`useNavigation`** と **`useRoute`** でプロップ drilling なしに型安全に navigation と params にアクセスできます。",
          },
        },
        {
          type: "code",
          title: { en: "`useNavigation` + `useRoute` with TypeScript", np: "टाइप गरिएको हुक", jp: "TypeScript 付きフック" },
          code: `import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { FeedStackParamList } from '@/navigation/types';

// Typed alias for the Feed stack navigation prop
type FeedNav = NativeStackNavigationProp<FeedStackParamList>;

// --- Inside a deeply nested component (no need to pass navigation as prop) ---
function ListingCard({ id, title }: { id: string; title: string }) {
  const navigation = useNavigation<FeedNav>();

  return (
    <Pressable onPress={() => navigation.navigate('ListingDetail', { id, title })}>
      <Text>{title}</Text>
    </Pressable>
  );
}

// --- Inside ListingDetailScreen ---
function ListingDetailScreen() {
  // useRoute gives typed access to route.params
  const route = useRoute<RouteProp<FeedStackParamList, 'ListingDetail'>>();
  const { id, title } = route.params; // TypeScript knows these exist

  return <Text>{title} — {id}</Text>;
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`navigation.navigate('Screen', params)`** — go to a screen within the same stack. If the screen is already in the stack, React Navigation re-focuses it and updates params.",
              np: "`navigate` — स्क्रिनमा जानुस्।",
              jp: "**`navigate`** で同スタック内の画面に移動します。既存インスタンスがあれば再利用します。",
            },
            {
              en: "**`navigation.push('Screen', params)`** — always pushes a new entry, even if that screen is already in the stack. Use this for drill-down lists.",
              np: "`push` — सधैँ नयाँ इन्ट्री थप्छ।",
              jp: "**`push`** は常に新規エントリを追加します。ドリルダウンに適しています。",
            },
            {
              en: "**`navigation.goBack()`** — pops the current screen from the stack.",
              np: "`goBack` — पछाडि फर्कनुस्।",
              jp: "**`goBack()`** でひとつ前の画面に戻ります。",
            },
            {
              en: "**`navigation.reset({ index: 0, routes: [{ name: 'Home' }] })`** — replaces the entire stack history, essential after login/logout to prevent the user from pressing Back into auth screens.",
              np: "`reset` — लगइन/लगआउट पछि स्ट्याक खाली गर्नुस्।",
              jp: "**`reset`** はログイン後にスタックをまるごと置き換えるときに使います。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Deep Linking Configuration", np: "डिप लिंकिंग", jp: "ディープリンクの設定" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Deep linking** maps URL paths or universal links to screens. Pass a `linking` config object to `NavigationContainer` with a `prefixes` array (your app scheme and domain) and a `config` tree that mirrors your navigator nesting. React Navigation resolves the URL to the correct screen and params automatically. Test during development with `npx uri-scheme open 'myapp://listings/42'` — no web server needed.",
            np: "NavigationContainer मा `linking` config थप्नुस्।",
            jp: "**`NavigationContainer`** に `linking` を渡してURLパスと画面をマップします。開発中は `uri-scheme` コマンドでテストできます。",
          },
        },
        {
          type: "code",
          title: { en: "Deep linking config in NavigationContainer", np: "डिप लिंक config", jp: "ディープリンク設定" },
          code: `// App.tsx
import { NavigationContainer } from '@react-navigation/native';

const linking = {
  prefixes: [
    'myapp://',
    'https://myapp.example.com',
  ],
  config: {
    screens: {
      // Match the AppTabParamList structure
      Feed: {
        screens: {
          FeedList: 'listings',
          ListingDetail: 'listings/:id',   // :id maps to route.params.id
        },
      },
      Account: {
        screens: {
          Profile: 'profile',
          EditProfile: 'profile/edit',
        },
      },
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// Test deep links in development:
// npx uri-scheme open 'myapp://listings/42' --ios
// npx uri-scheme open 'myapp://listings/42' --android`,
        },
      ],
    },
    // ── NEW SECTIONS ──────────────────────────────────────────────────────────
    {
      title: {
        en: "Installing React Navigation",
        np: "React Navigation स्थापना",
        jp: "React Navigation のインストール",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React Navigation is split into small packages so you only ship what you use. The **core** package provides `NavigationContainer`, the context layer that every navigator must live inside. Two peer dependencies — **`react-native-screens`** (native screen primitives) and **`react-native-safe-area-context`** (safe-area insets) — are mandatory; Expo manages their native modules automatically via `npx expo install`.",
            np: "React Navigation लाई सानो-सानो प्याकेजमा बाँडिएको छ। `react-native-screens` र `react-native-safe-area-context` अनिवार्य peer dependency हुन्। `npx expo install` ले आफैँ सही संस्करण छान्छ।",
            jp: "React Navigation は小パッケージに分割されています。**コア**と2つの必須ピア依存（`react-native-screens`・`react-native-safe-area-context`）が必要です。`npx expo install` が正しいバージョンを自動選択します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Installation commands",
            np: "स्थापना आदेशहरू",
            jp: "インストールコマンド",
          },
          code: `# Core navigation library
npx expo install @react-navigation/native

# Expo-friendly peer dependencies
npx expo install react-native-screens react-native-safe-area-context

# Stack navigator
npx expo install @react-navigation/native-stack

# Bottom tab navigator
npx expo install @react-navigation/bottom-tabs`,
        },
        {
          type: "code",
          title: {
            en: "Wrap the app in NavigationContainer (App.tsx)",
            np: "NavigationContainer मा App लपेट्नुस्",
            jp: "App.tsx を NavigationContainer でラップする",
          },
          code: `// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "`NavigationContainer` must be the outermost navigation wrapper in your component tree. It manages the navigation state, handles deep links, and provides the context that all `useNavigation` / `useRoute` calls read from. Wrap it around the entire app in `App.tsx`, not around individual screens.",
            np: "`NavigationContainer` सबैभन्दा बाहिरी wrapper हुनुपर्छ। यसले navigation state, deep link, र `useNavigation` को context व्यवस्थापन गर्छ।",
            jp: "`NavigationContainer` はツリーの最外殻に置きます。ナビゲーション状態・ディープリンク・`useNavigation` コンテキストをすべて管理します。",
          },
        },
      ],
    },
    {
      title: {
        en: "Stack Navigator — Basics",
        np: "Stack Navigator — आधारभूत",
        jp: "Stack Navigator の基本",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A **native stack navigator** renders screens using the platform's native stack — `UINavigationController` on iOS and `Fragment` transactions on Android — giving you native animations and gestures for free. Call `createNativeStackNavigator()` once, then use the returned `Stack.Navigator` and `Stack.Screen` components to declare your routes.",
            np: "**Native Stack Navigator** ले iOS मा `UINavigationController` र Android मा `Fragment` प्रयोग गर्छ, जसले native animation र gesture सित्तैमा दिन्छ।",
            jp: "**ネイティブスタックナビゲーター**はiOSの `UINavigationController`・AndroidのFragment トランジションを使い、ネイティブアニメーションとジェスチャーを無料で提供します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Minimal stack setup with screen options",
            np: "न्यूनतम Stack सेटअप",
            jp: "最小限のスタック構成",
          },
          code: `import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My App' }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`navigation.navigate('Screen', params)`** — go to a screen. If the screen is already in the stack, React Navigation re-focuses it.",
              np: "`navigate` — स्क्रिनमा जानुस्; पहिले नै भए त्यसैमा फोकस गर्छ।",
              jp: "`navigate` — 既存なら再フォーカス、なければ新規追加します。",
            },
            {
              en: "**`navigation.push('Screen', params)`** — always adds a new entry even if the screen exists. Use for drill-down lists.",
              np: "`push` — सधैँ नयाँ stack entry थप्छ। drill-down सूचीका लागि प्रयोग गर्नुस्।",
              jp: "`push` — 常に新規エントリを追加。ドリルダウンリストに最適。",
            },
            {
              en: "**`navigation.goBack()`** — pops the current screen from the stack.",
              np: "`goBack` — हालको स्क्रिन stack बाट हटाउँछ।",
              jp: "`goBack()` — 現在の画面をスタックから取り除きます。",
            },
            {
              en: "**`initialRouteName`** on `Stack.Navigator` sets which screen shows first. If omitted, the first declared `Stack.Screen` is used.",
              np: "`initialRouteName` ले पहिलो देखाइने screen तोक्छ। नभए पहिलो `Stack.Screen` प्रयोग हुन्छ।",
              jp: "`initialRouteName` で最初の画面を指定します。省略時は最初の `Stack.Screen` が使われます。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Passing Parameters to Routes",
        np: "Routes मा Parameters पठाउने",
        jp: "ルートへのパラメーター受け渡し",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Route params are the primary mechanism for passing data between screens. Pass them as the second argument to `navigation.navigate`. On the receiving end, access them via `route.params`. With TypeScript, type your param lists and use `NativeStackScreenProps` so the compiler enforces the exact shape of every param object at the call site.",
            np: "Route params ले screen हरूबिच data पठाउँछ। TypeScript सहित `NativeStackScreenProps` प्रयोग गर्दा compiler ले params को shape जाँच गर्छ।",
            jp: "ルートパラメーターは画面間のデータ受け渡しの主要手段です。TypeScript の `NativeStackScreenProps` を使うとコンパイル時に型チェックが働きます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Sending and receiving params safely",
            np: "Params पठाउने र सुरक्षित रूपमा लिने",
            jp: "パラメーターの送受信（型安全）",
          },
          code: `// Sending params
navigation.navigate('Details', { itemId: 42, title: 'Listing' });

// Receiving params (with TypeScript)
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type AppStackParamList = {
  Home: undefined;
  Details: { itemId: number; title: string };
};

function DetailsScreen({ route }: NativeStackScreenProps<AppStackParamList, 'Details'>) {
  const { itemId, title } = route.params;
  return <Text>{title} — #{itemId}</Text>;
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "Always declare parameterless screens as `undefined` (not `{}`) in the param list. `undefined` means 'no second argument allowed', while `{}` means 'any non-null object is fine' and silently lets callers pass arbitrary data without a type error.",
            np: "params नभएको screen लाई `{}` होइन `undefined` राख्नुस् — TypeScript ले सही error दिन्छ।",
            jp: "パラメーターのない画面は `{}` でなく `undefined` を指定します。`{}` だと任意のオブジェクトが渡せてしまい型安全が失われます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Customizing Headers",
        np: "Header अनुकूलन",
        jp: "ヘッダーのカスタマイズ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The stack header is fully customizable through the `options` prop on `Stack.Screen` or globally via `screenOptions` on `Stack.Navigator`. Use **`headerStyle`** for background colour, **`headerTintColor`** for the back-button and title colour, and **`headerRight`** / **`headerLeft`** to insert custom React elements (icons, buttons) into the header bar.",
            np: "`options` मा `headerStyle`, `headerTintColor`, र `headerRight`/`headerLeft` राखेर header अनुकूलन गर्न सकिन्छ। `screenOptions` ले सबै screen मा एकैपटक लागू हुन्छ।",
            jp: "`options` の `headerStyle`・`headerTintColor`・`headerRight`/`headerLeft` でヘッダーを自由にカスタマイズできます。`screenOptions` でナビゲーター全体に一括適用できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Per-screen header customization",
            np: "प्रति-screen header अनुकूलन",
            jp: "画面ごとのヘッダーカスタマイズ",
          },
          code: `options={{
  headerStyle: { backgroundColor: '#6366f1' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
  headerRight: () => (
    <Pressable onPress={() => navigation.navigate('Settings')}>
      <Ionicons name="settings" size={24} color="#fff" />
    </Pressable>
  ),
}}`,
        },
        {
          type: "code",
          title: {
            en: "Applying header style globally via screenOptions",
            np: "screenOptions मार्फत सबै screen मा header लागू गर्नुस्",
            jp: "screenOptions でナビゲーター全体に適用",
          },
          code: `<Stack.Navigator
  screenOptions={{
    headerStyle: { backgroundColor: '#6366f1' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
  }}
>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Details" component={DetailsScreen} />
</Stack.Navigator>`,
        },
        {
          type: "paragraph",
          text: {
            en: "Per-screen `options` **override** the `screenOptions` defaults, so you can set a global brand style on the navigator and only override individual screens that need a different appearance — for example a transparent header on a media-heavy hero screen.",
            np: "Per-screen `options` ले `screenOptions` लाई override गर्छ। global style राखेर specific screen मा मात्र बदल्न सकिन्छ।",
            jp: "画面ごとの `options` は `screenOptions` のデフォルトを上書きします。ブランドカラーをグローバルに設定し、特定画面だけ変えることができます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Creating a TabNavigator and Customizing Tabs",
        np: "TabNavigator बनाउने र Tab अनुकूलन गर्ने",
        jp: "TabNavigator の作成とタブのカスタマイズ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`createBottomTabNavigator`** renders a persistent bottom bar with a tab per screen. The `screenOptions` callback receives `{ route }` so you can derive the icon name from the route name instead of repeating yourself per screen. Use `tabBarActiveTintColor` / `tabBarInactiveTintColor` for colour theming, and `tabBarBadge` for notification counts.",
            np: "`createBottomTabNavigator` ले persistent tab bar बनाउँछ। `screenOptions` मा route name बाट icon छान्न सकिन्छ। Badge र रंग पनि सजिलै राख्न सकिन्छ।",
            jp: "`createBottomTabNavigator` で永続的な下部タブバーを作成します。`screenOptions` コールバックで route 名からアイコンを導出できます。バッジやカラーテーマも簡単に設定できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Bottom tab navigator with icons and active colour",
            np: "आइकन र सक्रिय रंग सहितको Bottom Tab",
            jp: "アイコンとアクティブカラー付きボトムタブ",
          },
          code: `import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, string> = {
            Feed: 'home',
            Messages: 'chatbubbles',
            Account: 'person',
          };
          return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
      })}
    >
      <Tab.Screen name="Feed" component={FeedNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Account" component={AccountNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "Screens that contain their own **Stack navigator** (like `FeedNavigator`) should have `headerShown: false` on their `Tab.Screen` so the Tab bar doesn't render a second header above the stack's own header. Screens without a nested stack (like `MessagesScreen`) can let the tab navigator render their header directly.",
            np: "आफ्नै Stack भएका screen मा `headerShown: false` राख्नुस् — अन्यथा दोहोरो header देखिन्छ।",
            jp: "Stack ナビゲーターを内包するタブには `headerShown: false` を設定し、二重ヘッダーを防ぎます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Navigation Theme",
        np: "Navigation Theme",
        jp: "Navigation テーマ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React Navigation ships a **`DefaultTheme`** (light) and a **`DarkTheme`**. You can spread either and override specific colour tokens to match your brand. Pass the theme object to `NavigationContainer`'s `theme` prop and every navigator automatically inherits the background, card, text, and primary colours — no per-screen configuration needed.",
            np: "React Navigation मा `DefaultTheme` र `DarkTheme` छन्। spread गरी brand colour override गर्नुस्। `NavigationContainer` को `theme` prop मा दिँदा सबै navigator ले आफैँ पाउँछन्।",
            jp: "React Navigation には `DefaultTheme`（ライト）と `DarkTheme` が付属しています。スプレッドしてブランドカラーを上書きし、`NavigationContainer` の `theme` prop に渡すと全ナビゲーターが自動で継承します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Custom NavigationTheme applied to the container",
            np: "Custom Theme NavigationContainer मा लागू गर्ने",
            jp: "カスタムテーマをコンテナに適用する",
          },
          code: `import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6366f1',
    background: '#f8fafc',
    card: '#ffffff',
    text: '#1e293b',
  },
};

// Usage:
<NavigationContainer theme={AppTheme}>
  <RootNavigator />
</NavigationContainer>`,
        },
        {
          type: "paragraph",
          text: {
            en: "The **`primary`** colour token is used for active tab icons and the focused state in bottom tabs. **`background`** is the screen background, **`card`** is the header and tab bar background, and **`text`** is the default header title colour. Override only what you need — the rest falls back to the `DefaultTheme` values via the spread.",
            np: "`primary` — active tab icon; `background` — screen; `card` — header/tab bar; `text` — header title। मात्र आवश्यक token override गर्नुस्।",
            jp: "`primary` はアクティブタブアイコン、`background` は画面背景、`card` はヘッダー・タブバー背景、`text` はタイトル色です。必要なトークンだけ上書きすれば十分です。",
          },
        },
      ],
    },
    {
      title: {
        en: "Building AuthNavigator, AppNavigator and FeedNavigator",
        np: "AuthNavigator, AppNavigator र FeedNavigator बनाउने",
        jp: "AuthNavigator・AppNavigator・FeedNavigator の構築",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The navigator files you build during the course form a clear hierarchy: **`RootNavigator`** chooses between `AuthNavigator` (unauthenticated) and `AppNavigator` (authenticated). `AppNavigator` is a Tab navigator whose tabs embed their own Stack navigators — `FeedNavigator` and `AccountNavigator`. This structure gives each feature area an isolated navigation history and makes adding new screens straightforward.",
            np: "कोर्समा बन्ने navigator hierarchy: `RootNavigator` → Auth वा App (Tab) → प्रत्येक tab को आफ्नै Stack। यसले प्रत्येक feature area को navigation history छुट्टाउँछ।",
            jp: "コースで構築するナビゲーター階層：`RootNavigator` が Auth と App（タブ）を切り替え、各タブが独自のスタックを持ちます。機能エリアごとに履歴が分離されます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Full navigator structure — Auth, Feed, Account, Root",
            np: "पूर्ण navigator संरचना",
            jp: "ナビゲーター全体構造",
          },
          code: `// AuthNavigator.tsx — for unauthenticated users
function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// FeedNavigator.tsx — nested in AppTabs
function FeedNavigator() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen name="Listings" component={ListingsScreen} />
      <FeedStack.Screen name="ListingDetail" component={ListingDetailScreen} />
      <FeedStack.Screen name="ListingEdit" component={ListingEditScreen} />
    </FeedStack.Navigator>
  );
}

// AccountNavigator.tsx
function AccountNavigator() {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen name="Account" component={AccountScreen} />
      <AccountStack.Screen name="Messages" component={MessagesScreen} />
    </AccountStack.Navigator>
  );
}

// RootNavigator.tsx — switches between Auth and App based on user
function RootNavigator() {
  const { user } = useAuth();
  return user ? <AppNavigator /> : <AuthNavigator />;
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "When `user` changes (login / logout), React re-renders `RootNavigator` and swaps the entire navigator tree. Because the navigator switch happens at the root, the stack history is automatically cleared — the user can never press Back into the login screens after authenticating.",
            np: "`user` बदलिँदा React ले पूरै navigator tree swap गर्छ। यसले login screen को stack history आफैँ सफा हुन्छ — authenticate पछि Back थिचेर login screen आउँदैन।",
            jp: "`user` が変わると React がナビゲーターツリー全体を入れ替えます。スタック履歴が自動的にクリアされ、ログイン後に Back でログイン画面に戻ることはありません。",
          },
        },
      ],
    },
    {
      title: {
        en: "Refactoring Routes — Centralized Route Names",
        np: "Routes refactoring — केन्द्रीकृत Route नाम",
        jp: "ルートのリファクタリング — 定数集約",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Hardcoding screen names as string literals across files is the leading cause of silent navigation bugs — a typo in one file causes a runtime crash or a no-op navigate with no compile-time warning. Centralise all route names in a **`routes.ts`** constants file and import from it everywhere. Now a rename is a single-file change, and TypeScript's `as const` ensures the values are narrow literal types rather than `string`.",
            np: "Screen नाम string literal रूपमा छरिँदा typo बाट runtime crash हुन सक्छ। `routes.ts` मा सबै नाम केन्द्रीकृत गरी import गर्नुस् — rename एकै ठाउँमा।",
            jp: "文字列リテラルを各ファイルにハードコードすると、タイポがランタイムクラッシュを招きます。`routes.ts` に定数を集約し、`as const` で型を絞り込むことで rename が一箇所で済みます。",
          },
        },
        {
          type: "code",
          title: {
            en: "routes.ts — centralized constants and refactor-safe usage",
            np: "routes.ts — केन्द्रीकृत constants र refactor-safe प्रयोग",
            jp: "routes.ts — 定数集約とリファクタリング安全な使用例",
          },
          code: `// navigation/routes.ts
export const ROUTES = {
  LISTINGS: 'Listings',
  LISTING_DETAIL: 'ListingDetail',
  LISTING_EDIT: 'ListingEdit',
  LOGIN: 'Login',
  REGISTER: 'Register',
  ACCOUNT: 'Account',
  MESSAGES: 'Messages',
} as const;

// Usage — refactor-safe
navigation.navigate(ROUTES.LISTING_DETAIL, { id });`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`as const`** makes each value a string literal type (e.g. `'Listings'`) rather than `string`. This lets TypeScript cross-reference the constant with your param list types and catch mismatches.",
              np: "`as const` ले प्रत्येक value लाई literal type बनाउँछ, `string` होइन। यसले TypeScript ले param list सँग मिलाएर error देखाउँछ।",
              jp: "`as const` で各値が `string` でなくリテラル型（例：`'Listings'`）になります。TypeScript がパラムリストと照合してミスマッチを検出します。",
            },
            {
              en: "Keep `ROUTES` in one file and import it into navigators, screens, and tests. When a screen is renamed, update only `routes.ts` — TypeScript will flag every usage site that needs updating.",
              np: "`ROUTES` एकै फाइलमा राखी navigator, screen, र test मा import गर्नुस्। rename गर्दा TypeScript ले प्रयोग भएका सबै ठाउँ देखाउँछ।",
              jp: "`ROUTES` を一ファイルにまとめてナビゲーター・画面・テストでインポートします。リネーム時は TypeScript がすべての使用箇所を指摘します。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why does `useNavigation` throw 'Couldn't find a navigation object'?",
        np: "navigation object भेटिएन त्रुटि?",
        jp: "「navigation object が見つからない」エラーが出る？",
      },
      answer: {
        en: "This error means the component calling `useNavigation` is **rendered outside a `NavigationContainer`**. Common causes: (1) the component renders at the root before the container mounts; (2) a modal, toast, or standalone component used in a context (e.g. a notification handler) that has no navigator ancestor. Fix: ensure `NavigationContainer` is the outermost shell in `App.tsx`, or pass `navigation` as a prop to components that must live outside the tree.",
        np: "NavigationContainer बाहिर useNavigation बोलाइयो।",
        jp: "コンポーネントが **`NavigationContainer`** の外にあります。`App.tsx` で全ツリーをラップしているか確認してください。",
      },
    },
    {
      question: {
        en: "How do I navigate from outside a React component — for example from a push notification handler?",
        np: "घटक बाहिरबाट navigate कसरी?",
        jp: "React コンポーネント外から navigate する方法は？",
      },
      answer: {
        en: "Create a **navigation ref** with `createNavigationContainerRef<RootParamList>()`, assign it to `NavigationContainer`'s `ref` prop, and export it. You can then call `navigationRef.navigate('Screen', params)` from anywhere — notification handlers, background task callbacks, or analytics middleware. Always check `navigationRef.isReady()` first to guard against calls that happen before the navigator finishes mounting.",
        np: "navigationRef बनाउनुस् र NavigationContainer मा ref दिनुस्।",
        jp: "`createNavigationContainerRef` で ref を作り `NavigationContainer` に渡します。`isReady()` を確認してから `navigate` を呼びます。",
      },
    },
    {
      question: {
        en: "My nested navigator shows a double header — how do I remove it?",
        np: "दोहोरो हेडर कसरी हटाउने?",
        jp: "ネストしたナビゲーターでヘッダーが二重になる？",
      },
      answer: {
        en: "When a Stack navigator is nested inside a Tab screen, both the Tab and the Stack can render their own header bar. Suppress the outer one by adding `screenOptions={{ headerShown: false }}` to the `Tab.Navigator` (or to the specific `Tab.Screen` that wraps the Stack), and let the inner Stack manage its header. This is the standard pattern and is shown in the official React Navigation docs as well.",
        np: "Tab.Navigator मा `headerShown: false` राख्नुस्।",
        jp: "外側の `Tab.Navigator` に `screenOptions={{ headerShown: false }}` を設定し、ヘッダーは内側の Stack に任せます。",
      },
    },
    {
      question: {
        en: "What is the difference between `navigate` and `push`?",
        np: "`navigate` र `push` फरक?",
        jp: "`navigate` と `push` の違いは？",
      },
      answer: {
        en: "`navigate('Screen', params)` checks if that screen **already exists in the stack**. If it does, React Navigation jumps to that instance and merges the new params. `push('Screen', params)` **always adds a new stack entry** regardless. Use `navigate` for most links to avoid duplicate screens. Use `push` when you intentionally want multiple instances of the same screen — for example, a file browser that opens a folder inside itself.",
        np: "`navigate` — भेटे त्यही; `push` — सधैँ नयाँ।",
        jp: "`navigate` は既存インスタンスを再利用し、`push` は常に新規追加します。ドリルダウンには `push` が適切です。",
      },
    },
    {
      question: {
        en: "How do I type a screen that receives no params?",
        np: "params नभएको स्क्रिन कसरी टाइप गर्ने?",
        jp: "パラメーターのない画面はどう型付けしますか？",
      },
      answer: {
        en: "Set the screen's entry to **`undefined`** in the param list: `type MyStack = { Home: undefined; Detail: { id: string } }`. This tells TypeScript that `navigate('Home')` with no second argument is valid, while `navigate('Detail')` without an `id` is a compile error. Never use `{}` for parameterless screens — `{}` is treated as 'any non-null object' in TypeScript and silently allows incorrect usage.",
        np: "params नभएकोमा `undefined` राख्नुस्, `{}` नगर्नुस्।",
        jp: "パラメーターなしの画面は `undefined` を指定します。`{}` は TypeScript が「任意のオブジェクト」と解釈するため型安全が失われます。",
      },
    },
    {
      question: {
        en: "When do I need background location vs. foreground-only permission?",
        np: "background location कहिले चाहिन्छ?",
        jp: "バックグラウンド位置情報が必要なのはいつですか？",
      },
      answer: {
        en: "**Foreground permission** (`requestForegroundPermissionsAsync`) allows GPS reads only while the app is on screen. **Background permission** (`requestBackgroundPermissionsAsync`) enables continuous tracking when the app is minimized or the screen is off — necessary for delivery tracking, fitness logging, or geofencing. Background location requires additional `app.json` config, extra iOS plist keys (`NSLocationAlwaysUsageDescription`), and is subject to strict App Store / Play Store review guidelines. Only request it when the use case genuinely demands it.",
        np: "डेलिभरी/फिटनेस ट्র্যাকিङमा background अनुमति चाहिन्छ।",
        jp: "配送追跡・フィットネス・ジオフェンスなどでバックグラウンド位置が必要です。審査が厳しいので本当に必要な場合のみ申請しましょう。",
      },
    },
  ],
};
