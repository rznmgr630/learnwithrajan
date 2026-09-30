import type { LessonDay } from "@/lib/learn/lesson-types";

export const AUTHENTICATION_PROJECT_DAY_45_LESSONS: LessonDay = {
  day: 45,
  title: "Authentication Project",
  totalMinutes: 148,
  difficulty: "Advanced",
  lessons: [
    {
      id: "project-architecture",
      title: "Authentication Project Architecture and Threat Model",
      durationMinutes: 18,
      explanation: `Today you combine the previous authentication lessons into one production-style NestJS project. The goal is not merely to create a \`/login\` endpoint. The goal is to design an authentication subsystem whose boundaries are understandable and whose security decisions can be tested.
    
    Start with a threat model. Ask what an attacker could steal or manipulate: passwords, authorization codes, refresh tokens, session IDs, reset tokens, verification tokens, OAuth state, PKCE verifiers, or API requests. Then decide where each artifact is stored, how long it lives, how it is invalidated, and what happens if it leaks.
    
    A clean module structure might separate authentication, users, authorization, sessions/tokens, email delivery, and OAuth integration. Controllers should translate HTTP requests into service calls. Services contain business workflows. Guards enforce authentication/authorization at request boundaries. Repositories or ORM services handle persistence.
    
    The project should use secure password hashing, generic account-recovery responses, single-use time-limited verification/reset tokens, refresh-token rotation, RBAC/permissions, and OAuth/OIDC integration. The exact persistence strategy can use PostgreSQL with TypeORM or Prisma, but the security invariants should remain the same.`,
      diagram: `AuthModule
     |
     +--> AuthController
     |      |
     |      +--> AuthService
     |
     +--> PasswordService
     +--> SessionService
     +--> TokenService
     +--> VerificationService
     +--> PasswordResetService
     +--> OAuthService
     +--> AuthorizationService
     |
     v
    PostgreSQL + Email Provider + OIDC Provider`,
      codeExample: {
        title: "Module boundaries",
        code: `@Module({
      imports: [UsersModule, AuthorizationModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        PasswordService,
        SessionService,
        TokenService,
        VerificationService,
        PasswordResetService,
        OAuthService,
      ],
      exports: [AuthService],
    })
    export class AuthModule {}
    
    // Keep workflows in services and keep controllers thin.
    // Guards should enforce authentication/authorization at boundaries.`
      },
      keyTakeaways: [
        "Start the project with a threat model, not just endpoints.",
        "Separate authentication workflows from authorization policy.",
        "Use dedicated services for password, session, verification, reset, and OAuth concerns.",
        "Define the lifetime and revocation behavior of every sensitive artifact.",
        "Security invariants should be testable independently of HTTP details."
      ],
      commonMistakes: [
        "Putting every authentication operation into one giant service.",
        "Treating JWT creation as the whole authentication system.",
        "Skipping threat modeling because a framework is used.",
        "Allowing controllers to implement security rules independently."
      ],
      quiz: [
        {
          question: "What should you define before implementing the project?",
          options: [
        "Threats, sensitive artifacts, trust boundaries, and security invariants",
        "Only UI colors",
        "Only database indexes",
        "Only route names"
      ],
          correctIndex: 0,
          explanation: "A threat model clarifies what must be protected and how."
        },
        {
          question: "Why separate authentication and authorization services?",
          options: [
        "They solve different problems and evolve differently",
        "NestJS requires it for every app",
        "It makes passwords shorter",
        "It disables OAuth"
      ],
          correctIndex: 0,
          explanation: "Authentication establishes identity; authorization controls access."
        }
      ]
    },
    {
      id: "register-login",
      title: "Registration, Password Hashing, Login, and Logout",
      durationMinutes: 22,
      explanation: `Registration should validate the input, normalize identifiers where your product requires it, and hash the password with a password-hashing algorithm designed to resist offline attacks. Never encrypt passwords so they can be recovered. Passwords should be stored only as one-way password hashes with appropriate parameters.
    
    Login should perform credential verification and then establish an authenticated session or issue a carefully designed token set. Avoid revealing whether an email exists in sensitive account-recovery flows. For login, rate limiting and monitoring are important defenses against automated guessing.
    
    Logout depends on the architecture. With server-side sessions, invalidate the session. With refresh-token-based authentication, revoke the refresh token or token family and clear browser cookies. A short-lived access token may remain technically valid until expiry unless your architecture provides revocation or introspection.
    
    Use constant-time or library-provided password verification rather than comparing hashes manually. Do not build password hashing from SHA-256 alone; general-purpose hashes are intentionally fast, which is the opposite of what password storage needs.`,
      diagram: `Register
      |
      v
    Validate -> Hash password -> Store user
                             |
                             v
    Login -> Verify hash -> Create session/token
                             |
                             v
    Logout -> Revoke session/refresh state`,
      codeExample: {
        title: "Password hashing service",
        code: `import * as argon2 from "argon2";
    
    @Injectable()
    export class PasswordService {
      async hash(password: string): Promise<string> {
        return argon2.hash(password);
      }
    
      async verify(hash: string, password: string): Promise<boolean> {
        return argon2.verify(hash, password);
      }
    }
    
    @Injectable()
    export class AuthService {
      constructor(
        private readonly passwords: PasswordService,
        private readonly users: UsersService,
      ) {}
    
      async register(email: string, password: string) {
        const hash = await this.passwords.hash(password);
        return this.users.create({ email, passwordHash: hash });
      }`
      },
      keyTakeaways: [
        "Passwords should be hashed with a password-specific algorithm such as Argon2id or bcrypt with appropriate parameters.",
        "Login should be rate-limited and monitored.",
        "Logout must revoke the state that grants continued access.",
        "Never store plaintext passwords or reversible password encryption.",
        "Do not use fast general-purpose hashes as password storage."
      ],
      commonMistakes: [
        "Storing plaintext passwords.",
        "Hashing with plain SHA-256.",
        "Returning different login errors that enable account enumeration without considering the threat model.",
        "Failing to revoke refresh/session state on logout."
      ],
      quiz: [
        {
          question: "How should passwords be stored?",
          options: [
        "Using a password hashing algorithm",
        "Using reversible encryption",
        "Plaintext",
        "Base64"
      ],
          correctIndex: 0,
          explanation: "Passwords should be stored as slow password hashes."
        },
        {
          question: "What should logout do in a refresh-token/session architecture?",
          options: [
        "Revoke the continuing authentication state and clear client state",
        "Only redirect to home",
        "Change the username",
        "Delete the database"
      ],
          correctIndex: 0,
          explanation: "Logout should invalidate the state that can continue authentication."
        }
      ]
    },
    {
      id: "email-verification",
      title: "Email Verification and Account Lifecycle",
      durationMinutes: 18,
      explanation: `Email verification proves that a user controls a particular email address. It should not be treated as proof of identity beyond that limited claim.
    
    A verification token should be random, high entropy, time-limited, single-use, and stored safely. One common pattern is to store a hash of the token rather than the raw token, so a database leak does not immediately provide usable verification links. The raw token is sent only through the email channel.
    
    When the link is consumed, the server looks up the token hash, checks expiration and unused state, marks the email verified, and invalidates the token. The operation should be safe against repeated clicks and concurrent requests.
    
    Think about account lifecycle states explicitly: unverified, verified, disabled, locked or restricted where applicable. Authentication should not accidentally imply email verification. Authorization policies can then decide which actions require a verified account.`,
      diagram: `Register
       |
       v
    Unverified User
       |
       | random token
       v
    Email Link
       |
       v
    Validate hash + expiry + unused
       |
       v
    Verified User
       |
       v
    Normal authorization`,
      codeExample: {
        title: "Single-use verification token",
        code: `import { createHash, randomBytes } from "node:crypto";
    
    const rawToken = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256")
      .update(rawToken)
      .digest("hex");
    
    await verificationTokens.create({
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30),
    });
    
    // Send rawToken in the email.
    // Store only tokenHash in the database.
    // Mark the token used atomically when verification succeeds.`
      },
      keyTakeaways: [
        "Verification tokens should be random, short-lived, and single-use.",
        "Hashing stored verification tokens limits damage from database exposure.",
        "Email verification is a lifecycle state, not full identity proof.",
        "Consume tokens atomically to prevent double use.",
        "Authorization can require verified email for sensitive features."
      ],
      commonMistakes: [
        "Using predictable user IDs as verification tokens.",
        "Storing raw long-lived verification tokens.",
        "Allowing the same token to be used repeatedly.",
        "Treating email verification as permission to access every resource."
      ],
      quiz: [
        {
          question: "Why hash verification tokens in the database?",
          options: [
        "A database leak should not directly reveal usable tokens",
        "It makes email faster",
        "It replaces passwords",
        "It disables expiration"
      ],
          correctIndex: 0,
          explanation: "The raw token is delivered out of band; only its hash needs to be stored."
        },
        {
          question: "What should happen after a verification token is successfully consumed?",
          options: [
        "It becomes unusable",
        "It lasts forever",
        "It becomes a password",
        "It grants admin role"
      ],
          correctIndex: 0,
          explanation: "Verification tokens should be single-use."
        }
      ]
    },
    {
      id: "password-reset",
      title: "Forgot Password and Secure Password Reset",
      durationMinutes: 22,
      explanation: `Password reset is one of the most security-sensitive account-recovery workflows because it can become an alternate login path. The recovery flow should be designed with the same care as login.
    
    A user submits an email address. The application should generally return a generic response such as “If an account exists, we sent instructions,” so attackers cannot easily enumerate registered accounts. A random, high-entropy reset token is generated and sent through the verified email channel. The token should be short-lived and single-use.
    
    When the reset link is submitted, validate the token and allow the user to set a new password. After a successful reset, invalidate existing sessions and refresh tokens where the product's security model requires it. This prevents an attacker who already stole an old session from remaining logged in after the password has been changed.
    
    Be careful about reset-token URLs. The token is a credential. Avoid logging it, avoid placing it in analytics data, and consider a frontend exchange pattern that minimizes exposure. The reset page should not execute third-party scripts that could accidentally capture the token from the URL.`,
      diagram: `Forgot password
          |
          v
    Generic response
          |
          +--> random reset token
          |
          v
    Email
          |
          v
    Short-lived single-use token
          |
          v
    Set new password
          |
          v
    Revoke sessions / refresh tokens`,
      codeExample: {
        title: "Password reset workflow",
        code: `async requestPasswordReset(email: string) {
      const user = await this.users.findByEmail(email);
    
      // Return the same public response whether or not the account exists.
      if (!user) {
        return { message: "If the account exists, instructions were sent." };
      }
    
      const rawToken = randomBytes(32).toString("base64url");
      const tokenHash = sha256(rawToken);
    
      await this.resetTokens.create({
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15),
      });
    
      await this.mail.sendPasswordReset(user.email, rawToken);
    
      return { message: "If the account exists, instructions were sent." };
    }`
      },
      keyTakeaways: [
        "Password reset is an alternate authentication path and must be protected accordingly.",
        "Use generic public responses to reduce account enumeration.",
        "Reset tokens should be random, short-lived, and single-use.",
        "After password reset, consider revoking existing authentication sessions.",
        "Never log reset tokens."
      ],
      commonMistakes: [
        "Returning “email does not exist.”",
        "Using the user's ID as a reset token.",
        "Making reset tokens long-lived.",
        "Keeping all old sessions alive after a high-risk password reset."
      ],
      quiz: [
        {
          question: "Why should forgot-password responses usually be generic?",
          options: [
        "To reduce account enumeration",
        "To hide database errors",
        "To prevent hashing",
        "To avoid email delivery"
      ],
          correctIndex: 0,
          explanation: "Different responses can reveal whether an account exists."
        },
        {
          question: "What should a successful password reset generally trigger?",
          options: [
        "New password plus appropriate session/refresh-token invalidation",
        "Automatic admin access",
        "Permanent reset token validity",
        "No change"
      ],
          correctIndex: 0,
          explanation: "Reset should invalidate continuing access when appropriate."
        }
      ]
    },
    {
      id: "rbac-permissions",
      title: "RBAC, Permissions, and NestJS Guards",
      durationMinutes: 20,
      explanation: `Role-Based Access Control (RBAC) groups permissions into roles. For example, \`support_agent\` may have \`ticket:read\` and \`ticket:update\`, while \`billing_admin\` may have \`invoice:read\` and \`invoice:approve\`.
    
    Permissions are usually more useful at the application boundary than role names. A controller can require \`invoice:approve\`, and a guard can evaluate whether the authenticated user has that permission. This keeps route code independent from the exact role composition.
    
    However, RBAC does not replace ABAC from Day 41. A user may have \`invoice:read\` but still be forbidden from reading an invoice belonging to another tenant. A production authorization decision often combines permission + tenant + ownership/resource state.
    
    In NestJS, metadata decorators can declare required permissions and a guard can enforce them. Keep the guard focused on authorization mechanics. The business policy layer should handle resource-specific conditions when needed.`,
      diagram: `@RequirePermission("invoice:approve")
              |
              v
    Permission Guard
              |
              v
    User permissions
              |
              v
    Resource Policy
              |
              +--> tenant / ownership / state
              |
              v
           ALLOW / DENY`,
      codeExample: {
        title: "Permission decorator and guard",
        code: `import { SetMetadata } from "@nestjs/common";
    
    export const REQUIRE_PERMISSION = "require_permission";
    export const RequirePermission = (permission: string) =>
      SetMetadata(REQUIRE_PERMISSION, permission);
    
    @Injectable()
    export class PermissionGuard implements CanActivate {
      constructor(
        private readonly reflector: Reflector,
      ) {}
    
      canActivate(context: ExecutionContext): boolean {
        const permission = this.reflector.get<string>(
          REQUIRE_PERMISSION,
          context.getHandler(),
        );
    
        if (!permission) return true;
    
        const request = context.switchToHttp().getRequest();
        return request.user.permissions.includes(permission);
      }
    }
    
    @RequirePermission("invoice:approve")
    @Post(":id/approve")
    approveInvoice() {
      // Resource-level tenant/state checks can run in the policy layer.
    }`
      },
      keyTakeaways: [
        "RBAC groups permissions into roles.",
        "Permission checks are often more stable than role-name checks in controllers.",
        "RBAC and ABAC can be combined.",
        "NestJS metadata and guards provide a clean route-level authorization mechanism.",
        "Resource-level authorization still needs tenant, ownership, and state checks."
      ],
      commonMistakes: [
        "Checking role strings throughout business logic.",
        "Assuming one permission means access to every resource.",
        "Allowing a client to submit its own permissions.",
        "Putting all resource policy logic into a generic permission guard."
      ],
      quiz: [
        {
          question: "What is a permission?",
          options: [
        "A specific allowed action such as invoice:approve",
        "A password",
        "A database connection",
        "A cookie flag"
      ],
          correctIndex: 0,
          explanation: "Permissions describe actions that can be granted."
        },
        {
          question: "Can RBAC alone guarantee tenant isolation?",
          options: [
        "No; resource and tenant policies may still be required",
        "Yes, always",
        "Only for PostgreSQL",
        "Only in development"
      ],
          correctIndex: 0,
          explanation: "Roles do not inherently encode every resource boundary."
        }
      ]
    },
    {
      id: "oauth-oidc-project",
      title: "OAuth/OIDC Integration and Account Linking",
      durationMinutes: 22,
      explanation: `Your project should now connect external identity to the local authentication system. Use Authorization Code + PKCE for interactive OAuth/OIDC login. Validate the provider's tokens and use issuer + subject as the stable external identity.
    
    The local account model can support multiple external identities. For example, one user may connect an enterprise OIDC provider and a second provider. Store each external identity separately and link it to the same local user only through an explicit trusted flow.
    
    Do not automatically create an administrator role because an external provider says \`groups: ["admins"]\`. Map external groups to internal permissions through explicit configuration, and apply tenant membership rules.
    
    The project should also distinguish OAuth authorization from OIDC authentication. If the provider gives you an access token for a third-party API, that token may be useful for that API but is not automatically proof of the local user's identity. OIDC ID-token validation establishes the identity layer.`,
      diagram: `Browser
      |
      v
    OIDC Provider
      |
      +--> code + PKCE
      |
      v
    NestJS callback
      |
      +--> validate ID token
      |
      +--> issuer + subject
      |
      v
    ExternalIdentity
      |
      v
    Local User
      |
      v
    RBAC + ABAC`,
      codeExample: {
        title: "External identity linking",
        code: `type ExternalIdentity = {
      issuer: string;
      subject: string;
      providerName: string;
      userId: string;
    };
    
    async function signInWithOidc(
      claims: { iss: string; sub: string; email?: string },
    ) {
      let identity = await identities.findByIssuerAndSubject(
        claims.iss,
        claims.sub,
      );
    
      if (!identity) {
        // Account creation/linking policy must be explicit.
        const user = await users.findOrCreateFromVerifiedEmail(claims.email);
        identity = await identities.create({
          issuer: claims.iss,
          subject: claims.sub,
          providerName: "example-idp",
          userId: user.id,
        });
      }
    
      return users.findById(identity.userId);
    }`
      },
      keyTakeaways: [
        "Use Authorization Code + PKCE for interactive OIDC login.",
        "Validate ID tokens before using their identity claims.",
        "Use issuer + subject as the external identity key.",
        "External groups should map explicitly to internal permissions.",
        "Account linking must be deliberate; do not silently merge identities."
      ],
      commonMistakes: [
        "Using an access token as an ID token.",
        "Auto-linking by email without a secure linking policy.",
        "Granting admin rights from an unverified group claim.",
        "Skipping local tenant and permission checks after OIDC login."
      ],
      quiz: [
        {
          question: "What should identify an OIDC external identity?",
          options: [
        "issuer + subject",
        "display name",
        "password",
        "browser language"
      ],
          correctIndex: 0,
          explanation: "Issuer + subject is the stable external identity pair."
        },
        {
          question: "After OIDC login, should the local application skip authorization?",
          options: [
        "No; local roles, permissions, tenant, and resource policies still apply",
        "Yes",
        "Only admins need authorization",
        "Only on weekends"
      ],
          correctIndex: 0,
          explanation: "External authentication does not replace application authorization."
        }
      ]
    },
    {
      id: "project-testing-production",
      title: "Authentication Testing, Revocation, and Production Hardening",
      durationMinutes: 24,
      explanation: `The final step is proving that the system remains secure when things go wrong. Write tests for every authentication state transition and security boundary.
    
    Unit tests should cover password hashing, token generation, policy decisions, expiration, and permission checks. Integration tests should exercise registration, verification, login, refresh, logout, password reset, OAuth callback, and authorization. Security tests should deliberately attempt invalid state, expired reset tokens, reused verification tokens, wrong tenant access, wrong permissions, replayed refresh tokens, and fixed sessions.
    
    Revocation is especially important. Decide what “logout” means in your architecture. If access tokens are self-contained and short-lived, logout may primarily revoke refresh/session state. If immediate invalidation is required, add a server-side session or token status mechanism.
    
    Production hardening also includes rate limiting, safe error messages, secure cookies, HTTPS, audit logging, monitoring, dependency updates, secret management, and alerting. The project is complete only when the failure paths are intentionally designed.`,
      diagram: `Tests
     |
     +--> Registration
     +--> Login
     +--> Logout
     +--> Refresh
     +--> Verification
     +--> Reset
     +--> OAuth/OIDC
     +--> RBAC
     +--> ABAC
     |
     v
    Security invariants
     |
     v
    Production deployment`,
      codeExample: {
        title: "End-to-end authentication test",
        code: `it("revokes refresh access after logout", async () => {
      const login = await request(app.getHttpServer())
        .post("/auth/login")
        .send({ email, password });
    
      const refreshToken = login.body.refreshToken;
    
      await request(app.getHttpServer())
        .post("/auth/logout")
        .set("Authorization", \`Bearer \${login.body.accessToken}\`)
        .send();
    
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken });
    
      expect(response.status).toBe(401);
    });
    
    it("rejects cross-tenant access", async () => {
      const response = await request(app.getHttpServer())
        .get(\`/orders/\${otherTenantOrderId}\`)
        .set("Authorization", \`Bearer \${tenantAToken}\`);
    
      expect(response.status).toBe(404);
    });`
      },
      keyTakeaways: [
        "Test security boundaries, not just happy paths.",
        "Define exactly what logout and revocation mean for your token architecture.",
        "Test token reuse, expiration, cross-tenant access, and permission failures.",
        "Use integration tests for complete authentication workflows.",
        "Production hardening includes rate limits, secure configuration, secret management, monitoring, and safe logs."
      ],
      commonMistakes: [
        "Only testing successful login.",
        "Testing authorization only through mocked guards.",
        "Assuming logout invalidates already-issued self-contained access tokens automatically.",
        "Skipping tests for concurrency and token reuse."
      ],
      quiz: [
        {
          question: "What should an authentication test suite emphasize?",
          options: [
        "State transitions, invalid credentials, token lifecycle, and authorization boundaries",
        "Only successful registration",
        "Only frontend rendering",
        "Only database migrations"
      ],
          correctIndex: 0,
          explanation: "Security failures often occur at state transitions and boundaries."
        },
        {
          question: "What may logout revoke in a short-lived access-token architecture?",
          options: [
        "Refresh/session state while access tokens expire naturally",
        "Nothing ever",
        "The user's password hash",
        "The database schema"
      ],
          correctIndex: 0,
          explanation: "Many systems revoke the continuing authentication mechanism and let short-lived access tokens expire."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "Which artifact should never be stored as plaintext in the database?",
      options: ["User password", "Public user ID", "Tenant ID", "Display name"],
      correctIndex: 0,
      explanation: "Passwords must be securely hashed."
    },
    {
      question: "Why should verification and reset tokens be single-use?",
      options: ["To prevent reuse after consumption or theft", "To improve CSS", "To make passwords reversible", "To skip expiration"],
      correctIndex: 0,
      explanation: "Single-use limits the value of a captured token."
    },
    {
      question: "What is the purpose of a refresh token?",
      options: ["Obtain a new access token without repeating the full interactive login flow", "Identify a database row", "Replace RBAC", "Render HTML"],
      correctIndex: 0,
      explanation: "Refresh tokens support continued sessions."
    },
    {
      question: "Why combine RBAC with ABAC?",
      options: ["Roles/permissions handle broad capabilities while resource policies handle context such as tenant and ownership", "They are identical", "ABAC hashes passwords", "RBAC prevents XSS"],
      correctIndex: 0,
      explanation: "Real applications often need both permission and resource-context decisions."
    },
    {
      question: "What should identify an OIDC external account?",
      options: ["Issuer + subject", "Email only", "Display name", "IP address"],
      correctIndex: 0,
      explanation: "Issuer + subject is the stable provider identity pair."
    },
    {
      question: "What should a forgot-password endpoint generally return for unknown email?",
      options: ["The same generic public response used for known accounts", "The exact database error", "The user's password", "A different HTTP page revealing the account"],
      correctIndex: 0,
      explanation: "Generic responses reduce account enumeration."
    },
    {
      question: "What should happen after successful login to an existing session-based application?",
      options: ["Rotate the session identifier", "Reuse the anonymous session ID", "Disable HTTPS", "Log the password"],
      correctIndex: 0,
      explanation: "Session rotation prevents session fixation."
    },
    {
      question: "What should a production test suite include?",
      options: ["Happy paths and deliberate attacks/failure paths", "Only UI snapshots", "Only compilation", "Only database schema tests"],
      correctIndex: 0,
      explanation: "Security behavior must be tested under failure and attack conditions."
    },
    {
      question: "Does OIDC login automatically grant application permissions?",
      options: ["No; the application still applies its own authorization", "Yes, always", "Only if email exists", "Only for GET requests"],
      correctIndex: 0,
      explanation: "Identity and application authorization are separate."
    },
    {
      question: "What is a good production rule for authentication secrets in logs?",
      options: ["Do not log passwords, tokens, reset codes, or session identifiers", "Log everything", "Log only refresh tokens", "Log passwords during debugging"],
      correctIndex: 0,
      explanation: "Secrets in logs create another credential exposure surface."
    }
  ],
  project: {
    name: "Production-Grade NestJS Authentication System",
    goal: "Build a complete authentication and authorization subsystem combining registration, login, logout, refresh tokens, email verification, password recovery, RBAC, permissions, OAuth/OIDC, and production security controls.",
    brief: "Build the final authentication project as a reusable NestJS module backed by PostgreSQL. The system should support local authentication and external OIDC login while enforcing RBAC, permissions, tenant/resource authorization, secure token/session lifecycles, and comprehensive security tests.",
    steps: [
      "Design the PostgreSQL data model for users, sessions or refresh tokens, verification tokens, password-reset tokens, roles, permissions, role-permission mappings, and external identities.",
      "Implement registration with DTO validation, secure password hashing, duplicate-account handling, and an unverified account state.",
      "Implement login with rate limiting, password verification, authentication state checks, and secure session/access-token creation.",
      "Implement logout that invalidates the appropriate session or refresh-token state and clears browser authentication cookies where applicable.",
      "Implement refresh-token rotation and reuse detection, or an equivalent secure session renewal strategy.",
      "Implement email verification using random, hashed, short-lived, single-use tokens.",
      "Implement forgot-password and reset-password with generic responses, short-lived single-use tokens, and appropriate session invalidation after reset.",
      "Implement RBAC and permissions with NestJS decorators/guards, then combine them with tenant and resource policies.",
      "Implement OAuth/OIDC Authorization Code + PKCE, validate issuer/audience/signature/expiration, support discovery/JWKS, and map issuer+subject to local users.",
      "Apply secure cookies, CSRF protection where cookie authentication requires it, safe HTML handling, rate limiting, security headers, and safe structured logging.",
      "Write unit, integration, and end-to-end tests for success paths, invalid credentials, token expiration, token reuse, reset/verification replay, cross-tenant access, permission failures, OAuth failures, and session fixation.",
      "Prepare production configuration for secrets, email delivery, database migrations, HTTPS, monitoring, audit logs, and alerting."
    ],
    acceptance: [
      "Users can register, verify email, log in, log out, refresh authentication, request password reset, and set a new password.",
      "Verification and reset credentials are random, short-lived, single-use, and never logged.",
      "Refresh/session state can be revoked and reused refresh credentials are rejected when rotation is enabled.",
      "RBAC and permission checks work through NestJS guards and cannot bypass tenant/resource policies.",
      "OAuth/OIDC login validates the provider correctly and maps external identities by issuer + subject.",
      "Cross-tenant reads and writes are rejected.",
      "Authentication cookies use intentional Secure, HttpOnly, and SameSite settings where cookies are used.",
      "Security tests cover CSRF, XSS-sensitive rendering paths, session fixation, replay, token expiration, and authorization boundaries.",
      "Secrets and authentication credentials are absent from logs."
    ],
    stretch: [
      "Add multi-provider OIDC support with provider-specific configuration.",
      "Implement device/session management showing active sessions and allowing individual revocation.",
      "Add refresh-token family rotation and automatic reuse detection.",
      "Add PostgreSQL Row-Level Security for tenant isolation.",
      "Add an audit-log pipeline with immutable security events and alerting.",
      "Containerize the application and deploy it behind HTTPS with production secrets management and observability."
    ]
  }
};
