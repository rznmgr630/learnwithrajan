import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_20_LESSONS: LessonDay = {
  day: 20,
  title: "Building Production-Style APIs",
  totalMinutes: 84,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "nextjs-day20-api-architecture",
      title: "Designing a Production-Style REST API",
      durationMinutes: 17,
      explanation: `
A production API needs more than route handlers that return JSON. You need predictable URL structures, validation, authentication, authorization, pagination, filtering, sorting, consistent errors, and a clear separation between HTTP concerns and business logic.

For this day, imagine the API has these resources:

\`\`\`text
/api/users
/api/posts
/api/comments
/api/auth
\`\`\`

The API should have a clear resource model.

For example:

\`\`\`text
GET    /api/posts
POST   /api/posts

GET    /api/posts/123
PATCH  /api/posts/123
DELETE /api/posts/123

GET    /api/posts/123/comments
POST   /api/posts/123/comments
\`\`\`

The Route Handler should not become the entire application. A scalable architecture can look like:

\`\`\`text
HTTP Request
     |
     v
Route Handler
     |
     +--> Authentication
     +--> Input parsing
     +--> Validation
     |
     v
Service Layer
     |
     v
Repository / ORM
     |
     v
Database
\`\`\`

The handler is responsible for HTTP concerns. The service is responsible for business rules. The repository/ORM handles persistence.

For example:

\`\`\`ts
export async function POST(request: Request) {
  const body = await request.json();

  const input = createPostSchema.safeParse(body);

  if (!input.success) {
    return Response.json(
      { error: { code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  const post = await postService.create(input.data);

  return Response.json(post, { status: 201 });
}
\`\`\`

This is much easier to maintain than placing database queries, business rules, and HTTP response formatting into one huge function.
`,
      diagram: `
Client
  |
  v
Route Handler
  |
  +--> Auth
  +--> Parse
  +--> Validate
  |
  v
Service Layer
  |
  v
Repository / ORM
  |
  v
PostgreSQL
`,
      codeExample: {
        title: "A thin production-style POST handler",
        code: `import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().trim().min(3),
  content: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();

  const result = createPostSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid post data.",
        },
      },
      { status: 400 }
    );
  }

  const post = await postService.create(result.data);

  return Response.json(post, { status: 201 });
}`,
      },
      keyTakeaways: [
        "Production APIs need consistent architecture, not just working endpoints.",
        "Route Handlers should focus on HTTP concerns.",
        "Services should contain reusable business rules.",
        "Repositories or ORMs can isolate database access.",
        "Resource-oriented URLs make APIs easier to understand.",
      ],
      commonMistakes: [
        "Putting all business logic into route.ts.",
        "Creating inconsistent URL conventions.",
        "Returning different error formats from every endpoint.",
        "Skipping validation because the API is used by your own frontend.",
      ],
      quiz: [
        {
          question: "What should a thin Route Handler primarily coordinate?",
          options: [
            "HTTP concerns and the application service layer",
            "Every database query and business rule",
            "CSS",
            "Browser local storage",
          ],
          correctIndex: 0,
          explanation:
            "A thin handler should parse HTTP input, validate/authenticate as needed, call application logic, and build the response.",
        },
      ],
    },
    {
      id: "nextjs-day20-pagination-filtering-sorting",
      title: "Pagination, Filtering, and Sorting",
      durationMinutes: 18,
      explanation: `
Returning thousands of database records from one API request is usually a poor design. Pagination limits how much data is returned at once.

A simple offset-based API can look like:

\`\`\`text
GET /api/posts?page=2&limit=20
\`\`\`

The server can parse those values:

\`\`\`ts
const url = new URL(request.url);

const page = Math.max(
  Number(url.searchParams.get("page") ?? "1"),
  1
);

const limit = Math.min(
  Math.max(
    Number(url.searchParams.get("limit") ?? "20"),
    1
  ),
  100
);

const offset = (page - 1) * limit;
\`\`\`

Notice the server limits the maximum page size. Never blindly trust a client-provided limit.

### Filtering

Filtering lets the client request a subset:

\`\`\`text
GET /api/posts?status=published
\`\`\`

The server should validate allowed filter values rather than concatenating arbitrary input into SQL.

### Sorting

Sorting can be represented by a controlled parameter:

\`\`\`text
GET /api/posts?sort=createdAt&order=desc
\`\`\`

Do not allow arbitrary SQL fragments from the client. Map known API fields to known database fields:

\`\`\`ts
const sortColumns = {
  createdAt: "created_at",
  title: "title",
} as const;
\`\`\`

Then reject unknown values.

### Offset vs cursor pagination

Offset pagination is simple and works well for many administrative and small datasets.

Cursor pagination is useful for large or frequently changing datasets because the client asks for records after a known position rather than asking the database to skip a large number of rows.

A cursor API might look like:

\`\`\`text
GET /api/posts?limit=20&cursor=eyJpZCI6...
\`\`\`

The exact cursor format should be opaque to the client.
`,
      diagram: `
GET /api/posts
       |
       +--> page
       +--> limit
       +--> filter
       +--> sort
       |
       v
Validate parameters
       |
       v
Database query
       |
       v
Paginated response
`,
      codeExample: {
        title: "Validated pagination parameters",
        code: `const url = new URL(request.url);

const rawPage = Number(
  url.searchParams.get("page") ?? "1"
);

const rawLimit = Number(
  url.searchParams.get("limit") ?? "20"
);

const page = Number.isInteger(rawPage)
  ? Math.max(rawPage, 1)
  : 1;

const limit = Number.isInteger(rawLimit)
  ? Math.min(Math.max(rawLimit, 1), 100)
  : 20;

const offset = (page - 1) * limit;

const posts = await postRepository.findMany({
  offset,
  limit,
});`,
      },
      keyTakeaways: [
        "Pagination prevents APIs from returning unbounded collections.",
        "Always validate and cap client-provided pagination values.",
        "Filtering should use an allowlist of supported fields and values.",
        "Sorting parameters should map to known database columns.",
        "Cursor pagination can be useful for large or frequently changing datasets.",
      ],
      commonMistakes: [
        "Allowing limit=1000000.",
        "Passing a raw sort value directly into SQL.",
        "Returning every record from a large table.",
        "Confusing page numbers with database offsets.",
      ],
      quiz: [
        {
          question: "Why should an API cap the maximum limit?",
          options: [
            "To prevent unbounded data retrieval",
            "To make URLs shorter",
            "To disable sorting",
            "To remove authentication",
          ],
          correctIndex: 0,
          explanation:
            "A maximum limit protects the API and database from unnecessarily large requests.",
        },
      ],
    },
    {
      id: "nextjs-day20-errors-validation-auth",
      title: "Validation, Authentication, Authorization, and Errors",
      durationMinutes: 18,
      explanation: `
Production APIs must assume that clients can send invalid or malicious input. Validation should happen before business logic and persistence.

For JSON APIs, Zod can validate request bodies:

\`\`\`ts
const result = createUserSchema.safeParse(await request.json());

if (!result.success) {
  return Response.json(
    {
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid user data.",
        fields: result.error.flatten().fieldErrors,
      },
    },
    { status: 400 }
  );
}
\`\`\`

### Authentication vs authorization

Authentication answers:

\`\`\`text
Who are you?
\`\`\`

Authorization answers:

\`\`\`text
Are you allowed to do this?
\`\`\`

For example, a logged-in user can be authenticated but still forbidden from deleting another user's post.

A route might conceptually do:

\`\`\`ts
const user = await requireUser();

const post = await postService.findById(postId);

if (!post) {
  return notFoundResponse();
}

if (post.authorId !== user.id) {
  return forbiddenResponse();
}
\`\`\`

### Consistent errors

A production API should establish one error shape.

For example:

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data.",
    "fields": {
      "email": "Invalid email address."
    }
  }
}
\`\`\`

Clients can then reliably check \`error.code\` instead of parsing human-readable messages.

Do not expose internal database errors directly. Log detailed information server-side and return safe information to clients.

### Authentication endpoint

An API might expose:

\`\`\`text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
\`\`\`

The exact implementation depends on the authentication system. The API should not invent its own insecure password/session system merely to demonstrate a route.
`,
      diagram: `
Request
  |
  v
Authentication
  |
  +-- unauthenticated --> 401
  |
  v
Authorization
  |
  +-- forbidden --------> 403
  |
  v
Validation
  |
  +-- invalid ----------> 400/422
  |
  v
Business logic
  |
  v
Success
`,
      codeExample: {
        title: "Consistent validation error response",
        code: `const result = userSchema.safeParse(body);

if (!result.success) {
  return Response.json(
    {
      error: {
        code: "VALIDATION_ERROR",
        message: "Please correct the invalid fields.",
        fields: result.error.flatten().fieldErrors,
      },
    },
    { status: 400 }
  );
}`,
      },
      keyTakeaways: [
        "Validate untrusted API input on the server.",
        "Authentication identifies the caller.",
        "Authorization determines whether the caller may perform an operation.",
        "A stable error shape makes API clients easier to build.",
        "Internal exceptions should be logged safely rather than returned directly.",
      ],
      commonMistakes: [
        "Checking only authentication and forgetting authorization.",
        "Returning 200 for failed operations.",
        "Exposing SQL or stack traces.",
        "Using human-readable messages as machine-readable error codes.",
      ],
      quiz: [
        {
          question: "What does authentication determine?",
          options: [
            "Whether a user is allowed to delete a post",
            "Who the caller is",
            "Whether a query is sorted",
            "Whether a database index exists",
          ],
          correctIndex: 1,
          explanation: "Authentication establishes the caller's identity.",
        },
        {
          question: "What status commonly represents forbidden access?",
          options: ["200", "201", "403", "500"],
          correctIndex: 2,
          explanation: "403 Forbidden is commonly used when the caller is authenticated but not permitted.",
        },
      ],
    },
    {
      id: "nextjs-day20-versioning-rate-limiting",
      title: "API Versioning and Rate Limiting Concepts",
      durationMinutes: 15,
      explanation: `
As an API evolves, changing response shapes or endpoint behavior can break existing clients. Versioning provides a strategy for evolving the contract.

A simple URL-based approach is:

\`\`\`text
/api/v1/users
/api/v1/posts
/api/v2/users
\`\`\`

Versioning does not mean every tiny implementation change needs a new version. It is primarily useful for meaningful contract changes that clients need time to adopt.

Other versioning approaches include headers or media types, but the important lesson is consistency and documentation.

### Rate limiting

Rate limiting controls how frequently a client can call an API. It protects resources and helps prevent abuse.

A simple conceptual rule might be:

\`\`\`text
100 requests
per
1 minute
per user
\`\`\`

If the client exceeds the limit, the API can respond with:

\`\`\`text
429 Too Many Requests
\`\`\`

A real rate limiter usually needs shared storage when the application runs across multiple server instances. An in-memory counter inside one process is often insufficient for a horizontally scaled production system.

Common strategies include:

- Fixed window
- Sliding window
- Token bucket
- Leaky bucket

You do not need to implement a complete distributed rate limiter today. Understand the problem and where it belongs in the architecture.

### API contracts

An API contract describes what clients can expect: URLs, methods, request schemas, response schemas, status codes, authentication requirements, pagination rules, and error formats.

A production API should make these contracts explicit rather than forcing every consumer to guess.
`,
      diagram: `
Clients
  |
  +--> /api/v1/users
  |
  +--> /api/v2/users
  |
  v
API contract

Rate limiting:
Client
  |
  v
Rate limiter
  |
  +--> allowed --> Handler
  |
  +--> exceeded -> 429
`,
      codeExample: {
        title: "Simple versioned route structure",
        code: `// app/api/v1/users/route.ts

export async function GET() {
  return Response.json({
    version: "v1",
    users: [],
  });
}

// A later breaking contract could be exposed
// separately under app/api/v2/users/route.ts.`,
      },
      keyTakeaways: [
        "API versioning protects clients from breaking contract changes.",
        "Version only when the API contract meaningfully changes.",
        "Rate limiting protects APIs from excessive traffic and abuse.",
        "Distributed applications usually need shared rate-limit state or an external rate-limiting layer.",
        "API contracts should document request, response, error, and authentication behavior.",
      ],
      commonMistakes: [
        "Creating a new API version for every small change.",
        "Using only in-memory rate limiting in a horizontally scaled production system.",
        "Failing to document breaking changes.",
      ],
      quiz: [
        {
          question: "What status code is commonly used when a rate limit is exceeded?",
          options: ["201", "301", "404", "429"],
          correctIndex: 3,
          explanation: "429 Too Many Requests is commonly used for rate-limit violations.",
        },
        {
          question: "Why can API versioning be useful?",
          options: [
            "It prevents every database query",
            "It gives clients a stable contract while APIs evolve",
            "It removes validation",
            "It replaces authentication",
          ],
          correctIndex: 1,
          explanation:
            "Versioning can allow older clients to continue using a stable contract while a new contract is introduced.",
        },
      ],
    },
    {
      id: "nextjs-day20-production-api-project",
      title: "Putting the API Together",
      durationMinutes: 16,
      explanation: `
Now combine the concepts into one production-style API architecture.

The API will contain:

\`\`\`text
/api/users
/api/posts
/api/comments
/api/auth
\`\`\`

The routes should remain thin. For example:

\`\`\`text
/api/posts
       |
       v
route.ts
       |
       +--> authenticate
       +--> validate
       |
       v
postService
       |
       v
postRepository
       |
       v
PostgreSQL
\`\`\`

A request such as:

\`\`\`text
POST /api/posts
Content-Type: application/json

{
  "title": "Learning Next.js",
  "content": "Today I learned..."
}
\`\`\`

should travel through a predictable pipeline:

\`\`\`text
HTTP Request
     |
     v
Rate limit
     |
     v
Authentication
     |
     v
Validation
     |
     v
Authorization
     |
     v
Service
     |
     v
Database
     |
     v
Response
\`\`\`

The response should also be predictable:

\`\`\`json
{
  "data": {
    "id": "post_123",
    "title": "Learning Next.js"
  }
}
\`\`\`

or on failure:

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "fields": {
      "title": "Title is required."
    }
  }
}
\`\`\`

This separation makes the API easier to test and maintain. Route handlers can be tested for HTTP behavior, services for business rules, and repositories for persistence behavior.

The most important skill from this day is not memorizing every endpoint. It is learning to design an API as a set of stable contracts and layers.
`,
      diagram: `
                    REST API
                       |
       +---------------+----------------+
       |               |                |
     users            posts          comments
       |               |                |
       +---------------+----------------+
                       |
                 Shared concerns
                       |
       +---------------+----------------+
       |        |        |       |      |
     Auth   Validation  Rate   Errors  Pagination
                       Limit
                       |
                       v
                  Service Layer
                       |
                       v
                   Database
`,
      codeExample: {
        title: "A complete route flow",
        code: `export async function POST(request: Request) {
  // 1. Authentication
  const user = await requireUser();

  // 2. Parse input
  const body = await request.json();

  // 3. Validate input
  const result = createPostSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request.",
          fields: result.error.flatten().fieldErrors,
        },
      },
      { status: 400 }
    );
  }

  // 4. Business logic
  const post = await postService.create({
    authorId: user.id,
    ...result.data,
  });

  // 5. Response
  return Response.json(
    { data: post },
    { status: 201 }
  );
}`,
      },
      keyTakeaways: [
        "Production APIs are layered systems.",
        "Route handlers should remain thin and predictable.",
        "Authentication, validation, authorization, rate limiting, and errors are shared API concerns.",
        "Services and repositories help keep HTTP code maintainable.",
        "Stable response contracts make APIs easier for clients to consume.",
      ],
      commonMistakes: [
        "Creating one giant route handler for the entire API.",
        "Duplicating authentication and error logic inconsistently across routes.",
        "Returning raw database objects without considering the public API contract.",
        "Forgetting pagination for collection endpoints.",
      ],
      quiz: [
        {
          question: "Which layer should usually contain reusable business rules?",
          options: ["Service layer", "CSS layer", "Browser HTML", "Route URL"],
          correctIndex: 0,
          explanation:
            "A service layer is a useful place for reusable application/business logic.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "Why should Route Handlers remain thin?",
      options: [
        "To keep HTTP concerns separate from reusable business logic",
        "To remove all validation",
        "To avoid TypeScript",
        "To prevent database access entirely",
      ],
      correctIndex: 0,
      explanation:
        "Thin handlers make the API easier to maintain by separating HTTP concerns from business logic.",
    },
    {
      question: "Why should pagination limits be capped?",
      options: [
        "To prevent unbounded expensive requests",
        "To disable filtering",
        "To remove authentication",
        "To make JSON invalid",
      ],
      correctIndex: 0,
      explanation:
        "Caps protect the API and database from unnecessarily large requests.",
    },
    {
      question: "What does authorization answer?",
      options: [
        "Who is the user?",
        "Is this user allowed to perform this operation?",
        "What is the database password?",
        "Which CSS file is loaded?",
      ],
      correctIndex: 1,
      explanation:
        "Authorization determines permissions after identity has been established.",
    },
    {
      question: "Which status code commonly indicates rate limiting?",
      options: ["201", "204", "404", "429"],
      correctIndex: 3,
      explanation: "429 Too Many Requests commonly indicates a rate limit was exceeded.",
    },
    {
      question: "What is an API contract?",
      options: [
        "A documented agreement about endpoints, inputs, outputs, errors, and behavior",
        "A database migration",
        "A React hook",
        "A CSS component",
      ],
      correctIndex: 0,
      explanation:
        "An API contract describes what API consumers can expect from the service.",
    },
  ],

  project: {
    name: "REST API Backend Inside Next.js",
    goal: "Build a production-style REST API with users, posts, comments, and authentication boundaries.",
    brief: `
Build a REST API backend inside Next.js using Route Handlers.

The API should expose users, posts, comments, and auth-related endpoints. Use Zod for request validation, consistent error responses, pagination/filtering/sorting for collection endpoints, and a layered architecture with services and repositories.

You do not need to build a complete production authentication provider or distributed rate limiter from scratch. The goal is to understand where these concerns belong and implement a clean API foundation.
`,
    steps: [
      "Create /api/v1/users.",
      "Create /api/v1/posts.",
      "Create /api/v1/comments.",
      "Create /api/v1/auth endpoints for login/logout/me concepts.",
      "Implement CRUD operations where appropriate.",
      "Create Zod schemas for request bodies and query parameters.",
      "Add authentication checks to protected operations.",
      "Add authorization checks for resource ownership.",
      "Add pagination to collection endpoints.",
      "Add filtering and sorting with allowlisted fields.",
      "Create one consistent JSON error format.",
      "Create service modules for business logic.",
      "Create repository modules for database operations.",
      "Add API versioning under /api/v1.",
      "Document rate limiting as a shared API concern.",
      "Test successful and failure responses.",
    ],
    acceptance: [
      "Users, posts, and comments have clear resource endpoints.",
      "Request bodies and query parameters are validated.",
      "Protected operations require authentication.",
      "Resource ownership is checked where appropriate.",
      "Collection endpoints support pagination.",
      "Filtering and sorting use controlled values.",
      "Errors have a consistent JSON structure.",
      "Status codes communicate the result correctly.",
      "Business logic is not unnecessarily embedded inside route.ts.",
      "API versioning is represented in the URL structure.",
    ],
    stretch: [
      "Add OpenAPI documentation.",
      "Add automated API integration tests.",
      "Add cursor-based pagination.",
      "Add a Redis-backed distributed rate limiter.",
      "Add request correlation IDs and structured logging.",
      "Add response caching for suitable GET endpoints.",
    ],
  },
};
