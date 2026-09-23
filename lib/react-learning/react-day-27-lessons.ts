import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_27_LESSONS: LessonDay = {
  day: 27,
  title: "Debugging, Error Handling, and React DevTools",
  totalMinutes: 65,
  difficulty: "Beginner",
  lessons: [
    {
      id: "react-day-27-lesson-1",
      title: "A Systematic Debugging Process",
      durationMinutes: 13,
      explanation: `Debugging is the process of turning an unexpected behavior into a specific, reproducible problem and then finding the smallest change that explains it. Randomly changing code can make a problem harder to understand because you lose the connection between cause and effect.

Start by describing what happened, what you expected, and how to reproduce it. Then reduce the problem to the smallest useful example. Inspect inputs, state, network responses, and rendered output. Once you have a hypothesis, change one thing that tests that hypothesis rather than making several unrelated changes at once.

For example, if a project list is empty, do not immediately change the component. First check whether the request ran, what URL was requested, what status was returned, what JSON arrived, and whether the component interpreted the response correctly.`,
      diagram: `Bug report
   ↓
Reproduce
   ↓
Expected vs actual
   ↓
Inspect evidence
   ↓
Form hypothesis
   ↓
Test one change
   ↓
Fix + regression test`,
      codeExample: {
        title: "Make assumptions visible",
        code: `console.log("Projects request", {
  url: "/api/projects",
  userId,
});

console.log("Projects response", response.status, data);`,
      },
      keyTakeaways: [
        "Reproduce before changing code.",
        "Separate facts from assumptions.",
        "Test one debugging hypothesis at a time.",
      ],
      commonMistakes: [
        "Changing several files before understanding the failure.",
        "Debugging from memory instead of inspecting actual values.",
        "Fixing the symptom without adding a regression test.",
      ],
      quiz: [
        {
          question: "What should you establish first when debugging?",
          options: ["A reproducible failure", "A new library", "A complete rewrite", "A production deploy"],
          correctIndex: 0,
          explanation: "A reproducible problem gives you something concrete to investigate.",
        },
      ],
    },
    {
      id: "react-day-27-lesson-2",
      title: "React DevTools and Component Inspection",
      durationMinutes: 13,
      explanation: `React DevTools gives you a view of the component tree and helps inspect props, state, and rendering behavior. This is often more useful than adding console.log statements everywhere because you can inspect the component hierarchy directly.

The Profiler portion of React DevTools can help identify expensive renders and interactions. Use it together with browser tools rather than treating it as the only performance source. A component may render quickly while the browser still spends time on layout or paint.

For example, when a button appears disabled unexpectedly, inspect the component that owns the disabled prop and trace where the value came from. This is often faster than reading the entire application from top to bottom.`,
      diagram: `React DevTools
├── Components
│   ├── props
│   ├── state
│   └── hierarchy
└── Profiler
    ├── renders
    └── durations`,
      codeExample: {
        title: "Give components inspectable names",
        code: `function ProjectToolbar({
  isSaving,
}: {
  isSaving: boolean;
}) {
  return (
    <button disabled={isSaving}>
      {isSaving ? "Saving..." : "Save"}
    </button>
  );
}`,
      },
      keyTakeaways: [
        "Use React DevTools to inspect component structure and state.",
        "Use Profiler for React rendering performance.",
        "Combine React DevTools with browser DevTools.",
      ],
      commonMistakes: [
        "Relying only on console.log.",
        "Assuming React DevTools explains network or browser rendering costs.",
        "Profiling without reproducing the slow interaction.",
      ],
      quiz: [
        {
          question: "What can React DevTools inspect?",
          options: ["Component props and state", "Database indexes", "DNS records", "Git history"],
          correctIndex: 0,
          explanation: "React DevTools exposes useful component-level information.",
        },
      ],
    },
    {
      id: "react-day-27-lesson-3",
      title: "Handling API and Async Errors",
      durationMinutes: 13,
      explanation: `Async operations can fail for many different reasons: a network connection can disappear, authentication can expire, the server can return a validation error, or the server can fail unexpectedly. A robust UI should not treat every failure as the same message.

Separate expected errors from unexpected ones. A 400-level validation response can usually be shown as a useful message to the user, while a 500-level failure may need a generic message and logging. Network failures may need a retry or offline message. The component should also avoid updating state after a request is no longer relevant.

For example, a project creation form can show field validation errors directly beside the fields, while a server outage can show a general retry message.`,
      diagram: `Request
 ├── success → data
 ├── validation → field errors
 ├── unauthorized → sign in
 ├── network → retry/offline
 └── server error → generic error`,
      codeExample: {
        title: "Handle HTTP failure explicitly",
        code: `async function createProject(input: ProjectInput) {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(\`Request failed: \${response.status}\`);
  }

  return response.json();
}`,
      },
      keyTakeaways: [
        "Different failures need different user experiences.",
        "Always check fetch responses for HTTP failure.",
        "Provide useful recovery actions where possible.",
      ],
      commonMistakes: [
        "Assuming fetch rejects for every HTTP 4xx or 5xx response.",
        "Showing raw server errors to users.",
        "Treating validation errors as generic failures.",
      ],
      quiz: [
        {
          question: "Does fetch automatically reject for a 500 response?",
          options: ["No", "Yes", "Only in React", "Only in TypeScript"],
          correctIndex: 0,
          explanation: "fetch rejects for network-level failures; HTTP errors still need response.ok checking.",
        },
      ],
    },
    {
      id: "react-day-27-lesson-4",
      title: "AbortController and Race Conditions",
      durationMinutes: 13,
      explanation: `A race condition occurs when the order of asynchronous results is different from the order in which requests were started. A common example is a search box: the user types "rea", then "react", but the slower "rea" request may finish after the "react" request and incorrectly overwrite the newer results.

AbortController lets you signal that a request should be cancelled when it is no longer relevant. Cancellation does not solve every race condition by itself, but it is an important tool for request lifecycle management. You should also design the state update so stale results cannot replace newer state.

For example, when a search query changes, abort the previous request before starting the next one. The cleanup should also handle AbortError without showing it as a user-facing failure.`,
      diagram: `Query: "rea" → Request A
Query: "react" → Request B
                 ↓
        abort / ignore A
                 ↓
          show B results`,
      codeExample: {
        title: "Abort an outdated request",
        code: `const controller = new AbortController();

const response = await fetch("/api/search?q=react", {
  signal: controller.signal,
});

// When no longer needed:
// controller.abort();`,
      },
      keyTakeaways: [
        "Async results can arrive out of order.",
        "AbortController helps cancel obsolete requests.",
        "Aborted requests should usually be treated differently from real failures.",
      ],
      commonMistakes: [
        "Assuming request order equals response order.",
        "Showing an abort message to users.",
        "Starting unlimited requests for every keystroke.",
      ],
      quiz: [
        {
          question: "What problem can AbortController help with?",
          options: ["Cancelling an obsolete request", "Typing TypeScript", "Rendering CSS", "Creating React keys"],
          correctIndex: 0,
          explanation: "AbortController provides a way to signal request cancellation.",
        },
      ],
    },
    {
      id: "react-day-27-lesson-5",
      title: "Logging, Error Reporting, and Regression Tests",
      durationMinutes: 13,
      explanation: `A production application needs more than a visible error message. Developers need enough diagnostic information to understand what happened without exposing sensitive information. Structured logs and error-reporting tools can capture useful context such as route, operation, and error type.

After fixing a bug, add a regression test whenever practical. A regression test is a test that would have failed before the fix and passes after it. This turns a one-time debugging session into permanent protection against the same mistake returning later.

For example, if a project list broke because the API returned an empty array, add a test for that response shape. The test should describe the user-visible behavior rather than relying on an implementation detail.`,
      diagram: `Production failure
   ↓
safe diagnostic context
   ↓
error reporting
   ↓
reproduce locally
   ↓
fix
   ↓
regression test`,
      codeExample: {
        title: "Structured diagnostic event",
        code: `function reportError(error: unknown, context: {
  operation: string;
}) {
  console.error("Application error", {
    operation: context.operation,
    error,
  });
}`,
      },
      keyTakeaways: [
        "Production errors need diagnostic context.",
        "Avoid logging secrets or sensitive user data.",
        "Turn important bug fixes into regression tests.",
      ],
      commonMistakes: [
        "Logging access tokens or passwords.",
        "Fixing a bug without testing it.",
        "Recording only the error message and no useful context.",
      ],
      quiz: [
        {
          question: "What is a regression test?",
          options: [
            "A test that prevents a fixed bug from returning",
            "A test that always fails",
            "A CSS snapshot",
            "A database backup"
          ],
          correctIndex: 0,
          explanation: "Regression tests protect against previously fixed behavior breaking again.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What should debugging begin with?",
      options: ["Reproduction and evidence", "A rewrite", "A new dependency", "A deployment"],
      correctIndex: 0,
      explanation: "Reproduction gives you a concrete problem to investigate.",
    },
    {
      question: "Why check response.ok after fetch?",
      options: ["HTTP errors do not automatically reject the promise", "React requires it", "TypeScript requires it", "It enables JSX"],
      correctIndex: 0,
      explanation: "fetch does not reject solely because the server returned 4xx or 5xx.",
    },
    {
      question: "What can cause a search race condition?",
      options: ["Older requests finishing after newer requests", "Too many CSS classes", "A missing key only", "TypeScript generics"],
      correctIndex: 0,
      explanation: "Async responses can arrive in a different order than requests were started.",
    },
    {
      question: "What should a bug fix ideally include?",
      options: ["A regression test", "A complete rewrite", "A new framework", "No verification"],
      correctIndex: 0,
      explanation: "A regression test protects the behavior in the future.",
    },
  ],
  project: {
    name: "Debuggable Project Dashboard",
    goal: "Build a dashboard with intentional bugs and practice a complete debugging workflow.",
    brief: "Create several controlled failures: a broken API response, an async race condition, incorrect loading state, and a rendering bug. Diagnose each using React DevTools and browser tools, then fix it and add regression tests.",
    steps: [
      "Create a project list that can receive success, empty, and error API responses.",
      "Add a search field that can produce out-of-order mock responses.",
      "Use AbortController to cancel obsolete searches.",
      "Inspect component props and state with React DevTools.",
      "Use the Network tab to inspect request and response details.",
      "Add safe diagnostic logging for important failures.",
      "Write a regression test for each fixed bug.",
    ],
    acceptance: [
      "Each bug can be reproduced before the fix.",
      "The debugging process identifies evidence rather than guessing.",
      "Obsolete search requests cannot overwrite newer results.",
      "API errors have useful user-facing states.",
      "Every intentional bug has a regression test after being fixed.",
    ],
    stretch: [
      "Add an error-reporting integration.",
      "Add request IDs to diagnostic logs.",
      "Create a debug mode that exposes safe development diagnostics.",
    ],
  },
};
