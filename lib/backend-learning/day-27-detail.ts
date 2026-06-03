import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_27_DETAIL = {
  overview: [
    "Caching is one of the fastest ways to improve API performance. Storing a computed or fetched result closer to the consumer means future requests skip the expensive work — the database query, the third-party API call, the complex computation. The challenge is knowing what to cache, for how long, and how to invalidate it when the underlying data changes.",
    "Today covers the full caching hierarchy from in-process memory to CDN, the main Redis patterns (cache-aside, write-through, write-behind), how to handle cache invalidation without causing stale data bugs, and how to use k6 to find performance bottlenecks before users do.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "dGAgxozNWFE", title: "Cache Systems Every Developer Should Know" },
      ],
    },
    {
      title: "Caching layers — where caches live",
      blocks: [
        { type: "diagram", id: "cache-layers" },
        {
          type: "table",
          caption: "Each layer has a different latency, scope, and invalidation model — use the right one for each problem.",
          headers: ["Layer", "Where it lives", "Latency", "Scope", "Best for"],
          rows: [
            ["In-process memory (LRU cache, node-cache)", "Inside the running process — a plain JavaScript Map or LRU", "< 0.1ms — no network", "Single instance only — each pod has its own cache", "Very hot, read-only data: feature flags, config, lookup tables that rarely change"],
            ["Shared cache (Redis, Memcached)", "External service, shared across all instances", "~0.5–2ms — one network hop", "All instances share the same data", "Session data, rate limit counters, computed results that are expensive and shared across users"],
            ["Application server cache (HTTP cache)", "Nginx or reverse proxy caches responses", "~1–5ms — saved round trip to the app", "All requests to the same path on the same server", "Public, identical responses: homepage HTML, public product listings, infrequently changing data"],
            ["CDN (CloudFront, Fastly, Cloudflare)", "Edge nodes globally distributed, close to users", "~5–50ms — saves trip to your server entirely", "All users globally — same response served from the edge", "Static assets, public API responses, cacheable pages — anything that does not vary per user"],
          ],
        },
      ],
    },
    {
      title: "Redis caching patterns",
      blocks: [
        { type: "diagram", id: "cache-aside-pattern" },
        {
          type: "code",
          title: "Cache-aside pattern — the most common Redis caching pattern",
          code: `import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

// Cache-aside (also called lazy loading):
// 1. Check cache first
// 2. If miss: fetch from database, store in cache, return
// 3. On write: invalidate the cached key (do NOT update cache — fetch fresh on next read)

async function getProduct(productId: string) {
  const cacheKey = \`product:\${productId}\`;

  // 1. Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);  // cache hit — return immediately
  }

  // 2. Cache miss — fetch from database
  const product = await db.products.findById(productId);
  if (!product) return null;

  // 3. Store in cache with a 5-minute TTL
  await redis.setEx(cacheKey, 300, JSON.stringify(product));

  return product;
}

// On write — invalidate the cached entry so the next read fetches fresh data
async function updateProduct(productId: string, updates: Partial<Product>) {
  const updated = await db.products.update(productId, updates);

  // Invalidate the cache — do not try to update it (avoids race conditions)
  await redis.del(\`product:\${productId}\`);

  // Also invalidate any list caches that include this product
  await redis.del("products:list:*");  // use SCAN for production to avoid blocking Redis

  return updated;
}

// Cache warming — pre-populate the cache after a deploy to avoid a cold start spike
async function warmProductCache() {
  const popularProducts = await db.products.findPopular(limit: 100);
  const pipeline = redis.multi();
  for (const product of popularProducts) {
    pipeline.setEx(\`product:\${product.id}\`, 300, JSON.stringify(product));
  }
  await pipeline.exec();
}`,
        },
        {
          type: "table",
          headers: ["Pattern", "How writes work", "Consistency", "Best for"],
          rows: [
            ["Cache-aside (lazy loading)", "Write to DB, then delete the cached key. Next read triggers a DB fetch and re-populates the cache.", "Eventually consistent — brief window where cache is empty (or stale if you update instead of delete)", "Read-heavy workloads; most common pattern; safe default"],
            ["Write-through", "Write to cache and DB simultaneously. Cache is always warm after a write.", "Strong — cache and DB are always in sync immediately after a write", "Write-heavy workloads where reads must always hit the cache; adds write latency"],
            ["Write-behind (write-back)", "Write to cache immediately; asynchronously flush to DB in the background.", "Eventual — DB may be behind; data loss risk if cache fails before flush", "Very high write throughput where DB write latency is the bottleneck; requires careful durability design"],
            ["Read-through", "Cache sits in front of DB; cache handles DB fetches on miss automatically (no app code needed).", "Same as cache-aside — eventually consistent", "When you want to move cache logic out of application code; works well with Redis modules or ElastiCache"],
          ],
        },
      ],
    },
    {
      title: "Cache invalidation strategies",
      blocks: [
        {
          type: "paragraph",
          text: "Cache invalidation is famously called one of the two hard problems in computer science. The core challenge is keeping the cache in sync with the database without either serving stale data for too long or making the cache useless by invalidating too aggressively. The key insight is to match the TTL and invalidation strategy to how often the underlying data actually changes and how much staleness users can tolerate.",
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Time-based expiry (TTL): set a short TTL matching your tolerance for staleness. A product catalog can tolerate 5 minutes stale; a user's account balance cannot. Simple but imprecise — data might be invalidated while still fresh.",
            "Event-based invalidation: delete the cache key immediately when the underlying data changes. Precise — no stale data window after a write. More complex — every write path must also invalidate the cache.",
            "Cache versioning: instead of invalidating, change the cache key when the data changes (e.g. products:v2:{id}). Old keys expire naturally. Useful for infrequently changing config where you want zero-downtime cache updates.",
            "Cache stampede prevention: when a popular cache key expires, many requests try to fetch from the DB simultaneously. Use a distributed lock (Redis SETNX) or probabilistic early expiration: refresh the cache slightly before it expires rather than after.",
          ],
        },
        {
          type: "code",
          title: "Cache stampede prevention with a distributed lock",
          code: `async function getProductWithLock(productId: string) {
  const cacheKey = \`product:\${productId}\`;
  const lockKey = \`lock:product:\${productId}\`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Try to acquire a lock for 5 seconds
  const acquired = await redis.set(lockKey, "1", { NX: true, EX: 5 });

  if (acquired) {
    // We have the lock — fetch from DB and populate cache
    try {
      const product = await db.products.findById(productId);
      await redis.setEx(cacheKey, 300, JSON.stringify(product));
      return product;
    } finally {
      await redis.del(lockKey);  // always release the lock
    }
  } else {
    // Another instance is already fetching — wait and retry
    await new Promise(r => setTimeout(r, 50));
    const cached = await redis.get(cacheKey);
    return cached ? JSON.parse(cached) : null;
  }
}`,
        },
      ],
    },
    {
      title: "HTTP cache headers and CDN caching",
      blocks: [
        {
          type: "table",
          headers: ["Header", "What it controls", "Example value", "When to use"],
          rows: [
            ["Cache-Control: max-age", "How long a response can be cached by browsers and CDNs", "max-age=300 (5 minutes)", "Public API responses that do not vary per user and change infrequently"],
            ["Cache-Control: no-cache", "Response must be revalidated before use — cached but must check ETag/Last-Modified with the server", "no-cache", "Data that might change — lets the browser skip re-downloading if unchanged (304 Not Modified)"],
            ["Cache-Control: no-store", "Response must not be cached anywhere", "no-store", "Sensitive data: account details, financial records, session-specific responses"],
            ["Cache-Control: private", "Only the requesting browser may cache — CDNs must not cache", "private, max-age=300", "Personalized responses: user profile, shopping cart"],
            ["ETag", "Fingerprint of the response — client sends If-None-Match on next request", "ETag: \"abc123\"", "Any cacheable response — enables 304 Not Modified responses that save bandwidth"],
            ["Vary", "Tells caches to store separate copies per header value", "Vary: Accept-Encoding, Authorization", "Responses that differ based on Accept-Encoding (gzip vs brotli) or user authentication"],
          ],
        },
      ],
    },
    {
      title: "Load testing with k6",
      blocks: [
        {
          type: "code",
          title: "k6 load test — ramp from 10 to 100 virtual users",
          code: `// load-test.js — run with: k6 run load-test.js
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  // Ramp up, hold, then ramp down
  stages: [
    { duration: "30s", target: 10 },   // warm up: 0 → 10 VUs over 30 seconds
    { duration: "2m",  target: 100 },  // ramp up: 10 → 100 VUs over 2 minutes
    { duration: "3m",  target: 100 },  // hold: 100 VUs for 3 minutes
    { duration: "30s", target: 0 },    // ramp down: 100 → 0 VUs
  ],
  thresholds: {
    // Fail the test if these thresholds are not met
    "http_req_duration": ["p(95)<500", "p(99)<1000"],  // p95 < 500ms, p99 < 1s
    "http_req_failed":   ["rate<0.01"],                 // < 1% error rate
  },
};

export default function () {
  const BASE_URL = "https://api.example.com";

  // Test the product listing endpoint
  const res = http.get(\`\${BASE_URL}/api/products?page=1&limit=20\`, {
    headers: {
      Authorization: "Bearer test-token",
      "Content-Type": "application/json",
    },
  });

  // Assert on response — failures count toward http_req_failed metric
  check(res, {
    "status is 200":           r => r.status === 200,
    "response has products":   r => JSON.parse(r.body).products?.length > 0,
    "response time < 500ms":   r => r.timings.duration < 500,
  });

  sleep(1);  // simulate realistic think time between requests
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is the cache-aside pattern and when should you use it?",
      tag: "Caching patterns",
      answer: [
        "Cache-aside (lazy loading) means the application code manages the cache: check the cache first, fetch from the database on a miss, and store the result in the cache. On writes, delete the cached key so the next read fetches fresh data.",
        "Use it for read-heavy workloads where you want control over what gets cached and when. It is the safest pattern because you delete on write (instead of updating), which avoids race conditions where two processes write different values to the cache. Most applications should start here.",
      ].join("\n\n"),
    },
    {
      question: "How do you handle cache invalidation without serving stale data?",
      tag: "Cache invalidation",
      answer: [
        "The safest strategy is to delete the cache key on every write and let the next read re-populate it. This guarantees no stale data window after a write, at the cost of one cache miss per invalidation.",
        "If you update the cache instead of deleting it (write-through), you risk race conditions: two concurrent writes might write in the wrong order, leaving the cache with stale data. Deletion avoids this entirely. Use short TTLs as a safety net to prevent stale data from lingering too long even if a delete was missed.",
      ].join("\n\n"),
    },
    {
      question: "What is the difference between write-through and write-behind caching?",
      tag: "Caching patterns",
      answer: [
        "Write-through: every write goes to both the cache and the database synchronously. The caller waits for both to confirm. The cache is always warm and in sync with the database. The downside is that every write is slower (two writes instead of one).",
        "Write-behind (write-back): writes go to the cache immediately and are flushed to the database asynchronously in the background. Very fast writes — the caller does not wait for the database. The risk: if the cache fails before flushing, you lose the buffered writes. Only use write-behind when write throughput is critical and you have reliable cache durability (Redis persistence enabled).",
      ].join("\n\n"),
    },
    {
      question: "When should you NOT cache?",
      tag: "Caching decisions",
      answer: [
        "Do not cache data that must always be real-time accurate: account balances before a financial transaction, inventory counts during checkout, authentication tokens, rate limit counters. Stale data in these cases causes incorrect behavior.",
        "Do not cache data that varies per user with unique cache keys per user — at high user count this causes cache thrashing where every entry is a miss before it is evicted. Use user-specific caching only for genuinely expensive operations. Also do not cache writes or side effects — caching only makes sense for reads.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Add Redis caching to a database-backed endpoint using the cache-aside pattern — cache for 60 seconds and delete the key on update. Verify cache hits with redis-cli MONITOR.",
    "Set appropriate Cache-Control headers on a public product listing endpoint and verify with curl that a CDN or browser would cache the response for the expected duration.",
    "Write a k6 load test that ramps to 50 virtual users over 1 minute — identify the p95 and p99 latency of your API and find the endpoint that degrades first under load.",
  ],
} satisfies RoadmapDayDetail;
