import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_4_LESSONS: LessonDay = {
  day: 4,
  title: "Dynamic Routes",
  totalMinutes: 72,
  difficulty: "Beginner",
  lessons: [
    {
      id: "dynamic-route-segments",
      title: "Dynamic routes with [id] and [slug]",
      durationMinutes: 15,
      explanation: `A <b>dynamic route</b> is a route whose URL contains a value that is not known when you create the folder. Instead of creating a separate folder for every article, user, or product, you create one dynamic segment and Next.js reads the value from the URL.

For example, a blog might have thousands of articles. You do not want to create <code>app/blog/hello-world/page.tsx</code>, <code>app/blog/nextjs-routing/page.tsx</code>, and another folder for every article. You can create <code>app/blog/[slug]/page.tsx</code> once.

The name inside square brackets becomes the parameter name. So <code>[id]</code> creates an <code>id</code> parameter, while <code>[slug]</code> creates a <code>slug</code> parameter.

A <b>route parameter</b> (the dynamic value captured from the URL) is data about which resource the user requested. It is not automatically the database record itself. Your page still needs to use that value to load the actual data.`,
      diagram: `Dynamic route
    │
    ├── app/
    │   └── blog/
    │       └── [slug]/
    │           └── page.tsx
    │
    ├── /blog/hello-world
    │       └── params.slug = "hello-world"
    │
    └── /blog/nextjs-routing
            └── params.slug = "nextjs-routing"

One folder → many URLs

[id]      → /users/42
[slug]    → /blog/hello-world`,
      codeExample: {
        title: "Reading a dynamic route parameter",
        code: `// app/blog/[slug]/page.tsx

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;

  return (
    <main>
      <h1>Blog article</h1>
      <p>Requested slug: {slug}</p>
    </main>
  );
}

// URL:
// /blog/nextjs-routing
//
// slug:
// "nextjs-routing"`,
      },
      keyTakeaways: [
        "Square brackets create a <b>dynamic route segment</b>.",
        "<code>[id]</code> gives you a parameter named <code>id</code>; <code>[slug]</code> gives you <code>slug</code>.",
        "The parameter is a URL value. You still decide how that value maps to your database or other data source.",
        "A single dynamic route can represent many URLs.",
      ],
      commonMistakes: [
        "<b>Creating one folder per article.</b> Dynamic routes exist so one page can handle many records.",
        "<b>Confusing the parameter with the database object.</b> <code>slug</code> is just a string until you use it to fetch data.",
        "<b>Using the wrong parameter name.</b> If the folder is <code>[slug]</code>, read <code>params.slug</code>.",
        "<b>Forgetting that modern Next.js route params are asynchronous.</b> In current App Router code, type and await the params as shown.",
      ],
      quiz: [
        {
          question: "What does app/blog/[slug]/page.tsx represent?",
          options: [
            "Only the /blog/slug URL",
            "Many blog URLs where the slug changes",
            "A static file named slug",
            "A route that can only render one article",
          ],
          correctIndex: 1,
          explanation: "The bracketed segment is dynamic, so different slug values can match the same page.",
        },
        {
          question: "For /blog/nextjs-routing, what is params.slug?",
          options: [
            "blog",
            "page.tsx",
            "nextjs-routing",
            "slug",
          ],
          correctIndex: 2,
          explanation: "The dynamic segment captures the part of the URL represented by [slug].",
        },
        {
          question: "What is a route parameter?",
          options: [
            "The complete database record",
            "A value captured from the URL",
            "A CSS class",
            "A React state variable",
          ],
          correctIndex: 1,
          explanation: "The parameter identifies what the URL is asking for; your application can then use it to load data.",
        },
      ],
    },
    {
      id: "catch-all-routes",
      title: "Catch-all and optional catch-all routes",
      durationMinutes: 15,
      explanation: `Sometimes one dynamic value is not enough. Documentation sites are a good example because a URL can contain several nested sections such as <code>/docs/react/hooks/use-effect</code>.

A <b>catch-all segment</b> uses <code>[...slug]</code>. Instead of capturing one URL segment, it captures multiple segments as an array.

For example, <code>app/docs/[...slug]/page.tsx</code> can match <code>/docs/react</code>, <code>/docs/react/hooks</code>, and <code>/docs/react/hooks/use-effect</code>. The value becomes an array such as <code>["react", "hooks", "use-effect"]</code>.

An <b>optional catch-all segment</b> uses <code>[[...slug]]</code>. It behaves like a catch-all route but can also match the parent route without any extra segment. This is useful when the same page should handle both the docs home and deeper documentation paths.`,
      diagram: `Catch-all
app/docs/[...slug]/page.tsx

/docs/react
        ↓
["react"]

/docs/react/hooks/use-effect
        ↓
["react", "hooks", "use-effect"]


Optional catch-all
app/docs/[[...slug]]/page.tsx

/docs
        ↓
undefined

/docs/react
        ↓
["react"]

/docs/react/hooks
        ↓
["react", "hooks"]`,
      codeExample: {
        title: "Reading catch-all parameters",
        code: `// app/docs/[...slug]/page.tsx

type DocsPageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params;

  return (
    <main>
      <h1>Documentation</h1>
      <p>Path: {slug.join(" / ")}</p>
    </main>
  );
}


// Optional catch-all:
// app/docs/[[...slug]]/page.tsx

type OptionalDocsPageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function OptionalDocsPage({
  params,
}: OptionalDocsPageProps) {
  const { slug } = await params;

  const path = slug?.join(" / ") ?? "Documentation home";

  return <h1>{path}</h1>;
}`,
      },
      keyTakeaways: [
        "<code>[...slug]</code> captures one or more URL segments as an array.",
        "<code>[[...slug]]</code> also allows the route to match without any captured segments.",
        "Catch-all parameters are arrays, not strings.",
        "Optional catch-all routes are useful when a parent page and nested pages share the same routing logic.",
      ],
      commonMistakes: [
        "<b>Typing a catch-all parameter as a string.</b> It is an array of strings.",
        "<b>Forgetting the difference between the two forms.</b> <code>[...slug]</code> requires at least one segment; <code>[[...slug]]</code> can match none.",
        "<b>Assuming every catch-all route is a good fit.</b> Use a normal dynamic segment when only one value is needed.",
      ],
      quiz: [
        {
          question: "What type does [...slug] produce?",
          options: ["string", "number", "string[]", "boolean"],
          correctIndex: 2,
          explanation: "A catch-all segment captures multiple URL segments, so the parameter is an array.",
        },
        {
          question: "Which route can also match /docs without a slug?",
          options: ["[slug]", "[...slug]", "[[...slug]]", "[id]"],
          correctIndex: 2,
          explanation: "The double-bracket optional catch-all form allows zero or more segments.",
        },
        {
          question: "What does /docs/react/hooks produce for [...slug]?",
          options: [
            "react/hooks",
            "['react', 'hooks']",
            "{ react: 'hooks' }",
            "undefined",
          ],
          correctIndex: 1,
          explanation: "Each captured path segment becomes an item in the array.",
        },
      ],
    },
    {
      id: "nested-dynamic-routes",
      title: "Nested dynamic routes and route parameters",
      durationMinutes: 14,
      explanation: `Dynamic segments can be nested. This is important when a resource belongs to another resource. For example, a blog can have an author and an article, or a shop can have a category and a product.

A path such as <code>/shop/electronics/phone-15</code> could be represented by <code>app/shop/[category]/[product]/page.tsx</code>. Next.js gives the page both dynamic values.

The important idea is that folder structure describes the URL structure. Each dynamic folder contributes a parameter, while static folders contribute fixed parts of the path.

You can also combine static and dynamic segments. For example, <code>app/blog/[slug]/comments/[commentId]/page.tsx</code> describes a URL such as <code>/blog/nextjs-routing/comments/42</code>. The page receives both <code>slug</code> and <code>commentId</code>.`,
      diagram: `app/
└── blog/
    └── [slug]/
        └── comments/
            └── [commentId]/
                └── page.tsx

/blog/nextjs-routing/comments/42
       │                         │
       │                         └── commentId = "42"
       └── slug = "nextjs-routing"`,
      codeExample: {
        title: "Multiple route parameters",
        code: `// app/blog/[slug]/comments/[commentId]/page.tsx

type CommentPageProps = {
  params: Promise<{
    slug: string;
    commentId: string;
  }>;
};

export default async function CommentPage({
  params,
}: CommentPageProps) {
  const { slug, commentId } = await params;

  return (
    <main>
      <h1>Comment {commentId}</h1>
      <p>Article: {slug}</p>
    </main>
  );
}

// /blog/nextjs-routing/comments/42
//
// slug      = "nextjs-routing"
// commentId = "42"`,
      },
      keyTakeaways: [
        "Nested dynamic folders create multiple route parameters.",
        "The folder structure maps directly to the URL structure.",
        "All dynamic values are strings at the routing layer unless you convert them yourself.",
        "Use meaningful parameter names that describe the resource represented by the URL.",
      ],
      commonMistakes: [
        "<b>Assuming numeric-looking IDs are numbers.</b> Route parameters arrive as strings, so convert them when your application needs a number.",
        "<b>Using the same parameter name for unrelated resources.</b> Names should make the relationship obvious.",
        "<b>Putting too much logic into the route structure.</b> Keep the URL understandable and let application code handle data relationships.",
      ],
      quiz: [
        {
          question: "For /blog/nextjs/comments/42, what can a nested route provide?",
          options: [
            "Only commentId",
            "Only slug",
            "Both slug and commentId",
            "Neither value",
          ],
          correctIndex: 2,
          explanation: "Each dynamic segment contributes a named parameter.",
        },
        {
          question: "What type is a route parameter such as commentId initially?",
          options: ["number", "string", "Date", "object"],
          correctIndex: 1,
          explanation: "URL parameters are strings at the routing layer.",
        },
      ],
    },
    {
      id: "generate-static-params",
      title: "generateStaticParams and prebuilding dynamic routes",
      durationMinutes: 14,
      explanation: `<code>generateStaticParams</code> lets you provide Next.js with known parameter values for a dynamic route. Next.js can use those values when building the application to generate static versions of those routes.

This is useful for content that is known ahead of time, such as documentation pages or a fixed set of blog articles. Instead of waiting for the first request to discover a route, you can tell Next.js which paths should be generated.

The function returns an array of parameter objects. For <code>[slug]</code>, each object contains a <code>slug</code>. The page can still receive <code>params</code> normally.

Think of the distinction this way: the dynamic folder describes which URLs are allowed to match, while <code>generateStaticParams</code> supplies known values that can be generated ahead of time.`,
      diagram: `Build time

generateStaticParams()
        │
        ├── { slug: "intro" }
        ├── { slug: "routing" }
        └── { slug: "data-fetching" }
                │
                ↓
       Dynamic page generation
                │
                ↓
/blog/intro
/blog/routing
/blog/data-fetching`,
      codeExample: {
        title: "Generating known blog pages",
        code: `// app/blog/[slug]/page.tsx

export function generateStaticParams() {
  return [
    { slug: "intro-to-nextjs" },
    { slug: "dynamic-routes" },
    { slug: "data-fetching" },
  ];
}

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;

  return (
    <main>
      <h1>{slug}</h1>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "<code>generateStaticParams</code> supplies known dynamic parameter values.",
        "It is especially useful for content that can be known during the build.",
        "The returned objects must use the names of the dynamic route segments.",
        "The page still receives its route parameter through <code>params</code>.",
      ],
      commonMistakes: [
        "<b>Returning the wrong parameter name.</b> For <code>[slug]</code>, return objects containing <code>slug</code>.",
        "<b>Thinking it replaces the dynamic route.</b> The dynamic folder is still what defines the route.",
        "<b>Using it for every possible runtime URL.</b> It is most useful when you have a known set of paths to pre-generate.",
        "<b>Forgetting that generated values come from your data source.</b> In a real app, the list usually comes from a CMS, database, or content files.",
      ],
      quiz: [
        {
          question: "What is the main purpose of generateStaticParams?",
          options: [
            "Create CSS classes",
            "Provide known dynamic route parameters for static generation",
            "Navigate between pages",
            "Create API routes",
          ],
          correctIndex: 1,
          explanation: "It tells Next.js which dynamic parameter values can be generated ahead of time.",
        },
        {
          question: "For app/blog/[slug]/page.tsx, what should each generated object contain?",
          options: [
            "{ id: ... }",
            "{ path: ... }",
            "{ slug: ... }",
            "{ page: ... }",
          ],
          correctIndex: 2,
          explanation: "The parameter object uses the same name as the dynamic segment.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which folder creates a single dynamic route parameter named slug?",
      options: ["(slug)", "[slug]", "{slug}", "_slug"],
      correctIndex: 1,
      explanation: "Square brackets create a dynamic segment.",
    },
    {
      question: "What is the difference between [...slug] and [[...slug]]?",
      options: [
        "The first is static and the second is dynamic",
        "The first captures one segment and the second captures two",
        "The first requires at least one segment; the second can match zero or more",
        "There is no difference",
      ],
      correctIndex: 2,
      explanation: "The double-bracket form makes the catch-all parameter optional.",
    },
    {
      question: "What type is a normal dynamic route parameter?",
      options: ["string", "number", "boolean", "object"],
      correctIndex: 0,
      explanation: "URL parameters arrive as strings unless your application converts them.",
    },
    {
      question: "What does generateStaticParams provide?",
      options: [
        "Known parameter values for dynamic routes",
        "Client-side state",
        "Navigation events",
        "Error messages",
      ],
      correctIndex: 0,
      explanation: "Next.js can use the returned values to generate known dynamic routes ahead of requests.",
    },
    {
      question: "Which route matches /docs/react/hooks?",
      options: [
        "app/docs/[slug]/page.tsx",
        "app/docs/[...slug]/page.tsx",
        "app/docs/[id]/page.tsx",
        "app/docs/(hooks)/page.tsx",
      ],
      correctIndex: 1,
      explanation: "A catch-all segment can capture multiple URL segments.",
    },
  ],
  project: {
    name: "Blog with dynamic article pages",
    goal: "Build a small blog where one dynamic page renders different articles from their URL slug.",
    brief: "Create a blog route at /blog/[slug]. Add several article records, generate known article paths, and add a nested comments route to practice multiple dynamic parameters.",
    steps: [
      "Create app/blog/[slug]/page.tsx.",
      "Create a small in-memory list of blog articles with title, slug, excerpt, and content.",
      "Read the slug from params and find the matching article.",
      "Render a useful article page for each slug.",
      "Add generateStaticParams for the known article slugs.",
      "Create app/blog/[slug]/comments/[commentId]/page.tsx.",
      "Read both slug and commentId from params.",
      "Add a documentation-style route using a catch-all segment as a separate practice route.",
      "Add navigation links from the blog list to each dynamic article.",
    ],
    acceptance: [
      "The same page component renders multiple blog articles.",
      "The article slug comes from the URL rather than hard-coded page files.",
      "generateStaticParams returns the known article slugs.",
      "The nested comments route receives both slug and commentId.",
      "The project demonstrates the difference between a normal dynamic segment and a catch-all segment.",
    ],
    stretch: [
      "Add an optional catch-all documentation route.",
      "Return a not-found response when an article slug does not exist.",
      "Generate article metadata from the current slug.",
      "Move article data into local Markdown or JSON files.",
    ],
  },
};
