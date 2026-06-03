import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_24_DETAIL = {
  overview: [
    "An SLA is a promise to customers about uptime — and it has financial penalties when broken. An SLO is an internal goal more conservative than the SLA, giving you a buffer. An SLI is the actual measurement you track. Getting these definitions right is the foundation of reliability engineering, because everything else — error budgets, alerting, feature velocity decisions — flows from them.",
    "Today covers how to define SLIs and SLOs for real services, how error budgets give teams a quantitative way to balance reliability with new features, how burn rate alerts catch problems before your budget runs out, and what 'toil' means in the SRE world.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "Akri1BlGp10", title: "SLO vs SLI vs SLA vs Error Budget Explained" },
      ],
    },
    {
      title: "SLI, SLO, and SLA — the definitions",
      blocks: [
        { type: "diagram", id: "devops-slo-error-budget" },
        {
          type: "table",
          caption: "Most engineers confuse SLA and SLO — keep this table handy.",
          headers: ["Term", "Full name", "Defined by", "Who cares?", "Example"],
          rows: [
            ["SLI", "Service Level Indicator", "Engineering team — measured automatically", "Engineering (is the service healthy right now?)", "99.2% of requests in the last 30 days completed successfully"],
            ["SLO", "Service Level Objective", "Engineering + Product — internal target", "Engineering + Product (is our reliability good enough?)", "99.5% of requests succeed over a 30-day rolling window"],
            ["SLA", "Service Level Agreement", "Legal + Business — external contract", "Customers + Legal (what are we liable for?)", "We guarantee 99% uptime or we issue service credits"],
            ["Error budget", "Allowed failure headroom between SLO and 100%", "Derived from SLO — 100% minus SLO target", "Engineering + Product (how much room do we have to take risks?)", "0.5% of requests may fail = ~3.6 hours downtime per 30 days"],
          ],
        },
        {
          type: "paragraph",
          text: "The SLO is always set higher than the SLA to create a safety buffer. If your SLA promises 99% uptime and your SLO target is 99.5%, you have 0.5 percentage points of buffer before customers are entitled to compensation. If your SLO is breached first, you fix the reliability problem before it hits the SLA and becomes a legal issue.",
        },
      ],
    },
    {
      title: "Defining good SLIs",
      blocks: [
        {
          type: "paragraph",
          text: "A good SLI measures something users actually care about — not internal system health metrics. Users do not care about CPU usage. They care whether their requests succeed and whether responses are fast. Four categories of SLIs cover most user-facing services.",
        },
        {
          type: "table",
          headers: ["SLI category", "Definition", "Example measurement", "Typical SLO"],
          rows: [
            ["Availability", "Fraction of requests that succeed", "HTTP requests with status 2xx / total HTTP requests", "99.9% over 30 days"],
            ["Latency", "Fraction of requests that complete within a threshold", "Requests completing in < 200ms / total requests", "95% of requests under 200ms; 99% under 1s"],
            ["Error rate", "Fraction of requests that return an error to the user", "HTTP 5xx responses / total responses", "< 0.1% error rate over 30 days"],
            ["Saturation", "How full the service is — the leading indicator before failures start", "Current connection pool usage / max connections", "< 80% saturation — alert before it hits 100%"],
          ],
        },
        {
          type: "code",
          title: "SLI queries in PromQL",
          code: `# Availability SLI — percentage of successful requests
(
  sum(rate(http_requests_total{status!~"5.."}[30d]))
  / sum(rate(http_requests_total[30d]))
) * 100

# Latency SLI — percentage of requests under 200ms
(
  sum(rate(http_request_duration_seconds_bucket{le="0.2"}[30d]))
  / sum(rate(http_request_duration_seconds_count[30d]))
) * 100

# Error budget remaining — how much of your allowed failure is left
# SLO = 99.5%, so allowed error rate = 0.5%
# If current error rate is 0.1%, you have used 0.1/0.5 = 20% of your budget
(0.5 - current_error_rate_percent) / 0.5 * 100`,
        },
      ],
    },
    {
      title: "Error budgets and burn rate alerts",
      blocks: [
        {
          type: "paragraph",
          text: "An error budget is the amount of unreliability your SLO allows. If your SLO is 99.9% availability over 30 days, your error budget is 0.1% of requests — about 43 minutes of complete downtime or a proportional number of individual request failures. When the error budget is healthy (most of it unspent), the team has room to take risks: deploy frequently, try new things. When the budget is nearly exhausted, reliability work takes priority over new features.",
        },
        {
          type: "paragraph",
          text: "A burn rate alert tells you how fast you are spending your error budget relative to how fast you should be spending it. If your SLO window is 30 days and you are burning through the budget at 10 times the expected rate, you will exhaust it in 3 days. A burn rate of 1 means exactly on pace. Burn rate alerts are more actionable than raw error rate alerts because they account for the time window of your SLO.",
        },
        {
          type: "code",
          title: "Multi-window burn rate alert (Google SRE recommended pattern)",
          code: `# A burn rate of 14.4 means the 30-day budget will be exhausted in 2 days
# Using two windows catches both fast burns (1h) and slow sustained burns (6h)

groups:
  - name: slo.rules
    rules:
      # Availability SLO: 99.9% over 30 days
      # Error budget: 0.1% — alert if burning > 14.4x faster than allowed

      - alert: HighBurnRate
        expr: |
          (
            sum(rate(http_requests_total{status=~"5.."}[1h]))
            / sum(rate(http_requests_total[1h]))
          ) > (14.4 * 0.001)    # 14.4x the error budget rate
          and
          (
            sum(rate(http_requests_total{status=~"5.."}[5m]))
            / sum(rate(http_requests_total[5m]))
          ) > (14.4 * 0.001)
        for: 2m
        labels:
          severity: critical
          slo: availability
        annotations:
          summary: "High error budget burn rate — budget exhausted in < 2 days"

      - alert: MediumBurnRate
        expr: |
          (
            sum(rate(http_requests_total{status=~"5.."}[6h]))
            / sum(rate(http_requests_total[6h]))
          ) > (6 * 0.001)       # 6x — budget exhausted in ~5 days
        for: 15m
        labels:
          severity: warning
          slo: availability`,
        },
      ],
    },
    {
      title: "Toil and reliability engineering",
      blocks: [
        {
          type: "paragraph",
          text: "Toil is manual, repetitive, automatable work that scales linearly with service growth — things like manually restarting a service that crashes twice a day, manually rotating secrets, manually approving deploys one by one. SRE practice says engineering teams should spend no more than 50% of their time on toil, and any toil above that threshold should be automated away. Tracking toil explicitly helps teams make the case for automation investment.",
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Toil examples: manual oncall ticket triage that could be auto-closed by a script, checking dashboard health every morning when an alert could do it, manually running database backups that could be a cron job.",
            "Not toil: complex engineering work that happens to be repetitive — a quarterly security review requires judgment, not just clicking buttons.",
            "The SRE golden ratio: 50% engineering work (features, automation, reliability improvements), 50% or less operations (incidents, on-call, toil). If ops exceeds 50%, the team cannot make progress on reliability.",
            "Error budget policy: agree in advance what happens when the budget is exhausted — for example, all feature releases pause until reliability is restored. This removes the political argument during an incident.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is the difference between SLI, SLO, and SLA?",
      tag: "SRE concepts",
      answer: [
        "An SLI (Service Level Indicator) is what you measure — the actual data. An SLO (Service Level Objective) is the internal goal you set for that measurement. An SLA (Service Level Agreement) is the external promise to customers with financial consequences for violation.",
        "The SLO is always stricter than the SLA to give you a buffer. If your SLA promises 99% uptime but your internal SLO is 99.5%, you get warning when your SLO is breached before you breach the SLA and owe customers credits.",
      ].join("\n\n"),
      callout: "SLI = measurement. SLO = internal goal. SLA = customer contract. SLO > SLA always.",
    },
    {
      question: "What is an error budget and how is it calculated?",
      tag: "Error budgets",
      answer: [
        "An error budget is 100% minus your SLO target, expressed as the allowed amount of failure within the SLO window. For a 99.9% availability SLO over 30 days: 0.1% of all requests may fail. At 1 million requests per day over 30 days (30M total), that is 30,000 allowed failures.",
        "In time terms: 0.1% of 30 days = 43.2 minutes of complete downtime. Spend it however you want — frequent small deployments each burning a few seconds, or occasionally larger deployments burning minutes. When the budget is gone, reliability work takes priority over new features until the window resets.",
      ].join("\n\n"),
    },
    {
      question: "What is a burn rate alert?",
      tag: "Alerting",
      answer: [
        "A burn rate alert fires when your service is consuming its error budget faster than the SLO window allows. A burn rate of 1 means you will exactly exhaust the budget by the end of the window. A burn rate of 10 means you will run out in 1/10 of the window — for a 30-day SLO, that is 3 days.",
        "The Google SRE books recommend a multi-window approach: alert when both a short window (1 hour) and a medium window (5 minutes or 6 hours) show high burn rate. The short window catches fast outages; the longer window catches slow, sustained degradation that would otherwise slip under the threshold.",
      ].join("\n\n"),
    },
    {
      question: "What is toil in SRE and how do you measure it?",
      tag: "Toil",
      answer: [
        "Toil is manual, repetitive work that keeps a service running but does not improve it. It scales with service growth — as traffic doubles, toil doubles, and engineers drown in it. Classic toil: manually restarting a service after every deploy, hand-approving every DNS change ticket, checking a dashboard every morning instead of having an alert.",
        "Measure it by tracking how much of your team's time each week goes to reactive operations vs engineering work. If operations exceeds 50%, flag it. The fix is automation: write the script, build the alert, automate the rollback. Every hour spent eliminating toil is an hour that compounds — you never do that task again.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Define SLIs for an HTTP API (availability, p99 latency, error rate) and set SLO targets for each based on what your users would consider acceptable.",
    "Calculate how many minutes of complete downtime your 99.9% availability SLO allows per month, per week, and per day.",
    "Write a multi-window burn rate alert in PromQL that fires at critical (2x burn rate over 1h) and warning (1.5x burn rate over 6h) severity.",
  ],
} satisfies RoadmapDayDetail;
