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
