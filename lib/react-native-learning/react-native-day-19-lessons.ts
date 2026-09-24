import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_19_LESSONS = normalizePastedLessonDay({
  "day": 19,
  "title": "Server State in Depth",
  "overview": "📖 **5 lessons**\n\nDay 15 introduced the difference between:\n\n```\nClient state\nServer state\n```\n\nToday we're going deeper into server state.\n\nWe'll use **TanStack Query** as the main example.\n\nThe big idea is:\n\n> Server data is not just data you fetch once.\n\nIt has a lifecycle:\n\n```\nFetch\n↓\nCache\n↓\nBecome stale\n↓\nRefetch\n↓\nMutate\n↓\nInvalidate\n↓\nRefetch again\n```\n\nMobile applications make this especially important because the network can disappear at any time.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn19-1",
      "title": "Query Keys and Cache Design",
      "durationMinutes": 12,
      "explanation": "⏱️ **12 min**\n\n## Explanation\n\nTanStack Query uses **query keys** to identify cached data.\n\nThink of a query key as the address of data inside the query cache.\n\nFor example:\n\n```\n[\"products\"]\n```\n\ncould represent:\n\n```\nAll products\n```\n\nWhile:\n\n```\n[\"product\", 123]\n```\n\ncould represent:\n\n```\nProduct 123\n```\n\n---\n\n# Why query keys matter\n\nImagine:\n\n```\n[\"products\"]\n```\n\nand:\n\n```\n[\"products\", { category: \"phones\" }]\n```\n\nThese represent different data.\n\nThe query key tells TanStack Query:\n\n> \"These are not the same cached result.\"\n\nTanStack Query's query-key system is central to how it identifies cached queries. ([TanStack](<https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/QueryOptions?utm_source=chatgpt.com>))\n\n---\n\n# Good query keys\n\nThink about the data's identity.\n\nFor example:\n\n```\n[\"user\", userId]\n```\n\nmeans:\n\n```\nUser with this ID\n```\n\nFor a filtered list:\n\n```\n[\n\"products\",\n{\n  category,\n  sort,\n  page\n}\n]\n```\n\nNow a change in:\n\n```\ncategory\nsort\npage\n```\n\ncreates a different query identity.\n\n---\n\n# Query key hierarchy\n\nA useful pattern is:\n\n```\nproducts\n│\n├── products, list\n│\n├── products, category\n│\n└── products, detail\n```\n\nThis makes invalidation easier.\n\nFor example:\n\n```\nqueryClient.invalidateQueries({\nqueryKey: [\"products\"],\n});\n```\n\ncan target related product queries.\n\n---\n\n# What is invalidation?\n\n**Invalidation** means:\n\n> \"The cached result may no longer be correct. Treat it as needing fresh data.\"\n\nIt doesn't simply mean:\n\n> \"Delete everything.\"\n\nYou are telling TanStack Query:\n\n```\nThis data may be outdated.\n```\n\nAfter a mutation, invalidating related queries is a common pattern. ([TanStack](<https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations?utm_source=chatgpt.com>))\n\n---\n\n# Example\n\nUser updates their profile:\n\n```\nMutation:\nupdateProfile()\n```\n\nNow these may be stale:\n\n```\n[\"user\", userId]\n[\"profile\", userId]\n[\"settings\", userId]\n```\n\nYou decide which queries actually depend on the changed data.\n\nThen invalidate them.\n\n---\n\n# Don't invalidate everything\n\nThis is a common beginner mistake:\n\n```\nEvery mutation\n  ↓\nInvalidate all queries\n```\n\nThat can cause unnecessary network traffic.\n\nInstead:\n\n```\nMutation\n ↓\nWhat data did this actually change?\n ↓\nInvalidate only related queries\n```\n\n---\n\n## Visual Diagram\n\n```\n           Query Cache\n                │\n     ┌──────────┼──────────┐\n     ▼          ▼          ▼\n[\"users\"]   [\"products\"]  [\"orders\"]\n                │\n                ▼\n           Mutation\n                │\n                ▼\n        Invalidate products\n                │\n                ▼\n            Refetch\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Query keys identify cached server data.\n- Query keys should represent the identity of the data.\n- Include relevant filters and IDs.\n- Invalidate related data after mutations.\n- Don't blindly invalidate everything."
      ],
      "commonMistakes": [
        "### ❌ Random query keys\n\nPoor keys make caching difficult to reason about.\n\n### ❌ Forgetting parameters\n\n`[\"user\"]` is not enough if the query represents a specific user.\n\n### ❌ Invalidating everything\n\nIt can create unnecessary network requests."
      ],
      "quiz": [
        {
          "question": "What is the purpose of a query key?",
          "options": [
            "A. Identify a piece of cached server data",
            "B. Style a component",
            "C. Navigate to a screen",
            "D. Store a password"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn19-2",
      "title": "Optimistic Updates + Rollback",
      "durationMinutes": 13,
      "explanation": "⏱️ **13 min**\n\n## Explanation\n\nNow let's combine Day 17's optimistic UI with TanStack Query.\n\nSuppose we have:\n\n```\nTodo\n──────\n☐ Learn React Native\n```\n\nThe user taps the checkbox.\n\nWe want:\n\n```\nTap\n↓\n☑ immediately\n↓\nServer request\n```\n\nrather than:\n\n```\nTap\n↓\nWait\n↓\nServer\n↓\n☑\n```\n\n---\n\n# The complete optimistic flow\n\nA safe optimistic update usually looks like:\n\n```\nUser action\n  ↓\nCancel conflicting refetch\n  ↓\nSave previous cache\n  ↓\nUpdate cache optimistically\n  ↓\nSend mutation\n  │\n┌──┴─────┐\n▼        ▼\nSuccess  Failure\n│        │\n▼        ▼\nKeep    Rollback\n│        │\n└──┬─────┘\n    ▼\n Refetch\n```\n\nTanStack Query documents this pattern using `onMutate`, a saved previous value, rollback on error, and invalidation afterward. ([TanStack](<https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates?utm_source=chatgpt.com>))\n\n---\n\n# Why cancel an existing refetch?\n\nImagine:\n\n```\nOptimistic update\n     ↓\ntitle = \"New title\"\n```\n\nBut at exactly the same time:\n\n```\nOld GET request\n     ↓\ntitle = \"Old title\"\n```\n\nIf the old request finishes after your optimistic update, it might overwrite your new UI.\n\nSo the optimistic mutation can cancel an in-flight query first.\n\n---\n\n# Snapshot\n\nA **snapshot** means:\n\n> Save the current state before changing it.\n\nFor example:\n\n```\nconst previous = queryClient.getQueryData([\"todos\"]);\n```\n\nThen:\n\n```\nPrevious:\nTodo A\nTodo B\n\nOptimistic:\nTodo A ✓\nTodo B\n```\n\nIf the server fails:\n\n```\nRollback:\nTodo A\nTodo B\n```\n\n---\n\n# Example structure\n\n```\nconst mutation = useMutation({\nmutationFn: updateTodo,\n\nonMutate: async (updatedTodo) => {\n  await queryClient.cancelQueries({\n    queryKey: [\"todos\"],\n  });\n\n  const previousTodos =\n    queryClient.getQueryData([\"todos\"]);\n\n  queryClient.setQueryData(\n    [\"todos\"],\n    (todos) => updateLocally(todos, updatedTodo)\n  );\n\n  return { previousTodos };\n},\n\nonError: (_error, _todo, context) => {\n  queryClient.setQueryData(\n    [\"todos\"],\n    context?.previousTodos\n  );\n},\n\nonSettled: () => {\n  queryClient.invalidateQueries({\n    queryKey: [\"todos\"],\n  });\n},\n});\n```\n\nThe exact data types and API details will depend on your project.\n\nThe important part is the sequence.\n\n---\n\n# Why refetch after success?\n\nEven if your optimistic update looks correct, the server may have changed something.\n\nFor example:\n\n```\nClient says:\nprice = 100\n\nServer responds:\nprice = 99\n```\n\nThe server is the source of truth.\n\nSo after the mutation:\n\n```\nMutation\n↓\nInvalidate\n↓\nRefetch\n↓\nServer-confirmed data\n```\n\n---\n\n# `useOptimistic` vs TanStack Query optimistic updates\n\nThese can work together, but they solve slightly different layers.\n\n### `useOptimistic`\n\nUseful for rendering an immediate optimistic UI state.\n\n### TanStack Query cache update\n\nUseful when the optimistic change needs to be reflected across multiple places that read the same cached server data.\n\nTanStack Query documents both UI-based optimistic approaches and cache-based updates. ([TanStack](<https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates?utm_source=chatgpt.com>))",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Optimistic updates improve perceived speed.\n- Always have a rollback strategy.\n- Save the previous cache before changing it.\n- Refetch after the mutation settles when server confirmation matters.\n- Cancel conflicting refetches before modifying the cache."
      ],
      "commonMistakes": [
        "### ❌ Optimistic update without rollback\n\nThe UI can become incorrect permanently.\n\n### ❌ Never refetching after a mutation\n\nThe client may remain different from the server.\n\n### ❌ Updating one screen but forgetting other cached views\n\nCache-based updates can help keep multiple views consistent."
      ],
      "quiz": [
        {
          "question": "Why do we save the previous cache during an optimistic update?",
          "options": [
            "A. So we can restore it if the mutation fails",
            "B. To make the app prettier",
            "C. To create a navigation route",
            "D. To disable retries"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn19-3",
      "title": "Prefetching and Mobile Refetch Policies",
      "durationMinutes": 12,
      "explanation": "⏱️ **12 min**\n\n## Explanation\n\nMobile networks are different from desktop networks.\n\nYour user might have:\n\n```\nFast Wi-Fi\n↓\nElevator\n↓\nNo connection\n↓\n5G\n↓\nWeak cellular\n```\n\nYour data-fetching strategy needs to respect that.\n\n---\n\n# Prefetching\n\n**Prefetching** means:\n\n> Fetch data before the user explicitly asks for it because you expect they'll need it soon.\n\nImagine:\n\n```\nProduct List\n```\n\nThe user taps:\n\n```\nProduct A\n```\n\nYou could start fetching Product A when the user is interacting with the list.\n\nThen:\n\n```\nTap Product A\n↓\nData may already be cached\n↓\nDetail screen appears faster\n```\n\nTanStack Query supports prefetching to populate its cache ahead of time. ([TanStack](<https://tanstack.com/query/latest/docs/framework/react/guides/prefetching?utm_source=chatgpt.com>))\n\n---\n\n# Example\n\n```\nUser sees product\n     ↓\nApp predicts next screen\n     ↓\nPrefetch product details\n     ↓\nUser taps product\n     ↓\nCached data available\n```\n\n---\n\n# Don't prefetch everything\n\nPrefetching costs:\n\n```\nNetwork\nBattery\nData usage\nMemory\n```\n\nSo ask:\n\n> \"Is the user likely to need this data soon?\"\n\nGood example:\n\n```\nUser opens product list\n     ↓\nPrefetch first visible product details\n```\n\nBad example:\n\n```\nUser opens app\n     ↓\nDownload every possible screen\n```\n\n---\n\n# Stale time\n\nTanStack Query has the concept of **stale time**.\n\nStale means:\n\n> The cached data is considered old enough that a refetch may be appropriate.\n\nFor example:\n\n```\nstaleTime = 5 minutes\n```\n\ncould mean:\n\n```\n0–5 min\n↓\nConsider fresh\n\nAfter 5 min\n↓\nConsider stale\n```\n\nTanStack Query's current documentation describes `staleTime` as the period after which data is considered stale. ([TanStack](<https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/UseInfiniteQueryOptions?utm_source=chatgpt.com>))\n\n---\n\n# Mobile-friendly thinking\n\nNot every piece of data needs the same freshness.\n\nFor example:\n\n```\nUser avatar\n→ Can be cached longer\n\nStock price\n→ Needs frequent updates\n\nNews feed\n→ Refetch when returning to screen\n\nStatic categories\n→ Can remain fresh for a long time\n```\n\nDon't use one global freshness policy for everything.\n\n---\n\n# Background refetching\n\nSuppose:\n\n```\nUser leaves screen\n   ↓\nApp stays alive\n   ↓\nTime passes\n   ↓\nUser returns\n```\n\nYou may want:\n\n```\nShow cached data immediately\n      +\nRefetch in background\n```\n\nThis creates:\n\n```\nFast UI\n+\nFresh data\n```\n\n---\n\n# Network conditions\n\nTanStack Query also provides network-related options such as `networkMode`, including `offlineFirst`, which can be useful when designing behavior for intermittent connectivity. ([TanStack](<https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/UseInfiniteQueryOptions?utm_source=chatgpt.com>))\n\nThe important lesson is not:\n\n> \"Always use offlineFirst.\"\n\nIt's:\n\n> **Choose network behavior deliberately for the type of data.**",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Prefetch data when you have a good reason to expect it soon.\n- Don't download unnecessary data.\n- Tune `staleTime` according to the data's freshness requirements.\n- Mobile applications need network-aware policies.\n- Cached data can provide fast UI while background refetch keeps it fresh."
      ],
      "commonMistakes": [
        "### ❌ Refetching everything whenever a screen appears\n\nThis can waste battery and network data.\n\n### ❌ Setting every query to the same stale time\n\nDifferent data has different freshness requirements.\n\n### ❌ Prefetching huge amounts of data\n\nPrefetching is not free."
      ],
      "quiz": [
        {
          "question": "What is prefetching?",
          "options": [
            "A. Fetching data before the user explicitly requests it",
            "B. Deleting cached data",
            "C. Retrying a failed mutation",
            "D. Encrypting data"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn19-4",
      "title": "Pagination, Infinite Queries, and FlashList",
      "durationMinutes": 12,
      "explanation": "⏱️ **12 min**\n\n## Explanation\n\nImagine an API has:\n\n```\n50,000 products\n```\n\nYou don't want:\n\n```\nGET /products\n```\n\nto return all 50,000 at once.\n\nInstead:\n\n```\nPage 1 → 50 products\nPage 2 → 50 products\nPage 3 → 50 products\n...\n```\n\nThis is **pagination**.\n\n---\n\n# Infinite scrolling\n\nThe user sees:\n\n```\nProduct 1\nProduct 2\nProduct 3\n...\nProduct 50\n```\n\nThey approach the bottom:\n\n```\n↓\n↓\n↓\n```\n\nThe application loads:\n\n```\nProducts 51–100\n```\n\nThis is an **infinite query/list** pattern.\n\n---\n\n# TanStack Query\n\nTanStack Query provides `useInfiniteQuery` for this pattern.\n\nThe mental model is:\n\n```\n           Infinite Query\n                 │\n        ┌────────┴────────┐\n        ▼                 ▼\n     Page 1             Page 2\n        │                 │\n        └────────┬────────┘\n                 ▼\n              Page 3\n```\n\nThe query function receives a page parameter, and `getNextPageParam` tells TanStack Query how to find the next page. ([TanStack](<https://tanstack.com/query/latest/docs/framework/react/reference/functions/usePrefetchInfiniteQuery?utm_source=chatgpt.com>))\n\n---\n\n# FlashList\n\nNow connect this to Day 6.\n\nYou might have:\n\n```\nTanStack Query\n     ↓\nInfinite pages\n     ↓\nFlatten pages\n     ↓\nFlashList\n     ↓\nVisible rows\n```\n\nThe query manages:\n\n```\nServer data\nPages\nFetching\nErrors\nCaching\n```\n\nFlashList manages:\n\n```\nEfficient list rendering\n```\n\nThese are separate responsibilities.\n\n---\n\n# Example architecture\n\n```\nAPI\n│\n▼\nuseInfiniteQuery\n│\n├── Page 1\n├── Page 2\n├── Page 3\n│\n▼\nFlatten\n│\n▼\nFlashList\n│\n▼\nUser scrolls\n│\n▼\nonEndReached\n│\n▼\nfetchNextPage()\n```\n\n---\n\n# Important: avoid duplicate fetches\n\nWhen the user reaches the end:\n\n```\nif (hasNextPage && !isFetchingNextPage) {\nfetchNextPage();\n}\n```\n\nWhy?\n\nBecause a fast scroll or multiple events could otherwise trigger unnecessary requests.\n\n---\n\n# `maxPages`\n\nFor very long feeds, you should also think about memory.\n\nTanStack Query supports `maxPages` for infinite queries, allowing you to limit how many pages are kept. ([TanStack](<https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/UseInfiniteQueryOptions?utm_source=chatgpt.com>))\n\nThis is useful when the user has been scrolling for a long time.\n\n---\n\n# Mobile feed mental model\n\n```\n        Server\n           │\n           ▼\n    Page-based API\n           │\n           ▼\n   TanStack Infinite Query\n           │\n     ┌─────┼─────┐\n     ▼     ▼     ▼\n    P1    P2    P3\n           │\n           ▼\n        FlashList\n           │\n           ▼\n         Screen\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Pagination prevents huge responses.\n- Infinite queries help manage paginated data as users scroll.\n- FlashList handles efficient rendering.\n- TanStack Query handles server-state concerns.\n- Keep fetching and rendering responsibilities separate.\n- Protect `fetchNextPage()` from duplicate requests."
      ],
      "commonMistakes": [
        "### ❌ Loading the entire dataset\n\nThis can destroy memory and performance.\n\n### ❌ Fetching the next page repeatedly\n\nGuard against duplicate calls.\n\n### ❌ Mixing list rendering logic with server-state logic\n\nKeep responsibilities clear."
      ],
      "quiz": [
        {
          "question": "What does `getNextPageParam` help determine?",
          "options": [
            "A. How to request the next page",
            "B. Which font to use",
            "C. Which screen to navigate to",
            "D. Which color the list should use"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn19-5",
      "title": "Mutation Queues and Idempotency",
      "durationMinutes": 11,
      "explanation": "⏱️ **11 min**\n\n## Explanation\n\nNow we reach one of the most important mobile-networking concepts.\n\nImagine the user edits a note:\n\n```\n\"Buy milk\"\n```\n\nThey tap Save.\n\nThen:\n\n```\nRequest starts\n↓\nPhone loses connection\n↓\nUser doesn't know whether server received it\n```\n\nWhat should the application do?\n\nIt may retry.\n\nBut now we have a dangerous question:\n\n> **Could retrying perform the operation twice?**\n\n---\n\n# What is a mutation?\n\nA **mutation** changes server data.\n\nExamples:\n\n```\nCreate note\nUpdate profile\nDelete comment\nSend message\nAdd item\nComplete order\n```\n\nUnlike a simple read:\n\n```\nGET /products\n```\n\na mutation changes something.\n\n---\n\n# Why retries are dangerous\n\nImagine:\n\n```\nPOST /payments\n```\n\nThe first request reaches the server.\n\nBut the response gets lost.\n\nYour app thinks:\n\n```\nFailed\n```\n\nand retries.\n\nNow:\n\n```\nPayment 1\nPayment 2\n```\n\ncould potentially happen.\n\nThat's why retrying mutations requires careful API design.\n\n---\n\n# Idempotency\n\n**Idempotency** means:\n\n> Repeating the same operation with the same identifier produces the same intended result rather than performing the action repeatedly.\n\nFor example:\n\n```\nRequest ID:\nabc-123\n```\n\nThe client sends:\n\n```\nCreate order\nidempotencyKey = abc-123\n```\n\nThe server records that key.\n\nIf the client retries:\n\n```\nCreate order\nidempotencyKey = abc-123\n```\n\nthe server recognizes:\n\n```\n\"This is the same operation.\"\n```\n\nand doesn't create a duplicate order.\n\n---\n\n# Mutation queue\n\nA **mutation queue** is a list of pending changes waiting to be processed.\n\nFor example:\n\n```\nOffline\n│\n├── Update note\n├── Mark task complete\n└── Change profile\n```\n\nWhen connectivity returns:\n\n```\nNetwork restored\n    ↓\nMutation Queue\n    ↓\nOperation 1\n    ↓\nOperation 2\n    ↓\nOperation 3\n```\n\n---\n\n# Why order can matter\n\nSuppose the user does:\n\n```\n1. Rename note → \"Shopping\"\n2. Rename note → \"Shopping List\"\n```\n\nIf the second request reaches the server first:\n\n```\nShopping List\n```\n\nthen the first request arrives:\n\n```\nShopping\n```\n\nThe final result could be wrong.\n\nA queue can preserve intended order:\n\n```\nRename → Shopping\n   ↓\nRename → Shopping List\n```\n\n---\n\n# Retry strategy\n\nA good retry system should consider:\n\n```\nIs the operation safe to retry?\nHas the server received it?\nIs it idempotent?\nIs the device online?\nShould it wait?\nHow many attempts?\n```\n\n---\n\n# TanStack Query and retries\n\nTanStack Query supports mutation retries when configured, and its ecosystem also supports persisted mutations that can be resumed later. ([TanStack](<https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-react-query-3?utm_source=chatgpt.com>))\n\nBut don't interpret this as:\n\n> \"Turn on infinite mutation retries.\"\n\nYou still need to understand whether your mutation is safe to repeat.\n\n---\n\n## Visual Diagram\n\n```\nUser Action\n  │\n  ▼\nMutation Queue\n  │\n  ▼\nNetwork Available?\n / \\\nNo   Yes\n│      │\n▼      ▼\nWait   Send\n      │\n ┌────┴─────┐\n ▼          ▼\nSuccess     Failure\n │          │\n ▼          ▼\nRemove      Retry?\nfrom queue\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Mutations change server data.\n- Mobile networks can fail after the server receives a request.\n- Retrying a mutation can create duplicates.\n- Idempotency makes safe retries possible.\n- Queues can preserve operations while offline.\n- Order can matter.\n- Retry policies must be designed, not blindly enabled."
      ],
      "commonMistakes": [
        "### ❌ Retrying every mutation automatically\n\nSome mutations are dangerous to repeat.\n\n### ❌ Assuming a network error means the server didn't receive the request\n\nYou often cannot know that.\n\n### ❌ Ignoring operation order\n\nSome updates depend on previous updates."
      ],
      "quiz": [
        {
          "question": "What does idempotency help with?",
          "options": [
            "A. Making repeated requests produce the same intended result instead of duplicate effects",
            "B. Making animations smoother",
            "C. Styling a screen",
            "D. Creating navigation routes"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What is the purpose of a query key?",
      "options": [
        "A. Identify a piece of cached server data",
        "B. Style a component",
        "C. Navigate to a screen",
        "D. Store a password"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why do we save the previous cache during an optimistic update?",
      "options": [
        "A. So we can restore it if the mutation fails",
        "B. To make the app prettier",
        "C. To create a navigation route",
        "D. To disable retries"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is prefetching?",
      "options": [
        "A. Fetching data before the user explicitly requests it",
        "B. Deleting cached data",
        "C. Retrying a failed mutation",
        "D. Encrypting data"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does `getNextPageParam` help determine?",
      "options": [
        "A. How to request the next page",
        "B. Which font to use",
        "C. Which screen to navigate to",
        "D. Which color the list should use"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does idempotency help with?",
      "options": [
        "A. Making repeated requests produce the same intended result instead of duplicate effects",
        "B. Making animations smoother",
        "C. Styling a screen",
        "D. Creating navigation routes"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should a query key include?",
      "options": [
        "A. Every value that changes the fetched data",
        "B. Only a random string",
        "C. Component styles",
        "D. A password"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What enables rollback after an optimistic update fails?",
      "options": [
        "A. A snapshot of the previous cache",
        "B. A loading spinner",
        "C. A route parameter",
        "D. A new component key"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does staleTime control?",
      "options": [
        "A. How long cached data is considered fresh",
        "B. How long a component animates",
        "C. How long navigation waits",
        "D. How long TypeScript compiles"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which pattern suits a continuously loaded mobile feed?",
      "options": [
        "A. Infinite query with a virtualized list",
        "B. Fetching the entire dataset",
        "C. One useState per record",
        "D. A WebView only"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why should mutation retries use an idempotency key?",
      "options": [
        "A. To prevent duplicate server effects",
        "B. To improve styling",
        "C. To create route types",
        "D. To preserve component identity"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "footer": "# 🧠 Days 17–19 — The Big Picture\n\nThese three days are connected.\n\nYou are not learning three unrelated topics.\n\nYou're building one architecture.\n\n```\n                        React Native App\n                               │\n         ┌─────────────────────┼─────────────────────┐\n         │                     │                     │\n         ▼                     ▼                     ▼\n       React               TypeScript           Server State\n         │                     │                     │\n         │                     │                     │\n  ┌──────┼──────┐       ┌──────┼──────┐       ┌──────┼──────┐\n  │      │      │       │      │      │       │      │      │\n  ▼      ▼      ▼       ▼      ▼      ▼       ▼      ▼      ▼\nEffects State Suspense Routes Native Config  Cache  Query Mutation\n  │                                      │       │      │\n  ▼                                      ▼       ▼      ▼\nuseEffectEvent                       Safe APIs  Fresh   Optimistic\n                                               Data      UI\n```\n\nThe mental model you should leave with is:\n\n### React handles the UI and rendering model.\n\n```\nComponents\nState\nEffects\nTransitions\nSuspense\n```\n\n### TypeScript protects important boundaries.\n\n```\nRoutes\nProps\nAPI models\nNative modules\nConfiguration\n```\n\n### TanStack Query handles server state.\n\n```\nCaching\nFetching\nRefetching\nInvalidation\nPagination\nMutations\nOptimistic updates\n```\n\n### Your server must still be the source of truth.\n\nOptimistic UI is only a temporary prediction.\n\n```\nClient prediction\n      ↓\nServer confirmation\n      ↓\nFinal truth\n```\n\nAnd on mobile, you must always remember:\n\n```\nNetwork can disappear.\nRequests can fail.\nApps can be backgrounded.\nResponses can arrive late.\nRequests can be retried.\n```\n\nThat's why the architecture you're building now is much more than simply:\n\n```\nfetch()\n```",
  "project": {
    "name": "Optimistic Mutation With Safe Retry",
    "goal": "Build a mutation that updates the UI optimistically, rolls back cleanly on failure, and is safe to retry automatically.",
    "brief": "Let's use a simple todo example.\n\n---\n\n# Step 1 — Initial data\n\nImagine:\n\n```\n☐ Learn React Native\n☐ Learn TypeScript\n☐ Build mobile app\n```\n\nThe user taps:\n\n```\n☐ Learn React Native\n```\n\n---\n\n# Step 2 — Optimistic update\n\nImmediately show:\n\n```\n☑ Learn React Native\n```\n\nDon't wait for the server.\n\n---\n\n# Step 3 — Save the previous state\n\nBefore changing the cache:\n\n```\nPrevious:\n☐ Learn React Native\n☐ Learn TypeScript\n☐ Build mobile app\n```\n\nSave it.\n\n---\n\n# Step 4 — Update the cache\n\nNow:\n\n```\nOptimistic:\n☑ Learn React Native\n☐ Learn TypeScript\n☐ Build mobile app\n```\n\n---\n\n# Step 5 — Send the mutation\n\nSend something like:\n\n```\nPATCH /todos/123\n\n{\ncompleted: true,\noperationId: \"abc-123\"\n}\n```\n\nThe `operationId` is an idempotency identifier.\n\n---\n\n# Step 6 — Handle success\n\nIf the server confirms:\n\n```\nSuccess\n↓\nKeep optimistic state\n↓\nInvalidate/refetch if needed\n```\n\n---\n\n# Step 7 — Handle failure\n\nIf the request fails:\n\n```\nFailure\n↓\nRestore previous cache\n↓\nShow error\n```\n\nThe user should see:\n\n```\n☐ Learn React Native\n\nCouldn't update. Try again.\n```\n\n---\n\n# Step 8 — Retry safely\n\nSuppose the network fails.\n\nThe application retries:\n\n```\noperationId = abc-123\n```\n\nagain.\n\nThe server sees:\n\n```\nabc-123\n```\n\nand knows:\n\n```\n\"This is the same operation.\"\n```\n\nThe mutation doesn't accidentally create a second operation.\n\n---\n\n# Final Architecture\n\n```\n                  User taps\n                     │\n                     ▼\n              Optimistic update\n                     │\n                     ▼\n               Query cache\n                     │\n                     ▼\n                Send mutation\n                     │\n           ┌─────────┴─────────┐\n           ▼                   ▼\n        Success              Failure\n           │                   │\n           ▼                   ▼\n     Confirm/refetch        Rollback\n           │                   │\n           └─────────┬─────────┘\n                     ▼\n                Final UI\n```",
    "steps": [],
    "acceptance": [
      "A query with a well-designed query key.",
      "A mutation that changes server data.",
      "An optimistic cache update.",
      "A saved previous state.",
      "A rollback when the mutation fails.",
      "Query invalidation after the mutation settles.",
      "Retry behavior that does not create duplicate operations.",
      "An idempotency key or equivalent server-side mechanism.",
      "Pagination/infinite-query knowledge.",
      "A clear understanding of when to prefetch.",
      "Mobile-aware freshness and network behavior."
    ]
  }
});

