import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_24_LESSONS: LessonDay = {
  day: 24, title: "Identity, permissions, secrets and dependencies", totalMinutes: 70, difficulty: "Beginner to Advanced",
  lessons: [
    {
      id: "authentication", title: "Authentication vulnerabilities: prove identity carefully", durationMinutes: 23,
      explanation: "### 1. Basic — login is an identity check\n\n<b>Authentication</b> answers who the user is. Passwords must be stored as slow password hashes, never reversible text. A session must be random, expire, and be invalidated when appropriate.\n\n### 2. Intermediate — protect the whole login journey\n\nRate-limit login and reset attempts, use generic failure messages, rotate session identifiers after login, and make password-reset tokens short-lived and single-use. Add multi-factor authentication for accounts where the risk justifies it.\n\n### 3. Advanced — do not trust a token only because it exists\n\nVerify signatures, expiry, issuer, audience, and revocation rules for the kind of token you use. Keep the session lookup in one server-side helper so every route follows the same rule.",
      diagram: "Credentials → verify password hash → rotate session → secure cookie\n                                             │\n                                  later request → validate session",
      codeExample: { title: "One identity boundary", code: "export async function requireUser() {\n  const session = await getSessionFromCookie();\n  if (!session || session.expiresAt < new Date()) {\n    throw new Error(\"Unauthenticated\");\n  }\n  return session.user;\n}" },
      keyTakeaways: ["Centralize session validation in a reusable server-side helper.", "Rate limits and secure recovery flows are part of authentication, not optional extras."],
      commonMistakes: ["Telling attackers whether an email address exists during login or reset.", "Keeping a session valid forever after a password change."],
      quiz: [{ question: "Why rotate a session identifier after login?", options: ["To reduce session fixation risk", "To change the user role", "To avoid validation"], correctIndex: 0, explanation: "A new authenticated session should not reuse a pre-login identifier." }],
    },
    {
      id: "authorization", title: "Authorization vulnerabilities: check the resource, not just the role", durationMinutes: 25,
      explanation: "### 1. Basic — identity is not permission\n\n<b>Authorization</b> answers what an authenticated user may do. A user who can view their own invoice must not automatically view invoice `123` just by changing the URL.\n\n### 2. Intermediate — make checks close to the action\n\nEvery Server Action, Route Handler, and data-access method should verify ownership or permission before reading or changing a resource. Client-side hiding improves the experience but provides no security boundary.\n\n### 3. Advanced — use policy-shaped functions\n\nName permission checks after the business rule: `canEditProject(user, project)`. This makes reviews clearer than scattered `if (role === ...)` checks and helps support team, tenant, and object-level rules.",
      diagram: "Request /api/projects/123\n        │\nrequireUser()\n        │\nload project 123\n        │\ncanEditProject(user, project)?\n   ┌────┴────┐\n  no        yes\n 403      update",
      codeExample: { title: "Check ownership before mutation", code: "const user = await requireUser();\nconst project = await getProject(id);\n\nif (!project || project.ownerId !== user.id) {\n  return Response.json({ error: \"Forbidden\" }, { status: 403 });\n}\n\nawait updateProject(id, input);" },
      keyTakeaways: ["Authorize the exact resource, not only the page or menu.", "Use 401 for no valid identity and 403 for a known user without permission."],
      commonMistakes: ["Checking `isAdmin` in the UI but not on the server.", "Assuming an ID in a URL belongs to the current user."],
      quiz: [{ question: "What protects against changing `/projects/1` to `/projects/2`?", options: ["A server-side ownership or permission check", "Hiding the URL", "A client redirect"], correctIndex: 0, explanation: "This is object-level authorization." }],
    },
    {
      id: "secrets-and-dependencies", title: "Environment variables and dependency vulnerabilities", durationMinutes: 22,
      explanation: "### 1. Basic — secrets do not belong in source code\n\nEnvironment variables keep deployment-specific values outside tracked files. Anything named `NEXT_PUBLIC_` can reach browser code, so it must never be a secret.\n\n### 2. Intermediate — reduce dependency risk\n\nUse a lockfile, keep dependencies current, remove unused packages, and review advisories before upgrading. A package with millions of downloads can still contain a vulnerability or compromised release.\n\n### 3. Advanced — make supply-chain checks routine\n\nRun automated audits in CI, pin or constrain versions deliberately, inspect new packages before adding them, and have a process for rotating a leaked key. Security is a repeatable maintenance task.",
      diagram: ".env.local (not committed)\n        │\nserver-only secret ──► Route Handler / Server Action\n\nNEXT_PUBLIC_* ───────► browser bundle\n                         never a secret",
      codeExample: { title: "Read a server-only secret", code: "const secret = process.env.PAYMENT_WEBHOOK_SECRET;\n\nif (!secret) {\n  throw new Error(\"PAYMENT_WEBHOOK_SECRET is not configured\");\n}\n\n// Do not prefix secrets with NEXT_PUBLIC_." },
      keyTakeaways: ["Treat every `NEXT_PUBLIC_` variable as public information.", "Dependencies, lockfiles, and CI audits are part of your application security boundary."],
      commonMistakes: ["Committing `.env.local` or copying its values into documentation screenshots.", "Ignoring audit output forever because an upgrade feels inconvenient."],
      quiz: [{ question: "Which variable may safely contain a browser-visible analytics ID?", options: ["`NEXT_PUBLIC_ANALYTICS_ID`", "`NEXT_PUBLIC_DATABASE_URL`", "`NEXT_PUBLIC_SESSION_SECRET`"], correctIndex: 0, explanation: "The prefix means the value can be included in client code." }],
    },
  ], finalQuiz: [],
};
