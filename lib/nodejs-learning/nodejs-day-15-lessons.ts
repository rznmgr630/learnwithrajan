import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_15_LESSONS: LessonDay = {
  day: 15,
  title: "Picking a framework and Fastify basics",
  totalMinutes: 104,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "framework-landscape",
      title: "The framework landscape",
      durationMinutes: 11,
      explanation:
        "Day 10 built an HTTP server with `node:http` and nothing else. That was the right way to learn how HTTP works. It is not the way to build an application, because you end up rewriting routing, validation, plugin loading, hooks, error handling and project structure by hand, badly.\n\n```text\nRaw node:http\n     ↓\nUnderstand HTTP\n\nFramework\n     ↓\nBuild applications\n```\n\nLearn the raw layer first. Use the framework so you do not rebuild it.\n\n---\n\n## Framework\n\n<b>Framework</b> (a library that provides the structure of an application, so your code fills in the parts that are specific to your problem).\n\n> The word doing the work is <b>structure</b>. A library is something you call. A framework is something that calls you: it owns the request lifecycle and hands control to your handler at a fixed point. That inversion is the whole trade, and it is why switching frameworks is expensive while switching a date library is not.\n\nIn 2026 you will commonly meet five:\n\n```text\nExpress    simple, mature HTTP framework   → existing apps, huge ecosystem\nFastify    fast, schema-first, plugins     → Node.js APIs\nHono       Web Standards                   → multi-runtime apps\nNestJS     opinionated architecture + DI   → large teams, structured apps\nElysia     TypeScript-first, fast          → Bun-focused apps\n```\n\nThey solve similar problems with different philosophies.\n\n---\n\n## How not to choose\n\nDo not choose because:\n\n```text\n\"X is fastest.\"\n```\n\nChoose on:\n\n```text\nTeam\nEcosystem\nArchitecture\nRuntime\nPerformance\nDeveloper experience\n```\n\nPerformance is on that list, fifth. Nearly every real API is bound by its database, not its router. Day 17 will show you a single N+1 query that costs more than the entire framework difference.\n\n---\n\n## Express\n\n<b>Express</b> (a minimal and widely used Node.js web framework).\n\n> The honest summary is <b>minimal</b>. Express gives you routing and middleware and stops. Everything else, validation, structure, plugin boundaries, is a convention you and your team invent. That is a strength on a small service and a liability on a large one.\n\nExpress 5 fixed the most annoying thing about Express 4:\n\n```text\nasync route handler\n      ↓\nthrows / rejects\n      ↓\nExpress 5 forwards the error\n```\n\nVerified on Express 5.2.1: an `async` handler that throws returns <b>500</b>. On Express 4 the same handler left the request hanging until it timed out, which is why every Express 4 codebase grew its own `asyncHandler` wrapper.\n\n---\n\n## Express today\n\nExpress is still extremely important. You will meet it in existing companies, older services, tutorials, npm packages and legacy systems. Knowing it is not optional.\n\nBut for a <b>new</b> Node backend, this track uses Fastify.\n\n> Do not confuse \"widely used\" with \"best choice for every new project.\" Those are different claims, and the first one is about history.\n\n---\n\n## Fastify\n\n<b>Fastify</b> (a Node.js web framework focused on performance, schemas, plugins and structured application design).\n\n> The part that actually changes how you write code is not performance, it is <b>schemas and plugins</b>. Fastify has an opinion about where validation lives and where a module's boundary is. Express does not. That opinion is the reason this track picks it.\n\n```text\nnode:http\n   ↓\nFastify\n   ↓\nYour application\n```\n\nWhat you get instead of building it: routing, validation, serialization, plugins, hooks, error handling, logging, encapsulation.",
      diagram: `Why a framework at all

    Day 10 taught you node:http, on purpose.

    node:http  ──►  understand HTTP
    framework  ──►  build applications

    without one you rewrite, by hand and badly:
      routing · validation · plugin loading
      hooks · error handling · structure


Library vs framework

    library     you call IT
    framework   it calls YOU
                  └─ it owns the request lifecycle
                     and hands control to your
                     handler at a fixed point

    that inversion is why swapping frameworks is
    expensive and swapping a date library is not.


The five you will meet

    Express   minimal, mature      existing apps
    Fastify   schema-first         Node APIs
    Hono      Web Standards        multi-runtime
    NestJS    opinionated + DI     large teams
    Elysia    TypeScript-first     Bun


How NOT to choose

    ✗  "X is fastest"

    ✓  team · ecosystem · architecture
       runtime · performance · DX

    performance is on the list. it is FIFTH.
    almost every real API is bound by its
    database, not its router.  (Day 17)


Express 4 vs Express 5

    async handler throws
        │
        ├─ Express 4  request HANGS until timeout
        │              └─ hence everyone's own
        │                 asyncHandler wrapper
        │
        └─ Express 5  forwards it  →  500
                       (verified, 5.2.1)


Why THIS track picks Fastify

    not speed. speed is a bonus.

    Fastify has an OPINION about
      · where validation lives
      · where a module's boundary is

    Express has neither. that opinion is
    the whole reason.`,
      codeExample: {
        title: "The same route in three styles",
        code: `// ── Raw node:http, from Day 10 ──────────────────────────────
import { createServer } from "node:http";

createServer((req, res) => {
  if (req.method === "GET" && req.url === "/users") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify([{ id: 1, name: "Rajan" }]));
    return;
  }
  res.writeHead(404).end();
}).listen(3000);
//
// You are the router. You are the serializer. You are the
// 404 handler. Add twenty routes and you have written a
// framework, without meaning to.


// ── Express 5 ───────────────────────────────────────────────
import express from "express";

const app = express();

app.get("/users", async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

app.listen(3000);
//
// Verified on express 5.2.1: if getUsers() rejects, Express 5
// forwards it to the error handler and answers 500.
//
// On Express 4 that same request hung until it timed out.
// That single change is why Express 5 mattered.


// ── Fastify ─────────────────────────────────────────────────
import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/users", async () => {
  return getUsers();
});

await app.listen({ port: 3000 });
//
// Note what is missing: no res, no res.json, no manual
// serialization. Return a value and Fastify serializes it.
//
// And logger: true is not decoration. It gives you one
// structured log line per request, with a request id, which
// is the thing you will actually want at 3am.


// ── The choice, stated honestly ─────────────────────────────
//
//   "Which is fastest?"      is the wrong first question.
//
//   Ask instead:
//     Who maintains this in a year?
//     What does the team already know?
//     Does it need to run anywhere but Node?
//     How much structure does this codebase need?
//
// Day 17 will show you one N+1 query that costs more than
// every framework benchmark difference combined.`,
      },
      keyTakeaways: [
        "A library is something you call; a framework is something that calls you. It owns the request lifecycle and hands control to your handler at a fixed point.",
        "Express 5 forwards a rejected `async` handler to the error handler. Verified: 500 on Express 5.2.1. Express 4 left the request hanging, which is why every Express 4 codebase had an `asyncHandler` wrapper.",
        "Express is minimal by design. Validation, structure and module boundaries are conventions you invent. That is fine small and expensive large.",
        "This track picks Fastify for its opinions about schemas and plugin boundaries, not for its benchmark numbers.",
        "Performance is the fifth thing to choose on, not the first. Real APIs are bound by the database.",
        "\"Widely used\" and \"best for a new project\" are different claims. The first one is about history.",
      ],
      commonMistakes: [
        "Choosing a framework from a benchmark chart. The benchmark measures an empty route; your route talks to a database.",
        "Assuming Express 4 handles async errors. It does not. If you are on Express 4, you still need the wrapper.",
        "Believing a framework is a substitute for understanding HTTP. Day 10 exists so that when a framework does something strange you can tell what layer it happened at.",
        "Reaching for NestJS on a three-route service because it is \"more professional\". Its dependency injection pays for itself on a large team and costs you on a small one.",
        "Dismissing Express because it is old. Most Node code you will ever be paid to touch is Express.",
      ],
      quiz: [
        {
          question: "What is the actual difference between a library and a framework?",
          options: [
            "Frameworks are bigger",
            "A library is something you call; a framework calls you, because it owns the request lifecycle",
            "Frameworks are always slower",
            "Libraries cannot be async",
          ],
          correctIndex: 1,
          explanation:
            "That inversion of control is why replacing a framework is expensive and replacing a date library is not.",
        },
        {
          question: "An `async` route handler throws. What happened on Express 4, and what happens on Express 5?",
          options: [
            "Both answer 500",
            "Express 4 left the request hanging; Express 5 forwards it and answers 500",
            "Both crash the process",
            "Express 5 hangs, Express 4 answered 500",
          ],
          correctIndex: 1,
          explanation:
            "Verified as 500 on Express 5.2.1. The Express 4 behaviour is why `asyncHandler` wrappers were everywhere.",
        },
        {
          question: "Why does this track pick Fastify?",
          options: [
            "It is the fastest framework",
            "For its opinions about where validation lives and where a plugin's boundary is",
            "Express is deprecated",
            "It is the only one with TypeScript support",
          ],
          correctIndex: 1,
          explanation:
            "Speed is a bonus. The schemas and the plugin boundaries are what change how you write the code.",
        },
        {
          question: "Where does raw `node:http` still belong after today?",
          options: [
            "Nowhere, frameworks replace it",
            "As the layer you understand, so you can tell which layer a strange behaviour came from",
            "Only in tests",
            "Only for WebSockets",
          ],
          correctIndex: 1,
          explanation:
            "Fastify sits on `node:http`. Day 10 is what lets you debug the seam between them.",
        },
      ],
    },
    {
      id: "first-fastify-app",
      title: "Your first Fastify app",
      durationMinutes: 11,
      explanation:
        "Install it:\n\n```bash\nnpm install fastify\n```\n\nThen the smallest useful server:\n\n```javascript\nimport Fastify from \"fastify\";\n\nconst app = Fastify({ logger: true });\n\napp.get(\"/\", async () => {\n  return { message: \"Hello World\" };\n});\n\nawait app.listen({ port: 3000 });\n```\n\nRun it with Day 1's watch flag:\n\n```bash\nnode --watch server.js\n```\n\nVisit `http://localhost:3000` and you get `{\"message\":\"Hello World\"}`. Notice you never wrote `JSON.stringify`, never set a content type, and never touched a response object. Returning a value was enough.\n\n---\n\n## The Fastify instance\n\n<b>Fastify instance</b> (the main application object that owns your server, routes, plugins, hooks, decorators and configuration).\n\n> The important word is <b>owns</b>. Almost everything in Fastify hangs off this object, which is why the next three lessons are really about one question: what is visible on which instance? Fastify creates child instances for plugins, and forgetting that is the single most common Fastify bug.\n\n```text\napp\n│\n├── routes\n├── hooks\n├── plugins\n├── decorators\n├── logger\n└── server\n```\n\n---\n\n## `listen()`\n\n<b>`listen()`</b> (starts the HTTP server and begins accepting connections).\n\n> It returns a promise that <b>rejects</b> on failure, and that matters more than it looks. Verified: a second server on a taken port rejects with `EADDRINUSE`. With a bare top-level `await app.listen(...)` that becomes an unhandled rejection and Day 4's exit code 1, with no log line explaining why.\n\nSo the real form is:\n\n```javascript\ntry {\n  await app.listen({ port: 3000 });\n} catch (err) {\n  app.log.error(err);\n  process.exit(1);\n}\n```\n\nThat is not ceremony. It is the difference between a readable startup failure and a silent one.\n\n---\n\n## The host, and why containers break\n\n```javascript\nawait app.listen({ port: 3000, host: \"0.0.0.0\" });\n```\n\nVerified: with no `host`, Fastify binds to <b>127.0.0.1</b>.\n\nThat default is right for local development and wrong inside a container. A process bound to `127.0.0.1` is only reachable from inside its own network namespace, so `docker run -p 3000:3000` maps the port successfully and every request still fails to connect. Nothing errors. It just does not work.\n\n```text\nLocal dev     →  127.0.0.1  (default, safe)\nContainer     →  0.0.0.0    (required, or nothing reaches you)\n```\n\n> This is the same lesson as Day 14's inspector, in reverse. There the localhost default was protecting you; here it is in your way. Both times the fix starts with knowing what the default actually is.\n\n---\n\n## Routes\n\nA route joins three things:\n\n```text\nHTTP method  +  URL  +  handler\n```\n\n```javascript\napp.get(\"/users\", async () => {\n  return [{ id: 1, name: \"Rajan\" }];\n});\n```\n\nAnd the methods you would expect:\n\n```javascript\napp.get(...)\napp.post(...)\napp.put(...)\napp.patch(...)\napp.delete(...)\n```\n\nOne rule to remember from Day 10: routes must be registered <b>before</b> the server starts listening. Verified, Fastify throws `FST_ERR_INSTANCE_ALREADY_LISTENING` if you add one afterwards. That is deliberate, because the router is compiled once at startup rather than matched string by string per request.",
      diagram: `The smallest server that does something

    import Fastify from "fastify";
    const app = Fastify({ logger: true });
    app.get("/", async () => ({ message: "Hello" }));
    await app.listen({ port: 3000 });

    what you did NOT write:
      JSON.stringify · content-type header
      a response object

    returning a value was enough.


The instance owns everything

    app
    ├── routes        ├── decorators
    ├── hooks         ├── logger
    ├── plugins       └── server

    so the next three lessons all answer ONE
    question:  what is visible on WHICH instance?

    Fastify makes CHILD instances for plugins.
    forgetting that is the #1 Fastify bug.


listen() rejects, and you must catch it

    verified: second server on a taken port
              →  EADDRINUSE

    await app.listen({ port: 3000 });     ✗
        └─ unhandled rejection, exit 1,
           no log line saying why  (Day 4)

    try { await app.listen({ port: 3000 }); }
    catch (err) { app.log.error(err);
                  process.exit(1); }        ✓


The host default that breaks containers

    verified: no host  →  binds 127.0.0.1

    local dev    127.0.0.1   default, safe
    container    0.0.0.0     required

    bound to 127.0.0.1 inside a container:
      docker run -p 3000:3000  maps fine
      every request still fails to connect
      NOTHING errors. it just does not work.

    same lesson as Day 14's inspector, inverted.
    there the default protected you. here it is
    in your way. both times: know the default.


Routes are compiled at startup

    method + URL + handler

    add a route after listen()
        └─ FST_ERR_INSTANCE_ALREADY_LISTENING
           (verified)

    deliberate: the router compiles ONCE,
    instead of matching strings per request.`,
      codeExample: {
        title: "server.js, written the way you would actually ship it",
        code: `import Fastify from "fastify";

const app = Fastify({
  logger: true,          // one structured line per request, with a request id
});

app.get("/", async () => {
  return { message: "Hello World" };
});

app.get("/health", async () => {
  return { status: "ok", uptime: process.uptime() };
});


// ── The startup you should copy ─────────────────────────────
// Verified: listen() REJECTS on failure. A bare top-level
// await turns that into an unhandled rejection and Day 4's
// exit code 1, with nothing in the log explaining it.
//
try {
  await app.listen({
    port: Number(process.env.PORT ?? 3000),
    host: process.env.HOST ?? "127.0.0.1",
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}


// ── What the failure looks like, unguarded ──────────────────
// $ node server.js            # while another one is running
//
// node:internal/process/promises:...
//   [UnhandledPromiseRejection: ... EADDRINUSE ...]
//
// vs guarded:
//
// {"level":50,"msg":"listen EADDRINUSE: address already in
//  use 127.0.0.1:3000"}


// ── The container trap, verified ────────────────────────────
// No host given  ->  Fastify binds 127.0.0.1
//
//   Dockerfile:  CMD ["node", "server.js"]
//   docker run -p 3000:3000 myapp
//
//   curl localhost:3000  ->  connection reset
//
// The port mapping worked. The process is listening. It is
// just listening somewhere nothing outside the container can
// reach. Set host: "0.0.0.0" in a container.


// ── Routes must exist before listen() ───────────────────────
// await app.listen({ port: 3000 });
// app.get("/late", async () => ({}));
//
//   FastifyError: Fastify instance is already listening.
//   Cannot add route!    [FST_ERR_INSTANCE_ALREADY_LISTENING]
//
// Verified. The router is compiled once at startup, which is
// part of why route matching is cheap per request.`,
      },
      keyTakeaways: [
        "Returning a value from a handler is enough. Fastify serializes it and sets the content type.",
        "`listen()` returns a promise that rejects. Verified `EADDRINUSE`. Wrap it in try/catch with `app.log.error` or a startup failure is silent.",
        "Verified: with no `host`, Fastify binds `127.0.0.1`. Inside a container that means the port maps fine and nothing can reach you. Use `0.0.0.0` there.",
        "Routes must be registered before `listen()`. Verified `FST_ERR_INSTANCE_ALREADY_LISTENING`, because the router compiles once at startup.",
        "`logger: true` gives one structured line per request with a request id. Turn it on from the first day, not after the first incident.",
        "The instance owns routes, hooks, plugins, decorators, logger and server. Everything that follows is about which instance owns what.",
      ],
      commonMistakes: [
        "A bare top-level `await app.listen(...)`. The failure becomes an unhandled rejection with no explanation of what went wrong.",
        "Leaving the host at its default inside a container, then debugging Docker networking for an hour. The process is listening on `127.0.0.1`.",
        "Registering a route inside an async callback that resolves after `listen()`. Fastify throws, and the message is clearer than the bug.",
        "Calling `JSON.stringify` on the return value. Fastify does it, and from Day 16 it does it faster than you can with a schema.",
        "Leaving `logger: false` because the output is noisy in development. Set a transport for pretty printing instead of turning off the only record of production traffic.",
      ],
      quiz: [
        {
          question: "What does Fastify bind to when you pass no `host`?",
          options: ["`0.0.0.0`", "`127.0.0.1`", "Every interface", "It refuses to start"],
          correctIndex: 1,
          explanation:
            "Verified. Right for local dev, wrong in a container, where the port maps successfully and nothing can connect.",
        },
        {
          question: "Why wrap `await app.listen(...)` in try/catch?",
          options: [
            "Style",
            "It rejects on failure, and unguarded that becomes an unhandled rejection with no log line",
            "It never fails, so it is optional",
            "To retry automatically",
          ],
          correctIndex: 1,
          explanation:
            "Verified `EADDRINUSE`. Guarded you get a readable error; unguarded you get Day 4's exit code 1 and no reason.",
        },
        {
          question: "You add a route after calling `listen()`. What happens?",
          options: [
            "It works",
            "Fastify throws `FST_ERR_INSTANCE_ALREADY_LISTENING`",
            "It works after a restart",
            "It returns 404 forever",
          ],
          correctIndex: 1,
          explanation:
            "Verified. The router is compiled once at startup, which is part of why per-request matching is cheap.",
        },
        {
          question: "Your handler returns `{ message: \"hi\" }`. What does the client receive?",
          options: [
            "Nothing, you must call `reply.send`",
            "`{\"message\":\"hi\"}` with a JSON content type, serialized by Fastify",
            "The string `[object Object]`",
            "A 500",
          ],
          correctIndex: 1,
          explanation:
            "Returning a value is the normal path. `reply.send` exists for the cases where returning is not enough.",
        },
      ],
    },
    {
      id: "reading-the-request",
      title: "Reading the request",
      durationMinutes: 12,
      explanation:
        "A handler receives the request as its first argument.\n\n```javascript\napp.get(\"/users/:id\", async (request) => {\n  return { id: request.params.id };\n});\n```\n\nFour places data arrives from: the path, the query string, the body and the headers.\n\n---\n\n## Route parameter\n\n<b>Route parameter</b> (a dynamic value embedded in the URL path).\n\n> The trap is the <b>type</b>. Verified: `GET /users/123` against `/users/:id` gives you the string `\"123\"`, not the number `123`. Every path parameter is a string, always, because a URL is text. So `request.params.id === 123` is `false` and `id + 1` is `\"1231\"`.\n\n```text\n/users/:id\n     ↓\nrequest.params.id  →  \"123\"   (a string)\n```\n\nAnd here is the part most tutorials skip. Give the route a params schema and Fastify <b>coerces</b> it:\n\n```javascript\napp.get(\"/users/:id\", {\n  schema: { params: { type: \"object\", properties: { id: { type: \"integer\" } } } },\n}, async (request) => {\n  return { type: typeof request.params.id };   // \"number\"\n});\n```\n\nVerified: `typeof request.params.id` becomes `\"number\"` and the value is `123`. And `GET /users/abc` never reaches your handler, it answers <b>400</b> with `params/id must be integer`. You get parsing and rejection from one line of schema. Day 16 is entirely about that idea.\n\n---\n\n## Query parameters\n\n```text\n/users?page=2&limit=20\n     ↓\nrequest.query  →  { page: \"2\", limit: \"20\" }\n```\n\nSame rule, same trap: strings. `request.query.page * 10` happens to work through coercion, `request.query.page + 10` gives you `\"210\"`.\n\n---\n\n## Request body\n\n<b>Request body</b> (the payload sent with a request, most often JSON on `POST`, `PUT` and `PATCH`).\n\n> Fastify parses JSON for you when the content type says so, and that <b>only</b> happens for content types it has a parser for. Send `text/plain` containing JSON and `request.body` is a string. Send nothing at all on a POST and it is `undefined`. Reaching straight for `request.body.name` is how you turn a bad request into a 500.\n\n```javascript\napp.post(\"/users\", async (request) => {\n  return { received: request.body };\n});\n```\n\nCompare that to Day 10, where you collected chunks off the stream and called `JSON.parse` in a try/catch yourself. This is the clearest single thing a framework buys you.\n\n---\n\n## Headers\n\n```javascript\nrequest.headers[\"x-api-key\"];\nrequest.headers[\"content-type\"];\n```\n\nLower-cased, exactly as Day 10 established, because Node normalizes them.\n\n---\n\n## What else is on the request\n\nTwo worth knowing now:\n\n```text\nrequest.id   the request id, in every log line\nrequest.log  a logger already tagged with that id\n```\n\nUse `request.log.info(...)` rather than `console.log`. Every line then carries the request id, which is the difference between reading a production log and guessing at one.",
      diagram: `Four places data arrives from

    path      request.params
    query     request.query
    body      request.body
    headers   request.headers


The type trap, verified

    GET /users/123   against  /users/:id

    request.params.id  ===  "123"     a STRING
                            not 123

    so:  params.id === 123   is false
         params.id + 1       is "1231"

    every path param is a string. always.
    a URL is text.


The fix most tutorials skip

    schema: { params: { type: "object",
      properties: { id: { type: "integer" } } } }

    verified:
      /users/123  →  typeof id === "number", 123
      /users/abc  →  400, never reaches handler
                     "params/id must be integer"

    parsing AND rejection, from one line.
    Day 16 is entirely about this idea.


Query strings: same rule

    /users?page=2&limit=20
        →  { page: "2", limit: "20" }

    query.page * 10   works  (coercion)
    query.page + 10   is "210"


Body parsing has conditions

    Fastify parses JSON only when the
    content-type says so.

    text/plain holding JSON  →  body is a STRING
    POST with no body        →  body is undefined

    request.body.name straight off
        └─ turns a bad request into a 500

    compare Day 10: collect chunks, JSON.parse in
    a try/catch, by hand. this is the clearest
    thing a framework buys you.


Log with the request, not console

    request.id    the id, in every line
    request.log   a logger already tagged with it

    request.log.info(...)   ✓
    console.log(...)        ✗ untraceable`,
      codeExample: {
        title: "Everything you can read, and the types you actually get",
        code: `import Fastify from "fastify";

const app = Fastify({ logger: true });


// ── Path params are strings. Verified. ──────────────────────
app.get("/users/:id", async (request) => {
  return {
    value: request.params.id,          // "123"
    type: typeof request.params.id,    // "string"
    equalsNumber: request.params.id === 123,   // false
    plusOne: request.params.id + 1,            // "1231"  ← ouch
  };
});


// ── Unless a schema coerces them. Also verified. ────────────
app.get("/posts/:id", {
  schema: {
    params: {
      type: "object",
      properties: { id: { type: "integer" } },
    },
  },
}, async (request) => {
  return {
    value: request.params.id,          // 123
    type: typeof request.params.id,    // "number"
  };
});
//
// GET /posts/123  ->  200  { value: 123, type: "number" }
// GET /posts/abc  ->  400
//   {"statusCode":400,"code":"FST_ERR_VALIDATION",
//    "error":"Bad Request","message":"params/id must be integer"}
//
// The bad request never reached the handler. One line of
// schema did the parsing and the rejecting.


// ── Multiple params, and a wildcard ─────────────────────────
app.get("/users/:userId/posts/:postId", async (request) => {
  const { userId, postId } = request.params;
  return { userId, postId };            // both strings
});

app.get("/files/*", async (request) => {
  return { path: request.params["*"] };   // "a/b/c.txt"
});


// ── Query strings: strings again ────────────────────────────
app.get("/search", async (request) => {
  // GET /search?q=node&page=2
  const { q, page } = request.query;
  return {
    q,                       // "node"
    page,                    // "2"   ← string
    pageTimesTen: page * 10, // 20    ← coerced, works
    pagePlusTen: page + 10,  // "210" ← does not
  };
});


// ── Body: parsed for you, with conditions ───────────────────
app.post("/users", async (request) => {
  // POST with content-type: application/json
  //   { "name": "Rajan", "email": "rajan@example.com" }
  //   ->  request.body is an object
  //
  // content-type: text/plain, same payload
  //   ->  request.body is a STRING
  //
  // no body at all
  //   ->  request.body is undefined
  //
  // So this line is a 500 waiting to happen:
  //   const name = request.body.name;
  //
  // Day 16 replaces the whole problem with a body schema.
  return { received: request.body };
});


// ── Headers, and logging that you can trace ─────────────────
app.get("/whoami", async (request) => {
  request.log.info({ ua: request.headers["user-agent"] }, "whoami");
  //           ^^^ tagged with request.id automatically.
  //               console.log would not be.
  return {
    requestId: request.id,
    apiKey: request.headers["x-api-key"] ?? null,
  };
});

// Compare with Day 10, where reading a body meant:
//
//   let raw = "";
//   req.on("data", (c) => { raw += c; });
//   req.on("end", () => {
//     try { body = JSON.parse(raw); } catch { /* 400 */ }
//   });
//
// including the part where you had to cap raw's length
// yourself so a large upload could not exhaust memory.`,
      },
      keyTakeaways: [
        "Every path and query parameter is a string. Verified: `/users/123` gives `\"123\"`, so `=== 123` is false and `+ 1` concatenates.",
        "A params schema coerces and validates in one step. Verified: `{ type: \"integer\" }` makes `typeof` `\"number\"`, and `/users/abc` answers 400 without reaching your handler.",
        "Fastify parses JSON only for content types it has a parser for. `text/plain` leaves the body a string; a missing body leaves it `undefined`.",
        "`request.body.name` on an unvalidated body is how a 400 becomes a 500.",
        "Headers are lower-cased by Node, the same as Day 10.",
        "Use `request.log` rather than `console.log`. It is already tagged with `request.id`, which is what makes a production log readable.",
      ],
      commonMistakes: [
        "Comparing a path parameter to a number. `request.params.id === 1` is false for `/users/1`.",
        "Adding to a query parameter. `page + 1` gives `\"21\"`, and the bug survives review because it looks like arithmetic.",
        "Assuming `request.body` is always an object. Check the content type, or better, put a schema on the route.",
        "Using `console.log` inside handlers. The line has no request id, so you cannot tie it to anything when it matters.",
        "Writing manual `Number(...)` conversions on every parameter when a params schema does it once, at the boundary, and rejects garbage for free.",
      ],
      quiz: [
        {
          question: "`GET /users/123` hits `/users/:id`. What is `typeof request.params.id`?",
          options: ["`\"number\"`", "`\"string\"`", "`\"object\"`", "`\"undefined\"`"],
          correctIndex: 1,
          explanation:
            "Verified. Every path parameter is a string because a URL is text. `params.id + 1` gives `\"1231\"`.",
        },
        {
          question: "You add `params: { properties: { id: { type: \"integer\" } } }`. What changes?",
          options: [
            "Nothing, schemas only document",
            "`request.params.id` becomes a number, and `/users/abc` answers 400 before the handler runs",
            "It throws at startup",
            "Only the docs change",
          ],
          correctIndex: 1,
          explanation:
            "Both verified. One line of schema gives you parsing and rejection at the boundary.",
        },
        {
          question: "A client POSTs valid JSON with `content-type: text/plain`. What is `request.body`?",
          options: ["A parsed object", "A string", "`undefined`", "A 400 before the handler"],
          correctIndex: 1,
          explanation:
            "Fastify parses only content types it has a parser for. `request.body.name` on that string is `undefined`, not a helpful error.",
        },
        {
          question: "Why prefer `request.log.info(...)` over `console.log(...)`?",
          options: [
            "It is faster",
            "It is already tagged with `request.id`, so the line can be tied to a request",
            "`console.log` is deprecated in Node 24",
            "It writes to a file",
          ],
          correctIndex: 1,
          explanation:
            "Correlating log lines to a single request is most of what makes a production log usable.",
        },
      ],
    },
    {
      id: "reply-and-responses",
      title: "reply, status codes and errors",
      durationMinutes: 11,
      explanation:
        "A handler can take a second argument.\n\n```javascript\napp.get(\"/users\", async (request, reply) => {\n  reply.code(200);\n  return { users: [] };\n});\n```\n\n---\n\n## reply\n\n<b>`reply`</b> (Fastify's response interface, an object used to control the outgoing HTTP response).\n\n> The thing to be clear about is that you usually <b>do not need it</b>. Returning a value already sends a 200 with a JSON body. Reach for `reply` when you need something returning cannot express: a different status code, a header, a redirect, or a non-JSON body.\n\n---\n\n## Status codes\n\n```javascript\nreply.code(201);          // then return the body\n```\n\nor chained:\n\n```javascript\nreturn reply.code(201).send({ message: \"Created\" });\n```\n\nVerified, both work: `reply.code(202)` followed by a plain `return` gives 202, and the chained form gives 201. Pick one style per codebase and stay with it.\n\n---\n\n## The mistake that costs an afternoon\n\nDo not do both:\n\n```javascript\napp.get(\"/double\", async (request, reply) => {\n  reply.send({ a: 1 });\n  return { b: 2 };            // ← silently thrown away\n});\n```\n\nVerified: the client gets `{\"a\":1}`. No warning, no error, no log line. The `return` value is simply discarded because the response was already sent.\n\n> This is worth its own paragraph because of how it fails. An `if` branch that calls `reply.send(...)` and forgets to `return` will keep executing, hit your normal `return` at the bottom, and that second value vanishes. The symptom is a response that is stale or wrong with nothing anywhere saying so. The habit that prevents it: <b>either return values everywhere, or `return reply.send(...)` everywhere</b>. Never mix.\n\n---\n\n## Errors\n\nThrow, and Fastify answers:\n\n```javascript\napp.get(\"/boom\", async () => {\n  throw new Error(\"kaboom\");\n});\n```\n\nVerified response:\n\n```javascript\n{\n  \"statusCode\": 500,\n  \"error\": \"Internal Server Error\",\n  \"message\": \"kaboom\"\n}\n```\n\nLook at that `message` field. <b>Your error's message went to the client.</b>\n\n> That is fine for `\"kaboom\"` and a problem for `\"connect ECONNREFUSED 10.0.1.42:5432\"`, which tells an attacker your database host. Fastify does hide the message for a plain 500 in some configurations, but the safe assumption is that a thrown error's message is public unless you made it otherwise. The fix is an error handler that logs the real error and returns a generic body, which is Day 4's operational-versus-programmer distinction arriving with an HTTP status attached.\n\n```javascript\napp.setErrorHandler((error, request, reply) => {\n  request.log.error(error);\n  if (error.statusCode && error.statusCode < 500) {\n    return reply.code(error.statusCode).send({ error: error.message });\n  }\n  return reply.code(500).send({ error: \"Internal Server Error\" });\n});\n```\n\nClient errors carry their message. Server errors do not.",
      diagram: `You usually do not need reply

    return { users: [] }
        └─ 200 + JSON, done

    reach for reply when returning cannot say it:
      a status code · a header
      a redirect     · a non-JSON body


Two styles, both verified

    reply.code(202); return { ok: 1 };      → 202
    return reply.code(201).send({ ... });   → 201

    pick ONE per codebase. stay with it.


The mistake that costs an afternoon

    reply.send({ a: 1 });
    return { b: 2 };          ← thrown away

    verified: client gets {"a":1}
      no warning. no error. no log line.

    how it actually bites you:
      an if-branch calls reply.send(...)
      forgets to return
      keeps executing
      hits the return at the bottom
      that value VANISHES

    symptom: a stale or wrong response, with
    nothing anywhere saying so.

    the habit:
      return values EVERYWHERE
        or
      return reply.send(...) EVERYWHERE
      never mix.


Thrown errors leak their message

    throw new Error("kaboom")

    verified body:
      { statusCode: 500,
        error: "Internal Server Error",
        message: "kaboom" }      ← went to the CLIENT

    fine for "kaboom".
    not fine for
      "connect ECONNREFUSED 10.0.1.42:5432"
      └─ that is your database host


setErrorHandler, the shape to copy

    log the real error
        │
        ├── statusCode < 500
        │     └─ send error.message   (client's fault,
        │                              they should know)
        │
        └── otherwise
              └─ send "Internal Server Error"
                 and nothing else

    Day 4's operational vs programmer error,
    now with an HTTP status attached.`,
      codeExample: {
        title: "reply, and an error handler that does not leak",
        code: `import Fastify from "fastify";

const app = Fastify({ logger: true });


// ── Returning is the normal path ────────────────────────────
app.get("/users", async () => {
  return { users: [] };                       // 200 + JSON
});


// ── reply when you need a status code ───────────────────────
app.post("/users", async (request, reply) => {
  const user = { id: 1, name: "Rajan" };
  return reply.code(201).header("location", "/users/1").send(user);
});
// Verified: 201, {"id":1,"name":"Rajan"}


// ── Or set the code and return ──────────────────────────────
app.post("/jobs", async (request, reply) => {
  reply.code(202);
  return { accepted: true };
});
// Verified: 202


// ── ✗ Do not do both ────────────────────────────────────────
app.get("/double", async (request, reply) => {
  reply.send({ a: 1 });
  return { b: 2 };
});
// Verified: the client receives {"a":1}.
// The returned { b: 2 } is silently discarded.
//
// Which is fine here, because it is obvious. It is not
// obvious in this shape:
//
//   if (!user) {
//     reply.code(404).send({ error: "Not found" });
//     // ← missing return. execution continues.
//   }
//   return buildUserResponse(user);   // user is null.
//                                     // this may throw,
//                                     // or may quietly do
//                                     // nothing at all.


// ── Errors leak their message. Verified. ────────────────────
app.get("/boom", async () => {
  throw new Error("kaboom");
});
// GET /boom  ->  500
//   {"statusCode":500,"error":"Internal Server Error",
//    "message":"kaboom"}
//
// Now imagine the throw came from your database driver:
//   "connect ECONNREFUSED 10.0.1.42:5432"
// You just told the caller your database host and port.


// ── The error handler that fixes it ─────────────────────────
class NotFoundError extends Error {
  statusCode = 404;
}

app.setErrorHandler((error, request, reply) => {
  // The real error goes to YOUR logs, in full, with the
  // request id attached.
  request.log.error({ err: error }, "request failed");

  // Fastify's own validation errors already carry 400.
  if (error.validation) {
    return reply.code(400).send({
      error: "Bad Request",
      message: error.message,
    });
  }

  // 4xx is the caller's fault. Telling them why is useful.
  if (error.statusCode && error.statusCode < 500) {
    return reply.code(error.statusCode).send({
      error: error.message,
    });
  }

  // 5xx is your fault. The caller learns nothing.
  return reply.code(500).send({
    error: "Internal Server Error",
    requestId: request.id,        // so they can quote it to you
  });
});

app.get("/users/:id", async (request) => {
  const user = null;
  if (!user) throw new NotFoundError("User not found");
  return user;
});
// ->  404  {"error":"User not found"}
//
// This is Day 4, restated: an operational error is expected
// and gets a real status code; a programmer error is a bug
// and gets a generic 500 plus a log entry you can act on.`,
      },
      keyTakeaways: [
        "Returning a value is the normal path. `reply` is for a status code, a header, a redirect or a non-JSON body.",
        "Verified: `reply.code(202)` then `return`, and `return reply.code(201).send(...)`, both work. Pick one style per codebase.",
        "Verified: calling `reply.send()` and then returning a value silently discards the returned value. No warning, no log line.",
        "The real form of that bug is an `if` branch that sends and forgets to `return`, then keeps executing. Return values everywhere, or `return reply.send(...)` everywhere.",
        "Verified: a thrown error's `message` reaches the client in the 500 body. Assume it is public unless you handled it.",
        "`setErrorHandler` is where Day 4's operational-versus-programmer split becomes an HTTP status: 4xx carries a message, 5xx carries nothing but a request id.",
      ],
      commonMistakes: [
        "Mixing `reply.send()` and returning values in the same codebase. Eventually one handler does both and the response silently comes from the wrong line.",
        "Forgetting `return` in front of `reply.send()` inside an early-exit branch. Execution continues with the state you were bailing out of.",
        "Letting raw errors reach clients. A database connection error's message contains your host and port.",
        "Returning `error.message` for every status. That is right for 4xx and a leak for 5xx.",
        "Building status codes into the response body instead of the status line. `200 { \"error\": \"not found\" }` breaks every client, cache and monitor that reads the status.",
      ],
      quiz: [
        {
          question: "A handler calls `reply.send({ a: 1 })` and then `return { b: 2 }`. What does the client get?",
          options: [
            "`{\"b\":2}`",
            "`{\"a\":1}`, and the returned value is silently discarded",
            "Both, merged",
            "A 500 about a double send",
          ],
          correctIndex: 1,
          explanation:
            "Verified. Nothing warns you, which is why a send-without-return in an early-exit branch is so hard to spot.",
        },
        {
          question: "You `throw new Error(\"connect ECONNREFUSED 10.0.1.42:5432\")`. What is the risk?",
          options: [
            "None, Fastify hides it",
            "The message reaches the client in the 500 body, disclosing your database host",
            "The process exits",
            "It becomes a 400",
          ],
          correctIndex: 1,
          explanation:
            "Verified that a thrown message appears in the response. Assume it is public until an error handler makes it otherwise.",
        },
        {
          question: "In `setErrorHandler`, why send `error.message` for 4xx but not 5xx?",
          options: [
            "5xx messages are always empty",
            "A 4xx is the caller's fault and the message helps them fix it; a 5xx is your bug and the message may leak internals",
            "Fastify forbids messages on 5xx",
            "To save bandwidth",
          ],
          correctIndex: 1,
          explanation:
            "This is Day 4's operational versus programmer error distinction, expressed as a status code.",
        },
        {
          question: "When do you actually need `reply`?",
          options: [
            "Always, returning does not work",
            "For a status code, a header, a redirect or a non-JSON body",
            "Only in async handlers",
            "Only for errors",
          ],
          correctIndex: 1,
          explanation:
            "Returning a value covers the 200-with-JSON case, which is most routes.",
        },
      ],
    },
    {
      id: "plugins-and-encapsulation",
      title: "Plugins and encapsulation",
      durationMinutes: 13,
      explanation:
        "This is the lesson that decides whether Fastify makes sense to you.\n\n---\n\n## Plugin\n\n<b>Plugin</b> (a reusable piece of Fastify functionality that can register routes, hooks, decorators or other plugins).\n\n> A plugin is just a <b>function that takes an instance</b>. There is no base class and no interface to implement. That is why the whole ecosystem is plugins: the bar to writing one is a function signature.\n\n```javascript\nasync function userRoutes(app) {\n  app.get(\"/users\", async () => []);\n}\n\napp.register(userRoutes);\n```\n\n---\n\n## Why bother\n\nA hundred routes in `server.js` is unreadable. So:\n\n```text\nserver.js\n   │\n   ├── auth plugin\n   ├── user plugin\n   ├── order plugin\n   ├── payment plugin\n   └── admin plugin\n```\n\nThat gives your application boundaries. But the boundary is not just organisational, and this is the part that surprises people.\n\n---\n\n## Encapsulation\n\n<b>Encapsulation</b> (Fastify's mechanism for limiting which decorators, hooks and plugins are visible inside a particular plugin scope).\n\n> Here is what that actually means, and it is stronger than it sounds. `app.register(fn)` does not call `fn(app)`. It creates a <b>child instance</b> and calls `fn(child)`. Anything the plugin adds lands on the child, and the child is discarded from the parent's point of view once registration finishes.\n\nVerified, and worth reading twice:\n\n```javascript\nconst app = Fastify();\n\nasync function dbPlugin(app) {\n  app.decorate(\"db\", { name: \"pg\" });\n}\n\nawait app.register(dbPlugin);\n\nconsole.log(app.db);      // undefined\n```\n\n`undefined`. The plugin ran. The decoration succeeded. It just landed on a child instance that the parent cannot see.\n\nAnd siblings cannot see each other either:\n\n```javascript\napp.register(async (app) => { app.decorate(\"db\", 1); });\napp.register(async (app) => {\n  console.log(app.hasDecorator(\"db\"));    // false\n});\n```\n\nVerified `false`.\n\n> This is <b>the</b> Fastify beginner bug. You write a database plugin, register it, and every route reports `app.db is undefined`. Nothing errored. The plugin loaded fine. You are just looking at the wrong instance, and no error message will tell you that. The next lesson has the fix.\n\n---\n\n## Why encapsulation is worth the confusion\n\nWithout boundaries, dependencies go one direction only: outward.\n\n```text\nPlugin A → changes global state\nPlugin B → depends on A\nPlugin C → depends on B\nPlugin D → depends on A + B + C\n```\n\nNow changing A can break D, and nothing in D's file mentions A.\n\nWith encapsulation, a plugin gets its own scope, so what it registers cannot leak sideways. A hook added inside the users plugin runs for the users routes and not for the admin routes. Notice that this is exactly Day 2's module scope, one level up: there the unit was a file, here the unit is a plugin subtree.\n\n---\n\n## Registration order and `await app.ready()`\n\nOne more thing that catches people. `app.register()` does not run the plugin immediately. It queues it, and the queue drains when the server starts or when you call `app.ready()`.\n\nSo this prints nothing useful:\n\n```javascript\napp.register(myPlugin);\nconsole.log(app.hasDecorator(\"db\"));    // false, not yet loaded\n```\n\nIn a test, `await app.ready()` first. That is also why registration errors surface at startup rather than at the `register` call.",
      diagram: `A plugin is just a function

    async function userRoutes(app) {
      app.get("/users", async () => []);
    }
    app.register(userRoutes);

    no base class. no interface.
    that is why the ecosystem is all plugins:
    the bar is a function signature.


register() does NOT call fn(app)

    app.register(fn)
        │
        ├── creates a CHILD instance
        └── calls fn(child)

    everything the plugin adds lands on the child.


The verified surprise

    const app = Fastify();
    async function dbPlugin(app) {
      app.decorate("db", { name: "pg" });
    }
    await app.register(dbPlugin);
    app.db     →  undefined

    the plugin ran.
    the decoration succeeded.
    it landed on a child the parent cannot see.


Siblings cannot see each other either

    register(A)  →  decorate("db", 1)
    register(B)  →  hasDecorator("db")  →  false

    verified.


THE Fastify beginner bug

    you write a database plugin
    you register it
    every route says  app.db is undefined

    nothing errored.
    the plugin loaded fine.
    you are looking at the WRONG INSTANCE
    and no message will ever tell you so.

    → next lesson has the fix.


Why it is worth the confusion

    without boundaries:
      A changes global state
      B depends on A
      C depends on B
      D depends on A + B + C

      change A, break D, and nothing in D's
      file mentions A.

    with encapsulation:
      each plugin gets its own scope
      a hook in the users plugin runs for
      users routes, NOT admin routes

    this is Day 2's module scope, one level up.
      there the unit was a file
      here the unit is a plugin subtree


register() is queued, not immediate

    app.register(myPlugin);
    app.hasDecorator("db")   →  false, not loaded yet

    the queue drains at listen(), or at
    await app.ready()

    in a test: await app.ready() FIRST.
    it is also why registration errors surface
    at startup, not at the register call.`,
      codeExample: {
        title: "The encapsulation bug, reproduced and explained",
        code: `import Fastify from "fastify";

// ── Reproduce it. This is the whole bug. ────────────────────
const app = Fastify();

async function dbPlugin(app) {
  // This runs. It succeeds. Watch where it lands.
  app.decorate("db", { name: "pg" });
}

await app.register(dbPlugin);

console.log(app.db);
// undefined            ← verified
//
// Read that again. The plugin function executed. decorate()
// did not throw. And the parent sees nothing, because
// register() called dbPlugin(child), not dbPlugin(app).


// ── Siblings are isolated from each other too ───────────────
const app3 = Fastify();

app3.register(async (app) => {
  app.decorate("db", 1);
});

app3.register(async (app) => {
  console.log("sibling sees db?", app.hasDecorator("db"));
  // false             ← verified
});

await app3.ready();


// ── What it looks like when it bites you ────────────────────
//
// plugins/database.js
//   export default async function database(app) {
//     const pool = new Pool({ ... });
//     app.decorate("db", pool);
//   }
//
// routes/users.js
//   export default async function users(app) {
//     app.get("/users", async () => {
//       return app.db.query("SELECT * FROM users");
//       //     ^^^^^^ TypeError: Cannot read properties of
//       //            undefined (reading 'query')
//     });
//   }
//
// server.js
//   app.register(database);
//   app.register(users);
//
// Everything looks right. Nothing logged a warning. The
// database plugin definitely ran. And app.db is undefined
// inside the users plugin, because they are siblings.


// ── Encapsulation being useful, not annoying ────────────────
const api = Fastify();

// Public routes. No auth hook anywhere in this scope.
api.register(async (app) => {
  app.get("/health", async () => ({ status: "ok" }));
  app.post("/login", async () => ({ token: "..." }));
});

// Admin routes. The auth hook is added INSIDE this scope,
// so it applies to these routes and cannot leak to /health.
api.register(async (app) => {
  app.addHook("onRequest", async (request) => {
    if (!request.headers.authorization) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      throw err;
    }
  });

  app.get("/admin/users", async () => []);
  app.delete("/admin/users/:id", async () => ({ deleted: true }));
}, { prefix: "/v1" });
//
// Two things happened there. The hook is scoped to the
// second subtree, and { prefix: "/v1" } applied to every
// route inside it without touching a single route string.
//
// Compare with an Express app.use(authMiddleware) placed
// halfway down the file, where whether a route is protected
// depends on which line it was written on.


// ── register() is queued ────────────────────────────────────
const t = Fastify();
t.register(async (app) => { app.decorate("thing", 1); });
console.log(t.hasDecorator("thing"));   // false — not loaded yet
await t.ready();
// Now the queue has drained. In tests, always await ready()
// before asserting anything about the instance.`,
      },
      keyTakeaways: [
        "A plugin is a function that takes an instance. No base class, no interface, which is why the whole ecosystem is plugins.",
        "`app.register(fn)` creates a child instance and calls `fn(child)`. It does not call `fn(app)`.",
        "Verified: a decorator added inside a plainly-registered plugin is `undefined` on the parent, and `hasDecorator` is `false` on a sibling.",
        "That is the single most common Fastify bug: `app.db is undefined` with no error, because you are looking at a different instance.",
        "Encapsulation is what lets an auth hook apply to the admin subtree and provably not to `/health`. Express placement-based middleware cannot promise that.",
        "`register()` queues the plugin. It runs at `listen()` or `ready()`, so `await app.ready()` before asserting anything in a test.",
        "This is Day 2's module scope one level up: there the unit was a file, here it is a plugin subtree.",
      ],
      commonMistakes: [
        "Expecting `app.decorate` inside a plugin to be visible on the parent. It is not, and nothing warns you.",
        "Expecting one plugin to see another plugin's decorator. Siblings are isolated. Verified `false`.",
        "Debugging `app.db is undefined` by checking whether the plugin ran. It ran. The problem is which instance it ran against.",
        "Checking `hasDecorator` right after `register()` and concluding the plugin is broken. The queue has not drained yet.",
        "Treating plugins as only a file-organisation tool. The scope boundary is the actual feature; the tidy folders are a side effect.",
      ],
      quiz: [
        {
          question: "You `app.decorate(\"db\", pool)` inside a plainly registered plugin. What is `app.db` on the parent?",
          options: ["The pool", "`undefined`", "A getter that lazily resolves", "It throws"],
          correctIndex: 1,
          explanation:
            "Verified `undefined`. `register()` created a child instance and the decoration landed there.",
        },
        {
          question: "Two sibling plugins, the first decorates `db`. What does the second see?",
          options: [
            "The decorator",
            "`hasDecorator(\"db\")` is `false`, siblings are isolated",
            "A warning at startup",
            "An empty object",
          ],
          correctIndex: 1,
          explanation:
            "Verified `false`. This is exactly the shape that produces `app.db is undefined` in a routes plugin.",
        },
        {
          question: "What does encapsulation buy you that Express middleware placement does not?",
          options: [
            "Speed",
            "A hook added inside a subtree provably cannot apply outside it, regardless of line order",
            "Type safety",
            "Smaller bundles",
          ],
          correctIndex: 1,
          explanation:
            "With `app.use`, whether a route is protected depends on which line it was written on. With a scope it does not.",
        },
        {
          question: "Why is `hasDecorator` false immediately after `register()`?",
          options: [
            "The decorator name is wrong",
            "`register()` queues the plugin; it runs at `listen()` or `ready()`",
            "Decorators are async",
            "You must use `decorateRequest`",
          ],
          correctIndex: 1,
          explanation:
            "Await `app.ready()` first in tests. It is also why registration errors surface at startup.",
        },
      ],
    },
    {
      id: "fastify-plugin-and-decorators",
      title: "fastify-plugin and decorators",
      durationMinutes: 11,
      explanation:
        "The previous lesson left you with a broken database plugin. Here is the fix, and it is one function call.\n\n---\n\n## Decorator\n\n<b>Decorator</b> (a custom property or method added to a Fastify instance, request or reply).\n\n> Decorators exist so shared dependencies do not have to be threaded through every function by hand. The reason they are a Fastify feature rather than a module-level `export const db` is <b>lifecycle</b>: a decorator is attached to an instance that Fastify creates, closes and can create again per test, which a module-level singleton cannot be.\n\n```javascript\napp.decorate(\"config\", { environment: \"development\" });\napp.config.environment;\n```\n\nThere are three:\n\n```text\napp.decorate()          on the instance      config, db, services\napp.decorateRequest()   on every request     request.user\napp.decorateReply()     on every reply       reply.cache()\n```\n\n---\n\n## `fastify-plugin`\n\n<b>`fastify-plugin`</b> (a wrapper that tells Fastify not to create a new scope for a plugin, so what the plugin adds is visible to its parent).\n\n> One sentence, and it is the difference between a working application and yesterday's `undefined`. Verified side by side: plain `register` gives `app.db === undefined`, and the same plugin wrapped in `fp()` gives `app.db === { name: \"pg\" }`.\n\n```javascript\nimport fp from \"fastify-plugin\";\n\nexport default fp(async function database(app) {\n  const pool = new Pool({ connectionString: process.env.DATABASE_URL });\n  app.decorate(\"db\", pool);\n});\n```\n\nNow every sibling sees `app.db`.\n\n---\n\n## The rule for when to wrap\n\nIt is genuinely simple:\n\n```text\nProviding something for others to use   →  wrap in fp()\n  ↳ database, config, auth helper, logger, cache\n\nUsing things to serve requests          →  do not wrap\n  ↳ routes, feature modules\n```\n\n> Read that as: <b>infrastructure breaks out, features stay in</b>. A database plugin has no reason to exist except to be used elsewhere, so it must escape its scope. A users-routes plugin has no reason to be visible anywhere, so leaving it encapsulated is free safety.\n\nWrapping a routes plugin in `fp()` is the mirror-image mistake to the one in the last lesson. It works, so nobody notices, and you have quietly given up the boundary you chose Fastify for.\n\n---\n\n## Do not abuse decorators\n\nDon't do this:\n\n```javascript\napp.decorate(\"services\", { users, orders, payments, email, billing });\n```\n\nThat is a global dependency container wearing a Fastify hat, and it undoes the encapsulation you just learned. Prefer small, explicit, well-scoped dependencies.\n\n---\n\n## `decorateRequest` and the shape that bites\n\n```javascript\napp.decorateRequest(\"user\", null);\n\napp.addHook(\"onRequest\", async (request) => {\n  request.user = await resolveUser(request.headers.authorization);\n});\n```\n\nDeclare it with `decorateRequest` first, then fill it in a hook. Declaring it up front is not decoration: it tells V8 the shape of the request object once, so every request uses the same hidden class instead of getting a new one. That is Day 14's V8 lesson showing up in an API design decision.\n\nOne caveat worth knowing: decorate a request with a plain object as the default and every request shares that same object reference. Use `null` and assign per request, as above.",
      diagram: `Decorator: three of them

    app.decorate()          on the instance
                              config, db, services
    app.decorateRequest()   on every request
                              request.user
    app.decorateReply()     on every reply
                              reply.cache()

    why not just  export const db  ?
      LIFECYCLE. a decorator hangs off an
      instance Fastify creates, closes, and can
      create again per test. a module singleton
      cannot.


fastify-plugin, verified side by side

    plain register
        app.db  →  undefined

    fp(register)
        app.db  →  { name: "pg" }

    one wrapper. that is the whole fix.

    fp() says: do NOT make a new scope for me.


The rule for when to wrap

    providing something for others
        →  wrap in fp()
        ↳ database · config · auth helper
          logger · cache

    using things to serve requests
        →  do NOT wrap
        ↳ routes · feature modules

    read it as:
      INFRASTRUCTURE breaks out
      FEATURES stay in

    a db plugin exists only to be used elsewhere,
    so it must escape.
    a users-routes plugin has no reason to be
    visible anywhere, so encapsulation is free.


The mirror-image mistake

    wrapping a ROUTES plugin in fp()

    it works, so nobody notices, and you have
    quietly given up the boundary you picked
    Fastify for.


Do not build a container

    app.decorate("services", { users, orders,
      payments, email, billing })        ✗

    that is a global dependency container in a
    Fastify hat. it undoes the encapsulation you
    just learned.

    prefer small · explicit · well-scoped


decorateRequest: declare, then fill

    app.decorateRequest("user", null);

    addHook("onRequest", async (request) => {
      request.user = await resolveUser(...);
    });

    declaring up front is not tidiness:
    it tells V8 the request's SHAPE once, so
    every request reuses one hidden class
    instead of getting a new one.  (Day 14)

    ⚠ default of {} is SHARED by every request.
      use null and assign per request.`,
      codeExample: {
        title: "The fix, and the rule for when to apply it",
        code: `// ── The verified difference ─────────────────────────────────
import Fastify from "fastify";
import fp from "fastify-plugin";

const a = Fastify();
await a.register(async (app) => { app.decorate("db", { name: "pg" }); });
console.log(a.db);        // undefined              ← plain

const b = Fastify();
await b.register(fp(async (app) => { app.decorate("db", { name: "pg" }); }));
console.log(b.db);        // { name: 'pg' }         ← wrapped

// One wrapper. That is the entire difference between the
// previous lesson's broken application and a working one.


// ── plugins/database.js — infrastructure, so wrap it ────────
import fp from "fastify-plugin";
import pg from "pg";

async function database(app) {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,                     // Day 17 explains this number
  });

  await pool.query("SELECT 1");  // fail at startup, not at
                                 // the first request

  app.decorate("db", pool);

  // Day 11's shutdown lesson, wired into the framework.
  app.addHook("onClose", async () => {
    await pool.end();
  });
}

export default fp(database, {
  name: "database",              // lets others declare a dependency
});


// ── plugins/config.js — also infrastructure ─────────────────
import fp from "fastify-plugin";

export default fp(async function config(app) {
  const cfg = {
    port: Number(process.env.PORT ?? 3000),
    nodeEnv: process.env.NODE_ENV ?? "development",
  };
  app.decorate("config", cfg);
});


// ── routes/users.js — a feature, so do NOT wrap ─────────────
export default async function userRoutes(app) {
  // app.db is visible here because database was wrapped in
  // fp(). These routes are not visible anywhere else, which
  // is exactly what you want.
  app.get("/users", async () => {
    const { rows } = await app.db.query("SELECT id, name FROM users");
    return rows;
  });

  app.get("/users/:id", {
    schema: { params: { type: "object", properties: { id: { type: "integer" } } } },
  }, async (request, reply) => {
    const { rows } = await app.db.query(
      "SELECT id, name FROM users WHERE id = $1",
      [request.params.id],
    );
    if (rows.length === 0) return reply.code(404).send({ error: "Not found" });
    return rows[0];
  });
}


// ── app.js — the composition ────────────────────────────────
import Fastify from "fastify";
import config from "./plugins/config.js";
import database from "./plugins/database.js";
import userRoutes from "./routes/users.js";

export function buildApp(opts = {}) {
  const app = Fastify({ logger: true, ...opts });

  app.register(config);        // fp  — breaks out
  app.register(database);      // fp  — breaks out
  app.register(userRoutes);    // not fp — stays in

  return app;
}


// ── decorateRequest, and the shared-reference trap ──────────
app.decorateRequest("user", null);           // ✓ per request

// app.decorateRequest("session", {});        // ✗ every single
//                                           //   request shares
//                                           //   that one object

app.addHook("onRequest", async (request) => {
  request.user = await resolveUser(request.headers.authorization);
});

// Declaring it up front tells V8 the request object's shape
// once, so every request reuses the same hidden class rather
// than getting a fresh one. Day 14's V8 note, arriving as an
// API design rule.`,
      },
      keyTakeaways: [
        "Verified side by side: plain `register` gives `app.db === undefined`; the same plugin wrapped in `fp()` gives the real value.",
        "`fastify-plugin` tells Fastify not to create a new scope, so the plugin's decorators, hooks and routes land on the parent.",
        "The rule: infrastructure breaks out, features stay in. Wrap database, config, auth helpers and logging. Do not wrap routes.",
        "Wrapping a routes plugin in `fp()` works, so nobody notices, and you have given up the boundary you chose Fastify for.",
        "Decorators are preferable to a module-level singleton because of lifecycle: they hang off an instance Fastify can create and close per test.",
        "`app.decorate(\"services\", everything)` is a global container in disguise. Prefer small, explicit dependencies.",
        "`decorateRequest` before filling in a hook tells V8 the request's shape once. Use `null` as the default, never `{}`, which every request would share.",
      ],
      commonMistakes: [
        "Not knowing `fastify-plugin` exists, and working around `undefined` decorators with module-level globals. That trades a five-character fix for an untestable singleton.",
        "Wrapping everything in `fp()` so nothing is ever `undefined`. Now nothing is encapsulated either, and Fastify is Express with extra steps.",
        "`decorateRequest(\"session\", {})`. Every request shares one object, so one request's data appears in another's.",
        "Assigning `request.user` in a hook without declaring the decorator first. It works, and it costs you a hidden class per request.",
        "Decorating with a single object holding every service. That is a dependency container, and it is exactly the coupling encapsulation was preventing.",
      ],
      quiz: [
        {
          question: "What does `fastify-plugin` actually do?",
          options: [
            "Loads plugins faster",
            "Tells Fastify not to create a new scope, so what the plugin adds is visible to its parent",
            "Validates plugin options",
            "Registers plugins in parallel",
          ],
          correctIndex: 1,
          explanation:
            "Verified: `app.db` is `undefined` with plain register and the real value with `fp()`.",
        },
        {
          question: "Which of these should be wrapped in `fp()`?",
          options: [
            "A users-routes plugin",
            "A database plugin that decorates `app.db`",
            "Every plugin",
            "No plugin",
          ],
          correctIndex: 1,
          explanation:
            "Infrastructure breaks out, features stay in. A database plugin exists to be used elsewhere; routes do not.",
        },
        {
          question: "Why is `app.decorateRequest(\"session\", {})` a bug?",
          options: [
            "The name is reserved",
            "Every request shares that one object reference, so one request's data leaks into another's",
            "Objects cannot be decorators",
            "It is slower than `null`",
          ],
          correctIndex: 1,
          explanation:
            "Use `null` as the default and assign per request in a hook.",
        },
        {
          question: "Why declare `decorateRequest(\"user\", null)` instead of just assigning `request.user` in a hook?",
          options: [
            "Fastify throws otherwise",
            "It tells V8 the request object's shape once, so every request reuses one hidden class",
            "It makes the property read-only",
            "It enables TypeScript inference",
          ],
          correctIndex: 1,
          explanation:
            "Day 14's V8 lesson turning up as an API design rule. Assigning without declaring works and costs you a shape change per request.",
        },
      ],
    },
    {
      id: "hooks-and-lifecycle",
      title: "Hooks and the request lifecycle",
      durationMinutes: 12,
      explanation:
        "## Hook\n\n<b>Hook</b> (a function Fastify runs at a particular stage of the request or application lifecycle).\n\n> A hook is how you run logic <b>around</b> a handler without the handler knowing. That is the same job Express middleware does, with one difference that matters: a hook names its stage, so \"before validation\" and \"before the handler\" are different, declared things rather than a consequence of which line you wrote `app.use` on.\n\nMost material shows you a four-step lifecycle. The real one, verified by registering every hook and recording the order:\n\n```text\nonRequest\n   ↓\npreParsing\n   ↓\npreValidation\n   ↓\npreHandler\n   ↓\nhandler\n   ↓\npreSerialization\n   ↓\nonSend\n   ↓\nonResponse\n```\n\nThe three usually left out are the useful ones.\n\n---\n\n## The stages, and what each is for\n\n<b>`onRequest`</b> (runs first, before the body has been read).\n\n> Because the body is not parsed yet, `request.body` is `undefined` here. That is a feature: it is the cheapest possible place to reject a request. Rate limiting and a missing API key belong here, so you never pay to parse a body you are about to throw away.\n\n<b>`preValidation`</b> (runs after the body is parsed, before the schema runs).\n\n> The only place you can see the raw parsed body before validation rewrites it. Useful for decrypting a payload or normalizing a legacy field name so the schema sees what it expects.\n\n<b>`preHandler`</b> (runs after validation, before the handler).\n\n> This is where authentication belongs, because you now have a validated request. `onRequest` is for \"is there a token at all\"; `preHandler` is for \"who is this and are they allowed\".\n\n<b>`preSerialization`</b> (runs on the returned value, before it is serialized).\n\n> Here the payload is still a JavaScript object, so you can add or remove fields. This is the last point at which that is easy.\n\n<b>`onSend`</b> (runs after serialization, before the bytes go out).\n\n> Here the payload is a string or a Buffer, not your object. People reach for `onSend` to modify a response, find themselves parsing JSON to change one field, and should have used `preSerialization`.\n\n<b>`onResponse`</b> (runs after the response is fully sent).\n\n> This is the one most tutorials omit, and it is where response-time metrics belong. The response is already gone, so nothing you do here can delay the client. Logging and instrumentation here are free from the caller's point of view.\n\n<b>`onError`</b> (runs when an error occurs during request processing).\n\n> For logging and monitoring, not for handling. `setErrorHandler` shapes the response; `onError` observes. Reaching for `onError` to build the error body is a sign you wanted `setErrorHandler`.\n\n<b>`onClose`</b> (runs when the application shuts down).\n\n> Day 11's graceful shutdown, wired into the framework. Closing your database pool here is the difference between a clean deploy and one that drops in-flight queries.\n\n---\n\n## Per-route hooks\n\nHooks do not have to be global:\n\n```javascript\napp.get(\"/admin\", { preHandler: authenticate }, async () => {\n  return { secret: true };\n});\n```\n\nThat route authenticates. The one next to it does not. Combined with the previous lesson's scoping, you have two ways to limit a hook: to one route, or to one plugin subtree. Prefer the subtree for anything that applies to a group, since it is one declaration rather than one per route.",
      diagram: `The real lifecycle, verified

    onRequest
       ↓
    preParsing            ← usually omitted
       ↓
    preValidation         ← usually omitted
       ↓
    preHandler
       ↓
    handler
       ↓
    preSerialization      ← usually omitted
       ↓
    onSend
       ↓
    onResponse            ← usually omitted

    the four omitted ones are the useful ones.


What each stage is actually for

    onRequest         body NOT parsed yet
                      → request.body is undefined
                      → cheapest place to REJECT
                      → rate limit, missing API key
                        (never pay to parse a body
                         you will throw away)

    preValidation     raw parsed body, pre-schema
                      → decrypt, rename a legacy field

    preHandler        validated request in hand
                      → AUTHENTICATION lives here
                      onRequest:  is there a token?
                      preHandler: who is this, allowed?

    preSerialization  payload is still an OBJECT
                      → add/remove fields, easily

    onSend            payload is a STRING or Buffer
                      → people come here to edit a
                        response, end up parsing JSON
                        to change one field, and
                        wanted preSerialization

    onResponse        already sent. nothing you do
                      can delay the client.
                      → metrics and logging, free


Two more, off the request path

    onError    OBSERVE. log, monitor.
               shaping the body?  that is
               setErrorHandler, not this.

    onClose    Day 11's graceful shutdown, wired
               into the framework. close the pool
               here or a deploy drops in-flight
               queries.


Hooks vs Express middleware

    both run logic AROUND a handler.

    difference: a hook NAMES its stage.
      "before validation" and "before the handler"
      are declared, different things

    not a consequence of which line you happened
    to write app.use on.


Three ways to scope a hook

    global          app.addHook(...)
    plugin subtree  addHook inside register()
    one route       { preHandler: fn }

    for a group, prefer the subtree:
    one declaration, not one per route.`,
      codeExample: {
        title: "Every hook, in verified order, doing its real job",
        code: `import Fastify from "fastify";

const app = Fastify({ logger: true });


// ── onRequest: reject early, before parsing ─────────────────
app.addHook("onRequest", async (request, reply) => {
  // request.body is undefined here. On purpose.
  // This is the cheapest place to say no.
  if (request.headers["x-api-key"] !== process.env.API_KEY) {
    return reply.code(401).send({ error: "Unauthorized" });
  }
  request.startedAt = process.hrtime.bigint();
});


// ── preParsing: the raw stream, before it is read ───────────
app.addHook("preParsing", async (request, reply, payload) => {
  return payload;        // you must return it, or nothing parses
});


// ── preValidation: parsed body, before the schema ───────────
app.addHook("preValidation", async (request) => {
  // A legacy client sends "user_name". The schema wants "name".
  if (request.body?.user_name && !request.body.name) {
    request.body.name = request.body.user_name;
  }
});


// ── preHandler: authentication, with a validated request ────
app.addHook("preHandler", async (request) => {
  request.user = await resolveUser(request.headers.authorization);
});


// ── preSerialization: payload is still an object ────────────
app.addHook("preSerialization", async (request, reply, payload) => {
  // Easy to touch fields here.
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return { ...payload, requestId: request.id };
  }
  return payload;
});


// ── onSend: payload is a string or Buffer now ───────────────
app.addHook("onSend", async (request, reply, payload) => {
  reply.header("x-request-id", request.id);
  return payload;
  //
  // If you find yourself doing JSON.parse(payload) here to
  // change one field, you wanted preSerialization.
});


// ── onResponse: metrics, for free ───────────────────────────
app.addHook("onResponse", async (request, reply) => {
  // The response is already gone. Nothing here delays the
  // client, which is why instrumentation belongs at this
  // stage and not in onSend.
  const ms = Number(process.hrtime.bigint() - request.startedAt) / 1e6;
  request.log.info({
    method: request.method,
    url: request.url,
    status: reply.statusCode,
    ms: Math.round(ms),
  }, "request completed");
});


// ── onError: observe, do not shape ──────────────────────────
app.addHook("onError", async (request, reply, error) => {
  // Send it to your error tracker. That is all.
  request.log.error({ err: error, userId: request.user?.id });
  // The response body is setErrorHandler's job, not this.
});


// ── onClose: Day 11's shutdown, in framework form ───────────
app.addHook("onClose", async (app) => {
  await app.db?.end();
  await app.queue?.close();
});


// ── Verified order ──────────────────────────────────────────
// Registering every hook and recording the sequence gave:
//
//   onRequest -> preParsing -> preValidation -> preHandler
//     -> handler -> preSerialization -> onSend -> onResponse
//
// Note where the handler sits: fourth of eight. More than
// half the lifecycle happens outside your handler, which is
// the point of a framework.


// ── Per-route, and per-subtree ──────────────────────────────
async function authenticate(request, reply) {
  if (!request.user) return reply.code(401).send({ error: "Unauthorized" });
}

// One route.
app.get("/admin", { preHandler: authenticate }, async () => {
  return { secret: true };
});

// A whole subtree. One declaration instead of one per route,
// and the previous lesson's encapsulation guarantees it
// cannot leak to routes outside this register() call.
app.register(async (admin) => {
  admin.addHook("preHandler", authenticate);
  admin.get("/admin/users", async () => []);
  admin.delete("/admin/users/:id", async () => ({ deleted: true }));
});


// ── One gotcha, verified ────────────────────────────────────
// app.addHook("onRequest", async (req, reply, done) => {});
//
//   FastifyError: Async function has too many arguments.
//   Async hooks should not use the 'done' argument.
//   [FST_ERR_HOOK_INVALID_ASYNC_HANDLER]
//
// Async hook, or callback hook with done. Never both. The
// arity is how Fastify tells them apart.`,
      },
      keyTakeaways: [
        "Verified full order: `onRequest`, `preParsing`, `preValidation`, `preHandler`, handler, `preSerialization`, `onSend`, `onResponse`. The handler is fourth of eight.",
        "`onRequest` runs before the body is parsed, so `request.body` is `undefined`. That makes it the cheapest place to reject a request.",
        "Authentication belongs in `preHandler`, with a validated request. `onRequest` answers \"is there a token\", `preHandler` answers \"who is this\".",
        "`preSerialization` sees your object; `onSend` sees a string. Editing a response in `onSend` means parsing JSON you just serialized.",
        "`onResponse` runs after the response is sent, so metrics and logging there cost the client nothing.",
        "`onError` observes; `setErrorHandler` shapes the response. Building an error body in `onError` means you wanted the other one.",
        "`onClose` is Day 11's graceful shutdown as a framework hook. Close the pool there or a deploy drops in-flight queries.",
        "Verified: an async hook with a `done` argument throws `FST_ERR_HOOK_INVALID_ASYNC_HANDLER`. Arity is how Fastify tells the two styles apart.",
      ],
      commonMistakes: [
        "Learning the four-stage lifecycle and never discovering `preValidation`, `preSerialization` or `onResponse`, then doing their work in the wrong place.",
        "Reading `request.body` in `onRequest`. It is `undefined`, because the body has not been parsed yet.",
        "Modifying a response in `onSend` by parsing the JSON you just serialized. Use `preSerialization`.",
        "Putting response-time metrics in `onSend`, where the work delays the client, instead of `onResponse`, where it does not.",
        "Using `onError` to build the error response. It observes; `setErrorHandler` decides.",
        "Adding a global `preHandler` for auth and then exempting `/health` with an `if`. Scope the hook to a subtree instead.",
        "Writing `async (req, reply, done)`. Verified to throw. Pick async or callback style, not both.",
      ],
      quiz: [
        {
          question: "What is the verified hook order around the handler?",
          options: [
            "onRequest, preHandler, handler, onSend",
            "onRequest, preParsing, preValidation, preHandler, handler, preSerialization, onSend, onResponse",
            "preHandler, onRequest, handler, onResponse",
            "handler, onSend, onRequest",
          ],
          correctIndex: 1,
          explanation:
            "Verified by registering every hook. The handler is fourth of eight; over half the lifecycle is outside it.",
        },
        {
          question: "Why is `request.body` `undefined` in `onRequest`?",
          options: [
            "A bug",
            "The body has not been parsed yet, which makes `onRequest` the cheapest place to reject a request",
            "You must enable a flag",
            "Only for GET requests",
          ],
          correctIndex: 1,
          explanation:
            "Rate limiting and a missing API key belong there, so you never pay to parse a body you will discard.",
        },
        {
          question: "You want to add a field to every JSON response. Which hook?",
          options: [
            "`onSend`, then `JSON.parse` the payload",
            "`preSerialization`, where the payload is still an object",
            "`onResponse`",
            "`onError`",
          ],
          correctIndex: 1,
          explanation:
            "`onSend` receives a string or Buffer. Parsing what you just serialized is the signal you are one stage too late.",
        },
        {
          question: "Where do response-time metrics belong, and why?",
          options: [
            "`onSend`, to be accurate",
            "`onResponse`, because the response is already sent so the work cannot delay the client",
            "`preHandler`",
            "In the handler",
          ],
          correctIndex: 1,
          explanation:
            "This is the stage most tutorials omit, and it is the one instrumentation was made for.",
        },
        {
          question: "`app.addHook(\"onRequest\", async (req, reply, done) => {})` does what?",
          options: [
            "Works fine",
            "Throws `FST_ERR_HOOK_INVALID_ASYNC_HANDLER`, because arity is how Fastify tells async from callback style",
            "Runs the hook twice",
            "Silently ignores `done`",
          ],
          correctIndex: 1,
          explanation:
            "Verified. Async hook, or callback hook with `done`. Never both.",
        },
      ],
    },
    {
      id: "schemas-at-the-boundary",
      title: "Schemas at the route boundary",
      durationMinutes: 12,
      explanation:
        "## Schema\n\n<b>Schema</b> (a formal description of the shape and rules of data).\n\n> Fastify's schemas are worth learning because one declaration does <b>four</b> jobs: it validates the request, serializes the response, documents the route, and can generate TypeScript types. Most frameworks give you the first one and leave the other three as separate work that drifts out of sync.\n\n```javascript\nconst userSchema = {\n  type: \"object\",\n  required: [\"name\", \"email\"],\n  properties: {\n    name: { type: \"string\" },\n    email: { type: \"string\" },\n  },\n};\n\napp.post(\"/users\", { schema: { body: userSchema } }, async (request) => {\n  return request.body;\n});\n```\n\nVerified: a POST missing `email` never reaches your handler.\n\n```javascript\n{\n  \"statusCode\": 400,\n  \"code\": \"FST_ERR_VALIDATION\",\n  \"error\": \"Bad Request\",\n  \"message\": \"body must have required property 'email'\"\n}\n```\n\nA readable 400, for free, before your code ran.\n\n---\n\n## The default that surprises everyone\n\nNow send a valid body with one extra field:\n\n```javascript\n{ \"name\": \"Rajan\", \"email\": \"a@b.c\", \"isAdmin\": true }\n```\n\nVerified result:\n\n```javascript\n{ \"received\": { \"name\": \"Rajan\", \"email\": \"a@b.c\", \"isAdmin\": true } }\n```\n\n`isAdmin` <b>came straight through</b>.\n\n> This is the most important thing in this lesson. JSON Schema allows unlisted properties by default, so validation passing does <b>not</b> mean the body only contains what you asked for. If your code does `db.users.insert(request.body)` or `Object.assign(user, request.body)`, a client just set a column you never intended to expose. Adding a schema and assuming it filters is a worse position than having no schema, because now you trust the body.\n\nThe fix is one line:\n\n```javascript\nconst strict = {\n  type: \"object\",\n  required: [\"name\"],\n  additionalProperties: false,\n  properties: { name: { type: \"string\" } },\n};\n```\n\nVerified with the same extra field: the handler receives `{ \"name\": \"R\" }`. Note that it <b>strips</b> rather than rejects. You get a 200 and the field is gone. Day 16 shows the four different things four different tools do with that same input.\n\n---\n\n## Response schemas\n\nThe other direction matters just as much:\n\n```javascript\napp.get(\"/me\", {\n  schema: {\n    response: {\n      200: {\n        type: \"object\",\n        properties: { id: { type: \"number\" }, name: { type: \"string\" } },\n      },\n    },\n  },\n}, async () => {\n  return { id: 1, name: \"Rajan\", passwordHash: \"SECRET\", isAdmin: true };\n});\n```\n\nVerified response:\n\n```javascript\n{ \"id\": 1, \"name\": \"Rajan\" }\n```\n\n`passwordHash` and `isAdmin` are gone. A response schema is an allowlist, and that makes it a security boundary, not just documentation.\n\n> One sharp edge. Verified: if the response schema marks a field `required` and your handler omits it, you get a <b>500</b> with `\"name\" is required!`. That is arguably correct, since returning a response that violates your own contract is a bug, but it turns a missing database column into a server error rather than a partial response. Know which failure you prefer before you add `required` to a response.\n\n---\n\n## Why this is fast\n\nFastify compiles each schema into a specialised validator and a specialised serializer at startup, rather than walking the schema per request. Since the serializer already knows every field and type, it can build the JSON string directly instead of doing `JSON.stringify`'s general-purpose reflection.\n\nWhich reframes the whole day. The performance Fastify is known for is not mostly the router, it is this: <b>the schema you added for safety is also the reason serialization is fast</b>. Day 16 goes into it properly.",
      diagram: `One declaration, four jobs

    schema
      ├── validates the request
      ├── serializes the response
      ├── documents the route
      └── generates TypeScript types

    most frameworks give you the first and leave
    the other three to drift out of sync.


Missing required field: verified

    POST /users  { "name": "R" }

    →  400  FST_ERR_VALIDATION
       "body must have required property 'email'"

    readable 400, free, before your code ran.


⚠ The default that surprises everyone

    POST  { name, email, isAdmin: true }

    verified received:
      { name: "R", email: "a@b.c",
        isAdmin: true }        ← CAME THROUGH

    JSON Schema ALLOWS unlisted properties.

    so validation passing does NOT mean the body
    holds only what you asked for.

    db.users.insert(request.body)
    Object.assign(user, request.body)
        └─ a client just set a column you never
           meant to expose

    adding a schema and assuming it filters is
    WORSE than no schema. now you trust the body.


The fix, one line

    additionalProperties: false

    verified with the same extra field:
      handler receives  { name: "R" }

    note: it STRIPS, it does not reject.
    200, field silently gone.

    Day 16: four tools, four different answers
    to that exact input.


Response schemas are an allowlist

    handler returns
      { id, name, passwordHash, isAdmin }

    schema lists
      { id, name }

    verified sent:
      { "id": 1, "name": "Rajan" }

    passwordHash and isAdmin GONE.
    that is a security boundary, not documentation.


⚠ One sharp edge, verified

    response schema marks "name" required
    handler returns { id: 1 }

    →  500   "name" is required!

    arguably right: you violated your own
    contract. but a missing DB column becomes a
    server error, not a partial response.

    decide which failure you want BEFORE adding
    required to a response.


Why Fastify is fast

    at startup, each schema compiles into
      a specialised validator
      a specialised serializer

    the serializer already knows every field and
    type, so it builds the JSON string directly
    instead of JSON.stringify's reflection.

    → the speed is not mostly the router.
      the schema you added for SAFETY is the
      reason serialization is FAST.`,
      codeExample: {
        title: "The four verified behaviours of a Fastify schema",
        code: `import Fastify from "fastify";

const app = Fastify();


// ── 1. Missing required field: rejected, readably ───────────
app.post("/users", {
  schema: {
    body: {
      type: "object",
      required: ["name", "email"],
      properties: {
        name: { type: "string" },
        email: { type: "string" },
      },
    },
  },
}, async (request) => ({ received: request.body }));

// POST { "name": "R" }
//   400
//   {"statusCode":400,"code":"FST_ERR_VALIDATION",
//    "error":"Bad Request",
//    "message":"body must have required property 'email'"}
//
// Verified. Your handler never ran.


// ── 2. ⚠ Extra field: allowed straight through ──────────────
// POST { "name": "R", "email": "a@b", "isAdmin": true }
//   200
//   {"received":{"name":"R","email":"a@b","isAdmin":true}}
//
// Verified. isAdmin is not in the schema and arrived anyway.
//
// Which means this line is a privilege escalation:
//   await db.insert(users).values(request.body);
//
// and so is this one:
//   Object.assign(existingUser, request.body);
//
// The schema validated. It did not filter.


// ── 3. additionalProperties: false — strips, not rejects ────
app.post("/strict", {
  schema: {
    body: {
      type: "object",
      required: ["name"],
      additionalProperties: false,
      properties: { name: { type: "string" } },
    },
  },
}, async (request) => ({ received: request.body }));

// POST { "name": "R", "isAdmin": true }
//   200
//   {"received":{"name":"R"}}
//
// Verified. Note: 200, and isAdmin is silently gone. It did
// not 400. If you wanted a rejection you need a different
// tool, which is Day 16.


// ── 4. Response schema is an allowlist ──────────────────────
app.get("/me", {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
        },
      },
    },
  },
}, async () => {
  // Straight from the database, warts and all.
  return {
    id: 1,
    name: "Rajan",
    passwordHash: "SECRET",
    internalNotes: "do not ship",
    isAdmin: true,
  };
});

// GET /me
//   200  {"id":1,"name":"Rajan"}
//
// Verified. Three fields never left the process. This is why
// a response schema is a security control and not paperwork.


// ── The sharp edge on required responses ────────────────────
app.get("/partial", {
  schema: {
    response: {
      200: {
        type: "object",
        required: ["id", "name"],
        properties: {
          id: { type: "number" },
          name: { type: "string" },
        },
      },
    },
  },
}, async () => ({ id: 1 }));       // name missing

// GET /partial
//   500
//   {"statusCode":500,"error":"Internal Server Error",
//    "message":"\"name\" is required!"}
//
// Verified. Defensible: you broke your own contract. But a
// nullable column now produces a 500 rather than a partial
// object. Choose deliberately.


// ── Params, query and headers take schemas too ──────────────
app.get("/users/:id", {
  schema: {
    params: {
      type: "object",
      properties: { id: { type: "integer" } },
    },
    querystring: {
      type: "object",
      properties: {
        page: { type: "integer", minimum: 1, default: 1 },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      },
    },
    headers: {
      type: "object",
      required: ["x-api-key"],
      properties: { "x-api-key": { type: "string" } },
    },
  },
}, async (request) => {
  // id is a number. page and limit are numbers, with
  // defaults already applied. A request without the API key
  // never got here.
  return {
    id: request.params.id,
    page: request.query.page,
    limit: request.query.limit,
  };
});
//
// Look at what that removed from the handler: no Number(),
// no ?? 20, no bounds check, no header check. Four kinds of
// defensive code, replaced by a declaration.`,
      },
      keyTakeaways: [
        "One schema does four jobs: validates the request, serializes the response, documents the route and can generate types.",
        "Verified: a missing required field gives a readable 400 with `FST_ERR_VALIDATION` before your handler runs.",
        "Verified and important: extra properties are allowed through by default. `isAdmin: true` reached the handler. Validation passing does not mean the body is clean.",
        "So `db.insert(request.body)` and `Object.assign(user, request.body)` are privilege escalation on a schema-validated route.",
        "Verified: `additionalProperties: false` strips the extra field and returns 200. It does not reject.",
        "Verified: a response schema is an allowlist. `passwordHash` and `isAdmin` never left the process. That is a security control.",
        "Verified: a `required` field missing from a response gives a 500, not a partial object. Decide which failure you want before adding it.",
        "Fastify compiles a validator and serializer per schema at startup, so the schema you added for safety is also why serialization is fast.",
      ],
      commonMistakes: [
        "Adding a body schema and then trusting the body. Unlisted properties pass through unless you set `additionalProperties: false`.",
        "Spreading `request.body` into a database insert or an existing entity. That is the exact shape mass-assignment bugs take.",
        "Expecting `additionalProperties: false` to return a 400. Verified: it strips the field and answers 200.",
        "Treating a response schema as documentation and returning the raw database row. Without the schema, `passwordHash` ships.",
        "Adding `required` to a response schema without realising a nullable column now produces a 500.",
        "Writing `Number(request.query.page) || 20` in the handler when `{ type: \"integer\", default: 20 }` does it at the boundary and rejects garbage.",
      ],
      quiz: [
        {
          question: "A body schema lists `name` and `email`. A client sends `isAdmin: true` as well. What reaches the handler?",
          options: [
            "A 400",
            "All three fields, including `isAdmin`, because JSON Schema allows unlisted properties by default",
            "Only `name` and `email`",
            "A 422",
          ],
          correctIndex: 1,
          explanation:
            "Verified. This is why `db.insert(request.body)` is a privilege escalation even on a schema-validated route.",
        },
        {
          question: "What does `additionalProperties: false` do to that extra field?",
          options: [
            "Returns 400",
            "Strips it and answers 200",
            "Nothing",
            "Throws at startup",
          ],
          correctIndex: 1,
          explanation:
            "Verified: the handler received `{ name: \"R\" }` with a 200. It filters silently rather than rejecting.",
        },
        {
          question: "Your handler returns `passwordHash` but the response schema does not list it. What does the client receive?",
          options: [
            "The whole object",
            "Only the listed fields; `passwordHash` never leaves the process",
            "A 500",
            "The field, nulled out",
          ],
          correctIndex: 1,
          explanation:
            "Verified. A response schema is an allowlist, which makes it a security boundary rather than documentation.",
        },
        {
          question: "A response schema marks `name` required and the handler omits it. What happens?",
          options: [
            "The field is omitted",
            "A 500 with `\"name\" is required!`",
            "It is sent as `null`",
            "A 400",
          ],
          correctIndex: 1,
          explanation:
            "Verified. Defensible, since you broke your own contract, but a nullable column becomes a server error.",
        },
        {
          question: "Why does adding schemas make Fastify faster rather than slower?",
          options: [
            "It skips validation in production",
            "Each schema compiles into a specialised serializer at startup, which builds JSON directly instead of reflecting like `JSON.stringify`",
            "It caches responses",
            "It uses a faster JSON parser",
          ],
          correctIndex: 1,
          explanation:
            "The schema you added for safety is the same thing that makes serialization fast. Day 16 goes further.",
        },
      ],
    },
    {
      id: "project-structure",
      title: "Project structure and testability",
      durationMinutes: 11,
      explanation:
        "A tiny project is one file, and that is fine:\n\n```text\nsrc/\n└── server.js\n```\n\nAt twenty routes it hurts. At a hundred it is unworkable.\n\n---\n\n## `app.js` and `server.js`\n\nSplit building the application from starting it:\n\n```text\napp.js     → creates and configures Fastify\nserver.js  → starts listening\n```\n\n```javascript\n// app.js\nimport Fastify from \"fastify\";\n\nexport function buildApp(opts = {}) {\n  const app = Fastify({ logger: true, ...opts });\n  app.register(config);\n  app.register(database);\n  app.register(userRoutes);\n  return app;\n}\n```\n\n```javascript\n// server.js\nimport { buildApp } from \"./app.js\";\n\nconst app = buildApp();\ntry {\n  await app.listen({ port: 3000, host: \"0.0.0.0\" });\n} catch (err) {\n  app.log.error(err);\n  process.exit(1);\n}\n```\n\n> The reason is not tidiness, it is <b>`app.inject()`</b>. Fastify can run a full request through the whole lifecycle, hooks, validation, serialization and all, without opening a socket. Every verified fact in today's lesson was produced that way. So the split exists because it makes tests fast and free of ports: no `listen`, no port collisions, no waiting, no cleanup, and the tests can run in parallel. Every one of Day 13's complaints about slow HTTP tests disappears.\n\n```javascript\nimport { test } from \"node:test\";\nimport assert from \"node:assert/strict\";\nimport { buildApp } from \"../app.js\";\n\ntest(\"GET /users returns an array\", async (t) => {\n  const app = buildApp({ logger: false });\n  t.after(() => app.close());\n\n  const res = await app.inject({ method: \"GET\", url: \"/users\" });\n\n  assert.equal(res.statusCode, 200);\n  assert.ok(Array.isArray(res.json()));\n});\n```\n\nThat is Day 13's `node:test` and Day 15's framework meeting, with no HTTP server involved.\n\n---\n\n## Layer-based or feature-based\n\nLayer-based groups by technical role:\n\n```text\ncontrollers/   services/   repositories/   models/\n```\n\nEasy to understand on day one. Then each folder holds `user.js`, `order.js`, `payment.js` and forty more, and adding one feature means touching four directories.\n\nFeature-based groups by business capability:\n\n```text\nsrc/modules/\n├── users/     routes.js  service.js  repository.js  schema.js\n├── orders/    routes.js  service.js  repository.js  schema.js\n└── payments/  routes.js  service.js  repository.js  schema.js\n```\n\n> The test is not which looks tidier, it is <b>what happens when you add a feature</b>. Feature-based means one new folder. Layer-based means one new file in each of four folders, and a reviewer who cannot see the whole change at once. Feature folders also map onto Fastify plugins exactly: one folder, one `register`, one encapsulated scope.\n\nA suggested layout:\n\n```text\nsrc/\n├── app.js              composes\n├── server.js           starts\n├── plugins/            infrastructure, wrapped in fp()\n│   ├── config.js\n│   ├── database.js\n│   └── auth.js\n├── modules/            features, not wrapped\n│   ├── users/\n│   └── orders/\n└── utils/\n    └── errors.js\n```\n\nThat structure is the whole day in one picture. `plugins/` holds things wrapped in `fp()` because others need them. `modules/` holds things left encapsulated because nothing should reach into them. The folder boundary and the scope boundary are the same boundary.\n\n---\n\n## Do not build a giant `server.js`\n\nLet `app.js` compose the application, let plugins own infrastructure, let feature modules own business logic, and put schemas and hooks at the HTTP boundary.",
      diagram: `app.js vs server.js

    app.js      creates and configures Fastify
    server.js   starts listening

    the reason is not tidiness. it is:


app.inject()

    runs a FULL request through the whole
    lifecycle, hooks, validation, serialization,
    without opening a socket.

    every verified fact in today's lesson came
    from inject().

    so tests get:
      no listen        no port collisions
      no waiting       no cleanup
      parallel by default

    every complaint Day 13 had about slow HTTP
    tests, gone.

    const app = buildApp({ logger: false });
    const res = await app.inject({ url: "/users" });
    res.statusCode · res.json()


Layer-based

    controllers/  services/
    repositories/ models/

    easy on day one.
    then each holds user.js, order.js,
    payment.js and forty more.


Feature-based

    modules/
    ├── users/     routes service repo schema
    ├── orders/    routes service repo schema
    └── payments/  routes service repo schema


The test that decides it

    not "which looks tidier".

    WHAT HAPPENS WHEN YOU ADD A FEATURE?

    feature-based   one new folder
    layer-based     one new file in each of four,
                    and a reviewer who cannot see
                    the whole change at once

    and feature folders map onto Fastify plugins
    exactly:  one folder = one register
                        = one encapsulated scope


The layout, which is the whole day in a picture

    src/
    ├── app.js        composes
    ├── server.js     starts
    ├── plugins/      wrapped in fp()
    │                   others need these
    │   config · database · auth
    ├── modules/      NOT wrapped
    │                   nothing should reach in
    │   users/ · orders/
    └── utils/errors.js

    the folder boundary and the scope boundary
    are the SAME boundary.`,
      codeExample: {
        title: "The split, and the tests it buys you",
        code: `// ── src/app.js — composes, does not start ───────────────────
import Fastify from "fastify";
import config from "./plugins/config.js";
import database from "./plugins/database.js";
import userRoutes from "./modules/users/routes.js";
import orderRoutes from "./modules/orders/routes.js";

export function buildApp(opts = {}) {
  const app = Fastify({
    logger: true,
    ...opts,                    // so a test can pass logger: false
  });

  // Infrastructure. Wrapped in fp(), so these decorate the
  // root instance and every module can see them.
  app.register(config);
  app.register(database);

  // Features. Not wrapped, so each keeps its own scope.
  app.register(userRoutes, { prefix: "/api/users" });
  app.register(orderRoutes, { prefix: "/api/orders" });

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error });
    if (error.validation) {
      return reply.code(400).send({ error: "Bad Request", message: error.message });
    }
    if (error.statusCode && error.statusCode < 500) {
      return reply.code(error.statusCode).send({ error: error.message });
    }
    return reply.code(500).send({ error: "Internal Server Error", requestId: request.id });
  });

  return app;
}


// ── src/server.js — starts, does not compose ────────────────
import { buildApp } from "./app.js";

const app = buildApp();

try {
  await app.listen({
    port: Number(process.env.PORT ?? 3000),
    host: process.env.HOST ?? "0.0.0.0",     // container default
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

// Day 11's shutdown, so onClose actually runs.
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    app.log.info({ signal }, "shutting down");
    await app.close();          // drains, then fires onClose hooks
    process.exit(0);
  });
}


// ── src/modules/users/routes.js — a feature plugin ──────────
import { userResponseSchema, createUserSchema } from "./schema.js";
import { createUser, listUsers } from "./service.js";

export default async function userRoutes(app) {
  // app.db is here because database was wrapped in fp().
  // These routes are not visible outside this scope, which
  // is what you want.

  app.get("/", {
    schema: { response: { 200: { type: "array", items: userResponseSchema } } },
  }, async () => listUsers(app.db));

  app.post("/", {
    schema: {
      body: createUserSchema,
      response: { 201: userResponseSchema },
    },
  }, async (request, reply) => {
    const user = await createUser(app.db, request.body);
    return reply.code(201).send(user);
  });
}


// ── test/users.test.js — no port, no socket ─────────────────
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

test("POST /api/users rejects a body with no email", async (t) => {
  const app = buildApp({ logger: false });
  t.after(() => app.close());
  await app.ready();            // drain the register() queue

  const res = await app.inject({
    method: "POST",
    url: "/api/users",
    payload: { name: "Rajan" },
  });

  assert.equal(res.statusCode, 400);
  assert.match(res.json().message, /email/);
});

test("POST /api/users never returns passwordHash", async (t) => {
  const app = buildApp({ logger: false });
  t.after(() => app.close());

  const res = await app.inject({
    method: "POST",
    url: "/api/users",
    payload: { name: "Rajan", email: "rajan@example.com" },
  });

  assert.equal(res.statusCode, 201);
  assert.equal(res.json().passwordHash, undefined);
  //
  // That assertion is worth writing. It is testing the
  // response schema, which is the security boundary. If
  // someone later adds a field to the schema, this fails.
});

// $ node --test
//
// No listen(). No port. No collisions. No cleanup beyond
// app.close(). Every request goes through the entire
// lifecycle: hooks, validation, the handler, serialization.
//
// Day 13 complained that HTTP tests are slow and flaky.
// inject() is the answer, and the app.js / server.js split
// is what makes it available.`,
      },
      keyTakeaways: [
        "Split `app.js` (composes) from `server.js` (starts). The reason is `app.inject()`, not tidiness.",
        "`app.inject()` runs a full request through hooks, validation, the handler and serialization with no socket. Every verified fact today came from it.",
        "That removes Day 13's whole complaint about HTTP tests: no ports, no collisions, no waiting, and tests run in parallel.",
        "Call `await app.ready()` in a test before asserting on the instance, since `register()` is queued.",
        "Feature-based beats layer-based on one test: adding a feature is one new folder rather than one new file in each of four.",
        "Feature folders map onto Fastify plugins exactly. One folder, one `register`, one encapsulated scope.",
        "`plugins/` holds `fp()`-wrapped infrastructure; `modules/` holds unwrapped features. The folder boundary is the scope boundary.",
        "Assert that a response does not contain `passwordHash`. That test guards the response schema, which is the security boundary.",
      ],
      commonMistakes: [
        "Calling `listen()` inside `app.js`. Now importing the app to test it starts a server, and you are back to ports and cleanup.",
        "Testing routes by starting a real server on a fixed port. Two test files then cannot run at once.",
        "Asserting on the instance without `await app.ready()`. The plugin queue has not drained.",
        "Picking layer-based folders because they look organised, then touching four directories for every feature.",
        "Wrapping feature modules in `fp()` so \"everything just works\". You have flattened the structure you built the folders for.",
        "Only testing happy paths. The valuable assertions are the 400 on a bad body and the absence of `passwordHash` in the response.",
      ],
      quiz: [
        {
          question: "Why split `app.js` from `server.js`?",
          options: [
            "Convention",
            "So tests can use `app.inject()` to run full requests without opening a socket",
            "To reduce bundle size",
            "Fastify requires it",
          ],
          correctIndex: 1,
          explanation:
            "Every verified fact in today's lesson came from `inject()`. No ports, no collisions, and tests run in parallel.",
        },
        {
          question: "What does `app.inject()` skip, and what does it not skip?",
          options: [
            "It skips hooks and validation",
            "It skips the socket; hooks, validation, the handler and serialization all still run",
            "It skips serialization",
            "It only calls the handler",
          ],
          correctIndex: 1,
          explanation:
            "That is what makes it a real test rather than a unit test of the handler function.",
        },
        {
          question: "What is the deciding test between feature-based and layer-based folders?",
          options: [
            "Which has fewer files",
            "What happens when you add a feature: one new folder, or one new file in each of four folders",
            "Which is more common",
            "Which TypeScript prefers",
          ],
          correctIndex: 1,
          explanation:
            "And feature folders map onto Fastify plugins exactly: one folder, one register, one scope.",
        },
        {
          question: "Why does `plugins/` contain `fp()`-wrapped code and `modules/` not?",
          options: [
            "Arbitrary convention",
            "Infrastructure must be visible to others so it breaks out of its scope; features should not be visible so they stay encapsulated",
            "Plugins load faster",
            "`modules/` cannot use `fp()`",
          ],
          correctIndex: 1,
          explanation:
            "The folder boundary and the scope boundary are the same boundary, which is what makes the layout worth following.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "You `app.decorate(\"db\", pool)` inside a plainly registered plugin, then a sibling routes plugin reads `app.db`. What happens?",
      options: [
        "It works",
        "`app.db` is `undefined` and nothing errors, because `register()` gave each plugin its own child instance",
        "Fastify warns at startup",
        "The route returns 500 with a clear message",
      ],
      correctIndex: 1,
      explanation:
        "Verified both halves: `undefined` on the parent and `hasDecorator` false on a sibling. This is the most common Fastify bug and no message points at it.",
    },
    {
      question: "What is the one-line fix for that?",
      options: [
        "`app.register(plugin, { global: true })`",
        "Wrap the plugin in `fastify-plugin`",
        "Use `decorateRequest` instead",
        "Register it last",
      ],
      correctIndex: 1,
      explanation:
        "Verified side by side: plain register gives `undefined`, `fp()` gives the real value. Infrastructure breaks out, features stay in.",
    },
    {
      question: "A body schema lists `name` and `email`. A client also sends `isAdmin: true`. What does the handler receive?",
      options: [
        "A 400 instead",
        "All three fields, because JSON Schema allows unlisted properties by default",
        "Only `name` and `email`",
        "A 422",
      ],
      correctIndex: 1,
      explanation:
        "Verified. Which makes `db.insert(request.body)` a privilege escalation even on a validated route. `additionalProperties: false` strips it, and returns 200 rather than rejecting.",
    },
    {
      question: "Your handler returns `passwordHash` but the response schema does not list it. What is sent?",
      options: [
        "The whole object",
        "Only the listed fields; `passwordHash` never leaves the process",
        "A 500",
        "The field as `null`",
      ],
      correctIndex: 1,
      explanation:
        "Verified. A response schema is an allowlist, which makes it a security control rather than documentation.",
    },
    {
      question: "What is the verified hook order around the handler?",
      options: [
        "onRequest, preHandler, handler, onSend",
        "onRequest, preParsing, preValidation, preHandler, handler, preSerialization, onSend, onResponse",
        "onRequest, handler, onResponse",
        "preHandler, onRequest, handler, onSend",
      ],
      correctIndex: 1,
      explanation:
        "The handler is fourth of eight. The four stages most tutorials omit are the ones you reach for once you know they exist.",
    },
    {
      question: "Where do response-time metrics belong?",
      options: [
        "`onSend`",
        "`onResponse`, because the response is already sent so nothing there can delay the client",
        "`preHandler`",
        "Inside every handler",
      ],
      correctIndex: 1,
      explanation:
        "`onSend` still sits in front of the client. `onResponse` does not, which is what makes instrumentation free there.",
    },
    {
      question: "A handler calls `reply.send({ a: 1 })` and then `return { b: 2 }`. What does the client get?",
      options: [
        "`{\"b\":2}`",
        "`{\"a\":1}`, and the returned value is silently discarded",
        "Both merged",
        "A double-send error",
      ],
      correctIndex: 1,
      explanation:
        "Verified, with no warning. The real bug is a `reply.send()` in an early-exit branch with no `return` in front of it.",
    },
    {
      question: "What does Fastify bind to when no `host` is given, and why does that matter?",
      options: [
        "`0.0.0.0`, which is a security risk",
        "`127.0.0.1`, so in a container the port maps successfully and nothing can reach the process",
        "Every interface",
        "It refuses to start",
      ],
      correctIndex: 1,
      explanation:
        "Verified. Nothing errors; the requests just fail to connect. Set `0.0.0.0` in a container.",
    },
    {
      question: "Why does adding schemas make Fastify faster rather than slower?",
      options: [
        "Validation is skipped in production",
        "Each schema compiles into a specialised serializer at startup, which builds JSON directly instead of reflecting like `JSON.stringify`",
        "Responses are cached",
        "It uses a native JSON parser",
      ],
      correctIndex: 1,
      explanation:
        "The reputation for speed is mostly this, not the router. The schema you added for safety pays for itself twice.",
    },
    {
      question: "What does `app.inject()` give you that a real HTTP test does not?",
      options: [
        "It only calls the handler, so it is faster",
        "A full request through hooks, validation and serialization with no socket, so no ports, no collisions and tests run in parallel",
        "Automatic mocking of the database",
        "Type checking of responses",
      ],
      correctIndex: 1,
      explanation:
        "Every verified fact in today's lesson came from `inject()`. It is also why the `app.js` / `server.js` split is worth doing.",
    },
  ],
  project: {
    name: "day-15",
    goal: "Build a small Fastify API with the app.js and server.js split, one fp()-wrapped infrastructure plugin, one encapsulated feature module, schemas at the boundary, and tests that run through inject() with no socket.",
    brief:
      "The point of this build is not that it serves requests. It is that you reproduce the encapsulation bug on purpose, watch app.db come back undefined with nothing in the log, and then fix it with fastify-plugin. Doing that once is worth more than reading about it five times, because the failure has no error message and you will meet it again in a real codebase. Two other things to get right. Put a response schema on every route and then write a test asserting passwordHash is absent, so the security boundary has a test behind it. And use inject() rather than starting a server, because that is what the app.js split is for.",
    steps: [
      "Create `day-15/` with `package.json` containing `\"type\": \"module\"`, then `npm install fastify fastify-plugin`.",
      "Write `src/app.js` exporting `buildApp(opts)` that creates the instance, registers plugins and returns it. It must not call `listen()`.",
      "Write `src/server.js` that calls `buildApp()`, wraps `listen()` in try/catch with `app.log.error` and `process.exit(1)`, and handles SIGINT and SIGTERM with `await app.close()`.",
      "Confirm the startup guard works: start a second copy while the first runs, and compare the guarded log line against what an unguarded top-level await prints.",
      "Write `src/plugins/database.js` as a fake store (a `Map` is fine) that calls `app.decorate(\"db\", store)` and adds an `onClose` hook. Register it WITHOUT `fastify-plugin` first.",
      "Write `src/modules/users/routes.js` that reads `app.db`, register it, and hit the route. Record the exact error you get and confirm nothing was logged at startup.",
      "Now wrap the database plugin in `fp()`, change nothing else, and confirm the route works. Write down in one sentence why.",
      "Give the POST route a body schema with `name` and `email` required. Send an extra `isAdmin: true` field and confirm it reaches your handler.",
      "Add `additionalProperties: false`, send the same body again, and note that you get 200 with the field stripped rather than a 400.",
      "Give every route a response schema listing only `id`, `name` and `email`. Return an object containing `passwordHash` from the handler and confirm it does not reach the client.",
      "Add hooks at four stages: `onRequest` for an API key check, `preHandler` for `request.user`, `preSerialization` to add `requestId`, and `onResponse` for a timing log. Log the stage name in each and confirm the order.",
      "Move the API key hook inside a `register()` scope so `/health` is exempt, and confirm `/health` works without the key while the other routes do not.",
      "Write `test/users.test.js` with `node:test` and `app.inject()`: one test for a 400 on a bad body, one asserting `passwordHash` is absent, and one for the 404 path.",
      "Run `node --test` and confirm no port is ever opened.",
    ],
    acceptance: [
      "`src/app.js` never calls `listen()`, and `src/server.js` never registers a route.",
      "You reproduced `app.db is undefined` with a plainly registered plugin, and can state that the plugin ran successfully against a child instance.",
      "Wrapping that plugin in `fp()` fixed it with no other change, and you can say why in one sentence.",
      "You can state the rule for when to wrap: infrastructure breaks out, features stay in.",
      "You saw `isAdmin: true` reach your handler through a schema that did not list it, and can explain why `db.insert(request.body)` is dangerous.",
      "You confirmed `additionalProperties: false` strips rather than rejects, and got a 200.",
      "A route returns `passwordHash` from its handler and the client never sees it, with a test asserting that.",
      "Your four hooks logged in the verified order, with the handler between `preHandler` and `preSerialization`.",
      "`/health` works without an API key while the protected routes do not, achieved by scoping rather than an `if`.",
      "`node --test` passes and no socket was opened. `grep -r listen test/` finds nothing.",
      "An unguarded `listen()` failure and a guarded one produce visibly different output, and you can say which one you would want at 3am.",
    ],
    stretch: [
      "Add `required: [\"id\", \"name\"]` to a response schema and return an object missing `name`. Confirm the 500 and decide whether you want that failure.",
      "Add a `params` schema with `{ type: \"integer\" }` and confirm `typeof request.params.id` becomes `\"number\"` while `/users/abc` answers 400.",
      "Write a handler that calls `reply.send()` in an early-exit branch without `return`, then watch the wrong response go out with nothing logged.",
      "Throw an error whose message contains a fake connection string, see it in the 500 body, then add `setErrorHandler` so 5xx sends nothing but a request id.",
      "Register the same feature plugin twice with different `prefix` options and confirm both mount, which is encapsulation being useful rather than annoying.",
      "Set `logger: { transport: { target: \"pino-pretty\" } }` in development only, so you keep structured logs in production and readable ones locally.",
      "Build the same three routes in Express 5 and compare: count the lines you write for validation and for filtering the response.",
      "Deliberately register a route after `listen()` and read the `FST_ERR_INSTANCE_ALREADY_LISTENING` message, then explain why the router compiles at startup.",
    ],
  },
};
