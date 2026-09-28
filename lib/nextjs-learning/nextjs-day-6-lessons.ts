import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_6_LESSONS: LessonDay = {
  day: 6,
  title: "Server Components",
  totalMinutes: 78,
  difficulty: "Beginner",
  lessons: [
    {
      id: "what-server-components-are",
      title: "What Server Components are and why they exist",
      durationMinutes: 16,
      explanation: `A <b>Server Component</b> is a React component that Next.js can render on the server instead of sending the component's JavaScript to the browser. In the App Router, components are Server Components by default.

This does not mean that the HTML is generated once and never changes. A Server Component can run again for a request or navigation and can use server-side data while producing the UI that React sends to the browser.

The important idea is that your application does not need to make every component interactive. A product page may need to display database data, while only its search box or button needs browser-side JavaScript.

Server Components exist partly to let you keep non-interactive work on the server. This can reduce the amount of JavaScript sent to the browser and lets server-side code stay close to databases, files, environment variables, and other backend resources.

Think of a Server Component as a component whose implementation is allowed to stay on the server. The browser receives the resulting UI representation, not the component's server-only implementation.`,
      diagram: `Browser request
      |
      v
Next.js server
      |
      +--> Server Component
      |      |
      |      +--> database / filesystem / private API
      |
      v
Rendered UI
      |
      v
Browser

Server Component code does not need to become browser JavaScript.`,
      codeExample: {
        title: "A simple Server Component",
        code: `// app/products/page.tsx

import { getProducts } from "@/lib/products";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main>
      <h1>Products</h1>

      {products.map((product) => (
        <article key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price}</p>
        </article>
      ))}
    </main>
  );
}

// No "use client" is needed.
// This component can fetch data on the server.`,
      },
      keyTakeaways: [
        "Server Components are the default component type in the Next.js App Router.",
        "They can run server-side code without shipping that implementation to the browser.",
        "They are useful for data fetching, database access, and non-interactive UI.",
        "Not every component needs to be interactive.",
        "Server Components can reduce the amount of client JavaScript your page needs.",
      ],
      commonMistakes: [
        "<b>Thinking Server Components mean static HTML only.</b> They can still render dynamic data on the server.",
        "<b>Adding `use client` to every component.</b> Only interactive or browser-dependent components need it.",
        "<b>Thinking Server Components run in the user's browser.</b> Their implementation is executed on the server.",
      ],
      quiz: [
        {
          question: "What is the default component type in the Next.js App Router?",
          options: [
            "Client Component",
            "Server Component",
            "Static Component",
            "Browser Component",
          ],
          correctIndex: 1,
          explanation: "A component becomes a Client Component only when you explicitly create a client boundary with `use client`.",
        },
        {
          question: "Why can Server Components be useful for database access?",
          options: [
            "The browser becomes a database server",
            "The database credentials are sent to the browser",
            "The component can access the database on the server without exposing that implementation to the browser",
            "React automatically converts SQL into HTML",
          ],
          correctIndex: 2,
          explanation: "Server-side execution lets sensitive server resources remain on the server.",
        },
      ],
    },
    {
      id: "server-vs-client-components",
      title: "Server vs Client Components",
      durationMinutes: 17,
      explanation: `The biggest difference between Server and Client Components is not simply where the HTML appears. The important difference is <b>where the component's JavaScript is allowed to run</b> and what APIs the component can use.

A Server Component is the default. It is a good fit for reading data, rendering content, and accessing server-only resources. A Client Component is used when the component needs browser-side behavior such as state, event handlers, effects, or browser APIs.

For example, a product details page can remain a Server Component while an Add to Cart button is a Client Component. The page can fetch the product on the server, while the button handles the user's click in the browser.

This gives you a useful architectural rule: start on the server, then move only the interactive part into the client.`,
      diagram: `                 App
                  |
        +---------+---------+
        |                   |
        v                   v
  Server Component    Client Component
        |                   |
   fetch data          useState()
   DB access            onClick
   private APIs        browser APIs
        |                   |
        +---------+---------+
                  |
               UI output`,
      codeExample: {
        title: "Server page with a small Client Component",
        code: `// app/products/[id]/page.tsx
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>

      <AddToCartButton productId={product.id} />
    </main>
  );
}

// components/AddToCartButton.tsx
"use client";

import { useState } from "react";

export default function AddToCartButton({
  productId,
}: {
  productId: string;
}) {
  const [added, setAdded] = useState(false);

  return (
    <button onClick={() => setAdded(true)}>
      {added ? "Added" : "Add to cart"}
    </button>
  );
}`,
      },
      keyTakeaways: [
        "Server Components are the default in the App Router.",
        "Client Components are for browser-side interactivity and APIs.",
        "A Server Component can render a Client Component.",
        "A Client Component does not automatically mean the entire application must become client-side.",
        "Prefer the smallest possible client boundary.",
      ],
      commonMistakes: [
        "<b>Making an entire page client-side because one button needs state.</b> Keep the page on the server and isolate the button.",
        "<b>Using browser APIs in a Server Component.</b> APIs such as `window` and `localStorage` belong in client-side code.",
        "<b>Assuming Server Components cannot render Client Components.</b> They commonly compose together.",
      ],
      quiz: [
        {
          question: "Which component should normally contain an `onClick` handler?",
          options: [
            "Server Component",
            "Client Component",
            "Layout only",
            "Route Handler",
          ],
          correctIndex: 1,
          explanation: "Event handlers require browser-side JavaScript, so the component must be inside a client boundary.",
        },
        {
          question: "What is a good default architecture for a mostly static product page with one interactive button?",
          options: [
            "Make the entire page a Client Component",
            "Make the entire app client-side",
            "Keep the page on the server and make only the button a Client Component",
            "Move the product data into localStorage",
          ],
          correctIndex: 2,
          explanation: "This keeps the client boundary small and preserves server-side data fetching.",
        },
      ],
    },
    {
      id: "server-component-boundaries",
      title: "Component boundaries and server-only code",
      durationMinutes: 17,
      explanation: `A <b>component boundary</b> is the point where Next.js separates server-side code from client-side code. The boundary becomes especially important when a Client Component imports another module: that module is now part of the client-side dependency graph.

This is why \`"use client"\` should be placed deliberately. It is not just a command saying "run this function in the browser." It establishes a boundary for the module and its imported dependencies.

Server-only code includes things such as database queries, filesystem access, private environment variables, and backend SDKs that should never be exposed to the browser.

A useful habit is to keep server-only operations in clearly named modules such as \`lib/server/\` and keep interactive UI in \`components/\`. In larger applications, the \`server-only\` package can also be used to make accidental imports fail during development/build time.

The goal is not to avoid Client Components completely. The goal is to prevent server-only implementation details from crossing the boundary accidentally.`,
      diagram: `app/page.tsx
    |
    +--> Server Component
    |       |
    |       +--> lib/server/products.ts
    |               |
    |               +--> database
    |
    +--> components/SearchBox.tsx
            |
            +--> "use client"
                    |
                    +--> browser APIs
                    +--> state/events

       SERVER | CLIENT
--------------|----------------
 database     | useState
 secrets      | onClick
 filesystem   | window
 private SDK  | localStorage`,
      codeExample: {
        title: "Protecting a server-only module",
        code: `// lib/server/products.ts
import "server-only";

import { db } from "@/lib/db";

export async function getProducts() {
  return db.product.findMany();
}

// app/products/page.tsx
import { getProducts } from "@/lib/server/products";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

// Do not import lib/server/products.ts from a Client Component.`,
      },
      keyTakeaways: [
        "A `use client` directive creates a client boundary.",
        "Imported modules can become part of the client dependency graph.",
        "Database access, private secrets, and server SDKs should stay on the server.",
        "The `server-only` package can help catch accidental server-to-client imports.",
        "Clear folder boundaries make architecture easier to understand.",
      ],
      commonMistakes: [
        "<b>Importing a database module into a Client Component.</b> The dependency boundary is now wrong.",
        "<b>Reading private environment variables from browser code.</b> Secrets must remain server-side.",
        "<b>Putting server and client responsibilities in one huge component.</b> Split the component around the interaction boundary.",
      ],
      quiz: [
        {
          question: "What does a Client Component boundary affect?",
          options: [
            "Only CSS",
            "The JavaScript dependency graph that can run on the client",
            "Only the URL",
            "Only database indexes",
          ],
          correctIndex: 1,
          explanation: "Modules imported through a client boundary can become part of the browser-side bundle.",
        },
        {
          question: "What is `server-only` useful for?",
          options: [
            "Making every component interactive",
            "Preventing accidental use of a server-only module from client code",
            "Creating API routes",
            "Replacing React",
          ],
          correctIndex: 1,
          explanation: "It helps make an architectural mistake visible during development or build.",
        },
      ],
    },
    {
      id: "benefits-and-limitations",
      title: "Benefits, limitations, and when Server Components fit",
      durationMinutes: 15,
      explanation: `Server Components provide several practical benefits. They can keep database and backend access on the server, reduce client JavaScript, and let data fetching happen close to the resources that provide the data.

They also have limitations. A Server Component cannot use browser-only APIs such as \`window\` or \`localStorage\`, and it cannot directly attach browser event handlers such as \`onClick\`. React state and other client-side hooks that require browser interaction belong inside a Client Component.

The right question is not "Should my app use Server Components or Client Components?" A real Next.js application normally uses both. The architectural question is which parts need server execution and which parts need browser interaction.

A strong default is: <b>render data-heavy and non-interactive UI on the server, and isolate interactive behavior into small Client Components.</b>`,
      diagram: `Need database/private API?
        |
       YES
        |
   Server Component
        |
        +---- Need click/state/browser API?
                    |
                   YES
                    |
             Small Client Component

Need neither?
        |
        v
Start with Server Component`,
      codeExample: {
        title: "A practical server-first component tree",
        code: `// ProductPage        -> Server Component
// ProductDetails     -> Server Component
// ProductReviews     -> Server Component
// QuantitySelector   -> Client Component
// AddToCartButton    -> Client Component

export default async function ProductPage() {
  const product = await getProduct();

  return (
    <>
      <ProductDetails product={product} />
      <ProductReviews productId={product.id} />

      <QuantitySelector />
      <AddToCartButton productId={product.id} />
    </>
  );
}`,
      },
      keyTakeaways: [
        "Server Components can reduce the amount of browser JavaScript.",
        "They are a strong fit for data-heavy, non-interactive UI.",
        "They cannot directly use browser-only APIs or event handlers.",
        "Most real applications use both Server and Client Components.",
        "Start server-first and add client boundaries where interaction requires them.",
      ],
      commonMistakes: [
        "<b>Treating Server Components as universally better.</b> Interactive UI still needs client-side code.",
        "<b>Treating every hook as server-compatible.</b> Hooks that depend on browser interaction belong in Client Components.",
        "<b>Creating large client boundaries.</b> Large boundaries can send more JavaScript than necessary.",
      ],
      quiz: [
        {
          question: "Which feature requires a Client Component?",
          options: [
            "Reading a database on the server",
            "Rendering a static heading",
            "Handling a browser click with `onClick`",
            "Formatting a server-fetched string",
          ],
          correctIndex: 2,
          explanation: "Event handlers need browser-side JavaScript.",
        },
        {
          question: "What is the recommended starting point for most App Router components?",
          options: [
            "Start as Client Components",
            "Start as Server Components and add client boundaries when needed",
            "Start as static HTML",
            "Start as API routes",
          ],
          correctIndex: 1,
          explanation: "The App Router is server-first by default, and this keeps interactive JavaScript focused.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the default component type in the App Router?",
      options: [
        "Client Component",
        "Server Component",
        "Browser Component",
        "Static Component",
      ],
      correctIndex: 1,
      explanation: "Components are Server Components by default unless you introduce a client boundary.",
    },
    {
      question: "Why would you keep database access in a Server Component?",
      options: [
        "To expose the database to the browser",
        "To keep server-side data access and credentials on the server",
        "To make every component interactive",
        "To remove React from the application",
      ],
      correctIndex: 1,
      explanation: "Server execution keeps backend resources away from the browser.",
    },
    {
      question: "Which feature normally requires a Client Component?",
      options: [
        "Database querying",
        "Rendering a product title",
        "Using `onClick` and `useState`",
        "Reading a server environment variable",
      ],
      correctIndex: 2,
      explanation: "Interactive browser behavior belongs in the client.",
    },
    {
      question: "What is the main purpose of keeping the client boundary small?",
      options: [
        "To create more routes",
        "To avoid sending unnecessary JavaScript to the browser",
        "To disable Server Components",
        "To replace layouts",
      ],
      correctIndex: 1,
      explanation: "A focused boundary lets the rest of the UI remain server-rendered.",
    },
    {
      question: "What should you do when a mostly server-rendered page needs one interactive control?",
      options: [
        "Make the entire page a Client Component",
        "Move all data into localStorage",
        "Keep the page server-side and isolate the interactive control in a Client Component",
        "Turn the page into a Route Handler",
      ],
      correctIndex: 2,
      explanation: "This is one of the most useful server-first composition patterns.",
    },
  ],
  project: {
    name: "Server-rendered product catalog",
    goal: "Build a product page that keeps data fetching on the server while isolating interactive behavior in small Client Components.",
    brief: "Create a product catalog with a server-rendered product list, product details, and reviews. Add a client-side quantity selector and Add to Cart interaction without turning the whole page into a Client Component.",
    steps: [
      "Create a product list page as a Server Component.",
      "Fetch product data from a server-side module.",
      "Create a dynamic product details route using `[id]`.",
      "Keep product and review rendering in Server Components.",
      "Create a Client Component for quantity selection.",
      "Create a Client Component for Add to Cart behavior.",
      "Verify that server-only modules are not imported by Client Components.",
    ],
    acceptance: [
      "Product data is fetched from a Server Component.",
      "Interactive controls use Client Components.",
      "The main product page does not contain `use client`.",
      "Server-only code is isolated from browser code.",
      "The application clearly demonstrates the difference between server and client responsibilities.",
    ],
    stretch: [
      "Add a server-side search form and keep only the interactive input client-side.",
      "Add optimistic cart feedback with a small Client Component.",
      "Use `server-only` to protect a database access module.",
    ],
  },
};
