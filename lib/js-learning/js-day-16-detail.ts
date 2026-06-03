import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_16_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "The Fetch API replaced XMLHttpRequest as the modern way to make HTTP requests from the browser. It returns a Promise and integrates cleanly with `async`/`await`. The Web Storage APIs (`localStorage` and `sessionStorage`) give you simple key-value persistence in the browser without needing a database.",
      np: "Fetch API ले browser बाट HTTP requests गर्ने modern तरिकाको रूपमा XMLHttpRequest replace गर्‍यो। यसले Promise return गर्छ र `async`/`await` सँग clean रूपमा integrate हुन्छ। Web Storage APIs ले database बिना browser मा simple key-value persistence दिन्छ।",
      jp: "Fetch APIはXMLHttpRequestに代わるモダンなHTTPリクエスト手段。Promiseを返しasync/awaitと自然に組み合わせられる。Web Storage APIはDBなしでブラウザにkey-valueデータを保存する。",
    },
    {
      en: "`AbortController` solves a real problem: how do you cancel a `fetch` request that is no longer needed? It is used everywhere — cancelling requests when a user navigates away, debouncing search inputs, implementing request timeouts.",
      np: "`AbortController` ले real problem solve गर्छ: अब जरुरी नभएको `fetch` request कसरी cancel गर्ने? User navigate away गर्दा requests cancel गर्न, search inputs debounce गर्न, request timeouts implement गर्न सर्वत्र use हुन्छ।",
      jp: "`AbortController`は不要になった`fetch`リクエストのキャンセルという実際の問題を解決する。ユーザーが離脱した際のキャンセル・検索入力のデバウンス・タイムアウト実装など至る所で使われる。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "cuEtnrL9-H0", title: "Fetch API — JavaScript Tutorial" },
      ],
    },
    {
      title: { en: "The Fetch API", np: "Fetch API", jp: "Fetch API" },
      blocks: [
        {
          type: "code",
          title: { en: "GET and POST requests with error handling", np: "GET र POST requests with error handling", jp: "GETとPOSTリクエストとエラー処理" },
          code: `// ── Basic GET request ─────────────────────────────────────────────
const response = await fetch("https://api.example.com/users/1");
const user = await response.json();

// ── IMPORTANT: fetch only rejects on NETWORK errors, not HTTP errors
// A 404 or 500 response still resolves — you MUST check response.ok
async function getUser(id) {
  const response = await fetch(\`https://api.example.com/users/\${id}\`);

  if (!response.ok) {
    // response.status: 404, 500, etc.
    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
  }

  return response.json();  // parse JSON body (also returns a Promise)
}

// ── Reading the response body ─────────────────────────────────────
response.json();    // parse as JSON
response.text();    // get raw text
response.blob();    // get binary data (images, files)
response.arrayBuffer(); // raw binary buffer
// You can only read the body ONCE — clone() if you need to read it twice
const clone = response.clone();

// ── POST request with JSON body ───────────────────────────────────
async function createUser(data) {
  const response = await fetch("https://api.example.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": \`Bearer \${token}\`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(\`Failed: \${response.status}\`);
  return response.json();
}

// ── Request options ───────────────────────────────────────────────
fetch(url, {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),       // string, FormData, Blob, ArrayBuffer
  mode: "cors" | "no-cors" | "same-origin",
  credentials: "omit" | "same-origin" | "include",  // send cookies?
  cache: "default" | "no-cache" | "no-store" | "force-cache",
  redirect: "follow" | "error" | "manual",
});`,
        },
      ],
    },
    {
      title: { en: "AbortController — cancelling requests", np: "AbortController — requests cancel गर्नु", jp: "AbortController — リクエストのキャンセル" },
      blocks: [
        {
          type: "code",
          title: { en: "Cancel fetch requests with AbortController", np: "AbortController सँग fetch requests cancel गर्नु", jp: "AbortControllerでfetchをキャンセル" },
          code: `// ── Basic usage ───────────────────────────────────────────────────
const controller = new AbortController();
const { signal } = controller;

// Pass the signal to fetch
fetch("/api/data", { signal })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => {
    if (err.name === "AbortError") {
      console.log("Request was cancelled");
    } else {
      console.error("Fetch error:", err);
    }
  });

// Cancel the request
controller.abort();  // causes the fetch to reject with AbortError

// ── Cancelling when the user navigates away (React pattern) ────────
useEffect(() => {
  const controller = new AbortController();

  async function loadData() {
    try {
      const res = await fetch("/api/data", { signal: controller.signal });
      const data = await res.json();
      setData(data);
    } catch (err) {
      if (err.name !== "AbortError") setError(err);
    }
  }

  loadData();
  return () => controller.abort();  // cancel on component unmount
}, []);

// ── Implementing a fetch timeout with AbortController ──────────────
async function fetchWithTimeout(url, timeoutMs = 5000, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);  // cancel the timeout if fetch succeeds
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error(\`Request timed out after \${timeoutMs}ms\`);
    }
    throw err;
  }
}

// ── Cancelling search input (debounced fetch) ──────────────────────
let searchController = null;

searchInput.addEventListener("input", async (event) => {
  searchController?.abort();  // cancel the previous request
  searchController = new AbortController();

  try {
    const res = await fetch(
      \`/api/search?q=\${event.target.value}\`,
      { signal: searchController.signal }
    );
    const results = await res.json();
    renderResults(results);
  } catch (err) {
    if (err.name !== "AbortError") showError(err);
  }
});`,
        },
      ],
    },
    {
      title: { en: "Web Storage — localStorage and sessionStorage", np: "Web Storage — localStorage र sessionStorage", jp: "Web Storage — localStorageとsessionStorage" },
      blocks: [
        {
          type: "code",
          title: { en: "Storing and reading data in the browser", np: "Browser मा data store र read गर्नु", jp: "ブラウザへのデータ保存と読み取り" },
          code: `// ── localStorage — persists until explicitly cleared ─────────────
localStorage.setItem("theme", "dark");
localStorage.getItem("theme");    // "dark"
localStorage.removeItem("theme");
localStorage.clear();             // remove ALL items

// Keys and values are always strings — use JSON for objects
const user = { name: "Alice", age: 30 };
localStorage.setItem("user", JSON.stringify(user));
const stored = JSON.parse(localStorage.getItem("user") ?? "null");

// Safe helper with type safety:
function getLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;  // JSON.parse failed (corrupted data)
  }
}

function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // QuotaExceededError — storage is full (~5-10MB limit)
    console.error("Storage full:", err);
  }
}

// ── sessionStorage — cleared when the browser tab is closed ────────
sessionStorage.setItem("formData", JSON.stringify({ step: 1, name: "Alice" }));
// Same API as localStorage but scoped to the current tab session

// ── Listening for storage changes across tabs ──────────────────────
window.addEventListener("storage", (event) => {
  // Fires when another tab changes localStorage (not in the same tab)
  console.log("Key changed:", event.key);
  console.log("Old value:", event.oldValue);
  console.log("New value:", event.newValue);
});`,
        },
        {
          type: "table",
          caption: { en: "Choosing between storage options", np: "Storage options छान्नु", jp: "ストレージオプションの選択" },
          headers: [
            { en: "Storage", np: "Storage", jp: "ストレージ" },
            { en: "Capacity", np: "Capacity", jp: "容量" },
            { en: "Lifetime", np: "Lifetime", jp: "有効期間" },
            { en: "Accessible from", np: "Access", jp: "アクセス範囲" },
            { en: "Best for", np: "Best for", jp: "用途" },
          ],
          rows: [
            [
              { en: "localStorage", np: "localStorage", jp: "localStorage" },
              { en: "~5-10 MB", np: "~5-10 MB", jp: "約5-10 MB" },
              { en: "Forever (until cleared)", np: "Cleared नहुन्जेल", jp: "クリアまで永続" },
              { en: "Same origin, all tabs", np: "Same origin, सबै tabs", jp: "同一オリジン・全タブ" },
              { en: "User preferences, theme, auth tokens", np: "Theme, preferences, tokens", jp: "設定・テーマ・認証トークン" },
            ],
            [
              { en: "sessionStorage", np: "sessionStorage", jp: "sessionStorage" },
              { en: "~5-10 MB", np: "~5-10 MB", jp: "約5-10 MB" },
              { en: "Until tab closes", np: "Tab बन्द नहुन्जेल", jp: "タブを閉じるまで" },
              { en: "Same tab only", np: "Same tab मात्र", jp: "同タブのみ" },
              { en: "Multi-step forms, wizard state", np: "Multi-step forms", jp: "複数ステップフォーム・ウィザード" },
            ],
            [
              { en: "Cookies", np: "Cookies", jp: "Cookie" },
              { en: "~4 KB per cookie", np: "~4 KB", jp: "Cookie当たり約4 KB" },
              { en: "Configurable expiry", np: "Configurable", jp: "設定可能な有効期限" },
              { en: "Sent to server with every request", np: "हर request सँग server मा", jp: "全リクエストでサーバーへ送信" },
              { en: "Session IDs, auth (httpOnly for security)", np: "Session, auth (httpOnly)", jp: "セッションID・認証（httpOnlyが安全）" },
            ],
            [
              { en: "IndexedDB", np: "IndexedDB", jp: "IndexedDB" },
              { en: "Hundreds of MB", np: "Hundreds of MB", jp: "数百MB以上" },
              { en: "Forever (until cleared)", np: "Cleared नहुन्जेल", jp: "クリアまで永続" },
              { en: "Same origin", np: "Same origin", jp: "同一オリジン" },
              { en: "Large data, offline apps, structured querying", np: "Large data, offline apps", jp: "大容量データ・オフラインアプリ" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "Why doesn't fetch throw on a 404 or 500 error?", np: "Fetch ले 404 वा 500 error मा throw किन गर्दैन?", jp: "fetchが404や500でthrowしない理由は？" },
      answer: {
        en: "Fetch considers a request successful as long as the HTTP transaction completed — meaning the server responded, even if it said 'not found' or 'server error'. Fetch only rejects (throws) when there is a network-level failure: the user is offline, the DNS lookup failed, a CORS policy blocked the request, or the request was aborted. Always check `response.ok` (which is `true` for status codes 200-299) after every fetch call.",
        np: "Fetch ले HTTP transaction complete भएकोलाई successful मान्छ — server ले respond गरेमा, 'not found' वा 'server error' भने पनि। Network-level failure मा मात्र reject गर्छ: offline, DNS failure, CORS block, वा abort। हर fetch पछि `response.ok` check गर्नुहोस्।",
        jp: "fetchはHTTPトランザクションが完了した（サーバーが応答した）場合を成功とみなす。404や500でも。rejectするのはネットワーク障害時のみ（オフライン・DNS失敗・CORS・abort）。必ず`response.ok`（200-299で`true`）を確認する。",
      },
    },
    {
      question: { en: "Is it safe to store auth tokens in localStorage?", np: "Auth tokens localStorage मा store गर्नु safe छ?", jp: "認証トークンをlocalStorageに保存するのは安全か？" },
      answer: {
        en: "localStorage is vulnerable to XSS attacks — any injected JavaScript can read `localStorage.getItem('token')`. For access tokens with short TTLs (15 minutes), the risk is often acceptable. For sensitive long-lived tokens, prefer `httpOnly` cookies (JavaScript cannot access them at all). The most secure pattern: store the refresh token in an `httpOnly` cookie, store the short-lived access token in memory (a JavaScript variable), and refresh it on page load.",
        np: "localStorage XSS attacks मा vulnerable छ — injected JavaScript ले token read गर्न सक्छ। Short TTL (15 min) access tokens मा risk acceptable हुन सक्छ। Sensitive long-lived tokens का लागि `httpOnly` cookies prefer गर्नुहोस्। Most secure: refresh token `httpOnly` cookie मा, access token memory मा।",
        jp: "localStorageはXSS脆弱性がある — 注入されたJSがトークンを読める。短いTTL(15分)のアクセストークンなら許容できることも。重要な長期トークンには`httpOnly`Cookie（JSからアクセス不可）を使う。最も安全: リフレッシュトークンはhttpOnlyCookie、アクセストークンはメモリ（JS変数）に。",
      },
    },
  ],
};
