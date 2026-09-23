import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_23_LESSONS: LessonDay = {
  day: 23,
  title: "Testing React Applications",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "react-day-23-lesson-1",
      title: "Testing Strategy",
      durationMinutes: 12,
      explanation: `React tests should focus on behavior users and other code depend on. A useful test suite usually has fast unit/component tests plus a smaller set of end-to-end tests for critical flows. Tests are valuable when they give confidence without tightly coupling the suite to implementation details.`,
      diagram: `Component behavior
   ↓
Vitest + Testing Library
   ↓
critical user flow
   ↓
Playwright E2E`,
      codeExample: {
        title: "Behavior-focused test",
        code: `expect(screen.getByRole("button", { name: "Save" }))
  .toBeEnabled();`,
      },
      keyTakeaways: ["Test observable behavior.", "Keep fast tests close to components.", "Use end-to-end tests for critical workflows."],
      commonMistakes: ["Testing internal state directly.", "Writing only end-to-end tests.", "Writing huge tests that assert unrelated details."],
      quiz: [
        {
          question: "What should a React test usually focus on?",
          options: ["User-observable behavior", "Private variable names", "Exact component internals", "File size"],
          correctIndex: 0,
          explanation: "Behavior-focused tests survive implementation changes better.",
        },
      ],
    },
    {
      id: "react-day-23-lesson-2",
      title: "Vitest and React Testing Library",
      durationMinutes: 12,
      explanation: `Vitest provides a fast test runner and assertion ecosystem, while React Testing Library renders components and encourages accessible, user-like queries. Prefer roles, labels, and visible text over CSS selectors or component internals.`,
      diagram: `Test
 ↓
render component
 ↓
find by role/label
 ↓
interact
 ↓
assert visible behavior`,
      codeExample: {
        title: "Accessible query",
        code: `render(<LoginForm />);

await user.click(
  screen.getByRole("button", { name: "Sign in" })
);

expect(screen.getByText("Welcome back")).toBeInTheDocument();`,
      },
      keyTakeaways: ["Prefer accessible queries.", "Use user interactions rather than implementation hooks.", "Keep tests readable enough to explain behavior."],
      commonMistakes: ["Using getByTestId for everything.", "Asserting internal state variables.", "Skipping labels and accessible names."],
      quiz: [
        {
          question: "Which query is generally preferred when available?",
          options: ["getByRole", "querySelector", "getByClassName", "findByState"],
          correctIndex: 0,
          explanation: "getByRole reflects accessible user-facing semantics.",
        },
      ],
    },
    {
      id: "react-day-23-lesson-3",
      title: "Mocking APIs with MSW",
      durationMinutes: 12,
      explanation: `MSW (Mock Service Worker) intercepts network requests at the network boundary. Instead of mocking an internal fetch function, tests can make the request your component would make and let MSW return deterministic responses. This is useful for success, loading, empty, unauthorized, and server-error scenarios.`,
      diagram: `Component
   ↓ fetch("/api/projects")
MSW intercepts
   ↓
test response`,
      codeExample: {
        title: "MSW-style handler",
        code: `import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/projects", () =>
    HttpResponse.json([{ id: "1", name: "Learn Rajan" }])
  ),
];`,
      },
      keyTakeaways: ["Mock at the network boundary.", "Create handlers for important response states.", "Keep test responses deterministic."],
      commonMistakes: ["Mocking implementation details instead of the request.", "Testing only successful responses.", "Letting real external APIs run in tests."],
      quiz: [
        {
          question: "What does MSW intercept?",
          options: ["Network requests", "React state", "CSS rules", "TypeScript compilation"],
          correctIndex: 0,
          explanation: "MSW works at the network boundary.",
        },
      ],
    },
    {
      id: "react-day-23-lesson-4",
      title: "Playwright End-to-End Testing",
      durationMinutes: 12,
      explanation: `Playwright runs a real browser and can test complete user flows. End-to-end tests are slower than component tests, so use them for important workflows such as signing in or creating a project. Good E2E tests use stable user-facing locators and avoid unnecessary timing assumptions.`,
      diagram: `Browser
 ↓
open app
 ↓
interact like user
 ↓
API/backend
 ↓
assert final UI`,
      codeExample: {
        title: "Playwright flow",
        code: `import { test, expect } from "@playwright/test";

test("creates a project", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: "New project" }).click();
  await page.getByLabel("Project name").fill("Learn React");
  await page.getByRole("button", { name: "Create" }).click();

  await expect(page.getByText("Learn React")).toBeVisible();
});`,
      },
      keyTakeaways: ["Use E2E for critical flows.", "Prefer stable locators.", "Avoid arbitrary sleeps when waiting for real conditions."],
      commonMistakes: ["Testing every tiny component with E2E.", "Using fixed timeouts everywhere.", "Depending on brittle CSS selectors."],
      quiz: [
        {
          question: "What is Playwright especially useful for?",
          options: ["Complete browser workflows", "Type inference", "CSS preprocessing", "Database migrations"],
          correctIndex: 0,
          explanation: "Playwright tests the application through a browser.",
        },
      ],
    },
    {
      id: "react-day-23-lesson-5",
      title: "Coverage and CI",
      durationMinutes: 12,
      explanation: `Coverage shows which code was exercised, but high coverage does not automatically mean good tests. CI (Continuous Integration) should run deterministic checks on pull requests: linting, type checking, unit/component tests, and selected end-to-end tests. Flaky tests reduce trust in the suite and should be treated as defects.`,
      diagram: `Pull request
 ↓
lint → typecheck → tests → build → E2E
 ↓
pass → merge
fail → fix`,
      codeExample: {
        title: "CI test scripts",
        code: `{
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "build": "vite build"
  }
}`,
      },
      keyTakeaways: ["Coverage is a signal, not the goal.", "CI should be deterministic.", "Flaky tests reduce confidence and should be fixed."],
      commonMistakes: ["Chasing 100% coverage without meaningful assertions.", "Allowing flaky tests to remain ignored.", "Running only tests that happen to pass locally."],
      quiz: [
        {
          question: "What is code coverage?",
          options: ["A measure of which code was exercised by tests", "A security certificate", "A browser API", "A deployment tool"],
          correctIndex: 0,
          explanation: "Coverage reports which code paths were exercised.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What should tests primarily assert?",
      options: ["Behavior", "Private implementation", "CSS class order", "Variable names"],
      correctIndex: 0,
      explanation: "Behavior-focused tests provide durable confidence.",
    },
    {
      question: "What does MSW mock?",
      options: ["Network responses", "React hooks", "Browser rendering", "TypeScript"],
      correctIndex: 0,
      explanation: "MSW intercepts requests at the network boundary.",
    },
    {
      question: "When is Playwright especially useful?",
      options: ["Critical browser flows", "Every utility function", "Type declarations", "CSS linting"],
      correctIndex: 0,
      explanation: "E2E tools are useful for complete workflows.",
    },
    {
      question: "Does 100% coverage guarantee good tests?",
      options: ["Yes", "No", "Only in TypeScript", "Only in CI"],
      correctIndex: 1,
      explanation: "Coverage does not measure the quality of assertions.",
    },
  ],
  project: {
    name: "Tested Project Manager",
    goal: "Build a layered automated test suite for a small React project manager.",
    brief: "Test important UI behavior with component tests, network behavior with MSW, and a critical create-project flow with Playwright.",
    steps: [
      "Set up Vitest and React Testing Library.",
      "Test accessible rendering, validation, and user interactions.",
      "Use MSW for successful and failing API responses.",
      "Cover loading, empty, unauthorized, and server-error states.",
      "Write a Playwright test for creating a project.",
      "Run lint, typecheck, unit tests, build, and selected E2E tests in CI.",
    ],
    acceptance: [
      "Tests use accessible queries where practical.",
      "API tests use MSW rather than real external services.",
      "Success and important failure states are covered.",
      "The create-project flow works in an E2E test.",
      "Tests are deterministic and do not depend on arbitrary sleeps.",
    ],
    stretch: [
      "Add accessibility assertions.",
      "Run E2E tests in multiple browsers.",
      "Add API contract tests.",
    ],
  },
};
