import type { LessonDay } from "@/lib/learn/lesson-types";

export const OAUTH_2_DAY_42_LESSONS: LessonDay = {
  day: 42,
  title: "OAuth 2.0",
  totalMinutes: 124,
  difficulty: "Advanced",
  lessons: [
    {
      id: "oauth-fundamentals",
      title: "OAuth 2.0: Delegated Authorization and the Core Roles",
      durationMinutes: 18,
      explanation: `OAuth 2.0 is often described as an authentication protocol, but its original purpose is <b>delegated authorization</b>. It lets an application obtain limited access to a protected resource without asking the user to hand the application their password.
    
    Imagine you build a calendar application and want users to connect their Google calendar. Without OAuth, you might be tempted to ask users for their Google username and password. That is unsafe because your application would receive a credential that can grant much broader access than the calendar feature needs. OAuth instead lets the user authorize your application at the identity/provider's site and return an authorization result that your application can exchange for tokens.
    
    The core roles are the resource owner (usually the user), client (your application), authorization server (the component that issues tokens), and resource server (the API holding protected resources). One provider can play several roles in a deployment.
    
    OAuth does not automatically tell your application who the user is. That is where OpenID Connect comes in, which we will study on Day 43.`,
      diagram: `Resource Owner
          |
          v
    Authorization Server
          |
       access token
          |
          v
    Client -----------------> Resource Server
            Authorization: Bearer ...`,
      codeExample: {
        title: "OAuth role model",
        code: `// Your NestJS backend is the OAuth client.
    export type OAuthProviderConfig = {
      authorizationEndpoint: string;
      tokenEndpoint: string;
      clientId: string;
      redirectUri: string;
      scopes: string[];
    };
    
    // The resource server should validate access tokens before
    // returning protected data.`
      },
      keyTakeaways: [
        "OAuth delegates limited access without sharing the user's password.",
        "The client requests access; the authorization server issues tokens.",
        "The resource server protects APIs and validates access tokens.",
        "OAuth access tokens represent authorization, not necessarily user identity.",
        "OIDC adds an identity layer on top of OAuth 2.0."
      ],
      commonMistakes: [
        "Calling OAuth an authentication protocol by itself.",
        "Sending a user's provider password to your application.",
        "Assuming every access token is an ID token.",
        "Treating a client secret as safe to expose in a browser or mobile app."
      ],
      quiz: [
        {
          question: "What is OAuth 2.0 primarily designed for?",
          options: [
        "Delegated authorization",
        "Password hashing",
        "Database migrations",
        "HTML rendering"
      ],
          correctIndex: 0,
          explanation: "OAuth allows a client to obtain delegated access to protected resources."
        },
        {
          question: "Which role issues OAuth tokens?",
          options: [
        "Authorization server",
        "Browser CSS",
        "Database table",
        "Frontend component"
      ],
          correctIndex: 0,
          explanation: "The authorization server authenticates/authorizes and issues tokens."
        }
      ]
    },
    {
      id: "oauth-auth-code-pkce",
      title: "Authorization Code Flow and PKCE",
      durationMinutes: 24,
      explanation: `The Authorization Code flow is the common foundation for browser and user-delegated OAuth integrations. The user is sent to the authorization server, authenticates and grants consent, and the provider redirects back with a short-lived authorization code. Your backend exchanges that code for tokens.
    
    The code is intentionally not the final credential. It is a temporary artifact that must be exchanged at the token endpoint. This reduces the value of a code intercepted during the redirect.
    
    <b>PKCE</b> adds a proof that the same client that started the flow is the client redeeming the code. The client creates a high-entropy \`code_verifier\`, derives a \`code_challenge\`, and sends the challenge in the authorization request. During token exchange it sends the verifier. The authorization server checks that they match.
    
    PKCE is especially important for public clients such as mobile and browser applications, where a client secret cannot safely remain secret. Modern OAuth deployments commonly use Authorization Code + PKCE for interactive user authorization.
    
    Always validate the \`state\` parameter for CSRF protection in the authorization flow, use an exact registered redirect URI, and avoid putting access tokens in URLs.`,
      diagram: `Client
      |
      | code_challenge + state
      v
    Authorization Server
      |
      | redirect with code
      v
    Client
      |
      | code + code_verifier
      v
    Token Endpoint
      |
      +--> access token
      +--> refresh token (optional)`,
      codeExample: {
        title: "Authorization Code + PKCE in NestJS",
        code: `import { createHash, randomBytes } from "node:crypto";
    
    const codeVerifier = randomBytes(32).toString("base64url");
    const codeChallenge = createHash("sha256")
      .update(codeVerifier)
      .digest("base64url");
    
    const authorizationUrl =
      \`https://id.example.com/oauth2/authorize?\` +
      new URLSearchParams({
        response_type: "code",
        client_id: process.env.OAUTH_CLIENT_ID!,
        redirect_uri: "https://api.example.com/oauth/callback",
        scope: "openid profile email",
        state: "random-session-bound-value",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      });
    
    // Store codeVerifier server-side or in a protected flow context.
    // Exchange it only after receiving the authorization code.`
      },
      keyTakeaways: [
        "Authorization Code exchanges a temporary code for tokens.",
        "PKCE binds the token exchange to the original client flow.",
        "Use S256 rather than a plain code challenge.",
        "Use `state` to protect the redirect flow against CSRF.",
        "Redirect URIs must be exact and pre-registered."
      ],
      commonMistakes: [
        "Using the access token as the authorization code.",
        "Skipping PKCE for a public client.",
        "Accepting arbitrary redirect URIs.",
        "Putting access or refresh tokens in query parameters."
      ],
      quiz: [
        {
          question: "What does PKCE protect against?",
          options: [
        "Authorization code interception",
        "SQL injection",
        "Password truncation",
        "Database deadlocks"
      ],
          correctIndex: 0,
          explanation: "PKCE proves possession of the original verifier when redeeming the code."
        },
        {
          question: "Why is a client secret unsuitable as the only protection for a browser app?",
          options: [
        "Browser code cannot keep it confidential",
        "Browsers cannot use HTTPS",
        "OAuth forbids strings",
        "It makes JSON invalid"
      ],
          correctIndex: 0,
          explanation: "A secret shipped to a browser can be extracted."
        }
      ]
    },
    {
      id: "oauth-client-credentials",
      title: "Client Credentials and Machine-to-Machine OAuth",
      durationMinutes: 18,
      explanation: `Not every OAuth flow has a human user. Backend services often need to call one another. The Client Credentials grant is designed for this machine-to-machine scenario: a confidential client authenticates to the authorization server and receives an access token representing the client itself.
    
    Imagine your NestJS billing service calls a separate fraud service. There is no browser user to redirect. The billing service authenticates using its client credentials, requests a token with a narrow scope such as \`fraud:check\`, and sends that token to the fraud API.
    
    The key security idea is least privilege. Do not issue a service token with every possible permission because “it is internal.” If the billing service is compromised, excessive scopes increase the blast radius.
    
    Client credentials should be stored in a secrets manager or protected runtime configuration, never committed to Git. Rotate credentials and design for token expiration. In a large architecture, workload identity or a cloud-native identity mechanism may replace static secrets.`,
      diagram: `Billing Service
         |
         | client authentication
         v
    Authorization Server
         |
         | access token: fraud:check
         v
    Fraud API`,
      codeExample: {
        title: "Client credentials token request",
        code: `const body = new URLSearchParams({
      grant_type: "client_credentials",
      scope: "fraud:check",
    });
    
    const response = await fetch("https://id.example.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Prefer stronger client authentication mechanisms when supported.
        Authorization:
          "Basic " +
          Buffer.from(
            \`\${process.env.CLIENT_ID}:\${process.env.CLIENT_SECRET}\`,
          ).toString("base64"),
      },
      body,
    });
    
    if (!response.ok) {
      throw new Error("Token request failed");
    }
    
    const token = await response.json();`
      },
      keyTakeaways: [
        "Client Credentials is for machine-to-machine authorization.",
        "The resulting token represents the client/service rather than a human login.",
        "Scopes should be narrowly defined.",
        "Store client credentials securely and rotate them.",
        "Service-to-service authorization still requires resource-server validation."
      ],
      commonMistakes: [
        "Using Client Credentials when a human user's delegated access is required.",
        "Giving internal services all scopes.",
        "Hard-coding client secrets.",
        "Assuming internal network location is authorization."
      ],
      quiz: [
        {
          question: "When is Client Credentials appropriate?",
          options: [
        "A backend service calling another service",
        "A user choosing a profile photo",
        "A browser rendering HTML",
        "A password reset form"
      ],
          correctIndex: 0,
          explanation: "It is designed for confidential machine clients without a user redirect."
        },
        {
          question: "What should service scopes generally follow?",
          options: [
        "Least privilege",
        "Maximum access",
        "Random values",
        "No authorization"
      ],
          correctIndex: 0,
          explanation: "Narrow scopes reduce impact if a service credential is compromised."
        }
      ]
    },
    {
      id: "oauth-scopes-refresh",
      title: "Scopes, Access Tokens, and Refresh Tokens",
      durationMinutes: 20,
      explanation: `An OAuth access token is a credential for protected API access. A <b>scope</b> limits what the token is intended to authorize, such as \`orders:read\` or \`orders:write\`. Scopes are not a replacement for resource-level authorization. A token with \`orders:read\` still should not automatically let a user read another tenant's orders.
    
    Access tokens are usually short-lived. Refresh tokens can be used to obtain new access tokens without forcing the user through the interactive authorization flow again. Because refresh tokens can have a long lifetime and can create new access, they require stronger protection.
    
    For browser applications, avoid storing long-lived tokens in JavaScript-accessible storage when an architecture using secure, HttpOnly cookies can provide better protection. For server-side applications, keep tokens in protected server-side storage when possible.
    
    Refresh token rotation is a valuable defense. The authorization server issues a new refresh token when one is used and invalidates the previous one. Reuse of an old refresh token can indicate theft and can trigger revocation of the token family.`,
      diagram: `Short-lived access token
            |
            v
       Resource API
    
    Long-lived refresh token
            |
            v
     Authorization Server
            |
            +--> new access token
            +--> rotated refresh token`,
      codeExample: {
        title: "Refresh token rotation concept",
        code: `type TokenPair = {
      accessToken: string;
      refreshToken: string;
    };
    
    async function refresh(refreshToken: string): Promise<TokenPair> {
      const response = await fetch("https://id.example.com/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      });
    
      if (!response.ok) {
        throw new UnauthorizedException("Refresh failed");
      }
    
      // A production authorization server may rotate the refresh token.
      return response.json() as Promise<TokenPair>;
    }`
      },
      keyTakeaways: [
        "Scopes communicate intended permissions.",
        "Access tokens should generally have limited lifetimes.",
        "Refresh tokens are more sensitive because they can obtain new access tokens.",
        "Refresh token rotation can detect reuse of stolen refresh tokens.",
        "OAuth scopes do not replace tenant, ownership, or resource-level authorization."
      ],
      commonMistakes: [
        "Putting refresh tokens into URLs.",
        "Making access tokens unnecessarily long-lived.",
        "Treating a broad scope as proof of ownership.",
        "Failing to revoke or detect refresh-token reuse."
      ],
      quiz: [
        {
          question: "What is the purpose of a scope?",
          options: [
        "Limit requested authorization",
        "Encrypt a database",
        "Replace TLS",
        "Identify a CSS component"
      ],
          correctIndex: 0,
          explanation: "Scopes express requested/approved permissions."
        },
        {
          question: "Why are refresh tokens sensitive?",
          options: [
        "They can be exchanged for new access tokens",
        "They are always public",
        "They are CSS values",
        "They cannot expire"
      ],
          correctIndex: 0,
          explanation: "Possession of a refresh token can enable continued access."
        }
      ]
    },
    {
      id: "oauth-nest-integration",
      title: "OAuth Integration Architecture in NestJS",
      durationMinutes: 22,
      explanation: `A production NestJS OAuth integration should have clear boundaries. The controller handles the redirect and callback endpoints. A service manages provider-specific OAuth operations. Configuration stores non-secret provider metadata and secret references. Your user/session layer maps the external identity to a local account when appropriate.
    
    Do not put provider logic directly into controllers. Different providers have different endpoints, scopes, claims, token response formats, and revocation capabilities. A provider adapter or strategy abstraction keeps the application maintainable.
    
    Also decide whether your NestJS application is an OAuth client, a resource server, an authorization server, or more than one. These are different responsibilities. A NestJS API can be a resource server that validates tokens issued by Auth0, Keycloak, Cognito, or another provider. It can also act as an OAuth client when connecting to a third-party API.
    
    Token validation should check the properties required by your authorization server and resource server configuration, including signature, issuer, audience, expiration, and appropriate token type/claims. Never accept a JWT merely because it parses successfully.`,
      diagram: `HTTP Controller
          |
          v
    OAuth Service / Provider Adapter
          |
          +--> Authorization endpoint
          +--> Token endpoint
          +--> User identity mapping
          |
          v
    Local User / Session
    
    Protected API
          |
          v
    Token validation
          |
          v
    Authorization`,
      codeExample: {
        title: "Provider adapter shape",
        code: `export interface OAuthProvider {
      getAuthorizationUrl(state: string): Promise<string>;
      exchangeCode(
        code: string,
        codeVerifier: string,
      ): Promise<{
        accessToken: string;
        refreshToken?: string;
        expiresIn: number;
      }>;
      getUserIdentity(accessToken: string): Promise<{
        subject: string;
        email?: string;
      }>;
    }
    
    @Injectable()
    export class OAuthService {
      constructor(
        private readonly provider: OAuthProvider,
        private readonly users: UserService,
      ) {}
    
      async completeLogin(code: string, verifier: string) {
        const tokens = await this.provider.exchangeCode(code, verifier);
        return this.users.findOrCreateFromExternalIdentity(
          await this.provider.getUserIdentity(tokens.accessToken),
        );
      }
    }`
      },
      keyTakeaways: [
        "Separate OAuth protocol handling from controllers and business logic.",
        "Know whether your NestJS application is a client, resource server, authorization server, or a combination.",
        "Validate JWT security properties rather than only decoding payloads.",
        "Keep provider-specific behavior behind a clear abstraction.",
        "Map external identities to local users deliberately and safely."
      ],
      commonMistakes: [
        "Decoding a JWT without verifying its signature.",
        "Using email alone as an immutable external identity key.",
        "Mixing provider callbacks with user business logic.",
        "Ignoring issuer or audience validation."
      ],
      quiz: [
        {
          question: "Which component should normally contain provider-specific OAuth operations?",
          options: [
        "A dedicated service/adapter",
        "Every controller method",
        "CSS",
        "A database trigger"
      ],
          correctIndex: 0,
          explanation: "Provider-specific protocol details are easier to maintain behind an abstraction."
        },
        {
          question: "What is unsafe about merely decoding a JWT?",
          options: [
        "Decoding does not prove the token was signed by a trusted issuer",
        "It changes the password",
        "It disables HTTP",
        "It validates every claim"
      ],
          correctIndex: 0,
          explanation: "Signature and claim validation are required; decoding is not validation."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What does PKCE add to Authorization Code flow?",
      options: ["Proof of possession of the original verifier", "Password hashing", "Database locking", "Email verification"],
      correctIndex: 0,
      explanation: "PKCE binds the code redemption to the client that initiated the flow."
    },
    {
      question: "Which OAuth grant is intended for service-to-service access without a user?",
      options: ["Client Credentials", "Authorization Code", "Password Reset", "Implicit password login"],
      correctIndex: 0,
      explanation: "Client Credentials represents a confidential client/service."
    },
    {
      question: "What does a scope primarily express?",
      options: ["A requested/approved permission boundary", "A user's password", "A database index", "A redirect HTML page"],
      correctIndex: 0,
      explanation: "Scopes limit the permissions associated with an OAuth authorization."
    },
    {
      question: "Why should access tokens generally be short-lived?",
      options: ["To reduce the useful lifetime of a stolen token", "To make URLs longer", "Because databases require it", "To disable refresh"],
      correctIndex: 0,
      explanation: "Short lifetimes reduce the exposure window."
    },
    {
      question: "What does OAuth itself not necessarily provide?",
      options: ["User authentication semantics", "Delegated authorization", "Access tokens", "Scopes"],
      correctIndex: 0,
      explanation: "OpenID Connect adds standardized user identity semantics."
    },
    {
      question: "What should a resource server verify for a JWT?",
      options: ["Signature and relevant claims such as issuer, audience, and expiry", "Only that it is JSON", "Only the email claim", "Only its length"],
      correctIndex: 0,
      explanation: "A token must be cryptographically and semantically validated."
    },
    {
      question: "Why are refresh tokens more sensitive than short-lived access tokens?",
      options: ["They can be used to obtain new access tokens", "They are always public", "They cannot be revoked", "They are only UI values"],
      correctIndex: 0,
      explanation: "Refresh tokens can extend access and therefore need stronger protection."
    },
    {
      question: "Why should redirect URIs be registered and exact?",
      options: ["To prevent an attacker-controlled callback from receiving the authorization result", "To improve CSS", "To make passwords longer", "Because NestJS requires XML"],
      correctIndex: 0,
      explanation: "Redirect URI validation is a key OAuth security boundary."
    }
  ],
  project: {
    name: "OAuth-Connected NestJS API",
    goal: "Build a NestJS application that supports Authorization Code + PKCE for user login/delegated access and Client Credentials for service-to-service access.",
    brief: "Create an OAuth integration layer with a provider adapter, secure callback handling, scopes, access-token validation, refresh-token handling, and a protected resource API.",
    steps: [
      "Create configuration for an OAuth provider without committing secrets.",
      "Implement an authorization endpoint that generates state and PKCE values and redirects to the provider.",
      "Implement a callback that validates state and exchanges the authorization code using the verifier.",
      "Map the provider identity to a local user record without using mutable profile fields as the primary external identity.",
      "Create protected API routes that require a valid access token and verify issuer, audience, signature, and expiration.",
      "Implement a service-to-service endpoint using Client Credentials with a narrow scope.",
      "Implement refresh handling with short-lived access tokens and refresh-token rotation where supported by the provider.",
      "Add tests for invalid state, invalid verifier, expired tokens, wrong audience, insufficient scope, and cross-tenant access."
    ],
    acceptance: [
      "Authorization Code + PKCE login completes only with a valid state and verifier.",
      "Invalid issuer, audience, signature, or expiration causes token rejection.",
      "Service tokens cannot access endpoints outside their granted scopes.",
      "Refresh tokens are not exposed in URLs or logs.",
      "OAuth provider logic is separated from controllers and business services."
    ],
    stretch: [
      "Support two identity providers through the same provider interface.",
      "Add token revocation and refresh-token reuse detection.",
      "Add provider JWKS caching with safe key rotation behavior.",
      "Add structured audit events for OAuth login and token failures."
    ]
  }
};
