import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_26_LESSONS: LessonDay = {
  day: 26,
  title: "Advanced Routing",
  totalMinutes: 78,
  difficulty: "Advanced",
  lessons: [
    {
      id: "nextjs-26-1",
      title: "Route Groups and Nested Layouts",
      durationMinutes: 16,
      explanation: `
Route groups and nested layouts help you organize a large Next.js application without making your URL structure messy. A route group is a folder wrapped in parentheses, such as (dashboard). The parentheses tell Next.js that the folder is for organization and should not become part of the URL.

For example, you can have app/(dashboard)/settings/page.tsx. The actual URL is /settings, not /(dashboard)/settings. This is useful when several pages belong to the same application area and should share a layout.

Nested layouts solve a different but related problem. A layout.tsx inside a route segment wraps the pages underneath that segment. The parent layout remains mounted while you navigate between its children. This makes layouts useful for persistent navigation such as dashboards, account areas, documentation sidebars, or application shells.

A common architecture is to keep the public website and authenticated application separate:

app/
├── layout.tsx
├── page.tsx
├── (marketing)/
│   ├── about/page.tsx
│   └── pricing/page.tsx
└── (dashboard)/
    ├── layout.tsx
    ├── dashboard/page.tsx
    └── settings/page.tsx

The URLs remain /about, /pricing, /dashboard, and /settings, while the dashboard pages can share a dashboard-specific layout.

You can also use route groups to create different root layouts. This is an advanced pattern because different root layouts can represent completely different application shells. Moving between separate root layouts can cause a full page load, so this should be an intentional architectural decision rather than a way to organize every folder.

Code example:

// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-shell">
      <aside>Dashboard navigation</aside>
      <main>{children}</main>
    </div>
  );
}

// app/(dashboard)/settings/page.tsx
export default function SettingsPage() {
  return <h1>Settings</h1>;
}

The important idea is that the folder structure and URL structure do not have to be identical. Route groups let you design the filesystem around application boundaries while keeping clean URLs for users.
`,
      diagram: `
URL structure:

/dashboard
/settings

Filesystem:

app/
├── (dashboard)/
│   ├── layout.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
└── page.tsx

                 (dashboard)
                      │
              does NOT appear
                 in the URL
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
     /dashboard                /settings
          │                       │
          └──── shared layout ────┘
`,
      codeExample: {
        title: "Route group with a nested dashboard layout",
        code: `// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>Dashboard Navigation</nav>
      <main>{children}</main>
    </div>
  );
}

// app/(dashboard)/dashboard/page.tsx
export default function DashboardPage() {
  return <h1>Dashboard</h1>;
}

// app/(dashboard)/settings/page.tsx
export default function SettingsPage() {
  return <h1>Settings</h1>;
}

// URLs:
// /dashboard
// /settings`,
      },
      keyTakeaways: [
        "A route group uses parentheses, such as (dashboard), and does not appear in the URL.",
        "A layout.tsx wraps the pages below its route segment.",
        "Nested layouts are useful for persistent application UI.",
        "Route groups help organize large applications by feature or application area.",
        "Separate root layouts are possible but should be used intentionally."
      ],
      commonMistakes: [
        "Assuming a route group changes the URL.",
        "Creating a layout at a level where you actually need separate layouts for different application areas.",
        "Using route groups only for visual organization while ignoring the application boundaries they can represent.",
        "Assuming every navigation between root layouts behaves exactly like navigation inside one layout tree."
      ],
      quiz: [
        {
          question: "What URL is created by app/(dashboard)/settings/page.tsx?",
          options: ["/(dashboard)/settings", "/dashboard/settings", "/settings", "/app/settings"],
          correctIndex: 2,
          explanation: "The parentheses indicate a route group, so (dashboard) is removed from the URL."
        },
        {
          question: "What is the main purpose of a nested layout?",
          options: [
            "To create a database table",
            "To provide shared UI around nested pages",
            "To make every page client-side",
            "To replace dynamic routes"
          ],
          correctIndex: 1,
          explanation: "A nested layout provides shared UI around the pages below that segment."
        }
      ]
    },

    {
      id: "nextjs-26-2",
      title: "Dynamic, Catch-all, and Optional Catch-all Routes",
      durationMinutes: 16,
      explanation: `
Dynamic segments allow the URL itself to identify a resource. A folder named [id] creates a dynamic segment. For example, app/products/[id]/page.tsx can handle /products/10, /products/25, and /products/abc using the same page component.

The dynamic value is available through params. In current Next.js App Router APIs, params may be asynchronous, so modern code commonly awaits params in an async page component.

Example:

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <h1>Product: {id}</h1>;
}

Catch-all segments are useful when the URL can contain multiple path segments. A folder named [...slug] can match paths such as /docs/getting-started, /docs/react/components, or /docs/api/authentication. The value is an array rather than a single string.

Optional catch-all segments use [[...slug]]. They can match both the base route and deeper paths. This is useful for documentation systems where /docs and /docs/react/hooks should be handled by the same route.

Think about these three patterns as different levels of flexibility:

[id]
One dynamic segment.

[...slug]
One or more path segments.

[[...slug]]
Zero or more path segments.

Dynamic routes are particularly useful when building detail pages, documentation systems, product catalogs, blog posts, user profiles, and nested content.

A common mistake is using a catch-all route simply because it looks powerful. A more specific route is usually easier to understand when your URL has a predictable structure.
`,
      diagram: `
Dynamic:

app/products/[id]/page.tsx

/products/42
      │
      ▼
    id = "42"


Catch-all:

app/docs/[...slug]/page.tsx

/docs/react/hooks
        │
        ▼
slug = ["react", "hooks"]


Optional catch-all:

app/docs/[[...slug]]/page.tsx

/docs
/docs/react/hooks

Both can match.
`,
      codeExample: {
        title: "Dynamic and catch-all route parameters",
        code: `// app/products/[id]/page.tsx
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <h1>Product {id}</h1>;
}

// app/docs/[...slug]/page.tsx
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <h1>Documentation</h1>
      <p>Path: {slug.join(" / ")}</p>
    </div>
  );
}`,
      },
      keyTakeaways: [
        "[id] creates one dynamic URL segment.",
        "[...slug] captures multiple path segments as an array.",
        "[[...slug]] can also match the route without any additional segment.",
        "Dynamic route values come from the URL and can be used to fetch the corresponding resource.",
        "Use the least complicated route pattern that represents your URL structure."
      ],
      commonMistakes: [
        "Treating a catch-all parameter as a string instead of an array.",
        "Using a catch-all route when a simple dynamic segment is enough.",
        "Forgetting that current Next.js versions can expose params asynchronously.",
        "Assuming dynamic routing automatically means the data must be dynamically rendered."
      ],
      quiz: [
        {
          question: "Which segment captures multiple URL path segments?",
          options: ["[id]", "[slug]", "[...slug]", "(slug)"],
          correctIndex: 2,
          explanation: "[...slug] is the catch-all dynamic segment."
        },
        {
          question: "What type of value does a catch-all segment provide?",
          options: ["Boolean", "Array of strings", "Number only", "React element"],
          correctIndex: 1,
          explanation: "A catch-all segment represents multiple path segments, so its value is an array."
        }
      ]
    },

    {
      id: "nextjs-26-3",
      title: "Parallel Routes",
      durationMinutes: 16,
      explanation: `
Parallel Routes allow a layout to render multiple route segments at the same time. They are especially useful when a page has independent sections that need their own routing, loading UI, or error UI.

A parallel route slot is created with an @folder convention. For example:

app/dashboard/
├── layout.tsx
├── page.tsx
├── @analytics/
│   └── page.tsx
└── @activity/
    └── page.tsx

The layout receives these slots as props. The names analytics and activity do not become URL segments. They represent separate UI regions.

Example:

export default function DashboardLayout({
  children,
  analytics,
  activity,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  activity: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <section>{analytics}</section>
      <section>{activity}</section>
    </div>
  );
}

This is different from simply importing two components into one page. Parallel routes are part of the routing tree. Each slot can have route-specific files such as loading.tsx, error.tsx, and default.tsx.

default.tsx is particularly important because a slot may not have a matching route during navigation or an initial render. It provides fallback UI for that slot.

Parallel routes are useful for dashboards, admin interfaces, monitoring systems, inboxes, and other applications where multiple independent areas need to participate in navigation.
`,
      diagram: `
app/dashboard/
│
├── layout.tsx
├── page.tsx
│
├── @analytics/
│   └── page.tsx
│
└── @activity/
    └── page.tsx

                 Dashboard Layout
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
       children      analytics      activity
          │             │             │
          ▼             ▼             ▼
        Main UI       Charts        Activity
`,
      codeExample: {
        title: "Rendering parallel route slots",
        code: `// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  activity,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  activity: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <main>{children}</main>

      <aside>{analytics}</aside>

      <aside>{activity}</aside>
    </div>
  );
}

// app/dashboard/@analytics/page.tsx
export default function AnalyticsSlot() {
  return <div>Analytics chart</div>;
}

// app/dashboard/@activity/page.tsx
export default function ActivitySlot() {
  return <div>Recent activity</div>;
}`,
      },
      keyTakeaways: [
        "Parallel route slots use the @folder convention.",
        "Slots are passed into their parent layout as props.",
        "Slot names do not become URL segments.",
        "Parallel routes allow independent UI regions to participate in routing.",
        "default.tsx can provide fallback UI when a slot has no matching route."
      ],
      commonMistakes: [
        "Expecting @analytics to appear in the URL.",
        "Forgetting to add the slot as a prop to the parent layout.",
        "Treating every component composition problem as a parallel-route problem.",
        "Ignoring default.tsx when a slot needs a fallback state."
      ],
      quiz: [
        {
          question: "How is a parallel route slot named?",
          options: ["#analytics", "@analytics", "[analytics]", "(analytics)"],
          correctIndex: 1,
          explanation: "The @folder convention creates a named parallel route slot."
        },
        {
          question: "Where are parallel route slots normally received?",
          options: ["The database model", "The parent layout", "next.config.ts", "package.json"],
          correctIndex: 1,
          explanation: "The parent layout receives slots such as analytics and activity as props."
        }
      ]
    },

    {
      id: "nextjs-26-4",
      title: "Intercepting Routes",
      durationMinutes: 15,
      explanation: `
Intercepting Routes allow one route to be displayed inside the UI of another route when navigation happens through the application. This is especially powerful for modal experiences.

The key idea is that the URL can point to a real page, while client-side navigation can display that page in an overlay over the current page.

Next.js uses special folder conventions for interception. The notation describes how far up the route tree the router should look:

(.) matches a segment at the same level.
(..) matches one level above.
(..)(..) matches two levels above.
(...) matches from the root of the app.

The exact folder placement matters. Intercepting routes work together with the route hierarchy, so you should design the folder structure carefully rather than thinking of the notation as a generic relative filesystem import.

A common example is a photo gallery. Suppose /photos contains a grid. Clicking a photo can navigate to /photos/123 while an intercepting route displays the photo as a modal over the gallery. If the user refreshes /photos/123 or opens it directly, the full photo page can be rendered instead.

This gives you two useful behaviors from the same URL:

Client navigation:
Gallery + modal

Direct navigation:
Full photo page

The browser URL still represents the actual resource, which makes the modal deep-linkable and shareable.

Intercepting routes become most useful when combined with parallel routes. One route tree can keep the underlying page visible while another slot displays the intercepted page as an overlay.
`,
      diagram: `
User clicks photo

        /photos
           │
           │ client navigation
           ▼
     /photos/123
           │
           ▼
   ┌───────────────────┐
   │   Photo Modal     │
   │                   │
   │     [ image ]     │
   │                   │
   └───────────────────┘
        over gallery

Direct visit to /photos/123:

        /photos/123
             │
             ▼
       Full Photo Page
`,
      codeExample: {
        title: "Conceptual intercepting route structure",
        code: `app/
├── photos/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
│
└── @modal/
    └── (.)photos/
        └── [id]/
            └── page.tsx

The regular route can render the full photo page.

The intercepted route can render the same photo
inside a modal when the user navigates from the gallery.`,
      },
      keyTakeaways: [
        "Intercepting routes can display a route in a different UI context during client navigation.",
        "They are especially useful for modal routing.",
        "(.) means same-level interception, while ..-style conventions move upward in the route hierarchy.",
        "The same resource can have both a full-page and modal presentation.",
        "Intercepting routes are commonly combined with parallel routes."
      ],
      commonMistakes: [
        "Thinking interception changes the canonical resource URL.",
        "Putting the intercepting folder at the wrong level of the route tree.",
        "Building modal routing without considering direct URL access and refresh behavior.",
        "Using interception when a normal client-side component modal would be simpler."
      ],
      quiz: [
        {
          question: "What is a major use case for intercepting routes?",
          options: ["Database migrations", "Modal navigation", "CSS compilation", "Environment variables"],
          correctIndex: 1,
          explanation: "Intercepting routes are particularly useful for displaying a route as a modal during navigation."
        },
        {
          question: "What should happen when a user directly visits a photo URL?",
          options: [
            "The route must always fail",
            "The full photo page can be rendered",
            "The browser must open a new tab",
            "The photo must become a server action"
          ],
          correctIndex: 1,
          explanation: "A well-designed intercepted route supports both modal navigation and direct full-page access."
        }
      ]
    },

    {
      id: "nextjs-26-5",
      title: "Modal Routing Architecture",
      durationMinutes: 15,
      explanation: `
A production-quality modal route is more than a dialog component. It should have a meaningful URL, work with browser navigation, support direct access, and preserve the underlying application when appropriate.

A common architecture combines three ideas:

1. A normal route represents the resource.
2. A parallel route provides a modal slot.
3. An intercepting route renders the resource inside that slot during client navigation.

For example, imagine a photo application:

/photos
/photos/123

The /photos/123 route is the canonical photo page. When the user clicks the photo from /photos, the application can intercept the navigation and render the photo inside a modal.

Closing the modal should generally use navigation rather than manually hiding the dialog. For example, router.back() can return the user to the gallery when the modal was opened through navigation. You should still design for direct visits because router history can differ depending on how the user reached the URL.

A useful mental model is:

URL = resource identity
Route = page representation
Parallel slot = place where an alternate representation can render
Intercepting route = rule that chooses the alternate representation during navigation

This approach keeps the URL meaningful while giving users a fast, app-like interaction.

Do not put every modal in the routing system. Routing is useful when the modal represents meaningful navigation state: a photo detail page, authentication page, product detail, document preview, or similar resource. A small confirmation dialog such as "Are you sure?" usually does not need its own URL.

The architecture should also consider loading, errors, accessibility, and focus management. The route mechanism solves navigation; it does not automatically make the modal accessible. The dialog itself still needs correct semantic and keyboard behavior.
`,
      diagram: `
                  URL
                   │
              /photos/123
                   │
        ┌──────────┴──────────┐
        │                     │
 Client navigation       Direct navigation
 from /photos                  │
        │                      │
        ▼                      ▼
 Intercepting route       Normal route
        │                      │
        ▼                      ▼
 Parallel @modal slot      Full page
        │
        ▼
   Photo Modal

Modal close
    │
    ▼
router.back()
    │
    ▼
/photos
`,
      codeExample: {
        title: "Opening and closing a route-driven modal",
        code: `"use client";

import { useRouter } from "next/navigation";

export function CloseModalButton() {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.back()}>
      Close
    </button>
  );
}

// A route-driven modal should still:
// - have a meaningful URL
// - support direct navigation
// - handle loading and errors
// - manage focus and keyboard interaction
// - provide an accessible dialog structure`,
      },
      keyTakeaways: [
        "A route-driven modal represents meaningful navigation state.",
        "Parallel routes provide a place for the modal UI.",
        "Intercepting routes can make client navigation show the resource as a modal.",
        "Direct navigation should still produce a useful full-page experience.",
        "Routing does not automatically solve modal accessibility."
      ],
      commonMistakes: [
        "Using route-driven modals for every small confirmation dialog.",
        "Only testing the modal through client navigation and forgetting refresh/direct URL access.",
        "Closing the modal by only changing local React state.",
        "Forgetting focus management, keyboard behavior, and semantic dialog requirements.",
        "Designing the route tree before deciding what URL should represent the resource."
      ],
      quiz: [
        {
          question: "What should a meaningful route-driven modal have?",
          options: [
            "Only local component state",
            "A meaningful URL representing the resource",
            "No browser history",
            "No direct-access behavior"
          ],
          correctIndex: 1,
          explanation: "A route-driven modal represents navigation state, so the URL should meaningfully identify the resource."
        },
        {
          question: "Which combination is commonly used for modal routing?",
          options: [
            "Middleware and CSS",
            "Parallel routes and intercepting routes",
            "Database triggers and cookies",
            "Static assets and fonts"
          ],
          correctIndex: 1,
          explanation: "Parallel routes provide the modal slot, while intercepting routes control the alternate presentation during navigation."
        }
      ]
    }
  ],

  finalQuiz: [
    {
      question: "What is the main purpose of a route group such as (dashboard)?",
      options: [
        "To add dashboard to every URL",
        "To organize routes without adding the folder to the URL",
        "To make the dashboard a Client Component",
        "To create a database schema"
      ],
      correctIndex: 1,
      explanation: "Route groups organize the filesystem while their folder name is omitted from the URL."
    },
    {
      question: "Which route pattern can match /docs/react/hooks?",
      options: [
        "app/docs/[id]/page.tsx",
        "app/docs/[...slug]/page.tsx",
        "app/docs/(slug)/page.tsx",
        "app/docs/@slug/page.tsx"
      ],
      correctIndex: 1,
      explanation: "[...slug] is a catch-all segment that can capture multiple path segments."
    },
    {
      question: "What does @analytics represent in a route tree?",
      options: [
        "A dynamic URL segment",
        "A parallel route slot",
        "A route group",
        "A middleware file"
      ],
      correctIndex: 1,
      explanation: "The @ convention creates a named parallel route slot."
    },
    {
      question: "Why are intercepting routes useful for photo galleries?",
      options: [
        "They compress images",
        "They allow a photo URL to be presented as a modal during navigation",
        "They automatically upload photos",
        "They replace dynamic segments"
      ],
      correctIndex: 1,
      explanation: "Intercepting routes can present a destination route as a modal while preserving the gallery underneath."
    },
    {
      question: "What is an important property of a route-driven modal?",
      options: [
        "It should never have a URL",
        "It should only work after a page refresh",
        "It should represent meaningful navigation state",
        "It should always use local state only"
      ],
      correctIndex: 2,
      explanation: "Route-driven modals are appropriate when the modal represents meaningful navigation state and can be represented by a URL."
    },
    {
      question: "What is the difference between [id] and [...slug]?",
      options: [
        "[id] captures one segment while [...slug] captures multiple segments",
        "They are exactly the same",
        "[id] creates a route group while [...slug] creates a layout",
        "[id] is only for client components"
      ],
      correctIndex: 0,
      explanation: "[id] represents one dynamic segment; [...slug] captures multiple path segments as an array."
    }
  ],

  project: {
    name: "Advanced Application Dashboard",
    goal: "Build a realistic Next.js application that uses route groups, nested layouts, dynamic routes, catch-all routes, parallel routes, and intercepting routes.",
    brief: `
Build a project-management dashboard called "WorkSpace".

The application should contain a public area and an application area. Organize the application area with a route group and give it its own nested layout.

Create a project list and dynamic project pages. Each project should have a URL such as /projects/42. Add a documentation section using a catch-all route so paths such as /docs/getting-started and /docs/projects/settings can be handled by one route.

The dashboard should contain independent panels such as activity and notifications using parallel routes.

Finally, implement a route-driven project preview modal. Clicking a project from the project list should navigate to the project URL while displaying the project details as a modal over the list. Directly opening the same URL should display a full project page.
`,
    steps: [
      "Create the public and dashboard route structure using route groups.",
      "Create a nested dashboard layout with persistent navigation.",
      "Create /projects and /projects/[id] dynamic routes.",
      "Create a /docs/[...slug] catch-all documentation route.",
      "Add parallel dashboard slots such as @activity and @notifications.",
      "Add default.tsx where a parallel slot needs a fallback.",
      "Create a project modal slot using an intercepting route.",
      "Make the project modal use the same project URL as the full project page.",
      "Test navigation from /projects to /projects/1 and verify the modal behavior.",
      "Open /projects/1 directly and verify that the full-page project view works.",
      "Test browser Back and Close behavior.",
      "Add loading, error, and accessible dialog behavior where appropriate."
    ],
    acceptance: [
      "Route groups organize the application without appearing in URLs.",
      "Dashboard pages share a nested dashboard layout.",
      "Dynamic project pages correctly read the project id.",
      "The documentation route supports multiple path segments.",
      "Parallel routes render independent dashboard panels.",
      "The project modal appears during client navigation from the project list.",
      "The same project URL works as a full page when opened directly.",
      "Browser Back returns to the previous application state.",
      "The modal has appropriate keyboard and focus behavior.",
      "The application remains understandable when the route tree is inspected."
    ],
    stretch: [
      "Add a second parallel slot for a persistent command panel.",
      "Add a dynamic project status section using a nested route.",
      "Add an intercepted task-detail modal inside a project.",
      "Add separate loading and error UI for the parallel slots.",
      "Experiment with two independent root layouts and document the navigation trade-offs."
    ]
  }
};
