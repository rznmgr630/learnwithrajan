import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_25_LESSONS: LessonDay = {
  day: 25,
  title: "React Architecture and Production Patterns",
  totalMinutes: 72,
  difficulty: "Beginner",
  lessons: [
    {
      id: "react-day-25-lesson-1",
      title: "Feature-Oriented Architecture",
      durationMinutes: 12,
      explanation: `As applications grow, organizing everything by technical type can make business features difficult to find. Feature-oriented architecture groups code around user-facing capabilities. A feature can own its components, hooks, API functions, tests, and types while shared code remains genuinely reusable.`,
      diagram: `src/
├── app/
├── features/
│   ├── projects/
│   └── billing/
├── shared/
└── lib/`,
      codeExample: {
        title: "Feature folders",
        code: `src/
  features/
    projects/
      components/
      hooks/
      api.ts
      types.ts
      tests/
    billing/
      components/
      api.ts`,
      },
      keyTakeaways: ["Organize around business capabilities.", "Keep feature-specific code close together.", "Shared code should actually be shared."],
      commonMistakes: ["One giant components folder.", "Putting feature logic into shared too early.", "Deep imports into another feature's internals."],
      quiz: [
        {
          question: "What does feature-oriented architecture group around?",
          options: ["Business capabilities", "File extensions", "CSS properties", "HTTP verbs"],
          correctIndex: 0,
          explanation: "Features represent user-facing capabilities.",
        },
      ],
    },
    {
      id: "react-day-25-lesson-2",
      title: "Dependency Direction",
      durationMinutes: 12,
      explanation: `A maintainable application has understandable dependency direction. Shared low-level utilities should not depend on a specific feature. Features can depend on shared primitives, while the application layer composes features. Clear boundaries reduce circular dependencies and make changes safer.`,
      diagram: `app
 ↓
features
 ↓
shared/lib

shared ✕→ feature`,
      codeExample: {
        title: "Dependency direction",
        code: `// Good:
// features/projects → shared/ui/Button

// Avoid:
// shared/ui/Button → features/projects/ProjectEditor`,
      },
      keyTakeaways: ["Keep dependencies flowing toward lower-level shared layers.", "Prevent shared code from depending on features.", "Boundaries make ownership clearer."],
      commonMistakes: ["Circular imports.", "Shared components importing feature business logic.", "Deep internal imports across features."],
      quiz: [
        {
          question: "Which dependency is usually unhealthy?",
          options: ["shared → feature", "feature → shared", "app → feature", "feature → lib"],
          correctIndex: 0,
          explanation: "Shared layers should not depend on feature-specific code.",
        },
      ],
    },
    {
      id: "react-day-25-lesson-3",
      title: "Data Access and Server State",
      durationMinutes: 12,
      explanation: `Server state (data owned by a backend) has different concerns from local UI state. It needs fetching, caching, synchronization, stale data handling, retries, and mutations. A data-access layer or TanStack Query can centralize these concerns instead of scattering fetch logic throughout components.`,
      diagram: `Component
   ↓
query hook / data-access layer
   ↓
API
   ↓
server

UI state stays separate`,
      codeExample: {
        title: "Feature query hook",
        code: `export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
}

export async function getProjects() {
  const response = await fetch("/api/projects");
  if (!response.ok) throw new Error("Failed to load projects");
  return response.json();
}`,
      },
      keyTakeaways: ["Separate server state from local UI state.", "Centralize data access where useful.", "Query libraries can handle caching and synchronization concerns."],
      commonMistakes: ["Fetching directly in every component.", "Putting server responses into unrelated global UI state.", "Mixing API code with presentation markup."],
      quiz: [
        {
          question: "What is server state?",
          options: ["Data owned by and synchronized with a backend", "A CSS variable", "A local boolean", "A component prop"],
          correctIndex: 0,
          explanation: "Server state comes from an external data source and has synchronization concerns.",
        },
      ],
    },
    {
      id: "react-day-25-lesson-4",
      title: "Design Systems and Reusable UI",
      durationMinutes: 12,
      explanation: `A design system provides reusable visual and interaction primitives such as Button, Input, Dialog, EmptyState, and DataTable. Good shared components expose stable APIs without containing feature-specific business rules. The goal is consistency and reuse, not creating abstractions for every HTML element.`,
      diagram: `Feature
  ↓
shared Button
shared Input
shared Dialog
shared EmptyState`,
      codeExample: {
        title: "Shared UI primitive",
        code: `type ButtonProps = {
  variant: "primary" | "secondary" | "danger";
  children: React.ReactNode;
};

export function Button({ variant, children }: ButtonProps) {
  return <button data-variant={variant}>{children}</button>;
}`,
      },
      keyTakeaways: ["Shared UI should be presentation-focused.", "Design systems reduce repeated interaction decisions.", "Extract components when reuse and consistency justify them."],
      commonMistakes: ["Creating a component for every div.", "Putting business rules into shared primitives.", "Making APIs so generic that they become difficult to use."],
      quiz: [
        {
          question: "What belongs in a shared Button?",
          options: ["Reusable interaction and presentation behavior", "Project-specific billing rules", "A specific feature's API call", "Database credentials"],
          correctIndex: 0,
          explanation: "Shared primitives should remain reusable and feature-agnostic.",
        },
      ],
    },
    {
      id: "react-day-25-lesson-5",
      title: "Maintainability and Code Quality",
      durationMinutes: 12,
      explanation: `Production architecture is ultimately about making change safe. Keep modules understandable, name concepts clearly, test important behavior, enforce boundaries with tooling, and document decisions that are not obvious. Good architecture should make the next feature easier to add, not create a maze of abstractions.`,
      diagram: `New feature
 ↓
clear ownership
 ↓
shared primitives
 ↓
typed data access
 ↓
tests + boundaries
 ↓
safe change`,
      codeExample: {
        title: "Simple feature entry point",
        code: `// features/projects/index.ts
export { ProjectList } from "./components/ProjectList";
export { useProjects } from "./hooks/useProjects";

// Other modules use the public feature API instead of deep internal imports.`,
      },
      keyTakeaways: ["Optimize for safe change.", "Use public module APIs to protect boundaries.", "Automate architecture rules where practical."],
      commonMistakes: ["Overengineering before the need exists.", "Ignoring module ownership.", "Allowing deep imports that bypass intended APIs."],
      quiz: [
        {
          question: "What is a useful architecture goal?",
          options: ["Make future changes safer and clearer", "Maximize abstraction count", "Hide every file", "Avoid all shared code"],
          correctIndex: 0,
          explanation: "Maintainability is about reducing the cost and risk of future changes.",
        },
      ],
    },
    {
      id: "day6",
      title: "Reusable Component Patterns",
      durationMinutes: 12,
      explanation: "Reusable component APIs need clear ownership. Providers group shared state behind a focused hook, slots let callers supply structured JSX, and polymorphic components can preserve a shared design while rendering an appropriate semantic element. HOCs remain useful when wrapping an unchangeable component, but hooks are usually simpler for new code.",
      diagram: "Provider → focused hook → feature\nComponent → named slots → caller content",
      codeExample: { title: "Named slot API", code: "<Card header={<Title />} footer={<Actions />}>Content</Card>" },
      keyTakeaways: ["Prefer focused providers over one global context.", "Slots support flexible composition."],
      commonMistakes: ["Using HOCs where a hook is simpler.", "Putting feature logic in shared primitives."],
      quiz: [{ question: "When are slots useful?", options: ["When callers need structured JSX", "To fetch data", "To create reducers", "To replace semantics"], correctIndex: 0, explanation: "Slots let a component accept flexible structured content." }],
    },
  ],
  finalQuiz: [
    {
      question: "What does feature-oriented architecture organize around?",
      options: ["Business capabilities", "CSS files", "HTTP status codes", "Database columns"],
      correctIndex: 0,
      explanation: "Features group code around user-facing capabilities.",
    },
    {
      question: "Which dependency direction should generally be avoided?",
      options: ["shared → feature", "feature → shared", "app → feature", "feature → lib"],
      correctIndex: 0,
      explanation: "Shared layers should remain independent of feature-specific code.",
    },
    {
      question: "Why separate server state from UI state?",
      options: ["They have different synchronization and lifecycle concerns", "They are always identical", "Server state cannot be cached", "UI state belongs in the database"],
      correctIndex: 0,
      explanation: "Server state requires fetching, caching, and synchronization.",
    },
    {
      question: "What is a good shared component?",
      options: ["A reusable, feature-agnostic UI primitive", "A hidden feature controller", "A database model", "A specific API endpoint"],
      correctIndex: 0,
      explanation: "Shared primitives should be reusable across features.",
    },
  ],
  project: {
    name: "Production-Ready React Architecture",
    goal: "Build a scalable feature-oriented React application with clear boundaries and production patterns.",
    brief: "Create a small project-management app organized by features, with shared UI primitives, centralized server-state access, tests, and clear module boundaries.",
    steps: [
      "Create app, features, shared, and lib layers.",
      "Build a projects feature that owns its business-specific components, hooks, API code, and tests.",
      "Add a billing feature with the same ownership pattern.",
      "Create shared Button, Input, Dialog, and EmptyState primitives.",
      "Use TanStack Query or an equivalent data-access layer for server state.",
      "Expose a small public API from each feature and avoid deep internal imports.",
      "Add tests for important user flows and enforce dependency boundaries where practical.",
    ],
    acceptance: [
      "Feature folders own feature-specific business code.",
      "Shared components are genuinely reusable and feature-agnostic.",
      "Server-state fetching is not scattered across presentation components.",
      "Server state and local UI state are treated separately.",
      "Features expose intentional public entry points instead of deep imports.",
      "Important flows have automated tests.",
      "A new feature can be added without restructuring unrelated features.",
    ],
    stretch: [
      "Add ESLint rules for import boundaries.",
      "Build a reusable DataTable.",
      "Document key architectural decisions with short ADRs.",
      "Add Storybook for shared UI primitives.",
    ],
  },
};
