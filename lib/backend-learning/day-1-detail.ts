import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_1_DETAIL = {
  overview: [
    "HTTP is the protocol every backend engineer lives in. Every browser fetch, mobile API call, and service-to-service request is an HTTP exchange. Day 1 builds the mental model: how versions differ at the transport layer, which method to reach for, what status code to return, and why REST's six constraints exist.",
    "Work through the tables, run the blog-API lab (`/api/v1/posts`), and answer the self-check questions cold before Day 2.",
  ],
  sections: [
    {
      title: "HTTP versions — what changed (with diagrams)",
      blocks: [
        {
          type: "paragraph",
          text: "The request/response semantics are identical across versions. What changes is the transport: latency, multiplexing, and how packet loss hurts you.",
        },
        { type: "diagram", id: "http11-sequential" },
        { type: "diagram", id: "http2-multiplex" },
        { type: "diagram", id: "http3-quic" },
        {
          type: "table",
          caption:
            "Memorize the Wire and HoL columns — they come up in every system-design interview.",
          headers: [
            "Version",
            "Year",
            "Wire",
            "Multiplex",
            "HoL / loss behavior",
          ],
          rows: [
            [
              "HTTP/1.1",
              "1997",
              "TCP, text-based",
              "One request at a time per connection (pipelining rarely used)",
              "Slow response blocks the queue on that connection",
            ],
            [
              "HTTP/2",
              "2015",
              "TCP, binary frames + HPACK header compression",
              "Many streams on one TCP connection",
              "TCP byte-stream is shared — packet loss stalls all streams until retransmit",
            ],
            [
              "HTTP/3",
              "2022",
              "QUIC over UDP + TLS 1.3 baked in",
              "Independent QUIC streams",
              "Per-stream loss recovery; one stalled stream does not block others; faster handshake (0-RTT optional)",
            ],
          ],
        },
        {
          type: "list",
          variant: "number",
          items: [
            "HTTP/1.1 works around HoL by opening multiple TCP connections (typically 6 per origin).",
            "HTTP/2 eliminates the application-level queue; watch stream counts in Chrome DevTools Network.",
            "HTTP/3 / QUIC matters most on high-latency or lossy links (mobile, satellite).",
          ],
        },
      ],
    },
    {
      title: "HTTP methods — table + when to use each",
      blocks: [
        {
          type: "table",
          caption:
            "Safe = must not change persisted state. Idempotent = N identical calls == 1 call for server state.",
          headers: ["Method", "Purpose", "Body?", "Idempotent?", "Safe?"],
          rows: [
            ["GET", "Read resource or collection", "No", "✅", "✅"],
            ["HEAD", "Like GET — headers only, no body", "No", "✅", "✅"],
            [
              "POST",
              "Create or trigger non-idempotent action",
              "Yes",
              "❌",
              "❌",
            ],
            ["PUT", "Replace full resource at a known URI", "Yes", "✅", "❌"],
            ["PATCH", "Partial update", "Yes", "Design-dependent", "❌"],
            ["DELETE", "Remove resource", "Optional", "✅", "❌"],
            ["OPTIONS", "Capabilities / CORS preflight", "No", "✅", "✅"],
          ],
        },
        {
          type: "code",
          title: "Idempotency in practice",
          code: [
            "# PUT is idempotent — same body twice → same final row",
            'PUT /users/1  { "name": "Ada" }',
            'PUT /users/1  { "name": "Ada" }   # identical result',
            "",
            "# POST is NOT — each call may insert a new row",
            'POST /users   { "name": "Grace" }',
            'POST /users   { "name": "Grace" }  # two rows unless you add Idempotency-Key',
          ].join("\n"),
        },
      ],
    },
    {
      title: "Status codes — essentials + 401 vs 403",
      blocks: [
        {
          type: "table",
          headers: ["Code", "Meaning", "Use when"],
          rows: [
            ["200", "OK", "Successful read or update with a body"],
            [
              "201",
              "Created",
              "New resource born; return Location header + body",
            ],
            ["204", "No Content", "Success, no body (common after DELETE)"],
            [
              "304",
              "Not Modified",
              "ETag / If-None-Match matched; client uses cached copy",
            ],
            ["400", "Bad Request", "Malformed JSON, failed validation"],
            [
              "401",
              "Unauthorized",
              "Missing or invalid credentials — re-authenticate",
            ],
            [
              "403",
              "Forbidden",
              "Authenticated user, but not allowed this operation",
            ],
            ["404", "Not Found", "Unknown id or path"],
            ["409", "Conflict", "Version clash, duplicate unique key"],
            [
              "429",
              "Too Many Requests",
              "Rate limited; add Retry-After header",
            ],
            [
              "500",
              "Internal Server Error",
              "Unexpected bug — log with request-id",
            ],
          ],
        },
        { type: "diagram", id: "status-401-403" },
        {
          type: "code",
          title: "Consistent error shape (RFC 9457 / application/problem+json)",
          code: [
            "HTTP/1.1 403 Forbidden",
            "Content-Type: application/problem+json",
            "",
            "{",
            '  "type":   "https://api.example.com/errors/forbidden",',
            '  "title":  "Forbidden",',
            '  "detail": "Role author cannot delete posts owned by another user.",',
            '  "instance": "/api/v1/posts/42"',
            "}",
          ].join("\n"),
        },
      ],
    },
    {
      title: "REST — six constraints + request/response model",
      blocks: [
        {
          type: "paragraph",
          text: "REST is an architectural style, not a protocol. The six constraints define how a distributed system should behave to gain scalability, visibility, and simplicity.",
        },
        {
          type: "table",
          headers: ["#", "Constraint", "Practical takeaway"],
          rows: [
            [
              "1",
              "Stateless",
              "Every request carries everything needed to process it (auth token, ids). No hidden server-side session per caller.",
            ],
            [
              "2",
              "Client–server",
              "UI and storage evolve independently. A mobile app can ship without touching the API.",
            ],
            [
              "3",
              "Cacheable",
              "Responses declare whether they can be cached (Cache-Control, ETag). CDNs depend on this.",
            ],
            [
              "4",
              "Uniform interface",
              "Consistent resource URLs, standard methods, self-descriptive messages, optional hypermedia links.",
            ],
            [
              "5",
              "Layered system",
              "Clients may hit CDN → API gateway → service mesh → origin without knowing the topology.",
            ],
            [
              "6",
              "Code on demand (optional)",
              "Server can send executable code (e.g. JS). Rare in JSON APIs.",
            ],
          ],
        },
        { type: "diagram", id: "request-response" },
      ],
    },
    {
      title: "Resource URLs — bad vs good",
      blocks: [
        {
          type: "code",
          title: "RPC-style (avoid for REST surfaces)",
          code: [
            "GET  /getUser?id=42",
            "POST /createPost",
            "POST /deleteComment?id=5",
          ].join("\n"),
        },
        {
          type: "code",
          title: "REST-style — nouns + HTTP verbs",
          code: [
            "GET    /users/42",
            "POST   /posts",
            "DELETE /comments/5",
            "",
            "# Nested — posts belonging to a user",
            "GET    /users/42/posts",
            "POST   /users/42/posts",
            "GET    /users/42/posts/7",
            "DELETE /users/42/posts/7",
            "",
            "# Filters and pagination go in query params",
            "GET /posts?status=published&sort=created_at&page=2&limit=20",
          ].join("\n"),
        },
        {
          type: "table",
          caption: "Plural collection names; keep nesting ≤ 2 levels deep.",
          headers: ["Pattern", "Example", "Notes"],
          rows: [
            ["Collection", "GET /posts", "Returns an array"],
            ["Singleton", "GET /posts/7", "One item by id"],
            [
              "Scoped collection",
              "GET /users/42/posts",
              "Posts owned by user 42",
            ],
            [
              "Scoped singleton",
              "GET /users/42/posts/7",
              "One post in that scope",
            ],
          ],
        },
      ],
    },
    {
      title: "Versioning — compare strategies",
      blocks: [
        {
          type: "table",
          headers: ["Strategy", "Example", "Pros", "Cons"],
          rows: [
            [
              "URI prefix",
              "/api/v1/posts",
              "Visible in logs, curl, routing; easy to support two versions simultaneously",
              "URLs change on major bumps",
            ],
            [
              "Accept header",
              "Accept: application/vnd.co+json; version=2",
              "Clean paths; version is metadata",
              "Clients forget; hard to test in a browser",
            ],
            [
              "Query param",
              "/posts?api-version=2",
              "Quick to prototype",
              "Mixes with real filters; cache keys must Vary correctly",
            ],
          ],
        },
        {
          type: "code",
          title: "URI version (most common first API)",
          code: [
            "GET https://api.example.com/v1/posts",
            "GET https://api.example.com/v2/posts   # breaking change → bump",
          ].join("\n"),
        },
      ],
    },
    {
      title: "Headers — request/response cheat sheet",
      blocks: [
        {
          type: "table",
          headers: ["Header", "Direction", "Purpose"],
          rows: [
            ["Authorization", "Request", "Bearer token, Basic, API key"],
            ["Content-Type", "Both", "application/json; charset=utf-8"],
            ["Accept", "Request", "Preferred response format / vendor version"],
            [
              "If-None-Match",
              "Request",
              "Send saved ETag → server may reply 304",
            ],
            [
              "Cache-Control",
              "Response",
              "max-age, no-store, public/private directives",
            ],
            ["ETag / Last-Modified", "Response", "Cache validators"],
            [
              "Location",
              "Response",
              "URI of created resource (201) or redirect target",
            ],
            [
              "Retry-After",
              "Response",
              "Seconds until retry allowed (429/503)",
            ],
            [
              "traceparent / X-Request-ID",
              "Request",
              "Distributed tracing correlation",
            ],
          ],
        },
        {
          type: "code",
          title: "Conditional GET — zero bytes on cache hit",
          code: [
            "# 1. First request — save the ETag",
            "curl -sI https://api.example.com/posts/1 | grep -i etag",
            '# ETag: "abc123"',
            "",
            "# 2. Subsequent request — server replies 304 if unchanged",
            'curl -s -o /dev/null -w "%{http_code}\\n" \\',
            "  -H 'If-None-Match: \"abc123\"' \\",
            "  https://api.example.com/posts/1",
            "# 304",
          ].join("\n"),
        },
      ],
    },
    {
      title: "Lab — minimal blog API",
      blocks: [
        {
          type: "code",
          title: "Routes and expected status codes",
          code: [
            "GET    /api/v1/posts              → 200 + array",
            "POST   /api/v1/posts              → 201 + Location: /api/v1/posts/{id}",
            "GET    /api/v1/posts/:id          → 200 or 404",
            "PUT    /api/v1/posts/:id          → 200 or 404",
            "PATCH  /api/v1/posts/:id          → 200 or 404",
            "DELETE /api/v1/posts/:id          → 204 (first call) or 404 (already gone)",
            "GET    /api/v1/posts?tag=backend  → 200 filtered list",
          ].join("\n"),
        },
        {
          type: "list",
          variant: "number",
          items: [
            "Paths are nouns; verbs live in the HTTP method.",
            "A second `DELETE /posts/7` should return `404` — proves delete idempotency.",
            "Every JSON response sets `Content-Type: application/json`.",
            "Add a consistent error body to `400` and `404` responses (type, title, detail).",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question:
        "What is head-of-line blocking, and how do HTTP/2 and HTTP/3 address it?",
      tag: "HoL blocking",
      answer: [
        "In HTTP/1.1, responses queue on a TCP connection — a slow response blocks every request behind it on that connection. Browsers work around this by opening multiple TCP connections (typically six per origin), wasting resources.",
        "HTTP/2 multiplexes many streams over one TCP connection, removing the HTTP-level queue. But TCP still delivers one ordered byte stream to the OS. A lost packet stalls all HTTP/2 streams on that connection until the gap is filled by retransmit.",
        "HTTP/3 runs over QUIC (UDP). Each QUIC stream tracks its own sequence space, so a lost packet on Stream 2 does not block Streams 1 and 3. This is the core transport improvement over HTTP/2.",
      ].join("\n\n"),
      callout:
        "HTTP/2 fixes application-level HoL. HTTP/3 / QUIC fixes transport-level HoL.",
    },
    {
      question:
        "Why is HTTP/2 still affected by head-of-line blocking if it multiplexes streams?",
      tag: "HTTP/2 TCP limitation",
      answer: [
        "HTTP/2 multiplexing works at the framing layer: many logical streams share one TCP connection without each waiting for the others at the HTTP level.",
        "But TCP delivers a single ordered byte stream. When a packet is lost, the OS will not pass later bytes up the stack until the gap is filled via retransmit — regardless of which HTTP/2 stream those bytes belong to. All streams on the connection stall.",
        "QUIC moves reliability tracking per-stream into user space. Each stream has its own sequence number, so retransmission of one stream does not delay delivery of bytes from other streams.",
      ].join("\n\n"),
      callout:
        "TCP's shared byte stream is the root cause. QUIC's per-stream reliability removes it.",
    },
    {
      question:
        "Does any HTTP version eliminate head-of-line blocking completely?",
      tag: "HTTP/3 vs HTTP/2 HoL",
      answer: [
        "No version eliminates all queuing everywhere. Application logic, disk, and single-stream work can still stall. What changes is where the bottleneck lives.",
        "HTTP/3 / QUIC gets closest for transport-layer HoL: per-stream loss recovery means unrelated streams are not blocked by each other's retransmits.",
        "HTTP/2 already eliminates HTTP/1-style request convoys at the application layer, but one TCP packet loss stalls everything. On a reliable LAN, HTTP/2 is usually sufficient; on lossy mobile or satellite links, HTTP/3 wins.",
      ].join("\n\n"),
      callout:
        "Measure before assuming. On reliable links HTTP/2 is often enough.",
    },
    {
      question:
        'What does "idempotent" mean, and which HTTP methods are idempotent?',
      tag: "Idempotency",
      answer: [
        "Idempotent means calling a request N times produces the same server state as calling it once (ignoring logs and timestamps).",
        "Idempotent by convention: `GET`, `HEAD`, `OPTIONS`, `PUT`, `DELETE`. `PUT` with the same body converges to the same row. `DELETE` on a missing resource typically returns `404` — but the state (resource absent) is unchanged.",
        "`POST` and `PATCH` are not idempotent by default. `POST` may create a new row each time. `PATCH` can be designed to be idempotent (e.g. set-field semantics) or not (e.g. increment-field semantics) — document it.",
      ].join("\n\n"),
      callout:
        "Safe to retry without side effects = idempotent. POST is not, by default.",
    },
    {
      question: 'Which methods are "safe," and why does it matter?',
      tag: "Safe methods",
      answer: [
        "Safe methods must not change persisted state: `GET`, `HEAD`, `OPTIONS`. Clients, proxies, and crawlers can call them freely without risk.",
        "Safe methods are also idempotent by definition, but idempotent methods are not necessarily safe. `PUT` and `DELETE` change state yet are idempotent.",
        "This distinction matters for caching (only safe responses may be cached by default), prefetch (browsers prefetch safe links), and CORS preflight (safe requests may skip the OPTIONS check).",
      ].join("\n\n"),
      callout: "Safe = no state change. GET, HEAD, OPTIONS. Safe ⊂ idempotent.",
    },
    {
      question: "What is the difference between `PUT` and `PATCH`?",
      tag: "PUT vs PATCH",
      answer: [
        "`PUT` replaces the entire resource at a known URI. The client sends a full document; calling `PUT` twice with the same body should converge to identical stored state (idempotent). Missing fields are treated as absent.",
        "`PATCH` is a partial update. You send only the changed fields. Semantics and idempotency depend on your patch format: JSON Merge Patch (RFC 7396) sets fields, JSON Patch (RFC 6902) applies operations. Always document which format your endpoint accepts.",
        "Rule of thumb: if the client owns the full replacement, use `PUT`. If the client knows only what changed, use `PATCH`.",
      ].join("\n\n"),
      callout: "PUT replaces the whole resource. PATCH changes a part of it.",
    },
    {
      question: "When should I use `PUT` vs `POST` for creating resources?",
      tag: "PUT vs POST for creates",
      answer: [
        "Use `POST` to a collection when the server assigns the id. The response is `201 Created` with a `Location` header pointing to the new resource. This is the most common pattern.",
        "Use `PUT` to a specific URI when the client already knows (or generates) the id and sends the full resource. Repeated `PUT` with the same body is idempotent — safe to retry.",
        "Use `POST` also for non-idempotent actions that do not map cleanly to a resource (e.g. `/payments/42/refund`). Add `Idempotency-Key` if clients need to retry safely.",
      ].join("\n\n"),
      callout:
        "Server assigns the id? POST to collection. Client owns the URI? PUT.",
    },
    {
      question:
        "What is the difference between `401 Unauthorized` and `403 Forbidden`?",
      tag: "401 vs 403",
      answer: [
        "`401 Unauthorized` means the server does not know (or no longer accepts) who you are. The client should re-authenticate — the `WWW-Authenticate` header tells it how. Common causes: missing `Authorization` header, expired token, wrong API key.",
        "`403 Forbidden` means the server knows who you are but you are not allowed this operation on this resource. Re-authenticating will not help. Common causes: wrong role, resource owned by another user, feature flag disabled.",
        'The naming is confusing (`401` is really "unauthenticated"); the semantics are what matter in practice.',
      ].join("\n\n"),
      callout:
        "401: who are you? Authenticate first. 403: I know who you are — still no.",
    },
    {
      question: 'What does "stateless" mean in REST, and why does it matter?',
      tag: "REST stateless constraint",
      answer: [
        "Stateless means the server does not keep hidden per-client session state between requests. Every request carries everything needed to process it: auth token, resource ids, pagination cursors.",
        "This enables horizontal scaling: any server instance can handle any request, so a load balancer can route freely. It also makes retries and caching predictable.",
        "You can still have persistent storage — stateless here means the server's handling of one request does not depend on a prior request's hidden server-side memory. Session tokens stored in a cookie are fine as long as the server reconstructs context from them, not from in-memory maps.",
      ].join("\n\n"),
      callout:
        "Stateless = every request is self-contained. Enables horizontal scaling and safe retries.",
    },
    {
      question:
        "What status code should a `POST` that creates a resource return, and which header is required?",
      tag: "POST 201 + Location",
      answer: [
        "Return `201 Created` with a `Location` header pointing to the new resource's URL: `Location: /api/v1/posts/42` (or absolute). Include the created resource in the response body.",
        "Set `Content-Type: application/json` when the body is JSON. If you return no body, `204 No Content` is acceptable but the caller has to make a second request to read the resource.",
        'Return `200 OK` only if the request created or upserted and you want to signal the caller to treat the body as authoritative state rather than a "here is what I just made" snapshot.',
      ].join("\n\n"),
      callout:
        "POST → 201 + Location header. Give the caller the URI of the new resource.",
    },
    {
      question: "List the six REST constraints.",
      tag: "REST constraints",
      answer: [
        "1. Stateless — no hidden server session; each request is self-contained.",
        "2. Client–server — UI and storage are separated; they evolve independently.",
        "3. Cacheable — responses declare whether they can be cached; CDNs and browsers depend on this.",
        "4. Uniform interface — consistent resource URLs, standard methods, self-descriptive messages, optional hypermedia.",
        "5. Layered system — client may be behind CDN → gateway → mesh; it does not need to know.",
        "6. Code on demand (optional) — server may send executable code (rare in JSON APIs).",
      ].join("\n\n"),
      callout:
        "Stateless and uniform interface are the two that bite most in practice.",
    },
    {
      question: "What is HATEOAS, and do most JSON APIs implement it fully?",
      tag: "HATEOAS",
      answer: [
        "HATEOAS (Hypermedia as the Engine of Application State) means responses include links or forms so clients discover valid next actions instead of hard-coding every URL and flow in their code.",
        "Most production JSON APIs implement a pragmatic subset: pagination `next`/`prev` links, `self` links on resources, related resource URLs. Full hypermedia (e.g. HAL, JSON:API, Siren) is less common for internal APIs.",
        "The practical value: clients decouple from URL structure. The downside: tooling and caching get more complex. OpenAPI + well-documented CRUD often gives 80% of the benefit with less overhead.",
      ].join("\n\n"),
      callout:
        "Most JSON APIs ship partial HATEOAS: pagination links and self/related resource URLs.",
    },
    {
      question:
        "Why is `POST /deleteUser` not RESTful, and how should it be designed?",
      tag: "RPC vs REST",
      answer: [
        "`POST /deleteUser` encodes a verb in the path and hides the real operation behind `POST`. HTTP already provides a verb for deletion: `DELETE /users/42` is the REST equivalent — idempotent, cache-safe to invalidate, and obvious in logs.",
        "A second `DELETE /users/42` should return `404` (resource gone) to demonstrate idempotency: the end state is the same — resource absent.",
        'If you need soft delete (archive), model it as a state change: `PATCH /users/42` with `{ "status": "archived" }`, or `DELETE /users/42` if the semantic is removal. Never use path verbs to work around HTTP methods.',
      ].join("\n\n"),
      callout: "HTTP already has DELETE. Use it.",
    },
    {
      question: "Why prefer noun-based URLs over verb-based RPC paths?",
      tag: "URL design",
      answer: [
        "HTTP methods are the verbs (`GET`, `POST`, `PUT`, `DELETE`). Resource paths should be nouns that identify what you are acting on. The combination of method + noun gives the full semantic: `DELETE /users/42` is obvious; `POST /deleteUser?id=42` is redundant and harder to route or cache.",
        "Noun-based URLs also align with caching: `GET /posts/7` can be cached by a CDN keyed on that path. `POST /getPost?id=7` cannot be cached the same way.",
        "Paths like `GET /getUser` or `POST /createPost` duplicate what `GET`/`POST` already communicate — they also look like internal implementation details leaking into the public contract.",
      ].join("\n\n"),
      callout:
        "Nouns + HTTP verbs = REST. Path verbs duplicate what the method already says.",
    },
    {
      question:
        "What are the three main API versioning strategies and their trade-offs?",
      tag: "API versioning",
      answer: [
        "1. URI prefix (`/v1/users`): visible in logs, curl, and gateways; easy to route two versions simultaneously. URLs diverge on major bumps — clients must update base paths.",
        "2. Accept header (`Accept: application/vnd.co+json; version=2`): clean paths; version is metadata. Clients forget to send it; hard to test in a browser; CDN caching must `Vary: Accept`.",
        "3. Query param (`?api-version=2`): quick to prototype. Mixes with real filter params; cache keys must Vary correctly or clients receive wrong data.",
      ].join("\n\n"),
      callout: "URI versioning is the most pragmatic default for a first API.",
    },
    {
      question:
        "How should nested resource URLs be designed, and is there a practical depth limit?",
      tag: "Nested resources",
      answer: [
        "Nesting expresses ownership: `GET /users/42/posts` returns posts belonging to user 42. Typical operations: `GET`/`POST` on the collection, `GET`/`PUT`/`PATCH`/`DELETE` on the child singleton.",
        "A common rule: keep path nesting to two levels (`/a/:id/b/:id`). Deep trees (`/a/1/b/2/c/3/d/4`) are hard to read, route, and document. For looser associations, use a query param (`/posts?user_id=42`) or embed related resource links in the response body.",
        "Avoid nesting just to namespace: `/api/v1/users/42/settings` is fine; `/api/v1/org/1/team/2/project/3/task/4` is too deep — flatten or create top-level resources for intermediate entities.",
      ].join("\n\n"),
      callout:
        "Two levels deep max. Flatten with a query param for loose relations.",
    },
    {
      question: "How do `ETag`s and `If-None-Match` enable conditional `GET`?",
      tag: "Conditional GET / ETags",
      answer: [
        'The server returns `ETag: "abc123"` on a GET response. The client stores the ETag. On the next request for the same resource it sends `If-None-Match: "abc123"`.',
        "If the resource has not changed, the server replies `304 Not Modified` with no body — saving bandwidth and server-side serialisation work. If it changed, the server returns `200` with the new body and a new ETag.",
        "`Last-Modified` / `If-Modified-Since` is an older date-based alternative; ETags are preferred because they survive content changes that do not change the modification timestamp.",
      ].join("\n\n"),
      callout:
        "ETag + If-None-Match → 304 = zero bytes transferred for unchanged resources.",
    },
  ],
  bullets: [
    "Implement the blog routes; hit each with `curl` and verify the status code + Location header on POST.",
    "Add a test that asserts `401` vs `403` on the same route with two different fixtures.",
    "Before Day 2, explain `PUT` vs `POST` idempotency and TCP vs QUIC HoL in one minute each.",
  ],
} satisfies RoadmapDayDetail;
