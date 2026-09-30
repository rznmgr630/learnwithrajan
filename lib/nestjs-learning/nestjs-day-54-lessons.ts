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
      explanation: `A cache stores data closer to the application so repeated reads can be served faster and with less load on the primary data source. Redis is commonly used because it provides fast in-memory access and useful data structures.

The cache-aside pattern is one of the most common approaches. The application first checks the cache. On a hit, it returns the cached value. On a miss, it reads from the database, stores the result in the cache, and returns it.

Caching introduces a second copy of data, so consistency becomes a design concern. A cached value can become stale after the database changes. The system therefore needs an explicit expiration and invalidation strategy.

Not every query should be cached. Cache candidates usually have high read frequency, expensive computation or database cost, and data that can tolerate an appropriate amount of staleness.`,
      diagram: `Request
   |
   v
Check Cache
   |
 +--+--+
 |     |
Hit   Miss
 |     |
 v     v
Return DB Query
       |
       v
    Set Cache
       |
       v
    Return`,
      codeExample: { title: "Example", code: `async function getOrder(id: string) {
  const key = \`order:\${id}\`;

  const cached = await redis.get(key);

  if (cached) {
    return JSON.parse(cached);
  }

  const order = await ordersRepository.findById(id);

  if (!order) {
    throw new NotFoundException();
  }

  await redis.set(key, JSON.stringify(order), {
    EX: 60,
  });

  return order;
}` },
      keyTakeaways: [
        "A cache reduces repeated work by storing reusable results.",
        "Cache-aside makes the application responsible for reads and cache population.",
        "Every cached value needs a freshness strategy.",
        "Caching should be applied selectively based on access patterns and cost."
      ],
      commonMistakes: [
        "Caching every database query.",
        "Forgetting TTL or invalidation.",
        "Caching sensitive data without considering authorization boundaries.",
        "Assuming a cache is the source of truth."
      ],
      quiz: [
        {
          question: "What happens on a cache miss in cache-aside?",
          options: [
            "The request must always fail",
            "The application loads the data from the source and usually populates the cache",
            "Redis becomes the database",
            "The client must retry"
          ],
          correctIndex: 1,
          explanation: "Cache-aside loads missing data from the primary source and then stores a reusable cached value."
        }
      ]
    },
    {
      id: "day-54-lesson-2",
      title: "Read-Through and Write-Through Caching",
      durationMinutes: 20,
      explanation: `In cache-aside, application code explicitly checks and populates the cache. In a read-through design, the cache abstraction itself knows how to load missing data from the underlying source. This can centralize cache loading behavior.

Write-through caching updates the cache as part of a write operation, generally keeping cache and primary storage aligned more immediately. Instead of writing only to the database and waiting for a later cache miss to refresh the cache, the application or cache layer updates both.

These patterns are architectural choices rather than requirements of Redis itself. Redis provides storage and operations; your application or a caching layer determines the consistency behavior.

Write-through can reduce stale reads after a successful write, but it also means writes have more moving parts. The system must decide what happens if the database succeeds and cache update fails, or vice versa. Strong production designs make the source of truth explicit.`,
      diagram: `Read-through

Client -> Cache -> Source
            |
         miss/load
            |
            v
        cached value


Write-through

Client -> Cache -> Database
            |
         update
            v
       cached value`,
      codeExample: { title: "Example", code: `// Conceptual write-through operation
async function updateOrder(id: string, input: UpdateOrder) {
  const updated = await repository.update(id, input);

  await cache.set(
    \`order:\${id}\`,
    JSON.stringify(updated),
    { EX: 60 },
  );

  return updated;
}

// The database remains the source of truth.
// Cache failure handling must be designed explicitly.` },
      keyTakeaways: [
        "Read-through centralizes loading on cache misses.",
        "Write-through updates the cache as part of the write path.",
        "Redis does not automatically impose read-through or write-through semantics.",
        "Failure handling between the source of truth and cache must be deliberate."
      ],
      commonMistakes: [
        "Calling every Redis cache automatically read-through.",
        "Assuming cache and database writes are one atomic transaction.",
        "Making cache availability a hidden requirement for every database write.",
        "Failing to define the source of truth."
      ],
      quiz: [
        {
          question: "What is a major characteristic of write-through caching?",
          options: [
            "Writes update the cache as part of the write path",
            "It never uses a database",
            "It only supports GET requests",
            "It disables TTL"
          ],
          correctIndex: 0,
          explanation: "Write-through designs update the cache along with the underlying write operation."
        }
      ]
    },
    {
      id: "day-54-lesson-3",
      title: "TTL and Cache Invalidation",
      durationMinutes: 22,
      explanation: `TTL, or time to live, determines how long a cached entry remains valid. TTL is a simple way to place an upper bound on staleness. A short TTL reduces stale-data duration but causes more cache misses; a long TTL improves hit rates but can serve old data longer.

Cache invalidation means explicitly removing or updating cached data when the underlying source changes. The common phrase "cache invalidation is hard" reflects the fact that invalidation requires knowing which cached representations are affected by a change.

Keys should be designed so related values can be invalidated predictably. For example, an order update may affect order:123, user:42:orders, and a search result cache. A write path therefore needs to understand all relevant cached representations.

Avoid using only one global cache key for complex application data. Include tenant, user, resource, query, and version information where those dimensions affect the result. Cache-key design is part of correctness, not merely performance.`,
      diagram: `Database Update
      |
      +--> invalidate order:123
      |
      +--> invalidate user:42:orders
      |
      +--> invalidate affected search keys

TTL
 |
 +--> automatic expiration
       |
       v
   stale value removed`,
      codeExample: { title: "Example", code: `const orderKey = \`tenant:\${tenantId}:order:\${orderId}\`;

await redis.del(orderKey);

// If a list depends on the changed order:
await redis.del(\`tenant:\${tenantId}:orders:list\`);

// Cache with TTL
await redis.set(orderKey, JSON.stringify(order), {
  EX: 60,
});` },
      keyTakeaways: [
        "TTL limits how long a cached value can remain.",
        "Invalidation explicitly removes or refreshes affected cached representations.",
        "Cache keys must include every identity dimension that changes the result.",
        "Complex applications may need to invalidate multiple related keys."
      ],
      commonMistakes: [
        "Using cache keys that ignore tenant or authorization boundaries.",
        "Assuming TTL alone guarantees fresh data.",
        "Updating a resource without considering dependent list/search caches.",
        "Creating unbounded cache keys for arbitrary query combinations."
      ],
      quiz: [
        {
          question: "What is the main tradeoff of increasing cache TTL?",
          options: [
            "It always improves correctness",
            "It can improve hit rates but allow stale data to live longer",
            "It disables Redis",
            "It prevents invalidation"
          ],
          correctIndex: 1,
          explanation: "Longer TTLs can reduce misses but increase the maximum period during which stale data may remain."
        }
      ]
    },
    {
      id: "day-54-lesson-4",
      title: "Redis Caching and Production Cache Design",
      durationMinutes: 28,
      explanation: `Redis can store serialized JSON, strings, hashes, sets, sorted sets, and other structures. For ordinary API-response caching, a namespaced string key containing serialized data is often sufficient. More advanced cases can use hashes or sorted sets for specialized access patterns.

Cache stampedes happen when a popular value expires and many requests simultaneously miss the cache and hit the database. Techniques such as request coalescing, locking, early refresh, and jittered expiration can reduce this problem.

Cache penetration occurs when requests repeatedly ask for data that does not exist. Negative caching can sometimes help, although it needs a short TTL so that newly created data is not hidden for too long.

Cache poisoning is another security concern. Never allow untrusted users to influence shared cached responses in a way that crosses authorization boundaries. Cache keys and cacheable response design must include relevant identity and request dimensions.

Caching should also be observable. Track cache hits, misses, evictions, latency, memory use, and errors. A cache that silently fails or becomes overloaded can become a production bottleneck instead of an optimization.`,
      diagram: `                 API
                  |
             Cache Service
                  |
        +---------+---------+
        |                   |
      Redis              Database
        |
  +-----+-----+
  |           |
 hit         miss
  |           |
 return     query DB
              |
           populate
              |
           return`,
      codeExample: { title: "Example", code: `class OrderCache {
  constructor(private readonly redis: Redis) {}

  async get(tenantId: string, orderId: string) {
    const key = \`tenant:\${tenantId}:order:\${orderId}\`;
    const value = await this.redis.get(key);

    return value ? JSON.parse(value) : null;
  }

  async set(
    tenantId: string,
    orderId: string,
    order: unknown,
  ) {
    const key = \`tenant:\${tenantId}:order:\${orderId}\`;

    await this.redis.set(
      key,
      JSON.stringify(order),
      { EX: 60 },
    );
  }

  async invalidate(tenantId: string, orderId: string) {
    await this.redis.del(
      \`tenant:\${tenantId}:order:\${orderId}\`,
    );
  }
}` },
      keyTakeaways: [
        "Redis is a flexible shared cache for horizontally scaled NestJS services.",
        "Cache stampedes, penetration, and poisoning are distinct production concerns.",
        "Tenant and authorization boundaries must be represented in cache keys or cache architecture.",
        "Metrics are necessary to understand whether caching actually improves the system."
      ],
      commonMistakes: [
        "Treating Redis as a permanent database without appropriate durability requirements.",
        "Allowing thousands of simultaneous misses to hammer the database.",
        "Caching personalized data under a shared key.",
        "Ignoring Redis memory limits and eviction behavior."
      ],
      quiz: [
        {
          question: "What is a cache stampede?",
          options: [
            "A database schema migration",
            "Many requests missing the same cache entry and simultaneously loading the source",
            "A Redis authentication failure",
            "A slow frontend render"
          ],
          correctIndex: 1,
          explanation: "A stampede occurs when many clients refresh an expired or missing popular value at the same time."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "Which pattern explicitly checks the cache before querying the database?",
      options: ["Cache-aside", "Write-only", "Round robin", "Circuit breaking"],
      correctIndex: 0,
      explanation: "In cache-aside, the application reads the cache first and loads the source on a miss."
    },
    {
      question: "What does TTL primarily control?",
      options: [
        "Authentication",
        "How long a cached value remains available",
        "Database schema size",
        "HTTP method selection"
      ],
      correctIndex: 1,
      explanation: "TTL defines the lifetime of a cache entry."
    },
    {
      question: "Why can cache keys be a correctness issue in a multi-tenant application?",
      options: [
        "Keys are only for performance",
        "A poorly scoped key can return one tenant's data to another tenant",
        "Redis does not support strings",
        "TTL cannot be used with tenants"
      ],
      correctIndex: 1,
      explanation: "Cache keys must preserve the identity boundaries that affect the underlying result."
    }
  ],
  project: {
    name: "Redis-Backed Orders Cache",
    goal: "Add production-oriented caching to a NestJS Orders API using cache-aside, TTL, invalidation, and Redis.",
    brief: "Cache frequently accessed order and list data while keeping tenant boundaries safe. Implement cache-aside reads, write invalidation, TTLs, cache metrics, and protection against common cache failure patterns.",
    steps: [
      "Create a Redis cache service.",
      "Define a consistent cache-key namespace.",
      "Include tenant identity in every tenant-scoped key.",
      "Implement cache-aside for GET /orders/:id.",
      "Add TTLs to cached values.",
      "Invalidate an order cache after updates and deletes.",
      "Invalidate affected list caches.",
      "Add negative caching for selected not-found lookups with a short TTL.",
      "Handle Redis failures without exposing internal errors.",
      "Track cache hits, misses, latency, and errors.",
      "Simulate a cache stampede and add a mitigation strategy."
    ],
    acceptance: [
      "Repeated reads can be served from Redis.",
      "Updates do not indefinitely serve stale order data.",
      "Cache keys cannot cross tenant boundaries.",
      "Redis failures degrade safely according to the chosen policy.",
      "Cache entries expire according to documented TTLs.",
      "Cache behavior is observable through metrics/logs."
    ],
    stretch: [
      "Add request coalescing for popular keys.",
      "Add jittered TTLs.",
      "Implement stale-while-revalidate for selected read-heavy endpoints.",
      "Add Redis memory and eviction monitoring."
    ]
  }
};
