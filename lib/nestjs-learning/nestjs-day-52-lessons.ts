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
      explanation: `An operation is idempotent when repeating the same operation produces the same intended result as performing it once. HTTP defines GET, PUT, and DELETE as idempotent by their intended semantics, although server implementations can still contain bugs or side effects.

The difficult cases are usually POST operations that create something or trigger an external side effect. Imagine a client creates a payment and the server successfully charges the card, but the network connection breaks before the response reaches the client. The client cannot tell whether the operation failed or merely lost its response. Retrying the request without protection can create a second charge.

Idempotency gives the client a way to say, "This request is the same logical operation as the previous request with this key." The server stores the key and enough information to safely recognize a duplicate. A repeated request can then return the original result rather than performing the operation again.

Idempotency does not mean that every request should be made idempotent automatically. It is especially valuable for operations where duplicate side effects are costly or dangerous: payments, order creation, subscription changes, message publishing, and external API calls.`,
      diagram: `Client
  |
  | POST /payments
  | Idempotency-Key: pay_123
  v
API
  |
  +---- key exists? ---- yes ----> return stored result
  |                                  |
  no                                 no
  |                                  |
  v                                  |
Perform operation <------------------+
  |
  v
Store key + result
  |
  v
Return result`,
      codeExample: { title: "Example", code: `// Request
POST /payments
Idempotency-Key: 8c2d-payment-001

{
  "orderId": "order_123",
  "amount": 5000,
  "currency": "USD"
}

// First request
201 Created
{
  "id": "payment_789",
  "status": "succeeded"
}

// Retry with the same key
201 Created
{
  "id": "payment_789",
  "status": "succeeded"
}

// The payment should not be charged twice.` },
      keyTakeaways: [
        "Idempotency protects side-effecting operations from duplicate execution.",
        "A retry can happen even when the original operation succeeded.",
        "The idempotency key represents one logical client operation.",
        "The server must persist enough state to recognize and safely replay a completed operation."
      ],
      commonMistakes: [
        "Assuming a timeout means the original operation did not happen.",
        "Generating a new idempotency key for every retry.",
        "Using idempotency only in the controller without protecting the actual side effect.",
        "Treating all POST endpoints as automatically safe to retry."
      ],
      quiz: [
        {
          question: "Why is idempotency particularly important for payments?",
          options: [
            "Payments cannot return HTTP responses",
            "A retry after an uncertain network failure could otherwise charge the customer twice",
            "Payments are always GET requests",
            "It eliminates authentication"
          ],
          correctIndex: 1,
          explanation: "The server may have completed the payment even though the client did not receive the response."
        }
      ]
    },
    {
      id: "day-52-lesson-2",
      title: "Idempotency Keys and Storage",
      durationMinutes: 22,
      explanation: `An idempotency key is normally supplied by the client in a request header. The server should associate that key with the authenticated actor, operation, and request semantics. A key should not accidentally allow one user to replay another user's operation.

A robust idempotency record can contain the key, user or tenant identifier, endpoint or operation name, request fingerprint, processing status, response status, response body, and timestamps. The database should enforce uniqueness for the appropriate scope.

There is an important race condition: two identical requests can arrive at almost exactly the same time. If both check for the key before either creates the record, both could continue. A unique database constraint, transaction, lock, or atomic Redis operation can close this race.

The system also needs an expiration policy. Idempotency records do not necessarily need to live forever. The retention period should match the business risk and the period during which clients may retry.`,
      diagram: `POST /payments
Idempotency-Key: abc
User: 42
        |
        v
+---------------------------+
| Idempotency Store         |
| key + user + operation    |
| status + response + TTL   |
+---------------------------+
        |
   +----+----+
   |         |
missing     exists
   |         |
execute    replay
   |
store result`,
      codeExample: { title: "Example", code: `interface IdempotencyRecord {
  key: string;
  userId: string;
  operation: string;
  requestHash: string;
  status: "PROCESSING" | "COMPLETED";
  responseStatus?: number;
  responseBody?: unknown;
  expiresAt: Date;
}

// Important database constraint:
// UNIQUE(user_id, operation, key)

// A retry using the same key but different request data
// should not silently reuse the first result.
// It should normally fail with a conflict such as
// IDEMPOTENCY_KEY_REUSED.` },
      keyTakeaways: [
        "Scope idempotency keys to the correct user, tenant, and operation.",
        "Protect the check-and-create path against concurrent requests.",
        "Store the original response when replaying the completed operation is required.",
        "Expire old keys according to the business retry window."
      ],
      commonMistakes: [
        "Using only the raw key globally across all users.",
        "Ignoring request-body changes when the same key is reused incorrectly.",
        "Checking for an existing key and inserting separately without concurrency protection.",
        "Keeping records forever without a retention strategy."
      ],
      quiz: [
        {
          question: "What is the purpose of a request fingerprint in an idempotency record?",
          options: [
            "To encrypt the user's password",
            "To detect reuse of the same key with different request data",
            "To replace authentication",
            "To generate random UUIDs"
          ],
          correctIndex: 1,
          explanation: "A fingerprint can detect that the same key is being reused for a materially different operation."
        }
      ]
    },
    {
      id: "day-52-lesson-3",
      title: "Retry-Safe APIs and Payment Operations",
      durationMinutes: 22,
      explanation: `Retry safety requires more than storing an idempotency key. The actual workflow must be designed so that external side effects are not duplicated. For example, an application may create a payment record, call a payment provider, receive success, and then crash before marking the local record as completed.

Distributed systems often require explicit state machines and reconciliation. A payment can move through states such as CREATED, PROCESSING, SUCCEEDED, FAILED, or UNKNOWN. UNKNOWN is important because a timeout can leave the local application uncertain about what happened at the provider.

For external APIs, prefer providers that support idempotency themselves. If your application calls a payment provider with an idempotency key, use a deterministic key or a safely stored key so retries at your service do not become new operations at the provider.

Idempotency should be combined with transactional database design, unique constraints, provider-side idempotency, and reconciliation or webhook handling. No single mechanism solves every distributed failure mode.`,
      diagram: `Client
  |
  v
Your API
  |
  +--> Local payment state
  |
  +--> Provider API
          |
       success
          |
          v
     Provider result
          |
          v
    Local state update

If response is lost:
Client retries
     |
     v
Same idempotency key
     |
     v
Reuse/reconcile existing operation`,
      codeExample: { title: "Example", code: `async function createPayment(command: CreatePaymentCommand) {
  const existing = await idempotency.find(command.userId, command.key);

  if (existing?.status === "COMPLETED") {
    return existing.response;
  }

  const payment = await payments.createIfMissing({
    userId: command.userId,
    orderId: command.orderId,
    idempotencyKey: command.key,
    status: "PROCESSING",
  });

  const providerKey = \`payment:\${payment.id}\`;

  const result = await paymentProvider.charge({
    amount: command.amount,
    providerIdempotencyKey: providerKey,
  });

  await payments.markSucceeded(payment.id, result.providerId);

  return {
    id: payment.id,
    status: "succeeded",
  };
}` },
      keyTakeaways: [
        "Retries must be safe at every important side-effect boundary.",
        "Payment state machines make uncertain outcomes explicit.",
        "Provider-side idempotency is valuable when external payment systems support it.",
        "Webhooks and reconciliation can resolve operations whose final result is initially unknown."
      ],
      commonMistakes: [
        "Treating a provider timeout as a definite failure.",
        "Charging again simply because the first response was lost.",
        "Relying on an application memory cache for durable payment idempotency.",
        "Failing to reconcile PROCESSING or UNKNOWN payments."
      ],
      quiz: [
        {
          question: "A payment provider times out after accepting the charge. What should the application assume?",
          options: [
            "The payment definitely failed",
            "The payment definitely succeeded",
            "The result may be unknown and should be reconciled safely",
            "The client should be charged again"
          ],
          correctIndex: 2,
          explanation: "A timeout describes the communication result, not necessarily the provider's processing result."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What does an idempotency key primarily identify?",
      options: [
        "A user's password",
        "A single logical operation that may be retried",
        "A database table",
        "An HTTP status code"
      ],
      correctIndex: 1,
      explanation: "The key lets the server recognize retries of the same logical operation."
    },
    {
      question: "What should happen when the same idempotency key is reused with materially different request data?",
      options: [
        "Silently execute the second operation",
        "Usually reject it as a key conflict/reuse error",
        "Delete the first result",
        "Ignore authentication"
      ],
      correctIndex: 1,
      explanation: "Reusing a key for a different operation can cause incorrect behavior and should be rejected."
    },
    {
      question: "Which mechanism helps prevent two simultaneous first requests from both creating an idempotency record?",
      options: [
        "A unique constraint or atomic concurrency control",
        "A longer error message",
        "A frontend spinner",
        "A GET request"
      ],
      correctIndex: 0,
      explanation: "Concurrency-safe storage is required to close the check-then-insert race."
    }
  ],
  project: {
    name: "Retry-Safe Payment API",
    goal: "Build an idempotent payment endpoint that safely handles client retries and concurrent duplicate requests.",
    brief: "Create POST /payments with an Idempotency-Key header. Store idempotency state durably, prevent concurrent duplicate processing, replay completed responses, reject conflicting key reuse, and model uncertain payment states.",
    steps: [
      "Require an Idempotency-Key header for payment creation.",
      "Create an idempotency_records table with a uniqueness constraint.",
      "Scope keys to the authenticated user and operation.",
      "Store a request fingerprint.",
      "Handle PROCESSING and COMPLETED states.",
      "Prevent concurrent requests from creating duplicate payments.",
      "Persist the original successful response for replay.",
      "Return a conflict when the same key is reused with different input.",
      "Simulate a payment-provider timeout.",
      "Add reconciliation for payments left in PROCESSING or UNKNOWN state.",
      "Write concurrent-request tests."
    ],
    acceptance: [
      "Repeated requests with the same valid key produce one payment.",
      "The original response can be safely replayed.",
      "Concurrent duplicate requests do not create duplicate side effects.",
      "Conflicting key reuse is rejected.",
      "Provider uncertainty does not automatically trigger a second charge.",
      "Idempotency records have a documented retention policy."
    ],
    stretch: [
      "Use Redis for fast idempotency coordination while keeping durable database state.",
      "Add provider-side idempotency.",
      "Add webhook-based reconciliation.",
      "Add metrics for duplicate retries and unknown payment states."
    ]
  }
};
