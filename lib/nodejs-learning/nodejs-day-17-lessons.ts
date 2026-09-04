import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_17_LESSONS: LessonDay = {
  day: 17,
  title: "Databases and the query layer",
  totalMinutes: 118,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "picking-a-database",
      title: "Picking a database",
      durationMinutes: 11,
      explanation:
        "Your Node application usually does not own the data. The database does. The query layer's job is to connect the two safely.\n\n```text\nHTTP Request\n     ↓\nFastify\n     ↓\nService / business logic\n     ↓\nQuery layer\n     ↓\nPostgreSQL\n     ↓\nQuery result\n     ↓\nApplication\n```\n\n---\n\n## PostgreSQL\n\n<b>PostgreSQL</b> (an open-source relational database known for strong SQL support, transactions, reliability and advanced features).\n\n> The reason it is the sensible default is not any single feature, it is that <b>you are unlikely to outgrow it</b>. It handles relational data, JSON documents, full-text search, geospatial data and queues well enough that most applications never need a second database. Picking it means the interesting decisions happen later, in your schema, rather than now in a migration you cannot undo.\n\n```text\nusers                    posts\n─────────────            ─────────────\nid                       id\nname                     user_id\nemail                    title\ncreated_at               body\n                         created_at\n```\n\n---\n\n## SQLite\n\n<b>SQLite</b> (an embedded relational database that stores the whole database in a single file rather than running a separate server).\n\n> \"Embedded\" is the whole point: there is no process, no port, no connection pool and no network. A query is a function call into a library. That makes it excellent for CLI tools, local development and <b>tests</b>, since creating a fresh in-memory database per test file costs almost nothing.\n\nThe honest limit is concurrency. SQLite serialises writes, so it is not the choice for an API serving many simultaneous writers, though it goes much further on reads than people assume.\n\n---\n\n## `node:sqlite`\n\nNode now ships SQLite:\n\n```javascript\nimport { DatabaseSync } from \"node:sqlite\";\n\nconst db = new DatabaseSync(\":memory:\");\ndb.exec(\"CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)\");\ndb.prepare(\"INSERT INTO users (name) VALUES (?)\").run(\"Rajan\");\nconsole.log(db.prepare(\"SELECT * FROM users\").all());\n```\n\nVerified working on Node 24.14.1. Two things the announcement posts leave out.\n\n> First, it is still <b>experimental</b>. Running that prints `ExperimentalWarning: SQLite is an experimental feature and might change at any time`. Verified. That is fine for a script or a test, and it is a real consideration for a production dependency, because \"might change\" means a minor Node upgrade can change the API.\n>\n> Second, rows come back as <b>null-prototype objects</b>. Verified: the output is `[Object: null prototype] { id: 1, name: 'Rajan' }`. They behave like plain objects for property access and `JSON.stringify`, but `row instanceof Object` is `false` and anything expecting `Object.prototype` methods on the row itself will surprise you.\n\nAlso note the placeholder. SQLite uses `?`, while PostgreSQL uses `$1`. Same idea, different syntax, and mixing them up is a confusing error rather than an obvious one.\n\n---\n\n## Choosing\n\n```text\nProduction application, concurrent writers  →  PostgreSQL\nCLI tool, local app, tests, prototypes      →  SQLite\n```\n\n> One caution about the \"start with SQLite and migrate later\" plan. Migrating is real work, because the two differ in type systems, date handling and concurrency behaviour, and the bugs surface under load rather than in tests. If you already know the thing is going to production with more than one writer, start where you are going.",
      diagram: `Where the query layer sits

    HTTP Request
         ↓
      Fastify
         ↓
    Service / business logic
         ↓
    QUERY LAYER          ← today
         ↓
     PostgreSQL
         ↓
    Query result
         ↓
     Application


Why Postgres is the default

    not any single feature.

    you are UNLIKELY TO OUTGROW IT.

      relational data · JSON documents
      full-text search · geospatial · queues

    most applications never need a second one.

    picking it means the interesting decisions
    happen later, in your schema, instead of now
    in a migration you cannot undo.


Why SQLite is genuinely good

    EMBEDDED. that is the whole point.

      no process   no port
      no pool      no network

    a query is a function call into a library.

    → CLI tools · local dev · TESTS
      a fresh in-memory DB per test file costs
      almost nothing

    honest limit: it serialises WRITES.
    not for an API with many concurrent writers.
    goes further on reads than people assume.


⚠ node:sqlite: two things left out

    verified working on Node 24.14.1

    1. still EXPERIMENTAL
       ExperimentalWarning: SQLite is an
       experimental feature and might change
       at any time
                              ← verified

       fine for a script or a test.
       a real consideration as a production
       dependency: a minor Node upgrade can
       change the API.

    2. rows are NULL-PROTOTYPE objects
       [Object: null prototype] { id: 1, ... }
                              ← verified

       property access and JSON.stringify work.
       row instanceof Object  is  FALSE.


⚠ Placeholders differ

    SQLite      ?
    PostgreSQL  $1

    same idea. different syntax.
    mixing them is a confusing error, not an
    obvious one.


Choosing

    production, concurrent writers  → PostgreSQL
    CLI · local · tests · prototype → SQLite

    ⚠ "start with SQLite, migrate later"
      is real work: different type systems, date
      handling and concurrency, and the bugs
      show up under LOAD, not in tests.

      if you know it is going to production with
      more than one writer, start where you are
      going.`,
      codeExample: {
        title: "node:sqlite, verified, including the parts nobody mentions",
        code: `// ── It works, today, with no dependency ─────────────────────
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(":memory:");

db.exec(\`
  CREATE TABLE users (
    id    INTEGER PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );
\`);

const insert = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
insert.run("Rajan", "rajan@example.com");
insert.run("Alice", "alice@example.com");

console.log(db.prepare("SELECT * FROM users").all());
// Verified output on Node 24.14.1:
//
// [
//   [Object: null prototype] {
//     id: 1, name: 'Rajan', email: 'rajan@example.com'
//   },
//   [Object: null prototype] {
//     id: 2, name: 'Alice', email: 'alice@example.com'
//   }
// ]


// ── ⚠ Thing one: the warning is real ────────────────────────
// $ node app.js
//
// (node:84042) ExperimentalWarning: SQLite is an experimental
// feature and might change at any time
//
// Verified. Suppress it if you must:
//   node --disable-warning=ExperimentalWarning app.js
//
// But suppressing a warning does not change what it says.
// "Might change at any time" means a minor Node upgrade can
// change this API. That is acceptable for a test helper and a
// decision to make consciously for a production dependency.


// ── ⚠ Thing two: null-prototype rows ────────────────────────
const row = db.prepare("SELECT * FROM users WHERE id = ?").get(1);

console.log(row.name);                    // "Rajan"     ✓
console.log(JSON.stringify(row));         // works       ✓
console.log(row instanceof Object);       // false       ← verified
console.log(Object.getPrototypeOf(row));  // null

// So this throws:
//   row.hasOwnProperty("name")
//   TypeError: row.hasOwnProperty is not a function
//
// Use the static form instead:
Object.hasOwn(row, "name");               // true
//
// It is a deliberate choice by Node (a column literally named
// "toString" cannot then shadow a method), and it will confuse
// you exactly once. If a library needs plain objects:
const plain = { ...row };


// ── The placeholder difference ──────────────────────────────
// SQLite:
db.prepare("SELECT * FROM users WHERE email = ?").get("alice@example.com");

// PostgreSQL, with pg:
await pool.query("SELECT * FROM users WHERE email = $1", ["alice@example.com"]);
//
// Both are parameterized and both are safe. Using $1 against
// SQLite gives you an unhelpful syntax error rather than an
// obvious "wrong placeholder style" message.


// ── Where SQLite genuinely shines: tests ────────────────────
import { test } from "node:test";
import assert from "node:assert/strict";

function freshDb() {
  const db = new DatabaseSync(":memory:");
  db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
  return db;
}

test("users can be inserted", (t) => {
  const db = freshDb();              // brand new, in memory
  t.after(() => db.close());

  db.prepare("INSERT INTO users (name) VALUES (?)").run("Rajan");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM users").get().n, 1);
});
//
// No container to start. No port. No cleanup between tests
// beyond close(). No shared state, so Day 13's parallel tests
// stay parallel.
//
// This pattern is worth knowing even on a Postgres project,
// for the parts of your code that are database-shaped but not
// Postgres-specific.


// ── Also useful: reading a file-based database ──────────────
const file = new DatabaseSync("./app.db");
// Same API. The file is the whole database: copy it, commit a
// fixture of it, ship it inside a CLI tool.
file.close();`,
      },
      keyTakeaways: [
        "PostgreSQL is the default not for one feature but because you are unlikely to outgrow it. Relational data, JSON, search and queues in one place.",
        "SQLite is embedded: no process, no port, no pool, no network. A query is a function call.",
        "That makes SQLite excellent for tests, since a fresh in-memory database per test file costs almost nothing and keeps Day 13's tests parallel.",
        "SQLite serialises writes, so it is not for an API with many concurrent writers. It goes further on reads than people assume.",
        "Verified: `node:sqlite` works on Node 24.14.1 and prints `ExperimentalWarning: SQLite is an experimental feature and might change at any time`.",
        "Verified: rows are null-prototype objects. Property access and `JSON.stringify` work, but `row instanceof Object` is false and `row.hasOwnProperty` throws. Use `Object.hasOwn`.",
        "Placeholders differ: SQLite uses `?`, PostgreSQL uses `$1`. Mixing them gives a confusing syntax error.",
        "\"Start with SQLite and migrate later\" is real work, and the differences surface under load rather than in tests.",
      ],
      commonMistakes: [
        "Treating `node:sqlite` as stable because it is built in. It is experimental, and a minor Node upgrade can change the API.",
        "Suppressing the experimental warning and forgetting what it said.",
        "Calling `row.hasOwnProperty(...)` on a `node:sqlite` row. It throws, because the row has no prototype.",
        "Using `$1` placeholders against SQLite or `?` against Postgres. The error message does not tell you that is the problem.",
        "Choosing SQLite for a production API with concurrent writers because it was easy locally.",
        "Adding a second database for one feature Postgres already does. JSON, search and queues are usually not a reason to add infrastructure.",
      ],
      quiz: [
        {
          question: "What was verified about `node:sqlite` on Node 24.14.1?",
          options: [
            "It is stable and production-ready",
            "It works, and prints an `ExperimentalWarning` saying it might change at any time",
            "It is not available yet",
            "It only supports in-memory databases",
          ],
          correctIndex: 1,
          explanation:
            "Fine for a script or test helper. A conscious decision as a production dependency, since a minor upgrade can change the API.",
        },
        {
          question: "What surprising thing was verified about rows returned by `node:sqlite`?",
          options: [
            "They are arrays",
            "They are null-prototype objects, so `row instanceof Object` is false and `row.hasOwnProperty` throws",
            "They are frozen",
            "Columns are lower-cased",
          ],
          correctIndex: 1,
          explanation:
            "Property access and `JSON.stringify` work fine. Use `Object.hasOwn(row, key)` or spread into a plain object.",
        },
        {
          question: "What is SQLite's real limitation for an API?",
          options: [
            "It cannot do joins",
            "It serialises writes, so it is not for many concurrent writers",
            "It has no transactions",
            "It cannot store more than 2GB",
          ],
          correctIndex: 1,
          explanation:
            "Reads scale much further than people assume. Writes are the constraint.",
        },
        {
          question: "Why is PostgreSQL the sensible default?",
          options: [
            "It is the fastest",
            "You are unlikely to outgrow it, so the interesting decisions happen later in your schema rather than now in a migration",
            "It is the only one with transactions",
            "It has the best ORM support",
          ],
          correctIndex: 1,
          explanation:
            "Relational data, JSON, full-text search and queues in one system means most applications never need a second.",
        },
      ],
    },
    {
      id: "connections-and-pooling",
      title: "Connections and the pool",
      durationMinutes: 12,
      explanation:
        "For PostgreSQL from Node the common client is `pg`.\n\n```text\nNode.js  →  pg  →  PostgreSQL\n```\n\nYou could open one connection per request. You should not.\n\n---\n\n## Connection pool\n\n<b>Connection pool</b> (a reusable set of database connections your application borrows from and returns to).\n\n> The reason this exists is that a PostgreSQL connection is <b>expensive to create and expensive to keep</b>. On the server side each one is a separate operating-system process with its own memory, and setting one up involves a TCP handshake, TLS and authentication. So a connection is not like an HTTP request; it is closer to a rented machine, and you want a small number of them working hard.\n\n```text\nWithout a pool          With a pool\n────────────────        ────────────────\nRequest                 Request\n  ↓                       ↓\ncreate connection       borrow connection\n  ↓                       ↓\nquery                   query\n  ↓                       ↓\ndestroy connection      RETURN connection\n                          ↓\n                        next request reuses it\n```\n\n---\n\n## Why more is not better\n\nThe instinct is that more connections means more throughput. It does not.\n\n```text\nToo few          →  requests queue and wait\nToo many         →  the database thrashes\nRight-sized      →  healthy throughput\n```\n\n> The mechanism is worth understanding rather than memorising. Your database has a fixed number of CPU cores and one disk. Beyond the point where every core is busy, extra concurrent queries do not run faster, they run <b>interleaved</b>, each one slower, while adding context switching, lock contention and memory pressure. So a pool of 500 against a database that can usefully do 20 makes every query slower and the system less able to recover. Queueing in your application, where it is cheap and visible, beats queueing inside the database, where it is neither.\n\n---\n\n## The multiplication people forget\n\nPool size is <b>per application instance</b>.\n\n```text\n10 containers  ×  20 connections  =  200 connections\n```\n\nAnd PostgreSQL's default `max_connections` is often 100.\n\n> This is the pool bug that shows up in production and not in staging, because staging runs one instance. The symptom is `FATAL: sorry, too many clients already` appearing when you scale up, or after a deploy when old and new pods briefly overlap. The fix is arithmetic before it is configuration: divide the database's budget by the number of instances you can have <b>at once, including during a rolling deploy</b>. Anything else that connects, a migration job, a cron task, your own `psql` session, comes out of the same budget.\n\n---\n\n## Sizing\n\nDo not copy `pool = 100` from a tutorial. It depends on your database's capacity, your concurrency, how long queries take, how many instances you run, and the hardware.\n\nA reasonable starting point is small: 10 per instance, then measure. What you are watching is whether requests wait for a connection, not whether the pool is \"full\".\n\n---\n\n## Two settings that matter more than size\n\n`connectionTimeoutMillis` decides what happens when the pool is exhausted. Without it, a request waits forever, which turns a slow database into a hung application and takes your health check with it. With it, you get a fast, loggable failure.\n\n`idleTimeoutMillis` closes connections nobody is using, which matters behind a connection proxy or a serverless platform.\n\n> And test the connection at startup, in the plugin, the way Day 15 did. A pool that has never connected looks perfectly healthy until the first request arrives.",
      diagram: `A connection is not a request

    it is closer to a RENTED MACHINE.

    server side: each connection is a separate
    OS PROCESS with its own memory

    setup cost: TCP handshake + TLS + auth

    → you want a SMALL NUMBER working HARD.


Without a pool vs with

    Request                Request
      ↓                      ↓
    CREATE connection      borrow
      ↓                      ↓
    query                  query
      ↓                      ↓
    DESTROY connection     RETURN
                             ↓
                           next request reuses


⚠ Why more is not better

    too few       requests queue and wait
    too many      the database THRASHES
    right-sized   healthy throughput

    the mechanism:

      your DB has fixed cores and one disk.

      past the point where every core is busy,
      extra concurrent queries do not run
      faster. they run INTERLEAVED, each one
      slower, plus:
        context switching
        lock contention
        memory pressure

      a pool of 500 against a DB that can
      usefully do 20 makes every query slower
      AND makes recovery harder.

    queue in your APP, where it is cheap and
    visible, not in the DATABASE, where it is
    neither.


⚠ The multiplication people forget

    pool size is PER INSTANCE.

    10 containers × 20 connections = 200

    Postgres default max_connections is often 100.

    this is the pool bug that appears in
    PRODUCTION and not staging, because staging
    runs ONE instance.

    symptom:
      FATAL: sorry, too many clients already
      when you scale up, or during a deploy
      when old and new pods overlap

    fix is ARITHMETIC before configuration:
      DB budget ÷ max instances AT ONCE,
      including during a rolling deploy

    and everything else connects too:
      migration job · cron · your own psql


Two settings that matter more than size

    connectionTimeoutMillis
      what happens when the pool is EXHAUSTED
      without it: a request waits FOREVER
        → a slow database becomes a hung app
        → and it takes your health check with it
      with it: a fast, loggable failure

    idleTimeoutMillis
      closes connections nobody is using
      matters behind a proxy or serverless


Start small, then measure

    10 per instance. measure.

    watch whether requests WAIT for a connection.
    not whether the pool is "full".

    and test the connection AT STARTUP (Day 15).
    a pool that never connected looks perfectly
    healthy until the first request.`,
      codeExample: {
        title: "A pool plugin, sized by arithmetic rather than by copying",
        code: `// ── plugins/database.js ─────────────────────────────────────
import fp from "fastify-plugin";
import pg from "pg";

async function database(app) {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,

    // ── Size ────────────────────────────────────────────────
    // Arithmetic, not a copied number.
    //
    //   Postgres max_connections        100
    //   reserved for superuser           -3
    //   migrations + cron + a human      -10
    //   available to the app              87
    //   max app instances at once
    //     (4 desired, up to 8 during a
    //      rolling deploy)                 8
    //   per instance                    ~10
    //
    // The rolling-deploy number is the one people miss. For a
    // few seconds you have both the old and new set running.
    max: Number(process.env.DB_POOL_MAX ?? 10),
    min: 0,

    // ── Fail fast instead of hanging ────────────────────────
    // Without this, a request waits forever for a connection.
    // A slow database then becomes a hung application, and
    // your health check hangs too, so the orchestrator cannot
    // tell that anything is wrong.
    connectionTimeoutMillis: 5_000,

    // Close connections nobody is using. Matters behind
    // pgbouncer, and on platforms that freeze idle instances.
    idleTimeoutMillis: 30_000,

    // A ceiling on a single query, so one pathological
    // statement cannot hold a connection indefinitely.
    statement_timeout: 10_000,
  });

  // ── Fail at startup, not at the first request ───────────
  // Day 15's rule. A pool that has never connected looks
  // perfectly healthy.
  await pool.query("SELECT 1");

  // The pool emits errors for idle clients. Unhandled, this
  // is Day 4's uncaught exception.
  pool.on("error", (err) => {
    app.log.error({ err }, "idle database client error");
  });

  app.decorate("db", pool);

  // Day 11's graceful shutdown, as a framework hook.
  app.addHook("onClose", async () => {
    await pool.end();
  });
}

export default fp(database, { name: "database" });
//   ^^ Day 15: infrastructure breaks out of its scope.


// ── What exhaustion looks like ──────────────────────────────
// Without connectionTimeoutMillis:
//
//   Every request that needs a connection waits. Forever.
//   Your p99 becomes "no response". GET /health hangs, so
//   Kubernetes cannot tell the pod is unhealthy and does not
//   restart it. The pod sits there accepting requests it will
//   never answer.
//
// With it:
//
//   Error: timeout exceeded when trying to connect
//
//   A real error, logged, with a request id, and a 503 you
//   can alert on. Day 4's distinction: an expected
//   operational failure, handled, rather than a hang.


// ── Watching the right numbers ──────────────────────────────
app.get("/health/db", async () => {
  return {
    total: app.db.totalCount,     // connections that exist
    idle: app.db.idleCount,       // connections free right now
    waiting: app.db.waitingCount, // requests QUEUED for one
  };
});
//
// waitingCount is the number to care about. A pool that is
// always fully busy is a pool doing its job. A pool with
// requests waiting is a pool that is too small, or queries
// that are too slow, and the two need opposite fixes:
//
//   waiting > 0, queries fast     ->  pool too small
//   waiting > 0, queries slow     ->  fix the queries.
//                                     a bigger pool just
//                                     sends more slow
//                                     queries at a database
//                                     already saturated.


// ── The arithmetic, as a check you can actually run ─────────
// In psql:
//
//   SHOW max_connections;
//   SELECT count(*) FROM pg_stat_activity;
//   SELECT count(*), application_name
//     FROM pg_stat_activity GROUP BY application_name;
//
// That last one tells you who is actually using your budget,
// which is usually more surprising than you expect. Set
// application_name in your connection string so your app
// shows up by name:
//
//   postgres://...?application_name=users-api


// ── Borrowing a single connection deliberately ──────────────
// pool.query() borrows and returns for you, which is what you
// want almost always. You need an explicit client when
// several statements must run on the SAME connection:
//
const client = await app.db.connect();
try {
  await client.query("BEGIN");
  await client.query("UPDATE accounts SET balance = balance - 100 WHERE id = $1", [1]);
  await client.query("UPDATE accounts SET balance = balance + 100 WHERE id = $1", [2]);
  await client.query("COMMIT");
} catch (err) {
  await client.query("ROLLBACK");
  throw err;
} finally {
  client.release();      // ← forget this and you have leaked
                         //   a connection. Do it enough times
                         //   and the pool is empty forever.
}
//
// That finally block is not optional. A leaked connection is
// never returned, so the pool shrinks by one permanently, and
// the failure arrives hours later as timeouts with no obvious
// cause. The transactions lesson shows the safer form.`,
      },
      keyTakeaways: [
        "A PostgreSQL connection is closer to a rented machine than a request: a separate server-side process, plus a TCP, TLS and auth handshake to create.",
        "So you want a small number of connections working hard, borrowed and returned rather than created and destroyed.",
        "More connections do not mean more throughput. Past the point where every core is busy, extra queries run interleaved and slower, with added context switching and lock contention.",
        "Queue in your application, where it is cheap and visible, rather than inside the database, where it is neither.",
        "Pool size is per instance. Ten containers at 20 each is 200 connections, against a common `max_connections` of 100.",
        "That bug appears in production and not staging, because staging runs one instance. Include the overlap during a rolling deploy in the arithmetic.",
        "Migrations, cron jobs and your own `psql` session come out of the same budget.",
        "`connectionTimeoutMillis` matters more than size: without it a request waits forever, which hangs your health check too, so nothing restarts the pod.",
        "Watch `waitingCount`. Requests waiting with fast queries means the pool is too small; with slow queries it means fix the queries, because a bigger pool sends more work at a saturated database.",
      ],
      commonMistakes: [
        "Creating a connection per request. The handshake cost dwarfs the query.",
        "Copying a pool size from a tutorial. The right number depends on your database's capacity and your instance count.",
        "Forgetting that pool size multiplies by instance count, then seeing `too many clients already` the first time you scale.",
        "Not accounting for the rolling deploy, where old and new instances briefly both hold full pools.",
        "Leaving `connectionTimeoutMillis` unset, so a slow database becomes a hung application with a hanging health check.",
        "Not testing the connection at startup. A pool that has never connected looks healthy.",
        "Raising the pool size because requests are waiting, when the queries are the slow part. That makes it worse.",
        "Forgetting `client.release()` in a `finally`. The pool permanently shrinks and the failure appears hours later.",
      ],
      quiz: [
        {
          question: "Why is a connection pool worth the complexity?",
          options: [
            "Connections are unlimited but slow",
            "A PostgreSQL connection is a separate server-side process plus a TCP, TLS and auth handshake, so it is expensive to create and to keep",
            "It parallelises queries",
            "It caches query results",
          ],
          correctIndex: 1,
          explanation:
            "A connection is closer to a rented machine than a request. You want few, working hard.",
        },
        {
          question: "Why does a very large pool make things slower?",
          options: [
            "The client library slows down",
            "Past the point where every core is busy, extra queries run interleaved and slower, with context switching and lock contention on top",
            "Postgres rejects them",
            "Memory in Node runs out",
          ],
          correctIndex: 1,
          explanation:
            "Queueing in your application is cheap and visible. Queueing inside the database is neither.",
        },
        {
          question: "Ten containers each with a pool of 20. How many database connections is that, and why does it matter?",
          options: [
            "20, the pool is shared",
            "200, against a common `max_connections` of 100, which is why this fails in production and not in single-instance staging",
            "10",
            "It depends on traffic",
          ],
          correctIndex: 1,
          explanation:
            "And a rolling deploy briefly doubles the instance count, which is the part people leave out of the arithmetic.",
        },
        {
          question: "What happens without `connectionTimeoutMillis` when the pool is exhausted?",
          options: [
            "An immediate error",
            "Requests wait forever, so a slow database becomes a hung app and the health check hangs too, and nothing restarts the pod",
            "The pool grows automatically",
            "Postgres kills the query",
          ],
          correctIndex: 1,
          explanation:
            "A fast, loggable failure is far better than a hang your orchestrator cannot detect.",
        },
        {
          question: "`waitingCount` is above zero and your queries are slow. What is the fix?",
          options: [
            "Increase the pool size",
            "Fix the queries. A bigger pool just sends more slow queries at a database that is already saturated.",
            "Add more instances",
            "Lower `idleTimeoutMillis`",
          ],
          correctIndex: 1,
          explanation:
            "Requests waiting with fast queries means the pool is too small. The two symptoms look identical and need opposite fixes.",
        },
      ],
    },
    {
      id: "orm-landscape",
      title: "The ORM landscape",
      durationMinutes: 11,
      explanation:
        "Five common ways to talk to a database from Node, at different levels of abstraction.\n\n```text\nApproach   Abstraction   SQL control   Type safety\n─────────  ───────────   ───────────   ───────────\nRaw SQL    low           highest       depends\nKysely     low           highest       highest\nDrizzle    medium-low    highest       highest\nPrisma     medium-high   medium        highest\nTypeORM    high          low           high\n```\n\n---\n\n## Raw SQL\n\n```sql\nSELECT * FROM users WHERE id = $1;\n```\n\nMaximum control, no abstraction, and you can see exactly what reaches the database. The costs are repetition and no application-level type safety, so a renamed column becomes a runtime error rather than a compile error.\n\n> Raw SQL is a completely valid choice, and the thing to be clear about is that <b>the alternatives are not a substitute for knowing it</b>. Every tool below compiles down to SQL, and when a query is slow you will be reading SQL in a query plan, not method calls.\n\n---\n\n## Prisma\n\n<b>Prisma</b> (a TypeScript ORM with a schema-driven data model, migrations and a generated client).\n\n```text\nPrisma schema → generate client → your app → database\n```\n\nStrong developer experience, strong migrations, generated types, easy CRUD.\n\n> The trade is worth stating fairly rather than dismissively, because Prisma is a reasonable choice. You write in <b>Prisma's own schema language</b> rather than TypeScript, so there is a code generation step in your build and a second language in your repository. And the query API is further from SQL, which is a real cost exactly when you need it least: the complex query you cannot express in it is the one you are debugging.\n\n---\n\n## Drizzle\n\n<b>Drizzle</b> (a lightweight TypeScript ORM and query builder designed around SQL-like queries and strong type safety).\n\n```typescript\nconst users = await db.select().from(usersTable).where(eq(usersTable.id, userId));\n```\n\n> The philosophy is worth stating precisely: Drizzle maps <b>SQL onto TypeScript</b>, where a traditional ORM maps an object model onto SQL. The practical consequence is that what you write and what runs have the same shape, so a query plan you look at is recognisably the query you wrote. That is why this track defaults to it: it teaches you SQL rather than hiding it.\n\n<b>Drizzle is the default for this track.</b>\n\n---\n\n## Kysely\n\n<b>Kysely</b> (a type-safe SQL query builder focused on building queries rather than providing ORM concepts).\n\nEven closer to SQL than Drizzle, with excellent typing.\n\n> The distinction from Drizzle is that Kysely has <b>no ORM concepts at all</b>. No relations, no nested reads, no schema-derived model, just a typed way to build a query. That is a feature when you want types and nothing else, and it means the convenient things Drizzle does for you today, like nested relational reads, you write yourself.\n\n---\n\n## TypeORM\n\n<b>TypeORM</b> (an ORM that maps application classes and entities to relational structures).\n\nEntities, repositories, relations and decorators, in the tradition of Hibernate. You will meet it in existing Node and NestJS codebases, so it is worth understanding even if you would not pick it now.\n\n---\n\n## The lesson under the table\n\n> <b>An ORM does not replace knowing SQL.</b> Every one of these generates SQL, and the problems that actually hurt in production are SQL problems: a missing index, a query returning a million rows, a lock held too long, and the N+1 pattern at the end of today. None of those is visible at the ORM's level of abstraction, and none is fixed there.\n>\n> The practical habit that follows: whichever tool you pick, learn how to <b>see the SQL it generates</b>. In Drizzle that is `.toSQL()`, in Prisma it is query logging. A query builder you cannot see through is a query builder you cannot debug.",
      diagram: `Five approaches, one axis

    approach   abstraction  SQL control  types
    ─────────  ───────────  ───────────  ─────
    Raw SQL    low          highest      depends
    Kysely     low          highest      highest
    Drizzle    medium-low   highest      highest
    Prisma     medium-high  medium       highest
    TypeORM    high         low          high


Raw SQL

    ✓ maximum control
    ✓ you see exactly what reaches the DB
    ✗ repetitive
    ✗ a renamed column is a RUNTIME error

    completely valid. and the alternatives are
    NOT a substitute for knowing it.


Drizzle: the direction matters

    traditional ORM
      object model  →  ORM  →  SQL

    Drizzle
      SQL  →  TypeScript

    consequence: what you WRITE and what RUNS
    have the same shape.

    a query plan you look at is recognisably the
    query you wrote.

    → why this track defaults to it.
      it teaches you SQL instead of hiding it.


Prisma: the trade, stated fairly

    ✓ developer experience
    ✓ migrations
    ✓ generated types
    ✓ easy CRUD

    ✗ its own schema language, not TypeScript
    ✗ a code generation step in your build
    ✗ further from SQL, so complex queries can
      be harder to express than to write


Kysely / TypeORM

    Kysely    even closer to SQL than Drizzle
              strong types, zero ORM concepts

    TypeORM   entities · repositories
              relations · decorators
              you WILL meet it in existing
              Node and NestJS code


The lesson under the table

    AN ORM DOES NOT REPLACE KNOWING SQL.

    the problems that hurt in production are
    SQL problems:
      a missing index
      a query returning a million rows
      a lock held too long
      N+1                     ← end of today

    none of those is VISIBLE at the ORM's level
    of abstraction, and none is FIXED there.


The habit that follows

    whichever tool: learn to SEE THE SQL.

      Drizzle   .toSQL()
      Prisma    query logging
      pg        it is already SQL

    a query builder you cannot see through is a
    query builder you cannot debug.`,
      codeExample: {
        title: "The same query, five ways, and how to see the SQL",
        code: `// ── Raw SQL with pg ─────────────────────────────────────────
const { rows } = await pool.query(
  "SELECT id, name, email FROM users WHERE id = $1",
  [userId],
);
const user = rows[0];
// rows is any[]. Rename a column and this breaks at runtime,
// in production, on the one endpoint nobody tested.


// ── Drizzle ─────────────────────────────────────────────────
import { eq } from "drizzle-orm";

const [user] = await db
  .select({ id: users.id, name: users.name, email: users.email })
  .from(users)
  .where(eq(users.id, userId));
// user is typed. Rename the column in the schema and this
// fails to compile, pointing at this line.


// ── Kysely ──────────────────────────────────────────────────
const user = await db
  .selectFrom("users")
  .select(["id", "name", "email"])
  .where("id", "=", userId)
  .executeTakeFirst();
// Closest of all to SQL, with full typing. No ORM concepts.


// ── Prisma ──────────────────────────────────────────────────
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, name: true, email: true },
});
// Shortest, and furthest from the SQL that runs.


// ── TypeORM ─────────────────────────────────────────────────
const user = await userRepository.findOne({
  where: { id: userId },
  select: ["id", "name", "email"],
});
// Entity and repository shaped. You will meet this.


// ═══════════════════════════════════════════════════════════
// The habit that outlasts your tool choice: see the SQL
// ═══════════════════════════════════════════════════════════

// ── Drizzle: .toSQL() ───────────────────────────────────────
const query = db.select().from(users).where(eq(users.id, 1));

console.log(query.toSQL());
// {
//   sql: 'select "id", "name", "email" from "users" where "users"."id" = $1',
//   params: [ 1 ]
// }
//
// Two things to notice. The SQL is recognisably what you
// wrote, and the value is a PARAMETER, not interpolated text.
// The injection lesson later today is about exactly that.


// ── Prisma: log the queries ─────────────────────────────────
const prisma = new PrismaClient({
  log: [{ emit: "event", level: "query" }],
});
prisma.$on("query", (e) => {
  console.log(e.query, e.params, e.duration + "ms");
});
//
// Turn this on the first time you use an ORM, not the first
// time something is slow. What you find is usually a query
// you did not know you were making.


// ── pg: log slow ones ───────────────────────────────────────
async function query(sql, params) {
  const started = process.hrtime.bigint();
  try {
    return await pool.query(sql, params);
  } finally {
    const ms = Number(process.hrtime.bigint() - started) / 1e6;
    if (ms > 100) app.log.warn({ sql, ms: Math.round(ms) }, "slow query");
  }
}
//
// Day 14's measure-before-you-guess rule, pointed at the
// database. A slow-query log is worth more than any amount
// of reasoning about which query "should" be slow.


// ── Why this matters more than the tool choice ──────────────
// This is a real Drizzle query. It is also an N+1.
//
//   for (const user of users) {
//     user.posts = await db.select().from(posts)
//       .where(eq(posts.userId, user.id));
//   }
//
// Type-safe. Fully validated. Correct. And it executes one
// query per user.
//
// No amount of type safety catches that, because nothing
// about it is a type error. Only seeing the SQL, or counting
// the queries, catches it. The last lesson today is that.`,
      },
      keyTakeaways: [
        "Five approaches on one axis, from raw SQL and Kysely at the SQL end to TypeORM at the object-model end.",
        "Drizzle maps SQL onto TypeScript; a traditional ORM maps an object model onto SQL. That direction is the difference.",
        "Because of that direction, a Drizzle query and the SQL that runs have the same shape, so a query plan is recognisably the query you wrote.",
        "Drizzle is this track's default because it teaches SQL rather than hiding it.",
        "Prisma's trade is real and fair: excellent developer experience and migrations, against its own schema language, a codegen step and more distance from SQL.",
        "Raw SQL's cost is not verbosity, it is that a renamed column becomes a runtime error rather than a compile error.",
        "An ORM does not replace knowing SQL. The problems that hurt are SQL problems: missing indexes, unbounded result sets, long-held locks, N+1.",
        "So learn how to see the generated SQL: `.toSQL()` in Drizzle, query logging in Prisma. A query builder you cannot see through is one you cannot debug.",
        "Type safety does not catch an N+1, because nothing about an N+1 is a type error.",
      ],
      commonMistakes: [
        "Choosing an ORM to avoid learning SQL. The abstraction leaks at exactly the moment you need it least.",
        "Never looking at the generated SQL. Most surprising database behaviour is visible in one `.toSQL()` call.",
        "Turning on query logging only after something is slow, instead of the first time you use the tool.",
        "Assuming type safety implies query efficiency. An N+1 is fully type-safe.",
        "Dismissing raw SQL as unprofessional. It is a valid choice, and its real cost is the missing compile-time check.",
        "Picking a tool from a benchmark or a blog post rather than from what your team can maintain and debug.",
      ],
      quiz: [
        {
          question: "What is the structural difference between Drizzle and a traditional ORM?",
          options: [
            "Drizzle is faster",
            "Drizzle maps SQL onto TypeScript; a traditional ORM maps an object model onto SQL",
            "Drizzle has no types",
            "Drizzle does not support migrations",
          ],
          correctIndex: 1,
          explanation:
            "Which means what you write and what runs have the same shape, so a query plan is recognisable.",
        },
        {
          question: "What is raw SQL's real cost compared with a typed query builder?",
          options: [
            "It is slower",
            "A renamed column becomes a runtime error rather than a compile error",
            "It cannot be parameterized",
            "It cannot do joins",
          ],
          correctIndex: 1,
          explanation:
            "Verbosity is the visible cost. The missing compile-time check is the expensive one.",
        },
        {
          question: "Why does \"an ORM does not replace knowing SQL\" matter in practice?",
          options: [
            "For interviews",
            "The problems that hurt in production are SQL problems, and none of them is visible or fixable at the ORM's level of abstraction",
            "ORMs generate invalid SQL",
            "SQL is faster to write",
          ],
          correctIndex: 1,
          explanation:
            "Missing indexes, unbounded result sets, long locks and N+1. You will be reading a query plan, not method calls.",
        },
        {
          question: "Why will type safety not save you from an N+1?",
          options: [
            "The types are wrong",
            "Nothing about an N+1 is a type error. The code is correct, validated and type-safe, and still runs one query per row.",
            "N+1 only happens in raw SQL",
            "It would, with strict mode",
          ],
          correctIndex: 1,
          explanation:
            "Only seeing the SQL or counting the queries catches it, which is why `.toSQL()` and query logging are habits worth forming early.",
        },
      ],
    },
    {
      id: "drizzle-schema-and-types",
      title: "Drizzle: schema and inferred types",
      durationMinutes: 11,
      explanation:
        "Your database has a schema. With Drizzle you declare it in TypeScript.\n\n```typescript\nimport { pgTable, integer, text, timestamp } from \"drizzle-orm/pg-core\";\n\nexport const users = pgTable(\"users\", {\n  id: integer().primaryKey(),\n  name: text().notNull(),\n  email: text().notNull().unique(),\n  createdAt: timestamp(\"created_at\").defaultNow().notNull(),\n});\n```\n\nVerified on `drizzle-orm@0.45.2`: the column builders work without an explicit name argument, taking the property key, and `users.name.notNull` is `true` on the resulting object.\n\n> One thing worth naming, because it is a common source of confusion. The column name is the <b>property key</b> unless you pass one. Database columns are conventionally `snake_case` and TypeScript properties are conventionally `camelCase`, so `createdAt: timestamp(\"created_at\")` passes the real column name explicitly while keeping the readable property. Get this wrong and you get a runtime error naming a column that does not exist, which is at least an obvious failure.\n\n---\n\n## Inferring types\n\n```typescript\ntype User = typeof users.$inferSelect;\ntype NewUser = typeof users.$inferInsert;\n```\n\n```text\nDatabase schema → Drizzle schema → TypeScript type\n```\n\n> This is Day 16's single source of truth, one layer down. There the schema was the source and the type was derived; here the <b>table definition</b> is the source. So a column rename is a compile error in every file that reads it, rather than a runtime error on the one endpoint nobody tested.\n>\n> A detail that saves confusion: verified, `$inferSelect` is a <b>type-only</b> property. `\"$inferSelect\" in users` is `false` at runtime. You cannot log it or inspect it; it exists purely for `typeof`.\n\nThe two are genuinely different, and that difference is the point. `$inferSelect` is what a row looks like coming out: `id` present, `createdAt` present. `$inferInsert` is what you need to put one in: `id` optional if the database generates it, `createdAt` optional because it has a default. Hand-writing one interface for both means either lying about inserts or lying about reads.\n\n---\n\n## Connecting the two halves of the day\n\nYou now have two schema systems: Zod at the HTTP boundary and Drizzle at the database. They are not competitors, and it matters that you do not try to merge them.\n\n```text\nHTTP boundary        Database\n─────────────        ────────\nZod                  Drizzle\nwhat clients may     what the storage\nsend and see         actually holds\n```\n\n> Keep them separate on purpose. `passwordHash` belongs in the Drizzle schema and must never appear in a Zod response schema. `passwordConfirmation` belongs in the Zod create schema and does not exist in the database at all. Merging them forces one of those two mistakes. `drizzle-zod` can generate a starting Zod schema from a table, and it is a starting point rather than the answer: your API contract should be a deliberate decision, not a projection of your storage layout.\n\n---\n\n## Relationships\n\n```typescript\nexport const posts = pgTable(\"posts\", {\n  id: integer().primaryKey(),\n  userId: integer(\"user_id\").notNull().references(() => users.id),\n  title: text().notNull(),\n});\n```\n\n`.references()` declares the foreign key, which is what lets the database refuse a post pointing at a user who does not exist. That guarantee lives in the database, not in your application, which is the only place it cannot be bypassed by a script, a migration or a second service.",
      diagram: `Declare the schema in TypeScript

    export const users = pgTable("users", {
      id: integer().primaryKey(),
      name: text().notNull(),
      email: text().notNull().unique(),
      createdAt: timestamp("created_at")
                   .defaultNow().notNull(),
    });

    verified on drizzle-orm 0.45.2:
      builders work with NO name argument
      users.name.notNull  is  true


⚠ The column name is the PROPERTY KEY

    unless you pass one.

    DB columns    snake_case
    TS properties camelCase

    createdAt: timestamp("created_at")
                          ^^^^^^^^^^ the real
                                     column

    get it wrong → runtime error naming a column
    that does not exist. at least it is obvious.


Inferred types

    type User    = typeof users.$inferSelect;
    type NewUser = typeof users.$inferInsert;

    database schema
        ↓
    Drizzle schema      ← the SOURCE
        ↓
    TypeScript type

    Day 16's single source of truth, one layer
    down. there the Zod schema was the source.
    here the TABLE DEFINITION is.

    → a column rename is a COMPILE error in
      every file that reads it, not a runtime
      error on the one endpoint nobody tested.

    ⚠ verified: $inferSelect is TYPE-ONLY.
      "$inferSelect" in users  →  false
      you cannot log it. it exists for typeof.


Why the two infers differ, and it matters

    $inferSelect   what a row looks like OUT
                     id present
                     createdAt present

    $inferInsert   what you need to put one IN
                     id optional (DB generates)
                     createdAt optional (default)

    one hand-written interface for both means
    lying about inserts OR lying about reads.


⚠ Two schema systems. Keep them apart.

    HTTP boundary        Database
    ─────────────        ────────
    Zod                  Drizzle
    what clients may     what the storage
    send and see         actually holds

    passwordHash
      → in Drizzle
      → NEVER in a Zod response schema

    passwordConfirmation
      → in the Zod create schema
      → does not exist in the database

    merging them forces one of those mistakes.

    drizzle-zod generates a STARTING POINT.
    your API contract should be a decision, not
    a projection of your storage layout.


Relationships live in the database

    userId: integer("user_id").notNull()
              .references(() => users.id)

    .references() declares the FOREIGN KEY

    which is what lets the DATABASE refuse a
    post pointing at a user who does not exist.

    that guarantee lives where it cannot be
    bypassed by a script, a migration, or a
    second service.`,
      codeExample: {
        title: "A schema, its inferred types, and the boundary it is not",
        code: `// ── db/schema.ts ────────────────────────────────────────────
import {
  pgTable, serial, integer, text, timestamp, boolean, index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  //             ^^^^^^^^^^^^^^^^^^^ the real column name.
  //             Without it, Drizzle would look for a column
  //             called "passwordHash" and fail at runtime.
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),      // nullable
});

export const posts = pgTable("posts", {
  id: serial().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text().notNull(),
  body: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  // An index on the foreign key. Not decoration: every
  // "posts for this user" query scans without it, and the
  // N+1 lesson later today is much worse on an unindexed
  // foreign key.
  index("posts_user_id_idx").on(table.userId),
]);

export const comments = pgTable("comments", {
  id: serial().primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  body: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("comments_post_id_idx").on(table.postId),
  index("comments_user_id_idx").on(table.userId),
]);


// ── Relations, for the query API ────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.userId], references: [users.id] }),
  comments: many(comments),
}));


// ── The types, derived ──────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

// User is:
//   { id: number; name: string; email: string;
//     passwordHash: string; isAdmin: boolean;
//     createdAt: Date; deletedAt: Date | null }
//
// NewUser is:
//   { id?: number;              ← serial, DB generates it
//     name: string;
//     email: string;
//     passwordHash: string;
//     isAdmin?: boolean;        ← has a default
//     createdAt?: Date;         ← has a default
//     deletedAt?: Date | null }
//
// Different on purpose. One hand-written interface for both
// would either demand an id you do not have, or claim
// createdAt is optional when reading, which it never is.
//
// ⚠ Verified: $inferSelect is a type-only property.
//   console.log("$inferSelect" in users)   ->  false
//   You cannot inspect it at runtime.


// ── ⚠ What this is NOT: your API contract ───────────────────
// modules/users/schema.ts  (Day 16)
import { z } from "zod";

// What a client may CREATE. Note passwordConfirmation, which
// exists nowhere in the database, and note that isAdmin is
// absent, because a client may never set it.
export const createUserSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.email().toLowerCase(),
  password: z.string().min(12),
  passwordConfirmation: z.string(),
}).refine((v) => v.password === v.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

// What a client may SEE. Note passwordHash is absent, and so
// is deletedAt, and so is isAdmin.
export const publicUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  createdAt: z.iso.datetime(),
});
//
// Two systems, two jobs:
//
//   Drizzle  what the storage actually holds
//   Zod      what clients may send and see
//
// If you generated the Zod schemas from the table, you would
// have to remember to remove passwordHash and add
// passwordConfirmation. drizzle-zod gives you a starting
// point; your API contract is still a decision.


// ── The service, where the two meet ─────────────────────────
import { eq } from "drizzle-orm";
import { hash } from "node:crypto";

export async function createUser(db, input) {
  // input is typed from the Zod schema (Day 16).
  // The insert is typed from the Drizzle schema.
  const [created] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password),
      // isAdmin omitted, so the database default applies.
      // Note what is NOT here: no spread of input, so
      // Day 16's mass assignment is impossible by shape.
    })
    .returning();

  return created;      // the full row. The response schema
                       // decides what leaves.
}
//
// This function is where the two schema systems meet, and it
// is deliberately the only place. Above it, everything speaks
// Zod. Below it, everything speaks Drizzle.


// ── Seeing the SQL ──────────────────────────────────────────
console.log(
  db.select().from(users).where(eq(users.id, 1)).toSQL(),
);
// {
//   sql: 'select "id", "name", ... from "users" where "users"."id" = $1',
//   params: [ 1 ]
// }
//
// Note the $1. The value is a parameter, never interpolated
// text, which is the injection lesson two lessons from now.`,
      },
      keyTakeaways: [
        "Verified on drizzle-orm 0.45.2: `pgTable` column builders work without an explicit name, taking the property key, and `.notNull()` is reflected on the column object.",
        "Pass the real column name when the conventions differ: `createdAt: timestamp(\"created_at\")`. Otherwise Drizzle looks for a column that does not exist.",
        "`$inferSelect` and `$inferInsert` are different on purpose: what a row looks like coming out, versus what you need to put one in.",
        "Verified: `$inferSelect` is type-only. `\"$inferSelect\" in users` is `false`, so you cannot inspect it at runtime.",
        "This is Day 16's single source of truth one layer down, with the table definition as the source. A column rename becomes a compile error everywhere.",
        "Zod and Drizzle are not competitors. Zod says what clients may send and see; Drizzle says what the storage holds.",
        "Keep them separate deliberately: `passwordHash` belongs only in Drizzle, `passwordConfirmation` only in Zod. Merging forces one of those mistakes.",
        "`.references()` puts the foreign key in the database, which is the only place the guarantee cannot be bypassed by a script or another service.",
        "Index your foreign keys. Every \"children of this parent\" query scans without one, and the N+1 pattern is far worse on an unindexed key.",
      ],
      commonMistakes: [
        "Assuming the property name is the column name for a `snake_case` schema. The error names a column that does not exist, which at least points at itself.",
        "Writing one interface for both reading and inserting. It either demands an id the database generates or makes a defaulted field optional on reads.",
        "Trying to `console.log(users.$inferSelect)`. It is type-only and not present at runtime.",
        "Generating Zod schemas from the table and shipping them. You have made your storage layout your public API, including `passwordHash`.",
        "Skipping `.references()` because the application already checks. A migration, a script or another service will not.",
        "Not indexing foreign keys. It is the single most common missing index, and it compounds every N+1.",
        "Spreading a request body into `.values()`. The Drizzle types will not save you, because the extra fields are valid columns.",
      ],
      quiz: [
        {
          question: "Why does `createdAt: timestamp(\"created_at\")` pass the name explicitly?",
          options: [
            "For documentation",
            "Because the column name defaults to the property key, and database columns are conventionally `snake_case` while TypeScript properties are `camelCase`",
            "`timestamp` requires an argument",
            "For the index name",
          ],
          correctIndex: 1,
          explanation:
            "Verified that builders work without a name and take the property key. Omit it here and Drizzle looks for a column called `createdAt`.",
        },
        {
          question: "Why are `$inferSelect` and `$inferInsert` different types?",
          options: [
            "A quirk of the library",
            "A row coming out always has its id and defaults; a row going in may omit anything the database generates or defaults",
            "One is readonly",
            "Insert types are always partial",
          ],
          correctIndex: 1,
          explanation:
            "Hand-writing one interface for both means lying about one direction or the other.",
        },
        {
          question: "What was verified about `$inferSelect` at runtime?",
          options: [
            "It is a getter",
            "It is type-only. `\"$inferSelect\" in users` is `false`, so it cannot be inspected or logged.",
            "It returns an empty object",
            "It throws",
          ],
          correctIndex: 1,
          explanation:
            "It exists purely to be used with `typeof`.",
        },
        {
          question: "Should you generate your Zod API schemas from your Drizzle tables?",
          options: [
            "Yes, that is single source of truth",
            "As a starting point only. Your API contract is a decision, and a projection of storage would ship `passwordHash` and lack `passwordConfirmation`.",
            "Never, they are unrelated",
            "Only for responses",
          ],
          correctIndex: 1,
          explanation:
            "Zod says what clients may send and see; Drizzle says what the storage holds. Two systems, two jobs.",
        },
        {
          question: "Why does `.references()` matter when the application already validates the relationship?",
          options: [
            "It generates types",
            "The foreign key lives in the database, which is the only place the guarantee cannot be bypassed by a script, a migration or another service",
            "It creates an index",
            "It speeds up joins",
          ],
          correctIndex: 1,
          explanation:
            "Application checks protect the paths that go through the application. Not everything does.",
        },
      ],
    },
    {
      id: "crud",
      title: "CRUD, and the clause you must not forget",
      durationMinutes: 11,
      explanation:
        "Four operations, and one recurring danger.\n\n---\n\n## SELECT\n\n```sql\nSELECT * FROM users;\n```\n\n```typescript\nconst result = await db.select().from(users);\n```\n\n> Two things wrong with that query in production, and neither is syntax. It has no `WHERE` and no `LIMIT`, so it returns the whole table. On a users table with two million rows that is two million rows into your Node process's heap, which is Day 7's memory lesson arriving as a database query. Day 16's `.max(100)` on `limit` was guarding exactly this.\n\n---\n\n## Select the columns you need\n\n```typescript\nawait db.select({ id: users.id, name: users.name }).from(users);\n```\n\n`SELECT *` costs you database work, network bytes, memory and serialization time for columns you did not want. It also has a subtler cost: a `SELECT *` result changes shape when someone adds a column, so code that spreads the row starts carrying fields it never expected, which is Day 16's leak by another route.\n\n---\n\n## INSERT\n\n```typescript\nawait db.insert(users).values({ name: \"Rajan\", email: \"rajan@example.com\" });\n```\n\nAdd `.returning()` to get the created row back, including the id and any defaults the database filled in. Without it you have inserted a row you cannot refer to.\n\n> And the Day 16 rule applies with force here: <b>never</b> `values(request.body)`. The Drizzle types will not save you, because the extra fields a client sent are real columns. Type safety and mass assignment are orthogonal.\n\n---\n\n## UPDATE and the missing WHERE\n\n```typescript\nawait db.update(users).set({ name: \"John\" }).where(eq(users.id, 1));\n```\n\nNow drop the last line:\n\n```sql\nUPDATE users SET name = 'John';\n```\n\nThat renames <b>every user</b>. It is valid SQL, it succeeds, and it reports how many rows it changed as if that were good news.\n\n> The reason this happens is not carelessness, it is that the dangerous version is <b>shorter</b>. In a query builder, `.where()` is one more chained call that is easy to leave off while restructuring, and there is no error, no warning and no type check, because a `WHERE`-less update is a legitimate thing to want. Two habits: write `.where()` immediately after `.update()` before you write the `.set()`, and check the affected row count against what you expected rather than only checking for an error.\n\n---\n\n## DELETE\n\n```typescript\nawait db.delete(users).where(eq(users.id, 1));\n```\n\nSame trap, worse consequences, and no rollback once the transaction commits.\n\n---\n\n## Soft delete\n\nWhich is why many applications never really delete:\n\n```typescript\nawait db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, 1));\n```\n\n> The trade is honest. A soft delete is recoverable and keeps foreign keys intact, and it means <b>every single query</b> from then on must remember `WHERE deleted_at IS NULL`. The one that forgets shows deleted users in a list, or lets a deleted account log in. Choose it deliberately, and if you do, put the filter somewhere shared rather than in each query.\n\n---\n\n## The habit that covers all four\n\nRun a `SELECT` with the same `WHERE` first and look at what comes back. It costs seconds and it is the only check that catches a wrong predicate rather than a missing one, which no amount of typing will do for you.",
      diagram: `SELECT: two problems, neither is syntax

    await db.select().from(users);

    no WHERE.  no LIMIT.

    users table with 2,000,000 rows
      → 2,000,000 rows into your Node heap
      → Day 7's memory lesson, as a query

    Day 16's .max(100) was guarding exactly this.


SELECT the columns you need

    SELECT *  costs you
      database work · network bytes
      memory · serialization

    for columns you did not want.

    and a subtler cost:
      a SELECT * result CHANGES SHAPE when
      someone adds a column, so code that
      spreads the row starts carrying fields
      it never expected
        → Day 16's leak, by another route


INSERT

    .values({ name, email })
    .returning()      ← or you have inserted a
                        row you cannot refer to

    ⚠ NEVER  values(request.body)

      Drizzle's types will NOT save you.
      the extra fields a client sent are REAL
      COLUMNS.

      type safety and mass assignment are
      orthogonal.


⚠⚠ UPDATE and the missing WHERE

    .update(users).set({ name: "John" })
                  .where(eq(users.id, 1))     ✓

    drop the last line:

    UPDATE users SET name = 'John';

    renames EVERY USER.
    valid SQL. succeeds. reports the row count
    as if that were good news.

    why it happens is not carelessness:

      THE DANGEROUS VERSION IS SHORTER.

      .where() is one more chained call, easy to
      leave off while restructuring, and there
      is no error, no warning, no type check,
      because a WHERE-less update is a
      legitimate thing to want.

    two habits:
      1. write .where() IMMEDIATELY after
         .update(), before the .set()
      2. check the AFFECTED ROW COUNT against
         what you expected, not just for an error


DELETE: same trap, worse, no undo

    once the transaction commits, it is gone.


Soft delete: an honest trade

    set({ deletedAt: new Date() })

    ✓ recoverable
    ✓ foreign keys stay intact

    ✗ EVERY query from now on must remember
      WHERE deleted_at IS NULL

      the one that forgets shows deleted users
      in a list, or lets a deleted account
      log in

    choose it deliberately. put the filter
    somewhere SHARED, not in each query.


The habit that covers all four

    run the SELECT with the same WHERE first.
    look at what comes back.

    costs seconds, and it is the only check that
    catches a WRONG predicate rather than a
    missing one. no amount of typing does that.`,
      codeExample: {
        title: "The four operations, and the accidents they allow",
        code: `import { eq, and, isNull, inArray, sql } from "drizzle-orm";
import { users, posts } from "./schema.js";


// ── SELECT ──────────────────────────────────────────────────

// ✗ Every row, every column.
await db.select().from(users);
// On two million rows that is two million objects in your
// heap. The query succeeds. The process may not.

// ✓ The columns you need, bounded, with a predicate.
await db
  .select({ id: users.id, name: users.name, email: users.email })
  .from(users)
  .where(isNull(users.deletedAt))
  .orderBy(users.createdAt)
  .limit(20)
  .offset(0);

// ✓ One row, and note the destructure: Drizzle returns an
//   array even for a primary-key lookup.
const [user] = await db
  .select()
  .from(users)
  .where(eq(users.id, 1))
  .limit(1);
// user is undefined if nothing matched, not null. Check it.


// ── INSERT ──────────────────────────────────────────────────

// ✓ With .returning(), so you have the generated id.
const [created] = await db
  .insert(users)
  .values({
    name: "Rajan",
    email: "rajan@example.com",
    passwordHash: hashed,
  })
  .returning({ id: users.id, name: users.name, email: users.email });

// ✓ Many rows in one statement, rather than one per row.
await db.insert(posts).values([
  { userId: 1, title: "First", body: "..." },
  { userId: 1, title: "Second", body: "..." },
  { userId: 2, title: "Third", body: "..." },
]);

// ✓ Upsert, when a conflict is expected rather than an error.
await db
  .insert(users)
  .values({ name: "Rajan", email: "rajan@example.com", passwordHash: hashed })
  .onConflictDoUpdate({
    target: users.email,
    set: { name: "Rajan" },
  });

// ✗✗ Mass assignment. Day 16, and Drizzle does not help.
await db.insert(users).values(request.body);
// The client sent is_admin: true. It is a real column. The
// types are satisfied. The row is written.


// ── UPDATE ──────────────────────────────────────────────────

// ✓ Predicate first, and check what it touched.
const updated = await db
  .update(users)
  .set({ name: "John" })
  .where(eq(users.id, 1))
  .returning({ id: users.id });

if (updated.length === 0) {
  // Nothing matched. Usually a 404, not a success.
  throw new NotFoundError("User not found");
}
if (updated.length > 1) {
  // You expected one row and changed several. That is a bug
  // worth knowing about immediately rather than eventually.
  app.log.error({ count: updated.length }, "update touched too many rows");
}

// ✗✗ The one-line accident.
await db.update(users).set({ name: "John" });
//
//   UPDATE users SET name = 'John';
//
// Every user is now called John. No error. No warning. No
// type error, because a WHERE-less update is a legitimate
// thing to want (a backfill, a migration).
//
// It happens because the DANGEROUS version is SHORTER. While
// restructuring a query you delete a line and the remaining
// code is still valid.


// ── DELETE ──────────────────────────────────────────────────

// ✓
await db.delete(posts).where(eq(posts.id, 1)).returning({ id: posts.id });

// ✗✗
await db.delete(posts);
// The whole table. Committed, and there is no undo.

// ✓ Soft delete, if you have chosen that trade.
await db
  .update(users)
  .set({ deletedAt: new Date() })
  .where(eq(users.id, 1));


// ── The cost of soft delete, made concrete ──────────────────
// Every query now has to remember:
await db.select().from(users).where(isNull(users.deletedAt));

// The one that forgets:
await db.select().from(users);
//   ->  deleted users in a list, or a deleted account that
//       can still log in.
//
// So put it somewhere shared rather than in each query:
const activeUsers = () =>
  db.select().from(users).where(isNull(users.deletedAt));

// or make it a database view, so no query can forget:
//   CREATE VIEW active_users AS
//     SELECT * FROM users WHERE deleted_at IS NULL;
//
// The view is the stronger option, because it cannot be
// forgotten by a query written next year.


// ── The habit worth having ──────────────────────────────────
// Before running a destructive statement, run the SELECT with
// the SAME predicate:

const predicate = and(eq(users.isAdmin, false), isNull(users.deletedAt));

const affected = await db.select({ id: users.id }).from(users).where(predicate);
console.log("would affect", affected.length, "rows");
// If that says 40,000 and you expected 1, you have just
// saved yourself an incident. This is the only check that
// catches a WRONG predicate rather than a missing one, and no
// type system will do it for you.

await db.update(users).set({ isAdmin: false }).where(predicate);`,
      },
      keyTakeaways: [
        "A `SELECT` with no `WHERE` and no `LIMIT` returns the whole table into your Node heap. Day 16's `.max(100)` on `limit` was guarding this.",
        "`SELECT *` costs database work, bytes, memory and serialization, and its result changes shape when someone adds a column.",
        "Use `.returning()` on inserts, or you have created a row you cannot refer to.",
        "Never `values(request.body)`. Drizzle's types do not help, because the extra fields a client sent are real columns. Type safety and mass assignment are orthogonal.",
        "A `WHERE`-less `UPDATE` changes every row, succeeds, and reports the count as if it were good news.",
        "It happens because the dangerous version is shorter, and there is no error to catch it, since a `WHERE`-less update is legitimately useful.",
        "Two habits: write `.where()` immediately after `.update()`, and check the affected row count against what you expected rather than only checking for an error.",
        "Soft delete is recoverable and keeps foreign keys intact, at the cost of every future query remembering `WHERE deleted_at IS NULL`.",
        "A database view is stronger than a shared helper for that filter, because a query written next year cannot forget it.",
        "Run the `SELECT` with the same predicate before any destructive statement. It is the only check that catches a wrong predicate rather than a missing one.",
      ],
      commonMistakes: [
        "`db.select().from(users)` in production. It is the whole table, and it looks like the simplest possible query.",
        "`SELECT *` everywhere, then spreading the row into a response, so a new column becomes a leak.",
        "Inserting without `.returning()` and then having to query for the row you just created.",
        "Passing `request.body` to `.values()` or `.set()`. That is mass assignment, and the types are satisfied.",
        "Omitting `.where()` on an update or delete. There is no warning, because it is a legitimate operation.",
        "Only checking for an error after an update. Zero rows changed is usually a 404, and several rows changed is usually a bug.",
        "Choosing soft delete without accepting that every query must now filter, then having a list that shows deleted users.",
        "Running a destructive statement without previewing the predicate with a `SELECT` first.",
      ],
      quiz: [
        {
          question: "What is wrong with `await db.select().from(users)` in production?",
          options: [
            "Nothing",
            "No `WHERE` and no `LIMIT`, so the whole table lands in your Node heap",
            "It needs `.execute()`",
            "It only returns one row",
          ],
          correctIndex: 1,
          explanation:
            "Two million rows means two million objects. Day 7's memory lesson arriving as a database query.",
        },
        {
          question: "Why is a missing `.where()` on an update so easy to ship?",
          options: [
            "The types allow it accidentally",
            "The dangerous version is shorter, and there is no error or type check, because a `WHERE`-less update is legitimately useful",
            "Drizzle silently drops it",
            "It only happens in raw SQL",
          ],
          correctIndex: 1,
          explanation:
            "Nothing can flag it, because a backfill or migration genuinely wants to update every row.",
        },
        {
          question: "Why does `values(request.body)` stay dangerous under Drizzle's type system?",
          options: [
            "Drizzle has weak types",
            "The extra fields a client sent are real columns, so the types are satisfied and the row is written",
            "It only affects raw SQL",
            "It is fine with a schema",
          ],
          correctIndex: 1,
          explanation:
            "Type safety and mass assignment are orthogonal problems. Day 16's rule stands: destructure the fields you meant.",
        },
        {
          question: "What is the honest cost of soft delete?",
          options: [
            "Disk space",
            "Every future query must remember `WHERE deleted_at IS NULL`, and the one that forgets shows deleted rows or lets a deleted account log in",
            "It breaks foreign keys",
            "It cannot be indexed",
          ],
          correctIndex: 1,
          explanation:
            "A database view is stronger than a helper, because a query written next year cannot forget a view.",
        },
        {
          question: "What is the one check that catches a wrong predicate rather than a missing one?",
          options: [
            "TypeScript",
            "Running the `SELECT` with the same predicate first and looking at the row count",
            "A code review",
            "A transaction",
          ],
          correctIndex: 1,
          explanation:
            "If it reports 40,000 rows and you expected one, you have just avoided an incident. No type system does this for you.",
        },
      ],
    },
    {
      id: "joins-and-relationships",
      title: "Joins, and what a join actually returns",
      durationMinutes: 12,
      explanation:
        "One user has many posts.\n\n```text\nusers\n  │ 1\n  │\n  │ many\n  ↓\nposts\n```\n\n```sql\nSELECT users.name, posts.title\nFROM users\nJOIN posts ON posts.user_id = users.id;\n```\n\n---\n\n## Join\n\n<b>Join</b> (combining rows from two tables based on a condition, producing one row per matching combination).\n\n> The phrase carrying the weight is <b>one row per matching combination</b>, and almost every join surprise comes from skipping it. A join does not return users with their posts attached. It returns a flat result where a user with three posts appears <b>three times</b>. The database has no concept of nesting; it returns rows.\n\nVerified with three users and four posts:\n\n```text\nLEFT JOIN result: 5 rows\n\n1:Rajan:a\n1:Rajan:b        ← Rajan appears three times\n1:Rajan:c\n2:Alice:d\n3:Bob:null       ← Bob has no posts\n```\n\nThree users in, five rows out. Rajan's name and email are transmitted three times, and Bob arrives with a `null` title.\n\n---\n\n## INNER versus LEFT\n\n```text\nINNER JOIN  →  only rows with a match on both sides\nLEFT JOIN   →  every left row, with nulls where there is no match\n```\n\n> Verified in the same run: with `LEFT JOIN`, Bob came back with `title: null`. With `INNER JOIN` Bob would have vanished entirely. That is the difference between \"list every user and their posts\" and \"list every user who has posted\", and picking the wrong one produces a page that is quietly missing people rather than an error.\n\n---\n\n## What this means for your code\n\nBecause a join returns a flat result, you have to group it:\n\n```javascript\nconst byUser = new Map();\nfor (const row of rows) {\n  if (!byUser.has(row.userId)) {\n    byUser.set(row.userId, { id: row.userId, name: row.name, posts: [] });\n  }\n  if (row.postId) byUser.get(row.userId).posts.push({ id: row.postId, title: row.title });\n}\n```\n\n> This is the part the \"just use a join\" advice leaves out. A join fixes the <b>query count</b> and hands you a grouping problem plus duplicated parent data. That is usually a good trade, and it is a trade rather than a free win. Notice the `if (row.postId)` guard: with a `LEFT JOIN`, Bob's row would otherwise add a phantom post made entirely of nulls.\n\nThe duplication has a real cost too. Join a user to their posts and their comments at once and you get a <b>cross product</b>: a user with 10 posts and 10 comments returns 100 rows, most of them repeated data. That is the point at which two separate queries beat one join, which the last lesson will come back to.\n\n---\n\n## Drizzle's relational queries\n\nDrizzle offers a query API that does the grouping for you:\n\n```typescript\nconst result = await db.query.users.findMany({\n  with: { posts: true },\n});\n```\n\nThat returns properly nested objects. It is the right default for reading a relationship, and it is worth knowing what it does underneath, because \"one query or two\" is a decision it makes for you. Check with `.toSQL()` rather than assuming.",
      diagram: `A join returns ROWS, not objects

    the phrase carrying the weight:

      ONE ROW PER MATCHING COMBINATION

    a join does NOT return users with posts
    attached. it returns a FLAT result where a
    user with three posts appears THREE TIMES.

    the database has no concept of nesting.


Verified: 3 users, 4 posts

    LEFT JOIN  →  5 ROWS

      1:Rajan:a
      1:Rajan:b     ← three times
      1:Rajan:c
      2:Alice:d
      3:Bob:null    ← no posts

    three users in. five rows out.
    Rajan's name and email transmitted 3×.


INNER vs LEFT

    INNER   only rows matching on BOTH sides
    LEFT    every left row, nulls where no match

    verified in the same run:
      LEFT   → Bob came back, title: null
      INNER  → Bob would have VANISHED

    that is the difference between
      "every user and their posts"
      "every user WHO HAS POSTED"

    wrong one → a page quietly missing people,
                not an error


What that means for your code

    you have to GROUP it:

      for (const row of rows) {
        if (!byUser.has(row.userId)) { ... }
        if (row.postId) push(...)
             ^^^^^^^^^^ or Bob's row adds a
                        PHANTOM POST made
                        entirely of nulls
      }

    what "just use a join" leaves out:

      a join fixes the QUERY COUNT
      and hands you
        a grouping problem
        + duplicated parent data

      usually a good trade. it IS a trade.


⚠ And the duplication compounds

    join a user to posts AND comments at once
      → CROSS PRODUCT

    10 posts × 10 comments = 100 ROWS
    most of it repeated data

    that is where TWO QUERIES beat one join.
    → last lesson returns to this.


Drizzle relational queries

    db.query.users.findMany({ with: { posts: true } })

    returns properly NESTED objects.
    right default for reading a relationship.

    worth knowing what it does underneath:
    "one query or two" is a decision it makes
    FOR you.

    check with .toSQL(). do not assume.`,
      codeExample: {
        title: "What a join really returns, verified",
        code: `// ── The setup, verified with node:sqlite ────────────────────
// users:  1 Rajan, 2 Alice, 3 Bob
// posts:  1→user 1 'a', 2→user 1 'b', 3→user 1 'c', 4→user 2 'd'
//
// Three users. Four posts. Bob has none.


// ── LEFT JOIN ───────────────────────────────────────────────
SELECT users.id, users.name, posts.title
FROM users
LEFT JOIN posts ON posts.user_id = users.id;

// Verified result: 5 ROWS
//
//   1 | Rajan | a
//   1 | Rajan | b        ← Rajan, three times
//   1 | Rajan | c
//   2 | Alice | d
//   3 | Bob   | NULL     ← no posts, so a null row
//
// Three users in. Five rows out. If users had 20 columns,
// Rajan's 20 columns crossed the network three times.


// ── INNER JOIN, same data ───────────────────────────────────
SELECT users.id, users.name, posts.title
FROM users
INNER JOIN posts ON posts.user_id = users.id;
//
//   1 | Rajan | a
//   1 | Rajan | b
//   2 | Alice | d
//   ...
//
// 4 rows. Bob is GONE. Not null, not empty: absent.
//
// "List every user and their posts"        -> LEFT
// "List every user who has posted"         -> INNER
//
// Choose wrong and you ship a page that is quietly missing
// people. There is no error to notice.


// ── Drizzle, and the grouping you now owe ───────────────────
import { eq } from "drizzle-orm";

const rows = await db
  .select({
    userId: users.id,
    userName: users.name,
    postId: posts.id,
    postTitle: posts.title,
  })
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id));

// rows is FLAT. Group it yourself:
const byUser = new Map();

for (const row of rows) {
  if (!byUser.has(row.userId)) {
    byUser.set(row.userId, {
      id: row.userId,
      name: row.userName,
      posts: [],
    });
  }

  // ⚠ This guard is not optional. With a LEFT JOIN, Bob's row
  // has postId null, and without the check you push
  // { id: null, title: null } and Bob appears to have one
  // blank post. Verified: Bob's row came back as
  // 3:Bob:null.
  if (row.postId !== null) {
    byUser.get(row.userId).posts.push({
      id: row.postId,
      title: row.postTitle,
    });
  }
}

const result = [...byUser.values()];
//
// This is what "just use a join" costs. The query count went
// from N+1 to 1, and you took on:
//   · grouping code you have to get right
//   · duplicated parent columns on the wire
//   · a null guard that is easy to forget


// ── ⚠ Where a join stops being the answer ───────────────────
// Two relationships at once:

SELECT users.name, posts.title, comments.body
FROM users
LEFT JOIN posts    ON posts.user_id = users.id
LEFT JOIN comments ON comments.user_id = users.id;
//
// This is a CROSS PRODUCT. A user with 10 posts and 10
// comments produces 10 × 10 = 100 rows, containing 10 posts
// and 10 comments repeated ten times each.
//
// 20 rows of data delivered as 100 rows.
//
// With 100 posts and 100 comments it is 10,000 rows for 200
// pieces of data. The query is "efficient" by query count and
// catastrophic by every other measure.
//
// ✓ Three queries instead:
const usersRows = await db.select().from(users).limit(20);
const ids = usersRows.map((u) => u.id);
const postsRows = await db.select().from(posts).where(inArray(posts.userId, ids));
const commentRows = await db.select().from(comments).where(inArray(comments.userId, ids));
// Then group in memory. Three queries, no duplication, no
// cross product. This is the shape the last lesson argues for.


// ── Drizzle's relational query API ──────────────────────────
const nested = await db.query.users.findMany({
  with: {
    posts: {
      columns: { id: true, title: true },
      limit: 10,
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    },
    comments: true,
  },
  where: (users, { isNull }) => isNull(users.deletedAt),
  limit: 20,
});
//
// Returns properly nested objects:
//   [{ id: 1, name: "Rajan", posts: [...], comments: [...] }]
//
// No grouping code, no null guards, no cross product. This is
// the right default for reading a relationship.
//
// And still: check what it actually runs.
console.log(db.query.users.findMany({ with: { posts: true } }).toSQL());
//
// Whether that becomes one query or several is a decision the
// library makes for you, and it is worth knowing which. The
// habit from the ORM lesson: look, do not assume.


// ── The one to be careful with ──────────────────────────────
// Note the  limit: 10  inside  posts  above. Without it, a
// user with 50,000 posts pulls 50,000 rows into the nested
// result, and nothing in the outer  limit: 20  prevents it.
//
// The outer limit bounds users. It does not bound their
// children. That is a genuinely easy one to miss.`,
      },
      keyTakeaways: [
        "A join returns one row per matching combination. It does not return nested objects, because the database has no concept of nesting.",
        "Verified: three users and four posts produced five rows with a LEFT JOIN. Rajan appeared three times.",
        "So a join duplicates parent columns on the wire, and you owe grouping code on the way out.",
        "Verified: with LEFT JOIN Bob came back with `title: null`. With INNER JOIN he would have vanished entirely.",
        "That is \"every user and their posts\" versus \"every user who has posted\", and the wrong choice quietly omits people with no error.",
        "The null guard in your grouping loop is not optional, or a LEFT JOIN row becomes a phantom child made of nulls.",
        "\"Just use a join\" fixes the query count and hands you a grouping problem plus duplication. A good trade, and still a trade.",
        "Joining two relationships at once is a cross product: 10 posts and 10 comments give 100 rows for 20 pieces of data.",
        "Drizzle's `db.query...findMany({ with: ... })` returns nested objects and is the right default. Check with `.toSQL()` what it actually runs.",
        "An outer `limit` bounds parents, not their children. A nested relation needs its own limit.",
      ],
      commonMistakes: [
        "Expecting a join to return users with posts nested. It returns rows, and a user with three posts appears three times.",
        "Forgetting the null check when grouping a LEFT JOIN, so a parent with no children gets one child made entirely of nulls.",
        "Using INNER JOIN for a list that should include parents with no children, then wondering why some users are missing.",
        "Joining two child relationships in one query. The cross product turns 20 pieces of data into 100 rows, and worse as counts grow.",
        "Assuming a relational query API runs one query. Look at `.toSQL()`.",
        "Putting a limit on the outer query only. A parent with 50,000 children still pulls 50,000 rows.",
        "Selecting whole tables in a join. The duplicated parent columns are multiplied by the number of matches.",
      ],
      quiz: [
        {
          question: "Three users and four posts, one user having three of them. How many rows does a LEFT JOIN return?",
          options: ["3", "5", "4", "12"],
          correctIndex: 1,
          explanation:
            "Verified. One row per matching combination, plus one null row for the user with no posts. Rajan appeared three times.",
        },
        {
          question: "What happened to the user with no posts under each join type?",
          options: [
            "Both omitted them",
            "LEFT JOIN returned them with `title: null`; INNER JOIN omitted them entirely",
            "Both returned them",
            "INNER JOIN errored",
          ],
          correctIndex: 1,
          explanation:
            "Verified. That is the difference between listing every user and listing every user who has posted, and the wrong one has no error.",
        },
        {
          question: "Why is the `if (row.postId !== null)` guard necessary when grouping a LEFT JOIN?",
          options: [
            "For types",
            "Otherwise a parent with no children gets one phantom child made entirely of nulls",
            "To avoid duplicates",
            "It is not necessary",
          ],
          correctIndex: 1,
          explanation:
            "Verified that Bob's row came back with a null title. Without the guard he appears to have one blank post.",
        },
        {
          question: "What happens if you join a user to both posts and comments in one query?",
          options: [
            "Nothing, it is efficient",
            "A cross product: 10 posts and 10 comments give 100 rows carrying 20 pieces of data",
            "The database rejects it",
            "You get nested objects",
          ],
          correctIndex: 1,
          explanation:
            "Efficient by query count and catastrophic by every other measure. Two or three separate queries are better here.",
        },
        {
          question: "You put `limit: 20` on a relational query with nested posts. What is still unbounded?",
          options: [
            "Nothing",
            "The nested posts. The outer limit bounds parents, not their children, so one user with 50,000 posts pulls 50,000 rows.",
            "The column list",
            "The where clause",
          ],
          correctIndex: 1,
          explanation:
            "Nested relations need their own limit. This is a genuinely easy one to miss.",
        },
      ],
    },
    {
      id: "transactions",
      title: "Transactions",
      durationMinutes: 12,
      explanation:
        "## Transaction\n\n<b>Transaction</b> (a group of database operations that succeed or fail together).\n\n> The word that matters is <b>together</b>. Without one, two statements are two independent events, and any failure between them leaves the database in a state your code never intended and cannot detect afterwards. A transaction does not make failures less likely; it makes the <b>half-finished</b> state impossible.\n\nMoving money is the standard example because the failure is unmistakable:\n\n```text\nAccount A  →  -100\nAccount B  →  +100\n```\n\nWithout a transaction:\n\n```text\nA → -100  ✓\nB → +100  ❌ failed\n```\n\nThe money is gone. Not delayed, not queued: gone, and nothing in the database records that it should exist.\n\n```text\nBEGIN\n  ├── subtract 100\n  ├── add 100\n  └── success?\n       ↙      ↘\n     yes       no\n      ↓         ↓\n   COMMIT   ROLLBACK\n```\n\n<b>Commit</b> (make the transaction's changes permanent).\n\n<b>Rollback</b> (undo the transaction's changes).\n\n> Worth being precise about which is the default, because it decides how the next two bugs behave. Nothing is permanent until the commit, and the commit happens when the block <b>finishes normally</b>. So the rollback is not something you request, it is what happens when you do not reach the end. Both bugs below are versions of accidentally reaching the end.\n\n---\n\n## The bug that makes transactions useless\n\nDrizzle gives you a transaction handle:\n\n```typescript\nawait db.transaction(async (tx) => {\n  await tx.update(accounts).set({ ... }).where(...);\n  await tx.update(accounts).set({ ... }).where(...);\n});\n```\n\nNow write `db` instead of `tx` on one of those lines:\n\n```typescript\nawait db.transaction(async (tx) => {\n  await tx.update(accounts).set({ ... }).where(...);\n  await db.update(accounts).set({ ... }).where(...);   // ← wrong\n});\n```\n\n> That second statement runs on a <b>different connection</b>, outside the transaction. It commits on its own, immediately, and a rollback will not touch it. There is no error and no warning, because using `db` is perfectly valid code. Your tests pass, because tests usually take the happy path, and the bug only appears the first time something fails halfway through.\n>\n> This is the most common transaction bug there is, and the fix is a rule rather than vigilance: inside a transaction callback, <b>the outer handle does not exist</b>. Shadow it if that helps, or pass `tx` explicitly to every function you call and never let one reach for a module-level `db`.\n\nThe same rule applies to functions you call from inside the callback. A service function that takes only its arguments and uses a module-level `db` will silently escape every transaction it is called from.\n\n---\n\n## Rollback is by throwing\n\nIn Drizzle and most Node clients, you roll back by <b>throwing</b>. If the callback returns, it commits.\n\n```typescript\nawait db.transaction(async (tx) => {\n  const [account] = await tx.select().from(accounts).where(eq(accounts.id, 1));\n  if (account.balance < 100) throw new Error(\"Insufficient funds\");\n  // ...\n});\n```\n\n> Which means a <b>swallowed error commits</b>. A `try/catch` inside the callback that logs and carries on turns the transaction into a normal sequence of statements, and this is the second most common transaction bug. If you must catch something inside, rethrow it.\n\n---\n\n## Keep them short\n\nA transaction holds a connection and holds locks for as long as it runs. So:\n\n```text\n✗ BEGIN → charge a card over the network → COMMIT\n✓ charge the card → BEGIN → record it → COMMIT\n```\n\n> An HTTP call inside a transaction is a lock held for however long someone else's server takes. Under load that is a pool exhausted by connections doing nothing, which is the pooling lesson and this one meeting. Do the slow, external work first; open the transaction only around the writes.",
      diagram: `Transaction: the word is TOGETHER

    without one, two statements are two
    INDEPENDENT events, and a failure between
    them leaves a state your code never intended
    and cannot detect afterwards.

    a transaction does not make failure less
    likely. it makes the HALF-FINISHED state
    IMPOSSIBLE.

    A → -100  ✓
    B → +100  ❌

    the money is GONE. not delayed. gone, and
    nothing records that it should exist.

    BEGIN
      ├── subtract 100
      ├── add 100
      └── success?
           ↙      ↘
         yes       no
          ↓         ↓
       COMMIT   ROLLBACK


⚠⚠ The bug that makes it all useless

    await db.transaction(async (tx) => {
      await tx.update(...)      ✓
      await db.update(...)      ✗ WRONG
    });

    that second statement runs on a DIFFERENT
    CONNECTION, outside the transaction.

      it commits on its own, immediately
      a rollback will NOT touch it
      no error. no warning. valid code.

    your tests pass, because tests take the
    happy path. it appears the first time
    something fails halfway.

    the fix is a RULE, not vigilance:

      inside the callback, the OUTER HANDLE
      DOES NOT EXIST.

      shadow it, or pass tx explicitly to every
      function you call.

    same applies to functions you call: a service
    that uses a module-level db will silently
    ESCAPE every transaction it is called from.


⚠ Rollback is by THROWING

    if the callback RETURNS, it COMMITS.

    so a SWALLOWED ERROR COMMITS.

    try { ... } catch (e) { log(e); }
      inside the callback
        → the transaction is now just a normal
          sequence of statements

    second most common transaction bug.
    if you must catch, RETHROW.


⚠ Keep them SHORT

    a transaction holds a CONNECTION and holds
    LOCKS for as long as it runs.

    ✗ BEGIN → charge a card over the network
            → COMMIT

      a lock held for however long someone
      else's server takes.

      under load: a pool exhausted by
      connections doing NOTHING
        → the pooling lesson and this one,
          meeting

    ✓ charge the card
      → BEGIN → record it → COMMIT

    do the slow external work FIRST. open the
    transaction only around the WRITES.`,
      codeExample: {
        title: "Transactions, and the two bugs that quietly disable them",
        code: `import { eq, sql } from "drizzle-orm";
import { accounts, transfers } from "./schema.js";


// ── ✓ The correct shape ─────────────────────────────────────
async function transfer(db, fromId, toId, amountCents) {
  return db.transaction(async (tx) => {
    // Lock the rows we are about to change, so a concurrent
    // transfer cannot read a stale balance.
    const [from] = await tx
      .select()
      .from(accounts)
      .where(eq(accounts.id, fromId))
      .for("update");

    if (!from) throw new NotFoundError("Account not found");
    if (from.balanceCents < amountCents) {
      throw new InsufficientFundsError();
      // Throwing IS the rollback. Nothing above this line
      // survives.
    }

    await tx
      .update(accounts)
      .set({ balanceCents: sql\`\${accounts.balanceCents} - \${amountCents}\` })
      .where(eq(accounts.id, fromId));

    await tx
      .update(accounts)
      .set({ balanceCents: sql\`\${accounts.balanceCents} + \${amountCents}\` })
      .where(eq(accounts.id, toId));

    const [record] = await tx
      .insert(transfers)
      .values({ fromId, toId, amountCents })
      .returning();

    return record;
    // Returning normally commits all three statements.
  });
}
//
// Note the arithmetic is done in SQL, not in JavaScript.
//   ✗  set({ balance: from.balanceCents - amount })
//   ✓  set({ balance: sql\`balance - \${amount}\` })
// The first reads a value, does maths in Node, and writes it
// back, which loses a concurrent update between the read and
// the write. The second lets the database do it atomically.


// ── ✗✗ Bug one: using db instead of tx ──────────────────────
await db.transaction(async (tx) => {
  await tx.update(accounts)
    .set({ balanceCents: sql\`\${accounts.balanceCents} - 100\` })
    .where(eq(accounts.id, 1));

  await db.update(accounts)
    //  ^^ WRONG. This borrows a DIFFERENT connection from the
    //     pool and runs outside the transaction entirely.
    .set({ balanceCents: sql\`\${accounts.balanceCents} + 100\` })
    .where(eq(accounts.id, 2));

  throw new Error("something failed");
});
//
// What actually happened:
//   Account 1  ->  rolled back. Unchanged.
//   Account 2  ->  COMMITTED. Permanently +100.
//
// You have created 100 units of money out of nothing, and
// there is no error, no warning and no failing test, because
// the happy path works perfectly.


// ── ✗✗ The same bug, hiding in a service function ───────────
// services/accounts.js
import { db } from "../db/index.js";        // module-level

export async function credit(accountId, amount) {
  return db.update(accounts)                // ← always the
    .set({ balanceCents: sql\`\${accounts.balanceCents} + \${amount}\` })
    .where(eq(accounts.id, accountId));     //   outer handle
}

// Elsewhere:
await db.transaction(async (tx) => {
  await tx.update(accounts).set({ ... }).where(...);
  await credit(2, 100);        // ← escapes the transaction
});
//
// This is the version you will actually meet, because nothing
// at the call site looks wrong. credit() reads fine on its
// own, and it is unusable inside a transaction.
//
// ✓ Take the handle as a parameter:
export async function credit(dbOrTx, accountId, amount) {
  return dbOrTx.update(accounts)
    .set({ balanceCents: sql\`\${accounts.balanceCents} + \${amount}\` })
    .where(eq(accounts.id, accountId));
}
// Now the caller decides, and the transaction is not
// something a function can accidentally opt out of.


// ── ✗✗ Bug two: swallowing the error commits ────────────────
await db.transaction(async (tx) => {
  await tx.update(accounts).set({ ... }).where(eq(accounts.id, 1));

  try {
    await tx.update(accounts).set({ ... }).where(eq(accounts.id, 2));
  } catch (err) {
    app.log.error({ err }, "second update failed");
    // ← no rethrow. The callback returns normally.
  }
});
//
// The transaction COMMITS. The first update is permanent, the
// second never happened, and your log line records the moment
// you chose that outcome.
//
// ✓ If you must catch, rethrow:
try {
  await tx.update(accounts).set({ ... }).where(eq(accounts.id, 2));
} catch (err) {
  app.log.error({ err }, "second update failed");
  throw err;
}


// ── ✗ Bug three: a network call inside ──────────────────────
await db.transaction(async (tx) => {
  const [order] = await tx.insert(orders).values({ ... }).returning();

  const charge = await stripe.charges.create({ ... });
  //             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 400ms, or 30
  //             seconds if their API is having a bad day

  await tx.update(orders).set({ chargeId: charge.id }).where(eq(orders.id, order.id));
});
//
// For the whole duration of that HTTP call you are holding:
//   · one pool connection
//   · row locks on the orders table
//
// A hundred concurrent orders and a slow payment provider
// exhausts a pool of ten, and now every unrelated request
// waits for a connection too. That is the pooling lesson and
// this one meeting.
//
// ✓ External work first, transaction around the writes:
const charge = await stripe.charges.create({ ... });

await db.transaction(async (tx) => {
  const [order] = await tx.insert(orders).values({ ... }).returning();
  await tx.insert(payments).values({ orderId: order.id, chargeId: charge.id });
});
//
// The card is charged before the transaction opens, so if the
// transaction fails you have a charge with no order, which is
// a reconcilable problem with a paper trail. The other way
// round you have an order with no charge and a lock held for
// thirty seconds.


// ── The rules, short enough to remember ─────────────────────
// 1. Inside the callback, the outer handle does not exist.
// 2. Pass the handle to every function you call.
// 3. Throwing is how you roll back. Never swallow.
// 4. No network calls inside. Do them first.
// 5. Do arithmetic in SQL, not by reading and writing back.`,
      },
      keyTakeaways: [
        "A transaction does not make failure less likely. It makes the half-finished state impossible.",
        "The most common transaction bug is using the outer `db` instead of `tx` inside the callback. That statement runs on a different connection and commits on its own.",
        "There is no error for that, and tests pass because tests take the happy path. It appears the first time something fails halfway through.",
        "The rule, not vigilance: inside the callback, the outer handle does not exist. Pass the handle to every function you call.",
        "A service function that uses a module-level `db` silently escapes every transaction it is called from, and nothing at the call site looks wrong.",
        "Throwing is how you roll back. If the callback returns, it commits, so a swallowed error commits. Rethrow if you must catch.",
        "A transaction holds a connection and locks for its whole duration, so a network call inside it holds both for however long someone else's server takes.",
        "Do the external work first and open the transaction only around the writes. A charge with no order is reconcilable; an order with no charge plus a thirty-second lock is not.",
        "Do arithmetic in SQL (`sql\\`balance - ${n}\\``) rather than reading a value, computing in Node and writing it back, which loses concurrent updates.",
      ],
      commonMistakes: [
        "Using `db` instead of `tx` on one line inside a transaction. It commits independently and a rollback cannot touch it.",
        "Calling a service function from inside a transaction when that function closes over a module-level `db`.",
        "Catching an error inside the callback and not rethrowing. The transaction commits and your log records the decision.",
        "Making an HTTP call inside a transaction. Under load it exhausts the pool with connections doing nothing.",
        "Reading a balance, computing the new value in JavaScript, and writing it back. A concurrent update is lost between the read and the write.",
        "Wrapping a whole request handler in a transaction because it is safer. It is a longer lock and a held connection for work that did not need either.",
        "Assuming a transaction protects reads too. Without `FOR UPDATE` or a stricter isolation level, another transaction can change a row you read.",
      ],
      quiz: [
        {
          question: "You write `db.update(...)` instead of `tx.update(...)` inside a transaction callback. What happens?",
          options: [
            "It throws",
            "It runs on a different connection outside the transaction, commits independently, and a rollback cannot undo it",
            "It joins the transaction automatically",
            "It is queued until commit",
          ],
          correctIndex: 1,
          explanation:
            "No error and no warning, and tests pass because they take the happy path. This is the most common transaction bug there is.",
        },
        {
          question: "How do you roll back in Drizzle, and what is the trap?",
          options: [
            "Call `tx.rollback()`; there is no trap",
            "Throw. Which means a swallowed error commits, because a callback that returns normally commits.",
            "Return `false`",
            "It rolls back automatically on any error",
          ],
          correctIndex: 1,
          explanation:
            "A `try/catch` inside the callback that logs and carries on turns the transaction into a plain sequence of statements.",
        },
        {
          question: "Why should a payment API call happen before the transaction rather than inside it?",
          options: [
            "For readability",
            "Inside, it holds a pool connection and row locks for the whole call, so a slow provider exhausts the pool under load",
            "Transactions cannot make network calls",
            "It would be rolled back",
          ],
          correctIndex: 1,
          explanation:
            "A charge with no order is a reconcilable problem. An order with no charge plus a thirty-second lock is an outage.",
        },
        {
          question: "Why write `set({ balance: sql\\`balance - ${amount}\\` })` rather than computing in JavaScript?",
          options: [
            "It is shorter",
            "Reading a value, computing in Node and writing it back loses any concurrent update between the read and the write",
            "Drizzle requires it",
            "It avoids type errors",
          ],
          correctIndex: 1,
          explanation:
            "Letting the database do the arithmetic makes it atomic. That is a correctness difference, not a style one.",
        },
        {
          question: "A service function uses a module-level `db`. Why is that a problem?",
          options: [
            "It is slower",
            "It silently escapes every transaction it is called from, and nothing at the call site looks wrong",
            "It leaks connections",
            "It cannot be tested",
          ],
          correctIndex: 1,
          explanation:
            "Take the handle as a parameter, so the caller decides and a function cannot opt out of a transaction by accident.",
        },
      ],
    },
    {
      id: "migrations-and-seeding",
      title: "Migrations and seeding",
      durationMinutes: 11,
      explanation:
        "## Migration\n\n<b>Migration</b> (a version-controlled change to your database structure).\n\n> The essential word is <b>version-controlled</b>. The problem a migration solves is not \"how do I add a column\", it is that your schema exists in several places at once (a laptop, CI, staging, production) and they must all end up identical. A migration is a change that travels through git with the code that needs it.\n\n```text\n0001_create_users\n0002_create_posts\n0003_add_email_index\n```\n\nWithout them you edit each database by hand, and the differences accumulate silently until something works locally and not in production.\n\n```text\nMigration files → git → staging → production\n```\n\n---\n\n## Naming\n\n```text\n✓ 0003_add_email_index\n✗ fix_database\n```\n\nThe name is the only description most people will read, and it is what you will scan when something broke between two deploys.\n\n---\n\n## Running them\n\n```text\nWrite migration → commit → deploy → run migrations → app uses new schema\n```\n\nThe migration system records which ones have already been applied, so running them twice is safe.\n\n> The ordering detail that causes real outages: for a few seconds during a rolling deploy, <b>old and new code both run against the new schema</b>. So a migration that drops or renames a column breaks the old instances instantly. The fix is to split it into two deploys, which is a habit rather than a tool feature:\n>\n> ```text\n> Deploy 1  add the new column, write to both, read from the old\n> Deploy 2  read from the new column\n> Deploy 3  drop the old column\n> ```\n>\n> Tedious, and it is the difference between a schema change and an incident.\n\n---\n\n## Rollback\n\n<b>Rollback</b> (reversing a previously applied migration).\n\n```text\nMigration 3  →  add column\nRollback     →  remove column\n```\n\n> The honest position: <b>some migrations cannot be reversed</b>. `DROP COLUMN email` has a rollback that recreates the column, and the data is not coming back. So a down migration restores the <b>shape</b> and not the contents, which makes rollback a much weaker safety net than it sounds. This is the real argument for the expand-then-contract sequence above: rolling forward is a plan, and rolling back is a hope.\n\n---\n\n## Seeding\n\n<b>Seeding</b> (inserting predefined data into a database, usually for development or testing).\n\n```bash\nnpm run db:seed\n```\n\nUseful for local development, demo environments, integration tests and development accounts.\n\n> One boundary worth drawing. A seed is <b>development data</b>, and reference data your application needs to function (country codes, plan tiers, permission names) is not a seed, it is a migration. If production needs it, it belongs in something that runs in production, in order, exactly once. Putting it in a seed script means it exists everywhere someone remembered to run the script.\n>\n> And make seeds idempotent. A seed you cannot run twice is a seed that fails the moment two developers share a database, and `onConflictDoNothing` is usually the whole fix.",
      diagram: `Migration: the word is VERSION-CONTROLLED

    the problem is not "how do I add a column".

    your schema exists in SEVERAL PLACES at once
      a laptop · CI · staging · production
    and they must all end up IDENTICAL.

    a migration is a change that travels through
    git with the code that needs it.

    migration files → git → staging → production

    without them you edit each database by hand,
    and the differences accumulate silently until
    something works locally and not in prod.


Naming

    ✓ 0003_add_email_index
    ✗ fix_database

    the name is the only description most people
    will read, and it is what you scan when
    something broke between two deploys.


⚠ The ordering detail that causes outages

    for a few seconds during a rolling deploy,
    OLD AND NEW CODE BOTH RUN against the NEW
    SCHEMA.

    so a migration that DROPS or RENAMES a column
    breaks the old instances instantly.

    the fix is a habit, not a tool feature:

      Deploy 1  add the new column
                write to BOTH
                read from the OLD
      Deploy 2  read from the NEW
      Deploy 3  drop the OLD

    tedious. and it is the difference between a
    schema change and an incident.


⚠ Rollback restores SHAPE, not CONTENTS

    Migration 3   add column
    Rollback      remove column

    but:  DROP COLUMN email

    the down migration recreates the column.
    the data is NOT coming back.

    → rollback is a much weaker safety net than
      it sounds.

    which is the real argument for
    expand-then-contract:

      rolling FORWARD is a plan
      rolling BACK is a hope


⚠ Seeds vs reference data

    a SEED is DEVELOPMENT data.

    reference data your app needs to FUNCTION
      country codes · plan tiers
      permission names
    is NOT a seed. it is a MIGRATION.

    if production needs it, it belongs in
    something that runs in production, in order,
    exactly once.

    in a seed script it exists everywhere
    somebody REMEMBERED to run the script.


Make seeds idempotent

    a seed you cannot run twice fails the moment
    two developers share a database.

    onConflictDoNothing is usually the whole fix.`,
      codeExample: {
        title: "Migrations that survive a rolling deploy",
        code: `// ── drizzle.config.ts ───────────────────────────────────────
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL },
});

// $ npx drizzle-kit generate      diff the schema, write SQL
// $ npx drizzle-kit migrate       apply pending migrations
//
// generate produces a real .sql file you can read and review.
// That matters: a schema change is the least reversible thing
// you deploy, so it deserves to appear in the diff as SQL
// rather than as an intention.


// ── drizzle/0003_add_email_index.sql ────────────────────────
CREATE INDEX CONCURRENTLY IF NOT EXISTS
  users_email_idx ON users (email);
--
-- CONCURRENTLY is the difference between a deploy and an
-- outage on a large table. A plain CREATE INDEX takes a lock
-- that blocks writes for the whole build. CONCURRENTLY does
-- not, at the cost of being slower and not running inside a
-- transaction.


// ── Running migrations at deploy, not at boot ───────────────
// migrate.js
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
const db = drizzle(pool);

await migrate(db, { migrationsFolder: "./drizzle" });
await pool.end();

// package.json
//   "db:migrate": "node migrate.js"
//
// Run this as a deploy step, not from server.js. Ten
// instances starting at once would otherwise all try to
// migrate, and "which one wins" is not a question you want
// to be asking during a deploy. Note max: 1, so the migration
// job takes one connection from the budget rather than ten.


// ═══════════════════════════════════════════════════════════
// ⚠ The rolling-deploy problem, and the three-deploy fix
// ═══════════════════════════════════════════════════════════

// You want to rename  users.name  to  users.full_name.
//
// ✗ The one-migration version:
//     ALTER TABLE users RENAME COLUMN name TO full_name;
//
//   For the seconds during which old instances are still
//   serving traffic, every query they run says SELECT name,
//   and the column is gone. Instant 500s on the old pods.
//
//   Worse if it takes you a minute to notice, and worse again
//   if the deploy needs to be rolled back, because now the
//   NEW code is what breaks.


// ✓ Deploy 1 — expand. Add, and write to both.
//   drizzle/0004_add_full_name.sql
ALTER TABLE users ADD COLUMN full_name TEXT;
UPDATE users SET full_name = name WHERE full_name IS NULL;

//   Code in deploy 1:
await db.insert(users).values({
  name: input.name,
  fullName: input.name,       // write BOTH
});
const [user] = await db.select().from(users).where(...);
return { name: user.name };   // read the OLD one
//
// Both old and new instances work. Old code reads and writes
// name, which still exists. New code writes both.


// ✓ Deploy 2 — switch reads.
return { name: user.fullName };   // read the NEW one
//
// Still writing both, so a rollback to deploy 1 is safe.


// ✓ Deploy 3 — contract. Only now drop it.
//   drizzle/0005_drop_name.sql
ALTER TABLE users DROP COLUMN name;
//
// And this is the step to be sure about, because:


// ── ⚠ What a rollback actually restores ─────────────────────
// The down migration for 0005:
ALTER TABLE users ADD COLUMN name TEXT;
//
// That restores the COLUMN. It does not restore the DATA. The
// values are gone the moment the DROP commits.
//
// So a down migration gives you back the SHAPE and not the
// CONTENTS, which is why:
//
//   rolling forward is a plan
//   rolling back is a hope
//
// Prefer a forward fix. Keep the contract step in its own
// deploy, days later, when you are confident.


// ── Seeds: development data, idempotent ─────────────────────
// seed.js
import { db } from "./src/db/index.js";
import { users } from "./src/db/schema.js";

await db
  .insert(users)
  .values([
    { name: "Admin",  email: "admin@example.com",  passwordHash: devHash, isAdmin: true },
    { name: "Test",   email: "test@example.com",   passwordHash: devHash },
    { name: "Demo",   email: "demo@example.com",   passwordHash: devHash },
  ])
  .onConflictDoNothing({ target: users.email });
//   ^^^^^^^^^^^^^^^^^^ run it twice, get the same result.
//
// A seed you cannot run twice fails the moment two people
// share a database, or the moment you run it after adding one
// row to the list.

// package.json
//   "db:seed": "node seed.js"


// ── ⚠ Reference data is NOT a seed ──────────────────────────
// ✗ In seed.js:
await db.insert(planTiers).values([
  { code: "free", maxUsers: 3 },
  { code: "pro",  maxUsers: 50 },
]);
// Your application cannot function without these rows. Now
// they exist in every environment where somebody remembered
// to run the seed script.

// ✓ In a migration:
//   drizzle/0006_seed_plan_tiers.sql
INSERT INTO plan_tiers (code, max_users) VALUES
  ('free', 3),
  ('pro', 50)
ON CONFLICT (code) DO NOTHING;
//
// It runs in production, in order, exactly once, tracked by
// the same system that tracks the table it fills.
//
// The test: if production needs the rows, it is a migration.
// If only a developer wants them, it is a seed.`,
      },
      keyTakeaways: [
        "The point of a migration is that your schema exists on a laptop, in CI, in staging and in production, and they must end up identical.",
        "A migration travels through git with the code that needs it, which is what stops differences accumulating silently.",
        "Name migrations for what they do. The name is the only description anyone reads when scanning between two deploys.",
        "Run migrations as a deploy step, not from `server.js`, or ten instances race to migrate at once.",
        "During a rolling deploy, old and new code both run against the new schema, so dropping or renaming a column breaks the old instances instantly.",
        "The fix is expand then contract, across three deploys: add and write both, switch reads, then drop.",
        "A down migration restores the shape and not the contents. `DROP COLUMN` is not undone by adding the column back.",
        "So rolling forward is a plan and rolling back is a hope. Keep the contract step in its own later deploy.",
        "`CREATE INDEX CONCURRENTLY` is the difference between a deploy and an outage on a large table.",
        "Seeds are development data and must be idempotent. Reference data your app needs to function is a migration, because production has to have it.",
      ],
      commonMistakes: [
        "Editing schemas by hand in each environment. The differences are silent until something works locally and not in production.",
        "Naming a migration `fix_database`. Nobody can tell what it did six months later.",
        "Running migrations from `server.js`. Every instance races to apply them at startup.",
        "Dropping or renaming a column in one deploy. The old instances break for the seconds they are still serving traffic.",
        "Trusting a down migration to recover data. It recreates the column and nothing else.",
        "Plain `CREATE INDEX` on a large table, which locks out writes for the whole build.",
        "A seed script that cannot run twice. It breaks as soon as two developers share a database.",
        "Putting reference data in a seed. It then exists only where someone remembered to run the script.",
      ],
      quiz: [
        {
          question: "What problem does a migration actually solve?",
          options: [
            "Writing SQL faster",
            "That your schema exists in several places at once and they must all end up identical, so the change travels through git with the code",
            "Type generation",
            "Rollback safety",
            ],
          correctIndex: 1,
          explanation:
            "Hand-editing each environment accumulates differences that are silent until something works locally and not in production.",
        },
        {
          question: "Why does dropping a column in a single deploy cause an outage?",
          options: [
            "The lock is too long",
            "During a rolling deploy old and new code both run against the new schema, so the old instances query a column that no longer exists",
            "Migrations run twice",
            "It breaks the connection pool",
          ],
          correctIndex: 1,
          explanation:
            "Expand then contract across three deploys: add and write both, switch reads, then drop.",
        },
        {
          question: "What does a down migration for `DROP COLUMN email` actually restore?",
          options: [
            "The column and its data",
            "The column only. The data is gone the moment the drop commits.",
            "Nothing",
            "A backup",
          ],
          correctIndex: 1,
          explanation:
            "Which is why rolling forward is a plan and rolling back is a hope. Keep the contract step for a later, confident deploy.",
        },
        {
          question: "Why run migrations as a deploy step rather than from `server.js`?",
          options: [
            "Startup speed",
            "Otherwise every instance races to migrate at once, and \"which one wins\" is not a question you want during a deploy",
            "Drizzle forbids it",
            "It needs a bigger pool",
          ],
          correctIndex: 1,
          explanation:
            "Give the migration job `max: 1` too, so it takes one connection from the budget rather than a full pool.",
        },
        {
          question: "Where does reference data like plan tiers belong?",
          options: [
            "A seed script",
            "A migration, because production needs those rows and a migration runs there in order, exactly once",
            "The application code",
            "An environment variable",
          ],
          correctIndex: 1,
          explanation:
            "The test: if production needs the rows, it is a migration. If only a developer wants them, it is a seed.",
        },
      ],
    },
    {
      id: "sql-injection",
      title: "SQL injection and parameterized queries",
      durationMinutes: 11,
      explanation:
        "## SQL injection\n\n<b>SQL injection</b> (an attack where untrusted input changes the meaning of a SQL query).\n\n> The phrase that explains everything is <b>changes the meaning</b>. This is not about bad characters, it is about the difference between data and code. When you build a query by concatenation, the database receives one string and has to decide which parts are instructions. Anything from the user that lands inside that string is <b>indistinguishable from your own SQL</b>, because by the time the database sees it, it is your SQL.\n\nNever do this:\n\n```javascript\nconst query = `SELECT * FROM users WHERE email = '${email}'`;\n```\n\nThe demonstration, on a three-row table:\n\n```text\nWHERE name = 'Rajan'            →  1 row\nWHERE name = 'Rajan' OR 1=1     →  3 rows\n```\n\nVerified. A predicate meant to match one row matched everything, because the input added a clause. That is the whole class in one line, and note that a filter for suspicious characters would not help: `OR 1=1` contains nothing unusual.\n\n---\n\n## Parameterized query\n\n<b>Parameterized query</b> (a query where values are sent separately from the SQL text, so the database never parses them as code).\n\n```sql\nSELECT * FROM users WHERE email = $1;\n```\n\n```javascript\nawait pool.query(\"SELECT * FROM users WHERE email = $1\", [email]);\n```\n\n> The reason this is airtight rather than merely safer is <b>when</b> it happens. The database parses and plans the statement first, with a placeholder where the value goes, and the value arrives afterwards. By then there is no parsing left to influence. So `\"' OR 1=1 --\"` is looked up as an email address, finds nothing, and returns zero rows. It is not escaped or sanitised; it is simply never code.\n\n```text\nSQL structure  +  user data  →  sent separately  →  safe by construction\n```\n\n---\n\n## What escaping is not\n\n> Do not write your own escaping. It fails on character encodings, on nested quoting, on numeric contexts where no quotes are involved at all, and it silently stops working when someone refactors the string. Every hand-rolled escape function is a parameterized query with more steps and worse odds.\n\n---\n\n## Query builders parameterize for you\n\nDrizzle, Kysely, Prisma and the rest send values as parameters, verified visible in Drizzle's own output:\n\n```javascript\ndb.select().from(users).where(eq(users.id, 1)).toSQL();\n// sql: '... where \"users\".\"id\" = $1',  params: [ 1 ]\n```\n\nThe `$1` is the point. So why learn this at all?\n\n> Because the gap always reappears. Every query builder has an escape hatch for raw SQL, and every project uses it eventually for a window function, a `LATERAL` join or a full-text search that the builder cannot express. Drizzle's `sql` template parameterizes interpolated values, which is exactly right, and `sql.raw()` does not, which is exactly the trap. The moment you build a fragment with string concatenation inside a raw helper, you are back to the first example.\n\nAnd one thing parameters cannot do: they carry <b>values</b>, not identifiers. You cannot parameterize a table or column name, so a sort like `ORDER BY ${column}` must be validated against an allowlist. A Zod enum from Day 16 is the right tool, and it is the case people miss precisely because it does not look like a value.",
      diagram: `Injection: the phrase is CHANGES THE MEANING

    not about bad characters.
    about the difference between DATA and CODE.

    concatenate a query and the database receives
    ONE STRING and must decide which parts are
    instructions.

    anything from the user inside that string is
    INDISTINGUISHABLE FROM YOUR OWN SQL,
    because by the time the database sees it,
    it IS your SQL.


Verified, on a three-row table

    WHERE name = 'Rajan'          →  1 row
    WHERE name = 'Rajan' OR 1=1   →  3 rows

    a predicate meant to match ONE row matched
    EVERYTHING, because the input added a clause.

    and note: a filter for "suspicious
    characters" would not help.
    OR 1=1 contains nothing unusual.


Parameterized: safe by CONSTRUCTION

    SELECT * FROM users WHERE email = $1
    params: [email]

    why it is airtight, not merely safer:
    it is about WHEN.

      1. the database PARSES and PLANS the
         statement, with a placeholder
      2. the value arrives AFTERWARDS
      3. by then there is no parsing left to
         influence

    so  "' OR 1=1 --"  is looked up as an EMAIL
    ADDRESS, finds nothing, returns zero rows.

    it is not escaped. it is not sanitised.
    it is simply NEVER CODE.


⚠ What escaping is not

    do not write your own.

    it fails on:
      character encodings
      nested quoting
      NUMERIC contexts with no quotes at all
      the next refactor of the string

    every hand-rolled escape function is a
    parameterized query with more steps and
    worse odds.


Builders parameterize for you

    verified in Drizzle's own output:

      .toSQL()
      sql:    '... where "users"."id" = $1'
      params: [ 1 ]

    the $1 is the point.


⚠ So why learn it? The gap reappears.

    every builder has a RAW ESCAPE HATCH, and
    every project uses it eventually:
      window functions · LATERAL joins
      full-text search

    Drizzle's  sql\`\`  template
      parameterizes interpolated values   ✓

    sql.raw()
      does NOT                            ✗ trap

    build a fragment by concatenation inside a
    raw helper and you are back to example one.


⚠ And one thing parameters CANNOT do

    they carry VALUES, not IDENTIFIERS.

    you cannot parameterize a TABLE or COLUMN
    name.

      ORDER BY \${column}     ← must be an
                               ALLOWLIST

    a Zod enum (Day 16) is the right tool.

    people miss this case precisely because a
    column name does not LOOK like a value.`,
      codeExample: {
        title: "The class, the fix, and the two places the fix does not reach",
        code: `// ── ✗ Concatenation. The whole class, in one line. ──────────
const query = \`SELECT * FROM users WHERE name = '\${name}'\`;

// Verified on a three-row table with node:sqlite:
//
//   name = "Rajan"
//     SELECT * FROM users WHERE name = 'Rajan'
//     ->  1 row
//
//   name = "Rajan' OR 1=1"
//     SELECT * FROM users WHERE name = 'Rajan' OR 1=1
//     ->  3 rows
//
// A predicate written to match one row matched every row,
// because the input contributed a CLAUSE rather than a value.
//
// And notice what a "dangerous characters" filter would do
// here: nothing. OR 1=1 has no quotes, no semicolons, no
// comment markers. The problem is not the characters, it is
// that the string was parsed as SQL at all.


// ── ✓ Parameterized. Safe by construction. ──────────────────
// PostgreSQL, with pg:
await pool.query("SELECT * FROM users WHERE name = $1", [name]);

// SQLite, with node:sqlite:
db.prepare("SELECT * FROM users WHERE name = ?").all(name);

// name = "Rajan' OR 1=1"
//   ->  0 rows
//
// The database looked for a user literally named
// "Rajan' OR 1=1". There is none. It was never code, because
// by the time the value arrived the statement had already
// been parsed and planned.


// ── ✓ Drizzle parameterizes. Verified. ──────────────────────
import { eq, sql, inArray, asc, desc } from "drizzle-orm";

const q = db.select().from(users).where(eq(users.name, name));

console.log(q.toSQL());
// {
//   sql: 'select ... from "users" where "users"."name" = $1',
//   params: [ "Rajan' OR 1=1" ]
// }
//
// The value is in params, not in sql. That is the property
// you want, and .toSQL() is how you confirm it rather than
// assume it.


// ═══════════════════════════════════════════════════════════
// Where the fix does not reach
// ═══════════════════════════════════════════════════════════

// ── Gap 1: the raw escape hatch ─────────────────────────────
// Every builder has one, and every project uses it. A search
// with ranking, a window function, a LATERAL join.

// ✓ The sql template parameterizes what you interpolate:
await db.execute(
  sql\`SELECT * FROM users WHERE name = \${name}\`,
);
// Produces:  WHERE name = $1   with params [name].
// This is safe. The template tag is doing the work.

// ✗ sql.raw() does not:
await db.execute(
  sql.raw(\`SELECT * FROM users WHERE name = '\${name}'\`),
);
// Straight back to the first example. sql.raw() exists for
// SQL you have written yourself, never for anything a user
// touched.

// ✗ And the subtle version, where a fragment is built by hand:
const clause = "name = '" + name + "'";
await db.execute(sql\`SELECT * FROM users WHERE \${sql.raw(clause)}\`);
// The outer template looks safe. The concatenation inside is
// the bug. This is the shape it usually takes in real code,
// because somebody was building a filter dynamically.

// ✓ Build dynamic filters from fragments, not strings:
const conditions = [];
if (filters.name) conditions.push(eq(users.name, filters.name));
if (filters.email) conditions.push(eq(users.email, filters.email));
if (filters.ids?.length) conditions.push(inArray(users.id, filters.ids));

await db.select().from(users).where(and(...conditions));
// Every value is still a parameter. The structure is dynamic
// and the values never enter the SQL text.


// ── ⚠ Gap 2: parameters carry values, not identifiers ───────
// This is the one people miss, because a column name does not
// look like a value.

// ✗ You cannot parameterize a column name:
await pool.query("SELECT * FROM users ORDER BY $1", [sortColumn]);
// This does not sort by that column. Postgres treats $1 as a
// constant, so you are ordering every row by the same value,
// which is to say not ordering at all. No error. Just a page
// whose sort silently does nothing.

// ✗ So people reach for concatenation, and now it is injection:
await pool.query(\`SELECT * FROM users ORDER BY \${sortColumn}\`);
// sortColumn comes from ?sort= in the query string.

// ✓ An allowlist. Day 16's Zod enum is exactly the tool:
import { z } from "zod";

const listQuerySchema = z.object({
  sort: z.enum(["name", "email", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

const SORT_COLUMNS = {
  name: users.name,
  email: users.email,
  createdAt: users.createdAt,
};

app.get("/users", {
  schema: { querystring: listQuerySchema },
}, async (request) => {
  const { sort, order, limit } = request.query;
  const column = SORT_COLUMNS[sort];      // a schema object,
                                          // not a string
  return db
    .select()
    .from(users)
    .orderBy(order === "asc" ? asc(column) : desc(column))
    .limit(limit);
});
//
// Two layers, and both are doing work. The Zod enum means
// only three strings ever get through. The lookup map means
// what reaches the query builder is a column reference rather
// than text, so there is no string to inject into even if the
// enum were wrong.


// ── What NOT to write ───────────────────────────────────────
function escape(value) {
  return "'" + String(value).replace(/'/g, "''") + "'";
}
// This is wrong, and it is wrong in ways that are hard to
// see: it breaks under some character encodings, it does
// nothing for a numeric context where there are no quotes,
// and it stops applying the moment someone builds the string
// differently.
//
// It is a parameterized query with more steps and worse odds.
// The parameterized version is also shorter.`,
      },
      keyTakeaways: [
        "Injection is about data becoming code, not about dangerous characters. Verified: `OR 1=1` turned a one-row predicate into three rows and contains nothing unusual.",
        "A character filter cannot solve it, because the problem is that the string was parsed as SQL at all.",
        "Parameterized queries are safe by construction because of when: the statement is parsed and planned first, and the value arrives after there is no parsing left to influence.",
        "So a malicious string is looked up as a value and finds nothing. It is not escaped or sanitised; it is never code.",
        "Never write your own escaping. It fails on encodings, on numeric contexts with no quotes, and on the next refactor.",
        "Verified: Drizzle puts values in `params` and `$1` in the SQL. `.toSQL()` is how you confirm that rather than assume it.",
        "Every query builder has a raw escape hatch and every project uses it. Drizzle's `sql` template parameterizes interpolations; `sql.raw()` does not.",
        "The realistic bug is a fragment built by concatenation inside an otherwise safe template. Build dynamic filters from condition objects instead.",
        "Parameters carry values, not identifiers. `ORDER BY $1` silently does not sort, which is why people reach for concatenation and reintroduce the hole.",
        "Validate sort columns against an allowlist, then map to a real column reference, so there is no string to inject into.",
      ],
      commonMistakes: [
        "Building any query by concatenating a value. That is the entire class, and it is one line.",
        "Filtering for quotes and semicolons. `OR 1=1` has neither.",
        "Writing an `escape()` helper. It is a parameterized query with more steps and worse odds, and the parameterized version is shorter.",
        "Using `sql.raw()` with anything a user touched. That helper exists for SQL you wrote yourself.",
        "Concatenating a WHERE fragment and passing it through a safe-looking `sql` template. The outer template does not rescue the inner string.",
        "Trying `ORDER BY $1`. It does not sort, it silently orders by a constant, and no error tells you.",
        "Interpolating a sort column from the query string. Use a Zod enum and a lookup map to a column reference.",
        "Assuming an ORM makes injection impossible. It removes the common case and leaves the escape hatch and the identifier problem.",
      ],
      quiz: [
        {
          question: "Why is `WHERE name = 'Rajan' OR 1=1` the whole lesson?",
          options: [
            "It uses a quote character",
            "The input contributed a clause rather than a value, so a one-row predicate matched three rows. Verified.",
            "It exploits a Postgres bug",
            "It only works on SQLite",
          ],
          correctIndex: 1,
          explanation:
            "And a suspicious-character filter would not help, because `OR 1=1` contains nothing unusual.",
        },
        {
          question: "Why is a parameterized query airtight rather than just safer?",
          options: [
            "It escapes quotes properly",
            "The statement is parsed and planned before the value arrives, so there is no parsing left for the value to influence",
            "It validates types",
            "It uses a prepared statement cache",
          ],
          correctIndex: 1,
          explanation:
            "The malicious string is looked up as a value and finds nothing. It was never code.",
        },
        {
          question: "What is the trap in Drizzle's raw SQL support?",
          options: [
            "The `sql` template is unsafe",
            "The `sql` template parameterizes interpolations, but `sql.raw()` does not, so a concatenated fragment inside it reintroduces the hole",
            "Raw SQL is always unsafe",
            "`.toSQL()` leaks parameters",
          ],
          correctIndex: 1,
          explanation:
            "The realistic version is a filter fragment built by hand and passed through an otherwise safe template.",
        },
        {
          question: "What happens if you write `ORDER BY $1` with a column name?",
          options: [
            "It sorts by that column",
            "It does not sort at all. Postgres treats `$1` as a constant, so every row orders by the same value, with no error.",
            "It throws a syntax error",
            "It sorts by the first column",
          ],
          correctIndex: 1,
          explanation:
            "Which is exactly why people reach for concatenation here and reintroduce injection.",
        },
        {
          question: "What is the right way to accept a sort column from a query string?",
          options: [
            "Escape it",
            "A Zod enum allowlist, then a lookup map to a real column reference, so there is no string to inject into",
            "A regex for word characters",
            "Parameterize it",
          ],
          correctIndex: 1,
          explanation:
            "Two layers doing separate work: the enum limits the input, and the map means the query builder receives a column reference rather than text.",
        },
      ],
    },
    {
      id: "n-plus-one",
      title: "The N+1 problem",
      durationMinutes: 12,
      explanation:
        "## N+1 problem\n\n<b>N+1 problem</b> (running one query to fetch a collection and then one more query for each item in it).\n\n> What makes it worth a whole lesson is that the code looks <b>correct</b>, and it is correct. It is type-safe, validated, readable and produces the right answer. The only thing wrong with it is how many times it talks to the database, and that is invisible in the source. No compiler, linter or type system catches it, because nothing about it is an error.\n\n```javascript\nconst users = await getUsers();\n\nfor (const user of users) {\n  user.posts = await getPostsForUser(user.id);\n}\n```\n\nWith 100 users:\n\n```text\n1 query for users\n+ 100 queries for posts\n= 101 queries\n```\n\n---\n\n## Why it hides\n\n```text\nDevelopment:  5 users     →  6 queries    →  fine\nProduction:   10,000      →  10,001       →  🔥\n```\n\n> This is the important half. It scales with your <b>data</b>, not with your traffic, so it passes every test, every review and every staging check, and then degrades gradually as the table grows. Nobody deploys it and sees it break. It becomes slow over months, which is the hardest kind of problem to attribute to a cause.\n>\n> Each of those 100 queries also costs a network round trip and a connection from the pool. At 5ms per query that is half a second of pure waiting, and Day 3's lesson applies: the event loop is not blocked, it is just idle, over and over.\n\n---\n\n## Fix one: the join\n\n```sql\nSELECT users.id, users.name, posts.id, posts.title\nFROM users\nLEFT JOIN posts ON posts.user_id = users.id;\n```\n\nOne query instead of 101.\n\n> But you already know from the joins lesson what this costs. Verified: three users and four posts gave <b>five rows</b>, with the parent duplicated per child and a null row for the parent with none. So the join fixes the query count and hands you duplicated parent data plus grouping code. On wide parent rows that duplication is real bytes, and with two child relationships it becomes a cross product.\n\n---\n\n## Fix two: the batch query\n\n```sql\nSELECT * FROM posts WHERE user_id IN (...);\n```\n\nThen group in memory. Verified on the same data: 4 post rows in <b>2 queries</b>, with no duplicated user data and no null rows.\n\n> This is the fix to reach for by default, and the draft framing of it as \"another fix\" undersells it. Two queries with clean, separately-shaped results are usually better than one query with a multiplied result, and the advantage grows with the width of the parent row and the number of relationships. Two children means three queries rather than a cross product.\n>\n> One caveat: `IN` with a very large list has its own limits, so batch in chunks of a few hundred rather than passing ten thousand ids.\n\n---\n\n## The habit\n\n> Every `await db...` is a network round trip, database work, a connection and latency. So the question to ask of any loop is not \"is this correct\" but <b>\"how many queries will this run when N is large?\"</b> If the answer contains N, restructure it.\n>\n> And the reliable way to find these is measurement rather than reading: turn on query logging in development, load a page, and count. An N+1 is obvious in a query log and nearly invisible in a diff.\n\n---\n\n## The close relative\n\nThe same code with an index on `posts.user_id` is 101 fast queries; without one it is 101 full table scans. Fixing an N+1 on an unindexed foreign key improves things enormously and hides the fact that the missing index was the larger problem. Check both.",
      diagram: `N+1: the code is CORRECT

    for (const user of users) {
      user.posts = await getPostsForUser(user.id);
    }

    type-safe · validated · readable
    produces the RIGHT ANSWER

    the only thing wrong is HOW MANY TIMES it
    talks to the database, and that is invisible
    in the source.

    no compiler, linter or type system catches it,
    because nothing about it is an ERROR.

    100 users  →  1 + 100  =  101 queries


⚠ Why it hides, and this is the important half

    dev    5 users   →  6 queries      → fine
    prod   10,000    →  10,001         → 🔥

    it scales with your DATA, not your TRAFFIC.

    so it passes every test, review and staging
    check, then degrades GRADUALLY as the table
    grows.

    nobody deploys it and sees it break.
    it becomes slow over MONTHS, which is the
    hardest kind of problem to attribute.

    and each query costs a round trip and a
    connection. at 5ms that is HALF A SECOND of
    pure waiting.

    Day 3: the event loop is not blocked.
    it is IDLE, over and over.


Fix one: the JOIN

    LEFT JOIN posts ON posts.user_id = users.id

    1 query instead of 101.

    ⚠ and you know what it costs (joins lesson):

      verified: 3 users + 4 posts  →  5 ROWS
        parent duplicated per child
        null row for the parent with none

      so it fixes the COUNT and hands you
        duplicated parent data
        + grouping code

      wide parent rows → real bytes
      two child relations → CROSS PRODUCT


Fix two: the BATCH QUERY   ← default to this

    SELECT * FROM posts WHERE user_id IN (...)
    then group in memory

    verified, same data:
      4 post rows in 2 QUERIES
      no duplicated user data
      no null rows

    two clean, separately-shaped results usually
    beat one multiplied result, and the advantage
    GROWS with parent width and relationship
    count.

    two children → 3 queries, not a cross product

    ⚠ IN with a huge list has its own limits.
      chunk in a few hundred, not ten thousand.


The habit

    every  await db...  is
      a network round trip
      + database work
      + a connection
      + latency

    so the question about any loop is NOT
      "is this correct"
    but
      "HOW MANY QUERIES WHEN N IS LARGE?"

    if the answer contains N, restructure.

    and FIND them by MEASURING:
      turn on query logging, load a page, count.

      an N+1 is obvious in a query LOG and
      nearly invisible in a DIFF.


The close relative

    with an index on posts.user_id
      →  101 FAST queries
    without one
      →  101 FULL TABLE SCANS

    fixing the N+1 on an unindexed foreign key
    helps enormously and HIDES the fact that the
    missing index was the bigger problem.

    check both.`,
      codeExample: {
        title: "N+1, both fixes, and how to actually find them",
        code: `import { eq, inArray } from "drizzle-orm";
import { users, posts, comments } from "./schema.js";


// ── ✗ The N+1. Correct, type-safe, and 1,001 queries. ───────
const usersRows = await db.select().from(users).limit(1000);

for (const user of usersRows) {
  user.posts = await db
    .select()
    .from(posts)
    .where(eq(posts.userId, user.id));
}
//
// 1 + 1000 = 1,001 queries.
//
// There is nothing wrong with any single line. It is the loop
// boundary that is the bug, and a loop boundary is not
// something a type system has an opinion about.
//
// At 5ms per query: 5 seconds. The event loop is not blocked
// for any of it. It is idle, a thousand times. (Day 3)


// ── Fix one: the join. One query, five rows for three. ──────
const rows = await db
  .select({
    userId: users.id,
    userName: users.name,
    postId: posts.id,
    postTitle: posts.title,
  })
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id))
  .limit(1000);

// Verified shape, from the joins lesson: 3 users and 4 posts
// produced 5 rows, with the parent repeated per child and a
// null row for the parent with none. So:

const byUser = new Map();
for (const row of rows) {
  if (!byUser.has(row.userId)) {
    byUser.set(row.userId, { id: row.userId, name: row.userName, posts: [] });
  }
  if (row.postId !== null) {
    byUser.get(row.userId).posts.push({ id: row.postId, title: row.postTitle });
  }
}
//
// One query. And: duplicated parent columns on the wire,
// grouping code to maintain, a null guard to remember, and
// the limit now bounds ROWS rather than USERS, which is a
// subtle behaviour change.


// ── ✓ Fix two: batch. Default to this. ──────────────────────
const users2 = await db.select().from(users).limit(1000);
const ids = users2.map((u) => u.id);

const posts2 = await db
  .select()
  .from(posts)
  .where(inArray(posts.userId, ids));

// Group by parent id.
const postsByUser = new Map();
for (const post of posts2) {
  if (!postsByUser.has(post.userId)) postsByUser.set(post.userId, []);
  postsByUser.get(post.userId).push(post);
}

const result = users2.map((u) => ({
  ...u,
  posts: postsByUser.get(u.id) ?? [],
}));
//
// Verified on the small dataset: 4 post rows in 2 queries, no
// duplicated user data, no null rows.
//
// 2 queries instead of 1,001, and instead of one query with a
// multiplied result. The limit bounds users, which is what
// you meant. Each result set has one clean shape.


// ── Why batch scales better than join ───────────────────────
// Add comments as well.
//
// ✗ Join both:
//     LEFT JOIN posts    ...
//     LEFT JOIN comments ...
//
//   A user with 10 posts and 10 comments  ->  100 rows.
//   With 100 and 100  ->  10,000 rows for 200 items.
//   That is a cross product, and it gets worse, not better,
//   as the data grows.
//
// ✓ Batch all three:
const users3 = await db.select().from(users).limit(1000);
const ids3 = users3.map((u) => u.id);
const [posts3, comments3] = await Promise.all([
  db.select().from(posts).where(inArray(posts.userId, ids3)),
  db.select().from(comments).where(inArray(comments.userId, ids3)),
]);
//
// 3 queries, two of them in parallel, no duplication and no
// cross product. This shape holds up as you add relationships.


// ── ⚠ Chunk very large IN lists ─────────────────────────────
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const allPosts = [];
for (const batch of chunk(ids, 500)) {
  allPosts.push(...await db.select().from(posts).where(inArray(posts.userId, batch)));
}
// An IN list with ten thousand entries is its own problem:
// a very large statement, and a query plan that may stop
// using your index. A few hundred at a time is the safe shape.


// ── ✓ Or let Drizzle do it ──────────────────────────────────
const nested = await db.query.users.findMany({
  with: { posts: { limit: 10 }, comments: { limit: 10 } },
  limit: 1000,
});
// Nested objects, no grouping code, no cross product.
//
// And still check what it runs:
console.log(db.query.users.findMany({ with: { posts: true } }).toSQL());
// Whether that is one query or several is a decision the
// library makes for you.


// ═══════════════════════════════════════════════════════════
// How to actually find these
// ═══════════════════════════════════════════════════════════

// An N+1 is nearly invisible in a diff and completely obvious
// in a query log. So count, do not read.

let queryCount = 0;
const logged = drizzle(pool, {
  logger: {
    logQuery(query, params) {
      queryCount += 1;
      console.log(\`[\${queryCount}]\`, query, params);
    },
  },
});

// Then, in a test:
test("GET /users does not N+1", async (t) => {
  const app = buildApp({ logger: false });
  t.after(() => app.close());

  queryCount = 0;
  await app.inject({ url: "/users?limit=50" });

  assert.ok(
    queryCount <= 3,
    \`expected at most 3 queries, ran \${queryCount}\`,
  );
});
//
// That is a genuinely valuable test, and rare. It fails when
// someone adds an innocent-looking loop, which is the only
// moment you could have caught it. Day 13's testing lesson
// pointed at the one thing types cannot check.


// ── ⚠ And check the index while you are there ───────────────
// EXPLAIN ANALYZE
//   SELECT * FROM posts WHERE user_id = 42;
//
// Seq Scan on posts                       ← no index
//   ->  each of the 1,001 queries was a full table scan
//
// Index Scan using posts_user_id_idx      ← indexed
//
// If posts.user_id has no index, fixing the N+1 will look
// like a huge win and the missing index was the larger
// problem. Fix both, and check with EXPLAIN rather than
// assuming the index exists.`,
      },
      keyTakeaways: [
        "An N+1 is correct code. Type-safe, validated, readable, right answer, and one query per row. Nothing about it is an error, so no tool catches it.",
        "It scales with your data, not your traffic, so it passes every test and staging check and then degrades over months.",
        "Each query is a round trip and a connection. At 5ms, 100 of them is half a second of the event loop being idle rather than blocked.",
        "The join fix gives one query and, verified, duplicated parent rows: three users and four posts produced five rows plus a null row.",
        "The batch fix gives two queries with clean separate result sets and no duplication. Verified: 4 post rows in 2 queries.",
        "Default to batching. The advantage grows with parent row width and with each extra relationship, where a join becomes a cross product.",
        "Two child relationships means three batched queries rather than a 100-row cross product for 20 items.",
        "Chunk large `IN` lists to a few hundred; ten thousand ids is its own problem, including a plan that may stop using your index.",
        "Ask of every loop: how many queries when N is large? If the answer contains N, restructure.",
        "Find them by measuring. An N+1 is obvious in a query log and nearly invisible in a diff, and a query-count assertion in a test is a genuinely valuable test.",
        "Check the index too. Without one on `posts.user_id`, those 101 queries were 101 full table scans, and fixing the N+1 hides that.",
      ],
      commonMistakes: [
        "Putting an `await db...` inside a loop. That is the whole pattern, and it reads perfectly well.",
        "Believing type safety or validation would have caught it. Nothing about an N+1 is a type error.",
        "Concluding it is fine because the endpoint is fast in development, where the table has five rows.",
        "Reaching for a join reflexively. It fixes the count and gives you duplication, grouping code and a limit that now bounds rows rather than parents.",
        "Joining two child relationships in one query. The cross product grows with the data.",
        "Passing ten thousand ids to an `IN` clause. Chunk it.",
        "Never turning on query logging, so you have no way to notice.",
        "Fixing the N+1 and not checking whether the foreign key was indexed. The missing index was probably the bigger problem.",
      ],
      quiz: [
        {
          question: "Why does no tool catch an N+1?",
          options: [
            "Linters do not support databases",
            "Nothing about it is an error. The code is type-safe, validated and correct; only the number of round trips is wrong, and that is invisible in the source.",
            "It only happens in raw SQL",
            "Strict mode would catch it",
          ],
          correctIndex: 1,
          explanation:
            "It is a property of the loop boundary, which is not something a type system has an opinion about.",
        },
        {
          question: "Why does an N+1 usually reach production?",
          options: [
            "It is rare",
            "It scales with data rather than traffic, so it passes tests and staging and then degrades gradually over months",
            "Tests do not use a database",
            "It only appears under load",
          ],
          correctIndex: 1,
          explanation:
            "Nobody deploys it and watches it break, which makes it the hardest kind of slowness to attribute to a cause.",
        },
        {
          question: "The join fix turns 101 queries into 1. What does it cost, verified?",
          options: [
            "Nothing",
            "Duplicated parent rows plus grouping code. Three users and four posts produced five rows, with a null row for the parent with none.",
            "Type safety",
            "Transaction support",
          ],
          correctIndex: 1,
          explanation:
            "A good trade often, and still a trade. The limit also now bounds rows rather than parents.",
        },
        {
          question: "Why default to batching rather than joining?",
          options: [
            "It is fewer queries",
            "Two clean result sets beat one multiplied one, and the advantage grows with parent width and with each extra relationship, where a join becomes a cross product",
            "Joins are unsafe",
            "Batching uses the index better",
          ],
          correctIndex: 1,
          explanation:
            "Verified: 4 post rows in 2 queries with no duplication. Two children means three queries instead of a 100-row cross product for 20 items.",
        },
        {
          question: "What is the reliable way to find N+1 problems?",
          options: [
            "Code review",
            "Query logging and counting. An N+1 is obvious in a log and nearly invisible in a diff, so assert a query count in a test.",
            "Type checking",
            "Load testing",
          ],
          correctIndex: 1,
          explanation:
            "A query-count assertion fails the moment someone adds an innocent-looking loop, which is the only point you could have caught it.",
        },
        {
          question: "You fix an N+1 and the endpoint gets dramatically faster. What should you also check?",
          options: [
            "The connection pool size",
            "Whether the foreign key was indexed. Without an index those were 101 full table scans, and the missing index was likely the larger problem.",
            "The serialization schema",
            "The transaction isolation level",
          ],
          correctIndex: 1,
          explanation:
            "Use `EXPLAIN ANALYZE` rather than assuming the index exists. Fix both.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What was verified about `node:sqlite` on Node 24.14.1?",
      options: [
        "It is stable",
        "It works, prints an `ExperimentalWarning` saying it might change at any time, and returns null-prototype rows",
        "It is unavailable",
        "It only works in memory",
      ],
      correctIndex: 1,
      explanation:
        "So `row.hasOwnProperty` throws and `row instanceof Object` is false. Use `Object.hasOwn` or spread into a plain object.",
    },
    {
      question: "Ten containers with a pool of 20 each. What is the problem?",
      options: [
        "Nothing",
        "That is 200 connections against a common `max_connections` of 100, and a rolling deploy briefly doubles the instance count",
        "The pool is shared",
        "Postgres pools automatically",
      ],
      correctIndex: 1,
      explanation:
        "It fails in production and not in single-instance staging. Migrations, cron jobs and your own `psql` come out of the same budget.",
    },
    {
      question: "What happens without `connectionTimeoutMillis` when the pool is exhausted?",
      options: [
        "An immediate error",
        "Requests wait forever, so a slow database becomes a hung app and the health check hangs too, and nothing restarts the pod",
        "The pool grows",
        "The query is cancelled",
      ],
      correctIndex: 1,
      explanation:
        "A fast, loggable failure beats a hang your orchestrator cannot detect.",
    },
    {
      question: "Three users and four posts, one user owning three. How many rows does a LEFT JOIN return?",
      options: ["3", "5", "4", "7"],
      correctIndex: 1,
      explanation:
        "Verified. One row per matching combination, plus a null row for the user with no posts. The parent is repeated per child.",
    },
    {
      question: "You write `db.update(...)` instead of `tx.update(...)` inside a transaction. What happens?",
      options: [
        "It throws",
        "It runs on a different connection outside the transaction, commits independently, and a rollback cannot undo it",
        "It joins the transaction",
        "It is deferred",
      ],
      correctIndex: 1,
      explanation:
        "No error, no warning, and tests pass because they take the happy path. The most common transaction bug there is.",
    },
    {
      question: "How do you roll back in Drizzle, and what is the resulting trap?",
      options: [
        "`tx.rollback()`, no trap",
        "By throwing, which means a swallowed error commits, because a callback that returns normally commits",
        "Return false",
        "Any error rolls back automatically",
      ],
      correctIndex: 1,
      explanation:
        "A `try/catch` inside the callback that logs and continues turns the transaction into a plain sequence of statements.",
    },
    {
      question: "Why does dropping a column in a single deploy cause an outage?",
      options: [
        "The lock",
        "During a rolling deploy old and new code both run against the new schema, so old instances query a column that is gone",
        "Migrations run twice",
        "It exhausts the pool",
      ],
      correctIndex: 1,
      explanation:
        "Expand then contract across three deploys, because a down migration restores the column and not its data.",
    },
    {
      question: "Why is `WHERE name = 'Rajan' OR 1=1` the whole injection lesson?",
      options: [
        "It uses a quote",
        "The input contributed a clause rather than a value, so a one-row predicate returned three rows. Verified.",
        "It is a Postgres bug",
        "It needs a semicolon",
      ],
      correctIndex: 1,
      explanation:
        "A suspicious-character filter would not help, because `OR 1=1` contains nothing unusual. The problem is that the string was parsed as SQL at all.",
    },
    {
      question: "What happens with `ORDER BY $1` and a column name?",
      options: [
        "It sorts correctly",
        "It does not sort. Postgres treats `$1` as a constant, with no error, which is why people reach for concatenation here.",
        "Syntax error",
        "It sorts by the first column",
      ],
      correctIndex: 1,
      explanation:
        "Parameters carry values, not identifiers. Use a Zod enum allowlist and a lookup map to a real column reference.",
    },
    {
      question: "Why does no tool catch an N+1?",
      options: [
        "Poor linters",
        "Nothing about it is an error. It is type-safe, validated and correct; only the round-trip count is wrong, and that is invisible in the source.",
        "It only happens with raw SQL",
        "TypeScript could, with strict mode",
      ],
      correctIndex: 1,
      explanation:
        "It is a property of the loop boundary. And it scales with data rather than traffic, so it passes every test.",
    },
    {
      question: "Why default to batching rather than joining to fix an N+1?",
      options: [
        "Fewer queries",
        "Two clean result sets beat one multiplied one, and joining two child relationships becomes a cross product: 10 and 10 gives 100 rows for 20 items",
        "Joins are unsafe",
        "It uses indexes better",
      ],
      correctIndex: 1,
      explanation:
        "Verified: 4 post rows in 2 queries with no duplication, against 5 rows for 3 users with a join.",
    },
    {
      question: "You fix an N+1 and it gets dramatically faster. What else should you check?",
      options: [
        "The pool size",
        "Whether the foreign key was indexed. Without one, those were full table scans and the missing index was probably the larger problem.",
        "The response schema",
        "The isolation level",
      ],
      correctIndex: 1,
      explanation:
        "Use `EXPLAIN ANALYZE` rather than assuming. Fixing the N+1 hides the index problem behind a real improvement.",
    },
    {
      question: "Why is `values(request.body)` still dangerous under Drizzle's types?",
      options: [
        "Drizzle has weak types",
        "The extra fields a client sent are real columns, so the types are satisfied and the row is written. Type safety and mass assignment are orthogonal.",
        "Only in raw SQL",
        "It is safe with a Zod schema",
      ],
      correctIndex: 1,
      explanation:
        "Day 16's rule stands at this layer too: destructure the fields you meant rather than passing the body onward.",
    },
    {
      question: "Where does reference data like plan tiers belong?",
      options: [
        "A seed script",
        "A migration, because production needs those rows and a migration runs there in order, exactly once",
        "Application code",
        "Environment variables",
      ],
      correctIndex: 1,
      explanation:
        "The test: if production needs the rows, it is a migration. If only a developer wants them, it is a seed, and it should be idempotent.",
    },
  ],
  project: {
    name: "day-17",
    goal: "Model users, posts and comments with Drizzle, write the N+1 on purpose and count the queries, then fix it twice and measure both, and reproduce the transaction bug that silently commits.",
    brief:
      "The exercise is not about Drizzle syntax. It is about the two things on this day that no tool will ever tell you. First, an N+1: you have to write it, count the queries, and then fix it both ways so you can feel why the join is not automatically the better answer, since it hands back duplicated rows and grouping code. Second, the transaction bug: use db instead of tx on one line, throw, and watch half your work commit anyway. That failure has no error message and no failing test, and seeing it once is the only reliable protection. Do all of it with query logging turned on, because the whole day argues that measuring beats reading.",
    steps: [
      "Create `day-17/` with `\"type\": \"module\"` and install `drizzle-orm`, `drizzle-kit` and `pg`. Use Docker for Postgres, or `node:sqlite` if you would rather not.",
      "Run a `node:sqlite` script first and note the `ExperimentalWarning`, then confirm `row instanceof Object` is false and that `row.hasOwnProperty(\"id\")` throws.",
      "Write `src/db/schema.ts` with `users`, `posts` and `comments`, correct foreign keys via `.references()`, and an index on every foreign key.",
      "Include a `snake_case` column such as `created_at` mapped to a `camelCase` property, then deliberately omit the name argument once and read the runtime error.",
      "Export `$inferSelect` and `$inferInsert` types for each table, and write down two concrete differences between the two for `users`.",
      "Generate and apply the migration with `drizzle-kit`, then read the generated SQL file before applying it.",
      "Write an idempotent seed with `onConflictDoNothing` that creates 200 users, 5 posts each and 3 comments per post. Run it twice and confirm the counts do not change.",
      "Turn on Drizzle's `logger` so every query prints, and add a counter you can reset.",
      "Write the N+1: select all users, then loop and select each user's posts. Record the query count and the wall-clock time.",
      "Fix it with a `leftJoin`. Record the query count, the number of ROWS returned, and the time. Note how many rows you got for 200 users with 5 posts each.",
      "Write the grouping loop for that join, then deliberately omit the null check and add a user with no posts. Observe the phantom post.",
      "Fix it again by batching: one query for users, one `inArray` query for posts, then group in memory. Record queries, rows and time.",
      "Compare all three in a table you write yourself: queries, rows returned, time.",
      "Now join posts AND comments in one query for 10 users. Count the rows and explain the number.",
      "Do the same with three batched queries and compare the row counts.",
      "Run `EXPLAIN ANALYZE SELECT * FROM posts WHERE user_id = 42`, then drop the index on `posts.user_id`, run it again, and compare the plans.",
      "Write a transfer function using `db.transaction`, with the arithmetic done in SQL rather than in JavaScript.",
      "Break it on purpose: change one `tx.update` to `db.update`, throw at the end of the callback, and check both account balances afterwards.",
      "Break it a second way: wrap one statement in a `try/catch` that logs without rethrowing, throw nothing, and confirm the transaction committed.",
      "Fix both, then write a service function that takes the handle as a parameter and confirm it works inside and outside a transaction.",
      "Write a query-count test with `node:test` that loads your list endpoint and asserts at most three queries ran.",
      "Add a sort parameter to the list endpoint using a Zod enum and a lookup map to real column references, then try `?sort=name;DROP` and confirm the 400.",
    ],
    acceptance: [
      "You have your own table comparing the N+1, join and batch versions on queries, rows returned and time.",
      "You can state the query count for the N+1 version with 200 users, and say why it would pass a test suite.",
      "You know how many rows your join returned for 200 users with 5 posts each, and can explain the number.",
      "You saw the phantom post from a missing null check on a LEFT JOIN.",
      "You saw the row count when joining posts and comments together, and can explain why it is a cross product.",
      "The batch version runs in a fixed number of queries regardless of how many users you load.",
      "`EXPLAIN ANALYZE` shows an index scan with the foreign key index and a sequential scan without it, and you have both outputs.",
      "You reproduced the `db` instead of `tx` bug: one balance rolled back and the other committed, with no error anywhere.",
      "You reproduced the swallowed-error commit and can state why throwing is the only rollback.",
      "Your service function takes the handle as a parameter and works both inside and outside a transaction.",
      "A test asserts a maximum query count for the list endpoint and fails if you reintroduce the loop.",
      "`?sort=name;DROP` returns 400, and you can say why a Zod enum plus a lookup map is two layers rather than one.",
      "Running the seed twice leaves the row counts unchanged.",
      "`npx tsc --noEmit` passes.",
    ],
    stretch: [
      "Rewrite the batch version with `db.query.users.findMany({ with: { posts: true } })`, then `.toSQL()` it and say whether it ran one query or two.",
      "Add a nested `limit` to that relational query and explain what the outer limit does and does not bound.",
      "Do the expand-then-contract rename across three migrations for `users.name` to `users.full_name`, and run each one against a running app.",
      "Write the down migration for a `DROP COLUMN` and demonstrate that the data does not come back.",
      "Run `CREATE INDEX` and `CREATE INDEX CONCURRENTLY` on a table with a million rows while writing to it, and compare what happens.",
      "Set `max: 1` on your pool, run two concurrent requests each holding a transaction, and observe the second one wait, then time out with `connectionTimeoutMillis` set.",
      "Add `FOR UPDATE` to the transfer's select, run two transfers concurrently, and compare the balances against a version without it.",
      "Put a `setTimeout` of two seconds inside a transaction to simulate an HTTP call, fire ten concurrent requests with a pool of five, and watch unrelated endpoints stop responding.",
      "Reproduce injection safely on a local throwaway table with the `OR 1=1` predicate, then confirm the parameterized version returns zero rows.",
      "Add `application_name` to your connection string and use `pg_stat_activity` to see who is using your connection budget.",
    ],
  },
};
