import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_28_LESSONS: LessonDay = {
  day: 28,
  title: "Metadata and SEO",
  totalMinutes: 83,
  difficulty: "Advanced",
  lessons: [
    {
      id: "nextjs-28-1",
      title: "Metadata API and Static Metadata",
      durationMinutes: 16,
      explanation: `
Metadata is information about a web page that is not normally displayed as the main page content. Search engines, browsers, and social platforms can use metadata to understand and present your page.

Next.js provides a Metadata API for defining metadata in layouts and pages. Static metadata can be exported as a metadata object.

Example:

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Blog",
  description: "Articles about software engineering",
};

This is useful when the metadata is known ahead of time.

Metadata can be defined at different levels of the route tree. A root layout can provide defaults for the whole application, while a nested layout or page can provide more specific values.

For example, the root layout might define a default title template:

title: {
  default: "My App",
  template: "%s | My App",
}

A page can then define title: "Products", producing "Products | My App".

Metadata should be treated as part of application architecture. Avoid creating random metadata independently in every page. Establish defaults at the root and override values only where the page needs something specific.
`,
      diagram: `
Root Layout Metadata
        |
        v
  Global defaults
        |
   +----+----+
   |         |
   v         v
 Page A    Page B
   |         |
override   override
   |         |
   v         v
specific   specific
metadata   metadata
`,
      codeExample: {
        title: "Static metadata with a title template",
        code: `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Learn Rajan",
    template: "%s | Learn Rajan",
  },
  description: "Developer learning resources and tutorials",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// app/courses/page.tsx
export const metadata: Metadata = {
  title: "Courses",
  description: "Explore programming courses",
};`,
      },
      keyTakeaways: [
        "The Metadata API lets Next.js manage page metadata.",
        "Metadata can be defined at layout and page levels.",
        "Root metadata is useful for application-wide defaults.",
        "Title templates reduce repeated metadata configuration.",
        "Page-specific metadata can override inherited defaults."
      ],
      commonMistakes: [
        "Copying the same metadata into every page.",
        "Using a generic title for every route.",
        "Forgetting descriptions on important public pages.",
        "Treating metadata as unrelated to route architecture."
      ],
      quiz: [
        {
          question: "What does a title template help with?",
          options: [
            "Database queries",
            "Consistent page title formatting",
            "Image compression",
            "Authentication"
          ],
          correctIndex: 1,
          explanation: "A title template lets pages inherit a consistent application title pattern."
        },
        {
          question: "Where are global metadata defaults commonly defined?",
          options: ["Root layout", "Database", "Route Handler only", "CSS file"],
          correctIndex: 0,
          explanation: "The root layout is a natural place for application-wide metadata defaults."
        }
      ]
    },
    {
      id: "nextjs-28-2",
      title: "Dynamic Metadata and Canonical URLs",
      durationMinutes: 16,
      explanation: `
Many real applications have pages whose metadata depends on data. A blog post title, product name, or documentation page description cannot be hard-coded into one shared metadata object.

Next.js provides generateMetadata for this situation.

Example:

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.description,
  };
}

The metadata function can use route parameters and fetch the data needed to construct the page metadata.

Canonical URLs are another important SEO concept. A canonical URL tells search engines which URL should be treated as the preferred version when similar content can be accessed through multiple URLs.

For example, a product may be accessible through tracking parameters:

/products/42
/products/42?ref=homepage
/products/42?campaign=sale

The canonical URL can identify /products/42 as the preferred URL.

Canonicalization is especially important for large applications with filters, pagination, query parameters, duplicate paths, or multiple ways of reaching the same content.
`,
      diagram: `
Request
  |
  v
/products/react-course
  |
  v
generateMetadata()
  |
  +--> fetch course
  |
  +--> title
  +--> description
  +--> canonical URL
  |
  v
HTML metadata
`,
      codeExample: {
        title: "Dynamic metadata with canonical URL",
        code: `import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: \`https://example.com/posts/\${slug}\`,
    },
  };
}`,
      },
      keyTakeaways: [
        "generateMetadata is useful when metadata depends on route or database data.",
        "Dynamic metadata can be generated from params.",
        "Canonical URLs communicate the preferred URL for content.",
        "Canonicalization helps reduce duplicate URL problems.",
        "Metadata generation should use the same content model as the page."
      ],
      commonMistakes: [
        "Hard-coding dynamic content metadata.",
        "Generating canonical URLs with the wrong domain.",
        "Treating every query parameter as a separate canonical page.",
        "Fetching unrelated data only to build metadata."
      ],
      quiz: [
        {
          question: "When should generateMetadata be used?",
          options: [
            "When metadata depends on dynamic route or data",
            "Only for CSS",
            "Only for authentication",
            "Only for static assets"
          ],
          correctIndex: 0,
          explanation: "generateMetadata is intended for metadata that needs dynamic values."
        },
        {
          question: "What does a canonical URL communicate?",
          options: [
            "The database password",
            "The preferred URL for a piece of content",
            "The user's language",
            "The image dimensions"
          ],
          correctIndex: 1,
          explanation: "A canonical URL identifies the preferred URL for substantially similar content."
        }
      ]
    },
    {
      id: "nextjs-28-3",
      title: "Open Graph and Social Cards",
      durationMinutes: 16,
      explanation: `
When a user shares a page on social media or a messaging platform, the destination can display a preview containing a title, description, and image. Open Graph metadata is a common standard for controlling this preview.

Next.js supports Open Graph metadata through the Metadata API.

Example:

openGraph: {
  title: "React Course",
  description: "Learn React from beginner to advanced",
  url: "https://example.com/courses/react",
  images: [
    {
      url: "https://example.com/og/react.png",
      width: 1200,
      height: 630,
    },
  ],
}

Twitter/X-style cards can be configured through the twitter metadata field.

Social metadata should usually be generated from the same source as the normal page metadata. A product page should not accidentally have one title in the browser and a completely unrelated title when shared.

Dynamic Open Graph images are also useful for content platforms. A page can generate an image containing the content title, author, category, or other useful visual information.

Remember that social crawlers may have different caching behavior from normal browsers, so changing metadata does not always mean an old social preview will immediately update.
`,
      diagram: `
Page data
   |
   +------------------+
   |                  |
   v                  v
HTML metadata     Social metadata
   |                  |
 Browser title     Open Graph
 description      Twitter/X card
   |                  |
   +--------+---------+
            |
            v
       Shared preview
`,
      codeExample: {
        title: "Open Graph and Twitter/X metadata",
        code: `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "React Course",
  description: "Learn React from beginner to advanced",

  openGraph: {
    title: "React Course",
    description: "Learn React from beginner to advanced",
    url: "https://example.com/courses/react",
    siteName: "Example",
    images: [
      {
        url: "https://example.com/og/react.png",
        width: 1200,
        height: 630,
        alt: "React Course",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "React Course",
    description: "Learn React from beginner to advanced",
  },
};`,
      },
      keyTakeaways: [
        "Open Graph metadata controls common social previews.",
        "Twitter/X card metadata can provide platform-specific preview information.",
        "Social metadata should remain consistent with page content.",
        "Images are an important part of share previews.",
        "Social crawlers may cache metadata independently."
      ],
      commonMistakes: [
        "Using low-resolution or incorrectly sized social images.",
        "Leaving the social title unrelated to the page title.",
        "Forgetting descriptive image alt text where supported.",
        "Assuming changing metadata instantly updates every social preview."
      ],
      quiz: [
        {
          question: "What is Open Graph mainly used for?",
          options: [
            "Database migrations",
            "Social sharing previews",
            "Authentication",
            "Image upload validation"
          ],
          correctIndex: 1,
          explanation: "Open Graph metadata helps social platforms build link previews."
        },
        {
          question: "What should a social preview generally represent?",
          options: [
            "Unrelated marketing text",
            "The same underlying page content",
            "A database schema",
            "Server logs"
          ],
          correctIndex: 1,
          explanation: "Social metadata should accurately represent the page being shared."
        }
      ]
    },
    {
      id: "nextjs-28-4",
      title: "Robots, Sitemap, and Structured Data",
      durationMinutes: 17,
      explanation: `
SEO is not only about titles and descriptions. Search engines also need to understand which URLs they can crawl and where your important pages are.

Next.js supports robots.txt through robots.ts and sitemaps through sitemap.ts. These are special metadata-related files that can generate the appropriate responses.

A sitemap contains URLs that you want search engines to discover. For a content-heavy application, the sitemap can be generated from a database.

Robots rules communicate crawler instructions. They are useful for controlling crawling behavior, but they should not be treated as an authentication mechanism. A robots rule saying "do not crawl this path" does not prevent someone from visiting the URL.

Structured data provides machine-readable information about a page. JSON-LD is a common format. Schema.org defines vocabulary such as Article, Product, Organization, BreadcrumbList, and other types.

Structured data should accurately describe visible or otherwise legitimate page content. It should not be filled with misleading information simply because a schema type might improve search appearance.
`,
      diagram: `
Search Engine
     |
     +------> robots.txt
     |          |
     |       crawl guidance
     |
     +------> sitemap.xml
     |          |
     |       discover URLs
     |
     +------> page
                |
             JSON-LD
                |
          understand content
`,
      codeExample: {
        title: "robots.ts and sitemap.ts",
        code: `// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/account/"],
    },
    sitemap: "https://example.com/sitemap.xml",
  };
}

// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();

  return [
    {
      url: "https://example.com",
      lastModified: new Date(),
    },
    ...posts.map((post) => ({
      url: \`https://example.com/posts/\${post.slug}\`,
      lastModified: post.updatedAt,
    })),
  ];
}`,
      },
      keyTakeaways: [
        "robots.ts can generate crawler guidance.",
        "sitemap.ts can generate discoverable URLs.",
        "Sitemaps are especially useful for large or dynamic websites.",
        "Robots rules are not an access-control mechanism.",
        "Structured data helps machines understand page content."
      ],
      commonMistakes: [
        "Using robots.txt to protect private information.",
        "Including draft or private pages in a public sitemap.",
        "Generating sitemap URLs with the wrong production domain.",
        "Adding structured data that does not accurately represent the page."
      ],
      quiz: [
        {
          question: "What is a sitemap primarily used for?",
          options: [
            "Password storage",
            "Helping search engines discover URLs",
            "Image compression",
            "Database backup"
          ],
          correctIndex: 1,
          explanation: "A sitemap provides a list of URLs that search engines can discover."
        },
        {
          question: "Can robots.txt protect private data?",
          options: ["Yes", "No", "Only with HTTPS", "Only for administrators"],
          correctIndex: 1,
          explanation: "Robots rules guide crawlers but do not provide access control."
        }
      ]
    },
    {
      id: "nextjs-28-5",
      title: "SEO Architecture for Next.js",
      durationMinutes: 17,
      explanation: `
A good SEO implementation is an architecture rather than a collection of tags.

Start with URL design. Search-friendly pages should have stable, understandable URLs. Then establish metadata defaults in the root layout and use dynamic metadata for content pages.

Next, decide which pages should be indexable. Public articles, products, and documentation may be intended for search engines. Private account pages, internal dashboards, and temporary states generally have different requirements.

Canonical URLs should be consistent. Sitemaps should contain the URLs you actually want discovered. Robots rules should reflect crawl requirements without being mistaken for security.

Structured data can then provide additional machine-readable context. Finally, Open Graph metadata makes shared links useful outside search engines.

An important principle is that SEO should not be treated as a replacement for good content, accessibility, performance, or correct application architecture. Technical SEO helps search engines understand a site, but it cannot make poor content useful.

A production checklist should include:
- stable URLs
- meaningful titles
- useful descriptions
- canonical URLs
- correct robots rules
- accurate sitemap
- social metadata
- valid structured data
- correct language metadata
- accessible content
- reasonable performance
`,
      diagram: `
SEO Architecture

URL Design
    |
    v
Metadata Defaults
    |
    v
Dynamic Metadata
    |
    +----> Canonical URLs
    |
    +----> Open Graph
    |
    +----> Twitter/X
    |
    +----> Structured Data
    |
    +----> Sitemap
    |
    +----> Robots
    |
    v
Search + Social Discovery
`,
      codeExample: {
        title: "Centralized SEO helper",
        code: `import type { Metadata } from "next";

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = new URL(
    path,
    "https://example.com"
  ).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Example",
    },
  };
}

// app/courses/page.tsx
export const metadata = createPageMetadata({
  title: "Courses",
  description: "Browse programming courses",
  path: "/courses",
});`,
      },
      keyTakeaways: [
        "SEO should be designed as a system across routing and metadata.",
        "URL structure, metadata, canonicalization, sitemap, and robots should agree.",
        "Private application areas need different indexing treatment from public content.",
        "Structured data must accurately represent the page.",
        "SEO does not replace quality content, accessibility, or performance."
      ],
      commonMistakes: [
        "Optimizing individual pages without a consistent metadata strategy.",
        "Putting private application URLs into public sitemaps.",
        "Using robots rules as a security mechanism.",
        "Generating canonical URLs inconsistently across the application."
      ],
      quiz: [
        {
          question: "What should a good SEO architecture coordinate?",
          options: [
            "Only title tags",
            "URLs, metadata, canonicalization, crawling, and structured information",
            "Only CSS",
            "Only database queries"
          ],
          correctIndex: 1,
          explanation: "SEO works best when these parts are designed consistently."
        },
        {
          question: "Which page usually should not be treated like a public article for indexing?",
          options: ["/blog/react", "/docs/routing", "/account/settings", "/about"],
          correctIndex: 2,
          explanation: "Private account pages generally should not be treated as public search content."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "Which API is used for dynamic metadata?",
      options: ["generateMetadata", "generateSEO", "createMeta", "useMetadata"],
      correctIndex: 0,
      explanation: "Next.js provides generateMetadata for dynamic metadata."
    },
    {
      question: "What does a canonical URL identify?",
      options: [
        "The preferred URL for a piece of content",
        "The user's session",
        "The image CDN",
        "The database connection"
      ],
      correctIndex: 0,
      explanation: "Canonicalization identifies the preferred URL when similar content can have multiple URLs."
    },
    {
      question: "What is Open Graph primarily associated with?",
      options: ["Social previews", "Database schemas", "Authentication", "File uploads"],
      correctIndex: 0,
      explanation: "Open Graph metadata is widely used for social sharing previews."
    },
    {
      question: "What does sitemap.ts generate?",
      options: ["A database", "A sitemap response", "A CSS file", "A login form"],
      correctIndex: 1,
      explanation: "sitemap.ts can generate the application's sitemap."
    },
    {
      question: "Can robots.txt replace authorization?",
      options: ["Yes", "No", "Only for private dashboards", "Only when using HTTPS"],
      correctIndex: 1,
      explanation: "Robots instructions do not prevent a user from accessing a URL."
    },
    {
      question: "What is structured data intended to do?",
      options: [
        "Provide machine-readable information about page content",
        "Encrypt cookies",
        "Compress JavaScript",
        "Create route groups"
      ],
      correctIndex: 0,
      explanation: "Structured data helps machines understand the meaning and type of page content."
    }
  ],
  project: {
    name: "SEO-Ready Content Platform",
    goal: "Build a production-style Next.js content platform with centralized metadata, dynamic SEO, social previews, canonical URLs, robots, sitemap, and structured data.",
    brief: `
Build a content website called "DevJournal" with articles, author pages, categories, and a public home page.

Create global metadata defaults and a title template. Each article should generate its title, description, canonical URL, Open Graph information, and social card metadata dynamically.

Add robots.ts and sitemap.ts. The sitemap should include published articles but exclude private dashboard routes.

Add JSON-LD structured data for articles and organization information.

The final application should have a consistent SEO architecture rather than independently configured metadata on every page.
`,
    steps: [
      "Create global metadata in the root layout.",
      "Add a title template for page titles.",
      "Create dynamic article metadata with generateMetadata.",
      "Generate canonical URLs for article pages.",
      "Add Open Graph metadata.",
      "Add Twitter/X card metadata.",
      "Create robots.ts with appropriate crawler rules.",
      "Create sitemap.ts using published content.",
      "Add Article and Organization structured data where appropriate.",
      "Create a reusable metadata helper.",
      "Verify that private dashboard URLs are not exposed through the sitemap.",
      "Review all public routes for consistent titles and descriptions."
    ],
    acceptance: [
      "Public pages have meaningful metadata.",
      "Article metadata is generated from article data.",
      "Canonical URLs are consistent.",
      "Open Graph previews contain appropriate information.",
      "Twitter/X metadata is configured.",
      "robots.ts exists and does not expose private content intentionally.",
      "sitemap.ts includes the intended public URLs.",
      "Structured data accurately represents the page.",
      "Metadata architecture avoids unnecessary duplication."
    ],
    stretch: [
      "Generate dynamic Open Graph images.",
      "Add BreadcrumbList structured data.",
      "Generate alternate language metadata.",
      "Create a reusable SEO configuration for products and courses.",
      "Add automated checks for missing title and description metadata."
    ]
  },
};
