import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_21_DETAIL = {
  overview: [
    "How you deploy matters as much as what you deploy. A naive 'take everything down, put new version up' approach — Recreate — gives you guaranteed downtime on every release. The three production-grade alternatives (Rolling, Blue-Green, Canary) each make different trade-offs between infrastructure cost, deployment speed, rollback speed, and risk surface. Choosing the wrong one for your context is a reliability incident waiting to happen.",
    "Day 21 covers the theory and the mechanics: how each strategy works at the infrastructure level, how to implement blue-green with nginx and canary with GitHub Actions, what to monitor during a canary release, and how to roll back fast when something goes wrong. Work through the workflow YAML and the kubectl rollout commands before Day 22.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "H5z70EBtEow", title: "Deployment Strategies Explained: Blue-Green vs. Canary vs. Rolling" },
      ],
    },
    {
      title: "The four strategies",
      blocks: [
        { type: "diagram", id: "devops-deploy-strategies" },
        {
          type: "paragraph",
          text: "Every deployment strategy is a different answer to the same trade-off: how much risk do you take on, how fast can you recover, and how much does it cost to maintain the infrastructure? There is no universally correct answer — the right choice depends on your traffic volume, team maturity, infrastructure cost tolerance, and how much confidence you have in your test suite.",
        },
        {
          type: "table",
          headers: ["Strategy", "Description", "Zero downtime?", "Rollback speed", "Infrastructure cost", "Best for"],
          rows: [
            ["Recreate", "Terminate all old instances, then start new ones. There is a gap where no instances are running.", "No — guaranteed downtime proportional to startup time", "Fast (redeploy old version)", "1x — only one version running at a time", "Dev/staging environments, internal tools, batch jobs, or apps with planned maintenance windows"],
            ["Rolling", "Replace old instances one at a time (or N at a time). Both versions run simultaneously during the rollout.", "Yes — as long as the new version is backward-compatible with in-flight requests", "Slow — must roll back all instances; kubectl rollout undo takes as long as the original deploy", "1x — same total fleet size; a small surge capacity (maxSurge) is optional", "Stateless microservices with a good health check setup; the default for most Kubernetes Deployments"],
            ["Blue-Green", "Maintain two identical production environments. Traffic switches atomically from blue (current) to green (new) at the load balancer.", "Yes — switch is near-instant", "Immediate — flip load balancer back to blue; old environment is still warm", "2x — both environments must be fully provisioned simultaneously", "High-traffic apps where fast rollback is non-negotiable; major version changes; apps with complex database migrations"],
            ["Canary", "Route a small percentage of traffic to the new version first. Gradually increase if metrics look good. Full cutover only after validation.", "Yes — canary instances serve live traffic while old instances handle the rest", "Fast — route 0% to new version; old version was never removed", "~1.1x during canary phase; full 2x only if you keep both fleets", "High-risk deploys; features with uncertain performance characteristics; new services with unknown traffic patterns"],
          ],
        },
      ],
    },
    {
      title: "Blue-green in depth",
      blocks: [
        {
          type: "paragraph",
          text: "Blue-green works by keeping two complete, production-equivalent environments. 'Blue' is currently live. 'Green' is where you deploy the new version. Once green is fully deployed, tested, and warmed up, you point the load balancer at green. Blue stays running as a warm standby. If anything goes wrong, you flip back to blue in seconds — no redeployment needed. After enough confidence, you decommission blue or repurpose it as the next green.",
        },
        {
          type: "code",
          title: "nginx upstream switching — blue to green",
          code: `# /etc/nginx/conf.d/api.conf
#
# Step 1 — blue is live
upstream api_backend {
  server blue.internal:3000 weight=1;   # all traffic goes here
  server green.internal:3000 weight=0 backup;  # backup, receives 0 traffic
}

# Step 2 — after green passes smoke tests, edit the upstream:
# upstream api_backend {
#   server blue.internal:3000  weight=0 backup;
#   server green.internal:3000 weight=1;
# }
# Then: nginx -s reload   (zero-downtime config reload)

server {
  listen 443 ssl;
  server_name api.example.com;

  ssl_certificate     /etc/ssl/certs/api.crt;
  ssl_certificate_key /etc/ssl/private/api.key;

  location / {
    proxy_pass         http://api_backend;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_connect_timeout 5s;
    proxy_read_timeout    60s;
  }

  location /healthz {
    access_log off;
    return 200 "OK";
  }
}`,
        },
        {
          type: "table",
          headers: ["Blue-green advantage", "Blue-green disadvantage"],
          rows: [
            ["Rollback is a single load balancer change — seconds, not minutes", "Requires 2x compute and infrastructure cost while both environments run"],
            ["Green is fully deployed and warmed before any user traffic touches it", "Database migrations must be backward-compatible — the schema must work with both old and new application code simultaneously"],
            ["No partial state — users see either 100% old or 100% new", "Stateful services (WebSockets, long-polling) drop connections at the switch point"],
            ["Natural fit for compliance environments that require a tested build before go-live", "Environment drift: blue and green can silently diverge in config over time without tooling discipline"],
          ],
        },
        {
          type: "paragraph",
          text: "Database migrations are the hardest part of blue-green. During the switch, blue and green run simultaneously against the same database. Any schema change must be backward-compatible with the old application code. The expand/contract pattern solves this: in release N, add the new column (expand) but do not remove the old one. Both old and new code can run. In release N+1 (after blue is fully decommissioned), remove the old column (contract). Never rename a column in a single blue-green deploy — add new, backfill, switch code, then drop old.",
        },
      ],
    },
    {
      title: "Canary in depth",
      blocks: [
        {
          type: "paragraph",
          text: "A canary release routes a small percentage of production traffic to the new version before committing to a full rollout. The term comes from coal miners who brought canaries into mines to detect toxic gases — if the canary died, you had time to escape. In software, if the canary version misbehaves (high error rate, latency spike, business metric drop), you route 0% to it and investigate before any significant user impact.",
        },
        {
          type: "paragraph",
          text: "Traffic splitting approaches differ in granularity: weighted routing (10% of all requests to new) is the simplest but exposes a random 10% of users; header-based routing (X-Canary: true directs specific users) lets you test with internal users first; user-percentage routing (consistent hash on user ID so the same user always hits the same version) gives a coherent experience and is the most production-grade approach for features that modify state.",
        },
        {
          type: "code",
          title: "GitHub Actions canary workflow — deploy to 10%, check error rate, promote",
          code: `# .github/workflows/canary-deploy.yml
name: Canary Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-canary:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure kubectl
        uses: azure/k8s-set-context@v3
        with:
          kubeconfig: \${{ secrets.KUBECONFIG }}

      # ── Phase 1: deploy canary (10% of replicas) ───────────────────────────
      - name: Deploy canary Deployment (10% traffic)
        run: |
          # Scale canary: if prod has 10 replicas, canary gets 1 (≈10%)
          kubectl set image deployment/node-api-canary \
            node-api=registry.example.com/node-api:\${{ github.sha }} \
            --namespace production
          kubectl scale deployment/node-api-canary \
            --replicas=1 --namespace production
          kubectl rollout status deployment/node-api-canary \
            --namespace production --timeout=120s

      # ── Phase 2: bake time + automated error-rate gate ────────────────────
      - name: Wait for metrics bake (5 minutes)
        run: sleep 300

      - name: Check canary error rate via Prometheus
        id: error-check
        run: |
          # Query Prometheus HTTP API for error rate over last 5 minutes
          ERROR_RATE=$(curl -sG \
            --data-urlencode \
              'query=sum(rate(http_requests_total{job="node-api-canary",status=~"5.."}[5m])) / sum(rate(http_requests_total{job="node-api-canary"}[5m]))' \
            http://prometheus.monitoring.svc.cluster.local:9090/api/v1/query \
            | jq -r '.data.result[0].value[1] // "0"')

          echo "canary_error_rate=$ERROR_RATE" >> "$GITHUB_OUTPUT"

          # Fail if error rate > 1%
          THRESHOLD="0.01"
          if (( $(echo "$ERROR_RATE > $THRESHOLD" | bc -l) )); then
            echo "::error::Canary error rate $ERROR_RATE exceeds threshold $THRESHOLD — aborting"
            exit 1
          fi
          echo "Error rate $ERROR_RATE is within threshold. Proceeding to full rollout."

      # ── Phase 3: promote to production ────────────────────────────────────
      - name: Promote to production (100% traffic)
        if: success()
        run: |
          kubectl set image deployment/node-api \
            node-api=registry.example.com/node-api:\${{ github.sha }} \
            --namespace production
          kubectl rollout status deployment/node-api \
            --namespace production --timeout=300s

      # ── Phase 4: scale down canary ────────────────────────────────────────
      - name: Scale down canary
        if: always()
        run: |
          kubectl scale deployment/node-api-canary \
            --replicas=0 --namespace production

      - name: Rollback production on failure
        if: failure()
        run: |
          kubectl rollout undo deployment/node-api --namespace production`,
        },
        {
          type: "table",
          headers: ["Signal to monitor", "Why it matters", "Alert threshold (example)"],
          rows: [
            ["HTTP 5xx error rate", "Primary health signal — spikes immediately on crashes, unhandled exceptions, or dependency failures", "Alert if canary 5xx rate > 2x baseline for 2 minutes"],
            ["p99 response latency", "Catches performance regressions that do not manifest as errors — slow database queries, memory pressure, lock contention", "Alert if canary p99 > 500ms and > 1.5x baseline for 3 minutes"],
            ["p50 (median) response latency", "Detects broad slowdowns affecting typical requests, not just tail latency", "Alert if canary p50 > 200ms and > 1.2x baseline"],
            ["Business metrics (conversion rate, checkout rate)", "Catches correctness bugs that do not surface as technical errors — a new UI flow that is technically 200 OK but users abandon", "Alert if conversion rate drops > 5% relative to control"],
            ["Memory and CPU usage per Pod", "Detects memory leaks or CPU hot spots introduced in the new version before they cause OOMKills at full scale", "Alert if memory usage grows > 20% over 10 minutes"],
          ],
        },
      ],
    },
    {
      title: "Rollback strategies",
      blocks: [
        {
          type: "paragraph",
          text: "The goal of a rollback strategy is to return to a known-good state as fast as possible while minimising data loss and user impact. Automated rollback triggers — error rate spike, failed health checks, SLO breach — are preferable to manual processes because they do not require a human to be awake and watching at 3 AM.",
        },
        {
          type: "code",
          title: "kubectl rollout undo — immediate Kubernetes rollback",
          code: `# View rollout history — each revision is a ReplicaSet snapshot
kubectl rollout history deployment/node-api --namespace production

# REVISION  CHANGE-CAUSE
# 1         image: node-api:1.3.0
# 2         image: node-api:1.4.0  ← current (broken)
# 3         image: node-api:1.4.2  ← latest

# Undo to the immediately previous revision (1.4.0)
kubectl rollout undo deployment/node-api --namespace production

# Or undo to a specific revision number
kubectl rollout undo deployment/node-api \
  --to-revision=1 --namespace production

# Watch the rollback progress
kubectl rollout status deployment/node-api --namespace production

# After rollback, verify the running image
kubectl get deployment node-api -o jsonpath='{.spec.template.spec.containers[0].image}' \
  --namespace production`,
        },
        {
          type: "table",
          headers: ["Rollback method", "How it works", "Speed", "Risk"],
          rows: [
            ["kubectl rollout undo", "Kubernetes replaces the current ReplicaSet's Pod template with the previous one and performs a rolling replacement. The previous ReplicaSet is retained by Kubernetes (controlled by revisionHistoryLimit).", "30 seconds to several minutes depending on replica count and probe timing", "Low for stateless apps. Problematic if the new version ran a non-reversible database migration."],
            ["Blue-green switch", "Flip the load balancer back to the blue environment, which never went away. Green stays running as a new potential blue.", "Seconds — a single nginx reload or load balancer rule change", "Very low — blue was never taken down; no new containers to pull or start"],
            ["Feature flag kill switch", "Toggle the feature flag off in your feature flag service. No redeployment. Traffic continues to the same code, but the code path is disabled.", "Milliseconds — flag evaluation is in-process or a fast cache read", "Very low — code path is disabled, not rolled back. Risk: the flag code path must be clean enough to disable safely without side effects"],
            ["Database migration revert", "Run a down migration to undo schema changes. Requires that migrations were written with a reversible down step.", "Minutes to hours depending on table size and lock contention", "High — irreversible data changes (column drops, data transforms) cannot be undone. Always test down migrations in staging."],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What makes blue-green different from canary?",
      answer: "Blue-green is a binary switch: 100% of traffic goes to old (blue) or 100% goes to new (green). The switch is atomic. The advantage is simplicity and instant rollback. The disadvantage is that if green has a bug, 100% of your users hit it — you find out fast but the blast radius is maximum. Canary is a gradual exposure: you start at 1-10% of traffic on the new version and only promote to 100% after metrics confirm it is healthy. The blast radius of a canary bug is small (only the percentage receiving canary traffic). Canary is more complex to implement (requires traffic splitting infrastructure) but is the correct choice for high-risk changes or when you want to validate real-world behaviour before full exposure.",
    },
    {
      question: "Why is database migration the hardest part of zero-downtime deploys?",
      answer: "During a rolling, blue-green, or canary deploy, both the old and new versions of your application code run simultaneously against the same database. A schema change that is safe for the new code may break the old code. For example, renaming a column in a single deploy causes the old application to fail on every query that references the old name. The expand/contract pattern solves this: in release N, add the new column alongside the old (expand phase) — both versions can run. Backfill data. In release N+1, after the old version is fully decommissioned, drop the old column (contract phase). This means schema changes that look like one step actually take two releases. Teams that skip this step get production outages during deploys.",
    },
    {
      question: "When would you choose a rolling update over blue-green?",
      answer: "Rolling updates are the right default for most Kubernetes Deployments because they require no extra infrastructure cost (no second fleet) and are built into Kubernetes natively. Choose rolling when: your changes are backward-compatible with in-flight requests, your readiness probes reliably detect unhealthy new Pods before they receive traffic, and your rollback time is acceptable (a rolling rollback takes as long as the original rollout). Choose blue-green instead when you need instant rollback (critical payment or checkout flows), when you have a complex database migration that must be validated against a full production traffic clone before exposure, or when compliance requires that the new version is smoke-tested on production infrastructure before any user hits it.",
    },
    {
      question: "What is a feature flag and how does it relate to deployment?",
      answer: "A feature flag (also called a feature toggle) is a conditional in your code that enables or disables a code path based on a runtime configuration value rather than a code deployment. This decouples deployment from release: you can deploy new code to production with the flag off (dark launch), validate it is not causing errors, then enable it for 1% of users, then 10%, then 100% — all without redeploying. Feature flags are the logical evolution of canary releases for feature-level control. They are also the fastest rollback mechanism: disabling a flag takes milliseconds and requires no new deployment. The trade-off is flag debt — old flags that should have been removed accumulate and make the code harder to reason about.",
    },
    {
      question: "What automated triggers should cause an automatic rollback?",
      answer: "The most reliable automated rollback triggers are: (1) HTTP 5xx error rate exceeds a threshold relative to baseline — e.g. error rate > 2% for 2 consecutive minutes; (2) readiness probe failure rate on new Pods exceeds a threshold during the rollout — Kubernetes stops the rolling update but does not undo it automatically, so you need a separate controller or pipeline step; (3) p99 latency spikes beyond a threshold — catching performance regressions before they cascade; (4) business metric drop — conversion rate, add-to-cart rate, or revenue-per-minute drops significantly relative to the control group. Automated rollbacks require your observability stack (Prometheus, Datadog, CloudWatch) to be reliably instrumented before you begin the canary. If your metrics are unreliable, automated rollbacks fire on noise.",
    },
  ],
} satisfies RoadmapDayDetail;
