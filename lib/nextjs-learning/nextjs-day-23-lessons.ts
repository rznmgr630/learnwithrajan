import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_23_LESSONS: LessonDay = {
  day: 23,
  title: "Middleware / Proxy and Request Control",
  totalMinutes: 53,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "23-proxy",
      title: "The current Proxy model and request-time routing logic",
      durationMinutes: 18,
      explanation: "Current Next.js App Router documentation uses a root-level `proxy.ts` file for request interception. Older Next.js material commonly calls this feature Middleware, so it is important to recognize both terms when reading existing code.\n\nProxy can inspect an incoming request and make an early decision: continue, redirect, or rewrite. It is useful for broad request-level concerns such as authentication redirects, locale routing, feature gates, and request metadata.\n\nProxy should remain lightweight. It is not a replacement for your service layer, database authorization, or business logic. The actual operation still needs server-side authentication and authorization.\n\nA matcher controls which paths invoke Proxy. This lets you target protected areas without unnecessarily running request logic for every asset or route.",
      diagram: "Browser\n  |\n  v\nproxy.ts\n  |\n  +--> redirect\n  +--> rewrite\n  +--> continue\n  |\n  v\nRoute / Server Component / Route Handler",
      codeExample: {
        title: "Basic proxy authentication redirect",
        code: "// proxy.ts\nimport { NextResponse } from \"next/server\";\nimport type { NextRequest } from \"next/server\";\n\nexport function proxy(request: NextRequest) {\n  const hasSession = Boolean(request.cookies.get(\"session\")?.value);\n\n  if (\n    request.nextUrl.pathname.startsWith(\"/dashboard\") &&\n    !hasSession\n  ) {\n    const loginUrl = new URL(\"/login\", request.url);\n    loginUrl.searchParams.set(\"next\", request.nextUrl.pathname);\n\n    return NextResponse.redirect(loginUrl);\n  }\n\n  return NextResponse.next();\n}\n\nexport const config = {\n  matcher: [\"/dashboard/:path*\"],\n};"
      },
      keyTakeaways: [
  "Current Next.js documentation uses `proxy.ts` for this request interception model.",
  "Proxy can redirect, rewrite, or continue a request.",
  "Keep Proxy focused on request-level concerns.",
  "Use matcher rules to limit execution."
],
      commonMistakes: [
  "Using outdated Middleware examples without checking the Next.js version.",
  "Putting database-heavy business logic in Proxy.",
  "Treating Proxy as the only authorization layer.",
  "Running Proxy on unnecessary paths."
],
      quiz: [
  {
    "question": "What file convention is current Next.js using for request interception?",
    "options": [
      "proxy.ts",
      "request.ts",
      "auth.ts",
      "server.ts"
    ],
    "correctIndex": 0,
    "explanation": "Current Next.js documentation uses proxy.ts."
  },
  {
    "question": "What is a matcher used for?",
    "options": [
      "Selecting paths where Proxy runs",
      "Hashing passwords",
      "Creating tables",
      "Rendering CSS"
    ],
    "correctIndex": 0,
    "explanation": "Matchers limit the paths handled by Proxy."
  }
]
    },
    {
      id: "23-routing",
      title: "Redirects, rewrites, headers, and cookies",
      durationMinutes: 18,
      explanation: "A redirect tells the browser to go to another URL. A rewrite internally maps a request to a different destination while the browser can continue showing the original URL.\n\nThis distinction is useful for login redirects, legacy route migrations, localization, and internal route organization.\n\nProxy can inspect request headers and cookies and can return a response with headers or cookies. Be careful when turning user-controlled request values into trusted behavior.\n\nAuthentication flows often use a `next` or `returnTo` parameter. Such a value must be validated so that attackers cannot turn your login endpoint into an open redirect.",
      diagram: "Redirect:\n /old -> proxy -> /new\n Browser URL changes.\n\nRewrite:\n /legacy -> proxy -> /profile\n Browser can remain on /legacy.",
      codeExample: {
        title: "Redirect and rewrite",
        code: "import { NextResponse } from \"next/server\";\n\nexport function proxy(request: NextRequest) {\n  if (request.nextUrl.pathname === \"/old-dashboard\") {\n    return NextResponse.redirect(\n      new URL(\"/dashboard\", request.url)\n    );\n  }\n\n  if (request.nextUrl.pathname === \"/legacy-profile\") {\n    return NextResponse.rewrite(\n      new URL(\"/profile\", request.url)\n    );\n  }\n\n  const response = NextResponse.next();\n  response.headers.set(\"x-request-layer\", \"proxy\");\n\n  return response;\n}"
      },
      keyTakeaways: [
  "Redirects normally change the browser URL.",
  "Rewrites internally map requests.",
  "Headers and cookies are request/response data and must be handled carefully.",
  "Redirect destinations must be validated."
],
      commonMistakes: [
  "Confusing redirect and rewrite.",
  "Trusting arbitrary `next` values.",
  "Copying untrusted headers into security decisions.",
  "Putting business authorization in Proxy."
],
      quiz: [
  {
    "question": "What normally changes the browser URL?",
    "options": [
      "Rewrite",
      "Redirect",
      "Header",
      "Cookie"
    ],
    "correctIndex": 1,
    "explanation": "A redirect sends the browser to another URL."
  },
  {
    "question": "Why validate a `next` parameter?",
    "options": [
      "To prevent open redirects",
      "To speed up CSS",
      "To create JWTs",
      "To disable cookies"
    ],
    "correctIndex": 0,
    "explanation": "Unchecked destinations can redirect users to attacker-controlled sites."
  }
]
    },
    {
      id: "23-boundary",
      title: "What belongs in Proxy versus the server layer",
      durationMinutes: 17,
      explanation: "A practical boundary is: Proxy handles cheap request-level decisions; Server Components, Server Actions, Route Handlers, services, and repositories handle application and data security.\n\nProxy can quickly say that an unauthenticated request should go to login. A Server Component can authenticate before loading private data. A Server Action can authenticate and authorize before a mutation. A Route Handler can do the same before returning API data.\n\nThis layered design matters because users can bypass navigation and call endpoints directly. The application must remain secure even when the client is completely untrusted.\n\nThink of Proxy as an early routing guard, not the final source of truth for permissions.",
      diagram: "Request\n  |\n proxy.ts\n  |\n  +--> Server Component\n  +--> Server Action\n  +--> Route Handler\n          |\n       auth + authorization\n          |\n       service\n          |\n       database",
      codeExample: {
        title: "Layered protection",
        code: "export async function deleteAccount() {\n  const user = await requireUser();\n\n  if (!can(user.role, \"account:delete\")) {\n    throw new ForbiddenError();\n  }\n\n  await accountService.deleteAccount(user.id);\n}\n\n// Proxy may redirect obvious unauthenticated\n// dashboard requests, but the mutation above\n// still protects itself on the server."
      },
      keyTakeaways: [
  "Proxy and server authorization have different responsibilities.",
  "Security must survive client bypass.",
  "Use server-only identity helpers.",
  "Centralize business authorization in reusable server code."
],
      commonMistakes: [
  "Assuming Proxy approval means an operation is authorized.",
  "Putting database queries in Proxy.",
  "Skipping checks because a page is protected.",
  "Implementing different rules for different entry points."
],
      quiz: [
  {
    "question": "Where should the final authorization check for a mutation occur?",
    "options": [
      "CSS",
      "Server operation/data boundary",
      "Only Proxy",
      "Only browser state"
    ],
    "correctIndex": 1,
    "explanation": "The actual server operation must enforce authorization."
  },
  {
    "question": "Why keep Proxy lightweight?",
    "options": [
      "It is intended for request-level concerns",
      "It cannot inspect requests",
      "It is a database",
      "It only works in development"
    ],
    "correctIndex": 0,
    "explanation": "Keeping the request layer focused avoids mixing routing and business logic."
  }
]
    },
  ],
  finalQuiz: [
  {
    "question": "What is the current request-interception file convention?",
    "options": [
      "proxy.ts",
      "request.ts",
      "auth.ts",
      "server.ts"
    ],
    "correctIndex": 0,
    "explanation": "Current Next.js documentation uses proxy.ts."
  },
  {
    "question": "What does a rewrite do?",
    "options": [
      "Internally maps a request to another resource",
      "Deletes data",
      "Hashes passwords",
      "Changes TypeScript"
    ],
    "correctIndex": 0,
    "explanation": "A rewrite internally maps the request."
  },
  {
    "question": "Should Proxy be the only authorization layer?",
    "options": [
      "Yes",
      "No",
      "Only for APIs",
      "Only in development"
    ],
    "correctIndex": 1,
    "explanation": "Server operations must still enforce authorization."
  }
],
  project: {
  "name": "Protected request routing layer",
  "goal": "Build a current Next.js proxy.ts layer for request control while keeping real security checks in server operations.",
  "brief": "Protect dashboard routes, implement safe redirects, demonstrate a legacy rewrite, and prove that APIs still enforce authorization independently.",
  "steps": [
    "Create a root-level proxy.ts.",
    "Configure matcher rules.",
    "Redirect unauthenticated dashboard requests.",
    "Validate the local return path.",
    "Add a legacy-route rewrite.",
    "Add a response header for observability.",
    "Keep database authorization in server operations.",
    "Test direct API calls that bypass the UI."
  ],
  "acceptance": [
    "Protected routes redirect unauthenticated users.",
    "Matcher rules are scoped.",
    "Legacy routes rewrite correctly.",
    "Return paths cannot become external redirects.",
    "Server operations authenticate and authorize independently."
  ],
  "stretch": [
    "Add locale routing.",
    "Add maintenance mode.",
    "Add a feature flag for selected routes."
  ]
}
};
