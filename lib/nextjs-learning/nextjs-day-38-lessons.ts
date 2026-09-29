import type { LessonDay } from "@/lib/learn/lesson-types";

const finalQuiz = [
  ["What does Playwright primarily provide?", ["Database migrations", "Browser automation", "CSS compilation", "Server caching"], 1],
  ["What is an E2E test designed to verify?", ["One small function", "A complete user journey", "One CSS class", "A database column only"], 1],
  ["Which is a critical user journey?", ["Checking one CSS property", "Login → create project → view project", "Checking a private variable", "Testing a utility function"], 1],
  ["What should authentication E2E tests include?", ["Only successful login", "Successful login, invalid login, protected routes, and logout", "Only logout", "Only the login button"], 1],
  ["Why should E2E tests be isolated?", ["So tests depend on one another", "So tests can run independently and reliably", "So tests need no assertions", "So tests always run slowly"], 1],
  ["What can Playwright screenshots help with?", ["Debugging failed tests", "Database migrations", "Password encryption", "API authentication"], 0],
  ["Which is generally a good selector?", ["Random CSS class", "Accessible role and name", "Generated DOM position", "Internal React state"], 1],
  ["Why should every UI detail not have an E2E test?", ["E2E tests focus on important journeys and can be more expensive", "Browsers cannot test UI", "Playwright cannot click buttons", "Forms cannot be tested"], 0],
  ["What should you avoid in E2E tests?", ["Meaningful assertions", "Critical workflows", "Arbitrary fixed waits", "Accessible selectors"], 2],
  ["Which strategy works well together?", ["Only E2E tests", "Unit + component + E2E tests", "Only screenshots", "Only manual testing"], 1],
] as const;

export const NEXTJS_DAY_38: LessonDay = {
  day: 38,
  title: "End-to-End Testing",
  overview: "Learn how to test complete browser journeys with <b>Playwright</b>. You’ll cover browser automation, authentication, critical workflows, screenshots, traces, test isolation, and a production E2E suite.",
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: [
    {
      id: "nextjs-38-1", title: "Playwright Fundamentals", durationMinutes: 15,
      explanation: "End-to-end testing checks the application through a real browser. Playwright opens a browser, navigates to a URL, finds accessible UI, performs user actions, and asserts visible outcomes.\n\nUse accessible selectors such as `getByRole` and `getByLabel`. An E2E test verifies a full user journey, not internal component state. This gives confidence that browser, UI, routes, APIs, and data work together.",
      diagram: "User journey\n  │\n  ▼\nPlaywright browser\n  │\n  ▼\nNext.js application\n  │\n  ▼\nVisible result",
      codeExample: { title: "Install and run Playwright", code: `npm install -D @playwright/test
npx playwright install
npx playwright test

import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading")).toBeVisible();
});` },
      keyTakeaways: ["Playwright automates a real browser.", "E2E tests verify complete user journeys.", "Use accessible roles and labels.", "Assert visible outcomes."],
      commonMistakes: ["Testing private implementation details.", "Using fragile CSS selectors.", "Using arbitrary waits.", "Running against production data."], quiz: [],
      rawMiniQuiz: "<b>What does Playwright provide?</b>\nBrowser automation.",
    },
    {
      id: "nextjs-38-2", title: "Browser Automation and User Journeys", durationMinutes: 15,
      explanation: "Browser automation follows the actions a real user takes: open a route, fill fields, click buttons, and observe new content. Good E2E tests focus on an understandable workflow rather than unrelated actions combined into one long script.\n\nUse meaningful assertions after every important transition. Prefer waiting for actual UI conditions, such as a heading becoming visible, instead of fixed delays.",
      diagram: "Open page\n  │\n  ▼\nFind accessible UI\n  │\n  ▼\nUser action\n  │\n  ▼\nAssert outcome",
      codeExample: { title: "Automate a browser interaction", code: `test("user can open a project", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByRole("link", { name: "Projects" }).click();
  await page.getByRole("button", { name: "Create Project" }).click();
  await expect(page.getByRole("heading", { name: "New Project" })).toBeVisible();
});` },
      keyTakeaways: ["Automate real user actions.", "Focus on one understandable journey.", "Use meaningful assertions.", "Wait for real conditions, not fixed timeouts."],
      commonMistakes: ["Combining unrelated workflows.", "Using arbitrary delays.", "Testing low-value UI details.", "Missing assertions after an action."], quiz: [],
      rawMiniQuiz: "<b>What does an E2E test verify?</b>\nA complete user journey.",
    },
    {
      id: "nextjs-38-3", title: "Authentication Flows", durationMinutes: 15,
      explanation: "Authentication is a critical browser journey. Test valid login, invalid login, access to protected routes when logged out, and logout. Never use production accounts or commit credentials to source code.\n\nA complete login test opens the login page, fills accessible email and password fields, submits the form, and waits for the dashboard. An invalid-login test asserts a visible error. A logout test confirms the login page returns and protected pages are unavailable.",
      diagram: "Login\n  │\n  ▼\nDashboard\n  │\n  ▼\nProtected routes\n  │\n  ▼\nLogout\n  │\n  ▼\nLogin page",
      codeExample: { title: "Test login through the browser", code: `test("user can log in", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("user@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});` },
      keyTakeaways: ["Test successful and unsuccessful login.", "Test protected routes and logout.", "Do not use production credentials.", "Use accessible selectors."],
      commonMistakes: ["Using real production accounts.", "Sharing authentication state incorrectly.", "Testing only successful login.", "Forgetting protected routes.", "Exposing credentials in source code."], quiz: [],
      rawMiniQuiz: "<b>Which authentication scenarios should be tested?</b>\nValid login, invalid login, protected routes, and logout.",
    },
    {
      id: "nextjs-38-4", title: "Form Submission and Critical Journeys", durationMinutes: 15,
      explanation: "Not every feature needs an E2E test. Prioritize <b>critical user journeys</b>, such as sign up, login, create project, view project, update project, and logout. If this flow breaks, people may not be able to use the product.\n\nKeep each journey understandable. Test the whole business action, not every small UI variation through the browser.",
      diagram: "SaaS App\n  │\n  ├──► Login\n  ├──► Create Project\n  ├──► Update Project\n  └──► Logout",
      codeExample: { title: "Test project creation", code: `test("user can create a project", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Create Project" }).click();
  await page.getByLabel("Project Name").fill("Marketing Website");
  await page.getByLabel("Description").fill("New marketing website");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Marketing Website")).toBeVisible();
});` },
      keyTakeaways: ["E2E tests should focus on critical workflows.", "Test important business actions.", "Avoid testing every UI state with E2E.", "Keep journeys understandable."],
      commonMistakes: ["Creating hundreds of nearly identical E2E tests.", "Testing low-value UI details.", "Combining unrelated workflows.", "Making tests too long."], quiz: [],
      rawMiniQuiz: "<b>What should receive priority for E2E testing?</b>\nCritical user journeys.",
    },
    {
      id: "nextjs-38-5", title: "Screenshots, Debugging, and Test Isolation", durationMinutes: 15,
      explanation: "When an E2E test fails, screenshots and traces help explain what happened in the browser. Configure Playwright to retain these artifacts on failure.\n\nEvery test should be independent. Test A must not create data that Test B expects. Each test creates the data it needs and cleans it up. This avoids dependence on execution order, previous state, production data, or a developer’s personal account.",
      diagram: "                 Test Suite\n          ┌──────────┼──────────┐\n          ▼          ▼          ▼\n        Test A     Test B     Test C\n          │          │          │\n       Own data   Own data   Own data\n          └──────────┼──────────┘\n                     ▼\n                Independent",
      codeExample: { title: "Keep failure artifacts", code: `import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});

test("dashboard screenshot", async ({ page }) => {
  await page.goto("/dashboard");
  await page.screenshot({ path: "test-results/dashboard.png", fullPage: true });
});` },
      keyTakeaways: ["Screenshots help debug failed browser tests.", "Traces provide more debugging information.", "Tests should be independent.", "Test data should be isolated.", "Avoid execution-order dependence."],
      commonMistakes: ["Sharing data between tests.", "Depending on execution order.", "Taking screenshots on every success.", "Leaving test data behind.", "Using fixed waits."], quiz: [],
      rawMiniQuiz: "<b>Why is test isolation important?</b>\nIt makes tests reliable and independent.",
    },
    {
      id: "nextjs-38-6", title: "Building a Production E2E Test Suite", durationMinutes: 15,
      explanation: "A production E2E suite focuses on the most important routes: authentication, dashboard, create, read, update, delete, billing or settings, and logout. Do not create an E2E test for every small component.\n\nUse a testing pyramid: many fast unit tests, more component tests, and fewer high-value E2E journeys. Keep E2E tests isolated, use screenshots and traces for failures, and run them through Playwright.",
      diagram: "                  Test Pyramid\n                      │\n                      ▼\n                 E2E Tests\n                Few, valuable\n                      │\n                      ▼\n             Component Tests\n                More tests\n                      │\n                      ▼\n                Unit Tests\n             Many, fast tests",
      codeExample: { title: "Configure the E2E suite", code: `import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
  },
});

// npx playwright test
// npx playwright test --ui` },
      keyTakeaways: ["E2E tests focus on critical workflows.", "Keep most tests at unit and component levels.", "Playwright provides browser confidence.", "Keep tests isolated.", "Use screenshots and traces to debug failures."],
      commonMistakes: ["Making the whole suite E2E.", "Writing very long workflows.", "Sharing auth or data incorrectly.", "Using production data.", "Using arbitrary delays.", "Ignoring failed-test artifacts."], quiz: [],
      rawMiniQuiz: "<b>Which test type should generally be fewer in number?</b>\nE2E tests.",
    },
  ],
  finalQuiz: finalQuiz.map(([question, options, correctIndex]) => ({ question, options: [...options], correctIndex, explanation: "Review the End-to-End Testing lessons and critical browser workflows." })),
  footer: "<b>Day 38 core lesson</b>\n\nUnit tests ask whether logic works. Component tests ask whether UI behaves correctly. Integration tests ask whether application pieces work together. E2E tests ask whether a real user can complete an important journey.",
  project: {
    name: "TaskFlow",
    goal: "Build a SaaS application with a complete unit, component, integration, and Playwright E2E test suite.",
    brief: "Build authentication, protected dashboard pages, projects, tasks, search and filters, task status updates, and settings. The goal is a full automated test suite, not only the application.\n\nTesting layers:\n\nUnit → business logic\nComponent → React UI behavior\nIntegration → API and database\nE2E → critical browser journey",
    steps: ["Create landing, login, dashboard, projects, project details, tasks, and settings pages.", "Add login, logout, protected routes, project CRUD, task CRUD, search, filters, and TODO, IN_PROGRESS, and DONE statuses.", "Write Vitest unit tests for validation, permissions, task rules, project rules, formatting, and business logic.", "Write React Testing Library tests for ProjectForm, TaskForm, TaskList, SearchBox, TaskFilter, and Dashboard states.", "Write API integration tests for projects and tasks, including successful and invalid requests, authentication, authorization, missing resources, and database failure.", "Write Playwright journeys for login, create project, create task, search and filter, update task, and logout.", "Configure screenshots and traces on E2E failure and keep every test isolated."],
    acceptance: ["Authentication and protected routes work.", "Projects and tasks can be created, viewed, updated, searched, filtered, and managed.", "Unit, component, integration, and E2E tests can run separately.", "Critical login, logout, project, task, search/filter, error, and update journeys have coverage.", "Failure screenshots and traces are available.", "Tests are isolated and never use production data."],
    stretch: ["Reuse Playwright authentication state.", "Test multiple roles and role authorization.", "Add cross-browser, mobile viewport, accessibility, and visual regression tests.", "Run the full suite in CI with a temporary database, seeded data, parallel runs, retries, and test-report artifacts."],
  },
};
