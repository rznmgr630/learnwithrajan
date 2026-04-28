import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_11_DETAIL = {
  overview: [
    "NoSQL is not a replacement for relational databases — it is a family of trade-offs. Document, key-value, column-family, and graph stores each optimise for a different access pattern and sacrifice different guarantees. The CAP theorem and eventual consistency are the theoretical bedrock for understanding those trade-offs.",
    "Day 11 maps the NoSQL landscape, explains CAP and BASE, and shows how to design MongoDB documents and DynamoDB items for real access patterns — including the common mistakes that land teams back in a relational DB six months later.",
  ],
  sections: [
    {
      title: "NoSQL data model shapes",
      blocks: [
        {
          type: "table",
          caption: "Choose by access pattern, not by familiarity with the brand.",
          headers: ["Shape", "Examples", "Data model", "Best for"],
          rows: [
            [
              "Document",
              "MongoDB, Firestore, CouchDB",
              "JSON/BSON documents in collections; flexible schema",
              "Content, catalogs, user profiles — hierarchical data read as a whole",
            ],
            [
              "Key-value",
              "Redis, DynamoDB (simple), Memcached",
              "Hash map: key → opaque value",
              "Sessions, caches, feature flags — point lookups by key",
            ],
            [
              "Wide-column",
              "Cassandra, HBase, BigTable",
              "Rows + dynamic columns; partitioned by partition key + sorted by cluster key",
              "Time-series, IoT, analytics — append-heavy, high write throughput",
            ],
            [
              "Graph",
              "Neo4j, Amazon Neptune",
              "Nodes and edges with properties",
              "Social networks, recommendations, fraud graphs — many-hop traversals",
            ],
            [
              "Search",
              "Elasticsearch, OpenSearch, Typesense",
              "Inverted index over documents",
              "Full-text search, log analytics, autocomplete",
            ],
          ],
        },
      ],
    },
    {
      title: "CAP theorem",
      blocks: [
        {
          type: "diagram",
          id: "cap-theorem",
        },
        {
          type: "paragraph",
          text: "The CAP theorem (Brewer, 2000) states that a distributed system can guarantee at most two of three properties during a network partition: Consistency (every read sees the latest write), Availability (every request gets a response), and Partition tolerance (system continues during network splits).",
        },
        {
          type: "table",
          caption: "Network partitions always happen — the real choice is C vs A during a partition.",
          headers: ["Trade-off", "Systems", "Behaviour during partition"],
          rows: [
            [
              "CP (Consistent + Partition tolerant)",
              "MongoDB (majority write concern), HBase, Zookeeper, etcd",
              "Returns an error or timeout rather than stale data; sacrifices availability",
            ],
            [
              "AP (Available + Partition tolerant)",
              "Cassandra, DynamoDB, CouchDB",
              "Continues to serve reads/writes; may return stale data; resolves conflicts later",
            ],
            [
              "CA (Consistent + Available)",
              "Single-node PostgreSQL, MySQL",
              "Not truly distributed; partition tolerance not relevant for a single node",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "PACELC extends CAP: even without a partition (normal operation), there is a trade-off between latency and consistency. A system that synchronously replicates to all nodes is consistent but slower. Asynchronous replication is faster but allows momentarily stale reads.",
        },
      ],
    },
    {
      title: "BASE vs ACID",
      blocks: [
        {
          type: "table",
          headers: ["Property", "ACID", "BASE"],
          rows: [
            [
              "Consistency",
              "Strong — every read sees the latest committed write",
              "Eventual — reads may be stale; will converge given no new writes",
            ],
            [
              "Availability",
              "May block or error to preserve consistency",
              "Always responds, even with stale data",
            ],
            [
              "State",
              "Precise, known valid state at all times",
              "Soft state — intermediate states may exist during propagation",
            ],
            [
              "Approach",
              "Pessimistic — prevent anomalies with locks",
              "Optimistic — allow writes, resolve conflicts later",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "BASE is not 'ACID but worse' — it is a deliberate trade-off for scale. Twitter's timeline, Amazon's shopping cart, and DNS are BASE systems. Financial ledgers are ACID. Know which your feature needs before choosing.",
        },
      ],
    },
    {
      title: "MongoDB — document design patterns",
      blocks: [
        {
          type: "code",
          title: "Embed vs reference — the core design decision",
          code: `// EMBED: when data is always read together and the subdoc has no independent lifecycle
// ✅ Post with comments (blog: always load comments with the post)
{
  _id: ObjectId("..."),
  title: "CAP Theorem explained",
  author_id: ObjectId("..."),     // reference — users have independent lifecycle
  comments: [                     // embedded array — up to ~100 items OK
    { user_id: ObjectId("..."), text: "Great post!", created_at: ISODate("...") }
  ]
}

// REFERENCE: when subdoc is large, grows unbounded, or needs independent queries
// ✅ Order with many order_items stored separately
// orders collection: { _id, user_id, total, status }
// order_items collection: { _id, order_id, product_id, qty, price }`,
        },
        {
          type: "table",
          headers: ["Design rule", "When to embed", "When to reference"],
          rows: [
            [
              "Document size",
              "Subdoc is small and bounded",
              "Subdoc can grow to thousands of items (16 MB BSON limit)",
            ],
            [
              "Access pattern",
              "Always need parent + child together",
              "Child is often queried independently",
            ],
            [
              "Update frequency",
              "Child updates are rare or co-located with parent update",
              "Child is updated frequently without parent",
            ],
          ],
        },
        {
          type: "code",
          title: "Indexes in MongoDB",
          code: `// Single field
db.posts.createIndex({ author_id: 1 });

// Compound — order matters (same rules as SQL composite indexes)
db.posts.createIndex({ status: 1, created_at: -1 });

// Text search
db.posts.createIndex({ title: "text", body: "text" });

// Partial — only index published posts
db.posts.createIndex({ author_id: 1 }, { partialFilterExpression: { status: "published" } });

// Explain a query
db.posts.find({ author_id: ObjectId("..."), status: "published" }).explain("executionStats");`,
        },
      ],
    },
    {
      title: "DynamoDB — single-table design",
      blocks: [
        {
          type: "paragraph",
          text: "DynamoDB has no joins and no server-side aggregation. Every access pattern must be pre-designed into the partition key (PK) and sort key (SK). The single-table design pattern stores multiple entity types in one table, using composite keys and item type prefixes to enable rich queries with a single request.",
        },
        {
          type: "code",
          title: "Single-table design — users + posts + comments",
          code: `// Table: MainTable (PK, SK, data attributes)
// Pattern: PK = entity type + ID, SK = relationship + ID

// User record
{ PK: "USER#u_123", SK: "PROFILE", email: "a@b.com", name: "Ada" }

// Posts by user — PK groups them, SK sorts by date
{ PK: "USER#u_123", SK: "POST#2024-01-15#p_456", title: "CAP Theorem", status: "published" }
{ PK: "USER#u_123", SK: "POST#2024-01-20#p_789", title: "ACID vs BASE",  status: "draft" }

// Comments on a post — PK is the post
{ PK: "POST#p_456", SK: "COMMENT#2024-01-16#c_001", text: "Great!", user_id: "u_789" }

// Query: all posts by user u_123
// PK = "USER#u_123", SK begins_with "POST#"

// Query: all comments on post p_456 sorted by date
// PK = "POST#p_456", SK begins_with "COMMENT#"`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "GSI (Global Secondary Index): project a different PK/SK pattern for alternate access patterns without duplicating the table.",
            "Avoid hot partitions: if millions of users query the same PK, that partition's throughput becomes the bottleneck. Add a shard suffix to high-traffic PKs.",
            "DynamoDB Streams: triggers on item changes, used to propagate to Elasticsearch for search or to aggregate into analytics stores.",
          ],
        },
      ],
    },
    {
      title: "Eventual consistency in practice",
      blocks: [
        {
          type: "paragraph",
          text: "Eventual consistency means a write on one replica propagates to others asynchronously. During propagation, a read on another replica may return the old value. The system guarantees convergence — once writes stop, all replicas will eventually agree.",
        },
        {
          type: "table",
          headers: ["Pattern", "How", "Example"],
          rows: [
            [
              "Read your own writes",
              "Route reads for the same user to the same replica that processed their write",
              "After a profile update, redirect the user to the primary for the next 1 second",
            ],
            [
              "Monotonic reads",
              "Once a client has seen a value, it never sees an older value",
              "Use sticky session affinity to one replica per client",
            ],
            [
              "Conflict resolution",
              "Last-write-wins (LWW), merge functions, or CRDTs",
              "DynamoDB uses LWW by timestamp; Cassandra uses LWW; Riak uses CRDTs",
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What does the CAP theorem actually tell you in practice?",
      tag: "CAP theorem",
      answer: [
        "CAP says: during a network partition, choose between consistency (refuse to answer with stale data) or availability (answer even if potentially stale). You cannot have both at the same time.",
        "In practice, partitions are rare but unavoidable in any distributed system. The real design question is: when a node is isolated or lagging, should it serve requests with potentially stale data (AP) or refuse to serve until it syncs (CP)? The answer depends on your domain — financial systems should refuse; social feeds can show stale data.",
      ].join("\n\n"),
      callout: "P is non-negotiable in distributed systems. The choice is C vs A during a partition.",
    },
    {
      question: "When should I use a document database instead of a relational one?",
      tag: "Document vs relational",
      answer: [
        "Use a document database when: (1) your data is naturally hierarchical and read as a unit (a product catalog item with nested specs and images); (2) your schema evolves rapidly across tenants or versions; (3) you need to scale horizontally across many shards without complex cross-shard joins.",
        "Stay with relational when: you have complex relationships requiring joins, strong ACID transactions across multiple entities, or complex aggregations. Many teams choose MongoDB for the wrong reasons and end up reimplementing joins in application code — often worse than using PostgreSQL from the start.",
      ].join("\n\n"),
    },
    {
      question: "What is eventual consistency and what problems can it cause?",
      tag: "Eventual consistency",
      answer: [
        "Eventual consistency means a write to one node propagates to replicas asynchronously. During propagation, reads on lagging replicas return stale data. Eventually (once writes stop and propagation completes) all nodes agree.",
        "Problems: (1) a user updates their profile and immediately reads back the old value; (2) a product quantity reaches 0 but multiple orders are still accepted because replicas haven't caught up; (3) two nodes accept conflicting writes and must resolve them — LWW silently drops one. Design your system to tolerate or detect these scenarios.",
      ].join("\n\n"),
    },
    {
      question: "What is the DynamoDB single-table design pattern and why use it?",
      tag: "DynamoDB",
      answer: [
        "Single-table design stores multiple entity types in one DynamoDB table, using composite partition keys and sort keys (e.g. PK=USER#123, SK=POST#2024-01-15) to co-locate related data. Since DynamoDB cannot join across tables, all data for a request must be retrievable with a single query.",
        "The benefit: one request fetches everything (e.g. a user + their posts + metadata) using a begins_with query on the sort key. The cost: schema design is complex, and adding a new access pattern may require a new GSI or data restructuring.",
      ].join("\n\n"),
      callout: "Design your DynamoDB keys around access patterns, not entity shapes.",
    },
    {
      question: "What is a hot partition and how do you avoid it?",
      tag: "DynamoDB / Cassandra",
      answer: [
        "A hot partition occurs when many requests target the same partition key, overloading that partition's provisioned throughput while others sit idle. In DynamoDB, one partition handles ~3000 RCU or 1000 WCU. A viral post receiving millions of reads will blast through that limit.",
        "Fixes: (1) add a random shard suffix to the PK (PK = POST#p_456#shard_3) and query all shards in parallel; (2) cache hot items in ElastiCache; (3) use DynamoDB Accelerator (DAX) for microsecond caching of hot reads.",
      ].join("\n\n"),
    },
    {
      question: "What is BASE and how does it differ from ACID?",
      tag: "BASE vs ACID",
      answer: [
        "BASE (Basically Available, Soft state, Eventually consistent) describes the consistency model of many distributed NoSQL systems. Basically Available means the system responds to requests even during partial failures. Soft state means the system's state may change over time as data propagates. Eventually consistent means all replicas will converge given time.",
        "ACID systems provide strong consistency with synchronous writes — every read sees the latest committed write. BASE systems trade strong consistency for higher availability and write throughput. Neither is universally better; the choice is domain-driven.",
      ].join("\n\n"),
    },
    {
      question: "When should I embed vs reference in MongoDB?",
      tag: "MongoDB design",
      answer: [
        "Embed when the subdocument is always read with its parent, is bounded in size (not growing to thousands of items), and has no lifecycle independent of the parent. Comments on a blog post are a classic embed — you always load them with the post.",
        "Reference (store the ID) when the subdocument is large, grows unbounded, is queried independently, or is shared across multiple parent documents. A product in an order should be referenced — the product has its own lifecycle and is shared across many orders.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Design a MongoDB schema for a social media app (users, posts, likes, comments) with correct embed vs reference decisions for each relationship.",
    "Model a DynamoDB single-table design for an e-commerce order system supporting: get order by ID, list orders by user, list items by order.",
    "Write a one-paragraph explanation of why you would choose Cassandra over PostgreSQL for a time-series IoT sensor data system.",
  ],
} satisfies RoadmapDayDetail;
