import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_22_LESSONS: LessonDay = {
  day: 22,
  title: "Browser security: XSS, CSRF, cookies and open redirects",
  totalMinutes: 65,
  difficulty: "Beginner to Advanced",
  lessons: [
    {
      id: "xss-and-output", title: "XSS: never let untrusted text become executable page code", durationMinutes: 18,
      explanation: "### 1. Basic — what XSS means\n\n<b>Cross-site scripting (XSS)</b> happens when text supplied by someone else is treated as browser code. A comment, profile name, or search result should stay text.\n\n### 2. Intermediate — React helps, but only if you keep its safety rail\n\nReact escapes values placed with `{value}`. The risk returns when you inject HTML with `dangerouslySetInnerHTML`, use an unsafe third-party widget, or put untrusted data into URLs.\n\n### 3. Advanced — make unsafe boundaries obvious\n\nIf HTML really is a product feature, sanitize it on the server with a reviewed allow-list. Store the original separately only when needed. Never build an allow-list by deleting a few bad tags.",
      diagram: "User input\n   │\n   ├── React text node {comment}  → escaped → safe text\n   │\n   └── raw HTML injection          → browser parses it → XSS risk",
      codeExample: { title: "Safe text rendering", code: "export function Comment({ body }: { body: string }) {\n  return <p>{body}</p>;\n}\n\n// Do not pass untrusted body to dangerouslySetInnerHTML." },
      keyTakeaways: ["Treat every value from a user, URL, API, or database as untrusted until you know otherwise.", "React text interpolation is safe by default. Raw HTML is a deliberate security boundary."],
      commonMistakes: ["Using `dangerouslySetInnerHTML` because formatting is inconvenient.", "Assuming database data is safe. It may originally have come from a user."],
      quiz: [{ question: "Which rendering style keeps ordinary user text escaped?", options: ["`<p>{text}</p>`", "`dangerouslySetInnerHTML`", "Building HTML strings"], correctIndex: 0, explanation: "React escapes text values placed in JSX." }],
    },
    {
      id: "csrf-and-cookies", title: "CSRF and secure cookie-based sessions", durationMinutes: 22,
      explanation: "### 1. Basic — the surprising browser behavior\n\nA browser automatically attaches cookies to many requests. <b>Cross-site request forgery (CSRF)</b> abuses that behavior: a malicious site tries to make a logged-in browser send a state-changing request to your app.\n\n### 2. Intermediate — use several layers\n\nUse `SameSite` cookies, verify the request origin for sensitive mutations, and require an anti-CSRF token when your authentication design needs one. Server Actions and Route Handlers still need authorization and input validation.\n\n### 3. Advanced — cookie flags describe a contract\n\n`httpOnly` prevents normal browser JavaScript from reading a cookie. `secure` limits it to HTTPS. `sameSite` controls cross-site sending. These flags reduce risk but do not make an invalid session valid.",
      diagram: "Trusted app                 Attacker site\n    │                              │\nPOST /transfer                   tries POST /transfer\n    │                              │\nOrigin + CSRF checks  ◄──────── browser may carry cookies\n    │\nAllow only valid request",
      codeExample: { title: "A session cookie set on the server", code: "cookieStore.set(\"session\", token, {\n  httpOnly: true,\n  secure: process.env.NODE_ENV === \"production\",\n  sameSite: \"lax\",\n  path: \"/\",\n});" },
      keyTakeaways: ["Use `httpOnly`, `secure`, `sameSite`, and a narrow lifetime for session cookies.", "Check identity and permission on every mutation, not only on the page that displays a form."],
      commonMistakes: ["Putting passwords or long-lived secrets directly in a cookie.", "Believing a hidden button or client redirect is authorization."],
      quiz: [{ question: "What does `httpOnly` mainly do?", options: ["Prevents normal JavaScript from reading the cookie", "Encrypts the database", "Makes a user an admin"], correctIndex: 0, explanation: "It reduces exposure to JavaScript-based cookie theft." }],
    },
    {
      id: "redirects-and-headers", title: "Open redirects, security headers and Content Security Policy", durationMinutes: 25,
      explanation: "### 1. Basic — validate where you send people\n\nAn <b>open redirect</b> happens when your app redirects to any URL supplied in a query parameter. Attackers can make a trustworthy domain send people to a phishing site.\n\n### 2. Intermediate — choose safe destinations\n\nFor a `next` parameter, allow only paths that begin with one slash and reject `//`, full URLs, and protocol-like values. Better still, keep a small list of known destinations.\n\n### 3. Advanced — browser headers are backup rules\n\nSecurity headers tell browsers what to load, frame, or infer. A <b>Content Security Policy (CSP)</b> is especially useful because it limits script sources. Start with report-only mode, fix real violations, then enforce it.",
      diagram: "Login success\n   │\nnext=/dashboard     → allowed\nnext=https://evil.example → rejected\n   │\nRedirect only inside your application",
      codeExample: { title: "Safe local redirect helper", code: "function safeNext(value: string | null) {\n  if (!value || !value.startsWith(\"/\") || value.startsWith(\"//\")) {\n    return \"/dashboard\";\n  }\n  return value;\n}" },
      keyTakeaways: ["Never redirect to an arbitrary external URL from user input.", "CSP, frame protection, and content-type headers add browser-side defence in depth."],
      commonMistakes: ["Checking only that a URL contains your domain name.", "Launching a strict CSP before observing which real scripts, fonts, and images your app needs."],
      quiz: [{ question: "Why reject `//evil.example` as a next path?", options: ["Browsers can treat it as an external destination", "It is too short", "It is a TypeScript error"], correctIndex: 0, explanation: "A protocol-relative URL can leave your site." }],
    },
  ], finalQuiz: [],
};
