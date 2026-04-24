import type { RoadmapDayDetail } from "./challenge-data";

export const DAY_1_DETAIL = {
  overview: [
    "Use the tables and figures as a cheat sheet, then skim the fenced samples (scroll horizontally if needed). Inline paths and verbs like `GET /posts` render like GitHub when wrapped in backticks.",
    "Finish with the blog API lab (`/api/v1/posts` …) and the self-check questions at the bottom.",
  ],
  sections: [
    {
      title: "HTTP versions — what changed (with diagrams)",
      blocks: [
        {
          type: "paragraph",
          text: "Same request/response semantics across versions; the transport underneath changes latency, multiplexing, and how packet loss hurts you. Compare `HTTP/1.1` vs `HTTP/2` vs `HTTP/3` using the table below.",
        },
        { type: "diagram", id: "http11-sequential" },
        { type: "diagram", id: "http2-multiplex" },
        { type: "diagram", id: "http3-quic" },
        {
          type: "table",
          caption: "Compact comparison — memorize the transport column for interviews.",
          headers: ["Version", "Year", "Wire", "Multiplex", "HoL / loss behavior"],
          rows: [
            ["HTTP/1.1", "1997", "TCP, mostly textual", "One request at a time per connection (pipelining rare)", "Slow response blocks the queue on that connection"],
            ["HTTP/2", "2015", "TCP, binary frames + HPACK", "Many streams on one connection", "TCP still has a single ordered byte stream—loss can stall all streams"],
            ["HTTP/3", "2022", "QUIC on UDP + TLS 1.3", "Independent streams", "Loss tends to affect only the stalled stream; faster handshake (0-RTT optional)"],
          ],
        },
        {
          type: "list",
          variant: "number",
          items: [
            "Heavy page + 40 assets: `HTTP/1.1` often spawns many TCP connections to parallelize.",
            "`HTTP/2` multiplexes those requests on one TCP connection (watch stream counts in DevTools).",
            "`HTTP/3` / QUIC reduces some stalls when packets drop on noisy Wi‑Fi.",
          ],
        },
      ],
    },
    {
      title: "HTTP methods — table + when to use each",
      blocks: [
        {
          type: "table",
          caption: "✅ = yes, ❌ = no (typical defaults; always document PATCH semantics).",
          headers: ["Method", "Purpose", "Body?", "Idempotent?", "Safe?"],
          rows: [
            ["GET", "Read resource/collection", "No", "✅", "✅"],
            ["HEAD", "Like GET, headers only", "No", "✅", "✅"],
            ["POST", "Create or non-idempotent action", "Usually yes", "❌", "❌"],
            ["PUT", "Replace full resource at URI", "Yes", "✅", "❌"],
            ["PATCH", "Partial update", "Yes", "Design-dependent", "❌"],
            ["DELETE", "Delete resource", "Optional", "✅", "❌"],
            ["OPTIONS", "Capabilities / CORS preflight", "Optional", "✅", "✅"],
          ],
        },
        {
          type: "paragraph",
          text: "Idempotent: 10 identical calls == 1 call for server state. Safe: must not change persisted state (`GET`, `HEAD`, `OPTIONS`).",
        },
        {
          type: "code",
          title: "Idempotency in one line each",
          code: [
            "# Idempotent: same PUT twice converges",
            'PUT /users/1  {"name":"Ada"}',
            'PUT /users/1  {"name":"Ada"}   # same final row',
            "",
            "# Not idempotent: each POST may insert a new row",
            "POST /users  {\"name\":\"Grace\"}",
            "POST /users  {\"name\":\"Grace\"}   # two users unless you use idempotency-Key",
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
            ["201", "Created", "Resource born; send Location + body (or doc what you return)"],
            ["204", "No Content", "Success with no body (common after DELETE)"],
            ["400", "Bad Request", "Malformed JSON, failed validation"],
            ["401", "Unauthorized", "No / invalid credentials"],
            ["403", "Forbidden", "Known user, disallowed on this resource"],
            ["404", "Not Found", "Unknown id in path"],
            ["409", "Conflict", "Version clash, duplicate unique key"],
            ["429", "Too Many Requests", "Rate limit; add Retry-After when you can"],
            ["500", "Server Error", "Unexpected bug—log with request id"],
          ],
        },
        { type: "diagram", id: "status-401-403" },
        {
          type: "code",
          title: "Example JSON error (consistent shape across endpoints)",
          code: [
            "HTTP/1.1 403 Forbidden",
            "Content-Type: application/problem+json",
            "",
            "{",
            '  "type": "https://api.example.com/errors/forbidden",',
            '  "title": "Forbidden",',
            '  "detail": "Role author cannot delete posts owned by another user."',
            "}",
          ].join("\n"),
        },
      ],
    },
    {
      title: "REST — six constraints (table) + request/response mental model",
      blocks: [
        {
          type: "paragraph",
          text: "REST is an architectural style: constraints that make HTTP APIs predictable at scale.",
        },
        {
          type: "table",
          headers: ["#", "Constraint", "Practical takeaway"],
          rows: [
            ["1", "Stateless", "JWT/API key/session id travels every request; avoid hidden server-only session state for correctness."],
            ["2", "Client–server", "Mobile/web clients ship independently from your persistence layer."],
            ["3", "Cacheable", "Set Cache-Control / ETag / Last-Modified honestly so CDNs behave."],
            ["4", "Uniform interface", "Resources + representations; consistent URLs and error shapes."],
            ["5", "Layered system", "Clients may hit CDN → API gateway → service mesh without knowing."],
            ["6", "Code on demand (optional)", "Rare in JSON APIs; more common as separate front-end bundles."],
          ],
        },
        { type: "diagram", id: "request-response" },
        {
          type: "list",
          variant: "number",
          items: [
            "Expose stable `self` links (`\"links\": { \"self\": \"/posts/7\" }`).",
            "Add `next` / `prev` for pagination cursors when you page collections.",
            "Document whatever subset of HATEOAS you support—clients should not guess.",
          ],
        },
      ],
    },
    {
      title: "Resource URLs — bad vs good (examples)",
      blocks: [
        {
          type: "code",
          title: "RPC-style (avoid for public REST surfaces)",
          code: ["GET  /getUser?id=42", "POST /createPost", "POST /deleteComment?id=5"].join("\n"),
        },
        {
          type: "code",
          title: "REST-style (nouns + HTTP verbs)",
          code: [
            "GET    /users/42",
            "POST   /posts",
            "DELETE /comments/5",
            "",
            "# Nested ownership",
            "GET    /users/42/posts",
            "POST   /users/42/posts",
            "GET    /users/42/posts/7",
            "DELETE /users/42/posts/7",
            "",
            "# Filters / pagination (query string, not new verbs)",
            "GET /posts?status=published&sort=created_at&page=2&limit=20",
          ].join("\n"),
        },
        {
          type: "table",
          caption: "Plural collections; keep nesting shallow (usually ≤ 2 levels).",
          headers: ["Pattern", "Example", "Why"],
          rows: [
            ["Collection", "GET /posts", "Many posts"],
            ["Singleton", "GET /posts/7", "One post by id"],
            ["Scoped collection", "GET /users/42/posts", "Posts belonging to user 42"],
            ["Scoped singleton", "GET /users/42/posts/7", "One post in that scope"],
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
            ["URI", "/api/v1/posts", "Easy logs, curl, routing", "URLs churn when majors bump"],
            ["Accept header", "Accept: application/vnd.co.post+json;v=2", "Clean paths", "Clients forget; harder to try in browser"],
            ["Query param", "/posts?api-version=2", "Quick to prototype", "Collides with real filters; cache keys must vary"],
          ],
        },
        {
          type: "code",
          title: "URI version (most common first API)",
          code: ["GET https://api.example.com/v1/posts", "GET https://api.example.com/v2/posts"].join("\n"),
        },
        {
          type: "code",
          title: "Header version (vendor media type)",
          code: [
            "GET /posts/7 HTTP/1.1",
            "Host: api.example.com",
            "Accept: application/vnd.example.post+json; version=2",
          ].join("\n"),
        },
      ],
    },
    {
      title: "Headers — request vs response cheat sheet",
      blocks: [
        {
          type: "table",
          headers: ["Header", "Direction", "Typical use"],
          rows: [
            ["Authorization", "Request", "Bearer token, Basic, etc."],
            ["Content-Type", "Both", "application/json; charset=utf-8"],
            ["Accept", "Request", "Preferred representation / vendor version"],
            ["If-None-Match", "Request", "Send ETag from last GET → maybe 304"],
            ["Cache-Control", "Response", "public / private / max-age directives"],
            ["ETag / Last-Modified", "Response", "Validators for caching"],
            ["Location", "Response", "URI of created resource (201) or redirect target"],
            ["Retry-After", "Response", "Seconds until retry (429/503)"],
            ["X-Request-ID / traceparent", "Request", "Propagate tracing across services"],
          ],
        },
        {
          type: "code",
          title: "Conditional GET (save bandwidth)",
          code: [
            "# 1) Read ETag from response headers",
            "curl -sI https://api.example.com/posts/1 | grep -i etag",
            "",
            "# 2) Send it back — expect 304 if the representation is unchanged",
            "curl -s -o /dev/null -w \"%{http_code}\\n\" \\",
            '  -H "If-None-Match: <paste-etag-from-step-1>" \\',
            "  https://api.example.com/posts/1",
          ].join("\n"),
        },
      ],
    },
    {
      title: "Lab — minimal blog API (copy into your framework)",
      blocks: [
        {
          type: "code",
          title: "Routes + expected status codes",
          code: [
            "GET    /api/v1/posts              → 200 + array",
            "POST   /api/v1/posts              → 201 + Location: /api/v1/posts/{id}",
            "GET    /api/v1/posts/:id          → 200 body or 404",
            "PUT    /api/v1/posts/:id          → 200 or 404",
            "PATCH  /api/v1/posts/:id          → 200 or 404",
            "DELETE /api/v1/posts/:id          → 204 or 404",
            "GET    /api/v1/posts?tag=backend  → 200 filtered list",
          ].join("\n"),
        },
        {
          type: "list",
          variant: "number",
          items: [
            "Paths are nouns (`/posts`, `/posts/7`); verbs live in `GET`/`POST`/… .",
            "Return honest 2xx/4xx; a second `DELETE /posts/7` should yield `404` (gone) to show delete idempotency.",
            "Every JSON response sets `Content-Type: application/json` (plus `charset` if you document it).",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is head-of-line blocking, and how do `HTTP/2` and `HTTP/3` address it?",
      answer:
        "In `HTTP/1.1`, responses (and often requests) queue on a connection: a slow first response delays everything behind it.\n\n`HTTP/2` multiplexes streams over one TCP connection, improving parallelism, but TCP still delivers one ordered byte stream—packet loss can stall all streams.\n\n`HTTP/3` uses QUIC over UDP so streams have independent loss recovery; one stream stalling does not always block unrelated streams.",
    },
    {
      question: "Why is `HTTP/2` still affected by head-of-line blocking if it multiplexes streams?",
      answer:
        "Multiplexing fixes application-level ordering issues from `HTTP/1` pipelining, but TCP reassembly is global: a gap in the byte stream blocks delivery of later bytes to the stack until the gap is filled.\n\nQUIC moves reliability per stream, so that coupling is weaker and unrelated streams are less likely to block each other after packet loss.",
    },
    {
      question: "What is head-of-line blocking, and which HTTP version solves it completely, if any?",
      answer:
        "No version removes all queuing in every case—your app, disk, and single stream work can still stall.\n\n`HTTP/3` over QUIC gets closest for transport issues: it avoids TCP’s single shared byte stream so packet loss is handled more per stream than in `HTTP/2` on TCP.\n\n`HTTP/2` already fixes `HTTP/1`-style request “convoys” on one connection, but TCP loss can still stall all streams until retransmit.",
    },
    {
      question: "What does “idempotent” mean, and which HTTP methods are idempotent?",
      answer:
        "Idempotent = calling a request many times has the same effect on server state as doing it once (ignoring things like `Date` in logs).\n\nBy convention, idempotent: `GET`, `HEAD`, `OPTIONS`, `PUT`, `DELETE` (with stable semantics; `PUT` same body → same end state, `DELETE` on missing id often `404`).\n\n`POST` and `PATCH` are not idempotent by default (`POST` may create many rows; `PATCH` can be, if you design it to be).",
    },
    {
      question: "Which methods are “safe,” and why is `POST` usually not idempotent?",
      answer:
        "Safe: `GET`, `HEAD`, `OPTIONS` (must not change persistent state).\n\n`POST` models create or a non-repeatable action unless you add `Idempotency-Key` (or server-side dedupe) so clients can safely retry without duplicating side effects.",
    },
    {
      question: "What is the difference between `PUT` and `PATCH`?",
      answer:
        "`PUT` = replace the entire resource at a known URI. Client sends a full document; `PUT` twice with the same body should converge to the same stored state (idempotent).\n\n`PATCH` = partial update. You may send just changed fields. Semantics and idempotency differ by your schema (JSON Merge Patch vs JSON Patch, etc.)—document that in your API.",
    },
    {
      question: "When should I use `PUT` vs `POST` for writes?",
      answer:
        "`POST` to collections when the server names the new id (`/posts` → `201` + `Location`), or to trigger actions that are not a simple full replacement.\n\n`PUT` when the client owns the full URI and sends a full replacement; repeated `PUT` with the same body should be idempotent.",
    },
    {
      question: "What is the difference between `401 Unauthorized` and `403 Forbidden`?",
      answer:
        "`401`: we don’t know (or no longer accept) who you are—re-authenticate (bad/missing `Authorization`, expired token).\n\n`403`: we know who you are, but you’re not allowed this operation on this resource (authz, role, resource policy).",
    },
    {
      question: "What does “stateless” mean in REST, and why does it matter?",
      answer:
        "The server should not rely on hidden session state just for a request to be processable. Each request should carry what it needs (e.g. `Authorization`, ids in the path), so you can scale behind load balancers and retry safely.\n\n(You can still have storage—stateless here means the server’s handling of a single request doesn’t depend on prior requests’ hidden server memory.)",
    },
    {
      question: "What status code should a successful `POST` that creates a resource return, and which header is expected?",
      answer:
        "Use `201 Created` and a `Location` header with the new resource’s URL (`Location: /api/v1/posts/42` or absolute). Often return a body with the created representation.\n\n`Content-Type: application/json` (plus charset in docs) when the body is JSON.",
    },
    {
      question: "List the six REST constraints in one line each.",
      answer:
        "1. Stateless — 2. Client–server — 3. Cacheable — 4. Uniform interface (resources, representations, self-descriptive messages, optional hypermedia) — 5. Layered system — 6. Code on demand (optional).\n\nIn one sentence each: no hidden session state; separate UI from storage; responses say if cacheable; consistent contract; clients may be behind proxies/CDNs; optional executable extensions.",
    },
    {
      question: "What is HATEOAS, and do most JSON APIs implement it fully?",
      answer:
        "HATEOAS means responses embed links or forms so clients discover next steps instead of hard-coding every URL.\n\nMany production JSON APIs ship a partial version: pagination `next` links, related resource URLs—full hypermedia is less common than CRUD+OpenAPI.",
    },
    {
      question: "Why is `POST /deleteUser` or `POST /deleteUser?id=...` not RESTful? How should it be designed?",
      answer:
        "The path encodes a verb (`deleteUser`) and hides the real operation; HTTP already has a verb: use `DELETE` on a noun resource like `/users/42`.\n\n`DELETE /users/42` is idempotent (second delete: `204` or `404` “gone”).\n\nIf you need a soft delete, that’s still usually `DELETE` or a state change via `PATCH /users/42` with a body, not a fake RPC route.",
    },
    {
      question: "Why prefer noun-based URLs over verb-based RPC paths?",
      answer:
        "Nouns identify resources; HTTP methods are the verbs (`GET`, `POST`, …). That lines up with caching, authz rules, and support logs: `GET /posts/7` is obviously a read.\n\nPaths like `GET /getUser` or `POST /createPost` duplicate what `GET`/`POST` already say.",
    },
    {
      question: "What are the three main API versioning strategies and their trade-offs?",
      answer:
        "1) URI — `/v1/users`. Easy in logs, `curl`, and gateways; URLs diverge per major version.\n2) Header — e.g. `Accept: application/vnd…+json; version=1`. Clean URLs; clients and browsers omit it by mistake; harder to support.\n3) Query — `?version=1` or `api-version=1`. Simple; mixes with real query params; caching must `Vary` correctly or you serve wrong data.",
    },
    {
      question: "What is the right way to design nested resource URLs, and is there a practical limit?",
      answer:
        "Nesting reflects ownership and containment: `/users/42/posts`, `/users/42/posts/7` (posts scoped to a user), often `GET/POST` on the collection, `GET/PUT/PATCH/DELETE` on the child.\n\nA common rule: about two levels in the path (`/a/:id/b/:id`) and avoid deep trees (`/a/1/b/2/c/3/...`); for looser relations use a query (`/posts?user_id=42`) or links in JSON.\n\nAlternatives: `POST` with a body, or a top-level resource with a foreign key.",
    },
    {
      question: "How do `ETag`s and `If-None-Match` help with conditional `GET`?",
      answer:
        "The server can return `ETag: \"...\"` on a response. A later `GET` sends `If-None-Match: \"...\"` so the server may reply `304 Not Modified` with an empty body when nothing changed—saves bandwidth and CPU for large payloads.",
    },
  ],
  bullets: [
    "Implement the blog routes in your stack; hit each with `curl` or Bruno and screenshot status + headers.",
    "Add one automated test that asserts `401` vs `403` on the same route with different fixtures.",
    "Before Day 2, explain `PUT` vs `POST` idempotency and TCP vs QUIC HoL in one minute each.",
  ],
} satisfies RoadmapDayDetail;
