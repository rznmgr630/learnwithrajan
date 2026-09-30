import type { LessonDay } from "@/lib/learn/lesson-types";

export const JWT_DAY_38_LESSONS: LessonDay = {
  day: 38,
  title: "JWT",
  totalMinutes: 200,
  difficulty: "Advanced",
  lessons: [
    {
      id: "jwt-structure",
      title: "JWT Structure",
      durationMinutes: 35,
      explanation: `<b>A compact JWT has three dot-separated components: header, payload, and signature.</b>

The header contains metadata such as the token type and signing algorithm. The payload contains claims. The signature protects the signed content from undetected modification when verification uses the correct trusted key.

<pre>
header.payload.signature
</pre>

A signed JWT is normally <b>encoded, not encrypted</b>. Anyone who possesses it can generally decode the header and payload. Therefore never put passwords, credit-card numbers, medical secrets, or other confidential data into an ordinary signed JWT simply because it is signed.

The server must verify the signature before trusting claims. Decoding is not authentication.

Algorithm selection must also be explicit. Do not let an incoming token dictate an unsafe verification configuration.

JWTs can be useful for APIs, but they are not automatically superior to server-side sessions. The architecture should follow the application's clients, revocation needs, and threat model.`,
      diagram: `JWT
 |
 +--> Header
 |      alg / typ / kid
 |
 +--> Payload
 |      claims
 |
 +--> Signature
        integrity/authenticity
`,
      codeExample: {
        title: "JWT Parts",
        code: `const payload = {
  sub: 42,
  type: "access",
  iss: "auth-service",
  aud: "orders-api",
  exp: 1790000900,
};

// Decoding this object is not enough.
// The server must verify the token signature and claims.
`,
      },
      keyTakeaways: [
        "JWTs contain header, payload, and signature.",
        "Signed JWTs are not automatically encrypted.",
        "Decoding a JWT does not establish trust.",
        "Verification must use explicitly trusted algorithms and keys."
],
      commonMistakes: [
        "<b>Putting secrets in the payload.</b> Signed does not mean confidential.",
        "<b>Trusting decoded payloads.</b> Attackers can modify untrusted data.",
        "<b>Accepting arbitrary algorithms.</b> Verification policy must be explicit."
],
      quiz: [
        {
                "question": "What are the three JWT components?",
                "options": [
                        "Header, payload, signature",
                        "Cookie, session, database",
                        "User, role, password",
                        "Issuer, audience, controller"
                ],
                "correctIndex": 0,
                "explanation": "A compact JWT contains header, payload, and signature."
        },
        {
                "question": "Does signing a JWT normally encrypt its payload?",
                "options": [
                        "Yes",
                        "No",
                        "Only if stored in Redis",
                        "Only in development"
                ],
                "correctIndex": 1,
                "explanation": "Signing provides integrity/authenticity, not normal payload confidentiality."
        }
],
    },
    {
      id: "claims",
      title: "Claims",
      durationMinutes: 30,
      explanation: `<b>Claims are statements carried in the JWT payload.</b>

Common registered claims include:

<pre>
sub  subject
iss  issuer
aud  audience
exp  expiration
iat  issued-at
nbf  not-before
jti  token identifier
</pre>

An application can also define claims such as \`type: "access"\`.

For example:

<pre>
{
  "sub": "42",
  "iss": "auth-service",
  "aud": "ecommerce-api",
  "type": "access",
  "exp": 1790000900
}
</pre>

The \`sub\` claim can identify the user. \`iss\` tells the verifier who issued the token. \`aud\` limits the intended recipient. \`exp\` defines when it stops being valid.

Do not put the entire user record into every token. Claims can become stale, large, and difficult to revoke. If a user's permissions can change quickly, current server-side authorization state may be necessary.

Claims are only trustworthy after the token's authenticity has been verified.`,
      diagram: `Payload
 |
 +--> sub  -> subject
 +--> iss  -> issuer
 +--> aud  -> audience
 +--> exp  -> expiration
 +--> iat  -> issued time
 +--> jti  -> token ID
 +--> type -> application purpose
`,
      codeExample: {
        title: "Claim Validation",
        code: `function validateClaims(payload: {
  sub?: number;
  type?: string;
}) {
  if (!payload.sub) {
    throw new UnauthorizedException("Missing subject");
  }

  if (payload.type !== "access") {
    throw new UnauthorizedException("Wrong token type");
  }

  return payload;
}
`,
      },
      keyTakeaways: [
        "Claims describe identity, issuer, audience, timing, and purpose.",
        "sub, iss, aud, and exp are especially important in access-token designs.",
        "Avoid unnecessary mutable data in JWTs.",
        "Verify authenticity before trusting claims."
],
      commonMistakes: [
        "<b>Trusting sub before verification.</b> An attacker can invent any subject in an untrusted payload.",
        "<b>Ignoring audience.</b> Tokens for one API should not automatically be accepted by another.",
        "<b>Embedding an entire user object.</b> Tokens become stale and oversized."
],
      quiz: [
        {
                "question": "What does \`aud\` represent?",
                "options": [
                        "The intended audience of the token",
                        "The user's password",
                        "The token's database",
                        "The HTTP status"
                ],
                "correctIndex": 0,
                "explanation": "\`aud\` identifies the intended recipient or audience."
        },
        {
                "question": "Why can roles in long-lived JWTs become stale?",
                "options": [
                        "The user's role may change while the old token remains valid",
                        "JWTs cannot store strings",
                        "Roles cannot be authorized",
                        "The payload is always encrypted"
                ],
                "correctIndex": 0,
                "explanation": "JWT claims are snapshots taken when the token is issued."
        }
],
    },
    {
      id: "expiration",
      title: "Expiration and Token Lifetime",
      durationMinutes: 30,
      explanation: `<b>Expiration limits the useful lifetime of a credential.</b>

An access token commonly has an \`exp\` claim or equivalent library configuration. A 15-minute access token means the verifier should reject it after that point.

This reduces the exposure window if the bearer credential is stolen.

But <b>expiration is not revocation</b>.

Expiration says "this credential naturally stops working at time X." Revocation says "invalidate it now."

For example, a disabled account may need to lose access immediately even though its token has five minutes left. The application can accomplish that with current-user checks, token/session state, or another revocation design.

Distributed systems also need clock considerations. Small clock differences can create edge cases near expiration, so libraries may support limited tolerance. Excessive tolerance can unintentionally extend token lifetime.

Token lifetime is a risk and usability decision. Very long lifetimes increase exposure. Extremely short lifetimes increase refresh traffic and can cause poor client experiences if refresh handling is unreliable.`,
      diagram: `Issued
  |
  v
Access token
  |
  | valid until exp
  v
Protected API
  |
  | expiration reached
  v
Reject
  |
  v
Refresh flow
`,
      codeExample: {
        title: "JWT Expiration",
        code: `const token = await jwtService.signAsync(
  {
    sub: user.id,
    type: "access",
  },
  {
    expiresIn: "15m",
    issuer: "auth-service",
    audience: "ecommerce-api",
  },
);
`,
      },
      keyTakeaways: [
        "Expiration limits credential lifetime.",
        "Expiration and revocation are different controls.",
        "Clock tolerance should be small and deliberate.",
        "Choose token lifetimes according to risk and client behavior."
],
      commonMistakes: [
        "<b>Making access tokens extremely long-lived.</b> Stolen bearer credentials remain useful longer.",
        "<b>Assuming logout immediately kills a stateless JWT.</b> It may remain valid until expiration without extra controls.",
        "<b>Using excessive clock tolerance.</b> This can extend effective validity."
],
      quiz: [
        {
                "question": "What does exp control?",
                "options": [
                        "When the token should stop being accepted",
                        "The user's role",
                        "The database password",
                        "The signing algorithm"
                ],
                "correctIndex": 0,
                "explanation": "exp defines the token's expiration time."
        },
        {
                "question": "Why is expiration not revocation?",
                "options": [
                        "Expiration is scheduled; revocation can happen earlier",
                        "They are identical",
                        "Revocation only affects cookies",
                        "Expiration requires PostgreSQL"
                ],
                "correctIndex": 0,
                "explanation": "A token can be revoked before its natural expiration."
        }
],
    },
    {
      id: "access-refresh",
      title: "Access and Refresh Tokens",
      durationMinutes: 35,
      explanation: `<b>Access and refresh tokens solve different lifecycle problems.</b>

The access token is sent to protected APIs and should usually be short-lived.

The refresh token is sent to the authentication service to obtain a new access token. It normally lives longer and therefore needs stronger lifecycle protection.

<pre>
Login
  |
  +--> Access token
  |
  +--> Refresh token
          |
          v
      Auth server
          |
          v
      New access token
</pre>

Never accept a refresh credential as an access credential. Give each token an explicit purpose and configure separate verification rules.

For stronger logout and revocation, store refresh-session state server-side. This lets the server revoke the long-lived authentication session without requiring every access token to be individually stored.

The client storage decision depends on platform. Browser applications often use HttpOnly Secure cookies for sensitive refresh credentials. Mobile clients can use platform secure storage. There is no universal storage rule independent of the threat model.`,
      diagram: `Login
  |
  +--> Access Token --15m--> API
  |
  +--> Refresh Token --7d--> Auth Service
                                |
                                v
                           New Access
`,
      codeExample: {
        title: "Token Pair",
        code: `async issueTokens(userId: number, sessionId: string) {
  const accessToken = await this.jwt.signAsync(
    { sub: userId, sid: sessionId, type: "access" },
    { expiresIn: "15m" },
  );

  const refreshToken = await this.jwt.signAsync(
    { sub: userId, sid: sessionId, type: "refresh" },
    { expiresIn: "7d" },
  );

  return { accessToken, refreshToken };
}
`,
      },
      keyTakeaways: [
        "Access tokens protect normal APIs.",
        "Refresh tokens provide longer-lived continuity.",
        "Token purpose must be explicitly enforced.",
        "Refresh-session state can provide stronger logout and revocation control."
],
      commonMistakes: [
        "<b>Using one token for both purposes.</b> Different lifetimes and controls are valuable security boundaries.",
        "<b>Making refresh tokens permanent.</b> Long-lived credentials still need expiration and revocation.",
        "<b>Ignoring client storage threats.</b> Choose storage according to platform and threat model."
],
      quiz: [
        {
                "question": "Which token normally calls a protected API?",
                "options": [
                        "Access token",
                        "Refresh token",
                        "Password hash",
                        "Reset token"
                ],
                "correctIndex": 0,
                "explanation": "Access tokens are intended for normal protected API requests."
        },
        {
                "question": "Why should refresh tokens be protected carefully?",
                "options": [
                        "They can provide continued access to new credentials",
                        "They are database tables",
                        "They cannot expire",
                        "They replace HTTPS"
                ],
                "correctIndex": 0,
                "explanation": "A stolen refresh credential can often be exchanged for new access tokens."
        }
],
    },
    {
      id: "rotation-revocation",
      title: "Rotation and Revocation",
      durationMinutes: 35,
      explanation: `<b>Refresh-token rotation gives the authentication server more control over long-lived credentials.</b>

Suppose refresh token A is current:

<pre>
A -> access B + refresh C
</pre>

After success, A becomes invalid. If A appears again, the server can detect possible replay.

A server-side refresh-session record can contain a session ID, user ID, token-family ID, current token identifier, expiration, and revocation state.

<b>Revocation</b> invalidates a session or credential before its natural expiry. Logout, password reset, account suspension, administrator action, and refresh-token reuse can all trigger revocation.

A subtle production issue is concurrent refresh. Two requests may try to use the same refresh token almost simultaneously. Your design needs a deliberate policy, such as client-side coordination, a tiny safe reuse window, or transactional rotation.

Do not assume that rotating refresh tokens makes access tokens disappear immediately. An already-issued access token may remain valid until expiration unless the API performs additional server-side checks.`,
      diagram: `Refresh A
   |
   v
Rotate
   |
   +--> Access B
   +--> Refresh C
             |
             v
          current

Reuse A
   |
   v
Detect replay
   |
   v
Revoke session/family
`,
      codeExample: {
        title: "Refresh Rotation",
        code: `async rotate(session: RefreshSession, presentedId: string) {
  if (session.revokedAt) {
    throw new UnauthorizedException("Session revoked");
  }

  if (session.currentTokenId !== presentedId) {
    await this.sessions.revokeFamily(session.tokenFamilyId);
    throw new UnauthorizedException("Refresh reuse detected");
  }

  const nextId = crypto.randomUUID();

  await this.sessions.rotate(
    session.id,
    presentedId,
    nextId,
  );

  return this.issueTokens(session.userId, session.id, nextId);
}
`,
      },
      keyTakeaways: [
        "Rotation invalidates the previously used refresh credential.",
        "Revocation can invalidate a session before normal expiry.",
        "Server-side refresh state enables stronger lifecycle control.",
        "Concurrent refresh behavior must be deliberately designed."
],
      commonMistakes: [
        "<b>Rotating without replay detection.</b> Reuse can be an important security signal.",
        "<b>Storing raw refresh credentials unnecessarily.</b> Treat them as secrets.",
        "<b>Ignoring concurrent refresh.</b> Legitimate clients can issue overlapping requests.",
        "<b>Assuming logout instantly invalidates stateless access JWTs.</b> Extra controls may be required."
],
      quiz: [
        {
                "question": "What happens to a successfully rotated refresh token?",
                "options": [
                        "It should normally become invalid",
                        "It should remain permanent",
                        "It becomes a password",
                        "It becomes an admin token"
                ],
                "correctIndex": 0,
                "explanation": "Rotation is intended to invalidate the previous refresh credential."
        },
        {
                "question": "What can old refresh-token reuse indicate?",
                "options": [
                        "Possible credential replay or theft",
                        "A database migration",
                        "A harmless decode",
                        "A successful authorization check"
                ],
                "correctIndex": 0,
                "explanation": "Reuse of a rotated credential can indicate that an old credential was copied."
        }
],
    },
    {
      id: "jwt-production",
      title: "Production JWT Design",
      durationMinutes: 35,
      explanation: `<b>Production JWT design is mostly about failure behavior.</b>

Define what happens when an access token expires, a refresh token expires, an account is disabled, a signing key rotates, a refresh credential is replayed, two refresh requests race, or a user logs out.

<b>Key rotation</b> should be designed before production needs it. With asymmetric signing, a private key signs while trusted public keys verify. A \`kid\` can identify the correct verification key.

<b>Authorization freshness</b> also matters. A role embedded in a token is a snapshot. If permissions change, old tokens may retain old claims until they expire. Short access lifetimes or current server-side authorization checks can reduce this window.

<b>Observability</b> should track authentication failures, refresh failures, reuse detections, and session changes without logging bearer credentials.

Finally, test invalid signatures, wrong audiences, expired credentials, replayed refresh tokens, and revoked sessions. The failure paths are part of the security architecture.`,
      diagram: `JWT System
   |
   +--> Signing Keys
   +--> Expiration
   +--> Refresh State
   +--> Revocation
   +--> Monitoring
          |
          v
     Protected APIs
`,
      codeExample: {
        title: "Explicit Verification Policy",
        code: `const verification = {
  algorithms: ["RS256"],
  issuer: "https://auth.example.com",
  audience: "ecommerce-api",
};

// In a production asymmetric setup, use a trusted public-key set
// and select the correct key using a controlled \`kid\` value.
//
// Keep private signing keys in secure secret management.
`,
      },
      keyTakeaways: [
        "JWT architecture must define failure, revocation, and rotation behavior.",
        "Key rotation should be planned before an incident.",
        "Token claims can become stale as authorization changes.",
        "Never log reusable bearer credentials."
],
      commonMistakes: [
        "<b>Hard-coding private keys.</b> Signing keys need secure storage and lifecycle management.",
        "<b>Logging complete tokens.</b> Logs can become a credential leak.",
        "<b>Testing only successful verification.</b> Security boundaries need negative tests.",
        "<b>Assuming JWT means no server-side state.</b> Refresh sessions and revocation often require state."
],
      quiz: [
        {
                "question": "What can \`kid\` help identify?",
                "options": [
                        "Which trusted signing key should verify a token",
                        "Which password to hash",
                        "Which database table to migrate",
                        "Which user interface to render"
                ],
                "correctIndex": 0,
                "explanation": "kid can identify the signing key used for verification."
        },
        {
                "question": "Why should bearer tokens not be logged?",
                "options": [
                        "A valid captured token can be reused by an attacker",
                        "JWTs cannot be strings",
                        "Logs cannot be encrypted",
                        "They make SQL invalid"
                ],
                "correctIndex": 0,
                "explanation": "Bearer tokens are credentials and should be treated as sensitive secrets."
        }
],
    }
  ],
  finalQuiz: [
    {
        "question": "What are the three JWT components?",
        "options": [
            "Header, payload, signature",
            "Cookie, session, database",
            "User, role, password",
            "Issuer, controller, database"
        ],
        "correctIndex": 0,
        "explanation": "A compact JWT contains header, payload, and signature."
    },
    {
        "question": "Does a signed JWT normally encrypt its payload?",
        "options": [
            "Yes",
            "No",
            "Only with Redis",
            "Only in production"
        ],
        "correctIndex": 1,
        "explanation": "Signing does not normally provide payload confidentiality."
    },
    {
        "question": "What does sub commonly represent?",
        "options": [
            "The token subject",
            "The password",
            "The API audience",
            "The cookie domain"
        ],
        "correctIndex": 0,
        "explanation": "sub commonly identifies the subject represented by the token."
    },
    {
        "question": "Why validate aud?",
        "options": [
            "To ensure the token is intended for the receiving API",
            "To hash passwords",
            "To create refresh tokens",
            "To choose a CSS theme"
        ],
        "correctIndex": 0,
        "explanation": "Audience validation helps prevent a token issued for one service from being accepted by another."
    },
    {
        "question": "What is the difference between expiration and revocation?",
        "options": [
            "Expiration is time-based; revocation can happen before expiry",
            "They are identical",
            "Revocation only affects passwords",
            "Expiration always requires Redis"
        ],
        "correctIndex": 0,
        "explanation": "Revocation provides an earlier invalidation mechanism."
    },
    {
        "question": "Why separate access and refresh credentials?",
        "options": [
            "They have different purposes and security lifetimes",
            "JWTs cannot contain multiple claims",
            "It removes authorization",
            "It disables HTTPS"
        ],
        "correctIndex": 0,
        "explanation": "Separate credentials allow different lifetimes and controls."
    },
    {
        "question": "What is refresh rotation?",
        "options": [
            "Replacing a refresh credential after successful use",
            "Making it permanent",
            "Removing expiration",
            "Hashing the header"
        ],
        "correctIndex": 0,
        "explanation": "Rotation invalidates the old refresh credential and issues a replacement."
    },
    {
        "question": "Why keep refresh-session state server-side?",
        "options": [
            "To support revocation, rotation, and replay detection",
            "Because JWTs cannot expire",
            "Because HTTP requires it",
            "To store passwords"
        ],
        "correctIndex": 0,
        "explanation": "Server-side state provides lifecycle control for long-lived authentication."
    },
    {
        "question": "What can replay of an old refresh token indicate?",
        "options": [
            "Possible credential theft or replay",
            "A normal migration",
            "A valid password change",
            "A harmless decode"
        ],
        "correctIndex": 0,
        "explanation": "Reusing a rotated token can be a security signal."
    },
    {
        "question": "Why should clock tolerance be limited?",
        "options": [
            "Large tolerance can extend credential validity",
            "It encrypts tokens",
            "It creates salts",
            "It disables signatures"
        ],
        "correctIndex": 0,
        "explanation": "Excessive tolerance can extend the effective token lifetime."
    }
],
  project: {
    name: "JWT Token Lifecycle Service",
    goal: "Build a production-oriented JWT lifecycle with claims, expiration, access tokens, refresh tokens, rotation, and revocation.",
    brief: "Create an e-commerce token service that issues short-lived access credentials and longer-lived refresh credentials. Track refresh sessions server-side and implement rotation, reuse detection, logout, and tests.",
    steps: [
      "Define access-token claims including sub, iss, aud, iat, exp, and an explicit type.",
      "Configure verification with trusted algorithms, issuer, and audience.",
      "Issue short-lived access tokens for protected APIs.",
      "Issue refresh credentials tied to a server-side session.",
      "Implement refresh-token rotation.",
      "Reject reuse of a rotated refresh credential and apply a documented response.",
      "Implement logout by revoking the relevant session.",
      "Define how password changes and account suspension affect sessions.",
      "Test expiration, wrong audience, wrong issuer, wrong token type, invalid signature, rotation, replay, and revocation.",
      "Ensure complete tokens are excluded from logs."
    ],
    acceptance: [
      "Access tokens have explicit claims and short lifetimes.",
      "Invalid signature, issuer, audience, and expiration are rejected.",
      "Refresh tokens cannot authenticate access-only endpoints.",
      "Successful refresh rotates the refresh credential.",
      "Old refresh credentials are rejected.",
      "Logout revokes the appropriate session.",
      "Automated tests cover the token lifecycle."
    ],
    stretch: [
      "Implement asymmetric signing with RS256 and kid.",
      "Support multiple device sessions.",
      "Add controlled concurrent-refresh handling.",
      "Add token-family security events and monitoring.",
      "Implement a safe signing-key rotation procedure."
    ]
  },
};