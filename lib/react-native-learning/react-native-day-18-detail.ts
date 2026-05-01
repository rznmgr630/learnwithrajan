import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 18 — API layers: ApiSauce/fetch, errors, spinners & upload progress. */
export const REACT_NATIVE_DAY_18_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 18 builds a production-grade **API layer** in React Native. You will use **ApiSauce** to create typed HTTP clients, compare it against raw **fetch**, classify every error category, display **ActivityIndicator** spinners, track **upload progress** with XMLHttpRequest, write an **exponential backoff** retry strategy, craft a reusable **`useApi` hook**, and cancel in-flight requests with **AbortController** on unmount.",
      np: "ApiSauce र fetch तुलना, त्रुटि श्रेणी, स्पिनर, अपलोड प्रगति, AbortController।",
      jp: "Day 18 では **ApiSauce** で型安全 HTTP クライアントを構築し、エラー分類・スピナー・アップロード進捗・**AbortController** によるクリーンアップを学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "ApiSauce vs Raw fetch — Pros & Cons",
        np: "ApiSauce बनाम fetch",
        jp: "ApiSauce と生 fetch の比較",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**ApiSauce** wraps **axios** and adds a unified **`ApiResponse<T>`** envelope with `ok`, `data`, `status`, and `problem` fields so you never have to branch on `response.status >= 400` manually. Raw **`fetch`** ships with zero dependencies but demands manual JSON parsing, status inspection, and error normalisation on every call-site.",
            np: "ApiSauce ले ok/problem फिल्ड दिन्छ; fetch मा सबै आफैं लेख्नुपर्छ।",
            jp: "**ApiSauce** は `ok`/`problem` フィールドで統一レスポンスを提供し、生 **fetch** では毎回 JSON パースとエラー正規化が必要です。",
          },
        },
        {
          type: "table",
          caption: {
            en: "ApiSauce vs raw fetch — quick comparison",
            np: "छिटो तुलना तालिका",
            jp: "ApiSauce vs 生 fetch 比較表",
          },
          headers: [
            { en: "Feature", np: "सुविधा", jp: "機能" },
            { en: "ApiSauce", np: "ApiSauce", jp: "ApiSauce" },
            { en: "Raw fetch", np: "fetch", jp: "生 fetch" },
          ],
          rows: [
            [
              { en: "Error normalisation", np: "त्रुटि सामान्यीकरण", jp: "エラー正規化" },
              { en: "Built-in `problem` field", np: "बिल्ट-इन", jp: "組み込み" },
              { en: "Manual every call-site", np: "म्यानुअल", jp: "毎回手書き" },
            ],
            [
              { en: "Request interceptors", np: "इन्टरसेप्टर", jp: "インターセプター" },
              { en: "addRequestTransform / addResponseTransform", np: "सजिलो", jp: "transform API 付き" },
              { en: "No native support", np: "छैन", jp: "ネイティブ非対応" },
            ],
            [
              { en: "TypeScript generics", np: "जेनेरिक्स", jp: "ジェネリクス" },
              { en: "ApiResponse<T> built-in", np: "बिल्ट-इन", jp: "組み込み" },
              { en: "Must wrap manually", np: "म्यानुअल", jp: "手動でラップ" },
            ],
            [
              { en: "Upload progress", np: "अपलोड प्रगति", jp: "アップロード進捗" },
              { en: "onUploadProgress config option", np: "कन्फिग विकल्प", jp: "設定オプション" },
              { en: "Not supported", np: "छैन", jp: "非対応" },
            ],
            [
              { en: "Bundle size overhead", np: "बन्डल साइज", jp: "バンドルサイズ" },
              { en: "~15 kB (includes axios)", np: "ठूलो", jp: "約 15 kB" },
              { en: "0 kB (native)", np: "शून्य", jp: "0 kB（ネイティブ）" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Creating an ApiSauce client with auth interceptor",
            np: "ApiSauce क्लाइन्ट सेटअप",
            jp: "ApiSauce クライアント + 認証インターセプター",
          },
          code: `import { create } from 'apisauce';

// Single reusable client — instantiate once and import everywhere
export const apiClient = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000, // 10 s — tune per endpoint if needed
});

// Attach a token before every request
apiClient.addAsyncRequestTransform(async (request) => {
  const token = await getStoredToken(); // your SecureStore / AsyncStorage helper
  if (token) {
    request.headers = request.headers ?? {};
    request.headers['Authorization'] = \`Bearer \${token}\`;
  }
});

// --- Usage ---
export async function fetchListings() {
  const res = await apiClient.get<Listing[]>('/listings');
  if (!res.ok) return null; // res.problem tells you WHY it failed
  return res.data;          // res.data is typed as Listing[] | undefined
}

export async function createListing(payload: NewListing) {
  return apiClient.post<Listing>('/listings', payload); // caller checks res.ok
}`,
        },
      ],
    },
    {
      title: {
        en: "Error Categories & Problem Detection",
        np: "त्रुटि श्रेणीहरू",
        jp: "エラー分類と問題検出",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "ApiSauce maps every failure to a **`problem`** string constant so your UI can branch cleanly. Understanding each category helps you show the right message — a 'no internet' banner is very different from a '422 validation error' inline message.",
            np: "problem स्थिरांकले सही UI सन्देश देखाउन मद्दत गर्छ।",
            jp: "`problem` 定数ごとに適切な UI を出し分けましょう。",
          },
        },
        {
          type: "table",
          caption: {
            en: "ApiSauce `problem` values and recommended handling",
            np: "problem मान र सुझाव",
            jp: "ApiSauce problem 値と推奨ハンドリング",
          },
          headers: [
            { en: "problem value", np: "मान", jp: "problem 値" },
            { en: "HTTP status / cause", np: "स्थिति / कारण", jp: "HTTP ステータス / 原因" },
            { en: "Recommended UX", np: "सुझाव UI", jp: "推奨 UX" },
          ],
          rows: [
            [
              { en: "`NETWORK_ERROR`", np: "नेटवर्क", jp: "NETWORK_ERROR" },
              { en: "No connectivity / DNS failure", np: "इन्टरनेट छैन", jp: "接続なし / DNS 障害" },
              { en: "Offline banner + retry button", np: "अफलाइन बैनर", jp: "オフラインバナー＋リトライ" },
            ],
            [
              { en: "`TIMEOUT_ERROR`", np: "टाइमआउट", jp: "TIMEOUT_ERROR" },
              { en: "Server exceeded timeout window", np: "सर्भर ढिलो", jp: "タイムアウト超過" },
              { en: "\"Request timed out\" toast + retry", np: "टोस्ट + रिट्राई", jp: "タイムアウトトースト＋リトライ" },
            ],
            [
              { en: "`CLIENT_ERROR` (4xx)", np: "क्लाइन्ट गल्ती", jp: "CLIENT_ERROR (4xx)" },
              { en: "400 / 401 / 403 / 404 / 422", np: "गलत अनुरोध", jp: "不正リクエスト / 認証エラー" },
              { en: "Inline field errors (422) or auth redirect (401)", np: "इनलाइन वा लगइन", jp: "フィールドエラーまたは認証リダイレクト" },
            ],
            [
              { en: "`SERVER_ERROR` (5xx)", np: "सर्भर गल्ती", jp: "SERVER_ERROR (5xx)" },
              { en: "Internal server crash / deploy error", np: "सर्भर क्र्यास", jp: "サーバ内部エラー" },
              { en: "Generic error screen + Sentry report", np: "सामान्य त्रुटि", jp: "汎用エラー画面＋Sentry 報告" },
            ],
            [
              { en: "`CANCEL_ERROR`", np: "रद्द", jp: "CANCEL_ERROR" },
              { en: "AbortController triggered (component unmounted)", np: "रद्द गरियो", jp: "AbortController 発動" },
              { en: "Silent — ignore entirely", np: "मौन", jp: "無視する（アンマウント済）" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "ActivityIndicator Loading State",
        np: "लोडिङ स्पिनर",
        jp: "ActivityIndicator でローディング状態",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A **`loading`** boolean should live in component state (or in your custom hook) and be set `true` before the request fires and `false` in the final `finally` block. Displaying a **fullscreen overlay `ActivityIndicator`** during mutations prevents double-submission — the user cannot tap again while the request is in-flight.",
            np: "loading बुलियन finally मा false गर्नुस्। ओभरले ले डबल ट्याप रोक्छ।",
            jp: "`loading` フラグは `finally` で必ず `false` に。**オーバーレイ**で二重送信を防ぎます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Reusable LoadingOverlay component",
            np: "लोडिङ ओभरले घटक",
            jp: "再利用可能な LoadingOverlay",
          },
          code: `import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

interface Props { visible: boolean }

export function LoadingOverlay({ visible }: Props) {
  return (
    <Modal transparent animationType="none" visible={visible}>
      <View style={styles.backdrop}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.40)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Usage in a screen:
// const [loading, setLoading] = useState(false);
// <LoadingOverlay visible={loading} />`,
        },
      ],
    },
    {
      title: {
        en: "Upload Progress with XMLHttpRequest",
        np: "अपलोड प्रगति XHR",
        jp: "XMLHttpRequest でアップロード進捗",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Neither **`fetch`** nor ApiSauce expose upload progress events — this is a **Fetch API spec** omission. For file uploads that need a progress bar, use **`XMLHttpRequest`** directly. The `xhr.upload.onprogress` event fires repeatedly with `event.loaded` and `event.total`, giving you a 0–1 fraction to drive a progress bar or percentage label.",
            np: "fetch र ApiSauce मा अपलोड प्रगति छैन। XHR को onprogress प्रयोग गर्नुस्।",
            jp: "fetch/ApiSauce はアップロード進捗を報告しません。**XHR の `upload.onprogress`** を使いましょう。",
          },
        },
        {
          type: "code",
          title: {
            en: "useUpload hook — file upload with XHR progress",
            np: "useUpload हुक",
            jp: "useUpload フック（XHR 進捗付き）",
          },
          code: `import { useState, useRef } from 'react';

export function useUpload(endpoint: string) {
  const [progress, setProgress] = useState(0); // 0.0 – 1.0
  const [uploading, setUploading] = useState(false);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const upload = (fileUri: string, mimeType = 'image/jpeg') =>
    new Promise<{ ok: boolean; status: number }>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(e.loaded / e.total);
      };

      xhr.onload = () => {
        setUploading(false);
        resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status });
      };

      xhr.onerror = () => {
        setUploading(false);
        reject(new Error('Network error during upload'));
      };

      xhr.open('POST', endpoint);
      xhr.setRequestHeader('Authorization', \`Bearer \${getStoredToken()}\`);

      const form = new FormData();
      // React Native FormData accepts { uri, type, name }
      form.append('file', { uri: fileUri, type: mimeType, name: 'upload' } as any);

      setProgress(0);
      setUploading(true);
      xhr.send(form);
    });

  // Cancel mid-upload (e.g., user taps "Cancel")
  const cancel = () => xhrRef.current?.abort();

  return { upload, cancel, progress, uploading };
}`,
        },
      ],
    },
    {
      title: {
        en: "Retry with Exponential Backoff & the Custom useApi Hook",
        np: "रिट्राई र useApi हुक",
        jp: "指数バックオフリトライと useApi フック",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A **custom `useApi` hook** returns a `{ data, error, loading, request }` tuple that any screen can consume without re-writing fetch logic. The internal `request` function optionally applies **exponential backoff** — waiting `2^attempt × 500 ms` before each retry — only for transient failures like `NETWORK_ERROR` or `TIMEOUT_ERROR`. Hard client/server errors are surfaced immediately.",
            np: "useApi ले data/error/loading/request ट्युपल फर्काउँछ। transient गल्ती मा मात्र रिट्राई।",
            jp: "`useApi` は `{ data, error, loading, request }` タプルを返し、過渡的なエラーのみ **指数バックオフ**でリトライします。",
          },
        },
        {
          type: "code",
          title: {
            en: "useApi hook with exponential backoff and AbortController",
            np: "useApi हुक — backoff र AbortController",
            jp: "useApi フック（指数バックオフ + AbortController）",
          },
          code: `import { useState, useRef, useCallback } from 'react';
import type { ApiResponse } from 'apisauce';

const RETRYABLE_PROBLEMS = new Set(['NETWORK_ERROR', 'TIMEOUT_ERROR']);
const MAX_RETRIES = 3;

async function withExponentialBackoff<T>(
  fn: () => Promise<ApiResponse<T>>,
  attempt = 0,
): Promise<ApiResponse<T>> {
  const res = await fn();
  const shouldRetry =
    !res.ok &&
    RETRYABLE_PROBLEMS.has(res.problem ?? '') &&
    attempt < MAX_RETRIES;

  if (!shouldRetry) return res;

  // Wait 500 ms, 1000 ms, 2000 ms on attempts 0, 1, 2
  await new Promise((r) => setTimeout(r, 2 ** attempt * 500));
  return withExponentialBackoff(fn, attempt + 1);
}

export function useApi<T>(
  apiFunc: (...args: unknown[]) => Promise<ApiResponse<T>>,
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const request = useCallback(
    async (...args: unknown[]) => {
      // Cancel any previous in-flight request from this hook instance
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setError(null);

      const response = await withExponentialBackoff(() => apiFunc(...args));

      // Component may have unmounted while we were waiting — bail out silently
      if (abortRef.current.signal.aborted) return;

      setLoading(false);

      if (response.ok && response.data !== undefined) {
        setData(response.data);
      } else {
        setError(response.problem ?? 'UNKNOWN_ERROR');
      }
    },
    [apiFunc],
  );

  return { data, error, loading, request };
}

// --- Screen usage ---
// const { data: listings, loading, error, request } = useApi(fetchListings);
// useEffect(() => { request(); }, []);`,
        },
        {
          type: "diagram",
          id: "react-native-data-offline-online",
        },
      ],
    },
    {
      title: {
        en: "Setting Up the Backend",
        np: "ब्याकएन्ड सेटअप",
        jp: "バックエンドのセットアップ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "This course uses a **Node.js/Express** backend — either a lightweight **JSON Server** for rapid prototyping or a real Express API for production-like practice. The base URL is configured per environment using Expo's `EXPO_PUBLIC_` prefix, which exposes variables to the JavaScript bundle at build time (Expo SDK 49+). **Never** put secrets such as API keys or private tokens in `EXPO_PUBLIC_` variables — they are baked into the client bundle and visible to anyone who extracts it.",
            np: "यस कोर्समा Node.js/Express ब्याकएन्ड प्रयोग गरिन्छ। EXPO_PUBLIC_ prefix ले env var JS bundle मा expose गर्छ। API key जस्ता secret यहाँ नराख्नुस्।",
            jp: "このコースでは **Node.js/Express** バックエンド（JSON Server またはリアルな Express API）を使用します。ベース URL は `EXPO_PUBLIC_` プレフィックスで環境ごとに設定します。API キーなどの秘密情報は絶対に `EXPO_PUBLIC_` に入れないでください — バンドルに焼き込まれ誰でも見られます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Configure base URL with EXPO_PUBLIC_ env var",
            np: "EXPO_PUBLIC_ env var सँग baseURL सेट गर्नुस्",
            jp: "EXPO_PUBLIC_ 環境変数で baseURL を設定",
          },
          code: `// services/client.ts
import { create } from 'apisauce';

export const client = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com',
});

// .env.local (never commit to git)
// EXPO_PUBLIC_API_URL=http://192.168.1.10:3000

// IMPORTANT: EXPO_PUBLIC_ vars are embedded in the JS bundle at build time.
// Use them only for non-sensitive values like API base URLs.
// Secrets (private keys, payment tokens) must stay server-side only.`,
        },
      ],
    },
    {
      title: {
        en: "Inspecting API Calls",
        np: "API कलहरू जाँच्ने",
        jp: "API コールの検査",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Two main tools help you inspect network traffic during development: **Expo Dev Tools / Metro overlay** shows basic request logs in the terminal, while **Flipper** (or React Native Debugger) provides a full network panel with request/response headers and body. For a quick no-setup approach, add request and response transforms directly on your ApiSauce client. Always wrap these logs in `if (__DEV__)` so they are stripped from production builds.",
            np: "Expo Dev Tools/Metro ले basic लग देखाउँछ। Flipper/RN Debugger ले headers र body सहित पूरा network panel दिन्छ। छिटो approach को लागि ApiSauce transforms प्रयोग गर्नुस् — तर `if (__DEV__)` मा मात्र।",
            jp: "開発中のネットワーク検査には主に2つのツールがあります。**Expo Dev Tools / Metro オーバーレイ**は基本的なリクエストログを表示し、**Flipper**（または React Native Debugger）はヘッダーやボディを含む完全なネットワークパネルを提供します。セットアップ不要な方法として ApiSauce の transform を使う手もあります。必ず `if (__DEV__)` でガードしてください。",
          },
        },
        {
          type: "code",
          title: {
            en: "ApiSauce request/response logging transforms",
            np: "ApiSauce logging transforms",
            jp: "ApiSauce リクエスト／レスポンスログ transform",
          },
          code: `client.addRequestTransform((request) => {
  if (__DEV__) {
    console.log(\`→ \${request.method?.toUpperCase()} \${request.url}\`, request.params ?? request.data);
  }
});

client.addResponseTransform((response) => {
  if (__DEV__) {
    console.log(\`← \${response.status} \${response.config?.url}\`, response.data);
  }
});

// Tips:
// - Wrap in __DEV__ so logging only occurs in development builds.
// - For deeper inspection (headers, cookies, TLS), use Flipper's Network plugin
//   or a proxy tool like Charles Proxy / mitmproxy.`,
        },
      ],
    },
    {
      title: {
        en: "Simulating a Slow Connection",
        np: "ढिलो कनेक्सन सिमुलेट गर्ने",
        jp: "低速ネットワークのシミュレーション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Testing your loading states and retry logic requires a slow network. On the **iOS Simulator** use the **Network Link Conditioner** (available in the Additional Tools for Xcode package) to throttle bandwidth and add latency. On the **Android Emulator** go to Settings → Additional settings → Developer options → Network throttle. In development code you can also add an artificial delay directly in your API function to verify that spinners and progress bars behave correctly.",
            np: "iOS Simulator मा Network Link Conditioner र Android Emulator मा Developer options → Network throttle प्रयोग गर्नुस्। Dev code मा कृत्रिम delay थपेर पनि loading state जाँच्न सकिन्छ। Charles Proxy र mitmproxy ले traffic inspect गर्न सकिन्छ।",
            jp: "**iOS シミュレータ**では Network Link Conditioner（Xcode 追加ツール）を使います。**Android エミュレータ**では設定 → 開発者向けオプション → ネットワーク制限です。開発コードに人工的な遅延を入れる方法もあります。高度な検査には Charles Proxy や mitmproxy が便利です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Artificial API delay in development",
            np: "development मा कृत्रिम API delay",
            jp: "開発環境での人工的な API 遅延",
          },
          code: `// Mock slow API in development
export async function fetchListings() {
  if (__DEV__) await new Promise((r) => setTimeout(r, 2000)); // 2s artificial delay
  return client.get<Listing[]>('/listings');
}

// Advanced traffic inspection tools:
// - Charles Proxy  → SSL inspection, request rewriting, throttling profiles
// - mitmproxy      → open-source, scriptable HTTP/HTTPS proxy
// Both work by routing device traffic through a proxy on your dev machine.`,
        },
      ],
    },
    {
      title: {
        en: "Building a Beautiful ActivityIndicator",
        np: "सुन्दर ActivityIndicator बनाउने",
        jp: "洗練された ActivityIndicator の構築",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The default platform **ActivityIndicator** works but looks generic. For a branded loading experience, swap it for a **LottieView** animation — a lightweight JSON-based vector animation that plays an After Effects export. Pair it with **`expo-splash-screen`** to hold the splash screen while your initial data loads, so the user never sees a blank flash before content appears.",
            np: "default ActivityIndicator सामान्य देखिन्छ। LottieView ले branded JSON animation देखाउँछ। expo-splash-screen ले initial data लोड हुँदासम्म splash screen राख्न सकिन्छ।",
            jp: "デフォルトの ActivityIndicator は汎用的に見えます。**LottieView** を使えばブランドに合った JSON アニメーションを再生できます。初期データ読み込み中はスプラッシュ画面を保持する **`expo-splash-screen`** と組み合わせると、白紙画面のちらつきを防げます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Branded LoadingScreen with LottieView",
            np: "LottieView सँग branded LoadingScreen",
            jp: "LottieView を使ったブランド LoadingScreen",
          },
          code: `import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';

export function LoadingScreen() {
  return (
    <View style={styles.center}>
      <LottieView
        source={require('../assets/animations/loading.json')}
        autoPlay
        loop
        style={{ width: 150, height: 150 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

// Tip: hold the splash screen while fetching initial data
// import * as SplashScreen from 'expo-splash-screen';
// SplashScreen.preventAutoHideAsync();
// ... after data loads ...
// SplashScreen.hideAsync();`,
        },
      ],
    },
    {
      title: {
        en: "Building the Upload Screen",
        np: "अपलोड स्क्रिन बनाउने",
        jp: "アップロード画面の構築",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The upload screen receives an `imageUri` via route params, calls the `useUpload` hook, and shows live progress while the file transfers. While `uploading` is true the button is replaced with a percentage label — preventing double-submission. On success, the screen navigates forward, passing the result to the destination screen.",
            np: "Upload screen ले route params बाट imageUri लिन्छ, useUpload hook call गर्छ, र uploading हुँदा progress percentage देखाउँछ। सफल भएपछि Listings स्क्रिनमा navigate गर्छ।",
            jp: "アップロード画面は route params から `imageUri` を受け取り、`useUpload` フックを呼び出します。アップロード中はボタンをパーセント表示に切り替えて二重送信を防ぎ、成功後は次画面へナビゲートします。",
          },
        },
        {
          type: "code",
          title: {
            en: "UploadScreen with live progress feedback",
            np: "live progress सहित UploadScreen",
            jp: "リアルタイム進捗付き UploadScreen",
          },
          code: `import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUpload } from '../hooks/useUpload';
import AppButton from '../components/AppButton';

export default function UploadScreen({ navigation, route }) {
  const { imageUri } = route.params;
  const { upload, progress, uploading } = useUpload('/listings');

  const handleUpload = async () => {
    const result = await upload(imageUri);
    if (result.ok) navigation.navigate('Listings');
  };

  return (
    <View style={styles.container}>
      {uploading ? (
        <Text>{Math.round(progress * 100)}% uploaded</Text>
      ) : (
        <AppButton title="Upload" onPress={handleUpload} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
});`,
        },
      ],
    },
    {
      title: {
        en: "Adding a Progress Bar",
        np: "प्रगति बार थप्ने",
        jp: "プログレスバーの追加",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A smooth animated progress bar improves perceived performance during uploads. Use **react-native-reanimated** — specifically `useSharedValue` and `withTiming` — to animate the bar width without blocking the JS thread. The `UploadProgressBar` component accepts a `progress` prop (0.0–1.0) and a `visible` flag so it can be mounted/unmounted cleanly from the upload screen.",
            np: "react-native-reanimated को useSharedValue र withTiming ले JS thread block नगरी smooth animation दिन्छ। UploadProgressBar ले 0–1 को progress prop लिन्छ र visible flag अनुसार देखिन्छ।",
            jp: "**react-native-reanimated** の `useSharedValue` と `withTiming` を使うことで JS スレッドをブロックせずにスムーズなアニメーションを実現します。`UploadProgressBar` は 0.0〜1.0 の `progress` と `visible` フラグを受け取ります。",
          },
        },
        {
          type: "code",
          title: {
            en: "UploadProgressBar — animated with react-native-reanimated",
            np: "UploadProgressBar — reanimated सँग animated",
            jp: "UploadProgressBar — react-native-reanimated でアニメーション",
          },
          code: `import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  progress: number; // 0.0 – 1.0
  visible: boolean;
  color?: string;
}

export function UploadProgressBar({ progress, visible, color = '#6366f1' }: Props) {
  const width = useSharedValue(0);
  width.value = withTiming(progress * 100, { duration: 200 });

  const style = useAnimatedStyle(() => ({
    width: \`\${width.value}%\`,
  }));

  if (!visible) return null;

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { backgroundColor: color }, style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});`,
        },
      ],
    },
    {
      title: {
        en: "Showing the Done Animation and Resetting the Form",
        np: "Done Animation र Form Reset",
        jp: "完了アニメーションとフォームのリセット",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "After a successful upload you have two options: navigate immediately and let the destination screen show a success state, or briefly display a **Lottie done animation** before navigating. In **Formik**-backed forms, call `resetForm()` inside the submit handler on success to restore all fields to their `initialValues` — this prevents stale data from appearing if the user returns to the form screen.",
            np: "Upload सफल भएपछि तुरुन्त navigate गर्न वा Lottie done animation देखाएर navigate गर्न सकिन्छ। Formik form मा resetForm() ले सबै field initialValues मा फर्काउँछ।",
            jp: "アップロード成功後は即座にナビゲートするか、**Lottie の完了アニメーション**を短時間表示してからナビゲートするか選べます。Formik フォームでは成功時に `resetForm()` を呼び出してすべてのフィールドを `initialValues` に戻しましょう。",
          },
        },
        {
          type: "code",
          title: {
            en: "Post-upload navigation, Lottie done animation, and Formik reset",
            np: "Post-upload navigation, Lottie animation, र Formik reset",
            jp: "アップロード後ナビゲーション・Lottie アニメーション・Formik リセット",
          },
          code: `// After successful upload — reset form and show success feedback
const handleSuccess = () => {
  // Option 1: Navigate and let the destination show success
  navigation.navigate('Listings', { uploaded: true });

  // Option 2: Show a Lottie done animation, then navigate
  setDone(true);
  setTimeout(() => navigation.navigate('Listings'), 1500);
};

// In a Formik form — reset on success
const handleSubmit = async (values, { resetForm }) => {
  const result = await submitListing(values);
  if (result.ok) {
    resetForm(); // clears all field values back to initialValues
    navigation.goBack();
  }
};

// LottieView done animation (same pattern as LoadingScreen)
// <LottieView
//   source={require('../assets/animations/done.json')}
//   autoPlay
//   loop={false}
//   style={{ width: 120, height: 120 }}
// />`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I use ApiSauce or React Query?",
        np: "ApiSauce वा React Query?",
        jp: "ApiSauce と React Query どちらを使う？",
      },
      answer: {
        en: "They solve **different layers**. **ApiSauce** handles transport concerns — normalised errors, interceptors, base URL. **React Query** handles server-state concerns — caching, background refetch, stale-while-revalidate. Use ApiSauce as the **fetcher function** inside React Query's `queryFn` to get both benefits.",
        np: "ApiSauce ट्रान्सपोर्ट तह; React Query क्यास तह। दुवै मिलाउन सकिन्छ।",
        jp: "ApiSauce はトランスポート層、React Query はキャッシュ層を担います。**`queryFn` の中で ApiSauce を使う**と両方の恩恵を受けられます。",
      },
    },
    {
      question: {
        en: "When does AbortController actually matter in React Native?",
        np: "AbortController कहाँ काम लाग्छ?",
        jp: "AbortController が本当に役立つ場面は？",
      },
      answer: {
        en: "When the user navigates away mid-request the component unmounts. Without cancellation the response still arrives and calls `setState` on an unmounted component — a **memory leak** in React Native. Calling `controller.abort()` inside a **`useEffect` cleanup** prevents this and suppresses the CANCEL_ERROR silently.",
        np: "स्क्रिन छोडेपछि setState ले मेमोरी लिक गर्छ। useEffect cleanup मा abort गर्नुस्।",
        jp: "アンマウント後の `setState` を防ぎ**メモリリーク**を回避します。`useEffect` クリーンアップで `abort()` を呼びましょう。",
      },
    },
    {
      question: {
        en: "How many retries are safe for exponential backoff?",
        np: "कति पटक रिट्राई गर्ने?",
        jp: "指数バックオフのリトライ回数は何回が適切？",
      },
      answer: {
        en: "**2–3 retries** is the practical sweet-spot. With the `2^attempt × 500 ms` formula: attempt 0 waits 500 ms, attempt 1 waits 1 s, attempt 2 waits 2 s — a total maximum delay of ~3.5 s before surfacing the error. Add a **random jitter** (e.g. ±200 ms) if many clients retry simultaneously to avoid thundering-herd hammering the server.",
        np: "२-३ पटक। jitter थप्दा सर्भरमा एकसाथ धेरै अनुरोध आउँदैन।",
        jp: "2〜3 回が現実的。**ジッター**（ランダムオフセット）を加えるとサーバへの集中アクセスを防げます。",
      },
    },
    {
      question: {
        en: "Why doesn't fetch support upload progress at all?",
        np: "fetch मा प्रगति किन छैन?",
        jp: "fetch がアップロード進捗に対応しない理由は？",
      },
      answer: {
        en: "The **Fetch API specification** deliberately omitted upload progress events to keep the surface area minimal. Use **`XMLHttpRequest`** with `xhr.upload.onprogress`, or **axios** (which ApiSauce wraps) via its `onUploadProgress` config key — both are widely supported in React Native's JSC and Hermes runtimes.",
        np: "Fetch spec मा अपलोड प्रगति छैन। XHR वा axios प्रयोग गर्नुस्।",
        jp: "仕様上の意図的な省略です。**XHR** か axios の `onUploadProgress` を使いましょう。",
      },
    },
    {
      question: {
        en: "How do I handle 401 Unauthorized globally without repeating the logic on every screen?",
        np: "401 ग्लोबल ह्यान्डलिङ कसरी गर्ने?",
        jp: "401 をすべてのリクエストで一括処理するには？",
      },
      answer: {
        en: "Register a single **`addResponseTransform`** on your ApiSauce client (or an axios response interceptor). Inside it, check `response.status === 401`, clear the stored auth token, and use a **navigation ref** to push the user to the Login screen. This fires for every API call app-wide — you never need per-screen 401 handling.",
        np: "addResponseTransform मा 401 जाँची टोकन मेटाउनुस् र लगइन स्क्रिनमा पठाउनुस्।",
        jp: "`addResponseTransform` で 401 を検出し、トークンをクリアして navigation ref でログイン画面へ。アプリ全体を一か所で管理できます。",
      },
    },
  ],
};
