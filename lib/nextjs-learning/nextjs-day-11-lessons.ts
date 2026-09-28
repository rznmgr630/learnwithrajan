import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_11_LESSONS: LessonDay = {
  day: 11,
  title: "Fetching Data",
  totalMinutes: 82,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "fetch-and-server-side-fetching",
      title: "fetch and server-side data fetching",
      durationMinutes: 18,
      explanation: `
Data fetching means getting the information your UI needs from an API, database, file, or another service.

In Next.js App Router applications, Server Components are a natural place to fetch data that does not require browser interaction. A Server Component can call \`fetch\`, wait for the response, transform the result, and render the data without sending the fetching logic to the browser.

The standard \`fetch\` API uses a URL and optional configuration. You should check the response before assuming that the request succeeded. A response with a 404 or 500 status is still a completed HTTP request, so calling \`response.json()\` without checking \`response.ok\` can hide the real problem.

### Server-side fetching

Server-side fetching is useful when:
- the data is needed to render the initial page;
- the API requires a secret key;
- the request should stay away from the browser;
- the result can be fetched before rendering the component.

Keeping secret credentials on the server is especially important. Never put a private API key directly inside a Client Component.

### Data ownership

A useful rule is: fetch data as close as practical to the Server Component that owns the UI for that data. This avoids passing large amounts of unrelated data through several component layers.

You should still create reusable data-access functions when several parts of the application need the same business operation.
      `,
      diagram: `
Browser
  |
  | Request page
  v
Next.js Server
  |
  +--> Server Component
          |
          +--> fetch()
          |
          v
       External API
          |
          v
       JSON data
          |
          v
       Render UI
          |
          v
       HTML / RSC response
      `,
      codeExample: {
        title: "Fetching API data in a Server Component",
        code: `type Product = {
  id: number;
  title: string;
  price: number;
};

async function getProducts(): Promise<Product[]> {
  const response = await fetch("https://api.example.com/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main>
      <h1>Products</h1>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.title} - \${product.price}
          </li>
        ))}
      </ul>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "Server Components can fetch data directly on the server.",
        "Always check HTTP responses before treating them as successful.",
        "Server-side fetching is useful for secret credentials and initial page data.",
        "Keep data fetching close to the component that owns the data when practical.",
      ],
      commonMistakes: [
        "Putting private API keys in browser-side code.",
        "Assuming fetch throws automatically for every HTTP 4xx or 5xx response.",
        "Fetching all application data in the top-level page even when smaller components own the data.",
      ],
      quiz: [
        {
          question: "What should you normally check after calling fetch?",
          options: [
            "Only whether the URL is a string",
            "response.ok or the response status",
            "Whether the browser has JavaScript enabled",
            "Whether the component has useState",
          ],
          correctIndex: 1,
          explanation:
            "fetch resolves with a Response even for many HTTP error statuses, so the response should be checked.",
        },
      ],
    },

    {
      id: "client-fetching-and-request-inputs",
      title: "Client-side fetching, route parameters, and query parameters",
      durationMinutes: 18,
      explanation: `
Client-side fetching means requesting data from the browser after the page has loaded or after the user performs an interaction. It is useful when data depends on browser state, filters, search input, polling, or an interaction that should update without replacing the whole page.

A Client Component can use browser APIs and React state to control when a request happens. For larger applications, a dedicated client data-fetching library can also provide caching, retries, deduplication, and loading-state management.

### Route parameters

Route parameters come from dynamic route segments.

For example:

\`app/products/[id]/page.tsx\`

can receive a URL such as:

\`/products/42\`

where \`id\` is \`42\`.

Route parameters are normally used to identify a resource.

### Query parameters

Query parameters come after the \`?\` in a URL.

Example:

\`/products?category=books&page=2\`

Here, \`category\` and \`page\` are query parameters.

Query parameters are useful for filters, search terms, sorting, pagination, and other optional URL state.

### Choosing between them

Use a route parameter when the value identifies the route's resource. Use query parameters when the value modifies how that resource or collection should be displayed.

For example:

\`/products/42\` identifies product 42.

\`/products?category=books&sort=price\` describes how the product collection should be filtered and sorted.
      `,
      diagram: `
URL
 |
 +--> /products/42
 |       |
 |       +--> route parameter: id = "42"
 |
 +--> /products?category=books&page=2
         |
         +--> query parameter: category = "books"
         +--> query parameter: page = "2"
      `,
      codeExample: {
        title: "Reading route and query parameters",
        code: `// app/products/[id]/page.tsx

type ProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    review?: string;
  }>;
};

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { id } = await params;
  const { review } = await searchParams;

  return (
    <main>
      <h1>Product {id}</h1>
      <p>Review filter: {review ?? "all"}</p>
    </main>
  );
}

// Example URL:
// /products/42?review=recent`,
      },
      keyTakeaways: [
        "Client-side fetching is useful for interactive browser-driven data.",
        "Dynamic route segments identify resources such as products or users.",
        "Query parameters are useful for filters, search, sorting, and pagination.",
        "URL state can be shared, bookmarked, and navigated directly.",
      ],
      commonMistakes: [
        "Using query parameters for a value that is actually the identity of a resource.",
        "Reading route parameters as numbers without validating or converting them.",
        "Trusting query-string values as safe business input without validation.",
      ],
      quiz: [
        {
          question: "Which URL best represents a resource identified by a dynamic route?",
          options: [
            "/products?product=42",
            "/products/42",
            "/products?sort=42",
            "/products?page=42",
          ],
          correctIndex: 1,
          explanation:
            "The dynamic segment [id] naturally represents a specific product resource.",
        },
      ],
    },

    {
      id: "headers-and-request-context",
      title: "Request headers and request context",
      durationMinutes: 14,
      explanation: `
HTTP headers carry metadata about a request or response. Examples include authentication information, accepted content types, user-agent information, language preferences, and tracing identifiers.

In Next.js, server-side code can read request headers when the application needs request-specific information. This is different from reading ordinary component props: headers come from the HTTP request itself.

### Why headers matter

A request header can influence how a server responds. For example, an authentication layer may inspect an authorization header or a session mechanism may identify the current user.

Headers should be treated as untrusted input. A client can often control many headers, so they must not automatically be considered proof that a user has permission to perform an action.

### Request-specific rendering

When UI output depends on request-specific information, that can affect the rendering and caching strategy. Always consider whether the data is safe to reuse across different users.

For example, rendering "Welcome, Rajan" from a user-specific session should not accidentally become shared cached output for every visitor.

### Headers are not business authorization

Reading a header is only the beginning. The application still needs authentication and authorization logic. Authentication answers "who is this?" Authorization answers "is this user allowed to do this?"
      `,
      diagram: `
HTTP Request
 |
 +--> URL
 |
 +--> Query parameters
 |
 +--> Route parameters
 |
 +--> Headers
 |      |
 |      +--> Authorization
 |      +--> Accept
 |      +--> User-Agent
 |      +--> Trace ID
 |
 v
Next.js Server
 |
 +--> validate input
 +--> authenticate
 +--> authorize
 +--> fetch data
      `,
      codeExample: {
        title: "Reading request headers on the server",
        code: `import { headers } from "next/headers";

export default async function AccountPage() {
  const requestHeaders = await headers();

  const userAgent = requestHeaders.get("user-agent");
  const requestId = requestHeaders.get("x-request-id");

  return (
    <main>
      <h1>Account</h1>
      <p>User agent: {userAgent ?? "unknown"}</p>
      <p>Request ID: {requestId ?? "none"}</p>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "Headers carry HTTP metadata from the request.",
        "Headers are request input and should be treated as untrusted.",
        "Authentication and authorization are separate concerns.",
        "Request-specific information must be considered when designing caching and rendering.",
      ],
      commonMistakes: [
        "Treating a user-controlled header as proof of authorization.",
        "Ignoring the effect request-specific data can have on caching.",
        "Putting sensitive request data into client-visible HTML unnecessarily.",
      ],
      quiz: [
        {
          question: "Should a custom request header automatically be trusted for authorization?",
          options: [
            "Yes, all headers are trusted.",
            "Only in production.",
            "No, request input must be validated and authorization must be enforced server-side.",
            "Only if the header is named x-user-role.",
          ],
          correctIndex: 2,
          explanation:
            "Headers are input. They should not be treated as proof of permission without trusted server-side authorization.",
        },
      ],
    },

    {
      id: "fetching-error-handling",
      title: "Data-fetching errors and reliable UI states",
      durationMinutes: 16,
      explanation: `
Data fetching can fail for many reasons: a server can return an error, a network connection can fail, data can be malformed, a resource may not exist, or a dependency can be temporarily unavailable.

A production UI should distinguish between different kinds of failure.

### HTTP errors

A 404 usually means the requested resource does not exist. A 401 can indicate missing authentication, while a 403 can indicate that the user is authenticated but not allowed to access the resource. A 500 represents a server-side failure.

Your application should map these conditions to appropriate UI rather than displaying a generic "something happened" message everywhere.

### Throwing and error boundaries

A Server Component can throw when an operation cannot continue. Next.js route-level error boundaries can then provide an error UI for the relevant segment.

For missing resources, use a not-found flow rather than treating every missing record as an unexpected application crash.

### Validate returned data

TypeScript types do not validate JSON at runtime. If an external API returns malformed data, TypeScript cannot protect you after the request has completed.

For external or untrusted data, use runtime validation when the application needs stronger guarantees.

### User experience

A good data-driven page normally has at least these states:

- loading;
- success with data;
- empty result;
- not found;
- unauthorized/forbidden;
- unexpected error.

Thinking about these states before writing the UI makes the application much more reliable.
      `,
      diagram: `
                 Data request
                      |
              +-------+-------+
              |               |
           Success           Failure
              |               |
          +---+---+      +----+-----+
          |       |      |          |
         Data   Empty  Not found  Other error
          |       |      |          |
          v       v      v          v
         UI      Empty  404 UI    Error UI
                  UI
      `,
      codeExample: {
        title: "Handling a failed fetch",
        code: `import { notFound } from "next/navigation";

type Product = {
  id: number;
  title: string;
};

async function getProduct(id: string): Promise<Product> {
  const response = await fetch(
    \`https://api.example.com/products/\${id}\`
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to load product");
  }

  return response.json();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <main>
      <h1>{product.title}</h1>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "Not every failed request should be handled as the same kind of error.",
        "404, authentication failures, authorization failures, and unexpected server errors have different meanings.",
        "Use route error boundaries for unexpected rendering/data errors.",
        "Use a not-found flow for resources that do not exist.",
        "Runtime validation is different from TypeScript compile-time checking.",
      ],
      commonMistakes: [
        "Showing a successful empty state when the API actually failed.",
        "Returning raw backend error details directly to users.",
        "Assuming TypeScript validates JSON received from an external service.",
      ],
      quiz: [
        {
          question: "What should happen when a requested product genuinely does not exist?",
          options: [
            "Pretend the product exists.",
            "Treat it as a successful empty list.",
            "Use a not-found response/UI appropriate to the route.",
            "Expose the database error.",
          ],
          correctIndex: 2,
          explanation:
            "A missing resource should normally have a clear not-found experience.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "Why is server-side fetching useful for private API credentials?",
      options: [
        "The server can keep credentials out of browser code.",
        "Browsers automatically encrypt all JavaScript.",
        "Client Components cannot fetch.",
        "It removes the need for authentication.",
      ],
      correctIndex: 0,
      explanation:
        "Server-side code can use secrets without sending those secrets to the browser.",
    },
    {
      question: "What is a route parameter commonly used for?",
      options: [
        "Identifying a resource in a dynamic route.",
        "Storing CSS.",
        "Replacing HTTP headers.",
        "Storing environment variables.",
      ],
      correctIndex: 0,
      explanation:
        "A dynamic route parameter commonly identifies a resource such as a product or user.",
    },
    {
      question: "What are query parameters especially useful for?",
      options: [
        "Filters, search, sorting, and pagination.",
        "Replacing database tables.",
        "Storing server secrets.",
        "Defining React components.",
      ],
      correctIndex: 0,
      explanation:
        "Query parameters are well suited to optional URL state such as filtering and pagination.",
    },
    {
      question: "What is an important fact about fetch and HTTP errors?",
      options: [
        "fetch always throws for 404 and 500.",
        "fetch normally resolves with a Response, so response.ok/status should be checked.",
        "fetch cannot read JSON.",
        "fetch only works in Client Components.",
      ],
      correctIndex: 1,
      explanation:
        "HTTP error statuses should be explicitly checked.",
    },
    {
      question: "Why should request headers be treated carefully?",
      options: [
        "They are always encrypted.",
        "They are trusted authorization tokens by default.",
        "They are request input and can influence rendering, authentication, and caching.",
        "They cannot contain useful information.",
      ],
      correctIndex: 2,
      explanation:
        "Headers are part of the request context and must be handled as untrusted input unless verified through a trusted mechanism.",
    },
  ],

  project: {
    name: "Product data page",
    goal: "Build a product catalog page that demonstrates server-side fetching, URL parameters, request context, and robust error states.",
    brief:
      "Create a products list, a dynamic product details route, filtering through query parameters, and clear loading, empty, not-found, and error experiences.",
    steps: [
      "Create a products page that fetches product data on the server.",
      "Create a dynamic /products/[id] route.",
      "Read the product ID from route parameters.",
      "Add search or category filtering through query parameters.",
      "Add a request-aware section that demonstrates reading safe request metadata.",
      "Handle 404 responses separately from unexpected API failures.",
      "Add route-level loading and error UI.",
      "Validate the important values before using them in business logic.",
    ],
    acceptance: [
      "The products list is fetched server-side.",
      "The details page uses a dynamic route parameter.",
      "Filtering uses query parameters.",
      "The application distinguishes not-found from unexpected errors.",
      "Loading and error states are visible and understandable.",
    ],
    stretch: [
      "Add client-side search that updates the URL.",
      "Add pagination using query parameters.",
      "Add runtime validation for external API responses.",
    ],
  },
};
