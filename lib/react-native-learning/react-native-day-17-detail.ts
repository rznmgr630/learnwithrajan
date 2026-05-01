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
