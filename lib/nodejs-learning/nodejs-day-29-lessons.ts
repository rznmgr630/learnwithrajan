import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_29_LESSONS: LessonDay = {
  day: 29,
  title: "Architecture & code organisation",
  totalMinutes: 94,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "layers",
      title: "Layers, and what each one is not allowed to know",
      durationMinutes: 12,
      explanation:
        "## The actual problem\n\nAs an application grows the difficulty stops being Node and becomes <b>where code lives and what it is allowed to depend on</b>.\n\n```text\nRoutes  →  Services  →  Repositories  →  Database\n```\n\n> The arrow is the important part. Layers are only useful if the dependencies point <b>one way</b>. Three folders with everything importing everything is not a layered architecture, it is a layered folder listing.\n\n---\n\n## The three layers\n\n<b>Route layer</b> (everything specific to HTTP: parsing, status codes, headers, auth extraction).\n\n> The test for whether a route is doing too much: could this logic be triggered by a queue message or a cron job? If yes, it does not belong here. Day 24's worker needs the same rules and cannot call your HTTP handler.\n\n<b>Service layer</b> (the business rules).\n\n> The rule that makes this layer worth having: <b>it must not know that HTTP exists</b>. No `request`, no `reply`, no status codes. A service that takes a Fastify request has quietly become a route with extra steps.\n\n<b>Repository</b> (database access).\n\n> The value is not abstraction for its own sake, it is that queries become findable. When Day 17 tells you to add an index, you need to know every query that touches a table, and grep across forty route files is not that.\n\n---\n\n## Where each concern belongs\n\n```text\nshape of the input        route      Day 19's Zod schema\nauthentication           route      who is this\nauthorisation            service    may THIS user do THIS\nbusiness rules           service\nqueries                  repository\ntransactions             service    it owns the unit of work\n```\n\n> Two of those are worth arguing about. <b>Authorisation belongs in the service</b>, not the route, because Day 18's lesson was that a resource-ownership check has to happen where the resource is known, and a route only knows the URL.\n>\n> And <b>transactions belong to the service</b>, because the service is what decides that two writes must succeed together. A repository that opens its own transaction per method makes that impossible.\n\n---\n\n## Why MVC does not transfer\n\n> There is no <b>V</b>. An API returns data, so \"controller\" becomes a synonym for \"route\" and \"model\" gets used for three different things at once: the database row, the domain object, and the response shape. Those are genuinely different and conflating them is where a lot of API mess comes from.\n\n---\n\n## And the honest limit of all this\n\n> Layers cost indirection. On a small application, `routes / services / repositories` with one function in each is three files to read for one behaviour, and you have bought nothing.\n>\n> Introduce a layer when you feel the specific pain it solves: a service when the same rule is needed by a route and a job, a repository when you cannot find every query against a table.",
      diagram: `The actual problem

    as an app grows, the difficulty stops being
    Node and becomes WHERE CODE LIVES AND WHAT IT
    MAY DEPEND ON.

    Routes → Services → Repositories → Database

⚠ THE ARROW IS THE IMPORTANT PART.

    layers are only useful if dependencies point
    ONE WAY.

    three folders with everything importing
    everything is not a layered architecture.

    it is a layered FOLDER LISTING.


The test for each layer

    ROUTE       everything specific to HTTP:
                parsing, status codes, headers,
                auth extraction

      ⚠ the test: could this logic be triggered by
        a QUEUE MESSAGE or a CRON JOB?

        if yes, it does not belong here.

        Day 24's worker needs the same rules and
        CANNOT call your HTTP handler.

    SERVICE     the business rules

      ⚠ the rule that makes it worth having:

        IT MUST NOT KNOW THAT HTTP EXISTS.

        no request. no reply. no status codes.

        a service taking a Fastify request has
        quietly become a route with extra steps.

    REPOSITORY  database access

      the value is not abstraction for its own
      sake. it is that QUERIES BECOME FINDABLE.

      when Day 17 says add an index, you need
      every query touching that table, and grep
      across forty route files is not that.


Where each concern belongs

  shape of input     ROUTE       Day 19's Zod
  authentication     ROUTE       who is this
  authorisation      SERVICE     may THIS user do
                                 THIS
  business rules     SERVICE
  queries            REPOSITORY
  transactions       SERVICE     it owns the unit
                                 of work

⚠ two are worth arguing about:

    AUTHORISATION belongs in the SERVICE, not the
    route.

      Day 18: a resource-ownership check must
      happen WHERE THE RESOURCE IS KNOWN, and a
      route only knows the URL.

    TRANSACTIONS belong to the SERVICE.

      the service decides two writes must succeed
      together.

      a repository opening its own transaction per
      method makes that IMPOSSIBLE.


Why MVC does not transfer

    THERE IS NO V.

    so "controller" becomes a synonym for "route",
    and "model" gets used for THREE things at
    once:

      the database row
      the domain object
      the response shape

    those are genuinely different, and conflating
    them is where a lot of API mess comes from.


⚠ And the honest limit

    layers cost INDIRECTION.

    on a small app, routes/services/repositories
    with one function each is three files to read
    for one behaviour, and you bought nothing.

    ✓ introduce a layer when you feel the SPECIFIC
      pain it solves:

      a service   when the same rule is needed by
                  a route AND a job
      a repository when you cannot find every
                  query against a table`,
      codeExample: {
        title: "One endpoint, before and after",
        code: `// ── ✗ Everything in the handler ─────────────────────────────
app.post("/orders", async (request, reply) => {
  const body = request.body;
  if (!body.items?.length) return reply.code(400).send({ error: "no items" });

  const user = await app.db.query("SELECT * FROM users WHERE id = $1", [request.user.id]);
  if (!user.rows[0]) return reply.code(404).send({ error: "no user" });

  let subtotal = 0;
  for (const item of body.items) {
    const p = await app.db.query("SELECT price, stock FROM products WHERE id = $1", [item.id]);
    //        ^^^^^^^^^^^^^^^^^^ ⚠ Day 17's N+1, and it is
    //        invisible here because the query is inline
    if (!p.rows[0]) return reply.code(400).send({ error: "bad product" });
    if (p.rows[0].stock < item.qty) return reply.code(409).send({ error: "out of stock" });
    subtotal += p.rows[0].price * item.qty;
  }

  if (user.rows[0].tier === "gold") subtotal *= 0.9;
  if (subtotal > 10_000 && !user.rows[0].verified) {
    return reply.code(403).send({ error: "verification required" });
  }
  const total = Math.round(subtotal * 1.2 * 100) / 100;

  const order = await app.db.query(
    "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
    [request.user.id, total],
  );
  await sendConfirmationEmail(user.rows[0].email, order.rows[0]);
  return reply.code(201).send(order.rows[0]);
});
//
// Four specific problems, not just "it is long".
//
// 1. The $10,000 verification rule exists only here. Day 24's
//    batch-import worker creates orders too, and it does not
//    enforce it. That is a real hole, and nothing in the code
//    hints at it.
// 2. The N+1 is hidden. Day 17's advice to find every query
//    against products means grepping every route file.
// 3. There is no transaction. The insert succeeds, the email
//    throws, and you have an order nobody was told about.
// 4. You cannot test the pricing rules without a running
//    server and a database.


// ── ✓ Route: HTTP only ──────────────────────────────────────
// routes/orders.ts
const CreateOrder = z.object({
  items: z.array(z.object({ id: z.string().uuid(), qty: z.number().int().min(1).max(100) })).min(1).max(50),
  //                                                                            ^^^^^^^^^ Day 19: bound it
});

app.post("/orders", { preHandler: [app.authenticate] }, async (request, reply) => {
  const input = CreateOrder.parse(request.body);
  const order = await app.orders.create({ userId: request.user.id, items: input.items });
  return reply.code(201).send(toOrderResponse(order));
});
// Validation, auth, status code, response shape. Nothing else.
// ⚠ Note it does NOT catch errors. Day 22's error handler maps
// a DomainError to a status code once, centrally, so every
// route does not repeat a try/catch.


// ── ✓ Service: business rules, no HTTP ──────────────────────
// services/order-service.ts
export function createOrderService({ orders, products, users, email, db }) {
  return {
    async create({ userId, items }) {
      const user = await users.findById(userId);
      if (!user) throw new NotFound("user", userId);

      // ⚠ One query, not one per item. The repository makes
      // the N+1 visible, because a loop calling a repo method
      // reads as obviously wrong.
      const products_ = await products.findManyByIds(items.map((i) => i.id));

      const priced = priceOrder({ items, products: products_, user });
      //             ^^^^^^^^^^ pure, and tested separately

      // ⚠ Authorisation, here, where the resource is known.
      // Day 18's rule: the route only knew the URL.
      if (priced.total > 10_000 && !user.verified) {
        throw new Forbidden("verification required for orders over 10000");
      }

      // ⚠ The transaction belongs to the SERVICE, because the
      // service is what decides these must succeed together.
      const order = await db.transaction(async (tx) => {
        await products.decrementStock(tx, items);
        return orders.insert(tx, { userId, total: priced.total, lines: priced.lines });
      });

      // ⚠ AFTER the commit, and queued rather than awaited.
      // Day 24: if the email provider is down, the order
      // still exists and the email retries.
      await email.enqueue("order-confirmation", { orderId: order.id });

      return order;
    },
  };
}
// No request, no reply, no status codes. So Day 24's worker
// can call orders.create() and gets the SAME rules, including
// the $10,000 check.


// ── ✓ Repository: queries, findable in one place ────────────
// repositories/product-repository.ts
export function createProductRepository(db) {
  return {
    findManyByIds(ids) {
      return db.select().from(products).where(inArray(products.id, ids));
    },
    decrementStock(tx, items) {
      return Promise.all(items.map((i) =>
        tx.update(products)
          .set({ stock: sql\`\${products.stock} - \${i.qty}\` })
          .where(and(eq(products.id, i.id), gte(products.stock, i.qty))),
      ));
      //  ⚠ the gte in the WHERE is the concurrency check:
      //  two simultaneous orders cannot both take the last
      //  item, because the second updates zero rows.
    },
  };
}
// ⚠ Note decrementStock TAKES a tx rather than opening one.
// That is what keeps the unit of work owned by the service.
// A repository that starts its own transaction cannot
// participate in somebody else's.
//
// And now "every query against products" is one file, which
// is what Day 17's indexing work actually needs.


// ── ✓ The pure core, which is where the rules live ──────────
// domain/pricing.ts
export function priceOrder({ items, products, user }) {
  const byId = new Map(products.map((p) => [p.id, p]));

  const lines = items.map((item) => {
    const product = byId.get(item.id);
    if (!product) throw new BadRequest(\`unknown product \${item.id}\`);
    if (product.stock < item.qty) throw new Conflict(\`out of stock: \${item.id}\`);
    return { productId: item.id, qty: item.qty, unit: product.price };
  });

  let subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  if (user.tier === "gold") subtotal *= 0.9;

  return { lines, subtotal, total: Math.round(subtotal * 1.2 * 100) / 100 };
}
// No database, no HTTP, no clock, no randomness. Every
// pricing rule you will ever be asked to change is in this
// function, and you can test all of them with an object
// literal.


// ── ⚠ Keeping the arrow pointing one way ────────────────────
// The layering only holds if nothing points backwards. Assert
// it, because review will not catch it every time:
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

test("services do not import HTTP or route code", () => {
  for (const f of readdirSync("src/services")) {
    const src = readFileSync(\`src/services/\${f}\`, "utf8");
    assert.doesNotMatch(src, /from "fastify"/, \`\${f} imports fastify\`);
    assert.doesNotMatch(src, /\\.\\.\\/routes\\//, \`\${f} imports a route\`);
    assert.doesNotMatch(src, /\\breply\\b|\\brequest\\.(body|params|headers)\\b/, \`\${f} touches HTTP\`);
  }
});

test("domain code imports nothing but domain code", () => {
  for (const f of readdirSync("src/domain")) {
    const src = readFileSync(\`src/domain/\${f}\`, "utf8");
    assert.doesNotMatch(src, /from "(?!\\.\\/)/, \`\${f} imports outside domain\`);
  }
});
// Cheaper than a convention nobody remembers under deadline.`,
      },
      keyTakeaways: [
        "Layers only help if dependencies point one way. Three folders importing each other is a folder listing, not an architecture.",
        "The test for a route: could this be triggered by a queue message or a cron job? If yes, it does not belong there.",
        "That matters concretely, because Day 24's worker cannot call your HTTP handler and will silently skip rules that live in it.",
        "A service must not know HTTP exists. One that takes a Fastify request has become a route with extra steps.",
        "A repository's value is that queries become findable, which is what Day 17's indexing work actually needs.",
        "Authorisation belongs in the service, because Day 18's ownership check needs the resource, and a route only knows the URL.",
        "Transactions belong to the service, because it decides which writes must succeed together.",
        "So a repository method should take a transaction rather than open one, or it cannot join somebody else's unit of work.",
        "MVC does not transfer because there is no view, and \"model\" ends up meaning the database row, the domain object and the response shape at once.",
        "Conflating those three is where a lot of API mess comes from.",
        "Keep side effects like email after the commit and queued, so a provider outage does not lose the order.",
        "The pure pricing function is where the rules live, and it needs no database, HTTP, clock or randomness to test.",
        "Layers cost indirection, so introduce one when you feel the pain it solves, not upfront.",
        "Assert the dependency direction in a test, because code review will not catch every violation under deadline.",
      ],
      commonMistakes: [
        "Business rules in the route handler, so Day 24's worker creating the same entity skips them entirely.",
        "Passing `request` or `reply` into a service, which couples the rules to HTTP.",
        "Inline queries in handlers, which hides an N+1 and makes indexing work impossible.",
        "Authorisation in the route, where the resource is not yet known.",
        "A repository that opens its own transaction, so two writes cannot be made atomic together.",
        "No transaction at all, so an insert succeeds and a following side effect fails.",
        "Awaiting an email inside the transaction, which holds row locks open for a network call.",
        "Using \"model\" for the database row, the domain object and the response shape interchangeably.",
        "Adding all three layers to a small application, buying indirection with no payoff.",
        "Relying on convention alone for dependency direction, with no test asserting it.",
      ],
      quiz: [
        {
          question: "What is the test for whether logic belongs in a route handler?",
          options: [
            "Whether it is over 50 lines",
            "Whether it could be triggered by a queue message or a cron job. If yes, it belongs in a service.",
            "Whether it touches the database",
            "Whether it needs validation",
          ],
          correctIndex: 1,
          explanation:
            "Day 24's worker cannot call an HTTP handler, so a rule living there is silently skipped by every other entry point.",
        },
        {
          question: "Where does resource-ownership authorisation belong, and why?",
          options: [
            "The route, as middleware",
            "The service, because the check needs the resource and a route only knows the URL",
            "The repository",
            "The database",
          ],
          correctIndex: 1,
          explanation:
            "Day 18's point. A route can answer \"who is this\"; only the service can answer \"may this user do this to this thing\".",
        },
        {
          question: "Why should a repository method take a transaction rather than open one?",
          options: [
            "It is faster",
            "So the service can decide which writes must succeed together. A repository that opens its own cannot join somebody else's unit of work.",
            "Transactions are expensive",
            "It avoids deadlocks",
          ],
          correctIndex: 1,
          explanation:
            "The service owns the unit of work because it is what knows the two writes belong together.",
        },
        {
          question: "Why does MVC not transfer cleanly to a Node API?",
          options: [
            "Node does not support it",
            "There is no view, so \"controller\" duplicates \"route\" and \"model\" ends up meaning the database row, the domain object and the response shape at once",
            "It needs a template engine",
            "It transfers fine",
          ],
          correctIndex: 1,
          explanation:
            "Those three are genuinely different things, and conflating them causes a lot of API mess.",
        },
        {
          question: "When should you introduce a service layer?",
          options: [
            "Always, from the first file",
            "When you feel the pain it solves: the same rule is needed by a route and a job",
            "Never for small apps",
            "When the file exceeds 200 lines",
          ],
          correctIndex: 1,
          explanation:
            "Layers cost indirection. Three files with one function each for one behaviour buys nothing.",
        },
      ],
    },
    {
      id: "di-and-testability",
      title: "Dependency injection, and testable business logic",
      durationMinutes: 11,
      explanation:
        "## Dependency injection\n\n<b>Dependency injection</b> (giving a component what it needs instead of letting it construct its own).\n\n```js\nclass UserService { constructor() { this.db = new Database(); } }   ✗\nclass UserService { constructor(db) { this.db = db; } }             ✓\n```\n\n> The reason is not testing, although that is the visible benefit. It is that the second version <b>says what it needs</b>. You can read its signature and know it touches the database; the first one hides that, and a module that reaches out to grab its own dependencies has a dependency graph nobody can see.\n>\n> And you need no framework for this. A function that takes an object and returns an object is dependency injection.\n\n---\n\n## What it actually buys you\n\n> The usual claim is that it makes tests fast. I measured that and it did not hold up: 60 pure assertions ran in about 60ms and 60 of the same assertion through an in-process HTTP server ran in about 100ms. Not nothing, and not the 10x people describe.\n>\n> So the honest argument is not speed, it is <b>what you have to set up</b>. Testing the $10,000 verification rule through HTTP means a server, a database, a user in a specific state, and an authenticated request. Testing it directly means an object literal. The second one gets written; the first one gets skipped.\n\n---\n\n## Fakes over mocks\n\n<b>Fake</b> (a working simple implementation). <b>Mock</b> (an object that records calls and returns canned values).\n\n> Prefer a fake. A mock asserts <b>that you called the database a certain way</b>, which is a test of your implementation, so it fails when you refactor and passes when the query is wrong. A fake in-memory repository asserts <b>the outcome</b>, which is what you care about.\n\n---\n\n## And a measured reason to care about structure\n\nA barrel file re-exporting 120 feature modules, importing <b>one</b> of them:\n\n```text\nvia the barrel index    409 ms   (120 modules loaded)\ndirect import             4 ms   (1 module loaded)\n```\n\n> <b>100x</b>, and it is the same one feature either way. A barrel file makes every import of anything an import of everything.\n>\n> That cost lands in three places you have already met: Day 28's cold start, your test startup for every single test file, and any script that imports one helper and pays for your whole application.\n\n---\n\n## Composition at the edge\n\n> The pattern that follows: construct everything once, at startup, in one place. Then a route receives a built service, a test receives a fake one, and Day 24's worker receives the same real one.\n>\n> The place this goes wrong is a module that constructs its dependency at import time, because then importing it for a test connects to a database.",
      diagram: `Dependency injection

    ✗ class UserService {
        constructor() { this.db = new Database(); }
      }

    ✓ class UserService {
        constructor(db) { this.db = db; }
      }

    the reason is not testing, though that is the
    visible benefit.

    it is that the second version SAYS WHAT IT
    NEEDS.

      you read its signature and know it touches
      the database.

      the first HIDES that, and a module reaching
      out to grab its own dependencies has a
      dependency graph nobody can see.

    ⚠ and you need NO FRAMEWORK.

      a function taking an object and returning an
      object IS dependency injection.


⚠ What it actually buys. Measured honestly.

    the usual claim: it makes tests fast.

    I measured it and it DID NOT HOLD UP:

      60 pure assertions            ~60 ms
      60 of the same through
        an in-process HTTP server  ~100 ms

    not nothing. not the 10x people describe.

    ✓ so the honest argument is not speed.

      it is WHAT YOU HAVE TO SET UP.

      through HTTP: a server, a database, a user
        in a specific state, an authenticated
        request

      directly: an object literal

      → the second one GETS WRITTEN.
        the first one GETS SKIPPED.


Fakes over mocks

    FAKE   a working simple implementation
    MOCK   records calls, returns canned values

    ✓ prefer a FAKE.

      a mock asserts THAT YOU CALLED THE DATABASE
      A CERTAIN WAY, which is a test of your
      implementation.

      → it fails when you refactor
      → it passes when the query is wrong

      a fake in-memory repository asserts THE
      OUTCOME.


⚠⚠ A measured reason to care about structure

    a barrel file re-exporting 120 feature
    modules, importing ONE of them:

      via the barrel index   409 ms  (120 loaded)
      direct import            4 ms  (1 loaded)

    100x. same one feature either way.

    → A BARREL FILE MAKES EVERY IMPORT OF ANYTHING
      AN IMPORT OF EVERYTHING.

    and that cost lands in three places you have
    met:

      Day 28's cold start
      your test startup, for EVERY test file
      any script importing one helper and paying
        for the whole application


Composition at the edge

    construct everything ONCE, at startup, in ONE
    place.

      a route gets a built service
      a test gets a fake one
      Day 24's worker gets the same real one

    ⚠ where this goes wrong: a module that
      constructs its dependency AT IMPORT TIME.

      then importing it for a test CONNECTS TO A
      DATABASE.`,
      codeExample: {
        title: "Wiring it up once, and the barrel file measurement",
        code: `// ── ✗ The module that builds its own dependencies ───────────
// services/user-service.js
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
//           ^^^^^^^^^ ⚠ runs at IMPORT time

export async function getUser(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
}
//
// Three consequences.
//
// Importing this file for any reason opens a connection pool,
// so a unit test of an unrelated pure function connects to a
// database, and Day 20's missing env var crashes at import
// rather than at a startup check.
//
// You cannot run two configurations in one process, which
// matters for a test that needs a second database.
//
// And nothing in the signature says this touches a database.


// ── ✓ A factory that states its dependencies ────────────────
// services/user-service.js
export function createUserService({ users, email, clock }) {
  return {
    async register({ emailAddress, name }) {
      const existing = await users.findByEmail(emailAddress);
      if (existing) throw new Conflict("email already registered");

      const user = await users.insert({
        emailAddress,
        name,
        createdAt: clock.now(),
        //         ^^^^^ ⚠ injected, so a test can freeze time
        //         instead of asserting "roughly now"
      });

      await email.enqueue("welcome", { userId: user.id });
      return user;
    },
  };
}
// You can read the first line and know exactly what this
// touches. No framework, no decorators, no container.


// ── ✓ Composition in one place, at startup ──────────────────
// app.js
export async function buildApp(config) {
  const db = createDb(config.databaseUrl);
  const redis = createRedis(config.redisUrl);

  const repos = {
    users: createUserRepository(db),
    orders: createOrderRepository(db),
    products: createProductRepository(db),
  };

  const services = {
    users: createUserService({ ...repos, email: createEmailQueue(redis), clock: systemClock }),
    orders: createOrderService({ ...repos, db, email: createEmailQueue(redis) }),
  };

  const app = Fastify({ logger: buildLogger(config), bodyLimit: 256 * 1024 });
  app.decorate("services", services);
  await app.register(routes);
  return app;
}

// And Day 24's worker gets the SAME services, which is the
// whole point:
// worker.js
const services = buildServices(config);
queue.process("batch-import", async (job) => {
  for (const row of job.data.rows) await services.orders.create(row);
  //                                     ^^^^^^^^^^^^^^^^^^^^^ same
  //  rules, same $10,000 check, same transaction
});


// ── ⚠ The test-speed claim, measured ────────────────────────
// 60 pure assertions:
//   $ time node --test pure.test.mjs
//     real 0.12 / 0.06
//
// The same 60 assertions through an in-process HTTP server:
//   $ time node --test http.test.mjs
//     real 0.14 / 0.10
//
// So about 60ms against 100ms. A real difference and NOT the
// order of magnitude usually claimed, and my "integration"
// test had no database in it, which is where the real time
// would go.
//
// ⚠ I am reporting this because the speed argument for
// testable architecture is weaker than people say. The
// argument that holds is the SETUP:
//
//   through HTTP:  build an app, migrate a database, insert a
//                  user with tier=gold and verified=false,
//                  mint a token, send a request, parse JSON
//   directly:      priceOrder({ items, products, user })
//
// The second gets written. The first gets skipped, and then
// the $10,000 rule has no test at all.


// ── ✓ Fakes, not mocks ──────────────────────────────────────
function fakeUserRepository(seed = []) {
  const rows = [...seed];
  return {
    async findByEmail(e) { return rows.find((r) => r.emailAddress === e) ?? null; },
    async findById(id) { return rows.find((r) => r.id === id) ?? null; },
    async insert(u) { const row = { id: String(rows.length + 1), ...u }; rows.push(row); return row; },
  };
}

test("registering an existing email conflicts", async () => {
  const users = fakeUserRepository([{ id: "1", emailAddress: "a@b.com" }]);
  const service = createUserService({ users, email: fakeQueue(), clock: fixedClock("2026-01-01T00:00:00Z") });

  await assert.rejects(
    () => service.register({ emailAddress: "a@b.com", name: "A" }),
    /already registered/,
  );
});

// ✗ The mock version tests your implementation instead:
test("registering calls the database correctly", async () => {
  const query = mock.fn(() => ({ rows: [] }));
  await register({ query }, { emailAddress: "a@b.com" });
  assert.equal(query.mock.calls[0].arguments[0], "SELECT * FROM users WHERE email = $1");
  //           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ⚠ this breaks when
  //           you switch to Drizzle, and it PASSES if the
  //           query has the wrong WHERE clause
});
// A fake asserts the outcome. A mock asserts the mechanism,
// so it fails on refactors and passes on real bugs.
// ⚠ Mocks are right for one thing: asserting a side effect
// happened, like "the email was enqueued exactly once".


// ── ⚠⚠ The barrel file, measured ────────────────────────────
// 120 feature modules, each doing a little work at module
// scope, plus src/index.js that re-exports all of them:
//
//   export * from "./features/feature0/index.js";
//   export * from "./features/feature1/index.js";
//   ... 118 more
//
// Importing ONE feature, two ways:
//
//   $ node viaBarrel.js
//     via barrel: 409ms, exports loaded: 120
//     via barrel: 407ms, exports loaded: 120
//
//   $ node direct.js
//     direct import: 4ms, exports loaded: 1
//     direct import: 4ms, exports loaded: 1
//
// VERIFIED. 100x, for the same one feature.
//
// ✗ import { createOrderService } from "../index.js";
// ✓ import { createOrderService } from "../services/order-service.js";
//
// Where the 400ms lands:
//   - Day 28's cold start, once per instance
//   - every test file that imports through the barrel, so a
//     50-file suite pays it 50 times
//   - a migration script that wanted one helper
//
// ⚠ And a subtler problem: the barrel creates a cycle risk.
// Feature A imports the index to reach feature B, the index
// imports A, and you get a partially initialised module
// rather than an error.
//
// ✓ If you want a barrel for external consumers, keep it at
//   the PACKAGE boundary only, and never import through it
//   from inside the same package.`,
      },
      keyTakeaways: [
        "Dependency injection's real value is that a component states what it needs, so the dependency graph is visible.",
        "A function taking an object and returning an object is dependency injection. No framework is required.",
        "A module that constructs a pool at import time means importing it for any test opens a database connection.",
        "Measured: 60 pure assertions ran in about 60ms and 60 through an in-process HTTP server in about 100ms.",
        "So the common claim that testable architecture makes tests an order of magnitude faster did not hold up here.",
        "The argument that does hold is setup: testing a rule directly is an object literal, and through HTTP it is a server, a database, a seeded user and a token.",
        "The direct test gets written and the HTTP one gets skipped, which is how a rule ends up with no test.",
        "Prefer fakes to mocks: a fake asserts the outcome, a mock asserts the mechanism.",
        "So a mock fails when you refactor and passes when the query is wrong. Use mocks only to assert a side effect happened.",
        "Inject the clock, so a test can freeze time rather than asserting \"roughly now\".",
        "Compose everything once at startup, so routes, tests and Day 24's worker all receive the same constructed services.",
        "Measured: importing one feature through a 120-module barrel file took 409ms against 4ms direct, a 100x difference.",
        "A barrel file makes every import of anything an import of everything.",
        "That cost lands on Day 28's cold start, on every test file's startup, and on any script wanting one helper.",
        "Barrels also create cycle risk, producing a partially initialised module rather than an error.",
        "Keep a barrel at the package boundary only, and never import through it from inside the same package.",
      ],
      commonMistakes: [
        "Constructing a database pool at module scope, so importing the file for a unit test connects to a database.",
        "Reaching for a DI framework when a factory function does the same thing.",
        "Claiming testable architecture makes tests dramatically faster. Measured it was 60ms against 100ms.",
        "Testing business rules through HTTP, which needs so much setup that the test does not get written.",
        "Asserting the exact SQL string a service produced, which breaks on refactors and passes on wrong queries.",
        "Using `new Date()` inside business logic, so tests cannot assert an exact result.",
        "Constructing services inside route handlers rather than once at startup.",
        "Letting Day 24's worker build its own copy of the rules instead of using the same service.",
        "Importing through a barrel file inside the same package, measured at 409ms against 4ms.",
        "Adding a barrel file for convenience and paying its cost on every cold start and every test file.",
      ],
      quiz: [
        {
          question: "What is the main argument for dependency injection?",
          options: [
            "It makes tests dramatically faster",
            "A component states what it needs, so the dependency graph is visible instead of hidden inside modules that grab their own dependencies",
            "It is required by frameworks",
            "It reduces memory",
          ],
          correctIndex: 1,
          explanation:
            "The measured test-speed difference was 60ms against 100ms, so speed is the weaker argument.",
        },
        {
          question: "What is the honest reason to test business logic directly rather than through HTTP?",
          options: [
            "It is ten times faster",
            "The setup: an object literal against a server, a database, a seeded user and a token. The direct test gets written; the HTTP one gets skipped.",
            "HTTP tests are unreliable",
            "There is no reason",
          ],
          correctIndex: 1,
          explanation:
            "Measured, the speed difference was 60ms against 100ms for 60 assertions, which is not the order of magnitude usually claimed.",
        },
        {
          question: "Why prefer a fake repository over a mock?",
          options: [
            "Fakes are faster",
            "A fake asserts the outcome, while a mock asserts the mechanism, so a mock fails when you refactor and passes when the query is wrong",
            "Mocks are deprecated",
            "Fakes need less code",
          ],
          correctIndex: 1,
          explanation:
            "Mocks are right for asserting a side effect happened, such as an email being enqueued exactly once.",
        },
        {
          question: "What did importing one feature through a 120-module barrel file cost?",
          options: [
            "The same as a direct import",
            "409ms against 4ms direct, because the barrel loaded all 120 modules for the one feature",
            "About twice as long",
            "It failed",
          ],
          correctIndex: 1,
          explanation:
            "That 100x lands on Day 28's cold start, on every test file's startup, and on any script wanting one helper.",
        },
        {
          question: "Why is constructing a pool at module scope a problem?",
          options: [
            "It is slower",
            "Importing the file for any reason opens a connection, so an unrelated unit test connects to a database and a missing env var crashes at import",
            "Pools cannot be shared",
            "It leaks memory",
          ],
          correctIndex: 1,
          explanation:
            "Compose dependencies once at startup instead, so a test can pass fakes and the worker can pass the real ones.",
        },
      ],
    },
    {
      id: "monolith-and-boundaries",
      title: "Monolith, modules, and when to split",
      durationMinutes: 12,
      explanation:
        "## Monolith first\n\n<b>Monolith</b> (one deployable unit). <b>Microservices</b> (many independently deployed services).\n\n> The reason to start with a monolith is not that it is simpler to write, it is that <b>a module boundary you got wrong is a refactor and a service boundary you got wrong is a migration</b>. Early on you do not know where the seams are, and a monolith lets you move them for free.\n\n---\n\n## What splitting actually costs\n\n> The list people quote is networking, retries and service discovery. The two that hurt more:\n>\n> <b>Every in-process call becomes a network call that can fail.</b> `orders.create()` cannot half-succeed. `POST /orders` can time out after the order was created, so every caller now needs Day 22's timeouts, Day 22's retries, and idempotency keys so a retry does not double-charge.\n>\n> <b>You lose transactions.</b> Day 17's `db.transaction` covering the stock decrement and the order insert stops being possible once those live in different services. You are choosing between eventual consistency and a saga, and both are considerably more code than the transaction was.\n>\n> So microservices solve <b>organisational</b> problems: many teams needing to deploy without coordinating. They do not solve \"the codebase is big\".\n\n---\n\n## Modular monolith\n\n<b>Modular monolith</b> (one deployment, strongly separated internal modules).\n\n```text\nsrc/modules/\n  orders/     index.ts exports the public surface\n  payments/\n  users/\n```\n\n> The thing that makes it real rather than aspirational: <b>a module may only import another module's `index.ts`</b>, never its internals. Enforce that with a test, because it is the rule everyone breaks at 5pm on a Friday.\n>\n> Get that right and a later split is mechanical. Get it wrong and you have a monolith with extra folders.\n\n---\n\n## Feature folders over layer folders\n\n```text\ncontrollers/   services/   repositories/       ✗ at scale\nmodules/orders/  modules/payments/             ✓\n```\n\n> Layer folders mean one change touches three directories and every feature sits next to every other. Feature folders keep a change in one place and make ownership obvious. The layers still exist, they just live <b>inside</b> each feature.\n\n---\n\n## Monorepo and shared types\n\n<b>Monorepo</b> (one repository, several packages).\n\n> Shared types are the usual reason, and they come with a trap worth naming: sharing your <b>database</b> types with the frontend means a column rename is a frontend compile error, and it means your internal schema is now a public contract.\n>\n> Share the <b>response</b> types, which is a contract you intend to keep. Day 16's response schema is where they come from.",
      diagram: `Monolith first

    the reason is NOT that it is simpler to write.

    it is that:

      A MODULE BOUNDARY YOU GOT WRONG IS A
      REFACTOR.

      A SERVICE BOUNDARY YOU GOT WRONG IS A
      MIGRATION.

    early on you do not know where the seams are,
    and a monolith lets you move them for FREE.


⚠⚠ What splitting actually costs

    the quoted list: networking, retries, service
    discovery.

    the two that hurt MORE:

    1. EVERY IN-PROCESS CALL BECOMES A NETWORK
       CALL THAT CAN FAIL.

       orders.create() cannot half-succeed.

       POST /orders CAN time out AFTER the order
       was created.

       → every caller now needs Day 22's timeouts,
         Day 22's retries, and IDEMPOTENCY KEYS so
         a retry does not double-charge

    2. YOU LOSE TRANSACTIONS.

       Day 17's db.transaction covering the stock
       decrement AND the order insert stops being
       possible once they live in different
       services.

       → you are choosing between eventual
         consistency and a SAGA

       → both are considerably more code than the
         transaction was

    ⚠ so microservices solve ORGANISATIONAL
      problems: many teams deploying without
      coordinating.

      they do NOT solve "the codebase is big".


Modular monolith

    src/modules/
      orders/     index.ts = the public surface
      payments/
      users/

    ⚠ what makes it REAL rather than aspirational:

      A MODULE MAY ONLY IMPORT ANOTHER MODULE'S
      index.ts. NEVER ITS INTERNALS.

      enforce it with a TEST, because it is the
      rule everyone breaks at 5pm on a Friday.

    get it right → a later split is MECHANICAL
    get it wrong → a monolith with extra folders


Feature folders over layer folders

    ✗ controllers/  services/  repositories/
        one change touches THREE directories, and
        every feature sits next to every other

    ✓ modules/orders/  modules/payments/
        a change stays in ONE place, ownership is
        obvious

    the layers still exist. they live INSIDE each
    feature.


Monorepo and shared types

    ⚠ the trap worth naming:

      sharing your DATABASE types with the
      frontend means

        a column rename is a FRONTEND COMPILE
        ERROR

        and your internal schema is now a PUBLIC
        CONTRACT

    ✓ share the RESPONSE types, which is a
      contract you intend to keep.

      Day 16's response schema is where they come
      from.`,
      codeExample: {
        title: "Module boundaries you can enforce",
        code: `// ── The layout ──────────────────────────────────────────────
//   src/
//     modules/
//       orders/
//         index.ts            ← the ONLY thing others may import
//         order-service.ts
//         order-repository.ts
//         order-routes.ts
//         pricing.ts
//       payments/
//         index.ts
//         ...
//       users/
//         index.ts
//         ...
//     platform/               ← shared infrastructure, no domain
//       db.ts  logger.ts  config.ts  errors.ts
//     app.ts


// ── ✓ The public surface, chosen deliberately ───────────────
// modules/orders/index.ts
export { createOrderService } from "./order-service.js";
export { orderRoutes } from "./order-routes.js";
export type { Order, OrderLine } from "./types.js";
//
// Note what is NOT exported: the repository and the pricing
// function. Another module cannot reach into the orders table
// or re-implement pricing, which is the boundary doing its
// job.


// ── ✗ The import that dissolves the boundary ────────────────
// modules/payments/payment-service.js
import { orderRepository } from "../orders/order-repository.js";
//                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ⚠
//
// It works, it is one line, and it is how a modular monolith
// becomes a normal monolith. Now payments queries the orders
// table directly, so:
//   - changing the orders schema breaks payments silently
//   - an order invariant enforced in order-service is bypassed
//   - and splitting orders into a service later is no longer
//     mechanical, because payments does not go through any
//     interface you can replace with an HTTP call

// ✓ Go through the surface:
import { createOrderService } from "../orders/index.js";


// ── ⚠ Enforce it, because convention will not hold ──────────
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir) {
  return readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".ts") ? [p] : [];
  });
}

test("modules only import each other through index.ts", () => {
  const modules = readdirSync("src/modules");
  const violations = [];

  for (const mod of modules) {
    for (const file of walk(join("src/modules", mod))) {
      const src = readFileSync(file, "utf8");
      for (const m of src.matchAll(/from "\\.\\.\\/([\\w-]+)\\/(.+?)"/g)) {
        const [, other, path] = m;
        if (other === mod || !modules.includes(other)) continue;
        if (path !== "index.js" && path !== "index.ts") {
          violations.push(\`\${file} reaches into \${other}/\${path}\`);
        }
      }
    }
  }

  assert.deepEqual(violations, [], violations.join("\\n"));
});

test("no module imports another module's repository", () => {
  for (const file of walk("src/modules")) {
    const mod = file.split("/")[2];
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(/from ".*?modules\\/([\\w-]+)\\/.*?repository/g)) {
      assert.equal(m[1], mod, \`\${file} imports \${m[1]}'s repository\`);
    }
  }
});
// This is 30 lines that keep a decision you made in month one
// alive in month eighteen. Without it the boundary lasts
// until the first deadline.


// ── ⚠⚠ What you lose when you actually split ────────────────
// In the monolith, this is one transaction and cannot half
// happen:
await db.transaction(async (tx) => {
  await products.decrementStock(tx, items);
  const order = await orders.insert(tx, { userId, total });
  await payments.charge(tx, { orderId: order.id, amount: total });
  return order;
});
// Either all three, or none.

// Split into services, the same thing becomes:
const order = await orders.create({ userId, items });        // service A
try {
  await payments.charge({ orderId: order.id, amount: total }); // service B
} catch (err) {
  // ⚠ Now what? The order exists and is unpaid.
  await orders.cancel(order.id);
  //    ^^^^^^^^^^^^^ and THIS can fail too, so you need a
  //    compensating job that finds unpaid orders and cancels
  //    them, plus an idempotency key so a retried charge does
  //    not bill twice, plus a way to tell "not charged yet"
  //    from "charge succeeded but the response was lost".
  throw err;
}
// That is a saga, and it is a lot of code and a lot of new
// failure modes to replace one keyword. It is the right trade
// when two teams need to deploy independently, and it is a
// bad trade to reduce file count.


// ── Shared types, and the boundary that matters ─────────────
// ✗ packages/db-types, shared with the frontend:
export type UserRow = {
  id: string;
  email: string;
  password_hash: string;       // ⚠ in a package the frontend imports
  internal_risk_score: number; // ⚠ and this
  created_at: Date;
};
// Two problems. Your internal schema is now a public contract,
// so a column rename is a frontend compile error. And Day 16's
// warning: fields you never meant to expose are now named in
// frontend code, one autocomplete away from a response.

// ✓ packages/api-types, derived from the response contract:
export type UserResponse = {
  id: string;
  email: string;
  name: string;
  createdAt: string;           // ISO, because JSON has no Date
};
// This is a promise you intend to keep, and it is exactly
// Day 16's response schema. Generate one from the other so
// they cannot drift:
export const userResponseSchema = {
  type: "object",
  required: ["id", "email", "name", "createdAt"],
  properties: {
    id: { type: "string" }, email: { type: "string" },
    name: { type: "string" }, createdAt: { type: "string" },
  },
} as const;
// Day 16 verified the schema strips undeclared fields, so
// password_hash cannot leave even if the query returns it.
// The type and the runtime guarantee come from one place.


// ── When a split is actually indicated ──────────────────────
// ✓ Different scaling shape: an image processor that needs
//   CPU and no database, versus an API that needs the
//   opposite. Day 11's worker threads first, then a service.
// ✓ Different availability requirement: payments must stay up
//   when the reporting endpoint is melting.
// ✓ Different deploy cadence, driven by different teams.
// ✓ A hard compliance boundary.
//
// ✗ "The repo is big."
// ✗ "Services are best practice."
// ✗ "This module feels separate."
//
// And the sequence that works: make it a module, enforce the
// boundary, keep it enforced for six months. If the boundary
// held with no violations, the split is mechanical. If it did
// not hold, you just learned it was the wrong boundary, for
// the price of a refactor instead of a migration.`,
      },
      keyTakeaways: [
        "Start with a monolith because a wrong module boundary is a refactor and a wrong service boundary is a migration.",
        "Splitting turns every in-process call into a network call that can fail after succeeding, so callers need timeouts, retries and idempotency keys.",
        "Splitting also removes transactions, so the stock decrement and the order insert become a saga with new failure modes.",
        "A saga is considerably more code than the transaction it replaces, which is why microservices solve organisational problems, not big codebases.",
        "A modular monolith is real only if a module may import another module's `index.ts` and nothing else.",
        "Enforce that with a test, because it is the rule everyone breaks under deadline.",
        "One import of another module's repository silently couples you to its schema and bypasses its invariants.",
        "It also makes a later split non-mechanical, because there is no interface to replace with an HTTP call.",
        "Feature folders beat layer folders at scale: a change stays in one directory and ownership is obvious.",
        "The layers still exist in a feature-folder layout, they just live inside each feature.",
        "Do not share database types with the frontend: it makes your internal schema a public contract and names fields you never meant to expose.",
        "Share response types instead, derived from Day 16's response schema, which is a contract you intend to keep.",
        "Generate the type and the runtime schema from one source so they cannot drift.",
        "A split is indicated by a different scaling shape, availability requirement, deploy cadence or compliance boundary. Not by repository size.",
        "The sequence that works: make it a module, enforce the boundary, and if it holds for six months the split is mechanical.",
      ],
      commonMistakes: [
        "Splitting into services to reduce codebase size, which buys network failure modes and loses transactions.",
        "Forgetting that a network call can time out after succeeding, so a retry double-charges without an idempotency key.",
        "Assuming a distributed transaction is available, when the real options are eventual consistency or a saga.",
        "Declaring a modular monolith and then importing another module's internals, which dissolves the boundary in one line.",
        "Relying on convention rather than a test to keep module boundaries.",
        "Importing another module's repository, which couples you to its schema and bypasses its rules.",
        "Layer folders in a large application, so one change touches three directories.",
        "Sharing database row types with the frontend, exposing `password_hash` in a package the frontend imports.",
        "Maintaining a shared type and a response schema separately, so they drift.",
        "Splitting a module that has never had its boundary enforced, which is how you discover it was the wrong boundary during a migration.",
      ],
      quiz: [
        {
          question: "Why start with a monolith?",
          options: [
            "It performs better",
            "A wrong module boundary is a refactor, while a wrong service boundary is a migration, and early on you do not know where the seams are",
            "Microservices need Kubernetes",
            "It is easier to write",
          ],
          correctIndex: 1,
          explanation:
            "A monolith lets you move boundaries for free, which is exactly what you need while you are still learning the domain.",
        },
        {
          question: "What are the two costs of splitting that hurt most?",
          options: [
            "Networking and service discovery",
            "Every call can fail after succeeding, so you need idempotency keys, and you lose transactions, so atomic writes become a saga",
            "Deployment complexity and monitoring",
            "Latency and cost",
          ],
          correctIndex: 1,
          explanation:
            "A saga is considerably more code than the transaction it replaces, and it adds failure modes rather than removing them.",
        },
        {
          question: "What makes a modular monolith real rather than aspirational?",
          options: [
            "Separate folders",
            "A module may only import another module's `index.ts`, enforced by a test rather than by convention",
            "A build step per module",
            "Separate databases",
          ],
          correctIndex: 1,
          explanation:
            "One import of another module's repository dissolves the boundary and makes a later split non-mechanical.",
        },
        {
          question: "Why not share database types with the frontend?",
          options: [
            "TypeScript cannot do it",
            "It makes your internal schema a public contract, so a column rename is a frontend compile error, and it names fields like `password_hash` in frontend code",
            "Types are too large",
            "It slows the build",
          ],
          correctIndex: 1,
          explanation:
            "Share response types derived from Day 16's response schema, which is a contract you intend to keep.",
        },
        {
          question: "What actually indicates a service split?",
          options: [
            "A large repository",
            "A different scaling shape, availability requirement, deploy cadence, or a compliance boundary",
            "More than five modules",
            "Team preference",
          ],
          correctIndex: 1,
          explanation:
            "Make it a module first and enforce the boundary. If it holds for six months the split is mechanical; if not, you learned it was wrong cheaply.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the test for whether logic belongs in a route handler?",
      options: [
        "Whether it is over 50 lines",
        "Whether a queue message or cron job could trigger it. If yes, it belongs in a service.",
        "Whether it touches the database",
        "Whether it needs validation",
      ],
      correctIndex: 1,
      explanation:
        "Day 24's worker cannot call an HTTP handler, so a rule living there is silently skipped by every other entry point.",
    },
    {
      question: "Where does resource-ownership authorisation belong?",
      options: [
        "Route middleware",
        "The service, because the check needs the resource and a route only knows the URL",
        "The repository",
        "The database",
      ],
      correctIndex: 1,
      explanation:
        "A route can answer \"who is this\". Only the service can answer \"may this user do this to this thing\".",
    },
    {
      question: "Why should a repository method take a transaction rather than open one?",
      options: [
        "Speed",
        "So the service can decide which writes must succeed together. One that opens its own cannot join somebody else's unit of work.",
        "Transactions are expensive",
        "To avoid deadlocks",
      ],
      correctIndex: 1,
      explanation:
        "The service owns the unit of work because it is what knows the writes belong together.",
    },
    {
      question: "Why does MVC not transfer to a Node API?",
      options: [
        "Node does not support it",
        "There is no view, so \"controller\" duplicates \"route\" and \"model\" means the database row, the domain object and the response shape at once",
        "It needs templates",
        "It transfers fine",
      ],
      correctIndex: 1,
      explanation:
        "Those three are genuinely different, and conflating them causes a lot of API mess.",
    },
    {
      question: "When should you introduce a service layer?",
      options: [
        "From the first file",
        "When the same rule is needed by a route and a job",
        "Never for small apps",
        "Past 200 lines",
      ],
      correctIndex: 1,
      explanation:
        "Layers cost indirection. Three files with one function each for one behaviour buys nothing.",
    },
    {
      question: "What is the main argument for dependency injection?",
      options: [
        "Much faster tests",
        "A component states what it needs, so the dependency graph is visible rather than hidden in modules grabbing their own",
        "Frameworks require it",
        "Lower memory",
      ],
      correctIndex: 1,
      explanation:
        "The measured test-speed difference was 60ms against 100ms, so speed is the weaker argument.",
    },
    {
      question: "What is the honest reason to test business logic directly?",
      options: [
        "It is ten times faster",
        "Setup: an object literal against a server, a database, a seeded user and a token. The direct test gets written; the HTTP one gets skipped.",
        "HTTP tests are flaky",
        "No reason",
      ],
      correctIndex: 1,
      explanation:
        "Measured, 60 assertions took about 60ms directly and 100ms through HTTP, not the order of magnitude usually claimed.",
    },
    {
      question: "Why prefer a fake over a mock?",
      options: [
        "Fakes are faster",
        "A fake asserts the outcome; a mock asserts the mechanism, so it fails on refactors and passes when the query is wrong",
        "Mocks are deprecated",
        "Less code",
      ],
      correctIndex: 1,
      explanation:
        "Mocks are right for asserting a side effect happened, like an email enqueued exactly once.",
    },
    {
      question: "What did importing one feature through a 120-module barrel file cost?",
      options: [
        "The same as direct",
        "409ms against 4ms, because the barrel loaded all 120 modules for the one feature",
        "Twice as long",
        "It failed",
      ],
      correctIndex: 1,
      explanation:
        "That 100x lands on Day 28's cold start, on every test file's startup, and on any script wanting one helper.",
    },
    {
      question: "Why is constructing a pool at module scope a problem?",
      options: [
        "It is slower",
        "Importing the file for any reason opens a connection, so an unrelated unit test hits a database and a missing env var crashes at import",
        "Pools cannot be shared",
        "It leaks",
      ],
      correctIndex: 1,
      explanation:
        "Compose once at startup, so tests get fakes and Day 24's worker gets the real ones.",
    },
    {
      question: "Why start with a monolith?",
      options: [
        "Better performance",
        "A wrong module boundary is a refactor; a wrong service boundary is a migration",
        "Microservices need Kubernetes",
        "It is easier to write",
      ],
      correctIndex: 1,
      explanation:
        "A monolith lets you move boundaries for free while you are still learning the domain.",
    },
    {
      question: "What are the two costs of splitting that hurt most?",
      options: [
        "Networking and discovery",
        "A call can fail after succeeding, so you need idempotency keys, and you lose transactions, so atomic writes become a saga",
        "Deployment and monitoring",
        "Latency and cost",
      ],
      correctIndex: 1,
      explanation:
        "A saga is more code than the transaction it replaces and adds failure modes rather than removing them.",
    },
    {
      question: "What makes a modular monolith real?",
      options: [
        "Separate folders",
        "A module may only import another module's `index.ts`, enforced by a test rather than convention",
        "A build step per module",
        "Separate databases",
      ],
      correctIndex: 1,
      explanation:
        "One import of another module's repository dissolves the boundary and makes a later split non-mechanical.",
    },
    {
      question: "Why not share database types with the frontend?",
      options: [
        "TypeScript cannot",
        "Your internal schema becomes a public contract, and fields like `password_hash` get named in frontend code",
        "Types are large",
        "Build speed",
      ],
      correctIndex: 1,
      explanation:
        "Share response types from Day 16's schema, which strips undeclared fields and is a contract you intend to keep.",
    },
    {
      question: "What actually indicates a service split?",
      options: [
        "A large repository",
        "A different scaling shape, availability requirement, deploy cadence, or compliance boundary",
        "More than five modules",
        "Preference",
      ],
      correctIndex: 1,
      explanation:
        "Make it a module, enforce the boundary, and if it holds for six months the split is mechanical.",
    },
    {
      question: "Why do feature folders beat layer folders at scale?",
      options: [
        "Fewer files",
        "A change stays in one directory and ownership is obvious, while layer folders spread one change across three",
        "Faster builds",
        "Better for TypeScript",
      ],
      correctIndex: 1,
      explanation:
        "The layers still exist, they just live inside each feature.",
    },
    {
      question: "What does a service layer mean by \"must not know HTTP exists\"?",
      options: [
        "It cannot make requests",
        "No `request`, no `reply`, no status codes, so a queue worker and a cron job can call the same rules",
        "It cannot be async",
        "It needs no validation",
      ],
      correctIndex: 1,
      explanation:
        "A service taking a Fastify request has become a route with extra steps.",
    },
    {
      question: "Why inject the clock into business logic?",
      options: [
        "Performance",
        "So a test can freeze time and assert an exact result rather than \"roughly now\"",
        "Timezone support",
        "It is not needed",
      ],
      correctIndex: 1,
      explanation:
        "Same principle as the repository: state what you depend on rather than reaching for a global.",
    },
    {
      question: "What is the risk a barrel file adds beyond load time?",
      options: [
        "None",
        "Cycles: feature A imports the index to reach B, the index imports A, and you get a partially initialised module rather than an error",
        "Type errors",
        "Larger bundles only",
      ],
      correctIndex: 1,
      explanation:
        "Keep a barrel at the package boundary and never import through it from inside the same package.",
    },
    {
      question: "What should you do before splitting a module into a service?",
      options: [
        "Write a design doc",
        "Enforce its boundary with a test for six months. If it held, the split is mechanical; if not, you learned it was wrong cheaply.",
        "Duplicate the database",
        "Add an API gateway",
      ],
      correctIndex: 1,
      explanation:
        "A boundary that has never been enforced is not a boundary, and you find that out during the migration.",
    },
  ],
  project: {
    name: "day-29",
    goal: "Refactor one messy endpoint into route, service, repository and a pure domain function, then prove the boundaries hold with tests rather than intentions.",
    brief:
      "Pick the worst endpoint you have, ideally one with a rule that a background job also needs. The interesting part of this project is not the refactor, it is the two measurements at the end: the barrel file cost and whether your boundary tests actually catch a violation you introduce on purpose. A boundary nobody tests is a comment.",
    steps: [
      "Pick one endpoint with at least three business rules, a database write and a side effect. Copy it somewhere as a baseline.",
      "List every rule it enforces, then check whether Day 24's worker or any other entry point enforces the same ones. Write down what you find.",
      "Extract the pure calculation into a `domain/` function with no database, HTTP, clock or randomness.",
      "Write unit tests for that function covering every branch, using object literals only.",
      "Time that test file. Then write the same assertions as HTTP tests against a running server and time those. Record both.",
      "Extract every query into a repository, with methods that take a transaction rather than opening one.",
      "Find and fix the N+1 that becomes visible once queries are in one place.",
      "Extract the rules into a service that takes its dependencies as an argument and imports nothing from Fastify.",
      "Move the resource-ownership authorisation check from the route into the service and confirm the route no longer needs the resource.",
      "Put the writes in a service-owned transaction, and move the side effect after the commit onto a queue.",
      "Reduce the route to validation, auth, status code and response shape.",
      "Point Day 24's worker at the same service and confirm it now enforces every rule you listed in step 2.",
      "Inject the clock and rewrite any test that asserted \"roughly now\".",
      "Write a fake repository and rewrite one test that used a mock, then note what each test would catch that the other would not.",
      "Add a test that fails if anything in `services/` imports Fastify or touches `request` or `reply`.",
      "Add a test that fails if anything in `domain/` imports outside `domain/`.",
      "Deliberately violate each rule, confirm both tests fail, then revert.",
      "Reorganise into `modules/<feature>/` with an `index.ts` per module and layers inside each.",
      "Move shared infrastructure into `platform/` and confirm no domain code lives there.",
      "Add a test that fails if one module imports another module's non-index file.",
      "Deliberately import another module's repository, confirm the test fails, then revert.",
      "Build a barrel `index.ts` that re-exports every module, then measure the time to import one module through it versus directly.",
      "Record how many modules load in each case.",
      "Check whether any of your own imports go through a barrel, and fix them.",
      "Create a shared types package containing your response types, derived from Day 16's response schemas.",
      "Deliberately add a database row type with a `password_hash` field to that package and write down what would now be one autocomplete away.",
      "Remove it and generate the response types from the schema instead, so they cannot drift.",
      "Write the report: the rules the worker was missing, the two test timings, the barrel measurement, and the four boundary tests with proof each one fails when violated.",
    ],
    acceptance: [
      "The pure domain function has no imports outside `domain/`, enforced by a passing test.",
      "You have the rule list from step 2 and can say which ones the worker was silently skipping.",
      "The worker now calls the same service and enforces all of them.",
      "You have timings for the same assertions as unit tests and as HTTP tests, and you state which argument for the refactor your numbers actually support.",
      "Every query lives in a repository, and repository methods take a transaction rather than opening one.",
      "The N+1 you found is fixed and you can point at what made it visible.",
      "Authorisation happens in the service, and the route does not load the resource.",
      "Writes are in one service-owned transaction and the side effect is queued after commit.",
      "Nothing in `services/` imports Fastify or references `request` or `reply`.",
      "One module cannot import another module's non-index file.",
      "You deliberately violated all four boundary rules and have the failing output for each.",
      "You have the barrel-versus-direct import timing and the module-load counts.",
      "No import in your own code goes through a barrel inside the same package.",
      "The shared package contains response types only, generated from the response schemas.",
      "You can state what sharing a database row type would have exposed.",
      "`npx tsc --noEmit` passes and the full test suite passes.",
    ],
    stretch: [
      "Add a dependency-graph check that fails if any cycle exists between modules.",
      "Measure your application's total startup time before and after removing barrel imports.",
      "Write the same endpoint as a real service split with an HTTP call, then implement the compensating logic for a charge that succeeds but whose response is lost.",
      "Add idempotency keys to that split version and prove a retried request does not double-charge.",
      "Count the lines the saga needed versus the single transaction it replaced.",
      "Generate your response types from the Fastify schemas at build time and add a CI check that they are up to date.",
      "Add a test that fails if a route handler exceeds 15 lines.",
      "Track which modules import which over ten commits and see whether the boundaries drifted.",
      "Extract one module into its own package in a workspace and see what breaks.",
      "Write an architecture decision record for one boundary you chose, including what would make you change it.",
    ],
  },
};
