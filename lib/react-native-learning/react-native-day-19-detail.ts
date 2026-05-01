import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 19 — Offline cache: AsyncStorage strategies & auth persistence. */
export const REACT_NATIVE_DAY_19_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 19 covers two tightly linked topics: **offline data caching** with AsyncStorage and the **stale-while-revalidate** pattern, and **auth persistence** — safely storing JWTs, comparing **AsyncStorage vs expo-secure-store**, implementing automatic **token refresh interceptors**, and cleaning up all keys on logout.",
      np: "AsyncStorage क्यासिङ, JWT भण्डारण, SecureStore, टोकन रिफ्रेस, logout सफाइ।",
      jp: "Day 19 では AsyncStorage を使ったオフラインキャッシュと **stale-while-revalidate**、JWT の安全な保存、**トークン自動更新インターセプター**、ログアウト時の完全クリーンアップを学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "AsyncStorage Fundamentals",
        np: "AsyncStorage आधार",
        jp: "AsyncStorage の基本",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`@react-native-async-storage/async-storage`** provides a simple key-value store backed by the device filesystem. All operations are **async and return Promises**. The five methods you will use most are `getItem`, `setItem`, `removeItem`, `multiGet`, and `multiRemove`.",
            np: "@react-native-async-storage/async-storage ले किफाँस्छ-मान भण्डारण दिन्छ।",
            jp: "`@react-native-async-storage/async-storage` はデバイスファイルシステムを使ったキー・バリューストアです。",
          },
        },
        {
          type: "code",
          title: {
            en: "AsyncStorage — getItem / setItem / removeItem / multiGet",
            np: "मुख्य विधिहरू",
            jp: "主要メソッドの使い方",
          },
          code: `import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Write ---
await AsyncStorage.setItem('feed:v2', JSON.stringify(listings));

// --- Read ---
const raw = await AsyncStorage.getItem('feed:v2');
const listings = raw ? (JSON.parse(raw) as Listing[]) : null;

// --- Delete one ---
await AsyncStorage.removeItem('feed:v2');

// --- Batch read ---
const pairs = await AsyncStorage.multiGet(['feed:v2', 'profile:v1']);
// pairs is [['feed:v2', '...json...'], ['profile:v1', '...json...']]
const [feedRaw, profileRaw] = pairs.map(([, v]) => v);

// --- Batch delete (logout use-case) ---
await AsyncStorage.multiRemove(['feed:v2', 'profile:v1', 'auth:token']);`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Always version your keys** (e.g. `feed:v2`) so cached data from an old schema does not corrupt a new release. Bump the version suffix when you change the shape of stored objects.",
              np: "कुञ्जीमा संस्करण राख्नुस् जस्तै feed:v2।",
              jp: "`feed:v2` のようにバージョンをキーに含めると**スキーマ変更**時の破損を防げます。",
            },
            {
              en: "**JSON serialisation pitfalls**: `JSON.stringify` drops `undefined` values and converts `Date` objects to ISO strings — you must re-hydrate dates manually with `new Date(raw.createdAt)` after parsing.",
              np: "JSON मा undefined हराउँछ, Date स्ट्रिङ हुन्छ — पुन-हाइड्रेट गर्नुस्।",
              jp: "`undefined` は消え、`Date` は文字列になります。パース後に **`new Date()`** で再変換しましょう。",
            },
            {
              en: "**AsyncStorage is limited to ~6 MB per app on Android** (varies by vendor). Use it for lightweight metadata; store large binary blobs in `expo-file-system`.",
              np: "Android मा ~6 MB सीमा छ। ठूला फाइल expo-file-system मा राख्नुस्।",
              jp: "Android では容量制限（約 6 MB）があります。大きなバイナリは **expo-file-system** へ。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Cache Layer Pattern — Stale-While-Revalidate",
        np: "क्यास तह — Stale-While-Revalidate",
        jp: "キャッシュ層パターン — Stale-While-Revalidate",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The **stale-while-revalidate** strategy shows the last-good cached data immediately (fast, no flash of empty state) while simultaneously fetching fresh data in the background. When fresh data arrives it replaces the stale data in both state and storage. This makes the app feel **instant even on slow connections**.",
            np: "पुरानो क्यास तुरुन्त देखाउनुस्, पछाडि नयाँ डेटा ल्याउनुस्।",
            jp: "古いキャッシュをすぐに表示し、バックグラウンドで新鮮なデータを取得。**遅い回線でもレスポンスが速く**感じられます。",
          },
        },
        {
          type: "code",
          title: {
            en: "useCachedFetch — stale-while-revalidate hook",
            np: "useCachedFetch हुक",
            jp: "useCachedFetch フック（stale-while-revalidate）",
          },
          code: `import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useCachedFetch<T>(
  cacheKey: string,
  fetchFn: () => Promise<T | null>,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1️⃣ Show stale cache immediately
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached && !cancelled) {
        setData(JSON.parse(cached) as T);
        setLoading(false);
      }

      // 2️⃣ Fetch fresh data in the background
      try {
        const fresh = await fetchFn();
        if (fresh && !cancelled) {
          setData(fresh);
          await AsyncStorage.setItem(cacheKey, JSON.stringify(fresh));
        }
      } catch {
        if (!cancelled) setError('Failed to refresh data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [cacheKey, fetchFn]);

  return { data, loading, error };
}`,
        },
        {
          type: "diagram",
          id: "react-native-data-offline-online",
        },
      ],
    },
    {
      title: {
        en: "Auth Persistence — AsyncStorage vs expo-secure-store",
        np: "JWT भण्डारण — AsyncStorage बनाम SecureStore",
        jp: "認証永続化 — AsyncStorage vs expo-secure-store",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Where you store a JWT determines the **security posture** of your app. **AsyncStorage** is plain-text on the device filesystem — readable by anyone with physical access or a jailbroken device. **`expo-secure-store`** uses the OS-level **Keychain (iOS)** and **EncryptedSharedPreferences / Android Keystore (Android)** backed by hardware encryption. The tradeoff is a slightly larger API surface and native dependency.",
            np: "AsyncStorage सादा पाठ हो; SecureStore हार्डवेयर एन्क्रिप्सन प्रयोग गर्छ।",
            jp: "AsyncStorage はプレーンテキスト保存、**expo-secure-store** は iOS Keychain / Android Keystore でハードウェア暗号化されます。",
          },
        },
        {
          type: "table",
          caption: {
            en: "JWT storage options — security tradeoffs",
            np: "सुरक्षा ट्रेडअफ तालिका",
            jp: "JWT 保存方法のセキュリティトレードオフ",
          },
          headers: [
            { en: "Storage", np: "भण्डारण", jp: "保存方法" },
            { en: "Encryption", np: "एन्क्रिप्सन", jp: "暗号化" },
            { en: "Use case", np: "प्रयोग", jp: "ユースケース" },
          ],
          rows: [
            [
              { en: "AsyncStorage", np: "AsyncStorage", jp: "AsyncStorage" },
              { en: "None (plain text on disk)", np: "छैन", jp: "なし（プレーンテキスト）" },
              { en: "Non-sensitive data only — feeds, UI preferences", np: "गैर-संवेदनशील", jp: "フィードや UI 設定など非機密データ" },
            ],
            [
              { en: "expo-secure-store", np: "SecureStore", jp: "expo-secure-store" },
              { en: "OS keychain / hardware-backed", np: "हार्डवेयर", jp: "OS キーチェーン / ハードウェア" },
              { en: "Refresh tokens, auth session data", np: "रिफ्रेस टोकन", jp: "リフレッシュトークン・認証セッション" },
            ],
            [
              { en: "react-native-keychain", np: "Keychain", jp: "react-native-keychain" },
              { en: "OS keychain / hardware-backed", np: "हार्डवेयर", jp: "OS キーチェーン / ハードウェア" },
              { en: "Biometric-gated credentials, passwords", np: "बायोमेट्रिक", jp: "生体認証が必要なクレデンシャル" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "expo-secure-store — token save / load / delete",
            np: "SecureStore कोड",
            jp: "expo-secure-store の使い方",
          },
          code: `import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth.refreshToken';

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function loadToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// Access tokens (short-lived, < 15 min) can live in memory-only React state
// Refresh tokens (long-lived) belong in SecureStore`,
        },
      ],
    },
    {
      title: {
        en: "Automatic Token Refresh & Logout Cleanup",
        np: "स्वत: टोकन रिफ्रेस र logout सफाइ",
        jp: "トークン自動更新とログアウトクリーンアップ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Register an **ApiSauce `addResponseTransform`** (or axios response interceptor) that detects a **401** response, calls the refresh endpoint once, updates the stored token, and **retries the original request**. A flag (`isRefreshing`) prevents multiple concurrent refresh calls queuing up — other requests wait and replay once the new token arrives.",
            np: "addResponseTransform मा 401 पत्ता लगाउनुस्, एकचोटि रिफ्रेस गर्नुस्, अनुरोध पुनः पठाउनुस्।",
            jp: "`addResponseTransform` で 401 を検出し、一度だけリフレッシュして元のリクエストをリプレイします。",
          },
        },
        {
          type: "code",
          title: {
            en: "Token refresh interceptor + logout with multiRemove",
            np: "टोकन रिफ्रेस इन्टरसेप्टर",
            jp: "トークン更新インターセプター＋ログアウト",
          },
          code: `import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from './apiClient';

let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

apiClient.addAsyncResponseTransform(async (response) => {
  if (response.status !== 401) return;
  if (isRefreshing) {
    // Queue this request until refresh resolves
    await new Promise<void>((resolve) => {
      pendingQueue.push((newToken) => {
        response.config!.headers['Authorization'] = \`Bearer \${newToken}\`;
        resolve();
      });
    });
    return;
  }

  isRefreshing = true;
  try {
    const refreshToken = await SecureStore.getItemAsync('auth.refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const refreshRes = await apiClient.post<{ accessToken: string }>(
      '/auth/refresh',
      { refreshToken },
    );

    if (!refreshRes.ok || !refreshRes.data) throw new Error('Refresh failed');

    const newToken = refreshRes.data.accessToken;
    // Access token lives in memory (or AsyncStorage for demo)
    await AsyncStorage.setItem('auth.accessToken', newToken);

    // Replay queued requests with new token
    pendingQueue.forEach((cb) => cb(newToken));
    pendingQueue = [];

    // Retry original request with new token
    response.config!.headers['Authorization'] = \`Bearer \${newToken}\`;
  } catch {
    // Refresh failed — force logout
    await logout();
  } finally {
    isRefreshing = false;
  }
});

// Logout: wipe all storage keys atomically
export async function logout() {
  await AsyncStorage.multiRemove([
    'auth.accessToken',
    'feed:v2',
    'profile:v1',
  ]);
  await SecureStore.deleteItemAsync('auth.refreshToken');
  // Navigate to Login screen via your navigation ref
  navigationRef.current?.reset({ index: 0, routes: [{ name: 'Login' }] });
}`,
        },
      ],
    },
    // ── Offline Support ──────────────────────────────────────────────────────
    {
      title: {
        en: "Detecting Network Status with NetInfo",
        np: "NetInfo सँग नेटवर्क स्थिति पत्ता लगाउने",
        jp: "NetInfo でネットワーク状態を検出する",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`@react-native-community/netinfo`** exposes both a reactive hook (`useNetInfo`) and a one-shot promise (`NetInfo.fetch()`) to check connectivity. Install it with `npx expo install @react-native-community/netinfo`. The hook re-renders your component whenever the network state changes, making it ideal for showing offline banners. The `isInternetReachable` field is more reliable than `isConnected` because it performs an actual HTTP probe, not just checks whether a network adapter is active.",
            np: "@react-native-community/netinfo नेटवर्क स्थिति ट्र्याक गर्छ। `useNetInfo` हुक प्रतिक्रियाशील छ; `NetInfo.fetch()` एक पटकको जाँच हो।",
            jp: "`@react-native-community/netinfo` はリアクティブフック（`useNetInfo`）と一度だけのプロミス（`NetInfo.fetch()`）でネットワーク状態を取得します。`isInternetReachable` は HTTP プローブを行うため `isConnected` より信頼性が高いです。",
          },
        },
        {
          type: "code",
          title: {
            en: "useNetwork hook + one-shot checkConnection()",
            np: "useNetwork हुक र checkConnection()",
            jp: "useNetwork フック + 一度だけの checkConnection()",
          },
          code: `import NetInfo, { useNetInfo } from '@react-native-community/netinfo';

// Hook approach (reactive) — re-renders on every network change
export function useNetwork() {
  const netInfo = useNetInfo();
  return {
    isConnected: netInfo.isConnected ?? true,
    isInternetReachable: netInfo.isInternetReachable ?? true,
    type: netInfo.type, // 'wifi' | 'cellular' | 'none' | ...
  };
}

// One-shot check — useful before performing a sync operation
export async function checkConnection(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true && state.isInternetReachable === true;
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`isInternetReachable` does an **actual HTTP request check**, not just a network-adapter status check. On Android it pings a Google endpoint; on iOS it uses Apple's captive-portal detection. Always prefer it over `isConnected` when you need to confirm real internet access.",
              np: "`isInternetReachable` ले HTTP अनुरोध गरेर जाँच गर्छ — नेटवर्क एडाप्टर मात्र नभई वास्तविक इन्टरनेट।",
              jp: "`isInternetReachable` は実際に HTTP リクエストを送るため、ネットワークアダプターが有効でもインターネット不通の場合を検出できます。",
            },
            {
              en: "Default `isConnected ?? true` and `isInternetReachable ?? true` — `null` is returned during the brief initialisation window before the first network event fires. Defaulting to `true` avoids falsely showing the offline banner on startup.",
              np: "null को मतलब अझै जाँच भएको छैन — `?? true` राख्दा स्टार्टअपमा गलत offline banner देखिँदैन।",
              jp: "`null` は初期化中を意味します。`?? true` とデフォルト設定することで起動直後の誤ったオフラインバナー表示を防げます。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Caching Images with expo-file-system",
        np: "expo-file-system सँग Images क्यास गर्ने",
        jp: "expo-file-system で画像をキャッシュする",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**AsyncStorage cannot store binary data** — it only accepts strings. Remote images must be downloaded to the device filesystem using **`expo-file-system`** and served from a local path on subsequent loads. `FileSystem.cacheDirectory` is ideal: the OS may clear it under low-storage pressure, so you never need to implement manual eviction. The pattern is: hash or sanitise the URL into a filename → check if it exists locally → if yes, return the local path; if no, download and cache it.",
            np: "AsyncStorage बाइनरी डेटा राख्न सक्दैन। `expo-file-system` ले Images डाउनलोड गरी cacheDirectory मा राख्छ।",
            jp: "AsyncStorage はバイナリを保存できません。`expo-file-system` を使ってリモート画像をデバイスにダウンロードし、ローカルパスから提供します。",
          },
        },
        {
          type: "code",
          title: {
            en: "getCachedImage() utility + CachedImage component",
            np: "getCachedImage() + CachedImage कम्पोनेन्ट",
            jp: "getCachedImage() ユーティリティ + CachedImage コンポーネント",
          },
          code: `import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Image, ImageProps } from 'react-native';

const IMAGE_CACHE_DIR = \`\${FileSystem.cacheDirectory}images/\`;

async function ensureCacheDir() {
  const info = await FileSystem.getInfoAsync(IMAGE_CACHE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(IMAGE_CACHE_DIR, { intermediates: true });
  }
}

export async function getCachedImage(uri: string): Promise<string> {
  await ensureCacheDir();
  // Sanitise URI into a safe filename (strip query params)
  const filename = uri.split('/').pop()?.split('?')[0] ?? 'img';
  const localPath = \`\${IMAGE_CACHE_DIR}\${filename}\`;

  const info = await FileSystem.getInfoAsync(localPath);
  if (info.exists) return localPath; // serve from cache — no network needed

  const downloaded = await FileSystem.downloadAsync(uri, localPath);
  return downloaded.uri;
}

// Drop-in replacement for <Image> that caches on first load
export function CachedImage({ source, ...props }: ImageProps & { source: { uri: string } }) {
  const [localUri, setLocalUri] = useState<string | null>(null);

  useEffect(() => {
    getCachedImage(source.uri).then(setLocalUri).catch(() => setLocalUri(source.uri));
  }, [source.uri]);

  if (!localUri) return null;
  return <Image source={{ uri: localUri }} {...props} />;
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`FileSystem.cacheDirectory`** is managed by the OS — the system can evict files when storage is low, so you never accumulate unbounded disk usage. For images that must never be evicted (e.g. user-uploaded profile photos), use `FileSystem.documentDirectory` instead.",
              np: "`cacheDirectory` OS ले स्वचालित रूपमा खाली गर्न सक्छ। कहिल्यै नमेटिने फाइलका लागि `documentDirectory` प्रयोग गर्नुस्।",
              jp: "`cacheDirectory` は OS が空き容量不足時に自動削除します。削除されたくないファイルには `documentDirectory` を使いましょう。",
            },
            {
              en: "For production apps with many images, consider **content-hashing the URL** (e.g. using a simple djb2 hash) to create the filename instead of relying on the URL's last path segment, which can collide across different domains.",
              np: "URL को अन्तिम भाग मात्र फाइलनाम बनाउँदा collision हुन सक्छ — content hash राम्रो हुन्छ।",
              jp: "URL の末尾パスをそのままファイル名にすると衝突が起きることがあります。コンテンツハッシュを使うと安全です。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Storing User Actions When Offline (Action Queue)",
        np: "Offline हुँदा User Actions Queue मा राख्ने",
        jp: "オフライン時のユーザーアクションをキューに保存する",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When the device is offline, **queue user mutations locally** using AsyncStorage rather than silently dropping them. When connectivity is restored, **replay the queue** against the API. Keep failed actions in the queue so they can be retried later. This pattern enables **optimistic UI** — the app looks responsive even with no internet, and data syncs automatically once reconnected.",
            np: "Offline हुँदा mutations AsyncStorage मा queue गर्नुस् र connectivity फर्केपछि replay गर्नुस्।",
            jp: "オフライン時のミューテーションを AsyncStorage にキューイングし、接続回復後に API へリプレイします。",
          },
        },
        {
          type: "code",
          title: {
            en: "Action queue — enqueue / replay",
            np: "Action queue — enqueue र replay",
            jp: "アクションキュー — エンキュー / リプレイ",
          },
          code: `import AsyncStorage from '@react-native-async-storage/async-storage';

interface QueuedAction {
  id: string;
  type: string;
  payload: unknown;
  timestamp: number;
}

const QUEUE_KEY = 'offline:actionQueue:v1';

export async function enqueueAction(
  action: Omit<QueuedAction, 'id' | 'timestamp'>,
) {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  const queue: QueuedAction[] = raw ? JSON.parse(raw) : [];
  queue.push({ ...action, id: Date.now().toString(), timestamp: Date.now() });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function replayQueue(apiClient: { post: Function }) {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  if (!raw) return;

  const queue: QueuedAction[] = JSON.parse(raw);
  const remaining: QueuedAction[] = [];

  for (const action of queue) {
    try {
      const res = await apiClient.post(\`/\${action.type}\`, action.payload);
      if (!res.ok) remaining.push(action); // keep failed ones for retry
    } catch {
      remaining.push(action); // network error — keep for next attempt
    }
  }

  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
}

// Usage: call replayQueue when connectivity is restored
// NetInfo.addEventListener(state => {
//   if (state.isConnected && state.isInternetReachable) replayQueue(apiClient);
// });`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Idempotency is critical** — if the same action is replayed twice (e.g. due to a network timeout where the server received the first request but the response was lost), the server must not create a duplicate. Include a **client-generated `id`** in the payload and deduplicate on the server.",
              np: "एउटै action दुई पटक replay भयो भने duplicate नहोस् — server मा idempotent key जाँच्नुस्।",
              jp: "同じアクションが二度リプレイされないよう、サーバー側でクライアント生成 **`id`** を使って重複チェックを行いましょう。",
            },
            {
              en: "**Version the queue key** (`offline:actionQueue:v1`) — if you change the shape of `QueuedAction`, bump the version to avoid parsing old incompatible entries on app upgrade.",
              np: "queue key मा version राख्नुस् ताकि app upgrade पछि पुरानो data parse हुँदा error नआओस्।",
              jp: "`QueuedAction` の型を変えたらキーのバージョンを上げて、古いエントリーとの型不一致を防ぎましょう。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Showing an Offline Notice",
        np: "Offline Notice Banner देखाउने",
        jp: "オフライン通知バナーを表示する",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Mount a persistent **offline banner** at the top-level layout (inside `NavigationContainer`) so every screen automatically shows it when the device loses internet. Use `Animated.timing` for a smooth fade-in/fade-out transition. The banner reads network state from `useNetInfo` and animates its opacity — no routing or prop-drilling required.",
            np: "NavigationContainer भित्र offline banner राख्नुस्। useNetInfo बाट स्वत: देखिन्छ/हराउँछ।",
            jp: "`NavigationContainer` の内側にバナーをマウントすると全画面で自動表示されます。`Animated.timing` でスムーズにフェードイン/アウトします。",
          },
        },
        {
          type: "code",
          title: {
            en: "OfflineNotice — animated banner component",
            np: "OfflineNotice कम्पोनेन्ट",
            jp: "OfflineNotice アニメーションバナーコンポーネント",
          },
          code: `import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

export function OfflineNotice() {
  const { isConnected } = useNetInfo();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isConnected === false ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isConnected]);

  return (
    <Animated.View style={[styles.banner, { opacity }]} pointerEvents="none">
      <Text style={styles.text}>No Internet Connection</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#dc2626',
    paddingVertical: 8,
    alignItems: 'center',
  },
  text: { color: '#fff', fontWeight: '600' },
});

// Mount inside NavigationContainer in your root layout:
// <NavigationContainer>
//   <OfflineNotice />
//   <RootNavigator />
// </NavigationContainer>`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Set `pointerEvents=\"none\"` on the banner so it never blocks taps on the underlying screen — it is purely informational and must not interfere with navigation.",
              np: "`pointerEvents=\"none\"` राख्नुस् ताकि banner ले tap block नगरोस्।",
              jp: "`pointerEvents=\"none\"` を設定するとバナーが下の画面のタップをブロックしません。",
            },
            {
              en: "Because `isConnected` starts as `null` (not `false`), `isConnected === false` (strict equality) correctly avoids showing the banner during the initialisation window.",
              np: "शुरुमा `isConnected` null हुन्छ — `=== false` ले सुरुमा banner नदेखाउने सुनिश्चित गर्छ।",
              jp: "起動直後は `isConnected` が `null` です。`=== false` の厳密比較でバナーの誤表示を防ぎます。",
            },
          ],
        },
      ],
    },

    // ── Authentication and Authorization ─────────────────────────────────────
    {
      title: {
        en: "Authentication Providers",
        np: "Authentication Providers",
        jp: "認証プロバイダーの種類",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React Native apps can authenticate users through three broad categories: **custom auth** (your own backend issues JWTs), **OAuth providers** (Google, Apple — required for iOS App Store, Facebook) via `expo-auth-session`, and **Auth-as-a-Service** platforms (Auth0, Firebase Auth, Clerk, Supabase Auth) that abstract away tokens, sessions, refresh logic, and social logins behind a managed SDK. Choose based on control requirements, budget, and how much auth infrastructure you want to own.",
            np: "तीन प्रकार: Custom JWT, OAuth (Google/Apple), Auth-as-a-Service (Auth0, Firebase, Clerk)।",
            jp: "認証は「カスタム JWT」「OAuth プロバイダー」「Auth-as-a-Service（Auth0・Firebase・Clerk）」の 3 種類に大別されます。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Authentication provider comparison",
            np: "Authentication provider तुलना तालिका",
            jp: "認証プロバイダーの比較表",
          },
          headers: [
            { en: "Provider", np: "प्रदायक", jp: "プロバイダー" },
            { en: "Setup effort", np: "सेटअप प्रयास", jp: "セットアップ難易度" },
            { en: "Cost", np: "लागत", jp: "コスト" },
            { en: "Control", np: "नियन्त्रण", jp: "制御レベル" },
          ],
          rows: [
            [
              { en: "Custom JWT", np: "Custom JWT", jp: "カスタム JWT" },
              { en: "High", np: "उच्च", jp: "高" },
              { en: "Backend infrastructure cost", np: "Backend खर्च", jp: "バックエンドコスト" },
              { en: "Full", np: "पूर्ण", jp: "完全" },
            ],
            [
              { en: "Firebase Auth", np: "Firebase Auth", jp: "Firebase Auth" },
              { en: "Low", np: "कम", jp: "低" },
              { en: "Free tier available", np: "Free tier", jp: "無料枠あり" },
              { en: "Medium", np: "मध्यम", jp: "中" },
            ],
            [
              { en: "Auth0", np: "Auth0", jp: "Auth0" },
              { en: "Low", np: "कम", jp: "低" },
              { en: "Free tier (7 500 MAU)", np: "Free tier (7500 MAU)", jp: "無料枠（7,500 MAU）" },
              { en: "Medium", np: "मध्यम", jp: "中" },
            ],
            [
              { en: "Clerk", np: "Clerk", jp: "Clerk" },
              { en: "Very low", np: "धेरै कम", jp: "非常に低" },
              { en: "Free tier available", np: "Free tier", jp: "無料枠あり" },
              { en: "Low", np: "कम", jp: "低" },
            ],
          ],
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Apple Sign-In is mandatory** for any iOS app that offers third-party login (App Store Review Guideline 4.8). Use `expo-apple-authentication` or `expo-auth-session` with the Apple provider.",
              np: "iOS App Store मा third-party login भएमा Apple Sign-In अनिवार्य छ।",
              jp: "第三者ログインを提供する iOS アプリには **Apple Sign-In が必須**です（App Store ガイドライン 4.8）。",
            },
            {
              en: "**OAuth flows in Expo** use `expo-auth-session` with `WebBrowser.openAuthSessionAsync` to handle the redirect URI safely without ever exposing client secrets in the app bundle.",
              np: "Expo मा OAuth को लागि `expo-auth-session` र `WebBrowser.openAuthSessionAsync` प्रयोग गर्नुस्।",
              jp: "Expo の OAuth は `expo-auth-session` と `WebBrowser.openAuthSessionAsync` でクライアントシークレットを露出せず安全に処理します。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Authentication Flow — Full Diagram",
        np: "Authentication Flow — पूर्ण प्रवाह",
        jp: "認証フロー — 全体図",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Understanding the full auth lifecycle — from login through token storage to session restoration on app restart — prevents common bugs like infinite loading states, users being logged out on every restart, or race conditions between the navigator and the auth state. The key insight is: **navigation should derive from auth state**, not the other way around.",
            np: "Login देखि restart पछिको session पुनर्स्थापना सम्मको पूर्ण lifecycle बुझ्नु आवश्यक छ।",
            jp: "ログインからトークン保存、アプリ再起動後のセッション復元までの完全なライフサイクルを理解することで、無限ローディングや毎回ログアウトされるバグを防げます。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Step 1 — Login**: User submits credentials → App POSTs to `/auth/login` → Server returns `{ accessToken, refreshToken }`.",
              np: "Step 1: Credentials → POST /auth/login → { accessToken, refreshToken }",
              jp: "Step 1: ユーザーが認証情報を送信 → `/auth/login` に POST → `{ accessToken, refreshToken }` を受信",
            },
            {
              en: "**Step 2 — Token storage**: App decodes `accessToken` to get user object (display only). Stores `refreshToken` in SecureStore; holds `accessToken` in memory (React state).",
              np: "Step 2: accessToken decode गर्नुस्। refreshToken SecureStore मा, accessToken memory मा।",
              jp: "Step 2: `accessToken` をデコードしてユーザー情報を取得。`refreshToken` を SecureStore に、`accessToken` はメモリに保持。",
            },
            {
              en: "**Step 3 — Navigation**: `RootNavigator` switches between `<AuthNavigator>` and `<AppNavigator>` based on whether `user` is truthy.",
              np: "Step 3: user भए AppNavigator, नभए AuthNavigator देखाउनुस्।",
              jp: "Step 3: `user` の有無で `<AppNavigator>` と `<AuthNavigator>` を切り替え。",
            },
            {
              en: "**Step 4 — Restart restore**: On app launch, read `refreshToken` from SecureStore → POST to `/auth/refresh` → get new `accessToken` → decode user → set state → hide splash screen.",
              np: "Step 4: Restart मा SecureStore बाट refreshToken → /auth/refresh → नयाँ accessToken → user state।",
              jp: "Step 4: 起動時に SecureStore から `refreshToken` 取得 → `/auth/refresh` → 新しい `accessToken` → ユーザー復元 → スプラッシュ非表示。",
            },
            {
              en: "**Step 5 — Auto-refresh**: When any API call returns 401, the interceptor silently refreshes the `accessToken` and retries the original request without the user noticing.",
              np: "Step 5: 401 आयो भने interceptor ले चुपचाप token refresh गर्छ।",
              jp: "Step 5: API が 401 を返したらインターセプターが自動でトークンを更新して元のリクエストをリトライ。",
            },
          ],
        },
        {
          type: "code",
          title: {
            en: "RootNavigator — auth-driven navigation switch",
            np: "RootNavigator — auth-driven navigation",
            jp: "RootNavigator — 認証に基づく画面切り替え",
          },
          code: `function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <SplashScreen />;
  return user ? <AppNavigator /> : <AuthNavigator />;
}`,
        },
      ],
    },
    {
      title: {
        en: "Getting and Decoding the Auth Token (JWT)",
        np: "Auth Token प्राप्त गर्ने र JWT Decode गर्ने",
        jp: "認証トークンの取得と JWT デコード",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "After a successful login the server returns a signed **JWT access token**. You can **decode** it on the client with `jwt-decode` to extract the user's `id`, `email`, and `name` for display — without making an extra `/me` API call. Install: `npx expo install jwt-decode`. **Critical warning**: client-side JWT decoding is for **display and routing only** — the server must always verify the signature for any protected action. Never trust the decoded payload for authorization decisions on the client.",
            np: "jwt-decode ले JWT बाट user info निकाल्छ — display को लागि मात्र। authorization को लागि server नै verify गर्नुपर्छ।",
            jp: "`jwt-decode` で JWT からユーザー情報を取得できます。**表示やルーティング専用** — 認可判断はサーバーで行うこと。",
          },
        },
        {
          type: "code",
          title: {
            en: "login() — API call + JWT decode",
            np: "login() — API call र JWT decode",
            jp: "login() — API 呼び出しと JWT デコード",
          },
          code: `import jwtDecode from 'jwt-decode';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface JwtPayload {
  sub: string;   // user ID
  email: string;
  name: string;
  iat: number;   // issued-at (Unix timestamp)
  exp: number;   // expiry (Unix timestamp)
}

export async function login(email: string, password: string) {
  const res = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  if (!res.ok || !res.data) return null;

  const { accessToken, refreshToken } = res.data;

  // Decode WITHOUT verifying signature — for display only
  const user = jwtDecode<JwtPayload>(accessToken);

  return { user, accessToken, refreshToken };
}

// Convenience: store tokens and return user after any successful auth call
export async function loginWithTokens({ accessToken, refreshToken }: AuthResponse) {
  await SecureStore.setItemAsync('auth.refreshToken', refreshToken);
  const user = jwtDecode<JwtPayload>(accessToken);
  return { user, accessToken };
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`exp` claim**: You can check `payload.exp * 1000 > Date.now()` to proactively detect token expiry before making an API call, avoiding an unnecessary round-trip that would fail with 401.",
              np: "`payload.exp * 1000 > Date.now()` चेक गरी API call अघि token expire भए refresh गर्न सकिन्छ।",
              jp: "`payload.exp * 1000 > Date.now()` で先行してトークン期限切れを検出し、無駄な 401 往復を省けます。",
            },
            {
              en: "The `sub` claim is the **canonical user ID** — use it as the primary key when caching user-specific data in AsyncStorage (e.g. `profile:${user.sub}:v1`).",
              np: "`sub` claim नै user ID हो — AsyncStorage key मा प्रयोग गर्नुस् जस्तै `profile:${user.sub}:v1`।",
              jp: "`sub` クレームが**正規ユーザー ID** です。AsyncStorage のキーに使うと管理が楽になります。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Storing the Current User — Auth Context",
        np: "Current User राख्ने — Auth Context",
        jp: "現在のユーザーを保持する — Auth Context",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Sharing auth state (current user, loading flag, login/logout functions) through **React Context** is the standard approach. Wrap the entire app in `<AuthProvider>` so any component can call `useAuth()` without prop-drilling. The provider handles session restoration on mount, and exposes `loading: true` while the SecureStore read is in flight — this drives the splash-screen hold pattern.",
            np: "AuthContext ले user, loading, login, logout सबै जगाउँछ — कुनै पनि component मा useAuth() गर्न सकिन्छ।",
            jp: "Auth Context を使うと全コンポーネントで `useAuth()` を呼べます。セッション復元中は `loading: true` を返し、スプラッシュ画面の制御に使います。",
          },
        },
        {
          type: "code",
          title: {
            en: "AuthProvider + useAuth hook",
            np: "AuthProvider र useAuth हुक",
            jp: "AuthProvider + useAuth フック",
          },
          code: `import React, { createContext, useContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User { id: string; email: string; name: string; }

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount — runs once when the app starts
  React.useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('auth.refreshToken');
      if (!refreshToken) return; // no stored session → stay logged out
      // Exchange refresh token for a new access token, then decode user
      // const { user } = await refreshAccessToken(refreshToken);
      // setUser(user);
    } finally {
      setLoading(false); // always release loading — even if restore fails
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await loginApi(email, password);
    if (!result) return false;
    await SecureStore.setItemAsync('auth.refreshToken', result.refreshToken);
    setUser(result.user);
    return true;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('auth.refreshToken');
    await AsyncStorage.multiRemove(['auth.accessToken', 'feed:v2', 'profile:v1']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Always call `setLoading(false)` in a `finally` block** inside `restoreSession`. If the SecureStore read or the refresh API call throws, you still need to release the loading state so the app does not hang on a white screen forever.",
              np: "`finally` मा `setLoading(false)` राख्नुस् — error भए पनि app hang नहोस्।",
              jp: "`finally` ブロックで必ず `setLoading(false)` を呼ぶこと。エラー時も白画面で止まらないようにします。",
            },
            {
              en: "Keep the `AuthContext` file focused on state management only. Move the actual API calls (`loginApi`, `refreshAccessToken`) into a separate `auth-api.ts` file to keep concerns separate and make the context easy to test with mocks.",
              np: "AuthContext मा state logic मात्र राख्नुस्; API call छुट्टै `auth-api.ts` मा राख्नुस्।",
              jp: "Context ファイルは状態管理のみに絞り、API 呼び出しは別ファイルに分けるとテストしやすくなります。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Persisting Authentication State Across Restarts and Controlling the Splash Screen",
        np: "Restart पछि Auth State र Splash Screen नियन्त्रण",
        jp: "再起動後の認証状態の復元とスプラッシュ画面の制御",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "On every cold start, the app must restore the user's session **before** handing control to the navigator — otherwise the navigator renders `<AuthNavigator>` for a split second before snapping to `<AppNavigator>`, creating a jarring flash. The solution is to hold the native splash screen with `SplashScreen.preventAutoHideAsync()` until `loading` is `false`, then hide it using the `onLayout` callback on the root `View`.",
            np: "Cold start मा session restore नभएसम्म splash screen देखाउनुस् — login flash हुँदैन।",
            jp: "コールドスタート時はセッション復元が完了するまでスプラッシュ画面を保持することで、ログイン画面への一瞬の切り替えを防ぎます。",
          },
        },
        {
          type: "code",
          title: {
            en: "App.tsx — hold splash until auth is restored",
            np: "App.tsx — auth restore नभएसम्म splash राख्ने",
            jp: "App.tsx — 認証復元まで スプラッシュを保持",
          },
          code: `import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// Prevent splash from auto-hiding before we are ready
SplashScreen.preventAutoHideAsync();

export function App() {
  const { loading } = useAuth();

  // Called once the root View has been laid out and rendered
  const onLayoutRootView = useCallback(async () => {
    if (!loading) {
      await SplashScreen.hideAsync(); // reveal the app — session is restored
    }
  }, [loading]);

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}

// Wrap App in AuthProvider at the entry point:
// export default function Root() {
//   return (
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   );
// }`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Call `SplashScreen.preventAutoHideAsync()` **at module scope** (outside any component), not inside `useEffect`. It must be called as early as possible — before any asynchronous work starts — so the splash screen is held from the very first frame.",
              np: "`SplashScreen.preventAutoHideAsync()` module scope मा (component बाहिर) राख्नुस्।",
              jp: "`SplashScreen.preventAutoHideAsync()` はモジュールスコープ（コンポーネント外）で呼ぶこと。最初のフレームから確実に保持するためです。",
            },
            {
              en: "The `onLayout` approach (rather than `useEffect`) guarantees the root `View` has been measured and rendered before the splash disappears, eliminating a layout-flash that can occur if you hide the splash inside `useEffect` before the first paint.",
              np: "`onLayout` ले root View render भइसकेपछि splash लुकाउँछ — `useEffect` भन्दा राम्रो।",
              jp: "`onLayout` を使うと root `View` のレンダリング完了後にスプラッシュを隠せます。`useEffect` より確実です。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Calling Protected APIs and Implementing Registration",
        np: "Protected API Call र Registration लागू गर्ने",
        jp: "保護された API の呼び出しと登録の実装",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Registration follows the same token flow as login: POST credentials → receive tokens → store refresh token → decode user → update state. The main UX concern is showing a **loading overlay** that blocks interaction during the async operation so the user cannot double-submit. Use `StyleSheet.absoluteFill` to position the overlay over the entire form, and `pointerEvents=\"box-none\"` only on the outer container (not the overlay itself) so the spinner is visible but the form is blocked.",
            np: "Registration login जस्तै छ — POST → tokens → SecureStore → user state। Loading overlay ले double-submit रोक्छ।",
            jp: "登録はログインと同じトークンフローです。Loading overlay を使って二重送信を防ぎましょう。",
          },
        },
        {
          type: "code",
          title: {
            en: "register() API call + RegisterScreen with loading overlay",
            np: "register() र loading overlay सहित RegisterScreen",
            jp: "register() + ローディングオーバーレイ付き RegisterScreen",
          },
          code: `import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';

// Registration API call — mirrors loginWithTokens
export async function register(email: string, password: string, name: string) {
  const res = await apiClient.post<AuthResponse>('/auth/register', {
    email,
    password,
    name,
  });
  if (!res.ok || !res.data) return null;
  return loginWithTokens(res.data); // store tokens, decode user
}

// Registration screen
interface RegisterForm {
  email: string;
  password: string;
  name: string;
}

function RegisterScreen() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: RegisterForm) => {
    setLoading(true);
    try {
      const result = await register(values.email, values.password, values.name);
      if (!result) {
        Alert.alert('Registration failed', 'Please check your details and try again.');
        return;
      }
      // AuthProvider's state will update automatically — RootNavigator switches to AppNavigator
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Your form component */}
      {/* <RegisterForm onSubmit={handleSubmit} /> */}

      {/* Overlay blocks all interaction while submitting */}
      {loading && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {/* <LoadingOverlay visible /> */}
        </View>
      )}
    </>
  );
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Always wrap the API call in try/finally** and set `setLoading(false)` in the `finally` block — if the network throws, the overlay will still be dismissed and the form will become interactive again.",
              np: "`finally` मा `setLoading(false)` राख्नुस् — network error भए पनि form फेरि interactive हुन्छ।",
              jp: "`finally` ブロックで `setLoading(false)` を呼ぶことで、ネットワークエラー時もオーバーレイが確実に解除されます。",
            },
            {
              en: "For form validation before the API call, use **`react-hook-form`** with **`zod`** for schema-based validation. This prevents obviously invalid requests (empty email, password too short) from ever reaching the network layer.",
              np: "API call अघि `react-hook-form` र `zod` ले form validate गर्नुस्।",
              jp: "`react-hook-form` と `zod` でスキーマベースのバリデーションを行うと、明らかに無効なリクエストがネットワーク層に到達するのを防げます。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Is it safe to store an access token in AsyncStorage?",
        np: "AsyncStorage मा access token सुरक्षित छ?",
        jp: "アクセストークンを AsyncStorage に保存しても安全？",
      },
      answer: {
        en: "For **learning / demo apps** it is acceptable. For **production**, access tokens should live **in-memory only** (React state) and never be persisted to disk. Only **refresh tokens** need disk persistence, and those belong in **`expo-secure-store`** or the OS keychain — never in plain-text AsyncStorage.",
        np: "सिक्ने apps मा ठिक छ। production मा access token memory मा, refresh token SecureStore मा।",
        jp: "学習用では問題ありませんが、本番では**アクセストークンはメモリのみ**、**リフレッシュトークンは SecureStore** に保存してください。",
      },
    },
    {
      question: {
        en: "What happens to AsyncStorage data when the user uninstalls the app?",
        np: "अनइन्स्टल गर्दा AsyncStorage डेटा के हुन्छ?",
        jp: "アンインストールすると AsyncStorage のデータはどうなる？",
      },
      answer: {
        en: "On **Android** AsyncStorage data is deleted when the app is uninstalled. On **iOS** the data may persist in iCloud backups if the user has device backup enabled — keep this in mind and **never store sensitive secrets** that must not survive reinstall in plain AsyncStorage.",
        np: "Android मा मेटिन्छ। iOS मा iCloud ब्याकअपमा बाँचन सक्छ।",
        jp: "Android ではアンインストールで削除されます。iOS では iCloud バックアップに残る可能性があるため**機密データは保存しないこと**。",
      },
    },
    {
      question: {
        en: "What is stale-while-revalidate and when should I avoid it?",
        np: "stale-while-revalidate कहिले नगर्ने?",
        jp: "stale-while-revalidate を避けるべき場面は？",
      },
      answer: {
        en: "**Stale-while-revalidate** works well for feeds, product lists, and user profiles where showing data that is a few seconds old is fine. Avoid it for **real-time** or **safety-critical** screens — e.g., payment confirmation, stock prices, ride tracking — where the user must always see the freshest data and a stale value could cause harm or confusion.",
        np: "रियल-टाइम वा सुरक्षा-महत्त्वपूर्ण स्क्रिनमा stale-while-revalidate नगर्नुस्।",
        jp: "決済確認・株価など**リアルタイム性が必要な画面**では古いデータを見せると問題になるため使用を避けましょう。",
      },
    },
    {
      question: {
        en: "How do I prevent multiple concurrent 401 refresh calls?",
        np: "एकैसाथ धेरै 401 रिफ्रेस अनुरोध कसरी रोक्ने?",
        jp: "401 で複数のリフレッシュリクエストが重複するのを防ぐには？",
      },
      answer: {
        en: "Use a **`isRefreshing` boolean flag** and a **pending queue** of callbacks. When the flag is true, push subsequent failed requests into the queue instead of calling the refresh endpoint again. Once the refresh resolves, drain the queue — replay each request with the new token. This pattern is sometimes called **token refresh queue**.",
        np: "isRefreshing flag र queue प्रयोग गर्नुस्। एकचोटि मात्र रिफ्रेस गर्नुस्।",
        jp: "`isRefreshing` フラグとキューで制御します。このパターンは **token refresh queue** と呼ばれます。",
      },
    },
    {
      question: {
        en: "What should I include in the logout cleanup?",
        np: "logout मा के-के मेटाउने?",
        jp: "ログアウト時に何を削除すべきか？",
      },
      answer: {
        en: "Use **`AsyncStorage.multiRemove`** to atomically delete all app keys in one call — feeds, profile cache, preferences, access token. Also call **`SecureStore.deleteItemAsync`** for the refresh token. Finally, reset the navigation stack to the Login screen so the user cannot press 'Back' to return to protected screens.",
        np: "multiRemove ले सबै AsyncStorage कुञ्जी, SecureStore.deleteItemAsync ले refresh token मेटाउनुस्।",
        jp: "`multiRemove` で AsyncStorage の全キーを一括削除し、`SecureStore.deleteItemAsync` でリフレッシュトークンを消去。ナビゲーションスタックもリセットします。",
      },
    },
  ],
};
