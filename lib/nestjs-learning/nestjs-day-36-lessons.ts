import type { LessonDay } from "@/lib/learn/lesson-types";

export const AUTHENTICATION_ARCHITECTURE_DAY_36_LESSONS: LessonDay = {
  day: 36,
  title: "Authentication Architecture",
  totalMinutes: 240,
  difficulty: "Advanced",
  lessons: [
    {
      id: "authentication-vs-authorization",
      title: "Authentication vs Authorization",
      durationMinutes: 30,
      explanation: `
<b>Imagine you are building an e-commerce application.</b>

A customer logs in and then tries to view an order. Two different security questions must be answered.

<b>Authentication asks: "Who are you?"</b>

Authentication verifies identity. A user might prove their identity with an email and password, a passkey, an OAuth provider, or another credential.

For example:

<pre>
POST /auth/login

{
  "email": "alice@example.com",
  "password": "correct-password"
}
</pre>

If the credentials are valid, the server can establish that the request belongs to Alice.

<b>Authorization asks: "What are you allowed to do?"</b>

Authorization happens after the application knows the identity. It determines which resources and actions that identity may access.

For example, Alice may be allowed to read her own orders:

<pre>
GET /users/42/orders
</pre>

but not another customer's private orders:

<pre>
GET /users/99/orders
</pre>

Authentication and authorization are related, but they are not interchangeable.

<pre>
Request
   |
   v
Authentication
"Who is this?"
   |
   v
Authenticated identity
   |
   v
Authorization
"What may this identity do?"
   |
   +---- allowed ----> Controller
   |
   +---- denied ------> 401 / 403
</pre>

A common beginner mistake is checking only whether a user is logged in. Being logged in does not automatically mean the user can perform every operation.

<b>HTTP status codes matter.</b>

A <b>401 Unauthorized</b> response normally means the request lacks valid authentication credentials.

A <b>403 Forbidden</b> response normally means the server understands the identity but that identity is not permitted to perform the requested operation.

In NestJS, authentication commonly appears in guards or authentication middleware, while authorization can be implemented with guards, roles, permissions, ownership checks, or policy services.

As the application grows, keep the responsibilities separate. An AuthGuard can establish identity, while an authorization guard or policy service can decide whether that identity may perform a specific action.
`,
      diagram: `
Client
  |
  v
Authentication
  |
  | valid identity
  v
Authorization
  |
  +------ allowed ------> Controller -> Service -> Database
  |
  +------ denied -------> 401 / 403
`,
      codeExample: {
        title: "NestJS Authentication and Authorization Guards",
        code: `
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException("Authentication required");
    }

    return true;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.user?.role !== "admin") {
      throw new ForbiddenException("Admin access required");
    }

    return true;
  }
}
`,
      },
      keyTakeaways: [
        "Authentication establishes who the caller is.",
        "Authorization determines what an authenticated identity is allowed to do.",
        "A logged-in user is not automatically authorized to access every resource.",
        "Use 401 for missing or invalid authentication and 403 when an authenticated identity lacks permission.",
        "Keep authentication and authorization responsibilities separate so the architecture remains maintainable."
      ],
      commonMistakes: [
        "<b>Checking only whether a user is logged in.</b> Authentication alone does not prove that the user owns the requested resource.",
        "<b>Putting authorization rules inside every controller.</b> Repeating role and permission checks across controllers makes security logic difficult to audit.",
        "<b>Returning 401 for every security failure.</b> Distinguish authentication failures from authorization failures where appropriate.",
        "<b>Trusting a user ID sent by the client.</b> The authenticated identity should come from trusted authentication state, not from an arbitrary request body field."
      ],
      quiz: [
        {
          question: "A valid login has established that Alice is user 42. She requests another customer's private invoice. Which security concept decides whether she can access it?",
          options: [
            "Authentication",
            "Authorization",
            "Serialization",
            "Dependency injection"
          ],
          correctIndex: 1,
          explanation: "Authentication already established Alice's identity. Authorization decides whether Alice is permitted to access the invoice."
        },
        {
          question: "Which response is generally appropriate when a request contains no valid authentication credentials?",
          options: [
            "200",
            "201",
            "401",
            "500"
          ],
          correctIndex: 2,
          explanation: "401 indicates that valid authentication credentials are required."
        }
      ]
    },
    {
      id: "sessions-and-cookies",
      title: "Sessions and Cookies",
      durationMinutes: 35,
      explanation: `
<b>Now imagine a traditional web application.</b>

A browser sends a username and password to the server. The server verifies the credentials. The next question is: how does the browser prove on the next request that it already logged in?

A common answer is a <b>session</b>.

With server-side sessions, the server creates a session record after login:

<pre>
sessionId -> {
  userId: 42,
  createdAt: ...,
  expiresAt: ...
}
</pre>

The browser receives a cookie containing the session identifier. On later requests, the browser automatically sends the cookie.

The important point is that the cookie usually does not need to contain all the user's authorization information. It can contain only an opaque identifier that points to server-side session state.

<pre>
Browser
  |
  | POST /login
  v
NestJS
  |
  | create session
  v
Session Store
  |
  | Set-Cookie: sessionId=...
  v
Browser
  |
  | Cookie: sessionId=...
  v
NestJS
  |
  | lookup session
  v
Session Store
  |
  v
Authenticated User
</pre>

<b>Why use cookies?</b>

Browsers have built-in cookie handling. A cookie can also be configured with security attributes such as <b>HttpOnly</b>, <b>Secure</b>, and <b>SameSite</b>.

<b>HttpOnly</b> prevents normal browser JavaScript from reading the cookie. This is valuable when the cookie contains a session identifier because an XSS vulnerability cannot simply use document.cookie to read it.

<b>Secure</b> tells the browser to send the cookie only over HTTPS.

<b>SameSite</b> controls when cookies are sent in cross-site requests and is an important part of CSRF protection.

Sessions introduce a server-side state-management problem. If one NestJS instance stores sessions only in its own memory, another instance may not know about them.

That is why production applications commonly use a shared session store such as Redis or a database.

<b>When are sessions a good fit?</b>

They are particularly natural for browser-based applications where the server wants centralized control over login state, logout, session expiration, and revocation.

<b>What can go wrong?</b>

If session identifiers are predictable, leaked, transmitted without HTTPS, or stored insecurely, an attacker may be able to impersonate a user. This is called session hijacking.

After a successful login, applications should also consider <b>session fixation</b>. The server should establish a fresh session identifier rather than continuing to trust an identifier that could have been chosen or observed before authentication.
`,
      diagram: `
Browser
   |
   | login
   v
NestJS Auth Service
   |
   | create session
   v
Redis / Session Store
   |
   | sessionId
   v
Set-Cookie
   |
   v
Browser
   |
   | Cookie automatically sent
   v
NestJS
   |
   v
Session lookup -> User
`,
      codeExample: {
        title: "A Secure Session Cookie in NestJS",
        code: `
import { Controller, Post, Res } from "@nestjs/common";
import type { Response } from "express";

@Controller("auth")
export class AuthController {
  @Post("login")
  async login(@Res({ passthrough: true }) response: Response) {
    // In a real application, the credentials would already be
    // validated against a securely hashed password.
    const sessionId = await this.createSessionForUser(42);

    response.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    });

    return { message: "Logged in" };
  }

  private async createSessionForUser(userId: number): Promise<string> {
    // Use cryptographically secure random session identifiers.
    // Store the mapping in Redis or another shared session store.
    return crypto.randomUUID();
  }
}
`,
      },
      keyTakeaways: [
        "A session stores authentication state on the server and usually gives the browser an opaque session identifier.",
        "Cookies are a browser mechanism for sending that identifier automatically with requests.",
        "`HttpOnly`, `Secure`, and `SameSite` are important cookie security attributes.",
        "Production multi-instance applications need a shared session store when using server-side sessions.",
        "Rotate or regenerate session identifiers after login to reduce session-fixation risk."
      ],
      commonMistakes: [
        "<b>Storing sessions only in process memory.</b> A load-balanced application can send the next request to a different instance that knows nothing about the session.",
        "<b>Creating cookies without security attributes.</b> Authentication cookies should be deliberately configured rather than relying on unsafe defaults.",
        "<b>Using predictable session IDs.</b> Session identifiers must be generated using a cryptographically secure source of randomness.",
        "<b>Forgetting logout invalidation.</b> Deleting the browser cookie alone may not invalidate a server-side session unless the server-side session is also revoked."
      ],
      quiz: [
        {
          question: "What is the main purpose of a server-side session identifier stored in a cookie?",
          options: [
            "To store the user's password in the browser",
            "To point the server to authentication state",
            "To replace HTTPS",
            "To make authorization unnecessary"
          ],
          correctIndex: 1,
          explanation: "The cookie can contain an opaque identifier that lets the server find the user's server-side session."
        },
        {
          question: "Why is HttpOnly useful for an authentication cookie?",
          options: [
            "It encrypts the entire database",
            "It prevents JavaScript from directly reading the cookie",
            "It forces the cookie to expire immediately",
            "It disables HTTPS"
          ],
          correctIndex: 1,
          explanation: "HttpOnly prevents normal client-side JavaScript from accessing the cookie value."
        }
      ]
    },
    {
      id: "tokens-and-jwt",
      title: "Tokens and JWT",
      durationMinutes: 40,
      explanation: `
<b>Sessions are not the only way to maintain authentication.</b>

Another common architecture is token-based authentication.

A <b>token</b> is a credential that the client presents to the server to prove that it has been authenticated or granted access.

There are many kinds of tokens. A token does not automatically mean JWT.

A <b>JWT (JSON Web Token)</b> is a standardized token format containing encoded claims and a cryptographic signature.

A JWT commonly has three parts:

<pre>
header.payload.signature
</pre>

The header describes the token type and signing algorithm. The payload contains claims. The signature allows the server to detect whether the token was modified.

For example, a payload might conceptually contain:

<pre>
{
  "sub": "42",
  "role": "customer",
  "iat": 1790000000,
  "exp": 1790003600
}
</pre>

<b>Important:</b> a signed JWT is normally <b>not encrypted</b>. Its payload should not contain passwords, credit-card data, private medical information, or other secrets merely because it is inside a JWT.

The signature answers a question like:

"Was this token issued by a trusted signer, and has its signed content been modified?"

It does not answer:

"Is every piece of data inside this token confidential?"

<b>Why are JWTs popular?</b>

They can allow a server to validate a token without storing every access token in a session database. This can be useful for APIs and distributed systems.

But JWTs are not automatically better than sessions.

A major trade-off is revocation. With a simple stateless JWT design, a token can remain valid until its expiration time unless the application introduces additional server-side controls.

That means token lifetime and revocation strategy are architectural decisions, not implementation details.

<b>Do not confuse encoding with security.</b>

Base64url encoding is not encryption. Anyone who receives a normal signed JWT can generally decode its header and payload. The signature protects integrity and authenticity, assuming the verification process is correctly implemented.
`,
      diagram: `
Client
  |
  | Authorization: Bearer <token>
  v
NestJS Guard
  |
  | verify signature
  | validate exp / claims
  v
Authenticated Identity
  |
  v
Controller
`,
      codeExample: {
        title: "Signing and Verifying a JWT with NestJS",
        code: `
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async createAccessToken(user: { id: number; role: string }) {
    return this.jwtService.signAsync(
      {
        sub: user.id,
        role: user.role,
      },
      {
        expiresIn: "15m",
      },
    );
  }

  async verifyAccessToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException("Invalid or expired access token");
    }
  }
}
`,
      },
      keyTakeaways: [
        "A token is a credential; JWT is one particular token format.",
        "A signed JWT provides integrity and authenticity but does not normally provide confidentiality.",
        "Do not put sensitive secrets into ordinary JWT payloads.",
        "JWT expiration and revocation strategy must be designed deliberately.",
        "Stateless validation can simplify distributed APIs, but it does not eliminate all server-side authentication state."
      ],
      commonMistakes: [
        "<b>Assuming JWT means encrypted.</b> Signed JWT payloads are usually readable by whoever possesses the token.",
        "<b>Putting passwords in JWT claims.</b> Credentials and other sensitive secrets should never be placed there.",
        "<b>Accepting any JWT algorithm or configuration.</b> Verification must use a deliberately configured trusted algorithm and key.",
        "<b>Making access tokens live for months.</b> Long-lived bearer credentials increase the impact of token theft."
      ],
      quiz: [
        {
          question: "What does the signature of a signed JWT primarily provide?",
          options: [
            "Database encryption",
            "Confidentiality of the payload",
            "Integrity and authenticity of the signed content",
            "Automatic password hashing"
          ],
          correctIndex: 2,
          explanation: "The signature lets the verifier detect tampering and verify that the token was produced by a trusted signer."
        },
        {
          question: "Why should sensitive secrets generally not be placed in a normal JWT payload?",
          options: [
            "JWTs cannot contain strings",
            "JWT payloads are not normally confidential",
            "JWTs expire too quickly",
            "NestJS deletes JWT payloads"
          ],
          correctIndex: 1,
          explanation: "A signed JWT is generally readable by its holder. Signing protects integrity, not confidentiality."
        }
      ]
    },
    {
      id: "access-and-refresh-tokens",
      title: "Access Tokens and Refresh Tokens",
      durationMinutes: 40,
      explanation: `
<b>Now we reach one of the most important production authentication patterns.</b>

Imagine a mobile shopping application. After login, the user receives an access token.

The application uses the access token to call protected APIs:

<pre>
Authorization: Bearer ACCESS_TOKEN
</pre>

An <b>access token</b> should normally have a relatively short lifetime. If an attacker steals it, the period during which it can be used is limited.

But short-lived access tokens create a usability problem.

Suppose an access token expires every 15 minutes. The user should not have to type their password every 15 minutes.

This is where a <b>refresh token</b> comes in.

The client can present a valid refresh token to the authentication server and receive a new access token.

The flow looks like this:

<pre>
Login
  |
  +----> short-lived access token
  |
  +----> longer-lived refresh token

API request
  |
  +---- access token valid ----> protected resource
  |
  +---- access token expired
                |
                v
         refresh token
                |
                v
         Auth server
                |
                v
         new access token
</pre>

The key architectural idea is that the access token is used frequently, while the refresh token is used less frequently and should receive stronger protection.

<b>Why not simply make the access token last for a year?</b>

Because a stolen bearer token could then provide access for a very long period. Short access-token lifetimes reduce the window of exposure.

<b>Refresh token rotation</b> is an important production technique.

Instead of allowing the same refresh token to be reused indefinitely, the server issues a new refresh token whenever the old one is successfully used. The old refresh token is then invalidated.

This allows the authentication system to detect suspicious reuse.

For example:

<pre>
Refresh token A
      |
      v
used successfully
      |
      +----> Access token B
      |
      +----> Refresh token C

Refresh token A is now invalid.
</pre>

If an attacker later tries to use refresh token A, the server can treat this as suspicious and potentially revoke the associated token family or session.

Refresh tokens require careful storage and revocation design. For browser applications, an HttpOnly Secure cookie is often considered so that application JavaScript does not directly access the refresh credential.

For APIs and mobile clients, the exact storage mechanism depends on the platform and threat model.

<b>Do not put refresh tokens into localStorage simply because it is convenient.</b>

If malicious JavaScript can access the token because of an XSS vulnerability, the attacker may be able to steal the refresh credential and repeatedly obtain new access tokens.

There is no universal storage choice that makes an application immune to XSS or other attacks. The architecture must consider the client type, CSRF protections, XSS defenses, token rotation, expiration, and revocation.
`,
      diagram: `
                 Login
                   |
          +--------+--------+
          |                 |
          v                 v
    Access Token      Refresh Token
     short-lived        longer-lived
          |                 |
          v                 |
   Protected API            |
          |                 |
      expires --------------+
                            |
                            v
                      Auth Server
                            |
                            v
                     New Access Token
`,
      codeExample: {
        title: "Access Token + Refresh Token Service",
        code: `
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async issueAccessToken(userId: number, role: string) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        role,
        type: "access",
      },
      {
        expiresIn: "15m",
      },
    );
  }

  async issueRefreshToken(userId: number, sessionId: string) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        sid: sessionId,
        type: "refresh",
      },
      {
        expiresIn: "7d",
      },
    );
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      if (payload.type !== "refresh") {
        throw new UnauthorizedException("Wrong token type");
      }

      // Production systems should also verify that the session/token
      // family is still active and that the refresh token has not
      // already been rotated or revoked.

      return this.issueAccessToken(payload.sub, "customer");
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
`,
      },
      keyTakeaways: [
        "Access tokens should generally be short-lived because they are frequently presented to APIs.",
        "Refresh tokens allow users to obtain new access tokens without repeatedly entering credentials.",
        "Refresh tokens deserve stronger protection because they can provide a path to continued authentication.",
        "Refresh token rotation can reduce the impact of stolen refresh credentials and help detect reuse.",
        "A token should have an explicit purpose and type so an access token is not accidentally accepted where a refresh token is expected."
      ],
      commonMistakes: [
        "<b>Using one token for everything.</b> Separating access and refresh credentials allows different lifetimes and security controls.",
        "<b>Making refresh tokens permanent.</b> Long-lived credentials still need expiration, revocation, and session-management policies.",
        "<b>Accepting an access token at the refresh endpoint.</b> Token purpose should be checked explicitly.",
        "<b>Ignoring refresh-token reuse.</b> Rotation without reuse detection loses much of its security value.",
        "<b>Storing refresh credentials casually.</b> Choose storage based on the client platform and threat model."
      ],
      quiz: [
        {
          question: "Why are access tokens commonly short-lived?",
          options: [
            "Because APIs cannot process long strings",
            "To reduce the useful lifetime of a stolen access credential",
            "Because refresh tokens cannot exist otherwise",
            "To eliminate authorization"
          ],
          correctIndex: 1,
          explanation: "A shorter access-token lifetime limits the window in which a stolen access token can normally be used."
        },
        {
          question: "What is the main idea behind refresh-token rotation?",
          options: [
            "Use the same refresh token forever",
            "Replace the refresh credential after successful use and invalidate the previous one",
            "Move passwords into the access token",
            "Disable token expiration"
          ],
          correctIndex: 1,
          explanation: "Rotation replaces the refresh credential and invalidates the previous one, enabling stronger session control and reuse detection."
        }
      ]
    },
    {
      id: "nestjs-authentication-architecture",
      title: "Building Authentication with NestJS Guards and Strategies",
      durationMinutes: 35,
      explanation: `
<b>Now connect the concepts to NestJS.</b>

A production authentication module should not put every security responsibility inside a controller.

A useful architecture separates responsibilities:

<pre>
AuthController
      |
      v
AuthService
      |
      +---- UserRepository
      |
      +---- PasswordHasher
      |
      +---- TokenService
      |
      +---- Session / RefreshTokenRepository

Protected Request
      |
      v
AuthGuard
      |
      v
Authenticated User
      |
      v
Authorization Guard / Policy
      |
      v
Controller
      |
      v
Business Service
</pre>

The controller handles HTTP concerns.

The authentication service handles authentication workflows.

A password hashing service handles password verification.

A token service handles token creation and verification.

A repository or persistence service handles users and authentication-session state.

A guard integrates authentication into NestJS's request pipeline.

<b>Password storage</b> deserves special attention.

Never store user passwords as plain text. The application should store a password hash produced by an appropriate password-hashing algorithm such as Argon2id or bcrypt with carefully chosen parameters.

When a user logs in, the application hashes/verifies the supplied password against the stored hash. The original password should not be recoverable from the database.

<b>Do not log passwords or tokens.</b>

Application logs frequently end up in centralized systems. Accidentally logging authentication credentials can turn an otherwise protected system into a credential-leak source.

<b>Configuration belongs outside source code.</b>

Secrets such as JWT signing keys should come from secure configuration or secret-management infrastructure rather than being committed to Git.

<b>Authentication should also be observable.</b>

Production systems should record useful security events such as failed login attempts, successful logins, refresh-token reuse detections, password changes, and suspicious session activity. Avoid logging sensitive credential values themselves.
`,
      diagram: `
HTTP Request
     |
     v
AuthGuard
     |
     v
Token / Session Verification
     |
     v
request.user
     |
     v
Authorization Guard
     |
     v
Controller
     |
     v
Service
     |
     v
Repository
`,
      codeExample: {
        title: "A NestJS Protected Route",
        code: `
import {
  Controller,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";

type AuthenticatedRequest = Request & {
  user: {
    id: number;
    role: "customer" | "admin";
  };
};

class JwtAuthGuard {
  canActivate(): boolean {
    // Real implementation verifies the bearer token and
    // attaches the trusted identity to request.user.
    return true;
  }
}

@Controller("orders")
export class OrdersController {
  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Req() request: AuthenticatedRequest) {
    // Do not accept userId from the query string for ownership.
    // The authenticated identity comes from the verified credential.
    const userId = request.user.id;

    return {
      userId,
      message: "Return orders owned by the authenticated user",
    };
  }
}
`,
      },
      keyTakeaways: [
        "NestJS guards are a natural integration point for request authentication and authorization.",
        "Authentication infrastructure should be separated into focused services rather than becoming one giant AuthService.",
        "Passwords must be stored using secure password hashing, never reversible encryption or plain text.",
        "Secrets and signing keys should be supplied through secure configuration.",
        "Never log passwords, access tokens, refresh tokens, or other authentication credentials."
      ],
      commonMistakes: [
        "<b>Reading userId from the URL and trusting it for ownership.</b> Use the authenticated identity when an operation is supposed to affect the current user.",
        "<b>Building one enormous authentication service.</b> Separate hashing, token management, persistence, and workflow responsibilities.",
        "<b>Hard-coding JWT secrets.</b> Production secrets should be managed outside committed source code.",
        "<b>Logging Authorization headers.</b> Request logging middleware can accidentally expose bearer tokens if headers are logged without filtering."
      ],
      quiz: [
        {
          question: "Where should a protected route normally get the identity of the current user?",
          options: [
            "From an arbitrary request body userId",
            "From a verified authentication credential processed by the authentication layer",
            "From the URL without verification",
            "From a random UUID generated by the controller"
          ],
          correctIndex: 1,
          explanation: "The authenticated identity should come from trusted authentication processing, not from user-controlled fields."
        },
        {
          question: "Why should password hashing be separated from authentication workflow logic?",
          options: [
            "It makes passwords reversible",
            "It improves separation of responsibilities and makes security-sensitive code easier to test and maintain",
            "It eliminates the need for validation",
            "It allows passwords to be logged"
          ],
          correctIndex: 1,
          explanation: "Focused services make authentication easier to reason about, test, replace, and audit."
        }
      ]
    },
    {
      id: "production-authentication-security",
      title: "Production Authentication Security and Failure Cases",
      durationMinutes: 30,
      explanation: `
<b>A login system is security infrastructure, not just another CRUD feature.</b>

The basic flow may work perfectly in development and still fail under real-world attacks.

Consider an attacker trying to guess passwords.

If the login endpoint responds immediately to every request and has no abuse controls, an attacker can automate large numbers of guesses.

Production systems should consider rate limiting, account-protection policies, monitoring, and appropriate responses to repeated failures.

<b>Credential stuffing</b> is another real-world threat. Attackers may use username/password pairs leaked from another service. This is one reason applications should encourage strong unique passwords and support stronger authentication mechanisms where appropriate.

<b>Session invalidation</b> is another important requirement.

Imagine Alice logs in on her laptop and phone. She later loses the phone and wants to sign out that device. A production authentication system needs a way to revoke the relevant session or refresh-token family.

This is one reason a completely stateless authentication design can become complicated when strong revocation requirements appear.

<b>Password changes and security events</b> also require thought.

After a password change, an application may want to invalidate existing sessions depending on its security policy. After a suspicious refresh-token reuse event, the application may revoke the affected session family.

<b>Key rotation</b> matters for long-running production systems.

If a JWT signing key is compromised or needs to be rotated, the system should have a controlled mechanism for introducing a new key and eventually retiring the old one. Key identifiers such as a JWT <code>kid</code> can help verifiers select the correct trusted public key in systems using asymmetric signing.

<b>Clock and expiration problems</b> can also appear in distributed systems. Token validation depends on timestamps. Small clock differences may need carefully designed tolerance, while excessive tolerance can unintentionally extend credential lifetimes.

<b>Authentication is also an observability problem.</b>

Monitor events such as:
- failed login rates,
- successful login rates,
- unusual geographic or device changes where appropriate,
- refresh-token reuse,
- password resets,
- account lock or throttling events,
- session creation and revocation.

Do not turn logs into a credential database. Record enough information to investigate security events without storing the secret itself.

Finally, remember that HTTPS is fundamental. Bearer tokens and session identifiers are credentials. Sending them over an unencrypted connection can expose them to interception.
`,
      diagram: `
                    Authentication System
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
     Credentials        Sessions        Tokens
          |                |                |
          +----------------+----------------+
                           |
                           v
                  Security Controls
                           |
       +---------+---------+---------+---------+
       |         |         |         |         |
     HTTPS    Rate Limit  Rotation  Revocation  Logging
`,
      codeExample: {
        title: "Production-Oriented Authentication Configuration",
        code: `
import { Injectable, UnauthorizedException } from "@nestjs/common";

interface AuthConfig {
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
  issuer: string;
}

@Injectable()
export class AuthenticationPolicy {
  constructor(private readonly config: AuthConfig) {}

  validateConfiguration() {
    if (this.config.accessTokenTtlSeconds <= 0) {
      throw new Error("Access-token lifetime must be positive");
    }

    if (this.config.refreshTokenTtlSeconds <= this.config.accessTokenTtlSeconds) {
      throw new Error(
        "Refresh-token lifetime should normally exceed access-token lifetime",
      );
    }

    if (!this.config.issuer) {
      throw new Error("Authentication issuer must be configured");
    }
  }

  rejectInvalidTokenType(payload: { type?: string }) {
    if (payload.type !== "access") {
      throw new UnauthorizedException("Expected an access token");
    }
  }
}
`,
      },
      keyTakeaways: [
        "Authentication endpoints need abuse protection such as rate limiting and monitoring.",
        "Production systems need explicit session and token revocation strategies.",
        "Signing keys should support controlled rotation rather than being permanent secrets.",
        "Security logs should capture useful events without exposing credentials.",
        "HTTPS is essential because session identifiers and bearer tokens are credentials.",
        "Authentication architecture should account for recovery, logout, password changes, suspicious activity, and operational failures."
      ],
      commonMistakes: [
        "<b>No rate limiting on login.</b> A correct password verifier can still be abused by automated attackers.",
        "<b>Assuming expiration solves every revocation problem.</b> Security-sensitive events may require immediate session or token invalidation.",
        "<b>Never rotating signing keys.</b> Long-lived infrastructure needs a key lifecycle strategy.",
        "<b>Logging tokens for debugging.</b> Debug logs often survive longer than expected and may be accessible to many systems.",
        "<b>Ignoring multi-device sessions.</b> Users need predictable ways to see or revoke active sessions in applications where session management matters."
      ],
      quiz: [
        {
          question: "Why is rate limiting useful on login endpoints?",
          options: [
            "It makes passwords unnecessary",
            "It reduces automated credential-guessing and abuse",
            "It makes JWT signatures stronger",
            "It replaces authorization"
          ],
          correctIndex: 1,
          explanation: "Rate limiting makes large-scale automated login attempts more difficult and gives the application an additional abuse-control layer."
        },
        {
          question: "Why might a production application need server-side refresh-token state even when access tokens are JWTs?",
          options: [
            "JWTs cannot have expiration",
            "To support revocation, rotation, reuse detection, and session management",
            "Because HTTP cannot carry JWTs",
            "To store user passwords"
          ],
          correctIndex: 1,
          explanation: "Server-side state can provide control that purely stateless access-token validation does not provide."
        }
      ]
    },
    {
      id: "authentication-architecture-design",
      title: "Designing a Complete Authentication Architecture",
      durationMinutes: 30,
      explanation: `
<b>Let's put everything together into a production-style mental model.</b>

Imagine the course project is an e-commerce platform with web, mobile, and administrative clients.

Different clients may have different authentication requirements, but the central authentication service can still provide a consistent identity model.

A possible architecture is:

<pre>
                    Web Client
                        |
                    Mobile App
                        |
                   Admin Client
                        |
                        v
                Authentication API
                        |
        +---------------+---------------+
        |               |               |
        v               v               v
   User Service    Token Service   Session Service
        |               |               |
        v               v               v
   PostgreSQL       Key Storage      Redis / DB
                        |
                        v
                 Protected APIs
                        |
                        v
               NestJS Auth Guards
                        |
                        v
             Authorization Policies
                        |
                        v
               Business Services
</pre>

The important design question is not "Should I use JWT?"

The better question is:

<b>"What authentication architecture fits this application's clients, security requirements, operational requirements, and threat model?"</b>

For a browser application, server-side sessions with secure HttpOnly cookies can be a very reasonable architecture.

For APIs serving multiple clients, short-lived bearer access tokens plus refresh-token management can be useful.

For larger systems, asymmetric signing and centralized key management may be appropriate.

For sensitive administrative operations, stronger authentication and authorization controls may be required.

<b>Do not make the token carry every authorization decision forever.</b>

Suppose an administrator's role changes from admin to support. If the role is embedded in a long-lived access token, an old token may continue to contain the previous role until it expires.

Possible approaches include:
- short access-token lifetimes,
- permission checks against current server-side state,
- token/session revocation,
- token versioning,
- centralized authorization policies.

The correct approach depends on the application's requirements.

<b>Authentication architecture is also about failure.</b>

Ask questions such as:

What happens if Redis is unavailable?

What happens if the JWT signing key changes?

What happens if a refresh token is replayed?

What happens if a user's password is reset while they have five active sessions?

What happens if an access token expires while a mobile request is in flight?

What happens if two refresh requests happen simultaneously?

These questions turn a login feature into an engineering system.

A production-quality implementation should make these decisions explicit rather than letting framework defaults accidentally define security behavior.
`,
      diagram: `
                         Clients
                 /         |         \\
              Web       Mobile      Admin
                \\         |         /
                         |
                         v
                 Auth Controller
                         |
                         v
                    Auth Service
              /          |          \\
             /           |           \\
        Users       Token Service   Sessions
          |              |             |
          v              v             v
      PostgreSQL     Key Store       Redis/DB
                         |
                         v
                  Access Credentials
                         |
                         v
                   Auth Guards
                         |
                         v
                Authorization Policy
                         |
                         v
                  Business Services
`,
      codeExample: {
        title: "Production Authentication Module Boundaries",
        code: `
import { Module } from "@nestjs/common";

@Module({
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
    TokenService,
    PasswordService,
    SessionService,
    AuthenticationGuard,
    AuthorizationService,
  ],
  exports: [
    AuthenticationGuard,
    AuthorizationService,
  ],
})
export class AuthModule {}

// The important architectural idea is separation:
//
// AuthController
//   -> receives HTTP requests
//
// AuthService
//   -> coordinates login/logout/refresh workflows
//
// PasswordService
//   -> verifies password hashes
//
// TokenService
//   -> creates and verifies access/refresh credentials
//
// SessionService
//   -> manages revocation and device sessions
//
// AuthenticationGuard
//   -> establishes request.user
//
// AuthorizationService
//   -> answers whether that identity may perform an action
//
// Business services
//   -> should not need to know how passwords or JWT signatures work
`,
      },
      keyTakeaways: [
        "Choose authentication architecture based on clients, threat model, revocation requirements, and operational needs.",
        "Keep authentication mechanics separate from business logic.",
        "Short-lived access tokens and controlled refresh credentials create different security boundaries.",
        "Production architecture must define logout, revocation, rotation, recovery, and failure behavior.",
        "A framework should implement an intentional security architecture rather than become the architecture by accident."
      ],
      commonMistakes: [
        "<b>Choosing JWT because it is popular.</b> Technology choice should follow application requirements rather than popularity.",
        "<b>Putting authentication logic into business services.</b> Business code should consume an authenticated identity rather than understand password hashing and token signatures.",
        "<b>Ignoring concurrent refresh requests.</b> Rotation systems need to define how simultaneous refresh attempts are handled.",
        "<b>Designing only the happy path.</b> Logout, password reset, key rotation, token theft, service outages, and account recovery must also be designed.",
        "<b>Using the same security policy for every client.</b> Web, mobile, internal services, and administrative clients can have different threat models."
      ],
      quiz: [
        {
          question: "What is the best starting question when choosing between sessions and token-based authentication?",
          options: [
            "Which technology is most popular?",
            "Which architecture fits the application's clients, requirements, and threat model?",
            "Which option requires the fewest lines of code?",
            "Which option never needs a database?"
          ],
          correctIndex: 1,
          explanation: "Authentication architecture is a system-design decision. Client behavior, revocation requirements, security risks, and operational needs should guide it."
        },
        {
          question: "Why should business services avoid implementing JWT signature verification themselves?",
          options: [
            "JWTs cannot be used in services",
            "It mixes security infrastructure with business logic and makes the system harder to maintain",
            "JWT verification is impossible in TypeScript",
            "Controllers cannot call services"
          ],
          correctIndex: 1,
          explanation: "Authentication infrastructure should establish a trusted identity so business services can focus on business behavior."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What is the fundamental difference between authentication and authorization?",
      options: [
        "Authentication identifies the caller; authorization determines what the caller may do",
        "Authentication encrypts data; authorization decrypts it",
        "Authentication is only for admins; authorization is only for customers",
        "They are two names for the same operation"
      ],
      correctIndex: 0,
      explanation: "Authentication establishes identity. Authorization evaluates permissions for that identity."
    },
    {
      question: "A browser sends a secure HttpOnly cookie containing an opaque session identifier. Where is the main authentication state stored in a traditional server-side session architecture?",
      options: [
        "Only inside the browser's JavaScript memory",
        "On the server or shared session store",
        "Inside the user's password",
        "Inside DNS"
      ],
      correctIndex: 1,
      explanation: "The cookie identifies the session, while the server or shared session store holds the associated authentication state."
    },
    {
      question: "Which statement about a signed JWT is correct?",
      options: [
        "Its payload is automatically encrypted",
        "Its payload should contain passwords because the signature protects them",
        "Its signature helps detect modification and authenticate the issuer when verification is correctly configured",
        "It cannot expire"
      ],
      correctIndex: 2,
      explanation: "A signature protects integrity and provides authenticity when the verifier trusts the signing key. It does not automatically encrypt the payload."
    },
    {
      question: "Why are access tokens commonly short-lived in an access-token/refresh-token architecture?",
      options: [
        "To reduce the useful lifetime of a stolen access token",
        "Because HTTP rejects long-lived tokens",
        "To eliminate the need for authorization",
        "Because refresh tokens cannot be longer-lived"
      ],
      correctIndex: 0,
      explanation: "Short access-token lifetimes reduce the exposure window if an access token is stolen."
    },
    {
      question: "What is a key benefit of refresh-token rotation?",
      options: [
        "It makes refresh tokens permanent",
        "It can invalidate previously used refresh credentials and help detect replay",
        "It prevents passwords from being hashed",
        "It removes the need for HTTPS"
      ],
      correctIndex: 1,
      explanation: "Rotation replaces the refresh credential and can make reuse of an old credential detectable."
    },
    {
      question: "A user is authenticated as user 42 but requests another customer's private order. What should the application primarily perform?",
      options: [
        "Another password hash",
        "Authorization or ownership validation",
        "A database migration",
        "JWT encoding only"
      ],
      correctIndex: 1,
      explanation: "Identity is already established. The application now needs to determine whether user 42 is authorized to access that order."
    },
    {
      question: "Why should authentication secrets not be written into ordinary application logs?",
      options: [
        "Logs cannot contain strings",
        "Centralized logs may expose credentials to operators or systems that should not have them",
        "Logs automatically delete tokens",
        "It makes JWTs expire"
      ],
      correctIndex: 1,
      explanation: "Tokens, session identifiers, and passwords are credentials. Logging them creates an additional credential-leak path."
    },
    {
      question: "Why can a production JWT system still need server-side state?",
      options: [
        "JWTs cannot contain claims",
        "Server-side state can support revocation, refresh-token rotation, reuse detection, and session management",
        "JWTs cannot be verified without a database",
        "HTTP requires sessions"
      ],
      correctIndex: 1,
      explanation: "Stateless access-token verification does not automatically provide strong session and revocation controls."
    },
    {
      question: "Which NestJS component is particularly suitable for enforcing authentication on protected routes?",
      options: [
        "Guard",
        "Entity",
        "Migration",
        "DTO class only"
      ],
      correctIndex: 0,
      explanation: "NestJS guards integrate naturally with request authorization and authentication decisions."
    },
    {
      question: "What should happen if a refresh endpoint receives a token whose purpose/type is explicitly marked as an access token?",
      options: [
        "Treat it as a valid refresh credential",
        "Reject it because token purpose should be enforced",
        "Convert it into a password",
        "Ignore the token type"
      ],
      correctIndex: 1,
      explanation: "Access and refresh credentials have different purposes. The server should verify that the presented credential is valid for the requested operation."
    },
    {
      question: "Which question is most useful when deciding between cookie-based sessions and token-based authentication?",
      options: [
        "Which one has the coolest name?",
        "Which one has the shortest code sample?",
        "Which architecture fits the clients, threat model, revocation requirements, and operational constraints?",
        "Which one removes the need for authorization?"
      ],
      correctIndex: 2,
      explanation: "Authentication architecture should be selected based on actual system requirements rather than popularity or code size."
    },
    {
      question: "Why should session identifiers be regenerated after authentication in appropriate session architectures?",
      options: [
        "To reduce session-fixation risk",
        "To make passwords longer",
        "To disable authorization",
        "To avoid database indexes"
      ],
      correctIndex: 0,
      explanation: "Regenerating the session identifier after login helps prevent an attacker from fixing a known pre-authentication session identifier and then reusing it after authentication."
    }
  ],
  project: {
    name: "Production-Style E-Commerce Authentication System",
    goal: "Build a NestJS authentication subsystem that supports secure login, authenticated requests, authorization, short-lived access tokens, refresh tokens, logout, and session-aware security controls.",
    brief: `
Extend the course e-commerce application with an authentication architecture suitable for a realistic web API.

The system should support customer registration and login, secure password hashing, authenticated API requests, role-based authorization, short-lived access tokens, refresh tokens, logout, and refresh-token/session revocation.

Do not treat authentication as one controller method. Organize the implementation into clear modules and services so that business logic does not need to understand password hashing or token-signing details.

The project should also demonstrate the difference between authentication and authorization by protecting customer-owned resources and administrator-only operations.
`,
    steps: [
      "Create an AuthModule containing an AuthController, AuthService, TokenService, PasswordService, and the required guards/providers.",
      "Create a User entity or Prisma model containing an ID, email, password hash, role, and appropriate timestamps.",
      "Implement registration and hash passwords with Argon2id or bcrypt. Never store the original password.",
      "Implement login and verify the supplied password against the stored password hash.",
      "Issue a short-lived access token after successful authentication. Include a stable user identifier and an explicit token type.",
      "Issue a refresh credential with a longer lifetime and associate it with a server-side session or refresh-token record.",
      "Protect a sample endpoint such as GET /orders/me using a NestJS authentication guard.",
      "Ensure GET /orders/me uses the authenticated identity from the verified credential instead of accepting an arbitrary userId as proof of ownership.",
      "Create an authorization rule that allows administrators to access an admin endpoint while denying ordinary customers.",
      "Implement a refresh endpoint that verifies the credential, checks that it is a refresh token, verifies that its session is still active, and issues a new access token.",
      "Implement refresh-token rotation so successful refresh operations invalidate the previous refresh credential and create a replacement.",
      "Implement logout by invalidating the relevant session or refresh-token record and clearing the browser cookie if cookies are used.",
      "Configure authentication secrets through environment configuration rather than hard-coding them in source code.",
      "Add validation and consistent error handling for invalid credentials, expired credentials, revoked sessions, and unauthorized resource access.",
      "Add rate limiting or another abuse-control mechanism to the login endpoint.",
      "Add tests for successful login, incorrect passwords, protected routes, authorization failures, expired access tokens, invalid refresh tokens, refresh rotation, and logout.",
      "Review application logging and make sure passwords, access tokens, refresh tokens, session identifiers, and Authorization headers are not accidentally logged."
    ],
    acceptance: [
      "A new user can register without the plain-text password being stored in the database.",
      "A valid user can log in and receive an appropriate authentication credential.",
      "Invalid credentials are rejected without revealing unnecessary information.",
      "A protected endpoint rejects unauthenticated requests.",
      "An authenticated customer can access their own protected resources but cannot use a user-controlled ID to bypass ownership checks.",
      "An administrator-only endpoint rejects authenticated users who do not have the required permission.",
      "Access tokens have a short, explicit lifetime and are rejected after expiration.",
      "A valid refresh credential can obtain a new access token.",
      "An old rotated refresh credential cannot be reused successfully.",
      "Logout invalidates the appropriate authentication session or refresh credential.",
      "Authentication secrets are loaded through configuration and are not committed directly into the source code.",
      "Authentication credentials are excluded from normal application logs.",
      "Automated tests cover the main authentication and authorization success and failure paths."
    ],
    stretch: [
      "Add a user-facing session-management endpoint that lists active sessions or devices without exposing refresh-token values.",
      "Allow a user to revoke one selected session without logging out every other device.",
      "Implement refresh-token family tracking and detect reuse of an invalidated refresh token.",
      "Add password-change behavior that invalidates existing sessions according to an explicit security policy.",
      "Add asymmetric JWT signing with a key identifier and design a safe signing-key rotation strategy.",
      "Add email verification and password-reset flows using short-lived, purpose-specific credentials.",
      "Add security-event auditing for login success, login failure, logout, password change, refresh-token reuse, and administrative access.",
      "Add end-to-end tests that exercise authentication through the actual HTTP layer rather than only testing isolated services.",
      "Document the authentication threat model and explain why the chosen session/token architecture fits the web and API clients.",
      "Add stronger authentication for sensitive administrative actions, such as step-up authentication or another appropriate second factor."
    ]
  }
};
