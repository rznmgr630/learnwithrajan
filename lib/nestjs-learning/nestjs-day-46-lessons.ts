import type { LessonDay } from "@/lib/learn/lesson-types";

export const API_ARCHITECTURE_DAY_46_LESSONS: LessonDay = {
  day: 46,
  title: "API Architecture",
  totalMinutes: 100,
  difficulty: "Advanced",
  lessons: [
    {
      id: "api-contracts-and-boundaries",
      title: "API Contracts and Boundaries",
      durationMinutes: 28,
      explanation: "An API contract is the agreement between an API provider and its consumers. It describes what a client can send, what the server returns, which status codes can occur, what authentication is required, and what behavior consumers can rely on. A good contract is more precise than simply documenting endpoint URLs.\n\nResource boundaries are equally important. A resource should represent a meaningful business object or capability rather than exposing database tables directly. For example, an Order API may expose an Order resource with customer, status, items, and totals while hiding internal tables such as order_events or payment_attempts.\n\nIn NestJS, DTOs are a useful contract boundary. Request DTOs validate incoming data and response DTOs prevent accidental exposure of internal entity fields. Keeping persistence entities separate from public API models also makes future database changes safer.",
      diagram: "Client\n  |\n  | HTTP request\n  v\n+--------------------+\n| API Contract       |\n| DTO + validation   |\n| auth + semantics   |\n+--------------------+\n  |\n  v\n+--------------------+\n| Application layer  |\n+--------------------+\n  |\n  v\n+--------------------+\n| Persistence model  |\n+--------------------+\n\nPublic contract != database schema",
      codeExample: { title: "Example", code: "export class CreateOrderDto {\n  customerId: string;\n  items: Array<{\n    productId: string;\n    quantity: number;\n  }>;\n}\n\nexport class OrderResponseDto {\n  id: string;\n  status: \"pending\" | \"paid\" | \"cancelled\";\n  total: number;\n  createdAt: string;\n}" },
      keyTakeaways: [
        "Define API behavior explicitly instead of relying on implementation details.",
        "Use request and response DTOs as public boundaries.",
        "Avoid exposing ORM entities directly.",
        "Design resources around business concepts rather than database tables."
      ],
      commonMistakes: [
        "Returning TypeORM entities directly can expose internal fields.",
        "Treating database column names as permanent API fields couples clients to storage.",
        "Changing response types without considering existing consumers can create accidental breaking changes."
      ],
      quiz: [
    {
      question: "What is an API contract?",
      options: ["An agreement about requests, responses, and behavior", "A database password", "A CSS file", "A deployment script"],
      correctIndex: 0,
      explanation: "The contract defines behavior consumers can rely on."
    }
  ]
    },
    {
      id: "backward-compatibility",
      title: "Backward Compatibility",
      durationMinutes: 25,
      explanation: "Backward compatibility means an existing client can continue using the API after the server changes. Compatible changes generally add optional capabilities without changing the meaning of existing fields or removing supported behavior.\n\nFor example, adding an optional response field is usually safer than renaming an existing field. Adding an optional request field can also be compatible when old clients can continue sending the previous payload.\n\nCompatibility must be considered for JSON shape, status codes, validation behavior, authentication, pagination semantics, error formats, and business meaning. A change can be syntactically compatible but still break a client if the meaning of a field changes.",
      diagram: "Old Client -------------------> API v1\n   |                              |\n   | expects {name, email}        |\n   |                              v\n   |                         compatible change\n   |                              |\n   +------------------------------+\n                                  |\n                         {name, email, avatar?}",
      codeExample: { title: "Example", code: "// Usually compatible:\ntype UserResponse = {\n  id: string;\n  name: string;\n  email: string;\n  avatarUrl?: string; // new optional field\n};" },
      keyTakeaways: [
        "Prefer additive changes when maintaining compatibility.",
        "Preserve existing field meaning.",
        "Consider status codes and error formats part of the contract.",
        "Test representative existing clients before release."
      ],
      commonMistakes: [
        "Renaming a field and assuming clients will adapt automatically.",
        "Changing a nullable field into a required field without migration.",
        "Changing the meaning of an existing enum value."
      ],
      quiz: [
    {
      question: "Which change is generally safer for an existing client?",
      options: ["Adding an optional field", "Removing a required field", "Renaming an existing field", "Changing an enum meaning"],
      correctIndex: 0,
      explanation: "Additive optional fields usually preserve old clients."
    }
  ]
    },
    {
      id: "breaking-changes-and-change-management",
      title: "Breaking Changes and Change Management",
      durationMinutes: 24,
      explanation: "A breaking change is a change that can cause a previously working client to fail or behave incorrectly. Examples include removing fields, changing field types, changing required request fields, changing authentication requirements, changing pagination semantics, or changing the meaning of status codes.\n\nBreaking changes should be intentional and managed through a migration strategy. Common approaches include introducing a new API version, supporting both contracts temporarily, publishing a deprecation period, and giving consumers a clear migration guide.\n\nA mature API process treats the contract as a product. Before changing it, identify consumers, determine whether the change is actually breaking, communicate the migration path, add compatibility tests, and remove the old behavior only after the announced lifecycle.",
      diagram: "Change proposal\n      |\n      v\nIs it breaking?\n  /          No            Yes\n |             |\nRelease     Version / migrate\n              |\n        Deprecation window\n              |\n        Consumer migration\n              |\n        Remove old contract",
      codeExample: { title: "Example", code: "// Avoid silently changing this:\ntype OldResponse = {\n  total: number;\n};\n\n// to:\ntype NewResponse = {\n  total: string; // breaking for numeric consumers\n};\n\n// Prefer a new field or explicit versioned contract.\ntype CompatibleResponse = {\n  total: number;\n  totalFormatted?: string;\n};" },
      keyTakeaways: [
        "Classify changes before release.",
        "Use versioning or migration periods for intentional breaking changes.",
        "Document what clients must change.",
        "Remove deprecated behavior only after the migration lifecycle."
      ],
      commonMistakes: [
        "Calling every change a breaking change.",
        "Removing an endpoint immediately because a replacement exists.",
        "Ignoring mobile clients or long-lived integrations."
      ],
      quiz: [
    {
      question: "Which is a breaking change?",
      options: ["Removing a supported response field", "Adding an optional response field", "Adding documentation", "Adding a new unrelated endpoint"],
      correctIndex: 0,
      explanation: "Removing a field a client relies on can break it."
    }
  ]
    }
  ],
  finalQuiz: [
    {
      question: "What should a public API contract describe?",
      options: ["Requests, responses, behavior, and errors", "Only database columns", "Only controller names", "Only server CPU"],
      correctIndex: 0,
      explanation: "Consumers need a stable description of observable API behavior."
    },
    {
      question: "Why use response DTOs?",
      options: ["To control the public shape and avoid exposing internal fields", "To replace authentication", "To create database indexes", "To enable CSS"],
      correctIndex: 0,
      explanation: "Response DTOs provide an explicit public boundary."
    },
    {
      question: "Which is usually backward-compatible?",
      options: ["Adding an optional response field", "Removing a required field", "Changing a number to an object", "Changing authentication requirements"],
      correctIndex: 0,
      explanation: "Optional additive changes are usually safer."
    },
    {
      question: "What is a breaking change?",
      options: ["A change that can make an existing client fail or behave incorrectly", "Any code refactor", "Adding a log line", "Changing an internal variable"],
      correctIndex: 0,
      explanation: "Breaking changes affect consumer-visible behavior."
    },
    {
      question: "Should database schema and API schema always be identical?",
      options: ["No", "Yes", "Only in production", "Only with PostgreSQL"],
      correctIndex: 0,
      explanation: "The API is a separate contract and should not be coupled unnecessarily to storage."
    },
    {
      question: "Why have a deprecation period?",
      options: ["To give consumers time to migrate", "To hide bugs", "To disable monitoring", "To increase database size"],
      correctIndex: 0,
      explanation: "Deprecation gives clients a planned migration window."
    },
    {
      question: "Which can be a breaking change even if JSON still parses?",
      options: ["Changing the meaning of an existing field", "Adding documentation", "Adding an optional field", "Adding a health endpoint"],
      correctIndex: 0,
      explanation: "Semantic changes can break consumers even when syntax remains valid."
    }
  ],
  project: {
    name: "Stable Orders API",
    goal: "Design and implement a contract-first NestJS Orders API that separates public resources from persistence models and handles compatibility deliberately.",
    brief: "Build an Orders API with explicit request/response DTOs, predictable errors, resource boundaries, compatibility tests, and a documented change policy.",
    steps: [
      "Define Order, OrderItem, and Customer as business resources rather than exposing ORM entities.",
      "Create request DTOs and response DTOs with validation and explicit serialization.",
      "Define success, validation, authentication, authorization, not-found, and conflict responses.",
      "Create contract tests for the current API behavior.",
      "Introduce an additive optional field and prove existing contract tests still pass.",
      "Design one intentionally breaking change and document a versioned migration path.",
      "Add a deprecation policy describing announcement, migration, monitoring, and removal stages."
    ],
    acceptance: [
      "Controllers never return raw persistence entities.",
      "Request and response contracts are explicit and tested.",
      "An additive change remains compatible with existing contract tests.",
      "The breaking change has a documented migration strategy.",
      "Errors have stable status codes and machine-readable shapes."
    ],
    stretch: [
      "Generate OpenAPI from the contract and use it in CI to detect unintended changes.",
      "Create consumer-driven contract tests.",
      "Add a compatibility checker to the CI pipeline.",
      "Track deprecated endpoint usage with metrics."
    ]
  }
};
