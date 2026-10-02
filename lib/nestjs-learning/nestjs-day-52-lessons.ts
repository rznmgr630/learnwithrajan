import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_52_LESSONS: LessonDay = {
  day: 52,
  title: "Idempotency",
  totalMinutes: 80,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-52-lesson-1",
      title: "Idempotent Requests and Duplicate Requests",
      durationMinutes: 20,
      explanation: `
<b>Imagine a customer taps "Place Order" on their phone.</b> The button spinner appears, then disappears. Nothing happens. The customer taps again. And again. Their network is flaky — maybe they are on a train, maybe the wifi drops for a second. All three taps happen within 800 milliseconds.

Your server receives three identical \`POST /orders\` requests. The order service creates three orders, charges the customer three times, and reserves three sets of inventory. The customer is furious. This scenario — the <b>duplicate request problem</b> — is one of the most common and most expensive bugs in distributed systems. It is the reason idempotency exists.

<b>What does "idempotent" actually mean?</b> A request is idempotent if sending it once has the same observable effect as sending it many times. In HTTP terms, this is a formal property of certain methods:

- <b>GET</b> — idempotent (fetching a resource does not change it).
- <b>HEAD</b> — idempotent (like GET, no body).
- <b>PUT</b> — idempotent (replacing a resource with the same value multiple times is the same as doing it once).
- <b>DELETE</b> — idempotent (deleting an already-deleted resource is a no-op; the resource ends up gone either way).
- <b>POST</b> — <b>not idempotent</b> by default (each call typically creates a new resource).
- <b>PATCH</b> — <b>not idempotent</b> in general (the effect depends on the current state of the resource).

So the HTTP spec already tells us that POST and PATCH are the dangerous ones. That is exactly where idempotency keys come into play (lesson 2). But before we get there, we need to understand <i>why</i> duplicate requests happen in the first place.

<b>Sources of duplicate requests:</b>

1. <b>User double-clicks or taps.</b> The UI disables the button, but only after the first request is dispatched. If the network is slow, the button stays enabled and the user tries again.
2. <b>Client retries on timeout.</b> A request succeeds on the server but the response is lost (network blip, client killed, browser tab closed). The client cannot know whether the request was processed, so it retries. Now there are two orders.
3. <b>Automatic retries by SDKs and HTTP clients.</b> Many HTTP clients (axios with retries, fetch with an interceptor, mobile SDK libraries) retry on 5xx errors and timeouts. This is normally good — but it duplicates POSTs.
4. <b>Message queue redelivery.</b> If you process orders via a queue (SQS, RabbitMQ, Kafka), messages are usually "at least once" delivery. The same message can be delivered multiple times, especially under load or during broker recovery.
5. <b>Webhook redelivery.</b> Payment providers, shipping providers, and other third parties retry webhooks until they receive a 2xx. If your webhook handler is slow to acknowledge, you get duplicates.
6. <b>API gateway retries.</b> Some gateways (e.g. AWS API Gateway, some service meshes) retry failed requests automatically.
7. <b>Network-level duplication.</b> Rare but real. A router can, in theory, duplicate packets. TCP handles this, but HTTP/2 streams and higher-level retries can still duplicate the request from the application's perspective.
8. <b>User navigation and refresh.</b> The user refreshes the "confirm" page and the browser resubmits the form.

<b>Notice the pattern:</b> almost none of these are the user's fault. The system — clients, networks, servers — is inherently unreliable. It is not a matter of "if" a duplicate request happens, but "when." Every serious API must plan for it.

<b>What breaks when duplicates happen?</b>
- <b>Payments.</b> Charging a customer twice is the classic disaster. It causes refunds, support tickets, and sometimes legal issues.
- <b>Orders.</b> Creating two orders for the same purchase confuses fulfillment and shipments.
- <b>Inventory.</b> Deducting stock twice can leave you unable to fulfill orders you thought were in stock.
- <b>Emails and SMS.</b> Sending a welcome email twice is annoying; sending a "your account is locked" SMS three times is alarming.
- <b>Rewards and coupons.</b> Granting loyalty points twice, or applying a coupon twice, is a silent money leak.
- <b>User creation.</b> Two users with the same email, or two accounts linked to the same OAuth identity.

<b>How do people normally fix this?</b> The naive approach is to try to prevent duplicates at the client:

\`\`\`typescript
// Client-side only — not reliable.
button.disabled = true;
await fetch('/api/orders', { method: 'POST', body });
button.disabled = false;
\`\`\`

This reduces accidental double-clicks but does not help with retries, network duplication, or client crashes. It is a UX improvement, not a correctness guarantee. Never rely on the client to enforce server-side invariants.

The next attempt is to detect duplicates at the database level:

\`\`\`sql
-- A unique constraint on something that identifies the "same" request.
ALTER TABLE orders ADD CONSTRAINT uniq_order_per_customer_per_minute
  UNIQUE (customer_id, cart_hash, created_minute);
\`\`\`

This can work for very specific cases, but it is brittle. What if the customer legitimately wants to place the same order twice? What if the cart changes between retries? What if the retry happens ten minutes later? Constraints on business data are not a general solution.

<b>The general solution is an idempotency key</b> — a unique value the client generates and sends with each logical operation. The server records processed keys and refuses to reprocess the same one. That is the topic of lesson 2. But the concept belongs here: idempotency is a <i>contract between client and server</i>, and the key is what makes the contract enforceable.

<b>Idempotency is not a client-side problem.</b> This is where beginners get confused. It is tempting to think "if the client just did not retry, we would not have this problem." But the client cannot know whether the request succeeded — that is the fundamental problem in distributed systems. The network is unreliable, timeouts are ambiguous, and retries are inevitable. The only place you can <i>enforce</i> idempotency is on the server, where you know what has actually happened.

<b>Idempotency also applies outside POST.</b> PUT and DELETE are naturally idempotent — calling them twice has the same effect. But <i>your implementation</i> can still break this property if you are careless. For example:

\`\`\`typescript
// BAD: this "PUT" is not idempotent.
async replaceWishlist(userId: number, items: Item[]) {
  await this.wishlistRepo.delete({ userId });
  await this.wishlistRepo.insert(items.map(i => ({ ...i, userId })));
  // ... but meanwhile, other requests can see the empty state.
}
\`\`\`

The delete-then-insert pattern is not atomic, and if the request is retried, the second call may run in the middle of the first. Good PUT implementations use upserts or transactions to stay truly idempotent.

<b>What can go wrong?</b>
- <b>Assuming the client will not retry.</b> Every HTTP client with retry logic (axios, fetch wrappers, SDKs) can duplicate a request. Every mobile network can drop a response. Assume duplicates.
- <b>Trusting the client to disable the button.</b> A UX layer, not a correctness layer.
- <b>Relying on unique constraints on business data.</b> Works for narrow cases but breaks for legitimate duplicates (repeat orders, same email entered twice intentionally).
- <b>Not testing under retry conditions.</b> If your tests never simulate duplicates, you never learn how the system behaves.
- <b>Breaking idempotency with side effects.</b> A PUT that also sends an email is idempotent in the database but not in the inbox. Side effects must be idempotency-aware too.
- <b>Mixing idempotent and non-idempotent operations in one endpoint.</b> A \`POST /orders\` that also increments a "orders placed" counter in a metrics table can double-count if retried.
- <b>Assuming idempotency is only for payments.</b> Any state-mutating operation (POST, PATCH, or an unusual DELETE) can be affected.

<b>How this appears in a real application:</b> a food delivery app receives the same "create order" request twice because the customer's phone lost signal mid-request. Without idempotency, the restaurant receives two identical orders, the customer is charged twice, and support has to untangle it manually. With an idempotency key, the second request is recognized as a duplicate and returns the same response as the first.

<b>How experienced engineers think about this:</b> they assume duplicates <i>will</i> happen, design every state-changing endpoint with that assumption, and treat idempotency as a first-class requirement rather than a nice-to-have. The default HTTP semantics already give us idempotency for GET, PUT, and DELETE — the real work is making POST and PATCH safe as well. That is what lesson 2 addresses.
      `,
      diagram: `
The Duplicate Request Problem

  Client                Server              Database
    |                     |                    |
    |-- POST /orders ---->|                    |
    |                     |-- INSERT order --->|
    |                     |<-- order 1001 -----|
    |<-- 201 Created -----|                    |
    |  (response lost)    |                    |
    |                     |                    |
    |-- retry: POST /orders ->|                |
    |                     |-- INSERT order --->|
    |                     |<-- order 1002 -----|
    |<-- 201 Created -----|                    |
    |                     |                    |
    ^                     ^                    ^
    |                     |                    |
  Two identical orders, two charges, one angry customer.

HTTP method idempotency (from the spec):

  GET     idempotent
  HEAD    idempotent
  PUT     idempotent
  DELETE  idempotent
  POST    NOT idempotent
  PATCH   NOT idempotent

Common sources of duplicates:
  - double-click / double-tap
  - client timeout + retry
  - SDK / HTTP client automatic retry
  - queue "at least once" delivery
  - webhook redelivery
  - gateway retry
  - browser form resubmit

The fix: idempotency keys (lesson 2).
      `,
      codeExample: { title: "Example", code: `
// ============================================
// DUPLICATE REQUESTS — THE PROBLEM AND FIRST STEPS
// ============================================

// ---------- 1. The naive endpoint (broken under retries) ----------
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    // 1. Create the order.
    const order = await this.ordersService.create(dto);

    // 2. Charge the customer.
    // If the request is retried, this charges them AGAIN.
    const charge = await this.paymentsService.charge({
      amount: order.total,
      customerId: dto.customerId,
    });

    // 3. Send a confirmation email.
    // Retry -> customer gets a second email.
    await this.notificationsService.sendOrderConfirmation(order);

    return order;
  }
}

// ---------- 2. Client-side guard (necessary, not sufficient) ----------
// Frontend: disable the button to reduce accidental double-clicks.
//
//   button.disabled = true;
//   try {
//     await api.post('/orders', payload);
//   } finally {
//     button.disabled = false;
//   }
//
// This prevents the easiest case but does NOT prevent:
//   - client retries after a timeout
//   - SDK retries
//   - queue redelivery
//   - webhook redelivery

// ---------- 3. Database uniqueness on business data (narrow fit) ----------
// Works when there is a natural key that uniquely identifies the operation.
// Example: "one subscription per customer per plan per month".
//
// CREATE UNIQUE INDEX uniq_subscription_per_month
//   ON subscriptions (customer_id, plan_id, date_trunc('month', created_at));
//
// Fails when:
//   - the same operation is legitimately allowed twice (repeat purchase)
//   - the identifying data changes between retries
//   - the retry happens outside the uniqueness window

// ---------- 4. Non-idempotent PUT (a subtle bug) ----------
// PUT is idempotent by HTTP semantics, but this implementation is not,
// because of the non-atomic delete + insert and possible concurrent reads.
async replaceWishlist(userId: number, items: Item[]) {
  await this.wishlistRepo.delete({ userId });
  // Between these two statements, another request sees an empty wishlist,
  // and a retry can double-insert.
  await this.wishlistRepo.insert(items.map(i => ({ ...i, userId })));
}

// ---------- 5. Side-effect idempotency ----------
// Even if the database row is idempotent, the side effect (email) may not be.
async updateOrderStatus(orderId: number, status: OrderStatus) {
  const order = await this.ordersRepo.findOneByOrFail({ id: orderId });

  if (order.status === status) {
    // Early exit keeps the DB idempotent but does NOT prevent
    // re-sending the email on a retry if the state has not been committed yet.
    return order;
  }

  order.status = status;
  await this.ordersRepo.save(order);

  // Side effect: fires once per state change, but a retry that lands
  // between save and email can send two emails.
  await this.mailer.sendStatusChangeEmail(order);
  return order;
}

// ---------- 6. A test that simulates duplicate requests ----------
// test/orders.e2e-spec.ts
import * as request from 'supertest';

it('creates only ONE order when the client retries', async () => {
  const payload = {
    customerId: 42,
    items: [{ productId: 101, quantity: 1 }],
  };

  // Fire the same request twice, back-to-back.
  const [first, second] = await Promise.all([
    request(app.getHttpServer()).post('/orders').send(payload),
    request(app.getHttpServer()).post('/orders').send(payload),
  ]);

  // Ideally, both responses describe the SAME order.
  // Without idempotency, two orders will exist.
  const allOrders = await request(app.getHttpServer()).get('/orders?customerId=42');
  expect(allOrders.body.items).toHaveLength(1);
});

// This test fails on the naive implementation in section 1.
// Lesson 2 fixes it with idempotency keys.
      ` },
      keyTakeaways: [
        "Idempotent means: sending the request once has the same effect as sending it many times.",
        "HTTP gives idempotency for free on GET, HEAD, PUT, and DELETE — but not on POST or PATCH.",
        "Duplicate requests come from client retries, SDK retries, queue redelivery, webhook redelivery, and gateway retries.",
        "Client-side guards (disabling buttons) reduce accidental duplicates but do not guarantee correctness.",
        "Unique constraints on business data are narrow solutions, not general ones.",
        "Even 'idempotent' PUTs can become non-idempotent if the implementation is not atomic.",
        "Side effects (emails, SMS, push notifications, counters) must be considered for idempotency too.",
        "Assume duplicates will happen. Design every state-changing endpoint accordingly.",
      ],
      commonMistakes: [
        "<b>Relying on the client to not retry.</b> Every HTTP client and mobile network can duplicate requests. The only place you can enforce idempotency is on the server.",
        "<b>Trusting unique constraints on business data to be a general solution.</b> They work when there is a natural key that uniquely identifies the operation, which is uncommon. Use an idempotency key for the general case.",
        "<b>Overlooking side effects.</b> A database insert that is idempotent can still fire an email twice. Side effects must also be idempotency-aware.",
        "<b>Assuming PUT is always idempotent in your code.</b> The HTTP spec declares PUT idempotent, but your implementation can violate this with non-atomic operations.",
        "<b>Not testing under duplicate conditions.</b> Tests that fire a request once never catch duplicate bugs. Add explicit 'send twice' tests.",
        "<b>Mixing idempotent and non-idempotent work in one endpoint.</b> A POST that also increments a counter or appends to a log will double-count on retry.",
        "<b>Assuming only payment endpoints need idempotency.</b> Any state-changing endpoint can be affected: order creation, subscription changes, inventory updates, user creation, reward grants.",
        "<b>Relying on short-lived deduplication windows.</b> A retry after five minutes can slip past a one-minute window and duplicate. Match the window to how long retries can actually occur.",
      ],
      quiz: [
        {
          question:
            "Which HTTP methods are idempotent by the standard?",
          options: [
            "POST and PATCH",
            "GET, HEAD, PUT, and DELETE",
            "Only GET",
            "Only POST",
          ],
          correctIndex: 1,
          explanation:
            "GET, HEAD, PUT, and DELETE are idempotent by HTTP semantics. POST and PATCH are not. This is why idempotency keys (lesson 2) are needed for POST-like operations.",
        },
        {
          question:
            "A mobile client sends a POST request, the response is lost due to a bad network, and the client retries. What is the most likely outcome without idempotency?",
          options: [
            "The retry is rejected by the server.",
            "The operation is performed twice, creating two resources.",
            "The server detects the retry automatically.",
            "The request is queued until the first one completes.",
          ],
          correctIndex: 1,
          explanation:
            "The server cannot distinguish a retry from a new request without an idempotency key. The operation runs a second time, creating duplicates. This is the classic source of double-charges.",
        },
        {
          question:
            "Why is disabling the submit button on the client not a complete solution to duplicates?",
          options: [
            "Because buttons cannot be disabled in all browsers.",
            "Because it prevents accidental double-clicks but does nothing about client retries, SDK retries, queue redelivery, or network-level duplication.",
            "Because the button might be re-enabled by the framework.",
            "Because users can press Enter instead.",
          ],
          correctIndex: 1,
          explanation:
            "Client-side guards reduce one class of duplicates (double-tap) but are not a correctness guarantee. The server must enforce idempotency independently of the client.",
        },
        {
          question:
            "Why can a 'PUT' endpoint end up being non-idempotent even though PUT is idempotent by the HTTP spec?",
          options: [
            "Because the spec is wrong.",
            "Because the implementation can use non-atomic operations (like delete-then-insert) or trigger side effects that are not idempotent.",
            "Because clients can bypass PUT.",
            "Because PUT is not actually idempotent.",
          ],
          correctIndex: 1,
          explanation:
            "The spec describes the intended semantics. Your implementation must honor them. A delete-then-insert without a transaction, or a PUT that fires an email, breaks idempotency in practice.",
        },
      ],
    },
    {
      id: "day-52-lesson-2",
      title: "Idempotency Keys and Storage",
      durationMinutes: 22,
      explanation: `
<b>We know duplicates happen.</b> The question is how to make the server immune to them. The answer used by Stripe, Square, PayPal, and most large payment and order platforms is the <b>idempotency key</b>.

The idea is simple: the client generates a unique identifier (usually a UUID) for each logical operation and sends it with the request, usually in a header called \`Idempotency-Key\`. The server stores the key the first time it is used, along with the response it produced. If the same key arrives again, the server returns the <i>cached response</i> — it does not re-execute the operation.

<b>Where the key comes from.</b> The client generates it. Not the server. The client knows when two requests are the "same logical operation" (e.g. the same button tap that was retried). The server cannot know this. So the client:

1. Generates a UUID (v4 or v7) when the user initiates an action.
2. Stores it in memory or session storage until the action completes.
3. Sends it with every retry of that action.
4. Discards it once the action completes successfully.

\`\`\`typescript
// Frontend example
const idempotencyKey = crypto.randomUUID();

async function submitOrder(payload: CreateOrderPayload) {
  return fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
}
\`\`\`

The client must reuse the <i>same</i> key for retries of the same logical operation. If it generates a new key on every retry, idempotency is defeated.

<b>What the server does.</b> The flow, in order:

1. Client sends a request with \`Idempotency-Key: abc-123\`.
2. Server checks its idempotency store: "Have we seen \`abc-123\` before?"
3. If <b>no</b> — the key is new:
   - Insert a record with the key and a status of "in progress".
   - Execute the operation.
   - On success, store the response body and status under the same key.
   - Return the response.
4. If <b>yes, and the operation completed</b> — return the stored response as-is.
5. If <b>yes, and the operation is still in progress</b> — return a \`409 Conflict\` with \`Retry-After\` (or a \`202 Accepted\`) telling the client to wait.

This handles all the duplicate scenarios. The first request does the work; every subsequent request with the same key returns the same result.

<b>Storing the key.</b> The idempotency record needs a few fields:

- \`key\` (unique, indexed).
- \`request_hash\` — a hash of the request body, so you can detect if the same key is being used with a different payload.
- \`status\` — \`in_progress\`, \`completed\`, or \`failed\`.
- \`response_status\` — HTTP status of the original response (e.g. 201).
- \`response_body\` — the JSON body of the original response.
- \`created_at\`, \`expires_at\` — timestamps for retention and cleanup.
- \`user_id\` or \`tenant_id\` — so one customer cannot collide with another's keys.

In PostgreSQL:

\`\`\`sql
CREATE TABLE idempotency_keys (
  key             UUID PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  request_hash    TEXT NOT NULL,
  status          TEXT NOT NULL,           -- in_progress | completed | failed
  response_status INTEGER,
  response_body   JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at      TIMESTAMPTZ NOT NULL,
  UNIQUE (key, user_id)
);

CREATE INDEX idx_idempotency_expires_at ON idempotency_keys (expires_at);
\`\`\`

Notice the composite unique constraint \`(key, user_id)\`. Two different users can (in theory) generate the same UUID by coincidence, or a malicious user could send another user's key. Scoping the uniqueness to the user prevents cross-user collisions and prevents key reuse across tenants.

<b>Handling the in-progress case.</b> This is where most implementations get it wrong. If two requests arrive nearly simultaneously with the same key:

- Request A: sees no existing record, inserts \`in_progress\`, begins work.
- Request B: sees the existing \`in_progress\` record.

Request B should <b>not</b> execute the operation again. It should either:
- Return \`409 Conflict\` with a body explaining the request is being processed and the client should retry later. This is what Stripe does.
- Wait (with a short timeout) for the operation to complete, then return the same response as Request A.

The \`409\` approach is simpler and stateless. The "wait" approach gives a smoother client experience but requires server-side waiting and is more complex. For most APIs, \`409\` with a \`Retry-After\` header is the right choice.

<b>Atomicity and race conditions.</b> The check-and-insert must be atomic. Two requests with the same key arriving in the same millisecond can both see "no existing record" and both attempt to insert. The database unique constraint on \`key\` prevents the second insert from succeeding — it must then be handled by reading the existing record and following the in-progress or completed path.

In TypeORM:

\`\`\`typescript
try {
  await this.idempotencyRepo.insert({
    key,
    userId,
    requestHash,
    status: 'in_progress',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
} catch (err) {
  // Unique violation: another request with the same key is in flight.
  const existing = await this.idempotencyRepo.findOneBy({ key, userId });
  // Handle according to status.
}
\`\`\`

<b>Storing the response.</b> Store both the status code and the response body. This lets you replay the exact response to a duplicate request. Store it as JSONB in Postgres, or in a key-value store (Redis) with a TTL.

If the operation returned a large binary (a PDF receipt, a generated image), store a reference (URL, file id) rather than the raw bytes. Replaying the reference is cheap; replaying bytes is expensive.

<b>Response on replay.</b> When a duplicate request hits and the original completed successfully, return:
- The original HTTP status (201, 200, etc.).
- The original response body.
- An additional header like \`Idempotent-Replay: true\` so clients (and logs) can tell the difference. Stripe does something similar.

Returning the original status matters. If a client retries after creating an order, they expect to receive the same order id, not a new one. Returning \`201 Created\` with the same body is the correct behavior.

<b>Response on payload mismatch.</b> If the same key is used with a different request body, this is a client bug. Return \`422 Unprocessable Entity\` (or \`400 Bad Request\`) with a message explaining the key is already used for a different request. Do not silently overwrite.

In practice, you compare a hash of the request body (or the important fields) with the stored \`request_hash\`. If they differ, reject.

<b>TTL and retention.</b> Idempotency keys cannot live forever. They expire after a window that must cover the longest realistic retry window:
- 24 hours is the common default (Stripe uses 24 hours).
- For high-value operations (payments), some systems use 7 days.
- For internal services, 1 hour can be enough.

Expired keys are deleted by a scheduled job. Keeping the table small keeps lookups fast.

\`\`\`sql
DELETE FROM idempotency_keys WHERE expires_at < now();
\`\`\`

<b>Idempotency with transactions.</b> The idempotency record and the business operation must be committed together. If you insert the idempotency row, then the database crashes before the business row is written, the key exists but the operation never happened. On a retry, the client sees "already done" but the order does not exist. The fix: wrap both writes in a single transaction. If the transaction rolls back, both rows disappear, and the client can retry cleanly.

\`\`\`typescript
await this.dataSource.transaction(async (manager) => {
  await manager.insert(IdempotencyKey, {
    key, userId, requestHash, status: 'in_progress', expiresAt,
  });
  const order = await this.ordersService.create(dto, manager);
  await manager.update(IdempotencyKey, { key, userId }, {
    status: 'completed',
    responseStatus: 201,
    responseBody: order,
  });
  return order;
});
\`\`\`

<b>When should clients generate the key?</b> When they initiate a user-facing action that mutates state and could be retried. Concretely:
- Placing an order.
- Processing a payment.
- Creating a subscription.
- Sending an invitation.
- Triggering an asynchronous job.

They should <b>not</b> generate keys for:
- Reads (GET).
- Naturally idempotent operations (PUT, DELETE) — the semantics already handle it.
- Trivial operations where duplicate execution is harmless.

The rule of thumb: use idempotency keys on <b>POST endpoints that create or change something meaningful.</b>

<b>Should the key be required or optional?</b>
- <b>Required:</b> The client must always send one. Safer, but more rigid. Good for payment APIs.
- <b>Optional:</b> The client sends one when it cares about duplicates. Simpler, but requires the client to be aware of the risk.

For payment and order APIs, require it. For internal or low-risk APIs, optional is fine.

<b>What can go wrong?</b>
- <b>Client generates a new key on each retry.</b> This completely defeats idempotency. The server sees every request as new. Document loudly: "reuse the key for retries."
- <b>Key stored before the operation succeeds, but the operation then fails.</b> On retry, the server sees the key and returns the failed response. This is often fine (the client learns the operation failed) but can also block legitimate retries. Some systems record failures as "final" and others as "retryable." Choose a policy.
- <b>No TTL.</b> The table grows without bound. Lookups slow down. Add expiry and cleanup.
- <b>Non-atomic check-and-insert.</b> Two concurrent requests both insert and both execute. Enforce with a database unique constraint.
- <b>Payload hash not stored.</b> A client reuses a key with a different body and the server replays the old response. Silent data corruption. Store the hash and reject mismatches.
- <b>Response stored in the wrong format.</b> Storing only the response body without the status code means replays return the wrong status. Store both.
- <b>Storing huge responses.</b> A 100 MB response stored per idempotency key wastes disk and slows replay. Store a reference for large payloads.
- <b>Key scoped globally instead of per user.</b> Cross-user collisions cause one user to see another's response. Always scope by user or tenant.
- <b>No \`Retry-After\` on 409.</b> Clients hit the endpoint repeatedly without backoff, causing load. Always return \`Retry-After\`.
- <b>Using the same key for different operations.</b> A key for "create order" should not also be used for "cancel order." Treat each logical operation as distinct, with its own key.

<b>How this appears in a real application.</b> A payments API uses \`Idempotency-Key\` on every charge, refund, and payout. The key is scoped to the merchant, stored with the request hash and the response, and expires after 24 hours. Duplicate requests return the original response with \`Idempotent-Replay: true\`. In-flight duplicates return \`409 Conflict\` with \`Retry-After: 1\`. A scheduled job purges expired records. The result: merchants can retry aggressively without fear, and the API remains correct under concurrency.

<b>How experienced engineers think.</b> Idempotency keys are a small, well-understood pattern that pays for itself immediately. They are simple to implement, robust under load, and provide a real safety net for the most expensive classes of bugs. If your API has any endpoint that costs money or creates durable state, it should have idempotency keys.
      `,
      diagram: `
Idempotency Key Flow

  Client                            Server                        Idempotency Store
    |                                 |                                 |
    |-- POST /orders ---------------->|                                 |
    |   Idempotency-Key: abc-123      |                                 |
    |                                 |-- lookup key abc-123 --------->|
    |                                 |<-- not found -------------------|
    |                                 |                                 |
    |                                 |-- insert in_progress --------->|
    |                                 |<-- ok -------------------------|
    |                                 |                                 |
    |                                 |-- run business logic --         |
    |                                 |   (create order, charge, etc.)  |
    |                                 |                                 |
    |                                 |-- update to completed -------->|
    |                                 |   store status + body           |
    |<-- 201 Created, order 1001 -----|                                 |
    |                                 |                                 |
    |   ... network blip ...          |                                 |
    |                                 |                                 |
    |-- retry POST /orders ---------->|                                 |
    |   Idempotency-Key: abc-123      |-- lookup key abc-123 --------->|
    |                                 |<-- completed, resp 201 --------|
    |<-- 201 Created, order 1001 -----|   (same body, replayed)         |
    |   Idempotent-Replay: true       |                                 |

Concurrent case:
  Req A and Req B arrive at nearly the same time with the same key.
  One wins the INSERT (unique constraint).
  The other sees "in_progress" and returns:
    409 Conflict
    Retry-After: 1

Record shape (Postgres):
  key             UUID
  user_id         BIGINT
  request_hash    TEXT          (detects payload mismatch)
  status          TEXT          (in_progress | completed | failed)
  response_status INTEGER       (e.g. 201)
  response_body   JSONB
  created_at      TIMESTAMPTZ
  expires_at      TIMESTAMPTZ   (24h default)
  UNIQUE (key, user_id)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// IDEMPOTENCY KEYS — FULL IMPLEMENTATION
// ============================================

// ---------- 1. Entity for the idempotency store ----------
// idempotency/idempotency-key.entity.ts
import {
  Column, CreateDateColumn, Entity, Index, PrimaryColumn, Unique,
} from 'typeorm';

export type IdempotencyStatus = 'in_progress' | 'completed' | 'failed';

@Entity('idempotency_keys')
@Unique('uniq_key_user', ['key', 'userId'])
@Index('idx_expires_at', ['expiresAt'])
export class IdempotencyKey {
  @PrimaryColumn('uuid')
  key: string;

  @Column('bigint')
  userId: number;

  @Column('text')
  requestHash: string;

  @Column('text')
  status: IdempotencyStatus;

  @Column('integer', { nullable: true })
  responseStatus: number | null;

  @Column('jsonb', { nullable: true })
  responseBody: unknown | null;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz')
  expiresAt: Date;
}

// ---------- 2. Service ----------
// idempotency/idempotency.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { createHash } from 'crypto';
import { IdempotencyKey } from './idempotency-key.entity';

export interface IdempotencyOutcome<T> {
  status: 'new' | 'replay' | 'in_progress' | 'mismatch';
  statusCode?: number;
  body?: T;
}

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

@Injectable()
export class IdempotencyService {
  constructor(
    @InjectRepository(IdempotencyKey)
    private readonly repo: Repository<IdempotencyKey>,
    private readonly dataSource: DataSource,
  ) {}

  private hash(body: unknown): string {
    return createHash('sha256').update(JSON.stringify(body ?? {})).digest('hex');
  }

  // Try to reserve the key. Returns:
  //   - 'new'         -> proceed to run the operation
  //   - 'replay'      -> return the stored response
  //   - 'in_progress' -> return 409 Conflict
  //   - 'mismatch'    -> same key, different body -> 422
  async reserve(
    key: string,
    userId: number,
    body: unknown,
  ): Promise<IdempotencyOutcome<unknown>> {
    const requestHash = this.hash(body);

    try {
      await this.repo.insert({
        key,
        userId,
        requestHash,
        status: 'in_progress',
        responseStatus: null,
        responseBody: null,
        expiresAt: new Date(Date.now() + TTL_MS),
      });
      return { status: 'new' };
    } catch (err: any) {
      // Unique violation: an existing record with (key, user_id).
      if (err.code !== '23505') throw err;

      const existing = await this.repo.findOneByOrFail({ key, userId });

      if (existing.requestHash !== requestHash) {
        return { status: 'mismatch' };
      }
      if (existing.status === 'in_progress') {
        return { status: 'in_progress' };
      }
      return {
        status: 'replay',
        statusCode: existing.responseStatus ?? 200,
        body: existing.responseBody,
      };
    }
  }

  // Persist the successful response, marking the key as completed.
  async complete(
    key: string,
    userId: number,
    statusCode: number,
    body: unknown,
    manager?: DataSource['manager'],
  ) {
    const repo = manager ? manager.getRepository(IdempotencyKey) : this.repo;
    await repo.update(
      { key, userId },
      { status: 'completed', responseStatus: statusCode, responseBody: body },
    );
  }

  // Mark the key as failed. Choose whether failures are retryable.
  // Here we mark them as failed so a new attempt with a *new* key
  // is required. If you want retryable failures, delete the record instead.
  async fail(key: string, userId: number) {
    await this.repo.update({ key, userId }, { status: 'failed' });
  }
}

// ---------- 3. Guard / interceptor for Idempotency-Key ----------
// idempotency/idempotency.interceptor.ts
import {
  BadRequestException, CallHandler, ConflictException,
  ExecutionContext, Injectable, NestInterceptor, UnprocessableEntityException,
} from '@nestjs/common';
import { Observable, from, of, switchMap, tap } from 'rxjs';
import { IdempotencyService } from './idempotency.service';

export const IDEMPOTENT_ROUTE = 'idempotent_route';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly idempotency: IdempotencyService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const key = req.headers['idempotency-key'] as string | undefined;
    const userId = req.user?.id ?? 0; // replace with real user resolution

    if (!key) {
      throw new BadRequestException('Idempotency-Key header is required');
    }

    return from(this.idempotency.reserve(key, userId, req.body)).pipe(
      switchMap((outcome) => {
        if (outcome.status === 'mismatch') {
          throw new UnprocessableEntityException(
            'This Idempotency-Key was used with a different request body.',
          );
        }
        if (outcome.status === 'in_progress') {
          res.setHeader('Retry-After', '1');
          throw new ConflictException(
            'Another request with the same Idempotency-Key is in progress.',
          );
        }
        if (outcome.status === 'replay') {
          res.setHeader('Idempotent-Replay', 'true');
          res.status(outcome.statusCode ?? 200);
          return of(outcome.body);
        }
        // status === 'new' -> run the actual handler.
        return next.handle().pipe(
          tap(async (responseBody) => {
            const status = res.statusCode ?? 200;
            await this.idempotency.complete(key, userId, status, responseBody);
          }),
        );
      }),
    );
  }
}

// ---------- 4. Applying the interceptor to a controller ----------
import {
  Body, Controller, Post, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@UseInterceptors(IdempotencyInterceptor)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiHeader({
    name: 'Idempotency-Key',
    required: true,
    description:
      'Unique key (UUID) identifying this logical operation. Reuse it for retries.',
  })
  async create(@Body() dto: CreateOrderDto) {
    // If we get here, the key was new.
    // The interceptor will store the response when this returns.
    return this.ordersService.create(dto);
  }
}

// ---------- 5. Atomic version with a transaction ----------
// When the operation and the idempotency record must commit together.
async createOrderAtomic(dto: CreateOrderDto, userId: number, key: string) {
  return this.dataSource.transaction(async (manager) => {
    // Reserve inside the transaction.
    try {
      await manager.insert(IdempotencyKey, {
        key,
        userId,
        requestHash: this.hash(dto),
        status: 'in_progress',
        expiresAt: new Date(Date.now() + TTL_MS),
      });
    } catch (err: any) {
      if (err.code === '23505') {
        // Another request raced us; the interceptor handles replay,
        // but for a fully atomic path we look up and return the stored response.
        const existing = await manager.findOneByOrFail(IdempotencyKey, {
          key, userId,
        });
        if (existing.responseStatus) {
          return { replayed: true, status: existing.responseStatus, body: existing.responseBody };
        }
        throw new ConflictException('Request in progress');
      }
      throw err;
    }

    // Business work happens inside the same transaction.
    const order = await this.ordersService.createWithManager(dto, manager);

    await manager.update(
      IdempotencyKey,
      { key, userId },
      { status: 'completed', responseStatus: 201, responseBody: order },
    );

    return { replayed: false, status: 201, body: order };
  });
}

// ---------- 6. Frontend: reuse the key across retries ----------
// const key = crypto.randomUUID();
// async function submitOrder(payload) {
//   return fetch('/api/orders', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Idempotency-Key': key,
//     },
//     body: JSON.stringify(payload),
//   });
// }
//
// On retry, keep the SAME key. Only generate a new key
// when the user starts a genuinely new operation.

// ---------- 7. Cleanup job ----------
// idempotency/cleanup.cron.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { IdempotencyKey } from './idempotency-key.entity';

@Injectable()
export class IdempotencyCleanupCron {
  constructor(
    @InjectRepository(IdempotencyKey)
    private readonly repo: Repository<IdempotencyKey>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanup() {
    await this.repo.delete({ expiresAt: LessThan(new Date()) });
  }
}

// ---------- 8. Client behavior matrix ----------
//
//  Scenario                                  | Result
//  ------------------------------------------+--------------------------------
//  First request, new key                    | runs, 201, key stored
//  Retry with same key, operation done       | replay, 201, same body
//  Retry with same key, operation in progress| 409, Retry-After: 1
//  Same key, different body                  | 422 Unprocessable Entity
//  Missing Idempotency-Key header            | 400 Bad Request
//  Key past TTL                              | treated as new
      ` },
      keyTakeaways: [
        "An idempotency key is a unique identifier the client generates for each logical operation and sends on every retry.",
        "The server stores the key, the request hash, the status, and the response, and returns the stored response on replay.",
        "Concurrent duplicates return `409 Conflict` with `Retry-After` while the first request is still in progress.",
        "Store `(key, user_id)` as a composite unique constraint so keys are scoped per user and inserts are atomic.",
        "Store the request body hash to detect misuse of a key with a different payload; return `422` on mismatch.",
        "Wrap the idempotency record and the business operation in a single transaction so both commit or neither does.",
        "Set a TTL (24 hours is typical) and purge expired keys on a schedule.",
        "Reuse the same key for retries — generating a new key defeats idempotency entirely.",
      ],
      commonMistakes: [
        "<b>Generating a new key on each retry.</b> This is the most common and most damaging mistake. The client must reuse the same key across retries of the same logical operation.",
        "<b>Non-atomic check-and-insert.</b> Two concurrent requests both see no record and both execute. Prevent this with a database unique constraint on the key.",
        "<b>No TTL.</b> The idempotency table grows forever and slows down. Set an expiry window (usually 24 hours) and delete expired rows.",
        "<b>Not storing the request hash.</b> A client reuses a key with a different body and the server replays the old response. Silent corruption. Store and compare the hash.",
        "<b>Storing only the response body, not the status.</b> Replays then return the wrong status code. Store both.",
        "<b>Scoping keys globally instead of per user.</b> Two users can collide, or a malicious user can hijack someone else's key. Always scope by user or tenant.",
        "<b>Not returning `Retry-After` on 409.</b> Clients retry immediately in a loop, causing a thundering herd. Always include `Retry-After`.",
        "<b>Storing huge response bodies.</b> A 50 MB PDF stored per key wastes disk and slows replay. Store a reference for large payloads.",
        "<b>Skipping the transaction.</b> The idempotency record commits but the business write fails (or vice versa), leaving the system inconsistent. Use a single transaction.",
        "<b>Using the same key for different operations.</b> A key belongs to exactly one logical operation. Do not reuse a key for 'create' and 'cancel'.",
      ],
      quiz: [
        {
          question:
            "Who generates the idempotency key?",
          options: [
            "The server, when it receives the request.",
            "The client, because only the client knows when two requests are the same logical operation.",
            "The database.",
            "The API gateway.",
          ],
          correctIndex: 1,
          explanation:
            "The client generates the key. Only the client knows that two HTTP requests are retries of the same logical action. The server just records and replays.",
        },
        {
          question:
            "A client sends two identical requests with the same key, and the first is still being processed. What should the server return for the second request?",
          options: [
            "201 Created with a new resource.",
            "409 Conflict with a `Retry-After` header, explaining that the request is in progress.",
            "500 Internal Server Error.",
            "Silently ignore the second request and return nothing.",
          ],
          correctIndex: 1,
          explanation:
            "A `409 Conflict` with `Retry-After` tells the client the operation is in flight and to retry later. Returning success (201) is wrong because the operation has not finished; returning nothing leaves the client hanging.",
        },
        {
          question:
            "Why is a database unique constraint on `(key, user_id)` important?",
          options: [
            "Because it makes queries faster.",
            "Because it makes the check-and-insert atomic, preventing two concurrent requests from both executing the operation.",
            "Because it compresses the response.",
            "Because it enforces TTL.",
          ],
          correctIndex: 1,
          explanation:
            "Without a unique constraint, two requests arriving at nearly the same time can both see 'no existing record' and both start the operation. The unique constraint ensures only one insert wins.",
        },
        {
          question:
            "Why should you store a hash of the request body alongside the idempotency key?",
          options: [
            "To save space.",
            "To detect when a client reuses a key with a different payload, so the server can reject it with 422 instead of replaying the wrong response.",
            "To speed up lookups.",
            "To compress the request.",
          ],
          correctIndex: 1,
          explanation:
            "A key should be tied to one specific request. If the body changes, the key is being misused. Storing the hash lets you detect this and return `422 Unprocessable Entity` instead of silently replaying an incorrect response.",
        },
        {
          question:
            "What is a reasonable TTL for idempotency records in a public payments API?",
          options: [
            "10 seconds.",
            "24 hours (with some systems using up to 7 days for high-value operations).",
            "Forever.",
            "1 minute.",
          ],
          correctIndex: 1,
          explanation:
            "The TTL must cover the longest realistic retry window. 24 hours is the industry-standard default (Stripe uses 24 hours), and some systems extend to 7 days for high-value operations. Too-short windows let late retries create duplicates.",
        },
      ],
    },
    {
      id: "day-52-lesson-3",
      title: "Retry-Safe APIs and Payment Operations",
      durationMinutes: 22,
      explanation: `
<b>You have built idempotency keys into your order creation endpoint.</b> Duplicate requests now return the same response. But there are still subtle ways the system can double-charge, double-email, or corrupt data. This lesson is about the deeper patterns that make an API truly retry-safe — not just "no duplicate order" but "no double charge, no lost update, no missed side effect" across the whole call chain.

<b>Retries are not just a client behavior — they are baked into the infrastructure.</b> Some examples:
- AWS SDKs retry on certain 5xx errors and timeouts.
- gRPC has built-in retries.
- Kafka consumers process messages "at least once."
- SQS delivers messages at least once and can redeliver after visibility timeouts.
- HTTP proxies (some) retry idempotent methods.
- Webhook senders (Stripe, GitHub, Twilio) retry with exponential backoff.

All of these retry mechanisms are <i>designed</i> for reliability. But they only stay reliable if your API is retry-safe. This is where engineering judgment matters: which endpoints are safe to retry, and how do you guarantee that safety?

<b>The first rule of retry-safe APIs: separate the request from the effect.</b> A request can be replayed; the effect should only happen once. Idempotency keys do this at the entry point. But the effect itself may involve several steps:

1. Create order row.
2. Charge the customer.
3. Decrement inventory.
4. Send a confirmation email.
5. Publish an event to a queue.

If the request is retried, we do not want any of these to happen twice. Idempotency keys protect step 1 (they prevent re-execution of the whole handler). But what if step 1 succeeds and step 2 fails partway through? The client retries, the key says "completed," and step 2 never completes. That is the <b>partial failure</b> problem, and it is where a lot of systems quietly break.

<b>Pattern 1: The transaction wraps the critical writes.</b> Steps that must all succeed or all fail go inside a database transaction:

\`\`\`typescript
await this.dataSource.transaction(async (manager) => {
  const order = await manager.save(Order, orderDraft);
  await manager.decrement(Product, { id: item.productId }, 'stock', item.quantity);
  await manager.insert(OrderHistory, { orderId: order.id, event: 'created' });
  return order;
});
\`\`\`

If any step throws, everything rolls back. The client can retry cleanly. This handles database consistency.

But note: the <b>external</b> call to the payment provider is <i>not</i> inside the database transaction. You cannot roll back an external charge. This is where the next pattern comes in.

<b>Pattern 2: The transaction ID pattern for external calls.</b> When you charge a payment provider (Stripe, Square, etc.), the charge itself is a side effect that cannot be undone by a database rollback. You must make the call idempotent at the provider's level. Fortunately, payment providers support idempotency keys too:

\`\`\`typescript
// The provider accepts an idempotency key on the charge request.
const charge = await this.stripeClient.charges.create(
  { amount, currency, source, customer },
  { idempotencyKey: orderPaymentIntentKey },  // derived from the order id
);
\`\`\`

The trick is to <b>derive the provider's idempotency key from your internal identifiers</b> (e.g. the order id), not from something random. That way, if the client retries the whole flow, you compute the same provider key and the provider returns the original charge instead of creating a second one.

A common pattern is: \`payment-intent-\${orderId}\` or \`charge-\${orderId}\`. The value is deterministic, stable across retries, and unique per order.

<b>Pattern 3: Outbox pattern for events and emails.</b> Sending an email or publishing to a queue is a side effect that should happen exactly once per operation. But doing it inside the request handler is risky: if the request succeeds but the email fails to send, the effect is lost. If you retry to fix it, the effect might happen twice.

The <b>outbox pattern</b> solves this. Instead of sending the email directly, write a row to an "outbox" table in the same transaction as the business write:

\`\`\`typescript
await this.dataSource.transaction(async (manager) => {
  const order = await manager.save(Order, orderDraft);
  await manager.insert(OutboxEvent, {
    type: 'order.created',
    payload: { orderId: order.id },
    status: 'pending',
  });
  return order;
});
\`\`\`

A separate background process (cron, queue consumer) reads pending outbox events and dispatches them (sends the email, publishes to Kafka). Once dispatched, the event is marked \`sent\`. If the process crashes, it retries only the unsent events. The unique \`type + aggregateId\` constraint on the outbox ensures exactly one event per business action.

This is the gold-standard pattern for "exactly once" side effects in distributed systems. It decouples the business write from the side effect and gives you at-least-once delivery with deduplication on the receiving side.

<b>Pattern 4: Deduplication on the receiving side.</b> Even with outbox and idempotency keys, downstream systems can receive the same event multiple times (queues are usually at-least-once). The receiving side should also deduplicate. For example, a "send email" service stores the message id and refuses to send the same id twice. A "grant reward points" service stores the (user_id, order_id) pair and grants at most once.

<b>Pattern 5: Locking and concurrency control.</b> Idempotency keys prevent <i>duplicate requests</i>, but they do not prevent two different requests from racing on the same resource. Consider:

- Two customers buying the last item in stock at the same time.
- Two requests both reading the current balance and adding to it.

These are race conditions, and they need explicit locking. Options:

- <b>Row-level locks</b> (\`SELECT ... FOR UPDATE\`) inside a transaction.
- <b>Optimistic concurrency</b> with a version column (\`UPDATE ... WHERE version = 5\`).
- <b>Serializable isolation</b> where supported.
- <b>Advisory locks</b> in PostgreSQL for cross-row logic.

\`\`\`typescript
await this.dataSource.transaction(async (manager) => {
  // Lock the product row so nobody else can decrement it concurrently.
  const product = await manager
    .createQueryBuilder(Product, 'p')
    .setLock('pessimistic_write')
    .where('p.id = :id', { id: productId })
    .getOneOrFail();

  if (product.stock < quantity) {
    throw new ConflictException('Not enough stock');
  }
  product.stock -= quantity;
  await manager.save(product);

  // ... create order, outbox event, etc.
});
\`\`\`

Without the lock, two concurrent requests can both pass the stock check and both decrement, leaving you with a negative stock. Idempotency keys alone do not prevent this — the same customer might legitimately trigger two different orders at the same time.

<b>Pattern 6: Retry-safe HTTP status codes and error semantics.</b> The client's retry behavior depends on the status code you return:

- <b>2xx</b> — success. Client stops retrying.
- <b>4xx</b> (except 408 and 429) — client error. Client should <b>not</b> retry; the request is invalid.
- <b>408 Request Timeout</b> — client may retry.
- <b>429 Too Many Requests</b> — client should retry after \`Retry-After\`.
- <b>5xx</b> — server error. Client may retry (with backoff). This is dangerous for non-idempotent operations without a key.
- <b>409 Conflict</b> on idempotency — retry after \`Retry-After\`.

Return <b>correct</b> status codes. A 500 for a client validation error invites pointless retries. A 200 for a failed operation hides the failure and prevents the client from retrying with new inputs.

<b>Pattern 7: Exponential backoff and jitter in clients.</b> Retry-safe APIs are only half of the story; the client should retry with discipline:
- Exponential backoff (1s, 2s, 4s, 8s).
- Jitter (±20% random) to avoid thundering herds.
- A maximum retry count (e.g. 5).
- Respect for \`Retry-After\` if present.

This is standard practice in any SDK, but it also needs documenting so clients behave well. A "retryable" 500 does not mean "retry immediately in a tight loop."

<b>Payment-specific considerations.</b> Payment operations are the highest-stakes case of idempotency:
- <b>Charges must be idempotent.</b> Never charge twice for the same order or payment intent.
- <b>Refunds must be idempotent.</b> A retry of a refund request should not refund the customer twice.
- <b>Payouts and transfers must be idempotent.</b> Sending money to a bank account twice is catastrophic.
- <b>Chargebacks and disputes</b> are usually driven by webhooks. Webhooks are retried; the handler must dedupe.
- <b>Idempotency keys must be <i>deterministic</i></b> when they derive from internal IDs (order id, payment intent id). This is what makes retries across the whole flow line up.
- <b>Reconciliation</b> between your DB and the provider's is essential. Eventually, some request may succeed on the provider but fail to record on your side (crash between the external call and the DB write). A daily reconciliation job queries the provider for charges and marks any missing ones. This is the safety net that catches the rare edge cases.

<b>What can go wrong?</b>
- <b>No database transaction around related writes.</b> Partial failure leaves the system in an inconsistent state. Use transactions.
- <b>Charging before committing the order.</b> If the order insert then fails, you have charged without an order. Charge inside the transaction or after commit with a compensation path.
- <b>Non-deterministic idempotency keys at the provider.</b> A random key per request makes retries create new charges. Derive keys from stable internal ids.
- <b>Sending emails inside the request.</b> If the request fails after the email, you cannot un-send it. Use the outbox pattern.
- <b>No locks for stock or balance updates.</b> Two requests read the same value and both write. Use row locks or optimistic concurrency.
- <b>Wrong status codes.</b> Returning 200 for a failed operation, or 500 for a validation error. Clients retry the wrong things.
- <b>Immediate retry loops.</b> Clients without backoff hammer the API during an outage. Enforce \`Retry-After\` and document client behavior.
- <b>No reconciliation with external systems.</b> Rare drift between your DB and the provider accumulates silently. Add a reconciliation job.
- <b>Assuming events are delivered once.</b> Queues are at-least-once. Consumers must dedupe by message id or business key.
- <b>Retrying non-idempotent operations on 5xx.</b> A 500 during a POST that partially succeeded, without an idempotency key, duplicates the work. This is the failure mode idempotency keys exist to prevent.

<b>How this appears in a real application.</b> A payment platform:
- Uses \`Idempotency-Key\` headers on all POST endpoints (\`/charges\`, \`/refunds\`, \`/transfers\`).
- Wraps order creation and inventory decrement in a transaction.
- Calls the payment provider with a deterministic idempotency key derived from the order id.
- Writes an outbox event for the confirmation email and the "order created" event.
- A cron worker dispatches outbox events, deduplicating by event id on the receiving side.
- Uses \`SELECT ... FOR UPDATE\` when decrementing inventory.
- Returns \`409\` with \`Retry-After\` for in-progress idempotency keys.
- Runs a nightly reconciliation job that compares local charges with the provider's ledger.
- Documents retry expectations: exponential backoff, jitter, respect \`Retry-After\`.

The result is a system that can safely retry any request under any failure mode without double-charging, double-shipping, or losing events. That is what "retry-safe" really means.

<b>How experienced engineers think.</b> Retry safety is a property of the entire flow, not of a single endpoint. Every step — from the client's button to the provider's charge — must be designed so that repetitions are harmless. Idempotency keys, transactions, outbox, locks, and reconciliation are all pieces of the same puzzle. Together they turn an unreliable environment into a reliable system.
      `,
      diagram: `
Retry-Safe Payment Flow

  Client (button)
      |
      |  POST /orders
      |  Idempotency-Key: abc-123
      v
  +-----------------------------------+
  |  OrdersController                 |
  |  IdempotencyInterceptor           |
  |   - reserve key (atomic insert)   |
  |   - replay if completed           |
  |   - 409 if in progress            |
  +-----------------------------------+
      |
      |  new key -> proceed
      v
  +-----------------------------------+
  |  DB TRANSACTION                   |
  |   - insert Order                  |
  |   - SELECT ... FOR UPDATE product |
  |   - decrement stock               |
  |   - insert OrderHistory           |
  |   - insert OutboxEvent            |
  |   - update IdempotencyKey -> done |
  +-----------------------------------+
      |
      |  (external call AFTER transaction,
      |   with deterministic provider key)
      v
  +-----------------------------------+
  |  Payment Provider (Stripe, etc.)  |
  |  idempotencyKey: order-1234       |
  |  (retries return the same charge) |
  +-----------------------------------+
      |
      v
  +-----------------------------------+
  |  Outbox Worker (cron / queue)     |
  |   - reads pending OutboxEvents    |
  |   - sends email / publishes event |
  |   - marks as sent                 |
  |   - dedupe on receiving side      |
  +-----------------------------------+

Retry safety across the flow:
  - Idempotency key  -> no duplicate order
  - Transaction      -> all-or-nothing writes
  - Row lock         -> no lost stock updates
  - Deterministic    -> provider sees one charge per order
      provider key
  - Outbox           -> exactly-once side effects
  - Reconciliation   -> catches rare drift with provider
      `,
      codeExample: { title: "Example", code: `
// ============================================
// RETRY-SAFE PAYMENT FLOW — FULL EXAMPLE
// ============================================

// ---------- 1. Order service with transaction + lock + outbox ----------
@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly payments: PaymentsService,
  ) {}

  async createOrder(dto: CreateOrderDto, userId: number): Promise<Order> {
    // 1. Persist everything transactional in one DB transaction.
    const order = await this.dataSource.transaction(async (manager) => {
      const orderDraft = manager.create(Order, {
        customerId: userId,
        total: dto.total,
        status: 'pending_payment',
      });
      const savedOrder = await manager.save(orderDraft);

      // Lock and decrement each product's stock.
      for (const item of dto.items) {
        const product = await manager
          .createQueryBuilder(Product, 'p')
          .setLock('pessimistic_write')
          .where('p.id = :id', { id: item.productId })
          .getOneOrFail();

        if (product.stock < item.quantity) {
          throw new ConflictException(\`Insufficient stock for \${product.name}\`);
        }
        product.stock -= item.quantity;
        await manager.save(product);

        await manager.insert(OrderItem, {
          orderId: savedOrder.id,
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
        });
      }

      // Write outbox events for downstream effects (email, analytics).
      await manager.insert(OutboxEvent, {
        type: 'order.created',
        aggregateId: String(savedOrder.id),
        payload: { orderId: savedOrder.id, userId },
        status: 'pending',
      });

      return savedOrder;
    });

    // 2. Charge the payment provider with a DETERMINISTIC idempotency key.
    //    If the client retries, the same key is used and the provider
    //    returns the original charge instead of creating a new one.
    const charge = await this.payments.charge({
      amount: order.total,
      currency: 'usd',
      customerId: userId,
      idempotencyKey: \`order-\${order.id}\`, // stable, per-order
    });

    // 3. Record the charge inside a small transaction.
    await this.dataSource.transaction(async (manager) => {
      await manager.update(Order, { id: order.id }, {
        status: 'paid',
        paymentId: charge.id,
      });
      await manager.insert(OutboxEvent, {
        type: 'order.paid',
        aggregateId: String(order.id),
        payload: { orderId: order.id, paymentId: charge.id },
        status: 'pending',
      });
    });

    return { ...order, status: 'paid', paymentId: charge.id };
  }
}

// ---------- 2. Payments service with provider idempotency ----------
@Injectable()
export class PaymentsService {
  constructor(private readonly stripe: Stripe) {}

  async charge(input: {
    amount: number;
    currency: string;
    customerId: number;
    idempotencyKey: string;
  }) {
    // The provider stores the key and replays the original charge
    // if the same key is seen again.
    return this.stripe.charges.create(
      {
        amount: input.amount,
        currency: input.currency,
        customer: String(input.customerId),
      },
      { idempotencyKey: input.idempotencyKey },
    );
  }

  async refund(input: {
    chargeId: string;
    amount: number;
    idempotencyKey: string;   // e.g. \`refund-\${refundRequestId}\`
  }) {
    return this.stripe.refunds.create(
      { charge: input.chargeId, amount: input.amount },
      { idempotencyKey: input.idempotencyKey },
    );
  }
}

// ---------- 3. Outbox entity + worker ----------
@Entity('outbox_events')
@Index('idx_outbox_status', ['status'])
@Unique('uniq_outbox_aggregate_type', ['aggregateId', 'type'])
export class OutboxEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  type: string; // 'order.created' | 'order.paid' | ...

  @Column('text')
  aggregateId: string;

  @Column('jsonb')
  payload: Record<string, unknown>;

  @Column('text')
  status: 'pending' | 'sent' | 'failed';

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { nullable: true })
  sentAt: Date | null;
}

// ---------- 4. Outbox worker (cron or queue consumer) ----------
@Injectable()
export class OutboxWorker {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mailer: MailerService,
    private readonly events: EventPublisher,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async dispatch() {
    const events = await this.dataSource.transaction(async (manager) => {
      // Lock a small batch so multiple workers do not process the same row.
      const batch = await manager
        .createQueryBuilder(OutboxEvent, 'e')
        .setLock('pessimistic_write')
        .where('e.status = :status', { status: 'pending' })
        .orderBy('e.createdAt', 'ASC')
        .take(50)
        .getMany();

      // Mark them as 'sent' inside the transaction so no other worker picks them up.
      for (const e of batch) {
        e.status = 'sent';
        e.sentAt = new Date();
      }
      await manager.save(batch);
      return batch;
    });

    for (const event of events) {
      try {
        if (event.type === 'order.created') {
          await this.mailer.sendOrderConfirmation(event.payload);
        } else if (event.type === 'order.paid') {
          await this.events.publish('order.paid', event.payload);
        }
        // The event is already marked 'sent'. If the send fails, the
        // transaction that marked it rolled back? No — the transaction
        // only locks and marks. We need a different approach below.
      } catch (err) {
        // Better: use a two-phase mark (claimed -> sent).
        // See the production pattern in the next section.
      }
    }
  }
}

// ---------- 5. Production outbox: claim then send then mark ----------
// A safer implementation moves the "mark as sent" step to AFTER the
// external call succeeds, and uses a status column to indicate "claimed".
//
// statuses: pending | claimed | sent | failed
//
// Worker loop:
//   1. tx: select pending FOR UPDATE SKIP LOCKED LIMIT 50
//          update status='claimed', claimed_at=now(), claimed_by=workerId
//   2. outside tx: send email / publish event
//   3. update status='sent', sent_at=now()
//
// If the worker crashes after step 1 but before step 3, a cleanup job
// resets 'claimed' rows older than N minutes back to 'pending'.

// ---------- 6. Reconciliation job (safety net) ----------
@Injectable()
export class ReconciliationJob {
  constructor(
    private readonly dataSource: DataSource,
    private readonly stripe: Stripe,
  ) {}

  @Cron('0 3 * * *') // nightly at 3 AM
  async reconcile() {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Fetch charges from the provider for the last day.
    const providerCharges = await this.stripe.charges.list({
      created: { gte: Math.floor(since.getTime() / 1000) },
      limit: 100,
    });

    for (const charge of providerCharges.data) {
      // Check if we have a matching local order.
      const existing = await this.dataSource
        .getRepository(Order)
        .findOneBy({ paymentId: charge.id });

      if (!existing) {
        // We charged but did not record it. Compensate or record it.
        // This is the safety net for the rare "crash between external
        // call and DB write" case.
        await this.dataSource.getRepository(Order).insert({
          paymentId: charge.id,
          status: 'paid_reconciled',
          total: charge.amount,
          customerId: Number(charge.customer),
        });
      }
    }
  }
}

// ---------- 7. Documentation snippet for clients ----------
//
//  Retry policy for POST /orders:
//
//    - Always send an Idempotency-Key header.
//    - On network errors or 5xx, retry with the SAME key.
//    - On 409 Conflict, wait for the number of seconds in Retry-After
//      and retry with the SAME key.
//    - On 4xx (other than 408/429), do NOT retry; fix the request.
//    - Use exponential backoff with jitter for repeated retries.
//
//  Server behavior:
//
//    - New key: operation runs.
//    - Same key, completed: original response is replayed with
//      Idempotent-Replay: true.
//    - Same key, in progress: 409 Conflict with Retry-After: 1.
//    - Same key, different body: 422 Unprocessable Entity.
//    - Key past TTL (24h): treated as new.

// ---------- 8. Client-side retry helper (frontend or SDK) ----------
async function requestWithRetry(
  url: string,
  init: RequestInit & { idempotencyKey: string },
  maxAttempts = 5,
) {
  let attempt = 0;
  while (true) {
    attempt++;
    try {
      const res = await fetch(url, {
        ...init,
        headers: {
          ...(init.headers || {}),
          'Idempotency-Key': init.idempotencyKey,
        },
      });

      if (res.status === 409 || res.status === 429 || res.status === 408) {
        const retryAfter = Number(res.headers.get('Retry-After') || '1');
        if (attempt >= maxAttempts) return res;
        await sleep(retryAfter * 1000 + jitter());
        continue;
      }

      if (res.status >= 500 && res.status < 600) {
        if (attempt >= maxAttempts) return res;
        await sleep(backoff(attempt));
        continue;
      }

      return res; // 2xx, or a 4xx we should not retry
    } catch (err) {
      if (attempt >= maxAttempts) throw err;
      await sleep(backoff(attempt));
    }
  }
}

function backoff(attempt: number) {
  const base = Math.min(2 ** attempt * 500, 8000);
  return base + Math.random() * 200; // jitter
}
function jitter() { return Math.random() * 100; }
function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
      ` },
      keyTakeaways: [
        "Retry safety is a property of the whole flow, not a single endpoint — from the client's button to the provider's charge.",
        "Wrap related database writes in a transaction so partial failures roll back cleanly.",
        "Derive the payment provider's idempotency key from stable internal ids (e.g. `order-1234`) so retries across the flow line up.",
        "Use the outbox pattern to make side effects (emails, events) exactly-once and decoupled from the request.",
        "Use row-level locks or optimistic concurrency for stock, balance, and other shared resources to prevent lost updates.",
        "Return the right status codes (4xx for client errors, 5xx for server errors) so clients retry the right things.",
        "Clients must use exponential backoff with jitter and respect `Retry-After`.",
        "Run a reconciliation job against external systems to catch the rare cases where a charge succeeds but local state is not recorded.",
      ],
      commonMistakes: [
        "<b>Charging the payment provider before committing the order.</b> If the order insert fails, you have charged without an order. Charge inside the transaction or use compensating logic.",
        "<b>Using a random idempotency key at the provider.</b> Each retry creates a new charge. Derive keys from stable internal ids.",
        "<b>Sending emails inside the request.</b> If the request fails after the email, you cannot un-send it. Use the outbox pattern.",
        "<b>No locks for stock or balance updates.</b> Two concurrent requests read the same value and both write. Use row locks or optimistic concurrency.",
        "<b>Marking outbox events as sent before the external call.</b> If the call then fails, the event is lost. Claim → send → mark is the correct sequence.",
        "<b>Returning the wrong status codes.</b> A 500 for a validation error causes pointless retries. A 200 for a failed operation hides the failure. Be accurate.",
        "<b>No reconciliation with external systems.</b> Rare drift between your DB and the provider accumulates silently. Add a nightly reconciliation job.",
        "<b>Assuming queues deliver exactly once.</b> Most queues are at-least-once. Consumers must deduplicate by message id or business key.",
        "<b>Retrying non-idempotent POSTs on 5xx without a key.</b> A 500 during a partially-succeeded POST duplicates the work. This is what idempotency keys exist to prevent.",
        "<b>Immediate retry loops in clients.</b> Without exponential backoff and jitter, a partial outage becomes a full outage via a thundering herd.",
      ],
      quiz: [
        {
          question:
            "Why should the payment provider's idempotency key be derived from a stable internal id (e.g. `order-1234`) instead of being random?",
          options: [
            "Because random keys are slower.",
            "Because a stable, deterministic key means retries of the whole flow compute the same provider key, so the provider returns the original charge instead of creating a second one.",
            "Because random keys break HTTP.",
            "Because the provider requires sequential keys.",
          ],
          correctIndex: 1,
          explanation:
            "The provider dedupes on the key it receives. If the key changes on every attempt, dedupe fails and you get duplicate charges. Deriving from a stable id ensures the same key is sent on every retry.",
        },
        {
          question:
            "What problem does the outbox pattern solve?",
          options: [
            "It makes database queries faster.",
            "It guarantees that side effects like emails and events happen exactly once, by recording them in the same transaction as the business write and dispatching them from a background worker.",
            "It replaces idempotency keys.",
            "It compresses response bodies.",
          ],
          correctIndex: 1,
          explanation:
            "The outbox pattern decouples business writes from side effects. The event is written in the same transaction as the business row, then a worker dispatches it. This gives exactly-once semantics (with at-least-once delivery plus dedupe).",
        },
        {
          question:
            "Two requests simultaneously decrement the same product's stock. Without a row lock, what can happen?",
          options: [
            "The database throws an error.",
            "Both requests read the same stock value, both decrement, and the stock ends up wrong (potentially negative).",
            "The second request automatically waits.",
            "The stock is decremented correctly because SQL is atomic.",
          ],
          correctIndex: 1,
          explanation:
            "Concurrent reads of the same value followed by writes cause a lost update. Use `SELECT ... FOR UPDATE` to lock the row, or optimistic concurrency with a version column. Idempotency keys do not prevent this — they prevent duplicate requests, not concurrent ones.",
        },
        {
          question:
            "Which status code should a client retry immediately?",
          options: [
            "`400 Bad Request`",
            "`401 Unauthorized`",
            "`409 Conflict` with `Retry-After: 1`",
            "`422 Unprocessable Entity`",
          ],
          correctIndex: 2,
          explanation:
            "`409 Conflict` with `Retry-After` tells the client an idempotency operation is in progress and to retry after the given delay. `400`, `401`, and `422` are client errors that should not be retried without changing the request.",
        },
        {
          question:
            "Why is a nightly reconciliation job important in a payments system?",
          options: [
            "To speed up the API.",
            "To catch rare cases where a provider-side charge succeeded but local state was not recorded (e.g. crash between external call and DB write) and repair the discrepancy.",
            "To compress logs.",
            "To replace idempotency keys.",
          ],
          correctIndex: 1,
          explanation:
            "Even with idempotency keys, transactions, and outbox, a crash between an external call and the local DB write can leave state inconsistent. Reconciliation compares local state with the provider's ledger and repairs discrepancies — the safety net for the extreme edge cases.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question:
        "What does 'idempotent' mean in the context of an HTTP request?",
      options: [
        "The request is encrypted.",
        "Sending the request once has the same observable effect as sending it multiple times.",
        "The request is always successful.",
        "The request can only be sent once.",
      ],
      correctIndex: 1,
      explanation:
        "Idempotent means the observable effect of the operation is the same whether it is performed once or many times. This is a core property that makes retries safe.",
    },
    {
      question:
        "Which HTTP methods are idempotent by the standard?",
      options: [
        "POST and PATCH",
        "GET, HEAD, PUT, DELETE",
        "Only GET",
        "Only POST",
      ],
      correctIndex: 1,
      explanation:
        "GET, HEAD, PUT, and DELETE are idempotent by HTTP semantics. POST and PATCH are not, which is why idempotency keys are typically used on POST-like operations.",
    },
    {
      question:
        "Who generates the idempotency key, and why?",
      options: [
        "The server, because it knows when duplicates arrive.",
        "The client, because only the client knows which requests represent the same logical operation.",
        "The database, using auto-increment.",
        "The API gateway.",
      ],
      correctIndex: 1,
      explanation:
        "The client generates the key because only the client knows when two HTTP requests are retries of the same action. The server records and replays based on that key.",
    },
    {
      question:
        "What should the server return when a duplicate request arrives with the same key as a still-in-progress operation?",
      options: [
        "`201 Created` with a new resource.",
        "`409 Conflict` with a `Retry-After` header.",
        "`500 Internal Server Error`.",
        "Nothing at all.",
      ],
      correctIndex: 1,
      explanation:
        "A `409 Conflict` with `Retry-After` tells the client the operation is in progress and to try again shortly. Returning success would be wrong, and returning nothing leaves the client without guidance.",
    },
    {
      question:
        "What is the recommended TTL for idempotency records in a payments API?",
      options: [
        "10 seconds.",
        "24 hours (some systems use up to 7 days for high-value operations).",
        "Forever.",
        "1 minute.",
      ],
      correctIndex: 1,
      explanation:
        "The TTL must cover the longest realistic retry window. 24 hours is the industry standard, and some high-value operations use longer windows. Too-short windows allow late retries to duplicate.",
    },
    {
      question:
        "Why is a database unique constraint on `(key, user_id)` critical?",
      options: [
        "It makes reads faster.",
        "It makes the check-and-insert atomic, so two concurrent requests with the same key cannot both execute the operation.",
        "It compresses the response.",
        "It replaces the need for a TTL.",
      ],
      correctIndex: 1,
      explanation:
        "Without the constraint, two concurrent requests can both see 'no existing record' and both start work. The unique constraint guarantees only one insert wins.",
    },
    {
      question:
        "What should the server do if the same idempotency key is used with a different request body?",
      options: [
        "Silently replay the old response.",
        "Overwrite the stored response with the new one.",
        "Return `422 Unprocessable Entity` because the key was used for a different request.",
        "Delete the record and start fresh.",
      ],
      correctIndex: 2,
      explanation:
        "A key must be tied to a specific request. If the body differs, the key is being misused. Return `422` so the client knows they reused a key incorrectly, instead of silently replaying the wrong response.",
    },
    {
      question:
        "Why is wrapping the idempotency record and the business write in a single transaction important?",
      options: [
        "To speed up queries.",
        "Because otherwise the idempotency record can commit while the business write fails, or vice versa — leaving the system in an inconsistent state.",
        "Because it saves disk space.",
        "Because it is required by NestJS.",
      ],
      correctIndex: 1,
      explanation:
        "If the two writes are not atomic, a crash between them leaves the idempotency record and the business state out of sync. Wrapping them in a transaction ensures both succeed or both roll back.",
    },
    {
      question:
        "In a payment flow, why is the payment provider called with an idempotency key derived from your internal order id?",
      options: [
        "Because random keys are slower.",
        "Because a stable, deterministic key ensures that retries of the whole flow compute the same provider key and the provider returns the original charge instead of charging twice.",
        "Because the provider requires it.",
        "Because it makes logs shorter.",
      ],
      correctIndex: 1,
      explanation:
        "Deriving the provider's key from a stable internal id means every retry uses the same key, so the provider deduplicates correctly. Random keys per request would produce duplicate charges.",
    },
    {
      question:
        "What problem does the outbox pattern solve?",
      options: [
        "It speeds up HTTP requests.",
        "It guarantees exactly-once side effects (emails, events) by writing them in the same transaction as the business data and dispatching them from a background worker.",
        "It replaces idempotency keys.",
        "It reduces database size.",
      ],
      correctIndex: 1,
      explanation:
        "The outbox pattern decouples the business write from the side effect. Both are recorded in one transaction, and a worker dispatches the side effect reliably. This gives exactly-once semantics for external effects.",
    },
    {
      question:
        "Two requests simultaneously try to decrement the last item in stock. Which pattern prevents both from succeeding?",
      options: [
        "Idempotency keys alone.",
        "Row-level locking (`SELECT ... FOR UPDATE`) or optimistic concurrency with a version column.",
        "Increasing the HTTP timeout.",
        "Adding more replicas.",
      ],
      correctIndex: 1,
      explanation:
        "Idempotency keys prevent duplicate requests but not concurrent ones. Row locks or version-based optimistic concurrency ensure only one of the two concurrent updates wins.",
    },
    {
      question:
        "Why should a client use exponential backoff with jitter when retrying?",
      options: [
        "To make requests faster.",
        "To avoid overwhelming the server with synchronized retries during an outage (thundering herd).",
        "Because TCP requires it.",
        "To reduce response size.",
      ],
      correctIndex: 1,
      explanation:
        "Without backoff and jitter, all clients retry at the same moment, amplifying load during an outage. Backoff reduces frequency; jitter desynchronizes clients.",
    },
    {
      question:
        "Which of these is a valid reason to NOT use an idempotency key?",
      options: [
        "The endpoint creates an order and charges a payment.",
        "The endpoint is a `GET` that reads data.",
        "The endpoint triggers a payout.",
        "The endpoint creates a subscription.",
      ],
      correctIndex: 1,
      explanation:
        "`GET` is idempotent by HTTP semantics and does not mutate state, so it does not need an idempotency key. All the other operations create durable state and benefit from one.",
    },
    {
      question:
        "What is the purpose of a nightly reconciliation job in a payments system?",
      options: [
        "To speed up responses.",
        "To compare local state with the payment provider's ledger and repair any discrepancies caused by rare edge cases like crashes between external calls and DB writes.",
        "To compress the database.",
        "To regenerate idempotency keys.",
      ],
      correctIndex: 1,
      explanation:
        "Reconciliation is the safety net. Even with idempotency, transactions, and outbox, edge cases can leave state out of sync. A reconciliation job detects and repairs the drift.",
    },
    {
      question:
        "Which status codes should a well-behaved client retry?",
      options: [
        "`400` and `422`",
        "`408 Request Timeout`, `429 Too Many Requests`, `409 Conflict` (with `Retry-After`), and transient `5xx` errors.",
        "`401` and `403`",
        "Every status code.",
      ],
      correctIndex: 1,
      explanation:
        "Clients should retry only on transient errors: 408, 429, 409 (idempotency in progress), and 5xx. Client errors like 400, 401, 403, and 422 require fixing the request first.",
    },
  ],
  project: {
    name: "Build a Retry-Safe Order and Payment Flow with Idempotency Keys, Outbox, and Reconciliation",
    goal:
      "Implement a production-grade order creation flow that is safe under any retry scenario: duplicate client requests, in-flight duplicates, concurrency on shared resources, partial failures, and provider-side retries. Combine idempotency keys, transactions, row locks, the outbox pattern, and reconciliation into one coherent NestJS application.",
    brief:
      "You are the backend engineer for a payments platform. Customers place orders; each order decrements inventory, charges the customer, records a payment, and triggers a confirmation email. All of this must be safe under retries: the customer might double-tap, the SDK might retry on timeout, the queue might redeliver, and the payment provider might replay webhooks. Your job is to make the whole flow idempotent and retry-safe end to end.",
    steps: [
      "Create a NestJS project. Add TypeORM, PostgreSQL, `class-validator`, `@nestjs/swagger`, `@nestjs/schedule`, and a mock payment provider module (a simple service that simulates Stripe with an in-memory ledger and honors an idempotency key).",
      "Define entities: `Product` (id, name, price, stock), `Order` (id, customerId, status, total, paymentId), `OrderItem` (id, orderId, productId, quantity, unitPrice), `IdempotencyKey` (key, userId, requestHash, status, responseStatus, responseBody, createdAt, expiresAt), and `OutboxEvent` (id, type, aggregateId, payload, status, createdAt, sentAt). Add the appropriate indexes and unique constraints (`UNIQUE (key, user_id)`, `UNIQUE (aggregateId, type)`).",
      "Implement `IdempotencyService` with `reserve()`, `complete()`, and `fail()` methods, as described in lesson 2. Use the composite unique constraint on `(key, user_id)` and store a SHA-256 hash of the request body.",
      "Implement `IdempotencyInterceptor`. It reads `Idempotency-Key` from headers, calls `reserve()`, and either (a) replays the stored response with `Idempotent-Replay: true`, (b) returns `409 Conflict` with `Retry-After: 1` for in-progress, (c) returns `422 Unprocessable Entity` for payload mismatch, or (d) proceeds with the handler. On handler success, it calls `complete()`.",
      "Implement `OrdersService.createOrder(dto, userId)`. Wrap the following in a single database transaction: insert the order, lock each product with `SELECT ... FOR UPDATE`, check stock, decrement stock, insert order items, insert an `order.created` outbox event. Return the saved order.",
      "After the transaction commits, call the mock payment provider's `charge()` with a deterministic idempotency key: `order-${order.id}`. The mock provider stores the key and replays the original charge on retry.",
      "In a second small transaction, update the order to `paid`, store the `paymentId`, and insert an `order.paid` outbox event.",
      "Implement `OutboxWorker` as a `@Cron` job that runs every few seconds. It claims a small batch of pending events (`SELECT ... FOR UPDATE SKIP LOCKED`), sends the side effect (email for `order.created`, event publish for `order.paid`), then marks the event as sent. Handle crash safety by resetting stuck `claimed` rows back to `pending` after a timeout.",
      "Implement a `MailerService` stub that logs the email it would send. Ensure the same `orderId` never produces two confirmation emails even if the outbox event is processed twice (store the sent `(orderId, 'order.created')` in a `sent_emails` table with a unique constraint).",
      "Implement `ReconciliationJob` as a nightly `@Cron`. It fetches all charges from the mock provider for the last 24 hours and checks that each has a matching local order. If a charge exists without a matching order, insert a repaired order with status `paid_reconciled` and log the event.",
      "Add a `CleanupCron` that deletes idempotency records past their `expiresAt` (default TTL: 24 hours).",
      "Add Swagger decorators: `@ApiHeader({ name: 'Idempotency-Key', required: true, ... })` on the `POST /orders` endpoint. Document all possible responses: `201 Created` with an example order, `400 Bad Request`, `409 Conflict` with `Retry-After`, `422 Unprocessable Entity`, `500 Internal Server Error`.",
      "Write a client-side retry helper in a test file that (a) generates a UUID key, (b) sends `POST /orders`, (c) on 5xx or 409 retries with the same key using exponential backoff with jitter, and (d) stops on 2xx or non-retryable 4xx.",
      "Write e2e tests that cover: first request creates the order and charge; identical retry returns the same order id with `Idempotent-Replay: true`; concurrent duplicate requests produce exactly one order; same key with different body returns 422; missing key returns 400; two simultaneous orders for the last stock item produce one success and one 409; the outbox worker sends exactly one email per order; the reconciliation job repairs a simulated drift (charge recorded on provider but not locally).",
    ],
    acceptance: [
      "`POST /orders` without an `Idempotency-Key` returns `400 Bad Request`.",
      "`POST /orders` with a new key creates the order, decrements stock, charges the customer once, and returns `201 Created` with the order.",
      "Replaying the exact same request with the same key returns the original response with `Idempotent-Replay: true` and does NOT create a second order or charge.",
      "Two simultaneous requests with the same key and body result in exactly one order and one charge.",
      "Two simultaneous requests with the same key but different bodies: one succeeds, the other returns `422 Unprocessable Entity`.",
      "Two simultaneous orders for the last unit of stock: one succeeds, the other returns `409 Conflict` due to the row lock and stock check.",
      "The outbox worker sends exactly one confirmation email per order, even after multiple worker restarts.",
      "A simulated 'charge on provider but no local order' scenario is repaired by the reconciliation job within one cycle.",
      "Idempotency records past their TTL are removed by the cleanup cron.",
      "The Swagger docs show the `Idempotency-Key` header on `POST /orders` and document all responses including `409` and `422`.",
      "All e2e tests pass.",
    ],
    stretch: [
      "Add a `POST /refunds` endpoint that refunds a payment. It must use its own idempotency key scheme (`refund-${refundRequestId}`) and call the mock provider with a stable key derived from the refund request id.",
      "Add webhook handling for `payment.succeeded` from the mock provider. Ensure the webhook handler is itself idempotent by storing received webhook ids in a `webhook_events` table with a unique constraint, and rejecting duplicates with a `200 OK` (so the provider stops retrying).",
      "Replace the in-memory mock provider with a realistic local fake that supports network failure injection (e.g. `FAIL_ONCE` env var) and verify that the reconciliation job repairs a charge that succeeded on the provider but failed to be recorded locally.",
      "Implement distributed outbox processing with two worker instances using `FOR UPDATE SKIP LOCKED` so they never process the same event, and verify the behavior with a concurrent test.",
      "Add Prometheus metrics: `idempotent_requests_total{result=\"new|replay|conflict|mismatch\"}`, `outbox_events_pending`, `reconciliation_repairs_total`.",
      "Document a client SDK retry policy in a Markdown file: key generation, reuse across retries, exponential backoff with jitter, respect for `Retry-After`, and behavior on each status code. Generate an OpenAPI annotation (`@ApiHeader` with a description) that points to this document.",
      "Add a load test (k6 or autocannon) that fires 500 concurrent duplicate requests for the same order and verifies that exactly one order and one charge exist afterward. Report p95/p99 latency and confirm the idempotency store did not become a bottleneck.",
    ],
  },
};
