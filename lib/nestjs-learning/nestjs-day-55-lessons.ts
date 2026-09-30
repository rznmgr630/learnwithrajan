import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_55_LESSONS: LessonDay = {
  day: 55,
  title: "Production REST API Project",
  totalMinutes: 120,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-55-lesson-1",
      title: "Project Architecture and Authentication",
      durationMinutes: 24,
      explanation: `This project combines the architecture developed throughout the previous NestJS days into one production-style REST API. The application should have clear boundaries between controllers, application services, domain logic, persistence, authentication, authorization, infrastructure, and cross-cutting concerns.

Start with authentication because later authorization, idempotency, caching, and rate limiting need a reliable caller identity. Implement registration and login with securely stored passwords and short-lived access tokens. If refresh tokens are included, design their rotation and revocation deliberately.

Authorization should operate after authentication. Define roles and permissions such as ADMIN, MANAGER, and USER, but do not assume a role alone is enough. Resource ownership and tenant boundaries should also be enforced in the service/domain layer.

The project should be structured so that business rules do not depend directly on HTTP. Controllers translate HTTP requests into application operations, while services enforce business behavior.`,
      diagram: `Client
  |
  v
Controller
  |
  v
Auth Guard ---> User Identity
  |
  v
Authorization Guard/Policy
  |
  v
Application Service
  |
  +--> Domain Rules
  |
  +--> Repository
  |
  +--> Cache / External Services`,
      codeExample: { title: "Example", code: `@Controller("orders")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrdersController {
  constructor(
    private readonly orders: OrdersService,
  ) {}

  @Post()
  @RequirePermission("orders:create")
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateOrderDto,
  ) {
    return this.orders.create(user, dto);
  }

  @Get(":id")
  @RequirePermission("orders:read")
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ) {
    return this.orders.findOne(user, id);
  }
}` },
      keyTakeaways: [
        "Authentication establishes caller identity before protected operations.",
        "Authorization must enforce both permissions and resource/tenant boundaries where required.",
        "Controllers should remain thin and delegate business behavior to application services.",
        "Cross-cutting concerns should be centralized where practical."
      ],
      commonMistakes: [
        "Checking only whether a user is logged in.",
        "Trusting a tenant ID supplied by the client without verifying membership.",
        "Putting all business rules directly into controllers.",
        "Storing plaintext passwords."
      ],
      quiz: [
        {
          question: "What is the correct conceptual order for a protected request?",
          options: [
            "Authorization, then authentication",
            "Authentication, then authorization, then business operation",
            "Database query, then authentication",
            "Caching, then authorization"
          ],
          correctIndex: 1,
          explanation: "The application first establishes identity, then determines whether that identity can perform the operation."
        }
      ]
    },
    {
      id: "day-55-lesson-2",
      title: "Validation, Error Handling, and REST API Contracts",
      durationMinutes: 22,
      explanation: `Every write endpoint should validate incoming data at the HTTP boundary. DTOs define the expected request shape, while application and domain services enforce business rules. The API should use consistent status codes and a standard error response.

Implement the error architecture from Day 51 in this project. Validation errors should expose structured field details. Domain errors such as ORDER_NOT_FOUND, ORDER_ALREADY_CANCELLED, and INSUFFICIENT_STOCK should map to intentional HTTP responses. Unexpected errors should become safe 500 responses while detailed diagnostics remain in logs.

REST resource design should remain consistent. Use nouns for resources, predictable HTTP methods, meaningful status codes, and stable response structures. Document pagination, filtering, sorting, authentication, and error formats in OpenAPI.

Do not allow different modules to invent their own response conventions. The goal is a coherent API that another developer can integrate without reading your implementation code.`,
      diagram: `HTTP
 |
 +--> DTO Validation
 |       |
 |      invalid --> 400 VALIDATION_FAILED
 |
 v
Application Service
 |
 +--> Domain Error --> intentional 4xx
 |
 +--> Infrastructure --> safe 5xx
 |
 +--> Unknown --> INTERNAL_SERVER_ERROR
`,
      codeExample: { title: "Example", code: `@Post()
async create(
  @CurrentUser() user: AuthenticatedUser,
  @Body() dto: CreateOrderDto,
) {
  const order = await this.orders.create(user, dto);

  return {
    data: order,
  };
}

// Example standard error
{
  "statusCode": 409,
  "code": "ORDER_ALREADY_CANCELLED",
  "message": "Order is already cancelled",
  "requestId": "req_123"
}` },
      keyTakeaways: [
        "Validation belongs at the API boundary.",
        "Business errors should be modeled explicitly.",
        "All endpoints should use consistent response and error conventions.",
        "OpenAPI should describe the actual API contract."
      ],
      commonMistakes: [
        "Returning 200 for every operation regardless of result.",
        "Returning raw exceptions from controllers.",
        "Allowing DTOs to become the only source of business validation.",
        "Documenting an API that differs from its real implementation."
      ],
      quiz: [
        {
          question: "Which layer should normally decide that a cancelled order cannot be cancelled again?",
          options: [
            "CSS",
            "Domain/application logic",
            "Swagger UI",
            "HTTP parser"
          ],
          correctIndex: 1,
          explanation: "That is a business rule and belongs in application/domain behavior rather than presentation code."
        }
      ]
    },
    {
      id: "day-55-lesson-3",
      title: "Pagination, Filtering, Search, and Caching",
      durationMinutes: 25,
      explanation: `The project needs a realistic list endpoint rather than only simple CRUD. Build GET /orders with pagination, filtering, sorting, and search. Use query DTOs so the API contract is explicit and validated.

Support at least one production-friendly pagination strategy such as cursor or keyset pagination for large datasets. Explain why offset pagination may become less efficient at high offsets. The response should include metadata appropriate to the chosen strategy.

Filtering and sorting should use allowlists. Do not directly concatenate arbitrary query parameters into SQL. Search should use a deliberate database query strategy and should not accidentally turn user input into executable SQL.

Cache only the read paths that benefit from it. Cache keys must include tenant and query dimensions so one user's or tenant's result cannot be returned to another. Invalidate affected cache entries when orders change.`,
      diagram: `GET /orders
 ?status=PAID
 &sort=-createdAt
 &search=acme
 &cursor=...

        |
        v
Query DTO
        |
        +--> Validate/allowlist
        |
        v
Service
        |
        +--> Cache lookup
        |       |
        |      hit --> response
        |
        v
Database query
        |
        v
Cache result
        |
        v
Paginated response`,
      codeExample: { title: "Example", code: `export class ListOrdersQuery {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsIn(["createdAt", "total"])
  sortBy?: "createdAt" | "total";
}

// Example response
{
  "data": [
    {
      "id": "ord_123",
      "status": "PAID",
      "total": 5000
    }
  ],
  "pagination": {
    "nextCursor": "eyJpZCI6Im9yZF8xMjMifQ=="
  }
}` },
      keyTakeaways: [
        "List endpoints need explicit, validated query contracts.",
        "Large datasets often benefit from cursor/keyset pagination.",
        "Filtering and sorting should use allowlists.",
        "Cache keys must include every query and identity dimension that affects the response."
      ],
      commonMistakes: [
        "Accepting arbitrary sort column names.",
        "Building SQL with string concatenation from query parameters.",
        "Caching all users' list responses under one key.",
        "Forgetting to invalidate list/search caches after writes."
      ],
      quiz: [
        {
          question: "Why should sortable fields be allowlisted?",
          options: [
            "To prevent arbitrary query input from becoming unsafe database behavior",
            "Because sorting is impossible otherwise",
            "Because REST does not support sorting",
            "To disable indexes"
          ],
          correctIndex: 0,
          explanation: "Allowlisting ensures user input selects from known safe fields rather than becoming an arbitrary database expression."
        }
      ]
    },
    {
      id: "day-55-lesson-4",
      title: "Rate Limiting and Idempotency",
      durationMinutes: 24,
      explanation: `Protect expensive and sensitive operations with rate limits. Apply a global baseline and then create stricter policies for endpoints such as login, password reset, search, exports, or expensive report generation. Use a distributed store when running multiple application instances.

Add idempotency to a side-effecting operation such as POST /payments or POST /orders. Require an Idempotency-Key and persist its state. Duplicate requests with the same key should return the original result when appropriate, while reuse with conflicting input should be rejected.

The project should intentionally combine these mechanisms rather than treating them as substitutes. Rate limiting controls request volume, while idempotency controls duplicate logical operations. A client can send only one request and still need idempotency if the network response is lost; a malicious client can send thousands of different requests and need rate limiting.

Test both features under concurrency because production failures frequently occur when multiple requests arrive at nearly the same time.`,
      diagram: `Client
  |
  v
Rate Limit
  |
  +---- exceeded --> 429
  |
  v
Authentication
  |
  v
Authorization
  |
  v
Idempotency Check
  |
  +---- duplicate --> replay
  |
  v
Business Operation
  |
  v
Persist Result`,
      codeExample: { title: "Example", code: `@Post("payments")
@UseGuards(JwtAuthGuard)
async createPayment(
  @CurrentUser() user: AuthenticatedUser,
  @Headers("idempotency-key") key: string,
  @Body() dto: CreatePaymentDto,
) {
  if (!key) {
    throw new BadRequestException({
      code: "IDEMPOTENCY_KEY_REQUIRED",
      message: "Idempotency-Key header is required",
    });
  }

  return this.payments.createIdempotent({
    user,
    key,
    input: dto,
  });
}` },
      keyTakeaways: [
        "Rate limiting and idempotency solve different reliability problems.",
        "Idempotency protects side effects from duplicate logical requests.",
        "Rate limits should reflect endpoint cost and abuse characteristics.",
        "Both systems need concurrency-safe implementations."
      ],
      commonMistakes: [
        "Using rate limiting as a substitute for idempotency.",
        "Generating the idempotency key on the server after receiving each retry.",
        "Implementing rate limits only in one application instance.",
        "Failing to test simultaneous duplicate requests."
      ],
      quiz: [
        {
          question: "A client retries a payment because it never received the response. Which feature protects against a duplicate charge?",
          options: ["Pagination", "Idempotency", "Swagger", "Filtering"],
          correctIndex: 1,
          explanation: "Idempotency lets the server recognize that the retry is the same logical payment operation."
        }
      ]
    },
    {
      id: "day-55-lesson-5",
      title: "Swagger, Production Readiness, and Integration Testing",
      durationMinutes: 25,
      explanation: `Swagger/OpenAPI turns the API contract into an interactive and machine-readable document. Every endpoint should describe authentication requirements, request DTOs, response schemas, status codes, error responses, pagination, filtering, and idempotency headers where applicable.

Production readiness also means configuration management, health checks, structured logging, request IDs, secure secrets, database migrations, graceful shutdown, and environment-specific configuration. The project should not depend on values hardcoded into source code.

Integration and end-to-end tests should exercise the complete request path. Test authentication and authorization failures, validation, pagination, filters, search, cache behavior, rate limits, idempotency, and standardized errors. Test the behavior users actually depend on, not only individual methods.

Before considering the project complete, verify that a new developer can start the application, understand the API through Swagger, run the test suite, and reproduce the main workflows without reading private implementation details.`,
      diagram: `                    Swagger/OpenAPI
                         |
                    API Contract
                         |
      +------------------+------------------+
      |                  |                  |
 Authentication     Orders API       Payments API
      |                  |                  |
      +------------------+------------------+
                         |
                  Integration Tests
                         |
                 Production Checks
                         |
          Logs / Metrics / Health / Config`,
      codeExample: { title: "Example", code: `const config = new DocumentBuilder()
  .setTitle("Production Orders API")
  .setDescription("Orders and payments REST API")
  .setVersion("1.0")
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);

SwaggerModule.setup("docs", app, document);

// Every important endpoint should additionally
// document request DTOs, responses, errors,
// pagination, and authentication requirements.` },
      keyTakeaways: [
        "Swagger should describe the real production API contract.",
        "Production readiness includes configuration, observability, health, and safe shutdown.",
        "End-to-end tests should cover complete user-facing workflows.",
        "The final project should be understandable and runnable by another developer."
      ],
      commonMistakes: [
        "Generating Swagger but leaving schemas undocumented.",
        "Testing only happy paths.",
        "Hardcoding production secrets.",
        "Calling a project production-ready without testing its failure paths."
      ],
      quiz: [
        {
          question: "Why should Swagger document error responses as well as successful responses?",
          options: [
            "Clients only need success information",
            "Consumers need to know how failures are represented and handled",
            "Swagger cannot represent errors",
            "Errors are unrelated to API contracts"
          ],
          correctIndex: 1,
          explanation: "Error behavior is part of the API contract and is essential for reliable client integration."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "Which feature protects a payment from being performed twice when the client retries the same logical request?",
      options: ["Rate limiting", "Idempotency", "Pagination", "Swagger"],
      correctIndex: 1,
      explanation: "Idempotency keys allow the server to recognize and safely replay a repeated logical operation."
    },
    {
      question: "Which feature primarily limits request volume?",
      options: ["Caching", "Rate limiting", "Authorization", "OpenAPI"],
      correctIndex: 1,
      explanation: "Rate limiting controls how frequently clients can make requests."
    },
    {
      question: "What should happen to unexpected internal errors at the API boundary?",
      options: [
        "Expose the stack trace",
        "Expose the SQL query",
        "Return a safe standardized error and keep diagnostics internally",
        "Return the user's password"
      ],
      correctIndex: 2,
      explanation: "Clients receive safe information while operators retain detailed diagnostics through logs and tracing."
    },
    {
      question: "What is a major requirement for cache keys in a multi-tenant API?",
      options: [
        "They must ignore tenants",
        "They must include the identity dimensions that affect the result",
        "They must never expire",
        "They must contain database passwords"
      ],
      correctIndex: 1,
      explanation: "Tenant and other identity dimensions must be represented so cached data cannot cross security boundaries."
    },
    {
      question: "Why should a production list endpoint validate sort fields?",
      options: [
        "To restrict input to known safe database fields",
        "To prevent HTTP requests",
        "To make pagination impossible",
        "To disable database indexes"
      ],
      correctIndex: 0,
      explanation: "Allowlisting prevents arbitrary user input from becoming unsafe database behavior."
    }
  ],
  project: {
    name: "Production Multi-Tenant Orders & Payments REST API",
    goal: "Build a complete production-style NestJS REST API that combines authentication, authorization, validation, pagination, filtering, search, caching, rate limiting, idempotency, Swagger, and centralized error handling.",
    brief: "Build a multi-tenant Orders and Payments API. Users belong to tenants and have permissions. The API supports secure authentication, protected CRUD operations, cursor pagination, filtering, sorting, search, Redis caching, distributed rate limiting, idempotent payment/order creation, standardized errors, and complete OpenAPI documentation.",
    steps: [
      "Create the NestJS application with environment-based configuration.",
      "Create users, tenants, roles, permissions, orders, payments, and idempotency records.",
      "Implement password hashing and authentication.",
      "Implement access-token validation and protected routes.",
      "Implement role/permission authorization.",
      "Enforce tenant isolation on every tenant-scoped resource.",
      "Add DTO validation with a global ValidationPipe.",
      "Implement the Day 51 standard error response and global exception filter.",
      "Create stable application error codes.",
      "Implement GET /orders with cursor or keyset pagination.",
      "Add validated filtering for status and other safe fields.",
      "Add an allowlisted sorting system.",
      "Add search with a deliberate database strategy.",
      "Add Redis cache-aside for selected order reads and list queries.",
      "Add TTLs and explicit cache invalidation after writes.",
      "Protect the API with global and endpoint-specific rate limits.",
      "Use a distributed/shared store for rate-limit state when running multiple instances.",
      "Add Idempotency-Key handling to POST /payments.",
      "Persist idempotency records and prevent concurrent duplicate operations.",
      "Reject reuse of an idempotency key with conflicting request data.",
      "Add Swagger/OpenAPI documentation for every public endpoint.",
      "Document authentication, request schemas, response schemas, errors, pagination, filters, and idempotency.",
      "Add request IDs and structured logging.",
      "Add health/readiness checks.",
      "Add database migrations and safe configuration management.",
      "Add unit, integration, and end-to-end tests.",
      "Run the application with multiple instances and verify distributed behavior.",
      "Write a README describing architecture, setup, environment variables, migrations, tests, and API usage."
    ],
    acceptance: [
      "A user can authenticate and receive a valid access token.",
      "Protected endpoints reject unauthenticated requests.",
      "Authorization prevents users from accessing resources or actions outside their permissions.",
      "Tenant isolation is enforced server-side.",
      "Invalid request bodies return structured VALIDATION_FAILED errors.",
      "Domain failures return stable application error codes.",
      "Unexpected failures return safe standardized 500 responses.",
      "GET /orders supports pagination, filtering, sorting, and search.",
      "Pagination works correctly with realistic large datasets.",
      "Cached reads reduce repeated database access.",
      "Cache keys preserve tenant and query boundaries.",
      "Writes invalidate affected cache entries.",
      "Rate limits return 429 and work consistently across application instances.",
      "Payment creation is idempotent.",
      "Concurrent duplicate payment requests do not create duplicate side effects.",
      "Conflicting idempotency-key reuse is rejected.",
      "Swagger documents all major endpoints and failure responses.",
      "Request IDs can be correlated between API responses and server logs.",
      "Health/readiness checks correctly represent dependency availability.",
      "Automated tests cover happy paths, validation failures, authorization failures, rate limits, cache behavior, idempotency, and error handling.",
      "The application can be started from a clean environment using documented steps."
    ],
    stretch: [
      "Add refresh-token rotation and revocation.",
      "Add OAuth 2.0/OIDC login using an external identity provider.",
      "Add OpenTelemetry traces and distributed correlation IDs.",
      "Add Redis-based distributed locks for cache stampede protection.",
      "Add an outbox pattern for reliable domain-event publishing.",
      "Add background jobs for payment reconciliation.",
      "Add webhook signature verification and idempotent webhook processing.",
      "Add API versioning with a documented v2 migration.",
      "Add contract testing for external consumers.",
      "Containerize the API and dependencies with Docker Compose.",
      "Deploy multiple API instances behind a reverse proxy/load balancer.",
      "Add CI checks for linting, type checking, tests, migrations, and OpenAPI generation.",
      "Add load tests for pagination, search, rate limiting, and idempotent payment creation."
    ]
  }
};
