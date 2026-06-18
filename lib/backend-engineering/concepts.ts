export interface BackendConcept {
  id: number;
  title: string;
  tagline: string;
  description: string;
  whyItMatters: string;
  example: string;
  interviewTip: string;
  tags: string[];
  category: string;
}

export const BACKEND_CATEGORIES = [
  "Core Concepts",
  "Databases & Data Handling",
  "Caching & Performance",
  "Distributed Systems & Scaling",
  "Reliability & Real-World Problems",
] as const;

export const BACKEND_CONCEPTS: BackendConcept[] = [
  // ─── Core Concepts ───────────────────────────────────────────────────────────
  {
    id: 1,
    category: "Core Concepts",
    title: "What is an API",
    tagline: "The contract between two software components",
    description:
      "An API (Application Programming Interface) is a contract that defines how two pieces of software talk to each other — the client makes a request, the server processes it and sends a response.\n\n<b>The three main API styles</b>\n• <b>REST</b> — most popular; each URL is a resource, HTTP verbs express intent, responses are JSON\n  ↳ `GET /users/42` fetches a user, `POST /orders` creates one\n• <b>GraphQL</b> — one endpoint; the client sends a query for exactly the fields it needs, no over- or under-fetching\n  ↳ Facebook invented it so mobile apps could fetch less data on slow connections\n• <b>gRPC</b> — binary Protobuf over HTTP/2; much faster than JSON for internal service-to-service calls\n  ↳ Google routes billions of RPCs/sec between internal services this way",
    whyItMatters:
      "Every system you build will expose or consume APIs — they are the boundary between every component.\n\nIf the API is poorly designed:\n• Clients can't predict what they'll get — different error shapes, inconsistent naming\n• Breaking changes break every integration at once\n• Missing pagination causes clients to miss data or crash on huge responses\n\nGood API design is what makes a service easy to use, extend, and maintain long-term.",
    example:
      "<b>1. Setup</b>\nGitHub exposes a REST API: `GET /repos/:owner/:repo` returns repo metadata, `POST /repos/:owner/:repo/issues` opens a new issue with a JSON body.\n\n<b>2. What happens</b>\nStripe uses REST for payments — `POST /v1/payment_intents` creates a payment intent and returns an object with an ID, status, and client secret for the frontend to confirm.\n\n<b>3. The result</b>\nGoogle's internal microservices route billions of gRPC calls/sec — binary Protobuf payloads are roughly 10× smaller than equivalent JSON, cutting network cost significantly.",
    interviewTip:
      "\"When asked to design a system, define the API contract first — before touching databases or scaling.\"\n• <b>1. Endpoints</b> — what URLs exist, which HTTP method, what the request body looks like\n• <b>2. Response shape</b> — which fields come back, what error codes mean\n• <b>3. Pagination</b> — how clients page through large lists (cursor-based is preferred)\n• <b>4. Versioning</b> — how you evolve the API without breaking existing clients (`/v1/`, `/v2/`)\nDesign from the caller's perspective first.",
    tags: ["REST", "GraphQL", "gRPC", "HTTP", "JSON"],
  },
  {
    id: 2,
    category: "Core Concepts",
    title: "REST vs GraphQL",
    tagline: "Fixed endpoints vs flexible queries",
    description:
      "REST and GraphQL are both ways to expose data over HTTP — they make different trade-offs about who decides what comes back.\n\n<b>REST</b>\n• Fixed URLs per resource — `GET /users/1/posts` always returns the same fields\n• Easy to cache — the URL is the cache key\n• Risk: over-fetching (too many fields) or under-fetching (needs multiple round trips)\n\n<b>GraphQL</b>\n• One endpoint — client sends a query describing exactly which fields it needs\n• Solves over/under-fetching in one request (fetch user + posts + comments together)\n• Harder to cache (POST body, not URL); resolver logic can be complex\n\n<b>gRPC</b>\n• Binary Protobuf over HTTP/2 — schema-first, strongly typed\n• Best for internal service-to-service calls where speed matters more than browser compatibility",
    whyItMatters:
      "Picking the wrong style creates real problems:\n• REST without discipline → N+1 query problem (one request per item in a list)\n• GraphQL without care → complex resolvers that are slow and hard to cache\n• gRPC for public APIs → browsers can't call it without a proxy\n\nKnowing the trade-offs lets you pick the right tool for each use case.",
    example:
      "<b>1. Setup</b>\nGitHub v3 API is REST. To display a repo page you need: `GET /repos/:owner/:repo`, then `GET /repos/:owner/:repo/issues`, then `GET /repos/:owner/:repo/labels` — three round trips.\n\n<b>2. What happens</b>\nGitHub v4 switched to GraphQL. One query fetches the repo, its open issues, and their labels in a single request.\n\n<b>3. The result</b>\nFacebook invented GraphQL because their mobile API required 6+ REST calls for one news feed item over a 2G connection. One GraphQL query replaced them all.",
    interviewTip:
      "\"Name the style you'd pick and immediately justify the trade-off.\"\n• <b>1. REST</b> — simple CRUD, public API, needs HTTP caching → best default\n• <b>2. GraphQL</b> — diverse clients (web vs mobile), data-heavy UI, internal BFF layer\n• <b>3. gRPC</b> — internal microservice calls, high throughput, strongly-typed contracts\nFor most interview system designs, REST is the right default unless the question calls for something else.",
    tags: ["REST", "GraphQL", "gRPC", "Protobuf", "Over-fetching"],
  },
  {
    id: 3,
    category: "Core Concepts",
    title: "HTTP Methods",
    tagline: "GET, POST, PUT, PATCH, DELETE — what each one means",
    description:
      "HTTP methods express intent — they tell the server what to do with the resource at a given URL.\n\n<b>The key methods</b>\n• <b>GET</b> — retrieve data; safe (no side effects) and idempotent (same result every time)\n• <b>POST</b> — create a new resource; neither safe nor idempotent — retrying creates duplicates\n• <b>PUT</b> — replace a resource entirely; idempotent\n• <b>PATCH</b> — update a resource partially (only the fields you send); idempotent\n• <b>DELETE</b> — remove a resource; idempotent\n• <b>HEAD</b> — like GET but returns headers only, no body — useful for checking if a resource exists\n• <b>OPTIONS</b> — describes what methods the server allows; browsers send this as a CORS preflight\n\n<b>Idempotent vs safe</b>\nSafe = no side effects. Idempotent = calling it 10 times has the same effect as calling it once.\n  ↳ GET is both safe and idempotent. DELETE is idempotent but not safe.",
    whyItMatters:
      "Using the wrong method breaks caching, retry logic, and API clarity:\n• Browsers and CDNs only cache GET — POST responses are never cached\n• Idempotent methods (GET, PUT, DELETE) are safe to retry on network failure; POST is not\n• Using POST for everything means clients can never safely retry a failed request\n\nCorrect verb usage is the foundation of a well-behaved REST API.",
    example:
      "<b>1. Setup</b>\nStripe's API: `POST /v1/payment_intents` creates a charge (new resource, not idempotent). `GET /v1/payment_intents/:id` checks its status (safe, idempotent). `DELETE /v1/payment_intents/:id` cancels it.\n\n<b>2. What happens</b>\n`PATCH /v1/customers/:id` updates only the fields in the request body — name, email, or metadata — without replacing the whole customer object.\n\n<b>3. The result</b>\nA client that retries `GET` or `DELETE` on network failure is always safe. A client that retries `POST /orders` without an idempotency key creates duplicate orders.",
    interviewTip:
      "\"POST is not idempotent — that's the key fact interviewers test.\"\n• <b>1. Retry safety</b> — GET, PUT, DELETE are safe to retry; POST needs an idempotency key\n• <b>2. PUT vs PATCH</b> — PUT replaces the full resource; PATCH updates specific fields only\n• <b>3. Caching</b> — only GET responses can be cached by browsers and CDNs\nWhen asked about duplicate order bugs, always bring up POST non-idempotency first.",
    tags: ["GET", "POST", "PUT", "PATCH", "DELETE", "Idempotency"],
  },
  {
    id: 4,
    category: "Core Concepts",
    title: "HTTP Status Codes",
    tagline: "2xx success · 4xx client error · 5xx server error",
    description:
      "HTTP status codes tell the client what happened — success, their mistake, or your mistake.\n\n<b>2xx — Success</b>\n• `200 OK` — request succeeded, body contains the result\n• `201 Created` — a new resource was created (POST succeeded)\n• `204 No Content` — success but no body (DELETE, or PATCH with no return value)\n\n<b>3xx — Redirects</b>\n• `301 Moved Permanently` — URL changed forever; client should update bookmarks\n• `302 Found` — temporary redirect\n\n<b>4xx — Client errors</b>\n• `400 Bad Request` — malformed input (missing required field, wrong type)\n• `401 Unauthorized` — not authenticated (no token or expired token)\n• `403 Forbidden` — authenticated but no permission\n• `404 Not Found` — resource doesn't exist (or server hides it on purpose)\n• `409 Conflict` — state conflict (duplicate resource, optimistic lock failure)\n• `422 Unprocessable Entity` — input is valid JSON but fails business validation\n• `429 Too Many Requests` — rate limited; response includes `Retry-After`\n\n<b>5xx — Server errors</b>\n• `500 Internal Server Error` — unhandled exception\n• `502 Bad Gateway` — upstream service returned invalid response\n• `503 Service Unavailable` — server overloaded or down for maintenance\n• `504 Gateway Timeout` — upstream service took too long",
    whyItMatters:
      "Correct status codes let clients react intelligently:\n• Retry on 5xx (server problem, worth retrying); stop retrying on 4xx (client problem)\n• Show login page on 401; show \"access denied\" on 403\n• Returning `200` with an error body in JSON is an anti-pattern — it breaks monitoring, alerting, and client logic\n\nWrong status codes make APIs unpredictable and hard to debug.",
    example:
      "<b>1. Setup</b>\nGitHub returns `404` even for private repos that exist — to avoid leaking information about whether a private repo exists.\n\n<b>2. What happens</b>\nStripe returns `402 Payment Required` when a charge fails (card declined). Twitter returns `429 Too Many Requests` with a `Retry-After: 60` header when a client exceeds rate limits.\n\n<b>3. The result</b>\nA well-written client retries Stripe calls on 500–503 with backoff, shows the user \"payment failed\" on 402, and backs off for 60 seconds on 429 — all driven by the status code alone.",
    interviewTip:
      "\"The two most commonly confused codes are 401 and 403 — know the difference.\"\n• <b>1. 401 vs 403</b> — 401 = not logged in; 403 = logged in but not allowed\n• <b>2. 400 vs 422</b> — 400 = malformed request (bad JSON); 422 = valid format but fails validation\n• <b>3. Never 200 on error</b> — returning `{\"error\": \"not found\"}` with status 200 breaks monitoring tools\nAlways use the most specific code available.",
    tags: ["2xx", "4xx", "5xx", "401", "403", "429"],
  },
  {
    id: 5,
    category: "Core Concepts",
    title: "Stateless vs Stateful APIs",
    tagline: "Does the server remember who you are between requests?",
    description:
      "A stateless API treats every request as independent — the server keeps no memory of previous calls. Everything the server needs must arrive in the request itself (token, params, body).\n\n<b>Stateless APIs</b>\n• Any server in the pool can handle any request — trivial to scale horizontally\n• No sticky sessions needed — load balancer can route freely\n• REST is stateless by design\n  ↳ A JWT carries the user's identity in every request — the server reads it, no DB lookup needed\n\n<b>Stateful APIs</b>\n• The server stores session data between calls (in memory or a DB)\n• Clients must go back to the same server — or state must be shared across servers\n• WebSocket connections are stateful — one persistent, bidirectional connection per client\n  ↳ Requires sticky sessions or a shared session store (Redis)",
    whyItMatters:
      "Stateful servers are hard to scale:\n• Adding 3 more servers doesn't help if clients are pinned to server #1 via sticky sessions\n• Server crashes lose all in-memory session state\n• Zero-downtime deploys require draining sessions carefully\n\nStateless design is the foundation of horizontal scaling — it's why cloud-native apps default to JWT over session cookies.",
    example:
      "<b>1. Setup</b>\nOld PHP app: user logs in, server creates a session record in memory and sends a `session_id` cookie. Every request hits the same server to read that session.\n\n<b>2. What happens</b>\nModern JWT API: user logs in, server signs a JWT containing `{userId, roles, exp}` and returns it. Every subsequent request includes the JWT in the `Authorization` header — any server verifies the signature independently.\n\n<b>3. The result</b>\nTwitter moving from server sessions to JWTs was a key step in scaling their API to thousands of servers. No shared session store means any server handles any request.",
    interviewTip:
      "\"When designing a scalable system, always default to stateless APIs.\"\n• <b>1. Prefer JWT</b> — carries identity in the token, no server-side session storage\n• <b>2. Externalise state</b> — shopping carts, real-time presence → Redis, not server memory\n• <b>3. WebSockets are stateful</b> — mention this when designing chat or live features; requires sticky routing or a pub/sub layer (Redis pub/sub)\nThe stateless default is what enables auto-scaling groups to work.",
    tags: ["Stateless", "Stateful", "JWT", "Sessions", "Horizontal Scaling"],
  },
  {
    id: 6,
    category: "Core Concepts",
    title: "Authentication vs Authorization",
    tagline: "Who are you? vs What can you do?",
    description:
      "These are two separate checks that always run in order — you can't authorise someone you haven't identified yet.\n\n<b>Authentication (AuthN) — who are you?</b>\n• Verifies identity: password, token, biometric, or certificate\n• If the check fails → `401 Unauthorized`\n  ↳ Login with password, verify a JWT signature, validate an API key\n\n<b>Authorization (AuthZ) — what can you do?</b>\n• Checks permissions after identity is confirmed\n• If you're authenticated but lack permission → `403 Forbidden`\n• Common models:\n  ↳ <b>RBAC</b> (role-based) — admin, editor, viewer roles determine access\n  ↳ <b>ABAC</b> (attribute-based) — rules on user + resource attributes (department, owner, classification)\n  ↳ <b>ACL</b> (access control list) — per-resource list of who can do what",
    whyItMatters:
      "Confusing the two is a security vulnerability:\n• Authenticated ≠ authorised — a logged-in user can still be denied access to a specific resource\n• Broken access control is OWASP's #1 API vulnerability — skipping AuthZ checks even for authenticated users\n• Trusting the client for AuthZ decisions (hiding a button in the UI) is not security\n\nBoth checks must happen server-side on every single request.",
    example:
      "<b>1. Setup</b>\nGitHub: AuthN = your username + password + 2FA (who you are). AuthZ = your organisation membership and repo permissions (what you can access).\n\n<b>2. What happens</b>\nA fine-grained GitHub token may restrict a user to read-only access on one specific repo — even if they're an org admin. The token's scope is the AuthZ boundary.\n\n<b>3. The result</b>\nGoogle Cloud IAM uses ABAC — a rule like \"users in the `data-eng` group can read BigQuery tables tagged `internal`\" replaces managing hundreds of individual permissions.",
    interviewTip:
      "\"Always enforce AuthZ server-side — never trust the client to hide UI elements as security.\"\n• <b>1. 401 vs 403</b> — return 401 when unauthenticated, 403 when authenticated but forbidden\n• <b>2. RBAC for simplicity</b> — roles map cleanly to org structure (admin/member/viewer)\n• <b>3. ABAC for scale</b> — when roles aren't fine-grained enough, use attribute-based rules or a policy engine like Open Policy Agent\nMention that AuthZ must be re-checked on every request, not just at login.",
    tags: ["Authentication", "Authorization", "RBAC", "ABAC", "JWT"],
  },
  {
    id: 7,
    category: "Core Concepts",
    title: "Session-based Auth vs JWT",
    tagline: "Server stores state vs client carries a signed token",
    description:
      "Both approaches verify who a user is on every request — they differ in where that state is stored.\n\n<b>Session-based auth</b>\n• On login: server creates a session record (in DB or Redis), returns a `session_id` cookie\n• On every request: server looks up the session record by ID\n• Easy to revoke (delete the session), but requires shared session storage across all servers\n  ↳ Works well for banking apps where instant revocation matters\n\n<b>JWT (JSON Web Token)</b>\n• On login: server signs a payload (`{userId, roles, exp}`) with a secret key, returns the token\n• On every request: server verifies the signature — no DB lookup needed\n• Stateless and fast, but hard to revoke before expiry\n  ↳ Workaround: short expiry (15 min) + refresh tokens + optional blocklist for explicit logout",
    whyItMatters:
      "Choosing wrong creates real trade-offs:\n• JWTs enable stateless horizontal scaling but a stolen token is valid until expiry — no instant kill switch\n• Sessions are easy to invalidate but require a shared store — adds latency and becomes a bottleneck at scale\n• Short-lived JWTs + refresh tokens are the modern compromise — most SaaS apps use this pattern\n\nThe right choice depends on your revocation requirements and scale.",
    example:
      "<b>1. Setup</b>\nAuth0 and Firebase Auth issue JWTs with a 1-hour expiry and a long-lived refresh token stored in an `HttpOnly` cookie.\n\n<b>2. What happens</b>\nWhen the 1-hour access token expires, the client silently sends the refresh token. The auth server validates it and issues a new access token — no re-login needed.\n\n<b>3. The result</b>\nThe banking app Monzo uses server sessions with strict 5-minute timeouts — instant revocation on logout matters more than scaling efficiency. Auth0 (millions of apps) uses JWTs — stateless verification handles billions of requests without a session DB.",
    interviewTip:
      "\"If asked how to log out a user with JWTs, describe the full token lifecycle.\"\n• <b>1. Short TTL</b> — access token expires in 15 minutes; limits damage from theft\n• <b>2. Refresh tokens</b> — longer-lived, stored in `HttpOnly` cookie; rotate on use\n• <b>3. Blocklist</b> — for explicit logout before expiry, store revoked JTIs in Redis with TTL matching token expiry\nThe pattern is: short-lived access token + long-lived refresh token + blocklist for forced logout.",
    tags: ["JWT", "Sessions", "Refresh Tokens", "HttpOnly Cookie", "Revocation"],
  },
  {
    id: 8,
    category: "Core Concepts",
    title: "OAuth 2.0",
    tagline: "Delegated access — login with Google, GitHub, etc.",
    description:
      "OAuth 2.0 lets a user grant your app limited access to their account on another service — without sharing their password.\n\n<b>The four roles</b>\n• <b>Resource Owner</b> — the user who owns the data\n• <b>Client</b> — your app that wants access\n• <b>Authorization Server</b> — the identity provider (Google, GitHub, Auth0)\n• <b>Resource Server</b> — the API that holds the data\n\n<b>Authorization Code flow (most common)</b>\n1. User clicks \"Login with Google\" → your app redirects them to Google\n2. User logs in and approves the requested scopes (e.g., read email)\n3. Google sends a `code` to your server's redirect URI\n4. Your server exchanges the `code` for an access token (server-to-server, secret stays hidden)\n5. Your server uses the access token to call Google APIs on the user's behalf\n\n<b>PKCE (Proof Key for Code Exchange)</b>\nExtends the flow for public clients (mobile apps, SPAs) where the client secret can't be stored safely",
    whyItMatters:
      "OAuth solves the password anti-pattern — users never hand your app their Google or GitHub credentials:\n• You get a scoped token (e.g., read-only email access) — you can't do more than the user approved\n• The implicit flow (token in URL fragment) is deprecated — it leaks tokens in browser history and server logs\n• OpenID Connect (OIDC) builds on OAuth 2.0 to add identity — the ID token (a JWT) tells you who the user is\n\nWithout OAuth, \"Login with X\" would require users to give you their credentials for X.",
    example:
      "<b>1. Setup</b>\n\"Login with Google\" on your app uses OAuth 2.0 + OIDC. Your app registers with Google and gets a `client_id` and `client_secret`.\n\n<b>2. What happens</b>\nUser clicks login → redirected to Google → approves → Google sends `code` to `https://yourapp.com/callback` → your server POSTs to Google's token endpoint → receives an access token + ID token (JWT).\n\n<b>3. The result</b>\nThe ID token contains `{sub, email, name, picture}` — you create or log in the user. Spotify uses OAuth so third-party apps can control playback without ever seeing the user's Spotify password.",
    interviewTip:
      "\"Know the Authorization Code + PKCE flow — the implicit flow is deprecated.\"\n• <b>1. Auth Code flow</b> — server-side apps; `code` exchanged server-to-server so the secret is never exposed\n• <b>2. PKCE</b> — mobile/SPA; replaces the client secret with a code verifier/challenge pair\n• <b>3. OAuth vs OIDC</b> — OAuth = authorisation (what you can do); OIDC = authentication (who you are) built on top of OAuth\nScopes define the minimum access — always request the least privilege needed.",
    tags: ["OAuth 2.0", "OIDC", "Authorization Code", "PKCE", "Scopes"],
  },
  {
    id: 9,
    category: "Core Concepts",
    title: "Rate Limiting vs Throttling",
    tagline: "Protecting your API from overload and abuse",
    description:
      "Rate limiting and throttling both protect an API from too much traffic — they differ in what happens to excess requests.\n\n<b>Rate limiting</b>\n• Hard cap: once a client exceeds the limit, requests are rejected with `429 Too Many Requests`\n• Response includes `Retry-After` and `X-RateLimit-Remaining` headers\n\n<b>Throttling</b>\n• Soft slowdown: excess requests are queued or delayed rather than rejected\n• Useful when brief bursts are acceptable but sustained overload must be prevented\n\n<b>Common algorithms</b>\n• <b>Fixed Window</b> — count resets at window boundary (e.g., every minute); vulnerable to burst at the boundary edge\n• <b>Sliding Window</b> — rolling count over the last N seconds; smoother, no boundary spikes\n• <b>Token Bucket</b> — tokens replenish at a rate; burst allowed up to bucket size; most widely used\n  ↳ Think of it as a bucket that fills at 10 tokens/sec and holds max 50 — you can burst up to 50, then you're capped at 10/sec\n• <b>Leaky Bucket</b> — requests queue and drain at a fixed rate; smooth output regardless of burst",
    whyItMatters:
      "Without rate limiting:\n• One abusive client starves all others — API becomes unusable\n• Cascading failures: your API overloads the DB, DB crashes, everything goes down\n• Brute-force attacks on login endpoints succeed unchecked\n• Cloud bills spike on traffic spikes from scrapers or bugs\n\nRate limiting is the first line of defence for both reliability and security.",
    example:
      "<b>1. Setup</b>\nGitHub API: authenticated users get 5,000 requests/hour, unauthenticated get 60/hour. Each response includes `X-RateLimit-Remaining` and `X-RateLimit-Reset`.\n\n<b>2. What happens</b>\nTwitter (now X) enforces per-endpoint limits: 180 tweet lookups per 15-minute window per user token. Exceeding it returns `429` with a `retry_after` timestamp.\n\n<b>3. The result</b>\nStripe implements token bucket per API key — short bursts (10 requests at once) are allowed, but sustained throughput is capped. Clients that respect `Retry-After` work seamlessly; those that ignore it get banned.",
    interviewTip:
      "\"Token bucket is the safest interview answer — explain the replenishment rate and burst capacity.\"\n• <b>1. Token bucket</b> — describe how tokens refill at a rate and burst up to bucket size\n• <b>2. Where to enforce</b> — at the API gateway, not inside each service (centralised, consistent)\n• <b>3. Granularity</b> — can be per-IP, per-user, or per-API-key; API-key granularity is most useful\nFor login endpoints, mention stricter limits plus CAPTCHA as a second layer.",
    tags: ["Rate Limiting", "Throttling", "Token Bucket", "429", "API Gateway"],
  },
  {
    id: 10,
    category: "Core Concepts",
    title: "Idempotency",
    tagline: "Safe to retry — same result no matter how many times you call it",
    description:
      "An operation is idempotent if calling it 10 times has exactly the same effect as calling it once.\n\n<b>Which HTTP methods are idempotent?</b>\n• `GET` — reads don't change state; always idempotent\n• `PUT` — replaces a resource; same PUT twice leaves the same result\n• `DELETE` — deleting what's already deleted is a no-op\n• `POST` — NOT idempotent by default — retrying `POST /orders` creates a second order\n• `PATCH` — depends on the operation (replace field = idempotent; increment field = not)\n\n<b>Making POST idempotent with an idempotency key</b>\n1. Client generates a unique ID for this intent (e.g., a UUID)\n2. Client includes it as a header: `Idempotency-Key: uuid-here`\n3. Server stores `(key → result)` in a DB before executing\n4. On retry with the same key, server returns the stored result without re-executing\n  ↳ Stored results typically expire after 24 hours",
    whyItMatters:
      "Networks fail. Clients retry. Without idempotency:\n• A retried payment charges the customer twice\n• A retried order creates two shipments\n• A retried email sends the message twice\n\nIdempotency keys are non-negotiable for any money-moving or action-triggering API. They are the difference between a retry being safe and being catastrophic.",
    example:
      "<b>1. Setup</b>\nStripe's API accepts an `Idempotency-Key` header on `POST /v1/payment_intents`. The client includes a UUID tied to this specific payment attempt.\n\n<b>2. What happens</b>\nThe request times out before the client receives a response. The client doesn't know if the charge succeeded. It retries with the same `Idempotency-Key`.\n\n<b>3. The result</b>\nStripe looks up the key in its database, finds the original charge, and returns that result — no second charge. Without the key, the retry would have created a duplicate charge.",
    interviewTip:
      "\"When designing a payment or order API, bring up idempotency keys proactively — it shows production maturity.\"\n• <b>1. Key storage</b> — store `(key, result)` in a DB with a TTL; use UPSERT to handle race conditions\n• <b>2. Race condition</b> — two retries arrive simultaneously; use a DB-level unique constraint on the key + advisory lock\n• <b>3. Scope</b> — idempotency keys are also critical for message queue consumers (at-least-once delivery)\nAlways identify which operations in your design are non-idempotent and add keys there.",
    tags: ["Idempotency", "Retry", "Idempotency Key", "Payments", "POST"],
  },

  // ─── Databases & Data Handling ───────────────────────────────────────────────
  {
    id: 11,
    category: "Databases & Data Handling",
    title: "SQL vs NoSQL",
    tagline: "When to use relational tables vs flexible documents",
    description:
      "SQL and NoSQL databases store data differently — the right choice depends on your data shape, consistency needs, and scale.\n\n<b>SQL (relational) databases</b>\n• Data lives in tables with a fixed schema; rows link via foreign keys\n• Strong ACID guarantees — safe for financial or transactional data\n• Great for complex queries with JOINs across many entities\n  ↳ PostgreSQL, MySQL — the default choice for most web apps\n\n<b>NoSQL databases — four models</b>\n• <b>Document</b> (MongoDB) — JSON-like records with flexible schema; good for user profiles, catalogs\n• <b>Key-Value</b> (Redis, DynamoDB) — ultra-fast single-key lookups; caches, sessions, leaderboards\n• <b>Wide-Column</b> (Cassandra) — rows with dynamic columns; built for massive write throughput and time-series data\n• <b>Graph</b> (Neo4j) — nodes and edges; great for social networks and recommendation engines\n\nNoSQL databases often trade consistency for availability and horizontal scale — not universally better, just a different tool.",
    whyItMatters:
      "Mismatching database to workload is one of the most common system design mistakes:\n• Using a relational DB for write-heavy time-series data → tables become too wide, writes too slow\n• Using a document store for complex multi-entity transactions → no referential integrity, data drifts out of sync\n• Most production systems use multiple databases — SQL for core business data, Redis for caching, Cassandra for high-throughput writes\n\nKnowing when to reach for each type is the mark of a senior engineer.",
    example:
      "<b>1. Setup</b>\nInstagram's data stack uses three different databases for three different purposes.\n\n<b>2. What happens</b>\n• PostgreSQL — user accounts, follows, likes (relational data, ACID transactions needed)\n• Cassandra — the activity feed (append-heavy, time-ordered, billions of writes/day)\n• Redis — caching, rate limiting, and session storage (sub-millisecond reads)\n\n<b>3. The result</b>\nEach database handles what it's designed for. Using PostgreSQL for all three would have collapsed under Cassandra's write volume.",
    interviewTip:
      "\"Say 'it depends' and immediately explain the trade-off — never pick one without justifying why.\"\n• <b>1. SQL</b> — relational data, complex queries, transactions matter → PostgreSQL is the default\n• <b>2. Document</b> — flexible schema, self-contained records, no complex JOINs → MongoDB\n• <b>3. Wide-column</b> — massive write throughput, append-only, time-series → Cassandra\n• <b>4. Key-value</b> — cache layer, session store, counters → Redis\nOften the best answer is: SQL as the core, Redis for cache, and a specialised store for high-throughput workloads.",
    tags: ["SQL", "NoSQL", "PostgreSQL", "MongoDB", "Cassandra"],
  },
  {
    id: 12,
    category: "Databases & Data Handling",
    title: "Indexes",
    tagline: "Data structures that make queries fast — at a write cost",
    description:
      "An index is a data structure the database maintains alongside the table so it can find rows without scanning every row.\n\n<b>How indexes work</b>\n• Without an index: `WHERE email = 'x'` scans every row — O(n) — 1 million rows = 1 million reads\n• With a B-Tree index on `email`: binary search finds the row in O(log n) — 1 million rows = ~20 reads\n• Hash indexes are faster for exact lookups but can't do range queries (`WHERE price > 100`)\n\n<b>Types of indexes</b>\n• <b>Single-column</b> — `CREATE INDEX ON users(email)`\n• <b>Composite</b> — `CREATE INDEX ON orders(user_id, created_at DESC)`\n  ↳ Speeds up queries filtering by `user_id`, or `user_id + created_at` together, but NOT `created_at` alone (leftmost prefix rule)\n• <b>Partial</b> — `CREATE INDEX ON users(email) WHERE deleted_at IS NULL` — smaller, faster for active-only queries\n• <b>Covering</b> — index includes all columns the query needs; the DB never touches the table row at all\n\n<b>The cost</b>\nEvery `INSERT`, `UPDATE`, and `DELETE` must update all indexes on the table — indexes slow writes.",
    whyItMatters:
      "Missing indexes are the most common source of slow queries in production:\n• A full table scan on 10 million rows takes seconds — the same query with an index takes milliseconds\n• Over-indexing slows writes and wastes disk — every write touches every index\n• `EXPLAIN ANALYZE` shows whether the query planner uses your index or ignores it\n\nAdding the right index is often the highest-leverage performance fix available.",
    example:
      "<b>1. Setup</b>\nAn `orders` table has 50 million rows. The query `SELECT * FROM orders WHERE user_id = 123 ORDER BY created_at DESC LIMIT 20` runs every time a user views their order history.\n\n<b>2. What happens</b>\nWithout an index: Postgres does a full sequential scan of all 50 million rows — query takes 8 seconds.\nWith `CREATE INDEX ON orders(user_id, created_at DESC)`: the planner uses an index scan — query takes 2 ms.\n\n<b>3. The result</b>\nA composite index on `(user_id, created_at DESC)` satisfies both the WHERE filter and the ORDER BY in one index pass. A covering index that also includes the returned columns would eliminate the table heap access entirely.",
    interviewTip:
      "\"Always discuss the read/write trade-off — indexes aren't free.\"\n• <b>1. B-Tree vs Hash</b> — B-Tree for range queries and sorting; Hash for exact equality only\n• <b>2. Composite ordering</b> — put the most-filtered column first; match column order to query pattern\n• <b>3. Covering index</b> — if a query only needs indexed columns, the DB never reads the table row\n• <b>4. Check with EXPLAIN</b> — always verify the query planner actually uses your index\nFor write-heavy tables, index sparingly — each extra index adds overhead to every INSERT.",
    tags: ["B-Tree", "Index", "Composite Index", "EXPLAIN", "Query Optimization"],
  },
  {
    id: 13,
    category: "Databases & Data Handling",
    title: "ACID Properties",
    tagline: "The four guarantees that make relational databases trustworthy",
    description:
      "ACID is a set of four guarantees that ensure database transactions are reliable even when things go wrong.\n\n<b>A — Atomicity</b>\n• A transaction is all-or-nothing — if any step fails, every previous step in the transaction is rolled back\n  ↳ Transfer $100: debit account A AND credit account B. If the credit fails, the debit is reversed.\n\n<b>C — Consistency</b>\n• Every transaction leaves the database in a valid state — all constraints, foreign keys, and rules must hold\n  ↳ A NOT NULL constraint won't let a partial write leave a null where a value is required\n\n<b>I — Isolation</b>\n• Concurrent transactions don't interfere with each other — each transaction sees a consistent snapshot\n  ↳ Four isolation levels control exactly how much concurrency is allowed (covered in the next concept)\n\n<b>D — Durability</b>\n• Once a transaction commits, it is permanent — even if the server crashes a millisecond later\n  ↳ Postgres writes to a write-ahead log (WAL) before confirming — the log survives crashes",
    whyItMatters:
      "Without ACID guarantees:\n• Partial writes corrupt data — money debited but never credited\n• Concurrent reads see half-written states — user sees a profile that's half-updated\n• Crashes lose committed data — payment confirmed but not saved\n\nNoSQL databases often relax ACID for higher write throughput (eventual consistency). Knowing when that trade-off is safe — and when it isn't — is a core system design skill.",
    example:
      "<b>1. Setup</b>\nBank transfer: move $500 from Alice's account to Bob's account. This requires two writes: `UPDATE accounts SET balance = balance - 500 WHERE id = alice` and `UPDATE accounts SET balance = balance + 500 WHERE id = bob`.\n\n<b>2. What happens</b>\nServer crashes after the first write. Without atomicity, Alice loses $500 and Bob gets nothing. With atomicity, the incomplete transaction is rolled back on restart — both accounts return to their original balances.\n\n<b>3. The result</b>\nPostgreSQL and MySQL (InnoDB) provide full ACID. Cassandra provides eventual consistency — writes are fast, but you can read stale data momentarily. For financial transactions, ACID is non-negotiable.",
    interviewTip:
      "\"Know all four properties and what breaks if each one is missing.\"\n• <b>1. Atomicity</b> — no partial writes; all-or-nothing\n• <b>2. Consistency</b> — constraints always hold; valid state in, valid state out\n• <b>3. Isolation</b> — concurrent transactions don't see each other's dirty writes\n• <b>4. Durability</b> — committed data survives crashes (WAL / write-ahead log)\nIsolation levels are the most common follow-up — lead with: \"Postgres defaults to Read Committed, which prevents dirty reads but allows non-repeatable reads.\"",
    tags: ["Atomicity", "Consistency", "Isolation", "Durability", "Transactions"],
  },
  {
    id: 14,
    category: "Databases & Data Handling",
    title: "Transactions & Isolation Levels",
    tagline: "Controlling what concurrent transactions can see",
    description:
      "Isolation levels control how much concurrent transactions can see of each other's in-progress work. Higher isolation = safer but slower.\n\n<b>The four levels (weakest → strongest)</b>\n• <b>Read Uncommitted</b> — can read dirty (uncommitted) data from other transactions; almost never used\n• <b>Read Committed</b> (Postgres default) — only sees committed data; same row can read differently within one transaction (non-repeatable read)\n• <b>Repeatable Read</b> — same row returns same value within a transaction; but new rows inserted by others can appear (phantom read)\n• <b>Serializable</b> — transactions behave as if run one at a time; no anomalies; highest locking overhead\n\n<b>Common anomalies</b>\n• <b>Dirty read</b> — reading uncommitted data that may be rolled back\n• <b>Non-repeatable read</b> — same row reads differently twice in one transaction (another transaction committed between reads)\n• <b>Phantom read</b> — a range query returns different rows if another transaction inserts between reads\n• <b>Write skew</b> — two transactions each read the same data and both write based on what they saw, causing an inconsistency\n  ↳ Classic example: two doctors both see \"one doctor on call\" and both go off call — now zero doctors on call",
    whyItMatters:
      "Wrong isolation level causes subtle, hard-to-reproduce bugs:\n• Lost update — two concurrent updates both read `balance = $100`, both subtract $10, both write $90 — one subtraction is lost\n• Double booking — two requests both read `seats_available = 1`, both reserve, both succeed — seat is sold twice\n• Write skew — two transactions each act on shared state without seeing each other's write\n\nRead Committed is correct for most apps; Serializable is needed for safety-critical concurrency.",
    example:
      "<b>1. Setup</b>\nA concert ticket booking system: `SELECT seats_available FROM events WHERE id = 42` returns 1. Two users simultaneously try to book the last seat.\n\n<b>2. What happens</b>\nUnder `READ COMMITTED`: both transactions read `seats_available = 1`, both decrement, both commit — seat is oversold.\nWith `SELECT FOR UPDATE` (pessimistic lock): the second transaction blocks until the first commits; it then reads `seats_available = 0` and fails gracefully.\n\n<b>3. The result</b>\nBooking systems use `SERIALIZABLE` or `SELECT FOR UPDATE` to prevent double-booking. Reporting queries use `READ COMMITTED` to avoid blocking writes. Most CRUD apps are fine with Postgres's `READ COMMITTED` default.",
    interviewTip:
      "\"Know the four levels and one anomaly each one prevents.\"\n• <b>1. Read Committed</b> — prevents dirty reads; Postgres default; right for most apps\n• <b>2. Repeatable Read</b> — prevents non-repeatable reads; use for multi-step calculations\n• <b>3. Serializable</b> — prevents all anomalies including write skew; use for booking, inventory\n• <b>4. SELECT FOR UPDATE</b> — pessimistic lock; use when you must prevent a specific row from changing\nWrite skew is the classic senior-level anomaly to describe — prepare an example.",
    tags: ["Isolation Levels", "Serializable", "Dirty Read", "Phantom Read", "SELECT FOR UPDATE"],
  },
  {
    id: 15,
    category: "Databases & Data Handling",
    title: "Normalization vs Denormalization",
    tagline: "Remove redundancy vs duplicate data for speed",
    description:
      "Normalization and denormalization are opposite strategies for organising data — you choose based on your read/write ratio.\n\n<b>Normalization — reduce redundancy</b>\n• Split related data into separate tables linked by foreign keys\n• One source of truth — update a user's name in one place and every related record reflects it\n• Queries need JOINs to reassemble data\n  ↳ 3NF: every non-key column depends only on the primary key — no partial or transitive dependencies\n\n<b>Denormalization — duplicate for speed</b>\n• Copy data into the table that queries it most — avoid JOINs on hot paths\n• Faster reads, but writes must update every copy and copies can drift out of sync\n  ↳ Store `author_name` in every `posts` row instead of JOINing to `users` on every read\n\n<b>Materialized views</b>\n• A middle ground — precomputed query results stored as a table, refreshed on a schedule\n  ↳ Great for dashboards and aggregations that are expensive to recompute on every request",
    whyItMatters:
      "The wrong choice causes real performance problems:\n• Too normalized → heavy JOINs on hot-path queries slow the app at scale\n• Too denormalized → update anomalies (change a price in one place, stale copies elsewhere)\n• Most production systems start normalized then selectively denormalize specific hot-path queries\n\nThe decision is always driven by the query patterns, not a theoretical preference.",
    example:
      "<b>1. Setup</b>\nAn e-commerce system stores orders. Normalized: `orders.product_id` → FK to `products.id`. Denormalized: `orders.product_name` and `orders.product_price_at_purchase` stored directly.\n\n<b>2. What happens</b>\nProduct prices change. If `orders` had a FK to `products`, the receipt would show today's price, not what the customer paid. By denormalizing the price into the order row, the historical purchase price is preserved forever.\n\n<b>3. The result</b>\nThis is intentional denormalization — the data needs to be frozen at point-in-time. Most order receipts at Amazon, Shopify, or Stripe work this way.",
    interviewTip:
      "\"Start normalized, then denormalize specific hot-path queries with justification.\"\n• <b>1. Start 3NF</b> — one source of truth, no anomalies\n• <b>2. Profile first</b> — identify which queries are slow due to JOINs before denormalizing\n• <b>3. Materialized views</b> — denormalize reads without changing the write model\n• <b>4. Intentional denormalization</b> — point-in-time snapshots (order receipts, audit logs) are legitimately denormalized\nNever denormalize speculatively — measure first.",
    tags: ["Normalization", "Denormalization", "JOINs", "1NF", "Materialized Views"],
  },
  {
    id: 16,
    category: "Databases & Data Handling",
    title: "Pagination",
    tagline: "Offset vs cursor — how to fetch large lists efficiently",
    description:
      "Pagination breaks large result sets into pages — the two main approaches have very different performance characteristics.\n\n<b>Offset pagination</b>\n• `SELECT * FROM posts ORDER BY id LIMIT 20 OFFSET 100`\n• Simple to implement; supports jumping to page N\n• Problem 1: slow at large offsets — the DB scans and discards 100 rows before returning 20\n• Problem 2: if rows are inserted or deleted between pages, items skip or repeat\n  ↳ Works fine for admin UIs with small, stable tables\n\n<b>Cursor-based pagination (keyset pagination)</b>\n• `SELECT * FROM posts WHERE id > :last_seen_id ORDER BY id LIMIT 20`\n• The cursor is the last item's unique sortable value (ID or `created_at`)\n• Fast: uses the index directly — O(log n) regardless of offset depth\n• Stable: insertions between pages don't cause items to shift\n• Limitation: can't jump to arbitrary page numbers — designed for infinite scroll\n  ↳ Cursor is typically base64-encoded and opaque to clients",
    whyItMatters:
      "Offset pagination becomes a performance disaster at scale:\n• `OFFSET 50000` on a 5-million-row table forces the DB to read and discard 50,000 rows every page load\n• Cursor pagination is O(log n) via the index — performance doesn't degrade with depth\n• Real-time feeds (Twitter, Instagram) use cursors — offset pagination produces gaps and duplicates when content arrives between pages",
    example:
      "<b>1. Setup</b>\nGitHub's API returns a `Link` header: `<https://api.github.com/repos/...?page=2>; rel=\"next\"` for offset, or a cursor token for the newer list endpoints.\n\n<b>2. What happens</b>\nStripe's list endpoints return `{data: [...], has_more: true, next_page: \"cursor_token\"}`. The cursor is the ID of the last item in the current page.\n\n<b>3. The result</b>\nTwitter's timeline cursor is opaque (`next_cursor_str`) — clients pass it back to get the next batch without any knowledge of what it encodes. The server uses it as `WHERE tweet_id < :cursor` — an index seek, not an offset scan.",
    interviewTip:
      "\"Default to cursor-based pagination for any large or real-time dataset.\"\n• <b>1. Cursor = last seen ID</b> — `WHERE id > :cursor LIMIT 20`; fast index seek\n• <b>2. Opaque cursor</b> — base64-encode it; clients treat it as a black box\n• <b>3. When to use offset</b> — admin UIs with small stable tables, or when users need \"go to page 47\"\n• <b>4. Cursor stability</b> — cursors should never expire; using `created_at` as cursor requires a tiebreaker (add `id`) for rows created at the same timestamp\nMention OFFSET performance degradation — it's a common interview follow-up.",
    tags: ["Pagination", "Cursor", "Offset", "Keyset Pagination", "Infinite Scroll"],
  },
  {
    id: 17,
    category: "Databases & Data Handling",
    title: "Sharding & Partitioning",
    tagline: "Split data across multiple machines or tables",
    description:
      "When one database server can't hold all your data or handle all your writes, you split the data across multiple nodes.\n\n<b>Horizontal partitioning (sharding)</b>\n• Rows are split across multiple DB instances (shards) by a shard key\n• Each shard holds a subset of the rows; together they hold everything\n\n<b>Sharding strategies</b>\n• <b>Range sharding</b> — shard 1 holds IDs 1–1M, shard 2 holds 1M–2M, etc.\n  ↳ Risk: hot spots if recent data (highest IDs) is accessed most — all writes hit shard 2\n• <b>Hash sharding</b> — `hash(user_id) % N` determines the shard\n  ↳ Even distribution, but hard to rebalance when N changes\n• <b>Directory sharding</b> — a lookup service maps each key to its shard\n  ↳ Flexible, but the lookup service becomes a bottleneck and single point of failure\n\n<b>The hard parts</b>\n• Cross-shard JOINs are impossible — data must be denormalized\n• Distributed transactions across shards require two-phase commit or saga pattern\n• Schema changes must be applied to every shard",
    whyItMatters:
      "A single DB server has hard limits on CPU, RAM, and disk I/O. Sharding is how you scale writes horizontally beyond those limits:\n• The shard key decision is permanent — it's very expensive to change later\n• Wrong shard key causes hot shards (one shard gets all the traffic while others sit idle)\n• Sharding adds complexity — exhaust vertical scaling, read replicas, and caching first",
    example:
      "<b>1. Setup</b>\nDiscord serves billions of messages. A single Postgres instance can't hold them all.\n\n<b>2. What happens</b>\nDiscord shards messages by `guild_id` (server ID). All messages in one Discord server land on one shard — no cross-shard queries needed when loading a channel's history.\n\n<b>3. The result</b>\nWhatsApp shards by phone number hash — even distribution, no hot spots. YouTube uses Vitess, a MySQL sharding layer that makes sharding transparent to the application. Discord later migrated to Cassandra for messages — Cassandra handles sharding natively.",
    interviewTip:
      "\"Pick a shard key that distributes writes evenly AND keeps related data on one shard.\"\n• <b>1. Avoid hot keys</b> — `country_code` is terrible (US gets 90% of traffic)\n• <b>2. Keep related data together</b> — shard by `user_id` so all a user's data lands on one shard\n• <b>3. Hash for even distribution</b> — consistent hashing handles rebalancing when you add nodes\n• <b>4. Try simpler first</b> — exhaust read replicas and vertical scaling before reaching for sharding\nMention that cross-shard queries and schema migrations are the operational pain points.",
    tags: ["Sharding", "Partitioning", "Shard Key", "Hash Sharding", "Hot Spot"],
  },
  {
    id: 18,
    category: "Databases & Data Handling",
    title: "Read Replicas & Write Scaling",
    tagline: "Scale reads by adding copies; writes still go to one primary",
    description:
      "A primary (leader) database handles all writes. Read replicas receive a continuous stream of changes and serve read queries.\n\n<b>How replication works</b>\n• Primary writes changes to a Write-Ahead Log (WAL) or binlog\n• Replicas stream the WAL and apply the same changes in order\n• Reads can be routed to any replica — writes always go to primary\n\n<b>Replication lag</b>\n• Replicas are slightly behind the primary — usually milliseconds, can be seconds under load\n• Reading your own write immediately after updating may return stale data from a replica\n• Mitigation strategies:\n  ↳ <b>Read-your-writes</b> — route reads to primary for N seconds after a write\n  ↳ <b>Synchronous replication</b> — primary waits for at least one replica to confirm before committing; zero lag but higher write latency\n  ↳ <b>Sticky routing</b> — pin a user to the primary briefly after any write",
    whyItMatters:
      "Most web apps are read-heavy (often 10:1 reads vs writes). Read replicas let you scale read throughput cheaply:\n• Add 5 replicas → read capacity ×5 — without touching write performance\n• Replicas can serve analytics and reporting queries without impacting production write performance\n• But replication lag must be handled — user updates their profile and immediately sees the old value if you read from a stale replica",
    example:
      "<b>1. Setup</b>\nGitHub serves millions of repository page views per day from dozens of MySQL read replicas.\n\n<b>2. What happens</b>\nAfter you push code, GitHub routes your page loads to the primary DB briefly (read-your-writes window) so you see your own push immediately. After a few seconds, your requests shift to replicas.\n\n<b>3. The result</b>\nAWS RDS supports up to 15 read replicas for MySQL and PostgreSQL. Aurora Global Database supports cross-region replicas with under 1-second lag for disaster recovery.",
    interviewTip:
      "\"Replicas scale reads; sharding scales writes — know the difference.\"\n• <b>1. Replication lag</b> — always mention it; describe read-your-writes as the mitigation\n• <b>2. Synchronous vs async</b> — async replication = fast writes, possible staleness; synchronous = zero lag, slower writes\n• <b>3. Scale order</b> — add replicas before you shard; sharding is much more complex\n• <b>4. Reporting queries</b> — always route long-running analytics to a replica to protect the primary\nFor write scaling beyond one machine, the answer is sharding — not more replicas.",
    tags: ["Read Replicas", "Replication Lag", "Primary/Replica", "WAL", "Read Scaling"],
  },
  {
    id: 19,
    category: "Databases & Data Handling",
    title: "Handling Duplicate Records",
    tagline: "How duplicates happen and how to prevent or deduplicate them",
    description:
      "Duplicate records appear when the same logical operation is executed more than once — usually from retries, race conditions, or bugs.\n\n<b>How duplicates happen</b>\n• Network timeout → client retries a `POST /orders` → two identical orders created\n• Race condition → two workers both read \"item not found\" and both insert it\n• Bug → import script runs twice without deduplication\n\n<b>Prevention strategies</b>\n• <b>Unique constraints</b> — `UNIQUE INDEX ON orders(idempotency_key)` — the DB rejects the second insert\n• <b>UPSERT</b> — `INSERT ... ON CONFLICT DO NOTHING` — silently ignores duplicate inserts\n• <b>Idempotency keys</b> — client sends a UUID per intent; server stores and deduplicates by key\n• <b>Optimistic locking</b> — `UPDATE ... WHERE version = :v` — fails if another write happened first\n\n<b>Soft deletes and partial indexes</b>\n• `UNIQUE INDEX ON users(email) WHERE deleted_at IS NULL` — allows re-registering a previously deleted email\n\n<b>Deduplication after the fact</b>\n• Window function: `ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at)` — keep the first, delete the rest",
    whyItMatters:
      "Duplicates in production cause real harm:\n• Duplicate payments double-charge customers\n• Duplicate orders ship the same item twice\n• Duplicate user accounts split their history and cause support nightmares\n\nApplication-level checks race — two requests check \"does this exist?\" simultaneously, both see \"no\", both insert. Only a database-level unique constraint is guaranteed to catch the duplicate.",
    example:
      "<b>1. Setup</b>\nStripe creates a charge via `POST /v1/charges` with an `Idempotency-Key` header. The client's network drops after sending — it doesn't know if the charge was created.\n\n<b>2. What happens</b>\nClient retries with the same `Idempotency-Key`. Stripe's DB has a `UNIQUE INDEX ON charges(idempotency_key)`. The second insert hits the constraint.\n\n<b>3. The result</b>\nStripe returns the original charge result instead of creating a new one. Without the constraint, retrying would create a duplicate charge — customer billed twice.",
    interviewTip:
      "\"Enforce uniqueness at the DB layer — never rely on application-level checks alone.\"\n• <b>1. Unique constraint</b> — single source of truth for uniqueness; catches races that app code misses\n• <b>2. UPSERT</b> — `INSERT ... ON CONFLICT DO NOTHING` for idempotent inserts\n• <b>3. Idempotency key</b> — client-generated UUID stored with a unique constraint; safe to retry forever\n• <b>4. Idempotent consumers</b> — for message queues, store `processed_event_ids` and skip if already seen\nAlways ask: what happens if this operation runs twice? That question surfaces all the places you need deduplication.",
    tags: ["Unique Constraint", "Upsert", "Idempotency", "Deduplication", "Race Condition"],
  },
  {
    id: 20,
    category: "Databases & Data Handling",
    title: "Optimistic vs Pessimistic Locking",
    tagline: "Assume no conflict vs lock to prevent conflict",
    description:
      "Both strategies prevent two concurrent transactions from corrupting shared state — they differ in when and how they prevent conflicts.\n\n<b>Pessimistic locking — lock before reading</b>\n• Acquire a DB-level lock on the row before doing any work: `SELECT ... FOR UPDATE`\n• No other transaction can modify the row until you release the lock (commit or rollback)\n• Safe under high contention, but reduces concurrency — other writers queue behind you\n  ↳ Risk: deadlock — two transactions each wait for the other's lock\n\n<b>Optimistic locking — detect conflict on write</b>\n• Read the row plus a version number (or `updated_at` timestamp)\n• Do your work in the application\n• On write: `UPDATE orders SET status='shipped', version=version+1 WHERE id=:id AND version=:expected_version`\n• If the version changed (another write happened), the UPDATE affects 0 rows → retry\n• No lock held during processing — high concurrency, but requires retry logic in the application",
    whyItMatters:
      "Choosing wrong causes either data corruption or throughput collapse:\n• No locking → lost updates (two transactions both read `stock=5`, both decrement, both write `4` — one decrement is lost)\n• Too much pessimistic locking → deadlocks and long queue times under scale\n• Optimistic locking fails noisily under high contention — every retry is an additional DB round trip\n\nMatch the strategy to the contention level of the resource.",
    example:
      "<b>1. Setup</b>\nA flash sale: 10,000 users try to buy the last item simultaneously. `stock` starts at 1.\n\n<b>2. What happens</b>\nPessimistic: `SELECT stock FROM products WHERE id=1 FOR UPDATE` — only one transaction proceeds at a time; the rest queue. The first decrements to 0 and commits. All subsequent transactions see stock=0 and fail gracefully.\n\nOptimistic: all 10,000 read stock=1, all try `UPDATE ... WHERE version=42`. Only one succeeds (DB applies it first); 9,999 get 0 rows affected and must retry — but by then stock=0, so they all fail.\n\n<b>3. The result</b>\nBoth prevent overselling. Pessimistic is simpler; optimistic scales better when contention is actually low (most updates won't conflict).",
    interviewTip:
      "\"State the contention level first, then pick the strategy.\"\n• <b>1. High contention</b> — payments, inventory, bank transfers → pessimistic (`SELECT FOR UPDATE`)\n• <b>2. Low contention</b> — profile edits, settings, most CRUD → optimistic (version column)\n• <b>3. Deadlock prevention</b> — always acquire locks in the same order across transactions\n• <b>4. Optimistic retry</b> — must have a bounded retry limit with backoff, not an infinite loop\nFor inventory systems, `SELECT FOR UPDATE` preventing overselling is the classic answer.",
    tags: ["Optimistic Locking", "Pessimistic Locking", "SELECT FOR UPDATE", "Version Column", "Deadlock"],
  },

  // ─── Caching & Performance ───────────────────────────────────────────────────
  {
    id: 21,
    category: "Caching & Performance",
    title: "What is Caching & Where to Cache",
    tagline: "Store computed results close to where they're needed",
    description:
      "Caching stores the result of an expensive operation in fast memory so the next request gets it instantly — without repeating the work.\n\n<b>Where to cache (closest to user → furthest)</b>\n• <b>Browser cache</b> — static assets cached locally; controlled by `Cache-Control` headers\n• <b>CDN / edge cache</b> — edge servers near users serve assets without hitting your origin\n• <b>Application cache</b> — in-process memory (a Map or LRU cache) for frequently read, rarely changing data\n• <b>Distributed cache</b> — Redis or Memcached shared across all server instances; survives deploys\n\n<b>Caching strategies</b>\n• <b>Cache-aside (lazy)</b> — on cache miss, fetch from DB, populate cache, return result\n  ↳ Most common; app controls all cache interactions\n• <b>Write-through</b> — write to cache and DB together on every write; always consistent but adds write latency\n• <b>Write-behind (write-back)</b> — write to cache, flush to DB asynchronously; fastest writes, but data can be lost on cache crash\n• <b>Read-through</b> — cache fetches from DB on miss automatically; app only talks to the cache",
    whyItMatters:
      "Caching is usually the highest-leverage performance optimisation available:\n• A DB query taking 50 ms served from Redis takes under 1 ms — 50× faster\n• Redis can serve 100,000+ reads/sec per instance; most databases max out at a fraction of that\n• Caching can reduce DB load by 90–95%, delaying the need to scale the DB\n\nBut stale data, cache misses, and stampedes must be managed — caching adds correctness complexity alongside speed.",
    example:
      "<b>1. Setup</b>\nTwitter's viral tweet problem: a single tweet from a celebrity gets 10 million requests in minutes.\n\n<b>2. What happens</b>\nTweet objects are cached in Memcached. When @BarackObama tweets, the tweet is read from the cache — 10 million reads hit Memcached, not the database.\n\n<b>3. The result</b>\nAmazon caches product pages in CloudFront (CDN). Redis caches user sessions, rate limit counters, and leaderboard scores. Each cache layer handles what it's best at.",
    interviewTip:
      "\"Name the cache location and strategy, then immediately discuss invalidation — that's the hard part.\"\n• <b>1. Location</b> — CDN for static assets, Redis for shared application data\n• <b>2. Strategy</b> — cache-aside for most cases; write-through when consistency is critical\n• <b>3. Invalidation</b> — TTL for acceptable staleness; event-driven for precision\n• <b>4. Stampede</b> — what happens when a popular key expires and 10,000 requests hit the DB simultaneously?\nAlways follow up \"add a cache\" with a concrete invalidation plan.",
    tags: ["Redis", "Memcached", "Cache-Aside", "Write-Through", "Cache Stampede"],
  },
  {
    id: 22,
    category: "Caching & Performance",
    title: "Cache Eviction Strategies",
    tagline: "LRU, LFU, TTL — how caches decide what to remove",
    description:
      "When a cache is full, it must remove existing entries to make room for new ones. The eviction policy determines which entries get removed.\n\n<b>Common eviction policies</b>\n• <b>LRU (Least Recently Used)</b> — evict the entry that hasn't been accessed for the longest time\n  ↳ Good for most web workloads — recently accessed items are likely to be accessed again\n• <b>LFU (Least Frequently Used)</b> — evict the entry accessed fewest times overall\n  ↳ Better for skewed access patterns where a few items are very popular; higher overhead to track frequency\n• <b>TTL (Time To Live)</b> — evict after a fixed duration regardless of access frequency\n  ↳ Essential when data must not be stale beyond a certain point (prices, permissions, session tokens)\n• <b>FIFO (First In, First Out)</b> — evict the oldest entry regardless of access; rarely optimal\n• <b>Random</b> — evict a random entry; simple but unpredictable\n\n<b>In practice</b>\nMost caches combine TTL with LRU — entries are evicted when they expire (TTL) or when capacity is needed (LRU). Redis lets you set a global `maxmemory-policy` and per-key TTL.",
    whyItMatters:
      "Wrong eviction policy causes cache churn:\n• LRU is thrashed if data access is uniformly random — every item is equally likely to be needed\n• Without TTL, stale permissions, prices, or auth tokens can be served for hours\n• Over-aggressive TTLs reduce staleness but increase DB load from cache misses\n\nPicking the wrong policy can make the cache worse than not having one.",
    example:
      "<b>1. Setup</b>\nRedis is configured with `maxmemory-policy allkeys-lru` — when full, it evicts the least recently used key.\n\n<b>2. What happens</b>\nDNS resolvers use TTL from the DNS record itself — a record with `TTL 300` is cached for 5 minutes, then re-fetched from the authoritative server.\nBrowser HTTP caches use `Cache-Control: max-age=31536000` for versioned JS bundles — cached for a year since the filename changes on every deploy.\n\n<b>3. The result</b>\nRedis's LRU policy keeps the hot dataset in memory — frequently accessed user sessions stay cached while old inactive sessions are evicted automatically.",
    interviewTip:
      "\"LRU is the safe default; mention TTL when freshness matters.\"\n• <b>1. LRU</b> — right for most web app data; recently accessed is likely to be accessed again\n• <b>2. LFU</b> — right when access is highly skewed (viral content, popular product pages)\n• <b>3. TTL</b> — required for time-sensitive data; set aggressively short for permissions and prices\n• <b>4. Combine them</b> — TTL per entry + LRU for eviction when full is the most common production setup\nMention `EXPIRE` in Redis for per-key TTL alongside a global eviction policy.",
    tags: ["LRU", "LFU", "TTL", "Eviction Policy", "Redis"],
  },
  {
    id: 23,
    category: "Caching & Performance",
    title: "Cache Consistency & Stale Data",
    tagline: "Keeping the cache in sync with the source of truth",
    description:
      "A cache becomes inconsistent when the database is updated but the cache still holds the old value. How long you tolerate staleness determines your invalidation strategy.\n\n<b>Invalidation strategies</b>\n• <b>TTL-based expiry</b> — cache entry expires automatically after N seconds\n  ↳ Simplest; data is stale for at most N seconds; no coordination needed\n• <b>Event-driven invalidation</b> — on every DB write, publish an event to invalidate the relevant cache key\n  ↳ Precise — cache is always current; complex to implement; requires a reliable event bus\n• <b>Write-through</b> — write to cache and DB together on every update\n  ↳ Cache is always consistent; every write pays extra latency\n• <b>Versioned cache keys</b> — embed a version in the key (e.g., `user:42:v7`); bump version on change\n  ↳ Old keys naturally expire; no explicit invalidation needed — but old keys accumulate\n\n<b>Write-behind risk</b>\nWrite-behind caching (write to cache, flush to DB async) introduces a window where the cache has data the DB doesn't — crash during that window = data loss.",
    whyItMatters:
      "Stale cache data causes real bugs:\n• Wrong price shown to users for minutes after an update\n• Stale permission cache lets a deactivated user keep accessing a resource\n• Stale inventory count shows \"in stock\" after the last item is sold\n\nThe rule of thumb: the more consequential the data, the shorter the TTL — or skip the cache entirely for critical checks (permissions, balances).",
    example:
      "<b>1. Setup</b>\nAirbnb updates a listing's nightly price. The cache holds the old price.\n\n<b>2. What happens</b>\nAirbnb's system publishes a `listing_price_updated` event. A cache invalidation subscriber receives the event and deletes `cache:listing:price:{id}`. The next read misses the cache, fetches the new price from the DB, and repopulates it.\n\n<b>3. The result</b>\nFacebook's Memcache layer uses lease tokens to prevent thundering herd during invalidation — only one request rebuilds the cache entry while others wait. This makes event-driven invalidation safe even under high load.",
    interviewTip:
      "\"Cache invalidation is the hardest part of caching — always address it explicitly.\"\n• <b>1. Define staleness SLA</b> — \"prices can be 1 minute stale\" → TTL=60; \"permissions must be instant\" → bypass cache\n• <b>2. TTL for most data</b> — simplest, no coordination needed; acceptable for most product data\n• <b>3. Event-driven for critical data</b> — publish invalidation events on every write; precise but complex\n• <b>4. Skip the cache</b> — for permissions, balances, and any data where staleness causes security or financial harm\nA cache with no invalidation strategy is a bug waiting to happen.",
    tags: ["Cache Invalidation", "Stale Data", "TTL", "Write-Through", "Event-Driven"],
  },
  {
    id: 24,
    category: "Caching & Performance",
    title: "CDN & Edge Caching",
    tagline: "Serve static and dynamic content from servers near the user",
    description:
      "A CDN (Content Delivery Network) is a globally distributed network of edge servers that cache content close to users — reducing latency and offloading your origin server.\n\n<b>How a CDN works</b>\n1. User in Tokyo requests `app.com/logo.png`\n2. Request hits the nearest CDN edge server (Tokyo PoP — Point of Presence)\n3. Cache miss: edge fetches from origin (e.g., your S3 bucket in us-east-1), caches the response\n4. Cache hit (all subsequent requests): edge serves from local cache — ~5 ms instead of 200 ms round-trip\n\n<b>Cache control headers</b>\n• `Cache-Control: max-age=31536000, immutable` — for content-hashed assets (`main.abc123.js`); cache for 1 year\n• `Cache-Control: no-cache` — for HTML pages; always revalidate (ensures users get fresh markup)\n• `Cache-Control: s-maxage=3600` — CDN-specific TTL; overrides `max-age` for shared caches\n\n<b>Edge compute</b>\nModern CDNs (Cloudflare Workers, Fastly Compute) run serverless code at the edge — auth checks, A/B testing, and personalisation without hitting the origin",
    whyItMatters:
      "Without a CDN:\n• Every user worldwide round-trips to your single origin server — latency scales with physical distance\n• Your origin servers handle every image, JS file, and font download — high load for content that never changes\n• A CDN offloads 80–95% of static traffic from origin servers and cuts global latency to single-digit milliseconds\n\nFor any app with global users, a CDN is the cheapest performance win available.",
    example:
      "<b>1. Setup</b>\nNetflix needs to serve 4K video to 300 million users globally with minimal buffering.\n\n<b>2. What happens</b>\nNetflix's Open Connect CDN places dedicated servers inside ISP networks. Video bytes travel the \"last mile\" from the ISP's local server — never crossing the public internet.\n\n<b>3. The result</b>\nGitHub uses Fastly for repository assets. AWS CloudFront serves S3-hosted static sites with 400+ edge locations. Cloudflare Pages deploys static sites to 300+ PoPs — users everywhere get sub-10ms asset delivery.",
    interviewTip:
      "\"Add a CDN for static assets in every large system design — it's a free performance win.\"\n• <b>1. Cache-bust on deploy</b> — use content-hashed filenames (`main.abc123.js`) for immutable caching; HTML gets short TTL or no-cache\n• <b>2. Static vs dynamic</b> — CDNs excel at static; for dynamic content, consider edge caching with short TTLs or edge compute\n• <b>3. Origin shield</b> — add an origin shield (one CDN region that fetches from origin) to reduce origin load on cache misses\n• <b>4. Edge compute</b> — Cloudflare Workers can do auth, redirects, and A/B testing at the edge without hitting origin\nA CDN should appear in any system that serves assets to users across geographies.",
    tags: ["CDN", "Edge Caching", "Cache-Control", "Cloudflare", "CloudFront"],
  },
  {
    id: 25,
    category: "Caching & Performance",
    title: "Why Cache Can Make Systems Wrong",
    tagline: "The dark side: stale data, stampedes, and poisoned caches",
    description:
      "Caching adds performance but introduces three distinct failure modes that can make your system serve wrong data or collapse under load.\n\n<b>Failure mode 1: Cache stampede (thundering herd)</b>\n• A popular cache key expires → thousands of requests simultaneously find a cache miss → all hit the DB at once → DB collapses\n• Fix:\n  ↳ <b>Mutex lock on rebuild</b> — first thread acquires a lock, rebuilds the cache, releases it; others wait then read from cache\n  ↳ <b>Probabilistic early expiration</b> — start rebuilding slightly before TTL expires, preventing the hard expiry cliff\n  ↳ <b>Background refresh</b> — a separate job refreshes the cache before it expires; users never see a miss\n\n<b>Failure mode 2: Stale data serving</b>\n• A permission is revoked, but the cache still grants access for 10 more minutes\n• Fix: short TTL or event-driven invalidation; bypass cache entirely for security-sensitive checks\n\n<b>Failure mode 3: Cache poisoning</b>\n• Incorrect data gets cached (bug, injection, or a malformed response) and is served to thousands of users\n• Fix: validate data before caching; canary deploys; monitor cache hit rates for anomalies; maintain ability to flush specific keys",
    whyItMatters:
      "Teams add caches to fix speed problems and inadvertently introduce correctness bugs:\n• A stale permission cache is a security vulnerability\n• A stampede caused by one key expiring can take down an entire database\n• A poisoned cache can serve wrong prices, wrong content, or wrong access decisions to millions of users before anyone notices\n\nEvery cache is a correctness trade-off — design it with the failure modes in mind from the start.",
    example:
      "<b>1. Setup</b>\nA gaming leaderboard is cached with a 60-second TTL. The game goes viral — traffic spikes 100×.\n\n<b>2. What happens</b>\nAt second 60, the cache key expires. 50,000 concurrent users all get a cache miss at the same moment. All 50,000 requests query the DB to rebuild the leaderboard. The DB is overloaded and crashes.\n\n<b>3. The result</b>\nFix: the background refresh job recomputes the leaderboard every 55 seconds and writes to cache — users always find a warm cache entry. Facebook uses lease tokens: only one process rebuilds a cache entry on expiry; others wait and read the rebuilt value.",
    interviewTip:
      "\"Name all three failure modes and their mitigations — it shows you understand caching deeply.\"\n• <b>1. Stampede</b> — mutex lock or background refresh; never let a popular key expire cold under high traffic\n• <b>2. Stale data</b> — define your staleness SLA; use event-driven invalidation for anything security-critical\n• <b>3. Poisoned cache</b> — validate before caching; have a cache flush mechanism; monitor hit rates\nCache stampede is the most common interview follow-up — describe the mutex approach in detail.",
    tags: ["Cache Stampede", "Thundering Herd", "Cache Poisoning", "Stale Data", "Cache Invalidation"],
  },

  // ─── Distributed Systems & Scaling ──────────────────────────────────────────
  {
    id: 26,
    category: "Distributed Systems & Scaling",
    title: "Load Balancing",
    tagline: "Distribute traffic evenly across multiple servers",
    description:
      "A load balancer sits in front of a pool of backend servers and routes each incoming request to one of them — enabling horizontal scaling and redundancy.\n\n<b>Routing algorithms</b>\n• <b>Round Robin</b> — sequential rotation; simple, ignores server load\n• <b>Least Connections</b> — routes to the server with fewest active connections; better for long-lived requests (WebSockets, file uploads)\n• <b>IP Hash</b> — same client IP always hits same server; useful for sticky sessions when you can't externalise state\n• <b>Weighted Round Robin</b> — more powerful servers get more traffic proportionally\n\n<b>Layer 4 vs Layer 7</b>\n• <b>L4 (transport layer)</b> — routes based on IP + port; fast, no HTTP parsing; can't inspect content\n• <b>L7 (application layer)</b> — reads HTTP headers, paths, and cookies; can route `/api/*` to one cluster and `/auth/*` to another; can terminate TLS\n\n<b>Health checks</b>\nLoad balancers poll each server (e.g., `GET /health`) and automatically remove unhealthy instances from the rotation — enabling zero-downtime deploys",
    whyItMatters:
      "Without a load balancer:\n• All traffic hits one server; adding more servers does nothing\n• One server crash takes down the whole system\n• Rolling deploys require downtime\n\nA load balancer is the entry point that turns multiple servers into a single scalable, redundant unit. It's also itself a potential single point of failure — use pairs with DNS failover or anycast IP.",
    example:
      "<b>1. Setup</b>\nA startup's API runs on 3 EC2 instances. Traffic is 10,000 requests/minute — too much for one server.\n\n<b>2. What happens</b>\nAWS Application Load Balancer (L7) routes `POST /api/*` to the app cluster and `GET /static/*` to an S3/CloudFront origin. Health checks poll `/health` every 30 seconds — unhealthy instances are removed within 60 seconds.\n\n<b>3. The result</b>\nDuring a rolling deploy, the LB drains connections from each instance before it restarts. NGINX handles L7 load balancing for self-hosted setups. Cloudflare's anycast network acts as a global load balancer routing users to the nearest region.",
    interviewTip:
      "\"Describe L4 vs L7 — it shows you understand the trade-offs.\"\n• <b>1. L4</b> — faster (no HTTP parsing); use for TCP/UDP protocols or extreme throughput\n• <b>2. L7</b> — content-aware routing, TLS termination, header manipulation; use for HTTP APIs\n• <b>3. SPOF risk</b> — the load balancer itself must be redundant; describe active-passive pair or anycast\n• <b>4. Sticky sessions</b> — avoid by externalising session state to Redis; IP Hash as fallback only\nAlways mention that load balancers need health checks to enable zero-downtime deploys.",
    tags: ["Load Balancer", "Round Robin", "Least Connections", "L4", "L7"],
  },
  {
    id: 27,
    category: "Distributed Systems & Scaling",
    title: "Horizontal vs Vertical Scaling",
    tagline: "More machines vs a bigger machine",
    description:
      "When your system can't handle more load, you have two fundamental options: make the existing machine bigger (vertical) or add more machines (horizontal).\n\n<b>Vertical scaling (scale up)</b>\n• Upgrade the server: more CPU cores, more RAM, faster SSD\n• No code changes needed — the bigger machine just runs faster\n• Hard ceiling: the largest available instance type\n• Single point of failure: one machine, if it crashes, everything is down\n  ↳ Good first step — buy time before redesigning for horizontal scale\n\n<b>Horizontal scaling (scale out)</b>\n• Add more servers and distribute load across them via a load balancer\n• Scales to virtually unlimited capacity — add 100 more servers if needed\n• Enables redundancy — one server failing doesn't take down the system\n• Requirement: the app must be stateless — sessions and state must live in a shared store (Redis), not server memory\n  ↳ Any server must be able to handle any request\n\n<b>Auto-scaling</b>\nCloud platforms (AWS Auto Scaling, GCP) add/remove instances based on CPU, memory, or request rate — handles traffic spikes automatically",
    whyItMatters:
      "Vertical scaling is simpler but hits a ceiling and creates a SPOF:\n• The biggest EC2 instance has ~400 vCPUs and 12 TB RAM — and costs thousands per hour\n• A crash on a vertically-scaled server takes down everything\n\nHorizontal scaling is the foundation of cloud-native architecture — it's why stateless services are the default. Stateful services (DBs) require specialised solutions (read replicas, sharding) to scale horizontally.",
    example:
      "<b>1. Setup</b>\nEarly Twitter ran on a handful of large Ruby on Rails servers. As user growth accelerated, they kept upgrading server sizes (vertical).\n\n<b>2. What happens</b>\nThe \"Fail Whale\" appeared regularly under load. Vertical scaling hit diminishing returns. Twitter redesigned around stateless services behind load balancers.\n\n<b>3. The result</b>\nHorizontal scaling: Twitter added stateless API servers freely. AWS EC2 Auto Scaling adds instances when CPU > 70% and removes them when < 30% — the cluster size adapts to traffic automatically.",
    interviewTip:
      "\"Default to horizontal scaling in system design interviews — it's what interviewers expect.\"\n• <b>1. Stateless first</b> — make the service stateless; push sessions and state to Redis\n• <b>2. Load balancer in front</b> — required for any horizontally scaled service\n• <b>3. Auto-scaling</b> — mention it for handling traffic spikes; 1–3 minute ramp-up time\n• <b>4. DB is different</b> — app servers scale horizontally easily; databases need read replicas (reads) or sharding (writes)\nVertical scaling is a valid short-term answer — mention both options and explain when you'd switch.",
    tags: ["Horizontal Scaling", "Vertical Scaling", "Stateless", "Auto Scaling", "SPOF"],
  },
  {
    id: 28,
    category: "Distributed Systems & Scaling",
    title: "Microservices vs Monoliths",
    tagline: "One big app vs many small, independent services",
    description:
      "The architecture decision that shapes team structure, deployment speed, and operational complexity.\n\n<b>Monolith</b>\n• One codebase, one deployable unit, usually one database\n• Simple to develop, easy to debug (all code in one place), no network overhead between features\n• Deploy everything together — one bug requires redeploying the whole app\n  ↳ Modular monolith: one codebase with strict internal module boundaries — gets you 80% of microservices benefits with 10% of the complexity\n\n<b>Microservices</b>\n• System split into small, independently deployable services, each owning its own data\n• Benefits: independent scaling, independent deploys, technology flexibility, separate team ownership\n• Costs: network latency between services, distributed transactions (no shared DB), complex observability, service discovery, and significant operational overhead\n  ↳ Rule of thumb: you need microservices when you have more services than engineers can fit in their heads",
    whyItMatters:
      "Premature microservices adoption is a common trap:\n• A 3-engineer startup spending half their time on Kubernetes and service mesh is not building features\n• Every service-to-service call that was an in-process function call now adds network latency and a new failure mode\n• But a 500-person org shipping one monolith deploys risk every change, teams block each other, and one bad service crashes everything\n\nThe right architecture matches team size and deployment frequency — not a technical ideal.",
    example:
      "<b>1. Setup</b>\nAmazon's original website was a monolith. As it scaled to hundreds of teams, teams constantly broke each other's code on deployment.\n\n<b>2. What happens</b>\nAmazon extracted services with strict API contracts. Netflix moved to microservices to enable hundreds of independent team deployments per day — no coordination needed between teams.\n\n<b>3. The result</b>\nShopify runs a modular monolith — one codebase, strict module boundaries, separate deployment pipelines per module. Gets the team autonomy of microservices without the distributed systems complexity.",
    interviewTip:
      "\"Don't default to microservices — justify the choice based on team and scale.\"\n• <b>1. Start monolith</b> — faster to build, easier to refactor, correct for small teams\n• <b>2. Extract when justified</b> — a domain needs independent scaling, a separate team, or a different tech stack\n• <b>3. If microservices</b> — immediately address: how do services communicate (REST/gRPC/events), how do you handle distributed transactions (saga), how do you debug across services (distributed tracing)\n• <b>4. Modular monolith</b> — mention it as a pragmatic middle ground\nIf the interview design has 3–4 services, that's fine. If you list 20 services for a simple app, it raises a red flag.",
    tags: ["Microservices", "Monolith", "Service Mesh", "Distributed Systems", "Modular Monolith"],
  },
  {
    id: 29,
    category: "Distributed Systems & Scaling",
    title: "Service-to-Service Communication",
    tagline: "Sync REST/gRPC vs async messaging — trade-offs",
    description:
      "When microservices need to talk to each other, you choose between waiting for a response (synchronous) or firing and forgetting (asynchronous).\n\n<b>Synchronous communication</b>\n• Service A calls Service B and blocks until it gets a response\n• Protocols: HTTP/REST or gRPC (faster, binary)\n• Simple and immediate — caller knows the result right away\n• Problem: if B is slow or down, A is also slow or down\n  ↳ In a chain A→B→C, total latency = sum of all latencies; any failure in the chain fails the whole request\n\n<b>Asynchronous communication</b>\n• A publishes a message to a broker (Kafka, RabbitMQ, SQS); B consumes it when ready\n• A doesn't wait — it fires and returns immediately\n• Higher throughput, better fault isolation, natural buffering for traffic spikes\n• Problem: eventual consistency — B hasn't processed the message yet when A returns\n  ↳ Can't return the result of B's processing to the caller synchronously\n\n<b>Availability math</b>\nIf B has 99.9% uptime and C has 99.9%, then A→B→C has ~99.7% uptime — synchronous chains multiply failure probability",
    whyItMatters:
      "Synchronous chains of microservices are fragile — one slow service degrades all callers:\n• A 500 ms delay in the recommendations service slows down every page load\n• A 1-minute outage in the email service shouldn't fail the checkout flow\n\nAsync decoupling is the right answer for everything that doesn't need an immediate result — but it makes debugging and tracing much harder.",
    example:
      "<b>1. Setup</b>\nUber processes a ride request: the user needs an immediate confirmation, but the receipt email can arrive later.\n\n<b>2. What happens</b>\nRide request → synchronous gRPC call to matching service → immediate response: \"Driver found.\"\nPost-trip receipt → Kafka event `trip_completed` → email service consumes it asynchronously; sends email within seconds without blocking the trip flow.\n\n<b>3. The result</b>\nAmazon: payment processing is synchronous (need to know if it worked). Warehouse fulfillment is async (SQS) — the warehouse processes orders at its own rate. Stripe webhooks are async outbound events to your server.",
    interviewTip:
      "\"Match the pattern to whether the caller needs an immediate result.\"\n• <b>1. Sync</b> — user-facing, latency-sensitive, caller needs the response to continue (payment, auth, search)\n• <b>2. Async</b> — background work, fan-out notifications, workflows where the caller can return immediately\n• <b>3. Fan-out</b> — one event → multiple consumers (pub/sub); use async; consumers are fully decoupled\n• <b>4. Queue down?</b> — always discuss: if the queue is unavailable, can the system degrade gracefully or does it fail?\nFor every async flow, address eventual consistency — what does the user see while the async work is in progress?",
    tags: ["Synchronous", "Asynchronous", "gRPC", "Kafka", "Event-Driven"],
  },
  {
    id: 30,
    category: "Distributed Systems & Scaling",
    title: "Message Queues",
    tagline: "Kafka, RabbitMQ, SQS — durable async communication",
    description:
      "A message queue (or broker) accepts messages from producers and delivers them to consumers, buffering the two sides so they can operate independently.\n\n<b>RabbitMQ</b>\n• Traditional message broker, AMQP protocol\n• Supports routing, fan-out, topic exchanges, and request-reply patterns\n• Messages are deleted once consumed — not a log\n  ↳ Best for task queues, job scheduling, and RPC patterns\n\n<b>AWS SQS</b>\n• Fully managed, at-least-once delivery, unlimited scale\n• Simple API — no routing logic; just a queue with visibility timeouts\n  ↳ Best for simple AWS-native job queues where you don't need ordering or replay\n\n<b>Apache Kafka</b>\n• Distributed commit log — messages are retained for a configurable period (days, weeks)\n• Consumers read at their own pace by tracking their offset — no message is lost\n• Enables replay (reprocess past events), event sourcing, and stream processing\n• Key concepts: `topic` (category), `partition` (ordered sub-stream), `consumer group` (load-balanced consumers), `offset` (position in partition)\n  ↳ Best for high-throughput event streams, audit logs, and event-driven architectures",
    whyItMatters:
      "Message queues solve three problems at once:\n• <b>Spike absorption</b> — producers keep publishing at any rate; consumers process at a steady rate\n• <b>Decoupling</b> — producer doesn't know or care about consumers; adding a new consumer requires zero producer changes\n• <b>Durability</b> — messages survive crashes; no data loss if a consumer goes down temporarily\n\nWithout a queue, a traffic spike that overwhelms the fulfilment service results in failed orders instead of a temporary backlog.",
    example:
      "<b>1. Setup</b>\nLinkedIn needs to update the activity feed, search index, recommendations, and analytics whenever a user updates their profile.\n\n<b>2. What happens</b>\nLinkedIn publishes a `profile_updated` event to Kafka. Five independent consumer services (feed, search, recommendations, ads, analytics) each read from the topic at their own pace — no producer change needed to add a new consumer.\n\n<b>3. The result</b>\nAirbnb uses Kafka for booking events that trigger search updates, notifications, and fraud detection. Celery + Redis/RabbitMQ is the most common Python async task queue. LinkedIn processes billions of Kafka events per day.",
    interviewTip:
      "\"Know when to use each broker — the choice matters.\"\n• <b>1. Kafka</b> — high throughput, ordered, replayable event streams; audit logs; event sourcing\n• <b>2. RabbitMQ</b> — traditional task queues with routing; flexible exchange patterns; lower throughput\n• <b>3. SQS</b> — AWS-native, simple job queues, fully managed, no replay\n• <b>4. Delivery guarantees</b> — all three are at-least-once by default; idempotent consumers handle duplicates\nMention consumer groups in Kafka — multiple instances of the same service share a group and each partition is consumed by one member, giving you automatic load balancing.",
    tags: ["Kafka", "RabbitMQ", "SQS", "Message Queue", "At-Least-Once"],
  },

  // ─── Reliability & Real-World Problems ──────────────────────────────────────
  {
    id: 31,
    category: "Reliability & Real-World Problems",
    title: "Exactly-Once vs At-Least-Once Processing",
    tagline: "Delivery guarantees — and why exactly-once is hard",
    description:
      "Message queues offer different guarantees about how many times a message is delivered — each has consequences for your consumers.\n\n<b>The three delivery guarantees</b>\n• <b>At-most-once</b> — deliver once, never retry; some messages are lost if the consumer crashes\n  ↳ Fine for metrics or log aggregation where occasional loss is acceptable\n• <b>At-least-once</b> — retry until the consumer acknowledges; no message loss, but duplicates are possible\n  ↳ Default for Kafka, RabbitMQ, SQS; most common in practice\n• <b>Exactly-once</b> — process each message exactly once; no loss, no duplicates\n  ↳ True exactly-once requires atomic coordination between the broker and consumer state (Kafka transactions)\n  ↳ Complex, expensive, not always necessary\n\n<b>The practical solution: at-least-once + idempotent consumers</b>\n1. Consumer receives message and extracts the unique `message_id`\n2. Check if `message_id` has been processed (stored in a `processed_events` DB table)\n3. If yes: skip. If no: process and store the `message_id` in the same transaction\n  ↳ This achieves effectively-exactly-once without broker-level coordination",
    whyItMatters:
      "The delivery guarantee determines the correctness of your system under failures:\n• At-least-once + non-idempotent handler = double-charges, duplicate emails, duplicate orders\n• At-most-once for payments = lost transactions\n• At-least-once + idempotent handler = safe, practical, what most production systems use\n\nUnderstanding this is critical for any system that moves money or sends communications.",
    example:
      "<b>1. Setup</b>\nStripe sends webhook events to your server: `POST /webhooks/stripe` with an `event_id` in the body. Network issues can cause Stripe to retry the same event.\n\n<b>2. What happens</b>\nYour handler: check if `event_id` exists in `processed_events` table → if yes, return 200 immediately. If no: process the payment update → insert `event_id` into `processed_events` in the same DB transaction.\n\n<b>3. The result</b>\nSame event delivered 3 times → processed exactly once. Kafka Streams with exactly-once semantics atomically commits the consumer offset and state store update in one transaction — no broker-level coordination needed.",
    interviewTip:
      "\"Say at-least-once delivery with idempotent consumers — it's the practical production answer.\"\n• <b>1. Message ID</b> — every message has a unique ID; consumers track processed IDs in a DB\n• <b>2. UPSERT pattern</b> — `INSERT INTO processed_events ... ON CONFLICT DO NOTHING`\n• <b>3. Kafka exactly-once</b> — use Kafka transactions if you need strict guarantee; higher latency and complexity\n• <b>4. Scope the idempotency</b> — the check-and-process must be atomic (one DB transaction)\nAlways ask: what happens if this message is processed twice? That surfaces where you need idempotency.",
    tags: ["Exactly-Once", "At-Least-Once", "Idempotent Consumer", "Kafka", "Message ID"],
  },
  {
    id: 32,
    category: "Reliability & Real-World Problems",
    title: "Retries, Timeouts & Circuit Breakers",
    tagline: "Handling failures gracefully in distributed systems",
    description:
      "Three patterns that together make a service resilient to the failures that are inevitable in distributed systems.\n\n<b>Timeouts — always set them</b>\n• Every outbound call (DB, HTTP, cache) must have a maximum wait time\n• Without a timeout: one slow downstream causes threads to pile up until the server runs out of memory and crashes\n  ↳ Set timeouts at every layer: connection timeout, read timeout, total request timeout\n\n<b>Retries — only for idempotent operations</b>\n• Retry failed requests, but only if the operation is safe to repeat (GET, PUT, DELETE; never raw POST)\n• Exponential backoff: retry after 1s, then 2s, 4s, 8s — prevents thundering herd\n• Jitter: add random noise (±20%) to prevent all clients retrying at the same moment\n• Dead-letter queue (DLQ): after N retries, move the message to a DLQ for investigation — don't discard silently\n\n<b>Circuit Breaker — stop calling a dead service</b>\n• After N consecutive failures, the circuit opens — all requests immediately return an error (fail fast)\n• After a cooldown period, the circuit half-opens — one test request goes through\n• If it succeeds, the circuit closes. If it fails, cooldown resets.\n  ↳ Prevents cascading failures: a slow DB shouldn't bring down every service that depends on it",
    whyItMatters:
      "Without these patterns, distributed systems fail in catastrophic ways:\n• No timeout → one slow service exhausts all threads → entire server crashes\n• No circuit breaker → slow downstream → all requests queue → server out of memory → cascading failure\n• No retry → transient network blip → permanent failure\n\nThese three patterns are the minimum required for a production-grade service.",
    example:
      "<b>1. Setup</b>\nAn e-commerce API calls a recommendations service. The recommendations service becomes slow (DB query degraded).\n\n<b>2. What happens</b>\nWithout a timeout: every product page request holds a thread for 30 seconds waiting for recommendations. 1,000 concurrent users = 1,000 stuck threads = server crashes.\n\nWith circuit breaker (resilience4j): after 10 consecutive timeouts, the circuit opens. Product page returns immediately with empty recommendations. Recommendations service gets a chance to recover. After 30 seconds, one test request is allowed through.\n\n<b>3. The result</b>\nNetflix Hystrix (now resilience4j) pioneered circuit breakers for Java. AWS SDK includes exponential backoff with jitter by default. Envoy proxy implements circuit breaking at the network layer for all services in a mesh.",
    interviewTip:
      "\"Set timeouts on every outbound call — it's the most important reliability pattern.\"\n• <b>1. Timeout first</b> — always set; prevents thread exhaustion from slow downstreams\n• <b>2. Retry with backoff</b> — exponential backoff + jitter; only retry idempotent operations\n• <b>3. Circuit breaker</b> — open after N failures; fail fast during outage; half-open to probe recovery\n• <b>4. DLQ</b> — failed queue messages after N retries go to dead-letter queue for investigation\nDescribe the circuit states: closed → open (failure threshold hit) → half-open (test request) → closed (recovery).",
    tags: ["Retry", "Exponential Backoff", "Circuit Breaker", "Timeout", "Resilience"],
  },
  {
    id: 33,
    category: "Reliability & Real-World Problems",
    title: "Handling Race Conditions",
    tagline: "When two operations collide and corrupt shared state",
    description:
      "A race condition happens when two concurrent operations both read shared state, both decide to act on it, and both write — one write overwrites the other.\n\n<b>Classic example: inventory decrement</b>\n1. Thread A reads `stock = 5`\n2. Thread B reads `stock = 5` (before A writes)\n3. Thread A writes `stock = 4`\n4. Thread B writes `stock = 4` — one decrement is lost\n\n<b>Solutions at the data layer</b>\n• <b>Atomic UPDATE</b> — `UPDATE products SET stock = stock - 1 WHERE id = :id AND stock > 0`\n  ↳ The DB executes read-modify-write as a single atomic operation; 0 rows affected means stock is gone\n• <b>SELECT FOR UPDATE</b> — lock the row before reading; no other transaction can touch it until you commit\n• <b>Redis atomic operations</b> — `DECR` and Lua scripts are atomic by design\n• <b>Optimistic locking</b> — version column; `UPDATE ... WHERE version = :v`; retry on version mismatch\n• <b>Serialised queue</b> — route all inventory updates for one product through a single-consumer queue\n\n<b>What NOT to do</b>\nApplication-level checks: `if (stock > 0) { stock-- }` — the check and write are two separate DB operations; another request can slip in between them",
    whyItMatters:
      "Race conditions cause overselling, double bookings, duplicate purchases, and corrupted counters — all real-world production disasters:\n• Flash sale overselling: 10,000 customers charged for an item with stock = 1\n• Double account creation: two requests both see \"email not found\" and both insert\n\nThey're timing-dependent and almost impossible to reproduce in testing. The fix must be at the data layer.",
    example:
      "<b>1. Setup</b>\nFlash sale: stock = 1. 10,000 requests arrive simultaneously for `POST /buy`.\n\n<b>2. What happens</b>\nNaive: all 10,000 read `stock = 1`, all decrement, all write `stock = 0` — but 10,000 orders were created.\nAtomic: `UPDATE products SET stock = stock - 1 WHERE id = :id AND stock > 0` — DB executes each atomically. First request returns 1 row affected (success). All 9,999 subsequent requests return 0 rows affected (out of stock).\n\n<b>3. The result</b>\nOnly one item sold. The fix is a single SQL statement — no locks, no application coordination required.",
    interviewTip:
      "\"State the race condition explicitly, then give the data-layer fix — not an application fix.\"\n• <b>1. Atomic UPDATE</b> — `UPDATE ... SET count = count - 1 WHERE count > 0` for counters; best default\n• <b>2. SELECT FOR UPDATE</b> — for complex operations requiring multiple reads before writing\n• <b>3. Redis DECR</b> — atomic counter decrement; use for high-throughput counters (rate limiting, seats)\n• <b>4. Never application-level</b> — `if x > 0 then x--` is not thread-safe across DB operations\nThe interviewer wants to hear \"atomic operation at the DB level\" — not mutex in application code.",
    tags: ["Race Condition", "Atomic Operations", "SELECT FOR UPDATE", "Optimistic Locking", "Redis DECR"],
  },
  {
    id: 34,
    category: "Reliability & Real-World Problems",
    title: "Distributed Locking",
    tagline: "Coordinating exclusive access across multiple servers",
    description:
      "In a distributed system, each server instance has its own memory — in-process mutexes don't work across processes. A distributed lock ensures only one instance performs a critical section at a time.\n\n<b>Redis distributed lock (simplest approach)</b>\n1. Attempt to acquire: `SET lock_key :uuid NX PX 5000`\n  ↳ `NX` = set only if not exists; `PX 5000` = expire after 5 seconds\n2. If the SET succeeds, you hold the lock\n3. Do the critical work\n4. Release: `DEL lock_key` — but only if the value still matches your UUID\n  ↳ UUID check prevents releasing another process's lock (acquired after your TTL expired)\n\n<b>Why TTL is critical</b>\nIf the lock holder crashes, the TTL ensures the lock is automatically released — no deadlock forever\n\n<b>Alternatives</b>\n• Zookeeper ephemeral nodes — node disappears automatically when the session ends\n• etcd leases — similar; used in Kubernetes\n• PostgreSQL advisory locks — `pg_advisory_lock(key)` — works within one DB cluster\n\n<b>Prefer simpler alternatives first</b>\nDB-level atomics (`SELECT FOR UPDATE`) and queue-based serialisation (one consumer per resource) are simpler and often sufficient",
    whyItMatters:
      "Without distributed locking, multiple service replicas can:\n• Both process the same cron job — email sent twice, payment processed twice\n• Both attempt the same DB migration simultaneously — data corruption\n• Both reserve the same resource — double booking\n\nApplication-level mutexes (`synchronized`, `Lock`) only work within one process — useless across a fleet of servers.",
    example:
      "<b>1. Setup</b>\nA scheduled job sends monthly invoices. 3 service instances all wake up at 00:00 on the 1st.\n\n<b>2. What happens</b>\nAll 3 attempt `SET invoice_job :uuid NX PX 300000` (5-minute TTL).\nOnly one succeeds — it runs the job. The other two find the key exists and skip.\n\n<b>3. The result</b>\nIf the winner crashes mid-job, the lock expires after 5 minutes and another instance can take over. Airflow uses distributed locks for DAG scheduling across workers. Kubernetes leader election uses etcd leases for the same pattern.",
    interviewTip:
      "\"Describe Redis SET NX PX — it's the practical interview answer for distributed locking.\"\n• <b>1. SET NX PX</b> — atomic acquire with automatic TTL expiry; avoids deadlocks\n• <b>2. UUID value</b> — store a unique ID; only release the lock if you own it\n• <b>3. TTL = job timeout</b> — set TTL to the maximum expected job duration\n• <b>4. Redlock controversy</b> — Martin Kleppmann showed Redlock (multi-node) has edge cases; for most use cases, a single Redis instance lock is sufficient\nAlways prefer DB atomics or queue serialisation over distributed locks when they solve the same problem — locks add complexity.",
    tags: ["Distributed Lock", "Redis", "Redlock", "Mutex", "Zookeeper"],
  },
  {
    id: 35,
    category: "Reliability & Real-World Problems",
    title: "Event-Driven Architecture",
    tagline: "Services communicate by publishing and reacting to events",
    description:
      "In event-driven architecture (EDA), services publish events when something significant happens — other services subscribe and react independently, without the publisher knowing who they are.\n\n<b>Three event patterns</b>\n• <b>Event Notification</b> — lightweight signal; just says \"this happened\"; consumer fetches details if needed\n  ↳ `{type: \"OrderPlaced\", orderId: \"123\"}` — minimal payload\n• <b>Event-Carried State Transfer</b> — event contains the full new state; consumers don't need to call back\n  ↳ `{type: \"ProfileUpdated\", userId: \"42\", name: \"Alice\", email: \"...\"}`\n• <b>Event Sourcing</b> — the event log is the source of truth; current state is derived by replaying all events\n  ↳ Bank account balance = sum of all `Deposited` and `Withdrawn` events\n\n<b>Benefits</b>\n• Loose coupling: publisher doesn't know about consumers; add new consumers with zero publisher change\n• Natural audit log: every event is a historical record\n• Independent scaling: each consumer scales based on its own workload\n\n<b>Challenges</b>\n• Eventual consistency: consumers lag; reading immediately after a write may return stale state\n• Harder to debug: distributed traces needed to follow one event across multiple services\n• Schema evolution: changing event shape can break consumers",
    whyItMatters:
      "EDA enables teams to move independently:\n• Adding \"send welcome email on signup\" = add a new consumer; zero changes to the auth service\n• Each consumer can be scaled, deployed, and maintained by a separate team\n\nBut eventual consistency requires careful UX design — a user who just placed an order may see it as \"pending\" for a moment while downstream consumers catch up.",
    example:
      "<b>1. Setup</b>\nShopify processes millions of orders per day. Each order must trigger fulfilment, inventory update, email notification, and analytics update.\n\n<b>2. What happens</b>\n`OrderPlaced` event is published to Kafka. Four independent consumer services each subscribe: fulfilment, inventory, email, and analytics. They process in parallel, independently.\n\n<b>3. The result</b>\nNo synchronous chain. No single point of failure. Adding a new integration (fraud detection) = add a new consumer, no Shopify order code changes needed. LinkedIn uses EDA to propagate profile updates to search, recommendations, and ads simultaneously.",
    interviewTip:
      "\"EDA is an architectural style, not just async queues — events are the primary integration mechanism.\"\n• <b>1. Loose coupling</b> — producers publish; consumers decide what to do with it\n• <b>2. Schema registry</b> — use Confluent Schema Registry with Avro to enforce event schemas and prevent breaking consumers\n• <b>3. Idempotent consumers</b> — always; at-least-once delivery means duplicate events will arrive\n• <b>4. Eventual consistency</b> — address this explicitly; describe how the UI handles the lag (optimistic updates, loading states)\nEvent sourcing is a specific advanced pattern — don't conflate it with EDA in general.",
    tags: ["Event-Driven", "Event Sourcing", "Pub/Sub", "Kafka", "Loose Coupling"],
  },
  {
    id: 36,
    category: "Reliability & Real-World Problems",
    title: "Saga Pattern",
    tagline: "Distributed transactions without a global lock",
    description:
      "A saga is a sequence of local transactions across multiple services, with compensating transactions to undo previous steps if something fails.\n\n<b>Why sagas exist</b>\nIn microservices, each service has its own database. A traditional ACID transaction can't span multiple databases. Two-phase commit (2PC) can — but it locks resources across all participants, is slow, and fails badly if one participant goes down.\n\n<b>Saga: Choreography (event-driven)</b>\n• Each service listens for events and publishes the next event when done\n• Simple to start; no central coordinator\n• Problem: the flow is implicit — hard to see or debug the whole sequence\n  ↳ `OrderPlaced` → InventoryService reserves stock → `StockReserved` → PaymentService charges → `PaymentCharged` → etc.\n\n<b>Saga: Orchestration (command-driven)</b>\n• A central orchestrator sends commands to each service and tracks the saga's state\n• Explicit flow — easy to see the full sequence, retry steps, and handle failures\n• Problem: the orchestrator is a centralisation point\n  ↳ AWS Step Functions, Temporal.io implement orchestration sagas\n\n<b>Compensating transactions</b>\nEach step has a \"undo\" transaction: reserve stock → compensation is release stock; charge payment → compensation is refund",
    whyItMatters:
      "Multi-service business transactions (book flight + hotel + car) can't use a single DB transaction:\n• Sagas provide eventual consistency with explicit rollback via compensating transactions\n• They avoid the complexity and failure modes of 2PC at scale\n\nBut sagas guarantee eventual consistency, not atomicity — there's a window where the system is partially committed.",
    example:
      "<b>1. Setup</b>\nE-commerce order: reserve inventory → charge payment → create shipment.\n\n<b>2. What happens</b>\nInventory reserved ✓ → Payment charged ✓ → Shipment creation fails ✗\nCompensations run in reverse: refund payment → release inventory. Order ends up cleanly cancelled.\n\n<b>3. The result</b>\nAWS Step Functions implements orchestration sagas — each state machine step is a service call; retries and compensations are defined in the state machine. Temporal.io gives you saga workflows as code with built-in retry and compensation logic.",
    interviewTip:
      "\"Sagas = eventual consistency + compensating transactions — not atomicity.\"\n• <b>1. Choreography vs orchestration</b> — choreography for simple flows; orchestration for anything non-trivial\n• <b>2. Compensating transactions</b> — every step must have a reversible undo action; design this upfront\n• <b>3. Idempotent steps</b> — saga steps may be retried; each step must be idempotent\n• <b>4. Not 2PC</b> — explain why you're not using 2PC: it locks resources across services and degrades badly under failure\nMention that the payment refund compensation is not a rollback — it's a new transaction that happens to undo the effect.",
    tags: ["Saga", "Distributed Transactions", "Choreography", "Orchestration", "Compensating Transactions"],
  },
  {
    id: 37,
    category: "Reliability & Real-World Problems",
    title: "Graceful Degradation",
    tagline: "Keep serving users when parts of the system fail",
    description:
      "Graceful degradation means the system continues serving users — possibly with reduced functionality — when a dependency fails, instead of failing completely.\n\n<b>Techniques</b>\n• <b>Fallback responses</b> — return cached data or defaults when a service is down\n  ↳ Recommendations service down → show editorial picks instead of personalised rows\n• <b>Feature flags</b> — disable non-critical features under load or during incidents without a deploy\n  ↳ Turn off AI-generated summaries if the LLM API is slow; core browsing still works\n• <b>Circuit breaker</b> — stop calling a failing service; return the fallback immediately\n  ↳ Prevents cascading failures from one slow dependency spreading to all callers\n• <b>Bulkhead pattern</b> — separate thread pools (or connection pools) per downstream service\n  ↳ A slow recommendations service consuming all threads doesn't block the checkout service\n• <b>Stale cache serving</b> — serve slightly stale data from cache rather than returning an error\n\n<b>Fail-fast vs graceful degradation</b>\nFail-fast: return an error immediately when a dependency fails — better for detecting bugs early, but worse for user experience\nGraceful degradation: serve a reduced experience — better for availability, but may hide real failures",
    whyItMatters:
      "In a microservices system, some service is always degraded:\n• Netflix runs hundreds of services — statistically, at least one is degraded at any time\n• Graceful degradation ensures a recommendation engine outage doesn't prevent browsing\n• Amazon: product reviews load separately — a review service outage never blocks a purchase\n\nFor every dependency in your design, ask: what happens to the user if this goes down?",
    example:
      "<b>1. Setup</b>\nNetflix's homepage requires data from 20+ services: user profile, watch history, recommendations, trending, originals, etc.\n\n<b>2. What happens</b>\nThe personalisation service is degraded. Without graceful degradation: the homepage returns 503.\nWith graceful degradation: circuit breaker opens for personalisation, fallback shows editorial picks. The user sees a slightly generic homepage — not a blank screen.\n\n<b>3. The result</b>\nNetflix users almost never see a complete outage — they see a less-personalised experience. Amazon's checkout flow degrades gracefully: reviews and upsell widgets fail silently; the \"Add to Cart\" button always works.",
    interviewTip:
      "\"For every external dependency in your design, explicitly state the degraded behaviour if it fails.\"\n• <b>1. Identify critical vs non-critical</b> — checkout = critical; recommendations = non-critical\n• <b>2. Fallback data</b> — cache the last known good value; serve it on failure\n• <b>3. Circuit breaker</b> — open it after N failures; return fallback instantly instead of waiting for timeout\n• <b>4. Bulkhead</b> — separate resource pools per downstream; one slow dependency can't starve others\nInterviewers love when you proactively ask \"what happens if this service is down?\" — it shows production thinking.",
    tags: ["Graceful Degradation", "Fallback", "Feature Flags", "Bulkhead", "Circuit Breaker"],
  },
  {
    id: 38,
    category: "Reliability & Real-World Problems",
    title: "Observability",
    tagline: "Logs, metrics, and traces — understanding your system in production",
    description:
      "Observability is the ability to understand what a system is doing internally by looking at its external outputs. It rests on three pillars.\n\n<b>Pillar 1: Logs</b>\n• Timestamped records of events — what happened and when\n• Use structured JSON logs (easier to query in Datadog, ELK, CloudWatch)\n• Always include a `trace_id` so all log lines for one request are linkable\n  ↳ `{timestamp, level, trace_id, user_id, action, duration_ms}`\n\n<b>Pillar 2: Metrics</b>\n• Numeric measurements over time — request rate, error rate, latency percentiles, CPU, memory\n• Use p50/p95/p99 latency — averages hide tail latency problems\n• Tools: Prometheus + Grafana (self-hosted), Datadog, CloudWatch\n• The four golden signals (Google SRE): latency, traffic, errors, saturation\n\n<b>Pillar 3: Distributed Traces</b>\n• A trace follows one request across every service it touches — each service adds a span\n• Spans record: service name, operation, start time, duration, parent span\n• OpenTelemetry is the standard instrumentation library (works with any backend)\n• Tools: Jaeger, Zipkin, Datadog APM",
    whyItMatters:
      "Without observability, production incidents are guesswork:\n• \"Something is slow\" → without traces, you don't know which service or which query\n• \"Users are getting errors\" → without structured logs, you can't filter by user ID or trace ID\n• Structured logs + distributed tracing cuts debugging time from hours to minutes\n• Metrics + SLOs let you detect problems before users report them",
    example:
      "<b>1. Setup</b>\nUber's payment latency suddenly spikes. An alert fires: `p99 latency > 500ms`.\n\n<b>2. What happens</b>\nOn-call engineer opens Jaeger (distributed tracing). Finds the trace for a slow request. The trace shows: API gateway (5ms) → payment service (480ms) → DB query (460ms). Zooms into the DB span — a missing index on a recently added column.\n\n<b>3. The result</b>\nWithout distributed tracing, the engineer would have guessed for hours. The trace pointed directly to the slow DB query. Uber's stack: Jaeger (tracing), M3 (metrics), ELK (logs). Every service emits a `trace_id` in all log lines.",
    interviewTip:
      "\"Cover all three pillars — it shows you understand production operations.\"\n• <b>1. Logs</b> — structured JSON; always include `trace_id` for correlation\n• <b>2. Metrics</b> — four golden signals: latency (p99), traffic (RPS), errors (error rate), saturation (CPU/queue depth)\n• <b>3. Traces</b> — distributed tracing with OpenTelemetry; visualise with Jaeger or Datadog APM\n• <b>4. SLOs</b> — define \"99.9% of requests < 200ms\"; alert when the budget is burning\nIn a system design, add an observability section at the end — it demonstrates production maturity and separates strong candidates.",
    tags: ["Observability", "Logs", "Metrics", "Distributed Tracing", "OpenTelemetry"],
  },
  {
    id: 39,
    category: "Reliability & Real-World Problems",
    title: "Deployments",
    tagline: "Blue-green, rolling, canary — releasing without downtime",
    description:
      "Zero-downtime deployments require a strategy for transitioning from the old version to the new one without users noticing.\n\n<b>Blue-Green deployment</b>\n• Run two identical environments: blue (live) and green (new version)\n• Switch the load balancer from blue → green atomically\n• Rollback: switch back to blue in seconds\n• Cost: 2× infrastructure at all times\n  ↳ Best for: critical systems where instant rollback is required\n\n<b>Rolling deployment</b>\n• Gradually replace old instances with new ones, a few at a time\n• Old and new versions serve traffic simultaneously — must be backward compatible\n• Lower cost; Kubernetes supports it natively\n  ↳ Best for: most applications; cheaper than blue-green\n\n<b>Canary deployment</b>\n• Route 1–5% of traffic to the new version; monitor metrics\n• Gradually increase if error rate and latency are stable\n• Catch regressions in production before they hit all users\n  ↳ Best for: user-facing features where you want real-user validation\n\n<b>Feature flags</b>\n• Deploy code dark (in production, off for users) and enable per-user, per-cohort, or per-percentage\n• Decouple deploy from release — code ships weeks before the feature is turned on",
    whyItMatters:
      "Deploy to 100% of users at once and a bug hits everyone at once:\n• Canary contains blast radius to 1–5% of users\n• Blue-green gives instant rollback without redeployment\n• Feature flags decouple deployment from user exposure\n\nDB migrations are the hardest part — the schema change must be backward compatible with both old and new code for the duration of the rollout.",
    example:
      "<b>1. Setup</b>\nFacebook ships hundreds of code changes per day to 3 billion users.\n\n<b>2. What happens</b>\nFeature flags: most changes deploy dark (code is live, feature is off). New features are enabled to 0.1% of users first, then 1%, then 10%, then 100% — each step monitored for error rate regressions.\n\n<b>3. The result</b>\nAWS CodeDeploy supports all three strategies. Kubernetes rolling deployments are built-in. DB migration best practice: add the new column, deploy new code that reads both old and new columns, backfill data, then remove the old column in a later deploy — never in one step.",
    interviewTip:
      "\"State the strategy and immediately mention the DB migration challenge.\"\n• <b>1. Canary</b> — default for user-facing features; monitor error rate + latency at each increment\n• <b>2. Blue-green</b> — when you need instant rollback and can afford 2× infra\n• <b>3. Feature flags</b> — decouple deploy from release; enables dark launches and A/B testing\n• <b>4. DB migrations</b> — most interview candidates miss this: schema changes must be backward compatible during the rollout window\nDB migration sequence: expand (add new column) → deploy new code → migrate data → contract (drop old column).",
    tags: ["Blue-Green", "Canary", "Rolling Deployment", "Feature Flags", "Zero Downtime"],
  },
  {
    id: 40,
    category: "Reliability & Real-World Problems",
    title: "Handling Traffic Spikes & Viral Load",
    tagline: "Designing for 100x normal traffic that you can't predict",
    description:
      "A viral moment can bring 100× normal traffic in seconds — auto-scaling can't react fast enough. The system must be designed to shed load gracefully.\n\n<b>Defence layers (outermost → innermost)</b>\n• <b>CDN</b> — absorbs static asset requests before they hit your servers; handle 90%+ of traffic for media-heavy apps\n• <b>Rate limiting</b> — cap per-user or per-IP requests at the gateway; prevents one user from flooding the system\n• <b>Load shedding</b> — when the system is overloaded, return `503 Service Unavailable` for low-priority requests rather than crashing\n  ↳ `503 + Retry-After` is better than a crash — clients can retry intelligently\n• <b>Queue-based load levelling</b> — write requests to a queue; process at a steady rate; users wait rather than failing\n  ↳ Virtual waiting room: Ticketmaster queues users and admits them gradually\n• <b>Auto-scaling</b> — adds instances when CPU/RPS crosses threshold; takes 1–3 minutes to spin up\n• <b>Pre-warming</b> — for predictable events (product launch, sports final), scale up before the event starts\n• <b>Read replicas + caching</b> — pre-compute and cache expensive aggregations; DB read replicas absorb read spikes",
    whyItMatters:
      "Viral load is a different problem than sustained high traffic:\n• Auto-scaling takes 1–3 minutes — a viral moment is over before new instances are ready\n• CDN and pre-caching must absorb the spike; dynamic requests must be shed or queued\n• Systems that handle average load but crash on 10× average are a business liability — viral moments should be revenue events, not outage events",
    example:
      "<b>1. Setup</b>\nTicketmaster tries to sell Taylor Swift concert tickets. 14 million users arrive simultaneously for 2.4 million available seats.\n\n<b>2. What happens</b>\nWithout preparation: DB is overwhelmed → site crashes → nobody gets tickets.\nWith preparation: virtual waiting room queues users → admits them at a rate the backend can handle → pre-scaled infrastructure → seat availability cached aggressively → only the final reservation hits the DB.\n\n<b>3. The result</b>\nTwitter's Super Bowl strategy: pre-scale 2× before kickoff, warm Memcached with likely-to-trend tweet objects, reduce expensive query paths. The spike absorbs into warm caches instead of hitting the DB cold.",
    interviewTip:
      "\"Layer your defences — no single mechanism handles viral load alone.\"\n• <b>1. CDN first</b> — static assets should never hit origin during a spike\n• <b>2. Rate limit at gateway</b> — protect backend from individual abusers\n• <b>3. Load shed non-critical</b> — 503 + Retry-After for background or low-priority endpoints\n• <b>4. Queue at the boundary</b> — virtual waiting rooms, job queues; users wait rather than fail\n• <b>5. Pre-warm for known events</b> — scale ahead of product launches, not after the spike hits\nMention that the goal is graceful degradation under extreme load — no system handles infinite traffic.",
    tags: ["Traffic Spike", "Auto Scaling", "Load Shedding", "Queue", "Pre-warming"],
  },
];

export const BACKEND_CONCEPT_COUNT = BACKEND_CONCEPTS.length;
