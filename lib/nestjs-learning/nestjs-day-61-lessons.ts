import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_61_LESSONS: LessonDay = {
  day: 61,
  title: "Testing Fundamentals: Pyramid, Isolation & Architecture",
  totalMinutes: 120,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-61-lesson-1",
      title: "The Testing Pyramid & Strategy",
      durationMinutes: 24,
      explanation: `<b>Why Testing Strategy Matters</b>

In production NestJS applications, writing tests without a cohesive strategy leads to either flaky, slow test suites or brittle codebases that break silently during deployments. 

The <b>Testing Pyramid</b> provides a proven structural model for allocating testing effort across three primary levels:

\`\`\`text
                      ▲
                     / \
                    /   \
                   / E2E \       <-- High Confidence, Slow, High Cost
                  /-------\
                 / Integra- \    <-- Medium Speed, Medium Confidence
                /    tion    \
               /--------------\
              /  Unit Tests    \ <-- Fast, Isolated, Low Cost, High Volume
             /------------------\
\`\`\`

<b>1. Unit Tests (Base Layer)</b>
- <b>Focus</b>: Test individual functions, services, or domain logic in total isolation.
- <b>Dependencies</b>: All external dependencies (databases, Redis, third-party APIs) are strictly mocked or stubbed.
- <b>Execution Speed</b>: Extremely fast (milliseconds).
- <b>Volume</b>: Makes up 60–70% of the entire test suite.

<b>2. Integration Tests (Middle Layer)</b>
- <b>Focus</b>: Verify interaction between multiple components (e.g., Service + TypeORM Repository + PostgreSQL Database).
- <b>Dependencies</b>: Uses real lightweight infrastructure (e.g., Docker Testcontainers or dedicated PostgreSQL/Redis instances).
- <b>Execution Speed</b>: Moderate (seconds).
- <b>Volume</b>: Makes up 20–30% of the test suite.

<b>3. End-to-End (E2E) Tests (Top Layer)</b>
- <b>Focus</b>: Test complete user journeys through the HTTP layer using \`supertest\`.
- <b>Dependencies</b>: Runs against the full NestJS application instance, including validation pipes, exception filters, guards, and real database pipelines.
- <b>Execution Speed</b>: Slower (seconds to minutes).
- <b>Volume</b>: Makes up 10% of the test suite.`,
      diagram: `                    THE NESTJS TESTING PYRAMID
                               │
                       ┌───────────────┐
                       │   E2E Tests   │ (HTTP Layer, Full Pipeline)
                       ├───────────────┤
                       │ Integration   │ (Service + Real DB / Redis)
                       ├───────────────┤
                       │  Unit Tests   │ (Pure Logic + Mocks)
                       └───────────────┘`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/testing/test-pyramid-demo.spec.ts

/**
 * 1. UNIT TEST EXAMPLE
 * Tests business logic in pure isolation with zero I/O or DB overhead.
 */
describe('DiscountCalculator (Unit)', () => {
  it('should apply 20% discount for VIP customers', () => {
    const calculator = new DiscountCalculator();
    const finalPrice = calculator.calculate({ basePrice: 100, isVip: true });
    expect(finalPrice).toBe(80);
  });
});

/**
 * 2. INTEGRATION TEST EXAMPLE
 * Verifies interaction between Service and Real Database/Repository layer.
 */
describe('UsersRepository (Integration)', () => {
  it('should persist and query user entity from test database', async () => {
    const user = await userRepository.save({ email: 'test@example.com' });
    const found = await userRepository.findOneBy({ id: user.id });
    expect(found?.email).toBe('test@example.com');
  });
});`,
      },
      keyTakeaways: [
        "The Testing Pyramid balances execution speed, maintenance cost, and confidence level.",
        "Unit tests make up the largest portion of the test suite due to their execution speed and low cost.",
        "Integration tests verify boundaries between services, repositories, and external stores.",
        "E2E tests validate complete HTTP workflows, security guards, pipes, and exception filters.",
      ],
      commonMistakes: [
        "<b>Inverting the Testing Pyramid (Ice Cream Cone Anti-Pattern).</b> Relying almost entirely on slow E2E tests causes CI/CD builds to take 30+ minutes and leads to flaky test runs.",
        "<b>Mocking everything in Integration/E2E tests.</b> Over-mocking in integration tests defeats the purpose of testing real database constraints and ORM mappings.",
      ],
      quiz: [
        {
          question: "Which layer of the Testing Pyramid should represent the largest volume of tests in a NestJS project?",
          options: [
            "End-to-End (E2E) Tests",
            "Integration Tests",
            "Unit Tests",
            "Manual UI Tests"
          ],
          correctIndex: 2,
          explanation: "Unit tests are fast, cheap to maintain, and isolate domain logic, making them the largest foundation layer of the Testing Pyramid."
        }
      ]
    },
    {
      id: "day-61-lesson-2",
      title: "Unit Testing with NestJS Test.createTestingModule()",
      durationMinutes: 24,
      explanation: `<b>Unit Testing in NestJS</b>

NestJS provides native testing utilities through \`@nestjs/testing\`. The \`Test.createTestingModule()\` builder creates a lightweight, isolated NestJS Dependency Injection (DI) container for testing.

\`\`\`text
┌────────────────────────────────────────────────────────┐
│               Test.createTestingModule()               │
│                                                        │
│  Providers:                                            │
│  - UsersService (Under Test)                           │
│  - UsersRepository -> { provide: ..., useValue: mock } │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
               compile() & get(UsersService)
                            │
                            ▼
               Execute Unit Test Methods
\`\`\`

<b>Mocking Dependencies with useValue and Jest Mocks</b>

In a pure unit test, services should **never** connect to real databases or external APIs. Dependencies are supplied as mock objects using \`useValue\` and Jest mock functions (\`jest.fn()\`).

Key benefits of unit testing DI isolation:
- Tests run entirely in memory in sub-milliseconds.
- You can simulate rare database error conditions (e.g. connection timeouts, unique constraints) on demand using \`jest.spyOn()\` or mock return overrides.`,
      diagram: `                 UNIT TEST DI CONTAINER ISOLATION
                               │
               Test.createTestingModule({ ... })
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     [ Real Service ]                      [ Mock Provider ]
       UsersService                     { findOne: jest.fn() }
            │                                     │
            └──────────────────┬──────────────────┘
                               │
                     Injected into Test Context`,
      codeExample: {
        title: "Code Example",
        code: `// src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersService (Unit)', () => {
  let service: UsersService;
  let mockRepository: any;

  beforeEach(async () => {
    // Create mock repository object with Jest functions
    mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should return user when user exists', async () => {
    const userPayload = { id: 'usr_123', email: 'alice@example.com' };
    mockRepository.findOne.mockResolvedValue(userPayload);

    const result = await service.findById('usr_123');

    expect(result).toEqual(userPayload);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'usr_123' } });
  });

  it('should throw NotFoundException when user is missing', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.findById('non_existent')).rejects.toThrow(NotFoundException);
  });
});`,
      },
      keyTakeaways: [
        "Use \`Test.createTestingModule()\` to instantiate isolated NestJS DI containers for tests.",
        "Mock external dependencies (repositories, Redis, HTTP clients) using \`useValue\` and \`jest.fn()\`.",
        "Assert both successful return values and expected exception throws (e.g., \`NotFoundException\`).",
        "Verify that mock functions were called with expected arguments using \`toHaveBeenCalledWith()\`.",
      ],
      commonMistakes: [
        "<b>Forgetting to reset or clear mocks between tests.</b> Mock state leaks across tests if \`beforeEach()\` does not re-instantiate mocks or call \`jest.clearAllMocks()\`, leading to false positives or failures.",
        "<b>Importing full database ORM modules in unit tests.</b> Importing \`TypeOrmModule.forRoot()\` inside a unit test forces database connections, defeating unit test isolation.",
      ],
      quiz: [
        {
          question: "How should a TypeORM Repository dependency be mocked inside a NestJS unit test module?",
          options: [
            "By establishing a live connection to PostgreSQL",
            "By providing the repository token via getRepositoryToken(Entity) with a mock object using useValue",
            "By deleting the repository file from disk",
            "By running tests inside Docker containers"
          ],
          correctIndex: 1,
          explanation: "In NestJS, ORM repositories are registered under specific injection tokens; use \`getRepositoryToken(Entity)\` combined with \`useValue\` to inject a mock repository object."
        }
      ]
    },
    {
      id: "day-61-lesson-3",
      title: "Integration Testing & Database Boundary Verification",
      durationMinutes: 25,
      explanation: `<b>Testing Real Components Together</b>

While unit tests isolate individual functions, **Integration Tests** verify that multiple real application layers (Services, TypeORM Repositories, Database constraints, and Redis caches) work together correctly.

\`\`\`text
┌────────────────────────────────────────────────────────┐
│                   Integration Test                     │
│                                                        │
│  ┌──────────────────┐          ┌────────────────────┐  │
│  │   UsersService   │ ───────► │ Real TypeORM Repo  │  │
│  └──────────────────┘          └─────────┬──────────┘  │
└──────────────────────────────────────────┼─────────────┘
                                           │ Real SQL Query
                                           ▼
┌────────────────────────────────────────────────────────┐
│          PostgreSQL Test Database (Docker)             │
│    Enforces Real Unique Constraints, FKs & Triggers    │
└────────────────────────────────────────────────────────┘
\`\`\`

<b>Why Integration Tests are Essential</b>

Mock repositories cannot catch database schema errors:
- TypeORM entity field name mismatches.
- SQL unique constraint violations (e.g. duplicate email registration).
- Cascading delete foreign key errors.
- Database transaction rollback logic.

Integration tests execute real SQL queries against an isolated test database (using Docker Testcontainers or an isolated PostgreSQL test schema), confirming that application services interact seamlessly with the persistence layer.`,
      diagram: `                   INTEGRATION TEST PIPELINE
                               │
               Service Executes Transactional Method
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Real TypeORM Module │
                    └──────────┬──────────┘
                               │
                    Generates Actual SQL Query
                               │
                               ▼
                    ┌─────────────────────┐
                    │ PostgreSQL Test DB  │
                    └──────────┬──────────┘
                               │
               Validates Foreign Keys, Constraints & Indexes`,
      codeExample: {
        title: "Code Example",
        code: `// src/users/users.repository.integration-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';

describe('UsersService - Database Integration (Integration)', () => {
  let service: UsersService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.TEST_DB_HOST || 'localhost',
          port: parseInt(process.env.TEST_DB_PORT || '5433', 10),
          username: 'test_user',
          password: 'test_password',
          database: 'test_db',
          entities: [User],
          synchronize: true, // Auto-create schema for test database
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy(); // Clean connection teardown
    }
  });

  it('should enforce unique constraint on user email at database level', async () => {
    const user1 = { email: 'duplicate@example.com', name: 'User 1' };
    await service.create(user1);

    // Attempting to create duplicate user should trigger database unique constraint error
    await expect(service.create(user1)).rejects.toThrow();
  });
});`,
      },
      keyTakeaways: [
        "Integration tests verify boundaries between services, repositories, and databases.",
        "They catch ORM mapping issues, SQL constraint failures, and transaction rollbacks that unit test mocks miss.",
        "Use dedicated test databases (e.g. PostgreSQL in Docker or Testcontainers) for integration testing.",
        "Always destroy database connections in \`afterAll()\` hooks to prevent socket leaks.",
      ],
      commonMistakes: [
        "<b>Running integration tests against production or shared dev databases.</b> Tests modifying live databases cause data corruption and flakiness; always use isolated test databases.",
        "<b>Leaving test database mutations dirty across test cases.</b> Tests must clean up modified rows after execution to prevent state leakage.",
      ],
      quiz: [
        {
          question: "What class of bug can an Integration Test catch that a Unit Test with mocked repositories cannot?",
          options: [
            "Syntax errors inside HTML templates",
            "Database-level unique constraint violations and invalid TypeORM column mappings",
            "Missing npm packages in package.json",
            "CSS flexbox alignment issues"
          ],
          correctIndex: 1,
          explanation: "Unit test mocks bypass database drivers completely. Integration tests execute real queries against database instances, revealing constraint violations and schema bugs."
        }
      ]
    },
    {
      id: "day-61-lesson-4",
      title: "End-to-End (E2E) Testing with Supertest",
      durationMinutes: 24,
      explanation: `<b>Testing the Full NestJS HTTP Pipeline</b>

**End-to-End (E2E) Tests** test your application from the outside in by making simulated HTTP requests using **\`supertest\`**.

\`\`\`text
                 SUPERTEST E2E HTTP TEST
                            │
               POST /api/v1/auth/login { ... }
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│               Full NestJS Application                  │
│                                                        │
│  [ ValidationPipe ] -> [ JwtAuthGuard ] -> [ Controller]│
│           │                                      │     │
│           ▼                                      ▼     │
│   400 Bad Request                       200 OK + JWT   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
               Assert Response & JSON Payload
\`\`\`

<b>Why E2E Tests Are Critical</b>

Unit and integration tests bypass the NestJS framework pipeline. E2E tests verify that all framework components execute together:
1. <b>ValidationPipes</b>: Ensures malformed payloads trigger HTTP 400 validation responses.
2. <b>Guards & Strategies</b>: Verifies that unauthenticated calls return HTTP 401/403.
3. <b>Interceptors & Filters</b>: Ensures response objects follow standard error envelopes.

<b>Configuring E2E Test Pipelines</b>

To mirror production execution, E2E test bootstrap setups must attach global pipes, exception filters, and middleware identical to \`main.ts\`.`,
      diagram: `                   E2E EXECUTION PIPELINE
                               │
                supertest(app.getHttpServer())
                               │
                               ▼
                   ┌──────────────────────────┐
                   │  Global ValidationPipe   │
                   └────────────┬─────────────┘
                                │
                   ┌──────────────────────────┐
                   │     JwtAuthGuard         │
                   └────────────┬─────────────┘
                                │
                   ┌──────────────────────────┐
                   │   Controller & Service   │
                   └────────────┬─────────────┘
                                │
                   ┌──────────────────────────┐
                   │  Global ExceptionFilter  │
                   └────────────┬─────────────┘
                                │
                     Assert HTTP Response Code`,
      codeExample: {
        title: "Code Example",
        code: `// test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth System (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Replicate production pipeline configuration explicitly
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register - should create user and return 201 Created', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'e2e_user@example.com',
        password: 'StrongPassword123!',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toEqual('e2e_user@example.com');
  });

  it('POST /auth/register - should reject invalid email with 400 Bad Request', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'invalid-email-format',
        password: 'short',
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });
});`,
      },
      keyTakeaways: [
        "E2E tests make real HTTP requests against NestJS apps using \`supertest\`.",
        "They validate the full framework pipeline: Pipes, Guards, Interceptors, Filters, and Controllers.",
        "Replicate production pipeline configuration (e.g. \`ValidationPipe\`) inside E2E \`beforeAll()\` blocks.",
        "Always close the app (\`await app.close()\`) in \`afterAll()\` to prevent hanging process locks.",
      ],
      commonMistakes: [
        "<b>Forgetting global ValidationPipes in E2E setup.</b> Omitting global pipes allows invalid payload tests to pass when they would fail in production.",
        "<b>Not shutting down NestJS application server connections.</b> Leaving \`app.close()\` out causes Jest to hang at the end of the test run.",
      ],
      quiz: [
        {
          question: "What HTTP testing library is standard in NestJS E2E test suites for simulating requests against app.getHttpServer()?",
          options: [
            "Axios",
            "Supertest",
            "Fetch",
            "Curl"
          ],
          correctIndex: 1,
          explanation: "\`supertest\` is the standard library used in NestJS E2E testing to execute HTTP requests against the application server instance."
        }
      ]
    },
    {
      id: "day-61-lesson-5",
      title: "Test Isolation, Database Transactions & State Cleanup",
      durationMinutes: 27,
      explanation: `<b>The Test Isolation Imperative</b>

A foundational rule of software testing is **Test Isolation**: *Every test case must execute independently, regardless of execution order, and leave zero side effects behind.*

If Test A inserts a user with ID \`usr_100\` into the database and fails to delete it, Test B (which checks unique constraint creation) will fail randomly depending on execution order. This causes **Flaky Tests**.

\`\`\`text
                  FLAKY TEST SEQUENCE (BAD)
Test A (Creates User 'usr_100') ──► Leaves row in DB
                                          │
Test B (Checks unique email)   ◄──────────┘ (FAILS due to left-over state!)

               ISOLATED TRANSACTION ROLLBACK (GOOD)
Test A Starts Transaction ──► Inserts Row ──► ROLLBACK (DB Clean)
                                                    │
Test B Starts Transaction ──► Runs Clean ───► ROLLBACK (DB Clean)
\`\`\`

<b>Strategies for Database Test Isolation</b>

1. <b>Transaction Rollbacks (Fastest)</b>: Wrap every test case inside a database transaction. At the end of the test, execute a SQL \`ROLLBACK\` so no database mutations are committed to disk.
2. <b>Database Truncation / Cleanup (Robust)</b>: Truncate all tables between test suites using \`beforeEach()\` or \`afterEach()\` hooks.
3. <b>Isolated Schemas / Containerization</b>: Spin up fresh database schemas or containers per test suite.

<b>Jest Clean-up Hooks</b>

Utilize Jest hooks cleanly:
- \`beforeEach()\`: Reset mock states (\`jest.clearAllMocks()\`) and re-seed clean fixture data.
- \`afterEach()\`: Truncate modified database tables or roll back active transactions.
- \`afterAll()\`: Destroy ORM data sources, close Redis clients, and close NestJS app instances.`,
      diagram: `                   TEST ISOLATION PATTERNS
                               │
                    beforeEach() Executed
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
    [Clear Jest Mocks]               [Database Cleanup]
   jest.clearAllMocks()             Truncate DB Tables /
                                    Rollback Transaction
               │                               │
               └───────────────┬───────────────┘
                               │
                       Execute Test Case
                               │
                    afterEach() Cleanup Hook`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/testing/database-cleanup.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseCleanupService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Truncates all tables in the test database to guarantee clean state.
   */
  async truncateAllTables(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Database truncation is strictly restricted to test environments!');
    }

    const entities = this.dataSource.entityMetadatas;
    const tableNames = entities.map((entity) => \`"\${entity.tableName}"\`).join(', ');

    if (tableNames.length > 0) {
      await this.dataSource.query(\`TRUNCATE TABLE \${tableNames} CASCADE;\`);
    }
  }
}

// Integration Test Suite utilizing cleanup helper
describe('OrdersService with State Isolation (Integration)', () => {
  let cleanupService: DatabaseCleanupService;

  beforeEach(async () => {
    // Clear mocks and purge database tables before EVERY test run
    jest.clearAllMocks();
    await cleanupService.truncateAllTables();
  });

  it('Test 1 - operates on completely pristine database', async () => {
    // Execution step ...
  });

  it('Test 2 - operates on completely pristine database', async () => {
    // Execution step ...
  });
});`,
      },
      keyTakeaways: [
        "Test isolation guarantees that tests execute independently without state leakage.",
        "Use transaction rollbacks or table truncations to clean up database state between tests.",
        "Always clear Jest mocks using \`jest.clearAllMocks()\` or \`beforeEach()\` re-instantiation.",
        "Restrict database truncation helpers strictly to test environments (\`NODE_ENV === 'test'\`).",
      ],
      commonMistakes: [
        "<b>Relying on specific test execution order.</b> Tests that depend on previous tests creating data will fail when run individually or in parallel.",
        "<b>Running database truncation without environment guards.</b> Executing truncation helpers without checking \`NODE_ENV === 'test'\` risks wiping development or production databases.",
      ],
      quiz: [
        {
          question: "What is the primary benefit of enforcing Test Isolation across a test suite?",
          options: [
            "It increases TypeScript compilation speed",
            "It prevents test order dependency and state leakage, eliminating flaky tests",
            "It bypasses NestJS validation rules",
            "It automatically generates Swagger documentation"
          ],
          correctIndex: 1,
          explanation: "Test isolation guarantees that every test case runs independently from a clean state, eliminating flaky failures caused by residual data."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "Which layer of the Testing Pyramid should make up the majority of an application's test suite?",
      options: ["End-to-End Tests", "Unit Tests", "Integration Tests", "Manual Quality Assurance"],
      correctIndex: 1,
      explanation: "Unit tests are fast and cheap to maintain, forming the base foundation of the Testing Pyramid."
    },
    {
      question: "In a NestJS unit test, what method creates an isolated Dependency Injection container?",
      options: [
        "NestFactory.create()",
        "Test.createTestingModule()",
        "TypeOrmModule.forRoot()",
        "ExpressAdapter.create()"
      ],
      correctIndex: 1,
      explanation: "\`Test.createTestingModule()\` builds an isolated, lightweight NestJS DI container for testing."
    },
    {
      question: "Why are Integration Tests necessary in addition to Unit Tests?",
      options: [
        "Unit tests cannot test TypeScript interfaces",
        "Integration tests verify real database constraints, SQL query execution, and ORM entity mappings that unit test mocks skip",
        "Integration tests run faster than unit tests",
        "Unit tests do not support Jest assertions"
      ],
      correctIndex: 1,
      explanation: "Integration tests run against real database components, catching SQL schema, ORM mapping, and constraint errors."
    },
    {
      question: "Which library is used in NestJS E2E tests to execute HTTP requests against app.getHttpServer()?",
      options: ["Supertest", "Axios", "Fetch", "Request"],
      correctIndex: 0,
      explanation: "\`supertest\` is the standard library used to make HTTP assertions against NestJS application server instances."
    },
    {
      question: "What configuration step must be included in E2E test setup to ensure request body validation is tested accurately?",
      options: [
        "Disabling TypeORM synchronisation",
        "Attaching app.useGlobalPipes(new ValidationPipe()) inside beforeAll()",
        "Setting process.env.NODE_ENV = 'production'",
        "Deleting database tables"
      ],
      correctIndex: 1,
      explanation: "E2E setups must mirror \`main.ts\` by attaching global validation pipes so payload validation triggers properly during tests."
    },
    {
      question: "What is a Flaky Test?",
      options: [
        "A test that fails to compile due to syntax errors",
        "A test that intermittently passes or fails without code changes due to shared state or timing dependencies",
        "A test written in JavaScript instead of TypeScript",
        "A test with no assertions"
      ],
      correctIndex: 1,
      explanation: "Flaky tests fail or pass unpredictably, usually caused by left-over database state, un-cleared mocks, or timing issues."
    },
    {
      question: "How can test suites clean up database mutations rapidly between integration test cases?",
      options: [
        "By restarting the operating system",
        "By wrapping test cases in database transactions and executing a ROLLBACK, or truncating tables in beforeEach()",
        "By re-installing Node.js packages",
        "By ignoring failed tests"
      ],
      correctIndex: 1,
      explanation: "Rolling back transactions or truncating tables in \`beforeEach()\` cleans database state, preserving test isolation."
    }
  ],
  project: {
    name: "Production Test Suite & Isolation Architecture",
    goal: "Build, isolate, and execute a multi-tier test suite in NestJS incorporating Unit Tests with mocks, Integration Tests against a test database, and full-pipeline E2E HTTP tests.",
    brief: "Construct a comprehensive testing architecture for a NestJS User Management service. Implement unit tests for domain business logic using Test.createTestingModule() and mock repositories, build integration tests validating database unique constraints against a test database, create E2E HTTP tests using supertest, and enforce state isolation via database cleanup helpers.",
    steps: [
      "Set up Jest configuration for unit, integration, and E2E test suites in NestJS.",
      "Write unit tests for UsersService mocking TypeORM repository methods with jest.fn() and getRepositoryToken().",
      "Set up an isolated PostgreSQL test database connection for integration testing.",
      "Write integration tests verifying database-level unique email constraint enforcement.",
      "Implement E2E HTTP tests using supertest validating user registration routes, ValidationPipes, and error responses.",
      "Create a DatabaseCleanupService helper to truncate tables in beforeEach() hooks, maintaining state isolation.",
      "Run the entire test suite and verify 100% test pass rate with zero state leakage."
    ],
    acceptance: [
      "Unit tests run in total isolation without initiating database connections.",
      "Integration tests accurately catch real database constraint violations.",
      "E2E tests validate ValidationPipe behavior, returning 400 Bad Request on malformed payloads.",
      "All test cases execute independently with 100% isolation across test runs."
    ],
    stretch: [
      "Integrate Docker Testcontainers to spin up PostgreSQL containers dynamically during test initialization.",
      "Configure code coverage reporting with Jest enforcing 85%+ statement coverage thresholds."
    ]
  }
};