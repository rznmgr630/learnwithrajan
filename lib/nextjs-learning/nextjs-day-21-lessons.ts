import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_21_LESSONS: LessonDay = {
  day: 21,
  title: "Authentication",
  totalMinutes: 53,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "21-auth-foundations",
      title: "Authentication fundamentals: identity, sessions, cookies, and JWT",
      durationMinutes: 18,
      explanation: "Authentication answers one question: **who is this user?** Authorization answers a different question: **what is this user allowed to do?** Keeping those responsibilities separate makes security easier to reason about.\n\nA common browser authentication flow is: the user proves an identity, the server creates a session, and the browser receives a credential that is sent on later requests. With a traditional session design, the browser stores an opaque session ID in an HTTP-only cookie while the server stores the session state.\n\nCookies have security attributes that matter. `HttpOnly` prevents normal browser JavaScript from reading the cookie. `Secure` restricts it to HTTPS in production. `SameSite` controls when the browser sends it in cross-site contexts. Expiration, path, and domain also affect its behavior.\n\nJWT (JSON Web Token) is a signed token format containing claims. A JWT can be verified without loading the complete session from a database, but signing does not make the payload secret. Never place passwords or other secrets in a JWT.\n\nFor a Next.js App Router application, the important architectural rule is that the server remains the security boundary. Client state can improve the UI, but protected data and mutations must be checked on the server.",
      diagram: "Browser\n  |\n  | credentials\n  v\nLogin endpoint\n  |\n  +--> verify password hash\n  |\n  +--> create session\n  |\n  v\nSet-Cookie: session=<opaque-id>\n  |\n  v\nLater request\n  |\n  v\nRead session -> identify user -> authorize",
      codeExample: {
        title: "Secure session cookie",
        code: "import { cookies } from \"next/headers\";\n\nconst cookieStore = await cookies();\n\ncookieStore.set(\"session\", sessionId, {\n  httpOnly: true,\n  secure: process.env.NODE_ENV === \"production\",\n  sameSite: \"lax\",\n  path: \"/\",\n  maxAge: 60 * 60 * 24 * 7,\n});"
      },
      keyTakeaways: [
  "Authentication establishes identity; authorization establishes permission.",
  "A session cookie can contain only an opaque session ID.",
  "JWT is a token format, not a complete security architecture.",
  "Protected data must be checked on the server."
],
      commonMistakes: [
  "Confusing authentication with authorization.",
  "Storing plaintext passwords.",
  "Putting secrets in a JWT payload.",
  "Treating client-side auth state as the security boundary."
],
      quiz: [
  {
    "question": "What question does authentication answer?",
    "options": [
      "Who is this user?",
      "What can this user delete?",
      "Which CSS should load?",
      "Which database index should be used?"
    ],
    "correctIndex": 0,
    "explanation": "Authentication establishes identity."
  },
  {
    "question": "What does HttpOnly prevent?",
    "options": [
      "All CSRF attacks",
      "Normal client-side JavaScript from reading the cookie",
      "The server from reading the cookie",
      "Cookie expiration"
    ],
    "correctIndex": 1,
    "explanation": "HttpOnly prevents normal browser JavaScript from accessing the cookie."
  }
]
    },
    {
      id: "21-providers",
      title: "Credentials authentication, OAuth, and Auth.js concepts",
      durationMinutes: 17,
      explanation: "Credentials authentication means your application receives an identifier and password, verifies the password against a secure password hash, and then creates an authenticated session.\n\nPasswords must never be stored in plaintext. Password hashing algorithms such as Argon2id or bcrypt are intentionally expensive to make large-scale guessing more difficult. The exact library and parameters should follow current security guidance.\n\nOAuth is a delegated authorization framework commonly used for external identity providers. The user authenticates with the provider, the provider redirects back to your application, and your application validates the callback before establishing its own application session.\n\nAuth.js provides authentication building blocks for Next.js applications, including providers, callbacks, sessions, and request integration. Exact APIs can change between versions, so the installed version's documentation should be treated as authoritative.\n\nA production authentication system also needs account recovery, email verification where appropriate, brute-force protection, session expiration and revocation, and careful error messages that do not reveal whether an account exists.",
      diagram: "Credentials:\nBrowser -> Login -> Verify password hash -> Session -> Cookie\n\nOAuth:\nBrowser -> Your app -> Provider\n                    |\n                    v\n                 callback\n                    |\n                    v\n               Local session",
      codeExample: {
        title: "Credential verification",
        code: "const user = await findUserByEmail(email);\n\nif (!user) {\n  return { error: \"Invalid email or password\" };\n}\n\nconst valid = await verifyPassword(password, user.passwordHash);\n\nif (!valid) {\n  return { error: \"Invalid email or password\" };\n}\n\nconst sessionId = await createSession(user.id);\nawait setSessionCookie(sessionId);"
      },
      keyTakeaways: [
  "Credentials authentication verifies a password hash.",
  "OAuth delegates the identity-provider part of the flow.",
  "Auth.js supplies reusable authentication infrastructure.",
  "Authentication needs lifecycle and abuse controls beyond the login form."
],
      commonMistakes: [
  "Comparing plaintext passwords.",
  "Returning different errors for unknown email versus wrong password.",
  "Skipping rate limiting on login.",
  "Assuming an auth library automatically handles authorization."
],
      quiz: [
  {
    "question": "How should a password normally be stored?",
    "options": [
      "Plaintext",
      "Inside a cookie",
      "As a password hash",
      "Inside a JWT"
    ],
    "correctIndex": 2,
    "explanation": "Passwords should be stored as secure password hashes."
  },
  {
    "question": "What is OAuth commonly used for?",
    "options": [
      "Database indexing",
      "Delegated identity/authorization flows with an external provider",
      "CSS compilation",
      "Image optimization"
    ],
    "correctIndex": 1,
    "explanation": "OAuth is commonly used with external identity providers."
  }
]
    },
    {
      id: "21-architecture",
      title: "Authentication architecture in Next.js",
      durationMinutes: 18,
      explanation: "A useful authentication architecture separates identity storage, session handling, request protection, and server-side identity access.\n\nKeep private authentication helpers in server-only modules when they access secrets, database connections, password hashing, or private session records. This makes accidental client exposure less likely.\n\nA protected Server Component can call `getCurrentUser()` before loading private data. A Server Action can independently authenticate before a mutation. A Route Handler must do the same before returning or changing protected API data.\n\nRequest-level Proxy can provide an early redirect for obviously unauthenticated requests, but it is not the final authorization boundary. The operation that actually reads or changes private data must enforce authentication and authorization itself.\n\nThe result is a layered system: request control improves flow, authentication establishes identity, authorization checks permission, and the service/data layer protects the actual resource.",
      diagram: "Request\n  |\n  v\nproxy.ts\n  |\n  v\nServer Component / Action / Route Handler\n  |\n  v\ngetCurrentUser()\n  |\n  v\nauthorize(user, action, resource)\n  |\n  v\nService\n  |\n  v\nDatabase",
      codeExample: {
        title: "Server-only current-user helper",
        code: "// app/lib/auth/current-user.ts\nimport \"server-only\";\n\nexport async function getCurrentUser() {\n  const sessionId = await readSessionCookie();\n  if (!sessionId) return null;\n\n  const session = await findValidSession(sessionId);\n  if (!session) return null;\n\n  return findUserById(session.userId);\n}\n\nexport async function requireUser() {\n  const user = await getCurrentUser();\n  if (!user) redirect(\"/login\");\n  return user;\n}"
      },
      keyTakeaways: [
  "Keep private auth logic on the server.",
  "Pages, actions, and APIs should enforce authentication independently.",
  "Proxy can improve request flow but is not the complete security boundary.",
  "Derive identity from the authenticated session rather than client-supplied IDs."
],
      commonMistakes: [
  "Protecting only the page while leaving its API open.",
  "Importing server-only auth helpers into Client Components.",
  "Trusting a hidden form field containing userId.",
  "Using UI visibility as authorization."
],
      quiz: [
  {
    "question": "Where should a protected mutation enforce authentication?",
    "options": [
      "Only in navigation",
      "On the server before the mutation",
      "Only in CSS",
      "Only in localStorage"
    ],
    "correctIndex": 1,
    "explanation": "The server must enforce authentication."
  },
  {
    "question": "Why can Proxy help with authentication?",
    "options": [
      "It can redirect early",
      "It hashes passwords",
      "It replaces the database",
      "It encrypts JWTs"
    ],
    "correctIndex": 0,
    "explanation": "Proxy can make early request-level routing decisions."
  }
]
    },
  ],
  finalQuiz: [
  {
    "question": "Authentication primarily establishes what?",
    "options": [
      "Identity",
      "Permissions",
      "CSS",
      "Database indexes"
    ],
    "correctIndex": 0,
    "explanation": "Authentication establishes identity."
  },
  {
    "question": "Which layer must protect private data?",
    "options": [
      "Only UI",
      "Server-side application/data access",
      "Only browser state",
      "Only Proxy"
    ],
    "correctIndex": 1,
    "explanation": "Private data must be protected server-side."
  },
  {
    "question": "What is JWT?",
    "options": [
      "A signed token format",
      "A database",
      "A React hook",
      "A cookie flag"
    ],
    "correctIndex": 0,
    "explanation": "JWT is a token format."
  }
],
  project: {
  "name": "Authentication-enabled SaaS foundation",
  "goal": "Build a small authentication system with credentials login, secure sessions, protected pages, and a clear OAuth/Auth.js integration point.",
  "brief": "Implement signup, login, logout, password hashing, secure cookies, a server-only current-user helper, and protected dashboard routes.",
  "steps": [
    "Create User and Session models.",
    "Implement signup with server-side validation and password hashing.",
    "Implement login with generic authentication errors.",
    "Create a secure session cookie.",
    "Create getCurrentUser() and requireUser().",
    "Protect dashboard and account settings on the server.",
    "Invalidate sessions on logout.",
    "Document where OAuth/Auth.js fits into the architecture."
  ],
  "acceptance": [
    "Passwords are never stored or logged in plaintext.",
    "Unauthenticated users cannot access protected server data.",
    "Session cookies use appropriate security attributes.",
    "Logout invalidates the session.",
    "Authentication and authorization remain separate concerns."
  ],
  "stretch": [
    "Add email verification.",
    "Add multi-device session management.",
    "Add an OAuth provider using the current Auth.js documentation.",
    "Add login rate limiting."
  ]
}
};
