import type { RoadmapDayDetail } from "./challenge-data";

export const DAY_12_DETAIL = {
  overview: [
    "When a single database server cannot handle your read throughput, the first scaling lever is read replicas — copies of the primary that serve reads, offloading the primary for writes only. CQRS (Command Query Responsibility Segregation) takes this idea to the architecture level: separate models for writes and reads let each be optimised independently.",
    "Day 12 covers replica topology, replication lag mechanics, the read-replica routing pattern, CQRS as an architectural pattern, and event sourcing — the persistence model that pairs naturally with CQRS.",
  ],
  sections: [
    {
      title: "Primary-replica replication",
      blocks: [
        {
          type: "diagram",
          id: "primary-replica",
        },
        {
          type: "table",
          headers: ["Concept", "Detail"],
          rows: [
            [
              "WAL shipping (PostgreSQL streaming replication)",
              "Primary streams WAL records to standbys in real time. Standbys replay WAL to maintain a byte-for-byte copy.",
            ],
            [
              "Synchronous replication",
              "Primary waits for at least one standby to confirm WAL write before acknowledging the commit to the client. Zero data loss on primary failure; higher write latency.",
            ],
            [
              "Asynchronous replication (default)",
              "Primary ACKs commit without waiting for standbys. Low write latency; replica lag is possible — recently committed rows may not yet be visible on replicas.",
            ],
            [
              "Replication lag",
              "The delay between a write on the primary and its visibility on a replica. Measured via pg_stat_replication.write_lag / replay_lag. Spikes under heavy write load.",
            ],
            [
              "Cascade replication",
              "Replica B streams from Replica A rather than the primary — reduces load on the primary in large fleets.",
            ],
          ],
        },
        {
          type: "code",
          title: "Route reads to replica, writes to primary (Node.js / Knex)",
          code: `import Knex from "knex";

const primary = Knex({ client: "pg", connection: process.env.DATABASE_PRIMARY_URL });
const replica = Knex({ client: "pg", connection: process.env.DATABASE_REPLICA_URL });

// Writes always go to primary
async function createPost(data: CreatePostInput) {
  return primary("posts").insert(data).returning("*");
}

// Reads go to replica — may be slightly stale (replication lag)
async function listPosts(userId: number) {
  return replica("posts").where({ user_id: userId }).orderBy("created_at", "desc");
}

// After a write that must be read back immediately — use primary
async function updateAndReturn(id: number, patch: Partial<Post>) {
  const [updated] = await primary("posts").where({ id }).update(patch).returning("*");
  return updated; // do NOT read from replica — lag would return old data
}`,
        },
      ],
    },
    {
      title: "Replication lag — causes and handling",
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            "Read-your-own-writes: after a user writes, route their next reads to the primary (or wait for replica to catch up) to avoid showing stale data to the author.",
            "Monotonic reads: use session affinity — route a user to the same replica so they never see data go backwards.",
            "Lag monitoring: alert if replica lag exceeds your SLO (e.g. > 5 seconds). AWS RDS CloudWatch: ReplicaLag metric. PostgreSQL: pg_stat_replication.",
            "High-write bursts: a sudden spike in writes creates a queue on the replica's apply thread. Scale writes horizontally (sharding) if this is chronic.",
          ],
        },
        {
          type: "code",
          title: "Detect lag before routing a sensitive read",
          code: `async function readWithLagCheck<T>(
  query: () => Promise<T>,
  maxLagSeconds = 5
): Promise<T> {
  const [{ lag }] = await replica.raw<{ lag: number }[]>(
    "SELECT EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp())) AS lag"
  );
  if (lag > maxLagSeconds) {
    // Fall back to primary for this read
    return primaryQuery();
  }
  return query();
}`,
        },
      ],
    },
    {
      title: "CQRS — Command Query Responsibility Segregation",
      blocks: [
        {
          type: "diagram",
          id: "cqrs-sketch",
        },
        {
          type: "paragraph",
          text: "CQRS separates the write model (commands: validate, mutate, enforce invariants) from the read model (queries: optimised projections for specific views). Each model can be implemented with different storage, schema, and scaling strategy. Commands go to a normalised OLTP database; queries go to denormalised read stores tuned for specific views.",
        },
        {
          type: "table",
          headers: ["Side", "Responsibility", "Typical storage"],
          rows: [
            [
              "Command (write)",
              "Validate business rules, mutate state, emit domain events",
              "PostgreSQL (normalised, transactional)",
            ],
            [
              "Query (read)",
              "Return pre-computed, denormalised projections for specific UI views",
              "PostgreSQL read replica, Elasticsearch, Redis, or a separate read DB",
            ],
          ],
        },
        {
          type: "code",
          title: "CQRS routing — Express example",
          code: `// Command handler — validates + writes to primary
router.post("/posts", async (req, res) => {
  const cmd = CreatePostCommand.parse(req.body);
  const post = await postCommandService.create(cmd, req.user);
  await eventBus.publish("post.created", { id: post.id, ...cmd });
  res.status(201).json({ id: post.id });
});

// Query handler — reads from optimised read store
router.get("/posts", async (req, res) => {
  const filters = PostListQuery.parse(req.query);
  const results = await postReadService.list(filters); // hits Elasticsearch or read replica
  res.json(results);
});`,
        },
      ],
    },
    {
      title: "Event sourcing — persisting state as events",
      blocks: [
        {
          type: "paragraph",
          text: "Event sourcing stores every state change as an immutable event rather than the current state. The current state is derived by replaying all events. This pairs naturally with CQRS: commands append events; read-model projectors consume events to build query-optimised views.",
        },
        {
          type: "code",
          title: "Event-sourced order aggregate",
          code: `// Events (immutable, append-only)
type OrderEvent =
  | { type: "OrderCreated";   orderId: string; userId: string; items: Item[] }
  | { type: "ItemAdded";      orderId: string; item: Item }
  | { type: "OrderConfirmed"; orderId: string }
  | { type: "OrderCancelled"; orderId: string; reason: string };

// Rebuild state by replaying events
function applyEvent(state: Order, event: OrderEvent): Order {
  switch (event.type) {
    case "OrderCreated":   return { ...state, id: event.orderId, status: "pending", items: event.items };
    case "ItemAdded":      return { ...state, items: [...state.items, event.item] };
    case "OrderConfirmed": return { ...state, status: "confirmed" };
    case "OrderCancelled": return { ...state, status: "cancelled" };
  }
}

const currentState = events.reduce(applyEvent, EMPTY_ORDER);`,
        },
        {
          type: "table",
          headers: ["Benefit", "Cost"],
          rows: [
            ["Complete audit log — every change is recorded with who/when/why", "Event schema evolution requires care — old events must still replay"],
            ["Time travel — replay to any point-in-time state", "Read queries need projections (materialised views) — adds infrastructure"],
            ["Easy event-driven integration — emit events to other services", "Higher complexity than CRUD — only justified for domains with complex state machines"],
          ],
        },
      ],
    },
    {
      title: "Materialised views — sync vs async",
      blocks: [
        {
          type: "table",
          headers: ["Approach", "How", "Trade-off"],
          rows: [
            [
              "PostgreSQL MATERIALIZED VIEW",
              "REFRESH MATERIALIZED VIEW CONCURRENTLY — rebuilds the view from scratch",
              "Simple; no extra infra. Refresh takes time on large data. Not real-time.",
            ],
            [
              "Trigger-based projection",
              "DB trigger fires on INSERT/UPDATE, updates a denormalised summary table",
              "Real-time; adds write overhead; complex trigger logic is hard to maintain",
            ],
            [
              "Event-driven projection",
              "Service consumes events from a queue, updates read store asynchronously",
              "Decoupled; eventually consistent; requires event bus (Kafka, SQS, etc.)",
            ],
          ],
        },
        {
          type: "code",
          title: "PostgreSQL materialised view — user post counts",
          code: `CREATE MATERIALIZED VIEW user_post_counts AS
SELECT user_id, COUNT(*) AS post_count, MAX(created_at) AS last_posted_at
FROM posts
WHERE status = 'published'
GROUP BY user_id;

CREATE UNIQUE INDEX ON user_post_counts(user_id);

-- Refresh without locking reads
REFRESH MATERIALIZED VIEW CONCURRENTLY user_post_counts;`,
        },
      ],
    },
    {
      title: "When to use CQRS",
      blocks: [
        {
          type: "table",
          headers: ["Use CQRS when", "Avoid CQRS when"],
          rows: [
            [
              "Read and write loads are asymmetric (10:1+ reads to writes)",
              "Simple CRUD with balanced read/write load — adds unnecessary complexity",
            ],
            [
              "Different query shapes require different indexes or storage engines",
              "Small teams where synchronising two models adds cognitive load without benefit",
            ],
            [
              "You need an audit trail or event-driven integration with other services",
              "No infrastructure for async projection (message queue, worker processes)",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Start with a read replica for most scaling problems — it gives 80% of the benefit of CQRS with a fraction of the complexity. Add CQRS when you need different query models or when your domain has complex state machines that benefit from event sourcing.",
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is replication lag and when does it cause bugs?",
      tag: "Replication lag",
      answer: [
        "Replication lag is the delay between a write committing on the primary and that write becoming visible on a replica. During this window, reads from the replica return the old value.",
        "It causes bugs when: a user updates their profile and the next page load (from a replica) shows the old value; an inventory item is decremented but the replica still shows the old quantity; a session is created on the primary but the replica is queried for session validation before the row propagates.",
      ].join("\n\n"),
      callout: "After any write the user will read back — route that read to the primary.",
    },
    {
      question: "What is CQRS and when is it worth the complexity?",
      tag: "CQRS",
      answer: [
        "CQRS separates the model for handling writes (commands) from the model for handling reads (queries). Each side can have its own schema, storage engine, and scaling strategy. A blog platform might write to a normalised PostgreSQL schema and read from a denormalised Elasticsearch index optimised for full-text search.",
        "It is worth the complexity when: read and write patterns are radically different; multiple read models are needed for different views; you need an event stream for downstream consumers. It is overkill for a simple CRUD API with a balanced read/write ratio.",
      ].join("\n\n"),
    },
    {
      question: "What is event sourcing and how does it relate to CQRS?",
      tag: "Event sourcing",
      answer: [
        "Event sourcing stores state as a sequence of immutable events rather than the current state. Current state is derived by replaying events. It provides a complete audit trail, time-travel queries, and natural event streams for downstream consumers.",
        "CQRS and event sourcing are complementary but independent. CQRS separates read and write models; event sourcing defines how the write model persists state. You can use CQRS without event sourcing (just separate your read DB) or event sourcing without CQRS (replay events to produce state but keep a single model).",
      ].join("\n\n"),
    },
    {
      question: "How do you handle read-your-own-writes with read replicas?",
      tag: "Replication lag",
      answer: [
        "Option 1: Route all reads for the same user to the primary for a short window after a write (e.g. 1–5 seconds, stored in a cookie or session). After the window, route back to replicas.",
        "Option 2: After a write, check the replica's replay lag and fall back to the primary if it exceeds a threshold. Option 3: Use synchronous replication so the replica is always up to date — only viable if write latency can absorb the extra round trip.",
      ].join("\n\n"),
    },
    {
      question: "When should I use PostgreSQL materialised views vs event-driven projections?",
      tag: "Materialised views",
      answer: [
        "Use a PostgreSQL materialised view when the query is expensive and the data can be slightly stale — refresh it on a schedule or after batch updates. Simple, no extra infrastructure, adequate for dashboards and reporting.",
        "Use event-driven projections (consume domain events, update a read store) when you need near-real-time updates, when the read store is a different system (Elasticsearch, Redis), or when multiple downstream consumers need the same events for different purposes.",
      ].join("\n\n"),
    },
    {
      question: "What is the difference between synchronous and asynchronous replication?",
      tag: "Replication",
      answer: [
        "Synchronous: the primary waits for at least one replica to confirm it has written the WAL before acknowledging the commit to the client. Zero data loss on primary failure; write latency increases by one network round trip to the replica.",
        "Asynchronous (default in PostgreSQL streaming replication): the primary ACKs commits without waiting for replicas. Lowest write latency; if the primary fails before replicas catch up, recent commits may be lost (RPO > 0). Most production setups use asynchronous replication with a short RPO tolerance.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Set up a PostgreSQL primary + one streaming replica locally; write to the primary and measure the replay lag with pg_stat_replication.",
    "Implement CQRS routing in a Node.js Express app: POST handlers write to the primary, GET handlers read from a replica.",
    "Design an event-sourced order aggregate: define 4 events, implement an applyEvent reducer, and write a function that derives current order state from a list of events.",
  ],
} satisfies RoadmapDayDetail;
