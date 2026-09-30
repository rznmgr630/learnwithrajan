import type { LessonDay } from "@/lib/learn/lesson-types";

export const OPENID_CONNECT_DAY_43_LESSONS: LessonDay = {
  day: 43,
  title: "OpenID Connect",
  totalMinutes: 122,
  difficulty: "Advanced",
  lessons: [
    {
      id: "oidc-overview",
      title: "OpenID Connect: Adding Identity to OAuth 2.0",
      durationMinutes: 18,
      explanation: `OpenID Connect (OIDC) is an identity layer built on OAuth 2.0. OAuth answers “Can this client access this protected resource?” OIDC adds standardized information for “Who authenticated, and what identity claims are associated with that authentication?”
    
    The most important new artifact is the <b>ID token</b>, normally a JWT. It contains claims about the authentication event and the user identity, such as \`iss\` (issuer), \`sub\` (subject), \`aud\` (audience), \`exp\` (expiration), and often \`email\` or profile claims depending on provider configuration.
    
    A common beginner mistake is using an OAuth access token as if it were an ID token. They have different purposes and audiences. An access token is intended for a resource server; an ID token is intended for the client that performed the OIDC login. Your API should not automatically treat any ID token as an API access token.
    
    OIDC also standardizes provider discovery and common endpoints, making it easier for applications to integrate with standards-compliant identity providers.`,
      diagram: `User
      |
      v
    OIDC Provider
      |
      +--> ID Token ------> Client
      |
      +--> Access Token --> Resource API
      |
      +--> Discovery/JWKS --> Client/API validation`,
      codeExample: {
        title: "OIDC token distinction",
        code: `type OidcTokens = {
      id_token: string;       // Identity information for the client
      access_token: string;  // Authorization to a resource server
      token_type: "Bearer";
      expires_in: number;
    };
    
    // Do not assume:
    // access_token === id_token
    //
    // Validate each token according to its intended audience and purpose.`
      },
      keyTakeaways: [
        "OIDC adds identity semantics to OAuth 2.0.",
        "The ID token is about authentication and identity claims.",
        "The access token is for protected resource access.",
        "The `sub` claim is the stable provider subject identifier.",
        "Token purpose and audience matter when validating tokens."
      ],
      commonMistakes: [
        "Using an ID token as a general API access token.",
        "Using email as the immutable external identity key.",
        "Trusting claims before validating the token.",
        "Assuming every provider returns exactly the same optional profile claims."
      ],
      quiz: [
        {
          question: "What does OIDC add to OAuth?",
          options: [
        "A standardized identity layer",
        "Database transactions",
        "Password hashing only",
        "A new SQL dialect"
      ],
          correctIndex: 0,
          explanation: "OIDC standardizes authentication/identity on top of OAuth."
        },
        {
          question: "What is a common stable identifier for an OIDC subject?",
          options: [
        "sub",
        "buttonText",
        "password",
        "screenWidth"
      ],
          correctIndex: 0,
          explanation: "The `sub` claim identifies the subject within the issuer's namespace."
        }
      ]
    },
    {
      id: "oidc-id-token",
      title: "ID Tokens and JWT Validation",
      durationMinutes: 22,
      explanation: `An ID token is commonly a signed JWT with three parts: header, payload, and signature. The payload contains claims, but the payload is not trusted merely because it is readable. Your application must verify the signature using a trusted issuer's keys and then validate security claims.
    
    Important claims include \`iss\`, which identifies the issuer; \`sub\`, the subject identifier; \`aud\`, the intended audience; and \`exp\`, the expiration time. Depending on the flow and provider, claims such as \`nonce\`, \`iat\`, \`auth_time\`, and \`azp\` may also matter.
    
    For a NestJS application, use a well-maintained OIDC/JWT library rather than implementing cryptographic verification yourself. Configure the trusted issuer and expected audience. When using JWKS, keys can rotate, so your validator needs a safe caching strategy that can refresh keys when an encountered key ID is unknown.
    
    Do not log complete ID tokens in production. Even though they are signed rather than encrypted by default, their payload can contain personal information.`,
      diagram: `JWT
    +----------------+
    | Header         | -> alg, kid
    +----------------+
    | Payload        | -> iss, sub, aud, exp...
    +----------------+
    | Signature      | -> proves signing key
    +----------------+
    
    Validation:
    signature + issuer + audience + time + flow-specific claims`,
      codeExample: {
        title: "NestJS JWT verification with issuer and audience",
        code: `import { Injectable, UnauthorizedException } from "@nestjs/common";
    import { jwtVerify, createRemoteJWKSet } from "jose";
    
    @Injectable()
    export class OidcTokenVerifier {
      private readonly jwks = createRemoteJWKSet(
        new URL("https://id.example.com/.well-known/jwks.json"),
      );
    
      async verifyIdToken(token: string) {
        try {
          const result = await jwtVerify(token, this.jwks, {
            issuer: "https://id.example.com/",
            audience: "my-nestjs-client-id",
          });
    
          return result.payload;
        } catch {
          throw new UnauthorizedException("Invalid ID token");
        }
      }
    }`
      },
      keyTakeaways: [
        "A signed JWT must be verified, not merely decoded.",
        "Validate issuer, audience, expiration, and relevant flow-specific claims.",
        "JWKS allows applications to discover public verification keys.",
        "Use established cryptographic libraries rather than hand-written JWT verification.",
        "Treat ID-token claims as untrusted until validation succeeds."
      ],
      commonMistakes: [
        "Accepting any issuer.",
        "Checking only `exp` while ignoring signature and audience.",
        "Hard-coding one signing key forever when the provider rotates keys.",
        "Logging complete tokens."
      ],
      quiz: [
        {
          question: "Which claim identifies the token issuer?",
          options: [
        "iss",
        "sub",
        "aud",
        "kid"
      ],
          correctIndex: 0,
          explanation: "`iss` identifies the issuer."
        },
        {
          question: "Why must the audience be checked?",
          options: [
        "The token must be intended for your client/resource",
        "It improves CSS",
        "It encrypts the payload",
        "It changes the subject"
      ],
          correctIndex: 0,
          explanation: "A validly signed token issued for another audience should not automatically be accepted."
        }
      ]
    },
    {
      id: "oidc-userinfo",
      title: "UserInfo, Claims, and External Identity Mapping",
      durationMinutes: 18,
      explanation: `The OIDC UserInfo endpoint is an OAuth-protected endpoint that can return claims about the authenticated end user. The ID token may already contain some claims, while UserInfo can provide additional profile information according to the provider and scopes.
    
    A production application should distinguish <b>identity</b> from <b>profile data</b>. The stable external identity should normally be represented by the pair \`(issuer, subject)\` rather than an email address. Email addresses can change, may not be unique across providers, and may be reassigned.
    
    When creating a local account, store the external provider, issuer, subject, and any profile fields you need. If you use email for account linking, make the linking process explicit and secure. Do not silently merge accounts simply because two providers return the same email.
    
    Also request only the claims you actually need. OIDC scopes such as \`openid\`, \`profile\`, and \`email\` communicate what information the client is asking for. Data minimization is both a privacy and security practice.`,
      diagram: `OIDC Provider
       |
       +--> ID Token: identity claims
       |
       +--> UserInfo: profile claims
                  |
                  v
           Local identity mapping
                  |
           issuer + subject
                  |
                  v
              Local User`,
      codeExample: {
        title: "External identity entity",
        code: `export interface ExternalIdentity {
      provider: string;
      issuer: string;
      subject: string;
      email?: string;
      displayName?: string;
    }
    
    async function findLocalUser(identity: ExternalIdentity) {
      return userRepository.findByExternalIdentity({
        issuer: identity.issuer,
        subject: identity.subject,
      });
    }
    
    // The issuer + subject pair is the identity key.
    // Email is profile/account data unless your linking flow explicitly
    // establishes it as an account-linking identifier.`
      },
      keyTakeaways: [
        "UserInfo is a protected endpoint for retrieving user claims.",
        "Use issuer + subject as a stable external identity key.",
        "Email should not automatically become the immutable identity key.",
        "Request only the OIDC scopes and claims the application needs.",
        "Account linking across providers should be explicit and secure."
      ],
      commonMistakes: [
        "Automatically merging accounts by matching email.",
        "Assuming every provider supplies the same claims.",
        "Using mutable display names as identifiers.",
        "Requesting broad profile data without a business need."
      ],
      quiz: [
        {
          question: "What is a strong external identity key?",
          options: [
        "issuer + subject",
        "displayName only",
        "email text only",
        "IP address"
      ],
          correctIndex: 0,
          explanation: "The issuer and subject together identify the OIDC subject in its issuer namespace."
        },
        {
          question: "Why should email not automatically be the primary external identity key?",
          options: [
        "It can change or be reused",
        "It is always encrypted",
        "It cannot be returned",
        "It is a database index"
      ],
          correctIndex: 0,
          explanation: "Email is useful profile data but is not necessarily a stable identity identifier."
        }
      ]
    },
    {
      id: "oidc-discovery",
      title: "OIDC Discovery and Provider Metadata",
      durationMinutes: 18,
      explanation: `OIDC Discovery lets a client learn provider configuration from a standardized metadata document, commonly at \`/.well-known/openid-configuration\`. The metadata can describe the issuer, authorization endpoint, token endpoint, UserInfo endpoint, JWKS URI, supported scopes, response types, and signing algorithms.
    
    Discovery reduces hard-coded endpoint configuration and makes provider integration more maintainable. However, discovery does not mean “trust any URL the application receives.” Your application should start from a configured trusted issuer and retrieve metadata from that issuer over HTTPS. Validate that the returned issuer matches what you configured.
    
    In production, cache discovery metadata and signing keys appropriately rather than downloading them on every request. Handle provider outages and key rotation without making authentication unavailable unnecessarily. Libraries often provide this functionality, so prefer them over custom protocol code.
    
    The discovery document is configuration metadata, not a secret. Tokens and client credentials are sensitive and should be handled differently.`,
      diagram: `Configured issuer
          |
          v
    /.well-known/openid-configuration
          |
          +--> authorization_endpoint
          +--> token_endpoint
          +--> userinfo_endpoint
          +--> jwks_uri
          +--> issuer
          |
          v
    OIDC client configuration`,
      codeExample: {
        title: "OIDC discovery fetch",
        code: `const issuer = new URL("https://id.example.com/");
    
    const response = await fetch(
      new URL(".well-known/openid-configuration", issuer),
    );
    
    if (!response.ok) {
      throw new Error("OIDC discovery failed");
    }
    
    const metadata = await response.json();
    
    if (metadata.issuer !== issuer.toString()) {
      throw new Error("OIDC issuer mismatch");
    }`
      },
      keyTakeaways: [
        "Discovery provides standardized provider metadata.",
        "Start discovery from a configured trusted issuer.",
        "Verify the returned issuer rather than blindly trusting metadata.",
        "Cache metadata and JWKS with a strategy that supports key rotation.",
        "Use a mature OIDC library when possible."
      ],
      commonMistakes: [
        "Accepting discovery metadata from arbitrary user input.",
        "Downloading JWKS on every API request.",
        "Ignoring issuer mismatch.",
        "Assuming discovery metadata is a secret."
      ],
      quiz: [
        {
          question: "What does OIDC discovery provide?",
          options: [
        "Provider endpoint and capability metadata",
        "User passwords",
        "Database records",
        "Browser cookies"
      ],
          correctIndex: 0,
          explanation: "Discovery describes how to interact with the provider."
        },
        {
          question: "Why should discovery metadata be tied to a configured issuer?",
          options: [
        "To avoid trusting an attacker-controlled provider configuration",
        "To make JWTs shorter",
        "To remove HTTPS",
        "To disable UserInfo"
      ],
          correctIndex: 0,
          explanation: "The application must know which identity provider it trusts."
        }
      ]
    },
    {
      id: "oidc-jwks",
      title: "JWKS, Key Rotation, and Reliable Verification",
      durationMinutes: 22,
      explanation: `JWKS stands for JSON Web Key Set. It is a published collection of public keys that an OIDC provider uses to let relying parties verify signed tokens. A JWT header often contains a \`kid\` (key ID), allowing the verifier to select the correct public key.
    
    Key rotation is normal. A provider may publish a new key while still accepting tokens signed by an older key during a transition. Your application therefore needs to handle multiple keys and refresh its key set when an unknown \`kid\` appears.
    
    Caching is important because fetching JWKS on every request adds latency and creates a dependency on provider availability. At the same time, caching forever is wrong because it prevents legitimate key rotation. Mature libraries commonly implement caching and refresh behavior.
    
    A dangerous anti-pattern is accepting a token because its algorithm says \`none\`, because its key is embedded in the token, or because the application dynamically trusts an unverified key. The trusted key source must come from your configured issuer and secure discovery process.`,
      diagram: `JWT header
       |
       | kid = key-2026-09
       v
    JWKS cache
       |
       +--> matching public key
                 |
                 v
            signature verify
                 |
                 v
               claims`,
      codeExample: {
        title: "JWKS-aware verification",
        code: `const jwks = createRemoteJWKSet(
      new URL("https://id.example.com/.well-known/jwks.json"),
    );
    
    const { payload } = await jwtVerify(token, jwks, {
      issuer: "https://id.example.com/",
      audience: "my-api",
    });
    
    // The library selects the public key using the JWT's \`kid\`
    // and can refresh its remote key set when appropriate.`
      },
      keyTakeaways: [
        "JWKS publishes public verification keys.",
        "`kid` helps select the correct key.",
        "Key rotation requires a refreshable key strategy.",
        "Cache JWKS to reduce latency and provider dependency.",
        "Never derive trust from attacker-controlled token headers alone."
      ],
      commonMistakes: [
        "Caching keys forever.",
        "Trusting a key embedded in an unverified token.",
        "Accepting arbitrary signing algorithms.",
        "Treating a JWKS endpoint from an untrusted issuer as authoritative."
      ],
      quiz: [
        {
          question: "What does `kid` usually identify?",
          options: [
        "A signing key in the issuer's key set",
        "A database row",
        "A user's password",
        "A browser cookie"
      ],
          correctIndex: 0,
          explanation: "`kid` helps the verifier choose the correct public key."
        },
        {
          question: "Why should JWKS be cached?",
          options: [
        "To avoid a network request for every token",
        "To disable rotation",
        "To store passwords",
        "To skip signature validation"
      ],
          correctIndex: 0,
          explanation: "Caching improves reliability and performance while still requiring rotation support."
        }
      ]
    },
    {
      id: "oidc-production",
      title: "Identity Providers and Production OIDC Architecture",
      durationMinutes: 24,
      explanation: `In a production system, an identity provider (IdP) becomes a critical dependency. Providers can include enterprise identity platforms, cloud identity services, or self-hosted systems. Your NestJS application should treat the IdP as an external trust boundary.
    
    A robust architecture validates tokens close to the API boundary, maps the external identity to an internal user, and then applies your own application authorization. The IdP can tell you who authenticated; it does not automatically know which internal tenant, project, or business permission the user should receive.
    
    Plan for provider outages, key rotation, clock skew, account deactivation, and changes to profile claims. If you need local sessions, decide how session lifetime relates to IdP token lifetime. If you need immediate revocation, consider provider introspection or your own session/revocation model rather than assuming a self-contained JWT can be instantly invalidated.
    
    Finally, distinguish identity-provider groups from your application's roles. You may map an IdP group such as \`billing-admins\` to an internal permission set, but the mapping should be explicit, tested, and tenant-aware.`,
      diagram: `Identity Provider
          |
          | validated identity
          v
    NestJS Identity Layer
          |
          +--> Local User
          +--> Tenant Membership
          +--> Application Roles
          +--> Permissions
          |
          v
    Application Authorization
          |
          v
    Protected Resource`,
      codeExample: {
        title: "OIDC login-to-authorization mapping",
        code: `type ExternalClaims = {
      iss: string;
      sub: string;
      email?: string;
      groups?: string[];
    };
    
    function mapIdentityToPermissions(claims: ExternalClaims) {
      const permissions = new Set<string>();
    
      if (claims.groups?.includes("billing-admins")) {
        permissions.add("invoice:read");
        permissions.add("invoice:approve");
      }
    
      return {
        externalIdentity: {
          issuer: claims.iss,
          subject: claims.sub,
        },
        permissions: [...permissions],
      };
    }
    
    // In production, group-to-permission mappings should be configured,
    // tenant-aware, audited, and tested rather than hard-coded everywhere.`
      },
      keyTakeaways: [
        "The IdP is a trust boundary, not your entire application authorization system.",
        "Map external identity to internal user, tenant, role, and permission models.",
        "Plan for key rotation, outages, clock skew, and account lifecycle changes.",
        "Keep group-to-permission mapping explicit and auditable.",
        "Use local authorization after identity verification."
      ],
      commonMistakes: [
        "Granting application admin access to every IdP user.",
        "Treating an IdP group claim as globally valid across tenants.",
        "Assuming JWT revocation is immediate.",
        "Making the application depend on a provider network call for every request when local validation is sufficient."
      ],
      quiz: [
        {
          question: "What should happen after OIDC authentication succeeds?",
          options: [
        "The application should still apply its own authorization rules",
        "Every user becomes an admin",
        "Tenant checks are skipped",
        "The password should be stored"
      ],
          correctIndex: 0,
          explanation: "Authentication establishes identity; application authorization still decides access."
        },
        {
          question: "Why separate IdP groups from internal permissions?",
          options: [
        "Internal business authorization needs explicit mapping and tenant context",
        "Groups are always unsafe",
        "OIDC forbids roles",
        "It improves HTML"
      ],
          correctIndex: 0,
          explanation: "External identity attributes should be mapped deliberately to application permissions."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What is the main purpose of OIDC?",
      options: ["Standardized identity/authentication on top of OAuth", "Database encryption", "Rate limiting", "Password hashing"],
      correctIndex: 0,
      explanation: "OIDC adds an identity layer to OAuth."
    },
    {
      question: "Which claim identifies the issuer?",
      options: ["iss", "sub", "aud", "nonce"],
      correctIndex: 0,
      explanation: "`iss` identifies the token issuer."
    },
    {
      question: "Which claim is commonly used with issuer to identify an external user?",
      options: ["sub", "color", "method", "path"],
      correctIndex: 0,
      explanation: "`sub` identifies the subject within the issuer namespace."
    },
    {
      question: "Why must an ID token's audience be checked?",
      options: ["It must be intended for the expected client", "It changes the password", "It creates a database", "It enables CSS"],
      correctIndex: 0,
      explanation: "A token for another audience should not be accepted."
    },
    {
      question: "What does JWKS provide?",
      options: ["Public keys used to verify signatures", "Private passwords", "User sessions", "Database migrations"],
      correctIndex: 0,
      explanation: "JWKS publishes public verification keys."
    },
    {
      question: "What is the purpose of OIDC discovery?",
      options: ["Find standardized provider metadata and endpoints", "Retrieve user passwords", "Create SQL tables", "Disable HTTPS"],
      correctIndex: 0,
      explanation: "Discovery describes the provider's endpoints and capabilities."
    },
    {
      question: "Why is issuer + subject preferable to email for external identity?",
      options: ["It is a more stable provider identity key", "Email cannot be displayed", "Issuer is always private", "Subject is a password"],
      correctIndex: 0,
      explanation: "Email may change; issuer + subject identifies the external subject."
    },
    {
      question: "After validating an OIDC identity, what remains necessary?",
      options: ["Application-level authorization", "Nothing; every action is allowed", "Password storage", "Disabling tenant checks"],
      correctIndex: 0,
      explanation: "Identity and authorization are separate concerns."
    }
  ],
  project: {
    name: "OIDC Identity Gateway",
    goal: "Build a NestJS OIDC integration that validates identity tokens, supports discovery/JWKS, maps external identities to local users, and applies application authorization.",
    brief: "Implement an OIDC login/callback and protected API layer. The system must validate tokens using the configured issuer and JWKS, use issuer+subject for identity mapping, and map provider groups to tenant-aware internal permissions.",
    steps: [
      "Configure a trusted OIDC issuer and client ID through environment configuration.",
      "Implement or configure OIDC discovery and retrieve provider metadata securely.",
      "Implement Authorization Code + PKCE login from Day 42 and validate the callback.",
      "Validate ID tokens with signature, issuer, audience, expiration, and applicable nonce checks.",
      "Create an external identity table keyed by issuer and subject.",
      "Implement a UserInfo call for claims that are not available in the ID token and store only required profile fields.",
      "Implement JWKS caching and ensure key rotation does not require a deployment.",
      "Map external groups to internal roles/permissions with tenant-aware rules.",
      "Write tests for invalid issuer, wrong audience, expired token, unknown key ID, identity mapping, and authorization after login."
    ],
    acceptance: [
      "Only tokens from the configured issuer are accepted.",
      "Tokens with invalid signatures, audience, or expiration are rejected.",
      "External identities are uniquely mapped by issuer and subject.",
      "Provider group claims cannot bypass tenant-aware application authorization.",
      "JWKS key rotation is handled without hard-coding a single signing key."
    ],
    stretch: [
      "Support two OIDC providers through a shared adapter.",
      "Add logout and provider session coordination.",
      "Implement provider outage handling and cached metadata.",
      "Add audit events for successful and failed identity operations."
    ]
  }
};
