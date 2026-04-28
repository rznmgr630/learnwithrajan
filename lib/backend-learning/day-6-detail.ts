import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_6_DETAIL = {
  overview: [
    "Caching is the practice of storing a computed or fetched result closer to the consumer so future requests avoid repeating expensive work. Every layer has a different latency, scope, and invalidation model — choosing the wrong layer creates either wasted effort or stale data.",
    "Day 6 covers the full cache hierarchy from in-process memory to CDN, HTTP caching headers, the cache-aside pattern, write strategies, TTL and eviction policies, and the hardest problem: knowing when to invalidate.",
  ],
  sections: [
    {
      title: "The cache hierarchy",
      blocks: [
        {
          type: "diagram",
          id: "cache-layers",
        },
        {
          type: "table",
          headers: ["Layer", "Latency", "Scope", "Best for"],
          rows: [
            [
              "In-process (Map / LRU)",
              "< 1 ms",
              "Single process",
              "Per-instance hot data: config, feature flags, compiled templates",
            ],
            [
              "Redis / Memcached",
              "1-5 ms",
              "Shared across instances",
              "Session store, rate-limit counters, shared computed results",
            ],
            [
              "CDN (Cloudflare, Fastly)",
              "10-50 ms (regional PoP)",
              "Global edge",
              "Public static assets, API responses safe to cache by vary rules",
            ],
            [
              "HTTP cache (browser)",
              "0 ms (local disk)",
              "Per-browser",
              "Static assets with content-addressed URLs",
            ],
            [
              "Origin DB",
              "100-500 ms",
              "Single source of truth",
              "Authoritative reads when freshness is critical",
            ],
          ],
        },
      ],
    },
    {
      title: "HTTP caching headers",
      blocks: [
        {
          type: "table",
          headers: ["Header", "Direction", "What it controls"],
          rows: [
            [
              "Cache-Control: max-age=3600",
              "Response",
              "Cache is fresh for 3600 seconds from response time",
            ],
            [
              "Cache-Control: no-store",
              "Response",
              "Never cache — private data, auth responses",
            ],
            [
              "Cache-Control: no-cache",
              "Response",
              "Cache but revalidate before use (misleadingly named)",
            ],
            [
              "Cache-Control: s-maxage=600",
              "Response",
              "CDN-specific TTL (overrides max-age for shared caches)",
            ],
            [
              "Cache-Control: stale-while-revalidate=60",
              "Response",
              "Serve stale immediately while fetching fresh in background",
            ],
            [
              "ETag / If-None-Match",
              "Response / Request",
              "Conditional GET — server returns 304 if unchanged",
            ],
            [
              "Vary: Accept-Encoding",
              "Response",
              "Maintain separate cache entries per encoding",
            ],
          ],
        },
        {
          type: "code",
          title: "Setting cache headers (Express)",
          code: `// Immutable assets (content-addressed URLs like /app.abc123.js)
res.set("Cache-Control", "public, max-age=31536000, immutable");

// API response — fresh for 60s, CDN can serve stale for 30s while revalidating
res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=30");

// User-specific data — never cache at shared caches
res.set("Cache-Control", "private, no-store");`,
        },
      ],
    },
    {
      title: "Cache-aside (lazy loading) pattern",
      blocks: [
        {
          type: "diagram",
          id: "cache-aside-pattern",
        },
        {
          type: "paragraph",
          text: "Cache-aside is the most common application caching pattern. The application manages the cache explicitly: on a cache miss it reads from the database and populates the cache; on a write it updates the database and invalidates (or updates) the cache entry.",
        },
        {
          type: "code",
          title: "Cache-aside read (Redis + Node.js)",
          code: `async function getUser(id: string) {
  const key = \`user:\${id}\`;

  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);           // cache hit

  const user = await db.users.findUnique({ where: { id } }); // cache miss
  if (user) {
    await redis.setex(key, 300, JSON.stringify(user)); // TTL = 5 min
  }
  return user;
}

async function updateUser(id: string, data: Partial<User>) {
  const updated = await db.users.update({ where: { id }, data });
  await redis.del(\`user:\${id}\`);                  // invalidate on write
  return updated;
}`,
        },
      ],
    },
    {
      title: "Write strategies",
      blocks: [
        {
          type: "table",
          headers: ["Strategy", "How it works", "Trade-off"],
          rows: [
            [
              "Cache-aside (write-invalidate)",
              "Write to DB, then delete the cache key",
              "Simple; small window of stale reads between write and invalidation",
            ],
            [
              "Write-through",
              "Write to cache and DB synchronously in same operation",
              "Cache always consistent; extra write latency on every write",
            ],
            [
              "Write-behind (write-back)",
              "Write to cache only; async flush to DB later",
              "Low write latency; risk of data loss if cache crashes before flush",
            ],
            [
              "Refresh-ahead",
              "Proactively refresh cache before TTL expires",
              "Avoids stampede; wastes resources if data is rarely read",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Start with cache-aside + write-invalidate. It is the easiest to reason about and debug. Move to write-through only if consistency requirements demand it. Write-behind is rarely worth the operational complexity unless write throughput is extreme.",
        },
      ],
    },
    {
      title: "TTL, eviction, and the cache stampede problem",
      blocks: [
        {
          type: "paragraph",
          text: "TTL (Time-To-Live) bounds how stale data can get. LRU (Least Recently Used) eviction removes the least-accessed entries when memory is full. Both work well in isolation but combine to create the thundering herd / cache stampede: when a popular key expires, dozens of concurrent requests all miss the cache simultaneously and all hit the database.",
        },
        {
          type: "table",
          headers: ["Stampede solution", "How it works"],
          rows: [
            [
              "Probabilistic early expiration (XFetch)",
              "Each requester independently decides to refresh before TTL based on a random early-expiry probability",
            ],
            [
              "Mutex / single-flight",
              "First miss acquires a lock, fetches DB, and populates cache; other concurrent misses wait for the lock",
            ],
            [
              "Stale-while-revalidate",
              "Serve stale value immediately while one background goroutine/async task refreshes asynchronously",
            ],
            [
              "Jittered TTL",
              "Add random seconds to each cache entry's TTL to spread expirations across time",
            ],
          ],
        },
        {
          type: "code",
          title: "Single-flight with Redis (Node.js)",
          code: `import { Mutex } from "async-mutex";

const locks = new Map<string, Mutex>();

async function getCachedOrFetch(key: string, fetch: () => Promise<string>) {
  const cached = await redis.get(key);
  if (cached) return cached;

  if (!locks.has(key)) locks.set(key, new Mutex());
  const release = await locks.get(key)!.acquire();
  try {
    // Double-check after acquiring lock
    const afterLock = await redis.get(key);
    if (afterLock) return afterLock;

    const value = await fetch();
    await redis.setex(key, 300, value);
    return value;
  } finally {
    release();
    locks.delete(key);
  }
}`,
        },
      ],
    },
    {
      title: "Redis as a shared cache",
      blocks: [
        {
          type: "paragraph",
          text: "Redis is the default choice for a shared application cache. Key decisions when setting it up: choose an eviction policy (allkeys-lru for pure cache, volatile-lru when you have both cache and durable data), size the maxmemory to leave headroom for writes, and decide on persistence (RDB snapshots or AOF) — for a pure cache, disable persistence to maximise performance.",
        },
        {
          type: "table",
          headers: ["Redis eviction policy", "When to use"],
          rows: [
            [
              "allkeys-lru",
              "Everything in Redis is a cache — evict LRU keys freely",
            ],
            [
              "volatile-lru",
              "Mix of cached (TTL-set) and durable (no TTL) keys",
            ],
            [
              "allkeys-lfu",
              "Prefer keeping frequently used keys over recently used",
            ],
            [
              "noeviction",
              "Never evict — errors when full (for durable data stores)",
            ],
          ],
        },
      ],
    },
    {
      title: "Cache invalidation strategies",
      blocks: [
        {
          type: "list",
          items: [
            "TTL expiry: simplest — set a TTL and accept some stale period. Works when slight staleness is acceptable (product catalogue, config).",
            "Explicit delete on write: after updating the DB, delete or overwrite the cache key. Zero stale window but requires coordinated writes.",
            "Event-driven invalidation: publish a change event (Kafka, Redis Pub/Sub) — all cache consumers subscribe and invalidate on receipt. Scalable but adds complexity.",
            "Tag-based invalidation: group cache keys under a tag (e.g., user:u_123:*). Invalidate by tag to wipe all related entries atomically.",
            "Versioned cache keys: embed a version in the key (user:u_123:v42). A write bumps the version; old keys expire naturally. Avoids explicit deletes.",
          ],
        },
        {
          type: "paragraph",
          text: "Phil Karlton's observation holds: cache invalidation is one of the two hard problems in computer science. The safest rule is to make cached data immutable (content-addressed keys or versioned keys) so invalidation becomes key rotation, not deletion.",
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is the difference between in-process cache and Redis?",
      tag: "Cache layers",
      answer: [
        "An in-process cache (a Map or an LRU library) lives inside your application's memory. It is the fastest possible cache — zero network round-trips — but is isolated to a single process. Two instances of your service have two independent caches; a cached write in one is invisible to the other.",
        "Redis is a shared external store. Every instance reads from and writes to the same data, so cached writes are visible across your entire fleet. The cost is a 1-5 ms network hop per operation.",
      ].join("\n\n"),
      callout:
        "Use in-process caching for read-only hot data (feature flags, config). Use Redis for shared state (sessions, rate-limit counters, computed results that must be consistent across instances).",
    },
    {
      question: "What does Cache-Control: no-cache actually mean?",
      tag: "HTTP caching",
      answer: [
        "Despite the name, no-cache does not mean do not cache. It means cache but always revalidate before use — send a conditional GET to the origin with If-None-Match or If-Modified-Since. If unchanged, origin returns 304 and the cached copy is served. Only if changed does origin send a full 200 with a new body.",
        "no-store is the directive that actually prevents caching. no-cache is better described as must-revalidate-before-use.",
      ].join("\n\n"),
    },
    {
      question: "What is the cache stampede (thundering herd) problem?",
      tag: "Cache stampede",
      answer: [
        "When a popular cache key expires, all concurrent requests that were relying on it miss simultaneously and all go to the database at once. For a high-traffic key, this can be hundreds or thousands of simultaneous DB queries — enough to overwhelm the database.",
        "Solutions: mutex / single-flight (only one requester fetches, others wait), stale-while-revalidate (serve stale instantly, refresh in background), jittered TTLs (spread expirations), or XFetch (probabilistic early refresh).",
      ].join("\n\n"),
    },
    {
      question:
        "What is the difference between write-through and write-behind caching?",
      tag: "Write strategies",
      answer: [
        "Write-through: every write goes to both the cache and the database synchronously before returning to the caller. The cache is always consistent, but writes have the latency of both operations.",
        "Write-behind (write-back): writes go to the cache only and return immediately. A background process asynchronously flushes dirty entries to the database. Write latency is minimal, but if the cache crashes before flushing, data is lost. Suitable only when some data loss is acceptable (analytics counters, non-critical events).",
      ].join("\n\n"),
    },
    {
      question:
        "How should I handle cache invalidation on writes in a distributed system?",
      tag: "Cache invalidation",
      answer: [
        "The simplest approach is delete-on-write: after a successful DB write, delete the cache key. The next read will miss and repopulate. This creates a very small window of stale reads between the write and the delete — acceptable for most applications.",
        "For higher consistency, use transactional outbox: write the DB change and an invalidation event in the same transaction. A background worker reads the event and deletes the cache key, ensuring the invalidation is never lost even if the application crashes mid-write.",
      ].join("\n\n"),
      callout:
        "Never update the cache and the database in separate, non-atomic operations without considering failure modes. A crash between the two steps leaves them inconsistent.",
    },
    {
      question: "What Redis eviction policy should I use?",
      tag: "Redis",
      answer: [
        "If Redis is used purely as a cache (everything has a TTL), use allkeys-lru. Redis will freely evict the least-recently-used keys when it runs out of memory, which is the correct behaviour for a cache.",
        "If Redis stores a mix of cached data (with TTLs) and durable data (session store, counters with no TTL), use volatile-lru so only TTL-bearing keys are evicted. Never use noeviction for a cache — it will start returning errors when full.",
      ].join("\n\n"),
    },
    {
      question: "What is stale-while-revalidate and when is it appropriate?",
      tag: "HTTP caching",
      answer: [
        "stale-while-revalidate=N tells caches: serve the stale response immediately (zero latency to the user) and kick off a background revalidation request. If the background fetch completes within N seconds, update the cache for the next request. After N seconds, the entry is considered too stale and a synchronous revalidation is required.",
        "Best for: public API responses, product listings, and any content where serving data that is a few seconds old is acceptable in exchange for consistent low-latency responses.",
      ].join("\n\n"),
    },
    {
      question:
        "How do content-addressed (immutable) URLs eliminate cache invalidation?",
      tag: "Cache invalidation",
      answer: [
        "Content-addressed URLs embed a hash of the file content in the URL (e.g., /app.a3f8b2.js). The content at that URL never changes, so you can set Cache-Control: immutable, max-age=31536000 — browsers cache it for a year with no revalidation.",
        "When the file content changes, the hash changes, so the URL changes. Old browsers keep serving the old file from cache (which is fine — it matches the old HTML). New deployments use the new URL. There is nothing to invalidate.",
      ].join("\n\n"),
      callout:
        "This is what webpack, Vite, and Next.js do automatically for static assets. You get perfect caching without any invalidation infrastructure.",
    },
    {
      question: "When should I NOT use a cache?",
      tag: "Cache trade-offs",
      answer: [
        "Do not cache data that must be strongly consistent — financial balances, inventory counts, anything where serving stale data causes real harm. Do not cache personalised or user-specific data at a shared CDN layer without a careful Vary header strategy. Do not cache error responses from an upstream service — you will serve errors to everyone until the TTL expires.",
        "Also avoid caching very frequently updated data where the hit rate would be near zero. A cache that misses constantly adds latency (cache check + DB read) without benefit.",
      ].join("\n\n"),
    },
    {
      question: "What is cache poisoning and how do I prevent it?",
      tag: "Cache security",
      answer: [
        "Cache poisoning is when an attacker causes a malicious or incorrect response to be stored in a shared cache, serving it to subsequent legitimate users. Common vectors: HTTP request smuggling, unkeyed headers (a variation in a header changes the response but is not included in the cache key), and open redirectors.",
        "Prevention: only cache responses you fully control; use strict Vary headers; validate all input before generating cacheable responses; ensure your reverse proxy and application agree on which headers affect caching.",
      ].join("\n\n"),
    },
    {
      question: "What is the difference between TTL and LRU eviction?",
      tag: "Redis",
      answer: [
        "TTL (Time-To-Live) is a time-based expiry set per key. The key is automatically deleted after the specified duration regardless of how often it is accessed. TTL controls data freshness.",
        "LRU (Least Recently Used) eviction is a memory-pressure response. When Redis reaches maxmemory, it evicts whichever keys have been least recently accessed to free space. LRU controls memory usage, not freshness. Both mechanisms can and should be used together.",
      ].join("\n\n"),
    },
  ],
} satisfies RoadmapDayDetail;
