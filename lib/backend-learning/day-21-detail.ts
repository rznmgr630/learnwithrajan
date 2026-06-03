import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_21_DETAIL = {
  overview: [
    "How you deploy is just as important as what you deploy. Taking everything down and replacing it with the new version guarantees downtime. The three production alternatives — Rolling, Blue-Green, and Canary — each make different trade-offs between cost, speed, risk, and rollback time. Understanding those trade-offs is what lets you pick the right one for your situation.",
    "Today you will learn how each deployment strategy works at the infrastructure level, how to implement blue-green with nginx and canary releases with GitHub Actions, what to watch during a canary rollout, and how to roll back quickly when something goes wrong.",
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
          text: "Every deployment strategy is a different answer to the same question: how much risk do you take on, how fast can you recover, and how much does it cost? There is no universally correct choice — pick the one that fits your traffic volume, team size, infrastructure budget, and test confidence.",
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
          text: "Blue-green keeps two full production environments running at all times. Blue is live. Green is where you deploy the new version. Once green is fully deployed and smoke-tested, you point the load balancer at green. Blue stays warm in the background. If anything breaks, you switch back to blue in seconds — no redeployment needed. Once you are confident in green, you decommission blue or make it the next staging environment.",
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
          text: "Database migrations are the hardest part of blue-green deployments. While you are switching, both old and new code run against the same database simultaneously. A schema change that works for the new code might break the old code. The expand/contract pattern handles this: in release N, add the new column alongside the old — both versions work. In release N+1, after the old version is fully gone, drop the old column. Never rename a column in a single deploy.",
        },
      ],
    },
    {
      title: "Canary in depth",
      blocks: [
        {
          type: "paragraph",
          text: "A canary release sends a small slice of real production traffic to the new version before rolling it out fully. The name comes from the coal mine practice of bringing a canary to detect toxic gases — if it died, you had time to escape. In software, if the canary version misbehaves, you cut it to 0% traffic and investigate before many users are affected.",
        },
        {
          type: "paragraph",
          text: "There are a few ways to split traffic: weighted routing (10% of all requests go to the new version) is the simplest; header-based routing (X-Canary: true) lets you target internal users first; user-percentage routing (consistent hash on user ID, so the same user always hits the same version) gives a coherent experience and works best for features that modify state.",
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
          text: "A good rollback strategy gets you back to a known-good state as fast as possible. Automated triggers — error rate spike, health check failure, SLO breach — are better than relying on a human to notice and act, because incidents do not wait for business hours.",
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
      answer: "Blue-green is a binary switch: 100% of traffic goes to old (blue) or 100% goes to new (green). The switch is instant. If green has a bug, 100% of your users hit it immediately — you find out fast but the blast radius is maximum. Canary is gradual: you start at 1-10% of traffic on the new version and only promote to 100% once metrics confirm it is healthy. The blast radius of a canary bug is limited to the percentage receiving it. Canary is more complex to set up but is the right choice for high-risk changes or when you want to validate real-world behavior before full exposure.",
    },
    {
      question: "Why is database migration the hardest part of zero-downtime deploys?",
      answer: "During a rolling, blue-green, or canary deploy, both old and new versions of your code run against the same database simultaneously. A schema change that is safe for the new code may break the old code. Renaming a column in one deploy will cause every query from the old code that references the old name to fail. The expand/contract pattern solves this: in release N, add the new column alongside the old — both versions can run. In release N+1, after the old version is fully gone, drop the old column. Schema changes that look like one step actually take two releases.",
    },
    {
      question: "When would you choose a rolling update over blue-green?",
      answer: "Rolling updates are the right default for most Kubernetes Deployments — no extra infrastructure cost and natively built in. Choose rolling when your changes are backward-compatible with in-flight requests, your readiness probes reliably detect unhealthy new Pods before they receive traffic, and rollback time is acceptable (a rolling rollback takes as long as the original rollout). Choose blue-green when you need instant rollback for critical payment or checkout flows, when you have a complex database migration that needs to be validated against real traffic before exposure, or when compliance requires the new version to be fully smoke-tested on production infrastructure before any user sees it.",
    },
    {
      question: "What is a feature flag and how does it relate to deployment?",
      answer: "A feature flag is a conditional in your code that enables or disables a code path based on a runtime config value rather than a code deployment. This decouples deployment from release: you can deploy new code to production with the flag off (dark launch), confirm it is not causing errors, then enable it for 1% of users, then 10%, then 100% — all without redeploying. Feature flags are also the fastest rollback mechanism: disabling one takes milliseconds and requires no deployment at all. The trade-off is technical debt — old flags that should have been removed accumulate and make the code harder to reason about.",
    },
    {
      question: "What automated triggers should cause an automatic rollback?",
      answer: "The most reliable automated rollback triggers are: HTTP 5xx error rate above a threshold relative to baseline for two consecutive minutes; readiness probe failures on new Pods during rollout; p99 latency spikes beyond a threshold; and business metric drops (conversion rate, revenue per minute). Automated rollbacks require your observability stack to be reliably instrumented before you start the canary. If your metrics are noisy or unreliable, automated rollbacks will fire on false alarms and erode confidence in the system.",
    },
  ],
} satisfies RoadmapDayDetail;
