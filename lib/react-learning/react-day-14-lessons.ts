import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_14_LESSONS: LessonDay = {
  day: 14,
  title: "React Performance and Optimization",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
  {
    id: "day1",
    title: "Performance: Render, Commit, and Re-render",
    durationMinutes: 12,
    explanation: "React performance starts with understanding when components render. A state or prop change can cause a component to render again. Rendering means React calculates what the UI should look like for the current state.\n\nReact then commits the necessary changes to the DOM. A re-render does not automatically mean every DOM node is recreated.\n\nPerformance work should begin with measurement. First identify what is slow, then determine whether rendering, JavaScript work, network requests, or DOM work is responsible.",
    diagram: "State/props change\n       │\n       ▼\nReact render\n       │\n       ▼\nCompare result\n       │\n       ▼\nCommit needed DOM changes",
    codeExample: {
      title: "Parent and child renders",
      code: "function Parent() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <>\n      <button onClick={() => setCount(count + 1)}>\n        {count}\n      </button>\n      <Child />\n    </>\n  );\n}"
    },
    keyTakeaways: [
      "Rendering is not the same as replacing the whole DOM.",
      "A parent render can cause child components to render.",
      "Measure before optimizing."
    ],
    commonMistakes: [
      "Assuming every render is a performance bug.",
      "Adding memoization everywhere without measurement.",
      "Blaming React for slow network or expensive backend work."
    ],
    quiz: [
      {
        question: "What does a React render calculate?",
        options: [
          "What the UI should look like",
          "A database schema",
          "A CSS file",
          "An HTTP status"
        ],
        correctIndex: 0,
        explanation: "Rendering calculates the UI representation for the current state and props."
      },
      {
        question: "What should usually come before optimization?",
        options: [
          "Measurement",
          "Random memoization",
          "Removing all state",
          "Changing every component"
        ],
        correctIndex: 0,
        explanation: "You need evidence about the actual bottleneck before optimizing."
      }
    ]
  },
  {
    id: "day2",
    title: "Memoization with memo, useMemo, and useCallback",
    durationMinutes: 12,
    explanation: "Memoization means remembering a computed result so it can be reused when its inputs have not changed.\n\n`memo` can skip a child component render when its props are unchanged. `useMemo` can cache an expensive calculated value. `useCallback` can preserve a function reference between renders.\n\nThese tools have a cost too. They add complexity and comparison work. Use them when they address a measured or clearly understood rendering problem, not as a default rule for every component.",
    diagram: "Parent render\n    │\n    ├── stable props → memoized child can skip\n    │\n    └── changed props → child renders",
    codeExample: {
      title: "Memoizing an expensive calculation",
      code: "const filteredUsers = useMemo(() => {\n  return users\n    .filter((user) => user.name.includes(query))\n    .sort((a, b) => a.name.localeCompare(b.name));\n}, [users, query]);"
    },
    keyTakeaways: [
      "memo, useMemo, and useCallback solve different problems.",
      "Stable references can matter when children are memoized.",
      "Memoization is an optimization, not a correctness requirement."
    ],
    commonMistakes: [
      "Using useMemo for trivial calculations.",
      "Using useCallback on every function automatically.",
      "Assuming memo prevents all child renders regardless of changed props."
    ],
    quiz: [
      {
        question: "What does useMemo cache?",
        options: [
          "A calculated value",
          "A DOM node permanently",
          "An HTTP server",
          "A route"
        ],
        correctIndex: 0,
        explanation: "useMemo caches the result of a calculation between renders when dependencies are unchanged."
      },
      {
        question: "What is memo primarily about?",
        options: [
          "Skipping a component render when props are unchanged",
          "Fetching data",
          "Changing URLs",
          "Managing forms"
        ],
        correctIndex: 0,
        explanation: "memo can skip a child render when its props compare as unchanged."
      }
    ]
  },
  {
    id: "day3",
    title: "Lists, Keys, and Rendering Efficiency",
    durationMinutes: 12,
    explanation: "Large lists can become expensive because the application may create many elements and perform substantial work when the data changes.\n\nKeys help React identify which list items correspond to which previous items. Stable keys are important for correctness and efficient reconciliation (React's process for matching the new UI with the previous UI).\n\nFor very large lists, optimization may involve pagination or virtualization. Virtualization renders only the rows near the visible viewport instead of thousands of DOM nodes at once.",
    diagram: "10,000 records\n      │\n      ├── naive → 10,000 DOM rows\n      │\n      └── virtualized → visible rows + small buffer",
    codeExample: {
      title: "Stable list keys",
      code: "function UserList({ users }: { users: { id: string; name: string }[] }) {\n  return (\n    <ul>\n      {users.map((user) => (\n        <li key={user.id}>{user.name}</li>\n      ))}\n    </ul>\n  );\n}"
    },
    keyTakeaways: [
      "Keys should be stable and identify the item.",
      "Large lists may need pagination or virtualization.",
      "List performance is both React work and DOM work."
    ],
    commonMistakes: [
      "Using array indexes as keys for reorderable lists.",
      "Rendering thousands of expensive rows unnecessarily.",
      "Thinking keys are just warnings rather than part of reconciliation."
    ],
    quiz: [
      {
        question: "Why do list keys matter?",
        options: [
          "They help React identify items",
          "They add CSS",
          "They fetch data",
          "They encrypt IDs"
        ],
        correctIndex: 0,
        explanation: "Stable keys help React match items between renders."
      },
      {
        question: "What does virtualization do?",
        options: [
          "Renders only a small visible portion of a large list",
          "Deletes the database",
          "Caches every API call",
          "Prevents all renders"
        ],
        correctIndex: 0,
        explanation: "Virtualization limits DOM work for very large collections."
      }
    ]
  },
  {
    id: "day4",
    title: "Code Splitting, Lazy Loading, and Suspense",
    durationMinutes: 12,
    explanation: "A large JavaScript bundle can slow the first load. Code splitting divides the application into smaller chunks that can be loaded when needed.\n\nReact.lazy lets a component be loaded asynchronously. Suspense provides fallback UI while the lazy component is not ready.\n\nRoute-level code splitting is a common strategy because users often do not need every application screen on the first load.",
    diagram: "Initial bundle\n ├── Home\n ├── shared code\n └── router\n\nLater chunk\n └── Admin dashboard\n        │\n        ▼\n     loaded on demand",
    codeExample: {
      title: "Lazy-loading a component",
      code: "import { lazy, Suspense } from \"react\";\n\nconst Admin = lazy(() => import(\"./Admin\"));\n\nfunction App() {\n  return (\n    <Suspense fallback={<p>Loading admin...</p>}>\n      <Admin />\n    </Suspense>\n  );\n}"
    },
    keyTakeaways: [
      "Code splitting can reduce initial JavaScript.",
      "lazy loads a component asynchronously.",
      "Suspense supplies fallback UI for supported async boundaries."
    ],
    commonMistakes: [
      "Lazy-loading tiny components without a real benefit.",
      "Forgetting a Suspense boundary around lazy content.",
      "Assuming code splitting improves backend performance."
    ],
    quiz: [
      {
        question: "What is code splitting?",
        options: [
          "Dividing JavaScript into loadable chunks",
          "Splitting a database table",
          "Splitting CSS selectors",
          "Creating two browsers"
        ],
        correctIndex: 0,
        explanation: "Code splitting divides the application bundle into chunks that can be loaded separately."
      },
      {
        question: "What does Suspense provide here?",
        options: [
          "Fallback UI while lazy content loads",
          "API authorization",
          "Database caching",
          "Form validation"
        ],
        correctIndex: 0,
        explanation: "Suspense can show fallback content while a lazy component is loading."
      }
    ]
  },
  {
    id: "day5",
    title: "Profiling and Practical Performance Strategy",
    durationMinutes: 12,
    explanation: "Performance debugging should be systematic. Use browser DevTools for network and browser work, and React DevTools Profiler for React rendering behavior.\n\nAsk where the time goes: network, JavaScript computation, React rendering, DOM/layout, or server response. Fix the largest measured bottleneck first.\n\nGood performance is also about user experience. Prefer fast initial content, responsive interactions, useful loading states, and avoiding unnecessary work over chasing tiny theoretical improvements.",
    diagram: "Measure\n  │\n  ├── Network slow? → API/cache/request strategy\n  ├── JS slow?      → computation/bundle\n  ├── React slow?   → rendering/component structure\n  └── DOM slow?     → nodes/layout/paint\n           │\n           ▼\n        Optimize\n           │\n           ▼\n         Measure again",
    codeExample: {
      title: "Measure before and after",
      code: "// Example workflow:\n// 1. Record the slow interaction.\n// 2. Profile the React render.\n// 3. Inspect the Network tab.\n// 4. Identify the largest bottleneck.\n// 5. Apply one focused optimization.\n// 6. Measure again.\n\nfunction ExpensiveList({ items }: { items: string[] }) {\n  return items.map((item) => <div key={item}>{item}</div>);\n}"
    },
    keyTakeaways: [
      "Profile before making performance changes.",
      "Performance bottlenecks can exist outside React.",
      "Re-measure after optimization."
    ],
    commonMistakes: [
      "Optimizing code that is not on the critical path.",
      "Using memoization as a substitute for profiling.",
      "Making code harder to maintain for an unmeasured gain."
    ],
    quiz: [
      {
        question: "Which tool can profile React rendering?",
        options: [
          "React DevTools Profiler",
          "Git",
          "npm",
          "PostgreSQL"
        ],
        correctIndex: 0,
        explanation: "React DevTools includes profiling capabilities for React rendering."
      },
      {
        question: "If the API takes most of the time, will memoizing a component fix the request latency?",
        options: [
          "Yes",
          "No",
          "Only with CSS",
          "Only in production"
        ],
        correctIndex: 1,
        explanation: "A React render optimization does not remove server/network latency."
      }
    ]
  }
],
  finalQuiz: [
  {
    question: "What should usually happen before performance optimization?",
    options: [
      "Measure",
      "Memoize everything",
      "Remove all components",
      "Rewrite the app"
    ],
    correctIndex: 0,
    explanation: "Measurement identifies the actual bottleneck."
  },
  {
    question: "What does useMemo cache?",
    options: [
      "A calculated value",
      "A route",
      "A server response automatically",
      "A DOM tree forever"
    ],
    correctIndex: 0,
    explanation: "useMemo caches a calculation result."
  },
  {
    question: "What can memo help with?",
    options: [
      "Skipping a component render when props are unchanged",
      "Canceling fetch",
      "Creating routes",
      "Parsing URLs"
    ],
    correctIndex: 0,
    explanation: "memo can skip a child render when its props are unchanged."
  },
  {
    question: "Why are stable keys important?",
    options: [
      "They help React identify list items",
      "They style rows",
      "They make HTTP faster",
      "They encrypt data"
    ],
    correctIndex: 0,
    explanation: "Stable keys help React reconcile list items correctly."
  },
  {
    question: "What is virtualization?",
    options: [
      "Rendering only visible portions of a large list",
      "Caching every request",
      "Splitting a database",
      "Replacing React"
    ],
    correctIndex: 0,
    explanation: "Virtualization reduces DOM work for large collections."
  },
  {
    question: "What does code splitting reduce?",
    options: [
      "Initial JavaScript that must be loaded",
      "Database rows",
      "API permissions",
      "React state"
    ],
    correctIndex: 0,
    explanation: "Code splitting lets some code load later instead of being part of the initial bundle."
  },
  {
    question: "What does Suspense provide around lazy content?",
    options: [
      "Fallback UI",
      "Database security",
      "HTTP caching",
      "Form validation"
    ],
    correctIndex: 0,
    explanation: "Suspense can show fallback content while supported async content is loading."
  },
  {
    question: "If the backend is slow, what should you investigate?",
    options: [
      "Network/server performance",
      "Only useCallback",
      "Only React keys",
      "CSS specificity"
    ],
    correctIndex: 0,
    explanation: "The largest bottleneck should be measured and addressed at its actual layer."
  }
],
  project: {
  name: "Performance Lab Dashboard",
  goal: "Build a dashboard that demonstrates practical React performance techniques and measurement.",
  brief: "Create a dashboard with a large user list, expensive filtering, a lazily loaded analytics panel, and a simple profiling workflow. The goal is to practice optimization only where it is justified.",
  steps: [
    "Create a list of at least 1,000 generated users with stable IDs.",
    "Add search and sorting controls for the list.",
    "Use a measured expensive calculation for filtering and consider useMemo where it actually helps.",
    "Extract a row component and experiment with memo while keeping props stable.",
    "Add a lazily loaded Analytics panel behind a Suspense boundary.",
    "Use React DevTools Profiler and browser DevTools to identify at least one bottleneck.",
    "Write down one optimization, why it was needed, and what changed after measuring again."
  ],
  acceptance: [
    "The large list uses stable keys.",
    "The application has a visible loading fallback for the lazy analytics panel.",
    "The student can explain the difference between render work and DOM replacement.",
    "At least one performance optimization is supported by measurement rather than added automatically.",
    "The dashboard remains understandable after optimization."
  ],
  stretch: [
    "Virtualize the large list.",
    "Split dashboard routes into lazy-loaded chunks.",
    "Add pagination and compare it with virtualization.",
    "Measure initial bundle size before and after code splitting."
  ]
},
};
