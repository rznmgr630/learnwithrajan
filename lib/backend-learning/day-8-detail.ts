import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_8_DETAIL = {
  overview: [
    "A load balancer spreads incoming requests across multiple servers so no single server gets overwhelmed. A reverse proxy sits between the internet and your servers and handles things like HTTPS, compression, and routing. In practice the same tool — nginx, HAProxy, or AWS ALB — often does both jobs at once.",
    "Today you will learn how load balancers decide where to send each request, how they detect failing servers, what sticky sessions are and why they cause problems, and the difference between Layer 4 and Layer 7 load balancing.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "gMIslJN44P0", title: "System Design: What is Load Balancing?" },
      ],
    },
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
            "L4 is faster because it skips HTTP parsing. L7 is smarter because it can route by URL path, header, or cookie.",
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
            "Kubernetes uses /health to check if the server is alive and /ready to check if it can take traffic. The difference matters during rolling deploys.",
            "A failed liveness check restarts the pod. A failed readiness check just stops routing traffic to that pod until it recovers.",
            "Keep /health fast — under 50ms. Never make it wait on a database query.",
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
          text: "Sticky sessions mean every request from the same user always goes to the same server. You need this when a server holds state locally — like a WebSocket connection or an in-progress file upload. The downside is that load becomes uneven and deployments get more complicated.",
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
          text: "The right fix is to move that state somewhere shared — like Redis — so any server can handle any request. Sticky sessions are a workaround, not a solution.",
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
            "The load balancer stops sending new requests to the server being taken out of rotation.",
            "Requests already in progress are allowed to finish — usually within a 30-second window.",
            "Once the drain window closes, the old server shuts down and a new one starts.",
            "In Kubernetes, the preStop hook and terminationGracePeriodSeconds settings control how long this window lasts.",
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
        "A load balancer spreads traffic across a group of servers to balance the load and handle failures. A reverse proxy sits between clients and your servers, adding features like HTTPS termination, caching, and compression — not necessarily across many backends.",
        "The same software (nginx, HAProxy, Envoy) usually does both at once. The distinction helps when you're thinking through responsibilities: if you're debugging traffic distribution or failover, think load balancer. If headers are missing or HTTPS is broken, think reverse proxy.",
      ].join("\n\n"),
      callout: "Same box, different concerns. Understand both hats it wears.",
    },
    {
      question: "When should I use least-connections vs round-robin?",
      tag: "LB algorithms",
      answer: [
        "Round-robin works well when all your requests take a similar amount of time and your servers are identical. Each server gets the same number of requests.",
        "Least-connections is better when request times vary a lot — like file uploads, long-polling, or WebSocket connections. With round-robin, a server can end up holding 50 slow connections while another is sitting idle.",
      ].join("\n\n"),
    },
    {
      question: "What is connection draining and why is it critical for zero-downtime deploys?",
      tag: "Connection draining",
      answer: [
        "When you shut down a server during a deploy, connection draining gives it time to finish any requests it is already handling before it stops. Without draining, the server shuts down mid-request and users see errors.",
        "AWS ALB gives you 300 seconds by default — for most APIs, 30 seconds is plenty. Have your app listen for SIGTERM, stop accepting new connections, and finish the ones already in progress.",
      ].join("\n\n"),
      callout: "No drain window = dropped requests on every deploy. Set it.",
    },
    {
      question: "What is the difference between L4 and L7 load balancing?",
      tag: "L4 vs L7",
      answer: [
        "L4 load balancers work at the TCP level — they see the IP address and port but not the HTTP content. They are very fast because there is no parsing overhead. Use them for non-HTTP protocols like raw gRPC, Kafka, or database traffic.",
        "L7 load balancers parse the full HTTP request, so they can route by URL path, headers, cookies, or JWT claims. This enables path-based microservice routing, canary releases, and A/B testing. The cost is a small amount of extra CPU per request.",
      ].join("\n\n"),
    },
    {
      question: "Why are sticky sessions considered an anti-pattern?",
      tag: "Sticky sessions",
      answer: [
        "Sticky sessions tie a user to one specific server. If that server crashes, the session is lost. Scale-in events break affinity. And uneven session counts mean some servers handle far more load than others — you lose the whole point of load balancing.",
        "The fix is to put session state in a shared store like Redis or DynamoDB. Then any server can handle any user and the fleet scales freely. Sticky sessions are a shortcut, not something to build on.",
      ].join("\n\n"),
    },
    {
      question: "How does an active health check work and what should /health return?",
      tag: "Health checks",
      answer: [
        "The load balancer periodically sends a request (usually GET /health) to each backend. If the response is not a 2xx status within a timeout, that backend is marked unhealthy and pulled from rotation. After a few consecutive successful checks, it comes back.",
        "A liveness /health endpoint should be fast (under 50ms) and just prove the process is running — no database calls. A readiness /ready endpoint proves dependencies are reachable and is used by Kubernetes to gate traffic during startup and rolling deploys.",
      ].join("\n\n"),
    },
    {
      question: "What causes a 504 Gateway Timeout and how do you fix it?",
      tag: "504 errors",
      answer: [
        "A 504 means the load balancer waited too long for your server to reply. Common causes: a slow database query, a blocking operation on the Node.js main thread, or a downstream service that is down.",
        "Fixes: only raise the timeout if the work genuinely takes longer; move slow work to a background queue and return 202 immediately; or add a circuit breaker so the load balancer stops sending to a server that is already struggling.",
      ].join("\n\n"),
    },
    {
      question: "How does TLS termination at the LB affect internal traffic?",
      tag: "TLS termination",
      answer: [
        "The load balancer handles the HTTPS handshake with the client and passes plain HTTP to your servers on the internal network. This simplifies certificate management — one certificate at the edge instead of on every service — and takes the HTTPS processing load off your app servers.",
        "The tradeoff is that traffic inside your network is unencrypted. For most setups this is fine. If you need end-to-end encryption because of compliance requirements, use mTLS between services — a service mesh like Istio or Linkerd handles this automatically.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Run nginx locally, start two Node.js servers on different ports, and configure nginx to split traffic between them using round-robin with a /health probe.",
    "Test connection draining: send a slow request, then stop one of the servers and confirm the request completes without a 502 error.",
    "Write one sentence explaining why least-connections is a better choice than round-robin for a server handling WebSocket connections.",
  ],
} satisfies RoadmapDayDetail;
