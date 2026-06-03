import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_9_DETAIL = {
  overview: [
    "Database schema design is the skill of turning your domain into tables and constraints that make bad data impossible to store. A well-designed schema enforces correctness so your application code does not have to. A poorly designed one means years of data corruption patches.",
    "Today covers entity-relationship modeling, normalization up to 3NF, how to use foreign keys and constraints properly, and how to change a live production schema without downtime.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "tZsM9nN0SVQ", title: "How To Design A Relational Database Schema" },
      ],
    },
    {
      title: "Entity-relationship modeling",
      blocks: [
        {
          type: "diagram",
          id: "erd-one-many",
        },
        {
          type: "table",
          caption: "Figure out the cardinality of each relationship first — the table structure follows from that.",
          headers: ["Cardinality", "Example", "Implementation"],
          rows: [
            [
              "One-to-many (1:N)",
              "One user has many posts",
              "Foreign key on the 'many' side: posts.user_id → users.id",
            ],
            [
              "Many-to-many (M:N)",
              "Posts have many tags; tags belong to many posts",
              "Junction table: post_tags(post_id, tag_id) — each row is one link",
            ],
            [
              "One-to-one (1:1)",
              "User has one profile",
              "Foreign key + UNIQUE on the child: profiles.user_id UNIQUE",
            ],
          ],
        },
        {
          type: "code",
          title: "Users → Posts (1:N) with FK constraint",
          code: `CREATE TABLE users (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE posts (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 255),
  status     TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);`,
        },
      ],
    },
    {
      title: "Normalization — 1NF through 3NF",
      blocks: [
        {
          type: "table",
          caption: "Stop at 3NF for most OLTP schemas. Only denormalize when you have measured a real read bottleneck.",
          headers: ["Normal Form", "Rule", "Violation example → fix"],
          rows: [
            [
              "1NF",
              "Every cell holds one atomic value; no repeating groups",
              'tags: "backend,api,node" in one column → separate post_tags table',
            ],
            [
              "2NF",
              "Every non-key column depends on the entire primary key (relevant for composite keys)",
              "order_items(order_id, product_id, product_name) — product_name depends only on product_id → move to products table",
            ],
            [
              "3NF",
              "No transitive dependency: non-key column must not depend on another non-key column",
              "employees(id, dept_id, dept_name) — dept_name depends on dept_id → separate departments table",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Normalization cuts down on duplicate data and keeps writes consistent — update a department name in one place and it updates everywhere. Only denormalize when you have measured a real read performance problem, not because you think it might be slow.",
        },
      ],
    },
    {
      title: "Constraints — make invalid state impossible",
      blocks: [
        {
          type: "table",
          headers: ["Constraint", "DDL", "What it enforces"],
          rows: [
            ["NOT NULL", "column TEXT NOT NULL", "Column must always have a value"],
            [
              "UNIQUE",
              "email TEXT UNIQUE or UNIQUE(a,b)",
              "No two rows share the same value(s)",
            ],
            [
              "CHECK",
              "CHECK (age >= 0 AND age < 150)",
              "Arbitrary boolean expression must be true",
            ],
            [
              "FOREIGN KEY",
              "REFERENCES users(id) ON DELETE CASCADE",
              "Referential integrity — child row cannot point to non-existent parent",
            ],
            [
              "PRIMARY KEY",
              "id BIGSERIAL PRIMARY KEY",
              "Unique + not null; clustered index in most engines",
            ],
            [
              "EXCLUSION",
              "EXCLUDE USING gist (room WITH =, period WITH &&)",
              "PostgreSQL: no two rows overlap on given operators (calendar bookings)",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "ON DELETE CASCADE removes child rows automatically when the parent is deleted — convenient but can surprise you if you accidentally delete a parent with thousands of children. RESTRICT blocks the deletion and forces you to clean up children yourself. SET NULL leaves the child rows but clears the foreign key column. Choose based on what your domain actually requires.",
        },
      ],
    },
    {
      title: "Migration workflow — schema changes without downtime",
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            "Add the new column as nullable — this is instant and does not lock the table. Existing rows keep NULL.",
            "Backfill the data in batches using LIMIT to avoid one giant long-running transaction.",
            "Add NOT NULL or a DEFAULT once all rows have the new value. In PostgreSQL 11+, adding a constant DEFAULT does not rewrite the table.",
            "Drop the old column in a later deploy once all code is using the new one.",
          ],
        },
        {
          type: "code",
          title: "Safe column rename pattern (expand-contract)",
          code: `-- Deploy 1: add new column (fast, no lock)
ALTER TABLE users ADD COLUMN display_name TEXT;

-- Deploy 2: dual-write in application code (write both columns)
-- background job: UPDATE users SET display_name = name WHERE display_name IS NULL;

-- Deploy 3: add NOT NULL after backfill is complete
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;

-- Deploy 4: remove old column after all reads use display_name
ALTER TABLE users DROP COLUMN name;`,
        },
        {
          type: "table",
          caption: "Migration tools comparison",
          headers: ["Tool", "Language", "Key feature"],
          rows: [
            ["Flyway", "Java / any", "SQL-first, version numbered files, checksum validation"],
            ["Liquibase", "Java / any", "XML/YAML/SQL changesets, rollback support"],
            ["golang-migrate", "Go", "CLI + Go library, up/down migrations"],
            ["Prisma Migrate", "Node/TypeScript", "Schema-first, auto-generates SQL from schema.prisma"],
            ["Knex.js migrations", "Node", "JS migration files, up/down functions"],
          ],
        },
      ],
    },
    {
      title: "Index design fundamentals",
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            "Add an index on every foreign key column. Without one, ON DELETE CASCADE has to scan the entire child table.",
            "Column order matters in composite indexes. An index on (user_id, created_at) works for queries filtering on user_id alone or user_id + created_at. It won't help for created_at alone.",
            "Partial index: CREATE INDEX idx_active ON posts(user_id) WHERE status = 'published' — smaller index, faster for the query you actually run.",
            "Covering index: add all the columns a query needs into the index using the INCLUDE clause so the database never has to touch the main table rows.",
            "Every index adds write overhead and takes up space. Only index columns you actually query — not speculatively.",
          ],
        },
        {
          type: "code",
          title: "EXPLAIN ANALYZE — read the plan",
          code: `EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT p.id, p.title, u.email
FROM posts p
JOIN users u ON u.id = p.user_id
WHERE p.status = 'published'
ORDER BY p.created_at DESC
LIMIT 20;

-- Look for:
-- Seq Scan  → missing index
-- Bitmap Heap Scan → index used but many rows; consider partial index
-- Index Scan → ideal for small result sets
-- Nested Loop / Hash Join → check join columns are indexed`,
        },
      ],
    },
    {
      title: "Surrogate vs natural keys",
      blocks: [
        {
          type: "table",
          headers: ["Key type", "Example", "Pros", "Cons"],
          rows: [
            [
              "Surrogate (BIGSERIAL / UUID)",
              "id BIGSERIAL PRIMARY KEY",
              "Stable, no business meaning leaking into DB; simple FK joins",
              "Extra column; no inherent uniqueness of business data",
            ],
            [
              "Natural (email, ISBN)",
              "PRIMARY KEY (email)",
              "Self-documenting; one less join sometimes",
              "Changes when business data changes; longer FK columns; often not actually unique",
            ],
            [
              "UUID v4",
              "id UUID DEFAULT gen_random_uuid()",
              "Globally unique; safe to generate in the client; good for distributed inserts",
              "Larger (16 bytes vs 8); random UUIDs cause index fragmentation in Postgres",
            ],
            [
              "UUID v7 (2024+)",
              "id UUID DEFAULT gen_ulid_v7()",
              "Time-ordered — sequential inserts, no fragmentation; globally unique",
              "Requires Postgres 17 or extension; newer standard",
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is database normalization and why does it matter?",
      tag: "Normalization",
      answer: [
        "Normalization is the process of organizing your schema to remove duplicate data and prevent inconsistencies. 1NF removes cells with multiple values, 2NF removes partial dependencies on composite keys, 3NF removes dependencies between non-key columns.",
        "It matters because duplicate data causes update problems: if you store a department name in every employee row and then rename the department, some rows get updated and some do not — now your data is wrong. A normalized schema makes writes correct by design.",
      ].join("\n\n"),
      callout: "Normalize for correctness, denormalize for measured read performance.",
    },
    {
      question: "What is the expand-contract pattern for zero-downtime migrations?",
      tag: "Migrations",
      answer: [
        "Expand-contract is a way to change your schema in small, safe steps that don't require locking or downtime. The expand phase adds new structures (columns, tables) alongside the old ones. The app is updated to write to both. A backfill fills in historical data. The contract phase removes the old structures once all code uses the new ones.",
        "Each individual step is safe: adding a nullable column is instant in PostgreSQL, adding NOT NULL after a backfill takes a short lock, and dropping an unused column is fast. This replaces the dangerous all-at-once migration (rename + backfill + drop in one step) with a safe sequence deployed over time.",
      ].join("\n\n"),
    },
    {
      question: "When should I use UUID vs BIGSERIAL as a primary key?",
      tag: "Primary keys",
      answer: [
        "Use BIGSERIAL (auto-increment) for most tables — it is 8 bytes, sequential, and the database generates it for you with no coordination needed.",
        "Use UUID v7 (time-ordered) when: you need to generate the ID before inserting it; you have multiple writers and need globally unique IDs without coordination; or you are building a multi-tenant system where IDs must be unique across shards. Avoid UUID v4 for large tables — random IDs scatter inserts across the B-tree index and cause fragmentation.",
      ].join("\n\n"),
    },
    {
      question: "How do foreign key constraints affect performance?",
      tag: "Foreign keys",
      answer: [
        "When you insert or update a child row, the database checks that the referenced parent exists — a lookup on the parent's primary key, which is always indexed and fast.",
        "When you delete a parent with ON DELETE CASCADE, the database finds and deletes all child rows. Without an index on the FK column in the child table, that is a full table scan. Always index FK columns on the child side. The overhead is small for normal OLTP write rates and the benefit — guaranteed referential integrity — is worth it.",
      ].join("\n\n"),
    },
    {
      question: "What is a junction table and when do you need one?",
      tag: "Many-to-many",
      answer: [
        "A junction table resolves a many-to-many relationship. If posts can have multiple tags and tags can belong to multiple posts, a post_tags(post_id, tag_id) table with a composite primary key and two foreign keys models this correctly.",
        "Never store multiple IDs in one column as a comma-separated list — this violates 1NF and makes every query painful. The junction table is the right relational model.",
      ].join("\n\n"),
      callout: "Comma-separated IDs in a column is always wrong. Use a junction table.",
    },
    {
      question: "What does ON DELETE CASCADE vs ON DELETE RESTRICT do?",
      tag: "FK behavior",
      answer: [
        "ON DELETE CASCADE: when a parent row is deleted, all child rows referencing it are automatically deleted. Convenient but dangerous if you accidentally delete a parent that has thousands of children.",
        "ON DELETE RESTRICT (default): the delete is blocked if any child rows exist. Safer — forces the application to explicitly clean up children before removing the parent.",
        "SET NULL: the FK column in the children is cleared rather than deleting the rows. Useful when a child can exist without a parent.",
      ].join("\n\n"),
    },
    {
      question: "How should I handle long-running migrations on a live database?",
      tag: "Migrations",
      answer: [
        "Long ALTER TABLE statements take a lock that blocks reads and writes. For large tables: add columns as nullable with no default (instant, no rewrite); backfill in small batches with LIMIT + WHERE to avoid one giant transaction; add constraints in a separate step after the backfill.",
        "For index creation, use CREATE INDEX CONCURRENTLY — it builds without locking the table, just takes longer. Use pg_repack or Percona Online Schema Change for MySQL to perform table rewrites without downtime.",
      ].join("\n\n"),
    },
    {
      question: "What is a composite index and how do you decide column order?",
      tag: "Indexes",
      answer: [
        "A composite index covers multiple columns. Column order determines which query patterns it can serve. An index on (a, b, c) helps queries filtering on: a alone, a + b, or a + b + c. It will not efficiently help b alone or c alone.",
        "General rule: put the most selective column first (the one with the most unique values), then the column used in ORDER BY or range filters. The leading column must appear in the WHERE clause for the index to be used.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Design an ERD for a simple e-commerce schema (users, products, orders, order_items) and implement it in SQL with all FK constraints.",
    "Write a safe migration that adds a non-nullable column to a table that already has 1M rows using the expand-contract pattern.",
    "Use EXPLAIN ANALYZE on a query with a JOIN — identify whether it uses an index scan or a sequential scan and explain why.",
  ],
} satisfies RoadmapDayDetail;
