import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_67_LESSONS: LessonDay = {
  day: 67,
  title: "Testcontainers",
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-67-lesson-1",
      title: "PostgreSQL",
      durationMinutes: 22,
      explanation: `
<b>Imagine you have written a suite of unit tests for your NestJS application.</b> The service tests pass, the controller tests pass, and you deploy to production with confidence. Then production fails because the SQL query you wrote does not actually work — you mocked the repository, so the mock returned whatever you told it to return. It never touched a real database. It never caught the syntax error in your query.

This is the fundamental limitation of unit tests: they verify your code in isolation, but they do not verify that your code works with the real dependencies it will use in production. For databases, this is a serious problem. SQL quirks, type mismatches, constraint violations, and transaction behaviors only appear against a real database.

<b>Testcontainers solves this by spinning up real services in Docker containers for your tests.</b> Instead of mocking PostgreSQL, you start a real PostgreSQL instance in a container, run your tests against it, and tear it down when the tests finish. This is called <b>integration testing</b> — testing your code with real dependencies .

<b>Why Testcontainers and not a local database?</b> Because tests must be repeatable, isolated, and automated. A local database requires manual setup, can have stale data, and might be different from your production database version. Testcontainers provides a fresh, throwaway database for every test run. No manual setup. No data pollution between runs. The same experience on your laptop and in CI .

<b>Why not an in-memory database like SQLite?</b> Because SQLite is not PostgreSQL. SQLite has different SQL dialects, different type systems, different constraint behaviors, and no support for PostgreSQL-specific features like JSONB, arrays, full-text search, or window functions. A test that passes against SQLite can still fail against PostgreSQL. Testcontainers gives you the real thing .

<b>How Testcontainers works.</b> The library talks to the Docker daemon on your machine. When you start a container, Testcontainers pulls the image (if needed), starts the container, exposes its ports on random host ports, and provides you with the connection details. When the test finishes, Testcontainers stops and removes the container .

The magic is in the <b>wait strategies</b>. Testcontainers does not just start the container and immediately return — it waits until the database is actually ready to accept connections. For PostgreSQL, it waits for the "database system is ready to accept connections" log message, or it can use a command-based wait strategy. This eliminates the flaky "connection refused" errors that plague naive Docker-based test setups .

<b>Setting up PostgreSQL with Testcontainers in NestJS.</b> Install the packages:

\`\`\`bash
npm install --save-dev testcontainers @testcontainers/postgresql
npm install pg
\`\`\`

The test setup:

\`\`\`typescript
import { PostgreSqlContainer } from '@testcontainers/postgresql';

let container;
let app;

beforeAll(async () => {
  // Start a PostgreSQL container.
  container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('testdb')
    .withUsername('testuser')
    .withPassword('testpass')
    .start();

  // Get the connection details.
  const connectionUri = container.getConnectionUri();

  // Configure your NestJS app to use this database.
  const module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        url: connectionUri,
        autoLoadEntities: true,
        synchronize: true, // OK for tests
      }),
      AppModule,
    ],
  }).compile();

  app = module.createNestApplication();
  await app.init();
}, 60000); // 60 second timeout for container startup

afterAll(async () => {
  await app.close();
  await container.stop();
});

beforeEach(async () => {
  // Clean the database between tests.
  const dataSource = app.get(DataSource);
  await dataSource.query('TRUNCATE users, orders CASCADE');
});
\`\`\`

<b>The \`getConnectionUri()\` method</b> returns a standard PostgreSQL connection string like \`postgresql://testuser:testpass@localhost:32768/testdb\`. The port is randomly assigned by Docker, so there are no port conflicts even if multiple test suites run in parallel .

<b>Test isolation with TRUNCATE.</b> Between tests, you want a clean database. The \`TRUNCATE ... CASCADE\` command removes all rows from the specified tables and cascades to tables with foreign keys. This is faster than dropping and recreating the schema. For tests that do not use transactions, this is the standard cleanup pattern .

<b>Transaction-based isolation.</b> An alternative to TRUNCATE is wrapping each test in a transaction and rolling it back. This is faster but has limitations: it does not work if your code uses its own transactions, and it does not test the actual commit behavior. For most NestJS integration tests, TRUNCATE is simpler and more reliable .

<b>Running migrations in the container.</b> For tests that need the actual production schema, run your TypeORM migrations after the container starts:

\`\`\`typescript
beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:16-alpine').start();
  
  const module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        url: container.getConnectionUri(),
        autoLoadEntities: true,
        synchronize: false, // Do not auto-sync
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true, // Run migrations on startup
      }),
      AppModule,
    ],
  }).compile();
});
\`\`\`

This tests against the same schema your production database uses, catching migration issues before they reach production.

<b>What can go wrong?</b>
- <b>Docker not running.</b> Testcontainers requires a Docker daemon. In CI, you must ensure Docker is available or use Testcontainers Cloud .
- <b>Container startup timeout.</b> Pulling images and starting containers can take time, especially on a cold machine. Set a generous timeout (60 seconds) for \`beforeAll\` .
- <b>Port conflicts.</b> Testcontainers maps container ports to random host ports, so there are no conflicts. But if you hardcode a port, you will hit conflicts.
- <b>Not cleaning up.</b> If you forget \`container.stop()\`, containers accumulate and consume resources. Testcontainers has a Ryuk sidecar that cleans up, but explicit cleanup is better .
- <b>Using \`synchronize: true\` in production.</b> It is fine for tests but dangerous in production. Use migrations for the real schema .
- <b>Testing against a different PostgreSQL version.</b> Pin the image version (\`postgres:16-alpine\`) to match your production version. Otherwise, you might test against features that do not exist in production.
- <b>Slow tests.</b> Starting a container takes 2-10 seconds. If you have many test files, each starting its own container, the suite becomes slow. Use a shared container across test files with Jest's \`globalSetup\` .

<b>How this appears in a real project.</b> A NestJS e-commerce API has integration tests that verify:
- Creating an order persists it to the database with the correct total.
- The unique constraint on email returns a 409 when a duplicate is inserted.
- The foreign key from orders to users is enforced.
- The JSONB column for product attributes stores and retrieves correctly.
- A transaction that updates inventory and creates an order rolls back if inventory is insufficient.

None of these can be tested with mocks. All of them require a real PostgreSQL database. Testcontainers provides it automatically.

<b>How experienced engineers think.</b> Unit tests verify logic. Integration tests verify behavior against real infrastructure. You need both. Testcontainers makes integration tests as easy to write as unit tests — no manual setup, no shared databases, no flaky environments. If your application talks to a database, your tests should talk to a real one.
      `,
      diagram: `
Testcontainers with PostgreSQL

  Test startup:
    beforeAll()
      |
      v
    PostgreSqlContainer('postgres:16-alpine')
      |
      |  Docker pulls image (if needed)
      |  Docker starts container
      |  Testcontainers waits for "ready to accept connections"
      v
    Container running on localhost:<random-port>
      |
      v
    NestJS app connects via container.getConnectionUri()
      |
      v
    Tests run against the real database

  Test isolation:
    beforeEach()
      |
      v
    TRUNCATE users, orders CASCADE
      |
      v
    Database is clean for the next test

  Test teardown:
    afterAll()
      |
      +--> app.close()
      +--> container.stop()
      +--> Docker removes the container

  Connection URI:
    postgresql://testuser:testpass@localhost:32768/testdb
    (port is randomly assigned by Docker)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// POSTGRESQL WITH TESTCONTAINERS IN NESTJS
// ============================================

// Install:
// npm install --save-dev testcontainers @testcontainers/postgresql
// npm install pg @types/pg

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users API (e2e with PostgreSQL)', () => {
  let container: StartedPostgreSqlContainer;
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    // 1. Start a real PostgreSQL container.
    container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('testdb')
      .withUsername('testuser')
      .withPassword('testpass')
      .start();

    // 2. Create the NestJS testing module with the container's connection.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: container.getConnectionUri(),
          autoLoadEntities: true,
          synchronize: true, // OK for tests, use migrations in production
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  }, 60000); // 60s timeout for container startup

  afterAll(async () => {
    // 3. Clean up: close the app and stop the container.
    await app.close();
    await container.stop();
  });

  beforeEach(async () => {
    // 4. Clean the database between tests.
    await dataSource.query('TRUNCATE users, orders CASCADE');
  });

  it('POST /users creates a user and persists it', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'ada@example.com', name: 'Ada Lovelace' })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.email).toBe('ada@example.com');

    // Verify persistence directly in the database.
    const result = await dataSource.query(
      'SELECT * FROM users WHERE email = $1',
      ['ada@example.com'],
    );
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Ada Lovelace');
  });

  it('enforces the unique email constraint', async () => {
    // Create the first user.
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'duplicate@example.com', name: 'First' })
      .expect(201);

    // Attempt to create a duplicate.
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'duplicate@example.com', name: 'Second' })
      .expect(409);
  });

  it('returns an empty array when no users exist', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it('transactions roll back on failure', async () => {
    // Attempt to create an order for a non-existent user.
    // The foreign key constraint should cause a rollback.
    await request(app.getHttpServer())
      .post('/orders')
      .send({ userId: 99999, total: 100 })
      .expect(500);

    // Verify no order was created.
    const result = await dataSource.query('SELECT * FROM orders');
    expect(result).toHaveLength(0);
  });
});

// ============================================
// SHARED CONTAINER ACROSS TEST FILES (jest globalSetup)
// ============================================

// jest.globalSetup.ts
import { PostgreSqlContainer } from '@testcontainers/postgresql';

export default async function globalSetup() {
  const container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('testdb')
    .start();

  // Store the connection URI for all test files.
  process.env.TEST_DATABASE_URL = container.getConnectionUri();

  // Store the container reference for teardown.
  (global as any).__POSTGRES_CONTAINER__ = container;
}

// jest.globalTeardown.ts
export default async function globalTeardown() {
  const container = (global as any).__POSTGRES_CONTAINER__;
  await container?.stop();
}

// jest.config.ts
export default {
  globalSetup: './jest.globalSetup.ts',
  globalTeardown: './jest.globalTeardown.ts',
  testTimeout: 30000,
  hookTimeout: 60000,
};
      ` },
      keyTakeaways: [
        "Testcontainers spins up real PostgreSQL instances in Docker for integration tests, eliminating mock-vs-reality drift.",
        "Use `@testcontainers/postgresql` and `PostgreSqlContainer` to start a container with a random port, avoiding conflicts.",
        "Always set a generous timeout (60s) for container startup in `beforeAll`.",
        "Clean the database between tests with `TRUNCATE ... CASCADE` for isolation.",
        "Use `synchronize: true` for test schemas, but run real migrations when testing schema compatibility.",
        "Share containers across test files with Jest `globalSetup`/`globalTeardown` to speed up the suite.",
        "Pin the PostgreSQL image version to match production and avoid testing against the wrong features.",
      ],
      commonMistakes: [
        "<b>Docker not running.</b> Testcontainers requires a Docker daemon. Ensure Docker is available in CI and locally.",
        "<b>Container startup timeout.</b> Pulling images and starting containers takes time. Set a 60-second timeout for `beforeAll`.",
        "<b>Forgetting `container.stop()`.</b> Containers accumulate. Use Ryuk (automatic) and explicit `stop()` in `afterAll` for safety.",
        "<b>Using `synchronize: true` in production.</b> It is fine for tests but dangerous in production. Use migrations for the real schema.",
        "<b>Hardcoding a database port.</b> Testcontainers assigns random host ports to avoid conflicts. Use `container.getConnectionUri()` instead.",
        "<b>Testing against the wrong PostgreSQL version.</b> Pin the image tag to match production. `postgres:16-alpine` is not the same as `postgres:14-alpine`.",
        "<b>Not cleaning data between tests.</b> Leftover data causes flaky tests and cross-test contamination. Use `TRUNCATE ... CASCADE` in `beforeEach`.",
      ],
      quiz: [
        {
          question: "Why is Testcontainers preferred over an in-memory database like SQLite for integration tests?",
          options: [
            "Because SQLite is slower.",
            "Because SQLite has a different SQL dialect and lacks PostgreSQL-specific features, so tests can pass against SQLite but fail in production.",
            "Because SQLite cannot handle multiple connections.",
            "Because Testcontainers is easier to set up.",
          ],
          correctIndex: 1,
          explanation: "SQLite is not PostgreSQL. It has different types, constraints, and SQL support. Testing against SQLite gives false confidence. Testcontainers runs the real database version you use in production.",
        },
        {
          question: "What does `container.getConnectionUri()` return for a PostgreSQL container?",
          options: [
            "A JSON object with host and port.",
            "A standard PostgreSQL connection string like `postgresql://user:pass@localhost:32768/db`.",
            "A Docker container ID.",
            "A file path.",
          ],
          correctIndex: 1,
          explanation: "`getConnectionUri()` returns a full connection string with the randomly assigned host port, ready to use with any PostgreSQL client or ORM.",
        },
        {
          question: "Why should you clean the database between tests?",
          options: [
            "To make tests slower.",
            "To ensure each test runs against a known, empty state, preventing data from one test affecting another.",
            "Because TypeORM requires it.",
            "To save disk space.",
          ],
          correctIndex: 1,
          explanation: "Leftover data from one test can cause another test to fail or pass for the wrong reasons. `TRUNCATE ... CASCADE` in `beforeEach` ensures a clean slate.",
        },
        {
          question: "What is the benefit of sharing a container across test files with Jest `globalSetup`?",
          options: [
            "It makes tests slower.",
            "It starts the container once for the entire test suite, reducing startup overhead and speeding up the test run.",
            "It prevents tests from running in parallel.",
            "It automatically generates test data.",
          ],
          correctIndex: 1,
          explanation: "Each container startup takes 2-10 seconds. If every test file starts its own container, the suite becomes slow. A shared container started once in `globalSetup` is reused across all test files.",
        },
      ],
    },
    {
      id: "day-67-lesson-2",
      title: "Redis",
      durationMinutes: 22,
      explanation: `
<b>Your NestJS application uses Redis for caching and rate limiting.</b> The unit tests mock the Redis client, so they pass. But in production, you discover that your cache keys use the wrong format, or that your rate limiter's Lua script has a syntax error that only Redis can detect, or that your cache TTL is being set in the wrong units. Mocks cannot catch these bugs because they do not speak Redis.

This is where Testcontainers for Redis comes in. It starts a real Redis server in a Docker container, runs your cache and rate limiter code against it, and verifies that everything works exactly as it will in production .

<b>Why Redis integration tests matter.</b> Redis is not just a key-value store. It has data structures (hashes, sorted sets, lists, streams), Lua scripting, pub/sub, transactions, and TTL semantics that are easy to get wrong. A mock that returns a hardcoded string will never catch:
- A key naming collision between your cache and your rate limiter.
- A Lua script that returns the wrong shape.
- A TTL that is in milliseconds when Redis expects seconds.
- A pipeline that fails partway through.
- A serialization format mismatch (JSON vs. plain string).

Testcontainers gives you a real Redis server, so your tests exercise the actual behavior .

<b>Setting up Redis with Testcontainers in NestJS.</b> Install the packages:

\`\`\`bash
npm install --save-dev testcontainers @testcontainers/redis
npm install redis
\`\`\`

The test setup:

\`\`\`typescript
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { createClient, RedisClientType } from 'redis';

let container: StartedRedisContainer;
let client: RedisClientType;

beforeAll(async () => {
  // Start a Redis container.
  container = await new RedisContainer('redis:7-alpine').start();

  // Connect to it.
  client = createClient({ url: container.getConnectionUrl() });
  client.on('error', console.error);
  await client.connect();
}, 30000);

afterAll(async () => {
  await client.close();
  await container.stop();
});

beforeEach(async () => {
  // Clean the database between tests.
  await client.flushDb();
});
\`\`\`

The \`getConnectionUrl()\` method returns a standard Redis URL like \`redis://localhost:32768\`. The port is randomly assigned by Docker, so no conflicts .

<b>Testing a cache service.</b> Here is a realistic test for a NestJS cache service that uses Redis:

\`\`\`typescript
describe('CacheService (integration with Redis)', () => {
  let cacheService: CacheService;
  let client: RedisClientType;

  beforeAll(async () => {
    container = await new RedisContainer('redis:7-alpine').start();
    client = createClient({ url: container.getConnectionUrl() });
    await client.connect();

    const module = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: 'REDIS',
          useValue: client,
        },
      ],
    }).compile();

    cacheService = module.get<CacheService>(CacheService);
  });

  afterAll(async () => {
    await client.close();
    await container.stop();
  });

  beforeEach(async () => {
    await client.flushDb();
  });

  it('stores and retrieves a value', async () => {
    await cacheService.set('user:1', { name: 'Ada' }, 60);
    const result = await cacheService.get('user:1');
    expect(result).toEqual({ name: 'Ada' });
  });

  it('returns undefined for a missing key', async () => {
    const result = await cacheService.get('nonexistent');
    expect(result).toBeUndefined();
  });

  it('respects the TTL', async () => {
    await cacheService.set('token', 'abc', 1); // 1 second
    await new Promise((r) => setTimeout(r, 1100));
    const result = await cacheService.get('token');
    expect(result).toBeUndefined();
  });

  it('deletes a key', async () => {
    await cacheService.set('temp', 'value', 60);
    await cacheService.del('temp');
    const result = await cacheService.get('temp');
    expect(result).toBeUndefined();
  });
});
\`\`\`

<b>Testing the TTL.</b> The TTL test is especially valuable. It verifies that your TTL units are correct (seconds, not milliseconds) and that Redis actually expires the key. A mock cannot test this — it would just return the value you told it to return .

<b>Testing Lua scripts for rate limiting.</b> If your rate limiter uses a Lua script, Testcontainers lets you verify that the script compiles and runs correctly:

\`\`\`typescript
it('enforces the rate limit using Lua', async () => {
  const key = 'ratelimit:user:1';
  const limit = 3;
  const window = 60;

  // Load the Lua script.
  const script = \`
    local current = redis.call('INCR', KEYS[1])
    if current == 1 then
      redis.call('EXPIRE', KEYS[1], ARGV[1])
    end
    if current > tonumber(ARGV[2]) then
      return 0
    end
    return 1
  \`;

  // First 3 requests should be allowed.
  for (let i = 0; i < 3; i++) {
    const result = await client.eval(script, {
      keys: [key],
      arguments: [String(window), String(limit)],
    });
    expect(result).toBe(1);
  }

  // The 4th request should be rejected.
  const result = await client.eval(script, {
    keys: [key],
    arguments: [String(window), String(limit)],
  });
  expect(result).toBe(0);
});
\`\`\`

This test would catch syntax errors in the Lua script, wrong key names, and incorrect limit logic — none of which a mock would detect.

<b>Using Redis Stack.</b> If your application uses Redis Stack features like RediSearch, RedisJSON, or RedisTimeSeries, you can use the Redis Stack image:

\`\`\`typescript
import { GenericContainer } from 'testcontainers';

const container = await new GenericContainer('redis/redis-stack-server:latest')
  .withExposedPorts(6379)
  .start();

const port = container.getMappedPort(6379);
const host = container.getHost();
\`\`\`

For the JSON commands, you would use a client that supports Redis Stack, like \`redis\` with the \`json\` module .

<b>Sharing a Redis container across tests.</b> Like PostgreSQL, you can share a Redis container across test files with Jest's \`globalSetup\`:

\`\`\`typescript
// jest.globalSetup.ts
import { RedisContainer } from '@testcontainers/redis';

export default async function globalSetup() {
  const container = await new RedisContainer('redis:7-alpine').start();
  process.env.REDIS_TEST_URL = container.getConnectionUrl();
  (global as any).__REDIS_CONTAINER__ = container;
}

// jest.globalTeardown.ts
export default async function globalTeardown() {
  const container = (global as any).__REDIS_CONTAINER__;
  await container?.stop();
}
\`\`\`

Then in your test files, read \`process.env.REDIS_TEST_URL\` to connect .

<b>What can go wrong?</b>
- <b>Forgetting to close the client.</b> An open Redis connection keeps the test process alive. Always \`await client.close()\` in \`afterAll\` .
- <b>Using \`client.quit()\` with node-redis v5.</b> \`quit()\` is deprecated; use \`close()\` instead .
- <b>Not flushing the database between tests.</b> Keys from one test leak into the next. Use \`flushDb()\` in \`beforeEach\`.
- <b>Hardcoding the Redis port.</b> Testcontainers assigns random ports. Use \`container.getConnectionUrl()\` instead.
- <b>Testing against the wrong Redis version.</b> Redis 7 has different features than Redis 6. Pin the image tag.
- <b>Assuming Redis is always available.</b> Docker must be running. If Docker is down, the test fails with a clear error.
- <b>Slow tests due to container startup.</b> Share the container across files with \`globalSetup\` to reduce overhead.

<b>How this appears in a real project.</b> A NestJS application with Redis-based caching and rate limiting has integration tests that verify:
- The cache stores and retrieves JSON-serialized objects correctly.
- The cache respects TTLs.
- The rate limiter Lua script enforces the correct limit.
- Two different rate limit keys have independent counters.
- The cache and rate limiter keys do not collide.
- The Redis client reconnects after a simulated network issue.

None of these can be tested with mocks. All of them require a real Redis server. Testcontainers provides it automatically.

<b>How experienced engineers think.</b> Redis is simple on the surface but full of subtle behaviors. Integration tests against a real Redis instance are the only way to catch TTL unit errors, Lua script bugs, and key collisions. The overhead of starting a container is worth the confidence it provides.
      `,
      diagram: `
Testcontainers with Redis

  Test startup:
    beforeAll()
      |
      v
    RedisContainer('redis:7-alpine')
      |
      |  Docker starts container
      |  Testcontainers waits for "Ready to accept connections"
      v
    Redis running on localhost:<random-port>
      |
      v
    NestJS app connects via container.getConnectionUrl()
      |
      v
    Tests run against real Redis

  Test isolation:
    beforeEach()
      |
      v
    client.flushDb()
      |
      v
    Redis is empty for the next test

  Test teardown:
    afterAll()
      |
      +--> client.close()
      +--> container.stop()
      +--> Docker removes the container

  Connection URL:
    redis://localhost:32768
    (port is randomly assigned by Docker)

  Real behaviors tested:
    - TTL expiration (seconds, not milliseconds)
    - Lua script correctness
    - Key collision between cache and rate limiter
    - Serialization format
      `,
      codeExample: { title: "Example", code: `
// ============================================
// REDIS WITH TESTCONTAINERS IN NESTJS
// ============================================

// Install:
// npm install --save-dev testcontainers @testcontainers/redis
// npm install redis

import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { createClient, RedisClientType } from 'redis';
import { Test } from '@nestjs/testing';

describe('CacheService (integration with Redis)', () => {
  let container: StartedRedisContainer;
  let client: RedisClientType;
  let cacheService: CacheService;

  beforeAll(async () => {
    // 1. Start a real Redis container.
    container = await new RedisContainer('redis:7-alpine').start();

    // 2. Connect to it.
    client = createClient({ url: container.getConnectionUrl() });
    client.on('error', console.error);
    await client.connect();

    // 3. Create the NestJS testing module with the real Redis client.
    const module = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: 'REDIS',
          useValue: client,
        },
      ],
    }).compile();

    cacheService = module.get<CacheService>(CacheService);
  }, 30000);

  afterAll(async () => {
    // 4. Clean up: close the client and stop the container.
    await client.close();
    await container.stop();
  });

  beforeEach(async () => {
    // 5. Clean the database between tests.
    await client.flushDb();
  });

  it('stores and retrieves a value', async () => {
    await cacheService.set('user:1', { name: 'Ada' }, 60);
    const result = await cacheService.get('user:1');
    expect(result).toEqual({ name: 'Ada' });
  });

  it('returns undefined for a missing key', async () => {
    const result = await cacheService.get('nonexistent');
    expect(result).toBeUndefined();
  });

  it('respects the TTL', async () => {
    await cacheService.set('token', 'abc', 1); // 1 second
    await new Promise((r) => setTimeout(r, 1100));
    const result = await cacheService.get('token');
    expect(result).toBeUndefined();
  });

  it('deletes a key', async () => {
    await cacheService.set('temp', 'value', 60);
    await cacheService.del('temp');
    const result = await cacheService.get('temp');
    expect(result).toBeUndefined();
  });
});

describe('RateLimiter (integration with Redis and Lua)', () => {
  let container: StartedRedisContainer;
  let client: RedisClientType;

  beforeAll(async () => {
    container = await new RedisContainer('redis:7-alpine').start();
    client = createClient({ url: container.getConnectionUrl() });
    await client.connect();
  }, 30000);

  afterAll(async () => {
    await client.close();
    await container.stop();
  });

  beforeEach(async () => {
    await client.flushDb();
  });

  it('enforces the rate limit using a Lua script', async () => {
    const key = 'ratelimit:user:1';
    const limit = 3;
    const window = 60;

    const script = \`
      local current = redis.call('INCR', KEYS[1])
      if current == 1 then
        redis.call('EXPIRE', KEYS[1], ARGV[1])
      end
      if current > tonumber(ARGV[2]) then
        return 0
      end
      return 1
    \`;

    // First 3 requests should be allowed.
    for (let i = 0; i < 3; i++) {
      const result = await client.eval(script, {
        keys: [key],
        arguments: [String(window), String(limit)],
      });
      expect(result).toBe(1);
    }

    // The 4th request should be rejected.
    const result = await client.eval(script, {
      keys: [key],
      arguments: [String(window), String(limit)],
    });
    expect(result).toBe(0);
  });

  it('uses independent counters for different keys', async () => {
    const script = \`
      local current = redis.call('INCR', KEYS[1])
      if current == 1 then
        redis.call('EXPIRE', KEYS[1], ARGV[1])
      end
      if current > tonumber(ARGV[2]) then
        return 0
      end
      return 1
    \`;

    // User 1 uses 1 request.
    await client.eval(script, {
      keys: ['ratelimit:user:1'],
      arguments: ['60', '3'],
    });

    // User 2's counter is independent.
    const result = await client.eval(script, {
      keys: ['ratelimit:user:2'],
      arguments: ['60', '3'],
    });
    expect(result).toBe(1);
  });
});

// ============================================
// SHARED REDIS CONTAINER (jest globalSetup)
// ============================================

// jest.globalSetup.ts
import { RedisContainer } from '@testcontainers/redis';

export default async function globalSetup() {
  const container = await new RedisContainer('redis:7-alpine').start();
  process.env.REDIS_TEST_URL = container.getConnectionUrl();
  (global as any).__REDIS_CONTAINER__ = container;
}

// jest.globalTeardown.ts
export default async function globalTeardown() {
  const container = (global as any).__REDIS_CONTAINER__;
  await container?.stop();
}

// jest.config.ts
export default {
  globalSetup: './jest.globalSetup.ts',
  globalTeardown: './jest.globalTeardown.ts',
  testTimeout: 30000,
  hookTimeout: 60000,
};
      ` },
      keyTakeaways: [
        "Testcontainers for Redis spins up a real Redis server in Docker, catching bugs that mocks cannot detect.",
        "Use `RedisContainer` and `container.getConnectionUrl()` to start and connect to the container.",
        "Always `client.close()` in `afterAll` — `quit()` is deprecated in node-redis v5.",
        "Clean the database between tests with `client.flushDb()` in `beforeEach`.",
        "Test TTL behavior against real Redis to catch unit errors (seconds vs. milliseconds).",
        "Test Lua scripts (rate limiting, atomic operations) against real Redis to catch syntax and logic bugs.",
        "Share a Redis container across test files with Jest `globalSetup`/`globalTeardown` for speed.",
      ],
      commonMistakes: [
        "<b>Forgetting to close the Redis client.</b> An open connection keeps the test process alive. Always `await client.close()` in `afterAll`.",
        "<b>Using `client.quit()` with node-redis v5.</b> It is deprecated. Use `client.close()` instead.",
        "<b>Not flushing the database between tests.</b> Keys from one test leak into the next. Use `flushDb()` in `beforeEach`.",
        "<b>Hardcoding the Redis port.</b> Testcontainers assigns random ports. Use `container.getConnectionUrl()`.",
        "<b>Testing against the wrong Redis version.</b> Pin the image tag to match production.",
        "<b>Skipping Lua script tests.</b> Lua scripts have subtle bugs that mocks cannot catch. Always test them against real Redis.",
        "<b>Assuming Redis is always available.</b> Docker must be running. In CI, ensure Docker is available or use Testcontainers Cloud.",
      ],
      quiz: [
        {
          question: "Why should you test TTL behavior against real Redis instead of a mock?",
          options: [
            "Because mocks are slower.",
            "Because a mock cannot actually expire a key — it returns whatever you programmed, so it cannot catch unit errors (seconds vs. milliseconds) or TTL misconfigurations.",
            "Because Redis TTLs are unreliable.",
            "Because mocks do not support TTL.",
          ],
          correctIndex: 1,
          explanation: "A mock returns a value regardless of time. Only a real Redis server can actually expire a key. Testing TTL against real Redis catches unit errors and misconfigurations.",
        },
        {
          question: "What does `container.getConnectionUrl()` return for Redis?",
          options: [
            "A Docker container ID.",
            "A Redis URL like `redis://localhost:32768`.",
            "A JSON object with host and port.",
            "A file path.",
          ],
          correctIndex: 1,
          explanation: "`getConnectionUrl()` returns a full Redis URL with the randomly assigned host port, ready to use with any Redis client.",
        },
        {
          question: "Why is testing Lua scripts against real Redis important?",
          options: [
            "Because Lua is deprecated.",
            "Because Lua scripts have syntax and logic bugs that mocks cannot catch — only real Redis can execute the script.",
            "Because Lua is slower than JavaScript.",
            "Because Redis cannot run without Lua.",
          ],
          correctIndex: 1,
          explanation: "A mock does not execute the Lua script. Only a real Redis server can compile and run it, catching syntax errors, wrong key names, and incorrect limit logic.",
        },
        {
          question: "What is the correct way to clean Redis between tests?",
          options: [
            "Delete the container and start a new one.",
            "Call `client.flushDb()` in `beforeEach`.",
            "Restart the Redis server.",
            "Use `FLUSHALL` on the production instance.",
          ],
          correctIndex: 1,
          explanation: "`flushDb()` removes all keys from the current database. It is fast and isolates each test. Restarting the container for each test is slow and unnecessary.",
        },
      ],
    },
    {
      id: "day-67-lesson-3",
      title: "RabbitMQ",
      durationMinutes: 22,
      explanation: `
<b>Your NestJS application uses RabbitMQ for asynchronous task processing.</b> An order is placed, a message is published to a queue, and a consumer processes it in the background. The unit tests mock the RabbitMQ client, so they pass. But in production, you discover that messages are being lost, or that the dead-letter queue is not working, or that the consumer's acknowledgment logic is wrong. Mocks cannot catch these because they do not speak AMQP.

This is where Testcontainers for RabbitMQ comes in. It starts a real RabbitMQ broker in a Docker container, runs your publisher and consumer code against it, and verifies that messages are published, routed, consumed, and acknowledged correctly .

<b>Why RabbitMQ integration tests matter.</b> RabbitMQ is a message broker with exchanges, queues, bindings, routing keys, acknowledgments, dead-letter queues, and consumer prefetch settings. Getting these wrong is easy, and the bugs are often silent:
- A message published to the wrong exchange is dropped.
- A consumer that does not acknowledge messages causes them to be redelivered forever.
- A dead-letter queue that is not configured correctly loses failed messages.
- A prefetch setting that is too high causes memory issues.
- A connection that is not closed leaves dangling consumers.

Testcontainers gives you a real RabbitMQ broker, so your tests exercise the actual AMQP behavior .

<b>Setting up RabbitMQ with Testcontainers.</b> Install the packages:

\`\`\`bash
npm install --save-dev testcontainers @testcontainers/rabbitmq
npm install amqplib
\`\`\`

The test setup:

\`\`\`typescript
import { RabbitMQContainer, StartedRabbitMQContainer } from '@testcontainers/rabbitmq';
import * as amqp from 'amqplib';

let container: StartedRabbitMQContainer;
let connection: amqp.Connection;
let channel: amqp.Channel;

beforeAll(async () => {
  // Start a RabbitMQ container.
  container = await new RabbitMQContainer('rabbitmq:3-management-alpine').start();

  // Connect to it.
  connection = await amqp.connect(container.getAmqpUrl());
  channel = await connection.createChannel();

  // Declare the test topology (exchange, queues, bindings).
  await channel.assertExchange('test.exchange', 'topic', { durable: false });
  await channel.assertQueue('test.queue', { durable: false });
  await channel.bindQueue('test.queue', 'test.exchange', 'test.*');
  await channel.assertQueue('test.dlq', { durable: false });
}, 60000); // 60s timeout

afterAll(async () => {
  await channel.close();
  await connection.close();
  await container.stop();
});

beforeEach(async () => {
  // Clean the queues between tests.
  await channel.purgeQueue('test.queue');
  await channel.purgeQueue('test.dlq');
});
\`\`\`

The \`getAmqpUrl()\` method returns a standard AMQP URL like \`amqp://guest:guest@localhost:32768\`. The port is randomly assigned by Docker .

<b>Testing a publisher.</b> Here is a realistic test for a NestJS service that publishes messages:

\`\`\`typescript
describe('OrderPublisher (integration with RabbitMQ)', () => {
  let publisher: OrderPublisher;
  let channel: amqp.Channel;

  beforeAll(async () => {
    container = await new RabbitMQContainer('rabbitmq:3-management-alpine').start();
    const connection = await amqp.connect(container.getAmqpUrl());
    channel = await connection.createChannel();

    await channel.assertExchange('orders', 'topic', { durable: true });
    await channel.assertQueue('orders.created', { durable: true });
    await channel.bindQueue('orders.created', 'orders', 'order.created');

    publisher = new OrderPublisher(channel);
  }, 60000);

  afterAll(async () => {
    await channel.close();
    await container.stop();
  });

  beforeEach(async () => {
    await channel.purgeQueue('orders.created');
  });

  it('publishes an order created message', async () => {
    const order = { id: 123, total: 99.99 };

    await publisher.publishOrderCreated(order);

    // Verify the message is in the queue.
    const queueInfo = await channel.checkQueue('orders.created');
    expect(queueInfo.messageCount).toBe(1);
  });

  it('publishes a message with the correct routing key', async () => {
    const order = { id: 456, total: 49.99 };

    await publisher.publishOrderCreated(order);

    // Consume the message and verify its content.
    const message = await new Promise<any>((resolve) => {
      channel.consume('orders.created', (msg) => {
        if (msg) {
          resolve(JSON.parse(msg.content.toString()));
          channel.ack(msg);
        }
      });
    });

    expect(message.id).toBe(456);
    expect(message.total).toBe(49.99);
  });
});
\`\`\`

<b>Testing a consumer.</b> Testing a consumer is more involved because you need to verify that messages are processed and acknowledged:

\`\`\`typescript
describe('OrderConsumer (integration with RabbitMQ)', () => {
  let consumer: OrderConsumer;
  let mockOrderService: { processOrder: jest.Mock };
  let channel: amqp.Channel;

  beforeAll(async () => {
    container = await new RabbitMQContainer('rabbitmq:3-management-alpine').start();
    const connection = await amqp.connect(container.getAmqpUrl());
    channel = await connection.createChannel();

    await channel.assertQueue('orders.queue', {
      durable: false,
      deadLetterExchange: '',
      deadLetterRoutingKey: 'orders.dlq',
    });
    await channel.assertQueue('orders.dlq', { durable: false });

    mockOrderService = {
      processOrder: jest.fn(),
    };

    consumer = new OrderConsumer(channel, mockOrderService);
  }, 60000);

  afterAll(async () => {
    await channel.close();
    await container.stop();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await channel.purgeQueue('orders.queue');
    await channel.purgeQueue('orders.dlq');
  });

  it('processes a valid message and acknowledges it', async () => {
    mockOrderService.processOrder.mockResolvedValue({ success: true });

    // Publish a valid message.
    channel.publish(
      '',
      'orders.queue',
      Buffer.from(JSON.stringify({ orderId: '123', userId: 'user-1' })),
      { contentType: 'application/json' },
    );

    // Start the consumer.
    await consumer.start('orders.queue');

    // Wait for processing.
    await new Promise((r) => setTimeout(r, 500));

    // Verify the service was called.
    expect(mockOrderService.processOrder).toHaveBeenCalledWith({
      orderId: '123',
      userId: 'user-1',
    });

    // Verify the message was acknowledged (queue is empty).
    const queueInfo = await channel.checkQueue('orders.queue');
    expect(queueInfo.messageCount).toBe(0);
  });

  it('rejects an invalid message to the dead-letter queue', async () => {
    // Publish an invalid message (missing required field).
    channel.publish(
      '',
      'orders.queue',
      Buffer.from(JSON.stringify({ userId: 'user-1' })), // missing orderId
      { contentType: 'application/json' },
    );

    // Start the consumer.
    await consumer.start('orders.queue');

    // Wait for the message to be rejected.
    await new Promise((r) => setTimeout(r, 500));

    // Verify the message is in the DLQ.
    const dlqInfo = await channel.checkQueue('orders.dlq');
    expect(dlqInfo.messageCount).toBe(1);
  });
});
\`\`\`

<b>Testing the dead-letter queue.</b> The DLQ test is especially valuable. It verifies that when a message fails processing (or fails validation), it is routed to the dead-letter queue instead of being lost or redelivered forever. A mock cannot test this because the DLQ behavior is entirely a RabbitMQ feature .

<b>What can go wrong?</b>
- <b>Not waiting for the consumer to process.</b> Consumers are asynchronous. After publishing a message, you must wait for the consumer to finish before asserting. Use a small delay or a promise that resolves when processing is complete.
- <b>Not cleaning the queues between tests.</b> Messages from one test leak into the next. Use \`purgeQueue()\` in \`beforeEach\`.
- <b>Using the default guest user in production.</b> The \`guest\` user can only connect from localhost. For Testcontainers, this is fine because the container is local.
- <b>Not closing the connection.</b> An open AMQP connection keeps the test process alive. Always \`await connection.close()\` in \`afterAll\`.
- <b>Declaring queues with \`durable: true\` in tests.</b> Durable queues survive broker restarts, which is unnecessary for tests and slows down cleanup. Use \`durable: false\` for test queues.
- <b>Forgetting to declare the DLQ.</b> If the DLQ does not exist, messages routed to it are dropped. Always declare the DLQ in the test setup.
- <b>Assuming the container is ready immediately.</b> RabbitMQ takes time to start. Set a 60-second timeout for \`beforeAll\` and use a wait strategy.

<b>How this appears in a real project.</b> A NestJS application with RabbitMQ-based order processing has integration tests that verify:
- Publishing an order event puts the message in the correct queue.
- The consumer processes valid messages and acknowledges them.
- Invalid messages are rejected and routed to the DLQ.
- The consumer retries failed messages up to a limit, then sends them to the DLQ.
- Two different event types are routed to different queues.
- The message payload is JSON-serializable and contains the expected fields.

None of these can be tested with mocks. All of them require a real RabbitMQ broker. Testcontainers provides it automatically .

<b>How experienced engineers think.</b> Message brokers are where distributed systems bugs hide. A message that is silently dropped, a consumer that never acknowledges, a DLQ that is not wired correctly — these are the failures that cause data loss in production. Integration tests against a real broker catch them before they cause damage. Testcontainers makes those tests as easy to write as unit tests.
      `,
      diagram: `
Testcontainers with RabbitMQ

  Test startup:
    beforeAll()
      |
      v
    RabbitMQContainer('rabbitmq:3-management-alpine')
      |
      |  Docker starts container
      |  Testcontainers waits for "Server startup complete"
      v
    RabbitMQ running on localhost:<random-port>
      |
      v
    Declare test topology:
      - exchange: test.exchange
      - queue: test.queue
      - binding: test.* -> test.queue
      - DLQ: test.dlq
      |
      v
    Tests run against real RabbitMQ

  Test isolation:
    beforeEach()
      |
      v
    channel.purgeQueue('test.queue')
    channel.purgeQueue('test.dlq')
      |
      v
    Queues are empty for the next test

  Test teardown:
    afterAll()
      |
      +--> channel.close()
      +--> connection.close()
      +--> container.stop()
      +--> Docker removes the container

  AMQP URL:
    amqp://guest:guest@localhost:32768
    (port is randomly assigned by Docker)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// RABBITMQ WITH TESTCONTAINERS IN NESTJS
// ============================================

// Install:
// npm install --save-dev testcontainers @testcontainers/rabbitmq
// npm install amqplib @types/amqplib

import { RabbitMQContainer, StartedRabbitMQContainer } from '@testcontainers/rabbitmq';
import * as amqp from 'amqplib';

describe('OrderPublisher (integration with RabbitMQ)', () => {
  let container: StartedRabbitMQContainer;
  let connection: amqp.Connection;
  let channel: amqp.Channel;
  let publisher: OrderPublisher;

  beforeAll(async () => {
    // 1. Start a real RabbitMQ container.
    container = await new RabbitMQContainer('rabbitmq:3-management-alpine').start();

    // 2. Connect to it.
    connection = await amqp.connect(container.getAmqpUrl());
    channel = await connection.createChannel();

    // 3. Declare the test topology.
    await channel.assertExchange('orders', 'topic', { durable: false });
    await channel.assertQueue('orders.created', { durable: false });
    await channel.bindQueue('orders.created', 'orders', 'order.created');

    // 4. Create the publisher with the real channel.
    publisher = new OrderPublisher(channel);
  }, 60000);

  afterAll(async () => {
    await channel.close();
    await connection.close();
    await container.stop();
  });

  beforeEach(async () => {
    await channel.purgeQueue('orders.created');
  });

  it('publishes an order created message', async () => {
    const order = { id: 123, total: 99.99 };

    await publisher.publishOrderCreated(order);

    // Verify the message is in the queue.
    const queueInfo = await channel.checkQueue('orders.created');
    expect(queueInfo.messageCount).toBe(1);
  });

  it('publishes a message with the correct content', async () => {
    const order = { id: 456, total: 49.99 };

    await publisher.publishOrderCreated(order);

    // Consume the message and verify its content.
    const message = await new Promise<any>((resolve) => {
      channel.consume('orders.created', (msg) => {
        if (msg) {
          resolve(JSON.parse(msg.content.toString()));
          channel.ack(msg);
        }
      });
    });

    expect(message.id).toBe(456);
    expect(message.total).toBe(49.99);
  });
});

describe('OrderConsumer (integration with RabbitMQ)', () => {
  let container: StartedRabbitMQContainer;
  let connection: amqp.Connection;
  let channel: amqp.Channel;
  let consumer: OrderConsumer;
  let mockOrderService: { processOrder: jest.Mock };

  beforeAll(async () => {
    container = await new RabbitMQContainer('rabbitmq:3-management-alpine').start();
    connection = await amqp.connect(container.getAmqpUrl());
    channel = await connection.createChannel();

    // Declare the main queue with a DLQ.
    await channel.assertQueue('orders.queue', {
      durable: false,
      deadLetterExchange: '',
      deadLetterRoutingKey: 'orders.dlq',
    });
    await channel.assertQueue('orders.dlq', { durable: false });

    mockOrderService = {
      processOrder: jest.fn(),
    };

    consumer = new OrderConsumer(channel, mockOrderService);
  }, 60000);

  afterAll(async () => {
    await channel.close();
    await connection.close();
    await container.stop();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await channel.purgeQueue('orders.queue');
    await channel.purgeQueue('orders.dlq');
  });

  it('processes a valid message and acknowledges it', async () => {
    mockOrderService.processOrder.mockResolvedValue({ success: true });

    // Publish a valid message.
    channel.publish(
      '',
      'orders.queue',
      Buffer.from(JSON.stringify({ orderId: '123', userId: 'user-1' })),
      { contentType: 'application/json' },
    );

    // Start the consumer.
    await consumer.start('orders.queue');

    // Wait for processing.
    await new Promise((r) => setTimeout(r, 500));

    // Verify the service was called.
    expect(mockOrderService.processOrder).toHaveBeenCalledWith({
      orderId: '123',
      userId: 'user-1',
    });

    // Verify the message was acknowledged (queue is empty).
    const queueInfo = await channel.checkQueue('orders.queue');
    expect(queueInfo.messageCount).toBe(0);
  });

  it('rejects an invalid message to the dead-letter queue', async () => {
    // Publish an invalid message (missing required field).
    channel.publish(
      '',
      'orders.queue',
      Buffer.from(JSON.stringify({ userId: 'user-1' })), // missing orderId
      { contentType: 'application/json' },
    );

    // Start the consumer.
    await consumer.start('orders.queue');

    // Wait for the message to be rejected.
    await new Promise((r) => setTimeout(r, 500));

    // Verify the message is in the DLQ.
    const dlqInfo = await channel.checkQueue('orders.dlq');
    expect(dlqInfo.messageCount).toBe(1);
  });
});
      ` },
      keyTakeaways: [
        "Testcontainers for RabbitMQ spins up a real broker in Docker, catching routing, acknowledgment, and DLQ bugs that mocks cannot detect.",
        "Use `RabbitMQContainer` and `container.getAmqpUrl()` to start and connect to the container.",
        "Declare the test topology (exchange, queues, bindings, DLQ) in `beforeAll`.",
        "Purge queues between tests with `channel.purgeQueue()` in `beforeEach`.",
        "Test the dead-letter queue behavior — it is a RabbitMQ feature that mocks cannot simulate.",
        "Always close the channel and connection in `afterAll` to prevent hanging test processes.",
        "Use `durable: false` for test queues — durability is unnecessary and slows cleanup.",
      ],
      commonMistakes: [
        "<b>Not waiting for the consumer to process.</b> Consumers are asynchronous. After publishing, wait for processing to complete before asserting.",
        "<b>Not cleaning the queues between tests.</b> Messages leak between tests. Use `purgeQueue()` in `beforeEach`.",
        "<b>Not closing the connection.</b> An open AMQP connection keeps the test process alive. Always `await connection.close()` in `afterAll`.",
        "<b>Using `durable: true` for test queues.</b> Durable queues survive broker restarts and slow down cleanup. Use `durable: false` for tests.",
        "<b>Forgetting to declare the DLQ.</b> If the DLQ does not exist, messages routed to it are dropped. Always declare the DLQ in the test setup.",
        "<b>Assuming the container is ready immediately.</b> RabbitMQ takes time to start. Set a 60-second timeout for `beforeAll`.",
        "<b>Testing the consumer in isolation without a real broker.</b> A mock cannot test acknowledgment, redelivery, or DLQ routing. Use Testcontainers.",
      ],
      quiz: [
        {
          question: "Why is testing the dead-letter queue behavior important?",
          options: [
            "Because DLQs are deprecated.",
            "Because the DLQ is a RabbitMQ feature that mocks cannot simulate — only a real broker can route rejected messages to the DLQ.",
            "Because DLQs are faster than regular queues.",
            "Because DLQs are required by AMQP.",
          ],
          correctIndex: 1,
          explanation: "The DLQ behavior is entirely implemented by RabbitMQ. A mock cannot test that a rejected message is actually routed to the DLQ. Testcontainers gives you a real broker.",
        },
        {
          question: "What does `container.getAmqpUrl()` return for RabbitMQ?",
          options: [
            "A Docker container ID.",
            "An AMQP URL like `amqp://guest:guest@localhost:32768`.",
            "A JSON object with host and port.",
            "A file path.",
          ],
          correctIndex: 1,
          explanation: "`getAmqpUrl()` returns a full AMQP URL with the randomly assigned host port, ready to use with `amqplib` or any other AMQP client.",
        },
        {
          question: "Why should you purge queues between tests?",
          options: [
            "To make tests slower.",
            "To ensure each test runs against an empty queue, preventing messages from one test affecting another.",
            "Because RabbitMQ requires it.",
            "To save disk space.",
          ],
          correctIndex: 1,
          explanation: "Leftover messages from one test can cause another test to fail or pass for the wrong reasons. `purgeQueue()` in `beforeEach` ensures a clean slate.",
        },
        {
          question: "What is the correct way to clean up RabbitMQ connections after tests?",
          options: [
            "Delete the container.",
            "Call `channel.close()` and `connection.close()` in `afterAll`.",
            "Restart RabbitMQ.",
            "Ignore it — the process will exit.",
          ],
          correctIndex: 1,
          explanation: "An open AMQP connection keeps the test process alive. Always close the channel and connection in `afterAll` before stopping the container.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is Testcontainers?",
      options: [
        "A mocking library for Jest.",
        "A library that provides throwaway instances of databases, message brokers, and other services in Docker containers for integration testing.",
        "A database migration tool.",
        "A Docker orchestration platform.",
      ],
      correctIndex: 1,
      explanation: "Testcontainers spins up real services in Docker containers for tests, eliminating the gap between mocks and production behavior.",
    },
    {
      question: "Why is Testcontainers preferred over in-memory databases like SQLite?",
      options: [
        "Because SQLite is slower.",
        "Because SQLite has a different SQL dialect and lacks PostgreSQL-specific features, so tests can pass against SQLite but fail in production.",
        "Because SQLite cannot handle multiple connections.",
        "Because Testcontainers is easier to set up.",
      ],
      correctIndex: 1,
      explanation: "SQLite is not PostgreSQL. It has different types, constraints, and SQL support. Testing against SQLite gives false confidence.",
    },
    {
      question: "What does `container.getConnectionUri()` return for PostgreSQL?",
      options: [
        "A JSON object with host and port.",
        "A standard PostgreSQL connection string like `postgresql://user:pass@localhost:32768/db`.",
        "A Docker container ID.",
        "A file path.",
      ],
      correctIndex: 1,
      explanation: "`getConnectionUri()` returns a full connection string with the randomly assigned host port, ready to use with any PostgreSQL client or ORM.",
    },
    {
      question: "Why should you clean the database between tests?",
      options: [
        "To make tests slower.",
        "To ensure each test runs against a known, empty state, preventing data from one test affecting another.",
        "Because TypeORM requires it.",
        "To save disk space.",
      ],
      correctIndex: 1,
      explanation: "Leftover data from one test can cause another test to fail or pass for the wrong reasons. `TRUNCATE ... CASCADE` in `beforeEach` ensures a clean slate.",
    },
    {
      question: "What is the benefit of sharing a container across test files with Jest `globalSetup`?",
      options: [
        "It makes tests slower.",
        "It starts the container once for the entire test suite, reducing startup overhead and speeding up the test run.",
        "It prevents tests from running in parallel.",
        "It automatically generates test data.",
      ],
      correctIndex: 1,
      explanation: "Each container startup takes 2-10 seconds. A shared container started once in `globalSetup` is reused across all test files.",
    },
    {
      question: "Why should you test TTL behavior against real Redis instead of a mock?",
      options: [
        "Because mocks are slower.",
        "Because a mock cannot actually expire a key — it returns whatever you programmed, so it cannot catch unit errors (seconds vs. milliseconds) or TTL misconfigurations.",
        "Because Redis TTLs are unreliable.",
        "Because mocks do not support TTL.",
      ],
      correctIndex: 1,
      explanation: "A mock returns a value regardless of time. Only a real Redis server can actually expire a key.",
    },
    {
      question: "What does `container.getConnectionUrl()` return for Redis?",
      options: [
        "A Docker container ID.",
        "A Redis URL like `redis://localhost:32768`.",
        "A JSON object with host and port.",
        "A file path.",
      ],
      correctIndex: 1,
      explanation: "`getConnectionUrl()` returns a full Redis URL with the randomly assigned host port, ready to use with any Redis client.",
    },
    {
      question: "Why is testing Lua scripts against real Redis important?",
      options: [
        "Because Lua is deprecated.",
        "Because Lua scripts have syntax and logic bugs that mocks cannot catch — only real Redis can execute the script.",
        "Because Lua is slower than JavaScript.",
        "Because Redis cannot run without Lua.",
      ],
      correctIndex: 1,
      explanation: "A mock does not execute the Lua script. Only a real Redis server can compile and run it, catching syntax errors and logic bugs.",
    },
    {
      question: "Why is testing the dead-letter queue behavior important?",
      options: [
        "Because DLQs are deprecated.",
        "Because the DLQ is a RabbitMQ feature that mocks cannot simulate — only a real broker can route rejected messages to the DLQ.",
        "Because DLQs are faster than regular queues.",
        "Because DLQs are required by AMQP.",
      ],
      correctIndex: 1,
      explanation: "The DLQ behavior is entirely implemented by RabbitMQ. A mock cannot test that a rejected message is actually routed to the DLQ.",
    },
    {
      question: "What does `container.getAmqpUrl()` return for RabbitMQ?",
      options: [
        "A Docker container ID.",
        "An AMQP URL like `amqp://guest:guest@localhost:32768`.",
        "A JSON object with host and port.",
        "A file path.",
      ],
      correctIndex: 1,
      explanation: "`getAmqpUrl()` returns a full AMQP URL with the randomly assigned host port, ready to use with `amqplib` or any other AMQP client.",
    },
    {
      question: "Why should you purge queues between tests?",
      options: [
        "To make tests slower.",
        "To ensure each test runs against an empty queue, preventing messages from one test affecting another.",
        "Because RabbitMQ requires it.",
        "To save disk space.",
      ],
      correctIndex: 1,
      explanation: "Leftover messages from one test can cause another test to fail or pass for the wrong reasons. `purgeQueue()` in `beforeEach` ensures a clean slate.",
    },
    {
      question: "What is the correct way to clean up RabbitMQ connections after tests?",
      options: [
        "Delete the container.",
        "Call `channel.close()` and `connection.close()` in `afterAll`.",
        "Restart RabbitMQ.",
        "Ignore it — the process will exit.",
      ],
      correctIndex: 1,
      explanation: "An open AMQP connection keeps the test process alive. Always close the channel and connection in `afterAll` before stopping the container.",
    },
    {
      question: "What is the purpose of a wait strategy in Testcontainers?",
      options: [
        "To slow down tests.",
        "To ensure the container is fully initialized and ready to accept connections before tests run.",
        "To encrypt the container.",
        "To compress the container image.",
      ],
      correctIndex: 1,
      explanation: "Wait strategies prevent flaky 'connection refused' errors by waiting until the service inside the container is actually ready to accept connections.",
    },
    {
      question: "What is Ryuk in Testcontainers?",
      options: [
        "A test framework.",
        "A sidecar container that automatically cleans up resources (containers, volumes, networks) created by Testcontainers, even after abnormal termination.",
        "A database migration tool.",
        "A logging library.",
      ],
      correctIndex: 1,
      explanation: "Ryuk is Testcontainers' automatic cleanup mechanism. It ensures no leftover containers, volumes, or networks remain, even if the test process is killed.",
    },
  ],
  project: {
    name: "Write Integration Tests with Testcontainers for PostgreSQL, Redis, and RabbitMQ",
    goal:
      "Build a complete integration test suite for a NestJS application that uses PostgreSQL for persistence, Redis for caching and rate limiting, and RabbitMQ for asynchronous order processing. Use Testcontainers to spin up real instances of each service and verify that the application works end-to-end.",
    brief:
      "You have a NestJS order management API with three infrastructure dependencies: PostgreSQL for orders and users, Redis for caching and rate limiting, and RabbitMQ for publishing order events. Write integration tests that verify the full flow: create a user, place an order, verify it is persisted to PostgreSQL, verify the cache is used correctly, and verify that an order event is published to RabbitMQ and consumed by a worker. This is the kind of test suite that gives real confidence in production behavior.",
    steps: [
      "Create a NestJS project with `@nestjs/typeorm`, `pg`, `redis`, `amqplib`, `@nestjs/config`, and `@nestjs/bull` (or a custom RabbitMQ consumer). Add `testcontainers`, `@testcontainers/postgresql`, `@testcontainers/redis`, and `@testcontainers/rabbitmq` as dev dependencies.",
      "Define entities: `User` (id, email, name) and `Order` (id, userId, total, status). Configure TypeORM with `synchronize: true` for tests.",
      "Create a `CacheService` that wraps Redis with `get`, `set` (with TTL), and `del` methods.",
      "Create an `OrderPublisher` that publishes an `order.created` event to RabbitMQ.",
      "Create an `OrderConsumer` that consumes `order.created` messages, calls an `OrderService.processOrder()`, and acknowledges the message. Configure a DLQ for failed messages.",
      "Write a `test/setup.ts` file that starts all three containers (PostgreSQL, Redis, RabbitMQ) in `beforeAll` and stops them in `afterAll`. Export the connection details for use in test files.",
      "In the PostgreSQL test file, write tests that: create a user and verify persistence via a raw SQL query; attempt to create a duplicate email and verify the 409 response; create an order and verify the foreign key constraint.",
      "In the Redis test file, write tests that: store and retrieve a cached user; verify TTL expiration; test a rate limiter Lua script.",
      "In the RabbitMQ test file, write tests that: publish an order event and verify it is in the queue; consume the message and verify acknowledgment; publish an invalid message and verify it is routed to the DLQ.",
      "Add a `beforeEach` hook that truncates PostgreSQL tables, flushes Redis, and purges RabbitMQ queues to ensure test isolation.",
      "Configure Jest with `globalSetup` and `globalTeardown` to share the containers across test files.",
      "Run `npm test -- --testPathPattern=integration` and verify all tests pass.",
    ],
    acceptance: [
      "All integration tests pass against real PostgreSQL, Redis, and RabbitMQ containers.",
      "PostgreSQL tests verify data persistence, unique constraints, and foreign key enforcement.",
      "Redis tests verify cache storage, TTL expiration, and Lua script execution.",
      "RabbitMQ tests verify message publishing, consumption, acknowledgment, and DLQ routing.",
      "Test isolation is maintained: no data leaks between tests.",
      "Containers are shared across test files for speed.",
      "No mocks are used for PostgreSQL, Redis, or RabbitMQ in integration tests.",
    ],
    stretch: [
      "Add a test that verifies a transaction rolls back when the inventory update fails during order creation.",
      "Add a test that verifies the rate limiter blocks requests after the limit is exceeded, using a real Redis container.",
      "Add a test that verifies the consumer retries a failed message before sending it to the DLQ.",
      "Add a test that verifies the cache is invalidated when an order is updated.",
      "Add a test that verifies the consumer handles a broker disconnection and reconnects.",
      "Add a test that verifies the Redis cache and rate limiter use different key namespaces and do not collide.",
      "Create a `test/helpers/containers.ts` helper that starts all three containers and returns a combined configuration object, reducing boilerplate across test files.",
    ],
  },
};
