import type { RoadmapDayDetail } from "./challenge-data";

export const DAY_13_DETAIL = {
  overview: [
    "Search is not just SQL LIKE queries. Full-text search, relevance ranking, faceting, and autocomplete are fundamentally different access patterns from key-value lookups or range scans. Understanding the inverted index data structure explains why Elasticsearch and PostgreSQL full-text search exist and when to reach for each.",
    "Day 13 covers B-tree and inverted indexes, PostgreSQL full-text search, Elasticsearch fundamentals, indexing strategies for production, and when to add a dedicated search engine vs optimise the DB.",
  ],
  sections: [
    {
      title: "B-tree index — the default index",
      blocks: [
        {
          type: "diagram",
          id: "btree-index",
        },
        {
          type: "paragraph",
          text: "A B-tree (balanced tree) is the default index type in PostgreSQL and MySQL. It stores sorted key values in a tree, allowing O(log n) lookups, range scans, and ORDER BY operations. B-trees support =, <, >, <=, >=, BETWEEN, and LIKE 'prefix%' predicates.",
        },
        {
          type: "table",
          headers: ["B-tree strengths", "B-tree limitations"],
          rows: [
            ["Equality and range queries on any comparable type", "Full-text search — no relevance ranking"],
            ["ORDER BY on indexed columns — no sort needed", "LIKE '%suffix' or '%middle%' — cannot use B-tree prefix property"],
            ["Supports multicolumn composite indexes", "Array containment, JSON search — use GIN instead"],
            ["Covered queries with INCLUDE columns", "Geo distance queries — use GIST or PostGIS"],
          ],
        },
        {
          type: "code",
          title: "Index types in PostgreSQL",
          code: `-- B-tree (default): equality, range, ORDER BY
CREATE INDEX idx_posts_status_date ON posts(status, created_at DESC);

-- GIN: full-text search, JSONB, array containment
CREATE INDEX idx_posts_fts ON posts USING GIN(to_tsvector('english', title || ' ' || body));
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);  -- tags is text[]

-- GIST: geometric data, range types, exclusion constraints
CREATE INDEX idx_bookings_range ON bookings USING GIST(tstzrange(starts_at, ends_at));

-- BRIN: very large tables with naturally ordered data (time-series)
CREATE INDEX idx_events_time ON events USING BRIN(created_at);  -- tiny, good for append-only`,
        },
      ],
    },
    {
      title: "Inverted index — full-text search",
      blocks: [
        {
          type: "diagram",
          id: "inverted-index",
        },
        {
          type: "paragraph",
          text: "An inverted index maps each unique term to the list of documents containing it, plus position and frequency data. This is the data structure behind every search engine. A query for 'distributed systems' looks up both terms in O(1), intersects the document lists, and ranks by relevance — in milliseconds across billions of documents.",
        },
        {
          type: "table",
          headers: ["Concept", "Explanation"],
          rows: [
            ["Tokenisation", "Split text into tokens: 'Hello World' → ['hello', 'world']"],
            ["Normalisation / stemming", "'Running', 'runs', 'ran' → 'run' (root form)"],
            ["Stop word removal", "Remove high-frequency words: 'the', 'a', 'is' — add noise, no signal"],
            ["TF-IDF", "Term frequency × inverse document frequency — common in this doc, rare globally = high score"],
            ["BM25", "Improved TF-IDF used by Elasticsearch and PostgreSQL tsrank — handles document length normalisation"],
          ],
        },
      ],
    },
    {
      title: "PostgreSQL full-text search",
      blocks: [
        {
          type: "code",
          title: "Full-text search with ranking",
          code: `-- tsvector: preprocessed document (tokens + positions)
-- tsquery: parsed query expression

-- Ad-hoc search
SELECT id, title,
  ts_rank(to_tsvector('english', title || ' ' || body),
          to_tsquery('english', 'distributed & systems')) AS rank
FROM posts
WHERE to_tsvector('english', title || ' ' || body)
   @@ to_tsquery('english', 'distributed & systems')
ORDER BY rank DESC
LIMIT 10;

-- Better: pre-compute and store the tsvector column
ALTER TABLE posts ADD COLUMN search_vec tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,''))) STORED;

CREATE INDEX idx_posts_search ON posts USING GIN(search_vec);

-- Now the query is fast and clean
SELECT id, title, ts_rank(search_vec, query) AS rank
FROM posts, to_tsquery('english', 'distributed & systems') query
WHERE search_vec @@ query
ORDER BY rank DESC
LIMIT 10;`,
        },
        {
          type: "table",
          headers: ["Operator", "Meaning", "Example"],
          rows: [
            ["&", "AND — both terms must match", "'distributed' & 'systems'"],
            ["|", "OR — either term", "'postgres' | 'postgresql'"],
            ["!", "NOT — exclude term", "'sql' & !'nosql'"],
            ["<->", "Phrase — terms adjacent in order", "'load' <-> 'balancer'"],
            ["plainto_tsquery", "Natural language input (spaces = AND)", "plainto_tsquery('distributed systems')"],
            ["websearch_to_tsquery", "Google-style syntax with quotes and minus", `websearch_to_tsquery('"load balancer" -nginx')`],
          ],
        },
      ],
    },
    {
      title: "Elasticsearch fundamentals",
      blocks: [
        {
          type: "paragraph",
          text: "Elasticsearch (built on Apache Lucene) is a distributed search engine designed for full-text search at scale. It shards indexes across nodes, replicates shards for availability, and provides rich query DSL, aggregations, and near-real-time search.",
        },
        {
          type: "code",
          title: "Elasticsearch index + search (REST API)",
          code: `# Create an index with mappings
PUT /posts
{
  "mappings": {
    "properties": {
      "title":      { "type": "text", "analyzer": "english" },
      "body":       { "type": "text", "analyzer": "english" },
      "status":     { "type": "keyword" },
      "created_at": { "type": "date" },
      "tags":       { "type": "keyword" }
    }
  }
}

# Search with full-text + filter + sort + pagination
POST /posts/_search
{
  "query": {
    "bool": {
      "must":   { "multi_match": { "query": "distributed systems", "fields": ["title^3", "body"] }},
      "filter": { "term": { "status": "published" }}
    }
  },
  "sort": [{ "_score": "desc" }, { "created_at": "desc" }],
  "from": 0, "size": 10
}`,
        },
        {
          type: "table",
          caption: "text vs keyword — the most common Elasticsearch mapping mistake.",
          headers: ["Type", "Analysed?", "Use for"],
          rows: [
            ["text", "Yes — tokenised, stemmed, lowercased", "Full-text search: article body, descriptions"],
            ["keyword", "No — exact string", "Filtering, aggregations, sorting: status, tag, email"],
          ],
        },
      ],
    },
    {
      title: "Index strategies for production",
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            "Index only what you query: each index increases write overhead and storage. Run EXPLAIN ANALYZE to find missing indexes, not speculation.",
            "Partial indexes: if 95% of your reads filter by status='active', index only active rows — the index is 5% of the size and fits in memory.",
            "Index-only scans: use INCLUDE to add non-search columns to the index so the query never touches the heap. Postgres 11+.",
            "Unused index audit: pg_stat_user_indexes.idx_scan = 0 after a week of traffic means the index is unused — drop it.",
            "Reindex CONCURRENTLY: rebuild a bloated index without locking the table. Monitor pg_stat_progress_create_index.",
          ],
        },
        {
          type: "code",
          title: "Find slow queries and missing indexes",
          code: `-- Enable query statistics
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Top 10 slowest queries
SELECT query, calls, mean_exec_time::int AS avg_ms, total_exec_time::int AS total_ms
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Unused indexes (safe to drop after verifying)
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;`,
        },
      ],
    },
    {
      title: "PostgreSQL vs Elasticsearch — when to add Elasticsearch",
      blocks: [
        {
          type: "table",
          headers: ["Use case", "PostgreSQL FTS", "Elasticsearch"],
          rows: [
            ["Simple keyword search on one table", "✅ GIN index + tsquery is sufficient", "Overkill — extra infra for no gain"],
            ["Relevance ranking with multiple fields", "✅ ts_rank / ts_rank_cd works well", "✅ BM25 + field boosting is more expressive"],
            ["Autocomplete / prefix search", "✅ trigram index (pg_trgm) or prefix tsquery", "✅ edge-ngram analyzer is cleaner"],
            ["Faceted search (filter counts by category)", "Possible but complex (crosstab)", "✅ Aggregations built-in"],
            ["Multi-tenant search across billions of docs", "Challenging to shard without pgpool/Citus", "✅ Horizontal sharding built-in"],
            ["Near-real-time search updates", "✅ Generated column + GIN index updates synchronously", "Async indexing — ~1 second delay by default"],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is an inverted index and how does full-text search use it?",
      tag: "Inverted index",
      answer: [
        "An inverted index maps each unique term to the list of documents (and positions within documents) containing that term. It is called 'inverted' because it inverts the document→words structure into words→documents.",
        "A full-text query looks up each search term in the inverted index in O(1), retrieves the posting lists (document IDs), intersects or unions them depending on the query operator (AND/OR), and ranks the results by term frequency and rarity (TF-IDF / BM25). This is how Google returns results in milliseconds from trillions of indexed pages.",
      ].join("\n\n"),
      callout: "B-tree for structured lookups. Inverted index for relevance search. Know both.",
    },
    {
      question: "What is the difference between text and keyword types in Elasticsearch?",
      tag: "Elasticsearch",
      answer: [
        "A text field is analysed: the content is tokenised, stemmed, and lowercased before indexing. Searching a text field performs full-text matching with relevance scoring. You cannot sort or aggregate on a text field because each document may have many tokens.",
        "A keyword field is not analysed: it is stored as an exact string. Use keyword for filtering (WHERE status = 'published'), sorting, and aggregations (GROUP BY tag). Mapping a field that needs both to dual text+keyword (multi-fields) is common.",
      ].join("\n\n"),
    },
    {
      question: "When should you use PostgreSQL full-text search vs Elasticsearch?",
      tag: "Search engine choice",
      answer: [
        "PostgreSQL FTS is excellent for: simple keyword search on a single table with moderate data volume; cases where you want synchronous indexing (no delay between write and search); and teams that want to avoid operating an extra service.",
        "Elasticsearch is better for: faceted search with aggregations; cross-index search across heterogeneous data; very high search query volumes; advanced relevance tuning; and sub-second autocomplete at scale. The operational cost of Elasticsearch (cluster management, mapping evolution, replication) is significant — only add it when PostgreSQL FTS genuinely cannot meet your requirements.",
      ].join("\n\n"),
    },
    {
      question: "What is a GIN index and when do you use it instead of a B-tree?",
      tag: "PostgreSQL indexes",
      answer: [
        "GIN (Generalised Inverted Index) is designed for composite values — full-text tsvector columns, JSONB documents, and array columns. It indexes each element within the value rather than the value as a whole, enabling efficient containment queries like @>, <@, and @@.",
        "Use GIN when: querying JSONB fields with @> (contains); using tsvector @@ tsquery for full-text; checking array membership with ANY() or @>. B-tree is faster for equality/range on simple scalar columns; GIN is faster for element-level queries on composite types.",
      ].join("\n\n"),
    },
    {
      question: "What is a partial index and when is it beneficial?",
      tag: "Partial indexes",
      answer: [
        "A partial index is built only on a subset of rows matching a WHERE clause: CREATE INDEX idx_active_users ON users(email) WHERE status = 'active'. If only 10% of users are active, the index is 10% of the size of a full index, fits in memory more easily, and is faster to scan.",
        "Beneficial when: a large portion of rows is never queried (soft-deleted records, expired items, inactive users); the filtered subset is the hot access path; the filtering condition is a stable enum value.",
      ].join("\n\n"),
    },
    {
      question: "How do you find and remove unused indexes?",
      tag: "Index maintenance",
      answer: [
        "PostgreSQL tracks index usage in pg_stat_user_indexes. After at least a week of representative production traffic, query idx_scan — indexes with zero scans are unused. Verify with EXPLAIN ANALYZE on likely queries before dropping.",
        "Always drop during a low-traffic window and confirm the query planner picks a different plan. Unused indexes add write overhead and storage with no read benefit — remove them.",
      ].join("\n\n"),
      callout: "Dead indexes are worse than no indexes — they slow down writes without helping reads.",
    },
    {
      question: "What is BM25 and how is it better than TF-IDF?",
      tag: "Relevance ranking",
      answer: [
        "TF-IDF scores a term by how frequently it appears in the document (TF) multiplied by how rarely it appears across all documents (IDF). A term common in one document but rare globally gets a high score.",
        "BM25 improves on TF-IDF with two corrections: (1) term frequency saturation — after a certain frequency, additional occurrences add diminishing score (prevents a document with 1000 mentions of 'database' from dominating); (2) document length normalisation — a term in a short document scores higher than the same term in a 10,000-word essay. BM25 is the default in Elasticsearch and PostgreSQL ts_rank_cd.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Add a generated tsvector column to a posts table, build a GIN index, and write a search endpoint that ranks results by ts_rank.",
    "Build an Elasticsearch index with title (text), status (keyword), and tags (keyword), then write a bool query that combines full-text search with a status filter.",
    "Run pg_stat_statements on a database after generating traffic, find the top 3 slowest queries, and add the missing index for one of them.",
  ],
} satisfies RoadmapDayDetail;
