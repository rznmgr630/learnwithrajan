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
