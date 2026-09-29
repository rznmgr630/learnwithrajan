import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_16_LESSONS: LessonDay = {
  day: 16,
  title: "Middleware",
  totalMinutes: 86,
  difficulty: "Beginner",
  lessons: [
    {
      id: "what-is-middleware",
      title: "What is Middleware?",
      durationMinutes: 18,
      explanation: `Middleware is code that runs <b>between the incoming HTTP request and the part of your application that eventually handles that request</b>.

When a browser, mobile application, or another server sends a request to your NestJS application, the request does not have to go directly to the controller. You can place middleware in the middle and ask it to do some work first.

For example, imagine a user requests:

<code>GET /users/42</code>

Before your controller handles that request, middleware could:

- log the request method and URL
- record how long the request takes
- read a custom header
- add information to the request object
- check a simple condition
- modify the request
- perform some request-level setup

After the middleware finishes its work, it normally calls <code>next()</code>. Calling <code>next()</code> tells NestJS, "I am finished with my middleware work. Continue processing this request."

A useful way to think about middleware is like a security guard or receptionist at the entrance of a building.

A visitor arrives at the building. The receptionist can look at the visitor, record their arrival, attach some information to their visitor pass, and then allow them to continue.

The receptionist does not normally do the actual work inside the building. The receptionist simply performs work before the visitor reaches the appropriate room.

Middleware works in a similar way.

There is one important thing to understand early: <b>middleware is not the same thing as a guard, pipe, interceptor, or controller.</b> NestJS has different request-processing tools because each one is designed for a different kind of job.

Middleware is especially useful for work that should happen around the raw HTTP request and response.

For example, logging is a very natural middleware responsibility.

You might want every request to produce something like:

<code>GET /products/123</code>

and later:

<code>GET /products/123 - 42ms</code>

You could write middleware that records the start time, calls <code>next()</code>, and then listens for the response to finish.

Another common use is adding information to the request.

For example, suppose an upstream proxy sends an internal request ID:

<code>x-request-id: abc-123</code>

Middleware can read that header and make the request ID available to later parts of the application.

This becomes useful when debugging production systems because you can follow one request through logs, services, and external systems.

Middleware can also stop a request.

For example, middleware could check whether a request comes from an allowed internal network. If the request should not continue, middleware can send a response instead of calling <code>next()</code>.

However, you should be careful about putting too much business logic into middleware. If the logic is really about authentication, authorization, validation, transformation, or application-specific business rules, NestJS often has a more appropriate feature for that job.

Think of middleware as an early request-processing layer, not as a place to put everything.

<b>Beginner real-world example:</b>

Imagine an API for an online store.

Every request comes through middleware that logs:

<code>POST /orders</code>

The middleware does not create the order. It simply records that the request arrived and then calls <code>next()</code>.

<b>Intermediate real-world example:</b>

Your application is deployed behind a load balancer. Each incoming request contains an <code>x-request-id</code> header. Middleware reads that ID and attaches it to the request so later logging can use the same ID.

<b>Advanced real-world example:</b>

A production API has distributed tracing. Middleware starts request-level timing and correlation information, attaches tracing metadata to the request, and makes sure the response completion is recorded. The logs from the API, database layer, and other services can then be connected using the same request identifier.

The important idea is simple:

<b>Middleware gets an opportunity to work with a request before the request continues further into the NestJS application.</b>`,
      diagram: `Client
  |
  | GET /products/42
  v
NestJS HTTP Server
  |
  v
Middleware
  |
  |-- log request
  |-- read headers
  |-- attach request data
  |-- optionally stop request
  |
  | next()
  v
Guards
  |
  v
Interceptors
  |
  v
Pipes
  |
  v
Controller
  |
  v
Service
  |
  v
Response
  |
  v
Client

Middleware is an early request-processing layer.`,
      codeExample: {
        title: "A simple logging middleware",
        code: `import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(\`Incoming: \${req.method} \${req.originalUrl}\`);

    next();
  }
}`,
      },
      keyTakeaways: [
        "Middleware runs during request processing before the request reaches the controller.",
        "Middleware receives the request, response, and `next` function.",
        "Calling `next()` allows the request to continue.",
        "Middleware can read and modify request information.",
        "Middleware can also stop a request by sending a response instead of calling `next()`.",
        "Logging and request-level setup are common middleware use cases.",
        "Middleware should not become a dumping ground for business logic.",
      ],
      commonMistakes: [
        "<b>Forgetting to call `next()`.</b> If middleware does not send a response and never calls `next()`, the request can remain stuck.",
        "<b>Putting all authentication logic into middleware.</b> NestJS guards are usually a better fit for authentication and authorization decisions.",
        "<b>Putting database business logic into middleware.</b> Keep application business rules in services and other appropriate layers.",
        "<b>Thinking middleware is the controller.</b> Middleware runs before the controller and normally prepares or processes the request rather than handling the application's main business operation.",
      ],
      quiz: [
        {
          question: "What does `next()` normally do in NestJS middleware?",
          options: [
            "Starts the database",
            "Moves the request to the next processing step",
            "Creates a controller",
            "Ends the response",
          ],
          correctIndex: 1,
          explanation: "Calling `next()` tells the middleware pipeline to continue processing the request.",
        },
        {
          question: "Which is a common middleware use case?",
          options: [
            "Creating a database schema",
            "Logging incoming requests",
            "Defining an entity",
            "Writing SQL migrations",
          ],
          correctIndex: 1,
          explanation: "Request logging is a common and natural middleware responsibility.",
        },
      ],
    },

    {
      id: "functional-middleware",
      title: "Functional Middleware",
      durationMinutes: 17,
      explanation: `The simplest way to create middleware is to use a <b>function</b>.

Functional middleware is just a function that receives the incoming request, the response object, and a <code>next</code> function.

The basic shape looks like this:

<code>(req, res, next) => { ... }</code>

You can inspect the request, do some work, and then call <code>next()</code>.

Functional middleware is especially convenient when the middleware is small and does not need NestJS dependency injection.

For example, suppose you want to print every incoming request:

<code>GET /users</code>

You could write:

<code>function logger(req, res, next) {
  console.log(req.method, req.originalUrl);
  next();
}</code>

This is easy to understand because there is very little NestJS-specific code involved.

Functional middleware is a good choice for small pieces of request processing.

For example:

- logging a request
- adding a simple header
- reading a simple request property
- performing a small request-level check
- measuring request timing

However, functional middleware has an important limitation: <b>it is just a function, so you do not get constructor injection in the same way a NestJS injectable class does.</b>

Suppose your middleware needs a service:

<code>constructor(private readonly auditService: AuditService)</code>

A class-based middleware can participate in NestJS dependency injection. A simple function does not automatically work that way.

This is one of the reasons class middleware exists.

<b>Beginner real-world example:</b>

You have a small API and simply want to print every HTTP request while developing locally.

Functional middleware is enough.

<b>Intermediate real-world example:</b>

You want to add a simple response header such as:

<code>X-API-Version: 1</code>

For a tiny piece of logic, a function is easy to understand and maintain.

<b>Advanced real-world example:</b>

You have a middleware that needs an injected audit logger, configuration service, or tracing service. At this point, a class-based middleware may be a better fit because NestJS can construct it using dependency injection.

The important decision is not "functional middleware is always better" or "class middleware is always better."

Instead, ask:

<b>Does this middleware need NestJS dependency injection or more structure?</b>

If the answer is no, a function can be perfectly reasonable.

If the answer is yes, a class is often more convenient.`,
      diagram: `HTTP Request
     |
     v
Functional Middleware
     |
     +--> inspect req
     |
     +--> do small task
     |
     +--> next()
     |
     v
NestJS request pipeline
     |
     v
Controller

Functional middleware is simply a function
that receives req, res, and next.`,
      codeExample: {
        title: "Functional request logger",
        code: `import { Request, Response, NextFunction } from "express";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(
    \`[\${new Date().toISOString()}] \${req.method} \${req.originalUrl}\`,
  );

  next();
}`,
      },
      keyTakeaways: [
        "Functional middleware is a normal function.",
        "It receives `req`, `res`, and `next`.",
        "Call `next()` when the request should continue.",
        "Functional middleware is convenient for small pieces of logic.",
        "Functional middleware does not provide class-based constructor injection.",
        "Use a class when the middleware needs more structure or injected dependencies.",
      ],
      commonMistakes: [
        "<b>Forgetting `next()`.</b> A middleware function that neither sends a response nor calls `next()` can leave the request hanging.",
        "<b>Making every middleware a huge function.</b> Split complicated responsibilities into smaller pieces.",
        "<b>Trying to inject services directly into a function.</b> If dependency injection is important, consider class middleware.",
      ],
      quiz: [
        {
          question: "What is functional middleware?",
          options: [
            "A database entity",
            "A normal function used during request processing",
            "A controller class",
            "A module",
          ],
          correctIndex: 1,
          explanation: "Functional middleware is a function that participates in the HTTP request pipeline.",
        },
        {
          question: "Which arguments are commonly received by Express-style middleware?",
          options: [
            "`module`, `controller`, `service`",
            "`req`, `res`, `next`",
            "`body`, `query`, `params`",
            "`request`, `database`, `entity`",
          ],
          correctIndex: 1,
          explanation: "Express-style middleware receives the request, response, and next function.",
        },
      ],
    },

    {
      id: "class-middleware",
      title: "Class Middleware",
      durationMinutes: 18,
      explanation: `NestJS also allows you to create middleware as a <b>class</b>.

A class middleware implements the <code>NestMiddleware</code> interface and provides a <code>use()</code> method.

The basic structure looks like this:

<code>@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req, res, next) {
    ...
    next();
  }
}</code>

At first this may look more complicated than a function. The reason to use a class is that the class can participate naturally in NestJS's dependency injection system.

That becomes useful when your middleware needs another service.

Imagine you have:

<code>AuditService</code>

and your middleware needs to record request information.

With class middleware, you can inject the service into the constructor:

<code>constructor(private readonly auditService: AuditService) {}</code>

Now the middleware can call the service when a request arrives.

This is one of the main differences between simple functional middleware and class middleware.

Class middleware also gives you a clear place to organize middleware-related behavior.

For example, an authentication-related request preparation middleware might need:

- a configuration service
- an audit service
- a logger
- a request context service

Putting these dependencies into a class makes the dependencies explicit.

One important point is that middleware classes are not automatically applied everywhere just because you created them.

You normally configure them through a module's <code>configure()</code> method.

For example:

<code>export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes("users");
  }
}</code>

This tells NestJS to apply the middleware to the specified route.

You can also use route objects to control the HTTP methods.

For example:

<code>.forRoutes({
  path: "users",
  method: RequestMethod.POST,
})</code>

Now the middleware is applied specifically to POST requests for that route.

<b>Beginner real-world example:</b>

You want every request to <code>/products</code> to be logged. A class middleware can handle the logging.

<b>Intermediate real-world example:</b>

You want middleware to use an injected <code>ConfigService</code> to decide whether development request logging is enabled.

<b>Advanced real-world example:</b>

You have an audit system. Middleware receives a request ID and sends request metadata to an injected <code>AuditService</code>. Because the audit service itself has dependencies, class middleware makes the dependency graph easier to manage.

A useful mental model is:

<b>Functional middleware is convenient when the job is simple. Class middleware becomes useful when the middleware itself becomes a NestJS component with dependencies and structure.</b>`,
      diagram: `HTTP Request
     |
     v
Class Middleware
     |
     +--> injected LoggerService
     |
     +--> injected ConfigService
     |
     +--> inspect request
     |
     +--> next()
     |
     v
Guards
     |
     v
Controller

Class middleware can participate
in NestJS dependency injection.`,
      codeExample: {
        title: "Class middleware with dependency injection",
        code: `import {
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      \`Request: \${req.method} \${req.originalUrl}\`,
    );

    next();
  }
}`,
      },
      keyTakeaways: [
        "Class middleware implements `NestMiddleware`.",
        "The middleware logic normally lives inside `use()`.",
        "Class middleware can participate in NestJS dependency injection.",
        "Class middleware is useful when the middleware needs injected services.",
        "Creating a middleware class does not automatically apply it to every route.",
        "You configure class middleware through `MiddlewareConsumer`.",
      ],
      commonMistakes: [
        "<b>Creating the middleware class but never registering it.</b> NestJS needs to know which routes should use the middleware.",
        "<b>Forgetting `@Injectable()` when using injectable dependencies.</b> The class should be registered correctly with Nest's dependency injection system.",
        "<b>Putting all application logic inside `use()`.</b> Middleware should coordinate request-level work rather than becoming a giant business service.",
      ],
      quiz: [
        {
          question: "Which method does a NestJS middleware class normally implement?",
          options: [
            "`handle()`",
            "`execute()`",
            "`use()`",
            "`run()`",
          ],
          correctIndex: 2,
          explanation: "NestJS middleware classes implement the `use()` method.",
        },
        {
          question: "Why might you choose class middleware instead of functional middleware?",
          options: [
            "Class middleware can use NestJS dependency injection",
            "Class middleware can only run on GET requests",
            "Functional middleware cannot read requests",
            "Class middleware replaces controllers",
          ],
          correctIndex: 0,
          explanation: "Class middleware integrates naturally with NestJS dependency injection.",
        },
      ],
    },

    {
      id: "global-and-route-middleware",
      title: "Global Middleware and Route Middleware",
      durationMinutes: 17,
      explanation: `Middleware can be applied at different levels.

Sometimes you want middleware to run for <b>almost every request</b>. For example, request logging or a request ID middleware might need to run across the whole application.

Other times, you only want middleware for a specific route or group of routes.

NestJS lets you control this through middleware configuration.

A middleware configured broadly can affect many routes. A route-specific middleware only runs where you configure it.

This distinction is important because applying middleware too broadly can create unnecessary work.

Imagine you have:

<code>UsersController</code>

<code>ProductsController</code>

<code>OrdersController</code>

Suppose you have a middleware that records request logs. You may want it everywhere.

But imagine another middleware that prepares order-specific information. It does not make sense to run it for:

<code>GET /users</code>

or:

<code>GET /products</code>

It only needs to run for order routes.

You can therefore apply it specifically to the order routes.

For route configuration, NestJS provides <code>MiddlewareConsumer</code>.

You can use:

<code>apply()</code>

to select middleware and:

<code>forRoutes()</code>

to specify where it should run.

You can also exclude routes.

For example, perhaps you have a middleware that processes most routes but you do not want it to run for a health check endpoint.

A health endpoint might be:

<code>GET /health</code>

Your infrastructure could call that endpoint many times per minute. You may want the health check to remain extremely lightweight.

In that situation, route exclusion can be useful.

<b>Beginner real-world example:</b>

Global request logger:

Every request is logged:

<code>GET /users</code>

<code>GET /products</code>

<code>POST /orders</code>

<b>Intermediate real-world example:</b>

A product-specific middleware runs only for product routes.

<code>/products</code>

<code>/products/:id</code>

There is no reason for it to run on user routes.

<b>Advanced real-world example:</b>

Your application has public, internal, and administrative routes.

You might have:

<code>/public/*</code>

<code>/api/*</code>

<code>/admin/*</code>

Different middleware can be applied to different groups. This lets the request pipeline stay focused instead of forcing every request through every middleware.

The important design question is:

<b>Does this middleware really need to run for every request?</b>

If the answer is no, keep its scope smaller.`,
      diagram: `                    Incoming Request
                           |
                           v
                  Global Middleware
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
          /users       /products       /orders
             |             |             |
             |        Product MW         |
             |             |       Order MW
             |             |             |
             +-------------+-------------+
                           |
                           v
                       Controller

Global middleware can run broadly.
Route middleware can be limited to specific routes.`,
      codeExample: {
        title: "Applying middleware to selected routes",
        code: `import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";

import { LoggerMiddleware } from "./logger.middleware";

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        { path: "users", method: RequestMethod.GET },
        { path: "products", method: RequestMethod.GET },
      );
  }
}`,
      },
      keyTakeaways: [
        "Middleware can be applied broadly or to specific routes.",
        "Global-style middleware is useful for cross-cutting request behavior.",
        "Route middleware is useful when only certain endpoints need the behavior.",
        "`MiddlewareConsumer` is used to configure middleware in modules.",
        "Narrow middleware scope when the middleware does not need to run everywhere.",
      ],
      commonMistakes: [
        "<b>Making every middleware global.</b> This can make unrelated requests perform unnecessary work.",
        "<b>Running expensive logic for health checks.</b> Keep infrastructure endpoints lightweight when possible.",
        "<b>Not thinking about route scope.</b> Ask which routes actually need the middleware.",
      ],
      quiz: [
        {
          question: "What should you consider before making middleware run for every route?",
          options: [
            "Whether every request actually needs it",
            "Whether the database uses PostgreSQL",
            "Whether the controller has a DTO",
            "Whether the route is a GET request",
          ],
          correctIndex: 0,
          explanation: "Global middleware affects a broad set of requests, so it should contain behavior that genuinely belongs at that level.",
        },
        {
          question: "Which NestJS object helps configure middleware for routes?",
          options: [
            "`MiddlewareConsumer`",
            "`ValidationPipe`",
            "`ControllerConsumer`",
            "`RouteManager`",
          ],
          correctIndex: 0,
          explanation: "MiddlewareConsumer is used inside module configuration to apply middleware to routes.",
        },
      ],
    },

    {
      id: "middleware-ordering",
      title: "Middleware Ordering",
      durationMinutes: 16,
      explanation: `When you have multiple middleware functions, <b>the order matters</b>.

Think about middleware like a chain.

Middleware A runs first.

It calls <code>next()</code>.

Then Middleware B runs.

It calls <code>next()</code>.

Then Middleware C runs.

Eventually the request continues into the rest of the NestJS pipeline.

For example:

<code>Request
  ↓
LoggerMiddleware
  ↓
RequestIdMiddleware
  ↓
SecurityMiddleware
  ↓
Controller</code>

If you change the order, the behavior can change.

Imagine Request ID middleware creates a request ID and another middleware wants to log that ID.

Then the request ID middleware needs to run before the middleware that expects the ID.

This is why middleware ordering is not just a cosmetic detail.

Consider:

<code>Logger
Request ID
Audit</code>

If Logger runs first, it cannot log a request ID that has not been created yet.

If Request ID runs first:

<code>Request
  ↓
Request ID
  ↓
Logger
  ↓
Audit
  ↓
Controller</code>

then both Logger and Audit can use the ID.

This becomes especially important in larger applications.

Suppose you have:

- request ID middleware
- CORS-related middleware
- security headers middleware
- logging middleware
- body parsing
- custom request context middleware

The exact ordering depends on the framework adapter, configuration, and what your middleware needs to accomplish. The important lesson is that middleware that prepares data for later middleware must run first.

There is another subtle point beginners often miss.

Calling <code>next()</code> does not mean "the entire application has finished."

It means:

<b>Continue to the next stage.</b>

The request then continues through the rest of the pipeline.

Middleware can also perform work after <code>next()</code> by listening to the response lifecycle.

For example, a logging middleware might record the start time before calling <code>next()</code> and then listen for the response to finish.

That allows it to calculate the total request duration.

This pattern is useful for production monitoring.

For example:

<code>GET /orders/123 - 182ms</code>

Now you know not only that the request happened but also how long it took.

<b>Beginner real-world example:</b>

Two middleware functions:

<code>LoggerMiddleware</code>

and:

<code>RequestIdMiddleware</code>

If the logger needs the request ID, the request ID middleware should run first.

<b>Intermediate real-world example:</b>

Your application adds a request ID and then sends the same ID to logs and audit records. Middleware ordering ensures the ID exists before the other middleware tries to use it.

<b>Advanced real-world example:</b>

A production system uses correlation IDs, request timing, audit events, and observability metadata.

The request may flow like:

<code>Request ID
    ↓
Request Context
    ↓
Logging
    ↓
Audit
    ↓
Application</code>

The early middleware establishes information that later layers depend on.

The important lesson is:

<b>Middleware is a chain, and changing the order can change what information is available and when work happens.</b>`,
      diagram: `Client
  |
  v
Request
  |
  v
RequestIdMiddleware
  |
  | creates requestId
  v
LoggerMiddleware
  |
  | logs requestId
  v
AuditMiddleware
  |
  | records requestId
  v
Guards
  |
  v
Interceptors
  |
  v
Pipes
  |
  v
Controller
  |
  v
Service
  |
  v
Response

If Logger ran before RequestIdMiddleware,
the logger would not have the generated ID.`,
      codeExample: {
        title: "Multiple middleware in a deliberate order",
        code: `import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from "@nestjs/common";

import { RequestIdMiddleware } from "./request-id.middleware";
import { LoggerMiddleware } from "./logger.middleware";
import { AuditMiddleware } from "./audit.middleware";

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        RequestIdMiddleware,
        LoggerMiddleware,
        AuditMiddleware,
      )
      .forRoutes("*");
  }
}`,
      },
      keyTakeaways: [
        "Middleware order matters.",
        "Middleware runs as a chain.",
        "A middleware that creates information should run before middleware that needs that information.",
        "Calling `next()` moves processing to the next stage.",
        "Middleware can measure request timing by observing the response lifecycle.",
        "Think about middleware dependencies when deciding its order.",
      ],
      commonMistakes: [
        "<b>Assuming middleware order does not matter.</b> Later middleware may depend on information created earlier.",
        "<b>Calling `next()` multiple times.</b> A middleware should normally continue the request pipeline once.",
        "<b>Generating a request ID after logging middleware needs it.</b> Establish shared request context first.",
        "<b>Confusing `next()` with the final response.</b> `next()` means continue processing; it does not mean the request is finished.",
      ],
      quiz: [
        {
          question: "Why does middleware ordering matter?",
          options: [
            "Because middleware can depend on information created by earlier middleware",
            "Because only GET requests support middleware",
            "Because controllers cannot have routes",
            "Because services must run first",
          ],
          correctIndex: 0,
          explanation: "Middleware often prepares information that later middleware or application code needs.",
        },
        {
          question: "If LoggerMiddleware needs a request ID generated by RequestIdMiddleware, which should run first?",
          options: [
            "LoggerMiddleware",
            "RequestIdMiddleware",
            "Controller",
            "Service",
          ],
          correctIndex: 1,
          explanation: "The request ID must exist before the logger tries to use it.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is middleware primarily used for?",
      options: [
        "Handling database schemas",
        "Processing requests before they continue through the application",
        "Creating TypeScript interfaces",
        "Defining DTO classes",
      ],
      correctIndex: 1,
      explanation: "Middleware participates in request processing and can perform work before the request continues to later parts of the application.",
    },
    {
      question: "What does `next()` normally mean inside middleware?",
      options: [
        "Destroy the request",
        "Restart NestJS",
        "Continue processing the request",
        "Create a database connection",
      ],
      correctIndex: 2,
      explanation: "Calling `next()` passes control to the next part of the request pipeline.",
    },
    {
      question: "Which is a common reason to use class middleware?",
      options: [
        "It automatically creates controllers",
        "It supports NestJS dependency injection",
        "It replaces DTOs",
        "It disables routing",
      ],
      correctIndex: 1,
      explanation: "Class middleware can use NestJS dependency injection, making it useful when middleware needs services or other dependencies.",
    },
    {
      question: "What is a good use case for functional middleware?",
      options: [
        "A small request logger",
        "A complex database transaction system",
        "A complete order management system",
        "A database migration",
      ],
      correctIndex: 0,
      explanation: "Small request-level tasks such as logging can be implemented cleanly with functional middleware.",
    },
    {
      question: "Why might you limit middleware to specific routes?",
      options: [
        "Because middleware cannot run globally",
        "To avoid running unnecessary logic for unrelated routes",
        "Because controllers only support one route",
        "To prevent dependency injection",
      ],
      correctIndex: 1,
      explanation: "Route-specific middleware keeps request processing focused on the routes that actually need it.",
    },
    {
      question: "What happens if middleware neither calls `next()` nor sends a response?",
      options: [
        "The request may remain hanging",
        "NestJS automatically calls the controller",
        "The database restarts",
        "The middleware runs again automatically",
      ],
      correctIndex: 0,
      explanation: "If middleware does not continue the pipeline or finish the response, the request can remain unresolved.",
    },
    {
      question: "Why is middleware ordering important?",
      options: [
        "Middleware cannot be ordered",
        "Later middleware may depend on information created by earlier middleware",
        "Only the last middleware can run",
        "Ordering changes TypeScript types",
      ],
      correctIndex: 1,
      explanation: "Middleware often builds on information created by middleware that ran before it.",
    },
    {
      question: "Which middleware order makes sense when a logger needs a generated request ID?",
      options: [
        "Logger → Request ID",
        "Request ID → Logger",
        "Controller → Request ID",
        "Service → Logger",
      ],
      correctIndex: 1,
      explanation: "The request ID needs to exist before the logger tries to record it.",
    },
  ],

  project: {
    name: "Request Tracking and Logging Middleware",
    goal: "Add a production-style middleware layer to the Users, Products, and Orders API from the previous project.",
    brief: "Extend your existing Users, Products, and Orders API by implementing functional middleware, class middleware, route-specific middleware, middleware ordering, request IDs, request timing, and request logging. The goal is to understand exactly how a request travels through middleware before reaching your controllers.",
    steps: [
      "Create a functional middleware that logs the HTTP method and URL for every incoming request.",
      "Register the logging middleware so it runs for the API routes.",
      "Create a class-based RequestIdMiddleware.",
      "Generate a unique request ID for each incoming request.",
      "Attach the request ID to the request object.",
      "Add the request ID to the response headers using a header such as `X-Request-Id`.",
      "Create a class-based RequestTimingMiddleware.",
      "Record the time when a request starts.",
      "Listen for the response to finish and calculate how long the request took.",
      "Log the request method, URL, status code, request ID, and duration.",
      "Create a route-specific middleware for the Orders module.",
      "Make the Orders middleware run only for order-related routes.",
      "Add another middleware that demonstrates why middleware ordering matters.",
      "Make sure the request ID middleware runs before middleware that needs the request ID.",
      "Create a lightweight health-check endpoint such as `GET /health`.",
      "Decide which middleware should and should not run for the health-check endpoint.",
      "Use `MiddlewareConsumer` to control which routes receive each middleware.",
      "Test requests against Users, Products, Orders, and Health endpoints.",
      "Observe the console and verify the middleware execution order.",
      "Verify that every request receives a request ID.",
      "Verify that the response contains the request ID header.",
      "Verify that request duration is recorded after the response finishes.",
      "Verify that Orders-specific middleware does not execute for unrelated routes.",
      "Draw the final request flow for one Users request and one Orders request.",
    ],
    acceptance: [
      "A functional middleware logs incoming HTTP requests.",
      "A class middleware generates a request ID.",
      "The request ID is available to later request-processing code.",
      "The request ID is returned to the client through a response header.",
      "Request timing is measured and logged.",
      "Middleware ordering is intentional and demonstrated in the application.",
      "At least one middleware is limited to specific routes.",
      "The Orders middleware does not run for Users or Products routes.",
      "The health endpoint remains lightweight.",
      "The application continues processing requests correctly after middleware calls `next()`.",
      "The final logs contain enough information to identify a request, its route, status code, and duration.",
    ],
    stretch: [
      "Create a reusable request context object containing request ID, start time, HTTP method, and URL.",
      "Add a middleware that reads an incoming `X-Request-Id` header and reuses it when present instead of always generating a new ID.",
      "Add protection against malformed or excessively long request IDs.",
      "Create an audit middleware that records selected requests to an `AuditService`.",
      "Inject `ConfigService` into class middleware and make detailed request logging configurable through environment variables.",
      "Add middleware that records the response status code and categorizes requests as successful, client-error, or server-error responses.",
      "Create a small request logging format that could later be sent to a centralized logging platform.",
      "Experiment with changing middleware order and observe how the output changes.",
      "Document the complete request lifecycle from the client through middleware, guards, interceptors, pipes, controller, service, and response.",
    ],
  },
};
