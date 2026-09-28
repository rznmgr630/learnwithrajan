import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_8_LESSONS: LessonDay = {
  day: 8,
  title: "Server vs Client Architecture",
  totalMinutes: 86,
  difficulty: "Beginner",
  lessons: [
    {
      id: "composition-patterns",
      title: "Composition patterns for Server and Client Components",
      durationMinutes: 18,
      explanation: `The most useful way to think about Server and Client Components is as two different kinds of building blocks that can be composed together.

A Server Component can render a Client Component. The Client Component can receive data as props and provide the interactive behavior. This lets the server own data fetching while the browser owns interaction.

A common architecture is to keep the page and data-heavy sections on the server and extract small interactive controls such as search inputs, tabs, filters, menus, and buttons into Client Components.

Composition also means you should avoid turning a parent into a Client Component just because a child is interactive. The parent can remain a Server Component and include the client child.

This server-first composition pattern is one of the main architectural ideas behind the App Router.`,
      diagram: `DashboardPage (Server)
       |
       +--> Header (Server)
       |
       +--> Metrics (Server)
       |
       +--> RevenueChart (Client)
       |
       +--> RecentOrders (Server)
       |
       +--> FilterBar (Client)

Server owns data.
Client owns interaction.`,
      codeExample: {
        title: "Server page composed with interactive client pieces",
        code: `// app/dashboard/page.tsx
import FilterBar from "@/components/FilterBar";
import RevenueChart from "@/components/RevenueChart";

export default async function DashboardPage() {
  const dashboard = await getDashboardData();

  return (
    <main>
      <h1>Dashboard</h1>

      <FilterBar initialRange="30d" />

      <section>
        <RevenueChart data={dashboard.revenue} />
      </section>

      <section>
        <h2>Recent Orders</h2>
        {dashboard.orders.map((order) => (
          <p key={order.id}>{order.customerName}</p>
        ))}
      </section>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "Server and Client Components are designed to compose together.",
        "Keep data fetching and non-interactive UI on the server.",
        "Extract interactive controls into Client Components.",
        "A Client Component does not force its parent to become a Client Component.",
        "Think in terms of boundaries instead of choosing one rendering model for the entire page.",
      ],
      commonMistakes: [
        "<b>Making the entire dashboard client-side because the chart is interactive.</b> Isolate the chart.",
        "<b>Putting all data fetching into the client.</b> Server-side fetching can often simplify the architecture.",
        "<b>Creating client boundaries around static sections.</b> Keep them on the server.",
      ],
      quiz: [
        {
          question: "Can a Server Component render a Client Component?",
          options: [
            "No",
            "Yes",
            "Only inside a layout",
            "Only with a database",
          ],
          correctIndex: 1,
          explanation: "This is one of the core composition patterns in the App Router.",
        },
        {
          question: "What should usually remain on the server in a dashboard?",
          options: [
            "Every button",
            "Data fetching and non-interactive sections",
            "All browser APIs",
            "Every event handler",
          ],
          correctIndex: 1,
          explanation: "The server is a natural home for data access and non-interactive rendering.",
        },
      ],
    },
    {
      id: "server-to-client-data-flow",
      title: "Passing Server Components data into Client Components",
      durationMinutes: 17,
      explanation: `A common pattern is <b>Server → Client data flow</b>. The Server Component fetches the data and passes the result into a Client Component through props.

This is useful because the server can access databases and private APIs, while the Client Component receives only the data it needs for interaction.

The boundary should be intentional. Do not pass database clients, server functions, secrets, or other server-only objects into a Client Component. Pass data that can cross the boundary safely.

For example, a Server Component can fetch a user's dashboard metrics and pass an array of chart points to a Client Component that renders an interactive chart.`,
      diagram: `Database
   |
   v
Server Component
   |
   | safe serializable data
   v
Client Component
   |
   +--> state
   +--> events
   +--> interaction`,
      codeExample: {
        title: "Passing server-fetched data to a Client Component",
        code: `// Server Component
import SalesChart from "@/components/SalesChart";

export default async function DashboardPage() {
  const sales = await getSales();

  return (
    <main>
      <h1>Sales</h1>
      <SalesChart data={sales} />
    </main>
  );
}

// Client Component
"use client";

import { useState } from "react";

type Sale = {
  month: string;
  amount: number;
};

export default function SalesChart({ data }: { data: Sale[] }) {
  const [selectedMonth, setSelectedMonth] = useState(data[0]?.month);

  return (
    <div>
      <p>Selected: {selectedMonth}</p>

      {data.map((sale) => (
        <button
          key={sale.month}
          onClick={() => setSelectedMonth(sale.month)}
        >
          {sale.month}: {sale.amount}
        </button>
      ))}
    </div>
  );
}`,
      },
      keyTakeaways: [
        "Server Components can fetch data and pass it to Client Components as props.",
        "Pass only the data the client actually needs.",
        "Do not send secrets, database connections, or server-only objects across the boundary.",
        "This pattern keeps data access server-side while allowing rich browser interaction.",
      ],
      commonMistakes: [
        "<b>Passing a database client as a prop.</b> Database connections belong on the server.",
        "<b>Passing private credentials.</b> Anything needed by browser code should be treated as potentially visible to the user.",
        "<b>Sending an enormous server object.</b> Shape the data specifically for the client component.",
      ],
      quiz: [
        {
          question: "What is a normal way for a Server Component to provide data to a Client Component?",
          options: [
            "Pass it as props",
            "Pass the database connection",
            "Put credentials in props",
            "Import the database into the client",
          ],
          correctIndex: 0,
          explanation: "Server-fetched data can be passed to the client component as props when it can safely cross the boundary.",
        },
        {
          question: "What should not cross the server/client boundary?",
          options: [
            "A product name",
            "A chart data array",
            "A database connection",
            "A number",
          ],
          correctIndex: 2,
          explanation: "Server-only resources must stay on the server.",
        },
      ],
    },
    {
      id: "client-to-server-interactions",
      title: "Client → Server interactions",
      durationMinutes: 18,
      explanation: `The other direction is <b>Client → Server interaction</b>. A user can click a button, submit a form, or change a filter in the browser and cause server-side work to happen.

The browser should not directly connect to your database. Instead, the client can interact with your application through supported server-side mechanisms such as Server Actions, Route Handlers, or other application endpoints.

For forms and mutations, Server Actions can provide a convenient way to call server-side functions from React UI. The important architectural idea is that the browser requests an operation; the server remains responsible for authorization, validation, database access, and other trusted work.

Even when the UI is interactive, security checks must remain on the server. Never treat a client component's state as proof that a user is authorized to perform an operation.`,
      diagram: `User click
    |
    v
Client Component
    |
    | request / server action
    v
Server
    |
    +--> validate
    +--> authorize
    +--> database
    |
    v
result
    |
    v
Client UI`,
      codeExample: {
        title: "Client interaction calling a Server Action",
        code: `// app/products/actions.ts
"use server";

export async function addToCart(productId: string) {
  // Always validate and authorize on the server.
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await cartService.add(user.id, productId);
}

// components/AddToCartButton.tsx
"use client";

import { addToCart } from "@/app/products/actions";

export default function AddToCartButton({
  productId,
}: {
  productId: string;
}) {
  return (
    <button onClick={() => addToCart(productId)}>
      Add to cart
    </button>
  );
}`,
      },
      keyTakeaways: [
        "Client interactions can trigger server-side operations.",
        "Server Actions and Route Handlers are examples of mechanisms for client-to-server communication.",
        "Authorization and validation must happen on the server.",
        "The browser should not receive database credentials or connect directly to your database.",
        "Client state is not a security boundary.",
      ],
      commonMistakes: [
        "<b>Trusting a client-provided user ID.</b> Derive identity from authenticated server-side context.",
        "<b>Checking authorization only in the UI.</b> Hide buttons for UX, but enforce permission on the server.",
        "<b>Connecting the browser directly to the database.</b> Keep database access behind server-side application code.",
      ],
      quiz: [
        {
          question: "Where should authorization for a mutation be enforced?",
          options: [
            "Only in the button",
            "Only in CSS",
            "On the server",
            "Only in the browser URL",
          ],
          correctIndex: 2,
          explanation: "The server is the trusted boundary for authorization.",
        },
        {
          question: "What is a valid client-to-server mechanism in modern Next.js?",
          options: [
            "Direct database credentials in the browser",
            "Server Actions",
            "Importing Prisma into a Client Component",
            "Calling PostgreSQL directly from `onClick`",
          ],
          correctIndex: 1,
          explanation: "Server Actions provide a server-side function boundary for supported interactions.",
        },
      ],
    },
    {
      id: "avoiding-accidental-client-rendering",
      title: "Avoiding accidental client rendering",
      durationMinutes: 15,
      explanation: `One of the easiest architecture mistakes is adding \`"use client"\` too high in the component tree. A page might contain one interactive search field, but placing the client directive on the page can pull much more of the component tree into the client dependency graph.

Another mistake is importing a Client Component into a module that was intended to stay entirely server-side and then assuming every nearby component must also become client-side. The solution is to identify the actual interactive boundary.

A useful design process is to start with the page as a Server Component. Mark the specific UI that needs state, events, or browser APIs. Then move that UI into a focused Client Component and pass it the data it needs.

This approach also makes the application easier to reason about because each boundary has a clear responsibility.`,
      diagram: `Avoid:

"use client"
   |
   +--> entire dashboard
   +--> data table
   +--> metrics
   +--> navigation
   +--> one interactive filter

Prefer:

Dashboard (Server)
   |
   +--> Metrics (Server)
   +--> Orders (Server)
   +--> Filter (Client)`,
      codeExample: {
        title: "Keep the client boundary around the actual interaction",
        code: `// app/dashboard/page.tsx
import DashboardFilter from "@/components/DashboardFilter";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main>
      <DashboardMetrics data={data.metrics} />
      <DashboardFilter options={data.filterOptions} />
      <RecentOrders orders={data.orders} />
    </main>
  );
}

// components/DashboardFilter.tsx
"use client";

import { useState } from "react";

export default function DashboardFilter({
  options,
}: {
  options: string[];
}) {
  const [selected, setSelected] = useState(options[0]);

  return (
    <select
      value={selected}
      onChange={(event) => setSelected(event.target.value)}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}`,
      },
      keyTakeaways: [
        "Do not move a whole page to the client for one interactive feature.",
        "Start from a Server Component and identify the smallest useful client boundary.",
        "Pass only the data required by the interactive component.",
        "Component boundaries are architecture decisions, not just syntax decisions.",
      ],
      commonMistakes: [
        "<b>Putting `use client` in the page automatically.</b> First ask whether only a child needs it.",
        "<b>Passing the entire server response into every client component.</b> Shape props around the component's real needs.",
        "<b>Duplicating data fetching in every Client Component.</b> Fetch shared server data once when possible.",
      ],
      quiz: [
        {
          question: "What should you do when only a search filter needs browser state?",
          options: [
            "Make the whole page a Client Component",
            "Extract the filter into a Client Component",
            "Move the data into localStorage",
            "Remove the search",
          ],
          correctIndex: 1,
          explanation: "The smallest useful client boundary keeps the rest of the page server-side.",
        },
        {
          question: "Why is putting `use client` high in the tree potentially costly?",
          options: [
            "It disables routing",
            "It can cause more of the dependency graph to become client-side",
            "It disables TypeScript",
            "It prevents database queries",
          ],
          correctIndex: 1,
          explanation: "The client boundary can pull imported dependencies into the browser-side graph.",
        },
      ],
    },
    {
      id: "architecture-mistakes",
      title: "Common Server vs Client architecture mistakes",
      durationMinutes: 18,
      explanation: `Good Server/Client architecture is mostly about keeping responsibilities in the right place.

The first common mistake is <b>clientifying everything</b>: adding \`"use client"\` to a large page because one part is interactive. This can increase client JavaScript and move data fetching into the browser unnecessarily.

The second mistake is <b>serverifying interaction</b>: trying to use \`onClick\`, browser APIs, or client state in a Server Component. Those features belong behind a client boundary.

The third mistake is <b>trusting the client for security</b>. Client-side checks are useful for user experience, but authorization must happen again on the server.

The fourth mistake is <b>passing server-only values across the boundary</b>. Database connections, private credentials, and backend service clients should never become Client Component props.

Finally, avoid making the architecture complicated just to follow a rule. The goal is a clear boundary: server work stays server-side, browser interaction stays client-side, and the two communicate through deliberate data and action boundaries.`,
      diagram: `             Server
               |
      +--------+--------+
      |                 |
 data access        validation
 auth checks        database
      |                 |
      +--------+--------+
               |
        safe data / action
               |
               v
             Client
               |
       state / events
       browser APIs
       interaction

Security boundary = server`,
      codeExample: {
        title: "A balanced dashboard architecture",
        code: `// Server
export default async function DashboardPage() {
  const user = await requireUser();
  const dashboard = await getDashboard(user.id);

  return (
    <main>
      <DashboardSummary data={dashboard.summary} />
      <DateFilter initialRange="30d" />
      <DeleteAccountButton />
    </main>
  );
}

// Client: interactive filter
"use client";

export function DateFilter({
  initialRange,
}: {
  initialRange: string;
}) {
  // useState, event handlers, browser behavior...
}

// Client: destructive action UI
"use client";

export function DeleteAccountButton() {
  // Confirmation UI belongs in the client.
  // Authorization for the deletion belongs on the server.
}`,
      },
      keyTakeaways: [
        "Keep server responsibilities and client responsibilities explicit.",
        "Do not clientify the whole application because of isolated interaction.",
        "Do not try to use browser APIs or event handlers directly in Server Components.",
        "Never trust client-side authorization as the final security check.",
        "Keep server-only resources on the server.",
        "A good boundary makes the application easier to understand and maintain.",
      ],
      commonMistakes: [
        "<b>Using UI state as authorization.</b> A hidden button does not secure an operation.",
        "<b>Passing private services to the browser.</b> Server resources must remain behind the server boundary.",
        "<b>Making every component client-side.</b> This can create unnecessary JavaScript and weaker server/client separation.",
        "<b>Overengineering the boundary.</b> Start simple and introduce a client boundary only where the requirement exists.",
      ],
      quiz: [
        {
          question: "Where is the final authorization check for a destructive operation?",
          options: [
            "The button",
            "The CSS",
            "The server",
            "The browser's DOM",
          ],
          correctIndex: 2,
          explanation: "The server must enforce authorization because client code cannot be trusted.",
        },
        {
          question: "Which architecture is usually preferable?",
          options: [
            "Everything client-side",
            "Everything server-side, including clicks",
            "Server-rendered data with small Client Components for interaction",
            "Direct browser-to-database access",
          ],
          correctIndex: 2,
          explanation: "This architecture uses each rendering model for the responsibility it handles well.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the main composition pattern for Server and Client Components?",
      options: [
        "Client Components must contain the whole page",
        "Server Components can render focused Client Components",
        "Server Components cannot render Client Components",
        "Every component must use `use client`",
      ],
      correctIndex: 1,
      explanation: "A Server Component can fetch data and compose interactive Client Components into the page.",
    },
    {
      question: "How should server-fetched data normally reach a Client Component?",
      options: [
        "Through database credentials",
        "Through props containing appropriate data",
        "Through a database connection",
        "By importing the database client",
      ],
      correctIndex: 1,
      explanation: "Pass only the data the Client Component needs and that can safely cross the boundary.",
    },
    {
      question: "Where should authorization be enforced for a client-triggered mutation?",
      options: [
        "Only in the UI",
        "Only in the browser",
        "On the server",
        "Only in CSS",
      ],
      correctIndex: 2,
      explanation: "The server is the trusted security boundary.",
    },
    {
      question: "What should you do if one dashboard filter needs client state?",
      options: [
        "Make the whole dashboard a Client Component",
        "Extract the filter into a Client Component",
        "Move all data fetching to localStorage",
        "Connect the filter directly to the database",
      ],
      correctIndex: 1,
      explanation: "Keep the dashboard server-side and isolate the interactive filter.",
    },
    {
      question: "Which value should not be passed into a Client Component?",
      options: [
        "A product name",
        "A number",
        "A database connection",
        "An array of chart points",
      ],
      correctIndex: 2,
      explanation: "Database connections and other server-only resources must remain on the server.",
    },
  ],
  project: {
    name: "Product dashboard using both rendering models",
    goal: "Build a realistic product dashboard that combines Server Components for data-heavy UI with focused Client Components for browser interaction.",
    brief: "Create a dashboard with server-rendered product metrics, recent orders, and product data. Add client-side filters, an interactive chart, and a product action. Keep database access and authorization on the server while using Client Components only where interaction requires them.",
    steps: [
      "Create a dashboard page as a Server Component.",
      "Fetch product metrics and recent orders on the server.",
      "Render the main metrics and order list with Server Components.",
      "Create a Client Component for dashboard filters.",
      "Create an interactive Client Component for a chart or product selector.",
      "Create a client-side action button that triggers a server-side operation.",
      "Validate and authorize the server-side operation.",
      "Keep database access and private services in server-only modules.",
      "Review the final component tree and document each server/client boundary.",
    ],
    acceptance: [
      "The dashboard page remains a Server Component.",
      "Server-side data fetching is kept outside Client Components.",
      "At least two focused Client Components handle interaction.",
      "Client Components receive only the data they need.",
      "Server-side authorization is enforced for mutations.",
      "No database connection or secret is exposed to the client.",
      "The final architecture clearly demonstrates Server → Client data flow and Client → Server interaction.",
    ],
    stretch: [
      "Add URL-based filtering while keeping the filter UI interactive.",
      "Add optimistic UI for a product action.",
      "Split the dashboard into reusable server and client sections.",
      "Add a loading state and error boundary around an interactive dashboard section.",
    ],
  },
};
