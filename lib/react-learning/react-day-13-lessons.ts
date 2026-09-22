import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_13_LESSONS: LessonDay = {
  day: 13,
  title: "Data Fetching and Server State",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
  {
    id: "day1",
    title: "Fetching Data in React",
    durationMinutes: 12,
    explanation: "Most real React applications need server data. A fetch is an asynchronous operation that asks an API for data and later receives a response.\n\nReact components should represent the UI for the current data state rather than trying to make asynchronous code itself part of JSX. A useful mental model is: request → loading → success or error.\n\nWhen fetching data, decide where the data belongs, how long it should live, and what should happen when the request fails.",
    diagram: "Component\n   │\n   ├── request starts → Loading\n   │\n   ├── response OK    → Data\n   │\n   └── request fails  → Error",
    codeExample: {
      title: "Fetching with an effect",
      code: "import { useEffect, useState } from \"react\";\n\nfunction Users() {\n  const [users, setUsers] = useState<string[]>([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch(\"/api/users\")\n      .then((response) => response.json())\n      .then(setUsers)\n      .finally(() => setLoading(false));\n  }, []);\n\n  if (loading) return <p>Loading...</p>;\n\n  return <ul>{users.map((user) => <li key={user}>{user}</li>)}</ul>;\n}"
    },
    keyTakeaways: [
      "Remote data has asynchronous states.",
      "UI should represent loading, success, and failure.",
      "A fetch call is not complete until its promise settles."
    ],
    commonMistakes: [
      "Rendering data before it exists.",
      "Ignoring non-OK HTTP responses.",
      "Creating a request during render instead of an effect or data-fetching abstraction."
    ],
    quiz: [
      {
        question: "Which state is commonly needed while a request is running?",
        options: [
          "Loading",
          "Compiled",
          "Styled",
          "Mounted"
        ],
        correctIndex: 0,
        explanation: "The UI often needs to distinguish an in-progress request from completed states."
      },
      {
        question: "What should the UI do when a request fails?",
        options: [
          "Pretend it succeeded",
          "Show an error state",
          "Reload forever",
          "Hide all components"
        ],
        correctIndex: 1,
        explanation: "A useful application exposes a recoverable error state."
      }
    ]
  },
  {
    id: "day2",
    title: "Loading, Error, Empty, and Success States",
    durationMinutes: 12,
    explanation: "A production data view usually has more states than simply \"data exists\" or \"data does not exist.\"\n\nLoading means the request is in progress. Error means the request failed. Empty means the request succeeded but there are no records. Success means useful data is available.\n\nSeparating these states prevents confusing interfaces, such as showing \"No users\" while the request is still running.",
    diagram: "Request state\n     │\n     ├── Loading → spinner/skeleton\n     ├── Error   → retry message\n     ├── Empty   → no-results message\n     └── Success → actual data",
    codeExample: {
      title: "Explicit request states",
      code: "type Status = \"idle\" | \"loading\" | \"success\" | \"error\";\n\nfunction UserList({ status, users }: {\n  status: Status;\n  users: string[];\n}) {\n  if (status === \"loading\") return <p>Loading...</p>;\n  if (status === \"error\") return <p>Could not load users.</p>;\n  if (status === \"success\" && users.length === 0) {\n    return <p>No users found.</p>;\n  }\n\n  return <ul>{users.map((user) => <li key={user}>{user}</li>)}</ul>;\n}"
    },
    keyTakeaways: [
      "Loading and empty are different states.",
      "Errors should be visible and actionable.",
      "Explicit state modeling reduces ambiguous UI."
    ],
    commonMistakes: [
      "Showing empty-state UI during loading.",
      "Using one boolean for several unrelated states.",
      "Rendering a blank screen on errors."
    ],
    quiz: [
      {
        question: "What does an empty state mean?",
        options: [
          "The request is still loading",
          "The request succeeded with no records",
          "The server is offline",
          "The component is unmounted"
        ],
        correctIndex: 1,
        explanation: "Empty means the operation succeeded but there is no data to display."
      },
      {
        question: "Why separate loading from empty?",
        options: [
          "They describe different situations",
          "React requires it",
          "CSS requires it",
          "It makes fetch synchronous"
        ],
        correctIndex: 0,
        explanation: "Users need different feedback for an in-progress request and a successful zero-result response."
      }
    ]
  },
  {
    id: "day3",
    title: "AbortController and Effect Cleanup",
    durationMinutes: 12,
    explanation: "A component can unmount or start a newer request before an older request finishes. AbortController lets you cancel a fetch request.\n\nCancellation is especially useful for search inputs, route changes, and components whose lifetime is shorter than the request.\n\nEffect cleanup should stop work that is no longer relevant. This reduces wasted work and helps prevent stale results from updating the UI.",
    diagram: "Effect starts request\n      │\n      ▼\nAbortController\n      │\n      ├── component still active → response\n      └── cleanup/unmount       → abort request",
    codeExample: {
      title: "Canceling a fetch",
      code: "useEffect(() => {\n  const controller = new AbortController();\n\n  fetch(\"/api/users\", { signal: controller.signal })\n    .then((response) => response.json())\n    .then(setUsers)\n    .catch((error) => {\n      if (error.name !== \"AbortError\") {\n        setError(\"Request failed\");\n      }\n    });\n\n  return () => controller.abort();\n}, []);"
    },
    keyTakeaways: [
      "AbortController can cancel fetch.",
      "Effect cleanup runs when an effect is replaced or removed.",
      "Cancellation is useful for stale or unnecessary requests."
    ],
    commonMistakes: [
      "Treating an aborted request as a normal server failure.",
      "Forgetting cleanup for long-running requests.",
      "Assuming cleanup only runs when the whole browser page closes."
    ],
    quiz: [
      {
        question: "What does AbortController provide for fetch?",
        options: [
          "A way to cancel it",
          "A database",
          "A router",
          "A CSS class"
        ],
        correctIndex: 0,
        explanation: "Passing its signal to fetch allows the request to be aborted."
      },
      {
        question: "When can an effect cleanup run?",
        options: [
          "Before an effect re-runs or when it unmounts",
          "Only after a page refresh",
          "Only after an API succeeds",
          "Never"
        ],
        correctIndex: 0,
        explanation: "React runs cleanup before replacing an effect and when the component unmounts."
      }
    ]
  },
  {
    id: "day4",
    title: "Caching and Server State",
    durationMinutes: 12,
    explanation: "Server state is data owned by a backend that your React application reads and often updates. It has different needs from local UI state because it can become stale, be shared across screens, and need refetching.\n\nRepeatedly writing custom fetch/loading/error/cache logic can become difficult. A server-state library can manage caching, deduplication (combining identical in-flight requests), refetching, and synchronization.\n\nThe key distinction is that local UI state describes the interface, while server state describes remote data.",
    diagram: "Local UI state              Server state\n   │                              │\n   ├── modal open                 ├── users\n   ├── selected tab               ├── orders\n   └── input value                └── profile\n                                      │\n                              cache / refetch / stale",
    codeExample: {
      title: "Conceptual server-state hook",
      code: "// Conceptual API; exact library syntax varies.\nfunction UserList() {\n  const { data, isPending, error } = useUsersQuery();\n\n  if (isPending) return <p>Loading...</p>;\n  if (error) return <p>Failed to load.</p>;\n\n  return data.map((user) => <p key={user.id}>{user.name}</p>);\n}"
    },
    keyTakeaways: [
      "Server state belongs to the backend.",
      "Caching reduces unnecessary requests.",
      "Libraries can centralize server-state behavior."
    ],
    commonMistakes: [
      "Putting every API response into Context.",
      "Treating server data exactly like a modal's local boolean.",
      "Building a custom cache without understanding invalidation."
    ],
    quiz: [
      {
        question: "Which is server state?",
        options: [
          "Modal visibility",
          "Input text",
          "Users fetched from an API",
          "Selected tab"
        ],
        correctIndex: 2,
        explanation: "Users from an API are owned by the server and can become stale."
      },
      {
        question: "What is deduplication in data fetching?",
        options: [
          "Combining identical in-flight requests",
          "Deleting duplicate UI",
          "Compressing CSS",
          "Removing routes"
        ],
        correctIndex: 0,
        explanation: "A data layer can avoid issuing the same active request multiple times."
      }
    ]
  },
  {
    id: "day5",
    title: "Mutations, Refetching, and Stale Data",
    durationMinutes: 12,
    explanation: "Fetching reads server state. Mutations create, update, or delete server state.\n\nAfter a mutation, the cached data shown on screen may no longer match the server. You can refetch affected data or update/invalidate the relevant cache.\n\nInvalidation means marking cached data as needing fresh information. The exact mechanism depends on the data-fetching library, but the architectural idea is the same: after a write, identify which reads may now be stale.",
    diagram: "UI\n │\n ├── GET users ──→ cache\n │\n └── POST user ──→ server changes\n                       │\n                       ▼\n                 invalidate/refetch\n                       │\n                       ▼\n                     cache",
    codeExample: {
      title: "Mutation followed by refresh",
      code: "async function createUser(name: string) {\n  const response = await fetch(\"/api/users\", {\n    method: \"POST\",\n    headers: { \"Content-Type\": \"application/json\" },\n    body: JSON.stringify({ name }),\n  });\n\n  if (!response.ok) {\n    throw new Error(\"Could not create user\");\n  }\n\n  // A server-state library could invalidate the users query here.\n}"
    },
    keyTakeaways: [
      "Mutations change server state.",
      "Writes can make existing cached reads stale.",
      "Refetch or invalidate affected data after successful mutations."
    ],
    commonMistakes: [
      "Assuming a successful POST automatically updates every screen.",
      "Updating one local copy while other cached copies remain stale.",
      "Ignoring mutation errors."
    ],
    quiz: [
      {
        question: "What can a mutation do?",
        options: [
          "Only read data",
          "Create, update, or delete server data",
          "Only change CSS",
          "Only change the URL"
        ],
        correctIndex: 1,
        explanation: "Mutations represent writes to server-owned data."
      },
      {
        question: "Why invalidate cached data after a write?",
        options: [
          "The old cache may be stale",
          "React requires it",
          "It deletes the server",
          "It prevents rendering"
        ],
        correctIndex: 0,
        explanation: "A successful write can change the data represented by existing cached reads."
      }
    ]
  }
],
  finalQuiz: [
  {
    question: "What are the common request states?",
    options: [
      "Loading, error, empty, success",
      "Only loading and CSS",
      "Mounted and unmounted only",
      "Open and closed only"
    ],
    correctIndex: 0,
    explanation: "Data views commonly model loading, error, empty, and success."
  },
  {
    question: "What does AbortController help with?",
    options: [
      "Canceling fetch requests",
      "Rendering JSX",
      "Creating routes",
      "Caching CSS"
    ],
    correctIndex: 0,
    explanation: "It can abort a fetch through its signal."
  },
  {
    question: "Why is empty different from loading?",
    options: [
      "Empty means a successful zero-result response",
      "They are identical",
      "Loading means server returned zero rows",
      "Empty means network failure"
    ],
    correctIndex: 0,
    explanation: "Empty and loading describe different points in the request lifecycle."
  },
  {
    question: "What is server state?",
    options: [
      "Data owned by the backend",
      "Only component-local booleans",
      "CSS variables",
      "Route definitions"
    ],
    correctIndex: 0,
    explanation: "Server state is remote data that can become stale."
  },
  {
    question: "What is cache invalidation for?",
    options: [
      "Marking cached data as needing fresh information",
      "Deleting React",
      "Changing JSX syntax",
      "Creating a component"
    ],
    correctIndex: 0,
    explanation: "Invalidation tells a data layer that cached reads may no longer be current."
  },
  {
    question: "Why can a data-fetching library be useful?",
    options: [
      "It can centralize caching and refetching",
      "It removes HTTP",
      "It replaces the backend",
      "It prevents all errors"
    ],
    correctIndex: 0,
    explanation: "Server-state libraries can handle common remote-data concerns."
  },
  {
    question: "What happens after a successful mutation?",
    options: [
      "Relevant reads may become stale",
      "All browser state disappears",
      "Routes are deleted",
      "React stops"
    ],
    correctIndex: 0,
    explanation: "A write can change data represented by existing cached queries."
  },
  {
    question: "Where should sensitive authorization be enforced?",
    options: [
      "The API/server",
      "A loading spinner",
      "NavLink",
      "A React key"
    ],
    correctIndex: 0,
    explanation: "Client UI checks are not a security boundary."
  }
],
  project: {
  name: "Remote User Directory",
  goal: "Build a user directory that handles realistic server-data states and updates.",
  brief: "Create a React + TypeScript user directory that loads users from an API, supports search, handles loading/error/empty/success states, cancels stale requests, and creates a new user.",
  steps: [
    "Create a typed User model with id and name fields.",
    "Fetch users from a REST endpoint and display a loading state.",
    "Handle non-OK responses and show a useful error state with retry.",
    "Show a dedicated empty state when the API returns no users.",
    "Add a search field and cancel stale requests with AbortController.",
    "Add a create-user form and send a POST request.",
    "After a successful mutation, refresh or invalidate the user list so the new user appears."
  ],
  acceptance: [
    "The UI clearly distinguishes loading, error, empty, and success states.",
    "Failed HTTP responses are treated as errors.",
    "Search does not allow stale requests to overwrite newer results.",
    "Creating a user updates the visible directory.",
    "All rendered users have stable keys.",
    "Network failures leave the application usable and recoverable."
  ],
  stretch: [
    "Add pagination.",
    "Add optimistic UI with a rollback strategy.",
    "Replace custom server-state logic with a dedicated server-state library.",
    "Add request retry with a bounded retry policy."
  ]
},
};
