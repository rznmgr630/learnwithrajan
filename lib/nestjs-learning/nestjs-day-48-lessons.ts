import type { LessonDay } from "@/lib/learn/lesson-types";

export const FILTERING_SEARCHING_DAY_48_LESSONS: LessonDay = {
  day: 48,
  title: "Filtering & Searching",
  totalMinutes: 100,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-48-lesson-1",
      title: "Filtering and Query Parameters",
      durationMinutes: 25,
      explanation: "Filtering lets clients restrict a collection to records matching known business fields. For example, GET /orders?status=paid&customerId=123 asks for paid orders belonging to a customer.\n\nThe API should define which fields can be filtered and what each filter means. Do not turn arbitrary query parameters into arbitrary SQL. Query DTOs and allowlists provide a clear boundary.\n\nFiltering also needs a policy decision: which fields are public to filter, which require authorization, and which combinations are supported efficiently. A filter that works technically but bypasses tenant isolation is a security bug.",
      diagram: "GET /orders\n  ?status=paid\n  &customerId=123\n  &createdAfter=2026-01-01\n\n        |\n        v\nValidate + normalize\n        |\n        v\nAllowed filter specification\n        |\n        v\nParameterized query\n        |\n        v\nTenant authorization",
      codeExample: { title: "Example", code: "export class OrderFilterDto {\n  status?: \"pending\" | \"paid\" | \"cancelled\";\n  customerId?: string;\n  createdAfter?: string;\n}\n\nconst qb = repo.createQueryBuilder(\"order\");\n\nif (query.status) {\n  qb.andWhere(\"order.status = :status\", { status: query.status });\n}\nif (query.customerId) {\n  qb.andWhere(\"order.customerId = :customerId\", {\n    customerId: query.customerId,\n  });\n}" },
      keyTakeaways: [
        "Treat query parameters as untrusted input.",
        "Allowlist filterable fields and operators.",
        "Use parameterized queries.",
        "Apply tenant and authorization boundaries independently of user filters."
      ],
      commonMistakes: [
        "Concatenating query parameters into SQL.",
        "Letting a client filter another tenant's records.",
        "Supporting dozens of filters without considering indexes and query cost."
      ],
      quiz: [
    {
      question: "Why use a filter DTO?",
      options: ["To validate and constrain supported query parameters", "To expose SQL", "To bypass authentication", "To create cookies"],
      correctIndex: 0,
      explanation: "A DTO makes the accepted query contract explicit."
    }
  ]
    },
    {
      id: "day-48-lesson-2",
      title: "Sorting and Query Operators",
      durationMinutes: 25,
      explanation: "Sorting should be explicit and bounded. A useful API may support ?sort=-createdAt,name where a leading minus means descending, but the implementation must map those public names to known database columns.\n\nQuery operators let clients express comparisons such as greater-than, less-than, in-list, or ranges. Operators should be designed as part of the contract instead of accepting arbitrary expressions.\n\nA safe query language is small and predictable. For example, createdAt[gte]=2026-01-01 is understandable, while allowing clients to send raw SQL expressions is not an API feature—it is an injection risk.",
      diagram: "Public query language\nsort=-createdAt,name\nprice[gte]=100\nprice[lte]=500\nstatus[in]=paid,pending\n\n          |\n          v\nParser + allowlist\n          |\n          v\nParameterized SQL",
      codeExample: { title: "Example", code: "const SORT_FIELDS = {\n  createdAt: \"order.createdAt\",\n  total: \"order.total\",\n  id: \"order.id\",\n} as const;\n\nfunction mapSort(field: keyof typeof SORT_FIELDS) {\n  return SORT_FIELDS[field];\n}\n\n// Never use the raw query parameter as a SQL identifier." },
      keyTakeaways: [
        "Map public field names to known internal fields.",
        "Define supported operators explicitly.",
        "Parameterize values.",
        "Document sorting stability and precedence."
      ],
      commonMistakes: [
        "Allowing raw SQL operators from clients.",
        "Sorting by arbitrary columns.",
        "Using string concatenation for IN lists and ranges."
      ],
      quiz: [
    {
      question: "What should a public sort field map to?",
      options: ["A predefined internal column", "Raw SQL from the client", "A password", "A JWT secret"],
      correctIndex: 0,
      explanation: "Allowlisting prevents clients from controlling arbitrary SQL identifiers."
    }
  ]
    },
    {
      id: "day-48-lesson-3",
      title: "Search and Full-Text Search",
      durationMinutes: 28,
      explanation: "Filtering answers exact or structured conditions; search is usually intended for finding records based on text. Simple search may use ILIKE or LIKE for small datasets, but leading wildcard patterns can be expensive and may not use a normal B-tree index effectively.\n\nFull-text search analyzes text into searchable terms. PostgreSQL provides tsvector and tsquery, which can support indexed text search and ranking. The API should expose a product-level search behavior rather than exposing database-specific syntax directly.\n\nFor more advanced search needs, dedicated search engines may be appropriate, but they add operational complexity and eventual-consistency considerations. Start with the simplest technology that meets the product's requirements.",
      diagram: "User query: \"refund pending\"\n\n        |\n        v\nNormalize text\n        |\n        v\nSearch index\n  tsvector / external engine\n        |\n        v\nRanked matches\n        |\n        v\nAuthorization + filters\n        |\n        v\nAPI response",
      codeExample: { title: "Example", code: "-- PostgreSQL full-text search concept\nSELECT id, title\nFROM documents\nWHERE search_vector @@ websearch_to_tsquery('english', $1)\nORDER BY ts_rank(search_vector, websearch_to_tsquery('english', $1)) DESC\nLIMIT 20;" },
      keyTakeaways: [
        "Use simple LIKE/ILIKE for small/simple cases when appropriate.",
        "Use PostgreSQL full-text search for structured indexed text search.",
        "Apply authorization and tenant filters to search results.",
        "Treat search ranking as product behavior that should be documented."
      ],
      commonMistakes: [
        "Assuming LIKE always scales.",
        "Searching before applying tenant/security boundaries.",
        "Exposing tsquery syntax directly as the public API contract.",
        "Adding Elasticsearch/OpenSearch without a clear need."
      ],
      quiz: [
    {
      question: "What is PostgreSQL full-text search designed for?",
      options: ["Searching analyzed text efficiently with ranking", "Encrypting passwords", "Creating sessions", "Replacing HTTP"],
      correctIndex: 0,
      explanation: "Full-text search indexes and analyzes text for efficient search."
    }
  ]
    },
    {
      id: "day-48-lesson-4",
      title: "Query Design and Performance",
      durationMinutes: 22,
      explanation: "Filtering, sorting, and search are not independent features. A query can become expensive when many filters, joins, sorts, and counts are combined. The API should therefore define supported combinations and observe actual database plans.\n\nIndexes should match common access patterns. Composite indexes can be useful when a query filters by tenantId and status and orders by createdAt. But indexes also increase write cost and storage, so they should be driven by measured workloads.\n\nFor high-volume APIs, return only fields clients need, paginate results, avoid accidental N+1 queries, and monitor slow query patterns. API design and database design must work together.",
      diagram: "API query\n  |\n  +-- filters\n  +-- sorting\n  +-- search\n  +-- pagination\n          |\n          v\n     Query planner\n          |\n          v\n indexes / joins / scans\n          |\n          v\n       response",
      codeExample: { title: "Example", code: "// Example composite index concept\n@Index([\"tenantId\", \"status\", \"createdAt\"])\nexport class Order {\n  // ...\n}" },
      keyTakeaways: [
        "Design query combinations intentionally.",
        "Use indexes based on actual query patterns.",
        "Inspect query plans for expensive endpoints.",
        "Combine filtering with pagination rather than returning huge datasets."
      ],
      commonMistakes: [
        "Creating an index for every possible field.",
        "Ignoring tenantId in index/query design for multi-tenant tables.",
        "Returning all columns and relations by default."
      ],
      quiz: [
    {
      question: "What should guide index design?",
      options: ["Measured query patterns and execution plans", "Random preference", "Only the API URL length", "CSS structure"],
      correctIndex: 0,
      explanation: "Indexes should support real access patterns and be validated with measurements."
    }
  ]
    }
  ],
  finalQuiz: [
    {
      question: "What is the main purpose of filtering?",
      options: ["Restricting a collection to records matching defined conditions", "Executing arbitrary SQL", "Replacing authentication", "Creating users"],
      correctIndex: 0,
      explanation: "Filtering selects records using supported conditions."
    },
    {
      question: "Why should sort fields be allowlisted?",
      options: ["To prevent arbitrary SQL identifiers and keep the contract controlled", "To encrypt data", "To make cookies secure", "To enable OAuth"],
      correctIndex: 0,
      explanation: "Clients should not control arbitrary database identifiers."
    },
    {
      question: "When can ILIKE be reasonable?",
      options: ["For small/simple search requirements", "Always for billions of rows", "Only for password storage", "Never"],
      correctIndex: 0,
      explanation: "Simple text search can be adequate for small workloads."
    },
    {
      question: "What does PostgreSQL full-text search provide?",
      options: ["Indexed text search and ranking capabilities", "JWT signing", "Session rotation", "CORS"],
      correctIndex: 0,
      explanation: "Full-text search analyzes and indexes text."
    },
    {
      question: "Should tenant filtering be independent of user-provided filters?",
      options: ["Yes", "No", "Only for admins", "Only for POST"],
      correctIndex: 0,
      explanation: "Security boundaries must not depend on client-selected filters."
    },
    {
      question: "Why inspect query plans?",
      options: ["To understand how the database executes and whether indexes are effective", "To generate passwords", "To version APIs", "To render HTML"],
      correctIndex: 0,
      explanation: "Execution plans reveal scans, joins, and index usage."
    },
    {
      question: "What is a common API performance technique?",
      options: ["Filter and paginate before returning large datasets", "Return the whole table", "Join every relation automatically", "Disable indexes"],
      correctIndex: 0,
      explanation: "Bounded result sets reduce database and network work."
    }
  ],
  project: {
    name: "Searchable Multi-Tenant Orders API",
    goal: "Build a safe and performant query API supporting filtering, sorting, operators, search, and pagination.",
    brief: "Create a single Orders listing endpoint that combines validated filters, an allowlisted sort language, range operators, PostgreSQL text search, tenant isolation, and pagination.",
    steps: [
      "Define a query DTO for filters, sorting, operators, search, and pagination.",
      "Implement a parser that converts public query syntax into an internal query specification.",
      "Allowlist every filterable and sortable field.",
      "Implement parameterized SQL/QueryBuilder conditions for equality, ranges, and IN queries.",
      "Add PostgreSQL full-text search for order notes or customer-facing text.",
      "Ensure tenant authorization is applied regardless of query parameters.",
      "Add indexes for the most common filter/order/search combinations.",
      "Use EXPLAIN ANALYZE and realistic data to identify slow query paths."
    ],
    acceptance: [
      "Unsupported fields and operators are rejected.",
      "Query values are parameterized and cannot inject SQL.",
      "Cross-tenant records never appear in search or filtered results.",
      "Sorting is deterministic and documented.",
      "Search and pagination work together without unbounded responses.",
      "Performance is measured with realistic data."
    ],
    stretch: [
      "Add ranked search with highlighted terms.",
      "Add saved search/filter presets.",
      "Add query complexity limits for expensive combinations.",
      "Move to a dedicated search engine only after documenting why PostgreSQL is insufficient."
    ]
  }
};
