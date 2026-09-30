import type { LessonDay } from "@/lib/learn/lesson-types";

export const ABAC_DAY_41_LESSONS: LessonDay = {
  day: 41,
  title: "ABAC",
  totalMinutes: 100,
  difficulty: "Advanced",
  lessons: [
    {
      id: "abac-attributes",
      title: "Understanding Attributes and Attribute-Based Decisions",
      durationMinutes: 18,
      explanation: `Imagine a SaaS hospital application where two nurses both have the role \`nurse\`. Role-based access control can tell us that both are nurses, but it cannot by itself answer every useful question. One nurse may belong to the cardiology department, work the night shift, and be assigned to Hospital A. The other may belong to pediatrics at Hospital B. <b>ABAC (Attribute-Based Access Control)</b> makes authorization decisions using attributes about the user, the resource, the action, and sometimes the environment.
    
    The important idea is that ABAC is not simply “add more roles.” A role is one attribute. An ABAC decision can combine many attributes: \`user.department === resource.department\`, \`user.tenantId === resource.tenantId\`, \`user.clearance >= resource.classification\`, or \`environment.timeOfDay\` being inside an allowed window. This makes policies more expressive when access depends on context.
    
    Start with a simple example. A doctor can read a patient's record when the doctor belongs to the same hospital and has a treatment relationship with that patient. In a NestJS application, a controller should not contain dozens of business authorization rules. A guard or authorization service can collect the relevant attributes and ask a policy evaluator whether the action is allowed.
    
    There is an important boundary here: authentication answers “Who are you?” Authorization answers “Are you allowed to do this action on this resource under these conditions?” ABAC is an authorization model, not an authentication mechanism.`,
      diagram: `Request
      |
      v
    Authentication
      |
      v
    User attributes --------+
    Resource attributes -----+--> Policy evaluation --> ALLOW / DENY
    Action -----------------+
    Environment ------------+`,
      codeExample: {
        title: "Basic ABAC policy service",
        code: `export interface UserAttributes {
      id: string;
      department: string;
      tenantId: string;
      clearance: number;
    }
    
    export interface DocumentAttributes {
      id: string;
      department: string;
      tenantId: string;
      classification: number;
    }
    
    export class DocumentPolicy {
      canRead(user: UserAttributes, document: DocumentAttributes): boolean {
        return (
          user.tenantId === document.tenantId &&
          user.department === document.department &&
          user.clearance >= document.classification
        );
      }
    }`
      },
      keyTakeaways: [
        "ABAC evaluates attributes rather than relying only on a role name.",
        "User, resource, action, and environment can all contribute attributes.",
        "Authentication identifies the caller; ABAC helps decide whether an action is permitted.",
        "A good policy is explicit about which attributes are required.",
        "Authorization rules should be centralized instead of scattered through controllers."
      ],
      commonMistakes: [
        "Treating ABAC as authentication instead of authorization.",
        "Putting authorization conditions directly into many controllers, which makes policy changes difficult.",
        "Trusting client-supplied attributes such as tenantId or department without deriving them from authenticated server-side identity.",
        "Using an attribute without defining what happens when it is missing."
      ],
      quiz: [
        {
          question: "Which statement best describes ABAC?",
          options: [
        "It authorizes only by username",
        "It makes decisions using attributes and policy conditions",
        "It replaces authentication",
        "It stores passwords"
      ],
          correctIndex: 1,
          explanation: "ABAC is an authorization approach that evaluates attributes against policies."
        },
        {
          question: "Which is a resource attribute?",
          options: [
        "The user's password",
        "The user's IP address",
        "A document's tenantId",
        "The browser's local storage"
      ],
          correctIndex: 2,
          explanation: "A resource attribute describes the object being accessed."
        }
      ]
    },
    {
      id: "abac-policy-engine",
      title: "Designing Policy-Based Authorization",
      durationMinutes: 20,
      explanation: `A policy is a rule that translates business requirements into an authorization decision. For example: “A user can update an invoice if the invoice belongs to the user's tenant and the user has the \`invoice:update\` permission.” The policy is more useful than a controller-specific \`if\` statement because it gives the rule a clear home and makes it testable.
    
    In NestJS, a practical architecture is to keep controllers focused on HTTP concerns, guards focused on stopping unauthorized requests, and policy services focused on the actual authorization decision. A guard can obtain the authenticated user and route metadata, load the resource when necessary, and delegate the decision to a policy service.
    
    For small applications, plain TypeScript policy classes are often enough. As the number of policies grows, you may introduce a dedicated authorization layer or a policy library. The important engineering principle is the same: keep authorization rules understandable, deterministic, testable, and auditable.
    
    Be careful with policy composition. \`AND\` rules make access narrower; \`OR\` rules make access broader. A subtle precedence mistake can become a security vulnerability. Write tests for both allowed and denied cases, especially boundary conditions such as a user belonging to another tenant.`,
      diagram: `Controller
       |
       v
    Auth Guard
       |
       v
    Authorization Guard
       |
       +--> Resource loader
       |
       v
    Policy service
       |
       v
    ALLOW / FORBIDDEN`,
      codeExample: {
        title: "NestJS policy guard",
        code: `import {
      CanActivate,
      ExecutionContext,
      ForbiddenException,
      Injectable,
    } from "@nestjs/common";
    
    @Injectable()
    export class InvoicePolicyGuard implements CanActivate {
      constructor(private readonly policy: InvoicePolicy) {}
    
      async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const invoice = await this.policy.loadInvoice(request.params.id);
    
        const allowed = this.policy.canUpdate(user, invoice);
    
        if (!allowed) {
          throw new ForbiddenException("You cannot update this invoice");
        }
    
        request.invoice = invoice;
        return true;
      }
    }`
      },
      keyTakeaways: [
        "A policy should represent a business authorization rule, not an HTTP implementation detail.",
        "Guards are a natural NestJS integration point for authorization.",
        "Resource-based rules often require loading the resource before deciding.",
        "Authorization tests should include cross-tenant and boundary cases.",
        "Prefer explicit policy functions over deeply nested controller conditions."
      ],
      commonMistakes: [
        "Returning `true` because a route has a valid JWT.",
        "Checking only the user's role when ownership or tenant boundaries are required.",
        "Loading a resource without verifying its tenant boundary.",
        "Writing policies that depend on mutable global state, making authorization unpredictable."
      ],
      quiz: [
        {
          question: "Why centralize policy decisions?",
          options: [
        "To make passwords shorter",
        "To keep authorization rules consistent and testable",
        "To remove authentication",
        "To avoid all database queries"
      ],
          correctIndex: 1,
          explanation: "Centralized policies reduce duplicated and inconsistent authorization logic."
        },
        {
          question: "A user has permission to edit invoices but the invoice belongs to another tenant. What should a tenant-aware policy do?",
          options: [
        "Allow it because permission is enough",
        "Deny it",
        "Ask the browser",
        "Ignore tenantId"
      ],
          correctIndex: 1,
          explanation: "Tenant isolation is normally a mandatory authorization boundary."
        }
      ]
    },
    {
      id: "abac-ownership",
      title: "Resource Ownership and Context-Aware Authorization",
      durationMinutes: 18,
      explanation: `Ownership is one of the most common places where beginners accidentally build insecure authorization. A route such as \`PATCH /users/:userId/posts/:postId\` may look protected because the caller is logged in, but being logged in does not prove that the caller owns the post.
    
    A simple ownership rule is \`resource.ownerId === user.id\`. However, production applications often have more complicated relationships. A manager may edit resources owned by team members, a support agent may access tickets assigned to their queue, and an organization administrator may manage any resource inside the organization.
    
    The safest approach is to make ownership part of the server-side decision. Do not accept \`ownerId\` from the request body as proof of ownership. Load the resource using trusted identifiers and compare its ownership fields against the authenticated identity or organization context.
    
    There is also a useful database optimization: instead of loading a record and then checking ownership in application code, many queries can include the ownership predicate directly. For example, \`UPDATE documents SET ... WHERE id = $1 AND owner_id = $2\`. If zero rows are affected, the caller does not own the resource or it does not exist. This can reduce race windows and avoid leaking whether another tenant owns a resource.`,
      diagram: `Authenticated user
          |
          v
    resource id
          |
          v
    Database query:
    WHERE id = ? AND owner_id = ?
          |
          +---- row found ----> continue
          |
          +---- no row -------> deny`,
      codeExample: {
        title: "Ownership-aware service",
        code: `@Injectable()
    export class DocumentService {
      constructor(
        private readonly repo: DocumentRepository,
      ) {}
    
      async updateOwnedDocument(
        userId: string,
        documentId: string,
        input: UpdateDocumentDto,
      ) {
        const result = await this.repo.updateWhereOwner(
          documentId,
          userId,
          input,
        );
    
        if (result.affected === 0) {
          // Do not reveal whether the document exists for another user.
          throw new NotFoundException("Document not found");
        }
    
        return this.repo.findById(documentId);
      }
    }`
      },
      keyTakeaways: [
        "Ownership must be established from trusted server-side data.",
        "Being authenticated does not imply ownership.",
        "Managers and administrators may require relationship-based rules instead of simple ownership.",
        "Combining ownership predicates with database queries can improve correctness and reduce unnecessary reads.",
        "Avoid leaking the existence of resources owned by other users."
      ],
      commonMistakes: [
        "Accepting `ownerId` from the request as proof of ownership.",
        "Checking ownership only in the UI.",
        "Returning a different error that reveals another tenant owns the resource.",
        "Performing a check and a later update without considering concurrency."
      ],
      quiz: [
        {
          question: "What proves ownership most reliably?",
          options: [
        "A hidden form field",
        "A client-side condition",
        "A server-side comparison against trusted identity/resource data",
        "A CSS class"
      ],
          correctIndex: 2,
          explanation: "Authorization must rely on trusted server-side information."
        },
        {
          question: "Why might an update query include `owner_id = :userId`?",
          options: [
        "To make the UI prettier",
        "To enforce ownership as part of the database operation",
        "To encrypt the password",
        "To disable transactions"
      ],
          correctIndex: 1,
          explanation: "Including the ownership predicate makes the write conditional on ownership."
        }
      ]
    },
    {
      id: "abac-multitenancy",
      title: "Multi-Tenant Authorization and Tenant Isolation",
      durationMinutes: 22,
      explanation: `Multi-tenancy means one application serves multiple organizations or customers while keeping their data logically separated. This is common in SaaS products: Company A and Company B use the same API, but Company A must never read or modify Company B's invoices, users, or reports.
    
    A common tenant model puts \`tenantId\` on business records and derives the current tenant from the authenticated identity or trusted request context. Every tenant-scoped query then includes that tenant boundary. The critical rule is simple: <b>tenant isolation must be enforced on the server and preferably at more than one layer.</b>
    
    A dangerous pattern is accepting \`tenantId\` in a query such as \`/orders?tenantId=company-b\` and trusting it because the user is authenticated. An attacker can change the parameter. Instead, determine the active tenant from authenticated membership and explicit, server-controlled context.
    
    As systems mature, you may add database-level defenses such as PostgreSQL Row-Level Security (RLS), separate schemas, or separate databases. These approaches have different operational costs. Application-level tenant filtering is flexible but depends on developers remembering every filter. Database-level isolation can provide a stronger safety boundary but requires careful connection/session configuration and operational expertise.
    
    Also think about background jobs. A queue worker may not have an HTTP request, so tenant context must be carried explicitly in the job payload and validated before processing.`,
      diagram: `JWT / session
         |
         v
    Tenant context
         |
         +--------------------+
         |                    |
         v                    v
    API authorization     Background jobs
         |                    |
         +----------+---------+
                    v
            Tenant-scoped data
                    |
                    v
              PostgreSQL`,
      codeExample: {
        title: "Tenant-scoped NestJS service",
        code: `@Injectable()
    export class OrderService {
      constructor(private readonly orders: OrderRepository) {}
    
      async listOrders(user: AuthenticatedUser) {
        // tenantId comes from trusted authentication/membership context.
        return this.orders.findMany({
          tenantId: user.tenantId,
        });
      }
    
      async getOrder(user: AuthenticatedUser, orderId: string) {
        const order = await this.orders.findOne({
          id: orderId,
          tenantId: user.tenantId,
        });
    
        if (!order) {
          throw new NotFoundException("Order not found");
        }
    
        return order;
      }
    }`
      },
      keyTakeaways: [
        "Every tenant-scoped read and write needs a tenant boundary.",
        "Never trust a client-provided tenantId as authorization proof.",
        "Tenant context must also be propagated into asynchronous jobs.",
        "Database-level defenses such as PostgreSQL RLS can provide additional isolation.",
        "Test cross-tenant access explicitly; it should always fail."
      ],
      commonMistakes: [
        "Forgetting tenant filtering on one endpoint.",
        "Using a query parameter as the authoritative tenant identity.",
        "Checking tenant membership on reads but not on updates/deletes.",
        "Running background jobs without carrying tenant context.",
        "Assuming ORM abstractions automatically enforce tenant isolation."
      ],
      quiz: [
        {
          question: "Where should a SaaS tenantId normally come from for authorization?",
          options: [
        "An arbitrary query parameter",
        "Trusted authenticated membership/context",
        "The browser title",
        "A CSS attribute"
      ],
          correctIndex: 1,
          explanation: "The server should derive tenant context from trusted identity and membership."
        },
        {
          question: "What is a major risk of missing one tenant predicate?",
          options: [
        "Only slower CSS",
        "Potential cross-tenant data exposure",
        "A TypeScript compile error",
        "Automatic logout"
      ],
          correctIndex: 1,
          explanation: "One missing tenant boundary can expose another customer's data."
        }
      ]
    },
    {
      id: "abac-production",
      title: "ABAC in Production: Policy Composition, Testing, and Auditing",
      durationMinutes: 22,
      explanation: `At production scale, authorization becomes a system of policies rather than a collection of \`if\` statements. You may have rules for tenant membership, ownership, role permissions, resource state, time restrictions, and special support access. The challenge is keeping these rules understandable as they grow.
    
    One useful design is to separate <b>facts</b> from <b>decisions</b>. Facts are things such as “user belongs to tenant A” or “invoice status is paid.” A policy combines those facts and returns a decision. This makes policies easier to unit test and audit.
    
    You should also decide how to handle missing attributes. A secure default is usually deny, especially for attributes that are required for isolation. Avoid “best effort” authorization where missing tenant or ownership information accidentally becomes an allow condition.
    
    Authorization should be observable without logging sensitive data. Record useful audit information such as actor ID, tenant ID, action, resource type, resource ID, decision, and a correlation/request ID. Be careful not to log access tokens, passwords, or confidential medical/financial content.
    
    Finally, test policies as a matrix. For a document policy, test same tenant/same department, same tenant/different department, different tenant, insufficient clearance, missing attributes, administrator exceptions, and resource states. This is much more valuable than testing only the happy path.`,
      diagram: `Business facts
       |
       v
    Policy rules
       |
       +--> tenant boundary
       +--> ownership
       +--> permissions
       +--> resource state
       +--> context
       |
       v
    Decision
      / allow deny
      |
      v
    Audit event`,
      codeExample: {
        title: "Policy result with audit context",
        code: `export type AuthorizationDecision = {
      allowed: boolean;
      reason: string;
    };
    
    @Injectable()
    export class InvoiceAuthorizationService {
      canApprove(
        user: AuthenticatedUser,
        invoice: Invoice,
      ): AuthorizationDecision {
        if (user.tenantId !== invoice.tenantId) {
          return { allowed: false, reason: "tenant_mismatch" };
        }
    
        if (!user.permissions.includes("invoice:approve")) {
          return { allowed: false, reason: "missing_permission" };
        }
    
        if (invoice.status !== "pending") {
          return { allowed: false, reason: "invalid_state" };
        }
    
        return { allowed: true, reason: "policy_allowed" };
      }
    }`
      },
      keyTakeaways: [
        "Default to deny when required authorization facts are missing.",
        "Separate authorization facts from the final decision where practical.",
        "Use policy matrices to test combinations of attributes.",
        "Audit authorization decisions without recording secrets.",
        "As policies grow, consider a dedicated authorization layer or policy engine."
      ],
      commonMistakes: [
        "Returning a generic allow when a required attribute is undefined.",
        "Logging JWTs or sensitive resource contents during authorization debugging.",
        "Testing only successful authorization paths.",
        "Creating policy rules that silently contradict one another."
      ],
      quiz: [
        {
          question: "What is a secure default when a required authorization attribute is missing?",
          options: [
        "Allow",
        "Deny",
        "Guess",
        "Ask the client"
      ],
          correctIndex: 1,
          explanation: "Missing security-critical facts should not become an accidental allow."
        },
        {
          question: "Why are policy matrices useful?",
          options: [
        "They test many combinations of authorization facts and boundaries",
        "They replace databases",
        "They generate passwords",
        "They disable guards"
      ],
          correctIndex: 0,
          explanation: "Authorization bugs often appear in combinations rather than in a single simple rule."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What does ABAC use to make authorization decisions?",
      options: ["Attributes and policy conditions", "Only passwords", "Only database indexes", "Only HTTP methods"],
      correctIndex: 0,
      explanation: "ABAC evaluates attributes against authorization policy."
    },
    {
      question: "Why must tenantId come from trusted server-side context?",
      options: ["Clients can manipulate their own request data", "Browsers cannot send IDs", "PostgreSQL requires it", "NestJS encrypts it"],
      correctIndex: 0,
      explanation: "Client-controlled tenant identifiers cannot prove authorization."
    },
    {
      question: "What is a resource ownership check?",
      options: ["Comparing trusted resource ownership with the authenticated identity", "Checking CSS", "Reading a password", "Checking screen size"],
      correctIndex: 0,
      explanation: "Ownership is a relationship between the caller and resource."
    },
    {
      question: "What should happen when a required authorization attribute is missing?",
      options: ["Normally deny access", "Always allow", "Guess the value", "Ask the browser"],
      correctIndex: 0,
      explanation: "Fail-closed behavior is safer for security-critical facts."
    },
    {
      question: "Can ABAC be combined with RBAC?",
      options: ["Yes", "No", "Only in JavaScript", "Only with GraphQL"],
      correctIndex: 0,
      explanation: "Roles and permissions can be attributes used alongside ownership and tenant policies."
    },
    {
      question: "Why test cross-tenant access explicitly?",
      options: ["A missing tenant filter can expose another customer's data", "It makes queries faster", "It changes passwords", "It disables authentication"],
      correctIndex: 0,
      explanation: "Tenant isolation is a critical security boundary."
    },
    {
      question: "What should authorization audit logs avoid?",
      options: ["Tokens and sensitive content", "Actor ID", "Action", "Decision"],
      correctIndex: 0,
      explanation: "Secrets should not be logged."
    },
    {
      question: "What is a useful production property of a policy?",
      options: ["It is explicit, testable, and deterministic", "It changes randomly", "It trusts the client", "It is hidden in CSS"],
      correctIndex: 0,
      explanation: "Clear deterministic policies are easier to test and audit."
    }
  ],
  project: {
    name: "Multi-Tenant Document Authorization API",
    goal: "Build a NestJS document API protected by ABAC policies for tenant isolation, ownership, department access, and permissions.",
    brief: "Create users, tenants, departments, and documents. Authenticated users can read or update documents only when a centralized policy says the requested action is allowed. The API must protect against cross-tenant access and must not trust tenantId supplied by clients.",
    steps: [
      "Create a Tenant entity and associate users and documents with a tenantId.",
      "Create an authenticated user model containing tenantId, department, roles, permissions, and clearance.",
      "Implement a DocumentPolicy service with separate methods such as canRead, canUpdate, and canDelete.",
      "Add a NestJS guard or authorization layer that loads the resource and delegates the decision to the policy service.",
      "Implement ownership rules for document updates and an administrator exception that is still restricted to the same tenant.",
      "Ensure every document query includes the authenticated tenant boundary.",
      "Add tests for same-tenant access, cross-tenant access, ownership, department mismatch, missing permissions, and missing attributes.",
      "Add an audit event for denied authorization decisions without logging tokens or sensitive document contents."
    ],
    acceptance: [
      "An authenticated user cannot read, update, or delete a document belonging to another tenant.",
      "Changing tenantId in the request body or query cannot bypass the server-side tenant boundary.",
      "Ownership and permission rules are centralized and covered by automated tests.",
      "Unauthorized requests return appropriate 403/404 behavior without leaking cross-tenant resource existence.",
      "Authorization decisions can be traced through safe audit metadata."
    ],
    stretch: [
      "Introduce PostgreSQL Row-Level Security as an additional tenant-isolation layer.",
      "Create a reusable policy framework for multiple resource types.",
      "Add policy versioning and structured authorization audit events.",
      "Benchmark authorization and resource-loading paths under concurrent requests."
    ]
  }
};
