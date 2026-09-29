import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_12_LESSONS: LessonDay = {
  day: 12,
  title: "Request Lifecycle",
  totalMinutes: 100,
  difficulty: "Beginner",
  lessons: [
    {
      id: "request-lifecycle-overview",
      title: "Understanding the NestJS request lifecycle",
      durationMinutes: 18,
      explanation: `When a client sends a request to a NestJS application, the request does not immediately jump into your controller method.

NestJS has a request lifecycle that gives you several places where you can inspect the request, change it, reject it, validate it, add information to it, or prepare the final response.

A simple way to think about the lifecycle is:

<b>Request → Middleware → Guards → Interceptors → Pipes → Controller → Service → Response</b>

There are some important details around the exact execution order, especially when multiple middleware, guards, interceptors, and pipes are involved. For beginners, the most useful mental model is to understand what each part is responsible for rather than trying to memorize every internal detail.

<b>Middleware</b> is commonly used for work that happens before Nest starts handling the route. Logging a request is a good example.

<b>Guards</b> answer a permission question: "Is this request allowed to continue?" Authentication and authorization are common examples.

<b>Interceptors</b> can run code before and after the route handler. They are useful for logging execution time, transforming responses, caching, and other cross-cutting behavior.

<b>Pipes</b> work with incoming data. They are commonly used to validate and transform values from route parameters, query parameters, and request bodies.

<b>Controllers</b> receive the request after the framework has prepared it and decide which application operation should run.

<b>Services</b> usually contain the actual business logic. A controller should generally not contain all of the business rules itself.

Finally, the result travels back through the framework and becomes the HTTP response sent to the client.

Imagine an online store. A customer sends:

\`POST /orders\`

with an order body.

The request might go through logging middleware, an authentication guard, an interceptor that starts a timer, a validation pipe that checks the body, the controller that receives the validated order, and a service that creates the order.

This separation is one of the reasons NestJS applications can remain organized as they grow.

The important beginner question is not "Which decorator do I memorize?" Instead, ask:

<b>"What kind of work am I trying to do, and which part of the lifecycle is responsible for that work?"</b>

For example:

- Need to log every request? Think middleware or interceptor.
- Need to check whether a user is logged in? Think guard.
- Need to validate \`email\` or convert an ID to a number? Think pipe.
- Need to decide which route handles \`GET /users\`? Think controller.
- Need to calculate an invoice total? Think service.

This makes the lifecycle much easier to understand.`,

      diagram: `Client
   |
   | HTTP Request
   v
+----------------------+
|      Middleware      |
| Logging, raw request |
+----------+-----------+
           |
           v
+----------------------+
|        Guards        |
| Authentication       |
| Authorization        |
+----------+-----------+
           |
           v
+----------------------+
|     Interceptors     |
| Before/after logic   |
| Timing, caching      |
+----------+-----------+
           |
           v
+----------------------+
|        Pipes         |
| Validation           |
| Transformation       |
+----------+-----------+
           |
           v
+----------------------+
|      Controller      |
| Route handler        |
+----------+-----------+
           |
           v
+----------------------+
|       Service        |
| Business logic       |
+----------+-----------+
           |
           v
       Result
           |
           v
      HTTP Response

The important idea:
Each layer has a different responsibility.`,

      codeExample: {
        title: "A simple request moving through a NestJS application",
        code: `// middleware
@Injectable()
export class LoggerMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(\`\${req.method} \${req.originalUrl}\`);
    next();
  }
}

// guard
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    return Boolean(request.headers.authorization);
  }
}

// controller
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }
}

// service
@Injectable()
export class UsersService {
  findOne(id: string) {
    return {
      id,
      name: "Alice",
    };
  }
}`,

      },

      keyTakeaways: [
        "A request passes through multiple NestJS features before the final response is sent.",
        "Middleware is commonly used for request-level work such as logging.",
        "Guards decide whether a request is allowed to continue.",
        "Interceptors can run logic before and after a handler.",
        "Pipes validate and transform incoming data.",
        "Controllers handle routes and delegate business work.",
        "Services normally contain reusable business logic.",
      ],

      commonMistakes: [
        "<b>Putting all application logic inside the controller.</b> Controllers should usually coordinate the request rather than contain every business rule.",
        "<b>Using a guard for data validation.</b> Guards are primarily about deciding whether a request can proceed. Pipes are designed for validation and transformation.",
        "<b>Thinking middleware and guards are interchangeable.</b> Middleware runs at an earlier request-processing stage and does not have the same route-aware authorization role as guards.",
        "<b>Trying to memorize the lifecycle without understanding responsibilities.</b> Learn what each feature is designed to do first.",
      ],

      quiz: [
        {
          question: "What is the main purpose of a NestJS guard?",
          options: [
            "Render HTML",
            "Decide whether a request can continue",
            "Connect directly to PostgreSQL",
            "Create a TypeScript interface",
          ],
          correctIndex: 1,
          explanation:
            "Guards are commonly used for authentication and authorization decisions.",
        },
        {
          question: "Which part is commonly responsible for validation and transformation of incoming values?",
          options: [
            "Pipe",
            "Module",
            "Controller",
            "Service",
          ],
          correctIndex: 0,
          explanation:
            "Pipes are designed to transform and validate incoming data.",
        },
      ],
    },

    {
      id: "middleware-request-stage",
      title: "Middleware: the first request-processing layer",
      durationMinutes: 14,
      explanation: `Middleware is code that runs before the route handler is executed. If you have used Express before, the idea will feel familiar because NestJS middleware follows the same basic concept.

A middleware function receives the request, the response, and a \`next()\` function.

The request object contains information such as the HTTP method, URL, headers, cookies, and other request data.

The response object represents the HTTP response.

The \`next()\` function tells the application:

<b>"I have finished my middleware work. Continue processing this request."</b>

For example, suppose someone requests:

\`GET /products\`

Your logging middleware might print:

\`GET /products\`

and then call \`next()\`.

The request continues through the rest of the NestJS lifecycle.

Middleware is useful for things that are not usually tied to one specific controller method.

Common examples include:

- Request logging
- Request IDs
- Reading low-level request information
- Attaching simple request metadata
- Measuring basic request information
- Integrating Express-style middleware
- Processing certain headers

A request ID is a particularly useful real-world example.

Imagine 20,000 requests are reaching your API. One request fails and you need to find all the log messages belonging to that request.

Middleware can generate something such as:

\`req-8f42a1\`

and attach it to the request. Later, your logs can include the same ID.

Now you can search your logs for that request ID and follow the request through the system.

Middleware can also stop a request by not calling \`next()\` and sending a response itself. However, this should be done deliberately because stopping the lifecycle means the controller will not be reached.

For example, a maintenance middleware could return a \`503 Service Unavailable\` response for selected routes.

Another important point is that middleware is not usually the best place for business rules.

If you are asking:

"Can this user delete this invoice?"

that is usually authorization logic and belongs more naturally in a guard or another authorization layer.

If you are asking:

"How long did this request take?"

an interceptor is often a better fit because interceptors can wrap the execution of the route handler.

Think of middleware as a general request-processing layer that happens before Nest gets into the route-specific parts of the lifecycle.`,

      diagram: `HTTP Request
     |
     v
+-------------------------+
|       Middleware        |
|                         |
|  Read request           |
|  Log request             |
|  Add request ID          |
|  Call next()             |
+------------+------------+
             |
             | next()
             v
        NestJS continues
             |
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
        Controller`,

      codeExample: {
        title: "Request logging middleware",
        code: `import {
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    console.log(
      \`[\${new Date().toISOString()}] \${req.method} \${req.originalUrl}\`,
    );

    next();
  }
}`,

      },

      keyTakeaways: [
        "Middleware runs before the route handler.",
        "Middleware commonly receives request, response, and next.",
        "Calling next() allows processing to continue.",
        "Middleware is useful for request-level concerns such as logging.",
        "Middleware can stop a request, but that should be intentional.",
        "Business authorization rules usually belong somewhere more route-aware, such as guards.",
      ],

      commonMistakes: [
        "<b>Forgetting next().</b> If middleware neither calls next() nor sends a response, the request can appear to hang.",
        "<b>Putting database business logic into every middleware.</b> Middleware should remain focused on request-level concerns.",
        "<b>Assuming middleware knows everything about the current route.</b> Middleware runs before many Nest-specific route-processing features.",
      ],

      quiz: [
        {
          question: "What normally allows middleware to continue processing?",
          options: [
            "return true",
            "next()",
            "continueRequest()",
            "controller()",
          ],
          correctIndex: 1,
          explanation:
            "Calling next() tells the middleware pipeline to continue.",
        },
        {
          question: "Which is a good middleware use case?",
          options: [
            "Calculating an order's final business price",
            "Logging incoming requests",
            "Checking a user's database permissions for one operation",
            "Generating a SQL migration",
          ],
          correctIndex: 1,
          explanation:
            "Request logging is a common middleware responsibility.",
        },
      ],
    },

    {
      id: "guards-authentication-authorization",
      title: "Guards: authentication and authorization",
      durationMinutes: 15,
      explanation: `A guard answers one important question:

<b>"Should this request be allowed to continue?"</b>

This makes guards especially useful for authentication and authorization.

Authentication asks:

<b>"Who is this user?"</b>

Authorization asks:

<b>"Is this user allowed to perform this action?"</b>

These questions are related, but they are not the same.

For example, a user might successfully log in and receive a valid access token. That proves the user is authenticated.

But that does not automatically mean the user can delete another user's account.

The authorization check might say:

- User is authenticated.
- User has role \`admin\`.
- User is allowed to delete accounts.

A guard can make this decision before the controller method runs.

This is valuable because your controller does not need to start executing sensitive business logic before the permission check has happened.

A guard implements the \`CanActivate\` interface and provides a \`canActivate()\` method.

If it returns \`true\`, processing continues.

If it returns \`false\`, NestJS blocks the request.

A guard can also throw an exception when you want to return a specific HTTP error.

In a real application, authentication guards are often more sophisticated than the simple example below. They may work with Passport strategies, JWT tokens, sessions, API keys, or another authentication mechanism.

For example, imagine an admin dashboard:

\`GET /admin/users\`

The guard can check whether the request has an authenticated user and whether that user has the required role.

If the user is not authenticated, the request can be rejected.

If the user is authenticated but does not have permission, the request can also be rejected.

If everything is correct, the request reaches the controller.

This is one of the biggest practical reasons to understand the request lifecycle.

You do not want every controller method to repeat code such as:

\`if (!user) return 401\`

\`if (!user.isAdmin) return 403\`

Instead, authentication and authorization concerns can be separated into reusable guards.

At an advanced level, guards can inspect the current execution context and work differently depending on whether the application is handling HTTP, WebSockets, or another transport.

The important beginner idea is simple:

<b>Guards protect routes by deciding whether execution should continue.</b>`,

      diagram: `Request
   |
   v
Middleware
   |
   v
+----------------------+
|        Guard         |
|                      |
| Is user authenticated? |
| Is user authorized?    |
+----------+-----------+
           |
       +---+---+
       |       |
      NO      YES
       |       |
       v       v
   Reject    Continue
   request      |
                v
           Interceptor
                |
                v
             Pipe
                |
                v
           Controller`,

      codeExample: {
        title: "A simple authentication guard",
        code: `import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authorization =
      request.headers.authorization;

    return Boolean(authorization);
  }
}

@Controller("profile")
@UseGuards(AuthGuard)
export class ProfileController {
  @Get()
  getProfile() {
    return {
      message: "You can see your profile.",
    };
  }
}`,

      },

      keyTakeaways: [
        "Guards decide whether a request can continue.",
        "Authentication answers who the user is.",
        "Authorization answers what the user is allowed to do.",
        "Guards are commonly used to protect controllers and routes.",
        "A guard can inspect the current execution context.",
        "A false guard result prevents the protected handler from running.",
      ],

      commonMistakes: [
        "<b>Confusing authentication with authorization.</b> Being logged in does not automatically mean the user can perform every operation.",
        "<b>Putting authorization checks in every controller method.</b> Reusable guards can centralize common access rules.",
        "<b>Returning true without actually checking anything.</b> A guard must perform a meaningful security decision.",
        "<b>Putting passwords or secrets directly into the guard.</b> Authentication systems should use proper credential and token handling.",
      ],

      quiz: [
        {
          question: "What does authentication answer?",
          options: [
            "What database should I use?",
            "Who is the user?",
            "Which controller should render HTML?",
            "How should the response be cached?",
          ],
          correctIndex: 1,
          explanation:
            "Authentication identifies the user or verifies their credentials.",
        },
        {
          question: "What does authorization answer?",
          options: [
            "Is this user allowed to perform this action?",
            "What is the request URL?",
            "Which database table exists?",
            "What is the user's IP address?",
          ],
          correctIndex: 0,
          explanation:
            "Authorization determines whether an authenticated user has permission for an operation.",
        },
      ],
    },

    {
      id: "interceptors-before-after",
      title: "Interceptors: code before and after the handler",
      durationMinutes: 14,
      explanation: `Interceptors are one of the most useful NestJS lifecycle features once you understand the basic request flow.

An interceptor can execute code <b>before</b> the controller handler runs and can also work with the result <b>after</b> the handler has executed.

This makes an interceptor feel a little like a wrapper around your controller method.

Imagine your controller method is:

\`getProducts()\`

An interceptor can conceptually do this:

\`start timer → run getProducts() → receive result → stop timer → return result\`

This makes interceptors useful for cross-cutting behavior.

Common examples include:

- Measuring request execution time
- Logging handler execution
- Transforming response data
- Caching
- Adding metadata
- Mapping errors
- Working with streams
- Implementing reusable response behavior

A very common beginner example is measuring how long a request takes.

Before the handler runs, save the current time.

Then let the handler execute.

When the result comes back, calculate the difference.

This can produce a log such as:

\`GET /products completed in 42ms\`

This is different from simple middleware logging.

Middleware can tell you that a request arrived.

An interceptor can wrap the actual route execution and therefore measure the controller/service work more directly.

At an advanced level, interceptors use RxJS through the \`CallHandler\` and its returned observable.

You do not need to become an RxJS expert immediately. The important concept is that \`next.handle()\` represents continuing to the next part of the execution and receiving the eventual result.

Interceptors can also transform that result.

For example, suppose your service returns:

\`{ id: 1, name: "Alice" }\`

An interceptor could wrap it as:

\`{ data: { id: 1, name: "Alice" } }\`

This can be useful when an API follows a consistent response envelope.

However, do not automatically transform every response just because you can. Response formats should be intentional and consistent.

Interceptors are especially useful for cross-cutting behavior because you can apply one interceptor to a single route, an entire controller, or globally depending on your needs.`,

      diagram: `Request
   |
   v
Interceptor
   |
   | before logic
   | start timer
   | add logging
   v
Controller
   |
   v
Service
   |
   v
Result
   |
   | after logic
   | stop timer
   | transform result
   v
Interceptor
   |
   v
HTTP Response`,

      codeExample: {
        title: "Measuring handler execution time",
        code: `import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class TimingInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;

        const request =
          context.switchToHttp().getRequest();

        console.log(
          \`\${request.method} \${request.url} - \${duration}ms\`,
        );
      }),
    );
  }
}

@Controller("products")
@UseInterceptors(TimingInterceptor)
export class ProductsController {
  @Get()
  findAll() {
    return [
      { id: 1, name: "Keyboard" },
      { id: 2, name: "Mouse" },
    ];
  }
}`,

      },

      keyTakeaways: [
        "Interceptors can run logic before and after a route handler.",
        "next.handle() continues execution and provides the handler result.",
        "Interceptors are useful for logging, timing, caching, and response transformation.",
        "Interceptors are well suited to cross-cutting concerns.",
        "An interceptor can be applied at route, controller, or global scope.",
      ],

      commonMistakes: [
        "<b>Forgetting to return next.handle().</b> The request needs the observable returned by the interceptor.",
        "<b>Using interceptors for every kind of logic.</b> Use the lifecycle feature that matches the responsibility.",
        "<b>Doing expensive work in a global interceptor without thinking about performance.</b> Global behavior affects many requests.",
      ],

      quiz: [
        {
          question: "What makes interceptors different from simple logging middleware?",
          options: [
            "Interceptors cannot access requests",
            "Interceptors can wrap handler execution and process its result",
            "Interceptors only work with databases",
            "Interceptors replace controllers",
          ],
          correctIndex: 1,
          explanation:
            "Interceptors can execute logic around the route handler and work with its result.",
        },
        {
          question: "What does next.handle() represent?",
          options: [
            "Starting a database",
            "Continuing the request execution and obtaining the handler result",
            "Creating a new module",
            "Stopping the application",
          ],
          correctIndex: 1,
          explanation:
            "next.handle() continues execution and returns an Observable representing the result.",
        },
      ],
    },

    {
      id: "pipes-validation-transformation",
      title: "Pipes: validating and transforming incoming data",
      durationMinutes: 14,
      explanation: `Pipes are responsible for <b>transformation</b> and <b>validation</b> of incoming data.

This is particularly useful because HTTP values often arrive as strings.

For example, consider this route:

\`GET /products/42\`

The URL contains \`42\`, but HTTP route parameters arrive as strings.

So this:

\`@Param("id") id: string\`

gives you:

\`"42"\`

not the number:

\`42\`.

If your application needs a number, a pipe can transform it.

NestJS provides built-in pipes such as \`ParseIntPipe\`, \`ParseBoolPipe\`, \`ParseUUIDPipe\`, and \`ValidationPipe\`.

A pipe can also reject invalid data.

For example, if your route expects:

\`GET /products/42\`

and someone sends:

\`GET /products/hello\`

a parsing pipe can reject the request before the controller method executes.

This is helpful because your controller receives data that has already passed the required validation or transformation step.

A very common real-world setup uses \`ValidationPipe\` with DTO classes.

For example, suppose an API creates users.

The client sends:

\`{
  "email": "alice@example.com",
  "password": "secret"
}\`

You can define a DTO and validation rules. The validation pipe checks the incoming body before your controller starts creating the user.

This prevents invalid data from entering your business logic.

Pipes can be used at different levels.

A pipe can be attached to:

- One parameter
- One route handler
- One controller
- The entire application

For beginners, start with parameter parsing and DTO validation.

At an advanced level, custom pipes can implement application-specific transformations and validation rules.

For example, a custom pipe could transform a comma-separated query value:

\`?tags=nestjs,typescript,api\`

into:

\`["nestjs", "typescript", "api"]\`

The important idea is that pipes prepare incoming data before the controller uses it.`,

      diagram: `Request
   |
   | id = "42"
   v
+----------------------+
|        Pipe          |
|                      |
| "42"  --->  42       |
|                      |
| valid?               |
+----------+-----------+
           |
      +----+----+
      |         |
    valid      invalid
      |         |
      v         v
 Controller   400 Error`,

      codeExample: {
        title: "Parsing a route parameter",
        code: `import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from "@nestjs/common";

@Controller("products")
export class ProductsController {
  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return {
      productId: id,
      type: typeof id,
    };
  }
}

// GET /products/42
//
// Controller receives:
// id = 42
// type = "number"`,
      },

      keyTakeaways: [
        "Pipes validate and transform incoming data.",
        "URL parameters and query parameters commonly arrive as strings.",
        "Built-in parsing pipes can convert values into the types your application needs.",
        "ValidationPipe is commonly used with DTO validation.",
        "Invalid input can be rejected before the controller executes.",
        "Custom pipes can implement application-specific transformations.",
      ],

      commonMistakes: [
        "<b>Assuming @Param() gives you numbers automatically.</b> HTTP route parameters are commonly received as strings.",
        "<b>Validating everything manually inside controllers.</b> Pipes provide a reusable place for validation and transformation.",
        "<b>Using TypeScript types as runtime validation.</b> TypeScript types disappear at runtime, so incoming HTTP data still needs runtime validation.",
      ],

      quiz: [
        {
          question: "What type does a route parameter such as /products/42 commonly arrive as before parsing?",
          options: [
            "number",
            "string",
            "boolean",
            "Date",
          ],
          correctIndex: 1,
          explanation:
            "HTTP route parameters are received as strings and can be transformed by a pipe.",
        },
        {
          question: "What is a common purpose of ValidationPipe?",
          options: [
            "Validate incoming request data",
            "Create database tables",
            "Start the HTTP server",
            "Register modules",
          ],
          correctIndex: 0,
          explanation:
            "ValidationPipe can validate incoming data against DTO validation rules.",
        },
      ],
    },

    {
      id: "controller-service-response",
      title: "Controller, service, and the response",
      durationMinutes: 13,
      explanation: `After middleware, guards, interceptors, and pipes have done their work, the request eventually reaches the controller route handler.

The controller is the part of the application that understands the HTTP route.

For example:

\`GET /users/42\`

might be handled by:

\`@Get(":id")\`

The controller receives the prepared request data and usually delegates the actual business work to a service.

This separation is important.

Imagine an application that calculates an invoice.

The controller might receive:

- customer ID
- product IDs
- discount code

The controller should not necessarily contain all the rules for calculating prices, applying discounts, checking stock, calculating taxes, and saving the invoice.

Instead, it can call something like:

\`ordersService.createOrder(...)\`

The service performs the business operation.

The service might:

1. Find the customer.
2. Load the products.
3. Check inventory.
4. Calculate the subtotal.
5. Apply a discount.
6. Calculate tax.
7. Save the order.
8. Return the created order.

The controller then returns that result.

NestJS takes the returned value and uses it to build the HTTP response.

This is why controllers are often described as a thin layer.

A thin controller does not mean a controller cannot contain any logic. It means the controller should mainly deal with HTTP concerns and delegate substantial business behavior to appropriate application services.

For example:

\`@Param\`

\`@Query\`

\`@Body\`

\`@Headers\`

are HTTP concerns.

Calculating whether a customer receives a discount is business logic.

That distinction becomes increasingly important as an application grows.

A beginner application might have:

\`Controller → Service\`

A larger application might have:

\`Controller → Service → Repository → Database\`

The request lifecycle gives you the outer HTTP pipeline, while dependency injection connects the application pieces together internally.

The final response can be a normal object, array, string, or other supported value. NestJS serializes appropriate values for the HTTP response.

You can also use decorators such as \`@HttpCode()\`, \`@Header()\`, and \`@Res()\` when you need more explicit response control.

However, beginners should usually start with Nest's standard response handling because it keeps controllers simpler.`,

      diagram: `HTTP Request
     |
     v
Middleware
     |
     v
Guard
     |
     v
Interceptor
     |
     v
Pipe
     |
     v
+----------------------+
|      Controller      |
|                      |
| Read HTTP input      |
| Call service         |
+----------+-----------+
           |
           v
+----------------------+
|       Service        |
|                      |
| Business logic       |
| Database operations  |
+----------+-----------+
           |
           v
        Result
           |
           v
+----------------------+
|   NestJS Response    |
|                      |
| Serialize result     |
| Set HTTP status      |
+----------+-----------+
           |
           v
         Client`,

      codeExample: {
        title: "Controller delegating business logic to a service",
        code: `import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";

@Injectable()
export class OrdersService {
  createOrder(productId: number) {
    // Real application:
    // validate product
    // check inventory
    // calculate price
    // save order

    return {
      id: 1001,
      productId,
      status: "created",
    };
  }

  findOrder(id: number) {
    return {
      id,
      status: "processing",
    };
  }
}

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  create(@Body() body: { productId: number }) {
    return this.ordersService.createOrder(
      body.productId,
    );
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.ordersService.findOrder(id);
  }
}`,

      },

      keyTakeaways: [
        "Controllers handle HTTP-specific concerns.",
        "Controllers commonly delegate business logic to services.",
        "Services are a better place for substantial business operations.",
        "NestJS can turn returned controller values into HTTP responses.",
        "Keeping controllers thin makes applications easier to test and maintain.",
      ],

      commonMistakes: [
        "<b>Putting database queries everywhere inside controllers.</b> Move reusable data and business operations into services or repositories.",
        "<b>Making services depend on HTTP-specific objects unnecessarily.</b> Keep business logic as independent from HTTP as practical.",
        "<b>Manually constructing every response.</b> NestJS can automatically handle many normal return values.",
      ],

      quiz: [
        {
          question: "What is a controller primarily responsible for?",
          options: [
            "Handling HTTP routes and coordinating application operations",
            "Replacing the database",
            "Compiling TypeScript",
            "Managing npm packages",
          ],
          correctIndex: 0,
          explanation:
            "Controllers connect HTTP requests to application operations.",
        },
        {
          question: "Where should substantial business logic usually live?",
          options: [
            "In every route decorator",
            "In services or other appropriate application layers",
            "Inside package.json",
            "Inside the HTTP method name",
          ],
          correctIndex: 1,
          explanation:
            "Services and other application layers are designed to contain reusable business behavior.",
        },
      ],
    },

    {
      id: "full-lifecycle-real-world",
      title: "Basic to advanced: following a real request from start to finish",
      durationMinutes: 12,
      explanation: `Now let's put the entire lifecycle together with a realistic example.

Imagine you are building an online store.

A customer submits:

\`POST /orders\`

with:

\`{
  "productId": 42,
  "quantity": 2
}\`

The browser sends the HTTP request to your NestJS application.

<b>Step 1 — Middleware</b>

A request logging middleware sees the request.

It might record:

\`POST /orders\`

It could also attach a request ID such as:

\`req-12345\`

Then it calls \`next()\`.

<b>Step 2 — Guard</b>

The authentication guard checks whether the customer is authenticated.

The request may contain:

\`Authorization: Bearer <token>\`

The guard verifies the authentication mechanism and makes the user available to the rest of the request.

If the request is not authenticated, processing stops.

<b>Step 3 — Interceptor before execution</b>

A timing interceptor records the start time.

For example:

\`start = 10:00:00.100\`

Then it allows the handler to execute.

<b>Step 4 — Pipe</b>

The request body is validated.

The pipe checks things such as:

- Is \`productId\` present?
- Is \`productId\` a valid number?
- Is \`quantity\` present?
- Is \`quantity\` greater than zero?

If validation fails, the controller does not receive the invalid data.

The client might receive a \`400 Bad Request\`.

<b>Step 5 — Controller</b>

The controller receives the validated request.

It does not need to calculate the entire order itself.

It calls:

\`ordersService.createOrder(...)\`

<b>Step 6 — Service</b>

The service performs the business operation.

It might:

- Load the product.
- Check inventory.
- Calculate the price.
- Apply a discount.
- Calculate tax.
- Create the order.
- Save it to the database.

<b>Step 7 — Result</b>

The service returns the created order.

The controller returns that result.

<b>Step 8 — Interceptor after execution</b>

The timing interceptor receives the result and calculates how long the request took.

For example:

\`POST /orders completed in 83ms\`

An interceptor could also transform the response if your API architecture requires that.

<b>Step 9 — HTTP response</b>

NestJS sends the result back to the client.

The client might receive:

\`{
  "id": 1001,
  "status": "created"
}\`

This example shows why the lifecycle is useful.

Each layer has a job.

The request does not need one giant function containing logging, authentication, validation, business logic, database code, and response formatting.

Instead, responsibilities can be separated.

At an advanced level, the same architecture can support:

- Global request logging
- Request correlation IDs
- JWT authentication
- Role-based authorization
- DTO validation
- Response serialization
- Caching
- Database transactions
- Exception handling
- Performance monitoring
- Distributed tracing

The goal is not to add every lifecycle feature to every application.

The goal is to know where a piece of logic belongs when your application needs it.`,

      diagram: `                     CLIENT
                       |
                       | POST /orders
                       | { productId, quantity }
                       v
              +------------------+
              |    Middleware    |
              |                  |
              | Request logging  |
              | Request ID       |
              +--------+---------+
                       |
                       v
              +------------------+
              |      Guard       |
              |                  |
              | Is authenticated?|
              +--------+---------+
                       |
                  +----+----+
                  |         |
                 NO        YES
                  |         |
                  v         v
               401       Interceptor
                            |
                            | start timer
                            v
                          Pipe
                            |
                            | validate
                            | transform
                            v
                       Controller
                            |
                            | createOrder()
                            v
                         Service
                            |
                  +---------+---------+
                  |         |         |
                  v         v         v
              Product   Inventory   Database
                  |         |         |
                  +---------+---------+
                            |
                            v
                         Result
                            |
                            v
                       Interceptor
                            |
                            | stop timer
                            | transform/log
                            v
                      HTTP Response
                            |
                            v
                         CLIENT`,

      codeExample: {
        title: "Putting the lifecycle pieces together",
        code: `// DTO
import { IsInt, IsPositive } from "class-validator";

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}

// Guard
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request =
      context.switchToHttp().getRequest();

    return Boolean(request.user);
  }
}

// Interceptor
@Injectable()
export class TimingInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ) {
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log(
          \`Request took \${Date.now() - start}ms\`,
        );
      }),
    );
  }
}

// Controller
@Controller("orders")
@UseGuards(AuthGuard)
@UseInterceptors(TimingInterceptor)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }
}

// Service
@Injectable()
export class OrdersService {
  async createOrder(dto: CreateOrderDto) {
    // Real-world application logic:
    // 1. Find product
    // 2. Check inventory
    // 3. Calculate price
    // 4. Save order
    // 5. Return created order

    return {
      id: 1001,
      productId: dto.productId,
      quantity: dto.quantity,
      status: "created",
    };
  }
}`,

      },

      keyTakeaways: [
        "The request lifecycle separates different kinds of application responsibilities.",
        "Middleware handles general request-level processing.",
        "Guards protect routes by making access decisions.",
        "Interceptors can wrap handler execution.",
        "Pipes validate and transform incoming data.",
        "Controllers coordinate HTTP requests.",
        "Services perform business operations.",
        "A well-designed application uses these features where they provide real value rather than adding complexity everywhere.",
      ],

      commonMistakes: [
        "<b>Putting authentication inside a service.</b> Authentication and authorization are usually better handled before the business operation begins.",
        "<b>Putting validation only inside the database.</b> Application-level validation provides clearer and earlier feedback to API clients.",
        "<b>Making every layer global.</b> Global middleware, guards, and interceptors affect many requests, so use global scope intentionally.",
        "<b>Adding interceptors, guards, and pipes without understanding why.</b> Each lifecycle feature should solve a real architectural problem.",
        "<b>Assuming the simplified lifecycle diagram represents every internal execution detail.</b> NestJS has nuanced execution behavior depending on scope and configuration. Learn the responsibilities first, then study advanced ordering rules when needed.",
      ],

      quiz: [
        {
          question: "A user is not authenticated. Which lifecycle feature is a natural place to reject the request?",
          options: [
            "Guard",
            "Service",
            "DTO",
            "Module",
          ],
          correctIndex: 0,
          explanation:
            "Authentication and authorization checks are common responsibilities of guards.",
        },
        {
          question: "Where would you commonly validate a CreateOrderDto?",
          options: [
            "Pipe",
            "Middleware only",
            "Module",
            "Database connection string",
          ],
          correctIndex: 0,
          explanation:
            "Pipes, especially ValidationPipe, are designed for request-data validation.",
        },
        {
          question: "Which component is a good place to measure how long a controller handler takes?",
          options: [
            "Interceptor",
            "DTO",
            "Module",
            "Entity",
          ],
          correctIndex: 0,
          explanation:
            "An interceptor can wrap handler execution and measure the time before and after it runs.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is the main purpose of the NestJS request lifecycle?",
      options: [
        "To replace TypeScript",
        "To organize how incoming requests are processed",
        "To create database tables automatically",
        "To replace HTTP",
      ],
      correctIndex: 1,
      explanation:
        "The request lifecycle provides structured stages for processing incoming requests and producing responses.",
    },
    {
      question: "Which lifecycle feature is commonly used for request logging?",
      options: [
        "Middleware",
        "DTO",
        "Entity",
        "Module",
      ],
      correctIndex: 0,
      explanation:
        "Middleware is a common place for general request-level logging.",
    },
    {
      question: "Which lifecycle feature commonly handles authentication and authorization decisions?",
      options: [
        "Guard",
        "Pipe",
        "Service",
        "Controller decorator",
      ],
      correctIndex: 0,
      explanation:
        "Guards decide whether a request should be allowed to continue.",
    },
    {
      question: "Which lifecycle feature can run logic before and after a route handler?",
      options: [
        "Interceptor",
        "Module",
        "DTO",
        "Repository",
      ],
      correctIndex: 0,
      explanation:
        "Interceptors wrap route-handler execution and can process the result afterward.",
    },
    {
      question: "What is a common purpose of a pipe?",
      options: [
        "Validate and transform incoming data",
        "Register providers",
        "Create routes",
        "Start the application",
      ],
      correctIndex: 0,
      explanation:
        "Pipes are designed for input transformation and validation.",
    },
    {
      question: "Why should a controller usually delegate business logic to a service?",
      options: [
        "Controllers cannot contain TypeScript",
        "It keeps HTTP concerns separate from reusable business logic",
        "Services are required for every variable",
        "Controllers cannot return responses",
      ],
      correctIndex: 1,
      explanation:
        "Separating HTTP coordination from business logic makes applications easier to maintain and test.",
    },
    {
      question: "A request contains /users/42. What might a pipe do with the 42?",
      options: [
        "Turn it from a string into a number",
        "Turn it into a database",
        "Turn it into a module",
        "Turn it into a controller",
      ],
      correctIndex: 0,
      explanation:
        "Parsing pipes can transform route parameter strings into numbers.",
    },
    {
      question: "What happens if an authentication guard rejects a request?",
      options: [
        "The protected controller handler should not continue",
        "The service automatically runs anyway",
        "The database creates a new user",
        "The module is deleted",
      ],
      correctIndex: 0,
      explanation:
        "A rejected guard prevents the protected execution from continuing.",
    },
    {
      question: "Which is a good real-world use for an interceptor?",
      options: [
        "Measuring handler execution time",
        "Defining a TypeScript interface",
        "Installing npm",
        "Creating a database table manually",
      ],
      correctIndex: 0,
      explanation:
        "Interceptors can wrap handler execution, making timing and logging natural use cases.",
    },
    {
      question: "Which statement best describes the relationship between a controller and service?",
      options: [
        "The controller commonly handles HTTP concerns while the service handles business operations",
        "The service must always return HTML",
        "The controller replaces dependency injection",
        "The service cannot access data",
      ],
      correctIndex: 0,
      explanation:
        "Controllers commonly coordinate HTTP requests while services contain reusable application and business logic.",
    },
  ],

  project: {
    name: "Build a request lifecycle demo API",
    goal: "Build a small NestJS API where you can clearly see middleware, guards, interceptors, pipes, controllers, and services working together.",
    brief: "Create an Orders API that demonstrates the major stages of the NestJS request lifecycle. The API should log requests, protect an endpoint with a guard, validate incoming data with a DTO and ValidationPipe, measure execution time with an interceptor, and delegate business logic to a service.",
    steps: [
      "Create a new NestJS application or use the project from the previous days.",
      "Create an Orders feature with an OrdersController and OrdersService.",
      "Create a CreateOrderDto containing productId and quantity.",
      "Add class-validator decorators such as @IsInt() and @IsPositive() to the DTO.",
      "Enable NestJS ValidationPipe so invalid request data is rejected automatically.",
      "Create request logging middleware that logs the HTTP method and URL.",
      "Create an authentication guard that checks for a simple authorization value or authenticated user.",
      "Protect the POST /orders endpoint with the guard.",
      "Create a timing interceptor that measures how long the request takes.",
      "Apply the interceptor to the OrdersController or selected route.",
      "Make the controller receive the validated DTO.",
      "Inject OrdersService into the controller using constructor injection.",
      "Move the order creation logic into OrdersService.",
      "Return a created-order object from the service.",
      "Send a valid POST request and observe the request lifecycle in the terminal.",
      "Send an invalid POST request and confirm that validation rejects it before the service executes.",
      "Send a request without the required authentication information and confirm that the guard rejects it.",
      "Add enough logging to identify the request ID, route, and execution time.",
      "Experiment with moving middleware, guards, interceptors, and pipes between route-level and global configuration where appropriate.",
    ],
    acceptance: [
      "The API has an OrdersController and OrdersService.",
      "The controller delegates order creation to the service.",
      "A DTO validates the incoming order body.",
      "Invalid order data produces a validation error.",
      "A guard protects the order endpoint.",
      "An unauthenticated request cannot reach the protected handler.",
      "Middleware logs incoming requests.",
      "An interceptor measures handler execution time.",
      "The application demonstrates the relationship between middleware, guards, interceptors, pipes, controllers, and services.",
      "The business logic is not unnecessarily placed inside the controller.",
    ],
    stretch: [
      "Create a request ID middleware and include the same ID in logs throughout the request.",
      "Create a custom pipe that converts a comma-separated query parameter into an array.",
      "Create a role-based guard that allows only admin users to create certain resources.",
      "Create a response-transforming interceptor that wraps successful responses in a consistent { data: ... } structure.",
      "Add a second interceptor that records slow requests above a chosen threshold.",
      "Add a custom exception filter and compare its role with guards, pipes, and interceptors.",
      "Create a protected GET /orders/:id endpoint and use ParseIntPipe to transform the route parameter.",
      "Add DTO validation for optional and nested fields.",
      "Use request IDs to trace one request through middleware, guard, interceptor, controller, and service logs.",
      "Experiment with global middleware, global guards, global pipes, and global interceptors and document when each global feature is appropriate.",
    ],
  },
};
