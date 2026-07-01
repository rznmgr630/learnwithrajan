import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_8_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Real apps need to talk to servers — fetching user data, loading posts, submitting orders. React's `useEffect` hook runs code <b>after</b> the component renders, making it the right place for network requests, subscriptions, and timers.\n\nAnalogy: `useEffect` is like a receptionist who runs errands after the meeting ends — the meeting (render) happens first, then the receptionist acts. If the meeting is cancelled (component unmounts), the receptionist stops the errand.",
      np: "useEffect component render भएपछि run हुन्छ — data fetch, subscriptions, timers को लागि।",
      jp: "`useEffect` はレンダー後に実行 — データ取得・購読・タイマーに使います。",
    },
    {
      en: "In this day we cover:\n• <b>useEffect</b> — the 3 dependency array patterns and when to use each\n• <b>Loading / error / data states</b> — the three-state async pattern\n• <b>Cleanup</b> — AbortController, event listener removal, timer clearing\n• <b>Axios</b> — cleaner API calls with base URLs and interceptors\n• <b>Full CRUD pattern</b> — a reusable hook for list, create, update, delete",
      np: "useEffect patterns, async states, cleanup, Axios, CRUD hook।",
      jp: "useEffect・非同期状態・クリーンアップ・Axios・CRUD フック。",
    },
  ],
  sections: [
    {
      title: { en: "useEffect — the 3 dependency patterns", np: "useEffect patterns", jp: "useEffect の3パターン" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The dependency array tells React <b>when</b> to re-run the effect:\n• <b>No array</b> — runs after every render (almost never what you want)\n  ↳ Causes infinite loops if the effect updates state\n• <b>Empty array `[]`</b> — runs once after the first render (on mount)\n  ↳ The right pattern for fetching data when the page loads\n• <b>`[dep1, dep2]`</b> — runs whenever any dependency changes\n  ↳ Use when the effect depends on props or state (e.g. re-fetch when `userId` changes)\n\nThe linter rule `react-hooks/exhaustive-deps` enforces that every value used inside the effect is listed in the dependency array — follow it.",
            np: "No array = हर render। [] = एक पटक। [dep] = dep बदलिँदा।",
            jp: "配列なし=毎回、[]= マウント時一回、[dep]=依存変化時。",
          },
        },
        {
          type: "code",
          title: { en: "The 3 useEffect patterns", np: "useEffect 3 patterns", jp: "3つの useEffect パターン" },
          code: `import { useEffect, useState } from "react";

function Demo({ userId }) {
  const [user, setUser] = useState(null);

  // Pattern 1: empty array — fetch once when the component mounts
  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(setSettings);
  }, []);

  // Pattern 2: dependency array — re-fetch whenever userId changes
  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]); // re-runs when userId prop changes

  // Pattern 3: no array — runs after EVERY render (avoid unless you know why)
  useEffect(() => {
    document.title = user?.name ?? "Loading...";
  }); // no array = every render

  return <div>{user?.name}</div>;
}`,
        },
      ],
    },
    {
      title: { en: "Loading, error & data states — the async pattern", np: "Async states", jp: "非同期の3状態パターン" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every async operation has exactly three possible states:\n• <b>Loading</b> — request is in flight; show a spinner\n• <b>Error</b> — request failed; show an error message with a retry option\n• <b>Data</b> — request succeeded; show the content\n\nAnalogy: ordering pizza — you are waiting (loading), the pizza arrives (data), or the delivery failed (error). Good UX shows the user which state they are in at all times.\n\nUse `try/catch/finally` — `finally` always runs and is the right place to `setLoading(false)`, whether the request succeeded or failed.",
            np: "Async 3 states: loading, error, data। try/catch/finally pattern।",
            jp: "非同期の3状態：ローディング・エラー・データ。try/catch/finally。",
          },
        },
        {
          type: "code",
          title: { en: "Full loading / error / data pattern", np: "Async state pattern", jp: "非同期状態パターン" },
          code: `import { useEffect, useState } from "react";

function PostsList() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json();
      })
      .then(data => setPosts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error)   return <p>Error: {error} <button onClick={() => window.location.reload()}>Retry</button></p>;

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}`,
        },
      ],
    },
    {
      title: { en: "Cleanup — preventing memory leaks", np: "useEffect cleanup", jp: "クリーンアップ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A cleanup function runs when the component <b>unmounts</b> or before the effect runs again. It is the `return` value of your effect.\n\nAnalogy: cleanup is like turning off the stove when you leave the kitchen — if you do not, bad things happen while nobody is watching.\n\nThree things that always need cleanup:\n• <b>Fetch requests</b> — use `AbortController` to cancel in-flight requests when the component unmounts\n  ↳ Without this, the `setState` call fires after unmount and React logs a warning\n• <b>Event listeners</b> — always call `removeEventListener` with the same function reference\n• <b>Timers</b> — always call `clearTimeout` or `clearInterval`",
            np: "Cleanup: AbortController, removeEventListener, clearTimeout।",
            jp: "クリーンアップ：AbortController・リスナー削除・タイマークリア。",
          },
        },
        {
          type: "code",
          title: { en: "Cleanup examples — fetch, listeners & timers", np: "Cleanup examples", jp: "クリーンアップ例" },
          code: `import { useEffect, useState } from "react";

// 1. AbortController — cancel fetch on unmount
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(r => r.json())
      .then(setUser)
      .catch(err => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort(); // fires on unmount or before next run
  }, [userId]);

  return <div>{user?.name}</div>;
}

// 2. Event listener cleanup
function WindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    function handleResize() {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // cleanup
  }, []);

  return <p>{size.w} x {size.h}</p>;
}

// 3. Timer cleanup
function Countdown({ seconds }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    const id = setInterval(() => setLeft(n => n - 1), 1000);
    return () => clearInterval(id); // cleanup on unmount
  }, []);

  return <p>{left}s remaining</p>;
}`,
        },
      ],
    },
    {
      title: { en: "Axios — cleaner API calls", np: "Axios", jp: "Axios" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The native `fetch` API is fine but has rough edges — you have to manually check `res.ok`, call `.json()`, and handle every status code. <b>Axios</b> handles these automatically:\n• Throws on non-2xx responses (no need to check `res.ok`)\n• Parses JSON response automatically\n• Lets you create an <b>instance</b> with a base URL — no more repeating the domain on every call\n• <b>Interceptors</b> — middleware for requests/responses; perfect for attaching auth tokens\n\nAnaly: Axios is like a travel agency — you say where you want to go (the URL), and it handles visas, currency, and logistics (auth headers, JSON parsing, error handling).",
            np: "Axios: auto JSON parse, non-2xx error throw, base URL, interceptors।",
            jp: "Axios: JSON 自動解析・非2xxエラー・ベース URL・インターセプター。",
          },
        },
        {
          type: "code",
          title: { en: "Axios instance with auth interceptor", np: "Axios instance", jp: "Axios インスタンスと認証インターセプター" },
          code: `// src/lib/api.js — create once, import everywhere
import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
});

// Attach the auth token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) window.location.href = "/login";
    return Promise.reject(err);
  },
);

// Usage in any component — much cleaner than raw fetch
const { data: posts }   = await api.get("/posts");
const { data: newPost } = await api.post("/posts", { title, body });
await api.put(\`/posts/\${id}\`, { title });
await api.delete(\`/posts/\${id}\`);`,
        },
      ],
    },
    {
      title: { en: "Full CRUD pattern — a reusable API hook", np: "CRUD hook", jp: "CRUD フックパターン" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A clean CRUD pattern separates <b>API logic</b> from <b>component logic</b>. The component does not know about fetch, Axios, or URLs — it just calls functions from a hook and receives state.\n\nThis separation means:\n• The component stays simple and testable\n• The API logic is reusable across multiple components\n• Swapping the API client (fetch → Axios → TanStack Query) requires changing one file\n\nFor production apps, consider <b>TanStack Query</b> (Day 16) which handles caching, background refetching, and optimistic updates automatically.",
            np: "API logic र component logic अलग राख्नुस् — reusable hook।",
            jp: "API ロジックとコンポーネントを分離。カスタムフックで再利用可能に。",
          },
        },
        {
          type: "code",
          title: { en: "usePostsApi — reusable CRUD hook", np: "CRUD hook", jp: "CRUD フック" },
          code: `import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export function usePostsApi() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/posts");
      setPosts(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createPost(body) {
    const { data } = await api.post("/posts", body);
    setPosts(prev => [data, ...prev]); // optimistic local update
  }

  async function updatePost(id, body) {
    const { data } = await api.put(\`/posts/\${id}\`, body);
    setPosts(prev => prev.map(p => p.id === id ? data : p));
  }

  async function deletePost(id) {
    const backup = posts;
    setPosts(prev => prev.filter(p => p.id !== id)); // optimistic remove
    try {
      await api.delete(\`/posts/\${id}\`);
    } catch {
      setPosts(backup); // restore on failure
    }
  }

  return { posts, loading, error, createPost, updatePost, deletePost, refresh: load };
}

// In a component — clean and simple:
function PostsPage() {
  const { posts, loading, error, deletePost } = usePostsApi();
  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;
  return <ul>{posts.map(p => <li key={p.id}>{p.title} <button onClick={() => deletePost(p.id)}>Delete</button></li>)}</ul>;
}`,
        },
      ],
    },
    {
      title: {
        en: "useRef — DOM access and mutable values",
        np: "useRef — DOM access र mutable values",
        jp: "useRef — DOM アクセスと可変値",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useRef` has two distinct use cases:\n• <b>DOM reference</b> — attach to an element with `ref={myRef}` to call imperative methods like `.focus()`, `.scrollIntoView()`, `.play()` — things you cannot do via props\n• <b>Mutable container</b> — store any value that persists across renders but does NOT trigger a re-render when changed\n\nKey difference from `useState`:\n• `setState` → triggers a re-render, value shows on screen\n• `ref.current =` → no re-render, updates silently in the background\n\nAnalogy: `useState` is a whiteboard visible to the whole team — any change triggers a meeting. `useRef` is a sticky note on your desk — you update it without disturbing anyone.\n\n<b>When to use ref over state:</b>\n• Storing DOM nodes, timer IDs, WebSocket instances, or interval references\n• Tracking a previous value for comparison without causing a re-render\n• Values used only inside effects or event handlers — never rendered directly",
            np: "useRef: DOM reference + re-render नगर्ने mutable container। setState = re-render, ref.current = = no re-render।",
            jp: "`useRef` は DOM 参照と再レンダーを起こさない可変コンテナ。`setState` との違いは再レンダーの有無。",
          },
        },
        {
          type: "code",
          title: {
            en: "useRef — DOM ref, mutable container, previous value",
            np: "useRef examples",
            jp: "useRef の使用例",
          },
          code: `import { useRef, useEffect, useState } from 'react';

// 1. DOM ref — focus input on mount
function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="Search..." />;
}

// 2. DOM ref — scroll to bottom of a chat list on new messages
function ChatWindow({ messages }: { messages: string[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="overflow-y-auto h-64">
      {messages.map((m, i) => <p key={i}>{m}</p>)}
      <div ref={bottomRef} />
    </div>
  );
}

// 3. Mutable container — store interval ID without triggering re-render
function Stopwatch() {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => setTime(t => t + 1), 1000);
  };
  const stop = () => {
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
  };

  return (
    <div>
      <p>{time}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}

// 4. Mutable container — track previous value without re-render
function PriceDisplay({ price }: { price: number }) {
  const prevRef = useRef(price);

  useEffect(() => {
    prevRef.current = price; // update AFTER render — this render still shows old value
  }, [price]);

  const diff = price - prevRef.current;
  return (
    <p>
      \${price}
      {diff !== 0 && (
        <span style={{ color: diff > 0 ? 'green' : 'red' }}>
          {diff > 0 ? ' ▲' : ' ▼'} \${Math.abs(diff)}
        </span>
      )}
    </p>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "useLayoutEffect — synchronous DOM measurement",
        np: "useLayoutEffect — sync DOM measurement",
        jp: "useLayoutEffect — 同期 DOM 計測",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useLayoutEffect` has the same signature as `useEffect` but fires <b>synchronously</b> after React commits DOM changes and <b>before</b> the browser paints the screen.\n\nTimeline:\n• <b>useEffect</b>: Render → Commit → Browser paints → Effect runs\n• <b>useLayoutEffect</b>: Render → Commit → Effect runs → Browser paints\n\nAnalogy: `useEffect` is a painter who decorates after the guests arrive — they might see bare walls for a moment. `useLayoutEffect` is a painter who finishes before the doors open — guests see the completed room.\n\n<b>When to use `useLayoutEffect`:</b>\n• Reading DOM geometry (width, height, bounding rect) to position another element\n• Preventing a visual flash when state must be set based on DOM size before first paint\n• Syncing scroll position or animation frames before the user sees the screen\n\n<b>Stick with `useEffect` for:</b>\n• Data fetching\n• Subscriptions, timers, WebSockets\n• Anything that does not read or write DOM dimensions\n\nFor 99% of cases `useEffect` is correct. Use `useLayoutEffect` only when you see a visual flicker that `useEffect` cannot prevent.",
            np: "useLayoutEffect: paint हुनु अगाडि sync run। DOM measure र visual flash रोक्न। 99% cases useEffect नै।",
            jp: "ペイント前に同期実行。DOM 計測やフラッシュ防止に。通常は useEffect で十分。",
          },
        },
        {
          type: "code",
          title: {
            en: "useLayoutEffect — tooltip positioning and flash prevention",
            np: "useLayoutEffect examples",
            jp: "useLayoutEffect の使用例",
          },
          code: `import { useLayoutEffect, useRef, useState } from 'react';

// 1. Tooltip positioning — measure trigger BEFORE paint so tooltip never flashes at wrong position
function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const rect = trigger.getBoundingClientRect();
    const tRect = tooltip.getBoundingClientRect();

    tooltip.style.left = \`\${rect.left + rect.width / 2 - tRect.width / 2}px\`;
    tooltip.style.top  = \`\${rect.top - tRect.height - 8 + window.scrollY}px\`;
    // useEffect here would cause a flash — tooltip appears at (0,0) then jumps
  });

  return (
    <>
      <button ref={triggerRef}>{children}</button>
      <div ref={tooltipRef} style={{ position: 'absolute' }} className="tooltip">
        {text}
      </div>
    </>
  );
}

// 2. Flash prevention — set initial value based on DOM before first paint
function ResizablePanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (panelRef.current) {
      setHeight(panelRef.current.scrollHeight);
      // With useEffect the panel would flash from 0 to full height after paint
    }
  }, []);

  return (
    <div ref={panelRef} style={{ height }} className="overflow-hidden transition-all">
      <p>Content that determines the panel height</p>
    </div>
  );
}

// 3. Auto-scroll chat — read and set scroll BEFORE paint to avoid jitter
function Chat({ messages }: { messages: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
    if (atBottom) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div ref={containerRef} className="overflow-y-auto h-96">
      {messages.map((m, i) => <p key={i}>{m}</p>)}
    </div>
  );
}`,
        },
        {
          type: "table",
          caption: {
            en: "useEffect vs useLayoutEffect",
            np: "useEffect vs useLayoutEffect",
            jp: "useEffect vs useLayoutEffect",
          },
          headers: [
            { en: "Aspect", np: "पक्ष", jp: "観点" },
            { en: "useEffect", np: "useEffect", jp: "useEffect" },
            { en: "useLayoutEffect", np: "useLayoutEffect", jp: "useLayoutEffect" },
          ],
          rows: [
            [
              { en: "Timing", np: "समय", jp: "タイミング" },
              { en: "After browser paint (async)", np: "Browser paint पछि (async)", jp: "ペイント後（非同期）" },
              { en: "Before browser paint (sync)", np: "Browser paint अगाडि (sync)", jp: "ペイント前（同期）" },
            ],
            [
              { en: "Blocks paint?", np: "Paint block?", jp: "ペイントをブロック？" },
              { en: "No", np: "होइन", jp: "しない" },
              { en: "Yes — can cause jank if slow", np: "हो — slow भयो भने jank हुन्छ", jp: "する — 重い処理は jank の原因" },
            ],
            [
              { en: "Use for", np: "प्रयोग", jp: "用途" },
              { en: "Data fetch, subscriptions, timers", np: "Data fetch, subscriptions, timers", jp: "データ取得・購読・タイマー" },
              { en: "DOM measurement, flash prevention", np: "DOM measure, flash रोक्न", jp: "DOM 計測・フラッシュ防止" },
            ],
            [
              { en: "How often", np: "कति पटक", jp: "使用頻度" },
              { en: "99% of cases", np: "99% cases", jp: "99%のケース" },
              { en: "Rare — only when you see a visual flicker", np: "बिरलै — visual flicker देखिँदा मात्र", jp: "まれ — フリッカーが出た時だけ" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "Why can't I use async directly in useEffect?", np: "useEffect मा async direct किन नहुने?", jp: "useEffect に async を直接書けない理由は？" },
      answer: {
        en: "useEffect expects either nothing or a cleanup function as the return value. An async function returns a Promise, not undefined or a function — React would try to call the Promise as a cleanup function and fail silently. Wrap your async code in an inner named function and call it immediately: `useEffect(() => { async function load() { ... } load(); }, []);`",
        np: "async function Promise return गर्छ — useEffect cleanup function expect गर्छ। Inner function बनाएर call गर्नुस्।",
        jp: "async 関数は Promise を返しますが useEffect はクリーンアップ関数を期待するため。内部 async 関数をすぐ呼ぶ形で対応します。",
      },
    },
    {
      question: { en: "What is the difference between useEffect and useLayoutEffect?", np: "useEffect र useLayoutEffect फरक?", jp: "useEffect と useLayoutEffect の違いは？" },
      answer: {
        en: "`useEffect` fires after the browser has painted the screen — it is asynchronous and does not block rendering. `useLayoutEffect` fires synchronously after the DOM is updated but before the browser paints — use it when you need to measure DOM nodes or prevent a visual flash (e.g. reading and setting an element's scroll position). For 99% of cases, `useEffect` is correct.",
        np: "useEffect: paint पछि async। useLayoutEffect: paint अगाडि sync — DOM measure गर्न।",
        jp: "useEffect はペイント後・非同期。useLayoutEffect はペイント前・同期。DOM 計測時に使います。",
      },
    },
    {
      question: { en: "How do I fetch data once vs every time a prop changes?", np: "एक पटक vs prop बदलिँदा fetch?", jp: "一度だけ vs props 変化ごとにfetchする方法は？" },
      answer: {
        en: "Once: `useEffect(() => { fetch(...) }, [])` — the empty array means it only runs on mount. Every time a prop changes: `useEffect(() => { fetch(...) }, [userId])` — add the prop to the dependency array. The effect re-runs whenever `userId` changes.",
        np: "[] = एक पटक mount मा। [userId] = userId बदलिँदा।",
        jp: "[]= マウント時一回。[userId]=userId 変化ごと。",
      },
    },
    {
      question: { en: "What is SWR and how does it differ from useEffect?", np: "SWR र useEffect फरक?", jp: "SWR と useEffect の違いは？" },
      answer: {
        en: "SWR (Stale-While-Revalidate) is a data fetching library by Vercel. Like TanStack Query, it abstracts over useEffect for data fetching — adding caching, background revalidation, deduplication, and optimistic updates. `useEffect` is manual plumbing; SWR and TanStack Query are higher-level abstractions built on top of that plumbing.",
        np: "SWR = data fetching library (caching, revalidation)। useEffect = manual approach।",
        jp: "SWR は useEffect 上のキャッシュ・再検証付き抽象化ライブラリです。",
      },
    },
    {
      question: { en: "Should I use TanStack Query instead of useEffect for fetching?", np: "Data fetch मा TanStack Query वा useEffect?", jp: "データ取得に TanStack Query を使うべき？" },
      answer: {
        en: "For most production apps: yes. TanStack Query (covered in Day 16) handles caching, deduplication (same URL requested from 5 components only fires 1 request), background refetching, stale-time, retry logic, and optimistic updates — all things you would otherwise build manually with useEffect. Use useEffect for non-data effects (subscriptions, timers, DOM manipulation) and TanStack Query for server data.",
        np: "Production app मा TanStack Query राम्रो — caching, deduplication, retry automatic।",
        jp: "本番アプリでは TanStack Query が優れています。キャッシュ・重複排除・リトライが自動です。",
      },
    },
  ],
};
