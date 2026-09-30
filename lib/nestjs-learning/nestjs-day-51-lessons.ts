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
      explanation: `A production API should not make clients guess what an error means from a human-readable message. Error codes provide stable machine-readable identifiers such as USER_NOT_FOUND, ORDER_ALREADY_PAID, or VALIDATION_FAILED. The message can change for readability, but the code should remain stable enough for clients to build reliable behavior around it.

A standard error format gives every endpoint a predictable response shape. A useful format normally contains an HTTP status, application error code, human-readable message, request or trace identifier, and optional details. The details field can carry structured information such as validation failures without forcing clients to parse strings.

HTTP status codes and application error codes have different jobs. HTTP status communicates the broad protocol-level category, while the application code identifies the specific application condition. For example, both an unknown user and an unknown order may use 404, but USER_NOT_FOUND and ORDER_NOT_FOUND tell the client exactly what happened.

Do not expose stack traces, SQL errors, internal hostnames, access tokens, or other implementation details in production responses. Those details belong in server-side logs and observability systems.`,
      diagram: `Client
  |
  | GET /orders/123
  v
NestJS Controller
  |
  v
Service / Domain
  |
  +----> ORDER_NOT_FOUND
  |
  v
Exception Filter
  |
  v
Standard Error Response
{
  "statusCode": 404,
  "code": "ORDER_NOT_FOUND",
  "message": "Order was not found",
  "requestId": "req_123"
}`,
      codeExample: { title: "Example", code: `// error-response.ts
export interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  requestId?: string;
  details?: unknown;
}

// domain error
export class OrderNotFoundError extends Error {
  readonly code = "ORDER_NOT_FOUND";

  constructor(public readonly orderId: string) {
    super("Order was not found");
  }
}

// Example response
{
  "statusCode": 404,
  "code": "ORDER_NOT_FOUND",
  "message": "Order was not found",
  "requestId": "req_01JABC"
}` },
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
      explanation: `Validation errors occur when a request is syntactically acceptable but its input does not satisfy the API contract. NestJS commonly handles DTO validation with ValidationPipe, class-validator, and class-transformer. The important architectural decision is how validation failures are converted into your standard error format.

A validation response should provide enough structured information for a client to correct the request. For example, a details array can identify the field, validation rule, and message. This is much more useful than returning one long string containing every validation failure.

Validation belongs at the API boundary, but business rules may still need to be checked deeper in the application. A DTO can validate that age is an integer, while a domain service may determine that the selected product cannot legally be purchased by that customer. These are different categories of failure and should not be mixed together.

Do not rely only on frontend validation. Backend validation remains mandatory because API clients can be browsers, mobile applications, integrations, scripts, or malicious callers.`,
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
      codeExample: { title: "Example", code: `import { IsEmail, IsInt, Min, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsInt()
  @Min(18)
  age!: number;
}

// Standardized validation response
{
  "statusCode": 400,
  "code": "VALIDATION_FAILED",
  "message": "Request validation failed",
  "details": [
    {
      "field": "email",
      "code": "IS_EMAIL",
      "message": "email must be a valid email address"
    }
  ],
  "requestId": "req_01JABC"
}` },
      keyTakeaways: [
        "DTO validation protects the API boundary.",
        "Structured validation details are better than parsing human-readable messages.",
        "Request validation and domain validation solve different problems.",
        "Never assume frontend validation is sufficient."
      ],
      commonMistakes: [
        "Accepting unvalidated request bodies.",
        "Returning inconsistent validation shapes between endpoints.",
        "Putting every business rule into DTO decorators.",
        "Trusting values because a frontend already validated them."
      ],
      quiz: [
        {
          question: "Which is the best reason to return structured validation details?",
          options: [
            "It makes HTTP unnecessary",
            "Clients can identify exactly which fields need correction",
            "It hides all validation behavior from clients",
            "It prevents all server-side validation"
          ],
          correctIndex: 1,
          explanation: "Structured details let clients associate errors with individual fields and validation rules."
        }
      ]
    },
    {
      id: "day-51-lesson-3",
      title: "Domain, Infrastructure, and Internal Errors",
      durationMinutes: 22,
      explanation: `Not every failure has the same origin. Domain errors represent meaningful business conditions: an order may already be cancelled, a wallet may have insufficient funds, or a user may not own a resource. These errors can often be translated into intentional 4xx responses.

Infrastructure errors come from dependencies such as PostgreSQL, Redis, object storage, queues, email providers, or external APIs. A database connection failure is not the same thing as a business rule failure. Infrastructure errors should usually be logged with diagnostic context and translated into a safe API response.

Internal errors are unexpected failures that the application did not intentionally model. A programming bug, an unexpected null value, or an unhandled dependency failure may become an internal server error. The public response should remain safe and generic while the internal logs contain enough information to debug the incident.

The architecture should preserve the original error context internally while preventing implementation details from leaking across the API boundary. An exception filter or centralized error handler is a natural place to perform this final translation.`,
      diagram: `                 Error
                   |
        +----------+----------+
        |          |          |
      Domain   Infrastructure Internal
        |          |          |
        v          v          v
       4xx       safe 5xx    safe 5xx
        |          |          |
        +----------+----------+
                   |
          Central Error Filter
                   |
          +--------+--------+
          |                 |
       Client            Logs/Tracing`,
      codeExample: { title: "Example", code: `export class OrderAlreadyCancelledError extends Error {
  readonly code = "ORDER_ALREADY_CANCELLED";
}

export class PaymentProviderUnavailableError extends Error {
  readonly code = "PAYMENT_PROVIDER_UNAVAILABLE";
  constructor(public readonly provider: string) {
    super("Payment provider is unavailable");
  }
}

// Unexpected errors should not expose their raw message.
function toPublicError(error: unknown) {
  if (error instanceof OrderAlreadyCancelledError) {
    return {
      statusCode: 409,
      code: error.code,
      message: "Order is already cancelled",
    };
  }

  if (error instanceof PaymentProviderUnavailableError) {
    return {
      statusCode: 503,
      code: error.code,
      message: "Payment service is temporarily unavailable",
    };
  }

  return {
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
  };
}` },
      keyTakeaways: [
        "Domain errors represent business conditions.",
        "Infrastructure errors represent dependency or platform failures.",
        "Unexpected internal errors should be safe externally but detailed internally.",
        "Centralized translation prevents error handling from becoming inconsistent."
      ],
      commonMistakes: [
        "Treating every exception as a 500 error.",
        "Returning raw PostgreSQL, Redis, or provider messages to clients.",
        "Catching an error and silently discarding its original context.",
        "Putting business rules into infrastructure-specific exception handlers."
      ],
      quiz: [
        {
          question: "An order cannot be cancelled because it has already shipped. What category best describes this?",
          options: [
            "Domain error",
            "Infrastructure error",
            "Network error",
            "Unknown internal error"
          ],
          correctIndex: 0,
          explanation: "The condition is a business rule and can be intentionally represented as a domain error."
        }
      ]
    }
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
