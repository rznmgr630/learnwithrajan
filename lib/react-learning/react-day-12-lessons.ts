import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_12_LESSONS: LessonDay = {
  day: 12,
  title: "React Router and Client-Side Routing",
  totalMinutes: 72,
  difficulty: "Beginner",
  lessons: [
  {
    id: "day1",
    title: "React Router and Client-Side Routing",
    durationMinutes: 12,
    explanation: "A single-page React application can show different screens without asking the server for a completely new HTML document on every navigation. A client-side router maps the current URL to a React element tree.\n\nA route is a URL pattern such as `/`, `/profile`, or `/settings`. React Router lets your application connect those URLs to components.\n\nThe important mental model is: the browser URL changes, the router matches it, and React renders the route's element. The router does not magically create pages; your components still define the UI.\n\nRouting is useful when an application has multiple screens that should be addressable with normal URLs and browser navigation.",
    diagram: "Browser URL\n   │\n   ▼\nReact Router\n   │\n   ├── \"/\"        → Home\n   ├── \"/profile\" → Profile\n   └── \"/settings\"→ Settings\n                │\n                ▼\n             React UI",
    codeExample: {
      title: "Basic route setup",
      code: "import { BrowserRouter, Routes, Route } from \"react-router-dom\";\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path=\"/\" element={<Home />} />\n        <Route path=\"/profile\" element={<Profile />} />\n        <Route path=\"/settings\" element={<Settings />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}"
    },
    keyTakeaways: [
      "A route connects a URL pattern to UI.",
      "Client-side routing changes the rendered React tree without a full document navigation.",
      "The router and your components have separate responsibilities."
    ],
    commonMistakes: [
      "Thinking every URL needs a separate HTML file.",
      "Putting route logic into every component instead of keeping routing centralized.",
      "Using routing for a tiny component that does not need its own URL."
    ],
    quiz: [
      {
        question: "What is the main job of a client-side router?",
        options: [
          "Store component state",
          "Match URLs to UI",
          "Fetch every API request",
          "Style components"
        ],
        correctIndex: 1,
        explanation: "A router matches the current URL to the route configuration and renders the corresponding UI."
      },
      {
        question: "Which route would normally represent the application home page?",
        options: [
          "path=\"/\"",
          "path=\"/home.html\"",
          "path=\"root\"",
          "path=\"*home\""
        ],
        correctIndex: 0,
        explanation: "The root URL is represented by the `/` path."
      }
    ]
  },
  {
    id: "day2",
    title: "Links, Navigation, and Nested Routes",
    durationMinutes: 12,
    explanation: "Navigation should normally use router-aware links instead of ordinary document links when moving between routes inside a single-page application.\n\n`Link` performs client-side navigation. `NavLink` is useful when the navigation item needs to know whether its route is currently active.\n\nNested routes let a parent route provide shared layout while child routes provide the changing content. This is useful for dashboards, account areas, and settings sections.",
    diagram: "DashboardLayout\n ├── Sidebar\n └── <Outlet />\n       ├── Overview\n       ├── Billing\n       └── Team",
    codeExample: {
      title: "Navigation and nested routes",
      code: "import { NavLink, Outlet } from \"react-router-dom\";\n\nfunction DashboardLayout() {\n  return (\n    <div>\n      <nav>\n        <NavLink to=\"/dashboard\">Overview</NavLink>\n        <NavLink to=\"/dashboard/team\">Team</NavLink>\n      </nav>\n\n      <Outlet />\n    </div>\n  );\n}"
    },
    keyTakeaways: [
      "Use Link or NavLink for internal navigation.",
      "NavLink can style the active route.",
      "Outlet renders the matched child route inside a parent layout."
    ],
    commonMistakes: [
      "Using `<a href>` for every internal route and causing unnecessary document navigation.",
      "Forgetting `<Outlet />` in a parent route that expects children.",
      "Duplicating dashboard layout markup in every child page."
    ],
    quiz: [
      {
        question: "Which component is useful for an active navigation state?",
        options: [
          "Link",
          "NavLink",
          "Outlet",
          "Route"
        ],
        correctIndex: 1,
        explanation: "NavLink exposes active-route state for navigation UI."
      },
      {
        question: "Where does a nested route normally render?",
        options: [
          "Inside Outlet",
          "Inside BrowserRouter only",
          "Inside Link",
          "Inside the URL bar"
        ],
        correctIndex: 0,
        explanation: "Outlet is the placeholder for a matched child route."
      }
    ]
  },
  {
    id: "day3",
    title: "URL Parameters and Query Strings",
    durationMinutes: 12,
    explanation: "Dynamic routes let a URL identify a resource. For example, `/users/42` can represent the profile for user 42.\n\nA route parameter is part of the route pattern, such as `:userId`. Query parameters are the key-value pairs after `?`, such as `?tab=posts&sort=latest`.\n\nUse route parameters when the value identifies the resource in the route. Use query parameters for optional view state such as filters, sorting, pagination, or search terms.",
    diagram: "Route:\n /users/:userId\n          │\n          └── params.userId\n\nURL:\n /users/42?tab=posts\n          │       │\n          │       └── query: tab=posts\n          └── param: userId=42",
    codeExample: {
      title: "Reading params and search params",
      code: "import { useParams, useSearchParams } from \"react-router-dom\";\n\nfunction UserPage() {\n  const { userId } = useParams();\n  const [searchParams] = useSearchParams();\n\n  const tab = searchParams.get(\"tab\");\n\n  return <h1>User {userId}, tab: {tab}</h1>;\n}"
    },
    keyTakeaways: [
      "Route parameters identify resources.",
      "Query parameters are useful for filters and view state.",
      "Treat URL values as strings unless you intentionally parse them."
    ],
    commonMistakes: [
      "Assuming `userId` is already a number.",
      "Putting every piece of component state into the URL.",
      "Using query parameters when the value is required to identify the resource."
    ],
    quiz: [
      {
        question: "What does `:userId` represent in `/users/:userId`?",
        options: [
          "A query string",
          "A dynamic route parameter",
          "A CSS selector",
          "A component prop automatically named userId"
        ],
        correctIndex: 1,
        explanation: "The colon introduces a dynamic route parameter."
      },
      {
        question: "Which URL contains a query parameter?",
        options: [
          "/users/42",
          "/users/:id",
          "/users/42?tab=posts",
          "/users"
        ],
        correctIndex: 2,
        explanation: "The `?tab=posts` portion is a query string."
      }
    ]
  },
  {
    id: "day4",
    title: "Route Guards, Redirects, and 404 Pages",
    durationMinutes: 12,
    explanation: "A protected route is a route whose UI depends on some condition, commonly whether a user is authenticated. The route guard should decide what to render based on known application state.\n\nRedirects are navigation decisions. For example, an authenticated user may be redirected away from a login screen.\n\nA catch-all route can render a 404 page when no other route matches. Keep authorization enforcement on the server too; hiding a route in React is not a security boundary.",
    diagram: "Request URL\n   │\n   ▼\nAuth state?\n ├── yes → Protected page\n └── no  → Login\n                 │\n                 ▼\n              Server still\n              enforces access",
    codeExample: {
      title: "Protected route pattern",
      code: "import { Navigate, Outlet } from \"react-router-dom\";\n\nfunction ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {\n  if (!isAuthenticated) {\n    return <Navigate to=\"/login\" replace />;\n  }\n\n  return <Outlet />;\n}"
    },
    keyTakeaways: [
      "Client-side guards control the UI flow.",
      "Server-side authorization is still required.",
      "A catch-all route is useful for 404 handling."
    ],
    commonMistakes: [
      "Treating a React route guard as backend security.",
      "Redirecting users in effects when a direct render decision is enough.",
      "Forgetting a fallback route for unknown URLs."
    ],
    quiz: [
      {
        question: "What should actually enforce authorization for sensitive data?",
        options: [
          "Only React Router",
          "Only CSS",
          "The server/API",
          "The browser history"
        ],
        correctIndex: 2,
        explanation: "The server must enforce access because client code can be modified or bypassed."
      },
      {
        question: "What can `<Navigate />` do?",
        options: [
          "Render CSS",
          "Perform a declarative redirect",
          "Create an API server",
          "Read a database"
        ],
        correctIndex: 1,
        explanation: "Navigate changes the current route declaratively."
      }
    ]
  },
  {
    id: "day5",
    title: "Routing Architecture and Route-Level UX",
    durationMinutes: 12,
    explanation: "As an application grows, routing becomes an architecture concern. Group routes by product area, keep layouts close to the routes they serve, and avoid putting all route decisions into one giant component.\n\nRoute-level loading and error experiences should be intentional. Users should know when a screen is loading, when navigation failed, and when a URL does not exist.\n\nA good route structure should make URLs predictable and components easy to locate.",
    diagram: "App\n├── Public routes\n│   ├── Home\n│   └── Login\n└── App routes\n    ├── Dashboard\n    │   ├── Overview\n    │   └── Team\n    └── Settings",
    codeExample: {
      title: "Route organization",
      code: "const appRoutes = [\n  {\n    path: \"/dashboard\",\n    element: <DashboardLayout />,\n    children: [\n      { index: true, element: <DashboardHome /> },\n      { path: \"team\", element: <Team /> },\n    ],\n  },\n];"
    },
    keyTakeaways: [
      "Routes are part of application architecture.",
      "Nested layouts reduce duplication.",
      "Design URL structure deliberately instead of letting it emerge randomly."
    ],
    commonMistakes: [
      "Creating one enormous route configuration that is difficult to navigate.",
      "Duplicating layouts across sibling pages.",
      "Ignoring loading, error, and not-found states."
    ],
    quiz: [
      {
        question: "Why are nested layouts useful?",
        options: [
          "They remove all components",
          "They reduce repeated shared UI",
          "They disable navigation",
          "They replace APIs"
        ],
        correctIndex: 1,
        explanation: "A parent layout can render shared UI once and an Outlet for child content."
      },
      {
        question: "What should a mature route architecture consider?",
        options: [
          "Only URL colors",
          "Only component names",
          "URL structure and route-level UX",
          "Only CSS"
        ],
        correctIndex: 2,
        explanation: "Good routing includes predictable URLs and intentional loading/error/not-found experiences."
      }
    ]
  },
  {
    id: "day6",
    title: "Project Structure, Modules, and DevTools",
    durationMinutes: 12,
    explanation: "Routing is easier to maintain when related pages, layouts, hooks, and route configuration have a predictable home. Start with a simple structure, then group code by feature as the application grows.\n\nUse named exports for utilities and hooks, and keep route layouts close to the screens they serve. React DevTools helps inspect the component tree, props, state, and rendering behavior while you build.",
    diagram: "src/\n├── features/\n│   ├── projects/\n│   │   ├── pages/\n│   │   └── routes.tsx\n│   └── settings/\n├── components/\n└── app/\n    └── router.tsx",
    codeExample: {
      title: "Feature-based route organization",
      code: "// features/projects/routes.tsx\nexport const projectRoutes = [\n  { index: true, element: <ProjectsPage /> },\n  { path: \":projectId\", element: <ProjectPage /> },\n];\n\n// app/router.tsx\n<Route path=\"projects\" element={<ProjectsLayout />}>\n  {projectRoutes.map((route) => <Route key={route.path ?? \"index\"} {...route} />)}\n</Route>"
    },
    keyTakeaways: [
      "Keep related route code close together.",
      "Use named exports for shared hooks and utilities.",
      "Use React DevTools to inspect state and rendering behavior."
    ],
    commonMistakes: [
      "Putting every route and page in one large file.",
      "Using unclear relative imports that become fragile as files move.",
      "Debugging a rendering issue without first inspecting props and state."
    ],
    quiz: [
      {
        question: "What is a useful reason to group files by feature?",
        options: ["It keeps related code together", "It removes all imports", "It replaces routing", "It makes CSS unnecessary"],
        correctIndex: 0,
        explanation: "Feature folders make it easier to find and change code that belongs to one product area."
      },
      {
        question: "Which tool helps inspect a React component's props and state?",
        options: ["React DevTools", "Git", "npm", "CSS"],
        correctIndex: 0,
        explanation: "React DevTools exposes the component tree and current component data."
      }
    ]
  }
],
  finalQuiz: [
  {
    question: "What does a client-side router primarily connect?",
    options: [
      "URLs and React UI",
      "Databases and CSS",
      "Images and npm",
      "Git and browsers"
    ],
    correctIndex: 0,
    explanation: "Routing maps URLs to React UI."
  },
  {
    question: "Why use NavLink?",
    options: [
      "To make API calls",
      "To detect active navigation state",
      "To create reducers",
      "To validate forms"
    ],
    correctIndex: 1,
    explanation: "NavLink is designed for navigation links that need active-route information."
  },
  {
    question: "Where does a nested child route render?",
    options: [
      "Outlet",
      "Link",
      "Navigate",
      "useParams"
    ],
    correctIndex: 0,
    explanation: "Outlet is the placeholder for nested route content."
  },
  {
    question: "Which is a route parameter?",
    options: [
      "/users?sort=latest",
      "/users/:id",
      "/users",
      "?page=2"
    ],
    correctIndex: 1,
    explanation: "`:id` is a dynamic route parameter."
  },
  {
    question: "Which is a query parameter example?",
    options: [
      "/products/42",
      "/products/:id",
      "/products?sort=price",
      "/products"
    ],
    correctIndex: 2,
    explanation: "The `?sort=price` portion is a query parameter."
  },
  {
    question: "Can a React route guard secure an API by itself?",
    options: [
      "Yes",
      "No",
      "Only in development",
      "Only with TypeScript"
    ],
    correctIndex: 1,
    explanation: "Security-sensitive authorization must be enforced by the server."
  },
  {
    question: "What is a catch-all route commonly used for?",
    options: [
      "404 handling",
      "Database migrations",
      "CSS resets",
      "State initialization"
    ],
    correctIndex: 0,
    explanation: "A catch-all route can render a not-found screen."
  },
  {
    question: "What is one benefit of nested routing?",
    options: [
      "Less shared layout duplication",
      "No browser URLs",
      "No components",
      "Automatic database security"
    ],
    correctIndex: 0,
    explanation: "Parent layouts can be shared across child routes."
  }
],
  project: {
  name: "Multi-Page Profile App",
  goal: "Build a small profile application with multiple URL-addressable screens and shared navigation.",
  brief: "Create a React + TypeScript app with Home, Profile, Projects, and Settings routes. Practice route parameters, query strings, nested layouts, navigation, and a 404 page.",
  steps: [
    "Set up routes for Home, Profile, Projects, and Settings.",
    "Create a shared navigation using NavLink and show the active route.",
    "Create a dynamic `/projects/:projectId` route that displays the project ID.",
    "Add a Projects search/filter state represented in the query string.",
    "Create a nested Settings layout with Profile and Preferences child routes.",
    "Add a protected Settings section using a simple `isAuthenticated` value.",
    "Add a catch-all route that renders a clear 404 page."
  ],
  acceptance: [
    "Every main screen has a predictable URL.",
    "Internal navigation does not require manually editing the browser URL.",
    "Active navigation is visibly different.",
    "Project IDs are read from route parameters.",
    "At least one filter is represented in the query string.",
    "Unknown URLs render a 404 screen.",
    "Protected UI is guarded in the client while sensitive authorization remains a server responsibility."
  ],
  stretch: [
    "Add a route-level loading experience.",
    "Preserve a search filter when navigating between project pages.",
    "Add a shared authenticated layout with nested routes.",
    "Add a route for `/projects/:projectId/settings`."
  ]
},
};
