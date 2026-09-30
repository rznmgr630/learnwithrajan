import type { LessonDay } from "@/lib/learn/lesson-types";

export const PAGINATION_DAY_47_LESSONS: LessonDay = {
  day: 47,
  title: "Pagination",
  totalMinutes: 100,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-47-lesson-1",
      title: "Offset Pagination",
      durationMinutes: 25,
      explanation: "Offset pagination uses a page number or offset together with a limit. A request such as ?page=3&limit=20 can be translated into OFFSET 40 LIMIT 20.\n\nIt is simple and works well for small datasets and administrative interfaces. It is also easy for clients to understand because users can jump directly to a page.\n\nThe main limitation is that large offsets can become expensive because the database may scan or skip many rows before returning the requested records. Offset pagination can also produce duplicates or missing records when rows are inserted or deleted between requests unless the ordering is carefully controlled.",
      diagram: "Request:\nGET /orders?page=3&limit=20\n\nDatabase:\nORDER BY created_at DESC\nOFFSET 40\nLIMIT 20\n\nResponse:\nitems + page metadata",
      codeExample: { title: "Example", code: "const page = Math.max(Number(query.page ?? 1), 1);\nconst limit = Math.min(Number(query.limit ?? 20), 100);\nconst offset = (page - 1) * limit;\n\nconst [items, total] = await repo.findAndCount({\n  order: { createdAt: \"DESC\" },\n  skip: offset,\n  take: limit,\n});" },
      keyTakeaways: [
        "Offset pagination is simple and supports direct page navigation.",
        "Always impose a maximum page size.",
        "Use deterministic ordering.",
        "Large offsets can become expensive."
      ],
      commonMistakes: [
        "Allowing unlimited limit values.",
        "Paginating without an ORDER BY.",
        "Assuming page numbers remain stable while the dataset changes."
      ],
      quiz: [
    {
      question: "What does page 3 with limit 20 usually mean?",
      options: ["Skip 40 records and return up to 20", "Skip 20 and return 3", "Return 3 records", "Return the entire table"],
      correctIndex: 0,
      explanation: "Offset is calculated as (page - 1) * limit."
    }
  ]
    },
    {
      id: "day-47-lesson-2",
      title: "Cursor and Keyset Pagination",
      durationMinutes: 30,
      explanation: "Cursor pagination returns a continuation token representing a position in an ordered result set. The client sends that cursor back to request the next page.\n\nKeyset pagination is a common implementation where the database uses the values of the ordering columns to find the next records. For example, if records are ordered by createdAt DESC and id DESC, the next query can ask for rows where (createdAt, id) is less than the last row's values.\n\nCursor/keyset pagination is usually better for large, frequently changing datasets because the database can use an index to seek to the next range. The tradeoff is more complexity: clients cannot naturally jump to page 50, and cursor encoding must be designed safely.",
      diagram: "First request:\nGET /orders?limit=20\n\nResponse:\nitems: [ ... ]\nnextCursor: \"eyJjcmVhdGVkQXQiOi...\"\n\nNext request:\nGET /orders?limit=20&cursor=...\n\nDB seeks after the last:\n(createdAt, id)",
      codeExample: { title: "Example", code: "// Conceptual keyset query:\n// ORDER BY created_at DESC, id DESC\n// WHERE (created_at, id) < (:lastCreatedAt, :lastId)\n\nconst cursor = decodeCursor(query.cursor);\n\nreturn repo\n  .createQueryBuilder(\"order\")\n  .where(\n    \"(order.createdAt, order.id) < (:createdAt, :id)\",\n    cursor\n  )\n  .orderBy(\"order.createdAt\", \"DESC\")\n  .addOrderBy(\"order.id\", \"DESC\")\n  .take(limit + 1)\n  .getMany();" },
      keyTakeaways: [
        "Cursors represent a position rather than a page number.",
        "Keyset pagination should use a deterministic indexed ordering.",
        "A unique tie-breaker such as id makes ordering stable.",
        "Cursor values should be treated as untrusted input and validated."
      ],
      commonMistakes: [
        "Using only a non-unique timestamp as the cursor.",
        "Allowing arbitrary client-provided cursor SQL fragments.",
        "Forgetting to encode or validate cursor data.",
        "Claiming cursor pagination supports arbitrary page jumps."
      ],
      quiz: [
    {
      question: "Why is a unique tie-breaker useful in keyset pagination?",
      options: ["It makes ordering deterministic when primary sort values are equal", "It encrypts the cursor", "It increases page size", "It disables indexes"],
      correctIndex: 0,
      explanation: "A unique secondary key prevents ambiguous positions."
    }
  ]
    },
    {
      id: "day-47-lesson-3",
      title: "Pagination Performance and API Design",
      durationMinutes: 25,
      explanation: "Pagination strategy should follow the data access pattern. Offset is convenient for small datasets and page-based UIs. Cursor/keyset is better for feeds, event streams, large tables, and continuously changing data.\n\nThe database needs an index that matches the filter and ordering pattern. Pagination itself cannot compensate for a poor query plan. You should inspect query plans, measure latency at realistic offsets, and cap requested page sizes.\n\nA practical API response should make continuation explicit. Offset APIs can return page, limit, total, and hasNext. Cursor APIs commonly return items, nextCursor, and hasNext. Returning the total count on every large cursor request can be unnecessarily expensive.",
      diagram: "Pagination choice\n      |\n      +--> Page navigation/reporting?\n      |        |\n      |       Offset\n      |\n      +--> Large/changing/feed data?\n               |\n          Cursor/Keyset\n\nBoth require:\nstable order + bounded page size + indexes",
      codeExample: { title: "Example", code: "type CursorPage<T> = {\n  items: T[];\n  nextCursor: string | null;\n  hasNext: boolean;\n};\n\ntype OffsetPage<T> = {\n  items: T[];\n  page: number;\n  limit: number;\n  total?: number;\n  hasNext: boolean;\n};" },
      keyTakeaways: [
        "Choose pagination based on consumer behavior and data size.",
        "Index the fields used for filtering and ordering.",
        "Limit page size regardless of strategy.",
        "Measure real queries with realistic data volumes."
      ],
      commonMistakes: [
        "Adding pagination but returning 100,000 rows when limit is omitted.",
        "Counting millions of rows on every cursor request without need.",
        "Using a cursor strategy without a stable ordering."
      ],
      quiz: [
    {
      question: "Which strategy is usually appropriate for an infinite activity feed?",
      options: ["Cursor/keyset pagination", "Large offset pagination", "No pagination", "Random pagination"],
      correctIndex: 0,
      explanation: "Feeds benefit from efficient continuation through changing data."
    }
  ]
    },
    {
      id: "day-47-lesson-4",
      title: "Pagination in NestJS",
      durationMinutes: 20,
      explanation: "NestJS pagination should be implemented at the controller/service boundary while keeping query construction in a repository or data-access layer. DTO validation should constrain page size, cursor format, and supported sort values.\n\nNever interpolate arbitrary query parameters directly into SQL. Sort fields should come from an allowlist, and cursor decoding should validate its structure and types.\n\nFor APIs consumed by many clients, document whether pagination is stable, whether new records can appear between requests, whether deleted records can shift pages, and whether a total count is guaranteed.",
      diagram: "HTTP Controller\n     |\nPaginationQueryDto\n     |\nOrderService\n     |\nRepository / QueryBuilder\n     |\nDatabase indexes\n     |\nStable ordered results",
      codeExample: { title: "Example", code: "export class PaginationQueryDto {\n  page?: number;\n  limit?: number;\n  cursor?: string;\n  sort?: \"createdAt\" | \"id\";\n}\n\n@Get()\nlist(@Query() query: PaginationQueryDto) {\n  return this.orders.list(query);\n}" },
      keyTakeaways: [
        "Validate pagination parameters.",
        "Allowlist sort fields.",
        "Keep SQL construction in the data-access layer.",
        "Document pagination semantics for clients."
      ],
      commonMistakes: [
        "Passing raw sort parameters into SQL.",
        "Accepting negative or enormous limits.",
        "Mixing offset and cursor semantics without documenting precedence."
      ],
      quiz: [
    {
      question: "What should happen to an unsupported sort field?",
      options: ["Reject it or fall back to a documented safe default", "Insert it into SQL directly", "Ignore authentication", "Use it as a table name"],
      correctIndex: 0,
      explanation: "Sort fields should be controlled by an allowlist."
    }
  ]
    }
  ],
  finalQuiz: [
    {
      question: "What is offset pagination?",
      options: ["Skipping a number of ordered records and taking the next set", "Encrypting records", "Paging through logs only", "Using OAuth scopes"],
      correctIndex: 0,
      explanation: "Offset pagination uses skip/offset plus a page size."
    },
    {
      question: "What is a keyset cursor based on?",
      options: ["Values from the ordered result position", "A password", "A random CSS class", "An HTTP status code"],
      correctIndex: 0,
      explanation: "Keyset uses ordering values to seek to the next range."
    },
    {
      question: "Why can large offsets be expensive?",
      options: ["The database may scan/skip many rows before returning the page", "They always require encryption", "They disable indexes", "They require OAuth"],
      correctIndex: 0,
      explanation: "Large offsets can cause more work as the database advances through rows."
    },
    {
      question: "Why use a tie-breaker such as id?",
      options: ["To make ordering deterministic", "To increase JSON size", "To authenticate the request", "To hide records"],
      correctIndex: 0,
      explanation: "A unique secondary ordering field prevents ambiguous positions."
    },
    {
      question: "Should clients be allowed to request an unlimited limit?",
      options: ["No", "Yes", "Only in production", "Only for admins"],
      correctIndex: 0,
      explanation: "Unbounded limits can create expensive queries and huge responses."
    },
    {
      question: "Which is better for an infinite feed?",
      options: ["Cursor/keyset pagination", "Very large offsets", "No limit", "One request for all records"],
      correctIndex: 0,
      explanation: "Feeds generally benefit from efficient continuation."
    },
    {
      question: "Should arbitrary sort fields be passed directly to SQL?",
      options: ["No", "Yes", "Only if URL encoded", "Only for GET"],
      correctIndex: 0,
      explanation: "Sort fields should come from an allowlist."
    }
  ],
  project: {
    name: "High-Scale Orders Listing API",
    goal: "Build both offset and cursor/keyset pagination for a realistic NestJS Orders API and measure their behavior.",
    brief: "Create an Orders endpoint that supports safe filtering and deterministic pagination. Provide offset pagination for page-based consumers and cursor pagination for high-volume consumers.",
    steps: [
      "Seed a realistic dataset large enough to make query plans meaningful.",
      "Implement validated offset pagination with maximum page size and deterministic ordering.",
      "Implement cursor/keyset pagination using createdAt plus id as the stable ordering pair.",
      "Encode and validate cursors so clients cannot inject query fragments.",
      "Add indexes matching the main filter and ordering paths.",
      "Inspect SQL query plans and compare response latency at low and high offsets.",
      "Document response metadata and consistency expectations."
    ],
    acceptance: [
      "Both pagination strategies return deterministic results.",
      "Page size is bounded and invalid values are rejected.",
      "Cursor pagination does not expose raw SQL or trusted internal state.",
      "Large offset behavior is measured rather than assumed.",
      "Database indexes support the main pagination query paths."
    ],
    stretch: [
      "Add backward pagination with before/previous cursors.",
      "Add snapshot-style pagination semantics for reporting use cases.",
      "Benchmark concurrent readers while new orders are inserted.",
      "Use PostgreSQL EXPLAIN ANALYZE to compare plans."
    ]
  }
};
