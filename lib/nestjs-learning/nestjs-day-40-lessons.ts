import type { LessonDay } from "@/lib/learn/lesson-types";

export const RBAC_DAY_40_LESSONS: LessonDay = {
  day: 40,
  title: "RBAC",
  totalMinutes: 190,
  difficulty: "Advanced",
  lessons: [
    {
      id: "roles",
      title: "Roles and RBAC Fundamentals",
      durationMinutes: 30,
      explanation: `<b>RBAC means Role-Based Access Control.</b>

Authentication answers who the caller is. RBAC adds a role that groups access capabilities.

An e-commerce application might define:

<pre>
customer
support
finance
admin
</pre>

A customer can manage their own orders. Support can handle tickets. Finance can issue refunds. Admin can manage users and products.

The simple model is:

<pre>
User -> Role -> Allowed operations
</pre>

Roles are useful when they represent stable business categories.

But a role is not a permission itself. As the application grows, a single \`support\` role may become too broad. Some support users might refund orders while others only view them.

That is where permissions become useful.

Also remember that a role check does not automatically prove resource ownership. An admin for Organization A may not automatically be allowed to modify a resource belonging to Organization B.

RBAC is therefore a layer of authorization, not the entire security story.`,
      diagram: `User
 |
 v
Role
 |
 +--> customer
 +--> support
 +--> finance
 +--> admin
 |
 v
Authorization decision
`,
      codeExample: {
        title: "Role Model",
        code: `export enum Role {
  CUSTOMER = "customer",
  SUPPORT = "support",
  FINANCE = "finance",
  ADMIN = "admin",
}

type User = {
  id: number;
  role: Role;
};

function isAdmin(user: User) {
  return user.role === Role.ADMIN;
}
`,
      },
      keyTakeaways: [
        "Roles group related authorization capabilities.",
        "Authentication must establish identity before role checks.",
        "Roles work well for coarse-grained access.",
        "Resource ownership and business rules may still be needed."
],
      commonMistakes: [
        "<b>Treating role as authentication.</b> Roles only have meaning after identity is established.",
        "<b>Creating a role per endpoint.</b> This often indicates permissions are needed.",
        "<b>Assuming a role proves ownership.</b> Tenant and resource boundaries can still apply."
],
      quiz: [
        {
                "question": "What does RBAC stand for?",
                "options": [
                        "Role-Based Access Control",
                        "Request-Based API Cache",
                        "Runtime Bearer Authentication Cookie",
                        "Role-Bound API Controller"
                ],
                "correctIndex": 0,
                "explanation": "RBAC stands for Role-Based Access Control."
        },
        {
                "question": "What is a role?",
                "options": [
                        "A grouping of authorization capabilities",
                        "A password",
                        "A JWT signature",
                        "A database connection"
                ],
                "correctIndex": 0,
                "explanation": "A role groups capabilities for an identity."
        }
],
    },
    {
      id: "permissions",
      title: "Permissions",
      durationMinutes: 30,
      explanation: `<b>Permissions express specific capabilities.</b>

Instead of only saying \`finance\`, define permissions such as:

<pre>
orders:read
orders:refund
products:update
users:suspend
</pre>

Then a role can be a collection of permissions.

<pre>
finance
  |
  +--> orders:read
  +--> orders:refund

support
  |
  +--> orders:read
</pre>

This scales better when roles become nuanced.

However, a permission does not always finish authorization. \`orders:refund\` may mean the user is allowed to attempt refunds, but the particular order may still be non-refundable, belong to another organization, or have already been refunded.

A production authorization decision can therefore look like:

<pre>
Identity
  |
  v
Permission
  |
  v
Ownership/Tenant
  |
  v
Business rule
  |
  v
Allow/Deny
</pre>

Keep business rules in appropriate domain services or policy classes rather than forcing a role guard to understand every business condition.`,
      diagram: `Role
 |
 v
Permissions
 |
 +--> orders:read
 +--> orders:refund
 +--> products:update
 |
 v
Resource Policy
 |
 v
Business Rules
`,
      codeExample: {
        title: "Permission Map",
        code: `const permissions = {
  SUPPORT: ["orders:read"],
  FINANCE: ["orders:read", "orders:refund"],
  ADMIN: [
    "orders:read",
    "orders:refund",
    "products:update",
    "users:suspend",
  ],
} as const;

function hasPermission(
  role: keyof typeof permissions,
  permission: string,
) {
  return permissions[role].includes(permission as never);
}
`,
      },
      keyTakeaways: [
        "Permissions provide finer-grained authorization than broad roles.",
        "Roles can group permissions.",
        "Ownership and business rules can add another authorization layer.",
        "Permission names should describe meaningful business capabilities."
],
      commonMistakes: [
        "<b>Assuming permission means every resource is accessible.</b> Resource scope can still matter.",
        "<b>Hard-coding permission checks throughout controllers.</b> Centralize reusable authorization logic.",
        "<b>Relying on UI permissions.</b> The API must enforce authorization."
],
      quiz: [
        {
                "question": "What is \`orders:refund\`?",
                "options": [
                        "A specific authorization capability",
                        "A password",
                        "A session ID",
                        "A JWT header"
                ],
                "correctIndex": 0,
                "explanation": "It describes a specific capability an identity may possess."
        },
        {
                "question": "Why can permission still require a resource check?",
                "options": [
                        "The particular order may not belong to the user's allowed scope",
                        "Permissions cannot be strings",
                        "JWTs cannot expire",
                        "Roles stop working"
                ],
                "correctIndex": 0,
                "explanation": "Authorization can depend on the resource and its business state."
        }
],
    },
    {
      id: "metadata",
      title: "Metadata and @Roles Decorator",
      durationMinutes: 30,
      explanation: `<b>NestJS metadata lets route declarations describe authorization requirements.</b>

Instead of making a guard guess what each route needs, a route can declare:

<pre>
@Roles("admin")
@Get("users")
listUsers() {}
</pre>

The decorator attaches metadata to the handler. The guard later reads it and enforces it.

The important distinction is:

<b>Metadata describes a requirement. The guard enforces it.</b>

The decorator alone does not protect the route.

Metadata also improves readability. A developer opening a controller can immediately see that a route requires an admin role.

You can attach metadata at the controller class level as a default and override it at a specific handler if your design needs that behavior.

Keep metadata keys and custom decorators centralized so the authorization system does not become a collection of unrelated strings.`,
      diagram: `@Roles("admin")
      |
      v
Route Metadata
      |
      v
RolesGuard
      |
      v
Required roles
      |
      v
Authenticated user
`,
      codeExample: {
        title: "Roles Decorator",
        code: `import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

export const Roles = (...roles: string[]) =>
  SetMetadata(ROLES_KEY, roles);

@Controller("admin")
export class AdminController {
  @Roles("admin")
  @Get("users")
  listUsers() {
    return this.users.findAll();
  }
}
`,
      },
      keyTakeaways: [
        "Metadata can make authorization requirements declarative.",
        "\`@Roles()\` stores metadata; it does not itself enforce access.",
        "A guard interprets metadata and makes the authorization decision.",
        "Centralize metadata keys and decorators."
],
      commonMistakes: [
        "<b>Assuming @Roles is a security boundary by itself.</b> A guard must enforce it.",
        "<b>Forgetting the guard.</b> Metadata without enforcement has no access-control effect.",
        "<b>Using inconsistent metadata keys.</b> Centralize the key and decorator."
],
      quiz: [
        {
                "question": "What does @Roles typically do?",
                "options": [
                        "Attach metadata",
                        "Hash passwords",
                        "Create a JWT",
                        "Query PostgreSQL"
                ],
                "correctIndex": 0,
                "explanation": "The decorator stores route metadata."
        },
        {
                "question": "What enforces that metadata?",
                "options": [
                        "A guard",
                        "The decorator alone",
                        "The browser",
                        "PostgreSQL"
                ],
                "correctIndex": 0,
                "explanation": "A guard reads the metadata and evaluates it against the authenticated identity."
        }
],
    },
    {
      id: "reflector",
      title: "Reflector and RolesGuard",
      durationMinutes: 35,
      explanation: `<b>The Reflector lets a NestJS guard read metadata attached to controllers and route handlers.</b>

The request flow becomes:

<pre>
@Roles("admin")
     |
     v
Metadata
     |
     v
Reflector
     |
     v
RolesGuard
     |
     v
request.user.role
     |
     v
Allow / Deny
</pre>

NestJS supports metadata at both class and handler levels. A controller can define a broad default while a method can define a more specific requirement.

\`getAllAndOverride()\` is useful when method-level metadata should override class-level metadata.

Routes without role metadata need an explicit policy. A common approach is to let the RolesGuard return true when no role requirement exists, while a separate authentication guard still protects authenticated routes.

Remember the order of responsibilities: authentication should normally establish \`request.user\` before a role guard attempts to inspect it.

A missing user should never accidentally pass a role requirement.`,
      diagram: `Controller Metadata
       |
       +---- class roles
       |
       +---- handler roles
                  |
                  v
              Reflector
                  |
                  v
              RolesGuard
                  |
                  v
           request.user.role
                  |
              +---+---+
              |       |
            allow    deny
`,
      codeExample: {
        title: "RolesGuard with Reflector",
        code: `@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(
      "roles",
      [context.getHandler(), context.getClass()],
    ) ?? [];

    if (roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    return roles.includes(request.user?.role);
  }
}

// Run authentication before this guard so request.user exists.
`,
      },
      keyTakeaways: [
        "Reflector reads metadata for guards.",
        "RolesGuard converts metadata and identity into an authorization decision.",
        "getAllAndOverride supports handler-over-controller metadata behavior.",
        "Authentication should run before role authorization."
],
      commonMistakes: [
        "<b>Running RolesGuard before authentication.</b> request.user may not exist.",
        "<b>Using unexpected metadata precedence.</b> Decide whether handler metadata overrides class defaults.",
        "<b>Allowing missing users when roles are required.</b> Missing identity must not satisfy authorization.",
        "<b>Assuming role checks prove ownership.</b> Resource checks may still be necessary."
],
      quiz: [
        {
                "question": "What does Reflector provide?",
                "options": [
                        "Access to NestJS metadata",
                        "Password hashing",
                        "JWT signing",
                        "Database transactions"
                ],
                "correctIndex": 0,
                "explanation": "Reflector lets guards read metadata attached to classes and handlers."
        },
        {
                "question": "Why use getAllAndOverride?",
                "options": [
                        "To allow more specific handler metadata to override broader controller metadata",
                        "To encrypt metadata",
                        "To create users",
                        "To disable authentication"
                ],
                "correctIndex": 0,
                "explanation": "It supports a common controller-default and handler-override pattern."
        }
],
    },
    {
      id: "rbac-production",
      title: "Production RBAC and Resource Ownership",
      durationMinutes: 35,
      explanation: `<b>Simple RBAC becomes more complex in multi-tenant applications.</b>

Imagine your e-commerce platform serves multiple companies. A support agent can read orders, but only for organizations assigned to them.

A role alone cannot express this.

You may need:

<pre>
Identity
  |
  +--> Role
  +--> Permissions
  +--> Organization membership
  +--> Resource ownership
  +--> Resource state
</pre>

This is why production systems often combine RBAC with policy checks.

For example, an admin role may permit refunds, but the order still needs to belong to the user's organization and be in a refundable payment state.

<b>Fail closed.</b>

If the authorization service is unavailable or required security information cannot be verified, protected operations should normally be denied rather than accidentally allowed.

<b>Never rely on the frontend.</b>

A hidden Delete button is not authorization. A client can call the endpoint directly.

<b>Test authorization as a matrix.</b>

Test every important role against representative resources, tenants, and operations. This is where privilege-escalation bugs often appear.`,
      diagram: `Request
  |
  v
Authentication
  |
  v
Identity
  |
  +--> Role
  +--> Permission
  +--> Tenant
  +--> Ownership
  +--> Resource State
           |
           v
        Policy
           |
       +---+---+
       |       |
     allow    deny
`,
      codeExample: {
        title: "Resource Authorization Policy",
        code: `@Injectable()
export class OrderPolicy {
  canRefund(
    user: {
      role: string;
      organizationId: number;
    },
    order: {
      organizationId: number;
      paymentStatus: string;
    },
  ) {
    if (!["admin", "finance"].includes(user.role)) {
      return false;
    }

    if (user.organizationId !== order.organizationId) {
      return false;
    }

    return order.paymentStatus === "paid";
  }
}

// Role is only one part of this authorization decision.
`,
      },
      keyTakeaways: [
        "Production authorization can combine role, permission, tenant, ownership, and business state.",
        "Protected operations should fail closed when authorization information is unavailable.",
        "Frontend visibility is not API security.",
        "Authorization should be tested as an identity/resource matrix."
],
      commonMistakes: [
        "<b>Using only roles in multi-tenant systems.</b> Tenant boundaries can still be violated.",
        "<b>Failing open when policy data is unavailable.</b> Uncertainty should not become permission.",
        "<b>Testing only admins.</b> Boundary cases between roles and resources are critical.",
        "<b>Trusting frontend checks.</b> Attackers can call APIs directly."
],
      quiz: [
        {
                "question": "Why might an admin still need an organization check?",
                "options": [
                        "The role can be valid while the resource belongs to another tenant",
                        "Roles cannot be strings",
                        "JWTs cannot contain roles",
                        "PostgreSQL cannot store organizations"
                ],
                "correctIndex": 0,
                "explanation": "Multi-tenant authorization often requires both role permission and resource scope."
        },
        {
                "question": "What does fail closed mean?",
                "options": [
                        "Deny protected actions when required authorization information cannot be verified",
                        "Allow all requests",
                        "Disable guards",
                        "Use cached roles forever"
                ],
                "correctIndex": 0,
                "explanation": "Fail closed prevents missing security information from accidentally granting access."
        }
],
    }
  ],
  finalQuiz: [
    {
        "question": "What does RBAC stand for?",
        "options": [
            "Role-Based Access Control",
            "Request-Based API Cache",
            "Runtime Bearer Authentication Cookie",
            "Role-Bound API Controller"
        ],
        "correctIndex": 0,
        "explanation": "RBAC stands for Role-Based Access Control."
    },
    {
        "question": "What does a role represent?",
        "options": [
            "A group of authorization capabilities",
            "A password",
            "A JWT signature",
            "A database connection"
        ],
        "correctIndex": 0,
        "explanation": "A role groups related capabilities."
    },
    {
        "question": "Why use permissions?",
        "options": [
            "They provide finer-grained capabilities than broad roles",
            "They replace authentication",
            "They encrypt JWTs",
            "They remove HTTPS"
        ],
        "correctIndex": 0,
        "explanation": "Permissions represent specific actions that can be composed into roles."
    },
    {
        "question": "What does @Roles do?",
        "options": [
            "Attach authorization metadata",
            "Hash passwords",
            "Create a refresh token",
            "Run a SQL query"
        ],
        "correctIndex": 0,
        "explanation": "The decorator attaches metadata for a guard to interpret."
    },
    {
        "question": "What does Reflector do in RolesGuard?",
        "options": [
            "Read route/controller metadata",
            "Hash passwords",
            "Verify bcrypt",
            "Create database tables"
        ],
        "correctIndex": 0,
        "explanation": "Reflector provides access to NestJS metadata."
    },
    {
        "question": "What should happen when an authenticated user lacks the required role?",
        "options": [
            "Authorization should deny the request",
            "The user becomes admin",
            "The route ignores the rule",
            "The password is changed"
        ],
        "correctIndex": 0,
        "explanation": "Authentication does not imply authorization."
    },
    {
        "question": "Why can RBAC be insufficient in multi-tenant systems?",
        "options": [
            "Resource access can also depend on organization and ownership",
            "Roles cannot be stored",
            "JWTs cannot expire",
            "Guards cannot read metadata"
        ],
        "correctIndex": 0,
        "explanation": "Tenant and resource scope often add constraints beyond role."
    },
    {
        "question": "Why must authorization be enforced on the API?",
        "options": [
            "Clients can bypass or modify frontend behavior",
            "Browsers cannot hide buttons",
            "JWTs require it",
            "It replaces password hashing"
        ],
        "correctIndex": 0,
        "explanation": "The server is the security boundary."
    },
    {
        "question": "What does fail closed mean?",
        "options": [
            "Deny when required authorization information is unavailable",
            "Allow when uncertain",
            "Disable authentication",
            "Return cached permissions"
        ],
        "correctIndex": 0,
        "explanation": "Fail closed avoids accidental access during uncertainty."
    },
    {
        "question": "What is the normal security sequence for a protected operation?",
        "options": [
            "Authenticate -> authorize -> execute business operation",
            "Authorize -> password hash -> authenticate",
            "Frontend check -> execute",
            "Database migration -> authorize"
        ],
        "correctIndex": 0,
        "explanation": "Identity should be established before permissions are evaluated."
    }
],
  project: {
    name: "Multi-Role E-Commerce RBAC System",
    goal: "Build reusable NestJS RBAC using roles, permissions, metadata, Reflector, guards, and resource-level authorization.",
    brief: "Add customer, support, finance, and admin authorization to the e-commerce application. Use declarative roles for broad rules and policy checks for permissions, tenant boundaries, and resource state.",
    steps: [
      "Define Role values for customer, support, finance, and admin.",
      "Create a @Roles decorator using SetMetadata.",
      "Create RolesGuard using Reflector.",
      "Run authentication before RolesGuard so request.user is trusted.",
      "Protect admin routes with @Roles('admin').",
      "Create centralized permission definitions such as orders:read and orders:refund.",
      "Map roles to permissions in an authorization service.",
      "Create at least one resource-level policy checking ownership or organization membership.",
      "Make authorization fail closed when required security information is missing.",
      "Add tests for allowed and denied combinations of roles, permissions, and resources.",
      "Document which rules are role-based, permission-based, and resource/business-policy based."
    ],
    acceptance: [
      "Routes can declare required roles through metadata.",
      "RolesGuard reads and enforces role metadata through Reflector.",
      "Users without required roles are denied.",
      "Permissions support finer-grained capabilities.",
      "At least one endpoint checks resource or organization scope.",
      "Authorization is enforced by the server rather than the frontend.",
      "Tests cover both allowed and denied authorization scenarios.",
      "Routes without role metadata have an explicit documented policy."
    ],
    stretch: [
      "Implement hierarchical roles.",
      "Add a reusable @Permissions decorator and PermissionGuard.",
      "Load permissions from PostgreSQL.",
      "Add organization-scoped roles.",
      "Add authorization audit logs.",
      "Build a policy engine for complex resource authorization."
    ]
  },
};