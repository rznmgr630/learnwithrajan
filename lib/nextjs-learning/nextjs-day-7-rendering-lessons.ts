import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_7_RENDERING_LESSONS: LessonDay = {
  day: 7,
  title: "Rendering strategies: static, dynamic, streaming and revalidation",
  totalMinutes: 75,
  difficulty: "Beginner to Advanced",
  lessons: [
    {
      id: "rendering-model", title: "The rendering decision: when does Next.js create the page?", durationMinutes: 18,
      explanation: "### 1. Basic — rendering is making UI from data\n\n<b>Rendering</b> is the work of turning your React components and data into the UI a visitor sees. The key question is when that work happens: during the build, when a request arrives, or progressively while data is still loading.\n\n### 2. Intermediate — match the strategy to the data\n\nPublic documentation can often be prepared ahead of time. A personal dashboard needs the current request and user. A product catalogue may sit between those two: it can be reused for a while, then refreshed.\n\n### 3. Advanced — rendering is also a caching decision\n\nDo not choose a strategy by habit. Ask whether a response can be shared, how stale it may be, and whether it depends on cookies, headers, search parameters, or logged-in identity.",
      diagram: "Route\n  │\n  ├── known and public ──────► static / build-time\n  ├── request-specific ──────► dynamic / request-time\n  └── slow independent parts ► streaming",
      codeExample: { title: "A server-rendered page", code: "export default async function Page() {\n  const posts = await getPosts();\n  return <PostList posts={posts} />;\n}" },
      keyTakeaways: ["Rendering timing depends on the route's data and request dependencies.", "Public, personalized, and slow data have different rendering needs."],
      commonMistakes: ["Calling every page static or every page dynamic without checking the data it uses."],
      quiz: [{ question: "What should decide a rendering strategy?", options: ["Data freshness and request dependencies", "The number of components", "Whether Tailwind is used"], correctIndex: 0, explanation: "The data's sharing and freshness requirements drive the choice." }],
    },
    {
      id: "static-and-dynamic", title: "Static, build-time, dynamic and request-time rendering", durationMinutes: 23,
      explanation: "### 1. Basic — static and build-time rendering\n\n<b>Static rendering</b> prepares a route before a visitor asks for it, commonly during `next build`. The result can be served quickly to many people. It fits public pages whose data changes rarely.\n\n### 2. Intermediate — dynamic and request-time rendering\n\n<b>Dynamic rendering</b> creates the route when a request arrives. It is needed when the response depends on the visitor, request cookies, headers, or other request-specific values. A dashboard cannot safely use one visitor's response for everyone.\n\n### 3. Advanced — dynamic is not a performance failure\n\nDynamic pages can still be fast. Keep personalized work small, cache data where sharing is safe, and avoid accidentally making a whole route dynamic when only a small client interaction was needed.",
      diagram: "Build time                         Request time\n    │                                   │\n    ▼                                   ▼\nStatic page                         Dynamic page\n    │                                   │\nMany visitors share it              Uses this request's data",
      codeExample: { title: "Request-time data with cookies", code: "import { cookies } from \"next/headers\";\n\nexport default async function Dashboard() {\n  const session = (await cookies()).get(\"session\");\n  return <p>{session ? \"Signed in\" : \"Guest\"}</p>;\n}" },
      keyTakeaways: ["Build-time rendering suits shareable public UI.", "Request-time rendering suits personalized or request-specific UI."],
      commonMistakes: ["Treating a private dashboard response as safe to share between users.", "Using dynamic rendering for a page that has no request-specific data."],
      quiz: [{ question: "Which page is normally request-time rendered?", options: ["A signed-in dashboard", "A public unchanged FAQ", "A logo image"], correctIndex: 0, explanation: "A dashboard depends on the current visitor's identity." }],
    },
    {
      id: "revalidation", title: "Revalidation: keep fast pages fresh enough", durationMinutes: 18,
      explanation: "### 1. Basic — cached does not mean permanent\n\n<b>Revalidation</b> lets a route or fetched data be reused for a period, then refreshed. It is useful when visitors can accept slightly older data but you still want updates to appear.\n\n### 2. Intermediate — choose a freshness budget\n\nA marketing page might refresh every hour. A product catalogue may refresh every minute. A bank balance or private session must not be handled like shared public content.\n\n### 3. Advanced — invalidate after a mutation\n\nWhen your app changes data, invalidate the affected path or tag so the next render does not show stale information. Keep invalidation close to the mutation that caused it.",
      diagram: "Request → cached result still fresh?\n              │\n         yes ─┴─ no\n         │         │\n      reuse      fetch fresh data\n         │         │\n         └────► render UI",
      codeExample: { title: "Time-based revalidation", code: "const response = await fetch(\"https://api.example.com/products\", {\n  next: { revalidate: 60 },\n});" },
      keyTakeaways: ["Revalidation is a balance between speed and acceptable freshness.", "Never apply shared caching rules to private user data without understanding the consequences."],
      commonMistakes: ["Using one cache duration for every kind of data.", "Forgetting to invalidate data after a successful mutation."],
      quiz: [{ question: "What does revalidation help balance?", options: ["Performance and data freshness", "CSS and HTML", "Authentication and authorization"], correctIndex: 0, explanation: "It permits reuse while ensuring data is refreshed later." }],
    },
    {
      id: "streaming-and-partial", title: "Streaming and partial rendering concepts", durationMinutes: 16,
      explanation: "### 1. Basic — do not make the whole screen wait\n\n<b>Streaming</b> sends UI in pieces as each piece becomes ready. A route-level `loading.tsx` or a `Suspense` boundary can show useful UI while a slower section finishes.\n\n### 2. Intermediate — split by user value\n\nKeep the page shell, title, and fast content available first. Put a slow chart, recommendations, or activity feed behind a loading boundary. The user sees progress instead of a blank page.\n\n### 3. Advanced — partial rendering is a mental model\n\nThink of a route as stable parts plus changing parts. Shared layouts can stay in place while the changing route segment renders. Streaming boundaries make the slow parts independent. Do not create many tiny boundaries unless they improve the experience.",
      diagram: "Page shell ─────────────────────► browser first\n   │\n   ├── fast profile ────────────► browser\n   │\n   └── slow activity feed ──────► browser when ready",
      codeExample: { title: "Stream a slow section with Suspense", code: "import { Suspense } from \"react\";\n\nexport default function Page() {\n  return (\n    <main>\n      <h1>Dashboard</h1>\n      <Suspense fallback={<p>Loading activity…</p>}>\n        <ActivityFeed />\n      </Suspense>\n    </main>\n  );\n}" },
      keyTakeaways: ["Streaming improves perceived speed by sending ready UI first.", "Partial rendering means stable layout and independent route sections do not need to feel like one blocking screen."],
      commonMistakes: ["Showing a loading spinner for the entire page when only one slow panel needs it.", "Adding Suspense boundaries everywhere without a clear loading experience."],
      quiz: [{ question: "What is the main benefit of streaming?", options: ["Ready UI reaches the visitor before slow parts finish", "It removes all server work", "It makes every route static"], correctIndex: 0, explanation: "Streaming delivers available UI progressively." }],
    },
  ],
  finalQuiz: [],
};
