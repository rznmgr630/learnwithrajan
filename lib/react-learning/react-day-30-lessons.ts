import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_30_LESSONS: LessonDay = {
  day: 30,
  title: "Production Readiness and React Mastery",
  totalMinutes: 75,
  difficulty: "Beginner",
  lessons: [
    {
      id: "react-day-30-lesson-1",
      title: "Production Readiness Checklist",
      durationMinutes: 15,
      explanation: `A React application is not finished when it works on a developer laptop. Production readiness means the application behaves predictably for real users, handles failure, is observable, is accessible, and can be deployed and changed safely. The exact checklist depends on the product, but the core categories are similar.

Review functionality, loading states, empty states, errors, accessibility, responsive behavior, performance, security boundaries, tests, and deployment configuration. Check environment variables and make sure secrets are never bundled into client code. Verify that production builds behave like the environment where users will actually run the application.

For example, an application can pass every happy-path test but still fail production readiness if an expired session produces an infinite spinner. Production thinking means deliberately testing the states that users encounter when things go wrong.`,
      diagram: `Feature complete
   ↓
Functionality
Accessibility
Performance
Errors
Security
Testing
Observability
Deployment
   ↓
Production ready`,
      codeExample: {
        title: "Environment-aware configuration",
        code: `const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("VITE_API_BASE_URL is required");
}

// Never put private server secrets in client-exposed variables.`,
      },
      keyTakeaways: [
        "Production readiness includes failure and operational behavior, not only features.",
        "Never expose private secrets through client-side environment variables.",
        "Review real user states, not only the happy path.",
      ],
      commonMistakes: [
        "Testing only successful flows.",
        "Shipping secrets in frontend bundles.",
        "Assuming development configuration is equivalent to production.",
      ],
      quiz: [
        {
          question: "What is production readiness?",
          options: [
            "A broader check of reliability, security, accessibility, performance, and deployment behavior",
            "Only whether the page renders",
            "Only whether TypeScript compiles",
            "Only whether tests exist"
          ],
          correctIndex: 0,
          explanation: "Production readiness covers the full behavior of the application in real conditions.",
        },
      ],
    },
    {
      id: "react-day-30-lesson-2",
      title: "Builds, Deployment, and Environment Configuration",
      durationMinutes: 15,
      explanation: `A production React application is normally built into optimized static assets or framework-specific output. The build process should be repeatable and should run checks such as type checking, linting, tests, and the production build before deployment.

Environment configuration needs clear boundaries. Public configuration such as an API base URL may be included in a browser bundle, but private credentials must remain on a trusted server. Different environments such as development, staging, and production may use different API endpoints and feature configuration.

For example, a CI pipeline can run npm ci, lint, typecheck, tests, and build. Only after these checks pass should the deployment system publish the production artifact.`,
      diagram: `Git push
   ↓
CI
├── install
├── lint
├── typecheck
├── test
└── build
   ↓
artifact
   ↓
deploy`,
      codeExample: {
        title: "Production scripts",
        code: `{
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "build": "vite build"
  }
}`,
      },
      keyTakeaways: [
        "Production builds should be reproducible.",
        "CI can prevent broken code from reaching deployment.",
        "Public client configuration is different from private server secrets.",
      ],
      commonMistakes: [
        "Deploying directly without automated checks.",
        "Putting API secrets in frontend environment variables.",
        "Using different build commands locally and in CI without understanding the difference.",
      ],
      quiz: [
        {
          question: "Which should normally happen before a production deployment?",
          options: ["Automated validation and a production build", "Delete tests", "Disable TypeScript", "Change source files manually on the server"],
          correctIndex: 0,
          explanation: "Automated checks make deployments repeatable and safer.",
        },
      ],
    },
    {
      id: "react-day-30-lesson-3",
      title: "Observability and Production Debugging",
      durationMinutes: 15,
      explanation: `Observability (understanding what a running system is doing from its outputs) helps teams investigate production problems. For a React application, useful signals can include JavaScript errors, failed network requests, performance metrics, route information, and user-safe context.

Error monitoring should avoid collecting unnecessary personal or sensitive information. When a production error occurs, developers need enough context to reproduce it without turning logs into a copy of the user's private data. Source maps can help map minified production errors back to source code when handled appropriately.

For example, an error event might record that a failure occurred while loading the projects page, the application version, and a sanitized error type. That is much more useful than a generic "something went wrong" message with no diagnostic information.`,
      diagram: `User
 ↓
React app
 ├── errors
 ├── performance
 └── network failures
 ↓
Monitoring
 ↓
Developer investigation
 ↓
Fix + release`,
      codeExample: {
        title: "Safe error context",
        code: `reportError(error, {
  route: "/projects",
  operation: "load-projects",
  appVersion: APP_VERSION,
});

// Do not include passwords, access tokens, or unnecessary private data.`,
      },
      keyTakeaways: [
        "Production errors need useful but safe diagnostic context.",
        "Performance and error signals help explain real-user problems.",
        "Observability should respect privacy and security boundaries.",
      ],
      commonMistakes: [
        "Logging secrets or unnecessary personal data.",
        "Collecting errors without application version information.",
        "Relying on user reports as the only production signal.",
      ],
      quiz: [
        {
          question: "What is observability used for?",
          options: ["Understanding a running system through its signals", "Replacing React", "Creating CSS", "Writing JSX"],
          correctIndex: 0,
          explanation: "Observability helps developers understand system behavior in production.",
        },
      ],
    },
    {
      id: "react-day-30-lesson-4",
      title: "Security and Safe Frontend Boundaries",
      durationMinutes: 15,
      explanation: `Frontend code runs in an environment controlled by the user, so anything shipped to the browser should be considered visible to that user. Authentication tokens, private API keys, database credentials, and server-only secrets must not be treated as hidden merely because they came from an environment file.

React also needs normal web security practices. Avoid rendering untrusted HTML unless it has been properly sanitized and the use case genuinely requires it. Validate important data on the server because client-side validation can always be bypassed. The frontend improves user experience; it is not a trusted security boundary.

For example, disabling a button when a user is not authorized is useful for the interface, but the backend must still verify authorization when the request arrives.`,
      diagram: `Browser = untrusted
      ↓
UI validation
      ↓
API request
      ↓
Trusted server
├── authentication
├── authorization
└── validation`,
      codeExample: {
        title: "Client validation is not authorization",
        code: `function DeleteButton({ canDelete }: { canDelete: boolean }) {
  if (!canDelete) return null;

  return (
    <button onClick={() => fetch("/api/projects/123", {
      method: "DELETE",
    })}>
      Delete
    </button>
  );
}

// The server must independently verify permission.`,
      },
      keyTakeaways: [
        "Anything shipped to the browser is potentially visible to the user.",
        "The server must enforce authentication and authorization.",
        "Client validation improves UX but cannot be the security boundary.",
      ],
      commonMistakes: [
        "Putting private API keys in frontend code.",
        "Trusting hidden buttons as authorization.",
        "Rendering unsanitized untrusted HTML.",
      ],
      quiz: [
        {
          question: "Where should authorization ultimately be enforced?",
          options: ["On the trusted server", "Only by hiding buttons", "Only in CSS", "Only in TypeScript"],
          correctIndex: 0,
          explanation: "The server must independently enforce permissions.",
        },
      ],
    },
    {
      id: "react-day-30-lesson-5",
      title: "From React Learner to Production Engineer",
      durationMinutes: 15,
      explanation: `The goal of a React learning plan is not memorizing every Hook. You should be able to look at a product requirement, decide where state belongs, choose an appropriate data-fetching strategy, design accessible components, test important behavior, diagnose performance problems, and organize code so the application can grow.

At this point, revisit the major concepts from the previous days: JSX and components, events, state, effects, reducers, context, forms, custom Hooks, routing, server state, testing, TypeScript, performance, accessibility, architecture, and production readiness. The next step is deliberate practice rather than collecting more APIs.

For example, take one small product idea and build it from beginning to deployment. Make architecture decisions, write tests, measure performance, handle failures, and improve the application after observing real behavior. That process turns isolated React knowledge into engineering skill.`,
      diagram: `React fundamentals
      ↓
State + data
      ↓
Reusable components
      ↓
Testing + TypeScript
      ↓
Performance + accessibility
      ↓
Architecture
      ↓
Production engineering`,
      codeExample: {
        title: "A complete feature mindset",
        code: `// A feature is more than a component:
//
// UI
// + state
// + data access
// + loading/error/empty states
// + accessibility
// + tests
// + monitoring
//
// Think in complete user-facing behavior.`,
      },
      keyTakeaways: [
        "React mastery is about solving product problems, not memorizing APIs.",
        "Production engineering combines UI, data, testing, performance, accessibility, and operations.",
        "The best next step after the course is building and maintaining a real project.",
      ],
      commonMistakes: [
        "Continuing to collect tutorials without building.",
        "Ignoring accessibility or testing until the end.",
        "Treating architecture as more important than solving the actual product problem.",
      ],
      quiz: [
        {
          question: "What is the strongest next step after learning React fundamentals?",
          options: ["Build, measure, test, debug, and maintain a real application", "Memorize every Hook", "Avoid production concerns", "Rewrite React yourself"],
          correctIndex: 0,
          explanation: "Practical engineering combines the concepts into complete product work.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What should a production React checklist include?",
      options: ["Reliability, accessibility, performance, security, testing, and deployment", "Only visual design", "Only TypeScript", "Only API calls"],
      correctIndex: 0,
      explanation: "Production readiness is broader than feature completion.",
    },
    {
      question: "Which frontend value should never be treated as a secret?",
      options: ["Any value shipped in the browser", "A private server credential", "A database password", "A private API key"],
      correctIndex: 0,
      explanation: "Anything delivered to the browser can potentially be inspected.",
    },
    {
      question: "Where must authorization be enforced?",
      options: ["On the trusted server", "Only in the UI", "Only in React context", "Only in CSS"],
      correctIndex: 0,
      explanation: "The backend must independently enforce permissions.",
    },
    {
      question: "What does observability help with?",
      options: ["Understanding production behavior", "Replacing tests", "Replacing TypeScript", "Writing JSX"],
      correctIndex: 0,
      explanation: "Observability provides signals for diagnosing real running systems.",
    },
    {
      question: "What is the best measure of React mastery?",
      options: [
        "Using appropriate concepts to build, test, debug, and maintain real applications",
        "Knowing the most Hooks",
        "Using the largest state library",
        "Writing the most components"
      ],
      correctIndex: 0,
      explanation: "Engineering skill comes from applying concepts appropriately to real problems.",
    },
  ],
  project: {
    name: "Production-Ready React Capstone",
    goal: "Build, test, optimize, and prepare a complete React application for production.",
    brief: "Build a small but complete product such as a project manager, personal dashboard, or learning tracker. The capstone should combine React fundamentals with TypeScript, server state, forms, accessibility, testing, performance, architecture, error handling, and deployment preparation.",
    steps: [
      "Define one real user problem and write the main user flows before coding.",
      "Organize the application into app, features, shared, and lib boundaries.",
      "Build reusable typed components and feature-specific UI.",
      "Implement server-state fetching and mutations with explicit loading, empty, success, and error states.",
      "Add form validation and accessible keyboard and focus behavior.",
      "Write component tests for important behavior and at least one Playwright end-to-end flow.",
      "Profile an important interaction and fix at least one measured performance problem.",
      "Add error handling, retry behavior, and safe production diagnostics.",
      "Review environment variables and confirm no private secrets are shipped to the browser.",
      "Run linting, type checking, tests, and the production build through CI.",
      "Create a production-readiness checklist and document important architecture decisions.",
    ],
    acceptance: [
      "The main user flow works from start to finish.",
      "The application has clear feature and shared-code boundaries.",
      "Important async operations have loading, empty, success, and error states.",
      "Forms and interactive components are keyboard accessible.",
      "Important behavior has automated tests.",
      "At least one real performance bottleneck was measured and improved.",
      "Production errors have a useful recovery path.",
      "No private server secrets are exposed in the client bundle.",
      "The project passes lint, TypeScript, tests, and the production build.",
      "The README explains setup, architecture, testing, and deployment.",
    ],
    stretch: [
      "Deploy the application to a real production environment.",
      "Add real-user performance monitoring.",
      "Add error monitoring with safe contextual metadata.",
      "Add a small design system with Storybook.",
      "Add automated accessibility and performance checks to CI.",
      "Write ADRs for the most important architectural decisions.",
      "Perform a final code-review pass focused on maintainability rather than only correctness.",
    ],
  },
};
