import type { SDiagramConfig } from "@/components/learn/SdDiagram";

/** Keyed by concept id (1-29) */
export const SYSTEM_DESIGN_DIAGRAMS: Record<number, SDiagramConfig> = {
  // ── 1. What is System Design ──────────────────────────────────
  1: {
    nodes: [
      { id: "users", label: "Users", shape: "rounded", color: "green" },
      { id: "lb",    label: "Load Balancer", shape: "diamond", color: "accent" },
      { id: "s1",    label: "Server 1" },
      { id: "s2",    label: "Server 2" },
      { id: "cache", label: "Cache (Redis)", color: "orange" },
      { id: "db",    label: "Database", shape: "db", color: "accent" },
    ],
    edges: [
      { from: "users", to: "lb" },
      { from: "lb",    to: "s1" },
      { from: "lb",    to: "s2" },
      { from: "s1",    to: "cache" },
      { from: "s2",    to: "cache" },
      { from: "cache", to: "db" },
    ],
    rows: [["users"], ["lb"], ["s1", "s2"], ["cache"], ["db"]],
  },

  // ── 2. Data vs Compute Intensive ──────────────────────────────
  2: {
    nodes: [
      { id: "di",      label: "Data Intensive",     color: "accent" },
      { id: "ci",      label: "Compute Intensive",  color: "orange" },
      { id: "di_b",    label: "DB bottleneck",      sub: "moving data is slow",  color: "red" },
      { id: "ci_b",    label: "CPU/GPU bottleneck", sub: "calculation is slow",  color: "red" },
      { id: "di_fix",  label: "Fix: Cache + Shard", sub: "replication",          color: "green" },
      { id: "ci_fix",  label: "Fix: More GPU",      sub: "parallel workers",     color: "green" },
    ],
    edges: [
      { from: "di",   to: "di_b" },
      { from: "ci",   to: "ci_b" },
      { from: "di_b", to: "di_fix" },
      { from: "ci_b", to: "ci_fix" },
    ],
    rows: [["di", "ci"], ["di_b", "ci_b"], ["di_fix", "ci_fix"]],
  },

  // ── 3. Functional Requirements ────────────────────────────────
  3: {
    nodes: [
      { id: "u",      label: "User",            shape: "rounded", color: "green" },
      { id: "auth",   label: "Register / Login" },
      { id: "browse", label: "Browse + Search" },
      { id: "cart",   label: "Cart + Coupon",   color: "orange" },
      { id: "order",  label: "Place Order",     color: "accent" },
      { id: "track",  label: "Track Delivery",  color: "green" },
    ],
    edges: [
      { from: "u",      to: "auth" },
      { from: "auth",   to: "browse" },
      { from: "browse", to: "cart" },
      { from: "cart",   to: "order" },
      { from: "order",  to: "track" },
    ],
    rows: [["u"], ["auth"], ["browse"], ["cart"], ["order"], ["track"]],
  },

  // ── 4. Non-Functional Requirements ───────────────────────────
  4: {
    nodes: [
      { id: "sys",   label: "System",        shape: "diamond", color: "accent" },
      { id: "scale", label: "Scalability",   sub: "handle 10× traffic" },
      { id: "avail", label: "Availability",  sub: "99.9% uptime SLA" },
      { id: "perf",  label: "Performance",   sub: "P99 < 200ms",        color: "orange" },
      { id: "sec",   label: "Security",      sub: "auth + encryption" },
      { id: "obs",   label: "Observability", sub: "logs, metrics, traces" },
    ],
    edges: [
      { from: "sys", to: "scale" },
      { from: "sys", to: "avail" },
      { from: "sys", to: "perf" },
      { from: "sys", to: "sec" },
      { from: "sys", to: "obs" },
    ],
    rows: [["sys"], ["scale", "avail", "perf", "sec", "obs"]],
  },

  // ── 5. DNS ────────────────────────────────────────────────────
  5: {
    nodes: [
      { id: "b",    label: "Browser",          shape: "rounded", color: "green" },
      { id: "r",    label: "DNS Resolver",     sub: "at your ISP" },
      { id: "root", label: "1. Root Server",   sub: "A–M, 13 groups" },
      { id: "tld",  label: "2. TLD Server",    sub: ".com handler" },
      { id: "auth", label: "3. Authoritative", sub: "has the real IP",   color: "accent" },
      { id: "conn", label: "Connect to IP!",   shape: "rounded", color: "green" },
    ],
    edges: [
      { from: "b",    to: "r",    label: "telesco.com?" },
      { from: "r",    to: "root", label: "step 1" },
      { from: "root", to: "tld",  label: "step 2" },
      { from: "tld",  to: "auth", label: "step 3" },
      { from: "auth", to: "conn", label: "IP returned" },
    ],
    rows: [["b"], ["r"], ["root"], ["tld"], ["auth"], ["conn"]],
  },

  // ── 6. API Types ──────────────────────────────────────────────
  6: {
    nodes: [
      { id: "api",  label: "API",           shape: "diamond", color: "accent" },
      { id: "rest", label: "REST",          sub: "JSON over HTTP" },
      { id: "soap", label: "SOAP",          sub: "XML legacy",    color: "muted" },
      { id: "gql",  label: "GraphQL",       sub: "one endpoint" },
      { id: "grpc", label: "gRPC",          sub: "binary protobuf", color: "orange" },
      { id: "ws",   label: "WebSockets",    sub: "real-time push",  color: "green" },
    ],
    edges: [
      { from: "api", to: "rest" },
      { from: "api", to: "soap" },
      { from: "api", to: "gql" },
      { from: "api", to: "grpc" },
      { from: "api", to: "ws" },
    ],
    rows: [["api"], ["rest", "soap", "gql", "grpc", "ws"]],
  },

  // ── 7. REST APIs in Depth ─────────────────────────────────────
  7: {
    nodes: [
      { id: "client", label: "Client",          shape: "rounded", color: "green" },
      { id: "req",    label: "HTTP Request",    sub: "method + URL + body" },
      { id: "server", label: "Server" },
      { id: "ok",     label: "200 / 201 / 204", sub: "success",       color: "green" },
      { id: "cerr",   label: "400 / 401 / 403 / 404", sub: "client error",  color: "orange" },
      { id: "serr",   label: "500",             sub: "server error",  color: "red" },
    ],
    edges: [
      { from: "client", to: "req" },
      { from: "req",    to: "server" },
      { from: "server", to: "ok" },
      { from: "server", to: "cerr" },
      { from: "server", to: "serr" },
    ],
    rows: [["client"], ["req"], ["server"], ["ok", "cerr", "serr"]],
  },

  // ── 8. SQL Databases ──────────────────────────────────────────
  8: {
    nodes: [
      { id: "users",    label: "users",           sub: "id PK, name, email",     shape: "db", color: "accent" },
      { id: "posts",    label: "posts",           sub: "id, content, author_id", shape: "db" },
      { id: "students", label: "students",        sub: "id PK, name",            shape: "db" },
      { id: "junction", label: "students_courses", sub: "student_id FK, course_id FK", shape: "db", color: "orange" },
      { id: "courses",  label: "courses",         sub: "id PK, title",           shape: "db" },
    ],
    edges: [
      { from: "users",    to: "posts",    label: "one → many" },
      { from: "students", to: "junction", label: "many ↔ many" },
      { from: "courses",  to: "junction", label: "many ↔ many" },
    ],
    rows: [["users", "posts"], ["students", "junction", "courses"]],
  },

  // ── 9. NoSQL Databases ────────────────────────────────────────
  9: {
    nodes: [
      { id: "nosql", label: "NoSQL",        shape: "diamond", color: "accent" },
      { id: "kv",    label: "Key-Value",    sub: "Redis, DynamoDB",  color: "green" },
      { id: "col",   label: "Columnar",     sub: "Cassandra, BigQuery" },
      { id: "graph", label: "Graph DB",     sub: "nodes + edges",     color: "orange" },
      { id: "doc",   label: "Document DB",  sub: "MongoDB, CouchDB" },
    ],
    edges: [
      { from: "nosql", to: "kv" },
      { from: "nosql", to: "col" },
      { from: "nosql", to: "graph" },
      { from: "nosql", to: "doc" },
    ],
    rows: [["nosql"], ["kv", "col", "graph", "doc"]],
  },

  // ── 10. Caching ───────────────────────────────────────────────
  10: {
    nodes: [
      { id: "req",   label: "Request",     shape: "rounded", color: "green" },
      { id: "cache", label: "Cache",       sub: "Redis in memory",  color: "orange" },
      { id: "hit",   label: "Cache HIT",   sub: "< 1ms, done!",     color: "green" },
      { id: "miss",  label: "Cache MISS",  sub: "go to database",   color: "red" },
      { id: "db",    label: "Database",    shape: "db",             color: "accent" },
      { id: "store", label: "Store in Cache", sub: "for next request" },
    ],
    edges: [
      { from: "req",   to: "cache" },
      { from: "cache", to: "hit",   label: "found" },
      { from: "cache", to: "miss",  label: "not found" },
      { from: "miss",  to: "db" },
      { from: "db",    to: "store" },
    ],
    rows: [["req"], ["cache"], ["hit", "miss"], ["db"], ["store"]],
  },

  // ── 11. Cache Read/Write Strategies ──────────────────────────
  11: {
    nodes: [
      { id: "strat", label: "Cache Strategy", shape: "diamond", color: "accent" },
      { id: "rtc",   label: "Read Through",   sub: "lazy load on miss" },
      { id: "wtc",   label: "Write Through",  sub: "sync write to cache+DB", color: "green" },
      { id: "wac",   label: "Write Around",   sub: "skip cache on write" },
      { id: "wbc",   label: "Write Back",     sub: "cache first, DB async",  color: "orange" },
      { id: "speed", label: "Fastest writes", shape: "rounded",  color: "green" },
      { id: "fresh", label: "Always fresh",   shape: "rounded",  color: "green" },
    ],
    edges: [
      { from: "strat", to: "rtc" },
      { from: "strat", to: "wtc" },
      { from: "strat", to: "wac" },
      { from: "strat", to: "wbc" },
      { from: "wtc",   to: "fresh" },
      { from: "wbc",   to: "speed" },
    ],
    rows: [["strat"], ["rtc", "wtc", "wac", "wbc"], ["fresh", "speed"]],
  },

  // ── 12. Cache Eviction Policies ───────────────────────────────
  12: {
    nodes: [
      { id: "full",  label: "Cache Full!",  shape: "diamond", color: "red" },
      { id: "lru",   label: "LRU",          sub: "least recently used",   color: "green" },
      { id: "mru",   label: "MRU",          sub: "most recently used" },
      { id: "lfu",   label: "LFU",          sub: "least frequently used" },
      { id: "fifo",  label: "FIFO",         sub: "oldest added first" },
      { id: "lifo",  label: "LIFO",         sub: "newest added first" },
    ],
    edges: [
      { from: "full", to: "lru" },
      { from: "full", to: "mru" },
      { from: "full", to: "lfu" },
      { from: "full", to: "fifo" },
      { from: "full", to: "lifo" },
    ],
    rows: [["full"], ["lru", "mru", "lfu", "fifo", "lifo"]],
  },

  // ── 13. Load Balancer ─────────────────────────────────────────
  13: {
    nodes: [
      { id: "client", label: "Client",       shape: "rounded", color: "green" },
      { id: "lb",     label: "Load Balancer", shape: "diamond", color: "accent" },
      { id: "s1",     label: "Server 1" },
      { id: "s2",     label: "Server 2" },
      { id: "s3",     label: "Server 3" },
      { id: "db",     label: "Database",     shape: "db",      color: "accent" },
    ],
    edges: [
      { from: "client", to: "lb" },
      { from: "lb", to: "s1" },
      { from: "lb", to: "s2" },
      { from: "lb", to: "s3" },
      { from: "s1", to: "db" },
      { from: "s2", to: "db" },
      { from: "s3", to: "db" },
    ],
    rows: [["client"], ["lb"], ["s1", "s2", "s3"], ["db"]],
  },

  // ── 14. Horizontal & Vertical Scaling ────────────────────────
  14: {
    nodes: [
      { id: "v",         label: "Vertical Scale",   sub: "add RAM/CPU to 1 server",  color: "orange" },
      { id: "h",         label: "Horizontal Scale", sub: "add more servers",          color: "accent" },
      { id: "vlimit",    label: "Physical Limit!",  sub: "can't grow forever",        color: "red" },
      { id: "hscale",    label: "Near Unlimited",   sub: "commodity hardware",        color: "green" },
      { id: "lb",        label: "Load Balancer",    shape: "diamond" },
      { id: "stateless", label: "Must be Stateless", sub: "session in Redis not RAM", color: "orange" },
    ],
    edges: [
      { from: "v",      to: "vlimit" },
      { from: "h",      to: "hscale" },
      { from: "hscale", to: "lb" },
      { from: "lb",     to: "stateless" },
    ],
    rows: [["v", "h"], ["vlimit", "hscale"], ["lb"], ["stateless"]],
  },

  // ── 15. Replication ───────────────────────────────────────────
  15: {
    nodes: [
      { id: "writes",  label: "All Writes",     shape: "rounded" },
      { id: "leader",  label: "Leader / Primary", color: "accent" },
      { id: "f1",      label: "Follower 1",     sub: "async replica" },
      { id: "f2",      label: "Follower 2",     sub: "async replica" },
      { id: "reads",   label: "Reads go here",  shape: "rounded", color: "green" },
    ],
    edges: [
      { from: "writes", to: "leader" },
      { from: "leader", to: "f1",    label: "async replication" },
      { from: "leader", to: "f2",    label: "async replication" },
      { from: "f1",     to: "reads" },
      { from: "f2",     to: "reads" },
    ],
    rows: [["writes"], ["leader"], ["f1", "f2"], ["reads"]],
  },

  // ── 16. Partitioning / Sharding ───────────────────────────────
  16: {
    nodes: [
      { id: "db",   label: "Full Dataset",    sub: "100M users",     shape: "db", color: "accent" },
      { id: "key",  label: "Shard Key",       sub: "hash(user_id) % N",           color: "orange" },
      { id: "p1",   label: "Shard 1",         sub: "user 1–33M",     shape: "db", color: "green" },
      { id: "p2",   label: "Shard 2",         sub: "user 33–66M",    shape: "db", color: "green" },
      { id: "p3",   label: "Shard 3",         sub: "user 66–100M",   shape: "db", color: "green" },
      { id: "hot",  label: "Avoid Hotspots!", sub: "uneven key → one shard overloaded", color: "red" },
    ],
    edges: [
      { from: "db",  to: "key" },
      { from: "key", to: "p1" },
      { from: "key", to: "p2" },
      { from: "key", to: "p3" },
      { from: "p1",  to: "hot", dashed: true },
    ],
    rows: [["db"], ["key"], ["p1", "p2", "p3"], ["hot"]],
  },

  // ── 17. CAP Theorem ───────────────────────────────────────────
  17: {
    nodes: [
      { id: "cap",  label: "Distributed DB",  shape: "diamond", color: "accent" },
      { id: "c",    label: "Consistency",     sub: "latest data always" },
      { id: "a",    label: "Availability",    sub: "always responds" },
      { id: "p",    label: "Partition Tolerance", sub: "survives network split" },
      { id: "cp",   label: "CP",              sub: "ZooKeeper, HBase", color: "orange" },
      { id: "ap",   label: "AP",              sub: "Cassandra, DynamoDB", color: "green" },
      { id: "ca",   label: "CA",              sub: "single node only",  color: "red" },
    ],
    edges: [
      { from: "cap", to: "c" },
      { from: "cap", to: "a" },
      { from: "cap", to: "p" },
      { from: "c",   to: "cp" },
      { from: "p",   to: "cp" },
      { from: "a",   to: "ap" },
      { from: "p",   to: "ap" },
      { from: "c",   to: "ca" },
      { from: "a",   to: "ca" },
    ],
    rows: [["cap"], ["c", "a", "p"], ["cp", "ap", "ca"]],
  },

  // ── 18. Message Queues ────────────────────────────────────────
  18: {
    nodes: [
      { id: "p1",  label: "Producer 1",     sub: "Order Service",  shape: "rounded", color: "green" },
      { id: "p2",  label: "Producer 2",     sub: "Payment Service", shape: "rounded", color: "green" },
      { id: "q",   label: "Message Queue",  color: "accent" },
      { id: "c1",  label: "Consumer: Email", sub: "processes async" },
      { id: "c2",  label: "Consumer: SMS",   sub: "processes async" },
      { id: "dlq", label: "Dead Letter Q",   sub: "failed after 3 retries", color: "red" },
    ],
    edges: [
      { from: "p1", to: "q" },
      { from: "p2", to: "q" },
      { from: "q",  to: "c1" },
      { from: "q",  to: "c2" },
      { from: "q",  to: "dlq", label: "failed msgs", dashed: true },
    ],
    rows: [["p1", "p2"], ["q"], ["c1", "c2"], ["dlq"]],
  },

  // ── 19. Fault Tolerance ───────────────────────────────────────
  19: {
    nodes: [
      { id: "fault",  label: "System Faults",    shape: "diamond", color: "red" },
      { id: "hw",     label: "Hardware",         sub: "server crash, disk full" },
      { id: "sw",     label: "Software",         sub: "bugs, bad deploys" },
      { id: "hu",     label: "Human",            sub: "wrong config, mistakes" },
      { id: "hwfix",  label: "Redundancy",       sub: "replicas + multi-AZ",    color: "green" },
      { id: "swfix",  label: "Testing + Rollout", sub: "canary, staged",        color: "green" },
      { id: "hufix",  label: "Review + Staging", sub: "audit logs, safeguards", color: "green" },
    ],
    edges: [
      { from: "fault", to: "hw" },
      { from: "fault", to: "sw" },
      { from: "fault", to: "hu" },
      { from: "hw",    to: "hwfix" },
      { from: "sw",    to: "swfix" },
      { from: "hu",    to: "hufix" },
    ],
    rows: [["fault"], ["hw", "sw", "hu"], ["hwfix", "swfix", "hufix"]],
  },

  // ── 20. Monitoring & Observability ───────────────────────────
  20: {
    nodes: [
      { id: "monitor",    label: "Monitoring",     shape: "diamond", color: "accent" },
      { id: "api",        label: "API Layer" },
      { id: "machine",    label: "Machine Layer" },
      { id: "throughput", label: "Throughput",     sub: "req/s" },
      { id: "errors",     label: "Error Rate",     sub: "5xx + 4xx",  color: "red" },
      { id: "p99",        label: "P50/P90/P99",    sub: "not averages!", color: "orange" },
      { id: "cpu",        label: "CPU + Memory",   sub: "alert at 80%" },
      { id: "disk",       label: "Disk + Network", sub: "alert on saturation" },
    ],
    edges: [
      { from: "monitor",    to: "api" },
      { from: "monitor",    to: "machine" },
      { from: "api",        to: "throughput" },
      { from: "api",        to: "errors" },
      { from: "api",        to: "p99" },
      { from: "machine",    to: "cpu" },
      { from: "machine",    to: "disk" },
    ],
    rows: [["monitor"], ["api", "machine"], ["throughput", "errors", "p99", "cpu", "disk"]],
  },

  // ── 21. Video Streaming Architecture ─────────────────────────
  21: {
    nodes: [
      { id: "upload",    label: "Upload",        shape: "rounded", color: "green" },
      { id: "transform", label: "Transform Service" },
      { id: "queue",     label: "Message Queue", color: "accent" },
      { id: "w4k",       label: "Worker 4K" },
      { id: "w1080",     label: "Worker 1080p" },
      { id: "w720",      label: "Worker 720p" },
      { id: "w480",      label: "Worker 480p" },
      { id: "cdn",       label: "CDN Edges",     sub: "US, India, EU…", color: "orange" },
      { id: "client",    label: "Client (ABR)",  sub: "adaptive quality", shape: "rounded", color: "green" },
    ],
    edges: [
      { from: "upload",    to: "transform" },
      { from: "transform", to: "queue" },
      { from: "queue",     to: "w4k" },
      { from: "queue",     to: "w1080" },
      { from: "queue",     to: "w720" },
      { from: "queue",     to: "w480" },
      { from: "w4k",       to: "cdn" },
      { from: "w1080",     to: "cdn" },
      { from: "w720",      to: "cdn" },
      { from: "w480",      to: "cdn" },
      { from: "cdn",       to: "client" },
    ],
    rows: [["upload"], ["transform"], ["queue"], ["w4k", "w1080", "w720", "w480"], ["cdn"], ["client"]],
  },

  // ── 22. CDN ───────────────────────────────────────────────────
  22: {
    nodes: [
      { id: "origin",   label: "Origin Server" },
      { id: "us",       label: "US Edge",     sub: "New York",    color: "accent" },
      { id: "eu",       label: "EU Edge",     sub: "London",      color: "accent" },
      { id: "in",       label: "India Edge",  sub: "Mumbai",      color: "accent" },
      { id: "user_us",  label: "User in US",  shape: "rounded",   color: "green" },
      { id: "user_in",  label: "User in India", shape: "rounded", color: "green" },
    ],
    edges: [
      { from: "origin",  to: "us" },
      { from: "origin",  to: "eu" },
      { from: "origin",  to: "in" },
      { from: "user_us", to: "us",  label: "nearby, fast" },
      { from: "user_in", to: "in",  label: "nearby, fast" },
    ],
    rows: [["origin"], ["us", "eu", "in"], ["user_us", "user_in"]],
  },

  // ── 23. Database Indexing ─────────────────────────────────────
  23: {
    nodes: [
      { id: "query",   label: "Query",          sub: "WHERE user_id = 123",  shape: "rounded" },
      { id: "noidx",   label: "No Index",       color: "red" },
      { id: "hasidx",  label: "B-tree Index",   color: "green" },
      { id: "scan",    label: "Full Scan",       sub: "100M rows — O(n) 2 min", color: "red" },
      { id: "lookup",  label: "Tree Lookup",     sub: "3 steps — O(log n) 1ms", color: "green" },
    ],
    edges: [
      { from: "query",  to: "noidx" },
      { from: "query",  to: "hasidx" },
      { from: "noidx",  to: "scan" },
      { from: "hasidx", to: "lookup" },
    ],
    rows: [["query"], ["noidx", "hasidx"], ["scan", "lookup"]],
  },

  // ── 24. Rate Limiting ─────────────────────────────────────────
  24: {
    nodes: [
      { id: "req",    label: "Incoming Request",    shape: "rounded", color: "green" },
      { id: "bucket", label: "Token Bucket",        sub: "tokens refill constantly", color: "orange" },
      { id: "check",  label: "Has tokens?",         shape: "diamond" },
      { id: "pass",   label: "Pass Through",        sub: "consume 1 token",         color: "green" },
      { id: "block",  label: "429 Too Many",        sub: "Retry-After header",      color: "red" },
      { id: "redis",  label: "Redis Counter",       sub: "INCR + EXPIRE",  shape: "db" },
    ],
    edges: [
      { from: "req",    to: "bucket" },
      { from: "bucket", to: "check" },
      { from: "check",  to: "pass",  label: "yes" },
      { from: "check",  to: "block", label: "no" },
      { from: "bucket", to: "redis", dashed: true },
    ],
    rows: [["req"], ["bucket"], ["check"], ["pass", "block"], ["redis"]],
  },

  // ── 25. WebSockets ────────────────────────────────────────────
  25: {
    nodes: [
      { id: "http_c",  label: "Client",          shape: "rounded" },
      { id: "http_s",  label: "Server",          sub: "HTTP: new connection each time", color: "muted" },
      { id: "ws_c",    label: "Client",          shape: "rounded", color: "green" },
      { id: "ws_s",    label: "Server",          sub: "WebSocket: one persistent channel", color: "accent" },
      { id: "push",    label: "Server pushes anytime", shape: "rounded", color: "green" },
    ],
    edges: [
      { from: "http_c", to: "http_s", label: "request → response → closed" },
      { from: "ws_c",   to: "ws_s",   label: "open connection" },
      { from: "ws_s",   to: "push" },
    ],
    rows: [["http_c", "http_s"], ["ws_c", "ws_s"], ["push"]],
  },

  // ── 26. Idempotency ───────────────────────────────────────────
  26: {
    nodes: [
      { id: "client",  label: "Client",             shape: "rounded", color: "green" },
      { id: "req",     label: "POST + Key: abc-123", color: "accent" },
      { id: "server",  label: "Server" },
      { id: "check",   label: "Key seen before?",    shape: "diamond" },
      { id: "process", label: "Process Payment",     color: "orange" },
      { id: "cached",  label: "Return Cached Result", sub: "no double charge!", color: "green" },
      { id: "store",   label: "Store result by key", shape: "db" },
    ],
    edges: [
      { from: "client",  to: "req" },
      { from: "req",     to: "server" },
      { from: "server",  to: "check" },
      { from: "check",   to: "process", label: "no: first time" },
      { from: "check",   to: "cached",  label: "yes: retry" },
      { from: "process", to: "store" },
    ],
    rows: [["client"], ["req"], ["server"], ["check"], ["process", "cached"], ["store"]],
  },

  // ── 27. Kafka ─────────────────────────────────────────────────
  27: {
    nodes: [
      { id: "p1",   label: "Producer 1",     shape: "rounded" },
      { id: "p2",   label: "Producer 2",     shape: "rounded" },
      { id: "topic", label: "Kafka Topic",   color: "accent" },
      { id: "par0",  label: "Partition 0",   sub: "ordered log" },
      { id: "par1",  label: "Partition 1",   sub: "ordered log" },
      { id: "par2",  label: "Partition 2",   sub: "ordered log" },
      { id: "cg1",   label: "Consumer A",    sub: "reads offset 100" },
      { id: "cg2",   label: "Consumer B",    sub: "replay offset 0",  color: "orange" },
    ],
    edges: [
      { from: "p1",   to: "topic" },
      { from: "p2",   to: "topic" },
      { from: "topic", to: "par0" },
      { from: "topic", to: "par1" },
      { from: "topic", to: "par2" },
      { from: "par0",  to: "cg1" },
      { from: "par1",  to: "cg1" },
      { from: "par2",  to: "cg2" },
    ],
    rows: [["p1", "p2"], ["topic"], ["par0", "par1", "par2"], ["cg1", "cg2"]],
  },

  // ── 28. Circuit Breaker & Retry ───────────────────────────────
  28: {
    nodes: [
      { id: "req",    label: "Request",          shape: "rounded" },
      { id: "normal", label: "Closed (Normal)",  sub: "pass through",      color: "green" },
      { id: "fail5",  label: "5 Failures!",      color: "red" },
      { id: "open",   label: "Open (Blocked)",   sub: "no calls, 30s wait",  color: "red" },
      { id: "half",   label: "Half-Open (Probe)", sub: "send one test request", color: "orange" },
      { id: "fb",     label: "Fallback Response", sub: "cached data returned",  color: "orange" },
    ],
    edges: [
      { from: "req",    to: "normal" },
      { from: "normal", to: "fail5" },
      { from: "fail5",  to: "open" },
      { from: "open",   to: "fb" },
      { from: "open",   to: "half" },
      { from: "half",   to: "normal", label: "probe ok",   dashed: true },
    ],
    rows: [["req"], ["normal"], ["fail5"], ["open"], ["fb", "half"], ["normal"]],
  },

  // ── 29. Microservices ─────────────────────────────────────────
  29: {
    nodes: [
      { id: "client", label: "Client",              shape: "rounded", color: "green" },
      { id: "gw",     label: "API Gateway",         sub: "auth, routing, rate limit", color: "accent" },
      { id: "auth",   label: "Auth Service" },
      { id: "orders", label: "Order Service" },
      { id: "notify", label: "Notify Service" },
      { id: "db_a",   label: "Auth DB",             shape: "db" },
      { id: "db_o",   label: "Order DB",            shape: "db" },
      { id: "mq",     label: "Message Queue",       color: "orange" },
    ],
    edges: [
      { from: "client", to: "gw" },
      { from: "gw",     to: "auth" },
      { from: "gw",     to: "orders" },
      { from: "gw",     to: "notify" },
      { from: "auth",   to: "db_a" },
      { from: "orders", to: "db_o" },
      { from: "orders", to: "mq",   label: "async event" },
      { from: "mq",     to: "notify" },
    ],
    rows: [["client"], ["gw"], ["auth", "orders", "notify"], ["db_a", "db_o", "mq"]],
  },
};
