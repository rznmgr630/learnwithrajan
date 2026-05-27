export interface SystemDesignConcept {
  id: number;
  title: string;
  tagline: string;
  description: string;
  whyItMatters: string;
  example: string;
  interviewTip: string;
  tags: string[];
}

export const SYSTEM_DESIGN_CONCEPTS: SystemDesignConcept[] = [
  {
    id: 1,
    title: "API",
    tagline: "How services communicate",
    description:
      "An API (Application Programming Interface) defines a contract between two software components. REST APIs use HTTP methods (GET, POST, PUT, DELETE) over stateless request/response cycles. Each endpoint represents a resource, and responses are typically JSON. GraphQL and gRPC are common alternatives — GraphQL lets clients request exactly the fields they need, while gRPC uses binary Protobuf for high-performance internal service calls.",
    whyItMatters:
      "Every system you design will have APIs as the boundary between components. API design decisions (versioning, pagination, error codes, rate limits) ripple through the entire architecture.",
    example:
      "Twitter's REST API exposes /tweets, /users, /timelines. Their internal services use gRPC for low-latency calls between the recommendation engine and the feed delivery service.",
    interviewTip:
      "When asked to design a system, immediately clarify the API — what endpoints exist, what do requests/responses look like, and how will clients paginate large result sets.",
    tags: ["REST", "gRPC", "GraphQL", "HTTP"],
  },
  {
    id: 2,
    title: "Load Balancer",
    tagline: "Distributes traffic across servers",
    description:
      "A load balancer sits in front of a pool of servers and routes incoming requests using algorithms like Round Robin (sequential), Least Connections (fewest active), or IP Hash (same client → same server). Layer 4 (transport) load balancers route based on TCP/UDP; Layer 7 (application) can inspect HTTP headers and route by path, cookies, or content type. Health checks automatically remove unhealthy servers from the pool.",
    whyItMatters:
      "No single server can handle millions of requests. Load balancers enable horizontal scaling and eliminate single points of failure. Without one, adding servers doesn't help because traffic can't reach them.",
    example:
      "AWS ALB (Application Load Balancer) routes /api/* to backend servers and /static/* to a CDN origin. NGINX is commonly self-hosted as a reverse proxy and load balancer.",
    interviewTip:
      "Mention sticky sessions when a user's state is stored in memory on a server. Prefer stateless services (session in Redis) so any server can handle any request.",
    tags: ["Horizontal Scaling", "High Availability", "Round Robin", "L4/L7"],
  },
  {
    id: 3,
    title: "Caching",
    tagline: "Stores frequently used data for speed",
    description:
      "Caching stores the result of expensive operations (DB queries, API calls, computations) in fast memory so subsequent requests are served instantly. Cache-aside (lazy loading) checks the cache first; on miss, fetches from DB and populates the cache. Write-through writes to cache and DB together. Write-behind writes to cache first, DB asynchronously. Eviction policies (LRU, LFU, TTL) determine when stale entries are removed.",
    whyItMatters:
      "A DB query that takes 100 ms served from cache takes < 1 ms. Caching reduces database load by orders of magnitude and is often the first optimization that enables scale.",
    example:
      "Redis caches user profile data with a 5-minute TTL. When a tweet goes viral, Twitter caches the tweet object in Memcached so 10M reads don't hammer the database.",
    interviewTip:
      "Always discuss cache invalidation — it's the hard part. Mention TTL, event-driven invalidation, or versioned cache keys. Also address cold start: what happens when the cache is empty after a deploy?",
    tags: ["Redis", "Memcached", "LRU", "TTL", "Cache Invalidation"],
  },
  {
    id: 4,
    title: "CDN",
    tagline: "Serves content from nearby locations",
    description:
      "A Content Delivery Network is a globally distributed network of edge servers that cache static assets (images, JS, CSS, videos) close to users. When a user requests a file, the CDN routes them to the nearest point of presence (PoP). On a cache miss, the edge fetches from the origin server and caches for future requests. Modern CDNs (Cloudflare, Fastly) also support edge compute for dynamic content.",
    whyItMatters:
      "Latency is proportional to distance. A user in Tokyo hitting a server in Virginia adds ~200 ms of network latency. CDNs reduce this to single digits for cached content and offload 80–95% of traffic from origin servers.",
    example:
      "Netflix uses Open Connect, their own CDN with appliances inside ISPs, to serve video. YouTube uses Google's global edge network to stream to 2B+ users.",
    interviewTip:
      "Mention CDNs for any system with media, high read traffic, or global users. Note that CDNs only help with static or cacheable content — dynamic personalized data still hits origin.",
    tags: ["Edge", "Latency", "Static Assets", "Cloudflare", "Fastly"],
  },
  {
    id: 5,
    title: "Database Indexing",
    tagline: "Makes queries faster",
    description:
      "An index is a data structure (typically a B-tree or hash) that the database maintains alongside a table to enable fast lookups without scanning every row. A B-tree index on user_id turns an O(n) scan into O(log n). Composite indexes cover multiple columns (last_name, first_name). Covering indexes include all columns a query needs, avoiding the main table lookup entirely. The tradeoff: indexes speed up reads but slow writes (index must be updated) and consume disk space.",
    whyItMatters:
      "An unindexed query on a 100M-row table can take minutes. The same query with a proper index takes milliseconds. At scale, missing indexes are the most common cause of database performance problems.",
    example:
      "SELECT * FROM orders WHERE user_id = 123 AND status = 'pending' needs a composite index on (user_id, status). Without it, Postgres scans all orders for every user.",
    interviewTip:
      "When discussing a query-heavy system, immediately ask: 'What are the access patterns?' Then design indexes around those patterns. Mention EXPLAIN ANALYZE to verify index usage.",
    tags: ["B-tree", "Composite Index", "Query Optimization", "SQL"],
  },
  {
    id: 6,
    title: "Pagination",
    tagline: "Loads data in small chunks",
    description:
      "Pagination splits large result sets into pages. Offset pagination (LIMIT 20 OFFSET 100) is simple but slow on large datasets — the DB must scan and discard 100 rows. Cursor-based pagination uses a pointer to the last seen item (WHERE id > last_seen_id LIMIT 20), making it O(1) regardless of depth. Keyset pagination is similar. For infinite scroll, cursor-based is the standard approach. Page-based UIs (page 1, 2, 3) often use offset.",
    whyItMatters:
      "Returning all records in a single response is a common anti-pattern that causes OOM errors, slow responses, and wasted bandwidth. Every API that returns lists needs a pagination strategy from day one.",
    example:
      "Twitter's timeline API returns 20 tweets with a next_cursor token. Passing that token to the next request returns the following 20 without any overlap or gaps.",
    interviewTip:
      "Default to cursor-based for feeds and time-ordered data. Use offset only for admin pages with small datasets. Always define a max page size to prevent abuse.",
    tags: ["Cursor", "Offset", "Infinite Scroll", "API Design"],
  },
  {
    id: 7,
    title: "Rate Limiting",
    tagline: "Prevents API abuse",
    description:
      "Rate limiting caps how many requests a client can make in a time window. Algorithms: Fixed Window (reset counter every minute), Sliding Window Log (track timestamps of each request), Token Bucket (tokens refill at a constant rate; burst allowed up to bucket size), Leaky Bucket (requests processed at a fixed rate). Rate limits are stored in Redis with atomic increment operations. Limits are applied per IP, per user, per API key, or per endpoint.",
    whyItMatters:
      "Without rate limiting, a single bad actor (or runaway client) can exhaust server resources, starve legitimate users, and cause cascading failures across the system.",
    example:
      "GitHub API: 5,000 requests/hour per authenticated user. Twitter API: 15 requests per 15-minute window for the timeline endpoint. Redis INCR + EXPIRE implements this in two commands.",
    interviewTip:
      "Describe the algorithm, where state is stored (Redis), and what response to return (HTTP 429 with Retry-After header). Mention distributed rate limiting challenges when you have multiple API gateway instances.",
    tags: ["Token Bucket", "Sliding Window", "Redis", "HTTP 429"],
  },
  {
    id: 8,
    title: "Idempotency",
    tagline: "Same request shouldn't create duplicate effects",
    description:
      "An idempotent operation produces the same result whether executed once or many times. GET, PUT, and DELETE are naturally idempotent. POST is not — submitting a payment form twice charges twice. To make POST idempotent, clients send a unique Idempotency-Key header. The server stores results keyed by this value. If the same key arrives again (retry after network failure), return the cached response instead of processing again.",
    whyItMatters:
      "Networks are unreliable. Clients retry requests on timeout. Without idempotency, retries cause duplicate payments, double-sent emails, or duplicate database records. Critical for any financial or messaging system.",
    example:
      "Stripe's API accepts an Idempotency-Key header on charge creation. If your server retries a failed charge, Stripe returns the original charge result instead of charging the card again.",
    interviewTip:
      "Always bring up idempotency when discussing payment processing, order placement, or any mutation that has real-world consequences. Show you understand that at-least-once delivery + idempotency = exactly-once semantics.",
    tags: ["Retries", "Payments", "Exactly-Once", "HTTP Headers"],
  },
  {
    id: 9,
    title: "Replication",
    tagline: "Copies data across servers",
    description:
      "Replication maintains copies of data on multiple nodes. Single-leader (master-replica): all writes go to the primary, replicas receive changes asynchronously (eventual consistency) or synchronously (strong consistency). Multi-leader: multiple nodes accept writes, conflicts resolved by last-write-wins or application logic. Leaderless (Dynamo-style): clients write to multiple nodes, reads from a quorum. Replication enables read scaling (route reads to replicas) and high availability (failover if primary dies).",
    whyItMatters:
      "A single database node is a single point of failure and a read bottleneck. Replication is the foundation of both high availability and read scalability.",
    example:
      "PostgreSQL streaming replication: primary streams WAL logs to standbys in real time. Read-heavy apps route SELECT queries to replicas, freeing the primary for writes.",
    interviewTip:
      "Distinguish between sync (zero data loss, higher latency) and async replication (potential data loss on failover, lower latency). Discuss replication lag and how it affects read-your-writes consistency.",
    tags: ["Primary-Replica", "WAL", "Failover", "Consistency"],
  },
  {
    id: 10,
    title: "Sharding",
    tagline: "Splits large databases into smaller parts",
    description:
      "Sharding (horizontal partitioning) splits a large dataset across multiple database nodes (shards), each owning a subset of data. Shard keys determine data placement — range-based (user IDs 1–1M on shard 1), hash-based (shard = hash(user_id) % N), or directory-based (lookup table maps key → shard). Each shard can be independently scaled. Challenges: cross-shard joins require scatter-gather, resharding requires data migration, hotspot shards (viral users) need mitigation.",
    whyItMatters:
      "When a single database node can no longer hold all data or handle write throughput, sharding is the solution. It's the approach behind every social network, e-commerce, and SaaS at scale.",
    example:
      "Instagram shards user data by user_id using consistent hashing. Cassandra uses token-based sharding where each node owns a range of the hash ring.",
    interviewTip:
      "Choose shard keys carefully — they must distribute load evenly and avoid hotspots. A shard key of 'user_id' is usually safe; a shard key of 'country' creates hotspots (US has 100× more users than some countries).",
    tags: ["Horizontal Partitioning", "Consistent Hashing", "Hotspot", "NoSQL"],
  },
  {
    id: 11,
    title: "Message Queues",
    tagline: "Async communication between services",
    description:
      "A message queue decouples producers (who create work) from consumers (who process it). Producers push messages to the queue without waiting for processing. Consumers pull and process at their own pace. This enables: buffering traffic spikes, retrying failed jobs, distributing work across workers, and isolating slow operations (email, image processing) from the critical path. At-least-once delivery with idempotent consumers is the standard pattern.",
    whyItMatters:
      "Synchronous service calls create tight coupling — if the downstream service is slow or down, the caller is blocked or fails. Queues make systems resilient, independently scalable, and decoupled.",
    example:
      "After a user uploads a photo, Instagram pushes a 'resize' job to SQS. 10 worker instances pull from the queue and process images in parallel, without blocking the upload API response.",
    interviewTip:
      "Use queues whenever you have a slow operation (email, transcoding, ML inference), a traffic spike risk, or work that can be retried. Mention dead-letter queues for failed messages that exceed retry limits.",
    tags: ["RabbitMQ", "SQS", "Async", "Decoupling", "Dead Letter Queue"],
  },
  {
    id: 12,
    title: "Kafka",
    tagline: "High-throughput event streaming system",
    description:
      "Kafka is a distributed event streaming platform built for high throughput. Unlike traditional queues (message deleted after consumption), Kafka retains events in an ordered, immutable log for a configurable retention period. Consumers track their own offset, enabling replay, multiple independent consumers, and time-travel debugging. Topics are partitioned for parallelism; each partition is replicated across brokers for durability. Kafka handles millions of events per second with millisecond latency.",
    whyItMatters:
      "At massive scale (millions of events/sec), traditional queues become bottlenecks. Kafka's log-based architecture enables real-time analytics, event sourcing, change data capture (CDC), and feeding multiple downstream systems from a single stream.",
    example:
      "LinkedIn (Kafka's creator) uses it to track 7 trillion messages/day for activity tracking, metrics, and recommendations. Uber uses Kafka for real-time trip matching, surge pricing, and driver analytics.",
    interviewTip:
      "Use Kafka when: multiple consumers need the same data, you need replay/audit, throughput is very high, or you're doing event sourcing. Mention consumer groups for parallel processing within a topic.",
    tags: ["Event Streaming", "Log", "Partitions", "Consumer Groups", "CDC"],
  },
  {
    id: 13,
    title: "Microservices",
    tagline: "Break application into independent services",
    description:
      "Microservices architecture decomposes an application into small, independently deployable services, each owning its data and business logic. Services communicate via APIs (REST/gRPC) or events (Kafka). Each service can use the best technology for its purpose, be scaled independently, and be deployed without affecting others. The tradeoffs: distributed systems complexity (network failures, latency), service discovery, distributed tracing, and data consistency across service boundaries.",
    whyItMatters:
      "Monoliths become hard to scale and deploy at a certain size — a bug in the payments module requires redeploying the entire app. Microservices let teams move independently and scale only what needs scaling.",
    example:
      "Netflix has 700+ microservices: one for search, one for recommendations, one for billing, one for streaming. Each team owns their service end-to-end and deploys dozens of times a day.",
    interviewTip:
      "Don't over-engineer early — start with a modular monolith and extract services when you have clear boundaries and scaling needs. Discuss service mesh (Istio), API gateways, and distributed tracing (Jaeger) as part of the ecosystem.",
    tags: ["Service Mesh", "API Gateway", "Domain-Driven Design", "Deployment"],
  },
  {
    id: 14,
    title: "Distributed Locking",
    tagline: "Prevents concurrent conflicts across servers",
    description:
      "When multiple servers need to ensure only one can perform an operation at a time (e.g., cron job, inventory decrement), a distributed lock coordinates access. Redis SETNX (SET if Not eXists) with an expiry implements a simple lock — acquire by setting a key, release by deleting it. Redlock algorithm uses multiple Redis nodes for fault tolerance. ZooKeeper and etcd provide stronger consistency guarantees. Locks must have TTLs to prevent deadlocks if a server crashes.",
    whyItMatters:
      "In a distributed system, race conditions are subtle and dangerous. Without distributed locking, two servers might both think they won an auction, oversell inventory, or run the same scheduled job twice.",
    example:
      "An e-commerce site uses a Redis distributed lock when decrementing inventory: SETNX lock:item:42 server1 PX 5000. Only the server that acquired the lock can decrement.",
    interviewTip:
      "Discuss lock TTL (must be long enough for the operation but short enough to recover from crashes), fencing tokens (prevent stale lock holders from making changes after expiry), and whether you actually need a lock or can use optimistic concurrency instead.",
    tags: ["Redis", "SETNX", "Redlock", "Race Condition", "Fencing Token"],
  },
  {
    id: 15,
    title: "Consistency vs Availability",
    tagline: "Core distributed system trade-off",
    description:
      "In a distributed system, when a network partition occurs, you must choose: Consistency (every read receives the most recent write, or an error) or Availability (every request gets a response, possibly stale). This is the essence of the CAP theorem. Systems like Zookeeper and etcd choose consistency (CP). Systems like Cassandra and DynamoDB choose availability (AP) with eventual consistency. Most real systems tune this per operation — banking favors consistency, social feeds tolerate eventual consistency.",
    whyItMatters:
      "Understanding this trade-off lets you choose the right database and make informed design decisions. Choosing 'strong consistency everywhere' leads to unavailable systems; 'eventual consistency everywhere' leads to subtle bugs.",
    example:
      "When you post a tweet, it's ok if followers see it 200ms later (eventual consistency, AP). When you transfer money, the balance must be immediately correct on all nodes (strong consistency, CP).",
    interviewTip:
      "Frame your database choice around this trade-off. 'I'll use PostgreSQL because transfers require strong consistency' shows more depth than just listing technologies.",
    tags: ["CAP Theorem", "Eventual Consistency", "Strong Consistency", "PACELC"],
  },
  {
    id: 16,
    title: "WebSockets",
    tagline: "Real-time two-way communication",
    description:
      "WebSockets establish a persistent, full-duplex connection between client and server over a single TCP connection. Unlike HTTP (request-response), WebSockets allow the server to push data to clients at any time without the client polling. The handshake starts as HTTP (Upgrade: websocket header), then upgrades to the WebSocket protocol. Long polling and Server-Sent Events (SSE) are simpler alternatives — SSE is server→client only, which covers most use cases.",
    whyItMatters:
      "Polling (client asks 'anything new?' every second) is wasteful and adds latency. WebSockets enable sub-100ms updates for chat, gaming, collaborative editing, and live feeds.",
    example:
      "Slack uses WebSockets for real-time message delivery. Figma uses them for collaborative design — when one user moves a shape, all connected users see it move instantly.",
    interviewTip:
      "Compare WebSockets vs SSE vs long polling. Use SSE for server-push-only scenarios (live scores, notifications). Use WebSockets when you need bidirectional communication (chat, gaming). Mention connection state management at scale (sticky sessions or a pub/sub layer like Redis).",
    tags: ["Real-time", "Full-duplex", "SSE", "Long Polling", "TCP"],
  },
  {
    id: 17,
    title: "Circuit Breaker",
    tagline: "Stops cascading failures",
    description:
      "A circuit breaker wraps calls to an external service and monitors for failures. States: Closed (requests pass through normally), Open (requests immediately fail without calling the service, after failure threshold exceeded), Half-Open (a probe request tests if the service has recovered). This prevents a slow or failing downstream service from consuming all threads/connections in the upstream service, causing cascading failure across the entire system.",
    whyItMatters:
      "In microservices, a slow database or third-party API can hold connections, exhaust thread pools, and take down unrelated services. The circuit breaker pattern contains failures and gives downstream services time to recover.",
    example:
      "Netflix Hystrix (now resilience4j) wraps every inter-service call. If the recommendation service fails 50% of requests in 10 seconds, the circuit opens and returns cached recommendations instead.",
    interviewTip:
      "Pair circuit breakers with fallbacks (return cached data, a default response, or degrade gracefully). Also mention timeouts — without a timeout, a circuit breaker can't detect slow failures.",
    tags: ["Resilience", "Hystrix", "Fallback", "Timeout", "Microservices"],
  },
  {
    id: 18,
    title: "Retry & Backoff",
    tagline: "Handles temporary failures safely",
    description:
      "Retries automatically re-attempt failed requests. Without backoff, immediate retries under load create a thundering herd — thousands of clients simultaneously hammering a recovering service. Exponential backoff: wait = base * 2^attempt (e.g., 1s, 2s, 4s, 8s). Jitter adds randomness to prevent synchronized retries. Max retries cap the total attempts. Retries only make sense for transient failures (network hiccup, 503) — not permanent failures (404, 400).",
    whyItMatters:
      "Without retries, any transient network failure causes user-visible errors. Without backoff, retries make failures worse — the recovering service gets hammered before it can stabilize.",
    example:
      "AWS SDK retries with exponential backoff + jitter by default. DynamoDB throttles at capacity limits and expects clients to back off. Kubernetes restart policies implement backoff for crashing pods.",
    interviewTip:
      "Always pair retry with idempotency — retrying a non-idempotent operation causes duplicate side effects. Mention retry budgets (max 3 retries) and circuit breakers to stop retrying permanently failed services.",
    tags: ["Exponential Backoff", "Jitter", "Thundering Herd", "Resilience"],
  },
  {
    id: 19,
    title: "CAP Theorem",
    tagline: "Trade-off in distributed databases",
    description:
      "CAP states that a distributed data store can provide at most two of three guarantees simultaneously: Consistency (every read returns the most recent write), Availability (every request gets a non-error response), and Partition Tolerance (system continues operating despite network partitions). Since partitions happen in any real distributed system, the real choice is CP vs AP. PACELC extends CAP: even without partitions, there's a trade-off between Latency and Consistency.",
    whyItMatters:
      "CAP frames every database and distributed system design decision. Understanding it prevents naive assumptions that you can have perfect consistency, availability, and fault tolerance simultaneously.",
    example:
      "HBase, Zookeeper → CP (returns error during partition to maintain consistency). Cassandra, CouchDB → AP (returns possibly stale data to maintain availability). Traditional RDBMS → CA (no partition tolerance — not distributed).",
    interviewTip:
      "Interviewers love CAP questions. Know that CA systems don't exist in distributed settings. Go beyond CAP to PACELC — real systems optimize for latency, not just availability, even without partitions.",
    tags: ["Distributed Systems", "Consistency", "Availability", "PACELC"],
  },
  {
    id: 20,
    title: "Horizontal Scaling",
    tagline: "Add more servers to handle load",
    description:
      "Horizontal scaling (scaling out) adds more machines to distribute load, vs vertical scaling (scaling up) which upgrades a single machine's CPU/RAM. Horizontal scaling requires stateless services (session in Redis, not in memory), a load balancer, and databases that support replication/sharding. Advantages: near-unlimited scale, no single point of failure, cost-effective using commodity hardware. Challenges: distributed system complexity, data consistency, and coordination overhead.",
    whyItMatters:
      "Vertical scaling has hard limits (you can't add unlimited RAM to one machine) and creates a single point of failure. Horizontal scaling is the foundation of every internet-scale system.",
    example:
      "Netflix autoscales from 1,000 to 10,000 EC2 instances in minutes during peak hours using AWS Auto Scaling Groups. Each instance is stateless — user session data is in ElastiCache.",
    interviewTip:
      "Design stateless services from the start — it's the prerequisite for horizontal scaling. Store session, cart, and user state externally (Redis, DB). Mention Auto Scaling and how you'd handle database bottlenecks (read replicas, sharding).",
    tags: ["Auto Scaling", "Stateless", "Load Balancer", "Elasticity"],
  },
  {
    id: 21,
    title: "Observability",
    tagline: "Logs, metrics, tracing for debugging",
    description:
      "Observability is the ability to understand the internal state of a system from its external outputs. Three pillars: Logs (structured event records — what happened), Metrics (numeric time-series data — CPU, latency, error rate, QPS), Traces (request flow across services — latency breakdown per service hop). Tools: ELK/Loki for logs, Prometheus + Grafana for metrics, Jaeger/Zipkin for distributed tracing. Alerting on SLOs (Service Level Objectives) closes the loop.",
    whyItMatters:
      "In distributed systems, bugs manifest across multiple services. Without observability, debugging is guesswork. With it, you can find the root cause in minutes by following a trace through the system.",
    example:
      "A slow checkout request is traced: API gateway (2ms) → order service (180ms) → payment service (5ms). The trace shows order service queried the DB without an index. Fix the index; p99 latency drops from 200ms to 8ms.",
    interviewTip:
      "Mention observability as a first-class concern, not an afterthought. Describe how you'd set SLOs ('99.9% of requests < 200ms') and alert when they're breached. Interviewers appreciate candidates who think about debuggability.",
    tags: ["Prometheus", "Grafana", "Jaeger", "ELK", "SLO", "Distributed Tracing"],
  },
];

export const CONCEPT_COUNT = SYSTEM_DESIGN_CONCEPTS.length;
