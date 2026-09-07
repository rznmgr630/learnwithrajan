import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_22_LESSONS: LessonDay = {
  day: 22,
  title: "Error handling in a real application",
  totalMinutes: 96,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "one-error-contract",
      title: "One error contract, and custom error classes",
      durationMinutes: 12,
      explanation:
        "A production application will have errors. The goal is not preventing every one, it is handling them <b>consistently</b>.\n\n```text\nRequest → something fails → error → central handler → one response shape\n```\n\n---\n\n## What happens without a contract\n\n```javascript\nreply.status(500).send({ error: error.message });\nreply.status(500).send({ message: \"Something went wrong\" });\nreply.status(400).send({ success: false, error: error.message });\n```\n\n> Three shapes, and the cost lands on somebody else. Every client now needs three code paths to find out what went wrong, so in practice it writes none of them and shows \"an error occurred\". Your API's error handling is only as good as the <b>worst</b> shape it emits, because that is the one a client gives up on.\n\n---\n\n## Custom error class\n\n<b>Custom error class</b> (your own error type representing a specific kind of application failure).\n\n```javascript\nclass NotFoundError extends Error {\n  constructor(message) {\n    super(message);\n    this.statusCode = 404;\n  }\n}\n```\n\n> The point is not tidier `throw` statements, it is that <b>the thrower and the responder can be different code</b>. A service four layers down knows the user does not exist and knows nothing about HTTP. A central handler knows about HTTP and nothing about users. The error class is the message between them.\n\n---\n\n## Two things that class gets wrong\n\nVerified, and both are easy to miss.\n\n> <b>The name is wrong.</b> `new NotFoundError(\"User not found\").name` is <b>`\"Error\"`</b>, not `\"NotFoundError\"`. `Error`'s constructor sets `name` from `Error.prototype`, and subclassing does not change it. So your logs say `Error`, your error tracker groups every custom error together, and `err.name === \"NotFoundError\"` never matches.\n>\n> The fix is one line in the base class: `this.name = this.constructor.name`. Verified to then report `NotFoundError`.\n>\n> <b>It does not serialise.</b> Verified: `JSON.stringify(err)` gives `{\"statusCode\":404}` and nothing else. `message` and `stack` are <b>non-enumerable</b> on `Error`, which is the same root cause as Day 21's Pino finding. So spreading an error into a response body, or passing it to anything that stringifies, silently discards the message.\n\n---\n\n## `error.cause`\n\n```javascript\nthrow new NotFoundError(\"User not found\", { cause: dbError });\n```\n\nVerified: `err.cause.message` returns the original.\n\n> This is what lets you have both things Day 22 needs. The client gets a safe, deliberate message; your logs get the real failure underneath, with its stack. Without `cause` you either lose the underlying error or you put its text in the message and leak it.\n\n---\n\n## A base class worth copying\n\n```javascript\nclass AppError extends Error {\n  constructor(message, { statusCode = 500, code, cause } = {}) {\n    super(message, { cause });\n    this.name = this.constructor.name;\n    this.statusCode = statusCode;\n    this.code = code;\n  }\n}\n```\n\n> One base class, then one small subclass per failure kind. The reason to keep the subclasses tiny is that a class hierarchy is a taxonomy, and taxonomies grow: if `NotFoundError` needs three constructor arguments, that logic belongs in the service that throws it, not in the error.",
      diagram: `Request → fails → error → CENTRAL handler
                              → one response shape


What happens without a contract

    reply.status(500).send({ error: e.message })
    reply.status(500).send({ message: "..." })
    reply.status(400).send({ success: false, ... })

    three shapes, and the cost lands on SOMEBODY
    ELSE.

    every client needs three code paths to find
    out what went wrong, so in practice it writes
    NONE of them and shows "an error occurred".

    → your API's error handling is only as good as
      the WORST shape it emits, because that is
      the one a client gives up on.


Custom error class: a MESSAGE BETWEEN LAYERS

    the point is not tidier throws.

    it is that THE THROWER AND THE RESPONDER CAN
    BE DIFFERENT CODE.

      a service four layers down knows the user
      does not exist, and nothing about HTTP

      a central handler knows about HTTP, and
      nothing about users

    the error class is what passes between them.


⚠⚠ Two things the obvious class gets wrong

    class NotFoundError extends Error {
      constructor(m) { super(m); this.statusCode = 404; }
    }

    1. THE NAME IS WRONG

       new NotFoundError("x").name  →  "Error"
                                       (verified)

       Error's constructor sets name from
       Error.prototype, and subclassing does not
       change it.

       so:
         your logs say Error
         your error tracker groups EVERY custom
           error together
         err.name === "NotFoundError" never
           matches

       fix, one line:
         this.name = this.constructor.name
       verified → "NotFoundError"

    2. IT DOES NOT SERIALISE

       JSON.stringify(err)  →  {"statusCode":404}
                               (verified)

       message and stack are NON-ENUMERABLE on
       Error.

       same root cause as Day 21's Pino finding.

       → spreading an error into a response body,
         or handing it to anything that
         stringifies, silently discards the
         message.


error.cause: how to have both

    throw new NotFoundError("User not found",
      { cause: dbError });

    verified: err.cause.message returns the
    original.

    → the CLIENT gets a safe, deliberate message
      your LOGS get the real failure underneath,
      with its stack

    without cause you either LOSE the underlying
    error or you put its text in the message and
    LEAK it.


A base class worth copying

    class AppError extends Error {
      constructor(message,
        { statusCode = 500, code, cause } = {}) {
        super(message, { cause });
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
      }
    }

    one base, then one TINY subclass per failure
    kind.

    keep them tiny: a class hierarchy is a
    taxonomy, and taxonomies grow. if
    NotFoundError needs three constructor
    arguments, that logic belongs in the SERVICE
    that throws it.`,
      codeExample: {
        title: "An error base class with both pitfalls closed",
        code: `// ── ⚠ The two pitfalls, verified ────────────────────────────
class Naive extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

const n = new Naive("User not found");

n.name;                    // "Error"        ← VERIFIED, not "Naive"
String(n);                 // "Error: User not found"
n instanceof Error;        // true
n instanceof Naive;        // true
JSON.stringify(n);         // {"statusCode":404}   ← VERIFIED
//                            ^^ no message, no stack. Both are
//                            non-enumerable on Error, exactly
//                            like Day 21's pino { error } case.
//
// The name one is the expensive one. In Sentry every custom
// error you ever throw arrives as "Error", grouped into one
// enormous issue, and the whole reason you made classes was
// to tell them apart.


// ── ✓ src/errors.js ─────────────────────────────────────────
export class AppError extends Error {
  constructor(message, { statusCode = 500, code, cause, expose } = {}) {
    super(message, { cause });
    //              ^^^^^^^ keeps the underlying error, with
    //              its stack, without putting its text in
    //              the message a client will see

    this.name = this.constructor.name;
    //   ^^^^ the one line. Verified to give "NotFoundError"
    //   for the subclass below.

    this.statusCode = statusCode;
    this.code = code;             // a stable string for clients
    this.expose = expose ?? statusCode < 500;
    //   ^^^^^^ whether the message is safe to send. Default
    //   from the status, overridable, and the next lesson
    //   shows why the default matters so much.

    // Optional, and worth it: drops the constructor frames so
    // the stack starts where the error was actually thrown.
    Error.captureStackTrace?.(this, this.constructor);
  }
}

// ── One small subclass per failure kind ─────────────────────
export class ValidationError extends AppError {
  constructor(message, issues) {
    super(message, { statusCode: 400, code: "validation_failed" });
    this.issues = issues;
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, { statusCode: 401, code: "unauthorized" });
  }
}
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, { statusCode: 403, code: "forbidden" });
  }
}
export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, { statusCode: 404, code: "not_found" });
  }
}
export class ConflictError extends AppError {
  constructor(message, code = "conflict") {
    super(message, { statusCode: 409, code });
  }
}
export class DependencyError extends AppError {
  constructor(dependency, cause) {
    super(\`\${dependency} is unavailable\`, {
      statusCode: 503,
      code: "dependency_unavailable",
      cause,
      expose: false,
      //      ^^^^^ explicit. The next lesson verifies that
      //      Fastify would otherwise send this message, and a
      //      503 from a database driver contains its host.
    });
    this.dependency = dependency;
  }
}

new NotFoundError("User not found").name;      // "NotFoundError"  ← verified


// ── Why cause is the whole trick ────────────────────────────
// services/users.js
export async function findUser(db, id) {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) throw new NotFoundError("User not found");
    return user;
  } catch (err) {
    if (err instanceof AppError) throw err;      // already ours

    // A driver error. Wrap it: the client learns nothing, and
    // we lose nothing.
    throw new DependencyError("database", err);
  }
}
//
// Verified that cause survives:
//
//   err.message          "database is unavailable"
//   err.cause.message    "connect ECONNREFUSED 10.0.1.42:5432"
//
// So the log line gets the second one and the response gets
// the first. Without cause you would have to choose.
//
// And pino serialises the chain, because Day 21's err
// serializer walks cause:
//
//   log().error({ err }, "findUser failed");
//     "err": { "type": "DependencyError",
//              "message": "database is unavailable",
//              "stack": "...",
//              "cause": { "type": "Error",
//                         "message": "connect ECONNREFUSED ...",
//                         "stack": "..." } }


// ── ⚠ And the serialisation trap in practice ────────────────
// ✗ Every one of these loses the message:
reply.send({ ...err });                    // {"statusCode":404}
reply.send(err);                           // {"statusCode":404}
JSON.stringify({ error: err });            // {"error":{"statusCode":404}}
res.json(err);                             // same

// ✓ Build the body deliberately. Which is the next two
//   lessons, and this is the reason:
reply.code(err.statusCode).send({
  code: err.code,
  message: err.expose ? err.message : "Internal Server Error",
});


// ── One rule for the taxonomy ───────────────────────────────
// ✗ Do not do this:
//     class UserNotFoundError extends NotFoundError {}
//     class OrderNotFoundError extends NotFoundError {}
//     class InvoiceNotFoundError extends NotFoundError {}
//     class LineItemNotFoundError extends NotFoundError {}
//
//   Four classes that differ only in a string. The message
//   already carries that, and the \`code\` field carries the
//   machine-readable version.
//
// ✓ throw new NotFoundError("User not found");
//   throw new NotFoundError("Order not found");
//
// Add a class when a HANDLER needs to treat it differently.
// If nothing branches on it, it is a message, not a type.`,
      },
      keyTakeaways: [
        "Three error shapes means clients write zero of the three code paths, so your API is as good as the worst shape it emits.",
        "A custom error class exists so the thrower and the responder can be different code: a service knows the user is missing, the handler knows about HTTP.",
        "Verified: `class NotFoundError extends Error` without `this.name` reports `name` as `\"Error\"`.",
        "So logs say `Error`, an error tracker groups every custom error into one issue, and `err.name === \"NotFoundError\"` never matches.",
        "The fix is `this.name = this.constructor.name` in the base class. Verified to then report `NotFoundError`.",
        "Verified: `JSON.stringify(err)` gives `{\"statusCode\":404}`, because `message` and `stack` are non-enumerable. Same root cause as Day 21's Pino finding.",
        "So `reply.send(err)` and `{ ...err }` both silently discard the message. Build the response body deliberately.",
        "Verified: `error.cause` preserves the original error, which is what lets the client get a safe message while the logs get the real failure and its stack.",
        "Pino's `err` serializer walks the cause chain, so wrapping loses nothing in your logs.",
        "Put `expose` on the base class, defaulted from the status, so \"is this message safe to send\" is a property rather than a decision repeated per handler.",
        "Add an error class when a handler needs to branch on it. If nothing branches, it is a message, not a type.",
      ],
      commonMistakes: [
        "Subclassing `Error` without setting `this.name`, so every custom error is indistinguishable in logs and error trackers.",
        "`reply.send(err)` or spreading an error into a body, which sends `{\"statusCode\":404}` with no message.",
        "Putting the underlying error's text into your message to avoid losing it, which leaks internals. Use `cause`.",
        "Inventing a different response shape per route, which is the shape a client eventually stops parsing.",
        "One class per resource per status, so you have twelve classes that differ only by a string.",
        "Deciding per-handler whether a message is safe to send, instead of making it a property of the error.",
        "Catching an error, logging it, and rethrowing a new one without `cause`, which loses the original stack entirely.",
      ],
      quiz: [
        {
          question: "What is `new NotFoundError(\"x\").name` for a class that extends `Error` and only sets `statusCode`?",
          options: [
            "`\"NotFoundError\"`",
            "`\"Error\"`, because `Error`'s constructor takes `name` from `Error.prototype` and subclassing does not change it",
            "`undefined`",
            "`\"AppError\"`",
          ],
          correctIndex: 1,
          explanation:
            "Verified. So an error tracker groups every custom error into one issue. Fix it with `this.name = this.constructor.name`.",
        },
        {
          question: "What does `JSON.stringify(err)` produce for that error?",
          options: [
            "The message and stack",
            "`{\"statusCode\":404}`, because `message` and `stack` are non-enumerable on `Error`",
            "`{}`",
            "It throws",
          ],
          correctIndex: 1,
          explanation:
            "Verified, and it is the same root cause as Day 21's Pino `{ error }` finding. So `reply.send(err)` loses the message.",
        },
        {
          question: "What problem does `error.cause` solve?",
          options: [
            "It makes errors serialisable",
            "The client gets a safe deliberate message while your logs keep the real underlying failure and its stack",
            "It sets the status code",
            "It prevents rethrowing",
          ],
          correctIndex: 1,
          explanation:
            "Verified that `err.cause.message` returns the original, and Pino's `err` serializer walks the chain.",
        },
        {
          question: "Why is a custom error class worth having at all?",
          options: [
            "Shorter `throw` statements",
            "So the thrower and the responder can be different code: a service knows the user is missing and nothing about HTTP",
            "Better stack traces",
            "It avoids try/catch",
          ],
          correctIndex: 1,
          explanation:
            "The class is the message between a layer that knows the domain and a layer that knows the protocol.",
        },
        {
          question: "When should you add a new error class?",
          options: [
            "One per resource",
            "When a handler needs to branch on it. If nothing branches, it is a message rather than a type.",
            "One per HTTP status per route",
            "Never, use plain errors",
          ],
          correctIndex: 1,
          explanation:
            "Twelve classes differing only by a string is a taxonomy with no consumers. The message and the `code` field already carry that.",
        },
      ],
    },
    {
      id: "domain-errors-and-mapping",
      title: "Domain errors, and mapping at the boundary",
      durationMinutes: 11,
      explanation:
        "## Domain error\n\n<b>Domain error</b> (an error representing a business rule or business operation that failed).\n\n```text\nCannot cancel an already completed order\n```\n\n> That is not an HTTP problem. It is a fact about orders, and it would still be true in a CLI, a queue worker or a scheduled job. So the layer that knows it should say <b>what happened</b>, and the layer that speaks HTTP should decide <b>what status that is</b>.\n\n---\n\n## Why the split matters practically\n\n```text\nBusiness logic → domain error → HTTP layer → HTTP status\n```\n\n> Two concrete reasons, beyond tidiness.\n>\n> Your service gets called from places that have no status codes. The same `cancelOrder` runs from a route, a queue consumer and an admin script, and a service that throws `new ConflictError()` has quietly decided that everything calling it speaks HTTP.\n>\n> And the mapping is a <b>product decision that changes</b>. Is \"insufficient balance\" a 409 or a 402? Reasonable people disagree, and the answer may change when you add a payment provider. If that decision lives in one table at the boundary, changing it is a one-line diff. If it lives in forty `throw` statements, it is a migration.\n\n---\n\n## Where the status actually comes from\n\nDay 22's base class carries `statusCode`, which looks like it contradicts the split. It does not, and the distinction is worth being precise about.\n\n> A <b>transport-shaped</b> error like `NotFoundError` or `UnauthorizedError` is already about the protocol boundary, so carrying a status is honest. A <b>domain-shaped</b> error like `OrderAlreadyCompleted` should not, because its status is a mapping decision.\n>\n> In practice: throw domain errors from services, and map them to `AppError` subclasses in one place at the HTTP layer. The mapping table is small, readable, and the only file that knows both vocabularies.\n\n---\n\n## The mapping\n\n```text\nUserNotFound            → 404\nOrderAlreadyCompleted   → 409 Conflict\nInsufficientBalance     → 409 Conflict\nValidationFailed        → 400\nRateLimited             → 429\nPaymentDeclined         → 402\n```\n\n> One caution about 409 versus 422. A <b>409 Conflict</b> means the request conflicts with current state, so retrying after the state changes could succeed. A <b>422</b> means the request itself is unprocessable regardless of state. \"Order already completed\" is a 409 because the state is the problem; \"amount must be positive\" is a 400 or 422 because no amount of waiting fixes it. Clients use that difference to decide whether retrying is pointless.\n\n---\n\n## Do not let unmapped errors become 500s\n\n> The failure mode of a mapping table is a domain error nobody added to it, which falls through to a generic 500. That is worse than no table, because a business rule failure now looks like a bug, pages somebody, and appears in your error budget.\n>\n> Two defences. Give the table a default that <b>logs loudly</b> rather than silently, so an unmapped domain error is visible as a gap. And add a test that every exported domain error class has an entry, which turns \"somebody forgot\" into a failing build.",
      diagram: `Domain error: a fact about your BUSINESS

    "cannot cancel an already completed order"

    that is not an HTTP problem. it would still be
    true in a CLI, a queue worker or a cron job.

    → the layer that KNOWS says WHAT HAPPENED
      the layer that speaks HTTP decides WHAT
      STATUS THAT IS


Two practical reasons, beyond tidiness

    1. YOUR SERVICE HAS OTHER CALLERS

       the same cancelOrder runs from
         a route
         a queue consumer
         an admin script

       a service that throws ConflictError has
       quietly decided everything calling it
       speaks HTTP.

    2. THE MAPPING IS A PRODUCT DECISION THAT
       CHANGES

       is "insufficient balance" a 409 or a 402?

       reasonable people disagree, and the answer
       may change when you add a payment
       provider.

       in ONE TABLE at the boundary  → one-line
                                       diff
       in FORTY throw statements     → a
                                       migration


Where the status actually comes from

    Day 22's base class carries statusCode, which
    looks like a contradiction. it is not:

    TRANSPORT-SHAPED errors
      NotFoundError · UnauthorizedError
      already about the protocol boundary
      → carrying a status is honest

    DOMAIN-SHAPED errors
      OrderAlreadyCompleted
      → should NOT carry one. its status is a
        MAPPING DECISION.

    in practice:
      throw DOMAIN errors from services
      map them to AppError subclasses in ONE
        place at the HTTP layer

    that table is the only file that knows both
    vocabularies.


The mapping

    UserNotFound           → 404
    OrderAlreadyCompleted  → 409 Conflict
    InsufficientBalance    → 409 Conflict
    ValidationFailed       → 400
    RateLimited            → 429
    PaymentDeclined        → 402


⚠ 409 vs 422, and why a client cares

    409 Conflict
      the request conflicts with CURRENT STATE
      → retrying after the state changes could
        succeed

    422 Unprocessable
      the request itself is unprocessable
      REGARDLESS of state
      → retrying is pointless

    "order already completed"  → 409
      the STATE is the problem

    "amount must be positive"  → 400 / 422
      no amount of waiting fixes it

    clients use that difference to decide whether
    to retry at all.


⚠⚠ Do not let unmapped errors become 500s

    the failure mode of a mapping table is a
    domain error NOBODY ADDED TO IT, falling
    through to a generic 500.

    that is WORSE than no table:

      a business rule failure now looks like a BUG
      it pages somebody
      it lands in your error budget

    two defences:

      give the default branch a LOUD LOG, so a
      gap is visible

      TEST that every exported domain error class
      has an entry
        → "somebody forgot" becomes a failing
          build`,
      codeExample: {
        title: "Services that know nothing about HTTP",
        code: `// ── src/domain/errors.js — no status codes anywhere ─────────
export class DomainError extends Error {
  constructor(message, { code, cause, ...details } = {}) {
    super(message, { cause });
    this.name = this.constructor.name;     // Day 22's one line
    this.code = code;
    this.details = details;
  }
}

export class UserNotFound extends DomainError {
  constructor(userId) {
    super("User does not exist", { code: "user_not_found", userId });
  }
}
export class OrderAlreadyCompleted extends DomainError {
  constructor(orderId, completedAt) {
    super("Order is already completed", {
      code: "order_already_completed", orderId, completedAt,
    });
  }
}
export class InsufficientBalance extends DomainError {
  constructor(required, available) {
    super("Insufficient balance", {
      code: "insufficient_balance", required, available,
    });
  }
}
//
// Read those three and notice what is missing: no 404, no
// 409, no reply, no request. Nothing here knows HTTP exists.


// ── src/modules/orders/service.js ───────────────────────────
import { and, eq, isNull } from "drizzle-orm";
import { OrderAlreadyCompleted, UserNotFound } from "../../domain/errors.js";

export async function cancelOrder(db, { orderId, userId }) {
  return db.transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
      //          ^^^^^^^^^^^^^^^^^^^^^^ Day 19: ownership in the
      //          query, so "not yours" and "does not exist" are
      //          the same answer
      .for("update");

    if (!order) throw new UserNotFound(userId);

    // The business rule. This is the whole reason this
    // function exists, and it is stated once, here.
    if (order.status === "completed") {
      throw new OrderAlreadyCompleted(order.id, order.completedAt);
    }

    const [cancelled] = await tx
      .update(orders)
      .set({ status: "cancelled", cancelledAt: new Date() })
      .where(eq(orders.id, order.id))
      .returning();

    return cancelled;
  });
}
//
// And now the payoff. The same function, three callers:
//
//   routes/orders.js       needs a 409
//   workers/expire-orders  needs to log and move to the next
//   scripts/bulk-cancel    needs to print a summary line
//
// None of them wants the same response, and none of them had
// to be considered here.


// ── src/http/error-map.js — the only bilingual file ─────────
import {
  AppError, NotFoundError, ConflictError, ValidationError,
} from "../errors.js";
import * as domain from "../domain/errors.js";

const MAP = new Map([
  [domain.UserNotFound,          (e) => new NotFoundError("User not found")],
  [domain.OrderNotFound,         (e) => new NotFoundError("Order not found")],

  // 409, because the STATE is the problem. Retrying after the
  // state changes could succeed, and a client can act on that.
  [domain.OrderAlreadyCompleted, (e) => new ConflictError(
    "Order is already completed", "order_already_completed")],
  [domain.InsufficientBalance,   (e) => new ConflictError(
    "Insufficient balance", "insufficient_balance")],

  // A product decision that lives here, and only here. Change
  // it to 402 and nothing in the domain moves.
  [domain.PaymentDeclined,       (e) => new AppError("Payment was declined", {
    statusCode: 402, code: "payment_declined",
  })],
]);

export function toHttpError(err, log) {
  if (err instanceof AppError) return err;             // already transport-shaped

  for (const [DomainClass, build] of MAP) {
    if (err instanceof DomainClass) return build(err);
  }

  if (err instanceof domain.DomainError) {
    // ⚠ THE FAILURE MODE OF A MAPPING TABLE.
    //
    // A domain error nobody mapped falls to a 500. A business
    // rule failure then looks like a bug: it pages someone, it
    // counts against your error budget, and the client gets an
    // unhelpful 500 for something you understood perfectly.
    //
    // So make the gap LOUD rather than silent.
    log.error({
      err,
      errorName: err.name,
      hint: "unmapped domain error: add it to src/http/error-map.js",
    }, "unmapped domain error reached the HTTP layer");

    return new AppError("Internal Server Error", { statusCode: 500, cause: err });
  }

  return null;      // not ours at all. The next lesson decides.
}


// ── The test that turns "somebody forgot" into a red build ──
import { test } from "node:test";
import assert from "node:assert/strict";

test("every domain error is mapped to an HTTP error", () => {
  const classes = Object.values(domain).filter(
    (v) => typeof v === "function"
      && v.prototype instanceof domain.DomainError,
  );

  for (const C of classes) {
    const mapped = toHttpError(Object.create(C.prototype), silentLog);
    assert.ok(
      mapped && mapped.statusCode !== 500,
      \`\${C.name} has no entry in error-map.js, so it becomes a 500\`,
    );
  }
});
// Worth the ten minutes. Adding a domain error and forgetting
// the mapping is the single most likely way this design goes
// wrong, and it fails silently in production and loudly here.


// ── Using it in a route ─────────────────────────────────────
app.post("/orders/:id/cancel", {
  preHandler: authenticate,
  schema: { params: z.object({ id: z.coerce.number().int().positive() }) },
}, async (request, reply) => {
  const order = await cancelOrder(app.db, {
    orderId: request.params.id,
    userId: request.user.id,
  });
  return reply.send(order);
});
//
// No try/catch. The route describes the happy path, the
// service states the rules, and the central handler and the
// map turn a rule failure into a status. Three files, three
// jobs, and each one readable on its own.


// ── The same service, a caller with no HTTP ─────────────────
// workers/expire-orders.js
for (const order of dueOrders) {
  try {
    await cancelOrder(db, { orderId: order.id, userId: order.userId });
    log().info({ orderId: order.id }, "order expired");
  } catch (err) {
    if (err instanceof domain.OrderAlreadyCompleted) {
      // Expected. Somebody completed it between our query and
      // our update. Not an error for this caller.
      log().debug({ orderId: order.id }, "already completed, skipping");
      continue;
    }
    log().error({ err, orderId: order.id }, "failed to expire order");
  }
}
//
// This caller treats OrderAlreadyCompleted as normal. The
// route treats it as a 409. Same error, two correct
// responses, which is only possible because the service did
// not decide for them.`,
      },
      keyTakeaways: [
        "A domain error is a fact about your business, true in a CLI or a worker as much as in a request.",
        "The layer that knows says what happened; the layer that speaks HTTP decides what status that is.",
        "The practical reason is other callers: a service throwing `ConflictError` has decided everything calling it speaks HTTP.",
        "The second reason is that the mapping is a product decision that changes. One table is a one-line diff; forty `throw` statements are a migration.",
        "Transport-shaped errors like `NotFoundError` may carry a status. Domain-shaped ones like `OrderAlreadyCompleted` should not.",
        "409 means the request conflicts with current state, so retrying later could work. 422 means the request is unprocessable regardless of state.",
        "Clients use that difference to decide whether retrying is pointless, which is why the choice is not cosmetic.",
        "The failure mode of a mapping table is an unmapped domain error becoming a 500, which makes a business rule failure look like a bug and pages someone.",
        "So log the default branch loudly, and test that every exported domain error class has an entry.",
        "The payoff: the same error can be a 409 to a route and an expected skip to a worker, because the service did not decide for them.",
      ],
      commonMistakes: [
        "Throwing HTTP-shaped errors from services, which couples every caller to HTTP including workers and scripts.",
        "Spreading the status decision across forty `throw` statements, so changing a 409 to a 402 is a migration.",
        "Letting an unmapped domain error fall through to a 500 silently, so a rule failure looks like a bug and consumes your error budget.",
        "Using 422 where the state is the problem, which tells a client not to bother retrying when retrying would work.",
        "Using 409 for a permanently invalid request, which invites a client to retry forever.",
        "No test on the mapping table, so adding a domain error and forgetting the entry fails only in production.",
        "Catching in every route instead of letting the central handler and the map do it once.",
      ],
      quiz: [
        {
          question: "Why should a service not throw an HTTP-shaped error?",
          options: [
            "Performance",
            "It has other callers. The same function runs from a queue consumer and an admin script, and a status code assumes everything calling it speaks HTTP.",
            "HTTP errors cannot carry data",
            "Fastify forbids it",
          ],
          correctIndex: 1,
          explanation:
            "The other reason is that the mapping is a product decision, and one table is a one-line change while forty throws is a migration.",
        },
        {
          question: "What is the difference a client acts on between 409 and 422?",
          options: [
            "None, they are interchangeable",
            "409 means the request conflicts with current state so retrying later could succeed; 422 means it is unprocessable regardless of state",
            "409 is for writes only",
            "422 is newer",
          ],
          correctIndex: 1,
          explanation:
            "\"Order already completed\" is a 409 because the state is the problem. \"Amount must be positive\" is not fixed by waiting.",
        },
        {
          question: "What is the failure mode of a domain-to-HTTP mapping table?",
          options: [
            "It gets too large",
            "An unmapped domain error falls through to a 500, so a business rule failure looks like a bug, pages someone and counts against your error budget",
            "It slows the handler",
            "It duplicates the error classes",
          ],
          correctIndex: 1,
          explanation:
            "Log the default branch loudly, and add a test asserting every exported domain error class has an entry.",
        },
        {
          question: "Which errors may legitimately carry a `statusCode`?",
          options: [
            "All of them",
            "Transport-shaped ones like `NotFoundError` and `UnauthorizedError`, which are already about the protocol boundary",
            "None of them",
            "Only 5xx errors",
          ],
          correctIndex: 1,
          explanation:
            "A domain error's status is a mapping decision, so it belongs in the table rather than in the class.",
        },
        {
          question: "What does the split actually buy you?",
          options: [
            "Fewer classes",
            "The same error can be a 409 to a route and an expected skip to a worker, because the service did not decide for its callers",
            "Faster error handling",
            "Automatic status codes",
          ],
          correctIndex: 1,
          explanation:
            "Two correct and different responses to one error, which is impossible once the service has chosen a status.",
        },
      ],
    },
    {
      id: "central-handler-and-leaks",
      title: "The central handler, and what Fastify leaks by default",
      durationMinutes: 12,
      explanation:
        "## `setErrorHandler`\n\n```javascript\napp.setErrorHandler((error, request, reply) => { /* ... */ });\n```\n\nOne place decides how every failure looks to a client. Routes just throw.\n\n---\n\n## What the default does\n\nVerified on Fastify 5.12.3, throwing errors with custom `statusCode` values:\n\n```text\nNotFoundError    404  {\"statusCode\":404,\"error\":\"Not Found\",\"message\":\"User not found\"}\nConflictError    409  {\"statusCode\":409,\"error\":\"Conflict\",\"message\":\"Order already completed\"}\nDatabaseError    503  {\"statusCode\":503,...,\"message\":\"connect ECONNREFUSED 10.0.1.42:5432\"}\nplain Error      500  {\"statusCode\":500,...,\"message\":\"internal detail: /srv/app/lib/db.js\"}\n```\n\n> The first two are good news: Fastify honours `error.statusCode` with no handler at all, so custom classes work out of the box.\n>\n> The last two are the finding. <b>The message is sent for every status, including 500 and 503.</b> Your database driver's message contains its host and port. Your file paths are in there. Whatever a library put in an error message is now in a response body.\n\n---\n\n## Stack traces are not the leak\n\n> This is the correction that matters. The usual advice is \"never expose stack traces\", and Fastify does not send stacks. It sends <b>messages</b>, and the message is where the interesting text lives: `connect ECONNREFUSED 10.0.1.42:5432` tells an attacker your database is at an internal address on the standard port.\n>\n> So the rule is not about stacks. It is: <b>a 5xx message is internal by default, and a 4xx message is part of your API</b>. A 4xx is the caller's fault and telling them why is the whole point; a 5xx is yours and the caller can do nothing with the detail.\n\n---\n\n## The handler\n\n```text\nis it an AppError?          → use its status, and expose per its flag\nis it a Fastify validation? → 400 with the field errors\nis it a domain error?       → map it (previous lesson)\nanything else               → 500, generic message, full detail logged\n```\n\n> Two details that are easy to get wrong. Log <b>before</b> you shape the response, so a bug in your handler cannot lose the original error. And include the <b>request id</b> in the body: a user quoting `req_a3f2` turns a support conversation into one search, which Day 21 set up.\n\n---\n\n## Do not forget `setNotFoundHandler`\n\n> `setErrorHandler` does not cover a request that matched no route. Fastify's default 404 has its own shape, so an API with a beautiful error contract emits a different one for every typo'd URL. Set both, or your contract has a hole in the most commonly hit error there is.\n\n---\n\n## Validation errors\n\nDay 16 verified Fastify's validation output:\n\n```javascript\n{\"statusCode\":400,\"code\":\"FST_ERR_VALIDATION\",\"error\":\"Bad Request\",\"message\":\"body must have required property 'email'\"}\n```\n\n> That is one message for what may be several problems. `error.validation` holds the array, so mapping it into a `errors: [{ field, message }]` list is a few lines and it is the difference between a client fixing one field per round trip and fixing them all at once. Day 16 verified that Zod produces one issue per problem, so the information is there.\n\n---\n\n## And errors thrown inside the handler\n\n> If your error handler throws, Fastify falls back to its default, and you are back to leaking messages. So keep it boring: no database calls, no awaits that can reject, and wrap anything non-trivial. The error handler is the one function in your application that has no safety net.",
      diagram: `Verified on Fastify 5.12.3, no handler at all

    NotFoundError  404  "User not found"
    ConflictError  409  "Order already completed"
    DatabaseError  503  "connect ECONNREFUSED
                         10.0.1.42:5432"
    plain Error    500  "internal detail:
                         /srv/app/lib/db.js"

    the first two are GOOD news:
      Fastify honours error.statusCode with no
      handler, so custom classes work out of the
      box.

    the last two are THE FINDING:

      THE MESSAGE IS SENT FOR EVERY STATUS,
      INCLUDING 500 AND 503.

      your driver's message has its host and port
      your file paths are in there
      whatever a library put in a message is now
        in a response body


⚠⚠ Stack traces are not the leak

    the usual advice is "never expose stack
    traces".

    Fastify does not send stacks.
    IT SENDS MESSAGES.

    and the message is where the interesting text
    lives:

      "connect ECONNREFUSED 10.0.1.42:5432"

      → your database is at an internal address
        on the standard port

    so the rule is not about stacks:

      A 5xx MESSAGE IS INTERNAL BY DEFAULT
      A 4xx MESSAGE IS PART OF YOUR API

      4xx  the caller's fault. telling them why
           is the whole point.
      5xx  yours. the caller can do nothing with
           the detail.


The handler

    AppError?           its status, expose per
                        its flag
    Fastify validation? 400 + field errors
    domain error?       map it (last lesson)
    anything else?      500, generic message,
                        FULL detail logged

    two details easy to get wrong:

      LOG BEFORE you shape the response, so a bug
      in your handler cannot lose the original

      include the REQUEST ID in the body. a user
      quoting req_a3f2 turns a support
      conversation into one search  (Day 21)


⚠ Do not forget setNotFoundHandler

    setErrorHandler does NOT cover a request that
    matched no route.

    Fastify's default 404 has its own shape, so an
    API with a beautiful error contract emits a
    DIFFERENT one for every typo'd URL.

    set both, or your contract has a hole in the
    most commonly hit error there is.


Validation errors

    Day 16 verified:
      {"statusCode":400,
       "code":"FST_ERR_VALIDATION",
       "message":"body must have required
                  property 'email'"}

    ONE message for what may be SEVERAL problems.

    error.validation holds the array.

    mapping it to errors: [{ field, message }] is
    a few lines, and it is the difference between
    a client fixing ONE FIELD PER ROUND TRIP and
    fixing them all at once.

    Day 16 verified Zod produces one issue per
    problem, so the information is there.


⚠ And errors thrown INSIDE the handler

    if your error handler throws, Fastify falls
    back to its DEFAULT, and you are leaking
    messages again.

    so keep it boring:
      no database calls
      no awaits that can reject
      wrap anything non-trivial

    the error handler is the one function in your
    application WITH NO SAFETY NET.`,
      codeExample: {
        title: "A handler that does not leak, verified",
        code: `// ── ⚠ What you get with no handler. Verified. ───────────────
class NotFoundError extends Error { constructor(m){ super(m); this.statusCode = 404; } }
class DatabaseError extends Error { constructor(m){ super(m); this.statusCode = 503; } }

app.get("/nf", async () => { throw new NotFoundError("User not found"); });
app.get("/db", async () => {
  throw new DatabaseError("connect ECONNREFUSED 10.0.1.42:5432");
});
app.get("/plain", async () => {
  throw new Error("internal detail: /srv/app/lib/db.js");
});

// VERIFIED responses, Fastify 5.12.3, no setErrorHandler:
//
//   /nf     404  {"statusCode":404,"error":"Not Found",
//                 "message":"User not found"}
//   /db     503  {"statusCode":503,"error":"Service Unavailable",
//                 "message":"connect ECONNREFUSED 10.0.1.42:5432"}
//   /plain  500  {"statusCode":500,"error":"Internal Server Error",
//                 "message":"internal detail: /srv/app/lib/db.js"}
//
// The 404 is exactly right and needed no code.
//
// The 503 published your database host and port. The 500
// published a filesystem path. Neither is a stack trace, which
// is why "do not expose stack traces" is the wrong rule: the
// message was always the leak.


// ── ✓ src/http/error-handler.js ─────────────────────────────
import { AppError, ValidationError } from "../errors.js";
import { toHttpError } from "./error-map.js";

export function registerErrorHandler(app) {
  app.setErrorHandler((error, request, reply) => {
    // 1. LOG FIRST, always, before any shaping. If the code
    //    below has a bug, you still have the error.
    //    Day 21's key: \`err\`, not \`error\`, or pino logs {}.
    const isServerError = !error.statusCode || error.statusCode >= 500;

    request.log[isServerError ? "error" : "warn"]({
      err: error,
      statusCode: error.statusCode,
      route: request.routeOptions?.url,
      userId: request.user?.id,
    }, "request failed");

    // 2. Fastify's own validation errors. Day 16 verified the
    //    array is on error.validation.
    if (error.validation) {
      return reply.code(400).type("application/problem+json").send({
        type: "https://api.example.com/problems/validation-error",
        title: "Validation failed",
        status: 400,
        detail: "The request contains invalid fields.",
        instance: request.url,
        requestId: request.id,
        errors: error.validation.map((v) => ({
          field: v.instancePath?.replace(/^\\//, "") || v.params?.missingProperty,
          message: v.message,
        })),
      });
      // One request, every bad field. Without this the client
      // fixes one per round trip and concludes your API is
      // hostile.
    }

    // 3. Our own errors, plus domain errors mapped to them.
    const appError = error instanceof AppError
      ? error
      : toHttpError(error, request.log);

    if (appError) {
      const status = appError.statusCode;
      return reply.code(status).type("application/problem+json").send({
        type: \`https://api.example.com/problems/\${appError.code ?? "error"}\`,
        title: appError.expose ? appError.name : "Internal Server Error",
        status,
        detail: appError.expose ? appError.message : undefined,
        //      ^^^^^^^^^^^^^^^^ the whole fix, in one
        //      expression. expose defaults to statusCode < 500
        //      in the base class, so the 503 above sends no
        //      detail without anyone remembering.
        instance: request.url,
        requestId: request.id,
        ...(appError.issues ? { errors: appError.issues } : {}),
      });
    }

    // 4. Anything else. Not ours, so assume nothing is safe.
    return reply.code(500).type("application/problem+json").send({
      type: "https://api.example.com/problems/internal-error",
      title: "Internal Server Error",
      status: 500,
      instance: request.url,
      requestId: request.id,
      //         ^^^^^^^^^ so a user can quote it and you can
      //         find the six log lines from Day 21 in one
      //         search
    });
  });

  // ── ⚠ 5. The one people forget ────────────────────────────
  app.setNotFoundHandler((request, reply) => {
    return reply.code(404).type("application/problem+json").send({
      type: "https://api.example.com/problems/not-found",
      title: "Not Found",
      status: 404,
      detail: \`Route \${request.method} \${request.url} does not exist.\`,
      instance: request.url,
      requestId: request.id,
    });
  });
  // setErrorHandler never runs for an unmatched route, so
  // without this every typo'd URL gets Fastify's own shape.
  // That is the most frequently hit error in any API, and it
  // is the one most likely to be outside your contract.
}


// ── VERIFIED with this handler in place ─────────────────────
//
//   GET /users/123  (NotFoundError)
//     404  application/problem+json; charset=utf-8
//     {"type":"/problems/not-found","title":"Not Found",
//      "status":404,
//      "detail":"The requested user does not exist.",
//      "instance":"/users/123","requestId":"req-1"}
//
//   GET /boom  (Error with the connection string)
//     500  application/problem+json; charset=utf-8
//     {"type":"about:blank","title":"Internal Server Error",
//      "status":500,"instance":"/boom","requestId":"req-2"}
//
// The 404 carries its detail because it is the caller's
// problem. The 500 carries none, and the connection string is
// in the logs where it belongs. Note detail is simply absent
// rather than null, because JSON.stringify drops undefined.


// ── ⚠ Keep the handler boring ───────────────────────────────
// ✗ Do not do this:
app.setErrorHandler(async (error, request, reply) => {
  await db.insert(errorLog).values({ message: error.message });
  //    ^^^^^^^^^^^^^^^^^^^ if the database is the reason we
  //    are here, this rejects, Fastify falls back to its
  //    DEFAULT handler, and you are leaking messages again at
  //    exactly the worst moment
  return reply.code(500).send({ error: "Internal Server Error" });
});

// ✓ Synchronous shaping. Anything else goes to a queue or a
//   fire-and-forget call that cannot reject into this frame.
app.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error }, "request failed");

  Promise.resolve()
    .then(() => Sentry.captureException(error))
    .catch(() => {});          // never let telemetry throw here

  return reply.code(error.statusCode ?? 500).send(body);
});
// The error handler is the only function in your application
// with no safety net. Treat it accordingly.


// ── The test that pins the contract ─────────────────────────
test("no 5xx response contains an internal detail", async (t) => {
  const app = buildApp({ logger: false });
  t.after(() => app.close());

  app.get("/leak", async () => {
    throw new Error("connect ECONNREFUSED 10.0.1.42:5432");
  });
  app.get("/leak2", async () => {
    const e = new Error("boom");
    e.statusCode = 503;
    throw e;
  });

  for (const url of ["/leak", "/leak2"]) {
    const res = await app.inject({ url });
    assert.ok(res.statusCode >= 500);
    assert.ok(!res.body.includes("ECONNREFUSED"), \`\${url} leaked\`);
    assert.ok(!res.body.includes("10.0.1.42"), \`\${url} leaked a host\`);
    assert.ok(!res.body.includes("boom"), \`\${url} leaked a message\`);
    assert.match(res.body, /requestId/);
  }
});
// Three assertions and it holds the most important property
// of the whole day. Note the 503 case specifically: that is
// the one the verified default got wrong, and the one a
// handler written around "hide 500s" would still leak.`,
      },
      keyTakeaways: [
        "Verified: Fastify honours `error.statusCode` with no handler at all, so custom error classes give correct statuses out of the box.",
        "Verified and important: the default handler sends `error.message` for every status, including 500 and 503.",
        "So a database error published `connect ECONNREFUSED 10.0.1.42:5432` in a 503 body, and a plain error published a filesystem path in a 500.",
        "That means \"never expose stack traces\" is the wrong rule. Fastify sends no stacks; the message was always the leak.",
        "The real rule: a 5xx message is internal by default and a 4xx message is part of your API, because a 4xx is the caller's fault.",
        "Make `expose` a property of the error defaulted from the status, so nobody has to remember per handler. That also covers the 503 case.",
        "Log before shaping the response, so a bug in the handler cannot lose the original error.",
        "Include the request id in every error body, so a user quoting it turns a support conversation into one search.",
        "`setErrorHandler` never runs for an unmatched route. Set `setNotFoundHandler` too, or your contract has a hole in the most frequently hit error.",
        "Map `error.validation` into a per-field list, since Day 16 verified the information is there and one message per request costs the client a round trip per field.",
        "Keep the handler synchronous and boring. If it throws, Fastify falls back to the default and you leak again at the worst moment.",
        "Test that no 5xx body contains an internal detail, including a 503, which is the case a \"hide 500s\" handler still gets wrong.",
      ],
      commonMistakes: [
        "Assuming the default handler is safe because it does not send stack traces. It sends messages, which is where the host and paths are.",
        "Writing a handler that hides detail for 500 only, leaving 503 and other 5xx statuses leaking.",
        "Deciding per-error whether a message is safe, instead of defaulting `expose` from the status in the base class.",
        "Shaping the response before logging, so a bug in the shaping code loses the error entirely.",
        "Omitting the request id from error bodies, so a user report has nothing to search on.",
        "Forgetting `setNotFoundHandler`, so every unmatched route escapes your error contract.",
        "Returning one validation message when `error.validation` holds several, making the client fix one field per request.",
        "Awaiting a database write inside the error handler, which rejects exactly when the database is the problem and falls back to the leaking default.",
        "Never testing that a 5xx body is clean, so the leak is found by whoever looks first.",
      ],
      quiz: [
        {
          question: "With no `setErrorHandler`, what does Fastify send for a thrown error with `statusCode = 503`?",
          options: [
            "A generic message",
            "The status and the error's own message, so `connect ECONNREFUSED 10.0.1.42:5432` reaches the client",
            "A stack trace",
            "An empty body",
          ],
          correctIndex: 1,
          explanation:
            "Verified. It honours the status correctly and exposes the message at every status, including 500 and 503.",
        },
        {
          question: "Why is \"never expose stack traces\" the wrong framing?",
          options: [
            "Stacks are safe",
            "Fastify does not send stacks. It sends messages, and the message is where the host, port and file paths live.",
            "Stacks are always stripped in production",
            "Clients ignore them",
          ],
          correctIndex: 1,
          explanation:
            "The real rule is that a 5xx message is internal by default and a 4xx message is part of your API contract.",
        },
        {
          question: "Why put `expose` on the error base class rather than deciding in the handler?",
          options: [
            "It is faster",
            "Defaulting it from the status means nobody has to remember, and it covers 503 and other 5xx statuses a \"hide 500s\" handler would miss",
            "Fastify requires it",
            "It enables problem+json",
          ],
          correctIndex: 1,
          explanation:
            "The verified 503 leak is exactly the case a handler written around 500 still gets wrong.",
        },
        {
          question: "What does `setErrorHandler` not cover?",
          options: [
            "Validation errors",
            "A request that matched no route, which uses Fastify's own 404 shape unless you also set `setNotFoundHandler`",
            "Thrown strings",
            "Async handlers",
          ],
          correctIndex: 1,
          explanation:
            "That is the most frequently hit error in any API, and the one most likely to fall outside your contract.",
        },
        {
          question: "Why must the error handler avoid awaiting a database write?",
          options: [
            "It is slow",
            "If it rejects, Fastify falls back to its default handler and leaks messages again, exactly when the database is the reason you are there",
            "Fastify forbids async handlers",
            "It would deadlock",
          ],
          correctIndex: 1,
          explanation:
            "The error handler is the one function with no safety net. Keep it synchronous and push anything else to a queue.",
        },
      ],
    },
    {
      id: "problem-details",
      title: "Problem Details",
      durationMinutes: 10,
      explanation:
        "## Problem Details\n\n<b>Problem Details (RFC 9457)</b> (a standard JSON format for describing HTTP API errors).\n\n```javascript\n{\n  \"type\": \"https://api.example.com/problems/user-not-found\",\n  \"title\": \"User Not Found\",\n  \"status\": 404,\n  \"detail\": \"The requested user does not exist.\",\n  \"instance\": \"/users/123\"\n}\n```\n\n> The value is not the field names, it is that <b>`type` is a stable identifier and `detail` is not</b>. A client branches on `type`; a human reads `detail`. That separation is what lets you improve an error message without breaking anyone, which is impossible when the message <b>is</b> the contract.\n\n---\n\n## The five fields\n\n```text\ntype      a stable URI identifying the problem kind. the machine-readable part.\ntitle     a short human summary. same for every instance of this type.\nstatus    the HTTP status, duplicated in the body.\ndetail    what went wrong this time. human-readable, and free to change.\ninstance  which request or resource this occurred on.\n```\n\n> `type` being a URI is the part people push back on, and the reason is <b>namespacing</b>. `\"not_found\"` collides the moment two services or two teams disagree about what it means; `https://api.example.com/problems/not-found` cannot. It does not have to resolve to anything, though pointing it at documentation is a nice thing to do for whoever is debugging at 3am.\n\nAnd extra fields are allowed. `errors` for validation, `requestId` for correlation, `retryAfter` for a rate limit: the standard leaves room deliberately.\n\n---\n\n## The content type\n\nVerified: `reply.type(\"application/problem+json\")` produces `application/problem+json; charset=utf-8`.\n\n> That header is what makes the format detectable. A client can tell a problem document from a normal response without inspecting the body, which is what allows one generic error handler in a client library rather than a special case per endpoint.\n\n---\n\n## Why standardise at all\n\n```text\nAPI A   { error: \"bad\" }\nAPI B   { message: \"not found\" }\nAPI C   { errors: [...] }\n```\n\n> The cost of three shapes is not aesthetic, it is that a client cannot write <b>one</b> error path. So it writes a `catch` that shows \"something went wrong\", and every specific message you carefully wrote is discarded. A predictable shape is the precondition for a client doing anything useful with an error at all.\n>\n> And the honest caveat: for a small internal API, a consistent shape you invented is worth almost as much as this one. The specific value of RFC 9457 shows up when the API is consumed by people you cannot talk to, or when you have several services and want one client-side handler for all of them.\n\n---\n\n## Two things to get right\n\n> <b>Do not put a stack, a SQL statement or an exception message in `detail` for a 5xx.</b> The field is human-readable, not safe-by-definition, and the previous lesson's verified leak was exactly a message in a body.\n>\n> <b>Keep `type` stable forever.</b> It is an identifier, so changing it breaks every client branching on it, which is the one thing the format exists to enable. Change `title` and `detail` freely; treat `type` like a database column name.",
      diagram: `The value is the SEPARATION

    {
      "type":     ".../problems/user-not-found",
      "title":    "User Not Found",
      "status":   404,
      "detail":   "The requested user does not
                   exist.",
      "instance": "/users/123"
    }

    type is a STABLE IDENTIFIER.
    detail is NOT.

      a client branches on TYPE
      a human reads DETAIL

    → which is what lets you improve an error
      message without breaking anyone.

      impossible when the MESSAGE IS THE CONTRACT.


The five fields

    type      stable URI, the problem KIND
              the machine-readable part
    title     short human summary
              same for every instance of this type
    status    the HTTP status, duplicated in body
    detail    what went wrong THIS TIME
              human-readable, free to change
    instance  which request or resource


Why type is a URI

    the part people push back on, and the reason
    is NAMESPACING.

      "not_found" collides the moment two
      services or two teams disagree about what
      it means

      https://api.example.com/problems/not-found
      cannot

    it does not have to RESOLVE to anything,
    though pointing it at documentation is a nice
    thing to do for whoever is debugging at 3am.


Extra fields are allowed, deliberately

    errors      for validation
    requestId   for correlation
    retryAfter  for a rate limit


The content type

    verified:
      reply.type("application/problem+json")
      → application/problem+json; charset=utf-8

    that header is what makes the format
    DETECTABLE.

    a client can tell a problem document from a
    normal response WITHOUT inspecting the body

    → which allows ONE generic error handler in a
      client library, instead of a special case
      per endpoint.


Why standardise at all

    API A  { error: "bad" }
    API B  { message: "not found" }
    API C  { errors: [...] }

    the cost is not aesthetic:

      a client cannot write ONE error path

      so it writes a catch that shows "something
      went wrong"

      and every specific message you carefully
      wrote is DISCARDED

    a predictable shape is the PRECONDITION for a
    client doing anything useful with an error.

    ⚠ honest caveat:

      for a small internal API, a consistent
      shape YOU invented is worth almost as much.

      RFC 9457's specific value shows up when the
      API is consumed by people you cannot talk
      to, or when several services want one
      client-side handler.


⚠ Two things to get right

    1. NO stack, SQL or exception message in
       detail for a 5xx.

       the field is human-READABLE, not
       safe-by-definition, and the last lesson's
       verified leak was exactly a message in a
       body.

    2. KEEP type STABLE FOREVER.

       it is an IDENTIFIER. changing it breaks
       every client branching on it, which is the
       one thing the format exists to enable.

       change title and detail freely.
       treat type like a database column name.`,
      codeExample: {
        title: "A problem document per error kind",
        code: `// ── src/http/problems.js — the registry of types ────────────
const BASE = "https://api.example.com/problems";

// These strings are a public contract. Treat them like column
// names: add freely, never rename.
export const PROBLEM = {
  validation:   \`\${BASE}/validation-error\`,
  unauthorized: \`\${BASE}/unauthorized\`,
  forbidden:    \`\${BASE}/forbidden\`,
  notFound:     \`\${BASE}/not-found\`,
  conflict:     \`\${BASE}/conflict\`,
  rateLimited:  \`\${BASE}/rate-limited\`,
  dependency:   \`\${BASE}/dependency-unavailable\`,
  internal:     \`\${BASE}/internal-error\`,
};


// ── Verified shapes ─────────────────────────────────────────

// 404, the caller's problem, so detail is the point.
//   404  application/problem+json; charset=utf-8
{
  "type": "https://api.example.com/problems/not-found",
  "title": "Not Found",
  "status": 404,
  "detail": "The requested user does not exist.",
  "instance": "/users/123",
  "requestId": "req-1"
}

// 500, ours, so no detail at all.
//   500  application/problem+json; charset=utf-8
{
  "type": "https://api.example.com/problems/internal-error",
  "title": "Internal Server Error",
  "status": 500,
  "instance": "/boom",
  "requestId": "req-2"
}
// Verified: detail is absent rather than null, because
// JSON.stringify drops an undefined value. That is the
// behaviour you want: the field is simply not there.


// ── Validation, with the extension field ────────────────────
{
  "type": "https://api.example.com/problems/validation-error",
  "title": "Validation failed",
  "status": 400,
  "detail": "The request contains invalid fields.",
  "instance": "/users",
  "requestId": "req-3",
  "errors": [
    { "field": "email", "message": "Invalid email address" },
    { "field": "age", "message": "You must be at least 18" }
  ]
}
// Both fields in one response. Day 16 verified Zod produces
// one issue per problem, so this costs a .map() and saves the
// client a round trip per field.


// ── Rate limiting, with the field a client can act on ───────
{
  "type": "https://api.example.com/problems/rate-limited",
  "title": "Too Many Requests",
  "status": 429,
  "detail": "Rate limit exceeded. Retry in 60 seconds.",
  "instance": "/login",
  "requestId": "req-4",
  "retryAfter": 60
}
// Day 19's point: a 429 without a retry hint makes a badly
// written client retry immediately. Put it in the header AND
// the body, because a client library reading problem
// documents may never look at headers.


// ── A tiny helper, so the shape cannot drift ────────────────
export function problem(reply, { type, title, status, detail, instance, ...extra }) {
  return reply
    .code(status)
    .type("application/problem+json")
    .send({ type, title, status, detail, instance, ...extra });
}
// Verified content type: application/problem+json; charset=utf-8
//
// Every error path in the application goes through this one
// function, which is the only way a "consistent contract"
// stays consistent past month three.


// ── ⚠ What not to put in detail ─────────────────────────────
// ✗
{
  "type": ".../internal-error",
  "title": "Internal Server Error",
  "status": 500,
  "detail": "connect ECONNREFUSED 10.0.1.42:5432"
}
//           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ exactly the
//           leak the previous lesson verified, now wearing a
//           standard format. A field being human-readable
//           does not make it safe.

// ✗ And this, which is the same mistake with more effort:
{
  "status": 500,
  "detail": "Query failed: SELECT * FROM users WHERE email = $1"
}
//           Your schema, in a response body.

// ✓ For a 5xx: no detail, plus a requestId. The detail is in
//   your logs, tied to that id, which is Day 21's whole point.


// ── ⚠ Why type must never change ────────────────────────────
// A client that has done the right thing:
//
//   const res = await fetch("/orders/1/cancel", { method: "POST" });
//
//   if (!res.ok && res.headers.get("content-type")
//         ?.includes("application/problem+json")) {
//     const p = await res.json();
//
//     switch (p.type) {
//       case ".../problems/conflict":
//         return showMessage(p.detail);          // human text
//       case ".../problems/rate-limited":
//         return retryAfter(p.retryAfter);       // structured
//       case ".../problems/unauthorized":
//         return redirectToLogin();
//       default:
//         return showGenericError(p.requestId);
//     }
//   }
//
// Note what it branches on and what it displays. Rename a
// type and every branch falls to default. Reword a detail and
// nothing breaks, which is the freedom the separation buys.
//
// So: adding a type is safe, renaming one is a breaking API
// change, and it is worth writing that down where the strings
// live.


// ── The test that keeps the contract ────────────────────────
test("every error response is a problem document", async (t) => {
  const app = buildApp({ logger: false });
  t.after(() => app.close());

  const cases = [
    { url: "/does-not-exist", status: 404 },       // notFoundHandler
    { url: "/users/abc", status: 400 },            // validation
    { url: "/admin", status: 401 },                // auth
    { url: "/boom", status: 500 },                 // unhandled
  ];

  for (const { url, status } of cases) {
    const res = await app.inject({ url });
    assert.equal(res.statusCode, status, url);
    assert.match(res.headers["content-type"], /application\\/problem\\+json/, url);

    const body = res.json();
    assert.ok(body.type?.startsWith("https://api.example.com/problems/"), url);
    assert.ok(body.title, url);
    assert.equal(body.status, status, url);
    assert.ok(body.requestId, url);

    if (status >= 500) {
      assert.equal(body.detail, undefined, \`\${url} sent a detail on a 5xx\`);
    }
  }
});
// Note the /does-not-exist case. That is the one the previous
// lesson flagged: without setNotFoundHandler this test fails,
// which is how you find out that the most common error in
// your API was never in the contract.`,
      },
      keyTakeaways: [
        "The value of Problem Details is that `type` is a stable identifier and `detail` is not: a client branches on one and a human reads the other.",
        "That separation is what lets you improve an error message without breaking clients, which is impossible when the message is the contract.",
        "`type` is a URI for namespacing, so two teams cannot disagree about what `\"not_found\"` means. It need not resolve, though pointing it at docs helps at 3am.",
        "Extra fields are allowed deliberately: `errors` for validation, `requestId` for correlation, `retryAfter` for a 429.",
        "Verified: `reply.type(\"application/problem+json\")` gives `application/problem+json; charset=utf-8`, which is what makes the format detectable without parsing the body.",
        "Verified: an omitted `detail` is absent rather than null, because `JSON.stringify` drops undefined. That is the behaviour you want on a 5xx.",
        "The cost of inconsistent shapes is that a client writes one generic `catch`, discarding every specific message you wrote.",
        "Honest caveat: for a small internal API, a consistent shape you invented is worth almost as much. RFC 9457 pays off across services or with clients you cannot talk to.",
        "A field being human-readable does not make it safe. A connection string or a SQL statement in `detail` is the previous lesson's leak in a standard format.",
        "Treat `type` like a database column name: adding one is safe, renaming one is a breaking change.",
        "Route every error through one helper, or a \"consistent contract\" stops being consistent by month three.",
        "Test that unmatched routes also emit a problem document. That is the case a missing `setNotFoundHandler` fails.",
      ],
      commonMistakes: [
        "Treating the message as the contract, so improving wording breaks clients that string-match it.",
        "Using a bare slug like `\"not_found\"` for `type`, which collides between teams and services.",
        "Renaming a `type` during a refactor, which silently sends every client branch to its default case.",
        "Putting an exception message, a connection string or SQL into `detail` on a 5xx.",
        "Omitting the `application/problem+json` content type, so a client cannot detect the format without parsing.",
        "Sending `detail: null` instead of omitting it, which invites a client to render \"null\".",
        "Building the body inline at each error site, so the shape drifts within a month.",
        "Adopting the format for a two-endpoint internal API and calling it done, without a consistent handler behind it.",
        "Forgetting that unmatched routes bypass `setErrorHandler`, leaving the most common error outside the contract.",
      ],
      quiz: [
        {
          question: "What is the actual value of separating `type` from `detail`?",
          options: [
            "It is shorter",
            "`type` is a stable identifier a client branches on and `detail` is free-text a human reads, so you can improve wording without breaking clients",
            "`type` is required by HTTP",
            "It enables translation",
          ],
          correctIndex: 1,
          explanation:
            "When the message is the contract, every reword is a breaking change. This is what the format exists to fix.",
        },
        {
          question: "Why is `type` a URI rather than a slug?",
          options: [
            "It must be fetchable",
            "Namespacing. `\"not_found\"` collides the moment two teams or services mean different things by it.",
            "For SEO",
            "The RFC requires HTTPS",
          ],
          correctIndex: 1,
          explanation:
            "It does not have to resolve, though pointing it at documentation is useful to whoever is debugging.",
        },
        {
          question: "What did `reply.type(\"application/problem+json\")` produce, and why does it matter?",
          options: [
            "`application/json`, so it makes no difference",
            "`application/problem+json; charset=utf-8`, which lets a client detect a problem document without parsing the body",
            "An error",
            "A 415",
          ],
          correctIndex: 1,
          explanation:
            "Verified. That detectability is what allows one generic error handler in a client library.",
        },
        {
          question: "What should `detail` contain on a 500?",
          options: [
            "The exception message",
            "Nothing. Omit it and include a request id; a human-readable field is not a safe field.",
            "The stack trace",
            "The SQL that failed",
          ],
          correctIndex: 1,
          explanation:
            "Verified that an undefined `detail` is dropped by `JSON.stringify`, so the field is simply absent.",
        },
        {
          question: "You want to reword an error. What can you change safely?",
          options: [
            "`type` and `title`",
            "`title` and `detail` freely; `type` is an identifier and renaming it sends every client branch to its default",
            "Only `status`",
            "Nothing, the whole document is a contract",
          ],
          correctIndex: 1,
          explanation:
            "Adding a `type` is safe and renaming one is a breaking API change. Write that down where the strings live.",
        },
      ],
    },
    {
      id: "timeouts-and-retries",
      title: "Timeouts, retries and backoff",
      durationMinutes: 12,
      explanation:
        "## Timeout\n\n<b>Timeout</b> (a maximum time you allow an operation to take before giving up).\n\n```javascript\nawait fetch(url, { signal: AbortSignal.timeout(3000) });\n```\n\n> The reason a missing timeout is worse than a slow dependency is <b>accumulation</b>. Requests waiting on a hung external call hold a connection, a request object and, from Day 17, a database connection each. A dependency that stops responding but never closes the socket will therefore take your service down without ever returning an error, and your own timeout is the only thing that stops it.\n>\n> Node's `fetch` has <b>no default timeout</b>. Neither does most of the ecosystem. So this is not tuning; it is the difference between a degraded dependency and an outage.\n\n---\n\n## Distinguishing a timeout from a cancellation\n\nVerified:\n\n```text\nAbortSignal.timeout(1)   →  DOMException, name \"TimeoutError\", code 23\ncontroller.abort()       →  DOMException, name \"AbortError\"\n```\n\n> Same class, different `name`. So `instanceof` cannot tell them apart and `err.name` can, which matters because they need opposite handling: a <b>timeout is retryable</b> and a <b>deliberate cancellation is not</b>. Retrying a request the caller abandoned is work nobody wants, done at your expense.\n\n---\n\n## Retry\n\n<b>Retry</b> (attempting an operation again after a failure that might be temporary).\n\n```text\nRetryable       timeout, connection reset, 502/503/504, 429 with Retry-After\nNot retryable   400, 401, 403, 404, 409, 422, a validation failure\n```\n\n> The dividing line is not the status number, it is whether <b>anything could have changed</b>. A 400 will be a 400 forever because the request is the problem. A 503 might not be, because the server is. Retrying a 400 is a way to send four times as much traffic and get four times the same answer.\n\n---\n\n## Retry storms\n\n<b>Retry storm</b> (many clients retrying a failing service and making the failure worse).\n\n> This is the failure mode that makes naive retries dangerous rather than merely useless. A service slows down, every client retries, the retries add load, it slows further, and more clients time out and retry. You have built a positive feedback loop pointed at something already struggling, and it will not recover while you are doing it.\n>\n> That is why retries need three limits, not one: a <b>cap on attempts</b>, <b>growing delays</b>, and a <b>budget</b> so that retries can never be more than a small fraction of your traffic.\n\n---\n\n## Exponential backoff and jitter\n\n<b>Exponential backoff</b> (doubling the wait between attempts).\n\n<b>Jitter</b> (randomising the wait so clients do not retry in lockstep).\n\nVerified, 1000 clients at their third attempt:\n\n```text\nwithout jitter  →  1 distinct retry time\nwith jitter     →  363 distinct retry times\n```\n\n> One distinct time. Every client retrying at the same millisecond, which is a synchronised spike aimed at a recovering service, and it is exactly what knocks it over again. Backoff alone spaces out <b>your</b> attempts; only jitter spaces out <b>everyone's</b>.\n>\n> Full jitter, `random() * delay`, is the simple choice and it is good enough. Verified spread: attempt delays of 100, 200, 400, 800, 1600, 3200ms became randomised values across each of those ranges.\n\n---\n\n## Where retries belong\n\n> Retry <b>outbound</b> calls, not inbound requests. Your client retrying is its decision; you retrying on its behalf multiplies the time it waits, and a client that has already timed out is no longer listening.\n>\n> And never retry a non-idempotent write without an idempotency key, which is the next lesson. That is the difference between a retry and a duplicate charge.",
      diagram: `Why a missing timeout is worse than a slow
dependency: ACCUMULATION

    each waiting request holds
      a connection
      a request object
      a DATABASE connection    (Day 17)

    a dependency that stops responding but never
    closes the socket takes your service down
    WITHOUT EVER RETURNING AN ERROR.

    ⚠ Node's fetch has NO DEFAULT TIMEOUT.
      neither does most of the ecosystem.

    so this is not tuning. it is the difference
    between a degraded dependency and an outage.


⚠ Timeout vs cancellation. Verified.

    AbortSignal.timeout(1)
      → DOMException, name "TimeoutError", code 23

    controller.abort()
      → DOMException, name "AbortError"

    SAME CLASS, DIFFERENT NAME.

      instanceof cannot tell them apart
      err.name can

    and they need OPPOSITE handling:

      a timeout is RETRYABLE
      a deliberate cancellation is NOT

    retrying a request the caller abandoned is
    work nobody wants, at your expense.


What to retry: could anything have CHANGED?

    RETRYABLE
      timeout · connection reset
      502 / 503 / 504
      429 with Retry-After

    NOT RETRYABLE
      400 · 401 · 403 · 404 · 409 · 422
      a validation failure

    the line is not the status NUMBER:

      a 400 will be a 400 forever, because the
      REQUEST is the problem

      a 503 might not be, because the SERVER is

    retrying a 400 sends four times the traffic
    for four times the same answer.


⚠⚠ Retry storms: a positive feedback loop

    a service slows
      → every client retries
      → retries add load
      → it slows further
      → more clients time out and retry

    you have built a feedback loop pointed at
    something already struggling, and IT WILL NOT
    RECOVER WHILE YOU ARE DOING IT.

    → retries need THREE limits, not one:

      a CAP on attempts
      GROWING delays
      a BUDGET, so retries can never exceed a
        small fraction of your traffic


⚠⚠ Jitter. Verified, 1000 clients, attempt 3.

    without jitter  →  1 DISTINCT RETRY TIME
    with jitter     →  363 distinct times

    ONE.

    every client retrying at the same
    millisecond: a synchronised spike aimed at a
    RECOVERING service, which is exactly what
    knocks it over again.

    backoff alone spaces out YOUR attempts.
    only jitter spaces out EVERYONE'S.

    full jitter, random() * delay, is the simple
    choice and it is good enough.

    verified schedule: 100, 200, 400, 800, 1600,
    3200ms, each randomised across its range.


Where retries belong

    retry OUTBOUND calls, not INBOUND requests.

      your client retrying is ITS decision

      you retrying on its behalf MULTIPLIES the
      time it waits, and a client that already
      timed out is not listening

    ⚠ and never retry a non-idempotent write
      without an idempotency key.

      → next lesson. that is the difference
        between a retry and a duplicate charge.`,
      codeExample: {
        title: "A retry helper that cannot cause a storm",
        code: `// ── ⚠ Verified: timeout and abort are the same class ────────
try {
  await fetch("https://example.com", { signal: AbortSignal.timeout(1) });
} catch (err) {
  err.constructor.name;   // "DOMException"
  err.name;               // "TimeoutError"     ← verified
  err.code;               // 23
}

const ac = new AbortController();
setTimeout(() => ac.abort(), 1);
try {
  await fetch("https://example.com", { signal: ac.signal });
} catch (err) {
  err.constructor.name;   // "DOMException"
  err.name;               // "AbortError"       ← verified
}
//
// So this is wrong:
//   if (err instanceof DOMException) retry();
//
// It retries requests the caller deliberately cancelled. Use
// err.name.


// ── Classifying a failure ───────────────────────────────────
function isRetryable(err) {
  // A deliberate cancellation is never retryable, whoever
  // decided it.
  if (err.name === "AbortError") return false;

  // A timeout is the canonical retryable failure.
  if (err.name === "TimeoutError") return true;

  // Transport-level failures, from Day 10's socket lesson.
  if (["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT", "EAI_AGAIN"]
      .includes(err.code)) return true;

  // Our own wrapped HTTP failures.
  if (err.status) {
    if (err.status === 429) return true;                 // with Retry-After
    if (err.status >= 500 && err.status !== 501) return true;
    return false;    // every 4xx: the REQUEST is the problem
  }

  // Unknown. Do not retry, because an unclassified error
  // retried is a bug amplified.
  return false;
}
//
// Note the default. A retry helper that retries anything it
// does not recognise turns one bug into four identical bugs
// and hides the original in the noise.


// ── The retry, with all three limits ────────────────────────
const budget = { retries: 0, requests: 0, windowStart: Date.now() };

function retryBudgetExceeded() {
  // Reset the window every minute.
  if (Date.now() - budget.windowStart > 60_000) {
    budget.retries = 0;
    budget.requests = 0;
    budget.windowStart = Date.now();
  }
  // ⚠ The third limit, and the one always missing. Retries
  // may never exceed 10% of traffic, so even a total
  // dependency outage cannot double the load you send it.
  return budget.requests > 20 && budget.retries / budget.requests > 0.1;
}

export async function withRetry(fn, {
  attempts = 3,
  baseMs = 100,
  capMs = 5_000,
  signal,
} = {}) {
  budget.requests++;
  let lastErr;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn({ attempt });
    } catch (err) {
      lastErr = err;

      if (!isRetryable(err)) throw err;
      if (attempt === attempts - 1) break;
      if (signal?.aborted) throw err;
      //  ^^^^^^^^^^^^^^^^ if the CALLER gave up, stop. Day 22:
      //  finishing work nobody is waiting for is pure cost.

      if (retryBudgetExceeded()) {
        log().warn({ err }, "retry budget exhausted, failing fast");
        throw err;
      }

      // Exponential, capped, with full jitter.
      const exponential = Math.min(capMs, baseMs * 2 ** attempt);
      const delay = err.retryAfterMs ?? Math.random() * exponential;
      //            ^^^^^^^^^^^^^^^^ if the server told us when
      //            to come back, believe it rather than guessing

      budget.retries++;
      log().debug({ attempt: attempt + 1, delay: Math.round(delay) }, "retrying");
      await sleep(delay, signal);
    }
  }

  throw lastErr;
}

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}
// The sleep is abortable too. A non-abortable sleep means a
// cancelled request still waits 3200ms before noticing.


// ── ⚠ Why jitter, in one measurement ───────────────────────
// 1000 clients, all on their third attempt:
//
//   without jitter:  100 * 2**2 = 400ms for every one of them
//     → distinct retry times: 1            ← VERIFIED
//
//   with full jitter: Math.random() * 400
//     → distinct retry times: 363          ← VERIFIED
//
// One distinct time means 1000 requests land in the same
// millisecond, on a service that was just starting to
// recover. Backoff without jitter converts a smooth overload
// into a series of synchronised spikes, which is worse.


// ── Using it, with a timeout on every attempt ───────────────
export async function fetchUser(id, { signal } = {}) {
  return withRetry(async ({ attempt }) => {
    const res = await fetch(\`https://users.internal/users/\${id}\`, {
      // ⚠ Per attempt, not per call. AbortSignal.timeout(3000)
      // created once would expire during the backoff and every
      // later attempt would abort instantly.
      signal: AbortSignal.any([
        AbortSignal.timeout(3000),
        ...(signal ? [signal] : []),
      ]),
      headers: { "x-request-id": currentContext()?.requestId ?? "" },
      //          ^^^^^^^^^^^^^^ Day 21: the same trace id in
      //          both services' logs
    });

    if (!res.ok) {
      const err = new Error(\`users service returned \${res.status}\`);
      err.status = res.status;
      if (res.status === 429) {
        const after = Number(res.headers.get("retry-after"));
        if (Number.isFinite(after)) err.retryAfterMs = after * 1000;
      }
      throw err;
    }

    return res.json();
  }, { attempts: 3, signal });
}
//
// AbortSignal.any combines them, so the request stops for
// whichever comes first: our timeout or the caller giving up.


// ── ⚠ Do not retry inbound requests ─────────────────────────
// ✗
app.get("/users/:id", async (request, reply) => {
  return withRetry(() => loadUser(request.params.id), { attempts: 5 });
});
//
// Three problems. Your client already has its own retry
// policy, so the real attempt count is yours times theirs.
// Your p99 becomes the sum of five attempts plus four
// backoffs. And a client that timed out at 3 seconds is not
// listening when you answer at 9.
//
// ✓ Retry the OUTBOUND call inside the handler, with a total
//   budget smaller than what the caller will wait:
app.get("/users/:id", async (request) => {
  return fetchUser(request.params.id, { signal: request.raw.signal });
  //                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^ and
  //   stop entirely if the client disconnects


// ── The total-time check people skip ────────────────────────
// attempts: 5, baseMs: 100, capMs: 5000, timeout 3000 each
//
//   worst case = 5 * 3000 (timeouts)
//              + 100 + 200 + 400 + 800 (backoff)
//              = 16.5 seconds
//
// If your own request timeout is 10 seconds, two of those
// attempts can never complete, so you are holding a
// connection to do work that is guaranteed to be discarded.
//
// Do the arithmetic once. attempts * perAttemptTimeout + sum
// of backoffs must fit inside the caller's patience.`,
      },
      keyTakeaways: [
        "A missing timeout is worse than a slow dependency because waiting requests accumulate, each holding a connection and a database connection.",
        "Node's `fetch` has no default timeout, so a dependency that hangs without closing the socket takes you down with no error.",
        "Verified: `AbortSignal.timeout` throws a `DOMException` named `TimeoutError`, and `controller.abort()` throws one named `AbortError`.",
        "Same class, different name, so `instanceof` cannot distinguish them and `err.name` must. A timeout is retryable; a cancellation is not.",
        "The retryable line is not the status number, it is whether anything could have changed. A 400 will always be a 400.",
        "A retry helper that retries unknown errors turns one bug into four identical bugs and buries the original.",
        "Retry storms are a positive feedback loop, so retries need three limits: an attempt cap, growing delays, and a budget capping retries as a share of traffic.",
        "Verified: 1000 clients at attempt three produced 1 distinct retry time without jitter and 363 with it.",
        "Backoff alone spaces out your attempts; only jitter spaces out everyone's, which is what stops a synchronised spike at a recovering service.",
        "Create the timeout signal per attempt. One created per call expires during backoff and aborts every later attempt instantly.",
        "Use `AbortSignal.any` to combine your timeout with the caller's signal, and make the backoff sleep abortable.",
        "Retry outbound calls, not inbound requests. Retrying inbound multiplies the caller's own policy and answers a client that stopped listening.",
        "Do the arithmetic: attempts times per-attempt timeout plus backoffs must fit inside the caller's patience.",
      ],
      commonMistakes: [
        "No timeout on `fetch`, which has no default, so a hung dependency accumulates requests until you fall over.",
        "Using `instanceof DOMException` to detect a timeout, which also matches a caller's deliberate cancellation.",
        "Retrying 4xx responses, which sends the same invalid request repeatedly.",
        "Retrying unclassified errors by default, amplifying bugs instead of surviving blips.",
        "Backoff with no jitter, which turns overload into synchronised spikes. Verified as one distinct retry time across 1000 clients.",
        "No retry budget, so a total dependency outage doubles the traffic you send it.",
        "Creating `AbortSignal.timeout` once per call rather than per attempt, so retries abort instantly after the first backoff.",
        "A non-abortable sleep, so a cancelled request still waits out the full backoff.",
        "Retrying inside a request handler, multiplying the client's own retry policy and answering after it stopped listening.",
        "Not computing the worst-case total, so attempts are guaranteed to be discarded by your own request timeout.",
      ],
      quiz: [
        {
          question: "How do you tell a `fetch` timeout from a caller's cancellation?",
          options: [
            "`instanceof TimeoutError`",
            "By `err.name`: both are `DOMException`, named `TimeoutError` and `AbortError` respectively",
            "By the status code",
            "They are indistinguishable",
          ],
          correctIndex: 1,
          explanation:
            "Verified. It matters because a timeout is retryable and a cancellation is not, so `instanceof` gets it wrong in the dangerous direction.",
        },
        {
          question: "What was measured for 1000 clients retrying at attempt three?",
          options: [
            "The delays spread naturally",
            "1 distinct retry time without jitter and 363 with it, so without jitter all 1000 land in the same millisecond",
            "No measurable difference",
            "Jitter made it worse",
          ],
          correctIndex: 1,
          explanation:
            "Backoff spaces out your own attempts. Only jitter stops a synchronised spike hitting a service that was starting to recover.",
        },
        {
          question: "What is the dividing line for whether something is retryable?",
          options: [
            "Whether the status is 5xx",
            "Whether anything could have changed. A 400 will be a 400 forever because the request is the problem; a 503 might not be.",
            "Whether the call is idempotent",
            "Whether it timed out",
          ],
          correctIndex: 1,
          explanation:
            "Which is also why an unclassified error should not be retried: you would amplify a bug rather than survive a blip.",
        },
        {
          question: "Why must `AbortSignal.timeout` be created per attempt?",
          options: [
            "It is cheaper",
            "One created per call keeps counting during the backoff, so every attempt after the first aborts immediately",
            "Signals cannot be reused at all",
            "It avoids a memory leak",
          ],
          correctIndex: 1,
          explanation:
            "Combine it with the caller's signal using `AbortSignal.any`, so the request stops for whichever comes first.",
        },
        {
          question: "Why not retry inside a request handler?",
          options: [
            "It is against the HTTP spec",
            "Your client has its own retry policy, so the real attempt count multiplies, and a client that timed out at 3 seconds is not listening at 9",
            "Fastify forbids it",
            "It breaks the trace",
          ],
          correctIndex: 1,
          explanation:
            "Retry the outbound call instead, with a total budget that fits inside the caller's patience.",
        },
        {
          question: "What is the third retry limit people leave out?",
          options: [
            "A cap on attempts",
            "A budget capping retries as a share of traffic, so a total dependency outage cannot double the load you send it",
            "Growing delays",
            "A timeout",
          ],
          correctIndex: 1,
          explanation:
            "Attempts and backoff limit one caller. A budget limits the aggregate, which is what a retry storm is made of.",
        },
      ],
    },
    {
      id: "idempotency",
      title: "Idempotency",
      durationMinutes: 11,
      explanation:
        "## Idempotency\n\n<b>Idempotency</b> (a repeated request produces the same result rather than a second side effect).\n\nThis is what makes retries safe.\n\n```text\nPOST /payments  $100\n  server charges it\n  the response is lost\n  the client sees a timeout, retries\n  →  $200 charged\n```\n\n> The trap is that <b>every layer above you retries by default</b>. The user presses the button twice, the mobile client retries on timeout, the load balancer retries a 502, and the previous lesson's helper retries a timeout. Any one of those turns one intent into two charges, and none of them is a bug in isolation.\n>\n> So the question is not \"should we handle duplicates\". Duplicates will arrive. The question is whether the second one is safe.\n\n---\n\n## The verb is not enough\n\n```text\nGET, PUT, DELETE   idempotent by the HTTP spec\nPOST, PATCH        not\n```\n\n> That is about the <b>protocol's</b> expectations, not about your handler. A `PUT` that appends to a list is not idempotent no matter what the spec says, and a `DELETE` that returns 404 on the second call is technically idempotent and practically annoying, because a retry now looks like a failure.\n>\n> The useful test is your own: <b>if this exact request arrives twice, is the end state the same?</b>\n\n---\n\n## Idempotency key\n\n<b>Idempotency key</b> (a client-supplied identifier that lets the server recognise a repeated request).\n\n```text\nIdempotency-Key: payment-abc123\n```\n\nThe server stores the key with the result. A second request with the same key returns the stored result instead of doing the work again.\n\n> Two properties make this work, and both are easy to get wrong.\n>\n> The key must be generated by the client <b>before</b> the first attempt and reused for every retry of that intent. A key generated per attempt is just a request id and prevents nothing.\n>\n> And the record must be written in the <b>same transaction</b> as the effect. Day 17's rule: if the charge commits and the key does not, the retry charges again, and you have added complexity while keeping the bug.\n\n---\n\n## The concurrent case\n\n> Storing the key after the work is done leaves a window. Two retries arriving at once both find no record, both do the work, and both write the key. The second write fails on the unique constraint, which is <b>after</b> the second charge.\n>\n> The fix is to insert the key <b>first</b>, in the same transaction, and let the unique constraint be the lock. The second request's insert fails immediately, so it never reaches the charge. That makes the database the arbiter rather than your code, which is the only version that survives two instances.\n\n---\n\n## What to return the second time\n\n> Return the <b>stored result</b>, with the original status. A client that retried and got a 200 with the original payment is a client that behaves correctly; one that gets a 409 has to special-case your API to find out it succeeded.\n>\n> One detail worth adding: store a hash of the request body with the key. If the same key arrives with a <b>different</b> body, that is a client bug, and answering 422 is far kinder than silently returning the result of a different request.\n\n---\n\n## Idempotency without a key\n\n> Sometimes you can get it for free. A natural unique constraint, `UNIQUE (order_id)` on a payments table, makes a duplicate charge impossible regardless of what any client does. That is stronger than a key because it does not depend on the client cooperating, and Day 19's point applies: a guarantee in the database is the only one a script cannot bypass.\n>\n> Reach for keys when the operation has no natural uniqueness, and reach for a constraint when it does.",
      diagram: `Idempotency: what makes retries SAFE

    POST /payments $100
      server charges it
      the RESPONSE is lost
      client sees a timeout, retries
      →  $200

    ⚠ the trap: EVERY LAYER ABOVE YOU RETRIES BY
      DEFAULT.

      the user presses the button twice
      the mobile client retries on timeout
      the load balancer retries a 502
      last lesson's helper retries a timeout

    any one of those turns one INTENT into two
    CHARGES, and none is a bug in isolation.

    → the question is not "should we handle
      duplicates". duplicates WILL arrive.

      the question is whether the SECOND ONE IS
      SAFE.


The verb is not enough

    GET · PUT · DELETE   idempotent per the spec
    POST · PATCH         not

    that is about the PROTOCOL'S expectations,
    not your handler.

      a PUT that APPENDS to a list is not
      idempotent, whatever the spec says

      a DELETE returning 404 the second time is
      technically idempotent and practically
      annoying: a retry now looks like a FAILURE

    the useful test is yours:

      IF THIS EXACT REQUEST ARRIVES TWICE, IS THE
      END STATE THE SAME?


Idempotency key

    Idempotency-Key: payment-abc123

    store the key WITH the result.
    a second request with the same key returns
    the stored result.

    ⚠ two properties, both easy to get wrong:

      1. the client generates it BEFORE the first
         attempt and reuses it for every retry of
         that INTENT

         a key generated PER ATTEMPT is just a
         request id, and prevents nothing

      2. the record is written in the SAME
         TRANSACTION as the effect  (Day 17)

         charge commits, key does not
           → the retry charges again
           → you added complexity and kept the
             bug


⚠⚠ The concurrent case

    storing the key AFTER the work leaves a
    window:

      two retries arrive at once
      both find no record
      both do the work
      both write the key
      the second write fails on the unique
        constraint

      ...which is AFTER the second charge.

    ✓ insert the key FIRST, same transaction, and
      let the UNIQUE CONSTRAINT be the lock.

      the second request's insert fails
      immediately, so it never reaches the
      charge.

      → the DATABASE is the arbiter, not your
        code, which is the only version that
        survives two instances.


What to return the second time

    the STORED RESULT, with the original status.

      a client that retried and got 200 with the
      original payment behaves correctly

      one that gets a 409 has to special-case
      your API to discover it SUCCEEDED

    ⚠ store a HASH OF THE BODY with the key.

      same key, DIFFERENT body = a client bug.
      422 is far kinder than silently returning
      the result of a different request.


Idempotency without a key

    sometimes it is free:

      UNIQUE (order_id) on payments

      makes a duplicate charge impossible
      REGARDLESS of what any client does

    stronger than a key, because it does not
    depend on the client cooperating, and Day 19
    applies: a database guarantee is the only one
    a script cannot bypass.

    keys      when there is no natural uniqueness
    constraint when there is`,
      codeExample: {
        title: "An idempotent endpoint that survives two instances",
        code: `// ── The table ───────────────────────────────────────────────
// idempotency_keys
//   key            TEXT PRIMARY KEY      ← the lock
//   user_id        INTEGER NOT NULL
//   endpoint       TEXT NOT NULL
//   request_hash   TEXT NOT NULL         ← same key, different body?
//   status         TEXT NOT NULL         'in_progress' | 'completed'
//   response_status INTEGER
//   response_body  JSONB
//   created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
//   expires_at     TIMESTAMPTZ NOT NULL
//
// The primary key is the whole mechanism. Two concurrent
// inserts of the same key: one succeeds, one fails, and the
// database decided, not your code.
//
// And note user_id. A key is scoped to a caller, or one
// client's "payment-1" collides with another's.


// ── ✗ The version with the window ───────────────────────────
app.post("/payments", async (request, reply) => {
  const key = request.headers["idempotency-key"];

  const existing = await db.select().from(idempotencyKeys)
    .where(eq(idempotencyKeys.key, key));
  if (existing.length) return reply.code(200).send(existing[0].responseBody);

  const payment = await chargeCard(request.body);          // ← the effect

  await db.insert(idempotencyKeys).values({ key, responseBody: payment });
  return reply.code(201).send(payment);
});
//
// Two retries arriving 5ms apart:
//
//   A: SELECT -> nothing
//   B: SELECT -> nothing        (A has not inserted yet)
//   A: chargeCard  ->  $100
//   B: chargeCard  ->  $100     ← the second charge
//   A: INSERT  ->  ok
//   B: INSERT  ->  unique violation
//
// B's insert failed, which tells you about the duplicate
// AFTER you made it. The check-then-act gap is the bug, and
// it is the same shape as Day 18's session fixation and
// Day 17's read-modify-write.


// ── ✓ Insert first. The constraint is the lock. ─────────────
import { createHash } from "node:crypto";
import { and, eq, lt } from "drizzle-orm";

const KEY_TTL_MS = 24 * 60 * 60 * 1000;

app.post("/payments", {
  preHandler: [authenticate, app.requirePermission("payments.create")],
  schema: {
    headers: z.object({
      "idempotency-key": z.string().min(8).max(255),
      //                 ^^^^^^^^^ required. An optional key on a
      //                 money endpoint is a key nobody sends.
    }),
    body: createPaymentSchema,
    response: { 200: paymentSchema, 201: paymentSchema, 409: errorSchema, 422: errorSchema },
  },
}, async (request, reply) => {
  const key = request.headers["idempotency-key"];
  const requestHash = createHash("sha256")
    .update(JSON.stringify(request.body))
    .digest("hex");

  // ── Step 1: claim the key, or discover it is taken ────────
  let claimed = false;
  try {
    await db.insert(idempotencyKeys).values({
      key,
      userId: request.user.id,
      endpoint: "POST /payments",
      requestHash,
      status: "in_progress",
      expiresAt: new Date(Date.now() + KEY_TTL_MS),
    });
    claimed = true;
  } catch (err) {
    if (err.code !== "23505") throw err;      // not a unique violation
  }

  if (!claimed) {
    const [prior] = await db.select().from(idempotencyKeys)
      .where(and(
        eq(idempotencyKeys.key, key),
        eq(idempotencyKeys.userId, request.user.id),
        //  ^^^^^^^^^^^^^^^^^^^^^^ Day 19: scope it to the caller,
        //  or one client reads another's stored response
      ));

    if (!prior) return reply.code(409).send({ error: "Key conflict" });

    // ⚠ Same key, different body: a client bug worth naming.
    if (prior.requestHash !== requestHash) {
      return reply.code(422).send({
        error: "Idempotency-Key was reused with a different request body",
      });
    }
    // Silently returning the first payment here would be far
    // worse: the client believes its second, different
    // payment succeeded.

    if (prior.status === "in_progress") {
      // The first attempt is still running. Tell the client to
      // come back rather than doing the work twice.
      return reply.code(409).header("retry-after", "1").send({
        error: "A request with this key is in progress",
      });
    }

    return reply.code(prior.responseStatus).send(prior.responseBody);
    //            ^^^^^^^^^^^^^^^^^^^^^^^^ the ORIGINAL status.
    //            A retry that gets the original 201 and the
    //            original body needs no special handling.
  }

  // ── Step 2: do the work and record it, atomically ─────────
  try {
    const payment = await db.transaction(async (tx) => {
      const created = await chargeAndRecord(tx, request.user.id, request.body);

      await tx.update(idempotencyKeys)
        .set({
          status: "completed",
          responseStatus: 201,
          responseBody: created,
        })
        .where(eq(idempotencyKeys.key, key));
      //  ^^ Day 17: every statement on tx. One db.update here
      //  and a rollback leaves the key marked completed with no
      //  payment, so every retry returns a success that never
      //  happened.

      return created;
    });

    return reply.code(201).send(payment);
  } catch (err) {
    // The work failed, so release the key. Otherwise the
    // client's legitimate retry gets "in progress" for 24
    // hours.
    await db.delete(idempotencyKeys)
      .where(and(eq(idempotencyKeys.key, key),
                 eq(idempotencyKeys.status, "in_progress")))
      .catch(() => {});
    throw err;
  }
});
//
// Now the concurrent case:
//
//   A: INSERT key  ->  ok
//   B: INSERT key  ->  23505, immediately
//   A: charge      ->  $100
//   B: reads the record, sees in_progress, returns 409
//
// B never reached the charge. The database served as the lock
// across both instances, with no Redis and no coordination.


// ── The external call, which is the hard half ───────────────
async function chargeAndRecord(tx, userId, input) {
  // ⚠ Day 17: no network calls inside a transaction. This
  // holds a connection and row locks for as long as the
  // provider takes.
  //
  // But the provider call must also be idempotent, or our key
  // only protects our own table. So pass OUR key down:
  const charge = await stripe.charges.create(
    { amount: input.amountCents, currency: input.currency },
    { idempotencyKey: \`\${userId}:\${input.orderId}\` },
    //                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^ stable for this
    //                 intent, so their side de-duplicates too
  );

  const [payment] = await tx.insert(payments).values({
    userId, orderId: input.orderId,
    amountCents: input.amountCents,
    providerChargeId: charge.id,
  }).returning();

  return payment;
}
// The honest structure: charge first, then open a short
// transaction to record it. A charge with no record is
// reconcilable from the provider; a record with no charge is
// money you did not take and think you did.


// ── ✓ Better, when the domain allows it ─────────────────────
// ALTER TABLE payments
//   ADD CONSTRAINT payments_order_unique UNIQUE (order_id);
//
// Now a second charge for the same order is impossible,
// whatever any client sends, and whatever any future
// developer forgets. No header, no table, no TTL.
//
// Day 19's point: a database guarantee is the only guarantee
// that also applies to a migration, an admin script and the
// next service. Prefer this whenever the operation has a
// natural uniqueness.


// ── Cleanup, or the table grows forever ─────────────────────
setInterval(async () => {
  await db.delete(idempotencyKeys).where(lt(idempotencyKeys.expiresAt, new Date()));
}, 60 * 60 * 1000).unref();
// Day 21's session lesson: a TTL column that nothing sweeps is
// a table that grows forever, and this one grows at the rate
// of your write traffic.`,
      },
      keyTakeaways: [
        "Every layer above you retries by default: the user, the mobile client, the load balancer and your own retry helper. Duplicates will arrive.",
        "So the question is not whether to handle duplicates, it is whether the second one is safe.",
        "The HTTP verb describes the protocol's expectations, not your handler. A `PUT` that appends is not idempotent.",
        "The useful test is your own: if this exact request arrives twice, is the end state the same?",
        "The client must generate the key before the first attempt and reuse it for every retry. A key per attempt is a request id and prevents nothing.",
        "Checking then acting leaves a window: two concurrent retries both find nothing, both do the work, and the second insert fails after the second charge.",
        "Insert the key first in the same transaction and let the unique constraint be the lock, so the database arbitrates across instances.",
        "Write the result in the same transaction as the effect. A committed charge with an uncommitted key means the retry charges again.",
        "Return the stored result with the original status, so a retrying client needs no special case to learn it succeeded.",
        "Store a hash of the body. The same key with a different body is a client bug, and 422 is kinder than returning another request's result.",
        "Scope keys to the caller, or one client's key collides with another's and can read their stored response.",
        "Release the key if the work fails, or a legitimate retry sees \"in progress\" for the whole TTL.",
        "A natural unique constraint beats a key, because it does not depend on the client cooperating.",
        "Sweep expired keys, or the table grows at the rate of your write traffic.",
      ],
      commonMistakes: [
        "Relying on the verb. A `PUT` or `DELETE` handler can easily not be idempotent in fact.",
        "Generating the idempotency key per attempt rather than per intent, which prevents nothing.",
        "Checking for the key and then doing the work, leaving a window where two concurrent retries both charge.",
        "Writing the key outside the transaction that performs the effect, so a rollback loses one and not the other.",
        "Returning 409 for a legitimate retry, forcing clients to special-case your API to discover their request succeeded.",
        "Ignoring the request body, so a reused key silently returns the result of a different request.",
        "Not scoping keys to a user, so one client can read another's stored response.",
        "Never clearing an `in_progress` key after a failure, so the client cannot retry for 24 hours.",
        "Making a network call inside the transaction, holding row locks for as long as the provider takes.",
        "Not passing an idempotency key to the payment provider, so your table is protected and their side is not.",
        "No sweep on the keys table, which then grows with your write traffic forever.",
      ],
      quiz: [
        {
          question: "Why is the HTTP verb not enough to decide idempotency?",
          options: [
            "The spec is ambiguous",
            "It describes the protocol's expectations, not your handler. A `PUT` that appends to a list is not idempotent.",
            "Verbs are advisory",
            "Only POST matters",
          ],
          correctIndex: 1,
          explanation:
            "The useful test is whether the same request arriving twice leaves the same end state.",
        },
        {
          question: "What is wrong with checking for the idempotency key and then doing the work?",
          options: [
            "It is slow",
            "Two concurrent retries both find nothing and both do the work, so the unique violation happens after the second charge",
            "The key may be missing",
            "It needs a transaction",
          ],
          correctIndex: 1,
          explanation:
            "Insert the key first and let the unique constraint be the lock, so the database arbitrates and the second request never reaches the effect.",
        },
        {
          question: "Why must the key record be written in the same transaction as the effect?",
          options: [
            "For speed",
            "If the charge commits and the key does not, the retry charges again, so you have added complexity and kept the bug",
            "Drizzle requires it",
            "To avoid deadlocks",
          ],
          correctIndex: 1,
          explanation:
            "Day 17's rule with a money consequence, and every statement must be on `tx`.",
        },
        {
          question: "What should a repeated request receive?",
          options: [
            "409 Conflict",
            "The stored result with the original status, so a retrying client needs no special case to learn it succeeded",
            "204 No Content",
            "A fresh result",
          ],
          correctIndex: 1,
          explanation:
            "Also store a body hash: the same key with a different body is a client bug and deserves a 422 rather than another request's result.",
        },
        {
          question: "When is a unique constraint better than an idempotency key?",
          options: [
            "Never",
            "Whenever the operation has natural uniqueness, because it does not depend on the client cooperating and a script cannot bypass it",
            "Only for reads",
            "Only in single-instance deployments",
          ],
          correctIndex: 1,
          explanation:
            "Day 19's point: a database guarantee is the only one that also applies to migrations, admin scripts and the next service.",
        },
        {
          question: "What happens if you never clear an `in_progress` key after a failure?",
          options: [
            "Nothing",
            "The client's legitimate retry gets \"in progress\" for the whole TTL, so a transient failure becomes a day-long block",
            "The key is reused",
            "The table locks",
          ],
          correctIndex: 1,
          explanation:
            "Release the claim on failure, and sweep expired keys or the table grows with your write traffic.",
        },
      ],
    },
    {
      id: "circuit-breakers",
      title: "Circuit breakers and graceful degradation",
      durationMinutes: 11,
      explanation:
        "## Circuit breaker\n\n<b>Circuit breaker</b> (a mechanism that stops calling a failing dependency for a while, instead of failing slowly every time).\n\n```text\nCLOSED     calls pass through. failures are counted.\nOPEN       calls fail immediately, without trying.\nHALF-OPEN  a few trial calls decide which way to go.\n```\n\n> What a breaker actually buys you is <b>failing fast instead of failing slow</b>, and the difference is where the cost lands. With a 3-second timeout and a dead dependency, every request occupies a connection and a database connection for 3 seconds before returning the same error. A hundred concurrent requests is your whole pool, spent on a call you already know will fail.\n>\n> Retries make this worse, not better, which is why a breaker and a retry policy belong together: the breaker is what stops the retry helper from being the thing that finishes you off.\n\n---\n\n## The states, and the one that matters\n\n> `HALF-OPEN` is the interesting state. It lets <b>one</b> request through, or a small number, and uses the result to decide. Without it a breaker either stays open forever or reopens the floodgates all at once, and the second option is how a recovering service gets knocked over on its first breath.\n>\n> Note the connection to the previous lesson: this is jitter's problem again. Everything arriving at once is the failure mode, and a controlled trickle is the fix.\n\n---\n\n## Getting the thresholds right\n\n> A breaker on a <b>count</b> of failures behaves badly at both ends of the traffic range. Five failures out of five requests should open it; five out of five thousand should not. Use a <b>rate</b> over a window, with a minimum request count so a quiet period cannot trip it on one failure.\n>\n> And decide what counts as a failure. A timeout and a 503 should. A 404 or a 400 should not, because the dependency is working perfectly and your request is wrong. A breaker that counts 4xx opens because of a bug in your own code.\n\n---\n\n## Graceful degradation\n\n<b>Graceful degradation</b> (continuing to provide useful functionality when part of the system is unavailable).\n\n```text\nRecommendations service down → show the products, hide recommendations\n```\n\n> The decision this forces is worth making <b>before</b> an incident: for each dependency, is it <b>required</b> or <b>optional</b>? An optional dependency gets a breaker and a fallback. A required one gets a breaker and an honest 503.\n>\n> The mistake is treating everything as required, which means your checkout page goes down because a recommendation service did. The opposite mistake is a fallback that quietly returns wrong data, which is worse than an error: an empty cart because the cart service failed is not degradation, it is data loss with a friendly face.\n\n---\n\n## Fallbacks that are honest\n\n> A good fallback is one where the caller can tell. Return the products with `recommendations: []` and a flag, or serve stale cached data with a header saying it is stale. Day 23's caching lesson pairs with this: a cache you are willing to serve past its TTL during an outage is the single most useful fallback there is.\n>\n> And log every open circuit at `warn` with the dependency name. A breaker that opens silently is a dependency failure you find out about from a customer.",
      diagram: `Circuit breaker: FAIL FAST, not fail SLOW

    CLOSED     calls pass. failures counted.
    OPEN       calls fail IMMEDIATELY, no attempt.
    HALF-OPEN  a few trial calls decide.

    what it buys you, concretely:

      3-second timeout + a dead dependency

      every request occupies
        a connection
        a DATABASE connection      (Day 17)
      for 3 seconds, to return the same error

      100 concurrent requests = YOUR WHOLE POOL,
      spent on a call you already know fails

    ⚠ and retries make this WORSE.

      a breaker is what stops the retry helper
      from being the thing that finishes you off.


HALF-OPEN is the interesting state

    it lets ONE request through, or a few, and
    uses the result to decide.

    without it a breaker either
      stays open forever
      or reopens the floodgates ALL AT ONCE

    and the second is how a recovering service
    gets knocked over on its first breath.

    → jitter's problem again. everything arriving
      at once is the failure mode; a controlled
      trickle is the fix.


⚠ Thresholds: a RATE, not a COUNT

    a count behaves badly at both ends:

      5 failures out of 5        → should open
      5 failures out of 5,000    → should NOT

    use a rate over a window, WITH a minimum
    request count, so a quiet period cannot trip
    it on one failure.


⚠ And decide what COUNTS as a failure

    should count      timeout · 503 · connection
                      reset
    should NOT        404 · 400

    the dependency is working perfectly and YOUR
    REQUEST is wrong.

    a breaker that counts 4xx opens because of a
    bug in your own code.


Graceful degradation

    recommendations down
      → show the products, hide recommendations

    the decision this forces, and make it BEFORE
    an incident:

      for each dependency, is it REQUIRED or
      OPTIONAL?

      optional  → breaker + fallback
      required  → breaker + an honest 503

    ⚠ treating everything as required means your
      checkout goes down because a recommendation
      service did.

    ⚠ the opposite mistake is worse:

      a fallback that quietly returns WRONG data.

      an empty cart because the cart service
      failed is not degradation. it is DATA LOSS
      WITH A FRIENDLY FACE.


Fallbacks that are honest

    a good fallback is one the CALLER CAN TELL
    ABOUT.

      recommendations: [] plus a flag
      stale cached data plus a header saying so

    → Day 23 pairs with this: a cache you are
      willing to serve PAST ITS TTL during an
      outage is the single most useful fallback
      there is.

    and log every open circuit at warn with the
    dependency name.

    a breaker that opens silently is a dependency
    failure you hear about FROM A CUSTOMER.`,
      codeExample: {
        title: "A breaker with a rate threshold and an honest fallback",
        code: `// ── src/lib/circuit-breaker.js ──────────────────────────────
export class CircuitBreaker {
  constructor({
    name,
    windowMs = 10_000,
    minRequests = 20,        // ⚠ so 1 failure in a quiet minute
                             //   cannot open it
    failureRate = 0.5,
    openMs = 30_000,
    halfOpenMax = 3,
    isFailure = (err) => true,
  }) {
    Object.assign(this, {
      name, windowMs, minRequests, failureRate, openMs, halfOpenMax, isFailure,
    });
    this.state = "closed";
    this.buckets = [];
    this.openedAt = 0;
    this.halfOpenInFlight = 0;
  }

  record(ok) {
    const now = Date.now();
    this.buckets.push({ at: now, ok });
    this.buckets = this.buckets.filter((b) => now - b.at < this.windowMs);
  }

  shouldOpen() {
    // A RATE, not a count, with a floor on volume.
    if (this.buckets.length < this.minRequests) return false;
    const failures = this.buckets.filter((b) => !b.ok).length;
    return failures / this.buckets.length >= this.failureRate;
  }

  async run(fn) {
    if (this.state === "open") {
      if (Date.now() - this.openedAt < this.openMs) {
        throw new CircuitOpenError(this.name);
        //    ^^^^^^^^^^^^^^^^^^^ fails in microseconds instead
        //    of holding a connection for the full timeout
      }
      this.transition("half-open");
    }

    if (this.state === "half-open") {
      // Let a trickle through, not a flood. This is the whole
      // point of the state.
      if (this.halfOpenInFlight >= this.halfOpenMax) {
        throw new CircuitOpenError(this.name);
      }
      this.halfOpenInFlight++;
    }

    try {
      const result = await fn();

      if (this.state === "half-open") {
        this.transition("closed");
        this.buckets = [];
      } else {
        this.record(true);
      }
      return result;
    } catch (err) {
      // ⚠ Not every error is a dependency failure. A 404 means
      // the dependency is working and our request is wrong.
      if (!this.isFailure(err)) throw err;

      if (this.state === "half-open") {
        this.transition("open");     // one trial failure is enough
      } else {
        this.record(false);
        if (this.shouldOpen()) this.transition("open");
      }
      throw err;
    } finally {
      if (this.state === "half-open") this.halfOpenInFlight--;
    }
  }

  transition(next) {
    if (this.state === next) return;
    const from = this.state;
    this.state = next;
    if (next === "open") this.openedAt = Date.now();

    // Day 21: never open silently. This is a dependency
    // outage, and you want to know before a customer tells you.
    log()[next === "closed" ? "info" : "warn"]({
      dependency: this.name, from, to: next,
      failureRate: this.buckets.length
        ? this.buckets.filter((b) => !b.ok).length / this.buckets.length
        : 0,
    }, \`circuit \${next}\`);

    circuitState.record(next === "closed" ? 0 : next === "half-open" ? 1 : 2,
      { dependency: this.name });
  }
}

export class CircuitOpenError extends AppError {
  constructor(dependency) {
    super(\`\${dependency} is unavailable\`, {
      statusCode: 503, code: "dependency_unavailable", expose: false,
    });
    this.dependency = dependency;
  }
}


// ── Only count real dependency failures ─────────────────────
const recommendationsBreaker = new CircuitBreaker({
  name: "recommendations",
  isFailure: (err) => {
    // Timeouts and transport failures: yes.
    if (err.name === "TimeoutError") return true;
    if (["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT"].includes(err.code)) return true;
    // 5xx: yes. 4xx: no, that is our bug, not their outage.
    if (err.status) return err.status >= 500;
    return false;
  },
});
//
// Without isFailure, a bug that sends a malformed request 100
// times opens the circuit on a perfectly healthy service, and
// you spend the incident looking at the wrong system.


// ── ✓ An OPTIONAL dependency: breaker + honest fallback ─────
export async function getRecommendations(userId) {
  try {
    return await recommendationsBreaker.run(() =>
      withRetry(async () => {
        const res = await fetch(\`https://recs.internal/users/\${userId}\`, {
          signal: AbortSignal.timeout(300),
          //                          ^^^ short. This is a
          //                          nice-to-have, so it gets a
          //                          nice-to-have budget.
        });
        if (!res.ok) {
          const e = new Error(\`recs \${res.status}\`);
          e.status = res.status;
          throw e;
        }
        return res.json();
      }, { attempts: 2 }),
    );
  } catch (err) {
    log().warn({ err, userId }, "recommendations unavailable, degrading");
    return null;      // ← not [], and not a throw. See below.
  }
}

app.get("/products", async (request) => {
  // The required dependency is not wrapped in a fallback: if
  // the products are gone, there is no page.
  const products = await listProducts(app.db);

  const recommendations = await getRecommendations(request.user?.id);

  return {
    products,
    recommendations: recommendations ?? [],
    // ⚠ The flag is the honest part. Without it the client
    // cannot tell "no recommendations for you" from
    // "recommendations are broken", so it renders an empty
    // section as if it were the truth.
    degraded: recommendations === null ? ["recommendations"] : [],
  };
});


// ── ✗✗ The fallback that is worse than an error ─────────────
async function getCartItems(userId) {
  try {
    return await cartBreaker.run(() => fetchCart(userId));
  } catch {
    return [];      // ← NO.
  }
}
//
// The user sees an empty cart. They may re-add everything, or
// abandon the purchase, or open a support ticket saying you
// lost their order. An empty array is a claim that the cart is
// empty, and you do not know that.
//
// ✓ For a required dependency, say so:
async function getCartItems(userId) {
  return cartBreaker.run(() => fetchCart(userId));
  // Let CircuitOpenError propagate. Day 22's handler turns it
  // into a 503 with no detail, and the client shows "we cannot
  // load your cart right now", which is true.
}


// ── ✓ The best fallback: stale cache ────────────────────────
export async function getPricing(productId) {
  try {
    const fresh = await pricingBreaker.run(() =>
      fetchPricing(productId, { signal: AbortSignal.timeout(500) }));
    await redis.set(\`pricing:\${productId}\`, JSON.stringify(fresh), { EX: 300 });
    await redis.set(\`pricing:stale:\${productId}\`, JSON.stringify(fresh), { EX: 86400 });
    //               ^^^^^^^^^^^^^ a deliberately long-lived copy,
    //               kept only for this case
    return { data: fresh, stale: false };
  } catch (err) {
    const stale = await redis.get(\`pricing:stale:\${productId}\`);
    if (stale) {
      log().warn({ err, productId }, "serving stale pricing");
      return { data: JSON.parse(stale), stale: true };
    }
    throw err;
  }
}
// Day 23 in advance: an hour-old price is usually far better
// than no price, and the caller knows which it got. This is
// the highest-value fallback pattern there is, and it needs a
// second cache entry with a much longer TTL than the one you
// serve normally.


// ── Classify every dependency, in writing ───────────────────
// docs/dependencies.md
//
//   dependency        required?  timeout  fallback
//   postgres          REQUIRED   2s       none, 503
//   redis (cache)     optional   100ms    go to postgres
//   redis (sessions)  REQUIRED   200ms    none, 503
//   recommendations   optional   300ms    omit + degraded flag
//   pricing           REQUIRED   500ms    stale cache, then 503
//   email             optional   2s       queue for later
//   analytics         optional   1s       drop silently
//
// Making this table is most of the work. Once each row has an
// answer, the code writes itself, and during an incident
// nobody has to decide under pressure whether the checkout
// page may render without recommendations.`,
      },
      keyTakeaways: [
        "A circuit breaker's value is failing fast rather than slow: with a 3-second timeout, a hundred requests to a dead dependency spend your whole pool on a known failure.",
        "Retries make that worse, which is why a breaker is what stops your retry helper from finishing you off.",
        "`HALF-OPEN` is the important state. It lets a trickle through, because reopening all at once is how a recovering service gets knocked over again.",
        "Threshold on a failure rate over a window, not a count, with a minimum request count so a quiet period cannot trip it.",
        "Decide what counts as a failure. Timeouts and 5xx should; 404 and 400 should not, because the dependency is fine and your request is wrong.",
        "A breaker that counts 4xx opens on a bug in your own code and sends you to investigate the wrong system.",
        "Classify every dependency as required or optional before an incident. Optional gets a fallback; required gets an honest 503.",
        "Treating everything as required means a recommendation service can take down checkout.",
        "A fallback that quietly returns wrong data is worse than an error. An empty cart is data loss with a friendly face.",
        "Make fallbacks detectable: a `degraded` flag or a staleness header, so the client can tell \"none\" from \"broken\".",
        "The best fallback is a deliberately long-lived stale cache entry, separate from the one you serve normally.",
        "Log every state transition at `warn` with the dependency name, or a dependency outage reaches you via a customer.",
      ],
      commonMistakes: [
        "No breaker at all, so every request pays the full timeout to learn what the last hundred already established.",
        "Opening on a raw failure count, which trips on five failures out of five thousand and never trips at low volume.",
        "Counting 4xx as dependency failures, so your own bug opens the circuit on a healthy service.",
        "No half-open state, so recovery is either never or all at once.",
        "Returning an empty array as a fallback for a required dependency, which claims something false about the user's data.",
        "A fallback the caller cannot detect, so an empty section renders as if it were the truth.",
        "Treating every dependency as required, so an optional service takes down a critical page.",
        "Serving stale data without saying it is stale.",
        "Keeping only one cache entry, so there is nothing to serve when the TTL has passed and the dependency is down.",
        "A breaker that changes state without logging, so nobody knows a dependency is out.",
      ],
      quiz: [
        {
          question: "What does a circuit breaker actually buy you?",
          options: [
            "Fewer errors",
            "Failing fast instead of slow: with a 3-second timeout, a hundred concurrent requests would otherwise spend your whole connection pool on a call you know will fail",
            "Automatic retries",
            "Better error messages",
          ],
          correctIndex: 1,
          explanation:
            "And it is what stops a retry policy from adding load to something already failing.",
        },
        {
          question: "Why is `HALF-OPEN` the state that matters?",
          options: [
            "It reduces latency",
            "It lets a trickle of requests decide, because reopening all at once is how a recovering service gets knocked over on its first breath",
            "It resets the counters",
            "It is required by the pattern",
          ],
          correctIndex: 1,
          explanation:
            "The same problem jitter solves in the retry lesson: everything arriving at once is the failure mode.",
        },
        {
          question: "Why threshold on a rate rather than a count of failures?",
          options: [
            "Rates are easier to compute",
            "Five failures out of five should open it and five out of five thousand should not, so a count behaves badly at both ends",
            "Counts overflow",
            "Rates are more standard",
          ],
          correctIndex: 1,
          explanation:
            "Add a minimum request count too, so one failure during a quiet period cannot trip it.",
        },
        {
          question: "Should a 404 from a dependency count as a breaker failure?",
          options: [
            "Yes, it is an error",
            "No. The dependency is working and your request is wrong, so counting it means your own bug opens the circuit on a healthy service.",
            "Only if repeated",
            "Only for GET requests",
          ],
          correctIndex: 1,
          explanation:
            "Count timeouts, transport failures and 5xx. Anything else sends you to investigate the wrong system.",
        },
        {
          question: "Why is returning `[]` a bad fallback for a cart service?",
          options: [
            "It is slow",
            "An empty array claims the cart is empty, which you do not know. The user may re-add everything or think you lost their order.",
            "Arrays cannot be cached",
            "It breaks the schema",
          ],
          correctIndex: 1,
          explanation:
            "That is data loss with a friendly face. For a required dependency, let the error propagate and return an honest 503.",
        },
        {
          question: "What is the most useful fallback pattern?",
          options: [
            "An empty default",
            "A deliberately long-lived stale cache entry, separate from the normal one, served with a flag saying it is stale",
            "Retrying forever",
            "A hard-coded response",
          ],
          correctIndex: 1,
          explanation:
            "An hour-old price is far better than no price, and keeping a second entry with a much longer TTL is what makes it available.",
        },
      ],
    },
    {
      id: "let-it-crash",
      title: "Letting the process crash",
      durationMinutes: 11,
      explanation:
        "Sometimes the correct error handling is to <b>stop</b>.\n\n```text\nUncaught exception\nUnhandled rejection\nFatal startup failure\nImpossible internal state\nOut of memory\n```\n\n---\n\n## Why continuing is worse\n\n> An uncaught exception means a callback stopped part way through, so you do not know what ran and what did not: a transaction may be open, a lock may be held, a counter may be half-incremented. Day 4 established this and it deserves restating here, because the tempting fix is exactly wrong.\n>\n> ```javascript\n> process.on(\"uncaughtException\", (err) => { logger.error(err); });   // ✗\n> ```\n>\n> That keeps a process running whose state you cannot reason about, and it will now serve requests using that state. A crash loses the in-flight requests; a zombie corrupts data slowly and passes its health check while doing it.\n\n---\n\n## Supervisor restart\n\n<b>Supervisor</b> (whatever restarts your process when it exits: Kubernetes, systemd, a platform runtime).\n\n```text\nfatal error → log at fatal → exit non-zero → supervisor restarts → healthy\n```\n\n> This is the part that makes crashing a strategy rather than a failure: <b>a fresh process is a known state</b>, and starting one takes a second. So the whole approach depends on two things being true, and both are your job.\n>\n> Your process must actually <b>exit non-zero</b>, or the supervisor thinks it finished successfully and may not restart it. And startup must be <b>fast and idempotent</b>, because a crash loop that takes thirty seconds per attempt is an outage either way.\n\n---\n\n## Crash, but crash properly\n\n> Exiting immediately drops every in-flight request, so an uncaught exception costs you a burst of 502s. You can do better without pretending to recover: log at `fatal`, fail readiness so Day 21's load balancer stops routing, give in-flight requests a couple of seconds, then exit.\n>\n> Bound that with a timer. A shutdown that hangs is worse than an abrupt one, because the supervisor waits for its grace period before killing you, and you have turned two seconds into thirty.\n\n---\n\n## What to crash on, and what not to\n\n```text\nCrash        uncaught exception, unhandled rejection, failed startup,\n             a required dependency missing at boot\nDo not crash a failed request, a validation error, a dependency timeout,\n             one bad message on a queue\n```\n\n> The distinction is <b>process-level versus request-level</b>. A failing request has a caller waiting for an answer, and the answer is a 500. A corrupted process has no such scope: there is no one request to blame and no way to contain it.\n>\n> The mistake in the other direction is real too. `process.exit(1)` because a payment provider timed out means one dependency's bad afternoon becomes a restart loop, which is the circuit breaker lesson done backwards.\n\n---\n\n## Crash loops\n\n> A process that dies on startup restarts forever, and the failure you see is not the cause. Two habits make this survivable: log the fatal error <b>before</b> exiting, so the reason is in your aggregator and not only in a terminal nobody is watching; and rely on Day 20's fail-fast config validation, which turns \"missing `JWT_SECRET`\" into a clear message at boot rather than a crash on the first login.\n>\n> Also expect your supervisor's backoff. Kubernetes backs a `CrashLoopBackOff` off to minutes, so a bad deploy that crashes on boot gets slower to fix as it retries, and the fix is a rollback rather than patience.",
      diagram: `Sometimes the correct handling is to STOP

    uncaught exception
    unhandled rejection
    fatal startup failure
    impossible internal state
    out of memory


⚠⚠ Why continuing is worse

    an uncaught exception means a callback stopped
    PART WAY THROUGH.

    you do not know what ran:
      a transaction may be open
      a lock may be held
      a counter may be half-incremented

    so the tempting fix is exactly wrong:

      process.on("uncaughtException",
        err => logger.error(err));        ✗

    that keeps a process running whose state you
    CANNOT REASON ABOUT, and it will now serve
    requests using that state.

      a CRASH loses the in-flight requests
      a ZOMBIE corrupts data slowly, and passes
        its health check while doing it


Supervisor restart

    fatal error
      → log at fatal
      → exit NON-ZERO
      → supervisor restarts
      → healthy

    what makes this a STRATEGY rather than a
    failure: A FRESH PROCESS IS A KNOWN STATE,
    and starting one takes a second.

    so it depends on two things, both your job:

      your process must actually EXIT NON-ZERO,
      or the supervisor thinks it finished
      successfully

      startup must be FAST AND IDEMPOTENT,
      because a crash loop at 30 seconds per
      attempt is an outage either way


Crash, but crash PROPERLY

    exiting immediately drops every in-flight
    request → a burst of 502s.

    you can do better without pretending to
    recover:

      log at fatal
      FAIL READINESS so the balancer stops
        routing        (Day 21)
      give in-flight requests a couple of seconds
      exit

    ⚠ bound that with a timer.

      a shutdown that HANGS is worse than an
      abrupt one: the supervisor waits out its
      grace period before killing you, and you
      turned 2 seconds into 30.


What to crash on

    CRASH
      uncaught exception
      unhandled rejection
      failed startup
      a required dependency missing at boot

    DO NOT CRASH
      a failed request
      a validation error
      a dependency timeout
      one bad message on a queue

    the distinction is PROCESS-LEVEL vs
    REQUEST-LEVEL:

      a failing request has a caller waiting, and
      the answer is a 500

      a corrupted process has no such scope: no
      one request to blame, no way to contain it

    ⚠ and the opposite mistake is real:

      process.exit(1) because a payment provider
      timed out turns one dependency's bad
      afternoon into a RESTART LOOP.

      that is the circuit breaker lesson,
      backwards.


⚠ Crash loops

    a process that dies on startup restarts
    forever, and what you SEE is not the cause.

    two habits:

      LOG THE FATAL ERROR BEFORE EXITING, so the
      reason is in your aggregator and not only
      in a terminal nobody watches

      rely on Day 20's fail-fast config
      validation, which turns "missing
      JWT_SECRET" into a clear boot message
      instead of a crash on first login

    and expect your supervisor's BACKOFF.

      Kubernetes backs CrashLoopBackOff off to
      MINUTES, so a bad deploy gets slower to fix
      as it retries.

      the fix is a ROLLBACK, not patience.`,
      codeExample: {
        title: "Crashing on purpose, and crashing well",
        code: `// ── src/server.js ───────────────────────────────────────────
import { buildApp } from "./app.js";
import { config } from "./config.js";
import { logger } from "./logger.js";

const app = buildApp();
let shuttingDown = false;

// ── Startup: fail fast and loudly ───────────────────────────
try {
  // Day 20 already validated config at import time, so a
  // missing JWT_SECRET never reached here.
  await app.ready();          // runs onReady: db connectivity, etc.
  await app.listen({ port: config.server.port, host: config.server.host });
} catch (err) {
  // Log BEFORE exiting. In a crash loop this line is the only
  // evidence, and it needs to reach your aggregator rather
  // than a terminal nobody is watching.
  logger.fatal({ err }, "failed to start");
  process.exit(1);
  //           ^ non-zero. exit(0) tells the supervisor the
  //           process finished successfully, and some will not
  //           restart it. You get a silently missing instance.
}


// ── ✗ The tempting mistake ──────────────────────────────────
// process.on("uncaughtException", (err) => {
//   logger.error({ err }, "uncaught exception, continuing");
// });
//
// The process now runs with state you cannot reason about.
// Whatever was mid-flight stopped somewhere unknown: maybe
// after the charge and before the record, maybe holding a
// transaction, maybe with a lock nobody will release.
//
// And it keeps serving requests and passing its health check
// while doing it, which is the part that makes this worse than
// crashing. A crash costs you the in-flight requests. A zombie
// costs you data you will find out about next week.


// ── ✓ Crash, with a short drain ─────────────────────────────
async function fatal(err, source) {
  if (shuttingDown) return process.exit(1);   // a second one: just go
  shuttingDown = true;

  // 1. Record it. This is the whole reason anyone will be able
  //    to fix this.
  logger.fatal({ err, source }, "fatal error, shutting down");

  // 2. Best-effort telemetry flush, bounded. Never block
  //    shutdown on a network call.
  await Promise.race([
    Promise.allSettled([
      Sentry.flush(2000),
      sdk.shutdown(),
    ]),
    sleep(2500),
  ]).catch(() => {});

  // 3. Day 21: fail readiness so the balancer stops routing,
  //    then let in-flight requests finish.
  app.setReady?.(false);

  // 4. Bounded. A drain that hangs turns 2 seconds into the
  //    supervisor's full 30-second grace period.
  await Promise.race([app.close(), sleep(3000)]).catch(() => {});

  process.exit(1);
}

process.on("uncaughtException", (err) => fatal(err, "uncaughtException"));
process.on("unhandledRejection", (err) => fatal(err, "unhandledRejection"));
//                                ^^^ Day 4: since Node 15 this
//                                already terminates by default,
//                                and handling it explicitly is
//                                what gets the log line out


// ── Graceful shutdown, for the ordinary case ────────────────
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, "shutdown requested");

    app.setReady?.(false);                      // Day 21
    await sleep(config.shutdownDelayMs ?? 5000);  // let the LB notice
    await app.close();
    await sdk.shutdown().catch(() => {});
    process.exit(0);
    //           ^ ZERO here. This was a requested shutdown, and
    //           a non-zero exit on a normal deploy shows up as
    //           a failure in every dashboard you own.
  });
}
// Note the two exit codes. Same shutdown machinery, different
// meaning: 1 says "something was wrong", 0 says "you asked".


// ── ⚠ Do NOT crash for these ────────────────────────────────
// A failed request. There is a caller waiting, and the answer
// is a 500 from Day 22's handler.
app.post("/orders", async (request, reply) => {
  const order = await createOrder(app.db, request.body);   // may throw
  return reply.code(201).send(order);
});

// A dependency timeout. This is the circuit breaker's job, and
// exiting turns one provider's bad afternoon into a restart
// loop across your whole fleet.
// ✗ catch (err) { logger.fatal({ err }); process.exit(1); }
// ✓ catch (err) { throw new DependencyError("payments", err); }

// One bad message on a queue. Crashing means the message is
// redelivered to a fresh process, which crashes, forever.
worker.on("message", async (msg) => {
  try {
    await handle(msg);
    await msg.ack();
  } catch (err) {
    log().error({ err, messageId: msg.id }, "message failed");
    if (msg.attempts >= 3) {
      await msg.moveToDeadLetter();
      //     ^^^^^^^^^^^^^^^^^^^ the containment a queue gives
      //     you that a request does not: park it and keep going
    } else {
      await msg.retry({ delayMs: 1000 * 2 ** msg.attempts });
    }
  }
});
//
// This is the poison-message crash loop, and it is the most
// common way "let it crash" is applied wrongly. One malformed
// payload takes down every worker, repeatedly, and the queue
// never drains.


// ── The fatal cases worth an explicit crash ─────────────────
// A schema your code cannot possibly work against.
const [{ version }] = await db.execute(sql\`SELECT current_setting('server_version_num') AS version\`);
if (Number(version) < 130000) {
  logger.fatal({ version }, "unsupported PostgreSQL version");
  process.exit(1);
}
// Better a clear message at boot than a confusing failure on
// the one query that uses a newer feature.

// An invariant that means your assumptions are wrong.
function applyLedgerEntry(balance, entry) {
  const next = balance + entry.amount;
  if (!Number.isFinite(next)) {
    // Not a request problem. Something upstream is producing
    // values this code was never designed for, and continuing
    // writes nonsense to a ledger.
    logger.fatal({ balance, entry }, "non-finite balance computed");
    process.exit(1);
  }
  return next;
}


// ── What makes crashing survivable ──────────────────────────
// 1. Startup is fast. Measure it. A 30-second boot means a
//    crash loop is an outage even with a working restart.
//
// 2. Startup is idempotent. Restarting mid-migration must not
//    leave a half-applied schema, which is why Day 17 said to
//    run migrations as a deploy step and not from server.js.
//
// 3. In-flight work is recoverable. A crash mid-request costs
//    a 500. A crash mid-transaction rolls back, which is what
//    Day 17's transactions bought you. A crash mid-"charge
//    then record" is why the idempotency lesson exists.
//
// 4. You can see the reason. Every fatal path logs before
//    exiting.
//
// Without those four, "let it crash" is just crashing.


// ── The test worth having ───────────────────────────────────
test("an uncaught exception exits non-zero", async () => {
  const { code } = await execFileAsync(process.execPath, [
    "-e", \`
      process.on("uncaughtException", () => process.exit(1));
      setTimeout(() => { throw new Error("boom"); }, 1);
    \`,
  ]).catch((e) => e);

  assert.equal(code, 1);
});
// Crude, and it catches a real regression: somebody adding a
// handler that logs and continues. That change looks
// responsible in a diff and it is the whole bug.`,
      },
      keyTakeaways: [
        "An uncaught exception means a callback stopped part way through, so a transaction may be open and a lock may be held. You cannot reason about the state.",
        "Handling `uncaughtException` by logging and continuing keeps a process serving requests with that state, and it passes its health check while doing it.",
        "A crash costs you the in-flight requests. A zombie corrupts data slowly and you find out next week.",
        "Crashing works because a fresh process is a known state and starting one takes a second.",
        "You must exit non-zero. `exit(0)` tells the supervisor the process finished successfully, and some will not restart it.",
        "Crash properly: log at `fatal`, fail readiness so the balancer stops routing, drain briefly, then exit.",
        "Bound the drain with a timer. A hanging shutdown makes the supervisor wait out its full grace period.",
        "Use exit code 1 for a fatal error and 0 for a requested shutdown, or every normal deploy shows as a failure.",
        "Crash on process-level problems. Do not crash on a failed request, a dependency timeout or one bad queue message.",
        "The poison-message crash loop is the most common misapplication: one malformed payload takes down every worker forever. Use a dead-letter queue.",
        "Log the fatal error before exiting, because in a crash loop that line is the only evidence.",
        "Day 20's config validation is what turns \"missing `JWT_SECRET`\" into a clear boot message rather than a crash on first login.",
        "Crashing is survivable only if startup is fast and idempotent, in-flight work is recoverable, and the reason is logged.",
        "Expect supervisor backoff: a `CrashLoopBackOff` grows to minutes, so a bad deploy needs a rollback rather than patience.",
      ],
      commonMistakes: [
        "An `uncaughtException` handler that logs and continues, which looks responsible in a diff and is the whole bug.",
        "Exiting with code 0 after a fatal error, so the supervisor believes the process finished successfully.",
        "Exiting immediately, dropping every in-flight request when a two-second drain would have saved them.",
        "An unbounded drain, which turns a short shutdown into the supervisor's full grace period.",
        "Using exit code 1 for a requested `SIGTERM` shutdown, making every deploy look like a crash.",
        "Calling `process.exit(1)` because a dependency timed out, turning one provider's outage into a fleet-wide restart loop.",
        "Crashing on a bad queue message, so the redelivered message crashes the next process forever.",
        "Exiting without logging first, leaving a crash loop with no evidence of the cause.",
        "Running migrations from `server.js`, so a restart mid-migration leaves a half-applied schema.",
        "A slow startup, which makes a crash loop an outage even when restarts work.",
      ],
      quiz: [
        {
          question: "Why is logging an uncaught exception and continuing worse than crashing?",
          options: [
            "It is slower",
            "The callback stopped part way through, so a transaction may be open or a lock held. The process keeps serving requests with state you cannot reason about, and passes its health check.",
            "The log is unreliable",
            "Node forbids it",
          ],
          correctIndex: 1,
          explanation:
            "A crash costs you in-flight requests. A zombie corrupts data slowly and you find out next week.",
        },
        {
          question: "Why does the exit code matter?",
          options: [
            "Only for logs",
            "`exit(0)` tells the supervisor the process finished successfully, so some will not restart it and you get a silently missing instance",
            "Non-zero codes are logged differently",
            "It sets the restart delay",
          ],
          correctIndex: 1,
          explanation:
            "Use 1 for a fatal error and 0 for a requested shutdown, or every normal deploy appears as a failure.",
        },
        {
          question: "What is the most common misapplication of \"let it crash\"?",
          options: [
            "Crashing on a 500",
            "Crashing on one bad queue message, so the redelivered message kills the next process forever. Use a dead-letter queue.",
            "Crashing at startup",
            "Crashing on SIGTERM",
          ],
          correctIndex: 1,
          explanation:
            "A queue gives you containment a request does not: park the message and keep going.",
        },
        {
          question: "Why bound the drain with a timer when crashing?",
          options: [
            "To exit faster",
            "A hanging shutdown makes the supervisor wait out its full grace period, so two seconds becomes thirty",
            "Node requires it",
            "To flush logs",
          ],
          correctIndex: 1,
          explanation:
            "Fail readiness, give in-flight requests a couple of seconds, and exit whether or not the drain finished.",
        },
        {
          question: "What makes crashing a viable strategy rather than just crashing?",
          options: [
            "A supervisor",
            "Fast idempotent startup, recoverable in-flight work, a non-zero exit, and the reason logged before exiting",
            "A health check",
            "Restart backoff",
          ],
          correctIndex: 1,
          explanation:
            "Without those, a crash loop at thirty seconds per attempt is an outage even with a working supervisor.",
        },
        {
          question: "Should a dependency timeout cause `process.exit(1)`?",
          options: [
            "Yes, it is unrecoverable",
            "No. That turns one provider's bad afternoon into a fleet-wide restart loop. It is the circuit breaker's job.",
            "Only in production",
            "Only for databases",
          ],
          correctIndex: 1,
          explanation:
            "Crash on process-level problems. A dependency failure is request-level and has a caller waiting for a 503.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "`class NotFoundError extends Error` sets only `statusCode`. What is `err.name`?",
      options: [
        "`\"NotFoundError\"`",
        "`\"Error\"`, because `Error`'s constructor takes `name` from `Error.prototype`",
        "`undefined`",
        "`\"AppError\"`",
      ],
      correctIndex: 1,
      explanation:
        "Verified. So an error tracker groups every custom error into one issue. Fix it with `this.name = this.constructor.name`.",
    },
    {
      question: "What does `JSON.stringify(err)` produce for that error?",
      options: [
        "The message and stack",
        "`{\"statusCode\":404}`, because `message` and `stack` are non-enumerable on `Error`",
        "`{}`",
        "It throws",
      ],
      correctIndex: 1,
      explanation:
        "Verified, and the same root cause as Day 21's Pino finding. So `reply.send(err)` silently loses the message.",
    },
    {
      question: "With no `setErrorHandler`, what does Fastify send for an error with `statusCode = 503`?",
      options: [
        "A generic message",
        "The status plus the error's own message, so `connect ECONNREFUSED 10.0.1.42:5432` reaches the client",
        "A stack trace",
        "An empty body",
      ],
      correctIndex: 1,
      explanation:
        "Verified. It honours the status correctly and exposes the message at every status, including 500 and 503.",
    },
    {
      question: "Why is \"never expose stack traces\" the wrong rule?",
      options: [
        "Stacks are safe",
        "Fastify does not send stacks. It sends messages, which is where the host, port and file paths live.",
        "Production strips them automatically",
        "Clients ignore them",
      ],
      correctIndex: 1,
      explanation:
        "The real rule is that a 5xx message is internal by default and a 4xx message is part of your API contract.",
    },
    {
      question: "What does `setErrorHandler` not cover?",
      options: [
        "Validation errors",
        "A request matching no route, which uses Fastify's own 404 shape unless you also set `setNotFoundHandler`",
        "Thrown strings",
        "Async handlers",
      ],
      correctIndex: 1,
      explanation:
        "That is the most frequently hit error in any API, and the one most likely to escape your contract.",
    },
    {
      question: "Why should a service throw domain errors rather than HTTP-shaped ones?",
      options: [
        "Performance",
        "It has other callers. The same function runs from a queue consumer and a script, and the mapping is a product decision better kept in one table.",
            "HTTP errors cannot carry data",
        "Fastify forbids it",
      ],
      correctIndex: 1,
      explanation:
        "The payoff: the same error can be a 409 to a route and an expected skip to a worker.",
    },
    {
      question: "What is the difference a client acts on between 409 and 422?",
      options: [
        "None",
        "409 means the request conflicts with current state so retrying later could succeed; 422 means it is unprocessable regardless of state",
        "409 is for writes only",
        "422 is newer",
      ],
      correctIndex: 1,
      explanation:
        "\"Order already completed\" is a 409. \"Amount must be positive\" is not fixed by waiting.",
    },
    {
      question: "What is the value of separating Problem Details' `type` from `detail`?",
      options: [
        "Shorter responses",
        "`type` is a stable identifier a client branches on and `detail` is free text a human reads, so you can reword an error without breaking clients",
        "`type` is required by HTTP",
        "It enables translation",
      ],
      correctIndex: 1,
      explanation:
        "When the message is the contract, every reword is a breaking change. Treat `type` like a database column name.",
    },
    {
      question: "How do you distinguish a `fetch` timeout from a caller's cancellation?",
      options: [
        "`instanceof TimeoutError`",
        "By `err.name`: both are `DOMException`, named `TimeoutError` and `AbortError`",
        "By the status code",
        "You cannot",
      ],
      correctIndex: 1,
      explanation:
        "Verified. It matters because a timeout is retryable and a cancellation is not, so `instanceof` fails in the dangerous direction.",
    },
    {
      question: "What was measured for 1000 clients retrying at attempt three?",
      options: [
        "The delays spread naturally",
        "1 distinct retry time without jitter and 363 with it, so without jitter all 1000 land in the same millisecond",
        "No difference",
        "Jitter made it worse",
      ],
      correctIndex: 1,
      explanation:
        "Backoff spaces out your own attempts. Only jitter prevents a synchronised spike at a recovering service.",
    },
    {
      question: "What is the third retry limit people leave out?",
      options: [
        "An attempt cap",
        "A budget capping retries as a share of traffic, so a total dependency outage cannot double the load you send it",
        "Growing delays",
        "A per-attempt timeout",
      ],
      correctIndex: 1,
      explanation:
        "Attempts and backoff limit one caller. A budget limits the aggregate, which is what a retry storm is made of.",
    },
    {
      question: "Why create `AbortSignal.timeout` per attempt rather than per call?",
      options: [
        "It is cheaper",
        "One created per call keeps counting through the backoff, so every attempt after the first aborts immediately",
        "Signals cannot be reused",
        "To avoid a leak",
      ],
      correctIndex: 1,
      explanation:
        "Combine it with the caller's signal via `AbortSignal.any`, so the request stops for whichever comes first.",
    },
    {
      question: "What is wrong with checking for an idempotency key and then doing the work?",
      options: [
        "It is slow",
        "Two concurrent retries both find nothing and both do the work, so the unique violation happens after the second charge",
        "The key may be missing",
        "It needs a transaction",
      ],
      correctIndex: 1,
      explanation:
        "Insert the key first and let the unique constraint be the lock, so the database arbitrates across instances.",
    },
    {
      question: "What should a repeated idempotent request receive?",
      options: [
        "409 Conflict",
        "The stored result with the original status, so a retrying client needs no special case to learn it succeeded",
        "204 No Content",
        "A fresh result",
      ],
      correctIndex: 1,
      explanation:
        "Store a body hash too: the same key with a different body is a client bug that deserves a 422.",
    },
    {
      question: "When is a unique constraint better than an idempotency key?",
      options: [
        "Never",
        "Whenever the operation has natural uniqueness, because it does not depend on the client cooperating and a script cannot bypass it",
        "Only for reads",
        "Only with one instance",
      ],
      correctIndex: 1,
      explanation:
        "Day 19's point: a database guarantee is the only one that also covers migrations, admin scripts and the next service.",
    },
    {
      question: "Why threshold a circuit breaker on a rate rather than a count?",
      options: [
        "Rates are easier",
        "Five failures out of five should open it and five out of five thousand should not, so a count behaves badly at both ends",
        "Counts overflow",
        "It is more standard",
      ],
      correctIndex: 1,
      explanation:
        "Add a minimum request count, so one failure in a quiet period cannot trip it.",
    },
    {
      question: "Should a 404 from a dependency count as a breaker failure?",
      options: [
        "Yes",
        "No. The dependency is working and your request is wrong, so counting it means your own bug opens the circuit on a healthy service.",
        "Only if repeated",
        "Only for GETs",
      ],
      correctIndex: 1,
      explanation:
        "Count timeouts, transport failures and 5xx. Anything else sends you to investigate the wrong system.",
    },
    {
      question: "Why is returning `[]` a bad fallback for a cart service?",
      options: [
        "It is slow",
        "An empty array claims the cart is empty, which you do not know, so the user may re-add everything or believe you lost their order",
        "Arrays cannot be cached",
        "It breaks the schema",
      ],
      correctIndex: 1,
      explanation:
        "Data loss with a friendly face. For a required dependency, let the error propagate and answer with an honest 503.",
    },
    {
      question: "Why is logging an uncaught exception and continuing worse than crashing?",
      options: [
        "It is slower",
        "The callback stopped part way through, so the process serves requests with state you cannot reason about while passing its health check",
        "The log is unreliable",
        "Node forbids it",
      ],
      correctIndex: 1,
      explanation:
        "A crash costs you the in-flight requests. A zombie corrupts data slowly and you find out next week.",
    },
    {
      question: "What is the most common misapplication of \"let it crash\"?",
      options: [
        "Crashing on a 500",
        "Crashing on one bad queue message, so the redelivered message kills the next process forever. Use a dead-letter queue.",
        "Crashing at startup",
        "Crashing on SIGTERM",
      ],
      correctIndex: 1,
      explanation:
        "A queue gives containment a request does not. Crash on process-level problems, not request-level ones.",
    },
  ],
  project: {
    name: "day-22",
    goal: "Build one error contract across an API, then prove it holds: no 5xx leaks an internal message, every error is a problem document, retries are safe, and a duplicate payment is impossible under concurrency.",
    brief:
      "This day has three findings you should see with your own eyes rather than take on trust. Fastify's default handler exposes the error message at every status, so a 503 from a database driver publishes its host, and \"do not leak stack traces\" would not have saved you. A custom error class reports its name as Error until you set it, so your error tracker groups everything together. And an idempotency check written the obvious way still charges twice under concurrency. Reproduce all three before fixing them, then write the three tests at the end, because they are what keeps the contract true after you move on.",
    steps: [
      "Start from your Day 21 project or create `day-22/` with `\"type\": \"module\"` and install `fastify`, `zod`, `pino`, `drizzle-orm` and `pg`.",
      "Write three routes that throw a custom error with `statusCode` 404, 503 and a plain `Error`, with no `setErrorHandler`, and record all three response bodies.",
      "Confirm the 503 body contains a fake connection string you put in the message, and write down why \"do not leak stack traces\" would not have prevented it.",
      "Log `new NotFoundError(\"x\").name` and `JSON.stringify(new NotFoundError(\"x\"))`, and record both.",
      "Write `src/errors.js` with an `AppError` base that sets `this.name`, `statusCode`, `code`, `expose` and passes `cause` through.",
      "Add subclasses for validation, unauthorized, forbidden, not found, conflict and dependency, and confirm `name` is now correct.",
      "Throw an `AppError` with a `cause`, log it with pino under the key `err`, and confirm the cause chain appears.",
      "Write `src/domain/errors.js` with three domain errors that carry no status codes at all.",
      "Write a service that throws `OrderAlreadyCompleted`, then call it from a route and from a small script, and give each a different response.",
      "Write `src/http/error-map.js` mapping domain errors to `AppError` subclasses, with a loud log on the default branch.",
      "Add a domain error and deliberately do not map it, then confirm you get a 500 and a log line telling you what is missing.",
      "Write the test asserting every exported domain error class has a mapping.",
      "Write `setErrorHandler` producing problem documents, with `detail` omitted when `expose` is false, and confirm the content type is `application/problem+json`.",
      "Add `setNotFoundHandler`, then request a route that does not exist and confirm it is now a problem document too.",
      "Map `error.validation` into an `errors` array, send a body with two invalid fields, and confirm both come back in one response.",
      "Write the test asserting no 5xx body contains your fake connection string, including the 503 case.",
      "Add a `withRetry` helper with `isRetryable`, an attempt cap, full jitter and a retry budget.",
      "Verify `AbortSignal.timeout(1)` and `controller.abort()` give the same class with different names, and record both.",
      "Point the helper at a local server that always times out, and confirm it stops after the cap rather than forever.",
      "Log the delays across five attempts with and without jitter, and record the distinct values across 1000 simulated clients.",
      "Create the timeout signal once outside the retry loop, confirm later attempts abort instantly, then move it inside.",
      "Build `POST /payments` with the naive check-then-act idempotency, fire two concurrent identical requests, and count the charges.",
      "Rewrite it to insert the key first inside the transaction, repeat, and confirm only one charge happens.",
      "Send the same key with a different body and confirm you get a 422 rather than the first payment.",
      "Make the charge fail after the key is claimed, then confirm a legitimate retry is not blocked for the full TTL.",
      "Add a `UNIQUE (order_id)` constraint on payments and explain in a comment what it protects that the key does not.",
      "Write a circuit breaker with a rate threshold, a minimum request count, a half-open state and an `isFailure` predicate.",
      "Point it at a dependency returning 404s and confirm the circuit stays closed.",
      "Point it at one returning 503s and confirm it opens, then recovers through half-open.",
      "Add an optional dependency with a fallback and a `degraded` flag in the response.",
      "Add a required dependency with no fallback and confirm it produces a 503 with no detail.",
      "Implement the stale-cache fallback with a second long-TTL entry and a `stale: true` flag.",
      "Write `docs/dependencies.md` classifying every dependency as required or optional with a timeout and a fallback.",
      "Add an `uncaughtException` handler that logs at `fatal`, fails readiness, drains for two seconds with a bound, and exits 1.",
      "Throw from a `setTimeout`, and confirm an in-flight request completes and the process exits non-zero.",
      "Change the handler to log and continue, repeat, and note that the process keeps serving and passes its health check.",
      "Write a worker loop that moves a poison message to a dead-letter queue instead of crashing, then feed it a malformed payload.",
    ],
    acceptance: [
      "You have the three verified default-handler bodies recorded, including the 503 containing your fake connection string.",
      "You can explain why the usual \"do not expose stack traces\" advice would not have prevented that leak.",
      "You recorded `err.name` as `\"Error\"` before the fix and the subclass name after.",
      "You recorded `JSON.stringify(err)` and can say why `reply.send(err)` loses the message.",
      "An `AppError` with a `cause` logs the full chain under the `err` key.",
      "No file in `src/domain/` contains a status code. `grep -rn statusCode src/domain/` finds nothing.",
      "The same domain error produces a 409 from a route and a logged skip from a script.",
      "An unmapped domain error produces a 500 and a log line naming the file to edit, and the mapping test fails.",
      "Every error response, including for an unmatched route, is `application/problem+json` with `type`, `title`, `status` and `requestId`.",
      "No 5xx body contains your connection string, and the test covers the 503 case specifically.",
      "A two-field validation failure returns both fields in one response.",
      "You recorded the `TimeoutError` and `AbortError` names, and your `isRetryable` treats them differently.",
      "You have the distinct-retry-time counts with and without jitter across 1000 simulated clients.",
      "You saw later retry attempts abort instantly with a shared timeout signal, and correctly with a per-attempt one.",
      "Two concurrent identical payments charged twice with the naive version and once after the fix.",
      "The same key with a different body returns 422.",
      "A failed charge releases the key so a retry is possible immediately.",
      "The breaker stays closed for 404s and opens for 503s, then recovers through half-open.",
      "An optional dependency failing produces a response with a `degraded` flag; a required one produces a 503 with no detail.",
      "The stale-cache fallback serves an old value with `stale: true` when the dependency is down.",
      "`docs/dependencies.md` classifies every dependency with a timeout and a fallback.",
      "An uncaught exception exits non-zero after completing an in-flight request, and you observed the difference when handled by logging and continuing.",
      "A malformed queue message reaches the dead-letter queue and the worker keeps running.",
      "`npx tsc --noEmit` passes if you used TypeScript, and `node --test` passes.",
    ],
    stretch: [
      "Add a `Retry-After` header and a `retryAfter` field to your 429 problem document, then make your own retry helper honour it.",
      "Add an `openapi.json` describing every problem `type` your API can return, and diff it after adding a new error.",
      "Implement `AbortSignal.any` combining a per-attempt timeout, an overall deadline and the caller's signal.",
      "Add a metric counting retries by dependency and outcome, with bounded labels only, then watch it during an induced outage.",
      "Make the idempotency key optional on one endpoint and required on another, and write down which you would ship.",
      "Add a second instance behind a proxy and confirm the idempotency constraint still holds across both.",
      "Measure the p99 of an endpoint calling a dead dependency with and without a breaker, and record both.",
      "Add a half-open state that admits one request per second rather than a fixed count, and explain the difference.",
      "Simulate a crash loop with a deliberately broken config, and observe your supervisor's backoff behaviour.",
      "Write a test that fails if anyone adds an `uncaughtException` handler that does not exit.",
    ],
  },
};
