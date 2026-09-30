import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_23_LESSONS: LessonDay = {
  day: 23,
  title: "Application Bootstrap",
  totalMinutes: 120,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "nest-factory",
      title: "NestFactory and the application bootstrap process",
      durationMinutes: 18,
      explanation: `Every NestJS application starts with a <b>bootstrap process</b>. The bootstrap function is responsible for creating the Nest application, configuring it, and finally starting the HTTP server.

The most common entry point is \`NestFactory.create(AppModule)\`. Nest reads the module graph beginning with \`AppModule\`, creates the dependency injection container, discovers controllers and providers, and prepares the application.

Think about a real-world e-commerce application. Your \`AppModule\` may import an authentication module, product module, order module, payment module, and database module. When you call \`NestFactory.create(AppModule)\`, Nest is not simply creating an Express server. It is constructing the application and its dependency graph.

The simplest bootstrap looks like this:

\`\`\`ts
const app = await NestFactory.create(AppModule);
await app.listen(3000);
\`\`\`

At a more advanced level, the bootstrap function becomes the place where application-wide behavior is configured. This includes validation, authentication guards, logging interceptors, exception filters, CORS, API prefixes, Swagger, shutdown hooks, and other infrastructure.

A useful mental model is:

\`\`\`
main.ts
   |
   v
NestFactory.create(AppModule)
   |
   +--> Build module graph
   |
   +--> Create dependency injection container
   |
   +--> Discover controllers/providers
   |
   +--> Configure application
   |
   +--> Start HTTP server
   |
   v
Application ready
\`\`\`

<b>Beginner real-world example:</b>

Imagine a small task-management API. You have a \`TasksController\` and \`TasksService\`. Your bootstrap only needs to create the application and listen on a port.

<b>Intermediate real-world example:</b>

Imagine a company API with hundreds of endpoints. You want every request to use validation, a common API prefix, and CORS. The bootstrap becomes the central place for these cross-cutting application settings.

<b>Advanced real-world example:</b>

Imagine a production payment API running inside Kubernetes. The bootstrap configures validation, authentication, logging, exception handling, Swagger in non-production environments, CORS, shutdown hooks, and graceful termination. The application must also stop accepting new work before closing database and queue connections.

This is why \`main.ts\` should be treated as an application composition root rather than just a file containing \`app.listen()\`.`,
      diagram: `main.ts
   |
   +--> NestFactory.create(AppModule)
   |
   +--> Global Pipes
   |
   +--> Global Guards
   |
   +--> Global Interceptors
   |
   +--> Global Filters
   |
   +--> CORS
   |
   +--> API Prefix
   |
   +--> Swagger
   |
   +--> Shutdown Hooks
   |
   +--> app.listen()
   |
   v
Running NestJS Application`,
      codeExample: {
        title: "Basic to production-style bootstrap",
        code: `import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();

  app.setGlobalPrefix("api");

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();`,
      },
      keyTakeaways: [
        "`NestFactory.create(AppModule)` creates the Nest application.",
        "The bootstrap function is the composition root for application-wide configuration.",
        "Global pipes, guards, interceptors, filters, CORS, prefixes, Swagger, and shutdown hooks are commonly configured here.",
        "`app.listen()` starts accepting HTTP requests.",
        "Production applications usually need considerably more bootstrap configuration than a beginner application.",
      ],
      commonMistakes: [
        "<b>Putting all application configuration inside controllers.</b> Application-wide behavior belongs at the appropriate global or module level.",
        "<b>Calling `app.listen()` before configuration.</b> Configure the application before starting the server.",
        "<b>Forgetting `await` on `NestFactory.create()`.</b> Application creation is asynchronous.",
        "<b>Putting secrets directly into `main.ts`.</b> Use environment configuration instead of hardcoding credentials.",
      ],
      quiz: [
        {
          question: "What is the usual entry point for creating a NestJS application?",
          options: [
            "`NestFactory.create(AppModule)`",
            "`Controller.create(AppModule)`",
            "`Module.start(AppModule)`",
            "`NestApplication.listen()`",
          ],
          correctIndex: 0,
          explanation:
            "`NestFactory.create(AppModule)` creates the Nest application from the root module.",
        },
        {
          question: "What does `app.listen()` do?",
          options: [
            "Creates a database",
            "Starts the HTTP server",
            "Creates a controller",
            "Registers a DTO",
          ],
          correctIndex: 1,
          explanation:
            "`app.listen()` starts the application listening for incoming network requests.",
        },
      ],
    },
    {
      id: "global-pipes",
      title: "Global pipes and request validation",
      durationMinutes: 18,
      explanation: `A <b>pipe</b> is a component that can transform or validate incoming data before it reaches your route handler.

A common production requirement is validating request bodies. Imagine an endpoint for creating users:

\`\`\`
POST /api/users

{
  "email": "alex@example.com",
  "password": "secret123"
}
\`\`\`

You do not want every controller method to manually check whether \`email\` exists, whether it is a valid email address, or whether the password is long enough.

Nest's \`ValidationPipe\` can handle this when combined with DTO validation decorators.

<b>Beginner real-world example:</b>

A registration endpoint receives an email and password. The DTO declares the expected structure, while \`ValidationPipe\` rejects invalid requests.

<b>Intermediate real-world example:</b>

A SaaS API receives data from web and mobile clients. You enable \`whitelist: true\` so unexpected properties are removed. This helps prevent clients from sending fields your API never intended to accept.

For example:

\`\`\`json
{
  "name": "Alex",
  "role": "admin"
}
\`\`\`

If the DTO only allows \`name\`, the unwanted \`role\` field can be removed.

<b>Advanced real-world example:</b>

A financial API receives transaction requests. You may combine transformation and validation so route parameters, query parameters, and request bodies are converted into the expected types before business logic executes.

The important architectural idea is that validation happens <b>before business logic</b>.

Without validation:

\`\`\`
Request
  |
  v
Controller
  |
  v
Service
  |
  v
Database
\`\`\`

With a global validation pipe:

\`\`\`
Request
  |
  v
ValidationPipe
  |
  +--> Invalid --> 400 response
  |
  v
Controller
  |
  v
Service
  |
  v
Database
\`\`\`

This prevents controllers and services from becoming filled with repetitive validation code.

The \`transform: true\` option is particularly useful when you want Nest to transform incoming values into the types represented by your DTOs and route/query parameter definitions.`,
      diagram: `HTTP Request
     |
     v
Global ValidationPipe
     |
     +---- Invalid ----> 400 Bad Request
     |
     v
Validated / transformed data
     |
     v
Controller
     |
     v
Service`,
      codeExample: {
        title: "Global ValidationPipe with DTO validation",
        code: `// create-user.dto.ts
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

// main.ts
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}

bootstrap();

// users.controller.ts
import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./create-user.dto";

@Controller("users")
export class UsersController {
  @Post()
  create(@Body() dto: CreateUserDto) {
    return {
      message: "User created",
      email: dto.email,
    };
  }
}`,
      },
      keyTakeaways: [
        "Pipes can validate and transform incoming request data.",
        "`ValidationPipe` is commonly configured globally.",
        "`whitelist: true` helps remove properties that are not defined by the DTO.",
        "`transform: true` enables useful input transformation.",
        "Validation should happen before business logic.",
      ],
      commonMistakes: [
        "<b>Assuming TypeScript types validate HTTP input.</b> TypeScript types disappear at runtime.",
        "<b>Forgetting validation decorators.</b> `ValidationPipe` needs runtime validation metadata from DTO decorators.",
        "<b>Accepting arbitrary request properties.</b> Consider `whitelist: true` for APIs that should restrict accepted fields.",
        "<b>Doing all validation manually inside services.</b> Request-shape validation belongs closer to the request boundary.",
      ],
      quiz: [
        {
          question: "What is a common purpose of `ValidationPipe`?",
          options: [
            "Start the database",
            "Validate and transform incoming data",
            "Create controllers",
            "Generate Swagger HTML",
          ],
          correctIndex: 1,
          explanation:
            "`ValidationPipe` validates incoming data and can transform it before it reaches the handler.",
        },
        {
          question: "What does `whitelist: true` help with?",
          options: [
            "Removing unexpected DTO properties",
            "Encrypting passwords",
            "Starting the HTTP server",
            "Creating database indexes",
          ],
          correctIndex: 0,
          explanation:
            "Whitelist mode removes properties that are not allowed by the DTO.",
        },
      ],
    },
    {
      id: "global-guards",
      title: "Global guards and application-wide authorization",
      durationMinutes: 16,
      explanation: `A <b>guard</b> determines whether a request is allowed to continue to a route handler.

Guards are especially useful for authentication and authorization.

Imagine an internal company API. Every request should identify the user before protected controllers execute. Instead of adding authentication logic manually to hundreds of controller methods, you can configure an authentication guard globally.

The request flow becomes:

\`\`\`
HTTP Request
    |
    v
Global Guard
    |
    +---- rejected ----> 401 / 403
    |
    v
Controller
    |
    v
Service
\`\`\`

<b>Beginner real-world example:</b>

A simple API requires an API key. The guard checks the request header and rejects requests without the correct key.

<b>Intermediate real-world example:</b>

A web application uses JWT authentication. A global authentication guard checks the token and attaches the authenticated user to the request.

<b>Advanced real-world example:</b>

An enterprise system has authentication plus role-based access control. A global guard verifies identity, while route metadata declares required roles.

For example:

\`\`\`ts
@Roles("admin")
@Delete(":id")
removeUser() {}
\`\`\`

The guard can read the metadata and determine whether the authenticated user has the required role.

A very important distinction is:

<b>Authentication</b> answers: "Who are you?"

<b>Authorization</b> answers: "Are you allowed to perform this operation?"

Guards are often where these decisions are enforced.

A global guard does not necessarily mean every route must be protected forever. Real applications often have public endpoints such as health checks, login, registration, and webhook endpoints. A guard can support metadata such as \`@Public()\` to explicitly bypass authentication for those routes.`,
      diagram: `HTTP Request
     |
     v
Authentication Guard
     |
     +--> No identity ----> 401
     |
     v
Authorization Guard
     |
     +--> Insufficient role -> 403
     |
     v
Controller
     |
     v
Service`,
      codeExample: {
        title: "Global authentication guard with a public route",
        code: `// auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException("Authentication required");
    }

    // A real application would verify a JWT or session here.
    request.user = {
      id: "user-123",
      role: "user",
    };

    return true;
  }
}

// main.ts
const app = await NestFactory.create(AppModule);

app.useGlobalGuards(new AuthGuard());

await app.listen(3000);`,
      },
      keyTakeaways: [
        "Guards decide whether a request can continue.",
        "Authentication and authorization are common guard use cases.",
        "Global guards avoid repeating authentication logic in every controller.",
        "Public routes may need an explicit bypass mechanism.",
        "A 401 response generally represents missing or invalid authentication, while 403 represents insufficient permission.",
      ],
      commonMistakes: [
        "<b>Confusing authentication with authorization.</b> Knowing who the user is does not automatically mean they can perform every action.",
        "<b>Protecting health checks accidentally.</b> Infrastructure endpoints may need to remain publicly accessible within the intended network boundary.",
        "<b>Putting business logic inside guards.</b> Guards should make access decisions, not become entire application services.",
        "<b>Trusting a decoded JWT without verifying it.</b> Production authentication must cryptographically verify credentials.",
      ],
      quiz: [
        {
          question: "What is the primary responsibility of a guard?",
          options: [
            "Format JSON",
            "Decide whether a request can continue",
            "Create database tables",
            "Generate Swagger schemas",
          ],
          correctIndex: 1,
          explanation:
            "Guards control whether execution is allowed to continue to the route handler.",
        },
        {
          question: "What does authentication answer?",
          options: [
            "What database should be used?",
            "Who is the user?",
            "What response format is required?",
            "Which port is open?",
          ],
          correctIndex: 1,
          explanation:
            "Authentication establishes the identity of the caller.",
        },
      ],
    },
    {
      id: "global-interceptors",
      title: "Global interceptors and request/response behavior",
      durationMinutes: 16,
      explanation: `Interceptors wrap around request handling. They can execute logic <b>before</b> a controller handler, <b>after</b> it, or both.

This makes interceptors useful for cross-cutting behavior such as logging, response transformation, timing, metrics, tracing, and caching.

Imagine an API where every request should record how long it took.

Instead of adding this to every controller:

\`\`\`ts
const start = Date.now();
// execute business logic
console.log(Date.now() - start);
\`\`\`

you can create one interceptor.

<b>Beginner real-world example:</b>

A logging interceptor prints the HTTP method, URL, and execution time.

<b>Intermediate real-world example:</b>

A response interceptor converts:

\`\`\`json
{
  "id": 123,
  "name": "Laptop"
}
\`\`\`

into a consistent API envelope:

\`\`\`json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "Laptop"
  }
}
\`\`\`

<b>Advanced real-world example:</b>

A production observability interceptor creates a correlation ID, records request duration, sends metrics to an observability platform, and adds tracing information to logs.

The interceptor sits around the handler:

\`\`\`
Request
  |
  v
Interceptor BEFORE
  |
  v
Guard
  |
  v
Controller
  |
  v
Service
  |
  v
Interceptor AFTER
  |
  v
Response
\`\`\`

The exact lifecycle ordering depends on the Nest execution pipeline, so you should think of an interceptor as a wrapper around handler execution rather than simply "something that runs before the controller."`,
      diagram: `Request
   |
   v
Interceptor
   |
   +--> before handler logic
   |
   v
Controller
   |
   v
Service
   |
   v
Interceptor
   |
   +--> after handler logic
   |
   v
Response`,
      codeExample: {
        title: "Global request timing interceptor",
        code: `import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const startedAt = Date.now();

    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startedAt;

        console.log(
          \`\${request.method} \${request.url} - \${duration}ms\`,
        );
      }),
    );
  }
}

// main.ts
const app = await NestFactory.create(AppModule);

app.useGlobalInterceptors(new TimingInterceptor());

await app.listen(3000);`,
      },
      keyTakeaways: [
        "Interceptors wrap controller execution.",
        "They can perform work before and after the handler.",
        "Logging, timing, tracing, response transformation, and metrics are common use cases.",
        "RxJS Observables are commonly used inside Nest interceptors.",
        "Interceptors are useful when the behavior should apply consistently across many endpoints.",
      ],
      commonMistakes: [
        "<b>Using interceptors for authentication.</b> Guards are designed for access decisions.",
        "<b>Putting business rules into a global interceptor.</b> Keep domain behavior in services and use interceptors for cross-cutting concerns.",
        "<b>Forgetting to return `next.handle()`.</b> The request pipeline needs the Observable to continue.",
        "<b>Logging sensitive data.</b> Production logging should avoid passwords, tokens, secrets, and unnecessary personal information.",
      ],
      quiz: [
        {
          question: "What is a common use case for an interceptor?",
          options: [
            "Request timing and logging",
            "Creating SQL tables",
            "Defining DTO classes",
            "Installing npm packages",
          ],
          correctIndex: 0,
          explanation:
            "Interceptors are well suited to cross-cutting concerns such as logging and timing.",
        },
        {
          question: "What must a typical interceptor do to continue request execution?",
          options: [
            "Return `next.handle()`",
            "Call `app.listen()`",
            "Create a new module",
            "Throw an exception",
          ],
          correctIndex: 0,
          explanation:
            "`next.handle()` continues execution of the handler pipeline.",
        },
      ],
    },
    {
      id: "global-filters",
      title: "Global exception filters",
      durationMinutes: 16,
      explanation: `Exception filters give you control over how exceptions are converted into HTTP responses.

Nest already provides default exception handling, so you do not need a custom filter for every application. However, production applications often need consistent error responses and centralized logging.

Imagine an e-commerce API. Different services may throw different exceptions:

\`\`\`
NotFoundException
UnauthorizedException
BadRequestException
ConflictException
InternalServerErrorException
\`\`\`

A global filter can make sure the API consistently returns an error structure.

For example:

\`\`\`json
{
  "success": false,
  "statusCode": 404,
  "message": "Product not found",
  "path": "/api/products/123"
}
\`\`\`

<b>Beginner real-world example:</b>

Create a filter that returns a predictable JSON structure for HTTP exceptions.

<b>Intermediate real-world example:</b>

Add request path, timestamp, HTTP status, and a request ID to every error response.

<b>Advanced real-world example:</b>

A production filter separates safe client-facing errors from internal errors. A database exception might be logged with full diagnostic details internally while the client receives only a generic 500 response.

This distinction is extremely important.

You generally do not want this:

\`\`\`json
{
  "error": "Postgres connection failed at 10.2.4.18",
  "password": "...",
  "query": "..."
}
\`\`\`

The client should receive a safe response while detailed diagnostics go to internal logs.

Exception filters therefore serve two audiences:

\`\`\`
Exception
   |
   +--> Safe client response
   |
   +--> Detailed internal logging
\`\`\``,
      diagram: `Controller / Service
        |
        +---- throw exception
                    |
                    v
             Global Filter
              /         \\
             /           \\
            v             v
     Safe API response   Internal logs
            |
            v
          Client`,
      codeExample: {
        title: "Global HTTP exception filter",
        code: `import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      success: false,
      statusCode: status,
      message: exceptionResponse,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

// main.ts
const app = await NestFactory.create(AppModule);

app.useGlobalFilters(new HttpExceptionFilter());

await app.listen(3000);`,
      },
      keyTakeaways: [
        "Exception filters customize how exceptions become responses.",
        "Global filters provide consistent error behavior.",
        "Client-facing errors should not expose sensitive internal details.",
        "Internal diagnostics should go to controlled logging systems.",
        "Nest's default exception handling is useful, so custom filters should solve a real application requirement.",
      ],
      commonMistakes: [
        "<b>Returning database errors directly to clients.</b> Internal exceptions may contain sensitive implementation details.",
        "<b>Creating one filter for every tiny exception.</b> Prefer a clear global strategy when the response format is consistent.",
        "<b>Swallowing exceptions.</b> An error should still be observable and correctly represented to the caller.",
        "<b>Logging secrets.</b> Error logs should be treated as sensitive operational data.",
      ],
      quiz: [
        {
          question: "What is the main purpose of an exception filter?",
          options: [
            "Customize exception handling and responses",
            "Start NestJS",
            "Validate DTOs",
            "Create database schemas",
          ],
          correctIndex: 0,
          explanation:
            "Exception filters customize how exceptions are handled and represented to clients.",
        },
        {
          question: "Why should internal database errors usually not be returned directly?",
          options: [
            "They are always invalid JSON",
            "They may expose sensitive implementation details",
            "Nest cannot return errors",
            "Controllers cannot throw errors",
          ],
          correctIndex: 1,
          explanation:
            "Internal errors can reveal infrastructure, queries, credentials, or other sensitive information.",
        },
      ],
    },
    {
      id: "cors",
      title: "CORS and browser-based clients",
      durationMinutes: 12,
      explanation: `CORS stands for <b>Cross-Origin Resource Sharing</b>. It controls which browser origins are allowed to make cross-origin requests to your API.

Imagine your backend is running at:

\`\`\`
https://api.example.com
\`\`\`

and your frontend is running at:

\`\`\`
https://app.example.com
\`\`\`

These are different origins. A browser may block frontend JavaScript from reading the API response unless the API explicitly permits the origin through CORS headers.

<b>Beginner real-world example:</b>

You are developing locally:

\`\`\`
Frontend: http://localhost:3001
Backend:  http://localhost:3000
\`\`\`

You enable CORS for the frontend origin.

<b>Intermediate real-world example:</b>

A SaaS platform has a production frontend and an administrative dashboard. Only those known origins should be allowed.

<b>Advanced real-world example:</b>

A production API needs credentialed requests. You configure allowed origins, HTTP methods, headers, and credentials carefully instead of allowing every origin.

A common mistake is using:

\`\`\`ts
app.enableCors();
\`\`\`

without understanding what policy your production API actually needs.

For development this can be convenient. Production applications should deliberately configure their CORS policy based on the clients that are supposed to access the API.

Also remember: <b>CORS is a browser security mechanism.</b> It is not an authentication mechanism. A server-to-server request is not protected by browser CORS rules in the same way.`,
      diagram: `Browser
  |
  | Origin: https://app.example.com
  |
  v
API: https://api.example.com
  |
  +--> CORS policy
  |
  +--> Allowed? ---- No ---> Browser blocks access
  |
  +--> Allowed? ---- Yes --> Response available`,
      codeExample: {
        title: "Development and production CORS configuration",
        code: `const app = await NestFactory.create(AppModule);

app.enableCors({
  origin: [
    "http://localhost:3001",
    "https://app.example.com",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
});

await app.listen(3000);`,
      },
      keyTakeaways: [
        "CORS controls browser access across origins.",
        "Development and production environments often need different CORS policies.",
        "CORS is not authentication.",
        "Credentialed browser requests require careful origin configuration.",
        "Avoid allowing arbitrary origins in production unless that is intentionally required.",
      ],
      commonMistakes: [
        "<b>Thinking CORS protects the API from non-browser clients.</b> CORS is primarily enforced by browsers.",
        "<b>Using wildcard origins with credentials.</b> Credentialed CORS requires an explicit origin rather than an unrestricted wildcard.",
        "<b>Allowing every origin in production.</b> Configure only the origins that should access the API.",
        "<b>Debugging authentication when the real problem is CORS.</b> Browser console errors often reveal cross-origin policy problems.",
      ],
      quiz: [
        {
          question: "What does CORS primarily control?",
          options: [
            "Database permissions",
            "Browser cross-origin access",
            "JWT encryption",
            "Node.js memory",
          ],
          correctIndex: 1,
          explanation:
            "CORS controls whether browsers permit frontend JavaScript to access cross-origin responses.",
        },
        {
          question: "Is CORS an authentication mechanism?",
          options: [
            "Yes",
            "No",
            "Only with JWT",
            "Only in production",
          ],
          correctIndex: 1,
          explanation:
            "CORS controls browser access and does not replace authentication or authorization.",
        },
      ],
    },
    {
      id: "api-prefixes",
      title: "API prefixes and versioned routes",
      durationMinutes: 12,
      explanation: `An API prefix allows you to place your API routes under a common path.

Without a prefix:

\`\`\`
GET /users
GET /products
GET /orders
\`\`\`

With:

\`\`\`
GET /api/users
GET /api/products
GET /api/orders
\`\`\`

This is especially useful when the same domain serves multiple kinds of content.

<b>Beginner real-world example:</b>

Your NestJS server hosts an API, so every endpoint begins with \`/api\`.

<b>Intermediate real-world example:</b>

Your company needs versioned APIs:

\`\`\`
/api/v1/users
/api/v1/orders
\`\`\`

Later, you introduce breaking changes:

\`\`\`
/api/v2/users
/api/v2/orders
\`\`\`

This allows old clients to continue working while new clients migrate.

<b>Advanced real-world example:</b>

A mobile application may remain on API v1 for months because users do not update immediately. Meanwhile the web application can use v2. Versioning gives the organization a migration strategy rather than forcing every client to upgrade simultaneously.

Nest supports several versioning approaches, including URI, header, and media-type versioning.

A prefix and versioning solve related but different problems.

\`\`\`
/api/v1/users
 |    |
 |    +--> API version
 |
 +-------> API namespace
\`\`\`

Do not introduce versions merely because it sounds professional. API versioning is useful when clients need compatibility across breaking changes.`,
      diagram: `/api
  |
  +--> /v1
  |     |
  |     +--> users
  |     +--> orders
  |
  +--> /v2
        |
        +--> users
        +--> orders

Old clients -> v1
New clients -> v2`,
      codeExample: {
        title: "API prefix and URI versioning",
        code: `const app = await NestFactory.create(AppModule);

app.setGlobalPrefix("api");

app.enableVersioning({
  type: VersioningType.URI,
});

await app.listen(3000);

// Controller
@Controller({
  path: "users",
  version: "1",
})
export class UsersV1Controller {
  @Get()
  findAll() {
    return {
      version: "v1",
      users: [],
    };
  }
}

// Result:
// GET /api/v1/users`,
      },
      keyTakeaways: [
        "Global prefixes create a consistent namespace for API routes.",
        "API versioning helps manage breaking changes.",
        "URI versioning is one common versioning strategy.",
        "Versioning should support an actual compatibility requirement.",
        "Different clients may use different API versions during migrations.",
      ],
      commonMistakes: [
        "<b>Breaking existing clients without a migration strategy.</b> Public APIs often need backward compatibility.",
        "<b>Confusing a global prefix with API versioning.</b> `/api` is a namespace; `/v1` identifies a version.",
        "<b>Versioning every internal endpoint unnecessarily.</b> Use it when compatibility requirements justify it.",
      ],
      quiz: [
        {
          question: "What does `app.setGlobalPrefix(" + '"api"' + ")` do?",
          options: [
            "Adds `/api` to application routes",
            "Creates a database named api",
            "Enables JWT authentication",
            "Creates Swagger documentation",
          ],
          correctIndex: 0,
          explanation:
            "The global prefix places routes under the `/api` namespace.",
        },
        {
          question: "Why is API versioning useful?",
          options: [
            "It makes JavaScript faster",
            "It helps manage breaking API changes",
            "It replaces authentication",
            "It creates database backups",
          ],
          correctIndex: 1,
          explanation:
            "Versioning lets clients continue using a compatible API while newer versions evolve.",
        },
      ],
    },
    {
      id: "swagger-setup",
      title: "Swagger and interactive API documentation",
      durationMinutes: 12,
      explanation: `Swagger, through Nest's OpenAPI integration, can generate interactive API documentation from your controllers, DTOs, decorators, and schemas.

This is extremely useful in real projects because backend developers are rarely the only people consuming an API. Frontend developers, mobile developers, QA engineers, external integrators, and other backend services may all need to understand the API contract.

<b>Beginner real-world example:</b>

A developer opens:

\`\`\`
http://localhost:3000/docs
\`\`\`

and sees available endpoints without needing to read the controller source code.

<b>Intermediate real-world example:</b>

Your DTOs are decorated with Swagger metadata, so the documentation shows request bodies and response schemas.

<b>Advanced real-world example:</b>

An organization publishes OpenAPI documentation for multiple services. Frontend teams use the generated schema to understand authentication, request models, response models, and error responses. CI can also validate that API changes are intentional.

Swagger is not the API itself. It is a representation of the API contract.

A useful architecture is:

\`\`\`
Nest Controllers
      |
      v
OpenAPI metadata
      |
      v
SwaggerModule
      |
      v
OpenAPI document
      |
      v
Interactive API documentation
\`\`\`

Authentication documentation is also important. If your API uses bearer tokens, document the security scheme so consumers understand how protected endpoints are called.`,
      diagram: `Controllers
   |
   +--> Decorators
   |
   +--> DTO metadata
   |
   v
SwaggerModule
   |
   v
OpenAPI Document
   |
   v
/docs
   |
   +--> Endpoints
   +--> Request schemas
   +--> Response schemas
   +--> Authentication`,
      codeExample: {
        title: "Basic Swagger setup",
        code: `import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Commerce API")
    .setDescription("REST API for the commerce platform")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("docs", app, document);

  await app.listen(3000);
}

bootstrap();

// Swagger UI:
// http://localhost:3000/docs`,
      },
      keyTakeaways: [
        "Nest can generate OpenAPI documentation from application metadata.",
        "Swagger UI provides interactive API documentation.",
        "DTO and controller metadata can improve generated schemas.",
        "Bearer authentication can be documented with `.addBearerAuth()`.",
        "Swagger documentation is useful for frontend, mobile, QA, integration, and backend teams.",
      ],
      commonMistakes: [
        "<b>Assuming Swagger automatically documents everything perfectly.</b> Complex request and response models may need explicit metadata.",
        "<b>Publishing sensitive internal API documentation publicly.</b> Consider whether documentation should be public, authenticated, or disabled in certain environments.",
        "<b>Forgetting to document authentication.</b> Consumers need to understand how protected endpoints are called.",
        "<b>Treating Swagger as runtime validation.</b> Swagger documents the API; DTO validation enforces request rules at runtime.",
      ],
      quiz: [
        {
          question: "What does Swagger provide in a NestJS application?",
          options: [
            "Interactive API documentation",
            "A replacement for PostgreSQL",
            "Automatic authentication",
            "A Node.js runtime",
          ],
          correctIndex: 0,
          explanation:
            "Swagger/OpenAPI integration generates interactive documentation for the API.",
        },
        {
          question: "What is `SwaggerModule.createDocument()` used for?",
          options: [
            "Creating the OpenAPI document",
            "Creating a database connection",
            "Starting the HTTP server",
            "Validating passwords",
          ],
          correctIndex: 0,
          explanation:
            "It creates the OpenAPI document from the Nest application metadata.",
        },
      ],
    },
    {
      id: "complete-bootstrap",
      title: "Putting the complete bootstrap pipeline together",
      durationMinutes: 20,
      explanation: `Now combine the individual pieces into a production-style NestJS bootstrap.

A real \`main.ts\` often looks more complex than the examples above because it is responsible for configuring infrastructure around the application's business modules.

Consider a production e-commerce platform:

\`\`\`
Frontend
   |
   v
CORS
   |
   v
Validation
   |
   v
Authentication
   |
   v
Controller
   |
   v
Business Service
   |
   v
Database / Queue / External APIs
   |
   v
Response
\`\`\`

At the same time, interceptors measure requests and exception filters normalize errors.

A useful bootstrap configuration might include:

- \`ValidationPipe\` for request validation.
- Global authentication or authorization guards.
- Logging or timing interceptors.
- Global exception filters.
- CORS configuration.
- API prefixes.
- API versioning.
- Swagger documentation.
- Shutdown hooks.

<b>Beginner real-world example:</b>

A small personal API may only need:

\`\`\`ts
NestFactory.create()
app.enableCors()
app.listen()
\`\`\`

<b>Intermediate real-world example:</b>

A team API may add validation, \`/api\` prefix, Swagger, and authentication.

<b>Advanced real-world example:</b>

A production microservice may additionally configure structured logging, distributed tracing, health checks, graceful shutdown, environment-specific Swagger, strict CORS, authentication, authorization, metrics, and external infrastructure clients.

The important lesson is not to copy every configuration into every project. Instead, understand what problem each piece solves.

A good bootstrap file should answer:

<b>How is this application configured before it begins serving traffic?</b>

It should not contain the business logic for orders, payments, users, or products. Those belong in their modules and services.

The bootstrap is infrastructure composition.`,
      diagram: `                         Nest Application
                               |
                    +----------+----------+
                    |                     |
                 Incoming              Lifecycle
                  Request                Setup
                    |                     |
                    v                     +--> Shutdown hooks
                  CORS
                    |
                    v
             Global Validation
                    |
                    v
             Global Guard
                    |
                    v
             Global Interceptor
                    |
                    v
                Controller
                    |
                    v
                 Service
                    |
             +------+------+
             |             |
          Database       Queue
             |
             v
             Response
                    |
                    v
             Global Filter
                    |
                    v
                  Client`,
      codeExample: {
        title: "Production-style main.ts",
        code: `import {
  ValidationPipe,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  DocumentBuilder,
  SwaggerModule,
} from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { AuthGuard } from "./common/guards/auth.guard";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TimingInterceptor } from "./common/interceptors/timing.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Request validation and transformation.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Application-wide authentication.
  app.useGlobalGuards(new AuthGuard());

  // Application-wide timing/logging.
  app.useGlobalInterceptors(new TimingInterceptor());

  // Consistent HTTP exception responses.
  app.useGlobalFilters(new HttpExceptionFilter());

  // Browser client access.
  app.enableCors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://app.example.com"]
        : ["http://localhost:3001"],
    credentials: true,
  });

  // API namespace.
  app.setGlobalPrefix("api");

  // Graceful shutdown support.
  app.enableShutdownHooks();

  // Swagger should often be restricted or disabled in production.
  if (process.env.NODE_ENV !== "production") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("Commerce API")
      .setDescription("Commerce platform API")
      .setVersion("1.0")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(
      app,
      swaggerConfig,
    );

    SwaggerModule.setup("docs", app, document);
  }

  const port = Number(process.env.PORT ?? 3000);

  await app.listen(port);

  console.log(
    \`Application running on port \${port}\`,
  );
}

bootstrap();`,
      },
      keyTakeaways: [
        "The bootstrap file composes application-wide infrastructure.",
        "Global pipes handle validation and transformation.",
        "Global guards handle access decisions.",
        "Global interceptors handle cross-cutting request/response behavior.",
        "Global filters provide consistent exception handling.",
        "CORS controls browser cross-origin access.",
        "API prefixes organize routes.",
        "Swagger documents the API contract.",
        "Shutdown hooks help the application participate in graceful termination.",
        "Environment-specific configuration is important for production systems.",
      ],
      commonMistakes: [
        "<b>Copying a production bootstrap into every project without understanding it.</b> Each configuration should solve an actual requirement.",
        "<b>Enabling every feature globally.</b> Global behavior affects the entire application and should be deliberate.",
        "<b>Exposing Swagger publicly without considering the environment.</b> Documentation can reveal the API surface and may need access controls.",
        "<b>Putting business logic in `main.ts`.</b> Keep domain logic inside modules and services.",
        "<b>Hardcoding production URLs.</b> Use environment configuration for deployment-specific values.",
      ],
      quiz: [
        {
          question: "What is the primary role of `main.ts` in a NestJS application?",
          options: [
            "Store business rules",
            "Compose and configure the application before startup",
            "Replace all services",
            "Define every database query",
          ],
          correctIndex: 1,
          explanation:
            "The bootstrap file is primarily responsible for creating and configuring the application.",
        },
        {
          question: "Which feature is responsible for request validation?",
          options: [
            "Guard",
            "Interceptor",
            "ValidationPipe",
            "Swagger",
          ],
          correctIndex: 2,
          explanation:
            "ValidationPipe validates and can transform incoming request data.",
        },
        {
          question: "Which feature is intended for access-control decisions?",
          options: [
            "Guard",
            "Swagger",
            "CORS",
            "Filter",
          ],
          correctIndex: 0,
          explanation:
            "Guards decide whether execution is allowed to continue.",
        },
        {
          question: "Which feature is commonly used for request timing?",
          options: [
            "Interceptor",
            "DTO",
            "Module",
            "Pipe",
          ],
          correctIndex: 0,
          explanation:
            "Interceptors can wrap handler execution and measure how long it takes.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What does `NestFactory.create(AppModule)` do?",
      options: [
        "Creates the Nest application from the root module",
        "Creates a database table",
        "Creates a DTO",
        "Starts Swagger only",
      ],
      correctIndex: 0,
      explanation:
        "`NestFactory.create(AppModule)` creates the Nest application and initializes its module graph.",
    },
    {
      question: "What is the primary purpose of a global ValidationPipe?",
      options: [
        "Validate and transform incoming request data",
        "Authenticate every user",
        "Generate API documentation",
        "Start the HTTP server",
      ],
      correctIndex: 0,
      explanation:
        "ValidationPipe provides centralized request validation and optional transformation.",
    },
    {
      question: "What does `whitelist: true` help accomplish?",
      options: [
        "Remove properties not allowed by the DTO",
        "Encrypt request bodies",
        "Enable CORS",
        "Create API versions",
      ],
      correctIndex: 0,
      explanation:
        "Whitelist mode strips properties that are not part of the validated DTO.",
    },
    {
      question: "Which NestJS feature is primarily responsible for authorization decisions?",
      options: [
        "Guard",
        "Interceptor",
        "Swagger",
        "Exception filter",
      ],
      correctIndex: 0,
      explanation:
        "Guards determine whether a request should be allowed to continue.",
    },
    {
      question: "What is the difference between authentication and authorization?",
      options: [
        "Authentication identifies the user; authorization determines what the user can access",
        "They are exactly the same",
        "Authentication validates JSON; authorization validates SQL",
        "Authentication is only for Swagger",
      ],
      correctIndex: 0,
      explanation:
        "Authentication establishes identity, while authorization determines permissions.",
    },
    {
      question: "What is a common use case for a global interceptor?",
      options: [
        "Request timing and logging",
        "Creating database schemas",
        "Defining environment variables",
        "Installing packages",
      ],
      correctIndex: 0,
      explanation:
        "Interceptors are well suited for cross-cutting concerns such as timing, logging, metrics, and response transformation.",
    },
    {
      question: "Why would an application use a global exception filter?",
      options: [
        "To provide consistent exception responses",
        "To replace all controllers",
        "To enable TypeScript",
        "To create JWT tokens",
      ],
      correctIndex: 0,
      explanation:
        "Exception filters allow centralized control over how exceptions are converted into responses.",
    },
    {
      question: "What does CORS primarily control?",
      options: [
        "Browser access to resources across origins",
        "Database migrations",
        "JWT signing",
        "Node.js garbage collection",
      ],
      correctIndex: 0,
      explanation:
        "CORS is a browser security mechanism controlling cross-origin access.",
    },
    {
      question: "Is CORS a replacement for authentication?",
      options: [
        "Yes",
        "No",
        "Only for mobile apps",
        "Only in development",
      ],
      correctIndex: 1,
      explanation:
        "CORS controls browser cross-origin access and does not authenticate API callers.",
    },
    {
      question: "What does `app.setGlobalPrefix(" + '"api"' + ")` do?",
      options: [
        "Adds `/api` as a common route prefix",
        "Creates an API database",
        "Enables JWT authentication",
        "Generates Swagger",
      ],
      correctIndex: 0,
      explanation:
        "The global prefix places application routes under `/api`.",
    },
    {
      question: "Why might an API use `/v1` and `/v2`?",
      options: [
        "To support different API contracts during breaking changes",
        "To improve database indexing",
        "To enable CORS",
        "To replace DTOs",
      ],
      correctIndex: 0,
      explanation:
        "API versions allow clients to remain on a compatible contract while newer versions evolve.",
    },
    {
      question: "What does `SwaggerModule.createDocument()` create?",
      options: [
        "An OpenAPI document",
        "A database connection",
        "A Nest controller",
        "A JWT token",
      ],
      correctIndex: 0,
      explanation:
        "It generates an OpenAPI document from the Nest application's metadata.",
    },
    {
      question: "Why should Swagger documentation sometimes be restricted in production?",
      options: [
        "It can expose the available API surface and internal endpoint information",
        "Swagger cannot work with HTTPS",
        "Swagger always crashes production",
        "It prevents controllers from working",
      ],
      correctIndex: 0,
      explanation:
        "API documentation can reveal endpoint structure and capabilities, so production access should be deliberate.",
    },
    {
      question: "Which configuration helps Nest respond to termination signals?",
      options: [
        "`app.enableShutdownHooks()`",
        "`app.enableSwagger()`",
        "`app.enableCors()`",
        "`app.enableValidation()`",
      ],
      correctIndex: 0,
      explanation:
        "`enableShutdownHooks()` allows Nest lifecycle shutdown handling to participate in application termination.",
    },
    {
      question: "Where should business logic for processing an order normally live?",
      options: [
        "Inside the domain service/module",
        "Inside `main.ts`",
        "Inside Swagger configuration",
        "Inside the CORS configuration",
      ],
      correctIndex: 0,
      explanation:
        "The bootstrap should compose infrastructure; business logic belongs in the application's modules and services.",
    },
  ],
  project: {
    name: "Production-ready NestJS bootstrap",
    goal: "Build a NestJS application bootstrap that demonstrates global validation, authentication, logging, exception handling, CORS, API prefixes, Swagger, and shutdown preparation.",
    brief: "Create a small commerce API with users, products, and orders. Configure the application from main.ts so that cross-cutting infrastructure is centralized while business logic remains inside modules and services.",
    steps: [
      "Create a NestJS application with AppModule as the root module.",
      "Create UsersModule, ProductsModule, and OrdersModule.",
      "Create DTOs for creating users, products, and orders.",
      "Configure a global ValidationPipe with whitelist and transform enabled.",
      "Create a global authentication guard.",
      "Add a public-route mechanism for login and health endpoints.",
      "Create a global interceptor that measures request duration.",
      "Create a global exception filter with a consistent error response.",
      "Configure CORS for a local frontend origin.",
      "Add an /api global prefix.",
      "Add API versioning and create at least one versioned endpoint.",
      "Configure Swagger under /docs.",
      "Document bearer authentication in Swagger.",
      "Enable shutdown hooks.",
      "Read the server port from an environment variable.",
      "Keep business logic out of main.ts.",
      "Test valid and invalid DTO requests.",
      "Test an unauthenticated request.",
      "Test a protected authenticated request.",
      "Open Swagger and verify the documented endpoints.",
    ],
    acceptance: [
      "The application starts successfully through NestFactory.",
      "Invalid DTO requests are rejected before reaching business logic.",
      "Unexpected DTO properties are removed or rejected according to the configured validation policy.",
      "A global authentication guard protects the intended routes.",
      "Public routes can explicitly bypass authentication.",
      "A global interceptor records request execution time.",
      "Exceptions use a consistent response format.",
      "CORS allows the intended frontend origin.",
      "API routes are available under the /api prefix.",
      "At least one endpoint is versioned.",
      "Swagger documentation is available at /docs in the intended environment.",
      "Bearer authentication is represented in Swagger.",
      "Shutdown hooks are enabled.",
      "main.ts contains application configuration rather than domain business logic.",
    ],
    stretch: [
      "Add a correlation ID to every request.",
      "Return the correlation ID in response headers.",
      "Add structured JSON logging.",
      "Add a role-based authorization guard on an admin endpoint.",
      "Add an @Public() decorator for routes that should bypass authentication.",
      "Generate richer Swagger schemas using ApiProperty decorators.",
      "Configure separate CORS origins for development, staging, and production.",
      "Disable Swagger automatically in production.",
      "Add health and readiness endpoints.",
      "Add request metrics that record status code and response duration.",
      "Create a custom exception hierarchy for domain errors.",
      "Integrate the bootstrap with the lifecycle and graceful-shutdown patterns learned in the next lesson.",
    ],
  },
};
