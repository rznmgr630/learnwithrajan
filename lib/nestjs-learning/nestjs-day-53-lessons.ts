import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_53_LESSONS: LessonDay = {
  day: 53,
  title: "Rate Limiting",
  totalMinutes: 85,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-53-lesson-1",
      title: "Rate Limiting and Throttling",
      durationMinutes: 18,
      explanation: `
<b>Imagine you have just deployed your new SaaS API.</b> You have one hundred paying customers, each with a well-behaved integration. Life is good. Then one day, a single customer writes a buggy script that fires 50,000 requests per minute at your \`/products\` endpoint. Your database CPU hits 100%. Every other customer experiences timeouts. The one bad client has effectively denied service to everyone else.

This is the problem <b>rate limiting</b> solves. It puts a ceiling on how many requests a client can make in a given time window. When a client exceeds the limit, the server rejects further requests with \`429 Too Many Requests\` until the window resets. The bad client gets throttled; everyone else keeps working.

<b>Rate limiting and throttling are often used interchangeably, but there is a subtle difference.</b> Rate limiting is the policy — "you may make 100 requests per minute." Throttling is the enforcement — "you have made 100 requests, so I am now rejecting you." In practice, people use the terms loosely. What matters is the mechanism: counting requests per identity per time window, and rejecting when the count exceeds the limit.

<b>Why does rate limiting exist?</b> There are several distinct reasons, and they matter because they shape how you design the limits:

<b>1. Protect the infrastructure.</b> A single client (malicious or buggy) should not be able to exhaust database connections, memory, or CPU. Rate limits are a blast radius control.

<b>2. Fairness.</b> In a multi-tenant system, one tenant's heavy usage should not degrade the experience for others. Rate limits give every tenant a fair share of capacity.

<b>3. Cost control.</b> If your API calls expensive downstream services (LLM APIs, payment processors, third-party data providers), a rate limit caps your exposure. A bug in a client script cannot run up a $50,000 bill overnight.

<b>4. Security.</b> Brute-force attacks on login endpoints, credential stuffing, and scraping are all much harder when the attacker is limited to, say, 5 attempts per minute per IP.

<b>5. Business tiers.</b> Many SaaS APIs sell different rate limits as part of their pricing: Free tier gets 100 requests/minute, Pro gets 1,000, Enterprise gets 10,000. Rate limiting is a product feature, not just a safety mechanism.

<b>How beginners usually encounter this:</b> they integrate with the GitHub API, send a burst of requests, and see \`403 Forbidden\` with headers like \`X-RateLimit-Remaining: 0\`. Or they build their own API and discover on launch day that a single client can take down the whole service. Then they learn rate limiting.

<b>The core mechanic is simple:</b> for each identity (IP, user id, API key), maintain a counter. On each request, increment the counter. If the counter exceeds the limit within the time window, reject. When the window resets, the counter resets.

In pseudocode:

\`\`\`
key = "ratelimit:" + identity
count = increment(key)
if count == 1: set_expiry(key, window_seconds)
if count > limit: return 429
allow request
\`\`\`

That is the essence. The complexity comes from the algorithms used to implement the counting (lesson 2), the storage used to share the counters across instances (lesson 3), and the framework integration that wires it all together (lesson 4).

<b>What can go wrong?</b>
- <b>No rate limiting at all.</b> A single buggy client or attacker can bring down the service. This is the most common and most costly mistake.
- <b>Rate limiting only at the edge.</b> If you rely solely on an API gateway and skip application-level limits, a misconfigured gateway or a bypassed route leaves you exposed.
- <b>Global rate limits with no per-client fairness.</b> A single global "10,000 requests per minute" does not prevent one client from consuming all 10,000. Limits must be per-identity.
- <b>Fixed windows with no burst allowance.</b> A strict 100-per-minute limit that resets every minute means a client can send 200 requests in two seconds (100 at the end of one window, 100 at the start of the next). This is the boundary spike problem.
- <b>No \`Retry-After\` header.</b> Clients have no idea when to retry and hammer the endpoint, making things worse.
- <b>Rate limiting internal endpoints.</b> Health checks and metrics endpoints should be exempt from rate limiting. A rate limiter that blocks \`/health\` can cause the orchestrator to kill healthy pods.
- <b>In-memory counters in a multi-instance deployment.</b> If you run three replicas and each has its own in-memory counter, a client can make 3x the intended limit. This is lesson 3's problem.

<b>How this appears in a real application:</b> a payments platform applies different limits to different endpoints:
- \`POST /auth/login\`: 5 requests per minute per IP (brute-force protection).
- \`POST /charges\`: 100 requests per minute per API key (cost control).
- \`GET /products\`: 1,000 requests per minute per API key (generous, read-heavy).
- \`POST /webhooks/test\`: 10 requests per minute per API key (expensive downstream calls).

Each endpoint's limit reflects its cost and abuse potential. The limits are enforced per API key, not globally, so one merchant's traffic does not affect another's.

<b>How experienced engineers think:</b> rate limiting is not a single number. It is a policy that varies by endpoint, identity, and tier. The right question is not "what limit should we use?" but "what are we protecting, who is the client, and what happens when they exceed the limit?" Those answers shape everything else.

The rest of today's lessons cover the algorithms that implement rate limiting (lesson 2), how to share counters across instances with Redis (lesson 3), and how to wire it all up in NestJS (lesson 4).
      `,
      diagram: `
Rate Limiting Concept

  Identity: user_42 / API key / IP
      |
      |  Each request increments a counter for the window
      v
  +-----------------------------+
  |  Window: 60 seconds          |
  |  Limit: 100 requests         |
  |                              |
  |  Count: 23 -> allow          |
  |  Count: 24 -> allow          |
  |  ...                         |
  |  Count: 100 -> allow         |
  |  Count: 101 -> 429 REJECT    |
  +-----------------------------+
      |
      v
  Response includes headers:
    X-RateLimit-Limit: 100
    X-RateLimit-Remaining: 0
    X-RateLimit-Reset: <timestamp>
    Retry-After: 30

Different limits per endpoint:
  POST /auth/login   ->   5 / min / IP
  POST /charges      -> 100 / min / API key
  GET  /products     -> 1000 / min / API key
  GET  /health       -> unlimited (exempt)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// RATE LIMITING CONCEPT — BASIC PSEUDOCODE
// ============================================

// The simplest possible in-memory rate limiter.
// NOT for production (single instance only), but useful to understand
// the mechanic before moving to Redis or @nestjs/throttler.

class SimpleRateLimiter {
  private counts = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  check(identity: string): boolean {
    const now = Date.now();
    const entry = this.counts.get(identity);

    // No entry, or the window has expired: start fresh.
    if (!entry || entry.resetAt <= now) {
      this.counts.set(identity, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return true;
    }

    // Within the window: increment and check.
    entry.count++;
    if (entry.count > this.limit) {
      return false; // -> HTTP 429
    }
    return true;
  }

  // Useful for X-RateLimit-Remaining headers.
  remaining(identity: string): number {
    const entry = this.counts.get(identity);
    if (!entry || entry.resetAt <= Date.now()) return this.limit;
    return Math.max(0, this.limit - entry.count);
  }
}

// Usage in a NestJS guard (sketch).
// See lesson 4 for the real @nestjs/throttler integration.
@Injectable()
export class SimpleThrottleGuard implements CanActivate {
  private readonly limiter = new SimpleRateLimiter(100, 60_000);

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const identity = req.user?.id ?? req.ip;

    if (!this.limiter.check(identity)) {
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
    }
    return true;
  }
}

// Why this is not production-ready:
//   1. In-memory -> each instance has its own counters.
//   2. No persistence -> restart resets everyone.
//   3. No distributed coordination -> see lesson 3.
//   4. Simple fixed window -> boundary spikes -> see lesson 2.
      ` },
      keyTakeaways: [
        "Rate limiting caps how many requests a client can make in a time window; exceeding the cap returns `429 Too Many Requests`.",
        "Rate limiting protects infrastructure, ensures fairness across tenants, controls cost, defends against abuse, and enables tiered pricing.",
        "Limits must be per-identity (IP, user, API key), not global — a single global limit does not prevent one client from consuming everything.",
        "Different endpoints should have different limits based on cost and abuse potential (login: strict, read-heavy list: generous).",
        "Always return `Retry-After` and `X-RateLimit-*` headers so clients can back off gracefully.",
        "Exempt health and metrics endpoints from rate limiting so orchestrators do not kill healthy pods.",
        "In-memory rate limiters break in multi-instance deployments — each replica has its own counter.",
      ],
      commonMistakes: [
        "<b>No rate limiting at all.</b> One buggy client or attacker can take down the service for everyone. Add rate limiting before you need it.",
        "<b>Global rate limits instead of per-identity.</b> '10,000 per minute' shared by all clients means one client can consume all 10,000. Always scope by identity.",
        "<b>Rate limiting health and metrics endpoints.</b> Orchestrators (Kubernetes, ECS) poll these; a 429 can cause the platform to restart or kill healthy pods.",
        "<b>Fixed windows without burst allowance.</b> A strict per-minute counter allows a client to send 200 requests in two seconds at a window boundary. Consider token bucket or sliding window (lesson 2).",
        "<b>No `Retry-After` header.</b> Without it, clients retry immediately and amplify the load. Always include `Retry-After`.",
        "<b>Rate limiting only at the API gateway.</b> A misconfigured gateway or a bypassed route leaves the application exposed. Add application-level limits as a second layer.",
        "<b>Forgetting about trusted proxies.</b> Behind a load balancer, `req.ip` is the load balancer's IP, not the client's. Enable `trust proxy` (lesson 4).",
      ],
      quiz: [
        {
          question:
            "Why is a single global rate limit (e.g. '10,000 requests per minute for the whole API') insufficient?",
          options: [
            "Because global limits are slower to compute.",
            "Because one client can consume the entire global budget, leaving nothing for other clients — limits must be per-identity.",
            "Because global limits are not supported by Redis.",
            "Because HTTP does not allow global limits.",
          ],
          correctIndex: 1,
          explanation:
            "A global limit protects the server from total overload but does not prevent one client from monopolizing the quota. Per-identity limits ensure fairness across clients.",
        },
        {
          question:
            "Which endpoint should have the strictest rate limit?",
          options: [
            "`GET /health`",
            "`GET /products` (read-heavy list)",
            "`POST /auth/login`",
            "`GET /metrics`",
          ],
          correctIndex: 2,
          explanation:
            "Login endpoints are targets for brute-force and credential-stuffing attacks. They should have very strict limits (e.g. 5 per minute per IP). Health and metrics should be exempt or very generous.",
        },
        {
          question:
            "What is the 'boundary spike' problem with fixed-window rate limiting?",
          options: [
            "The counter overflows.",
            "A client can make 2x the limit in a short period by sending requests at the end of one window and the start of the next.",
            "The window never resets.",
            "The server crashes.",
          ],
          correctIndex: 1,
          explanation:
            "Fixed windows align to clock boundaries. A client can send 100 requests at 11:59:59 and another 100 at 12:00:00, resulting in 200 requests in two seconds while technically staying within '100 per minute' for each window.",
        },
      ],
    },
    {
      id: "day-53-lesson-2",
      title: "Token Bucket and Sliding Window",
      durationMinutes: 24,
      explanation: `
<b>You already know rate limiting caps requests per window.</b> The question is how the counting works. The algorithm you choose determines the trade-off between accuracy, burst tolerance, memory usage, and implementation complexity. There are three algorithms every backend engineer should know: <b>fixed window</b>, <b>sliding window</b>, and <b>token bucket</b>.

<b>Fixed Window Counter.</b> The simplest algorithm. Divide time into fixed windows (e.g. every 60 seconds starting at :00). Maintain a counter per identity per window. Increment on each request. If the counter exceeds the limit, reject. Reset the counter when the window ends.

\`\`\`
Window 1 (12:00:00 - 12:00:59): counter = 5, limit = 100 -> allow
Window 2 (12:01:00 - 12:01:59): counter = 0 -> fresh start
\`\`\`

<b>Pros:</b> trivial to implement, minimal memory (one integer per identity per window), fast.
<b>Cons:</b> the boundary spike problem. A client can send 100 requests at 11:59:59 and 100 more at 12:00:00, effectively getting 200 requests in two seconds. For many APIs this is acceptable. For strict SLA-bound APIs it is not.

<b>Sliding Window Log.</b> Instead of counting per window, store the timestamp of every request in a list (or sorted set). To check the limit, count how many timestamps fall within the last N seconds. Remove old timestamps as they fall out of the window.

\`\`\`
Timestamps: [12:00:01, 12:00:05, 12:00:12, 12:00:45, ...]
Window: last 60 seconds
Count timestamps >= (now - 60s)
If count >= limit -> reject
\`\`\`

<b>Pros:</b> exact enforcement. There is no boundary problem; the window truly rolls.
<b>Cons:</b> memory. You store one entry per request. A client making 1,000 requests per minute means 1,000 entries in the sorted set per minute. At scale this becomes expensive.

<b>Sliding Window Counter (approximation).</b> A hybrid that avoids both the boundary problem and the memory cost. It keeps two fixed-window counters — the current window and the previous window — and estimates the count in the rolling window with a weighted sum:

\`\`\`
estimated_count = previous_window_count * (1 - elapsed_fraction)
                + current_window_count
\`\`\`

For example, if 30 seconds have elapsed in the current 60-second window (elapsed fraction = 0.5), and the previous window had 80 requests, and the current window has 20 requests:

\`\`\`
estimated = 80 * 0.5 + 20 = 60
\`\`\`

If the limit is 100, the request is allowed. This approximation is very close to exact and uses only two integers per identity. It is what many production systems use (Cloudflare, for example, uses a variant).

<b>Pros:</b> smooths out boundary spikes, low memory.
<b>Cons:</b> approximate. A client could theoretically exceed the exact limit by a small margin, but the error is small in practice.

<b>Token Bucket.</b> The most popular algorithm for APIs that want to allow bursts while enforcing a long-term average rate. Imagine a bucket that holds tokens:
- The bucket has a maximum capacity (e.g. 100 tokens).
- Tokens refill at a steady rate (e.g. 10 tokens per second).
- Each request consumes one token.
- If the bucket has at least one token, the request is allowed.
- If the bucket is empty, the request is rejected.

\`\`\`
Bucket capacity: 100
Refill rate: 10 tokens/second
Current tokens: 45

Request arrives -> consume 1 token -> 44 tokens -> allow
Request arrives -> consume 1 token -> 43 tokens -> allow
...
Request arrives -> bucket empty -> reject (429)
\`\`\`

<b>Why is this powerful?</b> Because it naturally supports bursts. A client that has been idle accumulates tokens up to the bucket capacity, then can fire a burst of up to 100 requests in one second. After the burst, they are limited to the refill rate (10 per second) for steady-state traffic.

This matches how real clients behave: a user loads a dashboard and fires 20 requests at once, then sits idle for a minute. A fixed window limiter would reject the burst if it happens near the window boundary. A token bucket allows it and refills during the idle time.

<b>Token bucket parameters:</b>
- <b>Capacity (or Burst):</b> maximum tokens the bucket can hold — the largest burst allowed.
- <b>Refill rate:</b> tokens added per interval — the long-term average rate.
- <b>Cost per request:</b> usually 1, but expensive endpoints can consume more (e.g. a complex GraphQL query costs 10 tokens).

\`\`\`typescript
// Conceptual token bucket state
interface Bucket {
  tokens: number;       // current tokens
  lastRefill: number;   // timestamp of last refill
  capacity: number;     // max tokens
  refillRate: number;   // tokens per second
}

function allow(bucket: Bucket, cost = 1): boolean {
  const now = Date.now();
  const elapsed = (now - bucket.lastRefill) / 1000;
  bucket.tokens = Math.min(
    bucket.capacity,
    bucket.tokens + elapsed * bucket.refillRate,
  );
  bucket.lastRefill = now;

  if (bucket.tokens >= cost) {
    bucket.tokens -= cost;
    return true;
  }
  return false;
}
\`\`\`

<b>Comparing the algorithms:</b>

| Algorithm | Boundary spike | Burst allowance | Memory | Accuracy |
|-----------|----------------|-----------------|--------|----------|
| Fixed window | Yes | No | Very low | Approximate |
| Sliding window log | No | No (strict) | High | Exact |
| Sliding window counter | No | Small | Low | Approximate |
| Token bucket | No | Yes (up to capacity) | Low | Exact |

<b>How to choose:</b>
- <b>Fixed window:</b> simple, low-traffic APIs, admin endpoints where occasional spikes are fine.
- <b>Sliding window log:</b> strict SLA-bound APIs, small-scale where memory is not a concern.
- <b>Sliding window counter:</b> general-purpose, balanced choice for most APIs.
- <b>Token bucket:</b> APIs that want to allow bursts (SDK clients, dashboard loading, batch operations), cost-based throttling (Shopify's GraphQL model uses this), and any API where "average rate" matters more than "instantaneous rate."

<b>What can go wrong?</b>
- <b>Using fixed window for endpoints that matter.</b> Boundary spikes can let a client exceed the intended limit by 2x. Use sliding or token bucket for critical endpoints.
- <b>Setting the bucket capacity too high.</b> A capacity of 100,000 means a client can fire 100,000 requests in one second. That may be more than your infrastructure can handle. Match capacity to what your servers can actually absorb in a burst.
- <b>Setting the refill rate too low.</b> A refill rate of 1 token per minute for a limit of 60 per minute means a client can never accumulate a useful burst. Set refill to match the intended long-term rate.
- <b>Ignoring the cost parameter.</b> A single expensive endpoint can do the work of 100 cheap ones. Token buckets support cost per request — use it for expensive operations.
- <b>Mixing algorithms across endpoints without documentation.</b> Clients cannot predict behavior. Document which algorithm each limit uses and what headers they can expect.
- <b>Sliding window log memory explosion.</b> Storing every request timestamp for a high-traffic client can consume gigabytes. Prefer the sliding window counter approximation for high-traffic scenarios.
- <b>Clock skew between servers.</b> If different servers compute \`now\` differently, sliding windows diverge. Use the storage layer's clock (e.g. Redis \`TIME\`) for consistency.

<b>How this appears in a real application:</b> a public API uses a token bucket per API key with a capacity of 500 and a refill rate of 100 per second. This means a well-behaved client can fire a burst of 500 requests at once (e.g. when loading a dashboard with 20 widgets) and then sustain 100 requests per second. A client that has been idle overnight can fire 500 in a burst; a client that has been hammering the API is limited to the refill rate. The headers tell the client what to expect:

\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 342
X-RateLimit-Reset: 1712345678
\`\`\`

The client SDK reads these and backs off accordingly.

<b>How experienced engineers think:</b> the algorithm is a policy decision, not an implementation detail. Token bucket says "bursts are allowed, average rate is enforced." Sliding window log says "strict, no bursts." Fixed window says "cheap and good enough." Choose deliberately, document clearly, and make the choice visible in the API headers.
      `,
      diagram: `
Rate Limiting Algorithms

FIXED WINDOW
  Window 1 (12:00-12:59)  Window 2 (12:01-12:59)
  [====== count ======]   [====== count ======]
  Boundary spike at 12:00:00 -> 2x limit possible.

SLIDING WINDOW LOG
  Store each request timestamp.
  [t1 t2 t3 t4 t5 t6 t7 t8 ...]
  Check how many fall within (now - 60s).
  Exact, but memory grows with request count.

SLIDING WINDOW COUNTER (approximation)
  previous_count * (1 - elapsed_fraction) + current_count
  [prev: 80][curr: 20]
  estimated = 80 * 0.5 + 20 = 60

TOKEN BUCKET
  +-------------------+
  | tokens: 45/100    |  capacity = 100 (max burst)
  | refill: 10/sec    |  refill rate = long-term average
  +-------------------+
       |
       | each request consumes 1 (or cost) token
       v
  if tokens >= cost: allow, tokens -= cost
  else: reject (429)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// RATE LIMITING ALGORITHMS — IMPLEMENTATIONS
// ============================================

// ---------- 1. Fixed Window ----------
class FixedWindowLimiter {
  private counters = new Map<string, { count: number; windowStart: number }>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  check(identity: string): boolean {
    const now = Date.now();
    const windowStart = Math.floor(now / this.windowMs) * this.windowMs;
    const key = \`\${identity}:\${windowStart}\`;

    const entry = this.counters.get(key);
    if (!entry) {
      this.counters.set(key, { count: 1, windowStart });
      return true;
    }
    entry.count++;
    return entry.count <= this.limit;
  }
}

// ---------- 2. Sliding Window Log (exact) ----------
class SlidingWindowLogLimiter {
  private logs = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  check(identity: string): boolean {
    const now = Date.now();
    const cutoff = now - this.windowMs;

    let timestamps = this.logs.get(identity) ?? [];
    // Remove timestamps outside the window.
    timestamps = timestamps.filter((t) => t > cutoff);

    if (timestamps.length >= this.limit) {
      this.logs.set(identity, timestamps);
      return false;
    }

    timestamps.push(now);
    this.logs.set(identity, timestamps);
    return true;
  }
}

// ---------- 3. Sliding Window Counter (approximation) ----------
class SlidingWindowCounterLimiter {
  private windows = new Map<string, { prev: number; curr: number; windowStart: number }>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  check(identity: string): boolean {
    const now = Date.now();
    const windowStart = Math.floor(now / this.windowMs) * this.windowMs;
    const elapsed = (now - windowStart) / this.windowMs;

    let entry = this.windows.get(identity);
    if (!entry || entry.windowStart !== windowStart) {
      // Roll the window: previous becomes current, current resets.
      entry = {
        prev: entry?.curr ?? 0,
        curr: 0,
        windowStart,
      };
      this.windows.set(identity, entry);
    }

    // Estimate: previous window weighted by remaining time + current window.
    const estimated = entry.prev * (1 - elapsed) + entry.curr;
    if (estimated >= this.limit) {
      return false;
    }
    entry.curr++;
    return true;
  }
}

// ---------- 4. Token Bucket (burst-friendly) ----------
class TokenBucketLimiter {
  private buckets = new Map<string, { tokens: number; lastRefill: number }>();

  constructor(
    private readonly capacity: number,       // max burst
    private readonly refillRate: number,     // tokens per second
  ) {}

  check(identity: string, cost = 1): boolean {
    const now = Date.now();
    let bucket = this.buckets.get(identity);

    if (!bucket) {
      bucket = { tokens: this.capacity, lastRefill: now };
      this.buckets.set(identity, bucket);
    } else {
      const elapsedSec = (now - bucket.lastRefill) / 1000;
      bucket.tokens = Math.min(
        this.capacity,
        bucket.tokens + elapsedSec * this.refillRate,
      );
      bucket.lastRefill = now;
    }

    if (bucket.tokens >= cost) {
      bucket.tokens -= cost;
      return true;
    }
    return false;
  }

  // Useful for X-RateLimit-Remaining headers.
  remaining(identity: string): number {
    const bucket = this.buckets.get(identity);
    if (!bucket) return this.capacity;
    const elapsedSec = (Date.now() - bucket.lastRefill) / 1000;
    return Math.min(
      this.capacity,
      Math.floor(bucket.tokens + elapsedSec * this.refillRate),
    );
  }
}

// ---------- 5. Choosing a cost for expensive endpoints ----------
// Token bucket naturally supports per-request cost, unlike the
// window-based algorithms.
const limiter = new TokenBucketLimiter(100, 10); // 100 burst, 10/sec

// A cheap read costs 1 token.
limiter.check('user_42', 1);

// A complex GraphQL query costs 10 tokens.
limiter.check('user_42', 10);

// An expensive report generation costs 50 tokens.
limiter.check('user_42', 50);

// ---------- 6. Recommended headers ----------
// X-RateLimit-Limit: total allowed in the window (or capacity)
// X-RateLimit-Remaining: how many are left
// X-RateLimit-Reset: Unix timestamp when the counter resets
// Retry-After: seconds until the client may retry
      ` },
      keyTakeaways: [
        "Fixed window is simple but allows boundary spikes; a client can get 2x the limit at window boundaries.",
        "Sliding window log is exact but memory-heavy — it stores one entry per request.",
        "Sliding window counter approximates the rolling window with two integers, smoothing boundary spikes at low cost.",
        "Token bucket allows bursts up to the bucket capacity while enforcing a long-term average refill rate.",
        "Token bucket supports cost per request, useful for expensive endpoints (GraphQL queries, reports, image generation).",
        "Choose the algorithm based on the trade-off between burst tolerance, memory, and strictness.",
        "Document the algorithm and headers so clients can predict behavior and back off correctly.",
      ],
      commonMistakes: [
        "<b>Using fixed window for critical endpoints.</b> Boundary spikes let clients exceed the intended limit by up to 2x. Use sliding window or token bucket when accuracy matters.",
        "<b>Setting token bucket capacity too high.</b> A capacity of 100,000 lets a client fire 100,000 requests in one second, potentially overwhelming the infrastructure. Match capacity to what the servers can absorb.",
        "<b>Ignoring the cost parameter for expensive endpoints.</b> A single expensive operation can consume the same resources as hundreds of cheap ones. Use weighted costs in token buckets.",
        "<b>Sliding window log memory explosion.</b> Storing every request timestamp for a high-traffic client consumes memory fast. Use the sliding window counter approximation at scale.",
        "<b>Clock skew across servers.</b> Sliding windows depend on consistent time. Use the storage layer's clock (e.g. Redis `TIME`) rather than the application server's clock.",
        "<b>Mixing algorithms without documentation.</b> Clients cannot predict behavior or back off correctly. Document the algorithm per endpoint.",
      ],
      quiz: [
        {
          question:
            "Which rate limiting algorithm allows a client to make a burst of requests after being idle?",
          options: [
            "Fixed window",
            "Sliding window log",
            "Token bucket",
            "None — bursts are never allowed",
          ],
          correctIndex: 2,
          explanation:
            "Token bucket accumulates tokens during idle periods up to the bucket capacity, then allows a burst of up to that capacity. This matches real client behavior like loading a dashboard with many widgets.",
        },
        {
          question:
            "What is the main disadvantage of the sliding window log algorithm?",
          options: [
            "It allows boundary spikes.",
            "It stores one entry per request, consuming significant memory at scale.",
            "It cannot be distributed across instances.",
            "It rejects all bursts.",
          ],
          correctIndex: 1,
          explanation:
            "The sliding window log stores every request timestamp in the window. For a client making 10,000 requests per minute, that is 10,000 entries per identity, which becomes expensive. The sliding window counter avoids this with two integers.",
        },
        {
          question:
            "You want to limit a GraphQL endpoint where a simple query costs 1 point and a complex mutation costs 20 points. Which algorithm fits best?",
          options: [
            "Fixed window",
            "Sliding window log",
            "Token bucket with a cost parameter",
            "None of the above",
          ],
          correctIndex: 2,
          explanation:
            "Token bucket natively supports a cost per request. Each request consumes a variable number of tokens based on its complexity, which aligns with the actual resource consumption of GraphQL operations.",
        },
        {
          question:
            "What is the boundary spike problem in fixed window rate limiting?",
          options: [
            "The counter overflows.",
            "A client can send 2x the limit by timing requests at the end of one window and the start of the next.",
            "The window never resets.",
            "The server crashes.",
          ],
          correctIndex: 1,
          explanation:
            "Fixed windows align to clock boundaries. A client can send the full limit at 11:59:59 and another full limit at 12:00:00, effectively doubling the intended rate. Sliding windows smooth this out.",
        },
      ],
    },
    {
      id: "day-53-lesson-3",
      title: "Distributed Rate Limiting with Redis",
      durationMinutes: 22,
      explanation: `
<b>Your NestJS API runs on three replicas behind a load balancer.</b> You add in-memory rate limiting to each instance. A client hitting all three replicas can make three times the intended limit because each instance counts independently. The limit is not actually enforced — it is three separate limits.

This is the fundamental problem of distributed rate limiting. Counters must be shared across all instances. The standard solution is to use a shared data store — usually Redis — as the source of truth for counters. Every replica increments the same Redis key, so the limit is global.

<b>Why Redis?</b>
- <b>Atomic operations.</b> \`INCR\` and \`EXPIRE\` are atomic, so concurrent increments from multiple replicas do not race.
- <b>Lua scripting.</b> Complex read-compute-write logic (like token bucket refill calculations) can run atomically inside Redis.
- <b>Speed.</b> Redis operates in memory, so a rate limit check adds 1–2 ms of latency.
- <b>TTL support.</b> Counters expire automatically, so cleanup is handled for you.
- <b>Widely available.</b> Every cloud provider offers Redis as a managed service.

<b>The simple INCR approach.</b> The simplest distributed rate limiter uses Redis \`INCR\`:

\`\`\`typescript
async check(identity: string): Promise<boolean> {
  const key = \`ratelimit:\${identity}\`;
  const count = await this.redis.incr(key);

  if (count === 1) {
    // First request in this window: set the expiry.
    await this.redis.expire(key, this.windowSeconds);
  }

  return count <= this.limit;
}
\`\`\`

This works and is what many production systems use for fixed-window rate limiting. The \`INCR\` command is atomic, so 100 concurrent requests from three replicas will increment the counter 100 times and the 101st will be rejected.

<b>The problem with INCR: race conditions on EXPIRE.</b> If the process crashes between \`INCR\` and \`EXPIRE\`, the key never expires, and the client is permanently locked out. Or if the key exists without a TTL (e.g. from a failed earlier attempt), the counter grows forever. The fix is to use a Lua script that performs both operations atomically, or to use \`SET\` with \`EX\` and \`NX\` for the first increment.

<b>Lua scripting for atomicity.</b> Redis Lua scripts run atomically — no other command can interleave between the steps. This is essential for algorithms like token bucket that need to read the current state, compute the refill, check the limit, and write the new state. If these steps were not atomic, two concurrent requests could both read the same token count, both decide to allow, and both decrement — allowing 2x the limit.

Here is a token bucket Lua script:

\`\`\`lua
-- KEYS[1]: bucket key
-- ARGV[1]: capacity (max tokens)
-- ARGV[2]: refill rate (tokens per second)
-- ARGV[3]: now (timestamp in seconds, float)
-- ARGV[4]: cost (tokens for this request)

local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local cost = tonumber(ARGV[4])

-- Get current state: tokens and last refill time.
local state = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(state[1]) or capacity
local last_refill = tonumber(state[2]) or now

-- Refill tokens based on elapsed time.
local elapsed = math.max(0, now - last_refill)
tokens = math.min(capacity, tokens + elapsed * refill_rate)

-- Check if enough tokens are available.
if tokens < cost then
  -- Save the refilled state (even on rejection) and reject.
  redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
  redis.call('EXPIRE', key, math.ceil(capacity / refill_rate) + 10)
  return { 0, math.floor(tokens), 0 }
end

-- Consume tokens and allow.
tokens = tokens - cost
redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
redis.call('EXPIRE', key, math.ceil(capacity / refill_rate) + 10)

return { 1, math.floor(tokens), cost }
\`\`\`

This script is called with \`EVALSHA\` for performance. Redis caches compiled scripts by their SHA1 hash, so the script text is not transmitted on every call. If Redis restarts and the cache is flushed, the client catches the \`NOSCRIPT\` error and falls back to \`EVAL\`, reloading the script.

<b>Sliding window with sorted sets.</b> For a distributed sliding window log, use a Redis sorted set (ZSET). The score is the request timestamp, and the member is a unique value (to allow multiple requests at the same millisecond).

\`\`\`lua
-- KEYS[1]: zset key
-- ARGV[1]: now_ms
-- ARGV[2]: window_ms
-- ARGV[3]: limit

local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local cutoff = now - window

-- Remove entries outside the window.
redis.call('ZREMRANGEBYSCORE', key, 0, cutoff)

-- Count remaining entries.
local count = redis.call('ZCARD', key)

if count >= limit then
  -- Deny: compute retry-after from the oldest entry.
  local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  local retry_after = oldest[2] and (oldest[2] + window - now) or window
  return { 0, count, retry_after }
end

-- Allow: add this request.
redis.call('ZADD', key, now, now .. ':' .. math.random(1000000))
redis.call('PEXPIRE', key, window)
return { 1, count + 1, 0 }
\`\`\`

The Lua script runs atomically, so two replicas cannot both pass the check and both add to the ZSET. The \`PEXPIRE\` refreshes the TTL on each request so idle keys are cleaned up automatically.

<b>Sliding window counter with two keys.</b> An alternative to the ZSET approach is to use two integer keys — one for the previous window and one for the current window. This is what the \`@nestjs/throttler\` in-memory storage does, and it can be ported to Redis with a Lua script.

<b>Redis cluster considerations.</b> In a Redis Cluster setup, keys are distributed across shards. For rate limiting, all operations for a given identity should go to the same shard. The natural way to ensure this is to use a hash tag: \`ratelimit:{user_42}:tokens\`. The \`{user_42}\` part is the hash tag — Redis hashes it and routes all keys with the same tag to the same shard. This guarantees that read-modify-write operations on the same identity are not split across shards.

<b>Fail-open vs fail-closed.</b> What happens if Redis is unavailable? Two choices:
- <b>Fail-open:</b> allow the request. The API stays up, but rate limits are not enforced during the outage. Good for availability-critical APIs.
- <b>Fail-closed:</b> reject the request. Rate limits are always enforced, but a Redis outage takes down your API. Good for security-critical endpoints (login).

Most production systems fail-open for general APIs and fail-closed for auth endpoints. Document the choice.

<b>Performance.</b> A Redis round-trip is typically 1–2 ms depending on network proximity. For an API call that already takes 20–50 ms, adding 1–2 ms is acceptable. If the endpoint is extremely latency-sensitive, consider a local cache of "known over-limit" decisions that is refreshed periodically from Redis. This trades accuracy for speed.

<b>What can go wrong?</b>
- <b>Non-atomic check-and-set.</b> Reading the counter, checking, and writing without atomicity allows concurrent requests to both pass. Always use Lua scripts or atomic Redis commands.
- <b>Missing TTL.</b> Keys without expiry accumulate forever and consume memory. Every rate limit key must have a TTL.
- <b>Redis as a single point of failure.</b> If Redis goes down and you fail-closed, your API goes down. Use Redis Sentinel or Cluster for high availability.
- <b>Hot keys.</b> A single very active identity can overload the Redis shard holding its key. For extreme scale, consider sharding by a finer-grained identity or using local counters with periodic sync.
- <b>Clock skew.</b> If different servers compute \`now\` differently, sliding windows diverge. Use Redis's \`TIME\` command inside the Lua script to get a consistent clock.
- <b>No monitoring.</b> Rate limit rejections should be visible in metrics. A spike in 429s means clients are being throttled — you need to know.
- <b>Forgetting to close connections.</b> In NestJS, the Redis client must be closed on application shutdown. Use \`OnModuleDestroy\` or the lifecycle hooks provided by the Redis module.

<b>How this appears in a real application:</b> a multi-tenant SaaS API runs 12 replicas behind an AWS ALB. Rate limiting uses a Redis Cluster with a token bucket Lua script. Each API key has its own bucket key with a hash tag. The Redis client uses \`ioredis\` with automatic reconnection. Rate limit checks add ~1.5 ms of latency. During a Redis failover, the application fails open for read endpoints and fails closed for write endpoints. Metrics track \`rate_limit_rejected_total\` per tenant and per endpoint, so the team can see who is being throttled and tune limits accordingly.

<b>How experienced engineers think:</b> distributed rate limiting is not just "put a counter in Redis." It requires atomic operations (Lua), TTL management, cluster-aware key routing, failure policy, and monitoring. The extra complexity is worth it because the alternative — a limit that does not actually limit — is worse than no limit at all.
      `,
      diagram: `
Distributed Rate Limiting with Redis

  Replica 1        Replica 2        Replica 3
      |                |                |
      |  INCR key      |  INCR key      |  INCR key
      v                v                v
  +---------------------------------------------+
  |  Redis (shared counter)                     |
  |  ratelimit:{user_42} -> 47                  |
  |  TTL: 60s                                   |
  +---------------------------------------------+
      |
      |  If 47 > limit: return 429 to that replica
      v
  All replicas see the same counter.

Atomicity with Lua:
  EVALSHA <sha> 1 ratelimit:{user_42} capacity refill now cost
  -> Redis executes the whole script atomically
  -> No other command interleaves
  -> Safe under concurrent requests from multiple replicas

Key routing in Redis Cluster:
  ratelimit:{user_42}:tokens    <- hash tag {user_42}
  All keys with {user_42} go to the same shard.

Failure policy:
  Redis down + fail-open   -> allow requests (availability)
  Redis down + fail-closed -> reject requests (safety)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// DISTRIBUTED RATE LIMITING WITH REDIS
// ============================================

// ---------- 1. Redis client setup with ioredis ----------
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public readonly client: Redis;

  constructor(config: ConfigService) {
    this.client = new Redis({
      host: config.get('REDIS_HOST', 'localhost'),
      port: config.get('REDIS_PORT', 6379),
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}

// ---------- 2. Token bucket Lua script ----------
const TOKEN_BUCKET_SCRIPT = \`
  local key = KEYS[1]
  local capacity = tonumber(ARGV[1])
  local refill_rate = tonumber(ARGV[2])
  local now = tonumber(ARGV[3])
  local cost = tonumber(ARGV[4])

  local state = redis.call('HMGET', key, 'tokens', 'last_refill')
  local tokens = tonumber(state[1]) or capacity
  local last_refill = tonumber(state[2]) or now

  local elapsed = math.max(0, now - last_refill)
  tokens = math.min(capacity, tokens + elapsed * refill_rate)

  if tokens < cost then
    redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
    redis.call('EXPIRE', key, math.ceil(capacity / refill_rate) + 10)
    return { 0, math.floor(tokens), 0 }
  end

  tokens = tokens - cost
  redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
  redis.call('EXPIRE', key, math.ceil(capacity / refill_rate) + 10)

  return { 1, math.floor(tokens), cost }
\`;

// ---------- 3. Rate limiter service ----------
@Injectable()
export class DistributedRateLimiter {
  private scriptSha: string | null = null;

  constructor(private readonly redis: RedisService) {}

  // Load the script once at startup.
  async onModuleInit() {
    this.scriptSha = await this.redis.client.script('LOAD', TOKEN_BUCKET_SCRIPT) as string;
  }

  async check(
    identity: string,
    capacity: number,
    refillRate: number,
    cost = 1,
  ): Promise<{ allowed: boolean; remaining: number; retryAfter: number }> {
    // Hash tag {identity} ensures all keys for this identity
    // go to the same Redis Cluster shard.
    const key = \`ratelimit:{\${identity}}:bucket\`;
    const now = Date.now() / 1000;

    try {
      const result = await this.redis.client.evalsha(
        this.scriptSha!,
        1,
        key,
        capacity,
        refillRate,
        now,
        cost,
      ) as [number, number, number];

      const [allowed, remaining, _cost] = result;
      return {
        allowed: allowed === 1,
        remaining,
        retryAfter: allowed === 0 ? Math.ceil(1 / refillRate) : 0,
      };
    } catch (err: any) {
      // NOSCRIPT: Redis restarted and lost the script cache.
      if (err.message?.includes('NOSCRIPT')) {
        this.scriptSha = await this.redis.client.script('LOAD', TOKEN_BUCKET_SCRIPT) as string;
        return this.check(identity, capacity, refillRate, cost);
      }
      // Redis unavailable: fail-open for general APIs.
      // For auth endpoints, change this to fail-closed.
      return { allowed: true, remaining: 0, retryAfter: 0 };
    }
  }
}

// ---------- 4. Guard using the distributed limiter ----------
@Injectable()
export class DistributedThrottleGuard implements CanActivate {
  constructor(
    private readonly limiter: DistributedRateLimiter,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    // Read limit metadata from a decorator (or a default).
    const limit = this.reflector.get<{
      capacity: number;
      refillRate: number;
    }>('rateLimit', context.getHandler()) ?? {
      capacity: 100,
      refillRate: 10,
    };

    const identity = req.user?.id ?? req.ip;
    const result = await this.limiter.check(
      String(identity),
      limit.capacity,
      limit.refillRate,
    );

    res.setHeader('X-RateLimit-Limit', limit.capacity);
    res.setHeader('X-RateLimit-Remaining', result.remaining);

    if (!result.allowed) {
      res.setHeader('Retry-After', String(result.retryAfter));
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
    }
    return true;
  }
}

// ---------- 5. Simple INCR-based limiter (fixed window) ----------
// Alternative when token bucket is not needed.
async checkFixedWindow(identity: string, limit: number, windowSec: number) {
  const key = \`ratelimit:{\${identity}}:fixed\`;
  const count = await this.redis.client.incr(key);
  if (count === 1) {
    await this.redis.client.expire(key, windowSec);
  }
  return { allowed: count <= limit, count };
}

// ---------- 6. Sliding window counter Lua script ----------
const SLIDING_COUNTER_SCRIPT = \`
  local key = KEYS[1]
  local now_ms = tonumber(ARGV[1])
  local window_ms = tonumber(ARGV[2])
  local limit = tonumber(ARGV[3])

  local window_start = math.floor(now_ms / window_ms) * window_ms
  local prev_window_start = window_start - window_ms

  local curr_key = key .. ':' .. window_start
  local prev_key = key .. ':' .. prev_window_start

  local prev_count = tonumber(redis.call('GET', prev_key)) or 0
  local curr_count = tonumber(redis.call('GET', curr_key)) or 0

  local elapsed = (now_ms - window_start) / window_ms
  local estimated = prev_count * (1 - elapsed) + curr_count

  if estimated >= limit then
    return { 0, math.floor(estimated) }
  end

  redis.call('INCR', curr_key)
  redis.call('PEXPIRE', curr_key, window_ms * 2)
  return { 1, math.floor(estimated) + 1 }
\`;
      ` },
      keyTakeaways: [
        "In-memory rate limiters break in multi-instance deployments — each replica has its own counter, so the effective limit is multiplied by the number of instances.",
        "Redis provides shared, atomic counters with TTL support, making it the standard store for distributed rate limiting.",
        "Lua scripts make read-compute-write logic atomic, preventing race conditions where two requests both pass the check.",
        "Use hash tags (`{identity}`) in Redis Cluster to ensure all keys for an identity route to the same shard.",
        "Every rate limit key must have a TTL; otherwise counters accumulate forever.",
        "Choose a failure policy (fail-open or fail-closed) and apply it per endpoint based on criticality.",
        "Use `EVALSHA` for performance and fall back to `EVAL` on `NOSCRIPT` errors.",
      ],
      commonMistakes: [
        "<b>Non-atomic check-and-set.</b> Reading the counter, checking, and writing without a Lua script allows concurrent requests to both pass. Always use atomic operations.",
        "<b>Missing TTL on rate limit keys.</b> Keys without expiry accumulate forever. Every rate limit key must have a TTL.",
        "<b>Redis as a single point of failure without failover.</b> If Redis goes down and you fail-closed, your API goes down. Use Sentinel or Cluster for high availability.",
        "<b>No hash tags in Redis Cluster.</b> Without `{identity}`, keys for the same identity may be split across shards, breaking atomicity and consistency.",
        "<b>Clock skew across servers.</b> Use Redis's `TIME` command inside Lua scripts for a consistent clock instead of relying on application server time.",
        "<b>Forgetting to close Redis connections.</b> Use `OnModuleDestroy` to quit the Redis client on application shutdown.",
        "<b>No monitoring of 429s.</b> A spike in 429 responses means clients are being throttled. Track `rate_limit_rejected_total` per tenant and endpoint to tune limits.",
      ],
      quiz: [
        {
          question:
            "Why do in-memory rate limiters fail in a multi-instance deployment?",
          options: [
            "Because memory is too small.",
            "Because each replica maintains its own counter, so a client hitting all replicas can exceed the intended limit by the number of replicas.",
            "Because JavaScript is single-threaded.",
            "Because NestJS does not support in-memory storage.",
          ],
          correctIndex: 1,
          explanation:
            "Each replica's in-memory map is independent. A client hitting three replicas effectively gets three times the limit. A shared store like Redis is required for a global limit.",
        },
        {
          question:
            "Why are Lua scripts important for distributed rate limiting?",
          options: [
            "They are faster than JavaScript.",
            "They run atomically in Redis, so the read-compute-write sequence cannot interleave with concurrent requests from other replicas.",
            "They compress the data.",
            "They replace the need for Redis.",
          ],
          correctIndex: 1,
          explanation:
            "Without atomicity, two concurrent requests can both read the same token count, both decide to allow, and both decrement — allowing 2x the limit. Lua scripts execute as a single atomic unit in Redis.",
        },
        {
          question:
            "What is the purpose of the hash tag `{identity}` in a Redis rate limit key?",
          options: [
            "To make the key shorter.",
            "To ensure all keys for the same identity route to the same Redis Cluster shard, preserving atomicity.",
            "To encrypt the key.",
            "To set the TTL.",
          ],
          correctIndex: 1,
          explanation:
            "In Redis Cluster, keys are distributed across shards. The hash tag `{identity}` forces all keys containing that tag to the same shard, which is essential for atomic read-modify-write operations on the same identity.",
        },
        {
          question:
            "What is the recommended failure policy for a rate limiter when Redis is unavailable?",
          options: [
            "Always fail-closed (reject all requests).",
            "Always fail-open (allow all requests).",
            "Choose per endpoint: fail-open for general APIs (availability), fail-closed for auth endpoints (security).",
            "Crash the application.",
          ],
          correctIndex: 2,
          explanation:
            "Fail-open keeps the API available during a Redis outage but temporarily disables rate limiting. Fail-closed keeps rate limits enforced but takes down the API. The right choice depends on the endpoint's criticality.",
        },
      ],
    },
    {
      id: "day-53-lesson-4",
      title: "NestJS Throttling",
      durationMinutes: 21,
      explanation: `
<b>NestJS has a first-class rate limiting module: \`@nestjs/throttler\`.</b> It provides a \`ThrottlerGuard\` that you bind globally or per-route, decorators for overriding limits, and a storage interface for plugging in Redis or other backends. It is maintained by the NestJS team, integrated with the framework's guards and dependency injection, and works with Express, Fastify, GraphQL, and WebSockets.

<b>Basic setup.</b> Install the package and register \`ThrottlerModule.forRoot()\`:

\`\`\`bash
npm install @nestjs/throttler
\`\`\`

\`\`\`typescript
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'short', ttl: 1000, limit: 3 },
        { name: 'medium', ttl: 10000, limit: 20 },
        { name: 'long', ttl: 60000, limit: 100 },
      ],
    }),
  ],
})
export class AppModule {}
\`\`\`

<b>Important: \`ttl\` is in milliseconds</b> since \`@nestjs/throttler\` v5. A \`ttl: 60\` is 60 milliseconds, not 60 seconds. The correct value for one minute is \`ttl: 60000\`. This is a common mistake that results in rate limits expiring far too quickly.

<b>Binding the guard.</b> The \`ThrottlerGuard\` must be registered. The most common way is globally via \`APP_GUARD\`:

\`\`\`typescript
@Module({
  imports: [ThrottlerModule.forRoot({ ... })],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
\`\`\`

With this, every route is rate-limited by default.

<b>Multiple throttler definitions.</b> A common pattern is to define several named throttlers with different windows — a "short" one for burst protection, a "medium" one for sustained rate, and a "long" one for daily quotas. When multiple throttlers are defined, <b>all of them must pass</b> for a request to be allowed. This gives you layered protection: a burst of 5 requests is fine, but 100 requests in a minute is not, even if they are spread out.

\`\`\`typescript
ThrottlerModule.forRoot({
  throttlers: [
    { name: 'burst', ttl: 1000, limit: 5 },    // 5 per second
    { name: 'sustained', ttl: 60000, limit: 100 }, // 100 per minute
    { name: 'daily', ttl: 86400000, limit: 10000 }, // 10k per day
  ],
})
\`\`\`

<b>Per-route overrides with \`@Throttle()\`.</b> Since v5, the decorator takes an object keyed by throttler name:

\`\`\`typescript
@Throttle({ default: { limit: 3, ttl: 60000 } })
@Get('search')
search() { ... }
\`\`\`

If you defined named throttlers, use their names:

\`\`\`typescript
@Throttle({ sustained: { limit: 10, ttl: 60000 } })
@Post('login')
login() { ... }
\`\`\`

<b>Skipping rate limiting with \`@SkipThrottle()\`.</b> Health checks and metrics endpoints should not be rate-limited. Use the decorator on a class or method:

\`\`\`typescript
@SkipThrottle()
@Get('health')
health() { return { status: 'ok' }; }
\`\`\`

You can also skip selectively per throttler set:

\`\`\`typescript
@SkipThrottle({ burst: true })
@Get('slow-endpoint')
slow() { ... }
\`\`\`

And negate a skip on a class that is skipped:

\`\`\`typescript
@SkipThrottle()  // skip the whole class
@Controller('users')
export class UsersController {
  @SkipThrottle({ default: false }) // but rate-limit this one
  @Get('login')
  login() { ... }
}
\`\`\`

<b>Redis storage for distributed throttling.</b> The default storage is in-memory, which breaks in multi-instance deployments. For production, use Redis-backed storage via \`@nest-lab/throttler-storage-redis\`:

\`\`\`bash
npm install @nest-lab/throttler-storage-redis ioredis
\`\`\`

\`\`\`typescript
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';

ThrottlerModule.forRoot({
  throttlers: [{ ttl: 60000, limit: 100 }],
  storage: new ThrottlerStorageRedisService(
    new Redis({
      host: 'localhost',
      port: 6379,
    }),
  ),
})
\`\`\`

Now all replicas share the same counters. The limit is global.

<b>Behind a proxy: the \`trust proxy\` setting.</b> In production, your NestJS app usually runs behind a load balancer or reverse proxy. Without \`trust proxy\`, \`req.ip\` is the proxy's IP, not the client's. All clients appear to come from the same IP, and a single rate limit bucket is shared by everyone.

For Express, enable it in \`main.ts\`:

\`\`\`typescript
const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.set('trust proxy', 'loopback'); // trust loopback addresses
\`\`\`

Or, override the guard's \`getTracker()\` method to read from \`X-Forwarded-For\`:

\`\`\`typescript
@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.ips.length ? req.ips[0] : req.ip;
  }
}
\`\`\`

<b>Recent improvements in v6.x.</b> The module has been actively maintained:
- <b>IPv6 normalization (v6.7.0):</b> Clients with an IPv6 allocation could previously send requests from different addresses within their subnet and never share a counter, defeating the rate limit. The default tracker now masks IPv6 addresses to a /64 prefix. IPv4 and custom trackers are unaffected.
- <b>In-memory storage cleanup (v6.7.0):</b> The in-memory storage previously never removed records, growing the internal map for the lifetime of the process. Idle records are now swept once their window has fully elapsed.
- <b>Numeric string coercion (v6.7.1):</b> Values from \`ConfigService.get<number>()\` that arrive as strings are now coerced to numbers. Previously, \`Date.now() + '60000'\` concatenated instead of adding, silently corrupting every expiry.
- <b>\`blockDuration: 0\` semantics:</b> An explicit zero now means "no extra block" — the request is rejected while the window is full and let through as soon as the oldest hit expires, without recording the rejected requests.
- <b>Custom header setting (v6.7.1):</b> Rate limit headers are set via \`res.setHeader()\` when the response has no \`res.header()\` method, so the guard no longer throws on custom HTTP adapters.

<b>GraphQL and WebSocket support.</b> The guard works with GraphQL resolvers and WebSocket gateways, but requires extending the guard and overriding \`getRequestResponse()\` or \`handleRequest()\`. The NestJS documentation has examples for both.

<b>Custom tracker for authenticated users.</b> By default, the guard tracks by IP. For authenticated APIs, you usually want to track by user id or API key instead. Override \`getTracker()\`:

\`\`\`typescript
@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Prefer authenticated user id; fall back to IP.
    return req.user?.id ? \`user:\${req.user.id}\` : req.ip;
  }
}
\`\`\`

This ensures the limit follows the user, not their current IP (which may change on mobile networks).

<b>What can go wrong?</b>
- <b>Using \`ttl: 60\` thinking it means 60 seconds.</b> Since v5, \`ttl\` is in milliseconds. Use \`60000\` for one minute. This is the single most common mistake with \`@nestjs/throttler\`.
- <b>Not binding the guard.</b> Registering \`ThrottlerModule\` without binding \`ThrottlerGuard\` as \`APP_GUARD\` (or with \`@UseGuards()\`) means no rate limiting happens. The module limits nothing by itself.
- <b>Using in-memory storage in production.</b> Multi-instance deployments need Redis storage. In-memory counters are per-replica.
- <b>Forgetting \`trust proxy\`.</b> Behind a load balancer, all requests appear to come from the proxy IP. Everyone shares one bucket.
- <b>Rate limiting health checks.</b> Use \`@SkipThrottle()\` on \`/health\` and \`/metrics\` so orchestrators do not kill healthy pods.
- <b>No \`X-RateLimit-*\` headers.</b> The guard sets them by default in recent versions, but if you extend the guard or use a custom adapter, verify they are present.
- <b>Not handling Redis failure.</b> If Redis is down and the storage throws, the guard may reject all requests. Decide fail-open vs fail-closed and handle it.
- <b>Tracking by IP for authenticated APIs.</b> A user behind a NAT or on mobile networks may share an IP with thousands of others, or change IPs frequently. Track by user id for authenticated endpoints.

<b>How this appears in a real application:</b> a NestJS API registers \`ThrottlerModule.forRoot()\` with three throttlers (burst, sustained, daily) and Redis storage. The guard is bound globally via \`APP_GUARD\`. Health and metrics controllers use \`@SkipThrottle()\`. The login endpoint uses \`@Throttle({ sustained: { limit: 5, ttl: 60000 } })\` for brute-force protection. The tracker is overridden to use user id when authenticated, IP otherwise. The app runs behind an ALB with \`trust proxy\` enabled. Metrics track 429 responses per endpoint, so the team can see which limits are being hit and adjust.

<b>How experienced engineers think:</b> \`@nestjs/throttler\` is the right default for most NestJS applications. It is maintained, well-integrated, and handles the common cases. The main work is choosing the right limits per endpoint, configuring Redis storage for production, and handling proxies and authentication correctly. The module handles the mechanics; the policy is yours.
      `,
      diagram: `
NestJS Throttler Architecture

  Client
      |
      v
  +-------------------------------+
  |  ThrottlerGuard (APP_GUARD)   |
  |   - reads ThrottlerModule config |
  |   - overrides via @Throttle()  |
  |   - skips via @SkipThrottle()  |
  +-------------------------------+
      |
      |  getTracker() -> identity
      v
  +-------------------------------+
  |  ThrottlerStorage             |
  |   - in-memory (default)       |
  |   - Redis (production)        |
  |     @nest-lab/throttler-      |
  |     storage-redis             |
  +-------------------------------+
      |
      v
  If limit exceeded:
    HTTP 429 Too Many Requests
    X-RateLimit-* headers
    Retry-After header

Config:
  ThrottlerModule.forRoot({
    throttlers: [
      { name: 'burst', ttl: 1000, limit: 5 },
      { name: 'sustained', ttl: 60000, limit: 100 },
      { name: 'daily', ttl: 86400000, limit: 10000 },
    ],
    storage: new ThrottlerStorageRedisService(redis),
  })

Per-route:
  @Throttle({ sustained: { limit: 5, ttl: 60000 } })
  @Post('login')

Skip:
  @SkipThrottle()
  @Get('health')
      `,
      codeExample: { title: "Example", code: `
// ============================================
// NESTJS THROTTLING — FULL SETUP
// ============================================

// ---------- 1. Install ----------
// npm install @nestjs/throttler
// npm install @nest-lab/throttler-storage-redis ioredis   (for Redis)

// ---------- 2. Module configuration (app.module.ts) ----------
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        // ttl is in MILLISECONDS (since v5).
        { name: 'burst', ttl: 1000, limit: 5 },        // 5 per second
        { name: 'sustained', ttl: 60000, limit: 100 }, // 100 per minute
        { name: 'daily', ttl: 86400000, limit: 10000 },// 10k per day
      ],
      // Use Redis storage for multi-instance deployments.
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: process.env.REDIS_HOST ?? 'localhost',
          port: Number(process.env.REDIS_PORT ?? 6379),
        }),
      ),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

// ---------- 3. Per-route overrides ----------
import { Controller, Get, Post } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  // Brute-force protection: 5 login attempts per minute.
  @Throttle({ sustained: { limit: 5, ttl: 60000 } })
  @Post('login')
  login() {
    return { message: 'Login attempt' };
  }

  // Health check: no rate limiting (orchestrators poll it).
  @SkipThrottle()
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}

// ---------- 4. Skipping a class with a per-method override ----------
@SkipThrottle()
@Controller('internal')
export class InternalController {
  // This route IS rate limited despite the class-level skip.
  @SkipThrottle({ default: false })
  @Get('export')
  export() {
    return { message: 'Export' };
  }

  // This route is NOT rate limited.
  @Get('status')
  status() {
    return { status: 'ok' };
  }
}

// ---------- 5. Custom tracker (user id instead of IP) ----------
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Prefer authenticated user id; fall back to IP.
    return req.user?.id ? \`user:\${req.user.id}\` : req.ip;
  }
}

// Register in module:
// { provide: APP_GUARD, useClass: UserThrottlerGuard }

// ---------- 6. Behind a proxy: enable trust proxy (Express) ----------
// main.ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 'loopback'); // Trust X-Forwarded-For from loopback
  await app.listen(3000);
}
bootstrap();

// ---------- 7. Behind a proxy: custom getTracker ----------
@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // req.ips is populated when trust proxy is enabled.
    return req.ips?.length ? req.ips[0] : req.ip;
  }
}

// ---------- 8. WebSocket support (extend the guard) ----------
import { ExecutionContext } from '@nestjs/common';
import { ThrottlerRequest } from '@nestjs/throttler';

@Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
  async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
    const { context, limit, ttl, throttler, blockDuration, generateKey } =
      requestProps;

    const client = context.switchToWs().getClient();
    const tracker = client._socket?.remoteAddress ?? client.conn?.remoteAddress;
    const key = generateKey(context, tracker, throttler.name);

    const { totalHits, timeToExpire, isBlocked, timeToBlockExpire } =
      await this.storageService.increment(
        key,
        ttl,
        limit,
        blockDuration,
        throttler.name,
      );

    if (isBlocked) {
      await this.throwThrottlingException(context, {
        limit,
        ttl,
        key,
        throttler,
        totalHits,
        timeToExpire,
        isBlocked,
        timeToBlockExpire,
      });
    }
    return true;
  }
}

// ---------- 9. GraphQL support (override getRequestResponse) ----------
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    return { req: ctx.req, res: ctx.res };
  }
}

// ---------- 10. Environment-driven configuration ----------
// Use forRootAsync with ConfigService for per-environment limits.
import { ConfigModule, ConfigService } from '@nestjs/config';

ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    throttlers: [
      {
        name: 'sustained',
        ttl: config.get<number>('RATE_LIMIT_TTL_MS', 60000),
        limit: config.get<number>('RATE_LIMIT_MAX', 100),
      },
    ],
    storage: new ThrottlerStorageRedisService(
      new Redis({
        host: config.getOrThrow('REDIS_HOST'),
        port: config.getOrThrow<number>('REDIS_PORT'),
      }),
    ),
  }),
})
      ` },
      keyTakeaways: [
        "`@nestjs/throttler` is the official rate limiting module for NestJS, with a `ThrottlerGuard` and decorators for overrides and skips.",
        "Since v5, the `ttl` option is in milliseconds — use `60000` for one minute, not `60`.",
        "Multiple named throttlers (burst, sustained, daily) provide layered protection — all must pass.",
        "Use `@Throttle()` for per-route overrides and `@SkipThrottle()` for health checks and internal endpoints.",
        "Use Redis storage (`@nest-lab/throttler-storage-redis`) for multi-instance deployments — in-memory storage is per-replica.",
        "Enable `trust proxy` behind a load balancer and consider overriding `getTracker()` to use user id instead of IP for authenticated APIs.",
        "Recent v6.x improvements include IPv6 normalization, in-memory cleanup, numeric string coercion, and custom header setting.",
      ],
      commonMistakes: [
        "<b>Using `ttl: 60` thinking it means 60 seconds.</b> Since v5, `ttl` is in milliseconds. Use `60000` for one minute. This is the most common mistake with `@nestjs/throttler`.",
        "<b>Not binding the guard.</b> Registering `ThrottlerModule` without binding `ThrottlerGuard` as `APP_GUARD` (or with `@UseGuards()`) means no rate limiting happens. The module limits nothing by itself.",
        "<b>Using in-memory storage in production.</b> Multi-instance deployments need Redis storage. In-memory counters are per-replica and multiply the effective limit.",
        "<b>Forgetting `trust proxy`.</b> Behind a load balancer, all requests appear to come from the proxy IP. Everyone shares one bucket. Enable `trust proxy` and override `getTracker()` if needed.",
        "<b>Rate limiting health checks.</b> Use `@SkipThrottle()` on `/health` and `/metrics` so orchestrators do not kill healthy pods.",
        "<b>Tracking by IP for authenticated APIs.</b> Users behind NAT or on mobile networks share IPs or change them frequently. Track by user id for authenticated endpoints.",
        "<b>No monitoring of 429s.</b> Track rate limit rejections per endpoint and per identity to tune limits and detect abuse.",
        "<b>Ignoring the `blockDuration` option.</b> When a client exceeds the limit, `blockDuration` (in milliseconds) can block them for longer than the window, giving a cooling-off period.",
      ],
      quiz: [
        {
          question:
            "In `@nestjs/throttler` v5 and later, what unit is the `ttl` option in?",
          options: [
            "Seconds",
            "Minutes",
            "Milliseconds",
            "Hours",
          ],
          correctIndex: 2,
          explanation:
            "Since v5, `ttl` is in milliseconds. A value of `60` means 60 milliseconds, not 60 seconds. For one minute, use `60000`. This was a breaking change and a common source of bugs.",
        },
        {
          question:
            "You have three replicas of your NestJS API behind a load balancer and are using the default in-memory storage for `@nestjs/throttler`. What is the effective rate limit for a client?",
          options: [
            "The configured limit.",
            "Three times the configured limit, because each replica has its own counter.",
            "One third of the configured limit.",
            "Zero — the limit is not enforced at all.",
          ],
          correctIndex: 1,
          explanation:
            "Each replica maintains its own in-memory counter. A client hitting all three replicas gets three separate buckets, effectively tripling the limit. Use Redis storage for a global limit.",
        },
        {
          question:
            "What does the `@SkipThrottle()` decorator do?",
          options: [
            "It increases the rate limit.",
            "It disables rate limiting for a route or an entire controller — useful for health checks and internal endpoints.",
            "It resets the rate limit counter.",
            "It logs rate limit violations.",
          ],
          correctIndex: 1,
          explanation:
            "`@SkipThrottle()` excludes a route or class from rate limiting. It is commonly used on `/health`, `/metrics`, and internal endpoints that should not be throttled.",
        },
        {
          question:
            "Why is `trust proxy` important for rate limiting behind a load balancer?",
          options: [
            "It makes the API faster.",
            "Without it, `req.ip` is the load balancer's IP, so all clients share the same rate limit bucket.",
            "It encrypts the traffic.",
            "It sets the rate limit headers.",
          ],
          correctIndex: 1,
          explanation:
            "Behind a proxy, the client's real IP is in the `X-Forwarded-For` header. Without `trust proxy`, Express/Fastify reports the proxy's IP as `req.ip`, and all clients are rate-limited as one. Enable `trust proxy` and use `req.ips` or a custom `getTracker()`.",
        },
        {
          question:
            "You want tighter rate limiting on the login endpoint (5 per minute) while keeping the global limit at 100 per minute. How do you configure this?",
          options: [
            "Create a separate NestJS application for login.",
            "Use `@Throttle({ sustained: { limit: 5, ttl: 60000 } })` on the login route, overriding the global throttler named 'sustained'.",
            "Disable the global guard and add a custom guard just for login.",
            "Set the global limit to 5.",
          ],
          correctIndex: 1,
          explanation:
            "The `@Throttle()` decorator overrides the global configuration for a specific route. Using the throttler's name (e.g. 'sustained') and new limit/ttl values gives you per-route control without affecting other endpoints.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question:
        "What HTTP status code should a rate-limited request receive?",
      options: [
        "`400 Bad Request`",
        "`401 Unauthorized`",
        "`429 Too Many Requests`",
        "`503 Service Unavailable`",
      ],
      correctIndex: 2,
      explanation:
        "`429 Too Many Requests` is the standard status code for rate limiting. It tells the client they have exceeded the limit and should back off.",
    },
    {
      question:
        "Which rate limiting algorithm allows a client to accumulate tokens during idle periods and then burst?",
      options: [
        "Fixed window",
        "Sliding window log",
        "Token bucket",
        "Sliding window counter",
      ],
      correctIndex: 2,
      explanation:
        "Token bucket refills tokens over time up to a maximum capacity. A client that has been idle accumulates tokens and can then make a burst of requests up to that capacity.",
    },
    {
      question:
        "Why is fixed window rate limiting vulnerable to boundary spikes?",
      options: [
        "Because the counter is too small.",
        "Because a client can send the full limit at the end of one window and another full limit at the start of the next, effectively doubling the rate.",
        "Because fixed windows are not supported in Redis.",
        "Because the window never resets.",
      ],
      correctIndex: 1,
      explanation:
        "Fixed windows align to clock boundaries. A client can exploit the boundary to send 2x the limit in a short period. Sliding windows and token buckets smooth this out.",
    },
    {
      question:
        "Why do in-memory rate limiters fail in multi-instance deployments?",
      options: [
        "Because memory is too small.",
        "Because each replica has its own counter, so the effective limit is multiplied by the number of replicas.",
        "Because JavaScript is single-threaded.",
        "Because in-memory storage is deprecated.",
      ],
      correctIndex: 1,
      explanation:
        "Each replica maintains independent counters. A client hitting multiple replicas gets multiple buckets, multiplying the effective limit. A shared store like Redis is required.",
    },
    {
      question:
        "What is the purpose of using Lua scripts in Redis for rate limiting?",
      options: [
        "They are faster than JavaScript.",
        "They run atomically in Redis, preventing race conditions in read-compute-write logic.",
        "They compress the data.",
        "They replace the need for a database.",
      ],
      correctIndex: 1,
      explanation:
        "Lua scripts execute atomically in Redis. Without atomicity, two concurrent requests can both read the same counter value and both decide to allow, exceeding the limit.",
    },
    {
      question:
        "What is the hash tag `{identity}` used for in Redis Cluster rate limit keys?",
      options: [
        "To make the key shorter.",
        "To ensure all keys for the same identity route to the same shard, preserving atomicity.",
        "To encrypt the key.",
        "To set the TTL.",
      ],
      correctIndex: 1,
      explanation:
        "In Redis Cluster, keys are distributed across shards. The hash tag forces all keys containing that tag to the same shard, which is essential for atomic operations on the same identity.",
    },
    {
      question:
        "What is the recommended failure policy for a rate limiter when Redis is unavailable?",
      options: [
        "Always fail-closed (reject all requests).",
        "Always fail-open (allow all requests).",
        "Choose per endpoint: fail-open for general APIs (availability), fail-closed for auth endpoints (security).",
        "Crash the application.",
      ],
      correctIndex: 2,
      explanation:
        "Fail-open keeps the API available during a Redis outage but disables rate limiting. Fail-closed keeps rate limiting enforced but takes down the API. The right choice depends on the endpoint's criticality.",
    },
    {
      question:
        "In `@nestjs/throttler` v5 and later, what unit is the `ttl` option in?",
      options: [
        "Seconds",
        "Minutes",
        "Milliseconds",
        "Hours",
      ],
      correctIndex: 2,
      explanation:
        "Since v5, `ttl` is in milliseconds. A value of `60` means 60 milliseconds, not 60 seconds. For one minute, use `60000`.",
    },
    {
      question:
        "Why is `trust proxy` important for rate limiting behind a load balancer?",
      options: [
        "It makes the API faster.",
        "Without it, `req.ip` is the load balancer's IP, so all clients share the same rate limit bucket.",
        "It encrypts the traffic.",
        "It sets the rate limit headers.",
      ],
      correctIndex: 1,
      explanation:
        "Behind a proxy, the client's real IP is in the `X-Forwarded-For` header. Without `trust proxy`, all clients appear to come from the proxy's IP and share one rate limit bucket.",
    },
    {
      question:
        "What decorator overrides the global rate limit for a specific route in NestJS?",
      options: [
        "`@RateLimit()`",
        "`@Throttle()`",
        "`@Limit()`",
        "`@Override()`",
      ],
      correctIndex: 1,
      explanation:
        "`@Throttle()` overrides the global `ThrottlerModule` configuration for a specific route or controller. It takes an object keyed by throttler name with `limit` and `ttl` values.",
    },
    {
      question:
        "Which endpoint should typically be exempt from rate limiting?",
      options: [
        "`POST /auth/login`",
        "`GET /health`",
        "`POST /charges`",
        "`GET /products`",
      ],
      correctIndex: 1,
      explanation:
        "Health check endpoints are polled by orchestrators (Kubernetes, ECS). Rate limiting them can cause the platform to think the pod is unhealthy and kill it. Use `@SkipThrottle()`.",
    },
    {
      question:
        "What is the purpose of the `Retry-After` header in a 429 response?",
      options: [
        "It tells the client how long the response is cached.",
        "It tells the client how many seconds to wait before retrying.",
        "It tells the client the total rate limit.",
        "It tells the client the server version.",
      ],
      correctIndex: 1,
      explanation:
        "`Retry-After` tells the client how many seconds to wait before making another request. Without it, clients may retry immediately and amplify the load.",
    },
    {
      question:
        "Which recent `@nestjs/throttler` improvement prevents IPv6 clients from bypassing rate limits by rotating addresses within their subnet?",
      options: [
        "Numeric string coercion",
        "IPv6 normalization to a /64 prefix",
        "In-memory storage cleanup",
        "Custom header setting",
      ],
      correctIndex: 1,
      explanation:
        "v6.7.0 normalizes IPv6 source addresses to a /64 prefix by default. Previously, a client with an IPv6 allocation could send every request from a different address and never share a counter.",
    },
    {
      question:
        "What does the `blockDuration` option do in `@nestjs/throttler`?",
      options: [
        "It sets the TTL of the counter.",
        "It blocks a client for an additional duration after they exceed the limit, giving a cooling-off period.",
        "It increases the limit.",
        "It resets the counter.",
      ],
      correctIndex: 1,
      explanation:
        "`blockDuration` (in milliseconds) extends the block beyond the window. When a client exceeds the limit, they are blocked for `ttl + blockDuration`, preventing immediate retries when the window resets.",
    },
  ],
  project: {
    name: "Build a Multi-Tenant SaaS API with Layered Rate Limiting, Redis Storage, and Per-Endpoint Policies",
    goal:
      "Implement a production-grade rate limiting system for a multi-tenant NestJS API: layered throttlers (burst, sustained, daily), Redis-backed distributed storage, per-endpoint overrides, custom tracking by API key, proxy-aware IP extraction, and monitoring of 429 responses.",
    brief:
      "You are the backend engineer for a SaaS platform. The API serves multiple tenants, each identified by an API key. Different endpoints have different cost profiles and abuse potential: login needs strict protection, list endpoints can be generous, and expensive report generation needs tight limits. You must ensure limits are enforced globally across all replicas, that health checks are exempt, and that clients receive clear rate limit headers. This project combines everything from Day 53.",
    steps: [
      "Create a new NestJS project. Add `@nestjs/throttler`, `@nest-lab/throttler-storage-redis`, `ioredis`, `@nestjs/config`, and `@nestjs/swagger`.",
      "Run a Redis instance locally (Docker: `docker run -p 6379:6379 redis:7-alpine`). Configure the connection via environment variables.",
      "Configure `ThrottlerModule.forRoot()` with three named throttlers: `burst` (5 per second), `sustained` (100 per minute), and `daily` (10,000 per day). Use `ThrottlerStorageRedisService` for storage.",
      "Bind `ThrottlerGuard` globally via `APP_GUARD` in `AppModule`.",
      "Create a `HealthController` with `GET /health` decorated with `@SkipThrottle()`. Create a `MetricsController` with `GET /metrics` also skipped.",
      "Create an `AuthController` with `POST /auth/login` decorated with `@Throttle({ sustained: { limit: 5, ttl: 60000 } })` for brute-force protection. Also add `POST /auth/register` with a stricter limit (3 per hour).",
      "Create a `ProductsController` with `GET /products` (generous: `@Throttle({ sustained: { limit: 500, ttl: 60000 } })`) and `POST /products` (stricter: `@Throttle({ sustained: { limit: 20, ttl: 60000 } })`).",
      "Create a `ReportsController` with `POST /reports/generate` decorated with `@Throttle({ burst: { limit: 1, ttl: 1000 }, sustained: { limit: 10, ttl: 60000 } })` — expensive endpoint, very tight limits.",
      "Override `ThrottlerGuard.getTracker()` to return the API key from the `X-API-Key` header when present, falling back to `req.ip`. Create a `TenantThrottlerGuard` that extends `ThrottlerGuard` and implements this.",
      "Enable `trust proxy` in `main.ts` for Express (`app.set('trust proxy', 'loopback')`). Verify that `req.ip` reflects the client IP when running behind a proxy.",
      "Add Swagger decorators: document the `X-API-Key` header on authenticated endpoints, and document the 429 response with `Retry-After` and `X-RateLimit-*` headers using `@ApiResponse`.",
      "Add a middleware or interceptor that logs 429 responses with the tenant id, endpoint, and the rate limit that was hit. In production, this would feed a metrics pipeline.",
      "Write a custom health check that verifies Redis connectivity (`PING`). If Redis is down, log a warning and decide fail-open vs fail-closed based on a configuration flag.",
      "Write e2e tests with `supertest` that: (a) verify a burst of requests to `/auth/login` returns 429 after 5 requests; (b) verify `/health` is never rate-limited; (c) verify that requests with different API keys have independent counters; (d) verify that `Retry-After` is present in 429 responses; (e) verify that rate limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`) are present on allowed responses.",
    ],
    acceptance: [
      "A burst of 6 requests to `POST /auth/login` within one minute: the first 5 return 200/201, the 6th returns 429 with `Retry-After`.",
      "`GET /health` returns 200 even after 10,000 requests in a minute.",
      "Two different API keys each get their own 100-request-per-minute bucket — exhausting one does not affect the other.",
      "`POST /reports/generate` is limited to 1 per second and 10 per minute — a burst of 2 requests within one second returns 429 on the second.",
      "Rate limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`) are present on successful responses.",
      "`Retry-After` is present on all 429 responses.",
      "The `TenantThrottlerGuard` correctly reads `X-API-Key` and falls back to IP when absent.",
      "Health check endpoint reports Redis connectivity status.",
      "All e2e tests pass.",
    ],
    stretch: [
      "Add a `daily` throttler (10,000 per day) in addition to `burst` and `sustained`. Verify that all three must pass — a client can exhaust the daily limit even if they stay within the burst and sustained limits.",
      "Implement a custom `ThrottlerStorage` interface backed by Redis that uses a token bucket Lua script instead of the default fixed-window counting. Compare the behavior to the built-in storage.",
      "Add per-tenant configurable rate limits stored in a `tenants` table (e.g. Free: 100/min, Pro: 1000/min, Enterprise: 10000/min). Override the guard's tracker and limit resolution to read from the database.",
      "Add a metrics endpoint that exposes `rate_limit_rejected_total{tenant, endpoint}` in Prometheus format. Use `@willsoto/nestjs-prometheus` or a custom counter.",
      "Add a GraphQL endpoint using `@nestjs/graphql` and extend `ThrottlerGuard` with `GqlThrottlerGuard` to rate-limit resolvers. Verify that the same limits apply.",
      "Write a load test with k6 or autocannon that sends 1,000 concurrent requests with a single API key and verifies that exactly the configured limit is allowed and the rest receive 429. Measure the latency added by the Redis-backed rate limiter.",
      "Implement a sliding window counter Lua script for the custom storage and benchmark it against the built-in fixed-window storage under the same load. Document the trade-offs.",
    ],
  },
};
