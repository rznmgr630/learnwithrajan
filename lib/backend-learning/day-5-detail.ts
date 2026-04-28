import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_5_DETAIL = {
  overview: [
    'Authentication (AuthN) answers "who are you?" — verifying identity via passwords, tokens, or certificates. Authorisation (AuthZ) answers "what can you do?" — checking permissions after identity is confirmed. Mixing the two is one of the most common security mistakes in backend systems.',
    "Day 5 covers JWT anatomy and refresh token rotation, the OAuth2 authorisation code flow with a Google provider, role-based access control (RBAC), and the auth vulnerabilities you need to actively defend against.",
  ],
  sections: [
    {
      title: "AuthN vs AuthZ",
      blocks: [
        {
          type: "table",
          headers: ["Concept", "Question it answers", "Example"],
          rows: [
            [
              "Authentication (AuthN)",
              "Who are you?",
              "Validating a password or verifying a JWT signature",
            ],
            [
              "Authorisation (AuthZ)",
              "What can you do?",
              "Checking role=admin before allowing a DELETE",
            ],
            [
              "Session",
              "Are you still logged in?",
              "Server-side store keyed by a cookie",
            ],
            [
              "Identity provider (IdP)",
              "Trust this 3rd-party assertion?",
              "Google, GitHub, Auth0 issuing tokens",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "AuthN must happen before AuthZ. A 401 Unauthorised means prove who you are; a 403 Forbidden means I know who you are but you cannot do this.",
        },
      ],
    },
    {
      title: "JWT anatomy & stateless validation",
      blocks: [
        {
          type: "diagram",
          id: "jwt-flow",
        },
        {
          type: "paragraph",
          text: "A JWT has three Base64URL-encoded parts: header (algorithm + token type), payload (claims: sub, iat, exp, roles), and signature (HMAC-SHA256 or RS256 over header.payload). The server validates the signature with no database lookup. Never put secrets or PII in the payload — it is encoded, not encrypted.",
        },
        {
          type: "code",
          title: "Verify a JWT (Node.js)",
          code: `import jwt from "jsonwebtoken";

// Always pin the expected algorithm — never trust the header's alg claim
const claims = jwt.verify(token, process.env.JWT_SECRET!, {
  algorithms: ["HS256"],
});
// { sub: "u_123", roles: ["user"], iat: 1700000000, exp: 1700003600 }`,
        },
        {
          type: "table",
          caption: "Key JWT claims",
          headers: ["Claim", "Meaning", "Best practice"],
          rows: [
            ["sub", "Subject — identifies the user", "Opaque ID, not email"],
            [
              "iat",
              "Issued-at timestamp",
              "Always set; helps detect replay attacks",
            ],
            [
              "exp",
              "Expiry timestamp",
              "Access tokens: 15 min. Refresh tokens: 7-30 days",
            ],
            [
              "jti",
              "JWT ID — unique token identifier",
              "Required for revocation / blocklists",
            ],
          ],
        },
      ],
    },
    {
      title: "Refresh token rotation",
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            "Client logs in: server issues access_token (15 min) + refresh_token (7 days, stored in httpOnly cookie).",
            "When access_token expires, client silently POSTs to /auth/refresh with the cookie.",
            "Server validates refresh token, issues a new access_token, and rotates the refresh_token (old one is invalidated).",
            "If the old refresh token is reused (stolen), server detects reuse, revokes the entire token family, forces re-login.",
          ],
        },
        {
          type: "code",
          title: "Refresh endpoint skeleton (Express)",
          code: `app.post("/auth/refresh", async (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) return res.status(401).json({ error: "no_token" });

  const record = await db.refreshTokens.findUnique({ where: { token } });
  if (!record || record.usedAt) {
    // Reuse detected — revoke entire token family
    await db.refreshTokens.updateMany({
      where: { familyId: record?.familyId },
      data: { revokedAt: new Date() },
    });
    return res.status(401).json({ error: "token_reuse" });
  }

  await db.refreshTokens.update({
    where: { token },
    data: { usedAt: new Date() },
  });
  const newRefresh = await issueRefreshToken(record.userId, record.familyId);
  const accessToken = signAccessToken(record.userId);

  res.cookie("refresh_token", newRefresh, { httpOnly: true, sameSite: "strict" });
  res.json({ access_token: accessToken });
});`,
        },
      ],
    },
    {
      title: "OAuth2 authorisation code flow",
      blocks: [
        {
          type: "diagram",
          id: "oauth2-code-flow",
        },
        {
          type: "list",
          variant: "number",
          items: [
            "App redirects user to Google /authorize with client_id, redirect_uri, scope, state, and PKCE code_challenge.",
            "User logs in at Google and consents to the requested scopes.",
            "Google redirects back to redirect_uri with a short-lived code and the same state value.",
            "App verifies state (CSRF protection) then POSTs code + code_verifier to Google /token.",
            "Google returns access_token, refresh_token, and id_token (OIDC).",
            "App uses access_token to call Google APIs or reads user identity from id_token.",
          ],
        },
        {
          type: "table",
          caption: "OAuth2 grant types",
          headers: ["Grant", "Use case", "Notes"],
          rows: [
            [
              "Authorization Code + PKCE",
              "Web and mobile apps with a user",
              "The only grant to use for user-facing apps",
            ],
            [
              "Client Credentials",
              "Service-to-service (no user)",
              "M2M; rotate client secrets regularly",
            ],
            ["Implicit", "DEPRECATED", "Replaced by Auth Code + PKCE"],
            [
              "Resource Owner Password",
              "AVOID",
              "Exposes credentials to the app; legacy only",
            ],
          ],
        },
      ],
    },
    {
      title: "Role-based access control (RBAC)",
      blocks: [
        {
          type: "diagram",
          id: "rbac-model",
        },
        {
          type: "paragraph",
          text: "RBAC assigns permissions to roles, then roles to users. A user may hold multiple roles. This keeps permission checks simple — check role membership — and decouples user management from permission management.",
        },
        {
          type: "code",
          title: "Role guard middleware (Express + JWT)",
          code: `function requireRole(...allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const roles: string[] = res.locals.claims?.roles ?? [];
    if (!allowed.some((r) => roles.includes(r))) {
      return res.status(403).json({ error: "forbidden" });
    }
    next();
  };
}

router.delete("/users/:id", requireRole("admin"), deleteUserHandler);
router.get("/reports", requireRole("admin", "analyst"), getReportsHandler);`,
        },
        {
          type: "table",
          caption: "RBAC vs ABAC vs ReBAC",
          headers: ["Model", "Decision input", "Best for"],
          rows: [
            ["RBAC", "User's roles", "Most APIs — simple and auditable"],
            [
              "ABAC",
              "User, resource, environment attributes",
              "Fine-grained: owner can edit their own posts",
            ],
            [
              "ReBAC (Zanzibar-style)",
              "Relationship graph",
              "Google Docs-style sharing, complex hierarchies",
            ],
          ],
        },
      ],
    },
    {
      title: "Sessions vs bearer tokens",
      blocks: [
        {
          type: "table",
          headers: ["Dimension", "Cookie session", "JWT bearer token"],
          rows: [
            [
              "State",
              "Server-side session store",
              "Stateless — all data in token",
            ],
            [
              "Revocation",
              "Delete from store — instant",
              "Wait for expiry or maintain a blocklist",
            ],
            [
              "Scalability",
              "Needs sticky sessions or shared store",
              "Any node can validate",
            ],
            [
              "Token size",
              "Tiny cookie (session ID only)",
              "Larger — grows with claims",
            ],
            [
              "Where to store",
              "httpOnly cookie (XSS-safe)",
              "httpOnly cookie (never localStorage)",
            ],
            [
              "CSRF risk",
              "Yes — use SameSite + CSRF token",
              "Mitigated when stored in httpOnly cookie",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Storing JWTs in localStorage is a common mistake. Any XSS can read it. Use httpOnly cookies for both sessions and JWTs so JavaScript cannot access the credential.",
        },
      ],
    },
    {
      title: "Common auth vulnerabilities",
      blocks: [
        {
          type: "table",
          headers: ["Attack", "What happens", "Defence"],
          rows: [
            [
              "XSS",
              "Injected script reads localStorage token",
              "httpOnly cookies; strict CSP; sanitise output",
            ],
            [
              "CSRF",
              "Malicious site triggers request using victim's cookie",
              "SameSite=Strict cookie; CSRF token header; check Origin",
            ],
            [
              "JWT alg confusion",
              "Attacker changes alg to none or HS256 with public key",
              "Always specify expected algorithm explicitly on verify()",
            ],
            [
              "Token in URL / Referer",
              "Access token leaks via Referer header to third parties",
              "Never put tokens in query params; set Referrer-Policy header",
            ],
            [
              "Credential stuffing",
              "Automated login attempts using leaked passwords",
              "Rate-limit /login; lockout; check HaveIBeenPwned",
            ],
          ],
        },
      ],
    },
    {
      title: "Key rotation without downtime",
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            "Publish a JWKS endpoint — clients fetch public keys by kid.",
            "Generate a new key pair, add it to JWKS with a new kid.",
            "Start signing new tokens with the new key. Old tokens still validate against the old key in JWKS.",
            "After old tokens expire (one access-token TTL, typically 15 min), remove the old key from JWKS.",
            "No downtime — the key set supports multiple active keys simultaneously.",
          ],
        },
        {
          type: "code",
          title: "JWKS endpoint (Express)",
          code: `app.get("/.well-known/jwks.json", (_req, res) => {
  res.json({
    keys: activeKeyPairs.map(({ kid, publicKey }) => ({
      ...publicKey.export({ format: "jwk" }),
      kid,
      use: "sig",
      alg: "RS256",
    })),
  });
});`,
        },
      ],
    },
  ],
  faq: [
    {
      question:
        "What is the difference between authentication and authorisation?",
      tag: "AuthN vs AuthZ",
      answer: [
        "Authentication verifies identity — the system confirms you are who you claim to be via password, token, or certificate. Authorisation determines what the verified identity is permitted to do.",
        "The HTTP status codes encode this: 401 Unauthorised means authentication is required or failed. 403 Forbidden means authenticated but lacking permission.",
      ].join("\n\n"),
      callout:
        "Treat AuthZ as a separate concern from AuthN — run guards after the identity is established, not inline with credential checking.",
    },
    {
      question: "Why are JWTs not encrypted by default? When should I use JWE?",
      tag: "JWT",
      answer: [
        "Standard JWTs (JWS) are only signed, not encrypted. The payload is Base64URL-encoded — anyone can decode it. The signature only proves the token has not been tampered with. Never put secrets, PII, or sensitive attributes in a JWT payload unless you use JWE.",
        "Use JWE when tokens may be logged, stored in a browser-visible location, or when claims are sensitive (e.g., subscription tier that affects pricing logic).",
      ].join("\n\n"),
    },
    {
      question: "Why should access tokens be short-lived (15 minutes)?",
      tag: "JWT",
      answer: [
        "If a JWT is stolen — via XSS, log leak, or compromised proxy — the attacker can use it until expiry. A 15-minute window limits the blast radius. Pair this with silent refresh token rotation so users never notice.",
        "Never omit exp or set it far in the future thinking you will revoke tokens manually. Revocation at scale requires a blocklist that most teams underestimate.",
      ].join("\n\n"),
      callout:
        "Short expiry + refresh rotation is the standard pattern used by every major IdP. It is not over-engineering — it is table stakes.",
    },
    {
      question:
        "What is PKCE and why does the OAuth2 authorisation code flow require it?",
      tag: "OAuth2",
      answer: [
        "PKCE (Proof Key for Code Exchange, RFC 7636) prevents authorisation code interception. The client generates a random code_verifier, hashes it to a code_challenge, and sends the challenge with the authorisation request. When exchanging the code for tokens, the original verifier is sent and the server verifies the hash.",
        "Without PKCE, an attacker who intercepts the authorisation code (via redirect URL hijack or a malicious app on mobile) could exchange it for tokens. PKCE binds the exchange to the client that initiated the flow.",
      ].join("\n\n"),
    },
    {
      question: "Why is storing JWTs in localStorage dangerous?",
      tag: "Token storage",
      answer: [
        "localStorage is accessible to any JavaScript running on the page. A single XSS vulnerability — injected ad script, compromised CDN, typosquatted npm package — can silently exfiltrate every stored token.",
        "httpOnly cookies cannot be read by JavaScript at all. Even with XSS, the attacker cannot steal the token directly. Combine httpOnly with SameSite=Strict to also block CSRF.",
      ].join("\n\n"),
      callout: "Rule: if JavaScript can read it, an XSS attack can steal it.",
    },
    {
      question: "What is a CSRF attack and how do SameSite cookies prevent it?",
      tag: "CSRF",
      answer: [
        "CSRF tricks a logged-in user's browser into sending a state-changing request to your API from a malicious third-party page. The browser automatically includes cookies with every request, so the session cookie rides along.",
        "SameSite=Strict tells the browser never to send the cookie on cross-origin requests, breaking the attack. SameSite=Lax blocks cross-site POSTs/PUTs but allows GET from external links. Add a CSRF token in request headers for defence in depth.",
      ].join("\n\n"),
    },
    {
      question: "How does refresh token rotation detect theft?",
      tag: "Refresh tokens",
      answer: [
        "Each refresh token is single-use. When used, it is marked consumed and a new one is issued. If an attacker steals the token and uses it first, the legitimate client will try to use an already-consumed token — the server detects reuse.",
        "On reuse detection, the server revokes the entire token family, forcing re-authentication. This bounds the damage even when the server cannot tell which request was legitimate.",
      ].join("\n\n"),
    },
    {
      question: "What is the JWT algorithm confusion vulnerability?",
      tag: "JWT security",
      answer: [
        "Early JWT libraries allowed the algorithm to be specified by the token header. An attacker could change alg from RS256 (asymmetric) to HS256 (symmetric) and sign the token with the server's public key — which is publicly available. The server would verify using the public key as the HMAC secret, accepting the forged token.",
        "Fix: always pass the expected algorithm explicitly to verify(). Never trust the alg claim in the header to select the verification algorithm.",
      ].join("\n\n"),
      callout:
        'jwt.verify(token, secret, { algorithms: ["RS256"] }) — always pin the algorithm server-side.',
    },
    {
      question: "What is RBAC and when should you use ABAC instead?",
      tag: "RBAC",
      answer: [
        "RBAC assigns permissions to roles and assigns roles to users. Simple to audit: to know what a user can do, look at their roles. To change permissions, edit the role definition.",
        "ABAC makes decisions based on arbitrary attributes — user, resource, environment. Use ABAC when ownership matters (a user can edit their own posts but not others) or when context matters (only from corporate network). ABAC is more expressive but harder to audit.",
      ].join("\n\n"),
    },
    {
      question: "How do you rotate signing keys without downtime?",
      tag: "Key rotation",
      answer: [
        "Publish a JWKS endpoint. Add the new key with a unique kid. Begin signing new tokens with the new key. Old tokens continue to validate against the old key still present in JWKS.",
        "Once all old tokens expire (one access-token TTL), remove the old key. Clients look up keys by kid automatically. The overlap window is short — equal to your access token TTL.",
      ].join("\n\n"),
    },
    {
      question: "What is the OAuth2 client credentials grant?",
      tag: "OAuth2",
      answer: [
        "The client credentials grant is for machine-to-machine auth with no user involved. Service A authenticates directly with the auth server using client_id and client_secret, receiving an access token scoped to service-level permissions.",
        "Use it for internal microservice calls, background jobs, and CI/CD pipelines. Rotate client secrets regularly and store them in a secrets manager, not environment variables committed to source control.",
      ].join("\n\n"),
    },
    {
      question: "What should a global auth error response look like?",
      tag: "Error responses",
      answer: [
        "Follow RFC 6750 for bearer token errors and RFC 9457 for problem details. Return a WWW-Authenticate header on 401 so clients know what credential type is expected. Keep error messages generic to avoid information leakage.",
      ].join("\n\n"),
      callout:
        "Never return a stack trace or detailed internal message on auth failures — attackers use these to probe your system.",
    },
  ],
} satisfies RoadmapDayDetail;
