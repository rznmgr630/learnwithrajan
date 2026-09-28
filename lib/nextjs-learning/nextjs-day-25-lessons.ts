import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_25_LESSONS: LessonDay = {
  day: 25,
  title: "Production Security Architecture",
  totalMinutes: 71,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "25-layers",
      title: "Production security architecture",
      durationMinutes: 18,
      explanation: "Production security should be layered. No single Proxy rule, cookie flag, validation library, or authentication package can secure an entire application.\n\nA useful flow is: request protection, authentication, authorization, validation, service logic, and database access. Each layer answers a different trust question.\n\nRequest protection can make early routing decisions. Authentication establishes identity. Authorization checks permissions and resource ownership. Validation checks the shape and constraints of input. The service layer applies business rules. The database maintains data integrity and can add tenant constraints.\n\nLower layers should not blindly trust higher layers. A service should not assume a page already validated a user. A database query should not assume a client supplied a legitimate organization ID.",
      diagram: "Browser\n  |\n  v\nRequest protection\n  |\n  v\nAuthentication\n  |\n  v\nAuthorization\n  |\n  v\nValidation\n  |\n  v\nService\n  |\n  v\nRepository / ORM\n  |\n  v\nDatabase",
      codeExample: {
        title: "Layered protected mutation",
        code: "export async function createProject(input: unknown) {\n  const user = await requireUser();\n  await requirePermission(\"projects:create\", user);\n\n  const data = createProjectSchema.parse(input);\n\n  return projectService.create({\n    ...data,\n    organizationId: user.organizationId,\n    createdBy: user.id,\n  });\n}"
      },
      keyTakeaways: [
  "Use defense in depth.",
  "Never trust client-supplied identity or tenant IDs.",
  "Separate authentication, authorization, validation, and business logic.",
  "Protect service/data operations even when called outside the UI."
],
      commonMistakes: [
  "Putting all security in Proxy.",
  "Accepting organizationId from the request body.",
  "Validating only in the browser.",
  "Assuming authenticated means authorized."
],
      quiz: [
  {
    "question": "Why use multiple security layers?",
    "options": [
      "Each layer addresses a different trust decision",
      "It removes the database",
      "It removes authentication",
      "It prevents every bug automatically"
    ],
    "correctIndex": 0,
    "explanation": "Layered defenses reduce reliance on one control."
  },
  {
    "question": "Where should tenant identity come from?",
    "options": [
      "Hidden input",
      "Authenticated server-side context",
      "Query string",
      "CSS"
    ],
    "correctIndex": 1,
    "explanation": "Tenant identity should come from trusted authenticated context."
  }
]
    },
    {
      id: "25-saas",
      title: "Secure SaaS authentication and tenant boundaries",
      durationMinutes: 18,
      explanation: "A SaaS application normally has organizations or tenants. Authentication identifies the user; verified organization membership establishes which tenant context that user can operate within.\n\nA secure service derives `organizationId` from authenticated membership instead of accepting it from the request body. If the client sends another organization's ID, the server should not use it as the security boundary.\n\nSession management should include expiration and revocation. Stateful sessions can be invalidated server-side on logout. Token-based systems need an explicit rotation and revocation strategy.\n\nFor privileged actions, the system may also require stronger authentication such as MFA or recent re-authentication. The exact control should match the risk of the operation.",
      diagram: "Session\n  |\n  v\nAuthenticated user\n  |\n  v\nOrganization membership\n  |\n  +--> organizationId\n  +--> role\n  +--> permissions\n  |\n  v\nTenant-scoped service\n  |\n  v\nTenant-scoped query",
      codeExample: {
        title: "Tenant-scoped query",
        code: "async function listProjects() {\n  const user = await requireUser();\n  await requirePermission(\"projects:read\", user);\n\n  return db.project.findMany({\n    where: {\n      organizationId: user.organizationId,\n    },\n    orderBy: {\n      createdAt: \"desc\",\n    },\n  });\n}\n\n// The organization ID comes from trusted\n// authenticated context, not the browser."
      },
      keyTakeaways: [
  "Tenant boundaries are part of authorization.",
  "Derive organization context from authenticated membership.",
  "Sessions need expiration and revocation.",
  "Privileged operations may need stronger authentication."
],
      commonMistakes: [
  "Trusting organizationId from a form.",
  "Using a global role without checking membership.",
  "Never expiring sessions.",
  "Treating logout as only a UI action."
],
      quiz: [
  {
    "question": "What protects a tenant boundary?",
    "options": [
      "Hidden organization selector",
      "Server-side tenant-scoped queries",
      "Client filtering only",
      "CSS"
    ],
    "correctIndex": 1,
    "explanation": "Tenant scope must be enforced on the server."
  },
  {
    "question": "Why invalidate stateful sessions on logout?",
    "options": [
      "Revoked sessions can stop working immediately",
      "It changes CSS",
      "It creates a database automatically",
      "It disables TypeScript"
    ],
    "correctIndex": 0,
    "explanation": "Server-side invalidation can revoke access immediately."
  }
]
    },
    {
      id: "25-service",
      title: "Secure services, validation, errors, and transactions",
      durationMinutes: 18,
      explanation: "The service layer is a useful place to apply business rules consistently from Server Actions, Route Handlers, jobs, or other entry points.\n\nA protected mutation should authenticate first, authorize second, validate third, and then perform business logic. This ordering avoids wasting work on unauthorized requests and prevents invalid data from reaching domain logic.\n\nTransactions are important when multiple writes must succeed or fail together. For example, creating a subscription might create the subscription, an audit record, and initial entitlements. If one write fails, the transaction can roll back the others.\n\nClient-facing errors should not expose passwords, tokens, SQL statements, stack traces, or internal database details. Detailed diagnostics can be logged server-side with appropriate redaction.",
      diagram: "Action / API\n   |\n requireUser()\n   |\n requirePermission()\n   |\n validate(input)\n   |\n service()\n   |\n transaction()\n   +--> data\n   +--> audit",
      codeExample: {
        title: "Validated transactional mutation",
        code: "const CreateTeamSchema = z.object({\n  name: z.string().trim().min(2).max(80),\n});\n\nexport async function createTeam(input: unknown) {\n  const user = await requireUser();\n  await requirePermission(\"teams:create\", user);\n\n  const data = CreateTeamSchema.parse(input);\n\n  return db.$transaction(async (tx) => {\n    const team = await tx.team.create({\n      data: {\n        name: data.name,\n        organizationId: user.organizationId,\n      },\n    });\n\n    await tx.auditLog.create({\n      data: {\n        actorId: user.id,\n        action: \"team.created\",\n        resourceId: team.id,\n      },\n    });\n\n    return team;\n  });\n}"
      },
      keyTakeaways: [
  "Services centralize business rules.",
  "Validate unknown input before using it.",
  "Transactions provide atomicity for related writes.",
  "Return safe errors and keep sensitive diagnostics server-side."
],
      commonMistakes: [
  "Authorizing after the mutation.",
  "Returning raw database errors.",
  "Using transactions for every read.",
  "Logging passwords or access tokens."
],
      quiz: [
  {
    "question": "What does a transaction provide?",
    "options": [
      "Atomicity for related database changes",
      "Browser rendering",
      "Cookie encryption",
      "Password hashing"
    ],
    "correctIndex": 0,
    "explanation": "Transactions can commit related changes together or roll them back."
  },
  {
    "question": "What should client-facing database errors avoid?",
    "options": [
      "Safe messages",
      "SQL/schema details and secrets",
      "Request IDs",
      "Validation messages"
    ],
    "correctIndex": 1,
    "explanation": "Internal details can expose sensitive implementation information."
  }
]
    },
    {
      id: "25-operations",
      title: "Rate limiting, auditing, monitoring, and security testing",
      durationMinutes: 17,
      explanation: "Production security continues after deployment. You need controls that reduce abuse, records that support investigation, and tests that prove security boundaries remain intact.\n\nRate limiting is especially useful for login, password reset, OTP verification, expensive API operations, and other abuse-sensitive endpoints. In a multi-instance deployment, a shared store is usually required for consistent limits.\n\nAudit logs should record security-sensitive events such as role changes, password changes, API-key creation, and data exports. They should contain enough context for investigation without storing secrets.\n\nMonitoring can detect repeated login failures, unusual authorization errors, request spikes, and abnormal error rates. Automated tests should cover unauthenticated access, wrong roles, wrong tenants, invalid input, and direct API calls.\n\nA production checklist should also include dependency updates, secret rotation, deployment configuration, backups, incident response, and periodic privileged-access review.",
      diagram: "Sensitive endpoint\n  |\n  +--> rate limit\n  +--> authenticate\n  +--> authorize\n  +--> validate\n  +--> execute\n  +--> audit\n  +--> metrics/logs\n  |\n  v\nSecurity monitoring",
      codeExample: {
        title: "Conceptual rate limiting and audit logging",
        code: "const allowed = await rateLimiter.check({\n  key: `login:${ipAddress}`,\n  limit: 10,\n  windowSeconds: 60,\n});\n\nif (!allowed) {\n  throw new RateLimitError();\n}\n\nawait auditLog.record({\n  actorId: user?.id ?? null,\n  action: \"auth.login_failed\",\n  metadata: {\n    ipAddress,\n    // Never store passwords or tokens here.\n  },\n});"
      },
      keyTakeaways: [
  "Rate limit abuse-sensitive operations.",
  "Audit security events without storing secrets.",
  "Monitor authentication and authorization anomalies.",
  "Test wrong identity, wrong role, and wrong tenant cases."
],
      commonMistakes: [
  "Using only in-memory limits across multiple servers.",
  "Logging passwords or tokens.",
  "Testing only successful paths.",
  "Never reviewing privileged access after deployment."
],
      quiz: [
  {
    "question": "Which endpoint commonly needs strong rate limiting?",
    "options": [
      "Login/password reset",
      "Static CSS",
      "A React component",
      "A TypeScript type"
    ],
    "correctIndex": 0,
    "explanation": "Authentication endpoints are common abuse targets."
  },
  {
    "question": "What is an audit log for?",
    "options": [
      "Recording important actions for investigation and accountability",
      "Storing passwords",
      "Replacing the database",
      "Rendering forms"
    ],
    "correctIndex": 0,
    "explanation": "Audit logs provide a record of important events."
  }
]
    },
  ],
  finalQuiz: [
  {
    "question": "What is the main architecture principle?",
    "options": [
      "One security check",
      "Layered defense in depth",
      "Client-only authorization",
      "Proxy-only authorization"
    ],
    "correctIndex": 1,
    "explanation": "Production security uses multiple layers."
  },
  {
    "question": "Where should tenant context come from?",
    "options": [
      "A hidden input",
      "Authenticated server-side context",
      "A query string",
      "CSS"
    ],
    "correctIndex": 1,
    "explanation": "Tenant context should come from trusted authenticated membership."
  },
  {
    "question": "What does a transaction provide?",
    "options": [
      "Atomicity for related database operations",
      "Browser rendering",
      "Cookie encryption",
      "Password hashing"
    ],
    "correctIndex": 0,
    "explanation": "Transactions provide atomicity."
  },
  {
    "question": "Why use rate limiting?",
    "options": [
      "To reduce abuse of sensitive endpoints",
      "To replace authentication",
      "To improve CSS",
      "To store passwords"
    ],
    "correctIndex": 0,
    "explanation": "Rate limiting controls abusive request patterns."
  },
  {
    "question": "What should audit logs avoid storing?",
    "options": [
      "Action names",
      "Timestamps",
      "Passwords and tokens",
      "Actor IDs"
    ],
    "correctIndex": 2,
    "explanation": "Logs should not become a source of secret exposure."
  }
],
  project: {
  "name": "Secure SaaS authentication system",
  "goal": "Build a production-style multi-tenant SaaS security architecture from browser request to database.",
  "brief": "Combine authentication, tenant-aware authorization, validation, service-layer rules, secure sessions, rate limiting, audit logging, and security testing.",
  "steps": [
    "Create users, organizations, memberships, sessions, and audit-log models.",
    "Implement signup/login/logout and session lifecycle.",
    "Create server-only requireUser() and permission helpers.",
    "Derive organization context from authenticated membership.",
    "Build tenant-scoped services and queries.",
    "Validate all mutation input on the server.",
    "Use transactions where atomicity is required.",
    "Add rate limiting for login and sensitive operations.",
    "Record privileged events without secrets.",
    "Add tests for unauthenticated, unauthorized, and cross-tenant access.",
    "Add security headers, environment-variable review, dependency auditing, and deployment checks."
  ],
  "acceptance": [
    "Unauthenticated requests cannot access protected operations.",
    "Users cannot cross organization boundaries.",
    "Roles and permissions are enforced server-side.",
    "Client-provided tenant IDs cannot override authenticated context.",
    "Mutations validate input before business logic.",
    "Related writes use transactions where required.",
    "Sensitive endpoints have an abuse-control strategy.",
    "Audit logs do not contain passwords or tokens.",
    "Security tests cover authentication, authorization, and tenant isolation."
  ],
  "stretch": [
    "Add MFA for privileged users.",
    "Add session/device management.",
    "Add scoped API keys for machine clients.",
    "Add security-event alerting.",
    "Create a complete threat model and data-flow diagram."
  ]
}
};
