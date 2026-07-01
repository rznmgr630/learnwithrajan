import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_18_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "TanStack Query (formerly React Query) is more than just a data fetcher — it's a complete server state synchronization library. Day 16 covered the basics (`useQuery`). Today we go deeper.\n\nAnalogy: Day 16 taught you how to <b>read from the library</b>. Today you learn:\n• How to <b>write notes back</b> (mutations)\n• How to make the UI feel <b>instant</b> even before the server confirms (optimistic updates)\n• How to <b>page through encyclopedias</b> without loading the whole thing (infinite scroll)\n• How to <b>pre-order books before you need them</b> (prefetching)",
      np: "TanStack Query advanced: mutations, optimistic updates, infinite scroll, prefetching।",
      jp: "TanStack Query 応用。ミューテーション・楽観的更新・無限スクロール・プリフェッチ。",
    },
    {
      en: "What we cover today:\n\n• <b>`useMutation`</b> — POST, PUT, DELETE operations with status tracking\n  ↳ `isPending`, `isSuccess`, `isError` states built in\n• <b>Optimistic updates</b> — update the UI before the server responds, roll back on failure\n• <b>`useInfiniteQuery`</b> — paginated / infinite-scroll data loading\n• <b>Prefetching</b> — load data before the user navigates to it\n• <b>Query invalidation strategies</b> — keeping cached data fresh",
      np: "useMutation, optimistic updates, useInfiniteQuery, prefetch, invalidation।",
      jp: "useMutation・楽観的更新・useInfiniteQuery・プリフェッチ・無効化戦略。",
    },
  ],
  sections: [
    {
      title: {
        en: "useMutation — writing data to the server",
        np: "useMutation — data write गर्ने",
        jp: "useMutation — サーバーへの書き込み",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useQuery` reads data. `useMutation` writes it. Use `useMutation` for any operation that changes server state: creating a post, updating a profile, deleting a comment, uploading a file.\n\n• <b>`mutationFn`</b> — the async function that performs the write\n• <b>`onSuccess`</b> — runs after a successful mutation (update cache, show toast)\n• <b>`onError`</b> — runs on failure (show error message, log)\n• <b>`onSettled`</b> — runs after either success or failure (like `finally`)\n• Call with `mutation.mutate(data)` or `await mutation.mutateAsync(data)`",
            np: "useMutation: mutationFn, onSuccess, onError, onSettled। mutate() ले call गर्छ।",
            jp: "useMutation: mutationFn・onSuccess・onError。mutate() または mutateAsync() で呼び出す。",
          },
        },
        {
          type: "code",
          title: { en: "useMutation — create, update, delete examples", np: "useMutation examples", jp: "useMutation の例" },
          code: `import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// CREATE — POST new post
function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; body: string }) => {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create post");
      return res.json();
    },
    onSuccess: (newPost) => {
      // Add new post to the cache without refetching
      queryClient.setQueryData(["posts"], (old: Post[] = []) => [...old, newPost]);
      toast.success("Post created!");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

// Usage in a component
function CreatePostForm() {
  const createPost = useCreatePost();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      createPost.mutate({
        title: form.get("title") as string,
        body: form.get("body") as string,
      });
    }}>
      <input name="title" placeholder="Title" />
      <textarea name="body" placeholder="Body" />
      <button type="submit" disabled={createPost.isPending}>
        {createPost.isPending ? "Saving..." : "Create Post"}
      </button>
      {createPost.isError && <p className="text-red-500">{createPost.error.message}</p>}
    </form>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Optimistic updates — instant feedback",
        np: "Optimistic updates",
        jp: "楽観的更新 — 即座のフィードバック",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Optimistic updates make the UI feel instant by updating the local cache <b>before</b> the server confirms. If the server succeeds, nothing changes. If it fails, you roll back to the previous state.\n\nAnalogy: a confident waiter immediately removes your empty glass and brings a full one — they assume you want more. If you say 'actually, water please', they take it back. The experience is faster; the fallback is graceful.\n\n• <b>`onMutate`</b> — runs before the request, update cache optimistically, return snapshot for rollback\n• <b>`onError`</b> — receives the context from `onMutate`, restore previous state\n• <b>`onSettled`</b> — always invalidate the query after to sync with server truth",
            np: "Optimistic: UI पहिले update, server confirm पछि। Fail भयो भने rollback।",
            jp: "サーバー確認前に UI を更新。失敗時はスナップショットでロールバック。",
          },
        },
        {
          type: "code",
          title: { en: "Optimistic like button with rollback", np: "Optimistic like", jp: "楽観的いいね" },
          code: `function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) =>
      fetch(\`/api/posts/\${postId}/like\`, { method: "POST" }).then((r) => r.json()),

    // 1. Called BEFORE the request — update cache immediately
    onMutate: async (postId) => {
      // Cancel any in-flight refetches that would overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the current value for rollback
      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);

      // Optimistically update the cache
      queryClient.setQueryData<Post[]>(["posts"], (old = []) =>
        old.map((p) =>
          p.id === postId
            ? { ...p, liked: true, likesCount: p.likesCount + 1 }
            : p,
        ),
      );

      // Return snapshot so onError can roll back
      return { previousPosts };
    },

    // 2. On failure — restore the snapshot
    onError: (_err, _postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },

    // 3. Always sync with server after mutation (success or failure)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}`,
        },
      ],
    },
    {
      title: {
        en: "useInfiniteQuery — infinite scroll & pagination",
        np: "useInfiniteQuery — infinite scroll",
        jp: "useInfiniteQuery — 無限スクロール",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useInfiniteQuery` is designed for paginated data where you want to load more as the user scrolls. Instead of replacing the current page with the next, it accumulates pages in a `data.pages` array.\n\n• <b>`queryFn`</b> receives `pageParam` — the cursor/page number for this fetch\n• <b>`getNextPageParam`</b> — reads the last page and returns the next cursor (return `undefined` to stop)\n• <b>`data.pages`</b> — array of all loaded pages\n• <b>`fetchNextPage()`</b> — trigger loading the next page\n• <b>`hasNextPage`</b> — boolean, false when `getNextPageParam` returns `undefined`",
            np: "useInfiniteQuery: pages array accumulate गर्छ। fetchNextPage() ले more load गर्छ।",
            jp: "useInfiniteQuery: ページを配列で蓄積。fetchNextPage() で追加ロード。",
          },
        },
        {
          type: "code",
          title: { en: "useInfiniteQuery + intersection observer", np: "Infinite scroll", jp: "無限スクロール実装" },
          code: `import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";

interface PostsPage {
  items: Post[];
  nextCursor: string | null;
}

function usePosts() {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam }: { pageParam: string | null }) => {
      const url = pageParam
        ? \`/api/posts?cursor=\${pageParam}\`
        : "/api/posts";
      const res = await fetch(url);
      return res.json() as Promise<PostsPage>;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor, // null = no more pages
  });
}

function PostFeed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePosts();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Auto-load when sentinel scrolls into view
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasNextPage) fetchNextPage(); },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div>
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
      {/* Sentinel — triggers next page load when visible */}
      <div ref={sentinelRef} className="h-10" />
      {isFetchingNextPage && <Spinner />}
      {!hasNextPage && <p className="text-center text-muted">You've reached the end</p>}
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Prefetching — load data before navigation",
        np: "Prefetching",
        jp: "プリフェッチ — ナビゲーション前のデータ読み込み",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Prefetching loads data into the cache before the user navigates to a page, making navigation feel instant. Analogy: prefetching is like a chef starting your next course while you're still eating the current one — when you're ready for it, it's already there.\n\n• <b>`queryClient.prefetchQuery()`</b> — fetch and cache without rendering\n  ↳ Call on `onMouseEnter` of a link — hover intent usually gives you 200–400ms\n• <b>`initialData`</b> — provide data synchronously (if you already have it from a parent query)\n• <b>`placeholderData`</b> — show stale/approximate data while fresh data loads (no loading spinner)\n  ↳ Use `keepPreviousData` for pagination — show current page while next page loads",
            np: "prefetchQuery() ले hover मा data cache गर्छ। placeholderData ले skeleton avoid गर्छ।",
            jp: "ホバー時にプリフェッチ。placeholderData でスケルトン不要。",
          },
        },
        {
          type: "code",
          title: { en: "Prefetch on hover + placeholder data", np: "Prefetch example", jp: "プリフェッチの例" },
          code: `import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

function PostListItem({ post }: { post: Post }) {
  const queryClient = useQueryClient();

  function handleMouseEnter() {
    // Prefetch post detail on hover — gives 200-400ms head start
    queryClient.prefetchQuery({
      queryKey: ["post", post.id],
      queryFn: () => fetch(\`/api/posts/\${post.id}\`).then((r) => r.json()),
      staleTime: 30_000, // Don't re-fetch if already cached in last 30s
    });
  }

  return (
    <Link to={\`/posts/\${post.id}\`} onMouseEnter={handleMouseEnter}>
      {post.title}
    </Link>
  );
}

// On the detail page — data is likely already in cache from prefetch
function PostDetailPage() {
  const { id } = useParams();

  const { data: post } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetch(\`/api/posts/\${id}\`).then((r) => r.json()),
    // placeholderData: use a list item as skeleton while full data loads
    placeholderData: () => {
      const posts = queryClient.getQueryData<Post[]>(["posts"]);
      return posts?.find((p) => p.id === id);
    },
  });

  // No loading spinner — either prefetched data or placeholder from list is shown immediately
  return <article>{post?.title}</article>;
}`,
        },
      ],
    },
    {
      title: {
        en: "Query invalidation strategies",
        np: "Query invalidation strategies",
        jp: "クエリ無効化の戦略",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The TanStack Query cache can go stale — data changes on the server but your UI still shows the old version. Invalidation tells TanStack Query to refetch specific queries.\n\n• <b>`invalidateQueries`</b> — marks as stale, refetches immediately if there's an active observer\n  ↳ Use after mutations that change the data a query fetches\n• <b>`refetchQueries`</b> — forces an immediate refetch regardless of staleness\n• <b>`staleTime`</b> — milliseconds before data is considered stale. `0` = always stale (default). `Infinity` = never stale\n  ↳ Set `staleTime: 5 * 60 * 1000` for data that changes infrequently (5 min cache)\n• <b>`refetchOnWindowFocus`</b> — default `true` — refetches when user tabs back into the window",
            np: "invalidateQueries: stale mark। staleTime: cache duration। refetchOnWindowFocus: auto-refetch।",
            jp: "invalidateQueries でキャッシュを無効化。staleTime でキャッシュ有効期間を設定。",
          },
        },
        {
          type: "code",
          title: { en: "Invalidation patterns", np: "Invalidation", jp: "無効化パターン" },
          code: `const queryClient = useQueryClient();

// 1. Invalidate all post queries (refetches list AND individual posts)
queryClient.invalidateQueries({ queryKey: ["posts"] });

// 2. Invalidate a specific post
queryClient.invalidateQueries({ queryKey: ["post", postId] });

// 3. Invalidate everything
queryClient.invalidateQueries();

// 4. Force immediate refetch (even if not stale)
queryClient.refetchQueries({ queryKey: ["posts"] });

// 5. Set data directly without refetch (use when mutation returns the updated data)
queryClient.setQueryData(["post", postId], updatedPost);

// 6. Remove from cache completely (forces fresh fetch next time)
queryClient.removeQueries({ queryKey: ["post", postId] });

// Global defaults in QueryClient config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 minute — don't refetch if under 1 min old
      gcTime: 5 * 60 * 1000,       // 5 minutes — remove from cache after 5 min unused
      refetchOnWindowFocus: true,   // Refetch when user returns to tab
      retry: 2,                     // Retry failed queries 2 times
    },
  },
});`,
        },
        {
          type: "table",
          caption: {
            en: "When to use each cache management tool",
            np: "Cache management tools",
            jp: "キャッシュ管理ツールの使い分け",
          },
          headers: [
            { en: "Tool", np: "Tool", jp: "ツール" },
            { en: "What it does", np: "काम", jp: "動作" },
            { en: "Use when", np: "Use when", jp: "使うタイミング" },
          ],
          rows: [
            [
              { en: "`invalidateQueries`", np: "`invalidateQueries`", jp: "`invalidateQueries`" },
              { en: "Marks stale, refetches if active", np: "Stale mark + refetch", jp: "古いとマーク、即再取得" },
              { en: "After any mutation", np: "Mutation पछि", jp: "ミューテーション後" },
            ],
            [
              { en: "`setQueryData`", np: "`setQueryData`", jp: "`setQueryData`" },
              { en: "Update cache directly", np: "Direct cache update", jp: "キャッシュを直接更新" },
              { en: "Mutation returns the new data", np: "New data return", jp: "新データが返ってきた時" },
            ],
            [
              { en: "`prefetchQuery`", np: "`prefetchQuery`", jp: "`prefetchQuery`" },
              { en: "Fetch into cache without rendering", np: "Pre-load", jp: "レンダー前に読み込み" },
              { en: "On hover, before navigation", np: "Hover/navigate पहिले", jp: "ホバー・ナビゲーション前" },
            ],
            [
              { en: "`removeQueries`", np: "`removeQueries`", jp: "`removeQueries`" },
              { en: "Delete from cache entirely", np: "Cache delete", jp: "完全に削除" },
              { en: "After logout (clear user data)", np: "Logout पछि", jp: "ログアウト後" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "useOptimistic — instant UI feedback (React 19)",
        np: "useOptimistic — instant UI feedback (React 19)",
        jp: "useOptimistic — 即座の UI フィードバック（React 19）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useOptimistic` is a React 19 hook that makes optimistic UI updates simpler than manually managing TanStack Query's `onMutate` + `onError` + `onSettled` pattern.\n\nIt takes two arguments:\n1. The current real state (from the server)\n2. An <b>update function</b> `(currentState, optimisticValue) => nextState`\n\nAnd returns `[optimisticState, addOptimistic]`:\n• `optimisticState` — the current display value (real OR optimistic while a transition is pending)\n• `addOptimistic(value)` — trigger an optimistic update; `value` is passed to your update function\n\nWhen the real state (argument 1) updates after the server responds, the optimistic value is automatically discarded and replaced with the server truth — no manual rollback needed.\n\nAnalogy: a receptionist who writes your name on the whiteboard immediately when you arrive, then erases and replaces it when the official booking system confirms your registration.",
            np: "useOptimistic (React 19): optimistic state + addOptimistic()। Server response आएपछि automatically real state use गर्छ।",
            jp: "useOptimistic（React 19）: optimisticState と addOptimistic()。サーバー応答後は自動で実データに切り替わる。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "`useOptimistic` <b>must be used inside a transition</b> — wrap `addOptimistic` calls inside `startTransition` or a React 19 Server Action. Outside a transition the optimistic value is discarded immediately.\n\n<b>Difference from TanStack Query optimistic updates:</b>\n• TanStack Query: manual `onMutate` snapshot → `onError` rollback → `onSettled` invalidate (verbose but explicit)\n• `useOptimistic`: declare the update shape once; React handles the lifecycle automatically\n• Use `useOptimistic` for Server Action-based forms in Next.js 15+. Use TanStack Query's pattern for REST/GraphQL mutations in client-rendered apps.",
            np: "startTransition भित्र use गर्नुस्। TanStack Query = manual rollback। useOptimistic = automatic। Next.js 15 Server Actions मा ideal।",
            jp: "startTransition 内で使用。TanStack Query は手動ロールバック。useOptimistic は自動。Next.js 15 の Server Action に最適。",
          },
        },
        {
          type: "code",
          title: {
            en: "useOptimistic — optimistic like button and message list",
            np: "useOptimistic examples",
            jp: "useOptimistic の使用例",
          },
          code: `import { useOptimistic, startTransition, useState } from 'react';

// 1. Optimistic like button — update UI before server confirms
function LikeButton({ postId, initialLiked, initialCount }: {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [optimisticLiked, addOptimisticLike] = useOptimistic(
    liked,
    (_current, next: boolean) => next,
  );

  async function handleLike() {
    const next = !optimisticLiked;

    startTransition(() => addOptimisticLike(next));

    try {
      const res = await fetch(\`/api/posts/\${postId}/like\`, {
        method: next ? 'POST' : 'DELETE',
      });
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.likesCount);
    } catch {
      // Server failed — optimistic state discarded, real state wins
    }
  }

  return (
    <button onClick={handleLike}>
      {optimisticLiked ? '❤️' : '🤍'} {count + (optimisticLiked && !liked ? 1 : 0)}
    </button>
  );
}

// 2. Optimistic message list — show message immediately before server confirms
type Message = { id: string; text: string; sending?: boolean };

function ChatInput({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (current, newMsg: Message) => [...current, newMsg],
  );

  async function sendMessage(text: string) {
    const temp: Message = { id: crypto.randomUUID(), text, sending: true };

    startTransition(() => {
      addOptimistic(temp);
    });

    const saved = await fetch(\`/api/rooms/\${roomId}/messages\`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }).then(r => r.json());

    setMessages(prev => [...prev, saved]);
  }

  return (
    <div>
      <ul>
        {optimisticMessages.map(m => (
          <li key={m.id} style={{ opacity: m.sending ? 0.6 : 1 }}>
            {m.text} {m.sending && '⏳'}
          </li>
        ))}
      </ul>
      <button onClick={() => sendMessage('Hello!')}>Send</button>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "useActionState — form state from actions (React 19)",
        np: "useActionState — actions बाट form state (React 19)",
        jp: "useActionState — アクションからのフォーム状態（React 19）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`useActionState` is a React 19 hook that manages state derived from a form action — Server Actions in Next.js 15+, or regular async functions in client components. It replaces the common pattern of `useState` + manual `isPending` + `try/catch` inside form handlers.\n\nSignature: `const [state, action, isPending] = useActionState(actionFn, initialState)`\n\n• `actionFn(prevState, formData)` — receives the previous state and the form data; returns the next state\n• `state` — the current state (starts as `initialState`, updates after each action call)\n• `action` — pass this to a `<form action={action}>` or call it directly\n• `isPending` — `true` while the action is running\n\nAnalogy: `useActionState` is a form assistant — you hand it the rules (the action function) and it manages the clipboard (state), tracks whether work is in progress (isPending), and reports results automatically.",
            np: "useActionState (React 19): [state, action, isPending] = useActionState(fn, init)। Form action manage गर्छ। useState + isPending + try/catch replace गर्छ।",
            jp: "useActionState（React 19）: [state, action, isPending]。フォームアクションの状態管理を一元化。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Client component usage:</b> `useActionState` works in both server and client components. In client components, the action function is a regular `async` function. In Next.js 15 Server Components, the action function can be a Server Action (marked `'use server'`) — giving you server-side mutation with automatic client state sync and no API route needed.\n\n<b>When to prefer `useActionState` over `useMutation` (TanStack Query):</b>\n• Form-driven mutations with native `<form action>` (especially Server Actions)\n• Simple forms that don't need cache invalidation or refetching\n\n<b>When to prefer `useMutation`:</b>\n• Complex cache management (invalidate, optimistic, prefetch)\n• Programmatic mutations triggered outside a form submit",
            np: "Client र server दुवैमा काम गर्छ। Simple form mutation = useActionState। Complex cache = useMutation।",
            jp: "クライアント・サーバー両対応。シンプルなフォームは useActionState、複雑なキャッシュは useMutation。",
          },
        },
        {
          type: "code",
          title: {
            en: "useActionState — contact form with validation",
            np: "useActionState example",
            jp: "useActionState の使用例",
          },
          code: `'use client';

import { useActionState } from 'react';

interface ContactFormState {
  status: 'idle' | 'success' | 'error';
  message: string;
  errors?: { email?: string; message?: string };
}

async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const email   = formData.get('email') as string;
  const message = formData.get('message') as string;

  const errors: ContactFormState['errors'] = {};
  if (!email.includes('@'))  errors.email   = 'Invalid email address';
  if (message.length < 10)   errors.message = 'Message must be at least 10 characters';
  if (Object.keys(errors).length) {
    return { status: 'error', message: 'Please fix the errors below', errors };
  }

  try {
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ email, message }),
    });
    return { status: 'success', message: 'Message sent! We will reply within 24 hours.' };
  } catch {
    return { status: 'error', message: 'Failed to send. Please try again.' };
  }
}

// No useState, no isPending state, no try/catch in the component
function ContactForm() {
  const [state, action, isPending] = useActionState(submitContactForm, {
    status: 'idle',
    message: '',
  });

  if (state.status === 'success') {
    return <p className="text-green-600">{state.message}</p>;
  }

  return (
    <form action={action}>
      <div>
        <input name="email" type="email" placeholder="your@email.com" />
        {state.errors?.email && (
          <p className="text-red-500 text-sm">{state.errors.email}</p>
        )}
      </div>
      <div>
        <textarea name="message" placeholder="Your message..." rows={4} />
        {state.errors?.message && (
          <p className="text-red-500 text-sm">{state.errors.message}</p>
        )}
      </div>
      {state.status === 'error' && (
        <p className="text-red-600">{state.message}</p>
      )}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I use `mutate` vs `mutateAsync`?",
        np: "`mutate` vs `mutateAsync` कहिले?",
        jp: "`mutate` と `mutateAsync` の使い分けは？",
      },
      answer: {
        en: "`mutate` is fire-and-forget — errors are handled by `onError`. `mutateAsync` returns a Promise you can `await` and wrap in try/catch. Use `mutate` for simple fire-and-forget mutations. Use `mutateAsync` when you need to do something after the mutation in the same async flow (e.g., navigate after save, chain multiple mutations).",
        np: "mutate: fire-and-forget। mutateAsync: await गर्न, chaining को लागि।",
        jp: "mutate は投げっぱなし。mutateAsync は await して連鎖処理したい時。",
      },
    },
    {
      question: {
        en: "How do I update a single item in a list query after a mutation?",
        np: "Mutation पछि list को single item update कसरी?",
        jp: "ミューテーション後にリストの1アイテムだけ更新するには？",
      },
      answer: {
        en: "Use `queryClient.setQueryData` with a `.map()`: `queryClient.setQueryData(['posts'], (old) => old.map(p => p.id === updatedPost.id ? updatedPost : p))`. This is more efficient than invalidating (no refetch), but only works if the mutation returns the full updated object.",
        np: "setQueryData + .map(): `old.map(p => p.id === updated.id ? updated : p)`",
        jp: "setQueryData に .map() で対象アイテムだけ置換。再フェッチ不要。",
      },
    },
    {
      question: {
        en: "What is the difference between `invalidateQueries` and `setQueryData`?",
        np: "`invalidateQueries` र `setQueryData` मा के फरक?",
        jp: "`invalidateQueries` と `setQueryData` の違いは？",
      },
      answer: {
        en: "`setQueryData` updates the cache directly — no network request. Use when you have the new data already (mutation returned it). `invalidateQueries` marks data as stale and triggers a refetch — use when you want the server's latest version, or the mutation only returns a partial result.",
        np: "setQueryData: no network। invalidateQueries: server से fresh data fetch।",
        jp: "setQueryData はネットワーク不要。invalidateQueries はサーバーから再取得。",
      },
    },
    {
      question: {
        en: "How do I cancel an in-flight query?",
        np: "In-flight query कसरी cancel गर्ने?",
        jp: "実行中のクエリをキャンセルするには？",
      },
      answer: {
        en: "TanStack Query v5 uses AbortSignal automatically — pass `signal` from `queryFn`'s argument to your fetch: `queryFn: async ({ signal }) => fetch('/api/posts', { signal })`. When the component unmounts or the query key changes before it completes, TanStack Query aborts the request.",
        np: "queryFn मा signal pass गर्नुस्: `queryFn: ({ signal }) => fetch(url, { signal })`",
        jp: "queryFn の signal を fetch に渡す。アンマウント時に自動キャンセル。",
      },
    },
    {
      question: {
        en: "Can I use TanStack Query with WebSockets?",
        np: "TanStack Query र WebSockets?",
        jp: "TanStack Query を WebSocket と併用できる？",
      },
      answer: {
        en: "Yes. Use `useQuery` for the initial fetch. Then set up a WebSocket subscription that calls `queryClient.setQueryData` when a push update arrives. This gives you the best of both: initial load from HTTP (reliable), real-time updates from WebSocket (fast). Alternatively, `queryClient.invalidateQueries` on each WebSocket message triggers a refetch.",
        np: "useQuery for initial fetch। WebSocket message मा setQueryData call।",
        jp: "初回は useQuery、WebSocket メッセージで setQueryData を呼ぶ。",
      },
    },
  ],
};
