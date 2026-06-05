export interface SystemDesignConcept {
  id: number;
  section: string;
  title: string;
  tagline: string;
  description: string;
  whyItMatters: string;
  diagramNote: string;
  example: string;
  interviewTip: string;
  tags: string[];
}

export const SYSTEM_DESIGN_SECTIONS = [
  "Foundation",
  "Requirements",
  "Communication",
  "Data Layer",
  "Scaling & Distribution",
  "Reliability",
  "Case Study",
  "Advanced Topics",
] as const;

export const SYSTEM_DESIGN_CONCEPTS: SystemDesignConcept[] = [
  // ─────────────────────────────────────────────
  // FOUNDATION
  // ─────────────────────────────────────────────
  {
    id: 1,
    section: "Foundation",
    title: "What is System Design",
    tagline: "Building systems that work at scale",
    description:
      "System = components + a common goal. System design is the process of choosing those components and defining how they connect to solve a problem reliably at scale. The bank analogy makes this concrete: start with one cashier (single server). Bottleneck? Train the cashier to work faster (optimize code / DSA). Still slow? Upgrade the desk with tools like a cash counter machine (vertical scaling — more RAM/CPU). Customers still waiting? Add more counters (horizontal scaling). But now two counters have separate vaults — data mismatch. Fix it by sharing one central vault (centralized database). Finally, customers crowd one counter — add a guard at the door who directs each person to the least-busy counter (load balancer). Each solution introduced a new system design concept.",
    whyItMatters:
      "Anyone can write code that works for 10 users. System design is what makes it work for 10 million at once. Interviews test whether you can evolve a simple design as constraints change — exactly what the bank story demonstrates.",
    diagramNote:
      "Draw a bank evolving across 5 steps: Step 1 — one cashier (server) behind a counter. Step 2 — same cashier, bigger desk + cash machine (upgraded server). Step 3 — two counters side by side (two servers). Step 4 — both counters share one vault at the back (centralized database). Step 5 — a guard at the entrance routes customers to whichever counter is free (load balancer in front of both servers).",
    example:
      "WhatsApp handles 2–10 million messages per day using distributed servers, a centralized database, and load balancers — the exact same evolution as the alien bank, just at internet scale.",
    interviewTip:
      "When given any design prompt, state: 'A system is components + a common goal. Let me identify the components.' Then evolve from the simplest design step by step — single server → scale out → add DB → add cache → add load balancer. This structured evolution shows depth.",
    tags: ["Architecture", "Scale", "Components", "High Level Design", "Bank Analogy"],
  },
  {
    id: 2,
    section: "Foundation",
    title: "Data vs Compute Intensive",
    tagline: "Identify where the bottleneck actually lives",
    description:
      "Every system is either data-intensive or compute-intensive. Data-intensive apps: the primary work is moving, storing, and retrieving data. The CPU is rarely the bottleneck. Examples: Instagram feed, WhatsApp messages, bank transactions, analytics dashboards. Fix by improving database calls, caching, replication, sharding, and server configuration. Compute-intensive apps: the primary work is running calculations. The database is rarely the bottleneck. Examples: image processing, video rendering, ML model training, flight simulators, cryptography. Fix by adding CPU/GPU capacity and parallelism. Trick to tell them apart: if time is lost in data movement → data intensive. If time is lost in calculations → compute intensive. One app can have both — YouTube is data-intensive for serving videos but compute-intensive for generating recommendations.",
    whyItMatters:
      "Throwing GPU at a database bottleneck wastes money. Throwing more databases at a CPU bottleneck also wastes money. Identifying the bottleneck type first saves engineering time and cost by pointing you at the right layer to fix.",
    diagramNote:
      "Draw two columns. Left — 'Data Intensive': thick arrow from Database to App Server, thin arrow to CPU. Below it, fixes: cache, replication, sharding, better queries. Right — 'Compute Intensive': thick arrow at CPU/GPU block, thin arrow from Database. Below it, fixes: parallel workers, GPU clusters, better algorithms.",
    example:
      "Instagram is data-intensive: millions of images/videos moving from CDN to users. The bottleneck is data movement, so they use aggressive caching and distributed CDN — not more CPU. ML recommendation features on the same platform are compute-intensive — they run on GPU farms doing matrix math, not on extra databases.",
    interviewTip:
      "Before drawing any architecture, classify the feature: 'This is data-intensive so I'll focus on caching, CDN, and read replicas.' Or: 'This is compute-intensive so I'll design parallel GPU workers with a job queue.' Using this distinction immediately signals engineering maturity.",
    tags: ["Bottleneck", "Data Intensive", "Compute Intensive", "GPU", "Performance"],
  },

  // ─────────────────────────────────────────────
  // REQUIREMENTS
  // ─────────────────────────────────────────────
  {
    id: 3,
    section: "Requirements",
    title: "Functional Requirements",
    tagline: "What the system must do",
    description:
      "Functional requirements define every feature and action users can perform — the 'what'. For an e-commerce app: user can register, log in, view products, search products, filter by category/price, add to cart, apply coupon, place order, process payment, track order. Each bullet is a functional requirement. These are the core capabilities — without them, the product doesn't work. In system design, listing functional requirements first anchors every component you add: each server, database, and queue must serve at least one functional requirement. Anything added beyond that is over-engineering.",
    whyItMatters:
      "You can't design what you haven't defined. Functional requirements prevent scope creep, keep the interview structured, and ensure every architectural decision traces back to a real user need.",
    diagramNote:
      "Draw a vertical checklist of user actions: Register → Login → Browse Products → Search / Filter → Add to Cart → Apply Coupon → Checkout → Payment → Track Order. This becomes the feature map — each row will eventually map to an API endpoint or a service in your architecture.",
    example:
      "Amazon's functional requirements include product catalog browsing, search with filters, cart management, order placement, payment processing, and delivery tracking. Each maps to a dedicated microservice in their actual architecture.",
    interviewTip:
      "Spend the first 2–3 minutes clarifying functional requirements with the interviewer before drawing anything. Ask: 'Should I include user auth? Payment processing? Notifications?' This shows maturity, sets scope, and prevents designing the wrong system.",
    tags: ["Requirements", "Features", "Scope", "Use Cases", "API Design"],
  },
  {
    id: 4,
    section: "Requirements",
    title: "Non-Functional Requirements",
    tagline: "How the system must perform",
    description:
      "Non-functional requirements define how the system performs — not what it does, but how well it does it. The main categories: Scalability (handle 10× traffic on a sale day — vertical or horizontal?), Availability (99.9% uptime — defined in SLAs/SLOs; downtime tolerance per year), Reliability (no data loss; system recovers from failures), Performance (p99 response time < 200ms; latency budgets), Security (authentication, authorization, encryption at rest and in transit), Observability (logs, metrics, tracing — knowing what's wrong without touching production). These are constraints, not features. Ignoring them causes outages and data breaches, not just missing features.",
    whyItMatters:
      "A feature-complete app that crashes under load, leaks user data, or takes 10 seconds to respond fails in production. NFRs define the quality bar the system must meet — and they directly drive architectural decisions.",
    diagramNote:
      "Draw a system diagram box with a checklist overlaid on the side: ☑ Response < 200ms (P99) ☑ 99.9% uptime ☑ 1M daily active users ☑ Encrypted data ☑ Auto-scale on traffic spike ☑ Alerts and monitoring. Every component you add to the architecture should be traceable to one of these requirements.",
    example:
      "Amazon's NFRs drive their entire architecture: < 200ms p99 latency → CDN + cache. 99.999% uptime → multi-region with automatic failover. 10× traffic on Black Friday → auto-scaling groups. Each NFR is a SLA commitment backed by engineering design.",
    interviewTip:
      "Before drawing any boxes, state your NFRs: 'I'll target 99.9% availability, p99 latency under 500ms, and the system should handle 1M daily active users with peaks of 10× that.' Then justify every component in terms of these. Interviewers score heavily on this.",
    tags: ["SLA", "SLO", "Availability", "Scalability", "Performance", "Security", "Reliability"],
  },

  // ─────────────────────────────────────────────
  // COMMUNICATION
  // ─────────────────────────────────────────────
  {
    id: 5,
    section: "Communication",
    title: "DNS",
    tagline: "Translates domain names to IP addresses",
    description:
      "Computers communicate via IP addresses, not names. DNS translates 'telesco.com' → '192.168.1.1'. The lookup has three hops: (1) Root Server — there are 13 root server groups (named A–M, owned by different organizations). They don't know your site's IP but know which TLD server handles .com, .net, .in etc. (2) TLD Server — handles all domains in one top-level domain (.com). Returns the address of the authoritative name server. (3) Authoritative Name Server — owned by the domain registrar (GoDaddy, Google Domains). Stores the actual IP for your domain. Returns the final IP address. After the first lookup, results are cached at three layers: browser cache, OS cache, DNS resolver cache (at your ISP). TTL on DNS records controls how long caches live. Subdomains (docs.telesco.com) are resolved using the same authoritative server — the domain has a 'zone' containing all its subdomains.",
    whyItMatters:
      "Every web request starts with a DNS lookup. Understanding DNS explains geo-routing (send Indian users to Indian servers via DNS), CDN edge selection, failover, and why domain changes can take hours to propagate (TTL).",
    diagramNote:
      "Draw left to right: Browser → DNS Resolver (box at ISP) → Root Server (says 'ask .com TLD') → TLD Server (.com handler, says 'ask NS at 10.0.0.1') → Authoritative Name Server (returns '19.28.38.41') → Browser connects to that IP. Add cache bubbles at Browser, OS, and DNS Resolver showing where subsequent lookups short-circuit the chain.",
    example:
      "When you type google.com, your browser checks its own cache first. On miss, asks the OS. On miss, asks your ISP's DNS resolver. On miss, the resolver walks the full tree: root → .com TLD → google's authoritative NS → gets 216.58.x.x. This entire process completes in ~50ms and is then cached.",
    interviewTip:
      "Mention DNS when discussing global distribution: 'I'd configure DNS geo-routing so users in India resolve to the Mumbai server IP, users in the US resolve to the Virginia server IP — cutting latency by reducing physical distance.'",
    tags: ["DNS", "Domain", "IP Address", "TTL", "Root Server", "TLD", "Authoritative NS"],
  },
  {
    id: 6,
    section: "Communication",
    title: "API Types",
    tagline: "Different protocols for different communication needs",
    description:
      "Five main API types: REST (most common — HTTP methods + JSON, stateless request/response, human-readable, easy to use from any client), SOAP (older enterprise standard — uses XML which is verbose and bulky; still runs in legacy banking and government systems), GraphQL (single endpoint; client sends a query specifying exactly which fields to return — avoids over-fetching 50 fields when you need 3; great for mobile apps), gRPC (created by Google; uses binary Protocol Buffers instead of JSON — 3–10× smaller on wire, much faster; best for microservice-to-microservice internal calls), WebSockets (persistent bidirectional channel — server can push data to client at any time without client polling; used for chat, notifications, live scores, collaborative tools). Rule of thumb: REST for public APIs, gRPC between internal microservices, WebSockets for real-time push.",
    whyItMatters:
      "Choosing the wrong API type adds unnecessary latency or complexity. gRPC is 3–10× faster than REST for internal calls. WebSockets eliminate wasteful polling for real-time features. Knowing when to use each separates junior from senior engineers.",
    diagramNote:
      "Draw five labeled boxes in a row: REST (↔ JSON over HTTP, stateless), SOAP (↔ XML, envelope format), GraphQL (one endpoint ↔, client sends custom query), gRPC (↔ binary protobuf, fast wire), WebSockets (↔↔ persistent arrow both directions, server can initiate). Highlight gRPC as 'internal services' and WebSockets as 'real-time push'.",
    example:
      "Uber: REST for the public mobile app API. gRPC between internal microservices (driver matching, surge pricing engine). WebSockets to push live driver location to the rider's app every second without the app asking repeatedly.",
    interviewTip:
      "Default to REST for client-server. Say: 'For internal microservice calls I'd use gRPC for lower latency and smaller payloads.' Only propose WebSockets when the feature genuinely requires real-time push from server to client (chat, notifications, live collaboration).",
    tags: ["REST", "gRPC", "GraphQL", "SOAP", "WebSockets", "Protobuf", "HTTP"],
  },
  {
    id: 7,
    section: "Communication",
    title: "REST APIs in Depth",
    tagline: "Methods, status codes, and design best practices",
    description:
      "HTTP Methods: GET (read data), POST (create new resource — not idempotent), PUT (replace entire resource — sending partial body nulls other fields), PATCH (partial update — safer than PUT), DELETE (remove). Passing data: Path params (/users/123) for unique identifiers. Query params (/users?sort=asc&q=java) for filtering, sorting, pagination. Request body for sensitive data (passwords) or complex payloads. Status codes: 200 OK, 201 Created, 204 No Content (delete success, no body), 301 Permanent Redirect, 302 Temporary Redirect, 400 Bad Request (invalid body/missing field), 401 Unauthorized (not logged in), 403 Forbidden (logged in but not allowed), 404 Not Found, 500 Internal Server Error. Response format: always wrap response in an object — never return a bare array. Wrapping lets you add metadata later (count, pagination token) without breaking clients. Nested resources (/blogs/1/comments) for clear relationships; query params for complex filters.",
    whyItMatters:
      "REST is the dominant API style you'll build and consume throughout your career. Getting methods, status codes, and response format right from the start prevents breaking changes and client bugs at scale.",
    diagramNote:
      "Draw a two-column table: Method | URL → Use Case. GET /users → list all. GET /users/1 → single user. POST /users + body → create user. PUT /users/1 + full body → replace. PATCH /users/1 + partial body → update one field. DELETE /users/1 → remove. Below the table: response shape — always { users: [...] } not bare [...].",
    example:
      "GitHub API: GET /repos/{owner}/{repo} returns repo data (200). POST /repos/{owner}/{repo}/issues creates issue (201). PATCH /repos/{owner}/{repo} updates repo settings (200). All responses are objects with nested fields — never bare arrays. Invalid auth returns 401, missing repo returns 404.",
    interviewTip:
      "Use plural nouns for resources (/users, /orders). Nest related resources (/orders/1/items) for clear relationships. Query params for filtering (/products?color=blue&max_price=100). Always wrap responses in objects. Return 404 for missing resources, 400 for bad input, 401 for missing auth, 403 for insufficient permissions, 500 for server bugs.",
    tags: ["HTTP Methods", "Status Codes", "REST", "JSON", "Path Params", "Query Params", "API Design"],
  },

  // ─────────────────────────────────────────────
  // DATA LAYER
  // ─────────────────────────────────────────────
  {
    id: 8,
    section: "Data Layer",
    title: "SQL Databases",
    tagline: "Structured data with enforced relationships",
    description:
      "SQL (Structured Query Language) databases store data in tables — rows are records, columns are fields. Every entity gets a table (users, posts, orders). Constraints enforce data quality: UNIQUE (no two rows can share this value — username), NOT NULL (field is required — first_name), PRIMARY KEY (unique row identifier — user_id; each table has one), FOREIGN KEY (links two tables — posts.author_id references users.id), CHECK (validation rule — password_length > 8, balance >= 0), DEFAULT (fallback when not provided — role = 'student'). Relationships: One-to-Many (one user → many posts; post has author_id FK), Many-to-Many (students ↔ courses; requires a junction table students_courses with both FKs), One-to-One (content → video_details; separate table but linked by same ID). Use SQL when: data has clear relationships, you need ACID transactions (payments, bookings), schema is stable.",
    whyItMatters:
      "Most business data has natural relationships. SQL enforces those at the database level — preventing orphaned records, duplicate usernames, and corrupted data. ACID guarantees mean money never disappears mid-transaction.",
    diagramNote:
      "Draw two boxes: users(id PK, name, username UNIQUE, email NOT NULL) and posts(id PK, content, author_id FK). Draw an arrow from posts.author_id → users.id labeled 'one-to-many (one user, many posts)'. For many-to-many, add three boxes: students ← students_courses(student_id FK, course_id FK) → courses. The middle junction table is the key insight.",
    example:
      "A bank uses PostgreSQL: accounts table has PRIMARY KEY on account_id, NOT NULL and CHECK (balance >= 0) on balance. transactions table has two FOREIGN KEYs referencing accounts. ACID ensures that a transfer debits one account and credits another atomically — either both happen or neither does.",
    interviewTip:
      "Choose SQL when: the schema is fixed, data has relationships, consistency is critical (payments, inventory), or you need complex queries with joins. Explain which constraints you'd use and why — this signals you think about data integrity, not just features.",
    tags: ["SQL", "PostgreSQL", "MySQL", "ACID", "Foreign Key", "Joins", "Constraints"],
  },
  {
    id: 9,
    section: "Data Layer",
    title: "NoSQL Databases",
    tagline: "Flexible storage for unstructured or massive data",
    description:
      "NoSQL is not one thing — it's four distinct models: Key-Value (Redis, DynamoDB — store anything as key → value; fastest for sessions, cache, real-time counters), Columnar / Column-family (Cassandra, BigQuery, Redshift — reads column-by-column instead of row-by-row; great for analytics queries that need one column across millions of rows, terrible for row inserts), Graph (Neo4j — data is nodes and edges; both nodes AND edges can have properties; great for social networks, fraud detection, recommendation patterns), Document (MongoDB, CouchDB — stores JSON documents; each document can have different fields; schemaless; great for content, user profiles, logs). Choose NoSQL when: data is unstructured or schema changes often, you need horizontal scale, you lack complex joins, speed and availability matter more than strict consistency. Real companies: Netflix uses Cassandra for activity data. Amazon uses DynamoDB to scale. Twitter uses Redis for caching timelines.",
    whyItMatters:
      "SQL schema rigidity becomes a bottleneck at scale — adding a column to a 500M-row table takes hours. NoSQL's flexibility and horizontal scalability are why every major tech company uses it for at least one service.",
    diagramNote:
      "Draw four labeled boxes: Key-Value (key → value, like a giant dictionary). Columnar (table turned 90° — vertical arrows reading down columns, not across rows; highlights analytics use case). Graph (circles as nodes with property labels, lines as edges also with property labels). Document (nested JSON object where different documents have different fields — no fixed schema).",
    example:
      "Instagram stores user account data in PostgreSQL (relational, consistent), activity feed in Cassandra (high write throughput, horizontally scalable), and hot timeline data in Redis (key-value, microsecond reads). Three different NoSQL types for three different access patterns.",
    interviewTip:
      "Don't default to MongoDB for everything. Ask: 'What's the access pattern?' Sessions/cache → key-value (Redis). Analytics on huge data → columnar (Cassandra/BigQuery). Social graph/recommendations → graph DB. Flexible content/profiles/logs → document (MongoDB). Match the model to the access pattern.",
    tags: ["NoSQL", "MongoDB", "Redis", "Cassandra", "DynamoDB", "Key-Value", "Graph DB", "Columnar"],
  },
  {
    id: 10,
    section: "Data Layer",
    title: "Caching",
    tagline: "Store hot data in fast memory to avoid database hits",
    description:
      "A cache stores frequently accessed data in fast in-memory storage so subsequent requests are served without hitting the database. Cache hit: data found in cache → sub-millisecond response. Cache miss: data not in cache → go to database (slower), then store result in cache for next time. TTL (Time to Live): every cached value has an expiry time. After TTL expires, the value is removed and the next request re-fetches from DB. Cache size is deliberately small — a large cache would be slow to search and defeat its purpose. Only store what's hot. Cache layers: browser cache (static files), DNS cache, server-side cache (Redis/Memcached — most controllable), database query cache. Server-side is where most optimization happens.",
    whyItMatters:
      "A DB query taking 100ms costs 100ms every time without cache. The same query served from Redis takes < 1ms. Caching is typically the first optimization that multiplies system capacity by 10–100× with minimal infrastructure change.",
    diagramNote:
      "Draw: Client → App Server → [Cache (Redis) box]. Two paths from cache: 'Hit' arrow going straight back to App Server (fast). 'Miss' arrow going down to Database, then back up through Cache (populates it), then to App Server (slow, but only happens once). Label the cache box 'small + fast', the DB box 'large + slow'.",
    example:
      "telesco.com homepage shows 6 featured courses, each requiring 4 database table joins. Without cache: 24 DB queries per page load × 10,000 daily users = 240,000 DB queries. With Redis cache + 10-min TTL: 24 queries total per cache window, regardless of user count.",
    interviewTip:
      "Always discuss cache invalidation — the hard part. Options: TTL (simplest, tolerates brief staleness), event-driven invalidation (update cache when DB changes), versioned keys (cache key includes a version number). Also mention cold start: what happens when the cache is empty right after a deploy?",
    tags: ["Redis", "Memcached", "Cache Hit", "Cache Miss", "TTL", "Latency", "Server-Side Cache"],
  },
  {
    id: 11,
    section: "Data Layer",
    title: "Cache Read/Write Strategies",
    tagline: "When to read from and write to cache",
    description:
      "Four strategies for managing cache and database in sync: Read Through Cache (RTC): every read goes to cache first. On miss, the cache itself fetches from DB and stores the value before returning it. Writes go directly to DB, bypassing cache. Cache fills lazily as data is requested. Write Through Cache (WTC): every write goes to cache first, then synchronously to DB before responding. Cache is always current. Higher write latency but no stale reads. Used when you need latest data immediately (stock prices). Write Around Cache (WAC): writes go directly to DB, skipping cache. Reads come from cache; on miss, cache fetches from DB. Write data isn't cached until it's actually read. Good for data written once and read rarely. Write Back Cache (WBC): write to cache only, respond immediately. DB is updated asynchronously later. Fastest write path, but risk of data loss if cache crashes before async sync. Used in high-write apps (Swiggy order status updates) where speed > consistency.",
    whyItMatters:
      "The wrong strategy either makes your cache stale (users see old data) or makes writes a bottleneck (defeats the performance purpose). Matching strategy to access pattern is key.",
    diagramNote:
      "Draw four small flow diagrams side by side: RTC (Read→Cache→if miss→DB→Cache). WTC (Write→Cache+DB simultaneously→confirm). WAC (Write→DB directly; Read→Cache→if miss→DB→Cache). WBC (Write→Cache only→immediate confirm; async arrow from Cache→DB in background with 'may fail' warning).",
    example:
      "Swiggy order status changes rapidly (confirmed → packed → picked up → out for delivery → delivered). They use WBC — write status to cache instantly (user sees fast updates), flush to database asynchronously. Speed matters more than strict consistency here. If cache crashes, the last N status updates might be lost, but the order itself is safe in DB.",
    interviewTip:
      "Match strategy to access pattern: read-heavy with occasional writes → RTC. Writes that must be immediately readable → WTC. Write-then-read-later data → WAC. Very high write throughput with acceptable loss risk → WBC. In an interview, state which you chose and why — don't just say 'I'd use caching'.",
    tags: ["RTC", "WTC", "WAC", "WBC", "Read Through", "Write Through", "Write Back", "Cache Strategy"],
  },
  {
    id: 12,
    section: "Data Layer",
    title: "Cache Eviction Policies",
    tagline: "Which data gets removed when cache is full",
    description:
      "Cache size is limited. When it fills up, something must be removed. Policies: LRU (Least Recently Used) — evict the item not accessed for the longest time. iPhone 11 not searched recently → remove it to make room for iPhone 17 queries. Most common default. MRU (Most Recently Used) — evict the most recently accessed item. Counter-intuitive but useful for streaming — the video segment you just watched won't be needed again. LFU (Least Frequently Used) — evict item accessed fewest total times across all history. Your one-off plant search → evict before gadgets searched daily. Captures long-term popularity. FIFO (First In First Out) — evict oldest-added item regardless of access frequency. Simple, predictable, no overhead. LIFO (Last In First Out) — evict the most recently added item. Useful when older entries are more valuable (historical data, stable reference data).",
    whyItMatters:
      "The wrong eviction policy keeps cold data and evicts hot data — a cache full of stale entries is worse than no cache. LRU is the safe default but each policy fits specific patterns.",
    diagramNote:
      "Draw five diagrams: LRU — a timeline bar, evict the leftmost entry (oldest access time). MRU — same bar, evict the rightmost entry (most recently accessed). LFU — a bar chart of access counts, evict the shortest bar. FIFO — a queue, evict the front item (oldest added, regardless of access). LIFO — a stack, evict the top item (most recently added).",
    example:
      "Redis defaults to LRU. A social feed cache fits LRU perfectly — yesterday's viral post gradually cools and gets evicted. A video streaming buffer fits MRU — segments you've already played won't be replayed. An e-commerce product cache fits LFU — products viewed once during a random browse are less valuable than daily bestsellers.",
    interviewTip:
      "Default to LRU for general-purpose caches. Call out MRU specifically for media streaming buffers (segments already played). Mention LFU when long-term access frequency matters more than recency (recommendation engines, product catalogs). Interviewers appreciate knowing why, not just which.",
    tags: ["LRU", "MRU", "LFU", "FIFO", "LIFO", "Eviction Policy", "Cache"],
  },

  // ─────────────────────────────────────────────
  // SCALING & DISTRIBUTION
  // ─────────────────────────────────────────────
  {
    id: 13,
    section: "Scaling & Distribution",
    title: "Load Balancer",
    tagline: "Routes traffic across servers and monitors health",
    description:
      "A load balancer has two jobs: route requests to the right server, and monitor server health. Routing algorithms: Round Robin (request 1→S1, 2→S2, 3→S3, 4→S1... — equal distribution, ignores server capacity, simple), Geo-Based (route to nearest server by user IP location — reduces latency; breaks when users use VPN), Least Connections (route to server with fewest active connections — good for WebSocket/sticky sessions; ignores server config differences), Least Time (route to server with lowest average response time — best for trading apps / real-time systems; most complex to implement), IP Hash (hash of client IP always routes to same server — helps session affinity; hard to scale since adding servers reshuffles hashes), Weighted Round Robin (servers with more RAM/CPU get proportionally more requests — fixes Round Robin's equal-distribution problem on mixed configs). Health checks: Passive (observe real traffic response times/errors), Active (send synthetic test requests). Parameters: interval (how often to check), timeout (max wait per check), unhealthy threshold (consecutive failures before marking down), healthy threshold (consecutive successes before marking up).",
    whyItMatters:
      "Without a load balancer, adding servers does nothing — clients still only know one IP. The load balancer is the single entry point that makes horizontal scaling visible and usable.",
    diagramNote:
      "Draw: Client → [Load Balancer box] → three arrows to Server 1, Server 2, Server 3. All three servers point down to a shared Database. Add a 'health check loop' icon on the load balancer with arrows to each server labeled 'active ping every 5s'. Mark Server 2 as red/down — show traffic only flowing to S1 and S3. Add a small table on the side: algorithm name → use case.",
    example:
      "AWS ALB routes 10M daily requests across 50 EC2 instances. Weighted Round Robin assigns more traffic to high-memory instances. If a server's health check fails 3 times, it's removed from the pool. Auto Scaling adds servers when average CPU exceeds 70%.",
    interviewTip:
      "For mixed server configurations, use Weighted Round Robin. For low-latency financial apps, use Least Time. Avoid IP Hash for modern stateless services — use Redis for sessions instead so any server can handle any request. Always mention health checks — a load balancer without them is just a router that sends traffic to dead servers.",
    tags: ["Round Robin", "Least Connections", "Least Time", "IP Hash", "Geo-based", "Health Check", "Weighted"],
  },
  {
    id: 14,
    section: "Scaling & Distribution",
    title: "Horizontal & Vertical Scaling",
    tagline: "Two ways to add capacity to your system",
    description:
      "Vertical scaling (scale up): upgrade a single machine's CPU, RAM, or disk. Simple — no code changes needed. Hard limit — you can't add unlimited RAM to one machine. Single point of failure. Good for: databases up to a certain size, services that can't easily be distributed. Horizontal scaling (scale out): add more machines to distribute load. Requires stateless services (session stored in Redis, not in-memory), a load balancer, and distributed data layer. Near-unlimited scale using commodity hardware. No single point of failure. Challenges: distributed system complexity, data consistency across nodes, coordination overhead. The bank analogy: vertical = bigger desk + better tools for the same cashier. Horizontal = adding more cashiers. Both are valid — use vertical first (simpler), then horizontal when vertical hits its ceiling.",
    whyItMatters:
      "Vertical scaling has hard limits and creates a single point of failure. Horizontal scaling is the foundation of every internet-scale system. But it requires stateless service design from the start.",
    diagramNote:
      "Draw two scenarios: Left — 'Vertical': one server box that gets larger (RAM 4GB → 8GB → 16GB) with a ceiling line labeled 'physical limit'. Right — 'Horizontal': one server box that multiplies into three, behind a load balancer, all talking to a shared database. Label the horizontal side: 'stateless services required'.",
    example:
      "Netflix autoscales from 1,000 to 10,000 EC2 instances during peak hours. Each instance is stateless — user session and preferences are stored in ElastiCache (Redis), not in the server's memory. Any instance can handle any user.",
    interviewTip:
      "Design stateless services from day one — it's the prerequisite for horizontal scaling. Store session, cart, and user state in Redis or a database, never in server memory. When discussing scaling, say: 'I'd first exhaust vertical scaling, then move to horizontal once the single-server limit is hit, requiring a load balancer and stateless architecture.'",
    tags: ["Vertical Scaling", "Horizontal Scaling", "Stateless", "Auto Scaling", "Load Balancer", "Elasticity"],
  },
  {
    id: 15,
    section: "Scaling & Distribution",
    title: "Replication",
    tagline: "Copy data across nodes for reliability and read scale",
    description:
      "Replication maintains copies of data on multiple nodes. Three models: Single Leader (all writes → primary/leader → replicated to followers. Async replication: leader responds immediately, followers update in background — faster but potential stale reads. Sync replication: leader waits for all followers to confirm before responding — consistent but slow; impractical for most systems. Standard choice: async. Adding a follower: snapshot primary at time T, copy to new node, then replay all changes since T. Leader failover: detect crash, elect follower with most recent data, reassign other followers to new leader). Multi-Leader (multiple nodes accept writes, replicate to each other. Conflict resolution: last-write-wins by timestamp, higher-ID replica wins, or prompt user like a Git merge conflict). Leaderless / Dynamo-style (write to multiple nodes simultaneously. Quorum: need > N/2 nodes to confirm for write to succeed. Same for reads — quorum prevents stale data being returned).",
    whyItMatters:
      "A single database node is a single point of failure and a read bottleneck. Replication is the foundation of high availability (failover if primary dies) and read scaling (route reads to replicas).",
    diagramNote:
      "Draw three diagrams: Single Leader — Leader box at top, two Follower boxes below with downward arrows labeled 'async replication'. Multi-Leader — two Leader boxes side by side with bidirectional arrows, each with followers below. Leaderless — client writes simultaneously to three node boxes, gets 2/3 acknowledgements (quorum met), third node updates eventually.",
    example:
      "PostgreSQL streaming replication: primary streams WAL (write-ahead log) to standbys. Instagram routes all SELECT queries to read replicas and writes to the primary — 3 replicas = 4× total read throughput. If primary dies, promotion of a replica takes < 30 seconds.",
    interviewTip:
      "State your replication model and why. Async = lower write latency but stale reads possible (fine for social feeds). Sync = strong consistency but higher latency (needed for banking). For leaderless systems (Cassandra), explain the quorum formula: write to W nodes, read from R nodes, W + R > N ensures overlap.",
    tags: ["Single Leader", "Multi-Leader", "Leaderless", "Quorum", "Async", "Sync", "Failover", "WAL"],
  },
  {
    id: 16,
    section: "Scaling & Distribution",
    title: "Partitioning / Sharding",
    tagline: "Split large data across multiple nodes",
    description:
      "When one database can't hold all data or handle write throughput, split it into partitions (shards). Each shard owns a subset. Combined, they hold the full dataset — evenly distributed (even distribution is the key constraint). Methods: Key-Range partitioning (users 1–50K → shard 1, 50K–100K → shard 2 — simple but creates hotspots if traffic concentrates on one range), Hash partitioning (shard = hash(id) % N — more even distribution, but adding shards requires rehashing and data migration), Local Secondary Index (each shard maintains its own indexes for fast filtering within that shard — but queries that span shards require scatter-gather across all shards), Global Secondary Index (one dedicated partition holds all secondary indexes pointing to the shards containing matching data — fast reads, but slower writes since every write updates the global index). Hotspot: one shard gets disproportionate traffic (US shard vs Maldives shard on country-keyed system). Avoid hotspots by choosing shard keys that distribute writes evenly.",
    whyItMatters:
      "When data grows beyond a single machine, you must partition. Sharding is how every database at scale works — Cassandra, DynamoDB, Instagram, YouTube all use it.",
    diagramNote:
      "Draw one large Database box at top → splits with arrows into Partition 1, Partition 2, Partition 3. Label shard key on the split arrow. Show one partition much larger than others labeled 'hotspot — bad!'. For secondary indexes: draw a separate 'Global Index' box pointing to specific partitions for a color query, bypassing the need to scatter-gather all three.",
    example:
      "Cassandra uses consistent hashing — each node owns a range on a hash ring. Adding a new node takes half the range from one existing node, moving only ~1/N of data. Instagram shards users by user_id hash across 50 shards — any user's data lives entirely on one shard for fast lookups.",
    interviewTip:
      "Choose shard keys that distribute writes evenly and avoid cross-shard joins. user_id is usually safe. timestamp is usually a hotspot (all recent writes hit the latest time bucket). State: 'I'd shard by user_id hash because it distributes writes evenly and most queries are per-user — no cross-shard joins needed.'",
    tags: ["Sharding", "Partitioning", "Consistent Hashing", "Hotspot", "Shard Key", "Global Index", "Local Index"],
  },
  {
    id: 17,
    section: "Scaling & Distribution",
    title: "CAP Theorem",
    tagline: "In distributed systems, choose two of three guarantees",
    description:
      "CAP Theorem: a distributed data store can guarantee at most two of three properties simultaneously. Consistency (C): every read returns the most recent write — no stale data. Availability (A): every request receives a non-error response — even if data might be stale. Partition Tolerance (P): system continues operating despite network splits between nodes. Since network partitions happen in any real distributed system, the real choice is always CP vs AP. CA is only possible for single-node systems — once you distribute data, network partitions are inevitable. CP systems (HBase, ZooKeeper): during a partition, block requests rather than return stale data — choose correctness over uptime. AP systems (Cassandra, DynamoDB, CouchDB): during a partition, return possibly stale data rather than error — choose uptime over perfect consistency. Real usage: Instagram (AP — it's OK if you see a post 200ms late). Banking (CP — balance must be correct even if we must wait).",
    whyItMatters:
      "Database choice is fundamentally a CAP choice. Saying 'I'll use Cassandra because it gives AP — eventual consistency is acceptable for social feeds' shows architectural reasoning, not just tool knowledge.",
    diagramNote:
      "Draw a triangle with C, A, P at each corner. Shade CP region (ZooKeeper, HBase) on the C-P side. Shade AP region (Cassandra, CouchDB, DynamoDB) on the A-P side. Label the C-A region 'single node only — not truly distributed'. Draw a network partition between two nodes, with arrows: CP → blocks traffic, AP → serves stale data. Both are valid depending on the use case.",
    example:
      "Payment system: CP. During a network split between two data centers, block the transaction rather than risk processing it twice (double-charge). Social feed: AP. During a split, show posts from 200ms ago rather than show an error page. The financial cost of inconsistency is high for payments; the social cost of momentary staleness is low for feeds.",
    interviewTip:
      "Know that CA does not exist in distributed systems — you can't avoid partitions in a multi-node setup. Real choice is CP vs AP. Frame database decisions: 'For payment processing I need CP because data consistency is non-negotiable. For the activity feed I'd use AP because eventual consistency is acceptable and availability matters more.'",
    tags: ["CAP Theorem", "Consistency", "Availability", "Partition Tolerance", "CP", "AP", "Eventual Consistency"],
  },

  // ─────────────────────────────────────────────
  // RELIABILITY
  // ─────────────────────────────────────────────
  {
    id: 18,
    section: "Reliability",
    title: "Message Queues",
    tagline: "Async communication between services via a broker",
    description:
      "Sync vs Async: Sync = wait for response before proceeding (inventory must decrement before confirming the order). Async = fire and forget (email confirmation, SMS, delivery notification — can happen later). A message queue decouples producers (create work) from consumers (process work) — producers drop messages in, consumers pull and process at their own pace. FIFO patterns: Strict Order (block on failure — impractical, one stuck message blocks everything) vs Unordered (skip failed messages, continue — use Dead Letter Queue for failures). Priority Queue: attach a priority number to messages; high-priority processed first. Pull vs Push: consumer pulls when ready, or queue pushes when a message arrives. Pub/Sub model: one publisher sends to a topic; multiple independent subscribers each consume all messages (one-to-many). Dead Letter Queue (DLQ): messages that fail after N retry attempts go to a separate DLQ — not silently dropped. Poison messages: messages that always fail and would block/exhaust resources — DLQ contains them. Duplicacy: queues must track processed messages to prevent reprocessing the same work twice.",
    whyItMatters:
      "Without queues, a slow email service blocks your entire order flow. Queues let services scale independently, survive each other's failures, and handle traffic spikes by buffering work.",
    diagramNote:
      "Draw: Producer → [Message Queue: envelope icons in a line] → Consumer. Add a side box labeled 'DLQ' connected to the queue with arrow 'failed after 3 retries → parked here'. For Pub/Sub: one Publisher → Topic box → three independent Subscriber boxes, each pulling separately. Add 'Priority' labels on some envelopes in the queue to show priority ordering.",
    example:
      "Amazon order: place order (sync: inventory check, must succeed immediately) → then three async messages pushed to queue: (1) email service sends confirmation, (2) delivery partner notified, (3) analytics updated. If email service is down, the message sits in queue. When it recovers, it processes the backlog — the order is already confirmed.",
    interviewTip:
      "Use message queues when: operations are slow (email, image resize, ML inference), services need to scale independently, work can be retried, or you're decoupling services. Don't use them when: you need immediate acknowledgement, the operation must complete synchronously, or volume is too low to justify the infrastructure cost. Always mention DLQ for failed message handling.",
    tags: ["Pub/Sub", "FIFO", "Priority Queue", "DLQ", "Dead Letter Queue", "Async", "RabbitMQ", "SQS", "Producer", "Consumer"],
  },
  {
    id: 19,
    section: "Reliability",
    title: "Fault Tolerance",
    tagline: "Designing for inevitable failures",
    description:
      "Three fault categories: Hardware Faults — disk full, memory exhausted, server crashes, network cable damaged, power outage, node overheating. Random and largely unpredictable. Solved by redundancy: multiple servers, replicated databases, RAID, UPS. Software Faults — bugs, unhandled exceptions, bad deployments, config mismatch between environments, merge conflict introducing regression, performance regression from N+1 query. Deterministic and reproducible — if you hit it once, you can reproduce it. Solved by: thorough testing, proper exception handling, staged rollouts, environment parity, code review, load testing. Human Faults — wrong config pushed to prod, accidental data delete, quick fix without testing, running a migration on the wrong database. Most unpredictable faults. Solved by: mandatory code review, staging environments, automated safeguards (confirm before delete, dry-run mode), detailed logging and audit trails. Fault tolerance means the system degrades gracefully — any single failure doesn't bring down the whole service.",
    whyItMatters:
      "No system is 100% reliable. Hardware breaks. Deployments go wrong. Engineers make mistakes. A fault-tolerant system handles each failure category with a different strategy — redundancy for hardware, process for humans, testing for software.",
    diagramNote:
      "Draw three columns: Hardware (server/disk/network icons with X marks) → Solution: redundancy, replication, multiple AZs. Software (bug icon, config file with warning) → Solution: testing, staged rollout, error handling. Human (person icon with mistake arrow) → Solution: review process, staging env, audit logs. Below all three: system continues running despite any single column failing.",
    example:
      "AWS designs for hardware failure as the default assumption — every EC2 instance is expected to eventually fail. Auto Scaling Groups automatically replace failed instances. Multi-AZ deployments mean a data center fire doesn't cause downtime. Software failures are caught by canary deployments (route 1% of traffic to new version first).",
    interviewTip:
      "Mention fault tolerance proactively: 'This service needs redundancy — if the primary DB goes down, the replica promotes automatically. I'd also add retry with exponential backoff for transient network failures, and a circuit breaker to stop hammering a failing downstream service.'",
    tags: ["Redundancy", "Resilience", "Hardware Faults", "Software Bugs", "Human Error", "Recovery", "Availability"],
  },
  {
    id: 20,
    section: "Reliability",
    title: "Monitoring & Observability",
    tagline: "Logs, metrics, and percentiles to understand system health",
    description:
      "Monitor two layers — APIs and machines. API monitoring: Throughput (requests/second — alert when approaching server capacity; e.g., alert at 80% of max). Error codes (track 5xx and 4xx error rates — a spike means a broken feature, bad deploy, or attack). Health checks (passive: observe real traffic; active: send synthetic test requests on a schedule). Latency percentiles — never use averages. P50 = 50% of requests complete in under X ms. P90 = 90% complete under X ms. P99 = 99% complete under X ms. If P50 is 50ms but P99 is 8 seconds, 1% of users wait 160× longer — but the average hides this. Machine monitoring: CPU usage (alert at 70–80%), Memory usage (alert at 85–90%), Disk I/O (alert on sustained saturation), Network bandwidth (alert when approaching NIC limits). Set alerts with thresholds before problems hit users, not after. SLOs (Service Level Objectives) formalize the targets: 'P99 latency < 500ms for 99.9% of minutes in a month.'",
    whyItMatters:
      "Averages hide tail latency — where real user pain lives. P99 at 8 seconds means 1 in 100 requests fails badly. Without percentile monitoring, you'd see a fine average and miss it entirely until users start complaining.",
    diagramNote:
      "Draw two dashboards side by side. Left — API Dashboard: a line graph (requests/sec), an error rate % gauge, and a grouped bar chart showing P50 / P90 / P99 latency bars with a threshold line at 500ms. Right — Machine Dashboard: four gauges for CPU %, Memory %, Disk I/O %, Network %. Red alert icons appear when bars cross the threshold.",
    example:
      "P50 = 50ms, P90 = 150ms, P99 = 8 seconds. The average is ~100ms — looks fine. But that P99 trace reveals a DB query with no index running across 100M rows. Add the index; P99 drops to 80ms. Percentile monitoring found a problem averages completely masked.",
    interviewTip:
      "Always say percentiles, never averages, for latency. P99 is the gold standard for user experience — that's the worst case your real users face. Mention SLOs: 'I'd set an SLO of P99 < 500ms and alert with PagerDuty when it's breached for 5 consecutive minutes.' This shows production-grade thinking.",
    tags: ["P99", "P95", "P90", "Percentile", "Latency", "Throughput", "SLO", "Metrics", "Alerting", "Observability"],
  },

  // ─────────────────────────────────────────────
  // CASE STUDY
  // ─────────────────────────────────────────────
  {
    id: 21,
    section: "Case Study",
    title: "Video Streaming Architecture",
    tagline: "How YouTube-style streaming actually works end to end",
    description:
      "A video = image frames + audio. At 30fps, 1 hour = 108,000 individual frames. Naive approach: download the entire 2GB file before playing — high latency, wastes bandwidth if user stops early. Real approach: split video into small segments (e.g., 1 second each), stream via RTMP/RTSP protocol over TCP (TCP maintains segment ordering). Client pulls segments one by one. Adaptive Bitrate Streaming (ABR): pre-encode each segment at multiple resolutions (4K, 1080p, 720p, 480p, 240p). The player monitors available network bandwidth and switches quality in real time — drops from 4K to 480p if bandwidth falls from 300Mbps to 10Mbps, avoiding buffering. Quality switches seamlessly between segments. Architecture pipeline: User uploads → Transformation Service (detects video metadata) → Message Queue → parallel Worker services (one per resolution, encode simultaneously) → Distributed CDN (edge servers near users worldwide) → Client requests segments. Math example: a 20-min 4K video at 50GB splits into 1,200 segments. Combined size across 5 quality levels ≈ 72MB per segment group.",
    whyItMatters:
      "Video streaming is one of the most data-intensive architectures. It touches CDN, message queues, parallel encoding pipelines, and adaptive algorithms simultaneously — a rich system design question that tests multiple concepts at once.",
    diagramNote:
      "Draw a horizontal pipeline: [Upload Server] → [Message Queue] → parallel branches: Worker(4K), Worker(1080p), Worker(720p), Worker(480p) → all → [CDN: US edge + India edge + EU edge] → [Client]. Below the client, draw a network bandwidth gauge that falls mid-video and shows the quality dropping from '4K' to '480p' and recovering back to '1080p'. Label each worker with its resolution and encode time.",
    example:
      "YouTube processes 500 hours of video uploaded every minute. Each video is split, encoded at 6+ quality levels in parallel workers, distributed to edge CDN servers globally, and served to 2 billion users who all get a different quality based on their current connection speed — all automatically.",
    interviewTip:
      "For video streaming questions, hit these points in order: (1) segments not full download, (2) adaptive bitrate based on network bandwidth, (3) CDN for geo-distributed serving, (4) message queue for async encoding pipeline, (5) parallel workers per quality level. Then do quick math: 'A 20-min video at 50GB splits into ~1200 segments; across 5 qualities that's ~72MB per segment group.'",
    tags: ["Video Streaming", "CDN", "Adaptive Bitrate", "RTMP", "RTSP", "Encoding", "Segments", "FFmpeg", "ABR"],
  },

  // ─────────────────────────────────────────────
  // ADVANCED TOPICS
  // ─────────────────────────────────────────────
  {
    id: 22,
    section: "Advanced Topics",
    title: "CDN",
    tagline: "Serves static content from locations close to users",
    description:
      "A Content Delivery Network is a globally distributed network of edge servers that cache static assets (images, JS, CSS, videos) close to users. When a user requests a file, DNS routes them to the nearest edge server (Point of Presence). On cache miss, the edge fetches from the origin and caches for future requests. Modern CDNs (Cloudflare, Fastly, Akamai) also support edge compute for dynamic logic. CDN cache control headers (Cache-Control, ETag) determine how long assets are cached at the edge and when to revalidate. Latency is proportional to physical distance — a user in Tokyo hitting Virginia adds ~200ms. A CDN brings assets to < 10ms from any location.",
    whyItMatters:
      "CDNs offload 80–95% of traffic from origin servers and reduce latency for global users. Without a CDN, every static file request travels to origin — wasteful and slow at scale.",
    diagramNote:
      "Draw: Origin Server (center) → surrounded by edge servers in US, EU, India, Southeast Asia, South America. User in India hits nearby India edge server (fast path). On edge miss, edge fetches from origin (slow path, happens once). Subsequent users in India hit edge cache. Show cache hit ratios on each edge: '95% hit rate'.",
    example:
      "Netflix built Open Connect — their own CDN with appliances inside ISPs. Netflix video bytes never leave the local network. Cache hit rate > 95%. YouTube uses Google's global edge network to serve 1B hours of video daily with < 50ms start time for most users.",
    interviewTip:
      "Mention CDNs for any system with media, high read traffic, or global users. Note the limitation: CDNs only help with cacheable content — dynamic, personalized data must still hit the origin. For static assets: long TTL. For versioned files (bundle.a3f8b.js): infinite TTL since the filename itself changes on redeploy.",
    tags: ["CDN", "Edge", "Latency", "Static Assets", "Cache Control", "Cloudflare", "Fastly"],
  },
  {
    id: 23,
    section: "Advanced Topics",
    title: "Database Indexing",
    tagline: "Makes queries fast by avoiding full table scans",
    description:
      "An index is a data structure (B-tree or hash) maintained alongside a table to enable fast lookups without scanning every row. Without an index on user_id: SELECT * FROM orders WHERE user_id = 123 scans all 100M rows — O(n). With a B-tree index on user_id: O(log n) — milliseconds. Composite indexes cover multiple columns: an index on (user_id, status) serves WHERE user_id = 123 AND status = 'pending' in one lookup. Covering indexes include all columns a query needs — no main table access required. Tradeoffs: indexes speed reads but slow writes (index must be updated on every INSERT/UPDATE/DELETE) and consume disk space. Every write to an indexed table touches the index too.",
    whyItMatters:
      "An unindexed query on a 100M-row table can take minutes. With a proper index, the same query takes milliseconds. Missing indexes are the most common cause of database performance problems at scale.",
    diagramNote:
      "Draw a table on the left (100M rows, scrolling arrow labeled 'O(n) full scan'). On the right, draw a B-tree index: root node → branch nodes → leaf nodes pointing to specific rows. Arrow from leaf → directly to relevant row labeled 'O(log n)'. Below: composite index (user_id, status) as a two-level tree — user_id first, status second within each branch.",
    example:
      "SELECT * FROM orders WHERE user_id = 123 AND status = 'pending' without index: full scan of 100M rows, ~2 minutes. With composite index on (user_id, status): direct lookup, ~1ms. EXPLAIN ANALYZE shows the difference: 'Seq Scan' vs 'Index Scan'.",
    interviewTip:
      "When discussing a query-heavy system, ask: 'What are the access patterns?' Then design indexes around those. Mention EXPLAIN ANALYZE to verify index usage. Warn about index overhead on write-heavy tables. For a system like Twitter with billions of tweets, mention that indexes on tweet_id and user_id are critical but add cost to every tweet write.",
    tags: ["B-tree", "Composite Index", "Covering Index", "Query Optimization", "SQL", "EXPLAIN"],
  },
  {
    id: 24,
    section: "Advanced Topics",
    title: "Rate Limiting",
    tagline: "Prevents API abuse by capping request rates",
    description:
      "Rate limiting caps how many requests a client can make in a time window. Algorithms: Fixed Window (reset counter every minute — simple but allows bursting at window boundaries), Sliding Window Log (track timestamp of each request in a list — precise but memory-heavy), Token Bucket (tokens added at a constant rate; burst allowed up to bucket size; excess requests dropped — most common), Leaky Bucket (requests processed at a fixed rate regardless of arrival rate — smooths traffic). State stored in Redis: atomic INCR + EXPIRE handles counters without race conditions. Apply limits per: IP address, user ID, API key, or endpoint. Return HTTP 429 Too Many Requests with a Retry-After header indicating when to retry.",
    whyItMatters:
      "Without rate limiting, one bad actor (or runaway client) can exhaust server resources and starve legitimate users. Rate limiting protects system stability and enables fair usage.",
    diagramNote:
      "Draw: Client → [Rate Limiter box] → API Server. Inside rate limiter: Redis key 'rate:user:42 = 47' with expiry '13s'. Arrow: if count < 100 → pass through. If count = 100 → return 429 with Retry-After header. Token bucket variant: show a bucket with tokens refilling at 10/sec, max 100 tokens. Each request consumes 1 token. Burst allowed up to 100.",
    example:
      "GitHub API: 5,000 requests/hour per authenticated user. Twitter: 15 timeline requests per 15-minute window. Redis implementation: MULTI; INCR rate:user:42; EXPIRE rate:user:42 60; EXEC — atomic, works across multiple API gateway instances.",
    interviewTip:
      "Token bucket is the most flexible — it allows burst traffic up to the bucket size. Describe Redis storage, the response format (429 + Retry-After), and distributed challenges: with multiple API gateway instances, all must share the same Redis counter. Mention sliding window for strict accuracy at the cost of more memory.",
    tags: ["Token Bucket", "Sliding Window", "Fixed Window", "Redis", "HTTP 429", "Throttling"],
  },
  {
    id: 25,
    section: "Advanced Topics",
    title: "WebSockets",
    tagline: "Persistent bidirectional real-time communication",
    description:
      "WebSockets establish a persistent, full-duplex connection between client and server over a single TCP connection. Unlike HTTP (client requests, server responds, connection closes), WebSockets keep the connection open — the server can push data to clients at any time. Handshake: starts as HTTP with Upgrade: websocket header, then protocol switches. Once connected, either side sends messages at any time. Alternatives: Long Polling (client asks 'anything new?' every few seconds — simple but wasteful). Server-Sent Events / SSE (server pushes to client over HTTP, client cannot send — good for notifications and feeds, simpler than WebSockets). Use SSE when you only need server-to-client push. Use WebSockets when you need bidirectional communication (chat, gaming, collaborative editing).",
    whyItMatters:
      "Polling wastes bandwidth and adds latency. WebSockets enable sub-100ms real-time updates without wasted requests. For chat and live collaboration, polling is simply too slow and too expensive.",
    diagramNote:
      "Draw: Client ↔ Server with a persistent double-headed arrow labeled 'WebSocket connection (open)'. Show messages flowing both ways: Client sends 'user typing', Server sends 'new message from Alice'. Below, compare: HTTP (three separate request-response pairs, connection closes each time) vs WebSocket (one connection, multiple messages). SSE: one-way arrow from Server → Client only.",
    example:
      "Slack uses WebSockets for real-time message delivery. Figma uses them for collaborative design — move a shape and all 10 co-editors see it move in < 50ms. telesco.com quiz channels also use WebSockets to push real-time score updates as students submit answers.",
    interviewTip:
      "Compare WebSockets vs SSE vs long polling when asked about real-time features. Use SSE for server-push-only (live scores, feed updates, notifications). Use WebSockets for bidirectional (chat, gaming, live cursors). For WebSocket scale: sticky sessions at the load balancer or a Redis pub/sub layer to fan out messages across multiple backend instances.",
    tags: ["WebSockets", "Real-time", "SSE", "Long Polling", "Bidirectional", "Full-duplex", "TCP"],
  },
  {
    id: 26,
    section: "Advanced Topics",
    title: "Idempotency",
    tagline: "The same request shouldn't cause duplicate effects",
    description:
      "An idempotent operation produces the same result whether executed once or many times. GET, PUT, and DELETE are naturally idempotent — calling them twice gives the same result as once. POST is not — submitting a payment form twice charges twice. To make POST idempotent: the client sends a unique Idempotency-Key header (UUID) with every request. The server stores the result keyed by this value. If the same key arrives again (network retry after timeout), return the cached result instead of processing again. This is critical because networks are unreliable — clients must retry on timeout, and without idempotency, retries cause double-charges, duplicate orders, and duplicate emails.",
    whyItMatters:
      "Networks are unreliable. Clients retry on timeout. Without idempotency, every retry is a potential duplicate side effect. For payments, this means double-charging. For emails, this means spamming. At-least-once delivery + idempotent consumers = exactly-once semantics.",
    diagramNote:
      "Draw: Client sends POST /payments with Idempotency-Key: abc-123. Server processes → stores result keyed by abc-123 → returns 200. Network fails on the response. Client retries with same key. Server sees abc-123 already processed → returns cached result immediately, no re-processing. Show the key-value store (Redis) holding: 'abc-123 → {charge_id: ch_x, amount: 100, status: success}'.",
    example:
      "Stripe's API accepts an Idempotency-Key header on all charge creation requests. If your server retries a failed HTTP call to Stripe, Stripe returns the original charge object instead of creating a second charge. This makes payment systems safe to retry without risk of double-billing.",
    interviewTip:
      "Bring up idempotency whenever designing payment processing, order placement, or any mutation with real-world consequences. Show the formula: 'At-least-once delivery + idempotent consumers = exactly-once semantics.' Store idempotency keys in Redis with TTL (24 hours is common).",
    tags: ["Idempotency", "Retries", "Payments", "Exactly-Once", "Idempotency-Key", "Stripe"],
  },
  {
    id: 27,
    section: "Advanced Topics",
    title: "Kafka",
    tagline: "High-throughput distributed event streaming",
    description:
      "Kafka is a distributed event streaming platform designed for high throughput and durability. Unlike traditional queues (message deleted after consumption), Kafka retains events in an ordered, immutable log for a configurable retention period (days to forever). Consumers track their own offset — they can replay from any point, multiple independent consumers can read the same data, and time-travel debugging is possible. Topics are partitioned for parallelism: each partition is a separate ordered log, handled by one consumer at a time within a consumer group. Each partition is replicated across brokers for fault tolerance. Kafka handles millions of events per second with millisecond end-to-end latency. Use Kafka over SQS/RabbitMQ when: multiple consumers need the same data, you need replay/audit capability, throughput is very high, or you're doing event sourcing.",
    whyItMatters:
      "At massive scale, traditional queues become bottlenecks. Kafka's log-based architecture enables real-time analytics, event sourcing, CDC (change data capture), and feeding multiple downstream systems from a single event stream without duplication.",
    diagramNote:
      "Draw: Producers on the left → Topic box divided into 3 partitions (each partition is a numbered log: 0, 1, 2, 3...). Three Consumer Group boxes on the right, each with arrows reading from different offsets — Consumer A at offset 100, Consumer B at offset 50 (replaying). Arrow labeled 'Broker replication' connects partition copies on multiple broker boxes.",
    example:
      "LinkedIn (Kafka's creator) processes 7 trillion messages per day — activity tracking, metrics pipeline, recommendation model updates. Uber uses Kafka for real-time trip matching, surge pricing calculation, and driver analytics — all reading from the same stream of trip events independently.",
    interviewTip:
      "Use Kafka when: multiple consumers need the same event stream, you need replay for debugging/reprocessing, throughput is very high (millions/sec), or you're building event sourcing. Consumer groups enable parallel processing within a topic while ensuring each message is handled once per group. Mention that Kafka is overkill for simple task queues — use SQS/RabbitMQ instead.",
    tags: ["Kafka", "Event Streaming", "Log", "Partitions", "Consumer Groups", "Replay", "CDC"],
  },
  {
    id: 28,
    section: "Advanced Topics",
    title: "Circuit Breaker & Retry",
    tagline: "Stop cascading failures and handle transient errors safely",
    description:
      "Circuit Breaker: wraps calls to an external service and monitors for failures. States: Closed (requests pass through normally), Open (after failure threshold exceeded, requests fail immediately without calling the downstream service — gives it time to recover), Half-Open (after a timeout, send a probe request; if it succeeds, close the circuit again; if it fails, re-open). Prevents a slow downstream service from exhausting all threads and taking down unrelated services. Retry with Exponential Backoff: automatically re-attempt failed requests. Without backoff, immediate retries under load create a thundering herd — thousands of clients hammering a recovering service simultaneously. Wait = base × 2^attempt (e.g., 1s, 2s, 4s, 8s). Add jitter (randomness) to desync clients. Only retry transient failures (503, network timeout) — not permanent failures (404, 400). Always pair retry with idempotency.",
    whyItMatters:
      "In microservices, a slow database or downstream API can hold connections, exhaust thread pools, and take down unrelated services. Circuit breakers contain failures. Backoff prevents retry storms. Together they make systems self-healing.",
    diagramNote:
      "Draw: Service A → [Circuit Breaker box: state machine] → Service B. Show three states in the box: 'Closed (normal)' → 'Open (blocked, after 5 failures in 10s)' → 'Half-Open (probe request)' → back to 'Closed'. For Retry+Backoff: a timeline showing attempts: T=0 (fail), T=1s (fail), T=2s (fail), T=4s (success). Each retry waits exponentially longer. Jitter: show retry times slightly varied per client to desync.",
    example:
      "Netflix resilience4j wraps every inter-service call. If the recommendation service fails 50% of requests in 10 seconds, the circuit opens and returns cached recommendations instead of calling a struggling service. AWS SDK retries with exponential backoff + jitter by default — DynamoDB throttled requests get retried after 1s, 2s, 4s delays.",
    interviewTip:
      "Pair circuit breakers with fallbacks: 'If the recommendation service is open, return the user's top 10 most-watched genres as a fallback.' Always pair retry with idempotency — retrying a non-idempotent operation creates duplicate side effects. Mention retry budgets (max 3 retries) to prevent infinite retry loops.",
    tags: ["Circuit Breaker", "Retry", "Exponential Backoff", "Jitter", "Thundering Herd", "Resilience", "Fallback"],
  },
  {
    id: 29,
    section: "Advanced Topics",
    title: "Microservices",
    tagline: "Decompose applications into independent deployable services",
    description:
      "Microservices decompose an application into small services, each owning its data and business logic, deployable independently. Services communicate via APIs (REST/gRPC) or events (Kafka/SQS). Each service can use the best technology for its purpose, be scaled independently, and be deployed without affecting other services. Key patterns: API Gateway (single entry point for clients — handles auth, routing, rate limiting), Service Discovery (services register their address; clients look up dynamically), Service Mesh (Istio — handles inter-service TLS, retries, circuit breaking at infrastructure level). Tradeoffs: distributed system complexity, network latency between services, data consistency across service boundaries, harder debugging (requires distributed tracing). Start with a modular monolith — extract services only when boundaries are clear and scale demands it.",
    whyItMatters:
      "Monoliths become hard to scale and deploy at a certain size — a bug in the payments module forces redeploying the entire app. Microservices let teams move independently and scale only what needs scaling.",
    diagramNote:
      "Draw: Client → [API Gateway] → three service boxes: Auth Service, Order Service, Notification Service. Each service has its own database below it. Between services, bidirectional arrows (sync: gRPC) and event arrows (async: Kafka topic). Add an 'API Gateway' box listing: auth, routing, rate limiting. Note: no shared database between services.",
    example:
      "Netflix has 700+ microservices: separate services for search, recommendations, billing, streaming, and device management. Each team owns their service end-to-end and deploys dozens of times per day without coordinating with other teams.",
    interviewTip:
      "Don't over-engineer early — a well-structured monolith is simpler to operate and debug. Extract services when you have: clear domain boundaries, independent scaling needs, or separate team ownership. Discuss distributed tracing (Jaeger/Zipkin) as essential for debugging in a microservices architecture.",
    tags: ["Microservices", "API Gateway", "Service Mesh", "gRPC", "Domain-Driven Design", "Distributed Tracing"],
  },
];

export const CONCEPT_COUNT = SYSTEM_DESIGN_CONCEPTS.length;
