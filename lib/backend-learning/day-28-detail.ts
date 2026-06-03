import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_28_DETAIL = {
  overview: [
    "Incidents happen. The question is not whether your system will have an outage but whether your team knows how to detect it fast, communicate clearly, fix it quickly, and learn from it permanently. Teams that handle incidents well recover faster, build more resilient systems, and avoid repeating the same mistakes.",
    "Today covers the full incident lifecycle (detect → respond → resolve → learn), how to write runbooks that actually help during an outage, the principles of blameless post-mortems, chaos engineering as a practice for proactively finding weaknesses, and how to build an on-call rotation that does not burn your team out.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "Wv4loyVa048", title: "Incident Postmortems: Creating a Blameless SRE Culture" },
      ],
    },
    {
      title: "The incident lifecycle",
      blocks: [
        { type: "diagram", id: "devops-ha-patterns" },
        {
          type: "table",
          caption: "Speed at each phase compounds — a 10-minute faster detection + 10-minute faster diagnosis = 20 minutes less downtime.",
          headers: ["Phase", "Goal", "Who acts", "Key actions"],
          rows: [
            ["Detect", "Know something is wrong as fast as possible — ideally before users report it", "Alerting system, on-call engineer", "Alert fires based on symptoms (error rate spike, latency increase). On-call acknowledges the alert within SLA (e.g. 5 minutes)."],
            ["Triage", "Understand scope and severity — is this affecting 1% or 100% of users?", "On-call engineer", "Check dashboards, identify which services and users are affected. Declare the incident severity level (SEV1–SEV4). Page additional responders if SEV1."],
            ["Mitigate", "Reduce user impact as fast as possible — even if root cause is unknown", "On-call engineer + additional responders", "Roll back the last deploy, disable the failing feature flag, increase replicas, redirect traffic away from the broken region. Do not wait to understand why — reduce impact first."],
            ["Resolve", "Return service to normal operation and confirm with metrics", "On-call engineer", "Verify error rates and latency are back to normal. Close the incident. Announce resolution to stakeholders."],
            ["Learn", "Understand root cause and prevent recurrence — within 5 business days", "Incident commander + team", "Write the post-mortem. Identify contributing factors, timeline, action items. No blame — focus on system improvements."],
          ],
        },
        {
          type: "paragraph",
          text: "Declaring an incident early is better than declaring it late. When in doubt, declare. It is easy to call off an incident if it turns out to be nothing — it is much harder to recover time lost because everyone assumed someone else was handling it. Use an incident Slack channel or PagerDuty incident room from the moment you suspect a problem.",
        },
      ],
    },
    {
      title: "Runbooks — what to do when things break",
      blocks: [
        {
          type: "paragraph",
          text: "A runbook is a document that tells an on-call engineer exactly what to do when a specific alert fires or a specific failure occurs. It should be short enough to follow under pressure, specific enough to be actionable, and kept next to the alert definition so the engineer does not have to search for it. A runbook is not a tutorial — it assumes the reader is stressed and short on time.",
        },
        {
          type: "code",
          title: "Runbook template — high error rate on the orders API",
          code: `# RUNBOOK: High Error Rate — Orders API

## Severity
SEV2 — customer-facing checkout affected

## Alert
Alert name: HighErrorRate
Trigger: http_requests_total{status=~"5.."} rate > 1% for 5 minutes
Dashboard: https://grafana.example.com/d/orders-api

## Symptoms
- Checkout fails for some or all users
- Error rate spike in Grafana Orders API dashboard
- Sentry shows 500 errors from OrderController

## Step 1 — Assess scope (2 minutes)
1. Check the error rate percentage: is it 1%, 10%, or 100%?
2. Check when it started: correlate with recent deploys in the deploy log
3. Check which specific endpoints are failing: /api/orders/create or all routes?

## Step 2 — Quick mitigations (try in order)
1. If correlated with a deploy: roll back immediately
   kubectl rollout undo deployment/orders-api --namespace production
2. If a feature flag is involved: disable it in LaunchDarkly
3. If DB connection errors: check pg_stat_replication lag and connection pool saturation
4. If downstream service failures: check payment-service and inventory-service health

## Step 3 — Escalate if not resolved in 15 minutes
- Page the orders team lead: @orders-lead in #incidents
- Consider redirecting to maintenance page if > 50% error rate

## Step 4 — After resolution
- Keep incident channel open
- Start post-mortem doc: https://notion.so/postmortems/new
- Notify stakeholders in #status: "Orders API is recovered as of HH:MM UTC"

## Useful commands
# Check recent deploys
kubectl rollout history deployment/orders-api -n production

# Check current error rate
promtool query instant 'sum(rate(http_requests_total{status=~"5..",service="orders"}[5m]))'

# Check database connections
kubectl exec -it postgres-0 -n production -- psql -U app -c "SELECT count(*), state FROM pg_stat_activity GROUP BY state;"`,
        },
      ],
    },
    {
      title: "Blameless post-mortems",
      blocks: [
        {
          type: "paragraph",
          text: "A blameless post-mortem is a document written after every significant incident that explains what happened, why it happened, what was done to recover, and what will be done to prevent recurrence. The key word is blameless — humans made the best decisions they could with the information they had at the time. Systems fail because of gaps in tools, processes, or monitoring — not because someone is incompetent. A culture of blame causes people to hide incidents, avoid risky projects, and stop reporting near-misses. A blameless culture learns faster.",
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "A good post-mortem has a timeline, not a blame list. Write what happened, in order, with timestamps. 'At 14:32 UTC the deploy started. At 14:38 error rate exceeded 1%. At 14:41 the on-call engineer received the alert. At 14:55 the rollback was complete.'",
            "Contributing factors, not root causes. Real incidents have multiple contributing factors — a single root cause is usually a simplification. Ask 'why?' five times to surface the chain of events.",
            "Action items must be specific, assigned, and time-bounded. 'Improve monitoring' is not an action item. 'Add an alert for database connection pool > 80% saturation — assigned to Alice, due 2024-02-15' is.",
            "Share post-mortems broadly. The whole team (and sometimes the company) should read them. The value is not just preventing recurrence for the people who were on-call — it is spreading knowledge about how the system can fail.",
          ],
        },
      ],
    },
    {
      title: "Chaos engineering",
      blocks: [
        {
          type: "paragraph",
          text: "Chaos engineering is the practice of deliberately introducing failures into a system to test its resilience. The goal is to find weaknesses before real outages do. If you never test whether your database connection pool handles a database restart gracefully, you will find out for the first time during a production incident — at the worst possible moment. Chaos engineering finds those gaps in a controlled way.",
        },
        {
          type: "table",
          headers: ["Experiment type", "What it tests", "Example", "Tools"],
          rows: [
            ["Network partition", "Do services fail gracefully when they cannot reach a dependency?", "Block traffic between the API service and Redis — do fallback paths work?", "Chaos Monkey, Gremlin, Litmus Chaos (Kubernetes)"],
            ["Latency injection", "Does the system stay healthy when dependencies are slow instead of down?", "Add 500ms latency to all database queries — does the API timeout correctly?", "tc (Linux traffic control), Toxiproxy, AWS Fault Injection Simulator"],
            ["Instance termination", "Does the cluster self-heal when a Pod or server is killed?", "Kill a random Pod every hour — does Kubernetes replace it before users notice?", "Chaos Monkey (Netflix), kube-monkey, Pumba (Docker)"],
            ["Disk full / OOM", "Does the application handle resource exhaustion without cascading?", "Fill the disk on a worker node — do other nodes continue serving?", "stress-ng, cgroups memory limits, AWS FIS"],
          ],
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Start in staging, not production. Run chaos experiments in production only after you have validated in staging and have confidence in recovery mechanisms.",
            "Always have a hypothesis before you run an experiment: 'I believe the system will recover from a database restart within 30 seconds because Kubernetes will restart the connection pool.' Then test it.",
            "Keep the blast radius small. Start with one service, one region, or one percentage of traffic. You can always increase scope.",
            "Netflix's Simian Army (Chaos Monkey, Latency Monkey) runs in production by default. This is the end goal — a system confident enough in its resilience to embrace random failures.",
          ],
        },
      ],
    },
    {
      title: "On-call hygiene — keeping the rotation sustainable",
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            "Rotate regularly. No engineer should be on-call for more than one week at a time or more than one week per month. Chronic on-call leads to burnout and poor decisions under pressure.",
            "Fix noisy alerts immediately. Every alert that fires and is not actionable is on-call debt. An alert that fires 10 times per night for an informational condition should either be fixed, demoted to a dashboard, or deleted. Alert fatigue makes engineers ignore all alerts, including the ones that matter.",
            "Track on-call load. Measure the number of pages per shift, the time-to-acknowledge, and the time-to-resolve. If a shift averages more than 2 pages per night, the service is too unreliable to be on-call for.",
            "Compensate on-call fairly. Being reachable at 3am has a cost. Many companies pay a flat on-call stipend, additional PTO, or allow engineers to take time off after an interrupted night.",
            "Use escalation policies. If the primary on-call does not acknowledge within 5 minutes, page the secondary. If neither acknowledges within 10 minutes, page the manager. Incidents should never go unacknowledged.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is a blameless post-mortem and why does 'blameless' matter?",
      tag: "Post-mortems",
      answer: [
        "A blameless post-mortem is a written analysis of an incident that focuses on system-level improvements rather than individual fault. The core assumption is that engineers acted reasonably given the information they had — if they made a mistake, it is because the system allowed that mistake (missing safeguards, insufficient monitoring, unclear runbooks) not because they are careless.",
        "Blameless matters because blame-driven cultures cause engineers to hide incidents, underreport near-misses, and avoid taking responsibility for complex systems. Blameless cultures learn faster because people feel safe reporting problems honestly. The goal of a post-mortem is to improve the system so the same failure cannot happen again, regardless of who was involved.",
      ].join("\n\n"),
      callout: "Ask 'how did the system allow this to happen?' not 'who made this mistake?'",
    },
    {
      question: "What is chaos engineering and when is it appropriate to start?",
      tag: "Chaos engineering",
      answer: [
        "Chaos engineering is the practice of running controlled experiments that introduce real failures (killed processes, network latency, resource exhaustion) into your system to verify it handles them gracefully. You find weaknesses before users do.",
        "Start with basic chaos once you have: working health checks and readiness probes, automatic restarts (Kubernetes or systemd), observability (you can see if the experiment causes user impact), and runbooks for the failure modes you are testing. Begin in staging, with one service, with a clear hypothesis and a specific metric you are measuring. Only move to production once you have high confidence in your recovery mechanisms.",
      ].join("\n\n"),
    },
    {
      question: "What is alert fatigue and how do you fix it?",
      tag: "Alerting",
      answer: [
        "Alert fatigue is what happens when on-call engineers receive so many low-quality alerts that they start ignoring all of them — including the ones that matter. Common causes: alerting on every system metric regardless of user impact, thresholds set too low, alerts that fire and then resolve on their own without human action.",
        "Fix it by auditing your alerts: for every alert that fired in the last month, ask 'was this actionable?' If not, either raise the threshold, add a minimum duration, convert it to a dashboard metric, or delete it. Every alert should represent a situation where a human needs to take action right now — not a situation that might be concerning.",
      ].join("\n\n"),
    },
    {
      question: "How should you prioritize which runbooks to write first?",
      tag: "Runbooks",
      answer: [
        "Write runbooks for the failure modes that are most likely to happen and most likely to require fast, correct action from an on-call engineer who may not be the system expert. Start with: your most common alert types, your most complex recovery procedures, and any failure mode that has caused a long incident in the past.",
        "A runbook is most valuable when the person who knows the system best is not available — on vacation, in a different timezone, or not reachable. Write runbooks assuming the reader is competent but unfamiliar with this specific service. Test them by having a new team member follow the runbook for a drill — if they get confused, the runbook needs improving.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Write a runbook for one of your services that documents the most common alert, its symptoms, the diagnostic steps, and the mitigation playbook — keep it under two pages.",
    "Conduct a game day in staging: simulate a database connection failure and verify your app handles it gracefully, following the runbook steps.",
    "Audit your monitoring alerts from the last 30 days — identify any that fired but were not actionable and either fix the threshold, add a minimum duration, or delete the alert.",
  ],
} satisfies RoadmapDayDetail;
