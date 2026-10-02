import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_57_LESSONS: LessonDay = {
  day: 57,
  title: "Redis + NestJS: Caching, Invalidations & Architecture",
  totalMinutes: 120,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-57-lesson-1",
      title: "Direct Redis Connection with ioredis and Custom Module",
      durationMinutes: 24,
      explanation: `<b>Establishing a Native Redis Pipeline in NestJS</b>

While framework wrappers exist for general caching, enterprise NestJS microservices frequently require low-level access to the full suite of Redis commands (\`HSET\`, \`ZADD\`, \`XADD\`, \`EVALSHA\`). To achieve maximum performance, flexibility, and control over connection pooling, we connect directly using \`ioredis\`.

\`\`\`text
┌────────────────────────────────────────────────────────┐
│                   NestJS Application                   │
│                                                        │
│   ┌───────────────────┐        ┌───────────────────┐   │
│   │   UsersService    │        │  ProductsService  │   │
│   └─────────┬─────────┘        └─────────┬─────────┘   │
└─────────────┼────────────────────────────┼─────────────┘
              │ @Inject(REDIS_CLIENT)      │
              ▼                            ▼
┌────────────────────────────────────────────────────────┐
│                  RedisModule (Global)                  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │    ioredis Instance (Connection & Pool State)    │  │
│  └──────────────────────────┬───────────────────────┘  │
└─────────────────────────────┼──────────────────────────┘
                              │ TCP Connection / TLS
                              ▼
┌────────────────────────────────────────────────────────┐
│                     Redis Server                       │
└────────────────────────────────────────────────────────┘
\`\`\`

<b>Why Create a Custom Dynamic Module?</b>

1. <b>Dependency Injection Integration</b>: Wrapping \`ioredis\` in a NestJS \`DynamicModule\` allows us to register it globally (\`@Global()\`), read configuration lazily via \`ConfigService\`, and inject it into any service using a custom symbol like \`REDIS_CLIENT\`.
2. <b>Lifecycle Hook Management</b>: By implementing \`OnApplicationShutdown\`, we guarantee that the ioredis client terminates gracefully (\`redis.quit()\`) during SIGTERM container deployments without dropping pending socket writes.
3. <b>Automated Reconnection & Error Resilience</b>: Configurable retry strategies prevent a temporary network hiccup or Redis Sentinel master promotion from crashing the Node.js process.`,
      diagram: `                  BOOTSTRAP & MODULE INITIALIZATION
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │  RedisModule.forRoot()│
                     └───────────┬───────────┘
                                 │
                     Reads host/port via ConfigService
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ Instantiate ioredis   │
                     └───────────┬───────────┘
                                 │
              ┌──────────────────┴──────────────────┐
              ▼                                     ▼
      [Success: Connected]                  [Failure: Retry]
     Register REDIS_CLIENT                 Trigger retryStrategy
      in DI Container                       (Exponential Backoff)`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/redis/redis.module.ts
import { Module, Global, DynamicModule, OnApplicationShutdown, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({})
export class RedisModule implements OnApplicationShutdown {
  private static redisClient: Redis;
  private static readonly logger = new Logger('RedisModule');

  static forRootAsync(): DynamicModule {
    const redisProvider = {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService): Redis => {
        const host = configService.get<string>('REDIS_HOST', 'localhost');
        const port = configService.get<number>('REDIS_PORT', 6379);
        const password = configService.get<string>('REDIS_PASSWORD');

        const options: RedisOptions = {
          host,
          port,
          password,
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
          retryStrategy(times) {
            const delay = Math.min(times * 200, 3000);
            RedisModule.logger.warn(\`Redis reconnect attempt #\${times} in \${delay}ms...\`);
            return delay;
          },
        };

        const client = new Redis(options);

        client.on('connect', () => RedisModule.logger.log('Connected to Redis instance.'));
        client.on('error', (err) => RedisModule.logger.error('Redis Client Error:', err));

        RedisModule.redisClient = client;
        return client;
      },
      inject: [ConfigService],
    };

    return {
      module: RedisModule,
      providers: [redisProvider],
      exports: [REDIS_CLIENT],
    };
  }

  async onApplicationShutdown(signal?: string) {
    if (RedisModule.redisClient) {
      RedisModule.logger.log(\`Closing Redis connections due to \${signal}...\`);
      await RedisModule.redisClient.quit();
    }
  }
}`,
      },
      keyTakeaways: [
        "Connecting via a custom NestJS dynamic module enables clean DI injection and configuration management.",
        "Use lifecycle hooks (\`OnApplicationShutdown\`) to gracefully call \`redis.quit()\` during deployment shutdowns.",
        "Implement an explicit \`retryStrategy\` to prevent unhandled connection drops from taking down the API server.",
        "A global module decorated with \`@Global()\` makes \`REDIS_CLIENT\` accessible across all domain modules without duplicate imports.",
      ],
      commonMistakes: [
        "<b>Instantiating multiple separate ioredis objects manually inside services.</b> Creating new \`new Redis()\` connections inside services exhausts server socket limits; always reuse a single client via DI.",
        "<b>Calling \`redis.disconnect()\` instead of \`redis.quit()\`.</b> Hard disconnections drop pending memory commands; \`quit()\` waits for active commands to finish before closing the TCP socket.",
      ],
      quiz: [
        {
          question: "Why is a custom Dynamic Module preferable over creating standalone 'new Redis()' instances inside each service?",
          options: [
            "Standalone instances cannot execute ioredis commands",
            "Dynamic modules centralize connection pooling, configuration management, and lifecycle teardown across NestJS DI",
            "NestJS prohibits third-party npm packages inside service files",
            "ioredis requires a NestJS controller to boot"
          ],
          correctIndex: 1,
          explanation: "Centralizing connection management via NestJS DI prevents socket leaks, manages lifecycle teardowns, and ensures configuration consistency."
        }
      ]
    },
    {
      id: "day-57-lesson-2",
      title: "NestJS CacheManager Integration and Redis Store",
      durationMinutes: 22,
      explanation: `<b>Standardizing Caching with NestJS CacheManager</b>

NestJS provides an abstract caching module (\`@nestjs/cache-manager\`) built on top of \`cache-manager\`. This abstraction allows developers to write caching code using standard methods (\`get\`, \`set\`, \`del\`) without coupling their domain logic directly to a specific caching vendor.

Under the hood, we pair \`@nestjs/cache-manager\` with \`cache-manager-ioredis-yet\` to store cache entries directly in Redis RAM.

\`\`\`text
┌────────────────────────────────────────────────────────┐
│                     NestJS Service                     │
└───────────────────────────┬────────────────────────────┘
                            │
               this.cacheManager.set(key, val)
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             @nestjs/cache-manager Layer                │
│    (Unified Abstract API: get / set / del / reset)     │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             cache-manager-ioredis-yet Store            │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                     Redis Server                       │
└────────────────────────────────────────────────────────┘
\`\`\`

<b>In-Memory Store vs Redis Store</b>

By default, NestJS \`CacheModule\` uses an in-memory (RAM) store isolated within the single Node.js process.
- <b>In-Memory Store</b>: Fast, but cache items are lost when the app restarts, and cache state is **not shared** across multiple API replica pods.
- <b>Redis Store</b>: Distributed cache state shared across all scaled application containers, persisting across container deployments.

<b>Global Cache Configuration</b>

Configuring \`CacheModule.registerAsync\` globally allows services to inject \`CACHE_MANAGER\` and use standard caching methods cleanly.`,
      diagram: `                  CACHE MANAGER ARCHITECTURE
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
  @Inject(CACHE_MANAGER)                 @UseInterceptors(
  this.cacheManager.get()                CacheInterceptor)
            │                                     │
            └──────────────────┬──────────────────┘
                               │
                               ▼
                   ┌──────────────────────┐
                   │ cache-manager Store  │
                   └───────────┬──────────┘
                               │
                 Translates to Redis Protocol
                               │
                               ▼
                   ┌──────────────────────┐
                   │     Redis Host       │
                   └──────────────────────┘`,
      codeExample: {
        title: "Code Example",
        code: `// src/app.module.ts
import { Module } from '@nestjs/common';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
          ttl: 60 * 1000, // Default TTL: 60 seconds (in milliseconds)
        });

        return {
          store: store as unknown as CacheStore,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}

// src/users/users.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getUserProfile(userId: string) {
    const cacheKey = \`user:profile:\${userId}\`;

    // 1. Read from distributed Redis cache
    const cachedProfile = await this.cacheManager.get(cacheKey);
    if (cachedProfile) {
      return cachedProfile;
    }

    // 2. Fallback to primary DB (e.g. Postgres)
    const userProfile = { id: userId, name: 'Alice', role: 'ADMIN' };

    // 3. Store in Redis cache with explicit 5-minute TTL (in ms)
    await this.cacheManager.set(cacheKey, userProfile, 300 * 1000);

    return userProfile;
  }
}`,
      },
      keyTakeaways: [
        "\`@nestjs/cache-manager\` abstracts caching operations away from concrete vendor SDKs.",
        "Use \`cache-manager-ioredis-yet\` to link NestJS CacheModule directly with a distributed Redis instance.",
        "Set \`isGlobal: true\` during \`CacheModule\` registration so \`CACHE_MANAGER\` is accessible everywhere.",
        "Note TTL unit changes: newer \`cache-manager\` versions use **milliseconds** for TTL values.",
      ],
      commonMistakes: [
        "<b>Assuming cache-manager TTL values are always in seconds.</b> In recent versions of \`cache-manager\` (v5+), TTL is specified in **milliseconds**; passing \`300\` sets a TTL of 300ms instead of 5 minutes!",
        "<b>Using the default in-memory CacheModule in production microservices.</b> In-memory caches are isolated per pod, causing inconsistent state across replica containers.",
      ],
      quiz: [
        {
          question: "What is the main advantage of using NestJS CacheModule configured with a Redis store over the default in-memory store?",
          options: [
            "Redis store automatically translates SQL queries into REST APIs",
            "Redis store shares cached state across all scaled backend pods and persists data across application restarts",
            "In-memory store cannot save JSON strings",
            "Redis store eliminates the need for TypeScript interfaces"
          ],
          correctIndex: 1,
          explanation: "A distributed Redis store enables all instances of a scaled application to access a unified, shared cache layer that survives restarts."
        }
      ]
    },
    {
      id: "day-57-lesson-3",
      title: "Distributed Caching Strategies & Interceptors",
      durationMinutes: 25,
      explanation: `<b>Automating HTTP Response Caching with Interceptors</b>

Manually writing \`cacheManager.get()\` and \`cacheManager.set()\` inside every service method creates repetitive boilerplate. NestJS provides a built-in **\`CacheInterceptor\`** that automatically caches HTTP \`GET\` response payloads transparently at the controller boundary.

\`\`\`text
Client HTTP GET /api/v1/products?category=electronics
                         │
                         ▼
             ┌───────────────────────┐
             │   CacheInterceptor    │
             └───────────┬───────────┘
                         │
           Check Redis for auto-generated key
           ("http_GET_/api/v1/products?category=electronics")
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
      [CACHE HIT]               [CACHE MISS]
   Return JSON Payload       Execute Controller Method
     Immediately (<2ms)      Fetch from PostgreSQL
                              │
                      Save Result to Redis
                              │
                     Return JSON Payload
\`\`\`

<b>Declarative Caching with Custom Metadata Decorators</b>

By overriding default interceptor behavior using \`@CacheKey()\` and \`@CacheTTL()\`, we can declaratively customize the cache key and expiration time for specific routes:

\`\`\`ts
@Get('featured')
@CacheKey('products_featured_list')
@CacheTTL(600 * 1000) // Cache for 10 minutes (in ms)
async getFeaturedProducts() {
  return this.productsService.findFeatured();
}
\`\`\`

<b>Cache Stampede (Thundering Herd) Mitigation</b>

A **Cache Stampede** occurs when a highly requested cache key expires under high traffic. Thousands of concurrent HTTP requests experience a cache miss simultaneously, hitting the primary database with identical queries and causing a server outage.

Strategies to mitigate Cache Stampedes:
1. <b>TTL Jitter</b>: Add random variance to key TTLs (e.g., $300\text{s} + \text{random}(0..30\text{s})$) to stagger expirations.
2. <b>Mutex / Request Coalescing</b>: Ensure only the first cache-miss request queries the database while subsequent concurrent requests wait for the result.`,
      diagram: `                    THUNDERING HERD (STAMPEDE) RISK
                               │
               Key "featured_products" Expires!
                               │
     ┌─────────────────────────┼─────────────────────────┐
     ▼                         ▼                         ▼
 Request #1               Request #2               Request #3
(Cache Miss)             (Cache Miss)             (Cache Miss)
     │                         │                         │
     └─────────────────────────┼─────────────────────────┘
                               │
                     All 3 Hit PostgreSQL!
                     (Database Overload)
                               │
                Mitigation: Request Coalescing
              Only #1 hits DB; #2 & #3 await #1`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/interceptors/custom-cache.interceptor.ts
import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Request } from 'express';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  /**
   * Customizes how cache keys are generated for HTTP requests.
   * Incorporates authenticated user roles and query parameters.
   */
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    const { httpAdapter } = this.httpAdapterHost;

    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    if (!isGetRequest) {
      return undefined; // Do not cache non-GET requests
    }

    const userRole = (request as any).user?.role || 'PUBLIC';
    const requestUrl = httpAdapter.getRequestUrl(request);

    // Creates cache key incorporating user role to prevent privilege leaks
    return \`http_cache:\${userRole}:\${requestUrl}\`;
  }
}

// src/products/products.controller.ts
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { HttpCacheInterceptor } from '../common/interceptors/custom-cache.interceptor';
import { ProductsService } from './products.service';

@Controller('products')
@UseInterceptors(HttpCacheInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('catalog')
  @CacheKey('catalog_static_page')
  @CacheTTL(120 * 1000) // 2 minutes (in ms)
  async getCatalog() {
    return this.productsService.findAll();
  }
}`,
      },
      keyTakeaways: [
        "NestJS \`CacheInterceptor\` automates caching for \`GET\` controller endpoints seamlessly.",
        "Customize caching behavior per endpoint using \`@CacheKey()\` and \`@CacheTTL()\` decorators.",
        "Incorporate user roles into HTTP cache keys to avoid serving cached administrative data to public users.",
        "Prevent Thundering Herd spikes by implementing request coalescing and adding randomized jitter to TTL expirations.",
      ],
      commonMistakes: [
        "<b>Caching responses without including authorization scope in the cache key.</b> If User A (Admin) visits \`/orders\` and the response is cached under a generic key, User B (Customer) might receive User A's cached response payload!",
        "<b>Applying CacheInterceptor to POST, PUT, or DELETE routes.</b> Interceptors should only cache idempotent read requests (\`GET\`).",
      ],
      quiz: [
        {
          question: "What security flaw occurs if an HTTP CacheInterceptor uses only the URL path as a cache key on protected routes?",
          options: [
            "PostgreSQL disables foreign key constraints",
            "Privileged data cached by an admin request could be served directly from cache to an unprivileged public user",
            "Redis throws a hard syntax exception",
            "The browser permanently blocks incoming WebSocket packets"
          ],
          correctIndex: 1,
          explanation: "If cache keys do not incorporate authorization scopes (e.g. user ID or role), different users requesting the same URL will receive each other's cached responses."
        }
      ]
    },
    {
      id: "day-57-lesson-4",
      title: "Cache Invalidation Strategies & Event-Driven Eviction",
      durationMinutes: 27,
      explanation: `<b>The Cache Invalidation Problem</b>

Phil Karlton famously said: *"There are only two hard things in Computer Science: cache invalidation and naming things."*

If your application updates a entity in PostgreSQL (e.g. updating a product price from \$100 to \$80) but fails to invalidate the corresponding Redis key, your API will continue serving the stale \$100 price until the TTL expires.

\`\`\`text
                  CACHE INVALIDATION WORKFLOW
                               │
               POST /api/v1/products (Price Change)
                               │
                               ▼
                   Update PostgreSQL Record
                               │
                               ▼
                  Trigger Invalidation Strategy
             ┌─────────────────┴─────────────────┐
             ▼                                   ▼
   Direct Cache Delete               Pub/Sub Event Broadcast
   (this.cache.del(key))             (Publish "cache:clear")
             │                                   │
             └─────────────────┬─────────────────┘
                               │
                               ▼
                    Redis Key(s) Purged
            (Next GET fetch receives fresh $80)
\`\`\`

<b>Cache Invalidation Patterns</b>

1. <b>Direct Invalidation (Inline Eviction)</b>: The service method performing the database update explicitly calls \`cacheManager.del(key)\` immediately after saving changes.
2. <b>Pattern-Based Invalidation (\`keys\` / \`scan\`)</b>: When clearing a collection of related keys (e.g., clearing \`products_page_1\`, \`products_page_2\`), search and delete matching key patterns.
   - <i>Warning</i>: Never use \`KEYS pattern*\` in production as it blocks the single-threaded Redis event loop. Use **\`SCAN\`** instead.
3. <b>Event-Driven Eviction</b>: Decouple domain services by emitting NestJS EventEmitter events (\`product.updated\`). An event handler listens for these events and manages cache purging asynchronously.
4. <b>Distributed Cache Invalidation via Redis Pub/Sub</b>: When backend nodes maintain local in-memory caches, emit a Redis Pub/Sub invalidation message so all API replica instances clear their local memory simultaneously.`,
      diagram: `                  EVENT-DRIVEN CACHE INVALIDATION
                               │
                  ProductsService.updateProduct()
                               │
                               ▼
               EventEmitter.emit('product.updated', id)
                               │
                               ▼
               ┌────────────────────────────────┐
               │    CacheInvalidationListener   │
               └───────────────┬────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     Purge Specific Key                 Scan & Del List Keys
   del("product:id:100")               scanDel("products_page_*")`,
      codeExample: {
        title: "Code Example",
        code: `// src/products/listeners/cache-invalidation.listener.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../common/redis/redis.module';

export class ProductUpdatedEvent {
  constructor(public readonly productId: string) {}
}

@Injectable()
export class CacheInvalidationListener {
  private readonly logger = new Logger(CacheInvalidationListener.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

  @OnEvent('product.updated')
  async handleProductUpdatedEvent(event: ProductUpdatedEvent) {
    this.logger.log(\`Handling cache invalidation for product: \${event.productId}\`);

    // 1. Evict specific item cache
    const itemKey = \`product:details:\${event.productId}\`;
    await this.cacheManager.del(itemKey);

    // 2. Scan and evict paginated list caches safely without blocking Redis
    await this.deleteKeysByPattern('http_cache:*products*');
  }

  /**
   * Uses non-blocking SCAN to purge keys matching a pattern safely.
   */
  private async deleteKeysByPattern(pattern: string): Promise<void> {
    let stream = this.redisClient.scanStream({
      match: pattern,
      count: 100,
    });

    stream.on('data', async (resultKeys: string[]) => {
      if (resultKeys.length > 0) {
        const pipeline = this.redisClient.pipeline();
        resultKeys.forEach((key) => pipeline.del(key));
        await pipeline.exec();
        this.logger.debug(\`Purged \${resultKeys.length} cached keys matching \${pattern}\`);
      }
    });

    stream.on('end', () => {
      this.logger.debug(\`Completed SCAN key purge for pattern: \${pattern}\`);
    });
  }
}`,
      },
      keyTakeaways: [
        "Invert cache dependencies by using NestJS \`EventEmitter\` to handle cache invalidations asynchronously.",
        "Never run the blocking \`KEYS *\` command in production Redis; use \`SCAN\` streams to iterate over matching keys safely.",
        "Group related write invalidations using Redis \`pipeline()\` to minimize network round-trips.",
        "Clear both specific entity keys (\`product:123\`) and list collection keys (\`products_page_*\`) on mutation.",
      ],
      commonMistakes: [
        "<b>Executing 'KEYS *' in production to invalidate caches.</b> \`KEYS\` performs an $O(N)$ synchronous scan over all keys in memory, freezing the Redis event loop for seconds.",
        "<b>Forgetting to purge paginated list caches when modifying a single item.</b> Updating an item's title cleans its detail cache, but catalog list pages will still show the old title.",
      ],
      quiz: [
        {
          question: "Why is using 'redisClient.scanStream()' superior to 'redisClient.keys()' when searching for keys to invalidate in production?",
          options: [
            "scanStream encrypts key names before deleting them",
            "scanStream iterates through memory incrementally without blocking the single-threaded Redis event loop",
            "keys() can only find up to 10 keys at a time",
            "scanStream automatically updates PostgreSQL tables"
          ],
          correctIndex: 1,
          explanation: "\`SCAN\` streams return key matches incrementally using cursors, keeping Redis responsive to incoming traffic instead of freezing the event loop like \`KEYS\`."
        }
      ]
    },
    {
      id: "day-57-lesson-5",
      title: "Advanced Redis Architecture: Redlock & Distributed State",
      durationMinutes: 22,
      explanation: `<b>Distributed Synchronization in Scaled NestJS Deployments</b>

When running a NestJS application across multiple instances, standard in-memory locks or local flags cannot prevent concurrent executions.

For example, if a scheduled cron job fires at midnight to generate billing invoices, every running API pod will trigger the cron job concurrently, resulting in duplicate billing. We prevent this by enforcing **Distributed Locks** using Redis.

\`\`\`text
                  DISTRIBUTED LOCK MUTEX
                               │
            Pod 1 and Pod 2 Trigger Scheduled Job
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     Pod 1 Tries Lock                      Pod 2 Tries Lock
   SET lock:billing NX EX 60             SET lock:billing NX EX 60
            │                                     │
            ▼                                     ▼
      [SUCCESS - OK]                       [FAILED - NIL]
   Executes Billing Job                  Aborts Job Execution
            │                                     │
    Releases Lock via                     Skips Processing
       Lua Script
\`\`\`

<b>The Redlock Algorithm for Fault-Tolerant Consensus</b>

For mission-critical applications where a single Redis master represents a single point of failure, we use the **Redlock Algorithm**. Redlock acquires locks across a majority ($N/2 + 1$) of independent Redis master instances, guaranteeing lock validity even if one Redis master node crashes.

<b>Safe Lock Release with Atomic Lua Scripts</b>

Releasing a lock requires an atomic **check-and-delete** token check. If a task takes longer than expected and its lock TTL expires, another pod acquires the lock. A simple \`DEL\` command from the first pod would mistakenly delete the second pod's active lock!

\`\`\`lua
-- Atomic Lock Release Lua Script
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
\`\`\``,
      diagram: `                   REDLOCK CONSENSUS FLOW
                               │
                   Acquire Lock "billing_job"
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
 Redis Master 1          Redis Master 2          Redis Master 3
   (Granted)               (Granted)               (Failed/Timeout)
       │                       │                       │
       └───────────────────────┼───────────────────────┘
                               │
                 Majority Acquired (2 / 3)
                   ==> Lock Granted!`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/redis/distributed-lock.service.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class DistributedLockService {
  private readonly logger = new Logger(DistributedLockService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  /**
   * Executes a critical operation guaranteed to run on only one node at a time.
   */
  async runWithLock<T>(
    lockKey: string,
    ttlSeconds: number,
    task: () => Promise<T>,
  ): Promise<T | null> {
    const lockValue = randomUUID(); // Unique owner token
    const fullKey = \`lock:\${lockKey}\`;

    // 1. Acquire lock using atomic SET NX EX
    const acquired = await this.redisClient.set(
      fullKey,
      lockValue,
      'EX',
      ttlSeconds,
      'NX',
    );

    if (acquired !== 'OK') {
      this.logger.warn(\`Could not acquire lock for \${lockKey}. Skipping task on this node.\`);
      return null;
    }

    this.logger.log(\`Lock acquired successfully for \${lockKey}. Token: \${lockValue}\`);

    try {
      // 2. Execute critical task
      return await task();
    } finally {
      // 3. Release lock safely using atomic Lua script token check
      await this.releaseLock(fullKey, lockValue);
    }
  }

  private async releaseLock(key: string, token: string): Promise<void> {
    const luaReleaseScript = \`
      if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
      else
          return 0
      end
    \`;

    try {
      await this.redisClient.eval(luaReleaseScript, 1, key, token);
      this.logger.log(\`Lock safely released for key: \${key}\`);
    } catch (err) {
      this.logger.error(\`Failed to release lock for key \${key}:\`, err);
    }
  }
}`,
      },
      keyTakeaways: [
        "Distributed locks prevent race conditions and duplicate executions across multi-node NestJS clusters.",
        "Acquire locks using atomic \`SET key token EX seconds NX\` commands.",
        "Always release locks using an atomic Lua script to verify that the lock token still belongs to the active process.",
        "Use Redlock across multiple independent Redis masters when building zero-downtime, fault-tolerant financial systems.",
      ],
      commonMistakes: [
        "<b>Releasing a distributed lock using a plain DEL command.</b> If the task runs longer than the TTL, the lock expires and another worker acquires it; a plain \`DEL\` will remove the new worker's lock.",
        "<b>Hardcoding static lock tokens.</b> Always generate unique UUID lock tokens so processes can verify lock ownership before releasing.",
      ],
      quiz: [
        {
          question: "What failure scenario occurs if a worker releases a distributed lock using 'DEL key' instead of a token-verifying Lua script?",
          options: [
            "PostgreSQL closes all open connection pools",
            "If the original task exceeded its TTL, plain DEL accidentally deletes a new lock acquired by a second worker",
            "Redis Cluster fails over to a replica",
            "NestJS DI container throws a circular dependency exception"
          ],
          correctIndex: 1,
          explanation: "If Task A exceeds its TTL, its lock expires and Task B acquires a new lock. If Task A finishes and executes plain \`DEL\`, it destroys Task B's lock prematurely."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "Why should production NestJS applications register a graceful shutdown handler for ioredis?",
      options: [
        "To compile TypeScript code before server exit",
        "To allow in-flight memory writes to complete and gracefully close TCP sockets via redis.quit() during container redeployments",
        "To flush all cached data from RAM automatically",
        "To disable NestJS CacheInterceptor"
      ],
      correctIndex: 1,
      explanation: "Calling \`redis.quit()\` during lifecycle shutdown hooks flushes buffered commands and closes sockets cleanly without dropping data."
    },
    {
      question: "Which TTL unit is expected by recent versions of cache-manager (v5+)?",
      options: ["Seconds", "Milliseconds", "Minutes", "Microseconds"],
      correctIndex: 1,
      explanation: "Recent versions of cache-manager specify TTL parameters in milliseconds."
    },
    {
      question: "What is the primary function of NestJS HttpCacheInterceptor?",
      options: [
        "To encrypt HTTP response payloads",
        "To automatically cache controller GET response payloads transparently using configured cache stores",
        "To validate incoming DTO bodies",
        "To enforce rate limiting thresholds"
      ],
      correctIndex: 1,
      explanation: "HttpCacheInterceptor intercepts GET requests, serving cached response payloads from Redis when hits occur."
    },
    {
      question: "Why is 'KEYS *' prohibited in production Redis environments?",
      options: [
        "It deletes all stored dataset keys",
        "It performs a synchronous O(N) scan that freezes the single-threaded Redis event loop",
        "It requires root operating system access",
        "It is not supported by ioredis"
      ],
      correctIndex: 1,
      explanation: "\`KEYS *\` blocks the single-threaded event loop while scanning memory, freezing all concurrent requests."
    },
    {
      question: "Which Redis command option enforces 'Set if Not Exists' when creating distributed locks?",
      options: ["XX", "NX", "EXI", "RAW"],
      correctIndex: 1,
      explanation: "The \`NX\` flag guarantees that \`SET\` succeeds only if the key does not already exist."
    },
    {
      question: "How can you decouple NestJS domain mutation logic from cache purging routines?",
      options: [
        "By placing Redis calls directly inside TypeORM entity decorators",
        "By emitting domain events via NestJS EventEmitter and handling purges asynchronously in an event listener",
        "By disabling database transactions",
        "By running Redis inside the browser"
      ],
      correctIndex: 1,
      explanation: "Emitting domain events allows listeners to handle invalidations asynchronously without coupling domain services to cache logic."
    },
    {
      question: "What is the purpose of adding 'jitter' (randomized variance) to cache TTL expirations?",
      options: [
        "To encrypt cached payloads",
        "To prevent Thundering Herd spikes where thousands of keys expire simultaneously and overload the database",
        "To bypass NestJS ValidationPipe",
        "To reduce RAM usage in ioredis"
      ],
      correctIndex: 1,
      explanation: "Jitter staggers key expirations over time, preventing simultaneous cache misses from overwhelming primary databases."
    }
  ],
  project: {
    name: "Enterprise Distributed Caching & Invalidation Architecture",
    goal: "Build a high-performance NestJS application featuring direct ioredis module integration, abstract CacheManager HTTP interceptors, event-driven non-blocking cache invalidations, and Redlock distributed mutex execution.",
    brief: "Construct an enterprise-grade Caching Architecture in NestJS. Implement a custom dynamic RedisModule wrapping ioredis, integrate CacheModule with cache-manager-ioredis-yet, create a role-aware HttpCacheInterceptor, build a non-blocking SCAN cache invalidation listener using NestJS EventEmitter, and protect scheduled tasks across cluster nodes using distributed locking.",
    steps: [
      "Create a global dynamic RedisModule configured with custom ioredis options and graceful lifecycle hooks.",
      "Configure CacheModule globally using cache-manager-ioredis-yet and environment variables.",
      "Build a custom HttpCacheInterceptor that incorporates user roles into cache keys to prevent privilege leaks.",
      "Implement a ProductsModule with GET routes decorated for caching (@CacheKey, @CacheTTL).",
      "Develop a non-blocking event listener using EventEmitter and redisClient.scanStream() to purge cache patterns safely upon product mutations.",
      "Build a DistributedLockService using atomic SET NX EX and Lua scripts to manage multi-pod scheduled tasks.",
      "Write integration tests validating cache hits, role-isolated keys, non-blocking SCAN purges, and lock exclusions."
    ],
    acceptance: [
      "Cache hits respond in under 2ms directly from Redis RAM.",
      "Cache keys incorporate user role metadata to protect sensitive payload views.",
      "Product updates trigger event-driven purges using SCAN streams without using blocking 'KEYS *' commands.",
      "Distributed lock prevents duplicate concurrent execution across test instances."
    ],
    stretch: [
      "Implement Pub/Sub channel listeners to synchronize in-memory L1 caches across scaled API pods.",
      "Expose Prometheus metrics tracking cache hit rates (keyspace_hits vs keyspace_misses)."
    ]
  }
};