import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_2_LESSONS: LessonDay = {
  day: 2,
  title: "App Router Fundamentals",
  totalMinutes: 58,
  difficulty: "Beginner",
  lessons: [
    {
      id: "app-directory-and-page",
      title: "The app/ directory and page.tsx",
      durationMinutes: 14,
      explanation: "Next.js App Router uses the `app/` directory to describe the URL structure of your application. Instead of putting every page into one routing configuration file, you create folders and special files, and Next.js turns that file structure into routes.\n\nThe most important file to understand today is `page.tsx`. A <b>page</b> (the UI that can be rendered for a URL) is created when a folder contains a `page.tsx` file.\n\nFor example, this structure creates a home page and an about page:\n\n```text\napp/\n├── page.tsx          → /\n└── about/\n    └── page.tsx      → /about\n```\n\nThe folder name becomes the <b>route segment</b> (one part of a URL path), while `page.tsx` says that this segment is actually a page users can visit.\n\n---\n\n### 1. Basic — your first App Router page\n\nA minimal page is just a React component:\n\n```tsx\nexport default function HomePage() {\n  return <h1>Welcome to my documentation site</h1>;\n}\n```\n\nThe `default export` matters because Next.js needs to know which component represents the page. You can create helper components in the same file, but the page component itself must be the default export.\n\nThe important mental model is:\n\n```text\napp/\n  page.tsx\n     ↓\n    /\n     ↓\nHomePage component\n```\n\nThere is no need to manually write a route such as `router.get('/')` or a route table for this page.\n\n---\n\n### 2. Intermediate — route segments come from folders\n\nSuppose your documentation site has JavaScript and React sections:\n\n```text\napp/\n├── page.tsx\n├── javascript/\n│   └── page.tsx\n└── react/\n    └── page.tsx\n```\n\nNext.js maps those folders to:\n\n```text\n/              → app/page.tsx\n/javascript    → app/javascript/page.tsx\n/react         → app/react/page.tsx\n```\n\nA folder does not automatically become a visible page. The route becomes a page only when the appropriate special file exists.\n\nThat distinction becomes important when you start adding layouts, route groups, private folders, loading states and other App Router features. The folder structure describes the route tree, while special files tell Next.js what that segment does.\n\n---\n\n### 3. Advanced — index routes and the meaning of `page.tsx`\n\nIn older routing systems you may hear the term <b>index route</b> (the default page for a directory). In App Router, the equivalent idea is simply `page.tsx` inside that route segment.\n\n```text\napp/docs/page.tsx\n```\n\nmeans:\n\n```text\n/docs\n```\n\nwhile:\n\n```text\napp/docs/getting-started/page.tsx\n```\n\nmeans:\n\n```text\n/docs/getting-started\n```\n\nThink of `page.tsx` as the point where a route segment becomes directly visitable.\n\nOne common beginner mistake is creating `app/docs.tsx` and expecting `/docs` to appear. App Router does not work that way. The directory represents the segment, and `page.tsx` represents the page for that segment.",
      diagram: `How folders become URLs

app/
├── page.tsx
├── docs/
│   ├── page.tsx
│   └── getting-started/
│       └── page.tsx
└── about/
    └── page.tsx

        │
        ↓

/                     → app/page.tsx
/docs                 → app/docs/page.tsx
/docs/getting-started → app/docs/getting-started/page.tsx
/about                → app/about/page.tsx

Folder = route segment
page.tsx = visitable page`,
      codeExample: {
        title: "A small documentation route tree",
        code: `// app/page.tsx
export default function HomePage() {
  return (
    <main>
      <h1>Developer Docs</h1>
      <p>Learn JavaScript, React and Next.js.</p>
    </main>
  );
}

// app/docs/page.tsx
export default function DocsPage() {
  return (
    <main>
      <h1>Documentation</h1>
      <p>Choose a topic to start learning.</p>
    </main>
  );
}

// app/docs/getting-started/page.tsx
export default function GettingStartedPage() {
  return (
    <main>
      <h1>Getting Started</h1>
      <p>Install Next.js and create your first App Router page.</p>
    </main>
  );
}

// app/about/page.tsx
export default function AboutPage() {
  return (
    <main>
      <h1>About</h1>
      <p>This documentation site is built with Next.js.</p>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "The `app/` directory is the foundation of the App Router route tree.",
        "`page.tsx` defines the UI for a route that users can visit.",
        "A folder normally represents one <b>route segment</b>.",
        "`app/docs/page.tsx` maps to `/docs`.",
        "`app/docs/getting-started/page.tsx` maps to `/docs/getting-started`.",
        "A folder by itself does not automatically create a page.",
        "The default export from `page.tsx` is the page component Next.js renders.",
      ],
      commonMistakes: [
        "<b>Creating `app/docs.tsx` instead of `app/docs/page.tsx`.</b> App Router uses folders for route segments.",
        "<b>Thinking every folder is automatically a public URL.</b> A page needs the appropriate special file.",
        "<b>Forgetting the default export.</b> The route's page component should be exported as the default export.",
        "<b>Putting unrelated files into the URL structure.</b> Only App Router special files and route segments have routing meaning.",
      ],
      quiz: [
        {
          question: "Which file creates the `/docs` page?",
          options: [
            "`app/docs.tsx`",
            "`app/docs/page.tsx`",
            "`app/page/docs.tsx`",
            "`pages/docs.tsx`",
          ],
          correctIndex: 1,
          explanation: "The `docs` folder is the route segment and its `page.tsx` defines the page.",
        },
        {
          question: "What does a folder normally represent in the App Router?",
          options: [
            "A database table",
            "A route segment",
            "A React prop",
            "A CSS scope",
          ],
          correctIndex: 1,
          explanation: "Folder names become URL path segments.",
        },
        {
          question: "What does `app/docs/getting-started/page.tsx` represent?",
          options: [
            "`/page/docs/getting-started`",
            "`/docs/getting-started`",
            "`/getting-started/docs`",
            "`/docs` only",
          ],
          correctIndex: 1,
          explanation: "Each nested folder contributes a route segment.",
        },
      ],
    },
    {
      id: "nested-routes-and-layouts",
      title: "Nested routes, root layout and multiple layouts",
      durationMinutes: 16,
      explanation: "Real applications are rarely one level deep. A documentation site might have `/docs`, `/docs/javascript`, `/docs/react` and `/docs/nextjs`. App Router lets the folder tree describe that hierarchy directly.\n\nThe second important special file is `layout.tsx`. A <b>layout</b> (shared UI that wraps pages in a route segment) lets you keep navigation, headers, sidebars or other persistent structure outside individual pages.\n\nEvery App Router application needs a <b>root layout</b> at `app/layout.tsx`. It is the top-level wrapper for the application and is where you normally place `<html>` and `<body>`.\n\n---\n\n### 1. Basic — the root layout\n\nA root layout can look like this:\n\n```tsx\nexport default function RootLayout({\n  children,\n}: Readonly<{ children: React.ReactNode }>) {\n  return (\n    <html lang=\"en\">\n      <body>{children}</body>\n    </html>\n  );\n}\n```\n\n`children` means \"render the page or nested layout that belongs inside me.\" So when the user visits `/docs`, the page is placed inside the root layout.\n\n```text\nRootLayout\n└── children\n    └── DocsPage\n```\n\nThe root layout is not another page. It is the outer structure around pages.\n\n---\n\n### 2. Intermediate — nested layouts\n\nYou can add another `layout.tsx` deeper in the tree:\n\n```text\napp/\n├── layout.tsx\n├── page.tsx\n└── docs/\n    ├── layout.tsx\n    ├── page.tsx\n    ├── javascript/\n    │   └── page.tsx\n    └── react/\n        └── page.tsx\n```\n\nNow every page under `/docs` can share the documentation layout.\n\n```text\napp/layout.tsx\n      │\n      ↓\nDocs layout\n      │\n      ├── /docs\n      ├── /docs/javascript\n      └── /docs/react\n```\n\nThis is useful because the documentation sidebar does not need to be copied into every page. The parent layout owns that shared UI.\n\n---\n\n### 3. Advanced — multiple layouts create UI boundaries\n\nA layout is attached to a segment and its descendants. This lets different parts of an application have different shells.\n\nFor example:\n\n```text\napp/\n├── layout.tsx                 global HTML + body\n├── page.tsx\n├── docs/\n│   ├── layout.tsx             docs sidebar\n│   └── ...\n└── dashboard/\n    ├── layout.tsx             dashboard sidebar\n    └── ...\n```\n\nThe docs pages receive the docs layout. Dashboard pages receive the dashboard layout. Both still receive the root layout.\n\nThat gives you a useful composition model:\n\n```text\nRoot layout\n├── Home page\n├── Docs layout\n│   ├── Docs page\n│   └── Topic pages\n└── Dashboard layout\n    ├── Dashboard page\n    └── Settings page\n```\n\nA layout should contain UI that logically belongs to that section. Do not create ten nested layouts simply because you can. Each layout should have a reason, such as shared navigation, a sidebar or a section-specific shell.",
      diagram: `Layout composition

app/layout.tsx
      │
      ├── /
      │
      ├── docs/layout.tsx
      │       │
      │       ├── /docs
      │       ├── /docs/javascript
      │       └── /docs/react
      │
      └── dashboard/layout.tsx
              │
              ├── /dashboard
              └── /dashboard/settings

Every descendant receives its parent layout.
Layouts compose from the outside inward.`,
      codeExample: {
        title: "Root layout plus a documentation layout",
        code: `// app/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header>Developer Docs</header>
        {children}
      </body>
    </html>
  );
}

// app/docs/layout.tsx
export default function DocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="docs-shell">
      <aside>
        <nav>
          <a href="/docs">Overview</a>
          <a href="/docs/javascript">JavaScript</a>
          <a href="/docs/react">React</a>
        </nav>
      </aside>

      <main>{children}</main>
    </div>
  );
}

// app/docs/react/page.tsx
export default function ReactDocsPage() {
  return <h1>React Documentation</h1>;
}`,
      },
      keyTakeaways: [
        "`app/layout.tsx` is the root layout and wraps the entire application.",
        "A layout receives `children`, which represents the page or nested layout inside it.",
        "Nested `layout.tsx` files wrap all descendant routes in that segment.",
        "Layouts are useful for shared navigation, sidebars, headers and section-specific shells.",
        "A route can receive multiple layouts because layouts compose from the root inward.",
        "Do not copy shared UI into every page when that UI belongs naturally in a layout.",
      ],
      commonMistakes: [
        "<b>Putting the entire page inside the root layout.</b> Keep the root layout focused on global structure.",
        "<b>Forgetting `{children}`.</b> Without it, the nested page has nowhere to render.",
        "<b>Creating separate copies of a docs sidebar on every page.</b> Put shared documentation UI in `app/docs/layout.tsx`.",
        "<b>Assuming a nested layout replaces the root layout.</b> It is added inside the root layout rather than replacing it.",
      ],
      quiz: [
        {
          question: "What is the main purpose of `layout.tsx`?",
          options: [
            "Define database queries",
            "Create shared UI around pages",
            "Replace every `page.tsx`",
            "Create CSS files",
          ],
          correctIndex: 1,
          explanation: "Layouts wrap pages and nested layouts with shared UI.",
        },
        {
          question: "Where does the root layout live?",
          options: [
            "`app/root/layout.tsx`",
            "`app/layout.tsx`",
            "`app/page/layout.tsx`",
            "`layout.tsx` outside the project",
          ],
          correctIndex: 1,
          explanation: "The root layout is `app/layout.tsx`.",
        },
        {
          question: "What does `{children}` represent inside a layout?",
          options: [
            "The current URL",
            "The nested page or layout being rendered inside it",
            "The browser history",
            "The route parameters only",
          ],
          correctIndex: 1,
          explanation: "Children are the UI that belongs inside that layout.",
        },
      ],
    },
    {
      id: "route-groups-and-private-folders",
      title: "Route groups and private folders",
      durationMinutes: 13,
      explanation: "Sometimes you want your project structure to be meaningful without wanting every folder to appear in the URL. App Router provides two important folder conventions for this: <b>route groups</b> and <b>private folders</b>.\n\nA <b>route group</b> uses parentheses, such as `(marketing)`. It organizes routes without adding the folder name to the URL.\n\nA <b>private folder</b> starts with an underscore, such as `_components`. It is intended for colocated implementation files that should not become route segments.\n\n---\n\n### 1. Basic — route groups do not change the URL\n\nConsider:\n\n```text\napp/\n└── (marketing)/\n    ├── page.tsx\n    └── pricing/\n        └── page.tsx\n```\n\nThe URLs are:\n\n```text\n/          → (marketing)/page.tsx\n/pricing   → (marketing)/pricing/page.tsx\n```\n\nThe `(marketing)` folder is not included in the URL. It exists to organize the source tree and can also help you apply a layout to a selected group of routes.\n\n---\n\n### 2. Intermediate — why groups are useful\n\nImagine an application with marketing pages, a dashboard and authentication pages:\n\n```text\napp/\n├── (marketing)/\n│   ├── layout.tsx\n│   ├── page.tsx\n│   └── pricing/page.tsx\n├── (dashboard)/\n│   ├── layout.tsx\n│   └── dashboard/page.tsx\n└── (auth)/\n    ├── layout.tsx\n    ├── login/page.tsx\n    └── register/page.tsx\n```\n\nThe groups let you keep each section together without creating `/marketing`, `/dashboard` or `/auth` merely because those names exist in your source tree.\n\nThe bigger idea is separation of <b>source organization</b> from <b>URL design</b>.\n\n---\n\n### 3. Advanced — private folders for implementation files\n\nSuppose the React documentation page needs a local component:\n\n```text\napp/docs/react/\n├── page.tsx\n└── _components/\n    └── CodeExample.tsx\n```\n\nThe `_components` folder is a private folder. It is for implementation details that live close to the route but are not intended to become route segments.\n\n```text\n/docs/react\n    │\n    ├── page.tsx\n    │\n    └── _components/\n         └── CodeExample.tsx\n\nURL: /docs/react\n```\n\nThis keeps route-specific components close to the page instead of forcing everything into one global `components/` directory.\n\nA useful rule is:\n\n```text\nNeed the folder to affect the URL?       normal folder\nNeed organization without URL segment?   (route group)\nNeed local implementation files?         _private folder\n```\n\nDo not confuse these with middleware, authentication or access control. A private folder is a file-organization convention, not a security boundary.",
      diagram: `Three kinds of folders

normal folder
app/docs/
        ↓
URL includes "docs"

route group
app/(marketing)/
        ↓
folder organizes code
        ↓
"marketing" is NOT in URL

private folder
app/docs/_components/
        ↓
implementation files stay near route
        ↓
"_components" is NOT a URL segment

Important:
A private folder is organization, not security.`,
      codeExample: {
        title: "Organizing a documentation site without changing URLs",
        code: `app/
├── layout.tsx
├── (marketing)/
│   ├── page.tsx
│   └── pricing/
│       └── page.tsx
└── docs/
    ├── layout.tsx
    └── react/
        ├── page.tsx
        └── _components/
            └── CodeExample.tsx

// Resulting routes:
//
// /                    → (marketing)/page.tsx
// /pricing             → (marketing)/pricing/page.tsx
// /docs/react          → docs/react/page.tsx
//
// _components is source organization only.`,
      },
      keyTakeaways: [
        "Route groups use parentheses, such as `(marketing)`.",
        "A route group does <b>not</b> add its name to the URL.",
        "Route groups are useful for organizing sections and applying section-specific layouts.",
        "Private folders begin with `_` and are useful for colocating implementation files.",
        "A private folder does not create a URL segment.",
        "Private folders are not an authentication or security mechanism.",
        "Route structure should describe URLs; groups and private folders let source organization stay clean without changing those URLs.",
      ],
      commonMistakes: [
        "<b>Expecting `(marketing)` to produce `/marketing`.</b> Route groups are intentionally omitted from the URL.",
        "<b>Using `_components` as a security mechanism.</b> It is an organizational convention, not access control.",
        "<b>Putting every component into one global directory.</b> Route-specific components can often live beside the route.",
        "<b>Adding route groups only because they look advanced.</b> Use them when source organization or shared layouts actually benefit.",
      ],
      quiz: [
        {
          question: "What URL does `app/(marketing)/pricing/page.tsx` create?",
          options: [
            "/marketing/pricing",
            "/pricing",
            "/(marketing)/pricing",
            "/marketing",
          ],
          correctIndex: 1,
          explanation: "Route group names are omitted from the URL.",
        },
        {
          question: "What is `_components` mainly useful for?",
          options: [
            "Database security",
            "Authentication",
            "Colocated implementation components",
            "Creating dynamic routes",
          ],
          correctIndex: 2,
          explanation: "Private folders help keep route-specific implementation files near the route.",
        },
        {
          question: "Which statement about private folders is correct?",
          options: [
            "They make a route inaccessible to logged-out users",
            "They are an organizational convention",
            "They always create URL segments",
            "They replace middleware",
          ],
          correctIndex: 1,
          explanation: "The underscore convention is about source organization, not authorization.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What turns an App Router folder into a directly visitable page?",
      options: [
        "`route.ts`",
        "`page.tsx`",
        "`layout.tsx`",
        "`index.ts`",
      ],
      correctIndex: 1,
      explanation: "A `page.tsx` file defines the UI for that route segment.",
    },
    {
      question: "What does `app/docs/react/page.tsx` map to?",
      options: [
        "/react/docs",
        "/docs/react",
        "/app/docs/react",
        "/docs",
      ],
      correctIndex: 1,
      explanation: "The nested folders become route segments.",
    },
    {
      question: "What does a nested layout do?",
      options: [
        "Deletes the root layout",
        "Wraps pages below its route segment",
        "Creates a database connection",
        "Makes every route dynamic",
      ],
      correctIndex: 1,
      explanation: "Layouts compose around their descendant pages and layouts.",
    },
    {
      question: "Which folder does not appear in the URL?",
      options: [
        "`docs`",
        "`react`",
        "`(marketing)`",
        "`getting-started`",
      ],
      correctIndex: 2,
      explanation: "Parentheses identify a route group, which is omitted from the URL.",
    },
    {
      question: "What is the purpose of a private `_components` folder?",
      options: [
        "To hide code from authenticated users",
        "To create a private API",
        "To colocate implementation files without making them route segments",
        "To disable rendering",
      ],
      correctIndex: 2,
      explanation: "Private folders are a source-organization convention, not a security feature.",
    },
  ],
  project: {
    name: "Multi-page documentation website",
    goal: "Build the route structure and shared layouts for a small developer documentation website using the Next.js App Router.",
    brief: "Create a documentation website with a home page, a docs section and several topic pages. The goal is to learn how the App Router turns folders into URLs and how layouts keep shared UI in one place.\n\nKeep the content simple. You are building the application structure today, not a complete documentation engine. The project should make the route tree visible in both your code and the browser.",
    steps: [
      "Create `app/layout.tsx` as the root layout with `<html lang=\"en\">`, `<body>` and a simple site header.",
      "Create `app/page.tsx` for the home page with a title and links to the documentation section.",
      "Create `app/docs/page.tsx` for the documentation overview.",
      "Create `app/docs/javascript/page.tsx`, `app/docs/react/page.tsx` and `app/docs/nextjs/page.tsx` as three topic pages.",
      "Create `app/docs/layout.tsx` with a documentation sidebar and `{children}` in the main content area.",
      "Create a `(marketing)` route group and move the home page into it without changing the `/` URL.",
      "Add a `pricing/page.tsx` inside `(marketing)` and confirm it is available at `/pricing`, not `/marketing/pricing`.",
      "Inside the React documentation route, create `_components/CodeExample.tsx` and use it from the page. Confirm `_components` does not become part of the URL.",
      "Add a second section such as `dashboard` with its own `layout.tsx` and one page. Observe how it still receives the root layout.",
      "Run the application and write down the route tree from memory after checking the browser URLs.",
    ],
    acceptance: [
      "The home page works at `/` and is wrapped by the root layout.",
      "The docs overview works at `/docs`.",
      "The JavaScript, React and Next.js pages work at `/docs/javascript`, `/docs/react` and `/docs/nextjs`.",
      "All docs pages share the documentation layout without duplicating the sidebar.",
      "The `(marketing)` group does not appear in any URL.",
      "The `_components` folder does not create a URL segment.",
      "A separate section layout can coexist with the root layout.",
      "You can explain the difference between a normal folder, route group, private folder, page and layout.",
    ],
    stretch: [
      "Create a nested `getting-started` section under `/docs` with its own layout and two pages.",
      "Add a second route group for authentication pages such as `/login` and `/register`.",
      "Move route-specific UI into private folders beside the pages that use them.",
    ],
  },
};
