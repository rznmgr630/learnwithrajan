import type { RoadmapDayDetail } from "./challenge-data";

export const DAY_8_DETAIL = {
  overview: [
    "A load balancer sits in front of your fleet and distributes incoming connections across healthy instances. A reverse proxy sits in front of a single origin and adds TLS termination, compression, caching, and routing. In practice they often live in the same box (nginx, HAProxy, AWS ALB), but the concepts are distinct and each has different failure modes.",
    "Day 8 builds the mental model: algorithms, health-check mechanics, sticky sessions, Layer 4 vs Layer 7 differences, and when to reach for which tool. These concepts appear in every distributed system design interview.",
  ],
  sections: [
    {
      title: "Layer 4 vs Layer 7 load balancing",
      blocks: [
        {
          type: "diagram",
          id: "lb-round-robin",
        },
        {
          type: "table",
          caption:
            "L4 is faster (no HTTP parsing); L7 is smarter (route by path, header, cookie).",
          headers: ["Dimension", "L4 (TCP/UDP)", "L7 (HTTP/HTTPS)"],
          rows: [
            [
              "Sees",
              "IP + port only",
              "Full request: URL, headers, cookies, body",
            ],
            [
              "Routing",
              "By source IP / port hash",
              "By path prefix, Host header, cookie, JWT claim",
            ],
            [
              "TLS",
              "Pass-through (origin terminates)",
              "Terminates TLS, inspects plaintext, re-encrypts optionally",
            ],
            ["Speed", "Very fast — no parsing", "Slightly more CPU per request"],
            [
              "Examples",
              "AWS NLB, HAProxy TCP mode",
              "AWS ALB, nginx, Envoy, Traefik",
            ],
            [
              "Use when",
              "Non-HTTP protocols (gRPC raw, Kafka, DB proxying)",
              "HTTP microservices routing, A/B testing, canary deploys",
            ],
          ],
        },
      ],
    },
    {
      title: "Load-balancing algorithms",
      blocks: [
        {
          type: "table",
          headers: ["Algorithm", "How it works", "Best for"],
          rows: [
            [
              "Round robin",
              "Request 1 → server A, request 2 → server B, repeating",
              "Homogeneous instances, short-lived requests",
            ],
            [
              "Least connections",
              "Routes to the server with the fewest active connections",
              "Mixed request durations (long polling, streaming)",
            ],
            [
              "IP hash",
              "Hash of client IP → same server every time",
              "Sticky-session workaround when no session store",
            ],
            [
              "Weighted round robin",
              "Bigger servers get proportionally more requests",
              "Heterogeneous fleet (different RAM/CPU)",
            ],
            [
              "Random with two choices",
              "Pick two random servers, route to the one with fewer connections",
              "Very large fleets — avoids thundering-herd on one node",
            ],
          ],
        },
        {
          type: "code",
          title: "nginx weighted upstream (snippet)",
          code: `upstream api_servers {
  least_conn;                        # algorithm
  server 10.0.0.1:3000 weight=3;    # gets 3x the traffic
  server 10.0.0.2:3000 weight=1;
  server 10.0.0.3:3000 backup;      # only used if others are down
  keepalive 64;                      # keep connections warm
}

server {
  location /api/ {
    proxy_pass http://api_servers;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
  }
}`,
        },
      ],
    },
    {
      title: "Health checks — active vs passive",
      blocks: [
        {
          type: "diagram",
          id: "lb-ha-failover",
        },
        {
          type: "table",
          headers: ["Type", "How", "Pros", "Cons"],
          rows: [
            [
              "Active (probe)",
              "LB sends periodic HTTP GET /health to each backend",
              "Removes unhealthy nodes before real traffic hits them",
              "Adds synthetic load; false positives if /health is too light",
            ],
            [
              "Passive (circuit breaker)",
              "LB tracks real-request error rates and latency; ejects on threshold",
              "No extra probe traffic; reflects real behaviour",
              "First failures hit real users before detection",
            ],
          ],
        },
        {
          type: "code",
          title: "/health endpoint best practices (Express)",
          code: `// Shallow check — LB probe: just proves the process is alive
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Deep check — readiness: proves dependencies are up
app.get("/ready", async (_req, res) => {
  try {
    await db.raw("SELECT 1");
    await redis.ping();
    res.json({ status: "ready" });
  } catch (err) {
    res.status(503).json({ status: "degraded", error: String(err) });
  }
});`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Kubernetes uses /health for liveness and /ready for readiness — the distinction matters for rolling deploys.",
            "A liveness failure restarts the pod; a readiness failure just removes it from the load balancer until it recovers.",
            "Keep /health < 50 ms. Never wait on a DB in a liveness probe.",
          ],
        },
      ],
    },
    {
      title: "Reverse proxy responsibilities",
      blocks: [
        {
          type: "table",
          headers: ["Responsibility", "Detail"],
          rows: [
            [
              "TLS termination",
              "Handles the TLS handshake so origin servers speak plain HTTP internally. Centralises certificate renewal.",
            ],
            [
              "Compression",
              "gzip / Brotli encoding of responses saves 60–80% on JSON payloads.",
            ],
            [
              "Rate limiting",
              "nginx limit_req / Envoy rate limit filter — enforce per-IP or per-token limits before request reaches app code.",
            ],
            [
              "Header rewriting",
              "Add X-Real-IP, X-Forwarded-For, remove internal headers before forwarding upstream.",
            ],
            [
              "Static file serving",
              "Serve /static/ from disk with far-future Cache-Control without touching the app server.",
            ],
            [
              "Canary routing",
              "Route 5% of traffic (by cookie or random) to the new version; inspect errors before full rollout.",
            ],
          ],
        },
      ],
    },
    {
      title: "Sticky sessions — tradeoffs",
      blocks: [
        {
          type: "paragraph",
          text: "Sticky sessions (affinity) route a user's requests to the same server every time. This is necessary when in-process state is not shared (e.g. WebSocket state, file upload buffers). But it breaks even load distribution and makes rolling deploys harder.",
        },
        {
          type: "table",
          headers: ["Approach", "How", "Downside"],
          rows: [
            [
              "IP hash",
              "Client IP → deterministic server",
              "NAT causes many users to map to the same hash bucket",
            ],
            [
              "Cookie affinity (AWS ALB AWSALB cookie)",
              "LB sets a sticky cookie; same server until TTL",
              "Still loses affinity on server restart or scale-in event",
            ],
            [
              "Shared session store (preferred)",
              "All servers read session from Redis; no sticky needed",
              "Redis becomes a dependency; adds ~1 ms per request",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "The senior engineer default: eliminate the need for sticky sessions by externalising state to Redis or a DB. Sticky sessions are a band-aid over stateful servers — fix the root cause.",
        },
      ],
    },
    {
      title: "Connection draining & zero-downtime deploys",
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            "LB stops sending new requests to the draining instance (deregisters it).",
            "In-flight requests are allowed to complete — typically a 30-second drain window.",
            "After drain timeout, the instance is terminated and a new one starts.",
            "In Kubernetes: preStop hook + terminationGracePeriodSeconds control this window.",
          ],
        },
        {
          type: "code",
          title: "SIGTERM handler — drain in-flight requests",
          code: `const server = app.listen(3000);

process.on("SIGTERM", () => {
  server.close(() => {
    // all existing connections finished
    db.destroy();
    process.exit(0);
  });
  // force-kill if drain takes too long
  setTimeout(() => process.exit(1), 25_000);
});`,
        },
      ],
    },
    {
      title: "Common failure modes",
      blocks: [
        {
          type: "table",
          headers: ["Failure", "Symptom", "Fix"],
          rows: [
            [
              "504 Gateway Timeout",
              "LB times out waiting for backend response",
              "Increase proxy_read_timeout; add circuit breaker; offload slow work to async queue",
            ],
            [
              "Thundering herd on deploy",
              "New instances get flooded before warm-up",
              "Slow-start weight ramp in nginx; ELB slow start; readiness gate",
            ],
            [
              "Client IP lost",
              "Logs show LB IP instead of real client",
              "Trust X-Forwarded-For; set proxy_set_header X-Real-IP $remote_addr",
            ],
            [
              "Idle connection timeout mismatch",
              "LB closes idle connection; app gets broken pipe",
              "Set keepalive_timeout in app > LB idle timeout; or disable keepalive on the LB",
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is the difference between a load balancer and a reverse proxy?",
      tag: "LB vs reverse proxy",
      answer: [
        "A load balancer distributes requests across a pool of backend servers to spread load and handle failures. A reverse proxy is an intermediary for a client making requests to one or more servers — it can add TLS termination, caching, compression, and request routing without necessarily routing across many backends.",
        "In practice the same software (nginx, HAProxy, Envoy) does both jobs simultaneously. The distinction matters when reasoning about responsibilities: if you're thinking about traffic distribution and failover, think load balancer; if you're thinking about protocol termination and header rewriting, think reverse proxy.",
      ].join("\n\n"),
      callout: "Same box, different concerns. Understand both hats it wears.",
    },
    {
      question: "When should I use least-connections vs round-robin?",
      tag: "LB algorithms",
      answer: [
        "Round-robin works well when every request takes roughly the same time — short, stateless HTTP calls to a homogeneous fleet. Each server gets the same count of requests.",
        "Least-connections is better when request durations vary significantly (long-polling, file uploads, WebSocket connections). A round-robin LB could pile 50 slow connections onto one server while another is idle. Least-connections continuously routes to whoever has the most capacity right now.",
      ].join("\n\n"),
    },
    {
      question: "What is connection draining and why is it critical for zero-downtime deploys?",
      tag: "Connection draining",
      answer: [
        "Connection draining (or deregistration delay) is the window where a backend is removed from rotation but existing in-flight requests are allowed to complete. Without it, a deploy that terminates the process immediately would drop active requests mid-flight — users see errors.",
        "AWS ALB default drain window is 300 seconds. For fast-response APIs, 30 seconds is usually enough. Set your app's SIGTERM handler to stop accepting new connections and finish existing ones before exiting.",
      ].join("\n\n"),
      callout: "No drain window = dropped requests on every deploy. Set it.",
    },
    {
      question: "What is the difference between L4 and L7 load balancing?",
      tag: "L4 vs L7",
      answer: [
        "L4 (transport layer) sees only TCP/UDP packets — it routes by IP and port without inspecting the HTTP payload. Very fast, no parsing overhead. Use for non-HTTP protocols or when you don't need content-based routing.",
        "L7 (application layer) parses the full HTTP request and can route by URL path, headers, cookies, or JWT claims. Enables path-based microservice routing (/api → service-a, /static → CDN), canary releases, and A/B testing. The cost is a small CPU overhead per request.",
      ].join("\n\n"),
    },
    {
      question: "Why are sticky sessions considered an anti-pattern?",
      tag: "Sticky sessions",
      answer: [
        "Sticky sessions couple a user to a specific server. If that server crashes, the user's session is lost. Scale-in events break affinity. And uneven session counts mean some servers are much busier than others — you lose the 'balanced' part of load balancing.",
        "The fix is to externalise session state to a shared store (Redis, DynamoDB). Now any server can serve any user and the fleet scales freely. Sticky sessions are a pragmatic shortcut, not an architecture to build on.",
      ].join("\n\n"),
    },
    {
      question: "How does an active health check work and what should /health return?",
      tag: "Health checks",
      answer: [
        "The LB periodically sends a request (typically GET /health) to each backend. If the response is not 2xx within a timeout window, the backend is marked unhealthy and removed from rotation. After a configurable number of consecutive successful checks it is re-added.",
        "A liveness /health endpoint should be fast (<50 ms) and only prove the process is running — no DB calls. A readiness /ready endpoint proves dependencies are reachable and is used by Kubernetes to gate traffic during startup and rolling deploys.",
      ].join("\n\n"),
    },
    {
      question: "What causes a 504 Gateway Timeout and how do you fix it?",
      tag: "504 errors",
      answer: [
        "504 means the LB (or reverse proxy) did not receive a response from the upstream backend within its read timeout. Common causes: slow DB query, blocking synchronous work on the Node.js event loop, downstream service unavailable.",
        "Fixes: (1) increase proxy_read_timeout only if the work genuinely takes longer; (2) move slow work to an async job queue and return 202 Accepted immediately; (3) add a circuit breaker so the LB stops routing to degraded upstreams rather than waiting for each timeout.",
      ].join("\n\n"),
    },
    {
      question: "How does TLS termination at the LB affect internal traffic?",
      tag: "TLS termination",
      answer: [
        "The LB handles the TLS handshake with the client and forwards plaintext HTTP to backends on the internal network. This simplifies certificate management (one cert at the edge, not on every service) and reduces CPU load on app servers.",
        "The tradeoff is that internal traffic is unencrypted. If your threat model includes a compromised internal node or compliance requires end-to-end encryption, use mTLS between services (service mesh like Istio / Linkerd handles this). For most internal networks, termination at the LB is acceptable.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Deploy nginx locally, create two node servers on different ports, and configure upstream with round-robin and a /health probe.",
    "Test connection draining: send a slow request, then stop one upstream — verify the request completes without a 502.",
    "Explain in one sentence why least-connections beats round-robin for a WebSocket server.",
  ],
} satisfies RoadmapDayDetail;
