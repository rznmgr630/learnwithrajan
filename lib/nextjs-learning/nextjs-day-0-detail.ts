import type { RoadmapDayDetail } from "@/lib/challenge-data";

const en = (text: string) => ({ en: text, np: text, jp: text });

export const NEXTJS_DAY_0_DETAIL: RoadmapDayDetail = {
  overview: [
    en("<b>Not part of the 11-day course.</b> This is a readiness check before you start. Next.js sits between React, JavaScript and TypeScript, browsers, HTTP, servers, APIs, databases, and deployment."),
    en("You do not need expert knowledge of every topic below. You need enough foundation to understand what Next.js is solving when it introduces an abstraction."),
  ],
  sections: [
    {
      title: en("1. React fundamentals"),
      blocks: [
        {
          type: "paragraph",
          text: en("Next.js is built on React. Be comfortable splitting UI into small functional components, composing them, passing props, using `children`, choosing component boundaries, conditionally rendering UI, and rendering multiple components. A `UserCard` is easier to reuse, test, and change than one huge component that owns every part of a page."),
        },
        {
          type: "code",
          title: en("A reusable component receives data through props"),
          code: `type User = { name: string; email: string };

function UserCard({ user }: { user: User }) {
  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </article>
  );
}`,
        },
        {
          type: "list",
          items: [
            en("Functional components, composition, reusable presentational components, and logic-heavy components."),
            en("JSX syntax, expressions, attributes, `className`, fragments, conditional JSX, and lists. JSX becomes JavaScript. It is not HTML itself."),
            en("Props, `children`, default values, and the difference between data coming into a component and data owned by it."),
          ],
        },
      ],
    },
    {
      title: en("2. Props, state, and one-way data flow"),
      blocks: [
        {
          type: "paragraph",
          text: en("Props are data passed into a component. State is data the component owns and changes. Learn parent-to-child communication, lifting state up, derived state, state ownership, and avoiding duplicated state."),
        },
        {
          type: "code",
          title: en("Props and local state solve different problems"),
          code: `function Counter({ initialCount = 0 }: { initialCount?: number }) {
  const [count, setCount] = useState(initialCount);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`,
        },
        {
          type: "paragraph",
          text: en("Use state as the source of truth. If a value can be calculated from props or existing state during render, it is usually derived state and does not need a second `useState` call."),
        },
      ],
    },
    {
      title: en("3. Hooks and effects"),
      blocks: [
        {
          type: "paragraph",
          text: en("Know the purpose of `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, and `useContext`. Follow the Hook rules, understand dependency arrays, cleanup functions, effect lifecycle, referential equality, stable references, and custom hooks."),
        },
        {
          type: "paragraph",
          text: en("<b>`useEffect` deserves extra care.</b> An effect synchronizes React with something outside React, such as a subscription, browser event, timer, or network request. It is not a general place for code that happens after a render. Know when not to use it, plus cleanup and race-condition basics."),
        },
        {
          type: "code",
          title: en("Subscribe and clean up an external connection"),
          code: `useEffect(() => {
  const unsubscribe = chat.subscribe(roomId, onMessage);
  return unsubscribe;
}, [roomId]);`,
        },
      ],
    },
    {
      title: en("4. Component identity, lists, forms, and context"),
      blocks: [
        {
          type: "paragraph",
          text: en("React preserves or resets state based on a component's position and identity in the tree. Conditional rendering and `key` values can intentionally reset state. This becomes useful later with Next.js layouts and routing."),
        },
        {
          type: "code",
          title: en("Keys represent identity, not position"),
          code: `users.map((user) => <UserCard key={user.id} user={user} />)

// A changed userId deliberately creates a fresh form state.
<Form key={userId} />`,
        },
        {
          type: "list",
          items: [
            en("Use stable keys for arrays. Array indexes can attach state to the wrong item when items are inserted, deleted, or reordered."),
            en("Know controlled inputs: `value` and `onChange` make React state the source of truth. Know uncontrolled inputs: `defaultValue` and a ref let the DOM hold the current value."),
            en("Know how to create, provide, and consume context. Context is useful for stable cross-cutting values like theme, locale, or auth, but is not automatically a global-state solution."),
          ],
        },
      ],
    },
    {
      title: en("5. Custom hooks, performance, React 19, and the compiler"),
      blocks: [
        {
          type: "paragraph",
          text: en("Custom hooks extract reusable stateful behavior, not rendered UI. Understand hook naming, composition, state and effects inside hooks, and returning values or functions without making a hook too complicated."),
        },
        {
          type: "code",
          title: en("A custom hook shares behavior"),
          code: `function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}`,
        },
        {
          type: "list",
          items: [
            en("Understand re-rendering, reconciliation, expensive calculations, `React.memo`, `useMemo`, `useCallback`, and stable references. Measure first, find the bottleneck, then optimize the real problem."),
            en("Know the purpose of React 19 APIs: `useActionState`, `useOptimistic`, `useTransition`, `useEffectEvent`, Actions, Form Actions, and Suspense. Awareness is enough before Day 1."),
            en("Know that the React Compiler can automate many memoization cases. Do not assume `useMemo` and `useCallback` are obsolete. Rendering, identity, memoization, and compiler bailouts still matter."),
          ],
        },
      ],
    },
    {
      title: en("6. Modern JavaScript"),
      blocks: [
        {
          type: "list",
          items: [
            en("Variables and scope: `let`, `const`, block scope, function scope, closures, hoisting, and the Temporal Dead Zone."),
            en("Functions: declarations, expressions, arrow functions, parameters, defaults, rest parameters, spread syntax, higher-order functions, and callbacks."),
            en("Objects and arrays: property access, destructuring, nested values, immutability, and the difference between mutating and non-mutating operations."),
            en("Be comfortable with `map`, `filter`, `find`, `findIndex`, `some`, `every`, `reduce`, `includes`, and `sort`."),
          ],
        },
        {
          type: "paragraph",
          text: en("Closures are especially important. A function can retain access to values from its surrounding scope. This explains many React event-handler, effect, timer, async-operation, and stale-closure bugs."),
        },
        {
          type: "code",
          title: en("A closure retains `count`"),
          code: `function createCounter() {
  let count = 0;
  return () => ++count;
}`,
        },
      ],
    },
    {
      title: en("7. Modules and asynchronous JavaScript"),
      blocks: [
        {
          type: "paragraph",
          text: en("Understand `export`, `export default`, `import`, named exports, default exports, re-exports, module boundaries, relative and absolute imports, and dynamic imports. This prepares you for `dynamic()` and code splitting."),
        },
        {
          type: "list",
          items: [
            en("Know synchronous execution, Promises, `async`, `await`, Promise states, and error propagation."),
            en("Know `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any`. Use sequential requests when the second requires the first result. Use `Promise.all` for independent requests to avoid data-fetching waterfalls."),
            en("Know the event loop at a high level: call stack, Web APIs or runtime, task queue, microtask queue, Promises, timers, and execution order."),
          ],
        },
        {
          type: "code",
          title: en("Run independent work in parallel"),
          code: `const [user, posts] = await Promise.all([
  getUser(),
  getPosts(),
]);`,
        },
      ],
    },
    {
      title: en("8. Fetch, cancellation, and TypeScript"),
      blocks: [
        {
          type: "paragraph",
          text: en("Be comfortable with Fetch requests and responses: methods, headers, body, JSON, HTTP errors, network errors, and cancellation. Check `response.ok` before treating a response as success."),
        },
        {
          type: "code",
          title: en("Fetch safely and cancel unnecessary work"),
          code: `const controller = new AbortController();
const response = await fetch("/api/users", { signal: controller.signal });

if (!response.ok) throw new Error("Failed to fetch users");
const users = await response.json();

// Call when a search, navigation, or long request is no longer needed.
controller.abort();`,
        },
        {
          type: "list",
          items: [
            en("Know primitive, array, object, function, interface, type alias, optional, literal, union, and intersection types."),
            en("Know generics for reusable components, API responses, utility functions, service layers, and hooks."),
            en("Know narrowing with `typeof`, `instanceof`, `in`, type guards, discriminated unions, nullable values, and `unknown`. Avoid `any` where possible."),
            en("Know utility types: `Partial`, `Required`, `Pick`, `Omit`, `Record`, `Readonly`, `ReturnType`, `Parameters`, and `Awaited`. Understand inference, annotations, `as`, and `satisfies`. Assertions can hide bugs."),
          ],
        },
      ],
    },
    {
      title: en("9. HTTP, cookies, storage, same-origin policy, and CORS"),
      blocks: [
        {
          type: "paragraph",
          text: en("HTTP is one of the most important prerequisites for Next.js. A request has a method, URL, headers, cookies, and body. A response has a status code, headers, cookies, and body."),
        },
        {
          type: "list",
          items: [
            en("Know `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, and `HEAD`. In common API language: GET retrieves, POST creates or acts, PUT replaces, PATCH partially updates, and DELETE removes."),
            en("Know status-code groups: 2xx success, 3xx redirect, 4xx request problem, 5xx server problem. Recognize 200, 201, 204, 301, 302, 304, 400, 401, 403, 404, 409, 422, 429, 500, 502, and 503. `401` means not authenticated; `403` means authenticated but not authorized."),
            en("Know headers including `Content-Type`, `Accept`, `Authorization`, `Cookie`, `Set-Cookie`, `Cache-Control`, `Location`, `ETag`, `Origin`, and `User-Agent`."),
            en("Know cookies, `HttpOnly`, `Secure`, `SameSite`, expiration, domain, and path. `HttpOnly` means browser JavaScript cannot read the cookie directly."),
            en("Know `localStorage`, `sessionStorage`, and cookies. Authentication credentials do not automatically belong in `localStorage`."),
            en("Know that an origin is scheme + host + port. CORS is a browser security mechanism for cross-origin requests, not a general server-to-server restriction. Understand preflights, `OPTIONS`, credentials, and `Access-Control-Allow-Origin`."),
          ],
        },
      ],
    },
    {
      title: en("10. Browser rendering and browser APIs"),
      blocks: [
        {
          type: "paragraph",
          text: en("Understand the high-level browser rendering path: HTML → DOM → CSSOM → render tree → layout → paint → composite. Know the difference between rendering, layout, paint, JavaScript execution, and hydration."),
        },
        {
          type: "paragraph",
          text: en("Know the DOM, events and event bubbling, `window`, `document`, `location`, `history`, `localStorage`, and `sessionStorage`. Browser-only APIs cannot simply run in a Server Component because the server has no browser window or document."),
        },
      ],
    },
    {
      title: en("11. Auth, REST APIs, rendering, databases, and environment variables"),
      blocks: [
        {
          type: "paragraph",
          text: en("Authentication answers <b>who are you?</b> Know session and cookie authentication, tokens, JWT, OAuth, and OpenID Connect awareness. Authorization answers <b>what are you allowed to do?</b> Know roles, permissions, RBAC, resource ownership, route authorization, and API authorization."),
        },
        {
          type: "paragraph",
          text: en("Know REST resources, endpoints, HTTP methods, status codes, JSON, pagination, filtering, sorting, search, and error responses. REST is an architectural style, not simply an API that returns JSON."),
        },
        {
          type: "list",
          items: [
            en("Know CSR: browser JavaScript fetches data and renders UI. Know SSR: the server fetches data and generates HTML. Know static generation: the build generates HTML for a CDN. Hydration connects server-rendered HTML to React behavior in the browser."),
            en("Know relational data: tables, rows, columns, primary keys, foreign keys, relationships, one-to-one, one-to-many, and many-to-many. Know basic SQL: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `JOIN`, `WHERE`, `ORDER BY`, `GROUP BY`, and `LIMIT`. Recognize indexes, transactions, connection pooling, query performance, and N+1 queries."),
            en("Know `.env`, `.env.local`, `.env.development`, and `.env.production`. `NEXT_PUBLIC_*` variables are sent to the client and must be treated as public. Never put secrets there."),
          ],
        },
      ],
    },
    {
      title: en("12. Tools, Node.js, and the client-server mental model"),
      blocks: [
        {
          type: "list",
          items: [
            en("Be comfortable with Git branches, commits, pull requests, merge or rebase, `.gitignore`, npm, `package.json`, lockfiles, dependency installation, semantic versioning, and `dependencies` versus `devDependencies`."),
            en("Use browser DevTools: Elements for DOM/CSS/layout, Console for JavaScript, Network for requests/responses/headers/cookies/timing/payloads, Application for browser storage, and Performance for long tasks and rendering traces."),
            en("Know Node.js runtime basics: npm, `package.json`, environment variables, file-system awareness, HTTP server concepts, `process.env`, and the difference between browser and Node APIs."),
          ],
        },
        {
          type: "code",
          title: en("The core model to carry into Day 1"),
          code: `User
  ↓
Browser ── HTTP request ──► Next.js server ──► Services / Database
  ▲                              │
  └────── HTTP response ─────────┘

Server Components: server logic and data fetching
Client Components: browser interactions and React hooks
Route Handlers: HTTP endpoints for clients and services`,
        },
        {
          type: "paragraph",
          text: en("You do <b>not</b> need to master Next.js caching, Server Component internals, Server Actions, middleware or proxy architecture, Edge runtime, Webpack or Turbopack internals, Redis, Docker, Kubernetes, AWS, advanced PostgreSQL, distributed systems, WebSockets, or OpenTelemetry yet. Those belong in the course."),
        },
      ],
    },
  ],
  faq: [
    {
      question: en("When is Phase 0 complete?"),
      answer: en("When React, JavaScript and TypeScript, browser, web, and server fundamentals stop being the thing you are learning. You should be ready to focus on the Next.js-specific decisions in the course."),
      tag: en("Readiness check"),
    },
  ],
};
