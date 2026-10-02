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
      explanation: `<b>Building a Production-Grade Architecture</b>

When building a small demo application in NestJS, developers often group code by technical types or throw everything into a single module. In a production enterprise system, this quickly creates tight coupling, circular dependencies, and a codebase that becomes impossible to maintain.

Imagine you are building an e-commerce backend platform like Shopify. You have distinct business domains:
- <b>Identity & Access</b> (Users, Auth, Roles, JWT Tokens)
- <b>Catalog</b> (Products, Categories, Inventory)
- <b>Sales</b> (Orders, Line Items, Payment Gateways)

To keep these domains maintainable, we structure the application using <b>Modular Architecture</b> backed by clean software layer boundaries.

\`\`\`text
┌─────────────────────────────────────────────────────────┐
│                    API Layer                            │
│    (Controllers, Guards, Interceptors, DTO Validation)  │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Application Service Layer               │
│      (Business Workflows, Orchestration, Auth Rules)    │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Domain & Persistence Layer              │
│       (Entities, TypeORM Repositories, Database)        │
└─────────────────────────────────────────────────────────┘
\`\`\`

<b>Why Layer Boundaries Matter</b>

Without strict layer boundaries, HTTP controllers start making raw database calls, services start reading request headers directly, and authentication logic gets duplicated across routes.

In our Production REST API project:
1. <b>Controllers</b> handle raw HTTP requests, map route parameters, and invoke application services. They never touch the database directly.
2. <b>Services</b> encapsulate core business rules, handle data transformations, and coordinate transactions.
3. <b>Guards & Strategies</b> shield services from handling raw security metadata by validating JWTs before execution reaches the controller.

<b>Stateful Sessions vs. Stateless JWT Architecture</b>

In a high-scale production REST API, traditional server-side session stores create a bottleneck because every request requires reading session data from a shared database or Redis instance. To allow our API nodes to scale horizontally across multiple instances or regions, we implement <b>Stateless Authentication using JSON Web Tokens (JWT)</b>.

When a user logs in:
1. The client sends credentials (\`email\` and \`password\`) to \`POST /auth/login\`.
2. The server verifies the credentials using Argon2/Bcrypt hashing.
3. Upon validation, the server generates two tokens:
   - <b>Access Token</b>: Short-lived (e.g., 15 minutes), containing user claims (\`sub\`, \`email\`, \`role\`). Signed with a secret key.
   - <b>Refresh Token</b>: Long-lived (e.g., 7 days), securely stored or hashed in the database, used to acquire new access tokens without requiring the user to re-enter credentials.

<b>Custom JWT Guards and Role-Based Access Control (RBAC)</b>

NestJS uses <b>Guards</b> to enforce authentication and authorization before a controller action runs.

\`\`\`text
Incoming Request
      │
      ▼
┌──────────────┐
│  JwtAuthGuard│ ── Invalid / Missing Token? ──► 401 Unauthorized
└──────┬───────┘
       │ Valid Token Attached to req.user
       ▼
┌──────────────┐
│  RolesGuard  │ ── User lacks required Role? ─► 403 Forbidden
└──────┬───────┘
       │ Authorized
       ▼
┌──────────────┐
│  Controller  │
└──────────────┘
\`\`\`

By combining custom NestJS decorators like \`@Roles('ADMIN')\` with a global \`RolesGuard\` using metadata reflection (\`Reflector\`), we can declaratively restrict administrative actions across endpoints.`,
      diagram: `                    INCOMING REQUEST
                           │
                           ▼
                 ┌───────────────────┐
                 │   JwtAuthGuard    │
                 └─────────┬─────────┘
                           │
               Extracts & Verifies Bearer JWT
                           │
                           ▼
                 ┌───────────────────┐
                 │    RolesGuard     │
                 └─────────┬─────────┘
                           │
             Checks User Role vs @Roles()
                           │
                           ▼
                 ┌───────────────────┐
                 │ OrdersController  │
                 └───────────────────┘`,
      codeExample: {
        title: "Code Example",
        code: `// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@Injectable Thomas
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Endpoint is public to all authenticated users
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('User context missing or unassigned role');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException(\`Access denied. Requires one of: \${requiredRoles.join(', ')}\`);
    }

    return true;
  }
}

// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'super-secret-key'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid JWT token claims');
    }

    // Returned object is attached directly to HTTP request as \`req.user\`
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}`,
      },
      keyTakeaways: [
        "Organize NestJS projects by domain modules (e.g., AuthModule, ProductsModule) rather than file types.",
        "Keep controllers lean: controllers route requests and format responses; services encapsulate business logic.",
        "Stateless JWT authentication enables effortless horizontal scaling of NestJS API servers.",
        "Combine Passport strategies with NestJS Guards for clean separation of authentication and route handler logic.",
        "Use NestJS metadata reflection (\`Reflector\`) to implement flexible Role-Based Access Control (RBAC).",
      ],
      commonMistakes: [
        "<b>Putting database calls directly inside Controllers.</b> This circumvents service logic, breaks unit testing, and duplicates database logic across routes.",
        "<b>Storing sensitive user credentials in plain text.</b> Always hash passwords with strong algorithms like Argon2 or Bcrypt before saving.",
        "<b>Hardcoding JWT secret keys.</b> Hardcoded secrets inevitably leak into version control; always load secrets dynamically via \`ConfigService\`.",
        "<b>Failing to validate token payloads.</b> Trusting an expired or malformed JWT payload blindly can introduce authorization vulnerabilities.",
      ],
      quiz: [
        {
          question: "Why is stateless JWT authentication preferred over traditional session-based auth in production microservices?",
          options: [
            "JWTs allow servers to authenticate requests without performing database lookups on every incoming request",
            "JWT tokens encrypt the entire database payload and hide it from the user",
            "Session-based auth does not support HTTPS connections",
            "JWT authentication completely eliminates the need for database storage"
          ],
          correctIndex: 0,
          explanation: "JWTs contain signed user credentials and claims directly within the token. API servers verify the cryptographic signature using a shared secret without querying a session store."
        },
        {
          question: "What is the primary role of a NestJS Guard during an HTTP request?",
          options: [
            "To serialize outgoing JSON data",
            "To transform input query strings into numeric types",
            "To determine whether a request should be handled by the route or rejected based on auth/permission rules",
            "To capture database exceptions and map them to HTTP responses"
          ],
          correctIndex: 2,
          explanation: "Guards execute after middleware but before interceptors or route handlers, deciding whether a request is granted access to an endpoint."
        }
      ]
    },
    {
      id: "day-55-lesson-2",
      title: "Validation, Error Handling, and REST API Contracts",
      durationMinutes: 22,
      explanation: `<b>API Contracts and Input Validation</b>

In an enterprise API, client applications (React frontends, mobile iOS/Android apps, or third-party webhooks) rely on a rigid **API Contract**. If an API returns unstructured errors, unexpected \`null\` values, or raw database stack traces, client applications crash.

Validation is your first line of defense. The API boundary must strictly reject malformed JSON, invalid data types, or unexpected fields before they ever reach application services or database ORMs.

\`\`\`text
Client Request ──► [ ValidationPipe ] ── Invalid Data? ──► Standard 400 Validation Error
                          │
                     Valid DTO
                          │
                          ▼
                   [ Controller ]
\`\`\`

<b>Global Exception Filtering & Envelope Uniformity</b>

NestJS comes with a built-in exception layer, but raw framework exceptions yield inconsistent outputs. For example, a validation error might return an array of error messages, whereas a thrown \`NotFoundException\` returns a single string message.

To enforce a deterministic production envelope, we create a <b>Global Exception Filter</b> that captures every thrown exception (both expected \`HttpException\` instances and unhandled runtime errors) and maps them into a standard API Error format:

\`\`\`json
{
  "statusCode": 400,
  "code": "VALIDATION_FAILED",
  "message": "Input validation failed on one or more fields",
  "timestamp": "2026-10-02T10:53:33.000Z",
  "path": "/api/v1/orders",
  "details": [
    {
      "field": "price",
      "issue": "price must be a positive number"
    }
  ]
}
\`\`\`

<b>Domain Exceptions vs Infrastructure Exceptions</b>

When building domain logic, never leak database-specific error details (e.g., \`QueryFailedError: duplicate key value violates unique constraint "UQ_user_email"\`) to the public API client.

Instead:
1. Catch low-level database or ORM exceptions in service repositories.
2. Map them into explicit domain exceptions (e.g., \`UserAlreadyExistsException\`).
3. Let the Global Exception Filter transform the domain exception into an HTTP 409 Conflict with a stable, machine-readable error code.

\`\`\`text
Database Unique Constraint Triggered
                │
                ▼
Catch ORM Exception in Service Layer
                │
                ▼
Throw domain exception: UserAlreadyExistsException
                │
                ▼
Global Exception Filter maps to HTTP 409 (code: "USER_ALREADY_EXISTS")
\`\`\`

This guarantees that database implementation details remain completely hidden from API consumers, protecting system security while offering clear debugging paths.`,
      diagram: `               UNHANDLED EXCEPTION THROWN
                           │
                           ▼
               ┌───────────────────────┐
               │ GlobalExceptionFilter │
               └───────────┬───────────┘
                           │
            Is instance of HttpException?
            ┌──────────────┴──────────────┐
            ▼                             ▼
          [YES]                         [NO]
  Extract status code           Log full error & stack
   & custom payload               Set status code = 500
            │                   Set code = INTERNAL_ERROR
            └──────────────┬──────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │ Standardized JSON Body  │
              │  - statusCode           │
              │  - code                 │
              │  - message              │
              │  - timestamp / path     │
              └─────────────────────────┘`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/filters/global-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  timestamp: string;
  path: string;
  details?: any;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected internal server error occurred.';
    let details: any = null;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resObj = exceptionResponse as Record<string, any>;
        code = resObj.code || this.mapStatusToCode(statusCode);
        message = resObj.message || exception.message;
        details = resObj.details || resObj.message || null;
      } else {
        message = exceptionResponse as string;
        code = this.mapStatusToCode(statusCode);
      }
    } else if (exception instanceof Error) {
      // Log unhandled infrastructure / runtime bugs with full stack traces
      this.logger.error(
        \`Unhandled Exception: \${exception.message}\`,
        exception.stack,
      );
    }

    const errorEnvelope: ApiErrorResponse = {
      statusCode,
      code,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      details: Array.isArray(details) ? details : undefined,
    };

    response.status(statusCode).json(errorEnvelope);
  }

  private mapStatusToCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST: return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED: return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN: return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND: return 'NOT_FOUND';
      case HttpStatus.CONFLICT: return 'CONFLICT';
      case HttpStatus.UNPROCESSABLE_ENTITY: return 'VALIDATION_FAILED';
      default: return 'INTERNAL_SERVER_ERROR';
    }
  }
}`,
      },
      keyTakeaways: [
        "A strict, uniform error response format prevents frontend crash loops and eases debugging.",
        "Use class-validator and NestJS Global ValidationPipe with \`whitelist: true\` to strip unmapped input fields.",
        "Catch all unexpected application errors at the boundary using a Global Exception Filter.",
        "Translate low-level ORM/Database exceptions into safe, machine-readable domain error codes.",
        "Never expose database stack traces, SQL strings, or file paths in production HTTP responses.",
      ],
      commonMistakes: [
        "<b>Exposing raw stack traces to production clients.</b> Attackers can use stack trace paths and SQL errors to map internal server vulnerabilities.",
        "<b>Using inconsistent response formats across controllers.</b> Returning `{ error: 'msg' }` from one route and `{ message: ['msg'] }` from another causes client integration headaches.",
        "<b>Disabling input whitelist validation.</b> Allowing arbitrary parameters into controllers exposes the application to mass-assignment attacks.",
      ],
      quiz: [
        {
          question: "What issue arises when an API allows low-level database driver exceptions to propagate directly to the client?",
          options: [
            "Database exceptions automatically cause the NestJS process to permanently crash",
            "Sensitive infrastructure details are exposed, and client code breaks due to non-standardized error payloads",
            "The client browser automatically retries the SQL query",
            "TypeORM disables transaction rollback functionality"
          ],
          correctIndex: 1,
          explanation: "Raw database exceptions leak internal table structures and database vendor details while returning unpredictable JSON shapes to public consumers."
        }
      ]
    },
    {
      id: "day-55-lesson-3",
      title: "Pagination, Filtering, Search, and Caching",
      durationMinutes: 25,
      explanation: `<b>Handling Large Datasets in Production</b>

Consider an e-commerce platform with 1,000,000 products. If a client sends \`GET /products\` without pagination, the backend server will attempt to load 1 million records into Node.js memory. This results in extreme memory pressure, high CPU usage, slow response times, and eventually an Out-Of-Memory (OOM) crash.

Production APIs must enforce pagination, filtering, and caching across all list endpoints.

<b>Offset-Based vs Cursor-Based Pagination</b>

There are two primary ways to paginate data:

1. <b>Offset-Based Pagination (\`page\` & \`limit\`)</b>
   - Uses SQL \`LIMIT x OFFSET y\`.
   - <b>Pros</b>: Simple to implement, supports skipping directly to arbitrary page numbers (e.g., Page 5).
   - <b>Cons</b>: Performance degrades significantly on high offsets (e.g., \`OFFSET 1000000\` forces PostgreSQL to scan and discard 1 million rows). Suffer from "page drift" if new items are inserted while browsing.

2. <b>Cursor-Based Pagination (\`cursor\` & \`limit\`)</b>
   - Uses indexed keys, such as \`WHERE id > :cursor ORDER BY id ASC LIMIT :limit\`.
   - <b>Pros</b>: O(1) performance regardless of depth. Stable against real-time insertions/deletions.
   - <b>Cons</b>: Cannot skip directly to arbitrary page numbers; must navigate sequentially.

\`\`\`text
Offset Pagination:
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 10000; -- Slow on large tables

Cursor Pagination:
SELECT * FROM products WHERE id > 'prod_999' ORDER BY id LIMIT 20; -- Fast via Index
\`\`\`

<b>Standardizing Paginated Metadata Responses</b>

All paginated list endpoints should return data wrapped in a predictable meta envelope:

\`\`\`json
{
  "data": [ ... ],
  "meta": {
    "totalItems": 150,
    "itemCount": 20,
    "itemsPerPage": 20,
    "totalPages": 8,
    "currentPage": 1
  }
}
\`\`\`

<b>High-Performance In-Memory Caching</b>

Reading product catalogs or global settings from PostgreSQL on every request creates unnecessary database strain. By introducing an in-memory or Redis-backed Cache Layer, frequent read queries return in under 2ms.

\`\`\`text
Client Request
      │
      ▼
┌──────────────┐      Cache Hit (< 2ms)
│ CacheInterceptor ───────────────────────► Return Cached JSON
└──────┬───────┘
       │ Cache Miss
       ▼
┌──────────────┐
│ ProductsSvc  │ ── Query PostgreSQL ──► Store in Cache ──► Return JSON
└──────────────┘
\`\`\`

When caching paginated endpoints, ensure the cache key includes all filter parameters, sort criteria, and page numbers (e.g., \`products_page_1_limit_20_cat_electronics\`).`,
      diagram: `                  GET /api/v1/products?page=2
                               │
                               ▼
                    ┌─────────────────────┐
                    │  CacheInterceptor   │
                    └──────────┬──────────┘
                               │
                      Does Key Exist in Redis?
                      ┌────────┴────────┐
               [YES]  │                 │  [NO]
                      ▼                 ▼
               Return Cached     Execute Query via
                   JSON            TypeORM / DB
                      │                 │
                      │                 ▼
                      │         Write Result to Redis
                      │           (TTL: 60 Seconds)
                      │                 │
                      └────────┬────────┘
                               │
                               ▼
                        Client Response`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/dto/pagination-query.dto.ts
import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@typeorm/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAllPaginated(query: PaginationQueryDto) {
    const { page = 1, limit = 20, search, category } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (search) {
      queryBuilder.andWhere('product.title ILIKE :search', {
        search: \`%\${search}%\`,
      });
    }

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    queryBuilder
      .orderBy('product.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [items, totalItems] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }
}`,
      },
      keyTakeaways: [
        "Never allow unpaginated array queries on production tables; enforce maximum limit thresholds.",
        "Offset-based pagination is great for standard admin UIs; cursor-based pagination is superior for infinite-scroll feeds.",
        "Cache frequent read queries with explicit TTLs (Time-To-Live) to protect the primary database.",
        "Cache keys MUST incorporate all active query filters, page numbers, and sort options.",
        "Invalidate cache keys on write operations (\`POST\`, \`PUT\`, \`DELETE\`) to prevent stale data bugs.",
      ],
      commonMistakes: [
        "<b>Forgetting to clamp the \`limit\` parameter.</b> A user passing \`?limit=999999\` will bypass pagination controls and crash the server.",
        "<b>Constructing raw string interpolation in SQL search queries.</b> Always use parameterized bindings (\`:search\`) to prevent SQL injection vulnerabilities.",
        "<b>Ignoring cache invalidation.</b> Updating a product price without clearing its Redis cache entry serves stale prices to customers.",
      ],
      quiz: [
        {
          question: "Why does Offset-based pagination (\`OFFSET 1000000\`) slow down on large PostgreSQL tables?",
          options: [
            "PostgreSQL disables indexes when offset values exceed 100",
            "The database engine must scan and discard all 1,000,000 skipped rows before returning the requested page limit",
            "Offset queries require a full database lock",
            "Node.js memory limit is exceeded whenever offset values are used"
          ],
          correctIndex: 1,
          explanation: "SQL \`OFFSET n\` requires the database engine to traverse through $n$ rows sequentially in memory, throwing them away until it reaches the requested starting point."
        }
      ]
    },
    {
      id: "day-55-lesson-4",
      title: "Rate Limiting and Idempotency",
      durationMinutes: 24,
      explanation: `<b>Protecting APIs against Abuse and Race Conditions</b>

Public REST APIs face two major operational hazards:
1. <b>Distributed Denial of Service (DDoS) & Brute-Force Attacks</b>: Malicious actors spamming login or checkout endpoints.
2. <b>Network Retries & Duplicate Transactions</b>: A user clicking "Pay Now" twice on a slow connection, causing double charges.

To solve these problems in production, we implement **Rate Limiting** and **Idempotency**.

<b>Rate Limiting with Throttler</b>

Rate limiting imposes a cap on the number of requests a client can make within a specified timeframe. In NestJS, we use the official \`@nestjs/throttler\` package.

When a client exceeds the threshold (e.g., more than 10 requests in 60 seconds):
- The server rejects the request immediately with **HTTP 429 Too Many Requests**.
- Standard response headers are returned:
  - \`Retry-After\`: Seconds remaining until the rate limit resets.
  - \`X-RateLimit-Limit\`: Total allowed requests.
  - \`X-RateLimit-Remaining\`: Remaining quota.

\`\`\`text
Client Request
      │
      ▼
┌──────────────┐
│ ThrottlerGuard│ ── Request Count Exceeded? ──► HTTP 429 Too Many Requests
└──────┬───────┘
       │ Within Limit
       ▼
┌──────────────┐
│  Controller  │
└──────────────┘
\`\`\`

<b>Idempotency Keys in Financial & Order Systems</b>

An operation is **Idempotent** if performing it multiple times produces the exact same outcome as performing it once.
- \`GET\`, \`PUT\`, and \`DELETE\` are naturally idempotent.
- \`POST\` operations (such as creating an order or charging a card) are non-idempotent by default.

If a network connection drops right after a customer submits payment, the client application will naturally retry the request. Without idempotency protection, two separate charges and duplicate orders will be created.

To guarantee safety, production systems enforce **Idempotency Keys**:

\`\`\`text
Client sends: POST /orders
Header: Idempotency-Key: "uuid-v4-key-12345"
\`\`\`

1. The API receives the request and checks Redis for \`uuid-v4-key-12345\`.
2. <b>First Request</b>: Key does not exist. Store key with state \`PROCESSING\` in Redis and proceed with transaction. Once finished, save the response payload in Redis.
3. <b>Duplicate Request</b>: Key exists in Redis! Return the saved response payload immediately without re-executing order creation or charging the credit card again!

\`\`\`text
Client Request (Header: Idempotency-Key: XYZ)
                     │
                     ▼
             Check Key in Redis
             ┌───────┴───────┐
       [Key Found]       [Key Not Found]
           │                    │
   Return Cached Response  Set State="PROCESSING"
   (No DB/Payment Call)    Execute Order Logic
                            Save Result to Redis
\`\`\` `,
      diagram: `                   POST /api/v1/orders
              Header: Idempotency-Key: "req_abc123"
                           │
                           ▼
               ┌───────────────────────┐
               │ IdempotencyMiddleware │
               └───────────┬───────────┘
                           │
                 Check Key in Redis/DB
                 ┌─────────┴─────────┐
          [EXISTS]                   [NOT FOUND]
             │                            │
   Return Saved Payload           Set Key="PROCESSING"
    HTTP 200/201 OK                       │
   (Skip Execution)             Execute Order Creation
                                          │
                                Save Response Payload in Redis
                                   (TTL = 24 Hours)
                                          │
                                   Return Response`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/middleware/idempotency.middleware.ts
import { Injectable, NestMiddleware, BadRequestException, ConflictException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Only enforce idempotency on state-changing operations like POST
    if (req.method !== 'POST') {
      return next();
    }

    const idempotencyKey = req.headers['idempotency-key'] as string;

    // Optional for general POSTs, required for sensitive financial/order routes
    if (!idempotencyKey) {
      return next();
    }

    const cacheKey = \`idempotency:\${idempotencyKey}\`;
    const cachedResponse = await this.cacheManager.get<{
      status: number;
      body: any;
    }>(cacheKey);

    if (cachedResponse) {
      if (cachedResponse.status === 0) {
        // Request is currently being processed concurrently
        throw new ConflictException('A request with this Idempotency-Key is currently in progress.');
      }
      // Return cached result directly without processing route
      return res.status(cachedResponse.status).json(cachedResponse.body);
    }

    // Lock key during execution (state = processing)
    await this.cacheManager.set(cacheKey, { status: 0, body: null }, 60000); // 60s processing lock

    // Intercept res.json to capture response payload
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Cache successful response for 24 hours
        this.cacheManager.set(
          cacheKey,
          { status: res.statusCode, body },
          86400000,
        );
      } else {
        // Release lock on server failure so client can safely retry
        this.cacheManager.del(cacheKey);
      }
      return originalJson(body);
    };

    next();
  }
}`,
      },
      keyTakeaways: [
        "Rate limiting shields NestJS APIs against DDoS attacks, brute-force logins, and resource exhaustion.",
        "Return standard HTTP status 429 along with \`Retry-After\` headers when rate limits are hit.",
        "Idempotency keys prevent duplicate payments and race conditions during network retries.",
        "Cache idempotency payloads in Redis with an expiration TTL (e.g., 24 hours).",
        "Release idempotency processing locks if the underlying request fails with a server error.",
      ],
      commonMistakes: [
        "<b>Using in-memory rate limiting across multi-node server clusters.</b> If you deploy 4 API containers, in-memory rate counters will be isolated per container; use Redis-backed throttler storage instead.",
        "<b>Applying idempotency keys to safe HTTP methods (\`GET\`, \`HEAD\`).</b> Read-only requests are inherently idempotent and do not need idempotency key locks.",
        "<b>Failing to set processing locks.</b> If two duplicate requests arrive in the exact same millisecond, both might bypass the cache check if a processing lock isn't set immediately.",
      ],
      quiz: [
        {
          question: "Which HTTP status code must an API return when a client exceeds its configured rate limit?",
          options: [
            "400 Bad Request",
            "403 Forbidden",
            "429 Too Many Requests",
            "503 Service Unavailable"
          ],
          correctIndex: 2,
          explanation: "HTTP 429 Too Many Requests is the standard RFC status code returned when rate limits are exceeded."
        },
        {
          question: "What is the primary function of an Idempotency-Key header on a POST request?",
          options: [
            "To encrypt the request body using public-key cryptography",
            "To guarantee that retrying the exact same request does not perform duplicate side effects on the server",
            "To automatically compress large JSON payloads",
            "To grant administrator privileges to the caller"
          ],
          correctIndex: 1,
          explanation: "An Idempotency Key uniquely identifies a request execution. Retrying a request with the same key returns the original result without re-executing database writes or payment transactions."
        }
      ]
    },
    {
      id: "day-55-lesson-5",
      title: "Swagger, Production Readiness, and Integration Testing",
      durationMinutes: 25,
      explanation: `<b>Documenting and Verifying Production APIs</b>

An API isn't complete until it is fully documented and thoroughly tested.

<b>Automated OpenAPI (Swagger) Documentation</b>

Manual API documentation written in external markdown or Notion docs becomes outdated almost immediately as developers modify code. NestJS provides native integration with OpenAPI using \`@nestjs/swagger\`.

By decorating DTOs and Controllers with Swagger decorators, NestJS auto-generates interactive API documentation at \`/api/docs\`:
- \`@ApiTags('Orders')\`: Groups endpoints by domain.
- \`@ApiOperation({ summary: '...' })\`: Explains the intent of an endpoint.
- \`@ApiResponse({ status: 201, description: '...' })\`: Documents potential HTTP responses.
- \`@ApiProperty()\`: Documents DTO field types, validation constraints, and example values.

\`\`\`text
Decorated TypeScript DTOs & Controllers
                  │
                  ▼
         @nestjs/swagger
                  │
                  ▼
  Auto-Generated OpenAPI Spec (JSON/YAML)
                  │
                  ▼
  Interactive Swagger UI (/api/docs)
\`\`\`

<b>Production Readiness Checklist</b>

Before deploying a NestJS REST API to production environments (such as AWS ECS, Kubernetes, or Render), fulfill these engineering checks:

1. <b>Graceful Shutdown</b>: Enable \`app.enableShutdownHooks()\` so in-flight requests finish cleanly when SIGTERM signals are received during deployments.
2. <b>Security Headers (Helmet)</b>: Enable \`helmet\` middleware to set strict HTTP headers (\`X-Content-Type-Options\`, \`Strict-Transport-Security\`, etc.).
3. <b>CORS Configuration</b>: Restrict Cross-Origin Resource Sharing explicitly to trusted frontend domain origins.
4. <b>Environment Configuration</b>: Validate environment variables at startup using \`joi\` or \`zod\` schema validation in \`ConfigModule\`.
5. <b>Health Checks & Monitoring</b>: Expose \`/health\` readiness and liveness probes using \`@nestjs/terminus\`.

<b>Integration Testing with Supertest</b>

Unit tests mock out database layers, verifying business logic in isolation. However, **Integration Tests** verify that the entire HTTP stack works together: Pipes, Guards, Interceptors, Controllers, Services, and actual database queries.

Using \`supertest\` and NestJS \`Test.createTestingModule()\`, we spin up an in-memory test instance of our API and execute real HTTP calls:

\`\`\`text
Supertest ── HTTP POST /api/v1/orders ──► NestJS Test Instance ──► Test Database
                                                                         │
Assert Response 201 & JSON Structure ◄──────────────────────────────────┘
\`\`\` `,
      diagram: `                      INTEGRATION TEST FLOW
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ Test.createTestingModule│
                     └───────────┬───────────┘
                                 │
                   Overriding Production Configs
                   (In-Memory DB / Test Secrets)
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   supertest(app)      │
                     └───────────┬───────────┘
                                 │
                       Simulate HTTP Requests
                   GET / POST / PUT / DELETE
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │  Assert HTTP Status,  │
                     │  Envelope Structure & │
                     │   Database Mutations  │
                     └───────────────────────┘`,
      codeExample: {
        title: "Code Example",
        code: `// test/orders.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';

describe('Orders Controller (e2e)', () => {
  let app: INestApplication;
  let userToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Replicate production pipeline configuration exactly
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();

    // Authenticate test user and capture JWT token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'Password123!' });

    userToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/v1/orders - should create an order when valid payload is sent', async () => {
    const orderPayload = {
      items: [{ productId: 'prod_123', quantity: 2 }],
      shippingAddress: '123 Enterprise Way',
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set('Authorization', \`Bearer \${userToken}\`)
      .set('Idempotency-Key', 'test-key-001')
      .send(orderPayload)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toEqual('PENDING');
    expect(response.body.items).toHaveLength(1);
  });

  it('POST /api/v1/orders - should return standardized 400 when payload is invalid', async () => {
    const invalidPayload = { items: [] }; // Invalid: items array empty

    const response = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set('Authorization', \`Bearer \${userToken}\`)
      .send(invalidPayload)
      .expect(400);

    expect(response.body.code).toEqual('VALIDATION_FAILED');
    expect(response.body).toHaveProperty('details');
  });
});`,
      },
      keyTakeaways: [
        "Decorate DTOs and Controllers with Swagger annotations to keep API documentation synchronized with code automatically.",
        "Validate environment variables schema on startup to prevent silent production deployment failures.",
        "Enable \`app.enableShutdownHooks()\` for clean container lifecycle teardown in Kubernetes or cloud environments.",
        "Use \`supertest\` to run end-to-end integration tests that validate HTTP status codes, Guards, Pipes, and Database changes together.",
        "Mirror your production pipeline configuration (Pipes, Filters) inside e2e test setup.",
      ],
      commonMistakes: [
        "<b>Forgetting to apply global filters/pipes in E2E tests.</b> If your E2E setup lacks \`ValidationPipe\`, tests will pass false positives even when DTO validation fails in production.",
        "<b>Exposing Swagger UI publicly on production sensitive internal APIs.</b> Disable or secure \`/api/docs\` via basic auth in public production environments.",
        "<b>Failing to run tests against isolated test databases.</b> Running integration tests against production or development databases causes accidental data corruption or deletion.",
      ],
      quiz: [
        {
          question: "Why should e2e integration tests configure the same global Pipes and Filters as main.ts?",
          options: [
            "Supertest will fail to boot without global filters",
            "Without identical pipeline configuration, tests will not test real validation behaviors or error envelope outputs",
            "NestJS requires global pipes to compile TypeORM queries",
            "E2E tests cannot execute HTTP requests without global pipes"
          ],
          correctIndex: 1,
          explanation: "Integration tests must reflect actual production execution pipelines. If pipes or filters are omitted in the test bootstrap, input validation and error serialization will behave differently in production."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "In a production NestJS modular architecture, which layer should contain database transaction controls?",
      options: [
        "HTTP Controllers",
        "Application Service Layer",
        "Validation Pipes",
        "Swagger DTO Decorators"
      ],
      correctIndex: 1,
      explanation: "Application services orchestrate business logic and workflows, making them the appropriate layer to manage database transactions."
    },
    {
      question: "What is the key benefit of standardizing API error responses into a fixed envelope format?",
      options: [
        "It speeds up PostgreSQL query execution time",
        "It provides client applications with predictable, machine-readable error codes and structures",
        "It automatically bypasses NestJS Guards",
        "It eliminates the need for HTTP status codes"
      ],
      correctIndex: 1,
      explanation: "A standard error format enables frontends and consumers to reliably handle errors using stable codes (e.g., VALIDATION_FAILED) rather than parsing fragile strings."
    },
    {
      question: "When navigating through deep pagination offsets (e.g., OFFSET 500000), why is Cursor-based pagination preferred over Offset-based pagination?",
      options: [
        "Cursor pagination allows skipping to page 100 directly",
        "Cursor pagination leverages indexed query predicates (WHERE id > :cursor), avoiding expensive full-table scans and row discarding",
        "Offset pagination requires double memory allocation in Redis",
        "PostgreSQL prohibits offsets greater than 1,000"
      ],
      correctIndex: 1,
      explanation: "Cursor pagination uses indexed comparison predicates to jump directly to the target record set in O(1) time, while offset pagination must scan and discard all preceding rows."
    },
    {
      question: "What issue does an Idempotency Key header prevent on non-idempotent POST operations?",
      options: [
        "SQL Injection attacks",
        "Duplicate resource creations or charges during network retry attempts",
        "Expired JWT tokens",
        "Cross-Site Scripting (XSS)"
      ],
      correctIndex: 1,
      explanation: "Idempotency keys ensure that if a client re-sends a POST request due to a network glitch, the server recognizes the key and returns the cached result without repeating the operation."
    },
    {
      question: "What is the role of whitelist: true in NestJS ValidationPipe configuration?",
      options: [
        "It restricts API access strictly to whitelisted IP addresses",
        "It automatically strips out any properties from the request body that are not declared in the target DTO",
        "It encrypts request parameters using HTTPS",
        "It restricts Swagger documentation visibility"
      ],
      correctIndex: 1,
      explanation: "\`whitelist: true\` strips away unrecognized properties from incoming request objects, guarding services against mass-assignment vulnerabilities."
    },
    {
      question: "How should unexpected infrastructure failures (e.g., PostgreSQL connection losses) be presented to public API clients?",
      options: [
        "With full SQL query text and server file stack traces",
        "As a safe, standardized HTTP 500 payload with a generic message, while logging full diagnostic details internally",
        "As an HTTP 200 OK with null data",
        "By ignoring the error and hanging the HTTP connection"
      ],
      correctIndex: 1,
      explanation: "Internal technical failures should be logged with full detail on the server for debugging, but hidden behind generic, safe 500 responses externally to prevent security leaks."
    },
    {
      question: "Which NestJS component is best suited for attaching custom metadata (such as required user roles) to controller routes?",
      options: [
        "Custom Decorators combined with SetMetadata",
        "Global Exception Filters",
        "Middleware functions",
        "TypeORM Entity Observers"
      ],
      correctIndex: 0,
      explanation: "Custom decorators use NestJS \`SetMetadata\` to annotate route handlers with metadata, which can then be inspected at runtime by Guards using the \`Reflector\` service."
    },
    {
      question: "Why should environment variables be validated at application startup using a library like Joi or Zod?",
      options: [
        "To compile TypeScript files to JavaScript faster",
        "To fail fast and prevent the application from starting if critical settings (e.g., DB host, JWT secrets) are missing or invalid",
        "To auto-generate Docker compose files",
        "To enable Swagger documentation auto-formatting"
      ],
      correctIndex: 1,
      explanation: "Validating environment variables at startup guarantees that the server won't crash hours later in production due to a missing configuration key."
    }
  ],
  project: {
    name: "Production REST API Project",
    goal: "Design, build, and test a production-grade, multi-tenant E-Commerce Order Management REST API in NestJS complete with Auth, Pagination, Caching, Rate Limiting, Idempotency, and E2E Tests.",
    brief: "Build a production-ready Order Management API in NestJS. The API must feature JWT authentication, Role-Based Access Control, standard error envelopes via a Global Exception Filter, paginated product catalogs with Redis caching, throttled API endpoints, idempotency protection on checkout routes, auto-generated Swagger documentation, and automated E2E integration tests.",
    steps: [
      "Initialize a modular NestJS project structure containing AuthModule, UsersModule, ProductsModule, and OrdersModule.",
      "Implement JWT Authentication with Argon2 password hashing, JwtStrategy, JwtAuthGuard, and metadata-driven RolesGuard (ADMIN vs CUSTOMER).",
      "Configure global ValidationPipe with whitelist and transform enabled, alongside a custom GlobalExceptionFilter enforcing a standardized JSON error envelope.",
      "Develop ProductsModule with paginated filtering, full-text search, and Redis-backed CacheInterceptor for fast catalog retrieval.",
      "Implement @nestjs/throttler rate limiting across public routes and an IdempotencyMiddleware for POST /orders routes using Redis.",
      "Annotate DTOs and Controllers with Swagger decorators (@ApiTags, @ApiOperation, @ApiResponse) to serve auto-generated docs at /api/docs.",
      "Write comprehensive E2E integration tests using supertest, verifying auth flows, validation pipeline enforcement, rate limiting, and order creation."
    ],
    acceptance: [
      "All HTTP responses (both success and error) adhere to documented, standardized JSON contract envelopes.",
      "Unauthenticated users are blocked with 401 Unauthorized, and unauthorized roles are rejected with 403 Forbidden.",
      "Product endpoints support pagination (?page=1&limit=20) and return total meta counts alongside cached data.",
      "Submitting duplicate requests with the same Idempotency-Key returns cached responses without duplicating orders.",
      "Swagger UI renders interactively at /api/docs without missing field schema definitions.",
      "E2E integration suite executes cleanly with all tests passing."
    ],
    stretch: [
      "Add OpenTelemetry distributed tracing and correlation IDs (X-Request-ID) across all log entries.",
      "Implement refresh token rotation with hashed database persistence.",
      "Configure dynamic database connection pooling and health check probes using @nestjs/terminus."
    ]
  }
};
