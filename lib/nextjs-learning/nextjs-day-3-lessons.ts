import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

type LessonInput = {
  id: string; title: string; explanation: string; diagram: string; code: string;
  takeaways: string[]; mistakes: string[]; question: string; options: string[]; correctIndex: number; answer: string;
};

function lesson(input: LessonInput) {
  return {
    id: input.id,
    title: input.title,
    durationMinutes: 6,
    explanation: input.explanation,
    diagram: input.diagram,
    codeExample: { title: `${input.title} example`, code: input.code },
    keyTakeaways: input.takeaways,
    commonMistakes: input.mistakes,
    quiz: [{ question: input.question, options: input.options, correctIndex: input.correctIndex, explanation: input.answer }],
  };
}

export const NEXTJS_DAY_3_LESSONS = normalizePastedLessonDay({
  day: 3,
  title: "Navigation & Linking",
  overview: "<b>Goal:</b> understand client-side navigation, `Link`, dynamic and catch-all routes, route parameters, search parameters, `useRouter`, `usePathname`, redirects, and when to use each navigation API.",
  totalMinutes: 90,
  difficulty: "Beginner",
  lessons: [
    lesson({
      id: "nextjs-navigation", title: "Understanding navigation in Next.js",
      explanation: "Navigation moves the user from one URL to another. A traditional link can make the browser request a completely new document. For internal routes, Next.js can use <b>client-side navigation</b>: it keeps the application shell, loads the required route content, and updates the UI without a full document reload.\n\nNavigation and rendering are related but different. Navigation decides where the user goes; rendering decides how the route produces UI.",
      diagram: "Traditional navigation\nClick → new HTTP request → server → new document\n\nNext.js navigation\nClick → Next.js Router → load route → update UI",
      code: `import Link from "next/link";\n\nexport default function Navigation() {\n  return (\n    <nav>\n      <Link href="/">Home</Link>\n      <Link href="/about">About</Link>\n      <Link href="/projects">Projects</Link>\n    </nav>\n  );\n}`,
      takeaways: ["Navigation changes the current URL.", "Next.js supports client-side navigation for internal routes.", "Internal navigation normally uses `Link`."],
      mistakes: ["Using `<a>` for every internal Next.js route.", "Using `Link` when opening an external website is more appropriate with a normal `<a>` tag."],
      question: "What does client-side navigation avoid for an internal route?", options: ["A full document reload", "All network requests", "Route changes", "React rendering"], correctIndex: 0, answer: "Next.js can update the route UI without loading an entirely new browser document."
    }),
    lesson({
      id: "nextjs-link", title: "The Link component",
      explanation: "`Link` is Next.js's primary component for normal internal navigation. Import it from `next/link` and give it an `href`. It can wrap text or more complex content, so a whole card can be clickable.\n\nUse a standard `<a>` for external destinations, particularly when opening a new tab with `target=\"_blank\"` and `rel=\"noreferrer\"`.",
      diagram: "<Link href=\"/projects\">\n          ↓\n   Next.js Router\n          ↓\n     /projects page",
      code: `import Link from "next/link";\n\nexport default function Navbar() {\n  return (\n    <nav>\n      <Link href="/">Home</Link>\n      <Link href="/docs">Documentation</Link>\n      <Link href="/projects">Projects</Link>\n      <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>\n    </nav>\n  );\n}`,
      takeaways: ["`href` tells `Link` where to navigate.", "Links can contain nested UI.", "Use `Link` for normal internal navigation and `<a>` for external destinations."],
      mistakes: ["Forgetting that `href` is the destination, not a component name.", "Using an `onClick` button for a normal navigational link."],
      question: "Which component should normally link to an internal route?", options: ["Link", "img", "script", "form"], correctIndex: 0, answer: "`Link` is the standard Next.js component for internal links."
    }),
    lesson({
      id: "nextjs-dynamic-routes", title: "Dynamic routes",
      explanation: "A dynamic route uses a bracket folder such as `[id]` when part of a URL is unknown until runtime. `app/products/[id]/page.tsx` can handle `/products/123`, `/products/abc`, and other product identifiers without making a separate folder for each product.\n\nThe segment name is your parameter name. It does not require the value to be a number.",
      diagram: "app/products/[id]/page.tsx\n             │\n/products/123 ─┤\n/products/abc ─┘",
      code: `type Props = { params: Promise<{ id: string }> };\n\nexport default async function ProductPage({ params }: Props) {\n  const { id } = await params;\n  return <h1>Product: {id}</h1>;\n}`,
      takeaways: ["Brackets make a URL segment dynamic.", "Dynamic values are strings until you validate or convert them.", "One route can handle many resource identifiers."],
      mistakes: ["Assuming `[id]` is automatically a number.", "Creating hundreds of static route folders for database records."],
      question: "What does `[id]` mean in an App Router folder?", options: ["A dynamic route segment", "A private folder", "A layout", "A static asset"], correctIndex: 0, answer: "Bracket folders capture a dynamic path value."
    }),
    lesson({
      id: "nextjs-route-parameters", title: "Dynamic route parameters",
      explanation: "The `params` page prop contains values captured by dynamic route segments. In current App Router pages, it is asynchronous, so await it before reading the properties. Treat route parameters as untrusted strings and validate them before using them for a database lookup.\n\nRoute parameters describe the path, such as `/products/123`. They are different from search parameters after `?`.",
      diagram: "/products/123\n      │\n      ▼\n[id] segment\n      │\n      ▼\nparams.id = \"123\"",
      code: `type Props = { params: Promise<{ slug: string }> };\n\nexport default async function ArticlePage({ params }: Props) {\n  const { slug } = await params;\n  if (!slug) return <p>Missing article</p>;\n  return <article>{slug}</article>;\n}`,
      takeaways: ["`params` comes from bracket path segments.", "Parameter values should be validated.", "Path parameters identify a route resource."],
      mistakes: ["Reading a parameter without awaiting the current async `params` value.", "Confusing path parameters with `?search=value` query parameters."],
      question: "Where does `params.id` come from?", options: ["The `[id]` path segment", "The page title", "The browser history", "A CSS module"], correctIndex: 0, answer: "A dynamic segment captures that part of the URL path."
    }),
    lesson({
      id: "nextjs-catch-all", title: "Catch-all routes",
      explanation: "A catch-all segment uses `[...slug]` and captures one or more path segments as an array. `app/docs/[...slug]/page.tsx` can represent `/docs/react`, `/docs/react/hooks`, and `/docs/react/hooks/use-state`.\n\nUse `[[...slug]]` only when the segment may also be empty. A normal catch-all route requires at least one captured segment.",
      diagram: "/docs/react/hooks/use-state\n           │\n           ▼\nslug = [\"react\", \"hooks\", \"use-state\"]",
      code: `type Props = { params: Promise<{ slug: string[] }> };\n\nexport default async function DocsPage({ params }: Props) {\n  const { slug } = await params;\n  return <p>Path: {slug.join(" / ")}</p>;\n}`,
      takeaways: ["Catch-all routes capture multiple path segments.", "The captured value is an array of strings.", "They work well for docs, category trees, and nested content."],
      mistakes: ["Treating a catch-all parameter as one string.", "Using `[...slug]` when the base route must also work, which needs `[[...slug]]`."],
      question: "What type does `[...slug]` capture?", options: ["An array of path segments", "A number", "A browser cookie", "A single fixed string"], correctIndex: 0, answer: "Catch-all routes return each matched segment as an array item."
    }),
    lesson({
      id: "nextjs-use-router", title: "useRouter for action-based navigation",
      explanation: "`useRouter` is a Client Component hook from `next/navigation`. Use it when an action, such as finishing a form or clicking a custom workflow button, decides where the user goes. It is not needed for a normal link.\n\nBecause it is a hook and reacts to browser interaction, the component must start with `'use client'`.",
      diagram: "User action\n    │\n    ▼\nuseRouter()\n    │\n    ▼\nrouter.push(\"/dashboard\")",
      code: `"use client";\n\nimport { useRouter } from "next/navigation";\n\nexport function CreateProjectButton() {\n  const router = useRouter();\n  return <button onClick={() => router.push("/projects")}>Create Project</button>;\n}`,
      takeaways: ["Import `useRouter` from `next/navigation` in the App Router.", "Use it after user actions, not as a replacement for `Link`.", "It requires a Client Component."],
      mistakes: ["Importing `useRouter` from `next/router`, which is for the Pages Router.", "Using `router.push` for ordinary static navigation."],
      question: "When is `useRouter` a good fit?", options: ["Navigation after an action", "A normal text link", "Server-only authentication checks", "Static image loading"], correctIndex: 0, answer: "Programmatic navigation is useful when application logic decides the destination."
    }),
    lesson({
      id: "nextjs-push-replace", title: "router.push versus router.replace",
      explanation: "`router.push()` navigates and adds a new browser history entry, so Back returns to the previous route. `router.replace()` navigates but replaces the current history entry, so Back skips it.\n\nUse push for ordinary forward navigation. Use replace when the old page should not remain in history, such as after a login redirect or an invalid workflow step.",
      diagram: "push:    /home → /login → /dashboard\nBack: /dashboard → /login\n\nreplace: /home → /dashboard\nBack: /dashboard → /home",
      code: `router.push("/projects");\n\n// After a successful login, prevent Back returning to login.\nrouter.replace("/dashboard");`,
      takeaways: ["Push adds history.", "Replace overwrites the current history entry.", "Choose based on the Back-button behavior users should get."],
      mistakes: ["Using `replace` for normal browsing and making Back feel broken."],
      question: "Which API prevents the previous route from remaining in history?", options: ["router.replace", "router.push", "router.back", "Link"], correctIndex: 0, answer: "`replace` changes the current history entry instead of adding one."
    }),
    lesson({
      id: "nextjs-pathname", title: "usePathname",
      explanation: "`usePathname` is a Client Component hook that reads the current pathname, such as `/docs` or `/docs/getting-started`. It is commonly used to mark the active navigation item or choose route-aware UI.\n\nIt returns the path, not the query string. Use `useSearchParams` when you need values after `?`.",
      diagram: "Current URL: /docs?search=react\n      │\nusePathname() → /docs\nuseSearchParams() → search=react",
      code: `"use client";\n\nimport Link from "next/link";\nimport { usePathname } from "next/navigation";\n\nexport function DocsLink() {\n  const pathname = usePathname();\n  return <Link className={pathname === "/docs" ? "active" : ""} href="/docs">Docs</Link>;\n}`,
      takeaways: ["Pathname is the URL path without query values.", "It is useful for active navigation states."],
      mistakes: ["Using it in a Server Component.", "Expecting it to return `?search=react`."],
      question: "What does `usePathname()` return for `/docs?search=react`?", options: ["/docs", "search=react", "/docs?search=react", "react"], correctIndex: 0, answer: "It returns only the pathname."
    }),
    lesson({
      id: "nextjs-search-params", title: "useSearchParams",
      explanation: "`useSearchParams` is a Client Component hook for reading the query string. Query values filter, search, sort, paginate, or change a view without changing the route hierarchy. Read a value with `params.get(\"name\")`.\n\nThe returned value can be `null`, so handle missing values. Search parameters are strings and should be validated before use.",
      diagram: "/docs?search=react&page=2\n        │\n        ▼\nuseSearchParams()\n  search → react\n  page   → 2",
      code: `"use client";\n\nimport { useSearchParams } from "next/navigation";\n\nexport function SearchSummary() {\n  const params = useSearchParams();\n  const search = params.get("search") ?? "";\n  return <p>Searching for: {search}</p>;\n}`,
      takeaways: ["Search parameters appear after `?`.", "They are useful for filters, search, pagination, and sorting.", "`get` can return `null`."],
      mistakes: ["Treating every search value as present or numeric.", "Using query values where the resource should be identified by a path parameter."],
      question: "Which API reads `?page=2` in a Client Component?", options: ["useSearchParams", "usePathname", "redirect", "generateStaticParams"], correctIndex: 0, answer: "`useSearchParams` reads query-string values."
    }),
    lesson({
      id: "nextjs-update-search", title: "Programmatic navigation with search parameters",
      explanation: "To change a query string, start with the current parameters, update the values you own, and navigate to the resulting URL. This preserves unrelated parameters and makes filters and pagination shareable through the URL.\n\nUse `router.push` when each filter change should be part of history. Use `router.replace` when typing into a search box should not create a Back-button entry for every character.",
      diagram: "Current URL\n   │\nRead params → update one value → router.push or replace\n   │\nNew URL with preserved parameters",
      code: `"use client";\n\nconst params = useSearchParams();\nconst router = useRouter();\n\nfunction setPage(page: number) {\n  const next = new URLSearchParams(params.toString());\n  next.set("page", String(page));\n  router.push(\`/docs?\${next.toString()}\`);\n}`,
      takeaways: ["Build a new `URLSearchParams` before changing values.", "Preserve parameters other controls may own.", "Use replace for noisy updates such as live search."],
      mistakes: ["Discarding existing query parameters.", "Adding a browser-history entry for every keystroke."],
      question: "Why copy the current search parameters before updating one?", options: ["To preserve unrelated values", "To access server secrets", "To make a dynamic route", "To render a layout"], correctIndex: 0, answer: "Other filters or controls may have values that should remain in the URL."
    }),
    lesson({
      id: "nextjs-history", title: "router.back and router.forward",
      explanation: "`router.back()` and `router.forward()` use the browser history stack. They are useful for custom Back and Forward controls, but may do nothing when there is no matching history entry. Do not rely on Back as the only way to reach essential content.\n\nThe behavior depends on how the user reached the current route, including whether previous navigation used push or replace.",
      diagram: "History\n/home ← /docs ← /docs/routing\n                 │\n       router.back() → /docs\n       router.forward() → /docs/routing",
      code: `"use client";\n\nimport { useRouter } from "next/navigation";\n\nexport function HistoryButtons() {\n  const router = useRouter();\n  return (\n    <>\n      <button onClick={() => router.back()}>Back</button>\n      <button onClick={() => router.forward()}>Forward</button>\n    </>\n  );\n}`,
      takeaways: ["Back and forward use browser history.", "History can be empty or changed by replace navigation."],
      mistakes: ["Assuming `router.back()` always has somewhere safe to go."],
      question: "What does `router.back()` use?", options: ["Browser history", "The database", "A static route list", "The current layout"], correctIndex: 0, answer: "It delegates to the browser's back history behavior."
    }),
    lesson({
      id: "nextjs-refresh", title: "router.refresh",
      explanation: "`router.refresh()` requests a fresh render of the current route and its Server Component data without resetting client-side component state. Use it after an action changes server-rendered data and you need the current route to show the latest result.\n\nIt is not a substitute for designing clear data invalidation. Think about what data changed and which route needs new server output.",
      diagram: "User action\n    │\n    ▼\nServer data changes\n    │\n    ▼\nrouter.refresh()\n    │\n    ▼\nFresh Server Component output",
      code: `"use client";\n\nimport { useRouter } from "next/navigation";\n\nexport function RefreshButton() {\n  const router = useRouter();\n  return <button onClick={() => router.refresh()}>Refresh data</button>;\n}`,
      takeaways: ["Refresh re-renders the current route's server output.", "Client state can remain in place while server data refreshes."],
      mistakes: ["Using refresh for every interaction instead of updating the correct state or cache."],
      question: "What does `router.refresh()` primarily refresh?", options: ["The current route's server-rendered output", "Only CSS", "Browser history", "The whole browser process"], correctIndex: 0, answer: "It asks Next.js for a fresh render of the current route."
    }),
    lesson({
      id: "nextjs-redirect", title: "Server-side redirects",
      explanation: "Use `redirect()` from `next/navigation` when server-side logic decides the user must go elsewhere. Common cases are authentication, authorization, a missing resource, or an invalid workflow state. Calling `redirect()` stops rendering the current route and sends the user to the target.\n\nWhen the server already knows the answer, redirect there instead of rendering a page and redirecting later from the browser.",
      diagram: "Request /dashboard\n      │\nCheck authentication\n ┌────┴─────┐\nauthenticated  not authenticated\n     │              │\nDashboard       redirect /login",
      code: `import { redirect } from "next/navigation";\n\nexport default async function DashboardPage() {\n  const user = await getCurrentUser();\n  if (!user) redirect("/login");\n  return <h1>Dashboard</h1>;\n}`,
      takeaways: ["`redirect()` is for server-side navigation decisions.", "It is useful for auth, permissions, missing resources, and workflow state."],
      mistakes: ["Using client `useRouter` when a Server Component can decide immediately."],
      question: "Which API should redirect an unauthenticated user from a Server Component?", options: ["redirect", "useRouter", "Link", "usePathname"], correctIndex: 0, answer: "`redirect()` handles server-side navigation decisions."
    }),
    lesson({
      id: "nextjs-choose-navigation", title: "Choosing the right navigation tool",
      explanation: "Choose the API based on why navigation is happening. Use `Link` for a normal internal link. Use `useRouter` after an action. Use `usePathname` to read the current path and `useSearchParams` to read the query string. Use `redirect()` when server logic determines the destination. Use `router.back()` and `router.forward()` for browser history.\n\nThe common mistake is using `useRouter()` for everything. A plain `<Link href=\"/about\">About</Link>` is clearer and more accessible for ordinary navigation.",
      diagram: "Normal link → Link\nAction → useRouter\nServer decision → redirect\nCurrent path → usePathname\nQuery values → useSearchParams\nHistory → back / forward",
      code: `// Normal link\n<Link href="/about">About</Link>\n\n// After an action\nrouter.push("/dashboard");\n\n// Server decision\nredirect("/login");`,
      takeaways: ["Use the narrowest navigation tool that matches the job.", "Clear API choices make route behavior easier to maintain."],
      mistakes: ["Replacing normal accessible links with click handlers and `router.push`."],
      question: "What should a normal About link use?", options: ["Link", "router.push in a button", "redirect", "useSearchParams"], correctIndex: 0, answer: "A normal internal navigation target should use `Link`."
    }),
  ],
  finalQuiz: [
    { question: "What is the difference between `/products/123` and `/products?page=2`?", options: ["The first has a route parameter; the second has a search parameter", "They are identical", "The first is external", "The second requires a layout"], correctIndex: 0, explanation: "Dynamic path segments identify the route resource, while query parameters modify a request or view." },
    { question: "When should you use `router.replace`?", options: ["When the current page should not remain in browser history", "For every normal link", "To read a query parameter", "To define a route"], correctIndex: 0, explanation: "Replace changes the current history entry instead of pushing a new one." },
    { question: "Which API is right when the server determines the user is unauthenticated?", options: ["redirect", "Link", "usePathname", "router.forward"], correctIndex: 0, explanation: "The server can redirect immediately without rendering the protected page." },
  ],
  project: {
    name: "Documentation Site Navigation",
    goal: "Add complete navigation to the documentation site from Day 2.",
    brief: "Build static documentation links, a dynamic catch-all docs route, query-string search, action-based navigation, history controls, and a server-side authentication redirect simulation.",
    steps: ["Add links for Home, Docs, Projects, Getting Started, Concepts, and API pages.", "Add `app/docs/[...slug]/page.tsx` and display the captured path.", "Read `?search=react` with `useSearchParams`.", "Add Create Project with `router.push(\"/projects\")` and a Back button with `router.back()`.", "Add `/dashboard` that redirects a simulated unauthenticated user to `/login`."],
    acceptance: ["All required documentation URLs are reachable through `Link`.", "Catch-all docs routes display every captured segment.", "Search parameters are read safely.", "The dashboard redirects before rendering protected UI."],
  },
  footer: "<b>Day 3 mental model:</b> use path segments for route identity, query strings for view options, `Link` for ordinary navigation, router APIs for browser actions, and `redirect()` for server decisions.",
});
