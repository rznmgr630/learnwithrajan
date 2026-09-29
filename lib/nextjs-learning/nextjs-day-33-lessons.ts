import type { LessonDay } from "@/lib/learn/lesson-types";

const NEXTJS_DAY_33_SOURCE = {
  day: 33,
  title: "Caching Architecture",
  description:
    "Learn how caching works across the browser, CDN, Next.js, application infrastructure, and database. Start with the simple idea of avoiding repeated work, then build toward production-level understanding of Cache-Control, CDN caching, Next.js Cache Components, cached data, route output, Router Cache, application caches, cache invalidation, and cache tags.",

  sections: [
    {
      title: "1. Understanding Caching Architecture",
      subsections: [
        {
          title: "1.1 What caching means",
          explanation:
            "Caching means keeping a copy of something that is expensive or slow to produce so that it can be reused later.\n\nImagine an ecommerce website showing a product page. Without caching, every request might require the application to perform the same work again: run database queries, calculate the product information, render the response, and send it to the user.\n\nA cache changes that process. If the answer has already been produced and is still considered valid, another request can reuse the existing result instead of repeating all of the work.\n\nThe important beginner idea is that a cache is not the original source of truth. The database may be the source of truth, while the cache is a faster copy of information derived from it.\n\nCaching can improve response time, reduce database load, reduce server computation, and make applications easier to scale. But caching also creates a new responsibility: deciding when the cached value is no longer safe to use.\n\nThat is why caching is not simply a performance feature. It is an architecture decision involving freshness, correctness, cost, and invalidation.",
          visualDiagram:
            "Without caching\n\nUser\n │\n ▼\nNext.js\n │\n ▼\nDatabase\n │\n ▼\nNext.js\n │\n ▼\nUser\n\nSame work may happen repeatedly.\n\nWith caching\n\nUser\n │\n ▼\n┌──────────────┐\n│    Cache     │──── hit ────► User\n└──────┬───────┘\n       │ miss\n       ▼\n   Database\n       │\n       ▼\n     Cache\n       │\n       ▼\n      User",
          codeExample: {
            title: "The basic caching idea",
            code:
              "const cache = new Map<string, string>();\n\nasync function getProductName(id: string) {\n  const cached = cache.get(id);\n\n  if (cached) {\n    return cached;\n  }\n\n  const product = await loadProductFromDatabase(id);\n\n  cache.set(id, product.name);\n\n  return product.name;\n}",
          },
          keyTakeaways: [
            "A cache stores reusable results so expensive work does not always have to happen again.",
            "The database can remain the source of truth while caches hold derived copies.",
            "Caching improves speed and reduces repeated work, but introduces freshness and invalidation concerns.",
          ],
          commonMistakes: [
            "Thinking a cache is the permanent source of truth.",
            "Caching everything without considering whether the data can become stale.",
            "Assuming adding a cache automatically makes an application correct.",
          ],
          miniQuiz: [
            {
              question: "What is the main purpose of a cache?",
              answer:
                "To reuse previously produced data or results so the application does not need to repeat expensive work unnecessarily.",
            },
          ],
        },
        {
          title: "1.2 The five layers in a modern web application",
          explanation:
            "Caching can happen at several different locations. For this lesson, use the following architecture as a mental model:\n\nBrowser Cache → CDN Cache → Next.js Cache → Application Cache → Database.\n\nThese layers are not interchangeable. They live in different environments and solve different problems.\n\nThe browser is closest to the user. A CDN is distributed around the network and can serve cacheable responses from an edge location. Next.js can cache application output and data according to its caching model. An application-level cache such as Redis can store reusable application data. Finally, the database remains the durable source of truth.\n\nA request does not necessarily travel through every layer in exactly this sequence for every application. The diagram is an architectural model that helps you reason about where repeated work can be avoided.\n\nThe production skill is learning which layer should own a particular cache and what happens when that cached value becomes stale.",
          visualDiagram:
            "Browser Cache\n      ↓\nCDN / Edge Cache\n      ↓\nNext.js Cache\n      ↓\nApplication Cache\n      ↓\nDatabase\n\nEach layer can potentially answer\nwithout reaching the layer below it.",
          codeExample: {
            title: "Think in layers",
            code:
              "type CacheLayer =\n  | \"browser\"\n  | \"cdn\"\n  | \"nextjs\"\n  | \"application\"\n  | \"database\";\n\nconst requestPath: CacheLayer[] = [\n  \"browser\",\n  \"cdn\",\n  \"nextjs\",\n  \"application\",\n  \"database\",\n];",
          },
          keyTakeaways: [
            "Caching exists at multiple layers of a production system.",
            "Each layer has different ownership, lifetime, and invalidation behavior.",
            "A cache hit at an earlier layer can prevent work at later layers.",
          ],
          commonMistakes: [
            "Calling every cache simply the Next.js cache.",
            "Assuming the browser, CDN, and server share one cache.",
            "Invalidating one layer while forgetting that another layer may still contain older data.",
          ],
          miniQuiz: [
            {
              question:
                "Why is it useful to think about caching as multiple layers?",
              answer:
                "Because each layer can cache different information and has different rules for lifetime, freshness, and invalidation.",
            },
          ],
        },
        {
          title: "1.3 Cache hits, cache misses, and stale data",
          explanation:
            "A cache hit happens when the requested value is available in the cache and can be reused. A cache miss happens when the value is not available or can no longer be used.\n\nOn a cache miss, the application usually performs the original work, such as fetching from a database or another service. The result may then be stored in the cache for future requests.\n\nThere is another important state: stale data. Stale data means the cache has a value, but that value is older than the freshness policy allows.\n\nStale data is not automatically bad. A blog homepage might safely display an article list that is a few minutes old. A banking balance usually requires much stricter freshness.\n\nThis leads to one of the most important caching decisions: how fresh does this data actually need to be?\n\nGood caching architecture starts by answering that question rather than choosing an arbitrary cache duration.",
          visualDiagram:
            "Request\n  │\n  ▼\nCache lookup\n  │\n  ├── Hit ─────────────► Return cached value\n  │\n  └── Miss\n        │\n        ▼\n      Source\n        │\n        ▼\n      Store\n        │\n        ▼\n      Return",
          codeExample: {
            title: "A simple cache decision",
            code:
              "async function getHomepageData() {\n  const cached = await getCachedHomepageData();\n\n  if (cached) {\n    return cached;\n  }\n\n  const freshData = await loadHomepageData();\n  await saveCachedHomepageData(freshData);\n\n  return freshData;\n}",
          },
          keyTakeaways: [
            "A cache hit avoids repeating the underlying work.",
            "A cache miss requires the application to obtain the original value.",
            "Whether stale data is acceptable depends on the business requirement.",
          ],
          commonMistakes: [
            "Assuming every cached value must always be perfectly fresh.",
            "Choosing cache durations without considering the data's business meaning.",
            "Forgetting that stale data can become a correctness problem for some features.",
          ],
          miniQuiz: [
            {
              question:
                "Is stale data always a problem?",
              answer:
                "No. Some applications can safely show slightly old data, while other features require very fresh information.",
            },
          ],
        },
      ],
    },

    {
      title: "2. Browser and CDN Caching",
      subsections: [
        {
          title: "2.1 Browser caching",
          explanation:
            "The browser can store responses and resources locally so that it does not need to download them again on every visit.\n\nThis is especially useful for static resources such as JavaScript, CSS, fonts, and images. When the browser already has a valid cached copy, it may be able to reuse it without downloading the resource again.\n\nBrowser caching is controlled largely through HTTP caching rules. The server communicates caching behavior through response headers such as `Cache-Control`.\n\nFor example, a response can tell a browser that a resource may be considered fresh for a certain amount of time. The browser can then reuse that resource during the specified period.\n\nThe important point is that browser caching is outside your React component tree. You do not invalidate a browser cache by changing a React state variable. HTTP caching rules and the browser's cache behavior are involved.\n\nThis layer is particularly valuable for static assets because users can reuse resources across page navigations and future visits.",
          visualDiagram:
            "First visit\n\nBrowser ─────► Server\nBrowser ◄───── Server\n       stores response\n\nLater visit\n\nBrowser\n  │\n  ├── cached response is fresh ──► reuse locally\n  │\n  └── otherwise ────────────────► request server",
          codeExample: {
            title: "Setting Cache-Control for a response",
            code:
              "import { NextResponse } from \"next/server\";\n\nexport async function GET() {\n  return new NextResponse(\"public content\", {\n    headers: {\n      \"Cache-Control\": \"public, max-age=3600\",\n    },\n  });\n}",
          },
          keyTakeaways: [
            "The browser can reuse cached HTTP responses.",
            "`Cache-Control` communicates caching instructions through HTTP.",
            "Browser caching is separate from the Next.js server cache.",
          ],
          commonMistakes: [
            "Assuming changing server-side data automatically clears every user's browser cache.",
            "Using aggressive browser caching for data that must immediately reflect changes.",
            "Confusing browser cache behavior with React state or Next.js server caching.",
          ],
          miniQuiz: [
            {
              question:
                "Which HTTP header is commonly used to control browser and intermediary caching?",
              answer: "`Cache-Control`.",
            },
          ],
        },
        {
          title: "2.2 Cache-Control and freshness",
          explanation:
            "`Cache-Control` is an HTTP response header that allows the server to describe how a response can be cached.\n\nFor example, `max-age` describes how long a response can be considered fresh in a browser cache. `public` indicates that the response may be cached by shared caches as well as private caches, subject to the rest of the caching rules.\n\nCDN caching commonly uses directives such as `s-maxage`, which applies to shared caches. Next.js documents that it sets standard `Cache-Control` headers based on the rendering strategy of a route, including shared-cache directives for static and revalidated responses.\n\nYou should not memorize every directive immediately. Start with the key idea: the response headers define how intermediaries and browsers are allowed to reuse the response.\n\nFor personalized pages, be particularly careful. A response containing private user information should not accidentally become a shared CDN response.",
          codeExample: {
            title: "Public shared caching",
            code:
              "import { NextResponse } from \"next/server\";\n\nexport async function GET() {\n  return NextResponse.json(\n    { message: \"Public product information\" },\n    {\n      headers: {\n        \"Cache-Control\": \"public, s-maxage=60, stale-while-revalidate=300\",\n      },\n    }\n  );\n}",
          },
          keyTakeaways: [
            "`Cache-Control` communicates caching behavior to browsers and shared caches.",
            "`max-age` concerns browser freshness.",
            "`s-maxage` is relevant to shared caches such as CDNs.",
            "Personalized responses require careful caching rules.",
          ],
          commonMistakes: [
            "Using public shared caching for private user-specific responses.",
            "Thinking `max-age` and `s-maxage` mean exactly the same thing.",
            "Setting a long cache lifetime without deciding how stale data will be corrected.",
          ],
          miniQuiz: [
            {
              question:
                "Why should you be careful with `public` caching on authenticated pages?",
              answer:
                "Because a shared cache could potentially reuse a response between users if the response is not correctly separated by user-specific data.",
            },
          ],
        },
        {
          title: "2.3 CDN caching",
          explanation:
            "A Content Delivery Network, or CDN, is a distributed network of servers that can serve cacheable content from locations closer to users.\n\nWithout a CDN, a user in Tokyo might repeatedly request a cacheable resource from an origin server located far away. With a CDN, the resource can potentially be served from an edge location closer to the user.\n\nThe CDN does not replace the application server or database. It sits in front of them and can prevent many requests from reaching the origin.\n\nNext.js documents CDN caching through standard HTTP `Cache-Control` headers. Its current documentation explains that Next.js sets these headers according to the rendering strategy and that CDNs can use them to cache responses at the edge.\n\nCDN caching works particularly well for content that is shared among many users and can tolerate a defined amount of staleness, such as public documentation, marketing pages, product catalogs, and static assets.\n\nIt becomes more complicated when the response depends on cookies, custom headers, authentication, or other request-specific information.",
          visualDiagram:
            "User in Tokyo       User in London\n      │                    │\n      ▼                    ▼\n┌─────────────┐      ┌─────────────┐\n│ CDN edge    │      │ CDN edge    │\n│ Tokyo       │      │ London      │\n└──────┬──────┘      └──────┬──────┘\n       │ cache miss          │ cache hit\n       └──────────┬──────────┘\n                  ▼\n          ┌──────────────┐\n          │ Origin /     │\n          │ Next.js      │\n          └──────┬───────┘\n                 ▼\n             Database",
          codeExample: {
            title: "A cacheable public response",
            code:
              "export async function GET() {\n  const products = [\n    { id: \"p1\", name: \"Tokyo Backpack\" },\n    { id: \"p2\", name: \"Travel Headphones\" },\n  ];\n\n  return Response.json(products, {\n    headers: {\n      \"Cache-Control\":\n        \"public, s-maxage=300, stale-while-revalidate=600\",\n    },\n  });\n}",
          },
          keyTakeaways: [
            "A CDN can serve cached responses from edge locations close to users.",
            "CDNs can reduce origin traffic and improve response latency.",
            "Next.js uses standard HTTP caching headers that CDNs can understand.",
          ],
          commonMistakes: [
            "Thinking a CDN cache is the same thing as a database cache.",
            "Caching personalized responses publicly.",
            "Assuming every dynamic application response is suitable for shared CDN caching.",
          ],
          miniQuiz: [
            {
              question:
                "What is the main advantage of CDN caching?",
              answer:
                "A CDN can serve cacheable content from an edge location closer to the user and avoid unnecessary requests to the origin.",
            },
          ],
        },
      ],
    },

    {
      title: "3. Next.js Caching: Data, Routes, and the Router",
      subsections: [
        {
          title: "3.1 The modern Next.js caching model",
          explanation:
            "Next.js caching has changed significantly across recent major versions, so it is important to learn the current App Router model rather than memorizing older caching behavior.\n\nNext.js 16 introduced Cache Components and the `use cache` directive. The current documentation describes `use cache` as a way to mark a route, component, or function as cacheable. Cache Components are enabled through `cacheComponents: true` in `next.config.ts`.\n\nThis means that when learning terms such as Data Cache and Full Route Cache, you should understand them as parts of Next.js's caching architecture and historical terminology, while also learning the current Cache Components model.\n\nThe modern approach gives you a more explicit way to decide which server computations or component outputs should be cached.\n\nFor example, a public product lookup can be cached because many users can safely reuse the same result. A user-specific dashboard calculation should not be treated as globally shareable just because caching would make it faster.",
          visualDiagram:
            "Current Next.js mental model\n\nRoute / Component / Function\n              │\n              ▼\n          use cache\n              │\n       ┌──────┴──────┐\n       ▼             ▼\n   Cache data     Cache output\n       │             │\n       └──────┬──────┘\n              ▼\n       Reuse when valid\n\nOlder terminology still useful:\nData Cache → cached data\nFull Route Cache → cached route output\nRouter Cache → client-side route cache",
          codeExample: {
            title: "Enable Cache Components",
            code:
              "import type { NextConfig } from \"next\";\n\nconst nextConfig: NextConfig = {\n  cacheComponents: true,\n};\n\nexport default nextConfig;",
          },
          keyTakeaways: [
            "Next.js 16 introduced Cache Components and `use cache` as a modern caching model.",
            "Older terms such as Data Cache and Full Route Cache remain useful for understanding Next.js architecture.",
            "Caching should be an intentional decision based on data sharing and freshness requirements.",
          ],
          commonMistakes: [
            "Learning only older Next.js caching behavior and applying it unchanged to Next.js 16.",
            "Assuming all server-rendered output is automatically globally cached.",
            "Caching user-specific data as though it were public shared data.",
          ],
          miniQuiz: [
            {
              question:
                "What modern Next.js feature lets you explicitly mark a function, component, or route as cacheable?",
              answer: "The `use cache` directive.",
            },
          ],
        },
        {
          title: "3.2 Caching data with use cache",
          explanation:
            "The `use cache` directive can be placed at the file, function, or component level. It tells Next.js that the marked computation or output can be cached.\n\nThis is useful when a function repeatedly performs expensive work and the result can safely be reused for the same inputs.\n\nFor example, suppose an ecommerce store has a public product catalog. The product list might come from a database or external service, but the same catalog data can be reused by many visitors for a period of time.\n\nThe cache key is based on information such as the build ID, function identity, and serializable inputs. That means the arguments passed to a cached function can influence which cached result is used.\n\nThis is an important production concept: caching is not simply saying \"store this forever.\" You need to understand what identifies one cached result from another and how long that result should remain valid.",
          codeExample: {
            title: "Cache a public product lookup",
            code:
              "export async function getProduct(productId: string) {\n  \"use cache\";\n\n  const product = await db.products.findUnique({\n    where: { id: productId },\n  });\n\n  return product;\n}",
          },
          keyTakeaways: [
            "`use cache` can cache a function's result.",
            "Function inputs can participate in the cache key.",
            "The same cached function can produce separate cache entries for different inputs.",
          ],
          commonMistakes: [
            "Caching a function without considering whether its result is user-specific.",
            "Forgetting that function inputs can create different cache entries.",
            "Assuming `use cache` means the result never changes.",
          ],
          miniQuiz: [
            {
              question:
                "Why does a cached function need a meaningful cache key?",
              answer:
                "Because the cache must know when two requests are asking for the same reusable result and when they require different results.",
            },
          ],
        },
        {
          title: "3.3 Data Cache and Full Route Cache as architectural concepts",
          explanation:
            "You will often encounter the terms Data Cache and Full Route Cache in Next.js documentation and existing applications.\n\nThe Data Cache describes cached results of data requests or data-producing operations. Conceptually, it answers: can we reuse the data without performing the underlying fetch again?\n\nThe Full Route Cache describes cached rendered route output. Conceptually, it answers: can we reuse the generated result for this route rather than rebuilding the route output from scratch?\n\nThese concepts are useful because they separate two different things: cached data and cached rendered output.\n\nImagine a blog homepage. The article list could be cached as data. The rendered homepage could also be cached. If the article data changes, you need to consider which cached results depend on that data.\n\nWith modern Cache Components, `use cache` gives you a more explicit programming model for caching route, component, or function output. Do not assume an old cache diagram describes every detail of current Next.js 16 behavior.",
          visualDiagram:
            "Database\n    │\n    ▼\nCached data\n    │\n    ▼\nServer rendering\n    │\n    ▼\nCached route/component output\n    │\n    ▼\nBrowser / CDN",
          codeExample: {
            title: "Cache route output with use cache",
            code:
              "// app/products/page.tsx\n\"use cache\";\n\nexport default async function ProductsPage() {\n  const products = await getProducts();\n\n  return (\n    <main>\n      <h1>Products</h1>\n      <ul>\n        {products.map((product) => (\n          <li key={product.id}>{product.name}</li>\n        ))}\n      </ul>\n    </main>\n  );\n}\n\nasync function getProducts() {\n  return db.products.findMany({\n    orderBy: { name: \"asc\" },\n  });\n}",
          },
          keyTakeaways: [
            "Data caching and route-output caching solve different problems.",
            "A cached route may depend on cached or uncached data.",
            "Modern Next.js makes cacheable route, component, and function boundaries explicit with `use cache`.",
          ],
          commonMistakes: [
            "Thinking a data cache and a route cache are the same thing.",
            "Assuming invalidating one cached value automatically explains every other cache layer.",
            "Applying old Full Route Cache assumptions without checking the current Next.js version and configuration.",
          ],
          miniQuiz: [
            {
              question:
                "What is the conceptual difference between cached data and cached route output?",
              answer:
                "Cached data reuses an underlying data result, while cached route output reuses the result of rendering a route or component.",
            },
          ],
        },
        {
          title: "3.4 Router Cache",
          explanation:
            "The Router Cache is different from server-side data caching. It is a client-side cache used during navigation in the browser.\n\nNext.js can store route segments in the user's browser memory so that navigation can be faster and fewer requests are necessary. The Next.js learning material describes this cache as working with prefetching to improve navigation performance.\n\nThis explains an important situation: you can update data on the server and still see previously rendered content during client-side navigation if the browser has cached route information.\n\nThat is why cache invalidation sometimes needs to account for both server-side cached data and client-side navigation state.\n\nFor example, after a user creates an invoice, the invoices list should show the new invoice. Next.js's Server Action examples use revalidation APIs such as `revalidatePath` to cause the relevant route to be refreshed.\n\nThe Router Cache should therefore be thought of as a navigation-performance cache, not as your database cache.",
          visualDiagram:
            "Browser\n   │\n   ├── Router Cache\n   │       │\n   │       └── cached route segments\n   │\n   ▼\nNext.js server\n   │\n   ├── cached data / output\n   │\n   ▼\nDatabase",
          codeExample: {
            title: "Refreshing a changed route after a mutation",
            code:
              "\"use server\";\n\nimport { revalidatePath } from \"next/cache\";\n\nexport async function updateInvoice(id: string) {\n  await db.invoice.update({\n    where: { id },\n    data: { status: \"paid\" },\n  });\n\n  revalidatePath(\"/dashboard/invoices\");\n}",
          },
          keyTakeaways: [
            "The Router Cache lives on the client side and supports fast navigation.",
            "It is different from server-side data caching.",
            "After mutations, route revalidation can be necessary so users see updated information.",
          ],
          commonMistakes: [
            "Calling the Router Cache the database cache.",
            "Assuming a database mutation automatically changes already cached client navigation state.",
            "Forgetting that navigation caching exists when debugging stale UI.",
          ],
          miniQuiz: [
            {
              question:
                "Where does the Router Cache primarily operate?",
              answer:
                "In the user's browser as part of Next.js client-side navigation.",
            },
          ],
        },
      ],
    },

    {
      title: "4. Application Caching and Cache Lifetime",
      subsections: [
        {
          title: "4.1 What application caching means",
          explanation:
            "Application caching is caching that you deliberately introduce inside your application infrastructure. A common example is a Redis-based cache shared by multiple application instances.\n\nThis layer is different from Next.js's own caching mechanisms. You might use an application cache when you need a shared store for frequently accessed data, rate-limited external API responses, expensive calculations, session-related data, or information shared across multiple application servers.\n\nFor example, imagine a SaaS application with thousands of requests for the same public pricing configuration. If every request queries the database, the database performs the same work repeatedly. An application cache can store that configuration so many requests can reuse it.\n\nApplication caches can be powerful, but they introduce another system that must be operated, monitored, sized, and invalidated.\n\nDo not add Redis simply because \"production applications use Redis.\" First identify the problem. If Next.js caching, database indexing, or query optimization already solves the bottleneck, another cache may add unnecessary complexity.",
          visualDiagram:
            "Many requests\n     │\n     ▼\n┌──────────────────┐\n│ Next.js servers  │\n└────────┬─────────┘\n         │\n         ▼\n┌──────────────────┐\n│ Application      │\n│ Cache / Redis    │\n└────────┬─────────┘\n         │ miss\n         ▼\n┌──────────────────┐\n│ Database         │\n└──────────────────┘",
          codeExample: {
            title: "Application cache as an architectural boundary",
            code:
              "type PricingConfig = {\n  currency: string;\n  trialDays: number;\n};\n\nasync function getPricingConfig(): Promise<PricingConfig> {\n  const cached = await redis.get<PricingConfig>(\"pricing-config\");\n\n  if (cached) {\n    return cached;\n  }\n\n  const config = await db.pricingConfig.findFirst();\n\n  if (!config) {\n    throw new Error(\"Pricing configuration not found\");\n  }\n\n  await redis.set(\"pricing-config\", config);\n\n  return config;\n}",
          },
          keyTakeaways: [
            "Application caching is an infrastructure-level cache controlled by your application.",
            "Redis is an example of an application cache, not a built-in requirement of Next.js.",
            "Application caching adds operational and invalidation complexity.",
          ],
          commonMistakes: [
            "Adding an application cache before measuring a real bottleneck.",
            "Treating Redis as a replacement for a properly designed database.",
            "Creating multiple cache layers without documenting which one owns freshness.",
          ],
          miniQuiz: [
            {
              question:
                "When might an application-level cache be useful?",
              answer:
                "When expensive or frequently requested data needs to be shared efficiently across application instances or requests.",
            },
          ],
        },
        {
          title: "4.2 Choosing what should be cached",
          explanation:
            "A useful caching decision starts with the data rather than the technology.\n\nAsk four questions.\n\nFirst, is the result expensive to produce? If reading the value from the database already takes almost no time, caching may not provide much benefit.\n\nSecond, can multiple requests safely share the result? Public product information can usually be shared. A user's private account balance usually cannot be placed in a public shared cache.\n\nThird, how fresh does the data need to be? A blog article can tolerate some delay. Inventory availability may require much more careful freshness rules.\n\nFourth, how will the cache be invalidated? If you cannot explain how stale data becomes fresh again, the caching design is incomplete.\n\nThis leads to a useful production rule: cache only when you can explain the data's ownership, freshness, cache key, and invalidation strategy.",
          codeExample: {
            title: "Document a caching decision",
            code:
              "const cachePolicy = {\n  resource: \"public product catalog\",\n  shared: true,\n  freshness: \"a few minutes\",\n  key: \"products:catalog\",\n  invalidation: \"revalidate when catalog changes\",\n};",
          },
          keyTakeaways: [
            "Cache decisions should be based on cost, sharing, freshness, and invalidation.",
            "Private data requires different caching rules from public data.",
            "Every production cache should have an understandable invalidation strategy.",
          ],
          commonMistakes: [
            "Caching because something is popular without considering freshness.",
            "Using the same cache policy for public and private information.",
            "Creating a cache without knowing how updates will invalidate it.",
          ],
          miniQuiz: [
            {
              question:
                "What four questions should guide a caching decision?",
              answer:
                "Is the data expensive to produce, can requests safely share it, how fresh must it be, and how will it be invalidated?",
            },
          ],
        },
        {
          title: "4.3 Cache lifetime with cacheLife",
          explanation:
            "Current Next.js Cache Components provide `cacheLife` for controlling how long cached content should remain fresh and when it can expire.\n\nThis is more expressive than thinking only in terms of a single timeout. Cache lifetime can describe different stages of freshness and expiration.\n\nFor beginners, think about it as answering three questions: how long is this result considered fresh, how long can stale content remain usable, and when should the cache entry expire completely?\n\nThe important production lesson is that cache lifetime should match the business meaning of the data. A public documentation page may have a long lifetime. A rapidly changing product inventory should have a much shorter or explicitly invalidated lifetime.\n\nThe current `use cache` documentation explains that cached entries respect `cacheLife` settings and that cache lifetime can be customized for runtime caching.",
          codeExample: {
            title: "Give cached data an explicit lifetime",
            code:
              "import { cacheLife } from \"next/cache\";\n\nexport async function getProducts() {\n  \"use cache\";\n\n  cacheLife(\"hours\");\n\n  return db.products.findMany({\n    orderBy: { name: \"asc\" },\n  });\n}",
          },
          keyTakeaways: [
            "`cacheLife` lets you define cache lifetime for Cache Components.",
            "Cache lifetime should match how quickly the underlying data changes.",
            "Freshness and expiration are different concepts in a production cache.",
          ],
          commonMistakes: [
            "Using a long lifetime for rapidly changing data.",
            "Choosing cache duration purely for performance without considering correctness.",
            "Thinking expiration alone solves every invalidation problem.",
          ],
          miniQuiz: [
            {
              question:
                "Why should cache lifetime depend on the type of data?",
              answer:
                "Different data has different freshness requirements, so a lifetime that is safe for a blog page may be unsafe for rapidly changing business data.",
            },
          ],
        },
      ],
    },

    {
      title: "5. Cache Invalidation and Cache Tags",
      subsections: [
        {
          title: "5.1 Why cache invalidation is difficult",
          explanation:
            "Cache invalidation means telling a cache that a stored value should no longer be treated as valid.\n\nImagine a product's price is cached at 10,000 yen. The database is updated to 9,000 yen. If the cache still contains 10,000 yen, users may continue seeing the old price.\n\nThe database is correct, but the application is displaying stale cached data.\n\nThis is the classic caching problem: storing data is easy; knowing exactly when that data must be refreshed is harder.\n\nThere are several common strategies. A cache can expire after a period of time. A specific route can be revalidated after a mutation. A tagged group of cached data can be invalidated when the underlying resource changes.\n\nNext.js provides APIs such as `revalidatePath`, `revalidateTag`, and, in Server Actions, `updateTag` for different invalidation needs. The current API design distinguishes these operations rather than treating every invalidation as identical.",
          visualDiagram:
            "Database\n   │\n   │ update product price\n   ▼\nDatabase = ¥9,000\n\nCache = ¥10,000\n   │\n   │ stale!\n   ▼\nUser sees wrong value\n\nInvalidation\n   │\n   ▼\nCache refreshed / expired\n   │\n   ▼\nUser sees ¥9,000",
          codeExample: {
            title: "Invalidate a route after a mutation",
            code:
              "\"use server\";\n\nimport { revalidatePath } from \"next/cache\";\n\nexport async function updateProductPrice(\n  productId: string,\n  price: number\n) {\n  await db.product.update({\n    where: { id: productId },\n    data: { price },\n  });\n\n  revalidatePath(`/products/${productId}`);\n}",
          },
          keyTakeaways: [
            "Invalidation tells a cache that previously stored information needs to be refreshed.",
            "A database can be correct while a cache still contains stale information.",
            "Expiration and explicit invalidation are different strategies.",
          ],
          commonMistakes: [
            "Updating the database without considering dependent cached values.",
            "Assuming cache expiration immediately updates every user.",
            "Invalidating too much and destroying useful cache entries unnecessarily.",
          ],
          miniQuiz: [
            {
              question: "What is cache invalidation?",
              answer:
                "It is the process of marking cached information as needing to be refreshed or no longer used.",
            },
          ],
        },
        {
          title: "5.2 Cache tags",
          explanation:
            "A cache tag gives cached data a meaningful label so that related cached entries can be invalidated together.\n\nImagine an ecommerce application with many pages that depend on product information. Instead of remembering every route that might contain a product, you can associate cached data with a tag such as `products`.\n\nWhen product data changes, the application can invalidate the relevant tag. This creates a relationship between the underlying data and the cached results that depend on it.\n\nCurrent Next.js supports tags through `cacheTag` inside `use cache` scopes and through the `next.tags` option for cached fetch requests.\n\nTags are especially useful when one data source appears in many different pages or components. A product update might affect the product page, category page, search results, and recommendation sections. A well-designed tag can represent the shared data dependency.",
          visualDiagram:
            "Product data\n     │\n     ├────────► Product page\n     │\n     ├────────► Category page\n     │\n     ├────────► Search results\n     │\n     └────────► Recommendations\n             \nAll related cache entries\n       │\n       ▼\n   tag: \"products\"\n       │\n       ▼\nInvalidate tag\n       │\n       ▼\nRefresh dependent data",
          codeExample: {
            title: "Tag cached product data",
            code:
              "import { cacheTag } from \"next/cache\";\n\nexport async function getProducts() {\n  \"use cache\";\n\n  cacheTag(\"products\");\n\n  return db.products.findMany({\n    orderBy: { name: \"asc\" },\n  });\n}",
          },
          keyTakeaways: [
            "A cache tag associates cached data with a meaningful invalidation label.",
            "Tags are useful when many cached results depend on the same underlying data.",
            "`cacheTag` works inside `use cache` scopes in the current Next.js caching model.",
          ],
          commonMistakes: [
            "Creating meaningless tags that do not map to real data dependencies.",
            "Using one giant tag for unrelated application data.",
            "Forgetting to attach a tag to the data before trying to invalidate it.",
          ],
          miniQuiz: [
            {
              question:
                "Why are cache tags useful?",
              answer:
                "They let you identify related cached data and invalidate that group when the underlying resource changes.",
            },
          ],
        },
        {
          title: "5.3 revalidateTag versus updateTag",
          explanation:
            "Current Next.js provides two important tag-based invalidation behaviors: `revalidateTag` and `updateTag`.\n\n`updateTag` is designed for read-your-own-writes scenarios. For example, a user edits their profile and immediately expects to see the new value. Current Next.js documentation says `updateTag` can only be called from Server Actions and immediately expires the tagged cache so the next request waits for fresh data.\n\n`revalidateTag` is used for on-demand tag invalidation from Server Actions and Route Handlers. With the recommended `profile=\"max\"` behavior, stale content can continue to be served while fresh content is fetched in the background.\n\nThe distinction is useful:\n\n• Use `updateTag` when the user just changed data and needs to see their own update immediately.\n• Use `revalidateTag` when you want tagged data to become stale and be refreshed according to the revalidation behavior.\n\nDo not choose between them by memorizing names. Think about the desired user experience after the mutation.",
          codeExample: {
            title: "Read-your-own-writes with updateTag",
            code:
              "\"use server\";\n\nimport { updateTag } from \"next/cache\";\n\nexport async function updateProduct(productId: string, price: number) {\n  await db.product.update({\n    where: { id: productId },\n    data: { price },\n  });\n\n  updateTag(`product:${productId}`);\n}",
          },
          keyTakeaways: [
            "`updateTag` is designed for immediate freshness after a Server Action mutation.",
            "`revalidateTag` provides tag-based revalidation and supports stale-while-revalidate behavior with the recommended profile.",
            "Choose invalidation behavior based on what the user should see after a mutation.",
          ],
          commonMistakes: [
            "Using `updateTag` outside a Server Action.",
            "Treating `revalidateTag` and `updateTag` as identical.",
            "Invalidating an entire application when only one resource changed.",
          ],
          miniQuiz: [
            {
              question:
                "When is `updateTag` particularly useful?",
              answer:
                "When a user has just changed data and should immediately see their own updated value.",
            },
          ],
        },
        {
          title: "5.4 Designing cache dependencies",
          explanation:
            "The most important production skill in caching is not memorizing APIs. It is designing dependencies.\n\nSuppose a product has a price, inventory count, and category. Several pages may depend on those values. If you cache each page independently but do not define how product changes invalidate the dependent data, stale information becomes likely.\n\nA better design identifies the data resource first and then associates cached results with that resource.\n\nFor example, a product-specific tag such as `product:123` can represent one product. A broader `products` tag can represent a product catalog. This lets you choose between narrow and broad invalidation.\n\nNarrow invalidation preserves more cache entries and can be more efficient. Broad invalidation is simpler but may invalidate more data than necessary.\n\nThis is a central production trade-off: correctness usually requires invalidating everything that depends on changed data, while performance benefits from invalidating as little unrelated data as possible.",
          codeExample: {
            title: "Use resource-oriented cache tags",
            code:
              "import { cacheTag } from \"next/cache\";\n\nexport async function getProduct(productId: string) {\n  \"use cache\";\n\n  cacheTag(\"products\");\n  cacheTag(`product:${productId}`);\n\n  return db.product.findUnique({\n    where: { id: productId },\n  });\n}",
          },
          keyTakeaways: [
            "Good caching architecture models dependencies between data and cached results.",
            "Specific tags allow narrow invalidation.",
            "Broad tags are simpler but can invalidate more cached data.",
          ],
          commonMistakes: [
            "Using only one global cache tag for an entire application.",
            "Invalidating too narrowly and leaving dependent data stale.",
            "Invalidating too broadly and destroying useful cache performance.",
          ],
          miniQuiz: [
            {
              question:
                "Why might `product:123` be better than only `products` for some invalidation operations?",
              answer:
                "It allows the application to invalidate only the cached data related to product 123 instead of invalidating every cached product result.",
            },
          ],
        },
      ],
    },

    {
      title: "6. Production Caching Strategy and Project",
      subsections: [
        {
          title: "6.1 Designing a caching policy",
          explanation:
            "A production application should not have random caching decisions scattered throughout the codebase. It should have understandable policies.\n\nFor every important cached resource, document what is being cached, who can share the result, how fresh it needs to be, what its cache key is, which tags represent its dependencies, and what operation invalidates it.\n\nConsider a SaaS dashboard. Public company-level documentation can often have a relatively long cache lifetime. A product catalog may tolerate a short delay. A user's personal notification count may require a different strategy. Financial transaction information requires careful handling because incorrect stale data can have serious consequences.\n\nThe more sensitive or user-specific the information, the more carefully you should reason about whether it can be shared through browser or CDN caches.\n\nCaching is therefore a business requirement as much as a technical one. A developer should be able to explain why a particular value is cached and exactly what happens when its source changes.",
          visualDiagram:
            "For every cached resource:\n\n┌───────────────────────────────┐\n│ What is cached?               │\n├───────────────────────────────┤\n│ Who can share it?             │\n├───────────────────────────────┤\n│ How fresh must it be?         │\n├───────────────────────────────┤\n│ What is the cache key?        │\n├───────────────────────────────┤\n│ What tags describe it?        │\n├───────────────────────────────┤\n│ How is it invalidated?        │\n└───────────────────────────────┘",
          codeExample: {
            title: "A production cache policy",
            code:
              "const productCachePolicy = {\n  resource: \"product\",\n  sharing: \"public\",\n  key: \"product:{id}\",\n  tags: [\"products\", \"product:{id}\"],\n  freshness: \"short-lived\",\n  invalidation: \"updateTag after product mutation\",\n};",
          },
          keyTakeaways: [
            "Every important cache should have an explicit policy.",
            "Freshness, sharing, keys, tags, and invalidation should be understandable to the team.",
            "Sensitive and personalized data requires especially careful cache design.",
          ],
          commonMistakes: [
            "Allowing every developer to invent unrelated cache rules.",
            "Caching private information at shared layers.",
            "Documenting cache duration but not documenting invalidation.",
          ],
          miniQuiz: [
            {
              question:
                "What should a production team be able to explain about an important cache?",
              answer:
                "What it caches, who can share it, its key, freshness requirements, dependencies, and how it is invalidated.",
            },
          ],
        },
        {
          title: "6.2 Debugging stale data",
          explanation:
            "Stale-data bugs can be difficult because several caches may be involved at the same time.\n\nSuppose an administrator changes a product price. The database contains the new price, but the user still sees the old price. Do not immediately assume the database update failed.\n\nWalk through the layers.\n\nThe browser may have cached a response. The CDN may have an older response. Next.js may have cached data or output. An application-level cache may still contain the previous database value. The Router Cache may contain previously rendered route information.\n\nThis is why debugging caching requires identifying which layer served the stale value.\n\nA useful debugging process is to start at the user and move toward the source of truth. Determine whether the browser reused something, whether the CDN served something, whether Next.js reused something, whether an application cache returned something, and finally whether the database contains the expected value.\n\nDo not randomly delete all caches. First identify the stale layer. Otherwise you may hide the problem instead of understanding it.",
          visualDiagram:
            "User sees old value\n       │\n       ▼\nBrowser cache?\n       │ no\n       ▼\nCDN cache?\n       │ no\n       ▼\nRouter Cache?\n       │ no\n       ▼\nNext.js cache?\n       │ no\n       ▼\nApplication cache?\n       │ no\n       ▼\nDatabase\n       │\n       ▼\nFind the first layer\nthat returned stale data.",
          codeExample: {
            title: "Log the source while debugging",
            code:
              "const value = await getProduct(productId);\n\nconsole.log({\n  productId,\n  source: \"application-cache\",\n  value,\n});",
          },
          keyTakeaways: [
            "Stale data can come from more than one cache layer.",
            "Debugging should identify which layer returned the stale value.",
            "The database being correct does not guarantee every cache is current.",
          ],
          commonMistakes: [
            "Deleting every cache without finding the actual cause.",
            "Checking only the database.",
            "Assuming a successful mutation means every cached representation is immediately updated.",
          ],
          miniQuiz: [
            {
              question:
                "If the database has the new value but the user sees the old value, what should you investigate?",
              answer:
                "Investigate each cache layer between the user and database to identify which layer is returning the stale value.",
            },
          ],
        },
        {
          title: "6.3 Build challenge: cached ecommerce catalog",
          explanation:
            "Build a small ecommerce catalog using the Next.js App Router.\n\nThe application should contain a public product listing, individual product pages, and an admin action that updates a product price.\n\nYour goal is to design the caching architecture before writing the invalidation code.\n\nFor the public catalog, decide whether the browser and CDN should be allowed to cache the response. Decide how long slightly stale product information is acceptable.\n\nFor Next.js, use the current Cache Components model and `use cache` for cacheable server work. Add meaningful cache tags with `cacheTag` so product-related data can be invalidated intentionally.\n\nWhen the administrator updates a product, invalidate the appropriate cache. If the mutation is performed through a Server Action and the administrator must immediately see the new value, use the current `updateTag` behavior for the relevant tag.\n\nThen test the system by changing a product price and observing every relevant layer.\n\nYour final project report should answer:\n\n• What does the browser cache?\n• What can the CDN cache?\n• What does Next.js cache?\n• Is there an application cache?\n• What remains in the database?\n• What cache tags exist?\n• What happens after a product update?\n• Which cache is invalidated?\n• Could any user see stale data, and for how long?\n\nThe goal is not simply to make the page fast. The goal is to build a caching system whose behavior you can explain.",
          codeExample: {
            title: "Suggested project structure",
            code:
              "app/\n├── products/\n│   ├── page.tsx\n│   └── [id]/\n│       └── page.tsx\n├── admin/\n│   └── products/\n│       └── actions.ts\n└── lib/\n    ├── data.ts\n    └── cache.ts",
          },
          keyTakeaways: [
            "A production caching system should be designed as a set of coordinated layers.",
            "Cache lifetime controls how long data can be reused, while invalidation controls how cached data becomes fresh after changes.",
            "Cache tags connect cached data to the resources that can invalidate it.",
            "Current Next.js provides `use cache`, `cacheLife`, `cacheTag`, `revalidateTag`, and `updateTag` for different caching and invalidation scenarios.",
            "The best caching architecture is one whose behavior the development team can explain.",
          ],
          commonMistakes: [
            "Copying old Next.js caching examples without checking the current version.",
            "Caching personalized data in a shared browser or CDN cache.",
            "Adding Redis before proving that an application-level cache is necessary.",
            "Using a long cache lifetime without an invalidation strategy.",
            "Using broad invalidation when a narrow resource-specific tag would be sufficient.",
            "Forgetting the client-side Router Cache when debugging stale navigation.",
          ],
          miniQuiz: [
            {
              question:
                "What are the major cache layers in the architecture taught in this lesson?",
              answer:
                "Browser cache, CDN cache, Next.js cache, application cache, and the database as the underlying source of truth.",
            },
            {
              question:
                "What does `Cache-Control` do?",
              answer:
                "It communicates HTTP caching instructions to browsers and shared caches such as CDNs.",
            },
            {
              question:
                "What is the purpose of `use cache` in current Next.js?",
              answer:
                "It marks a route, component, or function as cacheable when using the current Cache Components model.",
            },
            {
              question:
                "What is the difference between cached data and cached route output?",
              answer:
                "Cached data reuses the result of data-producing work, while cached route output reuses rendered route or component output.",
            },
            {
              question:
                "What is the Router Cache?",
              answer:
                "It is client-side route information used by Next.js to make navigation faster and reduce unnecessary requests.",
            },
            {
              question:
                "Why are cache tags useful?",
              answer:
                "They associate cached data with meaningful resources so related cache entries can be invalidated together.",
            },
            {
              question:
                "When is `updateTag` useful?",
              answer:
                "When a Server Action changes data and the user should immediately see their own updated value.",
            },
            {
              question:
                "What is the most important caching question?",
              answer:
                "How will this cached value become fresh again when the underlying data changes?",
            },
          ],
        },
      ],
    },
  ],
};

export const NEXTJS_DAY_33: LessonDay = {
  day: 33, title: NEXTJS_DAY_33_SOURCE.title, overview: NEXTJS_DAY_33_SOURCE.description, totalMinutes: 90, difficulty: "Advanced",
  lessons: NEXTJS_DAY_33_SOURCE.sections.map((section, index) => ({ id: `nextjs-33-${index + 1}`, title: section.title.replace(/^\d+(?:\.\d+)*\.?\s*/, ""), durationMinutes: section.subsections.length * 10, explanation: section.subsections.map((item) => `<b>${item.title.replace(/^\d+(?:\.\d+)*\.?\s*/, "")}</b>\n\n${item.explanation}`).join("\n\n"), diagram: section.subsections.map((item) => item.visualDiagram).filter(Boolean).join("\n\n"), codeExample: { title: "Section examples", code: section.subsections.map((item) => `// ${item.codeExample.title}\n${item.codeExample.code}`).join("\n\n") }, keyTakeaways: section.subsections.flatMap((item) => item.keyTakeaways), commonMistakes: section.subsections.flatMap((item) => item.commonMistakes), quiz: [], rawMiniQuiz: section.subsections.flatMap((item) => item.miniQuiz).map((item) => `<b>${item.question}</b>\n${item.answer}`).join("\n\n") })), finalQuiz: [{ question: "What should you do before optimizing?", options: ["Measure the bottleneck", "Guess", "Add client code", "Disable caching"], correctIndex: 0, explanation: "Measure first so the change targets the real cause." }], project: { name: "Performance project", goal: "Improve one measured user experience.", brief: "Use evidence before changing code.", steps: ["Record a baseline", "Find one bottleneck", "Verify the improvement"], acceptance: ["Before-and-after evidence is recorded"] },
};
