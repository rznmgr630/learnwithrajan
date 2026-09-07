import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_21_LESSONS: LessonDay = {
  day: 21,
  title: "Logging and observability",
  totalMinutes: 118,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "structured-logging",
      title: "Structured logging with Pino",
      durationMinutes: 12,
      explanation:
        "```text\nLogs     what happened\nMetrics  how much, how often\nTraces   where a request went\n```\n\n---\n\n## Why `console.log` is not logging\n\n```javascript\nconsole.log(\"User created\");\n```\n\n> The problem is not the format, it is that a log line is only useful if you can <b>find it and connect it</b>. \"Payment failed\" tells you nothing about which payment, which user, which request or which instance, and in production those lines are interleaved with a thousand others. A message with no fields is a message you can only read, not query.\n\n---\n\n## Structured logging\n\n<b>Structured logging</b> (emitting log records as machine-readable data, usually JSON, rather than formatted text).\n\n```javascript\n{ \"level\": \"error\", \"msg\": \"Payment failed\", \"userId\": \"123\", \"requestId\": \"abc\" }\n```\n\n> The shift is from writing sentences to <b>attaching fields</b>. Once the fields are separate, your log system can answer \"every error for user 123\" or \"the p95 duration of this endpoint\", which is not a thing you can do with prose no matter how carefully you word it.\n\n---\n\n## Pino\n\n<b>Pino</b> (a fast Node.js structured logger that writes JSON to stdout).\n\nVerified output on Pino 10.3.1:\n\n```javascript\n{\"level\":30,\"time\":1788757102210,\"pid\":18790,\"hostname\":\"...\",\"userId\":123,\"msg\":\"User logged in\"}\n```\n\nThe object comes first and the message second: `logger.info({ userId: 123 }, \"User logged in\")`. That order is easy to get backwards, and reversed it puts your fields in the message slot where nothing can query them.\n\n---\n\n## Levels, and the two that are silent\n\n```text\ntrace  extremely detailed\ndebug  development\ninfo   normal events\nwarn   unusual\nerror  an operation failed\nfatal  cannot continue\n```\n\n> Verified: Pino's default level is `info`, so `logger.trace(...)` and `logger.debug(...)` produce <b>nothing at all</b>. No output, no warning. That is the correct default and it is also why people conclude their logger is broken, having sensibly put their detailed logging at `debug`.\n>\n> Make the level configuration, from Day 20: `debug` locally, `info` in production, and a variable you can raise during an incident.\n\nAnd pick the level by what someone should <b>do</b> about it. `logger.error(\"User opened profile\")` is noise that trains people to ignore errors. Reserve `error` for something that failed and `fatal` for something you cannot continue past.\n\n---\n\n## The error-key trap\n\n> This one is worth the whole lesson. Verified side by side:\n>\n> ```text\n> logger.error({ err: new Error(\"boom\") }, \"failed\")\n>   → \"err\":{\"type\":\"Error\",\"message\":\"boom\",\"stack\":\"Error: boom\\n at ...\"}\n>\n> logger.error({ error: new Error(\"boom\") }, \"failed\")\n>   → \"error\":{}\n> ```\n>\n> An <b>empty object</b>. Pino registers its error serializer under the key <b>`err`</b>, and an `Error` under any other key is serialised as a plain object, which has no enumerable properties. So the natural spelling silently discards the message and the stack, and the log line looks fine until you need it.\n>\n> Use `err`. It is the one field name in Node logging that is not a matter of taste.",
      diagram: `Three signals

    LOGS     what happened
    METRICS  how much, how often
    TRACES   where a request went


Why console.log is not logging

    console.log("User created")

    the problem is not the FORMAT.

    a log line is only useful if you can FIND IT
    AND CONNECT IT.

    "Payment failed" tells you nothing about
      which payment · which user
      which request · which instance

    and in production it is interleaved with a
    thousand others.

    → a message with no FIELDS is a message you
      can only READ, not QUERY.


Structured logging: attach fields, not sentences

    { "level":"error", "msg":"Payment failed",
      "userId":"123", "requestId":"abc" }

    once the fields are separate, your log system
    can answer

      "every error for user 123"
      "the p95 duration of this endpoint"

    which is not possible with prose, no matter
    how carefully worded.


Pino, verified on 10.3.1

    logger.info({ userId: 123 }, "User logged in")
                 ^^^^^^^^^^^^^   ^^^^^^^^^^^^^^^
                 object FIRST    message SECOND

    {"level":30,"time":...,"pid":...,
     "hostname":"...","userId":123,
     "msg":"User logged in"}

    ⚠ that order is easy to reverse, and reversed
      it puts your fields in the MESSAGE slot,
      where nothing can query them.


⚠ Levels: two of them are SILENT by default

    trace  extremely detailed
    debug  development
    info   normal            ← DEFAULT LEVEL
    warn   unusual
    error  an operation failed
    fatal  cannot continue

    VERIFIED: Pino's default level is info, so

      logger.trace(...)   →  nothing
      logger.debug(...)   →  nothing

    no output. no warning.

    that is the CORRECT default, and it is also
    why people conclude their logger is broken
    after sensibly putting detailed logging at
    debug.

    → make the level configuration (Day 20):
      debug locally, info in production, and
      raisable during an incident.


Pick the level by what someone should DO

    logger.error("User opened profile")
      → noise that TRAINS PEOPLE TO IGNORE ERRORS

    error  something failed
    fatal  you cannot continue past it


⚠⚠ THE ERROR-KEY TRAP

    verified side by side:

      { err: new Error("boom") }
        → "err":{"type":"Error",
                 "message":"boom",
                 "stack":"Error: boom\\n at ..."}

      { error: new Error("boom") }
        → "error":{}

    AN EMPTY OBJECT.

    Pino registers its error serializer under the
    key "err". an Error under any other key is
    serialised as a plain object, which has no
    enumerable properties.

    so the natural spelling SILENTLY DISCARDS the
    message and the stack, and the log line looks
    fine until you need it.

    use err. it is the one field name in Node
    logging that is not a matter of taste.`,
      codeExample: {
        title: "Pino, and the field name that matters",
        code: `import pino from "pino";
import { config } from "./config.js";
// Verified with pino 10.3.1

// ── The logger ──────────────────────────────────────────────
export const logger = pino({
  // Day 20: configuration, not a constant. debug locally,
  // info in production, raisable during an incident without
  // a code change.
  level: config.logging.level,

  // Fields on every line, so you can filter by service and
  // by deploy when four versions are running at once.
  base: {
    service: "users-api",
    version: process.env.GIT_SHA ?? "dev",
  },

  // Default is epoch milliseconds, which log systems prefer
  // and humans do not. Keep it in production.
  timestamp: pino.stdTimeFunctions.isoTime,

  // Day 19's redaction, and the next lesson covers what this
  // does and does not cover.
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "*.password"],
    censor: "[redacted]",
  },

  // Pretty printing is a DEVELOPMENT concern. In production
  // this must be plain JSON on stdout.
  transport: config.isProduction
    ? undefined
    : { target: "pino-pretty", options: { colorize: true } },
});


// ── Argument order, which is easy to reverse ────────────────
logger.info({ userId: 123 }, "User logged in");
// {"level":30,"time":"...","service":"users-api","userId":123,
//  "msg":"User logged in"}

// ✗ Reversed:
logger.info("User logged in", { userId: 123 });
// The object becomes an interpolation argument, so userId is
// not a field and nothing can query it. The line still looks
// broadly right in a terminal, which is the problem.


// ── ⚠ The error key. Verified. ──────────────────────────────
const err = new Error("boom");

logger.error({ err }, "with err");
// {"level":50,...,"err":{"type":"Error","message":"boom",
//  "stack":"Error: boom\\n    at file:///...:3:11\\n    at ..."},
//  "msg":"with err"}

logger.error({ error: err }, "with error");
// {"level":50,...,"error":{},"msg":"with error"}
//                  ^^^^^^^^^ VERIFIED. Empty.
//
// Why: pino registers its error serializer for the key "err".
// Under any other key an Error goes through JSON.stringify,
// and message and stack are non-enumerable, so you get {}.
//
// So this line, which reads perfectly:
//
//   catch (error) {
//     logger.error({ error }, "Database query failed");
//   }
//
// records that a database query failed and nothing about why.
// At 3am you have the message you wrote and none of the
// information you needed.

// ✓ Two ways to be safe.
catch (err) {
  logger.error({ err }, "Database query failed");
}

// Or register the serializer under both keys, if your team
// keeps writing \`error\`:
const logger2 = pino({
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },
});
// Reasonable. Standardising on \`err\` is better, because every
// other Node tool that reads logs already expects it.


// ── Levels chosen by what someone should do ─────────────────
logger.trace({ sql, params }, "query");            // never in prod
logger.debug({ cacheKey }, "cache miss");          // local only
logger.info({ userId, orderId }, "order created"); // a real event
logger.warn({ retryCount: 3 }, "payment retried"); // odd, not broken
logger.error({ err, orderId }, "payment failed");  // it failed
logger.fatal({ err }, "database unreachable at startup"); // cannot run

// ✗ The habit that ruins alerting:
logger.error("User opened profile");
// Now your error rate includes people browsing, so the metric
// that should page you is meaningless and everyone learns to
// ignore it.


// ── ⚠ The silent-level surprise. Verified. ──────────────────
const l = pino();
console.log(l.level);        // "info"

l.trace("trace line");       // no output
l.debug("debug line");       // no output
l.info("info line");         // {"level":30,...,"msg":"info line"}
//
// Verified: only the info, warn and error lines appeared.
//
// So the sequence that wastes an afternoon:
//   1. Add pino.
//   2. Put your detailed logging at debug, sensibly.
//   3. See nothing.
//   4. Conclude pino is broken or your setup is wrong.
//
// $ LOG_LEVEL=debug node --env-file=.env server.js


// ── Where logs go: stdout, and nowhere else ─────────────────
// ✗ pino.destination("/var/log/app.log")
//
//   In a container that file dies with the container. With
//   four instances you have four files on four hosts and no
//   way to search them together. And you have taken on
//   rotation, disk limits and permissions.
//
// ✓ Write JSON to stdout and let the platform collect it.
//
//   Node → stdout → Docker → log driver → aggregator
//
// Your application's job ends at stdout. That is also why the
// pino-pretty transport is development-only: it turns
// queryable JSON into pretty text that your aggregator can no
// longer parse into fields.


// ── One more thing worth doing on day one ───────────────────
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "uncaught exception");
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  logger.fatal({ err }, "unhandled rejection");
  process.exit(1);
});
// Day 4's rule with a logger attached: exit, and leave a
// record of why. Without these the process dies with a stack
// trace on stderr that your JSON pipeline may not capture as
// a structured event, so the one crash you most need to
// understand is the one you cannot query.`,
      },
      keyTakeaways: [
        "A log line is only useful if you can find it and connect it. A message with no fields can be read but not queried.",
        "Structured logging is a shift from writing sentences to attaching fields, which is what makes \"every error for user 123\" answerable.",
        "Pino takes the object first and the message second. Reversed, your fields land in the message slot where nothing can query them.",
        "Verified: Pino's default level is `info`, so `logger.trace` and `logger.debug` produce no output and no warning.",
        "That is why people think their logger is broken after sensibly putting detailed logging at `debug`. Make the level configuration.",
        "Verified and important: `{ err: error }` serialises type, message and stack; `{ error: error }` produces `\"error\":{}`.",
        "Pino registers its serializer under `err`, and `message` and `stack` are non-enumerable, so any other key gives an empty object.",
        "So `logger.error({ error }, \"Database query failed\")` records that it failed and nothing about why.",
        "Choose a level by what someone should do about it. `logger.error` for a browsing event makes your error rate meaningless.",
        "Write JSON to stdout and let the platform collect it. A log file in a container dies with the container.",
        "`pino-pretty` is development-only, because it converts queryable JSON into text your aggregator cannot parse into fields.",
        "Add `uncaughtException` and `unhandledRejection` handlers that log at `fatal` and exit, or the crash you most need is the one you cannot query.",
      ],
      commonMistakes: [
        "`logger.info(\"message\", { field })`, with the arguments reversed, so the fields are not fields.",
        "`logger.error({ error }, ...)`, which logs an empty object and discards the message and stack.",
        "Putting logging at `debug` and concluding the logger is broken, because the default level is `info`.",
        "Hard-coding the level instead of making it configuration you can raise during an incident.",
        "Using `error` for ordinary events, which makes the error rate useless and trains people to ignore alerts.",
        "Writing to a log file from the application, which dies with the container and cannot be searched across instances.",
        "Leaving `pino-pretty` enabled in production, so the aggregator receives text instead of fields.",
        "No `uncaughtException` handler, so the crash arrives as an unstructured stack trace.",
      ],
      quiz: [
        {
          question: "What does `logger.error({ error: new Error(\"boom\") }, \"failed\")` log?",
          options: [
            "The full error with its stack",
            "`\"error\":{}`, an empty object, because Pino's serializer is registered for the key `err` and `message` and `stack` are non-enumerable",
            "A warning about the key name",
            "Only the message",
          ],
          correctIndex: 1,
          explanation:
            "Verified side by side with `{ err }`, which produced type, message and stack. So the natural spelling silently discards everything useful.",
        },
        {
          question: "Why might a new Pino setup appear to produce no output?",
          options: [
            "It buffers",
            "The default level is `info`, so `trace` and `debug` calls produce nothing at all, with no warning",
            "It needs a transport",
            "It writes to stderr",
          ],
          correctIndex: 1,
          explanation:
            "Verified. Sensible logging at `debug` is invisible until you set the level, which should be configuration.",
        },
        {
          question: "What is wrong with `logger.info(\"User logged in\", { userId: 123 })`?",
          options: [
            "Nothing",
            "The arguments are reversed, so the object becomes an interpolation argument and `userId` is not a queryable field",
            "It logs at the wrong level",
            "It throws",
          ],
          correctIndex: 1,
          explanation:
            "The line still looks broadly right in a terminal, which is why this survives review.",
        },
        {
          question: "Why should the application write logs to stdout rather than a file?",
          options: [
            "Files are slower",
            "A file in a container dies with the container, and four instances mean four files on four hosts with no way to search them together",
            "Node cannot write files",
            "Files cannot hold JSON",
          ],
          correctIndex: 1,
          explanation:
            "You also take on rotation, disk limits and permissions for no benefit. The platform's job starts at stdout.",
        },
        {
          question: "Why is `pino-pretty` a development-only transport?",
          options: [
            "It is slow",
            "It converts queryable JSON into formatted text, which your aggregator can no longer parse into fields",
            "It requires a TTY",
            "It leaks secrets",
          ],
          correctIndex: 1,
          explanation:
            "The whole point of structured logging is the fields, and pretty printing removes them.",
        },
      ],
    },
    {
      id: "request-context",
      title: "Request IDs and AsyncLocalStorage",
      durationMinutes: 12,
      explanation:
        "## Request ID\n\n<b>Request ID</b> (a unique identifier attached to one incoming request so every log line from it can be found together).\n\n```text\nreq_abc123 → request started\nreq_abc123 → user authenticated\nreq_abc123 → creating order\nreq_abc123 → response 201\n```\n\n> With a thousand concurrent requests, interleaved log lines are individually readable and collectively useless. The request id is what turns a pile of lines into a <b>story</b>, and it is the single highest-value field you can add.\n\n---\n\n## Fastify gives you one\n\nVerified: Fastify assigns `request.id` and `request.log` is a child logger already carrying it.\n\n```text\n{\"level\":30,\"reqId\":\"req-1\",\"req\":{\"method\":\"GET\",\"url\":\"/\"},\"msg\":\"incoming request\"}\n{\"level\":30,\"reqId\":\"req-1\",\"custom\":1,\"msg\":\"inside handler\"}\n{\"level\":30,\"reqId\":\"req-1\",\"res\":{\"statusCode\":200},\"responseTime\":1.54,\"msg\":\"request completed\"}\n```\n\nSo `request.log.info(...)` from Day 15 is correlated for free, and you get `responseTime` on every request without writing it.\n\n> One thing to fix, though. The default ids are <b>`req-1`, `req-2`</b>, counting up per process. Verified. With ten instances there are ten `req-1`s in your aggregator, and a search for one returns fragments of ten unrelated requests.\n\n---\n\n## Accept the upstream id\n\nVerified with `genReqId`:\n\n```text\nx-request-id: trace-from-gateway   →  reqId \"trace-from-gateway\"\nno header                          →  reqId \"gen-tec5cc\"\n```\n\n> Taking the incoming header when there is one is what makes correlation work <b>across services</b>: the gateway's id appears in your logs and in the next service's, so one search follows the request through the whole system. Generating a unique fallback covers direct callers.\n>\n> One caution: that header is client-controlled, so bound its length and character set, and do not treat it as trustworthy for anything but correlation.\n\n---\n\n## AsyncLocalStorage\n\n<b>AsyncLocalStorage</b> (a Node API for carrying context through asynchronous operations without passing it as an argument).\n\n```text\nhandler → service → repository → database\n```\n\n> The problem it solves is that `request.log` exists in the handler and not four layers down, so the choice is either threading the logger through every function signature or losing correlation exactly where the interesting logs are.\n>\n> Verified: context set with `als.run()` is visible after an `await` and a `setTimeout`, is `undefined` outside any run, and two concurrent requests do not see each other's values.\n\n```javascript\nals.run({ requestId }, () => handler());\n// ...four layers down...\nals.getStore().requestId    // still there\n```\n\n---\n\n## The mistake to know about\n\n> Verified: capture the store object in one request and read it during another, and you get the <b>first</b> request's value.\n>\n> ```text\n> captured.requestId  →  \"req-1\"     while the current run is req-2\n> ```\n>\n> So call `getStore()` at the moment you need the value, and never hold a reference to it. Anything that caches the store, including a module-level logger built once from it, silently reports the wrong request forever, which is worse than having no correlation at all.\n\n---\n\n## The honest cost\n\n> It is implicit context, so a function's dependencies stop being visible in its signature and a unit test has to remember to wrap the call in `als.run()`. That is a real trade, and the way to keep it small is to use it for <b>cross-cutting</b> concerns only, logging and tracing, and to keep passing real dependencies like a database handle explicitly. Day 17's transaction lesson is the counter-example: a `tx` passed implicitly is how you silently escape a transaction.",
      diagram: `Request ID: the highest-value field there is

    req_abc123 → request started
    req_abc123 → user authenticated
    req_abc123 → creating order
    req_abc123 → response 201

    with a thousand concurrent requests,
    interleaved lines are individually readable
    and collectively USELESS.

    the request id turns a pile of lines into a
    STORY.


Fastify gives you one. Verified.

    request.id            the id
    request.log           a child logger already
                          carrying it

    {"reqId":"req-1","req":{...},
     "msg":"incoming request"}
    {"reqId":"req-1","custom":1,
     "msg":"inside handler"}
    {"reqId":"req-1","res":{"statusCode":200},
     "responseTime":1.54,
     "msg":"request completed"}

    so request.log.info(...) is correlated for
    free, and responseTime arrives without you
    writing it.


⚠ But the default ids collide across instances

    verified: req-1, req-2, counting up
              PER PROCESS

    ten instances → ten req-1s in your aggregator

    a search for one returns fragments of ten
    unrelated requests.


✓ Accept the upstream id. Verified.

    x-request-id: trace-from-gateway
      →  reqId "trace-from-gateway"

    no header
      →  reqId "gen-tec5cc"

    taking the incoming header is what makes
    correlation work ACROSS SERVICES:

      the gateway's id appears in your logs AND
      in the next service's

      → one search follows the request through
        the whole system

    ⚠ that header is CLIENT-CONTROLLED.
      bound its length and character set, and
      trust it for correlation only.


AsyncLocalStorage: the problem it solves

    handler → service → repository → database

    request.log exists in the HANDLER and not
    four layers down.

    so the choice is:
      thread the logger through every signature
      or lose correlation exactly where the
        interesting logs are

    verified:
      context survives await AND setTimeout
      undefined outside any run
      two concurrent requests do not see each
        other's values


⚠⚠ The mistake to know about

    verified: capture the store in one request,
    read it during another, and you get the FIRST
    request's value.

      captured.requestId  →  "req-1"
      while the current run is req-2

    → call getStore() AT THE MOMENT YOU NEED IT.
      never hold a reference.

    anything that caches the store, including a
    module-level logger built once from it,
    silently reports the WRONG REQUEST FOREVER.

    which is worse than having no correlation at
    all.


⚠ The honest cost

    it is IMPLICIT context.

      a function's dependencies stop being
      visible in its signature

      a unit test must remember to wrap the call
      in als.run()

    keep it small: use it for CROSS-CUTTING
    concerns only (logging, tracing), and keep
    passing real dependencies like a database
    handle EXPLICITLY.

    Day 17's transaction lesson is the
    counter-example: a tx passed implicitly is
    how you silently escape a transaction.`,
      codeExample: {
        title: "Correlation that survives four layers and ten instances",
        code: `import Fastify from "fastify";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { z } from "zod";


// ── ⚠ Fastify's default ids collide. Verified. ──────────────
const plain = Fastify({ logger: true });
// reqId: "req-1", "req-2", "req-3", ... per process.
//
// Ten pods each start at req-1. In your aggregator a search
// for reqId:"req-1" returns the first request from every
// instance, interleaved, which looks exactly like one very
// confusing request.


// ── ✓ Accept the upstream id, generate a unique fallback ────
const requestIdSchema = z.string().min(1).max(128).regex(/^[\\w.-]+$/);

const app = Fastify({
  logger: { level: config.logging.level, base: { service: "users-api" } },

  genReqId(req) {
    const incoming = req.headers["x-request-id"];
    // Client-controlled, so validate it. An unbounded header
    // becomes an unbounded field on every log line, and a
    // newline in it can forge log entries.
    const parsed = requestIdSchema.safeParse(incoming);
    return parsed.success ? parsed.data : randomUUID();
  },
});
// Verified:
//   x-request-id: trace-from-gateway  ->  reqId "trace-from-gateway"
//   no header                         ->  a generated id
//
// And echo it back, so a client can quote it in a bug report:
app.addHook("onSend", async (request, reply, payload) => {
  reply.header("x-request-id", request.id);
  return payload;
});


// ── The context store ───────────────────────────────────────
const requestContext = new AsyncLocalStorage();

export function currentContext() {
  return requestContext.getStore();
}

// A logger that reads the context AT CALL TIME.
export function log() {
  return currentContext()?.logger ?? logger;
}
//      ^^^^^^^^^^^^^^^^^^ note this is a FUNCTION, not a
//      cached value. The next section shows why that matters.

app.addHook("onRequest", (request, reply, done) => {
  requestContext.run(
    {
      requestId: request.id,
      logger: request.log,        // already carries reqId
      userId: undefined,          // filled in by auth later
    },
    done,
  );
});
//  Day 15's hook order: onRequest is first, so everything
//  downstream runs inside the store. Note \`done\` rather than
//  an async hook: the callback form is what keeps the rest of
//  the request inside run().

app.addHook("preHandler", async (request) => {
  // Day 18's auth ran; now enrich the context.
  const ctx = currentContext();
  if (ctx && request.user) ctx.userId = request.user.id;
});


// ── Four layers down, with no plumbing ──────────────────────
// modules/orders/repository.js
export async function insertOrder(db, order) {
  log().debug({ orderId: order.id }, "inserting order");
  //  ^^^^^ carries reqId and userId, and this function's
  //  signature never mentioned a logger
  return db.insert(orders).values(order).returning();
}

// modules/orders/service.js
export async function createOrder(db, input) {
  log().info({ total: input.total }, "creating order");
  const [order] = await insertOrder(db, input);
  log().info({ orderId: order.id }, "order created");
  return order;
}
//
// Note what is still explicit: \`db\`. Day 17's rule holds. A
// database handle passed implicitly is how a query escapes a
// transaction, and that failure is silent and expensive.
// Logging is cross-cutting; data access is not.

// modules/orders/routes.js
export default async function orderRoutes(app) {
  app.post("/orders", { preHandler: authenticate }, async (request, reply) => {
    const order = await createOrder(app.db, request.body);
    return reply.code(201).send(order);
  });
}
//
// Every line from this request, across all four files, carries
// the same reqId. One search in your aggregator returns the
// whole story in order.


// ── ⚠⚠ The mistake. Verified. ───────────────────────────────
// Context survives await and setTimeout:
async function repository() { return currentContext()?.requestId ?? "(none)"; }
async function service()    { await new Promise(r => setTimeout(r, 5)); return repository(); }
async function handler(id)  { return requestContext.run({ requestId: id }, () => service()); }

await handler("req-abc");     // "req-abc"        ← verified
currentContext();             // undefined        ← verified

const [a, b] = await Promise.all([handler("req-A"), handler("req-B")]);
// "req-A", "req-B"            ← verified, no leakage

// ✗ And here is the trap:
let captured;
await requestContext.run({ requestId: "req-1" }, async () => {
  captured = currentContext();
});
await requestContext.run({ requestId: "req-2" }, async () => {
  captured.requestId;          // "req-1"   ← VERIFIED. WRONG.
  currentContext().requestId;  // "req-2"   ← correct
});
//
// So this is a bug that will outlive you:
//
//   // ✗ services/mailer.js
//   const mailerLog = log();      // ← evaluated ONCE, at import
//
//   export function send(to) {
//     mailerLog.info({ to }, "sending mail");
//   }
//
// At import time there is no request, so it captures the base
// logger and every mail log line has no reqId. Or worse, if
// the module is lazily imported during the first request, it
// captures THAT request's logger and every mail line for the
// rest of the process is stamped with one long-dead request id.
//
// Which is worse than no correlation, because the field is
// present and confidently wrong.
//
// ✓ Call it every time:
//   export function send(to) {
//     log().info({ to }, "sending mail");
//   }


// ── Tests have to opt in ───────────────────────────────────
test("createOrder logs with a request id", async () => {
  await requestContext.run({ requestId: "test-1", logger: testLogger }, async () => {
    await createOrder(db, { total: 100 });
  });
  assert.equal(testLogger.lines[0].reqId, "test-1");
});
// Without the wrapper, log() falls back to the base logger.
// The fallback is deliberate: a missing context should degrade
// to an uncorrelated log line, never throw. A logger that
// throws because it has no request is a logger that turns a
// background job into an outage.


// ── What this buys, concretely ──────────────────────────────
// A user reports "my order failed at about 14:20". You ask for
// the request id from the error page, which the onSend hook
// put in the response header, and search it:
//
//   reqId:"a3f2-..." 
//
//   14:20:01  incoming request  POST /orders
//   14:20:01  authenticated     userId=8811
//   14:20:01  creating order    total=4200
//   14:20:01  inserting order   orderId=91
//   14:20:03  payment failed    err.message="card_declined"
//   14:20:03  request completed statusCode=402 responseTime=2104
//
// Six lines, in order, with the reason. Without correlation
// those six lines are somewhere among four hundred thousand.`,
      },
      keyTakeaways: [
        "A request id turns interleaved log lines into a story, and it is the highest-value field you can add.",
        "Verified: Fastify assigns `request.id`, gives you `request.log` as a child logger carrying it, and logs `responseTime` automatically.",
        "Verified: default ids are `req-1`, `req-2` per process, so ten instances produce ten `req-1`s and a search returns fragments of ten requests.",
        "Use `genReqId` to accept an incoming `x-request-id`, which is what makes correlation work across services, with a generated fallback.",
        "Validate that header. It is client-controlled, and an unbounded or newline-containing value pollutes or forges log entries.",
        "Echo the id back in a response header so a user can quote it in a bug report.",
        "Verified: `AsyncLocalStorage` context survives `await` and `setTimeout`, is `undefined` outside a run, and does not leak between concurrent requests.",
        "Verified trap: a captured store keeps the first request's value. `captured.requestId` was `req-1` inside a `req-2` run.",
        "So call `getStore()` at use time. A module-level logger built once from the store is confidently wrong forever, which is worse than no correlation.",
        "The cost is implicit context: dependencies leave the signature and tests must wrap calls in `als.run()`.",
        "Keep it to cross-cutting concerns. Pass a database handle explicitly, because Day 17 showed an implicit `tx` silently escapes the transaction.",
        "Make a missing context degrade to an uncorrelated line rather than throw, or a background job becomes an outage.",
      ],
      commonMistakes: [
        "Relying on Fastify's default `req-1` ids across multiple instances, so ids collide in the aggregator.",
        "Accepting `x-request-id` without validating length or characters, so a client can inject newlines into your logs.",
        "Not echoing the request id back, so a user reporting a problem has nothing to quote.",
        "Threading a logger through every function signature instead of using context for a cross-cutting concern.",
        "Capturing `getStore()` into a variable or a module-level logger, which reports the wrong request forever.",
        "Putting a database handle or a transaction in the async store, which is how a query silently escapes a transaction.",
        "Throwing when there is no context, so a cron job or a startup task crashes on its first log line.",
        "Forgetting to wrap unit tests in `als.run()`, then concluding correlation does not work.",
      ],
      quiz: [
        {
          question: "What is wrong with Fastify's default request ids in a multi-instance deployment?",
          options: [
            "They are too long",
            "They are `req-1`, `req-2` per process, so ten instances each produce a `req-1` and a search returns fragments of ten unrelated requests",
            "They are not logged",
            "They change on retry",
          ],
          correctIndex: 1,
          explanation:
            "Verified. Use `genReqId` to accept an upstream `x-request-id` with a unique generated fallback.",
        },
        {
          question: "Why accept an incoming `x-request-id` header?",
          options: [
            "It is faster than generating one",
            "The same id then appears in the gateway's logs, yours and the next service's, so one search follows the request through the whole system",
            "Fastify requires it",
            "It avoids collisions within one process",
          ],
          correctIndex: 1,
          explanation:
            "Validate it though: it is client-controlled, so bound the length and characters and trust it only for correlation.",
        },
        {
          question: "What was verified about capturing the AsyncLocalStorage store?",
          options: [
            "It stays current",
            "A captured store keeps the first request's value: `captured.requestId` was `req-1` while the current run was `req-2`",
            "Capturing throws",
            "It becomes `undefined`",
          ],
          correctIndex: 1,
          explanation:
            "So a module-level logger built once from the store reports the wrong request forever, which is worse than having no field at all.",
        },
        {
          question: "What should you keep out of the async context store?",
          options: [
            "The request id",
            "A database handle or transaction, because Day 17 showed an implicitly passed `tx` is how a query silently escapes its transaction",
            "The logger",
            "The user id",
          ],
          correctIndex: 1,
          explanation:
            "Use implicit context for cross-cutting concerns only. Data access stays explicit in the signature.",
        },
        {
          question: "Why should a missing context degrade rather than throw?",
          options: [
            "To keep tests simple",
            "A background job, cron task or startup step has no request, and a logger that throws there turns a log line into an outage",
            "Throwing is slow",
            "It never happens",
          ],
          correctIndex: 1,
          explanation:
            "Fall back to the base logger, accept an uncorrelated line, and keep the process alive.",
        },
      ],
    },
    {
      id: "redaction-and-log-hygiene",
      title: "Redaction, and what logs are actually for",
      durationMinutes: 11,
      explanation:
        "## Never log these\n\n```text\npassword · credit card · JWT · API key · refresh token · session cookie\n```\n\n> The reason is that <b>logs have a different security posture from your database</b>. They are retained for months, shipped to a third-party service, readable by anyone on call, indexed for search, and often exported into a data warehouse. A secret in a log is a secret in five systems with a broader access list than the one you carefully protected.\n>\n> And it is usually not a deliberate log of a password. It is `logger.info({ body: request.body }, \"request\")` on a login route.\n\n---\n\n## Redaction\n\n<b>Redaction</b> (removing or masking sensitive values before they are written).\n\nVerified with Pino:\n\n```text\npaths: [\"password\", \"req.headers.authorization\", \"*.token\"]\n\n{ password: \"hunter2\" }                     → \"password\":\"[redacted]\"\n{ req: { headers: { authorization: ... } } } → \"[redacted]\"\n{ session: { token: \"secret\" } }             → \"[redacted]\"\n{ user: { password: \"...\" } }                → NOT REDACTED\n```\n\n> That last line is the one to take away. Redaction is <b>path-based, not name-based</b>. `password` matches the top level only, so `user.password` sails straight through. Verified.\n>\n> So a nested object is a hole, and nested objects are exactly what you log when you log a whole entity. Use wildcards deliberately: `\"*.password\"` covers one level of nesting, and `paths` needs to describe the shapes you actually log.\n\n---\n\n## Redaction is the second line\n\n> The first line is <b>not logging it</b>. A redaction list only protects the paths someone thought of, and the field that leaks will be the one added last month. So log identifiers rather than objects: `userId` rather than `user`, `orderId` rather than the order.\n>\n> That is also better logging. A whole entity in a log line is expensive to store, mostly irrelevant, and stale by the time you read it. The id lets you look up what it is now.\n\n---\n\n## What actually leaks\n\n```text\nlogger.info({ req: request }, \"incoming\")      the Authorization header\nlogger.error({ err }, \"query failed\")           the SQL, sometimes with values\nlogger.info({ config }, \"starting\")             DATABASE_URL's password\nlogger.debug({ user }, \"loaded\")                passwordHash, resetToken\nURLs with tokens in query strings               logged by every proxy in the path\n```\n\n> The last one deserves attention because you cannot redact it in your application. A token in a query string is logged by your load balancer, your CDN, your reverse proxy and any monitoring in between, all before your code runs. That is why Day 18 put the refresh token in a cookie: a header or a cookie is not part of the URL, and URLs get logged everywhere by default.\n\n---\n\n## Sampling and volume\n\n> Logging is not free. Every line costs CPU to serialise, bandwidth to ship and money to store, and a `debug` line on a hot path can cost more than the work it describes.\n>\n> Two habits. Keep the <b>level</b> configurable so production runs at `info` and you can raise it temporarily. And for very high-volume paths, log a <b>sample</b> of successes and all of the failures, since the hundredth identical success line tells you nothing the first one did not.\n\n---\n\n## Logs are not an audit trail\n\n> Worth separating, because they get conflated. A log is <b>diagnostic</b>: best-effort, sampled, dropped under pressure, deleted after thirty days. An <b>audit trail</b> is a record you may need in a year to answer who changed a permission, and that belongs in a database table with the same durability as the change itself. If \"who deleted this account?\" must be answerable, do not let the answer live only in a log line that may have been sampled away.",
      diagram: `Why a secret in a log is worse than it sounds

    LOGS HAVE A DIFFERENT SECURITY POSTURE FROM
    YOUR DATABASE.

      retained for months
      shipped to a third-party service
      readable by anyone on call
      indexed for search
      exported to a data warehouse

    a secret in a log is a secret in FIVE SYSTEMS
    with a broader access list than the one you
    carefully protected.

    and it is rarely a deliberate log of a
    password. it is

      logger.info({ body: request.body }, "request")

    on a login route.


⚠⚠ Redaction is PATH-based, not NAME-based

    verified with
      paths: ["password",
              "req.headers.authorization",
              "*.token"]

    { password: "hunter2" }
      →  "[redacted]"          ✓
    { req: { headers: { authorization } } }
      →  "[redacted]"          ✓
    { session: { token } }
      →  "[redacted]"          ✓
    { user: { password } }
      →  NOT REDACTED          ✗

    "password" matches the TOP LEVEL ONLY, so
    user.password sails straight through.

    and a nested object is exactly what you log
    when you log a whole ENTITY.

    → use wildcards deliberately.
      "*.password" covers ONE level of nesting.
      paths must describe the shapes you actually
      log.


Redaction is the SECOND line

    the FIRST line is NOT LOGGING IT.

    a redaction list only protects the paths
    somebody THOUGHT OF, and the field that leaks
    will be the one added last month.

    → log IDENTIFIERS, not objects.

      userId   not  user
      orderId  not  the order

    which is also better logging: a whole entity
    is expensive to store, mostly irrelevant, and
    STALE by the time you read it.

    the id lets you look up what it is NOW.


What actually leaks

    { req: request }      the Authorization header
    { err }               the SQL, sometimes with
                          values
    { config }            DATABASE_URL's password
    { user }              passwordHash, resetToken

    a token in a URL QUERY STRING
      ← you cannot redact this


⚠ The one you cannot fix in your app

    a token in a query string is logged by
      your load balancer
      your CDN
      your reverse proxy
      any monitoring in between

    ALL BEFORE YOUR CODE RUNS.

    → which is why Day 18 put the refresh token
      in a COOKIE.

      a header or a cookie is not part of the URL,
      and URLs get logged everywhere by default.


Logging is not free

    every line costs
      CPU to serialise
      bandwidth to ship
      money to store

    a debug line on a hot path can cost more than
    the work it describes.

    two habits:

      keep the LEVEL configurable, so production
      runs at info and you can raise it

      SAMPLE successes on very high-volume paths,
      keep all failures

        the hundredth identical success line
        tells you nothing the first one did not


⚠ Logs are not an audit trail

    LOG            diagnostic
                   best-effort · sampled
                   dropped under pressure
                   deleted after 30 days

    AUDIT TRAIL    a record you may need in a YEAR
                   who changed a permission
                   → a DATABASE TABLE, with the
                     same durability as the change

    if "who deleted this account?" must be
    answerable, do not let the answer live only in
    a log line that may have been sampled away.`,
      codeExample: {
        title: "Redaction that covers your real shapes, and what not to log",
        code: `import pino from "pino";

// ── ⚠ Redaction is path-based. Verified. ────────────────────
const logger = pino({
  redact: {
    paths: ["password", "req.headers.authorization", "*.token"],
    censor: "[redacted]",
  },
});

logger.info({ email: "a@b.c", password: "hunter2" }, "login");
// {"email":"a@b.c","password":"[redacted]","msg":"login"}     ✓

logger.info({ req: { headers: { authorization: "Bearer abc" } } }, "req");
// {"req":{"headers":{"authorization":"[redacted]"}}}          ✓

logger.info({ session: { token: "secret-token" } }, "nested wildcard");
// {"session":{"token":"[redacted]"}}                          ✓

logger.info({ user: { password: "not-redacted?" } }, "nested");
// {"user":{"password":"not-redacted?"}}                       ✗
//                      ^^^^^^^^^^^^^^ VERIFIED. Straight
//                      through, because "password" is a
//                      top-level path and this is nested.
//
// And \`{ user }\` is exactly the shape you log when you log an
// entity, which is the shape people log most.


// ── ✓ A list that matches what you actually log ─────────────
const logger2 = pino({
  redact: {
    paths: [
      // Request shapes, from Fastify's own serializers
      "req.headers.authorization",
      "req.headers.cookie",
      "req.headers['x-api-key']",
      "req.body.password",
      "req.body.passwordConfirmation",
      "req.body.token",
      "res.headers['set-cookie']",

      // Top level and one level of nesting, for entities
      "password", "*.password",
      "passwordHash", "*.passwordHash",
      "token", "*.token",
      "refreshToken", "*.refreshToken",
      "resetToken", "*.resetToken",
      "totpSecret", "*.totpSecret",
      "secret", "*.secret",
      "apiKey", "*.apiKey",
      "authorization", "*.authorization",

      // Day 20: this contains a password
      "DATABASE_URL", "*.DATABASE_URL",
      "connectionString", "*.connectionString",
    ],
    censor: "[redacted]",
    // remove: true would delete the key instead of masking it.
    // Masking is better: seeing "password":"[redacted]" tells
    // you the field was present, which is information when you
    // are auditing what you log.
  },
});
//
// Note the two-entry pattern for every entity field. Without
// the "*." variant, one nested object undoes the protection,
// and Pino does not warn you that a path never matched
// anything.


// ── ✓ But the real fix is not logging it ────────────────────
// ✗ Logs the whole user, and relies on redaction being right.
logger.info({ user }, "user loaded");

// ✓ Logs what you would actually search on.
logger.info({ userId: user.id }, "user loaded");
//
// Three reasons this is better, and only one is security:
//   · a redaction list only covers fields someone thought of,
//     and the leak will be the column added last month
//   · the whole entity costs storage and is mostly irrelevant
//   · it is STALE. The id lets you look up what the record is
//     now, which is what you actually want at 3am.

// ✓ And when you do need fields, choose them.
logger.info({
  userId: user.id,
  plan: user.plan,
  emailVerified: user.emailVerified,
}, "user loaded");


// ── ⚠ The leak your application cannot fix ──────────────────
// ✗ GET /reset-password?token=a1b2c3d4...
//
// That URL is now in:
//   your load balancer's access log
//   your CDN's log
//   any reverse proxy in the path
//   your own access log
//   the user's browser history
//   the Referer header sent to any third-party
//     script on the page
//
// All of it before your handler runs, so no redaction of
// yours can help.
//
// ✓ POST the token in a body, or put it in a header, or use
//   a cookie as Day 18 did for the refresh token. Anything
//   that is not part of the URL.
//
// If a token must appear in a link somebody clicks, make it
// single-use and short-lived, which Day 18's reset flow
// already required for exactly this reason.


// ── The startup log that publishes your password ────────────
// ✗ logger.info({ config }, "starting");
//   config.database.url contains the password. Day 20.

// ✓ Log the shape, not the values.
logger.info({
  nodeEnv: config.nodeEnv,
  port: config.server.port,
  database: new URL(config.database.url).host,
  logLevel: config.logging.level,
  features: Object.entries(config.features)
    .filter(([, on]) => on)
    .map(([name]) => name),
}, "starting");
// Useful on every deploy: you can see which build got which
// configuration and which flags were on, with no credentials.


// ── Sampling a hot path ─────────────────────────────────────
app.addHook("onResponse", async (request, reply) => {
  const failed = reply.statusCode >= 400;
  const slow = reply.elapsedTime > 500;

  // Keep every failure and every slow request. Sample the
  // boring successes.
  if (failed || slow || Math.random() < config.logging.sampleRate) {
    request.log.info({
      method: request.method,
      route: request.routeOptions?.url ?? request.url,
      //     ^^^^^^^^^^^^^^^^^^^^^^^^ the ROUTE PATTERN, not
      //     the URL. "/users/:id" groups; "/users/8811" gives
      //     you a million distinct values and no aggregate.
      status: reply.statusCode,
      ms: Math.round(reply.elapsedTime),
      userId: request.user?.id,
    }, "request completed");
  }
});
// Note the route pattern. This is the single most common
// mistake in request logging: logging the raw URL means you
// can never ask "what is the p95 of GET /users/:id" because
// every request is its own unique value.


// ── ⚠ Logs are not an audit trail ───────────────────────────
// ✗ logger.info({ actorId, targetUserId }, "user deleted");
//
//   Sampled away, retained 30 days, and gone. In eleven
//   months, "who deleted this account?" has no answer.

// ✓ A table, written in the same transaction as the change.
await db.transaction(async (tx) => {
  await tx.delete(users).where(eq(users.id, targetUserId));

  await tx.insert(auditLog).values({
    actorId: request.user.id,
    action: "user.deleted",
    targetType: "user",
    targetId: targetUserId,
    requestId: request.id,        // ← ties it back to the logs
    ip: request.ip,
    at: new Date(),
  });
});
// Day 17's rule: one transaction, every statement on tx, so
// the record and the change cannot disagree.
//
// And note requestId on the row. The audit table answers
// "who and when" durably; the request id lets you jump to the
// diagnostic logs for the same action while they still exist.
// Two systems, two jobs, one join key.`,
      },
      keyTakeaways: [
        "Logs have a different security posture from your database: retained for months, shipped to third parties, readable by anyone on call and often exported.",
        "The leak is rarely a deliberate password log. It is `logger.info({ body: request.body })` on a login route.",
        "Verified: Pino redaction is path-based, not name-based. `password` covers the top level and `user.password` goes straight through.",
        "So every entity field needs both entries, `\"password\"` and `\"*.password\"`, and Pino does not warn when a path never matches.",
        "Redaction is the second line. The first is logging identifiers rather than objects, because a list only covers fields someone thought of.",
        "Logging `userId` instead of `user` is also better logging: cheaper, more relevant, and not stale by the time you read it.",
        "A token in a URL query string is logged by your load balancer, CDN, proxies and the browser's history before your code runs, so no redaction helps.",
        "That is why Day 18 put the refresh token in a cookie. Headers and cookies are not part of the URL.",
        "Log the route pattern, not the raw URL, or you can never compute a p95 per endpoint because every request is a unique value.",
        "Keep every failure and slow request; sample the boring successes on hot paths, since the hundredth identical line adds nothing.",
        "Never log the whole config object. `DATABASE_URL` contains a password, so log the host.",
        "Logs are diagnostic and an audit trail is a durable record. Write audit rows in the same transaction as the change, with the request id as a join key.",
      ],
      commonMistakes: [
        "Logging `request.body` on any authentication route, which publishes passwords and tokens.",
        "Assuming a `password` redaction path covers `user.password`. Verified that it does not.",
        "Relying only on a redaction list, which protects the fields someone thought of and not the column added last month.",
        "Logging whole entities, which is expensive, mostly irrelevant and stale.",
        "Putting a token in a query string, which is logged by every proxy in the path before your code runs.",
        "Logging the raw URL rather than the route pattern, making per-endpoint aggregates impossible.",
        "Logging the config object at startup, which publishes the database password.",
        "Treating logs as an audit trail, so \"who deleted this?\" has no answer after the retention window.",
        "Writing the audit row outside the transaction, so the change can succeed while the record does not.",
      ],
      quiz: [
        {
          question: "Pino is configured with `paths: [\"password\"]`. What happens to `{ user: { password: \"x\" } }`?",
          options: [
            "It is redacted",
            "It is logged in full, because redaction is path-based and `password` matches only the top level",
            "Pino throws",
            "The whole object is dropped",
          ],
          correctIndex: 1,
          explanation:
            "Verified. Every entity field needs both `\"password\"` and `\"*.password\"`, and Pino does not warn that a path never matched.",
        },
        {
          question: "Why is logging `userId` better than logging `user`?",
          options: [
            "Only for security",
            "A redaction list only covers fields someone thought of, and the entity is also expensive, mostly irrelevant and stale by the time you read it",
            "Ids are shorter",
            "Objects cannot be indexed",
          ],
          correctIndex: 1,
          explanation:
            "The id lets you look up what the record is now, which is what you actually want during an incident.",
        },
        {
          question: "Why can you not redact a token that appears in a URL query string?",
          options: [
            "Pino cannot see URLs",
            "It is already logged by your load balancer, CDN and proxies, plus the browser history and `Referer`, before your code runs",
            "URLs are encrypted",
            "You can, with a wildcard",
          ],
          correctIndex: 1,
          explanation:
            "This is why Day 18 used a cookie for the refresh token. Headers and cookies are not part of the URL.",
        },
        {
          question: "Why log the route pattern rather than the raw URL?",
          options: [
            "It is shorter",
            "Logging `/users/8811` gives a million distinct values, so you can never compute a p95 for `GET /users/:id`",
            "The URL may contain secrets only",
            "Fastify requires it",
          ],
          correctIndex: 1,
          explanation:
            "The route pattern groups requests into something you can aggregate. This is the most common request-logging mistake.",
        },
        {
          question: "What is the difference between a log and an audit trail?",
          options: [
            "None, they are the same",
            "A log is diagnostic, sampled and deleted after weeks; an audit trail is a durable database record written in the same transaction as the change",
            "Audit trails are unstructured",
            "Logs last longer",
          ],
          correctIndex: 1,
          explanation:
            "Put the request id on the audit row, so the durable record and the diagnostic logs share a join key.",
        },
      ],
    },
    {
      id: "traces-and-metrics",
      title: "Traces, spans and metrics",
      durationMinutes: 12,
      explanation:
        "Logs tell you what happened in one process. A request that crosses four services needs something else.\n\n---\n\n## Trace and span\n\n<b>Trace</b> (the complete journey of one request through a distributed system).\n\n<b>Span</b> (one timed operation within a trace, with a parent).\n\n```text\nTrace abc123\n├── POST /checkout            500ms\n│   ├── auth middleware         5ms\n│   ├── user-service          100ms\n│   ├── payment-service       250ms\n│   │   └── stripe API        230ms\n│   └── PostgreSQL insert      80ms\n```\n\n> The reason this is not just logs with timestamps is the <b>parent relationship</b>. A trace is a tree, so it shows you not only that the request took 500ms but which 250ms was inside which other 250ms. That is what answers \"where did the time go\", and it is a question that log timestamps across four services genuinely cannot answer, because their clocks disagree and their lines interleave.\n\n---\n\n## OpenTelemetry\n\n<b>OpenTelemetry (OTel)</b> (an open standard and set of libraries for producing traces, metrics and logs).\n\n> The point of a standard here is <b>where the lock-in sits</b>. Instrument with a vendor's agent and switching vendors means reinstrumenting your application. Instrument with OTel and switching means changing an exporter's configuration. That is the whole argument, and it is a good one.\n\n---\n\n## Auto-instrumentation\n\n<b>Auto-instrumentation</b> (libraries that produce spans for known frameworks without you writing instrumentation).\n\n```text\nnode:http · Fastify · pg · Redis · fetch\n```\n\n> This is where most of the value is for very little work: incoming requests, outgoing calls and database queries are already the majority of any trace, and they get instrumented by adding a package and a startup flag rather than by editing handlers.\n>\n> One thing worth knowing: it works by patching modules as they load, so it has to be initialised <b>before</b> your application imports anything. In practice that means `node --import ./telemetry.js server.js`, which is the same ordering problem as Day 20's `loadEnvFile`, with the same solution.\n\n---\n\n## Manual spans\n\n> Add spans for the work that is <b>yours</b>. Auto-instrumentation shows a 300ms gap between the request starting and the first query; a manual span tells you it was invoice generation. Attributes matter more than the span itself: `invoice.line_count` on the span is what lets you discover it is only slow for large invoices.\n\n---\n\n## Metrics\n\n<b>Metric</b> (a numerical measurement aggregated over time).\n\n```text\nhttp_requests_total · request_duration · errors_total · db_pool_waiting\n```\n\n> The difference from logs is <b>cost per event</b>. A log line for every request costs storage proportional to traffic. A counter costs the same whether you serve ten requests or ten million, because it is aggregated before it leaves the process. That is why metrics are what you alert on and logs are what you read afterwards.\n\n---\n\n## Cardinality\n\n> The one way to break metrics badly. A metric with a `userId` label is not one metric, it is <b>one metric per user</b>, and a million users is a million time series. That is the standard way teams take down their own monitoring, and it usually arrives as a helpful-looking label.\n>\n> Labels must be low-cardinality and bounded: method, route pattern, status code. Never a user id, an order id, a raw URL or an error message. If you want per-user detail, that is what traces and logs are for.\n\n---\n\n## The three together\n\n```text\nMetric  errors are 5% and rising          → you know there is a problem\nTrace   the payment service takes 3s      → you know where\nLog     \"Payment API returned 500\"        → you know why\n```\n\n> Which is the actual argument for all three: each one answers a question the others cannot. A metric cannot tell you why, a log cannot tell you the rate, and neither can tell you which of four services owns the latency.",
      diagram: `Trace is a TREE. That is the point.

    Trace abc123
    ├── POST /checkout          500ms
    │   ├── auth                  5ms
    │   ├── user-service        100ms
    │   ├── payment-service     250ms
    │   │   └── stripe API      230ms
    │   └── PostgreSQL insert    80ms

    not "logs with timestamps": the PARENT
    RELATIONSHIP.

    it shows not only that the request took 500ms
    but WHICH 250ms WAS INSIDE WHICH.

    that answers "where did the time go", which
    log timestamps across four services genuinely
    cannot, because their clocks disagree and
    their lines interleave.


OpenTelemetry: where the lock-in sits

    a vendor's agent
      → switching vendors means REINSTRUMENTING
        your application

    OTel
      → switching means changing an EXPORTER'S
        CONFIG

    that is the whole argument, and it is a good
    one.


Auto-instrumentation: most value, least work

    node:http · Fastify · pg · Redis · fetch

    incoming requests, outgoing calls and database
    queries are already the MAJORITY of any trace.

    add a package and a startup flag. no handler
    edits.

    ⚠ it works by PATCHING MODULES AS THEY LOAD,
      so it must initialise BEFORE your app
      imports anything.

        node --import ./telemetry.js server.js

      same ordering problem as Day 20's
      loadEnvFile, same solution.


Manual spans: for work that is YOURS

    auto-instrumentation shows a 300ms GAP
    between the request starting and the first
    query.

    a manual span tells you it was invoice
    generation.

    → and ATTRIBUTES matter more than the span:

      invoice.line_count on the span is what lets
      you discover it is only slow for LARGE
      invoices.


Metrics: the difference is COST PER EVENT

    a log line per request
      → storage proportional to TRAFFIC

    a counter
      → the same cost at 10 requests or 10
        million, because it is aggregated BEFORE
        it leaves the process

    → which is why you ALERT on metrics and READ
      logs afterwards.


⚠⚠ CARDINALITY: the one way to break metrics

    a metric with a userId label is not one
    metric.

    IT IS ONE METRIC PER USER.

    a million users = a million time series.

    that is the standard way teams take down
    their own monitoring, and it arrives as a
    HELPFUL-LOOKING LABEL.

    labels must be low-cardinality and BOUNDED:
      method · route pattern · status code

    never:
      user id · order id · raw URL
      error message

    want per-user detail? that is what traces and
    logs are for.


The three together

    METRIC  errors are 5% and rising
              → there IS a problem
    TRACE   payment service takes 3s
              → WHERE
    LOG     "Payment API returned 500"
              → WHY

    each answers a question the others cannot.

      a metric cannot tell you why
      a log cannot tell you the rate
      neither tells you which of four services
        owns the latency`,
      codeExample: {
        title: "OTel set up correctly, and metrics that will not explode",
        code: `// ── telemetry.js — loaded BEFORE the application ────────────
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    "service.name": "users-api",
    "service.version": process.env.GIT_SHA ?? "dev",
    "deployment.environment": process.env.NODE_ENV,
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // fs instrumentation produces enormous volume for very
      // little insight. Turn it off before you turn it on.
      "@opentelemetry/instrumentation-fs": { enabled: false },
    }),
  ],
});

sdk.start();

// Day 11's graceful shutdown: flush buffered spans, or the
// trace for the request that crashed is the one you lose.
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, async () => {
    await sdk.shutdown();
    process.exit(0);
  });
}


// ── ⚠ The ordering. This is not optional. ───────────────────
// $ node --import ./telemetry.js server.js
//
// Auto-instrumentation patches modules as they are loaded, so
// it must run before your application imports http, pg or
// fastify. This does NOT work:
//
//   // server.js
//   import "./telemetry.js";      // ← hoisted, but so is
//   import { buildApp } from "./app.js";   // ← this one
//
// ES module imports are all hoisted and evaluated in order,
// and app.js pulls in fastify and pg. Depending on the order
// the loader picks, some modules are already loaded before
// the SDK starts, and you get a trace with a gap in it and no
// error.
//
// Same problem as Day 20's process.loadEnvFile(), same fix:
// do it with a flag, before your code.


// ── Manual spans for your own work ──────────────────────────
import { trace, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("users-api");

export async function generateInvoice(order) {
  return tracer.startActiveSpan("generate-invoice", async (span) => {
    try {
      // Attributes are where the value is. The span tells you
      // it took 300ms; the attributes tell you WHY.
      span.setAttribute("invoice.order_id", order.id);
      span.setAttribute("invoice.line_count", order.lines.length);
      span.setAttribute("invoice.currency", order.currency);

      const lines = await tracer.startActiveSpan("render-lines", async (child) => {
        try { return renderLines(order.lines); }
        finally { child.end(); }
      });

      const pdf = await tracer.startActiveSpan("render-pdf", async (child) => {
        try { return renderPdf(lines); }
        finally { child.end(); }
      });

      span.setAttribute("invoice.bytes", pdf.length);
      return pdf;
    } catch (err) {
      // Without these two lines the span shows as successful
      // and the trace tells you nothing was wrong.
      span.recordException(err);
      span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
      throw err;
    } finally {
      span.end();
      //   ^^^^^ in a finally. A span you forget to end is a
      //   span that never appears and, worse, whose children
      //   attach to the wrong parent.
    }
  });
}
//
// With line_count as an attribute you can discover that
// invoice generation is 40ms at ten lines and 4 seconds at
// five hundred, which is the actual bug. Without it you know
// only that it is "sometimes slow".


// ── Tying logs to traces ────────────────────────────────────
// The single highest-value integration, and it is four lines.
import { context, trace as otelTrace } from "@opentelemetry/api";

export function log() {
  const span = otelTrace.getSpan(context.active());
  const ctx = span?.spanContext();
  const base = currentContext()?.logger ?? logger;

  return ctx ? base.child({ trace_id: ctx.traceId, span_id: ctx.spanId }) : base;
}
// Now every log line carries trace_id, so your log tool and
// your trace tool link both ways: click a slow span, see its
// logs; find an error log, jump to the trace.
//
// Day 21's request id does this within one service. trace_id
// does it across all of them.


// ── Metrics, with cardinality kept under control ────────────
import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter("users-api");

const requestCounter = meter.createCounter("http_requests_total");
const requestDuration = meter.createHistogram("http_request_duration_ms", {
  unit: "ms",
});
const poolWaiting = meter.createObservableGauge("db_pool_waiting");

// Day 17: waitingCount is the pool number that matters.
poolWaiting.addCallback((result) => {
  result.observe(app.db.waitingCount);
});

app.addHook("onResponse", async (request, reply) => {
  // ⚠ EVERY label here is bounded. This is the whole
  // discipline.
  const labels = {
    method: request.method,                        // ~7 values
    route: request.routeOptions?.url ?? "unmatched", // ~50 values
    status: reply.statusCode,                      // ~15 values
  };

  requestCounter.add(1, labels);
  requestDuration.record(reply.elapsedTime, labels);
});
// 7 × 50 × 15 = about 5,000 time series. Fine.


// ── ⚠⚠ How to destroy your monitoring bill ──────────────────
requestCounter.add(1, {
  method: request.method,
  url: request.url,              // ✗ /users/8811 — one series
                                 //   per id, unbounded
  userId: request.user?.id,      // ✗ one series PER USER
  requestId: request.id,         // ✗ one series PER REQUEST
  error: err?.message,           // ✗ one series per distinct
                                 //   message, including ones
                                 //   containing ids
});
//
// With a million users that is millions of time series. Every
// one is stored, indexed and queried forever. This is the
// standard way a team takes down its own monitoring, and it
// always arrives as a label that looked helpful.
//
// The rule: if you cannot write down the complete list of
// values a label can take, it does not belong on a metric.
//
// ✓ Want to know which users are affected? That is a trace
//   attribute or a log field. Both are per-event and neither
//   creates a time series.
//
//   span.setAttribute("user.id", request.user.id);   ✓ fine
//   log().info({ userId: request.user.id }, "...");  ✓ fine
//   counter.add(1, { userId });                      ✗ never


// ── The three signals answering one incident ────────────────
// 03:12  METRIC   error rate on POST /checkout: 0.2% → 6%
//                 → something is wrong, and how much
//
// 03:13  TRACE    a failing trace: payment-service span 3.1s,
//                 status ERROR, and its child span
//                 "stripe API" is 3.0s
//                 → where: not your code, the provider
//
// 03:14  LOG      filter trace_id=...
//                 err.message "Timeout awaiting response"
//                 err.code ETIMEDOUT
//                 → why
//
// Three tools, three minutes. With logs alone you would be
// grepping four services for a pattern you cannot name yet.`,
      },
      keyTakeaways: [
        "A trace is a tree, and the parent relationship is the point: it shows which 250ms was inside which other 250ms.",
        "Log timestamps across services cannot answer that, because clocks disagree and lines interleave.",
        "OpenTelemetry's argument is where the lock-in sits: switching vendors becomes an exporter config change rather than reinstrumenting.",
        "Auto-instrumentation covers incoming requests, outgoing calls and database queries, which is most of any trace, for a package and a flag.",
        "It patches modules as they load, so it must start before your app imports anything: `node --import ./telemetry.js server.js`.",
        "That is Day 20's `loadEnvFile` ordering problem again, and getting it wrong gives you a trace with a silent gap.",
        "Add manual spans for your own work, and put the attributes on them. `invoice.line_count` is what reveals it is only slow for large invoices.",
        "End spans in a `finally`, and record exceptions and an error status, or a failing span shows as successful.",
        "Put `trace_id` on every log line. It links your log tool and trace tool both ways, and it is about four lines of code.",
        "Metrics differ from logs in cost per event: a counter costs the same at ten requests or ten million because it aggregates in-process.",
        "So you alert on metrics and read logs afterwards.",
        "Cardinality is the one way to break metrics badly. A `userId` label is one metric per user, and that is how teams take down their own monitoring.",
        "The rule: if you cannot write down the complete list of values a label can take, it does not belong on a metric. Use a trace attribute or a log field.",
        "The three signals answer different questions: the metric says there is a problem, the trace says where, the log says why.",
      ],
      commonMistakes: [
        "Importing telemetry from `server.js` instead of using `--import`, so some modules load before the SDK and the trace has a silent gap.",
        "Leaving `fs` auto-instrumentation on, which produces enormous volume for very little insight.",
        "Not calling `sdk.shutdown()` on `SIGTERM`, so the buffered trace for the request that crashed is the one you lose.",
        "Creating spans with no attributes, so you know something was slow and nothing about the conditions.",
        "Forgetting `span.end()` outside a `finally`, which loses the span and reparents its children.",
        "Not recording the exception on a failing span, so the trace shows success.",
        "Never adding `trace_id` to logs, leaving two tools that cannot reach each other.",
        "Putting a user id, request id, raw URL or error message on a metric label, which creates unbounded time series.",
        "Logging a line per request as the only telemetry, so alerting depends on log volume rather than an aggregate.",
      ],
      quiz: [
        {
          question: "What makes a trace different from logs with timestamps?",
          options: [
            "Traces are faster",
            "A trace is a tree with parent relationships, so it shows which duration was nested inside which, which interleaved logs across services with disagreeing clocks cannot",
            "Traces are structured",
            "Traces include the request body",
          ],
          correctIndex: 1,
          explanation:
            "That nesting is what answers \"where did the time go\" across four services.",
        },
        {
          question: "Why must OpenTelemetry be started with `--import` rather than an import in `server.js`?",
          options: [
            "For performance",
            "Auto-instrumentation patches modules as they load, so it must run before your app imports `http`, `pg` or `fastify`, or the trace has a silent gap",
            "It needs a separate process",
            "ESM does not support side-effect imports",
          ],
          correctIndex: 1,
          explanation:
            "The same ordering problem as Day 20's `process.loadEnvFile()`, with the same solution.",
        },
        {
          question: "What matters more than adding a manual span?",
          options: [
            "Its name",
            "Its attributes. The span says it took 300ms; `invoice.line_count` is what reveals it is only slow for large invoices.",
            "Its parent",
            "Its sampling rate",
          ],
          correctIndex: 1,
          explanation:
            "Without attributes you know something is \"sometimes slow\", which is not actionable.",
        },
        {
          question: "Why is a `userId` label on a metric a serious mistake?",
          options: [
            "It leaks personal data only",
            "It creates one time series per user, so a million users is a million series, which is the standard way teams take down their own monitoring",
            "Labels must be numeric",
            "It slows the counter",
          ],
          correctIndex: 1,
          explanation:
            "The rule: if you cannot write down the complete list of values a label can take, it belongs on a trace attribute or a log field instead.",
        },
        {
          question: "Why alert on metrics rather than logs?",
          options: [
            "Logs are unreliable",
            "A counter costs the same at ten requests or ten million because it aggregates in-process, while log storage scales with traffic",
            "Metrics are more accurate",
            "Logs cannot be queried",
          ],
          correctIndex: 1,
          explanation:
            "Metrics tell you there is a problem and how much; logs are what you read afterwards to find out why.",
        },
      ],
    },
    {
      id: "health-and-golden-signals",
      title: "Health checks and the golden signals",
      durationMinutes: 11,
      explanation:
        "## Liveness and readiness\n\n<b>Liveness check</b> (whether the process is alive and should keep running).\n\n<b>Readiness check</b> (whether the process can currently serve traffic).\n\n```text\nLiveness   am I alive?          fails → restart me\nReadiness  can I serve?         fails → stop sending me traffic\n```\n\n> They are separate because the responses are opposite, and conflating them causes a specific outage. If your liveness check queries the database and the database has a brief problem, your orchestrator concludes every instance is dead and <b>restarts them all at once</b>, which turns a recoverable dependency blip into a full outage plus a cold start.\n>\n> So: <b>liveness checks nothing external</b>. It answers whether the event loop is running, and it should be a route that returns a constant. Readiness is where you check dependencies, because \"stop sending me traffic until the database is back\" is the correct response to a database problem.\n\n---\n\n## Readiness during startup and shutdown\n\n```text\nprocess starts → pool connecting → ready = false\npool connected                   → ready = true\nSIGTERM received                 → ready = false, keep serving\ndrained                          → exit\n```\n\n> That last pair is the part people miss, and it is Day 11's graceful shutdown with a load balancer attached. On `SIGTERM` you want readiness to fail <b>immediately</b> while the process keeps handling requests for a few more seconds, because the load balancer needs time to notice and stop routing. Exit as soon as you get the signal and every in-flight request becomes a 502.\n\n---\n\n## The four golden signals\n\n<b>Golden signals</b> (latency, traffic, errors, saturation: four measurements that describe a service's health).\n\n> The reason to learn these four specifically is that they are the smallest set that <b>covers the failure modes</b>. Errors alone miss a service that is up and unusably slow. Latency alone misses a service failing fast. Traffic alone misses a service serving errors quickly. And saturation is the one that predicts the other three, which makes it the only leading indicator on the list.\n\n---\n\n## Latency, and why the mean lies\n\n<b>Percentile</b> (the value below which a given share of measurements fall).\n\nVerified with 990 requests at ~25ms and 10 at ~3000ms:\n\n```text\nmean  57ms\np50   25ms\np95   30ms\np99   30ms\nmax   3458ms\n```\n\n> Look at that table. The mean is <b>57ms</b>, and <b>no request took 57ms</b>. Half took 25ms and one percent took over three seconds. The mean describes neither group, and it is worse than useless here because it is <b>higher than the p99</b>, so a dashboard showing the mean makes things look mildly slow when they are actually bimodal.\n>\n> That is the argument for percentiles in one table: an average is a number pulled between two populations, and outliers move it without ever describing anyone's experience. Alert on p95 and p99, and keep the max, because a 3.4 second maximum is a real user who waited.\n\n---\n\n## Errors and saturation\n\n> For errors, measure the <b>rate</b> rather than the count, since 2,000 failures out of 100,000 is 2% and 2,000 out of 3,000 is an outage. And be deliberate about whether 4xx counts: a rise in 400s is usually a broken client or an attack, and a rise in 500s is yours. Mixing them means your alert fires for someone else's bug.\n>\n> For saturation, pick the resource that actually runs out first. Day 17's `db_pool_waiting` and Day 18's password-hashing thread pool are both better saturation signals for a Node API than CPU, because they saturate long before the CPU does.\n\n---\n\n## Error tracking\n\n<b>Error tracking</b> (a system that groups identical exceptions, counts them and attaches context).\n\n> The difference from logs is <b>grouping</b>. A log tool shows you 2,341 lines; an error tracker shows you one issue with a count of 2,341, when it started, which release introduced it and how many users are affected. That turns \"there are a lot of errors\" into \"this one error, since this deploy, for these users\", which is the difference between a search and an answer.",
      diagram: `Liveness and readiness: OPPOSITE responses

    LIVENESS   am I alive?
               fails → RESTART ME
    READINESS  can I serve?
               fails → STOP SENDING ME TRAFFIC


⚠⚠ Why conflating them causes an outage

    if liveness queries the DATABASE and the
    database has a brief problem:

      the orchestrator concludes EVERY INSTANCE
      IS DEAD

      and restarts them ALL AT ONCE

    → a recoverable dependency blip becomes a
      full outage plus a cold start

    so:

      LIVENESS CHECKS NOTHING EXTERNAL.
      it answers whether the event loop runs.
      a route returning a constant.

      READINESS checks dependencies, because
      "stop sending traffic until the database is
      back" is the CORRECT response to a database
      problem.


Readiness during startup AND shutdown

    process starts, pool connecting  ready=false
    pool connected                   ready=true
    SIGTERM received                 ready=FALSE,
                                     KEEP SERVING
    drained                          exit

    ⚠ that last pair is the part people miss.

      Day 11's graceful shutdown with a load
      balancer attached.

      on SIGTERM: fail readiness IMMEDIATELY,
      keep handling requests for a few more
      seconds, because the balancer needs time to
      notice.

      exit as soon as you get the signal and
      every in-flight request becomes a 502.


The four golden signals

    LATENCY · TRAFFIC · ERRORS · SATURATION

    why these four: they are the SMALLEST SET
    THAT COVERS THE FAILURE MODES.

      errors alone     miss a service that is up
                       and unusably slow
      latency alone    misses a service failing
                       fast
      traffic alone    misses a service serving
                       errors quickly
      saturation       PREDICTS the other three
                       → the only leading
                         indicator on the list


⚠⚠ Latency: the mean LIES. Verified.

    990 requests at ~25ms, 10 at ~3000ms:

      mean   57ms
      p50    25ms
      p95    30ms
      p99    30ms
      max  3458ms

    the mean is 57ms, and NO REQUEST TOOK 57ms.

      half took 25ms
      one percent took over THREE SECONDS

    the mean describes NEITHER group, and here it
    is worse than useless because it is HIGHER
    THAN THE p99.

      → a dashboard showing the mean says "mildly
        slow" when the truth is BIMODAL

    an average is a number pulled between two
    populations. outliers move it without ever
    describing anyone's experience.

    → alert on p95 and p99. keep the max: 3.4
      seconds is a real user who waited.


Errors and saturation

    ERRORS: measure the RATE, not the count.

      2,000 of 100,000  =  2%
      2,000 of 3,000    =  an outage

      and decide about 4xx:
        a rise in 400s   usually a broken client
                         or an attack
        a rise in 500s   yours

      mixing them means your alert fires for
      somebody else's bug.

    SATURATION: pick what runs out FIRST.

      Day 17's db_pool_waiting
      Day 18's hashing thread pool

      both better than CPU for a Node API,
      because they saturate long before it does.


Error tracking: the difference is GROUPING

    a log tool          2,341 LINES
    an error tracker    ONE ISSUE, count 2,341
                        when it started
                        which release
                        how many users

    → "there are a lot of errors"
      becomes
      "this one error, since this deploy, for
       these users"

    the difference between a SEARCH and an ANSWER.`,
      codeExample: {
        title: "Health checks that do not cause outages",
        code: `import Fastify from "fastify";

const app = Fastify({ logger: true });

// Readiness is a piece of state, not a query.
let ready = false;
let shuttingDown = false;


// ── ✓ Liveness: nothing external. Ever. ─────────────────────
app.get("/health/live", {
  logLevel: "silent",     // or every 5s probe fills your logs
  config: { rateLimit: false },
}, async () => {
  return { status: "ok" };
});
//
// That is the whole check. If this route responds, the event
// loop is running and the process is not wedged, which is the
// only question liveness should ask.
//
// ✗✗ What NOT to do:
//
//   app.get("/health/live", async () => {
//     await db.query("SELECT 1");        // ← never
//     return { status: "ok" };
//   });
//
//   The database has a thirty-second problem. Every instance
//   fails its liveness probe. The orchestrator restarts all
//   of them simultaneously. Now you have no warm instances,
//   no connection pools, and a thundering herd hitting a
//   database that was already struggling.
//
//   You converted a recoverable blip into an outage, using
//   the mechanism designed to prevent outages.


// ── ✓ Readiness: dependencies, and the shutdown flag ────────
app.get("/health/ready", {
  logLevel: "silent",
  config: { rateLimit: false },
}, async (request, reply) => {
  if (shuttingDown) {
    return reply.code(503).send({ status: "shutting_down" });
  }
  if (!ready) {
    return reply.code(503).send({ status: "starting" });
  }

  // Cheap checks with a hard timeout. A readiness probe that
  // hangs is a readiness probe that fails, so bound it.
  const checks = await Promise.allSettled([
    withTimeout(app.db.query("SELECT 1"), 1000, "database"),
    withTimeout(app.redis.ping(), 500, "redis"),
  ]);

  const failed = checks
    .filter((c) => c.status === "rejected")
    .map((c) => c.reason.message);

  if (failed.length > 0) {
    request.log.warn({ failed }, "readiness check failed");
    return reply.code(503).send({ status: "not_ready", failed });
  }

  return { status: "ok" };
});

function withTimeout(promise, ms, name) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(name)), ms).unref()),
  ]);
}
//   ^^^^^^ .unref() from Day 11, or a pending timer keeps the
//   process alive during shutdown.


// ── Startup: ready only when dependencies are up ────────────
app.addHook("onReady", async () => {
  await app.db.query("SELECT 1");     // Day 15: fail at startup
  ready = true;
  app.log.info("ready to serve traffic");
});


// ── ⚠ Shutdown: fail readiness, keep serving ────────────────
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, async () => {
    app.log.info({ signal }, "shutdown requested");

    // 1. Fail readiness IMMEDIATELY. The load balancer needs
    //    a few probe intervals to notice and stop routing.
    shuttingDown = true;

    // 2. Keep serving during that window. This is the step
    //    people skip, and skipping it turns every in-flight
    //    request into a 502 on every single deploy.
    await new Promise((r) => setTimeout(r, config.shutdownDelayMs ?? 5000));

    // 3. Now stop accepting, drain, and run onClose hooks.
    await app.close();

    // 4. Flush telemetry, or the trace for whatever went
    //    wrong is the one you lose.
    await sdk.shutdown().catch(() => {});

    process.exit(0);
  });
}
//
// The sequence matters. Deploys are the most frequent cause
// of user-visible errors in most systems, and this is why: a
// process that exits on SIGTERM drops whatever it was holding.


// ── The golden signals, as metrics ──────────────────────────
// LATENCY: a histogram, so you get percentiles rather than a
// mean. Bounded labels only.
requestDuration.record(reply.elapsedTime, {
  method: request.method,
  route: request.routeOptions?.url ?? "unmatched",
  status: reply.statusCode,
});

// TRAFFIC: the same counter answers this.
requestCounter.add(1, labels);

// ERRORS: separate 4xx from 5xx, because they mean different
// things and belong to different people.
if (reply.statusCode >= 500) {
  serverErrors.add(1, { route: labels.route });
} else if (reply.statusCode >= 400) {
  clientErrors.add(1, { route: labels.route, status: reply.statusCode });
}
// An alert on "errors" that includes 400s fires when someone
// points a broken script at you, at 3am, about their bug.

// SATURATION: the resource that runs out first, which for a
// Node API is usually not CPU.
poolWaiting.addCallback((r) => r.observe(app.db.waitingCount));  // Day 17
eventLoopLag.addCallback((r) => r.observe(measureLag()));        // Day 3
heapUsed.addCallback((r) => r.observe(process.memoryUsage().heapUsed));


// ── ⚠ Why the mean is the wrong number. Verified. ───────────
// 990 requests at ~25ms, 10 at ~3000ms:
//
//   mean   57ms
//   p50    25ms
//   p95    30ms
//   p99    30ms
//   max  3458ms
//
// Read that again. The mean is HIGHER than the p99.
//
// So a dashboard showing "average response time: 57ms" is
// describing a service where 99% of requests take 30ms or
// less and 1% take over three seconds. It reports a number
// that no request experienced, and it makes a bimodal
// distribution look like a uniformly slightly-slow one.
//
// ✓ Alert on p95 and p99. Keep max on the dashboard, because
//   3,458ms is a real person who waited 3.4 seconds.

// A crude percentile you can compute yourself if you have no
// metrics backend yet:
function percentile(sorted, p) {
  return sorted[Math.ceil((p / 100) * sorted.length) - 1];
}
// Real backends do this with histogram buckets, so you never
// hold every sample in memory. Which is also why you cannot
// average percentiles across instances: the p95 of two
// instances' p95s is not the p95. Aggregate the histograms,
// not the percentiles.


// ── Error tracking, wired to everything else ────────────────
app.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error }, "request failed");
  //                  ^^^ Day 21's key. \`error\` would log {}.

  if (!error.statusCode || error.statusCode >= 500) {
    Sentry.captureException(error, {
      tags: { route: request.routeOptions?.url },
      extra: {
        requestId: request.id,
        traceId: otelTrace.getSpan(context.active())?.spanContext().traceId,
      },
      user: { id: request.user?.id },
    });
  }
  // Only 5xx. Sending every 400 to your error tracker buries
  // the real bugs under validation failures.

  if (error.validation) {
    return reply.code(400).send({ error: "Bad Request", message: error.message });
  }
  if (error.statusCode && error.statusCode < 500) {
    return reply.code(error.statusCode).send({ error: error.message });
  }
  return reply.code(500).send({
    error: "Internal Server Error",
    requestId: request.id,     // so a user can quote it
  });
});
//
// Note requestId and traceId on the captured exception. That
// is the join key that makes the whole day work together:
// error tracker groups it, logs explain it, trace shows where
// the time went, all reachable from one id.`,
      },
      keyTakeaways: [
        "Liveness and readiness get opposite responses: restart me versus stop sending me traffic.",
        "A liveness check must not touch a dependency. A database blip then fails every instance and the orchestrator restarts them all at once, turning a blip into an outage.",
        "Readiness is where dependency checks belong, because stopping traffic is the correct response to a dependency problem.",
        "On `SIGTERM`, fail readiness immediately and keep serving for a few seconds, or every in-flight request becomes a 502 on every deploy.",
        "Bound readiness checks with a timeout, and `unref()` the timer so it does not keep the process alive.",
        "Set `logLevel: \"silent\"` on health routes, or a probe every five seconds dominates your logs.",
        "The four golden signals are the smallest set covering the failure modes, and saturation is the only leading indicator.",
        "Verified: with 990 requests at 25ms and 10 at 3000ms, the mean was 57ms, higher than the p99 of 30ms, and no request took 57ms.",
        "So a mean can describe a bimodal distribution as uniformly slightly slow. Alert on p95 and p99 and keep the max.",
        "You cannot average percentiles across instances. Aggregate histograms, not percentiles.",
        "Measure the error rate, not the count, and separate 4xx from 5xx so your alert does not fire for someone else's broken client.",
        "For saturation, pick the resource that runs out first: Day 17's pool waiting count and Day 3's event loop lag beat CPU for a Node API.",
        "Error tracking's advantage over logs is grouping: one issue with a count, a first-seen release and an affected-user number.",
        "Put `requestId` and `traceId` on captured exceptions, so one id reaches the error tracker, the logs and the trace.",
      ],
      commonMistakes: [
        "Querying the database in a liveness check, which converts a dependency blip into a mass restart.",
        "Using one `/health` endpoint for both, so the orchestrator cannot tell restart from drain.",
        "Exiting immediately on `SIGTERM`, which turns every deploy into a burst of 502s.",
        "An unbounded readiness check, so a hanging dependency makes the probe hang instead of failing.",
        "Logging every health probe, which buries real traffic in noise.",
        "Alerting on a mean response time, which can be higher than the p99 and describes no actual request.",
        "Averaging p95 values across instances, which is not the p95.",
        "Alerting on an error count rather than a rate, or mixing 4xx into it.",
        "Using CPU as the saturation signal for a Node API, when the pool and the event loop saturate first.",
        "Sending every 400 to the error tracker, which buries real bugs under validation failures.",
        "Capturing exceptions with no request or trace id, so the three tools cannot reach each other.",
      ],
      quiz: [
        {
          question: "Why must a liveness check not query the database?",
          options: [
            "It is too slow",
            "A brief database problem then fails every instance, so the orchestrator restarts them all at once and a recoverable blip becomes an outage",
            "Liveness checks cannot be async",
            "It leaks the connection string",
          ],
          correctIndex: 1,
          explanation:
            "Dependency checks belong in readiness, where the response is to stop routing traffic rather than to restart.",
        },
        {
          question: "What should happen on `SIGTERM`?",
          options: [
            "Exit immediately",
            "Fail readiness at once, keep serving for a few seconds so the load balancer notices, then drain and exit",
            "Reject new requests with 503 and exit",
            "Restart the process",
          ],
          correctIndex: 1,
          explanation:
            "Exiting immediately turns every in-flight request into a 502, on every deploy, which is a leading cause of user-visible errors.",
        },
        {
          question: "With 990 requests at 25ms and 10 at 3000ms, what were the mean and the p99?",
          options: [
            "Mean 25ms, p99 3000ms",
            "Mean 57ms and p99 30ms, so the mean was higher than the p99 and no request took 57ms",
            "Both about 57ms",
            "Mean 3000ms, p99 25ms",
          ],
          correctIndex: 1,
          explanation:
            "Verified. The mean is pulled between two populations and describes neither, making a bimodal service look uniformly slightly slow.",
        },
        {
          question: "Why can you not average p95 values across instances?",
          options: [
            "Clock skew",
            "The p95 of two p95s is not the p95. You have to aggregate the underlying histograms.",
            "Instances measure differently",
            "You can, it is standard",
          ],
          correctIndex: 1,
          explanation:
            "Which is why metrics backends store histogram buckets rather than computed percentiles.",
        },
        {
          question: "Why separate 4xx from 5xx in your error metric?",
          options: [
            "For nicer dashboards",
            "A rise in 400s is usually a broken client or an attack and a rise in 500s is yours, so mixing them makes your alert fire for someone else's bug",
            "4xx are not errors",
            "5xx are rarer",
          ],
          correctIndex: 1,
          explanation:
            "The same reasoning applies to error tracking: sending every 400 to it buries real bugs under validation failures.",
        },
        {
          question: "What is the best saturation signal for a Node API?",
          options: [
            "CPU utilisation",
            "Usually the connection pool's waiting count or event loop lag, because those saturate long before CPU does",
            "Disk usage",
            "Request count",
          ],
          correctIndex: 1,
          explanation:
            "Day 17's `waitingCount` and Day 3's event loop lag. Saturation is the only leading indicator among the four signals.",
        },
      ],
    },
    {
      id: "diagnostics-and-perf-hooks",
      title: "diagnostics_channel and perf_hooks",
      durationMinutes: 10,
      explanation:
        "Two built-in APIs that sit underneath everything above.\n\n---\n\n## `diagnostics_channel`\n\n<b>`diagnostics_channel`</b> (a Node API for publishing and subscribing to named diagnostic events inside a process).\n\n```javascript\nimport dc from \"node:diagnostics_channel\";\n\nconst ch = dc.channel(\"app:invoice.created\");\nch.subscribe((msg) => console.log(msg));\nch.publish({ invoiceId: 7 });\n```\n\nVerified working on Node 24.\n\n> What it is <b>for</b> is decoupling the thing that knows something happened from the thing that wants to record it. A library can publish an event without depending on your logger, your metrics client or your tracer, and you can subscribe without the library knowing you exist. That is why it is the mechanism underneath OpenTelemetry's instrumentation of Node core and several database drivers.\n>\n> The property that makes it usable on a hot path: `channel.hasSubscribers` is <b>false</b> when nobody is listening, so a publisher can skip building the message entirely. Verified. That makes instrumentation you leave in production genuinely close to free when it is switched off, which is not true of a `logger.debug` call that still constructs an object before deciding to discard it.\n\nNode core publishes channels of its own, including `http.server.request.start` and `http.client.request.start`, which is how you observe HTTP activity without patching anything.\n\n---\n\n## Where you would use it yourself\n\n> In your own application, the honest answer is: rarely, and when you do it is worth it. A domain event like `order.paid` published on a channel means your metrics, your audit trail and your notification code can all subscribe without the order service importing any of them. That keeps a service's dependencies about its own job.\n>\n> If you are writing a <b>library</b>, it changes from optional to the right default, because it lets consumers instrument you without you choosing their observability stack for them.\n\n---\n\n## `perf_hooks`\n\n<b>`perf_hooks`</b> (Node's performance measurement APIs, including `performance.now`, marks, measures and observers).\n\n```javascript\nperformance.mark(\"a\");\nperformance.mark(\"b\");\nperformance.measure(\"work\", \"a\", \"b\");\n```\n\nVerified: a `PerformanceObserver` on `entryTypes: [\"measure\"]` received `work 40ms`.\n\n> Two things it gives you that `Date.now()` does not. `performance.now()` is a <b>monotonic</b> high-resolution clock, so it cannot go backwards when NTP adjusts the system time, which `Date.now()` differences can. And the observer pattern separates <b>measuring</b> from <b>reporting</b>, so instrumented code marks and measures while one observer decides where the numbers go.\n\n---\n\n## The one to actually monitor\n\n> `perf_hooks` also exposes event loop utilisation and, more usefully, `monitorEventLoopDelay`, which gives you a histogram of how late timers fired.\n>\n> That is the single best saturation signal for a Node service, and Day 11 established why: a blocked event loop fires <b>zero</b> ticks rather than late ones, so measuring lag catches exactly the failure mode Day 18's `hashSync` and Day 19's ReDoS both produced. Verified in those lessons at 0 ticks for seven seconds. CPU utilisation would have looked like one busy core; event loop delay looks like an outage, which is what it was.",
      diagram: `diagnostics_channel: DECOUPLING

    const ch = dc.channel("app:invoice.created");
    ch.subscribe(msg => ...);
    ch.publish({ invoiceId: 7 });

    verified working on Node 24.

    what it is FOR:

      separating the thing that KNOWS something
      happened from the thing that wants to
      RECORD it

      a library publishes without depending on
      your logger, metrics client or tracer

      you subscribe without the library knowing
      you exist

    → which is why it is the mechanism underneath
      OpenTelemetry's instrumentation of Node core
      and several database drivers.


⚠ The property that makes it hot-path safe

    channel.hasSubscribers is FALSE when nobody
    is listening.   (verified)

    so a publisher can SKIP BUILDING THE MESSAGE
    entirely.

    → instrumentation you leave in production is
      genuinely close to free when switched off.

    which is NOT true of logger.debug(...): that
    still constructs the object before deciding to
    discard it.


Node core publishes its own channels

    http.server.request.start
    http.client.request.start
    ...

    → observe HTTP activity without patching
      anything.


Where you would use it yourself

    honestly: RARELY, and worth it when you do.

    a domain event like order.paid on a channel
    means metrics, the audit trail and
    notifications can all subscribe WITHOUT the
    order service importing any of them.

    → keeps a service's dependencies about its
      own job.

    writing a LIBRARY? it becomes the right
    default, because it lets consumers instrument
    you without you choosing their observability
    stack for them.


perf_hooks: two things Date.now() cannot do

    performance.mark("a") / mark("b")
    performance.measure("work", "a", "b")

    verified: a PerformanceObserver on
    entryTypes ["measure"] received  work 40ms

    1. performance.now() is MONOTONIC and
       high-resolution

       it cannot go BACKWARDS when NTP adjusts
       the system clock, which Date.now()
       differences can

    2. the observer pattern separates MEASURING
       from REPORTING

       instrumented code marks and measures
       one observer decides where numbers go


⚠ The one to actually monitor

    monitorEventLoopDelay
      → a HISTOGRAM of how late timers fired

    the single best saturation signal for a Node
    service, and Day 11 established why:

      A BLOCKED EVENT LOOP FIRES ZERO TICKS,
      NOT LATE ONES.

      so measuring lag catches exactly the failure
      mode that Day 18's hashSync and Day 19's
      ReDoS produced.

      verified in both: 0 ticks, for seven seconds.

    CPU utilisation would have looked like ONE
    BUSY CORE.

    event loop delay looks like an OUTAGE.
    which is what it was.`,
      codeExample: {
        title: "Both APIs, doing work you would actually keep",
        code: `// ═══════════════════════════════════════════════════════════
// diagnostics_channel
// ═══════════════════════════════════════════════════════════
import dc from "node:diagnostics_channel";

// ── A domain event, published by code that owns it ──────────
// modules/orders/service.js
const orderPaid = dc.channel("app:order.paid");

export async function markOrderPaid(db, orderId, payment) {
  const [order] = await db.update(orders)
    .set({ status: "paid", paidAt: new Date() })
    .where(eq(orders.id, orderId))
    .returning();

  // ⚠ The guard is the point. Verified: hasSubscribers is
  // false when nobody is listening, so with no subscribers
  // this costs one boolean check and builds no object.
  if (orderPaid.hasSubscribers) {
    orderPaid.publish({
      orderId: order.id,
      userId: order.userId,
      total: order.total,
      currency: order.currency,
      paymentId: payment.id,
    });
  }

  return order;
}
//
// Note what this file does NOT import: no logger, no metrics
// client, no email service, no analytics SDK. The order
// service knows about orders.


// ── Subscribers, wired up once at startup ───────────────────
// observability/subscribe.js
dc.subscribe("app:order.paid", (msg) => {
  ordersPaidCounter.add(1, { currency: msg.currency });
  revenueHistogram.record(msg.total, { currency: msg.currency });
});

dc.subscribe("app:order.paid", (msg) => {
  log().info({ orderId: msg.orderId, total: msg.total }, "order paid");
});

// notifications/subscribe.js
dc.subscribe("app:order.paid", async (msg) => {
  await queue.add("send-receipt", { orderId: msg.orderId });
});
//
// Three concerns, three files, and the order service changed
// zero times to add any of them.
//
// ⚠ One caution: subscribers run SYNCHRONOUSLY in the
// publisher's call stack, and a throwing subscriber breaks
// the publisher. So keep them trivial, and push real work
// onto a queue rather than doing it inline:
dc.subscribe("app:order.paid", (msg) => {
  try {
    queue.add("send-receipt", { orderId: msg.orderId });   // enqueue only
  } catch (err) {
    log().error({ err }, "order.paid subscriber failed");
  }
});


// ── Node core's own channels ────────────────────────────────
dc.subscribe("http.client.request.start", ({ request }) => {
  // Every outbound HTTP request in the process, including
  // ones made by dependencies you did not know made any.
  log().debug({
    method: request.method,
    host: request.host,
    path: request.path,
  }, "outbound http");
});
// Worth running once on a real service. The list of hosts your
// process talks to is usually longer than you expect, and
// Day 19's egress point becomes concrete when you can see it.


// ═══════════════════════════════════════════════════════════
// perf_hooks
// ═══════════════════════════════════════════════════════════
import {
  performance, PerformanceObserver, monitorEventLoopDelay,
} from "node:perf_hooks";

// ── Marks, measures and an observer. Verified. ──────────────
const obs = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    log().debug({ name: entry.name, ms: Math.round(entry.duration) }, "measure");
    slowOperations.record(entry.duration, { operation: entry.name });
  }
});
obs.observe({ entryTypes: ["measure"] });

export async function generateReport(params) {
  performance.mark("report:start");
  const rows = await fetchRows(params);
  performance.mark("report:fetched");
  const pdf = await renderPdf(rows);
  performance.mark("report:rendered");

  performance.measure("report:fetch", "report:start", "report:fetched");
  performance.measure("report:render", "report:fetched", "report:rendered");
  // Verified shape: the observer received "work 40ms" for an
  // equivalent measure in a small test.

  return pdf;
}
//
// The separation is the value: this function measures and
// knows nothing about where the numbers go. Swap the observer
// and every measured operation reports somewhere else, with
// no change here.


// ── Why performance.now() rather than Date.now() ────────────
const t0 = performance.now();
await doWork();
const elapsed = performance.now() - t0;
//
// performance.now() is monotonic: it cannot jump backwards.
// A Date.now() difference can, because NTP adjusts the system
// clock, and the result is a negative duration that becomes a
// negative latency in your metrics and a very confusing
// dashboard.
//
// It is also higher resolution, which matters when you are
// measuring something that takes 0.4ms.


// ── ⚠ The measurement worth having in production ────────────
const loopDelay = monitorEventLoopDelay({ resolution: 10 });
loopDelay.enable();

setInterval(() => {
  eventLoopP99.record(loopDelay.percentile(99) / 1e6);   // ns → ms
  eventLoopMax.record(loopDelay.max / 1e6);

  if (loopDelay.percentile(99) / 1e6 > 100) {
    log().warn({
      p50: Math.round(loopDelay.percentile(50) / 1e6),
      p99: Math.round(loopDelay.percentile(99) / 1e6),
      max: Math.round(loopDelay.max / 1e6),
    }, "event loop lag high");
  }

  loopDelay.reset();
}, 10_000).unref();
//         ^^^^^^^ Day 11, or the process will not exit.
//
// Why this is the saturation signal for Node:
//
//   Day 18: bcrypt.hashSync at cost 12 blocked the loop for
//           200ms and it ticked ZERO times.
//   Day 19: /^(a+)+$/ on 30 characters blocked it for 7,176ms
//           and it ticked ZERO times.
//
// Both verified. In both cases:
//
//   CPU               one core busy. Unremarkable.
//   error rate        normal, until requests time out.
//   request latency   rises, but only for requests that
//                     arrived during the block, so it looks
//                     like a tail problem.
//   EVENT LOOP DELAY  immediately, unambiguously enormous.
//
// It is the only one of those four that says "this process is
// not serving anyone" while it is happening. A p99 loop delay
// above about 100ms means requests are queueing behind
// something synchronous, and that is a different investigation
// from a slow database.


// ── And the pair worth graphing next to it ──────────────────
import { eventLoopUtilization } from "node:perf_hooks";

let last = eventLoopUtilization();
setInterval(() => {
  const elu = eventLoopUtilization(last);
  last = eventLoopUtilization();
  eventLoopUtil.record(elu.utilization);
}, 10_000).unref();
//
// Utilisation near 1 means the loop is never idle, so the
// process is CPU-bound rather than waiting on I/O. Together:
//
//   high delay + high utilisation   too much synchronous work
//   high delay + low utilisation    a few very long blocks
//   low delay  + high utilisation   busy and keeping up
//
// Three different problems, and none of them is visible in a
// CPU graph.`,
      },
      keyTakeaways: [
        "Verified: `diagnostics_channel` publish and subscribe works on Node 24, including custom channel names.",
        "Its purpose is decoupling: a publisher needs no dependency on your logger, metrics client or tracer, and a subscriber needs no cooperation from the publisher.",
        "That is the mechanism underneath OpenTelemetry's instrumentation of Node core and several drivers.",
        "Verified: `hasSubscribers` is false with nobody listening, so a publisher can skip building the message and instrumentation is close to free when off.",
        "That is unlike `logger.debug`, which constructs its object before deciding to discard it.",
        "Node core publishes channels such as `http.client.request.start`, so you can see every outbound request including ones made by dependencies.",
        "Subscribers run synchronously in the publisher's stack, so keep them trivial, catch their errors, and enqueue real work.",
        "`performance.now()` is monotonic, so it cannot go backwards when NTP adjusts the clock, which a `Date.now()` difference can.",
        "Marks, measures and a `PerformanceObserver` separate measuring from reporting, so instrumented code does not know where numbers go.",
        "Verified: an observer on `entryTypes: [\"measure\"]` received a 40ms measure.",
        "`monitorEventLoopDelay` is the best saturation signal for Node, because a blocked loop fires zero ticks rather than late ones.",
        "Day 18's `hashSync` and Day 19's ReDoS both produced zero ticks, and in both cases CPU looked like one busy core while loop delay was unambiguous.",
        "Graph delay and utilisation together: high delay with low utilisation is a few long blocks, high both is too much synchronous work.",
      ],
      commonMistakes: [
        "Publishing on a diagnostics channel without the `hasSubscribers` guard, so you build a message nobody reads on a hot path.",
        "Doing real work in a subscriber, which runs synchronously in the publisher's stack and can break it.",
        "Not catching errors in a subscriber, so an observability concern takes down the code it was observing.",
        "Using `Date.now()` differences for durations, which can go negative when the system clock is adjusted.",
        "Measuring with marks and reporting from the same code, which couples every instrumented function to your metrics client.",
        "Monitoring CPU as the saturation signal for a Node service, when a fully blocked loop looks like one busy core.",
        "Not monitoring event loop delay at all, so the failure mode that Day 18 and Day 19 both produced is invisible.",
        "Forgetting `.unref()` on the reporting interval, so the process refuses to exit.",
        "Forgetting `loopDelay.reset()`, so the histogram accumulates for the lifetime of the process and stops reflecting now.",
      ],
      quiz: [
        {
          question: "What is `diagnostics_channel` actually for?",
          options: [
            "Faster logging",
            "Decoupling: a publisher needs no dependency on your logger or metrics client, and a subscriber needs no cooperation from the publisher",
            "Cross-process events",
            "Replacing OpenTelemetry",
          ],
          correctIndex: 1,
          explanation:
            "It is the mechanism underneath OTel's instrumentation of Node core and several database drivers.",
        },
        {
          question: "Why is `channel.hasSubscribers` worth checking?",
          options: [
            "It is required",
            "It is false when nobody is listening, so the publisher can skip building the message, making left-in instrumentation nearly free",
            "It prevents duplicate events",
            "It flushes the channel",
          ],
          correctIndex: 1,
          explanation:
            "Verified. Unlike `logger.debug`, which still constructs its object before discarding it.",
        },
        {
          question: "What is the risk of a diagnostics channel subscriber?",
          options: [
            "It delays garbage collection",
            "It runs synchronously in the publisher's call stack, so slow or throwing subscriber code affects the code it was observing",
            "It cannot be removed",
            "It duplicates messages",
          ],
          correctIndex: 1,
          explanation:
            "Keep subscribers trivial, wrap them in try/catch, and enqueue anything substantial.",
        },
        {
          question: "Why prefer `performance.now()` over `Date.now()` for durations?",
          options: [
            "It is faster to call",
            "It is monotonic and high-resolution, so it cannot go backwards when NTP adjusts the system clock and produce a negative duration",
            "It returns a Date",
            "It works in workers only",
          ],
          correctIndex: 1,
          explanation:
            "A negative duration becomes a negative latency in your metrics and a dashboard nobody can explain.",
        },
        {
          question: "Why is event loop delay the best saturation signal for a Node service?",
          options: [
            "It is cheaper to collect",
            "A blocked loop fires zero ticks rather than late ones, so it catches the exact failure Day 18's `hashSync` and Day 19's ReDoS produced, which CPU shows as one busy core",
            "It correlates with memory",
            "It is required by OTel",
          ],
          correctIndex: 1,
          explanation:
            "Both were verified at zero ticks. Loop delay is the only signal that says \"this process is serving nobody\" while it is happening.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What does `logger.error({ error: new Error(\"boom\") }, \"failed\")` log with Pino?",
      options: [
        "The error with its stack",
        "`\"error\":{}`, an empty object, because Pino's serializer is registered for the key `err` and `message` and `stack` are non-enumerable",
        "A warning about the key",
        "Only the message",
      ],
      correctIndex: 1,
      explanation:
        "Verified against `{ err }`, which produced type, message and stack. The natural spelling silently discards everything useful.",
    },
    {
      question: "Why might a fresh Pino setup appear to log nothing?",
      options: [
        "It buffers output",
        "The default level is `info`, so `trace` and `debug` calls produce no output and no warning",
        "It needs a transport",
        "It writes to a file",
      ],
      correctIndex: 1,
      explanation:
        "Verified. Detailed logging sensibly placed at `debug` is invisible until you make the level configuration.",
    },
    {
      question: "Pino is configured with `paths: [\"password\"]`. What happens to `{ user: { password: \"x\" } }`?",
      options: [
        "Redacted",
        "Logged in full, because redaction is path-based and `password` matches only the top level",
        "Pino throws",
        "The object is dropped",
      ],
      correctIndex: 1,
      explanation:
        "Verified. Every entity field needs both `\"password\"` and `\"*.password\"`, and Pino does not warn when a path never matches.",
    },
    {
      question: "Why is logging `userId` better than logging `user`?",
      options: [
        "Only for security",
        "A redaction list covers only the fields somebody thought of, and the entity is also expensive, mostly irrelevant and stale by the time you read it",
        "It is shorter",
        "Objects cannot be indexed",
      ],
      correctIndex: 1,
      explanation:
        "The id lets you look up what the record is now, which is what you want during an incident.",
    },
    {
      question: "Why can you not redact a token that appears in a URL query string?",
      options: [
        "You can, with a wildcard",
        "It is already logged by your load balancer, CDN and proxies, plus browser history and `Referer`, all before your code runs",
        "URLs are encrypted",
        "Pino cannot read URLs",
      ],
      correctIndex: 1,
      explanation:
        "Which is why Day 18 put the refresh token in a cookie. Headers and cookies are not part of the URL.",
    },
    {
      question: "What is wrong with Fastify's default request ids across multiple instances?",
      options: [
        "They are too long",
        "They are `req-1`, `req-2` per process, so ten instances each produce a `req-1` and one search returns fragments of ten unrelated requests",
        "They are not logged",
        "They reset on error",
      ],
      correctIndex: 1,
      explanation:
        "Verified. Use `genReqId` to accept a validated upstream `x-request-id` with a unique generated fallback.",
    },
    {
      question: "What was verified about capturing the `AsyncLocalStorage` store in a variable?",
      options: [
        "It tracks the current run",
        "It keeps the first request's value: `captured.requestId` was `req-1` while the current run was `req-2`",
        "It becomes `undefined`",
        "It throws",
      ],
      correctIndex: 1,
      explanation:
        "So a module-level logger built once from the store is confidently wrong forever, which is worse than no correlation field at all.",
    },
    {
      question: "What should stay out of the async context store?",
      options: [
        "The logger",
        "A database handle or transaction, because Day 17 showed an implicitly passed `tx` is how a query silently escapes its transaction",
        "The request id",
        "The user id",
      ],
      correctIndex: 1,
      explanation:
        "Implicit context is for cross-cutting concerns. Data access stays explicit in the signature.",
    },
    {
      question: "Why log the route pattern rather than the raw URL?",
      options: [
        "It is shorter",
        "`/users/8811` gives one distinct value per id, so you can never compute a p95 for `GET /users/:id`",
        "URLs may contain secrets",
        "Fastify requires it",
      ],
      correctIndex: 1,
      explanation:
        "This is the most common request-logging mistake, and it is the same cardinality problem that breaks metrics.",
    },
    {
      question: "Why must OpenTelemetry start with `--import` rather than a normal import?",
      options: [
        "Performance",
        "Auto-instrumentation patches modules as they load, so it must run before your app imports `http`, `pg` or `fastify`, or the trace has a silent gap",
        "It needs its own process",
        "ESM forbids side effects",
      ],
      correctIndex: 1,
      explanation:
        "The same ordering problem as Day 20's `process.loadEnvFile()`, with the same fix.",
    },
    {
      question: "Why is a `userId` label on a metric a serious mistake?",
      options: [
        "It leaks personal data only",
        "It creates one time series per user, so a million users is a million series, which is how teams take down their own monitoring",
        "Labels must be numeric",
        "It slows the counter",
      ],
      correctIndex: 1,
      explanation:
        "If you cannot write down the complete list of values a label can take, it belongs on a trace attribute or a log field instead.",
    },
    {
      question: "Why must a liveness check not query the database?",
      options: [
        "It is slow",
        "A brief database problem fails every instance, so the orchestrator restarts all of them and a recoverable blip becomes an outage plus a cold start",
        "Liveness cannot be async",
        "It leaks the connection string",
      ],
      correctIndex: 1,
      explanation:
        "Dependency checks belong in readiness, where the response is to stop routing rather than to restart.",
    },
    {
      question: "What should happen on `SIGTERM`?",
      options: [
        "Exit immediately",
        "Fail readiness at once, keep serving for a few seconds so the load balancer notices, then drain, flush telemetry and exit",
        "Reject everything with 503 and exit",
        "Restart",
      ],
      correctIndex: 1,
      explanation:
        "Exiting immediately turns every in-flight request into a 502, on every deploy.",
    },
    {
      question: "With 990 requests at 25ms and 10 at 3000ms, what were the mean and p99?",
      options: [
        "Mean 25ms, p99 3000ms",
        "Mean 57ms and p99 30ms, so the mean was higher than the p99 and no request actually took 57ms",
        "Both around 57ms",
        "Mean 3000ms, p99 25ms",
      ],
      correctIndex: 1,
      explanation:
        "Verified. The mean is pulled between two populations and describes neither, making a bimodal service look uniformly slightly slow.",
    },
    {
      question: "Why can you not average p95 values across instances?",
      options: [
        "Clock skew",
        "The p95 of two p95s is not the p95. Aggregate the underlying histograms instead.",
        "Instances sample differently",
        "You can, it is standard practice",
      ],
      correctIndex: 1,
      explanation:
        "Which is why metrics backends store histogram buckets rather than precomputed percentiles.",
    },
    {
      question: "Why separate 4xx from 5xx in your error metric?",
      options: [
        "Nicer dashboards",
        "A rise in 400s is usually a broken client or an attack and a rise in 500s is yours, so mixing them makes your alert fire for somebody else's bug",
        "4xx are not errors",
        "5xx are rarer",
      ],
      correctIndex: 1,
      explanation:
        "The same reasoning applies to error tracking: every 400 sent there buries real bugs under validation failures.",
    },
    {
      question: "Why is event loop delay the best saturation signal for a Node service?",
      options: [
        "It is cheap to collect",
        "A blocked loop fires zero ticks rather than late ones, so it catches exactly the failure Day 18's `hashSync` and Day 19's ReDoS produced, which CPU shows as one busy core",
        "It correlates with memory",
        "OTel requires it",
      ],
      correctIndex: 1,
      explanation:
        "Both were verified at zero ticks. It is the only signal that says \"this process is serving nobody\" while it is happening.",
    },
    {
      question: "Why check `hasSubscribers` before publishing on a diagnostics channel?",
      options: [
        "It is required",
        "It is false when nobody is listening, so you can skip building the message, which makes left-in instrumentation nearly free",
        "It prevents duplicates",
        "It flushes buffered events",
      ],
      correctIndex: 1,
      explanation:
        "Verified. Unlike `logger.debug`, which constructs its object before deciding to discard it.",
    },
    {
      question: "Why use `performance.now()` rather than `Date.now()` for durations?",
      options: [
        "It is faster to call",
        "It is monotonic, so it cannot go backwards when NTP adjusts the system clock and produce a negative duration in your metrics",
        "It returns a Date object",
        "It works in workers only",
      ],
      correctIndex: 1,
      explanation:
        "It is also higher resolution, which matters when the operation takes a fraction of a millisecond.",
    },
    {
      question: "What do logs, metrics and traces each answer?",
      options: [
        "They are interchangeable",
        "The metric says there is a problem and how much, the trace says where, and the log says why",
        "Logs and traces are the same thing",
        "Metrics replace the other two",
      ],
      correctIndex: 1,
      explanation:
        "A metric cannot tell you why, a log cannot tell you the rate, and neither says which of four services owns the latency.",
    },
  ],
  project: {
    name: "day-21",
    goal: "Instrument one service properly: structured logs with correlated request ids, a trace across two services, bounded metrics, and health checks that do not restart your fleet during a database blip.",
    brief:
      "Observability is the one topic where the build is genuinely more useful than the reading, because most of it only makes sense once you have searched your own logs during a problem you caused. So this project has you cause the problems. Block the event loop and watch which signal notices first. Log an error under the wrong key and see the empty object. Capture an AsyncLocalStorage store and watch it report the wrong request. Put a userId on a metric label and count the time series. Each is quick, and each one is a mistake you will otherwise make in something that matters.",
    steps: [
      "Start from your Day 19 project or create `day-21/` with `\"type\": \"module\"`, then install `fastify`, `pino`, `pino-pretty`, `zod` and the OpenTelemetry SDK with auto-instrumentations.",
      "Configure Pino with the level from Day 20's config, a `base` carrying service and version, and `pino-pretty` only when not production.",
      "Log at `trace`, `debug`, `info`, `warn` and `error` with no level set, and record which lines appeared.",
      "Set `LOG_LEVEL=debug` and confirm the missing lines appear.",
      "Log an error twice, once as `{ err }` and once as `{ error }`, and record both outputs side by side.",
      "Configure `redact` with `paths: [\"password\"]`, then log `{ password: \"x\" }` and `{ user: { password: \"x\" } }` and record which was masked.",
      "Fix it by adding the wildcard variants, and write out the full path list for your own entity shapes.",
      "Log `{ req: request }` on a route while sending an `Authorization` header, and confirm whether the token appears.",
      "Add `genReqId` that accepts a validated `x-request-id` and falls back to `randomUUID()`, then confirm both paths.",
      "Add an `onSend` hook echoing `x-request-id` back to the client.",
      "Set up `AsyncLocalStorage` in an `onRequest` hook, and add a `log()` helper that reads the store at call time.",
      "Write a four-layer call chain (route, service, repository, helper) that logs at every layer without passing a logger, and confirm every line carries the same `reqId`.",
      "Now break it: capture the store into a module-level `const` and confirm it reports a stale request id.",
      "Write `telemetry.js` with the OTel SDK, and start the app with `node --import ./telemetry.js server.js`.",
      "Import telemetry from inside `server.js` instead, and compare the resulting trace for missing spans.",
      "Add a manual span around a slow function with at least two attributes, then run it with small and large inputs and compare.",
      "Make that function throw, and confirm the span shows as errored only after you add `recordException` and `setStatus`.",
      "Add `trace_id` and `span_id` to every log line, then find a log by trace id and a trace by log line.",
      "Add a second tiny service that the first one calls with `fetch`, and confirm one trace spans both.",
      "Add a request counter and a duration histogram with only method, route pattern and status as labels.",
      "Now add `userId` as a label, generate a hundred distinct users, and count how many time series you created.",
      "Write `/health/live` returning a constant with `logLevel: \"silent\"`, and `/health/ready` that checks the database with a timeout.",
      "Stop your database and hit both endpoints. Record which one fails and explain what an orchestrator would do with each.",
      "Add the `SIGTERM` handler that fails readiness, waits, drains and flushes telemetry, then confirm an in-flight request completes during shutdown.",
      "Remove the wait, repeat, and confirm the in-flight request fails.",
      "Add `monitorEventLoopDelay` reporting p50, p99 and max every ten seconds, with `.unref()` and a `reset()`.",
      "Block the loop for two seconds with a synchronous loop, and record what happened to loop delay, CPU, request latency and error rate.",
      "Reproduce Day 19's ReDoS regex on a route and watch the same four signals.",
      "Generate 990 fast and 10 slow requests, then compute the mean, p50, p95, p99 and max yourself and write them down.",
      "Publish a custom `diagnostics_channel` event from a service function with a `hasSubscribers` guard, and subscribe from two separate files.",
      "Subscribe to `http.client.request.start` and list every host your process talks to during a normal run.",
      "Write an audit table and record one privileged action inside the same transaction as the change, with the request id on the row.",
    ],
    acceptance: [
      "You have the recorded output showing which levels appeared before you set `LOG_LEVEL`.",
      "You have the two log lines for `{ err }` and `{ error }` side by side, and can state why one is empty.",
      "You saw `user.password` survive a `password` redaction path, and your final path list covers your real shapes.",
      "Every log line from a four-layer request carries the same `reqId`, and no function signature mentions a logger.",
      "You reproduced the stale captured store and can explain why it is worse than having no correlation field.",
      "A request id supplied by a client appears in your logs, and one is generated when absent.",
      "The response carries `x-request-id`.",
      "One trace spans two services, and you can name the slowest span.",
      "A manual span has at least two attributes, and you can point at the attribute that explains the slowness.",
      "A throwing span shows as errored, and you know which two calls made that happen.",
      "Every log line carries `trace_id`, and you navigated from a log to a trace and back.",
      "You compared the trace from `--import` against the one from an in-file import and can describe the difference.",
      "You counted the time series created by adding `userId` to a metric label.",
      "With the database stopped, `/health/live` returns 200 and `/health/ready` returns 503, and you can say what each means to an orchestrator.",
      "An in-flight request completes during shutdown with the wait, and fails without it.",
      "You have a four-column note of what loop delay, CPU, latency and error rate did during a two-second block.",
      "You computed mean, p50, p95, p99 and max yourself on a bimodal sample and can explain why the mean is misleading.",
      "A diagnostics channel event is published with a `hasSubscribers` guard and consumed by two independent subscribers.",
      "You have the list of hosts your process contacted.",
      "One audit row exists, written in the same transaction as the change, carrying the request id.",
      "`npx tsc --noEmit` passes if you used TypeScript, and `node --test` passes.",
    ],
    stretch: [
      "Add sampling that keeps all failures and slow requests but only a fraction of successes, then verify the ratio over a thousand requests.",
      "Add `eventLoopUtilization` alongside loop delay and produce all three of the diagnostic combinations described in the lesson.",
      "Wire Sentry into `setErrorHandler` for 5xx only, and confirm a 400 does not appear there.",
      "Add a `POST /debug/level` endpoint behind an admin permission that changes the log level at runtime, then argue in a comment whether you would ship it.",
      "Deliberately create a high-cardinality metric, then rewrite the same question as a trace attribute and compare what each can answer.",
      "Add `/health/startup` as a separate probe and explain how it differs from readiness during a slow boot.",
      "Instrument a background job with the same context helper and confirm it logs without a request without throwing.",
      "Export metrics in Prometheus format and graph p50, p95 and p99 for one route.",
      "Run two instances behind a proxy, send a request through, and confirm the same trace id appears in both sets of logs.",
      "Measure the cost of your `debug` logging by benchmarking a hot route with the level at `debug` and at `info`.",
    ],
  },
};
