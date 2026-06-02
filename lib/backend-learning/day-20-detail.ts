import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_20_DETAIL = {
  overview: [
    "Every engineering team eventually has a `.env` file checked into git, a Slack message with a database password, or a staging secret copy-pasted into production. These are not edge cases — they are the default outcome when secrets are treated as config files. Day 20 fixes that mental model: secrets have a separate lifecycle from code, require audit trails, need rotation, and must be access-controlled.",
    "Work through the secret manager comparison, implement the AWS Secrets Manager fetch pattern, and build the fail-fast config module. By Day 21 you should be able to articulate exactly why `.env` files fail at scale and what you would use instead in a production system.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "M5IkdUunf8g", title: "Stop Putting Secrets in .env" },
      ],
    },
    {
      title: "The .env problem",
      blocks: [
        {
          type: "paragraph",
          text: ".env files were designed as a local developer convenience: drop a file in the project root and libraries like dotenv load the values into process.env. That works fine for a single developer on a single machine. It breaks down the moment more than one person or environment is involved — which is always the case in production.",
        },
        {
          type: "paragraph",
          text: "The 12-Factor App methodology (factor III: Config) says configuration that varies between deployments must be stored in the environment, not in the code repository. A .env file committed to git violates this: the config is in the repo, travels with every clone, and is visible to anyone with repository access — now and in git history forever, even if you delete the file later.",
        },
        {
          type: "table",
          headers: ["Risk", "What goes wrong", "Mitigation"],
          rows: [
            ["Committed to git", "Secret is permanently in git history. `git log -S 'SECRET_KEY'` retrieves it instantly. Deleting the file does not remove it from history.", "Use a secret manager. Add .env to .gitignore. Use git-secrets or gitleaks in CI to block commits."],
            ["Shared across environments", "Dev, staging, and production share the same .env file or a copy of it. A developer can exfiltrate production credentials by reading their local file.", "Per-environment secrets stored in a secret manager with environment-scoped IAM policies."],
            ["No expiry", "A leaked API key or DB password is valid forever unless someone manually rotates it. Most teams never rotate until after a breach.", "Automatic rotation policies in AWS Secrets Manager, Vault, or GCP Secret Manager."],
            ["No audit trail", "You cannot answer: who accessed the DB password, when, and from which system. Essential for SOC 2, PCI-DSS, and incident response.", "Every secret manager provides an audit log tied to IAM identity."],
            ["Copy-paste sprawl", "Secrets get copied to Slack, Confluence, email threads, and spreadsheets during onboarding or debugging.", "Never display secrets in plaintext in dashboards or logs. Use secret references, not values."],
          ],
        },
      ],
    },
    {
      title: "Secret managers",
      blocks: [
        {
          type: "paragraph",
          text: "A secret manager is a centralised, encrypted store with access control, versioning, audit logging, and rotation. Applications fetch secrets at startup (or on-demand) via an API instead of reading a file. This separates the secret's lifecycle from the code's lifecycle.",
        },
        {
          type: "table",
          headers: ["Tool", "Key features", "Pricing model", "Best for"],
          rows: [
            ["AWS Secrets Manager", "Automatic rotation via Lambda, fine-grained IAM, cross-account sharing, native RDS/Redshift rotation, replication across regions", "~$0.40/secret/month + $0.05 per 10 000 API calls", "AWS-native stacks; teams that need automatic DB credential rotation out of the box"],
            ["HashiCorp Vault", "Dynamic secrets (generates short-lived DB creds on demand), many auth backends (AWS IAM, Kubernetes, LDAP), open source self-hosted or HCP managed, PKI engine", "Open source free; HCP Vault Dedicated starts ~$0.03/hr per cluster", "Multi-cloud or on-prem; teams needing dynamic secrets or complex auth hierarchies"],
            ["GCP Secret Manager", "IAM-based access, versioned secrets, rotation notifications via Pub/Sub, regional or global replication", "~$0.06 per 10 000 access operations; first 6 active secret versions free", "GCP-native stacks; straightforward secret storage without rotation automation"],
            ["Doppler", "Sync secrets to AWS/GCP/Azure and Kubernetes; CLI, GitHub Actions, and Terraform integrations; team-based access control; change log", "Free tier for small teams; paid from $6/user/month", "Teams that want a developer-friendly UX and cross-platform sync without building their own pipeline"],
            ["Kubernetes Secrets", "Built into K8s; can be auto-synced from Vault/AWS via External Secrets Operator; base64-encoded (not encrypted by default)", "Free (part of K8s)", "K8s workloads — use with External Secrets Operator for real encryption and rotation"],
          ],
        },
        {
          type: "code",
          title: "Fetch a secret from AWS Secrets Manager in Node.js",
          code: `import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "us-east-1" });

// Cache the secret in memory for the process lifetime so you're not
// paying per-call on every request.  Re-fetch on rotation by restarting
// the process or using a TTL-based cache.
let cachedSecret: Record<string, string> | null = null;

export async function getSecret(secretName: string): Promise<Record<string, string>> {
  if (cachedSecret) return cachedSecret;

  const command = new GetSecretValueCommand({ SecretId: secretName });
  const response = await client.send(command);

  if (!response.SecretString) {
    throw new Error(\`Secret "\${secretName}" has no string value\`);
  }

  cachedSecret = JSON.parse(response.SecretString) as Record<string, string>;
  return cachedSecret;
}

// Usage at application startup:
async function bootstrap() {
  const secrets = await getSecret("production/node-api/v1");
  // secrets.DATABASE_URL, secrets.JWT_SECRET, etc.
  await startServer({ databaseUrl: secrets.DATABASE_URL });
}`,
        },
      ],
    },
    {
      title: "Key rotation strategies",
      blocks: [
        {
          type: "paragraph",
          text: "Rotation limits the blast radius of a leaked credential: a key that rotates every 30 days is only useful to an attacker for at most 30 days after exfiltration. It is also a compliance requirement in many frameworks (SOC 2, PCI-DSS, HIPAA). The challenge is rotating without downtime — which requires a dual-active window where both the old and new key are valid simultaneously.",
        },
        {
          type: "code",
          title: "Graceful dual-active key rotation pattern in Node.js",
          code: `// During rotation you publish TWO keys: current and previous.
// Verifiers try the current key first, fall back to the previous one.
// After all existing tokens signed with the previous key have expired,
// remove it.  No tokens are invalidated mid-rotation.

import jwt from "jsonwebtoken";

interface KeySet {
  current: string;
  previous?: string;
}

// Fetched from your secret manager on startup and refreshed on rotation event.
let keySet: KeySet = {
  current: process.env.JWT_SECRET_CURRENT!,
  previous: process.env.JWT_SECRET_PREVIOUS,
};

export function signToken(payload: object): string {
  // Always sign with the current key.
  return jwt.sign(payload, keySet.current, { expiresIn: "15m" });
}

export function verifyToken(token: string): object {
  const keys = [keySet.current, keySet.previous].filter(Boolean) as string[];

  for (const key of keys) {
    try {
      return jwt.verify(token, key) as object;
    } catch {
      // Try next key
    }
  }
  throw new Error("Invalid or expired token");
}

// Rotation procedure (zero downtime):
// 1. Generate new key → store as "current"; move old "current" to "previous".
// 2. Deploy new key set to all instances (rolling restart or secret refresh).
// 3. Wait for all tokens signed with the old key to expire (≥ token TTL).
// 4. Remove "previous" key from the secret.`,
        },
        {
          type: "table",
          headers: ["Rotation approach", "Steps", "Downtime risk"],
          rows: [
            ["Automatic rotation via AWS Secrets Manager", "Configure a rotation Lambda (AWS provides blueprints for RDS, Redshift, DocumentDB). Lambda generates a new credential, updates the database user, stores the new secret version, and tests it. Old version is deprecated after a settable window.", "Near-zero if your app uses a connection pool that re-fetches credentials on new connections (e.g. rds-db:connect IAM auth, or a secrets-refreshing wrapper)."],
            ["Manual rotation with zero-downtime dual-active", "Generate new credential → deploy as 'current' while keeping old as 'previous' → wait for old-key sessions/tokens to expire → remove 'previous'.", "Zero if the dual-active window covers the longest-lived session or token TTL."],
            ["Database credential rotation (short-lived dynamic secrets)", "Vault generates a unique DB username/password per application instance with a 1-hour TTL. Vault renews or the app fetches a fresh credential before expiry.", "Zero — each credential is per-instance and short-lived; revocation is automatic on TTL expiry."],
          ],
        },
      ],
    },
    {
      title: "Config patterns & fail-fast startup",
      blocks: [
        {
          type: "paragraph",
          text: "Configuration management is broader than secrets: it includes feature flags, service URLs, log levels, timeout values, and behaviour toggles. Choosing the right pattern for each category reduces operational incidents caused by misconfiguration.",
        },
        {
          type: "table",
          headers: ["Pattern", "Pros", "Cons", "Use case"],
          rows: [
            ["Environment variables", "Twelve-factor compliant; simple to set in any runtime (Docker, K8s, Lambda); no library needed for basic access", "No types; no validation by default; sprawl across many vars; sensitive values visible in process listings", "Non-sensitive config in containerised apps; CI/CD pipeline variables"],
            ["Config files (JSON, YAML, TOML)", "Human-readable; can be version-controlled; supports complex nested structures; diff-able in PR review", "Must be deployed alongside code; environment-specific files proliferate; secrets must not be committed", "Complex static config (database pool sizes, retry policies) checked into the repo without secrets"],
            ["Secret manager (AWS SM, Vault, etc.)", "Encrypted at rest and in transit; access-controlled; audit logged; rotation support; no secrets in code or filesystem", "Adds a network call at startup; adds a dependency; increases operational complexity", "All sensitive credentials in production environments"],
            ["Feature flags (LaunchDarkly, Unleash, Flagsmith)", "Change behaviour without redeploying; per-user or per-segment targeting; instant kill switch; canary feature rollouts", "Adds an SDK dependency; flag sprawl if not governed; risk of 'permanent temporary' flags", "Progressive feature rollouts, A/B tests, emergency kill switches, dark launches"],
          ],
        },
        {
          type: "code",
          title: "Fail-fast config module — validate required env vars at startup",
          code: `// config.ts
// The application refuses to start if any required variable is missing or malformed.
// This surfaces misconfiguration immediately at deploy time, not 3 hours into a
// production outage when the code path that reads the missing var is finally hit.

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  REDIS_URL: z.string().url(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  SENTRY_DSN: z.string().url().optional(),
});

// parse() throws a ZodError with human-readable messages on any violation.
// The process exits non-zero before accepting any traffic.
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌  Invalid environment configuration:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;

// Usage elsewhere — fully typed, no string coercion needed:
// import { config } from "./config";
// const server = createServer({ port: config.PORT });`,
        },
      ],
    },
  ],
  faq: [
    {
      question: "Why should you never commit .env files to git?",
      answer: "Once a secret is in git history it is effectively public to anyone who can clone the repository — now or in the future. Even if you delete the file and force-push, the commit remains reachable via reflog and any existing clones. GitHub's secret scanning and tools like truffleHog can find secrets committed years ago in seconds. The correct pattern is: add .env to .gitignore before the first commit, store the actual values in a secret manager, and commit only a .env.example file with placeholder values describing what is needed.",
    },
    {
      question: "What is the difference between a secret and a config value?",
      answer: "A config value is any non-sensitive setting that varies between environments: PORT, LOG_LEVEL, FEATURE_FLAGS, API_BASE_URL, TIMEOUT_MS. It can be committed to a repository in a .env.example or config file without risk. A secret is a value whose exposure grants unauthorised access or violates compliance: database passwords, JWT signing keys, OAuth client secrets, TLS private keys, third-party API keys. The practical test: if a stranger read this value, could they access your systems, exfiltrate data, or impersonate your service? If yes, it is a secret and belongs in a secret manager, not an environment variable file.",
    },
    {
      question: "How do you rotate a secret without downtime?",
      answer: "The key insight is the dual-active window. Step 1: generate the new secret and publish it as 'current' while keeping the old as 'previous' — both are valid simultaneously. Step 2: deploy the new secret to all application instances (rolling restart or live refresh). Step 3: wait for all sessions, tokens, or connections created with the old secret to expire — this window must cover the longest-lived artefact (e.g. if JWT TTL is 15 minutes, wait at least 15 minutes). Step 4: remove the old secret. For database credentials, Vault's dynamic secrets approach is cleaner: each instance gets a unique short-lived credential that Vault auto-revokes, so there is no explicit rotation step.",
    },
    {
      question: "What is the principle of least privilege for secrets?",
      answer: "Each service or application should have access to exactly the secrets it needs and nothing more. A user-facing API service should be able to read the database URL and JWT secret for that service, but not the payment processor API key used only by the billing service. This is implemented via IAM policies (AWS), Vault policies, or Kubernetes RBAC. The benefits compound: if the API service is compromised, the attacker can only access the secrets that service was granted — they cannot pivot to billing, admin, or infrastructure credentials. Audit logs then show exactly which identity accessed which secret and when, making incident response dramatically faster.",
    },
    {
      question: "What is the fail-fast pattern for configuration and why does it matter?",
      answer: "The fail-fast pattern means the application validates that all required configuration is present and valid at startup, before accepting any traffic, and exits immediately with a clear error message if anything is wrong. Without this, a misconfigured deployment might start successfully, serve partial traffic, and then crash hours later when the code path that reads the missing variable is first executed — often during a high-traffic event. With fail-fast, the deployment fails immediately and the old version continues serving traffic. Zod is ideal for this in TypeScript because it produces typed, human-readable error messages for every violation simultaneously.",
    },
    {
      question: "Can Kubernetes Secrets be used safely in production?",
      answer: "Kubernetes Secrets are base64-encoded, not encrypted, by default. Anyone with RBAC read access to Secrets in a namespace can decode them trivially. To use them safely you need at minimum: enable Secrets encryption at rest in the kube-apiserver config (EncryptionConfiguration with AES-GCM or KMS provider), restrict access with fine-grained RBAC (avoid wildcard rules like secrets/*), and use the External Secrets Operator to sync from AWS Secrets Manager or Vault rather than storing raw values in the cluster. The External Secrets Operator gives you the best of both worlds: secrets live in a proper secret manager with rotation and audit, and are automatically synced into Kubernetes Secrets that Pods can consume as usual.",
    },
  ],
} satisfies RoadmapDayDetail;
