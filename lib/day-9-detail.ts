import type { RoadmapDayDetail } from "./challenge-data";

export const DAY_9_DETAIL = {
  overview: [
    "Relational modeling is the skill of translating a domain into tables, keys, and constraints that make invalid states impossible to represent. Done well, the schema enforces correctness so your application code does not have to. Done poorly, you spend the next two years patching data corruption.",
    "Day 9 covers entity-relationship modeling, normalization through 3NF, foreign-key and constraint design, and the migration workflow that lets you change a production schema without downtime.",
  ],
  sections: [
    {
      title: "Entity-relationship modeling",
      blocks: [
        {
          type: "diagram",
          id: "erd-one-many",
        },
        {
          type: "table",
          caption: "Model relationships by cardinality first — the table structure follows.",
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
          caption: "Stop at 3NF for most OLTP schemas; denormalize deliberately for read-heavy paths.",
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
          text: "Normalization reduces redundancy and makes writes consistent — update dept_name in one place, not every employee row. Denormalize when you measure a real read bottleneck, not speculatively.",
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
          text: "ON DELETE behaviour: CASCADE removes child rows automatically. RESTRICT blocks the parent delete if children exist. SET NULL nullifies the FK. Choose based on your domain — cascade is convenient but can surprise you.",
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
            "Expand: add the new column as nullable (no lock on the table, existing rows keep NULL).",
            "Backfill: UPDATE rows in batches to populate the new column. Use a loop with LIMIT to avoid long-running transactions.",
            "Constrain: add NOT NULL / DEFAULT once all rows are populated. In PostgreSQL 11+, adding DEFAULT with a constant does not rewrite the table.",
            "Contract: remove the old column in a later deploy after all code paths use the new one.",
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
            "Create an index on every foreign key column — without it, ON DELETE CASCADE scans the child table.",
            "Composite indexes: column order matters. An index on (user_id, created_at) serves queries filtering by user_id alone or user_id + created_at; it does not serve created_at alone.",
            "Partial index: CREATE INDEX idx_active ON posts(user_id) WHERE status = 'published' — smaller, faster for the common query.",
            "Covering index: include all columns the query needs so the engine never touches the table heap (PostgreSQL INCLUDE clause).",
            "Every index adds write overhead and storage — index for your actual query patterns, not defensively.",
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
        "Normalization is a process of organizing a schema to reduce data redundancy and ensure data integrity. Each normal form removes a class of anomaly: 1NF removes multi-valued cells, 2NF removes partial dependencies on composite keys, 3NF removes transitive dependencies.",
        "It matters because redundant data creates update anomalies: you update a department name in one employee row but not others, and now your data is inconsistent. Normalized schemas make writes correct by construction.",
      ].join("\n\n"),
      callout: "Normalize for correctness, denormalize for measured read performance.",
    },
    {
      question: "What is the expand-contract pattern for zero-downtime migrations?",
      tag: "Migrations",
      answer: [
        "Expand-contract is a technique for schema changes that avoids locking or downtime. The expand phase adds new structures (columns, tables) alongside the old ones. The application is updated to write to both. A backfill populates historical data. The contract phase removes the old structures once all code uses the new ones.",
        "This works because each individual migration step is safe: adding a nullable column is instant in PostgreSQL, adding a NOT NULL constraint after backfill takes a short lock, and dropping an unused column is fast. The dangerous all-at-once migration (rename + backfill + drop in one step) is replaced by a sequence of safe steps deployed over time.",
      ].join("\n\n"),
    },
    {
      question: "When should I use UUID vs BIGSERIAL as a primary key?",
      tag: "Primary keys",
      answer: [
        "Use BIGSERIAL (or BIGINT auto-increment) for most tables: it is 8 bytes, sequential, and causes no index fragmentation. The sequence is generated by the DB so there is no coordination needed.",
        "Use UUID v7 (time-ordered) when: (a) you need to generate the ID before inserting (distribute ID generation), (b) you have multiple writers and want globally unique IDs without coordination, or (c) you are building a multi-tenant system where IDs must be globally unique across shards. Avoid UUID v4 for large tables — random insertion order fragments the B-tree index.",
      ].join("\n\n"),
    },
    {
      question: "How do foreign key constraints affect performance?",
      tag: "Foreign keys",
      answer: [
        "On INSERT/UPDATE of the child: the DB must verify the referenced parent row exists — a lookup on the parent's primary key (fast if indexed, which it always is as a PK).",
        "On DELETE of the parent: if ON DELETE CASCADE, the DB must find and delete all child rows — without an index on the FK column in the child table this is a sequential scan. Always index FK columns on the child side.",
        "The overhead is small for OLTP write rates. The benefit — guaranteed referential integrity — is worth it. Only skip FKs in bulk-load pipelines where you verify integrity externally.",
      ].join("\n\n"),
    },
    {
      question: "What is a junction table and when do you need one?",
      tag: "Many-to-many",
      answer: [
        "A junction (or join) table resolves a many-to-many relationship. If posts can have multiple tags and tags can belong to multiple posts, a post_tags(post_id, tag_id) table with a composite primary key and two foreign keys models this correctly.",
        "Never store multi-valued data in a single column (comma-separated IDs) — this violates 1NF and makes querying and joins painful. The junction table is the correct relational model.",
      ].join("\n\n"),
      callout: "Comma-separated IDs in a column is always wrong. Use a junction table.",
    },
    {
      question: "What does ON DELETE CASCADE vs ON DELETE RESTRICT do?",
      tag: "FK behavior",
      answer: [
        "ON DELETE CASCADE: when a parent row is deleted, all child rows referencing it are automatically deleted. Convenient but dangerous if accidental parent deletion cascades through thousands of rows.",
        "ON DELETE RESTRICT (default): the delete is blocked if child rows exist. Safer — forces the application to explicitly clean up children before removing the parent.",
        "SET NULL: the FK column in children is set to NULL rather than deleting the rows. Use when the child can exist without a parent.",
      ].join("\n\n"),
    },
    {
      question: "How should I handle long-running migrations on a live database?",
      tag: "Migrations",
      answer: [
        "Long ALTER TABLE statements take a lock that blocks reads and writes. For large tables: (1) add columns as nullable with no default — fast, no rewrite; (2) backfill in batches with LIMIT + WHERE to avoid one giant transaction; (3) add constraints in a separate step after backfill.",
        "For index creation, use CREATE INDEX CONCURRENTLY — it builds without locking the table, just takes longer. Use tools like pg_repack or Percona Online Schema Change for MySQL to perform table rewrites without downtime.",
      ].join("\n\n"),
    },
    {
      question: "What is a composite index and how do you decide column order?",
      tag: "Indexes",
      answer: [
        "A composite index covers multiple columns. Column order determines which query patterns it can serve. An index on (a, b, c) can serve queries filtering on: a alone, a + b, or a + b + c. It cannot efficiently serve b alone or c alone.",
        "The general rule: put the most selective column (highest cardinality, most unique values) first, then the column used in ORDER BY or range filters second. The leading column must be present in the WHERE clause for the index to be used.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Design an ERD for a simple e-commerce schema (users, products, orders, order_items) and implement it in SQL with all FK constraints.",
    "Write a safe migration that adds a non-nullable column to a table that already has 1M rows using the expand-contract pattern.",
    "Use EXPLAIN ANALYZE on a query with a JOIN — identify whether it uses an index scan or a sequential scan and explain why.",
  ],
} satisfies RoadmapDayDetail;
