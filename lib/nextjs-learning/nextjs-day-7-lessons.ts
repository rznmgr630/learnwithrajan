import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_7_LESSONS: LessonDay = {
  day: 7,
  title: "Client Components",
  totalMinutes: 76,
  difficulty: "Beginner",
  lessons: [
    {
      id: "use-client",
      title: `"use client" and the Client Component boundary`,
      durationMinutes: 16,
      explanation: `The \`"use client"\` directive tells Next.js that a module should be treated as a <b>Client Component entry point</b>. It must appear at the top of the file, before imports.

You need a Client Component when the component requires browser-side behavior such as state, event handlers, effects, or browser APIs. Without the client boundary, those features cannot be used in a Server Component.

An important detail is that \`"use client"\` applies to the module and its imported component graph. You do not normally need to put \`"use client"\` in every child component.

This is why the directive should be used as low in the component tree as practical. If only a button is interactive, make the button the client boundary rather than converting the entire page.`,
      diagram: `Server Component
      |
      +--> Product content
      |
      +--> "use client"
              |
              +--> Button
              +--> useState
              +--> onClick
              |
              +--> child components

The client boundary begins at the file
containing "use client".`,
      codeExample: {
        title: "A small Client Component",
        code: `"use client";

import { useState } from "react";

export default function FavoriteButton() {
  const [favorite, setFavorite] = useState(false);

  return (
    <button onClick={() => setFavorite(!favorite)}>
      {favorite ? "Favorited" : "Add to favorites"}
    </button>
  );
}`,
      },
      keyTakeaways: [
        "`use client` creates a Client Component entry point.",
        "It must appear before imports.",
        "Client Components can use state, event handlers, effects, and browser APIs.",
        "You do not need `use client` in every child component.",
        "Keep client boundaries as small as practical.",
      ],
      commonMistakes: [
        "<b>Putting `use client` after imports.</b> The directive must be at the top of the module.",
        "<b>Adding it to every file.</b> This removes the benefit of keeping non-interactive code on the server.",
        "<b>Thinking it means only one function runs in the browser.</b> The boundary also affects imported dependencies.",
      ],
      quiz: [
        {
          question: "Where should `use client` appear?",
          options: [
            "After the imports",
            "Inside the component",
            "At the top of the file before imports",
            "Inside `package.json`",
          ],
          correctIndex: 2,
          explanation: "It is a module directive and must be placed before imports.",
        },
        {
          question: "Why should client boundaries usually be small?",
          options: [
            "To prevent routing",
            "To avoid unnecessary browser JavaScript",
            "To disable React hooks",
            "To prevent server rendering",
          ],
          correctIndex: 1,
          explanation: "Only the interactive part needs to become client-side.",
        },
      ],
    },
    {
      id: "when-to-use-client-components",
      title: "When to use Client Components",
      durationMinutes: 16,
      explanation: `Use a Client Component when the UI needs <b>interaction that must happen in the browser</b>. Common examples include buttons that change state, controlled form inputs, tabs, dialogs, drag-and-drop interfaces, and components using browser-only APIs.

You should not choose Client Components simply because a component "looks dynamic." Dynamic data can still be fetched and rendered by a Server Component.

For example, a dashboard showing today's orders can be a Server Component even though the order list changes over time. A filter dropdown that changes visible results immediately in the browser may need client-side state.

The key question is: <b>Does this component need browser-side state, event handling, effects, or browser APIs?</b> If not, start with a Server Component.`,
      diagram: `Does the component need...

State? --------------------> Client
onClick/onChange? ----------> Client
useEffect? -----------------> Client
window/localStorage? -------> Client
Browser-only library? ------> Usually Client

Only fetch/render data? ----> Server
Only static presentation? --> Server`,
      codeExample: {
        title: "Server data with a client-side filter",
        code: `// Server Component
export default async function ProductsPage() {
  const products = await getProducts();

  return <ProductFilter products={products} />;
}

// Client Component
"use client";

import { useState } from "react";

export default function ProductFilter({
  products,
}: {
  products: { id: string; name: string }[];
}) {
  const [query, setQuery] = useState("");

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {filtered.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </>
  );
}`,
      },
      keyTakeaways: [
        "Use Client Components for browser-side interaction.",
        "Dynamic server data does not automatically require a Client Component.",
        "State, event handlers, effects, and browser APIs are common reasons to use one.",
        "Ask what browser behavior the component needs before adding `use client`.",
      ],
      commonMistakes: [
        "<b>Using `use client` because data changes.</b> Changing data and browser interactivity are different concerns.",
        "<b>Making a complete dashboard client-side for one filter.</b> Isolate the filter.",
        "<b>Using `useEffect` just to fetch initial server data.</b> Prefer server-side data fetching when the data can be loaded on the server.",
      ],
      quiz: [
        {
          question: "Does changing database data automatically require a Client Component?",
          options: [
            "Yes, always",
            "No, server-rendered data can still be dynamic",
            "Only when using PostgreSQL",
            "Only when using TypeScript",
          ],
          correctIndex: 1,
          explanation: "Server Components can fetch and render dynamic data on the server.",
        },
        {
          question: "Which is a clear reason to use a Client Component?",
          options: [
            "Rendering a heading",
            "Reading a database",
            "Handling `onChange` for an interactive input",
            "Formatting a date",
          ],
          correctIndex: 2,
          explanation: "An event handler requires browser-side JavaScript.",
        },
      ],
    },
    {
      id: "browser-apis-and-event-handlers",
      title: "Browser APIs and event handlers",
      durationMinutes: 15,
      explanation: `The browser provides APIs that do not exist in a normal server environment. Examples include \`window\`, \`document\`, \`navigator\`, \`localStorage\`, and some media or clipboard APIs.

If a component directly uses one of these APIs during rendering or interaction, it belongs behind a Client Component boundary.

Event handlers have the same rule. \`onClick\`, \`onChange\`, \`onSubmit\`, and similar handlers describe behavior that happens in the browser. A Server Component cannot attach these handlers directly.

You can still pass ordinary data from a Server Component into a Client Component. The client component receives the data as props and then uses it for browser-side interaction.`,
      diagram: `Server Component
     |
     | serializable props
     v
Client Component
     |
     +--> onClick
     +--> window
     +--> localStorage
     +--> navigator
     +--> document`,
      codeExample: {
        title: "Reading localStorage in a Client Component",
        code: `"use client";

import { useEffect, useState } from "react";

export default function ThemePreference() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");

    if (saved) {
      setTheme(saved);
    }
  }, []);

  function saveTheme(nextTheme: string) {
    setTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
  }

  return (
    <button onClick={() => saveTheme(theme === "light" ? "dark" : "light")}>
      Theme: {theme}
    </button>
  );
}`,
      },
      keyTakeaways: [
        "Browser APIs are available in Client Components.",
        "Event handlers such as `onClick` require client-side JavaScript.",
        "Browser globals such as `window` and `localStorage` should not be accessed directly in Server Components.",
        "Server Components can pass serializable data into Client Components.",
      ],
      commonMistakes: [
        "<b>Calling `window.localStorage` while a Server Component renders.</b> `window` does not exist on the server.",
        "<b>Trying to attach `onClick` in a Server Component.</b> Move the interactive element into a Client Component.",
        "<b>Assuming every browser API must be used in `useEffect`.</b> The important requirement is that the code executes on the client.",
      ],
      quiz: [
        {
          question: "Which API is browser-only?",
          options: [
            "`window.localStorage`",
            "`Array.map()`",
            "`JSON.stringify()`",
            "String methods",
          ],
          correctIndex: 0,
          explanation: "localStorage is provided by the browser.",
        },
        {
          question: "Where should an `onClick` handler live?",
          options: [
            "Server Component",
            "Client Component",
            "Database model",
            "next.config.ts",
          ],
          correctIndex: 1,
          explanation: "Event handlers execute in the browser.",
        },
      ],
    },
    {
      id: "hooks-and-avoiding-unnecessary-client",
      title: "Hooks and avoiding unnecessary Client Components",
      durationMinutes: 15,
      explanation: `Many React hooks are associated with Client Components because they support browser-side interaction and component state. Common examples include \`useState\`, \`useEffect\`, \`useReducer\`, \`useRef\`, and \`useContext\` when used for interactive client state.

The important point is not to memorize a rule that "all hooks are client hooks." Instead, understand what the hook is doing. If the behavior requires a browser lifecycle, user interaction, or persistent client state, it belongs in a Client Component.

Avoid making a parent component client-side just because one child needs a hook. Extract the interactive child and keep the parent on the server whenever possible.

This pattern improves both architecture and performance because the server can continue handling data fetching while only the interactive subtree needs client JavaScript.`,
      diagram: `Large Server Component
       |
       +--> Static content
       |
       +--> Data table
       |
       +--> Client SearchBox
       |       |
       |       +--> useState
       |
       +--> Client Modal
               |
               +--> useState
               +--> useEffect

Only interactive subtrees cross the boundary.`,
      codeExample: {
        title: "Extracting a hook into a small Client Component",
        code: `// app/settings/page.tsx
import NotificationToggle from "@/components/NotificationToggle";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <main>
      <h1>Settings</h1>
      <p>{settings.email}</p>

      <NotificationToggle initialEnabled={settings.notifications} />
    </main>
  );
}

// components/NotificationToggle.tsx
"use client";

import { useState } from "react";

export default function NotificationToggle({
  initialEnabled,
}: {
  initialEnabled: boolean;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);

  return (
    <button onClick={() => setEnabled((value) => !value)}>
      Notifications: {enabled ? "On" : "Off"}
    </button>
  );
}`,
      },
      keyTakeaways: [
        "Hooks that depend on client interaction belong in Client Components.",
        "Do not move an entire page client-side just because one child uses a hook.",
        "Extract interactive controls into focused Client Components.",
        "Server Components can provide initial data as props to Client Components.",
      ],
      commonMistakes: [
        "<b>Making the page client-side because one toggle uses `useState`.</b> Extract the toggle.",
        "<b>Duplicating server data fetching in `useEffect`.</b> If the data can be loaded on the server, let the server do it.",
        "<b>Creating a giant Client Component.</b> Split interactive features into focused components.",
      ],
      quiz: [
        {
          question: "What is the better approach when one button needs `useState` on an otherwise server-rendered page?",
          options: [
            "Convert the whole page to a Client Component",
            "Remove the button",
            "Extract the button into a Client Component",
            "Move the state into SQL",
          ],
          correctIndex: 2,
          explanation: "The smallest useful client boundary keeps the rest of the page server-side.",
        },
        {
          question: "What can a Server Component pass to a Client Component?",
          options: [
            "Arbitrary server functions",
            "Serializable data as props",
            "Database connections",
            "Private environment variables",
          ],
          correctIndex: 1,
          explanation: "Data crossing the boundary needs to be representable in the client component's props.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What does `use client` create?",
      options: [
        "A database connection",
        "A Client Component entry boundary",
        "A route handler",
        "A server-only module",
      ],
      correctIndex: 1,
      explanation: "It marks the module as a Client Component entry point.",
    },
    {
      question: "Which feature normally requires a Client Component?",
      options: [
        "Server-side database access",
        "Rendering static text",
        "An `onClick` event handler",
        "Formatting an object",
      ],
      correctIndex: 2,
      explanation: "Event handlers execute in the browser.",
    },
    {
      question: "Which is a browser API?",
      options: [
        "`window.localStorage`",
        "`Array.map()`",
        "`Promise`",
        "`JSON.parse()`",
      ],
      correctIndex: 0,
      explanation: "localStorage is provided by the browser.",
    },
    {
      question: "Why should you avoid unnecessary Client Components?",
      options: [
        "They cannot render HTML",
        "They can increase the amount of JavaScript sent to the browser",
        "They cannot receive props",
        "They cannot use TypeScript",
      ],
      correctIndex: 1,
      explanation: "A larger client boundary can increase browser-side JavaScript and reduce the benefits of server-first rendering.",
    },
    {
      question: "What is a good way to handle one interactive toggle on a server-rendered settings page?",
      options: [
        "Make the entire page client-side",
        "Extract the toggle into a small Client Component",
        "Move the toggle to a database trigger",
        "Use `useState` in the Server Component",
      ],
      correctIndex: 1,
      explanation: "Isolating the interactive control keeps the server/client boundary focused.",
    },
  ],
  project: {
    name: "Interactive settings page",
    goal: "Build a server-rendered settings page with small Client Components for interactive controls.",
    brief: "Create a settings page that loads account information on the server and includes interactive notification, theme, and preference controls on the client.",
    steps: [
      "Create the settings page as a Server Component.",
      "Load initial settings from a server-side function.",
      "Create a Client Component for a notification toggle.",
      "Create a Client Component that reads and writes a browser preference.",
      "Add an interactive form control using an event handler.",
      "Keep the main page free of `use client`.",
      "Inspect the component tree and identify the client boundaries.",
    ],
    acceptance: [
      "The settings page remains a Server Component.",
      "Interactive controls use Client Components.",
      "At least one browser API is used from client-side code.",
      "Hooks such as `useState` are used inside a Client Component.",
      "The client boundary is not larger than necessary.",
    ],
    stretch: [
      "Add a client-side modal for changing a preference.",
      "Persist one preference in localStorage.",
      "Create a reusable client-side toggle component.",
    ],
  },
};
