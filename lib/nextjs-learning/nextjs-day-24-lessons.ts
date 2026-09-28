import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_24_LESSONS: LessonDay = {
  day: 24,
  title: "Next.js Security",
  totalMinutes: 73,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "24-injection",
      title: "XSS, CSRF, SQL injection, and validation",
      durationMinutes: 20,
      explanation: "Security starts with a simple rule: treat external input as untrusted. External input includes form fields, query parameters, cookies, headers, uploaded files, and data from third-party systems.\n\nXSS (Cross-Site Scripting) happens when attacker-controlled content becomes executable browser code. React escapes ordinary text rendering by default, but raw HTML APIs such as `dangerouslySetInnerHTML` require careful sanitization.\n\nSQL injection occurs when untrusted input changes the meaning of a SQL statement. Parameterized queries and safe ORM APIs keep data separate from SQL syntax.\n\nCSRF (Cross-Site Request Forgery) abuses a browser's automatic credential sending, especially cookie-based authentication. Modern `SameSite` cookies reduce some cross-site requests, but state-changing operations still need a CSRF strategy appropriate to the authentication architecture.\n\nServer-side validation is essential because an attacker can bypass every browser validation rule and send an HTTP request directly.",
      diagram: "Untrusted input\n      |\n      v\nServer validation\n      |\n      +--> safe rendering\n      +--> parameterized query\n      +--> CSRF protection\n      |\n      v\nBusiness logic",
      codeExample: {
        title: "Safe output and parameterized query",
        code: "// Normal React text is escaped.\nreturn <p>{comment.body}</p>;\n\n// Raw HTML requires careful sanitization.\n// Do not use this with arbitrary user input.\nreturn (\n  <div dangerouslySetInnerHTML={{ __html: trustedHtml }} />\n);\n\n// Use parameterized ORM/database APIs.\n// Avoid SQL string concatenation with request data.\nconst user = await db.user.findFirst({\n  where: { email: input.email },\n});"
      },
      keyTakeaways: [
  "Validate untrusted input on the server.",
  "Normal React text rendering escapes HTML.",
  "Use parameterized queries.",
  "CSRF protection must match the authentication architecture."
],
      commonMistakes: [
  "Assuming TypeScript validates runtime input.",
  "Rendering user content with raw HTML.",
  "Concatenating request data into SQL.",
  "Assuming CORS alone solves CSRF."
],
      quiz: [
  {
    "question": "What is XSS?",
    "options": [
      "Attacker-controlled content executing as browser code",
      "A database migration",
      "A cookie attribute",
      "A routing mode"
    ],
    "correctIndex": 0,
    "explanation": "XSS involves unintended execution of attacker-controlled browser code."
  },
  {
    "question": "What prevents SQL injection?",
    "options": [
      "String concatenation",
      "Parameterized queries",
      "Hidden buttons",
      "localStorage"
    ],
    "correctIndex": 1,
    "explanation": "Parameterized queries separate data from SQL syntax."
  }
]
    },
    {
      id: "24-auth-attacks",
      title: "Authentication, authorization, open redirects, and SSRF",
      durationMinutes: 19,
      explanation: "Authentication vulnerabilities include weak password storage, credential stuffing, session fixation, predictable tokens, and unsafe recovery flows.\n\nAuthorization vulnerabilities occur when an authenticated user can access something they should not. A common IDOR (Insecure Direct Object Reference) pattern is changing `/api/invoices/123` to `/api/invoices/124` and receiving another user's data because the server checked only that the user was logged in.\n\nOpen redirects occur when an attacker can control where your application redirects. A `next` or `returnTo` parameter should normally be restricted to a safe local path or an explicit allowlist.\n\nSSRF (Server-Side Request Forgery) occurs when an attacker can cause your server to request an attacker-selected URL. This can become serious because the server may reach internal services or cloud metadata endpoints that the browser cannot reach.",
      diagram: "Attacker\n  |\n  +--> changes resource ID\n  |        |\n  |        v\n  |    missing authz\n  |\n  +--> supplies external redirect\n  |        |\n  |        v\n  |    open redirect\n  |\n  +--> supplies internal URL\n           |\n           v\n         SSRF",
      codeExample: {
        title: "Safe local return path",
        code: "export function getSafeReturnPath(value: string | null) {\n  if (!value) return \"/dashboard\";\n\n  // Accept only local paths.\n  if (!value.startsWith(\"/\") || value.startsWith(\"//\")) {\n    return \"/dashboard\";\n  }\n\n  return value;\n}\n\n// /login?next=/dashboard/settings -> allowed\n// /login?next=https://evil.example -> rejected\n// /login?next=//evil.example -> rejected"
      },
      keyTakeaways: [
  "Authentication does not imply authorization.",
  "Every resource lookup needs the correct ownership/tenant check.",
  "Redirect destinations must be validated.",
  "Server-side URL fetching needs SSRF-aware validation and network controls."
],
      commonMistakes: [
  "Checking only whether the user is logged in.",
  "Trusting a resource ID without checking ownership.",
  "Redirecting to arbitrary URLs.",
  "Fetching user-provided URLs from the server without restrictions."
],
      quiz: [
  {
    "question": "What is an IDOR-style bug?",
    "options": [
      "Changing a resource ID and accessing another user's data because authorization is missing",
      "A CSS bug",
      "A database timeout",
      "A cookie expiry"
    ],
    "correctIndex": 0,
    "explanation": "The server must authorize access to the specific resource."
  },
  {
    "question": "Why is SSRF dangerous?",
    "options": [
      "The server may reach network resources the attacker cannot reach directly",
      "It only changes colors",
      "It only affects CSS",
      "It automatically encrypts requests"
    ],
    "correctIndex": 0,
    "explanation": "The server can have privileged network access."
  }
]
    },
    {
      id: "24-secrets",
      title: "Sensitive data, secure cookies, environment variables, and dependencies",
      durationMinutes: 18,
      explanation: "Sensitive data exposure often happens because secrets are logged, committed to source control, returned from APIs, or accidentally included in browser code.\n\nIn Next.js, variables prefixed with `NEXT_PUBLIC_` are intended to be available to client-side code. Database passwords, signing secrets, private API keys, and similar values should remain server-side.\n\nSecure cookies should be configured deliberately with attributes such as `HttpOnly`, `Secure`, `SameSite`, `Path`, and an appropriate lifetime.\n\nDependency security is also part of application security. Keep dependencies updated, review security advisories, remove unused packages, and keep your lockfile under version control.\n\nSecrets should come from deployment environment configuration or a secret manager rather than hardcoded source files.",
      diagram: "Source\n  |\n  +--> NEXT_PUBLIC_* --> browser\n  |\n  +--> server env ----> secrets\n                       |\n                       +--> database\n                       +--> auth\n                       +--> private APIs",
      codeExample: {
        title: "Environment variables and secure cookies",
        code: "const databaseUrl = process.env.DATABASE_URL;\nconst authSecret = process.env.AUTH_SECRET;\n\n// Browser-visible configuration:\nconst publicBase = process.env.NEXT_PUBLIC_API_BASE;\n\ncookieStore.set(\"session\", sessionId, {\n  httpOnly: true,\n  secure: process.env.NODE_ENV === \"production\",\n  sameSite: \"lax\",\n  path: \"/\",\n  maxAge: 60 * 60 * 24 * 7,\n});"
      },
      keyTakeaways: [
  "Do not expose secrets through NEXT_PUBLIC_* variables.",
  "Use secure cookie attributes appropriate to your threat model.",
  "Do not commit environment secrets.",
  "Dependency maintenance is a security task."
],
      commonMistakes: [
  "Putting DATABASE_URL in a NEXT_PUBLIC_* variable.",
  "Logging tokens for debugging.",
  "Committing .env.local.",
  "Assuming dependencies are safe forever."
],
      quiz: [
  {
    "question": "Which prefix indicates a browser-exposed environment variable?",
    "options": [
      "SECRET_",
      "PRIVATE_",
      "NEXT_PUBLIC_",
      "SERVER_"
    ],
    "correctIndex": 2,
    "explanation": "NEXT_PUBLIC_ variables are intended for client-side exposure."
  },
  {
    "question": "Should auth secrets be hardcoded?",
    "options": [
      "Yes",
      "Only locally",
      "No",
      "Only in Client Components"
    ],
    "correctIndex": 2,
    "explanation": "Secrets should come from secure environment/configuration."
  }
]
    },
    {
      id: "24-csp",
      title: "Security headers and Content Security Policy",
      durationMinutes: 16,
      explanation: "Security headers let browsers enforce additional protections. Common examples include Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, and clickjacking controls.\n\nCSP (Content Security Policy) restricts where scripts, styles, images, connections, and other resources may come from. A strong CSP can reduce the impact of XSS, but it does not replace safe output handling.\n\nCSP can become complex when an application uses third-party analytics, external images, fonts, APIs, inline styles, or nonces. Build the policy around the resources your application actually needs, then tighten it.\n\nTest security headers in a production-like environment because an overly strict policy can break legitimate functionality.",
      diagram: "Browser\n  ^\n  | enforced policy\n  |\nResponse headers\n  |\n  +--> CSP\n  +--> HSTS\n  +--> nosniff\n  +--> Referrer-Policy\n  +--> frame-ancestors / related controls",
      codeExample: {
        title: "Baseline security headers",
        code: "const response = NextResponse.next();\n\nresponse.headers.set(\n  \"X-Content-Type-Options\",\n  \"nosniff\"\n);\n\nresponse.headers.set(\n  \"Referrer-Policy\",\n  \"strict-origin-when-cross-origin\"\n);\n\nresponse.headers.set(\n  \"Content-Security-Policy\",\n  \"default-src 'self'; object-src 'none';\"\n);\n\nreturn response;"
      },
      keyTakeaways: [
  "Security headers provide browser-enforced defense in depth.",
  "CSP limits resource/script behavior.",
  "CSP does not replace safe rendering and validation.",
  "Test policies against real application resources."
],
      commonMistakes: [
  "Copying a CSP without understanding it.",
  "Allowing unsafe sources unnecessarily.",
  "Assuming CSP fixes all XSS.",
  "Testing only locally."
],
      quiz: [
  {
    "question": "What does CSP primarily control?",
    "options": [
      "Allowed browser resource/script behavior",
      "Database indexes",
      "Password hashing",
      "User roles"
    ],
    "correctIndex": 0,
    "explanation": "CSP is a browser-enforced resource policy."
  },
  {
    "question": "Does CSP replace safe output handling?",
    "options": [
      "Yes",
      "No",
      "Only for APIs",
      "Only for images"
    ],
    "correctIndex": 1,
    "explanation": "CSP is defense in depth, not a replacement for secure coding."
  }
]
    },
  ],
  finalQuiz: [
  {
    "question": "What is XSS?",
    "options": [
      "Attacker-controlled content executing as browser code",
      "A database transaction",
      "A cookie setting",
      "A route segment"
    ],
    "correctIndex": 0,
    "explanation": "XSS is unintended execution of attacker-controlled browser code."
  },
  {
    "question": "What prevents SQL injection?",
    "options": [
      "String concatenation",
      "Parameterized queries",
      "Hidden buttons",
      "localStorage"
    ],
    "correctIndex": 1,
    "explanation": "Parameterized queries keep data separate from SQL syntax."
  },
  {
    "question": "What is SSRF?",
    "options": [
      "Tricking a server into making a chosen network request",
      "A React rendering mode",
      "A password hash",
      "A cookie attribute"
    ],
    "correctIndex": 0,
    "explanation": "SSRF abuses server-side network access."
  },
  {
    "question": "What does CSP provide?",
    "options": [
      "A browser-enforced resource policy",
      "A password store",
      "A role system",
      "A SQL ORM"
    ],
    "correctIndex": 0,
    "explanation": "CSP restricts browser resource/script behavior."
  }
],
  project: {
  "name": "Next.js security hardening lab",
  "goal": "Build, safely test, and harden a mini application against common web security failures.",
  "brief": "Cover unsafe rendering, injection risks, authorization mistakes, open redirects, SSRF, secret exposure, cookie configuration, and security headers.",
  "steps": [
    "Create safe and unsafe rendering examples.",
    "Use parameterized database access.",
    "Add resource ownership/tenant checks.",
    "Test and fix an unsafe return URL.",
    "Add SSRF-aware URL validation.",
    "Audit environment variables and cookies.",
    "Add security headers and a baseline CSP.",
    "Run dependency and secret checks in CI."
  ],
  "acceptance": [
    "User-controlled HTML is not executed unintentionally.",
    "Database queries do not concatenate untrusted SQL.",
    "Resource access is authorized server-side.",
    "External redirect destinations are rejected unless allowed.",
    "Secrets are not exposed to client code or source control.",
    "Security headers are present and documented."
  ],
  "stretch": [
    "Add CSP nonces.",
    "Add automated security tests.",
    "Add dependency auditing to CI.",
    "Write a threat model for the app."
  ]
}
};
