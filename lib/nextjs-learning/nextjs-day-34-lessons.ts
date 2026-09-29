import type { LessonDay } from "@/lib/learn/lesson-types";

const NEXTJS_DAY_34_SOURCE = {
  day: 34,
  title: "Performance Debugging",
  description:
    "Learn how to investigate a slow Next.js App Router application instead of guessing at optimizations. You will use Chrome DevTools, Lighthouse, React DevTools, the Next.js bundle analyzer, the Network panel, and the Performance profiler to identify slow components, large bundles, request waterfalls, excessive client rendering, and slow server or database work. The lesson ends with a practical project where you diagnose and repair an intentionally slow Next.js application.",
  sections: [
    {
      title: "1. Building a Performance Debugging Mindset",
      subsections: [
        {
          title: "1.1 Debug the symptom before changing the code",
          explanation:
            "Performance debugging starts with a different mindset from normal feature development. When a user says a dashboard is slow, do not immediately add caching, move code to the server, install another package, or rewrite a component. First find out what is actually slow.\n\nA slow page can have many different causes. The server might take too long to respond. The browser might download too much JavaScript. Several network requests might be waiting for one another. A Client Component might perform expensive rendering work. A database query might be scanning far more records than necessary.\n\nThe first useful question is therefore not 'What optimization should I use?' It is 'Where is the time going?'\n\nA good debugging session turns a vague complaint into an observable problem. For example, 'the admin dashboard is slow' can become 'the initial document request takes 1.8 seconds before the first response data arrives' or 'the dashboard sends five API requests sequentially' or 'clicking the filter causes 300 ms of React rendering work.' Those statements lead to very different fixes.\n\nThis approach is especially important in Next.js because the App Router can involve both server and browser work. You need to identify which environment is responsible for the delay before choosing an intervention.",
          visualDiagram:
            "User reports: \"Dashboard is slow\"\n                 │\n                 ▼\n          Reproduce the problem\n                 │\n                 ▼\n             Measure it\n                 │\n        ┌────────┼─────────┐\n        ▼        ▼         ▼\n     Network   Server    Browser\n        │        │         │\n        ▼        ▼         ▼\n   Waterfalls  DB/API   React/JS\n        │        │         │\n        └────────┼─────────┘\n                 ▼\n          Identify bottleneck\n                 │\n                 ▼\n            Change one thing\n                 │\n                 ▼\n          Measure again",
          codeExample: {
            title: "Turn a vague complaint into measurable questions",
            code: `// Instead of asking:
//
// "Why is the dashboard slow?"
//
// Ask:
//
// "How long does the document request take?"
// "Which network request takes the longest?"
// "Are requests waiting for one another?"
// "How much JavaScript does this route load?"
// "Which React interaction causes expensive rendering?"
// "Which server operation or database query is slow?"`,
          },
          keyTakeaways: [
            "Performance debugging begins with measurement, not an optimization technique.",
            "A useful performance problem is specific and measurable.",
            "Next.js applications can have both server-side and browser-side bottlenecks.",
            "Change one important thing at a time and measure the result.",
          ],
          commonMistakes: [
            "Optimizing the first thing that looks suspicious.",
            "Assuming every performance problem is caused by React.",
            "Assuming every slow page is caused by the database.",
            "Making several performance changes simultaneously and then being unable to identify which change helped.",
          ],
          miniQuiz: [
            {
              question:
                "What should you do before changing a slow component?",
              answer:
                "Measure the problem and determine whether that component is actually contributing significant work to the user's slow experience.",
            },
            {
              question:
                "Why is 'the dashboard is slow' a poor debugging diagnosis?",
              answer:
                "It describes the symptom but does not identify which part of the request, rendering, networking, or data path is consuming the time.",
            },
          ],
        },
        {
          title: "1.2 Establish a reproducible baseline",
          explanation:
            "Before debugging, make the problem reproducible. Use the same route, similar data, and similar browser conditions when possible. If you change the environment every time you test, your measurements become difficult to compare.\n\nFor production-oriented testing, Next.js recommends creating a production build with `next build` and running it with `next start`. Lighthouse should also be run against the production build rather than relying only on development mode.\n\nFor local investigation, Chrome DevTools can also help you throttle the network or CPU so that problems that are invisible on a powerful development machine become easier to reproduce.\n\nThe goal is not to perfectly simulate every user. The goal is to create a consistent baseline. If the intentionally slow dashboard takes approximately the same amount of time before and after a change, you have a useful comparison. If the test environment changes dramatically between runs, the result becomes much less useful.",
          codeExample: {
            title: "Run the application in production mode",
            code: `# Build the optimized application
npm run build

# Start the production build
npm run start

# Then open the application in Chrome and reproduce
# the same slow route or interaction.`,
          },
          keyTakeaways: [
            "A reproducible baseline makes performance changes measurable.",
            "Test production builds when evaluating production performance.",
            "Use consistent routes, data, and browser conditions when comparing results.",
          ],
          commonMistakes: [
            "Comparing development-mode performance with production-mode performance.",
            "Changing the test route or data between measurements.",
            "Trusting a single measurement instead of repeating the test.",
          ],
          miniQuiz: [
            {
              question:
                "Why should a performance comparison use the same route and similar conditions?",
              answer:
                "Because otherwise you may be measuring environmental differences instead of the effect of your code change.",
            },
          ],
        },
      ],
    },
    {
      title: "2. Investigating Network and Server Bottlenecks",
      subsections: [
        {
          title: "2.1 Reading the Network panel",
          explanation:
            "Chrome DevTools' Network panel shows the requests made by the browser. This is one of the first places to investigate when a Next.js page feels slow.\n\nA request can represent an HTML document, JavaScript, CSS, image, font, API request, or another resource. The important skill is learning to read the request timeline rather than simply looking for the request with the largest file size.\n\nFor example, imagine a SaaS dashboard that makes three requests: `/api/user`, `/api/stats`, and `/api/activity`. If the browser waits for `/api/user` before requesting `/api/stats`, and then waits for `/api/stats` before requesting `/api/activity`, the application has created a request waterfall. The total time becomes the sum of several delays instead of the duration of the slowest request.\n\nThe Network panel can help you inspect request timing, response sizes, status codes, and relationships between requests. Chrome's documentation describes the Network panel as the place for inspecting network requests and their associated information.\n\nWhen debugging, pay attention to requests that are unexpectedly slow, requests that are duplicated, requests that start later than expected, and requests that depend on previous requests.",
          visualDiagram:
            "Good parallel loading\n\nRequest A ────────────────────►\nRequest B ────────────────────►\nRequest C ────────────────────►\n\nTotal time ≈ slowest request\n\n\nWaterfall\n\nRequest A ───────────►\n             Request B ───────────►\n                       Request C ───────────►\n\nTotal time ≈ A + B + C",
          codeExample: {
            title: "A server-side request pattern worth investigating",
            code: `// app/dashboard/page.tsx

async function getUser() {
  const response = await fetch("https://api.example.com/user");

  if (!response.ok) {
    throw new Error("Failed to load user");
  }

  return response.json();
}

async function getDashboardStats() {
  const response = await fetch(
    "https://api.example.com/dashboard/stats"
  );

  if (!response.ok) {
    throw new Error("Failed to load dashboard statistics");
  }

  return response.json();
}

export default async function DashboardPage() {
  const user = await getUser();
  const stats = await getDashboardStats();

  return (
    <main>
      <h1>Welcome, {user.name}</h1>
      <p>Revenue: {stats.revenue}</p>
    </main>
  );
}`,
          },
          keyTakeaways: [
            "Use the Network panel to understand what the browser is requesting.",
            "Look for slow, duplicated, delayed, or dependent requests.",
            "A waterfall can make several individually reasonable requests produce a slow overall experience.",
            "Request timing is often more useful than simply looking at file size.",
          ],
          commonMistakes: [
            "Looking only at the largest network response.",
            "Ignoring request start times and dependencies.",
            "Assuming a slow page has only one problematic request.",
            "Ignoring duplicate API requests.",
          ],
          miniQuiz: [
            {
              question:
                "Three requests each take one second and are executed sequentially. Approximately how long can their combined waiting time become?",
              answer:
                "Approximately three seconds, because the requests are waiting for one another rather than running concurrently.",
            },
            {
              question:
                "What should you inspect when looking for a request waterfall?",
              answer:
                "Look at when requests start and whether one request is waiting for another to finish before it begins.",
            },
          ],
        },
        {
          title: "2.2 Finding slow server operations",
          explanation:
            "A Network request can tell you that an endpoint is slow, but it does not automatically tell you why. If `/dashboard` takes 1.5 seconds to respond, the server might be spending most of that time fetching data, querying a database, calling another API, or performing expensive computation.\n\nThe next step is to add server-side timing around the operation you suspect. This is especially useful in an App Router Server Component because data fetching can happen directly on the server.\n\nFor debugging, simple timing logs can establish where time is being spent. In production systems, structured logging and observability tools are generally preferable to random `console.log()` statements, but a small controlled timer is useful while learning how to isolate a bottleneck.\n\nDo not assume that a slow server response automatically means the database is slow. The database may be fast while a downstream API is slow, or the application may be doing expensive processing after the database returns.",
          codeExample: {
            title: "Measure server-side operations separately",
            code: `async function getDashboardData() {
  const startedAt = performance.now();

  const response = await fetch(
    "https://api.example.com/dashboard"
  );

  const data = await response.json();

  console.log(
    \`dashboard fetch: \${(performance.now() - startedAt).toFixed(1)}ms\`
  );

  return data;
}`,
          },
          keyTakeaways: [
            "A slow HTTP request is a symptom; investigate the work behind it.",
            "Measure individual server operations instead of guessing.",
            "A database is only one possible source of server latency.",
            "Use structured observability for long-term production monitoring.",
          ],
          commonMistakes: [
            "Blaming the database before measuring it.",
            "Measuring only the complete request and not its individual operations.",
            "Leaving noisy debugging logs permanently in production code.",
          ],
          miniQuiz: [
            {
              question:
                "An API request takes 1.8 seconds. Does that prove the database query takes 1.8 seconds?",
              answer:
                "No. The request may include application processing, database work, downstream API calls, serialization, and other server-side operations.",
            },
          ],
        },
        {
          title: "2.3 Finding slow database queries",
          explanation:
            "Database performance becomes a debugging problem when application code waits a long time for data. The important distinction is between the application request and the database operation inside it.\n\nSuppose an admin page displays the 50 most recent orders. The application might accidentally load every order and sort thousands or millions of rows before returning the 50 it actually needs. The browser cannot see that database inefficiency directly. You need database-level measurement and query analysis.\n\nThe exact debugging tool depends on your database. PostgreSQL, MySQL, SQLite, MongoDB, and managed database services provide different tools. In a PostgreSQL system, for example, `EXPLAIN ANALYZE` can execute a query and show the database's actual execution plan and timing.\n\nUse database-specific tooling rather than assuming every database behaves the same way. Look for full-table scans where an appropriate index could help, excessive rows being processed, expensive joins, sorting, and queries returning much more data than the page actually needs.\n\nThe important production habit is to connect the database observation back to the user-visible request. A query is worth investigating when it contributes meaningfully to a slow request or expensive operation.",
          codeExample: {
            title: "PostgreSQL query investigation",
            code: `-- PostgreSQL example.
-- Run this in a safe development or staging environment
-- when you need the actual execution plan.

EXPLAIN ANALYZE
SELECT id, customer_id, total, created_at
FROM orders
ORDER BY created_at DESC
LIMIT 50;`,
          },
          keyTakeaways: [
            "Database debugging requires database-specific tools.",
            "Measure query execution rather than guessing from application code.",
            "Look for unnecessary rows, expensive sorting, joins, and missing or ineffective indexes.",
            "Always connect a slow query back to the user-visible operation it affects.",
          ],
          commonMistakes: [
            "Assuming every database has the same query-planning commands.",
            "Adding indexes without checking whether the query actually benefits from them.",
            "Returning thousands of records when the UI needs only a small subset.",
            "Running destructive or expensive database analysis against production without considering its impact.",
          ],
          miniQuiz: [
            {
              question:
                "Why might a query that returns only 50 rows still be expensive?",
              answer:
                "The database may need to scan, sort, join, or otherwise process a very large amount of data before it can produce those 50 rows.",
            },
            {
              question:
                "Should you use PostgreSQL-specific commands against every database?",
              answer:
                "No. Database diagnostics are database-specific, so use the tools appropriate for the database you are actually running.",
            },
          ],
        },
      ],
    },
    {
      title: "3. Investigating Client JavaScript and React Rendering",
      subsections: [
        {
          title: "3.1 Finding excessive Client Component usage",
          explanation:
            "In the Next.js App Router, Server Components are the default. Client Components are used when a component needs client-side capabilities such as state, event handlers, effects, or browser APIs.\n\nThis creates an important performance debugging question: which parts of the application actually need to execute in the browser?\n\nA common problem is placing a `use client` boundary too high in the component tree. Imagine an ecommerce product page containing product information, reviews, recommendations, and one interactive quantity selector. If the entire page is made a Client Component just because the quantity selector needs state, much more UI may become part of the client-side JavaScript graph than necessary.\n\nWhen debugging excessive client rendering, inspect the component tree and bundle composition. Look for large sections of UI that are interactive only because their parent component is client-side. The goal is not to eliminate Client Components. Interactive behavior genuinely belongs there. The goal is to keep browser work limited to the parts that need it.",
          visualDiagram:
            "Too broad\n\nProductPage [Client]\n├── ProductInfo\n├── Reviews\n├── Recommendations\n└── QuantitySelector\n\nMuch of the tree is now inside a client boundary.\n\n\nMore focused\n\nProductPage [Server]\n├── ProductInfo [Server]\n├── Reviews [Server]\n├── Recommendations [Server]\n└── QuantitySelector [Client]\n\nOnly the interactive part requires client behavior.",
          codeExample: {
            title: "Keep a small interactive boundary",
            code: `// app/products/[id]/page.tsx

import { QuantitySelector } from "./quantity-selector";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product = await getProduct(id);

  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>\${product.price}</p>

      <QuantitySelector />
    </main>
  );
}

// app/products/[id]/quantity-selector.tsx

"use client";

import { useState } from "react";

export function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <button
        type="button"
        onClick={() => setQuantity((value) => Math.max(1, value - 1))}
      >
        -
      </button>

      <span>{quantity}</span>

      <button
        type="button"
        onClick={() => setQuantity((value) => value + 1)}
      >
        +
      </button>
    </div>
  );
}

// The implementation of getProduct would normally live in
// server-side data-access code.`,
          },
          keyTakeaways: [
            "The App Router uses Server Components by default.",
            "A high Client Component boundary can pull more code into the browser.",
            "Look for interactive behavior that can be isolated into a smaller component.",
            "Do not remove Client Components simply because they use JavaScript; investigate whether the boundary is broader than necessary.",
          ],
          commonMistakes: [
            "Adding `use client` to the root page because one child needs state.",
            "Assuming every React component must execute in the browser.",
            "Refactoring client boundaries without measuring the resulting bundle or user experience.",
          ],
          miniQuiz: [
            {
              question:
                "A page has one interactive quantity selector and 20 display-only components. Should the entire page automatically be a Client Component?",
              answer:
                "No. The quantity selector can be isolated as a Client Component while the surrounding display-only UI remains server-rendered.",
            },
          ],
        },
        {
          title: "3.2 Using React DevTools to inspect components",
          explanation:
            "React Developer Tools provides Components and Profiler panels for React applications. The Components panel helps you inspect the component tree, props, and state. The Profiler helps investigate rendering performance. React's current documentation also describes React-specific performance tracks that can appear in the browser Performance panel, where supported.\n\nThe important debugging question is not simply 'Which component rendered?' React applications naturally render components. Instead ask 'Which interaction or update caused expensive work, and which components were involved?'\n\nFor example, suppose typing into a search field makes an entire 500-row table re-render. The user experiences the search field as laggy. React DevTools can help you investigate the component tree and profiler information to understand which components participate in the update.\n\nDo not assume that every re-render is a bug. React rendering is normal. A performance problem exists when the amount or frequency of work becomes expensive enough to affect the user experience.",
          visualDiagram:
            "User types in search box\n          │\n          ▼\n     State changes\n          │\n          ▼\n   Search component\n          │\n          ▼\n     Table updates\n          │\n     ┌────┴─────┐\n     ▼          ▼\n  Cheap       Expensive\n  render       render\n                 │\n                 ▼\n             User sees lag",
          codeExample: {
            title: "An interaction worth profiling",
            code: `'use client';

import { useState } from "react";

type Order = {
  id: string;
  customer: string;
};

export function OrderSearch({
  orders,
}: {
  orders: Order[];
}) {
  const [query, setQuery] = useState("");

  const filteredOrders = orders.filter((order) =>
    order.customer.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section>
      <label>
        Search orders
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <ul>
        {filteredOrders.map((order) => (
          <li key={order.id}>
            {order.id} — {order.customer}
          </li>
        ))}
      </ul>
    </section>
  );
}`,
          },
          keyTakeaways: [
            "React DevTools helps inspect the component tree and investigate rendering performance.",
            "A re-render is not automatically a performance bug.",
            "Profile a real interaction that users experience as slow.",
            "Look for unnecessary expensive work rather than trying to eliminate every render.",
          ],
          commonMistakes: [
            "Treating every re-render as something that must be prevented.",
            "Profiling only the initial page load when the real problem occurs during interaction.",
            "Adding memoization before identifying an actual expensive render.",
          ],
          miniQuiz: [
            {
              question:
                "Does every React re-render indicate a performance problem?",
              answer:
                "No. Re-rendering is normal React behavior. It becomes a performance problem when the work is unnecessarily expensive or frequent enough to affect the user experience.",
            },
          ],
        },
        {
          title: "3.3 Using the Performance panel to find expensive browser work",
          explanation:
            "Chrome's Performance panel records a timeline of browser activity. It can help you understand JavaScript execution, rendering, event handling, network activity, and other browser work on a shared timeline. React's current documentation also describes React-specific performance tracks that can appear alongside browser activity in supported environments.\n\nA useful workflow is to record the specific interaction that feels slow. For example, open an admin dashboard, start a Performance recording, click the filter button, wait for the UI to update, and stop recording. Then inspect the timeline around that interaction.\n\nYou are looking for expensive blocks of work rather than trying to understand every event in the trace. A long JavaScript task may point toward expensive application code. A cluster of rendering work may indicate that an interaction causes a large portion of the UI to update. Network activity can reveal whether the interaction is waiting on a request.\n\nChrome also allows performance traces to be saved and shared, which is useful when collaborating with another developer on a performance investigation.",
          visualDiagram:
            "Performance recording\n\nTime ──────────────────────────────────────►\n\nNetwork       ████\nJavaScript        ███████████\nRendering                   ███████\nPainting                         ███\nReact                         ██████\n\n                         ↑\n                  slow interaction",
          codeExample: {
            title: "Record the interaction you actually care about",
            code: `// Performance investigation:
//
// 1. Open Chrome DevTools.
// 2. Open the Performance panel.
// 3. Start a recording.
// 4. Perform the slow interaction once.
// 5. Stop the recording.
// 6. Inspect the timeline around the interaction.
//
// Example interaction:
// "Open the customer filter and select Pending."`,
          },
          keyTakeaways: [
            "The Performance panel shows browser activity on a timeline.",
            "Record a specific slow interaction rather than collecting an enormous trace without a goal.",
            "Use the timeline to connect JavaScript, rendering, network activity, and React work.",
            "Performance traces can be saved and shared for collaborative debugging.",
          ],
          commonMistakes: [
            "Recording random activity without reproducing the actual problem.",
            "Trying to understand every event in a performance trace.",
            "Assuming a long JavaScript task is automatically caused by React.",
          ],
          miniQuiz: [
            {
              question:
                "Why is it useful to record the exact interaction that users report as slow?",
              answer:
                "It lets you focus the performance trace on the work associated with the actual problem instead of searching through unrelated browser activity.",
            },
          ],
        },
      ],
    },
    {
      title: "4. Using Lighthouse and Next.js Bundle Analysis",
      subsections: [
        {
          title: "4.1 Use Lighthouse as evidence, not as the entire diagnosis",
          explanation:
            "Lighthouse is useful for running an automated audit of a page. It can highlight performance opportunities and provide measurements that help establish a baseline.\n\nHowever, Lighthouse does not replace debugging tools. It tells you that a page has a performance problem, but DevTools and application-level investigation often help explain exactly where the problem comes from.\n\nNext.js's current production guidance recommends running Lighthouse in an incognito window and pairing its simulated measurements with field data. Next.js also recommends testing a production build rather than relying only on development mode.\n\nFor this reason, use Lighthouse near the beginning and end of an optimization investigation. First use it to establish a baseline. Then use DevTools and application profiling to identify causes. Finally run Lighthouse again to determine whether the change affected the measured experience.",
          visualDiagram:
            "Lighthouse\n    │\n    ▼\n┌────────────────────┐\n│ Identify symptoms  │\n└─────────┬──────────┘\n          │\n          ▼\n┌────────────────────┐\n│ DevTools diagnosis │\n│ Network            │\n│ Performance        │\n│ React DevTools     │\n└─────────┬──────────┘\n          │\n          ▼\n     Fix bottleneck\n          │\n          ▼\n      Lighthouse\n       again",
          codeExample: {
            title: "Run a production Lighthouse baseline",
            code: `# Build the application first
npm run build

# Run the production server
npm run start

# Then open Chrome DevTools and run Lighthouse
# against the production URL.`,
          },
          keyTakeaways: [
            "Lighthouse is a useful automated measurement tool.",
            "Use it to establish and compare a baseline.",
            "Use DevTools and application profiling to investigate causes.",
            "Run Lighthouse against a production build for meaningful testing.",
          ],
          commonMistakes: [
            "Treating the Lighthouse score as the diagnosis itself.",
            "Running only development-mode Lighthouse tests.",
            "Changing code until the score changes without understanding why.",
          ],
          miniQuiz: [
            {
              question:
                "Should Lighthouse replace the Network and Performance panels?",
              answer:
                "No. Lighthouse identifies performance opportunities, while DevTools provides deeper evidence for investigating what is actually happening.",
            },
          ],
        },
        {
          title: "4.2 Finding large bundles with the Next.js analyzer",
          explanation:
            "A bundle is the generated output containing application code and dependencies. If a route includes a large amount of client JavaScript, users may need to download, parse, compile, and execute more code.\n\nCurrent Next.js documentation provides an experimental Bundle Analyzer integrated with Turbopack in Next.js 16.1 and later. The analyzer can filter by route and environment and can show import chains, making it useful for finding why a large module ended up in a bundle.\n\nThis is particularly valuable when you suspect a dependency or Client Component boundary is causing unexpectedly large browser code. Instead of guessing which package is responsible, inspect the generated bundle and follow the import chain.\n\nRemember that bundle analysis is diagnostic. Finding a large module does not automatically mean you should remove it. First determine why it is included and whether the affected route actually needs it.",
          visualDiagram:
            "Route bundle\n┌─────────────────────────────────────┐\n│                                     │\n│      Large dependency               │\n│      █████████████████              │\n│                                     │\n│   App code ███████                  │\n│                                     │\n│   Other modules ████                │\n│                                     │\n└─────────────────────────────────────┘\n              │\n              ▼\n       Follow import chain\n              │\n              ▼\n       Find why it exists",
          codeExample: {
            title: "Analyze a Turbopack bundle",
            code: `# Next.js 16.1+ with the Turbopack Bundle Analyzer
pnpm next experimental-analyze

# Save the analysis output for comparison
pnpm next experimental-analyze --output

# The saved analysis is written to:
# .next/diagnostics/analyze`,
          },
          keyTakeaways: [
            "The current Next.js Bundle Analyzer is experimental and integrated with Turbopack.",
            "Use it to inspect client and server bundle composition.",
            "Import chains help explain why a dependency is included.",
            "Finding a large dependency is the beginning of the investigation, not automatically the solution.",
          ],
          commonMistakes: [
            "Using old bundle-analysis instructions without checking the current Next.js version.",
            "Assuming the largest dependency should automatically be removed.",
            "Looking only at total bundle size without identifying which route and environment contain the code.",
          ],
          miniQuiz: [
            {
              question:
                "What does an import chain help you discover?",
              answer:
                "It helps you understand why a particular module or dependency is included in a generated bundle and where it entered the dependency graph.",
            },
            {
              question:
                "Is a large dependency automatically a bug?",
              answer:
                "No. It may be necessary. The important question is whether it is contributing unnecessary cost to the route or environment being investigated.",
            },
          ],
        },
      ],
    },
    {
      title: "5. End-to-End Performance Debugging Workflow",
      subsections: [
        {
          title: "5.1 Connect the tools instead of using them separately",
          explanation:
            "The most valuable performance debugging skill is learning how the tools fit together. Each tool answers a different question.\n\nLighthouse helps you establish a page-level performance baseline. The Network panel shows what is being requested and when. The Performance panel shows browser activity over time. React DevTools helps you inspect React components and rendering behavior. The Next.js Bundle Analyzer shows how application modules and dependencies contribute to generated bundles. Server-side timing and database tools help you investigate work that happens before the browser can display the result.\n\nConsider a slow ecommerce product page. Lighthouse might show poor loading performance. The Network panel might reveal that the document request takes a long time. Server timing could reveal that a product query is slow. Database analysis might then show an inefficient query plan. In that situation, React profiling would not be the first place to spend your time because the browser has not yet received the useful response.\n\nNow consider a different problem: the page loads quickly, but opening the product filter causes the browser to freeze. Lighthouse may not explain the interaction well enough. The Performance panel and React DevTools become much more useful because the problem occurs during browser interaction.\n\nThe tools are therefore not competing alternatives. They form a debugging chain.",
          visualDiagram:
            "                    Slow application\n                           │\n                           ▼\n                     Lighthouse\n                           │\n                           ▼\n                  What is the symptom?\n                           │\n          ┌────────────────┼────────────────┐\n          ▼                ▼                ▼\n       Network           Server           Browser\n          │                │                │\n          ▼                ▼                ▼\n      Waterfalls       API / DB       Performance\n                                           │\n                              ┌────────────┴────────────┐\n                              ▼                         ▼\n                       React DevTools          JavaScript trace\n                              │                         │\n                              └────────────┬────────────┘\n                                           ▼\n                                    Root cause\n                                           │\n                                           ▼\n                                      Targeted fix\n                                           │\n                                           ▼\n                                      Measure again",
          codeExample: {
            title: "A practical investigation checklist",
            code: `// Performance debugging:
//
// 1. Reproduce the slow behavior.
//
// 2. Create a production build:
//    npm run build
//    npm run start
//
// 3. Run Lighthouse and record the baseline.
//
// 4. Inspect the Network panel.
//    Look for slow requests, duplicate requests,
//    and request waterfalls.
//
// 5. If the server request is slow,
//    measure server operations individually.
//
// 6. If database work is suspected,
//    use the database's own query-analysis tools.
//
// 7. If browser interaction is slow,
//    record the interaction in the Performance panel.
//
// 8. Inspect the React tree with React DevTools.
//
// 9. If client JavaScript looks suspicious,
//    inspect the Next.js bundle analyzer.
//
// 10. Make one targeted change.
//
// 11. Repeat the same measurement.
//
// 12. Keep the change only if the evidence shows
//     that it improves the actual problem.`,
          },
          keyTakeaways: [
            "Each performance tool answers a different diagnostic question.",
            "Start with the symptom and select the tool that can reveal its cause.",
            "Server problems should be investigated on the server; browser problems should be investigated in the browser.",
            "Bundle analysis explains generated code composition, while React profiling explains rendering behavior.",
            "Always repeat the original measurement after making a change.",
          ],
          commonMistakes: [
            "Using Lighthouse alone to diagnose every performance problem.",
            "Using React DevTools to investigate a problem that occurs before the browser receives the page.",
            "Using bundle analysis to diagnose a slow database query.",
            "Fixing a symptom without confirming the root cause.",
          ],
          miniQuiz: [
            {
              question:
                "Which tool is most directly useful for seeing request waterfalls?",
              answer:
                "Chrome DevTools Network panel.",
            },
            {
              question:
                "Which tools are especially useful when a click causes expensive React rendering?",
              answer:
                "React DevTools Profiler and Chrome DevTools Performance panel.",
            },
            {
              question:
                "Which tool helps explain why a large module appears in a Next.js bundle?",
              answer:
                "The Next.js Bundle Analyzer, which can show module composition and import chains.",
            },
          ],
        },
        {
          title: "5.2 Project: optimize an intentionally slow Next.js application",
          explanation:
            "Your final task is to debug a deliberately slow Next.js App Router application. The objective is not to blindly apply every optimization technique you know. Your objective is to produce evidence for each bottleneck, make targeted changes, and demonstrate that the application improved.\n\nBuild or use an intentionally slow SaaS admin dashboard with an overview page, an orders table, filtering, and a customer panel. Introduce several independent problems so that you have to use different debugging tools.\n\nFor example, the application can contain a sequential server request waterfall, a deliberately inefficient database query, an unnecessarily broad Client Component boundary, a large client-side dependency, and an expensive table interaction. These problems should be introduced intentionally and documented so that the learner can diagnose them rather than guessing.\n\nDo not solve all problems with one technique. A good debugging exercise should force you to identify the correct bottleneck first.\n\nThe final report should contain the original measurement, evidence from the relevant debugging tool, the change you made, and the measurement after the change.",
          visualDiagram:
            "Slow SaaS Dashboard\n\n┌─────────────────────────────────────────┐\n│ Dashboard                               │\n├─────────────────────────────────────────┤\n│ Revenue     Orders      Customers       │\n│                                         │\n│ Search [____________]                   │\n│                                         │\n│ 500-row orders table                    │\n│                                         │\n│ Customer details panel                  │\n└─────────────────────────────────────────┘\n\nPossible investigation paths:\n\nDocument slow ─────► Network ─────► Server ─────► Database\nBundle large ──────► Bundle Analyzer ─────► Client boundary\nClick slow ─────────► Performance ───────► React DevTools\nPage baseline ──────► Lighthouse",
          codeExample: {
            title: "Suggested project structure",
            code: `app/
├── admin/
│   ├── page.tsx
│   ├── orders/
│   │   └── page.tsx
│   └── customers/
│       └── page.tsx
├── components/
│   ├── dashboard/
│   ├── orders/
│   └── customers/
└── lib/
    ├── data/
    └── performance/

docs/
└── performance-report.md`,
          },
          keyTakeaways: [
            "The project should be solved through evidence rather than guesswork.",
            "Each bottleneck should be matched to the appropriate debugging tool.",
            "Record before-and-after measurements.",
            "A successful performance fix should improve the actual bottleneck without unnecessarily increasing application complexity.",
          ],
          commonMistakes: [
            "Applying every optimization technique without measuring the original problem.",
            "Changing several unrelated parts of the application at once.",
            "Reporting only a final score without documenting how the bottleneck was identified.",
            "Optimizing a component when the real bottleneck is a server request or database query.",
            "Removing functionality simply to make the benchmark look better.",
          ],
          miniQuiz: [
            {
              question:
                "What should your project report contain besides the final performance score?",
              answer:
                "It should explain the original symptom, the evidence that identified the bottleneck, the change made, and the measurement after the change.",
            },
            {
              question:
                "If a database query is the bottleneck, should you primarily use React DevTools to diagnose it?",
              answer:
                "No. React DevTools is useful for React rendering behavior. The database query should be investigated with server-side and database-specific tools.",
            },
          ],
        },
        {
          title: "5.3 Project completion criteria",
          explanation:
            "Consider the project complete when you can explain the performance problem rather than merely saying that the page became faster.\n\nYour final application should have a documented baseline and a documented result. For every major bottleneck, record which tool exposed it and why the evidence pointed toward that cause.\n\nA strong submission might include a Lighthouse baseline, screenshots or notes from the Network panel, a Performance trace for a slow interaction, React DevTools observations, a bundle analyzer finding, and database query evidence where relevant.\n\nThe most important outcome is the reasoning process. In a real production application, performance problems rarely arrive labeled with their root cause. You need to move from user symptom to measurement, from measurement to evidence, and from evidence to a targeted change.",
          codeExample: {
            title: "Performance report template",
            code: `# Performance Debugging Report

## Baseline

Route:
Observed symptom:

Lighthouse result:

## Finding 1

Tool:
Evidence:
Root cause:

Change:
Result:

## Finding 2

Tool:
Evidence:
Root cause:

Change:
Result:

## Finding 3

Tool:
Evidence:
Root cause:

Change:
Result:

## Final verification

Lighthouse result:
Network findings:
React profiling findings:
Bundle findings:
Database findings:

## Conclusion

What changed:
What was measured:
What still needs investigation:`,
          },
          keyTakeaways: [
            "A performance report should explain the investigation, not just the final number.",
            "Record evidence from the tool that exposed each bottleneck.",
            "Performance debugging is a repeatable engineering process.",
            "The strongest result is a clear connection between symptom, evidence, fix, and measurement.",
          ],
          commonMistakes: [
            "Submitting only a Lighthouse screenshot.",
            "Claiming an optimization worked without a before-and-after comparison.",
            "Failing to explain why a particular change addressed the identified bottleneck.",
          ],
          miniQuiz: [
            {
              question:
                "What is the most important skill this project should demonstrate?",
              answer:
                "The ability to move from a user-visible performance symptom to measurable evidence, identify the underlying bottleneck, apply a targeted fix, and verify the result.",
            },
          ],
        },
      ],
    },
  ],
};

export const NEXTJS_DAY_34: LessonDay = {
  day: 34, title: NEXTJS_DAY_34_SOURCE.title, overview: NEXTJS_DAY_34_SOURCE.description, totalMinutes: 90, difficulty: "Advanced",
  lessons: NEXTJS_DAY_34_SOURCE.sections.map((section, index) => ({ id: `nextjs-34-${index + 1}`, title: section.title.replace(/^\d+(?:\.\d+)*\.?\s*/, ""), durationMinutes: section.subsections.length * 10, explanation: section.subsections.map((item) => `<b>${item.title.replace(/^\d+(?:\.\d+)*\.?\s*/, "")}</b>\n\n${item.explanation}`).join("\n\n"), diagram: section.subsections.map((item) => item.visualDiagram).filter(Boolean).join("\n\n"), codeExample: { title: "Section examples", code: section.subsections.map((item) => `// ${item.codeExample.title}\n${item.codeExample.code}`).join("\n\n") }, keyTakeaways: section.subsections.flatMap((item) => item.keyTakeaways), commonMistakes: section.subsections.flatMap((item) => item.commonMistakes), quiz: [], rawMiniQuiz: section.subsections.flatMap((item) => item.miniQuiz).map((item) => `<b>${item.question}</b>\n${item.answer}`).join("\n\n") })), finalQuiz: [{ question: "What should you do before optimizing?", options: ["Measure the bottleneck", "Guess", "Add client code", "Disable caching"], correctIndex: 0, explanation: "Measure first so the change targets the real cause." }], project: { name: "Performance project", goal: "Improve one measured user experience.", brief: "Use evidence before changing code.", steps: ["Record a baseline", "Find one bottleneck", "Verify the improvement"], acceptance: ["Before-and-after evidence is recorded"] },
};
