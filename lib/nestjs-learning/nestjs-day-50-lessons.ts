import type { LessonDay } from "@/lib/learn/lesson-types";

export const OPENAPI_SWAGGER_DAY_50_LESSONS: LessonDay = {
  day: 50,
  title: "OpenAPI / Swagger",
  totalMinutes: 115,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-50-lesson-1",
      title: "OpenAPI Fundamentals",
      durationMinutes: 24,
      explanation: "OpenAPI is a machine-readable description of an HTTP API. It can describe paths, parameters, request bodies, responses, schemas, security requirements, examples, and other contract information.\n\nSwagger is commonly used as a tooling ecosystem around OpenAPI. In NestJS, @nestjs/swagger can generate an OpenAPI document from controllers and decorators and can expose an interactive Swagger UI.\n\nOpenAPI is valuable because the same contract can support human documentation, client generation, testing, review, and API governance. It should be treated as part of the API contract rather than an afterthought.",
      diagram: "NestJS Controllers\n      |\n      v\nSwagger decorators\n      |\n      v\nOpenAPI document\n      |\n      +--> Swagger UI\n      +--> Client generation\n      +--> Contract testing\n      +--> API review",
      codeExample: { title: "Example", code: "const config = new DocumentBuilder()\n  .setTitle(\"Orders API\")\n  .setDescription(\"Order management API\")\n  .setVersion(\"1.0\")\n  .build();\n\nconst document = SwaggerModule.createDocument(app, config);\n\nSwaggerModule.setup(\"docs\", app, document);" },
      keyTakeaways: [
        "OpenAPI describes API contracts in a standard format.",
        "Swagger UI provides interactive documentation.",
        "NestJS can generate OpenAPI from decorators and metadata.",
        "The OpenAPI document can support more than documentation."
      ],
      commonMistakes: [
        "Treating Swagger UI as the contract instead of the generated OpenAPI document.",
        "Leaving generated schemas inaccurate because decorators were omitted.",
        "Publishing internal endpoints accidentally."
      ],
      quiz: [
    {
      question: "What is OpenAPI?",
      options: ["A standard format for describing HTTP APIs", "A database engine", "A CSS framework", "A password protocol"],
      correctIndex: 0,
      explanation: "OpenAPI describes HTTP API contracts."
    }
  ]
    },
    {
      id: "day-50-lesson-2",
      title: "OpenAPI Schemas and DTOs",
      durationMinutes: 25,
      explanation: "Schemas describe the structure and constraints of request and response data. In NestJS, DTO classes decorated for validation and Swagger metadata can become reusable OpenAPI schemas.\n\nGood schemas communicate required fields, optional fields, enum values, formats, examples, and nested objects. The goal is not merely to make Swagger render a page; the schema should accurately describe what the server accepts and returns.\n\nResponse schemas deserve the same care as request schemas. If an endpoint returns an envelope such as { data, meta }, document that envelope rather than showing an ambiguous object.",
      diagram: "DTO\n |\n +-- required fields\n +-- optional fields\n +-- enum\n +-- format\n +-- nested DTO\n |\n v\nOpenAPI schema\n |\n v\nClient + docs + tests",
      codeExample: { title: "Example", code: "export class CreateUserDto {\n  @ApiProperty({ example: \"rajan@example.com\" })\n  @IsEmail()\n  email: string;\n\n  @ApiProperty({ example: \"Rajan\" })\n  @IsString()\n  name: string;\n}\n\nexport class UserResponseDto {\n  @ApiProperty()\n  id: string;\n\n  @ApiProperty({ example: \"rajan@example.com\" })\n  email: string;\n}" },
      keyTakeaways: [
        "Schemas should match actual runtime behavior.",
        "Document required versus optional fields.",
        "Use enums and examples where they clarify the contract.",
        "Document response envelopes explicitly."
      ],
      commonMistakes: [
        "Documenting a field as optional while validation requires it.",
        "Using internal entities as public schemas without review.",
        "Forgetting nested response types."
      ],
      quiz: [
    {
      question: "What should an OpenAPI schema communicate?",
      options: ["Structure and constraints of API data", "Only server CPU", "Only database indexes", "Only deployment commands"],
      correctIndex: 0,
      explanation: "Schemas describe the data contract."
    }
  ]
    },
    {
      id: "day-50-lesson-3",
      title: "Responses, Examples, and Errors",
      durationMinutes: 24,
      explanation: "OpenAPI should document success responses and meaningful error responses. Clients need to know what 400, 401, 403, 404, 409, and 422-like application errors mean when those statuses are used.\n\nExamples are particularly useful for complex request bodies, pagination, validation errors, and authentication flows. An example should be realistic but must not contain real secrets or personal data.\n\nA consistent error schema improves client development. For example, every validation error can use a predictable shape containing code, message, and field-level details.",
      diagram: "Endpoint\n  |\n  +--> 200 / 201\n  |       response schema\n  |\n  +--> 400\n  |       validation error\n  |\n  +--> 401\n  |       authentication error\n  |\n  +--> 403\n  |       authorization error\n  |\n  +--> 404 / 409\n          resource/conflict errors",
      codeExample: { title: "Example", code: "export class ApiErrorDto {\n  @ApiProperty({ example: \"VALIDATION_ERROR\" })\n  code: string;\n\n  @ApiProperty({ example: \"Invalid request\" })\n  message: string;\n\n  @ApiProperty({ required: false })\n  details?: Record<string, string[]>;\n}\n\n@ApiResponse({ status: 400, type: ApiErrorDto })\n@ApiResponse({ status: 401, type: ApiErrorDto })\n@ApiResponse({ status: 404, type: ApiErrorDto })\n@Get(\":id\")\nfindOne(@Param(\"id\") id: string) {\n  return this.orders.findOne(id);\n}" },
      keyTakeaways: [
        "Document important success and failure responses.",
        "Use consistent error schemas.",
        "Examples should be realistic but non-sensitive.",
        "Document pagination and authentication errors clearly."
      ],
      commonMistakes: [
        "Documenting only 200 responses.",
        "Putting real tokens or secrets in examples.",
        "Returning different undocumented error shapes from different endpoints."
      ],
      quiz: [
    {
      question: "Why document error responses?",
      options: ["Clients need predictable behavior for failures", "It makes passwords reversible", "It disables authorization", "It replaces tests"],
      correctIndex: 0,
      explanation: "Error contracts are part of API integration."
    }
  ]
    },
    {
      id: "day-50-lesson-4",
      title: "Authentication and Security in OpenAPI",
      durationMinutes: 20,
      explanation: "OpenAPI can describe security schemes such as bearer authentication, API keys, and OAuth 2.0. In NestJS Swagger, a bearer scheme can be added with addBearerAuth and applied with ApiBearerAuth.\n\nSecurity documentation should match actual enforcement. Marking an endpoint as bearer-protected in Swagger does not itself protect the endpoint; guards and authentication middleware must enforce the requirement at runtime.\n\nOAuth 2.0 and OpenID Connect can also be represented in OpenAPI security definitions, but the documented scopes and flows must match the real provider configuration.",
      diagram: "OpenAPI security scheme\n        |\n        +--> bearerAuth\n        |      |\n        |      v\n        |   JWT access token\n        |\n        +--> oauth2\n               |\n          authorization flow\n          + scopes",
      codeExample: { title: "Example", code: "const config = new DocumentBuilder()\n  .addBearerAuth(\n    { type: \"http\", scheme: \"bearer\", bearerFormat: \"JWT\" },\n    \"access-token\",\n  )\n  .build();\n\n@ApiBearerAuth(\"access-token\")\n@Get(\"me\")\ngetMe() {\n  return this.users.me();\n}" },
      keyTakeaways: [
        "OpenAPI security describes requirements; runtime guards enforce them.",
        "Document the actual authentication mechanism.",
        "Document scopes when OAuth is used.",
        "Never place real credentials in Swagger examples."
      ],
      commonMistakes: [
        "Assuming Swagger's security button adds runtime protection.",
        "Documenting JWT while the endpoint actually uses cookies.",
        "Documenting scopes that the server never checks."
      ],
      quiz: [
    {
      question: "What does @ApiBearerAuth do?",
      options: ["Documents a bearer security requirement in OpenAPI", "Automatically authenticates every request", "Hashes passwords", "Creates a database"],
      correctIndex: 0,
      explanation: "It contributes security documentation; runtime guards still enforce access."
    }
  ]
    },
    {
      id: "day-50-lesson-5",
      title: "API Documentation as a Production Artifact",
      durationMinutes: 22,
      explanation: "Good API documentation is more than an automatically generated endpoint list. It should explain authentication, common errors, pagination, filtering, versioning, resource semantics, examples, and migration/deprecation policies.\n\nSwagger UI is useful interactively, but the generated OpenAPI document should also be exportable for CI, client generation, contract review, and external documentation.\n\nFor production systems, decide whether documentation is public, authenticated, or internal-only. Avoid exposing internal admin routes, secrets, environment information, or operational endpoints unintentionally.",
      diagram: "Source code\n   |\n   v\nOpenAPI JSON\n   |\n   +--> Swagger UI\n   +--> external docs\n   +--> SDK generation\n   +--> contract diff\n   +--> CI validation\n\nDocumentation lifecycle\n   = release lifecycle",
      codeExample: { title: "Example", code: "const document = SwaggerModule.createDocument(app, config);\n\n// In CI, the generated OpenAPI document can be exported,\n// diffed against the previous release, and reviewed for\n// unintended breaking changes." },
      keyTakeaways: [
        "Treat API documentation as a release artifact.",
        "Review OpenAPI changes as part of API changes.",
        "Control who can access interactive production documentation.",
        "Use generated contracts for client tooling and compatibility checks."
      ],
      commonMistakes: [
        "Leaving Swagger publicly accessible without considering exposure.",
        "Allowing documentation to drift from runtime behavior.",
        "Skipping schema review because generation is automatic."
      ],
      quiz: [
    {
      question: "What is a useful CI use of OpenAPI?",
      options: ["Detecting contract changes between releases", "Running CSS", "Storing passwords", "Replacing the database"],
      correctIndex: 0,
      explanation: "OpenAPI documents can be diffed and reviewed in CI."
    }
  ]
    }
  ],
  finalQuiz: [
    {
      question: "What does OpenAPI describe?",
      options: ["An HTTP API contract", "A database engine", "A JavaScript runtime", "A password hash"],
      correctIndex: 0,
      explanation: "OpenAPI is a standard description format for APIs."
    },
    {
      question: "What is Swagger UI?",
      options: ["An interactive interface for viewing and trying an OpenAPI-described API", "A database", "An OAuth provider", "A NestJS guard"],
      correctIndex: 0,
      explanation: "Swagger UI renders API documentation interactively."
    },
    {
      question: "Should response DTOs be documented?",
      options: ["Yes", "No", "Only for POST", "Only for admins"],
      correctIndex: 0,
      explanation: "Responses are part of the API contract."
    },
    {
      question: "What should examples avoid?",
      options: ["Real secrets and personal data", "Realistic shapes", "Valid JSON", "Useful field values"],
      correctIndex: 0,
      explanation: "Examples should never leak real credentials or sensitive information."
    },
    {
      question: "Does Swagger security documentation protect an endpoint?",
      options: ["No; runtime guards still enforce authentication", "Yes, automatically", "Only in production", "Only for GET"],
      correctIndex: 0,
      explanation: "OpenAPI documents security requirements; application code enforces them."
    },
    {
      question: "What can OpenAPI support besides documentation?",
      options: ["Client generation, contract testing, and change review", "Password recovery only", "Database replication", "CPU scaling"],
      correctIndex: 0,
      explanation: "Machine-readable contracts can power multiple workflows."
    },
    {
      question: "Why review OpenAPI diffs in CI?",
      options: ["To detect unintended contract changes", "To make SQL faster", "To disable authentication", "To generate CSS"],
      correctIndex: 0,
      explanation: "Contract diffs can reveal accidental breaking changes."
    }
  ],
  project: {
    name: "Production API Documentation Portal",
    goal: "Create a complete OpenAPI/Swagger contract for a versioned NestJS Orders API, including schemas, errors, examples, authentication, pagination, and documentation governance.",
    brief: "Take the Orders API from previous days and produce a production-quality OpenAPI contract that accurately represents its public behavior and can be reviewed in CI.",
    steps: [
      "Configure @nestjs/swagger with title, description, version, servers, and tags.",
      "Document request DTOs, response DTOs, nested schemas, enums, pagination metadata, and consistent error responses.",
      "Add realistic examples for common requests, responses, pagination, validation failures, authentication failures, and conflicts.",
      "Document bearer authentication and relevant OAuth/OIDC scopes where applicable.",
      "Document API versioning and deprecated endpoints.",
      "Configure Swagger UI access according to the environment and avoid exposing internal-only routes unintentionally.",
      "Export the generated OpenAPI document and add a CI contract-diff step.",
      "Review the generated specification for missing schemas, incorrect required fields, undocumented responses, and security mismatches."
    ],
    acceptance: [
      "Every public Orders endpoint has accurate request and response schemas.",
      "Important success and error responses are documented.",
      "Authentication and authorization requirements are visible in the OpenAPI document.",
      "Examples contain no real secrets or sensitive personal information.",
      "Pagination, filtering, sorting, search, and versioning behavior is documented.",
      "The OpenAPI document can be exported and compared between releases."
    ],
    stretch: [
      "Generate a typed client SDK from the OpenAPI document.",
      "Generate contract tests from the specification.",
      "Add automated breaking-change detection to CI.",
      "Publish separate internal and external API documentation.",
      "Add an API changelog generated from OpenAPI release diffs."
    ]
  }
};
