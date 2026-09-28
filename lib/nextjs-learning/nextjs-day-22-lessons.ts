import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_22_LESSONS: LessonDay = {
  day: 22,
  title: "Authorization",
  totalMinutes: 53,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "22-rbac",
      title: "Roles, permissions, and RBAC",
      durationMinutes: 18,
      explanation: "Authorization answers: **is this authenticated user allowed to perform this action on this resource?**\n\nA role is a named bundle of permissions. For example, `admin` might have `users:read`, `users:update`, and `reports:read`, while `member` may have only profile permissions.\n\nRBAC (Role-Based Access Control) assigns users one or more roles and derives permissions from those roles. It is useful because application code can reason about capabilities instead of repeating user-specific conditions.\n\nStart with explicit permissions such as `posts:read`, `posts:update`, and `posts:delete`. Then centralize the rule that maps roles to permissions.\n\nUI checks are useful for user experience, but they are not security. A malicious user can call an API directly, so the server must enforce the same permission.",
      diagram: "User\n |\n +--> admin  --> users:read\n |             users:update\n |             reports:read\n |\n +--> editor --> posts:read\n               posts:update",
      codeExample: {
        title: "Simple RBAC",
        code: "type Permission =\n  | \"users:read\"\n  | \"users:update\"\n  | \"posts:read\"\n  | \"posts:update\";\n\ntype Role = \"admin\" | \"editor\" | \"member\";\n\nconst rolePermissions: Record<Role, Permission[]> = {\n  admin: [\"users:read\", \"users:update\", \"posts:read\", \"posts:update\"],\n  editor: [\"posts:read\", \"posts:update\"],\n  member: [\"posts:read\"],\n};\n\nexport function can(role: Role, permission: Permission) {\n  return rolePermissions[role].includes(permission);\n}"
      },
      keyTakeaways: [
  "Roles group permissions.",
  "Permissions describe concrete capabilities.",
  "RBAC must be enforced on the server.",
  "Centralized authorization rules reduce inconsistent checks."
],
      commonMistakes: [
  "Checking only roles in UI components.",
  "Trusting a role supplied by the client.",
  "Creating vague permissions.",
  "Duplicating role logic across every route."
],
      quiz: [
  {
    "question": "What does RBAC mean?",
    "options": [
      "Role-Based Access Control",
      "Request Browser Access Cache",
      "React Backend Authorization Component",
      "Route Build Access Config"
    ],
    "correctIndex": 0,
    "explanation": "RBAC means Role-Based Access Control."
  },
  {
    "question": "What is `posts:delete`?",
    "options": [
      "A CSS class",
      "A permission/capability",
      "A cookie",
      "A database index"
    ],
    "correctIndex": 1,
    "explanation": "It represents an authorization capability."
  }
]
    },
    {
      id: "22-resource",
      title: "Route protection and resource-level authorization",
      durationMinutes: 18,
      explanation: "Route protection asks whether a user can enter a broad area such as `/admin`. Resource-level authorization asks whether the same user can access a particular record.\n\nA user may have `posts:update` but still be forbidden from updating a post belonging to another organization. In multi-tenant applications, permission checks and tenant/resource checks must work together.\n\nA safe sequence is: identify the authenticated user, check the required permission, load the resource within the user's allowed scope, and only then perform the operation.\n\nThis is particularly important for APIs because a user can bypass your UI and send a direct request containing a different resource ID.",
      diagram: "Request\n  |\n  v\nAuthenticated?\n  |\n  +-- no --> 401 / redirect\n  |\n  v\nPermission?\n  |\n  +-- no --> 403\n  |\n  v\nTenant/resource scope\n  |\n  v\nOperation",
      codeExample: {
        title: "Tenant-scoped update",
        code: "async function updatePost(postId: string, input: UpdatePostInput) {\n  const user = await requireUser();\n\n  if (!can(user.role, \"posts:update\")) {\n    throw new ForbiddenError();\n  }\n\n  const post = await db.post.findFirst({\n    where: {\n      id: postId,\n      organizationId: user.organizationId,\n    },\n  });\n\n  if (!post) throw new NotFoundError();\n\n  return db.post.update({\n    where: { id: post.id },\n    data: input,\n  });\n}"
      },
      keyTakeaways: [
  "Route protection and resource authorization are different.",
  "Tenant boundaries must be enforced server-side.",
  "Identity should come from the authenticated session.",
  "A known resource ID does not automatically grant access."
],
      commonMistakes: [
  "Checking only login status.",
  "Using organizationId from the request body.",
  "Returning resource data before authorization.",
  "Relying on random IDs as the only authorization control."
],
      quiz: [
  {
    "question": "Why is resource-level authorization necessary?",
    "options": [
      "All users have identical access",
      "A user may have a general permission but not access to a particular resource",
      "React requires it",
      "Cookies require it"
    ],
    "correctIndex": 1,
    "explanation": "Specific resources can have ownership or tenant restrictions."
  },
  {
    "question": "Which user identity should a mutation trust?",
    "options": [
      "Hidden form userId",
      "Authenticated server-side session",
      "Query parameter",
      "localStorage"
    ],
    "correctIndex": 1,
    "explanation": "Identity must come from trusted server-side authentication state."
  }
]
    },
    {
      id: "22-admin",
      title: "Role-based admin dashboard architecture",
      durationMinutes: 17,
      explanation: "A role-based admin dashboard combines authentication and authorization. The dashboard first identifies the user, checks the capability needed for the page, and then loads only data that the user is allowed to see.\n\nSeparating `requireUser()` from `requirePermission()` makes security intent explicit. A page can require a user, while a specific operation can require a stronger permission.\n\nThe same helpers should protect Server Actions and Route Handlers. Otherwise, a common vulnerability appears: the page is protected, but its mutation endpoint is accessible directly.\n\nKeep permissions as domain concepts rather than scattering literal role checks throughout components.",
      diagram: "Admin page\n  |\n  +--> requireUser()\n  +--> requirePermission(\"users:read\")\n  +--> load tenant users\n  |\n  v\nAdmin UI\n\nMutation\n  |\n  +--> requireUser()\n  +--> requirePermission(...)\n  +--> validate\n  +--> update",
      codeExample: {
        title: "Reusable authorization helpers",
        code: "export async function requirePermission(permission: Permission) {\n  const user = await requireUser();\n\n  if (!can(user.role, permission)) {\n    throw new ForbiddenError();\n  }\n\n  return user;\n}\n\nexport default async function AdminUsersPage() {\n  const user = await requirePermission(\"users:read\");\n  const users = await listUsersForOrganization(user.organizationId);\n\n  return <UsersTable users={users} />;\n}"
      },
      keyTakeaways: [
  "Protect reads and writes.",
  "Reuse authorization helpers across entry points.",
  "Keep authorization near server-side data access.",
  "Hide unavailable controls for UX, but never rely on hiding for security."
],
      commonMistakes: [
  "Only protecting `/admin`.",
  "Checking role only in a Client Component.",
  "Duplicating authorization logic.",
  "Treating every failure as an authentication failure."
],
      quiz: [
  {
    "question": "What should happen when a logged-in user lacks a required permission?",
    "options": [
      "Grant access",
      "Reject the operation",
      "Change the role",
      "Return a password"
    ],
    "correctIndex": 1,
    "explanation": "Authenticated but unauthorized users must be denied."
  },
  {
    "question": "Why reuse permission helpers?",
    "options": [
      "To reduce inconsistent security checks",
      "To remove the database",
      "To avoid TypeScript",
      "To make CSS smaller"
    ],
    "correctIndex": 0,
    "explanation": "Centralized rules reduce inconsistent authorization."
  }
]
    },
  ],
  finalQuiz: [
  {
    "question": "What does authorization decide?",
    "options": [
      "Who a person is",
      "What an authenticated identity may do",
      "How CSS loads",
      "Which package manager is used"
    ],
    "correctIndex": 1,
    "explanation": "Authorization determines permissions."
  },
  {
    "question": "What does RBAC mean?",
    "options": [
      "Role-Based Access Control",
      "Request Browser Access Cache",
      "React Backend Access Component",
      "Route Build Authorization Config"
    ],
    "correctIndex": 0,
    "explanation": "RBAC means Role-Based Access Control."
  },
  {
    "question": "Why is resource-level authorization needed?",
    "options": [
      "Users have no roles",
      "A general permission may not grant access to a particular resource",
      "React requires it",
      "Cookies require it"
    ],
    "correctIndex": 1,
    "explanation": "Specific resources can have ownership or tenant restrictions."
  }
],
  project: {
  "name": "Role-based admin dashboard",
  "goal": "Build a protected dashboard with admin/editor/member roles and resource-level authorization.",
  "brief": "Create users, roles, permissions, protected admin routes, and organization-scoped data operations.",
  "steps": [
    "Define roles and explicit permissions.",
    "Add organization membership to users.",
    "Create requireUser() and requirePermission().",
    "Protect the admin dashboard.",
    "Add user-management operations with server-side checks.",
    "Add organization-scoped resource checks.",
    "Protect direct API requests.",
    "Hide unavailable UI controls without relying on hiding for security."
  ],
  "acceptance": [
    "Unauthenticated users cannot access the dashboard.",
    "Users cannot perform actions outside their permissions.",
    "Cross-tenant resource access is rejected.",
    "Direct API requests are protected.",
    "Authorization logic is reusable."
  ],
  "stretch": [
    "Support multiple roles per user.",
    "Build a permission-management screen.",
    "Add audit logs for privileged actions."
  ]
}
};
