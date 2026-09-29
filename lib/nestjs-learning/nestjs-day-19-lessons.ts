import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_19_LESSONS: LessonDay = {
  day: 19,
  title: "Exception Filters",
  totalMinutes: 112,
  difficulty: "Beginner",
  lessons: [
    {
      id: "exceptions-and-http-exceptions",
      title: "Exceptions and HttpException",
      durationMinutes: 18,
      explanation: `When something goes wrong in your NestJS application, you need a way to tell the client that the request could not be completed.

For example, imagine your Products API has this endpoint:

<code>GET /products/123</code>

The client asks for product 123.

But product 123 does not exist.

Your service should not simply return:

<code>null</code>

and expect every frontend developer to figure out what that means.

Instead, your application can throw an exception that represents the problem.

NestJS provides the <code>HttpException</code> class for this purpose.

For example:

<code>throw new HttpException(
  "Product not found",
  HttpStatus.NOT_FOUND,
);</code>

This tells NestJS that something went wrong and that the HTTP response should use status code 404.

The client can then receive a response similar to:

<code>{
  "statusCode": 404,
  "message": "Product not found"
}</code>

The important idea is:

<b>Throwing an exception stops the normal successful execution path and tells NestJS that an error response needs to be produced.</b>

Think about an online store.

A customer tries to buy a product.

The application checks the product.

If it exists, the normal flow continues:

<code>Request
   |
   v
Controller
   |
   v
Service
   |
   v
Product found
   |
   v
Continue order</code>

But if the product does not exist:

<code>Request
   |
   v
Controller
   |
   v
Service
   |
   v
Product NOT found
   |
   v
Throw exception
   |
   v
Error response</code>

The request does not continue as though everything was successful.

<b>Beginner real-world example:</b>

A user requests:

<code>GET /users/999</code>

but user 999 does not exist.

The service can throw:

<code>NotFoundException</code>

and NestJS returns a 404 response.

<b>Intermediate real-world example:</b>

A customer tries to order 10 units of a product, but only 3 are available.

You could throw:

<code>BadRequestException(
  "Only 3 units are available"
)</code>

The request is understood by the server, but the requested operation cannot be completed with the supplied data.

<b>Advanced real-world example:</b>

A payment service is temporarily unavailable.

Your application may need to distinguish between:

- invalid customer input
- authentication failure
- authorization failure
- missing resource
- conflict
- temporary server failure

These should not all become a generic 500 error.

Good exception design helps clients understand what happened and what they can do next.

NestJS's <code>HttpException</code> gives you a base class for HTTP-related exceptions.

You can provide a response body and a status code.

For example:

<code>throw new HttpException(
  {
    status: "error",
    message: "Product cannot be purchased",
    code: "OUT_OF_STOCK",
  },
  HttpStatus.CONFLICT,
);</code>

Now the client gets structured information instead of only a sentence.

This becomes especially useful when frontend applications need to make decisions based on error codes.

For example:

<code>OUT_OF_STOCK</code>

could tell the frontend to show:

<b>"This product is currently unavailable."</b>

while:

<code>PAYMENT_FAILED</code>

could show a completely different message.

One important rule is to avoid using exceptions as normal business flow for situations that are not actually exceptional.

For example, if a search endpoint finds zero products, returning an empty array is normally more appropriate than throwing a 404.

The right choice depends on what the endpoint means.

An empty search result can be a valid result.

A request for a specific product that does not exist is usually a missing resource.`,
      diagram: `HTTP Request
     |
     v
Controller
     |
     v
Service
     |
     +----------------------+
     |                      |
     | Success              | Problem
     v                      v
Return data          Throw Exception
     |                      |
     v                      v
200 Response          Exception Layer
                            |
                            v
                       Error Response

Example:

GET /products/123

Product exists
      |
      v
200 OK

Product does not exist
      |
      v
404 Not Found`,
      codeExample: {
        title: "Throwing HttpException",
        code: `import {
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class ProductsService {
  async findOne(id: string) {
    const product = await this.findProduct(id);

    if (!product) {
      throw new HttpException(
        "Product not found",
        HttpStatus.NOT_FOUND,
      );
    }

    return product;
  }

  private async findProduct(id: string) {
    // Example database lookup
    return null;
  }
}`,
      },
      keyTakeaways: [
        "Exceptions represent problems that prevent normal successful execution.",
        "`HttpException` is NestJS's base class for HTTP exceptions.",
        "An exception can contain a response body and HTTP status code.",
        "Throwing an exception stops the normal successful execution path.",
        "Use meaningful HTTP status codes instead of returning every error as 500.",
        "An empty valid result is not always an error; choose exceptions based on the meaning of the endpoint.",
      ],
      commonMistakes: [
        "<b>Returning `null` for every error.</b> Clients need to distinguish a missing resource from a successful response containing no value.",
        "<b>Using 500 for every problem.</b> 500 represents a server-side failure; many client-related problems have more appropriate status codes.",
        "<b>Throwing errors for normal empty results.</b> For example, an empty product search can be a valid result.",
        "<b>Putting sensitive internal information into exception messages.</b> Error responses should not expose database credentials, SQL statements, stack traces, or secrets.",
      ],
      quiz: [
        {
          question: "What is the purpose of `HttpException`?",
          options: [
            "To represent an HTTP-related error response",
            "To create a database table",
            "To define a DTO",
            "To create a controller",
          ],
          correctIndex: 0,
          explanation: "`HttpException` represents an HTTP error and can define the response status and body.",
        },
        {
          question: "What should happen when a requested product does not exist?",
          options: [
            "Always return 200 with null",
            "Throw an appropriate not-found exception",
            "Restart NestJS",
            "Delete the database",
          ],
          correctIndex: 1,
          explanation: "A missing specific resource is normally represented with a 404 Not Found response.",
        },
      ],
    },

    {
      id: "built-in-http-exceptions",
      title: "Built-in HTTP Exceptions",
      durationMinutes: 20,
      explanation: `You do not need to create a new <code>HttpException</code> manually every time you want to return a common HTTP error.

NestJS provides many built-in exception classes.

Some of the most useful ones are:

<code>BadRequestException</code>

Usually represents invalid input or a request that the server cannot process because of the client's data.

Example:

<code>throw new BadRequestException(
  "Quantity must be greater than zero"
);</code>

This normally produces HTTP 400.

<code>UnauthorizedException</code>

Usually represents a request that has not been successfully authenticated.

Example:

<code>throw new UnauthorizedException(
  "Invalid access token"
);</code>

This normally produces HTTP 401.

<code>ForbiddenException</code>

Usually means the request is understood and the user is authenticated, but the user does not have permission to perform the operation.

Example:

<code>throw new ForbiddenException(
  "You cannot delete this product"
);</code>

This normally produces HTTP 403.

<code>NotFoundException</code>

Used when the requested resource cannot be found.

Example:

<code>throw new NotFoundException(
  "Product not found"
);</code>

This normally produces HTTP 404.

<code>ConflictException</code>

Useful when the requested operation conflicts with the current state of the application.

For example, a user tries to register an email address that is already registered.

<code>throw new ConflictException(
  "Email is already registered"
);</code>

This normally produces HTTP 409.

<code>UnprocessableEntityException</code>

Can be useful when the request is understood but the supplied data cannot be processed according to the application's rules.

<code>InternalServerErrorException</code>

Represents an unexpected server-side failure.

You should not use it as a replacement for every other exception.

For example, if a user sends an invalid email address, that is not normally a 500 error.

<b>Beginner real-world example:</b>

A signup endpoint receives an email that is already registered.

Use:

<code>ConflictException</code>

because the new registration conflicts with an existing account.

<b>Intermediate real-world example:</b>

A logged-in customer attempts to delete another customer's order.

Authentication succeeded.

But authorization fails.

Use:

<code>ForbiddenException</code>.

This is different from <code>UnauthorizedException</code>.

<b>Advanced real-world example:</b>

Your order service calls a payment provider.

The payment provider is temporarily unavailable.

You may need to map the failure to an appropriate application-level error rather than exposing the raw third-party exception.

The exact status depends on your API contract and failure semantics.

This distinction is important:

<code>401 Unauthorized</code>

is generally about authentication.

<code>403 Forbidden</code>

is generally about permission.

A useful example is:

<code>GET /admin/reports</code>

User has no valid authentication:

<code>401</code>

User is authenticated as a normal customer but does not have the administrator permission:

<code>403</code>

The names can be confusing because "Unauthorized" sounds like "you are not allowed."

For API design, remember the authentication versus authorization distinction.

Another important point is that the exception class communicates intent.

Compare:

<code>throw new HttpException(
  "Email already exists",
  409,
);</code>

with:

<code>throw new ConflictException(
  "Email already exists",
);</code>

The second version immediately tells another developer why this exception is being thrown.

That makes code easier to understand.

You should choose the built-in exception that best represents the situation rather than manually constructing status codes everywhere.`,
      diagram: `Common API Problems
        |
        +--> Invalid input
        |       |
        |       v
        |   400 Bad Request
        |
        +--> Not authenticated
        |       |
        |       v
        |   401 Unauthorized
        |
        +--> Authenticated but not allowed
        |       |
        |       v
        |   403 Forbidden
        |
        +--> Resource missing
        |       |
        |       v
        |   404 Not Found
        |
        +--> State conflict
        |       |
        |       v
        |   409 Conflict
        |
        +--> Unexpected server failure
                |
                v
            500 Internal Server Error`,
      codeExample: {
        title: "Using built-in exceptions",
        code: `import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

@Injectable()
export class OrdersService {
  async createOrder(userId: string, productId: string) {
    const product = await this.findProduct(productId);

    if (!product) {
      throw new NotFoundException(
        "Product not found",
      );
    }

    if (product.stock <= 0) {
      throw new ConflictException(
        "Product is out of stock",
      );
    }

    if (!userId) {
      throw new BadRequestException(
        "User ID is required",
      );
    }

    const userCanOrder = await this.canUserOrder(userId);

    if (!userCanOrder) {
      throw new ForbiddenException(
        "You cannot place this order",
      );
    }

    return {
      id: "order-123",
      productId,
      userId,
    };
  }

  private async findProduct(id: string) {
    return {
      id,
      stock: 10,
    };
  }

  private async canUserOrder(userId: string) {
    return Boolean(userId);
  }
}`,
      },
      keyTakeaways: [
        "`BadRequestException` commonly represents invalid client input.",
        "`UnauthorizedException` commonly represents failed or missing authentication.",
        "`ForbiddenException` commonly represents insufficient permissions.",
        "`NotFoundException` represents a missing resource.",
        "`ConflictException` represents a conflict with the current application state.",
        "Using the specific built-in exception makes your code easier to understand.",
      ],
      commonMistakes: [
        "<b>Confusing 401 and 403.</b> Think authentication versus authorization.",
        "<b>Using 404 for every business problem.</b> Choose the status code based on what actually happened.",
        "<b>Using 500 for validation errors.</b> Invalid client input normally belongs in the 4xx family.",
        "<b>Manually writing numeric status codes everywhere.</b> Built-in exception classes communicate intent more clearly.",
      ],
      quiz: [
        {
          question: "Which exception is commonly used when a resource does not exist?",
          options: [
            "ConflictException",
            "NotFoundException",
            "ForbiddenException",
            "BadRequestException",
          ],
          correctIndex: 1,
          explanation: "NotFoundException represents a missing requested resource.",
        },
        {
          question: "A user is authenticated but does not have permission to delete an order. Which exception is appropriate?",
          options: [
            "UnauthorizedException",
            "ForbiddenException",
            "NotFoundException",
            "BadRequestException",
          ],
          correctIndex: 1,
          explanation: "The user is authenticated, but authorization fails, which is commonly represented by 403 Forbidden.",
        },
      ],
    },

    {
      id: "custom-exceptions",
      title: "Custom Exceptions",
      durationMinutes: 18,
      explanation: `Built-in exceptions cover many common situations.

But real applications often have domain-specific errors.

Imagine your Orders API.

A customer tries to buy a product.

The product exists.

The user is authenticated.

The product is in stock.

But the customer's account has been suspended.

This is a business-specific condition.

You could throw:

<code>BadRequestException</code>

but as your application grows, you may want a more meaningful domain-specific exception.

For example:

<code>AccountSuspendedException</code>

Another example is:

<code>InsufficientStockException</code>

or:

<code>PaymentRequiredException</code>

A custom exception can extend one of NestJS's exception classes.

For example:

<code>export class InsufficientStockException
  extends ConflictException {
  constructor() {
    super("Insufficient product stock");
  }
}</code>

Now your service code becomes very readable:

<code>if (product.stock < quantity) {
  throw new InsufficientStockException();
}</code>

Someone reading the code immediately understands the business situation.

This is useful because applications eventually develop their own vocabulary.

For an ecommerce system, concepts might include:

- ProductOutOfStock
- OrderAlreadyCancelled
- AccountSuspended
- PaymentFailed
- CouponExpired
- ShippingAddressInvalid

These names can make business logic much easier to understand.

<b>Beginner real-world example:</b>

Create:

<code>ProductNotFoundException</code>

and use it whenever a product lookup fails.

<b>Intermediate real-world example:</b>

Create:

<code>InsufficientStockException</code>

that extends <code>ConflictException</code>.

Now the HTTP semantics remain useful while your application gets a domain-specific name.

<b>Advanced real-world example:</b>

Your API clients need stable machine-readable error codes.

Instead of relying only on the human-readable message:

<code>"Product is out of stock"</code>

you might return:

<code>{
  "statusCode": 409,
  "code": "PRODUCT_OUT_OF_STOCK",
  "message": "The requested quantity is not available"
}</code>

The frontend can use the code:

<code>PRODUCT_OUT_OF_STOCK</code>

to decide what UI to display.

This is usually more stable than having the frontend compare English sentences.

You should also think about exception boundaries.

Your database library might throw something like a database-specific error.

Your payment SDK might throw a payment-provider-specific error.

You usually do not want those raw infrastructure errors to become your public API contract.

Instead, your service can translate them into application-level exceptions.

For example:

<code>PaymentProviderTimeoutError
          |
          v
PaymentService
          |
          v
PaymentUnavailableException
          |
          v
HTTP response</code>

This keeps external implementation details out of your API.

The frontend does not need to know which payment provider you use.

It only needs to know that payment processing is temporarily unavailable.

That is an important architectural boundary.

Your internal systems can change while your API contract remains stable.`,
      diagram: `Infrastructure Error
       |
       | database / payment / external API
       v
Application Service
       |
       | translate
       v
Domain/Application Exception
       |
       v
Exception Layer
       |
       v
HTTP Response

Example:

Payment SDK timeout
       |
       v
PaymentService
       |
       v
PaymentUnavailableException
       |
       v
503-style API response`,
      codeExample: {
        title: "A custom domain exception",
        code: `import {
  ConflictException,
} from "@nestjs/common";

export class InsufficientStockException
  extends ConflictException {
  constructor(
    available: number,
    requested: number,
  ) {
    super({
      code: "PRODUCT_OUT_OF_STOCK",
      message: "Not enough product stock",
      available,
      requested,
    });
  }
}

// Usage

if (product.stock < quantity) {
  throw new InsufficientStockException(
    product.stock,
    quantity,
  );
}`,
      },
      keyTakeaways: [
        "Custom exceptions can express business-specific problems clearly.",
        "A custom exception can extend a built-in NestJS exception.",
        "Stable machine-readable error codes can be more useful to clients than matching human-readable messages.",
        "Services can translate infrastructure-specific errors into application-specific exceptions.",
        "Do not expose internal database or third-party provider errors directly as your public API contract.",
      ],
      commonMistakes: [
        "<b>Creating a custom exception for every tiny error.</b> Use built-in exceptions when they already communicate the situation well.",
        "<b>Returning third-party SDK errors directly.</b> This couples your API to an implementation detail.",
        "<b>Making frontend code depend on exact English messages.</b> Stable error codes are usually safer for programmatic behavior.",
        "<b>Putting database implementation details into public errors.</b> Keep internal infrastructure details behind the application boundary.",
      ],
      quiz: [
        {
          question: "Why create a custom exception?",
          options: [
            "To represent a meaningful application-specific error",
            "To replace every built-in exception",
            "To create database tables",
            "To avoid HTTP status codes",
          ],
          correctIndex: 0,
          explanation: "Custom exceptions are useful when your application has domain-specific error situations.",
        },
        {
          question: "Why can an error code such as `PRODUCT_OUT_OF_STOCK` be useful?",
          options: [
            "Clients can reliably identify the error without comparing human-readable messages",
            "It automatically fixes inventory",
            "It replaces authentication",
            "It prevents all exceptions",
          ],
          correctIndex: 0,
          explanation: "Stable machine-readable codes provide a more reliable contract for clients.",
        },
      ],
    },

    {
      id: "exception-filters",
      title: "Exception Filters",
      durationMinutes: 20,
      explanation: `So far, we have learned how to throw exceptions.

Now we need to understand what happens when an exception reaches NestJS.

NestJS has an exception layer that catches unhandled exceptions and turns them into HTTP responses.

An exception filter gives you control over this process.

Think about a customer service department.

A service employee might report:

<b>"The customer could not complete the payment."</b>

A manager receives that information and decides how it should be communicated to the customer.

The exception filter plays a similar role.

It can catch an exception and decide what the final HTTP response should look like.

For example, maybe your application wants every error to have this structure:

<code>{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found",
    "timestamp": "..."
  }
}</code>

Instead of making every service manually build this structure, an exception filter can centralize it.

A filter can also log exception information.

For example:

<code>[ERROR]
GET /products/999
status=404
code=PRODUCT_NOT_FOUND</code>

You can also use filters to handle unexpected exceptions differently from known application exceptions.

This distinction is extremely important.

Suppose your service intentionally throws:

<code>NotFoundException</code>

That is a known HTTP exception.

But suppose your code accidentally does:

<code>someObject.property.value</code>

when <code>someObject</code> is undefined.

That is an unexpected programming error.

You do not want to expose the raw error and stack trace to the customer.

A production exception filter can log the detailed internal error while returning a safe generic response to the client.

For example, the server logs:

<code>TypeError: Cannot read properties of undefined...</code>

but the client receives:

<code>{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Something went wrong"
  }
}</code>

This separation is extremely valuable.

<b>Beginner real-world example:</b>

Create a filter that catches HTTP exceptions and returns a consistent error format.

<b>Intermediate real-world example:</b>

Add:

- timestamp
- request method
- URL
- status code
- error code

to the response.

<b>Advanced real-world example:</b>

Create a global exception filter that:

- logs unexpected errors
- creates a request ID
- produces a stable error response
- hides internal details
- preserves useful HTTP exception information
- sends structured logs to your observability system

This gives your entire API a consistent error boundary.

There is another important concept: filters can be scoped.

You can apply a filter:

- to a specific controller
- to a specific route
- globally

A global filter is useful when you want the entire application to follow the same error response contract.

A route-specific filter can be useful when one part of your application has special error-handling requirements.

The filter does not replace good exception handling in services.

Services should still throw meaningful exceptions.

The filter is responsible for deciding how those exceptions are converted into the final response.`,
      diagram: `Controller / Service
       |
       | throw exception
       v
+----------------------+
|   Exception Filter   |
|                      |
| - catch exception    |
| - inspect status     |
| - log error          |
| - create response    |
| - hide internals     |
+----------+-----------+
           |
           v
       HTTP Response

Known error:

NotFoundException
      |
      v
404 + structured error

Unexpected error:

TypeError
      |
      v
500 + safe generic error`,
      codeExample: {
        title: "A basic exception filter",
        code: `import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: HttpException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus();
    const exceptionResponse =
      exception.getResponse();

    response.status(status).json({
      success: false,
      error: exceptionResponse,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}`,
      },
      keyTakeaways: [
        "Exception filters control how exceptions are handled and represented in the final response.",
        "Filters can catch specific exception types.",
        "Filters are useful for consistent error response formats.",
        "Filters can also centralize exception logging.",
        "Unexpected internal errors should not expose sensitive implementation details.",
        "Filters can be applied at route, controller, or global scope.",
      ],
      commonMistakes: [
        "<b>Returning stack traces to clients.</b> Detailed internal errors belong in controlled server-side logs, not normal public responses.",
        "<b>Using filters to replace all service error handling.</b> Services should still throw meaningful exceptions.",
        "<b>Catching everything and returning 200.</b> An error response should communicate that the operation failed.",
        "<b>Ignoring the original exception.</b> A filter should preserve useful information such as status and error codes when appropriate.",
      ],
      quiz: [
        {
          question: "What is the purpose of an exception filter?",
          options: [
            "Control how exceptions are converted into responses",
            "Create database entities",
            "Validate DTO properties",
            "Generate controllers",
          ],
          correctIndex: 0,
          explanation: "Exception filters provide control over exception handling and the resulting response.",
        },
        {
          question: "Should a production API normally return raw stack traces to clients?",
          options: [
            "Yes, always",
            "Only for passwords",
            "No, internal details should generally stay on the server",
            "Only for database errors",
          ],
          correctIndex: 2,
          explanation: "Raw stack traces can expose implementation details and should generally be kept in controlled server-side logs.",
        },
      ],
    },

    {
      id: "global-exception-filters",
      title: "Global Exception Filters",
      durationMinutes: 18,
      explanation: `As your application grows, you may have dozens or hundreds of controllers.

Imagine your Store API has:

<code>UsersController</code>

<code>ProductsController</code>

<code>OrdersController</code>

<code>PaymentsController</code>

<code>ReviewsController</code>

<code>AdminController</code>

If each controller has a slightly different error format, your frontend becomes difficult to maintain.

One endpoint might return:

<code>{
  "message": "Product not found"
}</code>

Another might return:

<code>{
  "error": "User not found"
}</code>

Another might return:

<code>{
  "success": false,
  "message": "Order failed"
}</code>

This inconsistency becomes painful for frontend developers.

A global exception filter gives you a central place to define the application's error response contract.

Conceptually:

<code>UsersController
ProductsController
OrdersController
PaymentsController
       |
       v
Global Exception Filter
       |
       v
Consistent Error Response</code>

Now all controllers can follow the same format.

For example:

<code>{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found"
  },
  "path": "/products/123",
  "timestamp": "..."
}</code>

The exact format is your application's design decision.

The important thing is consistency.

A global filter can also become a central place for error logging.

For example:

<code>{
  "event": "http_error",
  "method": "POST",
  "path": "/orders",
  "statusCode": 500,
  "requestId": "req-123",
  "timestamp": "..."
}</code>

Your logs can contain more detail than the public response.

This creates two different audiences.

<b>Client:</b>

Needs a safe, understandable error.

<b>Developer / operations team:</b>

Needs enough information to diagnose the problem.

Those are not necessarily the same thing.

For example, the client might receive:

<code>{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Something went wrong"
  }
}</code>

while the server log contains:

<code>Database connection timeout
host=internal-db
operation=CreateOrder
requestId=req-123</code>

The database host should not be exposed to the customer.

But it can be extremely useful to the engineering team.

<b>Beginner real-world example:</b>

Create one global filter that makes all error responses follow the same shape.

<b>Intermediate real-world example:</b>

Add request URL, HTTP method, timestamp, and status code.

<b>Advanced real-world example:</b>

Build a production error boundary that:

- distinguishes known HTTP exceptions from unexpected exceptions
- assigns stable application error codes
- logs unexpected exceptions
- attaches request IDs
- hides sensitive implementation details
- supports monitoring and alerting
- keeps the public API contract stable

This is the point where exception filters become part of your application's observability architecture.

One important design principle is that a global filter should not become a giant business-logic service.

Its job is error handling.

It should not:

- calculate order totals
- update inventory
- charge credit cards
- decide user permissions
- create products

Those responsibilities belong elsewhere.

The filter should take the error and produce an appropriate response.

You should also think carefully about whether every exception should be exposed with its original message.

Some application exceptions have safe messages.

Others may contain internal information.

A mature API often separates:

<code>internal error details</code>

from:

<code>public error details</code>

That separation becomes especially important as your application handles payments, personal information, authentication credentials, and other sensitive data.`,
      diagram: `                   Any Controller
                         |
                         v
                 Exception thrown
                         |
                         v
              +----------------------+
              | Global Exception     |
              | Filter               |
              +----------+-----------+
                         |
             +-----------+-----------+
             |                       |
        Known error            Unknown error
             |                       |
             v                       v
       Preserve safe             Log details
       error details                  |
             |                       v
             |                 Safe generic
             |                    response
             |                       |
             +-----------+-----------+
                         |
                         v
                  HTTP Error Response

Public response:
{
  success: false,
  error: {...}
}

Server logs:
{
  requestId: "...",
  stack: "...",
  internalDetails: "..."
}`,
      codeExample: {
        title: "A global-style exception filter",
        code: `import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

@Catch()
export class GlobalExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: unknown,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const isHttpException =
      exception instanceof HttpException;

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      isHttpException
        ? exception.getResponse()
        : null;

    if (!isHttpException) {
      console.error(
        "Unexpected application error:",
        exception,
      );
    }

    response.status(status).json({
      success: false,
      error: isHttpException
        ? exceptionResponse
        : {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          },
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}`,
      },
      keyTakeaways: [
        "A global exception filter can create a consistent error contract across the application.",
        "Known HTTP exceptions can preserve useful status and error information.",
        "Unexpected errors should usually be logged internally and represented safely to clients.",
        "Public error responses and internal diagnostic logs can contain different levels of detail.",
        "Global filters are especially useful in larger APIs with many controllers.",
        "Keep business logic out of exception filters.",
      ],
      commonMistakes: [
        "<b>Returning every exception's raw message.</b> Some internal errors may expose sensitive implementation details.",
        "<b>Logging secrets along with exceptions.</b> Error logging must follow the same security rules as normal request logging.",
        "<b>Turning the global filter into a business service.</b> It should format and handle errors, not perform application business operations.",
        "<b>Returning the same 500 status for every error.</b> Preserve meaningful HTTP exception status codes when appropriate.",
      ],
      quiz: [
        {
          question: "Why use a global exception filter?",
          options: [
            "To create a consistent error-handling strategy across the application",
            "To replace every service",
            "To disable controllers",
            "To remove HTTP status codes",
          ],
          correctIndex: 0,
          explanation: "A global filter provides a centralized error boundary for the entire application.",
        },
        {
          question: "What should happen to unexpected internal errors?",
          options: [
            "Expose the entire stack trace to every client",
            "Ignore them completely",
            "Log useful internal details and return a safe response",
            "Return HTTP 200",
          ],
          correctIndex: 2,
          explanation: "Unexpected errors should be diagnosed internally while the public response avoids leaking sensitive implementation details.",
        },
      ],
    },

    {
      id: "exception-filter-real-world-architecture",
      title: "Building a Production-Style Error System",
      durationMinutes: 18,
      explanation: `Now let's connect everything you have learned so far.

Your Store API has:

<code>Users</code>

<code>Products</code>

<code>Orders</code>

You already learned:

- Middleware
- Guards
- Interceptors
- Pipes
- Controllers
- Services
- DTOs
- Validation

Exception handling sits across this request lifecycle.

Consider this request:

<code>POST /orders</code>

The customer sends:

<code>{
  "productId": "product-123",
  "quantity": 5
}</code>

The request can travel through the application like this:

<code>Request
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
Controller
   |
   v
Service
   |
   v
Database
   |
   v
Response
</code>

But what happens if something fails?

Different layers can produce different problems.

<b>Pipe problem:</b>

The quantity is a string instead of a number.

Validation may reject it before the controller executes.

<b>Guard problem:</b>

The user is not authenticated.

The guard can throw an authentication exception.

<b>Controller problem:</b>

The controller receives a valid request but cannot find the requested resource.

The service can throw <code>NotFoundException</code>.

<b>Business rule problem:</b>

The product has only 2 units available but the customer requests 5.

The service can throw a custom <code>InsufficientStockException</code>.

<b>Infrastructure problem:</b>

The database becomes unavailable.

The application may encounter an unexpected or infrastructure-specific exception.

<b>Unexpected programming problem:</b>

A bug causes an unhandled TypeError.

The global exception filter can catch the error at the HTTP boundary and return a safe 500 response.

This gives you a much clearer architecture.

Each layer has a job.

The exception filter does not need to know how orders work.

The order service does not need to know how the final error JSON is formatted.

The guard does not need to know how database errors are logged.

The pipe does not need to know how payment failures work.

This separation keeps the application maintainable.

<b>Beginner real-world example:</b>

Create a standard response:

<code>{
  "success": false,
  "error": {
    "message": "...",
    "code": "..."
  }
}</code>

and make all application errors follow it.

<b>Intermediate real-world example:</b>

Create custom exceptions for your Store domain:

<code>ProductNotFoundException</code>

<code>InsufficientStockException</code>

<code>OrderAlreadyCancelledException</code>

<code>PaymentFailedException</code>

Then map them to appropriate HTTP responses.

<b>Advanced real-world example:</b>

Imagine a customer reports:

<b>"My order failed, but I don't know why."</b>

Your response might contain:

<code>{
  "success": false,
  "error": {
    "code": "PAYMENT_UNAVAILABLE",
    "message": "Payment could not be completed at this time",
    "requestId": "req_8f21"
  }
}</code>

Your server logs can contain:

<code>{
  "requestId": "req_8f21",
  "error": "PaymentProviderTimeout",
  "provider": "payment-service",
  "durationMs": 3200,
  "endpoint": "POST /orders",
  "userId": "user_123"
}</code>

The customer gets enough information to contact support.

Your engineering team gets enough information to investigate.

The internal payment provider details are not exposed publicly.

This is a much more realistic production architecture.

Another important concept is stable error codes.

Do not make the frontend depend on:

<code>message === "Product is out of stock"</code>

because the wording might change.

Instead:

<code>code === "PRODUCT_OUT_OF_STOCK"</code>

can remain stable while the human-readable message changes.

This becomes particularly useful when your API has multiple clients:

- web application
- mobile application
- admin dashboard
- partner integrations

All of them can understand the same machine-readable error codes.

Finally, remember that exception handling is not just about making errors look nice.

It is about creating a predictable boundary between your application and its clients.

A good error system answers three questions:

<b>1. What happened?</b>

Use an appropriate HTTP status and application error code.

<b>2. What should the client know?</b>

Return a safe and useful public message.

<b>3. What does the engineering team need to know?</b>

Log enough internal information to diagnose the problem without leaking sensitive data.

That is the real purpose of exception handling in a production API.`,
      diagram: `                         HTTP Request
                              |
                              v
                         Middleware
                              |
                              v
                            Guard
                              |
                 +------------+------------+
                 |                         |
              Allowed                    Denied
                 |                         |
                 v                         v
            Interceptor             401 / 403
                 |
                 v
                Pipe
                 |
          +------+------+
          |             |
       Valid          Invalid
          |             |
          v             v
      Controller      400
          |
          v
        Service
          |
    +-----+------+
    |            |
 Success       Exception
    |            |
    v            v
 Database    Custom/Built-in
    |         Exception
    |            |
    +-----+------+
          |
          v
   Exception Filter
          |
     +----+----+
     |         |
   Known    Unknown
     |         |
     v         v
  Safe      Log details
 response       |
     |          v
     |       Safe 500
     |          response
     +----+-----+
          |
          v
       Client`,
      codeExample: {
        title: "Domain exceptions with a global error format",
        code: `import {
  ConflictException,
  NotFoundException,
} from "@nestjs/common";

export class ProductNotFoundException
  extends NotFoundException {
  constructor(productId: string) {
    super({
      code: "PRODUCT_NOT_FOUND",
      message: "Product was not found",
      productId,
    });
  }
}

export class InsufficientStockException
  extends ConflictException {
  constructor(
    productId: string,
    available: number,
    requested: number,
  ) {
    super({
      code: "PRODUCT_OUT_OF_STOCK",
      message: "Not enough stock available",
      productId,
      available,
      requested,
    });
  }
}

// ProductsService

if (!product) {
  throw new ProductNotFoundException(productId);
}

if (product.stock < quantity) {
  throw new InsufficientStockException(
    productId,
    product.stock,
    quantity,
  );
}`,
      },
      keyTakeaways: [
        "Different application layers can produce different kinds of failures.",
        "Pipes can reject invalid input before the controller executes.",
        "Guards can reject unauthenticated or unauthorized requests.",
        "Services can throw business-specific exceptions.",
        "Global exception filters provide a final HTTP error boundary.",
        "Public errors should be safe and useful.",
        "Internal logs should contain enough information for diagnosis without exposing secrets.",
        "Stable error codes are useful when multiple clients consume the same API.",
      ],
      commonMistakes: [
        "<b>Handling every error in the controller.</b> This creates repetitive and difficult-to-maintain code.",
        "<b>Making the frontend depend on error messages.</b> Use stable error codes for programmatic behavior.",
        "<b>Exposing infrastructure details.</b> Clients usually do not need database hosts, SQL queries, stack traces, or provider internals.",
        "<b>Returning 200 for failed operations.</b> HTTP status codes should communicate whether the request succeeded or failed.",
        "<b>Logging everything without considering privacy.</b> Error logs can contain sensitive request information and must be handled carefully.",
      ],
      quiz: [
        {
          question: "Where should business-specific errors such as insufficient stock usually originate?",
          options: [
            "The order/product service",
            "The main.ts file",
            "The DTO class",
            "The database connection string",
          ],
          correctIndex: 0,
          explanation: "Business rules belong in the relevant application service, which can throw a meaningful domain exception.",
        },
        {
          question: "What is the main job of a global exception filter?",
          options: [
            "Provide a centralized HTTP error-handling boundary",
            "Calculate product prices",
            "Authenticate every user manually",
            "Create database records",
          ],
          correctIndex: 0,
          explanation: "A global exception filter centralizes how application exceptions become HTTP responses.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What happens when a NestJS application throws an HTTP exception?",
      options: [
        "NestJS can convert it into an HTTP error response",
        "The server must always restart",
        "The database is deleted",
        "The controller is permanently disabled",
      ],
      correctIndex: 0,
      explanation: "NestJS's exception layer handles HTTP exceptions and produces an appropriate HTTP response.",
    },
    {
      question: "Which exception normally represents a missing resource?",
      options: [
        "NotFoundException",
        "ForbiddenException",
        "ConflictException",
        "UnauthorizedException",
      ],
      correctIndex: 0,
      explanation: "NotFoundException is commonly used for HTTP 404 responses.",
    },
    {
      question: "Which exception normally represents failed authentication?",
      options: [
        "UnauthorizedException",
        "ForbiddenException",
        "ConflictException",
        "NotFoundException",
      ],
      correctIndex: 0,
      explanation: "UnauthorizedException is commonly used for authentication failures and produces HTTP 401.",
    },
    {
      question: "A user is authenticated but does not have permission to delete an order. Which exception is commonly appropriate?",
      options: [
        "UnauthorizedException",
        "ForbiddenException",
        "NotFoundException",
        "BadRequestException",
      ],
      correctIndex: 1,
      explanation: "The user is authenticated but lacks permission, which is commonly represented by HTTP 403 Forbidden.",
    },
    {
      question: "What is the main purpose of an exception filter?",
      options: [
        "Control how exceptions are handled and converted into responses",
        "Create DTOs",
        "Validate database schemas",
        "Start the application",
      ],
      correctIndex: 0,
      explanation: "Exception filters provide control over exception handling and the final response.",
    },
    {
      question: "Why might you create a custom exception such as `InsufficientStockException`?",
      options: [
        "To clearly represent a business-specific error",
        "To replace all controllers",
        "To disable validation",
        "To create database migrations",
      ],
      correctIndex: 0,
      explanation: "Custom exceptions give meaningful names to application-specific failure conditions.",
    },
    {
      question: "Why can stable error codes be useful?",
      options: [
        "Clients can identify errors without depending on human-readable messages",
        "They automatically fix failed requests",
        "They replace HTTP status codes",
        "They prevent all exceptions",
      ],
      correctIndex: 0,
      explanation: "Stable machine-readable error codes provide a reliable contract for frontend and other API clients.",
    },
    {
      question: "What should a production API generally avoid returning to clients?",
      options: [
        "A safe error message",
        "A useful error code",
        "Raw internal stack traces and sensitive implementation details",
        "An appropriate HTTP status",
      ],
      correctIndex: 2,
      explanation: "Raw internal errors can expose sensitive implementation details and should generally remain in controlled server-side logs.",
    },
    {
      question: "What is one benefit of a global exception filter?",
      options: [
        "Consistent error responses across controllers",
        "Automatic database indexing",
        "Automatic authentication",
        "Automatic DTO creation",
      ],
      correctIndex: 0,
      explanation: "A global filter can centralize the application's error response format.",
    },
    {
      question: "Where should an insufficient-stock business rule normally live?",
      options: [
        "The relevant service",
        "The global exception filter",
        "The DTO",
        "main.ts",
      ],
      correctIndex: 0,
      explanation: "Business rules belong in application services. The service can throw a domain-specific exception when the rule fails.",
    },
    {
      question: "What should a global exception filter do with an unexpected internal error?",
      options: [
        "Expose the complete stack trace to the customer",
        "Log useful internal details and return a safe error response",
        "Return HTTP 200",
        "Ignore the error",
      ],
      correctIndex: 1,
      explanation: "Unexpected errors should be diagnosed internally while the public response avoids leaking sensitive details.",
    },
    {
      question: "Which response is usually more stable for frontend code?",
      options: [
        "Checking whether `message === 'Product is out of stock'`",
        "Checking a stable code such as `PRODUCT_OUT_OF_STOCK`",
        "Checking the length of the message",
        "Checking whether the response contains the word 'product'",
      ],
      correctIndex: 1,
      explanation: "Stable error codes allow clients to respond to errors without depending on human-readable wording.",
    },
  ],

  project: {
    name: "Production-Style Error Handling for the Store API",
    goal: "Build a complete exception-handling system for the Users, Products, and Orders API using built-in exceptions, custom domain exceptions, exception filters, and a global error response format.",
    brief: "Upgrade the Store API from the previous days by giving it a predictable and production-style error system. Your API should clearly distinguish validation errors, authentication failures, authorization failures, missing resources, business conflicts, and unexpected server errors. Clients should receive safe and consistent responses while developers can still get useful diagnostic information from server-side logs.",
    steps: [
      "Review the existing Users, Products, and Orders modules from the previous project.",
      "Review the Guards from Day 17 and Interceptors from Day 18.",
      "Identify every place where the current application can fail.",
      "Create a list of expected client errors for Users, Products, and Orders.",
      "Replace generic errors with appropriate NestJS built-in exceptions where possible.",
      "Use `BadRequestException` for invalid business input that is not already handled by DTO validation.",
      "Use `UnauthorizedException` for authentication failures.",
      "Use `ForbiddenException` for authorization failures.",
      "Use `NotFoundException` when a requested resource does not exist.",
      "Use `ConflictException` for state conflicts such as duplicate email registration or insufficient stock.",
      "Identify at least three business-specific errors in your Store API.",
      "Create custom exceptions for those business-specific errors.",
      "Create `ProductNotFoundException`.",
      "Create `InsufficientStockException`.",
      "Create `OrderAlreadyCancelledException`.",
      "Add stable machine-readable error codes to your custom exceptions.",
      "Make sure the error messages are useful to humans but do not contain sensitive information.",
      "Create a custom HTTP exception filter.",
      "Use `ArgumentsHost` to access the HTTP request and response.",
      "Use `HttpException` to identify known HTTP exceptions.",
      "Return a consistent error response structure.",
      "Include the HTTP status code in the error response.",
      "Include the request path in the error response.",
      "Include a timestamp in the error response.",
      "Include a stable application error code when one exists.",
      "Create a global exception filter that can handle unknown exceptions.",
      "Make sure unexpected exceptions become a safe 500 response.",
      "Log unexpected exceptions on the server.",
      "Do not expose stack traces to API clients.",
      "Do not expose database connection details to API clients.",
      "Do not expose payment-provider credentials or internal provider details.",
      "Test a missing product.",
      "Test an invalid order.",
      "Test an unauthenticated request.",
      "Test an authenticated user attempting an unauthorized operation.",
      "Test duplicate user registration.",
      "Test insufficient product stock.",
      "Test an already-cancelled order.",
      "Intentionally create a controlled internal error in a development-only test route.",
      "Confirm that the client receives a safe 500 response.",
      "Confirm that the server logs contain enough information to diagnose the unexpected error.",
      "Add request IDs to your error response if your project already has request-ID support from the interceptor work.",
      "Connect the request ID between the logging interceptor and global exception filter.",
      "Review every public error message and check that it does not expose sensitive implementation details.",
      "Document the error codes supported by your API.",
      "Document the expected HTTP status for each error.",
      "Test the complete request lifecycle for both successful and failed requests.",
    ],
    acceptance: [
      "The API uses NestJS built-in exceptions where appropriate.",
      "Authentication failures produce an appropriate 401 response.",
      "Authorization failures produce an appropriate 403 response.",
      "Missing resources produce an appropriate 404 response.",
      "Business conflicts produce an appropriate 409 response.",
      "At least three custom domain exceptions exist.",
      "Custom exceptions contain stable machine-readable error codes.",
      "A custom exception filter is implemented.",
      "A global exception filter handles application-wide errors.",
      "All error responses follow one consistent structure.",
      "Unexpected errors produce a safe 500 response.",
      "Unexpected errors are logged on the server.",
      "Stack traces are not returned to normal API clients.",
      "Database credentials, tokens, passwords, and other secrets are not exposed in error responses.",
      "Business rules remain inside services rather than exception filters.",
      "The frontend can identify important errors using stable error codes.",
      "The error system works across Users, Products, and Orders.",
      "The error system works together with the Guards, Pipes, and Interceptors already created.",
    ],
    stretch: [
      "Create a complete application error-code catalog.",
      "Add a request ID to every successful and failed response.",
      "Include the request ID in every structured server-side error log.",
      "Create a custom `PaymentFailedException`.",
      "Create a custom `PaymentUnavailableException`.",
      "Create a custom `CouponExpiredException`.",
      "Create a custom `AccountSuspendedException`.",
      "Create separate public and internal error representations.",
      "Add structured JSON logging for all unexpected exceptions.",
      "Send critical exceptions to an external monitoring system.",
      "Add error metrics grouped by endpoint and error code.",
      "Create automated tests for every custom exception.",
      "Create end-to-end tests for the global exception filter.",
      "Test that stack traces never appear in production-style HTTP responses.",
      "Test that sensitive headers such as authorization tokens are never written to logs.",
      "Create an error-handling documentation page for frontend developers.",
      "Document which errors are retryable and which are not.",
      "Design an error response that supports multiple frontend applications such as web, mobile, and admin clients.",
      "Add correlation IDs so a support team can locate the exact server logs for a customer's failed request.",
      "Simulate a database outage and design how the API should safely report it.",
      "Simulate a third-party payment provider timeout and translate the provider error into an application-level exception.",
      "Design an error strategy for a distributed system where multiple NestJS services communicate with each other.",
    ],
  },
};
