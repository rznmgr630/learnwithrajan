import type { LessonDay } from "@/lib/learn/lesson-types";

export const API_VERSIONING_DAY_49_LESSONS: LessonDay = {
  day: 49,
  title: "API Versioning",
  totalMinutes: 100,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-49-lesson-1",
      title: "URI Versioning",
      durationMinutes: 22,
      explanation: "URI versioning places the API version in the path, such as /v1/orders and /v2/orders. It is easy to understand, easy to route, and visible in logs and documentation.\n\nNestJS supports URI versioning through VersioningType.URI. Controllers or routes can then be associated with a version. URI versioning is operationally straightforward, but it means the version becomes part of the visible resource URL.\n\nA version should represent a meaningful contract boundary, not every small feature. Avoid creating v2 merely because an optional field was added.",
      diagram: "GET /v1/orders\n       |\n       v\nVersion 1 contract\n\nGET /v2/orders\n       |\n       v\nVersion 2 contract\n\nSame business domain,\ndifferent public contract",
      codeExample: { title: "Example", code: "app.enableVersioning({\n  type: VersioningType.URI,\n});\n\n@Controller({\n  path: \"orders\",\n  version: \"1\",\n})\nexport class OrdersV1Controller {}" },
      keyTakeaways: [
        "URI versioning is explicit and easy for consumers.",
        "Version at meaningful contract boundaries.",
        "Keep business logic shared where possible.",
        "Avoid versioning every minor additive change."
      ],
      commonMistakes: [
        "Duplicating the entire application for every version.",
        "Putting unrelated business changes into a version bump.",
        "Removing v1 immediately after v2 launches."
      ],
      quiz: [
    {
      question: "Where does URI versioning place the version?",
      options: ["In the URL path", "In the password", "In the database primary key", "In the CSS"],
      correctIndex: 0,
      explanation: "URI versioning exposes the version in the request path."
    }
  ]
    },
    {
      id: "day-49-lesson-2",
      title: "Header and Media Type Versioning",
      durationMinutes: 22,
      explanation: "Header versioning keeps the resource URL stable while the client selects a contract using a custom header. Media type versioning uses the Accept header, for example application/vnd.example.orders.v2+json.\n\nThese approaches can produce cleaner resource URLs and can be useful for APIs with sophisticated content negotiation. Their downside is discoverability: a developer looking only at the URL may not know which version is being requested.\n\nVersion negotiation must be deterministic and documented. The server should define a default policy, supported versions, and behavior for unsupported versions.",
      diagram: "URL:\nGET /orders\n\nHeader:\nX-API-Version: 2\n\nor\n\nAccept:\napplication/vnd.example.orders.v2+json\n\n        |\n        v\nVersion resolver\n        |\n        v\nSelected contract",
      codeExample: { title: "Example", code: "// Conceptual header versioning\napp.enableVersioning({\n  type: VersioningType.HEADER,\n  header: \"X-API-Version\",\n});" },
      keyTakeaways: [
        "Header versioning keeps URLs stable.",
        "Media type versioning uses HTTP content negotiation concepts.",
        "Document version selection clearly.",
        "Return a predictable response for unsupported versions."
      ],
      commonMistakes: [
        "Using multiple version-selection mechanisms without precedence rules.",
        "Making a hidden default version change unexpectedly.",
        "Forgetting that caches may need to vary by version header."
      ],
      quiz: [
    {
      question: "What is a downside of header versioning?",
      options: ["The version is less visible from the URL", "It cannot return JSON", "It disables HTTPS", "It prevents authentication"],
      correctIndex: 0,
      explanation: "Consumers need to inspect headers to understand the selected contract."
    }
  ]
    },
    {
      id: "day-49-lesson-3",
      title: "Deprecation and Migration",
      durationMinutes: 28,
      explanation: "Versioning is only useful when paired with a lifecycle. A deprecated API should have a documented replacement, migration instructions, a timeline or policy, and monitoring that shows whether clients still use it.\n\nDeprecation does not necessarily mean immediate removal. A mature migration might introduce v2, keep v1 running, publish the differences, notify consumers, monitor v1 traffic, and eventually remove v1 according to a communicated policy.\n\nThe API team should measure real usage before removal. Internal clients, mobile applications, third-party integrations, and scheduled jobs may all have different release cycles.",
      diagram: "v1 active\n  |\n  v\nv2 released\n  |\n  v\nv1 deprecated\n  |\n  +--> migration docs\n  +--> consumer notices\n  +--> usage monitoring\n  |\n  v\nv1 sunset\n  |\n  v\nv1 removed",
      codeExample: { title: "Example", code: "// Example response metadata pattern\n{\n  \"data\": { \"...\": \"...\" },\n  \"meta\": {\n    \"apiVersion\": \"1\"\n  }\n}\n\n// Deprecation policy belongs in documentation\n// and, where appropriate, HTTP response headers/metadata." },
      keyTakeaways: [
        "Deprecation is a lifecycle, not just a label.",
        "Provide migration documentation before removal.",
        "Monitor actual old-version usage.",
        "Give consumers a predictable sunset policy."
      ],
      commonMistakes: [
        "Announcing deprecation without measuring usage.",
        "Removing a version because internal clients migrated while external clients did not.",
        "Changing v1 behavior during its migration window without documentation."
      ],
      quiz: [
    {
      question: "Why monitor deprecated API usage?",
      options: ["To know which consumers still need migration", "To increase response size", "To disable v2", "To avoid documentation"],
      correctIndex: 0,
      explanation: "Usage data informs a safe removal decision."
    }
  ]
    },
    {
      id: "day-49-lesson-4",
      title: "Versioning in NestJS",
      durationMinutes: 20,
      explanation: "NestJS provides framework-level versioning support, but application architecture still determines whether versioning remains maintainable. Controllers can differ by version while shared services contain common business logic.\n\nA useful pattern is to keep version-specific mapping at the API boundary. V1 may map the same domain object to an older response DTO while V2 maps it to a newer contract. This avoids duplicating core business rules.\n\nVersion-specific behavior should be covered by contract tests. Tests should prove both versions continue to meet their documented schemas during the overlap period.",
      diagram: "              Domain Service\n              /                        /             OrdersV1Controller      OrdersV2Controller\n       |                       |\n V1 Response DTO         V2 Response DTO\n       |                       |\n       +------ HTTP API -------+",
      codeExample: { title: "Example", code: "@Controller({ path: \"orders\", version: \"1\" })\nexport class OrdersV1Controller {\n  constructor(private readonly service: OrdersService) {}\n\n  @Get()\n  list() {\n    return this.service.listForV1();\n  }\n}\n\n@Controller({ path: \"orders\", version: \"2\" })\nexport class OrdersV2Controller {\n  constructor(private readonly service: OrdersService) {}\n\n  @Get()\n  list() {\n    return this.service.listForV2();\n  }\n}" },
      keyTakeaways: [
        "Keep version-specific mapping near the API boundary.",
        "Share domain/application logic where semantics are the same.",
        "Test every supported version independently.",
        "Define a clear removal lifecycle."
      ],
      commonMistakes: [
        "Copying business logic into v1 and v2 controllers.",
        "Assuming framework versioning automatically solves migration.",
        "Removing tests for older versions during the deprecation period."
      ],
      quiz: [
    {
      question: "Where should version-specific response mapping usually live?",
      options: ["At the API boundary", "Inside database triggers", "Inside CSS", "Inside password hashing"],
      correctIndex: 0,
      explanation: "The API boundary is where public contract differences belong."
    }
  ]
    }
  ],
  finalQuiz: [
    {
      question: "What does URI versioning look like?",
      options: ["/v1/orders", "/orders/password", "/database/v1", "/api.css"],
      correctIndex: 0,
      explanation: "The version appears in the URL path."
    },
    {
      question: "What is header versioning?",
      options: ["Selecting an API contract using a request header", "Changing database headers", "Encrypting JSON", "Versioning passwords"],
      correctIndex: 0,
      explanation: "A header communicates the desired API version."
    },
    {
      question: "What does media type versioning use?",
      options: ["Content negotiation such as Accept media types", "Database IDs", "Cookies only", "SQL comments"],
      correctIndex: 0,
      explanation: "Media type versioning uses HTTP content negotiation."
    },
    {
      question: "Should every additive change create a new API version?",
      options: ["No", "Yes", "Only on Tuesdays", "Only for GET"],
      correctIndex: 0,
      explanation: "Minor compatible additions do not normally require a new version."
    },
    {
      question: "What should happen during deprecation?",
      options: ["Consumers get a migration path and the old version remains according to a defined policy", "The old version immediately disappears", "Authentication is disabled", "All logs are deleted"],
      correctIndex: 0,
      explanation: "Deprecation is a managed migration lifecycle."
    },
    {
      question: "Why keep version-specific mapping near controllers?",
      options: ["It isolates public contract differences from shared business logic", "It makes SQL faster", "It hashes passwords", "It replaces tests"],
      correctIndex: 0,
      explanation: "Boundary mapping reduces duplication."
    },
    {
      question: "Why monitor v1 traffic?",
      options: ["To identify consumers before removing v1", "To make v2 slower", "To change TLS", "To disable pagination"],
      correctIndex: 0,
      explanation: "Usage data supports a safe sunset decision."
    }
  ],
  project: {
    name: "Versioned Orders API",
    goal: "Implement two API contract versions in NestJS with shared business logic, version-specific DTOs, and a complete deprecation lifecycle.",
    brief: "Expose an Orders API as v1 and v2. v2 changes a response contract intentionally while shared services continue to provide the underlying business behavior.",
    steps: [
      "Define the v1 and v2 response contracts.",
      "Enable NestJS API versioning using URI, header, or media type strategy and document the choice.",
      "Create version-specific controllers or adapters.",
      "Keep domain/application logic shared where semantics are unchanged.",
      "Add contract tests for both versions.",
      "Publish migration documentation showing field changes and examples.",
      "Add deprecation metadata/documentation and usage metrics for v1.",
      "Define a sunset checklist for eventual v1 removal."
    ],
    acceptance: [
      "Both v1 and v2 are independently documented and tested.",
      "Version-specific DTO mapping does not duplicate core business logic.",
      "Clients can identify which version they are calling.",
      "Deprecated v1 usage is measurable.",
      "The migration path from v1 to v2 is explicit."
    ],
    stretch: [
      "Support two versioning strategies in separate environments and compare operational tradeoffs.",
      "Add automated schema-diff checks.",
      "Emit deprecation headers where appropriate.",
      "Create a consumer migration dashboard."
    ]
  }
};
