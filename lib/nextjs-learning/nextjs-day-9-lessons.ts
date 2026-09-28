import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_9_LESSONS: LessonDay = {
  day: 9,
  title: "Rendering Strategies",
  totalMinutes: 76,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "rendering-strategies-overview",
      title: "Build-time and request-time rendering",
      durationMinutes: 15,
      explanation: `
Rendering is the process of producing the HTML and UI that the user receives for a route. In Next.js, you can decide when that work should happen. The two useful ideas to start with are **build-time rendering** and **request-time rendering**.

Build-time rendering means the application can prepare a route before a user requests it. This is useful when the output can be known ahead of time or does not need to be calculated for every request. Because the work can happen before the request, the resulting page can often be served very quickly.

Request-time rendering means the route is rendered when a request arrives. This is useful when the response depends on information that is only available at request time, such as request-specific data, cookies, authentication state, or other dynamic information.

### Static rendering

A statically rendered route can be generated ahead of time and reused for multiple requests. Static rendering is especially useful for content such as documentation pages, marketing pages, public product information, and other content that does not need a unique result for every request.

### Dynamic rendering

Dynamic rendering happens when the result needs to be produced at request time. The important idea is not simply "dynamic means slower." Instead, dynamic rendering gives the application access to request-time information when the route needs it.

A route can therefore be thought of as either using information that is stable enough to prepare ahead of time or information that requires request-time work.
      `,
      diagram: `
Request
  |
  v
+-----------------------+
| Does output depend on |
| request-time data?    |
+-----------+-----------+
            |
       +----+----+
       |         |
      No        Yes
       |         |
       v         v
 Build-time   Request-time
 rendering    rendering
       |         |
       v         v
Prepared      Rendered when
ahead         request arrives
      `,
      codeExample: {
        title: "A mostly static page vs request-specific page",
        code: `// Mostly static content
// app/about/page.tsx

export default function AboutPage() {
  return (
    <main>
      <h1>About our company</h1>
      <p>This information is shared with every visitor.</p>
    </main>
  );
}

// Request-specific content
// app/account/page.tsx

import { cookies } from "next/headers";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  return (
    <main>
      <h1>Account</h1>
      <p>Session: {session?.value ?? "Not signed in"}</p>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "Build-time rendering prepares output before a request needs it.",
        "Request-time rendering produces output when a request arrives.",
        "Static rendering is useful when many users can receive the same result.",
        "Dynamic rendering is useful when the response depends on request-time information.",
      ],
      commonMistakes: [
        "Thinking every Next.js page must be rendered at request time.",
        "Assuming dynamic rendering is automatically a performance failure.",
        "Choosing a rendering strategy without considering where the required data comes from.",
      ],
      quiz: [
        {
          question: "What is the main difference between build-time and request-time rendering?",
          options: [
            "Build-time rendering only works with TypeScript.",
            "Build-time rendering prepares output ahead of requests, while request-time rendering happens when a request arrives.",
            "Request-time rendering only works in development.",
            "There is no difference.",
          ],
          correctIndex: 1,
          explanation:
            "The important difference is when the rendering work happens.",
        },
        {
          question: "Which type of page is a natural candidate for static rendering?",
          options: [
            "A public documentation page shared by everyone",
            "A page showing each user's private account",
            "A page whose HTML depends on the current request cookie",
            "A page that must read request-specific headers",
          ],
          correctIndex: 0,
          explanation:
            "Public documentation can often be prepared ahead of time because the same content can be reused.",
        },
      ],
    },

    {
      id: "static-dynamic-rendering",
      title: "Static rendering, dynamic rendering, and revalidation",
      durationMinutes: 16,
      explanation: `
Static and dynamic rendering are not the only useful choices. A common real-world requirement is: "The data does not need to change for every request, but it should eventually become fresh." This is where **revalidation** becomes important.

Revalidation means allowing previously generated data or output to be refreshed after some period or after an explicit invalidation. Instead of forcing a page to be fully dynamic for every visitor, you can often reuse existing output and refresh it when necessary.

### Revalidation

Imagine a product catalog that changes several times per hour. Rendering it from scratch for every request may be unnecessary. A revalidation strategy can allow the application to reuse generated data for a period and then refresh it.

Time-based revalidation is useful when a known freshness window is acceptable. On-demand revalidation is useful when the application knows that a mutation has changed specific data and wants to invalidate the relevant cached information.

### Choosing the strategy

A useful decision process is:

1. Can the result be prepared before users request it?
2. If yes, can the result remain unchanged for an acceptable period?
3. If it becomes stale, can it be revalidated?
4. Does the result depend on request-specific information?
5. Does the user need the newest data on every request?

The answer to these questions should determine the strategy rather than choosing "static" or "dynamic" by habit.
      `,
      diagram: `
                    Rendering decision
                           |
             +-------------+-------------+
             |                           |
       Same output okay?          Request-specific?
             |                           |
            Yes                         Yes
             |                           |
      +------+-------+              Dynamic
      |              |
 Always reusable   Changes over time
      |              |
    Static       Revalidate
                    |
          +---------+---------+
          |                   |
       Time-based         On-demand
       freshness          invalidation
      `,
      codeExample: {
        title: "Time-based and on-demand revalidation",
        code: `// Time-based revalidation
// The fetched data can be reused for 60 seconds.

const response = await fetch("https://api.example.com/products", {
  next: {
    revalidate: 60,
  },
});

const products = await response.json();

// On-demand invalidation can be used after a mutation.
// Example:
//
// revalidatePath("/products");
// revalidateTag("products");`,
      },
      keyTakeaways: [
        "Revalidation lets reusable data become fresh again without making every request fully dynamic.",
        "Time-based revalidation is useful when a known freshness window is acceptable.",
        "On-demand revalidation is useful when the application knows when data changed.",
        "Rendering strategy should be chosen from the application's freshness and request requirements.",
      ],
      commonMistakes: [
        "Treating revalidation as the same thing as client-side polling.",
        "Using a very short revalidation interval when the data does not need to be that fresh.",
        "Forgetting that invalidating cached data and rendering a page are related but separate concerns.",
      ],
      quiz: [
        {
          question: "Why would a product catalog use revalidation?",
          options: [
            "To make every visitor execute the same JavaScript.",
            "To reuse generated data while still allowing it to become fresh.",
            "To disable caching completely.",
            "To replace the database.",
          ],
          correctIndex: 1,
          explanation:
            "Revalidation provides a middle ground between permanently reusable output and rendering everything from scratch.",
        },
      ],
    },

    {
      id: "streaming-and-request-time",
      title: "Request-time rendering and streaming",
      durationMinutes: 15,
      explanation: `
A request-time page does not necessarily have to wait for every piece of work before sending anything to the browser. **Streaming** changes how the result is delivered.

Without streaming, a slow operation can delay the first useful HTML if the whole page has to wait before the response can be sent. With streaming, the application can send the parts that are ready while slower parts continue rendering.

This is particularly useful for dashboards and pages containing multiple independent sections. For example, a dashboard may have a navigation shell, user information, sales metrics, and a large analytics report. The shell may be ready immediately while the analytics report takes longer.

### Streaming

Streaming sends a response progressively rather than treating the entire page as one indivisible result.

### Request-time rendering + streaming

These concepts solve different problems. Request-time rendering answers **when rendering happens**. Streaming answers **how the result can be delivered progressively**.

A route can therefore use request-time rendering and still stream portions of the UI as they become ready.
      `,
      diagram: `
Browser
  ^
  |  HTML chunk 1: shell
  |  HTML chunk 2: navigation
  |  HTML chunk 3: fast data
  |  HTML chunk 4: slow analytics
  |
Next.js
  |
  +--> fast work --------> ready
  |
  +--> slow work --------> ready later
      `,
      codeExample: {
        title: "Streaming a slow section with Suspense",
        code: `import { Suspense } from "react";
import AnalyticsPanel from "./AnalyticsPanel";

export default function DashboardPage() {
  return (
    <main>
      <h1>Analytics</h1>

      <section>
        <p>The dashboard shell can render immediately.</p>
      </section>

      <Suspense fallback={<p>Loading analytics...</p>}>
        <AnalyticsPanel />
      </Suspense>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "Request-time rendering determines when rendering occurs.",
        "Streaming determines how progressively rendered UI can reach the browser.",
        "A slow section does not always need to block the entire page.",
        "Suspense boundaries provide natural boundaries for streaming UI.",
      ],
      commonMistakes: [
        "Treating streaming as a replacement for choosing the correct rendering strategy.",
        "Putting the Suspense boundary too high and making a large part of the page wait.",
        "Assuming streaming automatically makes the slow operation itself faster.",
      ],
      quiz: [
        {
          question: "What problem does streaming primarily address?",
          options: [
            "It makes databases faster.",
            "It allows parts of the UI to be delivered as they become ready.",
            "It converts Server Components into Client Components.",
            "It replaces Suspense.",
          ],
          correctIndex: 1,
          explanation:
            "Streaming improves how progressively available UI is delivered; it does not magically speed up the underlying operation.",
        },
      ],
    },

    {
      id: "partial-rendering",
      title: "Partial rendering and practical rendering decisions",
      durationMinutes: 14,
      explanation: `
Modern applications are rarely made from one single rendering strategy. Different parts of a page can have different data requirements.

This leads to the idea of **partial rendering**: keeping stable or fast parts of the UI available while dynamic or slower parts are handled separately. In the App Router, layouts, nested routes, Server Components, Suspense boundaries, and data-fetching boundaries all help you structure the page this way.

For example, a dashboard layout may be stable while the main report changes frequently. A navigation area may be immediately available while one analytics card waits for a slow database query.

### Think in boundaries

Instead of asking "Is this entire page static or dynamic?", ask:

- Which data is stable?
- Which data changes frequently?
- Which data is request-specific?
- Which part can be streamed?
- Which part can be cached or revalidated?

This produces a more useful architecture because rendering decisions are made around actual application boundaries.

### A practical decision

A good default is to keep content as reusable as its requirements allow, make only request-dependent work dynamic, and introduce revalidation or streaming where they solve a real freshness or latency problem.
      `,
      diagram: `
Dashboard
├── Header
│   └── Stable UI
├── Account summary
│   └── Request-specific data
├── Sales cards
│   └── Revalidated data
└── Analytics report
    └── Slow data + Suspense
        └── Stream when ready
      `,
      codeExample: {
        title: "Combining multiple rendering boundaries",
        code: `import { Suspense } from "react";
import AccountSummary from "./AccountSummary";
import SalesCards from "./SalesCards";
import AnalyticsReport from "./AnalyticsReport";

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>

      <AccountSummary />

      <Suspense fallback={<p>Loading sales...</p>}>
        <SalesCards />
      </Suspense>

      <Suspense fallback={<p>Loading analytics...</p>}>
        <AnalyticsReport />
      </Suspense>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "A page can contain multiple rendering and data-fetching boundaries.",
        "Partial rendering is about structuring a page so independent work does not unnecessarily block other UI.",
        "Layouts, Server Components, Suspense, caching, and revalidation can work together.",
        "Choose boundaries around actual data and interaction requirements.",
      ],
      commonMistakes: [
        "Making an entire dashboard dynamic because one small section needs request-specific data.",
        "Adding Suspense boundaries everywhere without a meaningful loading boundary.",
        "Optimizing rendering strategy before understanding the application's actual data dependencies.",
      ],
      quiz: [
        {
          question: "What is a useful way to approach partial rendering?",
          options: [
            "Make every component a Client Component.",
            "Separate independent UI and data requirements into appropriate boundaries.",
            "Disable all caching.",
            "Render every component at build time.",
          ],
          correctIndex: 1,
          explanation:
            "Partial rendering works best when the application is divided according to actual data, interaction, and loading requirements.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What does build-time rendering mean?",
      options: [
        "Rendering only after a browser event.",
        "Preparing output before users request the route.",
        "Rendering only on the client.",
        "Rendering only after a database mutation.",
      ],
      correctIndex: 1,
      explanation:
        "Build-time rendering prepares reusable output ahead of incoming requests.",
    },
    {
      question: "When is request-time rendering useful?",
      options: [
        "When every user must receive exactly the same prebuilt HTML.",
        "When the response depends on information available at request time.",
        "Only when using static assets.",
        "Only during local development.",
      ],
      correctIndex: 1,
      explanation:
        "Request-time rendering is useful when the result depends on request-specific or otherwise dynamic information.",
    },
    {
      question: "What is the purpose of revalidation?",
      options: [
        "To permanently disable caching.",
        "To refresh reusable data or output when it becomes stale.",
        "To convert a Server Component into a Client Component.",
        "To replace Suspense.",
      ],
      correctIndex: 1,
      explanation:
        "Revalidation allows previously reusable data or output to become fresh again.",
    },
    {
      question: "What does streaming primarily improve?",
      options: [
        "How progressively available UI is delivered.",
        "Database query execution speed.",
        "TypeScript compilation.",
        "CSS parsing.",
      ],
      correctIndex: 0,
      explanation:
        "Streaming lets ready portions of the UI reach the browser while slower work continues.",
    },
    {
      question: "Why are rendering boundaries useful?",
      options: [
        "They force the entire application to use one rendering strategy.",
        "They let different parts of the UI have different data and loading requirements.",
        "They remove the need for data fetching.",
        "They make all routes static.",
      ],
      correctIndex: 1,
      explanation:
        "Boundaries allow independent parts of an application to be handled according to their actual requirements.",
    },
  ],

  project: {
    name: "Rendering strategy lab",
    goal: "Build a small Next.js content dashboard that demonstrates static, dynamic, revalidated, and streamed sections.",
    brief:
      "Create a dashboard with a mostly stable page shell, a request-specific account section, a revalidated product or sales section, and a slow analytics section rendered behind Suspense.",
    steps: [
      "Create the dashboard route and shared page structure.",
      "Add a mostly static information section that can be reused.",
      "Add a request-specific account section using request-time information.",
      "Add a data section with a revalidation strategy.",
      "Create a deliberately slow analytics component.",
      "Wrap the slow analytics component in Suspense with a useful loading fallback.",
      "Compare the behavior of the sections and document why each rendering strategy was selected.",
    ],
    acceptance: [
      "The dashboard contains at least one mostly reusable section.",
      "At least one section demonstrates request-time information.",
      "At least one data source uses revalidation.",
      "The slow analytics section has its own Suspense boundary.",
      "The project explains why each section uses its chosen strategy.",
    ],
    stretch: [
      "Add a second slow section and stream both sections independently.",
      "Add an on-demand revalidation path after updating product data.",
      "Measure the perceived loading sequence and explain which boundary controls each part.",
    ],
  },
};
