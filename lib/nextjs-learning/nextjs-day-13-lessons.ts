import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_13_LESSONS: LessonDay = {
  day: 13,
  title: "Data Fetching Patterns",
  totalMinutes: 84,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "parallel-and-sequential-fetching",
      title: "Parallel, sequential, and dependent requests",
      durationMinutes: 18,
      explanation: `
Data fetching becomes slower when independent operations wait for each other unnecessarily. The first important skill is recognizing whether requests are independent or dependent.

### Parallel fetching

If a dashboard needs products, categories, and recommendations and none of those requests depends on another, they can often start at the same time.

\`Promise.all\` is a common JavaScript tool for this pattern.

### Sequential fetching

Sequential fetching means one operation starts only after another finishes. This is appropriate when the second operation needs the result of the first.

For example, you may need to load a customer before loading that customer's private orders.

### Dependent requests

A dependency creates a real chain:

\`getUser() -> getUserOrders(user.id)\`

Trying to make these two requests parallel does not remove the dependency because the second request needs the first result.

### Performance thinking

The goal is not "always use parallel." The goal is to avoid artificial waiting while respecting real dependencies and service limits.
      `,
      diagram: `
Independent

A ───────────────>
B ───────────────>
C ───────────────>
        |
        v
     render

Dependent

A ─────────>
             |
             v
          result
             |
             v
B ─────────────────>
      `,
      codeExample: {
        title: "Parallel and dependent fetching",
        code: `// Independent requests
const [products, categories, recommendations] =
  await Promise.all([
    getProducts(),
    getCategories(),
    getRecommendations(),
  ]);

// Dependent requests
const user = await getUser();
const orders = await getOrders(user.id);`,
      },
      keyTakeaways: [
        "Parallelize independent requests when it is safe and useful.",
        "Keep genuinely dependent operations sequential.",
        "Promise.all is useful for independent asynchronous work.",
        "Performance improvements come from removing unnecessary waiting, not blindly parallelizing everything.",
      ],
      commonMistakes: [
        "Calling independent requests one after another.",
        "Trying to parallelize a request that needs the result of another.",
        "Creating too many simultaneous requests without considering service limits.",
      ],
      quiz: [
        {
          question: "Which requests should usually be candidates for Promise.all?",
          options: [
            "Requests where each depends on the previous result.",
            "Independent requests that can safely run concurrently.",
            "Only POST requests.",
            "Only requests from Client Components.",
          ],
          correctIndex: 1,
          explanation:
            "Promise.all is appropriate when the operations are independent.",
        },
      ],
    },

    {
      id: "preloading-and-waterfalls",
      title: "Preloading and avoiding request waterfalls",
      durationMinutes: 17,
      explanation: `
A **request waterfall** happens when one request unnecessarily waits for another request, which then waits for another. This can happen even when the data does not have a true dependency.

For example, a component might first fetch a user and only then start fetching a list that was actually independent. The UI now waits through multiple network steps.

### Preloading

Preloading means starting data work earlier than the point where the UI explicitly needs the result.

The important idea is to start independent work as early as practical.

A preload function can begin a request without necessarily returning the final UI data immediately. Later, the actual data-reading function can reuse the work according to the application's data layer.

### Waterfall thinking

When investigating a slow page, draw the requests:

\`A -> B -> C\`

If B does not actually depend on A, change the architecture so they can begin together:

\`A\`
\`B\`
\`C\`

This is often more useful than simply increasing server resources.

### Do not preload everything

Preloading data that the user never needs wastes resources. Start work early when there is a reasonable expectation that the data will be needed.
      `,
      diagram: `
Waterfall

Page
 |
 +--> User request
       |
       +--> Products request
              |
              +--> Reviews request
                     |
                     +--> Recommendations

Better when independent

Page
 |
 +--> User request
 +--> Products request
 +--> Reviews request
 +--> Recommendations
      `,
      codeExample: {
        title: "A simple preload pattern",
        code: `const productCache = new Map<string, Promise<Product>>();

function preloadProduct(id: string) {
  if (!productCache.has(id)) {
    productCache.set(id, getProduct(id));
  }
}

function getProductData(id: string) {
  if (!productCache.has(id)) {
    productCache.set(id, getProduct(id));
  }

  return productCache.get(id)!;
}

// Start the work before the component needs it.
preloadProduct("42");`,
      },
      keyTakeaways: [
        "A waterfall is a chain of unnecessary waiting between requests.",
        "Preloading starts likely-needed work earlier.",
        "Removing artificial dependencies can improve page latency.",
        "Do not preload data that is unlikely to be used.",
      ],
      commonMistakes: [
        "Calling every data request a waterfall just because it is sequential.",
        "Preloading large amounts of data that users may never need.",
        "Building a custom cache without understanding the framework's caching behavior.",
      ],
      quiz: [
        {
          question: "What is the main goal of preloading?",
          options: [
            "To start likely-needed work earlier.",
            "To make all requests sequential.",
            "To disable caching.",
            "To move every request into the browser.",
          ],
          correctIndex: 0,
          explanation:
            "Preloading starts data work earlier so the result is more likely to be ready when the UI needs it.",
        },
      ],
    },

    {
      id: "loading-and-error-boundaries",
      title: "Loading boundaries and error boundaries",
      durationMinutes: 17,
      explanation: `
Data fetching creates two important UI questions: "What should the user see while data is loading?" and "What should the user see when the operation fails?"

### Loading boundaries

A loading boundary should represent a meaningful part of the page. In Next.js, \`loading.tsx\` can provide route-segment loading UI, while Suspense can provide more focused boundaries around individual asynchronous sections.

A good loading state preserves the approximate shape of the final UI where possible. Skeletons are often better than a generic full-page spinner because users can understand what is being loaded.

### Error boundaries

An error boundary provides a safe UI when rendering or data work throws an unexpected error.

Next.js supports route-level \`error.tsx\` boundaries. These should provide a useful recovery experience rather than expose internal error details.

### Not found is different

A missing product is not necessarily an unexpected error. A 404/not-found experience communicates that the requested resource does not exist.

This distinction matters because users need different actions:
- loading: wait;
- not found: navigate elsewhere;
- error: retry or report a problem.
      `,
      diagram: `
Request
  |
  v
Loading
  |
  +----> Success ------> UI
  |
  +----> Not found ----> 404 / not-found UI
  |
  +----> Error --------> Error boundary
      `,
      codeExample: {
        title: "Route loading and error boundaries",
        code: `// app/products/loading.tsx

export default function Loading() {
  return <div>Loading products...</div>;
}

// app/products/error.tsx

"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <h1>Something went wrong</h1>
      <button onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "Loading, not-found, and unexpected-error states are different states.",
        "loading.tsx provides route-level loading UI.",
        "Suspense can create more focused loading boundaries.",
        "error.tsx is a Client Component and can provide recovery UI.",
      ],
      commonMistakes: [
        "Using one generic error message for every failure.",
        "Showing a loading spinner after an operation has already failed.",
        "Putting sensitive backend error details directly into the UI.",
      ],
      quiz: [
        {
          question: "Which file provides a route-level error boundary in the App Router?",
          options: [
            "error.tsx",
            "database.tsx",
            "fetch.tsx",
            "loading-error.tsx",
          ],
          correctIndex: 0,
          explanation:
            "error.tsx is the App Router convention for a route-level error UI.",
        },
      ],
    },

    {
      id: "data-fetching-architecture",
      title: "Putting data-fetching patterns together",
      durationMinutes: 17,
      explanation: `
A production data-driven page usually combines several patterns rather than relying on one technique.

For an e-commerce catalog, you might:
- fetch categories and featured products in parallel;
- fetch a selected product by ID;
- preload a likely-needed resource;
- place slow recommendation data behind Suspense;
- show route-level loading UI;
- provide a route-level error boundary;
- distinguish an empty catalog from a failed request.

The architecture should follow the dependency graph.

### Start with the data graph

Write down what the UI needs and which data depends on which other data.

If product and category data are independent:

\`products + categories\`

If reviews require a product ID:

\`product -> reviews\`

If recommendations can be loaded independently:

\`product + recommendations\`

This gives you a concrete plan for parallel and sequential fetching.

### Keep boundaries meaningful

Do not add a Suspense boundary simply because it is available. Add one when a section can reasonably load independently and the fallback provides a useful experience.

### Measure before optimizing

Once the architecture is correct, use browser/network tooling and server logs to identify real bottlenecks. A theoretical optimization is less valuable than removing an actual waterfall or expensive request.
      `,
      diagram: `
E-commerce page
 |
 +--> Categories --------\
 |
 +--> Products -----------+--> parallel
 |
 +--> Product details ----+
 |          |
 |          +--> Reviews --> dependent
 |
 +--> Recommendations ----> independent
 |
 +--> Slow analytics -----> Suspense
      `,
      codeExample: {
        title: "A page combining parallel fetching and Suspense",
        code: `import { Suspense } from "react";

async function CatalogContent() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <>
      <CategoryList categories={categories} />
      <ProductList products={products} />
    </>
  );
}

async function Recommendations() {
  const products = await getRecommendations();

  return <RecommendationList products={products} />;
}

export default function ShopPage() {
  return (
    <main>
      <h1>Shop</h1>

      <CatalogContent />

      <Suspense fallback={<p>Loading recommendations...</p>}>
        <Recommendations />
      </Suspense>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "Real applications combine parallel, sequential, preloading, loading, and error patterns.",
        "The dependency graph should drive the fetching strategy.",
        "Suspense is most useful when a section can load independently.",
        "Measure real bottlenecks before introducing complicated optimizations.",
      ],
      commonMistakes: [
        "Using one giant data-fetching function for every part of the page.",
        "Adding complex preloading before identifying a real bottleneck.",
        "Ignoring the difference between data dependency and UI dependency.",
      ],
      quiz: [
        {
          question: "What should primarily determine whether two requests run in parallel?",
          options: [
            "Whether they are independent.",
            "Whether their variable names match.",
            "Whether they render inside the same div.",
            "Whether they are both GET requests.",
          ],
          correctIndex: 0,
          explanation:
            "The real question is whether one operation needs the result of the other.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is a request waterfall?",
      options: [
        "A chain of unnecessary sequential waiting between requests.",
        "A database transaction.",
        "A CSS animation.",
        "A static HTML page.",
      ],
      correctIndex: 0,
      explanation:
        "Waterfalls happen when requests wait on one another unnecessarily.",
    },
    {
      question: "When should requests remain sequential?",
      options: [
        "Whenever possible.",
        "When the later request genuinely depends on the earlier result.",
        "Only on slow networks.",
        "Only in development.",
      ],
      correctIndex: 1,
      explanation:
        "Real data dependencies require sequential work.",
    },
    {
      question: "What is preloading?",
      options: [
        "Starting likely-needed data work earlier.",
        "Deleting the cache.",
        "Disabling Server Components.",
        "Moving all requests to the browser.",
      ],
      correctIndex: 0,
      explanation:
        "Preloading starts data work before the exact UI point where it is consumed.",
    },
    {
      question: "What is the purpose of a loading boundary?",
      options: [
        "To show appropriate UI while data or a route is not ready.",
        "To hide all errors.",
        "To replace the database.",
        "To make every request parallel.",
      ],
      correctIndex: 0,
      explanation:
        "Loading boundaries communicate that a part of the UI is still being prepared.",
    },
    {
      question: "Why distinguish not-found from unexpected errors?",
      options: [
        "They require different user experiences and recovery actions.",
        "They are always the same HTTP status.",
        "Not-found is only a TypeScript issue.",
        "Unexpected errors should always be ignored.",
      ],
      correctIndex: 0,
      explanation:
        "A missing resource and an unexpected failure communicate different situations to the user.",
    },
  ],

  project: {
    name: "E-commerce product catalog",
    goal: "Build a product catalog that demonstrates efficient fetching, preloading, loading boundaries, and error handling.",
    brief:
      "Create a catalog with products, categories, product details, reviews, and recommendations. Use parallel fetching for independent data and sequential fetching only where a real dependency exists.",
    steps: [
      "Create a products page with products and categories.",
      "Fetch independent catalog data in parallel.",
      "Create a dynamic product details route.",
      "Fetch reviews only after the product identity is known.",
      "Add recommendations as an independently loaded section.",
      "Add loading.tsx for the catalog route.",
      "Add an error.tsx boundary with retry behavior.",
      "Handle missing products with a not-found experience.",
      "Identify and remove at least one artificial request waterfall.",
    ],
    acceptance: [
      "Independent catalog requests run in parallel.",
      "Dependent product data remains sequential where necessary.",
      "The project has meaningful loading UI.",
      "Unexpected errors have a recovery UI.",
      "Missing products have a distinct not-found state.",
    ],
    stretch: [
      "Preload a product when the user hovers over a product link.",
      "Add a slow recommendations section behind Suspense.",
      "Compare the network sequence before and after removing a waterfall.",
    ],
  },
};
