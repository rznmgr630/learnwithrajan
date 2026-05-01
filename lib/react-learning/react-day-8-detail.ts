import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 8 — Connecting to the Backend (~1h): useEffect, deps, cleanup, fetch, HTTP, errors, async/await, abort, loading, CRUD, services, custom hooks. */
export const REACT_DAY_8_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 8 bridges React UI to remote data: `useEffect` for side effects, dependency arrays and cleanup, then `fetch` with HTTP basics, errors, `async`/`await`, AbortController, and loading UX. You finish by deleting, creating, and updating resources, then layering a reusable client, user service, generic HTTP helper, and a custom data-fetching hook.",
      np: "दिन ८ UI र remote data: `useEffect`, deps, cleanup, `fetch`, HTTP, त्रुटि, async/await, abort, loading। CRUD पछि API client, user service, generic HTTP, custom hook।",
      jp: "8日目は `useEffect` で副作用を扱い、依存配列とクリーンアップ、`fetch`・HTTP・エラー・async/await・キャンセル・ローディングを押さえます。削除・作成・更新のあと、API クライアント・ユーザーサービス・汎用 HTTP・データ取得用カスタムフックへ整理します。",
    },
    {
      en: "Playlist length is about one hour; timestamps in section titles are pacing hints from the curriculum.",
      np: "प्लेलिस्ट ~१ घण्टा; शीर्षकमा समय संकेत।",
      jp: "再生時間は 約1時間。見出しの時間は目安です。",
    },
  ],
  sections: [
    {
      title: {
        en: "Introduction (~0m 53s)",
        np: "परिचय (~०m ५३s)",
        jp: "イントロ（約 0m53s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "You will keep server state and UI state mentally separate: the browser talks to an API with HTTP verbs and JSON, while React decides when to run effects and how to reflect loading, data, and errors in the tree.",
            np: "server state vs UI state; HTTP + JSON; React मा when र UI।",
            jp: "サーバの状態と画面の状態を分けて考えます。HTTP と JSON で通信し、React では いつ副作用を走らせるか と ローディング・データ・エラーの見せ方を決めます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Understanding the Effect Hook (~3m 50s)",
        np: "Effect Hook बुझाइ (~३m ५०s)",
        jp: "Effect Hook の理解（約 3m50s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useEffect(fn, deps?)` runs `fn` after paint (by default) so you do not block rendering. Use it for subscriptions, timers, imperative DOM, and data fetching — not for deriving values you can compute during render.",
            np: "`useEffect` paint पछि। subscription/timer/DOM/fetch। render मा निकाल्न मिल्ने कुरा effect मा होइन।",
            jp: "`useEffect` は（通常）描画のあとに走ります。購読・タイマー・命令的 DOM・取得向きで、レンダー中に計算できる値は effect に書きません。",
          },
        },
      ],
    },
    {
      title: {
        en: "Effect dependencies (~8m 34s)",
        np: "Effect निर्भरता (~८m ३४s)",
        jp: "Effect の依存配列（約 8m34s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The dependency array tells React which values from the component scope must be fresh when the effect re-runs. `[]` runs once on mount (in Strict Mode dev, mount may run twice to surface bugs). Omitting the array means every render — rarely what you want for network calls.",
            np: "deps — कुन मान बदल्दा effect फेरि। `[]` mount मा। array नभए हरेक render — सामान्यमा fetch मा होइन।",
            jp: "依存配列は「この値が変わったら effect をやり直す」という意味です。`[]` はマウント時（開発の Strict Mode ではマウントが二重になり得ます）。配列省略は毎レンダーで、取得にはほぼ不向きです。",
          },
        },
      ],
    },
    {
      title: {
        en: "Effect cleanup (~2m 30s)",
        np: "Effect cleanup (~२m ३०s)",
        jp: "Effect のクリーンアップ（約 2m30s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Return a cleanup function from `useEffect` to undo side effects: unsubscribe listeners, clear timers, or abort in-flight requests before the next run or on unmount. Cleanup runs before the effect runs again and when the component unmounts.",
            np: "cleanup — unsubscribe, timer clear, abort। अर्को चरण अघि वा unmount मा।",
            jp: "`useEffect` からクリーンアップ関数を返すと、次の effect の前とアンマウント時に呼ばれます。購読解除・タイマー解除・進行中リクエストの中止に使います。",
          },
        },
      ],
    },
    {
      title: {
        en: "Fetching data (~5m 32s)",
        np: "डाटा fetch (~५m ३२s)",
        jp: "データ取得（約 5m32s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Typical pattern: `useEffect` kicks off `fetch(url)`, then `setState` with the parsed body. Keep three pieces of UI state in mind: `loading`, `data`, `error` (each optional until you need them).",
            np: "`useEffect` + `fetch` + `setState`। `loading`/`data`/`error`।",
            jp: "`useEffect` で `fetch` を開始し、結果を `setState` します。`loading`・`data`・`error` の状態を分けて持つと扱いやすいです。",
          },
        },
        {
          type: "code",
          title: {
            en: "Sketch — fetch in an effect",
            np: "effect मा fetch",
            jp: "effect 内 fetch の骨子",
          },
          code: `const [data, setData] = useState(null);
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  let cancelled = false;
  setLoading(true);
  fetch(\"/api/items\")
    .then((r) => r.json())
    .then((json) => {
      if (!cancelled) setData(json);
    })
    .catch((e) => {
      if (!cancelled) setError(e);
    })
    .finally(() => {
      if (!cancelled) setLoading(false);
    });
  return () => {
    cancelled = true;
  };
}, []);`,
        },
      ],
    },
    {
      title: {
        en: "Understanding HTTP requests (~3m 02s)",
        np: "HTTP अनुरोध (~३m ०२s)",
        jp: "HTTP リクエストの理解（約 3m02s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`GET` reads resources; `POST` creates; `PUT`/`PATCH` update; `DELETE` removes. `fetch` defaults to GET. Set `method`, `headers` (e.g. `Content-Type: application/json`), and `body: JSON.stringify(...)` for writes.",
            np: "GET पढ्नु; POST बनाउनु; PUT/PATCH अद्यावधिक; DELETE हटाउनु। `Content-Type` + `JSON.stringify`।",
            jp: "`GET` は取得、`POST` は作成、`PUT`/`PATCH` は更新、`DELETE` は削除です。`fetch` の第2引数で `method`・`headers`・`body`（`JSON.stringify`）を渡します。",
          },
        },
      ],
    },
    {
      title: {
        en: "Handling errors (~2m 03s)",
        np: "त्रुटि व्यवस्थापन (~२m ०३s)",
        jp: "エラー処理（約 2m03s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Network failures reject the promise. HTTP error statuses (4xx/5xx) still resolve `fetch` — check `response.ok` or `response.status` and `throw` or branch to your error state. Parse `response.json()` carefully for API error bodies.",
            np: "network → reject। 4xx/5x मा `response.ok` जाँच।",
            jp: "ネットワーク障害は reject しますが、`fetch` は 4xx/5xx でも resolve するので `response.ok` や `status` を確認します。API のエラーボディは `json()` で読み取ります。",
          },
        },
      ],
    },
    {
      title: {
        en: "Working with async and await (~4m 21s)",
        np: "async/await (~४m २१s)",
        jp: "async と await（約 4m21s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Mark the effect callback `async` only if you keep `try`/`catch`/`finally` readable — some teams prefer an inner async IIFE so the effect callback itself stays synchronous and cleanup stays obvious.",
            np: "`async` effect वा भित्र async IIFE + `try/catch`।",
            jp: "effect を `async` にするか、中で `(async () => { try { ... } catch ... })()` にするかは好みです。`try`/`catch`/`finally` で読みやすく保ちます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Cancelling a fetch request (~2m 27s)",
        np: "fetch रद्द (~२m २७s)",
        jp: "fetch のキャンセル（約 2m27s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Use `AbortController`: pass `{ signal: controller.signal }` to `fetch`, then call `controller.abort()` in cleanup when deps change or the component unmounts. Handle `AbortError` in `catch` if you do not want it treated as a user-visible failure.",
            np: "`AbortController` + `signal`; cleanup मा `abort()`। `AbortError`।",
            jp: "`AbortController` の `signal` を `fetch` に渡し、クリーンアップで `abort()` します。`AbortError` は意図したキャンセルとして扱い分けます。",
          },
        },
        {
          type: "code",
          title: {
            en: "AbortController in useEffect",
            np: "AbortController",
            jp: "AbortController の例",
          },
          code: `useEffect(() => {
  const ctrl = new AbortController();
  fetch(\"/api/user\", { signal: ctrl.signal })
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    })
    .then(setUser)
    .catch((e) => {
      if (e.name === \"AbortError\") return;
      setErr(e);
    });
  return () => ctrl.abort();
}, []);`,
        },
      ],
    },
    {
      title: {
        en: "Showing a loading indicator (~3m 02s)",
        np: "लोडिङ सूचक (~३m ०२s)",
        jp: "ローディング表示（約 3m02s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Drive UI from `loading`: skeletons, spinners, or disabled controls. Pair with `aria-busy=\"true\"` on the region that is updating when it helps assistive tech.",
            np: "`loading` — spinner/skeleton। `aria-busy`।",
            jp: "`loading` が true の間はスピナーやスケルトンを出します。更新領域に `aria-busy=\"true\"` を付けるとアクセシビリティに役立ちます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Deleting data (~5m 50s)",
        np: "डाटा मेटाउने (~५m ५०s)",
        jp: "データの削除（約 5m50s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Call `fetch(url, { method: \"DELETE\" })` (or REST conventions your API uses). On success, remove the item from local state immutably (filter/map) or invalidate a cache if you use one.",
            np: "`DELETE`; सफल भए immutable ले state बाट हटाउनु।",
            jp: "`method: \"DELETE\"` で削除します。成功したら フィルタなどでリスト状態をイミュータブルに更新します。",
          },
        },
      ],
    },
    {
      title: {
        en: "Creating data (~5m 09s)",
        np: "डाटा सिर्जना (~५m ०९s)",
        jp: "データの作成（約 5m09s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`POST` with `JSON.stringify` body; read `201` / `200` per API contract. Append the returned entity (with server id) to your list or navigate to a detail view.",
            np: "POST + body; server id सहित सूचीमा थप्नु।",
            jp: "`POST` と `body` で作成し、レスポンスの id を使って一覧に追加するか、詳細へ遷移します。",
          },
        },
      ],
    },
    {
      title: {
        en: "Updating data (~5m 25s)",
        np: "डाटा अद्यावधिक (~५m २५s)",
        jp: "データの更新（約 5m25s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`PUT` (replace) vs `PATCH` (partial) — follow your backend. Merge the response into state with `map` so the edited row stays stable for `key`.",
            np: "PUT/PATCH — API अनुसार; `map` ले state merge।",
            jp: "`PUT` と `PATCH` は API 仕様に合わせます。返却オブジェクトで `map` により該当行だけ差し替えます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Extracting a reusable API client (~3m 55s)",
        np: "पुन: प्रयोग API client (~३m ५५s)",
        jp: "再利用可能な API クライアント（約 3m55s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Centralize `baseURL`, default headers, and JSON helpers in one module so components stay thin. You can wrap `fetch` or adopt axios later — the boundary is the same: one place for cross-cutting concerns.",
            np: "`baseURL`, headers, JSON — एक मोड्युल।",
            jp: "`baseURL`・共通 headers・JSON の読み書きを一つのモジュールにまとめ、コンポーネントを薄く保ちます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Extracting the user service (~8m 22s)",
        np: "User service (~८m २२s)",
        jp: "ユーザーサービスの切り出し（約 8m22s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A user service exposes `getUsers`, `createUser`, etc., calling your HTTP helper. This keeps resource-shaped functions out of React components and makes testing and mocking easier.",
            np: "userService — `getUsers` आदि; परीक्षण र mock सजिलो।",
            jp: "`getUsers` などリソース単位の関数を `userService` に置き、コンポーネントは「いつ呼ぶか」に集中します。テストとモックがしやすくなります。",
          },
        },
      ],
    },
    {
      title: {
        en: "Creating a generic HTTP service (~8m 00s)",
        np: "सामान्य HTTP सेवा (~८m ००s)",
        jp: "汎用 HTTP サービス（約 8m00s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Implement `get`, `post`, `put`, `patch`, `delete` once, each taking path, optional body, and optional `signal`. Domain services call into this layer so cancellation and error normalization stay consistent.",
            np: "get/post/... एक पटक; `signal` पास।",
            jp: "`get`/`post`/… を一か所に実装し、`signal` を透過させます。ドメインサービスはここを経由してキャンセルとエラー形式を揃えます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Creating a custom data fetching hook (~3m 53s)",
        np: "अनुकूल data-fetching hook (~३m ५३s)",
        jp: "データ取得用カスタムフック（約 3m53s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A hook like `useUsers()` encapsulates effect + state + abort and returns `{ data, error, loading, refetch }`. Call it from multiple components without duplicating effect logic — mind stale closures if you expose callbacks.",
            np: "`useUsers` — effect + state + abort; `refetch`।",
            jp: "`useUsers` のように effect・状態・中止をまとめ、`{ data, error, loading, refetch }` を返します。複数コンポーネントでロジックの重複を避けられます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Summary",
        np: "सारांश",
        jp: "まとめ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "You now tie async work to the React lifecycle with `useEffect`, manage dependencies and cleanup, handle HTTP and errors, cancel safely, show loading, perform CRUD, and structure networking behind a thin HTTP layer, resource services, and hooks.",
            np: "useEffect + HTTP + abort + CRUD + service/hook संरचना।",
            jp: "`useEffect`・依存とクリーンアップ・HTTP/エラー・キャンセル・ローディング・CRUD・HTTP 層・サービス・フックという整理ができる状態になっています。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why not call `fetch` directly in the component body?",
        np: "`fetch` render मा किन होइन?",
        jp: "レンダー本体で `fetch` してはダメ？",
      },
      answer: {
        en: "The body runs on every render, which would spam the network and race updates. `useEffect` (or an event handler for user-initiated loads) scopes work to intentional moments.",
        np: "body हरेक render — network spam। useEffect वा event मा।",
        jp: "コンポーネント関数本体は毎レンダー走るため、そこで `fetch` すると無制限にリクエストが出ます。`useEffect` やユーザー操作に紐づけます。",
      },
    },
    {
      question: {
        en: "What belongs in the dependency array?",
        np: "dependency array मा के राख्ने?",
        jp: "依存配列には何を入れる？",
      },
      answer: {
        en: "Every reactive value from component scope that the effect reads (`props`, `state`, derived values) should usually be listed so the effect stays in sync. ESLint `react-hooks/exhaustive-deps` helps — fix warnings intentionally, not with blind eslint-disable.",
        np: "effect ले पढेका props/state। eslint exhaustive-deps।",
        jp: "effect 内で読む props・state などは原則列挙します。`exhaustive-deps` の警告は意図を持って直します。",
      },
    },
    {
      question: {
        en: "Is an ignore flag as good as AbortController?",
        np: "ignore flag = AbortController?",
        jp: "無視フラグは AbortController と同じ？",
      },
      answer: {
        en: "A `cancelled` flag prevents stale setState after unmount but does not stop the download. `AbortController` actually cancels the request and frees bandwidth; prefer it for large payloads.",
        np: "flag ले setState रोक्छ, download होइन। Abort ठूलो payload मा राम्रो।",
        jp: "フラグは古いレスポンスでの setState を防ぐだけで、通信は止まりません。`AbortController` はリクエスト自体を打ち切れます。",
      },
    },
    {
      question: {
        en: "Should I use `useEffect` or React Query / SWR for server state?",
        np: "`useEffect` वा React Query?",
        jp: "`useEffect` と React Query / SWR はどう使い分ける？",
      },
      answer: {
        en: "This course teaches raw effects so you understand the platform. Libraries add caching, deduping, retries, and background refetch — adopt them when your manual state gets unwieldy.",
        np: "पाठ raw effect। library मा cache/dedupe/retry।",
        jp: "教材では素の `useEffect` で仕組みを理解します。キャッシュ・重複排除・再取得が必要になったら React Query / SWR などを検討します。",
      },
    },
    {
      question: {
        en: "Where do I put the API base URL?",
        np: "baseURL कहाँ?",
        jp: "API のベース URL はどこに書く？",
      },
      answer: {
        en: "Use environment variables (e.g. `NEXT_PUBLIC_...` in Next) injected at build time, read in your HTTP client module — never hardcode secrets in the client bundle.",
        np: "env vars (जस्तै Next `NEXT_PUBLIC_`); secret client मा होइन।",
        jp: "環境変数（Next なら `NEXT_PUBLIC_` など）をビルド時に読み、HTTP クライアントで使います。秘密鍵はクライアントに埋め込まないでください。",
      },
    },
    {
      question: {
        en: "Why split userService from httpService?",
        np: "userService र httpService किन अलग?",
        jp: "userService と httpService を分ける理由は？",
      },
      answer: {
        en: "`httpService` is transport (verbs, headers, errors). `userService` is domain (URLs and shapes for users). That split keeps HTTP policy consistent while resource modules stay readable.",
        np: "http = transport; user = domain URL/shape।",
        jp: "`httpService` は通信の作法、`userService` はユーザーの URL とデータ形です。責務が分かれて保守しやすくなります。",
      },
    },
    {
      question: {
        en: "What if my effect needs the latest callback without listing it in deps?",
        np: "callback deps बिना नयाँ?",
        jp: "依存にコールバックを入れたくないときは？",
      },
      answer: {
        en: "Prefer `useCallback` with correct deps, or the ref pattern (`useRef` holding the latest fn) for stable subscriptions. Avoid `useEffect(fn, [])` that closes over stale props — that is a real bug class.",
        np: "`useCallback` वा ref pattern। stale closure बचाउनु।",
        jp: "`useCallback` で依存を整えるか、ref に最新の関数を入れるパターンがあります。`[]` の effect が古い props を閉じ込めるのは典型的なバグです。",
      },
    },
    {
      question: {
        en: "How do I test components that fetch?",
        np: "fetch भएको component परीक्षण?",
        jp: "fetch するコンポーネントのテストは？",
      },
      answer: {
        en: "Mock `fetch` globally, inject a fake client, or test hooks in isolation with `@testing-library/react`’s `renderHook`. Assert loading → success/error transitions.",
        np: "mock fetch वा fake client; renderHook; loading→success।",
        jp: "`fetch` をモックするか、フェイクの API モジュールを差し替えます。`renderHook` でフック単体を検証し、loading → 成功/失敗を見ます。",
      },
    },
  ],
  bullets: [
    {
      en: "Build a read-only screen: `useEffect`, `[]`, `fetch`, `response.ok`, and `loading`/`error`/`data` state.",
      np: "पढ्ने स्क्रिन: effect, `[]`, fetch, `ok`, state।",
      jp: "読み取り専用画面を `useEffect` + `[]` + `fetch` + `ok` チェック + 三状態 で作る。",
    },
    {
      en: "Add `AbortController` cleanup; verify navigating away mid-request does not surface a scary error toast.",
      np: "AbortController; navigate गर्दा त्रुटि toast छैन भनी जाँच।",
      jp: "`AbortController` のクリーンアップを入れ、画面遷移中のキャンセルで余計なエラー表示が出ないか確かめる。",
    },
    {
      en: "Refactor to `httpService` + `userService` + `useUsers` (or equivalent) so your component only composes UI.",
      np: "http + user + hook refactor; UI मात्र component मा।",
      jp: "`httpService`・`userService`・カスタムフックに分け、コンポーネントは UI のみにする。",
    },
  ],
};
