import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_17_LESSONS: LessonDay = {
  day: 17,
  title: "Client State Management",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "day1",
      title: "Server State vs Client State",
      durationMinutes: 12,
      explanation: "Before choosing a state library, classify the state. Server state is owned by an API: users, orders, projects, messages. Client state belongs to the browser application: a sidebar's open state, a selected tab, or a temporary UI mode. URL state and form state also have useful specialized homes.",
      diagram: "Server data → TanStack Query\nUI/client data → useState/useReducer/store\nURL data → router/search params\nForm data → form APIs",
      codeExample: {
        title: "State classification",
        code: "const state = {\n  projects: \"server state\",\n  sidebarOpen: \"UI state\",\n  filter: \"URL state\",\n  signup: \"form state\",\n};"
      },
      keyTakeaways: [
        "Different state types have different lifecycles.",
        "Not all state belongs in a global store.",
        "Classification should happen before library selection."
      ],
      commonMistakes: [
        "Putting every API response into Redux/Zustand.",
        "Globalizing temporary input state.",
        "Using Context simply because something is shared once."
      ],
      quiz: [
        {
          question: "Which is server state?",
          options: [
            "Fetched projects",
            "Sidebar state",
            "Selected tab",
            "Modal visibility"
          ],
          correctIndex: 0,
          explanation: "Fetched projects are server-owned data."
        },
        {
          question: "Which is UI state?",
          options: [
            "Whether a modal is open",
            "An API user record",
            "An order",
            "A backend job"
          ],
          correctIndex: 0,
          explanation: "Modal visibility is local interface state."
        }
      ]
    },
    {
      id: "day2",
      title: "Context and Zustand",
      durationMinutes: 12,
      explanation: "Context is often enough for small shared client state. But every consumer can re-render when a context value changes. Zustand provides a small external store and lets components select the exact slice they need. Neither tool should automatically become the home for all application state.",
      diagram: "Shared client state\n├─ Context → Provider + consumers\n└─ Zustand → store + selectors",
      codeExample: {
        title: "Zustand selector",
        code: "import { create } from \"zustand\";\n\ntype UIStore = {\n  sidebarOpen: boolean;\n  toggleSidebar: () => void;\n};\n\nexport const useUIStore = create<UIStore>(set => ({\n  sidebarOpen: true,\n  toggleSidebar: () =>\n    set(state => ({ sidebarOpen: !state.sidebarOpen })),\n}));\n\nfunction Button() {\n  const toggle = useUIStore(state => state.toggleSidebar);\n  return <button onClick={toggle}>Toggle</button>;\n}"
      },
      keyTakeaways: [
        "Context and Zustand both share client state.",
        "Selectors can narrow Zustand subscriptions.",
        "Use the smallest tool that solves the problem."
      ],
      commonMistakes: [
        "Making everything global.",
        "Selecting the entire Zustand store unnecessarily.",
        "Adding a library before identifying a real problem."
      ],
      quiz: [
        {
          question: "What does a Zustand selector do?",
          options: [
            "Selects subscribed state",
            "Creates a database query",
            "Defines a route",
            "Changes CSS"
          ],
          correctIndex: 0,
          explanation: "Selectors let components subscribe to the state they need."
        },
        {
          question: "Can Context solve prop drilling?",
          options: [
            "Yes",
            "No",
            "Only with Redux",
            "Only on server"
          ],
          correctIndex: 0,
          explanation: "Context is designed for sharing values without passing props through every layer."
        }
      ]
    },
    {
      id: "day3",
      title: "Redux Toolkit and Structured State",
      durationMinutes: 12,
      explanation: "Redux Toolkit provides a structured client-state model using configureStore, createSlice, actions, and reducers. A slice groups a section of state with the logic that changes it. Redux Toolkit uses Immer internally, allowing reducer code to look mutable while producing immutable updates.\n\nIt can be useful when a team benefits from explicit action flows, centralized state, middleware, and mature DevTools. It is not required for every application.",
      diagram: "Component → dispatch(action) → store → slice reducer → new state → subscribers",
      codeExample: {
        title: "Redux Toolkit slice",
        code: "const cartSlice = createSlice({\n  name: \"cart\",\n  initialState: { count: 0 },\n  reducers: {\n    addItem(state) {\n      state.count += 1;\n    },\n  },\n});\n\nexport const { addItem } = cartSlice.actions;"
      },
      keyTakeaways: [
        "Slices group state and reducers.",
        "Actions describe state changes.",
        "Immer lets Redux Toolkit reducers use convenient mutation-like syntax."
      ],
      commonMistakes: [
        "Starting with old Redux boilerplate.",
        "Putting server cache into Redux unnecessarily.",
        "Creating one giant slice for everything."
      ],
      quiz: [
        {
          question: "What does createSlice provide?",
          options: [
            "State, reducers, and generated actions",
            "CSS",
            "Routes",
            "API endpoints"
          ],
          correctIndex: 0,
          explanation: "createSlice groups state and reducer logic."
        },
        {
          question: "Does every React app need Redux Toolkit?",
          options: [
            "No",
            "Yes",
            "Only TypeScript apps",
            "Only Next.js"
          ],
          correctIndex: 0,
          explanation: "Many apps need only local state, Context, or a smaller store."
        }
      ]
    },
    {
      id: "day4",
      title: "Jotai, Persistence, and Subscriptions",
      durationMinutes: 12,
      explanation: "Jotai uses an atomic state model: small atoms can be read and updated independently. Persisting client state can be useful for preferences such as theme. localStorage is a browser API, so code using it must account for environments where window is unavailable, especially in server-rendered applications.",
      diagram: "Store\n├─ theme atom\n├─ cart atom\n└─ sidebar atom\n\nComponent subscribes only to needed atom",
      codeExample: {
        title: "Browser persistence",
        code: "localStorage.setItem(\"theme\", \"dark\");\nconst theme = localStorage.getItem(\"theme\") ?? \"system\";"
      },
      keyTakeaways: [
        "Jotai models state as atoms.",
        "Persist only state that should survive reloads.",
        "Browser storage is not automatically available on the server."
      ],
      commonMistakes: [
        "Persisting sensitive data in localStorage.",
        "Persisting temporary state unnecessarily.",
        "Reading localStorage during server rendering."
      ],
      quiz: [
        {
          question: "What is a Jotai atom?",
          options: [
            "A small unit of state",
            "A database table",
            "A route",
            "A CSS selector"
          ],
          correctIndex: 0,
          explanation: "Atoms are Jotai's core state unit."
        },
        {
          question: "What is localStorage?",
          options: [
            "Browser storage",
            "Server memory",
            "Database",
            "React hook"
          ],
          correctIndex: 0,
          explanation: "localStorage stores string data in the browser."
        }
      ]
    },
    {
      id: "day5",
      title: "Choosing a Client-State Strategy",
      durationMinutes: 12,
      explanation: "A practical decision tree is: server-owned data → server-state tooling; local component state → useState; simple shared state → Context; larger client-state domains → consider Zustand or Redux Toolkit; atomic state → consider Jotai; shareable filters → URL state; complex forms → form tooling.\n\nA single global store for everything creates coupling and makes ownership unclear.",
      diagram: "State\n├─ server? → Query cache\n├─ local? → useState\n├─ shared/simple? → Context\n├─ large client domain? → Zustand/Redux\n├─ atomic? → Jotai\n└─ shareable? → URL",
      codeExample: {
        title: "Decision checklist",
        code: "const state = {\n  users: \"server → TanStack Query\",\n  sidebarOpen: \"UI → useState/store\",\n  filter: \"URL → search params\",\n  signup: \"form → form APIs\",\n};"
      },
      keyTakeaways: [
        "State management is an architecture decision.",
        "Different state types can use different tools.",
        "Avoid globalizing state without a reason."
      ],
      commonMistakes: [
        "Using Redux for every boolean.",
        "Using Context as a universal database.",
        "Confusing server cache with client state."
      ],
      quiz: [
        {
          question: "What should you decide before choosing a state library?",
          options: [
            "What kind of state you have",
            "Which library is trending",
            "CSS framework",
            "Browser"
          ],
          correctIndex: 0,
          explanation: "State ownership should determine the tool."
        },
        {
          question: "Where should shareable filters often live?",
          options: [
            "URL",
            "Global variable",
            "CSS",
            "DOM only"
          ],
          correctIndex: 0,
          explanation: "URL state is durable and shareable."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What is the first state-management question?",
      options: [
        "Server or client state?",
        "Should I use Redux?",
        "Should I use CSS?",
        "Should everything be global?"
      ],
      correctIndex: 0,
      explanation: "Classification prevents unnecessary libraries."
    },
    {
      question: "What can Context solve?",
      options: [
        "Prop drilling",
        "Server caching",
        "Database transactions",
        "HTTP retries"
      ],
      correctIndex: 0,
      explanation: "Context shares values through a tree."
    },
    {
      question: "What is a Zustand selector for?",
      options: [
        "Subscribing to a state slice",
        "Routing",
        "Fetching HTML",
        "Creating forms"
      ],
      correctIndex: 0,
      explanation: "Selectors narrow subscriptions."
    },
    {
      question: "What does createSlice provide?",
      options: [
        "Reducers and generated actions",
        "Router",
        "Server",
        "CSS compiler"
      ],
      correctIndex: 0,
      explanation: "It groups state and reducer logic."
    },
    {
      question: "What is Jotai's mental model?",
      options: [
        "Atoms",
        "Routes",
        "Reducers only",
        "Query strings"
      ],
      correctIndex: 0,
      explanation: "Jotai models state as atoms."
    },
    {
      question: "Should every API response go into a client store?",
      options: [
        "Yes",
        "No",
        "Only TS",
        "Only development"
      ],
      correctIndex: 1,
      explanation: "Server-state tooling is better suited to API data."
    },
    {
      question: "Why use localStorage carefully in SSR?",
      options: [
        "window is unavailable on the server",
        "It cannot store strings",
        "React disables it",
        "It is a database"
      ],
      correctIndex: 0,
      explanation: "Browser APIs are unavailable during server rendering."
    },
    {
      question: "What is a useful state principle?",
      options: [
        "Use the smallest appropriate tool",
        "Globalize everything",
        "Avoid all state",
        "Always Redux"
      ],
      correctIndex: 0,
      explanation: "Simple state should remain simple."
    }
  ],
  project: {
    name: "Shared Workspace State",
    goal: "Practice choosing the right client-state strategy for different UI state.",
    brief: "Build a workspace dashboard using local state, Zustand, Redux Toolkit, Jotai, and persistence intentionally.",
    steps: [
      "Keep a local modal/input with useState.",
      "Create shared sidebar state with Zustand.",
      "Use a selector for the sidebar button.",
      "Persist a theme preference to localStorage.",
      "Create a Redux Toolkit notification slice.",
      "Create one Jotai atom for a small independent preference.",
      "Document why each state category uses its chosen tool."
    ],
    acceptance: [
      "Server data is not duplicated into client stores.",
      "A Zustand selector limits a subscription.",
      "Theme survives reload.",
      "Redux state changes through actions/reducers.",
      "A state-classification document explains the choices."
    ],
    stretch: [
      "Add Zustand DevTools.",
      "Inspect Redux with DevTools.",
      "Persist selected Redux state.",
      "Compare one area implemented with Context."
    ]
  }
};
