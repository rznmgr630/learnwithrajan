import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_5_LESSONS: LessonDay = {
  day: 5,
  title: "Layouts and Templates",
  totalMinutes: 75,
  difficulty: "Beginner",
  lessons: [
    {
      id: "nested-layouts-and-shared-ui",
      title: "Nested layouts and shared UI",
      durationMinutes: 16,
      explanation: `A <b>layout</b> is a component that wraps pages inside a route segment. Layouts are where you put UI that should be shared by several pages, such as a navigation bar, sidebar, header, footer, or dashboard shell.

The root <code>app/layout.tsx</code> wraps the entire application. A layout inside a route folder only wraps that route and its descendants.

The most important idea is that layouts compose. A page can be inside a nested layout, which is inside the root layout. This lets different parts of your application have different shared UI without duplicating the same markup in every page.`,
      diagram: `app/layout.tsx
└── Global UI
    ├── app/page.tsx
    │
    └── app/dashboard/layout.tsx
        └── Dashboard UI
            ├── app/dashboard/page.tsx
            ├── app/dashboard/users/page.tsx
            └── app/dashboard/settings/page.tsx

Root layout
    ↓
Dashboard layout
    ↓
Current page`,
      codeExample: {
        title: "A dashboard layout",
        code: `// app/dashboard/layout.tsx

import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <aside>
        <nav>
          <Link href="/dashboard">Overview</Link>
          <Link href="/dashboard/users">Users</Link>
          <Link href="/dashboard/settings">Settings</Link>
        </nav>
      </aside>

      <main>{children}</main>
    </div>
  );
}

// Every page under /dashboard receives this shell.
//
// /dashboard
// /dashboard/users
// /dashboard/settings`,
      },
      keyTakeaways: [
        "Layouts provide shared UI for a route segment and its children.",
        "The root layout wraps the whole application.",
        "Nested layouts allow different sections to have different shells.",
        "The <code>children</code> prop represents the page or nested layout rendered inside the current layout.",
      ],
      commonMistakes: [
        "<b>Repeating the same sidebar in every page.</b> Put shared section UI in a layout.",
        "<b>Putting dashboard-only UI in the root layout.</b> Keep section-specific UI inside its route layout.",
        "<b>Forgetting children.</b> Without rendering <code>children</code>, the nested page has nowhere to appear.",
      ],
      quiz: [
        {
          question: "What is the main purpose of a layout?",
          options: [
            "Store database records",
            "Share UI around pages in a route segment",
            "Replace every page",
            "Create CSS files",
          ],
          correctIndex: 1,
          explanation: "Layouts are designed for shared UI such as navigation, sidebars, and shells.",
        },
        {
          question: "What does children represent inside a layout?",
          options: [
            "Only the root page",
            "The nested page or layout rendered inside it",
            "The browser URL",
            "A database connection",
          ],
          correctIndex: 1,
          explanation: "The layout wraps its children, allowing shared UI to surround the current route.",
        },
      ],
    },
    {
      id: "persistent-layouts",
      title: "Persistent layouts and navigation between pages",
      durationMinutes: 14,
      explanation: `A major benefit of App Router layouts is that shared layouts can remain mounted while navigation happens between routes inside that layout.

For a dashboard, this means the sidebar and shell can stay in place while the main page changes from Overview to Users or Settings. You do not need to duplicate the shell in every page.

This is different from putting the same component into every page manually. The route structure itself defines which pages share the layout.

Persistence is especially useful for application shells because the user experiences the dashboard as one continuous area rather than a completely new page every time.`,
      diagram: `Initial navigation

Dashboard layout
┌───────────────────────────────┐
│ Sidebar │ Overview            │
│         │                     │
└───────────────────────────────┘

Navigate to /dashboard/users

Dashboard layout
┌───────────────────────────────┐
│ Sidebar │ Users               │
│  SAME   │                     │
└───────────────────────────────┘
             ↑
       page content changes`,
      codeExample: {
        title: "One shell, multiple pages",
        code: `// app/dashboard/layout.tsx

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>Admin Dashboard</header>

      <div className="dashboard-grid">
        <aside>Sidebar</aside>
        <section>{children}</section>
      </div>
    </div>
  );
}

// app/dashboard/page.tsx
export default function DashboardPage() {
  return <h1>Overview</h1>;
}

// app/dashboard/users/page.tsx
export default function UsersPage() {
  return <h1>Users</h1>;
}

// Both pages use the same dashboard shell.`,
      },
      keyTakeaways: [
        "A shared layout can remain mounted while navigation changes the nested page.",
        "Persistent UI reduces duplication and creates a consistent application shell.",
        "The route hierarchy determines which pages share a layout.",
      ],
      commonMistakes: [
        "<b>Calling every shared component a layout.</b> A normal reusable component is not automatically a route layout.",
        "<b>Duplicating shell markup across pages.</b> Move route-wide UI into the appropriate layout.",
        "<b>Assuming all application state belongs in a layout.</b> Keep state close to the UI that actually needs it.",
      ],
      quiz: [
        {
          question: "Why are layouts useful in a dashboard?",
          options: [
            "They make every page identical",
            "They let the shared shell remain around changing page content",
            "They remove the need for routing",
            "They replace the database",
          ],
          correctIndex: 1,
          explanation: "The dashboard shell can stay shared while the nested page changes.",
        },
      ],
    },
    {
      id: "template-tsx",
      title: "template.tsx and remounting UI",
      durationMinutes: 13,
      explanation: `<code>template.tsx</code> looks similar to <code>layout.tsx</code>, but there is an important behavioral difference.

A <b>template</b> wraps its children like a layout, but a new template instance is created when the user navigates. This makes templates useful when you want a component to remount for each navigation rather than preserve the same layout instance.

That distinction matters when working with state, effects, or animations. If UI needs to reset when the route changes, a template can be a better fit than a persistent layout.

A simple mental model is: <b>layout = shared and persistent; template = shared structure that can remount during navigation.</b>`,
      diagram: `Layout

Navigation
   ↓
same layout instance
   ↓
new page content


Template

Navigation
   ↓
new template instance
   ↓
new page content

Use template when remounting behavior matters.`,
      codeExample: {
        title: "A route template",
        code: `// app/dashboard/template.tsx

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-transition">
      {children}
    </div>
  );
}

// app/dashboard/layout.tsx can contain
// the persistent dashboard shell.
//
// template.tsx can wrap each navigation's
// page content when remounting behavior is useful.`,
      },
      keyTakeaways: [
        "<code>layout.tsx</code> is designed for persistent shared UI.",
        "<code>template.tsx</code> behaves like a wrapper that can be recreated during navigation.",
        "Templates are useful when state or effects should reset as navigation happens.",
        "Do not replace every layout with a template; choose based on the required lifecycle behavior.",
      ],
      commonMistakes: [
        "<b>Thinking layout and template are interchangeable.</b> Their lifecycle behavior is different.",
        "<b>Using a template only because it sounds newer.</b> Use a template when remounting behavior solves a real problem.",
        "<b>Putting expensive persistent UI in a template.</b> That UI may be recreated when navigation occurs.",
      ],
      quiz: [
        {
          question: "What is a key difference between layout.tsx and template.tsx?",
          options: [
            "Only layout.tsx can render JSX",
            "A template can be recreated during navigation while a layout is designed to persist",
            "Templates can only be used in API routes",
            "Layouts cannot have children",
          ],
          correctIndex: 1,
          explanation: "Templates are useful when you want remounting behavior.",
        },
      ],
    },
    {
      id: "loading-error-not-found",
      title: "Loading UI, error UI, and not-found UI",
      durationMinutes: 18,
      explanation: `Next.js provides special file conventions for common route states.

A <code>loading.tsx</code> file defines loading UI for a route segment. It is useful when the route has asynchronous work and the user needs immediate feedback while content is loading.

An <code>error.tsx</code> file defines UI for errors that occur within a route segment. Because error boundaries are client-side boundaries, the error component uses <code>"use client"</code>.

A <code>not-found.tsx</code> file defines the UI shown when a requested resource does not exist and your application calls <code>notFound()</code>. This is different from a generic application error: the resource simply was not found.

These files work together as a simple mental model: <b>loading = waiting, error = something failed, not-found = the requested resource does not exist.</b>`,
      diagram: `Route request
    │
    ├── waiting for route data
    │       ↓
    │   loading.tsx
    │
    ├── requested resource does not exist
    │       ↓
    │   notFound()
    │       ↓
    │   not-found.tsx
    │
    └── unexpected error
            ↓
        error.tsx`,
      codeExample: {
        title: "Loading, error, and not-found files",
        code: `// app/dashboard/loading.tsx

export default function Loading() {
  return <p>Loading dashboard...</p>;
}


// app/dashboard/error.tsx

"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong.</h2>
      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}


// app/blog/[slug]/not-found.tsx

export default function NotFound() {
  return (
    <main>
      <h1>Article not found</h1>
      <p>The article you requested does not exist.</p>
    </main>
  );
}


// app/blog/[slug]/page.tsx

import { notFound } from "next/navigation";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return <article>{article.title}</article>;
}`,
      },
      keyTakeaways: [
        "<code>loading.tsx</code> provides loading UI for a route segment.",
        "<code>error.tsx</code> provides an error boundary UI and must be a Client Component.",
        "<code>not-found.tsx</code> provides the not-found UI for a route segment.",
        "<code>notFound()</code> stops the current route and displays the relevant not-found UI.",
        "Loading, error, and not-found are different states and should not be treated as the same failure.",
      ],
      commonMistakes: [
        "<b>Using error.tsx for a normal missing record.</b> Use <code>notFound()</code> when the requested resource does not exist.",
        "<b>Forgetting \"use client\" in error.tsx.</b> The error boundary component needs to be a Client Component.",
        "<b>Putting a database query inside loading.tsx.</b> Loading UI should stay simple and fast.",
        "<b>Assuming not-found.tsx is only for the entire application.</b> It can be placed at a route segment to provide contextual not-found UI.",
      ],
      quiz: [
        {
          question: "Which file handles loading UI?",
          options: ["error.tsx", "loading.tsx", "pending.tsx", "wait.tsx"],
          correctIndex: 1,
          explanation: "loading.tsx is the App Router file convention for loading UI.",
        },
        {
          question: "Which special component must be a Client Component?",
          options: ["layout.tsx", "page.tsx", "loading.tsx", "error.tsx"],
          correctIndex: 3,
          explanation: "The error boundary uses client-side behavior and therefore needs \"use client\".",
        },
        {
          question: "What should you use when an article does not exist?",
          options: [
            "throw new Error only",
            "notFound() with not-found.tsx",
            "loading.tsx",
            "template.tsx",
          ],
          correctIndex: 1,
          explanation: "A missing resource is a not-found state, not necessarily an unexpected application error.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which file is best for a dashboard sidebar shared by all dashboard pages?",
      options: ["dashboard/layout.tsx", "dashboard/page.tsx", "dashboard/error.tsx", "dashboard/loading.tsx"],
      correctIndex: 0,
      explanation: "A nested layout is designed for shared UI across the route segment and its children.",
    },
    {
      question: "What does children represent in a layout?",
      options: [
        "The browser window",
        "The nested page or layout",
        "The route parameter",
        "The server response",
      ],
      correctIndex: 1,
      explanation: "The layout wraps its nested content through the children prop.",
    },
    {
      question: "Which file is useful when you want route UI to remount during navigation?",
      options: ["layout.tsx", "template.tsx", "loading.tsx", "not-found.tsx"],
      correctIndex: 1,
      explanation: "Templates can be recreated during navigation, unlike persistent layouts.",
    },
    {
      question: "Which file provides a route-level loading state?",
      options: ["pending.tsx", "wait.tsx", "loading.tsx", "error.tsx"],
      correctIndex: 2,
      explanation: "loading.tsx is the special file convention for loading UI.",
    },
    {
      question: "Which combination represents the three common route states?",
      options: [
        "layout, template, page",
        "loading, error, not-found",
        "header, footer, sidebar",
        "params, searchParams, pathname",
      ],
      correctIndex: 1,
      explanation: "These special files handle waiting, unexpected errors, and missing resources.",
    },
  ],
  project: {
    name: "Admin dashboard shell",
    goal: "Build a multi-page admin dashboard with a shared persistent shell and route-specific loading, error, and not-found UI.",
    brief: "Create a dashboard with a header, sidebar, overview, users, and settings pages. Use a nested layout for the shared shell, a template for a route where remounting behavior is useful, and special files for loading, errors, and missing resources.",
    steps: [
      "Create app/admin/layout.tsx for the admin shell.",
      "Add a sidebar with links to Overview, Users, and Settings.",
      "Create app/admin/page.tsx for the dashboard overview.",
      "Create app/admin/users/page.tsx and app/admin/settings/page.tsx.",
      "Add app/admin/loading.tsx with a simple dashboard loading state.",
      "Add app/admin/error.tsx with a retry button.",
      "Add a route-specific not-found.tsx for a resource page such as users/[id].",
      "Create a template.tsx where you want navigation to recreate the wrapped UI.",
      "Keep the root layout separate from admin-only UI.",
      "Navigate between admin pages and observe that the dashboard shell remains shared.",
    ],
    acceptance: [
      "All admin pages share the same dashboard shell.",
      "The sidebar is defined once in the admin layout rather than copied into every page.",
      "The admin route has loading and error UI.",
      "A missing admin resource can display route-specific not-found UI.",
      "The project demonstrates a real reason to use template.tsx rather than treating it as another layout.",
    ],
    stretch: [
      "Add a dynamic users/[id] route.",
      "Load user data asynchronously and show a useful loading state.",
      "Add an intentional error trigger so you can test error.tsx.",
      "Add breadcrumbs that change based on the current route.",
      "Add a second layout for a settings subsection.",
    ],
  },
};
