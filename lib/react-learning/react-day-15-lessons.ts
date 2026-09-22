import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_15_LESSONS: LessonDay = {
  day: 15,
  title: "Client-Side Routing",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "day1",
      title: "Why Client-Side Routing Exists",
      durationMinutes: 12,
      explanation: "A single-page React app can change screens without requesting a completely new HTML document. Client-side routing gives each screen a real URL while keeping the current application loaded. The browser History API provides primitives such as pushState() and popstate; a routing library turns those URL changes into React UI changes.",
      diagram: "Link click → History API → Router matches URL → React renders screen\nBack/Forward → popstate → Router → React",
      codeExample: {
        title: "History API",
        code: "window.history.pushState({}, \"\", \"/profile\");\nwindow.addEventListener(\"popstate\", () => {\n  console.log(window.location.pathname);\n});"
      },
      keyTakeaways: [
        "Client-side routing avoids full document navigation for normal in-app links.",
        "The History API is the browser primitive underneath many routers.",
        "A router connects URLs to React UI."
      ],
      commonMistakes: [
        "Using pushState manually throughout a large application.",
        "Treating React itself as the browser history manager.",
        "Forgetting that direct URLs still need server support."
      ],
      quiz: [
        {
          question: "Which browser API underlies client-side history routing?",
          options: [
            "History API",
            "Canvas API",
            "Clipboard API",
            "Web Audio API"
          ],
          correctIndex: 0,
          explanation: "The History API provides browser history manipulation."
        },
        {
          question: "What does pushState do?",
          options: [
            "Changes the URL without a full document navigation",
            "Fetches a database",
            "Renders JSX by itself",
            "Changes CSS"
          ],
          correctIndex: 0,
          explanation: "pushState changes the history entry and URL without loading a new document."
        }
      ]
    },
    {
      id: "day2",
      title: "React Router v7: Routes and Navigation",
      durationMinutes: 12,
      explanation: "React Router maps URL patterns to React elements. Link provides router-aware navigation, while useNavigate is useful when code needs to navigate after an action such as saving a form. Route definitions should stay understandable and focused on URL structure.",
      diagram: "URL → Routes → matching element\n/ → Home\n/projects → Projects\n/projects/:id → ProjectDetails",
      codeExample: {
        title: "Routes and navigation",
        code: "import { Link, Route, Routes, useNavigate } from \"react-router-dom\";\n\nfunction App() {\n  return (\n    <Routes>\n      <Route path=\"/\" element={<Home />} />\n      <Route path=\"/projects\" element={<Projects />} />\n      <Route path=\"/projects/:id\" element={<Project />} />\n    </Routes>\n  );\n}\n\nfunction Projects() {\n  const navigate = useNavigate();\n  return <button onClick={() => navigate(\"/projects/42\")}>Open</button>;\n}"
      },
      keyTakeaways: [
        "Routes map paths to elements.",
        "Use Link for normal navigation and useNavigate for programmatic navigation.",
        "Keep routing separate from ordinary component UI."
      ],
      commonMistakes: [
        "Using window.location for every internal navigation.",
        "Calling useNavigate outside a component or custom hook.",
        "Creating inconsistent URL structures."
      ],
      quiz: [
        {
          question: "Which component is for normal internal navigation?",
          options: [
            "Link",
            "Route",
            "Outlet",
            "Navigate"
          ],
          correctIndex: 0,
          explanation: "Link performs router-aware navigation."
        },
        {
          question: "When is useNavigate useful?",
          options: [
            "When code needs to trigger navigation",
            "For styling links",
            "For fetching data",
            "For CSS"
          ],
          correctIndex: 0,
          explanation: "useNavigate exposes navigation to component logic."
        }
      ]
    },
    {
      id: "day3",
      title: "Nested Routes, Params, and Query Params",
      durationMinutes: 12,
      explanation: "Nested routes let a parent provide shared UI while a child provides changing content. The parent normally renders Outlet. Dynamic route parameters identify resources such as /projects/42. Query parameters are useful for filters, sorting, pagination, and other shareable view state.",
      diagram: "/projects/42?tab=issues\n      │       └─ query parameter\n      └──────── route parameter\n\nLayout → Outlet → child page",
      codeExample: {
        title: "Params and search params",
        code: "import { Outlet, useParams, useSearchParams } from \"react-router-dom\";\n\nfunction ProjectLayout() {\n  return <><aside>Project navigation</aside><Outlet /></>;\n}\n\nfunction Project() {\n  const { id } = useParams();\n  const [params, setParams] = useSearchParams();\n  const tab = params.get(\"tab\") ?? \"overview\";\n  return <button onClick={() => setParams({tab:\"issues\"})}>\n    Project {id}: {tab}\n  </button>;\n}"
      },
      keyTakeaways: [
        "Nested routes share layouts through Outlet.",
        "Route params identify resources.",
        "Query params are useful for shareable URL-backed filters."
      ],
      commonMistakes: [
        "Assuming URL values are numbers automatically.",
        "Keeping shareable filters only in component state.",
        "Failing to validate query-string values."
      ],
      quiz: [
        {
          question: "What renders a matched child route?",
          options: [
            "Outlet",
            "Link",
            "Route",
            "History"
          ],
          correctIndex: 0,
          explanation: "Outlet is the placeholder for nested child content."
        },
        {
          question: "Which is a query parameter?",
          options: [
            "/projects/42",
            ":id",
            "?tab=issues",
            "/projects"
          ],
          correctIndex: 2,
          explanation: "The ?tab=issues portion is the query string."
        }
      ]
    },
    {
      id: "day4",
      title: "Loaders, Actions, and Protected Routes",
      durationMinutes: 12,
      explanation: "Modern React Router can associate route-level data loading and mutations with loaders and actions. This colocates data requirements with the route. Protected routes can redirect unauthenticated users, but this is only a UI flow; the server must still enforce authentication and authorization.",
      diagram: "Route\n├─ loader → read\n├─ action → write\n└─ element → UI\n\nAuth → page or redirect",
      codeExample: {
        title: "Protected route pattern",
        code: "function ProtectedLayout() {\n  const isAuthenticated = true;\n\n  if (!isAuthenticated) {\n    return <Navigate to=\"/login\" replace />;\n  }\n\n  return <Outlet />;\n}"
      },
      keyTakeaways: [
        "Loaders can colocate route data requirements.",
        "Actions can colocate route mutations.",
        "Client redirects are not a security boundary."
      ],
      commonMistakes: [
        "Putting secrets in client code.",
        "Treating route guards as backend authorization.",
        "Duplicating authentication logic in every child."
      ],
      quiz: [
        {
          question: "What is a loader for?",
          options: [
            "Route-level data loading",
            "CSS",
            "JSX transformation",
            "Database schema"
          ],
          correctIndex: 0,
          explanation: "A loader supplies data needed by a route."
        },
        {
          question: "Where must authorization ultimately be enforced?",
          options: [
            "Server/API",
            "Link",
            "Outlet",
            "History"
          ],
          correctIndex: 0,
          explanation: "The server must protect sensitive resources."
        }
      ]
    },
    {
      id: "day5",
      title: "Router Choice and Navigation UX",
      durationMinutes: 12,
      explanation: "React Router is practical for many client-only applications. TanStack Router emphasizes type-safe route definitions and inferred route information. Choose based on team familiarity, type-safety needs, data loading, ecosystem, and future framework direction. Good routing also considers focus, scroll restoration, and preserving useful URL state.",
      diagram: "Requirements → router choice\ntype safety / ecosystem / data loading / UX / framework direction",
      codeExample: {
        title: "Navigation design",
        code: "type ProjectFilters = {\n  search: string;\n  status: \"all\" | \"open\" | \"done\";\n};\n\n// Shareable filters → URL state\n// Temporary UI state → component/store state\n// Server records → server state"
      },
      keyTakeaways: [
        "Router choice is an architecture decision.",
        "URL state is useful when it should be shareable.",
        "Navigation UX includes focus and scroll behavior."
      ],
      commonMistakes: [
        "Choosing a router only because it is popular.",
        "Putting every UI toggle into the URL.",
        "Ignoring accessibility after navigation."
      ],
      quiz: [
        {
          question: "Why consider TanStack Router?",
          options: [
            "Strong type-safe routing",
            "It replaces React",
            "It removes HTTP",
            "It is required for JSX"
          ],
          correctIndex: 0,
          explanation: "TanStack Router emphasizes type-safe route definitions."
        },
        {
          question: "Which is often appropriate for a shareable filter?",
          options: [
            "URL state",
            "Random variable",
            "CSS",
            "DOM-only state"
          ],
          correctIndex: 0,
          explanation: "URL state survives refreshes and can be shared."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What browser mechanism underlies client-side routing?",
      options: [
        "History API",
        "Fetch API",
        "Canvas API",
        "WebSocket API"
      ],
      correctIndex: 0,
      explanation: "The History API manages browser history."
    },
    {
      question: "What does Link provide?",
      options: [
        "Client-side navigation",
        "Database access",
        "Validation",
        "CSS"
      ],
      correctIndex: 0,
      explanation: "Link performs router-aware navigation."
    },
    {
      question: "What does Outlet do?",
      options: [
        "Renders a matched child route",
        "Fetches data",
        "Creates a tab",
        "Validates auth"
      ],
      correctIndex: 0,
      explanation: "Outlet renders nested route content."
    },
    {
      question: "What is a route parameter?",
      options: [
        "A dynamic segment such as :id",
        "A hash only",
        "A CSS class",
        "A response header"
      ],
      correctIndex: 0,
      explanation: "Dynamic segments such as :id are route parameters."
    },
    {
      question: "What is a good use for query params?",
      options: [
        "Filters and pagination",
        "Secrets",
        "Passwords",
        "Component definitions"
      ],
      correctIndex: 0,
      explanation: "Query parameters work well for shareable view state."
    },
    {
      question: "Are client protected routes security?",
      options: [
        "Yes",
        "No",
        "Only in production",
        "Only with TypeScript"
      ],
      correctIndex: 1,
      explanation: "Backend authorization remains necessary."
    },
    {
      question: "What is a route loader for?",
      options: [
        "Route-level data loading",
        "Styling",
        "JSX",
        "Bundling"
      ],
      correctIndex: 0,
      explanation: "Loaders provide route data."
    },
    {
      question: "What should influence router choice?",
      options: [
        "Application requirements",
        "Only hype",
        "Only package size",
        "Only CSS"
      ],
      correctIndex: 0,
      explanation: "Routing should follow application needs."
    }
  ],
  project: {
    name: "Project Management Router",
    goal: "Build a multi-screen project management SPA with nested routes and URL-backed filters.",
    brief: "Create a React + TypeScript app with shared project layout, detail routes, URL query filters, a protected settings route, and a 404 page.",
    steps: [
      "Create Home, Projects, Project Details, and Settings routes.",
      "Build a shared ProjectLayout with an Outlet.",
      "Use /projects/:projectId for project details.",
      "Store project search and status filters in URLSearchParams.",
      "Use Link for normal navigation and useNavigate after a simulated save.",
      "Add a protected Settings route.",
      "Add a not-found route and intentional focus/scroll behavior."
    ],
    acceptance: [
      "Main screens have working URLs.",
      "Project IDs come from route parameters.",
      "Filters survive refresh.",
      "Nested project pages share one layout.",
      "Unauthenticated users are redirected from Settings.",
      "Unknown URLs show a 404 page."
    ],
    stretch: [
      "Add route loaders.",
      "Add a route action.",
      "Experiment with TanStack Router.",
      "Restore scroll position on navigation."
    ]
  }
};
