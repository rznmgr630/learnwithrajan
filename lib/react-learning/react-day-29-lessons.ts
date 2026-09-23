import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_29_LESSONS: LessonDay = {
  day: 29,
  title: "Large-Scale React Architecture",
  totalMinutes: 65,
  difficulty: "Beginner",
  lessons: [
    {
      id: "react-day-29-lesson-1",
      title: "Organizing a Growing React Codebase",
      durationMinutes: 13,
      explanation: `A small React application can work with a simple folder structure, but larger applications need clear ownership. The goal is not to create many folders for their own sake. The goal is to make it obvious where a feature belongs, who owns its behavior, and which modules are safe to reuse.

Feature-oriented organization often keeps business-specific code together. A projects feature might contain its list, editor, hooks, API functions, types, and tests. Shared UI can live separately because multiple features genuinely depend on it.

As the application grows, ownership becomes more important than the exact folder names. A good structure should help a new developer answer questions such as "Where does project creation happen?" and "Can billing import this internal projects module?"`,
      diagram: `src/
├── app/
├── features/
│   ├── projects/
│   ├── billing/
│   └── profile/
├── shared/
│   ├── ui/
│   └── hooks/
└── lib/`,
      codeExample: {
        title: "Feature ownership",
        code: `features/
  projects/
    components/
      ProjectList.tsx
      ProjectEditor.tsx
    hooks/
      useProjects.ts
    api.ts
    types.ts
    index.ts`,
      },
      keyTakeaways: [
        "Organize code around ownership and business capabilities.",
        "Keep feature-specific behavior close to the feature.",
        "Shared code should have a clear reason to be shared.",
      ],
      commonMistakes: [
        "Creating a giant global components folder.",
        "Moving code to shared before a real reuse need exists.",
        "Allowing every feature to import every internal module.",
      ],
      quiz: [
        {
          question: "What is the main goal of large-scale organization?",
          options: ["Clear ownership and safe dependencies", "Maximum folder count", "Shorter file names", "Avoiding all abstractions"],
          correctIndex: 0,
          explanation: "Architecture should make ownership and dependencies understandable.",
        },
      ],
    },
    {
      id: "react-day-29-lesson-2",
      title: "Public APIs and Module Boundaries",
      durationMinutes: 13,
      explanation: `A module boundary defines what another part of the application is allowed to use. A feature can expose a small public API through an index file while keeping implementation details private. This reduces coupling (how strongly modules depend on each other).

Without boundaries, developers often import deep internal files because they are convenient. Later, changing those internal files can break many unrelated places. A public API gives the owning feature freedom to change its internal structure while preserving the contract.

For example, another feature should import ProjectList from the projects feature's public entry point rather than reaching into projects/components/internal/ProjectList.tsx.`,
      diagram: `billing
   ↓
features/projects/index.ts
   ↓
ProjectList
   ✕
projects/internal/details.tsx`,
      codeExample: {
        title: "Feature public API",
        code: `// features/projects/index.ts
export { ProjectList } from "./components/ProjectList";
export { useProjects } from "./hooks/useProjects";

// Consumer:
import { ProjectList } from "@/features/projects";`,
      },
      keyTakeaways: [
        "Public APIs protect implementation details.",
        "Deep imports increase coupling.",
        "A small public surface makes modules easier to change.",
      ],
      commonMistakes: [
        "Exporting every internal file.",
        "Allowing deep imports across feature boundaries.",
        "Making public APIs larger than necessary.",
      ],
      quiz: [
        {
          question: "Why use a feature public API?",
          options: ["To protect internal implementation details", "To increase coupling", "To remove TypeScript", "To avoid tests"],
          correctIndex: 0,
          explanation: "A public API controls what other modules depend on.",
        },
      ],
    },
    {
      id: "react-day-29-lesson-3",
      title: "Separating UI, Domain, and Data Access",
      durationMinutes: 13,
      explanation: `Large applications become easier to reason about when presentation, domain behavior, and data access have clear responsibilities. UI components should primarily describe what users see and do. Domain logic describes application rules. Data-access code handles communication with APIs or other external systems.

The layers do not have to be extremely formal. The point is to prevent a single component from becoming a 600-line mixture of JSX, validation, network requests, transformation logic, and business rules. Smaller responsibilities make testing and future changes easier.

For example, a ProjectEditor can collect form input and display validation messages, while a project service handles the API call and a domain function can validate project-specific rules.`,
      diagram: `UI
 ↓
feature/domain logic
 ↓
data-access layer
 ↓
API / backend`,
      codeExample: {
        title: "Separate data access",
        code: `export async function createProject(input: ProjectInput) {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Could not create project");
  }

  return response.json();
}

// ProjectEditor calls createProject instead of owning the HTTP details.`,
      },
      keyTakeaways: [
        "Keep presentation, domain rules, and external I/O understandable.",
        "A component should not become the application's entire architecture.",
        "Clear responsibilities make tests smaller and more focused.",
      ],
      commonMistakes: [
        "Putting API requests directly into every visual component.",
        "Creating an abstraction for every two lines of code.",
        "Mixing server response transformation with unrelated JSX.",
      ],
      quiz: [
        {
          question: "What should a data-access layer primarily handle?",
          options: ["Communication with external data sources", "Button colors", "Page typography", "Keyboard shortcuts only"],
          correctIndex: 0,
          explanation: "Data access owns communication with APIs or other external systems.",
        },
      ],
    },
    {
      id: "react-day-29-lesson-4",
      title: "State Ownership at Scale",
      durationMinutes: 13,
      explanation: `State becomes difficult when it has no clear owner. Before putting state into global context or a state library, ask which components actually need it. Local state is often best for a form field or dialog. Shared UI state may belong in a nearby parent or context. Server state usually belongs in a data-fetching/cache layer.

Duplicating the same state in multiple places creates synchronization problems. For example, storing the same project list in both a global Zustand store and a query cache can cause stale copies unless the application carefully synchronizes them.

A scalable approach starts with the narrowest reasonable owner and moves state upward only when a real sharing requirement appears.`,
      diagram: `Choose owner
   ↓
local state?
   ├─ yes → useState/useReducer
   ↓ no
shared UI?
   ├─ yes → context/store
   ↓ no
server data?
   └─ query/cache layer`,
      codeExample: {
        title: "Keep state close to its owner",
        code: `function ProjectEditor() {
  const [name, setName] = useState("");

  // This field belongs only to this editor.
  // It does not need a global store.
  return (
    <input
      value={name}
      onChange={(event) => setName(event.target.value)}
    />
  );
}`,
      },
      keyTakeaways: [
        "Choose the narrowest reasonable state owner.",
        "Avoid duplicated copies of the same server state.",
        "Global state should solve a real sharing problem.",
      ],
      commonMistakes: [
        "Putting every state value into a global store.",
        "Duplicating server state in multiple stores.",
        "Lifting state far above the components that actually use it.",
      ],
      quiz: [
        {
          question: "Where should state usually start?",
          options: ["At the narrowest component that owns the behavior", "Always globally", "Always in the URL", "Always on the server"],
          correctIndex: 0,
          explanation: "Start locally and widen ownership when sharing is actually required.",
        },
      ],
    },
    {
      id: "react-day-29-lesson-5",
      title: "Architecture Decisions and Evolution",
      durationMinutes: 13,
      explanation: `Architecture should evolve with the product. A small application does not need the same boundaries as a large organization with multiple teams. The important skill is recognizing when a structure is becoming painful and making a deliberate change rather than accumulating accidental complexity.

Architecture Decision Records (ADRs) are short documents that explain an important technical decision, its context, and the chosen approach. They are useful when future developers might otherwise ask why the team selected one pattern over another.

For example, an ADR might explain why server state is handled by TanStack Query while local UI state remains in component state. The goal is not to document every coding decision; it is to preserve important reasoning that would otherwise disappear.`,
      diagram: `Problem
  ↓
Options
  ↓
Trade-offs
  ↓
Decision
  ↓
Implementation
  ↓
Review later`,
      codeExample: {
        title: "Small ADR structure",
        code: `# ADR-001: Server State

## Context
The application has cached API data and mutations.

## Decision
Use TanStack Query for server state.

## Consequence
Components use query hooks instead of maintaining duplicate caches.`,
      },
      keyTakeaways: [
        "Architecture should evolve with actual complexity.",
        "Document important decisions and their trade-offs.",
        "Avoid architecture that exists only because it sounds sophisticated.",
      ],
      commonMistakes: [
        "Overengineering a small application.",
        "Never revisiting architecture when requirements change.",
        "Documenting decisions without recording the reason behind them.",
      ],
      quiz: [
        {
          question: "What is the purpose of an ADR?",
          options: ["Record important architectural context and decisions", "Replace tests", "Store user passwords", "Compile React"],
          correctIndex: 0,
          explanation: "ADRs preserve the reasoning behind significant technical decisions.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What should determine where a feature's code lives?",
      options: ["Ownership and business capability", "File extension only", "Random preference", "CSS framework"],
      correctIndex: 0,
      explanation: "Ownership makes large codebases easier to navigate.",
    },
    {
      question: "What does a public module API protect?",
      options: ["Implementation details", "Database passwords", "Browser cookies", "CSS rendering"],
      correctIndex: 0,
      explanation: "Public APIs let internals change without breaking consumers.",
    },
    {
      question: "Where should a local form field usually live?",
      options: ["Close to the form that owns it", "Always in global state", "Always in the database", "In a CSS file"],
      correctIndex: 0,
      explanation: "Local state should remain local unless another part of the app needs it.",
    },
    {
      question: "What does an ADR preserve?",
      options: ["The reasoning behind an important technical decision", "API response data", "Browser history", "Component screenshots"],
      correctIndex: 0,
      explanation: "ADRs preserve architectural context and trade-offs.",
    },
  ],
  project: {
    name: "Large-Scale React Application",
    goal: "Design and implement a feature-oriented React architecture with clear ownership, state boundaries, and public APIs.",
    brief: "Build a project-management application containing projects, billing, profile, and shared UI. Organize the code so each feature owns its business logic while common primitives remain reusable.",
    steps: [
      "Create app, features, shared, and lib layers.",
      "Create projects, billing, and profile features.",
      "Give each feature a public index.ts API.",
      "Separate UI components from data-access functions.",
      "Keep local form state local and server state in the query/cache layer.",
      "Prevent deep imports between feature internals.",
      "Write two ADRs explaining important architecture decisions.",
    ],
    acceptance: [
      "Each feature has clear ownership.",
      "Features expose small public APIs.",
      "Data-access code is not scattered through every visual component.",
      "State is owned at an appropriate scope.",
      "Shared code does not depend on feature internals.",
      "Architecture decisions have documented reasoning.",
    ],
    stretch: [
      "Add automated import-boundary lint rules.",
      "Split a feature into independently testable modules.",
      "Add a dependency graph check in CI.",
    ],
  },
};
