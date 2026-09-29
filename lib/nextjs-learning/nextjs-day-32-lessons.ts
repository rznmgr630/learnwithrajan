import type { LessonDay } from "@/lib/learn/lesson-types";

const NEXTJS_DAY_32_SOURCE = {
  day: 32,
  title: "Next.js Performance Fundamentals",
  description:
    "Learn how to think about performance in a modern Next.js App Router application. You will understand Core Web Vitals, LCP, CLS, INP, TTFB, bundle size, JavaScript execution, and server response time, then learn how to diagnose where a slow experience actually comes from before trying to optimize it.",
  sections: [
    {
      title: "1. How to Think About Web Performance",
      subsections: [
        {
          title: "1.1 Performance is the user's experience",
          explanation:
            "Performance is not simply the number of milliseconds your server takes to return a response. A user experiences a chain of events: they navigate to a URL, the browser connects to a server, the server starts returning a response, the browser receives HTML and other resources, visible content appears, and the page continues responding to interactions. A page can have a fast server but still feel slow if the browser has too much JavaScript to execute. It can also have a small JavaScript bundle but feel slow because the server takes too long to produce the first response.\n\nFor a beginner, think of performance as the question: how quickly and reliably can a real person see useful content and interact with it?\n\nNext.js gives you a server-first architecture that can reduce the amount of work sent to the browser, but it does not automatically make every application fast. Your data fetching, component boundaries, dependencies, rendering work, images, fonts, third-party scripts, and server infrastructure can all affect the final experience.\n\nThis is why performance work should begin with measurement rather than guesses. Before changing code, identify which part of the user's journey is actually slow.",
          visualDiagram:
            "User navigation\n        │\n        ▼\n┌──────────────────────┐\n│ Network + connection │\n└──────────┬───────────┘\n           │\n           ▼\n┌──────────────────────┐\n│ Server processing    │ ──────► TTFB\n└──────────┬───────────┘\n           │\n           ▼\n┌──────────────────────┐\n│ HTML + resources     │\n└──────────┬───────────┘\n           │\n           ├──────────────► LCP\n           │\n           ├──────────────► CLS\n           │\n           ▼\n┌──────────────────────┐\n│ Browser JS + events  │\n└──────────┬───────────┘\n           │\n           ▼\n          INP",
          codeExample: {
            title: "A performance-first page",
            code: `// app/dashboard/page.tsx

type DashboardStats = {
  revenue: number;
  orders: number;
};

async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch("https://api.example.com/dashboard");

  if (!response.ok) {
    throw new Error("Failed to load dashboard statistics");
  }

  return response.json();
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <main>
      <h1>Dashboard</h1>

      <section aria-label="Business statistics">
        <p>Revenue: {stats.revenue}</p>
        <p>Orders: {stats.orders}</p>
      </section>
    </main>
  );
}`,
          },
          keyTakeaways: [
            "Performance is an end-to-end user experience, not a single number.",
            "A fast server does not guarantee a fast browser experience.",
            "Measure the bottleneck before choosing an optimization.",
            "Next.js can reduce browser work, but application architecture still matters.",
          ],
          commonMistakes: [
            "Assuming a high Lighthouse score automatically means every real user has a fast experience.",
            "Optimizing code before identifying which metric or operation is actually slow.",
            "Treating server performance and browser performance as the same problem.",
            "Measuring only on a powerful development machine.",
          ],
          miniQuiz: [
            {
              question:
                "A page has a 200 ms server response but still feels slow because the browser executes a large amount of JavaScript. Is the server necessarily the bottleneck?",
              answer:
                "No. The browser's JavaScript execution can become the bottleneck even when the server responds quickly.",
            },
            {
              question:
                "Why should you measure before optimizing?",
              answer:
                "Because performance problems can come from different stages of the request and rendering process, and changing the wrong part can add complexity without improving the real user experience.",
            },
          ],
        },
        {
          title: "1.2 Lab performance and real-user performance",
          explanation:
            "There are two important ways to think about performance measurements. Lab testing runs your page in a controlled environment, such as Lighthouse. Field data comes from actual users using real devices, networks, browsers, and geographic locations.\n\nLab testing is useful because it gives you a repeatable environment for finding regressions. Field data is valuable because it shows what your users actually experience. These two views can disagree. A developer on a fast laptop and fast network may see a page perform well while users on slower mobile devices experience long interaction delays.\n\nFor production work, you should therefore avoid treating one local measurement as absolute truth. Next.js's current production guidance recommends using Lighthouse together with field Core Web Vitals data. The current Next.js analytics documentation also provides `useReportWebVitals` for reporting metrics yourself.",
          codeExample: {
            title: "A simple development measurement workflow",
            code: `# Build the application in production mode
npm run build

# Start the production build
npm run start

# Then test the production URL with your browser's
# performance tools or Lighthouse.`,
          },
          keyTakeaways: [
            "Lab tests are controlled and repeatable.",
            "Field data represents real users and real conditions.",
            "Use both kinds of measurement when investigating production performance.",
            "Do not judge performance solely from development mode.",
          ],
          commonMistakes: [
            "Testing only with `npm run dev` and assuming production behaves identically.",
            "Ignoring slower mobile devices and slower networks.",
            "Treating one Lighthouse run as a permanent performance guarantee.",
          ],
          miniQuiz: [
            {
              question:
                "Why can a field measurement differ from your local Lighthouse result?",
              answer:
                "Real users have different devices, networks, geographic locations, browsers, and usage patterns.",
            },
          ],
        },
      ],
    },
    {
      title: "2. Core Web Vitals: LCP, CLS, and INP",
      subsections: [
        {
          title: "2.1 Understanding LCP",
          explanation:
            "Largest Contentful Paint, or LCP, answers a simple user-facing question: when did the main content become visible?\n\nThe browser may paint several elements during loading. LCP tracks the largest relevant image, text block, or video visible in the viewport. The important idea is that LCP is about the part of the page that is visually most important to the user, not simply the first thing that appears.\n\nFor example, imagine a SaaS dashboard where the page header appears quickly but a large revenue chart or primary dashboard heading appears much later. The user may technically see something on the screen, but the page's main content is not ready. LCP helps expose that experience.\n\nA commonly used good threshold is an LCP of 2.5 seconds or less at the 75th percentile. Between 2.5 and 4 seconds needs improvement, and above 4 seconds is considered poor. These thresholds are guidelines, not guarantees that every user will perceive the page identically.\n\nLCP can be affected by server response time, connection setup, resource loading, and rendering. This means an LCP problem is not necessarily an image problem. You need to determine which part of the loading chain is delaying the LCP element.",
          visualDiagram:
            "Navigation\n    │\n    ▼\n┌───────────────┐\n│ HTML arrives  │\n└───────┬───────┘\n        │\n        ▼\n┌────────────────────────┐\n│ Browser renders page   │\n│ progressively           │\n└───────────┬────────────┘\n            │\n            ▼\n┌────────────────────────┐\n│ Largest visible content│\n│ becomes renderable      │\n└───────────┬────────────┘\n            │\n            ▼\n           LCP",
          codeExample: {
            title: "A dashboard with meaningful main content",
            code: `// app/dashboard/page.tsx

export default function DashboardPage() {
  return (
    <main>
      <h1>Sales dashboard</h1>

      <section aria-labelledby="revenue-heading">
        <h2 id="revenue-heading">Revenue this month</h2>
        <p>$84,240</p>
      </section>
    </main>
  );
}`,
          },
          keyTakeaways: [
            "LCP measures when the largest relevant visible content is rendered.",
            "LCP is a loading metric, not an interactivity metric.",
            "A good LCP target is 2.5 seconds or less at the 75th percentile.",
            "Slow LCP can involve the network, server, resources, or rendering path.",
          ],
          commonMistakes: [
            "Thinking LCP means the first pixel or first element rendered.",
            "Assuming every poor LCP score is caused by images.",
            "Optimizing an element that is not actually the page's LCP element.",
          ],
          miniQuiz: [
            {
              question:
                "A page displays its navigation immediately, but its large article heading appears after 4 seconds. Which metric is especially relevant?",
              answer: "LCP, because it measures when the largest relevant visible content appears.",
            },
            {
              question: "Is LCP the same thing as First Contentful Paint?",
              answer:
                "No. FCP measures the first content painted, while LCP focuses on the largest relevant content visible in the viewport.",
            },
          ],
        },
        {
          title: "2.2 Understanding CLS",
          explanation:
            "Cumulative Layout Shift, or CLS, measures visual instability. It captures unexpected movement of visible content while a page is loading or otherwise changing.\n\nImagine clicking an Add to Cart button just as a banner loads above it and pushes the button downward. Your click may land on something else. That is not merely annoying; it can cause real interaction errors.\n\nCLS is a unitless score. A commonly used good threshold is 0.1 or less at the 75th percentile. Scores above 0.25 are considered poor.\n\nThe key word is unexpected. If a user intentionally opens a menu and the layout moves as part of that interaction, that is different from content unexpectedly appearing and moving existing content. Common causes of poor CLS include images or embedded content without reserved dimensions and fonts that change the layout when they load.\n\nIn a Next.js application, layout stability is especially relevant to content-heavy pages such as ecommerce product listings, blogs, and dashboards containing dynamically loaded cards.",
          visualDiagram:
            "Initial page\n┌─────────────────────────┐\n│ Header                  │\n├─────────────────────────┤\n│ Product                 │\n│ [Add to cart]           │\n└─────────────────────────┘\n\nUnexpected content arrives\n┌─────────────────────────┐\n│ Header                  │\n├─────────────────────────┤\n│ Promotional banner      │\n├─────────────────────────┤\n│ Product                 │  ← moved\n│ [Add to cart]           │  ← moved\n└─────────────────────────┘\n\nUnexpected movement contributes to CLS.",
          codeExample: {
            title: "Reserve predictable space for an image",
            code: `import Image from "next/image";

export function ProductCard() {
  return (
    <article>
      <Image
        src="/products/coffee-machine.jpg"
        alt="Stainless steel coffee machine"
        width={640}
        height={480}
      />

      <h2>Pro Coffee Machine</h2>
      <p>$249</p>
    </article>
  );
}`,
          },
          keyTakeaways: [
            "CLS measures unexpected visual movement.",
            "CLS is unitless rather than measured in milliseconds.",
            "A good CLS target is 0.1 or less at the 75th percentile.",
            "Images, embeds, dynamically inserted content, and fonts can contribute to layout shifts.",
          ],
          commonMistakes: [
            "Adding images without predictable dimensions.",
            "Inserting banners above existing content after the page has rendered.",
            "Assuming every layout change is a CLS problem even when the user intentionally caused the change.",
          ],
          miniQuiz: [
            {
              question:
                "A product image loads and pushes the product title downward. What kind of problem is this?",
              answer:
                "It can be a CLS problem because content moved unexpectedly after the initial render.",
            },
            {
              question: "Is CLS measured in milliseconds?",
              answer:
                "No. CLS is a unitless score representing layout instability.",
            },
          ],
        },
        {
          title: "2.3 Understanding INP",
          explanation:
            "Interaction to Next Paint, or INP, measures responsiveness. Instead of asking how quickly the page loaded, it asks how quickly the page responds visually after users interact with it.\n\nThink about an admin dashboard with a filter button. The user clicks the filter and expects visible feedback. If a large amount of JavaScript is running on the browser's main thread, the click handler and rendering work may be delayed. The user experiences a button that appears frozen.\n\nINP observes qualifying interactions throughout the page visit, including clicks, taps, and keyboard interactions, and uses the interaction latency to characterize responsiveness. A commonly used good threshold is 200 milliseconds or less at the 75th percentile. Above 200 milliseconds and through 500 milliseconds needs improvement, while above 500 milliseconds is poor.\n\nThis is one reason JavaScript execution matters so much. JavaScript is not automatically bad, but unnecessary or expensive client-side JavaScript can compete with user interactions for time on the browser's main thread.",
          visualDiagram:
            "User clicks filter\n       │\n       ▼\n┌─────────────────────┐\n│ Event handler runs  │\n└─────────┬───────────┘\n          │\n          ▼\n┌─────────────────────┐\n│ Browser performs    │\n│ rendering work      │\n└─────────┬───────────┘\n          │\n          ▼\n┌─────────────────────┐\n│ Next visual frame   │\n└─────────────────────┘\n          │\n          ▼\n        INP",
          codeExample: {
            title: "A small interactive filter",
            code: `'use client';

import { useState } from "react";

export function StatusFilter() {
  const [status, setStatus] = useState("all");

  return (
    <label>
      Status
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="all">All</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
      </select>
    </label>
  );
}`,
          },
          keyTakeaways: [
            "INP measures responsiveness to user interactions.",
            "INP considers interaction latency throughout the page visit.",
            "A good INP target is 200 milliseconds or less at the 75th percentile.",
            "Expensive browser JavaScript can make interactions feel delayed.",
          ],
          commonMistakes: [
            "Thinking INP measures initial page loading.",
            "Testing only whether a click handler eventually works instead of measuring responsiveness.",
            "Putting large amounts of unnecessary interactive logic into client components.",
          ],
          miniQuiz: [
            {
              question:
                "A page loads quickly but its filter button takes 800 ms to visually respond. Which Core Web Vital should you investigate?",
              answer: "INP, because the problem is interaction responsiveness.",
            },
            {
              question:
                "Why can client-side JavaScript affect INP?",
              answer:
                "JavaScript execution can occupy the browser's main thread and delay event handling and the next visual update.",
            },
          ],
        },
      ],
    },
    {
      title: "3. TTFB, Server Response Time, and Rendering Work",
      subsections: [
        {
          title: "3.1 Understanding TTFB",
          explanation:
            "Time to First Byte, or TTFB, measures the time from the start of a navigation until the first byte of the response begins to arrive. It includes several parts of the request lifecycle, such as connection setup, DNS and TLS work, redirects, and server processing.\n\nTTFB is not one of the three Core Web Vitals, but it is an important foundational metric because the browser cannot receive the server's response until the server and network have progressed far enough to send it.\n\nA rough guideline from web.dev is 800 milliseconds or less for TTFB, with values above 1.8 seconds considered poor. These are useful diagnostic thresholds rather than promises that every application must hit exactly the same number.\n\nIn Next.js, server response time can be influenced by the work your server performs before it can produce the response. A page that waits for several slow operations before returning useful output can have a high TTFB. Infrastructure, geography, connection setup, and deployment architecture also matter.\n\nThis creates an important diagnostic distinction: if TTFB is already high, spending all your effort on browser-side code may not solve the primary problem.",
          visualDiagram:
            "Browser starts navigation\n          │\n          ▼\n┌─────────────────────────┐\n│ DNS / connection / TLS  │\n└────────────┬────────────┘\n             │\n             ▼\n┌─────────────────────────┐\n│ Server receives request │\n└────────────┬────────────┘\n             │\n             ▼\n┌─────────────────────────┐\n│ Server work             │\n│ data / rendering / etc. │\n└────────────┬────────────┘\n             │\n             ▼\n        First byte arrives\n             │\n             ▼\n            TTFB",
          codeExample: {
            title: "A server-rendered dashboard request",
            code: `// app/admin/page.tsx

async function getAdminSummary() {
  const response = await fetch("https://api.example.com/admin/summary");

  if (!response.ok) {
    throw new Error("Unable to load admin summary");
  }

  return response.json();
}

export default async function AdminPage() {
  const summary = await getAdminSummary();

  return (
    <main>
      <h1>Admin overview</h1>
      <p>Total users: {summary.totalUsers}</p>
      <p>Open tickets: {summary.openTickets}</p>
    </main>
  );
}`,
          },
          keyTakeaways: [
            "TTFB measures how long it takes before the first response byte arrives.",
            "TTFB is not itself a Core Web Vital.",
            "Network setup and server processing can both contribute to TTFB.",
            "High TTFB can delay downstream loading metrics such as LCP.",
          ],
          commonMistakes: [
            "Calling TTFB a Core Web Vital.",
            "Assuming TTFB measures only database query time.",
            "Ignoring network and connection setup when diagnosing TTFB.",
            "Trying to solve a server-response problem entirely with client-side changes.",
          ],
          miniQuiz: [
            {
              question: "Does TTFB measure only the time spent executing your server code?",
              answer:
                "No. It can include connection setup, DNS, TLS, redirects, and server processing before the first response byte arrives.",
            },
            {
              question:
                "Why can high TTFB contribute to a poor LCP?",
              answer:
                "If the initial response is delayed, the browser has to wait longer before it can receive and render the content needed for the page.",
            },
          ],
        },
        {
          title: "3.2 Server response time versus browser execution",
          explanation:
            "A useful production habit is to separate server work from browser work. Server work happens before or during the server response. Browser work happens after the browser receives resources and begins rendering and executing client code.\n\nConsider a SaaS settings page. Suppose the server needs 1.5 seconds to produce the initial response, and then the browser needs another 1.5 seconds to execute client JavaScript before the settings controls become responsive. Improving only one side leaves a significant part of the experience unchanged.\n\nIn the App Router, Server Components are rendered on the server and can keep server-only work out of the browser. Client Components are used when you need browser-side interactivity. The important performance question is therefore not simply whether a component is React. It is where the work needs to happen and how much work each environment must perform.\n\nDo not turn everything into a Client Component just because it contains a button somewhere in the UI. Keep interactive behavior localized when possible, while allowing surrounding content to remain server-rendered.",
          visualDiagram:
            "Request\n  │\n  ▼\n┌───────────────────────┐\n│ Server                │\n│                       │\n│ data + Server         │\n│ Component rendering   │\n└───────────┬───────────┘\n            │\n            ▼\n┌───────────────────────┐\n│ Browser               │\n│                       │\n│ HTML + required       │\n│ client JavaScript     │\n└───────────┬───────────┘\n            │\n            ▼\n      User interaction",
          codeExample: {
            title: "Keep the interactive boundary focused",
            code: `// app/settings/page.tsx

import { SaveButton } from "./save-button";

export default function SettingsPage() {
  return (
    <main>
      <h1>Account settings</h1>

      <section>
        <h2>Profile</h2>
        <p>Update your account information.</p>

        <SaveButton />
      </section>
    </main>
  );
}

// app/settings/save-button.tsx

"use client";

export function SaveButton() {
  return (
    <button type="button">
      Save changes
    </button>
  );
}`,
          },
          keyTakeaways: [
            "Server work and browser work are different performance problems.",
            "Server Components can keep server-only work out of the client bundle.",
            "Client Components are appropriate for browser interactivity.",
            "Performance improves when each piece of work runs in the environment where it is needed.",
          ],
          commonMistakes: [
            "Making an entire page a Client Component because one small control is interactive.",
            "Assuming server rendering means there is no browser-side work.",
            "Ignoring server latency because the client bundle is small.",
          ],
          miniQuiz: [
            {
              question:
                "If only a Save button needs browser interactivity, must the entire settings page become a Client Component?",
              answer:
                "No. The interactive part can be isolated in a Client Component while the surrounding page remains a Server Component.",
            },
          ],
        },
      ],
    },
    {
      title: "4. Bundle Size and JavaScript Execution",
      subsections: [
        {
          title: "4.1 Understanding bundle size",
          explanation:
            "A bundle is the generated application code and its dependencies that are delivered for execution. For client-side JavaScript, a larger amount of code can mean more bytes transferred and more work for the browser to parse, compile, and execute.\n\nThis matters particularly on mobile devices. A package that feels harmless on a fast development laptop can become expensive when hundreds of users access the application on slower hardware.\n\nCurrent Next.js documentation explains that Next.js automatically performs optimizations such as code splitting and tree-shaking, but applications can still contain unnecessarily large dependencies. Next.js provides bundle analysis tools to help identify which packages contribute significant amounts of code.\n\nDo not use bundle size as an isolated goal. A smaller bundle is useful when it reduces actual browser work or network transfer. Removing a tiny dependency that has no measurable impact may be less valuable than identifying one large dependency imported by a frequently visited route.",
          visualDiagram:
            "Application code\n      │\n      ├──────────────┐\n      ▼              ▼\nDependencies      Components\n      │              │\n      └──────┬───────┘\n             ▼\n        Build process\n             │\n             ▼\n      Optimized bundles\n             │\n             ▼\n       Browser download\n             │\n             ▼\n      Parse / compile / execute",
          codeExample: {
            title: "Analyze bundles in a current Next.js project",
            code: `# For the current Next.js Turbopack analyzer
# in supported Next.js versions:
pnpm next experimental-analyze

# You can also write the analysis output to disk:
pnpm next experimental-analyze --output`,
          },
          keyTakeaways: [
            "Client bundle size affects both network transfer and browser work.",
            "Next.js automatically performs important bundling optimizations.",
            "Large dependencies can still create unnecessary performance costs.",
            "Use bundle analysis to find actual sources of bundle growth.",
          ],
          commonMistakes: [
            "Assuming Next.js automatically removes every expensive dependency.",
            "Judging performance only by the total application bundle instead of the JavaScript needed for the relevant route.",
            "Removing dependencies without measuring whether they matter to real users.",
          ],
          miniQuiz: [
            {
              question:
                "Why can a large client bundle affect more than download time?",
              answer:
                "The browser also has to parse, compile, and execute the JavaScript.",
            },
            {
              question:
                "What should you do before removing a large dependency?",
              answer:
                "Identify where it is used, understand why it is needed, and measure whether changing it would improve the relevant performance problem.",
            },
          ],
        },
        {
          title: "4.2 JavaScript execution and the browser main thread",
          explanation:
            "JavaScript can affect performance after it has been downloaded. The browser must process the code, and expensive work can occupy the main thread where important user-interface tasks also occur.\n\nImagine an ecommerce admin page with a large table, charts, filtering logic, and several interactive controls. If the browser must execute a lot of code before it can respond to a click, the interface may feel frozen even though the network was fast.\n\nThis is why INP and JavaScript execution are connected. A smaller JavaScript payload is not automatically better in every situation, but unnecessary client JavaScript increases the amount of work the browser may have to perform.\n\nA production-minded Next.js developer therefore asks: does this component actually need to run in the browser? If it only displays server-provided information, it may not need client-side JavaScript at all.",
          codeExample: {
            title: "Prefer server rendering for display-only UI",
            code: `// app/orders/page.tsx

type Order = {
  id: string;
  customer: string;
  total: number;
};

async function getOrders(): Promise<Order[]> {
  const response = await fetch("https://api.example.com/orders");

  if (!response.ok) {
    throw new Error("Failed to load orders");
  }

  return response.json();
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <main>
      <h1>Orders</h1>

      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.customer}: \${order.total}
          </li>
        ))}
      </ul>
    </main>
  );
}`,
          },
          keyTakeaways: [
            "Downloaded JavaScript still has to be processed by the browser.",
            "Expensive JavaScript can delay user interactions.",
            "Server-rendered display-only UI does not automatically need client-side interactivity.",
            "Use Client Components when browser behavior is genuinely required.",
          ],
          commonMistakes: [
            "Adding `use client` to every component by default.",
            "Assuming a small compressed file must also be cheap to execute.",
            "Ignoring CPU cost on lower-powered devices.",
          ],
          miniQuiz: [
            {
              question:
                "Can a page have a reasonable download size but still suffer from JavaScript performance problems?",
              answer:
                "Yes. Parsing, compiling, and executing JavaScript can still consume significant browser CPU time.",
            },
            {
              question:
                "What is a useful question before adding `use client`?",
              answer:
                "Ask whether this component actually needs browser-side interactivity or browser-only APIs.",
            },
          ],
        },
      ],
    },
    {
      title: "5. Measuring and Diagnosing Performance in a Next.js App",
      subsections: [
        {
          title: "5.1 Measuring Core Web Vitals with Next.js",
          explanation:
            "Performance becomes useful to a production team when it can be measured repeatedly. Current Next.js App Router documentation provides the `useReportWebVitals` hook for collecting Web Vitals in a client component. This lets an application report metrics such as TTFB, LCP, CLS, and INP to its own analytics or monitoring system.\n\nThe hook requires a Client Component. A good architecture is therefore to create a small dedicated component for Web Vitals reporting rather than turning the entire root layout into a Client Component.\n\nThe important lesson is architectural: measurement code should be isolated so that adding observability does not unnecessarily expand the client-side boundary of your application.",
          visualDiagram:
            "Next.js application\n        │\n        ├─────────────── Server-rendered UI\n        │\n        └─────────────── Small Web Vitals Client Component\n                                  │\n                                  ▼\n                         useReportWebVitals()\n                                  │\n                                  ▼\n                         Analytics / monitoring",
          codeExample: {
            title: "A focused Web Vitals component",
            code: `// app/_components/web-vitals.tsx

"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log({
      name: metric.name,
      value: metric.value,
    });
  });

  return null;
}

// app/layout.tsx

import { WebVitals } from "./_components/web-vitals";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}`,
          },
          keyTakeaways: [
            "Next.js provides `useReportWebVitals` for custom Web Vitals reporting.",
            "The hook requires a Client Component.",
            "Keep the client boundary small by isolating performance monitoring.",
            "Production monitoring is more useful when metrics are tracked over time.",
          ],
          commonMistakes: [
            "Turning the entire application into a Client Component just to collect metrics.",
            "Logging metrics locally and never monitoring them in production.",
            "Treating one measurement as representative of every user.",
          ],
          miniQuiz: [
            {
              question:
                "Why should a Web Vitals component be kept small?",
              answer:
                "Because the monitoring hook needs a Client Component boundary, and isolating it prevents unnecessary parts of the application from becoming client-side code.",
            },
          ],
        },
        {
          title: "5.2 A practical performance diagnosis workflow",
          explanation:
            "When a production page feels slow, avoid immediately applying an optimization technique from a checklist. Start by describing the symptom precisely.\n\nIf the page takes a long time before the response begins, investigate TTFB and server-side work. If the server responds quickly but the main content appears late, investigate the loading path and LCP. If the page jumps around while loading, investigate CLS. If the page loads quickly but buttons or filters feel delayed, investigate INP and browser JavaScript execution. If a route ships unexpectedly large client JavaScript, inspect its bundle composition and Client Component boundaries.\n\nThis approach prevents a common engineering mistake: solving a different problem from the one users actually have.\n\nFor example, suppose an ecommerce product page has an LCP of 4.2 seconds. Before changing component architecture, determine whether the LCP element is delayed because the server response is slow, because the resource needed for the LCP element arrives late, or because the browser spends too much time processing before painting it. Each cause points toward a different solution.\n\nThe goal of Day 31 is not to memorize an optimization checklist. The goal is to develop the diagnostic model that you will use in Day 32 when you begin applying optimization techniques.",
          visualDiagram:
            "User reports: \"The page is slow.\"\n                │\n                ▼\n       Measure the experience\n                │\n                ▼\n       ┌─────────────────┐\n       │ Which symptom?  │\n       └────────┬────────┘\n                │\n     ┌──────────┼───────────┬────────────┐\n     ▼          ▼           ▼            ▼\n  Slow first  Main content  Layout      Slow\n  response   appears late   jumps      interaction\n     │          │           │            │\n    TTFB       LCP         CLS          INP\n     │          │           │            │\n     └──────────┴───────────┴────────────┘\n                │\n                ▼\n       Find the underlying cause\n                │\n                ▼\n          Choose an intervention",
          codeExample: {
            title: "A simple diagnosis checklist in code comments",
            code: `// Performance investigation notes:
//
// 1. Check TTFB.
//    If high, investigate network and server response work.
//
// 2. Check LCP.
//    Identify the actual LCP element and determine what delays it.
//
// 3. Check CLS.
//    Look for unexpected movement caused by content or resource sizing.
//
// 4. Check INP.
//    Identify interactions that respond slowly and inspect browser work.
//
// 5. Inspect client JavaScript.
//    Identify unexpectedly large dependencies and broad Client Component
//    boundaries.
//
// 6. Repeat the measurement after a change.
//    An optimization is useful only if the relevant experience improves.`,
          },
          keyTakeaways: [
            "Start with the user-visible symptom and the relevant metric.",
            "Use TTFB to investigate the early request and server path.",
            "Use LCP for main-content loading performance.",
            "Use CLS for unexpected visual movement.",
            "Use INP for interaction responsiveness.",
            "Inspect bundle size and JavaScript execution when browser work is suspected.",
            "Measure again after making a change.",
          ],
          commonMistakes: [
            "Optimizing images when the real problem is a slow server response.",
            "Reducing bundle size when the actual problem is unexpected layout movement.",
            "Using a single performance number to explain every kind of slowness.",
            "Making many changes at once so you cannot tell which change affected the result.",
            "Optimizing for a lab score while ignoring real-user measurements.",
          ],
          miniQuiz: [
            {
              question:
                "A page's TTFB is very high, while the browser executes very little JavaScript. Where should the investigation begin?",
              answer:
                "Begin with the request and server path, including connection setup and server-side work contributing to the response delay.",
            },
            {
              question:
                "A dashboard loads quickly but its filter interaction feels frozen. Which metric should be investigated first?",
              answer:
                "INP, followed by investigation of the JavaScript and rendering work associated with the slow interaction.",
            },
            {
              question:
                "A page's content moves unexpectedly when an image appears. Which metric is relevant?",
              answer: "CLS.",
            },
          ],
        },
        {
          title: "5.3 Production performance is an ongoing process",
          explanation:
            "Performance is not a task you complete once and forget. Applications change. A new dependency may increase client JavaScript. A new dashboard widget may increase server work. A new marketing banner may introduce layout movement. A new analytics integration may affect loading behavior.\n\nThat is why production teams monitor performance over time. Current Next.js guidance recommends running `next build` and `next start` to evaluate a production-like build, using Lighthouse for controlled testing, and pairing that with field Core Web Vitals data. Next.js also provides instrumentation conventions for integrating monitoring and observability tools into production applications.\n\nA mature performance workflow therefore looks like this: establish a baseline, identify a problem, make one meaningful change, measure again, and monitor the result after deployment.\n\nDo not chase perfect numbers simply for the sake of numbers. Performance targets should support a useful, responsive product for your actual users and devices.",
          codeExample: {
            title: "A production-oriented measurement sequence",
            code: `# Build exactly what you intend to test
npm run build

# Run the production build
npm run start

# Measure the resulting application.
# Use your browser performance tools and Lighthouse,
# then compare the findings with production field data.`,
          },
          keyTakeaways: [
            "Performance should be monitored continuously.",
            "Production builds are more representative than development mode.",
            "Use controlled testing and real-user measurements together.",
            "Track changes over time rather than relying on a single measurement.",
          ],
          commonMistakes: [
            "Only measuring performance before the first production launch.",
            "Assuming a successful optimization remains optimal after future feature work.",
            "Treating a performance score as more important than the user experience it represents.",
          ],
          miniQuiz: [
            {
              question:
                "Why should performance be monitored after deployment?",
              answer:
                "Because application code, dependencies, infrastructure, and user conditions change over time and can introduce new performance regressions.",
            },
            {
              question:
                "What is a useful production performance loop?",
              answer:
                "Measure, identify the bottleneck, make a targeted change, measure again, and continue monitoring after deployment.",
            },
          ],
        },
      ],
    },
  ],
};

export const NEXTJS_DAY_32: LessonDay = {
  day: NEXTJS_DAY_32_SOURCE.day,
  title: NEXTJS_DAY_32_SOURCE.title,
  overview: NEXTJS_DAY_32_SOURCE.description,
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: NEXTJS_DAY_32_SOURCE.sections.map((section, sectionIndex) => {
    const subsections = section.subsections;
    return {
      id: `nextjs-32-${sectionIndex + 1}`, title: section.title.replace(/^\d+(?:\.\d+)*\.?\s*/, ""), durationMinutes: subsections.length * 10,
      explanation: subsections.map((subsection) => `<b>${subsection.title.replace(/^\d+(?:\.\d+)*\.?\s*/, "")}</b>\n\n${subsection.explanation}`).join("\n\n"),
      diagram: subsections.map((subsection) => subsection.visualDiagram).filter(Boolean).join("\n\n"),
      codeExample: { title: "Section examples", code: subsections.map((subsection) => `// ${subsection.codeExample.title}\n${subsection.codeExample.code}`).join("\n\n") },
      keyTakeaways: subsections.flatMap((subsection) => subsection.keyTakeaways), commonMistakes: subsections.flatMap((subsection) => subsection.commonMistakes), quiz: [],
      rawMiniQuiz: subsections.flatMap((subsection) => subsection.miniQuiz).map((item) => `<b>${item.question}</b>\n${item.answer}`).join("\n\n"),
    };
  }),
  finalQuiz: [{ question: "What should you do before optimizing?", options: ["Measure the bottleneck", "Guess", "Add client code", "Disable caching"], correctIndex: 0, explanation: "Measure first so the change targets the real cause." }], project: { name: "Performance project", goal: "Improve one measured user experience.", brief: "Use evidence before changing code.", steps: ["Record a baseline", "Find one bottleneck", "Verify the improvement"], acceptance: ["Before-and-after evidence is recorded"] },
};
