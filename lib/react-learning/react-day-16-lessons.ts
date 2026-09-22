import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_16_LESSONS: LessonDay = {
  day: 16,
  title: "Data Fetching with TanStack Query",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "day1",
      title: "Why TanStack Query Exists",
      durationMinutes: 12,
      explanation: "A small useEffect + fetch can become difficult when an application needs caching, retries, deduplication (combining identical in-flight requests), refetching, stale-data handling, pagination, and mutation coordination. TanStack Query treats server state as a separate concern and manages a cache around asynchronous queries.",
      diagram: "Component → query key + queryFn → Query cache\n                         ├─ fresh\n                         ├─ stale\n                         └─ fetching",
      codeExample: {
        title: "Basic query",
        code: "const query = useQuery({\n  queryKey: [\"users\"],\n  queryFn: async () => {\n    const response = await fetch(\"/api/users\");\n    if (!response.ok) throw new Error(\"Request failed\");\n    return response.json();\n  },\n});"
      },
      keyTakeaways: [
        "TanStack Query manages server state.",
        "A query key identifies cached data.",
        "The query function fetches the data."
      ],
      commonMistakes: [
        "Putting every API response into Context.",
        "Ignoring failed HTTP responses.",
        "Using unstable query keys."
      ],
      quiz: [
        {
          question: "What does TanStack Query primarily manage?",
          options: [
            "Server state",
            "CSS",
            "Routing only",
            "JSX"
          ],
          correctIndex: 0,
          explanation: "It manages asynchronous server-owned data and its cache."
        },
        {
          question: "What identifies a query?",
          options: [
            "queryKey",
            "className",
            "keyCode",
            "ref"
          ],
          correctIndex: 0,
          explanation: "The query key identifies cached query data."
        }
      ]
    },
    {
      id: "day2",
      title: "useQuery, Query Keys, and Stale Data",
      durationMinutes: 12,
      explanation: "useQuery needs a query key and query function. Include variables that affect the result in the query key. Freshness is separate from cache existence: stale data can still be cached while being eligible for refetching. Choose freshness according to how quickly the server data changes.",
      diagram: "[\"users\"] → all users\n[\"users\",{teamId:\"a\"}] → team A\n[\"users\",{teamId:\"b\"}] → team B",
      codeExample: {
        title: "Query key with variables",
        code: "const query = useQuery({\n  queryKey: [\"users\", { teamId }],\n  queryFn: () => fetch(`/api/teams/${teamId}/users`)\n    .then(r => {\n      if (!r.ok) throw new Error(\"Failed\");\n      return r.json();\n    }),\n});"
      },
      keyTakeaways: [
        "Include query inputs in query keys.",
        "Stale does not mean deleted.",
        "Freshness policy depends on the data."
      ],
      commonMistakes: [
        "Using one key for different results.",
        "Putting unstable values in query keys.",
        "Confusing stale data with missing data."
      ],
      quiz: [
        {
          question: "Why include teamId in a query key?",
          options: [
            "It distinguishes different results",
            "It changes CSS",
            "It creates a route",
            "It disables caching"
          ],
          correctIndex: 0,
          explanation: "Different team IDs produce different results."
        },
        {
          question: "Does stale mean data was deleted?",
          options: [
            "Yes",
            "No",
            "Only production",
            "Only after mutation"
          ],
          correctIndex: 1,
          explanation: "Stale data can remain cached."
        }
      ]
    },
    {
      id: "day3",
      title: "Dependent Queries and Mutations",
      durationMinutes: 12,
      explanation: "A dependent query waits for required input from another query or piece of state. Mutations represent writes. After a successful mutation, invalidate affected queries so cached reads can become fresh again. This separates reading server state from changing it.",
      diagram: "Current user → organizationId?\n                 ├─ no → members disabled\n                 └─ yes → members query\nMutation → server write → invalidate affected queries",
      codeExample: {
        title: "Mutation and invalidation",
        code: "const queryClient = useQueryClient();\n\nconst mutation = useMutation({\n  mutationFn: createUser,\n  onSuccess: () => {\n    queryClient.invalidateQueries({ queryKey: [\"users\"] });\n  },\n});"
      },
      keyTakeaways: [
        "Dependent queries wait for required inputs.",
        "Mutations represent writes.",
        "Invalidate affected queries after successful writes."
      ],
      commonMistakes: [
        "Running queries with undefined identifiers.",
        "Updating one local copy while other cached copies stay stale.",
        "Assuming POST automatically updates every screen."
      ],
      quiz: [
        {
          question: "When should a dependent query run?",
          options: [
            "When required inputs are ready",
            "Always",
            "Only after reload",
            "Never"
          ],
          correctIndex: 0,
          explanation: "A dependent query waits for its dependency."
        },
        {
          question: "What does invalidateQueries communicate?",
          options: [
            "Matching cached data may need refresh",
            "Delete the database",
            "Disable React",
            "Navigate"
          ],
          correctIndex: 0,
          explanation: "Invalidation marks relevant queries as stale."
        }
      ]
    },
    {
      id: "day4",
      title: "Pagination, Infinite Queries, and Prefetching",
      durationMinutes: 12,
      explanation: "Pagination limits how much data is requested at once. Infinite queries model page or cursor progression for feeds and long lists. Prefetching requests data before it is explicitly needed, such as when a user hovers a likely next link. Prefetch intentionally; do not request everything just because it might be used.",
      diagram: "Page 1 → nextCursor → Page 2 → nextCursor → Page 3\n\nHover link → prefetch detail → click → cached data",
      codeExample: {
        title: "Infinite query concept",
        code: "const query = useInfiniteQuery({\n  queryKey: [\"projects\"],\n  queryFn: ({ pageParam }) => fetchProjects(pageParam),\n  initialPageParam: 0,\n  getNextPageParam: lastPage => lastPage.nextCursor,\n});"
      },
      keyTakeaways: [
        "Pagination controls request size.",
        "Infinite queries model page progression.",
        "Prefetch only likely-needed data."
      ],
      commonMistakes: [
        "Loading thousands of rows at once.",
        "Ignoring the API's cursor model.",
        "Prefetching everything."
      ],
      quiz: [
        {
          question: "Why paginate?",
          options: [
            "Limit data loaded at once",
            "Remove API calls",
            "Disable caching",
            "Replace React"
          ],
          correctIndex: 0,
          explanation: "Pagination limits each request."
        },
        {
          question: "What is prefetching?",
          options: [
            "Fetching likely-needed data early",
            "Deleting cache",
            "Rendering twice",
            "Submitting a form"
          ],
          correctIndex: 0,
          explanation: "Prefetching anticipates a future request."
        }
      ]
    },
    {
      id: "day5",
      title: "Optimistic Updates, Suspense, and DevTools",
      durationMinutes: 12,
      explanation: "Optimistic UI changes the cache immediately before the server confirms the mutation. It can feel fast, but it requires rollback when the server rejects the operation. TanStack Query provides mutation lifecycle callbacks and DevTools for inspecting query state and cache. useSuspenseQuery can integrate query data with React Suspense when that rendering model fits the application.",
      diagram: "Click save → optimistic cache update\n          ├─ success → keep\n          └─ failure → rollback",
      codeExample: {
        title: "Optimistic mutation pattern",
        code: "const mutation = useMutation({\n  mutationFn: updateProject,\n  onMutate: async next => {\n    // snapshot previous data and update cache\n  },\n  onError: (_error, _next, context) => {\n    // restore previous data from context\n  },\n});"
      },
      keyTakeaways: [
        "Optimistic UI needs rollback thinking.",
        "DevTools help inspect the query cache.",
        "Suspense is a rendering strategy, not a replacement for data modeling."
      ],
      commonMistakes: [
        "Optimistic updates without rollback.",
        "Editing many cache entries without a key strategy.",
        "Using Suspense without useful fallback boundaries."
      ],
      quiz: [
        {
          question: "What must an optimistic update include?",
          options: [
            "A recovery/rollback strategy",
            "No server request",
            "No cache",
            "A router"
          ],
          correctIndex: 0,
          explanation: "The server can reject the assumed change."
        },
        {
          question: "What do Query DevTools inspect?",
          options: [
            "Query/cache state",
            "Git branches",
            "CSS selectors",
            "Database schema"
          ],
          correctIndex: 0,
          explanation: "They show query and cache state."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What is TanStack Query designed to manage?",
      options: [
        "Server state",
        "CSS",
        "Routing only",
        "JSX"
      ],
      correctIndex: 0,
      explanation: "It manages asynchronous server-owned data."
    },
    {
      question: "What identifies cached query data?",
      options: [
        "queryKey",
        "className",
        "route",
        "ref"
      ],
      correctIndex: 0,
      explanation: "queryKey identifies a query."
    },
    {
      question: "What should happen after a successful mutation?",
      options: [
        "Affected queries may be invalidated",
        "Reload everything",
        "Delete state",
        "Do nothing"
      ],
      correctIndex: 0,
      explanation: "Invalidation helps synchronize cached reads."
    },
    {
      question: "What is a dependent query?",
      options: [
        "A query waiting for required input",
        "A query that never runs",
        "A CSS query",
        "A database-only query"
      ],
      correctIndex: 0,
      explanation: "It waits for another value."
    },
    {
      question: "Why paginate?",
      options: [
        "Limit data loaded at once",
        "Remove caching",
        "Remove API calls",
        "Replace React"
      ],
      correctIndex: 0,
      explanation: "Pagination controls request size."
    },
    {
      question: "What is prefetching?",
      options: [
        "Fetching likely-needed data early",
        "Deleting cache",
        "Rendering CSS",
        "Submitting"
      ],
      correctIndex: 0,
      explanation: "It anticipates a future request."
    },
    {
      question: "Why is optimistic UI risky?",
      options: [
        "The server can reject it",
        "React cannot render it",
        "It cannot use TS",
        "It disables HTTP"
      ],
      correctIndex: 0,
      explanation: "Optimistic changes need recovery if rejected."
    },
    {
      question: "What do Query DevTools show?",
      options: [
        "Query/cache state",
        "Git history",
        "CSS",
        "Database schema"
      ],
      correctIndex: 0,
      explanation: "They expose query client state."
    }
  ],
  project: {
    name: "Infinite Project Feed",
    goal: "Build a server-state-heavy project feed using TanStack Query.",
    brief: "Create an infinite project feed with caching, dependent data, mutations, optimistic updates, and prefetching.",
    steps: [
      "Configure QueryClient and QueryClientProvider.",
      "Create an infinite project query using cursor pagination.",
      "Display loading, error, empty, and success states.",
      "Create a project detail query keyed by project ID.",
      "Prefetch a project on hover.",
      "Add a mutation that invalidates affected queries.",
      "Add an optimistic favorite toggle with rollback.",
      "Inspect the cache with DevTools."
    ],
    acceptance: [
      "Different query keys separate cached data.",
      "The feed loads more pages.",
      "Project details use the project ID in the key.",
      "Successful mutations refresh affected data.",
      "Failed optimistic updates roll back.",
      "DevTools show the cache."
    ],
    stretch: [
      "Add offline-friendly behavior.",
      "Add bounded retry rules.",
      "Use useSuspenseQuery with Suspense.",
      "Prefetch the next page."
    ]
  }
};
