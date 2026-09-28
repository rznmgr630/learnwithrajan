import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_19_LESSONS: LessonDay = {
  day: 19,
  title: "Route Handlers",
  totalMinutes: 76,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "nextjs-day19-route-handlers",
      title: "route.ts and HTTP Request/Response",
      durationMinutes: 17,
      explanation: `
Route Handlers are Next.js server-side request handlers defined using a special \`route.ts\` file. They let you expose HTTP endpoints from your Next.js application.

For example:

\`\`\`text
app/
└── api/
    └── users/
        └── route.ts
\`\`\`

can define an endpoint at:

\`\`\`text
/api/users
\`\`\`

A route handler receives a Web Request-compatible object and returns a Response.

A minimal handler is:

\`\`\`ts
// app/api/hello/route.ts

export async function GET() {
  return Response.json({
    message: "Hello from Next.js",
  });
}
\`\`\`

This is useful when another application, a mobile app, a browser client, a webhook provider, or another service needs an HTTP API.

### Route Handlers vs Server Actions

Server Actions are convenient for mutations initiated by your React application. Route Handlers are explicit HTTP endpoints.

Use a Route Handler when you need an endpoint such as:

\`\`\`text
GET /api/products
POST /api/products
DELETE /api/products/123
\`\`\`

Use a Server Action when the operation is primarily an internal server mutation connected directly to your application UI.

Both can eventually call the same service layer.
`,
      diagram: `
HTTP Request
     |
     v
app/api/users/route.ts
     |
     +--> GET
     +--> POST
     +--> PATCH
     +--> DELETE
     |
     v
Service / Database
     |
     v
HTTP Response
`,
      codeExample: {
        title: "A basic GET Route Handler",
        code: `// app/api/users/route.ts

export async function GET() {
  const users = [
    { id: 1, name: "Rajan" },
    { id: 2, name: "Alex" },
  ];

  return Response.json(users);
}`,
      },
      keyTakeaways: [
        "route.ts defines a Route Handler.",
        "Route Handlers expose HTTP endpoints from a Next.js application.",
        "Handlers can implement HTTP methods such as GET, POST, PUT, PATCH, and DELETE.",
        "Route Handlers return HTTP responses.",
        "Route Handlers are useful when an explicit HTTP API is required.",
      ],
      commonMistakes: [
        "Confusing route.ts with page.tsx.",
        "Putting UI markup inside a Route Handler.",
        "Treating Route Handlers as the only possible way to perform mutations in Next.js.",
        "Skipping validation because the endpoint is internal.",
      ],
      quiz: [
        {
          question: "Which file defines a Route Handler?",
          options: ["page.tsx", "layout.tsx", "route.ts", "server.tsx"],
          correctIndex: 2,
          explanation: "route.ts is the special file used for Route Handlers.",
        },
      ],
    },
    {
      id: "nextjs-day19-http-methods",
      title: "GET, POST, PUT, PATCH, and DELETE",
      durationMinutes: 18,
      explanation: `
HTTP methods communicate the intended operation of a request. A REST-style API commonly uses GET to retrieve data, POST to create resources, PUT or PATCH to update resources, and DELETE to remove resources.

A basic API might look like:

\`\`\`text
GET    /api/users       -> list users
POST   /api/users       -> create a user
GET    /api/users/123   -> get user 123
PATCH  /api/users/123   -> partially update user 123
DELETE /api/users/123   -> delete user 123
\`\`\`

In a Route Handler, each method is represented by an exported function:

\`\`\`ts
export async function GET() {
  return Response.json({ users: [] });
}

export async function POST(request: Request) {
  const body = await request.json();

  return Response.json(
    { user: body },
    { status: 201 }
  );
}
\`\`\`

### PUT vs PATCH

PUT is commonly used to replace a resource representation, while PATCH is commonly used for partial updates. Exact API semantics should be documented and applied consistently.

For example:

\`\`\`text
PUT /api/users/123
{
  "name": "Rajan",
  "email": "rajan@example.com"
}
\`\`\`

can represent a complete replacement.

Whereas:

\`\`\`text
PATCH /api/users/123
{
  "name": "Rajan"
}
\`\`\`

can represent a partial update.

### DELETE

A DELETE handler might be:

\`\`\`ts
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Delete resource.

  return new Response(null, { status: 204 });
}
\`\`\`

The important lesson is not memorizing every HTTP rule. It is learning to design predictable endpoints whose method and URL communicate what the endpoint does.
`,
      diagram: `
/api/users

GET     -> Read collection
POST    -> Create resource

/api/users/123

GET     -> Read resource
PUT     -> Replace resource
PATCH   -> Partially update
DELETE  -> Delete resource
`,
      codeExample: {
        title: "Multiple HTTP methods",
        code: `// app/api/users/route.ts

export async function GET() {
  return Response.json({
    users: [],
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  return Response.json(
    {
      user: body,
    },
    { status: 201 }
  );
}`,
      },
      keyTakeaways: [
        "HTTP methods communicate the intended operation.",
        "GET commonly reads data.",
        "POST commonly creates a resource or triggers a non-idempotent operation.",
        "PUT and PATCH commonly update resources with different semantics.",
        "DELETE commonly removes a resource.",
      ],
      commonMistakes: [
        "Using POST for every operation without considering API semantics.",
        "Mixing PUT and PATCH semantics inconsistently.",
        "Returning the wrong status code for a successful creation or deletion.",
      ],
      quiz: [
        {
          question: "Which method commonly creates a resource?",
          options: ["GET", "POST", "DELETE", "OPTIONS"],
          correctIndex: 1,
          explanation: "POST is commonly used to create resources.",
        },
        {
          question: "Which method commonly represents a partial update?",
          options: ["PATCH", "GET", "HEAD", "TRACE"],
          correctIndex: 0,
          explanation: "PATCH is commonly used for partial updates.",
        },
      ],
    },
    {
      id: "nextjs-day19-request-response-headers-cookies",
      title: "Request, Response, Headers, and Cookies",
      durationMinutes: 17,
      explanation: `
Route Handlers can inspect request information and construct responses. The Request object contains information such as the HTTP method, URL, headers, and body.

For example:

\`\`\`ts
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type");
  const body = await request.json();

  return Response.json({
    contentType,
    body,
  });
}
\`\`\`

### Query parameters

A URL such as:

\`\`\`text
/api/users?page=2&search=rajan
\`\`\`

contains query parameters. You can read them from the request URL:

\`\`\`ts
export async function GET(request: Request) {
  const url = new URL(request.url);

  const page = url.searchParams.get("page");
  const search = url.searchParams.get("search");

  return Response.json({ page, search });
}
\`\`\`

### Headers

Headers carry metadata about a request or response. Examples include Content-Type, Authorization, caching directives, and custom application headers.

Do not blindly trust headers supplied by clients. Authentication and authorization must use a trusted authentication mechanism and server-side checks.

### Cookies

Cookies are small pieces of data associated with HTTP requests. They are commonly used for sessions and other browser state.

In Next.js server-side code, the cookies API can be used to inspect or manipulate cookies where supported:

\`\`\`ts
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  return Response.json({
    authenticated: Boolean(session),
  });
}
\`\`\`

Security-sensitive cookies should generally use appropriate attributes such as HttpOnly, Secure, and SameSite according to the application's requirements.
`,
      diagram: `
Request
 |
 +--> URL / Query
 +--> Headers
 +--> Cookies
 +--> Body
 |
 v
Route Handler
 |
 v
Response
 |
 +--> Status
 +--> Headers
 +--> Cookies
 +--> Body
`,
      codeExample: {
        title: "Reading query parameters and headers",
        code: `export async function GET(request: Request) {
  const url = new URL(request.url);

  const page = url.searchParams.get("page") ?? "1";
  const authorization =
    request.headers.get("authorization");

  return Response.json({
    page,
    hasAuthorizationHeader: Boolean(authorization),
  });
}`,
      },
      keyTakeaways: [
        "Request contains URL, headers, and body information.",
        "Query parameters are useful for filtering, searching, and pagination.",
        "Headers carry request and response metadata.",
        "Cookies can support sessions and browser state.",
        "Security-sensitive cookies require appropriate security attributes.",
      ],
      commonMistakes: [
        "Putting secrets into query parameters.",
        "Trusting arbitrary client headers as proof of identity.",
        "Storing sensitive session information in insecure cookies.",
        "Forgetting to validate query parameter values.",
      ],
      quiz: [
        {
          question: "Where can query parameters be read from?",
          options: ["request.url", "request.css", "request.database", "request.component"],
          correctIndex: 0,
          explanation:
            "The request URL contains the query string, which can be parsed using URL and searchParams.",
        },
      ],
    },
    {
      id: "nextjs-day19-status-errors",
      title: "Status Codes and API Error Responses",
      durationMinutes: 14,
      explanation: `
HTTP status codes tell the client what happened with the request. A production API should use status codes consistently.

Common groups include:

\`\`\`text
2xx -> Success
3xx -> Redirection
4xx -> Client/request problem
5xx -> Server-side failure
\`\`\`

Examples:

- 200 OK: successful request.
- 201 Created: resource was successfully created.
- 204 No Content: successful request with no response body.
- 400 Bad Request: request is invalid.
- 401 Unauthorized: authentication is required or invalid.
- 403 Forbidden: the caller is authenticated but not permitted.
- 404 Not Found: resource does not exist.
- 409 Conflict: request conflicts with current resource state.
- 422 Unprocessable Content: commonly used for semantic validation failures, depending on API conventions.
- 429 Too Many Requests: rate limit exceeded.
- 500 Internal Server Error: unexpected server-side failure.

For example:

\`\`\`ts
return Response.json(
  { error: "User not found" },
  { status: 404 }
);
\`\`\`

A consistent error format makes API clients easier to build.

For example:

\`\`\`json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User was not found."
  }
}
\`\`\`

Do not return internal stack traces, database credentials, SQL statements, or private implementation details.
`,
      diagram: `
Request
  |
  v
Route Handler
  |
  +--> Success ----> 2xx
  |
  +--> Client issue -> 4xx
  |
  +--> Server issue -> 5xx
`,
      codeExample: {
        title: "Consistent error response",
        code: `return Response.json(
  {
    error: {
      code: "USER_NOT_FOUND",
      message: "User was not found.",
    },
  },
  {
    status: 404,
  }
);`,
      },
      keyTakeaways: [
        "Status codes communicate the outcome of an HTTP request.",
        "Use 2xx for successful operations and appropriate 4xx/5xx codes for failures.",
        "A consistent JSON error format makes APIs easier to consume.",
        "Never expose internal implementation details in public error responses.",
      ],
      commonMistakes: [
        "Returning 200 for every error.",
        "Using 401 and 403 interchangeably without understanding authentication vs permission.",
        "Returning raw exceptions to clients.",
      ],
      quiz: [
        {
          question: "Which status code commonly represents resource creation?",
          options: ["200", "201", "404", "500"],
          correctIndex: 1,
          explanation: "201 Created is commonly used after successful resource creation.",
        },
        {
          question: "Which status code commonly represents too many requests?",
          options: ["301", "400", "429", "503"],
          correctIndex: 2,
          explanation: "429 Too Many Requests indicates that a rate limit has been exceeded.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "Which file defines a Next.js Route Handler?",
      options: ["page.tsx", "route.ts", "layout.tsx", "api.tsx"],
      correctIndex: 1,
      explanation: "route.ts defines Route Handlers.",
    },
    {
      question: "Which HTTP method commonly retrieves data?",
      options: ["GET", "POST", "PATCH", "DELETE"],
      correctIndex: 0,
      explanation: "GET commonly retrieves data.",
    },
    {
      question: "Which status code commonly means Not Found?",
      options: ["201", "204", "404", "500"],
      correctIndex: 2,
      explanation: "404 indicates that the requested resource was not found.",
    },
    {
      question: "What is a query parameter useful for?",
      options: [
        "Filtering or pagination",
        "Replacing a database",
        "Creating CSS",
        "Changing TypeScript",
      ],
      correctIndex: 0,
      explanation:
        "Query parameters are commonly used for filtering, searching, sorting, and pagination.",
    },
  ],

  project: {
    name: "REST API with Route Handlers",
    goal: "Build a small HTTP API inside Next.js using Route Handlers and consistent request/response conventions.",
    brief: `
Create an API for users. Implement collection and individual-resource operations using Route Handlers.

Use HTTP methods consistently, validate request bodies, return appropriate status codes, and use a consistent error response format. Keep database access behind a service or repository layer rather than placing all application logic directly inside route.ts.
`,
    steps: [
      "Create app/api/users/route.ts.",
      "Implement GET /api/users.",
      "Implement POST /api/users.",
      "Create a dynamic user route for /api/users/[id].",
      "Implement GET /api/users/[id].",
      "Implement PATCH /api/users/[id].",
      "Implement DELETE /api/users/[id].",
      "Parse JSON request bodies.",
      "Validate request data.",
      "Return appropriate HTTP status codes.",
      "Add consistent error response objects.",
      "Read query parameters for pagination or filtering.",
    ],
    acceptance: [
      "The API exposes GET and POST for /api/users.",
      "Individual users support GET, PATCH, and DELETE.",
      "Invalid request bodies return a 4xx response.",
      "Missing users return 404.",
      "Successful creation returns 201.",
      "Successful deletion can return 204.",
      "API errors use a consistent structure.",
      "No internal stack traces or secrets are exposed.",
    ],
    stretch: [
      "Add authentication.",
      "Add request logging.",
      "Add ETag or caching concepts.",
      "Add cursor-based pagination.",
      "Add API documentation with OpenAPI.",
    ],
  },
};
