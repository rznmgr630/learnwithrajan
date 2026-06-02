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
      "An API (Application Programming Interface) defines how two pieces of software communicate. The client sends a request (usually HTTP); the server processes it and returns a response (usually JSON). REST is the most common style — each URL represents a resource and HTTP verbs (GET, POST, PUT, DELETE) express what to do with it. GraphQL lets the client specify exactly which fields it needs. gRPC uses binary Protobuf for high-throughput internal calls.",
    whyItMatters:
      "Every system you build will expose or consume APIs. Good API design — versioning, clear error codes, consistent naming, pagination — determines how easy your service is to use and extend.",
    example:
      "GitHub's REST API exposes /repos, /users, and /pull-requests. Stripe uses REST for payments. Internally, Google routes billions of RPCs per second over gRPC between its microservices.",
    interviewTip:
      "When asked to design a system, define the API first: what endpoints exist, what do request/response bodies look like, and how will clients handle pagination and errors.",
    tags: ["REST", "GraphQL", "gRPC", "HTTP", "JSON"],
  },
  {
    id: 2,
    category: "Core Concepts",
    title: "REST vs GraphQL",
    tagline: "Fixed endpoints vs flexible queries",
    description:
      "REST uses fixed URLs for resources; clients get what the server returns. GraphQL exposes a single endpoint where clients send a query describing exactly the fields they need — no over-fetching or under-fetching. REST is simpler to cache (URLs are cache keys). GraphQL is powerful for data-heavy UIs that combine data from multiple resources in one round trip. gRPC is a third option — binary protocol, schema-first (Protobuf), great for internal service-to-service calls.",
    whyItMatters:
      "Picking the wrong API style creates N+1 query problems (REST without care) or complex resolvers that are hard to cache (GraphQL). Knowing trade-offs lets you choose the right tool.",
    example:
      "GitHub switched their public API from REST to GraphQL for v4 — one query can fetch a repo, its issues, and their labels. Facebook invented GraphQL because their mobile apps needed to minimise data over slow connections.",
    interviewTip:
      "When a system has diverse client needs (web vs mobile vs partner APIs), consider GraphQL. For simple CRUD services or public APIs, REST is easier to document and cache.",
    tags: ["REST", "GraphQL", "gRPC", "Protobuf", "Over-fetching"],
  },
  {
    id: 3,
    category: "Core Concepts",
    title: "HTTP Methods",
    tagline: "GET, POST, PUT, PATCH, DELETE — what each one means",
    description:
      "HTTP methods express intent. GET retrieves data and must be safe (no side effects) and idempotent (same result every time). POST creates a new resource and is neither safe nor idempotent. PUT replaces a resource entirely; PATCH updates it partially — both are idempotent. DELETE removes a resource. HEAD fetches headers only. OPTIONS describes what methods the server allows (used in CORS preflight). Using the right verb enables caching, retry logic, and API clarity.",
    whyItMatters:
      "Using POST for everything is a common mistake. Browsers and CDNs only cache GET. Idempotent methods (GET, PUT, DELETE) are safe to retry on network failure — POST is not.",
    example:
      "Stripe uses POST /payment_intents to create a charge, GET /payment_intents/:id to check status, and DELETE /payment_intents/:id to cancel. PATCH /customers/:id updates only the fields you send.",
    interviewTip:
      "If an interviewer asks about retry safety, mention that POST is not idempotent — retrying a failed POST may create duplicate records. That's why idempotency keys exist.",
    tags: ["GET", "POST", "PUT", "PATCH", "DELETE", "Idempotency"],
  },
  {
    id: 4,
    category: "Core Concepts",
    title: "HTTP Status Codes",
    tagline: "2xx success · 4xx client error · 5xx server error",
    description:
      "Status codes tell clients what happened. 2xx: success — 200 OK, 201 Created, 204 No Content. 3xx: redirects — 301 Moved Permanently, 302 Found. 4xx: client errors — 400 Bad Request (malformed input), 401 Unauthorized (not logged in), 403 Forbidden (logged in but no permission), 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests. 5xx: server errors — 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout.",
    whyItMatters:
      "Correct status codes let clients react appropriately — retry on 5xx, show login prompt on 401, stop retrying on 400. Returning 200 with an error body in JSON is an anti-pattern that breaks tooling.",
    example:
      "GitHub returns 404 for private repos (not just missing ones) to avoid leaking information. Stripe returns 402 Payment Required when a charge fails. Twitter returns 429 with a Retry-After header on rate limit hit.",
    interviewTip:
      "Distinguish 401 (not authenticated) from 403 (authenticated but not authorised). Use 422 for validation errors (not 400). Never return 200 with an error payload — it breaks monitoring and client logic.",
    tags: ["2xx", "4xx", "5xx", "401", "403", "429"],
  },
  {
    id: 5,
    category: "Core Concepts",
    title: "Stateless vs Stateful APIs",
    tagline: "Does the server remember who you are between requests?",
    description:
      "A stateless API treats each request independently — the server stores no session data between calls. All information the server needs must arrive in the request (auth token, params). This makes horizontal scaling trivial: any server can handle any request. Stateful APIs keep server-side session data, which means a client must go to the same server (sticky sessions) or share state via a database/cache. REST is stateless by design. WebSocket connections are stateful (persistent, bidirectional).",
    whyItMatters:
      "Stateful servers are hard to scale — adding machines doesn't help if clients are pinned to one. Stateless design enables load balancing and zero-downtime deploys. It also simplifies reasoning about behaviour.",
    example:
      "A JWT-based API is stateless: the token carries the user's identity. An old PHP session is stateful: the session ID cookie maps to server memory. Moving from sessions to JWTs was a key step for Twitter's API scalability.",
    interviewTip:
      "When designing a scalable system, prefer stateless APIs. If you need state (shopping cart, real-time presence), push it to a shared store (Redis) rather than server memory.",
    tags: ["Stateless", "Stateful", "JWT", "Sessions", "Horizontal Scaling"],
  },
  {
    id: 6,
    category: "Core Concepts",
    title: "Authentication vs Authorization",
    tagline: "Who are you? vs What can you do?",
    description:
      "Authentication (AuthN) verifies identity: is this user who they claim to be? It's answered by passwords, tokens, biometrics, or certificates. Authorization (AuthZ) determines what an authenticated user can do: does this user have permission to read this resource? Common AuthZ models: RBAC (role-based — admin, editor, viewer), ABAC (attribute-based — rules on user/resource attributes), and ACL (per-resource access lists). Both concerns are separate and both must be enforced on every request.",
    whyItMatters:
      "Confusing the two is a security mistake. You can be authenticated (logged in) but not authorised (no permission). Skipping AuthZ checks — even for authenticated users — is one of the most common API vulnerabilities (OWASP #1 broken access control).",
    example:
      "GitHub: AuthN = your login + 2FA. AuthZ = organisation membership determines which repos you can read/write. A fine-grained token may restrict you to specific repos even if you're an org admin.",
    interviewTip:
      "Always mention that AuthZ must be checked on every request server-side — never trust the client. Mention RBAC for simple systems and ABAC or policy engines (Open Policy Agent) for complex ones.",
    tags: ["Authentication", "Authorization", "RBAC", "ABAC", "JWT"],
  },
  {
    id: 7,
    category: "Core Concepts",
    title: "Session-based Auth vs JWT",
    tagline: "Server stores state vs client carries a signed token",
    description:
      "Session-based auth: on login the server creates a session record in a DB or cache, returns a session ID in a cookie. Every request looks up the session. Secure, easy to revoke, but requires shared state across servers. JWT (JSON Web Token): on login the server signs a payload (user ID, roles, expiry) with a secret key, returns the token. Every request verifies the signature — no DB lookup needed. Stateless and fast, but hard to revoke before expiry (workaround: short expiry + refresh tokens or a token blocklist).",
    whyItMatters:
      "JWTs enable stateless horizontal scaling but introduce the revocation problem. A stolen JWT is valid until it expires. Sessions are easy to invalidate but require shared storage. Choose based on your revocation and scaling needs.",
    example:
      "Auth0 and Firebase Auth issue JWTs with 1-hour expiry + long-lived refresh tokens. Next-Auth can use either. Banking apps often use server sessions with strict expiry for easy logout and revocation.",
    interviewTip:
      "If asked how to log out users with JWTs, discuss short access token TTL (15 min), long-lived refresh tokens stored in HttpOnly cookies, and a blocklist for explicit revocation on logout.",
    tags: ["JWT", "Sessions", "Refresh Tokens", "HttpOnly Cookie", "Revocation"],
  },
  {
    id: 8,
    category: "Core Concepts",
    title: "OAuth 2.0",
    tagline: "Delegated access — login with Google, GitHub, etc.",
    description:
      "OAuth 2.0 is an authorisation framework that lets a user grant a third-party app limited access to their account on another service — without sharing their password. Four roles: Resource Owner (user), Client (your app), Authorization Server (Google/GitHub), Resource Server (the API). The most common flow: Authorization Code — user is redirected to the provider, logs in, approves scopes, provider sends a code back to your server, your server exchanges it for an access token. PKCE extends this for public clients (mobile, SPA).",
    whyItMatters:
      "OAuth solves the password anti-pattern: users don't give your app their credentials for a third-party service. You get a scoped token (e.g., read email only). OpenID Connect (OIDC) builds on OAuth to add identity — the ID token tells you who the user is.",
    example:
      "\"Login with Google\" uses OAuth 2.0 + OIDC. Google sends your server an ID token (JWT) with the user's email and profile. Spotify uses OAuth for third-party apps to control playback without sharing account passwords.",
    interviewTip:
      "Know the Authorization Code + PKCE flow for interviews. Mention that the implicit flow is deprecated. Distinguish OAuth (authorisation) from OIDC (authentication on top of OAuth).",
    tags: ["OAuth 2.0", "OIDC", "Authorization Code", "PKCE", "Scopes"],
  },
  {
    id: 9,
    category: "Core Concepts",
    title: "Rate Limiting vs Throttling",
    tagline: "Protecting your API from overload and abuse",
    description:
      "Rate limiting caps how many requests a client can make in a time window (e.g., 100 requests/minute). Throttling slows down excess requests rather than blocking them — it queues or delays responses. Common algorithms: Fixed Window (count resets at window boundary — vulnerable to burst at boundaries), Sliding Window (counts over a rolling period), Token Bucket (tokens replenish at a rate; burst allowed up to bucket size), Leaky Bucket (queue drains at a fixed rate). Response headers: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After.",
    whyItMatters:
      "Without rate limiting, one client can starve all others, cause cascading failures, or rack up cloud bills. It also protects against brute-force attacks on login endpoints.",
    example:
      "GitHub API: 5,000 requests/hour for authenticated users, 60/hour unauthenticated. Twitter: per-endpoint limits (180 tweet lookups/15 min). Stripe returns 429 with a Retry-After header when rate limited.",
    interviewTip:
      "Token bucket is the most interview-friendly algorithm — explain the replenishment rate and burst allowance. Mention that rate limiting can be per-IP, per-user, or per-API-key, and that it should live at the gateway, not in each service.",
    tags: ["Rate Limiting", "Throttling", "Token Bucket", "429", "API Gateway"],
  },
  {
    id: 10,
    category: "Core Concepts",
    title: "Idempotency",
    tagline: "Safe to retry — same result no matter how many times you call it",
    description:
      "An operation is idempotent if calling it multiple times produces the same result as calling it once. GET, PUT, and DELETE are naturally idempotent. POST is not — retrying a POST /orders creates a duplicate order. To make POST idempotent, use an idempotency key: the client generates a unique ID for each intent, includes it as a header (Idempotency-Key), and the server stores the result. On retry with the same key, it returns the stored result without re-executing.",
    whyItMatters:
      "Networks fail. Clients retry. Without idempotency, retried payments double-charge users, retried order creates two orders. Idempotency keys are essential for any money-moving API.",
    example:
      "Stripe's API accepts an Idempotency-Key header. If a charge request times out, the client retries with the same key — Stripe returns the original charge result instead of charging again. Stripe stores results for 24 hours.",
    interviewTip:
      "When designing a payment or order API, always bring up idempotency keys. Describe how the server stores (key → result) in a database with a TTL, and what happens on a race condition (locking or UPSERT).",
    tags: ["Idempotency", "Retry", "Idempotency Key", "Payments", "POST"],
  },

  // ─── Databases & Data Handling ───────────────────────────────────────────────
  {
    id: 11,
    category: "Databases & Data Handling",
    title: "SQL vs NoSQL",
    tagline: "When to use relational tables vs flexible documents",
    description:
      "SQL databases (PostgreSQL, MySQL) store data in tables with a fixed schema. Relationships between tables are enforced with foreign keys and queried with JOINs. They provide strong ACID guarantees. NoSQL covers several models: document (MongoDB — JSON-like, flexible schema), key-value (Redis, DynamoDB), wide-column (Cassandra — rows with dynamic columns, great for time-series), and graph (Neo4j). NoSQL databases often sacrifice some consistency for availability and horizontal scale. Neither is universally better — choose based on data shape, consistency needs, and scale.",
    whyItMatters:
      "Using a relational DB for a write-heavy time-series workload will fall over. Using a document store for a system that needs complex multi-entity transactions will produce bugs. Mismatching tool to workload is a common system design mistake.",
    example:
      "Instagram uses PostgreSQL for user data (relationships, likes). Cassandra for the feed (append-heavy, time-ordered, massive scale). Redis for caching and rate limiting. Each database fits its specific access pattern.",
    interviewTip:
      "In interviews, say \"it depends\" and then explain: if the data is relational and transactions matter, use SQL. If you need flexible schema, massive write throughput, or global distribution, consider NoSQL. Often both coexist.",
    tags: ["SQL", "NoSQL", "PostgreSQL", "MongoDB", "Cassandra"],
  },
  {
    id: 12,
    category: "Databases & Data Handling",
    title: "Indexes",
    tagline: "Data structures that make queries fast — at a write cost",
    description:
      "An index is a data structure (usually a B-Tree or Hash) the database maintains alongside the table so it can find rows without a full scan. A B-Tree index on users.email makes WHERE email = 'x' O(log n) instead of O(n). A composite index (first_name, last_name) speeds up queries that filter by first_name alone, or first_name + last_name, but not last_name alone (leftmost prefix rule). Indexes cost write performance and storage — every INSERT/UPDATE/DELETE must update all indexes on the table.",
    whyItMatters:
      "The most common source of slow queries is a missing index — a full table scan on a million-row table is painfully slow. Over-indexing slows writes and wastes disk. EXPLAIN ANALYZE is your tool to check whether the query planner uses an index.",
    example:
      "A query on orders WHERE user_id = 123 ORDER BY created_at DESC is fast with an index on (user_id, created_at DESC). Without it, Postgres scans every row. Partial indexes (WHERE deleted_at IS NULL) can be even smaller and faster.",
    interviewTip:
      "Mention the trade-off: indexes speed reads, slow writes, and cost storage. Discuss composite index column ordering (most selective / most frequently filtered field first). Bring up covering indexes if the query can be served entirely from the index.",
    tags: ["B-Tree", "Index", "Composite Index", "EXPLAIN", "Query Optimization"],
  },
  {
    id: 13,
    category: "Databases & Data Handling",
    title: "ACID Properties",
    tagline: "The four guarantees that make relational databases trustworthy",
    description:
      "Atomicity: a transaction is all-or-nothing — if any step fails, the whole thing rolls back. Consistency: a transaction brings the database from one valid state to another — all constraints, foreign keys, and rules must hold. Isolation: concurrent transactions don't see each other's in-progress changes (at various levels: read uncommitted, read committed, repeatable read, serializable). Durability: once a transaction commits, it persists — even if the server crashes immediately after. These four properties are what make relational databases reliable for financial and business data.",
    whyItMatters:
      "Without ACID, partial writes corrupt data, concurrent transactions see inconsistent state, and crashes lose committed data. NoSQL databases often weaken these guarantees for scale — understanding the trade-off is critical.",
    example:
      "Bank transfer: debit account A, credit account B. Atomicity ensures both happen or neither does. If the server crashes after the debit, the transaction rolls back. Without it, money vanishes. PostgreSQL and MySQL (InnoDB) provide full ACID.",
    interviewTip:
      "Know all four properties and what breaks without each. Isolation levels are a common follow-up: serializable prevents all anomalies but is slowest; read committed (Postgres default) allows non-repeatable reads.",
    tags: ["Atomicity", "Consistency", "Isolation", "Durability", "Transactions"],
  },
  {
    id: 14,
    category: "Databases & Data Handling",
    title: "Transactions & Isolation Levels",
    tagline: "Controlling what concurrent transactions can see",
    description:
      "SQL supports four isolation levels. Read Uncommitted: can read dirty (uncommitted) data — almost never used. Read Committed (Postgres default): only sees committed data, but the same row may read differently within one transaction (non-repeatable read). Repeatable Read: same row returns same value within a transaction, but phantom rows can appear (new rows inserted by another transaction). Serializable: transactions execute as if serial — no anomalies, but highest locking overhead. Common anomalies: dirty read, non-repeatable read, phantom read, lost update, write skew.",
    whyItMatters:
      "Wrong isolation level causes subtle bugs: two concurrent discount applications both see $100 and both deduct $10, leaving $90 instead of $80 (lost update). Serializable is safe but slow. Knowing the trade-offs lets you pick the right level.",
    example:
      "Booking systems use SERIALIZABLE or SELECT FOR UPDATE to prevent double-booking. Reporting queries use READ COMMITTED to avoid blocking writes. Postgres's default READ COMMITTED is correct for most CRUD apps.",
    interviewTip:
      "Know the four isolation levels and one anomaly each prevents. For concurrency control, mention optimistic locking (version column) vs pessimistic locking (SELECT FOR UPDATE). Write skew (two transactions read the same data and each writes based on it) is a classic interview anomaly.",
    tags: ["Isolation Levels", "Serializable", "Dirty Read", "Phantom Read", "SELECT FOR UPDATE"],
  },
  {
    id: 15,
    category: "Databases & Data Handling",
    title: "Normalization vs Denormalization",
    tagline: "Remove redundancy vs duplicate data for speed",
    description:
      "Normalization organises data to reduce redundancy — split related data into separate tables and link them with foreign keys (1NF, 2NF, 3NF). Fewer anomalies on update, but queries need JOINs. Denormalization deliberately duplicates data — store the author name in every post row instead of JOINing to users. Faster reads, but writes must update multiple places and can drift out of sync. Most production systems are partially denormalized: normalize by default, denormalize specific hot-path queries.",
    whyItMatters:
      "Heavy normalization causes slow JOINs at scale. Over-denormalization causes inconsistency and complex update logic. The right balance is driven by your read/write ratio and query patterns.",
    example:
      "An e-commerce order stores the product name and price at the time of purchase (denormalized) — not a foreign key to the products table. This is intentional: product prices change, but the order receipt must reflect what the customer paid.",
    interviewTip:
      "When asked about database design, start normalized. Then identify hot-path queries that require many JOINs and discuss targeted denormalization or materialized views as a performance optimisation.",
    tags: ["Normalization", "Denormalization", "JOINs", "1NF", "Materialized Views"],
  },
  {
    id: 16,
    category: "Databases & Data Handling",
    title: "Pagination",
    tagline: "Offset vs cursor — how to fetch large lists efficiently",
    description:
      "Offset pagination: SELECT * FROM posts LIMIT 20 OFFSET 100. Simple but slow on large datasets — the DB scans and discards 100 rows. Page numbers can shift if rows are inserted/deleted between pages (items skip or repeat). Cursor-based pagination: the last item's unique, sortable value (ID or created_at) becomes the cursor. SELECT * FROM posts WHERE id > :cursor LIMIT 20. Stable, fast (uses the index), works with real-time data. Keyset pagination is another term for the same idea. Cursor pagination can't jump to arbitrary pages — it's for infinite scroll.",
    whyItMatters:
      "OFFSET 10000 on a table of millions is slow — the DB must fetch and throw away 10,000 rows. Cursor pagination is O(log n) using an index. Twitter's timeline API uses cursor pagination; it handles billions of rows.",
    example:
      "GitHub's API returns a Link: <next_url>; rel=\"next\" header with a cursor token for the next page. Stripe's list endpoints return has_more and a starting_after cursor (last object ID).",
    interviewTip:
      "Always prefer cursor-based pagination for large, real-time datasets. Offset is acceptable for admin UIs with small tables or when users need to jump to page N. Mention that cursors must be stable and opaque (base64-encoded).",
    tags: ["Pagination", "Cursor", "Offset", "Keyset Pagination", "Infinite Scroll"],
  },
  {
    id: 17,
    category: "Databases & Data Handling",
    title: "Sharding & Partitioning",
    tagline: "Split data across multiple machines or tables",
    description:
      "Vertical partitioning: split table columns into separate tables (rarely used). Horizontal partitioning (sharding): split rows across multiple databases by a shard key. Range sharding: rows with id 1–1M on shard 1, 1M–2M on shard 2 (risk of hot spots). Hash sharding: hash(user_id) % N determines the shard (even distribution, but hard to rebalance). Directory sharding: a lookup service maps each key to its shard. Cross-shard JOINs and distributed transactions become hard or impossible, so shard keys must be chosen so queries hit a single shard.",
    whyItMatters:
      "A single database server has CPU, RAM, and disk limits. Sharding is how you scale writes horizontally beyond what one machine can handle. The shard key decision is permanent and hard to change — wrong choice causes hot shards or uneven distribution.",
    example:
      "WhatsApp shards by phone number hash. Discord shards messages by guild_id so all messages in a server land on one shard (no cross-shard joins). Vitess (used by YouTube) provides transparent sharding for MySQL.",
    interviewTip:
      "Pick a shard key that distributes writes evenly and keeps related data together. Avoid keys like country code (hot shards). Note that sharding complicates backups, schema changes, and global aggregations.",
    tags: ["Sharding", "Partitioning", "Shard Key", "Hash Sharding", "Hot Spot"],
  },
  {
    id: 18,
    category: "Databases & Data Handling",
    title: "Read Replicas & Write Scaling",
    tagline: "Scale reads by adding copies; writes still go to one primary",
    description:
      "A primary (leader) database handles all writes. Read replicas receive a stream of changes (WAL/binlog replication) and serve read queries. Reads scale horizontally — add replicas. Writes are limited to the primary's capacity (vertical scaling or sharding). Replication lag: replicas are slightly behind the primary (milliseconds to seconds). Reading your own write after an update may return stale data from a replica. Strategies: read-your-writes (route reads after write to primary for a window), sticky sessions (pin user to primary temporarily).",
    whyItMatters:
      "Most web apps are read-heavy (10:1 or more). Read replicas let you scale read throughput cheaply without touching write performance. But replication lag must be accounted for — user sees old data after update if you immediately read from replica.",
    example:
      "GitHub uses dozens of MySQL read replicas to serve repository browsing. After pushing code, you're routed to the primary briefly to avoid reading stale data. AWS RDS supports up to 15 read replicas for MySQL/PostgreSQL.",
    interviewTip:
      "Mention replication lag and how to handle it: route reads to primary for N seconds after a write, or use synchronous replication (higher latency, zero lag). Distinguish from sharding: replicas scale reads, sharding scales writes.",
    tags: ["Read Replicas", "Replication Lag", "Primary/Replica", "WAL", "Read Scaling"],
  },
  {
    id: 19,
    category: "Databases & Data Handling",
    title: "Handling Duplicate Records",
    tagline: "How duplicates happen and how to prevent or deduplicate them",
    description:
      "Duplicates arise from retried inserts (no idempotency), race conditions, or bugs. Prevention: unique constraints (UNIQUE INDEX on email or order_id), upsert (INSERT ... ON CONFLICT DO NOTHING / DO UPDATE), idempotency keys, or optimistic locking with a version field. Detection: periodic deduplication jobs using window functions (ROW_NUMBER() PARTITION BY ...) to find duplicates. Soft deletes can complicate unique constraints — use partial indexes (WHERE deleted_at IS NULL).",
    whyItMatters:
      "Duplicate payments, orders, or user accounts cause real-world harm. Deduplication after the fact is expensive and error-prone. Enforcing uniqueness at the database layer is the safest approach — application-level checks have race conditions.",
    example:
      "Stripe generates an idempotency key per charge attempt and stores it with a UNIQUE constraint. Concurrent retries result in a constraint violation, not a double charge. Email deduplication: UNIQUE INDEX on (email) WHERE deleted_at IS NULL.",
    interviewTip:
      "Always enforce uniqueness at the DB layer with a unique constraint — not just in application code (race condition). For at-least-once message processing, mention idempotent handlers: check if event_id has been processed before acting.",
    tags: ["Unique Constraint", "Upsert", "Idempotency", "Deduplication", "Race Condition"],
  },
  {
    id: 20,
    category: "Databases & Data Handling",
    title: "Optimistic vs Pessimistic Locking",
    tagline: "Assume no conflict vs lock to prevent conflict",
    description:
      "Pessimistic locking: acquire a lock before reading so no other transaction can modify the row until you release it. SELECT ... FOR UPDATE in SQL. Safe but reduces concurrency — other readers/writers queue. Best for high-contention scenarios (bank transfers). Optimistic locking: read the row including a version number (or updated_at timestamp), do your work, then UPDATE ... WHERE id = :id AND version = :version. If the row changed (version mismatch), retry. No lock held during processing — high concurrency, but requires retry logic. Best for low-contention scenarios.",
    whyItMatters:
      "Pessimistic locking causes deadlocks and throughput bottlenecks at scale. Optimistic locking is faster but fails noisily under contention. Choosing the wrong strategy causes either data corruption (no locking) or throughput collapse (over-locking).",
    example:
      "GitHub's issue update uses optimistic locking: your edit is rejected if someone else saved first — \"conflict, please reload.\" Postgres SELECT FOR UPDATE is used in payment flows where double-spend must be impossible.",
    interviewTip:
      "State the trade-off clearly: pessimistic = safe under high contention, low concurrency; optimistic = high concurrency, requires retry. For interviews on inventory systems, mention that SELECT FOR UPDATE prevents overselling.",
    tags: ["Optimistic Locking", "Pessimistic Locking", "SELECT FOR UPDATE", "Version Column", "Deadlock"],
  },

  // ─── Caching & Performance ───────────────────────────────────────────────────
  {
    id: 21,
    category: "Caching & Performance",
    title: "What is Caching & Where to Cache",
    tagline: "Store computed results close to where they're needed",
    description:
      "Caching stores the result of expensive operations (DB queries, API calls, computations) in fast memory so future requests are served without repeating the work. Cache locations: browser cache (static assets, HTTP headers), CDN (edge nodes near users), application cache (in-process, e.g., a Map), distributed cache (Redis/Memcached, shared across servers). Cache-aside (lazy): on miss, fetch from DB, populate cache. Write-through: write to cache and DB together. Write-behind: write to cache, flush to DB asynchronously. Read-through: cache fetches from DB on miss automatically.",
    whyItMatters:
      "A DB query that takes 50 ms served from Redis takes < 1 ms. Caching can reduce DB load by 95%+ and is often the first scalability lever. But stale data and cache misses must be managed.",
    example:
      "Twitter caches the tweet object for viral tweets in Memcached — 10 million reads don't hit the database. Amazon caches product pages in CloudFront. Redis caches user sessions, rate limit counters, and leaderboard rankings.",
    interviewTip:
      "Name the cache location and strategy, then immediately discuss invalidation — it's the hard part. Also address cache stampede: what happens when a popular cache entry expires and thousands of requests hit the DB simultaneously?",
    tags: ["Redis", "Memcached", "Cache-Aside", "Write-Through", "Cache Stampede"],
  },
  {
    id: 22,
    category: "Caching & Performance",
    title: "Cache Eviction Strategies",
    tagline: "LRU, LFU, TTL — how caches decide what to remove",
    description:
      "When a cache is full, it must evict entries to make room. LRU (Least Recently Used): evict the entry that hasn't been accessed for the longest time. Good for temporal locality — recently accessed items are likely to be accessed again. LFU (Least Frequently Used): evict the entry accessed fewest times. Better for popular-item workloads. TTL (Time To Live): evict after a fixed time regardless of access. Prevents stale data. FIFO evicts the oldest entry regardless of access. Most caches combine TTL with LRU — entries expire after TTL or are evicted when capacity is needed.",
    whyItMatters:
      "Wrong eviction policy causes cache churn — frequently needed items keep getting evicted. LRU works well for most web workloads. TTL is essential for data that must not be stale beyond a point (session tokens, prices).",
    example:
      "Redis supports LRU, LFU, and TTL natively. You can set a global maxmemory-policy. DNS caches use TTL — records expire after the TTL in the DNS response. Browser HTTP caches use Cache-Control: max-age=N.",
    interviewTip:
      "LRU is the default safe answer for most caches. Mention TTL when freshness matters. Note that LFU is better for skewed access patterns (a few very popular items) but has higher overhead to track frequency.",
    tags: ["LRU", "LFU", "TTL", "Eviction Policy", "Redis"],
  },
  {
    id: 23,
    category: "Caching & Performance",
    title: "Cache Consistency & Stale Data",
    tagline: "Keeping the cache in sync with the source of truth",
    description:
      "Cache inconsistency arises when the DB is updated but the cache still holds the old value. Strategies: TTL-based expiry (stale for at most TTL seconds — simple but imprecise), event-driven invalidation (publish a cache invalidation event on DB write — precise but complex), cache-aside with write-through (update cache on every write — consistent but adds write latency), versioned cache keys (cache key includes a version, bump version on change — old entries naturally expire). Write-behind caching introduces a window where the cache has data the DB doesn't yet — risk of data loss on crash.",
    whyItMatters:
      "Serving stale data causes incorrect behaviour: wrong prices, stale permissions, outdated inventory counts. Aggressive TTLs reduce staleness at the cost of more DB hits. Perfect consistency requires invalidation on every write.",
    example:
      "When Airbnb updates a listing's price, it publishes a price_updated event. All caches holding that listing's price are invalidated. Facebook's Memcache uses lease tokens to prevent thundering herd on invalidation.",
    interviewTip:
      "Cache invalidation is the hardest part of caching. State your acceptable staleness SLA (e.g., prices can be 1 minute stale), then pick the strategy. For critical data (permissions, balances) use write-through or bypass the cache.",
    tags: ["Cache Invalidation", "Stale Data", "TTL", "Write-Through", "Event-Driven"],
  },
  {
    id: 24,
    category: "Caching & Performance",
    title: "CDN & Edge Caching",
    tagline: "Serve static and dynamic content from servers near the user",
    description:
      "A CDN (Content Delivery Network) is a globally distributed network of edge servers. Static assets (images, JS, CSS, fonts) are cached at the edge closest to the user — sub-10ms delivery instead of round-tripping to the origin. Cache behaviour is controlled by HTTP headers: Cache-Control: max-age=31536000, immutable for versioned assets; Cache-Control: no-cache for HTML. Modern CDNs (Cloudflare Workers, Fastly Compute) run serverless code at the edge for dynamic personalisation. CDN cache miss: the edge fetches from origin and caches the response for future requests.",
    whyItMatters:
      "Without a CDN, every user worldwide round-trips to your origin server — high latency, high origin load. A CDN reduces latency to milliseconds and offloads 80–95% of static traffic from your servers.",
    example:
      "GitHub uses Fastly for git objects and pages. Netflix's Open Connect CDN sits inside ISP networks — video bytes rarely leave the ISP. AWS CloudFront serves S3 assets globally. Cloudflare Pages hosts static sites at 300+ edge locations.",
    interviewTip:
      "When designing a large system, always add a CDN for static assets. Mention cache-busting for deployments: either use content-hashed filenames (main.abc123.js) or set short max-age on HTML. Discuss edge compute for auth or A/B testing.",
    tags: ["CDN", "Edge Caching", "Cache-Control", "Cloudflare", "CloudFront"],
  },
  {
    id: 25,
    category: "Caching & Performance",
    title: "Why Cache Can Make Systems Wrong",
    tagline: "The dark side: stale data, stampedes, and poisoned caches",
    description:
      "Three failure modes. Cache stampede (thundering herd): a popular key expires; thousands of requests hit the DB simultaneously, overloading it. Fix: probabilistic early expiration, mutex lock on first fetch (only one requester rebuilds), or background refresh. Stale data serving: permissions change but the cache doesn't — user retains access they shouldn't. Fix: short TTL or event-driven invalidation. Cache poisoning: incorrect data is cached (e.g., from a bug or injection) and served to many users before the error is noticed. Fix: canary deploys, monitoring, ability to flush cache.",
    whyItMatters:
      "Caching is a performance tool with correctness trade-offs. Teams add caches to solve speed problems and introduce subtle consistency bugs. Understanding failure modes lets you design safe caching from the start.",
    example:
      "A caching bug at Facebook once caused incorrect friend counts to be cached and served for minutes to millions of users. A stampede on a leaderboard cache caused a DB overload at a gaming company during a viral event.",
    interviewTip:
      "Name all three failure modes and their mitigations. Cache stampede is the most common interview question. Describe the mutex/lock approach: first thread to detect expiry acquires a lock, rebuilds, releases; others wait and then read from cache.",
    tags: ["Cache Stampede", "Thundering Herd", "Cache Poisoning", "Stale Data", "Cache Invalidation"],
  },

  // ─── Distributed Systems & Scaling ──────────────────────────────────────────
  {
    id: 26,
    category: "Distributed Systems & Scaling",
    title: "Load Balancing",
    tagline: "Distribute traffic evenly across multiple servers",
    description:
      "A load balancer routes incoming requests to a pool of backend servers. Algorithms: Round Robin (sequential rotation — simple, but doesn't account for server load), Least Connections (route to the server handling fewest active connections — better for long-lived requests), IP Hash (same client IP always hits same server — useful for stateful sessions), Weighted Round Robin (more traffic to more powerful servers). Layer 4 (TCP/UDP) load balancers route on IP + port. Layer 7 (HTTP) can inspect headers, paths, and cookies — route /api to backend, /static to CDN. Health checks remove unhealthy servers automatically.",
    whyItMatters:
      "Without a load balancer, traffic hits one server; add more servers and they sit idle. A load balancer is the entry point that enables horizontal scaling, redundancy, and zero-downtime deploys (rolling restarts).",
    example:
      "AWS Application Load Balancer (L7) routes /api/* to an ECS cluster and /auth/* to a separate service. NGINX is common for self-hosted L7 load balancing. Cloudflare acts as a global load balancer routing users to the nearest region.",
    interviewTip:
      "Describe Layer 4 vs Layer 7 — L7 is more flexible (content-aware routing), L4 is faster (no HTTP parsing). Mention that load balancers are themselves a single point of failure — use pairs with DNS failover or anycast.",
    tags: ["Load Balancer", "Round Robin", "Least Connections", "L4", "L7"],
  },
  {
    id: 27,
    category: "Distributed Systems & Scaling",
    title: "Horizontal vs Vertical Scaling",
    tagline: "More machines vs a bigger machine",
    description:
      "Vertical scaling (scale up): upgrade the existing server — more CPU cores, RAM, faster SSD. Simple, no code changes, but has limits (the biggest machine available) and a single point of failure. Horizontal scaling (scale out): add more machines and distribute load across them. Requires the app to be stateless (sessions in a shared store, not server memory). Scales to virtually unlimited capacity, enables redundancy. Most cloud architectures combine both: a cluster of moderately-sized instances behind a load balancer.",
    whyItMatters:
      "Vertical scaling hits a ceiling and creates SPOF. Horizontal scaling is the foundation of cloud-native architecture. Stateless services scale out trivially; stateful ones (DBs) require sharding or cluster-aware solutions.",
    example:
      "Early Twitter ran on a few large Ruby servers (vertical). Scaling required switching to stateless services behind load balancers (horizontal). AWS EC2 Auto Scaling adds instances when CPU > 70% and removes them when < 30%.",
    interviewTip:
      "When a system is under load, your first answer should be horizontal scaling. Follow up with: the service must be stateless, sessions in Redis, and a load balancer in front. Then discuss DB scaling separately (read replicas, sharding).",
    tags: ["Horizontal Scaling", "Vertical Scaling", "Stateless", "Auto Scaling", "SPOF"],
  },
  {
    id: 28,
    category: "Distributed Systems & Scaling",
    title: "Microservices vs Monoliths",
    tagline: "One big app vs many small, independent services",
    description:
      "A monolith is a single deployable unit — all features in one codebase, one process, one database. Simple to develop initially, easy to debug, no network overhead between features. A microservices architecture splits the system into small, independently deployable services, each owning its data. Benefits: independent scaling, independent deploys, technology flexibility. Costs: network latency between services, distributed transactions, complex observability, service discovery, and significant operational overhead. A common path: start monolith, extract services as boundaries become clear.",
    whyItMatters:
      "Many teams adopt microservices prematurely and spend more time on infrastructure than features. Monoliths are faster to build initially. Extract services when a domain needs independent scaling, a different technology, or a separate team.",
    example:
      "Amazon.com started as a monolith and extracted services over years. Netflix moved to microservices to enable hundreds of independent team deployments per day. Shopify runs a modular monolith — one codebase with strict module boundaries.",
    interviewTip:
      "Don't default to microservices for every system design. Start with a monolith, then extract boundaries where needed. If you say microservices, immediately address how services communicate (REST/gRPC/events), how you handle distributed transactions, and how you do observability.",
    tags: ["Microservices", "Monolith", "Service Mesh", "Distributed Systems", "Modular Monolith"],
  },
  {
    id: 29,
    category: "Distributed Systems & Scaling",
    title: "Service-to-Service Communication",
    tagline: "Sync REST/gRPC vs async messaging — trade-offs",
    description:
      "Synchronous: Service A calls Service B and waits for a response (HTTP/REST or gRPC). Simple, immediate feedback, but A is blocked if B is slow or down. Adds latency in chains (A→B→C). Asynchronous: A publishes an event/message to a queue or broker (Kafka, RabbitMQ, SQS); B consumes it when ready. A doesn't wait — higher throughput, better fault isolation, but eventual consistency. Patterns: request/reply (sync), publish-subscribe (fan-out to multiple consumers), event sourcing (events as source of truth). Choosing sync or async depends on whether you need an immediate result.",
    whyItMatters:
      "Synchronous chains of microservices multiply latency and failure probability. If B has 99.9% uptime and C has 99.9%, A→B→C has ~99.7% uptime. Async decouples services but makes debugging and tracing harder.",
    example:
      "Uber: ride request is synchronous (need immediate confirmation). Post-trip receipt email is async (Kafka event). Order placed at Amazon: payment sync, warehouse fulfillment async (SQS). Stripe webhooks are async outbound events.",
    interviewTip:
      "Match the pattern to the requirement. Sync for user-facing, latency-sensitive paths. Async for background processing, fan-out notifications, or cross-service workflows that don't need immediate response. Always discuss what happens when the queue is down.",
    tags: ["Synchronous", "Asynchronous", "gRPC", "Kafka", "Event-Driven"],
  },
  {
    id: 30,
    category: "Distributed Systems & Scaling",
    title: "Message Queues",
    tagline: "Kafka, RabbitMQ, SQS — durable async communication",
    description:
      "A message queue (or broker) accepts messages from producers and delivers them to consumers, decoupling the two sides. RabbitMQ: traditional message broker, AMQP protocol, supports routing, fanout, topic exchanges. Ideal for task queues and RPC. SQS (AWS): managed, at-least-once delivery, good for simple job queuing. Kafka: distributed commit log — messages are stored durably for a configurable retention period; consumers read at their own pace. Kafka enables replay, event sourcing, and stream processing. Key concepts: topic, partition, consumer group, offset, retention, exactly-once semantics (Kafka transactions).",
    whyItMatters:
      "Queues absorb traffic spikes (producers keep publishing; consumers process at their own rate), enable async processing, and decouple services. Without a queue, a spike in orders can overwhelm the fulfilment service.",
    example:
      "LinkedIn's activity feed runs on Kafka — billions of events per day. Airbnb uses Kafka for booking events that update search, notifications, and analytics. Celery + RabbitMQ/Redis is common in Python apps for async tasks.",
    interviewTip:
      "Know when to use each: Kafka for high-throughput, ordered, replayable event streams; RabbitMQ for traditional task queues with routing; SQS for simple AWS-native job queues. Discuss at-least-once vs exactly-once delivery and how idempotent consumers handle duplicates.",
    tags: ["Kafka", "RabbitMQ", "SQS", "Message Queue", "At-Least-Once"],
  },

  // ─── Reliability & Real-World Problems ──────────────────────────────────────
  {
    id: 31,
    category: "Reliability & Real-World Problems",
    title: "Exactly-Once vs At-Least-Once Processing",
    tagline: "Delivery guarantees — and why exactly-once is hard",
    description:
      "At-most-once: deliver the message once, don't retry on failure — some messages are lost. At-least-once: retry until acknowledged — no loss but duplicates are possible. Exactly-once: process each message exactly once — the ideal but hardest guarantee. True exactly-once requires coordination between the broker and the consumer's state store (Kafka transactions + idempotent producers). In practice, most systems achieve at-least-once delivery with idempotent consumers: the consumer checks if the message was already processed (using a unique message ID in a DB) and skips if so.",
    whyItMatters:
      "Processing a payment exactly once is critical. At-least-once with a non-idempotent handler double-charges customers. At-most-once loses transactions. Most real systems use at-least-once + idempotent handlers as the practical solution.",
    example:
      "Stripe's webhook events have an event ID. Your handler stores processed event IDs and skips duplicates. Kafka Streams with exactly-once semantics uses transactions to atomically commit offset + state store update. SQS is at-least-once only.",
    interviewTip:
      "When designing a payment or order system on top of a queue, say \"at-least-once delivery with idempotent consumers.\" Describe: record the message ID in the DB before processing, check on receipt, use UPSERT or skip-if-exists logic.",
    tags: ["Exactly-Once", "At-Least-Once", "Idempotent Consumer", "Kafka", "Message ID"],
  },
  {
    id: 32,
    category: "Reliability & Real-World Problems",
    title: "Retries, Timeouts & Circuit Breakers",
    tagline: "Handling failures gracefully in distributed systems",
    description:
      "Retries: when a request fails, try again. With exponential backoff + jitter to avoid thundering herds. Only retry idempotent operations (safe to call multiple times). Timeouts: set a maximum wait time for every outbound call — without one, a slow downstream causes your threads/goroutines to pile up (thread exhaustion). Circuit Breaker: after N consecutive failures, open the circuit (stop sending requests) for a cooldown period, then half-open (test one request). If it succeeds, close the circuit. Prevents cascading failures — a slow downstream doesn't bring down the upstream.",
    whyItMatters:
      "Without timeouts, one slow service can exhaust all threads and crash the entire system. Without circuit breakers, a failing DB causes all requests to queue and timeout. These patterns are the foundation of resilient microservices.",
    example:
      "Netflix Hystrix (now resilience4j) pioneered circuit breakers for Java. AWS SDK has built-in exponential backoff with jitter. Envoy proxy implements circuit breaking at the network layer for all services in a mesh.",
    interviewTip:
      "Always set timeouts on every outbound network call. Describe retry with exponential backoff: first retry after 1s, then 2s, 4s, with random jitter. Combine with a circuit breaker to stop retrying a dead service. Mention dead-letter queues for failed messages.",
    tags: ["Retry", "Exponential Backoff", "Circuit Breaker", "Timeout", "Resilience"],
  },
  {
    id: 33,
    category: "Reliability & Real-World Problems",
    title: "Handling Race Conditions",
    tagline: "When two operations collide and corrupt shared state",
    description:
      "A race condition occurs when two concurrent operations read shared state, both decide to act on it, and both write — resulting in one write overwriting the other. Example: two threads read inventory count = 5, both decrement, both write 4 — one decrement is lost. Solutions: database-level locking (SELECT FOR UPDATE, atomic UPDATE WHERE count > 0), optimistic locking (version check on update), Redis atomic operations (DECR, Lua scripts), serialised task queues (one worker processes inventory updates), database constraints (CHECK count >= 0).",
    whyItMatters:
      "Race conditions cause overselling, double bookings, duplicate purchases, and corrupted counters. They're hard to reproduce (timing-dependent) and hard to debug in production. The solution must be at the data layer, not the application layer.",
    example:
      "Flash sale: 10,000 users hit /buy simultaneously. Without atomicity, all see stock = 1 and all succeed — 10,000 items are oversold. Fix: UPDATE products SET stock = stock - 1 WHERE id = :id AND stock > 0 is atomic and returns 0 rows if stock is gone.",
    interviewTip:
      "State the race condition explicitly, then propose the data-layer fix. Prefer database atomics (atomic UPDATE, SELECT FOR UPDATE) over application-level locking. For counters, Redis INCR/DECR are atomic by design.",
    tags: ["Race Condition", "Atomic Operations", "SELECT FOR UPDATE", "Optimistic Locking", "Redis DECR"],
  },
  {
    id: 34,
    category: "Reliability & Real-World Problems",
    title: "Distributed Locking",
    tagline: "Coordinating exclusive access across multiple servers",
    description:
      "In a distributed system, multiple service instances can't share in-process locks (each has its own memory). Distributed locks ensure only one process performs a critical section across all instances. Redis Redlock: SET key uuid NX PX ttl (set if not exists, with expiry). If set succeeds, the process holds the lock; release by deleting the key only if value matches UUID. TTL prevents lock from being held forever if the process crashes. Alternatives: Zookeeper ephemeral nodes, etcd leases, database advisory locks (pg_advisory_lock). Distributed locks are complex — prefer database-level atomics or queue-based serialisation where possible.",
    whyItMatters:
      "Without distributed locking, two service replicas can both process the same job, both charge the same customer, or both send the same email. Application-level mutexes don't work across processes.",
    example:
      "Cron jobs: only one instance of a scheduled task should run. Redis lock with TTL = job timeout. If the lock holder crashes, TTL releases it automatically. Airflow uses distributed locks for DAG scheduling across workers.",
    interviewTip:
      "Describe Redis SET NX PX (set if not exists with expiry). Mention the release-only-if-owner pattern (UUID check). Note that Redlock (multi-node) is controversial (Martin Kleppmann's critique) — for most use cases, a single Redis instance lock is sufficient.",
    tags: ["Distributed Lock", "Redis", "Redlock", "Mutex", "Zookeeper"],
  },
  {
    id: 35,
    category: "Reliability & Real-World Problems",
    title: "Event-Driven Architecture",
    tagline: "Services communicate by publishing and reacting to events",
    description:
      "In event-driven architecture (EDA), services publish events when something happens (OrderPlaced, UserSignedUp). Other services subscribe and react independently. Producers don't know about consumers — loose coupling. Patterns: Event Notification (lightweight, just signals something happened), Event-Carried State Transfer (event contains the full new state), Event Sourcing (the event log is the source of truth — current state is derived by replaying events). Benefits: temporal decoupling, easy to add new consumers, natural audit log. Challenges: eventual consistency, harder debugging, event schema evolution.",
    whyItMatters:
      "EDA enables independent scaling and deployment of services. Adding a new feature (send welcome email on signup) means adding a new subscriber — no change to the publisher. But consistency is eventual: reading immediately after a write may return stale state.",
    example:
      "Shopify order flow: OrderPlaced event triggers fulfillment, inventory update, email, and analytics in parallel — each service is independent. LinkedIn publishes member profile updates as events that update search, recommendations, and ads.",
    interviewTip:
      "Distinguish EDA from simple async queues: EDA is a style where events are the primary integration mechanism. Mention the challenges: schema evolution (use a schema registry), observability (event tracing), and idempotent consumers.",
    tags: ["Event-Driven", "Event Sourcing", "Pub/Sub", "Kafka", "Loose Coupling"],
  },
  {
    id: 36,
    category: "Reliability & Real-World Problems",
    title: "Saga Pattern",
    tagline: "Distributed transactions without a global lock",
    description:
      "A saga is a sequence of local transactions, each publishing an event or message that triggers the next step. If a step fails, compensating transactions undo previous steps. Two flavours: Choreography (each service listens for events and triggers the next) — simple, but flow is hard to follow. Orchestration (a saga orchestrator calls each service in sequence) — explicit flow, easier to observe and debug, but the orchestrator is a centralisation point. Sagas replace two-phase commit (2PC) in microservices — 2PC requires all participants to be available and lock resources across services.",
    whyItMatters:
      "Multi-service transactions (book hotel + flight + car) can't use a single DB transaction across services. 2PC is impractical at scale. Sagas provide a pattern for eventual consistency with compensating actions on failure.",
    example:
      "E-commerce order saga: Reserve inventory → charge payment → ship order. If payment fails, compensate by releasing inventory. AWS Step Functions implements the orchestration saga pattern. Temporal.io is a popular saga orchestration framework.",
    interviewTip:
      "Mention that sagas guarantee eventual consistency, not atomicity. Explain compensating transactions (rollback by doing the reverse action). Recommend orchestration for anything non-trivial — choreography becomes a spaghetti of events.",
    tags: ["Saga", "Distributed Transactions", "Choreography", "Orchestration", "Compensating Transactions"],
  },
  {
    id: 37,
    category: "Reliability & Real-World Problems",
    title: "Graceful Degradation",
    tagline: "Keep serving users when parts of the system fail",
    description:
      "Graceful degradation means the system continues to function (possibly with reduced features) when a dependency is unavailable. Techniques: feature flags to disable non-critical features, fallback responses (return cached data when the DB is down), circuit breakers (stop calling a failing service), stubs/defaults (show placeholder content when personalisation fails), bulkhead pattern (isolate failures — thread pools per downstream so one slow service doesn't consume all threads).",
    whyItMatters:
      "In a microservices system, some service will always be degraded. Graceful degradation ensures a payment failure doesn't break the entire homepage, or a recommendation engine outage doesn't prevent users from browsing.",
    example:
      "Netflix: when the personalisation service is down, the homepage shows editorial picks instead of personalised rows. Amazon: product reviews load separately from the main product page — a review service outage doesn't block purchases.",
    interviewTip:
      "For every external dependency in your design, ask: what does the system do if this is down? Mention circuit breakers, fallback data, and feature flags. Distinguish graceful degradation (still serves users) from fail-fast (errors out immediately to prevent cascading).",
    tags: ["Graceful Degradation", "Fallback", "Feature Flags", "Bulkhead", "Circuit Breaker"],
  },
  {
    id: 38,
    category: "Reliability & Real-World Problems",
    title: "Observability",
    tagline: "Logs, metrics, and traces — understanding your system in production",
    description:
      "Observability is built on three pillars. Logs: timestamped text records of events — use structured JSON logs (easier to query), correlate with a trace ID. Metrics: numeric measurements over time — request rate, error rate, latency percentiles (p50, p95, p99), CPU, memory. Use tools like Prometheus + Grafana or Datadog. Traces: a distributed trace follows a request across multiple services — each service adds a span with timing. OpenTelemetry is the standard instrumentation library. The classic on-call metric: the four golden signals — latency, traffic, errors, saturation.",
    whyItMatters:
      "Without observability, production incidents become guesswork. Structured logs + distributed tracing cut debugging time from hours to minutes. Metrics and SLOs let you know about problems before users report them.",
    example:
      "Uber's observability stack: Jaeger for distributed tracing, M3 for metrics, ELK for logs. Every microservice emits a trace ID in all log lines. A high-latency alert fires → trace shows the bottleneck is a slow DB query on the payments service.",
    interviewTip:
      "Mention all three pillars: logs, metrics, traces. Describe the four golden signals (latency, traffic, errors, saturation). Mention OpenTelemetry for instrumentation. In a system design, add an observability section — it shows production maturity.",
    tags: ["Observability", "Logs", "Metrics", "Distributed Tracing", "OpenTelemetry"],
  },
  {
    id: 39,
    category: "Reliability & Real-World Problems",
    title: "Deployments",
    tagline: "Blue-green, rolling, canary — releasing without downtime",
    description:
      "Blue-green deployment: run two identical environments (blue = current, green = new). Switch traffic from blue to green atomically. Rollback by switching back. Requires 2x infrastructure but zero-downtime. Rolling deployment: gradually replace old instances with new ones. Lower cost, but old and new versions serve traffic simultaneously — must be backward compatible. Canary deployment: route a small % of traffic (1–5%) to the new version. Monitor metrics. Gradually increase if stable. Safest for catching regressions in production. Feature flags allow deploying code dark (in production, off for users) and enabling per-user or per-cohort.",
    whyItMatters:
      "Deploy to 100% users at once and a bug hits everyone. Canary deployments contain blast radius. Understanding deployment strategies is expected from senior engineers — it's how you ship safely at scale.",
    example:
      "AWS CodeDeploy supports all three strategies. Kubernetes supports rolling deployments natively. Facebook uses feature flags extensively — most features are deployed dark for weeks, then gradually enabled to 0.1% → 1% → 100% of users.",
    interviewTip:
      "State which strategy you'd use and why. For user-facing features: canary with metrics thresholds. For DB migrations: backward-compatible first, then remove old columns after the new code is fully deployed. Mention that DB migrations are the hard part of zero-downtime deploys.",
    tags: ["Blue-Green", "Canary", "Rolling Deployment", "Feature Flags", "Zero Downtime"],
  },
  {
    id: 40,
    category: "Reliability & Real-World Problems",
    title: "Handling Traffic Spikes & Viral Load",
    tagline: "Designing for 100x normal traffic that you can't predict",
    description:
      "Traffic spikes overwhelm unprepared systems. Strategies: auto-scaling (add servers when CPU/RPS crosses threshold — horizontal scale-out, but takes 1–3 minutes to start), load shedding (drop low-priority requests when overloaded — return 503 with Retry-After), queue-based levelling (write requests to a queue, process at a steady rate — users wait, but requests don't fail), rate limiting (cap per-user RPS), pre-warming (scale up before known events — product launches, sports finals). CDN absorbs static asset load. Database read replicas absorb read spikes. Pre-compute and cache expensive aggregations.",
    whyItMatters:
      "A tweet from a celebrity can 100x your traffic in seconds. Auto-scaling can't react fast enough for true viral load — you need queues, load shedding, and pre-caching. Systems that don't handle spikes turn viral moments into outages.",
    example:
      "Ticketmaster goes down on Taylor Swift ticket sales — classic spike problem. Fix: virtual waiting rooms (queue users), pre-scaled infrastructure, aggressive caching of available seats. Twitter's Super Bowl spike: pre-scaled, Memcached warmed, tweet objects pre-fetched for likely-to-trend topics.",
    interviewTip:
      "Layer your defences: CDN → rate limiter → queue → auto-scaled service → read replicas. Mention load shedding (503 is better than a crash). Discuss pre-warming for predictable events. State that no system can handle infinite load — the goal is graceful degradation under extreme stress.",
    tags: ["Traffic Spike", "Auto Scaling", "Load Shedding", "Queue", "Pre-warming"],
  },
];

export const BACKEND_CONCEPT_COUNT = BACKEND_CONCEPTS.length;
