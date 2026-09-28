import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_23_LESSONS: LessonDay = {
  day: 23, title: "Server security: SQL injection, SSRF and sensitive data", totalMinutes: 70, difficulty: "Beginner to Advanced",
  lessons: [
    {
      id: "sql-injection", title: "SQL injection: data is not SQL", durationMinutes: 22,
      explanation: "### 1. Basic — separate instructions from values\n\n<b>SQL injection</b> happens when user input changes the meaning of a database query. The fix is not manually escaping every quote. Use parameterized queries or your ORM's normal query API.\n\n### 2. Intermediate — validation is not the same as query safety\n\nValidate that an email is an email and an ID has the expected format. Still use parameters. Validation improves product behavior; parameterization keeps values from becoming database instructions.\n\n### 3. Advanced — limit the database account too\n\nUse a database account with only the permissions the app needs. A query bug should not be able to alter unrelated databases or create admin accounts.",
      diagram: "Unsafe: query string + input → database interprets both\nSafe:   query template + parameter → database keeps input as data",
      codeExample: { title: "Parameterized query", code: "const user = await db.query(\n  \"SELECT id, email FROM users WHERE email = $1\",\n  [email],\n);\n\n// With an ORM, use its structured `where` API instead of raw strings." },
      keyTakeaways: ["Use parameters or structured ORM queries every time.", "Validate inputs and restrict database privileges as separate layers."],
      commonMistakes: ["Concatenating an ID into a raw SQL string.", "Logging complete database errors to the browser."],
      quiz: [{ question: "What is the primary defence against SQL injection?", options: ["Parameterized queries", "A longer password", "Client-side validation only"], correctIndex: 0, explanation: "Parameters keep values separate from SQL instructions." }],
    },
    {
      id: "ssrf", title: "SSRF: your server must not fetch anywhere it is told", durationMinutes: 23,
      explanation: "### 1. Basic — the server has a different network view\n\n<b>Server-side request forgery (SSRF)</b> occurs when someone controls a URL that your server fetches. Your server may reach internal services that a public browser cannot.\n\n### 2. Intermediate — allow known destinations\n\nFor integrations, store provider base URLs in configuration. For user-entered imports, allow only required protocols and approved hostnames. Do not merely block the word `localhost`.\n\n### 3. Advanced — design an outbound boundary\n\nUse a dedicated fetch service, DNS/IP checks where appropriate, short timeouts, response-size limits, and network rules. Log destination decisions without logging secrets.",
      diagram: "User URL\n   │\nValidation allow-list\n   │\nOutbound fetch service\n   │\nApproved provider\n\nNever: user URL → unrestricted server fetch",
      codeExample: { title: "Allow-list an integration hostname", code: "const url = new URL(input);\nconst allowedHosts = new Set([\"api.github.com\"]);\n\nif (url.protocol !== \"https:\" || !allowedHosts.has(url.hostname)) {\n  throw new Error(\"Unsupported integration URL\");\n}\n\nconst response = await fetch(url, { signal: AbortSignal.timeout(5_000) });" },
      keyTakeaways: ["A server fetches with server-side network access, not browser permissions.", "Use allow-lists, timeouts, and network controls for outbound requests."],
      commonMistakes: ["Fetching a profile image URL directly from an arbitrary user field.", "Allowing redirects without checking the final destination."],
      quiz: [{ question: "What makes SSRF dangerous?", options: ["The server may reach internal services", "It only changes CSS", "It affects localStorage"], correctIndex: 0, explanation: "Server networks often have access a public visitor does not." }],
    },
    {
      id: "data-exposure", title: "Sensitive data exposure and safe error handling", durationMinutes: 25,
      explanation: "### 1. Basic — know what must stay private\n\nPasswords, session tokens, API keys, reset links, payment data, and private user fields are sensitive. A response only needs the fields its caller actually uses.\n\n### 2. Intermediate — create response shapes\n\nDo not send a database record directly with `return Response.json(user)`. Select or map public fields into a small response object. This also prevents accidental leaks when the database schema grows.\n\n### 3. Advanced — logs are data stores too\n\nRedact secrets from logs and error tracking. Return a stable public error message, log a request ID, and keep detailed diagnostics on the server.",
      diagram: "Database user\n[id, email, passwordHash, role, resetToken]\n        │ select/map\n        ▼\nPublic API response\n[id, email, role]",
      codeExample: { title: "Return only required fields", code: "const user = await getUserById(id);\n\nreturn Response.json({\n  id: user.id,\n  name: user.name,\n  email: user.email,\n});\n\n// Never return passwordHash, sessionToken, or resetToken." },
      keyTakeaways: ["Design API response objects intentionally.", "Errors and logs must not become a secret-export feature."],
      commonMistakes: ["Returning an ORM object directly.", "Sending stack traces, database URLs, or tokens to the browser."],
      quiz: [{ question: "Why map a database record to a response object?", options: ["To prevent accidental fields leaking", "To make SQL run faster", "To avoid authentication"], correctIndex: 0, explanation: "The response becomes an explicit public contract." }],
    },
  ], finalQuiz: [],
};
