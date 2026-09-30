import type { LessonDay } from "@/lib/learn/lesson-types";

export const PASSWORD_SECURITY_DAY_39_LESSONS: LessonDay = {
  day: 39,
  title: "Password Security",
  totalMinutes: 200,
  difficulty: "Advanced",
  lessons: [
    {
      id: "hashing",
      title: "Password Hashing Fundamentals",
      durationMinutes: 35,
      explanation: `<b>Never store user passwords as plain text.</b>

If a database contains the original password and the database is stolen, the attacker immediately has the user's credential.

Instead, store a password hash. The application verifies a login password against the stored hash without needing to recover the original password.

<pre>
Registration
password -> password hash -> database

Login
password -> verify against stored hash -> allow/reject
</pre>

Password hashing is different from encryption. Encryption is intended to be reversible with a key. Password hashing is intended to make guessing expensive.

Fast general-purpose hashes such as SHA-256 are not enough by themselves for password storage because attackers can perform huge numbers of guesses quickly.

Password-hashing algorithms such as Argon2id and bcrypt intentionally consume computational resources.

The goal is not to make a single login impossible. It is to make billions of guesses expensive.

Also protect hashes after storage: do not return them in API responses, do not log them unnecessarily, and restrict which services can read them.`,
      diagram: `Password
   |
   v
Password Hash Function
   |
   v
Stored Hash
   |
   v
PostgreSQL

Login Password
   |
   v
Verify
 /   \
yes   no
 |     |
 v     v
allow reject
`,
      codeExample: {
        title: "PasswordService",
        code: `@Injectable()
export class PasswordService {
  async hash(password: string) {
    return argon2.hash(password, {
      type: argon2.argon2id,
    });
  }

  async verify(hash: string, password: string) {
    return argon2.verify(hash, password);
  }
}

// Only the resulting hash should be stored.
// Never store the original password.
`,
      },
      keyTakeaways: [
        "Passwords should be stored as hashes, not plaintext.",
        "Password hashing should be deliberately expensive.",
        "Do not expose password hashes through APIs or logs.",
        "Verification should be performed through a mature password library."
],
      commonMistakes: [
        "<b>Storing plaintext.</b> A database leak becomes an immediate credential leak.",
        "<b>Using SHA-256 alone.</b> Fast hashing makes guessing cheaper.",
        "<b>Returning passwordHash.</b> Sensitive authentication data should stay server-side.",
        "<b>Writing custom cryptography.</b> Use maintained, reviewed libraries."
],
      quiz: [
        {
                "question": "Why hash passwords?",
                "options": [
                        "To avoid needing the original password during verification",
                        "To make passwords reversible",
                        "To create JWTs",
                        "To remove login"
                ],
                "correctIndex": 0,
                "explanation": "The application can verify a password without storing the original secret."
        },
        {
                "question": "Why are password hashes deliberately expensive?",
                "options": [
                        "To slow large-scale password guessing",
                        "To make passwords readable",
                        "To replace HTTPS",
                        "To create roles"
                ],
                "correctIndex": 0,
                "explanation": "The cost makes each attacker guess more expensive."
        }
],
    },
    {
      id: "argon2-bcrypt",
      title: "Argon2 and bcrypt",
      durationMinutes: 35,
      explanation: `<b>Argon2id and bcrypt are established password-hashing choices.</b>

Argon2id is a modern password-hashing function that can use CPU and memory resources. Its memory cost can make large-scale parallel guessing more expensive.

bcrypt is an older but widely deployed password-hashing algorithm. Its work factor controls computational cost.

Both should be used through mature libraries. Do not implement the algorithms yourself.

<b>Benchmarking matters.</b>

If password verification is too cheap, attackers can guess faster. If it is excessively expensive, a traffic spike or login attack can consume application resources.

Choose parameters on hardware similar to production and review them over time.

A useful production pattern is <b>gradual hash upgrading</b>. If old users have weaker bcrypt settings, after a successful login the application can rehash their password with the newer policy.

Do not claim that one algorithm is universally best. The appropriate choice depends on library support, infrastructure, security requirements, and existing stored hashes.`,
      diagram: `Password
   |
   +--> Argon2id
   |      CPU + memory cost
   |
   +--> bcrypt
          work factor
   |
   v
Stored password hash
`,
      codeExample: {
        title: "Argon2id Configuration",
        code: `const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 64 * 1024,
  timeCost: 3,
  parallelism: 2,
});

// Example values only.
// Benchmark and tune on the actual production class of hardware.
`,
      },
      keyTakeaways: [
        "Argon2id is a modern memory-hard password-hashing option.",
        "bcrypt remains a valid established option.",
        "Hash parameters should be benchmarked.",
        "Existing hashes can be upgraded gradually after successful login."
],
      commonMistakes: [
        "<b>Copying parameters from another application.</b> Infrastructure differs.",
        "<b>Changing parameters without migration strategy.</b> Existing hashes must remain verifiable.",
        "<b>Implementing Argon2/bcrypt manually.</b> Use mature libraries.",
        "<b>Ignoring login capacity.</b> Expensive hashing can be abused for resource exhaustion."
],
      quiz: [
        {
                "question": "What is notable about Argon2id?",
                "options": [
                        "It can deliberately use memory as part of its cost",
                        "It stores plaintext",
                        "It is a JWT",
                        "It disables salts"
                ],
                "correctIndex": 0,
                "explanation": "Argon2id can use significant memory as part of password-guessing cost."
        },
        {
                "question": "Why benchmark hashing parameters?",
                "options": [
                        "To balance attack resistance and server resource usage",
                        "To determine user roles",
                        "To create JWTs",
                        "To make salts secret"
                ],
                "correctIndex": 0,
                "explanation": "Password verification consumes resources, so parameters need an appropriate operational cost."
        }
],
    },
    {
      id: "salt",
      title: "Salts",
      durationMinutes: 30,
      explanation: `<b>A salt is a unique random value used with a password before hashing.</b>

Suppose Alice and Bob choose the same password. Without salts, deterministic hashing would produce the same stored result.

With unique salts:

<pre>
password + salt A -> hash A
password + salt B -> hash B
</pre>

This prevents attackers from simply identifying all accounts that share a password and makes precomputed tables much less useful across accounts.

The salt is not a secret. A standard password-hashing library usually generates the salt and stores it inside its encoded hash format.

You normally do not need to design a separate custom salt column or custom encoding.

<b>Important:</b> a salt does not make a weak password strong. \`password123\` can still be guessed. The salt mainly ensures the expensive guessing work is not trivially reusable across accounts.

A salt is different from a secret pepper. If an application uses a pepper, that secret needs separate secret management and careful rotation design.`,
      diagram: `Same Password
   |
   +---- Salt A ---> Hash A
   |
   +---- Salt B ---> Hash B

Same password
      |
      v
Different stored hashes
`,
      codeExample: {
        title: "bcrypt Automatically Handles Salt",
        code: `const hash = await bcrypt.hash(password, 12);

const valid = await bcrypt.compare(
  password,
  hash,
);

// The encoded bcrypt result contains the information needed
// by the library to perform verification, including its salt.
`,
      },
      keyTakeaways: [
        "Salts should be unique per password hash.",
        "Salts make identical passwords produce different hashes.",
        "Salts are not secret.",
        "Mature password libraries normally manage salt encoding automatically."
],
      commonMistakes: [
        "<b>One global salt.</b> Each password hash needs its own salt.",
        "<b>Trying to hide the salt.</b> It is not a secret key.",
        "<b>Inventing custom salt formats.</b> Use library-standard formats.",
        "<b>Thinking salt prevents weak passwords.</b> It mainly prevents cross-account reuse of precomputed work."
],
      quiz: [
        {
                "question": "Why should password salts be unique?",
                "options": [
                        "So identical passwords do not produce identical hashes",
                        "To make passwords reversible",
                        "To replace MFA",
                        "To create JWTs"
                ],
                "correctIndex": 0,
                "explanation": "Unique salts make each password hash distinct."
        },
        {
                "question": "Is a password salt secret?",
                "options": [
                        "Yes",
                        "No",
                        "Only during login",
                        "Only in production"
                ],
                "correctIndex": 1,
                "explanation": "Salts can be stored with password hashes and are not secrets."
        }
],
    },
    {
      id: "reset",
      title: "Password Reset",
      durationMinutes: 35,
      explanation: `<b>Password reset is an authentication workflow with its own security requirements.</b>

A safe reset flow can look like:

<pre>
Forgot password
     |
     v
Generate random reset credential
     |
     v
Short-lived server-side record
     |
     v
Send recovery link
     |
     v
Verify and consume credential
     |
     v
Hash new password
     |
     v
Optionally revoke sessions
</pre>

Reset credentials should be cryptographically random, short-lived, and single-use.

Do not create reset tokens from predictable values such as a user ID or email address.

Also avoid account enumeration. A public forgot-password endpoint should generally respond the same way whether an account exists or not.

After a successful reset, consider revoking existing refresh sessions. A password change is often a security boundary, and an attacker who already has a valid long-lived session should not automatically retain access.

Do not log the reset credential. If you store a server-side reset token, consider storing a hash or otherwise minimizing the value's usefulness if the database is leaked.`,
      diagram: `Forgot Password
      |
      v
Random Reset Token
      |
      v
Short TTL + Server Record
      |
      v
Email Link
      |
      v
Verify + Consume
      |
      v
New Password Hash
      |
      v
Session Revocation
`,
      codeExample: {
        title: "Password Reset Flow",
        code: `async completeReset(token: string, newPassword: string) {
  const reset = await this.resetTokens.consumeValid(token);

  if (!reset) {
    throw new BadRequestException(
      "Invalid or expired reset link",
    );
  }

  const passwordHash = await this.passwords.hash(newPassword);

  await this.users.updatePassword(
    reset.userId,
    passwordHash,
  );

  await this.sessions.revokeAllForUser(reset.userId);
}
`,
      },
      keyTakeaways: [
        "Reset credentials should be random, short-lived, and single-use.",
        "Forgot-password responses should avoid account enumeration.",
        "Password reset may revoke existing authentication sessions.",
        "Do not log recovery credentials."
],
      commonMistakes: [
        "<b>Predictable reset token.</b> Attackers may guess it.",
        "<b>Long-lived reset token.</b> A stolen recovery credential remains useful too long.",
        "<b>Reusable reset token.</b> Consume it after successful use.",
        "<b>Keeping old sessions active without a policy.</b> Password reset should explicitly define session behavior."
],
      quiz: [
        {
                "question": "What should a reset credential be?",
                "options": [
                        "Predictable",
                        "Random, short-lived, and single-use",
                        "The user's password hash",
                        "A permanent JWT"
                ],
                "correctIndex": 1,
                "explanation": "Recovery credentials should be difficult to guess and have limited, one-time use."
        },
        {
                "question": "Why use the same public response for known and unknown emails?",
                "options": [
                        "To reduce account enumeration",
                        "To make hashing faster",
                        "To create salts",
                        "To disable rate limiting"
                ],
                "correctIndex": 0,
                "explanation": "Attackers should not easily learn which addresses have accounts."
        }
],
    },
    {
      id: "credential-attacks",
      title: "Credential Attacks and Defenses",
      durationMinutes: 35,
      explanation: `<b>Password security is larger than password hashing.</b>

Attackers use different credential attacks.

<b>Brute force</b> tries many possible passwords.

<b>Credential stuffing</b> uses leaked username/password pairs from another service.

<b>Password spraying</b> tries a few common passwords across many accounts.

<b>Phishing</b> tricks a user into entering a password into an attacker-controlled page.

Each attack needs different defenses.

Password hashing protects stored credentials. Rate limiting reduces automated guessing and protects server resources. MFA and passkeys can reduce the impact of password theft. Monitoring can identify unusual login behavior.

Be careful with aggressive account lockout. A permanent lock after a few failures can become a denial-of-service tool against legitimate users. Consider rate limits, progressive delays, risk-based controls, and safe recovery.

Also remember that Argon2 or bcrypt verification is intentionally expensive. An attacker can try to abuse that cost by sending huge numbers of login requests, so authentication endpoints need abuse controls.`,
      diagram: `Credential Attacks
      |
      +--> Brute Force
      +--> Credential Stuffing
      +--> Password Spraying
      +--> Phishing
      |
      v
Layered Defense
      |
      +--> Hashing
      +--> Rate Limiting
      +--> MFA/Passkeys
      +--> Monitoring
      +--> Secure Recovery
`,
      codeExample: {
        title: "Login Rate Limit",
        code: `@Post("login")
@Throttle({
  default: {
    limit: 5,
    ttl: 60_000,
  },
})
async login(@Body() dto: LoginDto) {
  return this.authService.login(
    dto.email,
    dto.password,
  );
}

// Tune limits for the real application.
// Rate limiting complements, rather than replaces,
// secure password hashing and stronger authentication.
`,
      },
      keyTakeaways: [
        "Credential attacks include brute force, stuffing, spraying, and phishing.",
        "No single security control solves every credential attack.",
        "Rate limiting protects both users and authentication infrastructure.",
        "MFA/passkeys can reduce password-related risk."
],
      commonMistakes: [
        "<b>Relying only on password complexity.</b> Complexity does not stop credential stuffing or phishing.",
        "<b>Permanent lockouts after a few failures.</b> Attackers can deliberately lock other users.",
        "<b>Ignoring login resource usage.</b> Password verification can be computationally expensive.",
        "<b>Assuming hashing prevents phishing.</b> Server-side storage controls cannot stop social engineering."
],
      quiz: [
        {
                "question": "What is credential stuffing?",
                "options": [
                        "Using leaked credentials from another service against your application",
                        "Hashing a password",
                        "Rotating a JWT",
                        "Creating a salt"
                ],
                "correctIndex": 0,
                "explanation": "Credential stuffing exploits password reuse."
        },
        {
                "question": "Why rate-limit login attempts?",
                "options": [
                        "To reduce automated guessing and resource abuse",
                        "To make passwords reversible",
                        "To replace HTTPS",
                        "To create JWT signatures"
                ],
                "correctIndex": 0,
                "explanation": "Rate limiting makes large-scale automated abuse harder and protects resources."
        }
],
    }
  ],
  finalQuiz: [
    {
        "question": "Why store password hashes instead of plaintext passwords?",
        "options": [
            "A database breach should not directly reveal original passwords",
            "Hashes are reversible",
            "It removes authentication",
            "It creates JWTs"
        ],
        "correctIndex": 0,
        "explanation": "Password hashes allow verification without storing the original secret."
    },
    {
        "question": "Why is SHA-256 alone generally unsuitable for passwords?",
        "options": [
            "It is designed to be fast, making guessing cheaper",
            "It cannot process strings",
            "It requires Redis",
            "It is a session cookie"
        ],
        "correctIndex": 0,
        "explanation": "Password storage needs deliberately expensive hashing."
    },
    {
        "question": "Which is a modern password-hashing choice?",
        "options": [
            "Argon2id",
            "Base64",
            "JWT",
            "HTTP"
        ],
        "correctIndex": 0,
        "explanation": "Argon2id is designed for password hashing."
    },
    {
        "question": "What does a salt accomplish?",
        "options": [
            "Makes identical passwords produce different hashes and prevents simple cross-account precomputation",
            "Encrypts passwords",
            "Creates roles",
            "Replaces MFA"
        ],
        "correctIndex": 0,
        "explanation": "Unique salts prevent identical passwords from producing identical hashes."
    },
    {
        "question": "Does the salt need to be secret?",
        "options": [
            "Yes",
            "No",
            "Only on the server",
            "Only during registration"
        ],
        "correctIndex": 1,
        "explanation": "Salts are not secrets."
    },
    {
        "question": "What makes a password reset credential safer?",
        "options": [
            "Randomness, short lifetime, and single use",
            "Predictability",
            "Permanent validity",
            "Using the old password"
        ],
        "correctIndex": 0,
        "explanation": "Recovery credentials should be difficult to guess and limited in lifetime and reuse."
    },
    {
        "question": "Why might password reset revoke existing sessions?",
        "options": [
            "To reduce the chance an attacker keeps an existing session",
            "To create a salt",
            "To make bcrypt reversible",
            "To remove HTTPS"
        ],
        "correctIndex": 0,
        "explanation": "Session revocation can invalidate authentication state after a security-sensitive password change."
    },
    {
        "question": "What is credential stuffing?",
        "options": [
            "Trying credentials stolen elsewhere against the application",
            "Trying random JWT algorithms",
            "Hashing passwords",
            "Creating cookies"
        ],
        "correctIndex": 0,
        "explanation": "Credential stuffing relies on password reuse across services."
    },
    {
        "question": "Why can aggressive account lockout be abused?",
        "options": [
            "Attackers can trigger lockouts against legitimate users",
            "It makes passwords reversible",
            "It disables salts",
            "It removes MFA"
        ],
        "correctIndex": 0,
        "explanation": "Hard lockouts can become a denial-of-service mechanism."
    },
    {
        "question": "Why benchmark Argon2/bcrypt parameters?",
        "options": [
            "To balance password-guessing resistance with production resource usage",
            "To determine roles",
            "To encrypt JWTs",
            "To hide salts"
        ],
        "correctIndex": 0,
        "explanation": "Hashing consumes CPU and/or memory, so operational cost matters."
    }
],
  project: {
    name: "Secure Password and Recovery System",
    goal: "Build secure password storage, login protection, and password-reset flows for the e-commerce application.",
    brief: "Implement password hashing with Argon2id or bcrypt, secure reset credentials, session revocation after password changes, and defenses against common credential attacks.",
    steps: [
      "Create a PasswordService with hash and verify methods.",
      "Store only encoded password hashes.",
      "Implement registration and login through the PasswordService.",
      "Benchmark the selected hashing configuration and document the choice.",
      "Create a forgot-password endpoint with enumeration-resistant responses.",
      "Generate cryptographically random, short-lived reset credentials.",
      "Consume reset credentials after successful use.",
      "Hash the new password with the same PasswordService.",
      "Define and implement a session-revocation policy after password reset.",
      "Add rate limiting to login and reset endpoints.",
      "Test wrong passwords, reset expiry, token reuse, unknown accounts, and session revocation.",
      "Review logs and ensure passwords, hashes, and reset credentials are never exposed."
    ],
    acceptance: [
      "No plaintext password is stored.",
      "Password verification works with the selected library.",
      "Unique salts are handled by the password library.",
      "Reset requests do not reveal account existence.",
      "Reset credentials expire and cannot be reused.",
      "Password reset updates the password hash and applies the session policy.",
      "Login and reset endpoints have abuse controls.",
      "Tests cover malicious credential scenarios."
    ],
    stretch: [
      "Implement automatic hash upgrades after successful login.",
      "Add breached-password screening.",
      "Add MFA or passkey authentication.",
      "Add device/session management.",
      "Add security-event auditing for password changes and recovery."
    ]
  },
};