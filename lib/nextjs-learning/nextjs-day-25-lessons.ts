import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_25_LESSONS: LessonDay = {
  day: 25, title: "Production security architecture build", totalMinutes: 80, difficulty: "Beginner to Advanced",
  lessons: [
    {
      id: "architecture", title: "Design the security path before writing features", durationMinutes: 22,
      explanation: "### 1. Basic — every request crosses several checks\n\nA secure SaaS does not have one magic security file. A request moves through protection, identity, permission, validation, business logic, and data access. Each layer assumes the earlier layer can fail.\n\n### 2. Intermediate — define the responsibilities\n\nRequest protection handles coarse request rules. Authentication finds the user. Authorization checks the action and resource. Validation checks shape and business constraints. Services implement the work. The database account has limited rights.\n\n### 3. Advanced — use defence in depth\n\nAn attacker may bypass a UI, call an API directly, replay a request, or find a forgotten endpoint. Repeating critical checks at server boundaries is intentional, not duplication.",
      diagram: "Browser\n   ↓\nRequest protection\n   ↓\nAuthentication\n   ↓\nAuthorization\n   ↓\nValidation\n   ↓\nService\n   ↓\nDatabase",
      codeExample: { title: "A protected Route Handler flow", code: "export async function PATCH(request: Request, { params }: Props) {\n  const user = await requireUser();\n  const input = updateProjectSchema.parse(await request.json());\n  const project = await getProject((await params).id);\n\n  if (!project || !canEditProject(user, project)) {\n    return Response.json({ error: \"Forbidden\" }, { status: 403 });\n  }\n\n  return Response.json(await updateProject(project.id, input));\n}" },
      keyTakeaways: ["Put the security rule at the server boundary where the action happens.", "Each layer has one job and does not replace the others."],
      commonMistakes: ["Putting all security logic inside a page component.", "Checking a role but not whether the requested record belongs to the tenant."],
      quiz: [{ question: "Which check answers whether this user may edit this project?", options: ["Authorization", "Authentication", "Rendering"], correctIndex: 0, explanation: "Authorization evaluates the requested action and resource." }],
    },
    {
      id: "build", title: "Build: secure SaaS authentication and tenant access", durationMinutes: 35,
      explanation: "### 1. Basic — define the product boundary\n\nBuild a small SaaS with sign-in, projects, and organizations. A member sees only their organization. An admin can manage members.\n\n### 2. Intermediate — build the server rules first\n\nCreate `requireUser`, `requireOrganizationMember`, and `canManageMembers` helpers. Use them in Server Actions and Route Handlers. Validate every mutation with a schema before calling a service.\n\n### 3. Advanced — make failures safe\n\nUse generic auth failures, rate limits, audit logs for sensitive actions, session rotation, and response objects that expose only required fields. Test a request with another user's resource ID.",
      diagram: "Member request\n   │\nSession → user\n   │\nOrganization membership\n   │\nRole + resource policy\n   │\nValidated service action\n   │\nScoped database query",
      codeExample: { title: "Tenant-scoped data query", code: "export async function listProjects(userId: string, organizationId: string) {\n  await requireOrganizationMember(userId, organizationId);\n\n  return db.project.findMany({\n    where: { organizationId },\n    select: { id: true, name: true, updatedAt: true },\n  });\n}" },
      keyTakeaways: ["Tenant membership must scope every read and write.", "Select the response fields instead of exposing full data models."],
      commonMistakes: ["Filtering by organization only in the frontend.", "Using an organization ID from the URL without verifying membership."],
      quiz: [{ question: "Where should tenant membership be checked?", options: ["On the server before the data action", "Only in the sidebar", "Only after data is returned"], correctIndex: 0, explanation: "The data boundary must enforce tenant isolation." }],
    },
    {
      id: "release", title: "Production security review and release checklist", durationMinutes: 23,
      explanation: "### 1. Basic — review the obvious boundaries\n\nBefore release, inspect authentication, authorization, validation, cookie flags, error responses, and environment variables. Make sure development secrets are not in the repository.\n\n### 2. Intermediate — test like a normal attacker\n\nTry another user's ID, a malformed request body, an external redirect URL, a failed login loop, and an unauthenticated API request. These checks exercise the paths most often missed by happy-path testing.\n\n### 3. Advanced — plan for incidents\n\nKnow how to rotate a key, revoke sessions, disable an integration, and inspect audit logs. Good security architecture includes recovery, not only prevention.",
      diagram: "Before release\n   │\nSecrets + dependencies\n   ↓\nAuth + authorization\n   ↓\nInput + output checks\n   ↓\nHeaders + cookies\n   ↓\nMonitoring + recovery plan",
      codeExample: { title: "A release review test idea", code: "// As user A, request user B's project.\nconst response = await fetch(`/api/projects/${otherUsersProjectId}`, {\n  headers: { Cookie: userASession },\n});\n\nexpect(response.status).toBe(403);" },
      keyTakeaways: ["A release checklist turns security knowledge into a repeatable habit.", "Plan key rotation and session revocation before an incident happens."],
      commonMistakes: ["Treating a dependency audit as the entire security review.", "Testing only as an administrator who has permission for everything."],
      quiz: [{ question: "What should happen when user A requests user B's private project?", options: ["The server denies access", "The UI hides the result after loading", "The request succeeds if the ID exists"], correctIndex: 0, explanation: "Object-level authorization must protect the data on the server." }],
    },
  ], finalQuiz: [],
  project: { name: "Secure SaaS", goal: "Build a tenant-aware authentication system", brief: "Use the architecture from this day for every protected action.", steps: ["Create login, logout, and secure sessions.", "Add organization membership and role checks.", "Protect project reads and mutations with tenant-scoped policies.", "Add validation, safe errors, headers, and audit events."], acceptance: ["A user cannot access another tenant's project by changing the URL.", "Protected server actions and Route Handlers reject unauthenticated requests.", "Secrets remain server-only and session cookies use secure flags." ] },
};
