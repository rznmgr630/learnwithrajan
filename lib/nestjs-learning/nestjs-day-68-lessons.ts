import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_68_LESSONS: LessonDay = {
  day: 68,
  title: "Test Architecture: Fixtures, Factories, Contracts & Flakiness",
  totalMinutes: 120,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-68-lesson-1",
      title: "Test Fixtures & High-Maintainability Setup Patterns",
      durationMinutes: 24,
      explanation: `<b>Understanding Test Fixtures</b>

A <b>Test Fixture</b> represents the fixed, predictable environment state required for a test to execute reliably. It encompasses everything needed before assertions run:
- Database rows (seeded users, roles, products).
- Mock service return values and spy instances.
- Environment variable overrides.
- In-memory cache states or queue states.

\`\`\`text
┌────────────────────────────────────────────────────────┐
│                   Test Execution Pipeline              │
│                                                        │
│  1. Fixture Setup Phase  ──► Seeds fixed data          │
│  2. Action Phase         ──► Executes method under test│
│  3. Assertion Phase      ──► Verifies outputs         │
│  4. Teardown Phase       ──► Purges fixture state      │
└────────────────────────────────────────────────────────┘
\`\`\`

<b>The Danger of Shared & Dirty Fixtures</b>

A common anti-pattern in large test suites is reusing global, shared mutable fixtures across spec files. If Test A modifies a seeded user's email or account balance, Test B (which relies on the original user state) fails randomly.

High-maintainability test architecture enforces **Fixture Isolation**:
1. <b>Deterministic Seeding</b>: Fixtures assign predictable IDs (\`usr_test_100\`) or use generator factories.
2. <b>Immutability First</b>: Fixture utilities return fresh copies of data objects for each spec file.
3. <b>Scoped Setup Hooks</b>: Use \`beforeEach()\` to re-initialize fixture state cleanly rather than relying on global suite setups.`,
      diagram: `                  FIXTURE ISOLATION FLOW
                               │
                       beforeEach Hook
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
     [ Fresh Entity Seeds ]           [ Reset Mock Spies ]
    createTestUserFixture()          jest.clearAllMocks()
               │                               │
               └───────────────┬───────────────┘
                               │
                      Execute Test Spec
                               │
                       afterEach Cleanup`,
      codeExample: {
        title: "Code Example",
        code: `// test/fixtures/user.fixture.ts
import { User, UserRole } from '../../src/users/entities/user.entity';

export interface UserFixtureOptions {
  id?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * Creates an immutable, isolated User entity fixture with safe defaults.
 */
export const createUserFixture = (options: UserFixtureOptions = {}): User => {
  const user = new User();
  user.id = options.id || \`usr_\${Math.random().toString(36).substring(7)}\`;
  user.email = options.email || \`test_\${user.id}@example.com\`;
  user.passwordHash = '$2b$10$e8N8K/M5jE.GzP1.H3G4S.xK9K.mK9K.mK9K.mK9K'; // Pre-hashed 'Password123!'
  user.role = options.role || UserRole.CUSTOMER;
  user.isActive = options.isActive !== undefined ? options.isActive : true;
  user.createdAt = new Date('2026-01-01T00:00:00Z');
  return user;
};`,
      },
      keyTakeaways: [
        "Test Fixtures establish the fixed, repeatable environment state required for test execution.",
        "Avoid shared mutable fixtures across spec files to prevent cascading test failures.",
        "Construct fixture builders that return fresh entity instances with sensible default values.",
        "Isolate setup logic inside \`beforeEach()\` hooks to guarantee zero side effects across tests.",
      ],
      commonMistakes: [
        "<b>Modifying global fixture objects directly inside a test.</b> Mutating shared fixture objects in Test A causes downstream failures in Test B.",
        "<b>Hardcoding real-world dates inside dynamic assertions.</b> Always freeze system timers (\`jest.useFakeTimers()\`) when fixtures involve timestamp calculations.",
      ],
      quiz: [
        {
          question: "What is the main risk of sharing a single mutable test fixture object across multiple spec files?",
          options: [
            "TypeScript compilation will fail",
            "State mutations made by one test will leak into other tests, causing intermittent, cascading test failures",
            "Jest disables parallel execution",
            "PostgreSQL closes all open connection pools"
          ],
          correctIndex: 1,
          explanation: "Shared mutable fixtures create state leakage between tests, causing downstream tests to fail unpredictably depending on execution order."
        }
      ]
    },
    {
      id: "day-68-lesson-2",
      title: "Test Data Factories & The Builder Pattern",
      durationMinutes: 25,
      explanation: `<b>Eliminating Boilerplate with Test Factories</b>

As applications grow, manually instantiating entities with dozens of required fields inside every test file leads to brittle, unmaintainable test code. If an entity adds a new non-nullable database column (\`tenantId\`), hundreds of individual test files break simultaneously!

**Test Data Factories** solve this by centralizing test data generation using the **Builder Pattern**.

\`\`\`text
Without Factories (Brittle):
const user = new User();
user.id = '1';
user.email = 'a@b.com';
user.password = '123';
user.firstName = 'John';
user.lastName = 'Doe';
user.tenantId = 'tenant_1'; // Modifying this breaks 50 test files!

With Factory Builder (Maintainable):
const user = UserFactory.build({ role: UserRole.ADMIN });
\`\`\`

<b>Designing Type-Safe Data Factories</b>

A well-architected Test Factory:
1. <b>Provides Smart Defaults</b>: Generates realistic random data (using libraries like \`@faker-js/faker\`) for required fields.
2. <b>Allows Overrides</b>: Enables tests to override specific fields relevant to the test scenario (\`UserFactory.build({ isActive: false })\`).
3. <b>Supports Async Persistence</b>: Provides both in-memory object instantiation (\`build()\`) and direct database persistence (\`create()\`).`,
      diagram: `                   TEST FACTORY PIPELINE
                               │
            UserFactory.build({ role: 'ADMIN' })
                               │
                               ▼
            ┌────────────────────────────────────┐
            │ Applies Default Fields             │
            │  - Email: Faker generated          │
            │  - Password: Pre-hashed             │
            │  - Overrides: role = 'ADMIN'       │
            └──────────────────┬─────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
      .build()                              .create(dataSource)
  Returns Entity Instance                 Persists to Test DB`,
      codeExample: {
        title: "Code Example",
        code: `// test/factories/user.factory.ts
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User, UserRole } from '../../src/users/entities/user.entity';

export class UserFactory {
  /**
   * Generates an in-memory User entity instance with overrides.
   */
  static build(overrides: Partial<User> = {}): User {
    const user = new User();
    user.id = overrides.id || faker.string.uuid();
    user.email = overrides.email || faker.internet.email().toLowerCase();
    user.firstName = overrides.firstName || faker.person.firstName();
    user.lastName = overrides.lastName || faker.person.lastName();
    user.passwordHash = overrides.passwordHash || '$2b$10$e8N8K/M5jE.GzP1.H3G4S.xK9K.mK9K.mK9K';
    user.role = overrides.role || UserRole.CUSTOMER;
    user.isActive = overrides.isActive !== undefined ? overrides.isActive : true;
    user.createdAt = overrides.createdAt || new Date();
    return user;
  }

  /**
   * Generates and persists a User entity directly to the test database.
   */
  static async create(dataSource: DataSource, overrides: Partial<User> = {}): Promise<User> {
    const user = this.build(overrides);
    const repo = dataSource.getRepository(User);
    return await repo.save(user);
  }

  /**
   * Builds an array of N user instances for batch tests.
   */
  static buildMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, () => this.build(overrides));
  }
}`,
      },
      keyTakeaways: [
        "Test Factories centralize data generation, shielding test files from schema changes.",
        "Use libraries like \`@faker-js/faker\` to generate unique, realistic dummy data automatically.",
        "Expose both in-memory (\`build()\`) and database-persisted (\`create()\`) factory methods.",
        "Allow tests to override specific fields relevant to the test case while auto-filling required defaults.",
      ],
      commonMistakes: [
        "<b>Hardcoding identical static email addresses inside factory defaults.</b> Generating static duplicate emails causes unique constraint database errors during batch entity creation.",
      ],
      quiz: [
        {
          question: "What is the primary benefit of using Test Data Factories with the Builder Pattern over raw object instantiation in test files?",
          options: [
            "It speeds up Node.js V8 execution",
            "It centralizes default entity creation, protecting individual test files from breaking when entity schemas change",
            "It disables TypeORM query validation",
            "It automatically generates REST API endpoints"
          ],
          correctIndex: 1,
          explanation: "Factories centralize default field assignment so that adding a new required column to an entity requires updating only the factory, rather than every spec file."
        }
      ]
    },
    {
      id: "day-68-lesson-3",
      title: "Contract Testing with Pact for Microservices",
      durationMinutes: 24,
      explanation: `<b>The Microservice Integration Testing Problem</b>

In microservice architectures (e.g. an **Order Service** calling a **Payment Service** over HTTP/gRPC), testing microservice integration using full E2E environments is slow, brittle, and expensive.

If the Payment Service team changes a response payload field name (\`transaction_id\` -> \`transactionId\`), the Order Service will break silently in production unless caught by tests.

**Contract Testing** (using tools like **Pact**) solves this by verifying that service providers and consumers adhere to an agreed-upon API Contract specification without running full environment deployments.

\`\`\`text
┌────────────────────────────────────────────────────────┐
│              Consumer (Order Service)                  │
│  Defines expected request/response Contract (Pact File)│
└───────────────────────────┬────────────────────────────┘
                            │ Publishes Pact JSON Contract
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Pact Broker Hub                      │
└───────────────────────────┬────────────────────────────┘
                            │ Verifies Contract
                            ▼
┌────────────────────────────────────────────────────────┐
│              Provider (Payment Service)                │
│  Asserts real endpoint outputs match published Contract│
└────────────────────────────────────────────────────────┘
\`\`\`

<b>Consumer-Driven Contract Testing (CDCT) Workflow</b>

1. <b>Consumer Test</b>: The Order Service writes a Pact test defining the expected HTTP request (\`POST /payments\`) and expected response shape (\`201 Created { id: string, status: string }\`). Pact generates a **Pact JSON Contract File**.
2. <b>Pact Broker</b>: The contract file is published to a central Pact Broker.
3. <b>Provider Verification</b>: The Payment Service runs a provider verification test that replays contract requests against its actual API implementation, ensuring compliance before deployment.`,
      diagram: `                   CONTRACT TESTING PIPELINE
                               │
               Consumer Generates Pact Contract
                               │
                               ▼
                  Publish Contract to Pact Broker
                               │
                               ▼
               Provider Service Pulls Contract
                               │
            Replays Request against Provider API
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     [Schema Matches]                    [Schema Mismatched]
    Contract Verified                    Deploy Blocked in CI!`,
      codeExample: {
        title: "Code Example",
        code: `// test/contracts/payment-consumer.pact.spec.ts
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import * as path from 'path';

const { like, string, number } = MatchersV3;

const provider = new PactV3({
  consumer: 'OrderService',
  provider: 'PaymentService',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('Payment Service Contract (Consumer)', () => {
  it('should return 201 Created and payment confirmation payload', () => {
    // Define the contract expectation
    provider
      .given('Payment service is ready')
      .uponReceiving('a valid payment request')
      .withRequest({
        method: 'POST',
        path: '/payments/charge',
        headers: { 'Content-Type': 'application/json' },
        body: {
          orderId: 'ord_123',
          amount: 99.99,
        },
      })
      .willRespondWith({
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: {
          paymentId: string('pay_999'),
          status: like('SUCCESS'),
          chargedAmount: number(99.99),
        },
      });

    return provider.executeTest(async (mockServer) => {
      // Execute consumer client against Pact mock server
      const response = await fetch(\`\${mockServer.url}/payments/charge\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: 'ord_123', amount: 99.99 }),
      });

      const data = await response.json();
      expect(response.status).toBe(201);
      expect(data.paymentId).toBeDefined();
    });
  });
});`,
      },
      keyTakeaways: [
        "Contract testing verifies inter-service API compatibility without launching full microservice clusters.",
        "Consumer-Driven Contract Testing (CDCT) lets consumers define their payload expectations in Pact files.",
        "Providers verify compatibility by executing published Pact contracts against their real endpoints in CI.",
        "Pact catches breaking API payload changes before code is merged or deployed.",
      ],
      commonMistakes: [
        "<b>Confusing Contract Testing with Functional E2E Testing.</b> Contract tests verify payload structure and status codes, not deep provider business rules or database state mutations.",
      ],
      quiz: [
        {
          question: "What primary problem does Consumer-Driven Contract Testing (Pact) solve in a microservices architecture?",
          options: [
            "It speeds up Docker container builds",
            "It catches breaking API interface changes between microservices without needing full multi-service E2E environments",
            "It automatically generates TypeORM entity migrations",
            "It eliminates the need for JWT authentication"
          ],
          correctIndex: 1,
          explanation: "Contract testing verifies API request/response schema compatibility between services in isolation, preventing breaking changes from reaching production."
        }
      ]
    },
    {
      id: "day-68-lesson-4",
      title: "Diagnosing, Quarantining & Eliminating Flaky Tests",
      durationMinutes: 25,
      explanation: `<b>The Anatomy of a Flaky Test</b>

A **Flaky Test** is a test that intermittently passes or fails without any changes to the underlying source code. Flaky tests destroy developer confidence in CI pipelines, leading engineers to ignore failing test builds.

\`\`\`text
Run #1: PASS  ✓
Run #2: PASS  ✓
Run #3: FAIL  ✗ (Flaky Failure: No code changes made!)
Run #4: PASS  ✓
\`\`\`

<b>The 5 Root Causes of Test Flakiness</b>

1. <b>Shared State Leakage</b>: Tests sharing dirty database tables or global mutable objects.
2. <b>Asynchronous Timing & Race Conditions</b>: Using \`setTimeout()\` or failing to await promises.
3. <b>Un-Ordered Array / Set Assertions</b>: Expecting exact array index ordering from SQL queries without an explicit \`ORDER BY\` clause.
4. <b>Timezone & System Clock Dependencies</b>: Tests relying on \`new Date()\` calculations that break across UTC vs local timezones or leap years.
5. <b>Resource Contention in Parallel Execution</b>: Tests competing for shared local files or hardcoded database ports.

<b>Quarantining and Remediation Architecture</b>

When a test is identified as flaky in CI:
- **Quarantine**: Isolate the flaky test into a quarantine suite (\`test:quarantine\`) so it does not block main PR deployments.
- **Freeze Timers**: Use \`jest.useFakeTimers()\` to eliminate clock dependencies.
- **Enforce State Isolation**: Truncate tables or roll back transactions in \`beforeEach()\`.`,
      diagram: `                  FLAKY TEST ELIMINATION
                               │
               Flaky Test Identified in CI
                               │
                               ▼
                  Quarantine Test (.flaky.spec.ts)
                               │
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
    [Fix Timezones]    [Fix Order BY]     [Fix Shared State]
  jest.useFakeTimers() Add ORDER BY clause  beforeEach Truncate
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                               ▼
              Re-integrate Fixed Test into CI`,
      codeExample: {
        title: "Code Example",
        code: `// test/flaky-remediation.spec.ts

describe('Flaky Test Remediation Examples', () => {
  
  // ❌ FLAKY: Relies on system clock and un-ordered array
  it('FLAKY VERSION - fragile assertions', async () => {
    const now = new Date(); // Fails if run at 23:59:59!
    const users = await userRepository.find(); // Un-ordered!
    
    expect(users[0].name).toEqual('Alice'); // Fails if DB returns Bob first
  });

  // ✅ ROBUST: Frozen timers & explicit ordering / matchers
  it('ROBUST VERSION - deterministic assertions', async () => {
    // 1. Freeze system time deterministically
    jest.useFakeTimers({ advanceTimers: true });
    jest.setSystemTime(new Date('2026-10-02T12:00:00Z'));

    // 2. Query with explicit ORDER BY
    const users = await userRepository.find({
      order: { name: 'ASC' },
    });

    // 3. Assert set equality regardless of array position or use explicit index
    expect(users).toHaveLength(2);
    expect(users[0].name).toEqual('Alice');

    jest.useRealTimers();
  });
});`,
      },
      keyTakeaways: [
        "Flaky tests pass or fail unpredictably without code changes, destroying pipeline trust.",
        "Root causes include shared state, un-ordered queries, clock dependencies, and missing awaits.",
        "Freeze system clocks using \`jest.useFakeTimers()\` to eliminate date-dependent flakiness.",
        "Quarantine persistent flaky tests immediately while fixing the root cause.",
      ],
      commonMistakes: [
        "<b>Ignoring flaky tests or re-running CI builds until they randomly pass.</b> Retrying flaky builds hides real concurrency bugs and degrades team productivity.",
        "<b>Asserting SQL array order without specifying an explicit ORDER BY query.</b> Relational databases make zero guarantees about un-ordered SELECT result sequences.",
      ],
      quiz: [
        {
          question: "Why can executing 'repository.find()' without an explicit ORDER BY clause cause flaky test failures?",
          options: [
            "TypeORM throws an exception if ORDER BY is omitted",
            "Relational databases do not guarantee array row ordering for un-ordered SELECT queries, causing index assertions (users[0]) to fail randomly",
            "PostgreSQL disables cache memory for un-ordered queries",
            "Jest prohibits array length assertions"
          ],
          correctIndex: 1,
          explanation: "Without an explicit \`ORDER BY\` clause, SQL engines return rows in non-deterministic order, causing array position assertions (\`users[0]\`) to fail intermittently."
        }
      ]
    },
    {
      id: "day-68-lesson-5",
      title: "Test Architecture Metrics & Coverage Gates",
      durationMinutes: 22,
      explanation: `<b>Measuring Test Architecture Effectiveness</b>

To ensure a test suite remains effective over time, engineering teams track **Test Metrics** and enforce **Code Coverage Gates** in CI pipelines.

Key Metrics for Test Architecture:
- <b>Code Coverage (Line, Branch, Statement, Function)</b>: Percentage of source code executed during test runs.
- <b>Test Suite Execution Duration</b>: Total time required to run unit, integration, and E2E suites.
- <b>Flakiness Rate</b>: Percentage of CI build retries caused by non-deterministic failures.

\`\`\`text
┌────────────────────────────────────────────────────────┐
│                   Jest Coverage Gate                   │
│                                                        │
│  Statements : 88.5% (Min Threshold: 85%)  ──► PASS ✓   │
│  Branches   : 82.1% (Min Threshold: 80%)  ──► PASS ✓   │
│  Functions  : 90.0% (Min Threshold: 85%)  ──► PASS ✓   │
│  Lines      : 87.4% (Min Threshold: 85%)  ──► PASS ✓   │
└────────────────────────────────────────────────────────┘
\`\`\`

<b>Configuring Coverage Thresholds in Jest</b>

Jest allows configuring global coverage minimums inside \`jest.config.ts\`. If a Pull Request lowers coverage below configured thresholds, the CI build fails automatically.

<b>Branch Coverage vs Statement Coverage</b>

Statement coverage measures if a line of code executed. **Branch coverage** measures if every path of a conditional branch (\`if / else\`, \`switch\`, ternary) executed. Branch coverage is far more critical for catching edge-case bugs.`,
      diagram: `                   CI COVERAGE GATE PIPELINE
                               │
                     Execute npm run test:cov
                               │
                               ▼
               Jest Calculates Coverage Metrics
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   [Metrics >= Threshold]               [Metrics < Threshold]
      CI Pipeline PASS                     CI Pipeline FAIL
   (PR Allowed to Merge)                (PR Blocked in CI)`,
      codeExample: {
        title: "Code Example",
        code: `// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.ts', // Exclude module definitions
    '!**/main.ts', // Exclude entry bootstrap
    '!**/*.entity.ts', // Exclude ORM entity definitions
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',

  // Enforce mandatory coverage threshold gates for CI/CD
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};

export default config;`,
      },
      keyTakeaways: [
        "Enforce automated code coverage thresholds in \`jest.config.ts\` to maintain test quality.",
        "Focus on Branch Coverage to ensure all \`if / else\` conditional logic paths are tested.",
        "Exclude non-executable files (entities, module definitions, DTO interfaces) from coverage metrics.",
        "Balance coverage targets with execution speed; 100% coverage is rarely cost-effective.",
      ],
      commonMistakes: [
        "<b>Aiming blindly for 100% statement coverage.</b> Forcing 100% statement coverage leads to low-quality assertions testing trivial getter/setter boilerplate rather than critical domain logic.",
      ],
      quiz: [
        {
          question: "Why is Branch Coverage generally considered a more rigorous quality metric than Statement Coverage?",
          options: [
            "Branch coverage measures database execution speed",
            "Branch coverage verifies that both true and false paths of conditional logic (if/else) are tested, catching unhandled edge cases",
            "Statement coverage only applies to HTML files",
            "Branch coverage eliminates the need for unit tests"
          ],
          correctIndex: 1,
          explanation: "Branch coverage ensures that every branch of conditional statements (\`if/else\`, \`switch\`) has been evaluated, catching missing edge-case logic."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What is the primary function of a Test Data Factory in NestJS test architecture?",
      options: [
        "To compile TypeScript into JavaScript",
        "To centralize default entity generation using the Builder Pattern, protecting spec files from breaking when entity schemas change",
        "To automatically generate REST API endpoints",
        "To manage Redis connection pools"
      ],
      correctIndex: 1,
      explanation: "Test Data Factories centralize entity creation using the Builder Pattern, protecting individual test spec files from breaking when database schemas evolve."
    },
    {
      question: "What primary problem does Consumer-Driven Contract Testing (Pact) solve in a microservice ecosystem?",
      options: [
        "It speeds up Docker build times",
        "It verifies API interface compatibility between services without launching full, complex multi-service E2E environments",
        "It replaces JWT authentication",
        "It automatically generates PostgreSQL database indexes"
      ],
      correctIndex: 1,
      explanation: "Contract testing validates payload schema compatibility between services in isolation, catching breaking API changes early."
    },
    {
      question: "Which of the following is a leading cause of Flaky Tests in database integration suites?",
      options: [
        "Using TypeScript strict mode",
        "Shared state leakage between tests and asserting array element positions without an explicit ORDER BY clause",
        "Running tests on Node.js 20",
        "Using TypeORM"
      ],
      correctIndex: 1,
      explanation: "Shared mutable state and non-deterministic SQL array ordering without explicit \`ORDER BY\` queries cause intermittent flaky failures."
    },
    {
      question: "How can tests eliminate flakiness caused by system clock calculations (new Date())?",
      options: [
        "By setting NODE_ENV = 'production'",
        "By freezing the system clock using jest.useFakeTimers() and jest.setSystemTime()",
        "By disabling TypeScript types",
        "By restarting the test container"
      ],
      correctIndex: 1,
      explanation: "Freezing the system clock using \`jest.useFakeTimers()\` creates a deterministic time environment for testing."
    },
    {
      question: "What does Branch Coverage measure in a Jest code coverage report?",
      options: [
        "The number of Git branches created in the repository",
        "The percentage of executed conditional paths (if/else, switch branches) evaluated during test runs",
        "The speed of database queries",
        "The total count of test files"
      ],
      correctIndex: 1,
      explanation: "Branch coverage measures whether both \`true\` and \`false\` branches of conditional statements were executed."
    },
    {
      question: "What should an engineering team do immediately when a test is identified as flaky in a CI pipeline?",
      options: [
        "Re-run the CI build until it passes randomly",
        "Quarantine the flaky test into an isolated suite while investigating and fixing the root cause",
        "Delete the entire test suite",
        "Disable CI pipeline checks"
      ],
      correctIndex: 1,
      explanation: "Quarantining flaky tests keeps main deployment pipelines reliable while engineers fix root causes."
    },
    {
      question: "How do Test Data Factories allow tests to customize specific attributes while maintaining smart defaults?",
      options: [
        "By requiring all fields to be passed manually every time",
        "By accepting Partial<Entity> overrides and merging them with generated defaults (e.g. via @faker-js/faker)",
        "By reading process.env",
        "By disabling TypeScript type checks"
      ],
      correctIndex: 1,
      explanation: "Factories accept partial override objects, merging custom field values with smart defaults generated for required fields."
    }
  ],
  project: {
    name: "Enterprise Test Architecture & Contract Testing Engine",
    goal: "Build a comprehensive, enterprise-grade test architecture in NestJS featuring User and Order Test Factories using the Builder Pattern, Pact Consumer Contract tests, a Flaky-Resilient test suite, and Jest coverage gates.",
    brief: "Construct a production-ready test architecture for a NestJS e-commerce platform. Implement UserFactory and OrderFactory utilities with Faker integration supporting build() and create() patterns, write a Consumer-Driven Contract test with Pact for payment gateway interactions, eliminate flakiness in time/array tests using fake timers and explicit ordering, and configure global Jest coverage threshold gates.",
    steps: [
      "Create UserFactory and OrderFactory classes utilizing @faker-js/faker supporting build() and create() methods.",
      "Implement a Consumer Contract test file using PactV3 defining payment API request/response expectations.",
      "Write a test suite demonstrating flaky test remediation using jest.useFakeTimers() and explicit SQL ORDER BY queries.",
      "Set up jest.config.ts with strict coverageThreshold gates enforcing 80%+ branch coverage.",
      "Implement a DatabaseCleaner utility supporting TRUNCATE TABLE CASCADE operations for fixture resetting.",
      "Execute full test and coverage suites, verifying zero flakiness and 100% threshold gate compliance."
    ],
    acceptance: [
      "Test Data Factories build and persist entities cleanly with customizable field overrides.",
      "Pact contract tests generate valid Pact JSON contract files for provider verification.",
      "Flaky remediation tests execute deterministically across repeated test runs.",
      "Jest coverage gates enforce 80%+ branch coverage in CI execution."
    ],
    stretch: [
      "Set up a Pact Broker publisher script to push generated Pact contract files to a central hub in CI.",
      "Build a quarantine test runner script (npm run test:quarantine) for isolating unresolved flaky tests."
    ]
  }
};