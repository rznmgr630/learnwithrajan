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
      explanation: `Rate limiting controls how many requests a client can make during a period. It protects availability, reduces accidental overload, and makes abusive traffic more difficult. Throttling is often used as a broader term for controlling request throughput; in practice the terms are frequently used together.

A limit can be defined per IP address, authenticated user, API key, tenant, route, or a combination. The correct identity depends on the endpoint. A public login endpoint may need IP and account protections, while an authenticated API may use user or tenant limits.

Rate limiting should not be confused with authentication or authorization. Authentication answers who the caller is, authorization answers what they can do, and rate limiting answers how frequently they may perform an operation.

A useful rate-limit response communicates that the request was limited and, where appropriate, when the client can try again. APIs commonly use HTTP 429 Too Many Requests. Headers can communicate limit and remaining capacity when the design supports them.`,
      diagram: `Incoming Requests
       |
       v
+-------------------+
| Rate Limit Check  |
+-------------------+
       |
   +---+---+
   |       |
 allowed  limited
   |       |
   v       v
Controller  429
            |
        Retry guidance`,
      codeExample: { title: "Example", code: `// Conceptual policy
{
  "identity": "user:42",
  "route": "POST:/orders",
  "limit": 100,
  "windowSeconds": 60
}

// When exceeded:
HTTP/1.1 429 Too Many Requests

{
  "statusCode": 429,
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests"
}` },
      keyTakeaways: [
        "Rate limiting protects APIs from excessive request volume.",
        "Limits should be based on an identity appropriate to the endpoint.",
        "HTTP 429 communicates that a request was rejected due to rate limits.",
        "Rate limiting is separate from authentication and authorization."
      ],
      commonMistakes: [
        "Using only IP addresses for every authenticated endpoint.",
        "Applying the same limit to every route regardless of cost.",
        "Returning 500 for a deliberate rate-limit rejection.",
        "Treating rate limiting as a replacement for authorization."
      ],
      quiz: [
        {
          question: "Which HTTP status is normally used when a client exceeds a rate limit?",
          options: ["201", "301", "429", "503"],
          correctIndex: 2,
          explanation: "429 Too Many Requests communicates that the client has exceeded a request limit."
        }
      ]
    },
    {
      id: "day-53-lesson-2",
      title: "Token Bucket and Sliding Window",
      durationMinutes: 24,
      explanation: `The token bucket algorithm models a bucket that receives tokens at a fixed rate up to a maximum capacity. A request consumes one or more tokens. This allows controlled bursts while maintaining an average rate. For example, a bucket can hold 20 tokens and refill at 5 tokens per second. A client can make a short burst of up to the available tokens and then must wait for replenishment.

A sliding-window algorithm counts requests over a moving time interval. Instead of resetting at fixed boundaries, the system considers recent traffic. This avoids some boundary spikes associated with a simple fixed window.

There are tradeoffs. Token buckets are useful when bursts are acceptable and you want to control average throughput. Sliding windows can give a more intuitive recent-request limit but can require more storage or computation depending on the implementation.

Production systems may use approximations or optimized Redis structures rather than storing every request indefinitely. The important part is understanding the policy separately from its storage implementation.`,
      diagram: `Token Bucket

Capacity: 5
Refill: 1 token/sec

[● ● ● ● ●]
  | | |
  v v v
 requests consume tokens

Sliding Window

now
 |----------------------|
   recent request window
   x   x x     x   x
   count = 5
`,
      codeExample: { title: "Example", code: `// Token bucket pseudocode
function allow(bucket, now) {
  refill(bucket, now);

  if (bucket.tokens < 1) {
    return false;
  }

  bucket.tokens -= 1;
  return true;
}

// Sliding-window concept
const recentRequests = requests.filter(
  request => request.timestamp > now - WINDOW
);

if (recentRequests.length >= LIMIT) {
  throw new TooManyRequestsException();
}` },
      keyTakeaways: [
        "Token bucket controls average rate while allowing bounded bursts.",
        "Sliding windows measure requests over a moving recent period.",
        "Algorithm choice should follow endpoint traffic characteristics.",
        "A production implementation must consider storage, concurrency, and distributed deployment."
      ],
      commonMistakes: [
        "Confusing token bucket capacity with its refill rate.",
        "Using a fixed-window counter without considering boundary bursts.",
        "Implementing rate limiting in process memory in a multi-instance production API.",
        "Ignoring atomicity when multiple workers update the same counter."
      ],
      quiz: [
        {
          question: "What is a key characteristic of a token bucket?",
          options: [
            "It allows no bursts",
            "It can allow bounded bursts using accumulated tokens",
            "It requires every request to be a GET",
            "It stores all requests forever"
          ],
          correctIndex: 1,
          explanation: "Accumulated tokens provide controlled burst capacity while the refill rate controls sustained traffic."
        }
      ]
    },
    {
      id: "day-53-lesson-3",
      title: "Distributed Rate Limiting with Redis",
      durationMinutes: 22,
      explanation: `An in-memory rate limiter inside one Node.js process works only for that process. When a NestJS application runs multiple instances behind a load balancer, requests from the same client can reach different instances. Each instance would otherwise maintain a different counter.

A shared store such as Redis allows instances to coordinate. Redis operations must be designed carefully because rate-limit decisions are concurrent. Atomic increments, expiration, Lua scripts, or specialized Redis commands can be used depending on the algorithm.

Distributed rate limiting also needs a clear identity strategy. A reverse proxy may provide the original client IP through trusted headers, but blindly trusting arbitrary forwarded headers can allow spoofing. In authenticated systems, a user ID or API key is often a stronger identity.

Rate limiting is not only about blocking traffic. It should also be observable. Track allowed requests, rejected requests, top limited identities, and endpoint-level rates so operators can distinguish attacks from legitimate traffic spikes.`,
      diagram: `                 Load Balancer
                /      |      \
               v       v       v
            Nest 1   Nest 2   Nest 3
               \       |       /
                \      |      /
                   Redis
              shared counters
`,
      codeExample: { title: "Example", code: `// Conceptual Redis key
rate_limit:user:42:POST:/orders

// Atomic counter pattern
const count = await redis.incr(key);

if (count === 1) {
  await redis.expire(key, 60);
}

if (count > 100) {
  throw new TooManyRequestsException();
}

// Production implementations should account for
// race conditions, expiration behavior, and algorithm choice.` },
      keyTakeaways: [
        "Multi-instance applications need shared rate-limit state for consistent limits.",
        "Redis is commonly used for distributed counters and coordination.",
        "Identity must be derived from trusted request context.",
        "Rate-limit metrics are important for production operations."
      ],
      commonMistakes: [
        "Keeping counters only in each Node.js process.",
        "Trusting arbitrary X-Forwarded-For values.",
        "Creating Redis keys without considering tenants or authenticated identities.",
        "Forgetting expiration and allowing counters to grow forever."
      ],
      quiz: [
        {
          question: "Why is process-local rate limiting insufficient behind a load balancer?",
          options: [
            "Node.js cannot count numbers",
            "Different application instances would maintain separate counters",
            "Redis cannot be used with NestJS",
            "HTTP 429 stops working"
          ],
          correctIndex: 1,
          explanation: "A client's requests can be distributed across instances, so local counters would not represent the total traffic."
        }
      ]
    },
    {
      id: "day-53-lesson-4",
      title: "NestJS Throttling",
      durationMinutes: 21,
      explanation: `NestJS provides throttling support through the @nestjs/throttler package. The package can define global or route-specific limits and can be integrated with guards. The important architectural skill is not memorizing decorators but understanding where the policy belongs and how it behaves when the application scales.

A global limit is useful as a baseline safety net, while sensitive or expensive endpoints can have stricter policies. For example, password reset, login, search, export, and AI-generation endpoints may need different limits.

The storage strategy matters. A default in-memory implementation can be appropriate for local development or a single process, but a horizontally scaled production service usually needs shared state or a distributed throttling strategy.

Throttling should be tested under concurrency. Verify that normal traffic succeeds, the threshold is enforced, and clients can eventually send requests again after the relevant window.`,
      diagram: `NestJS Request
     |
     v
ThrottlerGuard
     |
     +---- allowed ----> Controller
     |
     +---- exceeded --> 429
                         |
                      retry later

Multiple instances:
ThrottlerGuard <--> Shared Store`,
      codeExample: { title: "Example", code: `import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

// Route-specific policies can be added where a
// sensitive endpoint needs a different limit.` },
      keyTakeaways: [
        "NestJS throttling can provide a centralized request limit through a guard.",
        "Global and endpoint-specific limits can coexist.",
        "Distributed deployments require shared throttling state or an equivalent distributed strategy.",
        "The right policy depends on endpoint cost and abuse risk."
      ],
      commonMistakes: [
        "Assuming the default storage model automatically solves multi-instance deployments.",
        "Applying one identical limit to every endpoint.",
        "Not testing concurrent traffic.",
        "Forgetting that authenticated and unauthenticated endpoints may require different identities."
      ],
      quiz: [
        {
          question: "Why might a search endpoint have a different limit from a cheap health-check endpoint?",
          options: [
            "HTTP does not support different limits",
            "Search can consume substantially more resources",
            "Health checks require authentication",
            "NestJS requires one limit"
          ],
          correctIndex: 1,
          explanation: "Rate limits should reflect the cost and abuse characteristics of the operation."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "Which algorithm naturally supports bounded bursts?",
      options: ["Token bucket", "DNS", "Round robin", "Database normalization"],
      correctIndex: 0,
      explanation: "A token bucket can accumulate tokens and therefore allow controlled bursts."
    },
    {
      question: "What is the main distributed-rate-limit problem with local memory?",
      options: [
        "Memory cannot store integers",
        "Each application instance sees only part of the traffic",
        "Redis cannot count requests",
        "HTTP requests cannot be concurrent"
      ],
      correctIndex: 1,
      explanation: "Local state is fragmented across instances behind a load balancer."
    },
    {
      question: "What should an API normally return after a rate-limit threshold is exceeded?",
      options: ["200", "201", "404", "429"],
      correctIndex: 3,
      explanation: "429 Too Many Requests is the standard HTTP status for rate limiting."
    }
  ],
  project: {
    name: "Distributed API Rate Limiter",
    goal: "Build a production-oriented NestJS throttling system with endpoint-specific policies and shared state.",
    brief: "Protect a multi-tenant Orders API using global and route-specific limits. Implement a Redis-backed strategy, choose identities deliberately, return 429 responses, and add metrics for rejected requests.",
    steps: [
      "Add a global baseline rate limit.",
      "Create stricter limits for login and password-reset endpoints.",
      "Create an authenticated tenant/user identity for rate limiting.",
      "Implement a Redis-backed counter or token-bucket strategy.",
      "Ensure counters are atomic under concurrent requests.",
      "Set expiration/TTL for rate-limit state.",
      "Add useful rate-limit response headers.",
      "Add metrics for allowed and rejected requests.",
      "Test the limits with concurrent traffic.",
      "Run multiple NestJS instances and verify shared behavior."
    ],
    acceptance: [
      "The API returns 429 when a limit is exceeded.",
      "Multiple instances share rate-limit state.",
      "Sensitive endpoints have stricter policies.",
      "Rate-limit keys are scoped to the intended identity and route.",
      "Counters expire correctly.",
      "Concurrency tests demonstrate that the policy is enforced consistently."
    ],
    stretch: [
      "Implement both token-bucket and sliding-window strategies.",
      "Add tenant-specific plans such as Free, Pro, and Enterprise.",
      "Add a Redis Lua script for atomic token-bucket operations.",
      "Create a dashboard showing rate-limit events."
    ]
  }
};
