import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_26_DETAIL = {
  overview: [
    "Building a secure API means more than requiring a login. Rate limiting, input validation, CORS configuration, and HTTPS enforcement all matter. Most API security vulnerabilities come from trusting client input, weak authentication, or failing to limit what callers can request.",
    "Today covers rate limiting algorithms and implementation, how to configure CORS correctly (and the mistakes that make it useless), input validation as a security boundary, common JWT vulnerabilities and how to avoid them, and the security headers that protect your API at the transport layer.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "FsB_nRGdeLs", title: "API Security — Rate Limiting, CORS, SQL Injection, CSRF, XSS" },
      ],
    },
    {
      title: "Rate limiting algorithms",
      blocks: [
        { type: "diagram", id: "rate-limit-token-bucket" },
        {
          type: "table",
          caption: "Each algorithm has a different burst behavior — token bucket is the most common choice for APIs.",
          headers: ["Algorithm", "How it works", "Burst behavior", "Best for"],
          rows: [
            ["Fixed window counter", "Count requests in a fixed time window (e.g. 100 per minute starting at :00). Reset at the window boundary.", "A burst can send 200 requests right at the boundary — 100 at :59 and 100 at :00", "Simple rate limits where boundary bursts are acceptable; easy to implement"],
            ["Sliding window log", "Keep a log of each request's timestamp. Count requests in the last N seconds at query time.", "Smooth — no boundary burst; accurate but memory-intensive for high-traffic services", "Strict accuracy where bursts at boundaries are unacceptable"],
            ["Token bucket", "A bucket fills with tokens at a fixed rate (e.g. 10/second). Each request consumes one token. Requests are rejected when the bucket is empty.", "Allows bursting up to bucket capacity, then enforces the average rate", "API rate limiting — allows short bursts, enforces average rate; the most natural model"],
            ["Leaky bucket", "Requests enter a queue and are processed at a fixed rate. New requests are dropped if the queue is full.", "No burst — always processes at a fixed rate regardless of input spike", "Smoothing output rate; protecting downstream services from thundering herd"],
          ],
        },
        {
          type: "code",
          title: "Token bucket rate limiter with Redis in Node.js",
          code: `import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

// Token bucket: 100 requests per minute per IP
// Implemented with Redis atomic operations
async function tokenBucketLimit(
  key: string,           // e.g. "ratelimit:ip:1.2.3.4"
  capacity: number,      // max tokens (burst limit)
  refillRate: number,    // tokens added per second
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now() / 1000;  // seconds

  // Lua script runs atomically — no race conditions
  const script = \`
    local key = KEYS[1]
    local capacity = tonumber(ARGV[1])
    local refill_rate = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])

    local data = redis.call('HMGET', key, 'tokens', 'last_refill')
    local tokens = tonumber(data[1]) or capacity
    local last_refill = tonumber(data[2]) or now

    -- Add tokens earned since last request
    local elapsed = now - last_refill
    tokens = math.min(capacity, tokens + elapsed * refill_rate)

    local allowed = 0
    if tokens >= 1 then
      tokens = tokens - 1
      allowed = 1
    end

    redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
    redis.call('EXPIRE', key, 3600)  -- auto-clean after 1 hour of inactivity

    return { allowed, math.floor(tokens) }
  \`;

  const [allowed, remaining] = await redis.eval(script, {
    keys: [key],
    arguments: [String(capacity), String(refillRate), String(now)],
  }) as [number, number];

  return { allowed: allowed === 1, remaining };
}

// Express middleware
app.use(async (req, res, next) => {
  const key = \`ratelimit:ip:\${req.ip}\`;
  const { allowed, remaining } = await tokenBucketLimit(key, 100, 100/60);

  res.setHeader("X-RateLimit-Remaining", remaining);
  if (!allowed) {
    return res.status(429).json({
      error: "Too many requests",
      retryAfter: 60,
    });
  }
  next();
});`,
        },
      ],
    },
    {
      title: "CORS — what it is and how to configure it correctly",
      blocks: [
        {
          type: "paragraph",
          text: "CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks JavaScript on one origin (domain + port + protocol) from making requests to a different origin, unless the server explicitly allows it. It only applies to browser-based requests — curl and mobile apps are not subject to CORS. The most common CORS mistake is setting Access-Control-Allow-Origin: * on an API that also uses cookies for authentication — wildcard origin cannot be used with credentials, so this effectively disables your auth.",
        },
        {
          type: "code",
          title: "CORS configuration with the cors npm package",
          code: `import cors from "cors";

// ❌ Too permissive — allows any origin, making auth cookies useless
app.use(cors());  // sets Access-Control-Allow-Origin: *

// ✅ Allowlist specific origins
const allowedOrigins = [
  "https://app.example.com",
  "https://admin.example.com",
  // Allow localhost in development only
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(\`Origin \${origin} not allowed by CORS policy\`));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,        // required to allow cookies in cross-origin requests
  maxAge: 86400,            // cache preflight for 24 hours — reduces OPTIONS requests
}));

// The preflight request (OPTIONS) must also return CORS headers
// The cors() middleware handles this automatically — no extra configuration needed`,
        },
      ],
    },
    {
      title: "JWT security — common vulnerabilities",
      blocks: [
        { type: "diagram", id: "jwt-flow" },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Never accept the 'none' algorithm. Some early JWT libraries allowed a JWT with alg: 'none' to bypass signature verification. Always specify allowed algorithms explicitly: jwt.verify(token, secret, { algorithms: ['HS256'] }).",
            "Use a long, random secret for HS256 (at least 32 random bytes). A short or predictable secret can be brute-forced offline using a captured JWT.",
            "Set short expiry times (15 minutes for access tokens). A stolen access token is only usable for the duration of its TTL. Pair short-lived access tokens with longer-lived refresh tokens stored in httpOnly cookies.",
            "Always validate the audience (aud) and issuer (iss) claims. A JWT issued for your staging environment should not be accepted by production.",
            "Do not store JWTs in localStorage — XSS attacks can read localStorage. Use httpOnly cookies for the refresh token and in-memory storage for the short-lived access token.",
          ],
        },
        {
          type: "code",
          title: "Secure JWT issuance and verification",
          code: `import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";

// Issue access + refresh token pair after successful login
function issueTokens(userId: number, role: string) {
  const accessToken = jwt.sign(
    { sub: userId, role },
    process.env.JWT_ACCESS_SECRET!,
    {
      algorithm: "HS256",
      expiresIn: ACCESS_TOKEN_TTL,
      issuer:   "auth.example.com",
      audience: "api.example.com",
    }
  );

  const refreshToken = randomBytes(64).toString("hex");  // opaque token, stored in DB
  return { accessToken, refreshToken };
}

// Verify with strict options — reject anything that does not match exactly
function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!, {
    algorithms: ["HS256"],        // reject none, RS256, or any other
    issuer:   "auth.example.com", // reject tokens not issued by us
    audience: "api.example.com",  // reject tokens meant for another service
  });
}

// Auth middleware
async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).end();
  const token = header.slice(7);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    // Distinguish expired vs invalid for better client UX
    if (err.name === "TokenExpiredError") return res.status(401).json({ code: "TOKEN_EXPIRED" });
    return res.status(401).json({ code: "INVALID_TOKEN" });
  }
}`,
        },
      ],
    },
    {
      title: "Input validation as a security boundary",
      blocks: [
        {
          type: "paragraph",
          text: "Input validation is your first line of defense — reject bad data before it reaches your business logic, database, or downstream services. Every piece of data that crosses a trust boundary (HTTP request body, query parameter, URL path segment, webhook payload) must be validated for type, shape, length, and allowed values. Use a schema library like Zod or Joi — do not write manual type checks.",
        },
        {
          type: "code",
          title: "Zod schema validation for security-sensitive endpoints",
          code: `import { z } from "zod";

// Schema validates AND sanitizes the input — no extra manual checks needed
const createUserSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
  password: z.string()
    .min(12, "Password must be at least 12 characters")
    .max(128, "Password must be at most 128 characters")
    // Reject passwords that are just spaces or only digits
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["user", "viewer"]),  // never accept "admin" from the client
  // Age must be a realistic integer — prevents type confusion attacks
  age: z.number().int().min(0).max(150).optional(),
});

// In your route handler:
app.post("/api/users", async (req, res) => {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.format(),
    });
  }

  // result.data is typed and safe to use — unknown fields are stripped
  const { email, password, role } = result.data;
  // ...
});`,
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is the difference between rate limiting and throttling?",
      tag: "Rate limiting",
      answer: [
        "Rate limiting rejects requests that exceed a threshold — the caller gets a 429 Too Many Requests response and must wait before retrying. The rejection is immediate and explicit.",
        "Throttling slows down requests rather than rejecting them — the server introduces artificial delays to pace the caller. Throttling is gentler but can cause timeout issues. In practice, most APIs use rate limiting (reject on threshold) combined with exponential backoff on the client side.",
      ].join("\n\n"),
      callout: "Always include a Retry-After header in 429 responses so clients know how long to wait.",
    },
    {
      question: "What is CORS and why does the browser enforce it?",
      tag: "CORS",
      answer: [
        "CORS is a browser security policy that prevents JavaScript on one origin from reading responses from a different origin without permission. Without it, a malicious script on evil.com could make authenticated requests to bank.com (using the user's cookies) and read the response.",
        "The browser sends a preflight OPTIONS request before any cross-origin request with a non-simple method or custom headers. The server responds with Access-Control-Allow-Origin, Access-Control-Allow-Methods, etc. If the server does not include the requesting origin in the allow list, the browser blocks the response from reaching the JavaScript — even though the request reached the server.",
      ].join("\n\n"),
    },
    {
      question: "What are the most common JWT vulnerabilities?",
      tag: "JWT security",
      answer: [
        "1. Algorithm confusion: accepting 'none' or switching from HS256 to RS256 with the public key as the secret. Always explicitly specify the allowed algorithm when verifying.",
        "2. Weak secrets: an HS256 secret that is short, dictionary-based, or hardcoded can be brute-forced. Use at least 32 cryptographically random bytes.",
        "3. No expiry or long TTL: stolen tokens remain valid indefinitely. Set short TTLs (15 minutes for access tokens) and use refresh tokens for renewal.",
        "4. Missing audience/issuer validation: a JWT from another service in your ecosystem is accepted by your API. Always validate aud and iss.",
      ].join("\n\n"),
    },
    {
      question: "How do you prevent mass assignment vulnerabilities?",
      tag: "Input validation",
      answer: [
        "Mass assignment happens when user-supplied input is passed directly to a database model or object without filtering — for example, User.create(req.body) where req.body includes a role: 'admin' field the user should not be able to set.",
        "Prevention: explicitly define which fields are allowed using an input schema (Zod, Joi) with stripUnknown: true, or whitelist fields manually before passing to the database. Never spread req.body directly into a model creation call.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Implement a token bucket rate limiter in Express that limits to 100 requests per minute per IP using Redis — test it by rapidly calling an endpoint and verifying you receive a 429 with Retry-After.",
    "Configure CORS in an Express app to allow only a specific frontend domain, enable credentials, and cache preflight for 24 hours — verify with a preflight OPTIONS request.",
    "Add JWT verification middleware that explicitly specifies the algorithm, audience, and issuer — test that it rejects a token signed with algorithm 'none'.",
  ],
} satisfies RoadmapDayDetail;
