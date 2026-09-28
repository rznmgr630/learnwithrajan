import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_3_LESSONS: LessonDay = {
  day: 3,
  title: "Navigation and Linking",
  totalMinutes: 62,
  difficulty: "Beginner",
  lessons: [
    {
      id: "link-component-and-client-navigation",
      title: "<Link> and client-side navigation",
      durationMinutes: 15,
      explanation: "Creating multiple pages is only useful if users can move between them. In Next.js, the primary navigation component is `<Link>` from `next/link`.\n\nA <b>client-side navigation</b> (changing routes without doing a full browser document reload) makes navigation between pages feel faster and lets Next.js preserve the application experience while loading the next route.\n\nFor internal routes, prefer `<Link>` instead of a plain `<a>` element.\n\n---\n\n### 1. Basic — linking two pages\n\n```tsx\nimport Link from \"next/link\";\n\nexport default function HomePage() {\n  return (\n    <main>\n      <h1>Developer Docs</h1>\n      <Link href=\"/docs\">Read the documentation</Link>\n    </main>\n  );\n}\n```\n\nThe `href` is the destination route. When the user clicks the link, Next.js handles the internal navigation.\n\n```text\nUser clicks <Link href=\"/docs\">\n          ↓\nNext.js client-side navigation\n          ↓\n/docs route is loaded\n          ↓\nDocs page is rendered\n```\n\nFor an external website, use a normal anchor when appropriate:\n\n```tsx\n<a href=\"https://example.com\">External website</a>\n```\n\nThe key distinction is simple: `<Link>` is the normal choice for navigation inside your Next.js application.\n\n---\n\n### 2. Intermediate — navigation inside layouts\n\nBecause layouts wrap their children, a navigation menu can live in a layout and be available on every descendant route.\n\n```tsx\nimport Link from \"next/link\";\n\nexport default function DocsLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <div>\n      <nav>\n        <Link href=\"/docs\">Docs</Link>\n        <Link href=\"/docs/javascript\">JavaScript</Link>\n        <Link href=\"/docs/react\">React</Link>\n      </nav>\n\n      {children}\n    </div>\n  );\n}\n```\n\nThis connects Day 2 directly to Day 3: <b>layouts own shared navigation; `Link` performs the navigation.</b>\n\n---\n\n### 3. Advanced — dynamic href values\n\nYou do not have to hard-code every destination. You can build a destination from data:\n\n```tsx\nconst topics = [\n  { slug: \"javascript\", title: \"JavaScript\" },\n  { slug: \"react\", title: \"React\" },\n];\n\nexport default function TopicList() {\n  return (\n    <ul>\n      {topics.map((topic) => (\n        <li key={topic.slug}>\n          <Link href={`/docs/${topic.slug}`}>{topic.title}</Link>\n        </li>\n      ))}\n    </ul>\n  );\n}\n```\n\nThe URL is still an internal Next.js route; the only difference is that the destination is calculated from your data.\n\nUse `<Link>` for normal user navigation. Do not reach for programmatic navigation just because it is available. A visible link is usually clearer, more accessible and easier for users to interact with.",
      diagram: `Internal navigation

<Link href="/docs">
        │
        ↓
   user clicks
        │
        ↓
Next.js client-side navigation
        │
        ↓
   /docs route
        │
        ↓
    new UI


Use:
<Link>           → internal app navigation
<a>              → external URLs / normal browser links

Layouts can own shared <Link> navigation.`,
      codeExample: {
        title: "Documentation navigation with Link",
        code: `import Link from "next/link";

export default function DocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <header>
        <Link href="/">Developer Docs</Link>
      </header>

      <nav aria-label="Documentation">
        <Link href="/docs">Overview</Link>
        <Link href="/docs/javascript">JavaScript</Link>
        <Link href="/docs/react">React</Link>
        <Link href="/docs/nextjs">Next.js</Link>
      </nav>

      <main>{children}</main>
    </div>
  );
}

// Dynamic destinations are also fine:
const topics = [
  { slug: "javascript", title: "JavaScript" },
  { slug: "react", title: "React" },
];

export function TopicLinks() {
  return (
    <ul>
      {topics.map((topic) => (
        <li key={topic.slug}>
          <Link href={\`/docs/\${topic.slug}\`}>{topic.title}</Link>
        </li>
      ))}
    </ul>
  );
}`,
      },
      keyTakeaways: [
        "`<Link>` from `next/link` is the normal choice for internal navigation.",
        "Internal `<Link>` navigation uses Next.js client-side navigation instead of treating every click like a completely new document navigation.",
        "A shared layout is a natural place for navigation that appears across many pages.",
        "The `href` can be a literal path or be constructed from data.",
        "Use a normal `<a>` when linking to an external website.",
        "Prefer a visible `<Link>` when a user can simply click to reach another route instead of using programmatic navigation unnecessarily.",
      ],
      commonMistakes: [
        "<b>Using `<a>` for every internal route.</b> Use `<Link>` for normal navigation inside the Next.js application.",
        "<b>Importing `Link` from the wrong package.</b> Use `next/link`.",
        "<b>Using `useRouter()` for a normal menu item.</b> A link is simpler and gives users a normal navigation element.",
        "<b>Forgetting a leading slash for an absolute internal path.</b> `/docs/react` and `docs/react` do not mean the same thing.",
      ],
      quiz: [
        {
          question: "Which component is the normal choice for internal Next.js navigation?",
          options: [
            "`<Navigate>`",
            "`<Link>` from `next/link`",
            "`<RouterLink>`",
            "`<a>` only",
          ],
          correctIndex: 1,
          explanation: "Next.js provides `Link` specifically for application navigation.",
        },
        {
          question: "Where can a shared documentation navigation menu live?",
          options: [
            "Only inside every page",
            "Inside `app/docs/layout.tsx`",
            "Only in `page.tsx` at the root",
            "Inside `next.config.ts`",
          ],
          correctIndex: 1,
          explanation: "A docs layout wraps all documentation pages and is a natural place for shared navigation.",
        },
        {
          question: "When should you normally use programmatic navigation instead of a visible link?",
          options: [
            "For every menu item",
            "Whenever a route exists",
            "When navigation needs to happen as part of application logic",
            "Only for external URLs",
          ],
          correctIndex: 2,
          explanation: "Programmatic navigation is useful when code needs to trigger navigation after an action or decision.",
        },
      ],
    },
    {
      id: "programmatic-navigation-userouter",
      title: "Programmatic navigation with useRouter",
      durationMinutes: 15,
      explanation: "Sometimes navigation is not caused by the user clicking a link. A form may submit successfully and then take the user to a dashboard. A button may finish an action and then move to a details page. That is where <b>programmatic navigation</b> (changing the route from application code) becomes useful.\n\nThe App Router exposes `useRouter` from `next/navigation` for this purpose.\n\nBecause `useRouter` is a React hook, the component using it needs to be a <b>Client Component</b> (a component that is explicitly allowed to use client-side React APIs and browser interaction). That means the file starts with `'use client'`.\n\n---\n\n### 1. Basic — router.push()\n\n```tsx\n\"use client\";\n\nimport { useRouter } from \"next/navigation\";\n\nexport default function SaveButton() {\n  const router = useRouter();\n\n  function handleSave() {\n    // Save something...\n    router.push(\"/dashboard\");\n  }\n\n  return <button onClick={handleSave}>Save</button>;\n}\n```\n\n`router.push()` adds the destination to the browser history. After the action, the user can use the browser Back button to return to the previous page.\n\n---\n\n### 2. Intermediate — push, replace, back and refresh\n\nThe router exposes several operations:\n\n```text\nrouter.push('/dashboard')\n    → navigate and add a history entry\n\nrouter.replace('/dashboard')\n    → navigate without keeping the current route as a history entry\n\nrouter.back()\n    → go back in browser history\n\nrouter.refresh()\n    → request a fresh server-rendered result for the current route\n```\n\n`replace()` is useful for flows where the previous page should not be returned to, such as completing a login redirect. `back()` is useful when your UI provides its own Back button.\n\nUse `refresh()` when you need the current route's server data to be requested again without changing the URL.\n\n---\n\n### 3. Advanced — useRouter belongs to interaction logic\n\nA common mistake is turning every link into a client component just to call `router.push()`. That adds complexity without a reason.\n\nCompare:\n\n```tsx\n<Link href=\"/docs/react\">Read React docs</Link>\n```\n\nwith:\n\n```tsx\n<button onClick={() => router.push(\"/docs/react\")}>\n  Read React docs\n</button>\n```\n\nIf the user is simply choosing a destination, the first version is usually the natural UI. The second makes sense when navigation is a consequence of an action, such as submitting a form or completing a workflow.\n\nThe mental model is:\n\n```text\nUser chooses a destination directly\n        ↓\n      <Link>\n\nApplication completes an action\n        ↓\n  router.push()/replace()\n```\n\nAlso remember that `useRouter` is from `next/navigation` in the App Router, not the older `next/router` API used by the Pages Router.",
      diagram: `Two ways to navigate

Direct destination
User clicks "React docs"
        ↓
<Link href="/docs/react">
        ↓
/docs/react


Navigation caused by logic
User submits form
        ↓
save succeeds
        ↓
router.push("/dashboard")
        ↓
/dashboard


Router methods

push()     → new history entry
replace()  → replace current history entry
back()     → browser history back
refresh()  → refresh current route data`,
      codeExample: {
        title: "Redirect after a successful client-side action",
        code: `"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateProjectForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);

    // Imagine an API request here.
    await new Promise((resolve) => setTimeout(resolve, 500));

    // The action succeeded, so navigation is part of the workflow.
    router.push("/dashboard");
  }

  return (
    <button disabled={saving} onClick={handleSubmit}>
      {saving ? "Creating..." : "Create project"}
    </button>
  );
}

// Other useful operations:
// router.replace("/login");
// router.back();
// router.refresh();`,
      },
      keyTakeaways: [
        "`useRouter` comes from `next/navigation` in the App Router.",
        "A component using `useRouter` must be a Client Component.",
        "`router.push()` navigates and adds a browser history entry.",
        "`router.replace()` navigates without keeping the current route as a separate history entry.",
        "`router.back()` follows browser history backward.",
        "`router.refresh()` requests a fresh result for the current route without changing the URL.",
        "Use programmatic navigation when navigation is a consequence of application logic, not merely because a route exists.",
      ],
      commonMistakes: [
        "<b>Importing `useRouter` from `next/router`.</b> App Router uses `next/navigation`.",
        "<b>Calling `useRouter()` in a Server Component.</b> Hooks such as this require a Client Component.",
        "<b>Using `router.push()` for every navigation link.</b> Use `<Link>` when the user is simply choosing a destination.",
        "<b>Using `push()` when you actually need `replace()`.</b> Think about whether the previous history entry should remain.",
      ],
      quiz: [
        {
          question: "Where does App Router's `useRouter` come from?",
          options: [
            "`next/router`",
            "`next/navigation`",
            "`react/router`",
            "`next/link`",
          ],
          correctIndex: 1,
          explanation: "The App Router navigation hooks come from `next/navigation`.",
        },
        {
          question: "What does `router.replace()` do differently from `router.push()`?",
          options: [
            "It opens a new browser tab",
            "It does not keep the current route as a separate history entry",
            "It always refreshes the page",
            "It only works with external URLs",
          ],
          correctIndex: 1,
          explanation: "Replace updates the current history entry instead of adding another one.",
        },
        {
          question: "Which situation is a good use for `router.push()`?",
          options: [
            "Every text link on a page",
            "A successful form action that should take the user to another route",
            "A static external link",
            "A CSS hover effect",
          ],
          correctIndex: 1,
          explanation: "The navigation is a consequence of the completed application action.",
        },
      ],
    },
    {
      id: "usepathname-and-active-navigation",
      title: "usePathname and active navigation",
      durationMinutes: 12,
      explanation: "Navigation becomes much easier to understand when you can tell which route the user is currently viewing. `usePathname()` gives a Client Component the current pathname, such as `/docs/react`.\n\nA <b>pathname</b> (the path portion of the current URL) does not include the query string. For example:\n\n```text\nhttps://example.com/docs/react?version=19\n                    └─────────┘\n                      pathname\n```\n\nThe pathname is useful for active navigation states, breadcrumbs and client-side UI that depends on the current route.\n\n---\n\n### 1. Basic — read the current pathname\n\n```tsx\n\"use client\";\n\nimport { usePathname } from \"next/navigation\";\n\nexport default function CurrentRoute() {\n  const pathname = usePathname();\n\n  return <p>Current route: {pathname}</p>;\n}\n```\n\nAgain, this is a Client Component because `usePathname()` is a client-side hook.\n\n---\n\n### 2. Intermediate — active navigation\n\nA navigation item can compare its destination with the current pathname:\n\n```tsx\nconst pathname = usePathname();\nconst active = pathname === \"/docs/react\";\n```\n\nThen you can add an active class or `aria-current`:\n\n```tsx\n<Link\n  href=\"/docs/react\"\n  aria-current={active ? \"page\" : undefined}\n>\n  React\n</Link>\n```\n\n`aria-current=\"page\"` is useful because it communicates the current page to assistive technology instead of relying only on visual styling.\n\nFor a parent section, you may need a broader comparison:\n\n```tsx\nconst active = pathname === \"/docs\" || pathname.startsWith(\"/docs/\");\n```\n\nBe careful with loose `startsWith()` checks. `/docs-old` also starts with `/docs`, so route matching should reflect your actual URL structure.\n\n---\n\n### 3. Advanced — keep matching logic intentional\n\nA reusable navigation item can accept an `href` and decide whether it is active:\n\n```tsx\nfunction NavItem({ href, children }: Props) {\n  const pathname = usePathname();\n  const active = pathname === href;\n\n  return (\n    <Link href={href} aria-current={active ? \"page\" : undefined}>\n      {children}\n    </Link>\n  );\n}\n```\n\nThis is a good example of where a Client Component makes sense: the UI genuinely needs browser-side route state.\n\nDo not make the entire application client-side just because one small navigation component needs `usePathname()`. Keep the client boundary as small as practical.",
      diagram: `Current URL

https://example.com/docs/react?version=19
                    │
                    └── pathname = "/docs/react"


Active navigation

usePathname()
     │
     ↓
"/docs/react"
     │
     ├── equals "/docs"       → false
     └── equals "/docs/react" → true
                              ↓
                       active styling
                       aria-current="page"

Keep the Client Component boundary small.`,
      codeExample: {
        title: "Reusable active navigation item",
        code: `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItemProps = {
  href: string;
  children: React.ReactNode;
};

export function NavItem({ href, children }: NavItemProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={active ? "font-bold" : undefined}
    >
      {children}
    </Link>
  );
}

// Example:
// <NavItem href="/docs/react">React</NavItem>`,
      },
      keyTakeaways: [
        "`usePathname()` returns the current pathname.",
        "The pathname does not include the query string.",
        "A Client Component can use pathname information to highlight the active route.",
        "`aria-current=\"page\"` communicates the current page semantically.",
        "Exact equality works well for a single page; section navigation may require intentional prefix matching.",
        "Keep the Client Component boundary small instead of turning an entire page into a Client Component unnecessarily.",
      ],
      commonMistakes: [
        "<b>Trying to use `usePathname()` in a Server Component.</b> It is a Client Component hook.",
        "<b>Comparing the pathname to the complete URL.</b> `usePathname()` returns the path, not the protocol and domain.",
        "<b>Using `startsWith()` without thinking about route boundaries.</b> Similar prefixes can accidentally match.",
        "<b>Using only color to show the active page.</b> `aria-current` gives the state semantic meaning.",
      ],
      quiz: [
        {
          question: "What does `usePathname()` return for `/docs/react?version=19`?",
          options: [
            "`https://example.com/docs/react?version=19`",
            "`/docs/react?version=19`",
            "`/docs/react`",
            "`react`",
          ],
          correctIndex: 2,
          explanation: "The pathname is `/docs/react`; the query string is separate.",
        },
        {
          question: "Why use `aria-current=\"page\"` on an active navigation item?",
          options: [
            "To perform navigation",
            "To tell assistive technology which page is current",
            "To change the URL",
            "To make the page server-rendered",
          ],
          correctIndex: 1,
          explanation: "It communicates the current-page state semantically.",
        },
        {
          question: "Why should the component using `usePathname()` usually be small?",
          options: [
            "The hook only works in buttons",
            "It helps keep the client-side boundary limited to UI that needs client route state",
            "Next.js does not allow layouts",
            "Pathnames are only available in CSS",
          ],
          correctIndex: 1,
          explanation: "Only the part that needs the client-side hook needs to cross the Client Component boundary.",
        },
      ],
    },
    {
      id: "search-params-and-dynamic-navigation",
      title: "useSearchParams and dynamic navigation",
      durationMinutes: 11,
      explanation: "A URL can contain information after `?`, such as filters, search text and pagination:\n\n```text\n/docs?topic=react&page=2\n      └────────────────┘\n        search params\n```\n\nA <b>search parameter</b> (a key-value value in the query string) is useful when the state should be represented in the URL and shareable through a copied link.\n\n`useSearchParams()` from `next/navigation` lets a Client Component read the current query string.\n\n---\n\n### 1. Basic — reading a search parameter\n\n```tsx\n\"use client\";\n\nimport { useSearchParams } from \"next/navigation\";\n\nexport default function SearchInfo() {\n  const searchParams = useSearchParams();\n  const topic = searchParams.get(\"topic\");\n\n  return <p>Topic: {topic ?? \"all\"}</p>;\n}\n```\n\nIf the URL is `/docs?topic=react`, `topic` is `react`. If it is missing, `get()` returns `null`.\n\n---\n\n### 2. Intermediate — search parameters versus pathname\n\nThese two pieces of the URL answer different questions:\n\n```text\n/docs/react?version=19\n   └───────┘ └────────┘\n  pathname   search params\n```\n\nUse the pathname for route identity. Use search parameters for optional state such as filters, sorting, search text or pagination.\n\nFor example:\n\n```text\n/products              → which page?\n/products?category=books → which filter?\n/products?page=2         → which page of results?\n```\n\nThis distinction is important because query parameters should not become fake route segments just because they contain useful data.\n\n---\n\n### 3. Advanced — navigation that preserves query state\n\nYou can construct links with a query string:\n\n```tsx\n<Link href=\"/docs?topic=react\">React docs</Link>\n```\n\nOr build a URL from a `URLSearchParams` object:\n\n```tsx\nconst params = new URLSearchParams({\n  topic: \"react\",\n  page: \"2\",\n});\n\n<Link href={`/docs?${params.toString()}`}>Next</Link>\n```\n\nFor a more complex application, search parameters become part of your navigation contract: users can bookmark them, refresh the page and share them with someone else.\n\nOne important limitation for beginners: `useSearchParams()` is a Client Component hook. For server-side page logic, Next.js also provides URL search parameters through the page's `searchParams` prop in the appropriate App Router page APIs. You will use that server-side approach more as you learn data fetching and Server Components.",
      diagram: `A URL has multiple useful parts

/docs/react?version=19&page=2
   │              │
   │              └── search parameters
   │
   └── pathname

usePathname()
    → "/docs/react"

useSearchParams()
    → version=19
    → page=2

Use pathname for route identity.
Use search params for optional URL state.`,
      codeExample: {
        title: "Reading and creating query parameters",
        code: `"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function DocsFilter() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const page = searchParams.get("page") ?? "1";

  const nextParams = new URLSearchParams({
    topic: topic ?? "react",
    page: String(Number(page) + 1),
  });

  return (
    <div>
      <p>Topic: {topic ?? "all"}</p>
      <p>Page: {page}</p>

      <Link href={\`/docs?\${nextParams.toString()}\`}>
        Next page
      </Link>
    </div>
  );
}`,
      },
      keyTakeaways: [
        "`useSearchParams()` reads the current URL query string in a Client Component.",
        "Search parameters are the part of a URL after `?`.",
        "Use the pathname for route identity and query parameters for optional URL state.",
        "Query parameters are useful for filters, sorting, search text and pagination.",
        "A URL containing search parameters can be copied, bookmarked and refreshed while preserving that state.",
        "Use `URLSearchParams` when constructing more than one query parameter.",
      ],
      commonMistakes: [
        "<b>Expecting `useSearchParams()` to return the pathname.</b> It reads query parameters only.",
        "<b>Forgetting that `.get()` can return `null`.</b> The parameter may not exist.",
        "<b>Putting every piece of state into the query string.</b> Only state that benefits from being represented in the URL belongs there.",
        "<b>Building query strings manually with many string concatenations.</b> `URLSearchParams` makes encoding and multiple values easier to manage.",
      ],
      quiz: [
        {
          question: "What does `useSearchParams()` read?",
          options: [
            "The React component tree",
            "The query string after `?`",
            "The server logs",
            "The route folder names only",
          ],
          correctIndex: 1,
          explanation: "It reads URL search parameters such as `?topic=react&page=2`.",
        },
        {
          question: "For `/docs/react?version=19`, what is the pathname?",
          options: [
            "`/docs/react`",
            "`version=19`",
            "`/docs/react?version=19`",
            "`react`",
          ],
          correctIndex: 0,
          explanation: "The query string is separate from the pathname.",
        },
        {
          question: "Which is a good use for a search parameter?",
          options: [
            "The application's root route",
            "A documentation filter or pagination state",
            "A React component name",
            "A CSS class name",
          ],
          correctIndex: 1,
          explanation: "Filters and pagination are common URL state that users may want to share or bookmark.",
        },
      ],
    },
    {
      id: "redirects",
      title: "Redirects and choosing the right navigation tool",
      durationMinutes: 9,
      explanation: "Sometimes a route should not stay where it is. An old URL may have moved, an authenticated user may need to leave a login page, or a workflow may need to send the user somewhere else.\n\nA <b>redirect</b> (an instruction that sends the request or user to another URL) can be handled in different ways depending on where the decision happens.\n\nFor server-side route logic, Next.js provides `redirect()` from `next/navigation`.\n\n```tsx\nimport { redirect } from \"next/navigation\";\n\nexport default async function AccountPage() {\n  const user = await getUser();\n\n  if (!user) {\n    redirect(\"/login\");\n  }\n\n  return <h1>Account</h1>;\n}\n```\n\n---\n\n### 1. Basic — redirect from server-side logic\n\n`redirect()` is useful when the application already knows, while rendering or processing a request, that the current route should not be shown.\n\n```text\nRequest /account\n      ↓\ncheck user\n      ↓\nnot authenticated?\n   │          │\n  YES         NO\n   │           │\nredirect     render\n/login       /account\n```\n\nThis is different from a user clicking a link. A redirect is a rule about where the user should end up.\n\n---\n\n### 2. Intermediate — redirect versus router.replace\n\nBoth can move a user to another URL, but they belong to different situations:\n\n```text\nredirect('/login')\n    → route/rendering logic decides the current URL should change\n\nrouter.replace('/login')\n    → client-side interaction logic decides the URL should change\n```\n\nFor example, checking authentication during route rendering is naturally server-side. Finishing a client-side form and then moving the user is naturally handled with `router.push()` or `router.replace()`.\n\n---\n\n### 3. Advanced — do not confuse redirecting with navigation links\n\nA simple menu should still use `<Link>`. A redirect should represent a condition or rule.\n\n```text\n<Link>               user chooses a destination\nrouter.push()        code navigates after an interaction\nrouter.replace()     code navigates without keeping current history entry\nredirect()           route/application logic says \"this URL should go elsewhere\"\n```\n\nThe most useful question is not \"Which navigation API do I know?\" It is \"Who is deciding that the URL should change?\"\n\nIf the user is choosing, use a link. If a client-side action completed, use the router. If the route should redirect because of application/request logic, use `redirect()`.",
      diagram: `Choosing a navigation mechanism

User chooses a destination
        ↓
      <Link>


Client-side action completes
        ↓
   router.push()
   router.replace()


Route/request logic says
"This route should not render here"
        ↓
    redirect()


The deciding party determines the tool.`,
      codeExample: {
        title: "Server-side redirect for an account route",
        code: `import { redirect } from "next/navigation";

async function getUser() {
  // Imagine this reads the current authenticated user.
  return null;
}

export default async function AccountPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <h1>My Account</h1>
      <p>Welcome back.</p>
    </main>
  );
}

// Compare the intent:
//
// <Link href="/login">Login</Link>
//   → user chooses to navigate
//
// router.replace("/dashboard")
//   → client-side action decides to navigate
//
// redirect("/login")
//   → route logic decides the current route should redirect`,
      },
      keyTakeaways: [
        "`redirect()` from `next/navigation` is useful when route/application logic determines that the current route should go somewhere else.",
        "`router.push()` and `router.replace()` are client-side navigation tools used from interactive Client Components.",
        "`<Link>` is for a user choosing a destination directly.",
        "`router.replace()` is useful when the previous history entry should not remain as a separate destination.",
        "A redirect is a rule or condition, not simply another name for a navigation link.",
        "Choosing the right tool starts by asking what caused the navigation.",
      ],
      commonMistakes: [
        "<b>Using `router.push()` for authentication checks in every server-rendered route.</b> Route logic can use `redirect()`.",
        "<b>Using redirects for normal menu links.</b> A visible `<Link>` communicates the user's navigation choice better.",
        "<b>Confusing `push()` and `replace()`.</b> Decide whether the current history entry should remain.",
        "<b>Importing redirect APIs from the old Pages Router API.</b> App Router navigation utilities come from `next/navigation`.",
      ],
      quiz: [
        {
          question: "Which API is designed for a route deciding that the user should go somewhere else?",
          options: [
            "`redirect()`",
            "`<Link>` only",
            "`usePathname()`",
            "`useSearchParams()`",
          ],
          correctIndex: 0,
          explanation: "A redirect represents route/application logic that sends the request elsewhere.",
        },
        {
          question: "A user clicks a visible 'React Docs' menu item. What should you normally use?",
          options: [
            "`redirect()`",
            "`router.refresh()`",
            "`<Link href=\"/docs/react\">`",
            "`useSearchParams()`",
          ],
          correctIndex: 2,
          explanation: "The user is directly choosing the destination, so a link is the natural tool.",
        },
        {
          question: "What question helps you choose the navigation tool?",
          options: [
            "Which API is longest?",
            "Who or what is deciding that the URL should change?",
            "Which route has the most components?",
            "Which page has the most CSS?",
          ],
          correctIndex: 1,
          explanation: "The cause of the navigation determines whether Link, router methods or redirect is appropriate.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which tool should normally be used for an internal navigation link?",
      options: [
        "`redirect()`",
        "`router.push()`",
        "`<Link>`",
        "`usePathname()`",
      ],
      correctIndex: 2,
      explanation: "Use `<Link>` when the user is directly choosing another internal route.",
    },
    {
      question: "Which hook gives you the current pathname?",
      options: [
        "`useRouter()`",
        "`usePathname()`",
        "`useSearchParams()`",
        "`useRoute()`",
      ],
      correctIndex: 1,
      explanation: "`usePathname()` returns the current pathname.",
    },
    {
      question: "Which hook reads `?page=2` from a URL?",
      options: [
        "`usePathname()`",
        "`useRouter()`",
        "`useSearchParams()`",
        "`redirect()`",
      ],
      correctIndex: 2,
      explanation: "Search parameters are read with `useSearchParams()` in a Client Component.",
    },
    {
      question: "What is a good reason to use `router.replace()`?",
      options: [
        "You want to add another history entry",
        "You want navigation without keeping the current route as a separate history entry",
        "You want to read the current pathname",
        "You want to create a route group",
      ],
      correctIndex: 1,
      explanation: "Replace updates the current history entry rather than adding another one.",
    },
    {
      question: "When is `redirect()` conceptually different from `<Link>`?",
      options: [
        "There is no difference",
        "`redirect()` is a route/application rule, while `<Link>` is a user-facing navigation choice",
        "`Link` only works on external websites",
        "`redirect()` only changes CSS",
      ],
      correctIndex: 1,
      explanation: "The important distinction is who or what is deciding that navigation should happen.",
    },
  ],
  project: {
    name: "Dashboard navigation system",
    goal: "Build a complete navigation system for a small Next.js dashboard using Link, router methods, pathname state, search parameters and redirects.",
    brief: "Turn the documentation routes from Day 2 into a small dashboard-style navigation experience. The project should have a sidebar, active navigation state, a search/filter URL and a small client-side workflow that demonstrates programmatic navigation.\n\nDo not make everything a Client Component. Keep normal pages and layouts server-rendered where possible, and isolate client-side hooks such as `usePathname`, `useSearchParams` and `useRouter` inside small interactive components.",
    steps: [
      "Create a shared navigation component using `<Link>` for `/dashboard`, `/dashboard/projects`, `/dashboard/settings` and `/docs`.",
      "Create an active `NavItem` Client Component using `usePathname()` and `aria-current=\"page\"`.",
      "Create a dashboard layout that renders the navigation around its `{children}`.",
      "Add a projects page with links generated from an array of project objects so each project gets a dynamic internal `href`.",
      "Add a project search/filter control that stores the selected filter in the URL, such as `/dashboard/projects?status=active`.",
      "Read the filter with `useSearchParams()` and display the current filter value.",
      "Create a client-side action button that simulates saving a project and then uses `router.push('/dashboard/projects')` after the action completes.",
      "Create a login route and an account route. If the account route determines that no user is available, use `redirect('/login')`.",
      "Create a button where `router.replace('/dashboard')` is more appropriate than `push()`, and explain in a comment why the previous history entry should not remain.",
      "Add a Back button using `router.back()` somewhere in a client-side detail view.",
      "Test the same navigation in the browser and by manually editing the URL so you understand the difference between pathname and search parameters.",
    ],
    acceptance: [
      "All normal dashboard links use `<Link>` rather than `router.push()`.",
      "The active navigation item changes correctly as the pathname changes.",
      "The active item exposes `aria-current=\"page\"`.",
      "The projects filter is represented in the URL and survives a page refresh.",
      "A successful client-side action uses `router.push()` to navigate.",
      "At least one workflow demonstrates why `router.replace()` is different from `push()`.",
      "The account route redirects unauthenticated users to `/login` using `redirect()`.",
      "The dashboard does not become one giant Client Component just to support active navigation or one interactive button.",
      "You can explain when to use `<Link>`, `router.push()`, `router.replace()`, `usePathname()`, `useSearchParams()` and `redirect()`.",
    ],
    stretch: [
      "Add pagination using `?page=1`, `?page=2` and preserve the current filter while changing pages.",
      "Build a reusable `createQueryString` helper around `URLSearchParams` for filter links.",
      "Add a breadcrumb component that derives its active state from `usePathname()`.",
      "Create a post-login flow where `replace()` prevents the login page from appearing when the user presses Back.",
    ],
  },
};
