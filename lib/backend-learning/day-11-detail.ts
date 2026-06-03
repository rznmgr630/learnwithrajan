import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_11_DETAIL = {
  overview: [
    "NoSQL databases are not a replacement for relational databases — they are a set of trade-offs. Document, key-value, column-family, and graph stores are each built for a different kind of query and give up different guarantees in return. CAP theorem and eventual consistency explain those trade-offs at a theoretical level.",
    "Today you will map the NoSQL landscape, understand CAP and BASE, and learn how to design MongoDB documents and DynamoDB items for real access patterns — including the common mistakes that send teams back to a relational database six months later.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "GV9VBwH_h1U", title: "MongoDB Explained in 10 Minutes — SQL vs NoSQL" },
      ],
    },
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
          text: "The CAP theorem says a distributed system can only guarantee two out of three properties when the network is unreliable: Consistency (every read sees the latest write), Availability (every request gets a response), and Partition tolerance (the system keeps working during network failures).",
        },
        {
          type: "table",
          caption: "Network partitions always happen — the real choice is consistency vs availability during a partition.",
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
          text: "PACELC extends CAP: even when the network is healthy, there is a trade-off between latency and consistency. Synchronously writing to all nodes is consistent but slow. Asynchronous replication is faster but allows stale reads briefly.",
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
          text: "BASE is not 'ACID but worse' — it is a deliberate trade-off for scale. Twitter's timeline, Amazon's shopping cart, and DNS are all BASE systems. Financial ledgers are ACID. Know what your feature actually needs before choosing.",
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
          text: "DynamoDB has no joins and no server-side aggregation. Every access pattern must be built into the partition key and sort key when you design the table. The single-table design pattern stores multiple entity types in one table, using composite keys and type prefixes to support rich queries with a single request.",
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
            "GSI (Global Secondary Index): lets you query by a different partition key pattern for access patterns the main key does not support — without duplicating the table.",
            "Avoid hot partitions: if millions of requests target the same partition key, that partition's throughput becomes the bottleneck. Add a random shard suffix to high-traffic partition keys.",
            "DynamoDB Streams: triggers on item changes — use to sync to Elasticsearch for search or to push data into analytics pipelines.",
          ],
        },
      ],
    },
    {
      title: "Eventual consistency in practice",
      blocks: [
        {
          type: "paragraph",
          text: "Eventual consistency means a write on one server propagates to other servers asynchronously. During propagation, a read from another server may return the old value. Once writes stop and propagation finishes, all servers will eventually agree.",
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
        "CAP says: when the network is split, you have to choose between returning an error (consistency — refuse to serve stale data) or serving a response that might be stale (availability). You cannot have both at the same time.",
        "In practice, network partitions are rare but inevitable in any distributed system. The real question is: when a node is lagging or isolated, should it serve requests with potentially old data, or refuse until it syncs? For financial systems, refuse. For social feeds, stale is usually fine.",
      ].join("\n\n"),
      callout: "P is non-negotiable in distributed systems. The choice is C vs A during a partition.",
    },
    {
      question: "When should I use a document database instead of a relational one?",
      tag: "Document vs relational",
      answer: [
        "Use a document database when: your data is naturally hierarchical and always read as a unit (a product catalog entry with nested specs and images); your schema changes rapidly across tenants or versions; or you need to scale horizontally across many shards without complex cross-shard joins.",
        "Stick with a relational database when you need complex joins, strong ACID transactions across multiple entities, or complex aggregations. Many teams choose MongoDB thinking it is simpler and end up rebuilding SQL joins in application code — often worse than just using PostgreSQL from the start.",
      ].join("\n\n"),
    },
    {
      question: "What is eventual consistency and what problems can it cause?",
      tag: "Eventual consistency",
      answer: [
        "Eventual consistency means a write to one node reaches other nodes asynchronously. During propagation, reads from a lagging node return stale data. Once writes stop and propagation finishes, all nodes agree.",
        "Real problems: a user updates their profile and immediately sees the old one; a product hits zero stock but orders still go through because some replicas have not caught up; two nodes accept conflicting writes and one gets silently dropped. Design your system knowing these things can and will happen.",
      ].join("\n\n"),
    },
    {
      question: "What is the DynamoDB single-table design pattern and why use it?",
      tag: "DynamoDB",
      answer: [
        "Single-table design stores multiple entity types in one DynamoDB table using composite partition and sort keys — for example PK=USER#123, SK=POST#2024-01-15 — to group related data together. Since DynamoDB cannot join tables, everything needed for one request must come back from one query.",
        "The benefit: one query fetches a user and all their posts using a begins_with filter on the sort key. The cost: the key design is complex, and adding a new access pattern may require a new Global Secondary Index or data restructuring.",
      ].join("\n\n"),
      callout: "Design your DynamoDB keys around access patterns, not entity shapes.",
    },
    {
      question: "What is a hot partition and how do you avoid it?",
      tag: "DynamoDB / Cassandra",
      answer: [
        "A hot partition happens when too many requests target the same partition key, overloading that partition while others sit idle. In DynamoDB, one partition handles around 3000 reads or 1000 writes per second. A viral post getting millions of reads will blast right through that limit.",
        "Fixes: add a random shard suffix to the partition key (PK = POST#p_456#shard_3) and query all shards in parallel; cache hot items in ElastiCache; or use DynamoDB Accelerator (DAX) for microsecond caching of hot reads.",
      ].join("\n\n"),
    },
    {
      question: "What is BASE and how does it differ from ACID?",
      tag: "BASE vs ACID",
      answer: [
        "BASE stands for Basically Available, Soft state, Eventually consistent. The system responds to requests even during partial failures (basically available). The state may change over time as data propagates (soft state). All nodes will eventually agree (eventually consistent).",
        "ACID gives you strong consistency — every read sees the latest committed write. BASE trades strong consistency for higher availability and write throughput. Neither is universally better; the right choice depends on what your feature actually needs.",
      ].join("\n\n"),
    },
    {
      question: "When should I embed vs reference in MongoDB?",
      tag: "MongoDB design",
      answer: [
        "Embed when the subdocument is always read with its parent, is small and bounded in size, and has no lifecycle independent of the parent. Comments on a blog post are a classic embed — you always load them with the post.",
        "Reference (store just the ID) when the subdocument is large, can grow to thousands of items, is queried on its own, or is shared across multiple parent documents. A product in an order should be referenced — the product exists independently and is linked to many orders.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Design a MongoDB schema for a social media app (users, posts, likes, comments) with the right embed vs reference decision for each relationship.",
    "Model a DynamoDB single-table design for an e-commerce order system that supports: get order by ID, list orders by user, list items by order.",
    "Write a paragraph explaining why you would choose Cassandra over PostgreSQL for a time-series IoT sensor data system.",
  ],
} satisfies RoadmapDayDetail;
