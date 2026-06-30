import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_17_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Authentication is the gatekeeper of your app — it verifies who the user is. In a React SPA, authentication involves: storing a token after login, attaching that token to every API request, and controlling which pages require a logged-in user.\n\nAnalogy: authentication is like a nightclub:\n• The <b>bouncer</b> (login form) checks your ID (credentials)\n• The <b>wristband</b> (JWT token) proves you've been verified\n• <b>Security at each area</b> (protected route) checks the wristband before letting you in\n• The <b>wristband expires</b> after a while (token expiry) — you must renew it",
      np: "Authentication = app को gatekeeper। Token store, API headers, protected routes build गर्छौं।",
      jp: "認証はアプリの門番。ログイン後のトークン保存・APIヘッダー付与・保護ルートを実装します。",
    },
    {
      en: "In this day we build a complete authentication flow:\n\n<b>What we cover</b>\n• JWT basics and where to store tokens (`localStorage` vs `httpOnly` cookies)\n• Building an `AuthContext` + `useAuth()` custom hook\n• Axios request interceptors — attach tokens automatically to every request\n• Protected routes that redirect unauthenticated users to login\n• Refresh tokens — staying logged in without re-entering credentials",
      np: "JWT storage, AuthContext, Axios interceptors, protected routes, refresh tokens।",
      jp: "JWTストレージ・AuthContext・Axiosインターセプター・保護ルート・リフレッシュトークン。",
    },
  ],
  sections: [
    {
      title: {
        en: "Token storage — localStorage vs httpOnly cookies",
        np: "Token storage — localStorage vs cookies",
        jp: "トークン保存 — localStorage vs Cookie",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "After a successful login, the server sends back a token. Where you store it matters for security.\n\n• <b>`localStorage`</b> — easy to use, survives page refresh, readable by any JavaScript on the page\n  ↳ Risk: XSS attacks can steal it if an attacker injects malicious JS\n• <b>`sessionStorage`</b> — same as localStorage but cleared when the tab closes\n  ↳ Good for sensitive sessions, but users get logged out on every tab close\n• <b>`httpOnly` cookie</b> — browser stores it, sends it automatically, JavaScript cannot read it\n  ↳ Best XSS protection, but requires careful CORS and CSRF configuration",
            np: "localStorage: easy तर XSS vulnerable। httpOnly cookie: XSS-safe तर CORS setup चाहिन्छ।",
            jp: "localStorage は簡単だが XSS リスク。httpOnly Cookie は安全だが CORS 設定が必要。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Token storage trade-offs — choose based on your security requirements",
            np: "Token storage trade-offs",
            jp: "トークン保存の比較",
          },
          headers: [
            { en: "Storage", np: "Storage", jp: "保存場所" },
            { en: "XSS safe?", np: "XSS safe?", jp: "XSS安全?" },
            { en: "CSRF risk?", np: "CSRF risk?", jp: "CSRFリスク?" },
            { en: "Survives refresh?", np: "Refresh survive?", jp: "更新後も保持?" },
            { en: "Best for", np: "Best for", jp: "適したケース" },
          ],
          rows: [
            [
              { en: "`localStorage`", np: "`localStorage`", jp: "`localStorage`" },
              { en: "No", np: "No", jp: "いいえ" },
              { en: "No", np: "No", jp: "なし" },
              { en: "Yes", np: "Yes", jp: "はい" },
              { en: "Learning / low-risk apps", np: "Learning apps", jp: "学習・低リスク" },
            ],
            [
              { en: "`sessionStorage`", np: "`sessionStorage`", jp: "`sessionStorage`" },
              { en: "No", np: "No", jp: "いいえ" },
              { en: "No", np: "No", jp: "なし" },
              { en: "Tab only", np: "Tab only", jp: "タブのみ" },
              { en: "Short-lived sensitive sessions", np: "Short sessions", jp: "短期セッション" },
            ],
            [
              { en: "`httpOnly` cookie", np: "`httpOnly` cookie", jp: "`httpOnly` Cookie" },
              { en: "Yes", np: "Yes", jp: "はい" },
              { en: "Yes (need CSRF token)", np: "Yes", jp: "あり(CSRF必要)" },
              { en: "Yes", np: "Yes", jp: "はい" },
              { en: "Production / high-security apps", np: "Production apps", jp: "本番・高セキュリティ" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Building an AuthContext",
        np: "AuthContext बनाउने",
        jp: "AuthContext の構築",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "An `AuthContext` centralizes all authentication state and logic in one place. Every component that needs to know \"is the user logged in?\" or \"who is the user?\" calls `useAuth()` instead of drilling props through the tree.\n\n• <b>AuthContext</b> holds: current user, token, loading state\n• <b>AuthProvider</b> wraps the app and provides the context value\n• <b>`useAuth()`</b> is the custom hook consumers call — clean and typed",
            np: "AuthContext मा user, token, loading state। useAuth() hook ले consume गर्छ।",
            jp: "AuthContext にユーザー・トークン・ローディング状態を集中管理。useAuth() で消費。",
          },
        },
        {
          type: "code",
          title: { en: "auth-context.tsx — complete auth context", np: "auth-context.tsx", jp: "auth-context.tsx" },
          code: `import { createContext, useContext, useState, useEffect } from "react";
import { api } from "./api"; // your axios instance

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true while checking localStorage

  // Rehydrate from localStorage on page load
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("access_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}`,
        },
      ],
    },
    {
      title: {
        en: "Axios interceptors — automatic auth headers",
        np: "Axios interceptors",
        jp: "Axios インターセプター",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "An Axios interceptor is like a mail room worker who stamps every outgoing letter with the company letterhead — you don't add it manually to every request, it happens automatically.\n\n• <b>Request interceptor</b> — runs before every request leaves your app, adds the token\n  ↳ Always reads the latest token from localStorage, so it works after a token refresh\n• <b>Response interceptor</b> — runs after every response arrives, handles 401 errors\n  ↳ Can automatically redirect to login or trigger a token refresh",
            np: "Request interceptor: token header add गर्छ। Response interceptor: 401 handle गर्छ।",
            jp: "リクエストインターセプターでトークン付与。レスポンスインターセプターで401処理。",
          },
        },
        {
          type: "code",
          title: { en: "api.ts — Axios instance with interceptors", np: "api.ts", jp: "api.ts" },
          code: `import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
});

// REQUEST interceptor — attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// RESPONSE interceptor — handle 401 (token expired)
api.interceptors.response.use(
  (response) => response, // pass through successful responses
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);`,
        },
      ],
    },
    {
      title: {
        en: "Protected routes with auth state",
        np: "Protected routes",
        jp: "保護ルート",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A protected route checks if the user is authenticated before showing the page. If not, it redirects to the login page. The key challenge is the <b>loading flash</b> — on page load, before we've checked localStorage, `isAuthenticated` is false, which would incorrectly redirect an already-logged-in user.\n\nSolution: show a loading spinner while `isLoading` is true.",
            np: "Protected route ले isAuthenticated check गर्छ। isLoading true छ भने spinner देखाउनुस्।",
            jp: "isLoading 中はスピナーを表示。isAuthenticated でリダイレクト判定。",
          },
        },
        {
          type: "code",
          title: { en: "PrivateRoute.tsx + App.tsx wiring", np: "PrivateRoute.tsx", jp: "PrivateRoute.tsx" },
          code: `// PrivateRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Save the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// App.tsx — wrap protected routes
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// LoginPage.tsx — redirect back after login
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/dashboard";

  async function handleSubmit(data: { email: string; password: string }) {
    await login(data.email, data.password);
    navigate(from, { replace: true }); // go back to where they came from
  }
}`,
        },
      ],
    },
    {
      title: {
        en: "Refresh tokens — staying logged in",
        np: "Refresh tokens",
        jp: "リフレッシュトークン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Short-lived access tokens (15 minutes) limit damage if stolen. Long-lived refresh tokens (7 days) let users stay logged in. The flow:\n\n1. Login returns both: `access_token` (short) + `refresh_token` (long)\n2. API calls use the `access_token`\n3. When `access_token` expires → 401 response\n4. Interceptor catches the 401 → calls `/auth/refresh` with `refresh_token`\n5. Server returns a new `access_token`\n6. Interceptor retries the original request with the new token\n\n↳ The user never sees an error — the token swap is invisible",
            np: "Access token (15 min) + refresh token (7 days)। Interceptor ले auto-refresh गर्छ।",
            jp: "短命アクセストークン＋長命リフレッシュトークン。インターセプターが自動更新。",
          },
        },
        {
          type: "code",
          title: { en: "Refresh token interceptor", np: "Refresh interceptor", jp: "リフレッシュインターセプター" },
          code: `// Enhanced response interceptor with token refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = \`Bearer \${token}\`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const { data } = await axios.post("/auth/refresh", { refreshToken });

        localStorage.setItem("access_token", data.access_token);

        // Retry all queued requests with new token
        failedQueue.forEach(({ resolve }) => resolve(data.access_token));
        failedQueue = [];

        originalRequest.headers.Authorization = \`Bearer \${data.access_token}\`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — log out
        failedQueue.forEach(({ reject }) => reject(refreshError));
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);`,
        },
        {
          type: "paragraph",
          text: {
            en: "The `isRefreshing` flag prevents a race condition: if 3 API calls fail at the same time with 401, only one refresh request is sent. The other 2 are queued and retried once the new token arrives.\n\n• <b>Refresh token rotation</b> — each refresh call invalidates the old refresh token and issues a new one. Prevents replay attacks.\n• <b>Logout everywhere</b> — when a user logs out on one device, invalidate all refresh tokens on the server.",
            np: "isRefreshing flag ले race condition prevent गर्छ। Rotation + logout-everywhere।",
            jp: "isRefreshing で競合防止。ローテーション + 全デバイスログアウト。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Is it safe to store JWT in localStorage?",
        np: "localStorage मा JWT राख्नु safe छ?",
        jp: "localStorage に JWT を保存しても安全？",
      },
      answer: {
        en: "It depends on your XSS exposure. If your app has no XSS vulnerabilities, localStorage is fine. For apps handling sensitive data (banking, health), use httpOnly cookies which JavaScript cannot read. The practical rule: most SPAs use localStorage; high-security apps use httpOnly cookies.",
        np: "XSS exposure मा depend। Sensitive apps मा httpOnly cookies प्रयोग गर्नुस्।",
        jp: "XSS リスク次第。高セキュリティアプリは httpOnly Cookie を使う。",
      },
    },
    {
      question: {
        en: "What is the difference between JWT and sessions?",
        np: "JWT र sessions मा के फरक?",
        jp: "JWT とセッションの違いは？",
      },
      answer: {
        en: "Sessions store auth state on the server (a session ID maps to user data in a database/Redis). JWT is stateless — the token itself contains the user data, signed by the server. Sessions are easier to invalidate (delete the record); JWT invalidation requires a token blacklist or short expiry + refresh tokens.",
        np: "Session: server-side। JWT: stateless, token मा data। JWT revocation गाह्रो।",
        jp: "セッションはサーバー側。JWTはステートレスでトークン自体にデータを含む。",
      },
    },
    {
      question: {
        en: "How do I handle 'remember me' functionality?",
        np: "'Remember me' कसरी handle गर्ने?",
        jp: "「ログインを保持」はどう実装？",
      },
      answer: {
        en: "Issue a longer-lived refresh token (30 days instead of 7) when the user checks 'remember me'. Store in localStorage (persists after browser close) instead of sessionStorage. On the server, differentiate token TTLs by the remember_me flag in the login request.",
        np: "Remember me: longer refresh token (30 days)। localStorage store गर्नुस्।",
        jp: "「記憶する」: リフレッシュトークンを 30 日に延長し localStorage に保存。",
      },
    },
    {
      question: {
        en: "What happens when the access token expires mid-request?",
        np: "Request बीचमा token expire भयो भने?",
        jp: "リクエスト中にアクセストークンが期限切れになったら？",
      },
      answer: {
        en: "The server returns 401. The Axios response interceptor catches it, silently calls the refresh endpoint, gets a new access token, then retries the original request — all without the user seeing an error. This is the refresh token interceptor pattern shown in Section 5.",
        np: "401 → interceptor ले refresh call गर्छ → original request retry।",
        jp: "401 → インターセプターがリフレッシュ → 元のリクエストをリトライ。",
      },
    },
    {
      question: {
        en: "How do I test protected routes?",
        np: "Protected routes कसरी test गर्ने?",
        jp: "保護ルートのテスト方法は？",
      },
      answer: {
        en: "Wrap the component in a test with a mock AuthProvider that returns `isAuthenticated: false` and check for a redirect to `/login`. For authenticated tests, return `isAuthenticated: true` with a mock user. Mock the Axios instance with `vi.mock('./api')` to avoid real network calls.",
        np: "Mock AuthProvider साथ test। vi.mock('./api') ले API mock गर्नुस्।",
        jp: "モック AuthProvider でテスト。vi.mock('./api') で API をモック。",
      },
    },
  ],
};
