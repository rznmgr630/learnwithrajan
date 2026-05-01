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
