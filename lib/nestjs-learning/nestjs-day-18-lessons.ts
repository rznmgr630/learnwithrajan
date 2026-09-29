import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_18_LESSONS: LessonDay = {
  day: 18,
  title: "Interceptors",
  totalMinutes: 108,
  difficulty: "Beginner",
  lessons: [
    {
      id: "what-are-interceptors",
      title: "What are Interceptors?",
      durationMinutes: 18,
      explanation: `An interceptor is a piece of NestJS code that can run <b>before and after a controller method</b>.

This makes interceptors extremely useful because they can wrap around the execution of your controller.

Think about ordering a product from an online store.

A request comes in:

<code>POST /orders</code>

Before the controller runs, you might want to:

- record when the request started
- log who made the request
- add some context
- start a timer

Then the controller and service do their normal work.

After the controller finishes, you might want to:

- calculate how long the request took
- transform the response
- log the result
- cache the response
- add response metadata

That is exactly the kind of problem interceptors are designed to solve.

A useful mental model is:

<code>Request
   |
   v
Interceptor
   |
   | before
   v
Controller
   |
   v
Service
   |
   v
Interceptor
   |
   | after
   v
Response</code>

The interceptor is like a wrapper around your controller execution.

Imagine you go to a restaurant.

The waiter receives your order.

Before sending it to the kitchen, the waiter records the order number.

The kitchen prepares the food.

When the food comes back, the waiter may check the order, package it, and deliver it to you.

The interceptor plays a similar wrapping role around request execution.

One of the most important things to understand is that an interceptor can work with the result produced by the controller.

For example, suppose your controller returns:

<code>{
  id: 10,
  name: "Mechanical Keyboard"
}</code>

An interceptor could transform that into:

<code>{
  success: true,
  data: {
    id: 10,
    name: "Mechanical Keyboard"
  }
}</code>

The controller does not need to manually wrap every response.

That is one of the reasons interceptors are useful.

<b>Beginner real-world example:</b>

You want every response from your API to follow the same shape:

<code>{
  success: true,
  data: ...
}</code>

Instead of writing that structure in every controller method, you can use an interceptor.

<b>Intermediate real-world example:</b>

Your application has hundreds of API requests.

You want to know which requests are slow.

An interceptor can start a timer before the controller executes and calculate the duration after the controller finishes.

You can then log:

<code>GET /products took 84ms</code>

or:

<code>POST /orders took 612ms</code>

<b>Advanced real-world example:</b>

Your product catalog receives thousands of repeated requests.

The product data does not change every second.

An interceptor can check whether a response is already available in a cache.

If it is cached, the application can return the cached result instead of repeating the expensive operation.

If it is not cached, the controller executes normally and the interceptor can store the result for later requests.

So the basic idea is:

<b>Interceptors wrap controller execution and can perform work before and after it.</b>

That makes them useful for cross-cutting concerns.

A cross-cutting concern is something that applies to many parts of your application rather than belonging to one specific business operation.

Logging is a cross-cutting concern.

Timing is a cross-cutting concern.

Response formatting is a cross-cutting concern.

Caching can also be a cross-cutting concern.

Instead of duplicating that code in every controller, an interceptor lets you centralize it.`,
      diagram: `Client
  |
  | HTTP Request
  v
+----------------------+
|     Interceptor      |
|                      |
|  BEFORE controller   |
|  - start timer       |
|  - log request       |
|  - prepare context   |
+----------+-----------+
           |
           v
+----------------------+
|      Controller      |
+----------+-----------+
           |
           v
+----------------------+
|       Service        |
+----------+-----------+
           |
           v
+----------------------+
|     Interceptor      |
|                      |
|  AFTER controller    |
|  - transform result  |
|  - log duration      |
|  - cache result      |
+----------+-----------+
           |
           v
        Response`,
      codeExample: {
        title: "A basic interceptor",
        code: `import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";

import { Observable } from "rxjs";

@Injectable()
export class SimpleInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    console.log("Before controller");

    return next.handle();
  }
}`,
      },
      keyTakeaways: [
        "Interceptors can run before and after controller execution.",
        "Interceptors implement `NestInterceptor`.",
        "The `intercept()` method receives `ExecutionContext` and `CallHandler`.",
        "`next.handle()` continues execution to the next stage.",
        "Interceptors are useful for cross-cutting concerns such as logging, timing, transformation, and caching.",
        "An interceptor can work with the value returned by a controller.",
      ],
      commonMistakes: [
        "<b>Thinking an interceptor replaces the controller.</b> Its normal job is to wrap or enhance controller execution.",
        "<b>Forgetting `next.handle()`.</b> If an interceptor never calls the next handler when it should, the request may never reach the controller.",
        "<b>Putting all business logic into an interceptor.</b> Creating an order or calculating a price belongs in a service, not an interceptor.",
        "<b>Assuming interceptors are only for logging.</b> Logging is common, but interceptors can also transform responses, measure timing, and implement caching patterns.",
      ],
      quiz: [
        {
          question: "What is an interceptor mainly used for?",
          options: [
            "Wrapping and extending request/controller execution",
            "Creating database tables",
            "Defining DTO classes",
            "Starting NestJS",
          ],
          correctIndex: 0,
          explanation: "Interceptors wrap controller execution and are useful for cross-cutting behavior.",
        },
        {
          question: "What does `next.handle()` do?",
          options: [
            "Deletes the request",
            "Continues execution to the next handler",
            "Creates a database connection",
            "Stops the application",
          ],
          correctIndex: 1,
          explanation: "The CallHandler's `handle()` method produces the Observable representing the next stage of execution.",
        },
      ],
    },

    {
      id: "execution-context-and-call-handler",
      title: "ExecutionContext and CallHandler",
      durationMinutes: 18,
      explanation: `Two types appear in almost every interceptor:

<code>ExecutionContext</code>

and:

<code>CallHandler</code>

You have already seen <code>ExecutionContext</code> while learning Guards.

The same idea applies here.

ExecutionContext gives the interceptor information about the current execution.

For HTTP requests, you can access the request using:

<code>context.switchToHttp().getRequest()</code>

You can also get the response:

<code>context.switchToHttp().getResponse()</code>

This is useful when your interceptor needs to inspect request information or interact with the HTTP response.

For example, a logging interceptor might want:

<code>request.method</code>

<code>request.url</code>

and:

<code>request.user</code>

Then it can produce a log such as:

<code>[API] GET /orders - user=user-42</code>

The second important object is <code>CallHandler</code>.

CallHandler represents the next stage of execution.

When you write:

<code>next.handle()</code>

you are essentially saying:

<b>"Continue the request and give me the result when it comes back."</b>

That result is an Observable.

This is why interceptors commonly use RxJS operators such as:

<code>tap()</code>

<code>map()</code>

<code>catchError()</code>

and:

<code>timeout()</code>

For example:

<code>next.handle().pipe(
  tap(() => {
    console.log("Request completed");
  }),
)</code>

The controller executes and produces a result.

The Observable carries that result through the interceptor pipeline.

The interceptor can observe it, transform it, or react to errors.

Think of it like a conveyor belt.

The controller puts a result on the conveyor belt.

The interceptor can inspect the item as it passes.

It can leave it alone.

It can replace it.

It can attach additional information.

Or it can perform some side effect such as logging.

<b>Beginner real-world example:</b>

You want to print a message after a controller finishes:

<code>Controller completed</code>

You can use <code>tap()</code> because you want to observe the result without replacing it.

<b>Intermediate real-world example:</b>

You want to add a standard response envelope.

The controller returns:

<code>{ id: 1, name: "Keyboard" }</code>

The interceptor maps it to:

<code>{
  success: true,
  data: {
    id: 1,
    name: "Keyboard"
  }
}</code>

This is a transformation, so <code>map()</code> is useful.

<b>Advanced real-world example:</b>

Your external API calls sometimes take too long.

An interceptor can apply a timeout to the Observable.

If the operation takes longer than the allowed time, the request can fail rather than keeping resources occupied indefinitely.

This is useful for protecting applications from unexpectedly slow operations.

The key difference to remember is:

<code>ExecutionContext</code>

tells you about the current execution.

<code>CallHandler</code>

lets you continue the execution and work with its result.`,
      diagram: `ExecutionContext
      |
      +--> Request
      +--> Response
      +--> Controller
      +--> Handler
      |
      v
Interceptor
      |
      | next.handle()
      v
CallHandler
      |
      v
Controller
      |
      v
Observable<Result>
      |
      v
Interceptor
      |
      +--> tap()
      +--> map()
      +--> catchError()
      +--> timeout()
      |
      v
Response`,
      codeExample: {
        title: "Using ExecutionContext and CallHandler",
        code: `import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest();

    console.log(
      "Request:",
      request.method,
      request.url,
    );

    return next.handle().pipe(
      tap(() => {
        console.log("Controller completed");
      }),
    );
  }
}`,
      },
      keyTakeaways: [
        "`ExecutionContext` gives the interceptor information about the current execution.",
        "`CallHandler` represents the next stage of execution.",
        "`next.handle()` continues execution and returns an Observable.",
        "RxJS operators can observe, transform, or handle the controller result.",
        "`tap()` is useful for side effects such as logging.",
        "`map()` is useful when you need to transform the returned value.",
      ],
      commonMistakes: [
        "<b>Confusing `next.handle()` with the final response.</b> It represents the next execution stage and returns an Observable.",
        "<b>Using `tap()` when you actually need to change the response.</b> Use a transformation such as `map()` when the returned value needs to change.",
        "<b>Ignoring the request context.</b> ExecutionContext can provide useful information such as method, URL, user, controller, and handler.",
      ],
      quiz: [
        {
          question: "What does `ExecutionContext` provide?",
          options: [
            "Information about the current execution",
            "Only database records",
            "Only environment variables",
            "Only DTO definitions",
          ],
          correctIndex: 0,
          explanation: "ExecutionContext provides information about the current request and execution target.",
        },
        {
          question: "What does `next.handle()` return?",
          options: [
            "A database connection",
            "An Observable representing the next execution stage",
            "A DTO",
            "A controller class",
          ],
          correctIndex: 1,
          explanation: "CallHandler.handle() returns an Observable representing the result of the next stage.",
        },
      ],
    },

    {
      id: "logging-interceptor",
      title: "Logging with Interceptors",
      durationMinutes: 18,
      explanation: `Logging is one of the easiest and most useful ways to understand interceptors.

Imagine your application is running in production.

A customer says:

<b>"My order request was slow."</b>

You look at the application logs and see:

<code>POST /orders</code>

But that does not tell you enough.

You might want to know:

- when the request started
- which HTTP method was used
- which URL was requested
- which user made the request
- whether the request succeeded
- how long it took
- what status code was returned

An interceptor is a natural place for this kind of logging.

Why?

Because the interceptor surrounds the request.

It can log before the controller:

<code>Request started</code>

and then log after the controller:

<code>Request completed</code>

This means you can collect information from both sides of execution.

For example:

<code>[START] GET /products</code>

Then later:

<code>[END] GET /products - 200 - 43ms</code>

This is much more useful than putting console logs inside every controller.

You also avoid repeating the same logging code.

<b>Beginner real-world example:</b>

Log every request method and URL.

<code>GET /products</code>

<code>POST /orders</code>

<code>DELETE /products/12</code>

<b>Intermediate real-world example:</b>

Add execution time and HTTP status code.

Now you can identify slow endpoints.

For example:

<code>GET /products - 200 - 32ms</code>

<code>GET /orders - 200 - 481ms</code>

You immediately know that the orders endpoint took considerably longer.

<b>Advanced real-world example:</b>

A production application might use structured logs.

Instead of printing one large string, it may log data such as:

<code>{
  "event": "http_request",
  "method": "POST",
  "path": "/orders",
  "userId": "user-42",
  "statusCode": 201,
  "durationMs": 182
}</code>

A log aggregation system can then search and filter those fields.

For example, you could ask:

"Show me all requests to /orders that took more than 500ms."

The interceptor can become the central place where this information is collected.

Be careful about what you log.

Never blindly log sensitive information such as:

- passwords
- access tokens
- refresh tokens
- payment card details
- private secrets

An interceptor can see a lot of request information, so it should be used responsibly.`,
      diagram: `Request
  |
  v
Logging Interceptor
  |
  | record start time
  | record method
  | record URL
  |
  v
Controller
  |
  v
Service
  |
  v
Logging Interceptor
  |
  | record status
  | calculate duration
  |
  v
Response

Example:

[START] POST /orders

[END]
POST /orders
status=201
duration=182ms`,
      codeExample: {
        title: "Request logging and timing",
        code: `import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class HttpLoggingInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest();

    const response = context
      .switchToHttp()
      .getResponse();

    const start = Date.now();

    console.log(
      \`[START] \${request.method} \${request.url}\`,
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;

        console.log(
          \`[END] \${request.method} \${request.url} \` +
          \`status=\${response.statusCode} \` +
          \`duration=\${duration}ms\`,
        );
      }),
    );
  }
}`,
      },
      keyTakeaways: [
        "Interceptors are useful for centralized request logging.",
        "You can record information before controller execution.",
        "You can record status and timing after execution.",
        "Structured logging becomes useful as applications grow.",
        "Never blindly log sensitive request data.",
      ],
      commonMistakes: [
        "<b>Logging passwords or tokens.</b> Request logging should deliberately exclude sensitive information.",
        "<b>Adding logging manually to every controller.</b> Centralized logging is one of the main benefits of interceptors.",
        "<b>Only logging successful requests.</b> Production logging should also consider failures and exceptions.",
        "<b>Using only console logs in a large production system.</b> Structured application logging and log aggregation become more useful as the system grows.",
      ],
      quiz: [
        {
          question: "Why is an interceptor useful for request logging?",
          options: [
            "It can wrap many requests without duplicating logging code in every controller",
            "It replaces the database",
            "It creates DTOs automatically",
            "It prevents all HTTP errors",
          ],
          correctIndex: 0,
          explanation: "Interceptors provide a centralized place for cross-cutting logging behavior.",
        },
        {
          question: "What should you avoid logging?",
          options: [
            "HTTP method",
            "Request URL",
            "Passwords and access tokens",
            "Execution duration",
          ],
          correctIndex: 2,
          explanation: "Sensitive credentials and secrets should not be blindly written to logs.",
        },
      ],
    },

    {
      id: "timing-interceptor",
      title: "Measuring Request Timing",
      durationMinutes: 16,
      explanation: `A request can be correct and still be too slow.

Imagine:

<code>GET /products</code>

returns the correct data.

But it takes:

<code>3.8 seconds</code>

Your users will probably notice.

Before fixing performance problems, you first need to measure them.

An interceptor is a convenient place to measure request duration.

The basic approach is simple:

1. Record the start time.
2. Continue to the controller.
3. Wait for the result.
4. Calculate the difference.

For example:

<code>const start = Date.now();</code>

Then after execution:

<code>const duration = Date.now() - start;</code>

You might get:

<code>duration = 127ms</code>

Now imagine you collect this information for thousands of requests.

You can start seeing patterns.

Maybe:

<code>GET /products</code>

usually takes 50ms.

But:

<code>GET /orders</code>

usually takes 900ms.

That tells you where to investigate.

The interceptor itself does not need to know why the endpoint is slow.

That is important.

The interceptor measures.

Your profiling and application investigation determine the cause.

The cause could be:

- a slow database query
- an external API
- an inefficient algorithm
- too much data being processed
- an N+1 query problem
- network latency
- an overloaded dependency

<b>Beginner real-world example:</b>

Measure every API request and print the duration.

<b>Intermediate real-world example:</b>

Log a warning when a request takes longer than one second.

For example:

<code>WARNING: GET /orders took 1,842ms</code>

<b>Advanced real-world example:</b>

Send timing information to an observability platform.

You can then create metrics such as:

- average request duration
- p50 latency
- p95 latency
- p99 latency
- slowest endpoints

This gives you a much better understanding of application performance.

An important detail is that timing the controller execution is not necessarily the same as measuring every millisecond from the physical network request to the browser and back.

There may be load balancers, proxies, network layers, and other infrastructure outside your NestJS process.

Your interceptor measures what happens within the application execution path it wraps.

That distinction becomes important when debugging production latency.`,
      diagram: `Request arrives
      |
      v
start = Date.now()
      |
      v
Interceptor
      |
      v
Controller
      |
      v
Service
      |
      v
Database
      |
      v
Controller result
      |
      v
duration =
Date.now() - start
      |
      v
Log / Metric
      |
      v
Response`,
      codeExample: {
        title: "Timing interceptor",
        code: `import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class TimingInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest();

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;

        console.log(
          \`\${request.method} \${request.url} took \${duration}ms\`,
        );

        if (duration > 1000) {
          console.warn(
            \`Slow request: \${request.method} \${request.url}\`,
          );
        }
      }),
    );
  }
}`,
      },
      keyTakeaways: [
        "Timing interceptors help identify slow application operations.",
        "Record the start time before calling `next.handle()`.",
        "Calculate the duration after execution completes.",
        "Timing data can be logged or sent to monitoring systems.",
        "A slow request measurement tells you where to investigate, not automatically why it is slow.",
      ],
      commonMistakes: [
        "<b>Assuming the interceptor automatically identifies the bottleneck.</b> It measures duration; you still need profiling or investigation to find the cause.",
        "<b>Using timing data without enough context.</b> Method, route, status, and useful request identifiers make timing information much more valuable.",
        "<b>Ignoring production infrastructure.</b> Application timing does not necessarily represent the complete network round trip experienced by a user.",
      ],
      quiz: [
        {
          question: "What is the basic purpose of a timing interceptor?",
          options: [
            "Measure how long execution takes",
            "Create users",
            "Validate passwords",
            "Create modules",
          ],
          correctIndex: 0,
          explanation: "A timing interceptor measures the duration of the wrapped request execution.",
        },
        {
          question: "If an endpoint takes 3 seconds, what does the timing interceptor tell you?",
          options: [
            "Exactly which database query is wrong",
            "That the wrapped execution took about 3 seconds",
            "That the user is unauthorized",
            "That the route does not exist",
          ],
          correctIndex: 1,
          explanation: "The interceptor measures duration but does not automatically identify the underlying cause.",
        },
      ],
    },

    {
      id: "response-transformation",
      title: "Response Transformation",
      durationMinutes: 20,
      explanation: `One of the most practical uses of interceptors is transforming controller responses.

Imagine you have many controllers.

One returns:

<code>{ id: 1, name: "Keyboard" }</code>

Another returns:

<code>{ id: 2, name: "Mouse" }</code>

Another returns:

<code>[...]</code>

Your frontend might prefer a consistent API format.

For example:

<code>{
  "success": true,
  "data": {
    "id": 1,
    "name": "Keyboard"
  }
}</code>

For a list:

<code>{
  "success": true,
  "data": [
    ...
  ]
}</code>

You could manually create this structure in every controller.

But that creates repetition.

Instead, an interceptor can transform the returned value.

This is where the RxJS <code>map()</code> operator becomes useful.

The controller returns a value.

The interceptor receives that value and creates a new value.

Conceptually:

<code>Controller result
      |
      v
{ id: 1, name: "Keyboard" }
      |
      v
Interceptor
      |
      v
{
  success: true,
  data: {
    id: 1,
    name: "Keyboard"
  }
}</code>

This can create a consistent API contract.

<b>Beginner real-world example:</b>

Wrap every response:

<code>{
  success: true,
  data: ...
}</code>

<b>Intermediate real-world example:</b>

Add metadata:

<code>{
  success: true,
  data: [...],
  meta: {
    timestamp: "..."
  }
}</code>

This can be useful for clients that need common metadata.

<b>Advanced real-world example:</b>

Your API uses a standard response format across many services.

For example:

<code>{
  data: ...,
  meta: {
    requestId: "...",
    timestamp: "..."
  }
}</code>

The interceptor can add the metadata automatically.

This means individual controllers can focus on business data rather than formatting infrastructure information.

However, there is an important design consideration.

Not every response should necessarily be transformed.

For example, file downloads, streams, redirects, or special responses may need different handling.

Also, some teams prefer controllers to explicitly define their response shape rather than applying a global wrapper.

The point is not:

<b>"Every NestJS application must wrap responses."</b>

The point is:

<b>"Interceptors give you a centralized place to transform responses when your API design calls for it."</b>

This is an architectural choice.

You should choose a response format that makes sense for your application and clients.`,
      diagram: `Controller
    |
    | returns
    v
{
  id: 1,
  name: "Keyboard"
}
    |
    v
Response Transform Interceptor
    |
    | map()
    v
{
  success: true,
  data: {
    id: 1,
    name: "Keyboard"
  }
}
    |
    v
HTTP Response`,
      codeExample: {
        title: "Response transformation interceptor",
        code: `import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseTransformInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    );
  }
}`,
      },
      keyTakeaways: [
        "Interceptors can transform controller responses.",
        "`map()` is useful for changing the value emitted by the controller.",
        "Response envelopes can provide a consistent API format.",
        "Response transformation should match the needs of your API architecture.",
        "Not every response type should automatically be transformed.",
      ],
      commonMistakes: [
        "<b>Wrapping every possible response blindly.</b> Streams, files, and special responses may need different handling.",
        "<b>Changing the public API contract unexpectedly.</b> Response format is part of the API contract and should be designed deliberately.",
        "<b>Putting business calculations into a formatting interceptor.</b> The interceptor should transform the response shape, not perform order pricing or other business operations.",
      ],
      quiz: [
        {
          question: "Which RxJS operator is commonly used to transform the returned value?",
          options: [
            "`map()`",
            "`filter()` only",
            "`subscribe()`",
            "`reduce()` only",
          ],
          correctIndex: 0,
          explanation: "`map()` transforms each emitted value, making it useful for response transformation.",
        },
        {
          question: "Why might an application use a response-transform interceptor?",
          options: [
            "To provide a consistent response structure",
            "To create database tables",
            "To replace authentication",
            "To compile TypeScript",
          ],
          correctIndex: 0,
          explanation: "A response interceptor can centralize consistent formatting across many endpoints.",
        },
      ],
    },

    {
      id: "caching-with-interceptors",
      title: "Caching with Interceptors",
      durationMinutes: 18,
      explanation: `Caching is where interceptors start becoming especially interesting.

Imagine your store has this endpoint:

<code>GET /products</code>

Suppose it performs an expensive database query.

Thousands of users request the same product catalog.

Without caching:

<code>Request 1
  |
  v
Database

Request 2
  |
  v
Database

Request 3
  |
  v
Database</code>

Every request repeats the same work.

With caching:

<code>Request 1
  |
  v
Cache miss
  |
  v
Database
  |
  v
Store result in cache

Request 2
  |
  v
Cache hit
  |
  v
Return cached result

Request 3
  |
  v
Cache hit
  |
  v
Return cached result</code>

An interceptor is a natural place to participate in this pattern because it wraps the controller execution.

It can inspect the request and determine whether a cached result exists.

If a cached result exists, it can return it without executing the controller.

If there is no cached result, it can allow the controller to execute and then store the returned result.

NestJS also provides caching support through its cache module and related tools, so in a real application you should prefer Nest's established caching mechanisms rather than creating an unsafe cache from scratch.

The important concept to learn here is not just "put data in a Map."

You need to think about:

- cache keys
- expiration
- invalidation
- memory usage
- stale data
- concurrent requests
- multiple application instances
- distributed caches

<b>Beginner real-world example:</b>

Cache a product list for a short period.

If the same request arrives again within that period, return the cached value.

<b>Intermediate real-world example:</b>

Cache product details using a key such as:

<code>product:123</code>

Set a short expiration time.

When the product changes, invalidate the corresponding cache entry.

<b>Advanced real-world example:</b>

Your NestJS application runs on ten servers.

A simple in-memory cache on one server does not automatically synchronize with the other nine servers.

Now you may need a distributed cache such as Redis.

The architecture becomes:

<code>Client
   |
   v
Load Balancer
   |
   +----> Nest instance 1
   |
   +----> Nest instance 2
   |
   +----> Nest instance 3
             |
             v
          Redis
             |
             v
          Database</code>

All application instances can access the shared cache.

But distributed caching introduces more decisions.

Suppose a product changes.

You need to decide how and when the cache is invalidated.

Otherwise users may continue seeing old product information.

This is called cache invalidation, and it is one of the classic difficult problems in software engineering.

The important beginner lesson is:

<b>Caching can make repeated reads faster, but cached data can become stale.</b>

So caching is not simply "store everything forever."`,
      diagram: `                    GET /products
                          |
                          v
                 +----------------+
                 | Cache Interceptor|
                 +--------+-------+
                          |
                    Cache exists?
                     /          \\
                   yes           no
                    |             |
                    v             v
              Return cache     Controller
                                  |
                                  v
                               Service
                                  |
                                  v
                               Database
                                  |
                                  v
                            Store in cache
                                  |
                                  v
                              Response`,
      codeExample: {
        title: "Simple cache concept",
        code: `import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class SimpleCacheInterceptor
  implements NestInterceptor
{
  private readonly cache = new Map<
    string,
    unknown
  >();

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest();

    const key =
      \`\${request.method}:\${request.url}\`;

    const cached = this.cache.get(key);

    if (cached !== undefined) {
      return new Observable((subscriber) => {
        subscriber.next(cached);
        subscriber.complete();
      });
    }

    return next.handle().pipe(
      tap((data) => {
        this.cache.set(key, data);
      }),
    );
  }
}`,
      },
      keyTakeaways: [
        "Caching can prevent repeated expensive operations.",
        "An interceptor can participate in cache lookup and response storage.",
        "Cache keys determine which request maps to which cached result.",
        "Cached data can become stale, so expiration and invalidation matter.",
        "In-memory caching behaves differently when an application runs on multiple instances.",
        "Production applications may use a shared cache such as Redis.",
      ],
      commonMistakes: [
        "<b>Caching everything.</b> Frequently changing or user-specific data may require a different strategy.",
        "<b>Ignoring cache invalidation.</b> A cache can return outdated data if it is not updated or expired correctly.",
        "<b>Using an in-memory cache across multiple servers and assuming it is shared.</b> Each process has its own memory.",
        "<b>Creating a production cache implementation without considering concurrency and expiration.</b> Real caching systems need more than a simple Map.",
      ],
      quiz: [
        {
          question: "What happens on a cache hit?",
          options: [
            "The application always deletes the database",
            "The cached result can be returned without repeating the full operation",
            "The server restarts",
            "The controller must always execute twice",
          ],
          correctIndex: 1,
          explanation: "A cache hit means a usable result is already available and can potentially be returned directly.",
        },
        {
          question: "Why is cache invalidation important?",
          options: [
            "Caches can contain outdated data",
            "It disables TypeScript",
            "It creates controllers",
            "It prevents HTTP requests",
          ],
          correctIndex: 0,
          explanation: "When underlying data changes, a cached result can become stale unless it is updated or invalidated.",
        },
      ],
    },

    {
      id: "advanced-interceptor-pattern",
      title: "Combining Logging, Timing, Transformation, and Caching",
      durationMinutes: 18,
      explanation: `Now let's put the pieces together using your Store API.

You have:

<code>Users</code>

<code>Products</code>

<code>Orders</code>

Imagine a request:

<code>GET /products</code>

A production-style request pipeline might look like:

<code>Client
   |
   v
Middleware
   |
   v
Authentication Guard
   |
   v
Cache Interceptor
   |
   v
Logging Interceptor
   |
   v
Controller
   |
   v
Product Service
   |
   v
Database
   |
   v
Logging Interceptor
   |
   v
Response Transform Interceptor
   |
   v
Client</code>

Each part has a different responsibility.

The cache interceptor asks:

<b>"Do we already have this result?"</b>

The logging interceptor asks:

<b>"What happened during this request?"</b>

The timing logic asks:

<b>"How long did it take?"</b>

The response transformer asks:

<b>"Should this result be returned in our standard API format?"</b>

This separation is important.

You do not want one giant interceptor containing:

- authentication
- authorization
- database queries
- caching
- response formatting
- order creation
- logging
- validation

That would simply move the complexity somewhere else.

Instead, create focused components.

<b>Beginner real-world example:</b>

Create one interceptor that logs:

<code>GET /products</code>

and its duration.

Use it on your ProductsController.

<b>Intermediate real-world example:</b>

Add a response-transform interceptor.

Now:

<code>GET /products</code>

returns:

<code>{
  success: true,
  data: [...]
}</code>

while logging continues independently.

<b>Advanced real-world example:</b>

Create a product catalog endpoint with caching.

The request first checks the cache.

If the result is cached, return it quickly.

If not, execute the controller and service.

Then cache the result.

The logging interceptor still records the request.

The response transformer still formats the result.

This is the kind of composition that makes NestJS powerful.

There is one more important concept to understand.

<b>Interceptor order matters.</b>

When multiple interceptors are applied, their wrapping behavior can affect what happens before and after controller execution.

Think of nested wrappers:

<code>Interceptor A
   |
   +--> Interceptor B
           |
           +--> Controller
           |
           +<-- result
   |
   +<-- result</code>

This is similar to nested function calls.

That means you should be deliberate about the order of interceptors when combining things such as caching, logging, and transformation.

For example, you may want logging to happen regardless of whether the response came from the cache.

You may also want cache storage to happen before or after a response transformation depending on what representation you want to cache.

These are architectural decisions rather than rules you should blindly memorize.

Another important idea is that interceptors can be scoped.

You can apply them:

- to one route
- to one controller
- globally

A timing interceptor might make sense globally.

A special response transformation might only make sense for one controller.

A cache interceptor might only make sense for read-heavy endpoints.

That gives you a lot of control.`,
      diagram: `                 GET /products
                       |
                       v
              +----------------+
              | Cache Interceptor|
              +-------+--------+
                      |
                cache miss
                      |
                      v
              +----------------+
              | Logging/Timing |
              |   Interceptor |
              +-------+--------+
                      |
                      v
                 Controller
                      |
                      v
              Product Service
                      |
                      v
                  Database
                      |
                      v
              Logging/Timing
                      |
                      v
              Response Transform
                      |
                      v
                  Response

On cache hit:

GET /products
     |
     v
Cache Interceptor
     |
     v
Cached result
     |
     v
Response`,
      codeExample: {
        title: "Combining timing and response transformation",
        code: `import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";

import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

@Injectable()
export class ApiResponseInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest();

    const start = Date.now();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
      tap(() => {
        const duration = Date.now() - start;

        console.log(
          \`\${request.method} \${request.url} - \${duration}ms\`,
        );
      }),
    );
  }
}`,
      },
      keyTakeaways: [
        "Interceptors can be composed to solve different cross-cutting concerns.",
        "Keep individual interceptors focused on one responsibility.",
        "Interceptor order can affect behavior.",
        "Caching, logging, timing, and transformation can be implemented independently.",
        "An interceptor can be scoped to a route, controller, or application.",
      ],
      commonMistakes: [
        "<b>Creating one giant interceptor.</b> Split unrelated responsibilities into focused interceptors.",
        "<b>Ignoring interceptor order.</b> Nested interceptors can affect when before and after logic runs.",
        "<b>Caching the wrong representation.</b> Decide whether you want to cache raw service data or the final API representation.",
        "<b>Making every interceptor global.</b> Global interceptors are powerful, but route- or controller-specific behavior may be more appropriate.",
      ],
      quiz: [
        {
          question: "Why should interceptors generally have focused responsibilities?",
          options: [
            "To keep cross-cutting behavior easier to understand and maintain",
            "Because NestJS only allows one line of code",
            "To prevent controllers from existing",
            "Because services cannot use TypeScript",
          ],
          correctIndex: 0,
          explanation: "Focused interceptors make the application easier to reason about and maintain.",
        },
        {
          question: "Can interceptor order affect application behavior?",
          options: [
            "No, order never matters",
            "Yes, interceptors wrap one another and order can affect execution",
            "Only for database migrations",
            "Only during TypeScript compilation",
          ],
          correctIndex: 1,
          explanation: "Multiple interceptors form a wrapping execution chain, so their order can affect before and after behavior.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is an interceptor designed to do?",
      options: [
        "Wrap and extend controller execution",
        "Create database tables",
        "Replace DTOs",
        "Start the NestJS CLI",
      ],
      correctIndex: 0,
      explanation: "Interceptors wrap request/controller execution and are useful for cross-cutting concerns.",
    },
    {
      question: "Which interface does a NestJS interceptor implement?",
      options: [
        "CanActivate",
        "NestInterceptor",
        "PipeTransform",
        "NestModule",
      ],
      correctIndex: 1,
      explanation: "NestJS interceptors implement the `NestInterceptor` interface.",
    },
    {
      question: "What does `next.handle()` represent?",
      options: [
        "The next stage of request execution",
        "A database transaction",
        "A DTO transformation",
        "A module import",
      ],
      correctIndex: 0,
      explanation: "`next.handle()` continues execution and provides the Observable containing the next stage's result.",
    },
    {
      question: "Which RxJS operator is useful for transforming a controller result?",
      options: [
        "map",
        "tap",
        "catchError",
        "timeout",
      ],
      correctIndex: 0,
      explanation: "`map()` transforms emitted values, making it useful for response transformation.",
    },
    {
      question: "Which RxJS operator is commonly useful for logging without changing the response?",
      options: [
        "map",
        "tap",
        "mergeMap",
        "scan",
      ],
      correctIndex: 1,
      explanation: "`tap()` is designed for side effects such as logging while leaving the emitted value unchanged.",
    },
    {
      question: "Why is `ExecutionContext` useful inside an interceptor?",
      options: [
        "It provides information about the current execution",
        "It creates database schemas",
        "It automatically validates DTOs",
        "It generates modules",
      ],
      correctIndex: 0,
      explanation: "ExecutionContext provides information about the current request and execution target.",
    },
    {
      question: "What is a common use for a timing interceptor?",
      options: [
        "Measure how long requests take",
        "Create users",
        "Generate DTOs",
        "Delete database records",
      ],
      correctIndex: 0,
      explanation: "Timing interceptors can measure the duration of wrapped request execution.",
    },
    {
      question: "Why is caching useful for a read-heavy endpoint?",
      options: [
        "It can avoid repeating expensive operations for repeated requests",
        "It makes all database writes unnecessary",
        "It disables authentication",
        "It replaces controllers",
      ],
      correctIndex: 0,
      explanation: "Caching can return an existing result instead of repeating an expensive operation.",
    },
    {
      question: "What is an important problem to consider when caching?",
      options: [
        "Stale data and invalidation",
        "TypeScript syntax",
        "Controller names",
        "HTTP method spelling",
      ],
      correctIndex: 0,
      explanation: "Cached data can become stale, so expiration and invalidation are important parts of cache design.",
    },
    {
      question: "Why should sensitive data be excluded from request logs?",
      options: [
        "Logs can expose secrets and private information",
        "Logs cannot contain strings",
        "NestJS does not support logging",
        "It makes controllers slower by definition",
      ],
      correctIndex: 0,
      explanation: "Passwords, tokens, and other sensitive information should not be unnecessarily written to logs.",
    },
    {
      question: "Can multiple interceptors be combined?",
      options: [
        "No",
        "Yes",
        "Only in development",
        "Only inside services",
      ],
      correctIndex: 1,
      explanation: "Multiple interceptors can be composed, allowing different cross-cutting concerns to remain separated.",
    },
    {
      question: "Why can interceptor order matter?",
      options: [
        "Interceptors wrap execution, so their before and after behavior can depend on their order",
        "NestJS sorts them alphabetically",
        "Only database queries have order",
        "Interceptor order never affects behavior",
      ],
      correctIndex: 0,
      explanation: "Interceptors form a nested execution chain, so ordering can affect when their before and after logic runs.",
    },
  ],

  project: {
    name: "API Observability and Performance Layer",
    goal: "Add a reusable interceptor layer to the Users, Products, and Orders API that provides logging, request timing, consistent response formatting, and caching for appropriate endpoints.",
    brief: "Upgrade the Store API from Day 17 by adding interceptors around the existing authentication and authorization system. The goal is not just to create one interceptor, but to understand how multiple interceptors can work together while keeping business logic inside services and security logic inside Guards.",
    steps: [
      "Review the existing Users, Products, and Orders API from the previous project.",
      "Create a basic interceptor implementing `NestInterceptor`.",
      "Use `ExecutionContext` to access the current HTTP request.",
      "Use `CallHandler` and `next.handle()` to continue request execution.",
      "Create a logging interceptor that records the HTTP method and URL.",
      "Add the response status code to the request log.",
      "Add the authenticated user ID to logs when `request.user` exists.",
      "Make sure passwords, access tokens, refresh tokens, and other secrets are never logged.",
      "Create a timing interceptor.",
      "Record the start time before calling `next.handle()`.",
      "Calculate request duration after the controller completes.",
      "Log requests that exceed a configurable slow-request threshold.",
      "Test the timing interceptor against a fast endpoint.",
      "Create a response transformation interceptor.",
      "Use `map()` to wrap successful controller responses in a consistent API structure.",
      "Return a response such as `{ success: true, data }`.",
      "Test the response transformation with the Products API.",
      "Test it with the Orders API.",
      "Think about which endpoints should not use a generic response wrapper.",
      "Create a caching strategy for the product catalog.",
      "Start with a simple in-memory implementation only for learning.",
      "Use a cache key that distinguishes different HTTP requests.",
      "Add an expiration concept so cached data does not remain forever.",
      "Test the difference between a cache miss and a cache hit.",
      "Change a product and observe what happens when the cache still contains the old value.",
      "Implement cache invalidation when a product is created, updated, or deleted.",
      "Consider why an in-memory cache is different when the application runs on multiple instances.",
      "Review NestJS caching support and consider how a production implementation could use a shared cache.",
      "Apply the logging interceptor at an appropriate scope.",
      "Apply the timing interceptor at an appropriate scope.",
      "Apply response transformation only where it makes sense for the API.",
      "Combine multiple interceptors and observe their execution order.",
      "Draw the complete request lifecycle from Middleware and Guards through Interceptors, Pipes, Controllers, Services, and the response.",
      "Test the final API using authenticated customers, managers, and administrators from Day 17.",
    ],
    acceptance: [
      "At least one custom interceptor implements `NestInterceptor`.",
      "`ExecutionContext` is used to inspect the current HTTP request.",
      "`CallHandler` and `next.handle()` are used correctly.",
      "Requests are logged without exposing sensitive credentials.",
      "Request duration is measured.",
      "Slow requests can be identified from logs.",
      "At least one endpoint uses response transformation.",
      "The transformed response has a consistent structure.",
      "The product endpoint demonstrates caching behavior.",
      "The project demonstrates the difference between a cache hit and cache miss.",
      "The project has a strategy for cache expiration or invalidation.",
      "Business logic remains in services rather than interceptors.",
      "Authentication and authorization remain in Guards.",
      "Multiple interceptors can work together.",
      "The project demonstrates understanding of interceptor ordering.",
    ],
    stretch: [
      "Replace console logging with a structured NestJS logging solution.",
      "Add a unique request ID and include it in every log entry.",
      "Propagate the request ID into service-level logs.",
      "Record request duration as structured metrics.",
      "Add different log levels for normal, slow, and failed requests.",
      "Implement response transformation with request metadata such as request ID and timestamp.",
      "Use NestJS cache support instead of the learning-only Map implementation.",
      "Use Redis as a distributed cache.",
      "Add cache expiration using a configurable TTL.",
      "Invalidate product cache entries when products change.",
      "Create separate cache keys for product lists, product details, and filtered product searches.",
      "Investigate cache stampede problems when many requests arrive at the same time after expiration.",
      "Add timeout handling around selected slow operations.",
      "Experiment with `catchError()` inside an interceptor for centralized error logging.",
      "Create a metrics interceptor that records request counts and response times.",
      "Add automated tests for logging, timing, transformation, and caching behavior.",
      "Measure p50, p95, and p99 response times for selected endpoints.",
      "Document which interceptors are global, controller-scoped, and route-scoped and explain why each scope was chosen.",
    ],
  },
};
