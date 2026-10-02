import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_51_LESSONS: LessonDay = {
  day: 51,
  title: "Error Architecture",
  totalMinutes: 75,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-51-lesson-1",
      title: "Error Codes and a Standard Error Format",
      durationMinutes: 20,
      explanation: `<b>What Is an API Error?</b>

An API error happens when the server cannot successfully complete a request.

For example, a client might send:

GET /users/123

If user 123 does not exist, the server needs to tell the client that the requested resource could not be found.

A simple API might return:

\`\`\`json
{
  "message": "User not found"
}
\`\`\`

This looks reasonable, but it creates a problem for applications.

The frontend now has to understand the meaning of the human-readable message:

\`\`\`ts
if (error.message === "User not found") {
  // show something
}
\`\`\`

This is fragile because someone could later change the message:

"User not found"

to:

"The requested user does not exist"

The frontend would break because it was depending on the message.

Instead, the API should provide a stable error code.


{
  "code": "USER_NOT_FOUND",
  "message": "The requested user could not be found."
}

Now the client can depend on:

\`\`\`typescript
if (error.code === "USER_NOT_FOUND") {
  // handle missing user
}
\`\`\`

The message can change without breaking the client's logic.

<b>Error Code vs Error Message</b>

These two fields have different responsibilities.

Error code

The error code is intended for machines.

\`\`\`text
USER_NOT_FOUND
ORDER_ALREADY_PAID
VALIDATION_FAILED
INSUFFICIENT_BALANCE
\`\`\`

It should be:

stable
predictable
documented
machine-readable
independent of wording
Error message

The message is intended primarily for humans.

The requested user could not be found.

It can be changed for:

readability
better explanations
localization
improved UX

For example:

{
  "code": "USER_NOT_FOUND",
  "message": "We couldn't find a user with that ID."
}

The code remains the same.

Good design
{
  "code": "USER_NOT_FOUND",
  "message": "The requested user could not be found."
}
Bad design
{
  "code": "The requested user could not be found."
}

The second approach makes the code dependent on human-readable text.

<b>HTTP Status Codes vs Application Error Codes</b>

These are not the same thing.

HTTP status codes describe the broad category of the result.

For example:

200 → Success
400 → Bad Request
401 → Unauthenticated
403 → Forbidden
404 → Resource Not Found
409 → Conflict
422 → Validation Problem
429 → Too Many Requests
500 → Internal Server Error

Application error codes provide more specific information.

For example:

404
 ├── USER_NOT_FOUND
 ├── ORDER_NOT_FOUND
 └── PRODUCT_NOT_FOUND

All three can use HTTP 404, but the application codes tell the client exactly what was missing.

Another example:

409
 ├── EMAIL_ALREADY_EXISTS
 ├── ORDER_ALREADY_PAID
 └── RESOURCE_VERSION_CONFLICT

Therefore:

HTTP status = broad category
Application error code = specific application condition

<b>Why Both Are Necessary</b>

Imagine an API returns:

{
  "code": "ORDER_ALREADY_PAID",
  "message": "This order has already been paid."
}

without an HTTP status.

The client has to inspect the response body to determine whether the request succeeded or failed.

That's not ideal.

Instead:

HTTP/1.1 409 Conflict

and:

{
  "code": "ORDER_ALREADY_PAID",
  "message": "This order has already been paid."
}

Now both layers communicate useful information.

The HTTP status tells the client:

This request conflicts with the current state.

The application code tells the client:

The specific conflict is that the order has already been paid.

<b>Standard Error Response Format</b>

A production API should use a consistent error structure.

For example:

{
  "statusCode": 404,
  "code": "USER_NOT_FOUND",
  "message": "The requested user could not be found.",
  "requestId": "req_01JXYZ123",
  "details": null
}

Each field has a specific responsibility.

statusCode

The HTTP status associated with the error.

"statusCode": 404
code

The stable application-level error identifier.

"code": "USER_NOT_FOUND"
message

A human-readable explanation.

"message": "The requested user could not be found."
requestId

An identifier associated with the request.

"requestId": "req_01JXYZ123"

This is extremely useful when debugging production problems.

A user can report:

"I received error req_01JXYZ123."

The engineering team can search logs using that identifier.

details

Optional structured information about the error.

For example:

"details": {
  "field": "email"
}

or for validation:

"details": {
  "fields": {
    "email": [
      "Email must be valid."
    ],
    "password": [
      "Password must contain at least 8 characters."
    ]
  }
}
<b>A More Complete Production Error Format</b>

A production API might standardize errors like this:

{
  "statusCode": 422,
  "code": "VALIDATION_FAILED",
  "message": "One or more fields are invalid.",
  "requestId": "req_01JXYZ123",
  "details": {
    "fields": {
      "email": [
        "Email must be a valid email address."
      ],
      "password": [
        "Password must contain at least 8 characters."
      ]
    }
  }
}

The important point is that details contains structured data, rather than forcing the client to parse the message.
`,
      diagram: `                    API REQUEST
                         │
                         ▼
               ┌─────────────────┐
               │   Server/API    │
               └────────┬────────┘
                        │
                  Request fails
                        │
                        ▼
             ┌─────────────────────┐
             │   Error Handling    │
             └──────────┬──────────┘
                        │
           ┌────────────┼─────────────┐
           │            │             │
           ▼            ▼             ▼
     HTTP Status    Error Code     Message
        404        USER_NOT_FOUND   Human text
           │            │             │
           └────────────┼─────────────┘
                        │
                        ▼
                 Standard Response
                        │
                        ▼
              ┌───────────────────┐
              │ statusCode: 404   │
              │ code: USER_...    │
              │ message: "..."    │
              │ requestId: "..."  │
              │ details: null     │
              └───────────────────┘
                        │
                        ▼
                     Client`,
      codeExample: { title: "Code Example", code: `A good TypeScript implementation can start with an error-code definition.

export const ErrorCode = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',

  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  ACCESS_DENIED: 'ACCESS_DENIED',

  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',

  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  ORDER_ALREADY_PAID: 'ORDER_ALREADY_PAID',

  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export type ErrorCode =
  (typeof ErrorCode)[keyof typeof ErrorCode];

Now the application has one central source for valid error codes.` },
      keyTakeaways: [
        "HTTP status codes describe the broad category of failure.",
        "Application error codes provide stable machine-readable meaning.",
        "A standard error envelope makes client behavior predictable.",
        "Keep sensitive implementation details out of public error responses."
      ],
      commonMistakes: [
        "Returning different JSON shapes from different controllers.",
        "Using only a free-form message as the machine-readable error identifier.",
        "Returning database or stack-trace details to clients.",
        "Changing established error codes unnecessarily."
      ],
      quiz: [
        {
          question: "Why use an application error code when an HTTP status already exists?",
          options: [
            "HTTP status codes cannot be sent over JSON",
            "The application code gives more specific, stable application-level meaning",
            "HTTP status codes are only for browsers",
            "The application code replaces HTTP status codes"
          ],
          correctIndex: 1,
          explanation: "A 404 can represent many application conditions. An application code such as ORDER_NOT_FOUND gives clients a stable, specific meaning."
        }
      ]
    },
    {
      id: "day-51-lesson-2",
      title: "Validation Errors",
      durationMinutes: 18,
      explanation: `<b>What Are Validation Errors?</b>

Validation errors occur when a client sends a request that does not satisfy the API's input requirements.

For example, suppose a NestJS API expects:

\`\`\`json
{
  "email": "user@example.com",
  "password": "strong-password"
}
\`\`\`

But the client sends:

\`\`\`json
{
  "email": "not-an-email",
  "password": "123"
}
\`\`\`

The request reached the server, but the input does not satisfy the API contract. This is a validation error.

Validation errors are different from internal server failures. The server may be working correctly; the request data is simply invalid.

<b>Why Validation Matters</b>

Validation protects the application from invalid input before that input reaches business logic, databases, or external services.

Without validation, invalid data can travel through multiple layers:

\`\`\`text
Controller
    ↓
Service
    ↓
Business Logic
    ↓
Database
\`\`\`

Every layer may then need to protect itself from malformed input.

With NestJS validation, the request can be rejected at the API boundary:

\`\`\`text
HTTP Request
     ↓
ValidationPipe
     ↓
Valid? ───── No ───→ Validation Error
  │
 Yes
  ↓
Controller
  ↓
Service
  ↓
Database
\`\`\`

This keeps invalid request data away from the rest of the application.

<b>DTOs and Validation</b>

NestJS commonly uses DTOs (Data Transfer Objects) together with class-validator.

A DTO describes the expected structure of incoming data and can declare validation rules for each property.

For example:

\`\`\`ts
import {
  IsEmail,
  IsString,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
\`\`\`

Now NestJS can validate that:

- email has a valid email format
- password is a string
- password contains at least 8 characters

<b>Enable ValidationPipe</b>

The validation decorators on a DTO do not perform validation by themselves. NestJS needs a ValidationPipe to run the validation process.

A common application-wide configuration is:

\`\`\`ts
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe(),
  );

  await app.listen(3000);
}
\`\`\`

With a global ValidationPipe, DTO validation can be applied consistently across controllers.

<b>Whitelist and Transform</b>

Production applications commonly configure ValidationPipe with options such as whitelist and transform.

\`\`\`ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);
\`\`\`

<b>whitelist</b>

The whitelist option removes properties that are not defined by the DTO.

For example, if the DTO contains:

\`\`\`ts
export class CreateUserDto {
  @IsEmail()
  email!: string;
}
\`\`\`

and the client sends:

\`\`\`json
{
  "email": "user@example.com",
  "isAdmin": true
}
\`\`\`

the unexpected isAdmin property can be removed when whitelist is enabled.

This helps keep incoming data aligned with the DTO contract.

<b>transform</b>

The transform option allows NestJS to transform incoming values into the types expected by the application when the necessary transformation metadata is available.

This is especially useful for query and route parameters, because HTTP values commonly arrive as strings.

For example:

\`\`\`text
GET /users?page=10
\`\`\`

The application may want page to be treated as a number rather than a raw string.

<b>Validation at the API Boundary</b>

Validation should happen as early as possible.

\`\`\`text
                 Client Request
                       │
                       ▼
              ┌─────────────────┐
              │  ValidationPipe  │
              └────────┬────────┘
                       │
                Validate DTO
                       │
              ┌────────┴────────┐
              │                 │
            Valid             Invalid
              │                 │
              ▼                 ▼
          Controller      Validation Error
              │                 │
              ▼                 ▼
           Service          4xx Response
              │
              ▼
        Domain Rules
\`\`\`

The ValidationPipe handles request-shape validation before the controller's business logic runs.

<b>Request Validation vs Domain Validation</b>

Not every rule belongs in a DTO.

A DTO can validate that:

\`\`\`text
age is an integer
email has a valid format
password has a minimum length
\`\`\`

But a domain service may need to determine whether:

\`\`\`text
the selected product can be purchased
the order can be cancelled
the user can perform an operation
the account is allowed to access a resource
\`\`\`

These are different categories of validation.

Request validation asks:

> Is this input structurally valid?

Domain validation asks:

> Is this operation allowed according to the business rules?

Keeping these responsibilities separate prevents DTOs from becoming a place for every business rule in the application.

<b>Standardizing Validation Errors</b>

Validation failures should follow the same error format introduced in the previous lesson.

For example:

\`\`\`json
{
  "statusCode": 400,
  "code": "VALIDATION_FAILED",
  "message": "Request validation failed.",
  "requestId": "req_01JABC",
  "details": [
    {
      "field": "email",
      "code": "IS_EMAIL",
      "message": "email must be a valid email address"
    }
  ]
}
\`\`\`

The details field contains structured information so the client can identify exactly which field failed validation.

The client should not need to parse a message such as:

\`\`\`text
"email is invalid, password is too short, name is required"
\`\`\`

Structured details are easier for web applications, mobile applications, and other API consumers to process.

<b>Customizing ValidationPipe</b>

NestJS allows you to customize validation exceptions using exceptionFactory.

For example:

\`\`\`ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (errors) => {
      return new BadRequestException({
        code: "VALIDATION_FAILED",
        message: "Request validation failed.",
        details: errors,
      });
    },
  }),
);
\`\`\`

In a production application, the raw validation errors should normally be transformed into the application's documented error structure rather than exposing framework-specific objects directly.

<b>Never Trust Frontend Validation</b>

Frontend validation improves user experience, but it is not a security boundary.

A backend API can be called by:

- a web browser
- a mobile application
- another backend service
- a command-line client
- an integration
- a malicious caller

Therefore, validation must always be enforced on the server.

The frontend can provide early feedback, but the NestJS API remains responsible for enforcing the actual API contract.`,
      diagram: `HTTP Request
    |
    v
ValidationPipe
    |
    +---- invalid ----> 400 VALIDATION_FAILED
    |
    +---- valid ------> Controller
                           |
                           v
                      Application Service
                           |
                           v
                       Domain Rules`,
      codeExample: {
        title: "Code Example",
        code: `import {
  IsEmail,
  IsInt,
  IsString,
  Min,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsInt()
  @Min(18)
  age!: number;
}

// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);

// Example standardized validation response
{
  "statusCode": 400,
  "code": "VALIDATION_FAILED",
  "message": "Request validation failed.",
  "details": [
    {
      "field": "email",
      "code": "IS_EMAIL",
      "message": "email must be a valid email address"
    }
  ],
  "requestId": "req_01JABC"
}`,
      },
      keyTakeaways: [
        "DTO validation protects the API boundary from invalid request data.",
        "ValidationPipe is responsible for running DTO validation in NestJS.",
        "whitelist helps remove properties that are not defined by the DTO.",
        "transform can convert incoming values into the expected application types.",
        "Structured validation details are better than forcing clients to parse human-readable messages.",
        "Request validation and domain validation solve different problems.",
        "Backend validation is mandatory even when frontend validation exists.",
      ],
      commonMistakes: [
        "Accepting request bodies without server-side validation.",
        "Returning inconsistent validation-error shapes from different endpoints.",
        "Putting every business rule into DTO decorators.",
        "Trusting values simply because a frontend already validated them.",
        "Returning raw framework validation objects as the long-term public API contract.",
      ],
      quiz: [
        {
          question: "Which NestJS feature is responsible for running DTO validation?",
          options: [
            "ValidationPipe",
            "AuthGuard",
            "Interceptor",
            "Middleware",
          ],
          correctIndex: 0,
          explanation: "ValidationPipe runs validation for DTOs and can also transform and standardize validation failures.",
        },
      ],
    },
    {
      id: "day-51-lesson-3",
      title: "Domain, Infrastructure, and Internal Errors",
      durationMinutes: 22,
      explanation: `<b>Why Error Categories Matter</b>

Not every failure in a NestJS application has the same meaning.

A production application can encounter errors from different layers:

\`\`\`text
Application
│
├── Validation Errors
├── Domain Errors
├── Infrastructure Errors
└── Internal Errors
\`\`\`

These categories should not automatically be handled in the same way.

For example:

\`\`\`text
ORDER_ALREADY_CANCELLED
\`\`\`

is very different from:

\`\`\`text
DATABASE_CONNECTION_FAILED
\`\`\`

The first represents a business condition that the application intentionally understands.

The second represents a failure in a technical dependency.

<b>Domain Errors</b>

A domain error represents a business rule that prevents an operation from completing.

The application itself may be functioning correctly. The requested operation is simply not allowed according to the current business state.

Examples include:

\`\`\`text
ORDER_ALREADY_PAID
ORDER_ALREADY_CANCELLED
INSUFFICIENT_BALANCE
USER_ALREADY_EXISTS
APPOINTMENT_ALREADY_BOOKED
INVALID_ORDER_STATE
\`\`\`

For example:

\`\`\`ts
if (order.status === OrderStatus.PAID) {
  throw new OrderAlreadyPaidException();
}
\`\`\`

This is not an infrastructure failure.

The database may be completely healthy. The service is intentionally rejecting the operation because the business rule does not allow it.

<b>Domain Errors and HTTP Responses</b>

A domain error can often be translated into an intentional 4xx response.

For example, if a client tries to pay an order that has already been paid:

\`\`\`json
{
  "statusCode": 409,
  "code": "ORDER_ALREADY_PAID",
  "message": "This order has already been paid.",
  "requestId": "req_123"
}
\`\`\`

The \`409 Conflict\` communicates the HTTP-level category, while \`ORDER_ALREADY_PAID\` identifies the specific application condition.

<b>Infrastructure Errors</b>

Infrastructure errors originate from technical dependencies required by the application.

Examples include:

\`\`\`text
PostgreSQL unavailable
Redis unavailable
RabbitMQ unavailable
Object storage unavailable
External API unavailable
Network timeout
DNS failure
\`\`\`

Consider a NestJS service that calls a payment provider:

\`\`\`text
NestJS Application
       │
       ├── PostgreSQL
       ├── Redis
       ├── RabbitMQ
       └── Payment Provider
\`\`\`

If the payment provider becomes unavailable, the application may receive a low-level technical error.

That error should not automatically become part of the public API contract.

For example, do not expose:

\`\`\`text
ECONNREFUSED 10.0.2.15:5432
\`\`\`

or:

\`\`\`text
Redis connection refused at redis-prod-01:6379
\`\`\`

Instead, log the technical details internally and translate the failure into a safe application-level error.

For example:

\`\`\`json
{
  "statusCode": 503,
  "code": "PAYMENT_PROVIDER_UNAVAILABLE",
  "message": "Payment service is temporarily unavailable.",
  "requestId": "req_456"
}
\`\`\`

<b>Internal Errors</b>

Internal errors are unexpected failures that the application did not intentionally model.

Examples include:

\`\`\`text
Unexpected null value
Programming bug
Unhandled exception
Unexpected type error
Unhandled dependency failure
\`\`\`

For example:

\`\`\`ts
const user = await this.userService.findById(id);

return user.profile.name;
\`\`\`

If \`profile\` unexpectedly contains \`null\`, the application may throw a runtime error.

This is not an error that the client needs to understand in technical detail.

The public response should remain safe:

\`\`\`json
{
  "statusCode": 500,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred.",
  "requestId": "req_789"
}
\`\`\`

The original exception should be logged with enough diagnostic information for developers to investigate it.

<b>Error Translation</b>

One of the most important patterns in production error architecture is translating low-level errors into application-level errors.

The general flow is:

\`\`\`text
Low-Level Error
      │
      ▼
Repository / Infrastructure Layer
      │
      ▼
Application or Domain Error
      │
      ▼
Global Exception Filter
      │
      ▼
Standard HTTP Response
\`\`\`

For example, PostgreSQL might report a duplicate-key violation.

The client should not have to know that PostgreSQL generated the error.

Instead:

\`\`\`text
PostgreSQL duplicate key
        ↓
USER_ALREADY_EXISTS
        ↓
HTTP 409
        ↓
Safe API response
\`\`\`

This keeps the public API contract independent from the database implementation.

<b>Preserving Error Context</b>

Error translation does not mean throwing away the original error.

The application should preserve the original error internally so that logs and observability systems contain enough information to diagnose the problem.

A useful architecture is:

\`\`\`text
                     Error
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       Domain     Infrastructure   Internal
          │            │            │
          ▼            ▼            ▼
       Intentional   Translate      Generic
         4xx        to safe 5xx      500
          │            │            │
          └────────────┼────────────┘
                       ▼
              Global Exception Filter
                       │
              ┌────────┴────────┐
              │                 │
           Client        Logs / Tracing
\`\`\`

The client receives a safe, documented response.

The server retains the detailed diagnostic context.

<b>Do Not Catch Every Error as 500</b>

A common mistake is to catch every exception and replace it with an internal server error.

For example:

\`\`\`ts
try {
  const order = await this.findOrder(id);

  if (order.status === "PAID") {
    throw new OrderAlreadyPaidException();
  }
} catch {
  throw new InternalServerErrorException();
}
\`\`\`

This destroys the meaning of the domain error.

\`ORDER_ALREADY_PAID\` is an expected business condition, not an unexpected internal failure.

The application should preserve meaningful errors and only convert errors when there is a reason to translate them.

<b>Centralized Error Translation</b>

A global exception filter is a natural place to perform the final HTTP-level translation.

Conceptually:

\`\`\`text
Controller / Service
        │
        ▼
     Exception
        │
        ▼
Global Exception Filter
        │
        ├── Known Domain Error
        │       ↓
        │    Documented 4xx
        │
        ├── Known Infrastructure Error
        │       ↓
        │    Safe 5xx
        │
        └── Unknown Error
                ↓
             Safe 500
\`\`\`

This prevents every controller and service from implementing its own error-response logic.

<b>Client vs Server Information</b>

A production API should separate information intended for clients from information intended for developers.

The client might receive:

\`\`\`json
{
  "statusCode": 500,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred.",
  "requestId": "req_789"
}
\`\`\`

While server-side logs might contain:

\`\`\`text
requestId: req_789
exception: TypeError
message: Cannot read properties of undefined
stack: ...
service: orders-api
environment: production
\`\`\`

This gives developers the information they need without exposing implementation details through the public API.

<b>Error Categories</b>

A useful mental model is:

\`\`\`text
Validation
→ Request data does not satisfy the API contract

Domain
→ Business rule prevents the operation

Infrastructure
→ Technical dependency or platform failure

Internal
→ Unexpected application failure
\`\`\`

These categories help determine how an error should be translated, logged, and exposed to clients.

The exact HTTP status depends on the semantics of the error, but the architectural distinction should remain clear.`,
      diagram: `                 Error
                   |
         +---------+---------+
         |         |         |
       Domain  Infrastructure Internal
         |         |         |
         v         v         v
        4xx      safe 5xx   safe 5xx
         |         |         |
         +---------+---------+
                   |
           Global Exception Filter
                   |
             +-----+-----+
             |           |
          Client    Logs/Tracing`,
      codeExample: {
        title: "Code Example",
        code: `export class OrderAlreadyCancelledError extends Error {
  readonly code = "ORDER_ALREADY_CANCELLED";
}

export class PaymentProviderUnavailableError extends Error {
  readonly code = "PAYMENT_PROVIDER_UNAVAILABLE";

  constructor(
    public readonly provider: string,
  ) {
    super("Payment provider is unavailable");
  }
}

// Translate known errors into safe public responses.
function toPublicError(error: unknown) {
  if (error instanceof OrderAlreadyCancelledError) {
    return {
      statusCode: 409,
      code: error.code,
      message: "Order is already cancelled.",
    };
  }

  if (error instanceof PaymentProviderUnavailableError) {
    return {
      statusCode: 503,
      code: error.code,
      message: "Payment service is temporarily unavailable.",
    };
  }

  // Unknown errors should not expose their raw message.
  return {
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
  };
}`,
      },
      keyTakeaways: [
        "Domain errors represent intentional business conditions.",
        "Infrastructure errors represent failures in technical dependencies or platforms.",
        "Unexpected internal errors should be safe externally but detailed internally.",
        "Low-level errors should be translated into stable application-level errors before reaching the API client.",
        "A global exception filter provides a central place for final error-response translation.",
        "Preserve original error context in logs and observability systems even when the public response is generic.",
      ],
      commonMistakes: [
        "Treating every exception as a 500 Internal Server Error.",
        "Returning raw PostgreSQL, Redis, queue, or external-provider messages to clients.",
        "Catching an error and silently discarding its original context.",
        "Converting meaningful domain errors into generic internal errors.",
        "Putting business rules into infrastructure-specific exception handlers.",
        "Making the public API contract depend on a specific database or external provider.",
      ],
      quiz: [
        {
          question: "An order cannot be cancelled because it has already shipped. What category best describes this?",
          options: [
            "Domain error",
            "Infrastructure error",
            "Network error",
            "Unknown internal error",
          ],
          correctIndex: 0,
          explanation: "The condition is a business rule and can be intentionally represented as a domain error.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What should a production API generally expose for an unexpected exception?",
      options: [
        "The full stack trace",
        "The SQL query and database host",
        "A safe generic error plus a correlation/request identifier",
        "The complete exception object"
      ],
      correctIndex: 2,
      explanation: "Clients need a safe response, while diagnostic details belong in internal logs and tracing."
    },
    {
      question: "Which field is intended primarily for machine-readable client behavior?",
      options: ["message", "code", "stack", "timestamp"],
      correctIndex: 1,
      explanation: "A stable application error code gives clients a predictable identifier."
    },
    {
      question: "Where should unexpected infrastructure details normally go?",
      options: ["Public API response", "Server-side logs and observability", "Frontend URL", "Database response body"],
      correctIndex: 1,
      explanation: "Internal diagnostics should be protected while remaining available to operators."
    }
  ],
  project: {
    name: "Production Error Architecture",
    goal: "Build a reusable NestJS error architecture that converts validation, domain, infrastructure, and unexpected errors into one safe API format.",
    brief: "Create a small Orders API with centralized exception handling. Add stable application error codes, structured validation errors, domain exceptions, infrastructure exception translation, request IDs, and safe handling for unknown exceptions.",
    steps: [
      "Create a standard ApiErrorResponse type.",
      "Create an application error-code catalog.",
      "Configure ValidationPipe for DTO validation.",
      "Create at least three domain errors such as ORDER_NOT_FOUND and ORDER_ALREADY_CANCELLED.",
      "Create an infrastructure error example for a dependency failure.",
      "Implement a global exception filter.",
      "Return a consistent JSON envelope for every known error.",
      "Return a generic INTERNAL_SERVER_ERROR for unexpected failures.",
      "Add request IDs to successful and failed requests.",
      "Write tests for validation, domain, infrastructure, and unexpected errors."
    ],
    acceptance: [
      "All API errors use one documented response structure.",
      "Clients can branch on stable error codes.",
      "Validation failures include structured field details.",
      "Sensitive implementation details are not exposed.",
      "Unexpected errors are logged while clients receive a safe 500 response.",
      "Automated tests cover every error category."
    ],
    stretch: [
      "Add correlation IDs that propagate to downstream requests.",
      "Integrate structured logging.",
      "Add OpenTelemetry trace IDs.",
      "Document the complete error catalog in Swagger."
    ]
  }
};
