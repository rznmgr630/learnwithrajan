import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_70_LESSONS: LessonDay = {
  day: 70,
  title: "Complete Testing Capstone Project",
  totalMinutes: 120,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-70-lesson-1",
      title: "Testing Architecture & Full Pyramid Project Design",
      durationMinutes: 24,
      explanation: `<b>Designing a Production Testing Pipeline</b>

In enterprise NestJS development, testing cannot be an afterthought or a collection of isolated spec files. A production-grade codebase requires an end-to-end testing pipeline that moves systematically from fast, localized verification to system-wide verification:

\`\`\`text
┌─────────────────────────────────────────────────────────┐
│                     1. Unit Tests                       │
│    (Fast, Isolated Service/Controller Logic via Mocks)  │
└───────────────────────────┬─────────────────────────────┘
                            │ Passes
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  2. Integration Tests                   │
│   (Real PostgreSQL DB, Transactions, Testcontainers)    │
└───────────────────────────┬─────────────────────────────┘
                            │ Passes
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     3. E2E Tests                        │
│   (Full HTTP Stack: Supertest, Auth, ValidationPipes)   │
└───────────────────────────┬─────────────────────────────┘
                            │ Passes
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   4. Contract Tests                     │
│      (Pact Consumer/Provider Schema Verification)        │
└───────────────────────────┬─────────────────────────────┘
                            │ Passes
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     5. Load Tests                       │
│        (k6 High-Throughput Performance Gates)           │
└─────────────────────────────────────────────────────────┘
\`\`\`

<b>The Core Business Scenario for the Project</b>

To make this capstone realistic, we build a multi-tier testing suit for an **E-Commerce Order & Payment System**:
- <b>Orders API</b>: Handles order creation, price calculations, and stock deductions.
- <b>Payment Gateway Integration</b>: Communicates with an external Payment Provider via HTTP.
- <b>Performance Target</b>: Must handle 500+ concurrent order creation requests per second under peak load.

Each testing layer validates a distinct engineering boundary. If an engineer breaks price calculation logic, **Unit Tests** fail in under 500ms. If a database constraint is violated, **Integration Tests** fail. If an authorization guard or ValidationPipe breaks, **E2E Tests** flag it. If the payment gateway changes its payload format, **Contract Tests** block deployment. Finally, if a database lock bottleneck limits throughput, **Load Tests** fail the CI pipeline.`,
      diagram: `                FULL-SPECTRUM TESTING PIPELINE
                               │
               Developer Submits Pull Request
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     [ Unit Tests ]                       [ Integration ]
   Fast logic, 0ms I/O                 Real PostgreSQL DB
            │                                     │
            └──────────────────┬──────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
      [ E2E Tests ]                       [ Contract Tests ]
   Supertest HTTP Pipeline              Pact Schema Verification
            │                                     │
            └──────────────────┬──────────────────┘
                               │
                               ▼
                        [ Load Tests ]
                     k6 SLA Performance Gate`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/testing/capstone-test.config.ts

export interface CapstoneTestEnvironment {
  dbHost: string;
  dbPort: number;
  dbName: string;
  pactBrokerUrl: string;
  loadTestTargetRps: number;
}

export const CAPSTONE_TEST_CONFIG: CapstoneTestEnvironment = {
  dbHost: process.env.TEST_DB_HOST || 'localhost',
  dbPort: parseInt(process.env.TEST_DB_PORT || '5433', 10),
  dbName: 'capstone_testing_db',
  pactBrokerUrl: process.env.PACT_BROKER_URL || 'http://localhost:9292',
  loadTestTargetRps: 500, // SLA requirement for k6 load test gate
};`,
      },
      keyTakeaways: [
        "A complete testing pipeline validates code across five progressive stages: Unit, Integration, E2E, Contract, and Load.",
        "Unit tests provide instant feedback on business logic without hitting I/O or network connections.",
        "Integration and E2E tests verify database persistence, framework guards, and HTTP pipes.",
        "Contract tests prevent breaking changes across microservice boundaries, while Load tests enforce performance SLAs.",
      ],
      commonMistakes: [
        "<b>Mixing test concerns across stages.</b> Executing heavy database queries inside Unit tests or making third-party HTTP calls inside Integration tests creates slow, brittle test runs.",
        "<b>Skipping Load tests until production outages occur.</b> Performance bugs (like missing database indexes or race condition deadlocks) are rarely visible in low-traffic E2E tests.",
      ],
      quiz: [
        {
          question: "In what sequence should a production CI/CD pipeline execute testing stages to optimize feedback speed and resource usage?",
          options: [
            "Load Tests -> E2E Tests -> Unit Tests -> Integration Tests -> Contract Tests",
            "Unit Tests -> Integration Tests -> E2E Tests -> Contract Tests -> Load Tests",
            "Contract Tests -> Load Tests -> Unit Tests -> E2E Tests -> Integration Tests",
            "E2E Tests -> Unit Tests -> Load Tests -> Integration Tests -> Contract Tests"
          ],
          correctIndex: 1,
          explanation: "Pipelines should execute fastest and cheapest tests first (Unit -> Integration) before running heavier, longer stages (E2E -> Contract -> Load) to fail fast on simple bugs."
        }
      ]
    },
    {
      id: "day-70-lesson-2",
      title: "Stage 1 & 2: Unit Testing Logic and Integration Testing DB",
      durationMinutes: 24,
      explanation: `<b>Stage 1: Unit Testing Domain Logic</b>

In Stage 1, we isolate \`OrdersService\` and test core calculations (tax multipliers, stock verification, discount rules) using \`Test.createTestingModule()\` and mock repositories. Zero network or database handles are opened.

<b>Stage 2: Integration Testing Real Database Constraints</b>

In Stage 2, we execute against a real PostgreSQL test database (or containerized database via Testcontainers). We test:
1. <b>Foreign Key Constraints</b>: Ensuring orders cannot be linked to non-existent user IDs.
2. <b>Stock Deductions & Locking</b>: Verifying that TypeORM updates persist stock changes accurately using explicit transactions.
3. <b>Cleanup Isolation</b>: Rolling back transactions in \`afterEach()\` or executing \`TRUNCATE TABLE ... CASCADE\` to leave a clean database state.`,
      diagram: `                STAGE 1 & STAGE 2 VERIFICATION
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
    [ Stage 1: Unit Tests ]        [ Stage 2: Integration ]
    - Mocks Repository             - Real PostgreSQL DB
    - Verifies Discount Math       - Tests FK & Unique Keys
    - Runs in <10ms                - Transaction Rollback`,
      codeExample: {
        title: "Code Example",
        code: `// src/orders/tests/stage1-orders.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrdersService } from '../orders.service';
import { Order } from '../entities/order.entity';
import { BadRequestException } from '@nestjs/common';

describe('Stage 1: OrdersService Unit Tests', () => {
  let service: OrdersService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should calculate total price including 10% tax accurately', () => {
    const total = service.calculateTotal([{ price: 100, quantity: 2 }], 0.1);
    expect(total).toBe(220); // (200) + 10% tax = 220
  });

  it('should throw BadRequestException when ordering negative quantities', async () => {
    await expect(
      service.createOrder('usr_1', [{ productId: 'p1', quantity: -1 }]),
    ).rejects.toThrow(BadRequestException);
  });
});`,
      },
      keyTakeaways: [
        "Stage 1 Unit tests execute in memory in milliseconds, verifying domain calculations and exception rules.",
        "Stage 2 Integration tests run against a real PostgreSQL database, validating entity relationships and SQL constraints.",
        "Always clean database state between integration tests using transaction rollbacks or table truncations.",
      ],
      commonMistakes: [
        "<b>Using SQLite for Stage 2 PostgreSQL integration tests.</b> SQLite lacks PostgreSQL JSONB operators, ENUM types, and strict locking behavior, creating false confidence.",
      ],
      quiz: [
        {
          question: "What primary defect does a Stage 2 Integration test uncover that a Stage 1 Unit test misses?",
          options: [
            "Syntax errors in HTML templates",
            "Database foreign key constraint failures and invalid ORM column mapping definitions",
            "TypeScript compilation errors",
            "Missing npm dependencies"
          ],
          correctIndex: 1,
          explanation: "Unit tests mock the database layer. Integration tests run real SQL queries against actual database engines, uncovering schema mismatches and constraint violations."
        }
      ]
    },
    {
      id: "day-70-lesson-3",
      title: "Stage 3: Full-Stack E2E Testing with Supertest and Auth",
      durationMinutes: 24,
      explanation: `<b>Stage 3: Validating the Complete HTTP Stack</b>

In Stage 3, we test the application from the outside in using **Supertest**. This stage exercises the full NestJS framework request/response lifecycle:

\`\`\`text
Supertest Client
       │
       ▼
[ ValidationPipe ]  ──► Validates CreateOrderDto schema & strips unknown parameters
       │
       ▼
[ JwtAuthGuard ]    ──► Verifies Bearer JWT signature and extracts User context
       │
       ▼
[ RolesGuard ]      ──► Enforces Role-Based Access Control (@Roles('CUSTOMER'))
       │
       ▼
[ OrdersController ]──► Delegates payload to OrdersService
       │
       ▼
[ ExceptionFilter ] ──► Formats standard JSON error envelopes on failure
\`\`\`

<b>Key Scenarios Tested in Stage 3</b>

1. <b>Unauthenticated Access Prevention</b>: Calling \`POST /api/v1/orders\` without a Bearer token must return **HTTP 401 Unauthorized**.
2. <b>Validation Enforcement</b>: Sending malformed item IDs or negative prices must return **HTTP 400 Bad Request** with structured validation details.
3. <b>Successful Order Lifecycle</b>: Sending valid credentials and payloads returns **HTTP 201 Created** alongside the created order resource.`,
      diagram: `                  STAGE 3: E2E PIPELINE FLOW
                               │
               Supertest POST /api/v1/orders
               Header: Authorization: Bearer <jwt>
                               │
                               ▼
                   ┌──────────────────────────┐
                   │  Global ValidationPipe   │
                   └────────────┬─────────────┘
                                │
                   ┌──────────────────────────┐
                   │  JwtAuthGuard / Roles    │
                   └────────────┬─────────────┘
                                │
                   ┌──────────────────────────┐
                   │    OrdersController      │
                   └────────────┬─────────────┘
                                │
                     Assert HTTP 201 Created`,
      codeExample: {
        title: "Code Example",
        code: `// test/stage3-orders.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Stage 3: Orders System (E2E)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let customerToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    customerToken = jwtService.sign({ sub: 'usr_cust_100', email: 'cust@example.com', role: 'CUSTOMER' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/v1/orders - should enforce 401 Unauthorized when Bearer token is missing', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/orders')
      .send({ items: [{ productId: 'p1', quantity: 1 }] })
      .expect(401);
  });

  it('POST /api/v1/orders - should create order and return 201 Created for valid authenticated user', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set('Authorization', \`Bearer \${customerToken}\`)
      .send({ items: [{ productId: 'prod_widget_1', quantity: 2 }] })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toEqual('PENDING');
  });
});`,
      },
      keyTakeaways: [
        "Stage 3 E2E tests evaluate the entire application lifecycle over HTTP using Supertest.",
        "Mirror production \`main.ts\` setup (ValidationPipes, ExceptionFilters) inside the test bootstrap.",
        "Verify authentication (401), role permissions (403), payload validation (400), and success paths (201).",
      ],
      commonMistakes: [
        "<b>Bypassing ValidationPipes in E2E setup.</b> Forgetting to call \`app.useGlobalPipes(new ValidationPipe())\` inside test setup allows invalid request bodies to bypass validation silently.",
      ],
      quiz: [
        {
          question: "Why must Stage 3 E2E test setup mirror main.ts global pipeline configurations (such as ValidationPipe)?",
          options: [
            "Supertest crashes if ValidationPipe is missing",
            "To ensure that request payload validation, parameter transformation, and whitelist rules behave identically to production",
            "To enable TypeORM entity synchronization",
            "To format raw SQL queries"
          ],
          correctIndex: 1,
          explanation: "If global pipes are omitted from E2E test bootstrap scripts, invalid payloads will reach controllers without being rejected, creating false passes."
        }
      ]
    },
    {
      id: "day-70-lesson-4",
      title: "Stage 4: Consumer-Driven Contract Testing with Pact",
      durationMinutes: 24,
      explanation: `<b>Stage 4: Microservice Boundary Contract Verification</b>

In our Order System, when an order is created, the \`OrdersService\` makes an outbound HTTP call to an external **Payment Gateway Microservice** (\`POST /payments/charge\`).

If the Payment Gateway team renames a response property (\`transaction_id\` -> \`transactionId\`), standard unit and E2E tests using mock servers will miss the breaking change.

**Contract Testing** (using **Pact**) prevents microservice integration breakdowns:

\`\`\`text
┌─────────────────────────────────────────────────────────┐
│               Consumer (Orders Service)                 │
│   Executes Pact Test defining required Request/Response │
└───────────────────────────┬─────────────────────────────┘
                            │ Generates Pact JSON File
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Pact Contract File                     │
│   "Expect POST /payments/charge -> 201 { status: 'OK' }"│
└───────────────────────────┬─────────────────────────────┘
                            │ Verified in CI
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Provider (Payment Microservice)            │
│   Replays Contract Request against Real Implementation  │
└─────────────────────────────────────────────────────────┘
\`\`\`

<b>Writing the Consumer Contract Test</b>

The Order Service defines a Pact expectation stating exact request parameters and matching payload response schema requirements. Pact outputs a contract file (\`.json\`) that the Payment Microservice must verify before deployment.`,
      diagram: `                  STAGE 4: CONTRACT TESTING FLOW
                               │
               Order Service Defines Pact Expectations
                               │
                               ▼
               Generates pacts/orderservice-paymentservice.json
                               │
                               ▼
               Payment Service Pulls Contract in CI Pipeline
                               │
               Replays Request against Provider Controller
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     [Schema Compatible]                  [Schema Mismatch]
     Deployment Approved                  Deployment Blocked!`,
      codeExample: {
        title: "Code Example",
        code: `// test/contracts/stage4-payment.pact.spec.ts
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import * as path from 'path';

const { string, number, like } = MatchersV3;

const provider = new PactV3({
  consumer: 'OrdersService',
  provider: 'PaymentService',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('Stage 4: Payment Service Contract (Consumer)', () => {
  it('should adhere to the agreed payment charging API contract', () => {
    provider
      .given('Payment service is available and account has sufficient funds')
      .uponReceiving('a request to charge an order payment')
      .withRequest({
        method: 'POST',
        path: '/payments/charge',
        headers: { 'Content-Type': 'application/json' },
        body: {
          orderId: 'ord_100',
          amount: 150.00,
          currency: 'USD',
        },
      })
      .willRespondWith({
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: {
          transactionId: string('tx_pact_12345'),
          status: like('SUCCESS'),
          chargedAmount: number(150.00),
        },
      });

    return provider.executeTest(async (mockServer) => {
      // Test outbound client against local Pact mock server
      const response = await fetch(\`\${mockServer.url}/payments/charge\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: 'ord_100', amount: 150.00, currency: 'USD' }),
      });

      const data = await response.json();
      expect(response.status).toBe(201);
      expect(data.transactionId).toBeDefined();
    });
  });
});`,
      },
      keyTakeaways: [
        "Stage 4 Contract testing verifies inter-service payload schemas without deploying full microservice environments.",
        "Pact tests generate contract JSON files defining exact request and response expectations.",
        "Providers verify published contracts in their CI pipelines to catch breaking API changes before production deployment.",
      ],
      commonMistakes: [
        "<b>Using Contract tests to test deep business logic.</b> Contract tests should focus strictly on API payload schema compatibility and status codes, not complex internal domain rules.",
      ],
      quiz: [
        {
          question: "What failure scenario does Consumer-Driven Contract Testing (Pact) prevent in microservice architectures?",
          options: [
            "PostgreSQL index corruption",
            "Silent production API breakdowns caused by a provider service changing payload property names or field types",
            "Slow TypeScript compilation",
            "Docker image download timeouts"
          ],
          correctIndex: 1,
          explanation: "Contract testing verifies that API provider response schemas remain strictly compatible with consumer expectations, catching breaking schema changes before deployment."
        }
      ]
    },
    {
      id: "day-70-lesson-5",
      title: "Stage 5: High-Throughput Load Testing with k6 and Verification",
      durationMinutes: 24,
      explanation: `<b>Stage 5: Performance & Concurrency SLA Verification</b>

The final stage of our testing project is **Load Testing** using **k6**. While functional tests confirm that code works for a single user, Stage 5 verifies system stability and throughput under heavy concurrent traffic.

<b>Load Testing SLA Goals</b>

Our capstone project specifies strict performance SLA targets:
- **Throughput**: Process **500 requests per second (RPS)** during peak load.
- **Latency**: 95% of requests ($p(95)$) must complete in **under 200ms**.
- **Error Rate**: Less than **0.1%** failed HTTP responses.

\`\`\`text
                      k6 LOAD GENERATOR PIPELINE
                               │
             Ramp-up to 100 Virtual Users (VUs)
                               │
               POST /api/v1/orders (Continuous Load)
                               │
                               ▼
┌─────────────────────────────────────────────────────────┐
│                 NestJS Application Engine               │
│      Evaluates DB Locks, Connection Pools & RAM        │
└───────────────────────────┬─────────────────────────────┘
                            │ Metrics Aggregated
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   k6 SLA Gate Assertions                │
│  - http_req_duration p(95) < 200ms  ──► PASS ✓          │
│  - http_req_failed rate < 0.001     ──► PASS ✓          │
└─────────────────────────────────────────────────────────┘
\`\`\`

<b>Executing the k6 Load Script</b>

The k6 script simulates virtual users (VUs) making order creation requests concurrently, measuring latency distribution and failure rates against configured threshold gates.`,
      diagram: `                  STAGE 5: k6 SLA VERIFICATION
                               │
               k6 Load Test Ramp-Up (100 VUs)
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
      Measure Latency p(95)           Track Failure Rate
         Threshold < 200ms             Threshold < 0.1%
               │                               │
               └───────────────┬───────────────┘
                               │
                   Evaluate SLA Gate Thresholds
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
      [SLA Compliant]                      [SLA Violated]
     CI Pipeline PASS                     CI Pipeline FAIL`,
      codeExample: {
        title: "Code Example",
        code: `// test/load/stage5-orders.load.js
import http from 'k6/http';
import { check, sleep } from 'k6';

// Define k6 load test configuration & threshold performance gates
export const options = {
  stages: [
    { duration: '10s', target: 50 },  // Ramp up to 50 virtual users
    { duration: '30s', target: 100 }, // Sustained peak load: 100 virtual users
    { duration: '10s', target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests must complete under 200ms
    http_req_failed: ['rate<0.001'],  // Error rate must be under 0.1%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';
const JWT_TOKEN = __ENV.TEST_JWT || 'bearer_token_placeholder';

export default function () {
  const payload = JSON.stringify({
    items: [{ productId: 'prod_widget_1', quantity: 1 }],
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${JWT_TOKEN}\`,
    },
  };

  const response = http.post(\`\${BASE_URL}/api/v1/orders\`, payload, params);

  // Assert HTTP status response
  check(response, {
    'status is 201 Created': (r) => r.status === 201,
    'order ID present': (r) => JSON.parse(r.body).id !== undefined,
  });

  sleep(0.1); // Short pause between iterations
}`,
      },
      keyTakeaways: [
        "Stage 5 Load testing validates throughput, response latency, and error rates under heavy concurrency.",
        "k6 scripts define explicit threshold gates (e.g. \`p(95) < 200ms\`) that fail CI pipelines if SLAs are violated.",
        "Load testing uncovers bottlenecks that functional tests miss, such as connection pool exhaustion or database lock contention.",
        "Run load tests against realistic staging or isolated container environments.",
      ],
      commonMistakes: [
        "<b>Running load tests against production databases without isolation.</b> Load testing writes high volumes of dummy data and can exhaust live database resources.",
      ],
      quiz: [
        {
          question: "What metric does a p(95) < 200ms threshold mandate in a k6 load test configuration?",
          options: [
            "100% of requests must complete in exactly 200 milliseconds",
            "At least 95% of all HTTP requests must complete in less than 200 milliseconds",
            "The test must run for 95 minutes",
            "Only 5% of requests are allowed to succeed"
          ],
          correctIndex: 1,
          explanation: "A $p(95) < 200\text{ms}$ threshold specifies that 95% of all measured request response times must be faster than 200 milliseconds."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "In what logical sequence should our capstone testing stages be executed in a CI/CD pipeline?",
      options: [
        "Load -> E2E -> Unit -> Integration -> Contract",
        "Unit -> Integration -> E2E -> Contract -> Load",
        "E2E -> Contract -> Load -> Unit -> Integration",
        "Contract -> Unit -> Load -> Integration -> E2E"
      ],
      correctIndex: 1,
      explanation: "Testing pipelines move from fastest and cheapest (Unit) to broader validation (Integration, E2E, Contract) and finish with performance gates (Load)."
    },
    {
      question: "Which component in Stage 3 E2E testing simulates incoming HTTP requests against NestJS in memory?",
      options: ["TypeORM", "Supertest", "Pact", "k6"],
      correctIndex: 1,
      explanation: "Supertest executes simulated HTTP requests directly against \`app.getHttpServer()\` in memory."
    },
    {
      question: "Why are Stage 2 Integration tests executed against real PostgreSQL instances rather than SQLite in-memory databases?",
      options: [
        "SQLite does not support JavaScript",
        "SQLite lacks PostgreSQL-specific features like JSONB, ENUMs, and strict row locking, producing false test passes",
        "TypeORM prohibits SQLite connections",
        "PostgreSQL is faster than memory"
      ],
      correctIndex: 1,
      explanation: "SQLite lacks native PostgreSQL column types and query features, creating false confidence."
    },
    {
      question: "What artifact does a Stage 4 Pact Consumer test generate for provider verification?",
      options: [
        "A Docker container image",
        "A JSON contract specification file defining request/response expectations",
        "A SQL database dump file",
        "A PDF test summary report"
      ],
      correctIndex: 1,
      explanation: "Pact consumer tests output a JSON contract specification file defining required API interactions."
    },
    {
      question: "What performance failure does a Stage 5 k6 Load test catch that functional E2E tests miss?",
      options: [
        "TypeScript syntax errors",
        "Database connection pool exhaustion and lock contention under high concurrent traffic",
        "Missing npm packages",
        "Invalid HTML tags"
      ],
      correctIndex: 1,
      explanation: "Load tests execute concurrent traffic streams, highlighting bottlenecks like connection pool limits or lock contention."
    },
    {
      question: "How should Stage 3 E2E tests attach JWT tokens when testing protected endpoint routes?",
      options: [
        "By setting .set('Authorization', 'Bearer <jwt_token>') on Supertest requests",
        "By appending ?token=<jwt> to the URL query string",
        "Inside the JSON request body",
        "Using a custom cookie named auth_token"
      ],
      correctIndex: 0,
      explanation: "Passport JWT strategies extract Bearer tokens from the HTTP Authorization header."
    },
    {
      question: "What is the role of threshold gates in k6 load testing scripts?",
      options: [
        "To format JSON logs",
        "To define pass/fail performance criteria (e.g. latency, error rate) that fail the CI pipeline if violated",
        "To encrypt HTTP request bodies",
        "To clear PostgreSQL tables"
      ],
      correctIndex: 1,
      explanation: "Thresholds define pass/fail SLAs that evaluate performance metrics and fail the pipeline if targets are not met."
    }
  ],
  project: {
    name: "Full-Spectrum Capstone Testing Engine",
    goal: "Build, execute, and verify a complete 5-stage testing suite for a NestJS E-Commerce system incorporating Unit, Integration, E2E, Contract, and Load testing stages.",
    brief: "Construct a production-grade testing pipeline for a NestJS Orders & Payment application. Implement Stage 1 Unit tests for price calculations, Stage 2 Integration tests for TypeORM PostgreSQL constraints, Stage 3 Supertest E2E tests for authenticated routes, Stage 4 Pact Contract tests for outbound Payment Service integration, and Stage 5 k6 Load scripts enforcing latency and RPS SLA gates.",
    steps: [
      "Implement Stage 1 Unit tests in src/orders/tests/unit.spec.ts mocking TypeORM repositories.",
      "Implement Stage 2 Integration tests in src/orders/tests/integration.spec.ts running against a real PostgreSQL instance.",
      "Implement Stage 3 E2E tests in test/e2e.spec.ts using Supertest, ValidationPipes, and Bearer JWT authorization headers.",
      "Implement Stage 4 Consumer Contract tests in test/pact.spec.ts defining expected Payment Service schemas.",
      "Implement Stage 5 k6 Load test script in test/load.js specifying p(95) < 200ms threshold gates.",
      "Configure a master CI pipeline script (npm run test:all) that executes all five stages sequentially."
    ],
    acceptance: [
      "Stage 1 Unit tests execute in under 1 second.",
      "Stage 2 Integration tests validate real PostgreSQL foreign key constraints and clean up database state.",
      "Stage 3 E2E tests evaluate HTTP routes, returning 401 for unauthenticated calls and 201 for valid orders.",
      "Stage 4 Contract tests output valid Pact JSON contract files.",
      "Stage 5 k6 load script passes latency thresholds under concurrent traffic."
    ],
    stretch: [
      "Configure Testcontainers to boot dynamic PostgreSQL containers during Stage 2 and Stage 3 test runs.",
      "Publish generated Stage 4 Pact contract files to a Pact Broker instance automatically."
    ]
  }
};