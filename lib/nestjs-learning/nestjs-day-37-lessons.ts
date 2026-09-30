import type { LessonDay } from "@/lib/learn/lesson-types";

export const PASSPORT_DAY_37_LESSONS: LessonDay = {
  day: 37,
  title: "Passport",
  totalMinutes: 200,
  difficulty: "Advanced",
  lessons: [
    {
      id: "passport-overview",
      title: "Passport and Strategy Architecture",
      durationMinutes: 35,
      explanation: `<b>Passport gives NestJS a strategy-based way to authenticate requests.</b>

Imagine an e-commerce API that accepts email/password login today and bearer JWTs on protected routes. You could write all of that directly inside controllers, but authentication code would quickly become duplicated and difficult to test.

Passport solves this by separating authentication mechanisms into <b>strategies</b>.

A strategy answers: <b>"How do I validate this kind of credential?"</b>

A local strategy validates credentials such as email and password. A JWT strategy validates a bearer token.

NestJS connects those strategies to requests through guards.

<pre>
HTTP Request
    |
    v
AuthGuard
    |
    v
Passport
    |
    v
Strategy
    |
    v
validate(...)
    |
    v
request.user
</pre>

Passport is not your database, password hashing system, authorization system, or complete security architecture. It is an authentication integration layer.

<b>Why is this separation useful?</b>

Your business services should not care whether the user arrived through a password login, a JWT, or another supported mechanism. They should receive a trusted identity and then perform business work.

That makes the application easier to change. For example, adding a mobile authentication flow should not require rewriting every order controller.

A strategy should remain focused. It extracts and validates its credential, then returns an identity. Password hashing, user lookup, token issuance, session management, and authorization can live in dedicated services.

This separation becomes particularly important in production because authentication has different security and operational requirements from normal business logic.`,
      diagram: `Request
   |
   v
AuthGuard
   |
   v
Passport
   |
   +--------+--------+
   |                 |
   v                 v
LocalStrategy    JwtStrategy
   |                 |
   v                 v
Password          Bearer JWT
   |                 |
   +--------+--------+
            |
            v
        request.user
            |
            v
        Controller
`,
      codeExample: {
        title: "Basic Passport Strategy",
        code: `@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  async validate(email: string, password: string) {
    // Keep credential verification in AuthService.
    return this.authService.validateUser(email, password);
  }
}

// A successful validate() result becomes the authenticated identity
// used by Passport/NestJS downstream.
`,
      },
      keyTakeaways: [
        "Passport organizes authentication around strategies.",
        "A strategy should focus on validating one credential mechanism.",
        "Guards connect Passport authentication to the NestJS request lifecycle.",
        "Passport does not replace authorization or secure password storage."
],
      commonMistakes: [
        "<b>Putting every security rule inside a strategy.</b> Authentication and authorization have different responsibilities.",
        "<b>Building a giant strategy.</b> Delegate database access and credential verification to focused services.",
        "<b>Assuming Passport secures every route automatically.</b> Protected routes still need guards and tests."
],
      quiz: [
        {
                "question": "What does a Passport strategy represent?",
                "options": [
                        "A database table",
                        "A particular authentication mechanism",
                        "A PostgreSQL transaction",
                        "A DTO"
                ],
                "correctIndex": 1,
                "explanation": "A strategy encapsulates how one kind of credential is authenticated."
        },
        {
                "question": "What commonly becomes available after successful Passport authentication?",
                "options": [
                        "request.user",
                        "request.password",
                        "process.env.DATABASE_URL",
                        "The database schema"
                ],
                "correctIndex": 0,
                "explanation": "The authenticated identity returned by the strategy is normally exposed as request.user."
        }
],
    },
    {
      id: "local-strategy",
      title: "Local Strategy and Login",
      durationMinutes: 35,
      explanation: `<b>Local strategy is commonly used for email/password authentication.</b>

The client sends credentials to a login endpoint. Passport extracts them and calls the strategy's \`validate()\` method.

The strategy should not contain the entire login workflow. It delegates to an authentication service:

<pre>
email/password
     |
     v
LocalStrategy
     |
     v
AuthService
     |
     +--> find user
     +--> verify password hash
     |
     v
authenticated user
</pre>

If the user does not exist or the password is incorrect, authentication should fail. Usually the public response should be generic, such as "Invalid credentials." Revealing "this email exists" can help attackers enumerate accounts.

The password itself should never be stored. The user record contains a password hash produced by a password-hashing algorithm such as Argon2id or bcrypt.

After local authentication succeeds, the login controller can create a session or issue access and refresh credentials. The local strategy does not need to know how those credentials are later used.

<b>Production lesson:</b> keep the strategy thin. It is an adapter between Passport and your authentication service, not a replacement for your authentication architecture.`,
      diagram: `POST /auth/login
       |
       v
LocalAuthGuard
       |
       v
LocalStrategy
       |
       v
AuthService
   /       \
User DB   Password Hash
   \       /
    v     v
 authenticated user
       |
       v
request.user
       |
       v
Login Controller
       |
       v
tokens/session
`,
      codeExample: {
        title: "LocalStrategy with Password Verification",
        code: `@Injectable()
export class AuthService {
  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const valid = await this.passwords.verify(
      user.passwordHash,
      password,
    );

    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "email" });
  }

  validate(email: string, password: string) {
    return this.authService.validateUser(email, password);
  }
}
`,
      },
      keyTakeaways: [
        "LocalStrategy is appropriate for application-managed email/password login.",
        "Password verification belongs in a dedicated service.",
        "Return a minimal identity instead of exposing password hashes downstream.",
        "Generic login failures reduce unnecessary account-enumeration information."
],
      commonMistakes: [
        "<b>Returning passwordHash.</b> Authentication consumers should not need it.",
        "<b>Using fast SHA-256 as a password hash.</b> Password storage needs a deliberately expensive password-hashing algorithm.",
        "<b>Revealing whether an email exists.</b> Keep public credential errors generic.",
        "<b>Issuing tokens from password-verification code.</b> Separate credential verification from token/session lifecycle."
],
      quiz: [
        {
                "question": "Where should password verification normally live?",
                "options": [
                        "Every controller",
                        "A focused password/authentication service",
                        "The JWT payload",
                        "The database schema"
                ],
                "correctIndex": 1,
                "explanation": "A focused service makes password verification reusable and testable."
        },
        {
                "question": "Why use a generic invalid-credentials response?",
                "options": [
                        "To reduce account-enumeration information",
                        "To make JWTs smaller",
                        "To replace rate limiting",
                        "To disable validation"
                ],
                "correctIndex": 0,
                "explanation": "Attackers learn less about which accounts exist."
        }
],
    },
    {
      id: "jwt-strategy",
      title: "JWT Strategy",
      durationMinutes: 35,
      explanation: `<b>JWT strategy handles bearer access tokens on protected APIs.</b>

A client typically sends:

<pre>
Authorization: Bearer eyJ...
</pre>

The JWT strategy extracts the token, verifies its signature and relevant claims, and returns an identity.

Do not confuse decoding with verification. Anyone holding a JWT can generally decode its payload. Authentication requires cryptographic verification plus validation of claims such as expiration, issuer, audience, and token purpose.

A useful pattern is to use \`sub\` as the stable user identifier and then load current account state when required.

Why? A token may have been issued when a user was active, but the account may later be suspended. A purely stateless token check cannot know that unless the system consults current state or uses another revocation mechanism.

The strategy should also reject refresh credentials presented as access tokens. Give credentials explicit purposes and verify them.

Whether you load the user on every request is an architectural trade-off involving database load, latency, revocation needs, and authorization freshness.`,
      diagram: `Authorization: Bearer JWT
          |
          v
     JwtAuthGuard
          |
          v
      JwtStrategy
          |
     +----+----+
     |         |
 verify     validate
     |         |
     +----+----+
          |
          v
     request.user
`,
      codeExample: {
        title: "JwtStrategy with Claim Validation",
        code: `@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly users: UsersService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>("JWT_ACCESS_SECRET"),
      issuer: config.getOrThrow<string>("JWT_ISSUER"),
      audience: config.getOrThrow<string>("JWT_AUDIENCE"),
    });
  }

  async validate(payload: { sub: number; type: string }) {
    if (payload.type !== "access") {
      throw new UnauthorizedException("Invalid token type");
    }

    const user = await this.users.findActiveById(payload.sub);

    if (!user) {
      throw new UnauthorizedException("User is not active");
    }

    return { id: user.id, role: user.role };
  }
}
`,
      },
      keyTakeaways: [
        "JWT strategy authenticates bearer access credentials.",
        "Signature verification must use explicitly trusted keys and algorithms.",
        "Token purpose, issuer, audience, and expiration should be validated according to application requirements.",
        "Current user lookup can improve control over suspension and rapidly changing account state."
],
      commonMistakes: [
        "<b>Trusting decoded payloads.</b> Decoding is not authentication.",
        "<b>Accepting arbitrary algorithms.</b> Verification policy must be explicit.",
        "<b>Accepting refresh tokens at API routes.</b> Token purpose must be checked.",
        "<b>Ignoring current account status.</b> A valid old token does not necessarily mean the account is still active."
],
      quiz: [
        {
                "question": "What does a JWT strategy normally process?",
                "options": [
                        "A bearer access token",
                        "A database migration",
                        "A password hash response",
                        "A CSS file"
                ],
                "correctIndex": 0,
                "explanation": "JWT strategy commonly extracts and verifies a bearer token."
        },
        {
                "question": "Why might JwtStrategy query current user state?",
                "options": [
                        "To handle account status or authorization changes",
                        "To decode Base64",
                        "To create a password salt",
                        "To replace HTTPS"
                ],
                "correctIndex": 0,
                "explanation": "Current state can prevent suspended or otherwise invalid accounts from remaining authenticated."
        }
],
    },
    {
      id: "authguard",
      title: "AuthGuard and Route Protection",
      durationMinutes: 30,
      explanation: `<b>AuthGuard connects Passport to NestJS's request pipeline.</b>

A strategy defines how credentials are validated. A guard decides when that authentication mechanism runs.

For example:

<pre>
@UseGuards(AuthGuard("jwt"))
@Get("orders")
getOrders() {}
</pre>

When the request arrives, the guard invokes Passport. If authentication fails, the controller handler normally never executes. If it succeeds, the authenticated identity is available downstream.

This creates a useful security boundary:

<pre>
Request
  |
  v
AuthGuard
  |
  +---- failure -> 401
  |
  v
Passport Strategy
  |
  +---- failure -> 401
  |
  v
request.user
  |
  v
Authorization
  |
  v
Controller
</pre>

Do not assume authentication means authorization. A valid user can still be forbidden from deleting a product or reading another customer's order.

You also need to decide which routes are public. Login and registration must be accessible before authentication exists. Protected routes should be explicit and tested.

A common production pattern is to create a dedicated \`JwtAuthGuard\` class rather than repeating \`AuthGuard("jwt")\` everywhere. That creates one named place for route authentication behavior.`,
      diagram: `HTTP Request
     |
     v
 JwtAuthGuard
     |
     v
 Passport Strategy
     |
     +---- reject -> 401
     |
     v
 request.user
     |
     v
 Authorization Guard
     |
     +---- reject -> 403
     |
     v
 Controller
`,
      codeExample: {
        title: "Protected NestJS Route",
        code: `@Controller("orders")
export class OrdersController {
  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Req() request: AuthenticatedRequest) {
    // Identity comes from verified authentication state.
    return this.orders.findForUser(request.user.id);
  }

  @Get("public-count")
  async publicCount() {
    return this.orders.countPublicOrders();
  }
}
`,
      },
      keyTakeaways: [
        "AuthGuard enforces authentication before protected handlers execute.",
        "Authentication and authorization are separate checks.",
        "Use the verified request identity instead of trusting arbitrary user IDs.",
        "Public and protected routes should be intentional and tested."
],
      commonMistakes: [
        "<b>Protecting login itself.</b> Public login must be reachable before authentication.",
        "<b>Checking request.user manually in every controller.</b> Guards centralize the boundary.",
        "<b>Assuming authentication implies permission.</b> Authorization still needs explicit rules.",
        "<b>Not testing 401 and 403 behavior.</b> Security failures are part of the API contract."
],
      quiz: [
        {
                "question": "What is the main purpose of AuthGuard in this architecture?",
                "options": [
                        "Connect authentication to the request lifecycle",
                        "Hash passwords",
                        "Create database tables",
                        "Send emails"
                ],
                "correctIndex": 0,
                "explanation": "The guard runs authentication before the protected handler."
        },
        {
                "question": "What should happen if a valid user lacks permission for a route?",
                "options": [
                        "Authorization should deny access",
                        "The user should be authenticated again with the same token",
                        "The password should be returned",
                        "The route should ignore the rule"
                ],
                "correctIndex": 0,
                "explanation": "Authentication establishes identity; authorization decides whether the action is allowed."
        }
],
    },
    {
      id: "passport-production",
      title: "Production Passport Architecture and Testing",
      durationMinutes: 30,
      explanation: `<b>Passport is one component of a production authentication architecture.</b>

A maintainable NestJS application might separate:

<pre>
AuthController
AuthService
PasswordService
TokenService
SessionService
LocalStrategy
JwtStrategy
JwtAuthGuard
AuthorizationService
</pre>

The controller handles HTTP concerns. The authentication service coordinates login workflows. PasswordService verifies password hashes. TokenService handles token creation. SessionService handles long-lived authentication state. Strategies adapt Passport to the application. Guards enforce request-level security.

<b>Testing should happen at multiple levels.</b>

Unit tests can verify that LocalStrategy rejects invalid credentials and JwtStrategy rejects wrong token types or inactive users.

End-to-end tests should verify real HTTP behavior: an unprotected request is rejected, a valid access token reaches a controller, and authorization failures return the expected status.

<b>Configuration is security-sensitive.</b>

JWT keys should come from secure configuration. Never commit production secrets or log bearer tokens.

Finally, keep business services independent from Passport where practical. If your order service knows about \`PassportStrategy\`, your authentication framework has leaked into business logic. Prefer passing trusted identity and authorization decisions into business operations.`,
      diagram: `HTTP
 |
 v
Guards
 |
 +--> LocalStrategy
 +--> JwtStrategy
 |
 v
Authentication Services
 |
 +--> Users
 +--> Passwords
 +--> Tokens
 +--> Sessions
 |
 v
Authorization
 |
 v
Business Services
`,
      codeExample: {
        title: "Testing the Authentication Boundary",
        code: `describe("JWT strategy", () => {
  it("rejects refresh credentials on access routes", async () => {
    const strategy = createJwtStrategy();

    await expect(
      strategy.validate({
        sub: 42,
        type: "refresh",
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("rejects inactive users", async () => {
    const strategy = createJwtStrategyWithInactiveUser();

    await expect(
      strategy.validate({
        sub: 42,
        type: "access",
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});

// Add e2e tests that call the real HTTP routes as well.
`,
      },
      keyTakeaways: [
        "Passport should remain an authentication boundary, not the whole security architecture.",
        "Unit tests and HTTP-level tests catch different classes of authentication bugs.",
        "Keep secrets in secure configuration and never log reusable credentials.",
        "Business services should not depend heavily on Passport implementation details."
],
      commonMistakes: [
        "<b>Testing only successful login.</b> Invalid credentials and malformed tokens are security-critical cases.",
        "<b>Hard-coding JWT keys.</b> Production key management requires secure configuration and rotation.",
        "<b>Logging Authorization headers.</b> Request logging can accidentally expose bearer credentials.",
        "<b>Coupling business logic to Passport classes.</b> Keep framework-specific code near the authentication boundary."
],
      quiz: [
        {
                "question": "Why are e2e authentication tests important?",
                "options": [
                        "They verify the real HTTP guard/strategy boundary",
                        "They replace password hashing",
                        "They make JWTs encrypted",
                        "They remove authorization"
                ],
                "correctIndex": 0,
                "explanation": "End-to-end tests verify the actual request pipeline rather than only isolated classes."
        },
        {
                "question": "Where should JWT signing secrets normally come from?",
                "options": [
                        "Committed source code",
                        "Secure application configuration or secret management",
                        "The URL",
                        "The user's role"
                ],
                "correctIndex": 1,
                "explanation": "Signing keys are sensitive configuration and should not be hard-coded in source control."
        }
],
    }
  ],
  finalQuiz: [
    {
        "question": "What is Passport's main role in a NestJS authentication architecture?",
        "options": [
            "Provide strategy-based credential authentication",
            "Replace PostgreSQL",
            "Define business permissions",
            "Hash every password itself"
        ],
        "correctIndex": 0,
        "explanation": "Passport provides a strategy-based authentication integration; it does not replace the rest of the security architecture."
    },
    {
        "question": "Which strategy is appropriate for email/password login?",
        "options": [
            "LocalStrategy",
            "JwtStrategy",
            "RolesGuard",
            "Reflector"
        ],
        "correctIndex": 0,
        "explanation": "LocalStrategy is designed for credentials such as username/email and password."
    },
    {
        "question": "What does JwtStrategy typically validate?",
        "options": [
            "Bearer JWT credentials",
            "Database migrations",
            "HTML forms",
            "Password reset emails"
        ],
        "correctIndex": 0,
        "explanation": "JwtStrategy verifies bearer JWT credentials and their relevant claims."
    },
    {
        "question": "What is the relationship between authentication and authorization?",
        "options": [
            "Authentication establishes identity; authorization determines allowed actions",
            "They are identical",
            "Authorization always happens before authentication",
            "Authentication only applies to admins"
        ],
        "correctIndex": 0,
        "explanation": "The two layers solve different security problems."
    },
    {
        "question": "Why should a strategy usually delegate database and password work to services?",
        "options": [
            "To keep authentication mechanism code focused and testable",
            "Because strategies cannot use TypeScript",
            "To disable authorization",
            "To avoid all database access"
        ],
        "correctIndex": 0,
        "explanation": "Focused responsibilities improve maintainability and testing."
    },
    {
        "question": "What should happen when JwtAuthGuard rejects a request?",
        "options": [
            "The protected handler should normally not execute",
            "The user's password should be returned",
            "The request should become admin",
            "The database should be deleted"
        ],
        "correctIndex": 0,
        "explanation": "A rejecting guard prevents the protected handler from running."
    },
    {
        "question": "Why might JwtStrategy load the current user?",
        "options": [
            "To account for current account status and other server-side state",
            "To decode Base64",
            "To create cookies",
            "To generate CSS"
        ],
        "correctIndex": 0,
        "explanation": "Current state can handle account suspension and other changes made after token issuance."
    },
    {
        "question": "Why should login failures usually be generic?",
        "options": [
            "To reduce account-enumeration information",
            "To make passwords shorter",
            "To remove the need for rate limiting",
            "To make JWTs larger"
        ],
        "correctIndex": 0,
        "explanation": "Detailed login errors can reveal which accounts exist."
    },
    {
        "question": "Which component should decide whether an authenticated user can refund a particular order?",
        "options": [
            "Authorization/business policy",
            "LocalStrategy alone",
            "PasswordService",
            "JWT header"
        ],
        "correctIndex": 0,
        "explanation": "Authentication establishes identity; authorization and business policy decide whether the operation is permitted."
    },
    {
        "question": "What is a good production testing strategy?",
        "options": [
            "Unit-test strategies and add e2e tests for real protected routes",
            "Only test the login page visually",
            "Only test TypeScript compilation",
            "Never test failed authentication"
        ],
        "correctIndex": 0,
        "explanation": "Both focused unit tests and HTTP-level tests are valuable for security boundaries."
    }
],
  project: {
    name: "Passport-Powered E-Commerce Authentication",
    goal: "Build a NestJS authentication module using Passport Local and JWT strategies with clean guards and production-oriented separation of responsibilities.",
    brief: "Extend the e-commerce application so users authenticate with email/password through LocalStrategy and access protected APIs through JwtStrategy. Keep credential verification, token creation, authorization, and business logic separated.",
    steps: [
      "Create an AuthModule with AuthController, AuthService, LocalStrategy, JwtStrategy, and authentication guards.",
      "Implement LocalStrategy to extract email/password and delegate verification to AuthService.",
      "Implement secure password verification through a dedicated PasswordService.",
      "Create a login route using the local authentication guard.",
      "Issue access and refresh credentials only after successful authentication.",
      "Implement JwtStrategy with explicit signature, expiration, issuer, audience, and token-purpose validation.",
      "Load current user state when required by the application's security policy.",
      "Protect an orders endpoint with JwtAuthGuard and use request.user as the trusted identity.",
      "Add at least one authorization rule separate from authentication.",
      "Write unit tests for LocalStrategy and JwtStrategy failure and success paths.",
      "Write e2e tests for unauthenticated and authenticated requests.",
      "Ensure secrets are configured securely and authentication credentials are never logged."
    ],
    acceptance: [
      "Valid local credentials authenticate successfully.",
      "Invalid credentials are rejected with a safe generic error.",
      "Protected routes reject missing and invalid JWTs.",
      "Wrong-purpose, expired, and invalid-signature tokens are rejected.",
      "request.user contains only intended identity data.",
      "Authorization is enforced separately from authentication.",
      "Unit and e2e tests cover the main authentication boundary."
    ],
    stretch: [
      "Add a CurrentUser decorator.",
      "Add refresh-token rotation and session revocation.",
      "Add authentication audit events.",
      "Add multiple client-specific strategies.",
      "Add tests for issuer, audience, account status, and token-type failures."
    ]
  },
};