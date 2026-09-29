import type { LessonDay } from "@/lib/learn/lesson-types";

const finalQuiz = [
  ["What is React Testing Library mainly designed to test?", ["Database queries", "User-facing React behavior", "Server infrastructure", "CSS compilation"], 1],
  ["Which query is generally preferred for finding an accessible button?", ["getByRole()", "querySelector()", "getByClassName()", "findByCSS()"], 0],
  ["What does userEvent help simulate?", ["Database migrations", "User interactions", "Server deployment", "Image optimization"], 1],
  ["What should a form test include?", ["Only successful submission", "Only the submit button", "Input, validation, submission, and result states", "Only CSS"], 2],
  ["Which component can use useState and browser event handlers?", ["Client Component", "Database model", "Server-only module", "Prisma schema"], 0],
  ["Why mock an external API?", ["To make tests isolated and predictable", "To test production data", "To increase network requests", "To avoid assertions"], 0],
  ["What should you test after a user clicks a button?", ["The internal state variable", "The resulting user-visible behavior", "The CSS class name", "The source-code line number"], 1],
  ["Which is usually better to test?", ["Implementation details", "User behavior", "Private component variables", "CSS implementation"], 1],
  ["Why test error states?", ["Users never encounter errors", "Applications can fail and should respond correctly", "Errors are only for developers", "Errors cannot be tested"], 1],
  ["What is a good component testing strategy?", ["Test every HTML tag individually", "Test important user behavior and states", "Test only successful states", "Test only snapshots"], 1],
] as const;

export const NEXTJS_DAY_37: LessonDay = {
  day: 37,
  title: "Component Testing",
  overview: "Learn how to test React components from the user’s point of view with <b>React Testing Library</b>. You’ll test rendered content, buttons, forms, interactions, Server and Client Component boundaries, and mocked dependencies.",
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: [
    {
      id: "nextjs-37-1", title: "React Testing Library Fundamentals", durationMinutes: 15,
      explanation: "Component testing checks whether a React component behaves correctly. Instead of checking internal React state, React Testing Library asks you to test what the user can see and interact with.\n\n<b>Test the component the way a user experiences it.</b> Render the component, find visible content, interact with it, and check the result. Prefer accessible queries such as `getByRole`, `getByLabelText`, and `getByText`. Avoid fragile selectors such as `container.querySelector(\".some-class\")` when an accessible query exists.",
      diagram: "             Component\n                 │\n                 ▼\n              Render\n                 │\n                 ▼\n             User View\n        ┌────────┴────────┐\n        ▼                 ▼\n      Find              Interact\n        │                 │\n        └────────┬────────┘\n                 ▼\n            Check Result",
      codeExample: { title: "Render a component and find visible content", code: `import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

export function Greeting() {
  return <section><h1>Hello, user!</h1><p>Welcome back.</p></section>;
}

describe("Greeting", () => {
  it("shows the greeting", () => {
    render(<Greeting />);
    expect(screen.getByRole("heading", { name: "Hello, user!" })).toBeInTheDocument();
    expect(screen.getByText("Welcome back.")).toBeInTheDocument();
  });
});` },
      keyTakeaways: ["React Testing Library tests from the user’s perspective.", "Render before testing.", "Prefer accessible queries.", "Test visible behavior, not internal implementation.", "`getByRole` is often a useful first choice."],
      commonMistakes: ["Testing React state directly.", "Testing CSS class names unnecessarily.", "Using fragile selectors.", "Testing implementation instead of behavior.", "Forgetting accessibility when selecting elements."], quiz: [],
      rawMiniQuiz: "<b>What should component tests focus on?</b>\nUser-visible behavior.\n\n<b>Which query is usually good for a button?</b>\n`getByRole()`.",
    },
    {
      id: "nextjs-37-2", title: "Testing Component Behavior and User Interactions", durationMinutes: 15,
      explanation: "A component is not useful simply because it renders. Test what happens after the user interacts with it. Testing that details appear after a click is more valuable than checking that a button exists.\n\nUse `userEvent` for realistic interactions. Check the UI before and after an interaction, await async interactions, and assert the user-visible result instead of manually changing component state.",
      diagram: "              Render\n                │\n                ▼\n         Button is visible\n                │\n                ▼\n          User clicks\n                │\n                ▼\n          State changes\n                │\n                ▼\n        New content appears",
      codeExample: { title: "Click a button and assert the result", code: `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();
render(<Details />);

expect(screen.queryByText("These are the details.")).not.toBeInTheDocument();

await user.click(screen.getByRole("button", { name: "Show Details" }));

expect(screen.getByText("These are the details.")).toBeInTheDocument();` },
      keyTakeaways: ["Test what happens after interactions.", "Use `userEvent` for realistic actions.", "Check UI before and after interaction.", "Await async interactions.", "Test results, not internal state."],
      commonMistakes: ["Changing component state directly.", "Forgetting `await`.", "Only checking that a button exists.", "Not checking resulting UI.", "Testing implementation details."], quiz: [],
      rawMiniQuiz: "<b>What should you test after clicking a button?</b>\nThe user-visible result of the click.",
    },
    {
      id: "nextjs-37-3", title: "Testing Forms", durationMinutes: 15,
      explanation: "Forms are important components to test. Follow the real user flow: enter data, submit, validate, send a request, and show success or error UI.\n\nTest valid and invalid submissions, validation messages, loading states, success states, and errors when applicable. Use labels and accessible roles so tests reflect how people use the form.",
      diagram: "             Form\n              │\n      ┌───────┴───────┐\n      ▼               ▼\n    Input           Submit\n      │               │\n      ▼               ▼\n   Validate       Send Request\n              ┌───────┴───────┐\n           Success           Error\n              │               │\n              ▼               ▼\n          Show result     Show message",
      codeExample: { title: "Test invalid and valid form submission", code: `const user = userEvent.setup();
render(<LoginForm />);

await user.click(screen.getByRole("button", { name: "Sign In" }));
expect(screen.getByRole("alert")).toHaveTextContent("Email is required");

await user.type(screen.getByLabelText("Email"), "user@example.com");
await user.click(screen.getByRole("button", { name: "Sign In" }));
expect(screen.queryByRole("alert")).not.toBeInTheDocument();` },
      keyTakeaways: ["Test forms as real users use them.", "Test valid and invalid submissions.", "Test validation messages.", "Test loading, success, and error states.", "Use labels and accessible roles."],
      commonMistakes: ["Testing only successful submission.", "Forgetting empty input.", "Not testing error messages.", "Testing form internals.", "Not testing disabled or loading states."], quiz: [],
      rawMiniQuiz: "<b>What should you test for a form?</b>\nInput, validation, submission, and result states.",
    },
    {
      id: "nextjs-37-4", title: "Server and Client Component Boundaries", durationMinutes: 15,
      explanation: "Next.js has Server Components and Client Components. Client Components are for browser interaction such as `useState`, `useEffect`, `onClick`, `onChange`, and browser APIs. Server Components handle server work without sending all that code to the browser.\n\nA component marked `\"use client\"` can usually be tested as interactive React UI. A Server Component may depend on databases, cookies, headers, and server-only functions, so it may need a different testing strategy. Keep server responsibilities and browser interactions separate.",
      diagram: "                Next.js\n                   │\n          ┌────────┴────────┐\n          ▼                 ▼\n    Server Component   Client Component\n          │                 │\n          ▼                 ▼\n      Server work       Browser UI\n                            │\n                            ▼\n                           User",
      codeExample: { title: "Test an interactive Client Component", code: `const user = userEvent.setup();
render(<DashboardStats stats={{ users: 120, revenue: 5000 }} />);

await user.click(screen.getByRole("button", { name: "Toggle Revenue" }));

expect(screen.getByText("Revenue: $5000")).toBeInTheDocument();` },
      keyTakeaways: ["Next.js has Server and Client Components.", "Client Components handle browser interactions.", "Server Components handle server-side work.", "Use React Testing Library for interactive client behavior.", "Keep server-only dependencies out of browser components."],
      commonMistakes: ["Adding `\"use client\"` everywhere.", "Putting database logic in Client Components.", "Testing server-only behavior as browser behavior.", "Mixing server-only modules into clients.", "Forgetting the boundary."], quiz: [],
      rawMiniQuiz: "<b>Which component is appropriate for `useState` and `onClick`?</b>\nA Client Component.",
    },
    {
      id: "nextjs-37-5", title: "Mocking APIs and External Dependencies", durationMinutes: 15,
      explanation: "Components may call APIs. Component tests should not depend on a real production API, so replace requests with a mock response. This makes tests predictable and isolated.\n\nTest successful responses, failures, empty data, and unexpected data. A production component needs useful error UI, and tests should verify it. Clean up global mocks when needed and keep mocked responses close to real API responses.",
      diagram: "             Component\n                 │\n                 ▼\n            API Request\n        ┌────────┴────────┐\n        ▼                 ▼\n   Real Server        Mock Server\n        │                 │\n        ▼                 ▼\n   External data      Test data",
      codeExample: { title: "Mock a products request", code: `import { vi } from "vitest";

vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
  json: async () => ({ products: ["Keyboard", "Mouse"] }),
}));

render(<ProductList />);

expect(await screen.findByText("Keyboard")).toBeInTheDocument();
expect(await screen.findByText("Mouse")).toBeInTheDocument();

vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));` },
      keyTakeaways: ["External dependencies can be mocked.", "Mocking makes tests predictable.", "Test successful API responses.", "Test API failures.", "Clean up global mocks when needed."],
      commonMistakes: ["Calling production APIs from tests.", "Testing only successful responses.", "Forgetting to restore mocks.", "Making mocked responses unlike real ones.", "Mocking too much."], quiz: [],
      rawMiniQuiz: "<b>Why mock an API during a component test?</b>\nTo make the test predictable and isolated.",
    },
    {
      id: "nextjs-37-6", title: "Complete Component Testing Strategy", durationMinutes: 15,
      explanation: "A strong component suite covers how users interact with the application: navigation, search, filters, forms, buttons, and error states. Test important behavior instead of every HTML element.\n\nA useful flow is: component renders, interaction works, validation works, loading works, success works, error works, and the API dependency is handled. These focused tests provide meaningful confidence.",
      diagram: "                  Components\n                      │\n        ┌─────────────┼─────────────┐\n        ▼             ▼             ▼\n      Render      Interaction      Forms\n        └─────────────┼─────────────┘\n                      ▼\n                  API Mock\n                      ▼\n                 Result State\n              ┌───────┴───────┐\n            Success          Error",
      codeExample: { title: "Organize component tests", code: `tests/
└── components/
    ├── login-form.test.tsx
    ├── product-list.test.tsx
    ├── search-box.test.tsx
    └── dashboard.test.tsx` },
      keyTakeaways: ["Test meaningful user behavior.", "Include success and error states.", "Test forms and interactions.", "Mock external dependencies where appropriate.", "Keep tests focused and readable."],
      commonMistakes: ["Testing every element unnecessarily.", "Creating huge component tests.", "Ignoring error states.", "Testing implementation details.", "Making every test depend on external services."], quiz: [],
      rawMiniQuiz: "<b>What should a good component test describe?</b>\nWhat a user can do and observe.",
    },
  ],
  finalQuiz: finalQuiz.map(([question, options, correctIndex]) => ({ question, options: [...options], correctIndex, explanation: "Review the Component Testing lessons and test user-visible behavior." })),
  footer: "<b>Day 37 core lesson</b>\n\nTest what users can see and do. Keep browser interactions in Client Components, server work on the server, and external I/O behind controlled test boundaries.",
  project: {
    name: "TestLab UI",
    goal: "Build a small SaaS dashboard and a React Testing Library suite for important user behavior.",
    brief: "Build navigation, a dashboard header, search, filters, a project list, and a create-project form. Include loading, empty, success, and error states. Use Client Components only for interaction and keep server-only work on the server.\n\nDashboard\n├── Sidebar\n├── Header\n├── Search\n├── Filters\n├── Project List\n└── Create Project Form",
    steps: ["Configure React Testing Library and Vitest.", "Create dashboard navigation, header, project list, search, filter, and create-project form.", "Validate project name as required, 2 to 100 characters, and optional description up to 500 characters.", "Add loading, success, error, and empty states.", "Write tests for rendered content, buttons, forms, validation, loading, success, API errors, empty states, search, and filtering.", "Mock API responses for 200 success, 400 bad request, 500 server error, empty result, and unexpected data.", "Keep Client and Server Component responsibilities separate."],
    acceptance: ["React Testing Library is configured and Vitest runs component tests.", "Accessible queries are used for rendered content and interactions.", "Forms, validation, loading, success, error, and empty states are tested.", "API calls are mocked, including failure states.", "Search and filter behavior are tested.", "Tests describe user behavior rather than implementation details."],
    stretch: ["Add keyboard navigation and accessibility-focused tests.", "Test modal dialogs, optimistic updates, pagination, and debounced search.", "Add reusable test helpers, coverage reporting, and visual regression tests."],
  },
};
