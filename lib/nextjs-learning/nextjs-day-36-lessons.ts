import type { LessonDay } from "@/lib/learn/lesson-types";

const finalQuiz = [
  ["What is the main purpose of automated testing?", ["To make the application larger", "To automatically verify expected behavior", "To replace the database", "To replace the developer"], 1, "Tests automatically check whether code behaves as expected."],
  ["Which testing tool is used in this lesson?", ["Prisma", "Vitest", "Redis", "Docker"], 1, "Vitest runs the unit and integration tests."],
  ["Which test is best for a small pure function?", ["Unit test", "Database migration", "Load test", "CDN test"], 0, "Unit tests are fast checks for small isolated code."],
  ["A function accepts values from 1 to 10. Which values are especially useful to test?", ["Only 5", "Only 1", "0, 1, 10, and 11", "Only 10"], 2, "Test values below, at, and above the boundaries."],
  ["What is the purpose of a mock?", ["To permanently replace a database", "To create a fake dependency for testing", "To make production slower", "To replace TypeScript"], 1, "Mocks isolate the code being tested from external systems."],
  ["Why should important validation happen on the server?", ["Users can bypass frontend validation", "CSS requires server validation", "It makes JavaScript smaller", "It replaces the database"], 0, "Frontend validation improves UX, but server validation protects the application."],
  ["Where should database integration tests run?", ["Production database", "A dedicated test database", "A user's browser", "The CDN"], 1, "Never run automated tests against production data."],
  ["What does an API integration test usually verify?", ["Only CSS", "Request, application behavior, and response", "Only database indexes", "Only frontend colors"], 1, "It checks the real flow through API, validation, services, and response."],
  ["Why should tests be isolated?", ["To make tests depend on each other", "To prevent one test from affecting another", "To make tests slower", "To avoid assertions"], 1, "Each test should create and clean up its own data."],
  ["Which strategy provides broader confidence?", ["Only unit tests", "Only API tests", "Only database tests", "A combination of unit, service, API, and integration tests"], 3, "Different test types cover different risks."],
] as const;

export const NEXTJS_DAY_36: LessonDay = {
  day: 36,
  title: "Unit and Integration Testing",
  overview: "Learn how to test a Next.js application with Vitest. Start with utility functions, then move into validation, services, APIs, and database integration tests. By the end, you’ll build an application that can be changed safely without manually checking everything every time.",
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: [
    {
      id: "nextjs-36-1",
      title: "Testing Fundamentals with Vitest",
      durationMinutes: 15,
      explanation: "Testing means writing code that checks whether another piece of code behaves as expected. Instead of manually checking `add(2, 3)`, write a Vitest assertion that expects `5`.\n\nA test normally follows three steps:\n\n1. <b>Arrange</b>\nPrepare the input.\n\n2. <b>Act</b>\nRun the code.\n\n3. <b>Assert</b>\nCheck the result.\n\nA <b>unit test</b> focuses on one small piece of code. An <b>integration test</b> checks multiple pieces together, such as a request, API route, service, database, and response. Both are important. Good tests check behavior rather than implementation details.",
      diagram: "                    Testing\n                       │\n            ┌──────────┴──────────┐\n            │                     │\n         Unit Test          Integration Test\n            │                     │\n            ▼                     ▼\n       Small function       Multiple systems\n            │                     │\n            ▼                     ▼\n        Fast result          Real interaction",
      codeExample: { title: "Install and run Vitest", code: `npm install -D vitest

// package.json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:watch": "vitest --watch"
  }
}

// lib/math.ts
export function add(a: number, b: number) {
  return a + b;
}

// tests/math.test.ts
import { describe, expect, it } from "vitest";
import { add } from "@/lib/math";

describe("add", () => {
  it("adds two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("works with negative numbers", () => {
    expect(add(-2, 3)).toBe(1);
  });
});`, details: "Run the suite with `npm run test:run`. Keep tests independent and run them after code changes." },
      keyTakeaways: ["Tests automatically check application behavior.", "Unit tests focus on small pieces.", "Integration tests check multiple pieces together.", "Vitest provides the testing tools.", "Good tests check behavior rather than implementation details."],
      commonMistakes: ["Testing only successful cases.", "Making tests depend on other tests.", "Testing implementation details.", "Writing complicated tests for simple functions.", "Never running tests after changing code."],
      quiz: [],
      rawMiniQuiz: "<b>1. What does a unit test usually test?</b>\nA small piece of code.\n\n<b>2. Which tool are we using?</b>\nVitest.",
    },
    {
      id: "nextjs-36-2",
      title: "Testing Utilities and Business Logic",
      durationMinutes: 15,
      explanation: "Small utility functions are excellent unit-test candidates: `formatPrice()`, `createSlug()`, `formatDate()`, `calculateTotal()`, and `hasPermission()`.\n\nTest normal cases and unusual cases. For a slug function, think about empty strings, extra spaces, uppercase letters, special characters, and very long values.\n\nBusiness rules deserve dedicated tests because they change over time. Boundary testing is especially useful. If a user can purchase from 1 to 10 items, test 0, 1, 10, and 11. Below the boundary should be rejected, the boundary accepted, and above the boundary rejected.",
      diagram: "                 Utility\n                    │\n        ┌───────────┼───────────┐\n        ▼           ▼           ▼\n      Normal      Empty       Edge\n       Input       Input       Case\n        │           │           │\n        └───────────┼───────────┘\n                    ▼\n              Expected Result",
      codeExample: { title: "Test a utility and its boundaries", code: `// lib/slug.ts
export function createSlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

import { describe, expect, it } from "vitest";

describe("createSlug", () => {
  it("creates a lowercase slug", () => {
    expect(createSlug("Hello World")).toBe("hello-world");
  });

  it("removes extra spaces", () => {
    expect(createSlug("  Hello   World  ")).toBe("hello-world");
  });

  it("handles an empty string", () => {
    expect(createSlug("")).toBe("");
  });
});

export function canPurchase(quantity: number) {
  return quantity > 0 && quantity <= 10;
}

expect(canPurchase(1)).toBe(true);
expect(canPurchase(10)).toBe(true);
expect(canPurchase(11)).toBe(false);
expect(canPurchase(0)).toBe(false);` },
      keyTakeaways: ["Utilities are easy to test.", "Business rules deserve dedicated tests.", "Test normal and unusual inputs.", "Boundary values are important.", "Small tests are easier to maintain."],
      commonMistakes: ["Testing only the happy path.", "Forgetting boundary values.", "Ignoring empty input.", "Putting too much business logic inside API routes.", "Creating giant functions that are difficult to test."],
      quiz: [],
      rawMiniQuiz: "<b>If a rule allows values from 1 to 10, which values should you test?</b>\n1, 10, 0, and 11.",
    },
    {
      id: "nextjs-36-3",
      title: "Validation Testing",
      durationMinutes: 15,
      explanation: "Validation checks whether incoming data follows application rules. A registration API receiving an empty name, malformed email, and weak password should reject it.\n\nFrontend validation improves user experience, but <b>server validation protects your application</b> because users can bypass the browser. Test valid, invalid, empty, malformed, minimum, and maximum values. `it.each` is useful when many similar cases share the same rule.",
      diagram: "                  Request\n                     │\n                     ▼\n               ┌───────────┐\n               │Validation │\n               └─────┬─────┘\n             ┌───────┴───────┐\n            Valid           Invalid\n             │               │\n             ▼               ▼\n        Continue            Error",
      codeExample: { title: "Validate email on the server", code: `// lib/validation.ts
export function validateEmail(email: string) {
  return email.includes("@");
}

import { describe, expect, it } from "vitest";

describe("validateEmail", () => {
  it.each([
    ["user@example.com", true],
    ["hello", false],
    ["", false],
    ["admin@example.com", true],
  ])("validates %s", (email, expected) => {
    expect(validateEmail(email)).toBe(expected);
  });
});` },
      keyTakeaways: ["Validation protects your application from bad input.", "Server validation is essential.", "Test valid and invalid values.", "Boundary and empty values matter.", "`it.each` is useful for similar cases."],
      commonMistakes: ["Trusting only frontend validation.", "Testing only valid input.", "Forgetting empty strings.", "Forgetting maximum and minimum values.", "Not testing malformed data."],
      quiz: [],
      rawMiniQuiz: "<b>Why must important validation happen on the server?</b>\nThe browser can be bypassed.",
    },
    {
      id: "nextjs-36-4",
      title: "Service Tests and Mocking",
      durationMinutes: 15,
      explanation: "A service contains reusable application logic. For example, an API route calls a product service, which talks to the database. Services can create, find, update, and delete data.\n\nA <b>mock</b> is a fake dependency used during a test. Replace a real database, Redis instance, or email provider so the test can focus on service logic. `vi.fn()` creates mock functions.\n\nMocks make unit-level service tests fast, but do not mock everything. Real integrations still need integration tests.",
      diagram: "                 Service Test\n                      │\n                      ▼\n                Product Service\n                      │\n             ┌────────┴────────┐\n             ▼                 ▼\n        Mock Database      Mock Email",
      codeExample: { title: "Test a service with a mock repository", code: `import { describe, expect, it, vi } from "vitest";

export function createUserService(userRepository: {
  create: (email: string) => Promise<unknown>;
}) {
  return {
    async createUser(email: string) {
      if (!email.includes("@")) throw new Error("Invalid email");
      return userRepository.create(email);
    },
  };
}

it("creates a user", async () => {
  const create = vi.fn().mockResolvedValue({
    id: "1",
    email: "user@example.com",
  });
  const service = createUserService({ create });

  await expect(service.createUser("user@example.com")).resolves.toEqual({
    id: "1",
    email: "user@example.com",
  });
  expect(create).toHaveBeenCalledWith("user@example.com");
});` },
      keyTakeaways: ["Services contain reusable application logic.", "Mocks provide fake dependencies.", "`vi.fn()` creates mock functions.", "Mocks keep service tests fast.", "Not everything should be mocked."],
      commonMistakes: ["Mocking everything.", "Never testing real integrations.", "Testing implementation details.", "Forgetting to verify dependency calls.", "Using real external services in every unit test."],
      quiz: [],
      rawMiniQuiz: "<b>What is a mock?</b>\nA fake dependency used during testing.\n\n<b>Why use mocks?</b>\nTo isolate the code being tested from external systems.",
    },
    {
      id: "nextjs-36-5",
      title: "API and Database Integration Testing",
      durationMinutes: 15,
      explanation: "Unit tests can prove individual functions work, but they cannot prove the whole application works together. An integration test can cover `POST /api/products` through validation, product service, PostgreSQL, and the final response.\n\nDatabase tests expose problems such as wrong columns, relationships, data types, constraints, and query errors. Always use a dedicated test database, never development or production data.\n\nTests must be isolated: each test creates its own data, asserts its result, and cleans up. Test both the HTTP response and the database result, including successful requests, invalid requests, missing fields, invalid prices, invalid stock, authentication, and authorization.",
      diagram: "              Integration Test\n                     │\n                     ▼\n                  API Route\n                     │\n                     ▼\n                 Validation\n                     │\n                     ▼\n                   Service\n                     │\n                     ▼\n                Test Database\n                     │\n                     ▼\n                  Response",
      codeExample: { title: "API integration test cases", code: `GET /api/products
POST /api/products
GET /api/products/123

// valid request
{
  "name": "Keyboard",
  "price": 5000,
  "stock": 20
}

// expected: 201 Created

// invalid request
{
  "name": "",
  "price": -10,
  "stock": -1
}

// expected: 400 Bad Request` },
      keyTakeaways: ["Integration tests check multiple components together.", "API tests verify real request and response behavior.", "Database tests verify actual database interaction.", "Use a dedicated test database.", "Tests should not depend on one another."],
      commonMistakes: ["Running tests against production.", "Sharing data between tests.", "Forgetting cleanup.", "Testing only successful requests.", "Ignoring authentication and authorization."],
      quiz: [],
      rawMiniQuiz: "<b>Where should automated database tests run?</b>\nA dedicated test database.\n\n<b>Why should tests be isolated?</b>\nSo one test does not depend on another test’s data or execution order.",
    },
    {
      id: "nextjs-36-6",
      title: "Building a Complete Testing Strategy",
      durationMinutes: 15,
      explanation: "Each test type answers a different question.\n\n1. <b>Unit test</b>\nDoes this small function work?\n\n2. <b>Service test</b>\nDoes this business logic work with controlled dependencies?\n\n3. <b>API test</b>\nDoes this endpoint behave correctly?\n\n4. <b>Database integration test</b>\nDoes the application actually work with PostgreSQL?\n\nA complete strategy combines these layers. Make testing part of normal development: write code, write a test, run it, fix the problem, run the full suite, then commit.",
      diagram: "                 Test Suite\n                     │\n       ┌─────────────┼─────────────┐\n       ▼             ▼             ▼\n     Unit         Service          API\n       │             │             │\n       │             │             ▼\n       │             │        Integration\n       └─────────────┼─────────────┘\n                     ▼\n               Test Database",
      codeExample: { title: "Test suite structure and scripts", code: `tests/
├── unit/
│   ├── validation.test.ts
│   └── utils.test.ts
├── services/
│   └── product-service.test.ts
└── integration/
    ├── products-api.test.ts
    └── products-db.test.ts

// package.json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:watch": "vitest --watch"
  }
}

npm run test:run` },
      keyTakeaways: ["Different tests solve different problems.", "Unit tests are fast and focused.", "Service tests verify business logic.", "API tests verify HTTP behavior.", "Database tests verify real integration.", "A good test suite gives confidence when changing code."],
      commonMistakes: ["Having only unit tests.", "Having only slow integration tests.", "Testing implementation details.", "Using production data.", "Ignoring error cases.", "Not running tests before committing."],
      quiz: [],
      rawMiniQuiz: "<b>Which tests are usually fastest?</b>\nUnit tests.\n\n<b>Why do we need database integration tests?</b>\nUnit tests cannot prove real queries, schemas, constraints, and relationships work correctly.",
    },
  ],
  finalQuiz: finalQuiz.map(([question, options, correctIndex, explanation]) => ({ question, options: [...options], correctIndex, explanation })),
  footer: "<b>Day 36 core lesson</b>\n\nUnit tests check individual pieces. Integration tests check that those pieces work together.",
  project: {
    name: "TestLab",
    goal: "Build a Next.js product catalog that demonstrates a complete Vitest testing strategy.",
    brief: "The goal is not a complicated UI. Build important behavior that is automatically tested through validation, services, APIs, and a dedicated database.\n\nTestLab architecture:\n\n                         TestLab\n                            │\n             ┌──────────────┼──────────────┐\n             ▼              ▼              ▼\n          Unit Tests    Service Tests   API Tests\n             │              │              │\n             │              │         Validation\n             │              ▼              │\n             │        Mock Dependencies    │\n             └──────────────┼──────────────┘\n                            ▼\n                     Test Database",
    steps: [
      "Create a product catalog, database model, validation functions, product service, and product API.",
      "Validate required product name, 2 to 100 characters; integer price greater than 0; and integer stock of 0 or more.",
      "Add `GET /api/products`, `POST /api/products`, and `GET /api/products/123`.",
      "Configure Vitest with scripts for local development and CI.",
      "Write unit tests for validation and utility functions, including valid, invalid, empty, minimum, maximum, below-boundary, and above-boundary values.",
      "Write service tests with mocks for valid creation, invalid input, existing and missing products, and database failure.",
      "Write API integration tests for successful and invalid requests, missing fields, invalid price and stock, empty lists, missing products, authentication, and authorization.",
      "Create a dedicated test database. Create test data, run application code, assert results, and clean up data after each test.",
    ],
    acceptance: [
      "Vitest is configured and the test suite runs with one command.",
      "Utility functions and validation have dedicated tests for valid, invalid, and boundary cases.",
      "Product service dependencies can be mocked and API routes have integration coverage.",
      "Successful and failed API requests, authentication, and authorization are tested.",
      "A dedicated test database is used. Production data is never used, tests are isolated, and they clean up after themselves.",
      "Tests can run in CI.",
    ],
    stretch: [
      "Add coverage reporting, test seeding, and transaction-based isolation.",
      "Test duplicate products, database constraints, concurrent requests, multiple users, and role authorization.",
      "Add GitHub Actions that fails the pipeline when tests fail.",
      "Mock an external email provider and test external API failure.",
    ],
  },
};
