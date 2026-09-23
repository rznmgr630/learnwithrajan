import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_21_LESSONS: LessonDay = {
  day: 21,
  title: "Suspense, Error Boundaries, and Resilient UI",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "react-day-21-lesson-1",
      title: "Suspense and Loading Boundaries",
      durationMinutes: 12,
      explanation: `Suspense lets part of the UI show a fallback while supported child content is waiting. A boundary keeps loading UI close to the section that is actually waiting instead of replacing the whole application with one global spinner. Suspense is especially useful with lazy components, framework-supported data loading, and streaming.`,
      diagram: `App
├── Header
├── Suspense
│   └── SlowWidget
└── Footer

Waiting → fallback
Ready   → real UI`,
      codeExample: {
        title: "Basic Suspense boundary",
        code: `import { Suspense } from "react";

function Dashboard() {
  return (
    <>
      <Header />
      <Suspense fallback={<WidgetSkeleton />}>
        <SlowWidget />
      </Suspense>
      <Footer />
    </>
  );
}`,
      },
      keyTakeaways: [
        "Suspense provides a boundary for supported suspended content.",
        "Fallbacks should be scoped to the UI that is waiting.",
        "Suspense is not a replacement for every loading state.",
      ],
      commonMistakes: [
        "Using one global spinner for every async operation.",
        "Assuming Suspense automatically fetches arbitrary data.",
        "Making the fallback so large that unrelated content disappears.",
      ],
      quiz: [
        {
          question: "What is the main purpose of a Suspense boundary?",
          options: ["Handle validation", "Show fallback UI while supported content is waiting", "Replace state management", "Prevent all errors"],
          correctIndex: 1,
          explanation: "Suspense coordinates fallback UI for content that suspends.",
        },
      ],
    },
    {
      id: "react-day-21-lesson-2",
      title: "Error Boundaries and Recovery",
      durationMinutes: 12,
      explanation: `An Error Boundary catches rendering errors in its descendant component tree and displays fallback UI instead of allowing that broken subtree to take down the visible interface. Error boundaries are different from try/catch around event handlers or arbitrary asynchronous code. A useful boundary should explain what failed and provide recovery when possible.`,
      diagram: `Page
├── Header
├── ErrorBoundary
│   └── RiskyWidget
│       └── error → ErrorFallback
└── Footer`,
      codeExample: {
        title: "Error boundary fallback",
        code: `import { Component, type ReactNode } from "react";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <button onClick={() => this.setState({ hasError: false })}>
          Try again
        </button>
      );
    }

    return this.props.children;
  }
}`,
      },
      keyTakeaways: [
        "Error boundaries isolate rendering failures.",
        "They are not general-purpose try/catch blocks.",
        "Place boundaries around meaningful failure domains.",
      ],
      commonMistakes: [
        "Putting the whole application behind one tiny boundary.",
        "Expecting an error boundary to catch every async error.",
        "Providing no recovery or useful error message.",
      ],
      quiz: [
        {
          question: "What does an error boundary primarily protect?",
          options: ["A rendering subtree", "A database", "CSS files", "The browser cache"],
          correctIndex: 0,
          explanation: "Error boundaries isolate errors thrown while rendering descendants.",
        },
      ],
    },
    {
      id: "react-day-21-lesson-3",
      title: "Streaming and Progressive Rendering",
      durationMinutes: 12,
      explanation: `Streaming allows parts of a page to become available progressively instead of waiting for the entire page to be ready. With Suspense boundaries, supported server-rendered applications can send the shell and ready sections while slower sections arrive later. This can improve perceived responsiveness.`,
      diagram: `Request
  ↓
HTML shell → Header
  ↓
ready section → visible
  ↓
slow section → streamed later`,
      codeExample: {
        title: "Progressive page structure",
        code: `<main>
  <Header />
  <Suspense fallback={<SummarySkeleton />}>
    <Summary />
  </Suspense>
  <Suspense fallback={<ReportSkeleton />}>
    <SlowReport />
  </Suspense>
</main>`,
      },
      keyTakeaways: [
        "Streaming is progressive delivery, not merely a different spinner.",
        "Suspense boundaries can define progressive UI regions.",
        "Framework support determines how server streaming is integrated.",
      ],
      commonMistakes: [
        "Assuming every client app automatically streams HTML.",
        "Adding many tiny boundaries without a UX reason.",
        "Confusing streaming with background client fetching.",
      ],
      quiz: [
        {
          question: "What is the key idea behind streaming?",
          options: ["Send everything only after all work finishes", "Deliver ready parts progressively", "Disable JavaScript", "Cache every component"],
          correctIndex: 1,
          explanation: "Streaming lets ready content reach the user before slower content finishes.",
        },
      ],
    },
    {
      id: "react-day-21-lesson-4",
      title: "Loading UX, Skeletons, and Transitions",
      durationMinutes: 12,
      explanation: `A good loading experience communicates what is happening without causing unnecessary layout movement. Skeletons represent the approximate shape of future content. Transitions are useful when an update is non-urgent, such as switching a filter or tab, so React can keep already-visible UI responsive while rendering the next view.`,
      diagram: `User changes filter
      ↓
urgent input update
      +
non-urgent result update
      ↓
responsive UI + transition`,
      codeExample: {
        title: "Transition for a filter",
        code: `import { useState, useTransition } from "react";

const [isPending, startTransition] = useTransition();

function changeFilter(next: string) {
  startTransition(() => {
    setFilter(next);
  });
}`,
      },
      keyTakeaways: [
        "Skeletons should match expected content shape.",
        "Transitions are for non-urgent updates.",
        "Loading indicators should not obscure unaffected content.",
      ],
      commonMistakes: [
        "Using transitions for every state update.",
        "Showing a blank page during a small update.",
        "Ignoring layout shift caused by loading content.",
      ],
      quiz: [
        {
          question: "Which update is a good transition candidate?",
          options: ["Typing into an input", "Switching a large filtered results view", "Reading a constant", "Setting document title"],
          correctIndex: 1,
          explanation: "Large non-urgent result updates are a common transition use case.",
        },
      ],
    },
    {
      id: "react-day-21-lesson-5",
      title: "Resilient Failure States",
      durationMinutes: 12,
      explanation: `A resilient interface treats loading, success, empty, error, and retry as different states. A failed widget should not necessarily hide unrelated widgets. Recovery can include retrying a request, refreshing a section, or giving the user a useful next step.`,
      diagram: `Widget state
   ├─ loading
   ├─ success → data
   ├─ empty   → no results
   └─ error   → message + retry`,
      codeExample: {
        title: "Explicit widget states",
        code: `type State =
  | { status: "loading" }
  | { status: "success"; items: string[] }
  | { status: "empty" }
  | { status: "error"; message: string };

function Widget({ state }: { state: State }) {
  if (state.status === "loading") return <Skeleton />;
  if (state.status === "error") return <ErrorMessage message={state.message} />;
  if (state.status === "empty") return <EmptyState />;
  return <List items={state.items} />;
}`,
      },
      keyTakeaways: [
        "Model states explicitly.",
        "Keep failures local when possible.",
        "Always make the next recovery action clear.",
      ],
      commonMistakes: [
        "Treating empty as an error.",
        "Showing only a generic error message.",
        "Letting one failed widget blank the entire page.",
      ],
      quiz: [
        {
          question: "Which state is different from an error?",
          options: ["Empty results", "Loading", "Success", "All of these"],
          correctIndex: 3,
          explanation: "Loading, success, and empty are all legitimate non-error states.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What does Suspense provide?",
      options: ["A fallback boundary for supported suspended content", "A database transaction", "A CSS reset", "An API client"],
      correctIndex: 0,
      explanation: "Suspense coordinates fallback UI.",
    },
    {
      question: "What should an error boundary usually isolate?",
      options: ["A meaningful UI subtree", "The entire internet", "Only CSS", "Only event handlers"],
      correctIndex: 0,
      explanation: "Isolation keeps unrelated UI available.",
    },
    {
      question: "What does streaming improve?",
      options: ["Progressive delivery of ready content", "Database indexes", "TypeScript inference", "CSS specificity"],
      correctIndex: 0,
      explanation: "Streaming can send ready parts before slower parts.",
    },
    {
      question: "Which is a resilient state model?",
      options: ["loading/success/empty/error", "only success/error", "only loading/success", "random messages"],
      correctIndex: 0,
      explanation: "Explicit states make UI behavior predictable.",
    },
  ],
  project: {
    name: "Resilient Dashboard",
    goal: "Build a dashboard that handles loading, errors, empty results, transitions, and recoverable failures.",
    brief: "Create a dashboard with independent widgets for summary, projects, activity, and a slow report. Practice Suspense, error boundaries, skeletons, transitions, retry actions, and isolated failure states.",
    steps: [
      "Create summary, projects, activity, and slow-report widgets.",
      "Wrap appropriate slow sections with Suspense and useful skeleton fallbacks.",
      "Add an error boundary around the report widget.",
      "Represent loading, empty, success, and error states distinctly.",
      "Use a transition for a non-urgent filter or report update.",
      "Add a retry action for recoverable widget failures.",
      "Keep unrelated dashboard sections visible when one widget fails.",
    ],
    acceptance: [
      "Loading fallbacks are useful and scoped.",
      "Empty, success, loading, and error states are visibly different.",
      "A widget failure does not blank unrelated sections.",
      "Retry can recover a simulated failure.",
      "Filtering remains responsive during a non-urgent update.",
    ],
    stretch: [
      "Add streamed rendering in a framework that supports it.",
      "Add error reporting with a monitoring service.",
      "Add an offline or reconnecting message.",
    ],
  },
};
