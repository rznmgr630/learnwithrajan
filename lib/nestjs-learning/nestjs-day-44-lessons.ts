import type { LessonDay } from "@/lib/learn/lesson-types";

export const AUTHENTICATION_SECURITY_DAY_44_LESSONS: LessonDay = {
  day: 44,
  title: "Authentication Security",
  totalMinutes: 122,
  difficulty: "Advanced",
  lessons: [
    {
      id: "csrf",
      title: "CSRF and Cross-Site Request Forgery",
      durationMinutes: 20,
      explanation: `CSRF happens when a browser that is already authenticated is tricked into sending a state-changing request to your application. The attacker may not need to read the response; they only need the victim's browser to include its authentication credentials automatically.
    
    Imagine your NestJS banking application uses a session cookie. A user logs in, and the browser stores the session cookie. The user then visits an attacker's page. That page submits a request to transfer money to another account. If the browser automatically includes the bank's cookie and the server has no CSRF defense, the server may believe the request came intentionally from the user.
    
    CSRF is strongly associated with cookie-based authentication because browsers automatically attach cookies to matching requests. Bearer tokens stored outside automatic browser credential mechanisms have a different CSRF profile, although they introduce other risks such as token theft.
    
    Common defenses include SameSite cookies, CSRF tokens, and Origin/Referer checks where appropriate. SameSite is useful defense in depth but should not be treated as a universal replacement for application-level CSRF protection in every architecture.`,
      diagram: `Attacker site
         |
         | forged POST
         v
    Victim Browser
         |
         | automatically includes session cookie
         v
    NestJS API
         |
         v
    Sensitive action`,
      codeExample: {
        title: "CSRF token guard concept",
        code: `@Injectable()
    export class CsrfService {
      validate(request: Request): void {
        const cookieToken = request.cookies["csrf_token"];
        const headerToken = request.headers["x-csrf-token"];
    
        if (!cookieToken || !headerToken || cookieToken !== headerToken) {
          throw new ForbiddenException("Invalid CSRF token");
        }
      }
    }
    
    // For production, use a well-designed CSRF strategy/library,
    // secure token generation, and framework-appropriate middleware.
    // Do not use predictable tokens.`
      },
      keyTakeaways: [
        "CSRF abuses a victim's authenticated browser context.",
        "Cookie authentication needs deliberate CSRF defenses for state-changing requests.",
        "CSRF tokens should be unpredictable and validated server-side.",
        "SameSite cookies provide important defense in depth.",
        "CSRF and XSS are different attacks but can interact."
      ],
      commonMistakes: [
        "Assuming a POST request is automatically safe.",
        "Using a predictable CSRF token.",
        "Relying only on a client-side JavaScript check.",
        "Forgetting CSRF protection when moving from JSON APIs to cookie-based sessions."
      ],
      quiz: [
        {
          question: "Why does CSRF commonly target cookie-authenticated applications?",
          options: [
        "Browsers automatically send matching cookies",
        "Cookies cannot expire",
        "POST is encrypted",
        "NestJS sends cookies manually"
      ],
          correctIndex: 0,
          explanation: "Automatic cookie inclusion allows a forged request to carry the victim's session."
        },
        {
          question: "Which is a common CSRF defense?",
          options: [
        "Server-validated CSRF token",
        "CSS class",
        "Database index",
        "Longer URL"
      ],
          correctIndex: 0,
          explanation: "A CSRF token proves the request came from the legitimate application flow."
        }
      ]
    },
    {
      id: "xss",
      title: "XSS and Token Theft Through the Browser",
      durationMinutes: 22,
      explanation: `Cross-Site Scripting (XSS) occurs when attacker-controlled content is executed as JavaScript in a user's browser under your application's origin. A common cause is rendering untrusted HTML without appropriate sanitization or escaping.
    
    XSS matters to authentication because JavaScript running under your application's origin may be able to read sensitive browser-accessible data, perform actions as the user, or abuse application APIs. If an access token is stored in \`localStorage\`, a successful XSS payload may be able to read it directly. An HttpOnly cookie cannot be read by JavaScript, which can reduce direct token theft, although XSS can still send authenticated requests from the victim's browser.
    
    Prevention is layered: escape output by default, avoid dangerous HTML injection, sanitize trusted-but-untrusted HTML when necessary, use a strong Content Security Policy where practical, validate inputs, and keep dependencies patched. Do not assume that TypeScript types or DTO validation prevent XSS; they solve different problems.
    
    In NestJS, DTO validation protects the server's input model, but HTML rendering is a separate security boundary. If your backend stores user-generated HTML for a rich-text editor, you must define exactly what HTML is allowed before rendering it.`,
      diagram: `Untrusted input
          |
          v
    Storage / API
          |
          v
    Unsafe HTML sink
          |
          v
    Browser executes attacker script
          |
          +--> read browser data
          +--> make authenticated requests
          +--> alter page`,
      codeExample: {
        title: "Safe HTML handling",
        code: `import sanitizeHtml from "sanitize-html";
    
    function renderUserContent(rawHtml: string): string {
      // Allow only the tags and attributes the product actually needs.
      return sanitizeHtml(rawHtml, {
        allowedTags: ["p", "strong", "em", "ul", "li", "a"],
        allowedAttributes: {
          a: ["href"],
        },
        allowedSchemes: ["https"],
      });
    }
    
    // Prefer framework escaping for normal text.
    // Use sanitization only when the product genuinely needs HTML.`
      },
      keyTakeaways: [
        "XSS executes attacker-controlled code in your origin.",
        "HttpOnly reduces direct JavaScript access to cookies but does not eliminate XSS impact.",
        "Escape output by default and sanitize HTML only when HTML is intentionally supported.",
        "CSP can add another layer of defense.",
        "Input validation and XSS output safety solve different problems."
      ],
      commonMistakes: [
        "Using `innerHTML` or equivalent sinks for untrusted content.",
        "Assuming DTO validation prevents browser-side XSS.",
        "Allowing dangerous URL schemes such as `javascript:` in sanitized links.",
        "Storing long-lived bearer tokens in JavaScript-accessible storage without considering XSS impact."
      ],
      quiz: [
        {
          question: "Why can XSS threaten tokens stored in localStorage?",
          options: [
        "Injected JavaScript can read localStorage",
        "Cookies disable it",
        "JWTs cannot be read",
        "NestJS encrypts localStorage"
      ],
          correctIndex: 0,
          explanation: "localStorage is accessible to JavaScript running in the origin."
        },
        {
          question: "What does HttpOnly do?",
          options: [
        "Prevents JavaScript from reading the cookie",
        "Prevents all XSS",
        "Encrypts HTML",
        "Disables HTTPS"
      ],
          correctIndex: 0,
          explanation: "HttpOnly controls script access to the cookie; it does not stop all XSS."
        }
      ]
    },
    {
      id: "session-fixation",
      title: "Session Fixation, Secure Cookies, and Session Lifecycle",
      durationMinutes: 20,
      explanation: `Session fixation occurs when an attacker can cause a victim to use a session identifier that the attacker already knows. If the victim authenticates and the application keeps that same identifier, the attacker may be able to use it to access the authenticated session.
    
    The key defense is <b>session ID rotation after authentication and privilege changes</b>. When a user logs in, do not simply mark an existing anonymous session as authenticated. Generate a new session identifier, invalidate the old one, and associate the new identifier with the authenticated account.
    
    Cookies also have important security attributes. \`Secure\` tells the browser to send the cookie only over HTTPS. \`HttpOnly\` prevents JavaScript from reading it. \`SameSite\` controls when the browser includes the cookie on cross-site requests. These attributes are controls, not magic switches; they must match your architecture.
    
    A production session design also needs expiration, revocation, logout invalidation, idle timeouts where appropriate, session/device management, and protection against session identifiers appearing in logs.`,
      diagram: `Anonymous session
          |
          | login
          v
    Rotate session ID
          |
          v
    Authenticated session
          |
          +--> Secure
          +--> HttpOnly
          +--> SameSite
          +--> expiration
          +--> revocation`,
      codeExample: {
        title: "Secure session cookie configuration",
        code: `res.cookie("session", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60,
    });
    
    // On successful login, rotate the session identifier.
    // Never reuse an attacker-controllable anonymous session ID
    // as the authenticated session ID.`
      },
      keyTakeaways: [
        "Rotate session identifiers after login and privilege changes.",
        "Secure cookies require HTTPS in production.",
        "HttpOnly reduces direct script access to cookies.",
        "SameSite controls cross-site cookie sending behavior.",
        "Logout should invalidate server-side session state when using server sessions."
      ],
      commonMistakes: [
        "Reusing a pre-login session ID after authentication.",
        "Setting Secure cookies while testing an HTTP-only production deployment.",
        "Assuming SameSite eliminates every CSRF scenario.",
        "Leaving sessions valid indefinitely."
      ],
      quiz: [
        {
          question: "What is the main defense against session fixation?",
          options: [
        "Rotate the session identifier after authentication",
        "Use a longer username",
        "Disable HTTPS",
        "Store it in HTML"
      ],
          correctIndex: 0,
          explanation: "Rotation prevents an attacker from reusing a known pre-authentication identifier."
        },
        {
          question: "What does Secure mean for a cookie?",
          options: [
        "Send it only over secure HTTPS connections",
        "Make it HttpOnly",
        "Prevent all XSS",
        "Encrypt the database"
      ],
          correctIndex: 0,
          explanation: "Secure restricts transmission to secure connections."
        }
      ]
    },
    {
      id: "replay-token-security",
      title: "Replay Attacks, Token Theft, and Proof of Possession",
      durationMinutes: 20,
      explanation: `A replay attack happens when an attacker captures a valid credential or request and sends it again. The attacker does not need to forge a signature if the credential is still valid.
    
    For example, if a bearer access token is stolen from a log, browser storage, proxy, or compromised machine, the attacker can replay it to the API until it expires or is revoked. Bearer means possession is generally enough. This is why token lifetime, transport security, safe storage, audience restrictions, and monitoring matter.
    
    For especially sensitive operations, systems can add stronger protections such as nonce-based protocols, idempotency keys for payment requests, request signing, or proof-of-possession mechanisms such as DPoP where supported. These are different tools for different problems.
    
    Idempotency is particularly important for APIs that perform financial or irreversible actions. If a client times out after submitting a payment, retrying the request should not accidentally create a second payment. An idempotency key lets the server recognize a repeated logical operation and return the original result instead of executing it again.`,
      diagram: `Client
      |
      | request + idempotency key
      v
    NestJS API
      |
      +--> first request --> execute operation
      |
      +--> replay --------> return stored result
                             (do not execute twice)`,
      codeExample: {
        title: "Idempotent payment endpoint",
        code: `@Post("payments")
    async createPayment(
      @Headers("idempotency-key") key: string,
      @Body() dto: CreatePaymentDto,
    ) {
      if (!key) {
        throw new BadRequestException("Idempotency-Key is required");
      }
    
      const existing = await this.idempotency.find(key);
    
      if (existing) {
        return existing.response;
      }
    
      // In production, creation of the idempotency record and the
      // business operation must be designed atomically enough to
      // handle concurrent duplicate requests.
      return this.paymentService.createOnce(key, dto);
    }`
      },
      keyTakeaways: [
        "Replay means a valid credential or request is reused.",
        "Bearer-token theft can enable replay until the token expires or is revoked.",
        "Idempotency keys protect business operations from duplicate execution.",
        "Sensitive APIs may require stronger proof-of-possession mechanisms.",
        "Never log bearer tokens or secrets."
      ],
      commonMistakes: [
        "Assuming HTTPS alone solves replay after a token is stolen.",
        "Generating idempotency keys on the server after receiving a duplicate request.",
        "Checking an idempotency key without handling concurrent requests.",
        "Using one global idempotency key across unrelated operations."
      ],
      quiz: [
        {
          question: "What does an idempotency key help prevent?",
          options: [
        "Duplicate execution of a retried logical operation",
        "XSS",
        "Password guessing",
        "HTML injection"
      ],
          correctIndex: 0,
          explanation: "The server can recognize a repeated operation and return the original result."
        },
        {
          question: "Why can a stolen bearer token be replayed?",
          options: [
        "Possession is enough for authorization until the token is invalid",
        "Bearer tokens require no network",
        "JWTs cannot expire",
        "Browsers reject them"
      ],
          correctIndex: 0,
          explanation: "Bearer credentials are usable by whoever possesses them."
        }
      ]
    },
    {
      id: "cookie-security",
      title: "Cookie Security: SameSite, HttpOnly, Secure, and CSRF Strategy",
      durationMinutes: 18,
      explanation: `Cookie attributes are easy to memorize and easy to misuse. Think about them as separate controls.
    
    <b>HttpOnly</b> prevents JavaScript from reading the cookie through APIs such as \`document.cookie\`. It is especially useful for session identifiers and refresh tokens that do not need browser script access.
    
    <b>Secure</b> tells the browser to send the cookie only over HTTPS. It should be enabled for production authentication cookies.
    
    <b>SameSite</b> controls cross-site cookie sending. \`Strict\` is most restrictive and can affect legitimate cross-site navigation flows. \`Lax\` is a common compromise for many session cookies. \`None\` allows cross-site use but requires \`Secure\` and should be used only when the architecture genuinely needs it.
    
    When your frontend and API are on different sites or use embedded/third-party flows, cookie behavior can become complicated. Test the actual browser behavior rather than assuming the attribute means what you want. Also configure CORS separately; CORS and cookie SameSite are related to browser requests but are not interchangeable security controls.`,
      diagram: `Cookie
     |
     +--> Secure   -> HTTPS only
     |
     +--> HttpOnly -> JS cannot read
     |
     +--> SameSite -> cross-site sending policy
     |
     +--> Path/Domain/Max-Age -> scope and lifetime`,
      codeExample: {
        title: "Authentication cookie",
        code: `res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/auth/refresh",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    
    // Narrow Path can reduce where the browser sends the cookie.
    // The exact SameSite setting depends on the application's
    // deployment and cross-site requirements.`
      },
      keyTakeaways: [
        "HttpOnly limits JavaScript access to cookies.",
        "Secure requires HTTPS transmission.",
        "SameSite controls cross-site cookie behavior.",
        "Cookie Path can reduce where a sensitive cookie is sent.",
        "CORS configuration does not replace CSRF protection."
      ],
      commonMistakes: [
        "Using SameSite=None without Secure.",
        "Assuming HttpOnly prevents XSS.",
        "Sending refresh cookies to every API path unnecessarily.",
        "Treating CORS as an authorization mechanism."
      ],
      quiz: [
        {
          question: "Which attribute blocks JavaScript access to a cookie?",
          options: [
        "HttpOnly",
        "Secure",
        "SameSite",
        "Path"
      ],
          correctIndex: 0,
          explanation: "HttpOnly prevents JavaScript from reading the cookie."
        },
        {
          question: "Which setting is required when SameSite=None is used by modern browsers?",
          options: [
        "Secure",
        "HttpOnly only",
        "Path=/admin",
        "Max-Age=0"
      ],
          correctIndex: 0,
          explanation: "Cross-site cookies using SameSite=None must be Secure."
        }
      ]
    },
    {
      id: "auth-security-production",
      title: "Production Authentication Security and Defense in Depth",
      durationMinutes: 24,
      explanation: `Authentication security is not one feature. It is a chain of controls. A production NestJS system should consider transport security, credential storage, session/token lifetime, CSRF, XSS, rate limiting, brute-force protection, password hashing, account recovery, logging, monitoring, dependency security, and incident response.
    
    A useful mental model is to ask: “If this one control fails, what happens next?” If a token leaks, short expiration and refresh-token rotation can limit damage. If an XSS bug occurs, HttpOnly cookies can reduce direct token extraction. If a password is guessed, rate limiting and strong password hashing increase the attacker's cost. If a session is stolen, session management and revocation provide response options.
    
    Do not log secrets. Authentication logs should contain enough information to investigate failures without recording passwords, access tokens, refresh tokens, session IDs, or authorization codes. Use structured events with request IDs and account identifiers where appropriate.
    
    Also test failure paths. Security bugs often live in logout, refresh, password reset, error handling, redirects, and race conditions rather than in the happy-path login endpoint.`,
      diagram: `Browser / Client
          |
          v
    HTTPS
          |
          v
    NestJS Auth Boundary
          |
          +--> rate limiting
          +--> CSRF/XSS defenses
          +--> session/token validation
          +--> secure cookies
          |
          v
    Authorization
          |
          v
    Audit + Monitoring + Incident Response`,
      codeExample: {
        title: "Authentication security guardrails",
        code: `@Injectable()
    export class AuthSecurityService {
      validateSession(session: Session) {
        if (session.revokedAt) {
          throw new UnauthorizedException();
        }
    
        if (session.expiresAt <= new Date()) {
          throw new UnauthorizedException();
        }
    
        return session.userId;
      }
    
      // Pair this with:
      // - TLS/HTTPS
      // - secure cookie attributes
      // - rate limiting
      // - CSRF protection where applicable
      // - safe logging
      // - monitoring and alerting
    }`
      },
      keyTakeaways: [
        "Authentication is a chain of defenses, not one middleware.",
        "Design for credential theft, replay, XSS, CSRF, brute force, and session compromise.",
        "Never log authentication secrets.",
        "Test logout, refresh, recovery, and failure paths.",
        "Defense in depth limits the impact when one control fails."
      ],
      commonMistakes: [
        "Relying on a single security control.",
        "Logging tokens for debugging.",
        "Ignoring rate limiting because passwords are hashed.",
        "Testing only successful authentication."
      ],
      quiz: [
        {
          question: "What is defense in depth?",
          options: [
        "Multiple independent controls that limit the impact of failures",
        "One very long password",
        "Disabling logs",
        "Using only frontend validation"
      ],
          correctIndex: 0,
          explanation: "Layered controls reduce the consequences of a single failure."
        },
        {
          question: "Which should generally not appear in authentication logs?",
          options: [
        "Request ID",
        "Failure reason",
        "Access token",
        "Timestamp"
      ],
          correctIndex: 2,
          explanation: "Tokens are credentials and should never be logged."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What attack tricks an authenticated browser into sending an unwanted request?",
      options: ["CSRF", "XSS", "SQL injection", "DNS"],
      correctIndex: 0,
      explanation: "CSRF abuses the browser's authenticated request context."
    },
    {
      question: "What attack executes attacker-controlled JavaScript in your origin?",
      options: ["XSS", "CSRF", "Replay only", "Session fixation"],
      correctIndex: 0,
      explanation: "XSS executes script in the victim's application origin."
    },
    {
      question: "Which cookie attribute prevents JavaScript from reading the cookie?",
      options: ["HttpOnly", "Secure", "SameSite", "Domain"],
      correctIndex: 0,
      explanation: "HttpOnly limits script access."
    },
    {
      question: "What does Secure do?",
      options: ["Requires HTTPS for cookie transmission", "Prevents all XSS", "Rotates sessions", "Encrypts JWTs"],
      correctIndex: 0,
      explanation: "Secure restricts cookie transmission to secure connections."
    },
    {
      question: "What is session fixation?",
      options: ["An attacker causes a victim to authenticate with a known session identifier", "A password expires", "A cookie is compressed", "A token is encrypted"],
      correctIndex: 0,
      explanation: "Rotation after authentication defeats known pre-authentication identifiers."
    },
    {
      question: "What is replay?",
      options: ["Reusing a captured valid credential/request", "Creating a database", "Changing CSS", "Hashing a password"],
      correctIndex: 0,
      explanation: "Replay uses a valid artifact again."
    },
    {
      question: "What helps prevent duplicate payment execution after retries?",
      options: ["Idempotency keys", "CSS", "User-Agent strings", "HTML comments"],
      correctIndex: 0,
      explanation: "Idempotency makes repeated logical operations safe."
    },
    {
      question: "Why can HttpOnly still be useful with XSS?",
      options: ["It can prevent direct JavaScript extraction of the cookie", "It stops all malicious requests", "It disables the browser", "It sanitizes HTML"],
      correctIndex: 0,
      explanation: "XSS can still act as the user, but direct cookie theft is reduced."
    },
    {
      question: "Why is CORS not a replacement for CSRF protection?",
      options: ["They solve different browser security problems", "CORS hashes passwords", "CSRF disables HTTPS", "They are identical"],
      correctIndex: 0,
      explanation: "CORS controls cross-origin browser access; CSRF addresses unwanted authenticated actions."
    },
    {
      question: "What is a production authentication principle?",
      options: ["Layer controls so one failure does not immediately become total compromise", "Log every token", "Trust all redirects", "Skip expiration"],
      correctIndex: 0,
      explanation: "Defense in depth reduces blast radius."
    }
  ],
  project: {
    name: "Hardened NestJS Authentication Gateway",
    goal: "Build a production-oriented authentication boundary that demonstrates CSRF, XSS defenses, secure cookies, session rotation, replay protection, and safe authentication operations.",
    brief: "Extend a NestJS auth API with secure cookie settings, CSRF protection for cookie-authenticated state changes, session rotation, refresh-token safety, rate limiting, idempotent payment-like operations, and security-focused tests.",
    steps: [
      "Configure HTTPS assumptions and authentication cookies with Secure, HttpOnly, SameSite, appropriate Path, and expiration.",
      "Implement session ID rotation after login and privilege changes.",
      "Add CSRF protection for cookie-authenticated state-changing requests and test cross-site request scenarios.",
      "Audit every user-generated HTML rendering path and sanitize only the HTML features the product actually needs.",
      "Implement refresh/session revocation and ensure tokens/session identifiers are never logged.",
      "Add rate limits to login, refresh, password reset, and other credential-sensitive endpoints.",
      "Add an idempotency-key mechanism to a payment/order endpoint and handle concurrent duplicate requests.",
      "Create security tests for CSRF, XSS payloads, replayed credentials, fixed sessions, cookie attributes, and duplicate operations."
    ],
    acceptance: [
      "Authentication cookies are Secure and HttpOnly in production and use an intentional SameSite policy.",
      "Session identifiers are rotated after successful authentication.",
      "State-changing cookie-authenticated requests without valid CSRF protection are rejected.",
      "User-generated HTML cannot execute arbitrary scripts through supported rendering paths.",
      "Duplicate payment requests with the same idempotency key do not execute the business operation twice.",
      "Authentication secrets do not appear in application logs."
    ],
    stretch: [
      "Add Content Security Policy headers and evaluate report-only deployment.",
      "Implement refresh-token reuse detection.",
      "Add device/session management with explicit revocation.",
      "Add security-event metrics and alerts for repeated authentication failures."
    ]
  }
};
