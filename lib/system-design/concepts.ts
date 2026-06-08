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
      "A system is a group of components working together to achieve a common goal. System design is the process of deciding what those components should be and how they should interact to solve a problem reliably and at scale.\n\nThink of a bank. At first, there's only one cashier serving customers (a single server). When the line gets long, the first step is to make the cashier work faster (optimize the code and algorithms). If that's not enough, you give the cashier better tools, like a cash-counting machine (vertical scaling — adding more CPU or RAM).\n\nWhen customers keep increasing, you open more counters (horizontal scaling). But now each counter has its own vault, which can lead to inconsistent data. To solve this, all counters share a single central vault (a centralized database).\n\nAs the bank grows, customers may crowd around one counter while others sit idle. To distribute traffic evenly, a guard at the entrance directs each customer to the least busy counter (a load balancer).\n\nEach time a new problem appeared, a new system design concept was introduced to solve it. That's the essence of system design: identifying bottlenecks and choosing the right solutions as the system grows.",
    whyItMatters:
      "Anyone can write code that works for 10 users. System design is what makes it work for 10 million at once. Interviews test whether you can evolve a simple design as constraints change — exactly what the bank story demonstrates.",
    diagramNote:
      "Fig. 1.1 — Each problem at the bank introduced a new system design concept. The five-step evolution mirrors how every real system grows.",
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
      "Every system is mainly either data-intensive or compute-intensive.\n\nBefore comparing the two, it helps to understand what a bottleneck is. A bottleneck is the slowest part of a system — the single point that limits overall performance. Think of a highway with 6 lanes that suddenly narrows to 1. No matter how fast cars move on the wide section, everyone slows down at the narrow point. In system design, the bottleneck is where your system gets stuck. Fixing anything else won't help until you fix that one part first.\n\nData-intensive systems spend most of their time storing, retrieving, and moving data. The CPU is usually not the bottleneck — it's idle most of the time, just waiting for data to arrive. Examples include Instagram feeds, WhatsApp messages, banking transactions, and analytics dashboards. Performance is improved through better database design, caching, replication, sharding, indexing, and optimized queries.\n\nCompute-intensive systems spend most of their time performing calculations. The database is usually not the bottleneck — data comes in fine, but the CPU or GPU is always busy crunching numbers. Examples include video rendering, image processing, machine learning training, flight simulators, and cryptography. Performance is improved by adding more CPU or GPU power, using parallel processing, and optimizing algorithms.\n\nA simple way to tell the difference: if the system is slow because it's waiting for data to be stored, fetched, or transferred, it's data-intensive. If the system is slow because it's busy performing calculations, it's compute-intensive.\n\nMany real-world applications contain both. YouTube is data-intensive when serving videos to users, but compute-intensive when generating video recommendations. Understanding which part of the system is the bottleneck helps you choose the right fix — and avoid wasting effort on the wrong layer.",
    whyItMatters:
      "Throwing GPU at a database bottleneck wastes money. Throwing more databases at a CPU bottleneck also wastes money. Identifying the bottleneck type first saves engineering time and cost by pointing you at the right layer to fix.",
    diagramNote:
      "Fig. 2.1 — Data-intensive systems bottleneck at the database; compute-intensive systems bottleneck at the CPU/GPU.",
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
      "Fig. 3.1 — Functional requirements mapped as a sequential user journey, from registration to order tracking.",
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
      "Fig. 4.1 — Non-functional requirements define the quality constraints every architecture component must satisfy.",
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
      "Fig. 5.1 — A DNS lookup walks four servers in sequence; subsequent lookups short-circuit via cache at each layer.",
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
      "Fig. 6.1 — Five API protocols compared by communication style, payload format, and primary use case.",
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
      "Fig. 7.1 — REST API design: standard HTTP methods mapped to resource URLs and their expected behavior.",
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
      "Fig. 8.1 — Relational data modeling: one-to-many (FK column) and many-to-many (junction table) patterns.",
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
      "Fig. 9.1 — The four NoSQL data models, each optimized for a different access pattern.",
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
      "Fig. 10.1 — Cache hit vs. miss paths: a hit returns instantly from memory; a miss fetches from the DB and populates the cache.",
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
      "Fig. 11.1 — Four caching strategies: read-through, write-through, write-around, and write-behind differ in when the DB is updated.",
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
      "Fig. 12.1 — Five cache eviction policies: each defines a different rule for which entry to remove when the cache is full.",
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
      "A load balancer sits in front of servers and does two jobs: route requests and monitor server health. L4 vs L7: Layer 4 (transport layer) load balancers route based on IP address and TCP/UDP port — fast and simple, cannot inspect request content. Layer 7 (application layer) load balancers inspect HTTP headers, URL paths, and cookies — can route /api/* to app servers and /static/* to a CDN origin, enabling smarter routing decisions. AWS NLB is L4; AWS ALB is L7. Routing algorithms: Round Robin (sequential), Geo-Based (nearest server), Least Connections (fewest active), Least Time (fastest response), IP Hash (same client → same server), Weighted Round Robin (proportional by server capacity). Health checks: Passive (observe real traffic) or Active (send synthetic pings). Parameters: interval, timeout, unhealthy/healthy threshold. SPOF risk: the load balancer itself is a single point of failure. Fix with Active-Passive: two load balancers share a virtual IP (VIP). The active one handles all traffic; the passive one monitors it via heartbeat. If active fails, passive takes over the VIP in seconds (failover). Active-Active: both handle traffic simultaneously using DNS or anycast — higher throughput but more complex state sync.",
    whyItMatters:
      "Without a load balancer, adding servers does nothing — clients only know one IP. L7 enables intelligent routing; L4 gives raw speed. The SPOF question is one of the most common load balancer follow-ups in interviews.",
    diagramNote:
      "Fig. 13.1 — Active/passive load balancer failover with VIP handoff; L4 routes by IP/port, L7 routes by request content.",
    example:
      "AWS ALB (L7) routes /api/* to ECS containers and /images/* to S3. AWS NLB (L4) handles raw TCP for game servers needing microsecond latency. Both are deployed across two AZs in active-active mode — if one AZ fails, the other takes all traffic with no manual intervention.",
    interviewTip:
      "Always distinguish L4 vs L7 when asked about load balancers. Say: 'I'd use an L7 load balancer here because I need to route by URL path.' For the SPOF question: 'The load balancer itself would be a SPOF — I'd fix this with an active-passive pair sharing a virtual IP, with automatic failover via heartbeat.' This answer specifically is asked in the Session 1 review of many courses.",
    tags: ["Round Robin", "Least Connections", "L4", "L7", "Health Check", "SPOF", "Active-Passive", "ALB", "NLB"],
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
      "Fig. 14.1 — Vertical scaling grows one machine until it hits a hardware ceiling; horizontal scaling adds stateless machines behind a load balancer.",
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
      "Fig. 15.1 — Three replication models: single-leader (one writer), multi-leader (multiple writers), and leaderless (quorum-based writes).",
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
      "Fig. 16.1 — Database sharding splits data by shard key; a hotspot forms when one partition receives disproportionate traffic.",
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
      "Fig. 17.1 — CAP theorem triangle: since partitions are inevitable in distributed systems, the real trade-off is always CP vs AP.",
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
      "Fig. 18.1 — Message queue (point-to-point with DLQ) vs. pub/sub (one publisher, many independent subscribers).",
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
      "Fig. 19.1 — Three fault categories — hardware, software, and human — each requiring a different class of mitigation.",
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
      "Fig. 20.1 — Observability dashboards: API metrics (latency percentiles, error rate, throughput) alongside machine metrics (CPU, memory, disk, network).",
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
      "Fig. 21.1 — Video pipeline: upload triggers parallel encoding workers per resolution; outputs are distributed via a multi-region CDN with adaptive bitrate switching.",
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
      "Fig. 22.1 — CDN topology: users hit the nearest edge server; on a cache miss the edge fetches once from origin and caches locally for all subsequent requests.",
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
      "Fig. 23.1 — B-tree index turns an O(n) full table scan into an O(log n) lookup; composite indexes add a second level to the tree.",
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
      "Rate limiting caps how many requests a client can make in a time window. Four algorithms: Fixed Window — counter resets every minute. Simple but allows doubling at window boundaries (100 req in last second of minute 1 + 100 req in first second of minute 2 = 200 in 2 seconds). Sliding Window Log — store timestamp of every request in a list; count entries in the last 60 seconds. Precise but memory-heavy. Token Bucket — tokens refill at a constant rate (e.g. 10/sec), max bucket size 100. Each request consumes 1 token. If bucket is empty, reject. Allows bursting up to bucket size. Most common. Leaky Bucket — requests enter a fixed-size queue (the bucket). They are processed at a constant output rate regardless of how fast they arrive (like water leaking from a hole at the bottom). If the bucket is full, new requests are dropped. Key difference from Token Bucket: Token Bucket allows bursts; Leaky Bucket enforces a strictly constant output rate, smoothing all traffic spikes. Good for rate-limiting outbound calls to third-party APIs. State stored in Redis with atomic INCR + EXPIRE. Return HTTP 429 with Retry-After header.",
    whyItMatters:
      "Without rate limiting, one bad actor exhausts server resources and starves legitimate users. Leaky Bucket is specifically important for smoothing bursty traffic before it hits a downstream service that cannot handle spikes.",
    diagramNote:
      "Fig. 24.1 — Token bucket allows controlled bursts by accumulating tokens; leaky bucket enforces a strict constant output rate regardless of incoming traffic.",
    example:
      "Stripe uses Token Bucket for their API — allows short bursts for legitimate use cases like batch operations. An API gateway calling a third-party payment provider uses Leaky Bucket — no matter how many orders arrive simultaneously, calls to the payment API go out at a steady 50/sec to avoid overwhelming the vendor.",
    interviewTip:
      "Walk through Leaky Bucket step by step in interviews: 'Requests enter a queue. A worker drains the queue at a fixed rate — say 10 requests per second. If the queue is full, new requests are dropped or rejected with 429. This smooths any traffic spike into a constant stream.' Use Token Bucket when clients need burst capacity; use Leaky Bucket when downstream systems need protection from bursts.",
    tags: ["Token Bucket", "Leaky Bucket", "Sliding Window", "Fixed Window", "Redis", "HTTP 429", "Throttling"],
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
      "Fig. 25.1 — WebSockets maintain a persistent full-duplex connection; HTTP closes after each response; SSE is server-to-client push only.",
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
      "Fig. 26.1 — Idempotency key flow: the server stores the result of the first request so any retry returns the same response without re-processing.",
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
      "Fig. 27.1 — Kafka topics are partitioned logs; each consumer group tracks its own offset, enabling independent replay and parallel consumption.",
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
      "Fig. 28.1 — Circuit breaker state machine: trips open after repeated failures, probes with half-open, and recovers to closed on success.",
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
      "Fig. 29.1 — Microservices communicate synchronously via gRPC and asynchronously via Kafka; each service owns its own database.",
    example:
      "Netflix has 700+ microservices: separate services for search, recommendations, billing, streaming, and device management. Each team owns their service end-to-end and deploys dozens of times per day without coordinating with other teams.",
    interviewTip:
      "Don't over-engineer early — a well-structured monolith is simpler to operate and debug. Extract services when you have: clear domain boundaries, independent scaling needs, or separate team ownership. Discuss distributed tracing (Jaeger/Zipkin) as essential for debugging in a microservices architecture.",
    tags: ["Microservices", "API Gateway", "Service Mesh", "gRPC", "Domain-Driven Design", "Distributed Tracing"],
  },
  {
    id: 30,
    section: "Advanced Topics",
    title: "Pagination",
    tagline: "Loads large result sets in small chunks",
    description:
      "Pagination splits large result sets into pages so the server never has to load millions of rows at once. Offset pagination (LIMIT 20 OFFSET 100): simple — the DB skips the first 100 rows and returns the next 20. But at large depth (page 5000) the DB still scans and discards all 100,000 preceding rows — O(n) and slow. Cursor-based pagination uses a pointer to the last seen item (WHERE id > last_seen_id LIMIT 20) — O(1) regardless of page depth because the DB jumps directly to the cursor position using an index. For infinite scroll (Twitter, Instagram, TikTok), cursor-based is the standard. For page-number UIs (page 1, 2, 3) with small datasets, offset is fine. Always define a maximum page size to prevent clients requesting 1M rows in one call.",
    whyItMatters:
      "Returning all records in a single response is a common anti-pattern that causes out-of-memory crashes, slow responses, and wasted bandwidth. Every API that returns a list needs a pagination strategy from day one — retrofitting it later is painful.",
    diagramNote:
      "Fig. 30.1 — Offset pagination scans to the page boundary on every request; cursor pagination jumps directly to the last seen ID.",
    example:
      "Twitter's timeline API returns 20 tweets with a next_cursor token. Passing that token to the next call returns the following 20 without overlap or gap — and it's instant regardless of how far back in the timeline you are. GitHub's API uses Link headers with cursor tokens for repository list pagination.",
    interviewTip:
      "Default to cursor-based for feeds and time-ordered data. Use offset only for admin dashboards with small datasets where users need to jump to page N. Always state your max page size. Mention that cursors must be opaque to clients (base64 encoded) so the server can change the internal implementation without breaking clients.",
    tags: ["Cursor", "Offset", "Infinite Scroll", "API Design", "Keyset Pagination"],
  },
  {
    id: 31,
    section: "Advanced Topics",
    title: "Distributed Locking",
    tagline: "Prevents concurrent conflicts across servers",
    description:
      "When multiple servers need to ensure only one can perform an operation at a time (inventory decrement, cron job, auction bid), a distributed lock coordinates access. Redis SETNX (SET if Not eXists) with an expiry implements a simple lock: acquire by setting a key with a TTL, release by deleting it. Only the server that successfully sets the key gets the lock — all others see the key already exists and must wait or retry. Redlock algorithm uses multiple Redis nodes for fault tolerance — acquire from majority of N nodes, so a single Redis node failure doesn't break locking. ZooKeeper and etcd provide stronger consistency guarantees. Locks must always have TTLs to prevent deadlocks if the lock-holding server crashes before releasing. Fencing tokens (monotonically increasing version numbers) prevent stale lock holders from making changes after their lock has expired.",
    whyItMatters:
      "In a distributed system, race conditions are subtle and dangerous. Without distributed locking, two servers can simultaneously think they won an auction, oversell inventory by 1, or run the same daily cron job twice — all silent bugs that only appear under concurrent load.",
    diagramNote:
      "Fig. 31.1 — Redis distributed lock: SETNX grants the lock to the first requester; all others are denied until the key is deleted or its TTL expires.",
    example:
      "An e-commerce site uses Redis distributed lock when decrementing inventory: SETNX lock:item:42 server1 PX 5000. Only the server that acquired the lock can decrement. When it's done, DEL lock:item:42. If server1 crashes mid-operation, the PX 5000 TTL ensures the lock auto-expires in 5 seconds so no deadlock.",
    interviewTip:
      "Discuss three things: (1) TTL — long enough for the operation, short enough to auto-recover from crashes. (2) Fencing tokens — pass an incrementing version to the downstream system so stale lock holders can't write after their lock expired. (3) Alternatives — sometimes optimistic concurrency (compare-and-swap) is simpler than locks and avoids the lock-holder-crash problem entirely.",
    tags: ["Redis", "SETNX", "Redlock", "Race Condition", "Fencing Token", "Deadlock", "TTL"],
  },
  {
    id: 32,
    section: "Advanced Topics",
    title: "Consistency vs Availability",
    tagline: "The core trade-off in every distributed system",
    description:
      "When a network partition occurs in a distributed system, you must choose one of two behaviors. Consistency: every read returns the most recent write, or returns an error — the system refuses to serve stale data. Availability: every request gets a response (possibly stale) — the system never errors out, even if it can't guarantee freshness. This is the practical meaning of CAP theorem. CP systems (ZooKeeper, etcd, HBase): block or error during a partition to preserve consistency. AP systems (Cassandra, DynamoDB, CouchDB): keep serving during a partition, accepting eventual consistency. Most real systems make this decision per feature: banking and inventory require consistency; social feeds, analytics, and notifications tolerate eventual consistency. The key insight: you can tune this per operation, not just per database.",
    whyItMatters:
      "Understanding this trade-off prevents two expensive mistakes: choosing 'strong consistency everywhere' makes your system unavailable under network issues; choosing 'eventual consistency everywhere' causes subtle data correctness bugs in financial flows.",
    diagramNote:
      "Fig. 32.1 — During a network partition, CP systems block to preserve consistency while AP systems serve potentially stale data.",
    example:
      "When you post a tweet, it is fine if followers see it 200ms later — eventual consistency, AP. When you transfer money, the balance must be immediately correct on all nodes — strong consistency, CP. Both happen in the same company (Twitter, then Twitter Payments), choosing differently per feature.",
    interviewTip:
      "Frame every database choice around this trade-off explicitly: 'I'll use PostgreSQL here because transfers require strong consistency — I need CP guarantees.' Or: 'I'll use Cassandra for the activity feed because availability matters more than perfect freshness — AP is acceptable.' This framing shows architectural reasoning over tool preference.",
    tags: ["CAP Theorem", "Eventual Consistency", "Strong Consistency", "PACELC", "CP", "AP"],
  },
  {
    id: 33,
    section: "Advanced Topics",
    title: "Retry & Backoff",
    tagline: "Handles transient failures without creating retry storms",
    description:
      "Retries automatically re-attempt failed requests to recover from transient failures (network hiccup, brief overload, 503). Without backoff, immediate retries under load create a thundering herd — thousands of clients simultaneously hammering a recovering service, preventing it from recovering. Exponential backoff: wait = base × 2^attempt (1s, 2s, 4s, 8s, 16s). Jitter adds randomness to desync clients from retrying at exactly the same moment — without jitter, all clients wake up simultaneously and create spikes. Max retries cap the total attempts to avoid infinite loops. Only retry transient failures (503, 429, network timeout) — never retry permanent failures (400 Bad Request, 404 Not Found) since they won't succeed regardless. Retry budget: limit the total time spent retrying across an entire request chain to prevent cascading delays.",
    whyItMatters:
      "Without retries, any transient network hiccup causes a user-visible error. Without backoff, retries make failures worse — the recovering service gets hammered before it can stabilize. Exponential backoff with jitter is the standard solution used by every major cloud SDK.",
    diagramNote:
      "Fig. 33.1 — Exponential backoff doubles the wait time between retries; jitter staggers client retry times to prevent a synchronized thundering herd.",
    example:
      "AWS SDK retries with exponential backoff + jitter by default — DynamoDB throttled requests get retried after 1s, 2s, 4s with random jitter. Without jitter, a DynamoDB table going over capacity would cause all Lambda functions to retry simultaneously, creating a retry spike that makes recovery worse.",
    interviewTip:
      "Always pair retry with idempotency — retrying a non-idempotent operation creates duplicate side effects (double charge, double email). Mention retry budgets to prevent tail latency from compounding across multiple service calls. Combine with circuit breakers: stop retrying when the circuit is open (downstream is clearly down, not just hiccuping).",
    tags: ["Exponential Backoff", "Jitter", "Thundering Herd", "Retry Budget", "Transient Failure", "Resilience"],
  },
  {
    id: 43,
    section: "Advanced Topics",
    title: "Distributed Unique ID Generation",
    tagline: "Generating unique IDs at scale without a central bottleneck",
    description:
      "Every distributed system needs unique IDs for records, events, and messages. Three main approaches: Auto-increment (simple, sequential, but a single database bottleneck — hard to scale across machines). UUID v4 (128-bit random — globally unique, no coordination needed, but NOT sortable and performs poorly as a clustered index primary key because random insertions fragment the B-tree). Snowflake (Twitter's solution — a 64-bit integer composed of: 41 bits for timestamp in milliseconds since a custom epoch, 10 bits for machine/worker ID, 12 bits for a per-machine sequence number. Total: ~4 million unique IDs per millisecond per machine. Chronologically sortable because the timestamp is the most significant bits — newer IDs are always numerically larger). Snowflake ID structure: [sign 1 bit][timestamp 41 bits][machine ID 10 bits][sequence 12 bits]. Machine ID is assigned at worker startup (from ZooKeeper or a config). Sequence resets to 0 each millisecond. ULID (Universally Unique Lexicographically Sortable Identifier) is a more modern alternative — 128-bit, URL-safe, sortable.",
    whyItMatters:
      "ID generation is a hidden bottleneck in distributed systems. Using a database auto-increment as ID source becomes a write bottleneck at scale. Snowflake IDs are the standard answer — they're fast, unique, sortable, and require no central coordinator after machine IDs are assigned.",
    diagramNote:
      "Fig. 43.1 — Snowflake ID structure: 41-bit timestamp prefix ensures chronological sort order across 4,096 IDs per millisecond per worker.",
    example:
      "Twitter originally used MySQL auto-increment for tweet IDs, which became a write bottleneck at scale. They built Snowflake — a service that generates 64-bit IDs distributed across machines, each machine assigned a unique 10-bit ID. Discord uses a Snowflake variant for message IDs — you can extract the exact creation timestamp of any Discord message from its ID by reading the timestamp bits.",
    interviewTip:
      "When a design needs IDs, say: 'I'd use a Snowflake-style ID — 41-bit timestamp, 10-bit machine ID, 12-bit sequence. This gives me sortable IDs, 4M/ms throughput, and no central coordinator bottleneck.' Walk through the bit breakdown — interviewers specifically ask 'why is it chronologically sortable?' The answer: timestamp occupies the most significant bits, so higher IDs always represent later events.",
    tags: ["Snowflake", "UUID", "Distributed ID", "ULID", "Auto-increment", "Twitter", "Timestamp", "Unique ID"],
  },

  // ─── FOUNDATION GAPS ──────────────────────────────────────────
  {
    id: 34,
    section: "Foundation",
    title: "Latency & Throughput",
    tagline: "The two core performance metrics every engineer must know",
    description:
      "Two of the most important performance metrics in system design are latency and throughput.\n\nLatency is the time it takes to complete a single request, usually measured in milliseconds (ms). Lower latency means users get responses faster.\n\nThroughput is the number of requests a system can handle in a given period, usually measured in requests per second (req/s). Higher throughput means the system can process more work.\n\nAlthough related, they measure different things. A system can have high throughput but high latency, or low latency but limited throughput. A batch-processing system might process 10,000 items per second (high throughput), but each individual item may take 2 seconds to complete (high latency). A real-time API might respond in 50ms (low latency) but handle fewer requests overall unless more servers are added.\n\nAs traffic increases, throughput usually increases as well — up to a point. Eventually the system reaches its capacity limit. Beyond that point, it cannot process requests fast enough, and latency starts increasing rapidly. This sudden spike in latency is often the first sign that a system is becoming overloaded.\n\nWhen measuring performance, don't rely only on average latency. Instead, pay attention to percentiles — especially P99. P50 latency means 50% of requests are faster than that value. P99 latency means 99% of requests are faster than that value. If P50 = 50ms but P99 = 8 seconds, 1 out of every 100 users waits 8 seconds. An average of 100ms would completely hide this problem. That's why engineers monitor tail latency (P95, P99, P99.9) instead of averages.\n\nAs a general rule: CDN edge response under 10ms, cache hit under 1ms, web API response under 200ms, database query under 50ms.\n\nThe key takeaway: throughput tells you how much work a system can do, while latency tells you how fast it responds. A good system balances both and keeps latency low even as traffic grows.",
    whyItMatters:
      "Every performance conversation in interviews uses these two terms. Knowing the difference tells you which problem you're solving: 'system is slow for each user' (latency) vs 'system can't handle enough users at once' (throughput). They require different fixes.",
    diagramNote:
      "Fig. 34.1 — Latency and throughput diverge under load: throughput plateaus at capacity while latency spikes as the queue grows.",
    example:
      "Google Search: P99 latency < 200ms while handling ~99,000 req/s throughput. Redis: < 1ms latency at 1M+ ops/sec throughput because everything stays in RAM. A slow DB query (high latency) doesn't necessarily mean low throughput — if you run 1,000 queries in parallel, throughput stays high even though each individual query is slow.",
    interviewTip:
      "State both metrics when asked about performance targets: 'I'll target P99 latency under 200ms at 10,000 req/s throughput.' Always say P99, never average. When a system is 'slow', ask yourself: is every request slow (latency problem → check DB query, add index, add cache)? Or is it fine for one user but breaks under load (throughput problem → add servers, load balancer, scale horizontally)?",
    tags: ["Latency", "Throughput", "P99", "P50", "Performance", "Capacity", "Tail Latency"],
  },
  {
    id: 35,
    section: "Foundation",
    title: "Capacity Estimation",
    tagline: "Back-of-envelope math that every interview requires",
    description:
      "Before designing any system, the first step is to estimate its scale. These estimates help you choose the right architecture, databases, caches, and infrastructure.\n\nA common approach is to start with Daily Active Users (DAU) and work through this chain: DAU → Requests per Day → Requests per Second (RPS) → Storage → Bandwidth.\n\nThe most important formula to remember is: RPS = Requests per Day ÷ 86,400. There are 86,400 seconds in a day, so dividing total daily requests by that gives the average requests per second. For example, 1 million DAU making 10 requests each = 10 million requests/day ≈ 116 RPS. 100 million DAU making 10 requests each = 1 billion requests/day ≈ 12,000 RPS.\n\nStorage estimation follows the same logic. 1 million users × 1 KB profile data = 1 GB. 1 million photos per day × 200 KB each = 200 GB/day.\n\nTraffic is rarely evenly distributed. Events like Black Friday, product launches, or viral content cause sudden spikes. A common rule of thumb is: Peak Traffic ≈ Average Traffic × 3.\n\nCaching is another key consideration. In most systems, a small portion of the data receives most of the traffic. Following the 80/20 rule, roughly 20% of the data generates 80% of the requests. A reasonable starting estimate for cache size is 20% of your active daily data.\n\nTo estimate servers needed: Servers = Peak RPS ÷ Single Server Capacity. For example, if peak traffic is 15,000 RPS and one server handles 3,000 RPS, you need 5 servers.\n\nIn interviews and real-world discussions, the goal is not perfect accuracy. The goal is to make reasonable assumptions and quickly estimate the order of magnitude. Always state your assumptions clearly, round numbers aggressively, and focus on understanding the scale rather than performing exact calculations.\n\nThe key takeaway: good system design starts with estimating traffic, storage, and growth. Once you know the scale, architectural decisions become much easier.",
    whyItMatters:
      "Capacity estimation drives every architecture decision. '12,000 req/s means one server is not enough — I need a load balancer and at least 6 servers.' Without estimation, your design has no foundation. Interviewers use it to see if you think at production scale.",
    diagramNote:
      "Fig. 35.1 — Back-of-envelope estimation: chain DAU through request rate to server count, then independently estimate daily and yearly storage.",
    example:
      "Twitter estimation: 300M DAU × 20 tweet-reads/day = 6B reads/day = 70,000 read req/s. Writes: 100M tweets/day × 280 bytes = 28GB text/day. Images: 10% of tweets have images × 200KB = 2TB/day image storage. Conclusion: read replicas are essential (70K read req/s), separate object storage for images (2TB/day can't go in SQL), cache the timeline heavily (same tweets read by millions).",
    interviewTip:
      "Use these 5 steps every interview: (1) State DAU. (2) Calculate req/s = DAU × requests per user ÷ 86,400. (3) Storage/day = req/s × data per request × 86,400. (4) Peak = average × 3. (5) Servers = peak req/s ÷ 1,000. Say all math out loud: 'If 1M DAU each make 10 requests, that's 10M per day, divide by 86,400 seconds, roughly 116 req/s, peak of about 350.' Rounding to nice numbers shows comfort with estimation.",
    tags: ["Capacity Estimation", "DAU", "RPS", "Back-of-Envelope", "Storage", "Throughput", "Scalability"],
  },

  // ─── DATA LAYER GAP ───────────────────────────────────────────
  {
    id: 36,
    section: "Data Layer",
    title: "Cache-aside Pattern",
    tagline: "The most common cache pattern — the app controls the cache",
    description:
      "In cache-aside (also called lazy loading), the application manages all cache interactions directly — the cache is not automatically in the data path. Read flow: (1) App checks cache. (2) Cache HIT → return immediately, done. (3) Cache MISS → app queries database. (4) App writes result into cache with a TTL. (5) Return result to caller. Write flow: app writes to database, then deletes (invalidates) the cache key — next read will re-populate. The cache only holds data that has actually been requested, so cold data never fills it. This is different from Read-Through (the cache layer itself fetches from DB on miss — app only talks to cache) and Write-Through (every write goes to cache and DB together). Cache-aside is more flexible: you can cache any computed result, combine multiple DB queries into one cache entry, and invalidate precisely on writes.",
    whyItMatters:
      "Cache-aside is the most widely used caching pattern in production. It's simple, explicit, and puts the app in control. It's what most engineers mean when they say 'add Redis caching.' The curriculum names it specifically because interviewers ask for it by name.",
    diagramNote:
      "Fig. 36.1 — Cache-aside read path: check cache first, fall back to DB on miss, populate cache; write path updates DB and invalidates the cache key.",
    example:
      "A product page: first user requests product #42 — cache miss, app fetches from DB, stores in Redis with 5-min TTL. Next 10,000 users hit Redis — zero DB queries. When product price changes, app updates DB then deletes the Redis key. Next request re-fetches fresh price from DB and re-populates cache. This delete-on-write approach is simpler than update-on-write and avoids stale data.",
    interviewTip:
      "Cache-aside is your default answer when asked about caching strategy. Say: 'I'd use cache-aside — on miss, the application fetches from DB and populates Redis with a TTL. On writes, I'd invalidate the cache key so the next read gets fresh data.' Distinguish it from read-through by saying the app (not the cache infrastructure) is responsible for loading data. This distinction matters for systems where cache and DB can't be directly connected.",
    tags: ["Cache-aside", "Lazy Loading", "Cache Invalidation", "Redis", "Cache Strategy", "Read-Through"],
  },

  // ─── ADVANCED TOPICS GAPS ─────────────────────────────────────
  {
    id: 37,
    section: "Advanced Topics",
    title: "Reverse Proxy",
    tagline: "The gatekeeper that sits in front of your backend",
    description:
      "A reverse proxy is a server that accepts all client requests and forwards them to backend servers, then returns the backend response to the client. The client never talks directly to a backend — it only ever sees the reverse proxy. What it handles: SSL/TLS termination (reverse proxy manages HTTPS so backend servers run plain HTTP internally, no certificate management per server), request routing (send /api/* to app servers, /static/* to object storage), response compression (gzip before sending to client), caching (serve cached responses without hitting backend), rate limiting, and authentication. Difference from load balancer: a load balancer is a specialized reverse proxy focused on distributing traffic across identical servers. A reverse proxy has broader responsibilities. NGINX and HAProxy are the most common reverse proxy tools. In microservices, the API Gateway is the reverse proxy that routes requests to specific services.",
    whyItMatters:
      "A reverse proxy is the single entry point to your system. Without it, backend servers are exposed directly to the internet, each client must know which server to hit, SSL must be handled on every server, and you have no central place for auth, rate limiting, or caching.",
    diagramNote:
      "Fig. 37.1 — Reverse proxy sits in front of servers (SSL termination, routing, rate limiting); forward proxy sits in front of clients (VPN, anonymity).",
    example:
      "NGINX as reverse proxy: all traffic hits NGINX on port 443 (HTTPS). NGINX terminates SSL, strips certificate overhead, and forwards plain HTTP to backend servers on port 8080 internally. Backend servers never touch the public internet. NGINX also caches static assets, applies rate limits per IP, and routes /api/* to Node.js servers while serving /static/* from disk.",
    interviewTip:
      "Distinguish from load balancer in interviews: 'A load balancer is a reverse proxy specialized for traffic distribution. A reverse proxy has additional responsibilities: SSL termination, routing, caching, auth.' In microservices, call it an API Gateway — same concept, named for the microservices context. When designing any system, add a reverse proxy/API Gateway as the first layer clients hit.",
    tags: ["Reverse Proxy", "NGINX", "SSL Termination", "API Gateway", "HAProxy", "Load Balancer"],
  },
  {
    id: 38,
    section: "Advanced Topics",
    title: "Object Storage",
    tagline: "Where files, images, and videos actually live at scale",
    description:
      "Object storage (Amazon S3, Google Cloud Storage, Azure Blob) stores binary data as objects — each object has a key (path/filename), the data (raw bytes), and metadata. Unlike a relational database (structured queries) or a file system (folder hierarchy), object storage is a flat key-value store for binary blobs, massively scalable to trillions of objects. The standard architecture: your application stores the object URL in your database (column: photo_url TEXT) and stores the actual bytes in S3 — never binary blobs in SQL. Access pattern: upload goes App → S3 directly. Reads go through CDN → S3 origin on cache miss. Pre-signed URLs generate temporary access links for private files without making the S3 bucket public — the URL is signed with your credentials and expires after N minutes. Never store video, images, audio, or large documents in a SQL database — it makes the DB huge, slows every query that scans tables, and prevents efficient serving via CDN.",
    whyItMatters:
      "Any system with user-uploaded content (photos, videos, documents, backups) requires object storage. Saying 'store images in the database' in an interview is the most common red flag for senior roles. Object storage is the correct answer whenever binary data appears in a design.",
    diagramNote:
      "Fig. 38.1 — Blob storage pattern: the DB stores only the URL; S3 stores the bytes; the CDN caches bytes at the edge for fast delivery.",
    example:
      "Instagram upload: user posts a photo → upload service generates a unique ID → image bytes go to S3 at path users/{user_id}/{photo_id}.jpg → the S3 URL is stored in PostgreSQL next to post metadata → CloudFront CDN caches the image at 200+ edge locations worldwide. The database row is 200 bytes. The image file is 2MB. Storing the image in the DB would make it 10,000× larger.",
    interviewTip:
      "Whenever any design involves user uploads, immediately say: 'I'd use object storage like S3 for the actual file bytes, store just the URL in the database, and put a CDN in front of S3 for fast global reads.' For private content (medical records, private DMs with attachments), say 'pre-signed URLs that expire after 15 minutes — never make the bucket public.' This answer alone separates candidates who have built real systems from those who haven't.",
    tags: ["S3", "Object Storage", "Blob Storage", "GCS", "CDN", "Pre-signed URL", "Binary Data", "Media Storage"],
  },
  {
    id: 39,
    section: "Advanced Topics",
    title: "Authentication",
    tagline: "Who are you — JWT, OAuth, and sessions explained",
    description:
      "Authentication (authn) = verifying who the user is. Authorization (authz) = what they are allowed to do. Three approaches: Session-based — server stores session data in Redis, client sends a session ID cookie on every request. Stateful: every request hits the session store. Simple for monoliths. JWT (JSON Web Token) — server signs a token with a secret key and sends it to the client. Client sends the token in every request (Authorization: Bearer <token>). Server verifies the signature locally — no database lookup. Stateless, scales horizontally, ideal for microservices. JWT payload contains user_id, roles, and expiry — base64 encoded (not encrypted, so never store secrets in it). Access tokens: short-lived (15 min). Refresh tokens: long-lived (7 days), used to silently get a new access token when it expires. OAuth 2.0 — delegated authorization. 'Login with Google' lets users authenticate via Google; Google gives your app a token proving identity without your app ever seeing the user's Google password.",
    whyItMatters:
      "Every API has authentication. Getting it wrong means any user can access any other user's data. JWT is the standard for stateless, horizontally-scalable auth. OAuth is the standard for third-party identity. These come up in almost every API design question.",
    diagramNote:
      "Fig. 39.1 — JWT authentication: the server signs a self-contained token once; every subsequent request is verified without a database lookup.",
    example:
      "A typical mobile app: login returns a JWT (expires 15 min) + refresh token (expires 7 days). The app stores both. Every API call sends the JWT. After 15 min, the app silently calls POST /auth/refresh with the refresh token to get a new JWT — user never sees a re-login prompt. When the user logs out, the refresh token is deleted from the DB (revoked). The old JWT still works for up to 15 min — that's the trade-off of stateless tokens.",
    interviewTip:
      "In any API design, add auth immediately: 'Every endpoint requires a JWT in the Authorization: Bearer header. The API gateway validates the JWT signature before routing to any service — individual services never handle auth.' Mention the JWT revocation problem: since JWTs are stateless, you can't invalidate them before expiry. Solution: maintain a small token blacklist in Redis. Short TTL (15 min) limits the blast radius.",
    tags: ["JWT", "OAuth", "Authentication", "Authorization", "Session", "Refresh Token", "Bearer Token", "Stateless"],
  },

  // ─── CASE STUDY ADDITIONS ─────────────────────────────────────
  {
    id: 40,
    section: "Case Study",
    title: "URL Shortener Design",
    tagline: "Design bit.ly — hashing, redirection, and scale",
    description:
      "Functional requirements: given a long URL, generate a unique short code (bit.ly/abc123). Given a short code, redirect to the original URL. Optionally: analytics (click count, location). Capacity: 100M shortening requests/day = ~1,200 write req/s. 10B redirections/day = ~116,000 read req/s. Heavily read-skewed. Key design choice — generating the short code: (1) Hash the URL (MD5, take 7 chars) — risk of collision. (2) Base62-encode an auto-incremented ID — 62 characters (a–z, A–Z, 0–9), 7 chars = 62^7 = 3.5 trillion unique codes, no collision. Option 2 is preferred. Redirect: 301 (permanent, browser caches — fewer server calls but no analytics after first visit) vs 302 (temporary, every click hits server — accurate analytics). Database: a simple key-value table: short_code → {long_url, user_id, created_at, click_count}. Read path: short code lookup → cache first → DB on miss → return 301/302 redirect. Cache: 80% of traffic goes to 20% of URLs — LRU cache of popular short codes in Redis.",
    whyItMatters:
      "URL shortener is the most common starter system design question. It tests: unique ID generation, read-heavy scaling, caching, and database choice. The patterns (ID generation, redirect strategy, cache-aside) reuse in dozens of other designs.",
    diagramNote:
      "Fig. 40.1 — URL shortener: write path generates a Base62 key and stores the mapping; read path checks Redis before falling back to the DB.",
    example:
      "bit.ly serves 10B+ clicks/month. They use Base62 encoding with a distributed ID generator (like Snowflake) to avoid collisions. Popular links like a viral tweet's shortened URL might get 10M clicks in an hour — pure cache hits in Redis, the database is rarely touched for those. Analytics are batched: click counts are incremented in Redis and flushed to DB periodically to avoid write storms.",
    interviewTip:
      "Hit these points in order: (1) Clarify requirements — custom aliases? expiry? analytics? (2) Capacity — 1200 write req/s, 116K read req/s, read-heavy. (3) Short code generation — Base62 of auto-incremented ID, 7 chars = 3.5T URLs. (4) Database — single table: short_code PK, long_url, created_at. (5) Cache — Redis with LRU, cache the hot 20%. (6) Redirect — 302 for analytics, 301 for performance. (7) Scale reads with read replicas and cache.",
    tags: ["URL Shortener", "Base62", "Hashing", "Redirect", "Cache-aside", "Read-heavy", "Case Study"],
  },
  {
    id: 41,
    section: "Case Study",
    title: "News Feed Design",
    tagline: "Design Twitter/Instagram feed — fan-out and ranking",
    description:
      "Functional requirements: user sees a personalized feed of posts from people they follow, sorted by time or relevance. Two core approaches for feed generation: Fan-out on write (push model) — when user A posts, immediately write the post ID to all followers' feed lists. Feed reads are instant (pre-computed list). Problem: if a celebrity has 10M followers, one post triggers 10M writes. Fan-out on read (pull model) — when a user opens their feed, fetch recent posts from all followees and merge. No pre-computation, always fresh. Problem: reading from 1,000 followees on every page load is slow. Hybrid (production approach): push for normal users (< 10K followers), pull for celebrities (> 10K followers). Feed storage: per-user feed stored in Redis as a sorted set (score = timestamp), containing post IDs (not full post data). Post content fetched separately by ID. Database: posts in PostgreSQL, follow relationships in a graph or SQL table, full post content in a post store.",
    whyItMatters:
      "News feed is one of the five canonical system design questions. It tests fan-out strategies, the tradeoff between read and write amplification, caching, and real-time delivery. The push-vs-pull pattern appears in notifications, activity streams, and recommendation feeds.",
    diagramNote:
      "Fig. 41.1 — News feed fan-out: push pre-writes to followers' caches (fast reads, expensive writes); pull reads at request time (always fresh, slow). Hybrid merges both for celebrity accounts.",
    example:
      "Twitter uses a hybrid approach: when you tweet, your post is pushed to the Redis feed cache of your followers instantly (if they have < 10K followers). When a celebrity (10M followers) tweets, their posts are NOT pushed — instead, when you open your timeline, Twitter pulls the celebrity's recent tweets and merges them with your pre-computed feed in real time. This keeps write fanout manageable.",
    interviewTip:
      "Start with requirements: 'Does the feed need to be real-time? Can it be slightly stale?' Then state the tradeoff clearly: 'Fan-out on write gives fast reads but expensive writes — problem for celebrities. Fan-out on read gives fresh data but slow reads at scale. I'd use hybrid: push for < 10K followers, pull for celebrities.' Store only post IDs in the feed cache, not full content — content fetched by ID separately for storage efficiency.",
    tags: ["News Feed", "Fan-out", "Push Model", "Pull Model", "Redis", "Timeline", "Celebrity Problem", "Case Study"],
  },
  {
    id: 42,
    section: "Case Study",
    title: "Messaging App Design",
    tagline: "Design WhatsApp — real-time delivery, storage, and receipts",
    description:
      "Functional requirements: send a message to a user, receive messages in real-time, delivery receipts (sent / delivered / read), group chats, offline message handling. Real-time delivery: each client maintains a persistent WebSocket connection to a chat server. When sender sends a message → chat server stores it in DB → delivers to recipient via their WebSocket connection. If recipient is offline, message is stored and pushed when they reconnect via push notification (APNs/FCM). Message storage: Cassandra is ideal — high write throughput, time-series data, scales horizontally. Schema: (conversation_id, message_id, sender_id, content, timestamp, status). message_id uses a time-sortable unique ID (Snowflake) so messages are stored in chronological order. Group messages: sender → message service → fan-out to all group members' active connections + store for offline members. Media: images/videos go to object storage (S3), message stores the S3 URL. End-to-end encryption: keys are stored on devices only, server stores only ciphertext.",
    whyItMatters:
      "Messaging app design is one of the most common senior-level interview questions. It tests WebSocket connection management at scale, offline message queuing, database choice for high-write time-series data, and real-time fan-out for groups.",
    diagramNote:
      "Fig. 42.1 — Chat message flow: online recipients receive via WebSocket; offline recipients get a push notification and fetch on next open.",
    example:
      "WhatsApp handles 2 billion users with roughly 100 billion messages/day. They use Erlang for chat servers (designed for massive concurrent connections), Mnesia/custom storage for message queues, and store media in object storage. The three delivery receipts (single grey tick = sent to server, double grey tick = delivered to device, double blue tick = read by recipient) are implemented via acknowledgement messages sent back through the WebSocket channel.",
    interviewTip:
      "Cover these five areas: (1) Real-time: WebSocket connections, each server handles 50K connections, users route to same server via consistent hashing on user_id. (2) Storage: Cassandra for messages (high write, time-series), partitioned by conversation_id. (3) Offline: store messages in DB, push notification to wake up client. (4) Groups: fan-out to all members, cap group size to limit fan-out cost. (5) Media: S3 for files, store URL in message. The delivery receipt flow is a common follow-up — trace the ACK messages explicitly.",
    tags: ["Messaging", "WhatsApp", "WebSockets", "Cassandra", "Real-time", "Fan-out", "Offline Queue", "Case Study"],
  },
  {
    id: 44,
    section: "Case Study",
    title: "Web Crawler Design",
    tagline: "Design a Google-scale web crawler — queues, deduplication, and politeness",
    description:
      "A web crawler systematically downloads and indexes web pages. Core components: URL Frontier (priority queue of URLs to visit — breadth-first for general crawling, priority-weighted for important pages), Fetcher (downloads HTML from URLs), Link Extractor / Parser (pulls all links from downloaded HTML), Deduplicator (prevents re-crawling the same URL — use a Bloom filter for fast membership checks, or a hash set of seen URL fingerprints), Content Store (saves crawled HTML for indexing). Key challenges: Deduplication — the same page can be reached from thousands of links. Normalize URLs (lowercase, remove trailing slash, sort query params) before hashing. Use a Bloom filter (space-efficient probabilistic structure) for fast near-duplicate detection. Politeness — don't hammer one server. Respect robots.txt. Rate-limit crawls per domain using a per-domain queue and delay timer. Scale — distribute crawl workers; partition URL frontier by domain hash so each worker owns a set of domains. DNS caching — crawlers cache DNS results to avoid a lookup per URL.",
    whyItMatters:
      "Web crawler design tests queue management, deduplication, distributed architecture, and politeness policies — skills that apply to any large-scale data ingestion system, not just crawlers.",
    diagramNote:
      "Fig. 44.1 — Web crawler loop: the frontier feeds fetchers; parsed links are deduplicated via Bloom filter before re-entering the frontier.",
    example:
      "Googlebot crawls billions of pages. It uses a distributed URL frontier sharded by domain, respects crawl-delay in robots.txt, caches DNS lookups per domain for efficiency, and uses a distributed content-addressable hash to detect near-duplicate pages (e.g., a page with and without www). Crawl budget is allocated per domain — important sites are crawled daily, low-quality sites monthly.",
    interviewTip:
      "Hit four points: (1) URL Frontier — priority queue, not just FIFO. Rank by PageRank or last-modified header. (2) Deduplication — Bloom filter for URL seen-check, MD5 hash of content for duplicate page detection. (3) Politeness — per-domain rate limiting, robots.txt, crawl-delay header. (4) Scale — partition frontier by domain hash, each worker owns a shard. The deduplication strategy is the most common deep-dive question.",
    tags: ["Web Crawler", "Bloom Filter", "Deduplication", "URL Frontier", "robots.txt", "Politeness", "Case Study"],
  },
  {
    id: 45,
    section: "Case Study",
    title: "Notification System Design",
    tagline: "Design push, email, and SMS notifications at scale",
    description:
      "A notification system delivers messages across multiple channels: push notifications (iOS via APNs, Android via FCM), email (SMTP / SendGrid), and SMS (Twilio). Core architecture: Notification Service (API endpoint: POST /notify) → Message Queue → Channel Workers (one per channel type). This decoupling ensures a slow email provider doesn't block push notifications. User preferences: a settings table lets users opt out per channel or notification type — check this before sending. Deduplication: assign each notification an idempotency key. Workers check this key before sending — retry-safe, no duplicate emails. High-volume handling: batch notifications (send digest instead of 100 individual emails), rate-limit per user (max 3 push/hour), and throttle bursts through the queue. Delivery tracking: store notification status (queued → sending → delivered / failed) in a status table. Retry failed notifications with exponential backoff. Real-time in-app alerts: use WebSockets or SSE — when a notification is created, push the badge count update instantly to connected clients.",
    whyItMatters:
      "Notification systems appear in almost every design — social apps, e-commerce, SaaS. The architecture pattern (API → queue → per-channel workers) is reusable for any async multi-provider delivery system.",
    diagramNote:
      "Fig. 45.1 — Notification pipeline: a queue decouples ingestion from delivery workers for push, email, and SMS; failed deliveries land in a DLQ.",
    example:
      "When you like someone's Instagram post, a notification is created: Notification Service publishes to a queue → Push Worker calls APNs with the device token → the like notification appears on the recipient's phone. If the user has push disabled in preferences, the worker skips the APNs call. Instagram sends billions of push notifications per day across iOS and Android simultaneously using this fan-out pattern.",
    interviewTip:
      "Structure the answer around: (1) Channels — push (APNs/FCM), email, SMS. (2) Queue per channel — so slow providers don't block fast ones. (3) User preferences — always check opt-out before sending. (4) Deduplication — idempotency key per notification prevents duplicate sends on retry. (5) Rate limiting — max N notifications per user per hour. The interviewer often asks: 'What if APNs is down?' Answer: messages sit in queue, retry with backoff, DLQ after N failures.",
    tags: ["Notifications", "Push Notifications", "APNs", "FCM", "Email", "SMS", "Fan-out", "Idempotency", "Case Study"],
  },
  {
    id: 46,
    section: "Foundation",
    title: "System Design Interview Framework",
    tagline: "The 4-step structure that turns knowledge into a passing interview",
    description:
      "A system design interview is 45 minutes of structured problem-solving. Without a framework, candidates jump to drawing boxes before understanding the problem — the #1 mistake. The 4-step framework: Step 1 — Understand the Problem (5–10 min): Ask clarifying questions before drawing anything. 'Who are the users? What scale — 1M or 100M DAU? Which features are in scope?' List functional requirements (what it does) and non-functional requirements (scale, latency target, availability). Step 2 — High-Level Design (10–15 min): Draw the core components — clients, API, servers, database, cache. Show the happy path for 1–2 key features. Don't over-engineer yet. Step 3 — Deep Dive (15–20 min): Pick the hardest bottleneck and go deep. 'The database will be the bottleneck at this scale — I'd add read replicas and shard by user_id.' Cover caching strategy, DB choice, failure handling. Step 4 — Wrap Up (5 min): State trade-offs. 'This design favors availability over consistency.' Mention failure modes. Suggest what you'd improve with more time.",
    whyItMatters:
      "Interviewers don't grade on whether you design the perfect system — they grade on whether you think like a senior engineer. The framework shows structured thinking, asking the right questions, and knowing where to go deep vs. stay high-level.",
    diagramNote:
      "Fig. 46.1 — System design interview timeline: four phases with common mistakes to avoid at each stage.",
    example:
      "Given 'Design WhatsApp': Step 1 — ask about scale (2B users), features (text/media/groups), latency target (<1s delivery). Step 2 — draw: client → WebSocket server → message DB → push notification service. Step 3 — deep dive on message storage: 'At 100B messages/day, SQL won't scale — I'd use Cassandra partitioned by conversation_id.' Step 4 — trade-off: 'This design delivers at-least-once — duplicates are possible, but handled by message deduplication on the client.'",
    interviewTip:
      "Practice saying 'Before I start drawing, let me clarify a few things' — this single sentence signals seniority. Never assume scale. Never assume features. Ask: users, scale, read/write ratio, latency requirements. Then restate: 'So I'm designing for 10M DAU, read-heavy, with < 200ms latency for the feed.' This confirmation prevents 30 minutes of work in the wrong direction.",
    tags: ["Interview Framework", "System Design", "Requirements", "High-level Design", "Trade-offs", "Bottlenecks"],
  },
];

export const CONCEPT_COUNT = SYSTEM_DESIGN_CONCEPTS.length;
