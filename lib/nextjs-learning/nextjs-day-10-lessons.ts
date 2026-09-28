import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_10_LESSONS: LessonDay = {
  day: 10,
  title: "Suspense and Streaming",
  totalMinutes: 79,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "react-suspense",
      title: "React Suspense and loading boundaries",
      durationMinutes: 16,
      explanation: `
**Suspense** is a React mechanism for describing what the UI should display while part of a component tree is waiting for something to become ready.

In a Next.js App Router application, Suspense is especially useful around asynchronous Server Components. Instead of making the user wait for every piece of the page, you can define a fallback for a slower section.

A Suspense boundary has two important parts: the content that you want to render and a fallback that can be shown while that content is not ready.

### Loading boundaries

Next.js also provides a route-level \`loading.tsx\` convention. A \`loading.tsx\` file gives a route a loading UI while the route segment is being prepared.

A manually placed \`<Suspense>\` boundary is more precise. It lets you choose exactly which section should show a fallback.

### Choosing the boundary

A useful loading boundary usually represents a meaningful part of the UI. For example, an analytics card can show its own skeleton while the rest of the dashboard remains usable.

A boundary that is too high can make too much of the page wait. A boundary that is too small can create many tiny loading states that are difficult to understand.
      `,
      diagram: `
Dashboard
├── Header --------------------> Ready
├── Account summary ------------> Ready
└── <Suspense>
      ├── fallback -------------> "Loading analytics..."
      └── AnalyticsPanel --------> waits for data
                                  |
                                  v
                               becomes ready
      `,
      codeExample: {
        title: "A focused Suspense boundary",
        code: `import { Suspense } from "react";
import AnalyticsPanel from "./AnalyticsPanel";

export default function DashboardPage() {
  return (
    <main>
      <h1>Analytics Dashboard</h1>

      <p>The page shell can be shown immediately.</p>

      <Suspense fallback={<div>Loading analytics...</div>}>
        <AnalyticsPanel />
      </Suspense>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "Suspense lets you define a fallback for UI that is not ready yet.",
        "A focused Suspense boundary can keep unrelated UI usable.",
        "Next.js loading.tsx provides a route-level loading boundary.",
        "Choose boundaries around meaningful pieces of UI.",
      ],
      commonMistakes: [
        "Assuming Suspense makes the underlying data source faster.",
        "Putting the boundary around the entire application when only one section is slow.",
        "Creating many tiny loading states that make the UI feel fragmented.",
      ],
      quiz: [
        {
          question: "What is the main purpose of a Suspense fallback?",
          options: [
            "To permanently replace the component.",
            "To provide UI while the suspended content is not ready.",
            "To make the database query faster.",
            "To turn a Server Component into a Client Component.",
          ],
          correctIndex: 1,
          explanation:
            "The fallback is the temporary UI shown while the suspended content is waiting.",
        },
      ],
    },

    {
      id: "streaming-html",
      title: "Streaming HTML and progressive rendering",
      durationMinutes: 16,
      explanation: `
Streaming allows the server to send a page progressively rather than waiting for every part of the result to be ready.

This is valuable when a page contains a mixture of fast and slow work. The fast parts can become visible first, while slower sections continue rendering behind Suspense boundaries.

### Streaming HTML

Think of the response as a sequence rather than one giant result. The server can send the initial shell and then send additional content as it becomes available.

The browser can therefore start showing useful UI earlier.

### Progressive rendering

Progressive rendering is the user-facing effect of this approach. Instead of seeing a completely blank screen followed by the whole page, users can see meaningful pieces appear over time.

Streaming does not remove the cost of slow work. If an analytics query takes three seconds, the query still takes three seconds. The benefit is that the rest of the page does not necessarily have to wait for that query.

### Good streaming boundaries

A good boundary usually separates work that can be delayed without blocking the rest of the page. Analytics, recommendations, activity feeds, and large reports are common examples.
      `,
      diagram: `
Server
  |
  |  Chunk 1
  v
Browser: page shell
  |
  |  Chunk 2
  v
Browser: account summary
  |
  |  Chunk 3
  v
Browser: analytics result
  |
  v
Complete UI
      `,
      codeExample: {
        title: "A streamed page with two independent sections",
        code: `import { Suspense } from "react";
import SalesChart from "./SalesChart";
import ActivityFeed from "./ActivityFeed";

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>

      <Suspense fallback={<p>Loading sales chart...</p>}>
        <SalesChart />
      </Suspense>

      <Suspense fallback={<p>Loading activity...</p>}>
        <ActivityFeed />
      </Suspense>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "Streaming lets the server deliver ready UI progressively.",
        "Suspense boundaries provide natural places where slower content can wait.",
        "Streaming improves perceived responsiveness without making slow operations intrinsically faster.",
        "Independent slow sections can use separate boundaries.",
      ],
      commonMistakes: [
        "Calling streaming a database optimization.",
        "Assuming every component needs its own streaming boundary.",
        "Using generic loading text where a skeleton or meaningful placeholder would better preserve layout.",
      ],
      quiz: [
        {
          question: "What does streaming allow the browser to receive?",
          options: [
            "Only one final HTML response after all work finishes.",
            "Ready portions of the UI progressively.",
            "Only client-side JavaScript.",
            "Only static assets.",
          ],
          correctIndex: 1,
          explanation:
            "Streaming allows ready portions of the result to be delivered while slower work continues.",
        },
      ],
    },

    {
      id: "async-server-components",
      title: "Async Server Components and data fetching",
      durationMinutes: 15,
      explanation: `
Server Components can be asynchronous. This makes it natural to fetch data directly inside a Server Component and render the result on the server.

An async Server Component can wait for a database query, API request, or other asynchronous operation. When that component is placed behind a Suspense boundary, the surrounding UI can continue rendering while the component waits.

### Keep data fetching close to the component

A useful pattern is to let a component fetch the data it actually needs. This keeps the relationship between the UI and its data visible.

For example, an \`AnalyticsPanel\` can fetch analytics data, transform it, and render the result. The page does not necessarily need to fetch every piece of data and pass everything through several layers.

### Server-side benefits

Fetching on the server can keep credentials and server-only access away from the browser. It can also reduce the amount of data and fetching logic that needs to be shipped to the client.

The important rule is to understand whether the data is server-only and whether the component actually needs browser interactivity.
      `,
      diagram: `
Page
 |
 +--> Header
 |
 +--> <Suspense>
       |
       +--> async AnalyticsPanel
               |
               +--> fetch / database
               |
               v
            render UI
      `,
      codeExample: {
        title: "An async Server Component",
        code: `// app/dashboard/AnalyticsPanel.tsx

async function getAnalytics() {
  const response = await fetch(
    "https://api.example.com/analytics"
  );

  if (!response.ok) {
    throw new Error("Failed to load analytics");
  }

  return response.json();
}

export default async function AnalyticsPanel() {
  const analytics = await getAnalytics();

  return (
    <section>
      <h2>Analytics</h2>
      <p>Total users: {analytics.totalUsers}</p>
    </section>
  );
}`,
      },
      keyTakeaways: [
        "Server Components can be async and can wait for server-side data.",
        "Data fetching can live close to the component that uses the data.",
        "Server-side fetching can keep sensitive access away from the browser.",
        "Suspense can isolate a slow async Server Component from the rest of the page.",
      ],
      commonMistakes: [
        "Adding use client just because a component performs asynchronous work.",
        "Sending server-only credentials to a Client Component.",
        "Moving every data request into the page when a smaller component owns the data.",
      ],
      quiz: [
        {
          question: "Can an App Router Server Component be async?",
          options: [
            "No, Server Components must always be synchronous.",
            "Yes, an async Server Component can wait for server-side data.",
            "Only if it uses use client.",
            "Only in development.",
          ],
          correctIndex: 1,
          explanation:
            "Async Server Components are a natural way to perform server-side asynchronous work.",
        },
      ],
    },

    {
      id: "parallel-data-fetching",
      title: "Parallel data fetching",
      durationMinutes: 16,
      explanation: `
When a page needs several independent pieces of data, fetching them one after another can create unnecessary waiting.

Suppose a dashboard needs user information, sales data, and an activity feed. If each request takes one second and they are independent, sequential fetching can make the page wait for roughly three seconds before all three results are available.

If the requests can safely happen at the same time, they can be started together with \`Promise.all\`. The total waiting time can then be closer to the slowest request rather than the sum of all request times.

### Sequential fetching

Sequential fetching means request B waits for request A, and request C waits for request B.

This is necessary when one operation genuinely depends on the result of another. For example, you may need a user ID before requesting that user's private records.

### Parallel fetching

Parallel fetching means independent requests start without waiting for one another.

The important word is **independent**. Do not parallelize operations when there is a real data dependency between them.
      `,
      diagram: `
Sequential

Request A ──────>
                  Request B ──────>
                                    Request C ──────>

Parallel

Request A ──────>
Request B ──────>
Request C ──────>
                |
                v
          all results ready
      `,
      codeExample: {
        title: "Sequential vs parallel requests",
        code: `// Sequential: B starts after A finishes.
const user = await getUser();
const orders = await getOrders(user.id);

// Parallel: these operations are independent.
const [user, settings, notifications] = await Promise.all([
  getUser(),
  getSettings(),
  getNotifications(),
]);

// Dependency-based work should remain sequential.
const account = await getAccount();
const invoices = await getInvoices(account.id);`,
      },
      keyTakeaways: [
        "Independent requests can often be started in parallel.",
        "Promise.all is useful when several async operations do not depend on one another.",
        "Sequential fetching is correct when one request needs the result of another.",
        "Parallelism can reduce unnecessary waiting time.",
      ],
      commonMistakes: [
        "Using Promise.all for operations that have a dependency.",
        "Fetching unrelated data sequentially without a reason.",
        "Starting every possible request in parallel without considering server load or whether the data is actually needed.",
      ],
      quiz: [
        {
          question: "When is Promise.all a good fit?",
          options: [
            "When each request depends on the previous request.",
            "When several asynchronous operations are independent.",
            "Only for browser APIs.",
            "Only for mutations.",
          ],
          correctIndex: 1,
          explanation:
            "Promise.all is useful when independent asynchronous operations can run concurrently.",
        },
      ],
    },

    {
      id: "sequential-vs-parallel-streaming",
      title: "Combining parallel fetching with streaming",
      durationMinutes: 16,
      explanation: `
Parallel fetching and streaming solve different parts of the performance problem and can be combined.

Parallel fetching reduces unnecessary waiting between independent data requests. Streaming allows the UI to appear progressively while slower sections continue rendering.

For example, a dashboard can start fetching sales and notifications at the same time inside a section that needs both. Another independent analytics section can have its own Suspense boundary and stream separately.

### A practical architecture

Start by identifying the data dependencies.

If two requests are independent, start them together. If a section is slow but does not need to block the page, put that section behind a Suspense boundary.

This gives you two levels of optimization:

1. **Data-level concurrency** — independent requests run together.
2. **UI-level concurrency** — independent UI sections can become visible independently.

### Do not optimize blindly

Parallel fetching is not always automatically better. If the server or external API has strict rate limits, starting many requests simultaneously can increase load. The goal is to remove unnecessary waiting while keeping the architecture understandable and safe.
      `,
      diagram: `
                    Dashboard
                       |
          +------------+------------+
          |                         |
     Fast section             Slow section
          |                         |
   +------+------+              Suspense
   |             |                  |
User data     Settings        Analytics
   |             |
   +------+------+
          |
     Promise.all
          |
       render
                       |
                       v
                 stream when ready
      `,
      codeExample: {
        title: "Parallel data inside a streamed section",
        code: `import { Suspense } from "react";

async function DashboardSummary() {
  const [sales, notifications] = await Promise.all([
    getSales(),
    getNotifications(),
  ]);

  return (
    <section>
      <p>Sales: {sales.total}</p>
      <p>Notifications: {notifications.length}</p>
    </section>
  );
}

async function SlowAnalytics() {
  const analytics = await getSlowAnalytics();

  return <section>Report: {analytics.summary}</section>;
}

export default function DashboardPage() {
  return (
    <main>
      <h1>Analytics Dashboard</h1>

      <DashboardSummary />

      <Suspense fallback={<p>Loading report...</p>}>
        <SlowAnalytics />
      </Suspense>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "Parallel fetching reduces waiting between independent data requests.",
        "Streaming reduces the need for slow UI sections to block faster sections.",
        "These techniques can be combined.",
        "Optimize only where there is real independent work or meaningful waiting.",
      ],
      commonMistakes: [
        "Confusing parallel data fetching with streaming.",
        "Parallelizing requests that have real dependencies.",
        "Creating too many concurrent external requests without considering service limits.",
      ],
      quiz: [
        {
          question: "How do parallel fetching and streaming complement each other?",
          options: [
            "They are exactly the same feature.",
            "Parallel fetching reduces data wait time while streaming allows ready UI to appear progressively.",
            "Streaming makes Promise.all unnecessary.",
            "Parallel fetching converts Client Components into Server Components.",
          ],
          correctIndex: 1,
          explanation:
            "Parallelism addresses independent asynchronous work, while streaming addresses progressive delivery of UI.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What does Suspense provide?",
      options: [
        "A way to define fallback UI while content is not ready.",
        "A database connection.",
        "A replacement for Server Components.",
        "A replacement for TypeScript.",
      ],
      correctIndex: 0,
      explanation:
        "Suspense lets React show fallback UI while suspended content is waiting.",
    },
    {
      question: "What is the main user-facing benefit of streaming?",
      options: [
        "All database queries become faster.",
        "Users can see useful parts of the page before every slow section is finished.",
        "Every component becomes static.",
        "The browser no longer needs HTML.",
      ],
      correctIndex: 1,
      explanation:
        "Streaming can improve perceived responsiveness by progressively delivering ready UI.",
    },
    {
      question: "Why can async Server Components be useful?",
      options: [
        "They can perform server-side asynchronous work close to the component that needs the data.",
        "They require all data to be fetched in the browser.",
        "They can only render static text.",
        "They are always Client Components.",
      ],
      correctIndex: 0,
      explanation:
        "Async Server Components can fetch or otherwise await server-side data before rendering.",
    },
    {
      question: "When should independent requests usually be fetched in parallel?",
      options: [
        "When they do not depend on each other's results.",
        "Only when they are mutations.",
        "Never.",
        "Only when using a Client Component.",
      ],
      correctIndex: 0,
      explanation:
        "Independent requests can often run concurrently to avoid unnecessary sequential waiting.",
    },
    {
      question: "Which statement correctly distinguishes streaming from parallel fetching?",
      options: [
        "They are two names for the same feature.",
        "Streaming controls progressive UI delivery, while parallel fetching controls independent asynchronous work.",
        "Parallel fetching only works with CSS.",
        "Streaming only works for database writes.",
      ],
      correctIndex: 1,
      explanation:
        "They address different levels of the rendering process and can be used together.",
    },
  ],

  project: {
    name: "Streaming analytics dashboard",
    goal: "Build a dashboard that demonstrates Suspense, streaming, async Server Components, and parallel data fetching.",
    brief:
      "Create an analytics dashboard with a fast summary, independently fetched data, and one or more deliberately slow analytics sections. Use Suspense boundaries so the fast parts can appear without waiting for the slowest section.",
    steps: [
      "Create a dashboard route with a stable page shell.",
      "Create an async Server Component for the dashboard summary.",
      "Identify at least two independent data sources and fetch them in parallel.",
      "Create a deliberately slow analytics component.",
      "Wrap the slow analytics component in its own Suspense boundary.",
      "Create a useful loading fallback that preserves the dashboard layout.",
      "Add a second independent slow section if you want to demonstrate multiple streaming boundaries.",
      "Compare sequential and parallel fetching and document the difference.",
    ],
    acceptance: [
      "The dashboard uses at least one Suspense boundary.",
      "At least one section is an async Server Component.",
      "At least two independent requests are fetched in parallel.",
      "A slow section has a meaningful loading fallback.",
      "The page demonstrates progressive rendering rather than waiting for every section before showing useful UI.",
    ],
    stretch: [
      "Add multiple independent Suspense boundaries.",
      "Create skeleton components that preserve the final layout dimensions.",
      "Add artificial delays to compare sequential, parallel, and streamed behavior.",
      "Measure the perceived loading sequence and explain which part of the architecture controls each stage.",
    ],
  },
};
