import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_27_LESSONS: LessonDay = {
  day: 27,
  title: "Parallel and Intercepting Routes",
  totalMinutes: 85,
  difficulty: "Advanced",
  lessons: [
    {
      id: "nextjs-27-1",
      title: "Building Dashboard Panels with Parallel Routes",
      durationMinutes: 17,
      explanation: `
Parallel Routes become much more useful when you build an application that has several independent areas on the same screen. A dashboard is a good example because the main content, activity feed, notifications, and other panels can have different loading and error states.

A parallel route slot is created with an @folder. For example, app/dashboard/@analytics/page.tsx creates an analytics slot. The slot is passed to the dashboard layout as a prop.

The important distinction is that a parallel route is part of the routing tree. You are not simply importing a component. Because it participates in routing, the slot can have its own loading.tsx, error.tsx, and default.tsx.

A practical dashboard might look like this:

app/dashboard/
├── layout.tsx
├── page.tsx
├── @analytics/page.tsx
├── @activity/page.tsx
└── @notifications/page.tsx

The layout can render all three areas independently. If the activity data is slow, the activity slot can show its own loading UI while the main dashboard and analytics continue rendering.

This is particularly useful when different panels depend on different data sources. You should not use parallel routes simply because you have several visual components. Use them when those areas need independent routing behavior or UI states.
`,
      diagram: `
                    Dashboard Layout
                           |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v
    children            @activity        @notifications
        |                  |                  |
    Main content       Activity feed       Alerts
        |                  |                  |
        +------------------+------------------+
                           |
                   Independent UI states
`,
      codeExample: {
        title: "Dashboard with independent route slots",
        code: `// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  activity,
  notifications,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  activity: React.ReactNode;
  notifications: React.ReactNode;
}) {
  return (
    <div className="grid gap-4">
      <main>{children}</main>

      <section className="grid grid-cols-2 gap-4">
        {analytics}
        {activity}
      </section>

      <aside>{notifications}</aside>
    </div>
  );
}

// app/dashboard/@activity/page.tsx
export default async function Activity() {
  const activities = await getRecentActivity();

  return (
    <section>
      <h2>Recent activity</h2>
      {activities.map((item) => (
        <p key={item.id}>{item.message}</p>
      ))}
    </section>
  );
}`,
      },
      keyTakeaways: [
        "Parallel routes are useful for independently routed UI regions.",
        "Each slot is represented by an @folder.",
        "The parent layout receives slots as React props.",
        "Slots can have their own loading, error, and default UI.",
        "Use parallel routes for meaningful routing boundaries, not every visual component."
      ],
      commonMistakes: [
        "Forgetting to accept a slot as a layout prop.",
        "Assuming slot names become URL segments.",
        "Making every dashboard card a parallel route.",
        "Not providing fallback behavior for a slot that may not match."
      ],
      quiz: [
        {
          question: "Why might a dashboard use parallel routes?",
          options: [
            "To make CSS load faster",
            "To give independent dashboard areas their own routing and UI states",
            "To replace all Server Components",
            "To create database indexes"
          ],
          correctIndex: 1,
          explanation: "Parallel routes are useful when different dashboard regions need independent routing, loading, or error behavior."
        },
        {
          question: "Where are slot values such as activity normally rendered?",
          options: ["The parent layout", "package.json", "next.config.ts", "The database"],
          correctIndex: 0,
          explanation: "The parent layout receives parallel route slots as props."
        }
      ]
    },
    {
      id: "nextjs-27-2",
      title: "Photo Gallery and Route-Driven Photo Pages",
      durationMinutes: 17,
      explanation: `
A photo gallery is one of the clearest examples of advanced routing because the same photo needs two useful presentations.

When a user visits /photos/123 directly, the application should be able to render a complete photo detail page. But when the user clicks photo 123 from /photos, an application like Instagram can keep the gallery visible and display the photo in a modal.

The resource URL should remain meaningful:

/photos/123

That URL identifies the photo regardless of whether the UI displays it as a full page or a modal.

Start with a normal dynamic route:

app/photos/[id]/page.tsx

This page is the canonical full-page representation. Then add a modal slot and an intercepting route that renders the same resource inside the modal during client navigation.

This separation is important. The photo page should contain the actual photo-detail logic. The modal should mainly provide the alternate presentation and navigation behavior.

For a production application, the photo page should also handle not-found resources, loading states, authorization where necessary, metadata, and accessibility.
`,
      diagram: `
                         /photos
                            |
                       Photo Grid
                            |
                       click photo
                            |
                            v
                       /photos/123
                            |
                 +----------+----------+
                 |                     |
          client navigation       direct visit
                 |                     |
                 v                     v
          intercepted modal       full page
                 |
                 v
          gallery remains visible
`,
      codeExample: {
        title: "Canonical dynamic photo page",
        code: `// app/photos/[id]/page.tsx
import { notFound } from "next/navigation";

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = await getPhoto(id);

  if (!photo) {
    notFound();
  }

  return (
    <article>
      <h1>{photo.title}</h1>
      <img src={photo.url} alt={photo.alt} />
      <p>{photo.description}</p>
    </article>
  );
}`,
      },
      keyTakeaways: [
        "The dynamic photo route should remain the canonical resource URL.",
        "The modal is an alternate presentation of the same resource.",
        "Direct navigation and client navigation should both work.",
        "notFound() is useful when the requested photo does not exist.",
        "Separate resource logic from modal presentation logic."
      ],
      commonMistakes: [
        "Creating a completely different URL for the modal version.",
        "Only implementing the modal and forgetting the full-page route.",
        "Duplicating all photo-fetching logic unnecessarily.",
        "Ignoring not-found and loading states."
      ],
      quiz: [
        {
          question: "What should /photos/123 identify?",
          options: ["Only the modal", "The photo resource", "Only the gallery", "A route group"],
          correctIndex: 1,
          explanation: "The URL should identify the photo resource regardless of its presentation."
        },
        {
          question: "Why keep a full photo page?",
          options: [
            "For direct navigation and refresh",
            "Because modals cannot use images",
            "To remove dynamic routing",
            "To avoid layouts"
          ],
          correctIndex: 0,
          explanation: "Direct visits, refreshes, and shared links need a complete page representation."
        }
      ]
    },
    {
      id: "nextjs-27-3",
      title: "Modal Routes with Parallel and Intercepting Routes",
      durationMinutes: 18,
      explanation: `
A route-driven modal combines parallel routes and intercepting routes. Parallel routes provide a dedicated place where the modal can render. Intercepting routes allow navigation to a destination route to be presented in that modal slot.

The architecture can be understood as three layers:

The normal route answers: "What is this resource?"

The parallel slot answers: "Where should an alternate presentation appear?"

The intercepting route answers: "When should this destination be rendered inside that alternate presentation?"

This makes a modal URL-aware. If the user clicks a photo, the browser URL can become /photos/123 while the gallery remains underneath.

Closing the modal can use router.back(), but you should think about browser history carefully. If the user opened /photos/123 directly, going back may take them somewhere completely different. Therefore, the modal presentation should not assume that every visit originated from the gallery.

The modal itself should be accessible. Use an appropriate dialog structure, trap or manage focus correctly, support Escape when appropriate, provide a clear close control, and ensure screen readers understand the dialog.
`,
      diagram: `
Parallel route:
app/
├── photos/
│   └── page.tsx
└── @modal/

Intercepting route:
@modal/
└── (.)photos/
    └── [id]/

Navigation:

/photos
   |
   | click
   v
/photos/123
   |
   +--> normal route = full photo page
   |
   +--> intercepted route = modal presentation
`,
      codeExample: {
        title: "Accessible modal shell with navigation",
        code: `"use client";

import { useRouter } from "next/navigation";

export function PhotoModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo details"
    >
      <button type="button" onClick={() => router.back()}>
        Close
      </button>

      {children}
    </div>
  );
}`,
      },
      keyTakeaways: [
        "Parallel routes provide the modal slot.",
        "Intercepting routes provide the alternate presentation during navigation.",
        "The URL should continue to identify the actual resource.",
        "A route-driven modal must still be accessible.",
        "Direct visits require a full-page fallback."
      ],
      commonMistakes: [
        "Thinking an intercepting route replaces the canonical route.",
        "Using router.back() without considering direct visits.",
        "Ignoring focus management and keyboard navigation.",
        "Duplicating the photo page instead of reusing resource logic."
      ],
      quiz: [
        {
          question: "What does the parallel route provide in this pattern?",
          options: ["The database", "The modal rendering slot", "The URL slug", "The image optimizer"],
          correctIndex: 1,
          explanation: "The parallel route gives the application a slot where the modal can be rendered."
        },
        {
          question: "What does the intercepting route control?",
          options: [
            "How a destination route is presented during navigation",
            "How images are compressed",
            "How passwords are hashed",
            "How CSS is bundled"
          ],
          correctIndex: 0,
          explanation: "Interception allows the destination route to be displayed in another routing context."
        }
      ]
    },
    {
      id: "nextjs-27-4",
      title: "Login Modal and Nested Application Layouts",
      durationMinutes: 16,
      explanation: `
Authentication pages are another useful case for modal routing. A public website can let a user open /login as a modal without losing the page underneath. If the user directly visits /login, the same route can render as a full page.

This pattern is especially useful for applications where users frequently move between public content and authentication. The login route remains a real route, so it can be bookmarked, refreshed, or shared.

Nested layouts should separate the public and application experiences. A public marketing layout might contain a header and footer, while the authenticated application layout might contain a sidebar, top navigation, and account controls.

For example:

app/
├── (marketing)/
│   ├── layout.tsx
│   └── page.tsx
├── (app)/
│   ├── layout.tsx
│   ├── dashboard/
│   └── profile/
└── login/

The route groups allow organization without changing URLs.

Authentication itself should still happen in the server-side authentication layer. The routing pattern controls presentation and navigation; it should not be treated as the security boundary.
`,
      diagram: `
Public shell
     |
     +-- /pricing
     +-- /about
     +-- /login  <-- can be modal
                     |
                     v
              Authentication
                     |
                     v
             authenticated app
                     |
                App Layout
                     |
          +----------+----------+
          |                     |
      /dashboard             /profile
`,
      codeExample: {
        title: "Separating public and authenticated layouts",
        code: `// app/(marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>Public Website</header>
      {children}
      <footer>Footer</footer>
    </>
  );
}

// app/(app)/layout.tsx
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside>Application Navigation</aside>
      <main>{children}</main>
    </div>
  );
}`,
      },
      keyTakeaways: [
        "Login can be represented as a real route and optionally presented as a modal.",
        "Route groups can separate public and authenticated application areas.",
        "Nested layouts keep application shells persistent.",
        "Routing presentation and authentication security are separate concerns.",
        "Direct navigation to authentication routes must still work."
      ],
      commonMistakes: [
        "Treating a login modal as the authentication security boundary.",
        "Duplicating the public and authenticated navigation in every page.",
        "Forgetting to support direct /login navigation.",
        "Mixing authentication logic into visual modal code."
      ],
      quiz: [
        {
          question: "Why should /login remain a real route?",
          options: [
            "So it can support direct navigation and meaningful browser history",
            "Because modals cannot contain forms",
            "To disable authentication",
            "To avoid layouts"
          ],
          correctIndex: 0,
          explanation: "A real route makes the login state addressable and usable through direct navigation."
        },
        {
          question: "What should protect authenticated data?",
          options: [
            "The modal component",
            "The server-side authentication and authorization layer",
            "CSS",
            "The route group name"
          ],
          correctIndex: 1,
          explanation: "Security must be enforced on the server-side data and authorization boundary."
        }
      ]
    },
    {
      id: "nextjs-27-5",
      title: "Complete Instagram-Style Routing Architecture",
      durationMinutes: 17,
      explanation: `
An Instagram-style photo application combines almost every advanced routing concept from the previous lessons.

The application can have a public landing page, an authenticated application shell, a feed, profiles, photo detail pages, and modal presentations. The important part is not simply adding advanced routing features. The goal is to use each feature where it solves a real architectural problem.

A possible structure is:

app/
├── layout.tsx
├── (marketing)/
│   ├── page.tsx
│   └── about/page.tsx
├── (app)/
│   ├── layout.tsx
│   ├── feed/page.tsx
│   ├── profile/[username]/page.tsx
│   └── photos/[id]/page.tsx
├── @modal/
│   └── (.)photos/[id]/page.tsx
└── login/

The feed can use parallel slots for notifications or activity. The photo route provides the canonical resource page. The intercepting route presents it as a modal when opened from the feed.

The key architectural principle is to keep the URL meaningful while allowing the UI presentation to change based on navigation context.

This also makes the application resilient. A shared photo URL can work when opened from a feed, pasted into another browser, refreshed, or indexed by search engines. The route tree determines the correct representation.
`,
      diagram: `
                    Instagram-style App
                            |
             +--------------+--------------+
             |                             |
        Public Area                   Application
             |                             |
       /about /login                  /feed
                                           |
                              +------------+------------+
                              |                         |
                       /profile/[username]         /photos/[id]
                                                        |
                                      +-----------------+----------------+
                                      |                                  |
                                direct visit                     feed navigation
                                      |                                  |
                                      v                                  v
                                  full page                    intercepted modal
`,
      codeExample: {
        title: "Example application route tree",
        code: `app/
├── layout.tsx
├── (marketing)/
│   ├── page.tsx
│   └── about/page.tsx
│
├── (app)/
│   ├── layout.tsx
│   ├── feed/page.tsx
│   └── profile/
│       └── [username]/
│           └── page.tsx
│
├── photos/
│   └── [id]/
│       └── page.tsx
│
└── @modal/
    └── (.)photos/
        └── [id]/
            └── page.tsx`,
      },
      keyTakeaways: [
        "Advanced routing works best when each feature has a clear purpose.",
        "A photo resource can have both full-page and modal representations.",
        "Route groups keep large application areas organized.",
        "Nested layouts separate public and authenticated shells.",
        "Parallel and intercepting routes work together for app-like experiences."
      ],
      commonMistakes: [
        "Adding advanced routing conventions without a real architectural need.",
        "Designing filesystem structure without first defining the URL model.",
        "Testing only happy-path client navigation.",
        "Ignoring direct access, refresh, back navigation, and accessibility."
      ],
      quiz: [
        {
          question: "What is the main architectural goal of this Instagram-style pattern?",
          options: [
            "Hide every URL",
            "Keep resource URLs meaningful while supporting alternate UI presentations",
            "Make all pages client-side",
            "Remove dynamic routes"
          ],
          correctIndex: 1,
          explanation: "The architecture keeps URLs meaningful while allowing a photo to appear as a modal or full page."
        },
        {
          question: "Which concepts work together for photo modals?",
          options: [
            "Parallel and intercepting routes",
            "Metadata and fonts",
            "Sitemap and robots",
            "Cookies and middleware only"
          ],
          correctIndex: 0,
          explanation: "Parallel routes provide the modal slot and intercepting routes provide the alternate navigation presentation."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What does an @folder represent?",
      options: ["A dynamic segment", "A parallel route slot", "A route group", "A catch-all segment"],
      correctIndex: 1,
      explanation: "The @folder convention creates a named parallel route slot."
    },
    {
      question: "Why should a photo modal have a normal photo route as well?",
      options: [
        "To support direct navigation and refresh",
        "To disable browser history",
        "To avoid dynamic routing",
        "Because modals cannot display images"
      ],
      correctIndex: 0,
      explanation: "The normal route provides a complete representation when the URL is opened directly."
    },
    {
      question: "What is the role of an intercepting route in a modal pattern?",
      options: [
        "It changes the database",
        "It presents the destination route in an alternate routing context",
        "It creates the authentication session",
        "It compresses images"
      ],
      correctIndex: 1,
      explanation: "Interception lets a destination route be displayed in a modal during client navigation."
    },
    {
      question: "Should a modal itself be considered the security boundary?",
      options: ["Yes", "No", "Only in production", "Only for GET requests"],
      correctIndex: 1,
      explanation: "Authentication and authorization must be enforced on the server-side security boundary."
    },
    {
      question: "Which architecture best fits an Instagram-style photo modal?",
      options: [
        "Only local React state",
        "Normal dynamic route + parallel modal slot + intercepting route",
        "Only a catch-all route",
        "Only a route group"
      ],
      correctIndex: 1,
      explanation: "This combination gives the resource a real URL and supports modal presentation during client navigation."
    }
  ],
  project: {
    name: "Instagram-Style Photo Application",
    goal: "Build a realistic photo application that uses parallel routes, intercepting routes, dynamic routes, nested layouts, and route-driven modals.",
    brief: `
Build a small Instagram-style application called "SnapSpace".

The application should have a public landing page and an authenticated application shell. Users should be able to browse a photo feed, open user profiles, and view individual photos.

Clicking a photo from the feed should update the URL to the photo URL while displaying the photo in a modal over the feed. Opening the same URL directly should display the photo as a full page.

Add a login route that can be presented as a modal from the public application, while still supporting direct navigation to /login.
`,
    steps: [
      "Create public and application route groups.",
      "Create an authenticated application layout with persistent navigation.",
      "Build a photo feed.",
      "Create /profile/[username] as a dynamic profile route.",
      "Create /photos/[id] as the canonical photo route.",
      "Create a parallel @modal slot.",
      "Add an intercepting photo route inside the modal slot.",
      "Create an accessible photo modal.",
      "Add loading and not-found behavior for photo pages.",
      "Create a login route and support modal presentation.",
      "Test direct URL access, refresh, Back, and modal close behavior.",
      "Verify that the photo URL remains meaningful in every presentation."
    ],
    acceptance: [
      "The application uses route groups for organization.",
      "The application shell is implemented with a nested layout.",
      "Profiles use dynamic route segments.",
      "Photos have a canonical dynamic URL.",
      "Photo navigation from the feed opens a modal.",
      "Direct photo navigation renders a full page.",
      "Browser Back closes or exits the modal appropriately.",
      "The modal has accessible dialog semantics.",
      "Login works as a real route and can be presented as a modal.",
      "The route architecture remains understandable and maintainable."
    ],
    stretch: [
      "Add an @notifications parallel slot.",
      "Add a comments panel as another routed area.",
      "Add intercepted profile previews.",
      "Add optimistic likes using the concepts from Day 18.",
      "Add authentication and authorization from Days 21–25."
    ]
  },
};
