import type { LessonDay } from "@/lib/learn/lesson-types";

const NEXTJS_DAY_31_SOURCE = {
  day: 31,
  title: "Next.js Performance Fundamentals",
  description:
    "Learn how to understand, measure, and improve performance in a Next.js App Router application. You will learn how Core Web Vitals describe user experience, how server response time and TTFB affect loading, how bundle size and JavaScript execution affect the browser, and how to investigate performance problems systematically before optimizing.",
  sections: [
    {
      title: "1. Understanding Next.js Performance",
      subsections: [
        {
          title: "1.1 What web performance actually means",
          explanation:
            "Web performance is about how quickly and smoothly a user can use your application. A page can have a fast server response but still feel slow if the browser takes too long to display the main content. Likewise, a page can load quickly but feel frustrating if clicking a button causes the interface to freeze.\n\nFor a Next.js application, performance can be affected at several stages: the request reaching the server, server-side work, the response traveling to the browser, browser resource loading, rendering, JavaScript execution, and user interaction.\n\nThis is why performance should not be treated as a single number. Different metrics describe different parts of the user's experience.\n\nFor example, a SaaS dashboard might have slow database queries that delay the initial response. An ecommerce product page might have a huge hero image that delays the main content. An admin panel might load quickly but become unresponsive because a large JavaScript calculation runs when the user changes a filter.\n\nThe first skill in performance engineering is therefore learning to identify which part of the experience is actually slow.",
          visualDiagram:
            "User\n  │\n  │ Request\n  ▼\n┌─────────────────────────┐\n│ Next.js server          │\n│ routing + server work   │\n└───────────┬─────────────┘\n            │\n            │ Response\n            ▼\n┌─────────────────────────┐\n│ Browser                 │\n│ HTML + CSS + images     │\n│ JavaScript + fonts      │\n└───────────┬─────────────┘\n            │\n            ▼\n┌─────────────────────────┐\n│ Rendering               │\n│ LCP + CLS               │\n└───────────┬─────────────┘\n            │\n            ▼\n┌─────────────────────────┐\n│ User interaction        │\n│ JavaScript + rendering  │\n│ INP                     │\n└─────────────────────────┘",
          codeExample: {
            title: "A page contains several performance boundaries",
            code:
              "import Image from \"next/image\";\n\nexport default function ProductPage() {\n  return (\n    <main>\n      <h1>Tokyo Travel Backpack</h1>\n\n      <Image\n        src=\"/products/tokyo-backpack.jpg\"\n        alt=\"Tokyo Travel Backpack\"\n        width={1200}\n        height={900}\n      />\n\n      <p>\n        A lightweight backpack designed for everyday travel.\n      </p>\n    </main>\n  );\n}",
          },
          keyTakeaways: [
            "Performance is a user-experience problem, not simply a code-size problem.",
            "Different metrics describe different stages of the user's experience.",
            "Always identify the bottleneck before deciding what to optimize.",
          ],
          commonMistakes: [
            "Treating every performance problem as a JavaScript problem.",
            "Optimizing code before measuring the application.",
            "Assuming a page is fast because it loads quickly on the developer's computer.",
          ],
          miniQuiz: [
            {
              question:
                "Why is web performance not represented by a single metric?",
              answer:
                "Because loading, visual stability, server response, and user interaction are different parts of the experience and can have different problems.",
            },
          ],
        },
        {
          title: "1.2 Lab testing and real-user performance",
          explanation:
            "Performance testing usually falls into two broad categories: lab testing and field testing.\n\nLab testing uses a controlled environment. Tools such as Lighthouse and browser DevTools allow you to test a page under specific CPU and network conditions. This is useful during development because you can reproduce problems and compare changes.\n\nField data comes from real users. Real users have different phones, laptops, networks, locations, and browsing conditions. Their experiences can therefore be very different from the developer's local machine.\n\nFor example, a dashboard might feel instant on a developer's MacBook connected to a fast internet connection but take noticeably longer for a customer using a mid-range mobile device on a slower network.\n\nUse lab testing to diagnose and reproduce problems, but understand that production performance should ultimately be evaluated using real-user measurements as well.",
          codeExample: {
            title: "Measure a production build",
            code:
              "npm run build\nnpm run start",
          },
          keyTakeaways: [
            "Development mode is not representative of production performance.",
            "Lab testing is useful for controlled diagnosis.",
            "Real-user data shows how the application performs across actual devices and networks.",
          ],
          commonMistakes: [
            "Running performance tests only in development mode.",
            "Testing only on a powerful developer computer.",
            "Treating one Lighthouse result as representative of every user.",
          ],
          miniQuiz: [
            {
              question:
                "Why should final performance testing use a production build?",
              answer:
                "Because development mode includes development-specific behavior and does not represent how the optimized production application is delivered and executed.",
            },
          ],
        },
      ],
    },
    {
      title: "2. Core Web Vitals: LCP, CLS, and INP",
      subsections: [
        {
          title: "2.1 LCP: getting the main content on screen",
          explanation:
            "Largest Contentful Paint, or LCP, measures how quickly the largest relevant image, text block, or video visible in the viewport is rendered.\n\nIn plain English, LCP answers: how long did the user wait before the important content appeared?\n\nThe current recommended LCP target is 2.5 seconds or less at the 75th percentile. More than 4 seconds is considered poor. LCP is one of the three Core Web Vitals.\n\nImagine an ecommerce product page. The product title may appear quickly, but the large product image might be the largest visible element. If that image takes too long to load, LCP can be delayed.\n\nLCP can also be delayed by server response time, render-blocking resources, slow fonts, or other resources required before the largest element can be displayed.\n\nNext.js provides the `Image` component to help optimize image delivery. Once you have identified the actual LCP image, you can use the appropriate image loading behavior rather than blindly prioritizing every image.",
          visualDiagram:
            "Navigation\n    │\n    ▼\n┌──────────────────┐\n│ Server response  │\n└────────┬─────────┘\n         │\n         ▼\n┌──────────────────┐\n│ HTML + resources │\n└────────┬─────────┘\n         │\n         ▼\n┌──────────────────┐\n│ Largest visible  │\n│ element renders  │\n└────────┬─────────┘\n         │\n         ▼\n        LCP",
          codeExample: {
            title: "Optimized product hero image",
            code:
              "import Image from \"next/image\";\n\nexport default function ProductHero() {\n  return (\n    <section>\n      <h1>Tokyo Travel Backpack</h1>\n\n      <Image\n        src=\"/products/tokyo-backpack.jpg\"\n        alt=\"Tokyo Travel Backpack\"\n        width={1200}\n        height={900}\n        priority\n      />\n    </section>\n  );\n}",
          },
          keyTakeaways: [
            "LCP measures when the largest relevant visible content is rendered.",
            "A good LCP target is 2.5 seconds or less at the 75th percentile.",
            "Slow server responses and slow resources can both contribute to poor LCP.",
          ],
          commonMistakes: [
            "Thinking LCP only measures image loading.",
            "Adding `priority` to every image.",
            "Ignoring server response time when investigating a slow LCP.",
          ],
          miniQuiz: [
            {
              question: "What does LCP tell you?",
              answer:
                "It tells you how quickly the largest relevant visible content element becomes rendered.",
            },
          ],
        },
        {
          title: "2.2 CLS: preventing unexpected movement",
          explanation:
            "Cumulative Layout Shift, or CLS, measures unexpected movement of visible content while a page is being loaded or used.\n\nImagine clicking a Buy button just as an image above it loads. The image pushes the button downward, and your click may hit something else. That is the kind of poor experience CLS is designed to identify.\n\nA CLS score of 0.1 or less at the 75th percentile is considered good.\n\nImages without predictable dimensions are a common source of layout shifts. Dynamically inserted banners, advertisements, embeds, and font changes can also cause movement.\n\nThe important idea is to reserve space for content before it arrives. Next.js's `Image` component helps by working with known image dimensions, while the Next.js font system is designed to optimize font loading and help prevent layout shift.",
          visualDiagram:
            "Without reserved space\n\n┌──────────────────────┐\n│ Product title        │\n├──────────────────────┤\n│ Buy button           │\n└──────────────────────┘\n\nImage loads\n      ↓\n\n┌──────────────────────┐\n│ Product title        │\n├──────────────────────┤\n│ Large image          │\n├──────────────────────┤\n│ Buy button moved ↓   │\n└──────────────────────┘\n\nWith reserved space\n\n┌──────────────────────┐\n│ Product title        │\n├──────────────────────┤\n│ Reserved image area  │\n├──────────────────────┤\n│ Buy button           │\n└──────────────────────┘",
          codeExample: {
            title: "Give images predictable dimensions",
            code:
              "import Image from \"next/image\";\n\nexport function ProductCard() {\n  return (\n    <article>\n      <Image\n        src=\"/products/headphones.jpg\"\n        alt=\"Wireless headphones\"\n        width={640}\n        height={640}\n      />\n\n      <h2>Wireless Headphones</h2>\n      <p>$149</p>\n    </article>\n  );\n}",
          },
          keyTakeaways: [
            "CLS measures unexpected visual movement.",
            "A good CLS target is 0.1 or less at the 75th percentile.",
            "Reserving space for dynamic content helps maintain visual stability.",
          ],
          commonMistakes: [
            "Rendering images without predictable dimensions.",
            "Inserting content above existing content without reserving space.",
            "Ignoring font-related layout movement.",
          ],
          miniQuiz: [
            {
              question: "What type of problem does CLS detect?",
              answer:
                "Unexpected movement of visible page content while the page is loading or changing.",
            },
          ],
        },
        {
          title: "2.3 INP: making interactions feel responsive",
          explanation:
            "Interaction to Next Paint, or INP, measures how responsive a page is when users interact with it.\n\nLCP asks whether the page became useful quickly. INP asks whether the page responds quickly after the user does something.\n\nConsider an admin dashboard with a status filter. The user clicks a filter and expects the table or interface to respond. If the click starts a large JavaScript calculation that blocks the browser's main thread, the interface can feel frozen.\n\nA good INP target is 200 milliseconds or less at the 75th percentile. More than 500 milliseconds is considered poor.\n\nINP replaced First Input Delay as the Core Web Vital for responsiveness. Unlike FID, INP considers interactions throughout the page's lifetime rather than focusing only on the first interaction.\n\nLarge JavaScript bundles, expensive event handlers, long-running calculations, and expensive rendering can all contribute to poor responsiveness.",
          visualDiagram:
            "User interaction\n       │\n       ▼\n┌──────────────────────┐\n│ Event handler        │\n│ JavaScript execution │\n└──────────┬───────────┘\n           │\n           ▼\n┌──────────────────────┐\n│ Rendering work       │\n└──────────┬───────────┘\n           │\n           ▼\n┌──────────────────────┐\n│ Next visual paint    │\n└──────────────────────┘\n\n              ↑\n             INP",
          codeExample: {
            title: "Keep interactive code focused",
            code:
              "\"use client\";\n\nimport { useState } from \"react\";\n\nexport function StatusFilter() {\n  const [status, setStatus] = useState(\"all\");\n\n  return (\n    <label>\n      Status\n      <select\n        value={status}\n        onChange={(event) => setStatus(event.target.value)}\n      >\n        <option value=\"all\">All</option>\n        <option value=\"paid\">Paid</option>\n        <option value=\"pending\">Pending</option>\n      </select>\n    </label>\n  );\n}",
          },
          keyTakeaways: [
            "INP measures responsiveness to user interactions.",
            "A good INP target is 200 milliseconds or less at the 75th percentile.",
            "JavaScript execution and expensive interaction handlers can hurt INP.",
          ],
          commonMistakes: [
            "Thinking performance ends after the initial page load.",
            "Making an entire dashboard a Client Component for one interactive control.",
            "Performing expensive synchronous work directly inside interaction handlers.",
          ],
          miniQuiz: [
            {
              question:
                "What is the main performance concern measured by INP?",
              answer:
                "How quickly the interface responds visually after user interactions such as clicks, taps, or keyboard input.",
            },
          ],
        },
      ],
    },
    {
      title: "3. TTFB and Server Response Time",
      subsections: [
        {
          title: "3.1 Understanding TTFB",
          explanation:
            "Time to First Byte, or TTFB, measures how long it takes from starting a navigation until the first byte of the response begins arriving.\n\nTTFB is not one of the three Core Web Vitals, but it is an important supporting performance metric because it occurs early in the loading process.\n\nA rough target is 800 milliseconds or less, although the appropriate target depends on the application and delivery architecture.\n\nFor a Next.js page, the server may need to perform several operations before it can begin responding. These can include reading data, querying a database, calling another service, performing authentication checks, or doing server-side computation.\n\nIf that work takes 1.5 seconds, the browser cannot receive the response immediately. This can push back the rest of the loading timeline and make it harder to achieve a fast LCP.\n\nThe key lesson is that server rendering is not automatically fast. Server-side work can reduce client-side JavaScript while simultaneously increasing server response time if the server has too much work to perform.",
          visualDiagram:
            "Browser\n  │\n  │ Request\n  ▼\n┌──────────────────────────┐\n│ Network / connection     │\n└────────────┬─────────────┘\n             │\n             ▼\n┌──────────────────────────┐\n│ Next.js server           │\n│ database                 │\n│ external APIs            │\n│ server computation       │\n└────────────┬─────────────┘\n             │\n             │ First byte\n             ▼\n            TTFB",
          codeExample: {
            title: "Server work can affect response time",
            code:
              "type Revenue = {\n  total: number;\n};\n\nasync function getRevenue(): Promise<Revenue> {\n  const response = await fetch(\"https://api.example.com/revenue\");\n\n  if (!response.ok) {\n    throw new Error(\"Failed to load revenue\");\n  }\n\n  return response.json();\n}\n\nexport default async function DashboardPage() {\n  const revenue = await getRevenue();\n\n  return (\n    <main>\n      <h1>Revenue</h1>\n      <p>${revenue.total.toLocaleString()}</p>\n    </main>\n  );\n}",
          },
          keyTakeaways: [
            "TTFB measures how quickly the first response byte begins arriving.",
            "Database queries and external API calls can increase TTFB.",
            "TTFB is not a Core Web Vital but can influence the overall loading experience.",
          ],
          commonMistakes: [
            "Assuming Server Components automatically mean fast responses.",
            "Ignoring slow backend dependencies.",
            "Trying to fix a slow server response with browser-side optimization alone.",
          ],
          miniQuiz: [
            {
              question:
                "Why can a slow database query hurt the user's loading experience?",
              answer:
                "If the server waits for the query before producing the response, the browser may have to wait longer before receiving the first response byte.",
            },
          ],
        },
        {
          title: "3.2 Server work versus client work",
          explanation:
            "Next.js applications often require a balance between server-side and client-side work.\n\nServer-side work can reduce the amount of JavaScript sent to the browser, which is useful because the browser does not need to execute server-only code. However, expensive server work can increase the time required to produce the response.\n\nClient-side work can make interfaces highly interactive, but JavaScript must be downloaded, parsed, compiled, and executed on the user's device.\n\nThere is therefore no rule saying that all work should move to the server or all work should move to the client. The right decision depends on what the feature actually needs.\n\nFor example, a SaaS dashboard can fetch initial order data on the server while keeping a status filter as a small Client Component. The table does not need to become a Client Component just because the filter is interactive.",
          visualDiagram:
            "                  Feature\n                     │\n          ┌──────────┴──────────┐\n          ▼                     ▼\n     Server work            Client work\n          │                     │\n          ▼                     ▼\n   Less browser JS       More browser JS\n          │                     │\n          ▼                     ▼\n    Possible TTFB cost    Possible CPU cost\n          │                     │\n          └──────────┬──────────┘\n                     ▼\n              Measure and choose",
          codeExample: {
            title: "Server-rendered dashboard with focused interactivity",
            code:
              "import { StatusFilter } from \"./_components/status-filter\";\n\nexport default async function OrdersPage() {\n  const orders = await getOrders();\n\n  return (\n    <main>\n      <h1>Orders</h1>\n      <StatusFilter />\n      <OrderTable orders={orders} />\n    </main>\n  );\n}\n\nasync function getOrders() {\n  return [\n    { id: \"ORD-1001\", status: \"paid\" },\n    { id: \"ORD-1002\", status: \"pending\" },\n  ];\n}\n\nfunction OrderTable({\n  orders,\n}: {\n  orders: Array<{ id: string; status: string }>;\n}) {\n  return (\n    <ul>\n      {orders.map((order) => (\n        <li key={order.id}>\n          {order.id}: {order.status}\n        </li>\n      ))}\n    </ul>\n  );\n}",
          },
          keyTakeaways: [
            "Server and client execution have different performance costs.",
            "A focused Client Component can keep unnecessary JavaScript out of the browser.",
            "Performance architecture is a trade-off rather than a simple server-versus-client rule.",
          ],
          commonMistakes: [
            "Making an entire page client-side because one control needs state.",
            "Moving expensive server work into the browser without measuring the effect.",
            "Assuming server execution is automatically faster than browser execution.",
          ],
          miniQuiz: [
            {
              question:
                "Why might you keep a dashboard page as a Server Component while making its filter a Client Component?",
              answer:
                "The dashboard data can be rendered on the server while the filter can receive the client-side state and event handling it actually needs.",
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
            "A client JavaScript bundle is code that the browser needs to download and process. More JavaScript can mean more network transfer and more browser CPU work.\n\nNext.js automatically performs optimizations such as code splitting and tree-shaking, but your application's dependencies can still make the client bundle unnecessarily large.\n\nAn important distinction is that the total size of your project is not the same as the amount of JavaScript sent to the browser. A package used only by server-side code does not have the same client-side cost as a package imported by a Client Component.\n\nFor example, imagine an admin dashboard using a large visualization library. If that library is imported into a Client Component that appears throughout the application, it can become part of the browser-side JavaScript. Before adding a dependency, ask whether the browser actually needs it.\n\nWhen bundle size is suspected, analyze the bundle rather than guessing which package is responsible.",
          visualDiagram:
            "Application code\n      │\n      ├──────────────────┐\n      │                  │\n      ▼                  ▼\n Server code        Client code\n      │                  │\n      │                  ▼\n      │            Browser bundle\n      │                  │\n      │                  ▼\n      │             Download\n      │                  │\n      │                  ▼\n      │             Parse/compile\n      │                  │\n      │                  ▼\n      │              Execute\n      ▼\n Server execution",
          codeExample: {
            title: "Analyze the production bundle",
            code:
              "npm install @next/bundle-analyzer\n\nANALYZE=true npm run build",
          },
          keyTakeaways: [
            "Client bundle size affects both network transfer and browser work.",
            "The size of `node_modules` does not tell you the size of your browser bundle.",
            "Use bundle analysis to identify large client-side dependencies.",
          ],
          commonMistakes: [
            "Assuming every installed dependency is downloaded by every browser.",
            "Removing dependencies without measuring their actual client-side impact.",
            "Ignoring where a dependency is imported.",
          ],
          miniQuiz: [
            {
              question:
                "Is the total size of `node_modules` a useful measurement of browser bundle size?",
              answer:
                "No. Only code that becomes part of the relevant client bundles contributes to the browser-side JavaScript sent to users.",
            },
          ],
        },
        {
          title: "4.2 JavaScript execution and the browser main thread",
          explanation:
            "JavaScript performance is not only about how many bytes are downloaded. After JavaScript reaches the browser, the browser must parse, compile, and execute it.\n\nExpensive JavaScript can occupy the browser's main thread. While that work is happening, the browser may have less opportunity to process input, update the interface, and paint new frames.\n\nThis becomes especially important for INP. A large or poorly structured client application can respond slowly even when its network transfer is acceptable.\n\nCommon sources of expensive work include large computations, expensive rendering, large event handlers, unnecessary repeated calculations, and JavaScript libraries that perform substantial work during interaction.\n\nReact provides optimization APIs such as `useMemo`, `useCallback`, and `memo`, but these should not be added everywhere. They are performance tools, not default requirements. Measure the problem first and optimize the expensive work that actually matters.",
          codeExample: {
            title: "Memoize a measured expensive calculation",
            code:
              "\"use client\";\n\nimport { useMemo } from \"react\";\n\ntype Order = {\n  id: string;\n  total: number;\n};\n\nexport function RevenueSummary({ orders }: { orders: Order[] }) {\n  const totalRevenue = useMemo(\n    () => orders.reduce((sum, order) => sum + order.total, 0),\n    [orders]\n  );\n\n  return <p>Total revenue: ${totalRevenue.toLocaleString()}</p>;\n}",
          },
          keyTakeaways: [
            "JavaScript can be expensive after it has already been downloaded.",
            "Long main-thread tasks can make interactions feel slow.",
            "React optimization APIs should be used in response to measured performance problems.",
          ],
          commonMistakes: [
            "Adding `useMemo` to every calculation.",
            "Assuming memoization automatically improves every render.",
            "Ignoring expensive event handlers because the bundle itself looks small.",
          ],
          miniQuiz: [
            {
              question:
                "Why can a small JavaScript bundle still cause poor INP?",
              answer:
                "The downloaded JavaScript can still perform expensive synchronous work that blocks the browser's main thread.",
            },
          ],
        },
        {
          title: "4.3 Keeping Client Components focused",
          explanation:
            "The App Router makes it possible to keep much of an application's UI on the server while using Client Components only where browser-side behavior is needed.\n\nA component should generally become a Client Component when it needs client-side capabilities such as state, event handlers, or browser APIs.\n\nFor example, an ecommerce product page may contain a product title, description, price, stock information, and reviews. Those parts do not automatically need to become Client Components. A quantity selector or interactive Add to Cart control may need client-side state and event handling.\n\nKeeping the boundary focused helps prevent unnecessary JavaScript from moving into the browser.\n\nThis does not mean Client Components are bad. Interactive applications need them. The performance mistake is making a much larger part of the application client-side than the feature requires.",
          visualDiagram:
            "Product page\n│\n├── Product title           Server\n├── Description             Server\n├── Price                   Server\n├── Inventory               Server\n├── Reviews                 Server\n│\n└── Purchase controls\n    │\n    └── Quantity selector   Client",
          codeExample: {
            title: "Small Client Component for product interaction",
            code:
              "\"use client\";\n\nimport { useState } from \"react\";\n\nexport function QuantitySelector() {\n  const [quantity, setQuantity] = useState(1);\n\n  return (\n    <div>\n      <button\n        type=\"button\"\n        onClick={() => setQuantity((value) => Math.max(1, value - 1))}\n      >\n        -\n      </button>\n\n      <span>{quantity}</span>\n\n      <button\n        type=\"button\"\n        onClick={() => setQuantity((value) => value + 1)}\n      >\n        +\n      </button>\n    </div>\n  );\n}",
          },
          keyTakeaways: [
            "Client Components should be used when client-side capabilities are required.",
            "Keeping the client boundary small can reduce unnecessary browser JavaScript.",
            "Server and Client Components can be combined within the same feature.",
          ],
          commonMistakes: [
            "Adding `\"use client\"` to the root of a large page because one child needs state.",
            "Making all ecommerce or dashboard UI client-side.",
            "Avoiding Client Components entirely even when interaction genuinely requires them.",
          ],
          miniQuiz: [
            {
              question:
                "What should determine whether a component needs `\"use client\"`?",
              answer:
                "Whether the component needs client-side capabilities such as state, event handlers, or browser APIs.",
            },
          ],
        },
      ],
    },
    {
      title: "5. Measuring, Debugging, and Improving Performance",
      subsections: [
        {
          title: "5.1 Measuring Web Vitals in Next.js",
          explanation:
            "Next.js provides `useReportWebVitals` for reporting Web Vitals from your application. In the App Router, the recommended pattern is to put the hook inside a small Client Component and render that component from the root layout.\n\nThe reported metrics can include values such as LCP, CLS, INP, and TTFB. The metric name tells you which measurement was received.\n\nDuring development, you can log the measurements to understand how the API works. In a production application, the callback can send the measurements to your monitoring or analytics system.\n\nKeep the monitoring component small. You do not need to turn your entire root layout into a Client Component just to collect Web Vitals.",
          codeExample: {
            title: "Report Web Vitals from a small Client Component",
            code:
              "\"use client\";\n\nimport { useReportWebVitals } from \"next/web-vitals\";\n\nexport function WebVitals() {\n  useReportWebVitals((metric) => {\n    console.log(metric.name, metric.value);\n  });\n\n  return null;\n}\n\n// app/layout.tsx\nimport { WebVitals } from \"./_components/web-vitals\";\n\nexport default function RootLayout({\n  children,\n}: Readonly<{\n  children: React.ReactNode;\n}>) {\n  return (\n    <html lang=\"en\">\n      <body>\n        {children}\n        <WebVitals />\n      </body>\n    </html>\n  );\n}",
          },
          keyTakeaways: [
            "Next.js provides `useReportWebVitals` for application-level Web Vitals reporting.",
            "Keep performance monitoring isolated in a small Client Component.",
            "Use measurements to understand real performance rather than relying on assumptions.",
          ],
          commonMistakes: [
            "Making the entire root layout a Client Component for Web Vitals.",
            "Collecting metrics without associating them with useful page information.",
            "Treating every Web Vital as if it identifies the same type of problem.",
          ],
          miniQuiz: [
            {
              question:
                "Where should `useReportWebVitals` generally live in an App Router application?",
              answer:
                "Inside a small Client Component that can be rendered from the root layout.",
            },
          ],
        },
        {
          title: "5.2 A systematic performance debugging workflow",
          explanation:
            "A useful performance workflow is simple: measure, identify the problem, make one targeted change, and measure again.\n\nStart by identifying what the user is experiencing. If the initial page is slow, investigate TTFB and LCP. If content moves unexpectedly, investigate CLS. If buttons, filters, typing, or menus feel slow, investigate INP and JavaScript execution.\n\nIf JavaScript appears to be contributing to the problem, inspect the client bundle. Find which dependencies are large and determine whether they are actually required in the browser.\n\nIf the server is slow, investigate the work required before the response begins. Look at database queries, external requests, and server-side computation.\n\nDo not make five unrelated changes at once. If you change the image, replace the font, remove a package, restructure components, and alter caching at the same time, you will have difficulty knowing which change helped.\n\nProfessional performance work is an iterative process. You measure a baseline, form a hypothesis, make a focused change, and validate the result.",
          visualDiagram:
            "              User reports slow page\n                       │\n                       ▼\n                 ┌───────────┐\n                 │ Measure   │\n                 └─────┬─────┘\n                       │\n        ┌──────────────┼──────────────┐\n        ▼              ▼              ▼\n     Loading        Stability     Interaction\n     TTFB/LCP          CLS             INP\n        │              │              │\n        └──────────────┼──────────────┘\n                       ▼\n                 Find root cause\n                       │\n                       ▼\n                Make one change\n                       │\n                       ▼\n                 Measure again",
          codeExample: {
            title: "Keep a simple performance investigation record",
            code:
              "const performanceAudit = {\n  loading: {\n    metrics: [\"TTFB\", \"LCP\"],\n    question: \"Is the initial content arriving quickly?\",\n  },\n  stability: {\n    metrics: [\"CLS\"],\n    question: \"Does visible content move unexpectedly?\",\n  },\n  interaction: {\n    metrics: [\"INP\"],\n    question: \"Does the interface respond quickly?\",\n  },\n  javascript: {\n    checks: [\"client bundle size\", \"long tasks\"],\n    question: \"Is browser JavaScript expensive?\",\n  },\n};\n\nconsole.table(performanceAudit);",
          },
          keyTakeaways: [
            "Start with the user-visible symptom.",
            "Choose the metric that describes that symptom.",
            "Identify the root cause before optimizing.",
            "Make a focused change and measure again.",
          ],
          commonMistakes: [
            "Optimizing before recording a baseline.",
            "Changing multiple performance variables at the same time.",
            "Optimizing a metric that is already healthy while ignoring the actual bottleneck.",
          ],
          miniQuiz: [
            {
              question:
                "What should you do after making a performance optimization?",
              answer:
                "Measure the application again to verify whether the relevant performance metric actually improved.",
            },
          ],
        },
        {
          title: "5.3 Build challenge: performance audit a SaaS dashboard",
          explanation:
            "Build a small SaaS dashboard using the Next.js App Router. The dashboard should contain a server-rendered overview, revenue information, an orders table, and one interactive order-status filter.\n\nDo not optimize it immediately. First establish a baseline.\n\nMeasure the page and answer these questions:\n\n• What is the likely LCP element?\n• What is the TTFB?\n• Does anything shift while the page loads?\n• How responsive is the status filter?\n• How much client JavaScript does the page require?\n• Are any large dependencies contributing to the client bundle?\n\nThen write a short performance report. For every problem you find, record the metric, suspected cause, evidence, and one change you would test.\n\nFinally, make the status filter a focused Client Component while keeping the surrounding dashboard server-rendered. Rebuild and measure again.\n\nThe objective is not to achieve an arbitrary perfect score. The objective is to learn how to find a performance bottleneck, form a hypothesis, make a targeted change, and verify the result.",
          codeExample: {
            title: "Suggested project structure",
            code:
              "app/\n├── dashboard/\n│   ├── page.tsx\n│   ├── orders-table.tsx\n│   └── _components/\n│       └── status-filter.tsx\n├── _components/\n│   └── web-vitals.tsx\n└── layout.tsx",
          },
          keyTakeaways: [
            "Performance engineering begins with measurement.",
            "LCP, CLS, and INP describe different parts of the user experience.",
            "TTFB helps you understand the early server and network portion of navigation.",
            "Bundle size and JavaScript execution can affect responsiveness.",
            "The best optimization is an evidence-based change that improves a real bottleneck.",
          ],
          commonMistakes: [
            "Trying to optimize everything before measuring.",
            "Using React memoization APIs without identifying expensive work.",
            "Making the whole dashboard a Client Component because one filter needs state.",
            "Judging performance from a single local Lighthouse run.",
            "Declaring success without measuring again after the change.",
          ],
          miniQuiz: [
            {
              question:
                "A dashboard has a good LCP but poor INP. What should you investigate?",
              answer:
                "Investigate client-side responsiveness, including JavaScript execution, long tasks, event handlers, and expensive rendering.",
            },
            {
              question:
                "A product page has good LCP but poor CLS. What should you investigate?",
              answer:
                "Investigate unexpected layout movement, especially images, fonts, and dynamically inserted content.",
            },
            {
              question:
                "A page has a large client bundle. What should you do before removing packages?",
              answer:
                "Analyze the bundle to determine which dependencies are actually contributing significant client-side JavaScript.",
            },
            {
              question:
                "A page has a slow TTFB. Where should you investigate first?",
              answer:
                "Investigate the request and server path, including server-side computation, database operations, external requests, and infrastructure latency.",
            },
            {
              question:
                "What is the most important performance workflow to remember?",
              answer:
                "Measure, identify the bottleneck, make one targeted change, and measure again.",
            },
          ],
        },
      ],
    },
  ],
};

const withoutLessonNumber = (title: string) => title.replace(/^\d+(?:\.\d+)*\.?\s*/, "");

export const NEXTJS_DAY_31: LessonDay = {
  day: NEXTJS_DAY_31_SOURCE.day,
  title: NEXTJS_DAY_31_SOURCE.title,
  overview: NEXTJS_DAY_31_SOURCE.description,
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: NEXTJS_DAY_31_SOURCE.sections.map((section, sectionIndex) => {
    const subsections = section.subsections;
    return {
      id: `nextjs-31-${sectionIndex + 1}`,
      title: withoutLessonNumber(section.title),
      durationMinutes: subsections.length * 10,
      explanation: subsections
        .map((subsection) => `<b>${withoutLessonNumber(subsection.title)}</b>\n\n${subsection.explanation}`)
        .join("\n\n"),
      diagram: subsections.map((subsection) => subsection.visualDiagram).filter(Boolean).join("\n\n"),
      codeExample: {
        title: "Section examples",
        code: subsections.map((subsection) => `// ${subsection.codeExample.title}\n${subsection.codeExample.code}`).join("\n\n"),
      },
      keyTakeaways: subsections.flatMap((subsection) => subsection.keyTakeaways),
      commonMistakes: subsections.flatMap((subsection) => subsection.commonMistakes),
      quiz: [],
      rawMiniQuiz: subsections.flatMap((subsection) => subsection.miniQuiz)
        .map((item) => `<b>${item.question}</b>\n${item.answer}`).join("\n\n"),
    };
  }),
  finalQuiz: [{ question: "What should you do before optimizing?", options: ["Measure the bottleneck", "Guess", "Add client code", "Disable caching"], correctIndex: 0, explanation: "Measure first so the change targets the real cause." }], project: { name: "Performance project", goal: "Improve one measured user experience.", brief: "Use evidence before changing code.", steps: ["Record a baseline", "Find one bottleneck", "Verify the improvement"], acceptance: ["Before-and-after evidence is recorded"] },
};
