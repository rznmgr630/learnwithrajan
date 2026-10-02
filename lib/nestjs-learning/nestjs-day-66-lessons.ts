import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_66_LESSONS: LessonDay = {
  day: 66,
  title: "E2E Testing: Supertest, Auth, and Database Teardown",
  totalMinutes: 120,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-66-lesson-1",
      title: "End-to-End Testing Fundamentals with Supertest",
      durationMinutes: 24,
      explanation: `<b>What Makes End-to-End (E2E) Testing Unique?</b>

While unit tests isolate individual functions and integration tests verify repository queries against a database, **End-to-End (E2E) Tests** test the entire application stack from the outside in. E2E tests interact with NestJS exactly as a real API client or web browser would: over HTTP.

\`\`\`text
┌────────────────────────────────────────────────────────┐
│                  Supertest HTTP Client                 │
│         POST /api/v1/orders { items: [...] }           │
└───────────────────────────┬────────────────────────────┘
                            │ Real HTTP Network Request
                            ▼
┌────────────────────────────────────────────────────────┐
│                Full NestJS Pipeline                    │
│                                                        │
│  [ ValidationPipe ] ──► [ AuthGuard ] ──► [ Controller ]│
│         │                                      │       │
│    Rejects 400                            Calls Svc    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│            PostgreSQL / Redis Infrastructure           │
└────────────────────────────────────────────────────────┘
\`\`\`

<b>The Role of Supertest in NestJS</b>

NestJS uses **Supertest** (\`supertest\`) as its standard HTTP assertion library. Supertest wraps the low-level Node.js HTTP server instance returned by \`app.getHttpServer()\`.

Instead of launching a standalone Web server process bound to an actual TCP port (which introduces port conflict errors in CI runners), Supertest executes simulated HTTP requests directly against the Express or Fastify HTTP listener in memory.

<b>Why E2E Tests Catch Pipeline Regressions</b>

E2E tests catch framework pipeline issues that unit tests miss completely:
1. <b>ValidationPipe Misconfigurations</b>: Missing \`transform: true\` or \`whitelist: true\` in \`main.ts\`.
2. <b>Guard Failures</b>: Unprotected route handler endpoints allowing unauthenticated access.
3. <b>Interceptor & Filter Mismatches</b>: Non-standardized error envelopes returned by unhandled exceptions.
4. <b>Dependency Injection Resolution Failures</b>: Missing provider imports in feature modules.`,
      diagram: `                  SUPERTEST HTTP EXECUTION
                               │
                supertest(app.getHttpServer())
                               │
                               ▼
                   ┌──────────────────────────┐
                   │  Global ValidationPipe   │
                   └────────────┬─────────────┘
                                │
                   ┌──────────────────────────┐
                   │    Auth Guards & Rules   │
                   └────────────┬─────────────┘
                                │
                   ┌──────────────────────────┐
                   │  Controllers & Services  │
                   └────────────┬─────────────┘
                                │
                   ┌──────────────────────────┐
                   │ Exception Filters & DB   │
                   └────────────┬─────────────┘
                                │
                     Assert HTTP Response Code`,
      codeExample: {
        title: "Code Example",
        code: `// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Application Bootstrap (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Mirror main.ts global pipeline configurations exactly!
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close(); // Clean up app instance and connection pools
  });

  it('GET /health - should return 200 OK and health status', async () => {
    const response = await request(app.getHttpServer())
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
  });

  it('POST /users - should return 400 Bad Request when payload is invalid', async () => {
    const invalidPayload = { email: 'not-an-email' };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(invalidPayload)
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });
});`,
      },
      keyTakeaways: [
        "E2E tests evaluate the full application HTTP pipeline, from ValidationPipes to DB persistence.",
        "Supertest executes simulated HTTP calls directly against \`app.getHttpServer()\` in memory.",
        "Always mirror \`main.ts\` global pipelines (Pipes, Filters, Interceptors) inside test setup.",
        "Gracefully close application instances using \`await app.close()\` in \`afterAll()\` hooks.",
      ],
      commonMistakes: [
        "<b>Forgetting to call app.init() or app.close().</b> Omitting \`app.init()\` can cause middleware to be skipped; omitting \`app.close()\` leaves open database connections that freeze Jest.",
        "<b>Omitting global ValidationPipes in E2E test setup.</b> Without attaching \`ValidationPipe\` inside test setup, malformed payload requests will erroneously pass tests.",
      ],
      quiz: [
        {
          question: "Why does Supertest execute HTTP calls against app.getHttpServer() rather than binding to a live TCP port?",
          options: [
            "Supertest cannot communicate over TCP sockets",
            "Simulating requests in memory avoids TCP port conflicts, accelerates test execution, and removes local network dependencies",
            "NestJS prohibits binding to live TCP ports during tests",
            "TCP sockets do not support JSON payloads"
          ],
          correctIndex: 1,
          explanation: "Executing calls directly against the HTTP server instance in memory avoids port allocation conflicts in CI/CD environments and speeds up test suite execution."
        }
      ]
    },
    {
      id: "day-66-lesson-2",
      title: "Authenticating E2E Tests: JWTs, Guards, and Roles",
      durationMinutes: 25,
      explanation: `<b>The Authentication Challenge in E2E Tests</b>

Most production REST API endpoints are protected behind **Authentication Guards** (\`JwtAuthGuard\`) and **Role-Based Access Controls** (\`RolesGuard\`).

If an E2E test attempts to call a protected route (\`POST /api/v1/orders\`) without valid authorization, the NestJS pipeline rejects it immediately with **HTTP 401 Unauthorized** or **HTTP 403 Forbidden**.

\`\`\`text
                 UNAUTHENTICATED E2E REQUEST
Supertest ──► POST /api/v1/orders (No Header) ──► JwtAuthGuard ──► 401 Unauthorized

                  AUTHENTICATED E2E REQUEST
Supertest ──► POST /api/v1/orders
              Header: Authorization: Bearer <valid_jwt>
                     │
                     ▼
             JwtAuthGuard (Valid Token)
                     │
                     ▼
             RolesGuard (User is CUSTOMER)
                     │
                     ▼
             Controller Executes -> Returns 201 Created
\`\`\`

<b>Strategies for E2E Test Authentication</b>

1. <b>Live Login Flow (Highest Confidence)</b>: Seed a test user, execute a real \`POST /auth/login\` request via Supertest, capture the signed JWT string from the response, and attach it to subsequent request headers.
2. <b>Direct Token Generation (Faster)</b>: Inject \`JwtService\` directly inside test setup, sign a valid JWT payload using test secrets, and skip repeated network login calls.
3. <b>Guard Overriding (Unit-Style E2E)</b>: Use \`app.overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })\`.
   - <i>Warning</i>: Guard overriding bypasses real authentication logic; use it sparingly.

<b>Attaching Bearer Tokens with Supertest</b>

Attach tokens to test requests using Supertest's \`.set('Authorization', \`Bearer \${token}\`)\` syntax.`,
      diagram: `                  E2E AUTHENTICATION FLOW
                               │
                     beforeAll Hook Execution
                               │
               Seed Test User in DB / Generate JWT
                               │
                               ▼
                    Execute Supertest Request
             .set('Authorization', \`Bearer \${jwt}\`)
                               │
                               ▼
                   ┌──────────────────────────┐
                   │      JwtAuthGuard        │
                   └────────────┬─────────────┘
                                │
                    Token Signature Verified
                                │
                                ▼
                     Controller Route Executes`,
      codeExample: {
        title: "Code Example",
        code: `// test/orders.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Orders System - Authentication & Roles (E2E)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let customerToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Generate signed JWT tokens directly for test identities
    customerToken = jwtService.sign({ sub: 'usr_cust_1', email: 'cust@example.com', role: 'CUSTOMER' });
    adminToken = jwtService.sign({ sub: 'usr_admin_1', email: 'admin@example.com', role: 'ADMIN' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /orders - should return 401 Unauthorized when no token is provided', async () => {
    await request(app.getHttpServer())
      .post('/orders')
      .send({ items: [{ productId: 'prod_1', quantity: 1 }] })
      .expect(401);
  });

  it('POST /orders - should create order when valid CUSTOMER token is supplied', async () => {
    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', \`Bearer \${customerToken}\`)
      .send({ items: [{ productId: 'prod_1', quantity: 2 }] })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toEqual('PENDING');
  });

  it('DELETE /orders/:id - should return 403 Forbidden for CUSTOMER but allow ADMIN', async () => {
    // 1. Customer attempt -> Forbidden
    await request(app.getHttpServer())
      .delete('/orders/ord_123')
      .set('Authorization', \`Bearer \${customerToken}\`)
      .expect(403);

    // 2. Admin attempt -> Allowed (200 OK)
    await request(app.getHttpServer())
      .delete('/orders/ord_123')
      .set('Authorization', \`Bearer \${adminToken}\`)
      .expect(200);
  });
});`,
      },
      keyTakeaways: [
        "E2E tests must supply valid Authorization headers (\`Bearer <token>\`) when calling protected endpoints.",
        "Generate JWT tokens dynamically in \`beforeAll()\` using \`JwtService\` or live login flows.",
        "Assert authorization boundaries: verify both 401 (unauthenticated), 403 (unauthorized role), and 200/201 (authorized).",
        "Override guards using \`app.overrideGuard()\` only when explicitly testing un-guarded controller logic.",
      ],
      commonMistakes: [
        "<b>Using hardcoded expired JWT strings in tests.</b> Hardcoded token strings expire over time, causing test suites to fail unexpectedly.",
        "<b>Overriding JwtAuthGuard globally for all E2E tests.</b> Bypassing guards globally prevents tests from verifying real security and role constraints.",
      ],
      quiz: [
        {
          question: "How should a Supertest request attach a JWT authorization token to pass protected JwtAuthGuard routes?",
          options: [
            "By setting a cookie named 'session_id'",
            "Using .set('Authorization', 'Bearer <token>') on the Supertest request builder",
            "By appending ?token=<jwt> to the URL query string",
            "By embedding the token inside the JSON request body"
          ],
          correctIndex: 1,
          explanation: "NestJS Passport strategies extract JWTs from the HTTP Authorization header using the \`Bearer <token>\` scheme."
        }
      ]
    },
    {
      id: "day-66-lesson-3",
      title: "Database Management & Fixture Seeding for E2E",
      durationMinutes: 25,
      explanation: `<b>Managing Test Data in E2E Testing</b>

Unlike unit tests where database repositories are mocked, E2E tests run against real database instances (such as a local PostgreSQL test database or Docker Testcontainer).

E2E tests require predictable test data (**Fixtures**) to test complex operations (e.g. purchasing a product requires a seeded product row in the database).

\`\`\`text
┌────────────────────────────────────────────────────────┐
│                   Fixture Seeder                       │
│                                                        │
│  Seed Product: { id: "prod_100", price: 50, stock: 10 }│
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Supertest Action                     │
│  POST /orders { productId: "prod_100", quantity: 2 }   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Database Assert                      │
│  Assert Product "prod_100" stock updated to 8          │
└────────────────────────────────────────────────────────┘
\`\`\`

<b>Building a Dedicated Seeder Utility</b>

Instead of scattering database insert calls across test files, build a centralized **DatabaseSeeder** utility:
1. <b>Determinism</b>: Uses fixed IDs (\`usr_test_1\`, \`prod_test_100\`) so assertions remain predictable.
2. <b>Cleanup Integration</b>: Provides purge methods to wipe seeded fixtures cleanly between test suites.
3. <b>Relationship Management</b>: Automatically handles foreign key references (e.g. linking test orders to test user IDs).`,
      diagram: `                  FIXTURE SEEDING LIFECYCLE
                               │
                        beforeAll / Spec Hook
                               │
               DatabaseSeeder.seedProductsAndUsers()
                               │
                               ▼
                   POST /orders (Supertest)
                               │
                               ▼
               Verifies Database State Mutations
                               │
                               ▼
                  DatabaseSeeder.purgeAllData()`,
      codeExample: {
        title: "Code Example",
        code: `// test/utils/database-seeder.ts
import { DataSource } from 'typeorm';
import { User, UserRole } from '../../src/users/entities/user.entity';
import { Product } from '../../src/products/entities/product.entity';

export class DatabaseSeeder {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Seeds standard test user and product entities into the test database.
   */
  async seedCatalogAndUsers() {
    const userRepo = this.dataSource.getRepository(User);
    const productRepo = this.dataSource.getRepository(Product);

    const testUser = userRepo.create({
      id: 'usr_test_customer',
      email: 'customer@test.com',
      password: 'HashedPassword123!',
      role: UserRole.CUSTOMER,
    });

    const testProduct = productRepo.create({
      id: 'prod_test_widget',
      title: 'Test Widget',
      price: 49.99,
      stock: 20,
    });

    await userRepo.save(testUser);
    await productRepo.save(testProduct);

    return { testUser, testProduct };
  }

  /**
   * Safely purges test data using CASCADE truncation.
   */
  async purgeAll() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('DatabaseSeeder purge restricted to test environments!');
    }
    await this.dataSource.query('TRUNCATE TABLE "orders", "products", "users" RESTART IDENTITY CASCADE;');
  }
}`,
      },
      keyTakeaways: [
        "E2E tests rely on seeded database fixtures to execute multi-step application workflows.",
        "Centralize fixture creation using dedicated Seeder classes with deterministic IDs.",
        "Purge database tables before or after test suite runs to prevent data leakage across test files.",
        "Verify state changes directly in the database using TypeORM repositories alongside HTTP assertions.",
      ],
      commonMistakes: [
        "<b>Relying on random dynamic IDs for fixture seeding without returning references.</b> Hardcoding randomized IDs in seeding logic without exposing references makes route assertions difficult.",
      ],
      quiz: [
        {
          question: "Why should database seeding logic be centralized inside dedicated Seeder utilities for E2E testing?",
          options: [
            "To prevent TypeORM from executing SQL queries",
            "To ensure deterministic test state, simplify relationship management, and maintain clean database teardowns",
            "Because NestJS controllers prohibit inline database inserts",
            "To automatically generate HTML reports"
          ],
          correctIndex: 1,
          explanation: "Centralizing seeding logic ensures predictable test data setups across test suites and simplifies database cleanup routines."
        }
      ]
    },
    {
      id: "day-66-lesson-4",
      title: "Teardown Strategies & Preventing Resource Leaks",
      durationMinutes: 24,
      explanation: `<b>The Hanging Jest Process Problem</b>

A frustrating issue in NestJS testing is the **Hanging Test Suite**, where Jest completes all test assertions but fails to exit the terminal process:

\`\`\`text
Jest has detected the following 2 open handles potentially keeping Jest from exiting:
  - TCPSERVERWRAP (Port 3000)
  - Connection (PostgreSQL Pool)
\`\`\`

This occurs because background connection pools (TypeORM PostgreSQL pools, ioredis clients, RabbitMQ channels, or BullMQ event loops) remain open in memory.

\`\`\`text
                  COMPLETE E2E TEARDOWN SEQUENCE
                               │
                      All Tests Completed
                               │
                               ▼
                   Execute afterAll() Hook
                               │
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
   app.close()         dataSource.destroy()    redis.quit()
 (Close NestJS App)    (Close DB Pool)       (Close Redis)
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                               ▼
                   Jest Process Exits (0ms)
\`\`\`

<b>Ensuring Complete Teardown in NestJS</b>

To guarantee clean process exits:
1. Call \`await app.close()\` inside \`afterAll()\`. This triggers NestJS lifecycle hooks (\`OnApplicationShutdown\`).
2. Destroy database connections explicitly using \`await dataSource.destroy()\`.
3. Close asynchronous clients (Redis, BullMQ, event channels) in \`afterAll()\` hooks.
4. Pass the \`--forceExit\` flag to Jest in CI configurations as a safety net.`,
      diagram: `                   E2E TEARDOWN PIPELINE
                               │
                        afterAll Hook
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
       app.close()     dataSource.destroy()   redis.quit()
            │                  │                  │
            └──────────────────┼──────────────────┘
                               │
                               ▼
                   Clean Zero-Leak Termination`,
      codeExample: {
        title: "Code Example",
        code: `// test/teardown-example.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import Redis from 'ioredis';
import { AppModule } from '../src/app.module';

describe('Clean Teardown Example (E2E)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let redisClient: Redis;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    redisClient = moduleFixture.get<Redis>('REDIS_CLIENT');
  });

  afterAll(async () => {
    // 1. Close NestJS Application Server
    if (app) {
      await app.close();
    }

    // 2. Destroy TypeORM Database Connection Pool
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }

    // 3. Gracefully Quit Redis TCP Sockets
    if (redisClient) {
      await redisClient.quit();
    }
  });

  it('should execute cleanly with zero resource leaks', async () => {
    expect(app).toBeDefined();
  });
});`,
      },
      keyTakeaways: [
        "Hanging Jest test suites are caused by un-closed database connection pools or socket connections.",
        "Always invoke \`await app.close()\`, \`dataSource.destroy()\`, and \`redis.quit()\` in \`afterAll()\` hooks.",
        "Verify clean process exits by running Jest without \`--forceExit\` locally to catch resource leaks early.",
      ],
      commonMistakes: [
        "<b>Forgetting to close custom Redis or RabbitMQ connections in E2E tests.</b> Closing \`app.close()\` might not automatically close standalone Redis clients if lifecycle hooks are missing.",
      ],
      quiz: [
        {
          question: "What causes Jest to hang and fail to exit the terminal process after running NestJS E2E tests?",
          options: [
            "Syntax errors in TypeScript code",
            "Unclosed background resource connection pools (PostgreSQL pools, Redis clients, TCP servers)",
            "Using supertest instead of Axios",
            "Setting process.env.NODE_ENV = 'test'"
          ],
          correctIndex: 1,
          explanation: "Jest keeps process runners open if underlying asynchronous resource handles (database connection pools, Redis sockets) remain active."
        }
      ]
    },
    {
      id: "day-66-lesson-5",
      title: "CI/CD Pipeline Integration & Test Isolation Verification",
      durationMinutes: 22,
      explanation: `<b>Automating E2E Testing in CI/CD Pipelines</b>

In modern DevOps practices, E2E tests serve as the ultimate quality gate before deploying code to production environments.

A robust **GitHub Actions** or **GitLab CI** pipeline executes the E2E test suite automatically on every Pull Request:

\`\`\`text
┌────────────────────────────────────────────────────────┐
│                   GitHub Actions CI                    │
│                                                        │
│  1. Spin up PostgreSQL 16 Service Container            │
│  2. Run TypeORM Migrations                             │
│  3. Execute 'npm run test:e2e'                         │
│  4. Generate Code Coverage & Test Reports              │
└────────────────────────────────────────────────────────┘
\`\`\`

<b>Enforcing Environment Parity in CI</b>

1. <b>Database Service Containers</b>: CI platforms provide service containers (e.g. \`services: postgres: image: postgres:16-alpine\`) so tests execute against real PostgreSQL instances rather than SQLite mocks.
2. <b>Environment Variable Injection</b>: Pass test-specific environment variables (\`NODE_ENV=test\`, \`JWT_SECRET=ci_secret_key\`) into CI pipeline runners.
3. <b>Zero State Leakage</b>: Enforce database table truncations between spec files to guarantee test isolation in CI runs.`,
      diagram: `                   CI/CD PIPELINE FLOW
                               │
                   Git Push / Pull Request Event
                               │
                               ▼
               Spin up CI Runner & Postgres Service
                               │
                               ▼
                   Run npm run test:e2e
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     [All Tests Pass]                      [Tests Fail]
    Approve Deployment                   Block Pull Request
                                         Notify Developers`,
      codeExample: {
        title: "Code Example",
        code: `# .github/workflows/e2e-tests.yml
name: NestJS E2E Test Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  e2e-testing:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run E2E Tests
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_PORT: 5432
          DB_USER: test_user
          DB_PASSWORD: test_password
          DB_NAME: test_db
          JWT_SECRET: ci_jwt_super_secret
        run: npm run test:e2e`,
      },
      keyTakeaways: [
        "Automate E2E testing in CI/CD pipelines (GitHub Actions) on every Pull Request.",
        "Use CI service containers to supply real PostgreSQL database instances during pipeline runs.",
        "Configure strict environment variable injection for test runners.",
        "Block deployments automatically if any E2E test case fails.",
      ],
      commonMistakes: [
        "<b>Hardcoding localhost ports that conflict with CI service container ports.</b> Ensure database ports configured in CI matches application test settings.",
      ],
      quiz: [
        {
          question: "Why should CI/CD pipelines use service containers (like postgres:16-alpine) rather than in-memory SQLite for E2E tests?",
          options: [
            "Service containers run faster than Node.js",
            "Service containers guarantee environment parity by running E2E tests against the exact PostgreSQL engine version used in production",
            "GitHub Actions prohibits SQLite",
            "Service containers eliminate the need for npm install"
          ],
          correctIndex: 1,
          explanation: "Service containers run the exact database vendor engine (e.g., PostgreSQL 16) used in production, preventing environment drift and false passes."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What makes End-to-End (E2E) tests distinct from Unit and Integration tests in NestJS?",
      options: [
        "E2E tests do not support TypeScript",
        "E2E tests evaluate the entire application stack from the outside in by executing simulated HTTP requests against the application server",
        "E2E tests cannot connect to PostgreSQL",
        "E2E tests only run inside web browsers"
      ],
      correctIndex: 1,
      explanation: "E2E tests interact with NestJS over HTTP using Supertest, testing the complete framework stack from pipes to database drivers."
    },
    {
      question: "How does Supertest execute HTTP calls against NestJS in E2E tests?",
      options: [
        "By launching a Selenium browser instance",
        "By making simulated HTTP calls directly against app.getHttpServer() in memory without binding to a physical TCP port",
        "By executing raw cURL binary commands",
        "By opening a WebSocket connection"
      ],
      correctIndex: 1,
      explanation: "Supertest executes simulated HTTP requests directly against \`app.getHttpServer()\` in memory, avoiding TCP port conflicts."
    },
    {
      question: "How should a Supertest request attach a JWT token to pass protected JwtAuthGuard routes?",
      options: [
        "Using .set('Authorization', 'Bearer <jwt_token>')",
        "By appending ?jwt=<token> to the URL",
        "Inside the JSON request body",
        "Using a custom cookie named auth_token"
      ],
      correctIndex: 0,
      explanation: "Passport JWT strategies extract Bearer tokens from the HTTP \`Authorization\` header."
    },
    {
      question: "Why should E2E test setup mirror main.ts by registering app.useGlobalPipes(new ValidationPipe())?",
      options: [
        "Supertest fails to boot without global pipes",
        "To ensure that request payload validation rules are enforced during E2E tests identically to production",
        "To compile TypeScript files to JavaScript",
        "To enable TypeORM entity syncing"
      ],
      correctIndex: 1,
      explanation: "Mirroring \`main.ts\` global pipes ensures that E2E tests validate request bodies and enforce validation errors identically to production."
    },
    {
      question: "What primary issue causes Jest test suites to hang after all E2E tests complete?",
      options: [
        "Syntax errors in test spec files",
        "Unclosed background resources such as database connection pools or Redis TCP sockets",
        "Using supertest instead of Axios",
        "Having more than 5 test files"
      ],
      correctIndex: 1,
      explanation: "Jest process runners remain open if underlying resource handles (database connection pools, Redis client sockets) are not destroyed."
    },
    {
      question: "How can test suites ensure clean resource teardowns in afterAll() hooks?",
      options: [
        "By calling await app.close(), dataSource.destroy(), and redis.quit()",
        "By restarting the operating system",
        "By calling process.exit(0) inside test cases",
        "By deleting node_modules"
      ],
      correctIndex: 0,
      explanation: "Invoking \`app.close()\`, \`dataSource.destroy()\`, and closing Redis handles cleans up open sockets and connection pools cleanly."
    },
    {
      question: "What is the role of GitHub Actions service containers during E2E test execution?",
      options: [
        "To compile TypeScript code",
        "To provision real, production-identical database engine instances (e.g. PostgreSQL 16) for CI test runners",
        "To send Slack notifications",
        "To host Swagger documentation"
      ],
      correctIndex: 1,
      explanation: "Service containers spin up real database instances (e.g. PostgreSQL 16) inside CI runners for testing under realistic conditions."
    }
  ],
  project: {
    name: "Complete E2E Testing & Teardown Architecture",
    goal: "Build, authenticate, and execute a comprehensive End-to-End (E2E) test suite in NestJS covering ValidationPipes, JWT authentication guards, database fixture seeding, and zero-leak resource teardowns.",
    brief: "Construct a complete E2E testing pipeline for an E-Commerce API in NestJS. Configure Supertest requests mirroring main.ts global validation pipes, implement authenticated JWT requests testing roles (CUSTOMER vs ADMIN), build a DatabaseSeeder utility for test fixture management, enforce clean database teardowns without hanging Jest handles, and create a GitHub Actions CI workflow configuration.",
    steps: [
      "Bootstrap an E2E test suite in test/app.e2e-spec.ts mirroring main.ts global ValidationPipes.",
      "Implement authenticated E2E tests using JwtService to generate dynamic JWT tokens for CUSTOMER and ADMIN roles.",
      "Assert route authorization boundaries: verify 401 Unauthorized, 403 Forbidden, and 200/201 Success status codes.",
      "Create a DatabaseSeeder utility to seed and purge test data using CASCADE truncations.",
      "Implement clean resource teardowns in afterAll() hooks (app.close(), dataSource.destroy(), redis.quit()) to prevent hanging handles.",
      "Create a .github/workflows/e2e-tests.yml pipeline configuration with a PostgreSQL 16 service container.",
      "Run the E2E test suite locally and assert 100% test pass rate with zero resource leaks."
    ],
    acceptance: [
      "Supertest HTTP requests evaluate the complete NestJS framework pipeline.",
      "Protected routes enforce JWT authentication and role authorization checks accurately.",
      "Database fixtures are seeded and purged successfully using CASCADE truncations.",
      "Test suite exits cleanly with zero hanging Jest handles.",
      "GitHub Actions workflow configuration is valid and ready for CI deployment."
    ],
    stretch: [
      "Integrate Docker Testcontainers to boot dynamic PostgreSQL containers during local E2E test execution.",
      "Enforce 90%+ E2E code coverage thresholds in CI pipeline gates."
    ]
  }
};