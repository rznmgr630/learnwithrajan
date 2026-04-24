import type { RoadmapDayDetail } from "./challenge-data";

export const DAY_3_DETAIL = {
  overview: [
    "Every backend service is only as reliable as its database. Day 3 builds the mental model for how relational databases actually work: how transactions guarantee correctness under crashes and concurrency, how indexes turn table scans into pointer chases, and how to read a query plan so you can fix slow queries with evidence rather than guesswork.",
    "By the end you should be able to explain ACID in an interview, design a normalised schema, write an EXPLAIN ANALYZE, and know exactly when a relational database is the wrong tool.",
  ],
  sections: [
    {
      title: "ACID — what each guarantee actually means",
      blocks: [
        {
          type: "paragraph",
          text: "ACID is not four independent features — they interlock. Atomicity makes partial failures invisible; Consistency enforces your invariants; Isolation prevents concurrent transactions from corrupting each other; Durability ensures a committed write survives a crash.",
        },
        { type: "diagram", id: "acid-transaction" },
        {
          type: "table",
          caption:
            "Memorise the one-line definition and one concrete failure mode for each.",
          headers: ["Letter", "Guarantee", "Without it"],
          rows: [
            [
              "Atomicity",
              "All ops in a transaction commit or all roll back — no partial writes.",
              "Transfer deducts from account A but crashes before crediting B.",
            ],
            [
              "Consistency",
              "A transaction moves the DB from one valid state to another. All constraints, cascades, and triggers fire.",
              "Foreign key violated; negative account balance allowed.",
            ],
            [
              "Isolation",
              "Concurrent transactions behave as if they ran serially (to the degree the isolation level specifies).",
              "Two concurrent transfers read the same balance, both succeed, total deducted twice.",
            ],
            [
              "Durability",
              "A committed transaction survives crashes. The WAL (write-ahead log) is fsynced before ACK.",
              "Server power-cut after COMMIT returns success — data gone.",
            ],
          ],
        },
        {
          type: "code",
          title: "Atomic transfer in PostgreSQL",
          code: [
            "BEGIN;",
            "  UPDATE accounts SET balance = balance - 100 WHERE id = 1;",
            "  UPDATE accounts SET balance = balance + 100 WHERE id = 2;",
            "  -- constraint check: balance >= 0",
            "COMMIT;   -- both updates land, or neither does",
            "",
            "-- On error the DB auto-rolls back; you can also:",
            "ROLLBACK; -- explicit undo",
          ].join("\n"),
        },
      ],
    },
    {
      title: "Isolation levels and concurrency anomalies",
      blocks: [
        {
          type: "paragraph",
          text: "Higher isolation = fewer anomalies, more locking/MVCC overhead. PostgreSQL default is Read Committed; MySQL InnoDB default is Repeatable Read. Pick the lowest level that still prevents the anomalies that matter for your use case.",
        },
        { type: "diagram", id: "isolation-levels" },
        {
          type: "table",
          headers: ["Anomaly", "What happens", "Prevented from"],
          rows: [
            [
              "Dirty read",
              "Transaction A reads uncommitted data written by B — which B then rolls back.",
              "Read Committed",
            ],
            [
              "Non-repeatable read",
              "A reads a row twice; B commits an UPDATE between A's reads — A sees different values.",
              "Repeatable Read",
            ],
            [
              "Phantom read",
              "A runs the same range query twice; B commits an INSERT between runs — A sees an extra row.",
              "Serializable",
            ],
            [
              "Lost update",
              "A and B both read value 10, both add 5, both write 15 — one increment is lost.",
              "Repeatable Read (with FOR UPDATE) or Serializable",
            ],
          ],
        },
        {
          type: "code",
          title: "SELECT FOR UPDATE — pessimistic lock to prevent lost update",
          code: [
            "BEGIN;",
            "  SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;",
            "  -- row is locked; concurrent tx blocks here",
            "  UPDATE accounts SET balance = balance + 50 WHERE id = 1;",
            "COMMIT;",
          ].join("\n"),
        },
      ],
    },
    {
      title: "Indexes — B-tree, Hash, Covering",
      blocks: [
        {
          type: "paragraph",
          text: "An index is a separate data structure the database maintains so it can find rows without scanning every page. The cost: writes become slightly slower and disk space grows. The payoff: range scans and point lookups go from O(n) to O(log n) or O(1).",
        },
        { type: "diagram", id: "btree-index" },
        {
          type: "table",
          caption:
            "Default index type in PostgreSQL and MySQL InnoDB is B-tree.",
          headers: ["Type", "Structure", "Good for", "Not for"],
          rows: [
            [
              "B-tree",
              "Balanced tree; leaf nodes are sorted and linked",
              "Equality, range (`>`, `<`, `BETWEEN`), `ORDER BY`, prefix `LIKE 'foo%'`",
              "Trigram search, full-text",
            ],
            [
              "Hash",
              "Hash function → bucket",
              "Equality only — O(1) lookup",
              "Range queries, sorting",
            ],
            [
              "Covering (any type)",
              "INCLUDE extra columns in the index leaf",
              "Index-only scan — zero heap access",
              "Wide rows, high-write tables",
            ],
            [
              "GIN / GiST (PG)",
              "Inverted / generalised search tree",
              "Full-text, array contains, JSON `@>`, geometric types",
              "Simple equality",
            ],
          ],
        },
        {
          type: "code",
          title: "Creating indexes in PostgreSQL",
          code: [
            "-- B-tree (default)",
            "CREATE INDEX idx_orders_user ON orders(user_id);",
            "",
            "-- Composite: column order matters — leftmost prefix rule",
            "CREATE INDEX idx_orders_user_status ON orders(user_id, status);",
            "-- Useful for: WHERE user_id = ? AND status = ?",
            "-- Also useful for: WHERE user_id = ?  (leftmost prefix)",
            "-- NOT useful for: WHERE status = ?  (no leftmost prefix)",
            "",
            "-- Covering index (PG 11+)",
            "CREATE INDEX idx_orders_covering ON orders(user_id) INCLUDE (total, created_at);",
            "-- Query: SELECT total, created_at FROM orders WHERE user_id = 1",
            "-- → Index-only scan, heap not touched",
            "",
            "-- Partial index — index only the rows you query",
            "CREATE INDEX idx_orders_pending ON orders(created_at) WHERE status = 'pending';",
            "",
            "-- Hash",
            "CREATE INDEX idx_sessions_token ON sessions USING HASH (token);",
          ].join("\n"),
        },
      ],
    },
    {
      title: "EXPLAIN ANALYZE — reading a query plan",
      blocks: [
        {
          type: "paragraph",
          text: "`EXPLAIN ANALYZE` runs the query and shows actual row counts, timing, and the chosen access method. Read it bottom-up: the innermost node executes first. Look for Seq Scan on large tables, high `rows` estimates vs actuals (stale stats → run `ANALYZE`), and nested-loop joins on unindexed columns.",
        },
        {
          type: "code",
          title: "Reading EXPLAIN ANALYZE output",
          code: [
            "EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)",
            "  SELECT o.id, u.email",
            "  FROM orders o",
            "  JOIN users u ON u.id = o.user_id",
            "  WHERE o.status = 'pending';",
            "",
            "-- Typical output (read bottom-up):",
            "-- Hash Join  (cost=120..880 rows=400 width=40) (actual time=2.1..18.4 rows=382 loops=1)",
            "--   Hash Cond: (o.user_id = u.id)",
            "--   -> Seq Scan on orders  (cost=0..640 rows=5000 width=20)",
            "--        Filter: (status = 'pending')",
            "--        Rows Removed by Filter: 4618",
            "--   -> Hash  (cost=80..80 rows=3200 width=28)",
            "--        -> Seq Scan on users  (cost=0..80 rows=3200 width=28)",
            "",
            "-- Fix: add index on orders(status) or orders(status, user_id)",
            "-- Re-run: Seq Scan → Index Scan, time drops from 18ms to <1ms",
          ].join("\n"),
        },
        {
          type: "table",
          caption: "Key EXPLAIN nodes and what they signal.",
          headers: ["Node", "Means", "Action if slow"],
          rows: [
            [
              "Seq Scan",
              "Full table scan, every page read",
              "Add index on the filter/join column",
            ],
            [
              "Index Scan",
              "B-tree traversal + heap fetch per row",
              "Usually fast; check selectivity",
            ],
            [
              "Index Only Scan",
              "B-tree only, no heap access",
              "Best case — ensure visibility map is clean",
            ],
            [
              "Nested Loop",
              "For each outer row, probe inner",
              "Fast when inner is small; bad at scale without index",
            ],
            [
              "Hash Join",
              "Build hash table from smaller side",
              "Good for large joins; memory-bound",
            ],
            [
              "Sort",
              "In-memory or disk sort",
              "Add index on ORDER BY column, or increase work_mem",
            ],
          ],
        },
        {
          type: "list",
          variant: "number",
          items: [
            "Always use `EXPLAIN ANALYZE` not just `EXPLAIN` — estimates alone mislead.",
            "Run `ANALYZE table_name;` after bulk inserts to refresh statistics.",
            "Use `EXPLAIN (BUFFERS)` to see cache hits vs disk reads.",
            "`pg_stat_statements` extension logs slow queries in production — enable it.",
          ],
        },
      ],
    },
    {
      title: "Schema design and normalisation",
      blocks: [
        {
          type: "paragraph",
          text: "Normalisation removes redundancy and update anomalies. Denormalise deliberately — only when a join is provably too slow and you can maintain consistency in application code.",
        },
        {
          type: "table",
          headers: ["Normal Form", "Rule", "Violation example"],
          rows: [
            [
              "1NF",
              "Each column holds a single atomic value; no repeating groups.",
              "`tags = 'backend,api,rest'` — multiple values in one column.",
            ],
            [
              "2NF",
              "No partial dependency: every non-key column depends on the whole primary key (matters when PK is composite).",
              "Order table with composite PK (order_id, product_id) but `product_name` depends only on `product_id`.",
            ],
            [
              "3NF",
              "No transitive dependency: non-key columns depend only on the PK, not on other non-key columns.",
              "Employee table: `dept_id → dept_name`. `dept_name` depends on `dept_id`, not on `employee_id`.",
            ],
            [
              "BCNF",
              "Every determinant is a candidate key (stronger than 3NF).",
              "Rare in practice; usually 3NF is sufficient.",
            ],
          ],
        },
        {
          type: "code",
          title: "Practical normalised schema — blog",
          code: [
            "CREATE TABLE users (",
            "  id         BIGSERIAL PRIMARY KEY,",
            "  email      TEXT NOT NULL UNIQUE,",
            "  created_at TIMESTAMPTZ NOT NULL DEFAULT now()",
            ");",
            "",
            "CREATE TABLE posts (",
            "  id         BIGSERIAL PRIMARY KEY,",
            "  author_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,",
            "  title      TEXT NOT NULL,",
            "  body       TEXT NOT NULL,",
            "  status     TEXT NOT NULL CHECK (status IN ('draft','published','archived')),",
            "  created_at TIMESTAMPTZ NOT NULL DEFAULT now()",
            ");",
            "",
            "CREATE TABLE tags (",
            "  id   BIGSERIAL PRIMARY KEY,",
            "  name TEXT NOT NULL UNIQUE",
            ");",
            "",
            "-- Many-to-many resolved via junction table (3NF)",
            "CREATE TABLE post_tags (",
            "  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,",
            "  tag_id  BIGINT REFERENCES tags(id)  ON DELETE CASCADE,",
            "  PRIMARY KEY (post_id, tag_id)",
            ");",
            "",
            "-- Indexes to support common queries",
            "CREATE INDEX ON posts(author_id);",
            "CREATE INDEX ON posts(status, created_at DESC);",
            "CREATE INDEX ON post_tags(tag_id);",
          ].join("\n"),
        },
      ],
    },
    {
      title: "SQL vs NoSQL — when to use what",
      blocks: [
        {
          type: "paragraph",
          text: "NoSQL is not better or worse than SQL — it is a different set of trade-offs. Most applications start with a relational database and add a specialised store (cache, search, time-series) when a specific access pattern demands it.",
        },
        {
          type: "table",
          headers: ["Store", "Model", "Sweet spot", "Watch out for"],
          rows: [
            [
              "PostgreSQL / MySQL",
              "Relational (rows, tables, FK)",
              "Complex queries, joins, transactions, reporting",
              "Horizontal write sharding is hard",
            ],
            [
              "MongoDB",
              "Document (JSON trees)",
              "Flexible / evolving schema, nested data read together",
              "No joins — denormalise carefully; multi-doc transactions added in 4.0 but slower",
            ],
            [
              "Redis",
              "Key-value / data structures",
              "Cache, session store, rate limiting, pub/sub, leaderboards",
              "Data must fit in RAM; persistence is opt-in",
            ],
            [
              "Cassandra / ScyllaDB",
              "Wide-column",
              "Write-heavy, time-series, global distribution",
              "Design queries first; no ad-hoc joins; eventual consistency by default",
            ],
            [
              "Elasticsearch / OpenSearch",
              "Inverted index (search)",
              "Full-text search, log aggregation, faceted filters",
              "Not a primary store; replication lag; expensive aggregations",
            ],
            [
              "Neo4j / Amazon Neptune",
              "Graph",
              "Social graphs, fraud detection, recommendation engines",
              "Poor for tabular reporting; niche tooling",
            ],
          ],
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Default to PostgreSQL. It handles JSON, full-text search, time-series (TimescaleDB), and geospatial — you may never need another store.",
            "Add Redis for caching hot reads and rate-limit counters, not as a primary store.",
            "Add a search engine only when ILIKE / `tsvector` is measurably too slow.",
            "Use Cassandra / DynamoDB when write throughput exceeds what a single Postgres primary can handle (~10k+ writes/sec sustained) — that threshold is higher than most teams hit.",
          ],
        },
      ],
    },
    {
      title: "Exercises (do all four)",
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            "ACID crash simulation — open two `psql` sessions; in session A `BEGIN` a transfer and `DO NOT COMMIT`; in session B try to read/write the same row. Observe the block. Then ROLLBACK A and see B unblock.",
            "Index impact — create a table with 100k rows (`generate_series`), run a filter query with `EXPLAIN ANALYZE`, note the Seq Scan time; add an index and re-run — see Index Scan.",
            "Normalise a flat table — take a spreadsheet-style orders CSV with repeating customer name/email per row and normalise it to 3NF (customers, orders, products, order_items tables).",
            "N+1 fix — write a query that fetches posts and their authors in two steps (the N+1 pattern); rewrite it as a single JOIN query; compare EXPLAIN output.",
          ],
        },
        {
          type: "paragraph",
          text: "Being able to demo index impact live — table scan time before vs after — is a stronger interview signal than any verbal answer.",
        },
      ],
    },
  ],
  faq: [
    {
      question: "What are the ACID properties and what does each guarantee?",
      tag: "ACID",
      answer: [
        "Atomicity: a transaction is all-or-nothing. Every statement in the transaction commits, or none do. A crash after the first UPDATE and before the second leaves the database as if neither ran.",
        "Consistency: a transaction takes the database from one valid state to another. Constraints, foreign keys, check constraints, and triggers all fire. If any constraint is violated, the whole transaction is aborted.",
        "Isolation: concurrent transactions do not see each other's intermediate state. The degree of isolation depends on the isolation level — full Serializable makes them appear as if they ran one at a time.",
        "Durability: once COMMIT returns, the write is permanent. The database writes to the WAL (write-ahead log) and fsyncs it before acknowledging the client. A power cut after COMMIT does not lose data.",
      ].join("\n\n"),
      callout:
        "Atomicity makes failures invisible. Durability makes commits permanent. Isolation controls what concurrent transactions see.",
    },
    {
      question:
        "What is the difference between a dirty read, non-repeatable read, and phantom read?",
      tag: "Concurrency anomalies",
      answer: [
        "Dirty read: Transaction A reads a row that Transaction B has modified but not yet committed. If B rolls back, A has read data that never existed.",
        "Non-repeatable read: A reads a row, B commits an UPDATE to that row, A reads it again and gets a different value. The same row returned two different results within one transaction.",
        "Phantom read: A runs a range query (`WHERE age > 30`), B inserts a new matching row and commits, A runs the same query and gets an extra row. The set of matching rows changed.",
        "These anomalies form a hierarchy: Serializable prevents all three; Repeatable Read prevents dirty and non-repeatable; Read Committed prevents only dirty reads.",
      ].join("\n\n"),
      callout:
        "Dirty = uncommitted data. Non-repeatable = same row, different value. Phantom = same query, different row count.",
    },
    {
      question: "What are the four SQL isolation levels?",
      tag: "Isolation levels",
      answer: [
        "1. Read Uncommitted — allows dirty reads. Rarely used; no major database recommends it for general use.",
        "2. Read Committed — prevents dirty reads. Each statement sees only committed data. PostgreSQL default. Non-repeatable reads and phantoms are still possible.",
        "3. Repeatable Read — prevents dirty and non-repeatable reads. MySQL InnoDB default. Phantoms are prevented in InnoDB via gap locks; in PostgreSQL via snapshot isolation.",
        "4. Serializable — prevents all three anomalies. Transactions execute as if serial. PostgreSQL uses Serializable Snapshot Isolation (SSI); MySQL uses lock-based serializability. Highest overhead.",
      ].join("\n\n"),
      callout:
        "PostgreSQL default: Read Committed. MySQL InnoDB default: Repeatable Read. Most apps never need Serializable.",
    },
    {
      question: "How does a B-tree index work?",
      tag: "B-tree index",
      answer: [
        "A B-tree is a self-balancing tree where each node holds multiple keys and pointers. The tree stays balanced so every leaf is at the same depth — height is O(log n), typically 3–4 levels for millions of rows.",
        "Leaf nodes hold the actual index entries (key + heap pointer / tuple ID). Leaf nodes are linked in sorted order, which makes range scans efficient: find the leftmost matching key, then walk the linked list.",
        "On a write, the database updates the index as well as the heap. On a lookup, the planner traverses the tree (3–4 page reads) then fetches the heap page — usually much cheaper than a full table scan.",
        "B-trees are the right choice for equality, range, ORDER BY, and LIKE 'prefix%' queries. They are not useful for trigrams, full-text, or array containment — those need GIN or GiST.",
      ].join("\n\n"),
      callout:
        "B-tree height ~3–4 levels for millions of rows. Leaf nodes are sorted and linked for range scans.",
    },
    {
      question: "What is the difference between a B-tree and a hash index?",
      tag: "B-tree vs Hash",
      answer: [
        "B-tree: balanced tree, O(log n) lookup, supports equality and range queries, ORDER BY, LIKE prefix. Works for most cases. PostgreSQL and MySQL default.",
        "Hash index: applies a hash function to the key to find a bucket, O(1) average lookup. Only supports equality (`=`). Cannot do range queries, sorting, or prefix matching.",
        "In PostgreSQL, hash indexes are WAL-logged since PG 10 and are crash-safe. In MySQL InnoDB, the adaptive hash index is a transparent in-memory optimisation — you cannot create hash indexes manually.",
        "Practical rule: default to B-tree. Use a hash index only if every query is a pure equality lookup, the table is large, and profiling confirms the B-tree is the bottleneck.",
      ].join("\n\n"),
      callout:
        "B-tree: O(log n), range + equality. Hash: O(1), equality only. Default to B-tree.",
    },
    {
      question: "What is a covering index and when does it help?",
      tag: "Covering index",
      answer: [
        "A covering index stores extra columns alongside the index key so the query can be answered entirely from the index without touching the heap (table pages). PostgreSQL calls this an Index Only Scan.",
        "Use `CREATE INDEX ... INCLUDE (col1, col2)` in PostgreSQL 11+ to add non-key columns to the leaf nodes without making them part of the sort key.",
        "When to add: the query's SELECT list plus WHERE columns are all in the index. The table is large and the query is hot. Measure with `EXPLAIN ANALYZE` — look for `Index Only Scan` and `Heap Fetches: 0`.",
        "Cost: the index is wider, so it takes more disk space and slightly more time to maintain on writes. Only add covering columns that are actually queried together.",
      ].join("\n\n"),
      callout:
        "Index Only Scan = zero heap reads. Add INCLUDE columns for hot read queries when the heap fetch is the bottleneck.",
    },
    {
      question: "What is a composite index and why does column order matter?",
      tag: "Composite indexes",
      answer: [
        "A composite (multi-column) index covers multiple columns in a defined order. The index is sorted by the first column, then by the second within the first, and so on.",
        "The leftmost prefix rule: the index can satisfy queries that filter on the first column alone, or the first two together, but NOT the second column alone (no leading column to narrow the scan).",
        "Example: `CREATE INDEX ON orders(user_id, status)` — useful for `WHERE user_id = 1`, `WHERE user_id = 1 AND status = 'pending'`, but not for `WHERE status = 'pending'` alone.",
        "Column order rule of thumb: put the most selective column (highest cardinality) or the equality column first, range columns last. If you need both patterns independently, create two separate indexes.",
      ].join("\n\n"),
      callout:
        "Leftmost prefix rule: index (A, B) covers A alone or A+B, never B alone.",
    },
    {
      question: "How do you read a PostgreSQL EXPLAIN ANALYZE output?",
      tag: "EXPLAIN ANALYZE",
      answer: [
        "Read bottom-up: the innermost (most-indented) node executes first. Each node shows `(cost=start..total rows=estimate width=bytes) (actual time=start..total rows=actual loops=N)`.",
        "Key signals to look for: `Seq Scan` on a large table with a filter is usually a missing index. A large gap between estimated rows and actual rows means stale statistics — run `ANALYZE table`. `Nested Loop` over an unindexed column degrades to O(n²).",
        "Add `BUFFERS` to see `shared hit` (buffer cache) vs `read` (disk). High disk reads on a hot query → increase `shared_buffers` or add a covering index.",
        "Workflow: run `EXPLAIN ANALYZE`, find the slowest node, add an index or rewrite the query, re-run and compare. Use `pg_stat_statements` in production to find the queries worth optimising.",
      ].join("\n\n"),
      callout:
        "Read bottom-up. Seq Scan on large table = missing index. Estimate ≠ actual = stale stats, run ANALYZE.",
    },
    {
      question: "What is the N+1 query problem and how do you fix it?",
      tag: "N+1 query problem",
      answer: [
        "N+1 happens when you fetch a list of N rows and then issue one query per row to load related data — totalling N+1 round trips. Example: fetch 100 posts, then query the author for each post separately = 101 queries.",
        "Fix with a JOIN: `SELECT posts.*, users.email FROM posts JOIN users ON users.id = posts.author_id` — one query, one round trip.",
        "In ORMs: use eager loading. In Rails: `Post.includes(:author)`. In Prisma: `findMany({ include: { author: true } })`. In TypeORM: `find({ relations: ['author'] })`.",
        "Detect it: enable query logging and look for repeated identical queries with different id values. `EXPLAIN ANALYZE` on a single query misses the pattern — you need to count total queries per request.",
      ].join("\n\n"),
      callout:
        "N+1 = 101 queries where 1 JOIN would do. The fix is always eager loading or a single JOIN.",
    },
    {
      question: "What are the normal forms (1NF, 2NF, 3NF) in plain English?",
      tag: "Normalisation",
      answer: [
        "1NF (First Normal Form): every column holds one atomic value. No comma-separated lists in a cell, no arrays masquerading as a column. Each row is uniquely identifiable (has a primary key).",
        "2NF (Second Normal Form): no partial dependency. Relevant only when the primary key is composite — every non-key column must depend on the entire composite key, not just part of it. Move partially dependent columns to their own table.",
        "3NF (Third Normal Form): no transitive dependency. Non-key columns must depend only on the primary key, not on other non-key columns. If `city → country`, and `city` is a non-key column, extract `cities(city, country)` as its own table.",
        "Practical target: 3NF for OLTP schemas. Denormalise deliberately (add redundant columns) only when a specific query is measurably slow and the denormalisation does not create update anomalies you cannot maintain.",
      ].join("\n\n"),
      callout:
        "1NF: atomic values. 2NF: whole key. 3NF: nothing but the key. Denormalise only with evidence.",
    },
    {
      question:
        "What is the difference between optimistic and pessimistic locking?",
      tag: "Optimistic vs pessimistic locking",
      answer: [
        "Pessimistic locking: lock the row when you read it (`SELECT ... FOR UPDATE`). Other transactions block until you commit or roll back. Safe against conflicts, but reduces concurrency and can deadlock.",
        "Optimistic locking: read the row without locking it, carry a version number (or timestamp). At write time, check that the version has not changed. If it has, abort and retry. No locks held between read and write — better throughput when conflicts are rare.",
        "Optimistic locking pattern in SQL: `UPDATE items SET stock = stock - 1, version = version + 1 WHERE id = 1 AND version = 7` — if 0 rows are updated, another transaction beat you; retry.",
        "Choose pessimistic when conflicts are frequent or the retry cost is high (e.g. payment processing). Choose optimistic when conflicts are rare and retries are cheap (e.g. user profile updates).",
      ].join("\n\n"),
      callout:
        "Pessimistic: lock on read, block others. Optimistic: check version on write, retry on conflict.",
    },
    {
      question: "When should you choose NoSQL over a relational database?",
      tag: "SQL vs NoSQL",
      answer: [
        "Document store (MongoDB): the data is genuinely document-shaped — deeply nested, variable structure, always read and written as a whole document. Avoid if you need cross-document transactions or ad-hoc joins frequently.",
        "Key-value (Redis): access pattern is pure key lookup, sub-millisecond latency is required, and the data fits in RAM. Best for cache, sessions, rate-limit counters, and pub/sub. Not a primary store.",
        "Wide-column (Cassandra / DynamoDB): you need multi-region writes, the write rate exceeds ~10k/s sustained, and your access patterns are known upfront. Schema is designed around queries, not relations.",
        "The practical answer for most teams: start with PostgreSQL. It supports JSONB for flexible columns, `tsvector` for search, and scales to tens of millions of rows on modest hardware. Add a specialised store only when you have measured evidence that Postgres cannot serve the workload.",
      ].join("\n\n"),
      callout:
        "Default to PostgreSQL. Add Redis for cache. Add a specialist store only with measured evidence.",
    },
    {
      question:
        "What is a write-ahead log (WAL) and how does it provide durability?",
      tag: "WAL / durability",
      answer: [
        "The WAL (write-ahead log) is an append-only file the database writes to before modifying any data pages. Every change is recorded as a log record first. The DB fsyncs the WAL record before ACKing the client's COMMIT.",
        "On a crash, the database replays the WAL from the last checkpoint to recover committed transactions and discard uncommitted ones. Data pages on disk may be stale, but the WAL has the truth.",
        "WAL also enables streaming replication: standbys consume the primary's WAL stream in near real-time, maintaining a hot replica. Point-in-time recovery (PITR) replays WAL up to any moment.",
        "Performance implication: every commit requires at least one fsync. `synchronous_commit = off` in PostgreSQL skips the fsync for a performance gain at the cost of losing up to `wal_writer_delay` (200ms default) of commits on a crash — useful for analytics, risky for money.",
      ].join("\n\n"),
      callout:
        "WAL: write the log first, then the data page. Crash recovery replays from last checkpoint.",
    },
    {
      question: "What is a foreign key and what does ON DELETE CASCADE do?",
      tag: "Foreign keys",
      answer: [
        "A foreign key constraint declares that a column's value must match a value in another table's primary key (or unique key). It prevents orphaned rows — you cannot insert a `post` with an `author_id` that does not exist in `users`.",
        "`ON DELETE CASCADE`: when a referenced parent row is deleted, the database automatically deletes all child rows referencing it. Useful for ownership hierarchies (delete user → delete their posts).",
        "`ON DELETE RESTRICT` (default): prevents deleting a parent row while child rows reference it. `ON DELETE SET NULL`: sets the FK column to NULL on parent delete. `ON DELETE SET DEFAULT`: sets the FK column to its default value.",
        "Foreign keys add a small write overhead (constraint check) but prevent a class of data integrity bugs that are very expensive to fix in production. Always define them on OLTP schemas unless you have a specific performance reason not to (bulk-load pipelines).",
      ].join("\n\n"),
      callout:
        "Foreign keys enforce referential integrity at the DB level — no orphaned rows. Always define them on OLTP schemas.",
    },
    {
      question:
        "What is a database migration and how should you manage schema changes?",
      tag: "Schema migrations",
      answer: [
        "A migration is a versioned, repeatable script that changes the schema (or data) in a controlled way. Each migration has an up (apply) and optionally a down (revert). Migration tools (Flyway, Liquibase, Alembic, golang-migrate, Prisma Migrate) track which migrations have run in a `schema_migrations` table.",
        "For zero-downtime deployments: make schema changes backward-compatible first. Add columns as nullable before making them NOT NULL. Use the expand-contract (parallel-change) pattern: add new column → backfill → switch code → drop old column across separate deploys.",
        "Never rename a column in one migration in a live system — it breaks the running app reading the old name. Add the new column, migrate data, update the app, then drop the old column in a later deploy.",
        "Lock-safety: `ALTER TABLE ADD COLUMN NOT NULL DEFAULT` in PostgreSQL before PG 11 rewrites the whole table — use `ADD COLUMN` + `SET DEFAULT` + `NOT NULL` separately with `pg_repack` or time the migration in a maintenance window.",
      ].join("\n\n"),
      callout:
        "Expand-contract: add → backfill → switch → drop across separate deploys. Never rename in one shot on a live system.",
    },
  ],
  bullets: [
    "Run `EXPLAIN ANALYZE` on a query before and after adding an index — note the Seq Scan → Index Scan change and actual timing.",
    "Simulate a concurrent lost-update with two `psql` sessions; fix it with `SELECT FOR UPDATE` and confirm the second session blocks.",
    "Before Day 4, be able to explain B-tree height, the leftmost prefix rule, and the difference between Read Committed and Repeatable Read in under two minutes.",
  ],
} satisfies RoadmapDayDetail;
