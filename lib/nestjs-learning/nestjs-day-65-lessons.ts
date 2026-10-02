import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_65_LESSONS: LessonDay = {
  day: 65,
  title: "Integration Testing: Database Strategy, Transactions & Cleanup",
  totalMinutes: 120,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-65-lesson-1",
      title: "Real Database vs Test Database vs In-Memory Stubs",
      durationMinutes: 24,
      explanation: `<b>The Database Integration Strategy Spectrum</b>

When testing data persistence in NestJS applications, developers choose between three database testing approaches:

\`\`\`text
┌────────────────────────────────────────────────────────┐
│               1. In-Memory SQLite / H2                 │
│   Fast, but lacks PostgreSQL/MySQL native features     │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             2. Dedicated Test Database                 │
│   Real Postgres instance running locally or in CI      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│          3. Containerized Testcontainers               │
│   Ephemeral Docker containers managed programmatically │
└────────────────────────────────────────────────────────┘
\`\`\`

<b>1. In-Memory SQLite / H2 Stubs (The False Security Trap)</b>
In-memory drivers (like SQLite) run quickly without external dependencies, but they create **false positives** because SQLite does not mirror PostgreSQL's strict features:
- SQLite lacks native PostgreSQL \`ENUM\` types, \`JSONB\` operators, and array columns.
- Foreign key constraints behave differently or are disabled by default.
- SQL dialects differ (e.g. \`ILIKE\` vs \`LIKE\`, \`RETURNING\` clauses).

<b>2. Dedicated Persistent Test Database</b>
Connecting to a dedicated local or CI PostgreSQL instance (\`postgres_test\`) tests real SQL semantics, but shared instances require strict cleanup management to prevent test run state leakage.

<b>3. Ephemeral Containerized Databases (Testcontainers)</b>
Using Docker or Testcontainers spins up an ephemeral PostgreSQL instance per test suite run. It provides complete environment isolation, real engine fidelity, and eliminates persistent state leakage.`,
      diagram: `                  DATABASE STRATEGY MATRIX
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   [ SQLite In-Memory ]                   [ Real PostgreSQL ]
   - Fast setup                           - Exact SQL dialect
   - Lacks JSONB / ENUMs                  - Validates indexes & FKs
   - High risk of false passes            - High fidelity confidence`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/testing/test-database.provider.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Returns TypeORM connection parameters matching the real production PostgreSQL dialect.
 */
export const getTestDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5433', 10),
  username: process.env.TEST_DB_USER || 'test_admin',
  password: process.env.TEST_DB_PASSWORD || 'test_secret',
  database: process.env.TEST_DB_NAME || 'ecommerce_test',
  entities: [User],
  synchronize: true, // Re-creates database schema for test initialization
  logging: false,
});`,
      },
      keyTakeaways: [
        "Avoid using SQLite in-memory stubs when testing PostgreSQL or MySQL applications due to dialect mismatches.",
        "Integration tests must execute against real database engines to validate JSONB queries, ENUMs, and constraints.",
        "Containerized databases (Testcontainers) provide ephemeral isolation without lingering database state.",
        "Separate test database connection strings strictly from local development and production databases.",
      ],
      commonMistakes: [
        "<b>Testing PostgreSQL ORM entities against SQLite in-memory.</b> SQLite accepts invalid TypeORM mappings that fail when deployed to real PostgreSQL servers.",
        "<b>Pointing integration tests to a shared development database.</b> Running integration tests against shared development databases risks deleting active dev records during cleanup routines.",
      ],
      quiz: [
        {
          question: "Why is using SQLite in-memory stubs discouraged for integration testing a PostgreSQL NestJS app?",
          options: [
            "SQLite cannot execute SELECT statements",
            "SQLite lacks native PostgreSQL features like JSONB, ENUMs, and exact foreign key constraint semantics, producing false test passes",
            "TypeORM does not support SQLite",
            "In-memory databases require root operating system access"
          ],
          correctIndex: 1,
          explanation: "In-memory drivers like SQLite do not support native PostgreSQL column types (JSONB, ENUMs) or specific query syntax, leading to false confidence."
        }
      ]
    },
    {
      id: "day-65-lesson-2",
      title: "Transactional Integration Tests (Rollback Pattern)",
      durationMinutes: 25,
      explanation: `<b>Ultra-Fast Database Isolation using Transaction Rollbacks</b>

In integration testing, executing table truncations (\`TRUNCATE TABLE\`) between every single test case introduces significant disk I/O overhead, causing test suites with hundreds of tests to take minutes to run.

The **Transactional Rollback Pattern** speeds up integration testing by wrapping each individual test case inside an uncommitted database transaction:

\`\`\`text
Test Suite Execution Begins
       │
       ├──► Test 1 Starts Transaction -> Inserts Data -> Asserts -> ROLLBACK (0ms IO)
       ├──► Test 2 Starts Transaction -> Inserts Data -> Asserts -> ROLLBACK (0ms IO)
       └──► Test 3 Starts Transaction -> Inserts Data -> Asserts -> ROLLBACK (0ms IO)
\`\`\`

<b>How Transactional Isolation Works</b>

1. In \`beforeEach()\`, start a new database query runner transaction (\`queryRunner.startTransaction()\`).
2. Bind the test's TypeORM repositories or services to the active transactional \`EntityManager\`.
3. Execute service mutations and perform assertions.
4. In \`afterEach()\`, invoke \`queryRunner.rollbackTransaction()\`.

Because the transaction is rolled back before anything is committed to disk, database state returns to its pristine pre-test baseline instantly without table truncation!`,
      diagram: `                 TRANSACTION ROLLBACK EXECUTION
                               │
                        beforeEach Hook
                               │
                    startTransaction()
                               │
                        Execute Test Method
                   (Inserts / Updates Entities)
                               │
                        afterEach Hook
                               │
                   rollbackTransaction()
                 (Database Clean Instantly)`,
      codeExample: {
        title: "Code Example",
        code: `// src/users/tests/users-transactional.integration-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { getTestDatabaseConfig } from '../../common/testing/test-database.provider';

describe('UsersService (Transactional Isolation)', () => {
  let module: TestingModule;
  let service: UsersService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getTestDatabaseConfig()),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    service = module.get<UsersService>(UsersService);
  });

  beforeEach(async () => {
    // 1. Create and start a transactional query runner for this specific test
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    // 2. Roll back transaction completely to leave zero residual data
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should insert a user without leaving persistent records in DB', async () => {
    // Pass transactional manager to service call
    const user = queryRunner.manager.create(User, {
      email: 'transient@example.com',
      name: 'Transient User',
    });
    await queryRunner.manager.save(user);

    const found = await queryRunner.manager.findOneBy(User, { email: 'transient@example.com' });
    expect(found).toBeDefined();
    expect(found?.email).toBe('transient@example.com');
  });
});`,
      },
      keyTakeaways: [
        "The Transactional Rollback Pattern wraps test cases in uncommitted database transactions.",
        "Rolling back transactions in \`afterEach()\` cleans state instantly without disk I/O.",
        "Use transactional isolation to achieve sub-10ms database integration test execution times.",
        "Ensure services and repositories use the transactional \`EntityManager\` during testing.",
      ],
      commonMistakes: [
        "<b>Forgetting to pass the transactional query runner's EntityManager to service logic.</b> If service methods use the global non-transactional connection manager, mutations bypass the transaction and persist permanently to disk.",
      ],
      quiz: [
        {
          question: "What is the key performance advantage of using the Transactional Rollback Pattern over TRUNCATE TABLE in database integration tests?",
          options: [
            "It disables TypeORM query validation",
            "It eliminates disk I/O operations by rolling back uncommitted memory transactions, running test cleanup instantly",
            "It allows testing without a running PostgreSQL database",
            "It automatically generates Swagger API documentation"
          ],
          correctIndex: 1,
          explanation: "Transaction rollbacks happen in memory without writing changes permanently to disk tables, executing cleanup instantly."
        }
      ]
    },
    {
      id: "day-65-lesson-3",
      title: "State Cleanup: Truncation, Cascades & Resets",
      durationMinutes: 24,
      explanation: `<b>When Transaction Rollbacks Are Insufficient</b>

While transaction rollbacks are fast, certain integration scenarios require actual committed transactions:
- Testing explicit database transaction logic (\`queryRunner.commitTransaction()\`).
- Testing multi-threaded or background queue workers (BullMQ) reading from the database.
- Testing asynchronous event listeners executing across separate database connections.

In these cases, changes must be committed, and state cleanup must be enforced between tests using **Database Table Truncation**.

\`\`\`text
┌────────────────────────────────────────────────────────┐
│                   Database Truncation                  │
│                                                        │
│  TRUNCATE TABLE "orders", "users" CASCADE;             │
│  ALTER SEQUENCE users_id_seq RESTART WITH 1;           │
└────────────────────────────────────────────────────────┘
\`\`\`

<b>Handling Foreign Key Constraints during Cleanup</b>

Truncating tables with foreign key dependencies in PostgreSQL requires the \`CASCADE\` clause (\`TRUNCATE TABLE users CASCADE;\`). Otherwise, PostgreSQL aborts the operation with a foreign key violation error.

<b>Auto-Increment Sequence Resets</b>

When testing auto-increment integer IDs, truncating a table leaves the ID sequence at its last value (e.g. Next ID = 42). Reset sequences during cleanup so entity IDs remain predictable across test runs.`,
      diagram: `                 DATABASE TRUNCATION FLOW
                               │
                     Execute Integration Test
                   (Commits DB Transactions)
                               │
                               ▼
                       afterEach Hook
                               │
               TRUNCATE "orders", "users" CASCADE;
               RESTART IDENTITY SEQUENCES;
                               │
                               ▼
                   Prisite Clean Database State`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/testing/database-cleaner.ts
import { DataSource } from 'typeorm';

export class DatabaseCleaner {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Safely truncates all application tables and resets auto-increment sequences.
   */
  async cleanAllTables(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('CRITICAL SAFETY BLOCK: Database cleaner can only execute in test mode!');
    }

    const entities = this.dataSource.entityMetadatas;
    const tableNames = entities
      .map((entity) => \`"\${entity.tableName}"\`)
      .join(', ');

    if (!tableNames) return;

    // Truncate all tables with CASCADE and RESTART IDENTITY in a single SQL query
    await this.dataSource.query(
      \`TRUNCATE TABLE \${tableNames} RESTART IDENTITY CASCADE;\`,
    );
  }
}`,
      },
      keyTakeaways: [
        "Use database truncation when integration tests must commit real SQL transactions.",
        "Append \`CASCADE\` to \`TRUNCATE TABLE\` commands to handle foreign key dependencies.",
        "Include \`RESTART IDENTITY\` to reset auto-increment primary key counters between tests.",
        "Always protect cleanup utilities with explicit environment checks (\`NODE_ENV === 'test'\`).",
      ],
      commonMistakes: [
        "<b>Truncating tables without environment guards.</b> Accidentally invoking truncation functions in development or production environments wipes live database tables.",
        "<b>Truncating tables individually in loop statements.</b> Executing separate \`TRUNCATE\` queries per table is slow; combine all table names into a single \`TRUNCATE TABLE t1, t2 CASCADE\` statement.",
      ],
      quiz: [
        {
          question: "Why should table truncation queries use 'RESTART IDENTITY CASCADE' in PostgreSQL integration test cleanup?",
          options: [
            "To convert database columns into JSONB types",
            "To handle foreign key dependencies automatically and reset primary key auto-increment sequences to 1",
            "To disable TypeORM migrations",
            "To drop the entire PostgreSQL database host"
          ],
          correctIndex: 1,
          explanation: "\`CASCADE\` cleans tables with foreign key dependencies, while \`RESTART IDENTITY\` resets auto-increment counters for consistent ID assertions."
        }
      ]
    },
    {
      id: "day-65-lesson-4",
      title: "Testing Race Conditions & Concurrency Controls",
      durationMinutes: 24,
      explanation: `<b>Catching Concurrent Data Race Bugs with Integration Tests</b>

One of the most valuable uses of database integration testing is verifying **Concurrency Controls** and **Race Condition Safeguards**.

Consider an e-commerce inventory system with 1 unit remaining in stock. If two concurrent HTTP requests attempt to purchase the item at the exact same millisecond, a naive implementation without locking will result in a negative stock balance (-1).

\`\`\`text
                 CONCURRENT RACE CONDITION SCENARIO
Request A (Thread 1) ──► Reads Stock (1) ────┐
                                              ├──► Both see Stock > 0!
Request B (Thread 2) ──► Reads Stock (1) ────┘
                                  │
Request A Decrements Stock -> Stock becomes 0
Request B Decrements Stock -> Stock becomes -1 (OVER-SOLD BUG!)
\`\`\`

<b>Testing Pessimistic & Optimistic Locking in Integration Tests</b>

Integration tests verify concurrency controls by firing multiple concurrent \`Promise.all()\` queries against the real test database:
1. <b>Pessimistic Locking (\`pessimistic_write\`)</b>: Acquires a SQL \`SELECT ... FOR UPDATE\` lock, forcing Request B to wait until Request A completes.
2. <b>Optimistic Locking (\`@VersionColumn\`)</b>: Tracks entity version numbers. If Request B attempts to save a stale version, PostgreSQL throws a \`OptimisticLockVersionMismatchError\`.`,
      diagram: `                 CONCURRENCY TEST EXECUTION
                               │
               Stock = 1 Unit in Test Database
                               │
                               ▼
        Execute Promise.all([ purchase(item), purchase(item) ])
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     [Thread A Succeeds]                  [Thread B Fails]
     Stock reduced to 0                 Throws OptimisticLock /
                                        Pessimistic Timeout`,
      codeExample: {
        title: "Code Example",
        code: `// src/inventory/inventory.integration-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { InventoryService } from './inventory.service';
import { Product } from './entities/product.entity';
import { getTestDatabaseConfig } from '../common/testing/test-database.provider';
import { DatabaseCleaner } from '../common/testing/database-cleaner';

describe('InventoryService Concurrency (Integration)', () => {
  let service: InventoryService;
  let dataSource: DataSource;
  let cleaner: DatabaseCleaner;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getTestDatabaseConfig()),
        TypeOrmModule.forFeature([Product]),
      ],
      providers: [InventoryService],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    dataSource = module.get<DataSource>(DataSource);
    cleaner = new DatabaseCleaner(dataSource);
  });

  beforeEach(async () => {
    await cleaner.cleanAllTables();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should prevent negative inventory when two concurrent purchases occur for 1 remaining item', async () => {
    // 1. Seed initial product with stock = 1
    const product = await service.createProduct({ name: 'Limited Item', stock: 1 });

    // 2. Execute 2 simultaneous purchase requests concurrently using Promise.allSettled
    const results = await Promise.allSettled([
      service.purchaseProductWithLock(product.id, 1),
      service.purchaseProductWithLock(product.id, 1),
    ]);

    // 3. Assert exactly one request succeeded and one failed
    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);

    // 4. Verify database stock is 0 (never negative)
    const updatedProduct = await service.findProductById(product.id);
    expect(updatedProduct?.stock).toBe(0);
  });
});`,
      },
      keyTakeaways: [
        "Integration tests verify concurrency controls (Pessimistic/Optimistic Locking) against real databases.",
        "Simulate race conditions using \`Promise.all()\` or \`Promise.allSettled()\` in test methods.",
        "Pessimistic locking uses \`SELECT ... FOR UPDATE\` to serialize concurrent operations.",
        "Optimistic locking leverages TypeORM \`@VersionColumn()\` to reject stale concurrent writes.",
      ],
      commonMistakes: [
        "<b>Attempting concurrency tests against mocked repositories or SQLite in-memory databases.</b> SQLite in-memory drivers and unit test mocks do not support multi-threaded SQL row locks (\`FOR UPDATE\`).",
      ],
      quiz: [
        {
          question: "How can a NestJS integration test verify that an inventory system prevents negative stock during concurrent purchases?",
          options: [
            "By setting test timeout to 0",
            "By seeding stock = 1 and executing simultaneous purchase calls via Promise.allSettled() against a real database instance",
            "By mocking TypeORM queryRunner",
            "By disabling PostgreSQL transactions"
          ],
          correctIndex: 1,
          explanation: "Executing concurrent calls via \`Promise.allSettled()\` against a real database verifies that database row locks or optimistic version checks reject invalid simultaneous mutations."
        }
      ]
    },
    {
      id: "day-65-lesson-5",
      title: "Testcontainers Integration & Automated CI Pipelines",
      durationMinutes: 23,
      explanation: `<b>Zero-Config Testing with Testcontainers</b>

Relying on a pre-installed, persistent local database for integration tests causes issues in CI/CD environments (GitHub Actions, GitLab CI). If a local database instance is missing or running an incompatible PostgreSQL version, tests fail.

**Testcontainers** solves this problem by programmatically spinning up ephemeral Docker containers directly from within your test code!

\`\`\`text
Integration Test Suite Initialized
               │
               ▼
   Testcontainers Starts Ephemeral Postgres Docker Container
               │
   Executes TypeORM Migrations / Schema Sync
               │
   Runs Integration Tests
               │
               ▼
   Test Suite Finished -> Testcontainers Terminates & Removes Docker Container
\`\`\`

<b>Benefits of Testcontainers in CI Pipelines</b>

1. <b>Zero Environment Setup</b>: CI runners only need Docker installed; Testcontainers handles container downloads, port bindings, and teardown automatically.
2. <b>Version Parity</b>: Tests run against the exact PostgreSQL version used in production (e.g. \`postgres:16-alpine\`).
3. <b>Dynamic Port Mapping</b>: Docker assigns random available ports, avoiding port collision errors when running tests in parallel.`,
      diagram: `                  TESTCONTAINERS LIFECYCLE
                               │
                         beforeAll Hook
                               │
               PostgreSqlContainer("postgres:16-alpine").start()
                               │
                   Inject Dynamic Host & Port
                     into TypeORM Test Module
                               │
                        Execute Test Suite
                               │
                         afterAll Hook
                               │
                      container.stop()
                 (Zero Artifacts Left Behind)`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/testing/testcontainer-setup.ts
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';

export class TestContainerManager {
  private container!: StartedPostgreSqlContainer;

  async startContainer(): Promise<TypeOrmModuleOptions> {
    // Spin up ephemeral PostgreSQL 16 container
    this.container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('test_db')
      .withUsername('test_user')
      .withPassword('test_pass')
      .start();

    return {
      type: 'postgres',
      host: this.container.getHost(),
      port: this.container.getPort(), // Dynamic mapped port
      username: this.container.getUsername(),
      password: this.container.getPassword(),
      database: this.container.getDatabase(),
      entities: [User],
      synchronize: true,
      logging: false,
    };
  }

  async stopContainer(): Promise<void> {
    if (this.container) {
      await this.container.stop(); // Terminates container cleanly
    }
  }
}`,
      },
      keyTakeaways: [
        "Testcontainers programmatically manages ephemeral Docker database containers for integration tests.",
        "Eliminates manual local database setup and prevents CI environment configuration drift.",
        "Dynamic port mapping allows running integration tests concurrently without port conflicts.",
        "Always call \`container.stop()\` in \`afterAll()\` hooks to release Docker resources.",
      ],
      commonMistakes: [
        "<b>Forgetting to call container.stop() in afterAll() hooks.</b> Leaving orphaned Docker containers running consumes system RAM and CPU over time.",
      ],
      quiz: [
        {
          question: "What is the primary advantage of using Testcontainers for database integration testing in CI/CD pipelines?",
          options: [
            "It eliminates the need for Docker",
            "It automatically provisions ephemeral, version-matched database containers on demand without manual CI environment setup",
            "It replaces NestJS dependency injection",
            "It compiles TypeScript code to WebAssembly"
          ],
          correctIndex: 1,
          explanation: "Testcontainers programmatically boots isolated Docker containers for testing, providing zero-config database setups in CI/CD pipelines."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "Why are SQLite in-memory drivers discouraged when testing PostgreSQL NestJS applications?",
      options: [
        "SQLite cannot run inside Node.js",
        "SQLite lacks native PostgreSQL column types (JSONB, ENUMs) and SQL syntax rules, creating false test passes",
        "SQLite is slower than PostgreSQL",
        "TypeORM prohibits SQLite"
      ],
      correctIndex: 1,
      explanation: "SQLite lacks native PostgreSQL features (JSONB, ENUMs) and specific SQL dialect rules, leading to false confidence."
    },
    {
      question: "How does the Transactional Rollback Pattern achieve fast test cleanup in integration tests?",
      options: [
        "By deleting the database file from disk",
        "By wrapping each test in an uncommitted transaction and executing queryRunner.rollbackTransaction() in afterEach()",
        "By running TRUNCATE TABLE on all tables",
        "By disabling TypeORM logging"
      ],
      correctIndex: 1,
      explanation: "Rolling back uncommitted transactions in \`afterEach()\` cleans database changes instantly in memory without slow disk I/O."
    },
    {
      question: "What SQL keywords should be appended to TRUNCATE TABLE when cleaning PostgreSQL tables with foreign keys and auto-increment IDs?",
      options: [
        "DELETE ALL",
        "RESTART IDENTITY CASCADE",
        "DROP SCHEMA",
        "PURGE DATA"
      ],
      correctIndex: 1,
      explanation: "\`CASCADE\` cleans foreign key dependent tables, while \`RESTART IDENTITY\` resets auto-increment primary key counters."
    },
    {
      question: "How can integration tests verify that pessimism or optimism locking prevents over-selling inventory?",
      options: [
        "By running tests sequentially without async/await",
        "By executing simultaneous purchase calls using Promise.allSettled() against a real database instance",
        "By mocking TypeORM EntityManager",
        "By setting NODE_ENV = 'production'"
      ],
      correctIndex: 1,
      explanation: "Simultaneous calls via \`Promise.allSettled()\` against a real database verify that row locks or version checks reject concurrent over-selling."
    },
    {
      question: "What tool allows NestJS test suites to spin up ephemeral Docker PostgreSQL instances programmatically?",
      options: ["Testcontainers", "Supertest", "Webpack", "Prettier"],
      correctIndex: 0,
      explanation: "Testcontainers programmatically manages ephemeral Docker containers directly from test initialization scripts."
    },
    {
      question: "Why should database truncation helpers include an explicit check for process.env.NODE_ENV === 'test'?",
      options: [
        "To speed up SQL queries",
        "To prevent accidental execution against development or production databases",
        "To satisfy TypeScript compiler settings",
        "To automatically run TypeORM migrations"
      ],
      correctIndex: 1,
      explanation: "Environment guards prevent truncation functions from accidentally wiping production or development database records."
    },
    {
      question: "When are transaction rollbacks insufficient for integration test isolation, requiring actual table truncations instead?",
      options: [
        "When testing read-only SELECT queries",
        "When testing explicitly committed multi-step transactions or asynchronous background workers reading committed DB rows",
        "When unit testing custom Pipes",
        "When using Jest mocks"
      ],
      correctIndex: 1,
      explanation: "When tests must commit transactions or test background workers reading committed data, table truncation is required."
    }
  ],
  project: {
    name: "Production Database Integration Test Architecture",
    goal: "Build a robust database integration testing architecture in NestJS featuring real PostgreSQL containerization, fast transactional rollbacks, fallback table truncations, and concurrency race-condition assertions.",
    brief: "Construct an integration test architecture for an E-Commerce Inventory and User system in NestJS. Implement a Testcontainers setup spinning up an ephemeral PostgreSQL instance, build a fast Transactional Rollback test suite for UsersService, create a DatabaseCleaner utility with CASCADE truncations, and write concurrency integration tests asserting that locking prevents inventory race conditions under simultaneous purchases.",
    steps: [
      "Set up Testcontainers configuration to boot an ephemeral PostgreSQL 16 container for integration testing.",
      "Configure a UsersService integration test suite using the Transactional Rollback Pattern (queryRunner.rollbackTransaction()).",
      "Build a DatabaseCleaner utility executing TRUNCATE TABLE RESTART IDENTITY CASCADE with NODE_ENV test guards.",
      "Write InventoryService integration tests that execute concurrent purchase calls via Promise.allSettled().",
      "Assert that pessimistic/optimistic locking prevents negative inventory balances during concurrent purchases.",
      "Verify clean connection teardown (dataSource.destroy() and container.stop()) in afterAll() hooks."
    ],
    acceptance: [
      "Integration tests execute against real PostgreSQL Docker container instances.",
      "Transactional rollback test cases execute cleanly in sub-10ms intervals.",
      "Concurrency tests verify that simultaneous purchases never allow inventory to drop below zero.",
      "Database cleanup helpers enforce NODE_ENV guards and clean up tables successfully."
    ],
    stretch: [
      "Implement optimistic locking using TypeORM @VersionColumn() and assert OptimisticLockVersionMismatchError handling.",
      "Integrate automated TypeORM migration runs against the ephemeral test container before test suite execution."
    ]
  }
};