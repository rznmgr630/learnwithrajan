import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_12_LESSONS: LessonDay = {
  day: 12,
  title: "Caching and Revalidation",
  totalMinutes: 88,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "caching-mental-model",
      title: "Caching, request memoization, and data reuse",
      durationMinutes: 18,
      explanation: `
Caching means keeping the result of expensive or repeatable work so that it does not have to be performed again unnecessarily.

In a Next.js application, it is important to distinguish several concepts instead of treating all caching as one feature.

### Request memoization

Request memoization refers to avoiding duplicate work for identical data requests during the same rendering process. The goal is to prevent multiple components from unnecessarily repeating the same request when they need the same resource.

Think of it as a request-level optimization rather than a permanent application-wide cache.

### Data caching

Data caching is about retaining fetched data so it can be reused beyond one immediate render, according to the caching behavior and configuration of the application.

Caching is useful when data changes less frequently than users request it. Public product information, categories, documentation, and similar data are common examples.

### Cache key thinking

A cache needs a way to determine whether two requests represent the same data. The inputs that affect the result must therefore be represented in the cache identity.

For example, a product request for ID 42 must not accidentally reuse the result for ID 43.

### Caching is a correctness concern

Caching is not only about speed. Incorrect caching can show stale or even another user's data to the wrong person.

Before caching data, ask:
- Is the data safe to reuse?
- Which inputs determine the result?
- How long can it be stale?
- What event should invalidate it?
      `,
      diagram: `
Component A ----\
                 \
Component B ------> Data request
                 /       |
Component C ----/        v
                       Cache
                         |
                  +------+------+
                  |             |
               Hit             Miss
                  |             |
                  v             v
              reuse data     fetch data
                                 |
                                 v
                              store/use
      `,
      codeExample: {
        title: "A reusable server-side data function",
        code: `type Product = {
  id: number;
  title: string;
};

async function getProduct(id: string): Promise<Product> {
  const response = await fetch(
    \`https://api.example.com/products/\${id}\`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
}

// Multiple server-side callers can share the same
// data-access function rather than duplicating URL logic.`,
      },
      keyTakeaways: [
        "Caching avoids repeating work when data can safely be reused.",
        "Request memoization and longer-lived data caching are different concepts.",
        "Cache identity must include the inputs that affect the result.",
        "Incorrect caching can become a correctness or security problem.",
      ],
      commonMistakes: [
        "Assuming every fetch should be cached.",
        "Caching user-specific data as if it were public data.",
        "Ignoring parameters that change the result.",
      ],
      quiz: [
        {
          question: "What is the main idea behind request memoization?",
          options: [
            "Persisting all data forever.",
            "Avoiding duplicate identical requests during a rendering process.",
            "Encrypting responses.",
            "Replacing the database.",
          ],
          correctIndex: 1,
          explanation:
            "Request memoization prevents repeated identical work within the relevant request/rendering context.",
        },
      ],
    },

    {
      id: "revalidation-strategies",
      title: "Revalidation and time-based freshness",
      durationMinutes: 17,
      explanation: `
Revalidation is a way to make cached data fresh again without requiring every request to perform the underlying work from scratch.

### Time-based revalidation

Time-based revalidation gives data a freshness window. For example, if product data can be five minutes old, a five-minute revalidation period can reduce repeated upstream requests while still allowing the data to update regularly.

The exact freshness behavior depends on the caching mechanism being used, so do not describe a revalidation interval as an absolute promise that the data will change at exactly that second.

### Choosing the interval

A good interval is a business decision.

A stock price page may need much fresher data than a documentation page. A product category list may tolerate several minutes of staleness.

Ask:
- How frequently does the source change?
- How quickly must users see changes?
- How expensive is the source request?
- Is stale data harmful?

### Revalidation is not polling

Polling means repeatedly asking for fresh data. Revalidation is about invalidating or refreshing reusable server-side data according to a caching strategy.

A browser can also poll independently, but that is a different mechanism.
      `,
      diagram: `
Initial request
      |
      v
 Fetch fresh data
      |
      v
   Cache data
      |
      | within freshness window
      v
 Reuse cached data
      |
      | stale / revalidation needed
      v
 Refresh data
      |
      v
 Update reusable result
      `,
      codeExample: {
        title: "Time-based revalidation",
        code: `async function getProducts() {
  const response = await fetch(
    "https://api.example.com/products",
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return response.json();
}`,
      },
      keyTakeaways: [
        "Revalidation allows cached data to become fresh again.",
        "Time-based revalidation is useful when a known freshness window is acceptable.",
        "The interval should reflect business freshness requirements.",
        "Revalidation is not the same thing as client-side polling.",
      ],
      commonMistakes: [
        "Choosing an arbitrary one-second interval for every endpoint.",
        "Promising that data will refresh at an exact second.",
        "Using revalidation when users actually require immediate consistency.",
      ],
      quiz: [
        {
          question: "What should determine a revalidation interval?",
          options: [
            "Only the developer's favorite number.",
            "The application's freshness requirements and cost of fetching the data.",
            "The number of React components.",
            "The TypeScript version.",
          ],
          correctIndex: 1,
          explanation:
            "Freshness requirements and data-fetching cost are important factors in selecting a revalidation strategy.",
        },
      ],
    },

    {
      id: "on-demand-invalidation",
      title: "On-demand revalidation, cache tags, and invalidation",
      durationMinutes: 20,
      explanation: `
Time-based revalidation is useful when you can accept a freshness window. But sometimes the application knows exactly when data changes.

For example, an administrator edits product 42. Waiting for a five-minute cache period may be unnecessary. The application can invalidate the affected data after the mutation.

This is **on-demand revalidation**.

### revalidatePath

\`revalidatePath\` is useful when you want to invalidate cached data associated with a route path.

For example, after changing products, you may want the products page to be refreshed.

### revalidateTag

Tags provide a more data-oriented invalidation strategy. A fetch or cached operation can be associated with a tag such as \`products\`. After a mutation, the application can invalidate that tag.

This is useful when the same data is consumed by multiple routes.

### Cache tags

Imagine product data is used on:
- \`/products\`;
- \`/products/42\`;
- \`/admin/products\`.

Invalidating only one path may not express the real data dependency. A shared \`products\` tag can describe the underlying data more directly.

### Invalidation should follow mutations

A useful pattern is:

1. change the source of truth;
2. invalidate the affected cached data;
3. redirect or refresh the relevant UI;
4. let the next read obtain fresh data.

The exact API semantics can vary with the Next.js version and caching model, so always verify the current documentation when implementing advanced cache behavior.
      `,
      diagram: `
Mutation
  |
  v
Database / API updated
  |
  +----------------------+
  |                      |
revalidatePath       revalidateTag
  |                      |
  v                      v
specific route       shared data tag
  |                      |
  +----------+-----------+
             |
             v
       next read gets
       refreshed data
      `,
      codeExample: {
        title: "Invalidating a path or tag after a mutation",
        code: `import {
  revalidatePath,
  revalidateTag,
} from "next/cache";

export async function updateProduct(id: string) {
  // Update the source of truth first.
  await updateProductInDatabase(id);

  // Invalidate a specific page.
  revalidatePath(\`/products/\${id}\`);

  // Or invalidate shared product data.
  revalidateTag("products");
}`,
      },
      keyTakeaways: [
        "On-demand revalidation is useful when the application knows that data changed.",
        "revalidatePath expresses invalidation around a route path.",
        "revalidateTag expresses invalidation around shared data.",
        "Cache invalidation should happen after the source of truth has been successfully updated.",
      ],
      commonMistakes: [
        "Invalidating before the database mutation succeeds.",
        "Using one broad tag for unrelated data.",
        "Assuming invalidating a path and invalidating a data tag always have identical effects.",
      ],
      quiz: [
        {
          question: "When is a cache tag especially useful?",
          options: [
            "When the same underlying data is used by multiple routes.",
            "Only for CSS.",
            "Only for client-side state.",
            "When no data is cached.",
          ],
          correctIndex: 0,
          explanation:
            "Tags let you invalidate a shared data concept instead of tying invalidation to only one URL.",
        },
      ],
    },

    {
      id: "cache-invalidation-design",
      title: "Designing a reliable cache invalidation strategy",
      durationMinutes: 18,
      explanation: `
The hardest part of caching is often not enabling it. It is deciding when cached information must stop being trusted.

A cache invalidation strategy should be designed around the data's ownership and mutation paths.

### Source of truth

The database or authoritative external service is usually the source of truth. A cache is a copy or reusable representation.

The mutation should update the source of truth first. Only after a successful mutation should the application invalidate related cached data.

### Granularity

Invalidate as narrowly as practical.

If only product 42 changed, invalidating every page in the application may be unnecessary. On the other hand, if a shared category structure changed, several pages may legitimately need invalidation.

### User-specific data

Be particularly careful with user-specific information. The invalidation model should not accidentally make private information reusable across users.

### Debugging stale data

When a user reports "I changed it but still see the old value," investigate:
1. Did the mutation reach the source of truth?
2. Was the relevant cache invalidated?
3. Was the correct path/tag used?
4. Is another cache layer involved?
5. Is the browser displaying old client state?

Caching can exist at multiple levels, so debugging requires identifying which layer owns the stale value.
      `,
      diagram: `
Source of truth
     |
     v
  Database
     |
     v
Server-side cache
     |
     v
Rendered UI
     |
     v
Browser/client state

Mutation
   |
   +--> update DB
   |
   +--> invalidate affected cache
   |
   +--> refresh/re-render UI
      `,
      codeExample: {
        title: "A mutation with focused invalidation",
        code: `import { revalidateTag } from "next/cache";

export async function renameCategory(
  categoryId: string,
  name: string
) {
  await updateCategory(categoryId, name);

  // Invalidate data that depends on categories.
  revalidateTag("categories");
}`,
      },
      keyTakeaways: [
        "The source of truth should be updated before invalidation.",
        "Invalidate the smallest meaningful set of cached data.",
        "User-specific data requires especially careful cache design.",
        "When debugging stale data, identify every cache layer involved.",
      ],
      commonMistakes: [
        "Invalidating everything after every mutation.",
        "Forgetting that browser state can make a server cache appear stale.",
        "Treating a cache as the source of truth.",
      ],
      quiz: [
        {
          question: "What should normally happen first in a mutation flow?",
          options: [
            "Invalidate every cache.",
            "Update the source of truth successfully.",
            "Delete the browser.",
            "Clear every user's session.",
          ],
          correctIndex: 1,
          explanation:
            "The authoritative data should be changed successfully before related cached representations are invalidated.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What problem does caching primarily solve?",
      options: [
        "It avoids unnecessary repeated work when data can be reused.",
        "It removes the need for a database.",
        "It guarantees data is always newest.",
        "It replaces authentication.",
      ],
      correctIndex: 0,
      explanation:
        "Caching can reduce repeated work and improve response performance when reuse is safe.",
    },
    {
      question: "What is time-based revalidation?",
      options: [
        "A browser polling loop.",
        "A freshness strategy where cached data is refreshed according to a time window.",
        "A database transaction.",
        "A React event handler.",
      ],
      correctIndex: 1,
      explanation:
        "Time-based revalidation gives cached data a defined freshness strategy.",
    },
    {
      question: "What is revalidatePath intended to express?",
      options: [
        "Invalidation associated with a route path.",
        "A database migration.",
        "Client-side state replacement.",
        "An HTTP authentication mechanism.",
      ],
      correctIndex: 0,
      explanation:
        "revalidatePath is used for path-oriented cache invalidation/revalidation.",
    },
    {
      question: "Why use cache tags?",
      options: [
        "To associate reusable data with a shared invalidation concept.",
        "To style HTML.",
        "To create React keys.",
        "To encrypt API responses.",
      ],
      correctIndex: 0,
      explanation:
        "Tags are useful when the same underlying data is consumed from multiple places.",
    },
    {
      question: "What is a dangerous caching mistake?",
      options: [
        "Caching public documentation.",
        "Reusing private user-specific data in an inappropriate shared cache.",
        "Using a five-minute freshness window for product categories.",
        "Invalidating after a successful mutation.",
      ],
      correctIndex: 1,
      explanation:
        "Private data must never be accidentally reused as shared data.",
    },
  ],

  project: {
    name: "Product cache and revalidation lab",
    goal: "Build a product management flow that demonstrates time-based and on-demand cache invalidation.",
    brief:
      "Create a product list and product details page backed by cached data. Add an admin-style mutation that updates a product and invalidates the appropriate path or tag.",
    steps: [
      "Create a product data function using fetch.",
      "Add a sensible time-based revalidation period.",
      "Associate related product data with a cache tag.",
      "Build a product details route.",
      "Create a mutation that updates product information.",
      "Invalidate the affected path and/or shared product tag after a successful mutation.",
      "Test the difference between stale cached data and invalidated data.",
      "Document why your chosen invalidation granularity is appropriate.",
    ],
    acceptance: [
      "Product data uses a deliberate caching strategy.",
      "A time-based revalidation strategy is demonstrated.",
      "At least one cache tag is used meaningfully.",
      "A successful mutation triggers focused invalidation.",
      "The project explains why the selected cache strategy is safe.",
    ],
    stretch: [
      "Use separate tags for products and categories.",
      "Add an admin dashboard that edits products and invalidates multiple dependent data sets.",
      "Document every cache layer involved in a stale-data debugging scenario.",
    ],
  },
};
