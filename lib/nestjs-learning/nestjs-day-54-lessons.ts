import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_54_LESSONS: LessonDay = {
  day: 54,
  title: "Caching",
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-54-lesson-1",
      title: "Cache Fundamentals and Cache-Aside",
      durationMinutes: 20,
      explanation: `
<b>Imagine your e-commerce homepage.</b> Every visitor loads the same product listing: the top 20 featured products. Your database query joins products, categories, and inventory, then sorts by a computed score. It takes 80 milliseconds. At 100 requests per second, that is 8 seconds of database work every second — fine. At 1,000 requests per second, it is 80 seconds of database work per second. The database collapses.

The products have not changed in the last 30 seconds. The query result is identical for every visitor. You are doing the same expensive work over and over for no reason. This is the problem <b>caching</b> solves. Store the result of an expensive operation in a fast store, and reuse it until the underlying data changes.

<b>A cache is a temporary, fast storage layer between your application and the source of truth.</b> The source of truth is your database. The cache is a copy of recently accessed data, stored in memory (Redis, Memcached) or in the application process (in-memory). Reading from a cache takes 1-2 milliseconds; reading from a database takes 10-100 milliseconds. For hot data accessed thousands of times per second, that difference is the entire game.

<b>Why does caching exist?</b> Because the same data is read far more often than it changes. This is the <b>read-heavy workload</b> pattern. A product's description, a user's profile, a configuration value, a leaderboard — these are read constantly and written rarely. Caching exploits this asymmetry: pay the cost of the expensive read once, serve it cheaply many times.

<b>When should you cache?</b>
- Data that is read frequently and written rarely.
- Expensive computations (aggregations, joins, external API calls).
- Data that can tolerate slight staleness (a few seconds or minutes old).
- Data whose source of truth is slow or rate-limited.

<b>When should you NOT cache?</b>
- Data that must be perfectly fresh (account balances, real-time inventory for checkout).
- Data that is unique per request with no reuse (a personalized feed with random ordering).
- Data that is written far more often than it is read (caching adds overhead without benefit).
- Data that is cheap to fetch (a simple indexed lookup).

<b>Cache-Aside (Lazy Loading)</b> is the most common caching pattern. The application manages the cache directly:

1. On read: check the cache first.
2. If the value is in the cache (a <b>hit</b>), return it.
3. If not (a <b>miss</b>), read from the database.
4. Store the result in the cache for next time.
5. Return the result.

\`\`\`typescript
async getProduct(id: number) {
  const cacheKey = \`product:\${id}\`;

  // 1. Check cache
  const cached = await this.cache.get(cacheKey);
  if (cached) return cached; // Hit

  // 2-3. Miss: fetch from database
  const product = await this.productRepo.findOneBy({ id });
  if (!product) return null;

  // 4. Store in cache with TTL
  await this.cache.set(cacheKey, product, 300_000); // 5 minutes

  // 5. Return
  return product;
}
\`\`\`

<b>Why cache-aside is the default choice:</b> it is simple, it only caches data that is actually requested (no wasted memory on cold data), and it works with any cache store. It also fails gracefully: if the cache is down, the application still works by falling back to the database.

<b>On writes, cache-aside leaves the cache stale.</b> The pattern above only handles reads. When a product is updated, the cached copy is now wrong until the TTL expires. There are two approaches:
- <b>Invalidate on write:</b> after updating the database, delete the cache key. Next read repopulates it.
- <b>Do nothing:</b> let the TTL expire naturally. Accepts a window of staleness.

Deletion is usually preferred over updating the cache directly, because it avoids race conditions and keeps the write path simple.

\`\`\`typescript
async updateProduct(id: number, data: UpdateProductDto) {
  await this.productRepo.update(id, data);
  await this.cache.del(\`product:\${id}\`); // Invalidate
  return this.getProduct(id); // Optional: repopulate
}
\`\`\`

<b>What can go wrong?</b>
- <b>Stale data.</b> The cache returns old data after a write. Users see outdated prices or inventory. Invalidate on write or use short TTLs.
- <b>Cache penetration.</b> A client requests a non-existent key repeatedly. Every request misses the cache and hits the database. Fix: cache the "not found" result for a short TTL, or use a bloom filter.
- <b>Cache stampede (thundering herd).</b> A hot key expires, and 100 concurrent requests all miss and hit the database simultaneously. Fix: use a lock, or probabilistic early expiration (covered in lesson 3).
- <b>Cache avalanche.</b> Many keys expire at the same moment, causing a spike of database load. Fix: add jitter to TTLs.
- <b>Unbounded cache growth.</b> Without TTLs or eviction policies, the cache consumes all available memory. Set TTLs and configure eviction.
- <b>Caching null or undefined.</b> If the database returns null and you cache it, all subsequent reads get null even after the record is created. Invalidate on create, or cache nulls with short TTLs.
- <b>Serialization overhead.</b> Storing complex objects in Redis requires JSON serialization. For very large objects, the serialization cost can outweigh the cache benefit.

<b>How this appears in a real application:</b> a product listing page caches the top 20 featured products under a single key with a 30-second TTL. A product detail page caches individual products under \`product:{id}\` with a 5-minute TTL and invalidates on update. A user profile caches under \`user:{id}\` with a 10-minute TTL. Each cache entry has a TTL that reflects how quickly the data changes and how much staleness the business can tolerate.

<b>How experienced engineers think:</b> caching is not a magic wand. It is a trade-off: memory for speed, freshness for throughput. Every cached value has a TTL, and every write has an invalidation strategy. The question is never "should we cache?" but "what is the TTL, what is the invalidation trigger, and what happens when the cache is wrong?"
      `,
      diagram: `
Cache-Aside (Lazy Loading) Flow

  Read request
      |
      v
  +-------------+
  |  Cache      |
  |  GET key    |
  +-------------+
      |
      +-- HIT ---> return value (1-2ms)
      |
      +-- MISS --> fetch from Database (10-100ms)
                      |
                      v
                  +-------------+
                  |  Database   |
                  +-------------+
                      |
                      v
                  Store in cache with TTL
                      |
                      v
                  return value

Write request
      |
      v
  +-------------+
  |  Database   |  UPDATE
  +-------------+
      |
      v
  +-------------+
  |  Cache      |  DELETE key (invalidate)
  +-------------+
      |
      v
  Next read repopulates the cache (lazy)

TTL Strategy:
  product:{id}     -> 5 minutes, invalidate on update
  featured:top20   -> 30 seconds, no invalidation (short TTL)
  user:{id}        -> 10 minutes, invalidate on update
      `,
      codeExample: { title: "Example", code: `
// ============================================
// CACHE-ASIDE PATTERN IN NESTJS
// ============================================

// ---------- 1. Basic CacheService wrapper ----------
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    // cache-manager v6 returns null for misses; v5 returned undefined.
    // Treat both as a miss.
    const value = await this.cache.get<T>(key);
    return value ?? undefined;
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    await this.cache.set(key, value, ttlMs);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlMs: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) return cached;

    const value = await fetchFn();
    if (value !== undefined && value !== null) {
      await this.set(key, value, ttlMs);
    }
    return value;
  }
}

// ---------- 2. Product service using cache-aside ----------
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly cache: CacheService,
  ) {}

  async findOne(id: number): Promise<Product | null> {
    const cacheKey = \`product:\${id}\`;
    const TTL = 5 * 60 * 1000; // 5 minutes

    return this.cache.getOrSet(
      cacheKey,
      () => this.productRepo.findOneBy({ id }),
      TTL,
    );
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    await this.productRepo.update(id, data);

    // Invalidate: next read repopulates from DB.
    await this.cache.del(\`product:\${id}\`);

    // Return fresh data.
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productRepo.delete(id);
    await this.cache.del(\`product:\${id}\`);
  }

  // Caching a list with a short TTL (no per-item invalidation).
  async findFeatured(): Promise<Product[]> {
    const cacheKey = 'products:featured:top20';
    const TTL = 30 * 1000; // 30 seconds

    return this.cache.getOrSet(
      cacheKey,
      () => this.productRepo.find({
        where: { isFeatured: true },
        order: { score: 'DESC' },
        take: 20,
      }),
      TTL,
    );
  }
}

// ---------- 3. Controller ----------
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(Number(id));
  }
}

// ---------- 4. Module setup ----------
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60 * 1000, // default 1 minute
      isGlobal: true,
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, CacheService],
})
export class ProductsModule {}

// ---------- 5. Common pitfalls in code ----------
// Pitfall 1: caching null and never invalidating on create.
//   If you cache \`null\` for product:999 because it does not exist,
//   and later the product is created, the cache still returns null
//   until the TTL expires. Either invalidate on create or use a short TTL.

// Pitfall 2: using a fixed TTL for a hot key.
//   All instances repopulate the cache at the same second.
//   Add jitter (see lesson 3).

// Pitfall 3: forgetting to invalidate related keys.
//   Updating a product should invalidate product:{id}, but also
//   products:featured:top20 if the product is featured.
      ` },
      keyTakeaways: [
        "A cache stores recently accessed data in a fast layer between the application and the database.",
        "Caching exploits read-heavy workloads: read often, write rarely, tolerate slight staleness.",
        "Cache-aside is the default pattern: check cache, on miss fetch from DB, store in cache, return.",
        "Invalidate the cache on writes (delete the key) to avoid serving stale data.",
        "Set a TTL on every cache entry; without TTLs, the cache grows without bound.",
        "Beware of cache penetration, stampede, and avalanche — each has a specific mitigation.",
        "Not all data should be cached: perfectly fresh data, unique-per-request data, and cheap queries should skip caching.",
      ],
      commonMistakes: [
        "<b>Never invalidating on write.</b> The cache returns stale data after an update. Users see outdated prices or inventory. Delete the key on write.",
        "<b>Caching null/undefined without a plan.</b> If the DB returns null and you cache it, every read returns null even after the record is created. Invalidate on create or use a short TTL for misses.",
        "<b>No TTL on cache entries.</b> The cache consumes all available memory. Every entry needs a TTL or an explicit eviction strategy.",
        "<b>Using a fixed TTL for many keys.</b> All keys expire at the same second, causing a database load spike (cache avalanche). Add jitter.",
        "<b>Ignoring serialization cost.</b> Storing very large objects in Redis means large JSON strings and high CPU for serialize/deserialize. Cache smaller projections or use a hash structure.",
        "<b>Caching personal data with a global key.</b> If you cache \`user:profile\` without the user id, every user sees the same data. Always include the identity in the key.",
        "<b>Assuming the cache is always available.</b> If Redis is down, cache-aside falls back to the database. Ensure your code handles cache errors gracefully (catch and continue).",
      ],
      quiz: [
        {
          question:
            "In the cache-aside pattern, what happens on a cache miss?",
          options: [
            "The request fails.",
            "The application fetches from the database, stores the result in the cache, and returns it.",
            "The cache is cleared.",
            "The database is queried on every subsequent request.",
          ],
          correctIndex: 1,
          explanation:
            "Cache-aside (lazy loading) on a miss: fetch from the source of truth, store the result in the cache for next time, and return the value. Subsequent reads are served from the cache.",
        },
        {
          question:
            "Why is deleting the cache key on write often preferred over updating it?",
          options: [
            "Because deletion is faster.",
            "Because updating the cache can introduce race conditions and requires the writer to know the correct cached shape; deletion is simpler and the next read repopulates it.",
            "Because Redis does not support updates.",
            "Because deletion uses less memory.",
          ],
          correctIndex: 1,
          explanation:
            "Deleting on write is simpler and safer. The next read repopulates the cache with fresh data. Updating the cache on write requires serializing the new value and can race with concurrent reads/writes.",
        },
        {
          question:
            "What is the cache penetration problem?",
          options: [
            "The cache is too small.",
            "A client repeatedly requests a non-existent key, causing every request to miss the cache and hit the database.",
            "The cache returns stale data.",
            "The cache server crashes.",
          ],
          correctIndex: 1,
          explanation:
            "Cache penetration: requests for keys that do not exist (and therefore are never cached) bypass the cache and hit the database every time. Fix by caching the miss with a short TTL or using a bloom filter.",
        },
        {
          question:
            "Which data is a poor fit for caching?",
          options: [
            "A product catalog that changes hourly.",
            "A user's account balance that must be exact in real time.",
            "A configuration value that is read constantly.",
            "A leaderboard that updates every minute.",
          ],
          correctIndex: 1,
          explanation:
            "Data that must be perfectly fresh — like account balances used for financial decisions — should not be served from a cache with any TTL. The cost of staleness is too high.",
        },
      ],
    },
    {
      id: "day-54-lesson-2",
      title: "Read-Through and Write-Through Caching",
      durationMinutes: 20,
      explanation: `
<b>Cache-aside works, but it puts the caching logic in every service method.</b> Every \`findOne\`, \`findAll\`, and \`update\` must remember to check the cache, handle misses, and invalidate on writes. One forgotten \`del\` call means stale data forever. In a large codebase, this is a recipe for inconsistency.

<b>Read-through and write-through caching move the caching logic into the cache layer itself.</b> The application talks to a cache abstraction that knows how to fetch from the database when needed and how to keep itself in sync on writes. This centralizes the caching policy and reduces the chance of human error.

<b>Read-Through.</b> The application always reads from the cache. If the value is missing, the cache itself loads it from the database (using a configured loader function), stores it, and returns it. The application never talks to the database directly for reads.

\`\`\`
Application -> Cache.get(key)
                |
                +-- Hit -> return value
                |
                +-- Miss -> Cache calls loader(key)
                              |
                              v
                           Database
                              |
                              v
                           Cache stores result
                              |
                              v
                           return value
\`\`\`

The difference from cache-aside is who owns the loading logic. In cache-aside, the application does: \`if miss, fetch from DB\`. In read-through, the cache does it internally via a loader callback.

\`\`\`typescript
// Read-through: the cache owns the loading logic.
const product = await this.cache.wrap(
  \`product:\${id}\`,
  () => this.productRepo.findOneBy({ id }),
  300_000,
);
\`\`\`

<b>Write-Through.</b> On writes, the application writes to the cache, and the cache writes to the database synchronously. The cache is always in sync with the database (for writes that go through it).

\`\`\`
Application -> Cache.set(key, value)
                |
                v
              Cache writes to Database
                |
                v
              Cache stores value
                |
                v
              return success
\`\`\`

The write is not complete until both the cache and the database have the new value. This means reads immediately after a write see the new value — no staleness window.

\`\`\`typescript
// Write-through: cache and database stay in sync.
async updateProduct(id: number, data: UpdateProductDto) {
  const updated = await this.productRepo.save({ id, ...data });
  await this.cache.set(\`product:\${id}\`, updated, 300_000);
  return updated;
}
\`\`\`

<b>Write-Behind (Write-Back).</b> A variant where the application writes to the cache, and the cache asynchronously writes to the database later (batched or on a schedule). This is faster for the application but risks data loss if the cache fails before flushing. Rarely used in NestJS applications; more common in specialized systems.

<b>Why use read-through and write-through?</b>
- <b>Consistency.</b> Write-through ensures the cache is never stale after a write.
- <b>Simplicity.</b> The caching logic lives in one place (the cache wrapper), not scattered across services.
- <b>Correctness.</b> Developers cannot forget to invalidate or update the cache on write if the write path always goes through the cache.

<b>When should you use them?</b>
- When data is written frequently and reads must be immediately consistent after writes.
- When you have a reusable cache wrapper or library that enforces the pattern.
- When the cost of stale data is high (e.g. user profile that the user just updated).

<b>When should you NOT use write-through?</b>
- When writes are rare and cache invalidation (cache-aside) is sufficient.
- When the write path involves complex transactions or multiple tables — writing to cache synchronously adds latency and complexity.
- When the cache is not the primary access path for all data (mixed patterns cause confusion).

<b>The trade-off: write-through adds latency.</b> Every write now touches two systems: the database and the cache. If the cache write fails, what happens? You have a decision:
- <b>Fail the write:</b> if the cache cannot be updated, the whole write fails. Strong consistency, but the cache becomes a single point of failure.
- <b>Log and continue:</b> write to the database, log the cache failure, and let the TTL handle eventual consistency. More resilient, but briefly inconsistent.

Most production systems choose the second approach. The cache is a performance optimization, not the source of truth. If it fails, the database still has the correct data, and the next read repopulates the cache (if using read-through) or the TTL expires (if using cache-aside).

<b>Combining read-through and write-through:</b> the ideal setup for data that must be immediately consistent after writes:

\`\`\`typescript
async updateProduct(id: number, data: UpdateProductDto) {
  // Write through: update DB and cache together.
  const updated = await this.productRepo.save({ id, ...data });
  await this.cache.set(\`product:\${id}\`, updated, 300_000);
  return updated;
}

async getProduct(id: number) {
  // Read through: cache loads on miss.
  return this.cache.wrap(
    \`product:\${id}\`,
    () => this.productRepo.findOneBy({ id }),
    300_000,
  );
}
\`\`\`

<b>What can go wrong?</b>
- <b>Write-through latency.</b> Every write pays for a cache round-trip. For write-heavy workloads, this can be a bottleneck.
- <b>Cache failure on write.</b> If the cache is down, writes may fail or need a fallback path. Decide the policy: fail the write or continue with the database only.
- <b>Partial write-through.</b> If the database write succeeds but the cache write fails, the cache is stale. TTL will eventually fix it, but reads in the meantime are wrong.
- <b>Read-through loader errors.</b> If the loader function throws, the cache must propagate the error. Do not swallow it.
- <b>Serialization differences.</b> The cache may serialize the object (e.g. Date becomes string). Readers get a slightly different shape than direct DB reads. Normalize or accept the difference.
- <b>Over-caching.</b> Write-through on data that is written often and read rarely adds overhead without benefit. Cache-aside with short TTL is better for that case.

<b>How this appears in a real application:</b> a user profile service uses read-through for \`user:{id}\` with a loader that queries the database. On \`PUT /users/me\`, the service uses write-through: it saves to the database, then updates the cache key. A user who updates their profile and immediately refreshes the page sees the new data because the cache was updated synchronously. For less critical data (featured products, categories), the service uses cache-aside with short TTLs, because the cost of brief staleness is acceptable and write-through would add unnecessary latency.

<b>How experienced engineers think:</b> read-through and write-through are about centralizing caching policy. They are not always the right choice — cache-aside is simpler and sufficient for most cases. Use write-through when the consistency guarantee is worth the extra write latency. Use read-through when you want to prevent the "forgot to populate the cache" bug.
      `,
      diagram: `
Read-Through vs Write-Through

READ-THROUGH
  Application -> Cache.wrap(key, loader)
                    |
                    +-- Hit -> return cached
                    |
                    +-- Miss -> loader() -> DB
                                    |
                                    v
                                 cache result
                                    |
                                    v
                                 return value

WRITE-THROUGH
  Application -> Cache.set(key, value)
                    |
                    v
                  Database UPDATE
                    |
                    v
                  Cache stores value
                    |
                    v
                  return success

  Reads after write hit the cache and see the new value immediately.

COMPARISON
  Pattern          | Cache owns loading? | Write path              | Consistency
  -----------------|---------------------|-------------------------|-------------
  Cache-Aside      | No (app does it)    | App invalidates cache   | TTL window
  Read-Through     | Yes (loader)        | App invalidates cache   | TTL window
  Write-Through    | Optional            | App writes both         | Immediate
  Write-Behind     | Optional            | Cache writes async      | Eventual
      `,
      codeExample: { title: "Example", code: `
// ============================================
// READ-THROUGH & WRITE-THROUGH IN NESTJS
// ============================================

// ---------- 1. Cache service with wrap (read-through) ----------
@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  /**
   * Read-through: get from cache, or run the loader and cache the result.
   */
  async wrap<T>(
    key: string,
    loader: () => Promise<T>,
    ttlMs: number,
  ): Promise<T> {
    const cached = await this.cache.get<T>(key);
    if (cached !== undefined && cached !== null) {
      return cached;
    }

    const value = await loader();
    if (value !== undefined && value !== null) {
      await this.cache.set(key, value, ttlMs);
    }
    return value;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const v = await this.cache.get<T>(key);
    return v ?? undefined;
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    await this.cache.set(key, value, ttlMs);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }
}

// ---------- 2. User service: read-through + write-through ----------
@Injectable()
export class UsersService {
  private readonly TTL = 10 * 60 * 1000; // 10 minutes

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly cache: CacheService,
  ) {}

  // READ-THROUGH: cache loads on miss via the loader function.
  async findById(id: number): Promise<User | null> {
    return this.cache.wrap(
      \`user:\${id}\`,
      () => this.userRepo.findOneBy({ id }),
      this.TTL,
    );
  }

  // WRITE-THROUGH: update DB and cache together.
  async updateProfile(id: number, data: UpdateProfileDto): Promise<User> {
    // 1. Write to the database (source of truth).
    await this.userRepo.update(id, data);
    const updated = await this.userRepo.findOneByOrFail({ id });

    // 2. Write to the cache synchronously.
    // If the cache write fails, log it but do not fail the request.
    try {
      await this.cache.set(\`user:\${id}\`, updated, this.TTL);
    } catch (err) {
      // Cache is a performance layer, not the source of truth.
      // Log the failure and continue. The TTL will eventually
      // force a reload, or a future write-through will update it.
      console.error(\`Cache write failed for user:\${id}\`, err);
    }

    return updated;
  }
}

// ---------- 3. Hybrid: read-through for reads, cache-aside for writes ----------
// Sometimes you want read-through for reads but do NOT want
// the extra cache write latency on writes. In that case, invalidate.
@Injectable()
export class HybridService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly cache: CacheService,
  ) {}

  // Read-through: automatic population.
  async getProduct(id: number): Promise<Product | null> {
    return this.cache.wrap(
      \`product:\${id}\`,
      () => this.productRepo.findOneBy({ id }),
      5 * 60 * 1000,
    );
  }

  // Cache-aside on write: invalidate, do not update the cache.
  async updateProduct(id: number, data: UpdateProductDto) {
    await this.productRepo.update(id, data);
    await this.cache.del(\`product:\${id}\`);
    // Next read repopulates via read-through.
    return this.getProduct(id);
  }
}

// ---------- 4. Handling loader errors in read-through ----------
async wrapSafe<T>(key: string, loader: () => Promise<T>, ttlMs: number) {
  try {
    const cached = await this.cache.get<T>(key);
    if (cached !== undefined && cached !== null) return cached;

    const value = await loader();
    // If loader returns null, cache it briefly to prevent penetration.
    await this.cache.set(key, value ?? null, ttlMs);
    return value;
  } catch (err) {
    // Do not swallow loader errors; propagate to the caller.
    // Optionally log the cache miss/failure for observability.
    throw err;
  }
}

// ---------- 5. When write-through is not worth it ----------
// Write-through adds a cache round-trip to every write.
// For write-heavy endpoints, this can dominate the write latency.
// Example: an audit log endpoint that writes 1000 rows per second.
// Caching those rows is pointless (they are rarely read individually),
// and write-through would triple the write latency.
//
// Rule: use write-through when reads after writes must be immediately
// consistent and the write rate is moderate.
      ` },
      keyTakeaways: [
        "Read-through puts the loading logic inside the cache: on a miss, the cache calls a loader and stores the result.",
        "Write-through writes to the cache and database synchronously, so reads after a write see the new value immediately.",
        "Write-behind batches asynchronous writes to the database; risks data loss if the cache fails before flushing.",
        "Write-through adds a cache round-trip to every write — use it only when immediate read-after-write consistency matters.",
        "Handle cache write failures gracefully: log and continue, because the database is the source of truth.",
        "Read-through prevents the 'forgot to populate the cache' bug by centralizing the loading logic.",
        "Cache-aside is simpler and sufficient for most cases; use read-through/write-through when consistency justifies the complexity.",
      ],
      commonMistakes: [
        "<b>Failing the write when the cache is down.</b> The cache is a performance layer, not the source of truth. If the cache write fails, log it and let the database serve reads. Do not fail the entire request.",
        "<b>Swallowing loader errors in read-through.</b> If the loader throws, propagate the error. Swallowing it hides database failures.",
        "<b>Using write-through for write-heavy endpoints.</b> The extra cache round-trip triples the write latency. Cache-aside with a short TTL is better for those cases.",
        "<b>Assuming write-through guarantees perfect consistency.</b> If the database write succeeds and the cache write fails, the cache is stale until TTL. Handle this case or use a write-through that rolls back on failure.",
        "<b>Serialization mismatch.</b> The cache serializes objects to JSON; Dates become strings, BigInts are lost. Ensure readers can handle the cached representation.",
        "<b>Forgetting TTL on write-through.</b> Write-through with no TTL means stale data if a write bypasses the cache layer. Set a TTL as a safety net.",
      ],
      quiz: [
        {
          question:
            "What is the key difference between cache-aside and read-through?",
          options: [
            "Cache-aside uses Redis; read-through uses in-memory.",
            "In cache-aside, the application fetches from the database on a miss; in read-through, the cache itself fetches via a loader function.",
            "Read-through does not have TTLs.",
            "Cache-aside is only for writes.",
          ],
          correctIndex: 1,
          explanation:
            "Both patterns check the cache first. On a miss, cache-aside has the application fetch from the database and store the result. Read-through centralizes this logic: the cache calls a loader function, stores the result, and returns it.",
        },
        {
          question:
            "What happens on a write in write-through caching?",
          options: [
            "The cache is invalidated and the next read repopulates it.",
            "The application writes to the cache, and the cache writes to the database asynchronously.",
            "The application writes to the database and the cache synchronously, so reads after the write see the new value immediately.",
            "The write is queued for later.",
          ],
          correctIndex: 2,
          explanation:
            "Write-through updates the database and the cache together, synchronously. This ensures immediate read-after-write consistency, at the cost of an extra cache round-trip on every write.",
        },
        {
          question:
            "Why is write-through often not worth it for write-heavy endpoints?",
          options: [
            "Because it uses too much memory.",
            "Because the extra cache round-trip adds latency to every write, and if the data is rarely read, the caching provides little benefit.",
            "Because Redis cannot handle writes.",
            "Because it breaks the database.",
          ],
          correctIndex: 1,
          explanation:
            "Write-through adds a cache round-trip to every write. If the data is written often but rarely read, you pay the write latency without getting the read speedup. Cache-aside with a short TTL is better for that case.",
        },
        {
          question:
            "If a write-through operation updates the database but the cache write fails, what is the best practice?",
          options: [
            "Roll back the database write.",
            "Return an error and fail the request.",
            "Log the cache failure and continue — the database is the source of truth, and the TTL will eventually refresh the cache.",
            "Ignore the failure silently.",
          ],
          correctIndex: 2,
          explanation:
            "The cache is a performance optimization, not the source of truth. If the cache write fails, the database still has the correct data. Log the failure for observability and rely on the TTL or a future write to fix the cache.",
        },
      ],
    },
    {
      id: "day-54-lesson-3",
      title: "TTL and Cache Invalidation",
      durationMinutes: 22,
      explanation: `
<b>Phil Karlton famously said:</b> "There are only two hard things in Computer Science: cache invalidation and naming things." This lesson is about the first one. You can set up the most elegant cache-aside or write-through pattern, but if your invalidation is wrong, you are serving stale data. And stale data in an e-commerce store means selling products you do not have, charging old prices, or showing a user their previous profile picture.

<b>TTL (Time-To-Live)</b> is the simplest and most important invalidation mechanism. Every cache entry should have an expiration time. When the TTL elapses, the entry is removed (or ignored), and the next read repopulates it.

<b>Why does TTL exist?</b> Because explicit invalidation is unreliable. Your code might forget to invalidate a key. A write might bypass your service layer (e.g. a database admin running a query directly). A background job might update data without going through the API. TTL is the safety net: eventually, every cached value expires and gets refreshed, no matter what happened.

<b>Choosing a TTL is a trade-off:</b>
- <b>Short TTL (seconds):</b> fresher data, more database load (more misses).
- <b>Long TTL (hours):</b> less database load, staler data.
- <b>No TTL (forever):</b> only safe for truly immutable data (static config, historical records). Even then, memory becomes a concern.

The right TTL depends on the data's rate of change and the business's tolerance for staleness. A product listing might use 30 seconds; a user profile 10 minutes; a currency exchange rate 5 minutes; a static category list 24 hours.

<b>TTL Jitter.</b> If you have 10,000 cache entries all written at the same time with the same TTL, they all expire at the same time. A burst of 10,000 misses hits the database simultaneously. This is the <b>cache avalanche</b>.

The fix is TTL jitter: add a small random variation to each TTL so expiries are spread out.

\`\`\`typescript
function jitteredTtl(baseTtlMs: number, jitterPercent = 0.1): number {
  const jitter = baseTtlMs * jitterPercent;
  // Random value in [-jitter, +jitter]
  const offset = (Math.random() * 2 - 1) * jitter;
  return Math.max(1, Math.floor(baseTtlMs + offset));
}
\`\`\`

With a base TTL of 300 seconds and 10% jitter, entries expire between 270 and 330 seconds. A burst of 10,000 entries written in one second now expires over a 60-second window instead of a single moment. The database load spike is smoothed.

<b>Explicit Invalidation.</b> TTL is eventual: data is stale until the TTL expires. For data that must be fresh immediately after a write, you need explicit invalidation. This means deleting (or updating) the cache key when the underlying data changes.

The rule is simple: <b>when you write to the database, delete the corresponding cache key.</b>

\`\`\`typescript
async updateProduct(id: number, data: UpdateProductDto) {
  await this.productRepo.update(id, data);
  await this.cache.del(\`product:\${id}\`);
}
\`\`\`

Why delete instead of update? Because deletion is idempotent and race-free. If two writers both update the product, both delete the key. The next read fetches fresh data. If you tried to update the cache with each writer's version, you might end up with an older version (if the writes interleave differently than the deletes).

<b>Invalidating related keys.</b> A single write can affect multiple cache keys. Updating a product might invalidate:
- \`product:{id}\` (the detail page)
- \`products:featured\` (if the product is featured)
- \`products:category:{categoryId}\` (the category listing)

This is where invalidation gets tricky. Options:
- <b>Broad invalidation:</b> delete all potentially affected keys. Simple but may delete more than necessary.
- <b>Versioned keys:</b> include a version number in the key. Bumping the version invalidates all related keys at once.

\`\`\`typescript
// Versioned key approach
const version = await this.getCategoryVersion(categoryId);
const cacheKey = \`products:category:\${categoryId}:v\${version}\`;
\`\`\`

When the category is updated, increment its version. All old keys become unreachable and expire naturally.

<b>Cache Stampede (Thundering Herd).</b> When a hot key expires, many concurrent requests miss the cache simultaneously and all hit the database to regenerate the same value. This is the <b>cache stampede</b> or <b>dogpile</b> problem.

Three mitigations:

<b>1. Lock-based regeneration.</b> Only one request regenerates the value; the others wait or serve stale data.

\`\`\`typescript
async getWithLock(key: string, loader: () => Promise<T>, ttlMs: number) {
  const cached = await this.cache.get(key);
  if (cached) return cached;

  const lockKey = \`lock:\${key}\`;
  const gotLock = await this.redis.set(lockKey, '1', 'NX', 'PX', 10_000);

  if (gotLock) {
    try {
      const value = await loader();
      await this.cache.set(key, value, jitteredTtl(ttlMs));
      return value;
    } finally {
      await this.redis.del(lockKey);
    }
  }

  // Did not get the lock: wait briefly, then read the cache again.
  await new Promise(r => setTimeout(r, 50));
  return this.cache.get(key) ?? loader(); // fallback if still empty
}
\`\`\`

<b>2. Probabilistic early expiration (XFetch).</b> Instead of waiting for the TTL to expire, each reader occasionally recomputes the value before it expires, with a probability that increases as the expiry nears. This spreads out regeneration and eliminates the synchronized cliff.

The formula (from the VLDB 2015 paper by Vattani, Chierichetti, and Lowenstein):

\`\`\`
now - delta * beta * log(random()) >= expiry
\`\`\`

Where \`delta\` is how long the last recompute took, \`beta\` is a tuning constant (default 1.0), and \`random()\` is uniform in (0, 1). If the inequality holds, this reader recomputes the value early.

<b>3. Serve stale while revalidating.</b> If the value exists but is expired, return the stale value immediately and trigger an asynchronous refresh in the background. The client gets a fast response; the cache is updated for the next request.

<b>What can go wrong?</b>
- <b>No TTL at all.</b> Cache entries live forever, consuming memory and serving stale data indefinitely.
- <b>TTL too long.</b> Data becomes stale for minutes or hours. Users see outdated information. Match TTL to business tolerance.
- <b>TTL too short.</b> The cache provides little benefit; every other request misses and hits the database.
- <b>No jitter.</b> All entries expire at once, causing cache avalanche.
- <b>Forgetting to invalidate on write.</b> Stale data until TTL. Users see incorrect data after they update it.
- <b>Invalidating too aggressively.</b> Deleting the entire cache on every write defeats the purpose. Invalidate precisely.
- <b>Ignoring related keys.</b> Updating a product does not invalidate the featured products list. Users see the old product name in the featured section.
- <b>Not handling stampede.</b> A single hot key expiring causes a database load spike. Use locking or XFetch.
- <b>Clock skew across servers.</b> If different servers compute TTLs differently, expiries diverge. Use a consistent source of time (Redis's TTL, not the application's clock).

<b>How this appears in a real application:</b> a product service caches individual products with a 5-minute TTL and 10% jitter. On update, it deletes \`product:{id}\` and any related list keys (featured, category). The homepage featured list uses a 30-second TTL with no explicit invalidation (the short TTL is the invalidation strategy). A stampede-protected loader is used for the hot "top 20 products" key, with a Redis lock ensuring only one request regenerates it at a time. XFetch is used for the category listing, which is read thousands of times per minute.

<b>How experienced engineers think:</b> TTL and invalidation are not an afterthought. Every cached key has a TTL, every write has an invalidation strategy, and every hot key has a stampede mitigation. The goal is not "always fresh" (that is impossible with caching) but "fresh enough for the business, with a known and bounded staleness window."
      `,
      diagram: `
TTL & Invalidation Strategy

TTL Decision:
  Data changes how often?      ->  TTL
  ============================================
  Immutable                    ->  24h or more
  Changes daily                ->  1-6 hours
  Changes hourly               ->  5-30 minutes
  Changes per minute           ->  30-60 seconds
  Changes per second           ->  1-10 seconds

TTL JITTER:
  Base TTL: 300s, Jitter: 10%
  Entry A: 271s
  Entry B: 314s
  Entry C: 288s
  ... (expiries spread over 60s instead of all at once)

EXPLICIT INVALIDATION:
  UPDATE product
    -> DELETE product:{id}
    -> DELETE products:featured
    -> DELETE products:category:{catId}

CACHE STAMPEDE MITIGATIONS:
  1. Lock: only one request regenerates; others wait.
  2. XFetch: readers occasionally refresh early, with
     probability increasing as expiry nears.
  3. Stale-while-revalidate: serve stale, refresh async.

XFETCH FORMULA:
  now - delta * beta * log(random()) >= expiry
  delta = time the last recompute took
  beta = tuning constant (default 1.0)
  random() = uniform in (0, 1)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// TTL, INVALIDATION, AND STAMPEDE PROTECTION
// ============================================

// ---------- 1. TTL with jitter ----------
function jitteredTtl(baseTtlMs: number, jitter = 0.1): number {
  const spread = baseTtlMs * jitter;
  const offset = (Math.random() * 2 - 1) * spread;
  return Math.max(1, Math.floor(baseTtlMs + offset));
}

// ---------- 2. Cache service with jitter and stampede lock ----------
@Injectable()
export class ProtectedCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    const v = await this.cache.get<T>(key);
    return v ?? undefined;
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    // Apply jitter so entries do not expire simultaneously.
    await this.cache.set(key, value, jitteredTtl(ttlMs));
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  /**
   * Stampede-protected get-or-set.
   * Only one request regenerates the value; others wait briefly.
   */
  async getOrSetLocked<T>(
    key: string,
    loader: () => Promise<T>,
    ttlMs: number,
    lockTtlMs = 10_000,
  ): Promise<T> {
    const cached = await this.cache.get<T>(key);
    if (cached !== undefined && cached !== null) return cached;

    const lockKey = \`lock:\${key}\`;
    const gotLock = await this.redis.set(
      lockKey,
      '1',
      'PX',
      lockTtlMs,
      'NX',
    );

    if (gotLock) {
      try {
        const value = await loader();
        if (value !== undefined && value !== null) {
          await this.set(key, value, ttlMs);
        }
        return value;
      } finally {
        await this.redis.del(lockKey);
      }
    }

    // Did not get the lock: wait for the winner, then read the cache.
    const deadline = Date.now() + 2000;
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 50));
      const value = await this.cache.get<T>(key);
      if (value !== undefined && value !== null) return value;
    }

    // Winner took too long; fall back to computing ourselves.
    return loader();
  }
}

// ---------- 3. XFetch: probabilistic early expiration ----------
interface XFetchEntry<T> {
  value: T;
  delta: number;   // seconds the last recompute took
  expiry: number;  // absolute unix expiry (seconds)
}

async function xfetchGet<T>(
  redis: Redis,
  key: string,
  loader: () => Promise<T>,
  ttlSec: number,
  beta = 1.0,
): Promise<T> {
  const raw = await redis.get(key);
  const now = Date.now() / 1000;

  if (raw) {
    const entry: XFetchEntry<T> = JSON.parse(raw);
    // Serve the cached value unless the early-expiry dice roll
    // says this request should recompute.
    if (now - entry.delta * beta * Math.log(Math.random()) < entry.expiry) {
      return entry.value;
    }
  }

  // Recompute.
  const start = Date.now() / 1000;
  const value = await loader();
  const delta = Date.now() / 1000 - start;
  const expiry = Date.now() / 1000 + ttlSec;

  const entry: XFetchEntry<T> = { value, delta, expiry };
  // Add a bit of slack to the Redis TTL so the entry does not
  // vanish before XFetch triggers a refresh.
  await redis.set(key, JSON.stringify(entry), 'EX', ttlSec + 30);

  return value;
}

// ---------- 4. Product service with invalidation ----------
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly cache: ProtectedCacheService,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

  async findOne(id: number): Promise<Product | null> {
    return this.cache.getOrSetLocked(
      \`product:\${id}\`,
      () => this.productRepo.findOneBy({ id }),
      5 * 60 * 1000, // 5 minutes base TTL, jittered internally
    );
  }

  async findFeatured(): Promise<Product[]> {
    // Hot key: use XFetch to spread regeneration.
    return xfetchGet(
      this.redis,
      'products:featured:top20',
      () => this.productRepo.find({
        where: { isFeatured: true },
        order: { score: 'DESC' },
        take: 20,
      }),
      30, // 30 seconds
    );
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const updated = await this.productRepo.save({ id, ...data });

    // Invalidate the detail key.
    await this.cache.del(\`product:\${id}\`);

    // Invalidate related list keys.
    await this.cache.del('products:featured:top20');
    if (updated.categoryId) {
      await this.cache.del(\`products:category:\${updated.categoryId}\`);
    }

    return updated;
  }
}

// ---------- 5. Versioned invalidation for lists ----------
// When a list depends on many entities, invalidating precisely is hard.
// Use a version counter: bump the version, all old keys become stale.
async getCategoryVersion(categoryId: number): Promise<number> {
  const v = await this.redis.get(\`category:version:\${categoryId}\`);
  return v ? Number(v) : 1;
}

async bumpCategoryVersion(categoryId: number): Promise<void> {
  await this.redis.incr(\`category:version:\${categoryId}\`);
}

async findCategoryProducts(categoryId: number) {
  const version = await this.getCategoryVersion(categoryId);
  const key = \`products:category:\${categoryId}:v\${version}\`;
  return this.cache.getOrSetLocked(
    key,
    () => this.productRepo.find({ where: { categoryId } }),
    60 * 1000,
  );
}
      ` },
      keyTakeaways: [
        "Every cache entry needs a TTL — it is the safety net for forgotten invalidations.",
        "Choose TTL based on the data's rate of change and the business's tolerance for staleness.",
        "Add TTL jitter to prevent cache avalanche (mass synchronized expiry).",
        "Invalidate explicitly on writes (delete the key) to avoid serving stale data.",
        "A single write may invalidate multiple related keys; consider versioned keys for complex relationships.",
        "Cache stampede (thundering herd) happens when a hot key expires and many requests regenerate it simultaneously.",
        "Use locks, probabilistic early expiration (XFetch), or stale-while-revalidate to prevent stampede.",
      ],
      commonMistakes: [
        "<b>No TTL at all.</b> Cache entries live forever, consuming memory and serving stale data indefinitely. Every entry needs a TTL as a safety net.",
        "<b>Forgetting to invalidate on write.</b> Stale data until TTL expires. Users see incorrect data after an update. Delete the key on write.",
        "<b>Invalidating too aggressively.</b> Deleting the entire cache on every write defeats the purpose. Invalidate precisely (only the affected keys).",
        "<b>No jitter.</b> All entries with the same TTL expire at the same moment, causing a database load spike (cache avalanche).",
        "<b>Ignoring related keys.</b> Updating a product does not invalidate the featured list. Users see stale data in list views.",
        "<b>Not handling stampede.</b> A single hot key expiring causes a burst of database queries. Use locking or XFetch.",
        "<b>Using `KEYS *` to find keys to invalidate in production.</b> `KEYS` blocks Redis and can bring down the cache. Use explicit key patterns or versioned keys.",
        "<b>Assuming write-through eliminates the need for TTL.</b> Even write-through can leave stale data if a write bypasses the cache layer. Keep a TTL as a safety net.",
      ],
      quiz: [
        {
          question:
            "What is cache avalanche and how does TTL jitter prevent it?",
          options: [
            "Cache avalanche is a security attack; jitter encrypts the cache.",
            "Cache avalanche is the simultaneous expiry of many cache keys causing a database load spike; jitter spreads expiries over a window.",
            "Cache avalanche is when the cache runs out of memory; jitter compresses entries.",
            "Cache avalanche is when the database crashes; jitter retries.",
          ],
          correctIndex: 1,
          explanation:
            "Cache avalanche: many keys expire at the same moment, causing a burst of database misses. TTL jitter adds a small random offset to each TTL, spreading expiries across a window instead of a single instant.",
        },
        {
          question:
            "Why is deletion preferred over updating the cache key on a write?",
          options: [
            "Because deletion is faster.",
            "Because deletion is idempotent and race-free; the next read repopulates with fresh data, avoiding the risk of writing an outdated value.",
            "Because Redis does not support updates.",
            "Because deletion uses less memory.",
          ],
          correctIndex: 1,
          explanation:
            "Deleting on write is simpler and safer. If you update the cache directly, you risk writing a value that is already outdated (due to interleaved writes). Deleting forces the next read to fetch fresh data.",
        },
        {
          question:
            "What is the cache stampede problem?",
          options: [
            "The cache runs out of memory.",
            "A hot key expires, and many concurrent requests simultaneously miss the cache and all hit the database to regenerate the same value.",
            "The cache returns stale data.",
            "The database crashes.",
          ],
          correctIndex: 1,
          explanation:
            "When a hot key expires, every concurrent request for that key misses the cache and tries to regenerate it. Without mitigation, this causes a spike of load on the database. Locks or XFetch prevent this.",
        },
        {
          question:
            "How does probabilistic early expiration (XFetch) mitigate cache stampede?",
          options: [
            "By never expiring the cache.",
            "By occasionally recomputing the value before it expires, with a probability that increases as the expiry nears, spreading regeneration over time.",
            "By locking the cache.",
            "By caching null values.",
          ],
          correctIndex: 1,
          explanation:
            "XFetch makes readers occasionally refresh early based on a probability tied to the remaining TTL. This spreads regeneration instead of letting all readers hit the database at the moment of expiry.",
        },
      ],
    },
    {
      id: "day-54-lesson-4",
      title: "Redis Caching and Production Cache Design",
      durationMinutes: 28,
      explanation: `
<b>In-memory caching works for a single instance.</b> But when you deploy multiple replicas, each has its own cache, leading to inconsistencies and duplicated work. Redis solves this: a single shared cache accessible from every instance, with consistent state across the fleet. This lesson is about designing a production cache with Redis in NestJS — covering connection management, serialization, eviction policies, monitoring, and the specific patterns that work at scale.

<b>Redis as a shared cache.</b> Redis is an in-memory data store that can be used as a cache, a message broker, a rate limiter, and more. For caching, the key properties are:
- <b>Shared state:</b> all instances read and write the same keys.
- <b>Sub-millisecond latency:</b> typically 0.5–2 ms for a local Redis.
- <b>TTL support:</b> keys expire automatically.
- <b>Eviction policies:</b> when memory is full, Redis can evict keys based on LRU, LFU, or random policies.
- <b>Atomic operations:</b> INCR, SETNX, Lua scripts.
- <b>Data structures:</b> strings, hashes, lists, sets, sorted sets.

<b>Installing and configuring Redis in NestJS.</b> The official \`@nestjs/cache-manager\` package works with Redis via a Keyv adapter or via \`cache-manager-ioredis-yet\`. As of \`@nestjs/cache-manager\` v3 (NestJS 11), the underlying \`cache-manager\` is v6, which uses Keyv for storage adapters. The older \`cache-manager-ioredis-yet\` is replaced by Keyv-based adapters .

\`\`\`typescript
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv } from 'keyv';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const keyv = new Keyv({
          store: new KeyvRedis('redis://localhost:6379'),
        });
        return {
          stores: [keyv],
          ttl: 60_000,
        };
      },
    }),
  ],
})
export class AppModule {}
\`\`\`

<b>Important note for NestJS 11:</b> \`cache-manager\` v6 changed the data structure it stores. The Keyv adapter wraps values in a JSON envelope (\`{"value": ..., "expires": ...}\`). Existing caches from \`cache-manager\` v5 will not be readable after upgrading . This is a breaking change that affects migration from older NestJS versions.

<b>Serialization considerations.</b> The Keyv adapter serializes values to JSON by default. This means:
- Class instances are deserialized as plain objects.
- \`Date\` objects become ISO strings.
- \`BigInt\` and \`undefined\` are not supported.
- \`Buffer\` values are supported but stored differently.

If your application expects a \`Date\` object after reading from cache, you must convert it back, or store the value as a string and parse on read.

<b>Eviction policies.</b> When Redis reaches its memory limit, it must decide which keys to remove. The default policy is \`volatile-lru\`, which evicts the least-recently-used keys that have a TTL set . Other policies:
- \`allkeys-lru\`: evict least-recently-used keys, with or without TTL.
- \`volatile-random\`: evict random keys with TTL.
- \`allkeys-random\`: evict random keys.
- \`volatile-ttl\`: evict keys with the shortest remaining TTL.
- \`noeviction\`: reject writes when memory is full.

For a cache, \`allkeys-lru\` is often the right choice: it applies LRU eviction to all keys, not just those with a TTL. This is important if some keys accidentally lack a TTL.

<b>Hot keys.</b> A single cache key receiving a disproportionate amount of traffic can become a bottleneck. If one Redis shard holds the viral key, that shard gets overloaded while others are idle . Mitigations:
- <b>Client-side caching (Redis 6+):</b> Redis can track which keys a client has read and send invalidation messages when those keys change. The client keeps a local in-memory copy, eliminating the Redis round-trip for hot keys .
- <b>Key splitting:</b> store the hot value under N keys (\`article:viral:1\`, \`article:viral:2\`, ...) and randomly pick one to read. This spreads the load across shards, at the cost of updating N keys on write.
- <b>Local cache with short TTL:</b> keep a process-local copy of the hot value with a 1-second TTL. Most requests hit local memory; Redis is only consulted on misses.

<b>Client-side caching with Redis tracking.</b> Redis 6 introduced \`CLIENT TRACKING\`, which allows a client to maintain a local cache that Redis automatically invalidates . In default mode, Redis tracks which keys each client has read and sends targeted invalidations. In BCAST mode, the client specifies key prefixes, and Redis broadcasts invalidations for any key matching those prefixes .

This pattern is powerful for reducing round-trips on hot keys. The trade-off is added complexity: the client must handle invalidation messages, manage its local cache, and deal with the case where the local cache is stale between the write and the invalidation message (usually a few milliseconds).

<b>Monitoring cache effectiveness.</b> A cache is only useful if it is actually used. Track:
- <b>Hit rate:</b> hits / (hits + misses). A low hit rate means the cache is not helping (TTL too short, keys not reused).
- <b>Eviction rate:</b> how often Redis evicts keys due to memory pressure. High eviction means the cache is too small or TTLs are too long.
- <b>Memory usage:</b> how much of the Redis memory limit is used.
- <b>Latency:</b> Redis command latency (should be sub-millisecond).
- <b>Connection count:</b> how many clients are connected.

In NestJS, expose these metrics via a \`/metrics\` endpoint or log them periodically.

<b>Production checklist:</b>
- Use a shared Redis cache for multi-instance deployments.
- Set a TTL on every key (jittered).
- Choose an eviction policy (\`allkeys-lru\` for caches).
- Handle serialization differences (Dates, BigInts, undefined).
- Monitor hit rate and eviction rate.
- Consider client-side caching for hot keys.
- Handle Redis failure gracefully (fall back to database, fail-open or fail-closed per endpoint).
- Use a dedicated Redis instance or cluster for caching (do not mix with session storage or queues without careful memory planning).

<b>What can go wrong?</b>
- <b>Redis as a single point of failure.</b> If Redis goes down and the application requires it, the whole API is down. Use Redis Sentinel or Cluster for high availability.
- <b>Mixing cache and non-cache data.</b> Using the same Redis for sessions, queues, and cache can cause memory pressure and eviction of important data. Use separate instances or databases.
- <b>No memory limit.</b> Redis grows without bound until the OS kills it. Set \`maxmemory\` and an eviction policy.
- <b>No monitoring.</b> A cache with a 5% hit rate is worse than no cache (it adds latency without benefit). Monitor hit rate.
- <b>Serialization bugs.</b> Dates become strings, BigInts are lost. Ensure the application handles the deserialized shape.
- <b>Ignoring Redis connection errors.</b> If the Redis client crashes the application on connection failure, a transient network issue becomes an outage. Handle errors and reconnect.
- <b>Using \`KEYS *\` in production.</b> Blocks Redis for seconds. Use \`SCAN\` or explicit key patterns.
- <b>Not using jitter.</b> All keys expire at once, causing cache avalanche.

<b>How this appears in a real application:</b> a SaaS platform runs 8 NestJS replicas behind a load balancer. A shared Redis cluster (3 shards, 1 replica each) holds the cache. Keys are namespaced: \`cache:product:{id}\`, \`cache:user:{id}\`, \`cache:config:...\`. TTLs are jittered (5 minutes ± 10%). The eviction policy is \`allkeys-lru\`. Hot keys (the homepage product list) use client-side caching with a 1-second local TTL. Metrics track hit rate (currently 94%), eviction rate (low), and p99 latency (0.8 ms). A health check pings Redis every 10 seconds; if it fails, the application logs a warning and falls back to the database for reads, with a circuit breaker to prevent cascading failures.

<b>How experienced engineers think:</b> Redis is not a magic cache. It is a shared, persistent, memory-constrained data store that requires the same care as any other database. Plan the memory, choose the eviction policy, monitor the hit rate, and handle failure. A well-designed cache is invisible to users — it just makes everything faster. A poorly designed cache is a source of stale data, outages, and debugging nightmares.
      `,
      diagram: `
Production Redis Cache Architecture

  NestJS Replica 1     NestJS Replica 2     NestJS Replica 3
        |                     |                     |
        +----------+----------+----------+----------+
                   |                     |
                   v                     v
          +-----------------+   +-----------------+
          |  Redis Shard 1  |   |  Redis Shard 2  |
          |  cache:product:*|   |  cache:user:*   |
          |  allkeys-lru    |   |  allkeys-lru    |
          |  maxmemory 4GB  |   |  maxmemory 4GB  |
          +-----------------+   +-----------------+
                   |                     |
                   +----------+----------+
                              |
                              v
                     +-----------------+
                     |  PostgreSQL     |
                     |  (source of truth)
                     +-----------------+

Key namespacing:
  cache:product:{id}         TTL 5m ± jitter
  cache:user:{id}            TTL 10m ± jitter
  cache:featured:top20       TTL 30s, XFetch protection
  cache:config:...           TTL 1h

Monitoring:
  hit_rate > 90%             -> cache is effective
  eviction_rate low          -> memory is sufficient
  p99_latency < 2ms          -> healthy
  redis_up == 1              -> health check

Client-side caching (hot keys):
  Replica keeps local copy of cache:featured:top20
  Redis CLIENT TRACKING ON sends invalidation on change
  Local TTL: 1s (safety net)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// PRODUCTION REDIS CACHING IN NESTJS
// ============================================

// ---------- 1. Module setup with Redis (NestJS 11 / cache-manager v6) ----------
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv } from 'keyv';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const keyv = new Keyv({
          store: new KeyvRedis('redis://localhost:6379'),
          namespace: 'cache', // all keys prefixed with "cache:"
          ttl: 60_000,
        });
        return {
          stores: [keyv],
          ttl: 60_000,
        };
      },
    }),
  ],
})
export class AppModule {}

// IMPORTANT: cache-manager v6 wraps stored values in a JSON envelope
// {"value": ..., "expires": ...}. If you are migrating from v5,
// existing cache entries will not be readable. Flush the cache or
// use versioned key prefixes. (See nestjs/cache-manager#629.)

// ---------- 2. Cache service with Redis-aware helpers ----------
@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    const v = await this.cache.get<T>(key);
    return v ?? undefined;
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    // Jittered TTL: spread expirations by ±10%.
    const jitter = ttlMs * 0.1;
    const offset = (Math.random() * 2 - 1) * jitter;
    const actualTtl = Math.max(1, Math.floor(ttlMs + offset));
    await this.cache.set(key, value, actualTtl);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async getOrSet<T>(
    key: string,
    loader: () => Promise<T>,
    ttlMs: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) return cached;

    const value = await loader();
    if (value !== undefined && value !== null) {
      await this.set(key, value, ttlMs);
    }
    return value;
  }

  // Pattern-based deletion using SCAN (not KEYS).
  async deleteByPattern(pattern: string): Promise<void> {
    // The cache-manager abstraction does not expose SCAN.
    // Use the underlying Redis client for pattern deletion.
    // This example assumes you have access to the Redis client.
    // const client = this.redis;
    // let cursor = '0';
    // do {
    //   const [next, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    //   cursor = next;
    //   if (keys.length) await client.del(...keys);
    // } while (cursor !== '0');
  }
}

// ---------- 3. Redis health check ----------
@Injectable()
export class RedisHealthIndicator {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async isHealthy(): Promise<boolean> {
    try {
      const pong = await this.redis.ping();
      return pong === 'PONG';
    } catch {
      return false;
    }
  }
}

// ---------- 4. Cache metrics ----------
@Injectable()
export class CacheMetrics {
  private hits = 0;
  private misses = 0;

  recordHit() { this.hits++; }
  recordMiss() { this.misses++; }

  getStats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total ? this.hits / total : 0,
    };
  }

  reset() { this.hits = 0; this.misses = 0; }
}

// Instrument the cache service:
async get<T>(key: string): Promise<T | undefined> {
  const v = await this.cache.get<T>(key);
  if (v !== undefined && v !== null) {
    this.metrics.recordHit();
    return v;
  }
  this.metrics.recordMiss();
  return undefined;
}

// Expose metrics via a controller:
@Controller('metrics')
export class MetricsController {
  constructor(private readonly cacheMetrics: CacheMetrics) {}

  @Get('cache')
  cacheStats() {
    return this.cacheMetrics.getStats();
  }
}

// ---------- 5. Redis client setup (ioredis) ----------
import Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: () => {
        const client = new Redis({
          host: process.env.REDIS_HOST ?? 'localhost',
          port: Number(process.env.REDIS_PORT ?? 6379),
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => Math.min(times * 50, 2000),
        });
        return client;
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}

// ---------- 6. Client-side caching with CLIENT TRACKING (hot keys) ----------
// Redis 6+ supports CLIENT TRACKING for local caches that Redis invalidates.
// This is typically implemented in the Redis client library rather than
// in application code. For ioredis, there is no built-in support, but you
// can implement it manually or use a library that supports RESP3.
//
// Conceptual flow:
//   1. Enable tracking: CLIENT TRACKING ON REDIRECT <client_id>
//   2. Subscribe to __redis__:invalidate on a pubsub connection.
//   3. On GET, check local cache first. On miss, fetch from Redis
//      and store locally.
//   4. On invalidation message, delete the key from the local cache.
//
// For BCAST mode (broadcast invalidation for key prefixes):
//   CLIENT TRACKING ON BCAST PREFIX cache:featured:
//   This notifies the client of ANY change to keys under cache:featured:

// ---------- 7. Graceful degradation when Redis is down ----------
async getWithFallback<T>(
  key: string,
  loader: () => Promise<T>,
  ttlMs: number,
): Promise<T> {
  try {
    const cached = await this.cache.get<T>(key);
    if (cached !== undefined && cached !== null) return cached;
  } catch (err) {
    // Redis unavailable: log and fall through to the database.
    console.warn('Cache read failed, falling back to DB', err);
  }

  const value = await loader();

  try {
    if (value !== undefined && value !== null) {
      await this.cache.set(key, value, ttlMs);
    }
  } catch (err) {
    // Cache write failed: not fatal, the next read will try again.
    console.warn('Cache write failed', err);
  }

  return value;
}

// ---------- 8. Configuration constants ----------
export const CACHE_TTLS = {
  PRODUCT: 5 * 60 * 1000,      // 5 minutes
  USER: 10 * 60 * 1000,        // 10 minutes
  FEATURED: 30 * 1000,         // 30 seconds
  CONFIG: 60 * 60 * 1000,      // 1 hour
  CATEGORY: 60 * 1000,         // 1 minute
};

export const CACHE_KEYS = {
  product: (id: number) => \`product:\${id}\`,
  user: (id: number) => \`user:\${id}\`,
  featured: () => 'products:featured:top20',
  category: (id: number) => \`products:category:\${id}\`,
  config: (key: string) => \`config:\${key}\`,
};
      ` },
      keyTakeaways: [
        "Use a shared Redis cache for multi-instance deployments — in-memory caches are per-replica and inconsistent.",
        "NestJS 11 uses `cache-manager` v6, which wraps values in a JSON envelope; older v5 caches are not readable after upgrade.",
        "Choose an eviction policy (`allkeys-lru` for caches) and set `maxmemory` to prevent unbounded growth.",
        "Add TTL jitter to every cache write to prevent avalanche.",
        "Monitor hit rate, eviction rate, memory usage, and latency to verify the cache is effective.",
        "Handle Redis failures gracefully: log and fall back to the database; never let a cache outage become an API outage.",
        "For hot keys, consider client-side caching with Redis `CLIENT TRACKING` to eliminate round-trips.",
      ],
      commonMistakes: [
        "<b>Using in-memory cache in production with multiple replicas.</b> Each replica has its own cache, leading to inconsistencies and duplicated work. Use Redis for shared state.",
        "<b>Not setting `maxmemory` on Redis.</b> Redis grows unbounded until the OS kills it. Set `maxmemory` and an eviction policy.",
        "<b>Using `KEYS *` in production.</b> `KEYS` blocks Redis and can bring down the cache. Use `SCAN` or versioned keys.",
        "<b>Not handling serialization differences.</b> `cache-manager` v6 serializes Dates to strings and drops BigInts. Ensure the application handles the deserialized shape.",
        "<b>Mixing cache and session/queue data in the same Redis.</b> Memory pressure from one workload evicts data from another. Use separate instances or databases.",
        "<b>No monitoring.</b> A cache with a 5% hit rate adds latency without benefit. Track hit rate and eviction rate.",
        "<b>Ignoring Redis connection errors.</b> If the Redis client crashes the application on connection failure, a transient network issue becomes an outage. Handle errors and reconnect.",
        "<b>Not using TTL jitter.</b> All keys expire at the same moment, causing cache avalanche and a database load spike.",
        "<b>Failing the request when cache write fails.</b> The database is the source of truth. Log the failure and continue.",
      ],
      quiz: [
        {
          question:
            "Why is a shared Redis cache preferred over in-memory cache in a multi-replica deployment?",
          options: [
            "Because Redis is faster.",
            "Because in-memory caches are per-replica, leading to inconsistent state and duplicated work; Redis provides a single shared cache.",
            "Because in-memory caches cannot store objects.",
            "Because Redis supports larger values.",
          ],
          correctIndex: 1,
          explanation:
            "Each replica with an in-memory cache has its own state. A write on one replica is invisible to the others. Redis provides a single shared cache, ensuring consistency across all instances.",
        },
        {
          question:
            "What changed in `cache-manager` v6 that affects NestJS 11 users?",
          options: [
            "Redis support was removed.",
            "Values are now wrapped in a JSON envelope, so caches written by v5 are not readable after upgrading.",
            "TTL was removed.",
            "The API changed from `get`/`set` to `read`/`write`.",
          ],
          correctIndex: 1,
          explanation:
            "`cache-manager` v6 wraps stored values in an envelope (`{\"value\": ..., \"expires\": ...}`). Existing cache entries from v5 cannot be parsed. Flush the cache or use versioned key prefixes during migration.",
        },
        {
          question:
            "Which Redis eviction policy is best for a pure cache workload?",
          options: [
            "`noeviction`",
            "`allkeys-lru`",
            "`volatile-random`",
            "`allkeys-random`",
          ],
          correctIndex: 1,
          explanation:
            "`allkeys-lru` evicts the least-recently-used keys, regardless of TTL. For a cache, this maximizes the hit rate by keeping frequently accessed keys. `noeviction` causes writes to fail when memory is full.",
        },
        {
          question:
            "What is the cache hit rate, and why does it matter?",
          options: [
            "The percentage of requests served from the cache; a low hit rate means the cache adds latency without benefit.",
            "The speed of Redis responses.",
            "The amount of memory used by the cache.",
            "The number of keys in the cache.",
          ],
          correctIndex: 0,
          explanation:
            "Hit rate = hits / (hits + misses). A low hit rate (e.g. < 50%) means most requests miss the cache and hit the database anyway, so the cache adds latency and complexity without meaningful benefit. Monitor and tune TTLs and key design.",
        },
        {
          question:
            "What should happen when Redis is unavailable during a cache read?",
          options: [
            "Fail the request with a 500 error.",
            "Fall back to the database and log the failure — the cache is a performance layer, not the source of truth.",
            "Retry indefinitely.",
            "Return a cached value from local memory.",
          ],
          correctIndex: 1,
          explanation:
            "The database is the source of truth. If Redis is down, fall back to the database, log the failure for observability, and continue. The API should remain available during a cache outage.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question:
        "What is caching, and why does it improve performance?",
      options: [
        "It stores data in a slower layer for durability.",
        "It stores frequently accessed data in a fast layer, reducing the need to recompute or re-fetch from the source of truth.",
        "It encrypts data at rest.",
        "It compresses database queries.",
      ],
      correctIndex: 1,
      explanation:
        "A cache stores recently accessed data in a fast layer (memory) between the application and the database, so repeated reads are served quickly without hitting the database.",
    },
    {
      question:
        "In cache-aside, what happens on a cache miss?",
      options: [
        "The request fails.",
        "The application fetches from the database, stores the result in the cache, and returns it.",
        "The cache is cleared.",
        "The database is bypassed.",
      ],
      correctIndex: 1,
      explanation:
        "Cache-aside: on a miss, the application fetches from the source of truth, stores the result in the cache for next time, and returns the value.",
    },
    {
      question:
        "What is the main difference between cache-aside and read-through?",
      options: [
        "Read-through does not use TTLs.",
        "In cache-aside, the application fetches from the database on a miss; in read-through, the cache itself calls a loader function.",
        "Cache-aside is only for writes.",
        "Read-through does not support Redis.",
      ],
      correctIndex: 1,
      explanation:
        "Both check the cache first. On a miss, cache-aside has the application do the database fetch; read-through centralizes this in the cache via a loader callback.",
    },
    {
      question:
        "What does write-through caching guarantee?",
      options: [
        "The cache is never used.",
        "The database and cache are updated synchronously, so reads after a write see the new value immediately.",
        "Writes are asynchronous.",
        "The cache is cleared on every write.",
      ],
      correctIndex: 1,
      explanation:
        "Write-through updates both the database and the cache in the write path, ensuring immediate read-after-write consistency.",
    },
    {
      question:
        "Why is TTL jitter important?",
      options: [
        "It makes the TTL longer.",
        "It prevents many keys from expiring at the same moment (cache avalanche) by spreading expirations over a window.",
        "It encrypts the cache.",
        "It reduces memory usage.",
      ],
      correctIndex: 1,
      explanation:
        "Without jitter, keys written at the same time with the same TTL expire together, causing a burst of database misses. Jitter spreads expirations over a window.",
    },
    {
      question:
        "What is the cache stampede problem?",
      options: [
        "The cache runs out of memory.",
        "A hot key expires, and many concurrent requests all miss the cache and hit the database simultaneously to regenerate it.",
        "The cache returns stale data.",
        "The database crashes.",
      ],
      correctIndex: 1,
      explanation:
        "When a hot key expires, concurrent requests miss the cache and all try to regenerate the value, causing a load spike on the database. Locks or XFetch mitigate this.",
    },
    {
      question:
        "Why is deleting the cache key on a write preferred over updating it?",
      options: [
        "Because deletion is faster.",
        "Because deletion is idempotent and race-free; the next read repopulates with fresh data.",
        "Because Redis does not support updates.",
        "Because deletion uses less memory.",
      ],
      correctIndex: 1,
      explanation:
        "Deleting on write is simpler and safer. Updating the cache directly risks writing an outdated value. The next read fetches fresh data from the database.",
    },
    {
      question:
        "What is cache penetration?",
      options: [
        "The cache is too small.",
        "A client repeatedly requests a non-existent key, causing every request to miss the cache and hit the database.",
        "The cache returns stale data.",
        "The cache server crashes.",
      ],
      correctIndex: 1,
      explanation:
        "Cache penetration: requests for keys that do not exist bypass the cache and hit the database every time. Fix by caching the miss with a short TTL or using a bloom filter.",
    },
    {
      question:
        "Why is a shared Redis cache preferred over in-memory cache in a multi-replica deployment?",
      options: [
        "Because Redis is faster.",
        "Because in-memory caches are per-replica, leading to inconsistent state; Redis provides a single shared cache.",
        "Because in-memory caches cannot store objects.",
        "Because Redis supports larger values.",
      ],
      correctIndex: 1,
      explanation:
        "Each replica with an in-memory cache has its own state. A write on one replica is invisible to others. Redis provides a shared cache consistent across all instances.",
    },
    {
      question:
        "What changed in `cache-manager` v6 that affects NestJS 11 users?",
      options: [
        "Redis support was removed.",
        "Values are now wrapped in a JSON envelope, so caches written by v5 are not readable after upgrading.",
        "TTL was removed.",
        "The API changed from `get`/`set` to `read`/`write`.",
      ],
      correctIndex: 1,
      explanation:
        "`cache-manager` v6 wraps stored values in an envelope (`{\"value\": ..., \"expires\": ...}`). Existing cache entries from v5 cannot be parsed. Flush the cache or use versioned keys during migration.",
    },
    {
      question:
        "Which Redis eviction policy is best for a pure cache workload?",
      options: [
        "`noeviction`",
        "`allkeys-lru`",
        "`volatile-random`",
        "`allkeys-random`",
      ],
      correctIndex: 1,
      explanation:
        "`allkeys-lru` evicts the least-recently-used keys, maximizing hit rate by keeping frequently accessed data. `noeviction` causes writes to fail when memory is full.",
    },
    {
      question:
        "What should happen when Redis is unavailable during a cache read?",
      options: [
        "Fail the request with a 500 error.",
        "Fall back to the database and log the failure — the cache is a performance layer.",
        "Retry indefinitely.",
        "Return a cached value from local memory.",
      ],
      correctIndex: 1,
      explanation:
        "The database is the source of truth. If Redis is down, fall back to the database, log the failure, and continue. The API should remain available during a cache outage.",
    },
    {
      question:
        "What is probabilistic early expiration (XFetch) used for?",
      options: [
        "To make the TTL longer.",
        "To spread cache regeneration over time by having readers occasionally refresh before expiry, mitigating stampede.",
        "To encrypt the cache.",
        "To reduce memory usage.",
      ],
      correctIndex: 1,
      explanation:
        "XFetch makes readers occasionally recompute the value before it expires, with a probability increasing as the expiry nears. This spreads regeneration and avoids the synchronized stampede at expiry.",
    },
    {
      question:
        "Which of these is NOT a valid reason to cache data?",
      options: [
        "The data is read frequently and written rarely.",
        "The data must be perfectly fresh at all times (e.g. account balance for a transaction).",
        "The data is expensive to compute.",
        "The data can tolerate slight staleness.",
      ],
      correctIndex: 1,
      explanation:
        "Data that must be perfectly fresh — like an account balance used for a financial decision — should not be served from a cache with any TTL. The cost of staleness is too high.",
    },
  ],
  project: {
    name: "Build a Multi-Layer Caching System for a High-Traffic Product Catalog",
    goal:
      "Implement a production-grade caching layer for a NestJS product catalog using Redis, cache-aside, read-through, TTL jitter, stampede protection, and monitoring. Reduce database load by 90% while keeping data fresh enough for business requirements.",
    brief:
      "You are the backend engineer for an e-commerce platform. The product catalog is read thousands of times per second but changes only a few times per day. The database is becoming a bottleneck. You must design and implement a caching strategy that serves product details, category listings, and the featured products list from Redis, with appropriate TTLs, explicit invalidation on write, stampede protection for hot keys, and monitoring to verify effectiveness.",
    steps: [
      "Create a NestJS project. Add `@nestjs/cache-manager`, `@keyv/redis`, `keyv`, `ioredis`, `@nestjs/typeorm`, `pg`, and `@nestjs/terminus`.",
      "Run Redis locally (Docker: `docker run -p 6379:6379 redis:7-alpine`).",
      "Configure `CacheModule.registerAsync()` with a Keyv Redis store. Set the default TTL to 60 seconds and a namespace prefix of `cache`.",
      "Create a `CacheService` with `get`, `set` (with jitter), `del`, and `getOrSet` methods. Add a `getOrSetLocked` method for stampede protection using a Redis `SET NX PX` lock.",
      "Define a `Product` entity (id, name, price, description, categoryId, isFeatured, score) and a `Category` entity. Seed with 100 products across 5 categories.",
      "Implement `ProductsService.findOne(id)` using `getOrSetLocked` with a 5-minute base TTL (jittered). The loader queries the database.",
      "Implement `ProductsService.findByCategory(categoryId)` using `getOrSetLocked` with a 1-minute base TTL. Use a versioned key: `cache:products:category:{id}:v{version}`. Increment the version on category update.",
      "Implement `ProductsService.findFeatured()` using XFetch (probabilistic early expiration) with a 30-second TTL. This is the hottest key on the homepage.",
      "Implement `ProductsService.update(id, data)`. After updating the database, invalidate `product:{id}`, `products:featured:top20`, and the category key (via version bump).",
      "Create a `RedisHealthIndicator` using `@nestjs/terminus` that pings Redis. Add it to a `/health` endpoint.",
      "Create a `CacheMetricsService` that tracks hits and misses per key prefix. Instrument `CacheService.get` to record hits and misses. Expose stats via `GET /metrics/cache`.",
      "Add graceful degradation: wrap cache reads and writes in try/catch. On failure, log a warning and fall back to the database. The API should remain available if Redis is down.",
      "Write e2e tests that: (a) verify a cache hit returns the same data without hitting the DB (use a spy); (b) verify a cache miss populates the cache; (c) verify update invalidates the cache; (d) verify the lock prevents stampede (fire 10 concurrent requests for an expired key, assert only one DB call); (e) verify TTL jitter produces different TTLs for different keys.",
      "Add a load test with k6 or autocannon: 1000 requests for the same product ID, verify hit rate > 95% and p99 latency < 5ms.",
    ],
    acceptance: [
      "`GET /products/:id` returns the product and is served from cache on repeated requests.",
      "The first request for a product populates the cache; the second request does not hit the database (verified by a spy).",
      "`PATCH /products/:id` invalidates the product cache and related list caches.",
      "Concurrent requests for an expired hot key result in only one database call (stampede protection works).",
      "TTL values for different cache entries vary by ±10% (jitter is applied).",
      "`GET /metrics/cache` returns a hit rate above 90% after the load test.",
      "`GET /health` reports Redis status.",
      "If Redis is stopped, the API continues to work by falling back to the database (with a warning logged).",
      "All e2e tests pass.",
    ],
    stretch: [
      "Implement a two-tier cache: an in-memory LRU cache (using `lru-cache`) in front of Redis for the hottest keys, with a 1-second TTL. Measure the reduction in Redis round-trips.",
      "Add Redis client-side caching using `CLIENT TRACKING` for the featured products key. Implement a local cache that is invalidated by Redis push messages. Document the trade-offs.",
      "Add cache warming: on application startup, pre-populate the cache with the top 100 products and featured list. Measure the cold-start latency improvement.",
      "Add a circuit breaker (using `opossum` or a simple state machine) that stops querying Redis after N consecutive failures and retries after a cooldown.",
      "Implement a `@Cacheable()` decorator that automatically wraps service methods with `getOrSetLocked`, reading TTL and key pattern from decorator metadata.",
      "Add Prometheus metrics (`cache_hits_total`, `cache_misses_total`, `cache_evictions_total`) using `@willsoto/nestjs-prometheus` and expose a `/metrics` endpoint.",
      "Benchmark three strategies — no cache, cache-aside, cache-aside with stampede lock — and document the throughput (req/s) and p99 latency for each under a 10,000-request load test.",
    ],
  },
};
